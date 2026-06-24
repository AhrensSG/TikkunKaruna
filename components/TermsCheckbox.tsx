interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function TermsCheckbox({ checked, onChange }: Props) {
  return (
    <label className="flex items-start gap-3 cursor-pointer bg-white rounded-xl border border-gray-200 p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 accent-gold-500 shrink-0"
      />
      <span className="text-xs text-gray-600 font-body leading-relaxed">
        He leído y acepto los{" "}
        <a href="/terminos" target="_blank" className="text-purple-700 hover:text-purple-900 underline font-medium">
          Términos y condiciones
        </a>{" "}
        y la{" "}
        <a href="/privacidad" target="_blank" className="text-purple-700 hover:text-purple-900 underline font-medium">
          Política de privacidad
        </a>{" "}
        de TikkunKaruna.
      </span>
    </label>
  )
}
