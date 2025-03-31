import React, { useRef, useState } from 'react';

import { ChevronRight, ChevronDown } from 'lucide-react';
import { useDrag } from 'react-dnd';

import { useLayout } from '@/components/email-editor/ContextProvider';
import { ComponentMap, type LayoutItem } from '@/components/email-editor/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const NewComponentsTab = () => {
  const componentTypes = Object.keys(ComponentMap) as Array<keyof typeof ComponentMap>;

  return (
    <div className="h-full p-4 space-y-2 flex flex-col">
      {componentTypes.map((type) => (
        <NewComponentWrapper key={type} type={type} />
      ))}
    </div>
  );
};

const TreeItem = ({ item, depth = 0 }: { item: LayoutItem; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { setSelectedComponentId, selectedComponentId } = useLayout();
  const hasChildren = item.children !== undefined && item.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedComponentId(item.id);
  };

  const isSelected = selectedComponentId === item.id;

  return (
    <div className="w-full">
      <div
        className={`flex border border-border items-center p-2 ${isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'} cursor-pointer`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={handleSelect}
      >
        {hasChildren ? (
          <Button variant="ghost" size="icon" className="h-5 w-5 p-0 mr-1" onClick={handleToggle}>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        ) : (
          <div className="w-6" />
        )}

        <div className="flex items-center text-sm">
          <span className="font-medium">{item.type}</span>
          <span className="ml-2 text-muted-foreground text-xs">{item.id}</span>
        </div>
      </div>

      {hasChildren && isOpen && (
        <div className="pl-4 flex flex-col">
          {item.children?.map((child) => (
            <TreeItem key={child.id} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const LayoutTab = () => {
  const { layout } = useLayout();

  return (
    <div className="h-full p-4 flex flex-col">
      <ScrollArea className="flex-grow ">
        {layout.items.map((item) => (
          <TreeItem key={item.id} item={item} />
        ))}
      </ScrollArea>
    </div>
  );
};

const ComponentsPanel = () => {
  return (
    <Tabs defaultValue="add-component">
      <div className="p-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add-component">Add Component</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="add-component">
        <NewComponentsTab />
      </TabsContent>
      <TabsContent value="layout">
        <LayoutTab />
      </TabsContent>
    </Tabs>
  );
};

export default ComponentsPanel;
