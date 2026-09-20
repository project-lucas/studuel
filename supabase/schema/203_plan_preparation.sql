-- =============================================================================
-- Studuel — Migration 203 : « Plan de préparation » (contrôle-objet-unique)
-- Remplace le contrôle éclaté (profiles.upcoming_exams, 087) par DEUX entités
-- relationnelles synchronisées, miroir exact de lib/prep-plan :
--
--   controles              : 1 matière + N chapitres + 1 date + la note obtenue.
--   sessions_preparation   : le plan de révision (1 jour + durée + chapitre +
--                            statut), réparti sur les jours restants.
--
-- INVARIANT « aucun contrôle sans plan » : la seule voie de création est la RPC
-- create_controle, qui insère le contrôle ET ses sessions dans la même
-- transaction (rejet si la liste de sessions est vide). Aucune policy d'INSERT
-- directe : le client ne peut pas fabriquer un contrôle orphelin.
--
-- Sécurité : RLS en SELECT (auth.uid() = user_id) ; toutes les écritures passent
-- par des RPC SECURITY DEFINER qui vérifient la propriété. Les dates sont des
-- clés UTC (convention projet) : on calcule « aujourd'hui » en UTC.
--
-- PRÉREQUIS : schema.sql (auth.users), 002_quizzes.sql + 008_reviser.sql
-- (quizzes.lesson_id, lessons.chapter_id) pour l'auto-complétion par quiz.
-- Idempotente. À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor.
-- Astuce : sélectionne TOUT le fichier (Ctrl+A) avant de lancer.
-- =============================================================================

-- --- Tables ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.controles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  subject_slug  TEXT NOT NULL,
  chapters      JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{ "id": <uuid>, "title": <text> }]
  exam_date     DATE,                               -- NULL = contrôle sans date
  grade         TEXT NOT NULL DEFAULT '',
  note          INTEGER,                            -- note obtenue /20 (post-contrôle)
  note_prompted BOOLEAN NOT NULL DEFAULT FALSE,     -- note déjà demandée (1 relance)
  snooze_date   DATE,                               -- jour où la carte a été repliée
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sessions_preparation (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  controle_id  UUID NOT NULL REFERENCES public.controles (id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  planned_date DATE NOT NULL,
  duration_min INTEGER NOT NULL DEFAULT 10,
  chapter_id   TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'a_faire'
                 CHECK (status IN ('a_faire', 'faite', 'manquee')),
  position     INTEGER NOT NULL DEFAULT 0,
  done_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS controles_user_idx
  ON public.controles (user_id);
CREATE INDEX IF NOT EXISTS sessions_prep_user_idx
  ON public.sessions_preparation (user_id);
CREATE INDEX IF NOT EXISTS sessions_prep_controle_idx
  ON public.sessions_preparation (controle_id);

-- --- RLS : lecture de ses propres lignes uniquement --------------------------

ALTER TABLE public.controles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions_preparation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS controles_select_own ON public.controles;
CREATE POLICY controles_select_own ON public.controles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS sessions_prep_select_own ON public.sessions_preparation;
CREATE POLICY sessions_prep_select_own ON public.sessions_preparation
  FOR SELECT USING (auth.uid() = user_id);

-- (Pas de policy INSERT/UPDATE/DELETE : les écritures passent par les RPC
--  SECURITY DEFINER ci-dessous, qui garantissent l'invariant « plan présent ».)

-- --- RPC : créer un contrôle + son plan, atomiquement ------------------------
-- p_sessions : [{ "plannedDate": 'YYYY-MM-DD', "durationMin": 10,
--                 "chapterId": <text>, "position": 0 }, … ] (au moins 1).
-- Renvoie l'id du contrôle, ou NULL si non authentifié / payload vide.
CREATE OR REPLACE FUNCTION public.create_controle(
  p_subject  TEXT,
  p_chapters JSONB,
  p_date     DATE,
  p_grade    TEXT,
  p_sessions JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_id   UUID;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  -- Invariant : ni contrôle sans chapitre, ni contrôle sans plan.
  IF p_chapters IS NULL OR jsonb_typeof(p_chapters) <> 'array'
     OR jsonb_array_length(p_chapters) = 0 THEN RETURN NULL; END IF;
  IF p_sessions IS NULL OR jsonb_typeof(p_sessions) <> 'array'
     OR jsonb_array_length(p_sessions) = 0 THEN RETURN NULL; END IF;
  -- Bornes anti-abus : la RPC est appelable directement (clé anon publique), un
  -- payload forgé ne doit pas pouvoir inonder les tables. Un plan légitime tient
  -- en quelques sessions (lib/prep-plan.planDates) et quelques chapitres — on
  -- borne LARGE pour ne jamais gêner l'app.
  IF jsonb_array_length(p_chapters) > 30
     OR jsonb_array_length(p_sessions) > 60 THEN RETURN NULL; END IF;

  INSERT INTO public.controles (user_id, subject_slug, chapters, exam_date, grade)
  VALUES (v_user, LEFT(COALESCE(p_subject, ''), 80), p_chapters, p_date,
          LEFT(COALESCE(p_grade, ''), 20))
  RETURNING id INTO v_id;

  INSERT INTO public.sessions_preparation
    (controle_id, user_id, planned_date, duration_min, chapter_id, position)
  SELECT
    v_id,
    v_user,
    (s->>'plannedDate')::date,
    LEAST(240, GREATEST(1, COALESCE((s->>'durationMin')::int, 10))),
    LEFT(COALESCE(s->>'chapterId', ''), 80),
    COALESCE((s->>'position')::int, 0)
  FROM jsonb_array_elements(p_sessions) s;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_controle(TEXT, JSONB, DATE, TEXT, JSONB)
  TO authenticated;

-- --- RPC : marquer une session « faite » (bouton explicite) ------------------
CREATE OR REPLACE FUNCTION public.complete_prep_session(p_session UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_hit  INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN FALSE; END IF;
  UPDATE public.sessions_preparation
     SET status = 'faite', done_at = now()
   WHERE id = p_session AND user_id = v_user AND status <> 'faite';
  GET DIAGNOSTICS v_hit = ROW_COUNT;
  RETURN v_hit > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.complete_prep_session(UUID) TO authenticated;

-- --- RPC : auto-complétion depuis un quiz terminé ----------------------------
-- Résout le chapitre du quiz (quizzes → lessons.chapter_id) et coche la session
-- de préparation la plus actionnable de ce chapitre (en retard/du jour d'abord,
-- sinon la plus proche) parmi les contrôles encore actifs. Appelée par
-- recordTestSession : réviser le chapitre depuis n'importe où fait avancer le
-- plan. Renvoie TRUE si une session a été cochée.
CREATE OR REPLACE FUNCTION public.complete_prep_session_for_quiz(p_quiz UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_today   DATE := (now() AT TIME ZONE 'utc')::date;
  v_chapter TEXT;
  v_target  UUID;
BEGIN
  IF v_user IS NULL THEN RETURN FALSE; END IF;

  SELECT l.chapter_id::text INTO v_chapter
    FROM public.quizzes q
    JOIN public.lessons l ON l.id = q.lesson_id
   WHERE q.id = p_quiz;
  IF v_chapter IS NULL OR v_chapter = '' THEN RETURN FALSE; END IF;

  SELECT s.id INTO v_target
    FROM public.sessions_preparation s
    JOIN public.controles c ON c.id = s.controle_id
   WHERE s.user_id = v_user
     AND s.status = 'a_faire'
     AND s.chapter_id = v_chapter
     AND (c.exam_date IS NULL OR c.exam_date >= v_today)
   ORDER BY (s.planned_date <= v_today) DESC, s.planned_date ASC
   LIMIT 1;
  IF v_target IS NULL THEN RETURN FALSE; END IF;

  UPDATE public.sessions_preparation
     SET status = 'faite', done_at = now()
   WHERE id = v_target;
  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.complete_prep_session_for_quiz(UUID)
  TO authenticated;

-- --- RPC : note post-contrôle (saisie ou passée) -----------------------------
CREATE OR REPLACE FUNCTION public.set_controle_note(p_controle UUID, p_note INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_hit  INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN FALSE; END IF;
  UPDATE public.controles
     SET note = GREATEST(0, LEAST(20, p_note)), note_prompted = TRUE
   WHERE id = p_controle AND user_id = v_user;
  GET DIAGNOSTICS v_hit = ROW_COUNT;
  RETURN v_hit > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_controle_note(UUID, INTEGER) TO authenticated;

-- Ferme la relance de note sans en saisir (« plus tard / non »).
CREATE OR REPLACE FUNCTION public.dismiss_controle_note(p_controle UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_hit  INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN FALSE; END IF;
  UPDATE public.controles SET note_prompted = TRUE
   WHERE id = p_controle AND user_id = v_user;
  GET DIAGNOSTICS v_hit = ROW_COUNT;
  RETURN v_hit > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.dismiss_controle_note(UUID) TO authenticated;

-- --- RPC : replier la carte pour aujourd'hui (« me le rappeler ce soir ») -----
CREATE OR REPLACE FUNCTION public.snooze_controle_card(p_controle UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_hit  INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN FALSE; END IF;
  UPDATE public.controles
     SET snooze_date = (now() AT TIME ZONE 'utc')::date
   WHERE id = p_controle AND user_id = v_user;
  GET DIAGNOSTICS v_hit = ROW_COUNT;
  RETURN v_hit > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.snooze_controle_card(UUID) TO authenticated;

-- --- RPC : supprimer un contrôle (« je me suis trompé ») ---------------------
CREATE OR REPLACE FUNCTION public.delete_controle(p_controle UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_hit  INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN FALSE; END IF;
  DELETE FROM public.controles WHERE id = p_controle AND user_id = v_user;
  GET DIAGNOSTICS v_hit = ROW_COUNT;
  RETURN v_hit > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_controle(UUID) TO authenticated;
