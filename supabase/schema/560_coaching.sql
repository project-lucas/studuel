-- =============================================================================
-- 560 — LA COUCHE « COACHING », v1 (13/10/2026)
--
-- Lucas : « le joueur de basket cliquera "j'ai un code", créera son compte et
-- sera automatiquement ajouté à mon interface coach ; mon interface doit être
-- d'excellente qualité pour un suivi global de centaines de joueurs, en
-- mettant en avant ceux qui sont en retard ».
--
-- Ce que fait cette migration :
--   1. le rôle : `profiles.profile_type` accepte 'coach' (la contrainte 048) ;
--      un coach est un compte 'coach', ou un admin (is_admin, 028) ;
--   2. `coach_groupes` : un groupe appartient à un coach, porte un nom, une
--      catégorie (U15, U17…) et un CODE à 8 caractères (l'alphabet du code
--      ami, 019 : sans 0/O/1/I/L), régénérable, archivable ;
--   3. `coach_membres` : le rattachement d'un élève à un groupe (un seul
--      rattachement actif par élève), daté, révocable par l'élève ou le coach ;
--   4. les RPC du coach (créer, renommer, régénérer le code, archiver,
--      retirer, lire ses groupes, `coach_tableau` — UNE lecture pour cent
--      élèves —, `coach_fiche_eleve`) et de l'élève (`coach_code_apercu`,
--      ouverte à anon : l'onboarding est public ; `rattachement_par_code`,
--      `mon_rattachement`, `rattachement_quitter`) ;
--   5. `child_dashboard` (319) est refactorisée : son corps devient
--      `eleve_tableau_de_bord` (interne, sans droit d'exécution), et deux
--      portes le servent — `child_dashboard` (le lien parent) et
--      `coach_fiche_eleve` (le lien coach). Même JSON, mêmes clés.
--
-- Comme pour le parent (044, 172) : aucune lecture inter-comptes par policy,
-- tout passe par des RPC SECURITY DEFINER qui vérifient le lien. Le coach ne
-- lit que : prénom, pseudo, classe, activité, temps, scores par matière,
-- contrôles à venir — jamais les amis, les achats, l'avatar dessiné.
--
-- PRÉREQUIS : 028 (is_admin), 044 (parent_children), 048 (profile_type),
-- 084 (work_daily), 192 (xp_events), 200 (gamertag), 319 (child_dashboard).
-- Idempotente (IF NOT EXISTS, CREATE OR REPLACE, contrainte vérifiée avant
-- d'être remplacée). À exécuter à la main : Supabase Dashboard → SQL Editor.
-- =============================================================================

-- ------------------------------------------------------------- 1. le rôle ---
DO $$
DECLARE v_def TEXT;
BEGIN
  SELECT pg_get_constraintdef(oid) INTO v_def
    FROM pg_constraint
   WHERE conname = 'profiles_profile_type_chk'
     AND conrelid = 'public.profiles'::regclass;
  IF v_def IS NOT NULL AND v_def NOT LIKE '%coach%' THEN
    ALTER TABLE public.profiles DROP CONSTRAINT profiles_profile_type_chk;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_profile_type_chk'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_profile_type_chk
      CHECK (profile_type IS NULL OR profile_type IN ('eleve', 'parent', 'coach'));
  END IF;
END;
$$;

-- Un coach : un compte 'coach', ou un admin (Lucas est admin).
CREATE OR REPLACE FUNCTION public.est_coach()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
     WHERE id = auth.uid()
       AND (profile_type = 'coach' OR is_admin = true)
  );
$$;
REVOKE ALL ON FUNCTION public.est_coach() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.est_coach() TO authenticated;

-- ---------------------------------------------------------- 2. les groupes ---
CREATE TABLE IF NOT EXISTS public.coach_groupes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id    UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  nom         TEXT NOT NULL CHECK (char_length(nom) BETWEEN 1 AND 60),
  categorie   TEXT CHECK (categorie IS NULL OR char_length(categorie) <= 30),
  code        TEXT NOT NULL UNIQUE,
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now(),
  archive_le  TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS coach_groupes_coach_idx ON public.coach_groupes (coach_id);

ALTER TABLE public.coach_groupes ENABLE ROW LEVEL SECURITY;
-- Le coach lit ses groupes ; tout le reste passe par les RPC.
DROP POLICY IF EXISTS coach_groupes_select_own ON public.coach_groupes;
CREATE POLICY coach_groupes_select_own ON public.coach_groupes
  FOR SELECT USING (coach_id = (SELECT auth.uid()));
REVOKE ALL ON TABLE public.coach_groupes FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.coach_groupes TO authenticated;

-- Le code d'un groupe : 8 caractères de l'alphabet du code ami (019), unique.
CREATE OR REPLACE FUNCTION public.coach_generer_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars CONSTANT TEXT := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  -- `v_` : nommée `code`, la variable était ambiguë avec la colonne (attrapé
  -- au rejeu PGlite).
  v_code TEXT;
BEGIN
  LOOP
    v_code := '';
    FOR i IN 1..8 LOOP
      v_code := v_code || substr(chars, 1 + floor(random() * length(chars))::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.coach_groupes g WHERE g.code = v_code);
  END LOOP;
  RETURN v_code;
END;
$$;
REVOKE ALL ON FUNCTION public.coach_generer_code() FROM PUBLIC, anon, authenticated;

-- ----------------------------------------------------- 3. les rattachements ---
CREATE TABLE IF NOT EXISTS public.coach_membres (
  groupe_id    UUID NOT NULL REFERENCES public.coach_groupes (id) ON DELETE CASCADE,
  eleve_id     UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  statut       TEXT NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'revoque')),
  rattache_le  TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoque_le   TIMESTAMPTZ,
  revoque_par  TEXT CHECK (revoque_par IS NULL OR revoque_par IN ('eleve', 'coach')),
  PRIMARY KEY (groupe_id, eleve_id)
);
-- Un seul rattachement ACTIF par élève : rejoindre un autre groupe quitte le
-- précédent (la RPC le fait), la base l'interdit de toute façon.
CREATE UNIQUE INDEX IF NOT EXISTS coach_membres_un_actif
  ON public.coach_membres (eleve_id) WHERE statut = 'actif';
CREATE INDEX IF NOT EXISTS coach_membres_groupe_actif_idx
  ON public.coach_membres (groupe_id) WHERE statut = 'actif';

ALTER TABLE public.coach_membres ENABLE ROW LEVEL SECURITY;
-- L'élève lit son propre rattachement (transparence) ; le coach lit par RPC.
DROP POLICY IF EXISTS coach_membres_select_own ON public.coach_membres;
CREATE POLICY coach_membres_select_own ON public.coach_membres
  FOR SELECT USING (eleve_id = (SELECT auth.uid()));
REVOKE ALL ON TABLE public.coach_membres FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.coach_membres TO authenticated;

-- ------------------------------------------------------- 4a. RPC du coach ---

CREATE OR REPLACE FUNCTION public.coach_creer_groupe(p_nom TEXT, p_categorie TEXT DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF auth.uid() IS NULL OR NOT public.est_coach() THEN
    RAISE EXCEPTION 'coach_requis';
  END IF;
  IF p_nom IS NULL OR char_length(trim(p_nom)) = 0 THEN
    RAISE EXCEPTION 'nom_requis';
  END IF;
  INSERT INTO public.coach_groupes (coach_id, nom, categorie, code)
  VALUES (auth.uid(), left(trim(p_nom), 60), NULLIF(left(trim(COALESCE(p_categorie, '')), 30), ''), public.coach_generer_code())
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.coach_creer_groupe(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_creer_groupe(TEXT, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.coach_renommer_groupe(p_groupe UUID, p_nom TEXT, p_categorie TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR p_nom IS NULL OR char_length(trim(p_nom)) = 0 THEN RETURN false; END IF;
  UPDATE public.coach_groupes
     SET nom = left(trim(p_nom), 60),
         categorie = NULLIF(left(trim(COALESCE(p_categorie, '')), 30), '')
   WHERE id = p_groupe AND coach_id = auth.uid();
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.coach_renommer_groupe(UUID, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_renommer_groupe(UUID, TEXT, TEXT) TO authenticated;

-- Un nouveau code : l'ancien cesse de marcher aussitôt (les membres restent).
CREATE OR REPLACE FUNCTION public.coach_regenerer_code(p_groupe UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code TEXT;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NULL; END IF;
  v_code := public.coach_generer_code();
  UPDATE public.coach_groupes SET code = v_code
   WHERE id = p_groupe AND coach_id = auth.uid() AND archive_le IS NULL;
  IF NOT FOUND THEN RETURN NULL; END IF;
  RETURN v_code;
END;
$$;
REVOKE ALL ON FUNCTION public.coach_regenerer_code(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_regenerer_code(UUID) TO authenticated;

-- Archiver : le code ne marche plus, le groupe sort du tableau ; rien n'est
-- effacé (les rattachements restent lisibles par l'élève, et réactivables si
-- le groupe est désarchivé un jour par SQL).
CREATE OR REPLACE FUNCTION public.coach_archiver_groupe(p_groupe UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  UPDATE public.coach_groupes SET archive_le = now()
   WHERE id = p_groupe AND coach_id = auth.uid() AND archive_le IS NULL;
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.coach_archiver_groupe(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_archiver_groupe(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.coach_retirer_eleve(p_groupe UUID, p_eleve UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  UPDATE public.coach_membres m
     SET statut = 'revoque', revoque_le = now(), revoque_par = 'coach'
    FROM public.coach_groupes g
   WHERE g.id = m.groupe_id AND g.coach_id = auth.uid()
     AND m.groupe_id = p_groupe AND m.eleve_id = p_eleve AND m.statut = 'actif';
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.coach_retirer_eleve(UUID, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_retirer_eleve(UUID, UUID) TO authenticated;

-- Mes groupes, avec leur effectif actif (archivés compris, pour les retrouver).
CREATE OR REPLACE FUNCTION public.coach_mes_groupes()
RETURNS TABLE (
  id UUID, nom TEXT, categorie TEXT, code TEXT, cree_le TIMESTAMPTZ, archive_le TIMESTAMPTZ, membres INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT g.id, g.nom, g.categorie, g.code, g.cree_le, g.archive_le,
         (SELECT count(*)::int FROM public.coach_membres m
           WHERE m.groupe_id = g.id AND m.statut = 'actif') AS membres
    FROM public.coach_groupes g
   WHERE g.coach_id = auth.uid()
   ORDER BY g.archive_le NULLS FIRST, g.cree_le ASC;
$$;
REVOKE ALL ON FUNCTION public.coach_mes_groupes() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_mes_groupes() TO authenticated;

-- LE TABLEAU : une ligne par élève actif des groupes du coach (ou d'un seul
-- groupe), avec tout ce que l'écran affiche — en UNE lecture. Le statut
-- (rouge / orange / vert / nouveau) est calculé par l'app (lib/coach/statut.ts,
-- pur et testé) depuis ces agrégats.
--
--   derniere_activite : le dernier jour avec du temps (work_daily), un quiz
--                       (test_sessions) ou de l'XP (xp_events) — la plus
--                       récente des trois ;
--   secondes_7        : le temps des 7 derniers jours (aujourd'hui compris) ;
--   secondes_4s       : le temps des 4 semaines PRÉCÉDENTES (j-34 → j-7),
--                       pour mesurer une baisse ;
--   jours_actifs_7    : jours avec du temps sur les 7 derniers ;
--   sessions_7        : quiz joués sur 7 jours ;
--   matiere_faible    : la matière au plus bas score moyen (meilleur essai par
--                       quiz, borné à la classe, au moins 2 quiz — miroir de
--                       child_dashboard / lib/mastery) ;
--   ratio_global      : le score moyen toutes matières.
CREATE OR REPLACE FUNCTION public.coach_tableau(p_groupe UUID DEFAULT NULL)
RETURNS TABLE (
  eleve_id UUID,
  prenom TEXT,
  pseudo TEXT,
  classe TEXT,
  groupe_id UUID,
  groupe TEXT,
  categorie TEXT,
  rattache_le TIMESTAMPTZ,
  derniere_activite DATE,
  secondes_7 BIGINT,
  secondes_4s BIGINT,
  jours_actifs_7 INTEGER,
  sessions_7 INTEGER,
  matiere_faible TEXT,
  ratio_faible NUMERIC,
  ratio_global NUMERIC,
  quiz_total INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH membres AS (
    SELECT m.eleve_id, g.id AS groupe_id, g.nom, g.categorie, m.rattache_le
      FROM public.coach_membres m
      JOIN public.coach_groupes g ON g.id = m.groupe_id
     WHERE g.coach_id = auth.uid()
       AND g.archive_le IS NULL
       AND m.statut = 'actif'
       AND (p_groupe IS NULL OR g.id = p_groupe)
  ),
  bornes AS (
    SELECT (now() AT TIME ZONE 'utc')::date AS today
  ),
  temps AS (
    SELECT wd.user_id,
           sum(wd.seconds) FILTER (WHERE wd.day >= b.today - 6) AS s7,
           sum(wd.seconds) FILTER (WHERE wd.day >= b.today - 34 AND wd.day < b.today - 6) AS s4s,
           count(*) FILTER (WHERE wd.day >= b.today - 6 AND wd.seconds > 0) AS j7,
           max(wd.day) FILTER (WHERE wd.seconds > 0) AS dernier_jour
      FROM public.work_daily wd, bornes b
     WHERE wd.user_id IN (SELECT eleve_id FROM membres)
     GROUP BY wd.user_id
  ),
  quiz AS (
    SELECT ts.user_id,
           count(*) FILTER (WHERE ts.created_at >= now() - INTERVAL '7 days') AS q7,
           count(*) AS qt,
           max(ts.created_at) AS dernier
      FROM public.test_sessions ts
     WHERE ts.user_id IN (SELECT eleve_id FROM membres)
     GROUP BY ts.user_id
  ),
  xp AS (
    SELECT x.user_id, max(x.created_at) AS dernier
      FROM public.xp_events x
     WHERE x.user_id IN (SELECT eleve_id FROM membres)
     GROUP BY x.user_id
  ),
  best AS (
    SELECT ts.user_id, ts.quiz_id, q.subject,
           max(least(ts.score::numeric / ts.total, 1)) AS ratio
      FROM public.test_sessions ts
      JOIN public.quizzes q ON q.id = ts.quiz_id
      JOIN public.profiles p ON p.id = ts.user_id
     WHERE ts.user_id IN (SELECT eleve_id FROM membres)
       AND ts.total > 0
       AND (p.grade_level IS NULL OR q.grade_level IS NULL
            OR q.grade_level IN (p.grade_level, 'tous'))
     GROUP BY ts.user_id, ts.quiz_id, q.subject
  ),
  matieres AS (
    SELECT user_id, subject, avg(ratio) AS ratio, count(*) AS n
      FROM best
     GROUP BY user_id, subject
  ),
  faible AS (
    SELECT DISTINCT ON (user_id) user_id, subject, ratio
      FROM matieres
     WHERE n >= 2
     ORDER BY user_id, ratio ASC, subject ASC
  ),
  globale AS (
    SELECT user_id, avg(ratio) AS ratio FROM best GROUP BY user_id
  )
  SELECT m.eleve_id,
         p.full_name AS prenom,
         p.gamertag AS pseudo,
         p.grade_level AS classe,
         m.groupe_id,
         m.nom AS groupe,
         m.categorie,
         m.rattache_le,
         GREATEST(t.dernier_jour,
                  (q.dernier AT TIME ZONE 'utc')::date,
                  (x.dernier AT TIME ZONE 'utc')::date) AS derniere_activite,
         COALESCE(t.s7, 0)::bigint AS secondes_7,
         COALESCE(t.s4s, 0)::bigint AS secondes_4s,
         COALESCE(t.j7, 0)::int AS jours_actifs_7,
         COALESCE(q.q7, 0)::int AS sessions_7,
         f.subject AS matiere_faible,
         round(f.ratio, 4) AS ratio_faible,
         round(g.ratio, 4) AS ratio_global,
         COALESCE(q.qt, 0)::int AS quiz_total
    FROM membres m
    JOIN public.profiles p ON p.id = m.eleve_id
    LEFT JOIN temps t ON t.user_id = m.eleve_id
    LEFT JOIN quiz q ON q.user_id = m.eleve_id
    LEFT JOIN xp x ON x.user_id = m.eleve_id
    LEFT JOIN faible f ON f.user_id = m.eleve_id
    LEFT JOIN globale g ON g.user_id = m.eleve_id
   ORDER BY p.full_name ASC;
$$;
REVOKE ALL ON FUNCTION public.coach_tableau(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_tableau(UUID) TO authenticated;

-- ------------------------------------------- 4b. le tableau de bord partagé ---
-- Le corps de `child_dashboard` (319), À L'IDENTIQUE, sans la vérification du
-- lien : c'est la porte qui vérifie. Personne ne peut l'appeler directement.
CREATE OR REPLACE FUNCTION public.eleve_tableau_de_bord(p_child UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_since  DATE := (now() AT TIME ZONE 'utc')::date - 6;
  v_grade  TEXT;
  v_monday DATE := (now() AT TIME ZONE 'utc')::date
                   - (EXTRACT(ISODOW FROM (now() AT TIME ZONE 'utc')::date)::int - 1);
BEGIN
  SELECT grade_level INTO v_grade FROM public.profiles WHERE id = p_child;

  WITH days AS (
    SELECT DISTINCT to_char((created_at AT TIME ZONE 'utc')::date, 'YYYY-MM-DD') AS d
      FROM (
        SELECT created_at FROM public.test_sessions      WHERE user_id = p_child
        UNION ALL
        SELECT created_at FROM public.study_sessions     WHERE user_id = p_child
        UNION ALL
        SELECT created_at FROM public.lesson_completions WHERE user_id = p_child
        UNION ALL
        SELECT created_at FROM public.challenge_sessions WHERE user_id = p_child
      ) act
     WHERE created_at >= now() - INTERVAL '400 days'
  ),
  best_per_quiz AS (
    SELECT ts.quiz_id,
           max(least(ts.score::numeric / ts.total, 1)) AS ratio,
           count(*) AS attempts
      FROM public.test_sessions ts
      JOIN public.quizzes q ON q.id = ts.quiz_id
     WHERE ts.user_id = p_child
       AND ts.total > 0
       AND (v_grade IS NULL OR q.grade_level IS NULL
            OR q.grade_level IN (v_grade, 'tous'))
     GROUP BY ts.quiz_id
  ),
  subjects AS (
    SELECT q.subject AS subject,
           avg(b.ratio) AS ratio,
           sum(b.attempts) AS attempts
      FROM best_per_quiz b
      JOIN public.quizzes q ON q.id = b.quiz_id
     GROUP BY q.subject
  ),
  weeks AS (
    SELECT w.start_day,
           COALESCE((SELECT sum(wd.seconds) FROM public.work_daily wd
                      WHERE wd.user_id = p_child
                        AND wd.day >= w.start_day
                        AND wd.day <  w.start_day + 7), 0) AS seconds,
           COALESCE((SELECT count(*) FROM public.work_daily wd
                      WHERE wd.user_id = p_child
                        AND wd.day >= w.start_day
                        AND wd.day <  w.start_day + 7
                        AND wd.seconds > 0), 0) AS active_days
      FROM (
        SELECT v_monday - (i * 7) AS start_day
          FROM generate_series(3, 0, -1) AS i
      ) w
  )
  SELECT jsonb_build_object(
    'full_name', (SELECT full_name FROM public.profiles WHERE id = p_child),
    'grade_level', (SELECT grade_level FROM public.profiles WHERE id = p_child),
    'work_seconds', COALESCE((SELECT work_seconds FROM public.profiles WHERE id = p_child), 0),
    'week_seconds', COALESCE((SELECT sum(seconds) FROM public.work_daily
                                WHERE user_id = p_child AND day >= v_since), 0),
    'week_active_days', COALESCE((SELECT count(*) FROM public.work_daily
                                    WHERE user_id = p_child AND day >= v_since AND seconds > 0), 0),
    'active_days', COALESCE((SELECT jsonb_agg(d ORDER BY d) FROM days), '[]'::jsonb),
    'sessions_total', (SELECT count(*) FROM public.test_sessions WHERE user_id = p_child),
    'sessions_7', (SELECT count(*) FROM public.test_sessions
                    WHERE user_id = p_child AND created_at >= now() - INTERVAL '7 days'),
    'avg_ratio', (SELECT round(avg(ratio), 4) FROM best_per_quiz),
    'per_subject', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'subject', subject,
               'ratio', round(ratio, 4),
               'attempts', attempts
             ) ORDER BY ratio ASC, attempts DESC)
        FROM subjects
    ), '[]'::jsonb),
    'weeks', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'start', to_char(start_day, 'YYYY-MM-DD'),
               'seconds', seconds,
               'active_days', active_days
             ) ORDER BY start_day ASC)
        FROM weeks
    ), '[]'::jsonb),
    'controles', COALESCE((
      SELECT jsonb_agg(c.item)
        FROM (
          SELECT jsonb_build_object(
                   'id', ct.id,
                   'subject_slug', ct.subject_slug,
                   'chapters', ct.chapters,
                   'exam_date', to_char(ct.exam_date, 'YYYY-MM-DD')
                 ) AS item
            FROM public.controles ct
           WHERE ct.user_id = p_child
             AND ct.note IS NULL
             AND ct.exam_date IS NOT NULL
             AND ct.exam_date >= v_today
           ORDER BY ct.exam_date ASC
           LIMIT 5
        ) c
    ), '[]'::jsonb),
    'last_activity', (SELECT max(d) FROM days)
  ) INTO v_result;

  RETURN v_result;
END;
$$;
REVOKE ALL ON FUNCTION public.eleve_tableau_de_bord(UUID) FROM PUBLIC, anon, authenticated;

-- La porte du PARENT (signature et JSON inchangés — 044, 199, 319).
CREATE OR REPLACE FUNCTION public.child_dashboard(p_child UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN NULL; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.parent_children
     WHERE parent_id = auth.uid() AND child_id = p_child
  ) THEN RETURN NULL; END IF;
  RETURN public.eleve_tableau_de_bord(p_child);
END;
$$;
REVOKE ALL ON FUNCTION public.child_dashboard(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.child_dashboard(UUID) TO authenticated;

-- La porte du COACH : le même tableau de bord, pour un élève actif d'un de
-- ses groupes non archivés.
CREATE OR REPLACE FUNCTION public.coach_fiche_eleve(p_eleve UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN NULL; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.coach_membres m
      JOIN public.coach_groupes g ON g.id = m.groupe_id
     WHERE g.coach_id = auth.uid() AND g.archive_le IS NULL
       AND m.eleve_id = p_eleve AND m.statut = 'actif'
  ) THEN RETURN NULL; END IF;
  RETURN public.eleve_tableau_de_bord(p_eleve);
END;
$$;
REVOKE ALL ON FUNCTION public.coach_fiche_eleve(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_fiche_eleve(UUID) TO authenticated;

-- ------------------------------------------------------- 4c. RPC de l'élève ---

-- L'aperçu d'un code, AVANT le compte (l'onboarding est public → anon) :
-- « Tu rejoins le groupe U15 du coach Lucas ». Un code d'un groupe archivé est
-- inconnu. L'espace des codes (31^8) rend l'énumération vaine ; on refuse
-- d'emblée ce qui n'a pas la forme d'un code.
CREATE OR REPLACE FUNCTION public.coach_code_apercu(p_code TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
           'nom', g.nom,
           'categorie', g.categorie,
           'coach', COALESCE(split_part(p.full_name, ' ', 1), 'ton coach')
         )
    FROM public.coach_groupes g
    JOIN public.profiles p ON p.id = g.coach_id
   WHERE g.archive_le IS NULL
     AND upper(regexp_replace(COALESCE(p_code, ''), '[^A-Za-z0-9]', '', 'g')) ~ '^[A-Z0-9]{8}$'
     AND g.code = upper(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g'))
   LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.coach_code_apercu(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_code_apercu(TEXT) TO anon, authenticated;

-- Le rattachement par le code, une fois la session ouverte. Réponses :
-- 'ok' (rattaché), 'deja' (déjà dans ce groupe), 'introuvable', 'coach' (un
-- coach ou un parent ne rejoint pas un groupe). Rejoindre un autre groupe
-- quitte le précédent ; revenir dans un groupe quitté réactive la ligne.
CREATE OR REPLACE FUNCTION public.rattachement_par_code(p_code TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid    UUID := auth.uid();
  v_code   TEXT := upper(regexp_replace(COALESCE(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
  v_groupe UUID;
  v_type   TEXT;
BEGIN
  IF v_uid IS NULL THEN RETURN 'introuvable'; END IF;
  SELECT profile_type INTO v_type FROM public.profiles WHERE id = v_uid;
  IF v_type IN ('coach', 'parent') THEN RETURN 'coach'; END IF;
  IF v_code !~ '^[A-Z0-9]{8}$' THEN RETURN 'introuvable'; END IF;

  SELECT id INTO v_groupe FROM public.coach_groupes
   WHERE code = v_code AND archive_le IS NULL;
  IF v_groupe IS NULL THEN RETURN 'introuvable'; END IF;

  IF EXISTS (
    SELECT 1 FROM public.coach_membres
     WHERE groupe_id = v_groupe AND eleve_id = v_uid AND statut = 'actif'
  ) THEN RETURN 'deja'; END IF;

  -- Un seul rattachement actif : on quitte l'ancien groupe.
  UPDATE public.coach_membres
     SET statut = 'revoque', revoque_le = now(), revoque_par = 'eleve'
   WHERE eleve_id = v_uid AND statut = 'actif';

  INSERT INTO public.coach_membres (groupe_id, eleve_id, statut, rattache_le, revoque_le, revoque_par)
  VALUES (v_groupe, v_uid, 'actif', now(), NULL, NULL)
  ON CONFLICT (groupe_id, eleve_id) DO UPDATE
     SET statut = 'actif', rattache_le = now(), revoque_le = NULL, revoque_par = NULL;
  RETURN 'ok';
END;
$$;
REVOKE ALL ON FUNCTION public.rattachement_par_code(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rattachement_par_code(TEXT) TO authenticated;

-- Ce que l'élève voit de son rattachement (Mon compte) : NULL s'il n'en a pas.
CREATE OR REPLACE FUNCTION public.mon_rattachement()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
           'groupe_id', g.id,
           'nom', g.nom,
           'categorie', g.categorie,
           'coach', COALESCE(split_part(p.full_name, ' ', 1), 'ton coach'),
           'rattache_le', to_char(m.rattache_le AT TIME ZONE 'utc', 'YYYY-MM-DD')
         )
    FROM public.coach_membres m
    JOIN public.coach_groupes g ON g.id = m.groupe_id
    JOIN public.profiles p ON p.id = g.coach_id
   WHERE m.eleve_id = auth.uid() AND m.statut = 'actif' AND g.archive_le IS NULL
   LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.mon_rattachement() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mon_rattachement() TO authenticated;

CREATE OR REPLACE FUNCTION public.rattachement_quitter()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  UPDATE public.coach_membres
     SET statut = 'revoque', revoque_le = now(), revoque_par = 'eleve'
   WHERE eleve_id = auth.uid() AND statut = 'actif';
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.rattachement_quitter() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rattachement_quitter() TO authenticated;
