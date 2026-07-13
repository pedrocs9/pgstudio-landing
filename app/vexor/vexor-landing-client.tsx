'use client'

import { useState } from 'react'
import Link from 'next/link'

const contactHref = '/#contacto'

const modules = [
  {
    title: 'Inventario que acompana cada venta',
    copy: 'Las existencias se mantienen visibles para detectar quiebres, revisar productos criticos y operar con menos planillas paralelas.',
    stat: 'Stock bajo',
    value: '7 items',
  },
  {
    title: 'Clientes con contexto comercial',
    copy: 'Consulta historial, datos de contacto y saldos asociados sin perder el hilo de la atencion en caja.',
    stat: 'Cliente activo',
    value: 'Cuenta corriente',
  },
  {
    title: 'Compras y reposicion con control',
    copy: 'Registra compras a proveedores y deja trazabilidad para actualizar el negocio con una rutina mas ordenada.',
    stat: 'Compra',
    value: 'Pendiente de recepcion',
  },
]

const flow = ['Venta', 'Stock', 'Cliente', 'Caja', 'Reportes']

export default function VexorLandingClient() {
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <>
      <nav className="vexor-nav" aria-label="Navegacion de Vexor">
        <div className="section-shell vexor-nav-shell">
          <Link href="/" className="vexor-brand" onClick={closeMenu}>
            <span className="pg-mark">PG</span>
            <span>
              <strong>pgstudio</strong>
              <small>/ Vexor</small>
            </span>
          </Link>

          <div className="vexor-desktop-links">
            <a href="#pos">POS</a>
            <a href="#gestion">Gestion</a>
            <a href="#estado">Estado</a>
            <Link href="/">Volver a PG Studio</Link>
            <Link href={contactHref} className="btn-primary vexor-nav-cta">
              Solicitar demo
            </Link>
          </div>

          <button
            className="vexor-menu-btn"
            type="button"
            aria-label="Abrir menu de Vexor"
            aria-expanded={open}
            aria-controls="vexor-mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {open && (
          <div id="vexor-mobile-menu" className="vexor-mobile-menu">
            <a href="#pos" onClick={closeMenu}>POS</a>
            <a href="#gestion" onClick={closeMenu}>Gestion</a>
            <a href="#estado" onClick={closeMenu}>Estado</a>
            <Link href="/" onClick={closeMenu}>Volver a PG Studio</Link>
            <Link href={contactHref} className="btn-primary" onClick={closeMenu}>
              Solicitar demo
            </Link>
          </div>
        )}
      </nav>

      <main className="vexor-page">
        <section className="vexor-hero">
          <div aria-hidden className="vexor-grid-bg" />
          <div className="section-shell vexor-hero-layout reveal">
            <div className="vexor-hero-copy">
              <p className="hero-badge">
                <span />
                Implementacion privada guiada
              </p>
              <h1>Controla ventas, inventario, compras y clientes desde un solo lugar.</h1>
              <p>
                Vexor es el sistema de punto de venta y gestion operativa que PG Studio
                esta preparando junto a negocios chilenos que necesitan vender rapido sin
                perder control de stock, caja y clientes.
              </p>
              <div className="vexor-actions">
                <Link href={contactHref} className="btn-primary">Solicitar demo</Link>
                <a href="#pos" className="btn-secondary">Ver como funciona</a>
              </div>
              <div className="vexor-trust-row" aria-label="Caracteristicas de confianza">
                <span>Desarrollo local</span>
                <span>Implementacion acompanada</span>
                <span>Demo privada</span>
              </div>
            </div>

            <PosMockup />
          </div>
        </section>

        <section className="section-space vexor-problem">
          <div className="section-shell vexor-split">
            <div>
              <p className="section-eyebrow">El problema</p>
              <h2 className="section-title">La operacion diaria se vuelve fragil cuando cada dato vive en una herramienta distinta.</h2>
            </div>
            <p className="section-copy">
              En muchos negocios la venta ocurre en caja, el stock se revisa aparte,
              las compras quedan en otra planilla y las deudas dependen de memoria o
              mensajes. Vexor busca ordenar ese flujo en una experiencia unica,
              pensada para comercio presencial y acompanada por PG Studio.
            </p>
          </div>
        </section>

        <section id="pos" className="section-space vexor-pos-section">
          <div className="section-shell">
            <div className="vexor-section-heading">
              <p className="section-eyebrow">POS protagonista</p>
              <h2 className="section-title">Vender rapido sin perder control de la operacion.</h2>
              <p className="section-copy">
                El punto de venta concentra busqueda, carrito, cliente, descuentos,
                medios de pago, venta fiada, barcode y teclado para que la atencion
                sea fluida en caja.
              </p>
            </div>

            <div className="pos-showcase premium-card">
              <PosMockup compact />
              <div className="pos-callouts">
                <article>
                  <span>01</span>
                  <h3>Busqueda lista para caja</h3>
                  <p>Encuentra productos por nombre, SKU o codigo de barras y mantiene el total siempre visible.</p>
                </article>
                <article>
                  <span>02</span>
                  <h3>Venta con cliente y fiado</h3>
                  <p>Asocia una venta a un cliente cuando corresponde y conserva el contexto comercial.</p>
                </article>
                <article>
                  <span>03</span>
                  <h3>Pago y comprobante interno</h3>
                  <p>Registra el medio de pago, revisa el cierre y deja respaldo interno de la operacion.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="gestion" className="section-space vexor-management">
          <div className="section-shell">
            <div className="vexor-section-heading narrow">
              <p className="section-eyebrow">Gestion conectada</p>
              <h2 className="section-title">La venta no termina en el total de caja.</h2>
              <p className="section-copy">
                Una venta puede descontar stock, quedar asociada a un cliente,
                actualizar caja y dejar informacion disponible para revisar la operacion.
              </p>
            </div>

            <div className="module-grid">
              {modules.map((module) => (
                <article className="premium-card module-card" key={module.title}>
                  <div>
                    <span>{module.stat}</span>
                    <strong>{module.value}</strong>
                  </div>
                  <h3>{module.title}</h3>
                  <p>{module.copy}</p>
                </article>
              ))}
            </div>

            <div className="flow-panel">
              {flow.map((item, index) => (
                <div key={item} className="flow-step">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="estado" className="section-space vexor-state">
          <div className="section-shell state-panel">
            <div>
              <p className="section-eyebrow">Estado actual</p>
              <h2 className="section-title">Implementacion privada, con acompanamiento directo.</h2>
              <p className="section-copy">
                Vexor se encuentra en una etapa controlada con demos privadas e
                incorporacion gradual. PG Studio acompana la configuracion, revisa
                necesidades reales del negocio y sigue fortaleciendo seguridad,
                rendimiento y operacion antes de abrir un acceso publico.
              </p>
            </div>
            <div className="state-list premium-card">
              <span>Disponible hoy</span>
              <strong>Demos privadas y conversaciones de evaluacion.</strong>
              <span>Sin promesa de lanzamiento publico inmediato</span>
              <strong>La incorporacion se revisa caso a caso.</strong>
              <span>Soporte de PG Studio</span>
              <strong>Implementacion guiada para negocios seleccionados.</strong>
            </div>
          </div>
        </section>

        <section className="section-space vexor-final-cta">
          <div className="section-shell">
            <div className="cta-panel">
              <div className="cta-content">
                <p className="section-eyebrow">Siguiente paso</p>
                <h2 className="section-title">Conversemos si Vexor calza con tu operacion.</h2>
                <p className="cta-copy">
                  Cuéntanos que vendes, como manejas stock y que necesitas ordenar.
                  Te responderemos desde PG Studio con una orientacion clara.
                </p>
                <div className="vexor-actions center">
                  <Link href={contactHref} className="btn-primary">Solicitar demo</Link>
                  <Link href="/" className="btn-secondary">Volver a PG Studio</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="vexor-footer">
        <div className="section-shell vexor-footer-grid">
          <div>
            <Link href="/" className="vexor-brand">
              <span className="pg-mark">PG</span>
              <span>
                <strong>pgstudio</strong>
                <small>/ Vexor</small>
              </span>
            </Link>
            <p>Producto desarrollado por PG Studio para negocios chilenos.</p>
          </div>
          <div>
            <h3>Vexor</h3>
            <a href="#pos">POS</a>
            <a href="#gestion">Gestion conectada</a>
            <a href="#estado">Implementacion privada</a>
          </div>
          <div>
            <h3>PG Studio</h3>
            <Link href="/">Sitio principal</Link>
            <Link href={contactHref}>Contacto</Link>
            <a href="mailto:hola@pgstudio.tech">hola@pgstudio.tech</a>
          </div>
        </div>
        <div className="section-shell vexor-footer-bottom">
          <span>© {new Date().getFullYear()} PG Studio</span>
          <span>Vexor se presenta como implementacion privada guiada.</span>
        </div>
      </footer>

      <style>{`
        .vexor-page {
          background:
            radial-gradient(circle at 72% 5%, rgba(14,165,233,.14), transparent 28rem),
            linear-gradient(180deg, #ffffff 0%, var(--bg) 30rem);
          color: var(--text);
          overflow: hidden;
        }
        .vexor-nav {
          backdrop-filter: blur(18px);
          background: rgba(255,255,255,.84);
          border-bottom: 1px solid var(--border);
          box-shadow: 0 10px 34px rgba(15,23,42,.05);
          left: 0;
          position: fixed;
          right: 0;
          top: 0;
          z-index: 100;
        }
        .vexor-nav-shell {
          align-items: center;
          display: flex;
          height: 64px;
          justify-content: space-between;
        }
        .vexor-brand {
          align-items: center;
          color: var(--text);
          display: inline-flex;
          gap: 10px;
          text-decoration: none;
        }
        .pg-mark {
          align-items: center;
          background: linear-gradient(135deg, var(--ink), var(--cyan));
          border-radius: 8px;
          color: #fff;
          display: inline-flex;
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 700;
          height: 36px;
          justify-content: center;
          letter-spacing: -.5px;
          width: 36px;
        }
        .vexor-brand strong {
          display: block;
          font-family: var(--font-display);
          font-size: 15px;
          line-height: 1.1;
        }
        .vexor-brand small {
          color: var(--cyan);
          display: block;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.2;
        }
        .vexor-desktop-links {
          align-items: center;
          display: flex;
          gap: 24px;
        }
        .vexor-desktop-links a {
          color: var(--muted);
          font-size: 14px;
          text-decoration: none;
          transition: color var(--duration) var(--ease);
        }
        .vexor-desktop-links a:hover { color: var(--text); }
        .vexor-nav-cta {
          color: #fff !important;
          min-height: 40px;
          padding: 9px 18px;
        }
        .vexor-menu-btn {
          background: rgba(255,255,255,.72);
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: 9px;
        }
        .vexor-menu-btn span {
          background: var(--text);
          border-radius: 999px;
          display: block;
          height: 2px;
          width: 22px;
        }
        .vexor-mobile-menu {
          background: rgba(255,255,255,.97);
          border-top: 1px solid var(--border);
          display: none;
          flex-direction: column;
          gap: 16px;
          padding: 18px 20px 22px;
        }
        .vexor-mobile-menu a {
          color: var(--muted-strong);
          font-size: 15px;
          text-decoration: none;
        }
        .vexor-hero {
          padding: 138px 0 96px;
          position: relative;
        }
        .vexor-grid-bg {
          background-image:
            linear-gradient(rgba(15,23,42,.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,.045) 1px, transparent 1px);
          background-size: 44px 44px;
          inset: 0;
          mask-image: radial-gradient(ellipse 72% 48% at 50% 0%, black 18%, transparent 82%);
          pointer-events: none;
          position: absolute;
        }
        .vexor-hero-layout {
          align-items: center;
          display: grid;
          gap: 58px;
          grid-template-columns: minmax(0,.92fr) minmax(480px,1.08fr);
          position: relative;
          z-index: 1;
        }
        .vexor-hero-copy h1 {
          color: var(--text);
          font-family: var(--font-display);
          font-size: clamp(42px, 5.4vw, 70px);
          font-weight: 700;
          letter-spacing: -.055em;
          line-height: 1.02;
          margin-bottom: 24px;
          text-wrap: balance;
        }
        .vexor-hero-copy p:not(.hero-badge) {
          color: var(--muted-strong);
          font-size: clamp(17px,1.5vw,20px);
          line-height: 1.72;
          margin-bottom: 32px;
          max-width: 610px;
        }
        .hero-badge {
          align-items: center;
          background: rgba(255,255,255,.78);
          border: 1px solid var(--border);
          border-radius: 999px;
          box-shadow: var(--shadow-sm);
          color: var(--cyan);
          display: inline-flex;
          font-size: 12px;
          font-weight: 800;
          gap: 8px;
          letter-spacing: .08em;
          margin-bottom: 26px;
          padding: 8px 14px;
          text-transform: uppercase;
        }
        .hero-badge span {
          background: var(--cyan);
          border-radius: 50%;
          height: 6px;
          width: 6px;
        }
        .vexor-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }
        .vexor-actions.center { justify-content: center; }
        .vexor-trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 34px;
        }
        .vexor-trust-row span {
          background: rgba(255,255,255,.72);
          border: 1px solid var(--border);
          border-radius: 999px;
          color: var(--muted-strong);
          font-size: 12px;
          font-weight: 800;
          padding: 8px 11px;
        }
        .pos-mockup {
          background: #07111f;
          border: 1px solid rgba(14,165,233,.22);
          border-radius: 24px;
          box-shadow: 0 32px 90px rgba(15,23,42,.22);
          color: #e2e8f0;
          overflow: hidden;
        }
        .pos-mockup.compact {
          box-shadow: none;
          height: 100%;
        }
        .pos-topbar {
          align-items: center;
          border-bottom: 1px solid rgba(148,163,184,.16);
          display: flex;
          justify-content: space-between;
          padding: 16px 18px;
        }
        .pos-topbar strong {
          color: #fff;
          display: block;
          font-family: var(--font-display);
        }
        .pos-topbar span {
          color: #94a3b8;
          display: block;
          font-size: 12px;
          margin-top: 2px;
        }
        .pos-status {
          background: rgba(14,165,233,.14);
          border: 1px solid rgba(14,165,233,.28);
          border-radius: 999px;
          color: #7dd3fc !important;
          font-weight: 800;
          padding: 7px 10px;
        }
        .pos-body {
          display: grid;
          grid-template-columns: 1.15fr .85fr;
          gap: 14px;
          padding: 18px;
        }
        .pos-search,
        .pos-products,
        .pos-cart,
        .pos-keypad {
          background: rgba(15,23,42,.86);
          border: 1px solid rgba(148,163,184,.14);
          border-radius: 16px;
        }
        .pos-search {
          color: #94a3b8;
          font-size: 13px;
          margin-bottom: 12px;
          padding: 13px 14px;
        }
        .pos-products {
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2,minmax(0,1fr));
          padding: 12px;
        }
        .pos-products div {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(148,163,184,.1);
          border-radius: 12px;
          padding: 12px;
        }
        .pos-products span,
        .pos-cart span {
          color: #94a3b8;
          display: block;
          font-size: 11px;
          margin-bottom: 6px;
        }
        .pos-products strong,
        .pos-cart strong {
          color: #f8fafc;
          display: block;
          font-size: 13px;
        }
        .pos-cart {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 14px;
        }
        .pos-cart-row {
          align-items: center;
          border-bottom: 1px solid rgba(148,163,184,.12);
          display: flex;
          justify-content: space-between;
          padding-bottom: 10px;
        }
        .pos-cart-row:last-of-type { border-bottom: 0; }
        .pos-total {
          background: linear-gradient(180deg, rgba(14,165,233,.22), rgba(2,132,199,.18));
          border: 1px solid rgba(14,165,233,.28);
          border-radius: 16px;
          margin-top: auto;
          padding: 16px;
        }
        .pos-total span {
          color: #bae6fd;
          font-size: 12px;
          font-weight: 800;
        }
        .pos-total strong {
          color: #fff;
          font-family: var(--font-display);
          font-size: 28px;
          letter-spacing: -.04em;
        }
        .pos-keypad {
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(3,1fr);
          margin-top: 12px;
          padding: 10px;
        }
        .pos-keypad span {
          background: rgba(255,255,255,.05);
          border-radius: 9px;
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 800;
          padding: 9px 0;
          text-align: center;
        }
        .vexor-problem { background: var(--bg2); }
        .vexor-split,
        .state-panel {
          align-items: start;
          display: grid;
          gap: 46px;
          grid-template-columns: minmax(0,.95fr) minmax(360px,1.05fr);
        }
        .vexor-pos-section { background: var(--bg); }
        .vexor-section-heading {
          margin-bottom: 46px;
          max-width: 760px;
        }
        .vexor-section-heading.narrow { max-width: 700px; }
        .pos-showcase {
          display: grid;
          gap: 26px;
          grid-template-columns: minmax(0,1.15fr) minmax(300px,.85fr);
          padding: 24px;
        }
        .pos-callouts {
          display: grid;
          gap: 14px;
        }
        .pos-callouts article {
          background: rgba(248,250,252,.82);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 22px;
        }
        .pos-callouts span,
        .module-card div span,
        .state-list span {
          color: var(--cyan);
          display: block;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .09em;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .pos-callouts h3,
        .module-card h3 {
          color: var(--text);
          font-family: var(--font-display);
          font-size: 18px;
          margin-bottom: 8px;
        }
        .pos-callouts p,
        .module-card p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.65;
        }
        .vexor-management { background: #fff; }
        .module-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3,minmax(0,1fr));
        }
        .module-card {
          padding: 26px;
        }
        .module-card div {
          background: rgba(14,165,233,.08);
          border: 1px solid rgba(14,165,233,.13);
          border-radius: 14px;
          margin-bottom: 22px;
          padding: 14px;
        }
        .module-card div strong {
          color: var(--text);
          display: block;
          font-family: var(--font-display);
          font-size: 18px;
        }
        .flow-panel {
          background: var(--ink);
          border-radius: 22px;
          display: grid;
          gap: 1px;
          grid-template-columns: repeat(5,1fr);
          margin-top: 22px;
          overflow: hidden;
        }
        .flow-step {
          background: rgba(255,255,255,.04);
          padding: 22px;
        }
        .flow-step span {
          color: #7dd3fc;
          display: block;
          font-size: 11px;
          font-weight: 900;
          margin-bottom: 8px;
        }
        .flow-step strong {
          color: #fff;
          font-family: var(--font-display);
        }
        .vexor-state { background: var(--bg); }
        .state-list {
          display: grid;
          gap: 10px;
          padding: 28px;
        }
        .state-list strong {
          color: var(--muted-strong);
          display: block;
          font-size: 15px;
          line-height: 1.55;
          margin-bottom: 12px;
        }
        .vexor-final-cta {
          background: var(--bg2);
          text-align: center;
        }
        .vexor-footer {
          background: var(--bg);
          border-top: 1px solid var(--border);
          padding: 54px 0 30px;
        }
        .vexor-footer-grid {
          display: grid;
          gap: 42px;
          grid-template-columns: 2fr 1fr 1fr;
        }
        .vexor-footer p {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
          margin-top: 12px;
          max-width: 260px;
        }
        .vexor-footer h3 {
          color: var(--text);
          font-family: var(--font-display);
          font-size: 13px;
          margin-bottom: 14px;
        }
        .vexor-footer a {
          color: var(--muted);
          display: block;
          font-size: 13px;
          margin-bottom: 8px;
          text-decoration: none;
        }
        .vexor-footer a:hover { color: var(--cyan); }
        .vexor-footer-bottom {
          border-top: 1px solid var(--border);
          color: var(--muted);
          display: flex;
          flex-wrap: wrap;
          font-size: 13px;
          gap: 12px;
          justify-content: space-between;
          margin-top: 38px;
          padding-top: 24px;
        }
        @media (max-width: 1080px) {
          .vexor-hero-layout,
          .vexor-split,
          .state-panel,
          .pos-showcase {
            grid-template-columns: 1fr;
          }
          .vexor-hero-copy { max-width: 760px; }
        }
        @media (max-width: 820px) {
          .vexor-desktop-links { display: none; }
          .vexor-menu-btn,
          .vexor-mobile-menu { display: flex; }
          .vexor-hero { padding: 116px 0 76px; }
          .vexor-hero-layout { gap: 38px; }
          .pos-body,
          .module-grid {
            grid-template-columns: 1fr;
          }
          .flow-panel {
            grid-template-columns: 1fr;
          }
          .vexor-footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 520px) {
          .vexor-nav-shell { height: 60px; }
          .vexor-hero-copy h1 {
            font-size: clamp(36px, 11vw, 48px);
          }
          .hero-badge {
            align-items: flex-start;
            border-radius: 16px;
            max-width: 100%;
          }
          .pos-showcase,
          .state-list,
          .module-card {
            padding: 18px;
          }
          .pos-mockup {
            border-radius: 18px;
          }
          .pos-body {
            padding: 12px;
          }
          .pos-products {
            grid-template-columns: 1fr;
          }
          .vexor-footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}

function PosMockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`pos-mockup ${compact ? 'compact' : ''}`} aria-label="Mockup fiel del punto de venta Vexor">
      <div className="pos-topbar">
        <div>
          <strong>Vexor POS</strong>
          <span>Venta de mostrador</span>
        </div>
        <span className="pos-status">Caja abierta</span>
      </div>
      <div className="pos-body">
        <div>
          <div className="pos-search">Buscar por nombre, SKU o barcode</div>
          <div className="pos-products">
            <div><span>SKU 1842</span><strong>Bebida 1.5L</strong></div>
            <div><span>Stock 12</span><strong>Pan corriente kg</strong></div>
            <div><span>Barcode listo</span><strong>Arroz grado 1</strong></div>
            <div><span>Stock bajo</span><strong>Aceite maravilla</strong></div>
          </div>
          <div className="pos-keypad" aria-hidden="true">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => (
              <span key={key}>{key}</span>
            ))}
          </div>
        </div>
        <div className="pos-cart">
          <div className="pos-cart-row">
            <div><span>Cliente</span><strong>Venta mostrador</strong></div>
            <strong>Editar</strong>
          </div>
          <div className="pos-cart-row">
            <div><span>Carrito</span><strong>3 productos</strong></div>
            <strong>-$500</strong>
          </div>
          <div className="pos-cart-row">
            <div><span>Medio de pago</span><strong>Efectivo</strong></div>
            <strong>Fiado opcional</strong>
          </div>
          <div className="pos-total">
            <span>Total visible</span>
            <strong>$12.840</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
