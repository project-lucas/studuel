-- =============================================================================
-- Studuel — Migration 172 : durcissement de la liaison parent ↔ enfant.
--
-- La 044 crée link_child_by_code : un compte « parent » saisit le CODE de
-- l'enfant (profiles.friend_code) pour se lier et accéder à child_dashboard
-- (notes par matière, temps de travail, 120 j d'activité). L'hypothèse d'origine
-- était « le partage du code vaut consentement ».
--
-- ⚠️ Cette hypothèse est CASSÉE depuis le backend social : friend_code est
-- désormais le MÊME code que celui partagé en classe pour s'ajouter en ami
-- (add_friend_by_code / add_friend_qr, QR affiché dans l'onglet Amis). N'importe
-- quel élève qui a le code d'un camarade peut donc ouvrir /parents, se lier
-- comme « parent » et obtenir un accès PERMANENT et SILENCIEUX à ses données
-- scolaires — sans aucun contrôle de rôle ni consentement de la victime.
--
-- Deux gardes ajoutées ici, la RPC gardant sa signature TEXT→TEXT (statuts
-- 'linked' | 'already' | 'self' | 'not_found', le client ne change pas) :
--
--   1. Garde de RÔLE : un compte explicitement « eleve » (profile_type, 048 —
--      posé par défaut à tout élève onboardé) ne peut PLUS lier d'enfant. On
--      refuse par le négatif (bloque la population attaquante = les élèves) sans
--      casser les vrais parents (profile_type = 'parent', ou NULL legacy). Un
--      élève reçoit 'not_found' (indistinct d'un code inexistant : pas d'oracle).
--   2. Garde de DÉBIT : même limiteur horaire partagé que 169
--      (friend_lookup_allowed, 40/h) — link_child_by_code est un oracle de
--      validité de code PLUS FORT que friend_preview (un succès crée un lien
--      persistant), il mérite le même traitement anti-force-brute.
--
-- ⚠️ Ce n'est PAS le correctif complet. Le vrai correctif — un CONSENTEMENT
-- explicite de l'enfant (l'élève approuve/refuse une demande de liaison, comme
-- pour une demande d'ami) + visibilité côté enfant des parents liés avec
-- révocation — est un chantier produit à trancher avec Lucas (décision + QA).
-- Ici on ferme l'attaque « un élève lambda lie un camarade » et on borne le
-- débit ; le résiduel (un compte non-élève qui brute-force des codes) reste
-- borné et signalé.
--
-- PRÉREQUIS : 044 (link_child_by_code), 048 (profiles.profile_type), 169
-- (friend_lookup_allowed). Idempotent (CREATE OR REPLACE, signature inchangée).
-- À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.link_child_by_code(p_code TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parent UUID := auth.uid();
  v_child  UUID;
BEGIN
  IF v_parent IS NULL THEN RETURN 'not_found'; END IF;

  -- Garde de rôle : un compte élève ne peut pas se lier comme parent d'un
  -- camarade dont il a le code ami. On bloque le négatif ('eleve') pour ne pas
  -- casser un vrai parent ('parent' ou NULL legacy). 'not_found' = pas d'oracle.
  IF EXISTS (
    SELECT 1 FROM public.profiles
     WHERE id = v_parent AND profile_type = 'eleve'
  ) THEN RETURN 'not_found'; END IF;

  -- Garde de débit : même limiteur horaire que 169 (previews + ajouts + liaisons
  -- confondus). link_child_by_code est l'oracle le plus fort (lien persistant).
  IF NOT public.friend_lookup_allowed() THEN RETURN 'not_found'; END IF;

  SELECT id INTO v_child FROM public.profiles
   WHERE friend_code = upper(trim(p_code));
  IF v_child IS NULL THEN RETURN 'not_found'; END IF;
  IF v_child = v_parent THEN RETURN 'self'; END IF;

  IF EXISTS (
    SELECT 1 FROM public.parent_children
     WHERE parent_id = v_parent AND child_id = v_child
  ) THEN RETURN 'already'; END IF;

  INSERT INTO public.parent_children (parent_id, child_id)
  VALUES (v_parent, v_child);
  RETURN 'linked';
END;
$$;

GRANT EXECUTE ON FUNCTION public.link_child_by_code(TEXT) TO authenticated;
