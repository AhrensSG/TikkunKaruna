"use client"

import { useState } from "react"
import { Sparkles, Clock, Euro, ArrowRight, Check } from "lucide-react"

const therapies = [
  {
    id: "1",
    title: "Reiki",
    description: "Canalización de energía universal para restaurar el equilibrio físico, emocional y espiritual.",
    duration: 60,
    price: 50,
  },
  {
    id: "2",
    title: "Sanación Emocional",
    description: "Acompañamiento terapéutico para liberar bloqueos y sanar heridas del pasado.",
    duration: 75,
    price: 65,
  },
  {
    id: "3",
    title: "Meditación Guiada",
    description: "Sesiones de meditación para conectar con tu interior y encontrar paz mental.",
    duration: 45,
    price: 40,
  },
  {
    id: "4",
    title: "Terapia Energética",
    description: "Limpieza y armonización de campos energéticos para recuperar tu vitalidad.",
    duration: 60,
    price: 55,
  },
]

const timeSlots = [
  "10:00", "11:00", "12:00", "16:00", "17:00", "18:00", "19:00",
]

const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export default function BookPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedTherapy, setSelectedTherapy] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const therapy = therapies.find((t) => t.id === selectedTherapy)

  const handleNext = () => {
    if (step === 1 && selectedTherapy) setStep(2)
    else if (step === 2 && selectedDate && selectedTime) setStep(3)
  }

  const handleConfirm = () => {
    // api.post('/bookings', { therapyId: selectedTherapy, date: selectedDate, time: selectedTime })
    setStep(1)
    setSelectedTherapy(null)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reservar Terapia</h1>
        <p className="text-gray-500 text-sm mt-1">Elige tu terapia, fecha y horario.</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 text-sm">
        {["Terapia", "Fecha y hora", "Confirmar"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === i + 1
                  ? "bg-purple-600 text-white"
                  : step > i + 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > i + 1 ? <Check size={13} /> : i + 1}
            </div>
            <span className={step === i + 1 ? "text-gray-900 font-medium" : "text-gray-400"}>{label}</span>
            {i < 2 && <ArrowRight size={14} className="text-gray-300 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step 1: Select therapy */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {therapies.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTherapy(t.id)}
              className={`text-left bg-white rounded-xl border p-5 transition-all ${
                selectedTherapy === t.id
                  ? "border-purple-500 ring-2 ring-purple-200"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <h3 className="font-semibold text-gray-900">{t.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                <span className="flex items-center gap-1"><Clock size={12} />{t.duration} min</span>
                <span className="flex items-center gap-1"><Euro size={12} />{t.price} €</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Date & time */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar placeholder */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Selecciona un día</h3>
            <div className="grid grid-cols-6 gap-2">
              {days.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}
              {Array.from({ length: 30 }).map((_, i) => {
                const date = i + 1
                const isSelected = selectedDate === String(date)
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(String(date))}
                    className={`text-center text-sm py-2 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-purple-600 text-white"
                        : "hover:bg-purple-50 text-gray-700"
                    }`}
                  >
                    {date}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time slots */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Selecciona un horario</h3>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`text-sm py-2 rounded-lg transition-colors ${
                    selectedTime === time
                      ? "bg-purple-600 text-white"
                      : "hover:bg-purple-50 text-gray-700 border border-gray-200"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && therapy && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg mx-auto">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Sparkles size={24} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{therapy.title}</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Fecha</span>
              <span className="font-medium text-gray-900">Junio {selectedDate}, 2026</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Horario</span>
              <span className="font-medium text-gray-900">{selectedTime}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Duración</span>
              <span className="font-medium text-gray-900">{therapy.duration} min</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-lg text-purple-700">{therapy.price} €</span>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(2)}
              className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Atrás
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              Confirmar y pagar
            </button>
          </div>
        </div>
      )}

      {/* Navigation buttons for steps 1 & 2 */}
      {(step === 1 || step === 2) && (
        <div className="flex justify-between">
          <button
            onClick={() => step === 2 ? setStep(1) : null}
            className={`text-sm text-gray-500 hover:text-gray-700 ${step === 1 ? "invisible" : ""}`}
          >
            ← Atrás
          </button>
          <button
            onClick={handleNext}
            disabled={step === 1 ? !selectedTherapy : !selectedDate || !selectedTime}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Continuar <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  )
}
