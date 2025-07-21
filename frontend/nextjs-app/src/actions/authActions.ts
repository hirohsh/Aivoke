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
import { AuthState } from '@/types/authTypes';
import {
  createClient,
  FALLBACK_MESSAGE,
  getErrorMessage,
  REQUEST_RESET_SUCCESS_MESSAGE,
  RESEND_VERIFY_EMAIL_SUCCESS_MESSAGE,
  RESET_PASSWORD_SUCCESS_MESSAGE,
} from '@/utils/supabase/server';
import { cookies } from 'next/headers';

/**
 * login action
 * @param _prevState
 * @param formData
 * @returns
 */
export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const data: LoginFormValues = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsedSchema = loginFormSchema.safeParse(data);
  if (!parsedSchema.success) {
    // Handle validation errors
    const errorMessages = parsedSchema.error.errors.map((error) => error.message).join(', ');
    return { ok: false, formError: errorMessages };
  }

  const { error } = await supabase.auth.signInWithPassword(parsedSchema.data);

  if (error) {
    if (error.code === 'email_not_confirmed') {
      // If the email is not confirmed, redirect to the email confirmation page
      (await cookies()).set('signup_email', parsedSchema.data.email, {
        httpOnly: true,
        maxAge: 3600, // 1 hour
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      revalidatePath('/', 'layout');
      return redirect('/auth/mail-confirmation');
    }
    const message = getErrorMessage(error.code);
    return { ok: false, message };
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
export async function signup(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const data: SignupFormValues = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsedSchema = signupFormSchema.safeParse(data);
  if (!parsedSchema.success) {
    // Handle validation errors
    const errorMessages = parsedSchema.error.errors.map((error) => error.message).join(', ');
    return { ok: false, message: errorMessages };
  }

  const { data: userData, error } = await supabase.auth.signUp(parsedSchema.data);

  if (error || !userData) {
    console.log('Signup error:', error);
    const message = getErrorMessage(error?.code);
    return { ok: false, message };
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
export async function verifyEmail(_prevState: AuthState, formData: FormData): Promise<AuthState> {
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
    return { ok: false, message: errorMessages };
  }

  const { data: userData, error } = await supabase.auth.verifyOtp({
    email: email,
    token: parsedSchema.data.pin,
    type: 'email',
  });

  if (error || !userData) {
    const message = getErrorMessage(error?.code);
    return { ok: false, message };
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
export async function resendVerifyEmail(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: AuthState
): Promise<AuthState> {
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

    if (!error) return { ok: true, message: RESEND_VERIFY_EMAIL_SUCCESS_MESSAGE };

    const message = getErrorMessage(error?.code);

    return { ok: false, message };
  } catch {
    return { ok: false, message: FALLBACK_MESSAGE };
  }
}

/**
 * request password reset
 * @param _prevState
 * @param formData
 * @returns
 */
export async function requestReset(_prevState: AuthState, formData: FormData): Promise<AuthState> {
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
      return { ok: true, message: REQUEST_RESET_SUCCESS_MESSAGE };
    }

    const message = getErrorMessage(error?.code);

    return { ok: false, message };
  } catch {
    return { ok: false, message: FALLBACK_MESSAGE };
  }
}

/**
 * reset password
 * @param _prevState
 * @param formData
 * @returns
 */
export async function resetPassword(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    const message = getErrorMessage(error?.code);
    return { ok: false, message };
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
      return { ok: true, message: RESET_PASSWORD_SUCCESS_MESSAGE };
    }

    const message = getErrorMessage(error?.code);

    return { ok: false, message };
  } catch {
    return { ok: false, message: FALLBACK_MESSAGE };
  }
}
