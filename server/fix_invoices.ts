import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function fixInvoices() {
  console.log('Fixing invoices...');
  
  // Update status for overpaid or fully paid invoices
  const { data: invoices, error } = await supabaseAdmin
    .from('fee_invoices')
    .select('*')
    .neq('status', 'paid');
    
  if (error) {
    console.error('Error fetching invoices:', error);
    return;
  }
  
  for (const inv of invoices) {
    if (Number(inv.paid_amount) >= Number(inv.net_amount)) {
      console.log(`Fixing invoice ${inv.invoice_number}...`);
      await supabaseAdmin
        .from('fee_invoices')
        .update({ status: 'paid' })
        .eq('id', inv.id);
    }
  }
  
  console.log('Done fixing invoices.');
}

fixInvoices();
