import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { I18N_KEYS } from '@/lib/constants';
import { createAnonClient } from '@/utils/supabase/server';
import { getTranslations } from 'next-intl/server';

export default async function ResetPasswordPage() {
  const t = await getTranslations();
  const supabase = await createAnonClient();
  const { data } = await supabase.auth.getUser();
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 bg-muted p-6 3xl:min-h-svh md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <ResetPasswordForm authErrorMsg={data?.user ? undefined : t(I18N_KEYS.Common.Fallback)} />
      </div>
    </div>
  );
}
