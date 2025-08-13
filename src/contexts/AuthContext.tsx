import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
    console.log('🔄 AuthContext useEffect started');
    
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
      
      // Simple direct fetch with timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout after 3 seconds')), 3000);
      });

      const fetchPromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      const result = await Promise.race([fetchPromise, timeoutPromise]);
      const { data, error } = result;

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        console.error('❌ Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        setProfile(null);
      } else {
        console.log('✅ Profile fetched successfully:', data);
        setProfile(data);
      }
      
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
