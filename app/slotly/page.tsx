import type { Metadata } from 'next'
import SlotlyLandingClient from './slotly-landing-client'

export const metadata: Metadata = {
  title: 'Slotly | Agenda online para negocios de servicios',
  description:
    'Slotly es un sistema de agendamiento online para negocios de servicios chilenos, desarrollado por PG Studio en beta privada guiada.',
  alternates: {
    canonical: '/slotly',
  },
  openGraph: {
    title: 'Slotly | Agenda online para negocios de servicios',
    description:
      'Reservas online, gestión de profesionales y disponibilidad en una beta privada guiada por PG Studio.',
    url: '/slotly',
    siteName: 'PG Studio',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slotly | Agenda online para negocios de servicios',
    description:
      'Sistema de agendamiento online y gestión operativa en beta privada guiada.',
  },
}

export default function SlotlyLanding() {
  return <SlotlyLandingClient />
}