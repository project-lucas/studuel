// Offres d'abonnement Studuel — catalogue PUR, source unique des prix et des
// avantages affichés sur l'onglet de conversion (« Trésor » → Premium).
// Modifier les prix / libellés ICI : la page ne fait que rendre ce catalogue.
//
// NB : les prix ci-dessous sont des valeurs de départ à confirmer par Lucas
// (aucune tarification n'était figée dans le code ni le PRD).

import type { Tier } from '@/lib/subscription'

export type PlanId = 'gratuit' | 'plus' | 'famille'

export type Plan = {
  id: PlanId
  name: string
  tagline: string
  // Prix mensuel en euros (0 = gratuit). Affiché via formatPrice.
  priceMonthly: number
  // Nombre de comptes couverts par l'offre.
  members: number
  // Offre mise en avant (bandeau « RECOMMANDÉ », carte surlignée).
  recommended: boolean
  // Avantages listés, dans l'ordre d'affichage.
  features: string[]
  // Libellé du bouton d'action.
  cta: string
}

// Le cœur de l'offre payante (demande de Lucas) : cartes illimitées + famille
// jusqu'à 3 membres.
//
// ⚠️ RÈGLE : chaque ligne de `features` doit correspondre à quelque chose de
// RÉELLEMENT implémenté ET gaté dans le code. Trois promesses ont été retirées
// parce qu'elles ne tenaient à rien :
//   • « Énergie & vies illimitées » — il n'existe aucun système d'énergie, et
//     les vies du Défi solo sont une règle de jeu interne à une partie, pas une
//     ressource bridée qu'un abonnement débloquerait ;
//   • « Statistiques détaillées » — l'onglet Moi affiche les mêmes statistiques
//     à tout le monde, ce n'est pas un différenciateur ;
//   • « Zéro publicité » / « Avec publicités » — il n'y a aucune publicité dans
//     l'app. Annoncer qu'on en retire donne au gratuit un défaut imaginaire.
// Vendre du vide est le meilleur moyen de faire résilier un parent au premier
// mois. Ce qui reste ci-dessous est vérifiable écran par écran.
export const PLANS: readonly Plan[] = [
  {
    id: 'gratuit',
    name: 'Gratuit',
    tagline: 'Pour démarrer, sans rien payer.',
    priceMonthly: 0,
    members: 1,
    recommended: false,
    features: [
      'Le Défi du jour',
      'Cours & quiz de base',
      '3 gemmes offertes pour débloquer des chapitres',
      'Gagne des gemmes en invitant tes amis',
    ],
    cta: 'Ton offre actuelle',
  },
  {
    id: 'plus',
    name: 'Studuel+',
    tagline: 'Tout Studuel, sans limite.',
    priceMonthly: 4.99,
    members: 1,
    recommended: true,
    features: [
      'Toutes les cartes mentales, sans gemme',
      'Toutes les fiches de révision',
      'Tous les quiz & flashcards premium',
      'Tous les paquets de cartes du Studio',
    ],
    cta: 'Passer à Studuel+',
  },
  {
    id: 'famille',
    name: 'Studuel+ Famille',
    tagline: 'Le meilleur prix, jusqu’à 3 enfants.',
    priceMonthly: 9.99,
    members: 3,
    recommended: false,
    features: [
      'Tout Studuel+ pour chacun',
      'Jusqu’à 3 membres',
      'Tableau de bord parent',
      'Meilleur prix par personne',
    ],
    cta: 'Choisir Famille',
  },
]

// Prix affiché : « 4,99 € » (virgule française) ou « Gratuit ».
export function formatPrice(euros: number): string {
  if (euros <= 0) return 'Gratuit'
  return `${euros.toFixed(2).replace('.', ',')} €`
}

// Prix par membre et par mois — argument clé de l'offre Famille.
export function pricePerMember(plan: Plan): number {
  const members = Math.max(1, plan.members)
  return plan.priceMonthly / members
}

// À quel plan correspond le niveau d'abonnement actuel de l'élève.
export function planForTier(tier: Tier): PlanId {
  switch (tier) {
    case 'tier3':
      return 'famille'
    case 'tier1':
    case 'tier2':
      return 'plus'
    default:
      return 'gratuit' // anonymous | free
  }
}

// L'élève est-il déjà sur ce plan ? (pour désactiver son propre bouton)
export function isCurrentPlan(planId: PlanId, tier: Tier): boolean {
  return planForTier(tier) === planId
}
