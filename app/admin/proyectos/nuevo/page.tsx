import NewProjectClient from '../../../components/new-project-client'

export default function NuevoProyectoPage() {
  return (
    <div style={{ padding: '32px', background: 'var(--bg)', minHeight: '100vh', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
        Nuevo proyecto
      </h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>
        Registra un nuevo proyecto web para gestionar su estado y pagos.
      </p>
      <NewProjectClient />
    </div>
  )
}