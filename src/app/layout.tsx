import type { Metadata } from 'next';
import { Providers } from '@/components/common/Providers';
import { AppShell } from '@/components/common/AppShell';
import { poppins } from '@/theme/theme';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Mosafer — Connect Your Journey. Deliver a Smile.',
    template: '%s | Mosafer',
  },
  description:
    "CarryOn lets travelers earn by delivering items along their route, and helps senders deliver faster and cheaper via trusted travelers.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  applicationName: 'Mosafer',
  themeColor: '#1976d2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={poppins.className}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
