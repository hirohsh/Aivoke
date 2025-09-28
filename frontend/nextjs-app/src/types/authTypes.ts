import { SUPPORTED_OAUTH_PROVIDERS } from '@/lib/constants';
import {
  InputOTPFormSchema,
  loginFormSchema,
  resetPasswordMailFormSchema,
  resetPasswordSchema,
  signupFormSchema,
  updatePasswordSchema,
} from '@/schemas/authSchemas';
import z from 'zod';

export interface AuthState {
  ok: boolean;
  message?: string;
  formError?: string;
}

export type SupportedProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export type SignupFormValues = z.infer<typeof signupFormSchema>;

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export type InputOTPFormValues = z.infer<typeof InputOTPFormSchema>;

export type ResetPasswordMailFormValues = z.infer<typeof resetPasswordMailFormSchema>;

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;
