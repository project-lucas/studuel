-- =============================================================================
-- 362 — LE CLASSEMENT DE L'ÉCOLE SE FAIT AUX TROPHÉES (Lucas, 16/09/2026)
--
-- L'onglet Amis classait les camarades d'un établissement au temps de travail
-- (`profiles.work_seconds`). Le classement se lit désormais aux TROPHÉES
-- (`profiles.trophies`, le compteur des duels classés — migration 079), la
-- même monnaie que le classement entre amis et le rang de saison (lib/rank) :
-- un seul vocabulaire sur tout l'onglet, et les écussons de division
-- (Bronze → Maître) se déverrouillent avec le vrai palier de l'élève.
--
-- CE QUI CHANGE : `clan_mates` renvoie `trophies` à la place de `seconds`, et
-- garde les 50 élèves les MIEUX CLASSÉS aux trophées (plus les plus actifs).
-- Le client (lib/social.buildSchoolBoard) lit `trophies`, à 0 si absent :
-- une base où cette migration n'est pas passée montre donc tout le monde à 0
-- plutôt qu'une page cassée.
--
-- PRÉREQUIS : 079 (profiles.trophies), 242 (la dernière version de clan_mates).
-- Idempotent (CREATE OR REPLACE). À exécuter à la main dans :
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.clan_mates(p_level TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_school UUID;
  v_name   TEXT;
BEGIN
  IF v_user IS NULL OR p_level NOT IN ('primaire', 'college', 'lycee') THEN
    RETURN NULL;
  END IF;

  SELECT CASE p_level
           WHEN 'primaire' THEN primaire_school_id
           WHEN 'college'  THEN college_school_id
           ELSE lycee_school_id
         END
    INTO v_school
    FROM public.profiles WHERE id = v_user;

  IF v_school IS NULL THEN
    RETURN jsonb_build_object('school_name', NULL, 'mates', '[]'::jsonb);
  END IF;
  SELECT name INTO v_name FROM public.schools WHERE id = v_school;

  RETURN jsonb_build_object(
    'school_name', v_name,
    'mates', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'id', p.id,
               'name', split_part(COALESCE(p.full_name, 'Élève'), ' ', 1),
               'trophies', COALESCE(p.trophies, 0))
             ORDER BY COALESCE(p.trophies, 0) DESC, p.id)
        FROM (
          SELECT id, full_name, trophies
            FROM public.profiles
           WHERE (CASE p_level
                    WHEN 'primaire' THEN primaire_school_id
                    WHEN 'college'  THEN college_school_id
                    ELSE lycee_school_id
                  END) = v_school
           ORDER BY COALESCE(trophies, 0) DESC, id
           LIMIT 50
        ) p
    ), '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.clan_mates(TEXT) TO authenticated;
