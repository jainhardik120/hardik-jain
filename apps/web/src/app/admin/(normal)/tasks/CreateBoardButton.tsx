'use client';

import React, { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/form';
import { Input } from '@repo/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRouter } from '@/components/top-loader-router';
import { api } from '@/server/api/react';

const createBoardSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Title must be at least 2 characters long' })
    .max(50, { message: 'Title must be less than 50 characters' }),
});

const CreateBoardButton = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const mutation = api.tasks.createTaskBoard.useMutation({
    onSuccess: (data) => {
      setIsDialogOpen(false);
      router.push(`/admin/tasks/${data}`);
    },
  });

  const form = useForm<z.infer<typeof createBoardSchema>>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = (data: z.infer<typeof createBoardSchema>) => {
    mutation.mutate(data.title);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Create New Board</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Task Board</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter board title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create Board'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardButton;
