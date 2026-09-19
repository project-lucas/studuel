-- =============================================================================
-- Studuel — Migration 359 : LES MATIÈRES PRIORITAIRES de l'élève
-- =============================================================================
--
-- POURQUOI. Sur l'accueil Réviser, toutes les matières suivies se valaient :
-- la même grille, dans l'ordre du programme. Or un élève a presque toujours
-- deux ou trois matières qui comptent plus cette semaine (le contrôle qui
-- vient, la matière où il coule). Le 10/09/2026, Lucas : « un bouton pour
-- prioriser les matières, et laisser un espace entre celles cochées et les
-- autres ». Le « ! » de l'accueil Réviser marque ces matières : elles passent
-- en tête de la grille, un espace les sépare des autres.
--
-- C'est un choix de l'ÉLÈVE, à côté des chapitres prioritaires du COACH
-- (qui, eux, remontent dans le dossier de la matière). Les deux se lisent
-- séparément et ne se confondent pas.
--
-- CE QU'ELLE INSTALLE. `profiles.matieres_prioritaires` (JSONB, un tableau de
-- slugs de matières, `[]` par défaut), écrite par l'élève lui-même : GRANT
-- UPDATE par colonne, comme `selected_subjects` (008) et `carnet_prefs` (356)
-- — grant ADDITIF. La relecture tolérante vit dans
-- `lib/matieres-prioritaires.ts` (pur, testé).
--
-- PRÉREQUIS : schema.sql (profiles). Idempotente.
-- À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS matieres_prioritaires JSONB NOT NULL DEFAULT '[]'::jsonb;

GRANT UPDATE (matieres_prioritaires) ON public.profiles TO authenticated;

-- Toujours un tableau : jamais un objet ni un scalaire.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_matieres_prioritaires_tableau;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_matieres_prioritaires_tableau
  CHECK (jsonb_typeof(matieres_prioritaires) = 'array');

-- ------------------------------------------------------------ vérification ---
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'matieres_prioritaires'
  ) THEN
    RAISE EXCEPTION '359 : profiles.matieres_prioritaires absente';
  END IF;
END $$;
