/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputStyle: any = {
  padding: '10px 14px', background: 'var(--bg)',
  border: '1px solid var(--border)', borderRadius: 8,
  color: 'var(--text)', fontSize: 14, outline: 'none', width: '100%',
}

const labelStyle: any = {
  fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6,
}

const STATUS_LABELS: any = {
  development: { label: 'En desarrollo', color: 'var(--warning)' },
  active:      { label: 'Activo',        color: 'var(--success)' },
  paused:      { label: 'Pausado',       color: 'var(--muted)' },
  finished:    { label: 'Terminado',     color: 'var(--muted)' },
}

const TYPE_LABELS: any = {
  landing:   'Landing page',
  ecommerce: 'E-commerce',
  system:    'Sistema a medida',
  saas:      'SaaS',
  other:     'Otro',
}

export default function ProjectDetailClient({ project, payments }: {
  project:  any
  payments: any[]
}) {
  const router = useRouter()
  const [form, setForm]           = useState({ ...project, monthlyFee: String(project.monthlyFee), oneTimeFee: String(project.oneTimeFee) })
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [showPayForm, setShowPayForm] = useState(false)
  const [payForm, setPayForm]     = useState({ amount: '', currency: 'CLP', type: 'monthly', note: '' })
  const [payLoading, setPayLoading] = useState(false)
  const [localPayments, setLocalPayments] = useState(payments)

  const totalPaid = localPayments.reduce((s, p) => s + Number(p.amount), 0)

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/admin/projects/${project.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    setPayLoading(true)
    const res  = await fetch(`/api/admin/projects/${project.id}/payments`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payForm),
    })
    const data = await res.json()
    setPayLoading(false)
    setShowPayForm(false)
    setLocalPayments(prev => [data, ...prev])
    setPayForm({ amount: '', currency: 'CLP', type: 'monthly', note: '' })
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return
    await fetch(`/api/admin/projects/${project.id}`, { method: 'DELETE' })
    router.push('/admin/proyectos')
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            {project.name}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            {project.clientName} · {TYPE_LABELS[project.type]}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saved && <span style={{ fontSize: 13, color: 'var(--success)' }}>✓ Guardado</span>}
          <button onClick={handleDelete} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--danger)', borderRadius: 8, color: 'var(--danger)', fontSize: 13, cursor: 'pointer' }}>
            Eliminar
          </button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', background: 'var(--cyan)', color: 'var(--bg)', border: 'none', borderRadius: 8, fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, cursor: saving ? 'wait' : 'pointer' }}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Info y estado */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
            Información
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Tipo</label>
                <select style={inputStyle} value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="landing">Landing page</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="system">Sistema a medida</option>
                  <option value="saas">SaaS</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Estado</label>
                <select style={inputStyle} value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="development">En desarrollo</option>
                  <option value="active">Activo</option>
                  <option value="paused">Pausado</option>
                  <option value="finished">Terminado</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>URL del sitio</label>
              <input style={inputStyle} value={form.url ?? ''}
                onChange={e => setForm({ ...form, url: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Repo</label>
                <input style={inputStyle} value={form.repoUrl ?? ''}
                  onChange={e => setForm({ ...form, repoUrl: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Deploy</label>
                <input style={inputStyle} value={form.deployUrl ?? ''}
                  onChange={e => setForm({ ...form, deployUrl: e.target.value })} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Notas</label>
              <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }}
                value={form.notes ?? ''}
                onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Financiero */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
            Financiero
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Fee desarrollo (CLP)</label>
                <input type="number" style={inputStyle} value={form.oneTimeFee}
                  onChange={e => setForm({ ...form, oneTimeFee: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Mantención mensual (CLP)</label>
                <input type="number" style={inputStyle} value={form.monthlyFee}
                  onChange={e => setForm({ ...form, monthlyFee: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: 'var(--bg2)', borderRadius: 10, padding: '14px 16px' }}>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Total cobrado</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--success)' }}>
                  ${totalPaid.toLocaleString('es-CL')} CLP
                </p>
              </div>
              <div style={{ background: 'var(--bg2)', borderRadius: 10, padding: '14px 16px' }}>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Pagos registrados</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--cyan)' }}>
                  {localPayments.length}
                </p>
              </div>
            </div>

            {/* Links rápidos */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {form.url && <a href={form.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, padding: '6px 12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--cyan)', textDecoration: 'none' }}>🌐 Ver sitio</a>}
              {form.repoUrl && <a href={form.repoUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, padding: '6px 12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted)', textDecoration: 'none' }}>📦 Repo</a>}
              {form.deployUrl && <a href={form.deployUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, padding: '6px 12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted)', textDecoration: 'none' }}>🚀 Deploy</a>}
            </div>
          </div>
        </div>
      </div>

      {/* Historial de pagos */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
            Historial de pagos
          </h2>
          <button onClick={() => setShowPayForm(true)} style={{ padding: '7px 14px', background: 'var(--cyan)', color: 'var(--bg)', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            + Registrar pago
          </button>
        </div>
        {localPayments.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '24px' }}>Sin pagos registrados aún.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {localPayments.map((p: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>
                    ${Number(p.amount).toLocaleString('es-CL')} CLP
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {p.type === 'monthly' ? 'Mantención' : 'Desarrollo'}{p.note && ` · ${p.note}`}
                  </p>
                </div>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {new Date(p.createdAt).toLocaleDateString('es-CL')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal pago */}
      {showPayForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px', width: '100%', maxWidth: 400 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>
              Registrar pago
            </h2>
            <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={labelStyle}>Monto (CLP) *</label>
                <input required type="number" style={inputStyle} value={payForm.amount}
                  onChange={e => setPayForm({ ...payForm, amount: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}>Tipo</label>
                  <select style={inputStyle} value={payForm.type}
                    onChange={e => setPayForm({ ...payForm, type: e.target.value })}>
                    <option value="monthly">Mantención</option>
                    <option value="onetime">Desarrollo</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Moneda</label>
                  <select style={inputStyle} value={payForm.currency}
                    onChange={e => setPayForm({ ...payForm, currency: e.target.value })}>
                    <option value="CLP">CLP</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Nota</label>
                <input style={inputStyle} value={payForm.note}
                  placeholder="Ej: Mantención julio 2026"
                  onChange={e => setPayForm({ ...payForm, note: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setShowPayForm(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--muted)', fontSize: 13, cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={payLoading} style={{ flex: 1, padding: '10px', background: 'var(--cyan)', color: 'var(--bg)', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {payLoading ? 'Guardando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
