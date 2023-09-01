import { NextMiddleware, NextRequest, NextResponse, NextFetchEvent } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default function withAuth(middleware: NextMiddleware, requiredAuth: string[] = []) {
  return async (req: NextRequest, next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (requiredAuth.includes(pathname)) {
      if (!token) {
        const url = new URL('/login', req.url);
        url.searchParams.set('callbackUrl', encodeURI(req.url));
        return NextResponse.redirect(url);
      }
    }
    if (['/login', '/register'].includes(pathname)) {
      if (token) {
        const url = new URL('/', req.url);
        return NextResponse.redirect(url);
      }
    }

    return middleware(req, next);
  };
}
