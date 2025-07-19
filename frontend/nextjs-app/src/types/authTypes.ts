// 共通ステータスコード定義
export const CommonStatusCodes = {
  Success: 'success',
  RateLimit: 'rate-limit',
  Network: 'network',
  Unknown: 'unknown',
} as const;

export type CommonStatusCode = (typeof CommonStatusCodes)[keyof typeof CommonStatusCodes];

// ステータスコード拡張
export const ResendMailStatusCodes = {
  InvalidEmail: 'invalid-email',
  AlreadyConfirmed: 'already-confirmed',
  ...CommonStatusCodes,
} as const;

export const RequestResetStatusCodes = {
  InvalidEmail: 'invalid-email',
  ...CommonStatusCodes,
} as const;

export const ResetPasswordStatusCodes = {
  Unauthorized: 'unauthorized',
  SamePassword: 'same-password',
  ...CommonStatusCodes,
} as const;

export type ResendMailCode = (typeof ResendMailStatusCodes)[keyof typeof ResendMailStatusCodes];
export type RequestResetCode = (typeof RequestResetStatusCodes)[keyof typeof RequestResetStatusCodes];
export type ResetPasswordCode = (typeof ResetPasswordStatusCodes)[keyof typeof ResetPasswordStatusCodes];

interface BaseState<T extends string> {
  ok: boolean;
  code?: T;
  formError?: string;
}

export type ResendMailState = BaseState<ResendMailCode>;
export type RequestResetState = BaseState<RequestResetCode>;
export type ResetPasswordState = BaseState<ResetPasswordCode>;
