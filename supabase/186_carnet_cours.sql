-- =============================================================================
-- Studuel — Migration 186 : « Mon carnet » façon Wooflash — cours, chapitres,
-- questions et révision.
--
-- L'élève crée des COURS (ex. « Anglais 3e ») contenant des CHAPITRES
-- (dossiers imbriquables via parent_chapter_id) et des QUESTIONS de 5 types,
-- puis les révise (sessions + tentatives, pour les statistiques).
--
-- NB noms : `courses` et `chapters` existent déjà (catalogue admin, schema.sql
-- et 008) — les tables du carnet sont donc préfixées `carnet_*`.
--
-- Formes de `content` (JSONB) selon `type` de carnet_questions :
--   qcm           : { "enonce": "...", "choix": [ { "texte": "...",
--                     "correct": true|false }, … ], "feedback": "..."|null }
--   flashcard     : { "recto": "...", "verso": "...",
--                     "langue_recto": "fr"|…|null, "langue_verso": …|null }
--   vrai_faux     : { "enonce": "...", "reponse": true|false,
--                     "feedback": "..."|null }
--   texte_a_trous : { "texte": "… [mot] … [autre] …" }   (trous entre crochets)
--   reponse_libre : { "enonce": "...", "reponses": ["...", …] }  (acceptées)
--
-- Sécurité : v1 privée — le propriétaire du cours a tous les droits sur son
-- cours et son contenu (chapitres/questions via EXISTS sur carnet_courses) ;
-- sessions et tentatives sont owner-only (auth.uid() = user_id). Le schéma
-- (owner_id séparé des attempts par user_id) reste prêt pour un partage futur.
--
-- PRÉREQUIS : schema.sql (profiles). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ------------------------------------------------------------------ cours ---
CREATE TABLE IF NOT EXISTS public.carnet_courses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  title       TEXT NOT NULL DEFAULT 'Sans titre',
  description TEXT,
  icon        TEXT,                          -- nom d'icône lucide, facultatif
  color       TEXT,                          -- teinte pastel (jeton), facultatif
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS carnet_courses_owner_idx
  ON public.carnet_courses (owner_id, updated_at DESC);

ALTER TABLE public.carnet_courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "carnet_courses_all_own" ON public.carnet_courses;
CREATE POLICY "carnet_courses_all_own" ON public.carnet_courses
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- -------------------------------------------------------------- chapitres ---
CREATE TABLE IF NOT EXISTS public.carnet_chapters (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id         UUID NOT NULL
    REFERENCES public.carnet_courses (id) ON DELETE CASCADE,
  parent_chapter_id UUID
    REFERENCES public.carnet_chapters (id) ON DELETE CASCADE,
  title             TEXT NOT NULL DEFAULT 'Nouveau chapitre',
  position          INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS carnet_chapters_course_idx
  ON public.carnet_chapters (course_id, parent_chapter_id, position);

ALTER TABLE public.carnet_chapters ENABLE ROW LEVEL SECURITY;

-- Tous les droits pour le propriétaire du cours parent.
DROP POLICY IF EXISTS "carnet_chapters_all_own" ON public.carnet_chapters;
CREATE POLICY "carnet_chapters_all_own" ON public.carnet_chapters
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.carnet_courses c
    WHERE c.id = course_id AND c.owner_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.carnet_courses c
    WHERE c.id = course_id AND c.owner_id = auth.uid()
  ));

-- -------------------------------------------------------------- questions ---
CREATE TABLE IF NOT EXISTS public.carnet_questions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  UUID NOT NULL
    REFERENCES public.carnet_courses (id) ON DELETE CASCADE,
  chapter_id UUID
    REFERENCES public.carnet_chapters (id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN
    ('qcm', 'flashcard', 'vrai_faux', 'texte_a_trous', 'reponse_libre')),
  position   INTEGER NOT NULL DEFAULT 0,
  content    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS carnet_questions_course_idx
  ON public.carnet_questions (course_id, chapter_id, position);

ALTER TABLE public.carnet_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "carnet_questions_all_own" ON public.carnet_questions;
CREATE POLICY "carnet_questions_all_own" ON public.carnet_questions
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.carnet_courses c
    WHERE c.id = course_id AND c.owner_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.carnet_courses c
    WHERE c.id = course_id AND c.owner_id = auth.uid()
  ));

-- --------------------------------------------------- sessions de révision ---
CREATE TABLE IF NOT EXISTS public.carnet_review_sessions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  course_id  UUID NOT NULL
    REFERENCES public.carnet_courses (id) ON DELETE CASCADE,
  chapter_id UUID
    REFERENCES public.carnet_chapters (id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS carnet_review_sessions_user_idx
  ON public.carnet_review_sessions (user_id, course_id, started_at DESC);

ALTER TABLE public.carnet_review_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "carnet_review_sessions_all_own"
  ON public.carnet_review_sessions;
CREATE POLICY "carnet_review_sessions_all_own" ON public.carnet_review_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------- tentatives de réponse ---
CREATE TABLE IF NOT EXISTS public.carnet_review_attempts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  question_id  UUID NOT NULL
    REFERENCES public.carnet_questions (id) ON DELETE CASCADE,
  session_id   UUID
    REFERENCES public.carnet_review_sessions (id) ON DELETE SET NULL,
  is_correct   BOOLEAN NOT NULL,
  given_answer JSONB,
  answered_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS carnet_review_attempts_user_q_idx
  ON public.carnet_review_attempts (user_id, question_id, answered_at DESC);
CREATE INDEX IF NOT EXISTS carnet_review_attempts_session_idx
  ON public.carnet_review_attempts (session_id);

ALTER TABLE public.carnet_review_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "carnet_review_attempts_all_own"
  ON public.carnet_review_attempts;
CREATE POLICY "carnet_review_attempts_all_own" ON public.carnet_review_attempts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
