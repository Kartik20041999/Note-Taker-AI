import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kifdvmzlxciscommswub.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_ANON_KEY_HERE"; // Replace if different

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}
