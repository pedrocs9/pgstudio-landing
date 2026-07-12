/* eslint-disable @typescript-eslint/no-explicit-any */
import NewTenantClient from '../../../components/new-tenant-client'

export default function NuevoClientePage() {
  return (
    <div style={{ padding: '32px', background: 'var(--bg)', minHeight: '100vh', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
        Nuevo cliente Vexor
      </h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>
        Crea el tenant, usuario admin y activa los módulos contratados.
      </p>
      <NewTenantClient />
    </div>
  )
}