import { AppSidebar } from '@/components/layout/AppSidebar';
import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { SidebarProvider } from '@/components/ui/sidebar';
import '@/styles/globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="relative w-full">
        <HeaderWrapper />
        {children}
      </main>
    </SidebarProvider>
  );
}
