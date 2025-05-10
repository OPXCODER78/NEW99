import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please add them to your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

// Helper function to get user role
export async function getUserRole() {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .single();
  
  if (error) {
    console.error('Error getting user role:', error);
    return null;
  }
  
  return data?.role || 'user';
}