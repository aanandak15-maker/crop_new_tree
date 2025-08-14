// Fix Unique Constraint and Complete Admin Profile
// Run with: node fix-constraint.js

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

async function fixConstraint() {
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Add unique constraint on user_id
    console.log('\n🔒 Adding unique constraint on user_id...');
    try {
      await client.query('ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);');
      console.log('✅ Unique constraint added!');
    } catch (err) {
      if (err.code === '42710') {
        console.log('✅ Unique constraint already exists!');
      } else {
        throw err;
      }
    }

    // Now create the admin profile
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

    // Check table structure
    console.log('\n📋 Checking table structure...');
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default, is_identity
      FROM information_schema.columns 
      WHERE table_name = 'user_profiles'
      ORDER BY ordinal_position;
    `);
    
    console.log('✅ Table columns:');
    columns.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });

    // Check constraints
    console.log('\n🔒 Checking constraints...');
    const constraints = await client.query(`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints 
      WHERE table_name = 'user_profiles';
    `);
    
    console.log('✅ Table constraints:');
    constraints.rows.forEach(constraint => {
      console.log(`   ${constraint.constraint_name}: ${constraint.constraint_type}`);
    });

    console.log('\n🎉 Setup completed successfully!');
    console.log('🚀 You can now log in to your app as admin!');

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
console.log('🔧 Fixing Unique Constraint and Completing Setup...');
console.log('==================================================');
fixConstraint().catch(console.error);
