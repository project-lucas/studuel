-- Scolaria - Migration 352 : LE PALMARES DES MODES DE JEU — records, echelle de
-- la semaine, et le bilan d'une partie en un aller-retour.
--
-- POURQUOI. Les cinq modes de l'Arene (Blitz, Contre-la-montre, Survie, Boss,
-- Duel fantome) ne laissaient AUCUNE trace de leur score : `challenge_sessions`
-- n'a pas de colonne mode, et les records vivaient dans le localStorage du
-- telephone — perdus au changement d'appareil, invisibles a tout le monde.
-- Un record que personne ne voit n'est pas un record. Et « 1 240 points », tout
-- seul, ne dit rien : c'est bien ou pas ? La reponse n'existe que par rapport
-- a soi hier, et aux autres cette semaine.
--
-- CE QU'ON ENREGISTRE. Chaque partie terminee (mode_runs), le meilleur de
-- toujours (mode_bests) et le meilleur de LA SEMAINE (mode_weeks). La semaine
-- est la cle de tout : l'echelle repart de zero chaque lundi, donc il y a
-- toujours une place a prendre — c'est la boucle qui ne finit jamais.
--
-- LA COHORTE est la classe (grade_level), comme partout dans l'app (percentile
-- de /moi, rivaux de la 351) : un 6e se compare aux 6e. Un eleve sans classe se
-- compare aux eleves sans classe (IS NOT DISTINCT FROM).
--
-- CE QUE LA RPC REND D'UN AUTRE JOUEUR : prenom seul + avatar dessine + score —
-- exactement le perimetre de duel_replay_opponents (351). Jamais de nom
-- complet, d'etablissement ni de contact.
--
-- L'ANTI-TRICHE, ET SES LIMITES. Le score arrive du navigateur. On le borne par
-- mode (mode_catalog.max_score) et on exige une duree PLAUSIBLE : un point ne
-- se gagne pas en moins de `min_ms_per_point` millisecondes. Cela n'arrete pas
-- un attaquant determine, cela arrete les 99 % — proportionne a l'enjeu (une
-- echelle de jeu qui se remet a zero le lundi). Meme doctrine que la 314.
--
-- Idempotente. A EXECUTER A LA MAIN dans le SQL Editor, apres la 351.
-- Astuce : selectionne TOUT le fichier (Ctrl+A) avant de lancer.
--
-- TANT QU'ELLE N'EST PAS EXECUTEE : les modes se jouent, l'ecran de fin montre
-- le score et le record local, mais ni « vs derniere fois » ni echelle. L'appel
-- est tolere (app/defi/palmares-actions.ts). Rien ne casse, rien n'est invente.

-- ------------------------------------------------------- 1. le catalogue

-- Liste blanche des epreuves classees, avec leurs bornes. Sans elle, un client
-- inventerait des modes inedits et se classerait premier d'une epreuve dont il
-- serait le seul joueur (lecon de la 238). Miroir de lib/palmares/epreuves.ts.
CREATE TABLE IF NOT EXISTS public.mode_catalog (
  mode_id          TEXT     PRIMARY KEY,
  max_score        INTEGER  NOT NULL CHECK (max_score > 0),
  -- Millisecondes minimales par point : en dessous, personne n'a joue.
  min_ms_per_point INTEGER  NOT NULL CHECK (min_ms_per_point >= 0)
);

INSERT INTO public.mode_catalog (mode_id, max_score, min_ms_per_point) VALUES
  -- Blitz 60 s : 100 pts x multiplicateur (max x4) par bonne reponse. Soixante
  -- reponses en 60 s a x4 = 24 000 ; on laisse de la marge.
  ('blitz',  30000, 2),
  -- Contre-la-montre : le score est le NOMBRE de bonnes reponses.
  ('chrono', 300,   700),
  -- Survie : le score est la longueur de la serie.
  ('survie', 500,   700),
  -- Boss : 100 pts par coup porte + prime de victoire (lib/palmares/epreuves).
  ('boss',   5000,  5),
  -- Duel fantome : 100 pts par bonne reponse + prime de victoire.
  ('duel',   5000,  5)
ON CONFLICT (mode_id) DO UPDATE
  SET max_score = EXCLUDED.max_score,
      min_ms_per_point = EXCLUDED.min_ms_per_point;

ALTER TABLE public.mode_catalog ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mode_catalog_read" ON public.mode_catalog;
CREATE POLICY "mode_catalog_read" ON public.mode_catalog
  FOR SELECT TO authenticated USING (true);

-- ------------------------------------------------------- 2. les parties

CREATE TABLE IF NOT EXISTS public.mode_runs (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode_id    TEXT    NOT NULL REFERENCES public.mode_catalog(mode_id),
  score      INTEGER NOT NULL CHECK (score >= 0),
  ms         INTEGER NOT NULL CHECK (ms > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- « Mes dernieres parties de ce mode » : la seule lecture de cette table.
CREATE INDEX IF NOT EXISTS mode_runs_mien
  ON public.mode_runs (user_id, mode_id, created_at DESC);

ALTER TABLE public.mode_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mode_runs_select_own" ON public.mode_runs;
CREATE POLICY "mode_runs_select_own" ON public.mode_runs
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
-- Aucune policy d'ecriture : seule la RPC ecrit, apres avoir borne.

-- ------------------------------------------------------- 3. les records

CREATE TABLE IF NOT EXISTS public.mode_bests (
  user_id    UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode_id    TEXT    NOT NULL REFERENCES public.mode_catalog(mode_id),
  best       INTEGER NOT NULL CHECK (best >= 0),
  best_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last       INTEGER NOT NULL CHECK (last >= 0),
  plays      INTEGER NOT NULL DEFAULT 0 CHECK (plays >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, mode_id)
);

CREATE INDEX IF NOT EXISTS mode_bests_classement
  ON public.mode_bests (mode_id, best DESC);

ALTER TABLE public.mode_bests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mode_bests_select_own" ON public.mode_bests;
CREATE POLICY "mode_bests_select_own" ON public.mode_bests
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

-- ------------------------------------------------ 4. l'echelle de la semaine

CREATE TABLE IF NOT EXISTS public.mode_weeks (
  user_id    UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode_id    TEXT    NOT NULL REFERENCES public.mode_catalog(mode_id),
  -- Le LUNDI de la semaine (UTC), meme cle que le clan (clan_week_key, 204).
  week_key   DATE    NOT NULL,
  best       INTEGER NOT NULL CHECK (best >= 0),
  plays      INTEGER NOT NULL DEFAULT 0 CHECK (plays >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, mode_id, week_key)
);

CREATE INDEX IF NOT EXISTS mode_weeks_classement
  ON public.mode_weeks (mode_id, week_key, best DESC);

ALTER TABLE public.mode_weeks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "mode_weeks_select_own" ON public.mode_weeks;
CREATE POLICY "mode_weeks_select_own" ON public.mode_weeks
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

-- La cle de semaine du palmares : celle du clan, reprise telle quelle.
CREATE OR REPLACE FUNCTION public.clan_week_key(p_day DATE)
RETURNS DATE
LANGUAGE sql
IMMUTABLE
AS $$ SELECT (date_trunc('week', p_day::timestamp))::date $$;

-- ------------------------------------------- 5. ma place sur une echelle

-- Rang et taille de cohorte d'un score sur l'echelle de la semaine (ou de
-- toujours) d'un mode, dans la classe donnee. Interne aux RPC ci-dessous.
-- Le rang est « 1 + nombre de joueurs qui font STRICTEMENT mieux » : deux
-- ex aequo sont tous deux 3e, personne n'est 4e — le classique des podiums.
CREATE OR REPLACE FUNCTION public.mode_place(
  p_mode_id TEXT,
  p_period  TEXT,        -- 'semaine' | 'toujours'
  p_week    DATE,
  p_grade   TEXT,
  p_score   INTEGER
)
RETURNS TABLE (rank INTEGER, total INTEGER)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (COUNT(*) FILTER (WHERE s.best > p_score))::INTEGER + 1 AS rank,
    COUNT(*)::INTEGER AS total
  FROM (
    SELECT w.best, w.user_id FROM public.mode_weeks w
     WHERE p_period = 'semaine' AND w.mode_id = p_mode_id AND w.week_key = p_week
    UNION ALL
    SELECT b.best, b.user_id FROM public.mode_bests b
     WHERE p_period <> 'semaine' AND b.mode_id = p_mode_id
  ) s
  JOIN public.profiles p ON p.id = s.user_id
  WHERE p.grade_level IS NOT DISTINCT FROM p_grade;
$$;

REVOKE ALL ON FUNCTION public.mode_place(TEXT, TEXT, DATE, TEXT, INTEGER) FROM PUBLIC, anon, authenticated;

-- ------------------------------------------- 6. enregistrer une partie

-- Range une partie et rend, en UN aller-retour, tout ce que l'ecran de fin
-- affiche : la derniere fois, le record d'avant et d'apres, la place sur
-- l'echelle de la semaine AVANT et APRES, la place de toujours, et la
-- PROCHAINE MARCHE — le joueur juste au-dessus de moi cette semaine, prenom,
-- avatar et score a depasser. C'est lui qui fait rejouer.
CREATE OR REPLACE FUNCTION public.record_mode_score(
  p_mode_id TEXT,
  p_score   INTEGER,
  p_ms      INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_cat    public.mode_catalog%ROWTYPE;
  v_grade  TEXT;
  v_week   DATE := public.clan_week_key((now() AT TIME ZONE 'UTC')::date);
  v_last   INTEGER;
  v_best0  INTEGER;
  v_best   INTEGER;
  v_plays  INTEGER;
  v_wbest0 INTEGER;
  v_wbest  INTEGER;
  v_wrank0 INTEGER; v_wtotal0 INTEGER;
  v_wrank  INTEGER; v_wtotal  INTEGER;
  v_arank  INTEGER; v_atotal  INTEGER;
  v_next   JSONB;
  v_leader JSONB;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  SELECT * INTO v_cat FROM public.mode_catalog WHERE mode_id = p_mode_id;
  IF NOT FOUND THEN RETURN NULL; END IF;
  IF p_score IS NULL OR p_score < 0 OR p_score > v_cat.max_score THEN RETURN NULL; END IF;
  IF p_ms IS NULL OR p_ms <= 0 OR p_ms > 3600000 THEN RETURN NULL; END IF;
  IF p_ms < p_score * v_cat.min_ms_per_point THEN RETURN NULL; END IF;

  SELECT p.grade_level INTO v_grade FROM public.profiles p WHERE p.id = v_user;

  -- L'etat d'AVANT : derniere partie, record, place de la semaine.
  SELECT b.last, b.best INTO v_last, v_best0
    FROM public.mode_bests b WHERE b.user_id = v_user AND b.mode_id = p_mode_id;
  SELECT w.best INTO v_wbest0
    FROM public.mode_weeks w
   WHERE w.user_id = v_user AND w.mode_id = p_mode_id AND w.week_key = v_week;
  IF v_wbest0 IS NOT NULL THEN
    SELECT rank, total INTO v_wrank0, v_wtotal0
      FROM public.mode_place(p_mode_id, 'semaine', v_week, v_grade, v_wbest0);
  END IF;

  -- La partie.
  INSERT INTO public.mode_runs (user_id, mode_id, score, ms)
  VALUES (v_user, p_mode_id, p_score, p_ms);

  INSERT INTO public.mode_bests (user_id, mode_id, best, best_at, last, plays)
  VALUES (v_user, p_mode_id, p_score, now(), p_score, 1)
  ON CONFLICT (user_id, mode_id) DO UPDATE
    SET best    = GREATEST(public.mode_bests.best, EXCLUDED.best),
        best_at = CASE WHEN EXCLUDED.best > public.mode_bests.best THEN now()
                       ELSE public.mode_bests.best_at END,
        last    = EXCLUDED.last,
        plays   = public.mode_bests.plays + 1,
        updated_at = now()
  RETURNING best, plays INTO v_best, v_plays;

  INSERT INTO public.mode_weeks (user_id, mode_id, week_key, best, plays)
  VALUES (v_user, p_mode_id, v_week, p_score, 1)
  ON CONFLICT (user_id, mode_id, week_key) DO UPDATE
    SET best  = GREATEST(public.mode_weeks.best, EXCLUDED.best),
        plays = public.mode_weeks.plays + 1,
        updated_at = now()
  RETURNING best INTO v_wbest;

  -- L'etat d'APRES.
  SELECT rank, total INTO v_wrank, v_wtotal
    FROM public.mode_place(p_mode_id, 'semaine', v_week, v_grade, v_wbest);
  SELECT rank, total INTO v_arank, v_atotal
    FROM public.mode_place(p_mode_id, 'toujours', v_week, v_grade, v_best);

  -- La prochaine marche : le plus PROCHE de ceux qui font strictement mieux
  -- que moi cette semaine, dans ma classe. Prenom seul + avatar + score.
  SELECT jsonb_build_object(
           'name',   COALESCE(NULLIF(split_part(p.full_name, ' ', 1), ''), 'Un élève'),
           'avatar', COALESCE(p.avatar, '{}'::jsonb),
           'score',  w.best)
    INTO v_next
    FROM public.mode_weeks w
    JOIN public.profiles p ON p.id = w.user_id
   WHERE w.mode_id = p_mode_id AND w.week_key = v_week
     AND w.best > v_wbest
     AND p.grade_level IS NOT DISTINCT FROM v_grade
   ORDER BY w.best ASC, w.updated_at ASC
   LIMIT 1;

  -- Le premier de l'echelle, pour dire jusqu'ou elle monte.
  SELECT jsonb_build_object(
           'name',   COALESCE(NULLIF(split_part(p.full_name, ' ', 1), ''), 'Un élève'),
           'score',  w.best,
           'is_me',  (w.user_id = v_user))
    INTO v_leader
    FROM public.mode_weeks w
    JOIN public.profiles p ON p.id = w.user_id
   WHERE w.mode_id = p_mode_id AND w.week_key = v_week
     AND p.grade_level IS NOT DISTINCT FROM v_grade
   ORDER BY w.best DESC, w.updated_at ASC
   LIMIT 1;

  RETURN jsonb_build_object(
    'mode',              p_mode_id,
    'score',             p_score,
    'plays',             v_plays,
    'last',              v_last,
    'best_before',       v_best0,
    'best',              v_best,
    'week_key',          to_char(v_week, 'YYYY-MM-DD'),
    'week_best_before',  v_wbest0,
    'week_best',         v_wbest,
    'week_rank_before',  v_wrank0,
    'week_total_before', v_wtotal0,
    'week_rank',         v_wrank,
    'week_total',        v_wtotal,
    'all_rank',          v_arank,
    'all_total',         v_atotal,
    'grade',             v_grade,
    'next',              v_next,
    'leader',            v_leader
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_mode_score(TEXT, INTEGER, INTEGER) TO authenticated;

-- ------------------------------------------------ 7. l'echelle en entier

-- Le haut de l'echelle d'un mode (les dix premiers) plus MA ligne, dans ma
-- classe. `p_period` : 'semaine' (repart chaque lundi) ou 'toujours'.
-- Chaque ligne : rang, prenom, avatar, score, is_me. Le perimetre de la 351.
CREATE OR REPLACE FUNCTION public.mode_ladder(
  p_mode_id TEXT,
  p_period  TEXT DEFAULT 'semaine',
  p_limit   INTEGER DEFAULT 10
)
RETURNS TABLE (
  rank    INTEGER,
  name    TEXT,
  avatar  JSONB,
  score   INTEGER,
  is_me   BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH moi AS (
    SELECT id, grade_level FROM public.profiles WHERE id = auth.uid()
  ),
  scores AS (
    SELECT s.user_id, s.best, s.updated_at
      FROM (
        SELECT w.user_id, w.best, w.updated_at FROM public.mode_weeks w
         WHERE p_period = 'semaine' AND w.mode_id = p_mode_id
           AND w.week_key = public.clan_week_key((now() AT TIME ZONE 'UTC')::date)
        UNION ALL
        SELECT b.user_id, b.best, b.updated_at FROM public.mode_bests b
         WHERE p_period <> 'semaine' AND b.mode_id = p_mode_id
      ) s
      JOIN public.profiles p ON p.id = s.user_id
      JOIN moi ON moi.grade_level IS NOT DISTINCT FROM p.grade_level
  ),
  classes AS (
    SELECT sc.user_id, sc.best,
           (RANK() OVER (ORDER BY sc.best DESC))::INTEGER AS rang,
           ROW_NUMBER() OVER (ORDER BY sc.best DESC, sc.updated_at ASC) AS ligne
      FROM scores sc
  )
  SELECT c.rang AS rank,
         COALESCE(NULLIF(split_part(p.full_name, ' ', 1), ''), 'Un élève') AS name,
         COALESCE(p.avatar, '{}'::jsonb) AS avatar,
         c.best AS score,
         (c.user_id = (SELECT id FROM moi)) AS is_me
    FROM classes c
    JOIN public.profiles p ON p.id = c.user_id
   WHERE c.ligne <= GREATEST(1, LEAST(COALESCE(p_limit, 10), 50))
      OR c.user_id = (SELECT id FROM moi)
   ORDER BY c.ligne;
$$;

GRANT EXECUTE ON FUNCTION public.mode_ladder(TEXT, TEXT, INTEGER) TO authenticated;

-- ------------------------------------------------ 8. mon palmares complet

-- Tous mes modes d'un coup, pour l'onglet Moi : record, derniere partie,
-- nombre de parties, meilleur de la semaine et place de la semaine, place de
-- toujours. Les modes jamais joues ne sortent pas.
CREATE OR REPLACE FUNCTION public.my_mode_palmares()
RETURNS TABLE (
  mode_id     TEXT,
  best        INTEGER,
  best_at     TIMESTAMPTZ,
  last        INTEGER,
  plays       INTEGER,
  week_best   INTEGER,
  week_plays  INTEGER,
  week_rank   INTEGER,
  week_total  INTEGER,
  all_rank    INTEGER,
  all_total   INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH moi AS (
    SELECT id, grade_level FROM public.profiles WHERE id = auth.uid()
  ),
  semaine AS (
    SELECT public.clan_week_key((now() AT TIME ZONE 'UTC')::date) AS week_key
  )
  SELECT b.mode_id,
         b.best, b.best_at, b.last, b.plays,
         w.best  AS week_best,
         w.plays AS week_plays,
         (SELECT rank  FROM public.mode_place(b.mode_id, 'semaine', semaine.week_key, moi.grade_level, w.best)) AS week_rank,
         (SELECT total FROM public.mode_place(b.mode_id, 'semaine', semaine.week_key, moi.grade_level, w.best)) AS week_total,
         (SELECT rank  FROM public.mode_place(b.mode_id, 'toujours', semaine.week_key, moi.grade_level, b.best)) AS all_rank,
         (SELECT total FROM public.mode_place(b.mode_id, 'toujours', semaine.week_key, moi.grade_level, b.best)) AS all_total
    FROM public.mode_bests b
    CROSS JOIN moi
    CROSS JOIN semaine
    LEFT JOIN public.mode_weeks w
      ON w.user_id = b.user_id AND w.mode_id = b.mode_id AND w.week_key = semaine.week_key
   WHERE b.user_id = moi.id
   ORDER BY b.mode_id;
$$;

GRANT EXECUTE ON FUNCTION public.my_mode_palmares() TO authenticated;
