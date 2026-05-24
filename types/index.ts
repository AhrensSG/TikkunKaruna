export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'user' | 'admin'
  createdAt: Date
}

export interface Therapy {
  id: string
  title: string
  description: string
  duration: number
  price: number
  image?: string
  requirements?: string
  isActive: boolean
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
