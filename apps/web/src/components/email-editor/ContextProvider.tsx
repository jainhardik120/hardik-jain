'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { renderLayoutToHtml } from './components/DynamicEmailComponent';

import type { RootProps, Layout, LayoutItem } from './types';

const generateId = () => `id-${Math.random().toString(36).substring(2, 9)}`;

type LayoutAction =
  | { type: 'ADD_COMPONENT'; payload: { component: LayoutItem; parentId: string; index: number } }
  | { type: 'MOVE_COMPONENT'; payload: { id: string; parentId: string; index: number } }
  | { type: 'REMOVE_COMPONENT'; payload: { id: string } };

interface LayoutContextType {
  layout: Layout;
  html: string;
  updateSelectedComponentProps: (layoutItem: LayoutItem) => void;
  updateRootProps: (newProps: RootProps) => void;
  updateLayout: (action: LayoutAction) => void;
  selectedComponentId: string;
  setSelectedComponentId: (id: string) => void;
  selectedComponent: LayoutItem | null;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

const findItemById = (
  items: LayoutItem[],
  id: string,
): { item: LayoutItem | null; parent: LayoutItem | null; index: number } => {
  for (let i = 0; i < items.length; i++) {
    if (items[i]?.id === id) {
      return { item: items[i] ?? null, parent: null, index: i };
    }

    if (items[i]?.children !== undefined) {
      const result = findItemById(items[i]?.children ?? [], id);
      if (result.item) {
        return result.parent ? result : { ...result, parent: items[i] ?? null };
      }
    }
  }

  return { item: null, parent: null, index: -1 };
};

const cloneLayout = (layout: Layout): Layout => {
  return JSON.parse(JSON.stringify(layout)) as Layout;
};

const removeItemFromParent = (
  items: LayoutItem[],
  id: string,
): { newItems: LayoutItem[]; removedItem: LayoutItem | null } => {
  const { item, parent, index } = findItemById(items, id);

  if (!item) {
    return { newItems: items, removedItem: null };
  }

  if (!parent) {
    const newItems = [...items];
    const [removedItem] = newItems.splice(index, 1);
    return { newItems, removedItem: removedItem ?? null };
  }

  const newItems = [...items];
  const { item: foundParent } = findItemById(newItems, parent.id);

  if (foundParent && foundParent.children) {
    const [removedItem] = foundParent.children.splice(index, 1);
    return { newItems, removedItem: removedItem ?? null };
  }

  return { newItems: items, removedItem: null };
};

const addItemToParent = (
  items: LayoutItem[],
  item: LayoutItem,
  parentId: string,
  index: number,
): LayoutItem[] => {
  if (parentId === 'root') {
    const newItems = [...items];
    newItems.splice(index, 0, item);
    return newItems;
  }

  const newItems = [...items];
  const { item: parent } = findItemById(newItems, parentId);

  if (parent && parent.children) {
    parent.children.splice(index, 0, item);
  }

  return newItems;
};

const updateDisabledProp = (items: LayoutItem[], disabled: boolean) => {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item) {
      continue;
    }
    item.editDisabled = disabled;
    if (item.children && Array.isArray(item.children)) {
      updateDisabledProp(item.children, disabled);
    }
  }
};

export const LayoutProvider = ({
  initialLayout,
  children,
  updateLayoutInDb,
}: {
  initialLayout: Layout;
  children: React.ReactNode;
  updateLayoutInDb: (layout: Layout) => Promise<void>;
}) => {
  const [layout, setLayout] = useState<Layout>(initialLayout);

  const [selectedComponentId, setSelectedComponentId] = useState<string>('root');
  const [selectedComponent, setSelectedComponent] = useState<LayoutItem | null>(null);

  useEffect(() => {
    if (layout !== initialLayout) {
      void updateLayoutInDb(layout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  useEffect(() => {
    if (selectedComponentId === 'root') {
      return;
    }
    const { item } = findItemById(layout.items, selectedComponentId);
    setSelectedComponent(item);
  }, [layout.items, selectedComponentId]);

  const [html, setHtml] = useState('');

  const updateRootProps = (newProps: RootProps) => {
    setLayout((prevLayout) => {
      const newLayout = cloneLayout(prevLayout);
      if (newLayout.props.editDisabled !== newProps.editDisabled) {
        updateDisabledProp(newLayout.items, newProps.editDisabled);
      }
      newLayout.props = newProps;
      return newLayout;
    });
  };

  const updateSelectedComponentProps = (layout: LayoutItem) => {
    setLayout((prevLayout) => {
      const newLayout = cloneLayout(prevLayout);
      const { item } = findItemById(newLayout.items, selectedComponentId);
      if (item && item.editDisabled !== layout.editDisabled && item.children !== undefined) {
        updateDisabledProp(item.children, layout.editDisabled);
      }
      if (item) {
        item.props = { ...layout.props };
        item.editDisabled = layout.editDisabled;
      }

      return newLayout;
    });
  };

  const updateLayout = (action: LayoutAction) => {
    setLayout((prevLayout) => {
      const newLayout = cloneLayout(prevLayout);

      switch (action.type) {
        case 'ADD_COMPONENT': {
          const { component, parentId, index } = action.payload;
          if (!component.id || component.id === 'new-component') {
            component.id = generateId();
          }

          if (['section', 'row', 'column'].includes(component.type) && !component.children) {
            component.children = [];
          }

          newLayout.items = addItemToParent(newLayout.items, component, parentId, index);
          return newLayout;
        }

        case 'MOVE_COMPONENT': {
          const { id, parentId, index } = action.payload;

          const { newItems, removedItem } = removeItemFromParent(newLayout.items, id);

          if (removedItem) {
            newLayout.items = addItemToParent(newItems, removedItem, parentId, index);
          }

          return newLayout;
        }

        case 'REMOVE_COMPONENT': {
          const { id } = action.payload;
          const { newItems } = removeItemFromParent(newLayout.items, id);
          newLayout.items = newItems;
          return newLayout;
        }

        default:
          return prevLayout;
      }
    });
  };

  useEffect(() => {
    void renderLayoutToHtml(layout).then(setHtml);
  }, [layout]);

  const contextValue: LayoutContextType = {
    layout,
    html,
    updateRootProps,
    updateSelectedComponentProps,
    updateLayout,
    selectedComponentId,
    setSelectedComponentId,
    selectedComponent,
  };

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>;
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
