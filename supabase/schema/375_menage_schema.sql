-- =============================================================================
-- Studuel — Migration 375 : ménage du schéma (audit des migrations, 22/09/2026)
--
-- CE QUE CETTE MIGRATION N'EST PAS. Elle ne rend pas l'app plus rapide « parce
-- qu'il y a moins de fichiers » : la base n'exécute une migration qu'une fois,
-- quand on la colle, et ne relit jamais le dossier supabase/. Le nombre de
-- fichiers (147 dans schema/, 226 dans contenu/) n'a aucun effet à l'écran.
--
-- CE QU'ELLE EST. L'audit (docs/audit-migrations.md) a reconstruit l'ÉTAT
-- FINAL produit par les 147 fichiers de schema/ — 115 tables, 169 fonctions,
-- 149 policies, 107 index, 11 triggers — et a croisé chaque objet avec le code
-- (app/, lib/, components/, scripts/) et avec le corps de chaque fonction SQL
-- vivante. Ce qui suit est ce que plus rien ne tient.
--
--   1. SIX INDEX REDONDANTS. Chacun est le PRÉFIXE de la clé primaire ou
--      d'une contrainte UNIQUE de sa table : un index B-tree sur (a, b, c)
--      sert déjà les recherches sur (a) et sur (a, b). Le planificateur ne les
--      choisit jamais ; chaque écriture les entretient pour rien.
--   2. CINQ TABLES MORTES. Aucun écran, aucune action, aucune fonction SQL
--      vivante ne les nomme : le tableau de révision (005) et le débrief du
--      soir (027), retirés avec le code mort du commit f345eb0 ; la
--      bibliothèque de fiches (158), remplacée par le carnet.
--      ⚠️ Leurs lignes — des données d'élèves que plus aucun écran ne lit
--      depuis des semaines — disparaissent avec elles.
--   3. UNE FONCTION MORTE. `season_crowns_for_tier` (207) : ni le code ni
--      aucune autre fonction ne l'appelle (le barème vit dans lib/saison).
--
-- GARDÉ VOLONTAIREMENT : `app_flags` (192). Cette table d'UN enregistrement est
-- le garde-fou qui empêche la 192 de re-multiplier les gemmes si on la rejoue.
-- La supprimer transformerait une migration idempotente en migration
-- destructrice.
--
-- Idempotent — le rejeu est sans effet. À exécuter APRÈS la 374, à la main :
-- Supabase Dashboard → SQL Editor → New query → Run.
-- Sonde : `library_items` a disparu (type 'table-absente', lib/sante.ts).
-- =============================================================================

-- ------------------------------------------------- 1. Index redondants ---
DROP INDEX IF EXISTS public.chapters_subject_level_idx;    -- ⊂ UNIQUE (subject_id, level, title)           008
DROP INDEX IF EXISTS public.lessons_chapter_idx;           -- ⊂ UNIQUE (chapter_id, title)                  008
DROP INDEX IF EXISTS public.chapter_unlocks_user_idx;      -- ⊂ PK (user_id, chapter_id)                    183
DROP INDEX IF EXISTS public.boss_gauges_user_idx;          -- ⊂ PK (user_id, boss_id)                       212
DROP INDEX IF EXISTS public.exam_papers_subject_level_idx; -- ⊂ UNIQUE (subject_id, level, session, center) 236
DROP INDEX IF EXISTS public.dictee_segments_dictee_idx;    -- ⊂ PK (dictee_id, position)                    318

-- --------------------------------------------------- 2. Tables mortes ---
-- Leurs policies et leurs index tombent avec elles. `revision_items`
-- référence `revision_subjects` : les enfants d'abord.
DROP TABLE IF EXISTS public.revision_items;    -- 005
DROP TABLE IF EXISTS public.revision_subjects; -- 005
DROP TABLE IF EXISTS public.debrief_logs;      -- 027
DROP TABLE IF EXISTS public.debrief_habits;    -- 027
DROP TABLE IF EXISTS public.library_items;     -- 158

-- ------------------------------------------------- 3. Fonction morte ---
DROP FUNCTION IF EXISTS public.season_crowns_for_tier(INTEGER); -- 207

-- Rappel (rien à exécuter ici) : la 320 enveloppe automatiquement les policies
-- neuves en `(SELECT auth.uid())`. Si `_mesurer-perf.sql` § 2 rend des lignes,
-- terminer par : SELECT public.optimiser_policies_rls();
