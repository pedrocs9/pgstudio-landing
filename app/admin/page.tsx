/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../lib/db'
import { leads } from '../lib/schema'
import { vexorDb } from '../lib/vexor-db'
import { tenants } from '../lib/vexor-schema'
import { desc } from 'drizzle-orm'
import LeadsClient from '../components/leads-client'
import AdminQuickLinks from '../components/admin-quick-links'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const allLeads   = await db.select().from(leads).orderBy(desc(leads.createdAt))
  const allTenants = await vexorDb.select().from(tenants)

  const stats = {
    leads:     allLeads.length,
    new:       allLeads.filter(l => l.status === 'new').length,
    contacted: allLeads.filter(l => l.status === 'contacted').length,
    converted: allLeads.filter(l => l.status === 'converted').length,
    clients:   allTenants.length,
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: '0 0 80px' }}>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)', padding: '0 32px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 7,
            background: 'var(--cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: 12, fontWeight: 700, color: 'var(--bg)',
          }}>PG</div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15, fontWeight: 600, color: 'var(--text)',
          }}>
            pgstudio <span style={{ color: 'var(--muted)', fontWeight: 400 }}>/admin</span>
          </span>
        </div>
        <a href="/api/admin/logout" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
          Cerrar sesión
        </a>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px' }}>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 12, marginBottom: 32,
        }}>
          {[
            { label: 'Leads totales',  value: stats.leads,     color: 'var(--cyan)' },
            { label: 'Nuevos',         value: stats.new,       color: 'var(--warning)' },
            { label: 'Contactados',    value: stats.contacted, color: 'var(--cyan)' },
            { label: 'Convertidos',    value: stats.converted, color: 'var(--success)' },
            { label: 'Clientes Vexor', value: stats.clients,   color: 'var(--success)' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 12, padding: '18px 20px',
            }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{s.label}</p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28, fontWeight: 700, color: s.color,
              }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Leads */}
        <LeadsClient leads={allLeads} />

        {/* Accesos rápidos */}
        <AdminQuickLinks />

      </div>
    </main>
  )
}