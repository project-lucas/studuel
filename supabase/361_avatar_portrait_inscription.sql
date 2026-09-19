-- =============================================================================
-- Studuel — Migration 361 : le blason de joueur choisi à l'onboarding
--
-- L'écran « Ton avatar » (/bienvenue, entre le mini-quiz et le compte) fait
-- choisir un des treize blasons peints (lib/portraits.ts). Le choix voyage dans
-- le metadata d'inscription sous la clé `avatar` : `{ "portrait": "7" }`, le
-- même JSON que la colonne `profiles.avatar` (082) attend — `normalizeAvatarConfig`
-- complète les autres champs à la lecture.
--
-- handle_new_user (048) ne recopiait pas cette clé : sans session (confirmation
-- d'e-mail active), le choix était perdu. On l'ajoute ici. Les inscriptions sans
-- metadata (OAuth, /login) laissent la colonne NULL ; le retour OAuth de
-- /bienvenue l'écrit par applyOnboarding (GRANT UPDATE (avatar), déjà en 082).
--
-- Idempotente : CREATE OR REPLACE + DROP TRIGGER IF EXISTS. À exécuter à la
-- main dans le SQL Editor du dashboard.
-- =============================================================================

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
    onboarded,
    avatar
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
    COALESCE((meta ->> 'onboarded')::boolean, false),
    -- Le blason : un objet JSON, ou rien. L'application re-valide la clé du
    -- portrait à chaque lecture (liste fermée) — la base ne stocke que le choix.
    CASE
      WHEN jsonb_typeof(meta -> 'avatar') = 'object' THEN meta -> 'avatar'
      ELSE NULL
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Le trigger existe déjà (schema.sql / 031 / 048) ; recréé par sécurité (rejouable).
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
