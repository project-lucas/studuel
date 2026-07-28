-- Scolaria - Migration 202 : filet de perte « Bronze » sur le match classe.
-- Recree apply_ranked_match (migration 079) pour amortir la defaite dans le
-- palier BRONZE (0..399 trophees) :
--   * Bronze IV (0..99)   : AUCUNE perte (filet total du debutant) ;
--   * Bronze III/II/I     : la perte ne peut pas faire redescendre sous le
--                           seuil de la division courante (100 / 200 / 300).
-- Hors Bronze (Argent+) : bareme normal inchange. Les GAINS ne sont jamais
-- amortis. Le matchmaking (adversaire ±150) et le bareme Elo-lite (12..40 /
-- -6..-30) restent identiques : on ne touche qu'au delta d'une DEFAITE en
-- Bronze.
--
-- MIROIR EXACT de lib/trophies.bronzeLossShield (garde les deux alignes).
--
-- ⚠️ CREATE OR REPLACE herite de TOUT l'historique de la fonction : la 171 a
-- ajoute une BORNE DE RYTHME (30 matchs classes par heure glissante, anti-
-- farming de trophees — `p_won` vient du client). Cette recreation la CONSERVE,
-- sinon executer la 202 annulerait ce durcissement deja en production.
--
-- Idempotente (CREATE OR REPLACE). A EXECUTER A LA MAIN apres la 201.
-- Astuce : selectionne TOUT le fichier (Ctrl+A) avant de lancer.

CREATE OR REPLACE FUNCTION public.apply_ranked_match(
  p_won BOOLEAN,
  p_opponent_trophies INTEGER,
  p_opponent_label TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_before   INTEGER;
  v_best     INTEGER;
  v_opp      INTEGER;
  v_expected DOUBLE PRECISION;
  v_raw      DOUBLE PRECISION;
  v_delta    INTEGER;
  v_after    INTEGER;
  -- Fin du palier Bronze = seuil d'entree d'Argent : 4 divisions x 100 = 400.
  v_bronze_ceiling CONSTANT INTEGER := 400;
  v_division_span  CONSTANT INTEGER := 100;
  v_gate     INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  -- Borne de rythme (heritee de la 171) : au-dela de 30 matchs classes dans
  -- l'heure, on refuse — un BO3 dure plusieurs minutes, un rythme superieur
  -- trahit un appel direct en boucle.
  IF (SELECT count(*) FROM public.ranked_matches
        WHERE user_id = v_user
          AND created_at >= now() - INTERVAL '1 hour') >= 30 THEN
    RETURN NULL;
  END IF;

  SELECT trophies, best_trophies INTO v_before, v_best
    FROM public.profiles WHERE id = v_user FOR UPDATE;
  IF v_before IS NULL THEN RETURN NULL; END IF;

  -- Adversaire borne a ±150 du joueur (matchmaking equitable, anti-triche).
  v_opp := GREATEST(v_before - 150,
             LEAST(v_before + 150, COALESCE(p_opponent_trophies, v_before)));

  v_expected := 1.0 / (1.0 + power(10.0, (v_opp - v_before) / 400.0));
  v_raw := 40.0 * ((CASE WHEN p_won THEN 1 ELSE 0 END) - v_expected);

  IF p_won THEN
    v_delta := GREATEST(12, LEAST(40, round(v_raw)::int));
  ELSE
    v_delta := LEAST(-6, GREATEST(-30, round(v_raw)::int));
  END IF;

  -- Filet de perte « Bronze » : n'amortit QUE les defaites, et seulement sous
  -- le plafond du palier Bronze. Miroir de lib/trophies.bronzeLossShield.
  IF NOT p_won AND v_before < v_bronze_ceiling THEN
    IF v_before < v_division_span THEN
      -- Bronze IV : filet total, aucune perte.
      v_delta := 0;
    ELSE
      -- Bronze III/II/I : ne pas redescendre sous le seuil de la division.
      v_gate := (v_before / v_division_span) * v_division_span; -- division entiere
      v_delta := GREATEST(v_delta, v_gate - v_before);
    END IF;
  END IF;

  v_after := GREATEST(0, v_before + v_delta);
  v_best  := GREATEST(v_best, v_after);

  UPDATE public.profiles
     SET trophies = v_after, best_trophies = v_best
   WHERE id = v_user;

  INSERT INTO public.ranked_matches (user_id, won, delta, trophies, opponent)
  VALUES (v_user, p_won, v_delta, v_after, left(p_opponent_label, 80));

  RETURN jsonb_build_object(
    'before', v_before,
    'after', v_after,
    'delta', v_delta,
    'best', v_best
  );
END;
$$;

GRANT EXECUTE ON FUNCTION
  public.apply_ranked_match(BOOLEAN, INTEGER, TEXT) TO authenticated;
