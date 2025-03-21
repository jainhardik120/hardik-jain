import React from 'react';
import { type ComponentType, type LayoutItem } from '../types';
import DropZone from './DropZone';
import RenderEditableComponent from './RenderEditableComponent';

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
