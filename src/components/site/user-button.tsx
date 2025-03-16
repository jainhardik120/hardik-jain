import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SignIn } from '../sidebar/auth-components';
import UserDropDown from '../user-dropdown';
import type { User } from 'next-auth';
import RandomAvatarImage from '@/lib/avatar-image';

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
