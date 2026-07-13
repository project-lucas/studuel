// Logique pure des duels EN TEMPS RÉEL (Supabase Realtime).
// Le transport (channel, broadcast, presence) vit dans le hook client
// components/useLiveDuel.ts ; ici, tout est pur et testable :
//   - l'ordre PARTAGÉ des questions (même graine → mêmes questions, même ordre
//     pour les deux joueurs) ;
//   - la fusion des manches déclarées par chaque camp en RoundResult[] ;
//   - le vainqueur, en réutilisant la logique BO3 de defi-modes.
import { duelWinner, seededRng, type RoundResult, type RoundWinner } from './defi-modes'

// Nom du canal Realtime d'un duel (les deux joueurs s'y abonnent).
export function channelName(duelId: string): string {
  return `duel-${duelId}`
}

// Ordonne les identifiants de questions de façon DÉTERMINISTE à partir d'une
// graine. Les deux joueurs, avec la même graine et la même liste, obtiennent
// exactement la même suite de questions — condition d'un duel équitable.
// Fisher-Yates alimenté par le PRNG graine de defi-modes. Ne mute pas l'entrée.
export function orderQuestionIds(ids: string[], seed: string): string[] {
  const out = ids.slice()
  const rng = seededRng(seed)
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Une manche déclarée par un camp via broadcast.
export type RoundRecord = {
  round: number // index de manche, 0-based
  correct: number // bonnes réponses
  timeMs: number // temps de la manche
}

// Fusionne les manches des deux camps en RoundResult[], dans l'ordre des
// manches, en ne gardant que celles où LES DEUX joueurs ont répondu.
export function mergeRounds(
  mine: RoundRecord[],
  theirs: RoundRecord[],
): RoundResult[] {
  const theirByRound = new Map<number, RoundRecord>()
  for (const r of theirs) theirByRound.set(r.round, r)

  const results: RoundResult[] = []
  for (const m of [...mine].sort((a, b) => a.round - b.round)) {
    const t = theirByRound.get(m.round)
    if (!t) continue
    results.push({
      me: m.correct,
      them: t.correct,
      myTimeMs: m.timeMs,
      theirTimeMs: t.timeMs,
    })
  }
  return results
}

// Vainqueur courant du duel live, ou null tant qu'aucun camp n'a gagné le BO3.
export function liveWinner(
  mine: RoundRecord[],
  theirs: RoundRecord[],
): RoundWinner | null {
  return duelWinner(mergeRounds(mine, theirs))
}

// Le duel est-il tranché ?
export function isLiveDecided(
  mine: RoundRecord[],
  theirs: RoundRecord[],
): boolean {
  return liveWinner(mine, theirs) !== null
}
