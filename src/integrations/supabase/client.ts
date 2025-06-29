import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kifdvmzlxciscommswub.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZmR2bXpseGNpc2NvbW1zd3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDQzMzMsImV4cCI6MjA2NjY4MDMzM30.OD0tWGrUhO9sUhe31dhFh4JYIOeLBjbS6uHiBRNia-k";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Make supabase accessible globally for quick browser console testing
if (typeof window !== 'undefined' && !('supabase' in window)) {
  (window as any).supabase = supabase;
}

