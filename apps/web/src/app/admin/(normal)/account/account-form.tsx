'use client';

import React from 'react';

import RenderedForm from '@/components/form';
import { api } from '@/server/api/react';
import { AccountDetailsSchema } from '@/types/schemas';

import type { z } from 'zod';

const AccountForm = ({ userDetails }: { userDetails: z.infer<typeof AccountDetailsSchema> }) => {
  const mutation = api.user.updateAccountDetails.useMutation();
  return (
    <RenderedForm
      schema={AccountDetailsSchema}
      defaultValues={userDetails}
      onSubmit={async (values) => {
        await mutation.mutateAsync(values);
      }}
      submitButtonText="Update Account"
      showSubmitButton={true}
      fields={[
        {
          name: 'name',
          label: 'Name',
          type: 'input',
          placeholder: 'Enter your name',
        },
        {
          name: 'bio',
          label: 'Bio',
          type: 'textarea',
          placeholder: 'Enter your bio',
        },
        {
          name: 'image',
          label: 'Image',
          type: 'custom',
          render: () => <div></div>,
          placeholder: 'Upload your image',
        },
        {
          name: 'twitter',
          label: 'Twitter',
          type: 'input',
          placeholder: 'Enter your twitter username',
        },
        {
          name: 'linkedin',
          label: 'LinkedIn',
          type: 'input',
          placeholder: 'Enter your linkedin username',
        },
        {
          name: 'website',
          label: 'Website',
          type: 'input',
          placeholder: 'Enter your website',
        },
      ]}
    />
  );
};

export default AccountForm;
