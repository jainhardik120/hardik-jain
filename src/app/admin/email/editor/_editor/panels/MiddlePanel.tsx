'use client';

import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { TabLists } from './Tabs/TabLists';
import HTMLCode from './Tabs/HTMLCode';
import JSONCode from './Tabs/JSONCode';
import MobilePreview from './Tabs/MobilePreview';
import DesktopPreview from './Tabs/DesktopPreview';
import DragDropEditor from './Tabs/DragDropEditor';

const MiddlePanel = () => {
  return (
    <Tabs defaultValue="editor" className="h-full flex flex-col p-4 gap-y-4">
      <div className="mx-auto">
        <TabLists />
      </div>
      <div className="flex-1 h-full">
        <TabsContent value="editor" className="h-full mt-0">
          <DragDropEditor />
        </TabsContent>
        <TabsContent value="mobile" className="h-full mt-0">
          <MobilePreview />
        </TabsContent>
        <TabsContent value="desktop" className="h-full mt-0">
          <DesktopPreview />
        </TabsContent>
        <TabsContent value="json" className="h-full mt-0">
          <JSONCode />
        </TabsContent>
        <TabsContent value="html" className="h-full mt-0 flex flex-col">
          <HTMLCode />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default MiddlePanel;
