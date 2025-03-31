import React, { useRef } from 'react';

import { useDrop } from 'react-dnd';

import { type ComponentType, type LayoutItem } from '@/components/email-editor/types';

const DropZone = ({
  type,
  parentId,
  index,
  onDrop,
}: {
  type: ComponentType | 'root';
  parentId: string;
  index: number;
  onDrop: (item: LayoutItem, parentId: string, index: number) => void;
}) => {
  const ref = useRef(null);
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: LayoutItem) => {
      onDrop(item, parentId, index);
      return { dropped: true };
    },
    canDrop: (item) =>
      (type !== 'row' && item.type !== 'column') || (item.type === 'column' && type === 'row'),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));
  drop(ref);

  const isActive = isOver && canDrop;
  let className = '';

  if (canDrop) {
    className += 'border border-dashed h-4 ';
    if (type === 'row') {
      className += 'w-4 ';
    } else {
      className += 'w-full ';
    }
  }

  if (isActive) {
    className += 'border-green-500 bg-green-100 ';
  } else if (canDrop) {
    className += 'border-blue-300 ';
  }

  if (type === 'row') {
    return <td ref={ref} className={className}></td>;
  }
  return <div ref={ref} className={className}></div>;
};

export default DropZone;
