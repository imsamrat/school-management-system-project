import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function checkTable() {
  const { data, error } = await supabaseAdmin.from('expense_categories').select('*').limit(1);
  if (error) {
    console.error('Error:', error.message, error.code);
  } else {
    console.log('Table exists, data:', data);
  }
}

checkTable();
