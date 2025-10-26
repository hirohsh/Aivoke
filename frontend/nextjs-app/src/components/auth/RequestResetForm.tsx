'use client';
import { requestReset } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useMutationToast } from '@/hooks/useMutationToast';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useCsrf } from '@/providers/CsrfProvider';
import { resetPasswordMailFormSchema } from '@/schemas/authSchemas';
import type { AuthState, ResetPasswordMailFormValues } from '@/types/authTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { startTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Spinner } from '../ui/spinner';

export function RequestResetForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(requestReset, { ok: false });
  const t = useTranslations();
  const { token } = useCsrf();

  useMutationToast({
    state,
    pending: isPending,
    toastOptions: {
      duration: 10000,
      position: 'top-center',
      action: {
        label: t('Common.Close'),
        onClick: () => {},
      },
    },
  });

  const form = useForm<ResetPasswordMailFormValues>({
    resolver: zodResolver(resetPasswordMailFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      csrfToken: token || '',
    },
  });

  const onValid = (values: ResetPasswordMailFormValues) => {
    if (state.ok) return;

    const fd = new FormData();
    fd.append('email', values.email);
    fd.append('csrfToken', values.csrfToken);

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
          <CardTitle className="text-xl">{t('Auth.RequestReset.Title')}</CardTitle>
          <CardDescription>{t('Auth.RequestReset.Description')}</CardDescription>
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
                          <FormLabel htmlFor="email">{t('Auth.RequestReset.EmailLabel')}</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              type="email"
                              disabled={isSubmitting || isPending || state.ok}
                              placeholder={t('Auth.RequestReset.EmailPlaceholder')}
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
                    {isSubmitting || isPending ? <Spinner /> : t('Auth.RequestReset.Submit')}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {t('Auth.RequestReset.Remembered')}{' '}
                  <Link href="/auth/login" className="underline underline-offset-4">
                    {t('Auth.RequestReset.LoginLink')}
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
