export interface User {
  id: string
  name: string
  email: string
  phone?: string
  image?: string
  role: 'user' | 'admin'
  created_at: string
}

export interface Therapy {
  id: string
  name: string
  description: string
  duration_minutes: number
  price_cents: number
  image_url: string
  video_url: string
  is_active: boolean
  sort_order: number
  requirements?: string[]
  created_at: string
  deleted_at: string | null
  is_pack: boolean
  session_count: number | null
  session_duration_minutes: number | null
}

export interface BookingSession {
  id: string
  booking_id: string
  session_number: number
  start_time: string
  end_time: string
  status: string
  created_at: string
}

export interface Payment {
  id: string
  booking_id: string
  user_id: string
  amount_cents: number
  currency: string
  status: string
  stripe_payment_id?: string
  created_at: string
}

export interface Invoice {
  id: string
  booking_id: string
  user_id: string
  invoice_number: string
  amount_cents: number
  created_at: string
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: 'user' | 'admin'
      image?: string | null
    }
  }

  interface User {
    role: 'user' | 'admin'
  }
}


