/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'

const ALL_MODULES = [
  { key: 'pos',        label: 'POS básico',        price: 0,  required: true },
  { key: 'inventory',  label: 'Inventario',         price: 0,  required: true },
  { key: 'dashboard',  label: 'Dashboard',          price: 0,  required: true },
  { key: 'suppliers',  label: 'Proveedores',        price: 3,  required: false },
  { key: 'purchases',  label: 'Facturas de compra', price: 5,  required: false },
  { key: 'customers',  label: 'Clientes',           price: 3,  required: false },
  { key: 'debts',      label: 'Deudas y fiado',     price: 5,  required: false },
  { key: 'bread',      label: 'Módulo de pan',      price: 3,  required: false },
  { key: 'containers', label: 'Envases',            price: 3,  required: false },
  { key: 'reports',    label: 'Reportes avanzados', price: 5,  required: false },
  { key: 'cash',       label: 'Cierre de caja',     price: 3,  required: false },
  { key: 'users',      label: 'Usuarios y roles',   price: 3,  required: false },
]

const inputStyle: any = {
  padding: '10px 14px', background: 'var(--bg)',
  border: '1px solid var(--border)', borderRadius: 8,
  color: 'var(--text)', fontSize: 14, outline: 'none', width: '100%',
}

const labelStyle: any = {
  fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6,
}

export default function TenantDetailClient({ tenant, users, modules, subscription }: {
  tenant:       any
  users:        any[]
  modules:      any[]
  subscription: any
}) {
  const [activeModules, setActiveModules] = useState<string[]>(
    modules.filter(m => m.active).map(m => m.module)
  )
  const [subStatus, setSubStatus]   = useState(subscription?.status ?? 'active')
  const [basePrice, setBasePrice]   = useState(String(subscription?.basePrice ?? '15'))
  const [notes, setNotes]           = useState(subscription?.notes ?? '')
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)

  const totalPrice = ALL_MODULES
    .filter(m => activeModules.includes(m.key) && m.price > 0)
    .reduce((s, m) => s + m.price, Number(basePrice))

  function toggleModule(key: string) {
    if (['pos', 'inventory', 'dashboard'].includes(key)) return
    setActiveModules(prev =>
      prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key]
    )
  }

  async function handleSave() {
    setSaving(true)
    await fetch(`/api/admin/vexor/${tenant.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        modules:    activeModules,
        status:     subStatus,
        basePrice,
        totalPrice: String(totalPrice),
        notes,
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            {tenant.name}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            {tenant.businessType} · ID: {tenant.id}
            {tenant.phone && ` · ${tenant.phone}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saved && (
            <span style={{ fontSize: 13, color: 'var(--success)' }}>✓ Guardado</span>
          )}
          <button onClick={handleSave} disabled={saving} style={{
            padding: '10px 24px', background: 'var(--cyan)',
            color: 'var(--bg)', border: 'none', borderRadius: 8,
            fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600,
            cursor: saving ? 'wait' : 'pointer',
          }}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Suscripción */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
            Suscripción
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Estado</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['active', 'suspended', 'trial'].map(s => (
                  <button key={s} type="button" onClick={() => setSubStatus(s)} style={{
                    flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                    border: `1px solid ${subStatus === s ? 'var(--cyan)' : 'var(--border)'}`,
                    background: subStatus === s ? 'rgba(14,165,233,0.1)' : 'transparent',
                    color: subStatus === s ? 'var(--cyan)' : 'var(--muted)',
                    cursor: 'pointer',
                  }}>
                    {s === 'active' ? '✅ Activo' : s === 'suspended' ? '🔴 Suspendido' : '🟡 Trial'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Precio base (USD/mes)</label>
              <input type="number" style={inputStyle} value={basePrice}
                onChange={e => setBasePrice(e.target.value)} />
            </div>
            <div style={{ background: 'var(--bg2)', borderRadius: 10, padding: '14px 16px' }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Total mensual</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--cyan)' }}>
                ${totalPrice} USD
              </p>
            </div>
            <div>
              <label style={labelStyle}>Notas internas</label>
              <input style={inputStyle} value={notes}
                placeholder="Ej: Paga los 5 de cada mes"
                onChange={e => setNotes(e.target.value)} />
            </div>
            {subscription?.nextBilling && (
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                Próximo cobro: {new Date(subscription.nextBilling).toLocaleDateString('es-CL')}
              </p>
            )}
          </div>
        </div>

        {/* Usuarios */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>
            Usuarios ({users.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {users.map(u => (
              <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{u.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted)' }}>{u.email}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(14,165,233,0.1)', color: 'var(--cyan)' }}>
                    {u.role}
                  </span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: u.active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: u.active ? 'var(--success)' : 'var(--danger)' }}>
                    {u.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Módulos */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
          Módulos activos
        </h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
          Activa o desactiva módulos para este cliente. Los cambios se reflejan inmediatamente en su Vexor.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {ALL_MODULES.map(m => {
            const isActive = activeModules.includes(m.key)
            return (
              <button key={m.key} type="button" onClick={() => toggleModule(m.key)} style={{
                padding: '12px 14px', borderRadius: 8, textAlign: 'left',
                border: `1px solid ${isActive ? 'var(--cyan)' : 'var(--border)'}`,
                background: isActive ? 'rgba(14,165,233,0.08)' : 'transparent',
                cursor: m.required ? 'not-allowed' : 'pointer',
                opacity: m.required ? 0.6 : 1,
                transition: 'border-color .15s, background .15s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: isActive ? 'var(--cyan)' : 'var(--text)' }}>
                    {isActive ? '✓ ' : ''}{m.label}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {m.price === 0 ? 'Base' : `+$${m.price}`}
                  </span>
                </div>
                {m.required && <p style={{ fontSize: 10, color: 'var(--muted)' }}>Siempre activo</p>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}