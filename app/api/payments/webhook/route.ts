import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  await req.text()
  return NextResponse.json({ message: 'Stripe webhook received' })
}
