'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface TOCItem {
  id: string;
  text: string;
  level: number;
  isActive: boolean;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Find all headings in the article content
    const article = document.querySelector('article');
    if (!article) {
      return;
    }

    const headings = article.querySelectorAll('h2, h3, h4');
    const tocItems: TOCItem[] = [];

    headings.forEach((heading) => {
      // Ensure all headings have IDs for linking
      if (!heading.id) {
        const id =
          heading.textContent
            ?.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-') ?? `heading-${tocItems.length}`;
        heading.id = id;
      }

      tocItems.push({
        id: heading.id,
        text: heading.textContent ?? '',
        level: Number.parseInt(heading.tagName.substring(1)),
        isActive: false,
      });
    });

    setToc(tocItems);

    // Set up intersection observer to highlight active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -80% 0px',
        threshold: 0.1,
      },
    );

    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, []);

  if (toc.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
      <nav>
        <ul className="space-y-2 text-sm">
          {toc.map((item) => (
            <li
              key={item.id}
              className={cn(
                'transition-colors',
                item.level === 2 ? 'ml-0' : item.level === 3 ? 'ml-4' : 'ml-8',
              )}
            >
              <a
                href={`#${item.id}`}
                className={cn(
                  'block py-1 hover:text-primary transition-colors',
                  activeId === item.id ? 'text-primary font-medium' : 'text-muted-foreground',
                )}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
