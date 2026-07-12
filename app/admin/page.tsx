/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../lib/db'
import { leads, clients } from '../lib/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'
import LeadsClient from '../components/leads-client'
import AdminQuickLinks from '../components/admin-quick-links'


export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const allLeads   = await db.select().from(leads).orderBy(desc(leads.createdAt))
  const allClients = await db.select().from(clients).orderBy(desc(clients.createdAt))

  const stats = {
    leads:     allLeads.length,
    new:       allLeads.filter(l => l.status === 'new').length,
    contacted: allLeads.filter(l => l.status === 'contacted').length,
    converted: allLeads.filter(l => l.status === 'converted').length,
    clients:   allClients.length,
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "0 0 80px",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--bg2)",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 7,
              background: "var(--cyan)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--bg)",
            }}
          >
            PG
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            pgstudio{" "}
            <span style={{ color: "var(--muted)", fontWeight: 400 }}>
              /admin
            </span>
          </span>
        </div>
        <a
          href="/api/admin/logout"
          style={{
            fontSize: 13,
            color: "var(--muted)",
            textDecoration: "none",
          }}
        >
          Cerrar sesión
        </a>
      </div>

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 24px" }}>
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {[
            {
              label: "Leads totales",
              value: stats.leads,
              color: "var(--cyan)",
            },
            { label: "Nuevos", value: stats.new, color: "var(--warning)" },
            {
              label: "Contactados",
              value: stats.contacted,
              color: "var(--cyan)",
            },
            {
              label: "Convertidos",
              value: stats.converted,
              color: "var(--success)",
            },
            {
              label: "Clientes Vexor",
              value: stats.clients,
              color: "var(--success)",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "18px 20px",
              }}
            >
              <p
                style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  fontWeight: 700,
                  color: s.color,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Leads */}
        <LeadsClient leads={allLeads} />

       {/* Gestión SaaS */}
      <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.1em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 16 }}>
          Gestión del estudio
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            {
              href:  '/admin/dashboard',
              icon:  '📊',
              label: 'Dashboard',
              desc:  'MRR, cobros y finanzas',
              color: 'var(--success)',
              bg:    'rgba(16,185,129,0.08)',
              border:'rgba(16,185,129,0.25)',
            },
            {
              href:  '/admin/vexor',
              icon:  '🏪',
              label: 'Clientes Vexor',
              desc:  'Suscripciones y módulos',
              color: 'var(--cyan)',
              bg:    'rgba(14,165,233,0.08)',
              border:'rgba(14,165,233,0.25)',
            },
            {
              href:  '/admin/proyectos',
              icon:  '🌐',
              label: 'Proyectos web',
              desc:  'Landings y sistemas',
              color: 'var(--warning)',
              bg:    'rgba(245,158,11,0.08)',
              border:'rgba(245,158,11,0.25)',
            },
            {
              href:  '/admin/cotizaciones',
              icon:  '📄',
              label: 'Cotizaciones',
              desc:  'Presupuestos en PDF',
              color: '#8b5cf6',
              bg:    'rgba(139,92,246,0.08)',
              border:'rgba(139,92,246,0.25)',
            },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', flexDirection: 'column', gap: 10,
              padding: '20px', borderRadius: 12,
              background: item.bg,
              border: `1px solid ${item.border}`,
              textDecoration: 'none',
              transition: 'transform .15s',
            }}
              onMouseEnter={(e: any) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e: any) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <div>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 15, fontWeight: 600,
                  color: item.color, marginBottom: 4,
                }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {item.desc}
                </p>
              </div>
              <span style={{ fontSize: 12, color: item.color, marginTop: 'auto' }}>
                Abrir →
              </span>
            </Link>
          ))}
        </div>
      </div>
      <AdminQuickLinks />
      </div>
    </main>
  );
}