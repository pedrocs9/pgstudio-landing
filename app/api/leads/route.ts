import { db } from '../../lib/db'
import { leads } from '../../lib/schema'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    await db.insert(leads).values({ email })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }
}