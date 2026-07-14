import { NextRequest, NextResponse } from 'next/server'
import { vexorDb } from '../../../../../lib/vexor-db'
import { users } from '../../../../../lib/vexor-schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { requireAdminSession, unauthorizedAdminResponse } from '../../../../../lib/admin-auth'

async function ensureAdmin() {
  try {
    await requireAdminSession()
    return null
  } catch {
    return unauthorizedAdminResponse()
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await ensureAdmin()
  if (unauthorized) return unauthorized

  try {
    const { userId, password } = await req.json()

    const passwordHash = await bcrypt.hash(password, 10)

    await vexorDb.update(users)
      .set({ passwordHash })
      .where(eq(users.id, Number(userId)))

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al resetear contrasena' }, { status: 500 })
  }
}
