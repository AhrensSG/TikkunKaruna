-- TikkunKaruna — Ampliar tabla therapies para sesiones reales
-- Ejecutar después de 001_schema.sql

-- ─────────────────────────────────────────
-- NUEVOS TIPOS ENUM
-- ─────────────────────────────────────────
CREATE TYPE therapy_category AS ENUM ('pendulo_hebreo', 'reiki', 'combinado');
CREATE TYPE therapy_modality  AS ENUM ('distancia', 'presencial');

-- ─────────────────────────────────────────
-- AMPLIAR TABLA THERAPIES
-- ─────────────────────────────────────────
ALTER TABLE therapies
  ADD COLUMN category        therapy_category NOT NULL DEFAULT 'pendulo_hebreo',
  ADD COLUMN modality        therapy_modality NOT NULL DEFAULT 'distancia',
  ADD COLUMN subtitle        TEXT             NOT NULL DEFAULT '',
  ADD COLUMN is_pack         BOOLEAN          NOT NULL DEFAULT false,
  ADD COLUMN session_count   INT              NOT NULL DEFAULT 1,
  ADD COLUMN prerequisite_id UUID             REFERENCES therapies(id),
  ADD COLUMN sort_order      INT              NOT NULL DEFAULT 0;

CREATE INDEX idx_therapies_category  ON therapies(category);
CREATE INDEX idx_therapies_is_pack   ON therapies(is_pack);
CREATE INDEX idx_therapies_sort      ON therapies(sort_order);

-- ─────────────────────────────────────────
-- INDICACIONES DE CADA SESIÓN
-- "Ideal si sientes / si estás atravesando..."
-- ─────────────────────────────────────────
CREATE TABLE therapy_indications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapy_id UUID NOT NULL REFERENCES therapies(id) ON DELETE CASCADE,
  indication TEXT NOT NULL,
  sort_order INT  NOT NULL DEFAULT 0
);

CREATE INDEX idx_therapy_indications_therapy ON therapy_indications(therapy_id);

-- ─────────────────────────────────────────
-- COMPOSICIÓN DE PACKS
-- Qué sesiones individuales forman cada pack y en qué orden
-- ─────────────────────────────────────────
CREATE TABLE pack_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id          UUID NOT NULL REFERENCES therapies(id) ON DELETE CASCADE,
  therapy_id       UUID          REFERENCES therapies(id) ON DELETE RESTRICT,
  session_number   INT  NOT NULL,
  custom_label     TEXT NOT NULL DEFAULT '',   -- etiqueta cuando no hay sesión individual equivalente
  duration_minutes INT                          -- sobreescribe la duración base de la sesión
);

CREATE INDEX idx_pack_items_pack    ON pack_items(pack_id);
CREATE INDEX idx_pack_items_therapy ON pack_items(therapy_id);
