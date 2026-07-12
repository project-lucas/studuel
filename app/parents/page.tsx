import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Clock,
  ExternalLink,
  HeartHandshake,
  LineChart,
  MonitorPlay,
} from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Espace parents — Scolaria' }
export const dynamic = 'force-dynamic'

// Espace parents : le « Programme » — une liste de vidéos préparée par le
// coach scolaire (gérée dans /admin) — et, bientôt, le suivi de l'enfant.
type ParentVideo = {
  id: string
  title: string
  description: string | null
  url: string
  theme: string
  duration: string | null
  position: number
}

export default async function ParentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Tolère une base sans la migration 029 : data vaut alors null et la
  // section affiche son message « arrive bientôt ».
  const { data: videos } = await supabase
    .from('parent_videos')
    .select('id, title, description, url, theme, duration, position')
    .order('position', { ascending: true })
    .returns<ParentVideo[]>()

  return (
    <div className="mx-auto w-full max-w-2xl">
      <PageHeader title="Espace parents" />
      <p className="text-muted-foreground -mt-2 mb-6 text-sm">
        Comprendre la méthode Scolaria et accompagner votre enfant au quotidien,
        avec les conseils du coach scolaire.
      </p>

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
          <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
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
                  className="flex items-start gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-colors hover:border-primary/50"
                >
                  <span className="bg-accent text-accent-foreground font-heading flex size-10 shrink-0 items-center justify-center rounded-xl font-bold">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-balance">
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

      {/* Suivi de l'enfant — à venir */}
      <section className="mb-8">
        <h2 className="font-heading mb-1 flex items-center gap-2 text-lg font-semibold">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-xl">
            <LineChart className="size-4" aria-hidden="true" />
          </span>
          Le suivi de votre enfant
        </h2>
        <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          Temps de travail, régularité, progrès par matière : le tableau de
          suivi arrive bientôt dans cet espace.
        </p>
      </section>

      {/* Rappel du rôle du parent */}
      <section className="rounded-2xl border bg-card p-4 shadow-sm">
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
          <Link href="/reviser" className="text-primary font-medium underline underline-offset-4">
            espace élève
          </Link>
        </p>
      </section>
    </div>
  )
}
