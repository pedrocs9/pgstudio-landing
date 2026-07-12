'use client'

import { useState } from 'react'

const PRODUCTS = [
  { value: 'vexor',   label: 'Vexor — Sistema de ventas' },
  { value: 'slotly',  label: 'Slotly — Agendamiento' },
  { value: 'shoppio', label: 'Shoppio — Tienda online' },
  { value: 'custom',  label: 'Proyecto a medida' },
  { value: 'other',   label: 'Otro / No sé aún' },
]

export default function Cta() {
  const [form, setForm]     = useState({ name: '', email: '', product: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email) return
    setLoading(true)

    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)
    setSent(true)
    setForm({ name: '', email: '', product: '', message: '' })
    setTimeout(() => setSent(false), 5000)
  }

  const inputStyle = {
    padding: '12px 16px',
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: 14, outline: 'none', width: '100%',
  }

  return (
    <section id="contacto" style={{ padding: '100px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20, padding: '72px 40px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div aria-hidden style={{
            position: 'absolute', bottom: -80, left: '50%',
            transform: 'translateX(-50%)',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              fontSize: 12, fontWeight: 600, letterSpacing: '.12em',
              color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 14,
            }}>
              Empieza hoy
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700, letterSpacing: '-1px',
              color: 'var(--text)', marginBottom: 16,
            }}>
              ¿Listo para hacer crecer tu negocio?
            </h2>
            <p style={{
              fontSize: 17, color: 'var(--muted)',
              maxWidth: 460, margin: '0 auto 40px', lineHeight: 1.65,
            }}>
              Cuéntanos sobre tu negocio y te contactamos en menos de 24 horas.
            </p>

            {sent ? (
              <div style={{
                padding: '20px', borderRadius: 12,
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid var(--success)',
                color: 'var(--success)', fontSize: 16, fontWeight: 600,
                maxWidth: 440, margin: '0 auto',
              }}>
                ✓ Perfecto, te contactamos pronto.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{
                display: 'flex', flexDirection: 'column',
                gap: 12, maxWidth: 480, margin: '0 auto',
                textAlign: 'left',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input
                    type="text" placeholder="Tu nombre"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                  />
                  <input
                    type="email" placeholder="tu@email.com" required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <select
                  value={form.product}
                  onChange={e => setForm({ ...form, product: e.target.value })}
                  style={{ ...inputStyle, color: form.product ? 'var(--text)' : 'var(--muted)' }}
                >
                  <option value="">¿Qué producto te interesa?</option>
                  {PRODUCTS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Cuéntanos sobre tu negocio (opcional)"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
                <button
                  type="submit" disabled={loading}
                  style={{
                    padding: '14px',
                    background: 'var(--cyan)', color: 'var(--bg)',
                    fontFamily: 'var(--font-display)',
                    fontSize: 15, fontWeight: 600,
                    border: 'none', borderRadius: 10,
                    cursor: loading ? 'wait' : 'pointer',
                  }}
                >
                  {loading ? 'Enviando...' : 'Quiero una demo →'}
                </button>
                <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
                  Sin spam. Te respondemos en menos de 24 horas.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}