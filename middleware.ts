import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) return NextResponse.redirect(new URL('/login', req.url));

    const role = token.role as string;

    if (path.startsWith('/dashboard/patient') && role !== 'PATIENT') {
      return NextResponse.redirect(new URL(redirectForRole(role), req.url));
    }
    if (path.startsWith('/dashboard/doctor') && role !== 'DOCTOR') {
      return NextResponse.redirect(new URL(redirectForRole(role), req.url));
    }
    if (path.startsWith('/dashboard/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL(redirectForRole(role), req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith('/dashboard')) return !!token;
        return true;
      },
    },
  }
);

function redirectForRole(role: string): string {
  switch (role) {
    case 'PATIENT':
      return '/dashboard/patient';
    case 'DOCTOR':
      return '/dashboard/doctor';
    case 'ADMIN':
      return '/dashboard/admin';
    default:
      return '/';
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
