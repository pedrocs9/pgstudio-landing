'use client'

import Link from 'next/link'

const LINKS = [
  { href: '/admin/dashboard',   icon: '📊', label: 'Dashboard',      desc: 'MRR, cobros y finanzas',     color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
  { href: '/admin/vexor',       icon: '🏪', label: 'Clientes Vexor', desc: 'Suscripciones y módulos',    color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.25)' },
  { href: '/admin/proyectos',   icon: '🌐', label: 'Proyectos web',  desc: 'Landings y sistemas',        color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
  { href: '/admin/cotizaciones',icon: '📄', label: 'Cotizaciones',   desc: 'Presupuestos en PDF',        color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)' },
]

export default function AdminQuickLinks() {
  return (
    <>
      <style>{`
        .quick-link { transition: transform .15s !important; }
        .quick-link:hover { transform: translateY(-3px) !important; }
      `}</style>
      <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.1em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 16 }}>
          Gestión del estudio
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {LINKS.map(item => (
            <Link key={item.href} href={item.href} className="quick-link" style={{
              display: 'flex', flexDirection: 'column', gap: 10,
              padding: '20px', borderRadius: 12,
              background: item.bg, border: `1px solid ${item.border}`,
              textDecoration: 'none',
            }}>
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: item.color, marginBottom: 4 }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>{item.desc}</p>
              </div>
              <span style={{ fontSize: 12, color: item.color, marginTop: 'auto' }}>Abrir →</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}