import BackButton from '@/components/BackButton'
import SubjectIcon from '@/components/SubjectIcon'
import { cn } from '@/lib/utils'
import {
  subjectTheme,
  subjectDecor,
  subjectVignette,
  GRID_PATTERN,
} from '@/lib/subject-style'
import type { SubjectProgress } from '@/lib/subject-template'

// Header de la page matière : retour, icône + nom (depuis la base), niveau,
// progression globale « X/Y chapitres · Z% » + barre, et l'écusson du gardien en
// haut à droite. Le décor d'arène de la matière habille le fond quand il existe,
// sinon la tuile colorée du thème.
//
// Il portait aussi le solde de gemmes et la série : c'était un doublon du
// bandeau du haut, retiré le 2026-08-28 (cf. le bloc de l'écusson plus bas).
export default function SubjectHeader({
  subject,
  grade,
  progress,
  standing = null,
  gardien = null,
  unit = 'chapitre',
  discipline = null,
  children,
}: {
  subject: { slug: string; name: string; color: string }
  grade: string
  progress: SubjectProgress
  /**
   * Place de l'élève dans cette matière parmi son niveau (« Top 8 % des 3e »).
   * `null` tant qu'il n'a pas passé assez de quiz pour être classé, ou que la
   * cohorte de la matière est trop petite pour qu'un pourcentage soit honnête.
   */
  standing?: React.ReactNode
  /**
   * L'écusson du gardien de la matière (anneau de traque). Posé à GAUCHE des
   * monnaies : la jauge se remplit avec le travail de la page, elle doit se lire
   * sans changer d'onglet. `null` quand la traque est illisible.
   */
  gardien?: React.ReactNode
  /**
   * Le mot qui nomme une ligne du programme — « chapitre » à plat, « fiche »
   * quand la matière est rangée sous les chapitres du programme, où le mot
   * « chapitre » appartient alors aux quatre en-têtes de la liste (`chapterUnit`).
   */
  unit?: 'chapitre' | 'fiche'
  /**
   * Discipline ouverte (« Géographie ») dans une matière qui en réunit deux :
   * la ligne de programme dit alors ce que la barre compte, sans quoi elle
   * annoncerait le dossier entier au-dessus d'une demi-liste.
   */
  discipline?: string | null
  children?: React.ReactNode // barre d'onglets, rendue dans le monde coloré
}) {
  const theme = subjectTheme(subject.color)
  const decor = subjectDecor(subject.slug)
  const vignette = subjectVignette(subject.slug)

  return (
    <header
      className={cn(
        'relative overflow-hidden px-4 pt-20 pb-10 text-white md:px-8 md:pt-12',
        decor ? null : cn('arena-tile', theme.arena),
      )}
      style={
        decor
          ? {
              backgroundImage: `linear-gradient(to bottom, rgba(10,14,30,0.45), rgba(10,14,30,0.15) 45%, rgba(10,14,30,0.4)), url(${decor})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
            }
          : undefined
      }
    >
      {decor ? null : (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={GRID_PATTERN}
          aria-hidden="true"
        />
      )}
      <div className="relative mx-auto w-full max-w-4xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <BackButton fallback="/reviser" label="Retour aux matières" />

          {/* ⚠️ NI GEMMES NI SÉRIE ICI — c'était un DOUBLON du bandeau du haut.
              Le header portait le solde de gemmes et la flamme dans deux
              pastilles sombres. Mais `TopHud` affiche déjà les deux, à quelques
              pixels au-dessus et sur toutes les pages de l'app : l'élève lisait
              « 75 💎 · 1 🔥 » deux fois dans le même regard, dans deux habillages
              différents (verre sombre ici, pastilles crème là-haut), ce qui
              donnait à croire à deux compteurs distincts. Un solde ne se dit
              qu'à un seul endroit.

              L'écusson du GARDIEN reste : lui n'est nulle part ailleurs, et sa
              jauge se remplit avec le travail de CETTE page. */}
          <div className="flex items-center gap-2">{gardien}</div>
        </div>
        <div className="flex items-center gap-4">
          {/* LE MÉDAILLON DE LA MATIÈRE : son illustration, la même que sur sa
              carte de l'accueil Réviser — l'élève reconnaît son dossier à son
              dessin, pas à un pictogramme de trait blanc que six matières
              partagent (trois langues portaient le même). Le dessin est posé
              sur une plaque CRÈME et non sur le verre translucide d'avant :
              ces illustrations sont dessinées pour un fond clair, et sur le
              bandeau saturé leurs couleurs se seraient éteintes. */}
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
                // Le héros de l'écran : rien à différer, il est déjà à l'image.
                className="size-13 object-contain"
              />
            ) : (
              <>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-2 top-1 h-5 rounded-full bg-gradient-to-b from-white/40 to-transparent"
                />
                <SubjectIcon
                  slug={subject.slug}
                  className="size-7 drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.35)]"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
              </>
            )}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-3xl font-bold md:text-4xl">
              {subject.name}
            </h1>
            <p className="text-sm font-medium opacity-70">
              {discipline ?? 'Programme'} de {grade} ·{' '}
              {progress.done}/{progress.total} {unit}s · {progress.pct}%
            </p>
            {/* Sous la ligne de programme, qui dit où l'élève en est DANS la
                matière : celle-ci dit où il se situe PAR RAPPORT aux autres.
                Deux informations différentes, d'où deux lignes. */}
            {standing}
          </div>
        </div>

        {/* Barre de progression globale de la matière */}
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/25"
          role="progressbar"
          aria-label={`${discipline ?? subject.name} — ${progress.done} ${unit}s sur ${progress.total}, ${progress.pct}% travaillé`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress.pct}
        >
          <div
            className="bar-fill h-full rounded-full bg-highlight transition-all"
            style={{ width: `${progress.pct}%` }}
          />
        </div>

        {children}
      </div>
    </header>
  )
}
