'use client';
import { requestReset } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ResetPasswordMailFormValues } from '@/schemas/authSchemas';
import { resetPasswordMailFormSchema } from '@/schemas/authSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { startTransition, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

export function RequestResetForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [state, formAction, isPending] = useActionState(requestReset, { ok: false });

  const messages = {
    'invalid-email': 'Invalid email address. Please check it and try again.',
    'rate-limit': 'Too many requests. Please wait a while and try again.',
    network: 'Network error. Please check your internet connection and try again.',
    unknown: 'Failed to send. Please try again later.',
    success: 'Password-reset link sent! Please check your inbox.',
  } as const;

  const message = state.code ? messages[state.code] : null;

  useEffect(() => {
    if (!state.code) return; // 初期レンダリング時は無視
    if (isPending) return; // リクエスト中は無視
    toast.dismiss(); // 既存のトーストをクリア

    if (state.ok) {
      toast.success(message, {
        duration: 6000,
        position: 'top-center',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      });
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
  }, [state.ok, state.code, isPending, message]);

  const form = useForm<ResetPasswordMailFormValues>({
    resolver: zodResolver(resetPasswordMailFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
    },
  });

  async function onValid(values: ResetPasswordMailFormValues) {
    if (state.ok) return;

    const fd = new FormData();
    fd.append('email', values.email);

    startTransition(() => {
      formAction(fd);
    });
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>Enter your email to receive a password reset link.</CardDescription>
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="email">Email</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              type="email"
                              disabled={isSubmitting || isPending || state.ok}
                              placeholder="m@example.com"
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
                    {isSubmitting || isPending ? <LoadingSpinner className="size-7" /> : 'Send reset link'}
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
