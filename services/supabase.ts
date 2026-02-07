
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Note: These env variables are assumed to be injected similarly to process.env.API_KEY
// In a real environment, you'd use your specific Supabase URL and Key.
const supabaseUrl = (process.env as any).SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = (process.env as any).SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
};

export const subscribeToCredits = (userId: string, onUpdate: (credits: number) => void) => {
  return supabase
    .channel('public:profiles')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
      (payload) => {
        if (payload.new && typeof payload.new.credits === 'number') {
          onUpdate(payload.new.credits);
        }
      }
    )
    .subscribe();
};
