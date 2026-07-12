import { NextRequest, NextResponse } from 'next/server'
import { vexorDb } from '../../../../../lib/vexor-db'
import { users } from '../../../../../lib/vexor-schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id }             = await params
    const { userId, password } = await req.json()

    const passwordHash = await bcrypt.hash(password, 10)

    await vexorDb.update(users)
      .set({ passwordHash })
      .where(eq(users.id, Number(userId)))

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al resetear contraseña' }, { status: 500 })
  }
}