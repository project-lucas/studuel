'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { BarChart3, Crown } from 'lucide-react'
import SubjectIcon from '@/components/SubjectIcon'
import { Button } from '@/components/ui/button'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import {
  hauteursColonnes,
  libelleQuestions,
  nomCourtMatiere,
  type MatiereRevisee,
} from '@/lib/moi/matieres-revisees'
import { subjectVignette } from '@/lib/subject-style'
import { sfx } from '@/lib/sounds'
import styles from '@/components/moi/MatieresRevisees.module.css'

// -----------------------------------------------------------------------------
// TES MATIÈRES — les matières que je révise le plus, en colonnes qui poussent
// (Lucas, 24/09/2026 : « une succession de colonnes, placées comme le bloc
// Mon rythme mais sur chaque matière, pour voir les matières que je révise le
// plus » ; « design Clash Royale, Brawl Stars friendly »). Il a pris la place
// de « Ton rythme » dans l'onglet Progrès ; le rythme est devenu une icône en
// haut de la carte (BoutonRythme).
//
// Une colonne par matière révisée, de la plus travaillée à la moins
// travaillée, haute de ses QUESTIONS travaillées (lib/moi/matieres-revisees).
// La valeur sur chaque chapiteau, la couronne sur la première, le médaillon
// et le nom au pied. Toucher une colonne l'allume et dit son détail — les
// questions et les séances — sous le graphique ; au départ, c'est la première.
// -----------------------------------------------------------------------------

/** Au-delà, la rangée défile de côté (390 px de large). */
const COLONNES_VISIBLES = 6

/** Écart entre deux colonnes qui poussent, à l'ouverture. */
const DECALAGE_MS = 70

export default function MatieresRevisees({ matieres }: { matieres: readonly MatiereRevisee[] }) {
  const titreId = useId()
  const [choisie, setChoisie] = useState<string | null>(null)
  // L'onglet reste monté : on le retrouve sur la colonne de tête.
  useFermeAuMasquage(setChoisie, null)

  const hauteurs = hauteursColonnes(matieres)
  const total = matieres.reduce((s, m) => s + m.questions, 0)
  const active = matieres.find((m) => m.subjectId === choisie) ?? matieres[0] ?? null

  return (
    <section aria-labelledby={titreId} className="carte p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
          <BarChart3 className="size-5" strokeWidth={2.4} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={titreId} className="titre-section">
            Tes matières
          </h2>
          {total > 0 ? <p className="surtitre mt-0.5">{libelleQuestions(total)} travaillées</p> : null}
        </div>
      </div>

      {matieres.length === 0 ? (
        <div className="mt-3 flex items-center gap-3">
          <p className="min-w-0 flex-1 text-sm font-semibold text-muted-foreground">
            Révise une matière&nbsp;: sa colonne poussera ici.
          </p>
          <Button asChild size="sm" className="shrink-0">
            <Link href="/reviser">Réviser</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.scene} data-defile={matieres.length > COLONNES_VISIBLES || undefined}>
            <ol aria-label="Questions travaillées par matière" className={styles.colonnes}>
              {matieres.map((m, i) => {
                const estActive = active?.subjectId === m.subjectId
                const vignette = subjectVignette(m.slug)
                return (
                  <li key={m.subjectId} className={styles.colonne} data-choisie={estActive || undefined}>
                    <button
                      type="button"
                      onClick={() => {
                        sfx.tap()
                        setChoisie(m.subjectId)
                      }}
                      aria-pressed={estActive}
                      aria-label={`${m.nom} : ${libelleQuestions(m.questions)}, ${m.seances} séance${m.seances > 1 ? 's' : ''}`}
                      className={styles.piste}
                    >
                      {i === 0 ? <Crown aria-hidden="true" strokeWidth={2.2} className={styles.couronne} /> : null}
                      <span aria-hidden="true" className={styles.valeur} style={{ animationDelay: `${i * DECALAGE_MS + 450}ms` }}>
                        {m.questions}
                      </span>
                      <span className={styles.fut} aria-hidden="true">
                        <span
                          className={styles.barre}
                          style={{ height: `${hauteurs[i]}%`, animationDelay: `${i * DECALAGE_MS}ms` }}
                        />
                      </span>
                    </button>
                    <span aria-hidden="true" className={styles.medaillon}>
                      {vignette ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={vignette} alt="" width={64} height={64} className="size-7 object-contain" />
                      ) : (
                        <SubjectIcon slug={m.slug} className="size-5 text-primary" strokeWidth={2.4} aria-hidden="true" />
                      )}
                    </span>
                    <span aria-hidden="true" className={styles.nom}>
                      {nomCourtMatiere(m.slug, m.nom)}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Le détail de la colonne allumée. */}
          {active ? (
            <p aria-live="polite" className="mt-3 rounded-full bg-primary/10 px-3 py-1.5 text-center text-xs font-bold text-foreground/85">
              <strong className="font-extrabold text-foreground">{active.nom}</strong> · {libelleQuestions(active.questions)} ·{' '}
              {active.seances}&nbsp;séance{active.seances > 1 ? 's' : ''}
            </p>
          ) : null}
        </>
      )}
    </section>
  )
}
