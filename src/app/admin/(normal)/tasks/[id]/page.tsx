import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ChevronLeft, Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getTask, deleteTask } from '@/actions/tasks';

interface TaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const task = await getTask((await params).id);

  if (!task) {
    notFound();
  }

  const statusMap: Record<string, string> = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    review: 'Review',
    done: 'Done',
  };

  const priorityColorMap: Record<string, string> = {
    high: 'bg-destructive text-destructive-foreground',
    medium: 'bg-warning text-warning-foreground',
    low: 'bg-secondary text-secondary-foreground',
  };

  const handleDelete = async () => {
    'use server';
    await deleteTask((await params).id);
    redirect('/admin/tasks');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{task.description ?? 'No description provided.'}</p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">Status</div>
                <div>{statusMap[task.status] ?? task.status}</div>
              </div>

              <div>
                <div className="text-sm font-medium mb-1">Priority</div>
                <Badge className={priorityColorMap[task.priority.toLowerCase()] ?? 'bg-secondary'}>
                  {task.priority}
                </Badge>
              </div>

              <div>
                <div className="text-sm font-medium mb-1">Assignee</div>
                {task.assignee !== null ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={'/placeholder.svg?height=32&width=32'}
                        alt={task.assignee}
                      />
                      <AvatarFallback>{task.assignee.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{task.assignee}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </div>

              {task.dueDate && (
                <div>
                  <div className="text-sm font-medium mb-1">Due Date</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/admin/tasks/${task.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <form action={handleDelete}>
                <Button variant="destructive" type="submit">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
