import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../../lib/db'
import { projectPayments } from '../../../../../lib/schema'
import { eq, desc } from 'drizzle-orm'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar pago' }, { status: 500 })
  }
}