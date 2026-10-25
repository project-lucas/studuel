'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import { CalendarRange, Star } from 'lucide-react'
import { cheminAnnale, libelleNature, type AnneeAnnales } from '@/lib/annales-corrigees/apercu'
import { MATIERES_ANNALES } from '@/lib/annales-corrigees/matieres'
import { phraseFrequence, poidsTheme, recapDesAnnales } from '@/lib/annales-corrigees/recap'
import SheetShell from '@/components/defi/SheetShell'
import { sfx } from '@/lib/sounds'

/**
 * LE RÉCAP DES SUJETS TOMBÉS (25/10/2026, Lucas) : une icône dans l'angle de
 * « Les sujets tombés, corrigés » ouvre un pop-up crème (le `SheetShell` de
 * l'arène, format popup) avec la FRISE année par année — chaque session, ses
 * thèmes, la nature de la partie — puis « Ce qui tombe le plus », du thème le
 * plus fréquent au plus rare, pour que l'élève priorise d'un coup d'œil.
 *
 * Tout se calcule dans `lib/annales-corrigees/recap.ts` depuis les aperçus que
 * l'onglet reçoit déjà : rien de plus ne descend dans le navigateur. Une session
 * de la frise mène à son annale (le sujet et le corrigé).
 */
export default function RecapAnnales({
  subject,
  annales,
}: {
  subject: { slug: string; name: string }
  annales: readonly AnneeAnnales[]
}) {
  const [ouvert, setOuvert] = useState(false)
  const reduce = useReducedMotion()
  const recap = recapDesAnnales(annales)
  if (recap.sessions === 0) return null

  function ouvrir() {
    sfx.tap()
    setOuvert(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={ouvrir}
        aria-label="Récap des sujets tombés par année"
        title="Ce qui est tombé, année par année"
        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-card text-primary shadow-carte ring-2 ring-primary/20 transition-transform hover:bg-secondary active:scale-95"
      >
        <CalendarRange className="size-5" strokeWidth={2.2} aria-hidden="true" />
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {ouvert ? (
                <SheetShell
                  label="Ce qui est tombé, année par année"
                  reduce={reduce}
                  onClose={() => setOuvert(false)}
                  format="popup"
                  header={
                    <>
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-xl border border-primary/15 bg-secondary text-primary"
                        aria-hidden="true"
                      >
                        <CalendarRange className="size-5" strokeWidth={2.2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="font-heading block truncate text-lg leading-tight font-extrabold text-foreground">
                          Ce qui est tombé
                        </span>
                        <span className="block truncate text-xs font-semibold text-muted-foreground">
                          {MATIERES_ANNALES[subject.slug as keyof typeof MATIERES_ANNALES]?.court ?? subject.name} · {recap.sessions} session{recap.sessions > 1 ? 's' : ''} corrigée
                          {recap.sessions > 1 ? 's' : ''}
                        </span>
                      </span>
                    </>
                  }
                >
                  <div className="flex flex-col gap-6 px-5 py-4">
                    <Frise subject={subject} recap={recap} onChoix={() => setOuvert(false)} />
                    <Frequents recap={recap} />
                  </div>
                </SheetShell>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  )
}

type Recap = ReturnType<typeof recapDesAnnales>

/** Année par année, la plus récente d'abord : le rail de la frise, un jeton par année. */
function Frise({ subject, recap, onChoix }: { subject: { slug: string }; recap: Recap; onChoix: () => void }) {
  return (
    <section aria-labelledby="recap-frise">
      <h3 id="recap-frise" className="titre-section mb-3">
        Année par année
      </h3>
      <ol className="ml-3 flex flex-col gap-4 border-l-[3px] border-primary/60 pl-5">
        {recap.annees.map((a) => (
          <li key={a.annee} className="relative">
            {/* Le jeton de l'année sur le rail : jaune cerclé d'encre, comme la frise d'une fiche. */}
            <span
              aria-hidden="true"
              className="absolute top-1 -left-[32px] size-4 rounded-full border-[2.5px] border-foreground bg-highlight"
            />
            <p className="font-heading text-lg leading-none font-extrabold text-primary">{a.annee}</p>
            <ul className="mt-2 flex flex-col gap-2.5">
              {a.sessions.map((s) => (
                <li key={s.id}>
                  <Link
                    href={cheminAnnale(subject.slug, s.id)}
                    onClick={() => {
                      sfx.tap()
                      onChoix()
                    }}
                    className="carte block px-3.5 py-2.5 transition-transform active:translate-y-px"
                  >
                    <span className="surtitre block">{s.lieu}</span>
                    <ul className="mt-1.5 flex flex-col gap-1">
                      {s.sujets.map((x, i) => (
                        <li key={i} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm leading-snug">
                          <span className="font-bold text-foreground">{x.theme}</span>
                          <span className="text-[10px] font-extrabold tracking-wide text-muted-foreground uppercase">
                            {libelleNature(x.nature)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** Du plus fréquent au plus rare : la barre dit la part des sessions où le thème est tombé. */
function Frequents({ recap }: { recap: Recap }) {
  return (
    <section aria-labelledby="recap-frequents">
      <h3 id="recap-frequents" className="titre-section mb-1">
        Ce qui tombe le plus
      </h3>
      <p className="mb-3 text-xs font-semibold text-muted-foreground">
        Un thème qui revient est un thème à réviser en premier.
      </p>
      <ol className="flex flex-col gap-2.5">
        {recap.frequents.map((f, i) => (
          <li key={f.theme} className="carte px-3.5 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="font-heading min-w-0 text-[15px] leading-snug font-extrabold text-foreground">{f.theme}</p>
              <span className="font-heading shrink-0 rounded-full bg-secondary px-2 py-0.5 text-sm leading-tight font-extrabold text-primary">
                ×{f.fois}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(poidsTheme(f.fois, recap.sessions) * 100)}%` }} />
            </div>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-muted-foreground">
              <span>{phraseFrequence(f.fois, recap.sessions)}</span>
              <span aria-hidden="true">·</span>
              <span>{f.annees.join(' · ')}</span>
              {i === 0 && f.fois > 1 ? (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-accent-foreground uppercase">
                  <Star className="size-3 fill-current" aria-hidden="true" />À réviser en premier
                </span>
              ) : null}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
