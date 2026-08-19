// Usine à annales : transforme les sessions de `scripts/annales/*.mjs` en une
// migration SQL idempotente pour `exam_papers` (migration 236).
//
//   node scripts/seed-annales.mjs --num 237 --sessions session-2026 > supabase/237_….sql
//
// MÊME PRINCIPE QUE `seed-contenu.mjs`, et pour les mêmes raisons : les UUID
// sont DÉRIVÉS du contenu (SHA-1), donc stables d'une génération à l'autre —
// rejouer la migration ne crée jamais de doublon. Le namespace diffère de celui
// du contenu, pour qu'une épreuve et un chapitre ne puissent jamais collider.
//
// POURQUOI UN GÉNÉRATEUR SÉPARÉ plutôt qu'un mode de plus dans seed-contenu :
// les deux n'écrivent pas les mêmes tables, ne valident pas les mêmes règles
// (un chapitre exige 6 questions, une épreuve exige un barème) et ne suivent
// pas le même rythme — le contenu bouge quand le programme change, les annales
// quand une session tombe. Les mêler aurait fait un script qui fait deux
// métiers et qu'on n'ose plus toucher.
//
// Format d'une session (cf. scripts/annales/session-2026.mjs) :
//   export default {
//     session: '2026',
//     epreuves: [{
//       slug: 'maths', niveau: '3e', examen: 'brevet',
//       centre: 'Oral',                  // FACULTATIF : '' par défaut
//       titre: 'Brevet 2026 — Mathématiques',
//       duree: 120, coefficient: 2,
//       parties: [{ titre, minutes, points, chapitres: [], attendu }],
//     }],
//   }

import { createHash } from 'node:crypto'
import { readdirSync } from 'node:fs'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const ICI = dirname(fileURLToPath(import.meta.url))
const DOSSIER = join(ICI, 'annales')

const NAMESPACE = 'studuel.annales.v1'
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
// Le JSON part en littéral SQL puis est casté : `jsonb` ne se construit pas à
// coups de concaténation sans risquer une apostrophe mal placée dans un texte
// français, qui casserait toute la migration.
const qJson = (v) => `${q(JSON.stringify(v))}::jsonb`

const EXAMENS = ['brevet', 'bac-anticipe', 'bac']

function verifie(mod, fichier) {
  const erreurs = []
  const p = (m) => erreurs.push(`[${fichier}] ${m}`)
  if (!mod.session) p('session manquante')

  const vues = new Set()
  for (const e of mod.epreuves ?? []) {
    const ou = `${e.slug ?? '?'} ${e.niveau ?? '?'} « ${e.titre ?? '?'} »`
    if (!e.slug || !e.niveau || !e.titre) p(`épreuve incomplète : ${ou}`)
    if (!EXAMENS.includes(e.examen)) p(`examen inconnu (${e.examen}) : ${ou}`)
    if (!(e.duree > 0)) p(`durée absente ou nulle : ${ou}`)
    if (!(e.parties ?? []).length) p(`aucune partie : ${ou}`)

    // C'est la contrainte UNIQUE de la table : deux épreuves identiques feraient
    // passer la seconde à la trappe (ON CONFLICT DO NOTHING) sans rien dire.
    const cle = `${e.slug}|${e.niveau}|${mod.session}|${e.centre ?? ''}`
    if (vues.has(cle)) p(`épreuve en double sur (matière, niveau, session, centre) : ${cle}`)
    vues.add(cle)

    for (const part of e.parties ?? []) {
      if (!part.titre || !part.attendu) p(`partie incomplète : ${ou}`)
      // L'« attendu » est la seule chose que l'élève ne trouve nulle part
      // ailleurs. Trop court, il ne dit rien de plus que le titre.
      if ((part.attendu ?? '').length < 80) p(`« attendu » trop court : ${part.titre}`)
      if (!(part.chapitres ?? []).length) p(`partie sans chapitre cité : ${part.titre}`)
    }
  }
  return erreurs
}

function option(nom, defaut) {
  const i = process.argv.indexOf(`--${nom}`)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : defaut
}
const NUMERO = option('num', '237')
const FILTRE = option('sessions', '')
  .split(',')
  .map((s) => s.trim().replace(/\.mjs$/, ''))
  .filter(Boolean)

const fichiers = readdirSync(DOSSIER)
  .filter((f) => f.endsWith('.mjs'))
  .filter((f) => FILTRE.length === 0 || FILTRE.includes(f.replace(/\.mjs$/, '')))
  .sort()

if (fichiers.length === 0) {
  console.error(`✗ aucune session retenue (filtre : ${FILTRE.join(', ') || 'aucun'})`)
  process.exit(1)
}

const sessions = []
for (const f of fichiers) {
  const mod = await import(pathToFileURL(join(DOSSIER, f)).href)
  sessions.push({ fichier: f, ...mod.default })
}

const erreurs = sessions.flatMap((s) => verifie(s, s.fichier))
if (erreurs.length) {
  console.error(`✗ ${erreurs.length} problème(s) :`)
  for (const e of erreurs) console.error('  ' + e)
  process.exit(1)
}

// --- Génération -------------------------------------------------------------
const lignes = []
for (const s of sessions) {
  s.epreuves.forEach((e, i) => {
    const centre = e.centre ?? ''
    lignes.push({
      id: uuid(`${e.slug}|${e.niveau}|${s.session}|${centre}`),
      slug: e.slug,
      niveau: e.niveau,
      examen: e.examen,
      session: s.session,
      centre,
      titre: e.titre,
      duree: e.duree,
      coefficient: e.coefficient ?? null,
      outline: e.parties.map((p) => ({
        title: p.titre,
        minutes: p.minutes ?? null,
        points: p.points ?? null,
        chapters: p.chapitres ?? [],
        expected: p.attendu,
      })),
      position: i + 1,
    })
  })
}

const out = []
const w = (s = '') => out.push(s)

w('-- =============================================================================')
w(`-- Studuel — Migration ${NUMERO} : LES ANNALES — ${sessions.map((s) => `session ${s.session}`).join(', ')}`)
w('--')
w('-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main.')
w('--    Source : scripts/annales/*.mjs')
w(
  `--    Regénérer : node scripts/seed-annales.mjs --num ${NUMERO} --sessions ${fichiers.map((f) => f.replace(/\.mjs$/, '')).join(',')}`,
)
w('--')
w('-- CE QUE LA MIGRATION APPORTE : la STRUCTURE OFFICIELLE de chaque épreuve —')
w('-- durée, coefficient, parties, barème, et les chapitres du programme que')
w('-- chaque partie mobilise. Elle ne reproduit AUCUN énoncé de sujet tombé :')
w('-- ceux-là viendront session par session, dans d’autres fichiers du dossier,')
w('-- et le modèle est prévu pour (les colonnes `session` et `center` distinguent')
w('-- « 2026 » de « 2025 · Amérique du Nord »).')
w('--')
w('-- POURQUOI LA STRUCTURE D’ABORD : c’est ce qu’un élève ignore le plus')
w('-- longtemps et ce qui lui coûte le plus cher le jour J — combien de temps par')
w('-- partie, combien de points, ce qu’on attend exactement. Un sujet tombé se')
w('-- comprend une fois qu’on sait ça ; l’inverse est faux.')
w('--')
w(`-- Cette migration apporte : ${lignes.length} épreuves, ${lignes.reduce((n, l) => n + l.outline.length, 0)} parties.`)
w('--')
w('-- Idempotent : les UUID sont dérivés du contenu (SHA-1), donc stables, et')
w('-- l’INSERT est gardé par ON CONFLICT DO NOTHING. Rejouable sans risque.')
w('--')
w(`-- PRÉREQUIS : 008 (subjects), 236 (exam_papers). Idempotent.`)
w('-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.')
w('-- =============================================================================')
w()
w('-- Jointure sur le SLUG (et non le nom) : c’est la clé stable de `subjects`.')
w(
  'INSERT INTO public.exam_papers (id, subject_id, level, exam, session, center, title, duration_min, coefficient, outline, position)',
)
w(
  'SELECT v.id, s.id, v.level, v.exam, v.session, v.center, v.title, v.duration_min, v.coefficient, v.outline, v.position',
)
w('  FROM (VALUES')
w(
  lignes
    .map(
      (l) =>
        `    (${q(l.id)}::uuid, ${q(l.slug)}, ${q(l.niveau)}, ${q(l.examen)}, ${q(l.session)}, ${q(l.centre)}, ${q(l.titre)}, ${l.duree}, ${l.coefficient ?? 'NULL'}, ${qJson(l.outline)}, ${l.position})`,
    )
    .join(',\n'),
)
w(
  '  ) AS v(id, slug, level, exam, session, center, title, duration_min, coefficient, outline, position)',
)
w('  JOIN public.subjects s ON s.slug = v.slug')
w('-- ON CONFLICT NU : la table porte AUSSI UNIQUE(subject_id, level, session, center),')
w('-- qu’un rejeu déclencherait avant même la clé primaire.')
w('ON CONFLICT DO NOTHING;')
w()
w('-- Contrôle : une épreuve dont la matière n’existe pas est passée à la trappe')
w('-- silencieusement par la jointure ci-dessus. On le dit plutôt que de le taire.')
w('DO $$')
w('DECLARE n INT;')
w('BEGIN')
w('  SELECT count(*) INTO n FROM public.exam_papers;')
w(`  RAISE NOTICE 'exam_papers : % épreuve(s) en base (la migration en apporte ${lignes.length}).', n;`)
w('END $$;')

process.stdout.write(out.join('\n') + '\n')
console.error(
  `✓ ${lignes.length} épreuves · ${lignes.reduce((n, l) => n + l.outline.length, 0)} parties`,
)
