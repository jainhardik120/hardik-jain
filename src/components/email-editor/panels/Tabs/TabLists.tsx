'use client';

import {
  Pencil as PencilIcon,
  Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon,
  Code as CodeIcon,
  FileCode as FileCodeIcon,
} from 'lucide-react';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';

export const TabLists = () => {
  return (
    <TabsList>
      <TabsTrigger value="editor" className="flex items-center gap-1">
        <PencilIcon className="h-4 w-4" />
        <span>Editor</span>
      </TabsTrigger>
      <TabsTrigger value="desktop" className="flex items-center gap-1">
        <MonitorIcon className="h-4 w-4" />
        <span className="lg:inline hidden data-[state=active]:inline">Desktop</span>
      </TabsTrigger>
      <TabsTrigger value="mobile" className="flex items-center gap-1">
        <SmartphoneIcon className="h-4 w-4" />
        <span className="lg:inline hidden data-[state=active]:inline">Mobile</span>
      </TabsTrigger>
      <TabsTrigger value="json" className="flex items-center gap-1">
        <FileCodeIcon className="h-4 w-4" />
        <span className="lg:inline hidden data-[state=active]:inline">JSON</span>
      </TabsTrigger>
      <TabsTrigger value="html" className="flex items-center gap-1">
        <CodeIcon className="h-4 w-4" />
        <span className="lg:inline hidden data-[state=active]:inline">HTML</span>
      </TabsTrigger>
    </TabsList>
  );
};
