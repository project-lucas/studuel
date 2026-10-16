import Link from 'next/link'
import { Check, ChevronRight, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gesteFait, type Geste } from '@/lib/examen/onglet'

/**
 * « QU’EST-CE QUE JE FAIS ? » — les trois gestes de la semaine (maquette 1),
 * qui se COCHENT TOUT SEULS quand le travail est fait (leçons lues, quiz,
 * sujet tombé, épreuve blanche : lib/examen/onglet). Réservé à Studuel+ : le
 * gratuit voit le plan flouté sous un sceau d’or (maquette 8).
 */
export default function GestesSemaine({ gestes, ouvert }: { gestes: Geste[]; ouvert: boolean }) {
  const faits = gestes.filter(gesteFait).length
  const liste = (
    <ul>
      {gestes.map((g, i) => {
        const fait = gesteFait(g)
        return (
          <li key={g.texte} className={cn(i > 0 && 'border-secondary border-t-[1.5px]')}>
            <Link
              href={g.href}
              tabIndex={ouvert ? undefined : -1}
              className="flex min-h-12 items-center gap-2.5 py-1.5 active:opacity-80"
            >
              <span
                className={cn(
                  'grid size-6 shrink-0 place-items-center rounded-lg border-2',
                  fait ? 'border-success bg-success text-white' : 'border-[color-mix(in_oklch,var(--primary),white_65%)]',
                )}
              >
                {fait ? <Check aria-hidden="true" className="size-4" strokeWidth={3.2} /> : null}
              </span>
              <span className={cn('min-w-0 flex-1 text-[13px] leading-snug font-bold', fait && 'text-muted-foreground line-through decoration-[color-mix(in_oklch,var(--primary),white_60%)]')}>
                {g.texte}
                {g.mesure && !fait && g.mesure.cible > 1 ? (
                  <span className="text-primary ml-1.5 text-[11px] font-extrabold no-underline">
                    {g.mesure.fait}/{g.mesure.cible}
                  </span>
                ) : null}
              </span>
              {!fait ? <ChevronRight aria-hidden="true" className="text-primary/40 size-5 shrink-0" strokeWidth={2.6} /> : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <section className="carte relative overflow-hidden p-3.5" aria-labelledby="examen-semaine">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="examen-semaine" className="font-heading text-[17px] font-extrabold">
          Cette semaine
        </h2>
        {ouvert ? (
          <span className="text-muted-foreground text-[11.5px] font-extrabold">
            {faits}/{gestes.length} · se coche tout seul
          </span>
        ) : null}
      </div>
      {ouvert ? (
        liste
      ) : (
        <>
          <div aria-hidden="true" className="pointer-events-none opacity-50 blur-[3px] select-none">
            {liste}
          </div>
          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="bg-card max-w-[16rem] rounded-2xl p-3 text-center shadow-[0_10px_24px_-14px_rgba(43,22,80,.6)] ring-2 ring-[color-mix(in_oklch,var(--highlight),white_35%)]">
              <p className="font-heading flex items-center justify-center gap-1.5 text-[15px] font-extrabold">
                <Crown aria-hidden="true" className="fill-highlight text-accent-foreground size-4" />
                Ton plan jusqu’au jour J
              </p>
              <p className="text-muted-foreground text-[11.5px] leading-snug font-semibold">
                Trois gestes par semaine, ton dossier d’oral, les oraux blancs.
              </p>
              <Link
                href="/plus"
                className="font-heading bg-highlight text-accent-foreground mt-2 flex min-h-10 items-center justify-center rounded-xl px-3 text-[14px] font-extrabold shadow-[0_3px_0_color-mix(in_oklch,var(--highlight),black_30%)] active:translate-y-px"
              >
                Débloquer avec Studuel+
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
