import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStudents() {
  const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false }).limit(5);
  console.log('Students:', data);
  if (error) console.error(error);
}

checkStudents();
