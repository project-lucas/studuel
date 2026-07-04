-- =============================================================================
-- Scolaria — Migration 006 : date d'examen sur le tableau de révision
-- Permet le compte à rebours (« Bac oral dans 42 jours ») et la priorisation
-- des sessions par proximité d'échéance.
-- PRÉREQUIS : 005_revision_board.sql exécuté. Idempotent.
-- =============================================================================

ALTER TABLE public.revision_subjects
  ADD COLUMN IF NOT EXISTS exam_date DATE;
