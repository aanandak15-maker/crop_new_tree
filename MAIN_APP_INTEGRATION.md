# 🌾 Crop Guide - Main App Integration Guide

## Overview

This guide explains how to integrate the Crop Guide as a feature module into your main application repository, making it a seamless part of your existing codebase.

## 🎯 Integration Benefits

✅ **Single Repository**: Everything in one place  
✅ **Shared Dependencies**: No duplicate packages  
✅ **Unified Build**: Single build process  
✅ **Shared Components**: Reuse UI components  
✅ **Common Authentication**: Single auth system  
✅ **Easier Deployment**: Deploy as one application  

## 🚀 Quick Integration

### Option 1: Automated Migration (Recommended)

```bash
# Run the migration script from your main app directory
node /path/to/crop-guide/migration-script.js /path/to/main-app /path/to/crop-guide

# Install new dependencies
npm install

# Run database migrations (if using Supabase)
npm run migrate:crop-guide
```

### Option 2: Manual Integration

1. **Copy Feature Module**:
   ```bash
   cp -r crop-guide/src/* main-app/src/features/crop-guide/
   ```

2. **Update Routes** in your main `App.tsx`:
   ```tsx
   import { CropDashboard, CropProfile, CropAdmin } from '@/features/crop-guide';

   // Add to your router
   <Route path="/crops" element={<CropDashboard />} />
   <Route path="/crops/:cropName" element={<CropProfile />} />
   <Route path="/crops/admin" element={<CropAdmin />} />
   ```

3. **Update Navigation**:
   ```tsx
   // Add to your main navigation
   <NavItem to="/crops" icon={<Leaf />}>
     Crop Guide
   </NavItem>
   ```

## 📁 Final Structure

```
main-app/
├── src/
│   ├── features/
│   │   ├── crop-guide/           # ← Integrated Module
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── data/
│   │   │   ├── services/
│   │   │   └── index.ts
│   │   ├── user-management/
│   │   └── other-features/
│   ├── shared/                   # Shared across features
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## 🔧 Usage in Main App

### Basic Usage

```tsx
// In your main app component
import { useCropGuideIntegration } from '@/features/crop-guide/hooks';

function MainApp() {
  const { 
    openCropGuide, 
    selectCrop, 
    isInCropGuide 
  } = useCropGuideIntegration();

  return (
    <div>
      {/* Your main app content */}
      
      {/* Button to open crop guide */}
      <Button onClick={() => openCropGuide()}>
        🌾 Explore Crops
      </Button>
      
      {/* Button to go to specific crop */}
      <Button onClick={() => selectCrop('Wheat')}>
        View Wheat Details
      </Button>
      
      {/* Conditional rendering based on location */}
      {isInCropGuide && (
        <div className="crop-guide-indicator">
          You're in the Crop Guide
        </div>
      )}
    </div>
  );
}
```

### Navigation Integration

```tsx
// In your main navigation component
import { useCropGuideIntegration } from '@/features/crop-guide/hooks';

function MainNavigation() {
  const { isInCropGuide, breadcrumbs } = useCropGuideIntegration();

  return (
    <nav>
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />
      
      {/* Navigation items */}
      <NavItem 
        to="/crops" 
        active={isInCropGuide}
        icon={<Leaf />}
      >
        Crop Guide
      </NavItem>
    </nav>
  );
}
```

### Data Integration

```tsx
// Listen to crop selection events
useEffect(() => {
  const handleCropSelected = (event) => {
    const cropData = event.detail;
    console.log('Crop selected:', cropData);
    
    // Update main app state
    setSelectedCropInMainApp(cropData);
  };

  window.addEventListener('cropDataSelected', handleCropSelected);
  
  return () => {
    window.removeEventListener('cropDataSelected', handleCropSelected);
  };
}, []);
```

## 🗄️ Database Integration

### Supabase Setup

1. **Copy Migrations**:
   ```bash
   cp -r crop-guide/supabase/migrations/* main-app/database/migrations/
   ```

2. **Run Migrations**:
   ```bash
   supabase db push
   ```

3. **Environment Variables**:
   ```env
   # Add to your .env file
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### Database Tables Added

- `crops` - Main crop information
- `varieties` - Crop varieties
- `pests` & `diseases` - Agricultural threats
- `crop_pests` & `crop_diseases` - Relationships
- `user_profiles` - User management (if not already present)

## 🎨 UI Integration

### Shared Components

The crop guide will use your existing UI components if available:

```tsx
// The crop guide automatically adapts to your design system
// Import your existing components in crop-guide/components/ui/
```

### Theming

```tsx
// Customize crop guide appearance
import { cropGuideConfig } from '@/features/crop-guide';

cropGuideConfig.theme = {
  primaryColor: 'your-brand-color',
  fontFamily: 'your-font-family',
  borderRadius: 'your-border-radius'
};
```

## 🔐 Authentication Integration

If you have existing authentication:

```tsx
// Share auth context with crop guide
import { AuthProvider } from '@/features/crop-guide';
import { useMainAppAuth } from '@/hooks/useAuth';

function App() {
  const mainAuth = useMainAppAuth();
  
  return (
    <AuthProvider initialAuth={mainAuth}>
      {/* Your app */}
    </AuthProvider>
  );
}
```

## 📦 Build Configuration

Update your `vite.config.ts`:

```ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/features/crop-guide': path.resolve(__dirname, './src/features/crop-guide')
    }
  },
  // Optimize chunks to include crop guide
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'crop-guide': ['./src/features/crop-guide/index.ts'],
          'crop-guide-admin': ['./src/features/crop-guide/components/admin/index.ts']
        }
      }
    }
  }
});
```

## 🚢 Deployment

The crop guide is now part of your main app deployment:

```bash
# Single build command
npm run build

# Single deployment
npm run deploy
```

## 🔄 Future Updates

To update the crop guide:

1. Replace files in `src/features/crop-guide/`
2. Run `npm install` if dependencies changed
3. Run database migrations if schema changed
4. Deploy as usual

## 🆘 Troubleshooting

### Common Issues

1. **Import Errors**: Update import paths to use `@/features/crop-guide/`
2. **Duplicate Dependencies**: Remove duplicates from package.json
3. **Route Conflicts**: Ensure `/crops` routes don't conflict
4. **Build Errors**: Check alias configuration in vite.config.ts

### Support

For integration issues:
1. Check the migration logs
2. Verify all files were copied correctly
3. Ensure environment variables are set
4. Test database connectivity

---

🎉 **You're done!** The crop guide is now seamlessly integrated into your main application as a feature module.
