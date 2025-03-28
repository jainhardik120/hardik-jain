'use client';

import type React from 'react';

import { useState } from 'react';
import { Column } from './column';
import { FilterBar } from './filter-bar';
import { useKanban } from './kanban-context';
import { api } from '@/server/api/react';

export function KanbanBoard() {
  const { filteredColumns, setColumns } = useKanban();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [sourceColumnId, setSourceColumnId] = useState<string | null>(null);

  const handleDragStart = (_e: React.DragEvent, taskId: string, columnId: string) => {
    setDraggedTaskId(taskId);
    setSourceColumnId(columnId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const updateTaskStatusMutation = api.tasks.updateTaskStatus.useMutation();

  const handleDrop = async (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (draggedTaskId === null || sourceColumnId === null) {
      return;
    }

    // Find the task in the source column
    const sourceColumn = filteredColumns.find((col) => col.id === sourceColumnId);
    if (!sourceColumn) {
      return;
    }

    const taskIndex = sourceColumn.tasks.findIndex((task) => task.id === draggedTaskId);
    if (taskIndex === -1) {
      return;
    }

    const task = sourceColumn.tasks[taskIndex];
    if (task === undefined) {
      return;
    }
    const targetColumn = filteredColumns.find((col) => col.id === targetColumnId);
    if (!targetColumn) {
      return;
    }

    const newOrder = targetColumn.tasks.length;

    await updateTaskStatusMutation.mutateAsync({
      id: draggedTaskId,
      columnId: targetColumnId,
      order: newOrder,
    });

    setColumns((prevColumns) => {
      return prevColumns.map((column) => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
            tasks: column.tasks.filter((t) => t.id !== draggedTaskId),
          };
        }

        if (column.id === targetColumnId) {
          return {
            ...column,
            tasks: [...column.tasks, { ...task, taskColumnId: targetColumnId, order: newOrder }],
          };
        }

        return column;
      });
    });

    setDraggedTaskId(null);
    setSourceColumnId(null);
  };

  const handleExport = async () => {
    // try {
    //   const data = await exportKanbanData();
    //   const headers = Object.keys(data[0]).join(',');
    //   const rows = data.map((row) => Object.values(row).join(','));
    //   const csv = [headers, ...rows].join('\n');
    //   // Create a blob and download
    //   const blob = new Blob([csv], { type: 'text/csv' });
    //   const url = URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = `kanban-export-${new Date().toISOString().split('T')[0]}.csv`;
    //   document.body.appendChild(a);
    //   a.click();
    //   document.body.removeChild(a);
    //   URL.revokeObjectURL(url);
    // } catch {}
  };

  return (
    <div className="flex flex-col w-full gap-4 overflow-hidden">
      <FilterBar onExport={handleExport} />
      <div className="w-full">
        <div className="flex overflow-x-auto space-x-4 w-full min-w-0">
          {filteredColumns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
