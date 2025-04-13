import React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@repo/ui/sidebar';

import { NavUser } from '@/components/sidebar/sidebar-user';
import type { AppSidebarProps } from '@/types';

import { NavMain } from './sidebar-nav-main';
import { TeamSwitcher } from './sidebar-team-switcher';

export function AppSidebar({ user, teams }: AppSidebarProps) {
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
