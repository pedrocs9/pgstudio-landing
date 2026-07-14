import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession, unauthorizedAdminResponse } from '../../../lib/admin-auth'
import { db } from '../../../lib/db'
import { isAllowedLeadStatus } from '../../../lib/lead-pipeline'
import { leads } from '../../../lib/schema'

function cleanNote(value: unknown) {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null

  return trimmed.slice(0, 1000)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession()

    const { id } = await params
    const leadId = Number(id)

    if (!Number.isInteger(leadId) || leadId <= 0) {
      return NextResponse.json({ error: 'Lead invalido' }, { status: 400 })
    }

    const { status, note } = await req.json()

    if (!isAllowedLeadStatus(status)) {
      return NextResponse.json({ error: 'Estado invalido' }, { status: 400 })
    }

    await db.update(leads)
      .set({ status, note: cleanNote(note) })
      .where(eq(leads.id, leadId))

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'ADMIN_SESSION_REQUIRED') {
      return unauthorizedAdminResponse()
    }

    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}
