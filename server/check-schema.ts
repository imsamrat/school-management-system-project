import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('Checking employees table schema...');
  const { data, error } = await supabase.from('employees').select('id, is_teacher').limit(1);
  if (error) {
    console.error('Schema check error:', error.message);
  } else {
    console.log('Schema check success!', data);
  }
}

checkSchema();
