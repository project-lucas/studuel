import { notFound } from 'next/navigation'
import Cahier from '@/components/exercices/Cahier'
import type { LigneCahier } from '@/lib/exercices/cahier-server'

export const dynamic = 'force-dynamic'

// L'APERÇU DU SOMMAIRE DU CAHIER — en développement seulement : les trois
// états d'un exercice (réussi sans faute, ouvert avec un essai raté,
// verrouillé), puis la même page vue sans Studuel+.
const LIGNES: LigneCahier[] = [
  {
    id: 'a',
    position: 1,
    etoiles: 1,
    gemmes: 5,
    xp: 20,
    titre: 'Les crêpes de la kermesse',
    competence: 'calculer',
    nbQuestions: 3,
    etat: 'reussi',
    resultat: { reussi: true, parfait: true, meilleurScore: 6, max: 6 },
  },
  {
    id: 'b',
    position: 2,
    etoiles: 2,
    gemmes: 10,
    xp: 35,
    titre: 'Deux tarifs pour la piscine',
    competence: 'resoudre',
    nbQuestions: 4,
    etat: 'ouvert',
    resultat: { reussi: false, parfait: false, meilleurScore: 3, max: 8 },
  },
  {
    id: 'c',
    position: 3,
    etoiles: 3,
    gemmes: 15,
    xp: 50,
    titre: 'Le plan de la cabane',
    competence: 'modeliser',
    nbQuestions: 5,
    etat: 'verrouille',
    resultat: null,
  },
]

export default function ApercuCahier() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <div className="flex flex-col gap-10 pb-24">
      <Cahier lignes={LIGNES} base="/dev/exercices" premium controle />
      <Cahier lignes={LIGNES.map((l) => ({ ...l, etat: l.position === 1 ? 'ouvert' : 'verrouille', resultat: null }))} base="/dev/exercices" premium={false} controle={false} />
    </div>
  )
}
