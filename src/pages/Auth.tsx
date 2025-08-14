import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Shield, Users, CheckCircle } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSwitchToRegister = () => {
    setIsLogin(false);
    setShowSuccess(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
    setShowSuccess(false);
  };

  const handleRegisterSuccess = () => {
    setShowSuccess(true);
  };

  const handleLoginSuccess = () => {
    // Redirect to admin page or dashboard
    window.location.href = '/admin';
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Account Created Successfully!
            </CardTitle>
            <CardDescription className="text-green-600">
              Your account has been created and is pending admin approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>What happens next?</strong><br />
                • Admin will review your application<br />
                • You'll receive an email when approved<br />
                • You can then sign in and access the system
              </p>
            </div>
            <Button onClick={handleSwitchToLogin} className="w-full">
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Features */}
        <div className="hidden lg:block space-y-6">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <Leaf className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Crop Tree Explorer</h1>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Advanced crop management system with AI-powered insights
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Access</h3>
                <p className="text-gray-600">Role-based permissions with admin approval system</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">User Management</h3>
                <p className="text-gray-600">Comprehensive user roles and approval workflow</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Admin Control</h3>
                <p className="text-gray-600">Manual approval ensures only authorized users gain access</p>
              </div>
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Available Roles:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span><strong>User:</strong> Basic crop viewing and search</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span><strong>Moderator:</strong> Edit crops and manage content</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                <span><strong>Admin:</strong> Full system access and user management</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="flex items-center justify-center">
          {isLogin ? (
            <LoginForm
              onSwitchToRegister={handleSwitchToRegister}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <RegisterForm
              onSwitchToLogin={handleSwitchToLogin}
              onRegisterSuccess={handleRegisterSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
