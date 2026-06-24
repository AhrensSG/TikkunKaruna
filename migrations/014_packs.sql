ALTER TABLE therapies ADD COLUMN IF NOT EXISTS is_pack BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE therapies ADD COLUMN IF NOT EXISTS session_count INT DEFAULT NULL;
ALTER TABLE therapies ADD COLUMN IF NOT EXISTS session_duration_minutes INT DEFAULT NULL;

CREATE TABLE IF NOT EXISTS booking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  session_number INT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_sessions_booking ON booking_sessions(booking_id);
