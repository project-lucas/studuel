-- =============================================================================
-- Scolaria — Migration 028 : espace admin (édition du contenu pédagogique)
-- Ajoute profiles.is_admin + la fonction is_admin(), puis ouvre l'écriture
-- (INSERT/UPDATE/DELETE) du catalogue aux admins via RLS : subjects, chapters,
-- lessons, quizzes, quiz_questions, flashcard_decks, deck_cards.
-- Le serveur continue de n'utiliser que la clé anon — ce sont ces politiques
-- qui autorisent l'écriture, pas une clé service_role.
-- PRÉREQUIS : 002, 007 et 008 exécutées. Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. PROFILES.IS_ADMIN — hors du GRANT UPDATE par colonnes (003/007/008/010/016),
--    donc impossible à s'auto-attribuer via l'API : seul le SQL Editor promeut.
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Vrai si l'utilisateur courant est admin. SECURITY DEFINER : utilisable dans
-- les politiques RLS de n'importe quelle table sans dépendre de celles de
-- profiles.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT p.is_admin FROM public.profiles p WHERE p.id = auth.uid()),
    false
  );
$$;

-- -----------------------------------------------------------------------------
-- 2. POLITIQUES D'ÉCRITURE ADMIN sur le catalogue.
--    FOR ALL = SELECT aussi : l'admin voit tout le contenu premium quel que
--    soit son abonnement (les politiques RLS sont combinées en OR).
-- -----------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.subjects, public.chapters, public.lessons,
     public.quizzes, public.quiz_questions,
     public.flashcard_decks, public.deck_cards
  TO authenticated;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'subjects', 'chapters', 'lessons',
    'quizzes', 'quiz_questions',
    'flashcard_decks', 'deck_cards'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_admin_all', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL
         USING (public.is_admin()) WITH CHECK (public.is_admin())',
      t || '_admin_all', t
    );
  END LOOP;
END $$;

-- -----------------------------------------------------------------------------
-- 3. PROMOTION du compte de Lucas.
-- -----------------------------------------------------------------------------
UPDATE public.profiles
SET is_admin = true
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'potierlucas77360@gmail.com'
);
