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
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

export type MigrationSql = { readonly file: string; readonly sql: string }

export const DOSSIER_MIGRATIONS = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'supabase',
)

/**
 * Les sous-dossiers qui portent des migrations (19/09/2026) : `schema/` (tables,
 * fonctions, droits, correctifs) et `contenu/` (les seeds). `outils/` n'en est
 * pas. La racine est lue aussi, pour une migration qu'on y déposerait encore.
 * Le NOM d'un fichier reste sa clé partout : `migrationSql('368_…')` ne dépend
 * pas du rangement.
 */
const SOUS_DOSSIERS = ['', 'schema', 'contenu'] as const

type Entree = { readonly file: string; readonly chemin: string }

let index: readonly Entree[] | null = null

/** `schema.sql` est la base de tout : il passe EN PREMIER, pas après la 374. */
function cleDeTri(file: string): string {
  return file === 'schema.sql' ? '000' : file
}

function indexDesMigrations(): readonly Entree[] {
  if (index === null) {
    const entrees: Entree[] = []
    for (const sous of SOUS_DOSSIERS) {
      const dossier = path.join(DOSSIER_MIGRATIONS, sous)
      if (!existsSync(dossier)) continue
      for (const file of readdirSync(dossier)) {
        if (file.endsWith('.sql') && !file.startsWith('_')) {
          entrees.push({ file, chemin: path.join(dossier, file) })
        }
      }
    }
    entrees.sort((a, b) => cleDeTri(a.file).localeCompare(cleDeTri(b.file)))
    index = entrees
  }
  return index
}

let toutes: readonly MigrationSql[] | null = null

/** Toutes les migrations, triées par numéro (`schema.sql` d'abord), lues UNE fois. */
export function migrationsDansLOrdre(): readonly MigrationSql[] {
  if (toutes === null) {
    toutes = indexDesMigrations().map(({ file, chemin }) => ({
      file,
      sql: readFileSync(chemin, 'utf8'),
    }))
  }
  return toutes
}

/** Les seuls noms de fichiers, sans payer la lecture du contenu. */
export function nomsDesMigrations(): readonly string[] {
  return indexDesMigrations().map((e) => e.file)
}

/** Le chemin d'une migration nommée, où qu'elle soit rangée. */
export function cheminMigration(fichier: string): string {
  const entree = indexDesMigrations().find((e) => e.file === fichier)
  if (entree === undefined) {
    throw new Error(`migration introuvable dans supabase/ : ${fichier}`)
  }
  return entree.chemin
}

/**
 * Le contenu d'UNE migration nommée (les seeds isolés, `008_reviser.sql`…).
 *
 * Lit CE fichier seul, sauf si le corpus est déjà en cache : un garde qui ne
 * vérifie qu'un seed (les packs de gemmes contre la 369) n'a pas à charger les
 * 22 Mo du dossier — c'est ce qui le faisait dépasser 5 s sur une machine
 * chargée.
 */
export function migrationSql(fichier: string): string {
  if (toutes !== null) {
    const trouvee = toutes.find((m) => m.file === fichier)
    if (trouvee === undefined) {
      throw new Error(`migration introuvable dans supabase/ : ${fichier}`)
    }
    return trouvee.sql
  }
  return readFileSync(cheminMigration(fichier), 'utf8')
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
