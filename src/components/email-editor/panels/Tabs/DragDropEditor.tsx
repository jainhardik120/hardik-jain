import React from 'react';

import RenderComponentList, {
  isItemContainer,
} from '@/components/email-editor/components/RenderComponentList';
import { useLayout } from '@/components/email-editor/ContextProvider';
import { type LayoutItem } from '@/components/email-editor/types';

const DragDropEditor = () => {
  const { layout, updateLayout, setSelectedComponentId } = useLayout();

  const handleDrop = (item: LayoutItem, parentId: string, index: number) => {
    if (item.id === 'new-component') {
      updateLayout({
        type: 'ADD_COMPONENT',
        payload: {
          component: {
            id: '',
            type: item.type,
            editDisabled: false,
            props: {},
            ...(isItemContainer(item) ? { children: [] } : {}),
          },
          parentId,
          index,
        },
      });
    } else {
      updateLayout({
        type: 'MOVE_COMPONENT',
        payload: {
          id: item.id,
          parentId,
          index,
        },
      });
    }
  };

  return (
    <div className="w-full h-full border" onClick={() => setSelectedComponentId('root')}>
      <RenderComponentList items={layout.items} type="root" parentId="root" onDrop={handleDrop} />
    </div>
  );
};

export default DragDropEditor;
