import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth guard: rotas protegidas requerem autenticação
const PROTECTED_ROUTES = [
  '/dashboard',
  '/calendar',
  '/kanban',
  '/settings',
  '/profile',
  '/routines',
  '/dev-insights',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  // Zustand persiste no localStorage — o cookie 'ploc-auth' é setado pelo client
  // Se não houver cookie, redireciona para home (login)
  if (isProtected) {
    const authCookie = request.cookies.get('ploc-auth');
    if (!authCookie) {
      const redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/calendar/:path*',
    '/kanban/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/routines/:path*',
    '/dev-insights/:path*',
  ],
};
