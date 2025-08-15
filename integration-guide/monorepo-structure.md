# Monorepo Integration Structure

## Target Main App Structure:
```
main-app/
├── src/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── user-management/
│   │   ├── crop-guide/          # ← Crop Guide Module
│   │   │   ├── components/
│   │   │   │   ├── admin/
│   │   │   │   ├── ui/
│   │   │   │   ├── CropDashboard.tsx
│   │   │   │   ├── CropProfile.tsx
│   │   │   │   └── Navigation.tsx
│   │   │   ├── contexts/
│   │   │   │   └── AuthContext.tsx
│   │   │   ├── data/
│   │   │   │   ├── cropData.ts
│   │   │   │   └── comprehensiveWheatData.ts
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   │   └── geminiService.ts
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── index.ts         # Module exports
│   │   └── other-features/
│   ├── shared/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   ├── integrations/
│   │   ├── supabase/
│   │   └── other-services/
│   ├── App.tsx
│   └── main.tsx
├── public/
└── package.json
```

## Integration Benefits:
✅ Single codebase
✅ Shared dependencies  
✅ Unified build process
✅ Shared authentication
✅ Common UI components
✅ Easier maintenance
