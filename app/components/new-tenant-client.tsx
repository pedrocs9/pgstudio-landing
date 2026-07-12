/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MODULES = [
  { key: 'pos',        label: 'POS básico',          price: 0,     required: true },
  { key: 'inventory',  label: 'Inventario',           price: 0,     required: true },
  { key: 'dashboard',  label: 'Dashboard',            price: 0,     required: true },
  { key: 'suppliers',  label: 'Proveedores',          price: 3000,  required: false },
  { key: 'purchases',  label: 'Facturas de compra',   price: 5000,  required: false },
  { key: 'customers',  label: 'Clientes',             price: 3000,  required: false },
  { key: 'debts',      label: 'Deudas y fiado',       price: 5000,  required: false },
  { key: 'bread',      label: 'Módulo de pan',        price: 3000,  required: false },
  { key: 'containers', label: 'Envases',              price: 3000,  required: false },
  { key: 'reports',    label: 'Reportes avanzados',   price: 5000,  required: false },
  { key: 'cash',       label: 'Cierre de caja',       price: 3000,  required: false },
  { key: 'users',      label: 'Usuarios y roles',     price: 3000,  required: false },
  { key: 'sii',        label: 'Boleta electrónica SII', price: 10000, required: false },
]

const BUSINESS_TYPES = [
  { value: 'distribuidora', label: 'Distribuidora' },
  { value: 'minimarket',    label: 'Minimarket' },
  { value: 'ferreteria',    label: 'Ferretería' },
  { value: 'botilleria',    label: 'Botillería' },
  { value: 'otro',          label: 'Otro' },
]

const inputStyle: any = {
  padding: '10px 14px',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 8, color: 'var(--text)',
  fontSize: 14, outline: 'none', width: '100%',
}

const labelStyle: any = {
  fontSize: 12, color: 'var(--muted)',
  display: 'block', marginBottom: 6,
}

export default function NewTenantClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', businessType: 'distribuidora',
    rut: '', phone: '', address: '',
    adminName: '', adminEmail: '', password: '',
    basePrice: '15000',
  })
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'pos', 'inventory', 'dashboard',
  ])

  const toggleModule = (key: string) => {
    if (['pos', 'inventory', 'dashboard'].includes(key)) return
    setSelectedModules(prev =>
      prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key]
    )
  }

  const totalPrice = MODULES
    .filter(m => selectedModules.includes(m.key) && m.price > 0)
    .reduce((s, m) => s + m.price, Number(form.basePrice))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/vexor', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, modules: selectedModules }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.ok) router.push('/admin/vexor')
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 24 }}
    >
      {/* Datos del negocio */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "24px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 16,
          }}
        >
          Datos del negocio
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Nombre del negocio *</label>
              <input
                required
                style={inputStyle}
                value={form.name}
                placeholder="Ej: Distribuidora Los Robles"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Tipo de negocio</label>
              <select
                style={inputStyle}
                value={form.businessType}
                onChange={(e) =>
                  setForm({ ...form, businessType: e.target.value })
                }
              >
                {BUSINESS_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>RUT</label>
              <input
                style={inputStyle}
                value={form.rut}
                placeholder="12.345.678-9"
                onChange={(e) => setForm({ ...form, rut: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Teléfono</label>
              <input
                style={inputStyle}
                value={form.phone}
                placeholder="+56 9 1234 5678"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Dirección</label>
            <input
              style={inputStyle}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Usuario admin */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "24px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 16,
          }}
        >
          Usuario administrador
        </h2>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label style={labelStyle}>Nombre *</label>
            <input
              required
              style={inputStyle}
              value={form.adminName}
              onChange={(e) => setForm({ ...form, adminName: e.target.value })}
            />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input
              required
              type="email"
              style={inputStyle}
              value={form.adminEmail}
              onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Contraseña inicial *</label>
            <input
              required
              type="password"
              autoComplete="new-password"
              style={inputStyle}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Módulos */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "24px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 4,
          }}
        >
          Módulos contratados
        </h2>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
          Los módulos base (POS, Inventario, Dashboard) están siempre incluidos.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 8,
          }}
        >
          {MODULES.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => toggleModule(m.key)}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                textAlign: "left",
                border: `1px solid ${selectedModules.includes(m.key) ? "var(--cyan)" : "var(--border)"}`,
                background: selectedModules.includes(m.key)
                  ? "rgba(14,165,233,0.08)"
                  : "transparent",
                cursor: m.required ? "not-allowed" : "pointer",
                opacity: m.required ? 0.7 : 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: selectedModules.includes(m.key)
                      ? "var(--cyan)"
                      : "var(--text)",
                  }}
                >
                  {m.label}
                </span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>
                  {m.price === 0 ? "Base" : `+$${m.price}`}
                </span>
              </div>
              {m.required && (
                <p
                  style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}
                >
                  Incluido siempre
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Suscripción */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "24px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 16,
          }}
        >
          Suscripción
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <label style={labelStyle}>Precio base (USD/mes) *</label>
            <input
              required
              type="number"
              style={inputStyle}
              value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div
              style={{
                background: "var(--bg2)",
                borderRadius: 10,
                padding: "10px 16px",
                width: "100%",
              }}
            >
              <p
                style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}
              >
                Total mensual
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--cyan)",
                }}
              >
                ${totalPrice.toLocaleString("es-CL")} CLP
              </p>
            </div>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Notas internas</label>
          <input
            style={inputStyle}
            value={form.notes}
            placeholder="Ej: Paga los 5 de cada mes por transferencia"
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
      </div>

      {/* Botones */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={() => router.push("/admin/vexor")}
          style={{
            flex: 1,
            padding: "12px",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: 10,
            color: "var(--muted)",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 2,
            padding: "12px",
            background: "var(--cyan)",
            color: "var(--bg)",
            border: "none",
            borderRadius: 10,
            fontFamily: "var(--font-display)",
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Creando cliente..." : "Crear cliente en Vexor →"}
        </button>
      </div>
    </form>
  );
}