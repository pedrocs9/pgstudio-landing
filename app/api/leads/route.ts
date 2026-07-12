import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../lib/db'
import { leads } from '../../lib/schema'

export async function POST(req: NextRequest) {
  try {
    const { email, name, product, message } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    await db.insert(leads).values({
      email, name: name || null,
      product: product || null,
      message: message || null,
      status: 'new',
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }
}