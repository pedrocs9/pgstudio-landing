import {
  pgTable, serial, text, timestamp,
  integer, decimal,
} from 'drizzle-orm/pg-core'

export const leads = pgTable('leads', {
  id:        serial('id').primaryKey(),
  email:     text('email').notNull(),
  name:      text('name'),
  product:   text('product'),
  message:   text('message'),
  status:    text('status').notNull().default('new'),
  note:      text('note'),
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

export const clientPayments = pgTable('client_payments', {
  id:        serial('id').primaryKey(),
  tenantId:  integer('tenant_id').notNull(),
  amount:    decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency:  text('currency').notNull().default('USD'),
  method:    text('method').notNull().default('transfer'),
  status:    text('status').notNull().default('paid'),
  period:    text('period'),
  note:      text('note'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const activityLogs = pgTable('activity_logs', {
  id:        serial('id').primaryKey(),
  tenantId:  integer('tenant_id'),
  action:    text('action').notNull(),
  detail:    text('detail'),
  createdAt: timestamp('created_at').defaultNow(),
})