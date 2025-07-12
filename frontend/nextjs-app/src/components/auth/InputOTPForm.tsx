'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ResendVerifyEmail, verifyEmail } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';
import { InputOTPFormSchema, InputOTPFormValues } from '@/schemas/authSchemas';
import { ResendMailState } from '@/types/authTypes';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Mail } from 'lucide-react';
import { startTransition, useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function InputOTPForm({
  email,
  className,
  ...props
}: React.ComponentProps<'div'> & { email?: string }) {
  const [state, formAction, isPending] = useActionState(verifyEmail, { error: null });
  const [resendState, resendEmail, resendPending] = useActionState<ResendMailState>(
    ResendVerifyEmail,
    {
      ok: false,
    }
  );

  const messages = {
    'invalid-email': 'Invalid email address. Please check it and try again.',
    'already-confirmed': 'This email address is already confirmed. Please log in instead.',
    'rate-limit': 'Too many requests. Please wait a while and try again.',
    network: 'Network error. Please check your internet connection and try again.',
    unknown: 'Failed to send. Please try again later.',
    success: 'Verification email sent successfully. Please check your inbox.',
  } as const;

  const message = resendState.code ? messages[resendState.code] : null;

  useEffect(() => {
    if (!resendState.code) return; // 初期レンダリング時は無視
    if (resendPending) return; // リクエスト中は無視
    toast.dismiss(); // 既存のトーストをクリア

    if (resendState.ok) {
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
  }, [resendState.ok, resendState.code, resendPending, message]);

  const form = useForm<InputOTPFormValues>({
    resolver: zodResolver(InputOTPFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      pin: '',
    },
  });

  const onValid = (data: InputOTPFormValues) => {
    const fd = new FormData();
    fd.append('pin', data.pin);

    startTransition(() => {
      formAction(fd);
    });
  };

  const resendMailHandler = () => {
    startTransition(async () => {
      await resendEmail();
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
          <CardTitle className="text-xl">Email Verification</CardTitle>
          <CardDescription>Please Enter the Code Sent to Your Email</CardDescription>
          <CardDescription className="flex items-center justify-center gap-2 pt-1">
            <Mail size={20} />
            {email ?? ''}
          </CardDescription>
          {state.error && (
            <div className="mt-2 text-center text-sm text-red-500">{state.error}</div>
          )}
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
                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={isSubmitting || isPending}
                  >
                    {isSubmitting || isPending ? (
                      <LoadingSpinner className="size-7" />
                    ) : (
                      'Send Code'
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Didn&apos;t receive the email?{' '}
                  <Button
                    type="button"
                    variant={'link'}
                    className="cursor-pointer underline"
                    onClick={resendMailHandler}
                  >
                    Resend Code
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
