-- =============================================================================
-- Studuel — Migration 214 : le plan de préparation ne s'effondre plus en un jour
--
-- LE DÉFAUT (audit du 2026-07-31, cycle 2 /jour) :
-- `complete_prep_session_for_quiz` (203) coche LA session « à faire » la plus
-- actionnable du chapitre du quiz, à CHAQUE quiz terminé (recordTestSession).
-- Or un plan pose plusieurs sessions sur le MÊME chapitre, à des jours
-- différents (J-4 / J-2 / J-1 : c'est TOUT l'intérêt, étaler la révision).
-- Rejouer le même quiz trois fois de suite le même jour cochait donc les trois
-- sessions d'un coup : le plan passait « terminé » sans la moindre répétition
-- espacée. Aucune monnaie n'était sur-créditée (la RPC ne verse qu'un statut),
-- mais l'invariant PÉDAGOGIQUE de la feature était contournable en silence.
--
-- LE CORRECTIF : au plus UNE session cochée par (contrôle, chapitre) et par jour
-- UTC. La colonne `done_at` (203) date déjà chaque complétion — on s'en sert
-- pour écarter tout candidat dont un frère (même contrôle, même chapitre) a déjà
-- été coché aujourd'hui. Rejouer le quiz le même jour ne trouve alors plus de
-- session éligible (renvoie FALSE) ; le lendemain, l'exclusion se lève et la
-- session suivante peut se cocher. La répétition espacée est préservée.
--
-- Reprise idempotente d'une fonction de la 203 (déjà exécutée) : on ne modifie
-- JAMAIS une migration passée, on la remplace par une nouvelle. Plus STRICTE
-- seulement — aucun parcours légitime existant n'est cassé (une seule session
-- par jour et par chapitre était déjà le comportement attendu). Ne touche aucun
-- schéma, ne crédite rien, ne supprime rien.
--
-- PRÉREQUIS : 203_plan_preparation.sql (controles, sessions_preparation, done_at).
-- Idempotente. À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor.
-- Astuce : sélectionne TOUT le fichier (Ctrl+A) avant de lancer.
-- =============================================================================

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
     -- Au plus UNE session cochée par (contrôle, chapitre) et par jour UTC :
     -- rejouer le même quiz aujourd'hui ne consomme pas la session de demain.
     AND NOT EXISTS (
       SELECT 1
         FROM public.sessions_preparation d
        WHERE d.user_id = v_user
          AND d.controle_id = s.controle_id
          AND d.chapter_id = s.chapter_id
          AND d.status = 'faite'
          AND d.done_at IS NOT NULL
          AND (d.done_at AT TIME ZONE 'utc')::date = v_today
     )
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

-- --- Vérification (connecté en tant qu'élève, un contrôle avec ≥2 sessions
--     sur le même chapitre, dont une « à faire ») --------------------------------
--   select public.complete_prep_session_for_quiz('<quiz_du_chapitre>'); → true
--   select public.complete_prep_session_for_quiz('<même_quiz>');        → false
--     (une session déjà cochée pour ce chapitre aujourd'hui : la suivante
--      attend demain)
