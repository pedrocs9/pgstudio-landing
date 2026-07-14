import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../../lib/db'
import { clientPayments } from '../../../../../lib/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAdminSession, unauthorizedAdminResponse } from '../../../../../lib/admin-auth'

async function ensureAdmin() {
  try {
    await requireAdminSession()
    return null
  } catch {
    return unauthorizedAdminResponse()
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ensureAdmin()
  if (unauthorized) return unauthorized

  const { id } = await params
  const payments = await db.select().from(clientPayments)
    .where(eq(clientPayments.tenantId, Number(id)))
    .orderBy(desc(clientPayments.createdAt))
  return NextResponse.json(payments)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ensureAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id }                                          = await params
    const { amount, method, status, period, note } = await req.json()

    const [payment] = await db.insert(clientPayments).values({
      tenantId: Number(id),
      amount:   String(amount),
      currency: 'CLP',
      method:   method   || 'transfer',
      status:   status   || 'paid',
      period:   period   || null,
      note:     note     || null,
    }).returning()

    return NextResponse.json(payment)
  } catch {
    return NextResponse.json({ error: 'Error al registrar pago' }, { status: 500 })
  }
}
