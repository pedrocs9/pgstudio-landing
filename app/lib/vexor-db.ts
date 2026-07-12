import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const sql = neon(process.env.VEXOR_DATABASE_URL!)
export const vexorDb = drizzle(sql)