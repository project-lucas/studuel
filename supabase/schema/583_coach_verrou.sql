-- =============================================================================
-- Studuel — Migration 583 : PERSONNE NE SE DÉCLARE COACH SOI-MÊME
--
-- La faille (trouvée à la relecture du chantier Studuel+, 15/10/2026) : la 048
-- accorde `GRANT UPDATE (profile_type)` aux élèves (le chemin OAuth de
-- l'onboarding en a besoin pour écrire 'eleve' ou 'parent'), la 560 a ajouté
-- 'coach' aux valeurs permises et fait de `est_coach()` un simple test sur
-- cette colonne, et la 561 laisse tout coach basculer SON compte en Studuel+.
-- Un élève pouvait donc, avec son propre jeton :
--     update profiles set profile_type = 'coach' where id = <moi>;
--     select basculer_studuel_plus_test();
-- et s'offrir Studuel+ à vie — crédits de Marcel, rente de gemmes (580),
-- toutes les annales, et l'espace /coach.
--
-- LA CORRECTION : un déclencheur refuse qu'un compte DEVIENNE coach, sauf
-- par un administrateur ou par le SQL Editor / la clé service (rôles postgres,
-- service_role, supabase_admin). 'eleve' et 'parent' restent libres. Aucun
-- chemin de l'app ne crée de coach : les comptes coach se posent à la main.
-- Un compte déjà coach le reste.
--
-- PRÉREQUIS : 028 (is_admin), 048, 560. Idempotente.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.profiles_garde_coach()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.profile_type = 'coach'
     AND OLD.profile_type IS DISTINCT FROM 'coach'
     AND current_user IN ('authenticated', 'anon')
     AND NOT COALESCE(public.is_admin(), false)
  THEN
    RAISE EXCEPTION 'coach_reserve' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.profiles_garde_coach() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS profiles_garde_coach ON public.profiles;
CREATE TRIGGER profiles_garde_coach
  BEFORE UPDATE OF profile_type ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.profiles_garde_coach();

-- Contrôle à la main, connecté en élève (par l'app ou l'API) :
--   update profiles set profile_type = 'coach' where id = auth.uid();  → erreur coach_reserve
