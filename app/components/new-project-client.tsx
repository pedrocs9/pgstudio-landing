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

export default function NewProjectClient() {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', clientName: '', type: 'landing', status: 'development',
    url: '', repoUrl: '', deployUrl: '',
    monthlyFee: '', oneTimeFee: '', notes: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/projects', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) router.push('/admin/proyectos')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Datos del proyecto */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
          Datos del proyecto
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Nombre del proyecto *</label>
              <input required style={inputStyle} value={form.name}
                placeholder="Ej: Landing Restaurante El Rincón"
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Nombre del cliente *</label>
              <input required style={inputStyle} value={form.clientName}
                placeholder="Ej: Restaurante El Rincón"
                onChange={e => setForm({ ...form, clientName: e.target.value })} />
            </div>
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
        </div>
      </div>

      {/* Links */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
          Links
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>URL del sitio</label>
            <input style={inputStyle} value={form.url}
              placeholder="https://cliente.cl"
              onChange={e => setForm({ ...form, url: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>URL del repo (GitHub)</label>
              <input style={inputStyle} value={form.repoUrl}
                placeholder="https://github.com/..."
                onChange={e => setForm({ ...form, repoUrl: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>URL del deploy (Vercel)</label>
              <input style={inputStyle} value={form.deployUrl}
                placeholder="https://vercel.com/..."
                onChange={e => setForm({ ...form, deployUrl: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* Financiero */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
          Financiero
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Fee desarrollo (pago único CLP)</label>
            <input type="number" style={inputStyle} value={form.oneTimeFee}
              placeholder="0"
              onChange={e => setForm({ ...form, oneTimeFee: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Fee mantención mensual (CLP)</label>
            <input type="number" style={inputStyle} value={form.monthlyFee}
              placeholder="0"
              onChange={e => setForm({ ...form, monthlyFee: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Notas */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
          Notas internas
        </h2>
        <textarea
          value={form.notes} rows={3}
          placeholder="Observaciones, acuerdos, detalles del proyecto..."
          onChange={e => setForm({ ...form, notes: e.target.value })}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Botones */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" onClick={() => router.push('/admin/proyectos')} style={{
          flex: 1, padding: '12px', background: 'transparent',
          border: '1px solid var(--border)', borderRadius: 10,
          color: 'var(--muted)', fontSize: 14, cursor: 'pointer',
        }}>
          Cancelar
        </button>
        <button type="submit" disabled={loading} style={{
          flex: 2, padding: '12px', background: 'var(--cyan)',
          color: 'var(--bg)', border: 'none', borderRadius: 10,
          fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
          cursor: loading ? 'wait' : 'pointer',
        }}>
          {loading ? 'Guardando...' : 'Crear proyecto →'}
        </button>
      </div>
    </form>
  )
}