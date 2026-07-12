/* eslint-disable @typescript-eslint/no-explicit-any */
import { vexorDb } from '../../lib/vexor-db'
import { tenants, tenantSubscriptions, tenantModules, users } from '../../lib/vexor-schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function VexorTenantsPage() {
  const allTenants = await vexorDb.select().from(tenants)

  const tenantsWithData = await Promise.all(
    allTenants.map(async t => {
      const [sub] = await vexorDb.select().from(tenantSubscriptions)
        .where(eq(tenantSubscriptions.tenantId, t.id))
      const allUsers = await vexorDb.select().from(users)
        .where(eq(users.tenantId, t.id))
      const modules = await vexorDb.select().from(tenantModules)
        .where(eq(tenantModules.tenantId, t.id))
      const activeModules = modules.filter(m => m.active).length
      return { ...t, sub: sub ?? null, userCount: allUsers.length, activeModules }
    })
  )

  const totalMRR = tenantsWithData.reduce((s, t) =>
    s + Number(t.sub?.totalPrice ?? 0), 0
  )
  const activeCount    = tenantsWithData.filter(t => t.sub?.status === 'active').length
  const suspendedCount = tenantsWithData.filter(t => t.sub?.status === 'suspended').length

  return (
    <div style={{ padding: '32px', background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Link href="/admin" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
              ← Admin
            </Link>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            Clientes Vexor
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            {tenantsWithData.length} negocios registrados
          </p>
        </div>
        <Link href="/admin/vexor/nuevo" style={{
          padding: '10px 20px', background: 'var(--cyan)',
          color: 'var(--bg)', borderRadius: 8,
          fontFamily: 'var(--font-display)',
          fontSize: 14, fontWeight: 600,
          textDecoration: 'none',
        }}>
          + Nuevo cliente
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'MRR total', value: `$${totalMRR.toLocaleString('es-CL')} CLP`, color: 'var(--cyan)' },
          { label: 'Clientes activos',  value: String(activeCount),       color: 'var(--success)' },
          { label: 'Suspendidos',       value: String(suspendedCount),    color: suspendedCount > 0 ? 'var(--danger)' : 'var(--muted)' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Negocio', 'Tipo', 'Usuarios', 'Módulos', 'MRR', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenantsWithData.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                Aún no hay clientes. Crea el primero.
              </td></tr>
            ) : tenantsWithData.map((t, i) => (
              <tr key={t.id} style={{ borderBottom: i < tenantsWithData.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td style={{ padding: '14px 16px' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{t.name}</p>
                  {t.phone && <p style={{ fontSize: 12, color: 'var(--muted)' }}>{t.phone}</p>}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>
                  {t.businessType}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
                  {t.userCount}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
                  {t.activeModules}
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--cyan)' }}>
                  ${Number(t.sub?.totalPrice ?? 0)} USD
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 100,
                    background: t.sub?.status === 'active' ? 'rgba(16,185,129,0.1)' :
                      t.sub?.status === 'suspended' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                    color: t.sub?.status === 'active' ? 'var(--success)' :
                      t.sub?.status === 'suspended' ? 'var(--danger)' : 'var(--warning)',
                  }}>
                    {t.sub?.status === 'active' ? 'Activo' :
                      t.sub?.status === 'suspended' ? 'Suspendido' : 'Sin suscripción'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <Link href={`/admin/vexor/${t.id}`} style={{
                    fontSize: 12, padding: '4px 12px',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 6, color: 'var(--muted)',
                    textDecoration: 'none',
                  }}>
                    Gestionar →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}