'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { calculateQuoteTotal, formatQuoteMoney } from '../lib/quote-pipeline'
import { getLeadProductLabel, type LeadRecord } from '../lib/lead-pipeline'

type Item = {
  description: string
  detail: string
  qty: number
  unitPrice: number
}

type Props = {
  leads: LeadRecord[]
  initialLeadId?: number | null
}

const TEMPLATES = [
  {
    label: 'Landing comercial',
    items: [
      { description: 'Diseno y desarrollo landing page', detail: 'Estructura, frontend responsive y deploy inicial.', qty: 1, unitPrice: 200000 },
      { description: 'Mantencion mensual', detail: 'Soporte, ajustes menores y monitoreo base.', qty: 1, unitPrice: 20000 },
    ],
  },
  {
    label: 'Vexor base',
    items: [
      { description: 'Implementacion Vexor', detail: 'Configuracion inicial, POS, inventario y capacitacion.', qty: 1, unitPrice: 13000 },
    ],
  },
  {
    label: 'Software a medida',
    items: [
      { description: 'Discovery y diseno funcional', detail: 'Levantamiento, flujo principal y alcance de primera version.', qty: 1, unitPrice: 150000 },
      { description: 'Desarrollo de plataforma', detail: 'Implementacion, pruebas y salida a produccion.', qty: 1, unitPrice: 500000 },
    ],
  },
]

export default function NewQuoteClient({ leads, initialLeadId = null }: Props) {
  const router = useRouter()
  const initialLead = leads.find(lead => lead.id === initialLeadId) ?? null
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    leadId: initialLead?.id ? String(initialLead.id) : '',
    clientName: initialLead?.name ?? '',
    clientEmail: initialLead?.email ?? '',
    clientPhone: '',
    validDays: '15',
    currency: 'CLP',
    notes: initialLead ? `Interes: ${getLeadProductLabel(initialLead.product)}. ${initialLead.message ?? ''}` : '',
  })
  const [items, setItems] = useState<Item[]>([
    { description: '', detail: '', qty: 1, unitPrice: 0 },
  ])

  const total = useMemo(() => calculateQuoteTotal(items), [items])

  function selectLead(leadId: string) {
    const lead = leads.find(item => String(item.id) === leadId)
    setForm(current => ({
      ...current,
      leadId,
      clientName: lead?.name ?? current.clientName,
      clientEmail: lead?.email ?? current.clientEmail,
      notes: lead ? `Interes: ${getLeadProductLabel(lead.product)}. ${lead.message ?? ''}` : current.notes,
    }))
  }

  function updateItem(index: number, patch: Partial<Item>) {
    setItems(current => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, ...patch } : item
    )))
  }

  function removeItem(index: number) {
    setItems(current => current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!form.clientName.trim()) {
      setError('El nombre del cliente es obligatorio.')
      return
    }

    if (items.some(item => !item.description.trim() || item.qty <= 0 || item.unitPrice < 0)) {
      setError('Revisa los items: descripcion, cantidad y precio deben ser validos.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, leadId: form.leadId || null, items }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo crear la cotizacion.')
      router.push(`/admin/cotizaciones/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cotizacion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      {error && <p className="quote-form-error" role="alert">{error}</p>}

      <section className="admin-card quote-form-section">
        <header>
          <p>Cliente</p>
          <h2>Datos comerciales</h2>
        </header>
        <div className="quote-form-grid">
          <label>
            <span>Lead relacionado</span>
            <select className="input-surface" value={form.leadId} onChange={event => selectLead(event.target.value)}>
              <option value="">Sin lead relacionado</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>{lead.name || lead.email} · {getLeadProductLabel(lead.product)}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Nombre del cliente *</span>
            <input className="input-surface" required value={form.clientName} onChange={event => setForm({ ...form, clientName: event.target.value })} />
          </label>
          <label>
            <span>Email</span>
            <input className="input-surface" type="email" value={form.clientEmail} onChange={event => setForm({ ...form, clientEmail: event.target.value })} />
          </label>
          <label>
            <span>Telefono</span>
            <input className="input-surface" value={form.clientPhone} onChange={event => setForm({ ...form, clientPhone: event.target.value })} />
          </label>
        </div>
      </section>

      <section className="admin-card quote-form-section">
        <header>
          <p>Propuesta</p>
          <h2>Alcance y condiciones</h2>
        </header>
        <div className="quote-form-grid">
          <label>
            <span>Moneda</span>
            <input className="input-surface" value="CLP" readOnly />
          </label>
          <label>
            <span>Validez en dias</span>
            <input className="input-surface" type="number" min="1" max="365" value={form.validDays} onChange={event => setForm({ ...form, validDays: event.target.value })} />
          </label>
          <label className="quote-form-wide">
            <span>Notas y condiciones visibles en PDF</span>
            <textarea className="input-surface" rows={4} value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} />
          </label>
        </div>
      </section>

      <section className="admin-card quote-form-section">
        <header className="quote-form-toolbar">
          <div>
            <p>Items economicos</p>
            <h2>Servicios cotizados</h2>
          </div>
          <button type="button" onClick={() => setItems(current => [...current, { description: '', detail: '', qty: 1, unitPrice: 0 }])}>Agregar item</button>
        </header>

        <div className="quote-template-row">
          {TEMPLATES.map(template => (
            <button key={template.label} type="button" onClick={() => setItems(template.items)}>
              {template.label}
            </button>
          ))}
        </div>

        <div className="quote-items-editor">
          {items.map((item, index) => (
            <article key={index} className="quote-item-row">
              <label>
                <span>Descripcion *</span>
                <input className="input-surface" value={item.description} onChange={event => updateItem(index, { description: event.target.value })} />
              </label>
              <label>
                <span>Cantidad</span>
                <input className="input-surface" type="number" min="1" value={item.qty} onChange={event => updateItem(index, { qty: Number(event.target.value) })} />
              </label>
              <label>
                <span>Valor unitario</span>
                <input className="input-surface" type="number" min="0" value={item.unitPrice} onChange={event => updateItem(index, { unitPrice: Number(event.target.value) })} />
              </label>
              <div>
                <span>Subtotal</span>
                <strong>{formatQuoteMoney(Math.max(1, item.qty) * Math.max(0, item.unitPrice), form.currency)}</strong>
              </div>
              <button type="button" onClick={() => removeItem(index)} disabled={items.length === 1}>Eliminar</button>
              <label className="quote-item-detail">
                <span>Detalle opcional</span>
                <input className="input-surface" value={item.detail} onChange={event => updateItem(index, { detail: event.target.value })} />
              </label>
            </article>
          ))}
        </div>

        <div className="quote-total-panel">
          <span>Total</span>
          <strong>{formatQuoteMoney(total, form.currency)}</strong>
        </div>
      </section>

      <div className="quote-form-actions">
        <button type="button" onClick={() => router.push('/admin/cotizaciones')}>Cancelar</button>
        <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Crear cotizacion'}</button>
      </div>
    </form>
  )
}
