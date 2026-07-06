CREATE UNIQUE INDEX IF NOT EXISTS payments_stripe_payment_id_unique_idx
ON payments (stripe_payment_id) WHERE stripe_payment_id != '';
