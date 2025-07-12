export interface ResendMailState {
  ok: boolean;
  code?: 'invalid-email' | 'already-confirmed' | 'rate-limit' | 'network' | 'unknown' | 'success';
}

export interface RequestResetState {
  ok: boolean;
  code?: 'invalid-email' | 'rate-limit' | 'unknown' | 'network' | 'success';
  formError?: string;
}

export interface ResetPasswordState {
  ok: boolean;
  code?: 'unauthorized' | 'rate-limit' | 'unknown' | 'network' | 'same-password' | 'success';
  formError?: string;
}
