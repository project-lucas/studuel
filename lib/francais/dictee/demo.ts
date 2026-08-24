// -----------------------------------------------------------------------------
// LA DICTÉE DE DÉMONSTRATION.
//
// Le mode Dictée vit sur la migration 318. Tant qu'elle n'est pas exécutée, la
// table `dictees` n'existe pas et la liste est vide : on ne peut ni voir le
// parcours, ni savoir si c'est le CONTENU ou le CODE qui manque.
//
// Cette dictée-ci est servie depuis le code, uniquement quand la base ne rend
// rien. Elle est COURTE — trois morceaux — parce qu'elle sert à parcourir les
// cinq écrans en trente secondes, pas à travailler.
//
// ⚠️ Elle porte le badge « Aperçu » partout où elle s'affiche. C'est la règle du
// projet, écrite dans `AmisHome` : jamais de données de démonstration sans le
// dire. Un élève qui croirait avoir fait une vraie dictée chercherait sa note
// dans son historique et ne la trouverait pas — elle n'est écrite nulle part.
// -----------------------------------------------------------------------------

import type { NiveauDictee } from '@/lib/francais/dictee/niveaux'

/**
 * Identifiant de la démo. Ce n'est PAS un UUID, et c'est délibéré : toute
 * écriture en base le rejetterait, ce qui garantit qu'une tentative de démo ne
 * peut pas se glisser dans `dictee_attempts`.
 */
export const DEMO_DICTEE_ID = 'demo'
export const DEMO_DICTEE_SLUG = 'demo'

export type DicteeDemo = {
  id: string
  slug: string
  titre: string
  source: string
  niveau: NiveauDictee
  duree_min: number
  premium: boolean
  segments: { position: number; texte: string }[]
}

/**
 * Texte librement écrit pour la démonstration — pas un extrait d'auteur : il
 * n'a pas à être beau, il a à contenir les pièges qui rendent la correction
 * lisible (accord du participe, pluriel, homophone, apostrophe).
 */
export const DICTEE_DEMO: DicteeDemo = {
  id: DEMO_DICTEE_ID,
  slug: DEMO_DICTEE_SLUG,
  titre: 'La promenade du matin',
  source: 'Dictée de démonstration',
  niveau: 'debutant',
  duree_min: 2,
  premium: false,
  segments: [
    { position: 0, texte: 'Les enfants sont sortis de bonne heure.' },
    { position: 1, texte: 'Ils ont marché le long de la rivière,' },
    { position: 2, texte: 'et n’ont pas vu le temps passer.' },
  ],
}

/** Est-ce la dictée de démonstration ? */
export function estDemo(idOuSlug: string): boolean {
  return idOuSlug === DEMO_DICTEE_ID || idOuSlug === DEMO_DICTEE_SLUG
}

/** Le texte attendu de la démo — même recomposition que côté serveur. */
export function texteAttenduDemo(): string {
  return DICTEE_DEMO.segments.map((s) => s.texte).join(' ')
}
