import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../../lib/db'
import { projectPayments } from '../../../../../lib/schema'
import { requireAdminSession, unauthorizedAdminResponse } from '../../../../../lib/admin-auth'

async function ensureAdmin() {
  try {
    await requireAdminSession()
    return null
  } catch {
    return unauthorizedAdminResponse()
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ensureAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id }                       = await params
    const { amount, currency, type, note } = await req.json()

    const [payment] = await db.insert(projectPayments).values({
      projectId: Number(id),
      amount:    String(amount),
      currency:  currency || 'CLP',
      type:      type     || 'monthly',
      note:      note     || null,
    }).returning()

    return NextResponse.json(payment)
  } catch {
    return NextResponse.json({ error: 'Error al registrar pago' }, { status: 500 })
  }
}
