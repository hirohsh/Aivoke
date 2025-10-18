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
  SupportedProvider,
  UpdatePasswordFormValues,
} from '@/types/authTypes';
import { createAdminClient, createAnonClient } from '@/utils/supabase/server';

import { I18N_KEYS, SUPPORTED_OAUTH_PROVIDERS } from '@/lib/constants';
import { getUser, startOAuthInternal } from '@/lib/server/auth';
import { getCurrentLocale } from '@/lib/server/Locale';
import { getErrorMessage } from '@/utils/supabase/authHelper';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

/**
 * ログアウト処理
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function logout(_prevState: AuthState): Promise<AuthState> {
  const locale = await getCurrentLocale();
  const t = await getTranslations({ locale });
  const supabase = await createAnonClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { ok: false, message: t(I18N_KEYS.Common.Fallback) };
  }

  revalidatePath('/', 'layout');

  return { ok: true, message: t(I18N_KEYS.Auth.Success.Logout) };
}

/**
 * ログイン処理
 * @param _prevState
 * @param formData
 * @returns
 */
export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createAnonClient();
  const locale = await getCurrentLocale();
  const t = await getTranslations({ locale });

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
      const cookieStore = await cookies();
      cookieStore.set('signup_email', parsedSchema.data.email, {
        httpOnly: true,
        maxAge: 3600, // 1 hour
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      revalidatePath('/', 'layout');
      return redirect(`/${locale}/auth/mail-confirmation`);
    }

    console.log('Login error:', t(I18N_KEYS.Auth.Error.Login));

    return { ok: false, message: t(I18N_KEYS.Auth.Error.Login) };
  }

  revalidatePath('/', 'layout');
  redirect(`/${locale}/chat`);
}

/**
 * サインアップ処理
 * @param _prevState
 * @param formData
 * @returns
 */
export async function signup(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createAnonClient();
  const locale = await getCurrentLocale();
  const t = await getTranslations({ locale });

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
    return { ok: false, message: t(I18N_KEYS.Auth.Error.Signup) };
  }

  (await cookies()).set('signup_email', parsedSchema.data.email, {
    httpOnly: true,
    maxAge: 3600, // 1 hour
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  revalidatePath('/', 'layout');
  redirect(`/${locale}/auth/mail-confirmation`);
}

/**
 * メールアドレス確認
 * @param _prevState
 * @param formData
 * @returns
 */
export async function verifyEmail(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const cookieStore = await cookies();
  const locale = await getCurrentLocale();
  const t = await getTranslations({ locale });

  const email = cookieStore.get('signup_email')?.value ?? null;

  if (!email) {
    revalidatePath('/', 'layout');
    redirect(`/${locale}/auth/signup`);
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
    return { ok: false, message: t(I18N_KEYS.Auth.Error.VerifyEmail) };
  }

  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0].replace(/https?:\/\//, '');
  cookieStore.delete(`sb-${projectRef}-auth-token-code-verifier`);
  cookieStore.delete('signup_email');

  revalidatePath('/', 'layout');
  redirect(`/${locale}/chat`);
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
  const locale = await getCurrentLocale();
  const t = await getTranslations({ locale });

  const email = cookieStore.get('signup_email')?.value ?? null;

  if (!email) {
    revalidatePath('/', 'layout');
    redirect(`/${locale}/auth/signup`);
  }

  const supabase = await createAnonClient();
  try {
    const { error } = await supabase.auth.resend({
      email: email,
      type: 'signup',
    });

    if (!error) return { ok: true, message: t(I18N_KEYS.Auth.Success.ResendVerifyEmail) };

    const message = getErrorMessage(error?.code);

    return { ok: false, message };
  } catch {
    return { ok: false, message: t(I18N_KEYS.Common.Fallback) };
  }
}

/**
 * パスワードリセットメール送信
 * @param _prevState
 * @param formData
 * @returns
 */
export async function requestReset(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const locale = await getCurrentLocale();
  const t = await getTranslations({ locale });
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
  const redirectTo = `${baseUrl}/api/auth/callback?type=recovery&next=${encodeURIComponent('/auth/reset-password')}`;

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(parsedSchema.data.email, {
      redirectTo,
    });

    if (!error) {
      revalidatePath('/');
      return { ok: true, message: t(I18N_KEYS.Auth.Success.RequestReset) };
    }

    const message = getErrorMessage(error?.code);

    return { ok: false, message };
  } catch {
    return { ok: false, message: t(I18N_KEYS.Common.Fallback) };
  }
}

/**
 * パスワードリセット
 * @param _prevState
 * @param formData
 * @returns
 */
export async function resetPassword(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const locale = await getCurrentLocale();
  const t = await getTranslations({ locale });
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
      return { ok: true, message: t(I18N_KEYS.Auth.Success.ResetPassword) };
    }

    const message = getErrorMessage(error?.code);

    return { ok: false, message };
  } catch {
    return { ok: false, message: t(I18N_KEYS.Common.Fallback) };
  }
}

/**
 * パスワード更新
 * @param _prevState
 * @param formData
 * @returns
 */
export async function updatePassword(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const locale = await getCurrentLocale();
  const t = await getTranslations({ locale });
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
      return { ok: true, message: t(I18N_KEYS.Auth.Success.UpdatePassword) };
    }

    const message = getErrorMessage(error?.code);

    return { ok: false, message };
  } catch {
    return { ok: false, message: t(I18N_KEYS.Common.Fallback) };
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
  const locale = await getCurrentLocale();
  const t = await getTranslations({ locale });
  try {
    const supabase = await createAnonClient();
    const { user, userError } = await getUser(supabase);

    if (!user || userError) {
      revalidatePath('/', 'layout');
      return redirect(`/${locale}/auth/login`);
    }
    await supabase.auth.signOut();

    const supabaseAdmin = await createAdminClient();
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    revalidatePath('/', 'layout');

    if (!error) return { ok: true, message: t(I18N_KEYS.Auth.Success.DeleteAccount) };

    const message = getErrorMessage(error?.code);

    return { ok: false, message };
  } catch {
    return { ok: false, message: t(I18N_KEYS.Common.Fallback) };
  }
}

/**
 * GitHub OAuth
 * @param _prevState
 * @returns
 */
export async function startOAuth(_prevState: AuthState, formData?: FormData): Promise<AuthState> {
  const locale = await getCurrentLocale();
  const providerInput = (formData?.get('provider') as string | null) ?? undefined;
  const nextInput = (formData?.get('next') as string | null) ?? undefined;
  const provider = (SUPPORTED_OAUTH_PROVIDERS as readonly string[]).includes(providerInput ?? '')
    ? (providerInput as SupportedProvider)
    : 'github';

  const nextPath = nextInput ?? `/${locale}/chat`;

  return startOAuthInternal(provider, nextPath);
}
