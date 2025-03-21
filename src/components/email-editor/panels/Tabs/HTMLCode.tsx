import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useLayout } from '../../ContextProvider';

const HTMLCode = () => {
  const { html } = useLayout();
  const codeRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [html]);
  return (
    <div className="flex-1 border rounded-md bg-muted/20 p-4 font-mono text-sm flex flex-col overflow-hidden">
      <pre className="whitespace-pre-wrap break-words">
        <code ref={codeRef}>{html}</code>
      </pre>
    </div>
  );
};

export default HTMLCode;
