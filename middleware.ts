import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (process.env.VERCEL_ENV !== 'preview') {
    return NextResponse.next();
  }

  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    const [username, password] = atob(auth.slice(6)).split(':');
    if (username === 'karenina' && password === process.env.STAGING_PASSWORD) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Authentication Required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Staging"' },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg).*)'],
};
