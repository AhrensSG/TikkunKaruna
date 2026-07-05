ALTER TABLE therapy_requirements ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
