import { SupportedProvider } from '@/types/authTypes';
import { getErrorMessage } from '@/utils/supabase/authHelper';
import { createAnonClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import 'server-only';
import { DEFAULT_LOCALE, I18N_KEYS, OAUTH_PROVIDER_OPTIONS } from '../constants';

/**
 * ログインユーザー情報を取得する
 * @param supabase
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUser = async (supabase: SupabaseClient<any, 'public', any>) => {
  const { data, error } = await supabase.auth.getUser();

  return { user: data.user, userError: error ? getErrorMessage(error.code) : null };
};

/**
 * サーバーのオリジンを取得する
 * @returns
 */
export const getServerOrigin = async () => {
  const headerList = await headers();
  const xfProto = headerList.get('x-forwarded-proto');
  const xfHost = headerList.get('x-forwarded-host');
  const host = headerList.get('host');

  if (xfProto && xfHost) return `${xfProto}://${xfHost}`;
  if (host) return `https://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
};

/**
 * OAUTH認証を開始する
 * @param provider
 * @param nextPath
 * @returns
 */
export const startOAuthInternal = async (provider: SupportedProvider, nextPath = `/${DEFAULT_LOCALE}/chat`) => {
  const supabase = await createAnonClient();

  const origin = await getServerOrigin();
  const redirectTo = `${origin}/api/auth/callback?next=${encodeURIComponent(nextPath)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      ...(OAUTH_PROVIDER_OPTIONS[provider] ?? {}),
    },
  });

  const t = await getTranslations();
  if (error) return { ok: false, message: t(I18N_KEYS.Common.Fallback) };

  redirect(data.url);
};
