import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Let all requests pass through
  // Authentication is handled by server-side checks in page.tsx files
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/editor/:path*',
    '/auth/login',
    '/auth/signup',
  ],
};
