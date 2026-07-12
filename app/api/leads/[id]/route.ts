import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { leads } from '../../../lib/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id }           = await params
    const { status, note } = await req.json()

    await db.update(leads)
      .set({ status, note: note || null })
      .where(eq(leads.id, Number(id)))

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}