import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

if (!config.supabase.url || !config.supabase.serviceKey) {
  console.warn('⚠️ Supabase URL or Service Key is missing. Check your environment variables.');
}

// Create a Supabase client with the service role key for backend operations
// This bypasses RLS, so use carefully.
export const supabaseAdmin = createClient(
  config.supabase.url || 'http://localhost:54321', // Fallback for dev
  config.supabase.serviceKey || 'dummy_key'
);
