'use client';

import { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Task } from '@prisma/client';
import { api } from '@/server/api/react';

const statusColumns = [
  { id: 'todo', name: 'To Do' },
  { id: 'in-progress', name: 'In Progress' },
  { id: 'review', name: 'Review' },
  { id: 'done', name: 'Done' },
];

const ItemTypes = {
  TASK: 'task',
};

interface TaskCardProps {
  task: Task;
  index: number;
  onTaskClick: (taskId: string) => void;
}

const TaskCard = ({ task, index, onTaskClick }: TaskCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, status: task.status, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(ref);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card
      ref={ref}
      className={`mb-2 cursor-pointer hover:shadow-md transition-shadow ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      onClick={() => onTaskClick(task.id)}
    >
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <div className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</div>
        <div className="flex justify-between items-center">
          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
          {task.assignee !== null && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={'/placeholder.svg?height=32&width=32'} alt={task.assignee} />
              <AvatarFallback>{task.assignee.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface TaskColumnProps {
  status: string;
  name: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onDropTask: (taskId: string, newStatus: string) => void;
}

const TaskColumn = ({ status, name, tasks, onTaskClick, onDropTask }: TaskColumnProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item: { id: string }) => {
      onDropTask(item.id, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  drop(ref);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 font-medium text-sm flex items-center">
        <span>{name}</span>
        <Badge variant="outline" className="ml-2">
          {tasks.length}
        </Badge>
      </div>
      <div
        ref={ref}
        className={`bg-muted/50 rounded-lg p-2 flex-1 min-h-[500px] ${isOver ? 'bg-muted/80' : ''}`}
      >
        {tasks.map((task, index) => (
          <TaskCard key={task.id} task={task} index={index} onTaskClick={onTaskClick} />
        ))}
      </div>
    </div>
  );
};

export function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleTaskClick = (taskId: string) => {
    router.push(`/admin/tasks/${taskId}`);
  };

  const updateTaskStatus = api.tasks.updateTaskStatus.useMutation();

  const handleDropTask = async (taskId: string, newStatus: string) => {
    const currentTasks = localTasks.length > 0 ? localTasks : tasks;
    const taskIndex = currentTasks.findIndex((task) => task.id === taskId);
    if (
      taskIndex !== -1 &&
      currentTasks[taskIndex] !== undefined &&
      currentTasks[taskIndex].status !== newStatus
    ) {
      const newTasks = [...currentTasks];
      if (newTasks[taskIndex] === undefined) {
        return;
      }
      newTasks[taskIndex] = {
        ...newTasks[taskIndex],
        status: newStatus,
      };
      setLocalTasks(newTasks);
      try {
        await updateTaskStatus.mutateAsync({ id: taskId, status: newStatus });
        router.refresh();
      } catch {
        setLocalTasks(tasks);
      }
    }
  };

  const getTasksByStatus = (status: string) => {
    return localTasks.filter((task) => task.status === status);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusColumns.map((column) => (
          <TaskColumn
            key={column.id}
            status={column.id}
            name={column.name}
            tasks={getTasksByStatus(column.id)}
            onTaskClick={handleTaskClick}
            onDropTask={handleDropTask}
          />
        ))}
      </div>
    </DndProvider>
  );
}
