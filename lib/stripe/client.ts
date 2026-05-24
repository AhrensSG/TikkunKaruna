export async function createCheckoutSession(bookingId: string) {
  const res = await fetch('/api/payments/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId }),
  })
  return res.json()
}
