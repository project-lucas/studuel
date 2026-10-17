-- =============================================================================
-- 595 — Studuel+ par le coach : 20 places par groupe (17/10/2026)
--
-- Lucas (17/10/2026), après la 594 : « le code doit être limité à 20 users en
-- Studuel+ ». Un code qui circule hors de l'équipe ne doit pas ouvrir
-- Studuel+ à n'importe qui.
--
--   · `rattachement_par_code` (594) est redéfinie : l'octroi de Studuel+ n'a
--     lieu que si le GROUPE a donné moins de 20 octrois 'coach' (comptés dans
--     `subscription_grants`, référence = le groupe). « Nouveau code » garde le
--     même groupe, donc le même compteur.
--   · Au-delà, le joueur REJOINT quand même le groupe (le coach le suit), mais
--     reste gratuit — Lucas l'accorde à la main s'il le veut.
--   · La ligne du groupe est verrouillée le temps du rattachement : deux
--     inscriptions simultanées à 19 n'en font pas 21.
--
-- PRÉREQUIS : 594. Idempotente (CREATE OR REPLACE).
-- À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.rattachement_par_code(p_code TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  -- 595 : places Studuel+ offertes par groupe.
  c_places CONSTANT INTEGER := 20;
  v_uid    UUID := auth.uid();
  v_code   TEXT := upper(regexp_replace(COALESCE(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
  v_groupe UUID;
  v_type   TEXT;
BEGIN
  IF v_uid IS NULL THEN RETURN 'introuvable'; END IF;
  SELECT profile_type INTO v_type FROM public.profiles WHERE id = v_uid;
  IF v_type IN ('coach', 'parent') THEN RETURN 'coach'; END IF;
  IF v_code !~ '^[A-Z0-9]{8}$' THEN RETURN 'introuvable'; END IF;

  -- FOR UPDATE : les rattachements d'un même groupe passent un par un.
  SELECT id INTO v_groupe FROM public.coach_groupes
   WHERE code = v_code AND archive_le IS NULL
   FOR UPDATE;
  IF v_groupe IS NULL THEN RETURN 'introuvable'; END IF;

  IF EXISTS (
    SELECT 1 FROM public.coach_membres
     WHERE groupe_id = v_groupe AND eleve_id = v_uid AND statut = 'actif'
  ) THEN RETURN 'deja'; END IF;

  -- Un seul rattachement actif : on quitte l'ancien groupe.
  UPDATE public.coach_membres
     SET statut = 'revoque', revoque_le = now(), revoque_par = 'eleve'
   WHERE eleve_id = v_uid AND statut = 'actif';

  INSERT INTO public.coach_membres (groupe_id, eleve_id, statut, rattache_le, revoque_le, revoque_par)
  VALUES (v_groupe, v_uid, 'actif', now(), NULL, NULL)
  ON CONFLICT (groupe_id, eleve_id) DO UPDATE
     SET statut = 'actif', rattache_le = now(), revoque_le = NULL, revoque_par = NULL;

  -- 594 : Studuel+ offert par le coach, une seule fois par compte ;
  -- 595 : et dans la limite des places du groupe.
  IF NOT EXISTS (
    SELECT 1 FROM public.subscription_grants
     WHERE user_id = v_uid AND source = 'coach'
  ) AND (
    SELECT count(*) FROM public.subscription_grants
     WHERE source = 'coach' AND reference = v_groupe::text
  ) < c_places THEN
    UPDATE public.profiles
       SET subscription_tier = 'tier1'
     WHERE id = v_uid AND COALESCE(subscription_tier, 'free') = 'free';
    IF FOUND THEN
      INSERT INTO public.subscription_grants (user_id, tier, expires_at, source, reference, granted_by)
      VALUES (v_uid, 'tier1', now() + interval '12 months', 'coach', v_groupe::text, NULL);
    END IF;
  END IF;

  RETURN 'ok';
END;
$$;
REVOKE ALL ON FUNCTION public.rattachement_par_code(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rattachement_par_code(TEXT) TO authenticated;
