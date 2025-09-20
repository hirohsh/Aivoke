import { AUTH_ERROR_MESSAGES, FALLBACK_MESSAGE } from '@/lib/constants';
import type { ErrorCode } from '@supabase/auth-js/src/lib/error-codes';

// 認証エラーメッセージの型ガード
function isAuthErrorCode(value: unknown): value is ErrorCode {
  return typeof value === 'string' && value in AUTH_ERROR_MESSAGES;
}

// 認証エラーメッセージを取得する
export function getErrorMessage(code: ErrorCode | (string & {}) | undefined): string {
  return isAuthErrorCode(code) ? AUTH_ERROR_MESSAGES[code] : FALLBACK_MESSAGE;
}
