// -----------------------------------------------------------------------------
// LA FORMULE STUDUEL+ — la colonne vertébrale de l'abonnement (15/10/2026).
//
// Lucas : « les gens veulent être suivis, guidés, que l'on pense pour eux,
// avant eux, qu'on les aide à comprendre — et Marcel doit être là pour ça ».
// Studuel+ tient donc en CINQ PILIERS, et ce module est leur source unique :
// la carte de la Boutique, la page `/plus`, les murs « réservé à Studuel+ » et
// la liste des avantages lisent tous d'ici.
//
//   1. MARCEL, le guide — un coach IA qui connaît le profil de l'élève (ses
//      lacunes, ses contrôles, son examen) et qui pense avant lui ;
//   2. LE MODE EXAMEN — brevet, bac de français (écrit et oral), bac ;
//   3. LES ANNALES CORRIGÉES — deux par matière en gratuit, toutes avec Studuel+ ;
//   4. LA RENTE DE GEMMES — 60 par semaine, soit 2 fiches de révision ;
//   5. LA PRÉPA DU SUPÉRIEUR — droit, économie, santé… pour devancer la L1.
//
// ⚠️ RÈGLE (celle de lib/premium) : un pilier n'est annoncé comme ACQUIS que
// s'il est réellement branché et gaté. Un pilier en construction porte
// `statut: 'bientot'` et l'écran le dit (« Bientôt »), il ne le vend pas.
//
// Module PUR : aucune requête, importable côté client.
// -----------------------------------------------------------------------------

import { CREDITS_MENSUELS } from '@/lib/coach/credits'
import { GEM_COST_CHAPTER } from '@/lib/gems'
import { FICHES_PAR_SEMAINE, RENTE_GEMMES_SEMAINE } from './rente'

/** Annales corrigées lisibles sans Studuel+, par matière et par classe. */
export const ANNALES_GRATUITES_PAR_MATIERE = 2

export type PilierId = 'marcel' | 'examen' | 'annales' | 'rente' | 'prepa'

export type Pilier = {
  id: PilierId
  /** Le nom court (titre de carte). */
  titre: string
  /** La promesse, en une ligne. */
  promesse: string
  /** Ce que ça change, en une ou deux phrases. */
  detail: string
  /** Où ça se passe. */
  href: string
  /** `ouvert` : branché et gaté ; `bientot` : la structure est là, pas le contenu. */
  statut: 'ouvert' | 'bientot'
  /** Ce que le GRATUIT en garde — un pilier n'est jamais un mur nu. */
  gratuit: string
}

export const PILIERS: readonly Pilier[] = [
  {
    id: 'marcel',
    titre: 'Marcel, ton guide',
    promesse: `${CREDITS_MENSUELS} crédits par mois pour lui parler`,
    detail:
      'Il connaît tes contrôles, tes points faibles et ton examen : il te dit quoi travailler avant que tu le demandes, et il t’explique jusqu’à ce que tu comprennes.',
    href: '/marcel',
    statut: 'ouvert',
    gratuit: 'Le point du jour et la méthode de chaque matière',
  },
  {
    id: 'examen',
    titre: 'Le mode examen',
    promesse: 'Brevet, bac de français, bac : le chemin jusqu’au jour J',
    detail:
      'Le compte à rebours, la phase où tu en es, ce qu’il faut faire cette semaine, les épreuves blanches chronométrées et la préparation des oraux.',
    href: '/examen',
    statut: 'ouvert',
    gratuit: 'Le calendrier et la liste des épreuves',
  },
  {
    id: 'annales',
    titre: 'Toutes les annales corrigées',
    promesse: 'Les vrais sujets, corrigés par Studuel',
    detail: 'Chaque sujet tombé, son corrigé partie par partie, les pièges et les points qui comptent.',
    href: '/examen#annales',
    statut: 'ouvert',
    gratuit: `${ANNALES_GRATUITES_PAR_MATIERE} annales corrigées par matière`,
  },
  {
    id: 'rente',
    titre: 'Ta rente de gemmes',
    promesse: `${RENTE_GEMMES_SEMAINE} gemmes par semaine, soit ${FICHES_PAR_SEMAINE} fiches offertes`,
    detail:
      'Ton coffre se remplit tout seul, une gemme toutes les 2 h 48. Récolte-le au moins une fois par semaine : plein, il ne pousse plus.',
    href: '/plus#rente',
    statut: 'ouvert',
    gratuit: 'Les gemmes des épreuves, des gardiens et des amis',
  },
  {
    id: 'prepa',
    titre: 'La prépa du supérieur',
    promesse: 'Droit, économie, santé, psycho… avant la L1',
    detail:
      'Les bases des études les plus choisies après le bac, pour arriver en première année en ayant déjà compris le vocabulaire et la méthode.',
    href: '/prepa-sup',
    statut: 'bientot',
    gratuit: 'Le programme de chaque filière',
  },
]

export function pilier(id: PilierId): Pilier {
  const p = PILIERS.find((x) => x.id === id)
  if (!p) throw new Error(`Pilier inconnu : ${id}`)
  return p
}

/**
 * Les avantages de la carte de la Boutique (lib/premium, plan « plus ») : les
 * piliers OUVERTS, puis ce que l'abonnement donnait déjà. Un pilier « bientôt »
 * n'y figure pas — on ne vend pas ce qui n'existe pas encore.
 */
export function avantagesStudueLPlus(): string[] {
  const piliers = PILIERS.filter((p) => p.statut === 'ouvert').map((p) => `${p.titre} : ${p.promesse.charAt(0).toLowerCase()}${p.promesse.slice(1)}`)
  return [
    ...piliers,
    'Ton avatar dessiné par Marcel, à ton idée',
    'Tous les quiz premium',
    'Les exercices de chapitre, corrigés et notés par l’IA',
  ]
}

/** « 30 gemmes la fiche » — rappelé partout où la rente parle de fiches. */
export const PRIX_FICHE_GEMMES = GEM_COST_CHAPTER
