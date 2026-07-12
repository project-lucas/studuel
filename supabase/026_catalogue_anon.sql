-- =============================================================================
-- Scolaria — Migration 026 : lecture anonyme du catalogue
-- Le catalogue (matières, chapitres, leçons) est identique pour tous les
-- élèves d'une même classe : le serveur le met en cache avec un client SANS
-- session (rôle anon) pour ne plus le requêter à chaque navigation.
-- Aucune donnée personnelle ici — les questions de quiz restent gatées
-- (gratuit/premium) et les tables élève restent strictement RLS « own ».
-- PRÉREQUIS : 008_reviser.sql exécuté. Idempotent.
-- =============================================================================

DROP POLICY IF EXISTS "subjects_select_auth" ON public.subjects;
CREATE POLICY "subjects_select_auth" ON public.subjects
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "chapters_select_auth" ON public.chapters;
CREATE POLICY "chapters_select_auth" ON public.chapters
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "lessons_select_auth" ON public.lessons;
CREATE POLICY "lessons_select_auth" ON public.lessons
  FOR SELECT USING (true);
