import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border/40 py-6 dark:border-border md:px-8 md:py-0">
      <div className="w-full px-4 mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-8">
          <p className="text-lg font-semibold">Hardik Jain</p>
          <p>All rights reserved</p>
        </div>
        <Link
          href="/admin"
          className="text-[color:var(--primary)] hover:text-[color:var(--primary-foreground)] transition duration-300 ease-in-out"
          prefetch={false}
        >
          Admin Home Page
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
