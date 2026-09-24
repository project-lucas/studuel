import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { HeartHandshake } from 'lucide-react'
import BienvenueParent from '@/components/parents/BienvenueParent'
import ChildReport from '@/components/parents/ChildReport'
import ConseilsPanel, {
  type ParentVideo,
} from '@/components/parents/ConseilsPanel'
import EnfantsPanneaux from '@/components/parents/EnfantsPanneaux'
import EnteteParents from '@/components/parents/EnteteParents'
import LinkChildForm from '@/components/parents/LinkChildForm'
import OffrirStuduelPlus from '@/components/parents/OffrirStuduelPlus'
import ParentsSpaces from '@/components/parents/ParentsSpaces'
import ReglagesEnfant from '@/components/parents/ReglagesEnfant'
import { getSubjectsCached } from '@/lib/catalog'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { computeStreak, toDayKey, weekProgress } from '@/lib/streak'
import { childDisplayNames, type ChildDashboard } from '@/lib/parents'
import {
  clampParentPrefs,
  DEFAULT_PARENT_PREFS,
  type ParentPrefs,
} from '@/lib/parents-suivi'
import { sousTitreParents } from '@/lib/parents-entete'

export const metadata = { title: 'Espace parents — Studuel' }
export const dynamic = 'force-dynamic'

// L'espace parents, en trois volets (cf. components/parents/ParentsSpaces) :
//   Suivi     — ce que fait l'enfant, et ce qui l'attend (bilan en phrases et
//               gestes de la semaine, puis contrôles, objectif, tendance,
//               matières). À partir de deux enfants, une pastille par enfant.
//   Conseils  — ce que le parent peut faire : les fiches écrites, et les vidéos
//               du coach quand il y en a.
//   Réglages  — l'objectif hebdomadaire, l'alerte d'inactivité, la liaison,
//               et Studuel+ (le parent est le payeur).
//
// Depuis le 22/09/2026 l'espace n'a plus le chrome de l'élève (bandeau,
// onglets) : il porte son propre en-tête (EnteteParents). Cf. lib/quiz-chrome.

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
    .select('profile_type, full_name')
    .eq('id', user.id)
    .maybeSingle<{ profile_type: string | null; full_name: string | null }>()
  if (me?.profile_type === 'eleve') {
    redirect('/reviser')
  }
  const prenomParent =
    (me?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? '')
      .trim()
      .split(' ')[0] || null

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

  const enfants = reports.map((r) => ({ id: r.childId, nom: r.displayName }))
  const sousTitre = sousTitreParents(
    reports.map((r) => ({
      nom: r.displayName,
      lastActivity: r.dashboard?.last_activity ?? null,
    })),
    today,
  )

  // Le panneau de suivi d'UN enfant — carte pleine, ou carte d'erreur.
  const panneauSuivi = (r: (typeof reports)[number]) => {
    if (!r.dashboard) {
      return (
        <div
          role="alert"
          className="bg-card border-destructive/40 rounded-2xl border p-5 shadow-sm"
        >
          <h3 className="titre-section mb-1">{r.displayName} : données indisponibles</h3>
          <p className="text-muted-foreground text-sm">
            Le lien avec son compte est toujours actif — seul le détail
            n&apos;a pas pu être chargé. Réessayez en rechargeant la page.
          </p>
        </div>
      )
    }
    const activeDays = new Set(r.dashboard.active_days)
    const enfantQuery = enfants.length > 1 ? `&enfant=${r.childId}` : ''
    return (
      <ChildReport
        childId={r.childId}
        displayName={r.displayName}
        dashboard={r.dashboard}
        streak={computeStreak(activeDays, now)}
        week={weekProgress(activeDays, now)}
        prefs={prefsByChild.get(r.childId) ?? DEFAULT_PARENT_PREFS}
        subjectNames={subjectNames}
        today={today}
        reglagesHref={`/parents?volet=reglages${enfantQuery}`}
        conseilsHref="/parents?volet=conseils"
      />
    )
  }

  const panneauReglages = (r: (typeof reports)[number]) => (
    <div className="flex flex-col gap-4">
      <ReglagesEnfant
        childId={r.childId}
        childName={r.displayName}
        prefs={prefsByChild.get(r.childId) ?? DEFAULT_PARENT_PREFS}
        disponible={prefsDisponibles}
      />
      <OffrirStuduelPlus childName={r.displayName} contact={user.email ?? null} />
    </div>
  )

  return (
    <div className="bg-background min-h-svh">
      <EnteteParents prenom={prenomParent} sousTitre={sousTitre} />

      <div className="mx-auto w-full max-w-2xl px-4 py-6 md:px-8 md:py-8">
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
                    <h3 className="titre-section mb-1">
                      Suivi momentanément indisponible
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Nous n&apos;avons pas pu charger vos enfants liés. Rien
                      n&apos;est perdu : réessayez dans un moment en rechargeant
                      la page.
                    </p>
                  </div>
                ) : null}

                {reports.length === 0 && !listePerdue ? <BienvenueParent /> : null}

                {reports.length > 0 ? (
                  <EnfantsPanneaux
                    enfants={enfants}
                    panneaux={Object.fromEntries(
                      reports.map((r) => [r.childId, panneauSuivi(r)]),
                    )}
                  />
                ) : null}
              </section>
            }
            conseils={<ConseilsPanel videos={videos} />}
            reglages={
              <div className="flex flex-col gap-4">
                {reports.length > 0 ? (
                  <EnfantsPanneaux
                    enfants={enfants}
                    panneaux={Object.fromEntries(
                      reports.map((r) => [r.childId, panneauReglages(r)]),
                    )}
                  />
                ) : null}

                <section className="bg-card rounded-2xl border p-5 shadow-sm">
                  <h3 className="titre-section mb-1">
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
                    Vous avez aussi un compte élève ?{' '}
                    <Link
                      href="/reviser"
                      className="text-primary font-medium underline underline-offset-4"
                    >
                      Ouvrir l&apos;espace élève
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
