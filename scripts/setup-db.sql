-- ═══════════════════════════════════════════════════════════════
-- TikkunKaruna — Setup completo de base de datos
-- ⚠ Este script ELIMINA todo y vuelve a crear la BD desde cero.
-- Ejecutar desde pgAdmin > Query Tool sobre la BD 'tikkunkaruna'
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- DROP (orden inverso a las dependencias FK)
-- ─────────────────────────────────────────
DROP TABLE IF EXISTS invoices           CASCADE;
DROP TABLE IF EXISTS payments           CASCADE;
DROP TABLE IF EXISTS bookings           CASCADE;
DROP TABLE IF EXISTS schedule_exceptions CASCADE;
DROP TABLE IF EXISTS schedule_weekly    CASCADE;
DROP TABLE IF EXISTS therapy_requirements CASCADE;
DROP TABLE IF EXISTS therapies          CASCADE;
DROP TABLE IF EXISTS users              CASCADE;

DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS user_role      CASCADE;

-- ─────────────────────────────────────────
-- Incluye el schema y el seed
-- (pgAdmin no soporta \i, pega el contenido directamente)
-- ─────────────────────────────────────────

-- == 001_schema.sql ==

CREATE TYPE user_role      AS ENUM ('user', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

CREATE TABLE users (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  phone      VARCHAR(20)  NOT NULL DEFAULT '',
  password   TEXT         NOT NULL DEFAULT '',
  role       user_role    NOT NULL DEFAULT 'user',
  avatar     TEXT                  DEFAULT '',
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);

CREATE TABLE therapies (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(100) NOT NULL,
  description      TEXT         NOT NULL DEFAULT '',
  duration_minutes INT          NOT NULL,
  price_cents      INT          NOT NULL,
  is_active        BOOLEAN      NOT NULL DEFAULT true,
  image_url        TEXT                  DEFAULT '',
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE therapy_requirements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapy_id  UUID NOT NULL REFERENCES therapies(id) ON DELETE CASCADE,
  description TEXT NOT NULL
);
CREATE INDEX idx_therapy_requirements_therapy ON therapy_requirements(therapy_id);

CREATE TABLE schedule_weekly (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INT  NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL
);

CREATE TABLE schedule_exceptions (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  exception_date DATE    NOT NULL,
  start_time     TIME,
  end_time       TIME,
  is_available   BOOLEAN NOT NULL DEFAULT false,
  reason         TEXT             DEFAULT ''
);
CREATE INDEX idx_schedule_exceptions_date ON schedule_exceptions(exception_date);

CREATE TABLE bookings (
  id         UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID           NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
  therapy_id UUID           NOT NULL REFERENCES therapies(id) ON DELETE RESTRICT,
  start_time TIMESTAMPTZ    NOT NULL,
  end_time   TIMESTAMPTZ    NOT NULL,
  status     booking_status NOT NULL DEFAULT 'pending',
  notes      TEXT                    DEFAULT '',
  created_at TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_bookings_user    ON bookings(user_id);
CREATE INDEX idx_bookings_therapy ON bookings(therapy_id);
CREATE INDEX idx_bookings_start   ON bookings(start_time);
CREATE INDEX idx_bookings_status  ON bookings(status);

CREATE TABLE payments (
  id                UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id        UUID           NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id           UUID           NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  amount_cents      INT            NOT NULL,
  currency          VARCHAR(3)     NOT NULL DEFAULT 'eur',
  status            payment_status NOT NULL DEFAULT 'pending',
  stripe_payment_id TEXT                    DEFAULT '',
  created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_user    ON payments(user_id);

CREATE TABLE invoices (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id     UUID        NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id        UUID        NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  invoice_number VARCHAR(20) NOT NULL UNIQUE,
  amount_cents   INT         NOT NULL,
  pdf_url        TEXT                 DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_invoices_booking ON invoices(booking_id);
CREATE INDEX idx_invoices_user    ON invoices(user_id);
CREATE INDEX idx_invoices_number  ON invoices(invoice_number);

-- == 002_seed.sql ==

INSERT INTO therapies (name, description, duration_minutes, price_cents, is_active) VALUES
  ('Sesión Individual',  'Sesión de terapia individual con enfoque en el bienestar emocional y mental.', 60,  8000,  true),
  ('Terapia de Pareja',  'Sesión orientada a mejorar la comunicación y el vínculo entre parejas.',       90,  12000, true),
  ('Sesión de Grupo',    'Terapia grupal en un entorno seguro y confidencial.',                          120, 5000,  true),
  ('Consulta Inicial',   'Primera sesión de evaluación y conocimiento mutuo.',                           45,  0,     true);

INSERT INTO therapy_requirements (therapy_id, description)
SELECT id, 'Traer informe médico previo si existe' FROM therapies WHERE name = 'Sesión Individual';

INSERT INTO therapy_requirements (therapy_id, description)
SELECT id, 'Asistir ambos miembros de la pareja' FROM therapies WHERE name = 'Terapia de Pareja';

INSERT INTO therapy_requirements (therapy_id, description)
SELECT id, 'Máximo 8 participantes por sesión' FROM therapies WHERE name = 'Sesión de Grupo';

INSERT INTO schedule_weekly (day_of_week, start_time, end_time) VALUES
  (1, '09:00', '14:00'), (1, '16:00', '20:00'),
  (2, '09:00', '14:00'), (2, '16:00', '20:00'),
  (3, '09:00', '14:00'),
  (4, '09:00', '14:00'), (4, '16:00', '20:00'),
  (5, '09:00', '13:00');

INSERT INTO schedule_exceptions (exception_date, is_available, reason) VALUES
  ('2026-08-15', false, 'Vacaciones de verano'),
  ('2026-12-25', false, 'Navidad'),
  ('2026-01-01', false, 'Año Nuevo');

-- Nota: los usuarios se crean desde la app (registro/login)
-- para que bcrypt genere los hashes correctamente.
-- Para crear el admin ejecuta: npm run seed:admin
