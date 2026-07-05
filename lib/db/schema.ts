import {
  pgTable, pgEnum, uuid, text, integer, boolean, timestamp, varchar, serial, time, uniqueIndex, index, date
} from 'drizzle-orm/pg-core'

export const bookingStatus = pgEnum('booking_status', ['pending', 'confirmed', 'cancelled', 'completed'])
export const paymentStatus = pgEnum('payment_status', ['pending', 'succeeded', 'failed', 'refunded'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 50 }).notNull().default(''),
  password: text('password').notNull().default(''),
  role: varchar('role', { length: 20 }).notNull().default('user'),
  image: text('image').default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const therapies = pgTable('therapies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull().default(''),
  durationMinutes: integer('duration_minutes').notNull(),
  priceCents: integer('price_cents').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  imageUrl: text('image_url').default(''),
  videoUrl: text('video_url').default(''),
  sortOrder: integer('sort_order').default(0),
  isPack: boolean('is_pack').notNull().default(false),
  sessionCount: integer('session_count'),
  sessionDurationMinutes: integer('session_duration_minutes'),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const therapyRequirements = pgTable('therapy_requirements', {
  id: uuid('id').primaryKey().defaultRandom(),
  therapyId: uuid('therapy_id').notNull().references(() => therapies.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const scheduleWeekly = pgTable('schedule_weekly', {
  id: uuid('id').primaryKey().defaultRandom(),
  dayOfWeek: integer('day_of_week').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
})

export const scheduleExceptions = pgTable('schedule_exceptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  exceptionDate: date('exception_date').notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  isAvailable: boolean('is_available').notNull().default(false),
  reason: text('reason').default(''),
})

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  therapyId: uuid('therapy_id').notNull().references(() => therapies.id, { onDelete: 'restrict' }),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  status: bookingStatus('status').notNull().default('pending'),
  notes: text('notes').default(''),
  stripeSessionId: text('stripe_session_id').default(''),
  reminderSentAt: timestamp('reminder_sent_at', { withTimezone: true }),
  adminNotes: text('admin_notes'),
  messageReadAt: timestamp('message_read_at', { withTimezone: true }),
  country: varchar('country', { length: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const bookingSessions = pgTable('booking_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  sessionNumber: integer('session_number').notNull(),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('confirmed'),
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amountCents: integer('amount_cents').notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('eur'),
  status: paymentStatus('status').notNull().default('pending'),
  stripePaymentId: text('stripe_payment_id').default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  bookingId: uuid('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  invoiceNumber: varchar('invoice_number', { length: 20 }).notNull().unique(),
  amountCents: integer('amount_cents').notNull(),
  pdfUrl: text('pdf_url').default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const resetTokens = pgTable('reset_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 150 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).default(''),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const processedEvents = pgTable('processed_events', {
  id: serial('id').primaryKey(),
  eventId: text('event_id').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const rateLimits = pgTable('rate_limits', {
  id: serial('id').primaryKey(),
  identifier: text('identifier').notNull(),
  action: text('action').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
