/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../../lib/db'
import { projects, projectPayments } from '../../lib/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const TYPE_LABELS: any = {
  landing:   'Landing page',
  ecommerce: 'E-commerce',
  system:    'Sistema a medida',
  saas:      'SaaS',
  other:     'Otro',
}

const STATUS_LABELS: any = {
  development: { label: 'En desarrollo', color: 'var(--warning)',  bg: 'rgba(245,158,11,0.1)' },
  active:      { label: 'Activo',        color: 'var(--success)',  bg: 'rgba(16,185,129,0.1)' },
  paused:      { label: 'Pausado',       color: 'var(--muted)',    bg: 'var(--surface)' },
  finished:    { label: 'Terminado',     color: 'var(--muted)',    bg: 'var(--surface)' },
}

export default async function ProyectosPage() {
  const allProjects  = await db.select().from(projects).orderBy(desc(projects.createdAt))
  const allPayments  = await db.select().from(projectPayments)

  const activeProjects = allProjects.filter(p => p.status === 'active')
  const mrrProjects    = activeProjects.reduce((s, p) => s + Number(p.monthlyFee), 0)
  const totalPaid      = allPayments.reduce((s, p) => s + Number(p.amount), 0)

  return (
    <main className="admin-main">
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Total proyectos',   value: String(allProjects.length),          color: 'var(--text)' },
            { label: 'Activos',           value: String(activeProjects.length),        color: 'var(--success)' },
            { label: 'MRR mantencion',    value: `$${mrrProjects.toLocaleString('es-CL')} CLP`, color: 'var(--cyan)' },
            { label: 'Total cobrado',     value: `$${totalPaid.toLocaleString('es-CL')} CLP`,   color: 'var(--warning)' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Proyecto', 'Cliente', 'Tipo', 'Fee mensual', 'Estado', 'Links', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allProjects.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                  No hay proyectos aun. Crea el primero.
                </td></tr>
              ) : allProjects.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < allProjects.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{p.name}</p>
                    {p.url && <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--cyan)', textDecoration: 'none' }}>{p.url}</a>}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>{p.clientName}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>{TYPE_LABELS[p.type] ?? p.type}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--cyan)' }}>
                    {Number(p.monthlyFee) > 0 ? `$${Number(p.monthlyFee).toLocaleString('es-CL')}` : '-'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: STATUS_LABELS[p.status]?.bg, color: STATUS_LABELS[p.status]?.color }}>
                      {STATUS_LABELS[p.status]?.label ?? p.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--muted)', textDecoration: 'none' }}> Repo</a>}
                      {p.deployUrl && <a href={p.deployUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--muted)', textDecoration: 'none' }}> Deploy</a>}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link href={`/admin/proyectos/${p.id}`} style={{ fontSize: 12, padding: '4px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted)', textDecoration: 'none' }}>
                      Gestionar {'->'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
