export const LEAD_STATUSES = [
  'new',
  'contacted',
  'meeting',
  'quoted',
  'won',
  'discarded',
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

export type LeadRecord = {
  id: number
  email: string
  name: string | null
  product: string | null
  message: string | null
  status: string
  note: string | null
  createdAt: Date | string | null
}

export const LEAD_STATUS_META: Record<LeadStatus, {
  label: string
  nextAction: string
  tone: 'warning' | 'info' | 'accent' | 'success' | 'neutral'
}> = {
  new: {
    label: 'Nuevo',
    nextAction: 'Revisar y contactar',
    tone: 'warning',
  },
  contacted: {
    label: 'Contactado',
    nextAction: 'Esperar respuesta',
    tone: 'info',
  },
  meeting: {
    label: 'Reunion agendada',
    nextAction: 'Preparar conversacion',
    tone: 'accent',
  },
  quoted: {
    label: 'Cotizacion enviada',
    nextAction: 'Hacer seguimiento',
    tone: 'accent',
  },
  won: {
    label: 'Ganado',
    nextAction: 'Crear proyecto si corresponde',
    tone: 'success',
  },
  discarded: {
    label: 'Descartado',
    nextAction: 'Sin accion pendiente',
    tone: 'neutral',
  },
}

export const PRODUCT_LABELS: Record<string, string> = {
  vexor: 'Vexor',
  slotly: 'Slotly',
  shoppio: 'Shoppio',
  custom: 'A medida',
  other: 'Otro',
}

export function normalizeLeadStatus(status: string | null | undefined): LeadStatus {
  if (status === 'converted') return 'won'
  if (LEAD_STATUSES.includes(status as LeadStatus)) return status as LeadStatus
  return 'new'
}

export function getLeadStatusMeta(status: string | null | undefined) {
  return LEAD_STATUS_META[normalizeLeadStatus(status)]
}

export function getLeadProductLabel(product: string | null | undefined) {
  if (!product) return 'Sin interes definido'
  return PRODUCT_LABELS[product] ?? product
}

export function isAllowedLeadStatus(status: unknown): status is LeadStatus {
  return typeof status === 'string' && LEAD_STATUSES.includes(status as LeadStatus)
}
