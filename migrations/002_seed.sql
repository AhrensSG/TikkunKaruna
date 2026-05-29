-- TikkunKaruna — Datos de ejemplo para desarrollo
-- IMPORTANTE: ejecutar DESPUÉS de 001_schema.sql
--
-- El usuario admin tiene contraseña: Admin1234!
-- Hash generado con bcrypt (cost 10):
-- Para regenerar: node -e "const b=require('bcryptjs');b.hash('Admin1234!',10).then(console.log)"

-- ─────────────────────────────────────────
-- USUARIOS
-- ─────────────────────────────────────────
INSERT INTO users (name, email, phone, password, role) VALUES
  ('Administrador', 'admin@tikkunkaruna.com', '+34 600 000 000',
   -- bcrypt hash de 'Admin1234!'  (cámbialo después de la primera ejecución)
   '$2b$10$placeholder.hash.change.me.after.running.setup.script.X',
   'admin'),
  ('María García',  'maria@ejemplo.com',      '+34 611 111 111',
   '$2b$10$placeholder.hash.change.me.after.running.setup.script.X',
   'user'),
  ('Carlos López',  'carlos@ejemplo.com',     '+34 622 222 222',
   '$2b$10$placeholder.hash.change.me.after.running.setup.script.X',
   'user');

-- ─────────────────────────────────────────
-- TERAPIAS
-- ─────────────────────────────────────────
INSERT INTO therapies (name, description, duration_minutes, price_cents, is_active) VALUES
  ('Sesión Individual',
   'Sesión de terapia individual con enfoque en el bienestar emocional y mental.',
   60, 8000, true),
  ('Terapia de Pareja',
   'Sesión orientada a mejorar la comunicación y el vínculo entre parejas.',
   90, 12000, true),
  ('Sesión de Grupo',
   'Terapia grupal en un entorno seguro y confidencial.',
   120, 5000, true),
  ('Consulta Inicial',
   'Primera sesión de evaluación y conocimiento mutuo. Sin coste adicional.',
   45, 0, true);

-- ─────────────────────────────────────────
-- REQUISITOS DE TERAPIAS
-- ─────────────────────────────────────────
INSERT INTO therapy_requirements (therapy_id, description)
SELECT id, 'Traer informe médico previo si existe'
FROM therapies WHERE name = 'Sesión Individual';

INSERT INTO therapy_requirements (therapy_id, description)
SELECT id, 'Asistir ambos miembros de la pareja'
FROM therapies WHERE name = 'Terapia de Pareja';

INSERT INTO therapy_requirements (therapy_id, description)
SELECT id, 'Máximo 8 participantes por sesión'
FROM therapies WHERE name = 'Sesión de Grupo';

-- ─────────────────────────────────────────
-- HORARIO SEMANAL
-- (0=Domingo, 1=Lunes ... 6=Sábado)
-- ─────────────────────────────────────────
INSERT INTO schedule_weekly (day_of_week, start_time, end_time) VALUES
  (1, '09:00', '14:00'),  -- Lunes
  (1, '16:00', '20:00'),
  (2, '09:00', '14:00'),  -- Martes
  (2, '16:00', '20:00'),
  (3, '09:00', '14:00'),  -- Miércoles
  (4, '09:00', '14:00'),  -- Jueves
  (4, '16:00', '20:00'),
  (5, '09:00', '13:00');  -- Viernes

-- ─────────────────────────────────────────
-- EXCEPCIONES DE HORARIO
-- ─────────────────────────────────────────
INSERT INTO schedule_exceptions (exception_date, is_available, reason) VALUES
  ('2026-08-15', false, 'Vacaciones de verano'),
  ('2026-12-25', false, 'Navidad'),
  ('2026-01-01', false, 'Año Nuevo');

-- ─────────────────────────────────────────
-- RESERVAS DE EJEMPLO
-- ─────────────────────────────────────────
INSERT INTO bookings (user_id, therapy_id, start_time, end_time, status, notes)
SELECT
  u.id,
  t.id,
  '2026-06-10 10:00:00+02'::TIMESTAMPTZ,
  '2026-06-10 11:00:00+02'::TIMESTAMPTZ,
  'confirmed',
  'Primera sesión de seguimiento'
FROM users u, therapies t
WHERE u.email = 'maria@ejemplo.com' AND t.name = 'Sesión Individual';

INSERT INTO bookings (user_id, therapy_id, start_time, end_time, status)
SELECT
  u.id,
  t.id,
  '2026-06-12 09:00:00+02'::TIMESTAMPTZ,
  '2026-06-12 10:30:00+02'::TIMESTAMPTZ,
  'pending'
FROM users u, therapies t
WHERE u.email = 'carlos@ejemplo.com' AND t.name = 'Terapia de Pareja';

-- ─────────────────────────────────────────
-- PAGOS DE EJEMPLO
-- ─────────────────────────────────────────
INSERT INTO payments (booking_id, user_id, amount_cents, currency, status)
SELECT b.id, b.user_id, t.price_cents, 'eur', 'succeeded'
FROM bookings b
JOIN therapies t ON t.id = b.therapy_id
WHERE b.status = 'confirmed';

-- ─────────────────────────────────────────
-- FACTURAS DE EJEMPLO
-- ─────────────────────────────────────────
INSERT INTO invoices (booking_id, user_id, invoice_number, amount_cents)
SELECT b.id, b.user_id, 'INV-2026-0001', t.price_cents
FROM bookings b
JOIN therapies t ON t.id = b.therapy_id
WHERE b.status = 'confirmed';
