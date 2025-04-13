'use client';

import { Avatar } from '@repo/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@repo/ui/dropdown-menu';
import { SidebarMenuButton, useSidebar } from '@repo/ui/sidebar';
import { ChevronsUpDown } from 'lucide-react';

import RandomAvatarImage from '@/components/avatar-image';
import UserDropDown from '@/components/user-dropdown';

import type { User } from 'next-auth';

export function NavUser({ user }: { user: User | null }) {
  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <RandomAvatarImage src={user?.image} alt={user?.name} />
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user?.name}</span>
            <span className="truncate text-xs">{user?.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? 'bottom' : 'right'}
        align="start"
        sideOffset={4}
      >
        <UserDropDown user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
