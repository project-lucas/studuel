import Link from 'next/link'
import { ChevronRight, Moon, Play, Sun, Sunset } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  planDuControle,
  quandEnMots,
  tonPreparation,
  type ControleBureau,
  type Seance,
} from '@/lib/coach/bureau'
import BoutonProposer from './BoutonProposer'

const TON_TEXTE = { success: 'text-success', warning: 'text-warning', destructive: 'text-destructive' } as const
const ICONE_PALIER = { complet: Sun, moyen: Sunset, express: Moon } as const

/**
 * L’onglet « Aujourd’hui » : UNE action d’abord (la critique du 16/10/2026 :
 * « aucune action unique en tête — trois puces de durée et trois gestes de
 * même poids »). Le premier geste est le gros bouton ; les suivants se lisent
 * en dessous, plus petits ; la durée du soir (15, 10 puis 5 minutes selon
 * l’heure — lib/coach/bureau) tient dans une pastille. Puis le contrôle qui
 * vient et son plan. Offert à tous : rien ici n’appelle le modèle, sauf
 * « Interroge-moi », réservé à Studuel+.
 */
export default function PanneauAujourdhui({
  seance,
  controle,
  aujourdhui,
  ouvert,
}: {
  seance: Seance
  controle: ControleBureau | null
  aujourdhui: string
  ouvert: boolean
}) {
  const [premier, ...ensuite] = seance.gestes
  const IconePalier = ICONE_PALIER[seance.palier]

  return (
    <div className="space-y-2.5">
      <section className="carte p-3.5" aria-labelledby="bureau-seance">
        <div className="flex items-center justify-between gap-2">
          <h2 id="bureau-seance" className="font-heading text-[17px] font-extrabold">
            {seance.palier === 'express' ? 'Ta séance express' : 'Ta séance du jour'}
          </h2>
          <span className="bg-secondary text-primary inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-extrabold">
            <IconePalier aria-hidden="true" className="size-3.5" strokeWidth={2.6} />
            {seance.minutes} min ce soir
          </span>
        </div>

        {premier ? (
          <>
            <Link
              href={premier.href}
              className="bg-primary text-primary-foreground mt-2.5 flex min-h-16 items-center gap-3 rounded-[20px] py-2 pr-2 pl-4 shadow-[0_5px_0_color-mix(in_oklch,var(--primary),black_28%)] transition active:translate-y-0.5 active:shadow-[0_3px_0_color-mix(in_oklch,var(--primary),black_28%)]"
            >
              <span className="min-w-0 flex-1">
                <span className="font-heading block text-[16px] leading-tight font-extrabold">{premier.titre}</span>
                <span className="block truncate text-[11.5px] font-bold opacity-85">{premier.detail}</span>
              </span>
              <span className="text-primary grid size-11 shrink-0 place-items-center rounded-full bg-white">
                <Play aria-hidden="true" className="size-5 translate-x-px" fill="currentColor" strokeWidth={0} />
              </span>
            </Link>

            {ensuite.length > 0 ? (
              <>
                <h3 className="text-muted-foreground mt-3 px-0.5 text-[11.5px] font-extrabold">Et ensuite</h3>
                <ul>
                  {ensuite.map((g, i) => (
                    <li key={g.cle} className={cn(i > 0 && 'border-secondary border-t-[1.5px]')}>
                      <Link href={g.href} className="flex min-h-12 items-center gap-2.5 py-1.5 active:opacity-80">
                        <span className="bg-secondary text-primary grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-extrabold">
                          {i + 2}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] leading-tight font-extrabold">{g.titre}</span>
                          <span className="text-muted-foreground block truncate text-[11px] font-semibold">{g.detail}</span>
                        </span>
                        <ChevronRight aria-hidden="true" className="text-primary/40 size-5 shrink-0" strokeWidth={2.6} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </>
        ) : (
          <div className="mt-2">
            <p className="text-muted-foreground text-[13px] font-semibold">
              Rien à rattraper aujourd’hui. Ça n’arrive pas souvent — savoure.
            </p>
            <Link href="/reviser" className="text-primary mt-1 inline-flex min-h-10 items-center gap-1 text-[13px] font-extrabold">
              Choisir un chapitre dans Réviser
              <ChevronRight aria-hidden="true" className="size-4" strokeWidth={2.6} />
            </Link>
          </div>
        )}

        {seance.reportes.length > 0 ? (
          <p className="border-primary/25 text-muted-foreground mt-2 rounded-xl border-2 border-dashed px-3 py-2 text-[11.5px] leading-snug font-bold">
            Demain, {seance.reportes.slice(0, 2).map((g) => g.titre.charAt(0).toLowerCase() + g.titre.slice(1)).join(' et ')} t’attendent. Pas ce soir.
          </p>
        ) : null}
      </section>

      {controle ? (
        <section className="carte p-3.5" aria-labelledby="bureau-controle">
          <h2 id="bureau-controle" className="font-heading text-[17px] leading-tight font-extrabold">
            Ton contrôle de {controle.matiere}
          </h2>
          <p className="text-muted-foreground text-[11.5px] font-bold">
            {quandEnMots(aujourdhui, controle.dans).replace(/^./, (l) => l.toUpperCase())} ·{' '}
            <b className={TON_TEXTE[tonPreparation(controle.pret)]}>prêt à {controle.pret} %</b>
          </p>
          <ol className="mt-2 grid grid-flow-col gap-1.5 [grid-auto-columns:minmax(0,1fr)]">
            {planDuControle(controle, aujourdhui).map((e) => (
              <li
                key={e.quand}
                className={cn(
                  'rounded-xl px-2 py-1.5 text-[11px] leading-snug font-bold',
                  e.maintenant ? 'bg-primary text-primary-foreground' : 'bg-secondary',
                )}
              >
                <b className={cn('block text-[11.5px] font-extrabold', !e.maintenant && 'text-primary')}>{e.quand}</b>
                <span className="line-clamp-2">{e.quoi}</span>
              </li>
            ))}
          </ol>
          <BoutonProposer
            mode="interroge"
            ouvert={ouvert}
            label={`Interroge-moi en ${controle.matiere}`}
            texte={`Interroge-moi sur ${controle.chapitres.slice(0, 3).join(', ') || controle.matiere}.`}
          />
        </section>
      ) : null}
    </div>
  )
}
