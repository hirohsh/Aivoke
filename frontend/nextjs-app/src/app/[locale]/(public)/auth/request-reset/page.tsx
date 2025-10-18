import { RequestResetForm } from '@/components/auth/RequestResetForm';

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 bg-muted p-6 3xl:min-h-svh md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <RequestResetForm />
      </div>
    </div>
  );
}
