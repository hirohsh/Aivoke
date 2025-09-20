'use client';
import { resetPassword } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { resetPasswordSchema } from '@/schemas/authSchemas';
import type { AuthState, ResetPasswordFormValues } from '@/types/authTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

export interface ResetPasswordFormProps extends React.ComponentProps<'div'> {
  className?: string;
  authErrorMsg?: string;
}

export function ResetPasswordForm({ className, authErrorMsg, ...props }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(resetPassword, { ok: false });
  const router = useRouter();

  useEffect(() => {
    if (authErrorMsg) {
      toast.error(authErrorMsg, {
        duration: 10000,
        position: 'top-center',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      });
      router.push('/auth/login');
    }
  }, [authErrorMsg, router]);

  useEffect(() => {
    if (!state.message) return; // 初期レンダリング時は無視
    if (isPending) return; // リクエスト中は無視
    toast.dismiss(); // 既存のトーストをクリア

    if (state.ok) {
      toast.success(state.message, {
        duration: 10000,
        position: 'top-center',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      });
      router.push('/auth/login');
    } else {
      toast.error(state.message, {
        duration: 10000,
        position: 'top-center',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      });
    }
  }, [state.ok, state.message, isPending, router]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onSubmit',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onValid = (values: ResetPasswordFormValues) => {
    const fd = new FormData();
    fd.append('password', values.password);
    fd.append('confirmPassword', values.confirmPassword);

    startTransition(() => {
      formAction(fd);
    });
  };

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
          {state.formError && <div className="mt-2 text-center text-sm text-red-500">{state.formError}</div>}
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
                    {isSubmitting || isPending ? <LoadingSpinner className="size-7" /> : 'Reset Password'}
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
