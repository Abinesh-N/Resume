import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('Running database migration...');

    // Create users table (extends Supabase auth.users)
    const { error: usersError } = await supabase.from('users').insert([]);
    
    // Create resumes table
    const { error: resumesError } = await supabase.rpc('create_resumes_table');
    
    // Create resume_templates table
    const { error: templatesError } = await supabase.rpc('create_templates_table');

    if (usersError || resumesError || templatesError) {
      console.error('Migration errors:', { usersError, resumesError, templatesError });
      process.exit(1);
    }

    console.log('✓ Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
