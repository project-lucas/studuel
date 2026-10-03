-- =============================================================================
-- Studuel — Migration 555 : les quêtes du jour autour des TROIS GESTES
--
-- Lucas, 03/10/2026 : « les quêtes journalières sont centrales (comme Genshin
-- Impact), on ne veut pas les rater ». Elles ne comptaient que le duel classé,
-- et quatre d'entre elles (réviser des cartes, session de préparation, deux
-- chapitres) comptaient des choses que rien n'alimentait : elles étaient
-- infinissables. Désormais, chaque jour, une quête par geste de l'app :
--   · APPRENDRE  : terminer 1 ou 2 cours ;
--   · SE TESTER  : terminer un quiz, en réussir un à 80 %, trouver 20 bonnes
--                  réponses, ou (abonnés de 3e, 1re, Tle) réussir un exercice
--                  du cahier ;
--   · JOUER      : jouer ou gagner un duel, jouer 2 parties de l'arène.
--
-- Seul le CATALOGUE change : la progression (quest_save_progress) n'accepte
-- que les ids qu'il connaît, et la réclamation (quest_claim) y lit ce que
-- chaque quête vaut. Les anciens ids restent dedans : une progression de la
-- journée en cours, faite avant le déploiement, se paie encore.
--
-- MIROIR de lib/quests.ts (QUEST_CATALOG). Toute modification du catalogue
-- doit être faite DES DEUX CÔTÉS.
--
-- PRÉREQUIS : 205 (tables et RPC des quêtes), 209 (quest_claim durcie).
-- Idempotente. À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.quest_catalog()
RETURNS TABLE (id TEXT, goal INTEGER, xp INTEGER, gems INTEGER)
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT * FROM (VALUES
    -- Les trois gestes (03/10/2026) — MIROIR de lib/quests.QUEST_CATALOG.
    ('lecon1',     1,  30,  3),
    ('lecon2',     2,  50,  5),
    ('quiz1',      1,  30,  3),
    ('quiz80',     1,  40,  4),
    ('correct20',  20, 40,  4),
    ('exercice1',  1,  50,  5),
    ('duel1',      1,  30,  3),
    ('win1',       1,  40,  4),
    ('partie2',    2,  30,  3),
    -- Les anciennes quêtes, gardées pour payer une journée commencée avant le
    -- déploiement. Plus aucun code ne les tire.
    ('correct10',  10, 30,  3),
    ('revision5',  5,  30,  3),
    ('combo3',     3,  30,  3),
    ('duel3',      3,  60,  6),
    ('correct25',  25, 60,  6),
    ('prepa1',     1,  60,  6),
    ('revision15', 15, 60,  6),
    ('win3',       3,  120, 12),
    ('combo8',     8,  120, 12),
    ('chapter2',   2,  120, 12),
    ('correct50',  50, 120, 12)
  ) AS c(id, goal, xp, gems);
$$;

-- Vérification (à la main) :
--   select * from public.quest_catalog() where id in ('lecon1', 'partie2');
--   → deux lignes : lecon1 1 30 3 · partie2 2 30 3
