import { Award, Lock } from 'lucide-react'
import type { BadgeState } from '@/lib/badges'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// LES BADGES, ENFIN À LA VUE — onglet Collection de Moi (17/09/2026).
//
// Les badges n'apparaissaient qu'en dépliant le crayon de la carte, dans une
// galerie sombre faite pour l'édition : l'élève qui en avait gagné six ne les
// voyait jamais. Ils ont ici leur étagère, sur le crème, à côté des couronnes :
// gagnés d'abord, en couleur ; puis les suivants, grisés et cadenassés, avec
// leur condition en dessous — une collection montre ses cases vides.
//
// Composant serveur : aucun état. Mettre un badge en avant se fait toujours
// depuis le crayon de la carte.
// -----------------------------------------------------------------------------

export default function BadgesVitrine({
  badges,
  enAvant,
}: {
  badges: readonly BadgeState[]
  /** Les badges mis en avant sur la carte : une étoile les signale. */
  enAvant: readonly string[]
}) {
  if (badges.length === 0) return null
  const gagnes = badges.filter((b) => b.earned)
  const aVenir = badges.filter((b) => !b.earned)
  const ranges = [...gagnes, ...aVenir]

  return (
    <section aria-label="Tes badges" className="moi-bloc rounded-[22px] p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
          <Award className="size-5" strokeWidth={2.4} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-base leading-tight font-extrabold">Tes badges</h2>
          <p className="moi-sourcil mt-0.5">
            {gagnes.length === 0
              ? 'Le premier se gagne en jouant'
              : `${gagnes.length} gagné${gagnes.length > 1 ? 's' : ''} sur ${badges.length}`}
          </p>
        </div>
      </div>

      <ul role="list" className="mt-3 grid grid-cols-4 gap-2">
        {ranges.map((b) => (
          <li
            key={b.id}
            title={b.earned ? b.title : `${b.title} — ${b.description}`}
            className={cn(
              'relative flex aspect-square flex-col items-center justify-center gap-0.5 rounded-2xl p-1 text-center',
              b.earned
                ? 'bg-highlight/20 ring-2 ring-highlight/60'
                : 'border-2 border-dashed border-border',
            )}
          >
            <span
              aria-hidden="true"
              className={cn('text-[26px] leading-none', !b.earned && 'opacity-30 grayscale')}
            >
              {b.icon}
            </span>
            <span
              className={cn(
                'line-clamp-2 text-[9.5px] leading-tight font-extrabold',
                b.earned ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {b.title}
            </span>
            {b.earned ? (
              enAvant.includes(b.id) ? (
                <span
                  aria-label="mis en avant"
                  className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground shadow-sm"
                >
                  ★
                </span>
              ) : null
            ) : (
              <Lock
                className="absolute top-1.5 right-1.5 size-3 text-muted-foreground/70"
                strokeWidth={2.6}
                aria-label="à débloquer"
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
