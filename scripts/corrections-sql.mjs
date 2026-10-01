// -----------------------------------------------------------------------------
// LES CORRECTIONS DE COURS ET DE QUIZ → une migration SQL.
//
//   node scripts/corrections-sql.mjs --num 420 [--verifier] > supabase/contenu/420_….sql
//
// Lit contenu/corrections/*.json : chaque entrée remplace un FRAGMENT exact
// (`ancien` → `nouveau`) dans un champ d'une fiche désignée par sa clé
// naturelle (matière, niveau, titre du chapitre) — le cours de sa leçon, ou
// l'énoncé, l'explication ou les options des questions de son quiz.
//
// POURQUOI DES REMPLACEMENTS ET PAS DES RÉÉCRITURES. Une partie des cours a été
// semée par de vieilles migrations écrites à la main, sans module source :
// `seed-complements --cours` ne peut pas les atteindre. Un `replace()` ciblé
// touche la phrase fautive et rien d'autre, quelle que soit l'origine du texte,
// et il ne fait rien si la phrase est déjà juste — la migration se rejoue sans
// risque, avant ou après une réécriture complète du même cours.
//
// Format : { "corrections": [ { "slug", "niveau", "chapitre",
//   "champ": "cours" | "question" | "explication" | "options" | "controle",
//   "ancien", "nouveau", "justification" } ] }
// -----------------------------------------------------------------------------
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const option = (nom) => {
  const i = process.argv.indexOf(`--${nom}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}
const NUMERO = option('num') ?? '999'
const VERIFIER = process.argv.includes('--verifier')
// `--fichiers a,b` : ne prendre que contenu/corrections/a.json et b.json — une
// nouvelle vague de corrections a sa propre migration, sans rejouer les
// précédentes (déjà en base).
const FICHIERS = option('fichiers')?.split(',').filter(Boolean)
const DOSSIER = join(process.cwd(), 'contenu', 'corrections')
// `controle` : le fragment est remplacé dans les sujets de contrôle blanc écrits
// d'avance de la fiche (chapter_exercices, origine = 'catalogue' : énoncé,
// corrigé, barème). Une erreur de cours se retrouve presque toujours dans les
// trois sujets qui en ont été tirés.
// `reponse` : dans la question dont l'énoncé est EXACTEMENT `question`, l'option
// égale à `ancien` devient `nouveau` (« 10 » → « 11 »). Un remplacement de texte
// (`options`) toucherait aussi « Environ 100 millions » ; celui-ci ne vise
// qu'une option entière d'une question nommée. Si l'énoncé est corrigé dans le
// même lot, `question` est l'énoncé APRÈS correction (les réponses passent en
// dernier).
// `explication_de` : l'explication de la question dont l'énoncé est EXACTEMENT
// `question`, quand elle vaut EXACTEMENT `ancien`, devient `nouveau`. Pour une
// explication très courte (« cos 90° = 0. »), un remplacement de fragment
// toucherait toutes les questions du chapitre qui la contiennent.
const CHAMPS = { cours: null, question: 'question', explication: 'explanation', options: 'options', controle: 'contenu', reponse: 'options', explication_de: 'explanation' }

const entrees = []
const fautes = []
for (const f of readdirSync(DOSSIER)
  .filter((x) => x.endsWith('.json'))
  .filter((x) => !FICHIERS || FICHIERS.includes(x.replace(/\.json$/, '')))
  .sort()) {
  const { corrections } = JSON.parse(readFileSync(join(DOSSIER, f), 'utf8'))
  corrections.forEach((c, i) => {
    const ou = `${f}#${i}`
    for (const k of ['slug', 'niveau', 'chapitre', 'champ', 'ancien', 'nouveau'])
      if (typeof c[k] !== 'string' || !c[k]) fautes.push(`${ou} : champ « ${k} » manquant`)
    if (!(c.champ in CHAMPS)) fautes.push(`${ou} : champ inconnu « ${c.champ} »`)
    if (c.ancien === c.nouveau) fautes.push(`${ou} : ancien = nouveau`)
    // Un nouveau texte qui CONTIENT l'ancien se remplacerait à chaque passage
    // (« … criminel | » → « … criminel | Coben | » → « … | Coben | Coben | ») :
    // la migration ne serait plus idempotente. Allonger le fragment.
    else if (c.champ !== 'explication_de' && c.nouveau?.includes(c.ancien)) fautes.push(`${ou} : le nouveau texte contient l'ancien (non idempotent)`)
    // Un fragment de COURS peut couvrir plusieurs lignes (`\n` : séparer deux
    // tableaux collés, couper un tableau trop large). Jamais de `\r` : les cours
    // sont en fins de ligne Unix, un `\r\n` venu d'un éditeur Windows ne
    // trouverait jamais son fragment.
    if (/\r/.test(c.ancien ?? '') || /\r/.test(c.nouveau ?? ''))
      fautes.push(`${ou} : pas de \\r dans un fragment`)
    if (c.champ !== 'cours' && (/\n/.test(c.ancien ?? '') || /\n/.test(c.nouveau ?? '')))
      fautes.push(`${ou} : pas de retour à la ligne dans un fragment de quiz`)
    if ((c.champ === 'options' || c.champ === 'controle') && /["\\]/.test(`${c.ancien}${c.nouveau}`))
      fautes.push(`${ou} : un fragment d'option ou de contrôle ne contient ni guillemet ni antislash (JSON)`)
    if ((c.champ === 'reponse' || c.champ === 'explication_de') && (typeof c.question !== 'string' || !c.question))
      fautes.push(`${ou} : une correction de réponse ou d'explication ciblée nomme sa question (champ « question »)`)
    entrees.push({ ...c, ou })
  })
}
if (fautes.length) {
  for (const f of fautes) console.error(`FAUTE ${f}`)
  console.error(`\n${fautes.length} faute(s) : rien n'est écrit.`)
  process.exit(1)
}
console.error(`✓ ${entrees.length} corrections relues`)
if (VERIFIER) process.exit(0)

const q = (s) => `'${String(s).replace(/'/g, "''")}'`
const AVEC_CONTROLES = entrees.some((c) => c.champ === 'controle')
const AVEC_REPONSES = entrees.some((c) => c.champ === 'reponse')
// Sans correction de contrôle ni de réponse, le SQL reste celui des migrations
// 420 → 425, au caractère près : elles se régénèrent à l'identique.
const AVEC_CIBLEES = entrees.some((c) => c.champ === 'explication_de')
const AVEC_CIBLE = AVEC_REPONSES || AVEC_CIBLEES
const ETENDU = AVEC_CONTROLES || AVEC_CIBLE
const out = []
const w = (s = '') => out.push(s)
w('-- =============================================================================')
w(`-- Studuel — Migration ${NUMERO} : ${option('titre') ?? 'ERREURS DE COURS ET DE QUIZ CORRIGÉES'}`)
w('--')
if (option('motif')) {
  w(`-- ${entrees.length} fragments, remplacés à l’endroit exact où ils sont.`)
  w(`-- ${option('motif')}`)
} else {
  w(`-- ${entrees.length} fragments faux ou approximatifs, relevés par les relecteurs des`)
  w('-- contrôles blancs (28-29/09/2026), remplacés à l’endroit exact où ils sont.')
}
w('-- La même correction est faite dans la source (scripts/contenu, contenu/controles).')
w('--')
w('-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main. Source : contenu/corrections/.')
w(`--    Regénérer : node scripts/corrections-sql.mjs --num ${NUMERO}${FICHIERS ? ` --fichiers ${FICHIERS.join(',')}` : ''}${option('titre') ? ' --titre … --motif … (ceux de l’en-tête)' : ''}`)
w('--')
w('-- Idempotent : chaque UPDATE ne touche que les lignes qui contiennent encore le')
w('-- fragment fautif. À exécuter APRÈS 385 → 399 (les cours qu’elles réécrivent).')
w('-- Supabase Dashboard → SQL Editor → New query → Run.')
w('-- =============================================================================')
w()
// Une table temporaire ordinaire, pas ON COMMIT DROP : l'éditeur SQL peut
// valider chaque instruction à part, et la table disparaîtrait avant l'INSERT.
w('DROP TABLE IF EXISTS pg_temp._corrections;')
w(`CREATE TEMP TABLE _corrections (n int, slug text, level text, chapter text, champ text, ancien text, nouveau text${AVEC_CIBLE ? ', cible text' : ''});`)
w('INSERT INTO _corrections VALUES')
w(entrees.map((c, i) => `  (${i + 1}, ${q(c.slug)}, ${q(c.niveau)}, ${q(c.chapitre)}, ${q(c.champ)}, ${q(c.ancien)}, ${q(c.nouveau)}${AVEC_CIBLE ? `, ${c.champ === 'reponse' || c.champ === 'explication_de' ? q(c.question) : 'NULL'}` : ''})`).join(',\n') + ';')
w()
// UNE correction à la fois : un UPDATE … FROM qui trouve deux corrections pour
// la même leçon n'en applique qu'une (Postgres garde une seule ligne jointe).
w('-- Les cours, une correction à la fois (plusieurs peuvent viser la même leçon).')
w('DO $$')
w('DECLARE k record;')
w('BEGIN')
w("  FOR k IN SELECT * FROM _corrections WHERE champ = 'cours' ORDER BY n LOOP")
w('    UPDATE public.lessons l SET content = replace(l.content, k.ancien, k.nouveau)')
w('      FROM public.subjects s')
w('      JOIN public.chapters c ON c.subject_id = s.id')
w('     WHERE s.slug = k.slug AND c.level = k.level AND c.title = k.chapter')
w('       AND l.chapter_id = c.id AND strpos(l.content, k.ancien) > 0;')
w('  END LOOP;')
w('END $$;')
w()
w('-- Les questions de quiz (énoncé, explication, options), une correction à la fois.')
w('DO $$')
w('DECLARE k record;')
w('BEGIN')
w(ETENDU
  ? "  FOR k IN SELECT * FROM _corrections WHERE champ IN ('question', 'explication', 'options') ORDER BY n LOOP"
  : "  FOR k IN SELECT * FROM _corrections WHERE champ <> 'cours' ORDER BY n LOOP")
w('    UPDATE public.quiz_questions x')
w("       SET question    = CASE WHEN k.champ = 'question'    THEN replace(x.question, k.ancien, k.nouveau) ELSE x.question END,")
w("           explanation = CASE WHEN k.champ = 'explication' THEN replace(x.explanation, k.ancien, k.nouveau) ELSE x.explanation END,")
w("           options     = CASE WHEN k.champ = 'options'     THEN replace(x.options::text, k.ancien, k.nouveau)::jsonb ELSE x.options END")
w('      FROM public.quizzes qz')
w('      JOIN public.lessons l ON l.id = qz.lesson_id')
w('      JOIN public.chapters c ON c.id = l.chapter_id')
w('      JOIN public.subjects s ON s.id = c.subject_id')
w('     WHERE x.quiz_id = qz.id AND s.slug = k.slug AND c.level = k.level AND c.title = k.chapter')
w("       AND strpos(CASE k.champ WHEN 'question' THEN x.question WHEN 'explication' THEN x.explanation ELSE x.options::text END, k.ancien) > 0;")
w('  END LOOP;')
w('END $$;')
w()
if (AVEC_CONTROLES) {
  // Le contenu d'un sujet est du JSON : le remplacement se fait sur son texte,
  // d'où l'interdiction des guillemets et des antislashs dans ces fragments.
  w('-- Les sujets de contrôle blanc du catalogue (énoncé, corrigé, barème).')
  w('DO $$')
  w('DECLARE k record;')
  w('BEGIN')
  w("  FOR k IN SELECT * FROM _corrections WHERE champ = 'controle' ORDER BY n LOOP")
  w('    UPDATE public.chapter_exercices e SET contenu = replace(e.contenu::text, k.ancien, k.nouveau)::jsonb')
  w('      FROM public.subjects s')
  w('      JOIN public.chapters c ON c.subject_id = s.id')
  w('     WHERE s.slug = k.slug AND c.level = k.level AND c.title = k.chapter')
  w("       AND e.chapter_id = c.id AND e.origine = 'catalogue' AND strpos(e.contenu::text, k.ancien) > 0;")
  w('  END LOOP;')
  w('END $$;')
  w()
}
if (AVEC_CIBLEES) {
  w('-- Les explications ciblées : celle d’une question nommée, remplacée en entier.')
  w('DO $$')
  w('DECLARE k record;')
  w('BEGIN')
  w("  FOR k IN SELECT * FROM _corrections WHERE champ = 'explication_de' ORDER BY n LOOP")
  w('    UPDATE public.quiz_questions x SET explanation = k.nouveau')
  w('      FROM public.quizzes qz')
  w('      JOIN public.lessons l ON l.id = qz.lesson_id')
  w('      JOIN public.chapters c ON c.id = l.chapter_id')
  w('      JOIN public.subjects s ON s.id = c.subject_id')
  w('     WHERE x.quiz_id = qz.id AND s.slug = k.slug AND c.level = k.level AND c.title = k.chapter')
  w('       AND x.question = k.cible AND x.explanation = k.ancien;')
  w('  END LOOP;')
  w('END $$;')
  w()
}
if (AVEC_REPONSES) {
  w('-- Les réponses : une option entière d’une question nommée (après les énoncés).')
  w('DO $$')
  w('DECLARE k record;')
  w('BEGIN')
  w("  FOR k IN SELECT * FROM _corrections WHERE champ = 'reponse' ORDER BY n LOOP")
  w('    UPDATE public.quiz_questions x')
  w('       SET options = (SELECT jsonb_agg(CASE WHEN o.v = k.ancien THEN to_jsonb(k.nouveau) ELSE to_jsonb(o.v) END ORDER BY o.i)')
  w('                        FROM jsonb_array_elements_text(x.options) WITH ORDINALITY AS o(v, i))')
  w('      FROM public.quizzes qz')
  w('      JOIN public.lessons l ON l.id = qz.lesson_id')
  w('      JOIN public.chapters c ON c.id = l.chapter_id')
  w('      JOIN public.subjects s ON s.id = c.subject_id')
  w('     WHERE x.quiz_id = qz.id AND s.slug = k.slug AND c.level = k.level AND c.title = k.chapter')
  w('       AND x.question = k.cible AND x.options ? k.ancien;')
  w('  END LOOP;')
  w('END $$;')
  w()
}
w('-- Contrôle d’arrivée : chaque correction doit voir son texte juste en place.')
w('DO $$')
w('DECLARE n_absentes int;')
w('BEGIN')
w('  SELECT count(*) INTO n_absentes FROM _corrections k')
if (ETENDU) {
  w("   WHERE CASE k.champ WHEN 'controle' THEN NOT EXISTS (")
  w('     SELECT 1 FROM public.subjects s')
  w('       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter')
  w("       JOIN public.chapter_exercices e ON e.chapter_id = c.id AND e.origine = 'catalogue'")
  w('      WHERE s.slug = k.slug AND strpos(e.contenu::text, k.nouveau) > 0)')
  if (AVEC_REPONSES) {
    w("   WHEN 'reponse' THEN NOT EXISTS (")
    w('     SELECT 1 FROM public.subjects s')
    w('       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter')
    w('       JOIN public.lessons l ON l.chapter_id = c.id')
    w('       JOIN public.quizzes qz ON qz.lesson_id = l.id')
    w('       JOIN public.quiz_questions x ON x.quiz_id = qz.id')
    w('      WHERE s.slug = k.slug AND x.question = k.cible AND x.options ? k.nouveau)')
  }
  if (AVEC_CIBLEES) {
    w("   WHEN 'explication_de' THEN NOT EXISTS (")
    w('     SELECT 1 FROM public.subjects s')
    w('       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter')
    w('       JOIN public.lessons l ON l.chapter_id = c.id')
    w('       JOIN public.quizzes qz ON qz.lesson_id = l.id')
    w('       JOIN public.quiz_questions x ON x.quiz_id = qz.id')
    w('      WHERE s.slug = k.slug AND x.question = k.cible AND x.explanation = k.nouveau)')
  }
  w('   ELSE NOT EXISTS (')
} else w('   WHERE NOT EXISTS (')
w('     SELECT 1 FROM public.subjects s')
w('       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter')
w('       JOIN public.lessons l ON l.chapter_id = c.id')
w('       LEFT JOIN public.quizzes qz ON qz.lesson_id = l.id')
w('       LEFT JOIN public.quiz_questions x ON x.quiz_id = qz.id')
w('      WHERE s.slug = k.slug')
w("        AND strpos(CASE k.champ WHEN 'cours' THEN l.content WHEN 'question' THEN x.question")
w(`                   WHEN 'explication' THEN x.explanation ELSE x.options::text END, k.nouveau) > 0)${ETENDU ? ' END' : ''};`)
w(`  RAISE NOTICE 'Migration ${NUMERO} : % correction(s) sur ${entrees.length} introuvables.', n_absentes;`)
w('  IF n_absentes > 0 THEN')
w(`    RAISE WARNING 'Migration ${NUMERO} : des corrections n''ont pas trouvé leur fiche (titre, niveau ou fragment changé ?).';`)
w('  END IF;')
w('END $$;')
w()
w('DROP TABLE IF EXISTS pg_temp._corrections;')
process.stdout.write(out.join('\n') + '\n')
