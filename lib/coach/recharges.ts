// -----------------------------------------------------------------------------
// LES RECHARGES DE MARCEL (15/10/2026) — « comme pour Claude » : quand les
// crédits du mois sont passés, Marcel dort ; une recharge le réveille tout de
// suite. Les crédits rechargés NE S'EFFACENT PAS à la fin du mois : ils
// attendent sous les crédits mensuels (ils ne servent qu'une fois ceux-ci
// épuisés — c'est la place des anciens « jetons de Prof », même solde,
// `coach_tokens.balance`).
//
// EN EUROS SEULEMENT (choix de Lucas, 15/10/2026) : les gemmes se gagnent en
// jouant — et désormais en rente —, les laisser acheter de l'IA reviendrait à
// payer le modèle avec une monnaie gratuite. La conversion gemmes → jetons de la
// 215 est FERMÉE par la migration 581.
//
// L'app n'encaisse encore aucun euro : comme un pack de gemmes, une recharge
// enregistre une DEMANDE (contact d'un parent) et l'admin la confirme
// (`accorder_recharge_marcel`) — demain, le webhook d'un prestataire.
//
// PRIX ET QUANTITÉS PROVISOIRES, miroir du seed de `recharges_marcel` (581) —
// un test compare les deux. Le coût réel d'un crédit est mesuré dans
// lib/coach/cout.ts : même la plus grosse recharge garde une marge énorme.
// -----------------------------------------------------------------------------

export type IdRecharge = 'coup-de-pouce' | 'semaine' | 'examens'

export type Recharge = {
  id: IdRecharge
  titre: string
  /** Ce que ça permet, en une ligne. */
  accroche: string
  credits: number
  prixEuros: number
}

export const RECHARGES: readonly Recharge[] = [
  { id: 'coup-de-pouce', titre: 'Coup de pouce', accroche: 'Pour finir un devoir', credits: 50, prixEuros: 1.99 },
  { id: 'semaine', titre: 'Semaine de révisions', accroche: 'Pour préparer un contrôle', credits: 150, prixEuros: 3.99 },
  { id: 'examens', titre: 'Pack examens', accroche: 'Pour le brevet ou le bac', credits: 400, prixEuros: 7.99 },
]

export function rechargeParId(id: string): Recharge | null {
  return RECHARGES.find((r) => r.id === id) ?? null
}

/**
 * La PÉRIODE D'EXAMENS : du 15 avril au 30 juin (brevet, bac de français, bac),
 * et du 1er au 31 janvier (brevets et bacs blancs). Le Pack examens y passe en
 * tête et prend le liseré d'or.
 */
export function enPeriodeExamens(date: Date): boolean {
  const m = date.getUTCMonth() + 1
  const j = date.getUTCDate()
  if (m === 1) return true
  if (m === 4) return j >= 15
  return m === 5 || m === 6
}

/** L'ordre d'affichage : le Pack examens d'abord en période d'examens. */
export function rechargesDansLOrdre(date: Date): Recharge[] {
  if (!enPeriodeExamens(date)) return [...RECHARGES]
  return [...RECHARGES].sort((a, b) => Number(b.id === 'examens') - Number(a.id === 'examens'))
}

/** « 4 centimes la question » — ce qui rend une recharge lisible. */
export function prixParQuestion(r: Recharge): string {
  const centimes = Math.round((r.prixEuros / r.credits) * 100)
  return centimes <= 1 ? 'moins de 2 centimes la question' : `${centimes} centimes la question`
}
