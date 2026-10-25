-- =============================================================================
-- 597 — Signaler une réponse de l'IA (25/10/2026)
--
-- Les règles de Google Play sur l'IA générative exigent qu'un utilisateur
-- puisse signaler une réponse choquante SANS QUITTER L'APP — et une app pour
-- des 11-18 ans le doit de toute façon. Marcel n'en avait pas.
--
--   · `ia_signalements` : une ligne par signalement — l'outil (marcel…), la
--     raison (faux · choquant · autre), la question et la réponse telles que
--     l'élève les a vues (les conversations de Marcel ne sont pas gardées en
--     base : sans cette copie, l'admin ne saurait pas quoi relire).
--   · `ia_signaler(...)` : la SEULE porte d'écriture, élève connecté, bornée à
--     20 signalements par élève et par jour, textes tronqués.
--   · Lecture, traitement et suppression : l'admin seul (/admin/signalements-ia).
--   · ON DELETE CASCADE : un compte supprimé (596) emporte ses signalements —
--     ils contiennent ses questions.
--
-- PRÉREQUIS : 028 (is_admin). Idempotente.
-- À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.ia_signalements (
  id         BIGSERIAL PRIMARY KEY,
  cree_le    TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id    UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  outil      TEXT NOT NULL CHECK (outil IN ('marcel')),
  raison     TEXT NOT NULL CHECK (raison IN ('faux', 'choquant', 'autre')),
  question   TEXT NOT NULL DEFAULT '' CHECK (char_length(question) <= 2000),
  reponse    TEXT NOT NULL CHECK (char_length(reponse) BETWEEN 1 AND 8000),
  traite_le  TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS ia_signalements_cree_le_idx ON public.ia_signalements (cree_le DESC);
CREATE INDEX IF NOT EXISTS ia_signalements_user_recent_idx ON public.ia_signalements (user_id, cree_le DESC);

ALTER TABLE public.ia_signalements ENABLE ROW LEVEL SECURITY;

-- L'admin lit, marque traité, supprime ; l'élève n'a aucun accès direct.
DROP POLICY IF EXISTS "ia_signalements_lecture_admin" ON public.ia_signalements;
CREATE POLICY "ia_signalements_lecture_admin" ON public.ia_signalements
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "ia_signalements_maj_admin" ON public.ia_signalements;
CREATE POLICY "ia_signalements_maj_admin" ON public.ia_signalements
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "ia_signalements_suppression_admin" ON public.ia_signalements;
CREATE POLICY "ia_signalements_suppression_admin" ON public.ia_signalements
  FOR DELETE TO authenticated
  USING ((SELECT public.is_admin()));

GRANT SELECT, UPDATE, DELETE ON public.ia_signalements TO authenticated;

-- -----------------------------------------------------------------------------
-- ia_signaler : 'ok' · 'anonyme' · 'invalide' · 'trop'
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ia_signaler(
  p_outil    TEXT,
  p_raison   TEXT,
  p_question TEXT,
  p_reponse  TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := (SELECT auth.uid());
  v_du_jour INTEGER;
BEGIN
  IF v_uid IS NULL THEN RETURN 'anonyme'; END IF;
  IF COALESCE(p_outil, '') NOT IN ('marcel')
     OR COALESCE(p_raison, '') NOT IN ('faux', 'choquant', 'autre')
     OR length(btrim(COALESCE(p_reponse, ''))) = 0 THEN
    RETURN 'invalide';
  END IF;

  SELECT count(*) INTO v_du_jour
    FROM public.ia_signalements
   WHERE user_id = v_uid AND cree_le > now() - interval '1 day';
  IF v_du_jour >= 20 THEN RETURN 'trop'; END IF;

  INSERT INTO public.ia_signalements (user_id, outil, raison, question, reponse)
  VALUES (v_uid, p_outil, p_raison, left(COALESCE(p_question, ''), 2000), left(p_reponse, 8000));
  RETURN 'ok';
END;
$$;

REVOKE ALL ON FUNCTION public.ia_signaler(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ia_signaler(TEXT, TEXT, TEXT, TEXT) TO authenticated;
