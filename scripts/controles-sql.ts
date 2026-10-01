// -----------------------------------------------------------------------------
// LE CATALOGUE DES CONTRÔLES BLANCS → une migration SQL.
//
//   node node_modules/jiti/lib/jiti-cli.mjs scripts/controles-sql.ts \
//     --num 390 --niveau 3e [--matieres maths,svt] [--lots c10,c11] [--verifier] \
//     > supabase/contenu/390_controles_3e.sql
//
// Lit contenu/controles/<niveau>/<matière>[.<lot>].json : trois sujets écrits
// d'avance par fiche (Facile, Moyen, Difficile), chacun avec son barème sur 20
// et son corrigé type — le même contrat que la 365 (6e), qui avait été générée
// depuis un script de scratchpad perdu depuis. Ce fichier-ci le remplace.
//
// Format d'un fichier :
//   { "niveau": "3e", "matiere": "maths", "sujets": [
//       { "chapitre": "<uuid du chapitre>", "difficulte": 1,
//         "titre": "…", "consigne": "…", "enonce": "…markdown…",
//         "bareme": [{ "critere": "…", "points": 8 }, …],   // somme = 20
//         "dureeMin": 8, "corrige": "…markdown…" } ] }
//
// Tout est RELU avant d'écrire (une seule faute et rien n'est écrit) :
// parseExercice doit accepter le sujet sans rien tronquer, le barème doit déjà
// faire 20, chaque fiche doit avoir ses trois niveaux, une seule fois chacun.
// `--verifier` relit sans rien écrire sur STDOUT.
//
// L'identifiant d'un sujet est dérivé de (fiche, niveau), comme dans la 365 :
// rejouer la migration met le sujet à jour au lieu de le dupliquer. Une fiche
// absente de la base est sautée (jointure sur chapters). Le résumé part sur
// STDERR : ne JAMAIS rediriger les deux flux dans le fichier.
// -----------------------------------------------------------------------------

import fs from 'node:fs'
import path from 'node:path'
import {
  EXERCICE_SUR,
  parseExercice,
  styleExercice,
  type Difficulte,
} from '../lib/exercice'

type Sujet = {
  chapitre: string
  difficulte: Difficulte
  titre: string
  consigne: string
  enonce: string
  bareme: { critere: string; points: number }[]
  dureeMin: number
  corrige: string
}
type Fichier = { niveau: string; matiere: string; sujets: Sujet[] }

function option(nom: string): string | undefined {
  const i = process.argv.indexOf(`--${nom}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

const num = option('num') ?? '000'
const niveau = option('niveau')
const matieres = option('matieres')?.split(',').filter(Boolean)
// `--lots c10,c11` : ne prendre que les fichiers <matière>.<lot>[a|b].json de ces
// lots — une nouvelle vague a sa migration à elle, sans rejouer les sujets déjà en base.
const lots = option('lots')?.split(',').filter(Boolean)
const verifierSeulement = process.argv.includes('--verifier')
if (!niveau || (!verifierSeulement && !/^\d{3}$/.test(num))) {
  console.error('Usage : controles-sql.ts --num NNN --niveau 3e [--matieres a,b] [--verifier]')
  process.exit(1)
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
const LIMITES = { titre: 120, consigne: 600, enonce: 4_000, corrige: 4_000 } as const

export function fautesSujet(s: Sujet, ou: string): string[] {
  const f: string[] = []
  if (!UUID.test(s.chapitre ?? '')) f.push(`${ou} : chapitre absent ou mal formé`)
  if (![1, 2, 3].includes(s.difficulte)) f.push(`${ou} : difficulte hors 1..3`)
  for (const [cle, max] of Object.entries(LIMITES)) {
    const v = (s as Record<string, unknown>)[cle]
    if (typeof v !== 'string' || !v.trim()) f.push(`${ou} : ${cle} vide`)
    else if (v.trim().length > max) f.push(`${ou} : ${cle} dépasse ${max} caractères (${v.trim().length})`)
  }
  if ((s.corrige ?? '').trim().length < 200) f.push(`${ou} : corrigé trop court (< 200 caractères)`)
  if ((s.enonce ?? '').trim().length < 120) f.push(`${ou} : énoncé trop court (< 120 caractères)`)
  const somme = (s.bareme ?? []).reduce((t, l) => t + (Number(l.points) || 0), 0)
  if (somme !== EXERCICE_SUR) f.push(`${ou} : barème sur ${somme}, il doit faire ${EXERCICE_SUR}`)
  if ((s.bareme ?? []).length < 2 || (s.bareme ?? []).length > 5) f.push(`${ou} : barème de 2 à 5 critères`)
  if ((s.bareme ?? []).some((l) => !Number.isInteger(l.points) || l.points <= 0))
    f.push(`${ou} : points entiers et positifs`)
  if (!Number.isInteger(s.dureeMin) || s.dureeMin < 5 || s.dureeMin > 20) f.push(`${ou} : dureeMin entre 5 et 20`)
  const lu = parseExercice(s)
  if (!lu) f.push(`${ou} : refusé par parseExercice`)
  else if (JSON.stringify(lu.bareme) !== JSON.stringify(s.bareme.map((l) => ({ critere: l.critere.trim(), points: l.points }))))
    f.push(`${ou} : barème réécrit par normaliserBareme (critère trop long ou points à reprendre)`)
  return f
}

const dossier = path.join(process.cwd(), 'contenu', 'controles', niveau)
const noms = fs
  .readdirSync(dossier)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .filter((m) => !matieres || matieres.includes(m.split('.')[0]))
  .filter((m) => !lots || lots.some((l) => new RegExp(`^${l}[a-z]?$`).test(m.split('.')[1] ?? '')))
  .sort()

const DELIM = '$exo$'
const lignes: string[] = []
// Les fiches visées, gardées à part pour le contrôle d'arrivée : les recouper
// dans le texte des lignes (par position) donnait des identifiants tronqués.
const fiches = new Set<string>()
const resume: string[] = []
const fautes: string[] = []
const vus = new Set<string>()

for (const nom of noms) {
  const fichier = JSON.parse(fs.readFileSync(path.join(dossier, `${nom}.json`), 'utf8')) as Fichier
  if (fichier.niveau !== niveau) fautes.push(`${nom} : niveau ${fichier.niveau} ≠ ${niveau}`)
  const parFiche = new Map<string, Set<number>>()
  fichier.sujets.forEach((s, i) => {
    const ou = `${niveau}/${nom}#${i}`
    fautes.push(...fautesSujet(s, ou))
    const cle = `${s.chapitre}:${s.difficulte}`
    if (vus.has(cle)) fautes.push(`${ou} : fiche ${s.chapitre} niveau ${s.difficulte} en double`)
    vus.add(cle)
    const set = parFiche.get(s.chapitre) ?? new Set<number>()
    set.add(s.difficulte)
    parFiche.set(s.chapitre, set)
    const contenu = JSON.stringify({
      titre: s.titre.trim(),
      consigne: s.consigne.trim(),
      enonce: s.enonce.trim(),
      bareme: s.bareme.map((l) => ({ critere: l.critere.trim(), points: l.points })),
      dureeMin: s.dureeMin,
      corrige: s.corrige.trim(),
    })
    if (contenu.includes(DELIM)) fautes.push(`${ou} : le délimiteur ${DELIM} apparaît dans le contenu`)
    fiches.add(s.chapitre)
    lignes.push(
      `  ('${s.chapitre}'::uuid, ${s.difficulte}, '${styleExercice(fichier.matiere)}', ${DELIM}${contenu}${DELIM}::jsonb)`,
    )
  })
  for (const [chapitre, set] of parFiche)
    if (set.size !== 3) fautes.push(`${nom} : la fiche ${chapitre} n'a que ${set.size} niveau(x) sur 3`)
  resume.push(`--   ${nom.padEnd(26)} ${String(fichier.sujets.length).padStart(4)} sujets · ${parFiche.size} fiches`)
}

if (fautes.length) {
  for (const f of fautes) console.error(`FAUTE ${f}`)
  console.error(`\n${fautes.length} faute(s) : rien n'est écrit.`)
  process.exit(1)
}
console.error(`✓ ${lignes.length} sujets relus (${niveau}${matieres ? ` · ${matieres.join(', ')}` : ''})`)
if (verifierSeulement) process.exit(0)

const out: string[] = []
const w = (s = '') => out.push(s)
w('-- =============================================================================')
w(`-- ${num} — LE CATALOGUE DES CONTRÔLES BLANCS : ${niveau}${matieres ? ` (${matieres.join(', ')})` : ''}`)
w('--')
w(`-- ${lignes.length} sujets écrits d'avance et relus : pour chaque fiche, un sujet`)
w('-- Facile, un Moyen, un Difficile, chacun avec son barème sur 20 et son corrigé')
w("-- type (`contenu.corrige`, jamais envoyé à l'élève avant sa copie). L'IA ne fait")
w('-- plus que les corriger ; elle ne rédige que « Un autre sujet ».')
w('--')
w('-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main. Source : contenu/controles/.')
w(`--    Regénérer : node node_modules/jiti/lib/jiti-cli.mjs scripts/controles-sql.ts --num ${num} --niveau ${niveau}${matieres ? ` --matieres ${matieres.join(',')}` : ''}`)
w('--')
for (const r of resume) w(r)
w('--')
w("-- L'identifiant d'un sujet est dérivé de (fiche, niveau) : rejouer la migration")
w('-- met le sujet à jour au lieu de le dupliquer. Une fiche absente est sautée.')
w('--')
w('-- PRÉREQUIS : 360 puis 364. Idempotent. À exécuter à la main dans :')
w('-- Supabase Dashboard → SQL Editor → New query → Run.')
w('-- =============================================================================')
w()
w('INSERT INTO public.chapter_exercices')
w('  (id, chapter_id, style, contenu, difficulte, origine, created_by)')
w('SELECT')
w("  md5('exercice-catalogue:' || v.chapter_id::text || ':' || v.difficulte::text)::uuid,")
w('  v.chapter_id,')
w('  v.style,')
w('  v.contenu,')
w('  v.difficulte,')
w("  'catalogue',")
w('  NULL')
w('FROM (VALUES')
w(lignes.join(',\n'))
w(') AS v (chapter_id, difficulte, style, contenu)')
w('JOIN public.chapters c ON c.id = v.chapter_id')
w('ON CONFLICT (id) DO UPDATE')
w('  SET style      = EXCLUDED.style,')
w('      contenu    = EXCLUDED.contenu,')
w('      difficulte = EXCLUDED.difficulte,')
w("      origine    = 'catalogue';")
w()
w('DO $$')
w('DECLARE')
w('  n INT;')
w('BEGIN')
w('  SELECT count(*) INTO n')
w('    FROM public.chapter_exercices e')
w("   WHERE e.origine = 'catalogue'")
w(`     AND e.chapter_id IN (${[...fiches].map((id) => `'${id}'`).join(', ')});`)
w(`  RAISE NOTICE '${num} : % sujets au catalogue (attendu : ${lignes.length})', n;`)
w(`  IF n < ${lignes.length} THEN`)
w(`    RAISE WARNING '${num} : il manque des sujets — des fiches ont-elles changé d''identifiant ?';`)
w('  END IF;')
w('END $$;')
process.stdout.write(out.join('\n') + '\n')
