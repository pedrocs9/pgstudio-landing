import Link from 'next/link'
import { desc, eq } from 'drizzle-orm'
import { db } from '../lib/db'
import { leads, projects, quotes } from '../lib/schema'
import { vexorDb } from '../lib/vexor-db'
import { tenants, tenantSubscriptions } from '../lib/vexor-schema'
import LeadsClient from '../components/leads-client'
import AdminPageHeader from '../components/admin-page-header'
import { getLeadProductLabel, normalizeLeadStatus } from '../lib/lead-pipeline'
import { formatQuoteMoney, getQuoteComputedStatus, isOpenQuote } from '../lib/quote-pipeline'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [allLeads, allProjects, allQuotes, allTenants] = await Promise.all([
    db.select().from(leads).orderBy(desc(leads.createdAt)),
    db.select().from(projects).orderBy(desc(projects.createdAt)),
    db.select().from(quotes).orderBy(desc(quotes.createdAt)),
    vexorDb.select().from(tenants),
  ])

  const tenantsWithSubs = await Promise.all(
    allTenants.map(async tenant => {
      const [sub] = await vexorDb.select().from(tenantSubscriptions)
        .where(eq(tenantSubscriptions.tenantId, tenant.id))
      return { ...tenant, sub: sub ?? null }
    })
  )

  const newLeads = allLeads.filter(lead => normalizeLeadStatus(lead.status) === 'new')
  const openQuotes = allQuotes.filter(isOpenQuote)
  const sentQuotes = allQuotes.filter(quote => getQuoteComputedStatus(quote) === 'sent')
  const expiredQuotes = allQuotes.filter(quote => getQuoteComputedStatus(quote) === 'expired')
  const acceptedQuotes = allQuotes.filter(quote => getQuoteComputedStatus(quote) === 'accepted')
  const quotePotential = openQuotes.reduce((sum, quote) => sum + Number(quote.total || 0), 0)
  const activeProjects = allProjects.filter(project => project.status === 'active' || project.status === 'development')
  const activeVexor = tenantsWithSubs.filter(tenant => tenant.sub?.status === 'active')
  const suspendedVexor = tenantsWithSubs.filter(tenant => tenant.sub?.status === 'suspended')

  const attention = [
    { label: 'Leads nuevos', value: newLeads.length, href: '#leads', detail: 'Solicitudes sin revisar' },
    { label: 'Cotizaciones abiertas', value: openQuotes.length, href: '/admin/cotizaciones', detail: `${sentQuotes.length} enviadas · ${expiredQuotes.length} vencidas` },
    { label: 'Proyectos activos', value: activeProjects.length, href: '/admin/proyectos', detail: 'En desarrollo u operacion' },
    { label: 'Vexor en seguimiento', value: activeVexor.length + suspendedVexor.length, href: '/admin/vexor', detail: 'Clientes activos o suspendidos' },
  ]

  const recentActivity = [
    ...allLeads.slice(0, 3).map(lead => ({
      label: 'Lead',
      title: lead.name || lead.email,
      detail: getLeadProductLabel(lead.product),
      date: lead.createdAt,
      href: '#leads',
    })),
    ...allQuotes.slice(0, 3).map(quote => ({
      label: 'Cotizacion',
      title: quote.clientName,
      detail: `${quote.number} · ${getQuoteComputedStatus(quote)} · ${formatQuoteMoney(quote.total, quote.currency)}`,
      date: quote.createdAt,
      href: `/admin/cotizaciones/${quote.id}`,
    })),
    ...allProjects.slice(0, 3).map(project => ({
      label: 'Proyecto',
      title: project.name,
      detail: project.status,
      date: project.createdAt,
      href: `/admin/proyectos/${project.id}`,
    })),
  ].sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()).slice(0, 6)

  return (
    <main className="admin-main">
      <AdminPageHeader
        eyebrow="Inicio"
        title="Panel de PG Studio"
        description="Resumen operativo para revisar solicitudes, cotizaciones, proyectos activos y clientes Vexor sin perder contexto."
        action={{ href: '/admin/cotizaciones/nueva', label: 'Nueva cotizacion' }}
      />

      <section className="admin-metric-grid" aria-label="Resumen operativo">
        {attention.map(item => (
          <Link key={item.label} href={item.href} className="admin-card" style={{ textDecoration: 'none' }}>
            <p className="admin-card-label">{item.label}</p>
            <p className="admin-card-value">{item.value}</p>
            <span style={{ color: 'var(--muted)', fontSize: 12 }}>{item.detail}</span>
          </Link>
        ))}
      </section>

      <section className="admin-dashboard-grid">
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
            <div>
              <p className="admin-card-label">Atencion requerida</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Siguiente mejor accion</h2>
            </div>
            <Link href={newLeads.length > 0 ? '#leads' : '/admin/cotizaciones'} style={{ color: 'var(--cyan)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Revisar →
            </Link>
          </div>
          <div className="admin-list">
            {newLeads.length > 0 ? newLeads.slice(0, 4).map(lead => (
              <div key={lead.id} className="admin-list-row">
                <div>
                  <strong>{lead.name || lead.email}</strong>
                  <span>{getLeadProductLabel(lead.product)} · {lead.email}</span>
                </div>
                <Link href="#leads" style={{ color: 'var(--cyan)', fontSize: 13, textDecoration: 'none' }}>Gestionar</Link>
              </div>
            )) : (
              <p className="admin-empty">Todavia no hay leads nuevos. Revisa cotizaciones abiertas o proyectos activos.</p>
            )}
          </div>
        </div>

        <div className="admin-card">
          <p className="admin-card-label">Accesos rapidos</p>
          <div className="admin-list">
            {[
              { href: '/admin/proyectos/nuevo', label: 'Nuevo proyecto', detail: 'Crear entrega o mantencion' },
              { href: '/admin/cotizaciones/nueva', label: 'Nueva cotizacion', detail: 'Preparar propuesta PDF' },
              { href: '/admin/vexor/nuevo', label: 'Nuevo cliente Vexor', detail: 'Alta de implementacion' },
              { href: '/admin/dashboard', label: 'Ver finanzas', detail: 'MRR, pagos y pendientes' },
            ].map(item => (
              <Link key={item.href} href={item.href} className="admin-list-row" style={{ textDecoration: 'none' }}>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.detail}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-dashboard-grid">
        <div className="admin-card">
          <p className="admin-card-label">Proyectos activos</p>
          <div className="admin-list">
            {activeProjects.length === 0 ? <p className="admin-empty">No hay proyectos activos.</p> : activeProjects.slice(0, 5).map(project => (
              <Link key={project.id} href={`/admin/proyectos/${project.id}`} className="admin-list-row" style={{ textDecoration: 'none' }}>
                <div>
                  <strong>{project.name}</strong>
                  <span>{project.clientName} · {project.status}</span>
                </div>
                <span>{Number(project.monthlyFee) > 0 ? `$${Number(project.monthlyFee).toLocaleString('es-CL')}` : 'Sin fee'}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <p className="admin-card-label">Clientes Vexor</p>
          <div className="admin-list">
            {tenantsWithSubs.length === 0 ? <p className="admin-empty">Todavia no hay clientes Vexor.</p> : tenantsWithSubs.slice(0, 5).map(tenant => (
              <Link key={tenant.id} href={`/admin/vexor/${tenant.id}`} className="admin-list-row" style={{ textDecoration: 'none' }}>
                <div>
                  <strong>{tenant.name}</strong>
                  <span>{tenant.businessType} · {tenant.sub?.status ?? 'sin suscripcion'}</span>
                </div>
                <span>${Number(tenant.sub?.totalPrice ?? 0).toLocaleString('es-CL')} CLP</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-card" style={{ marginTop: 16 }}>
        <p className="admin-card-label">Actividad reciente</p>
        <div className="admin-list">
          {recentActivity.length === 0 ? <p className="admin-empty">Todavia no hay actividad registrada.</p> : recentActivity.map((item, index) => (
            <Link key={`${item.label}-${index}`} href={item.href} className="admin-list-row" style={{ textDecoration: 'none' }}>
              <div>
                <strong>{item.label}: {item.title}</strong>
                <span>{item.detail}</span>
              </div>
              <span>{item.date ? new Date(item.date).toLocaleDateString('es-CL') : 'Sin fecha'}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="admin-card" style={{ marginTop: 16 }}>
        <p className="admin-card-label">Pipeline de cotizaciones</p>
        <div className="admin-list">
          <div className="admin-list-row">
            <div>
              <strong>{formatQuoteMoney(quotePotential)}</strong>
              <span>Monto potencial activo sin rechazadas ni canceladas</span>
            </div>
            <Link href="/admin/cotizaciones" style={{ color: 'var(--cyan)', fontSize: 13, textDecoration: 'none' }}>Ver pipeline</Link>
          </div>
          <div className="admin-list-row">
            <div>
              <strong>{acceptedQuotes.length} aceptadas recientes</strong>
              <span>{expiredQuotes.length} vencidas requieren revision</span>
            </div>
          </div>
        </div>
      </section>

      <section id="leads" style={{ marginTop: 24 }}>
        <AdminPageHeader
          title="Leads"
          description="Solicitudes recibidas desde el formulario publico. Filtra, revisa y actualiza el estado sin salir del panel."
        />
        <LeadsClient leads={allLeads} />
      </section>
    </main>
  )
}
