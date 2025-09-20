import { createBrowserClient } from '@supabase/ssr';

// Supabaseクライアントの作成
export const supabaseBrowser = () => {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    auth: { persistSession: true, detectSessionInUrl: false },
  });
};
