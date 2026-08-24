'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, CircleHelp, PenLine, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import {
  bilanDe,
  PALIER_LABEL,
  PALIERS,
  QUESTIONS,
  TROU,
  verdictNiveau,
  type Reponse,
} from '@/lib/francais/niveau-orthographe'
import { writeNiveau } from '@/lib/francais/niveau-store'

/**
 * « J'évalue mon niveau en orthographe » — les 9 phrases à trou, puis le score.
 *
 * TROIS ÉCRANS, et le premier n'est pas décoratif. La consigne « réponds Je ne
 * sais pas plutôt que deviner » est ce qui rend la mesure juste : elle doit
 * être lue AVANT, en grand, pas glissée en petit sous la première question.
 * Sans elle l'élève devine, décroche un tiers des points par hasard, et repart
 * avec un niveau surévalué — donc un entraînement trop dur, qu'il abandonne.
 *
 * AUCUNE CORRECTION EN COURS DE ROUTE. Le reste de l'app fait l'inverse (le
 * quiz dévoile à chaque réponse, c'est ce qui le rend vivant), et c'est
 * justement pour ça qu'il faut l'écrire ici : corriger pendant la mesure
 * apprendrait à l'élève au milieu du test, et une mesure qui modifie ce qu'elle
 * mesure ne mesure plus rien. Même doctrine que l'examen blanc.
 */
export default function NiveauOrthographe({ onClose }: { onClose: () => void }) {
  const [etape, setEtape] = useState<'intro' | 'test' | 'bilan'>('intro')
  const [index, setIndex] = useState(0)
  const [reponses, setReponses] = useState<Reponse[]>([])

  const question = QUESTIONS[index]
  const bilan = useMemo(() => bilanDe(reponses), [reponses])

  const repondre = (choix: Reponse) => {
    sfx.tap()
    const suite = [...reponses, choix]
    setReponses(suite)
    if (suite.length >= QUESTIONS.length) {
      const b = bilanDe(suite)
      sfx.complete()
      writeNiveau({
        pourcentage: b.pourcentage,
        niveau: b.niveau,
        // Clé de jour UTC `YYYY-MM-DD` — la convention de dates de tout le
        // projet (cf. CLAUDE.md), pour que la fraîcheur du résultat se compare
        // aux mêmes journées que la série et les quêtes.
        jour: new Date().toISOString().slice(0, 10),
      })
      setEtape('bilan')
      return
    }
    setIndex((i) => i + 1)
  }

  const recommencer = () => {
    sfx.tap()
    setReponses([])
    setIndex(0)
    setEtape('intro')
  }

  const retour = (
    <button
      type="button"
      onClick={() => {
        sfx.back()
        onClose()
      }}
      className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-semibold shadow-sm transition-transform active:scale-95"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Retour aux modes de jeu
    </button>
  )

  // ------------------------------------------------------------------ intro
  if (etape === 'intro') {
    return (
      <div>
        {retour}
        <div className="rounded-3xl bg-card p-6 text-center shadow-sm ring-1 ring-black/5">
          <span className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl">
            <PenLine className="size-7" aria-hidden="true" />
          </span>
          <h2 className="font-heading mt-4 text-xl font-bold text-balance">
            J’évalue mon niveau en orthographe
          </h2>
          <p className="mt-2 text-sm text-pretty text-muted-foreground">
            Neuf phrases à compléter, une règle chacune. Environ trois minutes.
          </p>

          {/* LA CONSIGNE QUI FAIT TOUT LE TEST. En clair, avant de commencer. */}
          <div className="bg-muted mt-5 rounded-2xl p-4 text-left">
            <p className="flex items-start gap-2.5 text-sm font-semibold text-balance">
              <CircleHelp
                className="text-primary mt-0.5 size-5 shrink-0"
                aria-hidden="true"
              />
              <span>
                Si tu ne sais pas, réponds «&nbsp;Je ne sais pas&nbsp;» plutôt
                que de deviner. Une réponse au hasard fausse ton niveau, et tu
                te retrouverais avec des exercices trop durs.
              </span>
            </p>
            <p className="mt-3 text-xs font-semibold text-muted-foreground">
              Aucune correction avant la fin : tu auras ton score et les règles à
              travailler d’un coup, à la dernière question.
            </p>
          </div>

          <Button
            size="lg"
            className="mt-6 w-full rounded-full font-bold"
            onClick={() => {
              sfx.tap()
              setEtape('test')
            }}
          >
            Commencer le test
          </Button>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------------ bilan
  if (etape === 'bilan') {
    const v = verdictNiveau(bilan)
    return (
      <div>
        {retour}
        <div className="rounded-3xl bg-card p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-center text-sm font-semibold text-muted-foreground">
            Ton niveau en orthographe
          </p>
          <p className="font-mono mt-1 text-center text-6xl font-bold tabular-nums">
            {bilan.pourcentage}
            <span className="text-2xl text-muted-foreground"> %</span>
          </p>
          <p className="mt-1 text-center text-sm font-semibold text-muted-foreground tabular-nums">
            {bilan.score} bonne{bilan.score > 1 ? 's' : ''} réponse
            {bilan.score > 1 ? 's' : ''} sur {bilan.total}
          </p>

          {/* Les trois paliers, franchis ou non : le pourcentage seul ne dit pas
              OÙ ça casse, et c'est la seule information qui commande la suite. */}
          <ul className="mt-5 flex flex-col gap-2">
            {PALIERS.map((p) => {
              const s = bilan.parPalier[p]
              const acquis =
                PALIERS.indexOf(p) <=
                (bilan.niveau ? PALIERS.indexOf(bilan.niveau) : -1)
              return (
                <li
                  key={p}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-2.5',
                    acquis ? 'bg-success/10' : 'bg-muted',
                  )}
                >
                  <span className="min-w-0 flex-1 text-sm font-semibold">
                    {PALIER_LABEL[p]}
                  </span>
                  <span
                    className={cn(
                      'font-heading shrink-0 text-sm font-extrabold tabular-nums',
                      acquis ? 'text-success' : 'text-muted-foreground',
                    )}
                  >
                    {s.bonnes}/{s.total}
                  </span>
                </li>
              )
            })}
          </ul>

          <div className="bg-muted mt-5 rounded-2xl p-4">
            <p className="font-heading font-bold">{v.titre}</p>
            <p className="mt-1 text-sm text-pretty text-muted-foreground">
              {v.message}
            </p>
            {/* Les trous se disent à part des erreurs : ils n'appellent pas le
                même travail, et l'élève qui a joué le jeu doit le voir. */}
            {bilan.sansReponse > 0 ? (
              <p className="mt-2 text-xs font-semibold text-muted-foreground">
                Dont {bilan.sansReponse} règle
                {bilan.sansReponse > 1 ? 's' : ''} que tu n’avais jamais
                rencontrée{bilan.sansReponse > 1 ? 's' : ''} — c’est le plus
                facile à combler.
              </p>
            ) : null}
          </div>

          {bilan.aTravailler.length > 0 ? (
            <div className="mt-6">
              <h3 className="font-heading font-bold">À travailler</h3>
              <ul className="mt-3 flex flex-col gap-3">
                {bilan.aTravailler.map((q) => (
                  <li
                    key={q.id}
                    className="rounded-2xl border border-dashed p-4"
                  >
                    <p className="text-sm font-bold text-balance">{q.regle}</p>
                    <p className="mt-1.5 text-sm text-pretty text-muted-foreground">
                      {q.phrase.replaceAll(
                        TROU,
                        `« ${q.options[q.correct]} »`,
                      )}
                    </p>
                    <p className="mt-2 text-sm text-pretty">{q.astuce}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <Button
            variant="outline"
            size="lg"
            className="mt-6 w-full rounded-full font-bold"
            onClick={recommencer}
          >
            <RotateCcw className="size-4" aria-hidden="true" /> Refaire le test
          </Button>
        </div>
      </div>
    )
  }

  // --------------------------------------------------------------- question
  // La phrase est découpée SUR le trou : chaque morceau est rendu tel quel et
  // le trou devient un vrai blanc souligné. Un « ___ » laissé en toutes lettres
  // se lit comme trois caractères, pas comme une case à remplir.
  const morceaux = question.phrase.split(TROU)

  return (
    <div>
      {retour}
      <div className="rounded-3xl bg-card p-6 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-primary text-xs font-extrabold tracking-wide uppercase">
            Question {index + 1} / {QUESTIONS.length}
          </p>
          <p className="text-xs font-semibold text-muted-foreground">
            {PALIER_LABEL[question.palier]}
          </p>
        </div>
        {/* La barre de progression remplace le compteur seul : elle dit la
            distance restante, ce qu'un « 4 / 9 » oblige à calculer. */}
        <div
          className="bg-muted mt-2 h-1.5 overflow-hidden rounded-full"
          role="presentation"
        >
          <div
            className="bg-primary h-full rounded-full transition-[width] duration-300"
            style={{ width: `${(index / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <p className="mt-5 text-sm font-semibold text-muted-foreground">
          Complète la phrase avec le bon mot.
        </p>

        <p className="font-heading mt-3 text-lg leading-relaxed font-bold text-balance">
          {morceaux.map((bout, i) => (
            <span key={i}>
              {bout}
              {i < morceaux.length - 1 ? (
                <span
                  className="border-primary/50 mx-1 inline-block w-16 border-b-2 align-baseline"
                  aria-label="mot à trouver"
                />
              ) : null}
            </span>
          ))}
        </p>

        <div className="mt-6 flex flex-col gap-2.5" role="group">
          {question.options.map((option, i) => (
            <button
              key={option}
              type="button"
              onClick={() => repondre(i)}
              className="hover:border-primary hover:bg-primary/5 w-full rounded-2xl border bg-card px-4 py-3.5 text-left text-sm font-semibold shadow-sm transition-colors active:scale-[0.99]"
            >
              {option}
            </button>
          ))}

          {/* « Je ne sais pas » N'EST PAS UNE QUATRIÈME RÉPONSE. Alignée avec
              les autres, elle se choisit par erreur ou par flemme ; détachée et
              en retrait, elle reste offerte sans être tentante. C'est un aveu,
              pas une option. */}
          <button
            type="button"
            onClick={() => repondre(null)}
            className="mt-1 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Je ne sais pas.
          </button>
        </div>
      </div>
    </div>
  )
}
