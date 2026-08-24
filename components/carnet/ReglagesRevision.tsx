'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  TOLERANCES,
  TOLERANCE_LABEL,
  normalizeTolerance,
  type Tolerance,
} from '@/lib/carnet/correction'
import { updateCourseReglages } from '@/app/reviser/cours/actions'

/** Ce que la page du cours sait de ses réglages de révision. */
export type CourseReglages = {
  id: string
  newPerDay: number
  reviewsPerDay: number
  tolerance: string | null
  examOn: string | null
  subjectId: string | null
}

export type MatiereChoix = { id: string; name: string }

/** Jours restants avant une date (clé UTC), négatif si elle est passée. */
function joursAvant(dateIso: string): number {
  const cible = Date.parse(`${dateIso}T00:00:00Z`)
  if (Number.isNaN(cible)) return 0
  const aujourdhui = new Date()
  aujourdhui.setUTCHours(0, 0, 0, 0)
  return Math.round((cible - aujourdhui.getTime()) / 86_400_000)
}

function Bloc({
  titre,
  aide,
  children,
}: {
  titre: string
  aide?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="font-heading text-sm font-extrabold text-foreground">
        {titre}
      </p>
      {aide ? (
        <p className="mt-0.5 mb-1.5 text-[11px] font-semibold text-muted-foreground">
          {aide}
        </p>
      ) : (
        <div className="mb-1.5" />
      )}
      {children}
    </div>
  )
}

/**
 * Les réglages de RÉVISION d'un cours — ceux que l'onglet Paramètres n'avait
 * pas, parce que le moteur qui les rend utiles n'existait pas non plus.
 *
 * Quatre décisions, toutes prises jusqu'ici à la place de l'élève et jamais
 * les bonnes pour tout le monde :
 *
 *   • les PLAFONDS quotidiens — c'est le remède au mur de cartes dues, le
 *     premier motif d'abandon d'une révision espacée ;
 *   • la TOLÉRANCE orthographique — serrée en langues, large en histoire ;
 *   • la DATE du contrôle — elle donne un compte à rebours et un sens à la
 *     charge quotidienne ;
 *   • la MATIÈRE — c'est elle qui fait sortir le cours de l'île du carnet pour
 *     le poser à côté du programme officiel.
 */
export default function ReglagesRevision({
  reglages,
  matieres,
}: {
  reglages: CourseReglages
  matieres: MatiereChoix[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [nouvelles, setNouvelles] = useState(reglages.newPerDay)
  const [revisions, setRevisions] = useState(reglages.reviewsPerDay)
  const [tolerance, setTolerance] = useState<Tolerance>(
    normalizeTolerance(reglages.tolerance),
  )
  const [examen, setExamen] = useState(reglages.examOn ?? '')
  const [matiere, setMatiere] = useState(reglages.subjectId ?? '')
  const [enregistre, setEnregistre] = useState(false)

  const patch = (p: Parameters<typeof updateCourseReglages>[1]) => {
    if (pending) return
    setEnregistre(false)
    startTransition(async () => {
      const res = await updateCourseReglages(reglages.id, p)
      if (res.ok) {
        setEnregistre(true)
        router.refresh()
      }
    })
  }

  const restants = examen.length > 0 ? joursAvant(examen) : null

  return (
    <div className="flex flex-col gap-4">
      <Bloc
        titre="Cartes par jour"
        aide="Au-delà, la file s’arrête — mieux vaut vingt cartes faites que trois cents affichées."
      >
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 rounded-2xl bg-muted/40 p-2.5">
            <span className="text-[11px] font-bold text-muted-foreground">
              Nouvelles
            </span>
            <input
              type="number"
              min={0}
              max={200}
              value={nouvelles}
              onChange={(e) => setNouvelles(Number(e.target.value))}
              onBlur={() => patch({ newPerDay: nouvelles })}
              aria-label="Nouvelles cartes par jour"
              className="min-h-10 rounded-xl border border-black/10 bg-white px-3 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="flex flex-col gap-1 rounded-2xl bg-muted/40 p-2.5">
            <span className="text-[11px] font-bold text-muted-foreground">
              À revoir
            </span>
            <input
              type="number"
              min={0}
              max={500}
              value={revisions}
              onChange={(e) => setRevisions(Number(e.target.value))}
              onBlur={() => patch({ reviewsPerDay: revisions })}
              aria-label="Révisions par jour"
              className="min-h-10 rounded-xl border border-black/10 bg-white px-3 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>
        </div>
      </Bloc>

      <Bloc
        titre="Orthographe"
        aide="Sur les réponses écrites. « l’ONU » vaut toujours « ONU » — l’article n’est jamais la question."
      >
        <div className="flex flex-col gap-1.5">
          {TOLERANCES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tolerance === t}
              onClick={() => {
                sfx.tap()
                setTolerance(t)
                patch({ tolerance: t })
              }}
              className={cn(
                'cursor-pointer rounded-xl px-3 py-2 text-left text-xs font-extrabold transition',
                tolerance === t
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/60 text-foreground hover:bg-muted',
              )}
            >
              {TOLERANCE_LABEL[t]}
            </button>
          ))}
        </div>
      </Bloc>

      <Bloc titre="Date du contrôle" aide="Pour savoir combien de jours il reste.">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={examen}
            onChange={(e) => {
              setExamen(e.target.value)
              patch({ examOn: e.target.value || null })
            }}
            aria-label="Date du contrôle"
            className="min-h-11 min-w-0 flex-1 rounded-2xl border border-black/10 bg-white px-3 text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          />
          {restants !== null ? (
            <span
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-[11px] font-extrabold',
                restants < 0
                  ? 'bg-muted text-muted-foreground'
                  : restants <= 3
                    ? 'bg-destructive/15 text-destructive'
                    : 'bg-highlight/40 text-foreground',
              )}
            >
              {restants < 0
                ? 'passé'
                : restants === 0
                  ? "c'est aujourd'hui"
                  : `dans ${restants} j`}
            </span>
          ) : null}
        </div>
      </Bloc>

      <Bloc
        titre="Matière"
        aide="Rattaché à une matière, ce cours apparaît dans son dossier, à côté du programme."
      >
        <select
          value={matiere}
          onChange={(e) => {
            setMatiere(e.target.value)
            patch({ subjectId: e.target.value || null })
          }}
          aria-label="Matière du cours"
          className="min-h-11 w-full cursor-pointer rounded-2xl border border-black/10 bg-white px-3 text-sm font-semibold text-foreground"
        >
          <option value="">Aucune</option>
          {matieres.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </Bloc>

      {enregistre ? (
        <p className="text-center text-[11px] font-bold text-primary">
          Enregistré ✓
        </p>
      ) : null}
    </div>
  )
}
