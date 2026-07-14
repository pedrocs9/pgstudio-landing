'use client'

import { STATS } from '../lib/constants'
import VexorShowcase from './vexor-showcase'

export default function Hero() {
  return (
    <section className="hero-section">
      <div aria-hidden className="hero-grid-bg" />
      <div aria-hidden className="hero-glow" />

      <div className="section-shell reveal hero-layout">
        <div className="hero-copy">
          <div className="hero-badge">
            <span />
            Productos SaaS y software a medida
          </div>

          <h1 className="hero-title">
            Software real para ordenar, vender y escalar tu negocio
          </h1>

          <p className="hero-lead">
            PG Studio diseña productos SaaS propios como Vexor y desarrolla
            plataformas a medida para empresas que necesitan operar mejor, vender
            con más control y tomar decisiones con datos claros.
          </p>

          <div className="hero-actions">
            <a href="#contacto" className="btn-primary">Hablar sobre mi proyecto →</a>
            <a href="/vexor" className="btn-secondary">Conocer Vexor</a>
          </div>

          <div className="hero-proof">
            {STATS.map((s, i) => (
              <div key={i} className="premium-card">
                <strong>
                  {s.num.replace(/[+%/]/g, '')}
                  <span>{s.num.match(/[+%/].*/)?.[0] ?? ''}</span>
                </strong>
                <small>{s.label}</small>
              </div>
            ))}
          </div>
        </div>
        <VexorShowcase />
      </div>

      <style>{`
        .hero-section {
          overflow: hidden;
          padding: 142px 0 104px;
          position: relative;
        }
        .hero-grid-bg {
          background-image:
            linear-gradient(rgba(15,23,42,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.045) 1px, transparent 1px);
          background-size: 44px 44px;
          inset: 0;
          mask-image: radial-gradient(ellipse 74% 54% at 50% 0%, black 18%, transparent 80%);
          pointer-events: none;
          position: absolute;
        }
        .hero-glow {
          background: radial-gradient(closest-side, rgba(14,165,233,0.16), transparent);
          height: 420px;
          left: 55%;
          pointer-events: none;
          position: absolute;
          top: 60px;
          transform: translateX(-50%);
          width: 900px;
        }
        .hero-layout {
          align-items: center;
          display: grid;
          gap: 58px;
          grid-template-columns: minmax(0, .95fr) minmax(460px, 1.05fr);
          position: relative;
          z-index: 1;
        }
        .hero-copy { max-width: 610px; }
        .hero-badge {
          align-items: center;
          background: rgba(255,255,255,0.72);
          border: 1px solid var(--border);
          border-radius: 999px;
          box-shadow: var(--shadow-sm);
          color: var(--cyan);
          display: inline-flex;
          font-size: 12px;
          font-weight: 700;
          gap: 8px;
          letter-spacing: .08em;
          margin-bottom: 28px;
          padding: 8px 14px;
          text-transform: uppercase;
        }
        .hero-badge span {
          animation: pulse 2s ease-in-out infinite;
          background: var(--cyan);
          border-radius: 50%;
          height: 6px;
          width: 6px;
        }
        .hero-title {
          color: var(--text);
          font-family: var(--font-display);
          font-size: clamp(44px, 5.8vw, 76px);
          font-weight: 700;
          letter-spacing: -0.06em;
          line-height: 1.02;
          margin-bottom: 24px;
          text-wrap: balance;
        }
        .hero-lead {
          color: var(--muted-strong);
          font-size: clamp(17px, 1.6vw, 20px);
          line-height: 1.7;
          margin-bottom: 34px;
          max-width: 590px;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }
        .hero-proof {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 42px;
        }
        .hero-proof .premium-card {
          padding: 16px 12px;
        }
        .hero-proof strong {
          color: var(--text);
          display: block;
          font-family: var(--font-display);
          font-size: 22px;
          letter-spacing: -0.03em;
        }
        .hero-proof strong span { color: var(--cyan); }
        .hero-proof small {
          color: var(--muted);
          display: block;
          font-size: 12px;
          line-height: 1.35;
          margin-top: 3px;
        }
        .vexor-preview {
          min-height: 520px;
          position: relative;
        }
        .preview-window {
          background: linear-gradient(180deg, #ffffff, rgba(248,250,252,.94));
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }
        .preview-topbar {
          align-items: center;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          padding: 18px 20px;
        }
        .preview-topbar strong {
          color: var(--text);
          display: block;
          font-family: var(--font-display);
          font-size: 16px;
        }
        .preview-topbar span {
          color: var(--muted);
          display: block;
          font-size: 12px;
          margin-top: 2px;
        }
        .system-pill {
          background: rgba(5,150,105,.09);
          border: 1px solid rgba(5,150,105,.18);
          border-radius: 999px;
          color: var(--success) !important;
          font-weight: 700;
          padding: 7px 10px;
        }
        .preview-body {
          display: grid;
          grid-template-columns: 128px 1fr;
          min-height: 420px;
        }
        .preview-sidebar {
          background: rgba(248,250,252,.82);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 18px 14px;
        }
        .preview-sidebar span {
          border-radius: 12px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 700;
          padding: 10px 12px;
        }
        .preview-sidebar .active {
          background: var(--text);
          color: #fff;
        }
        .preview-main {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 18px;
        }
        .metric-row {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .metric-row div,
        .pos-panel {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: var(--shadow-sm);
          padding: 16px;
        }
        .metric-row span {
          color: var(--muted);
          display: block;
          font-size: 11px;
          margin-bottom: 8px;
        }
        .metric-row strong {
          color: var(--text);
          font-family: var(--font-display);
          font-size: 18px;
        }
        .search-bar {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--muted);
          font-size: 12px;
          margin-bottom: 14px;
          padding: 12px 14px;
        }
        .sale-list {
          display: grid;
          gap: 8px;
        }
        .sale-list div {
          align-items: center;
          border-bottom: 1px solid rgba(15,23,42,.06);
          display: flex;
          justify-content: space-between;
          padding: 9px 2px;
        }
        .sale-list div:last-child { border-bottom: 0; }
        .sale-list span {
          color: var(--muted-strong);
          font-size: 13px;
        }
        .sale-list strong {
          color: var(--text);
          font-size: 13px;
        }
        .inventory-alert {
          align-items: center;
          background: rgba(245,158,11,.08);
          border: 1px solid rgba(245,158,11,.18);
          border-radius: 16px;
          color: #92400e;
          display: flex;
          font-size: 13px;
          gap: 10px;
          padding: 14px 16px;
        }
        .inventory-alert span {
          background: #f59e0b;
          border-radius: 50%;
          flex-shrink: 0;
          height: 8px;
          width: 8px;
        }
        .floating-card {
          position: absolute;
          z-index: 2;
        }
        .floating-card span {
          color: var(--cyan);
          display: block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .08em;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .floating-card strong {
          color: var(--text);
          display: block;
          font-family: var(--font-display);
          font-size: 15px;
          margin-bottom: 5px;
        }
        .floating-card small {
          color: var(--muted);
          display: block;
          font-size: 12px;
          line-height: 1.45;
        }
        .stock-card {
          bottom: 26px;
          left: -22px;
          max-width: 220px;
          padding: 18px;
        }
        .cash-card {
          padding: 16px 18px;
          right: -18px;
          top: 92px;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .5; transform: scale(1.3); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .preview-window { animation: productIn .75s var(--ease) .1s both; }
          .floating-card { animation: floatIn .8s var(--ease) .22s both; }
          .cash-card { animation-delay: .32s; }
          @keyframes productIn {
            from { opacity: 0; transform: translateY(18px) scale(.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes floatIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        }
        @media (max-width: 1040px) {
          .hero-layout { grid-template-columns: 1fr; }
          .hero-copy { max-width: 760px; }
          .vexor-preview { min-height: 500px; }
        }
        @media (max-width: 760px) {
          .hero-section { padding: 118px 0 78px; }
          .hero-title { font-size: clamp(38px, 11vw, 58px); }
          .hero-actions { width: 100%; }
          .hero-proof { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .preview-body { grid-template-columns: 1fr; }
          .preview-sidebar {
            border-bottom: 1px solid var(--border);
            border-right: 0;
            flex-direction: row;
            overflow: auto;
          }
          .metric-row { grid-template-columns: 1fr; }
          .floating-card { display: none; }
          .vexor-preview { min-height: auto; }
        }
        @media (max-width: 460px) {
          .hero-badge {
            max-width: 100%;
            white-space: normal;
          }
          .hero-proof { grid-template-columns: 1fr; }
          .preview-main { padding: 14px; }
        }
      `}</style>
    </section>
  )
}
