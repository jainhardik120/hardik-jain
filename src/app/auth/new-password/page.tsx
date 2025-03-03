'use client';

import type * as z from 'zod';
import { Suspense, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import ErrorSuccessMessage from '@/components/form-success';
import { Input } from '@/components/ui/input';

import { NewPasswordSchema } from '@/types/schemas';
import { api } from '@/server/api/react';
import { CardWrapper } from '@/components/auth/card-wrapper';

export default function NewPasswordPage() {
  return (
    <Suspense>
      <NewPasswordForm />
    </Suspense>
  );
}

function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: { password: '' },
  });

  const mutation = api.auth.newPassword.useMutation({
    onSuccess: async (values) => {
      setMessage(values.success);
    },
    onError: async (values) => {
      setMessage(values.message);
      setError(true);
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError(false);
    setMessage('');
    startTransition(() => {
      mutation.mutate({ ...values, token: token ?? '' });
    });
  };

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/signin"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="******" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ErrorSuccessMessage message={message} isError={error} />
          <Button disabled={isPending} type="submit" className="w-full">
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
