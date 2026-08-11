import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const { data: school } = await supabase.from('schools').select('id').limit(1).single();
  const { data, error } = await supabase.from('admission_applications').insert({
    school_id: school?.id,
    first_name: 'Test',
    last_name: 'Student',
    status: 'pending'
  });

  if (error) {
    console.error('Insert error:', JSON.stringify(error, null, 2));
  } else {
    console.log('Insert success!', data);
  }
}

testInsert();
