import * as React from 'react';

import { NavUser } from '@/components/sidebar/sidebar-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavMain } from './sidebar-nav-main';
import { TeamSwitcher } from './sidebar-team-switcher';
import type { AppSidebarProps } from '@/types';

export function AppSidebar({ user, teams }: AppSidebarProps): JSX.Element {
  return (
    <Sidebar>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser user={user} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
