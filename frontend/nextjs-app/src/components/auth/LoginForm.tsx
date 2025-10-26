'use client';
import { login, startOAuth } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useCsrf } from '@/providers/CsrfProvider';
import { loginFormSchema } from '@/schemas/authSchemas';
import type { AuthState, LoginFormValues, SupportedProvider } from '@/types/authTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { startTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Spinner } from '../ui/spinner';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(login, { ok: false });
  const [oAuthState, oAuthAction, oAuthIsPending] = useActionState<AuthState, FormData>(startOAuth, { ok: false });
  const locale = useLocale();
  const t = useTranslations();
  const { token } = useCsrf();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      csrfToken: token || '',
    },
  });

  const go = (provider: SupportedProvider) => {
    const fd = new FormData();
    fd.append('provider', provider);
    fd.append('next', `/${locale}/chat`);
    fd.append('csrfToken', token || '');
    startTransition(() => {
      oAuthAction(fd);
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('Auth.Login.Title')}</CardTitle>
          <CardDescription>{t('Auth.Login.Description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer"
                    formNoValidate
                    disabled={oAuthIsPending || isPending}
                    onClick={() => go('github')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-github-icon lucide-github"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                    {t('Auth.Login.OAuthGithub')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer"
                    formNoValidate
                    disabled={oAuthIsPending || isPending}
                    onClick={() => go('google')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    {t('Auth.Login.OAuthGoogle')}
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-card px-2 text-muted-foreground">
                    {t('Auth.Login.OrContinueWith')}
                  </span>
                </div>
                {state?.message && <div className="mt-2 text-center text-sm text-red-500">{state.message}</div>}
                {state?.formError && <div className="mt-2 text-center text-sm text-red-500">{state.formError}</div>}
                {oAuthState?.message && (
                  <div className="mt-2 text-center text-sm text-red-500">{oAuthState.message}</div>
                )}
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="email">{t('Auth.Login.EmailLabel')}</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              type="email"
                              autoComplete="username"
                              placeholder={t('Auth.Login.EmailPlaceholder')}
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
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel htmlFor="password">{t('Auth.Login.PasswordLabel')}</FormLabel>
                            <Link
                              href="/auth/request-reset"
                              className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                              {t('Auth.Login.ForgotPassword')}
                            </Link>
                          </div>
                          <FormControl>
                            <Input id="password" type="password" autoComplete="current-password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="hidden">
                    <FormField
                      control={form.control}
                      name="csrfToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input id="csrfToken" type="hidden" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    formAction={formAction}
                    className="w-full cursor-pointer"
                    disabled={isPending || !form.formState.isValid || oAuthIsPending}
                  >
                    {isPending ? <Spinner /> : t('Auth.Login.Submit')}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {t('Auth.Login.NoAccount')}{' '}
                  <Link href="/auth/signup" className="underline underline-offset-4">
                    {t('Auth.Login.SignupLink')}
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
        {t('Auth.Login.AgreePrefix')} <a href="#">{t('Auth.Login.TermsOfService')}</a> {t('Auth.Login.And')}{' '}
        <a href="#">{t('Auth.Login.PrivacyPolicy')}</a>
        {t('Auth.Login.AgreeSuffix')}
      </div>
    </div>
  );
}
