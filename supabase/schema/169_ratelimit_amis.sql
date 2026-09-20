-- =============================================================================
-- Studuel — Migration 169 : anti-force-brute sur les codes amis.
--
-- PROBLÈME. Les codes amis font 6 caractères : l'espace est petit et
-- énumérable. Deux RPC `SECURITY DEFINER` grantées à `authenticated` servent
-- d'oracle de validité d'un code, sans aucune limite de débit :
--   - friend_preview(code) (163/164) → renvoie le PRÉNOM derrière un code
--     valide (NULL sinon) : un client peut scanner l'espace des codes pour
--     récolter des prénoms (app utilisée par des mineurs) ;
--   - add_friend_qr(code) (163) → renvoie 'not_found' vs 'added'/'already' :
--     oracle ENCORE plus fort, et il AUTO-CRÉE une amitié acceptée sur un code
--     valide — une énumération créerait des amitiés en masse.
--
-- CORRECTIF. Un limiteur horaire partagé (`friend_lookup_allowed`, compteur
-- par user + heure) plafonne le nombre total de recherches/ajouts par code et
-- par heure. Au-delà du quota :
--   - friend_preview renvoie NULL (le prénom ne s'affiche plus — l'ajout par
--     QR scanné légitimement reste possible, il ne dépend pas du preview) ;
--   - add_friend_qr renvoie 'not_found' (statut déjà géré par le client).
-- Le quota (40/h) est très large pour un humain (on prévisualise/ajoute une
-- poignée de codes), mais rend le balayage de l'espace des codes impraticable.
-- Signatures INCHANGÉES (aucun changement côté client requis).
--
-- PRÉREQUIS : 019 (friend_code, friendships), 163, 164. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ---------------------------------------------------- compteur de tentatives
-- Une ligne par (user, heure) : compact (le ménage des vieilles heures peut se
-- faire plus tard par cron ; le volume reste minuscule). Écrit UNIQUEMENT par
-- le limiteur `SECURITY DEFINER` : RLS activé, aucune policy pour les clients.
CREATE TABLE IF NOT EXISTS public.friend_lookup_attempts (
  user_id     UUID        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  hour_bucket TIMESTAMPTZ NOT NULL,
  attempts    INT         NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, hour_bucket)
);

ALTER TABLE public.friend_lookup_attempts ENABLE ROW LEVEL SECURITY;
-- Pas de policy : seules les fonctions definer ci-dessous y touchent.

-- ------------------------------------------------------- limiteur partagé
-- Incrémente le compteur de l'heure courante et renvoie true tant que le quota
-- n'est pas dépassé. Helper INTERNE (non granté à authenticated) : seules les
-- fonctions definer qui l'appellent (elles s'exécutent en tant que propriétaire)
-- l'utilisent.
CREATE OR REPLACE FUNCTION public.friend_lookup_allowed()
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID        := auth.uid();
  v_hour  TIMESTAMPTZ := date_trunc('hour', now());
  v_count INT;
BEGIN
  IF v_user IS NULL THEN RETURN false; END IF;

  INSERT INTO public.friend_lookup_attempts (user_id, hour_bucket, attempts)
  VALUES (v_user, v_hour, 1)
  ON CONFLICT (user_id, hour_bucket)
    DO UPDATE SET attempts = friend_lookup_attempts.attempts + 1
  RETURNING attempts INTO v_count;

  RETURN v_count <= 40; -- plafond horaire (previews + ajouts confondus)
END;
$$;

-- ------------------------------------------------------------ friend_preview
-- Passe en plpgsql VOLATILE (le compteur est un effet de bord) mais garde la
-- même signature TEXT→TEXT et le même comportement (prénom seul, cf. 164).
CREATE OR REPLACE FUNCTION public.friend_preview(p_code TEXT)
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name TEXT;
BEGIN
  IF NOT public.friend_lookup_allowed() THEN RETURN NULL; END IF;

  SELECT split_part(full_name, ' ', 1) INTO v_name
    FROM public.profiles
   WHERE friend_code = upper(trim(p_code));
  RETURN v_name;
END;
$$;

GRANT EXECUTE ON FUNCTION public.friend_preview(TEXT) TO authenticated;

-- ------------------------------------------------------------- add_friend_qr
-- Reproduction FIDÈLE de la 163 + garde de débit en tête (renvoie 'not_found'
-- au-delà du quota, statut déjà géré par le client). Le reste est identique.
CREATE OR REPLACE FUNCTION public.add_friend_qr(p_code TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_target UUID;
BEGIN
  IF v_user IS NULL THEN RETURN 'not_found'; END IF;
  -- Anti-force-brute : au-delà du quota horaire, on n'aiguille plus.
  IF NOT public.friend_lookup_allowed() THEN RETURN 'not_found'; END IF;

  SELECT id INTO v_target FROM public.profiles
   WHERE friend_code = upper(trim(p_code));
  IF v_target IS NULL THEN RETURN 'not_found'; END IF;
  IF v_target = v_user THEN RETURN 'self'; END IF;

  -- Déjà amis ? On ne touche à rien.
  IF EXISTS (
    SELECT 1 FROM public.friendships
    WHERE status = 'accepted'
      AND ((requester_id = v_user AND addressee_id = v_target)
        OR (requester_id = v_target AND addressee_id = v_user))
  ) THEN RETURN 'already'; END IF;

  -- Une demande en attente existe (dans un sens ou l'autre) : le scan la
  -- promeut en amitié — le face-à-face vaut acceptation.
  UPDATE public.friendships
     SET status = 'accepted'
   WHERE status = 'pending'
     AND ((requester_id = v_user AND addressee_id = v_target)
       OR (requester_id = v_target AND addressee_id = v_user));
  IF FOUND THEN RETURN 'added'; END IF;

  INSERT INTO public.friendships (requester_id, addressee_id, status)
  VALUES (v_user, v_target, 'accepted');
  RETURN 'added';
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_friend_qr(TEXT) TO authenticated;
