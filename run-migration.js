// Database Migration Script
// Run with: node run-migration.js

import { Client } from 'pg';

// Database connection configuration
// Get these values from your Supabase Dashboard → Settings → Database
const config = {
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.nrgbsqjowehxbuqzfahu',
  password: 'r6AYdbkqWZPt94pA', // From your db-credentials.txt
  ssl: {
    rejectUnauthorized: false
  }
};

const client = new Client(config);

async function runMigration() {
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    console.log('\n🗄️  Creating user_profiles table...');
    
    // Create the table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT NOT NULL,
          full_name TEXT NOT NULL,
          organization TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
          is_approved BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    await client.query(createTableSQL);
    console.log('✅ user_profiles table created!');

    // Create indexes
    console.log('\n📊 Creating indexes...');
    const indexSQLs = [
      'CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);',
      'CREATE INDEX IF NOT EXISTS idx_user_profiles_is_approved ON user_profiles(is_approved);',
      'CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);'
    ];

    for (const sql of indexSQLs) {
      await client.query(sql);
    }
    console.log('✅ Indexes created!');

    // Create trigger function
    console.log('\n⚡ Creating trigger function...');
    const triggerFunctionSQL = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;
    await client.query(triggerFunctionSQL);
    console.log('✅ Trigger function created!');

    // Create trigger
    console.log('\n🔗 Creating trigger...');
    const triggerSQL = `
      DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
      CREATE TRIGGER update_user_profiles_updated_at 
          BEFORE UPDATE ON user_profiles 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
    `;
    await client.query(triggerSQL);
    console.log('✅ Trigger created!');

    // Enable RLS
    console.log('\n🛡️  Enabling Row Level Security...');
    await client.query('ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;');
    console.log('✅ RLS enabled!');

    // Create RLS policies
    console.log('\n🔐 Creating RLS policies...');
    const policySQLs = [
      `CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert own profile during registration" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin' AND is_approved = true));`,
      `CREATE POLICY "Admins can update all profiles" ON user_profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin' AND is_approved = true));`,
      `CREATE POLICY "Admins can insert profiles" ON user_profiles FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin' AND is_approved = true));`,
      `CREATE POLICY "Admins can delete profiles" ON user_profiles FOR DELETE USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin' AND is_approved = true));`
    ];

    for (const sql of policySQLs) {
      try {
        await client.query(sql);
        console.log('✅ Policy created!');
      } catch (err) {
        console.log('⚠️  Policy already exists or error:', err.message);
      }
    }

    // Create admin user profile
    console.log('\n👑 Creating admin user profile...');
    const insertAdminSQL = `
      INSERT INTO user_profiles (
          user_id, 
          email, 
          full_name, 
          organization, 
          role, 
          is_approved
      ) VALUES (
          'fa2fb043-85e9-4fff-92ef-2a0fec12db88',
          'justfun2842@gmail.com',
          'anand',
          'plant saathiai',
          'admin',
          true
      ) ON CONFLICT (user_id) DO UPDATE SET
          is_approved = EXCLUDED.is_approved,
          role = EXCLUDED.role,
          updated_at = NOW();
    `;
    
    await client.query(insertAdminSQL);
    console.log('✅ Admin profile created/updated!');

    // Verify the setup
    console.log('\n🔍 Verifying setup...');
    const result = await client.query('SELECT * FROM user_profiles WHERE email = $1', ['justfun2842@gmail.com']);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('✅ User profile found:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.full_name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Approved: ${user.is_approved}`);
      console.log(`   Created: ${user.created_at}`);
    } else {
      console.log('❌ User profile not found');
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('🚀 You can now log in to your app as admin!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the migration
runMigration().catch(console.error);
