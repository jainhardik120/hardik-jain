'use client';

import React from 'react';

import { Button } from '@repo/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/popover';
import { toast } from 'sonner';

import type { Design } from '@/canva-client';
import RenderedForm from '@/components/form';
import { api } from '@/server/api/react';
import { designSchema } from '@/types/schemas';

export const CreateDesignForm: React.FC<{
  onUpdateDesigns: (design: Design) => void;
}> = ({ onUpdateDesigns }) => {
  const createDesignMutation = api.canva.createDesign.useMutation({
    onSuccess: (response) => {
      toast.success('Design created successfully');
      onUpdateDesigns(response.design);
    },
    onError: (err) => {
      toast.error(err.message || 'Something went wrong');
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Create new design</Button>
      </PopoverTrigger>
      <PopoverContent>
        <RenderedForm
          showSubmitButton={true}
          schema={designSchema}
          onSubmit={async (values) => {
            await createDesignMutation.mutateAsync(values);
          }}
          defaultValues={{
            name: '',
            height: 0,
            width: 0,
          }}
          fields={[
            {
              name: 'name',
              label: 'Name',
              type: 'input',
              placeholder: 'Enter design name',
            },
            {
              name: 'height',
              label: 'Height',
              type: 'input',
              placeholder: 'Enter height',
              description: 'Enter height in pixels',
            },
            {
              name: 'width',
              label: 'Width',
              type: 'input',
              placeholder: 'Enter width',
              description: 'Enter width in pixels',
            },
          ]}
        />
      </PopoverContent>
    </Popover>
  );
};
