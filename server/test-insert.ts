import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('Fetching dependencies...');
  
  const { data: school } = await supabase.from('schools').select('id').limit(1).single();
  const { data: academicYear } = await supabase.from('academic_years').select('id').limit(1).single();
  const { data: cls } = await supabase.from('classes').select('id').limit(1).single();
  const { data: subject } = await supabase.from('subjects').select('id').limit(1).single();
  const { data: employee } = await supabase.from('employees').select('id').limit(1).single();

  if (!school || !cls || !subject || !employee) {
    console.log('Missing dependencies:', { school, cls, subject, employee });
    return;
  }

  console.log('Attempting insert with employee_id...');
  const { data, error } = await supabase.from('course_assignments').insert({
    school_id: school.id,
    academic_year_id: academicYear?.id,
    class_id: cls.id,
    subject_id: subject.id,
    employee_id: employee.id
  });

  if (error) {
    console.error('Insert error:', JSON.stringify(error, null, 2));
  } else {
    console.log('Insert success!', data);
  }
}

testInsert();
