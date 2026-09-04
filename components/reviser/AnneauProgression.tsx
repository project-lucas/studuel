import { cn } from '@/lib/utils'

/**
 * L'ANNEAU D'AVANCEMENT DE LA MATIÈRE — le pourcentage, en grand, dans le
 * header du dossier.
 *
 * Il se lisait en « · 1% » au bout d'une ligne grise de 14 px : un élève qui
 * a passé des heures sur une matière ne voyait rien changer à l'écran. Le
 * chiffre prend un anneau de 64 px qui se remplit en jaune solaire (la couleur
 * de la progression partout dans l'app), à côté du titre : c'est la première
 * chose qui bouge quand on travaille.
 *
 * Décoratif pour les lecteurs d'écran : la barre du header porte déjà le
 * `role="progressbar"` et le même nombre.
 */
export default function AnneauProgression({
  pct,
  size = 64,
  className,
}: {
  /** 0..100 */
  pct: number
  size?: number
  className?: string
}) {
  const valeur = Math.max(0, Math.min(100, Math.round(pct)))
  const epaisseur = 6
  const rayon = (size - epaisseur) / 2
  const circonference = 2 * Math.PI * rayon
  const decalage = circonference * (1 - valeur / 100)

  return (
    <span
      className={cn(
        'relative grid shrink-0 place-items-center',
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={rayon}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={epaisseur}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={rayon}
          fill="none"
          stroke="var(--highlight)"
          strokeWidth={epaisseur}
          strokeLinecap="round"
          strokeDasharray={circonference}
          strokeDashoffset={decalage}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="font-heading text-sm leading-none font-extrabold tabular-nums">
        {valeur} %
      </span>
    </span>
  )
}
