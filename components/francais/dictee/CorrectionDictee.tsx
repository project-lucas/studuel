'use client'

import { useState } from 'react'
import { CheckCircle2, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  erreursAExpliquer,
  type Correction,
} from '@/lib/francais/dictee/correction'

/**
 * L'ÉCRAN DE CORRECTION — la copie mot à mot, puis les explications.
 *
 * Le rendu suit la marge d'un professeur : ce qui est juste en VERT, ce que
 * l'élève a écrit à tort BARRÉ EN ROUGE, et ce qu'il a oublié en vert à sa
 * place. C'est la raison pour laquelle l'alignement se fait au MOT et non au
 * caractère (`lib/francais/dictee/correction`) — « cheva[ux→ls] » ne se lit pas.
 *
 * ⚠️ La couleur ne porte JAMAIS l'information seule : le rouge est toujours
 * barré, le vert jamais. Un élève sur douze ne distingue pas les deux.
 */
export default function CorrectionDictee({
  correction,
  onFermer,
}: {
  correction: Correction
  onFermer: () => void
}) {
  const [ouverte, setOuverte] = useState<number | null>(null)
  const explications = erreursAExpliquer(correction)

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-background px-5 py-6">
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-heading flex items-center gap-2 text-3xl font-extrabold text-foreground">
            Correction
            <CheckCircle2
              className="size-7 fill-success text-white"
              aria-hidden="true"
            />
          </h1>
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              onFermer()
            }}
            aria-label="Fermer la correction"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {correction.erreurs === 0
            ? 'Aucune erreur. Rien à revoir.'
            : `Tu as fait ${correction.erreurs} erreur${correction.erreurs > 1 ? 's' : ''}. Revoyons-les.`}
        </p>

        {/* LA COPIE CORRIGÉE. */}
        <div className="mt-5 rounded-3xl border-2 border-black/10 bg-card p-5">
          <p className="text-lg leading-relaxed font-bold">
            {correction.morceaux.map((m, i) => {
              if (m.type === 'ajoute') {
                return (
                  <span key={i} className="text-destructive line-through">
                    {m.texte}{' '}
                  </span>
                )
              }
              return (
                <span
                  key={i}
                  className={cn(
                    m.type === 'manque' ? 'text-success' : 'text-success',
                  )}
                >
                  {m.texte}{' '}
                </span>
              )
            })}
          </p>
        </div>

        {/* LES EXPLICATIONS — une par erreur, en accordéon.
            Repliées : trente erreurs dépliées font un mur de texte que
            personne ne lit. Le mot fautif est en gras dans son contexte, ce qui
            suffit à le retrouver sans relire toute la dictée. */}
        {explications.length > 0 ? (
          <>
            <h2 className="font-heading mt-8 text-2xl font-extrabold text-foreground">
              Explications
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Les erreurs les plus fréquentes et leurs explications.
            </p>

            <ul className="mt-4 flex flex-col gap-2 pb-8">
              {explications.map((e, i) => {
                const ouvert = ouverte === i
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => {
                        sfx.tap()
                        setOuverte(ouvert ? null : i)
                      }}
                      aria-expanded={ouvert}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 border-black/10 bg-card px-4 py-3.5 text-left"
                    >
                      <span className="min-w-0 flex-1 text-sm text-foreground">
                        {e.avant ? `${e.avant} ` : ''}
                        <span className="font-extrabold">{e.attendu}</span>
                        {e.apres ? ` ${e.apres}` : ''}
                      </span>
                      <ChevronDown
                        className={cn(
                          'size-5 shrink-0 text-muted-foreground transition-transform',
                          ouvert && 'rotate-180',
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {ouvert ? (
                      <p className="px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                        Le mot attendu était{' '}
                        <span className="font-extrabold text-foreground">
                          {e.attendu}
                        </span>
                        . Relis-le dans son contexte et écris-le trois fois — la
                        main retient ce que l’œil oublie.
                      </p>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  )
}
