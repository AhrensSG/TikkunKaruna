import Link from "next/link"

interface Crumb {
  label: string
  href?: string
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <ol className="flex items-center gap-1.5 text-xs text-purple-400 font-body">
        <li>
          <Link href="/" className="hover:text-gold-500 transition-colors">
            Inicio
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span className="text-purple-300">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-gold-500 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-purple-200" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
