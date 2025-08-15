#!/usr/bin/env node

/**
 * Migration Script: Integrate Crop Guide into Main App
 * 
 * This script helps move the crop guide files into your main application
 * Run this from your main app root directory
 */

const fs = require('fs');
const path = require('path');

class CropGuideMigration {
  constructor(mainAppPath, cropGuidePath) {
    this.mainAppPath = mainAppPath;
    this.cropGuidePath = cropGuidePath;
    this.featuresDir = path.join(mainAppPath, 'src', 'features', 'crop-guide');
  }

  async migrate() {
    console.log('🌾 Starting Crop Guide Migration...\n');

    try {
      // Step 1: Create feature directory structure
      await this.createFeatureStructure();

      // Step 2: Copy components
      await this.copyComponents();

      // Step 3: Copy data and services
      await this.copyDataAndServices();

      // Step 4: Copy hooks and utilities
      await this.copyHooksAndUtils();

      // Step 5: Update imports
      await this.updateImports();

      // Step 6: Copy database migrations
      await this.copyDatabaseMigrations();

      // Step 7: Update package.json
      await this.updatePackageJson();

      // Step 8: Create integration files
      await this.createIntegrationFiles();

      console.log('\n✅ Migration completed successfully!');
      console.log('\n📋 Next Steps:');
      console.log('1. Run npm install to install new dependencies');
      console.log('2. Update your main App.tsx to include crop guide routes');
      console.log('3. Set up Supabase environment variables');
      console.log('4. Run database migrations');
      console.log('5. Test the integrated crop guide features');

    } catch (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
  }

  async createFeatureStructure() {
    console.log('📁 Creating feature directory structure...');
    
    const dirs = [
      this.featuresDir,
      path.join(this.featuresDir, 'components'),
      path.join(this.featuresDir, 'components', 'admin'),
      path.join(this.featuresDir, 'components', 'ui'),
      path.join(this.featuresDir, 'components', 'auth'),
      path.join(this.featuresDir, 'contexts'),
      path.join(this.featuresDir, 'data'),
      path.join(this.featuresDir, 'hooks'),
      path.join(this.featuresDir, 'services'),
      path.join(this.featuresDir, 'types'),
      path.join(this.featuresDir, 'utils'),
      path.join(this.featuresDir, 'pages')
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`  ✓ Created ${dir}`);
      }
    }
  }

  async copyComponents() {
    console.log('\n🔧 Copying components...');
    
    const componentMappings = [
      // Main components
      { from: 'src/components/EnhancedCropDashboard.tsx', to: 'components/EnhancedCropDashboard.tsx' },
      { from: 'src/components/SimpleCropProfile.tsx', to: 'components/SimpleCropProfile.tsx' },
      { from: 'src/components/Navigation.tsx', to: 'components/Navigation.tsx' },
      { from: 'src/components/IntegratedNavigation.tsx', to: 'components/IntegratedNavigation.tsx' },
      
      // Auth components
      { from: 'src/components/auth', to: 'components/auth' },
      
      // Admin components
      { from: 'src/components/admin', to: 'components/admin' },
      
      // UI components (if not already in main app)
      { from: 'src/components/ui', to: 'components/ui' },
      
      // Pages
      { from: 'src/pages/Admin.tsx', to: 'pages/Admin.tsx' },
      { from: 'src/pages/Auth.tsx', to: 'pages/Auth.tsx' },
      { from: 'src/pages/Index.tsx', to: 'pages/Index.tsx' }
    ];

    for (const mapping of componentMappings) {
      await this.copyFileOrDir(mapping.from, mapping.to);
    }
  }

  async copyDataAndServices() {
    console.log('\n📊 Copying data and services...');
    
    const dataMappings = [
      { from: 'src/data', to: 'data' },
      { from: 'src/services', to: 'services' },
      { from: 'src/integrations', to: 'integrations' },
      { from: 'src/contexts', to: 'contexts' },
      { from: 'src/types', to: 'types' }
    ];

    for (const mapping of dataMappings) {
      await this.copyFileOrDir(mapping.from, mapping.to);
    }
  }

  async copyHooksAndUtils() {
    console.log('\n🪝 Copying hooks and utilities...');
    
    const utilMappings = [
      { from: 'src/hooks', to: 'hooks' },
      { from: 'src/utils', to: 'utils' },
      { from: 'src/lib', to: 'lib' }
    ];

    for (const mapping of utilMappings) {
      await this.copyFileOrDir(mapping.from, mapping.to);
    }
  }

  async copyFileOrDir(fromPath, toPath) {
    const source = path.join(this.cropGuidePath, fromPath);
    const dest = path.join(this.featuresDir, toPath);

    if (!fs.existsSync(source)) {
      console.log(`  ⚠️  Source not found: ${source}`);
      return;
    }

    if (fs.lstatSync(source).isDirectory()) {
      await this.copyDirectory(source, dest);
    } else {
      await this.copyFile(source, dest);
    }
  }

  async copyDirectory(source, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(source);
    
    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destPath = path.join(dest, item);

      if (fs.lstatSync(sourcePath).isDirectory()) {
        await this.copyDirectory(sourcePath, destPath);
      } else {
        await this.copyFile(sourcePath, destPath);
      }
    }
    
    console.log(`  ✓ Copied directory ${source} → ${dest}`);
  }

  async copyFile(source, dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.copyFileSync(source, dest);
    console.log(`  ✓ Copied ${source} → ${dest}`);
  }

  async updateImports() {
    console.log('\n🔄 Updating import paths...');
    
    // This would update all the import paths to use the new feature structure
    // Implementation would scan files and update imports
    console.log('  ℹ️  Manual step: Update import paths to use @/features/crop-guide/...');
  }

  async copyDatabaseMigrations() {
    console.log('\n🗄️  Copying database migrations...');
    
    const migrationsSource = path.join(this.cropGuidePath, 'supabase', 'migrations');
    const migrationsDestDir = path.join(this.mainAppPath, 'database', 'migrations', 'crop-guide');
    
    if (fs.existsSync(migrationsSource)) {
      await this.copyDirectory(migrationsSource, migrationsDestDir);
    }
  }

  async updatePackageJson() {
    console.log('\n📦 Updating package.json...');
    
    const mainPackageJsonPath = path.join(this.mainAppPath, 'package.json');
    const cropPackageJsonPath = path.join(this.cropGuidePath, 'package.json');
    
    if (!fs.existsSync(mainPackageJsonPath) || !fs.existsSync(cropPackageJsonPath)) {
      console.log('  ⚠️  Could not find package.json files');
      return;
    }

    const mainPackageJson = JSON.parse(fs.readFileSync(mainPackageJsonPath, 'utf8'));
    const cropPackageJson = JSON.parse(fs.readFileSync(cropPackageJsonPath, 'utf8'));

    // Merge dependencies
    const newDependencies = { ...mainPackageJson.dependencies };
    const newDevDependencies = { ...mainPackageJson.devDependencies };

    // Add crop guide dependencies
    Object.assign(newDependencies, cropPackageJson.dependencies);
    Object.assign(newDevDependencies, cropPackageJson.devDependencies);

    // Update scripts
    const newScripts = {
      ...mainPackageJson.scripts,
      'dev:crop-guide': 'vite --mode crop-guide',
      'build:crop-guide': 'vite build --mode crop-guide',
      'migrate:crop-guide': 'supabase db push --file database/migrations/crop-guide/'
    };

    const updatedPackageJson = {
      ...mainPackageJson,
      dependencies: newDependencies,
      devDependencies: newDevDependencies,
      scripts: newScripts
    };

    fs.writeFileSync(
      mainPackageJsonPath, 
      JSON.stringify(updatedPackageJson, null, 2)
    );
    
    console.log('  ✓ Updated package.json with crop guide dependencies');
  }

  async createIntegrationFiles() {
    console.log('\n🔗 Creating integration files...');
    
    // Create the main feature index file
    const indexContent = `// Crop Guide Feature Module - Auto-generated
export * from './components/EnhancedCropDashboard';
export * from './components/SimpleCropProfile';
export * from './components/admin';
export * from './contexts/AuthContext';
export * from './data/cropData';
export * from './services/geminiService';
export * from './hooks/useCropGuideIntegration';

// Feature configuration
export const cropGuideFeature = {
  name: 'Crop Guide',
  version: '2.0.0',
  routes: [
    { path: '/crops', component: 'CropDashboard' },
    { path: '/crops/:cropName', component: 'CropProfile' },
    { path: '/crops/admin', component: 'CropAdmin', protected: true }
  ]
};`;

    fs.writeFileSync(
      path.join(this.featuresDir, 'index.ts'),
      indexContent
    );

    console.log('  ✓ Created feature index file');
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.log('Usage: node migration-script.js <main-app-path> <crop-guide-path>');
    console.log('Example: node migration-script.js /path/to/main-app /path/to/crop-guide');
    process.exit(1);
  }

  const [mainAppPath, cropGuidePath] = args;
  
  if (!fs.existsSync(mainAppPath) || !fs.existsSync(cropGuidePath)) {
    console.error('❌ One or both paths do not exist');
    process.exit(1);
  }

  const migration = new CropGuideMigration(mainAppPath, cropGuidePath);
  migration.migrate();
}

module.exports = CropGuideMigration;
