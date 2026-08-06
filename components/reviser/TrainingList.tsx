'use client'

import SupportChips from '@/components/reviser/SupportChips'
import type { TrainingRow } from '@/lib/subject-template'

/**
 * Onglet « Mode de jeu » : un chapitre par bloc, ses formats en pastilles.
 *
 * Remplace les quatre onglets Quiz / Flashcards / Cartes mentales / Défis, qui
 * listaient chacun les MÊMES chapitres — quatre scrolls de la même liste pour
 * changer d'exercice. Ici le chapitre est nommé une fois, et ce qu'on peut y
 * faire tient sur une ligne.
 */
export default function TrainingList({ rows }: { rows: TrainingRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">
        Aucun exercice pour l’instant dans cette matière.
      </p>
    )
  }

  return (
    <div className="mt-4 flex flex-col gap-5">
      {rows.map((row) => (
        <section key={row.chapterId} aria-labelledby={`entrainement-${row.chapterId}`}>
          <p className="text-sm font-semibold text-muted-foreground">
            Chapitre {row.position}
          </p>
          <h2
            id={`entrainement-${row.chapterId}`}
            className="font-heading mt-0.5 text-lg font-bold text-balance"
          >
            {row.title}
          </h2>
          <div className="mt-2.5">
            <SupportChips
              chips={row.chips}
              label={`S’entraîner sur ${row.title}`}
            />
          </div>
        </section>
      ))}
    </div>
  )
}
