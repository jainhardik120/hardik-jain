'use client';

import { useEffect, useRef } from 'react';

import hljs from 'highlight.js';

export default function CodeHighlight({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current === null) {
      return;
    }

    const preElements = contentRef.current.querySelectorAll('pre');

    preElements.forEach((preEl) => {
      if (preEl.dataset?.['processed'] === 'true') {
        return;
      }

      if (preEl.dataset !== undefined) {
        preEl.dataset['processed'] = 'true';
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'relative rounded-lg border border-border my-6';

      const header = document.createElement('div');
      header.className = 'flex items-center justify-between px-4 py-2';

      let language = 'code';
      const codeEl = preEl.querySelector('code');
      if (codeEl && codeEl.className) {
        const langMatch = codeEl.className.match(/language-(\w+)/);
        if (langMatch) {
          language = langMatch[1] ?? 'code';
        }
      }
      if (codeEl !== null) {
        codeEl.className = `${codeEl.className} !important rounded-none`;
      }
      const langBadge = document.createElement('span');
      langBadge.className = 'text-xs font-mono text-gray-400';
      langBadge.textContent = language;
      header.appendChild(langBadge);

      const copyBtn = document.createElement('button');
      copyBtn.className =
        'copy-btn flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors';
      copyBtn.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy</span>';
      copyBtn.onclick = () => {
        void navigator.clipboard.writeText(codeEl?.textContent ?? '').then(() => {
          const span = copyBtn.querySelector('span');
          if (span === null) {
            return;
          }
          const originalText = span.textContent;
          span.textContent = 'Copied!';
          setTimeout(() => {
            span.textContent = originalText;
          }, 2000);
        });
      };
      header.appendChild(copyBtn);

      preEl.className = 'p-0 m-0 overflow-x-auto rounded-b-lg';

      wrapper.appendChild(header);

      preEl.parentNode?.insertBefore(wrapper, preEl);
      wrapper.appendChild(preEl);
    });

    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="prose prose-slate dark:prose-invert max-w-none post-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
