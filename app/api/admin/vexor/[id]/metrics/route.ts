import { NextRequest, NextResponse } from 'next/server'
import { vexorDb } from '../../../../../lib/vexor-db'
import { sales, products, customers } from '../../../../../lib/vexor-schema'
import { eq } from 'drizzle-orm'
import { requireAdminSession, unauthorizedAdminResponse } from '../../../../../lib/admin-auth'

async function ensureAdmin() {
  try {
    await requireAdminSession()
    return null
  } catch {
    return unauthorizedAdminResponse()
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await ensureAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id } = await params

    const [allSales, allProducts, allCustomers] = await Promise.all([
      vexorDb.select().from(sales).where(eq(sales.tenantId, Number(id))),
      vexorDb.select().from(products).where(eq(products.tenantId, Number(id))),
      vexorDb.select().from(customers).where(eq(customers.tenantId, Number(id))),
    ])

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)

    const salesToday   = allSales.filter(s => new Date(s.createdAt!) >= today)
    const salesMonth   = allSales.filter(s => new Date(s.createdAt!) >= thisMonth)
    const totalRevenue = allSales.reduce((s, sale) => s + Number(sale.total), 0)
    const revenueMonth = salesMonth.reduce((s, sale) => s + Number(sale.total), 0)
    const lastSale     = allSales.sort((a, b) =>
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    )[0]

    return NextResponse.json({
      totalSales:       allSales.length,
      salesToday:       salesToday.length,
      salesThisMonth:   salesMonth.length,
      totalRevenue,
      revenueThisMonth: revenueMonth,
      totalProducts:    allProducts.length,
      totalCustomers:   allCustomers.length,
      lastActivity:     lastSale?.createdAt ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'Error al obtener metricas' }, { status: 500 })
  }
}
