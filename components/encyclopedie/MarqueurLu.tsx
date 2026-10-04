'use client'

import { useEffect } from 'react'
import { marquerLue } from '@/lib/encyclopedie/lues'
import { lireFicheEncyclopedie } from '@/app/reviser/[subject]/encyclopedie/actions'
import { useRecompenses } from '@/components/recompenses/RecompensesProvider'

/** Le temps de lecture, onglet visible, avant que la fiche compte comme lue (557). */
const LECTURE_MS = 20_000

// Le seul brin de JavaScript de la page d'une fiche : il note, dans le
// navigateur, que cette fiche a été ouverte — pour la coche verte de la liste —
// et, au bout de vingt secondes de lecture, verse ses 5 XP (557), qui volent
// vers le bandeau.
//
// Il ne rend RIEN. Le reste de la fiche est du HTML serveur, et doit le
// rester : c'est trois mille mots de texte, il n'y a pas une interaction
// dedans, et la faire dépendre de l'hydratation serait payer du JavaScript
// pour afficher un livre.
export default function MarqueurLu({ id }: { id: string }) {
  const { celebrer } = useRecompenses()

  useEffect(() => {
    marquerLue(id)
  }, [id])

  useEffect(() => {
    let lu = 0
    let vivant = true
    const pas = 1_000
    const minuterie = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      lu += pas
      if (lu < LECTURE_MS) return
      clearInterval(minuterie)
      lireFicheEncyclopedie(id)
        .then((gains) => {
          if (vivant) celebrer(gains)
        })
        .catch(() => {
          // Hors ligne : la fiche reste lue, l'XP se gagnera à la prochaine lecture.
        })
    }, pas)
    return () => {
      vivant = false
      clearInterval(minuterie)
    }
  }, [id, celebrer])

  return null
}
