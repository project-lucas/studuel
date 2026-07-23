// Reconnaître « l'objet de schéma n'existe pas encore » — et RIEN d'autre.
//
// Plusieurs accès à du contenu payant (cartes mentales, fiches de révision)
// gardent un repli transitoire : tant que la migration qui crée la RPC ou la
// colonne générée n'est pas exécutée, ils relisent la colonne d'origine. Ce
// repli est indispensable — le code est déployé AVANT la migration, sinon
// Réviser casse pendant la fenêtre d'exécution manuelle.
//
// Mais un repli déclenché par « une erreur, quelle qu'elle soit » est un
// contournement en puissance : le jour où quelqu'un réémet un `GRANT SELECT`
// au niveau table, une RPC en échec pour une TOUTE AUTRE raison (droit retiré,
// panne) ferait retomber le code sur la lecture directe de la colonne payante,
// silencieusement. C'est exactement le piège que les migrations 182 et 185
// documentent en tête de fichier.
//
// On n'accepte donc de se replier que sur les codes qui signifient
// littéralement « cet objet n'existe pas ». Un refus de droit (42501) ou une
// panne réseau échouent désormais fermé : pas de contenu, pas de repli.

// Codes PostgREST / PostgreSQL signifiant « objet absent du schéma ».
const MISSING_SCHEMA_CODES = new Set([
  'PGRST202', // fonction absente du cache de schéma (RPC pas encore créée)
  'PGRST204', // colonne absente du cache de schéma
  '42883', // undefined_function
  '42703', // undefined_column
])

export function isMissingSchemaObject(
  error: { code?: string | null } | null | undefined,
): boolean {
  if (!error?.code) return false
  return MISSING_SCHEMA_CODES.has(error.code)
}
