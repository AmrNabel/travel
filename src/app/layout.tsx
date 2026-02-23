import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { Providers } from '@/components/common/Providers';
import { AppShell } from '@/components/common/AppShell';
import { adminAuth } from '@/lib/firebase-admin';
import { poppins } from '@/theme/theme';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Mosafer — Connect Your Journey. Deliver a Smile.',
    template: '%s | Mosafer',
  },
  description:
    'Mosafer lets travelers earn by delivering items along their route, and helps senders deliver faster and cheaper via trusted travelers.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  applicationName: 'Mosafer',
  themeColor: '#1976d2',
};

type ServerUser = {
  id: string;
  name: string;
  email: string | null;
  photoURL?: string | null;
};

const SESSION_COOKIE_NAME = 'session';

async function getServerUser(): Promise<ServerUser | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

    const name =
      decoded.name ||
      decoded.email?.split('@')[0] ||
      decoded.uid.slice(0, 8) ||
      'User';

    const email = decoded.email ?? null;
    const photoURL = (decoded as any).picture ?? null;

    return {
      id: decoded.uid,
      name,
      email,
      photoURL,
    };
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const serverUser = await getServerUser();

  return (
    <html lang='ar' dir='rtl'>
      <body className={poppins.className}>
        <Providers>
          <AppShell initialUser={serverUser}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
