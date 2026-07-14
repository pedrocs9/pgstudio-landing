'use client'

import { useMemo, useState } from 'react'
import {
  LEAD_STATUSES,
  type LeadRecord,
  type LeadStatus,
  getLeadProductLabel,
  getLeadStatusMeta,
  normalizeLeadStatus,
} from '../lib/lead-pipeline'

type LeadsClientProps = {
  leads: LeadRecord[]
}

type Feedback = {
  type: 'success' | 'error'
  message: string
} | null

export default function LeadsClient({ leads }: LeadsClientProps) {
  const [items, setItems] = useState<LeadRecord[]>(leads)
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all')
  const [productFilter, setProductFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null)
  const [draftStatus, setDraftStatus] = useState<LeadStatus>('new')
  const [draftNote, setDraftNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const productOptions = useMemo(() => {
    const unique = new Set(items.map(lead => lead.product).filter(Boolean) as string[])
    return Array.from(unique)
  }, [items])

  const summary = useMemo(() => {
    return LEAD_STATUSES.map(status => ({
      status,
      count: items.filter(lead => normalizeLeadStatus(lead.status) === status).length,
      meta: getLeadStatusMeta(status),
    }))
  }, [items])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items.filter(lead => {
      const status = normalizeLeadStatus(lead.status)
      const matchesStatus = statusFilter === 'all' || status === statusFilter
      const matchesProduct = productFilter === 'all' || lead.product === productFilter
      const searchable = [
        lead.name,
        lead.email,
        lead.product,
        lead.message,
        lead.note,
      ].filter(Boolean).join(' ').toLowerCase()
      const matchesSearch = query.length === 0 || searchable.includes(query)

      return matchesStatus && matchesProduct && matchesSearch
    })
  }, [items, productFilter, search, statusFilter])

  function openLead(lead: LeadRecord) {
    setSelectedLead(lead)
    setDraftStatus(normalizeLeadStatus(lead.status))
    setDraftNote(lead.note ?? '')
    setFeedback(null)
  }

  function clearFilters() {
    setStatusFilter('all')
    setProductFilter('all')
    setSearch('')
  }

  async function updateLead(lead: LeadRecord, status: LeadStatus, noteText: string) {
    if (saving) return

    setSaving(true)
    setFeedback(null)

    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: noteText }),
      })

      if (!res.ok) {
        throw new Error('No se pudo guardar el lead.')
      }

      setItems(current => current.map(item => (
        item.id === lead.id ? { ...item, status, note: noteText || null } : item
      )))
      setSelectedLead(current => (
        current && current.id === lead.id ? { ...current, status, note: noteText || null } : current
      ))
      setFeedback({ type: 'success', message: 'Lead actualizado.' })
    } catch {
      setFeedback({ type: 'error', message: 'No se pudo actualizar. Intenta nuevamente.' })
    } finally {
      setSaving(false)
    }
  }

  const hasFilters = statusFilter !== 'all' || productFilter !== 'all' || search.trim().length > 0

  return (
    <div className="lead-crm">
      <section className="lead-summary-grid" aria-label="Resumen de pipeline comercial">
        {summary.map(item => (
          <button
            key={item.status}
            type="button"
            className={`lead-summary-card ${statusFilter === item.status ? 'active' : ''}`}
            onClick={() => setStatusFilter(item.status)}
          >
            <span>{item.meta.label}</span>
            <strong>{item.count}</strong>
            <small>{item.meta.nextAction}</small>
          </button>
        ))}
      </section>

      <section className="admin-card lead-workbar" aria-label="Filtros de leads">
        <div>
          <label htmlFor="lead-search">Buscar</label>
          <input
            id="lead-search"
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Nombre, email, interes o nota"
            className="input-surface"
          />
        </div>
        <div>
          <label htmlFor="lead-status">Estado</label>
          <select
            id="lead-status"
            value={statusFilter}
            onChange={event => setStatusFilter(event.target.value as 'all' | LeadStatus)}
            className="input-surface"
          >
            <option value="all">Todos los estados</option>
            {LEAD_STATUSES.map(status => (
              <option key={status} value={status}>{getLeadStatusMeta(status).label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="lead-product">Interes</label>
          <select
            id="lead-product"
            value={productFilter}
            onChange={event => setProductFilter(event.target.value)}
            className="input-surface"
          >
            <option value="all">Todos los intereses</option>
            {productOptions.map(product => (
              <option key={product} value={product}>{getLeadProductLabel(product)}</option>
            ))}
          </select>
        </div>
        <div className="lead-workbar-meta">
          <strong>{filtered.length}</strong>
          <span>de {items.length} leads</span>
          <button type="button" onClick={clearFilters} disabled={!hasFilters}>
            Limpiar filtros
          </button>
        </div>
      </section>

      {feedback && (
        <p className={`lead-feedback ${feedback.type}`} role="status">
          {feedback.message}
        </p>
      )}

      <section className="admin-card lead-table-card">
        {items.length === 0 ? (
          <div className="lead-empty">
            <strong>Todavia no se han recibido solicitudes.</strong>
            <span>Cuando llegue un contacto desde la landing aparecera aqui.</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="lead-empty">
            <strong>No hay leads que coincidan con los filtros seleccionados.</strong>
            <button type="button" onClick={clearFilters}>Limpiar filtros</button>
          </div>
        ) : (
          <>
            <div className="lead-table-wrap">
              <table className="lead-table">
                <thead>
                  <tr>
                    <th>Prospecto</th>
                    <th>Interes</th>
                    <th>Contacto</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(lead => (
                    <tr key={lead.id}>
                      <td>
                        <strong>{lead.name || 'Sin nombre'}</strong>
                        <span>{lead.message || 'Sin mensaje inicial'}</span>
                      </td>
                      <td>{getLeadProductLabel(lead.product)}</td>
                      <td>
                        <a href={`mailto:${lead.email}`}>{lead.email}</a>
                      </td>
                      <td><LeadStatusBadge status={lead.status} /></td>
                      <td>{formatDate(lead.createdAt)}</td>
                      <td>
                        <button type="button" onClick={() => openLead(lead)}>
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lead-mobile-list">
              {filtered.map(lead => (
                <article key={lead.id} className="lead-mobile-card">
                  <div>
                    <strong>{lead.name || 'Sin nombre'}</strong>
                    <LeadStatusBadge status={lead.status} />
                  </div>
                  <span>{getLeadProductLabel(lead.product)}</span>
                  <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  <small>{formatDate(lead.createdAt)}</small>
                  <button type="button" onClick={() => openLead(lead)}>Ver detalle</button>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          draftStatus={draftStatus}
          draftNote={draftNote}
          saving={saving}
          onClose={() => setSelectedLead(null)}
          onStatusChange={setDraftStatus}
          onNoteChange={setDraftNote}
          onSave={() => updateLead(selectedLead, draftStatus, draftNote)}
          onQuickStatus={(status) => updateLead(selectedLead, status, draftNote)}
        />
      )}
    </div>
  )
}

function LeadStatusBadge({ status }: { status: string }) {
  const normalized = normalizeLeadStatus(status)
  const meta = getLeadStatusMeta(normalized)

  return <span className={`lead-status-badge ${meta.tone}`}>{meta.label}</span>
}

function LeadDetailModal({
  lead,
  draftStatus,
  draftNote,
  saving,
  onClose,
  onStatusChange,
  onNoteChange,
  onSave,
  onQuickStatus,
}: {
  lead: LeadRecord
  draftStatus: LeadStatus
  draftNote: string
  saving: boolean
  onClose: () => void
  onStatusChange: (status: LeadStatus) => void
  onNoteChange: (note: string) => void
  onSave: () => void
  onQuickStatus: (status: LeadStatus) => void
}) {
  return (
    <div className="lead-modal-backdrop" role="presentation">
      <section className="lead-modal" role="dialog" aria-modal="true" aria-labelledby="lead-detail-title">
        <header>
          <div>
            <p>Detalle comercial</p>
            <h3 id="lead-detail-title">{lead.name || 'Lead sin nombre'}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar detalle">Cerrar</button>
        </header>

        <div className="lead-detail-grid">
          <article>
            <span>Identificacion</span>
            <strong>{lead.name || 'Sin nombre'}</strong>
            <small>Origen: formulario publico</small>
            <small>Fecha: {formatDate(lead.createdAt)}</small>
          </article>
          <article>
            <span>Contacto</span>
            <a href={`mailto:${lead.email}`}>{lead.email}</a>
            <small>No hay telefono guardado en el modelo actual.</small>
          </article>
          <article>
            <span>Necesidad</span>
            <strong>{getLeadProductLabel(lead.product)}</strong>
            <p>{lead.message || 'Sin mensaje inicial.'}</p>
          </article>
          <article>
            <span>Proxima accion sugerida</span>
            <strong>{getLeadStatusMeta(draftStatus).nextAction}</strong>
            <small>Se deriva del estado comercial actual.</small>
          </article>
        </div>

        <div className="lead-management-panel">
          <label htmlFor="lead-detail-status">Estado comercial</label>
          <select
            id="lead-detail-status"
            value={draftStatus}
            onChange={event => onStatusChange(event.target.value as LeadStatus)}
            className="input-surface"
          >
            {LEAD_STATUSES.map(status => (
              <option key={status} value={status}>{getLeadStatusMeta(status).label}</option>
            ))}
          </select>

          <div className="lead-status-actions" aria-label="Cambios rapidos de estado">
            {LEAD_STATUSES.map(status => (
              <button
                key={status}
                type="button"
                disabled={saving}
                onClick={() => onQuickStatus(status)}
              >
                {getLeadStatusMeta(status).label}
              </button>
            ))}
          </div>

          <label htmlFor="lead-detail-note">Nota de seguimiento</label>
          <textarea
            id="lead-detail-note"
            value={draftNote}
            onChange={event => onNoteChange(event.target.value)}
            placeholder="Ej: Contactado por WhatsApp, espera propuesta esta semana."
            rows={4}
            className="input-surface"
          />

          <div className="lead-modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="button" onClick={onSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function formatDate(value: LeadRecord['createdAt']) {
  if (!value) return 'Sin fecha'
  return new Date(value).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
