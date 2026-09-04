import {
  OBJECTIF_HEBDO_SECONDES,
  formatDuree,
  hauteursBarres,
  type SemaineTravail,
} from '@/lib/moi/temps'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// TON RYTHME — huit semaines en barres.
//
// La courbe d'avant était plate pour la plupart des élèves, et une courbe
// plate dit « rien » là où une barre qui manque dit « cette semaine-là, non ».
// Huit barres, la semaine courante allumée et étiquetée, et l'objectif
// hebdomadaire en pointillé doré : on voit d'un coup d'œil les semaines tenues
// et celle qu'on est en train de tenir. Rendu par le serveur, aucun état.
// -----------------------------------------------------------------------------

function libelleSemaine(lundi: string, courante: boolean): string {
  if (courante) return 'Cette sem.'
  const [, m, d] = lundi.split('-')
  return `${d}/${m}`
}

export default function RythmeBarres({
  semaines,
  phrase,
}: {
  semaines: readonly SemaineTravail[]
  /** La phrase du rythme (lib/moi/temps), sous le titre. */
  phrase: string
}) {
  if (semaines.length === 0) return null
  const { hauteurs, objectifPct } = hauteursBarres(semaines, OBJECTIF_HEBDO_SECONDES)
  const derniere = semaines.length - 1

  return (
    <section aria-label="Ton rythme" className="moi-bloc rounded-[22px] p-4">
      <h2 className="font-heading text-base leading-tight font-extrabold">Ton rythme</h2>
      <p className="moi-sourcil mt-0.5">{phrase}</p>

      <div className="relative mt-6 h-[84px]">
        {/* L'objectif : une ligne, pas une consigne. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 border-t-[1.5px] border-dashed border-highlight text-right text-[9px] font-extrabold text-[color-mix(in_oklch,var(--highlight),black_45%)]"
          style={{ top: `${100 - objectifPct}%` }}
        >
          <span className="relative -top-3.5">objectif {formatDuree(OBJECTIF_HEBDO_SECONDES)} / sem.</span>
        </div>
        <ul
          role="list"
          className="absolute inset-0 grid items-end gap-1.5"
          style={{ gridTemplateColumns: `repeat(${semaines.length}, minmax(0, 1fr))` }}
        >
          {semaines.map((s, i) => {
            const courante = i === derniere
            return (
              <li
                key={s.lundi}
                className={cn(
                  'relative rounded-t-md rounded-b-[3px]',
                  courante ? 'moi-barre--courante' : 'bg-secondary',
                )}
                style={{ height: `${Math.max(4, hauteurs[i])}%` }}
                aria-label={`${libelleSemaine(s.lundi, courante)} : ${formatDuree(s.secondes)}`}
              >
                {courante && s.secondes > 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded-md bg-foreground px-1.5 py-0.5 text-[9px] font-extrabold whitespace-nowrap text-background"
                  >
                    {formatDuree(s.secondes)}
                  </span>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
      <ol
        className="mt-1.5 grid text-center text-[9px] font-extrabold text-muted-foreground"
        style={{ gridTemplateColumns: `repeat(${semaines.length}, minmax(0, 1fr))` }}
      >
        {semaines.map((s, i) => (
          <li key={s.lundi} className={cn(i === derniere && 'text-foreground')}>
            {libelleSemaine(s.lundi, i === derniere)}
          </li>
        ))}
      </ol>
    </section>
  )
}
