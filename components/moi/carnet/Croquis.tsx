// -----------------------------------------------------------------------------
// LES CROQUIS DU CARNET — ce qui est « écrit à la main » sur les pages.
//
// Les dessins (flamme, trophée, bouclier…) sont des croquis Higgsfield à
// l'encre violette, détourés par scripts/moi-carnet.mjs. Les traits — éclats,
// soulignés, filets — sont des SVG au trait irrégulier, en `currentColor` :
// ils prennent l'encre de la page.
// -----------------------------------------------------------------------------

export type NomDoodle =
  | 'flamme'
  | 'trophee'
  | 'bouclier'
  | 'livre'
  | 'couronne'
  | 'medaille'
  | 'amis'
  | 'epees'
  | 'chrono'
  | 'courbe'
  | 'etoile'
  | 'laurier'

/** Un croquis à l'encre. Décoratif : le texte à côté dit la même chose. */
export function Doodle({ nom, className }: { nom: NomDoodle; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 5 à 12 Ko, servi tel quel (l'optimiseur n'ajouterait qu'un aller-retour)
    <img
      src={`/images/moi/carnet/doodle-${nom}.webp`}
      alt=""
      aria-hidden="true"
      draggable={false}
      width={160}
      height={160}
      className={className}
    />
  )
}

/** Trois petits traits qui rayonnent, comme on en griffonne autour d'un mot. */
export function Eclats({ className, sens = 'gauche' }: { className?: string; sens?: 'gauche' | 'droite' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={sens === 'droite' ? { transform: 'scaleX(-1)' } : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
    >
      <path d="M3.5 6.2 8.6 9.4" />
      <path d="M2.2 13.1 8.1 13.4" />
      <path d="M3.8 20.2 8.9 17.2" />
    </svg>
  )
}

/** Un trait de soulignement, appuyé au début, qui file en s'amincissant. */
export function Souligne({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 10" preserveAspectRatio="none" aria-hidden="true" className={className} fill="currentColor">
      <path d="M2 6.4C22 3.6 52 2.6 84 3.1c12 .2 23 .9 34 2.1.9.1.9 1.6 0 1.6-11-.6-22-.9-34-.9C52 6 23 7.3 3.4 9.1 1.2 9.3.4 6.7 2 6.4Z" />
    </svg>
  )
}

/** Un filet de crayon entre deux blocs d'une page : pas tout à fait droit. */
export function Filet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 6" preserveAspectRatio="none" aria-hidden="true" className={className} fill="none">
      <path
        d="M2 3.4c18-.9 34 .6 52-.2s36-1 52 .1c12 .8 22 .3 32-.4"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Un anneau tracé au crayon : la piste en lavis, l'avancée à l'encre. `part`
 * de 0 à 1 ; au-delà de 1, l'anneau est plein (le record est battu).
 */
export function AnneauCrayon({ part, className, children }: { part: number; className?: string; children?: React.ReactNode }) {
  const r = 40
  const tour = 2 * Math.PI * r
  const rempli = Math.max(0, Math.min(1, part))
  return (
    <span className={className}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeOpacity={0.16} strokeWidth={10} />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${tour * rempli} ${tour}`}
          transform="rotate(-90 50 50)"
        />
        {/* Le cerne au crayon, légèrement décalé : un anneau dessiné, pas tracé au compas. */}
        <circle cx="50.6" cy="49.4" r={r + 6.5} fill="none" stroke="currentColor" strokeOpacity={0.55} strokeWidth={1.4} />
        <circle cx="49.5" cy="50.5" r={r - 6.5} fill="none" stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.2} />
      </svg>
      {children}
    </span>
  )
}
