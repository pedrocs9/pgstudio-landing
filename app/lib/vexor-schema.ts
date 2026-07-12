import {
  pgTable, serial, text, timestamp, integer,
  decimal, boolean, pgEnum
} from 'drizzle-orm/pg-core'

export const roleEnum   = pgEnum('role',   ['admin', 'cajero', 'bodeguero'])
export const planEnum   = pgEnum('plan',   ['starter', 'pro', 'enterprise'])
export const statusEnum = pgEnum('status', ['active', 'inactive', 'suspended'])

export const tenants = pgTable('tenants', {
  id:           serial('id').primaryKey(),
  name:         text('name').notNull(),
  businessType: text('business_type').notNull().default('generic'),
  plan:         planEnum('plan').notNull().default('starter'),
  status:       statusEnum('status').notNull().default('active'),
  rut:          text('rut'),
  phone:        text('phone'),
  address:      text('address'),
  createdAt:    timestamp('created_at').defaultNow(),
})

export const users = pgTable('users', {
  id:           serial('id').primaryKey(),
  tenantId:     integer('tenant_id').notNull(),
  name:         text('name').notNull(),
  email:        text('email').notNull(),
  passwordHash: text('password_hash'),
  role:         roleEnum('role').notNull().default('cajero'),
  active:       boolean('active').notNull().default(true),
  createdAt:    timestamp('created_at').defaultNow(),
})

export const tenantModules = pgTable('tenant_modules', {
  id:        serial('id').primaryKey(),
  tenantId:  integer('tenant_id').notNull(),
  module:    text('module').notNull(),
  active:    boolean('active').notNull().default(true),
  price:     decimal('price', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const tenantSubscriptions = pgTable('tenant_subscriptions', {
  id:          serial('id').primaryKey(),
  tenantId:    integer('tenant_id').notNull(),
  status:      text('status').notNull().default('active'),
  basePrice:   decimal('base_price', { precision: 10, scale: 2 }).default('15'),
  totalPrice:  decimal('total_price', { precision: 10, scale: 2 }).default('15'),
  billingDay:  integer('billing_day').default(1),
  nextBilling: timestamp('next_billing'),
  notes:       text('notes'),
  createdAt:   timestamp('created_at').defaultNow(),
})

export const sales = pgTable('sales', {
  id:            serial('id').primaryKey(),
  tenantId:      integer('tenant_id').notNull(),
  total:         decimal('total', { precision: 10, scale: 2 }).notNull(),
  status:        text('status').notNull().default('completed'),
  paymentMethod: text('payment_method').notNull().default('cash'),
  createdAt:     timestamp('created_at').defaultNow(),
})

export const products = pgTable('products', {
  id:       serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull(),
  name:     text('name').notNull(),
  active:   boolean('active').notNull().default(true),
})

export const customers = pgTable('customers', {
  id:       serial('id').primaryKey(),
  tenantId: integer('tenant_id').notNull(),
  name:     text('name').notNull(),
})