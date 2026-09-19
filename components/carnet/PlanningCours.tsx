'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, Clock, Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import type { CourseChapter } from '@/lib/carnet-cours'
import {
  libelleJours,
  libelleSession,
  proposerAvantControle,
  type DossierCandidat,
  type Plan,
} from '@/lib/carnet/planning'
import PlanSheet, { type DossierChoix } from '@/components/carnet/PlanSheet'
import { appliquerProposition } from '@/app/carnet/cours/planning-actions'

/**
 * L'ONGLET PLANNING D'UN COURS : les rendez-vous posés sur ses dossiers, un
 * bouton pour en poser un, et — quand une date de contrôle est renseignée —
 * la proposition d'un planning à rebours (l'audit du carnet, point 16).
 *
 * Un plan se lit en une ligne : le dossier, les jours et l'heure, la session.
 * Taper dessus l'ouvre pour le modifier ou le retirer.
 */
export default function PlanningCours({
  courseId,
  chapters,
  plans,
  examOn,
  cartesParChapitre,
  today,
}: {
  courseId: string
  chapters: CourseChapter[]
  plans: Plan[]
  /** Date du contrôle (YYYY-MM-DD) ou null. */
  examOn: string | null
  /** Nombre de cartes jouables par chapitre (clé = id du chapitre). */
  cartesParChapitre: Record<string, number>
  /** Clé de jour UTC d'aujourd'hui. */
  today: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [feuille, setFeuille] = useState<{ plan: Plan | null; dossier: string | null } | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Les dossiers, aplatis dans l'ordre de l'arbre, avec leur profondeur.
  const dossiers = useMemo<DossierChoix[]>(() => {
    const parId = new Map<string, CourseChapter>()
    for (const c of chapters) parId.set(c.id, c)
    const enfants = (parent: string | null) =>
      chapters.filter((c) => c.parentChapterId === parent).sort((a, b) => a.position - b.position)
    const liste: DossierChoix[] = [{ id: null, titre: 'Tout le cours', profondeur: 0 }]
    const descendre = (parent: string | null, profondeur: number) => {
      for (const c of enfants(parent)) {
        liste.push({ id: c.id, titre: c.title, profondeur })
        descendre(c.id, profondeur + 1)
      }
    }
    descendre(null, 1)
    return liste
  }, [chapters])

  const titreDe = (chapterId: string | null) =>
    chapterId === null ? 'Tout le cours' : (chapters.find((c) => c.id === chapterId)?.title ?? 'Dossier')

  // La proposition à rebours, calculée sur les dossiers de premier niveau
  // (un plan par grand dossier ; les sous-dossiers suivent leur parent).
  const proposition = useMemo(() => {
    if (!examOn) return []
    const racines = chapters.filter((c) => c.parentChapterId === null)
    const candidats: DossierCandidat[] = racines.map((c) => ({
      chapterId: c.id,
      titre: c.title,
      cartes: cartesSousArbre(c.id, chapters, cartesParChapitre),
    }))
    if (candidats.length === 0) {
      const total = Object.values(cartesParChapitre).reduce((s, n) => s + n, 0)
      candidats.push({ chapterId: null, titre: 'Tout le cours', cartes: total })
    }
    return proposerAvantControle(examOn, today, candidats)
  }, [examOn, chapters, cartesParChapitre, today])

  const appliquer = () => {
    sfx.tap()
    setMessage(null)
    startTransition(async () => {
      const r = await appliquerProposition(courseId, proposition)
      if (!r.ok) {
        setMessage(r.message ?? 'Le planning n’a pas pu être posé.')
        return
      }
      sfx.complete()
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-heading text-sm font-extrabold text-foreground">Mes rendez-vous</p>
        <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">
          Un chapitre, des jours, une heure : tes rendez-vous de révision pour ce dossier.
        </p>
      </div>

      {plans.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-border px-4 py-5 text-center text-sm text-muted-foreground">
          Aucun rendez-vous encore. Pose le premier sur le dossier qui te fait le plus peur.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {plans.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setFeuille({ plan: p, dossier: p.chapterId })
                }}
                className="flex w-full items-center gap-3 rounded-2xl border-2 border-border bg-card px-3 py-2.5 text-left transition-transform active:scale-[0.98]"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <CalendarDays className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-extrabold">{titreDe(p.chapterId)}</span>
                  <span className="block text-xs font-semibold text-muted-foreground">
                    <Clock className="mr-1 inline size-3 align-[-1px]" aria-hidden="true" />
                    {libelleJours(p)} · {libelleSession(p)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Button
        variant="secondary"
        onClick={() => {
          sfx.tap()
          setFeuille({ plan: null, dossier: null })
        }}
        className="h-11 font-extrabold"
      >
        <Plus className="size-4" aria-hidden="true" /> Planifier un dossier
      </Button>

      {examOn && proposition.length > 0 ? (
        <div className="rounded-2xl bg-highlight/20 p-3">
          <p className="font-heading flex items-center gap-1.5 text-sm font-extrabold">
            <Sparkles className="size-4" aria-hidden="true" /> Jusqu’au contrôle
          </p>
          <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
            Un rendez-vous par dossier d’ici le {formatDate(examOn)}, et la révision générale la veille.
          </p>
          <ul className="mt-2 flex flex-col gap-1 text-xs font-semibold">
            {proposition.map((p) => (
              <li key={`${p.chapterId ?? 'tout'}`} className="flex justify-between gap-2">
                <span className="truncate">{p.titre}</span>
                <span className="shrink-0 text-muted-foreground">{libelleJours({ days: p.days, time: null })}</span>
              </li>
            ))}
          </ul>
          <Button onClick={appliquer} disabled={pending} className={cn('mt-3 h-10 w-full font-extrabold')}>
            Poser ce planning
          </Button>
          {message ? (
            <p role="alert" className="mt-2 text-xs font-semibold text-destructive">
              {message}
            </p>
          ) : null}
        </div>
      ) : null}

      {feuille ? (
        <PlanSheet
          key={feuille.plan?.id ?? 'nouveau'}
          open
          onClose={() => setFeuille(null)}
          courseId={courseId}
          dossiers={dossiers}
          initial={feuille.plan}
          dossierInitial={feuille.dossier}
        />
      ) : null}
    </div>
  )
}

function cartesSousArbre(
  chapterId: string,
  chapters: readonly CourseChapter[],
  cartes: Record<string, number>,
): number {
  let total = cartes[chapterId] ?? 0
  for (const c of chapters) {
    if (c.parentChapterId === chapterId) total += cartesSousArbre(c.id, chapters, cartes)
  }
  return total
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
}
