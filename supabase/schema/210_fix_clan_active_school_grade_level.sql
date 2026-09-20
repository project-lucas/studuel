-- 210 — Correctif du clan hebdo : `clan_active_school` lisait `profiles.grade`,
-- une colonne qui N'EXISTE PAS (la classe de l'élève vit dans `grade_level`).
-- Conséquence en prod : toute lecture du tableau de la semaine
-- (RPC clan_week_board → clan_active_school) échouait avec
-- « column "grade" does not exist », la carte du clan restait invisible et la
-- contribution (clan_week_contribute) ne créditait jamais rien.
--
-- La 204 étant déjà exécutée, on ne la modifie pas : on REDÉFINIT la fonction
-- (CREATE OR REPLACE = idempotent), même signature, même sémantique — seule la
-- colonne change. Miroir de lib/clan.schoolLevelForGrade (lycée = 2de/1re/Tle).

CREATE OR REPLACE FUNCTION public.clan_active_school(p_user UUID)
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_grade  TEXT;
  v_school UUID;
BEGIN
  SELECT grade_level,
         CASE WHEN grade_level IN ('2de', '1re', 'Tle')
              THEN lycee_school_id ELSE college_school_id END
    INTO v_grade, v_school
    FROM public.profiles WHERE id = p_user;
  RETURN v_school;
END;
$$;
