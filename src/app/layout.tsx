import type { Metadata } from 'next';
import { Providers } from '@/components/common/Providers';
import { poppins } from '@/theme/theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'Firebase Travel - Connect Your Journey. Deliver a Smile.',
  description:
    "Turn your travel into a rewarding delivery route. Your journey helps someone's day!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
