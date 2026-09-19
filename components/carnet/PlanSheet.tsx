'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import BottomSheet from '@/components/carnet/BottomSheet'
import { Button } from '@/components/ui/button'
import { LONGUEURS, MODES, MODE_LABEL, type Mode } from '@/lib/carnet/session-options'
import { JOURS_COURTS, type Plan } from '@/lib/carnet/planning'
import { enregistrerPlan, supprimerPlan } from '@/app/carnet/cours/planning-actions'

/** Un dossier proposé au choix : le cours entier ou un chapitre (avec sa profondeur). */
export type DossierChoix = { id: string | null; titre: string; profondeur: number }

const HEURES = ['07:00', '07:30', '12:30', '17:00', '17:30', '18:00', '18:30', '19:00', '20:00', '21:00']

/**
 * LA FEUILLE « PLANIFIER CE DOSSIER » : quel dossier, quels jours, quelle
 * heure, combien de cartes, quel mode. Cinq gestes, un bouton. Elle sert à
 * créer comme à modifier (un plan reçu en `initial`).
 */
export default function PlanSheet({
  open,
  onClose,
  courseId,
  dossiers,
  initial,
  dossierInitial = null,
}: {
  open: boolean
  onClose: () => void
  courseId: string
  dossiers: DossierChoix[]
  /** Le plan à modifier, ou null pour en créer un. */
  initial: Plan | null
  /** Le dossier présélectionné à la création. */
  dossierInitial?: string | null
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [chapterId, setChapterId] = useState<string | null>(initial?.chapterId ?? dossierInitial)
  const [days, setDays] = useState<number[]>(initial?.days ?? [])
  const [time, setTime] = useState<string | null>(initial?.time ?? null)
  const [longueur, setLongueur] = useState<number | null>(initial?.longueur ?? 20)
  const [mode, setMode] = useState<Mode>(initial?.mode ?? 'apprentissage')
  const [erreur, setErreur] = useState<string | null>(null)

  const basculerJour = (d: number) => {
    sfx.tap()
    setDays((liste) => (liste.includes(d) ? liste.filter((x) => x !== d) : [...liste, d].sort()))
  }

  const enregistrer = () => {
    if (days.length === 0) {
      setErreur('Choisis au moins un jour.')
      return
    }
    setErreur(null)
    startTransition(async () => {
      const r = await enregistrerPlan(courseId, chapterId, { days, time, longueur, mode })
      if (!r.ok) {
        setErreur(r.message ?? 'Le planning n’a pas pu être enregistré.')
        return
      }
      sfx.complete()
      onClose()
      router.refresh()
    })
  }

  const supprimer = () => {
    if (!initial) return
    startTransition(async () => {
      const r = await supprimerPlan(initial.id)
      if (r.ok) {
        sfx.back()
        onClose()
        router.refresh()
      }
    })
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={initial ? 'Modifier le rendez-vous' : 'Planifier ce dossier'}>
      <div className="flex flex-col gap-4">
        <Champ titre="Quel dossier ?">
          <select
            value={chapterId ?? ''}
            onChange={(e) => setChapterId(e.target.value || null)}
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold"
            disabled={initial !== null}
          >
            {dossiers.map((d) => (
              <option key={d.id ?? 'tout'} value={d.id ?? ''}>
                {'— '.repeat(d.profondeur)}
                {d.titre}
              </option>
            ))}
          </select>
        </Champ>

        <Champ titre="Quels jours ?" aide="Le rendez-vous se répète chaque semaine.">
          <div className="grid grid-cols-7 gap-1.5" role="group" aria-label="Jours de la semaine">
            {JOURS_COURTS.map((j, i) => (
              <button
                key={j}
                type="button"
                aria-pressed={days.includes(i)}
                onClick={() => basculerJour(i)}
                className={cn(
                  'rounded-xl py-2 text-xs font-extrabold transition-colors',
                  days.includes(i) ? 'bg-primary text-white' : 'bg-primary/10 text-primary',
                )}
              >
                {j}
              </button>
            ))}
          </div>
        </Champ>

        <Champ titre="À quelle heure ?" aide="Facultatif — le jour suffit.">
          <div className="flex flex-wrap gap-1.5">
            <Pastille actif={time === null} onClick={() => setTime(null)}>
              Sans heure
            </Pastille>
            {HEURES.map((h) => (
              <Pastille key={h} actif={time === h} onClick={() => setTime(h)}>
                {h}
              </Pastille>
            ))}
          </div>
        </Champ>

        <Champ titre="Combien de cartes ?">
          <div className="flex flex-wrap gap-1.5">
            {LONGUEURS.map((l) => (
              <Pastille key={String(l)} actif={longueur === l} onClick={() => setLongueur(l)}>
                {l === null ? 'Tout ce qui est dû' : `${l} cartes`}
              </Pastille>
            ))}
          </div>
        </Champ>

        <Champ titre="Quel mode ?">
          <div className="flex flex-wrap gap-1.5">
            {MODES.map((m) => (
              <Pastille key={m} actif={mode === m} onClick={() => setMode(m)}>
                {MODE_LABEL[m]}
              </Pastille>
            ))}
          </div>
        </Champ>

        {erreur ? (
          <p role="alert" className="text-sm font-semibold text-destructive">
            {erreur}
          </p>
        ) : null}

        <div className="flex flex-col gap-2 pt-1">
          <Button size="lg" onClick={enregistrer} disabled={pending} className="press-3d h-12 font-extrabold">
            {initial ? 'Enregistrer' : 'Poser le rendez-vous'}
          </Button>
          {initial ? (
            <Button variant="ghost" onClick={supprimer} disabled={pending} className="text-destructive">
              Retirer ce rendez-vous
            </Button>
          ) : null}
        </div>
      </div>
    </BottomSheet>
  )
}

function Champ({ titre, aide, children }: { titre: string; aide?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-heading text-sm font-extrabold text-foreground">{titre}</p>
      {aide ? <p className="mt-0.5 mb-1.5 text-[11px] font-semibold text-muted-foreground">{aide}</p> : <div className="mb-1.5" />}
      {children}
    </div>
  )
}

function Pastille({ actif, onClick, children }: { actif: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      onClick={() => {
        sfx.tap()
        onClick()
      }}
      className={cn(
        'rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors',
        actif ? 'bg-primary text-white' : 'bg-primary/10 text-primary',
      )}
    >
      {children}
    </button>
  )
}
