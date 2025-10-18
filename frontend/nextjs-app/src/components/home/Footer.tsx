import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();
  return (
    <footer className="mt-16 flex flex-col items-center justify-center gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row">
      <p className="text-center">
        © {new Date().getFullYear()} {t('Home.Footer.Copyright')}
      </p>
    </footer>
  );
}
