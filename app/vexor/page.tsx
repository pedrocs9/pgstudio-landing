/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { Space_Grotesk, Inter } from 'next/font/google'

const display = Space_Grotesk({ subsets: ['latin'], weight: ['400','500','600','700'] })
const body    = Inter({ subsets: ['latin'] })

const FEATURES = [
  { icon: '💰', title: 'Punto de Venta', desc: 'POS táctil con búsqueda por nombre, SKU o código de barras. Compatible con pistola lectora.' },
  { icon: '📦', title: 'Inventario',     desc: 'Control de stock con alertas automáticas, imágenes de productos, categorías y variantes.' },
  { icon: '🧾', title: 'Facturas de compra', desc: 'Registra compras a proveedores y el stock se actualiza automáticamente.' },
  { icon: '📋', title: 'Deudas y fiado', desc: 'Lleva el control de ventas fiadas por cliente con historial de abonos y saldo pendiente.' },
  { icon: '🍞', title: 'Módulo de pan',  desc: 'Control diario de kg comprados, vendidos y devueltos con rentabilidad por día.' },
  { icon: '🧴', title: 'Envases',        desc: 'Registro de envases prestados por cliente con deuda de depósito automática.' },
  { icon: '📈', title: 'Reportes',       desc: 'Ventas por período, productos más vendidos, métodos de pago y ticket promedio.' },
  { icon: '🏧', title: 'Cierre de caja', desc: 'Cierre diario con efectivo contado, diferencias y historial completo.' },
  { icon: '👥', title: 'Usuarios y roles', desc: 'Admin, cajero y bodeguero con accesos diferenciados según su rol.' },
]

const FOR_WHO = [
  { icon: '🏪', title: 'Minimarkets',     desc: 'Control de ventas y stock para negocios de barrio.' },
  { icon: '🚚', title: 'Distribuidoras',  desc: 'Multi-proveedor, módulo de pan, envases y deudas.' },
  { icon: '🔧', title: 'Ferreterías',     desc: 'Inventario con categorías, SKU y múltiples unidades.' },
  { icon: '🍶', title: 'Botillerías',     desc: 'Control de vencimientos, envases y ventas rápidas.' },
]

export default function VexorLanding() {
  return (
    <main style={{
      background: '#0A0F1E', color: '#F8FAFC',
      fontFamily: body.style.fontFamily,
      minHeight: '100vh',
    }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: '1px solid rgba(14,165,233,0.14)',
        background: 'rgba(10,15,30,0.9)',
        backdropFilter: 'blur(14px)',
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: display.style.fontFamily, fontSize: 14, fontWeight: 700, color: '#0A0F1E' }}>V</div>
          <span style={{ fontFamily: display.style.fontFamily, fontSize: 16, fontWeight: 700 }}>Vexor</span>
          <span style={{ fontSize: 12, color: '#64748b', marginLeft: 4 }}>by pgstudio</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>pgstudio.tech</Link>
          <a href="https://vexor.pgstudio.tech" style={{
            padding: '8px 18px', borderRadius: 10,
            background: '#0EA5E9', color: '#0A0F1E',
            fontFamily: display.style.fontFamily,
            fontSize: 14, fontWeight: 600,
            textDecoration: 'none',
          }}>
            Entrar al sistema →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '140px 32px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.15) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 12, fontWeight: 500, letterSpacing: '.12em',
            color: '#0EA5E9', textTransform: 'uppercase',
            border: '1px solid rgba(14,165,233,0.35)',
            padding: '6px 14px', borderRadius: 100, marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0EA5E9', display: 'inline-block' }} />
            Sistema de gestión para negocios chilenos
          </div>
          <h1 style={{
            fontFamily: display.style.fontFamily,
            fontSize: 'clamp(36px, 6vw, 68px)',
            fontWeight: 700, letterSpacing: '-2px',
            marginBottom: 20, lineHeight: 1.1,
          }}>
            Todo lo que necesita<br />
            <span style={{ color: '#0EA5E9' }}>tu negocio en un solo lugar</span>
          </h1>
          <p style={{ fontSize: 18, color: '#64748b', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Vexor es el sistema de gestión pensado para distribuidoras, minimarkets y negocios chilenos. Ventas, inventario, proveedores, deudas y más.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://vexor.pgstudio.tech" style={{
              padding: '14px 28px', borderRadius: 10,
              background: '#0EA5E9', color: '#0A0F1E',
              fontFamily: display.style.fontFamily,
              fontSize: 15, fontWeight: 600,
              textDecoration: 'none',
            }}>
              Entrar al sistema →
            </a>
            <a href="mailto:hola@pgstudio.tech" style={{
              padding: '14px 28px', borderRadius: 10,
              border: '1px solid rgba(14,165,233,0.35)', color: '#F8FAFC',
              fontFamily: display.style.fontFamily,
              fontSize: 15, fontWeight: 500,
              textDecoration: 'none',
            }}>
              Solicitar demo
            </a>
          </div>
        </div>
      </section>

      {/* Para quién */}
      <section style={{ padding: '80px 32px', background: '#0D1627' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.12em', color: '#0EA5E9', textTransform: 'uppercase', marginBottom: 14, textAlign: 'center' }}>Para quién es</p>
          <h2 style={{ fontFamily: display.style.fontFamily, fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 48, textAlign: 'center' }}>
            Diseñado para negocios reales
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {FOR_WHO.map((item, i) => (
              <div key={i} style={{ background: '#111827', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 14, padding: '28px 24px' }}>
                <span style={{ fontSize: 32, display: 'block', marginBottom: 14 }}>{item.icon}</span>
                <h3 style={{ fontFamily: display.style.fontFamily, fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section style={{ padding: '80px 32px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.12em', color: '#0EA5E9', textTransform: 'uppercase', marginBottom: 14, textAlign: 'center' }}>Funcionalidades</p>
          <h2 style={{ fontFamily: display.style.fontFamily, fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 48, textAlign: 'center' }}>
            Todo incluido desde el primer día
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: '#111827', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 12, padding: '22px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <h3 style={{ fontFamily: display.style.fontFamily, fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 32px', background: '#0D1627' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: display.style.fontFamily, fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 16 }}>
            ¿Listo para ordenar tu negocio?
          </h2>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 36, lineHeight: 1.7 }}>
            Contáctanos y te mostramos cómo Vexor puede ayudarte. Sin costos ocultos, sin contratos largos.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://vexor.pgstudio.tech" style={{
              padding: '14px 28px', borderRadius: 10,
              background: '#0EA5E9', color: '#0A0F1E',
              fontFamily: display.style.fontFamily,
              fontSize: 15, fontWeight: 600,
              textDecoration: 'none',
            }}>
              Entrar al sistema →
            </a>
            <a href="mailto:hola@pgstudio.tech" style={{
              padding: '14px 28px', borderRadius: 10,
              border: '1px solid rgba(14,165,233,0.35)', color: '#F8FAFC',
              fontFamily: display.style.fontFamily,
              fontSize: 15, fontWeight: 500,
              textDecoration: 'none',
            }}>
              hola@pgstudio.tech
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(14,165,233,0.14)', padding: '32px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          © {new Date().getFullYear()} Vexor · <link href="/" style={{ color: '#0EA5E9', textDecoration: 'none' }}>pgstudio.tech</link> · Hecho con ♥ en Chile
        </p>
      </footer>
    </main>
  )
}