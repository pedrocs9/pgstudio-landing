import { NextRequest, NextResponse } from 'next/server'
import { vexorDb } from '../../../../lib/vexor-db'
import { tenantModules, tenantSubscriptions } from '../../../../lib/vexor-schema'
import { eq, and } from 'drizzle-orm'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id }                                       = await params
    const { modules, status, basePrice, totalPrice, notes } = await req.json()

    for (const mod of modules) {
      await vexorDb.update(tenantModules)
        .set({ active: true })
        .where(and(
          eq(tenantModules.tenantId, Number(id)),
          eq(tenantModules.module, mod),
        ))
    }

    const ALL_MODULES = ['pos','inventory','dashboard','suppliers','purchases','customers','debts','bread','containers','reports','cash','users']
    for (const mod of ALL_MODULES) {
      if (!modules.includes(mod)) {
        await vexorDb.update(tenantModules)
          .set({ active: false })
          .where(and(
            eq(tenantModules.tenantId, Number(id)),
            eq(tenantModules.module, mod),
          ))
      }
    }

    await vexorDb.update(tenantSubscriptions)
      .set({ status, basePrice, totalPrice, notes: notes || null })
      .where(eq(tenantSubscriptions.tenantId, Number(id)))

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}