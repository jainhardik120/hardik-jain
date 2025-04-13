import React from 'react';

import Link from 'next/link';

import { Button } from '@repo/ui/button';
import { type Route } from 'next';

const footerLinks: { title: string; href: Route }[] = [
  {
    title: 'Admin Home',
    href: '/admin',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
  {
    title: 'Home',
    href: '/',
  },
];

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border/40 py-6 dark:border-border sm:px-8 sm:py-0">
      <div className="w-full px-4 mx-auto flex flex-col items-center justify-between gap-4 sm:min-h-24 sm:flex-row-reverse">
        <div className="grid md:grid-cols-2 sm:my-4 gap-x-8 w-full sm:w-auto">
          {footerLinks.map((link) => (
            <Button variant="link" asChild key={link.href} className="sm:justify-start">
              <Link href={link.href}>{link.title}</Link>
            </Button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-8">
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <span className="text-lg font-semibold">Hardik Jain</span>{' '}
          </p>
          <p>All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
