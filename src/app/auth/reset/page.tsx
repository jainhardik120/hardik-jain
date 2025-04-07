'use client';

import { Suspense, useState, useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { CardWrapper } from '@/components/auth/card-wrapper';
import ErrorSuccessMessage from '@/components/form-success';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/server/api/react';
import { ResetSchema } from '@/types/schemas';

import type { z } from 'zod';

export default function ResetPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}

function ResetForm() {
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { email: '' },
  });

  const mutation = api.auth.resetPassword.useMutation({
    onSuccess: async (values) => {
      setMessage(values.success);
    },
    onError: async (values) => {
      setMessage(values.message);
      setError(true);
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError(false);
    setMessage('');

    startTransition(() => {
      mutation.mutate(values);
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/signin"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="john.doe@example.com"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ErrorSuccessMessage message={message} isError={error} />
          <Button disabled={isPending} type="submit" className="w-full">
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
