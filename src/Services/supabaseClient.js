import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // service role key recommended for backend

export const supabase = createClient(supabaseUrl, supabaseKey);
