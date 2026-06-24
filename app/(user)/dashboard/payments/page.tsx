"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function PaymentsPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/invoices")
  }, [router])

  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-purple-600" />
    </div>
  )
}
