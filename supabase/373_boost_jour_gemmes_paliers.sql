-- =============================================================================
-- 373 — UN BOOST XP PAR JOUR, et LES GEMMES DES PALIERS de jeux
--
-- Lucas, 19/09/2026 :
--   · « boost exp DISPO 1 FOIS PAR JOUR » — le Boost XP · 2 h du Marché ne
--     s'achète plus qu'une fois par jour (jour UTC, comme toutes les clés de
--     jour de l'app, lib/time) : `acheter_offre` refuse le second achat avec
--     la raison `deja_aujourdhui` (phrase dans lib/boutique/achat.ts).
--   · « il faut ajouter les gains en gemmes avec l'illustration pour chaque
--     palier […] vrai pour tous les modes de jeu » — chaque ÉTOILE décrochée
--     sur un palier d'un jeu de salon rapporte des gemmes, UNE fois : palier N
--     → N gemmes par étoile (Éveil 1, Apprenti 2, Confirmé 3, Expert 4,
--     Maître 5 ; 45 gemmes par jeu, doublées le week-end des gemmes ×2).
--     Miroir : lib/jeux/palier-gemmes.ts.
--
-- LES ÉTOILES VIVENT DANS LE NAVIGATEUR (lib/jeux/paliers, stockage local) :
-- le serveur ne peut pas les recompter, comme il ne recompte pas une victoire
-- de salon (apply_game_trophies croit `p_won`). Ce qui le protège :
--   · chaque étoile n'est payée qu'UNE fois, pour toujours (clé unique de
--     gem_events : jeu:palier:étoile) — on ne « refarme » rien ;
--   · le plafond est connu et petit : 45 gemmes par jeu de salon ;
--   · le jeu doit être au catalogue (game_catalog, 238), hors « programme ».
--
-- 1. acheter_offre : la 371 à l'identique, plus le refus `deja_aujourdhui`.
-- 2. gem_events accepte la source 'palier'.
-- 3. Table `palier_gemmes` (les étoiles déjà payées, palier par palier).
-- 4. RPC `palier_gemmes_reclamer(jeu, étoiles[5])` : paie les étoiles pas
--    encore payées, rend {ok, gemmes, solde, etoiles[5]}.
--
-- Dépend de 192 (gem_events), 238 (game_catalog), 368 (boutique_achats,
-- gemmes_avec_bonus) et 371 (acheter_offre, bouclier). Idempotente :
-- CREATE … IF NOT EXISTS, CREATE OR REPLACE, contrainte relue.
-- À exécuter à la main APRÈS la 371 : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

-- ─────────────────────────────────────── 1. un Boost XP par jour

CREATE OR REPLACE FUNCTION public.acheter_offre(p_offre TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_offre  public.boutique_offres%ROWTYPE;
  v_wallet public.user_wallet%ROWTYPE;
  v_gems   INTEGER;
  v_jour   DATE;
  v_samedi DATE;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;

  SELECT * INTO v_offre FROM public.boutique_offres WHERE id = p_offre;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'inconnue');
  END IF;

  -- Sans profil, pas de portefeuille possible (clé étrangère de user_wallet).
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user) THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;

  -- LES VERROUS D'ABORD (TOCTOU, cf. 183), et dans l'ordre des fonctions du
  -- portefeuille — le portefeuille, PUIS le profil — pour ne jamais croiser
  -- un wallet_award_xp du même élève en interblocage.
  PERFORM public.wallet_ensure(v_user);
  SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user FOR UPDATE;
  SELECT gems INTO v_gems FROM public.profiles WHERE id = v_user FOR UPDATE;

  -- Un boost à durée qui court ne se rachète pas (miroir d'etatOffre).
  IF v_offre.kind = 'double_xp' AND v_wallet.double_xp_jusqua > now() THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja_actif');
  END IF;
  -- 373 : UN Boost XP par jour UTC (miroir de boostXpDejaAchete). Le verrou du
  -- portefeuille, pris plus haut, sérialise deux achats simultanés : le second
  -- voit la ligne du premier dans le journal.
  IF v_offre.kind = 'double_xp' AND EXISTS (
       SELECT 1 FROM public.boutique_achats a
        WHERE a.user_id = v_user
          AND a.nature = 'offre'
          AND a.article = v_offre.id
          AND (a.created_at AT TIME ZONE 'UTC')::date = (now() AT TIME ZONE 'UTC')::date
     ) THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja_aujourdhui');
  END IF;
  IF v_offre.kind = 'trophees_x2' AND v_wallet.trophees_x2_jusqua > now() THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja_actif');
  END IF;
  IF v_offre.kind = 'gemmes_x2' AND v_wallet.gemmes_x2_fin > now() THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja_actif');
  END IF;
  -- Les réserves ne débordent jamais : deux gels, un bouclier.
  IF v_offre.kind = 'gel_serie' AND v_wallet.gels_serie + v_offre.valeur > 2 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'plein');
  END IF;
  IF v_offre.kind = 'bouclier_trophees'
     AND v_wallet.boucliers_trophees + v_offre.valeur > 1 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'plein');
  END IF;

  IF COALESCE(v_gems, 0) < v_offre.prix_gemmes THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'pas_assez');
  END IF;

  UPDATE public.profiles
     SET gems = gems - v_offre.prix_gemmes
   WHERE id = v_user
  RETURNING gems INTO v_gems;

  IF v_offre.kind = 'double_xp' THEN
    UPDATE public.user_wallet
       SET double_xp_jusqua = now() + make_interval(hours => v_offre.valeur),
           updated_at = now()
     WHERE user_id = v_user;
  ELSIF v_offre.kind = 'bouclier_trophees' THEN
    UPDATE public.user_wallet
       SET boucliers_trophees = boucliers_trophees + v_offre.valeur,
           updated_at = now()
     WHERE user_id = v_user;
  ELSIF v_offre.kind = 'trophees_x2' THEN
    UPDATE public.user_wallet
       SET trophees_x2_jusqua = now() + make_interval(hours => v_offre.valeur),
           updated_at = now()
     WHERE user_id = v_user;
  ELSIF v_offre.kind = 'gel_serie' THEN
    UPDATE public.user_wallet
       SET gels_serie = gels_serie + v_offre.valeur,
           updated_at = now()
     WHERE user_id = v_user;
  ELSIF v_offre.kind = 'gemmes_x2' THEN
    -- Le week-end DE L'ÉLÈVE : samedi 0 h → lundi 0 h, heure de Paris (368).
    v_jour := (now() AT TIME ZONE 'Europe/Paris')::date;
    v_samedi := v_jour + (6 - EXTRACT(ISODOW FROM v_jour)::int);
    UPDATE public.user_wallet
       SET gemmes_x2_debut = (v_samedi::timestamp) AT TIME ZONE 'Europe/Paris',
           gemmes_x2_fin   = ((v_samedi + 2)::timestamp) AT TIME ZONE 'Europe/Paris',
           updated_at = now()
     WHERE user_id = v_user;
  END IF;

  INSERT INTO public.boutique_achats (user_id, nature, article, prix_gemmes)
  VALUES (v_user, 'offre', v_offre.id, v_offre.prix_gemmes);

  RETURN jsonb_build_object('ok', true, 'gemmes', v_gems);
END;
$$;

REVOKE ALL ON FUNCTION public.acheter_offre(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.acheter_offre(TEXT) TO authenticated;

-- Le journal se lit par élève et par article pour ce refus : l'index de la 368
-- (user_id, created_at DESC) suffit — un élève n'achète que quelques offres.

-- ─────────────────────────────────── 2. la source de gemmes « palier »
-- On AJOUTE 'palier' aux sources déjà permises, quelles qu'elles soient en
-- production (même méthode que la 372 : la liste est relue dans la contrainte
-- existante plutôt que recopiée d'une migration).

DO $$
DECLARE
  v_def     TEXT;
  v_sources TEXT[];
BEGIN
  SELECT pg_get_constraintdef(c.oid) INTO v_def
    FROM pg_constraint c
   WHERE c.conname = 'gem_events_source_check'
     AND c.conrelid = 'public.gem_events'::regclass;
  IF v_def IS NOT NULL AND v_def !~ '\mpalier\M' THEN
    SELECT array_agg(DISTINCT btrim(s)) INTO v_sources
      FROM regexp_matches(v_def, '''([^'']+)''', 'g') AS m,
           LATERAL unnest(string_to_array(btrim(m[1], '{}'), ',')) AS s
     WHERE btrim(s) <> '';
    v_sources := array_append(COALESCE(v_sources, ARRAY[]::TEXT[]), 'palier');
    EXECUTE 'ALTER TABLE public.gem_events DROP CONSTRAINT gem_events_source_check';
    EXECUTE format('ALTER TABLE public.gem_events ADD CONSTRAINT gem_events_source_check CHECK (source IN (%s))',
                   (SELECT string_agg(quote_literal(x), ', ' ORDER BY x) FROM unnest(v_sources) x));
  END IF;
END $$;

-- ─────────────────────────────────── 3. les étoiles déjà payées

CREATE TABLE IF NOT EXISTS public.palier_gemmes (
  user_id UUID     NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  game_id TEXT     NOT NULL,
  palier  SMALLINT NOT NULL CHECK (palier BETWEEN 1 AND 5),
  -- Étoiles déjà payées sur ce palier (0..3) : elles ne le seront plus jamais.
  etoiles SMALLINT NOT NULL DEFAULT 0 CHECK (etoiles BETWEEN 0 AND 3),
  -- Gemmes réellement versées sur ce palier (bonus du week-end compris).
  gemmes  INTEGER  NOT NULL DEFAULT 0 CHECK (gemmes >= 0),
  maj_le  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, game_id, palier)
);

ALTER TABLE public.palier_gemmes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "palier_gemmes_select_own" ON public.palier_gemmes;
CREATE POLICY "palier_gemmes_select_own" ON public.palier_gemmes
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

-- Aucune écriture directe : seule la RPC ci-dessous (definer) écrit.
REVOKE INSERT, UPDATE, DELETE ON public.palier_gemmes FROM anon, authenticated;
GRANT SELECT ON public.palier_gemmes TO authenticated;

-- ─────────────────────────────────── 4. réclamer les gemmes des étoiles

-- `p_etoiles` : les étoiles de l'élève sur les cinq paliers du jeu, dans
-- l'ordre (Éveil → Maître), 0..3 chacune. Paie chaque étoile PAS ENCORE
-- payée, au tarif de son palier (palier N → N gemmes, week-end ×2 compris),
-- et ne retire jamais rien : une valeur plus basse que celle déjà payée est
-- simplement sans effet. Réponse : {"ok": true, "gemmes": <versées cet
-- appel>, "solde": <gemmes de l'élève>, "etoiles": [<payées par palier>]} ou
-- {"ok": false, "raison": 'anonyme' | 'inconnu' | 'invalide'}.
CREATE OR REPLACE FUNCTION public.palier_gemmes_reclamer(p_game_id TEXT, p_etoiles INTEGER[])
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_palier  INTEGER;
  v_voulu   INTEGER;
  v_deja    INTEGER;
  v_etoile  INTEGER;
  v_montant INTEGER;
  v_gagne   INTEGER;
  v_total   INTEGER := 0;
  v_solde   INTEGER;
  v_payees  INTEGER[] := ARRAY[0, 0, 0, 0, 0];
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;

  -- Un jeu de salon du catalogue (238), jamais le « programme » (le duel
  -- classé n'a pas de paliers).
  IF p_game_id IS NULL OR p_game_id = 'programme' OR NOT EXISTS (
       SELECT 1 FROM public.game_catalog WHERE game_id = p_game_id
     ) THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'inconnu');
  END IF;

  IF p_etoiles IS NULL OR COALESCE(array_length(p_etoiles, 1), 0) <> 5 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'invalide');
  END IF;

  -- Le verrou : la ligne du profil (les gemmes). Deux appels simultanés du
  -- même élève passent l'un après l'autre ; la clé unique de gem_events
  -- garantit de toute façon qu'une étoile n'est payée qu'une fois.
  SELECT gems INTO v_solde FROM public.profiles WHERE id = v_user FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;

  FOR v_palier IN 1..5 LOOP
    v_voulu := LEAST(3, GREATEST(0, COALESCE(p_etoiles[v_palier], 0)));
    SELECT etoiles INTO v_deja FROM public.palier_gemmes
     WHERE user_id = v_user AND game_id = p_game_id AND palier = v_palier;
    v_deja := COALESCE(v_deja, 0);

    IF v_voulu > v_deja THEN
      v_gagne := 0;
      FOR v_etoile IN (v_deja + 1)..v_voulu LOOP
        -- Palier N → N gemmes par étoile (miroir de gemmesParEtoile).
        v_montant := public.gemmes_avec_bonus(v_user, v_palier);
        INSERT INTO public.gem_events (user_id, source, source_key, amount)
        VALUES (v_user, 'palier', p_game_id || ':' || v_palier || ':' || v_etoile, v_montant)
        ON CONFLICT DO NOTHING;
        IF FOUND THEN
          v_gagne := v_gagne + v_montant;
        END IF;
      END LOOP;

      INSERT INTO public.palier_gemmes AS p (user_id, game_id, palier, etoiles, gemmes, maj_le)
      VALUES (v_user, p_game_id, v_palier, v_voulu, v_gagne, now())
      ON CONFLICT (user_id, game_id, palier) DO UPDATE
        SET etoiles = GREATEST(p.etoiles, EXCLUDED.etoiles),
            gemmes  = p.gemmes + EXCLUDED.gemmes,
            maj_le  = now();

      v_total := v_total + v_gagne;
    END IF;

    v_payees[v_palier] := GREATEST(v_voulu, v_deja);
  END LOOP;

  IF v_total > 0 THEN
    UPDATE public.profiles
       SET gems = COALESCE(gems, 0) + v_total
     WHERE id = v_user
    RETURNING gems INTO v_solde;
  END IF;

  RETURN jsonb_build_object('ok', true, 'gemmes', v_total, 'solde', COALESCE(v_solde, 0),
                            'etoiles', to_jsonb(v_payees));
END;
$$;

REVOKE ALL ON FUNCTION public.palier_gemmes_reclamer(TEXT, INTEGER[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.palier_gemmes_reclamer(TEXT, INTEGER[]) TO authenticated;

-- Contrôle ---------------------------------------------------------------------
-- `table_paliers` DOIT valoir 1, `fonctions` 2, `source_palier` true.
SELECT
  (SELECT count(*) FROM pg_tables WHERE schemaname = 'public' AND tablename = 'palier_gemmes') AS table_paliers,
  (SELECT count(*) FROM pg_proc WHERE pronamespace = 'public'::regnamespace
     AND proname IN ('acheter_offre', 'palier_gemmes_reclamer')) AS fonctions,
  (SELECT pg_get_constraintdef(oid) ~ '\mpalier\M' FROM pg_constraint
    WHERE conname = 'gem_events_source_check') AS source_palier;
