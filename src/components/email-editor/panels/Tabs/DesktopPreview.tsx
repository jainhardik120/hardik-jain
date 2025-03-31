import React from 'react';

import { useLayout } from '@/components/email-editor/ContextProvider';

const DesktopPreview = () => {
  const { html } = useLayout();
  return (
    <div className="w-full h-full border rounded-md bg-muted/20 flex items-center justify-center">
      <iframe title="Email Desktop Preview" srcDoc={html} className="h-full w-full border-none" />
    </div>
  );
};

export default DesktopPreview;
