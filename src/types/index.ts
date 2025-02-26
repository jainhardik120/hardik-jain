import type { Route } from 'next';
import type { Skill, SubSkill } from '@prisma/client';
import {
  Github,
  Instagram,
  Linkedin,
  MailIcon,
  Frame,
  SquareTerminal,
  type LucideIcon,
} from 'lucide-react';

import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  InstagramLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons';

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

export const AchievementsList = [
  {
    metric: 'Projects',
    value: '20',
    postfix: '+',
  },
  {
    prefix: '~',
    metric: 'Users',
    value: '5000',
  },
  {
    metric: 'Years',
    value: '3',
  },
];

export const Socials = [
  {
    icon: GitHubLogoIcon,
    href: 'https://github.com/jainhardik120',
    alt: 'GitHub',
  },
  {
    icon: LinkedInLogoIcon,
    href: 'https://linkedin.com/in/jainhardik120',
    alt: 'LinkedIn',
  },
  {
    icon: InstagramLogoIcon,
    href: 'https://instagram.com/_.hardikj',
    alt: 'Instagram',
  },
  {
    icon: TwitterLogoIcon,
    href: 'https://twitter.com/jainhardik17',
    alt: 'Twitter',
  },
];

export const ContactMethods = [
  {
    href: 'mailto:jainhardik120@gmail.com',
    label: 'Mail',
    icon: MailIcon,
  },
  {
    href: 'https://github.com/jainhardik120',
    label: 'GitHub',
    icon: Github,
  },
  {
    href: 'https://instagram.com/_.hardikj',
    label: 'Instagram',
    icon: Instagram,
  },
  {
    href: 'https://linkedin.com/in/jainhardik120',
    label: 'LinkedIn',
    icon: Linkedin,
  },
];

export const MainNavData: MainNavItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Blog',
    href: '/blog/1' as Route,
  },
];

export const AppSidebarData = {
  teams: [
    {
      name: 'Acme Inc',
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      plan: 'Free',
    },
  ],
  navItems: [
    {
      title: 'Media',
      url: '/admin/media' as Route,
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Canva Designs',
          url: '/admin/media/images' as Route,
        },
        {
          title: 'Diagrams',
          url: '/admin/media/diagrams' as Route,
        },
        {
          title: 'Uploaded Media',
          url: '/admin/media/uploaded-media' as Route,
        },
      ],
    },
    {
      title: 'Blog',
      url: '/admin/posts' as Route,
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Posts',
          url: '/admin/post' as Route,
        },
      ],
    },
    {
      title: 'Messages',
      url: '/admin/messages' as Route,
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Contact Messages',
          url: '/admin/messages' as Route,
        },
      ],
    },
    {
      title: 'Portfolio',
      url: '/admin/project' as Route,
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'Projects',
          url: '/admin/project' as Route,
        },
        {
          title: 'Skills',
          url: '/admin/skill' as Route,
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
  ],
};
