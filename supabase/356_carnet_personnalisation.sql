-- =============================================================================
-- Studuel — Migration 356 : LE CARNET PERSONNALISABLE, à l'échelle du carnet
-- =============================================================================
--
-- POURQUOI. Le carnet se réglait PAR COURS (plafonds, tolérance, date de
-- contrôle, matière — 315/316) et pas du tout dans son ensemble. Un étudiant de
-- master en droit et une élève de 6e avaient exactement le même écran : le même
-- ordre de dossiers, la même forme de liste, aucun objectif du jour, aucune
-- façon de dire « ce dossier passe devant » ou « celui-là est fini, range-le ».
--
-- CE QU'ELLE INSTALLE.
--   1. `profiles.carnet_prefs` (JSONB) — les préférences du carnet : objectif
--      de cartes par jour, ordre des dossiers, grille ou liste, brouillons
--      visibles, session par défaut (mode, sens, longueur). La forme et les
--      bornes vivent dans `lib/carnet/preferences.ts` (pur, testé) ; la base ne
--      stocke qu'un sac de clés, relu avec tolérance.
--   2. Sur `carnet_courses` : `epingle` (le dossier passe devant, quel que soit
--      l'ordre), `archive` (rangé : hors de la grille et hors du cours
--      prioritaire, jamais supprimé), `objectif` (une ligne libre — « Partiel de
--      droit des obligations, 14 juin »).
--
-- LES DROITS. `carnet_prefs` est écrite directement par l'élève : GRANT UPDATE
-- par colonne, comme `avatar` (082) et `gamertag` (200) — grant ADDITIF, il
-- s'empile sur les colonnes déjà accordées. `carnet_courses` est déjà
-- owner-only (186, policy `carnet_courses_all_own`) : les trois colonnes en
-- héritent sans rien ajouter.
--
-- PRÉREQUIS : schema.sql (profiles), 186 (carnet_courses). Idempotente.
-- À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ------------------------------------------------------ 1. les préférences ---
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS carnet_prefs JSONB NOT NULL DEFAULT '{}'::jsonb;

GRANT UPDATE (carnet_prefs) ON public.profiles TO authenticated;

-- Un sac de clés reste un objet : jamais un tableau ni un scalaire, ce que
-- `normaliserPreferences` tolérerait mais qu'aucun écran n'écrit.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_carnet_prefs_objet;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_carnet_prefs_objet
  CHECK (jsonb_typeof(carnet_prefs) = 'object');

-- ---------------------------------------------------- 2. le dossier de cours ---
ALTER TABLE public.carnet_courses
  ADD COLUMN IF NOT EXISTS epingle  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS archive  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS objectif TEXT;

ALTER TABLE public.carnet_courses DROP CONSTRAINT IF EXISTS carnet_courses_objectif_len;
ALTER TABLE public.carnet_courses ADD CONSTRAINT carnet_courses_objectif_len
  CHECK (objectif IS NULL OR char_length(objectif) <= 120);

-- ------------------------------------------------------------ vérification ---
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'carnet_prefs'
  ) THEN
    RAISE EXCEPTION '356 : profiles.carnet_prefs absente';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'carnet_courses' AND column_name = 'objectif'
  ) THEN
    RAISE EXCEPTION '356 : carnet_courses.objectif absente';
  END IF;
END $$;
