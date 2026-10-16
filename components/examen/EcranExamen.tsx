import Link from 'next/link'
import { ArrowRight, Clock, Crown, Mic, PenLine, Scale } from 'lucide-react'
import EnTetePage from '@/components/reviser/EnTetePage'
import { Button } from '@/components/ui/button'
import {
  PHASES,
  compteARebours,
  hrefRessource,
  libelleRessource,
  phaseDe,
  type Examen,
  type IdPhase,
  type ObjectifSemaine,
} from '@/lib/examen/parcours'
import { phraseAnnales } from '@/lib/annales-corrigees/acces'
import { cn } from '@/lib/utils'

/**
 * LE MODE EXAMEN (15/10/2026, Lucas : « il faut un mode examen dans la
 * formule : 3e, bac de français — prépa des oraux, de l'écrit —, terminale »).
 *
 * Quatre questions, dans l'ordre où l'élève se les pose :
 *   1. QUAND ? le compte à rebours, et la phase du chemin où il en est ;
 *   2. QUOI FAIRE CETTE SEMAINE ? trois gestes, chacun avec son lien — c'est
 *      « penser avant lui », sans un seul appel IA (lib/examen/parcours) ;
 *      réservé à Studuel+ : c'est le guide de l'abonnement ;
 *   3. À QUOI RESSEMBLE L'ÉPREUVE ? l'écrit ET l'oral, durée, coefficient,
 *      format, et où s'y entraîner ;
 *   4. LES ANNALES de ses matières d'examen, deux offertes par matière.
 *
 * Écran sans lecture : la page (app/examen) et l'aperçu (/dev/examen) lui
 * passent ses données.
 */

const ORDRE_PHASES: IdPhase[] = ['fondations', 'entrainement', 'sprint', 'derniers-jours']

export type AnnalesMatiere = { matiere: string; nom: string; n: number }

export default function EcranExamen({
  examen,
  jours,
  premium,
  objectifs,
  annales,
}: {
  examen: Examen | null
  jours: number
  premium: boolean
  objectifs: ObjectifSemaine[]
  annales: AnnalesMatiere[]
}) {
  if (!examen) {
    return (
      <div className="pb-10">
        <EnTetePage retour={{ fallback: '/reviser' }} titre="Mode examen" />
        <section className="carte mx-4 p-5 text-center">
          <h2 className="font-heading text-lg font-extrabold">Pas d’examen cette année</h2>
          <p className="text-muted-foreground mt-1 text-sm font-semibold text-balance">
            Le mode examen s’ouvre en 3e (le brevet), en 1re (le bac de français) et en Terminale (le bac). Cette
            année, chaque chapitre bien appris est déjà de l’avance.
          </p>
          <Button asChild size="lg" className="mt-4 w-full">
            <Link href="/reviser">Réviser</Link>
          </Button>
        </section>
      </div>
    )
  }

  const phase = phaseDe(jours)

  return (
    <div className="pb-10">
      <EnTetePage retour={{ fallback: '/reviser' }} titre="Mode examen" sousTitre={examen.nom} />

      <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-4">
        {/* 1. QUAND, ET OÙ J'EN SUIS */}
        <section aria-labelledby="examen-jour" className="carte-sombre rounded-carte p-5">
          <p className="surtitre text-highlight">{examen.nom}</p>
          <p id="examen-jour" className="font-heading mt-1 text-5xl leading-none font-extrabold tabular-nums">
            {compteARebours(jours)}
          </p>
          <p className="mt-1 text-sm font-semibold opacity-80">
            Vers {examen.periode} · la date officielle se publie à l’automne
          </p>
          <ol className="mt-4 grid grid-cols-4 gap-1.5" aria-label="Le chemin jusqu’au jour J">
            {ORDRE_PHASES.map((id) => (
              <li
                key={id}
                aria-current={id === phase.id ? 'step' : undefined}
                className={cn(
                  'rounded-xl px-1 py-2 text-center text-[10.5px] leading-tight font-extrabold',
                  id === phase.id ? 'bg-highlight text-accent-foreground' : 'bg-white/10',
                )}
              >
                {PHASES[id].court}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[13px] leading-snug font-semibold">{phase.regle}</p>
        </section>

        {/* 2. CETTE SEMAINE — le guide de Studuel+ */}
        <section aria-labelledby="semaine-titre">
          <h2 id="semaine-titre" className="titre-section mb-2 px-1">
            Cette semaine
          </h2>
          {premium ? (
            <ol className="flex flex-col gap-2">
              {objectifs.map((o, i) => (
                <li key={o.texte}>
                  <Link href={o.href} className="carte flex items-center gap-3 p-3.5 transition active:translate-y-px">
                    <span className="bg-primary text-primary-foreground font-heading grid size-8 shrink-0 place-items-center rounded-full text-sm font-extrabold">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 text-[13.5px] leading-snug font-bold">{o.texte}</span>
                    <ArrowRight aria-hidden="true" className="text-muted-foreground size-4 shrink-0" />
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <Link href="/plus" className="carte flex items-center gap-3 p-4 transition active:translate-y-px">
              <Crown aria-hidden="true" className="fill-highlight text-accent-foreground size-6 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="font-heading block text-[15px] font-extrabold">Ton plan de la semaine</span>
                <span className="text-muted-foreground block text-xs font-semibold">
                  Avec Studuel+, trois gestes par semaine, calculés sur ton travail, jusqu’au jour J.
                </span>
              </span>
              <ArrowRight aria-hidden="true" className="text-muted-foreground size-4 shrink-0" />
            </Link>
          )}
        </section>

        {/* 3. LES ÉPREUVES — l'écrit et l'oral */}
        <section aria-labelledby="epreuves-titre">
          <h2 id="epreuves-titre" className="titre-section mb-2 px-1">
            Les épreuves
          </h2>
          <ul className="flex flex-col gap-2.5">
            {examen.epreuves.map((e) => (
              <li key={e.id} className="carte p-4">
                <div className="flex items-center gap-2">
                  {e.nature === 'oral' ? (
                    <Mic aria-hidden="true" className="text-primary size-4 shrink-0" />
                  ) : (
                    <PenLine aria-hidden="true" className="text-primary size-4 shrink-0" />
                  )}
                  <h3 className="font-heading min-w-0 flex-1 text-[16px] leading-tight font-extrabold">{e.titre}</h3>
                  <span className="bg-secondary text-primary rounded-full px-2 py-0.5 text-[10.5px] font-extrabold">
                    {e.nature === 'oral' ? 'Oral' : 'Écrit'}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Clock aria-hidden="true" className="size-3.5" />
                    {e.duree}
                  </span>
                  {e.coefficient ? (
                    <span className="inline-flex items-center gap-1">
                      <Scale aria-hidden="true" className="size-3.5" />
                      Coefficient {e.coefficient}
                    </span>
                  ) : null}
                </p>
                <ul className="mt-2 space-y-1">
                  {e.format.map((f) => (
                    <li key={f} className="text-[13px] leading-snug font-semibold">
                      · {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {e.ressources.map((r) => (
                    <Link
                      key={hrefRessource(r)}
                      href={hrefRessource(r)}
                      className="bg-secondary text-primary inline-flex min-h-9 items-center rounded-full px-3 text-[11.5px] font-extrabold"
                    >
                      {libelleRessource(r)}
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. LES ANNALES */}
        {annales.length > 0 ? (
          <section id="annales" aria-labelledby="annales-titre" className="scroll-mt-24">
            <h2 id="annales-titre" className="titre-section mb-2 px-1">
              Les annales corrigées
            </h2>
            <ul className="flex flex-col gap-2">
              {annales.map((a) => (
                <li key={a.matiere}>
                  <Link
                    href={`/reviser/${a.matiere}?onglet=annales`}
                    className="carte flex items-center gap-3 p-3.5 transition active:translate-y-px"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="font-heading block text-[15px] font-extrabold">{a.nom}</span>
                      <span className="text-muted-foreground block text-xs font-semibold">{phraseAnnales(a.n, premium)}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className="text-muted-foreground size-4 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  )
}
