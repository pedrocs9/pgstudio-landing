/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../../lib/db'
import { quotes } from '../../lib/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: any = {
  draft:    { label: 'Borrador',  color: 'var(--muted)',   bg: 'var(--surface)' },
  sent:     { label: 'Enviada',   color: 'var(--cyan)',    bg: 'rgba(14,165,233,0.1)' },
  accepted: { label: 'Aceptada', color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
  rejected: { label: 'Rechazada',color: 'var(--danger)',  bg: 'rgba(239,68,68,0.1)' },
}

export default async function CotizacionesPage() {
  const allQuotes = await db.select().from(quotes).orderBy(desc(quotes.createdAt))

  const stats = {
    total:    allQuotes.length,
    sent:     allQuotes.filter(q => q.status === 'sent').length,
    accepted: allQuotes.filter(q => q.status === 'accepted').length,
    total_accepted: allQuotes
      .filter(q => q.status === 'accepted')
      .reduce((s, q) => s + Number(q.total), 0),
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: '0 0 80px' }}>
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg2)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/admin" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>← Admin</Link>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Cotizaciones</span>
        </div>
        <Link href="/admin/cotizaciones/nueva" style={{ padding: '8px 18px', background: 'var(--cyan)', color: 'var(--bg)', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          + Nueva cotización
        </Link>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Total cotizaciones', value: String(stats.total),                                    color: 'var(--text)' },
            { label: 'Enviadas',           value: String(stats.sent),                                     color: 'var(--cyan)' },
            { label: 'Aceptadas',          value: String(stats.accepted),                                 color: 'var(--success)' },
            { label: 'Total aceptado',     value: `$${stats.total_accepted.toLocaleString('es-CL')} CLP`, color: 'var(--warning)' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['N°', 'Cliente', 'Total', 'Estado', 'Fecha', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allQuotes.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                  No hay cotizaciones aún. Crea la primera.
                </td></tr>
              ) : allQuotes.map((q, i) => (
                <tr key={q.id} style={{ borderBottom: i < allQuotes.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: 'var(--cyan)' }}>{q.number}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{q.clientName}</p>
                    {q.clientEmail && <p style={{ fontSize: 11, color: 'var(--muted)' }}>{q.clientEmail}</p>}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                    ${Number(q.total).toLocaleString('es-CL')} {q.currency}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: STATUS_LABELS[q.status]?.bg, color: STATUS_LABELS[q.status]?.color }}>
                      {STATUS_LABELS[q.status]?.label ?? q.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>
                    {new Date(q.createdAt!).toLocaleDateString('es-CL')}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link href={`/admin/cotizaciones/${q.id}`} style={{ fontSize: 12, padding: '4px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted)', textDecoration: 'none' }}>
                      Ver →
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