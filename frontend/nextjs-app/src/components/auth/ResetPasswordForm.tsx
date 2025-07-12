'use client';
import { resetPassword } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import type { ResetPasswordFormValues } from '@/schemas/authSchemas';
import { resetPasswordSchema } from '@/schemas/authSchemas';
import { supabaseBrowser } from '@/utils/supabase/browser';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useActionState, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

export interface ResetPasswordFormProps extends React.ComponentProps<'div'> {
  className?: string;
  authErrorMsg?: string;
}

export function ResetPasswordForm({ className, authErrorMsg, ...props }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(resetPassword, { ok: false });
  const [authErrorMessage, setAuthErrorMessage] = useState(authErrorMsg);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signOut, refresh } = useAuth();

  const messages = {
    'same-password':
      'The new password cannot be the same as your current password. Please choose a different one.',
    'rate-limit': 'Too many requests. Please wait a while and try again.',
    unauthorized: 'You are not authorized to perform this action.',
    network: 'Network error. Please check your internet connection and try again.',
    unknown: 'Failed to send. Please try again later.',
    success: 'Password reset successful. Please log in.',
  } as const;

  const message = state.code ? messages[state.code] : null;

  const exchangeCode = async () => {
    const session = await refresh();

    if (session?.user) return;

    const supabase = supabaseBrowser();

    const code = searchParams.get('code');
    if (code) {
      console.log('Exchanging code for session:');
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setAuthErrorMessage('Invalid or expired reset code. Please try again.');
      }
    } else {
      setAuthErrorMessage('No reset code provided. Please try again.');
    }

    if (authErrorMessage) {
      toast.error(authErrorMessage, {
        duration: 10000,
        position: 'top-center',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      });
      router.push('/auth/login');
    }
  };

  useEffect(() => {
    exchangeCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (!state.code) return; // 初期レンダリング時は無視
    if (isPending) return; // リクエスト中は無視
    toast.dismiss(); // 既存のトーストをクリア

    if (state.ok) {
      toast.success(message, {
        duration: 10000,
        position: 'top-center',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      });
      signOut();
    } else {
      toast.error(message, {
        duration: 6000,
        position: 'top-center',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      });
    }
  }, [state.ok, state.code, isPending, message, signOut]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onSubmit',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onValid(values: ResetPasswordFormValues) {
    const fd = new FormData();
    fd.append('password', values.password);
    fd.append('confirmPassword', values.confirmPassword);

    startTransition(() => {
      formAction(fd);
    });
  }

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>Reset your password</CardDescription>
          {state.formError && (
            <div className="mt-2 text-center text-sm text-red-500">{state.formError}</div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onValid)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <FormControl>
                            <Input
                              id="password"
                              title="Password (min. 8 characters, including uppercase, lowercase, number, and symbol)"
                              type="password"
                              autoComplete="new-password"
                              disabled={isSubmitting || isPending || state.ok}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              id="confirmPassword"
                              type="password"
                              autoComplete="new-password"
                              disabled={isSubmitting || isPending || state.ok}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={isSubmitting || isPending || state.ok}
                  >
                    {isSubmitting || isPending ? (
                      <LoadingSpinner className="size-7" />
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Remembered your password?{' '}
                  <Link href="/auth/login" className="underline underline-offset-4">
                    Log in
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
