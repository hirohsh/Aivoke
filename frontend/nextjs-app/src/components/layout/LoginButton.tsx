'use client';
import { Link } from '@/i18n/routing';
import { LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';

export function LoginButton() {
  const t = useTranslations();
  return (
    <Button asChild variant="outline">
      <Link href="/auth/login">
        <LogIn />
        {t('Auth.Login.Submit')}
      </Link>
    </Button>
  );
}
