/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'

const STATUS_LABELS: any = {
  new:       { label: 'Nuevo',      color: 'var(--warning)',  bg: 'rgba(245,158,11,0.1)' },
  contacted: { label: 'Contactado', color: 'var(--cyan)',     bg: 'rgba(14,165,233,0.1)' },
  converted: { label: 'Convertido', color: 'var(--success)',  bg: 'rgba(16,185,129,0.1)' },
  discarded: { label: 'Descartado', color: 'var(--muted)',    bg: 'var(--surface)' },
}

const PRODUCT_LABELS: any = {
  vexor:   'Vexor',
  slotly:  'Slotly',
  shoppio: 'Shoppio',
  custom:  'A medida',
  other:   'Otro',
}

export default function LeadsClient({ leads }: { leads: any[] }) {
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')
  const [editLead, setEditLead]   = useState<any>(null)
  const [note, setNote]           = useState('')
  const [saving, setSaving]       = useState(false)

  const filtered = leads.filter(l => {
    const matchFilter = filter === 'all' || l.status === filter
    const matchSearch = search
      ? l.email.toLowerCase().includes(search.toLowerCase()) ||
        (l.name && l.name.toLowerCase().includes(search.toLowerCase()))
      : true
    return matchFilter && matchSearch
  })

  async function updateLead(id: number, status: string, noteText: string) {
    setSaving(true)
    await fetch(`/api/leads/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status, note: noteText }),
    })
    setSaving(false)
    setEditLead(null)
    window.location.reload()
  }

  const inputStyle: any = {
    padding: '8px 12px', background: 'var(--bg2)',
    border: '1px solid var(--border)', borderRadius: 8,
    color: 'var(--text)', fontSize: 13, outline: 'none', width: '100%',
  }

  return (
    <div>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 14, overflow: 'hidden',
      }}>
        {/* Toolbar */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15, fontWeight: 600, color: 'var(--text)',
          }}>
            Leads
          </h2>
          <input
            type="text" placeholder="Buscar por email o nombre..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, maxWidth: 260 }}
          />
          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
            {['all', 'new', 'contacted', 'converted', 'discarded'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 12,
                border: '1px solid var(--border)', cursor: 'pointer',
                background: filter === f ? 'var(--cyan)' : 'transparent',
                color:      filter === f ? 'var(--bg)'  : 'var(--muted)',
              }}>
                {f === 'all' ? 'Todos' :
                 f === 'new' ? 'Nuevos' :
                 f === 'contacted' ? 'Contactados' :
                 f === 'converted' ? 'Convertidos' : 'Descartados'}
              </button>
            ))}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Nombre', 'Email', 'Producto', 'Mensaje', 'Estado', 'Fecha', 'Acciones'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: 11, fontWeight: 600,
                  color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                No hay leads en este filtro.
              </td></tr>
            ) : filtered.map((l, i) => (
              <tr key={l.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background .15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(14,165,233,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>
                  {l.name ?? '—'}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--muted)' }}>
                  <a href={`mailto:${l.email}`} style={{ color: 'var(--cyan)', textDecoration: 'none' }}>
                    {l.email}
                  </a>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--muted)' }}>
                  {PRODUCT_LABELS[l.product] ?? l.product ?? '—'}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--muted)', maxWidth: 200 }}>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {l.message ?? '—'}
                  </span>
                  {l.note && (
                    <span style={{ fontSize: 11, color: 'var(--cyan)', display: 'block', marginTop: 2 }}>
                      📝 {l.note}
                    </span>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 100,
                    background: STATUS_LABELS[l.status]?.bg,
                    color:      STATUS_LABELS[l.status]?.color,
                    fontWeight: 500,
                  }}>
                    {STATUS_LABELS[l.status]?.label ?? l.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                  {new Date(l.createdAt).toLocaleDateString('es-CL', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => { setEditLead(l); setNote(l.note ?? '') }}
                    style={{ fontSize: 11, padding: '4px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Gestionar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal gestionar lead */}
      {editLead && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px', width: '100%', maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
                Gestionar lead
              </h2>
              <button onClick={() => setEditLead(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
            </div>

            <div style={{ background: 'var(--bg2)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
                {editLead.name ?? 'Sin nombre'}
              </p>
              <p style={{ fontSize: 13, color: 'var(--cyan)' }}>{editLead.email}</p>
              {editLead.product && (
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                  Interés: {PRODUCT_LABELS[editLead.product] ?? editLead.product}
                </p>
              )}
              {editLead.message && (
                <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontStyle: 'italic' }}>
                  &ldquo;{editLead.message}&rdquo;
                </p>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>Cambiar estado</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {Object.entries(STATUS_LABELS).map(([key, val]: any) => (
                  <button key={key}
                    onClick={() => updateLead(editLead.id, key, note)}
                    disabled={saving}
                    style={{
                      padding: '10px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                      border: `1px solid ${editLead.status === key ? val.color : 'var(--border)'}`,
                      background: editLead.status === key ? val.bg : 'transparent',
                      color: editLead.status === key ? val.color : 'var(--muted)',
                      cursor: 'pointer',
                    }}>
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Nota interna</p>
              <textarea
                value={note} onChange={e => setNote(e.target.value)}
                placeholder="Ej: Llamé el lunes, quedó en revisar..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setEditLead(null)} style={{
                flex: 1, padding: '10px', background: 'transparent',
                border: '1px solid var(--border)', borderRadius: 8,
                color: 'var(--muted)', fontSize: 13, cursor: 'pointer',
              }}>
                Cancelar
              </button>
              <button onClick={() => updateLead(editLead.id, editLead.status, note)} disabled={saving}
                style={{
                  flex: 1, padding: '10px', background: 'var(--cyan)',
                  color: 'var(--bg)', border: 'none', borderRadius: 8,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                {saving ? 'Guardando...' : 'Guardar nota'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}