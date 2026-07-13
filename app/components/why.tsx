import { WHY_ITEMS } from '../lib/constants'

export default function Why() {
  return (
    <section id="por-que" className="section-space" style={{ background: 'var(--bg)' }}>
      <div className="section-shell">
        <div style={{ marginBottom: 56 }}>
          <p className="section-eyebrow">Por qué elegirnos</p>
          <h2 className="section-title">Tecnología de punta,<br />precio justo</h2>
          <p className="section-copy">
            Construimos con el mismo stack de las empresas más grandes del mundo,
            pero para los negocios de tu barrio.
          </p>
        </div>

        <div className="why-grid">
          {WHY_ITEMS.map((item, i) => (
            <div key={i} className="why-card premium-card">
              <span className="why-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .why-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }
        .why-card { padding: 28px; }
        .why-icon {
          align-items: center;
          background: var(--cyan-soft);
          border: 1px solid rgba(2,132,199,0.12);
          border-radius: 12px;
          display: flex;
          font-size: 24px;
          height: 44px;
          justify-content: center;
          margin-bottom: 18px;
          width: 44px;
        }
        .why-card h3 {
          color: var(--text);
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
        }
        .why-card p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
        }
        @media (max-width: 560px) {
          .why-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
