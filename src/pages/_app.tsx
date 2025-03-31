import '@/styles/globals.css';
import '@/styles/prosemirror.css';
import type { AppType } from 'next/app';

import { ThemeProvider } from 'next-themes';

import { trpc } from '@/server/api/pages';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default trpc.withTRPC(MyApp);
