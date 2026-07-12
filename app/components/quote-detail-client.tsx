/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateQuotePDF } from './quote-pdf'

const STATUS_LABELS: any = {
  draft:    { label: 'Borrador',   color: 'var(--muted)',   bg: 'var(--surface)' },
  sent:     { label: 'Enviada',    color: 'var(--cyan)',    bg: 'rgba(14,165,233,0.1)' },
  accepted: { label: 'Aceptada',  color: 'var(--success)', bg: 'rgba(16,185,129,0.1)' },
  rejected: { label: 'Rechazada', color: 'var(--danger)',  bg: 'rgba(239,68,68,0.1)' },
}

export default function QuoteDetailClient({ quote, items }: { quote: any, items: any[] }) {
  const router            = useRouter()
  const [status, setStatus] = useState(quote.status)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)

  const total = items.reduce((s, i) => s + Number(i.subtotal), 0)

  async function handleStatusChange(newStatus: string) {
    setSaving(true)
    await fetch(`/api/admin/quotes/${quote.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status: newStatus }),
    })
    setStatus(newStatus)
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar esta cotización?')) return
    await fetch(`/api/admin/quotes/${quote.id}`, { method: 'DELETE' })
    router.push('/admin/cotizaciones')
  }

  async function handleDownload() {
    setGenerating(true)
    await generateQuotePDF(quote, items)
    setGenerating(false)
    await handleStatusChange('sent')
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            {quote.number}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            {quote.clientName} · {new Date(quote.createdAt).toLocaleDateString('es-CL')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={handleDelete} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--danger)', borderRadius: 8, color: 'var(--danger)', fontSize: 13, cursor: 'pointer' }}>
            Eliminar
          </button>
          <button onClick={handleDownload} disabled={generating} style={{ padding: '10px 20px', background: 'var(--cyan)', color: 'var(--bg)', border: 'none', borderRadius: 8, fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, cursor: generating ? 'wait' : 'pointer' }}>
            {generating ? 'Generando...' : '⬇️ Descargar PDF'}
          </button>
        </div>
      </div>

      {/* Estado */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>Estado de la cotización</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {Object.entries(STATUS_LABELS).map(([key, val]: any) => (
            <button key={key} onClick={() => handleStatusChange(key)} disabled={saving} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              border: `1px solid ${status === key ? val.color : 'var(--border)'}`,
              background: status === key ? val.bg : 'transparent',
              color: status === key ? val.color : 'var(--muted)',
              cursor: 'pointer',
            }}>
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Detalle */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Cliente</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{quote.clientName}</p>
            {quote.clientEmail && <p style={{ fontSize: 13, color: 'var(--muted)' }}>{quote.clientEmail}</p>}
            {quote.clientPhone && <p style={{ fontSize: 13, color: 'var(--muted)' }}>{quote.clientPhone}</p>}
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Válida por</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{quote.validDays} días</p>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Descripción', 'Cant.', 'Precio unit.', 'Total'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px', fontSize: 14, color: 'var(--text)' }}>
                  <p style={{ fontWeight: 500, marginBottom: 2 }}>{item.description}</p>
                  {item.detail && <p style={{ fontSize: 12, color: 'var(--muted)' }}>{item.detail}</p>}
                </td>
                <td style={{ padding: '12px', fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>{item.qty}</td>
                <td style={{ padding: '12px', fontSize: 13, color: 'var(--muted)' }}>
                  ${Number(item.unitPrice).toLocaleString('es-CL')}
                </td>
                <td style={{ padding: '12px', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                  ${Number(item.subtotal).toLocaleString('es-CL')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Total</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--cyan)' }}>
              ${total.toLocaleString('es-CL')} {quote.currency}
            </p>
          </div>
        </div>

        {quote.notes && (
          <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg2)', borderRadius: 8 }}>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Notas</p>
            <p style={{ fontSize: 13, color: 'var(--text)' }}>{quote.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}