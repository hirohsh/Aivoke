import { z } from 'zod';

// サインアップスキーマ定義
export const signupFormSchema = z.object({
  email: z.string().email('Auth.Validation.Email'),
  password: z
    .string()
    .min(8, { message: 'Auth.Validation.PasswordMin' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).+$/, {
      message: 'Auth.Validation.PasswordComplexity',
    }),
  csrfToken: z.string(),
});

// ログインスキーマ定義
export const loginFormSchema = z.object({
  email: z.string().email('Auth.Validation.Email'),
  password: z.string(),
  csrfToken: z.string(),
});

// OTP入力スキーマ定義
export const InputOTPFormSchema = z.object({
  pin: z.string().length(6, { message: 'Auth.Validation.OTP6Digits' }),
  csrfToken: z.string(),
});

// パスワードリセットメールスキーマ定義
export const resetPasswordMailFormSchema = z.object({
  email: z.string().email('Auth.Validation.Email'),
  csrfToken: z.string(),
});

// パスワードリセットスキーマ定義
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Auth.Validation.PasswordMin' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).+$/, {
        message: 'Auth.Validation.PasswordComplexity',
      }),
    confirmPassword: z.string(),
    csrfToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Auth.Validation.PasswordsMismatch',
  });

// パスワード更新スキーマ定義
export const updatePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(8, { message: 'Auth.Validation.NewPasswordMin' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).+$/, {
        message: 'Auth.Validation.NewPasswordComplexity',
      }),
    confirmPassword: z.string(),
    csrfToken: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Auth.Validation.PasswordsMismatch',
  });
