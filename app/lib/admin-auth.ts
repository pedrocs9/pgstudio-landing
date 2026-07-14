import 'server-only'

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from './admin-session'

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

  return verifyAdminSessionToken(token)
}

export async function requireAdminSession() {
  const session = await getAdminSession()

  if (!session) {
    throw new Error('ADMIN_SESSION_REQUIRED')
  }

  return session
}

export function unauthorizedAdminResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
