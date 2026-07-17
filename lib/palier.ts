// -----------------------------------------------------------------------------
// Passages de palier à CÉLÉBRER — logique pure (convention projet). « Tout le
// monde est content quand on change de niveau » : quand l'élève franchit un
// palier (nouvelle arène à trophées, promotion de ligue hebdo), l'app le fête
// en plein écran et propose de partager (components/PalierCelebration.tsx).
// Ce module décide QUAND il y a palier et fabrique le contenu du message ;
// il sera réutilisé par l'échelle géographique (ville → département → région).
// -----------------------------------------------------------------------------

import { ARENAS, arenaFor, type Arena } from '@/lib/trophies'
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

// Franchissement d'arène VERS LE HAUT après un match classé. Si le match fait
// sauter plusieurs seuils d'un coup, on fête l'arène la plus haute atteinte.
export function arenaPalier(before: number, after: number): Palier | null {
  if (after <= before) return null
  const from = arenaFor(before)
  const to = arenaFor(after)
  if (from.id === to.id) return null
  return {
    id: `arene:${to.id}`,
    emoji: to.emoji,
    title: 'Nouvelle arène !',
    name: to.name,
    subtitle: `Tu entres dans l'arène ${to.name} — continue de gagner pour viser la suivante.`,
    shareText: `J'ai atteint l'arène ${to.emoji} ${to.name} sur Studuel !`,
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
    ...ARENAS.map((a: Arena) => `arene:${a.id}`),
    ...LEAGUE_TIERS.map((_, i) => `ligue:${i}`),
  ]
}
