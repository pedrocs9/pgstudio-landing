import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/db'
import { quotes, quoteItems } from '../../../../lib/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id }    = await params
  const [quote]   = await db.select().from(quotes).where(eq(quotes.id, Number(id)))
  const items     = await db.select().from(quoteItems).where(eq(quoteItems.quoteId, Number(id)))
  return NextResponse.json({ quote, items })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id }     = await params
  const { status } = await req.json()
  await db.update(quotes).set({ status }).where(eq(quotes.id, Number(id)))
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await db.delete(quoteItems).where(eq(quoteItems.quoteId, Number(id)))
  await db.delete(quotes).where(eq(quotes.id, Number(id)))
  return NextResponse.json({ ok: true })
}