'use client';

import Link from 'next/link';

import { BadgeCheck, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

import RandomAvatarImage from '@/components/avatar-image';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import type { User } from 'next-auth';

export default function UserDropDown({ user }: { user: User | null }) {
  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <RandomAvatarImage src={user?.image} alt={user?.name} />
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user?.name}</span>
            <span className="truncate text-xs">{user?.email}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href="/admin/account">
            <BadgeCheck />
            Account
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={async () => {
          await signOut();
        }}
      >
        <LogOut />
        Log out
      </DropdownMenuItem>
    </>
  );
}
