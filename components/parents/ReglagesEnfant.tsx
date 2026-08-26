'use client'

import { useActionState, useState } from 'react'
import { BellOff, BellRing, Check, Target } from 'lucide-react'
import { saveParentPrefs, type ParentPrefsState } from '@/app/parents/actions'
import { GOAL_PRESETS, type ParentPrefs } from '@/lib/parents-suivi'
import { cn } from '@/lib/utils'
import UnlinkChildButton from '@/components/parents/UnlinkChildButton'

const initialState: ParentPrefsState = { error: null }

// Les seuils d'alerte proposés. Pas de champ libre : le parent n'a aucune
// raison de savoir si c'est 4 ou 5 jours qui font un décrochage — et « 0 »
// doit se LIRE « jamais », pas se saisir.
const ALERT_PRESETS: readonly { days: number; label: string }[] = [
  { days: 0, label: 'Jamais' },
  { days: 2, label: '2 jours' },
  { days: 3, label: '3 jours' },
  { days: 5, label: '5 jours' },
  { days: 7, label: '1 semaine' },
]

/**
 * Les réglages d'un enfant : l'objectif de la semaine, l'alerte d'inactivité,
 * et le lien lui-même.
 *
 * POURQUOI CES DEUX RÉGLAGES ET PAS D'AUTRES. Ce sont les deux seuls endroits
 * de l'écran où l'app décrétait quelque chose à la place du parent : un
 * « assez de travail » implicite, et un « il faut s'inquiéter » implicite. Un
 * élève de 6e et un élève de Terminale n'ont ni le même rythme ni le même
 * seuil d'alerte ; les réglages sont donc par COUPLE (parent, enfant), comme
 * la table `parent_prefs` de la migration 319.
 *
 * La saisie se fait en paliers et non en champ libre : demander un nombre de
 * minutes à un parent, c'est lui demander de deviner une norme qu'il n'a pas.
 * Chaque palier porte donc son intention (« Régulier », « Période de
 * contrôles ») — c'est cela qu'un parent sait choisir.
 *
 * « Délier » vit ici, et non plus sur la carte de suivi : c'est un geste rare
 * et irréversible, il n'a rien à faire à côté de chiffres qu'on consulte
 * toutes les semaines — il était jusqu'ici en haut à droite de la carte, à un
 * pouce de l'endroit où l'on fait défiler.
 */
export default function ReglagesEnfant({
  childId,
  childName,
  prefs,
  disponible,
}: {
  childId: string
  childName: string
  prefs: ParentPrefs
  /**
   * Faux tant que la migration 319 n'est pas passée : on n'offre pas un
   * réglage qui ne pourrait pas être enregistré.
   */
  disponible: boolean
}) {
  const [state, action, pending] = useActionState(saveParentPrefs, initialState)
  const [goal, setGoal] = useState(prefs.weeklyGoalMinutes)
  const [alert, setAlert] = useState(prefs.alertAfterDays)

  const modifie =
    goal !== prefs.weeklyGoalMinutes || alert !== prefs.alertAfterDays

  return (
    <section className="bg-card rounded-2xl border p-5 shadow-sm">
      <header className="mb-4 flex items-start justify-between gap-3">
        <h3 className="font-heading text-lg font-semibold">{childName}</h3>
        <UnlinkChildButton childId={childId} childName={childName} />
      </header>

      {!disponible ? (
        <p className="text-muted-foreground rounded-xl border border-dashed p-3.5 text-sm">
          Les réglages personnalisés ne sont pas encore actifs sur ce compte. Le
          suivi, lui, fonctionne normalement.
        </p>
      ) : (
        <form action={action} className="flex flex-col gap-5">
          <input type="hidden" name="childId" value={childId} />
          <input type="hidden" name="goalMinutes" value={goal} />
          <input type="hidden" name="alertDays" value={alert} />

          <fieldset>
            <legend className="mb-1 flex items-center gap-1.5 text-sm font-semibold">
              <Target
                className="text-primary size-4"
                strokeWidth={2.4}
                aria-hidden="true"
              />
              Objectif de la semaine
            </legend>
            <p className="text-muted-foreground mb-2.5 text-xs">
              Le temps de révision visé sur sept jours. C&apos;est VOTRE repère,
              pas une note : la jauge du suivi s&apos;y rapporte.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {GOAL_PRESETS.map((p) => (
                <button
                  key={p.minutes}
                  type="button"
                  onClick={() => setGoal(p.minutes)}
                  aria-pressed={goal === p.minutes}
                  className={cn(
                    'focus-visible:ring-primary/50 flex min-h-16 cursor-pointer flex-col items-start justify-center rounded-xl border px-3 py-2 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none',
                    goal === p.minutes
                      ? 'border-primary bg-primary/[0.06]'
                      : 'hover:border-primary/40',
                  )}
                >
                  <span className="font-heading text-sm font-bold">
                    {p.label}
                  </span>
                  <span className="text-muted-foreground text-[11px] leading-tight">
                    {p.hint}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1 flex items-center gap-1.5 text-sm font-semibold">
              {alert === 0 ? (
                <BellOff
                  className="text-muted-foreground size-4"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              ) : (
                <BellRing
                  className="text-primary size-4"
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              )}
              M&apos;avertir après
            </legend>
            <p className="text-muted-foreground mb-2.5 text-xs">
              Le nombre de jours sans aucune activité au bout desquels le suivi
              affiche une alerte en haut de la carte.
            </p>
            <div className="flex flex-wrap gap-2">
              {ALERT_PRESETS.map((p) => (
                <button
                  key={p.days}
                  type="button"
                  onClick={() => setAlert(p.days)}
                  aria-pressed={alert === p.days}
                  className={cn(
                    'focus-visible:ring-primary/50 min-h-11 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                    alert === p.days
                      ? 'border-primary bg-primary/[0.06] text-foreground'
                      : 'text-muted-foreground hover:border-primary/40',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={pending || !modifie}
              className="bg-primary text-primary-foreground min-h-11 cursor-pointer rounded-xl px-5 font-semibold transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
            >
              {pending ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            {/* Le message de succès s'efface dès que le parent retouche un
                réglage : le laisser sous des valeurs modifiées ferait croire
                que la nouvelle valeur est déjà enregistrée. */}
            {state.message && !modifie ? (
              <p
                role="status"
                className="text-success flex items-center gap-1 text-sm font-medium"
              >
                <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                {state.message}
              </p>
            ) : null}
            {state.error ? (
              <p role="alert" className="text-destructive text-sm font-medium">
                {state.error}
              </p>
            ) : null}
          </div>
        </form>
      )}
    </section>
  )
}
