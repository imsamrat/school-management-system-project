import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  console.log('Creating avatars bucket...');
  const { data, error } = await supabase.storage.createBucket('avatars', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
  });

  if (error) {
    if (error.message.includes('already exists') || error.message.includes('Duplicate')) {
      console.log('Bucket "avatars" already exists or was created.');
      // Try to update it to be public just in case
      await supabase.storage.updateBucket('avatars', { public: true });
    } else {
      console.error('Error creating bucket:', error);
    }
  } else {
    console.log('Bucket created successfully!', data);
  }
}

setup();
