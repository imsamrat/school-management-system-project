import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  const { data: apps } = await supabase.from('admission_applications').select('*').eq('status', 'approved').limit(1);
  if (!apps || apps.length === 0) return console.log('No approved apps');
  const app = apps[0];

  console.log('Testing auto create for:', app.first_name);
  
  // Get active academic year
  const { data: academicYear } = await supabase
    .from('academic_years')
    .select('id')
    .eq('school_id', app.school_id)
    .eq('status', 'active')
    .single();

  const admissionNumber = `ADM-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  
  const { data, error: studentError } = await supabase
    .from('students')
    .insert({
      school_id: app.school_id,
      first_name: app.first_name,
      last_name: app.last_name,
      date_of_birth: app.date_of_birth,
      gender: app.gender,
      previous_school: app.previous_school,
      admission_number: admissionNumber,
      academic_year_id: academicYear?.id,
      status: 'active'
    }).select();

  if (studentError) {
    console.error('Insert error:', JSON.stringify(studentError, null, 2));
  } else {
    console.log('Insert success!', data);
  }
}

testUpdate();
