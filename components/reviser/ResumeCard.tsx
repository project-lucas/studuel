'use client'

import { ArrowRight, Clock3 } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { minutesLabel, type ChapterRow, type ResumeCta } from '@/lib/subject-template'

/**
 * LA PORTE D'ENTRÉE DU DOSSIER — « On commence par ça », comme sur l'accueil.
 *
 * À l'arrivée dans un dossier, l'élève lisait « 0/41 fiches · 0 % » puis une
 * liste ; le seul repère était le « + » jaune d'une ligne parmi quarante, et le
 * libellé « Commencer / Reprendre » que le serveur calcule (`resumeCta`)
 * n'était écrit nulle part. Cette carte le dit en un regard : quel geste
 * (commencer ou reprendre), quelle fiche, dans quel chapitre, pour combien de
 * temps.
 *
 * C'est un BOUTON, pas un lien : il déplie la fiche à sa place dans la liste
 * et y amène l'écran. Les supports se choisissent là (cours, quiz…), comme pour
 * n'importe quelle autre fiche — la carte ne court-circuite pas la liste, elle
 * y conduit. Même robe violette que la carte de l'accueil : c'est la même
 * recommandation, faite à l'échelle du dossier.
 */
export default function ResumeCard({
  resume,
  chapter,
  onSelect,
}: {
  resume: ResumeCta
  /** La fiche désignée par `resume` — sa ligne du programme. */
  chapter: ChapterRow
  onSelect: () => void
}) {
  const duree = chapter.minutes !== null ? minutesLabel(chapter.minutes) : null
  const details = [chapter.theme, duree].filter(Boolean).join(' · ')

  return (
    <section aria-label="Par où commencer" className="mt-4">
      <h2 className="font-heading mb-2 px-1 text-sm font-bold tracking-wide text-muted-foreground uppercase">
        On commence par ça
      </h2>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          onSelect()
        }}
        aria-label={`${resume.label} : ${chapter.title}${details ? ` — ${details}` : ''}`}
        className="rev-card rev-appel group flex w-full cursor-pointer items-center gap-3.5 rounded-[1.75rem] bg-primary p-3.5 text-left text-primary-foreground ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Le geste, en étiquette : « Commencer » pour une fiche jamais
              ouverte, « Reprendre » pour une fiche entamée. */}
          <span className="w-fit rounded-full bg-white/18 px-2 py-0.5 text-[10px] font-extrabold text-primary-foreground ring-1 ring-white/25">
            {resume.label}
          </span>
          <span className="font-heading line-clamp-2 text-base leading-tight font-extrabold text-balance">
            {chapter.title}
          </span>
          {details ? (
            <span className="flex min-w-0 items-center gap-2 text-[11px] font-bold text-primary-foreground/75">
              {chapter.theme ? (
                <span className="min-w-0 truncate">{chapter.theme}</span>
              ) : null}
              {chapter.theme && duree ? <span aria-hidden="true">·</span> : null}
              {duree ? (
                <span className="inline-flex shrink-0 items-center gap-1">
                  <Clock3 className="size-3" aria-hidden="true" />
                  {duree}
                </span>
              ) : null}
            </span>
          ) : null}
        </span>
        <ArrowRight
          aria-hidden="true"
          className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5"
          strokeWidth={2.6}
        />
      </button>
    </section>
  )
}
