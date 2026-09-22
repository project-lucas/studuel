import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import BienvenueParent from '@/components/parents/BienvenueParent'
import ChildReport from '@/components/parents/ChildReport'
import ConseilsPanel from '@/components/parents/ConseilsPanel'
import EnfantsPanneaux from '@/components/parents/EnfantsPanneaux'
import EnteteParents from '@/components/parents/EnteteParents'
import OffrirStuduelPlus from '@/components/parents/OffrirStuduelPlus'
import ParentsSpaces from '@/components/parents/ParentsSpaces'
import ReglagesEnfant from '@/components/parents/ReglagesEnfant'
import type { ChildDashboard } from '@/lib/parents'
import { DEFAULT_PARENT_PREFS } from '@/lib/parents-suivi'
import { sousTitreParents } from '@/lib/parents-entete'
import { computeStreak, toDayKey, weekProgress } from '@/lib/streak'

export const dynamic = 'force-dynamic'

// L'APERÇU DE L'ESPACE PARENTS — en développement seulement.
//
// L'espace ne s'ouvre qu'à un compte parent avec un enfant lié : pour relire
// l'en-tête, le bilan, les gestes et la rangée des enfants sans créer de
// comptes, cette page rend l'écran avec des données de démonstration (aucune
// base).
//
//   /dev/parents            deux enfants : l'une active, l'autre qui décroche
//   /dev/parents?vide=1     un parent sans enfant lié (la première visite)
export default async function ApercuParents({
  searchParams,
}: {
  searchParams: Promise<{ vide?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { vide } = await searchParams

  const now = new Date()
  const today = toDayKey(now)
  const jour = (n: number) => toDayKey(new Date(now.getTime() - n * 86_400_000))
  const lundi = (semainesAvant: number) => {
    const offset = (now.getUTCDay() + 6) % 7
    return toDayKey(new Date(now.getTime() - (offset + semainesAvant * 7) * 86_400_000))
  }

  const lea: ChildDashboard = {
    full_name: 'Léa',
    grade_level: '4e',
    work_seconds: 9 * 3600,
    week_seconds: 82 * 60,
    week_active_days: 4,
    active_days: [jour(0), jour(1), jour(2), jour(3), jour(6), jour(8), jour(9)],
    sessions_total: 46,
    sessions_7: 7,
    avg_ratio: 0.71,
    per_subject: [
      { subject: 'Mathématiques', ratio: 0.44, attempts: 8 },
      { subject: 'Histoire-Géo', ratio: 0.9, attempts: 6 },
      { subject: 'Anglais', ratio: 0.68, attempts: 5 },
      { subject: 'SVT', ratio: 0.55, attempts: 1 },
    ],
    weeks: [
      { start: lundi(3), seconds: 35 * 60, active_days: 2 },
      { start: lundi(2), seconds: 50 * 60, active_days: 3 },
      { start: lundi(1), seconds: 60 * 60, active_days: 3 },
      { start: lundi(0), seconds: 82 * 60, active_days: 4 },
    ],
    controles: [
      {
        id: 'c1',
        subject_slug: 'maths',
        chapters: [{ title: 'Le théorème de Pythagore' }, { title: 'Les puissances' }],
        exam_date: jour(-1),
      },
      { id: 'c2', subject_slug: 'histoire-geo', chapters: [{ title: 'La Révolution française' }], exam_date: jour(-9) },
    ],
    last_activity: jour(0),
  }

  const tom: ChildDashboard = {
    full_name: 'Tom',
    grade_level: '6e',
    work_seconds: 2 * 3600,
    week_seconds: 0,
    week_active_days: 0,
    active_days: [jour(5), jour(6), jour(12)],
    sessions_total: 9,
    sessions_7: 0,
    avg_ratio: 0.6,
    per_subject: [
      { subject: 'Français', ratio: 0.62, attempts: 4 },
      { subject: 'Mathématiques', ratio: 0.58, attempts: 3 },
    ],
    weeks: [
      { start: lundi(3), seconds: 20 * 60, active_days: 2 },
      { start: lundi(2), seconds: 45 * 60, active_days: 3 },
      { start: lundi(1), seconds: 15 * 60, active_days: 1 },
      { start: lundi(0), seconds: 0, active_days: 0 },
    ],
    controles: [],
    last_activity: jour(5),
  }

  const subjectNames = { maths: 'Mathématiques', 'histoire-geo': 'Histoire-Géo' }
  const enfants = vide
    ? []
    : [
        { id: 'lea', nom: 'Léa', dashboard: lea },
        { id: 'tom', nom: 'Tom', dashboard: tom },
      ]

  const sousTitre = sousTitreParents(
    enfants.map((e) => ({ nom: e.nom, lastActivity: e.dashboard.last_activity ?? null })),
    today,
  )

  const suivi = (e: (typeof enfants)[number]) => {
    const actifs = new Set(e.dashboard.active_days)
    return (
      <ChildReport
        childId={e.id}
        displayName={e.nom}
        dashboard={e.dashboard}
        streak={computeStreak(actifs, now)}
        week={weekProgress(actifs, now)}
        prefs={DEFAULT_PARENT_PREFS}
        subjectNames={subjectNames}
        today={today}
        reglagesHref={`/dev/parents?volet=reglages&enfant=${e.id}`}
        conseilsHref="/dev/parents?volet=conseils"
      />
    )
  }

  return (
    <div className="bg-background min-h-svh">
      <EnteteParents prenom="Marie" sousTitre={sousTitre} />
      <div className="mx-auto w-full max-w-2xl px-4 py-6 md:px-8 md:py-8">
        <Suspense fallback={null}>
          <ParentsSpaces
            suivi={
              enfants.length === 0 ? (
                <BienvenueParent />
              ) : (
                <EnfantsPanneaux
                  enfants={enfants.map((e) => ({ id: e.id, nom: e.nom }))}
                  panneaux={Object.fromEntries(enfants.map((e) => [e.id, suivi(e)]))}
                />
              )
            }
            conseils={<ConseilsPanel videos={[]} />}
            reglages={
              <EnfantsPanneaux
                enfants={enfants.map((e) => ({ id: e.id, nom: e.nom }))}
                panneaux={Object.fromEntries(
                  enfants.map((e) => [
                    e.id,
                    <div key={e.id} className="flex flex-col gap-4">
                      <ReglagesEnfant childId={e.id} childName={e.nom} prefs={DEFAULT_PARENT_PREFS} disponible />
                      <OffrirStuduelPlus childName={e.nom} contact="parent@exemple.fr" />
                    </div>,
                  ]),
                )}
              />
            }
          />
        </Suspense>
      </div>
    </div>
  )
}
