import React, { useRef } from 'react';

import { useDrag } from 'react-dnd';

import { useLayout } from '@/components/email-editor/ContextProvider';
import { ComponentMap, type LayoutItem, type ComponentType } from '@/components/email-editor/types';

import DropZone from './DropZone';

export const isItemContainer = (item: LayoutItem): boolean => {
  return item.type === 'section' || item.type === 'row' || item.type === 'column';
};

const RenderEditableComponent = ({
  item,
  onDrop,
}: {
  item: LayoutItem;
  onDrop: (item: LayoutItem, parentId: string, index: number) => void;
}) => {
  const Component = ComponentMap[item.type];
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { ...item },
    canDrag: () => !item.editDisabled,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  drag(ref);
  const { setSelectedComponentId } = useLayout();
  let className = `${item.editDisabled ? '' : 'cursor-move'}`;

  if (!item.editDisabled) {
    className += ` border border-dashed p-4 ${isDragging ? 'opacity-50' : ''}`;
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setSelectedComponentId(item.id);
  };

  if (item.type === 'column') {
    return (
      <td ref={ref} className={className} onClick={handleClick}>
        <div>
          <RenderComponentList
            items={item.children}
            type={item.type}
            parentId={item.id}
            onDrop={onDrop}
          />
        </div>
      </td>
    );
  }

  if (isItemContainer(item)) {
    return (
      <div ref={ref} className={className} onClick={handleClick}>
        <Component key={item.id} input={item.props}>
          <RenderComponentList
            items={item.children}
            type={item.type}
            parentId={item.id}
            onDrop={onDrop}
          />
        </Component>
      </div>
    );
  }

  return (
    <div ref={ref} className={className} onClick={handleClick}>
      <Component key={item.id} input={item.props} />
    </div>
  );
};

const RenderComponentList = ({
  items,
  type,
  parentId,
  onDrop,
}: {
  items?: LayoutItem[] | undefined;
  type: ComponentType | 'root';
  parentId: string;
  onDrop: (item: LayoutItem, parentId: string, index: number) => void;
}) => {
  return (
    <React.Fragment>
      <DropZone type={type} parentId={parentId} index={0} onDrop={onDrop} />
      {items &&
        items.length > 0 &&
        items.map((item, index) => {
          if (type === 'row' && item.type !== 'column') {
            return null;
          }
          return (
            <React.Fragment key={item.id}>
              <RenderEditableComponent item={item} onDrop={onDrop} />
              <DropZone type={type} parentId={parentId} index={index + 1} onDrop={onDrop} />
            </React.Fragment>
          );
        })}
    </React.Fragment>
  );
};

export default RenderComponentList;
