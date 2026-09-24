-- =============================================================================
-- Studuel — Migration 378 : LES CRÉDITS MENSUELS DE MARCEL ET L'AVATAR DESSINÉ
--
-- Lucas, 24/09/2026 : « changer son avatar via Nano Banana, avec un prompt à
-- Marcel ; cela consomme ses crédits, autant de fois que ses crédits mensuels
-- le permettent ». Décisions : 200 crédits par mois pour Studuel+, une question
-- = 1 crédit, un avatar = 25 ; rien pour le gratuit (« pas de Marcel pour le
-- gratuit »).
--
-- CE QU'ELLE INSTALLE.
--   1. `coach_credits` — les crédits dépensés, par élève et par mois ;
--   2. `coach_ask_allowed` RÉÉCRITE — la porte de Marcel passe du quota du jour
--      aux crédits du mois (le plafond ABSOLU de 50 appels par jour reste : une
--      limite de facture) ; le gratuit reçoit « abonnement » ; les jetons de
--      Prof (215) restent une rallonge pour l'abonné ;
--   3. `avatars_ia` — les avatars dessinés (l'image en base, ~50 Ko en WebP) ;
--   4. `avatar_ia_reserver` / `_terminer` / `_echec` / `_appliquer` / `_image`
--      / `_mes` et `credits_etat`.
--
-- ⚠️ LA SIGNATURE. Le serveur n'utilise que la clé anonyme : tout ce que la
-- route peut faire, l'élève le peut aussi avec son jeton. Sans garde, il
-- déposerait n'importe quelle image comme avatar — vue par les autres élèves
-- de sa ligue. L'image n'est donc acceptée que SIGNÉE : HMAC-SHA256 de
-- « <job>.<image en base64> » avec un secret que seuls la route (variable
-- AVATAR_IA_SECRET) et la base (table `avatars_ia_cle`, sans aucun accès)
-- connaissent. À INSÉRER UNE FOIS, à la main, la même valeur que sur Vercel :
--   INSERT INTO public.avatars_ia_cle (cle) VALUES ('<AVATAR_IA_SECRET>')
--     ON CONFLICT (id) DO UPDATE SET cle = EXCLUDED.cle;
-- Tant qu'elle manque, `avatar_ia_reserver` répond « indisponible » et aucun
-- crédit n'est dépensé.
--
-- Miroir applicatif : lib/coach/credits.ts (montants), lib/avatar-ia.ts.
-- PRÉREQUIS : 215 (coach_calls, coach_tokens), extension pgcrypto (installée
-- par défaut sur Supabase, schéma `extensions`). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ───────────────────────────────────────────────── 1. les crédits du mois

CREATE TABLE IF NOT EXISTS public.coach_credits (
  user_id  UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  mois     DATE NOT NULL,
  depenses INT  NOT NULL DEFAULT 0 CHECK (depenses >= 0),
  PRIMARY KEY (user_id, mois)
);
ALTER TABLE public.coach_credits ENABLE ROW LEVEL SECURITY;
-- L'élève LIT son compteur (« il te reste 175 crédits ») ; seules les
-- fonctions ci-dessous l'écrivent.
DROP POLICY IF EXISTS coach_credits_select_own ON public.coach_credits;
CREATE POLICY coach_credits_select_own ON public.coach_credits
  FOR SELECT USING (user_id = (SELECT auth.uid()));
REVOKE INSERT, UPDATE, DELETE ON public.coach_credits FROM anon, authenticated;

-- Le 1er du mois courant (UTC).
CREATE OR REPLACE FUNCTION public.coach_credits_mois()
RETURNS DATE
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT date_trunc('month', now() AT TIME ZONE 'utc')::date;
$$;

-- Les crédits offerts chaque mois : 200 pour Studuel+, rien pour le gratuit.
CREATE OR REPLACE FUNCTION public.coach_credits_mensuels(p_user UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE WHEN p.subscription_tier IN ('tier1', 'tier2', 'tier3') THEN 200 ELSE 0 END
    FROM public.profiles p WHERE p.id = p_user;
$$;

-- Dépense `p_cout` crédits du mois, si le solde le permet. Le UPDATE
-- conditionnel est le verrou : deux demandes simultanées ne dépensent jamais
-- le même crédit.
CREATE OR REPLACE FUNCTION public.coach_credits_depenser(p_user UUID, p_cout INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_mois     DATE := public.coach_credits_mois();
  v_mensuels INTEGER := COALESCE(public.coach_credits_mensuels(p_user), 0);
BEGIN
  IF p_cout IS NULL OR p_cout <= 0 OR v_mensuels <= 0 THEN RETURN FALSE; END IF;
  INSERT INTO public.coach_credits (user_id, mois, depenses)
  VALUES (p_user, v_mois, 0)
  ON CONFLICT (user_id, mois) DO NOTHING;
  UPDATE public.coach_credits
     SET depenses = depenses + p_cout
   WHERE user_id = p_user AND mois = v_mois AND depenses + p_cout <= v_mensuels;
  RETURN FOUND;
END;
$$;

-- Rend des crédits dépensés (un avatar que le modèle n'a pas pu dessiner).
CREATE OR REPLACE FUNCTION public.coach_credits_rendre(p_user UUID, p_mois DATE, p_cout INTEGER)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.coach_credits
     SET depenses = GREATEST(0, depenses - GREATEST(0, p_cout))
   WHERE user_id = p_user AND mois = p_mois;
$$;

-- ─────────────────────────────────────── 2. la porte de Marcel, réécrite

-- Rend : 'credit' (payé sur les crédits du mois), 'jeton' (sur un jeton de
-- Prof), 'abonnement' (gratuit : Marcel fait partie de Studuel+), 'plafond'
-- (limite de facture du jour), 'refuse' (plus rien).
CREATE OR REPLACE FUNCTION public.coach_ask_allowed(p_kind TEXT DEFAULT 'question')
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_day     DATE := (now() AT TIME ZONE 'utc')::date;
  v_count   INT;
  v_tokens  INT;
  v_plafond CONSTANT INT := 50;
BEGIN
  IF v_user IS NULL THEN RETURN 'refuse'; END IF;
  IF p_kind IS NULL OR length(p_kind) > 40 THEN RETURN 'refuse'; END IF;

  IF COALESCE(public.coach_credits_mensuels(v_user), 0) <= 0 THEN RETURN 'abonnement'; END IF;

  -- Le compteur du jour monte AVANT la réponse, refus compris (leçon de la 198).
  INSERT INTO public.coach_calls (user_id, day_bucket, attempts)
  VALUES (v_user, v_day, 1)
  ON CONFLICT (user_id, day_bucket)
    DO UPDATE SET attempts = coach_calls.attempts + 1
  RETURNING attempts INTO v_count;
  IF v_count > v_plafond THEN RETURN 'plafond'; END IF;

  IF public.coach_credits_depenser(v_user, 1) THEN RETURN 'credit'; END IF;

  UPDATE public.coach_tokens
     SET balance = balance - 1, updated_at = now()
   WHERE user_id = v_user AND balance > 0
  RETURNING balance INTO v_tokens;
  IF FOUND THEN RETURN 'jeton'; END IF;

  RETURN 'refuse';
END;
$$;

-- L'état des crédits, pour l'affichage (« il te reste 175 crédits »).
CREATE OR REPLACE FUNCTION public.credits_etat()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_mois     DATE := public.coach_credits_mois();
  v_mensuels INTEGER;
  v_depenses INTEGER;
  v_jetons   INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  v_mensuels := COALESCE(public.coach_credits_mensuels(v_user), 0);
  SELECT c.depenses INTO v_depenses FROM public.coach_credits c WHERE c.user_id = v_user AND c.mois = v_mois;
  SELECT t.balance INTO v_jetons FROM public.coach_tokens t WHERE t.user_id = v_user;
  RETURN jsonb_build_object(
    'mois', v_mois,
    'mensuels', v_mensuels,
    'depenses', COALESCE(v_depenses, 0),
    'restants', GREATEST(0, v_mensuels - COALESCE(v_depenses, 0)),
    'jetons', COALESCE(v_jetons, 0));
END;
$$;

-- ─────────────────────────────────────────────── 3. les avatars dessinés

CREATE TABLE IF NOT EXISTS public.avatars_ia (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  demande    TEXT NOT NULL CHECK (char_length(demande) BETWEEN 3 AND 200),
  statut     TEXT NOT NULL DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'termine', 'echec')),
  mois       DATE NOT NULL,
  image      BYTEA,
  cree_le    TIMESTAMPTZ NOT NULL DEFAULT now(),
  termine_le TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS avatars_ia_user_cree_idx ON public.avatars_ia (user_id, cree_le DESC);
ALTER TABLE public.avatars_ia ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.avatars_ia FROM anon, authenticated;

-- Le secret de signature : une ligne, aucun accès (voir l'en-tête).
CREATE TABLE IF NOT EXISTS public.avatars_ia_cle (
  id  BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
  cle TEXT NOT NULL CHECK (char_length(cle) >= 32)
);
ALTER TABLE public.avatars_ia_cle ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.avatars_ia_cle FROM anon, authenticated;

-- Réserve un dessin : vérifie l'abonnement, le plafond du jour (5), la
-- configuration, puis dépense 25 crédits. Rend le job à dessiner, ou la raison
-- du refus — AVANT tout appel au modèle.
CREATE OR REPLACE FUNCTION public.avatar_ia_reserver(p_demande TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_user    UUID := auth.uid();
  v_demande TEXT := btrim(regexp_replace(COALESCE(p_demande, ''), '\s+', ' ', 'g'));
  v_jour    INTEGER;
  v_job     UUID;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('ok', false, 'raison', 'connexion'); END IF;
  IF char_length(v_demande) < 3 OR char_length(v_demande) > 200 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'demande');
  END IF;
  IF COALESCE(public.coach_credits_mensuels(v_user), 0) <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'abonnement');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.avatars_ia_cle) THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'indisponible');
  END IF;
  SELECT count(*) INTO v_jour
    FROM public.avatars_ia a
   WHERE a.user_id = v_user AND a.cree_le >= date_trunc('day', now() AT TIME ZONE 'utc') AT TIME ZONE 'utc';
  IF v_jour >= 5 THEN RETURN jsonb_build_object('ok', false, 'raison', 'plafond'); END IF;
  IF NOT public.coach_credits_depenser(v_user, 25) THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'credits');
  END IF;
  INSERT INTO public.avatars_ia (user_id, demande, mois)
  VALUES (v_user, v_demande, public.coach_credits_mois())
  RETURNING id INTO v_job;
  RETURN jsonb_build_object('ok', true, 'job', v_job);
END;
$$;

-- Dépose l'image dessinée, SIGNÉE par la route. Refuse une image non signée,
-- trop lourde, ou un job qui n'est plus à dessiner.
CREATE OR REPLACE FUNCTION public.avatar_ia_terminer(p_job UUID, p_image TEXT, p_signature TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
#variable_conflict use_column
DECLARE
  v_user   UUID := auth.uid();
  v_cle    TEXT;
  v_octets BYTEA;
BEGIN
  IF v_user IS NULL OR p_job IS NULL OR p_image IS NULL OR p_signature IS NULL THEN RETURN FALSE; END IF;
  SELECT k.cle INTO v_cle FROM public.avatars_ia_cle k;
  IF v_cle IS NULL THEN RETURN FALSE; END IF;
  IF encode(hmac(p_job::text || '.' || p_image, v_cle, 'sha256'), 'hex') <> lower(p_signature) THEN
    RETURN FALSE;
  END IF;
  v_octets := decode(p_image, 'base64');
  IF octet_length(v_octets) > 600000 THEN RETURN FALSE; END IF;
  UPDATE public.avatars_ia
     SET image = v_octets, statut = 'termine', termine_le = now()
   WHERE id = p_job AND user_id = v_user AND statut = 'en_cours'
     AND cree_le > now() - interval '10 minutes';
  RETURN FOUND;
END;
$$;

-- Le modèle n'a pas dessiné (refus de sécurité, panne) : le job échoue et ses
-- 25 crédits reviennent. Une fois, sur un job encore en cours.
CREATE OR REPLACE FUNCTION public.avatar_ia_echec(p_job UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_user UUID := auth.uid();
  v_mois DATE;
BEGIN
  UPDATE public.avatars_ia
     SET statut = 'echec', termine_le = now()
   WHERE id = p_job AND user_id = v_user AND statut = 'en_cours'
  RETURNING mois INTO v_mois;
  IF NOT FOUND THEN RETURN FALSE; END IF;
  PERFORM public.coach_credits_rendre(v_user, v_mois, 25);
  RETURN TRUE;
END;
$$;

-- « Garder cet avatar » : le portrait de l'élève devient `ia:<job>`.
CREATE OR REPLACE FUNCTION public.avatar_ia_appliquer(p_job UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.avatars_ia a
     WHERE a.id = p_job AND a.user_id = v_user AND a.statut = 'termine'
  ) THEN
    RETURN FALSE;
  END IF;
  UPDATE public.profiles
     SET avatar = jsonb_set(COALESCE(avatar, '{}'::jsonb), '{portrait}', to_jsonb('ia:' || p_job::text))
   WHERE id = v_user;
  RETURN TRUE;
END;
$$;

-- L'image d'un avatar dessiné, en base64 — publique : elle s'affiche dans les
-- listes des autres élèves (ligue, amis). Seulement un dessin terminé.
CREATE OR REPLACE FUNCTION public.avatar_ia_image(p_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT encode(a.image, 'base64') FROM public.avatars_ia a
   WHERE a.id = p_id AND a.statut = 'termine' AND a.image IS NOT NULL;
$$;

-- Mes derniers avatars dessinés (la galerie de la feuille).
CREATE OR REPLACE FUNCTION public.avatar_ia_mes()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(jsonb_agg(jsonb_build_object('id', t.id, 'demande', t.demande, 'cree_le', t.cree_le)
                            ORDER BY t.cree_le DESC), '[]'::jsonb)
    FROM (SELECT a.id, a.demande, a.cree_le FROM public.avatars_ia a
           WHERE a.user_id = (SELECT auth.uid()) AND a.statut = 'termine'
           ORDER BY a.cree_le DESC LIMIT 12) t;
$$;

-- ─────────────────────────────────────────────────────────────── 4. droits

REVOKE ALL ON FUNCTION public.coach_credits_mois() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.coach_credits_mensuels(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.coach_credits_depenser(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.coach_credits_rendre(UUID, DATE, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.coach_ask_allowed(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.credits_etat() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.avatar_ia_reserver(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.avatar_ia_terminer(UUID, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.avatar_ia_echec(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.avatar_ia_appliquer(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.avatar_ia_image(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.avatar_ia_mes() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.coach_ask_allowed(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.credits_etat() TO authenticated;
GRANT EXECUTE ON FUNCTION public.avatar_ia_reserver(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.avatar_ia_terminer(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.avatar_ia_echec(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.avatar_ia_appliquer(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.avatar_ia_mes() TO authenticated;
-- L'image s'affiche aussi à un visiteur (aperçu de ligue) : publique.
GRANT EXECUTE ON FUNCTION public.avatar_ia_image(UUID) TO anon, authenticated;
