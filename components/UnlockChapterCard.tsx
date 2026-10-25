'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import EcrinFiche from '@/components/fiche/EcrinFiche'
import type { ReponseDeblocage } from '@/components/fiche/ConfirmationFiche'
import { unlockChapterWithGem } from '@/app/reviser/[subject]/[chapter]/actions'
import type { RouleauFiche } from '@/lib/fiche-ecrin'

// L'écran de déverrouillage d'un chapitre — le moment où la gemme se dépense.
//
// Deux portes, jamais une seule : la gemme (gratuite, gagnée en invitant ou
// en battant les gardiens) ET l'abonnement, qui en verse chaque semaine. Un
// élève sans gemme ne doit pas se retrouver devant un mur : l'écrin lui dit ce
// qui manque et comment en gagner.
//
// DEPUIS LE 25/10/2026, l'intérieur est l'ÉCRIN (components/fiche/EcrinFiche,
// cadrage « le jeu vivant » § H) : la fiche roulée sur son plateau, le bouton
// d'or, la confirmation en pop-up, l'ouverture animée. Ce composant ne fait
// plus que brancher la Server Action et recharger la page au succès — le
// serveur a ouvert le chapitre, on va chercher le vrai contenu, qu'on n'avait
// volontairement pas chargé jusqu'ici.
export default function UnlockChapterCard({
  chapterId,
  gems,
  titre,
  rouleau,
  debloquer,
  children,
}: {
  chapterId: string
  gems: number
  /** Le titre du chapitre, écrit sur l'écrin. */
  titre?: string | null
  /** L'illustration du rouleau si le serveur l'a trouvée (lib/fiche-ecrin-server). */
  rouleau?: RouleauFiche | null
  /** Développement seulement : une dépense de démonstration à la place de la Server Action. */
  debloquer?: (chapterId: string) => Promise<ReponseDeblocage>
  /** L'aperçu flouté affiché derrière (un leurre, jamais le vrai contenu). */
  children: React.ReactNode
}) {
  const router = useRouter()
  const action = debloquer ?? unlockChapterWithGem
  const depenser = useCallback(() => action(chapterId), [action, chapterId])
  const rafraichir = useCallback(() => router.refresh(), [router])

  return (
    <div className="relative">
      <div aria-hidden="true">{children}</div>

      <div className="absolute inset-0 flex items-center justify-center px-3">
        <EcrinFiche titre={titre} gems={gems} rouleau={rouleau} debloquer={depenser} onOuverte={rafraichir} />
      </div>
    </div>
  )
}
