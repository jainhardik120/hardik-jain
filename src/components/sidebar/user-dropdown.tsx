'use client';

import { BadgeCheck } from 'lucide-react';
// import { BadgeCheck, LogOut } from 'lucide-react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { User } from '@/types';
// import { serverSignOut } from './auth-actions';

export default function UserDropDown({ user }: { user: User }) {
  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <BadgeCheck />
          Account
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      {/* <DropdownMenuItem
        onClick={async () => {
          await serverSignOut();
        }}
      >
        <LogOut />
        Log out
      </DropdownMenuItem> */}
    </>
  );
}
