-- 031 — Parcours d'accueil « façon Duolingo » (page /bienvenue)
-- ---------------------------------------------------------------------------
-- Le parcours d'accueil se fait AVANT la création de compte : les réponses
-- (classe, matières, objectif, motivation, source) sont transmises dans le
-- metadata utilisateur à l'inscription. On étend handle_new_user pour les
-- recopier dans le profil dès la création du compte — donc même quand la
-- confirmation d'email est active (aucune session côté serveur à ce moment).
--
-- Idempotent : CREATE OR REPLACE. Rejouable sans risque. Les inscriptions
-- sans metadata d'accueil (page /login classique) retombent sur les valeurs
-- par défaut des colonnes — comportement inchangé.

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
    selected_subjects,
    onboarded
  )
  VALUES (
    NEW.id,
    meta ->> 'full_name',
    meta ->> 'grade_level',
    COALESCE((meta ->> 'daily_goal')::int, 1),
    CASE
      WHEN jsonb_typeof(meta -> 'selected_subjects') = 'array'
        THEN meta -> 'selected_subjects'
      ELSE NULL
    END,
    COALESCE((meta ->> 'onboarded')::boolean, false)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Le trigger existe déjà (schema.sql) ; on le recrée par sécurité (rejouable).
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
