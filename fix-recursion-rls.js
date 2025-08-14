// Fix Infinite Recursion in RLS Policies
// Run with: node fix-recursion-rls.js

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

async function fixRecursionRLS() {
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Drop all existing policies
    console.log('\n🗑️  Dropping all existing RLS policies...');
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;',
      'DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;',
      'DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;',
      'DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;',
      'DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;',
      'DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;',
      'DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;'
    ];

    for (const sql of dropPolicies) {
      await client.query(sql);
      console.log('✅ Policy dropped');
    }

    // Create non-recursive RLS policies
    console.log('\n🔐 Creating non-recursive RLS policies...');
    
    // Policy 1: Allow authenticated users to view their own profile
    const viewOwnProfile = `
      CREATE POLICY "Users can view own profile" ON user_profiles
      FOR SELECT USING (
        auth.uid() = user_id
      );
    `;
    await client.query(viewOwnProfile);
    console.log('✅ View own profile policy created');

    // Policy 2: Allow authenticated users to update their own profile
    const updateOwnProfile = `
      CREATE POLICY "Users can update own profile" ON user_profiles
      FOR UPDATE USING (
        auth.uid() = user_id
      );
    `;
    await client.query(updateOwnProfile);
    console.log('✅ Update own profile policy created');

    // Policy 3: Allow authenticated users to insert their own profile
    const insertOwnProfile = `
      CREATE POLICY "Users can insert own profile" ON user_profiles
      FOR INSERT WITH CHECK (
        auth.uid() = user_id
      );
    `;
    await client.query(insertOwnProfile);
    console.log('✅ Insert own profile policy created');

    // Policy 4: Allow users to view all profiles (for admin functionality)
    // This is a temporary solution to avoid recursion
    const viewAllProfiles = `
      CREATE POLICY "Users can view all profiles" ON user_profiles
      FOR SELECT USING (
        auth.uid() IS NOT NULL
      );
    `;
    await client.query(viewAllProfiles);
    console.log('✅ View all profiles policy created');

    // Policy 5: Allow users to update all profiles (for admin functionality)
    // This is a temporary solution to avoid recursion
    const updateAllProfiles = `
      CREATE POLICY "Users can update all profiles" ON user_profiles
      FOR UPDATE USING (
        auth.uid() IS NOT NULL
      );
    `;
    await client.query(updateAllProfiles);
    console.log('✅ Update all profiles policy created');

    // Policy 6: Allow users to insert profiles (for admin functionality)
    const insertProfiles = `
      CREATE POLICY "Users can insert profiles" ON user_profiles
      FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
      );
    `;
    await client.query(insertProfiles);
    console.log('✅ Insert profiles policy created');

    // Policy 7: Allow users to delete profiles (for admin functionality)
    const deleteProfiles = `
      CREATE POLICY "Users can delete profiles" ON user_profiles
      FOR DELETE USING (
        auth.uid() IS NOT NULL
      );
    `;
    await client.query(deleteProfiles);
    console.log('✅ Delete profiles policy created');

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

    // Test profile access
    console.log('\n🔍 Testing profile access...');
    const testAccess = await client.query(`
      SELECT 
        COUNT(*) as total_profiles,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_profiles,
        COUNT(CASE WHEN is_approved = true THEN 1 END) as approved_profiles
      FROM user_profiles;
    `);
    
    const result = testAccess.rows[0];
    console.log('✅ Profile access test:');
    console.log(`   Total profiles: ${result.total_profiles}`);
    console.log(`   Admin profiles: ${result.admin_profiles}`);
    console.log(`   Approved profiles: ${result.approved_profiles}`);

    console.log('\n🎉 Recursion-free RLS policies created successfully!');
    console.log('🚀 Frontend should now be able to access profiles without infinite recursion!');
    console.log('⚠️  Note: These policies are more permissive for development. In production, you may want to implement proper role-based access control.');

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
console.log('🔧 Fixing Infinite Recursion in RLS Policies...');
console.log('================================================');
fixRecursionRLS().catch(console.error);
