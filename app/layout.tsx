import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'pgstudio.tech — Software que hace crecer tu negocio',
  description: 'Soluciones SaaS para negocios chilenos. Gestión de ventas, agendamiento y tiendas online.',
  keywords: 'software chile, punto de venta, agendamiento, tienda online, SII',
  openGraph: {
    title: 'pgstudio.tech',
    description: 'Software que hace crecer tu negocio',
    url: 'https://pgstudio.tech',
    siteName: 'pgstudio.tech',
    locale: 'es_CL',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body style={{ fontFamily: 'var(--font-body)' }}
      suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}