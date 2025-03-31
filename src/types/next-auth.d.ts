/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { type DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

import type { UserRole } from '@prisma/client';

export type ExtendedUser = DefaultSession['user'] & {
  role: UserRole[];
  id: string;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole[];
    isOAuth: boolean;
    refreshToken: string;
  }
}
