import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db } from '../../lib/db'
import { PRODUCT_LABELS } from '../../lib/lead-pipeline'
import { leads } from '../../lib/schema'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const resend = new Resend(process.env.RESEND_API_KEY)
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? 'hola@pgstudio.tech'

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

    const name    = cleanText(body.name, 120)
    const product = cleanProduct(body.product)
    const message = cleanText(body.message, 1500)

    await db.insert(leads).values({
      email,
      name,
      product,
      message,
      status: 'new',
    })

    // Notificación — si falla no bloquea la respuesta al cliente
    resend.emails.send({
      from: 'PG Studio <notificaciones@pgstudio.tech>',
      to: NOTIFY_EMAIL,
      subject: `Nuevo lead: ${name ?? email} · ${product ?? 'sin producto'}`,
      html: `
        <div style="font-family:sans-serif;max-width:540px;margin:0 auto;padding:32px 0">
          <p style="font-size:12px;font-weight:800;letter-spacing:.08em;color:#0ea5e9;text-transform:uppercase;margin-bottom:8px">
            Nuevo lead · PG Studio
          </p>
          <h2 style="font-size:24px;font-weight:700;color:#0f172a;margin:0 0 24px">
            ${name ?? 'Sin nombre'}
          </h2>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px;width:120px">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px">
                <a href="mailto:${email}" style="color:#0ea5e9">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px">Producto</td>
              <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px">
                ${PRODUCT_LABELS[product as keyof typeof PRODUCT_LABELS] ?? product ?? '—'}
              </td>
            </tr>
            ${message ? `
            <tr>
              <td style="padding:10px 0;color:#64748b;font-size:14px;vertical-align:top">Mensaje</td>
              <td style="padding:10px 0;color:#0f172a;font-size:14px;line-height:1.6">${message}</td>
            </tr>` : ''}
          </table>

          <a href="https://www.pgstudio.tech/admin/leads"
             style="display:inline-block;background:#0f172a;color:#fff;font-size:14px;font-weight:700;padding:12px 22px;border-radius:10px;text-decoration:none">
            Ver en panel →
          </a>

          <p style="margin-top:32px;font-size:12px;color:#94a3b8">
            PG Studio · pgstudio.tech
          </p>
        </div>
      `,
    }).catch((err) => console.error('[resend]', err))

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }
}