import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Clock, ExternalLink, HeartHandshake, MonitorPlay } from 'lucide-react'
import ChildReport from '@/components/parents/ChildReport'
import LinkChildForm from '@/components/parents/LinkChildForm'
import { createClient } from '@/lib/supabase/server'
import { computeStreak, weekProgress } from '@/lib/streak'
import { GRID_PATTERN } from '@/lib/subject-style'
import type { ChildDashboard } from '@/lib/parents'

export const metadata = { title: 'Espace parents — Studuel' }
export const dynamic = 'force-dynamic'

// Espace parents : le suivi réel de l'enfant (temps, régularité, matières),
// le « Programme » — des vidéos préparées par le coach (gérées dans /admin) —
// et un rappel du rôle du parent.
type ParentVideo = {
  id: string
  title: string
  description: string | null
  url: string
  theme: string
  duration: string | null
  position: number
}

type ChildRow = { child_id: string; full_name: string | null }

export default async function ParentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
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

  // Enfants liés (tolère une base sans la migration 044 : data = null).
  const { data: childrenData } = await supabase.rpc('parent_children_overview')
  const children = (childrenData ?? []) as ChildRow[]

  const reports: { childId: string; dashboard: ChildDashboard | null }[] =
    await Promise.all(
      children.map(async (child) => {
        const { data } = await supabase.rpc('child_dashboard', {
          p_child: child.child_id,
        })
        return {
          childId: child.child_id,
          dashboard: (data as ChildDashboard | null) ?? null,
        }
      }),
    )

  // Vidéos du coach (tolère une base sans la migration 029).
  const { data: videos } = await supabase
    .from('parent_videos')
    .select('id, title, description, url, theme, duration, position')
    .order('position', { ascending: true })
    .returns<ParentVideo[]>()

  const now = new Date()

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
      {/* Suivi de l'enfant */}
      <section className="mb-8">
        {reports.map(({ childId, dashboard }) => {
          if (!dashboard) return null
          const activeDays = new Set(dashboard.active_days)
          const streak = computeStreak(activeDays, now)
          const week = weekProgress(activeDays, now)
          return (
            <ChildReport
              key={childId}
              childId={childId}
              dashboard={dashboard}
              streak={streak}
              week={week}
            />
          )
        })}

        {/* Toujours proposer de lier un (autre) enfant. */}
        <div className="bg-card rounded-2xl border p-5 shadow-sm">
          <h3 className="mb-1 font-semibold">
            {reports.length === 0
              ? 'Lier le compte de votre enfant'
              : 'Lier un autre enfant'}
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Saisissez le code de votre enfant pour suivre ses progrès ici.
          </p>
          <LinkChildForm />
        </div>
      </section>

      {/* Programme : vidéos du coach */}
      <section className="mb-8">
        <h2 className="font-heading mb-1 flex items-center gap-2 text-lg font-semibold">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-xl">
            <MonitorPlay className="size-4" aria-hidden="true" />
          </span>
          Le programme
        </h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Une sélection de vidéos courtes, préparée pour vous par le coach
          scolaire.
        </p>

        {(videos ?? []).length === 0 ? (
          <p className="text-muted-foreground rounded-2xl border border-dashed p-6 text-center text-sm">
            Les premières vidéos du programme arrivent bientôt.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {(videos ?? []).map((video, i) => (
              <li key={video.id}>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card hover:border-primary/50 flex items-start gap-4 rounded-2xl border p-4 shadow-sm transition-colors"
                >
                  <span className="bg-accent text-accent-foreground font-heading flex size-10 shrink-0 items-center justify-center rounded-xl font-bold">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-balance font-semibold">
                      {video.title}
                    </span>
                    {video.description ? (
                      <span className="text-muted-foreground mt-0.5 block text-sm">
                        {video.description}
                      </span>
                    ) : null}
                    <span className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium">
                      <span className="bg-muted rounded-full px-2 py-0.5">
                        {video.theme}
                      </span>
                      {video.duration ? (
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" aria-hidden="true" />
                          {video.duration}
                        </span>
                      ) : null}
                    </span>
                  </span>
                  <ExternalLink
                    className="text-muted-foreground mt-1 size-4 shrink-0"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Rappel du rôle du parent */}
      <section className="bg-card rounded-2xl border p-4 shadow-sm">
        <h2 className="font-heading mb-2 flex items-center gap-2 font-semibold">
          <HeartHandshake className="text-primary size-5" aria-hidden="true" />
          Votre rôle en trois gestes
        </h2>
        <ul className="text-muted-foreground list-inside space-y-1 text-sm">
          <li>
            <strong className="text-foreground">Un cadre</strong> : un moment
            calme et régulier pour les sessions, plutôt court que long.
          </li>
          <li>
            <strong className="text-foreground">Des encouragements</strong> :
            valorisez la série de jours travaillés, pas seulement les notes.
          </li>
          <li>
            <strong className="text-foreground">De l&apos;autonomie</strong> :
            laissez votre enfant chercher avant d&apos;aider — c&apos;est là
            qu&apos;il apprend.
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
    </div>
  )
}
