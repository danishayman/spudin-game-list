// This script runs the SQL migration for the game cache table
// Run with: node scripts/setup-cache.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

async function setupCache() {
  // Check for required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing required environment variables.');
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
  }

  // Create Supabase client with service role key for admin operations
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../sql/game_cache.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    console.log('Setting up game cache table...');
    const { error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      throw error;
    }

    console.log('✅ Game cache table setup complete!');
    console.log('You can now use the caching layer for RAWG API responses.');
  } catch (error) {
    console.error('Error setting up game cache table:', error);
    
    // Provide helpful information for common errors
    if (error.message.includes('exec_sql')) {
      console.error('\nNote: The "exec_sql" function might not be available in your Supabase instance.');
      console.error('You may need to run the SQL manually in the Supabase SQL editor.');
      console.error('The SQL file is located at: sql/game_cache.sql');
    }
    
    process.exit(1);
  }
}

setupCache(); 