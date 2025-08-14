// Test Current RLS Policies
// Run with: node test-current-policies.js

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

async function testCurrentPolicies() {
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Check current RLS policies
    console.log('\n🔐 Checking current RLS policies...');
    const policies = await client.query(`
      SELECT policyname, permissive, roles, cmd, qual, with_check
      FROM pg_policies 
      WHERE tablename = 'user_profiles'
      ORDER BY policyname;
    `);
    
    console.log('✅ Current RLS policies:');
    policies.rows.forEach(policy => {
      console.log(`   ${policy.policyname}: ${policy.cmd} (${policy.permissive ? 'permissive' : 'restrictive'})`);
      console.log(`      Qual: ${policy.qual}`);
      console.log(`      With Check: ${policy.with_check}`);
    });

    // Test basic table access
    console.log('\n🔍 Testing basic table access...');
    const basicAccess = await client.query(`
      SELECT 
        COUNT(*) as total_profiles,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_profiles,
        COUNT(CASE WHEN is_approved = true THEN 1 END) as approved_profiles
      FROM user_profiles;
    `);
    
    const result = basicAccess.rows[0];
    console.log('✅ Basic access test:');
    console.log(`   Total profiles: ${result.total_profiles}`);
    console.log(`   Admin profiles: ${result.admin_profiles}`);
    console.log(`   Approved profiles: ${result.approved_profiles}`);

    // Test specific user profile access
    console.log('\n👤 Testing specific user profile access...');
    const specificProfile = await client.query(`
      SELECT id, user_id, email, full_name, role, is_approved, created_at
      FROM user_profiles 
      WHERE user_id = 'fa2fb043-85e9-4fff-92ef-2a0fec12db88';
    `);
    
    if (specificProfile.rows.length > 0) {
      const profile = specificProfile.rows[0];
      console.log('✅ Specific profile found:');
      console.log(`   ID: ${profile.id}`);
      console.log(`   Email: ${profile.email}`);
      console.log(`   Name: ${profile.full_name}`);
      console.log(`   Role: ${profile.role}`);
      console.log(`   Approved: ${profile.is_approved}`);
    } else {
      console.log('❌ Specific profile not found');
    }

    // Check if RLS is enabled
    console.log('\n🛡️  Checking RLS status...');
    const rlsStatus = await client.query(`
      SELECT schemaname, tablename, rowsecurity
      FROM pg_tables 
      WHERE tablename = 'user_profiles';
    `);
    
    if (rlsStatus.rows.length > 0) {
      const status = rlsStatus.rows[0];
      console.log('✅ RLS status:');
      console.log(`   Schema: ${status.schemaname}`);
      console.log(`   Table: ${status.tablename}`);
      console.log(`   RLS Enabled: ${status.rowsecurity}`);
    }

    console.log('\n🎉 Policy testing completed!');
    console.log('🚀 If all tests pass, the issue might be in the frontend Supabase client.');

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
console.log('🧪 Testing Current RLS Policies...');
console.log('==================================');
testCurrentPolicies().catch(console.error);
