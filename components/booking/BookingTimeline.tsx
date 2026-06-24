"use client"

import { Check } from "lucide-react"

interface Step {
  num: number
  label: string
  desc: string
}

export default function BookingTimeline({ steps, currentStep }: { steps: Step[]; currentStep: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentStep === s.num
                    ? "bg-purple-600 text-white ring-4 ring-purple-100"
                    : currentStep > s.num
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {currentStep > s.num ? <Check size={16} /> : s.num}
              </div>
              <span className={`text-xs mt-1.5 font-medium hidden sm:block ${currentStep === s.num ? "text-purple-700" : "text-gray-400"}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 mt-[-1.25rem] sm:mt-[-1.75rem] rounded-full ${
                currentStep > s.num ? "bg-green-400" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-center text-gray-400 mt-2 sm:hidden">
        Paso {currentStep} de {steps.length}: {steps[currentStep - 1]?.desc}
      </p>
    </div>
  )
}
