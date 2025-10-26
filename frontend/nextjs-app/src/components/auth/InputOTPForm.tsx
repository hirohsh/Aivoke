'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { resendVerifyEmail, verifyEmail } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useMutationToast } from '@/hooks/useMutationToast';
import { cn } from '@/lib/utils';
import { useCsrf } from '@/providers/CsrfProvider';
import { InputOTPFormSchema } from '@/schemas/authSchemas';
import type { AuthState, InputOTPFormValues } from '@/types/authTypes';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { startTransition, useActionState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Spinner } from '../ui/spinner';

export function InputOTPForm({ email, className, ...props }: React.ComponentProps<'div'> & { email?: string }) {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(verifyEmail, { ok: false });
  const [resendState, resendEmail, resendPending] = useActionState<AuthState, FormData>(resendVerifyEmail, {
    ok: false,
  });
  const t = useTranslations();
  const { token } = useCsrf();

  useMutationToast({
    state: resendState,
    pending: resendPending,
    toastOptions: {
      duration: 10000,
      position: 'top-center',
      action: {
        label: t('Common.Close'),
        onClick: () => {},
      },
    },
  });

  const form = useForm<InputOTPFormValues>({
    resolver: zodResolver(InputOTPFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      pin: '',
      csrfToken: token || '',
    },
  });

  const onValid = (data: InputOTPFormValues) => {
    const fd = new FormData();
    fd.append('pin', data.pin);
    fd.append('csrfToken', data.csrfToken);

    startTransition(() => {
      formAction(fd);
    });
  };

  const resendMailHandler = () => {
    const fd = new FormData();
    fd.append('csrfToken', token || '');
    startTransition(async () => {
      await resendEmail(fd);
    });
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  return (
    <div className={cn('relative flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('Auth.MailConfirmation.Title')}</CardTitle>
          <CardDescription>{t('Auth.MailConfirmation.Description')}</CardDescription>
          <CardDescription className="flex items-center justify-center gap-2 pt-1">
            <Mail size={20} />
            {email ?? ''}
          </CardDescription>
          {state.message && <div className="mt-2 text-center text-sm text-red-500">{state.message}</div>}
          {state.formError && <div className="mt-2 text-center text-sm text-red-500">{state.formError}</div>}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onValid)} className="w-full space-y-6">
              <div className="grid w-full gap-6">
                <div className="grid w-full gap-6">
                  <div className="grid w-full gap-3">
                    <FormField
                      control={control}
                      name="pin"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputOTP
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              maxLength={6}
                              pattern={REGEXP_ONLY_DIGITS}
                              autoFocus
                              {...field}
                            >
                              <div className="flex w-full justify-center">
                                <InputOTPGroup>
                                  <InputOTPSlot index={0} />
                                  <InputOTPSlot index={1} />
                                  <InputOTPSlot index={2} />
                                  <InputOTPSlot index={3} />
                                  <InputOTPSlot index={4} />
                                  <InputOTPSlot index={5} />
                                </InputOTPGroup>
                              </div>
                            </InputOTP>
                          </FormControl>
                          <FormMessage className="py-2 text-center" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting || isPending}>
                    {isSubmitting || isPending ? <Spinner /> : t('Auth.MailConfirmation.Submit')}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {t('Auth.MailConfirmation.NotReceived')}{' '}
                  <Button
                    type="button"
                    variant={'link'}
                    className="cursor-pointer underline"
                    onClick={resendMailHandler}
                  >
                    {t('Auth.MailConfirmation.Resend')}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
