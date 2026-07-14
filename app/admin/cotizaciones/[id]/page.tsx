import { eq } from 'drizzle-orm'
import Link from 'next/link'
import QuoteDetailClient from '../../../components/quote-detail-client'
import { db } from '../../../lib/db'
import { quoteItems, quotes } from '../../../lib/schema'

export const dynamic = 'force-dynamic'

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const quoteId = Number(id)

  if (!Number.isInteger(quoteId) || quoteId <= 0) {
    return <QuoteNotFound />
  }

  const [quote] = await db.select().from(quotes).where(eq(quotes.id, quoteId))

  if (!quote) return <QuoteNotFound />

  const items = await db.select().from(quoteItems)
    .where(eq(quoteItems.quoteId, quoteId))

  return (
    <main className="admin-main">
      <QuoteDetailClient quote={quote} items={items} />
    </main>
  )
}

function QuoteNotFound() {
  return (
    <main className="admin-main">
      <section className="admin-card">
        Cotizacion no encontrada. <Link href="/admin/cotizaciones">Volver</Link>
      </section>
    </main>
  )
}
