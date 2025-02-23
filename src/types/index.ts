import type { Route } from 'next';
import type { Skill, SubSkill } from '@prisma/client';
import type { LucideIcon } from 'lucide-react';

export type SidebarNavItem = {
  title: string;
  url: Route;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: Route;
  }[];
};

export type Project = {
  name: string;
  url: string;
  icon: LucideIcon;
};

export type Team = {
  name: string;
  plan: string;
};

export type User = {
  name: string;
  email: string;
  avatar: string;
};

export interface SkillWithSubSkills extends Skill {
  skills: SubSkill[];
}

export interface BlogPostWithAuthor {
  id: string;
  createdAt: Date;
  title: string;
  slug: string;
  description: string;
  author: {
    name: string | null;
    id: string;
  };
}

export interface AppSidebarProps {
  teams: Team[];
  user: User;
}

export interface MainNavItem {
  title: string;
  href: Route;
}
