-- =============================================================================
-- Studuel — Migration 195 : journal d'envoi des rappels push (idempotence)
--
-- Le problème : le cron d'envoi ne gardait AUCUNE trace de ce qu'il avait
-- envoyé. Un rejeu (retry Vercel après un timeout, redéploiement, déclenchement
-- manuel) re-notifiait donc tout le monde une seconde fois — alors que le reset
-- de ligue, lui, est idempotent depuis le premier jour.
--
--   - push_send_log : une ligne par (élève, type de rappel, jour d'envoi).
--   - push_srs_targets / push_streak_targets : écartent désormais les élèves
--     déjà notifiés le même jour pour le même type.
--
-- La clé primaire (user_id, kind, sent_on) fait tout le travail : elle interdit
-- structurellement le doublon, et le filtre des RPC évite même de recontacter
-- le service de push.
--
-- ⚠️ ORDRE : cette migration est SÛRE à exécuter avant ou après le déploiement
-- du code. Avant, le journal reste vide et les RPC se comportent comme avant.
-- Après, le code écrit dans un journal qui existe. Dans l'ordre inverse (code
-- déployé, migration pas passée), l'écriture échoue et n'est que journalisée —
-- l'envoi, lui, a déjà eu lieu.
--
-- PRÉREQUIS : 001 (profiles), 045 (push_subscriptions + les 2 RPC). Idempotent.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.push_send_log (
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  kind    TEXT NOT NULL,
  sent_on DATE NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, kind, sent_on)
);

-- Le CHECK est posé à part pour rester idempotent (ADD CONSTRAINT IF NOT EXISTS
-- n'existe pas en Postgres).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'push_send_log_kind_check'
  ) THEN
    ALTER TABLE public.push_send_log
      ADD CONSTRAINT push_send_log_kind_check
      CHECK (kind IN ('srs', 'streak'));
  END IF;
END $$;

-- Sert au ménage périodique (le cron purge au-delà de 30 jours).
CREATE INDEX IF NOT EXISTS push_send_log_sent_on_idx
  ON public.push_send_log (sent_on);

ALTER TABLE public.push_send_log ENABLE ROW LEVEL SECURITY;

-- AUCUNE policy, volontairement : ce journal n'appartient pas à l'élève, il
-- appartient au cron. Seule la clé service_role (qui contourne la RLS) l'écrit
-- et le lit ; avec la RLS active et zéro policy, la clé anon publique ne voit
-- rien, même en requête directe.
REVOKE ALL ON public.push_send_log FROM anon, authenticated;
GRANT ALL ON public.push_send_log TO service_role;

-- -----------------------------------------------------------------------------
-- Les deux RPC de ciblage, à l'identique de la 045 mais sans les élèves déjà
-- notifiés aujourd'hui pour ce type de rappel.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.push_srs_targets(p_today DATE)
RETURNS TABLE (
  user_id     UUID,
  endpoint    TEXT,
  p256dh      TEXT,
  auth        TEXT,
  due_count   BIGINT,
  top_subject TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH due AS (
    SELECT ri.user_id,
           count(*) AS due_count,
           mode() WITHIN GROUP (ORDER BY ri.subject) AS top_subject
      FROM public.review_items ri
     WHERE ri.due_date <= p_today OR ri.in_revanche
     GROUP BY ri.user_id
  )
  SELECT ps.user_id,
         ps.endpoint,
         ps.p256dh,
         ps.auth,
         d.due_count,
         d.top_subject
    FROM public.push_subscriptions ps
    JOIN due d ON d.user_id = ps.user_id
   WHERE NOT EXISTS (
           SELECT 1 FROM public.push_send_log l
            WHERE l.user_id = ps.user_id
              AND l.kind = 'srs'
              AND l.sent_on = p_today
         );
$$;

REVOKE ALL ON FUNCTION public.push_srs_targets(DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.push_srs_targets(DATE) TO service_role;

CREATE OR REPLACE FUNCTION public.push_streak_targets(p_today DATE)
RETURNS TABLE (
  user_id  UUID,
  endpoint TEXT,
  p256dh   TEXT,
  auth     TEXT,
  streak   INT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH act AS (
    SELECT DISTINCT user_id, (created_at AT TIME ZONE 'utc')::date AS d
      FROM (
        SELECT user_id, created_at FROM public.test_sessions
        UNION ALL
        SELECT user_id, created_at FROM public.study_sessions
        UNION ALL
        SELECT user_id, created_at FROM public.lesson_completions
        UNION ALL
        SELECT user_id, created_at FROM public.challenge_sessions
      ) u
     WHERE created_at >= now() - INTERVAL '120 days'
  ),
  ranked AS (
    SELECT user_id, d,
           d - (row_number() OVER (PARTITION BY user_id ORDER BY d))::int AS grp
      FROM act
  ),
  islands AS (
    SELECT user_id, count(*)::int AS len, max(d) AS last_day
      FROM ranked
     GROUP BY user_id, grp
  ),
  current AS (
    SELECT DISTINCT ON (user_id) user_id, len, last_day
      FROM islands
     ORDER BY user_id, last_day DESC
  )
  SELECT ps.user_id, ps.endpoint, ps.p256dh, ps.auth, c.len
    FROM public.push_subscriptions ps
    JOIN current c ON c.user_id = ps.user_id
   WHERE c.last_day = p_today - 1  -- actif hier, pas aujourd'hui
     AND NOT EXISTS (
           SELECT 1 FROM public.push_send_log l
            WHERE l.user_id = ps.user_id
              AND l.kind = 'streak'
              AND l.sent_on = p_today
         );
$$;

REVOKE ALL ON FUNCTION public.push_streak_targets(DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.push_streak_targets(DATE) TO service_role;
