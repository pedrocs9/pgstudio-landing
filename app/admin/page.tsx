import { db } from '../lib/db'
import { leads, clients } from '../lib/schema'
import { desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const allLeads   = await db.select().from(leads).orderBy(desc(leads.createdAt))
  const allClients = await db.select().from(clients).orderBy(desc(clients.createdAt))

  const stats = {
    leads:   allLeads.length,
    new:     allLeads.filter(l => l.status === 'new').length,
    clients: allClients.length,
    active:  allClients.filter(c => c.status === 'active').length,
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: '0 0 80px' }}>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)',
        padding: '0 32px',
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
            pgstudio <span style={{ color: 'var(--muted)', fontWeight: 400 }}>/ admin</span>
          </span>
        </div>
        
        <a href="/api/admin/logout"
          style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}
        >
          Cerrar sesión
        </a>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px' }}>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12, marginBottom: 40,
        }}>
          {[
            { label: 'Leads totales',    value: stats.leads,   color: 'var(--cyan)' },
            { label: 'Leads nuevos',     value: stats.new,     color: '#f59e0b' },
            { label: 'Clientes totales', value: stats.clients, color: '#10b981' },
            { label: 'Clientes activos', value: stats.active,  color: '#10b981' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 12, padding: '20px 24px',
            }}>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{s.label}</p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32, fontWeight: 700, color: s.color,
              }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Leads table */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14, overflow: 'hidden', marginBottom: 32,
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16, fontWeight: 600, color: 'var(--text)',
            }}>
              Leads recientes
            </h2>
            <span style={{
              fontSize: 12, padding: '3px 10px',
              background: 'rgba(14,165,233,0.1)',
              color: 'var(--cyan)', borderRadius: 100,
            }}>
              {stats.leads} total
            </span>
          </div>

          {allLeads.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>
                Aún no hay leads. Cuando alguien llene el formulario aparecerá aquí.
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Email', 'Estado', 'Fecha'].map(h => (
                    <th key={h} style={{
                      padding: '12px 24px', textAlign: 'left',
                      fontSize: 12, fontWeight: 600,
                      color: 'var(--muted)', letterSpacing: '.06em',
                      textTransform: 'uppercase',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allLeads.map((lead, i) => (
                  <tr key={lead.id} style={{
                    borderBottom: i < allLeads.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <td style={{ padding: '14px 24px', fontSize: 14, color: 'var(--text)' }}>
                      {lead.email}
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{
                        fontSize: 12, padding: '3px 10px', borderRadius: 100,
                        background: lead.status === 'new'
                          ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                        color: lead.status === 'new' ? '#f59e0b' : '#10b981',
                      }}>
                        {lead.status === 'new' ? 'Nuevo' : 'Contactado'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: 13, color: 'var(--muted)' }}>
                      {lead.createdAt
                        ? new Date(lead.createdAt).toLocaleDateString('es-CL', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Clients table */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16, fontWeight: 600, color: 'var(--text)',
            }}>
              Clientes
            </h2>
            <span style={{
              fontSize: 12, padding: '3px 10px',
              background: 'rgba(16,185,129,0.1)',
              color: '#10b981', borderRadius: 100,
            }}>
              {stats.clients} total
            </span>
          </div>

          {allClients.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>
                Aún no hay clientes registrados.
              </p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Email', 'Producto', 'Plan', 'Estado', 'Fecha'].map(h => (
                    <th key={h} style={{
                      padding: '12px 24px', textAlign: 'left',
                      fontSize: 12, fontWeight: 600,
                      color: 'var(--muted)', letterSpacing: '.06em',
                      textTransform: 'uppercase',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allClients.map((client, i) => (
                  <tr key={client.id} style={{
                    borderBottom: i < allClients.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <td style={{ padding: '14px 24px', fontSize: 14, color: 'var(--text)' }}>
                      {client.email}
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: 13, color: 'var(--muted)' }}>
                      {client.product ?? '—'}
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: 13, color: 'var(--muted)' }}>
                      {client.plan ?? '—'}
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{
                        fontSize: 12, padding: '3px 10px', borderRadius: 100,
                        background: client.status === 'active'
                          ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: client.status === 'active' ? '#10b981' : '#ef4444',
                      }}>
                        {client.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: 13, color: 'var(--muted)' }}>
                      {client.createdAt
                        ? new Date(client.createdAt).toLocaleDateString('es-CL', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  )
}