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

type Item = {
  description: string
  detail:      string
  qty:         number
  unitPrice:   number
  subtotal:    number
}

const TEMPLATES = [
  { label: 'Landing básica',    items: [{ description: 'Desarrollo landing page', detail: 'Diseño, desarrollo y deploy. 5 secciones.', qty: 1, unitPrice: 200000, subtotal: 200000 }, { description: 'Mantención mensual', detail: 'Hosting, dominio y soporte.', qty: 1, unitPrice: 20000, subtotal: 20000 }] },
  { label: 'Vexor básico',      items: [{ description: 'Suscripción Vexor - Plan base', detail: 'POS + Inventario + Dashboard', qty: 1, unitPrice: 13000, subtotal: 13000 }] },
  { label: 'Proyecto a medida', items: [{ description: 'Análisis y diseño', detail: 'Levantamiento de requerimientos y wireframes.', qty: 1, unitPrice: 150000, subtotal: 150000 }, { description: 'Desarrollo', detail: 'Implementación completa del sistema.', qty: 1, unitPrice: 500000, subtotal: 500000 }] },
]

export default function NewQuoteClient() {
  const router = useRouter()
  const [loading, setLoading]   = useState(false)
  const [form, setForm]         = useState({
    clientName: '', clientEmail: '', clientPhone: '',
    validDays: '15', currency: 'CLP', notes: '',
  })
  const [items, setItems] = useState<Item[]>([{
    description: '', detail: '', qty: 1, unitPrice: 0, subtotal: 0,
  }])

  const total = items.reduce((s, i) => s + i.subtotal, 0)

  function addItem() {
    setItems([...items, { description: '', detail: '', qty: 1, unitPrice: 0, subtotal: 0 }])
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index))
  }

  function updateItem(index: number, field: string, value: any) {
    const updated = items.map((item, i) => {
      if (i !== index) return item
      const newItem = { ...item, [field]: value }
      if (field === 'qty' || field === 'unitPrice') {
        newItem.subtotal = Number(newItem.qty) * Number(newItem.unitPrice)
      }
      return newItem
    })
    setItems(updated)
  }

  function applyTemplate(templateItems: any[]) {
    setItems(templateItems)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.some(i => !i.description)) return
    setLoading(true)
    const res = await fetch('/api/admin/quotes', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...form, items }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.ok) router.push(`/admin/cotizaciones/${data.id}`)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Templates rápidos */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Templates rápidos</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TEMPLATES.map(t => (
            <button key={t.label} type="button" onClick={() => applyTemplate(t.items)} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 13,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--cyan)', cursor: 'pointer',
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Datos del cliente */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
          Datos del cliente
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Nombre del cliente *</label>
            <input required style={inputStyle} value={form.clientName}
              onChange={e => setForm({ ...form, clientName: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" style={inputStyle} value={form.clientEmail}
              onChange={e => setForm({ ...form, clientEmail: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Teléfono</label>
            <input style={inputStyle} value={form.clientPhone}
              onChange={e => setForm({ ...form, clientPhone: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Moneda</label>
            <select style={inputStyle} value={form.currency}
              onChange={e => setForm({ ...form, currency: e.target.value })}>
              <option value="CLP">CLP</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Válida por (días)</label>
            <input type="number" style={inputStyle} value={form.validDays}
              onChange={e => setForm({ ...form, validDays: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Items */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>
            Servicios
          </h2>
          <button type="button" onClick={addItem} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--cyan)', fontSize: 13, cursor: 'pointer' }}>
            + Agregar item
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, index) => (
            <div key={index} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'flex-end' }}>
                <div>
                  <label style={labelStyle}>Descripción *</label>
                  <input required style={inputStyle} value={item.description}
                    placeholder="Ej: Desarrollo landing page"
                    onChange={e => updateItem(index, 'description', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Cantidad</label>
                  <input type="number" min="1" style={inputStyle} value={item.qty}
                    onChange={e => updateItem(index, 'qty', Number(e.target.value))} />
                </div>
                <div>
                  <label style={labelStyle}>Precio unit.</label>
                  <input type="number" style={inputStyle} value={item.unitPrice}
                    onChange={e => updateItem(index, 'unitPrice', Number(e.target.value))} />
                </div>
                <div>
                  <label style={labelStyle}>Subtotal</label>
                  <div style={{ ...inputStyle, background: 'var(--surface)', color: 'var(--muted)' }}>
                    ${item.subtotal.toLocaleString('es-CL')}
                  </div>
                </div>
                <button type="button" onClick={() => removeItem(index)} style={{ padding: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--danger)', cursor: 'pointer' }}>
                  ✕
                </button>
              </div>
              <div style={{ marginTop: 8 }}>
                <input style={{ ...inputStyle, fontSize: 12 }} value={item.detail}
                  placeholder="Detalle opcional (aparece en el PDF)"
                  onChange={e => updateItem(index, 'detail', e.target.value)} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14, padding: '12px 16px', background: 'var(--bg2)', borderRadius: 10 }}>
          <span style={{ fontSize: 14, color: 'var(--muted)', marginRight: 16 }}>Total</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--cyan)' }}>
            ${total.toLocaleString('es-CL')} {form.currency}
          </span>
        </div>
      </div>

      {/* Notas */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
          Notas (aparecen en el PDF)
        </h2>
        <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.notes}
          placeholder="Condiciones, formas de pago, observaciones..."
          onChange={e => setForm({ ...form, notes: e.target.value })} />
      </div>

      {/* Botones */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" onClick={() => router.push('/admin/cotizaciones')} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--muted)', fontSize: 14, cursor: 'pointer' }}>
          Cancelar
        </button>
        <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', background: 'var(--cyan)', color: 'var(--bg)', border: 'none', borderRadius: 10, fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, cursor: loading ? 'wait' : 'pointer' }}>
          {loading ? 'Guardando...' : 'Crear cotización →'}
        </button>
      </div>
    </form>
  )
}