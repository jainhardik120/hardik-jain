import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { ComponentMap, type LayoutItem } from '../types';
import RenderComponentList from './RenderComponentList';
import { useLayout } from '../ContextProvider';

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

export default RenderEditableComponent;
