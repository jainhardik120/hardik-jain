import React from 'react';
import { useLayout } from '../../ContextProvider';

const MobilePreview = () => {
  const { html } = useLayout();

  return (
    <div className="mx-auto w-[30rem] h-full border rounded-md bg-muted/20 flex items-center justify-center">
      <iframe srcDoc={html} className="h-full w-full border-none" />
    </div>
  );
};

export default MobilePreview;
