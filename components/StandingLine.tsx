import { cn } from '@/lib/utils'
import { standingLabel, type Standing } from '@/lib/percentile'

/**
 * La traduction d'un compteur en phrase lisible : « Top 2 % des 3e ».
 *
 * Purement présentationnel — toute la décision (quelle formulation, quel
 * arrondi, faut-il seulement parler) est prise par `lib/percentile.ts`, pur et
 * testé. Ici on ne fait que poser le texte.
 *
 * Ne rend RIEN quand il n'y a pas de place honnête à annoncer (cohorte
 * inconnue, élève non classé, migration 223 pas encore passée). C'est voulu :
 * l'app affiche une ligne de moins plutôt qu'un « top — % » qui interroge.
 *
 * Cadrage : docs/CADRAGE-PERCENTILE.md
 */
export default function StandingLine({
  standing,
  grade,
  className,
}: {
  standing: Standing
  /** Niveau de l'élève (« 3e ») — sert à nommer la cohorte. */
  grade: string | null | undefined
  className?: string
}) {
  const label = standingLabel(standing, grade)
  if (!label) return null

  // `rang` = petite cohorte : on annonce une place brute, pas un pourcentage.
  // Elle se dit sur un ton plus neutre, parce qu'elle n'est pas un exploit —
  // « 4e sur 61 » sur une poignée d'élèves ne vaut pas « top 2 % ».
  const sobre = standing.kind === 'rang'

  return (
    <p
      className={cn(
        'text-[0.7rem] leading-tight font-bold',
        sobre ? 'opacity-70' : null,
        className,
      )}
    >
      {label}
    </p>
  )
}
