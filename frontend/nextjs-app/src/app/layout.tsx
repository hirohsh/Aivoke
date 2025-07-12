import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import { headers } from 'next/headers';
import Script from 'next/script';

const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Aivoke',
  description: 'generative ai developer app',
  keywords: 'next, react, app, ai, developer, generative ai',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? '';
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <Script
          id="webpack-nonce"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: `__webpack_nonce__="${nonce}"` }}
        />
      </head>
      <body className={`${notoSansJP.variable} bg-muted font-noto antialiased`}>
        <Toaster />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
