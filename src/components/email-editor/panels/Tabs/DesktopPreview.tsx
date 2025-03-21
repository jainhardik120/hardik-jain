import React from 'react';
import { useLayout } from '../../ContextProvider';

const DesktopPreview = () => {
  const { html } = useLayout();
  return (
    <div className="mx-auto max-w-2xl h-full border rounded-md bg-muted/20 flex items-center justify-center">
      <iframe srcDoc={html} className="h-full w-full border-none" />
    </div>
  );
};

export default DesktopPreview;
