import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const leads = pgTable('leads', {
  id:        serial('id').primaryKey(),
  email:     text('email').notNull(),
  status:    text('status').notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const clients = pgTable('clients', {
  id:        serial('id').primaryKey(),
  name:      text('name'),
  email:     text('email').notNull(),
  product:   text('product'),
  plan:      text('plan'),
  status:    text('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow(),
})