'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Gem, Lightbulb, Send, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { demanderAMarcel, acheterJetons } from '@/app/marcel/actions'
import {
  GEMMES_PAR_PACK,
  JETONS_PAR_PACK,
  etatDemande,
  manqueGemmes,
  peutAcheter,
} from '@/lib/coach/jetons'
import type { Tier } from '@/lib/subscription'

// « Demander à Marcel » — la seule chose de l'onglet qui coûte de l'argent, et
// elle arrive en dernier, volontairement.
//
// Des INTENTIONS avant un champ libre : quatre boutons portent l'essentiel des
// usages, coûtent moins de tokens, et n'exigent aucune modération de l'entrée.
// Le champ libre existe, borné.
//
// Le compteur est dit à l'endroit (« il te reste 2 questions »), jamais comme
// une interdiction. Et la porte réelle est en SQL : cet écran ne fait
// qu'éviter un aller-retour dont on connaît déjà l'issue.

const INTENTIONS = [
  {
    key: 'compris',
    label: 'Je n’ai pas compris',
    amorce: 'Je n’ai pas compris ce point de mon cours : ',
  },
  {
    key: 'autrement',
    label: 'Explique autrement',
    amorce: 'Explique-moi autrement, plus simplement : ',
  },
  {
    key: 'methode',
    label: 'La méthode, pas la réponse',
    amorce: 'Donne-moi la méthode, pas la réponse, pour : ',
  },
  {
    key: 'interroge',
    label: 'Interroge-moi',
    amorce: 'Pose-moi une question difficile sur : ',
  },
] as const

export default function DemanderMarcel({
  tier,
  utilisesAujourdhui,
  jetons,
  gemmes,
  matiereSlug,
  matiereName,
}: {
  tier: Tier
  utilisesAujourdhui: number
  jetons: number
  gemmes: number
  matiereSlug: string | null
  matiereName: string | null
}) {
  const [texte, setTexte] = useState('')
  const [reponse, setReponse] = useState<string | null>(null)
  const [solde, setSolde] = useState({ jetons, gemmes, utilises: utilisesAujourdhui })
  const [pending, start] = useTransition()

  const etat = etatDemande({
    tier,
    utilisesAujourdhui: solde.utilises,
    jetons: solde.jetons,
  })

  const envoyer = (question: string) => {
    if (pending || question.trim().length === 0) return
    sfx.tap()
    setReponse(null)

    start(async () => {
      const res = await demanderAMarcel(question, matiereSlug)

      if (res.ok && res.reponse) {
        setReponse(res.reponse)
        setTexte('')
        setSolde((s) => ({
          ...s,
          utilises: s.utilises + 1,
          // Au-delà du quota, c'est un jeton qui a payé.
          jetons: etat.source === 'jeton' ? Math.max(0, s.jetons - 1) : s.jetons,
        }))
        return
      }

      if (res.plafond) {
        toast('Tu as beaucoup travaillé aujourd’hui. On reprend demain.', 'error')
        setSolde((s) => ({ ...s, utilises: s.utilises + 1 }))
      } else if (res.quota) {
        toast('Tes questions du jour sont passées.', 'error')
        setSolde((s) => ({ ...s, utilises: s.utilises + 1 }))
      } else if (res.unavailable) {
        toast('Marcel ne peut pas répondre pour le moment.', 'error')
      } else {
        toast('Marcel n’a pas réussi à répondre. Réessaie.', 'error')
      }
    })
  }

  const acheter = () => {
    sfx.tap()
    start(async () => {
      const res = await acheterJetons(1)
      if (res.ok) {
        setSolde((s) => ({
          ...s,
          jetons: s.jetons + JETONS_PAR_PACK,
          gemmes: Math.max(0, s.gemmes - GEMMES_PAR_PACK),
        }))
        toast(`+${JETONS_PAR_PACK} jetons pour Marcel !`, 'success')
      } else if (res.noGems) {
        toast(manqueGemmes(solde.gemmes) ?? 'Pas assez de gemmes.', 'error')
      } else {
        toast('Achat impossible pour le moment.', 'error')
      }
    })
  }

  return (
    <section className="mt-4">
      <header className="mx-0.5 mb-1.5 flex items-center justify-between">
        <h2 className="font-heading text-[15px] font-extrabold">
          Demander à Marcel
        </h2>
        <span className="text-primary bg-primary/10 rounded-full px-2.5 py-1 text-[11px] font-extrabold">
          {etat.restantes > 0
            ? `${etat.restantes} restantes`
            : `${solde.jetons} jetons`}
        </span>
      </header>

      <div className="bg-card rounded-[20px] p-3 shadow-[0_2px_0_rgba(36,48,79,.06),0_14px_26px_-22px_rgba(36,48,79,.9)]">
        {etat.possible ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              {INTENTIONS.map((intention) => (
                <button
                  key={intention.key}
                  type="button"
                  disabled={pending}
                  onClick={() => setTexte(intention.amorce)}
                  className="bg-background/70 min-h-11 rounded-xl px-2.5 py-2 text-left text-xs font-extrabold shadow-[0_2px_0_rgba(36,48,79,.09)] transition active:translate-y-px disabled:opacity-50"
                >
                  {intention.label}
                </button>
              ))}
            </div>

            <div className="mt-2.5 flex items-end gap-2">
              <label className="sr-only" htmlFor="marcel-question">
                Ta question à Marcel
              </label>
              <textarea
                id="marcel-question"
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                rows={2}
                maxLength={400}
                disabled={pending}
                placeholder={
                  matiereName
                    ? `Ta question sur ${matiereName}…`
                    : 'Écris ta question…'
                }
                className="border-foreground/15 focus:border-primary min-h-11 flex-1 resize-none rounded-xl border-[1.5px] bg-white px-3 py-2 text-[13px] font-semibold outline-none"
              />
              <button
                type="button"
                onClick={() => envoyer(texte)}
                disabled={pending || texte.trim().length === 0}
                aria-label="Envoyer la question à Marcel"
                className="bg-primary text-primary-foreground grid size-11 shrink-0 place-items-center rounded-xl shadow-[0_3px_0_color-mix(in_oklch,var(--primary),black_28%)] transition active:translate-y-px disabled:opacity-40"
              >
                <Send aria-hidden="true" className="size-4" />
              </button>
            </div>

            <p className="text-muted-foreground mt-2 text-center text-[11px] font-semibold">
              {etat.message} Marcel donne un indice, jamais la réponse toute
              faite.
            </p>
          </>
        ) : (
          // Le mur : deux sorties, jamais une. Et l'une des deux fait grandir
          // Studuel (les gemmes se gagnent en invitant).
          <div className="text-center">
            <p className="font-heading text-[15px] font-extrabold">
              {etat.message}
            </p>

            {etat.source !== 'plafond' && (
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={acheter}
                  disabled={pending || !peutAcheter(solde.gemmes)}
                  className={cn(
                    'flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-3 text-[13px] font-extrabold transition active:translate-y-px',
                    peutAcheter(solde.gemmes)
                      ? 'bg-highlight text-foreground shadow-[0_4px_0_color-mix(in_oklch,var(--highlight),black_25%)]'
                      : 'bg-foreground/8 text-muted-foreground',
                  )}
                >
                  <Gem aria-hidden="true" className="size-4" />
                  {JETONS_PAR_PACK} jetons · {GEMMES_PAR_PACK} gemmes
                </button>

                <p className="text-muted-foreground text-[11px] font-semibold">
                  {manqueGemmes(solde.gemmes) ??
                    'Les gemmes se gagnent en invitant des amis.'}
                </p>

                <Link
                  href="/tresor"
                  className="text-primary flex min-h-11 items-center justify-center gap-1.5 text-xs font-extrabold underline-offset-4 hover:underline"
                >
                  <Sparkles aria-hidden="true" className="size-3.5" />
                  Ou passer Studuel+ et ne plus y penser
                </Link>
              </div>
            )}
          </div>
        )}

        {pending && (
          <p className="text-muted-foreground mt-3 text-center text-xs font-bold">
            Marcel réfléchit…
          </p>
        )}

        {reponse && !pending && (
          <div className="bg-accent/60 mt-3 flex items-start gap-2.5 rounded-[15px] p-3">
            <Lightbulb
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[#c58b0d]"
            />
            <p className="text-[13px] leading-relaxed font-semibold text-[#6b4a05]">
              {reponse}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
