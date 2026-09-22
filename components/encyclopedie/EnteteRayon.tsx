import BackButton from '@/components/BackButton'
import { cn } from '@/lib/utils'
import { subjectTheme, subjectVignette, GRID_PATTERN } from '@/lib/subject-style'

// L'EN-TÊTE DE L'ENCYCLOPÉDIE — le même monde que le dossier de matière.
//
// Ce n'est pas `SubjectHeader` : celui-là porte une barre de PROGRESSION, et
// l'encyclopédie n'a rien à mesurer. Elle ne donne ni XP, ni gemmes, ni
// couronnes ; on la lit par curiosité, et une jauge à 0 % en tête d'un rayon de
// lecture serait un reproche pour rien.
//
// À la place, la ligne dit ce qu'il y a dedans : « 150 personnages ·
// 115 événements ». C'est une invitation, pas une note.
export default function EnteteRayon({
  subject,
  grade,
  personnages,
  evenements,
  children,
}: {
  subject: { slug: string; name: string; color: string }
  grade: string
  personnages: number
  evenements: number
  /** La barre d'onglets du dossier. */
  children?: React.ReactNode
}) {
  const theme = subjectTheme(subject.color)
  const vignette = subjectVignette(subject.slug)

  return (
    <header
      className={cn(
        'relative overflow-hidden px-4 pt-20 pb-10 text-white md:px-8 md:pt-12',
        'arena-tile',
        theme.arena,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={GRID_PATTERN}
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-4xl">
        <div className="mb-4 flex items-center gap-3">
          <BackButton
            fallback={`/reviser/${subject.slug}`}
            label="Retour au dossier"
          />
        </div>
        <div className="flex items-center gap-4">
          <span
            className={cn(
              'relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.2)] ring-1 ring-black/10',
              vignette ? 'bg-background' : cn('arena-tile', theme.arena),
            )}
          >
            {vignette ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vignette}
                alt=""
                aria-hidden="true"
                width={320}
                height={320}
                className="size-13 object-contain"
              />
            ) : (
              <span aria-hidden="true" className="text-3xl">
                📚
              </span>
            )}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-3xl font-bold md:text-4xl">
              Encyclopédie
            </h1>
            <p className="text-sm font-medium opacity-80">
              {personnages} personnages · {evenements} événements
            </p>
            <p className="text-xs font-medium opacity-60">
              {subject.name} · {grade}
            </p>
          </div>
        </div>

        {children}
      </div>
    </header>
  )
}
