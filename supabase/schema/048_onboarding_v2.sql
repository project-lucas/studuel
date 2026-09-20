-- =============================================================================
-- Scolaria / Studuel — Migration 048 : onboarding v2 (parcours /bienvenue)
-- PRÉREQUIS : 001, 007, 008, 031 exécutées. Idempotent (rejouable sans risque).
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
--
-- Le parcours d'accueil « façon Duolingo » (14 écrans) collecte de nouvelles
-- réponses : profil (élève/parent), objectif n°1, source d'acquisition, objectif
-- quotidien en MINUTES, niveau de placement, intention notifications. On ajoute
-- les colonnes, on étend le GRANT (self-update) et le trigger handle_new_user.
-- La colonne legacy `daily_goal` (sessions/jour) est conservée et dérivée des
-- minutes côté app (rien ne casse pour la capacité / la série).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Nouvelles colonnes de profil (toutes optionnelles / à défaut sûr).
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS profile_type        TEXT,
  ADD COLUMN IF NOT EXISTS daily_goal_minutes  INT NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS acquisition_source  TEXT,
  ADD COLUMN IF NOT EXISTS main_goal           TEXT,
  ADD COLUMN IF NOT EXISTS placement_level     TEXT,
  ADD COLUMN IF NOT EXISTS notify_opt_in       BOOLEAN NOT NULL DEFAULT false;

-- Garde-fous (ajoutés seulement s'ils n'existent pas déjà — idempotent).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_profile_type_chk'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_profile_type_chk
      CHECK (profile_type IS NULL OR profile_type IN ('eleve', 'parent'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_daily_goal_minutes_chk'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_daily_goal_minutes_chk
      CHECK (daily_goal_minutes IN (3, 10, 15, 30));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_placement_level_chk'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_placement_level_chk
      CHECK (placement_level IS NULL
             OR placement_level IN ('debutant', 'intermediaire', 'avance'));
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 2. GRANT : l'élève peut mettre à jour ses propres nouvelles colonnes.
--    (RLS profiles = « soi uniquement » ; le GRANT ouvre les colonnes ciblées.)
--    Sert au chemin OAuth (applyOnboarding), qui met à jour le profil après coup.
-- -----------------------------------------------------------------------------
GRANT UPDATE (
  profile_type,
  daily_goal_minutes,
  acquisition_source,
  main_goal,
  placement_level,
  notify_opt_in
) ON public.profiles TO authenticated;

-- -----------------------------------------------------------------------------
-- 3. handle_new_user étendu : recopie les réponses du metadata (inscription par
--    e-mail) dans le profil dès la création du compte — même si la confirmation
--    d'email est active (aucune session serveur à ce moment). Les inscriptions
--    sans metadata (OAuth, /login classique) retombent sur les défauts.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta jsonb := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    grade_level,
    daily_goal,
    daily_goal_minutes,
    selected_subjects,
    profile_type,
    acquisition_source,
    main_goal,
    placement_level,
    notify_opt_in,
    onboarded
  )
  VALUES (
    NEW.id,
    meta ->> 'full_name',
    meta ->> 'grade_level',
    COALESCE((meta ->> 'daily_goal')::int, 1),
    COALESCE((meta ->> 'daily_goal_minutes')::int, 10),
    CASE
      WHEN jsonb_typeof(meta -> 'selected_subjects') = 'array'
        THEN meta -> 'selected_subjects'
      ELSE NULL
    END,
    CASE
      WHEN meta ->> 'profile_type' IN ('eleve', 'parent')
        THEN meta ->> 'profile_type'
      ELSE NULL
    END,
    meta ->> 'acquisition_source',
    meta ->> 'main_goal',
    CASE
      WHEN meta ->> 'placement_level' IN ('debutant', 'intermediaire', 'avance')
        THEN meta ->> 'placement_level'
      ELSE NULL
    END,
    COALESCE((meta ->> 'notify_opt_in')::boolean, false),
    COALESCE((meta ->> 'onboarded')::boolean, false)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Le trigger existe déjà (schema.sql / 031) ; recréé par sécurité (rejouable).
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
