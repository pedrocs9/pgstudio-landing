export default function Custom() {
  return (
    <section id="personalizado" style={{ padding: '100px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          border: '1px solid var(--border-h)',
          borderRadius: 20, padding: '64px 48px',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 48, alignItems: 'center',
        }} className="custom-grid">

          <div>
            <p style={{
              fontSize: 12, fontWeight: 600, letterSpacing: '.12em',
              color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 14,
            }}>
              Proyecto a medida
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(26px, 3.5vw, 40px)',
              fontWeight: 700, letterSpacing: '-1px',
              color: 'var(--text)', marginBottom: 16, lineHeight: 1.15,
            }}>
              ¿Necesitas algo<br />que no está aquí?
            </h2>
            <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32 }}>
              Desarrollamos software a medida para tu negocio. Si tienes una
              idea o un problema específico que ningún producto estándar resuelve,
              conversemos y te cotizamos sin compromiso.
            </p>
            <a href="#contacto" className="btn-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 10,
              background: 'var(--cyan)', color: 'var(--bg)',
              fontFamily: 'var(--font-display)',
              fontSize: 15, fontWeight: 600,
              textDecoration: 'none',
            }}>
              Cotizar proyecto →
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '🎨', title: 'Diseño y desarrollo web', desc: 'Landing pages, portafolios y sitios corporativos con identidad propia.' },
              { icon: '⚙️', title: 'Sistemas internos', desc: 'Herramientas de gestión, reportes y automatizaciones para tu equipo.' },
              { icon: '🔗', title: 'Integraciones', desc: 'Conectamos tus sistemas existentes con APIs, SII, bancos o cualquier servicio.' },
              { icon: '📱', title: 'Apps móviles', desc: 'Aplicaciones iOS y Android para tu negocio o tus clientes.' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12, padding: '16px 20px',
                display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 14, fontWeight: 600,
                    color: 'var(--text)', marginBottom: 3,
                  }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .btn-primary {
          transition: background .2s, transform .15s;
        }
        .btn-primary:hover {
          background: var(--cyan-l) !important;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .custom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}