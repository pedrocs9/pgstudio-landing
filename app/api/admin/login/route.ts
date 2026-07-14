import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminCookieOptions,
  hasAdminAuthConfig,
  isValidAdminPassword,
} from '../../../lib/admin-session'

export async function POST(req: NextRequest) {
  let password: unknown

  try {
    const body = await req.json()
    password = body?.password
  } catch {
    return NextResponse.json({ error: 'Solicitud invalida.' }, { status: 400 })
  }

  if (!hasAdminAuthConfig()) {
    console.error('Configuracion de autenticacion administrativa incompleta.')
    return NextResponse.json({ error: 'No se pudo iniciar sesion.' }, { status: 500 })
  }

  if (!(await isValidAdminPassword(password))) {
    console.warn('Intento de acceso administrativo rechazado.')
    return NextResponse.json({ error: 'Credenciales incorrectas.' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  const token = await createAdminSessionToken()

  res.cookies.set(ADMIN_SESSION_COOKIE, token, getAdminCookieOptions())

  return res
}
