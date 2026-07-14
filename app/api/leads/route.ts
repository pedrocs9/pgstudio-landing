import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../lib/db'
import { PRODUCT_LABELS } from '../../lib/lead-pipeline'
import { leads } from '../../lib/schema'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null

  return trimmed.slice(0, maxLength)
}

function cleanProduct(value: unknown) {
  const product = cleanText(value, 40)
  if (!product) return null

  return Object.keys(PRODUCT_LABELS).includes(product) ? product : 'other'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = cleanText(body.email, 160)?.toLowerCase()

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Email invalido' }, { status: 400 })
    }

    await db.insert(leads).values({
      email,
      name: cleanText(body.name, 120),
      product: cleanProduct(body.product),
      message: cleanText(body.message, 1500),
      status: 'new',
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }
}
