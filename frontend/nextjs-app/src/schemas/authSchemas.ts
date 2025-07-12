import { z } from 'zod';

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

export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const InputOTPFormSchema = z.object({
  pin: z.string().length(6, { message: 'Your one-time password must be 6 characters.' }),
});

export type InputOTPFormValues = z.infer<typeof InputOTPFormSchema>;

export const resetPasswordMailFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ResetPasswordMailFormValues = z.infer<typeof resetPasswordMailFormSchema>;

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
