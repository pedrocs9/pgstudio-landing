import { HOW_STEPS } from '../lib/constants'

export default function How() {
  return (
    <section id="como" className="section-space" style={{ background: 'var(--bg2)' }}>
      <div className="section-shell">
        <div style={{ marginBottom: 56 }}>
          <p className="section-eyebrow">El proceso</p>
          <h2 className="section-title">Empezar es simple</h2>
          <p className="section-copy">
            Sin reuniones de horas ni contratos largos.
            Tres pasos y tu negocio en marcha.
          </p>
        </div>

        <div className="steps-grid premium-card">
          {HOW_STEPS.map((step, i) => (
            <div key={i} className="step-item">
              <span>{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          overflow: hidden;
        }
        .steps-grid:hover {
          box-shadow: var(--shadow-sm);
          transform: none;
        }
        .step-item {
          background: linear-gradient(180deg, rgba(255,255,255,0.68), rgba(255,255,255,0));
          border-right: 1px solid var(--border);
          padding: 42px 34px;
          transition: background .22s var(--ease);
        }
        .step-item:last-child { border-right: none; }
        .step-item:hover { background: rgba(14,165,233,0.045); }
        .step-item span {
          color: rgba(2,132,199,0.2);
          display: block;
          font-family: var(--font-display);
          font-size: 54px;
          font-weight: 700;
          letter-spacing: -0.06em;
          line-height: 1;
          margin-bottom: 22px;
        }
        .step-item h3 {
          color: var(--text);
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 12px;
        }
        .step-item p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
        }
        @media (max-width: 768px) {
          .steps-grid { grid-template-columns: 1fr; }
          .step-item {
            border-bottom: 1px solid var(--border);
            border-right: none;
            padding: 34px 28px;
          }
          .step-item:last-child { border-bottom: none; }
        }
      `}</style>
    </section>
  )
}
