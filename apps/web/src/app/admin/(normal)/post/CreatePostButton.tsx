'use client';

import React from 'react';

import { Button } from '@repo/ui/button';

import { useRouter } from '@/components/top-loader-router';
import { api } from '@/server/api/react';

const CreatePostButton = () => {
  const router = useRouter();
  const mutation = api.post.createNewPost.useMutation({
    onSuccess: (response) => {
      router.push(`/admin/post/${response}`);
    },
  });

  return (
    <Button
      onClick={async () => {
        mutation.mutate();
      }}
    >
      New Post
    </Button>
  );
};

export default CreatePostButton;
