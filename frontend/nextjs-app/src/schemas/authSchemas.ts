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
