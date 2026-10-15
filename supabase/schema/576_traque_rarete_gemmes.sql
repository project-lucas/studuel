-- =============================================================================
-- Studuel — Migration 576 : LA RARETÉ DES GARDIENS, ET LEURS GEMMES (14/10/2026)
--
-- Lucas : « il faut faire comme Genshin Impact, créer la rareté : tous les boss
-- ne sont pas disponibles chaque jour (certains le lundi, d'autres le mardi, et
-- le week-end chacun est disponible) ; eux permettent de gagner des gemmes »,
-- puis : « la barre de progression se réinitialise à 0h00, pas de boss rempli à
-- l'avance, il doit travailler le jour J où le boss est dispo ».
--
-- CE QUI CHANGE (miroir : lib/traque.ts, lib/economie.ts) :
--  1. `traque_en_chasse(boss, jour)` devient la DISPONIBILITÉ : un jour de
--     semaine par gardien (les 16 du catalogue, plus seulement 10), le week-end
--     tout le monde, Nox le dimanche seulement. Jusqu'ici c'était un bonus ×2.
--  2. `traque_credit` : la jauge ne monte QUE le jour où le gardien est
--     disponible (sinon rien ne bouge), et REPART DE ZÉRO au premier crédit
--     d'un nouveau jour (`day_key` ≠ aujourd'hui). Une fenêtre de combat encore
--     ouverte survit à minuit ; une fenêtre passée la veille ne « repart pas de
--     la moitié » : la nuit a tout effacé. Le jour même, la règle de la 213
--     tient (fenêtre manquée → la jauge repart de la moitié).
--  3. `traque_victoire` : XP fixe (30 / 45 / 60, Nox 90 — plus de ×2, puisqu'on
--     ne combat qu'un gardien disponible) ET des GEMMES : 5 / 8 / 10 par rang,
--     Nox 20, dans un plafond de 40 par semaine (lundi UTC) —
--     `traque_gems_week_cap`, source `traque_win` de `gem_events` (autorisée
--     depuis la 212), clé = boss + instant de sortie (jamais deux fois).
--  4. Un brouillon du même jour avait une RPC `traque_defier` (une jauge pleine
--     qui attendait son jour) : abandonnée sur « pas de boss rempli à
--     l'avance » — on la supprime si jamais elle existait.
--
-- Idempotente (CREATE OR REPLACE). Prérequis : 212, 213, 557.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ─────────────────────────────────────────────── 1. le calendrier = la disponibilité
-- Miroir de lib/traque.CHASSE_BY_WEEKDAY (le test lib/bosses-mirror.test.ts
-- relit CE bloc : garder la forme CASE v_dow … END ).
CREATE OR REPLACE FUNCTION public.traque_en_chasse(p_boss_id TEXT, p_day DATE)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  -- EXTRACT(isodow) : lundi = 1 … dimanche = 7.
  v_dow INTEGER := EXTRACT(isodow FROM p_day)::int;
BEGIN
  -- Nox, le boss du dimanche : jamais un autre jour.
  IF p_boss_id = 'nox' THEN RETURN v_dow = 7; END IF;
  -- Le week-end, tout le monde est disponible : c'est le rattrapage.
  IF v_dow >= 6 THEN RETURN TRUE; END IF;
  RETURN p_boss_id = ANY (
    CASE v_dow
      WHEN 1 THEN ARRAY['delta', 'imperator', 'nova']                    -- Maths · Latin · Ens. scientifique
      WHEN 2 THEN ARRAY['grammatork', 'plasma', 'fiscus']                -- Français · Physique-Chimie · Gestion
      WHEN 3 THEN ARRAY['chronos', 'bigben', 'sphinx']                   -- Histoire-Géo · Anglais · Philosophie
      WHEN 4 THEN ARRAY['mitochondrix', 'eltoro', 'mecatron']            -- SVT · Espagnol · Technologie
      ELSE       ARRAY['kaiser-fang', 'krach', 'coach-turbo', 'bugzilla'] -- Allemand · SES · Sport · NSI
    END
  );
END;
$$;

-- ─────────────────────────────────────────────── 2. le plafond hebdomadaire de gemmes
-- 90 dans la 212, zéro gemme depuis la 557 : 40 par semaine, comme les épreuves.
CREATE OR REPLACE FUNCTION public.traque_gems_week_cap() RETURNS INTEGER
LANGUAGE sql IMMUTABLE AS $$ SELECT 40 $$;

-- ─────────────────────────────────────────────── 3. traque_credit : le jour même, de zéro
CREATE OR REPLACE FUNCTION public.traque_credit(
  p_boss_id  TEXT,
  p_points   INTEGER,
  p_chapters TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := (SELECT auth.uid());
  v_boss     TEXT := NULLIF(LEFT(COALESCE(p_boss_id, ''), 40), '');
  v_today    DATE := (now() AT TIME ZONE 'utc')::date;
  v_seuil    INTEGER := public.traque_seuil();
  v_ask      INTEGER := GREATEST(0, LEAST(COALESCE(p_points, 0),
                                          public.traque_plafond_jour()));
  v_row      public.boss_gauges;
  v_dispo    BOOLEAN;
  v_nouveau  BOOLEAN;
  v_vive     BOOLEAN;
  v_day_pts  INTEGER;
  v_grant    INTEGER := 0;
  v_points   INTEGER;
  v_avant    INTEGER;
  v_attempts INTEGER;
  v_fresh    BOOLEAN := FALSE;
BEGIN
  IF v_user IS NULL OR v_boss IS NULL THEN RETURN NULL; END IF;

  INSERT INTO public.boss_gauges (user_id, boss_id, day_key)
  VALUES (v_user, v_boss, v_today)
  ON CONFLICT (user_id, boss_id) DO NOTHING;

  SELECT * INTO v_row FROM public.boss_gauges
   WHERE user_id = v_user AND boss_id = v_boss FOR UPDATE;

  v_points   := v_row.points;
  v_attempts := v_row.attempts;
  v_dispo    := public.traque_en_chasse(v_boss, v_today);
  v_nouveau  := (v_row.day_key IS DISTINCT FROM v_today);
  v_vive     := (v_row.debusque_at IS NOT NULL
                 AND now() < v_row.debusque_at + public.traque_fenetre());

  IF v_row.debusque_at IS NOT NULL AND NOT v_vive THEN
    -- Fenêtre laissée passer : le boss s'est recouché. Le jour même, la jauge
    -- repart de la moitié (213) ; un autre jour, la nuit a tout remis à zéro.
    v_row.debusque_at := NULL;
    v_points := CASE WHEN v_nouveau THEN 0 ELSE public.traque_apres_defaite() END;
    v_attempts := 0;
  ELSIF v_nouveau AND NOT v_vive THEN
    -- LA NUIT REMET LA JAUGE À ZÉRO : pas de boss rempli à l'avance.
    v_points := 0;
    v_attempts := 0;
  END IF;
  v_avant := v_points;

  v_day_pts := CASE WHEN v_row.day_key = v_today THEN v_row.day_points ELSE 0 END;

  -- LA RARETÉ : la jauge ne monte que si le gardien est disponible aujourd'hui,
  -- et tant qu'il n'est pas sorti.
  IF v_dispo AND v_row.debusque_at IS NULL THEN
    v_grant := GREATEST(0, LEAST(v_ask, public.traque_plafond_jour() - v_day_pts));
    v_points := LEAST(v_seuil, v_points + v_grant);
    IF v_avant < v_seuil AND v_points >= v_seuil THEN
      v_row.debusque_at := now();
      v_fresh := TRUE;
      v_attempts := 0;
    END IF;
  END IF;

  UPDATE public.boss_gauges
     SET points      = v_points,
         chapters    = CASE WHEN v_grant > 0
                            THEN public.traque_merge_chapters(chapters, p_chapters)
                            ELSE chapters END,
         debusque_at = v_row.debusque_at,
         attempts    = v_attempts,
         day_key     = v_today,
         day_points  = v_day_pts + v_grant,
         updated_at  = now()
   WHERE user_id = v_user AND boss_id = v_boss
   RETURNING * INTO v_row;

  RETURN jsonb_build_object(
    'boss_id',       v_row.boss_id,
    'points',        v_row.points,
    'percent',       LEAST(100, (v_row.points * 100) / v_seuil),
    'chapters',      v_row.chapters,
    'victories',     v_row.victories,
    'attempts',      v_row.attempts,
    'debusque_at',   v_row.debusque_at,
    'just_debusque', v_fresh,
    'granted',       v_grant,
    'en_chasse',     v_dispo
  );
END;
$$;

REVOKE ALL ON FUNCTION public.traque_credit(TEXT, INTEGER, TEXT[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.traque_credit(TEXT, INTEGER, TEXT[]) TO authenticated;

-- Le brouillon abandonné du même jour.
DROP FUNCTION IF EXISTS public.traque_defier(TEXT);

-- ─────────────────────────────────────────────── 4. traque_victoire : XP fixe + GEMMES plafonnées
-- Copie de la 557 ; le ×2 du jour disparaît (on ne combat qu'un gardien
-- disponible), les gemmes reviennent — le test miroir relit « CASE v_rank WHEN
-- 1 THEN 30 … », « v_boss = 'nox' THEN v_amount := 90; v_gemmes := 20 » et
-- « CASE WHEN v_rank = 1 THEN 5 WHEN v_rank = 2 THEN 8 ELSE 10 END ».
CREATE OR REPLACE FUNCTION public.traque_victoire(p_boss_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := (SELECT auth.uid());
  v_boss    TEXT := NULLIF(LEFT(COALESCE(p_boss_id, ''), 40), '');
  v_row     public.boss_gauges;
  v_rank    INTEGER;
  v_amount  INTEGER;
  v_gemmes  INTEGER;
  v_voulues INTEGER;
  v_semaine INTEGER;
  v_lundi   TIMESTAMPTZ := (date_trunc('week', now() AT TIME ZONE 'utc') AT TIME ZONE 'utc');
  v_avant   INTEGER;
  v_paid    INTEGER := 0;
  v_key     TEXT;
  v_none    JSONB := jsonb_build_object('won', FALSE, 'gems', 0, 'xp', 0, 'rank', 1,
                                        'victories', 0, 'capped', FALSE);
BEGIN
  IF v_user IS NULL OR v_boss IS NULL THEN RETURN v_none; END IF;

  SELECT * INTO v_row FROM public.boss_gauges
   WHERE user_id = v_user AND boss_id = v_boss FOR UPDATE;
  IF NOT FOUND OR v_row.debusque_at IS NULL THEN RETURN v_none; END IF;
  IF now() >= v_row.debusque_at + public.traque_fenetre() THEN
    UPDATE public.boss_gauges
       SET points = public.traque_apres_defaite(), debusque_at = NULL,
           attempts = 0, updated_at = now()
     WHERE user_id = v_user AND boss_id = v_boss;
    RETURN v_none;
  END IF;

  v_rank := LEAST(1 + v_row.victories, 3);
  v_amount := CASE v_rank WHEN 1 THEN 30 WHEN 2 THEN 45 ELSE 60 END;
  v_gemmes := CASE WHEN v_rank = 1 THEN 5 WHEN v_rank = 2 THEN 8 ELSE 10 END;
  IF v_boss = 'nox' THEN
    v_amount := 90;
    v_gemmes := 20;
  END IF;
  v_voulues := v_gemmes;

  v_key := v_boss || ':' || to_char(v_row.debusque_at AT TIME ZONE 'utc',
                                    'YYYY-MM-DD"T"HH24:MI:SS');

  -- L'XP, comme avant (wallet_grant_xp dédoublonne sur la clé).
  PERFORM public.wallet_ensure(v_user);
  SELECT xp INTO v_avant FROM public.user_wallet WHERE user_id = v_user;
  PERFORM public.wallet_grant_xp(v_user, 'traque', v_key, v_amount);
  SELECT xp - COALESCE(v_avant, 0) INTO v_paid FROM public.user_wallet WHERE user_id = v_user;

  -- Les gemmes : ce qui reste du plafond de la semaine, jamais deux fois la même sortie.
  SELECT COALESCE(SUM(amount), 0) INTO v_semaine FROM public.gem_events
   WHERE user_id = v_user AND source = 'traque_win' AND created_at >= v_lundi;
  v_gemmes := GREATEST(0, LEAST(v_gemmes, public.traque_gems_week_cap() - v_semaine));
  IF v_gemmes > 0 THEN
    INSERT INTO public.gem_events (user_id, source, source_key, amount)
    VALUES (v_user, 'traque_win', LEFT(v_key, 80), v_gemmes)
    ON CONFLICT DO NOTHING;
    IF FOUND THEN
      UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_gemmes WHERE id = v_user;
    ELSE
      v_gemmes := 0;
    END IF;
  END IF;

  UPDATE public.boss_gauges
     SET victories = victories + 1, points = 0, debusque_at = NULL,
         attempts = 0, updated_at = now()
   WHERE user_id = v_user AND boss_id = v_boss
   RETURNING * INTO v_row;

  RETURN jsonb_build_object(
    'won',       TRUE,
    'gems',      v_gemmes,
    'xp',        GREATEST(0, COALESCE(v_paid, 0)),
    'rank',      LEAST(v_row.victories + 1, 3),
    'victories', v_row.victories,
    'capped',    (v_gemmes < v_voulues)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.traque_victoire(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.traque_victoire(TEXT) TO authenticated;

-- ─────────────────────────────────────────────── 5. contrôle
DO $$
DECLARE
  n_fn integer;
BEGIN
  SELECT count(*) INTO n_fn FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
   WHERE n.nspname = 'public'
     AND p.proname IN ('traque_en_chasse', 'traque_credit', 'traque_victoire', 'traque_gems_week_cap');
  IF n_fn < 4 THEN
    RAISE EXCEPTION 'Migration 576 incomplète : % fonction(s) sur 4', n_fn;
  END IF;
  IF to_regprocedure('public.traque_defier(text)') IS NOT NULL THEN
    RAISE EXCEPTION 'Migration 576 : traque_defier (brouillon abandonné) existe encore';
  END IF;
  IF NOT public.traque_en_chasse('nox', DATE '2026-10-18') OR public.traque_en_chasse('nox', DATE '2026-10-17') THEN
    RAISE EXCEPTION 'Migration 576 : Nox doit sortir le dimanche seulement';
  END IF;
  IF NOT public.traque_en_chasse('coach-turbo', DATE '2026-10-16') OR public.traque_en_chasse('coach-turbo', DATE '2026-10-14') THEN
    RAISE EXCEPTION 'Migration 576 : Coach Turbo doit sortir le vendredi, pas le mercredi';
  END IF;
  RAISE NOTICE 'Migration 576 OK : la rareté des gardiens (jauge du jour même) et leurs gemmes (plafond % / semaine).', public.traque_gems_week_cap();
END $$;
