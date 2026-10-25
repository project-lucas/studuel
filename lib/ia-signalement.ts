// SIGNALER UNE RÉPONSE DE L'IA (25/10/2026, migration 597) — exigé par les
// règles de Google Play sur l'IA générative. Les règles pures : les raisons
// proposées à l'élève, la question à joindre, les messages de retour.

export type RaisonSignalement = 'faux' | 'choquant' | 'autre'

export const RAISONS_SIGNALEMENT: readonly { id: RaisonSignalement; libelle: string }[] = [
  { id: 'faux', libelle: 'C’est faux' },
  { id: 'choquant', libelle: 'C’est choquant' },
  { id: 'autre', libelle: 'Autre chose' },
]

export function estRaison(valeur: string): valeur is RaisonSignalement {
  return RAISONS_SIGNALEMENT.some((r) => r.id === valeur)
}

type MessageFil = { id: string; role: string; texte: string }

/** La dernière question de l'élève AVANT la réponse signalée ('' sinon). */
export function questionAvant(messages: readonly MessageFil[], idReponse: string): string {
  const i = messages.findIndex((m) => m.id === idReponse)
  for (let j = i - 1; j >= 0; j--) {
    if (messages[j].role === 'eleve') return messages[j].texte
  }
  return ''
}

const MESSAGES: Record<string, string> = {
  ok: 'Merci, c’est noté : l’équipe va relire cette réponse.',
  trop: 'Tu as déjà beaucoup signalé aujourd’hui : écris-nous si quelque chose ne va pas.',
  anonyme: 'Reconnecte-toi pour signaler cette réponse.',
  panne: 'Impossible pour le moment. Réessaie dans un instant.',
}

export function messageSignalement(code: string): string {
  return MESSAGES[code] ?? MESSAGES.panne
}
