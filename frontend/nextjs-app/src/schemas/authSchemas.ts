import { z } from 'zod';

// サインアップスキーマ定義
export const signupFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, { message: 'Password (min. 8 characters)' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).+$/, {
      message: 'Password (min. 8 characters, including uppercase, lowercase, number, and symbol)',
    }),
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;

// ログインスキーマ定義
export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

// OTP入力スキーマ定義
export const InputOTPFormSchema = z.object({
  pin: z.string().length(6, { message: 'Your one-time password must be 6 characters.' }),
});

export type InputOTPFormValues = z.infer<typeof InputOTPFormSchema>;

// パスワードリセットメールスキーマ定義
export const resetPasswordMailFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ResetPasswordMailFormValues = z.infer<typeof resetPasswordMailFormSchema>;

// パスワードリセットスキーマ定義
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password (min. 8 characters)' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).+$/, {
        message: 'Password (min. 8 characters, including uppercase, lowercase, number, and symbol)',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// パスワード更新スキーマ定義
export const updatePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(8, { message: 'New Password (min. 8 characters)' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).+$/, {
        message: 'New Password (min. 8 characters, including uppercase, lowercase, number, and symbol)',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;
