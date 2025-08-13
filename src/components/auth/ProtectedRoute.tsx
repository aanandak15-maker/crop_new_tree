import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireApproval?: boolean;
  requiredRole?: 'user' | 'moderator' | 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireApproval = true,
  requiredRole 
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // No profile found
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">
            Your user profile could not be found. Please contact an administrator.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Check if approval is required and user is not approved
  if (requireApproval && !profile.is_approved) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Account Pending Approval</h2>
          <p className="text-muted-foreground mb-4">
            Your account is currently pending admin approval. You'll receive an email notification once approved.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Account Details:</strong><br />
              Name: {profile.full_name}<br />
              Email: {profile.email}<br />
              Organization: {profile.organization}<br />
              Role: {profile.role}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check role requirements
  if (requiredRole) {
    const roleHierarchy = {
      'user': 1,
      'moderator': 2,
      'admin': 3
    };

    const userRoleLevel = roleHierarchy[profile.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚫</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have sufficient permissions to access this page. Required role: {requiredRole}
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Your Role:</strong> {profile.role}<br />
                <strong>Required Role:</strong> {requiredRole}
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
