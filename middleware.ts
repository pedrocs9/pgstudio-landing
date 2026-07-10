import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const auth = req.cookies.get('admin_auth')?.value

  if (!auth || auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}