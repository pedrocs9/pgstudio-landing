/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../../../lib/db'
import { projects, projectPayments } from '../../../lib/schema'
import { eq, desc } from 'drizzle-orm'
import Link from 'next/link'
import ProjectDetailClient from '../../../components/project-detail-client'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [project] = await db.select().from(projects)
    .where(eq(projects.id, Number(id)))

  if (!project) return (
    <div style={{ padding: '32px', color: 'var(--text)' }}>
      Proyecto no encontrado. <Link href="/admin/proyectos">← Volver</Link>
    </div>
  )

  const payments = await db.select().from(projectPayments)
    .where(eq(projectPayments.projectId, Number(id)))
    .orderBy(desc(projectPayments.createdAt))

  return (
    <div style={{ padding: '32px', background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/proyectos" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
          ← Proyectos
        </Link>
      </div>
      <ProjectDetailClient project={project} payments={payments} />
    </div>
  )
}