import { getErrorMessage } from '@/utils/supabase/authHelper';
import { SupabaseClient } from '@supabase/supabase-js';
import 'server-only';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUser = async (supabase: SupabaseClient<any, 'public', any>) => {
  const { data, error } = await supabase.auth.getUser();

  return { user: data.user, userError: error ? getErrorMessage(error.code) : null };
};
