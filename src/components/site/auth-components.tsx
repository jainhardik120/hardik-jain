'use client';

import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        await signIn(provider);
      }}
    >
      <Button {...props}>Sign In</Button>
    </form>
  );
}
