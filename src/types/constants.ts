import {
  Github,
  Instagram,
  Linkedin,
  MailIcon,
  Frame,
  Image,
  Briefcase,
  FileText,
  Mail,
  Users,
} from 'lucide-react';

import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  InstagramLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons';
import type { Route } from 'next';
import type { MainNavItem, Team, Project, SidebarNavItem } from '.';

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

export const AppSidebarData: {
  teams: Team[];
  navItems: SidebarNavItem[];
  projects: Project[];
} = {
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
      icon: Image,
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
      title: 'Portfolio',
      icon: Briefcase,
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
    {
      title: 'Posts',
      url: '/admin/post' as Route,
      icon: FileText,
    },
    {
      title: 'Messages',
      url: '/admin/messages' as Route,
      icon: Mail,
    },
    {
      title: 'Users',
      url: '/admin/users' as Route,
      icon: Users,
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
