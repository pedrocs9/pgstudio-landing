import { desc } from 'drizzle-orm'
import AdminPageHeader from '../../../components/admin-page-header'
import NewQuoteClient from '../../../components/new-quote-client'
import { db } from '../../../lib/db'
import { leads } from '../../../lib/schema'

export const dynamic = 'force-dynamic'

export default async function NuevaCotizacionPage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string }>
}) {
  const params = await searchParams
  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt))
  const leadId = params.leadId ? Number(params.leadId) : null

  return (
    <main className="admin-main">
      <AdminPageHeader
        eyebrow="Cotizaciones"
        title="Nueva cotizacion"
        description="Prepara una propuesta comercial clara, con items validados, validez y relacion opcional con un lead."
      />
      <NewQuoteClient leads={allLeads} initialLeadId={Number.isInteger(leadId) ? leadId : null} />
    </main>
  )
}
