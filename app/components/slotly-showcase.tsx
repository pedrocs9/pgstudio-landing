const appointments = [
  { time: '09:00', client: 'María González', service: 'Manicure gel',    pro: 'Camila',    duration: '45 min', confirmed: true },
  { time: '10:00', client: 'Ana Pérez',      service: 'Pedicure spa',    pro: 'Camila',    duration: '60 min', confirmed: true },
  { time: '11:30', client: 'Sofía Rojas',    service: 'Manicure clásico',pro: 'Valentina', duration: '45 min', confirmed: true },
]

export default function SlotlyShowcase({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`slotly-frame ${compact ? 'compact' : ''}`}>
      <div className="slotly-chrome">
        <div className="slotly-chrome-left">
          <strong>Slotly</strong>
          <span>Podología Silvana</span>
        </div>
        <span className="slotly-live-pill">Agenda activa</span>
      </div>

      <div className="slotly-body">
        <div className="slotly-panel-head">
          <div>
            <span className="slotly-eyebrow">Agenda</span>
            <strong className="slotly-day">Hoy · Jueves 17</strong>
          </div>
          <span className="slotly-count-pill">3 citas</span>
        </div>

        <div className="slotly-appointments">
          {appointments.map(({ time, client, service, pro, duration }) => (
            <div key={time} className="slotly-appt">
              <div className="slotly-time">
                <strong>{time}</strong>
                <small>{duration}</small>
              </div>
              <div className="slotly-bar" />
              <div className="slotly-info">
                <strong>{client}</strong>
                <span>{service} · {pro}</span>
              </div>
              <span className="slotly-status-pill">Confirmada</span>
            </div>
          ))}

          <div className="slotly-open-slot">
            <span>+ Slot disponible · 13:00</span>
          </div>
        </div>

        <div className="slotly-footer-strip">
          <div><span>Próxima libre</span><strong>13:00</strong></div>
          <div><span>Esta semana</span><strong>18 citas</strong></div>
          <div><span>Profesionales</span><strong>2 activas</strong></div>
        </div>
      </div>

      <style>{`
        .slotly-frame {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 20px;
          box-shadow: var(--shadow-md);
          overflow: hidden;
          width: 100%;
        }
        .slotly-frame.compact {
          box-shadow: none;
        }
        .slotly-chrome {
          align-items: center;
          background: linear-gradient(90deg, #0f172a, #1e293b);
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
        }
        .slotly-chrome-left {
          align-items: center;
          display: flex;
          gap: 10px;
        }
        .slotly-chrome strong {
          color: #fff;
          font-family: var(--font-display);
          font-size: 13px;
        }
        .slotly-chrome span {
          color: rgba(255,255,255,.5);
          font-size: 12px;
        }
        .slotly-live-pill {
          background: rgba(5,150,105,.2) !important;
          border-radius: 999px;
          color: #34d399 !important;
          font-size: 11px !important;
          font-weight: 800;
          padding: 4px 10px;
        }
        .slotly-body {
          padding: 0;
        }
        .slotly-panel-head {
          align-items: center;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          padding: 14px 16px;
        }
        .slotly-eyebrow {
          color: var(--muted);
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .05em;
          text-transform: uppercase;
        }
        .slotly-day {
          color: var(--text);
          display: block;
          font-size: 14px;
          font-weight: 700;
        }
        .slotly-count-pill {
          background: rgba(14,165,233,.1);
          border-radius: 999px;
          color: var(--cyan);
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
        }
        .slotly-appointments {
          display: flex;
          flex-direction: column;
        }
        .slotly-appt {
          align-items: center;
          border-bottom: 1px solid rgba(15,23,42,.06);
          display: grid;
          gap: 12px;
          grid-template-columns: 52px 3px 1fr auto;
          padding: 12px 16px;
        }
        .slotly-time {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .slotly-time strong {
          color: var(--text);
          font-size: 13px;
          font-weight: 700;
        }
        .slotly-time small {
          color: var(--muted);
          font-size: 11px;
        }
        .slotly-bar {
          background: var(--cyan);
          border-radius: 999px;
          min-height: 36px;
          width: 3px;
        }
        .slotly-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .slotly-info strong {
          color: var(--text);
          font-size: 13px;
          font-weight: 600;
        }
        .slotly-info span {
          color: var(--muted);
          font-size: 12px;
        }
        .slotly-status-pill {
          background: rgba(5,150,105,.08);
          border-radius: 999px;
          color: #047857;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          white-space: nowrap;
        }
        .slotly-open-slot {
          border-bottom: 1px solid rgba(15,23,42,.06);
          padding: 10px 16px;
        }
        .slotly-open-slot span {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 600;
        }
        .slotly-footer-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 12px 16px;
        }
        .slotly-footer-strip > div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .slotly-footer-strip > div + div {
          border-left: 1px solid var(--border);
          padding-left: 14px;
        }
        .slotly-footer-strip span {
          color: var(--muted);
          font-size: 11px;
        }
        .slotly-footer-strip strong {
          color: var(--text);
          font-size: 14px;
          font-weight: 700;
        }
      `}</style>
    </div>
  )
}