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
  currency:  text('currency').notNull().default('CLP'),
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

export const projects = pgTable('projects', {
  id:          serial('id').primaryKey(),
  quoteId:     integer('quote_id'),
  name:        text('name').notNull(),
  clientName:  text('client_name').notNull(),
  type:        text('type').notNull().default('landing'),
  status:      text('status').notNull().default('development'),
  url:         text('url'),
  repoUrl:     text('repo_url'),
  deployUrl:   text('deploy_url'),
  monthlyFee:  decimal('monthly_fee', { precision: 10, scale: 2 }).default('0'),
  oneTimeFee:  decimal('one_time_fee', { precision: 10, scale: 2 }).default('0'),
  notes:       text('notes'),
  startDate:   timestamp('start_date').defaultNow(),
  createdAt:   timestamp('created_at').defaultNow(),
})

export const projectPayments = pgTable('project_payments', {
  id:        serial('id').primaryKey(),
  projectId: integer('project_id').notNull(),
  amount:    decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency:  text('currency').notNull().default('CLP'),
  type:      text('type').notNull().default('monthly'),
  note:      text('note'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const quotes = pgTable('quotes', {
  id:          serial('id').primaryKey(),
  leadId:      integer('lead_id'),
  projectId:   integer('project_id'),
  number:      text('number').notNull(),
  clientName:  text('client_name').notNull(),
  clientEmail: text('client_email'),
  clientPhone: text('client_phone'),
  status:      text('status').notNull().default('draft'),
  validDays:   integer('valid_days').default(15),
  notes:       text('notes'),
  total:       decimal('total', { precision: 10, scale: 2 }).notNull().default('0'),
  currency:    text('currency').notNull().default('CLP'),
  createdAt:   timestamp('created_at').defaultNow(),
})

export const quoteItems = pgTable('quote_items', {
  id:          serial('id').primaryKey(),
  quoteId:     integer('quote_id').notNull(),
  description: text('description').notNull(),
  detail:      text('detail'),
  qty:         integer('qty').notNull().default(1),
  unitPrice:   decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  subtotal:    decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
})
