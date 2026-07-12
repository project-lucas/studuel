-- =============================================================================
-- Scolaria — Migration 017 : plafond quotidien de sessions (anti-farming)
-- Rien n'empêchait d'appeler les actions d'enregistrement en boucle pour
-- gonfler série, XP et heatmap. Un trigger BEFORE INSERT borne le nombre de
-- sessions par utilisateur et par jour (UTC, comme les clés de jour de l'app).
-- Les plafonds sont larges : aucun élève réel ne les atteint, seul un script
-- les dépasse. Côté app, l'erreur remonte en { saved: false } — sans casse.
-- lesson_completions n'est pas concernée : bornée naturellement (une ligne
-- par leçon, upsert idempotent).
-- PRÉREQUIS : 011 exécutée. Idempotent.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.enforce_daily_session_cap()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  cap INT := TG_ARGV[0]::INT;
  n   INT;
BEGIN
  EXECUTE format(
    'SELECT count(*) FROM %I.%I WHERE user_id = $1 AND created_at >= date_trunc(''day'', now())',
    TG_TABLE_SCHEMA, TG_TABLE_NAME
  ) INTO n USING NEW.user_id;

  IF n >= cap THEN
    RAISE EXCEPTION 'daily session cap reached (% per day) on %', cap, TG_TABLE_NAME
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS challenge_sessions_daily_cap ON public.challenge_sessions;
CREATE TRIGGER challenge_sessions_daily_cap
  BEFORE INSERT ON public.challenge_sessions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_daily_session_cap('30');

DROP TRIGGER IF EXISTS test_sessions_daily_cap ON public.test_sessions;
CREATE TRIGGER test_sessions_daily_cap
  BEFORE INSERT ON public.test_sessions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_daily_session_cap('100');

DROP TRIGGER IF EXISTS study_sessions_daily_cap ON public.study_sessions;
CREATE TRIGGER study_sessions_daily_cap
  BEFORE INSERT ON public.study_sessions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_daily_session_cap('100');
