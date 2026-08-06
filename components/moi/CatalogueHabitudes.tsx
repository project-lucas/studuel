'use client'

import { useOptimistic, useState, useTransition } from 'react'
import { Check, Loader2, Lock, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import {
  arreterHabitudeAction,
  suivreHabitudeAction,
  toggleHabitudeAction,
} from '@/app/moi/actions'
import Sparkline from '@/components/moi/Sparkline'
import { teinteDe } from '@/lib/moi/familles'
import { FENETRE_JOURS } from '@/lib/moi/habitudes'

// LE CATALOGUE — seize habitudes, et le « pourquoi » de chacune.
//
// Le texte scientifique de chaque habitude (`habit_catalog.rationale`) existe en
// base depuis la migration 010 et n'était affiché NULLE PART : l'app portait
// l'argument qui fait changer de comportement et ne le montrait pas. C'est lui
// qui fait le travail de sensibilisation ; les cases à cocher ne font que le
// mesurer.
//
// Une seule liste, pas deux onglets « suivies / disponibles » : ce qui est suivi
// remonte en tête avec sa série, le reste suit. Un élève doit voir d'un coup ce
// qu'il tient et ce qu'il pourrait prendre.

const JOURS_COURTS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export type LigneHabitude = {
  catalogId: string
  titre: string
  icone: string
  raison: string
  /** Suivie par l'élève ? */
  suivie: boolean
  /** Ne peut pas être arrêtée (mission fixe pour tous). */
  fixe: boolean
  /** Tenue aujourd'hui ? (null si pas suivie) */
  aujourdhui: boolean
  serie: number
  regularite: number
  /** Les 7 derniers jours, du plus ancien au plus récent. */
  semaine: boolean[]
  /** Les 28 jours de la fenêtre — c'est ce que trace la vague. */
  historique: boolean[]
}

function Damier({
  semaine,
  jourAujourdhui,
}: {
  semaine: boolean[]
  jourAujourdhui: number
}) {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {semaine.map((fait, i) => {
        const decalage = semaine.length - 1 - i
        const index = (jourAujourdhui - 1 - decalage + 700) % 7
        return (
          <span
            key={i}
            className={cn(
              'flex size-5 items-center justify-center rounded-md text-[9px] font-extrabold',
              fait
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {JOURS_COURTS[index]}
          </span>
        )
      })}
    </div>
  )
}

function Ligne({
  ligne,
  today,
  jourAujourdhui,
}: {
  ligne: LigneHabitude
  today: string
  jourAujourdhui: number
}) {
  const [pending, startTransition] = useTransition()
  const [suivie, setSuivie] = useOptimistic(ligne.suivie)
  const [fait, setFait] = useOptimistic(ligne.aujourdhui)
  const [confirmation, setConfirmation] = useState(false)
  const teinte = teinteDe(ligne.catalogId)

  const suivre = () => {
    sfx.tap()
    startTransition(async () => {
      setSuivie(true)
      const { ok } = await suivreHabitudeAction(ligne.catalogId)
      if (!ok) toast('Impossible d’ajouter cette habitude pour l’instant.', 'error')
    })
  }

  const arreter = () => {
    sfx.tap()
    setConfirmation(false)
    startTransition(async () => {
      setSuivie(false)
      const { ok } = await arreterHabitudeAction(ligne.catalogId)
      if (!ok) toast('Impossible d’arrêter cette habitude pour l’instant.', 'error')
    })
  }

  const cocher = () => {
    const next = !fait
    sfx.tap()
    startTransition(async () => {
      setFait(next)
      const { ok } = await toggleHabitudeAction(ligne.catalogId, today, next)
      if (!ok) toast('Ce jour n’a pas été enregistré. Réessaie.', 'error')
    })
  }

  return (
    <li className="moi-card rounded-3xl bg-white px-4 py-3">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full text-lg',
            teinte.pastille,
          )}
        >
          {ligne.icone}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <p className="font-heading min-w-0 flex-1 text-[15px] leading-snug font-extrabold text-foreground">
              {ligne.titre}
            </p>

            {suivie ? (
              <button
                type="button"
                aria-pressed={fait}
                aria-label={`${ligne.titre} aujourd'hui : ${fait ? 'fait' : 'à faire'}`}
                onClick={cocher}
                disabled={pending}
                className={cn(
                  'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-transform active:scale-90',
                  fait
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {pending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Check className="size-4.5" strokeWidth={3} aria-hidden="true" />
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={suivre}
                disabled={pending}
                className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-extrabold text-primary-foreground transition-transform active:scale-95"
              >
                <Plus className="size-3.5" strokeWidth={3} aria-hidden="true" />
                Suivre
              </button>
            )}
          </div>

          {/* LE « POURQUOI ». La seule raison pour laquelle cette page existe. */}
          <p className="mt-1 text-xs leading-snug text-muted-foreground">
            {ligne.raison}
          </p>

          {suivie ? (
            <>
              {/* Le chiffre et sa vague, cote a cote : « 12 jours » ne dit pas
                  si la serie vient de repartir — les 28 jours du trace, si. */}
              <div className="mt-2 flex items-center gap-3">
                <p className="font-heading flex shrink-0 items-baseline gap-1 leading-none font-extrabold text-foreground">
                  <span className="text-xl tabular-nums">{ligne.serie}</span>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {ligne.serie > 1 ? 'jours de suite' : 'jour de suite'}
                  </span>
                </p>
                <Sparkline
                  jours={ligne.historique}
                  className={cn('max-w-32 flex-1', teinte.trait)}
                  titre={`${ligne.titre} : ${ligne.regularite}% sur ${FENETRE_JOURS} jours`}
                />
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {/* Le damier reste : lui seul dit QUEL jour a saute. */}
                <Damier semaine={ligne.semaine} jourAujourdhui={jourAujourdhui} />
                <span className="text-[11px] font-bold text-muted-foreground">
                  {ligne.regularite}% sur {FENETRE_JOURS} jours
                </span>

              {ligne.fixe ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                  <Lock className="size-3" aria-hidden="true" />
                  mission de tous
                </span>
              ) : confirmation ? (
                <span className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={arreter}
                    className="cursor-pointer rounded-full bg-destructive px-2.5 py-1 text-[11px] font-extrabold text-white"
                  >
                    Arrêter, série comprise
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmation(false)}
                    aria-label="Annuler"
                    className="cursor-pointer text-muted-foreground"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    sfx.tap()
                    setConfirmation(true)
                  }}
                  className="cursor-pointer text-[11px] font-bold text-muted-foreground underline underline-offset-2"
                >
                  Arrêter
                </button>
              )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </li>
  )
}

export default function CatalogueHabitudes({
  lignes,
  today,
  jourAujourdhui,
  verdict,
}: {
  lignes: LigneHabitude[]
  /** Clé de jour UTC 'YYYY-MM-DD'. */
  today: string
  /** Jour de la semaine, 0 = dimanche (Date.getUTCDay). */
  jourAujourdhui: number
  /**
   * Ce que l'app dit du lot : « X tient, c'est Y qui lâche ». Il NOMME, il ne
   * note pas — une moyenne d'habitudes écraserait la seule information utile,
   * laquelle tient et laquelle lâche (cf. lib/moi/habitudes).
   */
  verdict: string
}) {
  const suivies = lignes.filter((l) => l.suivie)
  const libres = lignes.filter((l) => !l.suivie)

  return (
    <div className="flex flex-col gap-4">
      <div className="moi-card rounded-3xl bg-white px-4 py-4">
        <p className="font-heading text-[15px] leading-snug font-extrabold text-balance text-foreground">
          {verdict}
        </p>
        {suivies.length > 0 ? (
          <p className="mt-1.5 text-xs font-bold text-muted-foreground">
            {suivies.filter((l) => l.aujourdhui).length} tenue
            {suivies.filter((l) => l.aujourdhui).length > 1 ? 's' : ''} sur{' '}
            {suivies.length} aujourd’hui.
          </p>
        ) : null}
      </div>

      <section aria-label="Mes habitudes suivies">
        <h2 className="font-heading mx-0.5 mb-2 text-[15px] font-extrabold">
          {suivies.length > 0
            ? `Je suis ${suivies.length} habitude${suivies.length > 1 ? 's' : ''}`
            : 'Tu ne suis encore aucune habitude'}
        </h2>
        {suivies.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {suivies.map((l) => (
              <Ligne
                key={l.catalogId}
                ligne={l}
                today={today}
                jourAujourdhui={jourAujourdhui}
              />
            ))}
          </ul>
        ) : (
          <p className="mx-0.5 text-sm text-muted-foreground">
            Une seule suffit pour commencer — la régularité fait le reste.
          </p>
        )}
      </section>

      {libres.length > 0 ? (
        <section aria-label="Habitudes à ajouter">
          <h2 className="font-heading mx-0.5 mb-2 text-[15px] font-extrabold">
            À ajouter quand tu veux
          </h2>
          <ul className="flex flex-col gap-2">
            {libres.map((l) => (
              <Ligne
                key={l.catalogId}
                ligne={l}
                today={today}
                jourAujourdhui={jourAujourdhui}
              />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
