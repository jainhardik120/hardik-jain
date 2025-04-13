'use client';

import { Suspense, useMemo, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/form';
import { Input } from '@repo/ui/input';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import { CardWrapper } from '@/components/auth/card-wrapper';
import ErrorSuccessMessage from '@/components/form-success';
import { ErrorCode } from '@/server/auth/ErrorCode';
import { LoginSchema } from '@/types/schemas';

import type { z } from 'zod';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') ?? '/';

  const urlError: string | undefined = useMemo((): string | undefined => {
    switch (searchParams?.get('error')) {
      case 'OAuthAccountNotLinked':
        return 'Email already in use with a different provider';
      case 'CredentialsSignin':
        switch (searchParams?.get('code')) {
          case ErrorCode.INVALID_CREDENTIALS:
            return 'Invalid credentials provided';
          case ErrorCode.USER_NOT_FOUND:
            return 'User not found';
          case ErrorCode.EMAIL_NOT_VERIFIED:
            return 'Please verify your email address';
          case ErrorCode.INVALID_REQUEST:
            return 'Invalid request';
          case null:
          default:
            return 'An unknown credentials error occurred';
        }
      case undefined:
      case null:
      default:
        return undefined;
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [error, setError] = useState<boolean>(urlError !== undefined);
  const [message, setMessage] = useState<string | undefined>(urlError);

  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (values: z.infer<typeof LoginSchema>): Promise<void> => {
    setError(false);
    setMessage('');
    setIsPending(true);
    try {
      await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirectTo: callbackUrl,
      });
    } catch (error) {
      setMessage((error as Error).message ?? 'An unknown credentials error occurred');
      setError(true);
    } finally {
      setIsPending(false);
    }
  };

  const emailSignin = async (): Promise<void> => {
    const isValid = await form.trigger('email');
    if (isValid) {
      setError(false);
      setMessage('');
      setIsPending(true);
      await signIn('email', {
        email: form.getValues('email'),
        redirectTo: callbackUrl,
      });
      setIsPending(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/signup"
      showSocial
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
                  <Input disabled={isPending} placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button size="sm" variant="link" className="px-0 font-normal">
            <Link href="/auth/reset">Forgot password?</Link>
          </Button>
          <ErrorSuccessMessage message={message} isError={error} />
          <Button disabled={isPending} type="submit" className="w-full">
            Login with password
          </Button>
          <Button type="button" onClick={emailSignin} variant="outline" className="w-full">
            Send login link
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
