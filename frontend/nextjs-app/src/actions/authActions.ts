'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import type {
  InputOTPFormValues,
  LoginFormValues,
  ResetPasswordFormValues,
  ResetPasswordMailFormValues,
  SignupFormValues,
} from '@/schemas/authSchemas';
import {
  InputOTPFormSchema,
  loginFormSchema,
  resetPasswordMailFormSchema,
  resetPasswordSchema,
  signupFormSchema,
} from '@/schemas/authSchemas';
import type { RequestResetState, ResendMailState, ResetPasswordState } from '@/types/authTypes';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

/**
 * login action
 * @param _prevState
 * @param formData
 * @returns
 */
export async function login(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const data: LoginFormValues = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsedSchema = loginFormSchema.safeParse(data);
  if (!parsedSchema.success) {
    // Handle validation errors
    const errorMessages = parsedSchema.error.errors.map((error) => error.message).join(', ');
    return { error: errorMessages };
  }

  const { error } = await supabase.auth.signInWithPassword(parsedSchema.data);

  if (error) {
    return { error: error.message || 'Invalid credentials' };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

/**
 * signup action
 * @param _prevState
 * @param formData
 * @returns
 */
export async function signup(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const data: SignupFormValues = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsedSchema = signupFormSchema.safeParse(data);
  if (!parsedSchema.success) {
    // Handle validation errors
    const errorMessages = parsedSchema.error.errors.map((error) => error.message).join(', ');
    return { error: errorMessages };
  }

  const { data: userData, error } = await supabase.auth.signUp(parsedSchema.data);

  if (error || !userData) {
    return { error: 'Invalid credentials' };
  }

  (await cookies()).set('signup_email', parsedSchema.data.email, {
    httpOnly: true,
    maxAge: 3600, // 1 hour
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  revalidatePath('/', 'layout');
  redirect('/auth/mail-confirmation');
}

/**
 * verify email action
 * @param _prevState
 * @param formData
 * @returns
 */
export async function verifyEmail(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const cookieStore = await cookies();

  const email = cookieStore.get('signup_email')?.value ?? null;

  if (!email) {
    revalidatePath('/', 'layout');
    redirect('/auth/signup');
  }

  const supabase = await createClient();

  const data: InputOTPFormValues = {
    pin: formData.get('pin') as string,
  };

  const parsedSchema = InputOTPFormSchema.safeParse(data);
  if (!parsedSchema.success) {
    // Handle validation errors
    const errorMessages = parsedSchema.error.errors.map((error) => error.message).join(', ');
    return { error: errorMessages };
  }

  const { data: userData, error } = await supabase.auth.verifyOtp({
    email: email,
    token: parsedSchema.data.pin,
    type: 'email',
  });

  if (error || !userData) {
    return { error: 'Invalid verification code' };
  }

  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0].replace(/https?:\/\//, '');
  cookieStore.delete(`sb-${projectRef}-auth-token-code-verifier`);
  cookieStore.delete('signup_email');

  revalidatePath('/', 'layout');
  redirect('/');
}

/**
 * Resend email verification
 * @param _prevState
 * @returns
 */
export async function ResendVerifyEmail(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: ResendMailState
): Promise<ResendMailState> {
  const cookieStore = await cookies();

  const email = cookieStore.get('signup_email')?.value ?? null;

  if (!email) {
    revalidatePath('/', 'layout');
    redirect('/auth/signup');
  }

  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.resend({
      email: email,
      type: 'signup',
    });

    if (!error) return { ok: true, code: 'success' };

    if (error.message.includes('User already confirmed')) return { ok: false, code: 'already-confirmed' };
    if (error.status === 429) return { ok: false, code: 'rate-limit' };
    if (error.status === 400) return { ok: false, code: 'invalid-email' };
    if (error.status === 500) return { ok: false, code: 'network' };
    return { ok: false, code: 'unknown' };
  } catch {
    return { ok: false, code: 'network' };
  }
}

/**
 * request password reset
 * @param _prevState
 * @param formData
 * @returns
 */
export async function requestReset(_prevState: RequestResetState, formData: FormData): Promise<RequestResetState> {
  const supabase = await createClient();

  const data: ResetPasswordMailFormValues = {
    email: formData.get('email') as string,
  };

  const parsedSchema = resetPasswordMailFormSchema.safeParse(data);
  if (!parsedSchema.success) {
    // Handle validation errors
    const errorMessages = parsedSchema.error.errors.map((error) => error.message).join(', ');
    return { ok: false, formError: errorMessages };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(parsedSchema.data.email, {
      redirectTo: `http://localhost:3000/auth/reset-password`,
    });

    if (!error) {
      revalidatePath('/');
      return { ok: true, code: 'success' };
    }

    if (error.status === 400) return { ok: false, code: 'invalid-email' };
    if (error.status === 429) return { ok: false, code: 'rate-limit' };
    if (error.status === 500) return { ok: false, code: 'network' };
    return { ok: false, code: 'unknown' };
  } catch {
    return { ok: false, code: 'network' };
  }
}

/**
 * reset password
 * @param _prevState
 * @param formData
 * @returns
 */
export async function resetPassword(_prevState: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    return { ok: false, code: 'unauthorized' };
  }

  const data: ResetPasswordFormValues = {
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const parsedSchema = resetPasswordSchema.safeParse(data);
  if (!parsedSchema.success) {
    // Handle validation errors
    const errorMessages = parsedSchema.error.errors.map((error) => error.message).join(', ');
    return { ok: false, formError: errorMessages };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: parsedSchema.data.password,
    });

    if (!error) {
      await supabase.auth.signOut();
      revalidatePath('/');
      return { ok: true, code: 'success' };
    }

    if (error.status === 401) return { ok: false, code: 'unauthorized' };
    if (error.status === 422) return { ok: false, code: 'same-password' };
    if (error.status === 429) return { ok: false, code: 'rate-limit' };
    if (error.status === 500) return { ok: false, code: 'network' };
    return { ok: false, code: 'unknown' };
  } catch {
    return { ok: false, code: 'network' };
  }
}
