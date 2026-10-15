-- =============================================================================
-- Studuel — Migration 577 : LA MISSION « SE CONNECTER » (14/10/2026).
--
-- Lucas : « autre mission journalière : se connecter — facile, rapide, et gain
-- de récompenses ». Une quatrième quête du jour, bouclée dès que l'élève ouvre
-- l'app (la route GET /api/quetes, relue par le bandeau au lancement, la fait
-- avancer au premier passage du jour — une écriture par jour, pas plus) :
--   · connexion1  Se connecter  (10 XP)
-- Le coffre du jour (100 XP) reste au bout de TOUTES les quêtes — quatre
-- désormais, dont celle-ci, acquise d'office pour qui est là.
--
-- Le catalogue est le MIROIR de lib/quests.QUEST_CATALOG (test
-- lib/recompenses-mirror.test.ts) : les quêtes en service d'abord, dans le
-- même ordre et au même barème ; puis les retirées, gardées pour payer une
-- journée commencée avant le déploiement. `quest_claim` (557) est recopiée
-- avec « quatre » à la place de « trois » (le test miroir relit `v_asked > N`).
--
-- PRÉREQUIS : 205, 555, 557, 564. Idempotente. À exécuter à la main :
-- Supabase Dashboard → SQL Editor → Run. Sans elle, rien ne casse : la quête
-- « Se connecter » s'affiche mais ne s'enregistre pas (0/1), et le coffre du
-- jour ne s'ouvre plus (quest_claim refuse quatre identifiants).
-- Exécutable AVANT le déploiement du code : le coffre s'ouvre quand toutes les
-- quêtes DEMANDÉES sont finies — trois pour l'app d'aujourd'hui, quatre pour la
-- nouvelle (la quatrième, « Se connecter », est acquise d'office pour qui est là).
-- =============================================================================

CREATE OR REPLACE FUNCTION public.quest_catalog()
RETURNS TABLE (id TEXT, goal INTEGER, xp INTEGER, gems INTEGER)
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT * FROM (VALUES
    -- Les quatre quêtes du jour (14/10/2026) — MIROIR de lib/quests.QUEST_CATALOG.
    ('connexion1', 1,  10,  0),
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

-- quest_claim, recopiée de la 557 : QUATRE quêtes par jour, le coffre au bout
-- des quatre.
CREATE OR REPLACE FUNCTION public.quest_claim(p_quest_ids TEXT[])
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_today    DATE := (now() AT TIME ZONE 'utc')::date;
  v_progress JSONB;
  v_xp       INTEGER := 0;
  v_asked    INTEGER;
  v_finished INTEGER := 0;
  v_all      BOOLEAN := FALSE;
  v_avant    INTEGER;
  v_verse    INTEGER;
  v_none     JSONB := jsonb_build_object('claimed', FALSE, 'gems', 0, 'xp', 0,
                                         'all_done', FALSE);
BEGIN
  IF v_user IS NULL OR p_quest_ids IS NULL THEN RETURN v_none; END IF;
  -- Quatre quêtes par jour : une liste plus longue est une tentative d'abus.
  v_asked := array_length(p_quest_ids, 1);
  IF v_asked IS NULL OR v_asked > 4 THEN RETURN v_none; END IF;

  SELECT progress INTO v_progress
    FROM public.daily_quests WHERE user_id = v_user AND day_key = v_today;
  IF v_progress IS NULL THEN RETURN v_none; END IF;

  WITH gagnees AS (
    SELECT c.id, c.xp
      FROM public.quest_catalog() c
     WHERE c.id = ANY (p_quest_ids)
       AND COALESCE((v_progress ->> c.id)::int, 0) >= c.goal
  ), payees AS (
    INSERT INTO public.daily_quest_claims (user_id, day_key, quest_id, gems, xp)
    SELECT v_user, v_today, id, 0, xp FROM gagnees
    ON CONFLICT (user_id, day_key, quest_id) DO NOTHING
    RETURNING xp
  )
  SELECT COALESCE(SUM(xp), 0), (SELECT count(*) FROM gagnees)
    INTO v_xp, v_finished
    FROM payees;

  -- Bonus de journée complète (MIROIR de ALL_DONE_XP) : 100 XP, plus de gemme,
  -- quand TOUTES les quêtes demandées sont finies — au moins trois (l'app
  -- d'avant la 577 en demande trois, la nouvelle quatre).
  v_all := (v_finished = v_asked AND v_asked >= 3);
  IF v_all THEN
    INSERT INTO public.daily_quest_claims (user_id, day_key, quest_id, gems, xp)
    VALUES (v_user, v_today, '__jour__', 0, 100)
    ON CONFLICT (user_id, day_key, quest_id) DO NOTHING;
    IF FOUND THEN v_xp := v_xp + 100; END IF;
  END IF;

  IF v_xp = 0 THEN RETURN v_none; END IF;

  PERFORM public.wallet_ensure(v_user);
  SELECT xp INTO v_avant FROM public.user_wallet WHERE user_id = v_user;
  PERFORM public.wallet_grant_xp(v_user, 'quests', NULL, v_xp);
  SELECT xp - COALESCE(v_avant, 0) INTO v_verse FROM public.user_wallet WHERE user_id = v_user;

  RETURN jsonb_build_object('claimed', TRUE, 'gems', 0, 'xp', GREATEST(COALESCE(v_verse, 0), 0),
                            'all_done', v_all);
END;
$$;

REVOKE ALL ON FUNCTION public.quest_claim(TEXT[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.quest_claim(TEXT[]) TO authenticated;

-- Vérification (à la main) :
--   select * from public.quest_catalog() where id = 'connexion1';
--   → connexion1 1 10 0
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.quest_catalog() WHERE id = 'connexion1' AND goal = 1 AND xp = 10) THEN
    RAISE EXCEPTION 'Migration 577 : connexion1 absente du catalogue';
  END IF;
  RAISE NOTICE 'Migration 577 OK : la mission « Se connecter » (10 XP), le coffre au bout des quatre.';
END $$;
