import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Helper to create a dummy client if config is missing
const createMockClient = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase credentials missing. Check your environment variables.' } }),
    signUp: async () => ({ data: null, error: { message: 'Supabase credentials missing. Check your environment variables.' } }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
    update: () => ({
      eq: async () => ({ error: null }),
    }),
  }),
});

// Cast to any to avoid complex type mocking, but satisfies the interface used in the app
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : createMockClient() as any;

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    // If using mock client, error might be null but data is null, or error might be present if we added one.
    // In our mock, error is null, data is null.
    if (error) console.error('Error fetching profile:', error);
    return null;
  }
  return data;
};

export const incrementUsage = async (userId: string) => {
  // First get current usage
  const { data: profile } = await supabase
    .from('profiles')
    .select('usage_count')
    .eq('id', userId)
    .single();

  if (!profile) return;

  const { error } = await supabase
    .from('profiles')
    .update({ usage_count: profile.usage_count + 1 })
    .eq('id', userId);

  if (error) console.error('Error incrementing usage:', error);
};

export const upgradeToPro = async (userId: string) => {
  // Mock upgrade function
  const { error } = await supabase
    .from('profiles')
    .update({ is_pro: true })
    .eq('id', userId);
    
  if (error) throw error;
};