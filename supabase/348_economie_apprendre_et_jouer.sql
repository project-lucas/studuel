-- =============================================================================
-- Studuel — Migration 348 : L'XP MESURE L'APPRIS, PLUS LE CLIC
--
-- CHANTIERS 1 ET 2 de la refonte d'économie. Le 3 (les écus) est pur, il vit
-- dans lib/tresor.ts et ne touche pas la base.
--
-- ─────────────────────────────────────────────────────────── LE CONSTAT
-- L'XP comptait des GESTES : quiz 20, flashcards 10, défi 25, sans distinguer
-- la première fois de la cinquantième. Un élève qui refaisait le même quiz
-- facile cinquante fois montait de niveau exactement comme celui qui avait
-- maîtrisé cinquante chapitres. Le niveau ne disait donc rien de lui.
--
-- LE MODÈLE VIENT DE CLASH ROYALE, et il est contre-intuitif : on n'y gagne pas
-- d'XP en jouant des matchs, on en gagne en AMÉLIORANT SES CARTES. Le King
-- Level ne mesure pas le temps passé — il mesure la collection qu'on a bâtie.
--
-- ─────────────────────────────────────────────── CE QUE FAIT CETTE MIGRATION
--
-- 1. L'XP ne paye plus que l'ACQUISITION, et chaque acquisition une seule fois :
--      leçon lue          5   · clé = la leçon
--      carte acquise      5   · clé = la question (intervalle SRS ≥ 21 j)
--      1re couronne      30   · clé = « chapitre:1 »
--      2e couronne       40   · clé = « chapitre:2 »
--      3e couronne       60   · clé = « chapitre:3 »
--    La clé devient OBLIGATOIRE : sans elle, rien n'est versé. L'index
--    `xp_events_once_per_key` (192) fait le reste.
--
-- 2. Les sources historiques ('quiz', 'flashcards', 'defi', 'defi_arena'…)
--    renvoient 0 au lieu d'échouer. L'XP DÉJÀ GAGNÉE RESTE ACQUISE — c'est le
--    socle gelé : personne ne redescend d'un niveau parce que le barème a
--    changé. Seuls les versements neufs s'arrêtent.
--
-- 3. `wallet_touch()` — LA SÉRIE SE DÉTACHE DE L'XP. C'était l'effet de bord le
--    plus dangereux du chantier : la série stockée n'avançait QUE dans
--    `wallet_award_xp`. Couper l'XP du jeu aurait tué la gemme des 7 jours pour
--    tout élève qui ne fait que jouer. La série n'est pas de l'XP : c'est un
--    compteur d'assiduité, et il se nourrit de TOUTE activité.
--
-- 4. `wallet_award_chapter_crowns(chapitre)` — verse l'XP des paliers franchis.
--    La valeur du chapitre est RECALCULÉE EN SQL (meilleur quiz du chapitre,
--    plancher 0,30 si une leçon est terminée), miroir exact de
--    `lib/subject-template.chapterValue` + `crowns`. Le client ne fournit qu'un
--    id de chapitre : il ne peut pas s'attribuer une couronne qu'il n'a pas.
--
-- 5. LA FUITE DE GEMMES EST COLMATÉE. `defi_win` avait pour clé « leçon:jour » :
--    une victoire payée PAR LEÇON et par jour. Un élève de 4e dispose d'environ
--    250 leçons — soit 2 500 gemmes par jour en théorie, quand un chapitre en
--    coûte 30. Les écus sont plafonnés à 50/jour et les couronnes de saison à
--    250 : les gemmes étaient la seule unité sans plafond, et la seule dont la
--    source répétable grandissait avec le catalogue. La clé devient LE JOUR.
--
-- 6. Deux sources de gemmes neuves, sur le modèle de Clash of Clans :
--    'achievement' (les hauts faits, payés une fois) et 'filon' (la trouvaille
--    hebdomadaire, 25 💎). Elles récompensent la DURÉE, pas la fréquence.
--
-- ⚠️ LA DOCTRINE NE BOUGE PAS : aucune conversion entre écus et gemmes. « Gems
-- can be used to buy other resources, but there is no way to convert these
-- resources back into gems » — c'est la vanne à sens unique de Clash of Clans,
-- et c'est elle qui protège la contrepartie de Studuel+.
--
-- Idempotente : ALTER ... DROP/ADD CONSTRAINT et CREATE OR REPLACE FUNCTION.
-- Rejouable sans effet.
--
-- PRÉREQUIS : migrations 192 et 209.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ─────────────────────────────────────────── 1. les sources acceptées en base

ALTER TABLE public.xp_events DROP CONSTRAINT IF EXISTS xp_events_source_check;
ALTER TABLE public.xp_events ADD CONSTRAINT xp_events_source_check CHECK (
  source IN (
    -- Les sources VIVES : l'acquis.
    'lecon', 'carte', 'couronne1', 'couronne2', 'couronne3',
    -- Les sources HISTORIQUES : plus jamais écrites, mais des centaines de
    -- milliers de lignes les portent. Les retirer du CHECK ferait échouer
    -- toute écriture sur la table (le CHECK est vérifié à l'INSERT, mais un
    -- ALTER le valide sur l'existant).
    'quiz', 'quiz_top', 'flashcards', 'defi', 'defi_arena', 'quests', 'clan_week'
  )
);

ALTER TABLE public.gem_events DROP CONSTRAINT IF EXISTS gem_events_source_check;
ALTER TABLE public.gem_events ADD CONSTRAINT gem_events_source_check CHECK (
  source IN ('chapter_crowns', 'streak_7', 'defi_win', 'level_up',
             'achievement', 'filon')
);

-- ────────────────────────────────────── 2. la série, détachée de l'XP

-- Avance la série stockée et verse le palier de 7 jours. AUCUNE XP, aucune
-- ligne dans `xp_events` : c'est le geste « j'ai été actif aujourd'hui », que
-- toute activité déclenche — un duel, une partie d'arène, une dictée, une
-- session de flashcards.
CREATE OR REPLACE FUNCTION public.wallet_touch()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_wallet public.user_wallet%ROWTYPE;
  v_new_streak INTEGER;
  v_gems INTEGER := 0;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  PERFORM public.wallet_ensure(v_user);
  SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user FOR UPDATE;

  IF v_wallet.last_activity_date = v_today THEN
    v_new_streak := v_wallet.streak_days;
  ELSIF v_wallet.last_activity_date = v_today - 1 THEN
    v_new_streak := v_wallet.streak_days + 1;
  ELSE
    v_new_streak := 1;
  END IF;

  IF v_new_streak <> v_wallet.streak_days AND v_new_streak % 7 = 0 THEN
    INSERT INTO public.gem_events (user_id, source, source_key, amount)
    VALUES (v_user, 'streak_7', v_today::text, 20)
    ON CONFLICT DO NOTHING;
    IF FOUND THEN v_gems := v_gems + 20; END IF;
  END IF;

  UPDATE public.user_wallet
     SET streak_days = v_new_streak,
         last_activity_date = v_today,
         updated_at = now()
   WHERE user_id = v_user;

  IF v_gems > 0 THEN
    UPDATE public.profiles SET gems = gems + v_gems WHERE id = v_user;
  END IF;

  RETURN jsonb_build_object(
    'awarded', 0,
    'xp', v_wallet.xp,
    'level', v_wallet.level,
    'level_up', false,
    'streak_days', v_new_streak,
    'gems_gained', v_gems);
END;
$$;

REVOKE ALL ON FUNCTION public.wallet_touch() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wallet_touch() TO authenticated;

-- ──────────────────────────────────────────── 3. l'XP, sur l'acquis seulement

CREATE OR REPLACE FUNCTION public.wallet_award_xp(
  p_source TEXT,
  p_key    TEXT DEFAULT NULL,
  p_amount INTEGER DEFAULT NULL   -- ignoré : gardé pour ne pas casser l'appel
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_amount INTEGER;
  v_key    TEXT := NULLIF(LEFT(COALESCE(p_key, ''), 80), '');
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_wallet public.user_wallet%ROWTYPE;
  v_new_streak INTEGER;
  v_new_level  INTEGER;
  v_gems INTEGER := 0;
  v_lvl  INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  -- LA CLÉ EST OBLIGATOIRE. Sans elle, l'index d'unicité ne s'applique pas et
  -- l'acquisition redeviendrait répétable — c'est-à-dire exactement ce que
  -- cette migration supprime.
  IF v_key IS NULL THEN RETURN NULL; END IF;

  v_amount := CASE p_source
    WHEN 'lecon'     THEN 5
    WHEN 'carte'     THEN 5
    WHEN 'couronne1' THEN 30
    WHEN 'couronne2' THEN 40
    WHEN 'couronne3' THEN 60
    ELSE NULL
  END;

  -- Source historique (ou inconnue) : on ne verse rien, mais on ne fait pas
  -- échouer l'appelant — un vieux client déployé doit continuer de tourner.
  IF v_amount IS NULL THEN
    PERFORM public.wallet_ensure(v_user);
    SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user;
    RETURN jsonb_build_object(
      'awarded', 0, 'xp', v_wallet.xp, 'level', v_wallet.level,
      'level_up', false, 'streak_days', v_wallet.streak_days, 'gems_gained', 0);
  END IF;

  PERFORM public.wallet_ensure(v_user);
  SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user FOR UPDATE;

  INSERT INTO public.xp_events (user_id, source, source_key, amount)
  VALUES (v_user, p_source, v_key, v_amount)
  ON CONFLICT DO NOTHING;
  IF NOT FOUND THEN
    -- Déjà payé : c'est le cas NORMAL d'une relecture ou d'un chapitre
    -- re-maîtrisé, pas une erreur.
    RETURN jsonb_build_object(
      'awarded', 0, 'xp', v_wallet.xp, 'level', v_wallet.level,
      'level_up', false, 'streak_days', v_wallet.streak_days, 'gems_gained', 0);
  END IF;

  -- La série avance aussi ici : acquérir, c'est être actif.
  IF v_wallet.last_activity_date = v_today THEN
    v_new_streak := v_wallet.streak_days;
  ELSIF v_wallet.last_activity_date = v_today - 1 THEN
    v_new_streak := v_wallet.streak_days + 1;
  ELSE
    v_new_streak := 1;
  END IF;

  IF v_new_streak <> v_wallet.streak_days AND v_new_streak % 7 = 0 THEN
    INSERT INTO public.gem_events (user_id, source, source_key, amount)
    VALUES (v_user, 'streak_7', v_today::text, 20)
    ON CONFLICT DO NOTHING;
    IF FOUND THEN v_gems := v_gems + 20; END IF;
  END IF;

  v_new_level := public.wallet_level_from_xp(v_wallet.xp + v_amount);
  IF v_new_level > v_wallet.level THEN
    FOR v_lvl IN (v_wallet.level + 1) .. v_new_level LOOP
      INSERT INTO public.gem_events (user_id, source, source_key, amount)
      VALUES (v_user, 'level_up', v_lvl::text, 15)
      ON CONFLICT DO NOTHING;
      IF FOUND THEN v_gems := v_gems + 15; END IF;
    END LOOP;
  END IF;

  UPDATE public.user_wallet
     SET xp = xp + v_amount,
         level = GREATEST(level, v_new_level),
         streak_days = v_new_streak,
         last_activity_date = v_today,
         updated_at = now()
   WHERE user_id = v_user;

  IF v_gems > 0 THEN
    UPDATE public.profiles SET gems = gems + v_gems WHERE id = v_user;
  END IF;

  RETURN jsonb_build_object(
    'awarded', v_amount,
    'xp', v_wallet.xp + v_amount,
    'level', GREATEST(v_wallet.level, v_new_level),
    'level_up', v_new_level > v_wallet.level,
    'streak_days', v_new_streak,
    'gems_gained', v_gems);
END;
$$;

-- ───────────────────────────────────── 4. les couronnes d'un chapitre

-- Verse l'XP des paliers de couronne franchis sur un chapitre. Renvoie l'XP
-- réellement versée (0 si aucun palier neuf).
--
-- LA VALEUR EST RECALCULÉE ICI, jamais fournie par le client : meilleur ratio
-- de quiz du chapitre, avec le plancher 0,30 dès qu'une leçon du chapitre est
-- terminée. Miroir exact de `lib/subject-template.chapterValue` et de ses
-- seuils `CROWN_THRESHOLDS = [0.30, 0.60, 0.80]`.
CREATE OR REPLACE FUNCTION public.wallet_award_chapter_crowns(p_chapter UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_best     NUMERIC;
  v_lesson   BOOLEAN;
  v_value    NUMERIC;
  v_crowns   INTEGER;
  v_total    INTEGER := 0;
  v_palier   INTEGER;
  v_source   TEXT;
  v_montant  INTEGER;
BEGIN
  IF v_user IS NULL OR p_chapter IS NULL THEN RETURN 0; END IF;

  SELECT MAX(t.score::numeric / t.total) INTO v_best
    FROM public.test_sessions t
    JOIN public.quizzes q ON q.id = t.quiz_id
    JOIN public.lessons l ON l.id = q.lesson_id
   WHERE t.user_id = v_user AND t.total > 0 AND l.chapter_id = p_chapter;

  SELECT EXISTS (
    SELECT 1 FROM public.lesson_completions lc
      JOIN public.lessons l ON l.id = lc.lesson_id
     WHERE lc.user_id = v_user AND l.chapter_id = p_chapter
  ) INTO v_lesson;

  v_value := GREATEST(COALESCE(v_best, 0), CASE WHEN v_lesson THEN 0.30 ELSE 0 END);
  v_crowns := (CASE WHEN v_value >= 0.30 THEN 1 ELSE 0 END)
            + (CASE WHEN v_value >= 0.60 THEN 1 ELSE 0 END)
            + (CASE WHEN v_value >= 0.80 THEN 1 ELSE 0 END);
  IF v_crowns = 0 THEN RETURN 0; END IF;

  FOR v_palier IN 1 .. v_crowns LOOP
    v_source  := 'couronne' || v_palier;
    v_montant := CASE v_palier WHEN 1 THEN 30 WHEN 2 THEN 40 ELSE 60 END;
    IF (public.wallet_award_xp(v_source, p_chapter::text || ':' || v_palier) ->> 'awarded')::int > 0 THEN
      v_total := v_total + v_montant;
    END IF;
  END LOOP;

  RETURN v_total;
END;
$$;

REVOKE ALL ON FUNCTION public.wallet_award_chapter_crowns(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wallet_award_chapter_crowns(UUID) TO authenticated;

-- Même chose, mais depuis un QUIZ : c'est ce dont dispose la fin de quiz, qui
-- ne connaît pas le chapitre. On remonte quiz → leçon → chapitre, exactement
-- comme le fait déjà la gemme des 3 couronnes.
CREATE OR REPLACE FUNCTION public.wallet_award_crowns_by_quiz(p_quiz UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_chapter UUID;
BEGIN
  IF p_quiz IS NULL THEN RETURN 0; END IF;
  SELECT l.chapter_id INTO v_chapter
    FROM public.quizzes q
    JOIN public.lessons l ON l.id = q.lesson_id
   WHERE q.id = p_quiz;
  IF v_chapter IS NULL THEN RETURN 0; END IF;
  RETURN public.wallet_award_chapter_crowns(v_chapter);
END;
$$;

REVOKE ALL ON FUNCTION public.wallet_award_crowns_by_quiz(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wallet_award_crowns_by_quiz(UUID) TO authenticated;

-- ─────────────────────────────────────────── 5. les gemmes : la fuite colmatée

CREATE OR REPLACE FUNCTION public.wallet_award_gems(p_source TEXT, p_key TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_key     TEXT := NULLIF(LEFT(COALESCE(p_key, ''), 80), '');
  v_today   DATE := (now() AT TIME ZONE 'utc')::date;
  v_chapter UUID;
  v_best    NUMERIC;
  v_amount  INTEGER;
BEGIN
  IF v_user IS NULL OR v_key IS NULL THEN RETURN 0; END IF;

  IF p_source = 'chapter_crowns' THEN
    SELECT l.chapter_id INTO v_chapter
      FROM public.quizzes q
      JOIN public.lessons l ON l.id = q.lesson_id
     WHERE q.id = v_key::uuid;
    IF v_chapter IS NULL THEN RETURN 0; END IF;

    SELECT MAX(t.score::numeric / t.total) INTO v_best
      FROM public.test_sessions t
      JOIN public.quizzes q ON q.id = t.quiz_id
      JOIN public.lessons l ON l.id = q.lesson_id
     WHERE t.user_id = v_user AND t.total > 0 AND l.chapter_id = v_chapter;
    IF COALESCE(v_best, 0) < 0.8 THEN RETURN 0; END IF;

    v_key := v_chapter::text;
    v_amount := 30;

  ELSIF p_source = 'defi_win' THEN
    -- LA FUITE. La clé valait « leçon:jour » : une victoire payée PAR LEÇON et
    -- par jour, soit ~250 versements quotidiens possibles pour un élève de 4e,
    -- quand un chapitre coûte 30 gemmes. Elle vaut désormais LE JOUR : une
    -- victoire payée par jour, toutes leçons confondues. La clé fournie par
    -- l'appelant est ignorée — c'est le serveur qui décide de la granularité.
    v_key := v_today::text;
    v_amount := 10;

  ELSIF p_source = 'achievement' THEN
    -- Les hauts faits (lib/hauts-faits.ts) : le montant vit dans le catalogue
    -- pur côté app, mais le SERVEUR ne fait confiance qu'à sa propre table.
    SELECT montant INTO v_amount FROM public.gem_achievements WHERE id = v_key;
    IF v_amount IS NULL THEN RETURN 0; END IF;

  ELSIF p_source = 'filon' THEN
    -- La trouvaille hebdomadaire, façon Gem Box : la clé est la SEMAINE ISO,
    -- donc un seul filon par semaine, quoi qu'il arrive.
    v_key := to_char(v_today, 'IYYY-"W"IW');
    v_amount := 25;

  ELSE
    RETURN 0;
  END IF;

  INSERT INTO public.gem_events (user_id, source, source_key, amount)
  VALUES (v_user, p_source, v_key, v_amount)
  ON CONFLICT DO NOTHING;
  IF NOT FOUND THEN RETURN 0; END IF;

  UPDATE public.profiles SET gems = gems + v_amount WHERE id = v_user;
  RETURN v_amount;
EXCEPTION WHEN invalid_text_representation THEN
  RETURN 0;
END;
$$;

-- ───────────────────────────────── 6. le catalogue des hauts faits, en base

-- Le montant d'un haut fait doit être hors de portée du client : la RPC ci-dessus
-- le LIT ici. Le catalogue lisible (libellés, conditions) reste dans
-- lib/hauts-faits.ts — c'est lui qui décide QUAND réclamer, jamais COMBIEN.
CREATE TABLE IF NOT EXISTS public.gem_achievements (
  id      TEXT PRIMARY KEY,
  montant INTEGER NOT NULL CHECK (montant > 0)
);

ALTER TABLE public.gem_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gem_achievements_lisible" ON public.gem_achievements;
CREATE POLICY "gem_achievements_lisible" ON public.gem_achievements
  FOR SELECT USING (true);
REVOKE INSERT, UPDATE, DELETE ON public.gem_achievements FROM anon, authenticated;
GRANT SELECT ON public.gem_achievements TO anon, authenticated;

INSERT INTO public.gem_achievements (id, montant) VALUES
  ('lecons-50',   30),
  ('lecons-200',  60),
  ('serie-30',    40),
  ('serie-100',  100),
  ('cartes-100',  30),
  ('cartes-500',  80),
  ('chapitres-10', 50)
ON CONFLICT (id) DO UPDATE SET montant = EXCLUDED.montant;

-- Contrôle -------------------------------------------------------------------
-- `sources_vives` DOIT valoir 5, `hauts_faits` 7.
SELECT
  (SELECT count(*) FROM unnest(ARRAY['lecon','carte','couronne1','couronne2','couronne3']) s
    WHERE pg_get_constraintdef(c.oid) LIKE '%' || s || '%') AS sources_vives,
  (SELECT count(*) FROM public.gem_achievements)            AS hauts_faits
  FROM pg_constraint c
 WHERE c.conname = 'xp_events_source_check';
