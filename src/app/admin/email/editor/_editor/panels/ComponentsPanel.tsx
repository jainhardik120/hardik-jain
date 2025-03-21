import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { ComponentMap } from '../types';

const NewComponentWrapper = ({ type }: { type: string }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type, id: 'new-component' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  drag(ref);

  return (
    <div
      ref={ref}
      className={`p-4 border border-dashed border-border cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </div>
  );
};

const ComponentsPanel = () => {
  const componentTypes = Object.keys(ComponentMap) as Array<keyof typeof ComponentMap>;

  return (
    <div className="h-full p-4 bg-background border-r">
      <h4 className="mb-4 text-center font-medium">Components</h4>
      <div className="space-y-2">
        {componentTypes.map((type) => (
          <NewComponentWrapper key={type} type={type} />
        ))}
      </div>
    </div>
  );
};

export default ComponentsPanel;
