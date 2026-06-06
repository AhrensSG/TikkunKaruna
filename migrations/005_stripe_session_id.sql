ALTER TABLE bookings ADD COLUMN stripe_session_id TEXT DEFAULT '';
CREATE INDEX idx_bookings_stripe_session ON bookings(stripe_session_id);
