import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SignIn } from './auth-components';
import UserDropDown from './user-dropdown';
import type { Session } from 'next-auth';

export default function UserButton({ session }: { session: Session | null }) {
  if (!session?.user) {
    return <SignIn />;
  }
  const user = {
    name: session?.user.name ?? '',
    email: session?.user.email ?? '',
    avatar:
      session?.user.image ??
      `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000) + 1}&randomizeIds=true`,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={user.name} />
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
