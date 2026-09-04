#!/usr/bin/env node
// =============================================================================
// Générateur des migrations de REFORMULATION des questions de quiz.
//
// À quoi ça sert. Les seeds de contenu (`scripts/contenu/*.mjs`) sont la source
// de vérité, mais leurs INSERT sont gardés par `ON CONFLICT DO NOTHING` : la
// base EN SERVICE ne les rejouera jamais. Corriger un énoncé à la source ne
// change donc rien pour les élèves déjà inscrits — il faut un UPDATE. C'est
// exactement ce qu'ont fait les migrations 341→347 pour les cours ; celle-ci
// fait la même chose pour les QUESTIONS.
//
// Ce que ça produit. Une migration idempotente qui réécrit `question`,
// `options`, `correct_index` et `explanation` des seules questions dont
// l'énoncé porte une CLÉ D'ORIGINE — c'est-à-dire celles qui ont été
// reformulées. Aucun identifiant n'est touché : l'UUID se dérive de la clé
// d'origine (cf. `uuid()` dans seed-contenu.mjs), donc la progression des
// élèves (`review_items`, qui porte l'id de la question sans clé étrangère)
// reste intacte.
//
//   node scripts/seed-trous.mjs --num 350 --modules espagnol-tle > supabase/350_….sql
//
// ⚠️ À REGÉNÉRER EN MÊME TEMPS que le seed du module (`npm run contenu`) :
// les deux lisent le même fichier `.mjs` et doivent rester d'accord.
// =============================================================================

import { createHash } from 'node:crypto'
import { readdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ICI = dirname(fileURLToPath(import.meta.url))
const DOSSIER = join(ICI, 'contenu')

// Rigoureusement le même dérivateur que seed-contenu.mjs : une divergence d'un
// caractère produirait des UUID qui ne désignent aucune ligne, et la migration
// ne mettrait silencieusement à jour RIEN.
const NAMESPACE = 'studuel.contenu.v1'
function uuid(cle) {
  const h = createHash('sha1').update(`${NAMESPACE}:${cle}`).digest('hex')
  return [
    h.slice(0, 8),
    h.slice(8, 12),
    `5${h.slice(13, 16)}`,
    ((parseInt(h.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') +
      h.slice(18, 20),
    h.slice(20, 32),
  ].join('-')
}

const q = (s) => `'${String(s).replace(/'/g, "''")}'`

function option(nom, defaut) {
  const i = process.argv.indexOf(`--${nom}`)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : defaut
}

const NUMERO = option('num', '350')
const FILTRE_FICHIERS = option('modules', '')
  .split(',')
  .map((s) => s.trim().replace(/\.mjs$/, ''))
  .filter(Boolean)

const modules = []
for (const f of readdirSync(DOSSIER)
  .filter((f) => f.endsWith('.mjs'))
  .sort()) {
  if (FILTRE_FICHIERS.length && !FILTRE_FICHIERS.includes(f.replace(/\.mjs$/, '')))
    continue
  modules.push((await import(pathToFileURL(join(DOSSIER, f)).href)).default)
}
if (modules.length === 0) {
  console.error('✗ aucun module retenu (--modules)')
  process.exit(1)
}

// --- Collecte des questions REFORMULÉES --------------------------------------
const lignes = []
const matieres = new Set()
let trous = 0

for (const mod of modules) {
  for (const bloc of mod.blocs) {
    for (const niveau of bloc.niveaux) {
      for (const ch of bloc.chapitres) {
        const cleCh = `${mod.slug}|${niveau}|${ch.titre}`
        ch.questions.forEach(([texte, options, bonne, explication, cleOrigine], j) => {
          if (cleOrigine === undefined) return // pas reformulée : rien à écrire
          matieres.add(mod.nom)
          if (texte.includes('___')) trous++
          lignes.push({
            id: uuid(`${cleCh}|q${j}|${cleOrigine}`),
            texte,
            options,
            bonne,
            explication,
          })
        })
      }
    }
  }
}

if (lignes.length === 0) {
  console.error('✗ aucune question reformulée dans les modules retenus')
  process.exit(1)
}

// --- Écriture ----------------------------------------------------------------
const w = (s = '') => process.stdout.write(s + '\n')
const nomsMatieres = [...matieres].sort()

w('-- ' + '='.repeat(77))
w(`-- Studuel — Migration ${NUMERO} : LES QUESTIONS REFORMULÉES`)
w('--')
w(`-- ${lignes.length} questions réécrites, dont ${trous} passées au TEXTE À TROUS,`)
w(`-- dans : ${nomsMatieres.join(', ')}.`)
w('--')
w('-- POURQUOI CETTE MIGRATION EXISTE. Le quiz du programme ne servait que deux')
w('-- formes — le QCM et le vrai/faux — sur les ~3 300 questions du catalogue :')
w('-- huit écrans identiques d’affilée, où seul le texte change. La troisième')
w('-- forme, le texte à trous, est lisible par l’app depuis lib/quiz-trous.ts,')
w('-- mais AUCUNE question ne l’activait : il faut un `___` dans l’énoncé, et')
w('-- pas un seul seed n’en écrivait. La forme existait sans être visible.')
w('--')
w('-- POURQUOI UN UPDATE ET NON UN SEED. Les questions sont corrigées à la')
w('-- source, dans le module qui les porte — un clone neuf produit donc la bonne')
w('-- base sans rien exécuter. Mais la base EN SERVICE ne rejouera jamais ce')
w('-- seed : ses INSERT sont gardés par `ON CONFLICT DO NOTHING`. D’où ces')
w('-- UPDATE, comme les migrations 341→347 pour les cours.')
w('--')
w('-- ⚠️ AUCUN IDENTIFIANT N’EST TOUCHÉ, et c’est tout l’enjeu. L’UUID d’une')
w('-- question se dérivait de SON ÉNONCÉ : reformuler en déplaçait l’identifiant,')
w('-- le seed rejoué aurait inséré un doublon, et les `review_items` des élèves')
w('-- — qui portent cet id SANS clé étrangère — auraient pointé dans le vide (le')
w('-- compteur « X à revoir » comptant alors des questions mortes). Le générateur')
w('-- dérive désormais l’UUID d’une CLÉ D’ORIGINE : l’énoncé sous lequel la')
w('-- question a été semée la première fois, conservé en 5e élément du tuple.')
w('-- Vérifié : les 374 identifiants du seed de l’espagnol sont inchangés.')
w('--')
w('-- Idempotente : un UPDATE qui réécrit les mêmes valeurs. Rejouable sans effet.')
w('-- ' + '='.repeat(77))
w()
w('UPDATE public.quiz_questions AS x')
w('   SET question      = v.question,')
w('       options       = v.options,')
w('       correct_index = v.correct_index,')
w('       explanation   = v.explanation')
w('  FROM (VALUES')
w(
  lignes
    .map(
      (l) =>
        `    (${q(l.id)}::uuid, ${q(l.texte)}, ${q(JSON.stringify(l.options))}::jsonb, ${l.bonne}, ${q(l.explication)})`,
    )
    .join(',\n'),
)
w('  ) AS v(id, question, options, correct_index, explanation)')
w(' WHERE x.id = v.id;')
w()
w('-- Contrôle : combien de ces questions se lisent désormais comme un trou ?')
w('--   SELECT count(*) FROM public.quiz_questions WHERE question LIKE \'%___%\';')

console.error(
  `✓ ${lignes.length} questions reformulées (dont ${trous} à trous) · ${nomsMatieres.join(', ')}`,
)
