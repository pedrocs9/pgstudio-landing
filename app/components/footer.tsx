import Link from 'next/link'

const PRODUCTS_LINKS = [
  { label: 'Vexor — Punto de venta', href: '#contacto' },
  { label: 'Slotly — Agendamiento',  href: '#contacto' },
  { label: 'Shoppio — Tienda online', href: '#contacto' },
]

const COMPANY_LINKS = [
  { label: 'Por qué pgstudio', href: '#por-que' },
  { label: 'Cómo funciona',    href: '#como' },
  { label: 'Contacto',         href: '#contacto' },
]

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '56px 0 34px',
      background: 'var(--bg)',
    }}>
      <div className="section-shell">

        {/* Top row */}
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center',
              gap: 10, textDecoration: 'none', marginBottom: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'linear-gradient(135deg, var(--ink), var(--cyan))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: 14, fontWeight: 700,
                color: '#fff', letterSpacing: '-0.5px',
              }}>
                PG
              </div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 15, fontWeight: 700, color: 'var(--text)',
              }}>
                pgstudio<span style={{ color: 'var(--cyan-l)' }}>.tech</span>
              </span>
            </Link>
            <p style={{
              fontSize: 13, color: 'var(--muted)',
              maxWidth: 220, lineHeight: 1.6,
            }}>
              Software moderno para negocios chilenos. Construido con cariño desde Chile.
            </p>
          </div>

          {/* Productos */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13, fontWeight: 600,
              color: 'var(--text)', marginBottom: 14,
            }}>
              Productos
            </h4>
            {PRODUCTS_LINKS.map(l => (
              <Link key={l.label} href={l.href} className="footer-link">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Empresa */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13, fontWeight: 600,
              color: 'var(--text)', marginBottom: 14,
            }}>
              Empresa
            </h4>
            {COMPANY_LINKS.map(l => (
              <Link key={l.label} href={l.href} className="footer-link">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contacto */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 13, fontWeight: 600,
              color: 'var(--text)', marginBottom: 14,
            }}>
              Contacto
            </h4>
            <a href="mailto:hola@pgstudio.tech" className="footer-link">
              hola@pgstudio.tech
            </a>
            
             <a href="https://wa.me/56900000000"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: 12,
          paddingTop: 24, borderTop: '1px solid var(--border)',
          marginTop: 40,
        }}>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            © {new Date().getFullYear()} pgstudio.tech — Todos los derechos reservados
          </p>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Hecho con ♥ en Chile
          </p>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px; margin-bottom: 40px;
        }
        .footer-link {
          display: block; font-size: 13px;
          color: var(--muted); text-decoration: none;
          margin-bottom: 8px; transition: color var(--duration) var(--ease);
        }
        .footer-link:hover { color: var(--cyan); }
        .footer-link:focus-visible { color: var(--cyan); }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  )
}
