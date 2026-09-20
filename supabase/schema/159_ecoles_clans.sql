-- =============================================================================
-- Studuel — Migration 159 : écoles = clans
-- Chaque élève appartient à une ÉCOLE, qui fait office de « clan » : le
-- classement du Défi se décline par école. Un élève peut avoir une école de
-- COLLÈGE et une de LYCÉE (il change de clan en passant l'un à l'autre) ; le
-- clan actif est celui qui correspond à sa classe du moment.
--
-- Tables / colonnes :
--   - schools : annuaire d'écoles, alimentable par les élèves (recherche + ajout
--     s'il manque), séparé collège / lycée.
--   - profiles.college_school_id / lycee_school_id : l'école de l'élève par cycle.
--
-- RPC (SECURITY DEFINER, car la RLS de profiles reste « soi uniquement » et les
-- classements lisent les autres joueurs) :
--   - find_or_create_school(name, city, level) : id de l'école (créée au besoin) ;
--   - set_my_school(school_id, level) : rattache l'élève à une école ;
--   - clan_ranking(level) / national_ranking() : classements réels par trophées
--     (prénom seul — pas de nom de famille exposé).
--
-- PRÉREQUIS : schema.sql (profiles), 079 (profiles.trophies). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.schools (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  city       TEXT,
  level      TEXT NOT NULL CHECK (level IN ('college', 'lycee')),
  created_by UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unicité « souple » : une école = (nom, cycle, ville) insensible à la casse.
-- Empêche les doublons quand deux élèves ajoutent la même école.
CREATE UNIQUE INDEX IF NOT EXISTS schools_uniq_idx
  ON public.schools (lower(name), level, lower(COALESCE(city, '')));

CREATE INDEX IF NOT EXISTS schools_name_trgm_idx
  ON public.schools (level, lower(name));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS college_school_id UUID REFERENCES public.schools (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS lycee_school_id   UUID REFERENCES public.schools (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS profiles_college_school_idx
  ON public.profiles (college_school_id) WHERE college_school_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS profiles_lycee_school_idx
  ON public.profiles (lycee_school_id) WHERE lycee_school_id IS NOT NULL;

-- --------------------------------------------------------------------- RLS
-- Les écoles sont des données de référence PARTAGÉES : tout le monde peut les
-- lire (recherche + affichage du nom de clan). Ajout réservé au créateur
-- authentifié (created_by = soi). Pas d'update/delete (anti-vandalisme) : on
-- passe par find_or_create_school pour l'ajout.
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "schools_select_all" ON public.schools;
CREATE POLICY "schools_select_all" ON public.schools
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "schools_insert_own" ON public.schools;
CREATE POLICY "schools_insert_own" ON public.schools
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- --------------------------------------------------- find_or_create_school
-- Renvoie l'id de l'école (nom, ville, cycle), en la CRÉANT si elle n'existe pas
-- encore. Insensible à la casse. NULL si non authentifié / entrée invalide.
CREATE OR REPLACE FUNCTION public.find_or_create_school(
  p_name TEXT,
  p_city TEXT,
  p_level TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_name TEXT := NULLIF(btrim(COALESCE(p_name, '')), '');
  v_city TEXT := NULLIF(btrim(COALESCE(p_city, '')), '');
  v_id   UUID;
BEGIN
  IF v_user IS NULL OR v_name IS NULL OR p_level NOT IN ('college', 'lycee') THEN
    RETURN NULL;
  END IF;
  v_name := left(v_name, 120);
  v_city := left(v_city, 80);

  SELECT id INTO v_id FROM public.schools
   WHERE lower(name) = lower(v_name)
     AND level = p_level
     AND lower(COALESCE(city, '')) = lower(COALESCE(v_city, ''));
  IF v_id IS NOT NULL THEN RETURN v_id; END IF;

  INSERT INTO public.schools (name, city, level, created_by)
  VALUES (v_name, v_city, p_level, v_user)
  ON CONFLICT (lower(name), level, lower(COALESCE(city, ''))) DO NOTHING
  RETURNING id INTO v_id;

  -- Course perdue (autre insert simultané) : on relit.
  IF v_id IS NULL THEN
    SELECT id INTO v_id FROM public.schools
     WHERE lower(name) = lower(v_name)
       AND level = p_level
       AND lower(COALESCE(city, '')) = lower(COALESCE(v_city, ''));
  END IF;
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.find_or_create_school(TEXT, TEXT, TEXT) TO authenticated;

-- --------------------------------------------------------- set_my_school
-- Rattache l'élève à une école pour un cycle (college/lycee). Valide que l'école
-- existe et que son cycle correspond. p_school_id NULL = quitter le clan.
CREATE OR REPLACE FUNCTION public.set_my_school(p_school_id UUID, p_level TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL OR p_level NOT IN ('college', 'lycee') THEN RETURN false; END IF;

  IF p_school_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.schools WHERE id = p_school_id AND level = p_level
    ) THEN
      RETURN false;
    END IF;
  END IF;

  IF p_level = 'college' THEN
    UPDATE public.profiles SET college_school_id = p_school_id WHERE id = v_user;
  ELSE
    UPDATE public.profiles SET lycee_school_id = p_school_id WHERE id = v_user;
  END IF;
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_my_school(UUID, TEXT) TO authenticated;

-- --------------------------------------------------------- clan_ranking
-- Classement des membres de MON école (du cycle demandé), par trophées. Renvoie
-- un JSONB { school_id, school_name, my_rank, total, entries:[{id,name,trophies,
-- rank}] } (top 50). Prénom seul (pas de nom de famille). school_id null si pas
-- d'école pour ce cycle.
CREATE OR REPLACE FUNCTION public.clan_ranking(p_level TEXT)
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
  IF v_user IS NULL OR p_level NOT IN ('college', 'lycee') THEN RETURN NULL; END IF;

  IF p_level = 'college' THEN
    SELECT college_school_id INTO v_school FROM public.profiles WHERE id = v_user;
  ELSE
    SELECT lycee_school_id INTO v_school FROM public.profiles WHERE id = v_user;
  END IF;

  IF v_school IS NULL THEN
    RETURN jsonb_build_object('school_id', NULL);
  END IF;
  SELECT name INTO v_name FROM public.schools WHERE id = v_school;

  RETURN (
    WITH members AS (
      SELECT p.id,
             split_part(COALESCE(p.full_name, 'Élève'), ' ', 1) AS name,
             p.trophies,
             ROW_NUMBER() OVER (ORDER BY p.trophies DESC, p.id) AS rank
        FROM public.profiles p
       WHERE (CASE WHEN p_level = 'college'
                   THEN p.college_school_id ELSE p.lycee_school_id END) = v_school
    )
    SELECT jsonb_build_object(
      'school_id', v_school,
      'school_name', v_name,
      'total', (SELECT count(*) FROM members),
      'my_rank', (SELECT rank FROM members WHERE id = v_user),
      'entries', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
                 'id', id, 'name', name, 'trophies', trophies, 'rank', rank))
          FROM (SELECT * FROM members ORDER BY rank LIMIT 50) t), '[]'::jsonb)
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.clan_ranking(TEXT) TO authenticated;

-- ------------------------------------------------------ national_ranking
-- Classement national (tous les élèves) par trophées. Même forme JSONB que
-- clan_ranking (sans school_*). Top 50 + mon rang.
CREATE OR REPLACE FUNCTION public.national_ranking()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  RETURN (
    WITH players AS (
      SELECT p.id,
             split_part(COALESCE(p.full_name, 'Élève'), ' ', 1) AS name,
             p.trophies,
             ROW_NUMBER() OVER (ORDER BY p.trophies DESC, p.id) AS rank
        FROM public.profiles p
    )
    SELECT jsonb_build_object(
      'total', (SELECT count(*) FROM players),
      'my_rank', (SELECT rank FROM players WHERE id = v_user),
      'entries', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
                 'id', id, 'name', name, 'trophies', trophies, 'rank', rank))
          FROM (SELECT * FROM players ORDER BY rank LIMIT 50) t), '[]'::jsonb)
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.national_ranking() TO authenticated;
