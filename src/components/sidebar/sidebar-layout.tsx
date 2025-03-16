import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/sidebar';
import { AppSidebarData } from '@/types/constants';
import type { User } from 'next-auth';

export function SidebarLayout({
  children,
  user,
  defaultOpen,
}: Readonly<{
  children: React.ReactNode;
  user: User | null;
  defaultOpen: boolean;
}>): JSX.Element {
  return (
    <SidebarProvider defaultOpen={defaultOpen} className="w-full">
      <AppSidebar teams={AppSidebarData.teams} user={user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
