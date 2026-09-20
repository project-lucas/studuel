-- =============================================================================
-- Studuel — Migration 087 : contrôles à venir déclarés par l'élève
-- profiles.upcoming_exams (JSONB, tableau) : la LISTE des prochains contrôles
-- que l'élève annonce depuis l'onglet Moi (« + Nouveau contrôle »). Le Défi y
-- pioche ses questions en priorité → réviser son contrôle sans changer d'onglet.
--
-- Forme du JSON (tableau) :
--   [ { "subject": "physique-chimie", "chapterId": "<uuid>",
--       "chapterTitle": "Les états de la matière", "level": "1re",
--       "date": "2026-07-20" | null } , … ]
--
-- Sécurité : lecture par la RLS de profiles (auth.uid() = id, déjà en place).
-- ÉCRITURE : uniquement via les deux fonctions atomiques ci-dessous — PAS de
-- GRANT UPDATE direct sur la colonne. Le read-modify-write d'un tableau JSONB
-- côté client perdrait une mise à jour si l'élève annonce depuis deux appareils
-- en même temps (lecture concurrente de la même liste, dernier write gagne). Les
-- fonctions font le read-modify-write dans la même transaction avec FOR UPDATE :
-- deux ajouts simultanés sont sérialisés, aucun contrôle perdu.
--
-- PRÉREQUIS : schema.sql (profiles), 010_moi.sql. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS upcoming_exams JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Plafond partagé avec lib/next-exam.ts (MAX_UPCOMING_EXAMS = 10). Si tu changes
-- l'un, change l'autre.

-- Ajoute (ou remplace, par chapitre) un contrôle. Dédoublonne par chapterId,
-- borne aux 10 plus récents, renvoie la nouvelle liste. NULL si non authentifié
-- ou payload invalide.
CREATE OR REPLACE FUNCTION public.add_upcoming_exam(p_exam JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_chap TEXT := p_exam->>'chapterId';
  v_list JSONB;
BEGIN
  IF v_user IS NULL OR v_chap IS NULL OR v_chap = '' THEN RETURN NULL; END IF;

  SELECT COALESCE(upcoming_exams, '[]'::jsonb) INTO v_list
    FROM public.profiles WHERE id = v_user FOR UPDATE;

  -- Retire l'entrée du même chapitre (dédoublonnage : la nouvelle gagne).
  SELECT COALESCE(jsonb_agg(e), '[]'::jsonb) INTO v_list
    FROM jsonb_array_elements(v_list) e
   WHERE e->>'chapterId' IS DISTINCT FROM v_chap;

  -- Ajoute en fin, puis garde les 10 plus récents (fin du tableau).
  v_list := v_list || jsonb_build_array(p_exam);
  IF jsonb_array_length(v_list) > 10 THEN
    SELECT COALESCE(jsonb_agg(e ORDER BY ord), '[]'::jsonb) INTO v_list
      FROM (
        SELECT e, ord
          FROM jsonb_array_elements(v_list) WITH ORDINALITY AS t(e, ord)
         ORDER BY ord DESC
         LIMIT 10
      ) s;
  END IF;

  UPDATE public.profiles SET upcoming_exams = v_list WHERE id = v_user;
  RETURN v_list;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_upcoming_exam(JSONB) TO authenticated;

-- Retire le contrôle d'un chapitre (contrôle passé ou déclaré par erreur).
-- Renvoie la nouvelle liste. NULL si non authentifié.
CREATE OR REPLACE FUNCTION public.remove_upcoming_exam(p_chapter TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_list JSONB;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  SELECT COALESCE(upcoming_exams, '[]'::jsonb) INTO v_list
    FROM public.profiles WHERE id = v_user FOR UPDATE;

  SELECT COALESCE(jsonb_agg(e), '[]'::jsonb) INTO v_list
    FROM jsonb_array_elements(v_list) e
   WHERE e->>'chapterId' IS DISTINCT FROM p_chapter;

  UPDATE public.profiles SET upcoming_exams = v_list WHERE id = v_user;
  RETURN v_list;
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_upcoming_exam(TEXT) TO authenticated;
