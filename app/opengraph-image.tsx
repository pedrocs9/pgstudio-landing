import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size    = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%',
      background: '#0A0F1E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif',
    }}>
      {/* Grid de puntos */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.15) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        display: 'flex',
      }} />

      {/* Logo */}
      <div style={{
        width: 80, height: 80, borderRadius: 20,
        background: '#0EA5E9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, fontWeight: 700, color: '#0A0F1E',
        marginBottom: 32,
      }}>
        PG
      </div>

      <div style={{ fontSize: 56, fontWeight: 700, color: '#F8FAFC', marginBottom: 16, letterSpacing: '-2px' }}>
        pgstudio
      </div>

      <div style={{ fontSize: 24, color: '#64748b', marginBottom: 48, textAlign: 'center', maxWidth: 700 }}>
        Studio de software chileno
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        {['Vexor', 'AgendaPro', 'Shoppio'].map(p => (
          <div key={p} style={{
            padding: '10px 24px', borderRadius: 100,
            border: '1px solid rgba(14,165,233,0.35)',
            color: '#0EA5E9', fontSize: 16, fontWeight: 500,
            display: 'flex',
          }}>
            {p}
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 32, fontSize: 14, color: '#475569' }}>
        pgstudio.tech
      </div>
    </div>
  )
}