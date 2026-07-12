/* eslint-disable @typescript-eslint/no-explicit-any */
import { vexorDb } from '../../../lib/vexor-db'
import { tenants, users, tenantModules, tenantSubscriptions } from '../../../lib/vexor-schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import TenantDetailClient from '../../../components/tenant-detail-client'

export const dynamic = 'force-dynamic'

export default async function TenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [tenant] = await vexorDb.select().from(tenants)
    .where(eq(tenants.id, Number(id)))

  if (!tenant) return (
    <div style={{ padding: '32px', color: 'var(--text)' }}>
      Cliente no encontrado.{' '}
      <Link href="/admin/vexor">← Volver</Link>
    </div>
  )

  const [allUsers, allModules, sub] = await Promise.all([
    vexorDb.select().from(users).where(eq(users.tenantId, Number(id))),
    vexorDb.select().from(tenantModules).where(eq(tenantModules.tenantId, Number(id))),
    vexorDb.select().from(tenantSubscriptions).where(eq(tenantSubscriptions.tenantId, Number(id))),
  ])

  return (
    <div style={{ padding: '32px', background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/vexor" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
          ← Clientes Vexor
        </Link>
      </div>
      <TenantDetailClient
        tenant={tenant}
        users={allUsers}
        modules={allModules}
        subscription={sub[0] ?? null}
      />
    </div>
  )
}