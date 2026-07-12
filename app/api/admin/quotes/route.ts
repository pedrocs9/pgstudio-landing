import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { quotes, quoteItems } from '../../../lib/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  const data = await db.select().from(quotes).orderBy(desc(quotes.createdAt))
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { clientName, clientEmail, clientPhone, validDays, notes, currency, items } = body

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const total    = items.reduce((s: number, i: any) => s + Number(i.subtotal), 0)
    const number   = `COT-${Date.now().toString().slice(-6)}`

    const [quote] = await db.insert(quotes).values({
      number, clientName,
      clientEmail: clientEmail || null,
      clientPhone: clientPhone || null,
      validDays:   validDays   || 15,
      notes:       notes       || null,
      total:       String(total),
      currency:    currency    || 'CLP',
      status:      'draft',
    }).returning()

    for (const item of items) {
      await db.insert(quoteItems).values({
        quoteId:     quote.id,
        description: item.description,
        detail:      item.detail || null,
        qty:         item.qty    || 1,
        unitPrice:   String(item.unitPrice),
        subtotal:    String(item.subtotal),
      })
    }

    return NextResponse.json({ ok: true, id: quote.id, number: quote.number })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al crear cotización' }, { status: 500 })
  }
}