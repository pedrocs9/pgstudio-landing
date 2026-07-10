import { WHY_ITEMS } from '../lib/constants'

export default function Why() {
  return (
    <section id="por-que" style={{ padding: '100px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ marginBottom: 56 }}>
          <p style={{
            fontSize: 12, fontWeight: 600, letterSpacing: '.12em',
            color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 14,
          }}>
            Por qué elegirnos
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700, letterSpacing: '-1px',
            color: 'var(--text)', marginBottom: 16,
          }}>
            Tecnología de punta,<br />precio justo
          </h2>
          <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 520, lineHeight: 1.65 }}>
            Construimos con el mismo stack de las empresas más grandes del mundo,
            pero para los negocios de tu barrio.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {WHY_ITEMS.map((item, i) => (
            <div key={i} className="why-card">
              <span style={{ fontSize: 28, marginBottom: 14, display: 'block' }}>
                {item.icon}
              </span>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 17, fontWeight: 600,
                color: 'var(--text)', marginBottom: 8,
              }}>
                {item.title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .why-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; padding: 28px;
          transition: border-color .25s, transform .2s;
        }
        .why-card:hover {
          border-color: var(--border-h);
          transform: translateY(-3px);
        }
      `}</style>
    </section>
  )
}