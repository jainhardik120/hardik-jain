import React from 'react';

import '@/styles/globals.css';
import '@/styles/prosemirror.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import NextTopLoader from '@/components/top-loader';
import { Toaster } from '@/components/ui/toaster';
import { TRPCReactProvider } from '@/server/api/react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hardik Jain | Android & Web Developer',
  description:
    'Meet Hardik Jain, a skilled Android & Web Dev. Explore his projects, skills, and connect to collaborate.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.hardikja.in',
    title: 'Hardik Jain | Android & Web Developer',
    description:
      'Meet Hardik Jain, a skilled Android & Web Dev. Explore his projects, skills, and connect to collaborate.',
    images: [
      {
        url: 'https://storage.hardikja.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hardik Jain | Android & Web Developer',
      },
    ],
    siteName: 'Hardik Jain | Android & Web Developer',
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="google-site-verification" content="2UMpL0DOiAZPuJWyFgtSXWM49mkZ2jVdsX34ok6fDl0" />
      <body className="flex flex-col">
        <NuqsAdapter>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <NextTopLoader />
              {children}
              <SpeedInsights />
              <Toaster />
            </ThemeProvider>
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
      <GoogleAnalytics gaId="G-FXSDSMLGZ2" />
    </html>
  );
}
