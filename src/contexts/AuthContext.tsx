import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
// Quiet logs by default; enable by setting VITE_ENABLE_DEBUG=true
const __DEBUG__ = import.meta.env.VITE_ENABLE_DEBUG === 'true';
if (!__DEBUG__) {
  const noop = (..._args: any[]) => {};
  // Suppress noisy informational logs from this session
  console.log = noop;
  console.warn = noop;
}

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  organization: string;
  role: string; // Changed from union type to string to match database
  is_approved: boolean;
  created_at: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthContext useEffect started (no-timeout build)');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('👤 Initial user found, fetching profile...');
        fetchUserProfile(session.user.id, session);
      } else {
        console.log('❌ No initial session found, setting loading to false');
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change event:', event, 'user:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 User authenticated, fetching profile...');
        await fetchUserProfile(session.user.id, session);
      } else {
        console.log('❌ User signed out, clearing profile');
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Realtime subscribe to the signed-in user's profile so approval changes apply instantly
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`user_profile_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updated = (payload.new || payload.old) as Partial<UserProfile> | null;
          if (updated && updated.user_id === user.id) {
            console.log('🔔 Realtime profile update received');
            // Refetch to ensure we have the latest row (and correct types)
            fetchUserProfile(user.id, session);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const fetchUserProfile = async (userId: string, currentSession?: Session | null) => {
    try {
      console.log('🔍 fetchUserProfile called with userId:', userId);
      
      // Use passed session or fall back to state
      const activeSession = currentSession || session;
      
      // Wait for auth context to be properly initialized
      if (!activeSession) {
        console.log('❌ No active session, returning early');
        return; // Don't fetch profile until auth is ready
      }
      
      console.log('✅ Fetching profile from Supabase...');
      console.log('🔑 Using session:', activeSession.access_token ? 'Has token' : 'No token');
      
      // Try to fetch profile with a soft timeout; if it stalls, we'll upsert a pending profile
      const fetchPromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('profile-select-timeout')), 5000)
      );

      let data: any | null = null;
      let error: any | null = null;
      try {
        const res: any = await Promise.race([fetchPromise, timeoutPromise]);
        ({ data, error } = res || {});
      } catch (e) {
        if ((e as Error).message === 'profile-select-timeout') {
          console.warn('⏳ Profile select timed out, proceeding to upsert pending profile');
        } else {
          throw e;
        }
      }

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        console.error('❌ Error details:', {
          message: (error as any).message,
          code: (error as any).code,
          details: (error as any).details,
          hint: (error as any).hint
        });
        setProfile(null);
        return;
      }

      if (!data) {
        // No profile yet → create one from auth metadata so admin can approve
        console.log('ℹ️ No profile found, creating a pending profile...');
        const metadata = activeSession.user.user_metadata || {};
        const pendingProfile = {
          user_id: userId,
          email: activeSession.user.email ?? '',
          full_name: metadata.full_name ?? '',
          organization: metadata.organization ?? '',
          role: metadata.role ?? 'user',
          is_approved: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Upsert ensures we don't duplicate if it exists server-side already
        // Insert only if missing; do NOT overwrite approval status
        const insertPromise = supabase
          .from('user_profiles')
          .insert(pendingProfile)
          .select('*')
          .single();

        const upsertTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('profile-upsert-timeout')), 5000)
        );

        try {
          const { data: created, error: insertError } = (await Promise.race([
            insertPromise,
            upsertTimeout,
          ])) as any;

          if (insertError) {
            // If conflict or insert failure, try to fetch again (it may already exist)
            console.warn('⚠️ Auto-create profile failed; attempting re-fetch', insertError);
            const { data: refetched } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();
            if (refetched) {
              console.log('✅ Profile found on re-fetch:', refetched);
              setProfile(refetched as unknown as UserProfile);
              return;
            }
            setProfile(null);
            return;
          }

          console.log('✅ Auto-created pending profile:', created);
          setProfile(created as unknown as UserProfile);
          return;
        } catch (e) {
          if ((e as Error).message === 'profile-upsert-timeout') {
            console.warn('⏳ Profile upsert timed out; falling back to in-memory pending profile');
            setProfile({
              id: 'local-pending',
              user_id: userId,
              email: activeSession.user.email ?? '',
              full_name: pendingProfile.full_name,
              organization: pendingProfile.organization,
              role: pendingProfile.role,
              is_approved: false,
              created_at: pendingProfile.created_at,
              updated_at: pendingProfile.updated_at,
            });
            return;
          }
          throw e;
        }
      }

      console.log('✅ Profile fetched successfully:', data);
      setProfile(data as unknown as UserProfile);
      
    } catch (error) {
      console.error('❌ Exception in fetchUserProfile:', error);
      setProfile(null);
    } finally {
      console.log('✅ Setting loading to false');
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
