-- =============================================================================
-- Scolaria — Migration 016 : droit d'écriture sur le bilan de capacités
-- La migration 013 a ajouté profiles.capacity_quiz mais sans l'inclure dans
-- le GRANT UPDATE par colonnes (le REVOKE global de 003/007/008/010 s'applique).
-- Résultat : saveCapacityQuiz échouait en silence (permission denied).
-- On réémet le grant complet, capacity_quiz inclus. work_seconds reste exclu
-- (écrit uniquement via la fonction add_work_time), subscription_tier aussi.
-- PRÉREQUIS : 013 exécutée. Idempotent.
-- =============================================================================

REVOKE UPDATE ON public.profiles FROM authenticated, anon;
GRANT  UPDATE (full_name, grade_level, daily_goal, onboarded, selected_subjects, commute_slots, capacity_quiz)
  ON public.profiles TO authenticated;
