'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      setError(true)
    }

    setLoading(false)
  }

  return (
    <main style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16, padding: '48px 40px',
        width: '100%', maxWidth: 380,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'var(--cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: 16, fontWeight: 700, color: 'var(--bg)',
            margin: '0 auto 16px',
          }}>
            PG
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22, fontWeight: 700, color: 'var(--text)',
            marginBottom: 6,
          }}>
            pgstudio admin
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            Acceso restringido
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: '12px 16px',
              background: 'var(--bg2)',
              border: `1px solid ${error ? 'var(--cyan)' : 'var(--border)'}`,
              borderRadius: 10, color: 'var(--text)',
              fontFamily: 'var(--font-body)',
              fontSize: 14, outline: 'none',
            }}
          />
          {error && (
            <p style={{ fontSize: 13, color: '#ef4444', textAlign: 'center' }}>
              Contraseña incorrecta
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              background: 'var(--cyan)', color: 'var(--bg)',
              fontFamily: 'var(--font-display)',
              fontSize: 14, fontWeight: 600,
              border: 'none', borderRadius: 10,
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}