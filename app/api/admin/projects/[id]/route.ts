import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/db'
import { projects, projectPayments } from '../../../../lib/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const [project] = await db.select().from(projects)
    .where(eq(projects.id, Number(id)))

  const payments = await db.select().from(projectPayments)
    .where(eq(projectPayments.projectId, Number(id)))
    .orderBy(desc(projectPayments.createdAt))

  return NextResponse.json({ project, payments })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body   = await req.json()

    await db.update(projects).set({
      name:       body.name,
      clientName: body.clientName,
      type:       body.type,
      status:     body.status,
      url:        body.url        || null,
      repoUrl:    body.repoUrl    || null,
      deployUrl:  body.deployUrl  || null,
      monthlyFee: String(body.monthlyFee || 0),
      oneTimeFee: String(body.oneTimeFee || 0),
      notes:      body.notes      || null,
    }).where(eq(projects.id, Number(id)))

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await db.delete(projectPayments).where(eq(projectPayments.projectId, Number(id)))
  await db.delete(projects).where(eq(projects.id, Number(id)))
  return NextResponse.json({ ok: true })
}