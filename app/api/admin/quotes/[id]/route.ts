import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession, unauthorizedAdminResponse } from '../../../../lib/admin-auth'
import { db } from '../../../../lib/db'
import { calculateQuoteTotal, isAllowedQuoteStatus } from '../../../../lib/quote-pipeline'
import { projects, quoteItems, quotes } from '../../../../lib/schema'

async function ensureAdmin() {
  try {
    await requireAdminSession()
    return null
  } catch {
    return unauthorizedAdminResponse()
  }
}

function cleanId(value: string) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, maxLength)
}

function cleanItems(value: unknown) {
  if (!Array.isArray(value)) return null

  const items = value.map(item => {
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

  return items.length > 0 ? items : null
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ensureAdmin()
  if (unauthorized) return unauthorized

  const { id } = await params
  const quoteId = cleanId(id)
  if (!quoteId) return NextResponse.json({ error: 'Cotizacion invalida' }, { status: 400 })

  const [quote] = await db.select().from(quotes).where(eq(quotes.id, quoteId))
  const items = await db.select().from(quoteItems).where(eq(quoteItems.quoteId, quoteId))
  return NextResponse.json({ quote, items })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ensureAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    const quoteId = cleanId(id)
    if (!quoteId) return NextResponse.json({ error: 'Cotizacion invalida' }, { status: 400 })

    const body = await req.json()
    const update: Partial<typeof quotes.$inferInsert> = {}

    if ('status' in body) {
      if (!isAllowedQuoteStatus(body.status)) {
        return NextResponse.json({ error: 'Estado invalido' }, { status: 400 })
      }
      update.status = body.status
    }

    const items = 'items' in body ? cleanItems(body.items) : undefined
    if ('clientName' in body) {
      const clientName = cleanText(body.clientName, 160)
      if (!clientName) return NextResponse.json({ error: 'Cliente requerido' }, { status: 400 })
      update.clientName = clientName
      update.clientEmail = cleanText(body.clientEmail, 160)
      update.clientPhone = cleanText(body.clientPhone, 80)
      update.validDays = Math.max(1, Math.min(365, Math.round(Number(body.validDays || 15))))
      update.notes = cleanText(body.notes, 2000)
      update.currency = 'CLP'
    }

    if (items !== undefined) {
      if (!items) return NextResponse.json({ error: 'Items invalidos' }, { status: 400 })
      update.total = String(calculateQuoteTotal(items))
    }

    if (Object.keys(update).length > 0) {
      await db.update(quotes).set(update).where(eq(quotes.id, quoteId))
    }

    if (items) {
      await db.delete(quoteItems).where(eq(quoteItems.quoteId, quoteId))
      for (const item of items) {
        await db.insert(quoteItems).values({
          quoteId,
          description: item.description,
          detail: item.detail,
          qty: item.qty,
          unitPrice: String(item.unitPrice),
          subtotal: String(item.subtotal),
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ensureAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    const quoteId = cleanId(id)
    if (!quoteId) return NextResponse.json({ error: 'Cotizacion invalida' }, { status: 400 })

    const body = await req.json()
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, quoteId))
    if (!quote) return NextResponse.json({ error: 'Cotizacion no encontrada' }, { status: 404 })

    if (body.action === 'duplicate') {
      const items = await db.select().from(quoteItems).where(eq(quoteItems.quoteId, quoteId))
      const number = `PG-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`
      const [copy] = await db.insert(quotes).values({
        number,
        leadId: quote.leadId ?? null,
        clientName: quote.clientName,
        clientEmail: quote.clientEmail,
        clientPhone: quote.clientPhone,
        validDays: quote.validDays ?? 15,
        notes: quote.notes,
        total: quote.total,
        currency: 'CLP',
        status: 'draft',
      }).returning()

      for (const item of items) {
        await db.insert(quoteItems).values({
          quoteId: copy.id,
          description: item.description,
          detail: item.detail,
          qty: item.qty,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })
      }

      return NextResponse.json({ ok: true, id: copy.id })
    }

    if (body.action === 'createProject') {
      if (quote.status !== 'accepted') {
        return NextResponse.json({ error: 'Solo una cotizacion aceptada puede crear proyecto' }, { status: 400 })
      }
      if (quote.projectId) {
        return NextResponse.json({ error: 'Esta cotizacion ya tiene proyecto' }, { status: 400 })
      }

      const [existing] = await db.select().from(projects).where(eq(projects.quoteId, quote.id))
      if (existing) return NextResponse.json({ error: 'Ya existe un proyecto relacionado' }, { status: 400 })

      const [project] = await db.insert(projects).values({
        quoteId: quote.id,
        name: cleanText(body.name, 160) ?? `Proyecto ${quote.clientName}`,
        clientName: quote.clientName,
        type: cleanText(body.type, 60) ?? 'custom',
        status: 'development',
        oneTimeFee: String(Number(quote.total || 0)),
        monthlyFee: '0',
        notes: cleanText(body.notes, 1200) ?? `Creado desde ${quote.number}.`,
      }).returning()

      await db.update(quotes).set({ projectId: project.id }).where(eq(quotes.id, quote.id))
      return NextResponse.json({ ok: true, projectId: project.id })
    }

    return NextResponse.json({ error: 'Accion invalida' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Error al procesar cotizacion' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ensureAdmin()
  if (unauthorized) return unauthorized

  const { id } = await params
  const quoteId = cleanId(id)
  if (!quoteId) return NextResponse.json({ error: 'Cotizacion invalida' }, { status: 400 })

  const [quote] = await db.select().from(quotes).where(eq(quotes.id, quoteId))
  if (!quote) return NextResponse.json({ ok: true })
  if (quote.projectId || quote.status === 'accepted') {
    return NextResponse.json({ error: 'No se puede eliminar una cotizacion aceptada o relacionada' }, { status: 400 })
  }

  await db.update(quotes).set({ status: 'cancelled' }).where(eq(quotes.id, quoteId))
  return NextResponse.json({ ok: true })
}
