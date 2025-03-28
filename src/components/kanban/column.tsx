'use client';

import type React from 'react';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TaskCard } from './task-card';
import { type TaskColumnWithTasks, useKanban } from './kanban-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { api } from '@/server/api/react';

interface ColumnProps {
  column: TaskColumnWithTasks;
  onDragStart: (e: React.DragEvent, taskId: string, columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
}

export function Column({ column, onDragStart, onDragOver, onDrop }: ColumnProps) {
  const { columns, setColumns } = useKanban();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const updateColumnTitleMutation = api.tasks.updateColumnTitle.useMutation();

  const handleTitleSave = async () => {
    if (title.trim() === '') {
      return;
    }
    await updateColumnTitleMutation.mutateAsync({ id: column.id, title });
    setColumns(columns.map((col) => (col.id === column.id ? { ...col, title } : col)));
    setIsEditingTitle(false);
  };

  const addTaskMutation = api.tasks.addTask.useMutation();

  const handleAddTask = async () => {
    if (newTaskTitle.trim() === '') {
      return;
    }
    await addTaskMutation.mutateAsync({ columnId: column.id, title: newTaskTitle });
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  const deleteColumnMutation = api.tasks.deleteColumn.useMutation();
  const handleDeleteColumn = async () => {
    await deleteColumnMutation.mutateAsync(column.id);
    setColumns(columns.filter((col) => col.id !== column.id));
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card className="w-80 flex-shrink-0">
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
        {isEditingTitle ? (
          <div className="flex w-full space-x-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void handleTitleSave();
                }
                if (e.key === 'Escape') {
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
            />
            <Button size="sm" onClick={handleTitleSave}>
              Save
            </Button>
          </div>
        ) : (
          <CardTitle className="text-md font-medium">{column.title}</CardTitle>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Column actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent
        className="p-3 pt-0"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, column.id)}
      >
        {column.tasks.map((task) => (
          <div key={task.id} draggable onDragStart={(e) => onDragStart(e, task.id, column.id)}>
            <TaskCard task={task} columnId={column.id} />
          </div>
        ))}

        {isAddingTask ? (
          <div className="mt-2 space-y-2">
            <Input
              placeholder="Enter task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void handleAddTask();
                }
                if (e.key === 'Escape') {
                  setNewTaskTitle('');
                  setIsAddingTask(false);
                }
              }}
              autoFocus
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleAddTask}>
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setNewTaskTitle('');
                  setIsAddingTask(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full mt-2 text-muted-foreground"
            size="sm"
            onClick={() => setIsAddingTask(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
        )}
      </CardContent>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Column</DialogTitle>
          </DialogHeader>
          <p>
            {`Are you sure you want to delete the column 
            "${column.title}"? This will also delete all tasks in this column.`}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteColumn}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
