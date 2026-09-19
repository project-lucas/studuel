// Lire une table ENTIÈRE derrière PostgREST, page par page.
//
// LE PIÈGE (mesuré le 05/09/2026). Supabase plafonne chaque réponse à 1 000
// lignes (réglage « max rows » de l'API, valeur par défaut) : un `select()`
// sans `range()` rend les 1 000 premières lignes ET RIEN NE LE DIT — pas
// d'erreur, pas d'avertissement, `data` est simplement tronqué. Le catalogue
// a franchi ce seuil sans que personne ne le voie : 2 323 chapitres, 2 340
// leçons, 2 340 quiz, 18 262 questions. Conséquences vues à l'écran : Français
// et Maths de 6e annoncés « Bientôt — pas encore de chapitre » sur Réviser,
// des matières absentes de la roulette du Défi, la maîtrise calculée sur 43 %
// des quiz, le nombre de questions inconnu pour 95 % des quiz.
//
// Ce module est PUR (aucun import Supabase) : importable depuis un composant
// client sans embarquer supabase-js, testable sans base.

/** Taille de page de PostgREST (réglage Supabase « max rows », défaut 1 000). */
export const PAGE_POSTGREST = 1000

export type PageResult<T, E = unknown> = { data: T[] | null; error: E | null }

/**
 * Enchaîne les pages `[from, to]` jusqu'à une page incomplète et concatène.
 *
 * `page` reçoit les bornes INCLUSIVES attendues par `.range(from, to)`. La
 * requête doit être TRIÉE (`.order('id')` suffit) : sans ordre stable, deux
 * pages peuvent se chevaucher ou laisser un trou. À la première erreur, on
 * rend ce qui a été lu, avec l'erreur — l'appelant décide.
 */
export async function toutLire<T, E = unknown>(
  page: (from: number, to: number) => PromiseLike<PageResult<T, E>>,
  taillePage: number = PAGE_POSTGREST,
): Promise<{ data: T[]; error: E | null }> {
  const out: T[] = []
  for (let from = 0; ; from += taillePage) {
    const { data, error } = await page(from, from + taillePage - 1)
    if (error) return { data: out, error }
    const rows = data ?? []
    out.push(...rows)
    if (rows.length < taillePage) return { data: out, error: null }
  }
}
