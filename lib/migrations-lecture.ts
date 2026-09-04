/**
 * Lecture MÉMOÏSÉE des migrations de `supabase/` — OUTIL DE TEST UNIQUEMENT.
 *
 * Ce module touche au disque : il n'a rien à faire dans un composant ni dans
 * une Server Action. Il n'existe que pour les gardes « miroir » (lib ↔ SQL),
 * qui doivent relire les migrations pour vérifier qu'un barème calculé en
 * TypeScript est bien celui que la base appliquera.
 *
 * POURQUOI IL EXISTE. Chaque garde portait sa propre copie de
 * `readdirSync + readFileSync`, appelée À CHAQUE ASSERTION. Le dossier pesant
 * 21 Mo (les seeds de contenu), un seul `it()` qui vérifie quatre constantes
 * lisait 84 Mo et dépassait le délai de 5 s de Vitest — pas toujours, pas les
 * mêmes : la suite rendait 2 à 4 échecs DIFFÉRENTS d'un lancement à l'autre.
 * Un filet de sécurité qui échoue au hasard ne garde plus rien : on finit par
 * relancer jusqu'au vert.
 *
 * Le cache vit à l'échelle du module, donc d'un fichier de test (Vitest isole
 * chaque fichier) : une lecture au lieu de N, et les recherches répétées d'un
 * même motif ne rebalayent pas le corpus.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

export type MigrationSql = { readonly file: string; readonly sql: string }

export const DOSSIER_MIGRATIONS = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'supabase',
)

let toutes: readonly MigrationSql[] | null = null

/** Toutes les migrations, triées par nom (donc par numéro), lues UNE fois. */
export function migrationsDansLOrdre(): readonly MigrationSql[] {
  if (toutes === null) {
    toutes = readdirSync(DOSSIER_MIGRATIONS)
      .filter((f) => f.endsWith('.sql'))
      .sort()
      .map((file) => ({
        file,
        sql: readFileSync(path.join(DOSSIER_MIGRATIONS, file), 'utf8'),
      }))
  }
  return toutes
}

/** Les seuls noms de fichiers, sans payer la lecture du contenu. */
export function nomsDesMigrations(): readonly string[] {
  return readdirSync(DOSSIER_MIGRATIONS)
    .filter((f) => f.endsWith('.sql'))
    .sort()
}

/** Le contenu d'UNE migration nommée (les seeds isolés, `008_reviser.sql`…). */
export function migrationSql(fichier: string): string {
  const trouvee = migrationsDansLOrdre().find((m) => m.file === fichier)
  if (trouvee === undefined) {
    throw new Error(`migration introuvable dans supabase/ : ${fichier}`)
  }
  return trouvee.sql
}

/** Les migrations dont le NOM colle au motif (`/^3\d\d_contenu_/`…). */
export function migrationsQuiCollent(motif: RegExp): readonly MigrationSql[] {
  return migrationsDansLOrdre().filter((m) => motif.test(m.file))
}

const derniereParMotif = new Map<
  string,
  { file: string; m: RegExpMatchArray } | null
>()

/**
 * La DERNIÈRE migration où le motif apparaît, et son match.
 *
 * C'est la sémantique de `CREATE OR REPLACE` : la 213 réécrit les RPC de la
 * 212, et ce que la base applique est la dernière écriture dans l'ordre des
 * numéros — pas la première trouvée.
 */
export function derniereOccurrence(
  re: RegExp,
): { file: string; m: RegExpMatchArray } | null {
  const cle = `${re.source} ${re.flags}`
  const deja = derniereParMotif.get(cle)
  if (deja !== undefined) return deja

  let trouve: { file: string; m: RegExpMatchArray } | null = null
  for (const { file, sql } of migrationsDansLOrdre()) {
    const m = sql.match(re)
    if (m) trouve = { file, m }
  }
  derniereParMotif.set(cle, trouve)
  return trouve
}

const derniereParFonction = new Map<string, MigrationSql | null>()

/** La migration qui définit EN DERNIER la fonction `public.<nom>`. */
export function derniereDefinition(nom: string): MigrationSql | null {
  const deja = derniereParFonction.get(nom)
  if (deja !== undefined) return deja

  const trouvee =
    migrationsDansLOrdre()
      .filter((m) => m.sql.includes(`FUNCTION public.${nom}`))
      .at(-1) ?? null
  derniereParFonction.set(nom, trouvee)
  return trouvee
}
