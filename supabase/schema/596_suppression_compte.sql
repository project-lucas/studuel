-- =============================================================================
-- 596 — Supprimer son compte depuis l'app (25/10/2026)
--
-- Exigé par Apple (règle 5.1.1 v), par Google Play (politique de suppression
-- des données) et par le RGPD (droit à l'effacement, art. 17). Jusqu'ici, un
-- élève ne pouvait pas effacer son compte sans écrire à l'équipe.
--
--   · `compte_supprimer('SUPPRIMER')` efface la ligne `auth.users` de
--     l'appelant. Tout le reste suit par les clés étrangères : 132 tables en
--     ON DELETE CASCADE (profil, progrès, ligue, amis, parents, groupe de
--     coach…), et 8 en ON DELETE SET NULL qui gardent la ligne SANS l'auteur
--     (messages de la messagerie coach, journal d'erreurs, journal d'usage,
--     fiche d'entrée remplie par un tiers) — anonymisées, pas effacées.
--   · Le mot « SUPPRIMER » est vérifié ICI : un appel égaré de l'API, sans le
--     mot, ne détruit rien.
--   · Refus pour un compte admin, et pour un coach qui a encore un groupe
--     actif : la cascade effacerait le groupe et le rattachement de tous ses
--     joueurs. Il archive ses groupes d'abord, ou écrit à l'équipe.
--
-- Réponses : 'ok' · 'anonyme' · 'confirmation' · 'admin' · 'coach'.
--
-- PRÉREQUIS : 028 (is_admin), 560 (coach_groupes). Idempotente.
-- À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.compte_supprimer(p_confirmation TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid   UUID := auth.uid();
  v_admin BOOLEAN;
BEGIN
  IF v_uid IS NULL THEN RETURN 'anonyme'; END IF;
  IF COALESCE(p_confirmation, '') <> 'SUPPRIMER' THEN RETURN 'confirmation'; END IF;

  SELECT is_admin INTO v_admin FROM public.profiles WHERE id = v_uid;
  IF v_admin IS TRUE THEN RETURN 'admin'; END IF;

  IF EXISTS (
    SELECT 1 FROM public.coach_groupes
     WHERE coach_id = v_uid AND archive_le IS NULL
  ) THEN RETURN 'coach'; END IF;

  DELETE FROM auth.users WHERE id = v_uid;
  RETURN 'ok';
END;
$$;

REVOKE ALL ON FUNCTION public.compte_supprimer(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.compte_supprimer(TEXT) TO authenticated;

-- Contrôle à la main (aucun effet : sans session, la fonction répond 'anonyme') :
--   select public.compte_supprimer('SUPPRIMER');  → anonyme
