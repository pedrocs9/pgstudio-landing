export default function Custom() {
  return (
    <section id="personalizado" className="section-space" style={{ background: 'var(--bg)' }}>
      <div className="section-shell">
        <div className="custom-grid">
          <div>
            <p className="section-eyebrow">Software a medida</p>
            <h2 className="section-title">Cuando tu operación necesita algo propio</h2>
            <p className="section-copy" style={{ marginBottom: 28 }}>
              Si tu empresa trabaja con planillas, procesos manuales o sistemas
              que no conversan entre sí, PG Studio puede diseñar una plataforma
              ajustada a tu flujo real de trabajo.
            </p>
            <div className="custom-steps">
              <span>1. Entendemos el proceso</span>
              <span>2. Proponemos una solución</span>
              <span>3. Construimos y acompañamos</span>
            </div>
            <a href="#contacto" className="btn-primary">Cotizar proyecto →</a>
          </div>

          <div className="custom-list">
            {[
              { icon: '⚙️', title: 'Sistemas internos', desc: 'Herramientas para ordenar ventas, inventario, tareas, reportes o flujos administrativos.' },
              { icon: '↔', title: 'Integraciones', desc: 'Conexión entre APIs, sistemas existentes, pasarelas de pago o servicios operativos.' },
              { icon: '📊', title: 'Plataformas de gestión', desc: 'Paneles para equipos que necesitan ver datos, tomar decisiones y dar seguimiento.' },
              { icon: '🔐', title: 'Portales y aplicaciones web', desc: 'Experiencias privadas para clientes, proveedores, colaboradores o equipos internos.' },
            ].map((item) => (
              <div key={item.title} className="custom-item premium-card">
                <span>{item.icon}</span>
                <div>
                  <p>{item.title}</p>
                  <small>{item.desc}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .custom-grid {
          align-items: center;
          background:
            radial-gradient(circle at 90% 10%, rgba(14,165,233,0.12), transparent 24rem),
            var(--surface-strong);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          display: grid;
          gap: 54px;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          padding: 64px 52px;
        }
        .custom-steps {
          display: grid;
          gap: 10px;
          margin-bottom: 30px;
        }
        .custom-steps span {
          align-items: center;
          color: var(--muted-strong);
          display: flex;
          font-size: 14px;
          font-weight: 700;
          gap: 10px;
        }
        .custom-steps span::before {
          background: var(--cyan);
          border-radius: 50%;
          content: '';
          height: 6px;
          width: 6px;
        }
        .custom-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .custom-item {
          align-items: flex-start;
          display: flex;
          gap: 14px;
          padding: 18px 20px;
        }
        .custom-item:hover {
          box-shadow: var(--shadow-sm);
          transform: translateX(4px);
        }
        .custom-item span {
          align-items: center;
          background: var(--cyan-soft);
          border-radius: 12px;
          display: flex;
          flex-shrink: 0;
          font-size: 20px;
          height: 40px;
          justify-content: center;
          width: 40px;
        }
        .custom-item p {
          color: var(--text);
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .custom-item small {
          color: var(--muted);
          display: block;
          font-size: 13px;
          line-height: 1.55;
        }
        @media (max-width: 820px) {
          .custom-grid {
            grid-template-columns: 1fr;
            padding: 42px 24px;
          }
        }
        @media (max-width: 420px) {
          .custom-grid {
            border-radius: 22px;
            padding: 34px 20px;
          }
          .custom-item { padding: 16px; }
        }
      `}</style>
    </section>
  )
}
