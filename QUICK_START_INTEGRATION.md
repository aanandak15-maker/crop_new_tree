# 🚀 Quick Start: Integrate Crop Guide into Main App

## Step 1: Prepare Your Main App Structure

In your main app, create this structure:

```bash
mkdir -p src/features/crop-guide
mkdir -p src/shared/components
mkdir -p src/shared/hooks
mkdir -p src/shared/utils
```

## Step 2: Copy Essential Files

From this crop-guide repo, copy these key files to your main app:

### Core Components (copy to main-app/src/features/crop-guide/):
```
src/components/EnhancedCropDashboard.tsx
src/components/SimpleCropProfile.tsx  
src/components/admin/
src/data/cropData.ts
src/services/geminiService.ts
src/integrations/supabase/
src/hooks/
```

### Shared UI (copy to main-app/src/shared/components/):
```
src/components/ui/ (if not already in main app)
```

## Step 3: Update Main App Router

Add these routes to your main App.tsx:

```tsx
import { CropDashboard, CropProfile, CropAdmin } from '@/features/crop-guide';

// Add to your Routes:
<Route path="/crops" element={<CropDashboard />} />
<Route path="/crops/:cropName" element={<CropProfile />} />
<Route path="/crops/admin" element={<CropAdmin />} />
```

## Step 4: Add Navigation Button

In your main navigation component:

```tsx
<NavLink to="/crops" className="nav-button">
  🌾 Crop Guide
</NavLink>
```

## Step 5: Install Dependencies

Add these to your main app's package.json:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.53.0",
    "@xyflow/react": "^12.8.2",
    "recharts": "^2.12.7"
  }
}
```

## Step 6: Environment Variables

Add to your main app's .env:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 🎯 Result

- User clicks "Crop Guide" → goes to /crops
- Feels like same app, but it's the complete crop system
- You update by replacing files in features/crop-guide/
- Single build, single deployment

## ⚡ Want me to help you do this step-by-step?

I can help you:
1. Generate the exact file copy commands
2. Create the integration files  
3. Set up the routing
4. Test the integration

Just let me know your main app structure and I'll customize the instructions!
