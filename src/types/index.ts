import type { Route } from 'next';
import type { Skill, SubSkill } from '@prisma/client';
import type { LucideIcon } from 'lucide-react';
import type { ColumnSort, Row } from '@tanstack/react-table';
import type { z } from 'zod';

import type { DataTableConfig } from '@/config/data-table';
import type { filterSchema } from '@/lib/parsers';

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type StringKeyOf<TData> = Extract<keyof TData, string>;

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
  id: StringKeyOf<TData>;
}

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[];

export type ColumnType = DataTableConfig['columnTypes'][number];

export type FilterOperator = DataTableConfig['globalOperators'][number];

export type JoinOperator = DataTableConfig['joinOperators'][number]['value'];

export interface DataTableFilterField<TData> {
  id: StringKeyOf<TData>;
  label: string;
  placeholder?: string;
  options?: Option[];
}

export interface DataTableAdvancedFilterField<TData> extends DataTableFilterField<TData> {
  type: ColumnType;
}

export type Filter<TData> = Prettify<
  Omit<z.infer<typeof filterSchema>, 'id'> & {
    id: StringKeyOf<TData>;
  }
>;

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  type: 'update' | 'delete';
}

export type SidebarNavItem = {
  title: string;
  icon: LucideIcon;
} & (
  | { url: Route }
  | {
      items: {
        title: string;
        url: Route;
      }[];
    }
);

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
