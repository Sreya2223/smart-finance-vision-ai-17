
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jmxhubxganertfjcifyf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteGh1YnhnYW5lcnRmamNpZnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDczNDYsImV4cCI6MjA1OTg4MzM0Nn0.0fkP7wBnt883bGmRxCmrXs8nM4vK1iZoVrcg6lvqTnM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
