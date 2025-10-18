'use client';
import { resetPassword } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useMutationToast } from '@/hooks/useMutationToast';
import { Link, useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { resetPasswordSchema } from '@/schemas/authSchemas';
import type { AuthState, ResetPasswordFormValues } from '@/types/authTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { startTransition, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Spinner } from '../ui/spinner';

export interface ResetPasswordFormProps extends React.ComponentProps<'div'> {
  className?: string;
  authErrorMsg?: string;
}

export function ResetPasswordForm({ className, authErrorMsg, ...props }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(resetPassword, { ok: false });
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (authErrorMsg) {
      toast.error(authErrorMsg, {
        duration: 10000,
        position: 'top-center',
        action: {
          label: t('Common.Close'),
          onClick: () => {},
        },
      });
      router.push('/auth/login');
    }
  }, [authErrorMsg, router, t]);

  const onSuccess = () => {
    router.push('/auth/login');
  };

  useMutationToast({
    state,
    pending: isPending,
    onSuccess,
    toastOptions: {
      duration: 10000,
      position: 'top-center',
      action: {
        label: t('Common.Close'),
        onClick: () => {},
      },
    },
  });

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
          <CardTitle className="text-xl">{t('Auth.ResetPassword.Title')}</CardTitle>
          <CardDescription>{t('Auth.ResetPassword.Description')}</CardDescription>
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
                          <FormLabel htmlFor="password">{t('Auth.ResetPassword.PasswordLabel')}</FormLabel>
                          <FormControl>
                            <Input
                              id="password"
                              title={t('Auth.ResetPassword.PasswordTitle')}
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
                          <FormLabel htmlFor="confirmPassword">
                            {t('Auth.ResetPassword.ConfirmPasswordLabel')}
                          </FormLabel>
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
                    {isSubmitting || isPending ? <Spinner /> : t('Auth.ResetPassword.Submit')}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {t('Auth.ResetPassword.Remembered')}{' '}
                  <Link href="/auth/login" className="underline underline-offset-4">
                    {t('Auth.ResetPassword.LoginLink')}
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
