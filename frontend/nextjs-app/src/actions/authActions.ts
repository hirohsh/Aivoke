'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  InputOTPFormSchema,
  loginFormSchema,
  resetPasswordMailFormSchema,
  resetPasswordSchema,
  signupFormSchema,
  updatePasswordSchema,
} from '@/schemas/authSchemas';
import type {
  AuthState,
  InputOTPFormValues,
  LoginFormValues,
  ResetPasswordFormValues,
  ResetPasswordMailFormValues,
  SignupFormValues,
  UpdatePasswordFormValues,
} from '@/types/authTypes';
import { createAdminClient, createAnonClient } from '@/utils/supabase/server';

import {
  DELETE_ACCOUNT_SUCCESS_MESSAGE,
  FALLBACK_MESSAGE,
  LOGOUT_SUCCESS_MESSAGE,
  REQUEST_RESET_SUCCESS_MESSAGE,
  RESEND_VERIFY_EMAIL_SUCCESS_MESSAGE,
  RESET_PASSWORD_SUCCESS_MESSAGE,
  UPDATE_PASSWORD_SUCCESS_MESSAGE,
} from '@/lib/constants';
import { getUser } from '@/lib/users';
import { getErrorMessage } from '@/utils/supabase/authHelper';
import { cookies, headers } from 'next/headers';

/**
 * ログアウト処理
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function logout(_prevState: AuthState): Promise<AuthState> {
  const supabase = await createAnonClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { ok: false, message: FALLBACK_MESSAGE };
  }

  revalidatePath('/', 'layout');

  return { ok: true, message: LOGOUT_SUCCESS_MESSAGE };
}

/**
 * ログイン処理
 * @param _prevState
 * @param formData
 * @returns
 */
export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createAnonClient();

  const data: LoginFormValues = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsedSchema = loginFormSchema.safeParse(data);
  if (!parsedSchema.success) {
    const errorMessages = parsedSchema.error.errors.map((error) => error.message).join(', ');
    return { ok: false, formError: errorMessages };
  }

  const { error } = await supabase.auth.signInWithPassword(parsedSchema.data);

  if (error) {
    if (error.code === 'email_not_confirmed') {
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
 * サインアップ処理
 * @param _prevState
 * @param formData
 * @returns
 */
export async function signup(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createAnonClient();

  const data: SignupFormValues = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsedSchema = signupFormSchema.safeParse(data);
  if (!parsedSchema.success) {
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
 * メールアドレス確認
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

  const supabase = await createAnonClient();

  const data: InputOTPFormValues = {
    pin: formData.get('pin') as string,
  };

  const parsedSchema = InputOTPFormSchema.safeParse(data);
  if (!parsedSchema.success) {
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
 * メールアドレス再送信
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

  const supabase = await createAnonClient();
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
 * パスワードリセットメール送信
 * @param _prevState
 * @param formData
 * @returns
 */
export async function requestReset(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createAnonClient();

  const data: ResetPasswordMailFormValues = {
    email: formData.get('email') as string,
  };

  const parsedSchema = resetPasswordMailFormSchema.safeParse(data);
  if (!parsedSchema.success) {
    const errorMessages = parsedSchema.error.errors.map((error) => error.message).join(', ');
    return { ok: false, formError: errorMessages };
  }

  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  const redirectTo = `${baseUrl}/api/auth/callback`;

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(parsedSchema.data.email, {
      redirectTo,
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
 * パスワードリセット
 * @param _prevState
 * @param formData
 * @returns
 */
export async function resetPassword(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createAnonClient();

  const { userError } = await getUser(supabase);

  if (userError) return { ok: false, message: userError };

  const data: ResetPasswordFormValues = {
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const parsedSchema = resetPasswordSchema.safeParse(data);
  if (!parsedSchema.success) {
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

/**
 * パスワード更新
 * @param _prevState
 * @param formData
 * @returns
 */
export async function updatePassword(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createAnonClient();

  const { user, userError } = await getUser(supabase);

  if (userError) return { ok: false, message: userError };

  const data: UpdatePasswordFormValues = {
    currentPassword: formData.get('currentPassword') as string,
    newPassword: formData.get('newPassword') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const parsedSchema = updatePasswordSchema.safeParse(data);
  if (!parsedSchema.success) {
    const errorMessages = parsedSchema.error.errors.map((error) => error.message).join(', ');
    return { ok: false, formError: errorMessages };
  }

  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email ?? '',
      password: parsedSchema.data.currentPassword,
    });

    if (signInError) {
      const message = getErrorMessage(signInError.code);
      return { ok: false, message };
    }

    const { error } = await supabase.auth.updateUser({
      password: parsedSchema.data.newPassword,
    });

    if (!error) {
      await supabase.auth.signOut();
      revalidatePath('/');
      return { ok: true, message: UPDATE_PASSWORD_SUCCESS_MESSAGE };
    }

    const message = getErrorMessage(error?.code);

    return { ok: false, message };
  } catch {
    return { ok: false, message: FALLBACK_MESSAGE };
  }
}

/**
 * アカウント削除
 * @param _prevState
 * @returns
 */
export async function deleteUserAccount(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: AuthState
): Promise<AuthState> {
  try {
    const supabase = await createAnonClient();
    const { user, userError } = await getUser(supabase);

    if (!user || userError) {
      revalidatePath('/', 'layout');
      return redirect('/auth/login');
    }
    await supabase.auth.signOut();

    const supabaseAdmin = await createAdminClient();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    revalidatePath('/', 'layout');

    if (!error) return { ok: true, message: DELETE_ACCOUNT_SUCCESS_MESSAGE };

    const message = getErrorMessage(error?.code);

    return { ok: false, message };
  } catch {
    return { ok: false, message: FALLBACK_MESSAGE };
  }
}
