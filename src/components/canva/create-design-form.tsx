'use client';

import React from 'react';
import type { Design } from '@/canva-client';
import { api } from '@/server/api/react';
import { toast } from 'sonner';
import { type z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { designSchema } from '@/types/schemas';

type DesignFormData = z.infer<typeof designSchema>;

export const CreateDesignForm: React.FC<{
  onUpdateDesigns: (design: Design) => void;
}> = ({ onUpdateDesigns }) => {
  const form = useForm<DesignFormData>({
    resolver: zodResolver(designSchema),
    defaultValues: {
      name: '',
      height: 0,
      width: 0,
    },
  });

  const { mutate: createDesign } = api.canva.createDesign.useMutation({
    onSuccess: (response) => {
      toast.success('Design created successfully');
      onUpdateDesigns(response.design);
      form.reset();
    },
    onError: (err) => {
      toast.error(err.message || 'Something went wrong');
    },
  });

  const onSubmit = (data: DesignFormData) => {
    createDesign({
      name: data.name,
      height: data.height,
      width: data.width,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Create new design</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter design name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter height" type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter width" type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};
