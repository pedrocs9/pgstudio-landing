/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../../../lib/db'
import { quotes, quoteItems } from '../../../lib/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import QuoteDetailClient from '../../../components/quote-detail-client'

export const dynamic = 'force-dynamic'

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }  = await params
  const [quote] = await db.select().from(quotes).where(eq(quotes.id, Number(id)))

  if (!quote) return (
    <div style={{ padding: '32px', color: 'var(--text)' }}>
      Cotización no encontrada. <Link href="/admin/cotizaciones">← Volver</Link>
    </div>
  )

  const items = await db.select().from(quoteItems)
    .where(eq(quoteItems.quoteId, Number(id)))

  return (
    <div style={{ padding: '32px', background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/cotizaciones" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
          ← Cotizaciones
        </Link>
      </div>
      <QuoteDetailClient quote={quote as any} items={items as any} />
    </div>
  )
}