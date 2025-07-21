import { ERROR_MESSAGES } from '@/types/authTypes';
import type { ErrorCode } from '@supabase/auth-js/src/lib/error-codes';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import 'server-only';

// 定数定義
export const FALLBACK_MESSAGE = 'Something went wrong. Please try again or contact support.';
export const RESEND_VERIFY_EMAIL_SUCCESS_MESSAGE = 'Verification email resent successfully. Please check your inbox.';
export const REQUEST_RESET_SUCCESS_MESSAGE = 'Password-reset link sent! Please check your inbox.';
export const RESET_PASSWORD_SUCCESS_MESSAGE = 'Password reset successful. Please log in.';

// 認証エラーメッセージの型ガード
export function isAuthErrorCode(value: unknown): value is ErrorCode {
  return typeof value === 'string' && value in ERROR_MESSAGES;
}

// 認証エラーメッセージを取得する
export function getErrorMessage(code: ErrorCode | (string & {}) | undefined): string {
  return isAuthErrorCode(code) ? ERROR_MESSAGES[code] : FALLBACK_MESSAGE;
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
    auth: { persistSession: true, detectSessionInUrl: false },
  });
}
