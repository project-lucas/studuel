-- =============================================================================
-- Studuel — Migration 564 : LE TRIO MINIMAL DES QUÊTES DU JOUR (13/10/2026).
--
-- Lucas : « les missions journalières doivent être faciles, inciter à
-- travailler, et pouvoir être vérifiées sans erreur ». Une seule quête par
-- geste, toujours la même, toujours la version la plus courte :
--   · lecon1      Lire 1 cours             (la lecture compte toute seule)
--   · reponses10  Répondre à 10 questions  (quiz, révisions, jeux, duels — justes ou non)
--   · partie1     Faire 1 partie           (jeu, mode de l'arène ou duel)
-- Dix minutes, jamais une condition qui dépend d'un autre (gagner), jamais un
-- seuil (80 %). Le coffre du jour (100 XP) reste au bout des trois.
--
-- Le catalogue est le MIROIR de lib/quests.QUEST_CATALOG (test
-- lib/recompenses-mirror.test.ts) : les quêtes en service d'abord, dans le
-- même ordre et au même barème ; puis les retirées, gardées pour payer une
-- journée commencée avant le déploiement (quest_claim ne paie que ce qui est
-- fini ET tiré). `quest_save_progress` ne garde que les ids de ce catalogue.
--
-- PRÉREQUIS : 205 (daily_quests, quest_save_progress, quest_claim), 555, 557.
-- Idempotente. À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- Sans elle, rien ne casse : les deux nouvelles quêtes ne s'enregistrent pas
-- (la progression reste à 0/10 et 0/1), la lecture, elle, avance « lecon1 ».
-- =============================================================================

CREATE OR REPLACE FUNCTION public.quest_catalog()
RETURNS TABLE (id TEXT, goal INTEGER, xp INTEGER, gems INTEGER)
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT * FROM (VALUES
    -- Le trio minimal (13/10/2026) — MIROIR de lib/quests.QUEST_CATALOG.
    ('lecon1',     1,  30,  0),
    ('reponses10', 10, 30,  0),
    ('partie1',    1,  30,  0),
    -- Les quêtes retirées le 13/10/2026 (les variantes dures des trois gestes)
    -- et le 03/10/2026, gardées pour payer une journée commencée avant le
    -- déploiement. Plus aucun code ne les tire.
    ('lecon2',     2,  50,  0),
    ('quiz1',      1,  30,  0),
    ('quiz80',     1,  40,  0),
    ('correct20',  20, 40,  0),
    ('exercice1',  1,  50,  0),
    ('duel1',      1,  30,  0),
    ('win1',       1,  40,  0),
    ('partie2',    2,  30,  0),
    ('correct10',  10, 30,  0),
    ('revision5',  5,  30,  0),
    ('combo3',     3,  30,  0),
    ('duel3',      3,  60,  0),
    ('correct25',  25, 60,  0),
    ('prepa1',     1,  60,  0),
    ('revision15', 15, 60,  0),
    ('win3',       3,  120, 0),
    ('combo8',     8,  120, 0),
    ('chapter2',   2,  120, 0),
    ('correct50',  50, 120, 0)
  ) AS c(id, goal, xp, gems);
$$;

-- Vérification (à la main) :
--   select * from public.quest_catalog() where id in ('reponses10', 'partie1');
--   → deux lignes : reponses10 10 30 0 · partie1 1 30 0
