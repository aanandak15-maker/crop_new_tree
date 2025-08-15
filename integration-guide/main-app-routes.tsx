// Main App Router with Integrated Crop Guide
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/features/crop-guide';

// Main App Pages
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage'; 
import UserManagement from '@/pages/UserManagement';
import SettingsPage from '@/pages/SettingsPage';

// Crop Guide Feature Pages
import { 
  CropDashboard, 
  CropProfile, 
  CropAdmin, 
  CropAuth 
} from '@/features/crop-guide';

// Layout Components
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main App Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="settings" element={<SettingsPage />} />
        
        {/* Crop Guide Feature Routes - Integrated seamlessly */}
        <Route path="crops">
          <Route index element={<CropDashboard />} />
          <Route path=":cropName" element={<CropProfile />} />
          <Route 
            path="admin/*" 
            element={
              <ProtectedRoute requireApproval={true} requiredRole="user">
                <CropAdmin />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Route>

      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="crops" element={<CropAuth />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
