'use client';
import { requestReset } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useMutationToast } from '@/hooks/useMutationToast';
import { cn } from '@/lib/utils';
import { resetPasswordMailFormSchema } from '@/schemas/authSchemas';
import type { AuthState, ResetPasswordMailFormValues } from '@/types/authTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { startTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Spinner } from '../ui/spinner';

export function RequestResetForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(requestReset, { ok: false });

  useMutationToast({
    state,
    pending: isPending,
    toastOptions: {
      duration: 10000,
      position: 'top-center',
      action: {
        label: 'Close',
        onClick: () => {},
      },
    },
  });

  const form = useForm<ResetPasswordMailFormValues>({
    resolver: zodResolver(resetPasswordMailFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
    },
  });

  const onValid = (values: ResetPasswordMailFormValues) => {
    if (state.ok) return;

    const fd = new FormData();
    fd.append('email', values.email);

    startTransition(() => {
      formAction(fd);
    });
  };

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
                    {isSubmitting || isPending ? <Spinner /> : 'Send reset link'}
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
