'use client';

import { LayoutGrid, Table2 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useQueryState } from '@/lib/use-query-state';

export function ViewToggle() {
  const [view, setView] = useQueryState('view', {
    defaultValue: 'kanban',
    parse: (value) => (value === 'table' ? 'table' : 'kanban'),
  });

  return (
    <ToggleGroup
      type="single"
      value={view ?? 'table'}
      onValueChange={(value) => value && setView(value)}
    >
      <ToggleGroupItem value="kanban" aria-label="Kanban view">
        <LayoutGrid className="h-4 w-4 mr-2" />
        Kanban
      </ToggleGroupItem>
      <ToggleGroupItem value="table" aria-label="Table view">
        <Table2 className="h-4 w-4 mr-2" />
        Table
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
