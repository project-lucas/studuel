-- =============================================================================
-- Studuel — Migration 163 : ajout d'ami par QR code (façon Clash Royale)
-- Le QR d'un élève encode l'URL /amis/ajouter/<friend_code>. Scanner ce code
-- vaut consentement mutuel (les deux téléphones sont physiquement côte à
-- côte) : l'amitié est donc créée DIRECTEMENT en 'accepted', sans passer par
-- la demande en attente de add_friend_by_code (019).
--   - add_friend_qr(code)  : crée l'amitié acceptée (ou promeut une demande
--                            en attente, dans les deux sens) ;
--   - friend_preview(code) : le prénom derrière un code, pour afficher
--                            « Deviens ami avec X » avant de confirmer.
-- PRÉREQUIS : 019 (friend_code, friendships). Idempotent.
-- =============================================================================

-- Amitié instantanée par scan. Renvoie : 'added', 'already', 'self', 'not_found'.
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

-- Prénom derrière un code ami (la RLS de profiles ne laisse pas lire les
-- autres — cette fonction expose LE minimum : le nom affiché, rien d'autre).
CREATE OR REPLACE FUNCTION public.friend_preview(p_code TEXT)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT full_name FROM public.profiles
   WHERE friend_code = upper(trim(p_code));
$$;

GRANT EXECUTE ON FUNCTION public.friend_preview(TEXT) TO authenticated;
