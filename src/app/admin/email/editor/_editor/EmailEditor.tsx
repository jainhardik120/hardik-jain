'use client';

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import ComponentsPanel from './panels/ComponentsPanel';
import PropertiesPanel from './panels/PropertiesPanel';
import MiddlePanel from './panels/MiddlePanel';
import { LayoutProvider } from './ContextProvider';

const EmailEditor = () => {
  const [leftCollapsed, setLeftCollapsed] = React.useState(false);
  const [rightCollapsed, setRightCollapsed] = React.useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      <LayoutProvider>
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
