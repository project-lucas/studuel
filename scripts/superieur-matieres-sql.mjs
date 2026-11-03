/**
 * Écrit LA MIGRATION DES MATIÈRES DU SUPÉRIEUR depuis lib/superieur/cursus.ts,
 * la seule source de vérité des cursus : on ne recopie jamais une liste de
 * soixante matières à la main.
 *
 *   node scripts/superieur-matieres-sql.mjs
 *     → supabase/schema/606_matieres_superieur.sql
 *
 * Ne réécrire le fichier QUE tant que la 606 n'est pas exécutée en production.
 * Après, une matière de plus = une nouvelle migration (règle du projet).
 */

import { writeFile } from 'node:fs/promises'
import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url, { alias: { '@': process.cwd() } })
const { CURSUS, classesDeMatiere } = await jiti.import('../lib/superieur/cursus.ts')

/** L'émoji de secours (colonne `icon`) : celui du secteur. L'app sert la vignette. */
const EMOJI = { droit: '⚖️', eco: '📈', psycho: '🧠', staps: '🏃', sante: '🩺' }

const q = (s) => `'${String(s).replaceAll("'", "''")}'`
const tableau = (xs) => `'{${xs.map((x) => `"${x}"`).join(',')}}'`

const lignes = []
const slugs = []
for (const c of CURSUS) {
  lignes.push(`  -- ${c.nom.includes('(') ? c.nom : `${c.nom} (${c.annees.join(', ')})`}`)
  for (const m of c.matieres) {
    slugs.push(m.slug)
    lignes.push(
      `  (${q(m.slug)}, ${q(m.nom)}, ${q(EMOJI[c.id])}, ${q(m.couleur)}, 'tronc_commun', ${tableau(classesDeMatiere(m.slug))}),`,
    )
  }
}
// La dernière ligne de valeurs ne prend pas de virgule.
const derniere = lignes.findLastIndex((l) => l.startsWith('  ('))
lignes[derniere] = lignes[derniere].replace(/,$/, '')

const n = slugs.length
const sql = `-- =============================================================================
-- Studuel — Migration 606 : LES MATIÈRES DU SUPÉRIEUR (03/11/2026)
--
-- Les étudiants arrivent : cinq cursus, le Pareto des vœux Parcoursup 2025 —
-- PASS, droit, STAPS, psychologie, économie-gestion (docs/CADRAGE-SUPERIEUR.md).
-- Chaque cursus a une CLASSE par année (« L1 droit », « L2 droit »…, « PASS »),
-- déclarée dans lib/types.ts comme la voie techno ; cette migration déclare les
-- ${n} matières de ces classes, chacune pour les seules années qui la suivent
-- (\`subjects.levels\`). Un collégien ou un lycéen ne les voit donc jamais.
--
-- Fichier GÉNÉRÉ par scripts/superieur-matieres-sql.mjs depuis
-- lib/superieur/cursus.ts — ne pas l'éditer à la main.
--
-- Leur contenu (chapitres, cours, quiz) vit à la classe EXACTE
-- (\`chapters.level = 'L1 droit'\`), sans alias ; il arrive par les migrations de
-- contenu qui suivent. Tant qu'elles manquent, ces matières s'affichent
-- « Bientôt », comme partout ailleurs.
--
-- Catégorie 'tronc_commun' : à l'onboarding, toutes les matières de l'année
-- sont cochées, l'étudiant fait le tri au stylo (lib/programme-classes.ts).
-- Aucun slug ne recouvre une matière existante (vérifié le 03/11/2026).
--
-- Idempotent (ON CONFLICT (slug) DO UPDATE). Supabase Dashboard → SQL Editor →
-- New query → Run.
-- =============================================================================

INSERT INTO public.subjects (slug, name, icon, color, category, levels)
VALUES
${lignes.join('\n')}
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color,
      category = EXCLUDED.category, levels = EXCLUDED.levels;

DO $sonde$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n FROM public.subjects
   WHERE slug IN (${slugs.map(q).join(', ')});
  IF n <> ${n} THEN
    RAISE EXCEPTION 'Migration 606 : % matière(s) du supérieur sur ${n}', n;
  END IF;
  RAISE NOTICE 'Migration 606 OK : ${n} matières du supérieur déclarées.';
END $sonde$;
`

await writeFile('supabase/schema/606_matieres_superieur.sql', sql)
console.log(`606_matieres_superieur.sql : ${n} matières`)
