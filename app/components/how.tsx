import { HOW_STEPS } from '../lib/constants'

export default function How() {
  return (
    <section id="como" style={{ padding: '100px 0', background: 'var(--bg2)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ marginBottom: 56 }}>
          <p style={{
            fontSize: 12, fontWeight: 600, letterSpacing: '.12em',
            color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 14,
          }}>
            El proceso
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700, letterSpacing: '-1px',
            color: 'var(--text)', marginBottom: 16,
          }}>
            Empezar es simple
          </h2>
          <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 520, lineHeight: 1.65 }}>
            Sin reuniones de horas ni contratos largos.
            Tres pasos y tu negocio en marcha.
          </p>
        </div>

        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          <div className="steps-grid">
            {HOW_STEPS.map((step, i) => (
              <div key={i} className="step-item">
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 48, fontWeight: 700, lineHeight: 1,
                  color: 'rgba(14,165,233,0.12)',
                  display: 'block', marginBottom: 20,
                }}>
                  {step.num}
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 19, fontWeight: 600,
                  color: 'var(--text)', marginBottom: 10,
                }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        .step-item {
          padding: 40px 32px;
          border-right: 1px solid var(--border);
          transition: background .2s;
        }
        .step-item:last-child { border-right: none; }
        .step-item:hover { background: rgba(14,165,233,0.03); }
        @media (max-width: 768px) {
          .steps-grid { grid-template-columns: 1fr; }
          .step-item {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
          .step-item:last-child { border-bottom: none; }
        }
      `}</style>
    </section>
  )
}