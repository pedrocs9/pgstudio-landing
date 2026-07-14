import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../lib/db'
import { projects } from '../../../lib/schema'
import { desc } from 'drizzle-orm'
import { requireAdminSession, unauthorizedAdminResponse } from '../../../lib/admin-auth'

export async function GET() {
  try {
    await requireAdminSession()
  } catch {
    return unauthorizedAdminResponse()
  }

  const data = await db.select().from(projects).orderBy(desc(projects.createdAt))
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession()
  } catch {
    return unauthorizedAdminResponse()
  }

  try {
    const body = await req.json()
    const {
      name, clientName, type, status, url,
      repoUrl, deployUrl, monthlyFee, oneTimeFee, notes,
    } = body

    const [project] = await db.insert(projects).values({
      name, clientName,
      type:       type       || 'landing',
      status:     status     || 'development',
      url:        url        || null,
      repoUrl:    repoUrl    || null,
      deployUrl:  deployUrl  || null,
      monthlyFee: String(monthlyFee || 0),
      oneTimeFee: String(oneTimeFee || 0),
      notes:      notes      || null,
    }).returning()

    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ error: 'Error al crear proyecto' }, { status: 500 })
  }
}
