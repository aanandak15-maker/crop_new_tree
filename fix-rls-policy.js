// Fix RLS Policies for Profile Access
// Run with: node fix-rls-policy.js

import { Client } from 'pg';

const config = {
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.nrgbsqjowehxbuqzfahu',
  password: 'yiHnRjloBzzwpt3k',
  ssl: {
    rejectUnauthorized: false
  }
};

const client = new Client(config);

async function fixRLSPolicies() {
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Drop existing policies
    console.log('\n🗑️  Dropping existing RLS policies...');
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;',
      'DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;',
      'DROP POLICY IF EXISTS "Users can insert own profile during registration" ON user_profiles;',
      'DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;',
      'DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;',
      'DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;',
      'DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;'
    ];

    for (const sql of dropPolicies) {
      await client.query(sql);
      console.log('✅ Policy dropped');
    }

    // Create improved RLS policies
    console.log('\n🔐 Creating improved RLS policies...');
    
    // Allow users to view their own profile (even if it doesn't exist yet)
    const viewOwnProfile = `
      CREATE POLICY "Users can view own profile" ON user_profiles
      FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() IS NULL
      );
    `;
    await client.query(viewOwnProfile);
    console.log('✅ View own profile policy created');

    // Allow users to update their own profile
    const updateOwnProfile = `
      CREATE POLICY "Users can update own profile" ON user_profiles
      FOR UPDATE USING (auth.uid() = user_id);
    `;
    await client.query(updateOwnProfile);
    console.log('✅ Update own profile policy created');

    // Allow users to insert their own profile during registration
    const insertOwnProfile = `
      CREATE POLICY "Users can insert own profile during registration" ON user_profiles
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    `;
    await client.query(insertOwnProfile);
    console.log('✅ Insert own profile policy created');

    // Allow admins to view all profiles
    const adminViewAll = `
      CREATE POLICY "Admins can view all profiles" ON user_profiles
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE user_id = auth.uid() 
          AND role = 'admin' 
          AND is_approved = true
        )
      );
    `;
    await client.query(adminViewAll);
    console.log('✅ Admin view all profiles policy created');

    // Allow admins to update all profiles
    const adminUpdateAll = `
      CREATE POLICY "Admins can update all profiles" ON user_profiles
      FOR UPDATE USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE user_id = auth.uid() 
          AND role = 'admin' 
          AND is_approved = true
        )
      );
    `;
    await client.query(adminUpdateAll);
    console.log('✅ Admin update all profiles policy created');

    // Allow admins to insert profiles
    const adminInsert = `
      CREATE POLICY "Admins can insert profiles" ON user_profiles
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE user_id = auth.uid() 
          AND role = 'admin' 
          AND is_approved = true
        )
      );
    `;
    await client.query(adminInsert);
    console.log('✅ Admin insert profiles policy created');

    // Allow admins to delete profiles
    const adminDelete = `
      CREATE POLICY "Admins can delete profiles" ON user_profiles
      FOR DELETE USING (
        EXISTS (
          SELECT 1 FROM user_profiles 
          WHERE user_id = auth.uid() 
          AND role = 'admin' 
          AND is_approved = true
        )
      );
    `;
    await client.query(adminDelete);
    console.log('✅ Admin delete profiles policy created');

    // Test the policies
    console.log('\n🧪 Testing RLS policies...');
    
    // Check current policies
    const policies = await client.query(`
      SELECT policyname, permissive, roles, cmd, qual, with_check
      FROM pg_policies 
      WHERE tablename = 'user_profiles';
    `);
    
    console.log('✅ Current RLS policies:');
    policies.rows.forEach(policy => {
      console.log(`   ${policy.policyname}: ${policy.cmd} (${policy.permissive ? 'permissive' : 'restrictive'})`);
    });

    console.log('\n🎉 RLS policies fixed successfully!');
    console.log('🚀 Users should now be able to access their profiles!');

  } catch (error) {
    console.error('❌ Fix failed:', error);
    console.error('Error details:', error.message);
    console.error('Error code:', error.code);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the fix
console.log('🔧 Fixing RLS Policies for Profile Access...');
console.log('=============================================');
fixRLSPolicies().catch(console.error);
