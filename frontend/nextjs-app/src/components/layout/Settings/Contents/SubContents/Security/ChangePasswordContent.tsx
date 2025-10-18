'use client';

import { updatePassword } from '@/actions/authActions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useMutationToast } from '@/hooks/useMutationToast';
import { useRouter } from '@/i18n/routing';
import { useSettings } from '@/providers/SettingsProvider';
import { updatePasswordSchema } from '@/schemas/authSchemas';
import type { AuthState, UpdatePasswordFormValues } from '@/types/authTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { startTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';

export function ChangePasswordContent() {
  const t = useTranslations();
  const { popBreadcrumbMenuList, setActiveSubMenu } = useSettings();
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(updatePassword, { ok: false });
  const router = useRouter();

  const onSuccess = () => {
    router.push('/auth/login');
  };

  useMutationToast({
    state: state,
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

  const handleBack = () => {
    setActiveSubMenu(null);
    popBreadcrumbMenuList();
  };

  const form = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    mode: 'onSubmit',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onValid(values: UpdatePasswordFormValues) {
    const fd = new FormData();
    fd.append('currentPassword', values.currentPassword);
    fd.append('newPassword', values.newPassword);
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
    <>
      <div className="flex w-full justify-between">
        <div>{t('Settings.Security.ChangePassword')}</div>
        <Button variant="ghost" type="button" size="icon" onClick={handleBack} className="cursor-pointer">
          <ArrowLeft />
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onValid)} className="my-4">
          {state.message && <div className="mt-2 text-center text-sm text-red-500">{state.message}</div>}
          {state.formError && <div className="mt-2 text-center text-sm text-red-500">{state.formError}</div>}
          <div className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <FormField
                  control={control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="currentPassword">{t('Settings.Security.CurrentPassword')}</FormLabel>
                      <FormControl>
                        <Input
                          id="currentPassword"
                          type="password"
                          autoComplete="current-password"
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
                  control={control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="newPassword">{t('Settings.Security.NewPassword')}</FormLabel>
                      <FormControl>
                        <Input
                          id="newPassword"
                          title={t('Settings.Security.NewPasswordTitle')}
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
                      <FormLabel htmlFor="confirmPassword">{t('Settings.Security.ConfirmPassword')}</FormLabel>
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
              <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting || isPending || state.ok}>
                {isSubmitting || isPending ? <Spinner /> : t('Settings.Security.Submit')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
