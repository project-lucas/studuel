import { Check } from 'lucide-react'
import type { SeanceEtape } from '@/lib/coach/regimes'

// Les trois temps de la séance, dans l'ordre du régime. C'est le « comment »
// qui distingue Marcel d'une file de révisions : la même durée ne se dépense pas
// de la même façon en maths et en histoire.
//
// Aucun état ici — le suivi d'exécution appartient à Réviser, qui lance la
// session. Marcel annonce le plan, il ne le pointe pas.

export default function SeanceCard({
  etapes,
  minutes,
}: {
  etapes: SeanceEtape[]
  minutes: number
}) {
  if (etapes.length === 0) return null

  return (
    <section className="mt-3">
      <header className="mx-0.5 mb-1.5 flex items-center justify-between">
        <h3 className="font-heading text-[15px] font-extrabold">
          Ta séance, dans l’ordre
        </h3>
        <span className="text-muted-foreground text-xs font-extrabold">
          {minutes} min
        </span>
      </header>

      <ol className="bg-card relative rounded-[20px] p-3 shadow-[0_2px_0_rgba(36,48,79,.06),0_14px_26px_-22px_rgba(36,48,79,.9)]">
        {/* Le fil qui relie les trois temps : ils se suivent, ils ne sont pas
            trois options au choix. */}
        <span
          aria-hidden="true"
          className="from-primary absolute top-8 bottom-8 left-[27px] w-0.5 rounded-full bg-gradient-to-b to-[color-mix(in_oklch,var(--primary),transparent_82%)]"
        />

        {etapes.map((etape, index) => (
          <li key={etape.key} className="relative flex items-center gap-3 py-1.5">
            <span
              className={
                index === 0
                  ? 'from-primary relative z-10 grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-b to-[color-mix(in_oklch,var(--primary),black_22%)] text-sm font-extrabold text-white shadow-[0_3px_8px_-3px_color-mix(in_oklch,var(--primary),transparent_10%)]'
                  : 'relative z-10 grid size-8 shrink-0 place-items-center rounded-xl bg-[#f3eee1] text-sm font-extrabold text-[#7b6539] shadow-[inset_0_0_0_1.5px_rgba(36,48,79,.06)]'
              }
            >
              {index === 0 ? <Check aria-hidden="true" className="size-4" /> : index + 1}
            </span>

            <span className="min-w-0 flex-1">
              <b className="block text-[13.5px] leading-tight font-extrabold">
                {etape.title}
              </b>
              <span className="text-muted-foreground text-xs font-semibold">
                {etape.hint}
              </span>
            </span>

            <span className="text-muted-foreground rounded-full bg-[#f4f0e6] px-2.5 py-1 text-xs font-extrabold">
              {etape.minutes} min
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
