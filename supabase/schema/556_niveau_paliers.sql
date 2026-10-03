-- =============================================================================
-- Studuel — Migration 556 : les COFFRES DE PALIER de niveau
--
-- Lucas, 03/10/2026 : « établis le système de récompense des paliers d'XP pour
-- monter de niveau ». Chaque niveau franchi verse déjà 15 gemmes tout seul
-- (192 → 368, wallet_grant_xp / wallet_award_xp : inchangés). Cette migration
-- ajoute l'étage du dessus : TOUS LES 5 NIVEAUX, un coffre que l'élève ouvre
-- lui-même — 10 gemmes par niveau du palier, plafonné à 250 (50 au niveau 5,
-- 100 au 10, 250 dès le 25).
--
--   · niveau_palier_gemmes(n)      : le barème (MIROIR de lib/niveaux.ts) ;
--   · niveau_palier_reclamer(n)    : ouvre le coffre du palier n si le niveau
--     de l'élève l'a atteint ; une seule fois (gem_events, clé = le palier).
--
-- La source 'niveau_palier' rejoint la contrainte gem_events_source_check,
-- reconstruite depuis sa définition courante (même méthode que la 379).
--
-- PRÉREQUIS : 192 (user_wallet, gem_events), 379 (contrainte des sources).
-- Idempotente. À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor.
-- =============================================================================

-- --- La source de gemmes ------------------------------------------------------
DO $$
DECLARE
  v_def     TEXT;
  v_sources TEXT[];
BEGIN
  SELECT pg_get_constraintdef(c.oid) INTO v_def
    FROM pg_constraint c
   WHERE c.conname = 'gem_events_source_check'
     AND c.conrelid = 'public.gem_events'::regclass;
  IF v_def IS NOT NULL AND v_def !~ '\mniveau_palier\M' THEN
    SELECT array_agg(DISTINCT btrim(s)) INTO v_sources
      FROM regexp_matches(v_def, '''([^'']+)''', 'g') AS m,
           LATERAL unnest(string_to_array(btrim(m[1], '{}'), ',')) AS s
     WHERE btrim(s) <> '';
    v_sources := array_append(COALESCE(v_sources, ARRAY[]::TEXT[]), 'niveau_palier');
    EXECUTE 'ALTER TABLE public.gem_events DROP CONSTRAINT gem_events_source_check';
    EXECUTE format('ALTER TABLE public.gem_events ADD CONSTRAINT gem_events_source_check CHECK (source IN (%s))',
                   (SELECT string_agg(quote_literal(x), ', ' ORDER BY x) FROM unnest(v_sources) x));
  END IF;
END
$$;

-- --- Le barème ----------------------------------------------------------------
-- MIROIR de lib/niveaux.gemmesPalier.
CREATE OR REPLACE FUNCTION public.niveau_palier_gemmes(p_niveau INTEGER)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN p_niveau IS NULL OR p_niveau < 5 OR p_niveau % 5 <> 0 THEN 0
    ELSE LEAST(250, 10 * p_niveau)
  END;
$$;

-- --- Ouvrir un coffre de palier -------------------------------------------------
-- Rend { ok, gemmes } ou { ok: false, raison: 'anonyme' | 'pas_un_palier' |
-- 'pas_atteint' | 'deja_ouvert' }.
CREATE OR REPLACE FUNCTION public.niveau_palier_reclamer(p_niveau INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_niveau INTEGER;
  v_gemmes INTEGER;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', FALSE, 'raison', 'anonyme');
  END IF;
  v_gemmes := public.niveau_palier_gemmes(p_niveau);
  IF v_gemmes <= 0 THEN
    RETURN jsonb_build_object('ok', FALSE, 'raison', 'pas_un_palier');
  END IF;

  SELECT level INTO v_niveau FROM public.user_wallet WHERE user_id = v_user;
  IF COALESCE(v_niveau, 1) < p_niveau THEN
    RETURN jsonb_build_object('ok', FALSE, 'raison', 'pas_atteint');
  END IF;

  INSERT INTO public.gem_events (user_id, source, source_key, amount)
  VALUES (v_user, 'niveau_palier', p_niveau::text, v_gemmes)
  ON CONFLICT DO NOTHING;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', FALSE, 'raison', 'deja_ouvert');
  END IF;

  UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_gemmes WHERE id = v_user;
  RETURN jsonb_build_object('ok', TRUE, 'gemmes', v_gemmes);
END;
$$;

REVOKE ALL ON FUNCTION public.niveau_palier_reclamer(INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.niveau_palier_reclamer(INTEGER) TO authenticated;

-- Vérification (à la main, connecté en élève) :
--   select public.niveau_palier_gemmes(5), public.niveau_palier_gemmes(25), public.niveau_palier_gemmes(7);
--   → 50 · 250 · 0
