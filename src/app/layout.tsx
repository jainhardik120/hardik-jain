import React from 'react';
import '@/styles/globals.css';
import '@/styles/prosemirror.css';
import { TRPCReactProvider } from '@/server/api/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import NextTopLoader from '@/components/top-loader';

export const metadata: Metadata = {
  title: 'Hardik Jain | Android & Web Developer',
  description:
    'Meet Hardik Jain, a skilled Android & Web Dev. Explore his projects, skills, and connect to collaborate.',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-screen flex flex-col">
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader />
            {children}
            <SpeedInsights />
            <Toaster />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
