-- =============================================================================
-- Studuel — Migration 192 : économie & méta-progression (portefeuille XP,
-- niveaux, série stockée, gemmes de jeu, échelle ×30).
--
-- Ce que cette migration installe :
--
--   1. user_wallet — le portefeuille de progression : XP stocké (fini le
--      recalcul depuis l'historique), niveau (palier cumulatif : passer du
--      niveau n au niveau n+1 coûte 100 × n XP), série stockée
--      (streak_days + last_activity_date) qui sert UNIQUEMENT à verser la
--      récompense des paliers de 7 jours — la flamme affichée reste la série
--      dérivée de lib/streak.
--
--   2. xp_events — la trace de chaque gain d'XP (source, montant), pour
--      auditer et pour l'idempotence des sources à clé (défi de leçon :
--      une fois par leçon et par jour).
--
--   3. gem_events — la trace de chaque gain de GEMMES DE JEU. Les gemmes
--      restent RARES : jamais sur une activité standard, seulement sur des
--      jalons — chapitre complété 3 couronnes (+30), palier de série de
--      7 jours (+20), victoire de défi (+10), passage de niveau (+15).
--      L'unicité (user, source, clé) rend chaque jalon versable UNE fois.
--
--   4. ÉCHELLE ×30 — les gemmes gagnant des sources de jeu graduées, l'unité
--      « 1 gemme = 1 chapitre » était trop grosse. Tout est multiplié par 30
--      (soldes existants compris, une seule fois, garde-fou app_flags) :
--      chapitre à 30, parrainage à 30 de chaque côté (plafond 600), dotation
--      de départ à 90. Les fonctions de la 183 sont re-barémées ci-dessous.
--
-- ⚠️ Toute attribution passe par les fonctions SECURITY DEFINER : les tables
-- n'ont AUCUNE policy d'écriture, et les montants sont fixés ICI (jamais pris
-- du client). Miroir applicatif : lib/wallet.ts (barème, formule de niveau)
-- et lib/gems.ts (échelle ×30) — toute évolution doit toucher les deux.
--
-- PRÉREQUIS : 003 (test_sessions, profiles durci), 183 (gems, referrals).
-- Idempotente. À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. GARDE-FOU DES OPÉRATIONS UNIQUES
--
-- Le rescale ×30 des soldes ne doit tourner qu'UNE fois : rejouer la migration
-- ne doit pas re-multiplier les gemmes. app_flags mémorise les opérations déjà
-- faites (table interne, aucun accès client).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_flags (
  key        TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_flags ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_flags FROM anon, authenticated;

-- -----------------------------------------------------------------------------
-- 1. ÉCHELLE ×30 DES GEMMES (une seule fois)
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.app_flags WHERE key = '192_gems_rescale') THEN
    UPDATE public.profiles
       SET gems = gems * 30,
           referral_gems_earned = referral_gems_earned * 30;
    INSERT INTO public.app_flags (key) VALUES ('192_gems_rescale');
  END IF;
END $$;

-- Dotation de départ des futurs comptes : 90 = 3 chapitres, comme avant.
ALTER TABLE public.profiles ALTER COLUMN gems SET DEFAULT 90;

-- -----------------------------------------------------------------------------
-- 2. LE PORTEFEUILLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_wallet (
  user_id            UUID PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  xp                 INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  level              INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
  streak_days        INTEGER NOT NULL DEFAULT 0 CHECK (streak_days >= 0),
  last_activity_date DATE,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_wallet ENABLE ROW LEVEL SECURITY;

-- Lecture de SON portefeuille uniquement ; aucune policy d'écriture — le solde
-- ne bouge que par les fonctions definer ci-dessous.
DROP POLICY IF EXISTS "user_wallet_select_own" ON public.user_wallet;
CREATE POLICY "user_wallet_select_own" ON public.user_wallet
  FOR SELECT USING (auth.uid() = user_id);

REVOKE INSERT, UPDATE, DELETE ON public.user_wallet FROM anon, authenticated;
GRANT SELECT ON public.user_wallet TO authenticated;

-- -----------------------------------------------------------------------------
-- 3. LES TRACES : xp_events et gem_events
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.xp_events (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  source     TEXT NOT NULL CHECK (source IN
               ('quiz', 'quiz_top', 'flashcards', 'defi', 'defi_arena')),
  source_key TEXT,
  amount     INTEGER NOT NULL CHECK (amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Idempotence des sources à clé (défi de leçon : « leçon:jour »).
CREATE UNIQUE INDEX IF NOT EXISTS xp_events_once_per_key
  ON public.xp_events (user_id, source, source_key)
  WHERE source_key IS NOT NULL;

-- Décompte du plafond quotidien + lecture « défis déjà relevés » par la page.
CREATE INDEX IF NOT EXISTS xp_events_user_source_idx
  ON public.xp_events (user_id, source, created_at);

ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "xp_events_select_own" ON public.xp_events;
CREATE POLICY "xp_events_select_own" ON public.xp_events
  FOR SELECT USING (auth.uid() = user_id);

REVOKE INSERT, UPDATE, DELETE ON public.xp_events FROM anon, authenticated;
GRANT SELECT ON public.xp_events TO authenticated;

CREATE TABLE IF NOT EXISTS public.gem_events (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  source     TEXT NOT NULL CHECK (source IN
               ('chapter_crowns', 'streak_7', 'defi_win', 'level_up')),
  source_key TEXT NOT NULL,
  amount     INTEGER NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, source, source_key)
);

ALTER TABLE public.gem_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gem_events_select_own" ON public.gem_events;
CREATE POLICY "gem_events_select_own" ON public.gem_events
  FOR SELECT USING (auth.uid() = user_id);

REVOKE INSERT, UPDATE, DELETE ON public.gem_events FROM anon, authenticated;
GRANT SELECT ON public.gem_events TO authenticated;

-- -----------------------------------------------------------------------------
-- 4. LA FORMULE DE NIVEAU (miroir de lib/wallet.levelFromXp)
--
-- Total cumulé pour atteindre le niveau L : 50·L·(L−1). Inverse fermé.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.wallet_level_from_xp(p_xp INTEGER)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT GREATEST(1, FLOOR((1 + sqrt(1 + GREATEST(0, p_xp) / 12.5)) / 2))::INTEGER;
$$;

-- -----------------------------------------------------------------------------
-- 5. OUVERTURE DU PORTEFEUILLE (interne)
--
-- À la première attribution, le portefeuille s'ouvre avec un RÉTRO-REMPLISSAGE
-- de l'XP « legacy » : la même formule que lib/xp.computeXp (10/bonne réponse
-- + 20 par quiz, 5/carte + 20 par session de flashcards, 15 par leçon, XP des
-- défis d'arène tels qu'enregistrés), sur la même fenêtre de 400 jours.
-- Personne ne repart de zéro le jour du changement de barème.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.wallet_ensure(p_user UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cutoff TIMESTAMPTZ := now() - INTERVAL '400 days';
  v_xp INTEGER;
BEGIN
  IF EXISTS (SELECT 1 FROM public.user_wallet WHERE user_id = p_user) THEN
    RETURN;
  END IF;

  SELECT COALESCE((
      SELECT SUM(t.score * 10 + 20) FROM public.test_sessions t
       WHERE t.user_id = p_user AND t.created_at >= v_cutoff), 0)
    + COALESCE((
      SELECT SUM(s.cards_count * 5 + 20) FROM public.study_sessions s
       WHERE s.user_id = p_user AND s.created_at >= v_cutoff), 0)
    + COALESCE((
      SELECT COUNT(*) * 15 FROM public.lesson_completions l
       WHERE l.user_id = p_user AND l.created_at >= v_cutoff), 0)
    + COALESCE((
      SELECT SUM(c.xp) FROM public.challenge_sessions c
       WHERE c.user_id = p_user AND c.created_at >= v_cutoff), 0)
  INTO v_xp;

  INSERT INTO public.user_wallet (user_id, xp, level)
  VALUES (p_user, GREATEST(0, v_xp), public.wallet_level_from_xp(GREATEST(0, v_xp)))
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.wallet_ensure(UUID) FROM PUBLIC;

-- -----------------------------------------------------------------------------
-- 6. GAGNER DE L'XP — wallet_award_xp(source, clé, montant)
--
-- Montants FIXÉS ICI (miroir de lib/wallet.XP_AWARDS) — p_amount n'est lu que
-- pour 'defi_arena', dont l'XP par session est proportionnelle au score
-- (barème de l'arène, borné). Gère en une transaction :
--   • l'événement XP (idempotent si la source a une clé) ;
--   • la série stockée (même jour → inchangée, lendemain → +1, sinon → 1)
--     et la récompense des paliers de 7 jours (+20 💎, une fois par jour-jalon) ;
--   • le niveau et la récompense de passage de niveau (+15 💎 par niveau,
--     une seule fois par niveau, même si l'XP fait un bond de plusieurs).
--
-- Anti-farm : au plus 30 événements par source et par jour (l'arène a déjà son
-- plafond quotidien côté test/challenge_sessions, ceinture et bretelles).
--
-- Renvoie l'état après coup, pour l'écran de fin :
--   { awarded, xp, level, level_up, streak_days, gems_gained }
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.wallet_award_xp(
  p_source TEXT,
  p_key    TEXT DEFAULT NULL,
  p_amount INTEGER DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_amount INTEGER;
  v_key TEXT := NULLIF(LEFT(COALESCE(p_key, ''), 80), '');
  v_today DATE := (now() AT TIME ZONE 'utc')::date;
  v_wallet public.user_wallet%ROWTYPE;
  v_new_streak INTEGER;
  v_new_level INTEGER;
  v_gems INTEGER := 0;
  v_lvl INTEGER;
  v_inserted BOOLEAN;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  v_amount := CASE p_source
    WHEN 'quiz'       THEN 20
    WHEN 'quiz_top'   THEN 30
    WHEN 'flashcards' THEN 10
    WHEN 'defi'       THEN 25
    WHEN 'defi_arena' THEN LEAST(GREATEST(COALESCE(p_amount, 0), 0), 600)
    ELSE NULL
  END;
  IF v_amount IS NULL THEN RETURN NULL; END IF;

  PERFORM public.wallet_ensure(v_user);

  SELECT * INTO v_wallet FROM public.user_wallet
   WHERE user_id = v_user FOR UPDATE;

  -- Plafond quotidien par source.
  IF (SELECT COUNT(*) FROM public.xp_events
       WHERE user_id = v_user AND source = p_source
         AND created_at >= v_today) >= 30 THEN
    RETURN jsonb_build_object(
      'awarded', 0, 'xp', v_wallet.xp, 'level', v_wallet.level,
      'level_up', false, 'streak_days', v_wallet.streak_days, 'gems_gained', 0);
  END IF;

  -- Événement (idempotent si clé) : déjà versé → on renvoie l'état tel quel.
  INSERT INTO public.xp_events (user_id, source, source_key, amount)
  VALUES (v_user, p_source, v_key, v_amount)
  ON CONFLICT DO NOTHING;
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'awarded', 0, 'xp', v_wallet.xp, 'level', v_wallet.level,
      'level_up', false, 'streak_days', v_wallet.streak_days, 'gems_gained', 0);
  END IF;

  -- Série stockée (sert uniquement aux paliers de 7 jours).
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

  -- Niveau : +15 💎 par niveau franchi, chacun une seule fois.
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

REVOKE ALL ON FUNCTION public.wallet_award_xp(TEXT, TEXT, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.wallet_award_xp(TEXT, TEXT, INTEGER) TO authenticated;

-- -----------------------------------------------------------------------------
-- 7. GAGNER DES GEMMES DE JEU — wallet_award_gems(source, clé)
--
-- Deux sources appelables (streak_7 et level_up sont versées par
-- wallet_award_xp, jamais directement) :
--
--   • 'chapter_crowns' (+30) — p_key = id du QUIZ qui vient d'être joué. La
--     fonction remonte au chapitre et VÉRIFIE en base que son meilleur quiz
--     atteint bien 80 % (le seuil des 3 couronnes, miroir de
--     lib/subject-template.COMPLETE_THRESHOLD) : le client ne peut pas
--     s'attribuer un chapitre non complété. Une seule fois par chapitre.
--
--   • 'defi_win' (+10) — p_key = « leçon:jour » : une victoire par leçon et
--     par jour. La victoire elle-même est déclarée par la Server Action (le
--     défi de leçon ne persiste pas ses manches) — montant faible, plafonné
--     par l'unicité de la clé.
--
-- Renvoie les gemmes réellement versées (0 si jalon déjà payé ou non atteint).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.wallet_award_gems(p_source TEXT, p_key TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_key TEXT := NULLIF(LEFT(COALESCE(p_key, ''), 80), '');
  v_chapter UUID;
  v_best NUMERIC;
  v_amount INTEGER;
BEGIN
  IF v_user IS NULL OR v_key IS NULL THEN RETURN 0; END IF;

  IF p_source = 'chapter_crowns' THEN
    -- Du quiz joué au chapitre, puis vérification du seuil des 3 couronnes.
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
    v_amount := 10;
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
  -- p_key n'était pas un uuid pour chapter_crowns : refus silencieux.
  RETURN 0;
END;
$$;

REVOKE ALL ON FUNCTION public.wallet_award_gems(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.wallet_award_gems(TEXT, TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 8. RE-BARÉMAGE ×30 DES FONCTIONS DE LA 183
--
-- Mêmes corps que la 183 (verrou d'abord, TOCTOU, ceinture et bretelles),
-- seuls les montants changent : chapitre à 30, parrainage à 30, plafond 600.
-- Miroir de lib/gems.ts (GEM_COST_CHAPTER, REFERRAL_GEM_REWARD,
-- REFERRAL_GEM_CAP).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.unlock_chapter_with_gem(p_chapter_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_tier TEXT;
  v_gems INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN 'not_found'; END IF;

  IF NOT EXISTS (SELECT 1 FROM public.chapters WHERE id = p_chapter_id) THEN
    RETURN 'not_found';
  END IF;

  -- Le verrou vient en premier, avant toute vérification (cf. 183 : TOCTOU).
  SELECT subscription_tier, gems INTO v_tier, v_gems
    FROM public.profiles
   WHERE id = v_user
     FOR UPDATE;

  IF EXISTS (
    SELECT 1 FROM public.chapter_unlocks
     WHERE user_id = v_user AND chapter_id = p_chapter_id
  ) THEN
    RETURN 'already';
  END IF;

  IF v_tier IN ('tier1', 'tier2', 'tier3') THEN
    RETURN 'premium';
  END IF;

  IF COALESCE(v_gems, 0) < 30 THEN
    RETURN 'no_gems';
  END IF;

  INSERT INTO public.chapter_unlocks (user_id, chapter_id, source)
  VALUES (v_user, p_chapter_id, 'gem')
  ON CONFLICT DO NOTHING;

  IF NOT FOUND THEN
    RETURN 'already';
  END IF;

  UPDATE public.profiles SET gems = gems - 30 WHERE id = v_user;

  RETURN 'unlocked';
END;
$$;

CREATE OR REPLACE FUNCTION public.activate_referral(p_referee UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referrer UUID;
  v_earned   INTEGER;
BEGIN
  UPDATE public.referrals
     SET status = 'activated', activated_at = now()
   WHERE referee_id = p_referee
     AND status = 'pending'
  RETURNING referrer_id INTO v_referrer;

  IF v_referrer IS NULL THEN RETURN false; END IF;

  -- Le filleul touche ses gemmes d'arrivée, sans condition de plafond.
  UPDATE public.profiles SET gems = gems + 30 WHERE id = p_referee;

  -- Le parrain touche les siennes tant qu'il n'a pas atteint REFERRAL_GEM_CAP
  -- (600, miroir de lib/gems.ts — soit toujours 20 filleuls payants).
  SELECT referral_gems_earned INTO v_earned
    FROM public.profiles WHERE id = v_referrer FOR UPDATE;

  IF COALESCE(v_earned, 0) < 600 THEN
    UPDATE public.profiles
       SET gems = gems + 30,
           referral_gems_earned = COALESCE(referral_gems_earned, 0) + 30
     WHERE id = v_referrer;
  END IF;

  RETURN true;
END;
$$;

-- -----------------------------------------------------------------------------
-- 9. VÉRIFICATIONS MANUELLES (avec la clé anon, hors SQL Editor)
--
--   select * from user_wallet                        → sa ligne seulement
--   insert into xp_events …                          → doit échouer (RLS + REVOKE)
--   rpc wallet_award_xp('quiz')                      → { awarded: 20, … }
--   rpc wallet_award_xp('defi', '<leçon>:2026-07-21') deux fois
--                                                    → awarded 25 puis 0
--   rpc wallet_award_gems('defi_win', 'x:2026-07-21') deux fois → 10 puis 0
--   rpc unlock_chapter_with_gem(<id>)                → débite 30
-- =============================================================================
