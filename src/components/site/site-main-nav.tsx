import Link from 'next/link';
import type { MainNavItem } from '@/types';

export function MainNav({ links }: { links: MainNavItem[] }) {
  return (
    <div className="mr-4 hidden md:flex items-center">
      <Link href="/" className="text-xl font-semibold mr-4 lg:mr-6">
        Hardik Jain
      </Link>
      <nav className="flex gap-4 items-center xl:gap-6">
        {links
          .filter((item) => item.href !== '/')
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground/80 text-foreground/80"
            >
              {item.title}
            </Link>
          ))}
      </nav>
    </div>
  );
}
