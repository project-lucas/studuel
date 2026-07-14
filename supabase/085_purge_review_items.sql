-- =============================================================================
-- Studuel — Migration 085 : purge des review_items orphelins
-- review_items (SRS/Revanche, migration 021) référence quiz_questions.id ou
-- deck_cards.id par un item_id POLYMORPHE, donc SANS clé étrangère : quand le
-- contenu source est supprimé (studio admin : deleteQuestion, ou deleteLesson/
-- deleteChapter qui cascadent sur quiz_questions), la ligne review_items reste.
-- Un item « en revanche » orphelin ne peut plus jamais être vengé mais reste en
-- TÊTE de la file « À revoir » (in_revanche court-circuite la date d'échéance)
-- et bloque DÉFINITIVEMENT le bonus « Revanche vidée » (claim_revanche_bonus
-- refuse tant qu'il existe un in_revanche).
--
-- review_items n'a ni policy ni GRANT DELETE (021) → impossible à nettoyer côté
-- client. On purge donc par TRIGGER SECURITY DEFINER (bypass RLS, tous élèves),
-- déclenché aussi bien par une suppression directe que par cascade.
--
-- PRÉREQUIS : 002 (quiz_questions), 007 (deck_cards), 021 (review_items).
-- Idempotent.
-- =============================================================================

-- Purge à la suppression d'une question de quiz.
CREATE OR REPLACE FUNCTION public.purge_review_items_for_question()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.review_items
   WHERE item_kind = 'question' AND item_id = OLD.id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_purge_review_items_question ON public.quiz_questions;
CREATE TRIGGER trg_purge_review_items_question
  AFTER DELETE ON public.quiz_questions
  FOR EACH ROW
  EXECUTE FUNCTION public.purge_review_items_for_question();

-- Purge à la suppression d'une carte de deck (flashcards studio).
CREATE OR REPLACE FUNCTION public.purge_review_items_for_card()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.review_items
   WHERE item_kind = 'card' AND item_id = OLD.id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_purge_review_items_card ON public.deck_cards;
CREATE TRIGGER trg_purge_review_items_card
  AFTER DELETE ON public.deck_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.purge_review_items_for_card();
