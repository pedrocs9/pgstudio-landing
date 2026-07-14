import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const vexorDatabaseUrl = process.env.VEXOR_DATABASE_URL?.trim()

if (!vexorDatabaseUrl) {
  throw new Error('VEXOR_DATABASE_URL is not configured')
}

const sql = neon(vexorDatabaseUrl)
export const vexorDb = drizzle(sql)
