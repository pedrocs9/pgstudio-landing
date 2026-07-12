import { NextRequest, NextResponse } from 'next/server'
import { vexorDb } from '../../../lib/vexor-db'
import { tenants, users, tenantModules, tenantSubscriptions } from '../../../lib/vexor-schema'
import bcrypt from 'bcryptjs'

const ALL_MODULES = [
  { module: 'pos',        price: '0',  label: 'POS básico' },
  { module: 'inventory',  price: '0',  label: 'Inventario' },
  { module: 'dashboard',  price: '0',  label: 'Dashboard' },
  { module: 'suppliers',  price: '3',  label: 'Proveedores' },
  { module: 'purchases',  price: '5',  label: 'Facturas de compra' },
  { module: 'customers',  price: '3',  label: 'Clientes' },
  { module: 'debts',      price: '5',  label: 'Deudas y fiado' },
  { module: 'bread',      price: '3',  label: 'Módulo de pan' },
  { module: 'containers', price: '3',  label: 'Envases' },
  { module: 'reports',    price: '5',  label: 'Reportes' },
  { module: 'cash',       price: '3',  label: 'Cierre de caja' },
  { module: 'users',      price: '3',  label: 'Usuarios y roles' },
]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, businessType, rut, phone, address, adminName, adminEmail, password, modules, basePrice, notes } = body

    const [tenant] = await vexorDb.insert(tenants).values({
      name, businessType: businessType || 'generic',
      plan: 'starter', status: 'active',
      rut: rut || null, phone: phone || null, address: address || null,
    }).returning()

    const passwordHash = await bcrypt.hash(password, 10)
    await vexorDb.insert(users).values({
      tenantId:     tenant.id,
      name:         adminName,
      email:        adminEmail,
      passwordHash,
      role:         'admin',
      active:       true,
    })

    const activeModules = modules as string[]
    let totalPrice = Number(basePrice)

    for (const mod of ALL_MODULES) {
      const isActive = activeModules.includes(mod.module)
      await vexorDb.insert(tenantModules).values({
        tenantId: tenant.id,
        module:   mod.module,
        active:   isActive,
        price:    mod.price,
      })
      if (isActive && Number(mod.price) > 0) {
        totalPrice += Number(mod.price)
      }
    }

    const nextBilling = new Date()
    nextBilling.setMonth(nextBilling.getMonth() + 1)

    await vexorDb.insert(tenantSubscriptions).values({
      tenantId:    tenant.id,
      status:      'active',
      basePrice:   String(basePrice),
      totalPrice:  String(totalPrice),
      billingDay:  1,
      nextBilling,
      notes:       notes || null,
    })

    return NextResponse.json({ ok: true, tenantId: tenant.id })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al crear cliente' }, { status: 500 })
  }
}