// -----------------------------------------------------------------------------
// LE CONTENU DU CAHIER D'EXERCICES → une migration SQL.
//
//   node node_modules/jiti/lib/jiti-cli.mjs scripts/exercices-sql.ts \
//     --num 374 --niveau 6e [--matieres maths,svt] [--suffixe 1] \
//     > supabase/374_exercices_6e.sql
//
// Lit contenu/exercices/<niveau>/<matière>.json, RELIT tout (lib/exercices/
// valider.ts — une seule faute et rien n'est écrit), compile chaque exercice
// (lib/exercices/compiler.ts : le contenu public d'un côté, les clés de
// l'autre) et écrit la migration sur STDOUT. Le résumé part sur STDERR : ne
// JAMAIS rediriger les deux flux dans le fichier (cf. lib/migrations-propres).
//
// L'identifiant d'un exercice est dérivé de (chapitre, position) : rejouer la
// migration met l'exercice à jour, sans doublon ni perte des résultats des
// élèves. Un exercice dont le chapitre n'existe pas en base est sauté.
// -----------------------------------------------------------------------------

import fs from 'node:fs'
import path from 'node:path'
import { compilerExercice } from '../lib/exercices/compiler'
import { GEMMES_PAR_ETOILES, XP_PAR_ETOILES } from '../lib/exercices/progression'
import type { FichierExercices } from '../lib/exercices/types'
import { validerFichier } from '../lib/exercices/valider'

function option(nom: string): string | undefined {
  const i = process.argv.indexOf(`--${nom}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

const num = option('num')
const niveau = option('niveau')
const matieres = option('matieres')?.split(',').filter(Boolean)
const suffixe = option('suffixe')
if (!num || !/^\d{3}$/.test(num) || !niveau) {
  console.error('Usage : exercices-sql.ts --num NNN --niveau 6e [--matieres a,b] [--suffixe 1]')
  process.exit(1)
}

const dossier = path.join(process.cwd(), 'contenu', 'exercices', niveau)
const noms = fs
  .readdirSync(dossier)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  // `maths.json`, `maths.2.json`… : la matière est ce qui précède le premier point.
  .filter((m) => !matieres || matieres.includes(m.split('.')[0]))
  .sort()

const DELIM = '$ex$'
const lignes: string[] = []
const parMatiere: string[] = []
let fautes = 0

for (const nom of noms) {
  const fichier = JSON.parse(fs.readFileSync(path.join(dossier, `${nom}.json`), 'utf8')) as FichierExercices
  const erreurs = validerFichier(fichier, `${niveau}/${nom}`)
  if (erreurs.length) {
    fautes += erreurs.length
    for (const e of erreurs) console.error(`FAUTE ${e.chemin} : ${e.message}`)
    continue
  }
  const chapitres = new Set(fichier.exercices.map((e) => e.chapitre))
  parMatiere.push(`--   ${nom.padEnd(22)} ${String(fichier.exercices.length).padStart(3)} exercices · ${chapitres.size} chapitres`)
  for (const ex of fichier.exercices) {
    const { public: pub, cles } = compilerExercice(ex)
    const contenu = JSON.stringify(pub)
    const jsonCles = JSON.stringify(cles)
    if (contenu.includes(DELIM) || jsonCles.includes(DELIM)) {
      console.error(`FAUTE ${niveau}/${nom} : le délimiteur ${DELIM} apparaît dans le contenu`)
      fautes += 1
      continue
    }
    lignes.push(
      `  ('${ex.chapitre}'::uuid, ${ex.position}, ${ex.etoiles}, ${GEMMES_PAR_ETOILES[ex.etoiles]}, ${XP_PAR_ETOILES[ex.etoiles]}, ${pub.questions.length},\n   ${DELIM}${contenu}${DELIM}::jsonb,\n   ${DELIM}${jsonCles}${DELIM}::jsonb)`,
    )
  }
}

if (fautes > 0) {
  console.error(`\n${fautes} faute(s) : rien n'est écrit. Corrige le contenu, puis relance.`)
  process.exit(1)
}

const nomFichier = `${num}_exercices_${niveau}${suffixe ? `_${suffixe}` : ''}.sql`
const sql = `-- =============================================================================
-- ${num} — LE CAHIER D'EXERCICES DE ${niveau.toUpperCase()}${suffixe ? ` (partie ${suffixe})` : ''}
--
-- FICHIER GÉNÉRÉ par scripts/exercices-sql.ts depuis contenu/exercices/${niveau}/ :
-- ne pas l'éditer à la main, corriger le JSON et régénérer :
--   node node_modules/jiti/lib/jiti-cli.mjs scripts/exercices-sql.ts --num ${num} --niveau ${niveau}${matieres ? ` --matieres ${matieres.join(',')}` : ''}${suffixe ? ` --suffixe ${suffixe}` : ''} > supabase/${nomFichier}
--
-- ${lignes.length} exercices écrits et relus : pour chaque chapitre, trois exercices faits
-- comme une page de manuel (★ facile, ★★ moyen, ★★★ plus corsé), avec leurs
-- documents (cartes, graphiques, textes, schémas…) et leurs questions. Le
-- contenu public va dans \`exercices\`, les réponses et explications dans
-- \`exercices_cles\` (qu'aucun élève ne lit). Gemmes et XP selon les étoiles
-- (5/10/15 gemmes, 20/35/50 XP), réglables ensuite en base.
--
${parMatiere.join('\n')}
--
-- L'identifiant d'un exercice est dérivé de (chapitre, position) : rejouer ce
-- fichier met les exercices à jour sans doublon, et garde les résultats des
-- élèves. Un exercice dont le chapitre n'existe pas en base est sauté.
--
-- PRÉREQUIS : 372 (le cahier). Idempotent. À exécuter à la main dans :
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

DROP TABLE IF EXISTS pg_temp.exercices_seed;
CREATE TEMP TABLE exercices_seed AS
SELECT md5('exercice:' || v.chapter_id::text || ':' || v.position::text)::uuid AS id, v.*
FROM (VALUES
${lignes.join(',\n')}
) AS v (chapter_id, position, etoiles, gemmes, xp, nb_questions, contenu, cles);

INSERT INTO public.exercices (id, chapter_id, position, etoiles, gemmes, xp, nb_questions, contenu)
SELECT s.id, s.chapter_id, s.position, s.etoiles, s.gemmes, s.xp, s.nb_questions, s.contenu
FROM exercices_seed s
JOIN public.chapters c ON c.id = s.chapter_id
ON CONFLICT (id) DO UPDATE
  SET etoiles      = EXCLUDED.etoiles,
      nb_questions = EXCLUDED.nb_questions,
      contenu      = EXCLUDED.contenu,
      updated_at   = now();

INSERT INTO public.exercices_cles (exercice_id, cles)
SELECT s.id, s.cles
FROM exercices_seed s
JOIN public.exercices e ON e.id = s.id
ON CONFLICT (exercice_id) DO UPDATE SET cles = EXCLUDED.cles;

-- Contrôle : combien d'exercices de ce fichier sont en base, et combien sautés.
DO $$
DECLARE
  v_attendus INTEGER;
  v_poses    INTEGER;
BEGIN
  SELECT count(*) INTO v_attendus FROM exercices_seed;
  SELECT count(*) INTO v_poses FROM public.exercices e JOIN exercices_seed s ON s.id = e.id;
  RAISE NOTICE 'Cahier ${niveau}${suffixe ? ` (${suffixe})` : ''} : % exercices posés sur % (les autres n''ont pas leur chapitre en base).', v_poses, v_attendus;
  DROP TABLE IF EXISTS pg_temp.exercices_seed;
END $$;
`

process.stdout.write(sql)
console.error(`${nomFichier} : ${lignes.length} exercices, ${Math.round(sql.length / 1024)} Ko`)
