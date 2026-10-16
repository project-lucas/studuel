'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Target } from 'lucide-react'
import { fixerObjectifAction } from '@/app/coach/actions'
import { OBJECTIFS_TYPES, progressionObjectif, resumeObjectif, type Avancee, type Objectif } from '@/lib/coach/suivi'
import { cn } from '@/lib/utils'

/** L'objectif de la semaine : où en est l'élève, et le fixer ou le changer. */
export default function ObjectifCarte({ eleveId, objectif, avancee }: { eleveId: string; objectif: Objectif | null; avancee: Avancee }) {
  const router = useRouter()
  const p = progressionObjectif(objectif, avancee)
  const [edition, setEdition] = useState(false)
  const [o, setO] = useState({ minutes: objectif?.minutes ?? 120, jours: objectif?.jours ?? 4, quiz: objectif?.quiz ?? 6, message: objectif?.message ?? '' })
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, demarrer] = useTransition()

  return (
    <section className="carte p-5" aria-labelledby="objectif">
      <div className="flex items-center gap-2">
        <Target className="size-5 text-primary" aria-hidden="true" />
        <h2 id="objectif" className="titre-section flex-1">Objectif de la semaine</h2>
        {!edition ? (
          <button type="button" onClick={() => setEdition(true)} className="h-9 rounded-full bg-secondary px-3 text-xs font-bold text-primary">
            {objectif ? 'Modifier' : 'Fixer'}
          </button>
        ) : null}
      </div>
      <p className="mt-1 text-sm font-bold">{resumeObjectif(objectif)}</p>
      {objectif?.message ? <p className="mt-1 text-sm italic text-muted-foreground">« {objectif.message} »</p> : null}
      {p.lignes.length ? (
        <ul className="mt-3 flex flex-col gap-2.5">
          {p.lignes.map((l) => (
            <li key={l.cle}>
              <div className="flex justify-between text-xs font-bold">
                <span>{l.libelle}</span>
                <span className="tabular-nums">
                  {l.fait} / {l.cible}
                </span>
              </div>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-secondary">
                <div className={cn('h-full rounded-full', l.atteint ? 'bg-(--success)' : 'bg-primary')} style={{ width: `${Math.round(l.part * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs font-semibold text-muted-foreground">Cette semaine : {avancee.minutes} min, {avancee.jours} jour(s) actif(s), {avancee.quiz} quiz.</p>
      )}
      {edition ? (
        <div className="mt-4 flex flex-col gap-2 border-t border-primary/10 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {OBJECTIFS_TYPES.map((t) => (
              <button key={t.libelle} type="button" onClick={() => setO((x) => ({ ...x, minutes: t.minutes, jours: t.jours, quiz: t.quiz }))} className="h-8 rounded-full bg-secondary px-3 text-xs font-bold">
                {t.libelle}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {([['minutes', 'Minutes'], ['jours', 'Jours'], ['quiz', 'Quiz']] as const).map(([cle, lib]) => (
              <label key={cle} className="flex flex-col gap-1 text-xs font-bold">
                {lib}
                <input type="number" min={0} value={o[cle]} onChange={(e) => setO((x) => ({ ...x, [cle]: Number(e.target.value) }))} className="h-9 rounded-lg border bg-background px-2 text-sm" />
              </label>
            ))}
          </div>
          <input value={o.message} onChange={(e) => setO((x) => ({ ...x, message: e.target.value }))} maxLength={280} placeholder="Un mot d’encouragement (facultatif)" className="h-9 rounded-lg border bg-background px-3 text-sm" />
          {erreur ? <p className="text-xs font-bold text-(--destructive)">{erreur}</p> : null}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEdition(false)} className="h-9 rounded-full px-3 text-sm font-bold">
              Annuler
            </button>
            <button
              type="button"
              disabled={enCours}
              onClick={() =>
                demarrer(async () => {
                  const r = await fixerObjectifAction([eleveId], { ...o, message: o.message.trim() || null })
                  if (!r.ok) return setErreur(r.erreur)
                  setEdition(false)
                  router.refresh()
                })
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50"
            >
              {enCours ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              Enregistrer
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
