import { getSettings } from '@/actions/settingActions';
import { Toaster } from '@/components/ui/sonner';
import { routing } from '@/i18n/routing';
import { AuthProvider } from '@/providers/AuthProvider';
import { CsrfProvider } from '@/providers/CsrfProvider';
import { ModelProvider } from '@/providers/ModelProvider';
import { SettingsProvider } from '@/providers/SettingsProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import '@/styles/globals.css';
import { LocaleParam } from '@/types/LocaleTypes';
import { createAnonClient } from '@/utils/supabase/server';
import type { Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Noto_Sans_JP } from 'next/font/google';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Script from 'next/script';

const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
});

export async function generateMetadata({ params }: { params: Promise<LocaleParam> }) {
  const { locale } = await params;
  setRequestLocale(locale); // ← 既に呼んでいれば不要
  const t = await getTranslations({ locale });

  // 例: App.appName = "My Stylish App"
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: {
      template: `%s | ${t('AppName')}`,
      default: t('AppName'),
    },
    openGraph: {
      siteName: t('AppName'),
      images: ['/og.png'],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/og.png'],
    },
    keywords: ['aivoke', 'ai', 'ai chat', 'chat', 'generative ai'],
    description: 'ai chat app',
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<LocaleParam>;
}>) {
  const { locale } = await params;
  const h = await headers();
  const initial = h.get('X-CSRF-Token') ?? null;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // SSG対応
  setRequestLocale(locale);

  // 言語ファイルの読み込み
  const messages = await getMessages();

  const nonce = h.get('x-nonce') ?? '';
  const settingData = await getSettings();
  const supabase = await createAnonClient();
  const { data } = await supabase.auth.getUser();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script id="webpack-nonce" nonce={nonce} dangerouslySetInnerHTML={{ __html: `__webpack_nonce__="${nonce}"` }} />
      </head>
      <body className={`${notoSansJP.variable} bg-muted font-noto antialiased`}>
        <Toaster />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <CsrfProvider initialToken={initial}>
              <AuthProvider userData={data?.user}>
                <SettingsProvider initialSettings={settingData}>
                  <ModelProvider>{children}</ModelProvider>
                </SettingsProvider>
              </AuthProvider>
            </CsrfProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
