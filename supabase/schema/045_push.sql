-- =============================================================================
-- Studuel — Migration 045 : abonnements push (Web Push / VAPID)
--   - push_subscriptions : un abonnement par appareil (endpoint unique) ;
--     l'élève ne voit/gère que les siens (RLS « soi uniquement »).
--   - push_srs_targets(p_today) : fonction SECURITY DEFINER utilisée par le
--     cron d'envoi (route /api/push/send, clé service_role) pour lister les
--     élèves abonnés qui ont des cartes à revoir aujourd'hui, avec la matière
--     la plus fournie. Évite au serveur de recharger toute la file SRS.
--
-- PRÉREQUIS : 001 (profiles), 021 (review_items). Idempotent.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  endpoint   TEXT NOT NULL,
  p256dh     TEXT NOT NULL,
  auth       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (endpoint)
);

CREATE INDEX IF NOT EXISTS push_subscriptions_user_idx
  ON public.push_subscriptions (user_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- L'élève gère ses propres abonnements (l'endpoint identifie l'appareil).
DROP POLICY IF EXISTS "push_subscriptions_select_own" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_select_own" ON public.push_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "push_subscriptions_insert_own" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_insert_own" ON public.push_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "push_subscriptions_update_own" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_update_own" ON public.push_subscriptions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "push_subscriptions_delete_own" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_delete_own" ON public.push_subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Cibles du rappel SRS : élèves abonnés ayant des cartes dues à p_today.
-- Une carte est due si due_date <= aujourd'hui OU si elle est en Revanche.
-- Renvoie l'endpoint + clés pour l'envoi direct, le nombre de cartes et la
-- matière la plus représentée.
-- Appelée avec la clé service_role (RLS contournée) par le cron.
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
    JOIN due d ON d.user_id = ps.user_id;
$$;

-- N'accorder l'exécution qu'au rôle service (le cron). Pas 'authenticated'.
REVOKE ALL ON FUNCTION public.push_srs_targets(DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.push_srs_targets(DATE) TO service_role;

-- -----------------------------------------------------------------------------
-- Cibles du rappel « série en danger » (le soir) : élèves abonnés actifs HIER
-- mais pas aujourd'hui — leur série va se rompre à minuit. Renvoie la longueur
-- de la série courante (gaps-and-islands sur les jours d'activité).
-- L'activité = quiz / révision / leçon / défi (mêmes sources que la série).
-- -----------------------------------------------------------------------------
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
   WHERE c.last_day = p_today - 1;  -- actif hier, pas aujourd'hui
$$;

REVOKE ALL ON FUNCTION public.push_streak_targets(DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.push_streak_targets(DATE) TO service_role;
