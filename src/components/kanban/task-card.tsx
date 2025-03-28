'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
// import { CalendarIcon, MoreHorizontal, Pencil, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Task } from '@prisma/client';
import { useKanban } from './kanban-context';
import { api } from '@/server/api/react';

interface TaskCardProps {
  task: Task;
  columnId: string;
}

export function TaskCard({ task }: TaskCardProps) {
  const { columns, setColumns } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined,
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const updateTaskDetailsMutation = api.tasks.updateTaskDetails.useMutation();
  const deleteTaskMutation = api.tasks.deleteTask.useMutation();

  const handleSave = async () => {
    await updateTaskDetailsMutation.mutateAsync({
      title,
      description: description,
      dueDate: dueDate,
      id: task.id,
    });
    setColumns(
      columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((t) =>
          t.id === task.id
            ? { ...t, title, description: description || null, dueDate: dueDate || null }
            : t,
        ),
      })),
    );
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteTaskMutation.mutateAsync(task.id);
    setColumns(
      columns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((t) => t.id !== task.id),
      })),
    );
  };

  const getDueDateColor = () => {
    if (!dueDate) {
      return 'text-muted-foreground';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate < today) {
      return 'text-destructive';
    }
    if (taskDate.getTime() === today.getTime()) {
      return 'text-warning';
    }
    return 'text-muted-foreground';
  };

  return (
    <Card className="mb-3 cursor-grab active:cursor-grabbing">
      <CardHeader className="p-3 pb-0 flex flex-row justify-between items-start">
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-medium"
            placeholder="Task title"
          />
        ) : (
          <h3 className="font-medium text-sm">{task.title}</h3>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isEditing ? (
              <DropdownMenuItem onClick={handleSave}>Save</DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-3">
        {isEditing ? (
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[60px] text-sm"
            placeholder="Add a description..."
          />
        ) : (
          description && <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {/* <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map((tag) => (
            <Badge
              key={tag.id}
              style={{ backgroundColor: tag.color, color: '#fff' }}
              className="text-xs"
            >
              {tag.name}
            </Badge>
          ))}
        </div> */}
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        {/* {task.user ? (
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.user.avatarUrl || ''} alt={task.user.name} />
            <AvatarFallback>{task.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <User className="h-5 w-5 text-muted-foreground" />
        )} */}

        {isEditing ? (
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!dueDate && 'text-muted-foreground'}`}
                size="sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, 'PPP') : 'Set due date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => {
                  setDueDate(date);
                  setIsCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        ) : (
          <div className={`text-xs flex items-center ${getDueDateColor()}`}>
            {dueDate && (
              <>
                <CalendarIcon className="mr-1 h-3 w-3" />
                {format(new Date(dueDate), 'MMM d')}
              </>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
