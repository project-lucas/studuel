-- =============================================================================
-- Studuel — Migration 080 : mode COOP (deux élèves, une équipe)
-- Deux amis affrontent ENSEMBLE une série de questions plus corsées, vies
-- partagées. Même charpente que les duels live (046) : une session porte la
-- GRAINE et la liste PARTAGÉE de questions ; le transport (réponses, présence)
-- passe par Realtime (canal coop-<id>). Écritures via fonctions SECURITY
-- DEFINER (rejoindre une session 'waiting' exige de contourner la RLS).
--
-- PRÉREQUIS : 001 (profiles), 002 (quiz_questions). Idempotent.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.coop_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id      UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  guest_id     UUID REFERENCES public.profiles (id) ON DELETE CASCADE,
  subject      TEXT NOT NULL DEFAULT 'Coop',
  seed         TEXT NOT NULL,
  question_ids UUID[] NOT NULL,
  status       TEXT NOT NULL DEFAULT 'waiting'
               CHECK (status IN ('waiting', 'active', 'done')),
  host_answers  JSONB NOT NULL DEFAULT '[]'::jsonb,
  guest_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (guest_id IS NULL OR guest_id <> host_id)
);

CREATE INDEX IF NOT EXISTS coop_sessions_host_idx
  ON public.coop_sessions (host_id, created_at DESC);
CREATE INDEX IF NOT EXISTS coop_sessions_guest_idx
  ON public.coop_sessions (guest_id, created_at DESC);

ALTER TABLE public.coop_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coop_sessions_select_own" ON public.coop_sessions;
CREATE POLICY "coop_sessions_select_own" ON public.coop_sessions
  FOR SELECT USING (auth.uid() IN (host_id, guest_id));
-- Pas de policy INSERT/UPDATE : tout passe par les fonctions ci-dessous.

-- -----------------------------------------------------------------------------
-- Créer une session coop : l'hôte fixe la matière, la graine et la liste
-- partagée de questions. Renvoie l'id.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_coop(
  p_subject TEXT,
  p_seed TEXT,
  p_question_ids UUID[]
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
  IF p_question_ids IS NULL OR array_length(p_question_ids, 1) IS NULL THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.coop_sessions (host_id, subject, seed, question_ids)
  VALUES (v_user, left(coalesce(p_subject, 'Coop'), 80),
          coalesce(nullif(p_seed, ''), gen_random_uuid()::text),
          p_question_ids)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_coop(TEXT, TEXT, UUID[]) TO authenticated;

-- -----------------------------------------------------------------------------
-- Rejoindre une session en attente. Passe en 'active' et renvoie ses infos
-- partagées, ou NULL si indisponible / la sienne.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.join_coop(p_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_sess public.coop_sessions%ROWTYPE;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  SELECT * INTO v_sess FROM public.coop_sessions WHERE id = p_id FOR UPDATE;
  IF v_sess.id IS NULL THEN RETURN NULL; END IF;
  IF v_sess.host_id = v_user THEN RETURN NULL; END IF;
  IF v_sess.status <> 'waiting' OR v_sess.guest_id IS NOT NULL THEN
    RETURN NULL;
  END IF;

  UPDATE public.coop_sessions
     SET guest_id = v_user, status = 'active'
   WHERE id = p_id;

  RETURN jsonb_build_object(
    'id', v_sess.id,
    'host_id', v_sess.host_id,
    'subject', v_sess.subject,
    'seed', v_sess.seed,
    'question_ids', to_jsonb(v_sess.question_ids)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_coop(UUID) TO authenticated;

-- -----------------------------------------------------------------------------
-- Déposer ses réponses (persistance/historique). Écrit du bon côté ; passe la
-- session en 'done' quand les deux camps ont déposé.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_coop_answers(p_id UUID, p_answers JSONB)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_sess public.coop_sessions%ROWTYPE;
BEGIN
  SELECT * INTO v_sess FROM public.coop_sessions WHERE id = p_id FOR UPDATE;
  IF v_sess.id IS NULL OR v_user IS NULL THEN RETURN false; END IF;

  IF v_user = v_sess.host_id THEN
    UPDATE public.coop_sessions SET host_answers = coalesce(p_answers, '[]'::jsonb)
     WHERE id = p_id;
  ELSIF v_user = v_sess.guest_id THEN
    UPDATE public.coop_sessions SET guest_answers = coalesce(p_answers, '[]'::jsonb)
     WHERE id = p_id;
  ELSE
    RETURN false;
  END IF;

  UPDATE public.coop_sessions
     SET status = 'done'
   WHERE id = p_id
     AND host_answers <> '[]'::jsonb
     AND guest_answers <> '[]'::jsonb;
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_coop_answers(UUID, JSONB) TO authenticated;

-- -----------------------------------------------------------------------------
-- Realtime : l'hôte voit le partenaire arriver (postgres_changes). Ajout
-- idempotent à la publication supabase_realtime.
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
     WHERE pubname = 'supabase_realtime'
       AND schemaname = 'public'
       AND tablename = 'coop_sessions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.coop_sessions;
  END IF;
END;
$$;
