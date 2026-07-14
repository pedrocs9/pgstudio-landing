'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateQuotePDF } from './quote-pdf'
import {
  QUOTE_STATUSES,
  type QuoteItemRecord,
  type QuoteRecord,
  type QuoteStatus,
  calculateQuoteTotal,
  formatQuoteMoney,
  getQuoteComputedStatus,
  getQuoteDueDate,
  getQuoteStatusMeta,
} from '../lib/quote-pipeline'
import { QuoteStatusBadge } from './quotes-client'

type Props = {
  quote: QuoteRecord
  items: QuoteItemRecord[]
}

type Feedback = {
  type: 'success' | 'error'
  message: string
} | null

export default function QuoteDetailClient({ quote, items }: Props) {
  const router = useRouter()
  const [currentQuote, setCurrentQuote] = useState(quote)
  const [currentItems, setCurrentItems] = useState(items)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [editing, setEditing] = useState(false)
  const [projectOpen, setProjectOpen] = useState(false)

  const total = useMemo(() => calculateQuoteTotal(currentItems), [currentItems])
  const computedStatus = getQuoteComputedStatus(currentQuote)
  const dueDate = getQuoteDueDate(currentQuote)

  async function changeStatus(status: QuoteStatus) {
    if (saving) return
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch(`/api/admin/quotes/${currentQuote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('No se pudo cambiar el estado.')
      setCurrentQuote(current => ({ ...current, status }))
      setFeedback({ type: 'success', message: 'Estado actualizado.' })
      router.refresh()
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Error al actualizar.' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDownload() {
    if (generating) return
    setGenerating(true)
    setFeedback(null)
    try {
      await generateQuotePDF(currentQuote, currentItems)
      if (currentQuote.status === 'prepared') await changeStatus('sent')
      setFeedback({ type: 'success', message: 'PDF generado correctamente.' })
    } catch {
      setFeedback({ type: 'error', message: 'No se pudo generar el PDF. Intenta nuevamente.' })
    } finally {
      setGenerating(false)
    }
  }

  async function duplicateQuote() {
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch(`/api/admin/quotes/${currentQuote.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate' }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo duplicar.')
      router.push(`/admin/cotizaciones/${data.id}`)
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'No se pudo duplicar.' })
    } finally {
      setSaving(false)
    }
  }

  async function cancelQuote() {
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch(`/api/admin/quotes/${currentQuote.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No se pudo cancelar.')
      setCurrentQuote(current => ({ ...current, status: 'cancelled' }))
      setFeedback({ type: 'success', message: 'Cotizacion cancelada.' })
      router.refresh()
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'No se pudo cancelar.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="quote-detail">
      <header className="quote-detail-hero">
        <div>
          <Link href="/admin/cotizaciones">Cotizaciones</Link>
          <h2>{currentQuote.number}</h2>
          <p>{currentQuote.clientName} · {formatDate(currentQuote.createdAt)}</p>
        </div>
        <div>
          <QuoteStatusBadge quote={currentQuote} />
          <strong>{formatQuoteMoney(total, currentQuote.currency)}</strong>
        </div>
      </header>

      {feedback && <p className={`quote-feedback ${feedback.type}`} role="status">{feedback.message}</p>}

      <section className="quote-action-bar admin-card">
        <button type="button" onClick={() => setEditing(true)}>Editar</button>
        <button type="button" onClick={handleDownload} disabled={generating}>{generating ? 'Generando...' : 'Descargar PDF'}</button>
        <button type="button" onClick={duplicateQuote} disabled={saving}>Duplicar</button>
        <button type="button" onClick={() => setProjectOpen(true)} disabled={computedStatus !== 'accepted' || Boolean(currentQuote.projectId)}>
          Crear proyecto
        </button>
        <button type="button" onClick={cancelQuote} disabled={saving || computedStatus === 'accepted' || Boolean(currentQuote.projectId)}>
          Cancelar
        </button>
      </section>

      <section className="admin-card quote-status-panel">
        <div>
          <p className="admin-card-label">Estado comercial</p>
          <h3>{getQuoteStatusMeta(computedStatus).nextAction}</h3>
        </div>
        <div className="quote-status-actions">
          {QUOTE_STATUSES.map(status => (
            <button
              key={status}
              type="button"
              disabled={saving}
              className={currentQuote.status === status ? 'active' : ''}
              onClick={() => changeStatus(status)}
            >
              {getQuoteStatusMeta(status).label}
            </button>
          ))}
        </div>
      </section>

      <section className="quote-detail-grid">
        <article className="admin-card">
          <p className="admin-card-label">Informacion comercial</p>
          <dl className="quote-definition-list">
            <div><dt>Cliente</dt><dd>{currentQuote.clientName}</dd></div>
            <div><dt>Email</dt><dd>{currentQuote.clientEmail || 'Sin email'}</dd></div>
            <div><dt>Telefono</dt><dd>{currentQuote.clientPhone || 'Sin telefono'}</dd></div>
            <div><dt>Lead</dt><dd>{currentQuote.leadId ? `#${currentQuote.leadId}` : 'Sin lead relacionado'}</dd></div>
            <div><dt>Proyecto</dt><dd>{currentQuote.projectId ? `#${currentQuote.projectId}` : 'Sin proyecto relacionado'}</dd></div>
          </dl>
        </article>

        <article className="admin-card">
          <p className="admin-card-label">Validez</p>
          <dl className="quote-definition-list">
            <div><dt>Emitida</dt><dd>{formatDate(currentQuote.createdAt)}</dd></div>
            <div><dt>Dias</dt><dd>{currentQuote.validDays ?? 15}</dd></div>
            <div><dt>Vence</dt><dd>{dueDate ? dueDate.toLocaleDateString('es-CL') : 'Sin fecha'}</dd></div>
            <div><dt>Senal actual</dt><dd>{getQuoteStatusMeta(computedStatus).label}</dd></div>
          </dl>
        </article>
      </section>

      <section className="admin-card quote-breakdown">
        <div className="quote-section-head">
          <div>
            <p className="admin-card-label">Desglose</p>
            <h3>Items cotizados</h3>
          </div>
          <strong>{formatQuoteMoney(total, currentQuote.currency)}</strong>
        </div>
        <div className="quote-breakdown-table">
          {currentItems.map((item, index) => (
            <div key={index}>
              <span>
                <strong>{item.description}</strong>
                {item.detail && <small>{item.detail}</small>}
              </span>
              <span>{item.qty}</span>
              <span>{formatQuoteMoney(item.unitPrice, currentQuote.currency)}</span>
              <b>{formatQuoteMoney(item.subtotal, currentQuote.currency)}</b>
            </div>
          ))}
        </div>
      </section>

      <section className="quote-detail-grid">
        <article className="admin-card">
          <p className="admin-card-label">Condiciones</p>
          <p className="quote-notes">{currentQuote.notes || 'Sin condiciones adicionales.'}</p>
        </article>
        <article className="admin-card">
          <p className="admin-card-label">Timeline minimo</p>
          <ol className="quote-timeline">
            <li><strong>Creada</strong><span>{formatDate(currentQuote.createdAt)}</span></li>
            {currentQuote.status === 'prepared' && <li><strong>Marcada preparada</strong><span>Estado actual</span></li>}
            {currentQuote.status === 'sent' && <li><strong>Enviada</strong><span>Estado actual</span></li>}
            {currentQuote.status === 'accepted' && <li><strong>Aceptada</strong><span>Lista para proyecto</span></li>}
            {currentQuote.projectId && <li><strong>Proyecto creado</strong><span>#{currentQuote.projectId}</span></li>}
          </ol>
        </article>
      </section>

      {editing && (
        <QuoteEditDialog
          quote={currentQuote}
          items={currentItems}
          onClose={() => setEditing(false)}
          onSaved={(nextQuote, nextItems) => {
            setCurrentQuote(nextQuote)
            setCurrentItems(nextItems)
            setEditing(false)
            setFeedback({ type: 'success', message: 'Cotizacion actualizada.' })
            router.refresh()
          }}
        />
      )}

      {projectOpen && (
        <CreateProjectDialog
          quote={currentQuote}
          onClose={() => setProjectOpen(false)}
          onCreated={(projectId) => {
            setCurrentQuote(current => ({ ...current, projectId }))
            setProjectOpen(false)
            setFeedback({ type: 'success', message: 'Proyecto creado desde la cotizacion.' })
            router.refresh()
          }}
        />
      )}
    </div>
  )
}

function QuoteEditDialog({
  quote,
  items,
  onClose,
  onSaved,
}: {
  quote: QuoteRecord
  items: QuoteItemRecord[]
  onClose: () => void
  onSaved: (quote: QuoteRecord, items: QuoteItemRecord[]) => void
}) {
  const [form, setForm] = useState({
    clientName: quote.clientName,
    clientEmail: quote.clientEmail ?? '',
    clientPhone: quote.clientPhone ?? '',
    validDays: String(quote.validDays ?? 15),
    currency: quote.currency,
    notes: quote.notes ?? '',
  })
  const [draftItems, setDraftItems] = useState(items.map(item => ({
    description: item.description,
    detail: item.detail ?? '',
    qty: Number(item.qty),
    unitPrice: Number(item.unitPrice),
    subtotal: Number(item.subtotal),
  })))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function updateItem(index: number, patch: Partial<(typeof draftItems)[number]>) {
    setDraftItems(current => current.map((item, itemIndex) => {
      if (itemIndex !== index) return item
      const next = { ...item, ...patch }
      return { ...next, subtotal: Math.max(1, Number(next.qty)) * Math.max(0, Number(next.unitPrice)) }
    }))
  }

  async function save() {
    setError('')
    if (!form.clientName.trim() || draftItems.some(item => !item.description.trim() || item.qty <= 0 || item.unitPrice < 0)) {
      setError('Revisa cliente e items antes de guardar.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: draftItems }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'No se pudo guardar.')
      const total = calculateQuoteTotal(draftItems)
      onSaved({ ...quote, ...form, total: String(total), validDays: Number(form.validDays) }, draftItems)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="quote-modal-backdrop">
      <section className="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-edit-title">
        <header>
          <h3 id="quote-edit-title">Editar cotizacion</h3>
          <button type="button" onClick={onClose}>Cerrar</button>
        </header>
        {error && <p className="quote-form-error" role="alert">{error}</p>}
        <div className="quote-form-grid">
          <label><span>Cliente</span><input className="input-surface" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} /></label>
          <label><span>Email</span><input className="input-surface" value={form.clientEmail} onChange={e => setForm({ ...form, clientEmail: e.target.value })} /></label>
          <label><span>Telefono</span><input className="input-surface" value={form.clientPhone} onChange={e => setForm({ ...form, clientPhone: e.target.value })} /></label>
          <label><span>Validez</span><input className="input-surface" type="number" value={form.validDays} onChange={e => setForm({ ...form, validDays: e.target.value })} /></label>
          <label className="quote-form-wide"><span>Notas</span><textarea className="input-surface" rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></label>
        </div>
        <div className="quote-items-editor">
          {draftItems.map((item, index) => (
            <article key={index} className="quote-item-row">
              <label><span>Descripcion</span><input className="input-surface" value={item.description} onChange={e => updateItem(index, { description: e.target.value })} /></label>
              <label><span>Cantidad</span><input className="input-surface" type="number" value={item.qty} onChange={e => updateItem(index, { qty: Number(e.target.value) })} /></label>
              <label><span>Valor</span><input className="input-surface" type="number" value={item.unitPrice} onChange={e => updateItem(index, { unitPrice: Number(e.target.value) })} /></label>
              <div><span>Subtotal</span><strong>{formatQuoteMoney(item.subtotal, form.currency)}</strong></div>
              <button type="button" onClick={() => setDraftItems(current => current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index))}>Eliminar</button>
              <label className="quote-item-detail"><span>Detalle</span><input className="input-surface" value={item.detail} onChange={e => updateItem(index, { detail: e.target.value })} /></label>
            </article>
          ))}
        </div>
        <button type="button" onClick={() => setDraftItems(current => [...current, { description: '', detail: '', qty: 1, unitPrice: 0, subtotal: 0 }])}>Agregar item</button>
        <div className="quote-modal-actions">
          <button type="button" onClick={onClose}>Cancelar</button>
          <button type="button" onClick={save} disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
        </div>
      </section>
    </div>
  )
}

function CreateProjectDialog({
  quote,
  onClose,
  onCreated,
}: {
  quote: QuoteRecord
  onClose: () => void
  onCreated: (projectId: number) => void
}) {
  const [name, setName] = useState(`Proyecto ${quote.clientName}`)
  const [type, setType] = useState('custom')
  const [notes, setNotes] = useState(`Proyecto creado desde ${quote.number}.`)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function createProject() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createProject', name, type, notes }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo crear proyecto.')
      onCreated(Number(data.projectId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear proyecto.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="quote-modal-backdrop">
      <section className="quote-modal small" role="dialog" aria-modal="true" aria-labelledby="quote-project-title">
        <header>
          <h3 id="quote-project-title">Crear proyecto</h3>
          <button type="button" onClick={onClose}>Cerrar</button>
        </header>
        {error && <p className="quote-form-error" role="alert">{error}</p>}
        <label><span>Nombre del proyecto</span><input className="input-surface" value={name} onChange={e => setName(e.target.value)} /></label>
        <label><span>Tipo</span><select className="input-surface" value={type} onChange={e => setType(e.target.value)}><option value="custom">A medida</option><option value="landing">Landing</option><option value="vexor">Vexor</option></select></label>
        <label><span>Notas</span><textarea className="input-surface" rows={4} value={notes} onChange={e => setNotes(e.target.value)} /></label>
        <div className="quote-modal-actions">
          <button type="button" onClick={onClose}>Cancelar</button>
          <button type="button" onClick={createProject} disabled={saving}>{saving ? 'Creando...' : 'Crear proyecto'}</button>
        </div>
      </section>
    </div>
  )
}

function formatDate(value: QuoteRecord['createdAt']) {
  if (!value) return 'Sin fecha'
  return new Date(value).toLocaleDateString('es-CL')
}
