// -----------------------------------------------------------------------------
// Passages de palier à CÉLÉBRER — logique pure (convention projet). « Tout le
// monde est content quand on change de niveau » : quand l'élève franchit un
// palier (nouvelle arène à trophées, promotion de ligue hebdo), l'app le fête
// en plein écran et propose de partager (components/PalierCelebration.tsx).
// Ce module décide QUAND il y a palier et fabrique le contenu du message ;
// il sera réutilisé par l'échelle géographique (ville → département → région).
// -----------------------------------------------------------------------------

import { RANK_TIERS, rankFor, type RankTier } from '@/lib/rank'
import { LEAGUE_TIERS, MAX_TIER, tierMeta } from '@/lib/league'

export type Palier = {
  /** Clé stable du palier — sert de mémoire « déjà fêté » (localStorage). */
  id: string
  emoji: string
  /** Cri de victoire (« Nouvelle arène ! », « Promotion ! »). */
  title: string
  /** Nom du palier atteint (« Tableau d'honneur », « Ligue Or »). */
  name: string
  /** Phrase de félicitation sous le nom. */
  subtitle: string
  /** Texte de partage (l'URL de l'app est ajoutée par le composant). */
  shareText: string
}

// Franchissement de PALIER de rang VERS LE HAUT après un match classé (Bronze →
// Argent → Or…). Si le match fait sauter plusieurs seuils d'un coup, on fête le
// palier le plus haut atteint.
//
// On ne fête QUE le changement de palier, pas le changement de division : une
// division vaut 100 trophées (3 à 8 victoires), une célébration plein écran à
// ce rythme serait une gêne plutôt qu'une récompense.
export function rankPalier(before: number, after: number): Palier | null {
  if (after <= before) return null
  const from = rankFor(before)
  const to = rankFor(after)
  if (from.tier.id === to.tier.id) return null
  return {
    id: `rang:${to.tier.id}`,
    emoji: to.tier.emoji,
    title: 'Nouveau palier !',
    name: to.tier.name,
    subtitle: `Tu entres chez les ${to.tier.name} — continue de gagner pour viser le palier suivant.`,
    shareText: `J'ai atteint le palier ${to.tier.emoji} ${to.tier.name} sur Studuel !`,
  }
}

// Promotion de ligue hebdomadaire. `previousTier` = dernier palier VU par
// l'élève (null si première visite : on ne fête pas, on mémorise seulement).
// La relégation ne se fête évidemment pas.
export function leaguePalier(
  previousTier: number | null,
  tier: number,
): Palier | null {
  if (previousTier === null) return null
  if (!Number.isFinite(tier) || tier <= previousTier) return null
  const meta = tierMeta(tier)
  const isTop = Math.min(Math.round(tier), MAX_TIER) === MAX_TIER
  return {
    id: `ligue:${Math.min(Math.round(tier), MAX_TIER)}`,
    emoji: meta.icon,
    title: 'Promotion !',
    name: meta.name,
    subtitle: isTop
      ? `Tu atteins la ${meta.name} — le sommet. Reste-y : les 5 derniers descendent chaque lundi.`
      : `Tu montes en ${meta.name} — top 5 de ta ligue cette semaine. La suivante t'attend.`,
    shareText: `Promotion en ${meta.icon} ${meta.name} sur Studuel !`,
  }
}

// Toutes les clés de palier possibles (utile aux tests : aucune collision).
export function allPalierIds(): string[] {
  return [
    ...RANK_TIERS.map((t: RankTier) => `rang:${t.id}`),
    ...LEAGUE_TIERS.map((_, i) => `ligue:${i}`),
  ]
}
