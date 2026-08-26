import { ChevronDown, Clock, ExternalLink, MonitorPlay, Sparkles } from 'lucide-react'
import { CONSEILS } from '@/lib/parents-conseils'

export type ParentVideo = {
  id: string
  title: string
  description: string | null
  url: string
  theme: string
  duration: string | null
  position: number
}

/**
 * Le volet « Conseils » : ce que le parent peut FAIRE, une fois qu'il a vu les
 * chiffres du volet Suivi.
 *
 * POURQUOI LES FICHES PASSENT DEVANT LES VIDÉOS. Le volet ne contenait que la
 * liste `parent_videos` (migration 029). Cette table est vide en production :
 * un parent venu chercher de l'aide tombait donc sur « Les premières vidéos du
 * programme arrivent bientôt » — c'est-à-dire sur rien, et sur la promesse
 * qu'il y aurait quelque chose la prochaine fois. Les fiches écrites
 * (`lib/parents-conseils.ts`) sont du contenu réel, disponible dès la première
 * ouverture, sans dépendre d'aucune migration ni d'aucun tournage. Les vidéos
 * se posent AU-DESSUS quand elles existent : elles enrichissent le volet, elles
 * ne le remplissent plus.
 *
 * DÉPLIABLES EN `<details>` ET NON EN ÉTAT REACT. Six fiches ouvertes d'un bloc
 * font un mur de texte que personne ne lit ; six fiches repliées se parcourent
 * en dix secondes. Le `<details>` natif donne le clavier, la recherche dans la
 * page (Ctrl+F ouvre la fiche trouvée) et l'impression — trois choses qu'un
 * accordéon maison aurait fallu réécrire, sur un écran qui n'a besoin d'aucune
 * interactivité par ailleurs.
 */
export default function ConseilsPanel({ videos }: { videos: ParentVideo[] }) {
  return (
    <div className="flex flex-col gap-8">
      {videos.length > 0 ? (
        <section>
          <h2 className="font-heading mb-1 flex items-center gap-2 text-lg font-semibold">
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-xl">
              <MonitorPlay className="size-4" aria-hidden="true" />
            </span>
            Les vidéos du coach
          </h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Une sélection de vidéos courtes, préparée pour vous.
          </p>
          <ul className="flex flex-col gap-3">
            {videos.map((video, i) => (
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
        </section>
      ) : null}

      <section>
        <h2 className="font-heading mb-1 flex items-center gap-2 text-lg font-semibold">
          <span className="bg-highlight text-foreground flex size-8 items-center justify-center rounded-xl">
            <Sparkles className="size-4" strokeWidth={2.4} aria-hidden="true" />
          </span>
          Six repères qui changent tout
        </h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Ce que la recherche sur l&apos;apprentissage dit — et ce que ça change
          concrètement à la maison. Deux minutes de lecture chacune.
        </p>

        <ul className="flex flex-col gap-3">
          {CONSEILS.map((c) => (
            <li key={c.id}>
              <details className="bg-card group rounded-2xl border shadow-sm">
                <summary className="flex cursor-pointer list-none items-start gap-3 p-4">
                  <span className="min-w-0 flex-1">
                    <span className="text-muted-foreground mb-1 block text-[11px] font-bold tracking-wide uppercase">
                      {c.theme}
                    </span>
                    <span className="font-heading block text-balance font-bold">
                      {c.titre}
                    </span>
                    <span className="text-muted-foreground mt-1 block text-sm">
                      {c.resume}
                    </span>
                  </span>
                  <ChevronDown
                    className="text-muted-foreground mt-1 size-5 shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>

                <div className="border-t px-4 pt-3.5 pb-4">
                  {c.corps.map((p, i) => (
                    <p
                      key={i}
                      className="text-muted-foreground mb-2.5 text-sm leading-relaxed last:mb-0"
                    >
                      {p}
                    </p>
                  ))}
                  {/* L'ancrage referme la boucle conseil → app : un conseil qui
                      ne se rattache à rien de visible dans l'application est un
                      conseil que le parent ne peut pas appliquer. */}
                  <p className="border-primary/25 bg-primary/[0.04] mt-3.5 rounded-xl border-l-2 px-3.5 py-2.5 text-sm">
                    <span className="text-primary font-semibold">
                      Dans l&apos;app —{' '}
                    </span>
                    {c.ancrage}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
