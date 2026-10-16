-- =============================================================================
-- Studuel — Migration 580 : LA RENTE DE GEMMES DE STUDUEL+, ET LES FICHES EN
-- GEMMES POUR TOUT LE MONDE
--
-- Lucas, 15/10/2026 : « tout le monde aimerait être rentier : les users seront
-- des rentiers de gemmes […] un palier parlant, type 60 gemmes par semaine,
-- soit 2 fiches de révision offertes ». Choix du même jour : la rente POUSSE en
-- continu et se RÉCOLTE (pas un versement du lundi), et Studuel+ n'ouvre plus
-- les fiches d'office — l'abonné les achète avec sa rente, comme tout le monde.
--
-- CE QU'ELLE INSTALLE.
--   1. `gem_events` accepte la source `rente` ;
--   2. `rente_gemmes` — le point de départ de la rente de chaque abonné ;
--   3. `rente_etat()` (lecture) et `rente_recolter()` (versement) : une gemme
--      toutes les 10 080 s (2 h 48), 60 par semaine, coffre plafonné à une
--      semaine ; le premier passage trouve le coffre PLEIN (point de départ une
--      semaine en arrière) ; plein, ce qui déborde est perdu ;
--   4. LES TROIS PORTES DES FICHES PERDENT LA PORTE « ABONNEMENT » :
--      `unlock_chapter_with_gem` (192 : un abonné paie 30 gemmes comme les
--      autres, au lieu de recevoir « premium »), `lesson_revision_sheet` (184),
--      `chapter_mind_map` (183) et `fiche_pdf_acces` (563 : le PDF du bucket
--      privé). Restent l'administrateur et le chapitre débloqué — à vie.
--
-- ⚠️ EFFET À SAVOIR : un abonné qui lisait toutes les fiches ne lit plus que
-- celles qu'il a débloquées. Aucun abonnement n'est encore payé en euros (les
-- seuls abonnés sont des comptes de test et des bascules de coach, 561) ; sa
-- rente lui verse 60 gemmes dès son premier passage.
--
-- Miroir applicatif : lib/studuel-plus/rente.ts (montants, testé contre ce
-- fichier), lib/gems.ts (`chapterAccess` ne regarde plus l'abonnement).
-- PRÉREQUIS : 183, 184, 192, 557 (gem_events et sa contrainte), 563. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ───────────────────────────────── 1. la source « rente » des gemmes

DO $$
DECLARE
  v_def     TEXT;
  v_sources TEXT[];
BEGIN
  SELECT pg_get_constraintdef(c.oid) INTO v_def
    FROM pg_constraint c
   WHERE c.conname = 'gem_events_source_check'
     AND c.conrelid = 'public.gem_events'::regclass;
  IF v_def IS NULL THEN RETURN; END IF;
  SELECT array_agg(DISTINCT btrim(s)) INTO v_sources
    FROM regexp_matches(v_def, '''([^'']+)''', 'g') AS m,
         LATERAL unnest(string_to_array(btrim(m[1], '{}'), ',')) AS s
   WHERE btrim(s) <> '';
  v_sources := COALESCE(v_sources, ARRAY[]::TEXT[]);
  IF 'rente' = ANY (v_sources) THEN RETURN; END IF;
  v_sources := array_append(v_sources, 'rente');
  ALTER TABLE public.gem_events DROP CONSTRAINT gem_events_source_check;
  EXECUTE format('ALTER TABLE public.gem_events ADD CONSTRAINT gem_events_source_check CHECK (source IN (%s))',
                 (SELECT string_agg(quote_literal(x), ', ' ORDER BY x) FROM unnest(v_sources) x));
END;
$$;

-- ─────────────────────────────────────────────── 2. la rente de chaque abonné

CREATE TABLE IF NOT EXISTS public.rente_gemmes (
  user_id    UUID PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  -- Le moment d'où la rente pousse : une gemme par 10 080 s écoulées depuis.
  depuis     TIMESTAMPTZ NOT NULL,
  recolte_le TIMESTAMPTZ,
  -- Tout ce que la rente a versé, pour l'écran (« 420 gemmes depuis le début »).
  total      INTEGER NOT NULL DEFAULT 0 CHECK (total >= 0)
);
ALTER TABLE public.rente_gemmes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rente_gemmes_select_own ON public.rente_gemmes;
CREATE POLICY rente_gemmes_select_own ON public.rente_gemmes
  FOR SELECT USING (user_id = (SELECT auth.uid()));
REVOKE INSERT, UPDATE, DELETE ON public.rente_gemmes FROM anon, authenticated;

-- L'abonnement ouvre-t-il la rente ? Miroir de lib/gems.ts (PREMIUM_TIERS).
CREATE OR REPLACE FUNCTION public.rente_abonne(p_user UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT subscription_tier IN ('tier1', 'tier2', 'tier3')
                     FROM public.profiles WHERE id = p_user), false);
$$;
REVOKE ALL ON FUNCTION public.rente_abonne(UUID) FROM PUBLIC, anon, authenticated;

-- L'état du coffre. Sans ligne, la rente « part » d'une semaine en arrière :
-- le premier passage d'un abonné trouve 60 gemmes à récolter.
CREATE OR REPLACE FUNCTION public.rente_etat()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_periode  CONSTANT INTEGER := 10080;
  v_plafond  CONSTANT INTEGER := 60;
  v_depuis   TIMESTAMPTZ;
  v_total    INTEGER := 0;
  v_ecoule   BIGINT;
  v_gemmes   INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  SELECT depuis, total INTO v_depuis, v_total FROM public.rente_gemmes WHERE user_id = v_user;
  v_depuis := COALESCE(v_depuis, now() - interval '7 days');
  v_ecoule := GREATEST(0, floor(extract(epoch FROM (now() - v_depuis)))::bigint);
  v_gemmes := LEAST(v_plafond, (v_ecoule / v_periode)::int);
  RETURN jsonb_build_object(
    'abonne', public.rente_abonne(v_user),
    'depuis', v_depuis,
    'maintenant', now(),
    'gemmes', v_gemmes,
    'plafond', v_plafond,
    'periode_s', v_periode,
    'total', COALESCE(v_total, 0));
END;
$$;
REVOKE ALL ON FUNCTION public.rente_etat() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rente_etat() TO authenticated;

-- La récolte. Rend {ok, gemmes, solde} ou {ok:false, raison: anonyme |
-- abonnement | vide}. Le verrou sur la ligne de rente sérialise deux récoltes
-- simultanées (deux onglets) : la seconde trouve un coffre vide.
CREATE OR REPLACE FUNCTION public.rente_recolter()
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_periode  CONSTANT INTEGER := 10080;
  v_plafond  CONSTANT INTEGER := 60;
  v_depuis   TIMESTAMPTZ;
  v_ecoule   BIGINT;
  v_gemmes   INTEGER;
  v_solde    INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('ok', false, 'raison', 'anonyme'); END IF;
  IF NOT public.rente_abonne(v_user) THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'abonnement');
  END IF;

  INSERT INTO public.rente_gemmes (user_id, depuis)
  VALUES (v_user, now() - interval '7 days')
  ON CONFLICT (user_id) DO NOTHING;

  SELECT depuis INTO v_depuis FROM public.rente_gemmes WHERE user_id = v_user FOR UPDATE;
  v_ecoule := GREATEST(0, floor(extract(epoch FROM (now() - v_depuis)))::bigint);
  v_gemmes := LEAST(v_plafond, (v_ecoule / v_periode)::int);
  IF v_gemmes <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'vide');
  END IF;

  INSERT INTO public.gem_events (user_id, source, source_key, amount)
  VALUES (v_user, 'rente', to_char(clock_timestamp() AT TIME ZONE 'utc', 'YYYYMMDDHH24MISSUS'), v_gemmes);

  UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_gemmes WHERE id = v_user
  RETURNING gems INTO v_solde;

  -- Plein : ce qui a débordé est perdu (on repart de maintenant). Sinon on ne
  -- recule que de ce qui est payé : les secondes entamées restent acquises.
  UPDATE public.rente_gemmes
     SET depuis = CASE WHEN v_gemmes >= v_plafond THEN now()
                       ELSE v_depuis + make_interval(secs => v_gemmes * v_periode) END,
         recolte_le = now(),
         total = total + v_gemmes
   WHERE user_id = v_user;

  RETURN jsonb_build_object('ok', true, 'gemmes', v_gemmes, 'solde', v_solde);
END;
$$;
REVOKE ALL ON FUNCTION public.rente_recolter() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rente_recolter() TO authenticated;

-- ───────────────────────── 3. les fiches : plus de porte « abonnement »

-- 192, sans la porte « premium » : un abonné débloque une fiche avec 30 gemmes,
-- comme tout le monde (sa rente en verse 60 par semaine).
CREATE OR REPLACE FUNCTION public.unlock_chapter_with_gem(p_chapter_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_gems INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN 'not_found'; END IF;

  IF NOT EXISTS (SELECT 1 FROM public.chapters WHERE id = p_chapter_id) THEN
    RETURN 'not_found';
  END IF;

  -- Le verrou vient en premier, avant toute vérification (cf. 183 : TOCTOU).
  SELECT gems INTO v_gems
    FROM public.profiles
   WHERE id = v_user
     FOR UPDATE;

  IF EXISTS (
    SELECT 1 FROM public.chapter_unlocks
     WHERE user_id = v_user AND chapter_id = p_chapter_id
  ) THEN
    RETURN 'already';
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
REVOKE ALL ON FUNCTION public.unlock_chapter_with_gem(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.unlock_chapter_with_gem(UUID) TO authenticated;

-- 184, sans la porte « abonnement ».
CREATE OR REPLACE FUNCTION public.lesson_revision_sheet(p_lesson_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_chapter UUID;
  v_sheet   TEXT;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  SELECT chapter_id, revision_sheet INTO v_chapter, v_sheet
    FROM public.lessons
   WHERE id = p_lesson_id;
  IF v_chapter IS NULL THEN RETURN NULL; END IF;

  IF public.is_admin() THEN RETURN v_sheet; END IF;

  IF EXISTS (
    SELECT 1 FROM public.chapter_unlocks
     WHERE user_id = v_user AND chapter_id = v_chapter
  ) THEN
    RETURN v_sheet;
  END IF;

  RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.lesson_revision_sheet(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.lesson_revision_sheet(UUID) TO authenticated;

-- 183, sans la porte « abonnement ».
CREATE OR REPLACE FUNCTION public.chapter_mind_map(p_chapter_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_map  JSONB;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  IF NOT public.is_admin() AND NOT EXISTS (
    SELECT 1 FROM public.chapter_unlocks
     WHERE user_id = v_user AND chapter_id = p_chapter_id
  ) THEN
    RETURN NULL;
  END IF;

  SELECT mind_map INTO v_map
    FROM public.chapters
   WHERE id = p_chapter_id;

  RETURN v_map;
END;
$$;
REVOKE ALL ON FUNCTION public.chapter_mind_map(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.chapter_mind_map(UUID) TO authenticated;

-- 563, sans la porte « abonnement » : le PDF du bucket privé `fiches`.
CREATE OR REPLACE FUNCTION public.fiche_pdf_acces(p_nom TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_chapter UUID;
BEGIN
  IF v_user IS NULL THEN RETURN FALSE; END IF;
  IF p_nom !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$' THEN
    RETURN FALSE;
  END IF;
  v_chapter := left(p_nom, 36)::uuid;

  IF public.is_admin() THEN RETURN TRUE; END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.chapter_unlocks
     WHERE user_id = v_user AND chapter_id = v_chapter
  );
END;
$$;
REVOKE ALL ON FUNCTION public.fiche_pdf_acces(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fiche_pdf_acces(TEXT) TO authenticated;

-- Contrôle à la main, connecté en abonné :
--   select public.rente_etat();       → {"abonne": true, "gemmes": 60, …}
--   select public.rente_recolter();   → {"ok": true, "gemmes": 60, "solde": …}
--   select public.rente_recolter();   → {"ok": false, "raison": "vide"}
