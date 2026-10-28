import { notFound } from 'next/navigation'
import Cahier from '@/components/exercices/Cahier'
import PageChapitre from '@/components/exercices/PageChapitre'
import type { LigneCahier } from '@/lib/exercices/cahier-server'

export const dynamic = 'force-dynamic'

// L'APERÇU DU CAHIER D'UN CHAPITRE — en développement seulement.
//
// Le sommaire du cahier (la plaque, le choix du niveau aux étoiles, la carte
// de l'exercice choisi, le contrôle blanc et le chapitre suivant) sans compte,
// sur des données de démonstration :
//
//   /dev/cahier             rien de fait : le premier est ouvert
//   /dev/cahier?reussis=2   deux réussis, le troisième ouvert
//   /dev/cahier?reussis=3   tout est réussi
//   /dev/cahier?gratuit=1   sans Studuel+ : tout sous cadenas

const TITRES = ['Le vélo et le parapluie de Mia', 'Un SMS dans le train', 'Le mail plein de fautes'] as const
const COMPETENCES = ['analyser-texte', 'analyser-texte', 'analyser-document'] as const

export default async function ApercuCahier({
  searchParams,
}: {
  searchParams: Promise<{ reussis?: string; gratuit?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const q = await searchParams
  const reussis = Math.min(3, Math.max(0, Number(q.reussis ?? 0) || 0))
  const premium = q.gratuit !== '1'

  const lignes: LigneCahier[] = TITRES.map((titre, i) => {
    const position = i + 1
    const etat = position <= reussis ? 'reussi' : position === reussis + 1 ? 'ouvert' : 'verrouille'
    return {
      id: `exo-${position}`,
      position,
      etoiles: position as 1 | 2 | 3,
      gemmes: [0, 0, 5][i],
      xp: [20, 35, 50][i],
      titre,
      competence: COMPETENCES[i] as LigneCahier['competence'],
      nbQuestions: 3 + i,
      etat,
      resultat: etat === 'reussi' ? { reussi: true, parfait: position === 1, meilleurScore: 5 + i, max: 6 + 2 * i } : null,
    }
  })

  return (
    <PageChapitre sousTitre="Anglais" titre="Exercices · Les déterminants" retour="/dev">
      <Cahier
        lignes={lignes}
        base="/dev/cahier"
        premium={premium}
        controle={premium}
        chapitreSuivant={premium ? { titre: 'Exprimer une quantité', href: '/dev/cahier' } : null}
      />
    </PageChapitre>
  )
}
