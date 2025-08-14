// Simple script to approve the first user as admin
// Run this with: node approve-admin.js

const { createClient } = require('@supabase/supabase-js');

// Your Supabase credentials (from src/integrations/supabase/client.ts)
const SUPABASE_URL = "https://nrgbsqjowehxbuqzfahu.supabase.co";
const SUPABASE_SERVICE_KEY = "YOUR_SERVICE_ROLE_KEY"; // You'll need to get this from Supabase dashboard

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function approveFirstUser() {
  try {
    console.log('🔍 Looking for pending users...');
    
    // Get all pending users
    const { data: users, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('is_approved', false);

    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }

    if (users.length === 0) {
      console.log('✅ No pending users found');
      return;
    }

    console.log(`📋 Found ${users.length} pending user(s):`);
    users.forEach(user => {
      console.log(`   - ${user.full_name} (${user.email}) - ${user.role}`);
    });

    // Approve the first user as admin
    const firstUser = users[0];
    console.log(`\n👑 Approving ${firstUser.full_name} as admin...`);

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ 
        is_approved: true, 
        role: 'admin',
        updated_at: new Date().toISOString()
      })
      .eq('id', firstUser.id);

    if (updateError) {
      console.error('❌ Error approving user:', updateError);
      return;
    }

    console.log('✅ User approved successfully!');
    console.log(`   Name: ${firstUser.full_name}`);
    console.log(`   Email: ${firstUser.email}`);
    console.log(`   Role: admin`);
    console.log(`   Status: approved`);
    
    console.log('\n🎉 You can now sign in and access the admin panel!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Instructions
console.log('🚀 Admin Approval Script');
console.log('========================');
console.log('');
console.log('⚠️  IMPORTANT: You need to get your SERVICE_ROLE_KEY first:');
console.log('   1. Go to Supabase Dashboard → Settings → API');
console.log('   2. Copy the "service_role" key (not the anon key)');
console.log('   3. Replace "YOUR_SERVICE_ROLE_KEY" in this file');
console.log('   4. Run: node approve-admin.js');
console.log('');

// Check if service key is set
if (SUPABASE_SERVICE_KEY === 'YOUR_SERVICE_ROLE_KEY') {
  console.log('❌ Please set your SERVICE_ROLE_KEY first!');
  console.log('   Get it from: Supabase Dashboard → Settings → API → service_role');
} else {
  approveFirstUser();
}
