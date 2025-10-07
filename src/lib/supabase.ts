// Wrapper around auto-generated Supabase client to handle environment variable issues
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Strip quotes from environment variables if present
const stripQuotes = (str: string | undefined): string => {
  if (!str) return '';
  return str.replace(/^["']|["']$/g, '');
};

const SUPABASE_URL = stripQuotes(import.meta.env.VITE_SUPABASE_URL) || 'https://rmqknehekpssknhrjbsu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = stripQuotes(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtcWtuZWhla3Bzc2tuaHJqYnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTU4NDAsImV4cCI6MjA3NDk3MTg0MH0.NTEmVgAAp302hZ_ASicGvwjphSDpplIV8160JWKftzU';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
