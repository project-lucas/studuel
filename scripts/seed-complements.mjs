// Compléments de contenu : des QUESTIONS en plus pour des quiz déjà en base,
// et des COURS réécrits, sans créer ni supprimer un seul chapitre.
//
//   node scripts/seed-complements.mjs --num 385 --complements maths-3e,anglais-3e \
//        [--cours maths-3e,anglais-3e] > supabase/contenu/385_….sql
//
// POURQUOI UN SECOND GÉNÉRATEUR. `seed-contenu.mjs` écrit des chapitres NEUFS :
// ses INSERT sont gardés par ON CONFLICT DO NOTHING, si bien qu'une question
// ajoutée à un module déjà exécuté n'aurait qu'un effet de bord — régénérer sa
// migration la ferait mentir, et il faudrait la recoller en entier. Ici, on ne
// touche QUE ce qui change :
//
//   · `--complements a,b` lit scripts/complements/<a>.mjs, qui ajoute des
//     questions à des chapitres EXISTANTS, désignés par leur clé naturelle
//     (matière, niveau, titre du chapitre) — jamais par un UUID, parce qu'une
//     partie du catalogue a été semée par des migrations plus anciennes que le
//     générateur, dont les identifiants ne se dérivent pas.
//   · `--cours a,b` lit scripts/contenu/<a>.mjs (la SOURCE, corrigée sur place,
//     comme l'ont fait les migrations 341 → 347) et réécrit le cours de chaque
//     leçon dont le texte a changé. Rien d'autre.
//
// Format d'un complément :
//   export default {
//     slug: 'maths',
//     titreMigration: '…', motif: `…`,          // en-tête (facultatif)
//     chapitres: [{
//       niveau: '3e',                            // ou niveaux: ['2de', '1re', 'Tle']
//       titre: 'Les fonctions affines',          // titre EXACT du chapitre en base
//       questions: [ [énoncé, options, bonne, explication], … ],  // même tuple que seed-contenu
//     }],
//     corrections: [{                            // facultatif : une question FAUSSE en base
//       niveau: '1re', titre: '…',
//       ancien: 'énoncé actuel, mot pour mot',
//       question: [énoncé, options, bonne, explication],
//     }],
//   }
//
// Les questions ajoutées se rangent APRÈS celles du quiz (position = max + rang).
// UUID dérivé de (matière, niveau, chapitre, énoncé) : rejouer ne duplique rien.

import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ICI = dirname(fileURLToPath(import.meta.url))

const NAMESPACE = 'studuel.contenu.v1'
function uuid(cle) {
  const h = createHash('sha1').update(`${NAMESPACE}:${cle}`).digest('hex')
  return [
    h.slice(0, 8),
    h.slice(8, 12),
    `5${h.slice(13, 16)}`,
    ((parseInt(h.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') + h.slice(18, 20),
    h.slice(20, 32),
  ].join('-')
}
const q = (s) => `'${String(s).replace(/'/g, "''")}'`
const qE = (s) => `E'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\n/g, '\\n')}'`

function option(nom) {
  const i = process.argv.indexOf(`--${nom}`)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : ''
}
const liste = (s) => s.split(',').map((x) => x.trim().replace(/\.mjs$/, '')).filter(Boolean)
const NUMERO = option('num') || '000'
const COMPLEMENTS = liste(option('complements'))
const COURS = liste(option('cours'))
if (!COMPLEMENTS.length && !COURS.length) {
  console.error('Usage : seed-complements.mjs --num NNN [--complements a,b] [--cours a,b]')
  process.exit(1)
}

async function charge(dossier, nom) {
  const f = join(ICI, dossier, `${nom}.mjs`)
  if (!existsSync(f)) throw new Error(`module introuvable : ${dossier}/${nom}.mjs`)
  return (await import(pathToFileURL(f).href)).default
}

// --- Relecture des questions (mêmes règles que seed-contenu) -----------------
export function fautesQuestion([texte, options, bonne, explication], ou) {
  const f = []
  if (!texte || !explication) f.push(`${ou} : question incomplète`)
  if (![2, 4].includes(options?.length)) f.push(`${ou} : ${options?.length} options (2 ou 4)`)
  if (options?.length === 2 && (options[0] !== 'Vrai' || options[1] !== 'Faux'))
    f.push(`${ou} : vrai/faux mal formé`)
  if (!(bonne >= 0 && bonne < (options?.length ?? 0))) f.push(`${ou} : bonne réponse hors bornes`)
  if (new Set(options).size !== options?.length) f.push(`${ou} : options en double`)
  const trous = (texte?.match(/___/g) ?? []).length
  if (trous > 1) f.push(`${ou} : ${trous} trous`)
  if (trous === 1 && options?.length === 2) f.push(`${ou} : texte à trous en vrai/faux`)
  return f
}

const fautes = []
const questions = []
const cours = []
const matieres = new Set()
// `--titre` / `--motif` : l'en-tête d'une migration qui rassemble plusieurs
// lots (sinon le titre du premier lot et les motifs de tous, bout à bout).
const motifs = option('motif') ? [option('motif')] : []
const corrections = []
let titre = option('titre') ?? null

for (const nom of COMPLEMENTS) {
  const mod = await charge('complements', nom)
  matieres.add(mod.slug)
  if (mod.titreMigration && !titre) titre = mod.titreMigration
  if (mod.motif && !option('motif')) motifs.push(...mod.motif.split('\n'))
  const vusChap = new Set()
  // Un chapitre peut viser PLUSIEURS niveaux (`niveaux: ['2de', '1re', 'Tle']`) :
  // les langues du lycée portent les mêmes fiches aux trois niveaux, leurs
  // questions s'écrivent une fois et se posent sur chaque quiz.
  const chapitres = (mod.chapitres ?? []).flatMap((ch) =>
    (ch.niveaux ?? [ch.niveau]).map((niveau) => ({ ...ch, niveau })),
  )
  for (const ch of chapitres) {
    const cleCh = `${mod.slug}|${ch.niveau}|${ch.titre}`
    if (vusChap.has(cleCh)) fautes.push(`[${nom}] chapitre en double : ${cleCh}`)
    vusChap.add(cleCh)
    if (!ch.niveau || !ch.titre) fautes.push(`[${nom}] chapitre sans niveau ou titre`)
    const textes = new Set()
    ;(ch.questions ?? []).forEach((tuple, j) => {
      const ou = `[${nom}] ${ch.niveau} · ${ch.titre} · q${j + 1}`
      fautes.push(...fautesQuestion(tuple, ou))
      if (textes.has(tuple[0])) fautes.push(`${ou} : énoncé en double`)
      textes.add(tuple[0])
      const [texte, options, bonne, explication] = tuple
      questions.push({
        id: uuid(`${cleCh}|complement|${texte}`),
        slug: mod.slug,
        niveau: ch.niveau,
        chapitre: ch.titre,
        texte,
        kind: options.length === 2 ? 'true_false' : 'mcq',
        options,
        bonne,
        explication,
        rang: j + 1,
      })
    })
  }

  // LES CORRECTIONS : une question DÉJÀ en base, fausse, qu'on réécrit sur place.
  // Désignée par son chapitre et son énoncé ACTUEL (`ancien`) : l'UPDATE garde
  // son identifiant, donc la file « À revoir » des élèves qui la portent reste
  // valide. La source (scripts/contenu) se corrige en même temps, avec l'ancien
  // énoncé en 5e élément du tuple (la clé d'origine).
  const corrigees = (mod.corrections ?? []).flatMap((c) =>
    (c.niveaux ?? [c.niveau]).map((niveau) => ({ ...c, niveau })),
  )
  for (const c of corrigees) {
    const ou = `[${nom}] correction ${c.niveau} · ${c.titre}`
    if (!c.niveau || !c.titre || !c.ancien) fautes.push(`${ou} : niveau, titre ou ancien énoncé manquant`)
    fautes.push(...fautesQuestion(c.question ?? [], ou))
    const [texte, options, bonne, explication] = c.question ?? []
    corrections.push({
      slug: mod.slug,
      niveau: c.niveau,
      chapitre: c.titre,
      ancien: c.ancien,
      texte,
      kind: options?.length === 2 ? 'true_false' : 'mcq',
      options,
      bonne,
      explication,
    })
  }
}

for (const nom of COURS) {
  const mod = await charge('contenu', nom)
  matieres.add(mod.slug)
  for (const bloc of mod.blocs ?? []) {
    for (const niveau of bloc.niveaux ?? []) {
      for (const ch of bloc.chapitres ?? []) {
        const texte = ch.lecon?.cours ?? ''
        if (!/^#{2,4}\s+/m.test(texte)) fautes.push(`[${nom}] cours sans section ## : ${ch.titre}`)
        cours.push({ slug: mod.slug, niveau, chapitre: ch.titre, lecon: ch.lecon.titre, texte })
      }
    }
  }
}

if (fautes.length) {
  console.error(`✗ ${fautes.length} problème(s) :`)
  for (const f of fautes) console.error('  ' + f)
  process.exit(1)
}

const out = []
const w = (s = '') => out.push(s)
w('-- =============================================================================')
w(`-- Studuel — Migration ${NUMERO} : ${titre ?? 'COMPLÉMENTS DE CONTENU'}`)
w('--')
w('-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main.')
w(
  `--    Regénérer : node scripts/seed-complements.mjs --num ${NUMERO}${COMPLEMENTS.length ? ` --complements ${COMPLEMENTS.join(',')}` : ''}${COURS.length ? ` --cours ${COURS.join(',')}` : ''}`,
)
w('--')
for (const l of motifs) w(`-- ${l}`.trimEnd())
if (motifs.length) w('--')
w(`-- Cette migration apporte : ${questions.length} questions ajoutées à des quiz existants`)
w(`-- ${cours.length} cours relus (réécrits seulement si leur texte a changé)`)
w(`-- et ${corrections.length} questions existantes corrigées sur place (identifiant gardé).`)
w('-- AUCUN chapitre créé ni supprimé. Les chapitres sont désignés par leur clé')
w('-- naturelle (matière, niveau, titre) : un chapitre absent est simplement sauté.')
w('--')
w('-- Idempotent : UUID dérivés du contenu, ON CONFLICT DO NOTHING, UPDATE gardés')
w('-- par IS DISTINCT FROM. Rejouable sans risque.')
w('-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.')
w('-- =============================================================================')
w()

if (cours.length) {
  w('-- 1. Cours ----------------------------------------------------------------')
  w('UPDATE public.lessons l SET content = v.content')
  w('  FROM (VALUES')
  w(
    cours
      .map((c) => `    (${q(c.slug)}, ${q(c.niveau)}, ${q(c.chapitre)}, ${q(c.lecon)}, ${qE(c.texte)})`)
      .join(',\n'),
  )
  w('  ) AS v(slug, level, chapter, lesson, content)')
  w('  JOIN public.subjects s ON s.slug = v.slug')
  w('  JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter')
  w(' WHERE l.chapter_id = c.id AND l.title = v.lesson')
  w('   AND l.content IS DISTINCT FROM v.content;')
  w()
}

if (corrections.length) {
  w('-- 1 bis. Questions corrigées ----------------------------------------------')
  w('-- Retrouvées par leur énoncé ACTUEL dans le quiz de leur chapitre ; une')
  w('-- question déjà corrigée (énoncé changé) n’est plus trouvée : rejouable.')
  w('UPDATE public.quiz_questions qq')
  w('   SET question = v.question, kind = v.kind, options = v.options,')
  w('       correct_index = v.correct_index, explanation = v.explanation')
  w('  FROM (VALUES')
  w(
    corrections
      .map(
        (x) =>
          `    (${q(x.slug)}, ${q(x.niveau)}, ${q(x.chapitre)}, ${q(x.ancien)}, ${q(x.texte)}, ${q(x.kind)}, ${q(JSON.stringify(x.options))}::jsonb, ${x.bonne}, ${q(x.explication)})`,
      )
      .join(',\n'),
  )
  w('  ) AS v(slug, level, chapter, ancien, question, kind, options, correct_index, explanation)')
  w('  JOIN public.subjects s ON s.slug = v.slug')
  w('  JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter')
  w('  JOIN public.lessons l ON l.chapter_id = c.id')
  w('  JOIN public.quizzes qz ON qz.lesson_id = l.id')
  w(' WHERE qq.quiz_id = qz.id AND qq.question = v.ancien;')
  w()
}

if (questions.length) {
  w('-- 2. Questions ------------------------------------------------------------')
  w('-- Rangées APRÈS celles du quiz : position = dernière position + rang.')
  w('INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)')
  w('SELECT v.id, qz.id, v.question, v.kind, v.options, v.correct_index, v.explanation,')
  w('       COALESCE((SELECT max(x.position) FROM public.quiz_questions x WHERE x.quiz_id = qz.id), 0) + v.rang')
  w('  FROM (VALUES')
  w(
    questions
      .map(
        (x) =>
          `    (${q(x.id)}::uuid, ${q(x.slug)}, ${q(x.niveau)}, ${q(x.chapitre)}, ${q(x.texte)}, ${q(x.kind)}, ${q(JSON.stringify(x.options))}::jsonb, ${x.bonne}, ${q(x.explication)}, ${x.rang})`,
      )
      .join(',\n'),
  )
  w('  ) AS v(id, slug, level, chapter, question, kind, options, correct_index, explanation, rang)')
  w('  JOIN public.subjects s ON s.slug = v.slug')
  w('  JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter')
  w('  JOIN LATERAL (')
  w('    SELECT qz.id FROM public.lessons l')
  w('      JOIN public.quizzes qz ON qz.lesson_id = l.id')
  w('     WHERE l.chapter_id = c.id')
  w('     ORDER BY l.position, qz.id')
  w('     LIMIT 1')
  w('  ) qz ON true')
  w('ON CONFLICT (id) DO NOTHING;')
  w()
  w('-- 3. Sonde finale ---------------------------------------------------------')
  w('DO $$')
  w('DECLARE n integer;')
  w('BEGIN')
  w('  SELECT count(*) INTO n FROM public.quiz_questions')
  w(`   WHERE id IN (${questions.map((x) => `${q(x.id)}::uuid`).join(', ')});`)
  w(`  RAISE NOTICE 'Migration ${NUMERO} : % questions ajoutées présentes (attendu ${questions.length}).', n;`)
  w(`  IF n < ${questions.length} THEN`)
  w(`    RAISE WARNING 'Migration ${NUMERO} : des chapitres visés sont introuvables (titre ou niveau changé ?).';`)
  w('  END IF;')
  w('END $$;')
}

process.stdout.write(out.join('\n') + '\n')
console.error(
  `✓ ${questions.length} questions · ${cours.length} cours · ${corrections.length} corrections · ${[...matieres].join(', ')}`,
)
