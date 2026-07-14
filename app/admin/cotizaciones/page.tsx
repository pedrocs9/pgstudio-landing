import { desc } from 'drizzle-orm'
import AdminPageHeader from '../../components/admin-page-header'
import QuotesClient from '../../components/quotes-client'
import { db } from '../../lib/db'
import { quotes } from '../../lib/schema'

export const dynamic = 'force-dynamic'

export default async function CotizacionesPage() {
  const allQuotes = await db.select().from(quotes).orderBy(desc(quotes.createdAt))

  return (
    <main className="admin-main">
      <AdminPageHeader
        eyebrow="Comercial"
        title="Cotizaciones"
        description="Gestiona propuestas, estados comerciales, vencimientos y conversiones a proyecto desde un solo lugar."
        action={{ href: '/admin/cotizaciones/nueva', label: 'Nueva cotizacion' }}
      />
      <QuotesClient quotes={allQuotes} />
    </main>
  )
}
