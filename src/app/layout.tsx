import { SpeedInsights } from '@vercel/speed-insights/next';
import RootLayout from '@/components/root-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hardik Jain | Android & Web Developer',
  description:
    'Meet Hardik Jain, a skilled Android & Web Dev. Explore his projects, skills, and connect to collaborate.',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayout>
      {children}
      <SpeedInsights />
    </RootLayout>
  );
}
