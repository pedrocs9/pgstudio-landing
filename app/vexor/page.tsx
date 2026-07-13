import type { Metadata } from 'next'
import VexorLandingClient from './vexor-landing-client'

export const metadata: Metadata = {
  title: 'Vexor | POS e inventario para negocios chilenos',
  description:
    'Vexor es un sistema de punto de venta, inventario y gestion operativa para negocios chilenos, desarrollado por PG Studio en implementacion privada guiada.',
  alternates: {
    canonical: '/vexor',
  },
  openGraph: {
    title: 'Vexor | Punto de venta e inventario para negocios chilenos',
    description:
      'POS, inventario, clientes, compras y caja en una implementacion privada guiada por PG Studio.',
    url: '/vexor',
    siteName: 'PG Studio',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: '/vexor/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Vexor, producto POS e inventario desarrollado por PG Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vexor | POS e inventario para negocios chilenos',
    description:
      'Sistema de punto de venta, inventario y gestion operativa en implementacion privada guiada.',
    images: ['/vexor/opengraph-image'],
  },
}

export default function VexorLanding() {
  return <VexorLandingClient />
}
