import Image from "next/image";

/**
 * LogoMark — Medallón circular con LogoC.png.
 *
 * LogoC tiene un margen transparente exterior alrededor del anillo dorado.
 * Con overflow-hidden + scale-[1.08] ese margen queda fuera del clip circular,
 * dejando el anillo dorado como borde visual exacto del medallón.
 *
 * Los anillos CSS exteriores añaden profundidad decorativa.
 */

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const config: Record<Size, { circle: string; rings: boolean }> = {
  xs: { circle: "w-9 h-9",   rings: false },
  sm: { circle: "w-12 h-12", rings: false },
  md: { circle: "w-20 h-20", rings: true  },
  lg: { circle: "w-32 h-32", rings: true  },
  xl: { circle: "w-44 h-44", rings: true  },
};

interface LogoMarkProps {
  size?: Size;
  className?: string;
  priority?: boolean;
}

export default function LogoMark({
  size = "md",
  className = "",
  priority = false,
}: LogoMarkProps) {
  const { circle, rings } = config[size];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>

      {/* ── Halo de luz dorada ── */}
      <div
        aria-hidden
        className="absolute rounded-full bg-gold-400/20 blur-2xl pointer-events-none"
        style={{ inset: "-50%" }}
      />

      {rings && (
        <>
          {/* Anillo exterior decorativo */}
          <div
            aria-hidden
            className="absolute rounded-full border border-gold-400/25 pointer-events-none"
            style={{ inset: "-14%" }}
          />
          {/* Anillo intermedio */}
          <div
            aria-hidden
            className="absolute rounded-full border border-gold-500/40 pointer-events-none"
            style={{ inset: "-6%" }}
          />
        </>
      )}

      {/* ── Círculo principal: recorta el PNG al anillo dorado ── */}
      <div
        className={`relative ${circle} rounded-full overflow-hidden shadow-xl shadow-purple-950/30`}
      >
        <Image
          src="/LogoC.png"
          alt="TikkunKaruna"
          fill
          sizes="(max-width: 768px) 20vw, 10vw"
          className="object-cover scale-[1.08]"
          priority={priority}
        />
      </div>
    </div>
  );
}
