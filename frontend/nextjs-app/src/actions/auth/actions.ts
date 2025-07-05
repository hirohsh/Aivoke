'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import type { LoginFormValues, SignupFormValues } from '@/schemas/authSchemas';
import { loginFormSchema, signupFormSchema } from '@/schemas/authSchemas';
import { createClient } from '@/utils/supabase/server';

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

  if (error) {
    return { error: 'Invalid credentials' };
  }

  if (!userData.user) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
