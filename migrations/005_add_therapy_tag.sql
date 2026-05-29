-- Añade columna tag a therapies (badge opcional: "Más solicitada", "Recomendado", etc.)
ALTER TABLE therapies ADD COLUMN IF NOT EXISTS tag TEXT NOT NULL DEFAULT '';
