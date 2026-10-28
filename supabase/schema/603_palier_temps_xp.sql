-- Studuel — Migration 603 : LES CAPS DE RAPIDITÉ d'un palier (26/10/2026).
--
-- Lucas : « en dessous il faut rappeler le précédent record de temps sur ce
-- palier et j'imagine une barre horizontale qui montrerait où il se situe sur
-- l'ensemble des users en terme de temps pour réussir le palier ; chaque
-- palier atteint (top 50 %, top 30, top 15, top 5 %…) serait du gain d'XP ;
-- inciter à battre chaque précédent record de temps ».
--
-- LA PLACE existe déjà : la 313 range le meilleur temps de bouclage d'un
-- (jeu, palier) et rend le rang et le total (`record_palier_time`,
-- `palier_standings`). Cette migration y ajoute CE QUE LA PLACE PAIE : cinq
-- caps — top 50 %, 30 %, 15 %, 5 %, 1 % des joueurs — et, pour chacun, de
-- l'XP versée UNE FOIS POUR TOUTES par `wallet_grant_xp` (clé
-- `<jeu>:<palier>:<cap>`, source `palier_temps`). Un cap franchi ne se reperd
-- jamais, même si d'autres joueurs deviennent plus rapides ensuite : comme
-- l'étoile d'un palier, c'est acquis.
--
-- CE QUI NE SE PAIE PAS. En dessous de DIX joueurs classés sur le palier, un
-- « top 1 % » ne désigne personne et « top 50 % » bougerait au premier copain
-- qui joue : rien ne se verse, la barre montre seulement la place. MIROIR de
-- `COHORTE_MIN_SEUILS_TEMPS` (lib/economie). Le cap se juge en entiers, sans
-- arrondi : rang × 100 ≤ cap × total.
--
-- LE BARÈME (`palier_temps_xp`, miroir de `xpSeuilTemps`) : 5 · 10 · 15 · 25 ·
-- 40 XP — 95 XP par palier, 475 par jeu, à comparer aux 225 XP des étoiles.
-- Le multiplicateur d'amis et la potion (380) s'appliquent dans wallet_grant_xp.
--
-- DEUX RPC pour les écrans :
--   · `palier_temps_enregistrer(jeu, palier, ms)` — fin de partie gagnée : le
--     temps par `record_palier_time` (313), puis chaque cap franchi payé ; rend
--     la place (palier, best_ms, rank, total) + `xp` (ce que CET appel a versé)
--     + `seuils` (les caps déjà payés). Remplace l'appel direct à la 313 dans
--     app/defi/palier-actions.ts (repli sur elle tant que la 603 manque).
--   · `palier_temps_etat(jeu)` — la carte du jeu : les places de
--     `palier_standings` + les caps payés, palier par palier.
--
-- Idempotente. À EXÉCUTER À LA MAIN dans le SQL Editor, après la 602.
-- Astuce : sélectionne TOUT le fichier (Ctrl+A) avant de lancer.
--
-- TANT QU'ELLE N'EST PAS EXÉCUTÉE, l'app fonctionne : la fin de partie retombe
-- sur record_palier_time, la carte sur palier_standings ; la barre s'affiche
-- sans cap payé, aucune XP de cap n'est versée. Rien ne casse.

-- ──────────────────────────────── 1. la source `palier_temps` dans xp_events

-- Même recette que la 602 : on relit la contrainte, on ajoute ce qui manque,
-- on la repose. Idempotent (rien ne bouge si la source y est déjà).
DO $$
DECLARE
  v_nom     TEXT := 'xp_events_source_check';
  v_def     TEXT;
  v_sources TEXT[];
  v_neuves  TEXT[] := ARRAY['palier_temps'];
  v_s       TEXT;
BEGIN
  SELECT pg_get_constraintdef(c.oid) INTO v_def
    FROM pg_constraint c
   WHERE c.conname = v_nom
     AND c.conrelid = 'public.xp_events'::regclass;
  IF v_def IS NULL THEN RETURN; END IF;
  SELECT array_agg(DISTINCT btrim(s)) INTO v_sources
    FROM regexp_matches(v_def, '''([^'']+)''', 'g') AS m,
         LATERAL unnest(string_to_array(btrim(m[1], '{}'), ',')) AS s
   WHERE btrim(s) <> '';
  v_sources := COALESCE(v_sources, ARRAY[]::TEXT[]);
  IF v_neuves <@ v_sources THEN RETURN; END IF;
  FOREACH v_s IN ARRAY v_neuves LOOP
    IF NOT (v_s = ANY (v_sources)) THEN v_sources := array_append(v_sources, v_s); END IF;
  END LOOP;
  EXECUTE format('ALTER TABLE public.xp_events DROP CONSTRAINT %I', v_nom);
  EXECUTE format('ALTER TABLE public.xp_events ADD CONSTRAINT %I CHECK (source IN (%s))',
                 v_nom,
                 (SELECT string_agg(quote_literal(x), ', ' ORDER BY x) FROM unnest(v_sources) x));
END $$;

-- ──────────────────────────────────────────────── 2. le barème des caps

-- MIROIR de lib/economie.xpSeuilTemps (vérifié par lib/economie.test.ts).
CREATE OR REPLACE FUNCTION public.palier_temps_xp(p_seuil INTEGER)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE p_seuil
    WHEN 50 THEN 5
    WHEN 30 THEN 10
    WHEN 15 THEN 15
    WHEN 5  THEN 25
    WHEN 1  THEN 40
    ELSE 0
  END;
$$;

REVOKE ALL ON FUNCTION public.palier_temps_xp(INTEGER) FROM PUBLIC, anon, authenticated;

-- ─────────────────────────────── 3. les caps déjà payés d'un (jeu, palier)

-- Lus dans la trace d'XP elle-même (clé `<jeu>:<palier>:<cap>`) : pas de table
-- de plus pour redire ce que xp_events sait déjà. Du plus large au plus serré.
CREATE OR REPLACE FUNCTION public.palier_temps_seuils_payes(p_user UUID, p_game_id TEXT, p_palier INTEGER)
RETURNS INTEGER[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    array_agg(split_part(e.source_key, ':', 3)::INTEGER
              ORDER BY split_part(e.source_key, ':', 3)::INTEGER DESC),
    ARRAY[]::INTEGER[])
    FROM public.xp_events e
   WHERE e.user_id = p_user
     AND e.source = 'palier_temps'
     AND split_part(e.source_key, ':', 1) = p_game_id
     AND split_part(e.source_key, ':', 2) = p_palier::TEXT
     AND split_part(e.source_key, ':', 3) ~ '^[0-9]+$';
$$;

REVOKE ALL ON FUNCTION public.palier_temps_seuils_payes(UUID, TEXT, INTEGER) FROM PUBLIC, anon, authenticated;

-- ──────────────────────────── 4. enregistrer : le temps (313) puis les caps

CREATE OR REPLACE FUNCTION public.palier_temps_enregistrer(
  p_game_id TEXT,
  p_palier  SMALLINT,
  p_ms      INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_place JSONB;
  v_rank  INTEGER;
  v_total INTEGER;
  v_avant INTEGER;
  v_apres INTEGER;
  v_seuil INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  -- La 313 juge et range le temps (bornes, catalogue, LEAST du record) et
  -- rend la place qu'il donne ; un refus (NULL) est un refus ici aussi.
  v_place := public.record_palier_time(p_game_id, p_palier, p_ms);
  IF v_place IS NULL THEN RETURN NULL; END IF;
  v_rank  := (v_place ->> 'rank')::INTEGER;
  v_total := (v_place ->> 'total')::INTEGER;

  -- Les verrous dans le MÊME ORDRE que palier_gemmes_reclamer (557) : le
  -- profil, puis le portefeuille — les deux RPC partent ensemble à la fin
  -- d'une partie gagnée, sinon elles s'interbloqueraient.
  PERFORM 1 FROM public.profiles WHERE id = v_user FOR UPDATE;
  PERFORM public.wallet_ensure(v_user);
  SELECT xp INTO v_avant FROM public.user_wallet WHERE user_id = v_user;

  -- Dix joueurs classés au moins (miroir de COHORTE_MIN_SEUILS_TEMPS), puis
  -- chaque cap franchi — rang × 100 ≤ cap × total — payé une fois pour toutes
  -- (clé unique : un cap déjà payé ne repaie rien, wallet_grant_xp s'arrête).
  IF COALESCE(v_total, 0) >= 10 AND COALESCE(v_rank, 0) >= 1 THEN
    FOREACH v_seuil IN ARRAY ARRAY[50, 30, 15, 5, 1] LOOP
      IF v_rank * 100 <= v_seuil * v_total THEN
        PERFORM public.wallet_grant_xp(
          v_user, 'palier_temps',
          p_game_id || ':' || p_palier || ':' || v_seuil,
          public.palier_temps_xp(v_seuil));
      END IF;
    END LOOP;
  END IF;

  SELECT xp INTO v_apres FROM public.user_wallet WHERE user_id = v_user;
  RETURN v_place || jsonb_build_object(
    'xp',     GREATEST(0, COALESCE(v_apres, 0) - COALESCE(v_avant, 0)),
    'seuils', to_jsonb(public.palier_temps_seuils_payes(v_user, p_game_id, p_palier)));
END;
$$;

REVOKE ALL ON FUNCTION public.palier_temps_enregistrer(TEXT, SMALLINT, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.palier_temps_enregistrer(TEXT, SMALLINT, INTEGER) TO authenticated;

-- ───────────────────────────── 5. l'état d'un jeu : les places + les caps

CREATE OR REPLACE FUNCTION public.palier_temps_etat(p_game_id TEXT)
RETURNS TABLE (
  palier  SMALLINT,
  best_ms INTEGER,
  rank    INTEGER,
  total   INTEGER,
  seuils  INTEGER[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.palier, s.best_ms, s.rank, s.total,
         public.palier_temps_seuils_payes(auth.uid(), p_game_id, s.palier)
    FROM public.palier_standings(p_game_id) s;
$$;

REVOKE ALL ON FUNCTION public.palier_temps_etat(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.palier_temps_etat(TEXT) TO authenticated;
