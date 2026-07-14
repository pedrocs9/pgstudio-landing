export const QUOTE_STATUSES = [
  'draft',
  'prepared',
  'sent',
  'accepted',
  'rejected',
  'cancelled',
] as const

export type QuoteStatus = (typeof QUOTE_STATUSES)[number]
export type QuoteComputedStatus = QuoteStatus | 'expired'

export type QuoteRecord = {
  id: number
  leadId: number | null
  projectId: number | null
  number: string
  clientName: string
  clientEmail: string | null
  clientPhone: string | null
  status: string
  validDays: number | null
  notes: string | null
  total: string | number
  currency: string
  createdAt: Date | string | null
}

export type QuoteItemRecord = {
  id?: number
  quoteId?: number
  description: string
  detail: string | null
  qty: number
  unitPrice: string | number
  subtotal: string | number
}

export const QUOTE_STATUS_META: Record<QuoteComputedStatus, {
  label: string
  nextAction: string
  tone: 'neutral' | 'info' | 'accent' | 'success' | 'danger' | 'warning'
}> = {
  draft: { label: 'Borrador', nextAction: 'Completar propuesta', tone: 'neutral' },
  prepared: { label: 'Preparada', nextAction: 'Enviar al cliente', tone: 'accent' },
  sent: { label: 'Enviada', nextAction: 'Hacer seguimiento', tone: 'info' },
  accepted: { label: 'Aceptada', nextAction: 'Crear proyecto', tone: 'success' },
  rejected: { label: 'Rechazada', nextAction: 'Cerrar oportunidad', tone: 'danger' },
  expired: { label: 'Vencida', nextAction: 'Revisar o renovar', tone: 'warning' },
  cancelled: { label: 'Cancelada', nextAction: 'Sin accion pendiente', tone: 'neutral' },
}

export function normalizeQuoteStatus(status: string | null | undefined): QuoteStatus {
  if (status === 'ready') return 'prepared'
  if (status === 'canceled') return 'cancelled'
  if (QUOTE_STATUSES.includes(status as QuoteStatus)) return status as QuoteStatus
  return 'draft'
}

export function getQuoteDueDate(quote: Pick<QuoteRecord, 'createdAt' | 'validDays'>) {
  if (!quote.createdAt) return null

  const due = new Date(quote.createdAt)
  due.setDate(due.getDate() + Math.max(1, Number(quote.validDays ?? 15)))
  return due
}

export function getQuoteComputedStatus(quote: Pick<QuoteRecord, 'status' | 'createdAt' | 'validDays'>): QuoteComputedStatus {
  const status = normalizeQuoteStatus(quote.status)
  if (status !== 'draft' && status !== 'prepared' && status !== 'sent') return status

  const due = getQuoteDueDate(quote)
  if (due && due.getTime() < startOfToday().getTime()) return 'expired'

  return status
}

export function getQuoteStatusMeta(status: QuoteComputedStatus | string | null | undefined) {
  const computed = status === 'expired' ? 'expired' : normalizeQuoteStatus(status)
  return QUOTE_STATUS_META[computed]
}

export function isAllowedQuoteStatus(status: unknown): status is QuoteStatus {
  return typeof status === 'string' && QUOTE_STATUSES.includes(status as QuoteStatus)
}

export function isOpenQuote(quote: Pick<QuoteRecord, 'status' | 'createdAt' | 'validDays'>) {
  const status = getQuoteComputedStatus(quote)
  return status === 'draft' || status === 'prepared' || status === 'sent' || status === 'expired'
}

export function formatQuoteMoney(value: string | number, currency = 'CLP') {
  void currency
  const amount = Number(value || 0)
  const rounded = Math.round(amount)
  return `$${rounded.toLocaleString('es-CL')} CLP`
}

export function calculateQuoteTotal(items: Array<Pick<QuoteItemRecord, 'qty' | 'unitPrice'>>) {
  return items.reduce((sum, item) => {
    const qty = Number(item.qty)
    const unitPrice = Number(item.unitPrice)
    if (!Number.isFinite(qty) || !Number.isFinite(unitPrice)) return sum
    return sum + Math.max(0, qty) * Math.max(0, unitPrice)
  }, 0)
}

export function quotePdfFileName(number: string) {
  return `cotizacion-${number.replace(/[^a-z0-9-]/gi, '-')}.pdf`
}

function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}
