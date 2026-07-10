import { PRODUCTS } from '../lib/constants'

export default function Products() {
  return (
    <section id="productos" style={{ padding: '100px 0', background: 'var(--bg2)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ marginBottom: 56 }}>
          <p style={{
            fontSize: 12, fontWeight: 600, letterSpacing: '.12em',
            color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 14,
          }}>
            Nuestros productos
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700, letterSpacing: '-1px',
            color: 'var(--text)', marginBottom: 16,
          }}>
            Una solución para cada negocio
          </h2>
          <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 520, lineHeight: 1.65 }}>
            Cada producto está construido para un problema específico.
            Sin funciones de relleno, sin complejidad innecesaria.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {PRODUCTS.map(p => (
            <div key={p.id} className="prod-card">
              <div style={{ fontSize: 32, marginBottom: 20 }}>{p.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22, fontWeight: 700,
                color: 'var(--text)', marginBottom: 4,
              }}>
                {p.name}
              </h3>
              <p style={{ fontSize: 11, color: 'var(--cyan)', fontWeight: 500, marginBottom: 12 }}>
                by pgstudio · {p.badge}
              </p>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 24 }}>
                {p.desc}
              </p>
              <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                {p.features.map((f, i) => (
                  <li key={i} style={{
                    fontSize: 13, color: 'var(--muted)',
                    padding: '6px 0',
                    borderBottom: i < p.features.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: 'var(--cyan)', flexShrink: 0,
                    }} />
                    {f}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
                Desde{' '}
                <strong style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22, fontWeight: 700, color: 'var(--text)',
                }}>
                  ${p.price}
                </strong>{' '}
                USD / mes
              </p>
              <a href={p.href} className="prod-link">
                Conocer {p.name} →
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .prod-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; padding: 32px;
          display: flex; flex-direction: column;
          position: relative; overflow: hidden;
          transition: border-color .25s, transform .25s;
        }
        .prod-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--cyan); opacity: 0;
          transition: opacity .25s;
        }
        .prod-card:hover {
          border-color: var(--border-h);
          transform: translateY(-4px);
        }
        .prod-card:hover::before { opacity: 1; }
        .prod-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 14px; font-weight: 600;
          color: var(--cyan); text-decoration: none;
          transition: gap .2s; margin-top: auto;
        }
        .prod-link:hover { gap: 10px; }
      `}</style>
    </section>
  )
}