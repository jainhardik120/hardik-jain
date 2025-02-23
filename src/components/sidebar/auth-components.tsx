'use client';

import { Button } from '@/components/ui/button';
import { serverSignIn } from './auth-actions';

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        await serverSignIn(provider);
      }}
    >
      <Button {...props}>Sign In</Button>
    </form>
  );
}
