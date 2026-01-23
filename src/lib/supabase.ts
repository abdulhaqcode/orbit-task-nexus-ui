import { createClient } from '@supabase/supabase-js'

// Prefer environment variables (Vite) for real deployments.
// For development we use the values provided by the user in the environment.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	console.warn('Supabase URL/ANON key not set. Make sure to create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before running.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase
