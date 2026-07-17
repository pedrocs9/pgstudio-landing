import { PRODUCTS } from '../lib/constants'
import VexorShowcase from './vexor-showcase'
import SlotlyShowcase from './slotly-showcase'

const productMessages = {
  vexor: {
    problem: 'Para negocios físicos que venden todos los días y necesitan controlar caja, inventario y compras sin depender de planillas.',
    benefit: 'Centraliza ventas, stock, cierre de caja y reportes para operar con más orden.',
    status: 'Disponible ahora',
    statusClass: 'status-live',
    cta: 'Conocer Vexor →',
  },
  slotly: {
    problem: 'Para servicios que pierden tiempo coordinando horas por mensajes y necesitan una agenda más ordenada.',
    benefit: 'Gestiona reservas, disponibilidad y profesionales desde un panel simple y sin fricciones.',
    status: 'Beta privada',
    statusClass: 'status-beta',
    cta: 'Conocer Slotly →',
  },
  shoppio: {
    problem: 'Para comercios que quieren vender online sin construir una tienda desde cero.',
    benefit: 'Apuntará a catálogo, pedidos y pagos con una experiencia pensada para negocios locales.',
    status: 'Próximamente',
    statusClass: 'status-soon',
    cta: 'Solicitar información →',
  },
} as const

export default function Products() {
  const [vexor, slotly, shoppio] = PRODUCTS

  return (
    <section id="productos" className="section-space" style={{ background: 'var(--bg2)' }}>
      <div className="section-shell">
        <div className="products-heading">
          <p className="section-eyebrow">Productos PG Studio</p>
          <h2 className="section-title">Productos propios para problemas reales de operación</h2>
          <p className="section-copy">
            Partimos por Vexor, un sistema de ventas y gestión para negocios físicos.
            Slotly y Shoppio forman parte de la línea de productos en desarrollo.
          </p>
        </div>

        {/* ── Vexor ── */}
        <article className="featured-product premium-card">
          <div>
            <span className={`status-badge ${productMessages.vexor.statusClass}`}>
              {productMessages.vexor.status}
            </span>
            <div className="featured-kicker">Producto principal</div>
            <h3>{vexor.name}</h3>
            <p className="featured-badge">{vexor.badge}</p>
            <p className="featured-copy">{productMessages.vexor.problem}</p>
            <p className="featured-benefit">{productMessages.vexor.benefit}</p>
            <div className="benefit-grid">
              {vexor.features.map((feature) => (
                <div key={feature}><span />{feature}</div>
              ))}
            </div>
            <div className="featured-actions">
              <a href={vexor.href} className="btn-primary">{productMessages.vexor.cta}</a>
              <a href="#contacto" className="btn-secondary">Solicitar una reunión</a>
            </div>
          </div>
          <div className="featured-visual" aria-label="Dashboard compacto de Vexor para Perfumeria Aurora">
            <VexorShowcase variant="compact" />
          </div>
        </article>

        {/* ── Slotly ── */}
        <article className="featured-product featured-product--alt premium-card">
          <div>
            <span className={`status-badge ${productMessages.slotly.statusClass}`}>
              {productMessages.slotly.status}
            </span>
            <div className="featured-kicker">Agendamiento</div>
            <h3>{slotly.name}</h3>
            <p className="featured-badge">{slotly.badge}</p>
            <p className="featured-copy">{productMessages.slotly.problem}</p>
            <p className="featured-benefit">{productMessages.slotly.benefit}</p>
            <div className="benefit-grid">
              {slotly.features.map((feature) => (
                <div key={feature}><span />{feature}</div>
              ))}
            </div>
            <div className="featured-actions">
              <a href={slotly.href} className="btn-primary">{productMessages.slotly.cta}</a>
              <a href="#contacto" className="btn-secondary">Solicitar acceso</a>
            </div>
          </div>
          <div className="featured-visual" aria-label="Vista de agenda de Slotly">
            <SlotlyShowcase />
          </div>
        </article>

        {/* ── Shoppio ── */}
        <div className="future-grid">
          <article className="future-card premium-card">
            <span className={`status-badge ${productMessages.shoppio.statusClass}`}>{productMessages.shoppio.status}</span>
            <div className="icon-tile">{shoppio.icon}</div>
            <h3>{shoppio.name}</h3>
            <p className="product-kicker">by pgstudio · {shoppio.badge}</p>
            <p>{productMessages.shoppio.problem}</p>
            <strong>{productMessages.shoppio.benefit}</strong>
            <a href={shoppio.href} className="prod-link prod-link-muted">{productMessages.shoppio.cta}</a>
          </article>
        </div>
      </div>

      <style>{`
        .products-heading {
          margin-bottom: 56px;
          max-width: 720px;
        }
        .featured-product {
          align-items: stretch;
          display: grid;
          gap: 44px;
          grid-template-columns: minmax(0, 1.05fr) minmax(360px, .95fr);
          margin-bottom: 24px;
          overflow: hidden;
          padding: 42px;
          position: relative;
        }
        .featured-product::before {
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
          content: '';
          height: 1px;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
        }
        .status-badge {
          align-self: flex-start;
          border-radius: 999px;
          display: inline-flex;
          font-size: 11px;
          font-weight: 800;
          margin-bottom: 18px;
          padding: 6px 10px;
        }
        .status-live {
          background: rgba(5,150,105,0.08);
          color: #047857;
        }
        .status-beta {
          background: rgba(14,165,233,0.1);
          color: #0369a1;
        }
        .status-soon {
          background: rgba(245,158,11,0.1);
          color: #b45309;
        }
        .featured-kicker {
          color: var(--cyan);
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .1em;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .featured-product h3 {
          color: var(--text);
          font-family: var(--font-display);
          font-size: clamp(34px, 4vw, 54px);
          letter-spacing: -0.05em;
          line-height: 1;
          margin-bottom: 8px;
        }
        .featured-badge {
          color: var(--cyan);
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 20px;
        }
        .featured-copy,
        .featured-benefit {
          color: var(--muted-strong);
          font-size: 16px;
          line-height: 1.7;
          max-width: 640px;
        }
        .featured-benefit {
          color: var(--text);
          font-weight: 700;
          margin-top: 12px;
        }
        .benefit-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin: 26px 0 30px;
        }
        .benefit-grid div {
          align-items: center;
          background: rgba(248,250,252,.7);
          border: 1px solid rgba(15,23,42,.07);
          border-radius: 14px;
          color: var(--muted-strong);
          display: flex;
          font-size: 13px;
          gap: 10px;
          padding: 12px;
        }
        .benefit-grid span {
          background: var(--cyan);
          border-radius: 50%;
          flex-shrink: 0;
          height: 6px;
          width: 6px;
        }
        .featured-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .featured-visual {
          align-items: center;
          background:
            radial-gradient(circle at 80% 0%, rgba(14,165,233,.16), transparent 18rem),
            linear-gradient(180deg, rgba(248,250,252,.92), rgba(255,255,255,.72));
          border: 1px solid var(--border);
          border-radius: 24px;
          display: flex;
          min-height: 360px;
          padding: 24px;
        }
        .future-grid {
          display: grid;
          gap: 22px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .future-card {
          display: flex;
          flex-direction: column;
          padding: 30px;
        }
        .icon-tile {
          align-items: center;
          background: linear-gradient(180deg, rgba(14,165,233,0.12), rgba(14,165,233,0.04));
          border: 1px solid rgba(2,132,199,0.14);
          border-radius: 14px;
          display: flex;
          font-size: 26px;
          height: 48px;
          justify-content: center;
          margin-bottom: 22px;
          width: 48px;
        }
        .future-card h3 {
          color: var(--text);
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 4px;
        }
        .product-kicker {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 14px;
        }
        .future-card p {
          color: var(--muted);
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 14px;
        }
        .future-card strong {
          color: var(--muted-strong);
          display: block;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .prod-link {
          align-items: center;
          color: var(--cyan);
          display: inline-flex;
          font-size: 14px;
          font-weight: 700;
          gap: 6px;
          margin-top: auto;
          text-decoration: none;
          transition: color .2s var(--ease), gap .2s var(--ease);
        }
        .prod-link:hover { gap: 10px; }
        .prod-link-muted { color: var(--muted); }
        .prod-link-muted:hover { color: var(--cyan); }
        @media (max-width: 1024px) {
          .featured-product { grid-template-columns: 1fr; }
        }
        @media (max-width: 760px) {
          .featured-product { padding: 30px; }
          .benefit-grid,
          .future-grid { grid-template-columns: 1fr; }
          .featured-visual { min-height: auto; }
        }
        @media (max-width: 420px) {
          .featured-product,
          .future-card { padding: 24px; }
        }
      `}</style>
    </section>
  )
}