-- TikkunKaruna — Esquema completo de base de datos

-- 1. THERAPIES
CREATE TABLE therapies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  duration_minutes INT NOT NULL,
  price_cents INT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. THERAPY REQUIREMENTS
CREATE TABLE therapy_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapy_id UUID NOT NULL REFERENCES therapies(id) ON DELETE CASCADE,
  description TEXT NOT NULL
);

CREATE INDEX idx_therapy_requirements_therapy ON therapy_requirements(therapy_id);

-- 3. SCHEDULE — WEEKLY (horario recurrente)
CREATE TABLE schedule_weekly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

-- 4. SCHEDULE — EXCEPTIONS (bloqueos o días especiales)
CREATE TABLE schedule_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exception_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN NOT NULL DEFAULT false,
  reason TEXT DEFAULT ''
);

CREATE INDEX idx_schedule_exceptions_date ON schedule_exceptions(exception_date);

-- 5. BOOKINGS
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapy_id UUID NOT NULL REFERENCES therapies(id) ON DELETE RESTRICT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_therapy ON bookings(therapy_id);
CREATE INDEX idx_bookings_start ON bookings(start_time);
CREATE INDEX idx_bookings_status ON bookings(status);

-- 6. PAYMENTS
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_cents INT NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'eur',
  status payment_status NOT NULL DEFAULT 'pending',
  stripe_payment_id TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_user ON payments(user_id);

-- 7. INVOICES
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_number VARCHAR(20) NOT NULL UNIQUE,
  amount_cents INT NOT NULL,
  pdf_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_booking ON invoices(booking_id);
CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
