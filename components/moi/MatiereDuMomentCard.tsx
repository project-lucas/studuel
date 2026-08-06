import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { subjectInitials, subjectVignette } from '@/lib/subject-style'
import { vueHref } from '@/lib/coach/marcel-vues'
import type { MatiereDuMoment } from '@/lib/moi/matiere-du-moment'

// LA BANDE — le pic du scroll.
//
// C'était une carte blanche de plus, au milieu de quatre autres : le seul geste
// de l'écran avait exactement le même poids visuel que le bilan d'habitudes
// posé en dessous. Elle sort maintenant du cadre (pleine largeur, comme le
// panneau d'identité — deux ruptures dans la page, pas dix) et elle est le seul
// bloc qui porte une ILLUSTRATION : celle de la matière, débordant du bord
// droit, à la manière des cartes de Réviser.
//
// LE FOND RESTE CRÈME. Pas un pastel par matière : l'accueil Réviser a déjà
// tranché ce débat — six fonds pastel dispersaient l'écran.
//
// ET PAS DE BARRE D'ACCENT NON PLUS. Les cartes de Réviser en portent une : sur
// vingt-deux tuiles crème identiques, ces quelques pixels de couleur sont le
// seul moyen de reconnaître sa matière d'un coup d'œil. Ici il n'y en a QU'UNE
// à l'écran, avec son illustration et son nom en gros — la barre ne
// distinguerait plus rien de rien.
//
// UNE matière, jamais un tableau : le tableau chapitre par chapitre est l'écran
// « Progrès » de Marcel, et le dupliquer ici garantirait qu'un jour les deux se
// contredisent.
//
// PAS D'ÉTAT VIDE. Tant qu'aucun chapitre n'a été commencé, la bande ne
// s'affiche tout simplement pas : l'appel « Cocher mon programme » qui vivait
// là redisait, en plein milieu du scroll, ce que Marcel demande déjà sur son
// propre écran.

export default function MatiereDuMomentCard({
  matiere,
}: {
  matiere: MatiereDuMoment
}) {
  const urgence = matiere.ton === 'urgence'
  const vignette = subjectVignette(matiere.slug)

  return (
    <section
      aria-label="La matière du moment"
      className="moi-bande relative -mx-4 overflow-hidden md:-mx-8 md:rounded-3xl"
    >
      {/* L'illustration de la matière, débordant du bord droit : elle ancre la
          bande sur un objet réel plutôt que sur un aplat de couleur. Décorative
          — le nom porte le sens. */}
      {vignette ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={vignette}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-5 -bottom-3 w-32 max-w-[38%] opacity-95 drop-shadow-sm select-none sm:w-44"
        />
      ) : null}

      <div className="relative py-6 pr-28 pl-4 sm:pr-40 md:pl-8">
        {/* Le titre porte le VERBE. Une étiquette « À reprendre en premier »
            posée au-dessus du nom aurait dit la même chose en deux fois, et
            c'est toujours le titre qu'on lit. */}
        <h2 className="font-heading text-[26px] leading-[1.05] font-extrabold text-balance text-foreground">
          {urgence ? 'Reprends' : 'Entretiens'}
          <br />
          {matiere.name}
        </h2>

        <p className="mt-1.5 max-w-[17rem] text-sm leading-snug text-foreground/70">
          {matiere.raison}
        </p>

        {/* Le pourcentage et sa barre : la mesure, dite une seule fois. */}
        <div className="mt-3 flex max-w-[13rem] items-center gap-2">
          <span
            aria-hidden="true"
            className="block h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-foreground/10"
          >
            <span
              className={cn(
                'block h-full rounded-full',
                urgence ? 'bg-destructive' : 'bg-primary',
              )}
              style={{ width: `${Math.max(3, matiere.pct)}%` }}
            />
          </span>
          <span
            className={cn(
              'font-mono text-sm font-extrabold tabular-nums',
              urgence ? 'text-destructive' : 'text-primary',
            )}
          >
            {matiere.pct}%
          </span>
        </div>

        {/* La pilule chunky du système (`btn-chunky` : socle 3D + enfoncement
            à l'appui), pas une ombre dessinée pour l'occasion. */}
        <Button asChild size="lg" className="font-heading mt-4 font-extrabold">
          <Link href={`/reviser/${matiere.slug}`}>
            <span className="flex size-5 items-center justify-center rounded-full bg-white/25 text-[10px] font-extrabold">
              {subjectInitials(matiere.slug, matiere.name)}
            </span>
            Ouvrir la matière
            <ArrowRight className="size-4" strokeWidth={2.6} aria-hidden="true" />
          </Link>
        </Button>

        <Link
          href={vueHref('progres', matiere.slug)}
          className="mt-3 block text-xs font-bold text-foreground/55 underline underline-offset-2"
        >
          Voir tout mon programme
        </Link>
      </div>
    </section>
  )
}
