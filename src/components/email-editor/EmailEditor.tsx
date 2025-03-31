'use client';

import React, { useState } from 'react';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDebouncedCallback } from 'use-debounce';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useTextStore } from '@/hooks/useTextStore';
import { api } from '@/server/api/react';

import { LayoutProvider } from './ContextProvider';
import ComponentsPanel from './panels/ComponentsPanel';
import MiddlePanel from './panels/MiddlePanel';
import PropertiesPanel from './panels/PropertiesPanel';

import type { Layout } from './types';
import type { EmailTemplate } from '@prisma/client';

const EmailEditor = ({
  initialLayout,
  emailTemplate,
}: {
  initialLayout: Layout;
  emailTemplate: EmailTemplate;
}) => {
  const setText = useTextStore((state) => state.setText);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const updateLayoutInDb = api.email.updateEmailTemplate.useMutation();
  const debouncedSave = useDebouncedCallback(async (content: Layout) => {
    setText('Saving...');
    await updateLayoutInDb.mutateAsync({
      id: emailTemplate.id,
      title: emailTemplate.title,
      layout: JSON.stringify(content),
    });
    setText('');
  }, 500);
  return (
    <DndProvider backend={HTML5Backend}>
      <LayoutProvider
        initialLayout={initialLayout}
        updateLayoutInDb={async (layout) => {
          await debouncedSave(layout);
        }}
      >
        <div className="h-full w-full">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              defaultSize={20}
              minSize={leftCollapsed ? 0 : 15}
              collapsible={true}
              collapsedSize={0}
              onCollapse={() => setLeftCollapsed(true)}
              onExpand={() => setLeftCollapsed(false)}
              className={leftCollapsed ? '' : 'min-w-[16rem]'}
            >
              {!leftCollapsed && <ComponentsPanel />}
            </ResizablePanel>

            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60}>
              <MiddlePanel />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel
              defaultSize={20}
              minSize={rightCollapsed ? 0 : 15}
              collapsible={true}
              collapsedSize={0}
              onCollapse={() => setRightCollapsed(true)}
              onExpand={() => setRightCollapsed(false)}
              className={rightCollapsed ? '' : 'min-w-[16rem]'}
            >
              {!rightCollapsed && <PropertiesPanel />}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </LayoutProvider>
    </DndProvider>
  );
};
export default EmailEditor;
