import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import '@/styles/globals.css';
import { headers } from 'next/headers';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? '';
  return (
    <>
      <HeaderWrapper nonce={nonce} />
      {children}
    </>
  );
}
