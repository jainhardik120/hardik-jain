import React from 'react';

import { MainNavData } from '@/types/constants';

import { CommandMenu } from './command-menu';
import { MainNav } from './site-main-nav';
import { MobileNav } from './site-nav-mobile';
import { ModeToggle } from './theme-toggle';
import UserButton from './user-button';

import type { User } from 'next-auth';

const Header = ({ loading, user }: { loading: boolean; user: User | null }) => {
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
            <UserButton loading={loading} user={user} />
            <ModeToggle />
          </div>
        </div>
      </header>
      <div className="min-h-14"></div>
    </>
  );
};

export default Header;
