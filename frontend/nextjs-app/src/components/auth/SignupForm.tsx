'use client';
import { signup } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useCsrf } from '@/providers/CsrfProvider';
import { signupFormSchema } from '@/schemas/authSchemas';
import type { AuthState, SignupFormValues } from '@/types/authTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { startTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Spinner } from '../ui/spinner';

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(signup, { ok: false });
  const t = useTranslations();
  const { token } = useCsrf();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
      csrfToken: token || '',
    },
  });

  const onValid = (values: SignupFormValues) => {
    const fd = new FormData();
    fd.append('email', values.email);
    fd.append('password', values.password);
    fd.append('csrfToken', values.csrfToken);

    startTransition(() => {
      formAction(fd);
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('Auth.Signup.Title')}</CardTitle>
          <CardDescription>{t('Auth.Signup.Description')}</CardDescription>
          {state.message && <div className="mt-2 text-center text-sm text-red-500">{state.message}</div>}
          {state.formError && <div className="mt-2 text-center text-sm text-red-500">{state.formError}</div>}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onValid)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="email">{t('Auth.Signup.EmailLabel')}</FormLabel>
                          <FormControl>
                            <Input id="email" type="email" placeholder={t('Auth.Signup.EmailPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="password">{t('Auth.Signup.PasswordLabel')}</FormLabel>
                          <FormControl>
                            <Input id="password" title={t('Auth.Signup.PasswordTitle')} type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
                    {isPending ? <Spinner /> : t('Auth.Signup.Submit')}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {t('Auth.Signup.HaveAccount')}{' '}
                  <Link href="/auth/login" className="underline underline-offset-4">
                    {t('Auth.Signup.LoginLink')}
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
        {t('Auth.Signup.AgreePrefix')} <Link href="#">{t('Auth.Signup.TermsOfService')}</Link> {t('Auth.Signup.And')}{' '}
        <Link href="#">{t('Auth.Signup.PrivacyPolicy')}</Link>
        {t('Auth.Signup.AgreeSuffix')}
      </div>
    </div>
  );
}
