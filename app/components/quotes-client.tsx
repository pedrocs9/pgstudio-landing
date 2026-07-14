'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  QUOTE_STATUSES,
  type QuoteComputedStatus,
  type QuoteRecord,
  formatQuoteMoney,
  getQuoteComputedStatus,
  getQuoteDueDate,
  getQuoteStatusMeta,
  isOpenQuote,
} from '../lib/quote-pipeline'

type Props = {
  quotes: QuoteRecord[]
}

export default function QuotesClient({ quotes }: Props) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | QuoteComputedStatus>('all')
  const [client, setClient] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const clients = useMemo(() => Array.from(new Set(quotes.map(q => q.clientName))).sort(), [quotes])

  const summary = useMemo(() => {
    const active = quotes.filter(isOpenQuote)
    return {
      draft: quotes.filter(q => getQuoteComputedStatus(q) === 'draft').length,
      sent: quotes.filter(q => getQuoteComputedStatus(q) === 'sent').length,
      accepted: quotes.filter(q => getQuoteComputedStatus(q) === 'accepted').length,
      expired: quotes.filter(q => getQuoteComputedStatus(q) === 'expired').length,
      potential: active.reduce((sum, q) => sum + Number(q.total || 0), 0),
      acceptedTotal: quotes
        .filter(q => getQuoteComputedStatus(q) === 'accepted')
        .reduce((sum, q) => sum + Number(q.total || 0), 0),
    }
  }, [quotes])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const now = new Date()

    return quotes.filter(quote => {
      const computed = getQuoteComputedStatus(quote)
      const matchesStatus = status === 'all' || computed === status
      const matchesClient = client === 'all' || quote.clientName === client
      const searchable = [quote.number, quote.clientName, quote.clientEmail, quote.notes].filter(Boolean).join(' ').toLowerCase()
      const matchesSearch = query.length === 0 || searchable.includes(query)
      const createdAt = quote.createdAt ? new Date(quote.createdAt) : null
      const matchesDate = dateFilter === 'all'
        || (dateFilter === '30' && createdAt && daysBetween(createdAt, now) <= 30)
        || (dateFilter === '90' && createdAt && daysBetween(createdAt, now) <= 90)

      return matchesStatus && matchesClient && matchesSearch && matchesDate
    })
  }, [client, dateFilter, quotes, search, status])

  function clearFilters() {
    setSearch('')
    setStatus('all')
    setClient('all')
    setDateFilter('all')
  }

  const hasFilters = search.trim() || status !== 'all' || client !== 'all' || dateFilter !== 'all'

  return (
    <div className="quote-crm">
      <section className="quote-summary-strip" aria-label="Resumen de cotizaciones">
        <SummaryItem label="Borradores" value={summary.draft} />
        <SummaryItem label="Enviadas" value={summary.sent} />
        <SummaryItem label="Aceptadas" value={summary.accepted} />
        <SummaryItem label="Vencidas" value={summary.expired} />
        <SummaryItem label="Potencial activo" value={formatQuoteMoney(summary.potential)} />
        <SummaryItem label="Aceptado" value={formatQuoteMoney(summary.acceptedTotal)} />
      </section>

      <section className="admin-card quote-workbar" aria-label="Filtros de cotizaciones">
        <div>
          <label htmlFor="quote-search">Buscar</label>
          <input
            id="quote-search"
            className="input-surface"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Numero, cliente, email o notas"
          />
        </div>
        <div>
          <label htmlFor="quote-status">Estado</label>
          <select id="quote-status" className="input-surface" value={status} onChange={event => setStatus(event.target.value as 'all' | QuoteComputedStatus)}>
            <option value="all">Todos</option>
            {[...QUOTE_STATUSES, 'expired' as const].map(item => (
              <option key={item} value={item}>{getQuoteStatusMeta(item).label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quote-client">Cliente</label>
          <select id="quote-client" className="input-surface" value={client} onChange={event => setClient(event.target.value)}>
            <option value="all">Todos</option>
            {clients.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="quote-date">Fecha</label>
          <select id="quote-date" className="input-surface" value={dateFilter} onChange={event => setDateFilter(event.target.value)}>
            <option value="all">Todas</option>
            <option value="30">Ultimos 30 dias</option>
            <option value="90">Ultimos 90 dias</option>
          </select>
        </div>
        <div className="quote-result-count">
          <strong>{filtered.length}</strong>
          <span>de {quotes.length}</span>
          <button type="button" onClick={clearFilters} disabled={!hasFilters}>Limpiar</button>
        </div>
      </section>

      <section className="admin-card quote-list-card">
        {quotes.length === 0 ? (
          <div className="quote-empty">
            <strong>No hay cotizaciones todavia.</strong>
            <span>Crea la primera propuesta comercial para comenzar el flujo desde lead a proyecto.</span>
            <Link href="/admin/cotizaciones/nueva">Nueva cotizacion</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="quote-empty">
            <strong>No hay resultados con esos filtros.</strong>
            <button type="button" onClick={clearFilters}>Limpiar filtros</button>
          </div>
        ) : (
          <>
            <div className="quote-table-wrap">
              <table className="quote-table">
                <thead>
                  <tr>
                    <th>Numero</th>
                    <th>Cliente</th>
                    <th>Propuesta</th>
                    <th>Estado</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Validez</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(quote => (
                    <QuoteRow key={quote.id} quote={quote} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="quote-mobile-list">
              {filtered.map(quote => (
                <QuoteMobileCard key={quote.id} quote={quote} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function QuoteRow({ quote }: { quote: QuoteRecord }) {
  return (
    <tr>
      <td><Link href={`/admin/cotizaciones/${quote.id}`}>{quote.number}</Link></td>
      <td>
        <strong>{quote.clientName}</strong>
        <span>{quote.clientEmail || 'Sin email'}</span>
      </td>
      <td><span>{quote.notes || 'Cotizacion comercial PG Studio'}</span></td>
      <td><QuoteStatusBadge quote={quote} /></td>
      <td><strong>{formatQuoteMoney(quote.total, quote.currency)}</strong></td>
      <td>{formatDate(quote.createdAt)}</td>
      <td>{formatValidity(quote)}</td>
      <td><Link className="quote-row-action" href={`/admin/cotizaciones/${quote.id}`}>Ver</Link></td>
    </tr>
  )
}

function QuoteMobileCard({ quote }: { quote: QuoteRecord }) {
  return (
    <article className="quote-mobile-card">
      <div>
        <strong>{quote.number}</strong>
        <QuoteStatusBadge quote={quote} />
      </div>
      <span>{quote.clientName}</span>
      <small>{quote.notes || 'Cotizacion comercial PG Studio'}</small>
      <b>{formatQuoteMoney(quote.total, quote.currency)}</b>
      <small>{formatDate(quote.createdAt)} · {formatValidity(quote)}</small>
      <Link href={`/admin/cotizaciones/${quote.id}`}>Ver detalle</Link>
    </article>
  )
}

export function QuoteStatusBadge({ quote }: { quote: QuoteRecord }) {
  const status = getQuoteComputedStatus(quote)
  const meta = getQuoteStatusMeta(status)

  return <span className={`quote-status-badge ${meta.tone}`}>{meta.label}</span>
}

function SummaryItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function formatDate(value: QuoteRecord['createdAt']) {
  if (!value) return 'Sin fecha'
  return new Date(value).toLocaleDateString('es-CL')
}

function formatValidity(quote: QuoteRecord) {
  const status = getQuoteComputedStatus(quote)
  if (status === 'accepted' || status === 'rejected' || status === 'cancelled') {
    return getQuoteStatusMeta(status).label
  }

  const due = getQuoteDueDate(quote)
  if (!due) return 'Sin validez'

  const days = Math.ceil((due.getTime() - Date.now()) / 86400000)
  if (days < 0) return 'Vencida'
  if (days <= 5) return `Vence en ${days} dias`
  return `Hasta ${due.toLocaleDateString('es-CL')}`
}

function daysBetween(start: Date, end: Date) {
  return Math.abs(end.getTime() - start.getTime()) / 86400000
}
