/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../../lib/db'
import { clientPayments } from '../../lib/schema'
import { vexorDb } from '../../lib/vexor-db'
import { tenants, tenantSubscriptions } from '../../lib/vexor-schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function FinancialDashboard() {
  const [allTenants, allPayments] = await Promise.all([
    vexorDb.select().from(tenants),
    db.select().from(clientPayments).orderBy(desc(clientPayments.createdAt)),
  ]);

  const subsData = await Promise.all(
    allTenants.map(async (t) => {
      const [sub] = await vexorDb
        .select()
        .from(tenantSubscriptions)
        .where(eq(tenantSubscriptions.tenantId, t.id)); // ← sintaxis correcta
      return { ...t, sub: sub ?? null };
    }),
  );
  const activeSubs = subsData.filter((t) => t.sub?.status === "active");
  const suspendedSubs  = subsData.filter(t => t.sub?.status === 'suspended')
  const mrr            = activeSubs.reduce((s, t) => s + Number(t.sub?.totalPrice ?? 0), 0)

  const now            = new Date()
  const thisMonth      = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth      = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0)

  const paymentsThisMonth = allPayments.filter(p =>
    new Date(p.createdAt!) >= thisMonth
  )
  const paymentsLastMonth = allPayments.filter(p =>
    new Date(p.createdAt!) >= lastMonth && new Date(p.createdAt!) <= lastMonthEnd
  )

  const revenueThisMonth = paymentsThisMonth.reduce((s, p) => s + Number(p.amount), 0)
  const revenueLastMonth = paymentsLastMonth.reduce((s, p) => s + Number(p.amount), 0)
  const pendingThisMonth = mrr - revenueThisMonth

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date  = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
    const label = date.toLocaleDateString('es-CL', { month: 'short', year: '2-digit' })
    const total = allPayments
      .filter(p => new Date(p.createdAt!) >= date && new Date(p.createdAt!) <= end)
      .reduce((s, p) => s + Number(p.amount), 0)
    return { label, total }
  }).reverse()

  const maxRevenue = Math.max(...last6Months.map(m => m.total), 1)

  const pendingClients = subsData.filter(t => {
    const paid = allPayments
      .filter(p => p.tenantId === t.id && new Date(p.createdAt!) >= thisMonth)
      .reduce((s, p) => s + Number(p.amount), 0)
    return paid < Number(t.sub?.totalPrice ?? 0) && t.sub?.status === 'active'
  })

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: '0 0 80px' }}>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border)', background: 'var(--bg2)',
        padding: '0 32px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/admin" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
            ← Admin
          </Link>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
            Dashboard financiero
          </span>
        </div>
        <Link href="/admin/vexor" style={{ fontSize: 13, color: 'var(--cyan)', textDecoration: 'none' }}>
          Ver clientes →
        </Link>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px' }}>

        {/* Stats principales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'MRR',                value: `$${mrr} USD`,                    color: 'var(--cyan)',    icon: '💰' },
            { label: 'Cobrado este mes',   value: `$${revenueThisMonth} USD`,        color: 'var(--success)', icon: '✅' },
            { label: 'Pendiente este mes', value: `$${Math.max(0, pendingThisMonth)} USD`, color: pendingThisMonth > 0 ? 'var(--danger)' : 'var(--success)', icon: '⏳' },
            { label: 'Clientes activos',   value: String(activeSubs.length),         color: 'var(--text)',    icon: '🏪' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>{s.label}</p>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: s.color }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

          {/* Gráfico ingresos últimos 6 meses */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>
              Ingresos últimos 6 meses
            </h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
              {last6Months.map((m, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                    ${m.total}
                  </span>
                  <div style={{
                    width: '100%',
                    height: `${Math.max((m.total / maxRevenue) * 100, 4)}px`,
                    background: i === 5 ? 'var(--cyan)' : 'rgba(14,165,233,0.3)',
                    borderRadius: '4px 4px 0 0',
                    minHeight: 4,
                  }} />
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{m.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Mes anterior</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                  ${revenueLastMonth} USD
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Este mes</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--cyan)' }}>
                  ${revenueThisMonth} USD
                </p>
              </div>
            </div>
          </div>

          {/* Clientes con pago pendiente */}
          <div style={{ background: 'var(--surface)', border: `1px solid ${pendingClients.length > 0 ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`, borderRadius: 12, padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
              {pendingClients.length > 0 ? '⚠️ Pagos pendientes este mes' : '✅ Todos al día este mes'}
            </h2>
            {pendingClients.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>
                Todos los clientes activos han pagado este mes.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pendingClients.map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{t.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--muted)' }}>{t.businessType}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--danger)' }}>
                        ${Number(t.sub?.totalPrice ?? 0)} USD
                      </p>
                      <Link href={`/admin/vexor/${t.id}`} style={{ fontSize: 11, color: 'var(--cyan)', textDecoration: 'none' }}>
                        Registrar pago →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resumen por cliente */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
              Resumen por cliente
            </h2>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              {activeSubs.length} activos · {suspendedSubs.length} suspendidos
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Cliente', 'Plan mensual', 'Cobrado este mes', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subsData.map((t, i) => {
                const paidThisMonth = allPayments
                  .filter(p => p.tenantId === t.id && new Date(p.createdAt!) >= thisMonth)
                  .reduce((s, p) => s + Number(p.amount), 0)
                const isPaid = paidThisMonth >= Number(t.sub?.totalPrice ?? 0)

                return (
                  <tr key={t.id} style={{ borderBottom: i < subsData.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--muted)' }}>{t.businessType}</p>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--cyan)' }}>
                      ${Number(t.sub?.totalPrice ?? 0)} USD
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: isPaid ? 'var(--success)' : 'var(--danger)' }}>
                        ${paidThisMonth} USD
                      </span>
                      {!isPaid && t.sub?.status === 'active' && (
                        <p style={{ fontSize: 11, color: 'var(--danger)' }}>
                          Falta ${Number(t.sub?.totalPrice ?? 0) - paidThisMonth} USD
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontSize: 11, padding: '3px 10px', borderRadius: 100,
                        background: t.sub?.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: t.sub?.status === 'active' ? 'var(--success)' : 'var(--danger)',
                      }}>
                        {t.sub?.status === 'active' ? 'Activo' : t.sub?.status === 'suspended' ? 'Suspendido' : 'Sin suscripción'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Link href={`/admin/vexor/${t.id}`} style={{ fontSize: 12, padding: '4px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted)', textDecoration: 'none' }}>
                        Gestionar →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Últimos pagos */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginTop: 16 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
              Últimos pagos recibidos
            </h2>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Cliente', 'Monto', 'Método', 'Período', 'Fecha'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPayments.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                  Sin pagos registrados aún.
                </td></tr>
              ) : allPayments.slice(0, 10).map((p, i) => {
                const tenant = subsData.find(t => t.id === p.tenantId)
                return (
                  <tr key={p.id} style={{ borderBottom: i < Math.min(allPayments.length, 10) - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>
                      {tenant?.name ?? `Cliente #${p.tenantId}`}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>
                      ${Number(p.amount).toLocaleString('es-CL')} {p.currency}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>
                      {p.method}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>
                      {p.period ?? '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)' }}>
                      {new Date(p.createdAt!).toLocaleDateString('es-CL')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}