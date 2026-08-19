// Usine à contenu : transforme les modules de `scripts/contenu/*.mjs` en une
// migration SQL idempotente (chapitres → leçons → quiz → questions).
//
//   node scripts/seed-contenu.mjs --num 216 --slugs emc,sport > supabase/216_….sql
//
// `--slugs` limite la génération à certaines matières (défaut : toutes), et
// `--num` fixe le numéro affiché dans l'en-tête. C'est ce qui permet de
// DÉCOUPER le contenu en plusieurs migrations : l'éditeur SQL de Supabase
// devient poussif au-delà de ~300 Ko, et un script à moitié collé est pire
// qu'un script absent.
//
// POURQUOI UN GÉNÉRATEUR plutôt que du SQL écrit à la main : le contenu se
// pense par CYCLE (le programme d'EPS du cycle 4 vaut pour la 5e, la 4e et la
// 3e), mais la base range les chapitres par NIVEAU. Écrire le SQL à la main
// obligerait à recopier trois fois les mêmes questions en changeant les UUID —
// c'est là que se glissent les doublons et les collisions. Ici on écrit une
// fois, la duplication par niveau est mécanique, et les UUID sont DÉRIVÉS du
// contenu (donc stables d'une génération à l'autre : rejouer la migration ne
// crée jamais de doublon).
//
// Format d'un module de contenu (cf. scripts/contenu/README.md) :
//   export default {
//     slug: 'emc',                       // slug de la matière (déjà en base)
//     nom: 'EMC',                        // quizzes.subject
//     blocs: [{
//       niveaux: ['5e', '4e', '3e'],     // le bloc est dupliqué sur chacun
//       chapitres: [{
//         titre: 'La règle et le droit',
//         lecon: { titre: '…', cours: '…markdown…' },
//         questions: [
//           ['Question ?', ['a', 'b', 'c', 'd'], 0, 'Explication.'],
//           ['Affirmation.', ['Vrai', 'Faux'], 1, 'Explication.'],
//         ],
//       }],
//     }],
//   }

import { createHash } from 'node:crypto'
import { readdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ICI = dirname(fileURLToPath(import.meta.url))
const DOSSIER = join(ICI, 'contenu')

// UUID v5 « maison » : dérivé du contenu, donc identique à chaque génération.
// (Le namespace est arbitraire mais FIXE : le changer réécrirait tout.)
const NAMESPACE = 'studuel.contenu.v1'
function uuid(cle) {
  const h = createHash('sha1').update(`${NAMESPACE}:${cle}`).digest('hex')
  const v = [
    h.slice(0, 8),
    h.slice(8, 12),
    `5${h.slice(13, 16)}`,
    ((parseInt(h.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') +
      h.slice(18, 20),
    h.slice(20, 32),
  ]
  return v.join('-')
}

// Échappement SQL : une apostrophe française mal échappée casse toute la
// migration (et le français en est plein).
const q = (s) => `'${String(s).replace(/'/g, "''")}'`
// Littéral E'' pour les cours markdown (retours à la ligne).
const qE = (s) =>
  `E'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\n/g, '\\n')}'`

function verifie(module) {
  const erreurs = []
  const p = (m) => erreurs.push(`[${module.slug}] ${m}`)
  if (!module.slug || !module.nom) p('slug ou nom manquant')
  const vusParNiveau = new Map()

  for (const bloc of module.blocs ?? []) {
    if (!bloc.niveaux?.length) p('bloc sans niveau')
    for (const ch of bloc.chapitres ?? []) {
      if (!ch.titre) p('chapitre sans titre')
      if (!ch.lecon?.titre || !ch.lecon?.cours) p(`leçon incomplète : ${ch.titre}`)
      if ((ch.lecon?.cours ?? '').length < 200)
        p(`cours trop court (< 200 car.) : ${ch.titre}`)
      // Un cours sans titre de section ne produit aucune carte mentale dérivée
      // (cf. lib/mind-map-auto) : on l'exige, sinon la tuile « Carte » manque.
      if (!/^#{2,4}\s+/m.test(ch.lecon?.cours ?? ''))
        p(`cours sans section ## (carte mentale non dérivable) : ${ch.titre}`)
      if ((ch.questions ?? []).length < 6)
        p(`moins de 6 questions : ${ch.titre} (${ch.questions?.length ?? 0})`)

      for (const [texte, options, bonne, explication] of ch.questions ?? []) {
        if (!texte || !explication) p(`question incomplète : ${ch.titre}`)
        if (![2, 4].includes(options?.length))
          p(`question à ${options?.length} options : ${texte}`)
        if (options?.length === 2 && (options[0] !== 'Vrai' || options[1] !== 'Faux'))
          p(`vrai/faux mal formé : ${texte}`)
        if (!(bonne >= 0 && bonne < (options?.length ?? 0)))
          p(`bonne réponse hors bornes : ${texte}`)
        if (new Set(options).size !== options?.length)
          p(`options en double : ${texte}`)
      }

      // Unicité du titre par (matière, niveau) : c'est la contrainte de la base.
      for (const niveau of bloc.niveaux ?? []) {
        const cle = `${niveau}|${ch.titre}`
        if (vusParNiveau.has(cle)) p(`chapitre en double : ${cle}`)
        vusParNiveau.set(cle, true)
      }
    }
  }
  return erreurs
}

function option(nom, defaut) {
  const i = process.argv.indexOf(`--${nom}`)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : defaut
}
const NUMERO = option('num', '216')
const FILTRE = option('slugs', '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
// `--modules` filtre par FICHIER, pas par matière. Nécessaire dès qu'une même
// matière est écrite en PLUSIEURS modules qui doivent partir dans des
// migrations séparées : l'histoire (227, exécutée) et la géographie (229) sont
// toutes deux le slug `histoire-geo`, mais 227 ne doit plus jamais être
// régénérée. `--slugs histoire-geo` les fusionnerait dans un seul fichier.
const FILTRE_FICHIERS = option('modules', '')
  .split(',')
  .map((s) => s.trim().replace(/\.mjs$/, ''))
  .filter(Boolean)

const fichiers = readdirSync(DOSSIER)
  .filter((f) => f.endsWith('.mjs'))
  .sort()

const modules = []
for (const f of fichiers) {
  if (FILTRE_FICHIERS.length && !FILTRE_FICHIERS.includes(f.replace(/\.mjs$/, ''))) continue
  const mod = await import(pathToFileURL(join(DOSSIER, f)).href)
  if (FILTRE.length === 0 || FILTRE.includes(mod.default.slug)) modules.push(mod.default)
}
if (modules.length === 0) {
  console.error(
    `✗ aucune matière retenue (slugs : ${FILTRE.join(', ') || 'aucun'} · modules : ${FILTRE_FICHIERS.join(', ') || 'aucun'})`,
  )
  process.exit(1)
}

const erreurs = modules.flatMap(verifie)
if (erreurs.length) {
  console.error(`✗ ${erreurs.length} problème(s) de contenu :`)
  for (const e of erreurs) console.error('  ' + e)
  process.exit(1)
}

// --- Génération -------------------------------------------------------------
const chapitres = []
const lecons = []
const quiz = []
const questions = []

for (const mod of modules) {
  for (const bloc of mod.blocs) {
    for (const niveau of bloc.niveaux) {
      bloc.chapitres.forEach((ch, i) => {
        const cleCh = `${mod.slug}|${niveau}|${ch.titre}`
        const idCh = uuid(cleCh)
        const idLe = uuid(`${cleCh}|lecon|${ch.lecon.titre}`)
        const idQz = uuid(`${cleCh}|quiz`)

        // `positionDepart` sert quand le bloc VIENT S'AJOUTER derrière des
        // chapitres déjà en base : la page matière trie par `position`, et
        // repartir de 1 mêlerait les nouveaux aux anciens dans un ordre
        // indéfini (positions à égalité). Par défaut, on numérote depuis 1.
        const depart = bloc.positionDepart ?? 1
        // `axe` = l'intitulé du programme officiel qui coiffe ce chapitre
        // (colonne `chapters.theme`, migration 234). Se déclare sur le bloc, ou
        // sur le chapitre quand un même bloc en couvre plusieurs.
        const axe = ch.axe ?? bloc.axe ?? null
        chapitres.push({
          id: idCh,
          slug: mod.slug,
          niveau,
          titre: ch.titre,
          position: depart + i,
          axe,
        })
        lecons.push({ id: idLe, chapitre: idCh, titre: ch.lecon.titre, cours: ch.lecon.cours })
        quiz.push({
          id: idQz,
          titre: `Quiz — ${ch.lecon.titre}`,
          matiere: mod.nom,
          niveau,
          chapitre: ch.titre,
          lecon: idLe,
        })
        ch.questions.forEach(([texte, options, bonne, explication], j) => {
          questions.push({
            id: uuid(`${cleCh}|q${j}|${texte}`),
            quiz: idQz,
            texte,
            kind: options.length === 2 ? 'true_false' : 'mcq',
            options,
            bonne,
            explication,
            position: j + 1,
          })
        })
      })
    }
  }
}

const nomsMatieres = modules.map((m) => m.slug)

// La commande de régénération imprimée dans l'en-tête doit être CELLE QUI A
// SERVI, pas une reconstruction par slug. Sinon elle ment — et dangereusement :
// trois fichiers portent le slug `espagnol` et deux le slug `histoire-geo`, si
// bien qu'un `--slugs espagnol` les fusionnerait dans un seul SQL et réécrirait
// une migration DÉJÀ EXÉCUTÉE. On rejoue donc le filtre effectivement employé.
const commandeRegen = FILTRE_FICHIERS.length
  ? `--modules ${FILTRE_FICHIERS.join(',')}`
  : `--slugs ${nomsMatieres.join(',')}`

// Un module peut porter son propre titre d'en-tête et son propre motif : les
// migrations 216→220 comblaient des matières VIDES, ce qui ne sera pas toujours
// le cas. Sans ces deux crochets, toute migration de contenu ultérieure hérite
// d'un en-tête qui ment. Défauts = le texte historique, donc 216→220 se
// regénèrent à l'identique.
const titreEntete =
  modules.find((m) => m.titreMigration)?.titreMigration ?? 'LE CONTENU DES MATIÈRES VIDES'
const motifs = modules.flatMap((m) => (m.motif ?? '').split('\n')).filter(Boolean)

const out = []
const w = (s = '') => out.push(s)

w('-- =============================================================================')
w(`-- Studuel — Migration ${NUMERO} : ${titreEntete}`)
w('--')
w('-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main.')
w('--    Source : scripts/contenu/*.mjs')
w(`--    Regénérer : node scripts/seed-contenu.mjs --num ${NUMERO} ${commandeRegen}`)
w('--')
if (motifs.length) {
  for (const ligne of motifs) w(`-- ${ligne}`)
} else {
  w('-- CONSTAT MESURÉ (node _ASSOCIE/sonde-contenu.mjs, 01/08/2026) : 11 matières')
  w('-- sur 31 n’avaient AUCUN chapitre — des coquilles cliquables. Un élève qui')
  w('-- ouvrait Sport, EMC, Musique, Arts plastiques, Allemand, Grec, SNT, HLP,')
  w('-- LLCER, SI ou Maths complémentaires tombait sur un programme vide.')
}
w('--')
w(`-- Cette migration apporte : ${chapitres.length} chapitres, ${lecons.length} leçons,`)
w(
  `-- ${quiz.length} quiz et ${questions.length} questions, sur ${nomsMatieres.length} matière${nomsMatieres.length > 1 ? 's' : ''}.`,
)
w('--')
w('-- CHOIX ASSUMÉS :')
// Ce choix ne se raconte que s'il a servi : une matière d'un seul niveau (la
// philosophie ne s'enseigne qu'en Tle) n'a rien à dupliquer. Réservé aux
// modules qui prennent leur en-tête en main (`motif`) : 216→220 sont déjà
// exécutées, elles doivent se regénérer à l'octet près.
const dupliqueParCycle = modules.some((m) => m.blocs.some((b) => b.niveaux.length > 1))
if (!motifs.length || dupliqueParCycle) {
  w('--  · le contenu est écrit par CYCLE (le programme d’EPS du cycle 4 vaut pour')
  w('--    la 5e, la 4e et la 3e) puis dupliqué sur chaque niveau du cycle : c’est')
  w('--    ainsi que sont écrits les programmes de l’Éducation nationale ;')
}
w('--  · tous les quiz sont `is_free = true`. Aucun compte ne peut aujourd’hui')
w('--    passer `tier1` (aucun paiement n’existe), donc un quiz payant serait un')
w('--    quiz INVISIBLE pour 100 % des élèves — le contraire du but ;')
w('--  · chaque cours porte des sections `##`, ce qui rend sa carte mentale')
w('--    dérivable (cf. lib/mind-map-auto) : aucune tuile ne promet dans le vide.')
w('--')
w('-- Idempotent : les UUID sont dérivés du contenu (SHA-1), donc stables ; les')
w('-- INSERT sont tous gardés par ON CONFLICT DO NOTHING. Rejouable sans risque.')
w('--')
w('-- PRÉREQUIS : 002, 008, 191, 193 exécutées (les matières doivent exister).')
w('-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.')
w('-- =============================================================================')
w()

// 0. Ménage : du SQL fourni par le module, joué AVANT les insertions. Sert au
// cas où un ancien découpage de chapitres entre en collision avec le nouveau —
// `chapters` porte UNIQUE(subject_id, level, title), donc un titre déjà pris
// ferait passer le chapitre à la trappe (ON CONFLICT DO NOTHING) et sa leçon
// tomberait ensuite sur une clé étrangère absente : migration à moitié jouée.
const menages = modules.flatMap((m) => (m.menage ?? []).map((x) => ({ slug: m.slug, ...x })))
if (menages.length) {
  w('-- 0. Ménage ----------------------------------------------------------------')
  for (const m of menages) {
    for (const ligne of m.raison.split('\n')) w(`-- [${m.slug}] ${ligne}`)
    w(m.sql.trim())
    w()
  }
}

// La colonne `theme` n'est ÉCRITE que si le module déclare au moins un axe.
// Sans cette condition, régénérer une migration déjà exécutée (216 → 233, dont
// aucune ne porte d'axe) produirait un SQL différent de celui du dépôt : la
// commande imprimée dans son en-tête ne la reproduirait plus à l'octet près,
// et la seule garantie qu'on ait qu'un fichier généré dit bien ce qu'il fait
// tomberait. Vérifié : 216 → 233 se régénèrent à l'identique.
const avecAxes = chapitres.some((c) => c.axe)

w('-- 1. Chapitres -------------------------------------------------------------')
w('-- Jointure sur le SLUG (et non le nom) : c’est la clé stable de `subjects`.')
w(
  `INSERT INTO public.chapters (id, subject_id, level, title, position${avecAxes ? ', theme' : ''})`,
)
w(`SELECT v.id, s.id, v.level, v.title, v.position${avecAxes ? ', v.theme' : ''}`)
w('  FROM (VALUES')
w(
  chapitres
    .map(
      (c) =>
        `    (${q(c.id)}::uuid, ${q(c.slug)}, ${q(c.niveau)}, ${q(c.titre)}, ${c.position}${avecAxes ? `, ${c.axe ? q(c.axe) : 'NULL'}` : ''})`,
    )
    .join(',\n'),
)
w(`  ) AS v(id, slug, level, title, position${avecAxes ? ', theme' : ''})`)
w('  JOIN public.subjects s ON s.slug = v.slug')
w('-- ON CONFLICT NU : `chapters` porte aussi UNIQUE(subject_id, level, title).')
w('ON CONFLICT DO NOTHING;')
w()

// L'INSERT ci-dessus ne touche PAS une ligne déjà en base (ON CONFLICT DO
// NOTHING) : un chapitre existant garderait donc son axe d'avant, et un module
// qui pose ses axes après coup n'aurait aucun effet. D'où cet UPDATE, joué sur
// les mêmes identifiants dérivés du contenu — donc stables et rejouables.
if (avecAxes) {
  w('-- 1 bis. Axes du programme -------------------------------------------------')
  w('-- `chapters.theme` (migration 234) : l’intitulé du programme officiel qui')
  w('-- coiffe le chapitre. La page matière s’en sert pour grouper au lieu')
  w('-- d’aligner 28 lignes à plat. UPDATE et non INSERT : le chapitre peut déjà')
  w('-- exister (l’INSERT précédent l’aurait alors ignoré).')
  w('UPDATE public.chapters c SET theme = v.theme')
  w('  FROM (VALUES')
  w(
    chapitres
      .filter((c) => c.axe)
      .map((c) => `    (${q(c.id)}::uuid, ${q(c.axe)})`)
      .join(',\n'),
  )
  w('  ) AS v(id, theme)')
  w(' WHERE c.id = v.id AND c.theme IS DISTINCT FROM v.theme;')
  w()
}

w('-- 2. Leçons ----------------------------------------------------------------')
w('INSERT INTO public.lessons (id, chapter_id, title, content, position) VALUES')
w(
  lecons
    .map((l) => `  (${q(l.id)}, ${q(l.chapitre)}, ${q(l.titre)}, ${qE(l.cours)}, 1)`)
    .join(',\n'),
)
w('ON CONFLICT DO NOTHING;')
w()

w('-- 3. Quiz ------------------------------------------------------------------')
w('-- Double garde : ON CONFLICT (id) protège du rejeu, et le NOT EXISTS protège')
w('-- la leçon d’un SECOND quiz venu d’ailleurs — le hub de leçon lit son quiz en')
w('-- .maybeSingle(), deux quiz feraient lever « multiple rows » à de vrais élèves.')
w('INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)')
w('SELECT v.id, v.title, v.subject, v.grade_level, v.chapter, true, l.id')
w('  FROM (VALUES')
w(
  quiz
    .map(
      (z) =>
        `    (${q(z.id)}::uuid, ${q(z.titre)}, ${q(z.matiere)}, ${q(z.niveau)}, ${q(z.chapitre)}, ${q(z.lecon)}::uuid)`,
    )
    .join(',\n'),
)
w('  ) AS v(id, title, subject, grade_level, chapter, lesson_id)')
w('  JOIN public.lessons l ON l.id = v.lesson_id')
w(' WHERE NOT EXISTS (SELECT 1 FROM public.quizzes qz WHERE qz.lesson_id = l.id)')
w('ON CONFLICT (id) DO NOTHING;')
w()

w('-- 4. Questions -------------------------------------------------------------')
w(
  'INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)',
)
w('SELECT v.id, v.quiz_id, v.question, v.kind, v.options, v.correct_index, v.explanation, v.position')
w('  FROM (VALUES')
w(
  questions
    .map(
      (x) =>
        `    (${q(x.id)}::uuid, ${q(x.quiz)}::uuid, ${q(x.texte)}, ${q(x.kind)}, ${q(JSON.stringify(x.options))}::jsonb, ${x.bonne}, ${q(x.explication)}, ${x.position})`,
    )
    .join(',\n'),
)
w('  ) AS v(id, quiz_id, question, kind, options, correct_index, explanation, position)')
w('-- Le quiz doit exister : si le NOT EXISTS ci-dessus a écarté un quiz (une')
w('-- leçon en avait déjà un), ses questions ne partent pas dans le vide.')
w(' WHERE EXISTS (SELECT 1 FROM public.quizzes qz WHERE qz.id = v.quiz_id)')
w('ON CONFLICT (id) DO NOTHING;')
w()

w('-- 5. Sonde finale ----------------------------------------------------------')
w('DO $$')
w('DECLARE')
w('  n_vides integer;')
w('  n_chap  integer;')
w('BEGIN')
w('  SELECT count(*) INTO n_chap FROM public.chapters c')
w(`   JOIN public.subjects s ON s.id = c.subject_id`)
w(`   WHERE s.slug IN (${nomsMatieres.map(q).join(', ')});`)
w('  SELECT count(*) INTO n_vides FROM public.subjects s')
w(`   WHERE s.slug IN (${nomsMatieres.map(q).join(', ')})`)
w('     AND NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.subject_id = s.id);')
w('  IF n_vides > 0 THEN')
w(`    RAISE EXCEPTION 'Migration ${NUMERO} incomplète : % matiere(s) encore sans chapitre', n_vides;`)
w('  END IF;')
w(`  RAISE NOTICE 'Migration ${NUMERO} OK : % chapitres sur les matieres visees.', n_chap;`)
w('END $$;')

process.stdout.write(out.join('\n') + '\n')
console.error(
  `✓ ${chapitres.length} chapitres · ${lecons.length} leçons · ${quiz.length} quiz · ${questions.length} questions`,
)
