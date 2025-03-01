import NextAuth from 'next-auth';
import { apiAuthPrefix, authRoutes, dynamicPublicRoutes, publicRoutes } from '@/routes';

const { auth } = NextAuth({
  providers: [],
  callbacks: {
    session: async ({ token, session }) => {
      if (token.sub !== null && token.sub !== undefined) {
        session.user.id = token.sub;
      }
      if (token.role !== null && token.role !== undefined) {
        session.user.role = token.role;
      }
      return session;
    },
  },
});

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = apiAuthPrefix.some((prefix) => nextUrl.pathname.startsWith(prefix));
  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    dynamicPublicRoutes.some((prefix) => nextUrl.pathname.startsWith(prefix));
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  if (isApiAuthRoute) {
    return;
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL('/', nextUrl));
    }

    return;
  }
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(`/auth/signin?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  return;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
