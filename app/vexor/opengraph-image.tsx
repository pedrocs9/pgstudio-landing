import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#f8fafc',
          color: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Arial',
          height: '100%',
          justifyContent: 'space-between',
          padding: 72,
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              alignItems: 'center',
              background: 'linear-gradient(135deg, #07111f, #0284c7)',
              borderRadius: 18,
              color: '#ffffff',
              display: 'flex',
              fontSize: 34,
              fontWeight: 700,
              height: 82,
              justifyContent: 'center',
              width: 82,
            }}
          >
            PG
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#0284c7', fontSize: 28, fontWeight: 700 }}>
              PG Studio / Vexor
            </span>
            <span style={{ color: '#64748b', fontSize: 24 }}>
              Implementacion privada guiada
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 52, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: 620 }}>
            <h1
              style={{
                fontSize: 70,
                letterSpacing: '-4px',
                lineHeight: 1,
                margin: 0,
              }}
            >
              POS e inventario para negocios chilenos.
            </h1>
            <p style={{ color: '#334155', fontSize: 28, lineHeight: 1.35, marginTop: 28 }}>
              Ventas, stock, clientes, compras y caja con acompanamiento de PG Studio.
            </p>
          </div>

          <div
            style={{
              background: '#07111f',
              border: '1px solid rgba(14,165,233,.35)',
              borderRadius: 30,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              padding: 28,
              width: 330,
            }}
          >
            <div style={{ color: '#7dd3fc', fontSize: 20, fontWeight: 700 }}>Vexor POS</div>
            {['Buscar producto', 'Carrito activo', 'Stock bajo', 'Total $12.840'].map((item) => (
              <div
                key={item}
                style={{
                  background: 'rgba(255,255,255,.07)',
                  borderRadius: 16,
                  color: '#e2e8f0',
                  fontSize: 22,
                  padding: 18,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  )
}
