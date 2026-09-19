// -----------------------------------------------------------------------------
// L'ÉCHELLE — le classement d'une épreuve, tel que `mode_ladder` (352) le rend.
//
// Dix lignes plus la mienne, dans ma classe. Ce module normalise les lignes
// (la donnée vient du réseau), et décide de ce qui se DIT : la période
// (« cette semaine » / « de toujours »), le métal du podium, et la ligne de
// rupture quand je suis loin sous le top 10.
// -----------------------------------------------------------------------------
import type { AvatarConfig } from '@/lib/avatar'

export type Periode = 'semaine' | 'toujours'

export const PERIODES: readonly { id: Periode; label: string }[] = [
  { id: 'semaine', label: 'Cette semaine' },
  { id: 'toujours', label: 'De toujours' },
]

export type LigneEchelle = {
  rank: number
  name: string
  avatar: AvatarConfig | null
  score: number
  isMe: boolean
}

export function parseEchelle(raw: unknown): LigneEchelle[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap((row) => {
    if (!row || typeof row !== 'object') return []
    const r = row as Record<string, unknown>
    const rank = Number(r.rank)
    const score = Number(r.score)
    if (!Number.isFinite(rank) || rank < 1 || !Number.isFinite(score)) return []
    return [
      {
        rank: Math.round(rank),
        name: String(r.name ?? 'Un élève'),
        avatar:
          r.avatar && typeof r.avatar === 'object' && !Array.isArray(r.avatar)
            ? (r.avatar as AvatarConfig)
            : null,
        score: Math.round(score),
        isMe: r.is_me === true,
      },
    ]
  })
}

/** Le métal d'un rang : or, argent, bronze, ou rien. */
export type Metal = 'or' | 'argent' | 'bronze' | null

export function metalDuRang(rank: number): Metal {
  if (rank === 1) return 'or'
  if (rank === 2) return 'argent'
  if (rank === 3) return 'bronze'
  return null
}

/**
 * Où couper l'échelle : l'indice de la première ligne qui ne suit pas la
 * précédente (ma ligne, isolée sous le top 10). -1 quand tout se suit — la
 * liste s'affiche alors d'un bloc, sans « … ».
 */
export function indiceRupture(lignes: readonly LigneEchelle[]): number {
  for (let i = 1; i < lignes.length; i++) {
    if (lignes[i].rank > lignes[i - 1].rank + 1) return i
  }
  return -1
}

/** Ma ligne, ou null si je ne suis pas classé sur cette échelle. */
export function maLigne(lignes: readonly LigneEchelle[]): LigneEchelle | null {
  return lignes.find((l) => l.isMe) ?? null
}

/** Ce que dit l'échelle vide : personne n'a encore joué cette semaine. */
export function phraseEchelleVide(periode: Periode): string {
  return periode === 'semaine'
    ? 'Personne de ta classe n’a encore joué cette semaine. La première place est à prendre.'
    : 'Personne de ta classe n’a encore posé de score. Le premier record sera le tien.'
}
