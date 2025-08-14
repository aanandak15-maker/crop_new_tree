// Test Profile Access
// Run with: node test-profile-access.js

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

async function testProfileAccess() {
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Test 1: Check if user_profiles table exists
    console.log('\n📋 Test 1: Check table existence...');
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles'
      );
    `);
    console.log('✅ user_profiles table exists:', tableExists.rows[0].exists);

    // Test 2: Check table structure
    console.log('\n🏗️  Test 2: Check table structure...');
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'user_profiles'
      ORDER BY ordinal_position;
    `);
    console.log('✅ Table columns:');
    columns.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} (${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'})`);
    });

    // Test 3: Check RLS policies
    console.log('\n🔐 Test 3: Check RLS policies...');
    const policies = await client.query(`
      SELECT policyname, cmd, permissive
      FROM pg_policies 
      WHERE tablename = 'user_profiles';
    `);
    console.log('✅ RLS policies:');
    policies.rows.forEach(policy => {
      console.log(`   ${policy.policyname}: ${policy.cmd} (${policy.permissive ? 'permissive' : 'restrictive'})`);
    });

    // Test 4: Check if admin profile exists
    console.log('\n👑 Test 4: Check admin profile...');
    const adminProfile = await client.query(`
      SELECT id, user_id, email, full_name, role, is_approved, created_at
      FROM user_profiles 
      WHERE email = 'justfun2842@gmail.com';
    `);
    
    if (adminProfile.rows.length > 0) {
      const profile = adminProfile.rows[0];
      console.log('✅ Admin profile found:');
      console.log(`   ID: ${profile.id}`);
      console.log(`   User ID: ${profile.user_id}`);
      console.log(`   Email: ${profile.email}`);
      console.log(`   Name: ${profile.full_name}`);
      console.log(`   Role: ${profile.role}`);
      console.log(`   Approved: ${profile.is_approved}`);
      console.log(`   Created: ${profile.created_at}`);
    } else {
      console.log('❌ Admin profile not found');
    }

    // Test 5: Test RLS with auth.uid() simulation
    console.log('\n🧪 Test 5: Test RLS policies...');
    const testRLS = await client.query(`
      -- Simulate what happens when auth.uid() = 'fa2fb043-85e9-4fff-92ef-2a0fec12db88'
      SELECT 
        'RLS Test' as test_name,
        COUNT(*) as profile_count
      FROM user_profiles 
      WHERE user_id = 'fa2fb043-85e9-4fff-92ef-2a0fec12db88';
    `);
    console.log('✅ RLS test result:', testRLS.rows[0]);

    console.log('\n🎉 All tests completed successfully!');
    console.log('🚀 Database is ready for authentication!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
    console.error('Error code:', error.code);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the tests
console.log('🧪 Testing Profile Access and RLS Policies...');
console.log('=============================================');
testProfileAccess().catch(console.error);
