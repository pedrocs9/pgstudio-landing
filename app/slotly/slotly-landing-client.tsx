'use client'

import { useState } from 'react'
import Link from 'next/link'
import SlotlyShowcase from '../components/slotly-showcase'

const contactHref = '/#contacto'

const modules = [
  {
    title: 'Profesionales con disponibilidad real',
    copy: 'Cada profesional tiene su horario configurado. Los clientes solo ven los slots disponibles y el sistema previene solapamientos automáticamente.',
    stat: 'Profesionales activas',
    value: '2 en agenda',
  },
  {
    title: 'Clientes que se auto-gestionan',
    copy: 'El cliente elige servicio, profesional y horario desde su celular. Sin mensajes de ida y vuelta, sin confirmaciones manuales.',
    stat: 'Reservas online',
    value: 'Sin intervención',
  },
  {
    title: 'Dashboard con visión del negocio',
    copy: 'Ve citas del día, ocupación por profesional, próximos slots libres y estado general del negocio desde un panel simple.',
    stat: 'Hoy',
    value: '18 citas esta semana',
  },
]

export default function SlotlyLandingClient() {
  const [open, setOpen] = useState(false)
  const closeMenu = () => setOpen(false)

  return (
    <>
      <nav className="slotly-nav" aria-label="Navegacion de Slotly">
        <div className="section-shell slotly-nav-shell">
          <Link href="/" className="slotly-brand" onClick={closeMenu}>
            <span className="pg-mark">PG</span>
            <span>
              <strong>pgstudio</strong>
              <small>/ Slotly</small>
            </span>
          </Link>

          <div className="slotly-desktop-links">
            <a href="#agenda">Agenda</a>
            <a href="#gestion">Gestión</a>
            <a href="#estado">Beta</a>
            <Link href="/">Volver a PG Studio</Link>
            <Link href={contactHref} className="btn-primary slotly-nav-cta">
              Solicitar acceso
            </Link>
          </div>

          <button
            className="slotly-menu-btn"
            type="button"
            aria-label="Abrir menu de Slotly"
            aria-expanded={open}
            aria-controls="slotly-mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>

        {open && (
          <div id="slotly-mobile-menu" className="slotly-mobile-menu">
            <a href="#agenda" onClick={closeMenu}>Agenda</a>
            <a href="#gestion" onClick={closeMenu}>Gestión</a>
            <a href="#estado" onClick={closeMenu}>Beta</a>
            <Link href="/" onClick={closeMenu}>Volver a PG Studio</Link>
            <Link href={contactHref} className="btn-primary" onClick={closeMenu}>
              Solicitar acceso
            </Link>
          </div>
        )}
      </nav>

      <main className="slotly-page">
        {/* ── Hero ── */}
        <section className="slotly-hero">
          <div aria-hidden className="slotly-grid-bg" />
          <div className="section-shell slotly-hero-layout reveal">
            <div className="slotly-hero-copy">
              <p className="hero-badge">
                <span />
                Beta privada guiada
              </p>
              <h1>Tu agenda online. Tus clientes reservan solos, tú solo atiendes.</h1>
              <p>
                Slotly es el sistema de agendamiento que PG Studio está preparando
                junto a negocios de servicios chilenos que pierden tiempo coordinando
                horas por WhatsApp y necesitan una agenda más ordenada.
              </p>
              <div className="slotly-actions">
                <Link href={contactHref} className="btn-primary">Solicitar acceso</Link>
                <a href="#agenda" className="btn-secondary">Ver cómo funciona</a>
              </div>
              <div className="slotly-trust-row">
                <span>Desarrollo local</span>
                <span>Beta acompañada</span>
                <span>Acceso limitado</span>
              </div>
            </div>

            <SlotlyShowcase />
          </div>
        </section>

        {/* ── Problema ── */}
        <section className="section-space slotly-problem">
          <div className="section-shell slotly-split">
            <div>
              <p className="section-eyebrow">El problema</p>
              <h2 className="section-title">Coordinar horas por mensaje es tiempo que no le estás dedicando a tu negocio.</h2>
            </div>
            <p className="section-copy">
              En muchos negocios de servicios la agenda vive en WhatsApp, en una
              libreta o en la memoria. Confirmar, reagendar y recordar citas consume
              horas que podrían dedicarse a atender. Slotly busca ordenar ese flujo
              en una experiencia simple, pensada para servicios presenciales y
              acompañada por PG Studio.
            </p>
          </div>
        </section>

        {/* ── Agenda ── */}
        <section id="agenda" className="section-space slotly-agenda-section">
          <div className="section-shell">
            <div className="slotly-section-heading">
              <p className="section-eyebrow">Agenda protagonista</p>
              <h2 className="section-title">Reservas online sin intervención manual.</h2>
              <p className="section-copy">
                El cliente elige el servicio, el profesional y el horario disponible
                desde su celular, en cualquier momento. Sin mensajes, sin llamadas,
                sin confirmaciones manuales de tu parte.
              </p>
            </div>

            <div className="agenda-showcase premium-card">
              <SlotlyShowcase />
              <div className="agenda-callouts">
                <article>
                  <span>01</span>
                  <h3>Página pública por negocio</h3>
                  <p>Cada negocio tiene su propia URL con sus servicios, profesionales y disponibilidad en tiempo real.</p>
                </article>
                <article>
                  <span>02</span>
                  <h3>Sin solapamientos</h3>
                  <p>El sistema valida disponibilidad en el servidor. Dos clientes no pueden reservar el mismo horario con el mismo profesional.</p>
                </article>
                <article>
                  <span>03</span>
                  <h3>Confirmación automática</h3>
                  <p>El cliente recibe confirmación inmediata al reservar. Sin intervención del negocio para cada cita.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ── Gestión ── */}
        <section id="gestion" className="section-space slotly-management">
          <div className="section-shell">
            <div className="slotly-section-heading narrow">
              <p className="section-eyebrow">Gestión conectada</p>
              <h2 className="section-title">La reserva no termina cuando el cliente confirma.</h2>
              <p className="section-copy">
                Cada reserva actualiza la disponibilidad, queda asociada a un cliente
                y aparece en el dashboard del negocio para que el equipo siempre sepa
                qué viene.
              </p>
            </div>

            <div className="module-grid">
              {modules.map((mod) => (
                <article className="premium-card module-card" key={mod.title}>
                  <div>
                    <span>{mod.stat}</span>
                    <strong>{mod.value}</strong>
                  </div>
                  <h3>{mod.title}</h3>
                  <p>{mod.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Estado beta ── */}
        <section id="estado" className="section-space slotly-state">
          <div className="section-shell state-panel">
            <div>
              <p className="section-eyebrow">Estado actual</p>
              <h2 className="section-title">Beta privada, con acompañamiento directo.</h2>
              <p className="section-copy">
                Slotly se encuentra en beta privada guiada con un grupo reducido de
                negocios. PG Studio acompaña la configuración, revisa necesidades
                reales y sigue fortaleciendo la plataforma antes de abrir el acceso
                de forma pública.
              </p>
            </div>
            <div className="state-list premium-card">
              <span>Disponible hoy</span>
              <strong>Beta privada para negocios seleccionados.</strong>
              <span>Sin promesa de lanzamiento público inmediato</span>
              <strong>La incorporación se revisa caso a caso.</strong>
              <span>Soporte de PG Studio</span>
              <strong>Configuración guiada para cada negocio incorporado.</strong>
            </div>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="section-space slotly-final-cta">
          <div className="section-shell">
            <div className="cta-panel">
              <div className="cta-content">
                <p className="section-eyebrow">Siguiente paso</p>
                <h2 className="section-title">Conversemos si Slotly calza con tu negocio.</h2>
                <p className="cta-copy">
                  Cuéntanos qué tipo de servicio ofreces, cómo manejás la agenda hoy
                  y qué necesitás ordenar. Te responderemos desde PG Studio con una
                  orientación clara.
                </p>
                <div className="slotly-actions center">
                  <Link href={contactHref} className="btn-primary">Solicitar acceso</Link>
                  <Link href="/" className="btn-secondary">Volver a PG Studio</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="slotly-footer">
        <div className="section-shell slotly-footer-grid">
          <div>
            <Link href="/" className="slotly-brand">
              <span className="pg-mark">PG</span>
              <span>
                <strong>pgstudio</strong>
                <small>/ Slotly</small>
              </span>
            </Link>
            <p>Producto desarrollado por PG Studio para negocios de servicios chilenos.</p>
          </div>
          <div>
            <h3>Slotly</h3>
            <a href="#agenda">Agenda online</a>
            <a href="#gestion">Gestión conectada</a>
            <a href="#estado">Beta privada</a>
          </div>
          <div>
            <h3>PG Studio</h3>
            <Link href="/">Sitio principal</Link>
            <Link href={contactHref}>Contacto</Link>
            <a href="mailto:hola@pgstudio.tech">hola@pgstudio.tech</a>
          </div>
        </div>
        <div className="section-shell slotly-footer-bottom">
          <span>© {new Date().getFullYear()} PG Studio</span>
          <span>Slotly se presenta como beta privada guiada.</span>
        </div>
      </footer>

      <style>{`
        .slotly-page {
          background:
            radial-gradient(circle at 72% 5%, rgba(14,165,233,.14), transparent 28rem),
            linear-gradient(180deg, #ffffff 0%, var(--bg) 30rem);
          color: var(--text);
          overflow: hidden;
        }
        .slotly-nav {
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
        .slotly-nav-shell {
          align-items: center;
          display: flex;
          height: 64px;
          justify-content: space-between;
        }
        .slotly-brand {
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
        .slotly-brand strong {
          display: block;
          font-family: var(--font-display);
          font-size: 15px;
          line-height: 1.1;
        }
        .slotly-brand small {
          color: var(--cyan);
          display: block;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.2;
        }
        .slotly-desktop-links {
          align-items: center;
          display: flex;
          gap: 24px;
        }
        .slotly-desktop-links a {
          color: var(--muted);
          font-size: 14px;
          text-decoration: none;
          transition: color var(--duration) var(--ease);
        }
        .slotly-desktop-links a:hover { color: var(--text); }
        .slotly-nav-cta {
          color: #fff !important;
          min-height: 40px;
          padding: 9px 18px;
        }
        .slotly-menu-btn {
          background: rgba(255,255,255,.72);
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          display: none;
          flex-direction: column;
          gap: 5px;
          padding: 9px;
        }
        .slotly-menu-btn span {
          background: var(--text);
          border-radius: 999px;
          display: block;
          height: 2px;
          width: 22px;
        }
        .slotly-mobile-menu {
          background: rgba(255,255,255,.97);
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 18px 20px 22px;
        }
        .slotly-mobile-menu a {
          color: var(--muted-strong);
          font-size: 15px;
          text-decoration: none;
        }
        .slotly-hero {
          padding: 138px 0 96px;
          position: relative;
        }
        .slotly-grid-bg {
          background-image:
            linear-gradient(rgba(15,23,42,.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,.045) 1px, transparent 1px);
          background-size: 44px 44px;
          inset: 0;
          mask-image: radial-gradient(ellipse 72% 48% at 50% 0%, black 18%, transparent 82%);
          pointer-events: none;
          position: absolute;
        }
        .slotly-hero-layout {
          align-items: center;
          display: grid;
          gap: 58px;
          grid-template-columns: minmax(0,.92fr) minmax(380px,1.08fr);
          position: relative;
          z-index: 1;
        }
        .slotly-hero-copy h1 {
          color: var(--text);
          font-family: var(--font-display);
          font-size: clamp(42px, 5.4vw, 70px);
          font-weight: 700;
          letter-spacing: -.055em;
          line-height: 1.02;
          margin-bottom: 24px;
          text-wrap: balance;
        }
        .slotly-hero-copy p:not(.hero-badge) {
          color: var(--muted-strong);
          font-size: clamp(17px,1.5vw,20px);
          line-height: 1.72;
          margin-bottom: 32px;
          max-width: 610px;
        }
        .slotly-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }
        .slotly-actions.center { justify-content: center; }
        .slotly-trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 34px;
        }
        .slotly-trust-row span {
          background: rgba(255,255,255,.72);
          border: 1px solid var(--border);
          border-radius: 999px;
          color: var(--muted-strong);
          font-size: 12px;
          font-weight: 800;
          padding: 8px 11px;
        }
        .slotly-problem { background: var(--bg2); }
        .slotly-split {
          align-items: start;
          display: grid;
          gap: 46px;
          grid-template-columns: minmax(0,.95fr) minmax(360px,1.05fr);
        }
        .slotly-agenda-section { background: var(--bg); }
        .slotly-section-heading {
          margin-bottom: 46px;
          max-width: 760px;
        }
        .slotly-section-heading.narrow { max-width: 700px; }
        .agenda-showcase {
          display: grid;
          gap: 26px;
          grid-template-columns: minmax(0,1.05fr) minmax(300px,.95fr);
          padding: 24px;
        }
        .agenda-callouts {
          display: grid;
          gap: 14px;
        }
        .agenda-callouts article {
          background: rgba(248,250,252,.82);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 22px;
        }
        .agenda-callouts span {
          color: var(--cyan);
          display: block;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .09em;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .agenda-callouts h3 {
          color: var(--text);
          font-family: var(--font-display);
          font-size: 18px;
          margin-bottom: 8px;
        }
        .agenda-callouts p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.65;
        }
        .slotly-management { background: #fff; }
        .module-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0,1fr));
        }
        .module-card { padding: 26px; }
        .module-card div {
          background: rgba(14,165,233,.08);
          border: 1px solid rgba(14,165,233,.13);
          border-radius: 14px;
          margin-bottom: 22px;
          padding: 14px;
        }
        .module-card div span {
          color: var(--cyan);
          display: block;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .09em;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .module-card div strong {
          color: var(--text);
          display: block;
          font-family: var(--font-display);
          font-size: 18px;
        }
        .module-card h3 {
          color: var(--text);
          font-family: var(--font-display);
          font-size: 18px;
          margin-bottom: 8px;
        }
        .module-card p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.65;
        }
        .slotly-state { background: var(--bg); }
        .state-panel {
          align-items: start;
          display: grid;
          gap: 46px;
          grid-template-columns: minmax(0,.95fr) minmax(360px,1.05fr);
        }
        .state-list {
          display: grid;
          gap: 10px;
          padding: 28px;
        }
        .state-list span {
          color: var(--cyan);
          display: block;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .09em;
          text-transform: uppercase;
        }
        .state-list strong {
          color: var(--muted-strong);
          display: block;
          font-size: 15px;
          line-height: 1.55;
          margin-bottom: 12px;
        }
        .slotly-final-cta {
          background: var(--bg2);
          text-align: center;
        }
        .slotly-footer {
          background: var(--bg);
          border-top: 1px solid var(--border);
          padding: 54px 0 30px;
        }
        .slotly-footer-grid {
          display: grid;
          gap: 42px;
          grid-template-columns: 2fr 1fr 1fr;
        }
        .slotly-footer p {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
          margin-top: 12px;
          max-width: 260px;
        }
        .slotly-footer h3 {
          color: var(--text);
          font-family: var(--font-display);
          font-size: 13px;
          margin-bottom: 14px;
        }
        .slotly-footer a {
          color: var(--muted);
          display: block;
          font-size: 13px;
          margin-bottom: 8px;
          text-decoration: none;
        }
        .slotly-footer a:hover { color: var(--cyan); }
        .slotly-footer-bottom {
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
          .slotly-hero-layout,
          .slotly-split,
          .state-panel,
          .agenda-showcase { grid-template-columns: 1fr; }
          .slotly-hero-copy { max-width: 760px; }
        }
        @media (max-width: 820px) {
          .slotly-desktop-links { display: none; }
          .slotly-menu-btn { display: flex; }
          .slotly-hero { padding: 116px 0 76px; }
          .slotly-hero-layout { gap: 38px; }
          .module-grid { grid-template-columns: 1fr; }
          .slotly-footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 520px) {
          .slotly-nav-shell { height: 60px; }
          .slotly-hero-copy h1 { font-size: clamp(36px, 11vw, 48px); }
          .agenda-showcase,
          .state-list,
          .module-card { padding: 18px; }
          .slotly-footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}