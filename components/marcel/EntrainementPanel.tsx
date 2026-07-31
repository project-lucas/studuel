import Link from 'next/link'
import { ChevronRight, Timer } from 'lucide-react'
import { subjectInitials } from '@/lib/subject-style'
import {
  CONTROLE_MIN_QUESTIONS,
  controleHref,
  countPretes,
  type MatiereEntrainement,
} from '@/lib/coach/entrainement'

// « S'entraîner » — un contrôle par matière, au niveau de l'élève.
//
// Le contrôle est joué par l'examen blanc ciblé de Réviser : même chrono, même
// bilan par chapitre. Marcel oriente, il ne double pas le joueur.
//
// Les matières sans assez de questions restent affichées, grisées et EXPLIQUÉES.
// Un trou silencieux laisserait croire que la matière n'existe pas ; dit, il
// devient une information (et, côté équipe, une liste de contenu à produire).

export default function EntrainementPanel({
  matieres,
}: {
  matieres: MatiereEntrainement[]
}) {
  if (matieres.length === 0) {
    return (
      <p className="bg-card text-muted-foreground rounded-[20px] p-5 text-center text-[13px] leading-relaxed font-semibold">
        Choisis tes matières dans Réviser, et je te préparerai un contrôle pour
        chacune d’elles.
      </p>
    )
  }

  const pretes = countPretes(matieres)

  return (
    <div>
      <header className="mx-0.5 mb-1.5 flex items-center justify-between">
        <h2 className="font-heading text-[15px] font-extrabold">
          Un contrôle par matière
        </h2>
        <span className="text-muted-foreground text-xs font-extrabold">
          {pretes === 0
            ? 'aucune prête'
            : pretes === 1
              ? '1 matière prête'
              : `${pretes} matières prêtes`}
        </span>
      </header>

      <ul className="bg-card divide-foreground/8 divide-y rounded-[20px] px-3 shadow-[0_2px_0_rgba(36,48,79,.06),0_14px_26px_-22px_rgba(36,48,79,.9)]">
        {matieres.map((matiere) => {
          const initials = subjectInitials(matiere.slug, matiere.name)

          if (!matiere.pret) {
            return (
              <li
                key={matiere.slug}
                className="flex items-center gap-3 py-3 opacity-60"
              >
                <span className="bg-foreground/8 text-muted-foreground font-heading grid size-8 shrink-0 place-items-center rounded-xl text-[11px] font-extrabold">
                  {initials}
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block text-[13px] font-extrabold">{matiere.name}</b>
                  <span className="text-muted-foreground text-xs font-semibold">
                    {matiere.disponibles === 0
                      ? 'Pas encore de questions à ton niveau'
                      : `Seulement ${matiere.disponibles} questions — j’en veux ${CONTROLE_MIN_QUESTIONS} au minimum`}
                  </span>
                </span>
              </li>
            )
          }

          return (
            <li key={matiere.slug}>
              <Link
                href={controleHref(matiere.slug)}
                className="flex min-h-14 items-center gap-3 py-3"
              >
                <span className="bg-primary/12 text-primary font-heading grid size-8 shrink-0 place-items-center rounded-xl text-[11px] font-extrabold">
                  {initials}
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block text-[13px] font-extrabold">{matiere.name}</b>
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
                    <Timer aria-hidden="true" className="size-3.5" />
                    {matiere.questions} questions · {matiere.minutes} min
                  </span>
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="text-primary size-4 shrink-0"
                />
              </Link>
            </li>
          )
        })}
      </ul>

      <p className="text-muted-foreground mt-3 px-1 text-center text-xs leading-relaxed font-semibold">
        Chaque contrôle est chronométré et se termine par un bilan{' '}
        <b className="font-extrabold">chapitre par chapitre</b>. Ce n’est pas la
        note qui compte — c’est de savoir où ça a lâché.
      </p>
    </div>
  )
}
