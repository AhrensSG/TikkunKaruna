"use client"

import { useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

interface CalendarProps {
  year: number
  month: number
  selectedDate: string | null
  onSelect: (date: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  availableDates?: string[]
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

export default function Calendar({ year, month, selectedDate, onSelect, onPrevMonth, onNextMonth, availableDates = [] }: CalendarProps) {
  const days = useMemo(() => {
    const first = new Date(year, month - 1, 1)
    const last = new Date(year, month, 0)
    const startPad = (first.getDay() + 6) % 7 // 0 = Monday
    const total = last.getDate()
    return { startPad, total }
  }, [year, month])

  const today = useMemo(() => {
    const d = new Date()
    return toDateStr(d.getFullYear(), d.getMonth() + 1, d.getDate())
  }, [])

  const monthName = new Date(year, month - 1).toLocaleDateString("es-ES", { month: "long", year: "numeric" })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onPrevMonth}
          className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-500 hover:text-purple-700 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-semibold text-gray-900 capitalize">{monthName}</span>
        <button
          type="button"
          onClick={onNextMonth}
          className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-500 hover:text-purple-700 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">
            {d}
          </div>
        ))}

        {Array.from({ length: days.startPad }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {Array.from({ length: days.total }).map((_, i) => {
          const day = i + 1
          const dateStr = toDateStr(year, month, day)
          const isSelected = selectedDate === dateStr
          const isPast = dateStr < today && dateStr !== selectedDate
          const isToday = dateStr === today
          const isAvailable = availableDates?.includes(dateStr)

          return (
            <button
              key={day}
              type="button"
              onClick={() => !isPast && onSelect(dateStr)}
              disabled={isPast}
              className={`relative text-center text-sm py-2 rounded-lg transition-colors ${
                isSelected
                  ? "bg-purple-600 text-white font-semibold"
                  : isToday
                    ? "bg-purple-100 text-purple-700 font-semibold"
                    : isPast
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-purple-50 text-gray-700"
              }`}
            >
              {day}
              {isAvailable && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
