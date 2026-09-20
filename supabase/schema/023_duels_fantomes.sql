-- =============================================================================
-- Scolaria — Migration 023 : duels fantômes. Chaque duel terminé enregistre
-- les manches du joueur (bonnes réponses + temps) ; ses amis affrontent ce
-- « fantôme » — la sensation d'un vrai duel, sans contrainte de présence
-- simultanée. Un enregistrement par élève (le dernier duel joué).
-- La lecture croisée passe par friend_ghosts() (SECURITY DEFINER) : seuls
-- les amis ACCEPTÉS voient ton fantôme, et uniquement le minimum (prénom,
-- manches). PRÉREQUIS : 019 exécutée. Idempotent.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.duel_recordings (
  user_id    UUID PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  -- [{"correct": 4, "time_ms": 23000}, ...] — au plus 3 manches (BO3).
  rounds     JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.duel_recordings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "duel_recordings_select_own" ON public.duel_recordings;
CREATE POLICY "duel_recordings_select_own" ON public.duel_recordings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "duel_recordings_insert_own" ON public.duel_recordings;
CREATE POLICY "duel_recordings_insert_own" ON public.duel_recordings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "duel_recordings_update_own" ON public.duel_recordings;
CREATE POLICY "duel_recordings_update_own" ON public.duel_recordings
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.duel_recordings TO authenticated;

-- Fantômes des amis acceptés : prénom + manches enregistrées, rien d'autre.
CREATE OR REPLACE FUNCTION public.friend_ghosts()
RETURNS TABLE (
  friend_id  UUID,
  full_name  TEXT,
  rounds     JSONB,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    r.user_id,
    p.full_name,
    r.rounds,
    r.updated_at
  FROM public.duel_recordings r
  JOIN public.profiles p ON p.id = r.user_id
  WHERE r.user_id IN (
    SELECT CASE WHEN f.requester_id = auth.uid()
                THEN f.addressee_id ELSE f.requester_id END
    FROM public.friendships f
    WHERE f.status = 'accepted'
      AND auth.uid() IN (f.requester_id, f.addressee_id)
  );
$$;

GRANT EXECUTE ON FUNCTION public.friend_ghosts() TO authenticated;
