-- =============================================================================
-- Studuel — Migration 173 : rate-limit de add_friend_by_code (cohérence 169).
--
-- La 169 a fermé les oracles de validité de code friend_preview et add_friend_qr
-- (limiteur horaire partagé friend_lookup_allowed, 40/h). La 172 a fait de même
-- pour link_child_by_code. Il reste UN oracle de la même famille non borné :
-- add_friend_by_code (019) — renvoie des statuts distinguables ('sent' | 'already'
-- | 'self' | 'not_found') selon qu'un code existe ou non, sans aucune limite de
-- débit. Impact PLUS FAIBLE que les autres (un succès ne crée qu'une DEMANDE en
-- attente, sans exposition de données tant que la cible n'a pas accepté), mais on
-- l'aligne sur la même doctrine par cohérence : plus aucun oracle de code n'est
-- interrogeable en boucle pour énumérer les codes à 6 caractères valides.
--
-- Reproduction FIDÈLE de la 019 + garde de débit en tête (renvoie 'not_found'
-- au-delà du quota, indistinct d'un code inexistant). Signature TEXT→TEXT
-- inchangée (le client ne change pas).
--
-- PRÉREQUIS : 019 (add_friend_by_code), 169 (friend_lookup_allowed). Idempotent
-- (CREATE OR REPLACE). À exécuter à la main : Supabase Dashboard → SQL Editor.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.add_friend_by_code(p_code TEXT)
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
  -- Anti-force-brute : au-delà du quota horaire partagé (169), on n'aiguille plus.
  IF NOT public.friend_lookup_allowed() THEN RETURN 'not_found'; END IF;

  SELECT id INTO v_target FROM public.profiles
   WHERE friend_code = upper(trim(p_code));
  IF v_target IS NULL THEN RETURN 'not_found'; END IF;
  IF v_target = v_user THEN RETURN 'self'; END IF;

  IF EXISTS (
    SELECT 1 FROM public.friendships
    WHERE (requester_id = v_user AND addressee_id = v_target)
       OR (requester_id = v_target AND addressee_id = v_user)
  ) THEN RETURN 'already'; END IF;

  INSERT INTO public.friendships (requester_id, addressee_id)
  VALUES (v_user, v_target);
  RETURN 'sent';
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_friend_by_code(TEXT) TO authenticated;
