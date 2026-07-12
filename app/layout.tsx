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
  title:       'pgstudio · Studio de software chileno',
  description: 'Construimos productos digitales para negocios chilenos. Vexor, AgendaPro, Shoppio y proyectos a medida.',
  metadataBase: new URL('https://www.pgstudio.tech'),
  openGraph: {
    title:       'pgstudio · Studio de software chileno',
    description: 'Construimos productos digitales para negocios chilenos. Vexor, AgendaPro, Shoppio y proyectos a medida.',
    url:         'https://www.pgstudio.tech',
    siteName:    'pgstudio',
    locale:      'es_CL',
    type:        'website',
    images: [
      {
        url:    '/og-image.png',
        width:  1200,
        height: 630,
        alt:    'pgstudio · Studio de software chileno',
      }
    ],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'pgstudio · Studio de software chileno',
    description: 'Construimos productos digitales para negocios chilenos.',
    images:      ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
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