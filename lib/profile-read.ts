import type { SupabaseClient } from '@supabase/supabase-js'

// -----------------------------------------------------------------------------
// Lecture du profil en UNE requête, sans renoncer aux « colonnes tardives ».
//
// La discipline du projet — isoler chaque colonne issue d'une migration pas
// encore exécutée pour qu'elle ne fasse pas tomber tout le profil — était
// appliquée en multipliant les `select` : `/reviser` en lançait 4, `/moi` 3,
// `/amis` 3. Quatre requêtes sur la MÊME ligne de la MÊME table, chacune avec
// son aller-retour PostgREST et son passage de policy RLS.
//
// Ici : une seule requête avec toutes les colonnes. Si l'une manque, Postgres
// répond `42703 — column profiles.x does not exist` en nommant la coupable ;
// on la retire et on réessaie. Le nom retenu est mémorisé pour le processus,
// donc la dégradation coûte un aller-retour supplémentaire UNE fois, puis plus
// jamais. Migration exécutée → un redéploiement repart d'une ardoise vierge.
// -----------------------------------------------------------------------------

// Colonnes déjà constatées absentes en base (par table). Global au processus :
// c'est un fait sur le schéma, identique pour tous les élèves.
const knownMissing = new Map<string, Set<string>>()

const missingFor = (table: string): Set<string> => {
  const set = knownMissing.get(table) ?? new Set<string>()
  if (!knownMissing.has(table)) knownMissing.set(table, set)
  return set
}

// « column profiles.tutorial_completed does not exist » → 'tutorial_completed'
export function parseMissingColumn(message: string | undefined): string | null {
  if (!message) return null
  const m = /column\s+(?:[\w.]+\.)?"?([\w]+)"?\s+does not exist/i.exec(message)
  return m ? m[1] : null
}

// Colonnes demandées, moins celles qu'on sait absentes.
export function narrowColumns(columns: string[], missing: Set<string>): string[] {
  return columns.filter((c) => !missing.has(c))
}

/**
 * Lit une ligne d'une table par sa clé primaire en demandant `columns`, en
 * retirant automatiquement les colonnes que le schéma ne connaît pas encore.
 * Les colonnes absentes ressortent simplement à `undefined`, comme le faisait
 * le `select` isolé qui échouait.
 */
export async function readRowTolerant<T extends Record<string, unknown>>(
  supabase: SupabaseClient,
  table: string,
  keyColumn: string,
  keyValue: string,
  columns: string[],
): Promise<Partial<T>> {
  const missing = missingFor(table)
  // Au plus une reprise par colonne tardive, plus une marge de sécurité : la
  // boucle ne peut pas tourner indéfiniment même si Postgres répond autrement.
  for (let attempt = 0; attempt <= columns.length; attempt++) {
    const asked = narrowColumns(columns, missing)
    if (asked.length === 0) return {}

    const { data, error } = await supabase
      .from(table)
      .select(asked.join(','))
      .eq(keyColumn, keyValue)
      .maybeSingle()

    if (!error) return (data ?? {}) as Partial<T>

    const culprit = parseMissingColumn(error.message)
    // Erreur d'une autre nature (réseau, RLS…) : on dégrade comme avant, sans
    // boucler. La page voit un profil vide plutôt qu'une exception.
    if (!culprit || missing.has(culprit)) {
      console.error(`[${table}] lecture impossible :`, error.message)
      return {}
    }
    missing.add(culprit)
  }
  return {}
}

// Réservé aux tests : remet à zéro la mémoire des colonnes absentes.
export function resetMissingColumnsCache(): void {
  knownMissing.clear()
}
