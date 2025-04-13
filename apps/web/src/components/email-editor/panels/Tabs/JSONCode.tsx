import React, { useEffect, useRef } from 'react';

import hljs from 'highlight.js';

import 'highlight.js/styles/atom-one-dark.css';

import { useLayout } from '@/components/email-editor/ContextProvider';
import { type Layout } from '@/components/email-editor/types';

const JSONCode = () => {
  const { layout } = useLayout();
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [layout]);

  const formatJSON = (layout: Layout) => {
    try {
      return JSON.stringify(layout, null, 2);
    } catch {
      return JSON.stringify(layout);
    }
  };

  return (
    <div className="flex-1 border rounded-md bg-muted/20 p-4 font-mono text-sm flex flex-col overflow-hidden">
      <pre className="whitespace-pre-wrap break-words">
        <code ref={codeRef} className="language-json">
          {formatJSON(layout)}
        </code>
      </pre>
    </div>
  );
};

export default JSONCode;
