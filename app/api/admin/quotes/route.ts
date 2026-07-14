import { desc, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession, unauthorizedAdminResponse } from '../../../lib/admin-auth'
import { db } from '../../../lib/db'
import { calculateQuoteTotal } from '../../../lib/quote-pipeline'
import { leads, quoteItems, quotes } from '../../../lib/schema'

type QuoteItemInput = {
  description?: unknown
  detail?: unknown
  qty?: unknown
  unitPrice?: unknown
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, maxLength)
}

function cleanPositiveInteger(value: unknown, fallback: number, max = 365) {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(max, Math.max(1, Math.round(number)))
}

function cleanLeadId(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : null
}

function cleanItems(value: unknown) {
  if (!Array.isArray(value)) return []

  return value.map((item: QuoteItemInput) => {
    const description = cleanText(item.description, 220)
    const qty = Number(item.qty)
    const unitPrice = Number(item.unitPrice)

    if (!description || !Number.isFinite(qty) || qty <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
      return null
    }

    const cleanQty = Math.max(1, Math.round(qty))
    const cleanUnit = Math.max(0, unitPrice)

    return {
      description,
      detail: cleanText(item.detail, 600),
      qty: cleanQty,
      unitPrice: cleanUnit,
      subtotal: cleanQty * cleanUnit,
    }
  }).filter(Boolean) as Array<{
    description: string
    detail: string | null
    qty: number
    unitPrice: number
    subtotal: number
  }>
}

async function ensureAdmin() {
  try {
    await requireAdminSession()
    return null
  } catch {
    return unauthorizedAdminResponse()
  }
}

export async function GET() {
  const unauthorized = await ensureAdmin()
  if (unauthorized) return unauthorized

  const data = await db.select().from(quotes).orderBy(desc(quotes.createdAt))
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const unauthorized = await ensureAdmin()
  if (unauthorized) return unauthorized

  try {
    const body = await req.json()
    const clientName = cleanText(body.clientName, 160)
    const items = cleanItems(body.items)

    if (!clientName) {
      return NextResponse.json({ error: 'Cliente requerido' }, { status: 400 })
    }

    if (items.length === 0) {
      return NextResponse.json({ error: 'Agrega al menos un item valido' }, { status: 400 })
    }

    const leadId = cleanLeadId(body.leadId)
    if (leadId) {
      const [lead] = await db.select().from(leads).where(eq(leads.id, leadId))
      if (!lead) return NextResponse.json({ error: 'Lead no encontrado' }, { status: 400 })
    }

    const total = calculateQuoteTotal(items)
    const number = `PG-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`

    const [quote] = await db.insert(quotes).values({
      number,
      leadId,
      clientName,
      clientEmail: cleanText(body.clientEmail, 160),
      clientPhone: cleanText(body.clientPhone, 80),
      validDays: cleanPositiveInteger(body.validDays, 15),
      notes: cleanText(body.notes, 2000),
      total: String(total),
      currency: 'CLP',
      status: 'draft',
    }).returning()

    for (const item of items) {
      await db.insert(quoteItems).values({
        quoteId: quote.id,
        description: item.description,
        detail: item.detail,
        qty: item.qty,
        unitPrice: String(item.unitPrice),
        subtotal: String(item.subtotal),
      })
    }

    if (leadId) {
      const [lead] = await db.select().from(leads).where(eq(leads.id, leadId))
      if (lead && lead.status !== 'won' && lead.status !== 'discarded') {
        await db.update(leads).set({ status: 'quoted' }).where(eq(leads.id, leadId))
      }
    }

    return NextResponse.json({ ok: true, id: quote.id, number: quote.number })
  } catch {
    return NextResponse.json({ error: 'Error al crear cotizacion' }, { status: 500 })
  }
}
