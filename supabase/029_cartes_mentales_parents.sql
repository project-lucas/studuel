-- =============================================================================
-- Scolaria — Migration 029 : cartes mentales + espace parents
-- 1. chapters.mind_map : carte mentale du chapitre (JSONB), visible par tous
--    mais ouvrable uniquement par les abonnés (verrou côté UI, tier1+).
-- 2. parent_videos : le « Programme » de l'espace parents — liste de vidéos
--    préparée par le coach scolaire (admin), lisible par tout utilisateur
--    connecté, modifiable uniquement par l'admin.
-- PRÉREQUIS : 008_reviser.sql et 028_admin.sql exécutés. Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CHAPTERS — carte mentale
--    Forme du JSON : { "centre": "Titre", "branches": [
--      { "titre": "Branche", "enfants": ["Idée 1", "Idée 2"] }, … ] }
-- -----------------------------------------------------------------------------
ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS mind_map JSONB;

-- -----------------------------------------------------------------------------
-- 2. PARENT_VIDEOS — programme de vidéos du coach scolaire
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.parent_videos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  url         TEXT NOT NULL,
  theme       TEXT NOT NULL DEFAULT 'Méthode',
  duration    TEXT,                              -- ex. '8 min'
  position    INT NOT NULL DEFAULT 0,
  published   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS parent_videos_position_idx
  ON public.parent_videos (position, created_at);

ALTER TABLE public.parent_videos ENABLE ROW LEVEL SECURITY;

-- Lecture : tout utilisateur connecté voit les vidéos publiées ;
-- l'admin voit aussi les brouillons.
DROP POLICY IF EXISTS "parent_videos_select" ON public.parent_videos;
CREATE POLICY "parent_videos_select" ON public.parent_videos
  FOR SELECT USING (published = true OR public.is_admin());

-- Écriture : admin uniquement (même modèle que le catalogue, migration 028).
DROP POLICY IF EXISTS "parent_videos_admin_write" ON public.parent_videos;
CREATE POLICY "parent_videos_admin_write" ON public.parent_videos
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

GRANT SELECT ON public.parent_videos TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.parent_videos TO authenticated;

-- -----------------------------------------------------------------------------
-- 3. SEED — premières vidéos d'exemple du programme (modifiables dans /admin).
-- -----------------------------------------------------------------------------
INSERT INTO public.parent_videos (title, description, url, theme, duration, position)
SELECT v.title, v.description, v.url, v.theme, v.duration, v.position
FROM (VALUES
  ('Bien accompagner sans faire à sa place',
   'Le rôle du parent dans les devoirs : cadrer, encourager, mais laisser l''élève chercher.',
   'https://www.youtube.com/watch?v=a-remplacer-1', 'Posture parentale', '9 min', 1),
  ('Comprendre la courbe de l''oubli',
   'Pourquoi réviser en plusieurs fois fonctionne mieux qu''une veille d''examen, et comment Scolaria s''appuie dessus.',
   'https://www.youtube.com/watch?v=a-remplacer-2', 'Méthode', '7 min', 2),
  ('Écrans et concentration : trouver l''équilibre',
   'Des règles simples et tenables pour que le téléphone reste un outil de travail.',
   'https://www.youtube.com/watch?v=a-remplacer-3', 'Quotidien', '11 min', 3)
) AS v(title, description, url, theme, duration, position)
WHERE NOT EXISTS (SELECT 1 FROM public.parent_videos);
