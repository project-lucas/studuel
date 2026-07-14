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
  // Contient de la publicité (le gratuit).
  withAds: boolean
  // Avantages listés, dans l'ordre d'affichage.
  features: string[]
  // Libellé du bouton d'action.
  cta: string
}

// Le cœur de l'offre payante (demande de Lucas) : cartes illimitées + famille
// jusqu'à 3 membres. Le reste habille la proposition façon Duolingo.
export const PLANS: readonly Plan[] = [
  {
    id: 'gratuit',
    name: 'Gratuit',
    tagline: 'Pour démarrer, avec quelques pubs.',
    priceMonthly: 0,
    members: 1,
    recommended: false,
    withAds: true,
    features: [
      'Le Défi du jour',
      'Cours & quiz de base',
      'Cartes mentales limitées',
      'Avec publicités',
    ],
    cta: 'Ton offre actuelle',
  },
  {
    id: 'plus',
    name: 'Studuel+',
    tagline: 'Tout Studuel, sans limite ni pub.',
    priceMonthly: 4.99,
    members: 1,
    recommended: true,
    withAds: false,
    features: [
      'Cartes mentales & flashcards illimitées',
      'Tous les tests premium',
      'Zéro publicité',
      'Énergie & vies illimitées',
      'Statistiques détaillées',
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
    withAds: false,
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
