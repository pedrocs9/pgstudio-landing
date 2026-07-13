'use client'

import { useState } from 'react'

const PRODUCTS = [
  { value: 'vexor', label: 'Vexor — Sistema de ventas' },
  { value: 'slotly', label: 'Slotly — Agendamiento' },
  { value: 'shoppio', label: 'Shoppio — Tienda online' },
  { value: 'custom', label: 'Proyecto a medida' },
  { value: 'other', label: 'Otro / No sé aún' },
]

export default function Cta() {
  const [form, setForm] = useState({ name: '', email: '', product: '', message: '' })
  const [sent, setSent] = useState(false)
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

  return (
    <section id="contacto" className="section-space" style={{ background: 'var(--bg2)' }}>
      <div className="section-shell">
        <div className="cta-panel">
          <div aria-hidden className="cta-glow" />

          <div className="cta-content">
            <p className="section-eyebrow">Siguiente paso</p>
            <h2 className="section-title">
              Cuéntanos qué quieres ordenar, vender o construir
            </h2>
            <p className="cta-copy">
              Te responderemos con una primera orientación comercial: qué solución
              calza mejor, qué información falta y cómo podríamos avanzar. Sin
              compromiso y sin spam.
            </p>

            <div className="cta-trust">
              <span>Respuesta en menos de 24 horas</span>
              <span>Revisión inicial sin costo</span>
              <span>Soporte local en Chile</span>
            </div>

            {sent ? (
              <div className="success-message">
                Perfecto, recibimos tu mensaje. Te contactamos pronto.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-row">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-surface"
                  />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-surface"
                  />
                </div>
                <select
                  value={form.product}
                  onChange={(e) => setForm({ ...form, product: e.target.value })}
                  className="input-surface"
                  style={{ color: form.product ? 'var(--text)' : 'var(--muted)' }}
                >
                  <option value="">¿Qué producto te interesa?</option>
                  {PRODUCTS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Cuéntanos brevemente qué necesitas resolver (opcional)"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="input-surface"
                  style={{ resize: 'vertical' }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ border: 'none', cursor: loading ? 'wait' : 'pointer', width: '100%' }}
                >
                  {loading ? 'Enviando...' : 'Hablar sobre mi proyecto →'}
                </button>
                <p className="form-note">
                  No necesitas tener una especificación lista. Basta con contarnos
                  el problema o el producto que te interesa.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .cta-panel {
          background: linear-gradient(180deg, #ffffff, rgba(248,250,252,0.92));
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          padding: 76px 40px;
          position: relative;
          text-align: center;
        }
        .cta-glow {
          background: radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 70%);
          border-radius: 50%;
          bottom: -110px;
          height: 460px;
          left: 50%;
          pointer-events: none;
          position: absolute;
          transform: translateX(-50%);
          width: 460px;
        }
        .cta-content {
          margin: 0 auto;
          max-width: 720px;
          position: relative;
          z-index: 1;
        }
        .cta-copy {
          color: var(--muted);
          font-size: 17px;
          line-height: 1.75;
          margin: 0 auto 24px;
          max-width: 560px;
        }
        .cta-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin: 0 auto 34px;
          max-width: 650px;
        }
        .cta-trust span {
          background: rgba(255,255,255,.72);
          border: 1px solid var(--border);
          border-radius: 999px;
          color: var(--muted-strong);
          font-size: 12px;
          font-weight: 700;
          padding: 8px 11px;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 13px;
          margin: 0 auto;
          max-width: 500px;
          text-align: left;
        }
        .contact-row {
          display: grid;
          gap: 13px;
          grid-template-columns: 1fr 1fr;
        }
        .success-message {
          background: rgba(5,150,105,0.08);
          border: 1px solid rgba(5,150,105,0.22);
          border-radius: 16px;
          color: var(--success);
          font-size: 16px;
          font-weight: 700;
          margin: 0 auto;
          max-width: 480px;
          padding: 20px;
        }
        .form-note {
          color: var(--muted);
          font-size: 12px;
          line-height: 1.5;
          text-align: center;
        }
        @media (max-width: 640px) {
          .cta-panel { padding: 52px 22px; }
          .contact-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 420px) {
          .cta-panel {
            border-radius: 22px;
            padding: 44px 18px;
          }
        }
      `}</style>
    </section>
  )
}
