// Crop Guide Feature Module Exports
// This file exports all the components and functionality needed by the main app

// Main Components
export { default as CropDashboard } from '../components/EnhancedCropDashboard';
export { default as CropProfile } from '../components/SimpleCropProfile';
export { default as CropNavigation } from '../components/IntegratedNavigation';

// Admin Components
export { default as CropAdmin } from '../pages/Admin';
export { default as CropManagement } from '../components/admin/EnhancedCropManagement';
export { default as VarietyManagement } from '../components/admin/VarietyManagement';
export { default as PestManagement } from '../components/admin/PestManagement';
export { default as DiseaseManagement } from '../components/admin/DiseaseManagement';
export { default as AIDocumentProcessor } from '../components/admin/ai-doc-processor';

// Auth Components
export { default as CropAuth } from '../pages/Auth';
export { LoginForm } from '../components/auth/LoginForm';
export { RegisterForm } from '../components/auth/RegisterForm';
export { ProtectedRoute } from '../components/auth/ProtectedRoute';

// Contexts
export { AuthProvider, useAuth } from '../contexts/AuthContext';

// Data & Services
export * from '../data/cropData';
export * from '../data/comprehensiveWheatData';
export { default as GeminiService } from '../services/geminiService';

// Types
export type { CropData, CropVariety } from '../data/cropData';
export type { ExtractedCropData } from '../services/geminiService';

// Utilities
export * from '../utils/cacheManager';

// Hooks
export { useToast } from '../hooks/use-toast';
export { default as usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

// Routes Configuration for Main App
export const cropGuideRoutes = [
  {
    path: '/crops',
    component: 'CropDashboard',
    title: 'Crop Dashboard',
    protected: false
  },
  {
    path: '/crops/:cropName',
    component: 'CropProfile', 
    title: 'Crop Profile',
    protected: false
  },
  {
    path: '/crops/admin',
    component: 'CropAdmin',
    title: 'Crop Administration',
    protected: true,
    roles: ['admin', 'moderator']
  },
  {
    path: '/crops/auth',
    component: 'CropAuth',
    title: 'Crop Guide Authentication',
    protected: false
  }
];

// Feature Configuration
export const cropGuideConfig = {
  name: 'Crop Guide',
  version: '2.0.0',
  description: 'Comprehensive crop management and exploration system',
  features: [
    'Crop Database',
    'Variety Management', 
    'AI Document Processing',
    'Admin Panel',
    'User Authentication',
    'Location-based Recommendations'
  ],
  requiredPermissions: [
    'crops:read',
    'crops:write',
    'admin:access'
  ],
  supabaseTables: [
    'crops',
    'varieties', 
    'pests',
    'diseases',
    'crop_pests',
    'crop_diseases',
    'user_profiles'
  ]
};
