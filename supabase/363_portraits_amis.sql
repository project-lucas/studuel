-- =============================================================================
-- 363 — LES BLASONS DANS L'ONGLET AMIS (Lucas, 17/09/2026)
--
-- L'onglet Amis dessinait chaque élève par un emoji d'animal tiré de son
-- identifiant (lapin, renard, panda…). Il montre désormais le BLASON que
-- l'élève a choisi (`profiles.avatar->>'portrait'`, lib/portraits.ts). La RLS
-- de profiles reste « soi uniquement » : le blason voyage par les RPC.
--
--   · clan_mates(p_level) : chaque camarade gagne une clé `portrait` (texte,
--     '' si aucun). Le JSONB s'enrichit, rien ne casse côté client.
--   · friends_portraits() : NOUVELLE — le blason de chaque élève avec qui j'ai
--     un lien d'amitié (accepté ou en attente), pour le classement des amis et
--     les demandes reçues.
--
-- Sans cette migration, le client attribue à chacun un blason fixe déduit de
-- son identifiant (lib/portraits.portraitPourId) : jamais d'emoji.
--
-- PRÉREQUIS : 019 (friendships), 082 (profiles.avatar), 362 (clan_mates aux
-- trophées). Idempotent (CREATE OR REPLACE). À exécuter à la main dans :
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.clan_mates(p_level TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_school UUID;
  v_name   TEXT;
BEGIN
  IF v_user IS NULL OR p_level NOT IN ('primaire', 'college', 'lycee') THEN
    RETURN NULL;
  END IF;

  SELECT CASE p_level
           WHEN 'primaire' THEN primaire_school_id
           WHEN 'college'  THEN college_school_id
           ELSE lycee_school_id
         END
    INTO v_school
    FROM public.profiles WHERE id = v_user;

  IF v_school IS NULL THEN
    RETURN jsonb_build_object('school_name', NULL, 'mates', '[]'::jsonb);
  END IF;
  SELECT name INTO v_name FROM public.schools WHERE id = v_school;

  RETURN jsonb_build_object(
    'school_name', v_name,
    'mates', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'id', p.id,
               'name', split_part(COALESCE(p.full_name, 'Élève'), ' ', 1),
               'trophies', COALESCE(p.trophies, 0),
               'portrait', COALESCE(p.avatar->>'portrait', ''))
             ORDER BY COALESCE(p.trophies, 0) DESC, p.id)
        FROM (
          SELECT id, full_name, trophies, avatar
            FROM public.profiles
           WHERE (CASE p_level
                    WHEN 'primaire' THEN primaire_school_id
                    WHEN 'college'  THEN college_school_id
                    ELSE lycee_school_id
                  END) = v_school
           ORDER BY COALESCE(trophies, 0) DESC, id
           LIMIT 50
        ) p
    ), '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.clan_mates(TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.friends_portraits()
RETURNS TABLE (
  friend_id UUID,
  portrait  TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    COALESCE(p.avatar->>'portrait', '')
  FROM public.friendships f
  JOIN public.profiles p
    ON p.id = CASE WHEN f.requester_id = auth.uid()
                   THEN f.addressee_id ELSE f.requester_id END
  WHERE f.status IN ('accepted', 'pending')
    AND auth.uid() IN (f.requester_id, f.addressee_id);
$$;

REVOKE ALL ON FUNCTION public.friends_portraits() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.friends_portraits() TO authenticated;
