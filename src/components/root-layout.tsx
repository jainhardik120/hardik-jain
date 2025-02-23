import React from 'react';
import '@/styles/globals.css';
import '@/styles/prosemirror.css';
import { TRPCReactProvider } from '@/server/api/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';

export default function rootLayout({ children }: { children: React.ReactNode }): JSX.Element {
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
            {children}
            <Toaster />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
