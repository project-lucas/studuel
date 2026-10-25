// -----------------------------------------------------------------------------
// LE CAFÉ DE MARCEL (25/10/2026, Lucas : « les recharges de Marcel deviennent
// le café (dosette, grosse tasse…), c'est plus marrant de recharger Marcel
// avec du café qu'avec des capsules éclair ») — ex-« recharges » du
// 15/10/2026 : quand les cafés du mois sont bus, Marcel dort ; un café le
// réveille tout de suite. Les cafés achetés NE S'EFFACENT PAS à la fin du
// mois : ils attendent sous les cafés mensuels (ils ne servent qu'une fois
// ceux-ci épuisés — c'est la place des anciens « jetons de Prof », même solde,
// `coach_tokens.balance`).
//
// TROIS FORMATS, mêmes `id`, mêmes quantités et mêmes prix qu'avant (le seed
// de la 581 ne bouge pas, seul le NOM à l'écran change) :
//   « Dosette »       50 cafés   1,99 €   (ex-« Coup de pouce »)
//   « Grande tasse » 150 cafés   3,99 €   (ex-« Semaine de révisions »)
//   « Thermos »      400 cafés   7,99 €   (ex-« Pack examens »)
// Chaque format a son OBJET dessiné (public/images/marcel/cafe/<objet>.webp :
// la tasse fumante, la grande tasse au cœur de lait, le thermos) ; la dosette,
// elle, est l'ICÔNE du café partout (le compteur, le coût d'un outil).
//
// EN EUROS SEULEMENT (choix de Lucas, 15/10/2026) : les gemmes se gagnent en
// jouant — et désormais en rente —, les laisser acheter de l'IA reviendrait à
// payer le modèle avec une monnaie gratuite. La conversion gemmes → jetons de la
// 215 est FERMÉE par la migration 581. Dans la version Play, aucun euro n'est
// montré (`estAppPlay`, lib/canal) : le rayon n'y est pas monté.
//
// L'app n'encaisse encore aucun euro : comme un pack de gemmes, un café
// enregistre une DEMANDE (contact d'un parent) et l'admin la confirme
// (`accorder_recharge_marcel`) — demain, le webhook d'un prestataire.
//
// PRIX ET QUANTITÉS PROVISOIRES, miroir du seed de `recharges_marcel` (581) —
// un test compare les deux (id, quantité, prix ; le `titre` SQL garde l'ancien
// nom, il n'est lu par aucun écran). Le coût réel d'un café est mesuré dans
// lib/coach/cout.ts : même le thermos garde une marge énorme.
// -----------------------------------------------------------------------------

export type IdRecharge = 'coup-de-pouce' | 'semaine' | 'examens'

/** L'objet dessiné de chaque format (public/images/marcel/cafe/<objet>.webp). */
export type ObjetCafe = 'tasse' | 'grande-tasse' | 'thermos'

export type Recharge = {
  id: IdRecharge
  titre: string
  /** Ce que ça permet, en une ligne. */
  accroche: string
  /** Le nombre de cafés (la colonne `credits` de la 581 : le mot du code). */
  credits: number
  prixEuros: number
  objet: ObjetCafe
}

export const RECHARGES: readonly Recharge[] = [
  { id: 'coup-de-pouce', titre: 'Dosette', accroche: 'Pour finir un devoir', credits: 50, prixEuros: 1.99, objet: 'tasse' },
  { id: 'semaine', titre: 'Grande tasse', accroche: 'Pour préparer un contrôle', credits: 150, prixEuros: 3.99, objet: 'grande-tasse' },
  { id: 'examens', titre: 'Thermos', accroche: 'Pour le brevet ou le bac', credits: 400, prixEuros: 7.99, objet: 'thermos' },
]

export function rechargeParId(id: string): Recharge | null {
  return RECHARGES.find((r) => r.id === id) ?? null
}

/**
 * La PÉRIODE D'EXAMENS : du 15 avril au 30 juin (brevet, bac de français, bac),
 * et du 1er au 31 janvier (brevets et bacs blancs). Le Thermos y passe en tête
 * et prend le liseré d'or.
 */
export function enPeriodeExamens(date: Date): boolean {
  const m = date.getUTCMonth() + 1
  const j = date.getUTCDate()
  if (m === 1) return true
  if (m === 4) return j >= 15
  return m === 5 || m === 6
}

/** L'ordre d'affichage : le Thermos d'abord en période d'examens. */
export function rechargesDansLOrdre(date: Date): Recharge[] {
  if (!enPeriodeExamens(date)) return [...RECHARGES]
  return [...RECHARGES].sort((a, b) => Number(b.id === 'examens') - Number(a.id === 'examens'))
}

/** « 4 centimes le café » — ce qui rend un format lisible. */
export function prixParCafe(r: Recharge): string {
  const centimes = Math.round((r.prixEuros / r.credits) * 100)
  return centimes <= 1 ? 'moins de 2 centimes le café' : `${centimes} centimes le café`
}

/** @deprecated alias de `prixParCafe`. */
export const prixParQuestion = prixParCafe
