-- =============================================================================
-- Studuel — Migration 207 : « Saison & Pass »
--
-- Le rythme mensuel de l'app (une saison = un mois calendaire) et sa piste de
-- récompenses à deux voies. MIROIR EXACT de lib/saison.ts (barème de couronnes,
-- plafond, seuils de palier, récompenses) — toute modif se fait DES DEUX CÔTÉS.
--
-- Aucun cron : la saison est DÉRIVÉE du calendrier et son thème d'une rotation
-- déterministe sur le numéro de mois. C'est la raison pour laquelle les
-- « saisons » n'existaient pas jusqu'ici — plus besoin de job planifié.
--
-- MODÈLE ÉCONOMIQUE — « free to learn, pay to flex ».
-- La voie PRESTIGE est ouverte aux abonnés (profiles.subscription_tier <> 'free').
-- Elle ne contient QUE du cosmétique : gemmes et titres. Aucun chapitre, aucun
-- quiz, aucune fiche n'entre dans cette migration — le savoir reste gratuit.
-- La voie LIBRE paie à CHAQUE palier : un élève non abonné progresse et reçoit.
--
-- Sécurité : RLS en lecture sur ses propres lignes ; écritures par RPC
-- SECURITY DEFINER. Le barème vit côté SQL (le client envoie un nom d'événement,
-- jamais un nombre) et la contribution est plafonnée à 250 couronnes/jour.
-- La PK de season_claims interdit structurellement le double versement.
--
-- PRÉREQUIS : schema.sql (profiles, subscription_tier), 183 (profiles.gems).
-- Idempotente. À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor.
-- Astuce : sélectionne TOUT le fichier (Ctrl+A) avant de lancer.
-- =============================================================================

-- --- Colonne : le titre équipé --------------------------------------------------
-- Le titre est LA récompense cosmétique de la voie prestige : du pur texte,
-- donc zéro visuel à produire et rien de pédagogique retenu en otage.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS season_title TEXT;

-- --- Tables ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.season_progress (
  user_id    UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  season_key TEXT NOT NULL,                     -- 'YYYY-MM'
  crowns     INTEGER NOT NULL DEFAULT 0 CHECK (crowns >= 0),
  day_key    DATE,                              -- jour du dernier gain
  day_crowns INTEGER NOT NULL DEFAULT 0,        -- couronnes du jour (plafond)
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, season_key)
);

-- Une ligne par récompense encaissée. La PK (élève, saison, palier, voie) rend
-- le double versement impossible sans garde applicative à maintenir.
CREATE TABLE IF NOT EXISTS public.season_claims (
  user_id    UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  season_key TEXT NOT NULL,
  tier       INTEGER NOT NULL,
  lane       TEXT NOT NULL CHECK (lane IN ('libre', 'prestige')),
  kind       TEXT NOT NULL,
  amount     INTEGER NOT NULL DEFAULT 0,
  title      TEXT,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, season_key, tier, lane)
);

-- --- RLS -------------------------------------------------------------------------

ALTER TABLE public.season_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.season_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS season_progress_select_own ON public.season_progress;
CREATE POLICY season_progress_select_own ON public.season_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS season_claims_select_own ON public.season_claims;
CREATE POLICY season_claims_select_own ON public.season_claims
  FOR SELECT USING (auth.uid() = user_id);

-- --- Helpers ---------------------------------------------------------------------

-- La clé de saison d'une date : 'YYYY-MM'.
CREATE OR REPLACE FUNCTION public.season_key_of(p_day DATE)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$ SELECT to_char(p_day, 'YYYY-MM') $$;

-- La voie prestige est-elle ouverte ? MIROIR de la règle produit : elle l'est
-- pour tout abonné. Elle ne donne accès à AUCUN contenu pédagogique.
CREATE OR REPLACE FUNCTION public.season_has_pass(p_user UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT subscription_tier <> 'free' FROM public.profiles WHERE id = p_user),
    FALSE)
$$;

-- Couronnes nécessaires pour ATTEINDRE un palier (MIROIR de crownsForTier).
CREATE OR REPLACE FUNCTION public.season_crowns_for_tier(p_tier INTEGER)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$ SELECT GREATEST(0, p_tier - 1) * 220 $$;

-- Palier atteint (MIROIR de tierFor), plafonné à 30.
CREATE OR REPLACE FUNCTION public.season_tier_for(p_crowns INTEGER)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$ SELECT LEAST(30, GREATEST(0, p_crowns) / 220 + 1) $$;

-- --- RPC : gagner des couronnes ---------------------------------------------------
-- MIROIR de lib/saison.CROWNS + DAILY_CROWN_CAP. Renvoie ce qui a RÉELLEMENT
-- été crédité (0 au plafond, ou sur un événement inconnu).
CREATE OR REPLACE FUNCTION public.season_add_crowns(p_event TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_season TEXT;
  v_base   INTEGER;
  v_done   INTEGER := 0;
  v_gain   INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN 0; END IF;

  v_base := CASE p_event
    WHEN 'duel_play'     THEN 10
    WHEN 'duel_win'      THEN 15
    WHEN 'quest_done'    THEN 20
    WHEN 'quest_day'     THEN 50
    WHEN 'session_prepa' THEN 30
    WHEN 'clan_week'     THEN 100
    ELSE 0
  END;
  IF v_base = 0 THEN RETURN 0; END IF;

  v_season := public.season_key_of(v_today);

  SELECT CASE WHEN day_key = v_today THEN day_crowns ELSE 0 END
    INTO v_done
    FROM public.season_progress
   WHERE user_id = v_user AND season_key = v_season;

  v_gain := LEAST(v_base, GREATEST(0, 250 - COALESCE(v_done, 0)));
  IF v_gain = 0 THEN RETURN 0; END IF;

  INSERT INTO public.season_progress
    (user_id, season_key, crowns, day_key, day_crowns, updated_at)
  VALUES (v_user, v_season, v_gain, v_today, v_gain, now())
  ON CONFLICT (user_id, season_key) DO UPDATE
    SET crowns = public.season_progress.crowns + v_gain,
        -- Le compteur du plafond repart à zéro au changement de jour.
        day_crowns = CASE
          WHEN public.season_progress.day_key = v_today
          THEN public.season_progress.day_crowns + v_gain
          ELSE v_gain END,
        day_key = v_today,
        updated_at = now();

  RETURN v_gain;
END;
$$;

REVOKE ALL ON FUNCTION public.season_add_crowns(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.season_add_crowns(TEXT) TO authenticated;

-- --- RPC : l'état de la saison ----------------------------------------------------
-- Forme JSONB miroir de lib/saison.normalizeSeasonState.
CREATE OR REPLACE FUNCTION public.season_state()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_season TEXT;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  v_season := public.season_key_of((now() AT TIME ZONE 'utc')::date);

  RETURN jsonb_build_object(
    'season_key', v_season,
    'crowns', COALESCE((
      SELECT crowns FROM public.season_progress
       WHERE user_id = v_user AND season_key = v_season), 0),
    'has_pass', public.season_has_pass(v_user),
    'claimed', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('tier', tier, 'lane', lane))
        FROM public.season_claims
       WHERE user_id = v_user AND season_key = v_season), '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.season_state() TO authenticated;

-- --- RPC : encaisser un palier ----------------------------------------------------
-- MIROIR de lib/saison.rewardFor. Le client annonce (palier, voie) ; le serveur
-- vérifie que le palier est ATTEINT, que la voie est ouverte, calcule LUI-MÊME
-- la récompense, et la PK empêche de la reprendre.
-- Renvoie { claimed, kind, amount, title }.
CREATE OR REPLACE FUNCTION public.season_claim(p_tier INTEGER, p_lane TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_season  TEXT;
  v_crowns  INTEGER := 0;
  v_kind    TEXT;
  v_amount  INTEGER := 0;
  v_title   TEXT;
  -- MIROIR de lib/saison.TITLES, à l'apostrophe TYPOGRAPHIQUE près (’ et non
  -- '') : le titre écrit en base doit être strictement égal à celui que la
  -- piste affiche, sinon deux graphies du même titre coexistent à l'écran.
  v_titles  TEXT[] := ARRAY['Recrue', 'Assidu·e', 'Tête chercheuse', 'Métronome',
                            'Sans faute', 'Bourreau de travail',
                            'Légende de l’arène'];
  v_none    JSONB := jsonb_build_object('claimed', FALSE, 'kind', NULL,
                                        'amount', 0, 'title', NULL);
BEGIN
  IF v_user IS NULL THEN RETURN v_none; END IF;
  IF p_tier IS NULL OR p_tier < 1 OR p_tier > 30 THEN RETURN v_none; END IF;
  IF p_lane NOT IN ('libre', 'prestige') THEN RETURN v_none; END IF;
  -- La voie prestige exige l'abonnement, vérifié CÔTÉ SERVEUR.
  IF p_lane = 'prestige' AND NOT public.season_has_pass(v_user) THEN
    RETURN v_none;
  END IF;

  v_season := public.season_key_of((now() AT TIME ZONE 'utc')::date);

  SELECT COALESCE(crowns, 0) INTO v_crowns
    FROM public.season_progress
   WHERE user_id = v_user AND season_key = v_season;

  -- Palier réellement atteint ? Le client ne décide pas de sa progression.
  IF public.season_tier_for(COALESCE(v_crowns, 0)) < p_tier THEN RETURN v_none; END IF;

  IF p_lane = 'libre' THEN
    v_kind := 'gemmes';
    v_amount := CASE WHEN p_tier % 5 = 0 THEN 15 ELSE 5 END;
  ELSIF p_tier % 5 = 0 THEN
    v_kind := 'titre';
    v_amount := 1;
    v_title := v_titles[LEAST(array_length(v_titles, 1), p_tier / 5)];
  ELSE
    v_kind := 'gemmes';
    v_amount := 20;
  END IF;

  INSERT INTO public.season_claims
    (user_id, season_key, tier, lane, kind, amount, title)
  VALUES (v_user, v_season, p_tier, p_lane, v_kind, v_amount, v_title)
  ON CONFLICT (user_id, season_key, tier, lane) DO NOTHING;
  IF NOT FOUND THEN RETURN v_none; END IF;

  IF v_kind = 'gemmes' THEN
    UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_amount
     WHERE id = v_user;
  ELSE
    -- Le titre s'équipe tout de suite : une récompense qu'il faut aller
    -- chercher dans un menu n'est pas une récompense.
    UPDATE public.profiles SET season_title = v_title WHERE id = v_user;
  END IF;

  RETURN jsonb_build_object('claimed', TRUE, 'kind', v_kind,
                            'amount', v_amount, 'title', v_title);
END;
$$;

REVOKE ALL ON FUNCTION public.season_claim(INTEGER, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.season_claim(INTEGER, TEXT) TO authenticated;

-- --- Vérifications (connecté en tant qu'élève) -----------------------------------
--   select public.season_add_crowns('duel_play');   → 10 (0 une fois au plafond)
--   select public.season_state();                    → JSONB crowns/has_pass
--   select public.season_claim(1, 'libre');          → claimed=true, 5 gemmes
--   select public.season_claim(1, 'libre');          → claimed=false (déjà pris)
--   select public.season_claim(30, 'libre');         → claimed=false (pas atteint)
--   select public.season_claim(5, 'prestige');       → claimed=false si non abonné
