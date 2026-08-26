import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { HeartHandshake } from 'lucide-react'
import ChildReport from '@/components/parents/ChildReport'
import ConseilsPanel, {
  type ParentVideo,
} from '@/components/parents/ConseilsPanel'
import LinkChildForm from '@/components/parents/LinkChildForm'
import ParentsSpaces from '@/components/parents/ParentsSpaces'
import ReglagesEnfant from '@/components/parents/ReglagesEnfant'
import { getSubjectsCached } from '@/lib/catalog'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { computeStreak, toDayKey, weekProgress } from '@/lib/streak'
import { GRID_PATTERN } from '@/lib/subject-style'
import { childDisplayNames, type ChildDashboard } from '@/lib/parents'
import {
  clampParentPrefs,
  DEFAULT_PARENT_PREFS,
  type ParentPrefs,
} from '@/lib/parents-suivi'

export const metadata = { title: 'Espace parents — Studuel' }
export const dynamic = 'force-dynamic'

// L'espace parents, en trois volets (cf. components/parents/ParentsSpaces) :
//   Suivi     — ce que fait l'enfant, et ce qui l'attend (contrôles, objectif,
//               tendance, matières).
//   Conseils  — ce que le parent peut faire : les fiches écrites, et les vidéos
//               du coach quand il y en a.
//   Réglages  — l'objectif hebdomadaire, l'alerte d'inactivité, la liaison.
//
// L'écran était auparavant un seul rouleau où ces trois contenus se
// succédaient : le formulaire de liaison passait devant le tableau de bord
// chez un parent qui avait déjà lié son enfant, et le suivi repoussait les
// conseils hors de l'écran.

type ChildRow = { child_id: string; full_name: string | null }

type PrefsRow = {
  child_id: string
  weekly_goal_minutes: number
  alert_after_days: number
}

export default async function ParentsPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  // Garde de rôle : l'espace parents ne s'ouvre pas à un compte élève (le code
  // de liaison est le même que le code ami partagé en classe — cf. migration
  // 172). Un parent a profile_type 'parent' (ou NULL legacy) ; un élève 'eleve'.
  const { data: me } = await supabase
    .from('profiles')
    .select('profile_type')
    .eq('id', user.id)
    .maybeSingle()
  if ((me as { profile_type?: string | null } | null)?.profile_type === 'eleve') {
    redirect('/reviser')
  }

  // Enfants liés. On tolère une base sans la migration 044 (RPC absente =
  // PGRST202) : l'écran se replie alors sur « aucun enfant lié ». Toute AUTRE
  // erreur est une panne, et la faire passer pour « vous n'avez pas d'enfant
  // lié » est le pire message possible pour un parent qui en a lié un.
  const { data: childrenData, error: childrenError } = await supabase.rpc(
    'parent_children_overview',
  )
  const listePerdue = Boolean(childrenError) && childrenError?.code !== 'PGRST202'
  if (childrenError) {
    console.error('[parents] liste des enfants:', childrenError.message)
  }
  const children = (childrenData ?? []) as ChildRow[]
  // Deux enfants sans prénom (ou deux homonymes) affichaient exactement la même
  // carte : on numérote ce qui est ambigu, et seulement ça. Les noms sont
  // dérivés de la LISTE, pas du tableau de bord, pour rester corrects même sur
  // une carte d'erreur (où le tableau de bord est justement absent).
  const displayNames = childDisplayNames(children.map((c) => c.full_name))

  // Le catalogue (slug → nom de matière), les vidéos et les réglages se
  // chargent EN PARALLÈLE des tableaux de bord : ce sont trois lectures
  // indépendantes, les enchaîner n'ajoutait que de l'attente.
  const [reports, subjects, videosResult, prefsResult] = await Promise.all([
    Promise.all(
      children.map(async (child, i) => {
        const { data, error } = await supabase.rpc('child_dashboard', {
          p_child: child.child_id,
        })
        // Même règle : une carte qui DISPARAÎT sans un mot laisse croire au
        // parent que le lien a sauté. On garde l'entrée et on le dit.
        if (error) {
          console.error('[parents] tableau de bord enfant:', error.message)
        }
        return {
          childId: child.child_id,
          displayName: displayNames[i],
          dashboard: (data as ChildDashboard | null) ?? null,
        }
      }),
    ),
    getSubjectsCached(),
    // Vidéos du coach (tolère une base sans la migration 029). Bornée : le
    // programme est une liste éditoriale — au-delà de 50 entrées, c'est le
    // contenu qu'il faut trier.
    supabase
      .from('parent_videos')
      .select('id, title, description, url, theme, duration, position')
      .order('position', { ascending: true })
      .limit(50)
      .returns<ParentVideo[]>(),
    // Réglages du parent (migration 319). Absente = la table n'existe pas
    // encore : on tombe sur les valeurs par défaut, et le volet Réglages le
    // dit plutôt que d'offrir un formulaire qui ne mènerait nulle part.
    supabase
      .from('parent_prefs')
      .select('child_id, weekly_goal_minutes, alert_after_days')
      .eq('parent_id', user.id)
      .returns<PrefsRow[]>(),
  ])

  const videos = videosResult.data ?? []
  const prefsDisponibles = !prefsResult.error
  if (prefsResult.error) {
    console.error('[parents] réglages:', prefsResult.error.message)
  }
  const prefsByChild = new Map<string, ParentPrefs>(
    (prefsResult.data ?? []).map((row) => [
      row.child_id,
      clampParentPrefs({
        weeklyGoalMinutes: row.weekly_goal_minutes,
        alertAfterDays: row.alert_after_days,
      }),
    ]),
  )

  const subjectNames = Object.fromEntries(
    subjects.map((s) => [s.slug, s.name]),
  ) as Record<string, string>

  const now = new Date()
  const today = toDayKey(now)

  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      {/* Hero violet : le suivi des enfants, façon espace famille */}
      <header className="bg-primary text-primary-foreground relative overflow-hidden px-4 pt-20 pb-10 md:px-8 md:pt-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={GRID_PATTERN}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-2xl">
          <h1 className="font-heading text-3xl font-bold text-balance md:text-4xl">
            Suivi de vos enfants
          </h1>
          <p className="mt-2 max-w-prose text-sm opacity-90">
            Le temps de travail, la régularité et les progrès par matière — mis à
            jour à chaque session. Les résultats peuvent mettre un moment à
            s&apos;actualiser.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-8">
        {/* `useSearchParams` (le volet actif vit dans l'URL) impose une
            frontière Suspense sur une page rendue au serveur. */}
        <Suspense fallback={null}>
          <ParentsSpaces
            suivi={
              <section>
                {listePerdue ? (
                  <div
                    role="alert"
                    className="bg-card border-destructive/40 mb-4 rounded-2xl border p-5 shadow-sm"
                  >
                    <h3 className="mb-1 font-semibold">
                      Suivi momentanément indisponible
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Nous n&apos;avons pas pu charger vos enfants liés. Rien
                      n&apos;est perdu : réessayez dans un moment en rechargeant
                      la page.
                    </p>
                  </div>
                ) : null}

                {reports.length === 0 && !listePerdue ? (
                  <div className="bg-card rounded-2xl border p-5 shadow-sm">
                    <h3 className="font-heading mb-1 text-lg font-semibold">
                      Aucun enfant lié pour l&apos;instant
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Saisissez le code affiché dans l&apos;application de votre
                      enfant : son temps de travail, ses contrôles à venir et
                      ses résultats par matière apparaîtront ici.
                    </p>
                    <LinkChildForm />
                  </div>
                ) : null}

                {reports.map(({ childId, displayName, dashboard }) => {
                  if (!dashboard) {
                    return (
                      <div
                        key={childId}
                        role="alert"
                        className="bg-card border-destructive/40 mb-4 rounded-2xl border p-5 shadow-sm"
                      >
                        <h3 className="mb-1 font-semibold">
                          {displayName} : données indisponibles
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Le lien avec son compte est toujours actif — seul le
                          détail n&apos;a pas pu être chargé. Réessayez en
                          rechargeant la page.
                        </p>
                      </div>
                    )
                  }
                  const activeDays = new Set(dashboard.active_days)
                  return (
                    <ChildReport
                      key={childId}
                      childId={childId}
                      displayName={displayName}
                      dashboard={dashboard}
                      streak={computeStreak(activeDays, now)}
                      week={weekProgress(activeDays, now)}
                      prefs={prefsByChild.get(childId) ?? DEFAULT_PARENT_PREFS}
                      subjectNames={subjectNames}
                      today={today}
                      reglagesHref="/parents?volet=reglages"
                    />
                  )
                })}
              </section>
            }
            conseils={<ConseilsPanel videos={videos} />}
            reglages={
              <div className="flex flex-col gap-4">
                {reports.map(({ childId, displayName }) => (
                  <ReglagesEnfant
                    key={childId}
                    childId={childId}
                    childName={displayName}
                    prefs={prefsByChild.get(childId) ?? DEFAULT_PARENT_PREFS}
                    disponible={prefsDisponibles}
                  />
                ))}

                <section className="bg-card rounded-2xl border p-5 shadow-sm">
                  <h3 className="mb-1 font-semibold">
                    {reports.length === 0
                      ? 'Lier le compte de votre enfant'
                      : 'Lier un autre enfant'}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Saisissez le code de votre enfant pour suivre ses progrès
                    ici.
                  </p>
                  <LinkChildForm />
                </section>

                {/* Rappel du rôle du parent : il ferme le volet des réglages
                    plutôt que le suivi, parce que c'est de la doctrine et non
                    un chiffre — sa place est là où l'on décide, pas là où l'on
                    consulte. */}
                <section className="bg-card rounded-2xl border p-5 shadow-sm">
                  <h2 className="font-heading mb-2 flex items-center gap-2 font-semibold">
                    <HeartHandshake
                      className="text-primary size-5"
                      aria-hidden="true"
                    />
                    Votre rôle en trois gestes
                  </h2>
                  <ul className="text-muted-foreground list-inside space-y-1 text-sm">
                    <li>
                      <strong className="text-foreground">Un cadre</strong> : un
                      moment calme et régulier pour les sessions, plutôt court
                      que long.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Des encouragements
                      </strong>{' '}
                      : valorisez la série de jours travaillés, pas seulement
                      les notes.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        De l&apos;autonomie
                      </strong>{' '}
                      : laissez votre enfant chercher avant d&apos;aider —
                      c&apos;est là qu&apos;il apprend.
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-3 text-xs">
                    Retour à l&apos;application :{' '}
                    <Link
                      href="/reviser"
                      className="text-primary font-medium underline underline-offset-4"
                    >
                      espace élève
                    </Link>
                  </p>
                </section>
              </div>
            }
          />
        </Suspense>
      </div>
    </div>
  )
}
