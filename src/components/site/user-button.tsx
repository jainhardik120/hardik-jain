import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserDropDown from '@/components/user-dropdown';
import RandomAvatarImage from '@/lib/avatar-image';

import { SignIn } from './auth-components';

import type { User } from 'next-auth';

export default function UserButton({ loading, user }: { loading: boolean; user: User | null }) {
  if (loading) {
    return <></>;
  }
  if (!user) {
    return <SignIn />;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8">
          <RandomAvatarImage src={user.image} alt={user.name} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="end"
        forceMount
      >
        <UserDropDown user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
