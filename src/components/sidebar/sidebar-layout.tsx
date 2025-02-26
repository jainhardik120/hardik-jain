import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/sidebar';
import type { User } from '@/types';
import { AppSidebarData } from '@/types';

export function SidebarLayout({
  children,
  user,
  defaultOpen,
}: Readonly<{
  children: React.ReactNode;
  user: User;
  defaultOpen: boolean;
}>) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar teams={AppSidebarData.teams} user={user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
