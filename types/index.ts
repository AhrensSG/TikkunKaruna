export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'user' | 'admin'
  created_at: string
}

export interface Therapy {
  id: string
  name: string
  subtitle: string
  description: string
  duration_minutes: number
  price_cents: number
  is_active: boolean
  image_url: string
  category: 'pendulo_hebreo' | 'reiki' | 'combinado'
  modality: 'distancia' | 'presencial'
  is_pack: boolean
  session_count: number
  prerequisite_id: string | null
  sort_order: number
  tag: string
  video_url: string
  created_at: string
}

export interface TherapyWithDetails extends Therapy {
  prerequisite_name: string | null
  indications: string[]
}

export interface Booking {
  id: string
  userId: string
  therapyId: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: Date
}

export interface Payment {
  id: string
  bookingId: string
  userId: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  stripePaymentId?: string
  createdAt: Date
}

export interface Invoice {
  id: string
  bookingId: string
  userId: string
  invoiceNumber: string
  pdfUrl?: string
  amount: number
  createdAt: Date
}

export interface ScheduleSlot {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface BlockedDate {
  date: string
  reason?: string
}

export interface BlockedTime {
  date: string
  time: string
  reason?: string
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


