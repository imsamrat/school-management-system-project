import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('Seeding initial data...');

  try {
    // 1. Create a School
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .insert({
        name: 'Green Valley International School',
        email: 'info@greenvalley.edu',
        phone: '+1 (555) 123-4567',
        established_year: 1995
      })
      .select()
      .single();

    if (schoolError) throw schoolError;
    console.log(`✅ School created: ${school.name}`);

    // 2. Create Roles
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .insert([
        { school_id: school.id, name: 'Super Admin', is_system_role: true },
        { school_id: school.id, name: 'Teacher', is_system_role: true },
        { school_id: school.id, name: 'Student', is_system_role: true },
      ])
      .select();

    if (rolesError) throw rolesError;
    console.log(`✅ Roles created`);

    const adminRole = roles.find((r: any) => r.name === 'Super Admin');

    // 3. Create Admin User
    const passwordHash = await bcrypt.hash('admin123', 10);
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        school_id: school.id,
        email: 'admin@greenvalley.edu',
        password_hash: passwordHash,
        full_name: 'System Administrator',
      })
      .select()
      .single();

    if (userError) throw userError;
    console.log(`✅ Admin user created: ${user.email}`);

    // 4. Assign Role to Admin
    const { error: assignError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role_id: adminRole.id
      });

    if (assignError) throw assignError;
    console.log(`✅ Admin role assigned`);

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}

seed();
