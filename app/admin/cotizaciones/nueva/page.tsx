import NewQuoteClient from '../../../components/new-quote-client'

export default function NuevaCotizacionPage() {
  return (
    <div style={{ padding: '32px', background: 'var(--bg)', minHeight: '100vh', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
        Nueva cotización
      </h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>
        Crea una cotización profesional y descárgala como PDF.
      </p>
      <NewQuoteClient />
    </div>
  )
}