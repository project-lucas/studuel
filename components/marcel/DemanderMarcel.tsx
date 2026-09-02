'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUp, ChevronDown, Gem, Plus, Sparkles } from 'lucide-react'
import marcelTete from '@/public/images/nav/marcel.webp'
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

// LE CHAMP — la seule chose de l'écran qui coûte de l'argent, et elle ferme la
// page, volontairement : Marcel est d'abord un repère de méthode.
//
// C'est aussi ce à quoi ressemble un coach aujourd'hui, et l'élève le sait : un
// cadre arrondi, une matière qu'on précise, un « + » pour être aidé à formuler,
// une flèche pour envoyer. Le champ ne s'excuse plus derrière un titre de
// section — il EST la fin de la phrase commencée par la bulle.
//
// Les INTENTIONS n'ont pas disparu, elles sont passées sous le « + ». Elles
// portent l'essentiel des usages, coûtent moins de tokens qu'une question mal
// posée, et donnent à l'élève qui ne sait pas quoi écrire une phrase toute
// prête. Le champ libre reste, borné.
//
// Le compteur est dit à l'endroit (« 2 restantes »), jamais comme une
// interdiction. Et la porte réelle est en SQL : cet écran ne fait qu'éviter un
// aller-retour dont on connaît déjà l'issue.

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

export type MatiereOption = { slug: string; name: string }

export default function DemanderMarcel({
  tier,
  utilisesAujourdhui,
  jetons,
  gemmes,
  matieres,
  matiereParDefaut,
}: {
  tier: Tier
  utilisesAujourdhui: number
  jetons: number
  gemmes: number
  /** Les matières suivies — celles que Marcel sait coacher. */
  matieres: MatiereOption[]
  /** Celle de la mission du jour : l'élève n'a rien à choisir dans le cas normal. */
  matiereParDefaut: string | null
}) {
  const [texte, setTexte] = useState('')
  const [matiere, setMatiere] = useState<string>(matiereParDefaut ?? '')
  const [amorces, setAmorces] = useState(false)
  const [reponse, setReponse] = useState<string | null>(null)
  const [solde, setSolde] = useState({ jetons, gemmes, utilises: utilisesAujourdhui })
  const [pending, start] = useTransition()
  const champ = useRef<HTMLTextAreaElement>(null)

  const etat = etatDemande({
    tier,
    utilisesAujourdhui: solde.utilises,
    jetons: solde.jetons,
  })

  const envoyer = () => {
    const question = texte.trim()
    if (pending || question.length === 0) return
    sfx.tap()
    setReponse(null)
    setAmorces(false)

    start(async () => {
      const res = await demanderAMarcel(question, matiere === '' ? null : matiere)

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
      <h2 className="sr-only">Demander à Marcel</h2>

      {/* LA RÉPONSE, en bulle : c'est Marcel qui parle, comme en haut d'écran.
          `aria-live` la fait annoncer sans déplacer le focus — l'élève peut
          enchaîner une deuxième question sans revenir chercher le champ. */}
      <div aria-live="polite" aria-atomic="true">
        {pending && (
          <p className="coach-bulle text-muted-foreground mx-auto mb-3">
            Marcel réfléchit…
          </p>
        )}

        {reponse && !pending && (
          <div className="bg-card mb-3 flex items-start gap-2.5 rounded-[22px] p-3 shadow-[inset_0_0_0_1.5px_color-mix(in_oklch,var(--foreground),transparent_90%),0_14px_26px_-22px_rgba(36,48,79,.9)]">
            <Image
              src={marcelTete}
              alt=""
              aria-hidden="true"
              width={72}
              height={72}
              className="size-9 shrink-0 rounded-full object-contain"
            />
            <p className="text-[13px] leading-relaxed font-semibold">{reponse}</p>
          </div>
        )}
      </div>

      {etat.possible ? (
        <>
          <div className="bg-card rounded-[26px] p-3 shadow-[inset_0_0_0_1.5px_color-mix(in_oklch,var(--foreground),transparent_90%),0_14px_26px_-22px_rgba(36,48,79,.9)]">
            <div className="flex items-center justify-between gap-2">
              {/* La matière n'est pas un réglage caché : Marcel ne répond pas en
                  histoire comme en maths (cf. lib/coach/regimes), et c'est ce
                  menu qui le lui dit. Prérempli sur la mission du jour. */}
              {matieres.length > 0 ? (
                <span className="relative inline-flex items-center">
                  <select
                    aria-label="Préciser une matière"
                    value={matiere}
                    onChange={(e) => setMatiere(e.target.value)}
                    disabled={pending}
                    className="border-foreground/12 focus:border-primary appearance-none rounded-full border-[1.5px] bg-transparent py-1.5 pr-7 pl-3.5 text-xs font-extrabold outline-none disabled:opacity-50"
                  >
                    <option value="">Préciser une matière</option>
                    {matieres.map((m) => (
                      <option key={m.slug} value={m.slug}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="text-muted-foreground pointer-events-none absolute right-2.5 size-3.5"
                  />
                </span>
              ) : (
                <span />
              )}

              <span className="text-primary bg-primary/10 rounded-full px-2.5 py-1 text-[11px] font-extrabold">
                {etat.restantes > 0
                  ? `${etat.restantes} restantes`
                  : `${solde.jetons} jetons`}
              </span>
            </div>

            <label className="sr-only" htmlFor="marcel-question">
              Ta question à Marcel
            </label>
            <textarea
              id="marcel-question"
              ref={champ}
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              rows={3}
              maxLength={400}
              disabled={pending}
              placeholder="Demander à Marcel"
              className="placeholder:text-muted-foreground/70 mt-2 w-full resize-none bg-transparent px-1.5 text-[15px] font-semibold outline-none"
            />

            {amorces && (
              <ul className="mb-1 flex flex-wrap gap-1.5">
                {INTENTIONS.map((intention) => (
                  <li key={intention.key}>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => {
                        setTexte(intention.amorce)
                        setAmorces(false)
                        champ.current?.focus()
                      }}
                      className="bg-background/70 min-h-9 rounded-full px-3 text-left text-xs font-extrabold shadow-[0_2px_0_rgba(36,48,79,.09)] transition active:translate-y-px disabled:opacity-50"
                    >
                      {intention.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setAmorces((v) => !v)
                }}
                aria-expanded={amorces}
                aria-label="Des phrases toutes prêtes pour demander"
                className={cn(
                  'grid size-11 place-items-center rounded-full border-[1.5px] transition active:translate-y-px',
                  amorces
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-foreground/12 text-muted-foreground',
                )}
              >
                <Plus
                  aria-hidden="true"
                  className={cn('size-5 transition-transform', amorces && 'rotate-45')}
                  strokeWidth={2.4}
                />
              </button>

              <button
                type="button"
                onClick={envoyer}
                disabled={pending || texte.trim().length === 0}
                aria-label="Envoyer la question à Marcel"
                className="bg-primary text-primary-foreground grid size-12 place-items-center rounded-full shadow-[0_3px_0_color-mix(in_oklch,var(--primary),black_28%)] transition active:translate-y-px disabled:opacity-40 disabled:shadow-none"
              >
                <ArrowUp aria-hidden="true" className="size-5" strokeWidth={2.6} />
              </button>
            </div>
          </div>

          {/* La ligne de bas de page, comme partout où une IA répond : elle dit
              ce qu'est Marcel, et ce qu'il faut en faire. Elle porte aussi le
              compteur du jour en clair — c'est le même texte que l'ancien
              (etat.message), il n'a pas à disparaître avec la refonte. */}
          <p className="text-muted-foreground mt-2.5 flex items-start justify-center gap-1.5 px-3 text-center text-[11px] leading-snug font-semibold">
            <Sparkles aria-hidden="true" className="mt-px size-3.5 shrink-0" />
            <span>
              {etat.message} Marcel est un coach IA : il donne un indice, jamais
              la réponse toute faite — vérifie ce qui compte.
            </span>
          </p>
        </>
      ) : (
        // Le mur : deux sorties, jamais une. Et l'une des deux fait grandir
        // Studuel (les gemmes se gagnent en invitant).
        <div className="bg-card rounded-[26px] p-4 text-center shadow-[inset_0_0_0_1.5px_color-mix(in_oklch,var(--foreground),transparent_90%),0_14px_26px_-22px_rgba(36,48,79,.9)]">
          <p className="font-heading text-[15px] font-extrabold">{etat.message}</p>

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
    </section>
  )
}
