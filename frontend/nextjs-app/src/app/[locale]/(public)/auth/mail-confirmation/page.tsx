import { InputOTPForm } from '@/components/auth/InputOTPForm';
import { getCurrentLocale } from '@/lib/server/Locale';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function MailConfirmationPage() {
  const email = (await cookies()).get('signup_email')?.value ?? null;

  if (!email) {
    const locale = await getCurrentLocale();
    redirect(`/${locale}/auth/signup`);
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 px-6 3xl:min-h-svh md:px-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <InputOTPForm email={email} />
      </div>
    </div>
  );
}
