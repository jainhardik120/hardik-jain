import { ModeToggle } from '@/components/sidebar/theme-toggle';
import React from 'react';
import { MobileNav } from './site-nav-mobile';
import { MainNav } from './site-main-nav';
import { CommandMenu } from '../command-menu';
import UserButton from './user-button';
import type { Session } from 'next-auth';
import { MainNavData } from '@/types/constants';

const Header = ({ session }: { session: Session | null }) => {
  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
        <div className="flex h-14 items-center px-4">
          <MainNav links={MainNavData} />
          <MobileNav links={MainNavData} />
          <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <CommandMenu />
            </div>
            <UserButton session={session} />
            <ModeToggle />
          </div>
        </div>
      </header>
      <div className="min-h-14"></div>
    </>
  );
};

export default Header;
