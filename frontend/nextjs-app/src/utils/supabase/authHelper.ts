import { ERROR_MESSAGES } from '@/types/authTypes';
import type { ErrorCode } from '@supabase/auth-js/src/lib/error-codes';

// 定数定義
export const FALLBACK_MESSAGE = 'Something went wrong. Please try again or contact support.';
export const RESEND_VERIFY_EMAIL_SUCCESS_MESSAGE = 'Verification email resent successfully. Please check your inbox.';
export const REQUEST_RESET_SUCCESS_MESSAGE = 'Password-reset link sent! Please check your inbox.';
export const RESET_PASSWORD_SUCCESS_MESSAGE = 'Password reset successful. Please log in.';
export const UPDATE_PASSWORD_SUCCESS_MESSAGE = 'Password updated successfully. Please log in again.';
export const DELETE_ACCOUNT_SUCCESS_MESSAGE = 'Account deleted successfully.';

// 認証エラーメッセージの型ガード
function isAuthErrorCode(value: unknown): value is ErrorCode {
  return typeof value === 'string' && value in ERROR_MESSAGES;
}

// 認証エラーメッセージを取得する
export function getErrorMessage(code: ErrorCode | (string & {}) | undefined): string {
  return isAuthErrorCode(code) ? ERROR_MESSAGES[code] : FALLBACK_MESSAGE;
}
