import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, getAdminCookieOptions } from '../../../lib/admin-session'

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url))

  res.cookies.set(ADMIN_SESSION_COOKIE, '', getAdminCookieOptions(0))

  return res
}
