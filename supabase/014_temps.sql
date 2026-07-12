-- =============================================================================
-- Scolaria — Migration 014 : temps de travail réel + badges de temps
-- Un chronomètre tourne dans le Défi et incrémente le temps de l'élève.
-- Le compteur « Moi » affiche ce temps cumulé ; un total communautaire somme
-- tous les élèves (via une fonction security definer, la RLS masquant les
-- autres profils).
-- PRÉREQUIS : 010 (badges, profiles). Idempotent.
-- =============================================================================

-- Temps de travail cumulé, en secondes (mesuré par le chrono du Défi).
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS work_seconds BIGINT NOT NULL DEFAULT 0;

-- -----------------------------------------------------------------------------
-- Incrément atomique du temps de l'élève courant.
-- SECURITY DEFINER : work_seconds n'est pas dans les colonnes GRANT UPDATE,
-- seule cette fonction peut l'écrire — et uniquement pour soi (auth.uid()).
-- Plafond par appel : 1 h, pour empêcher tout gonflage.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.add_work_time(p_seconds INTEGER)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.profiles
     SET work_seconds = work_seconds + GREATEST(0, LEAST(p_seconds, 3600))
   WHERE id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.add_work_time(INTEGER) TO authenticated;

-- -----------------------------------------------------------------------------
-- Temps communautaire cumulé, en secondes (tous les élèves).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.community_seconds()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(work_seconds), 0) FROM public.profiles;
$$;

GRANT EXECUTE ON FUNCTION public.community_seconds() TO authenticated, anon;

-- -----------------------------------------------------------------------------
-- Badges de temps de travail (condition évaluée côté application, en minutes).
-- -----------------------------------------------------------------------------
INSERT INTO public.badges (slug, title, description, icon, condition) VALUES
  ('temps-1h', 'Première heure', '1 heure de travail cumulée sur Scolaria.', '⏱️',
   '{"type":"study_minutes","minutes":60}'),
  ('temps-10h', '10 heures', '10 heures de travail — la régularité paie.', '⏳',
   '{"type":"study_minutes","minutes":600}'),
  ('temps-100h', '100 heures', '100 heures cumulées. Discipline remarquable.', '🏅',
   '{"type":"study_minutes","minutes":6000}'),
  ('temps-1000h', '1000 heures', '1000 heures de travail. Niveau légende.', '👑',
   '{"type":"study_minutes","minutes":60000}')
ON CONFLICT (slug) DO NOTHING;
