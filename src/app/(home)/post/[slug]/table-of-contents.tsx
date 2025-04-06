'use client';

import { useEffect, useState, useRef } from 'react';

import { cn } from '@/lib/utils';
import type { TOCItem } from '@/server/api/routers/post';

export default function TableOfContents({ toc }: { toc: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? '');
  const tocListRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (toc.length === 0) {
      return;
    }
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

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      toc.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [toc]);

  useEffect(() => {
    if (activeItemRef.current && tocListRef.current) {
      const tocContainer = tocListRef.current;
      const activeItem = activeItemRef.current;
      const containerRect = tocContainer.getBoundingClientRect();
      const activeItemRect = activeItem.getBoundingClientRect();
      const isAboveViewport = activeItemRect.top < containerRect.top;
      const isBelowViewport = activeItemRect.bottom > containerRect.bottom;
      if (isAboveViewport) {
        tocContainer.scrollTop = activeItem.offsetTop - tocContainer.offsetTop - 12;
      } else if (isBelowViewport) {
        tocContainer.scrollTop =
          activeItem.offsetTop +
          activeItem.clientHeight -
          (tocContainer.offsetTop + tocContainer.clientHeight) +
          12;
      }
    }
  }, [activeId]);

  const handleScrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  if (toc.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
      <nav>
        <div ref={tocListRef} className="lg:max-h-[80vh] overflow-y-auto pr-2 no-scrollbar">
          <ul className="space-y-2 text-sm">
            {toc.map((item) => (
              <li
                key={item.id}
                ref={activeId === item.id ? activeItemRef : null}
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
                    handleScrollToHeading(item.id);
                  }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
