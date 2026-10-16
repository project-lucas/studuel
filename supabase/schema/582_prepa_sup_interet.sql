-- =============================================================================
-- Studuel — Migration 582 : LA PRÉPA DU SUPÉRIEUR — CE QUI INTÉRESSE LES ÉLÈVES
--
-- Lucas, 15/10/2026 : « des matières supplémentaires pour devancer la L1 —
-- droit, économie… —, les filières les plus choisies après le bac ». La
-- colonne vertébrale est posée (lib/prepa-sup/catalogue.ts, page /prepa-sup) ;
-- le CONTENU viendra filière par filière. Pour décider par laquelle commencer,
-- on demande aux élèves : chacun coche les filières qui l'intéressent, et
-- l'admin lit le décompte (`prepa_sup_votes`).
--
-- CE QU'ELLE INSTALLE : `prepa_sup_interet` (un élève × une filière),
-- `prepa_sup_basculer(p_piste)` (coche / décoche, rend l'état), et
-- `prepa_sup_votes()` (admin : le décompte par filière).
--
-- La liste blanche des filières est le miroir de lib/prepa-sup/catalogue.ts
-- (testé contre ce fichier).
-- PRÉREQUIS : 028 (is_admin). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.prepa_sup_interet (
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  piste   TEXT NOT NULL CHECK (piste IN ('droit', 'sante', 'psychologie', 'economie', 'commerce', 'staps', 'informatique', 'sciences-po')),
  cree_le TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, piste)
);
ALTER TABLE public.prepa_sup_interet ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS prepa_sup_interet_select_own ON public.prepa_sup_interet;
CREATE POLICY prepa_sup_interet_select_own ON public.prepa_sup_interet
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
REVOKE INSERT, UPDATE, DELETE ON public.prepa_sup_interet FROM anon, authenticated;
GRANT SELECT ON public.prepa_sup_interet TO authenticated;

-- Coche ou décoche une filière. Rend true si elle est désormais cochée.
CREATE OR REPLACE FUNCTION public.prepa_sup_basculer(p_piste TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL THEN RETURN false; END IF;
  DELETE FROM public.prepa_sup_interet WHERE user_id = v_user AND piste = p_piste;
  IF FOUND THEN RETURN false; END IF;
  INSERT INTO public.prepa_sup_interet (user_id, piste) VALUES (v_user, p_piste)
  ON CONFLICT (user_id, piste) DO NOTHING;
  RETURN true;
EXCEPTION WHEN check_violation THEN
  RETURN false;
END;
$$;
REVOKE ALL ON FUNCTION public.prepa_sup_basculer(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prepa_sup_basculer(TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.prepa_sup_votes()
RETURNS TABLE (piste TEXT, eleves BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT i.piste, count(*) FROM public.prepa_sup_interet i
   WHERE public.is_admin()
   GROUP BY i.piste ORDER BY count(*) DESC;
$$;
REVOKE ALL ON FUNCTION public.prepa_sup_votes() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prepa_sup_votes() TO authenticated;
