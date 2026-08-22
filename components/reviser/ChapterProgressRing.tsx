import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * L'ANNEAU D'AVANCEMENT d'un chapitre du programme, posé dans son en-tête.
 *
 * POURQUOI IL EXISTE. L'en-tête ne disait où l'on en était que par « 0/6
 * fiches », en gris de 11 px sous le titre. Sur quatre chapitres empilés, cette
 * information ne se BALAYE pas : il faut la lire ligne par ligne. Et un
 * chapitre bouclé ressemblait exactement à un chapitre jamais ouvert, à un
 * chiffre près — la seule chose que l'élève cherche des yeux en arrivant.
 *
 * Deux états, et le second est le plus important : l'anneau se remplit en JAUNE
 * (la couleur de la progression dans toute l'app — la même que les barres du
 * header et de la barre collante), puis devient un DISQUE VIOLET À COCHE quand
 * le chapitre est fini. C'est exactement le traitement qu'une fiche terminée
 * reçoit sur sa propre ligne, deux centimètres plus bas : un chapitre fini et
 * une fiche finie se reconnaissent au même signe.
 *
 * Décoratif pour les lecteurs d'écran : l'en-tête annonce déjà « 2/6 fiches »
 * juste à côté, et l'entendre deux fois n'apprend rien.
 */
export default function ChapterProgressRing({
  done,
  total,
  className,
}: {
  done: number
  total: number
  className?: string
}) {
  if (total <= 0) return null
  const fait = Math.max(0, Math.min(done, total))
  const complete = fait >= total
  const ratio = fait / total

  // Repère 0→100 indépendant de la taille rendue : l'anneau reste net partout.
  const R = 44
  const CIRC = 2 * Math.PI * R

  if (complete) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm',
          className,
        )}
      >
        <Check className="size-5" strokeWidth={3} />
      </span>
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn('relative grid size-10 shrink-0 place-items-center', className)}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-black/10"
        />
        {ratio > 0 ? (
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="var(--highlight)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - ratio)}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        ) : null}
      </svg>
      <span
        className={cn(
          'font-heading relative text-sm font-extrabold tabular-nums',
          fait > 0 ? 'text-foreground' : 'text-foreground/35',
        )}
      >
        {fait}
      </span>
    </span>
  )
}
