'use server';

import { signIn, signOut } from '@/server/auth';

export async function serverSignIn(provider?: string) {
  return signIn(provider);
}

export async function serverSignOut() {
  return signOut();
}
