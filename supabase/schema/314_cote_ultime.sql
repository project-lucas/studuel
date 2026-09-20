-- Scolaria - Migration 314 : L'EPREUVE ULTIME, sa COTE et ses CLASSEMENTS.
--
-- POURQUOI. Les cinq paliers d'un jeu ont une fin : trois etoiles au palier
-- Maitre, et il n'y a plus rien a gravir. Rien n'y separe donc les meilleurs, et
-- un eleve de 6e n'a aucun moyen de prouver qu'il calcule mieux qu'un lyceen.
-- L'epreuve ultime est la reponse : une seule vie, aucune fin, la difficulte qui
-- monte tant qu'on ne se trompe pas. Ce qu'on en rapporte n'est pas un score
-- mais un NIVEAU ATTEINT.
--
-- LA COTE. De ces niveaux sort UN NOMBRE ABSOLU, comparable entre un CM2 et un
-- Terminale : 100 + 60 x (moyenne des 3 meilleures parties). Trois parties et
-- pas une, pour qu'un coup de chance ne fasse pas un niveau. Elle ne redescend
-- JAMAIS : les parties ne s'effacent pas, et une nouvelle ne peut qu'entrer dans
-- le trio de tete ou n'y rien changer. Meme doctrine que les etoiles, et
-- l'inverse des trophees.
--
-- MIROIR EXACT de lib/jeux/ultime.ts (COTE_BASE, COTE_PER_LEVEL, COTE_RUNS).
-- Toute evolution de la formule doit toucher les deux — la meme regle que celle
-- qui lie lib/trophy-road.ts a apply_game_trophies (238).
--
-- DEUX CLASSEMENTS, PAS UN. Le MONDIAL (tous les joueurs, tous ages) est celui
-- qui donne son sens a l'epreuve : c'est la qu'un 6e depasse un Terminale. Le
-- classement PAR CLASSE reste a cote, parce qu'il rassure quand le mondial
-- ecrase. Les deux sortent de la meme RPC, l'app affiche les deux.
--
-- L'ANTI-TRICHE, ET SES LIMITES. Un classement mondial calcule sur un chiffre
-- envoye par le navigateur se falsifie. On borne donc le niveau, et surtout on
-- exige une duree PLAUSIBLE : personne ne repond juste toutes les 200 ms
-- pendant trente questions. Cela n'arrete pas un attaquant determine — cela
-- arrete les 99 % — et c'est proportionne a l'enjeu (un classement de jeu).
--
-- Idempotente. A EXECUTER A LA MAIN dans le SQL Editor, apres la 313.
-- Astuce : selectionne TOUT le fichier (Ctrl+A) avant de lancer.
--
-- TANT QU'ELLE N'EST PAS EXECUTEE : l'epreuve se joue, le niveau atteint
-- s'affiche a l'ecran de fin, mais aucune cote ni aucun classement n'apparait.
-- L'appel est tolere (app/defi/ultime-actions.ts). Rien ne casse.

-- ------------------------------------------------------- 1. les parties jouees

CREATE TABLE IF NOT EXISTS public.game_ultime_runs (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID     NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Meme identite que partout ailleurs : l'id du jeu de lib/jeux/catalog.
  game_id    TEXT     NOT NULL,
  -- Niveau atteint (0 = tombe au premier niveau). Borne haute = ULTIME_MAX_LEVEL.
  level      SMALLINT NOT NULL CHECK (level BETWEEN 0 AND 60),
  -- Duree de la partie, en millisecondes. Sert au garde-fou de plausibilite.
  ms         INTEGER  NOT NULL CHECK (ms > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- On ne lit ces lignes que d'une facon : « les meilleures parties de X sur ce
-- jeu », pour recalculer sa cote.
CREATE INDEX IF NOT EXISTS game_ultime_runs_cote
  ON public.game_ultime_runs (user_id, game_id, level DESC);

ALTER TABLE public.game_ultime_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "game_ultime_runs_select_own" ON public.game_ultime_runs;
CREATE POLICY "game_ultime_runs_select_own" ON public.game_ultime_runs
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "game_ultime_runs_insert_own" ON public.game_ultime_runs;
CREATE POLICY "game_ultime_runs_insert_own" ON public.game_ultime_runs
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- --------------------------------------------------------------- 2. les cotes

-- Table DERIVEE, maintenue par la RPC : la cote se recalcule a chaque partie a
-- partir des trois meilleures. Elle existe pour que le classement mondial soit
-- une lecture d'index et non une agregation sur toutes les parties de tout le
-- monde.
CREATE TABLE IF NOT EXISTS public.game_ultime_cotes (
  user_id    UUID     NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id    TEXT     NOT NULL,
  cote       INTEGER  NOT NULL DEFAULT 0 CHECK (cote >= 0),
  best_level SMALLINT NOT NULL DEFAULT 0 CHECK (best_level >= 0),
  runs       INTEGER  NOT NULL DEFAULT 0 CHECK (runs >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, game_id)
);

CREATE INDEX IF NOT EXISTS game_ultime_cotes_classement
  ON public.game_ultime_cotes (game_id, cote DESC);

ALTER TABLE public.game_ultime_cotes ENABLE ROW LEVEL SECURITY;

-- Chacun ne voit que SA cote. Les classements passent par les RPC ci-dessous,
-- SECURITY DEFINER, qui ne rendent que des COMPTES — jamais l'identite d'un
-- autre joueur. Meme dispositif que game_ghost (238) et palier_standings (313).
DROP POLICY IF EXISTS "game_ultime_cotes_select_own" ON public.game_ultime_cotes;
CREATE POLICY "game_ultime_cotes_select_own" ON public.game_ultime_cotes
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ------------------------------------------------------ 3. enregistrer une partie

-- Range une partie, recalcule la cote, et rend la place qu'elle donne — mondiale
-- ET dans la classe — en un seul aller-retour : l'ecran de fin a besoin de tout
-- au meme instant.
CREATE OR REPLACE FUNCTION public.record_ultime_run(
  p_game_id TEXT,
  p_level   SMALLINT,
  p_ms      INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_grade TEXT;
  v_cote  INTEGER;
  v_best  SMALLINT;
  v_runs  INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  IF p_level IS NULL OR p_level < 0 OR p_level > 60 THEN RETURN NULL; END IF;
  IF p_ms IS NULL OR p_ms <= 0 THEN RETURN NULL; END IF;
  -- Plausibilite : 3 questions par niveau, 200 ms au moins par question. En
  -- dessous, aucun humain ne repond — c'est un score fabrique.
  IF p_ms < p_level::INTEGER * 600 THEN RETURN NULL; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.game_catalog WHERE game_id = p_game_id
  ) THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.game_ultime_runs (user_id, game_id, level, ms)
  VALUES (v_user, p_game_id, p_level, p_ms);

  -- La cote : 100 + 60 x (moyenne des 3 meilleurs niveaux). Miroir de
  -- lib/jeux/ultime.coteFor — les deux doivent bouger ensemble.
  SELECT ROUND(100 + 60 * AVG(t.level))::INTEGER, MAX(t.level)::SMALLINT
    INTO v_cote, v_best
    FROM (
      SELECT r.level
        FROM public.game_ultime_runs r
       WHERE r.user_id = v_user AND r.game_id = p_game_id
       ORDER BY r.level DESC
       LIMIT 3
    ) t;

  SELECT COUNT(*)::INTEGER INTO v_runs
    FROM public.game_ultime_runs r
   WHERE r.user_id = v_user AND r.game_id = p_game_id;

  INSERT INTO public.game_ultime_cotes (user_id, game_id, cote, best_level, runs)
  VALUES (v_user, p_game_id, v_cote, v_best, v_runs)
  ON CONFLICT (user_id, game_id) DO UPDATE
    SET cote       = EXCLUDED.cote,
        best_level = EXCLUDED.best_level,
        runs       = EXCLUDED.runs,
        updated_at = now();

  SELECT p.grade_level INTO v_grade FROM public.profiles p WHERE p.id = v_user;

  RETURN jsonb_build_object(
    'cote',       v_cote,
    'best_level', v_best,
    'runs',       v_runs,
    'grade',      v_grade,
    -- Rang MONDIAL : le nombre de joueurs strictement mieux cotes, plus un.
    'rank', (
      SELECT COUNT(*) FILTER (WHERE c.cote > v_cote) + 1
        FROM public.game_ultime_cotes c
       WHERE c.game_id = p_game_id
    ),
    'total', (
      SELECT COUNT(*) FROM public.game_ultime_cotes c WHERE c.game_id = p_game_id
    ),
    -- Rang dans la CLASSE. Null quand l'eleve n'a pas renseigne la sienne : on
    -- ne le range pas d'office dans une cohorte qu'il n'a pas choisie.
    'grade_rank', (
      SELECT CASE WHEN v_grade IS NULL THEN NULL ELSE
        COUNT(*) FILTER (WHERE c.cote > v_cote) + 1 END
        FROM public.game_ultime_cotes c
        JOIN public.profiles p2 ON p2.id = c.user_id
       WHERE c.game_id = p_game_id AND p2.grade_level = v_grade
    ),
    'grade_total', (
      SELECT CASE WHEN v_grade IS NULL THEN NULL ELSE COUNT(*) END
        FROM public.game_ultime_cotes c
        JOIN public.profiles p2 ON p2.id = c.user_id
       WHERE c.game_id = p_game_id AND p2.grade_level = v_grade
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION
  public.record_ultime_run(TEXT, SMALLINT, INTEGER) TO authenticated;

-- --------------------------------------------------- 4. ma place, sans jouer

-- La meme chose en lecture seule, pour la carte du jeu. Rend NULL quand l'eleve
-- n'a jamais joue l'epreuve : la carte affiche alors « aucune cote », ce qui est
-- exactement la verite.
CREATE OR REPLACE FUNCTION public.ultime_standing(p_game_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_grade TEXT;
  v_cote  INTEGER;
  v_best  SMALLINT;
  v_runs  INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  SELECT c.cote, c.best_level, c.runs INTO v_cote, v_best, v_runs
    FROM public.game_ultime_cotes c
   WHERE c.user_id = v_user AND c.game_id = p_game_id;

  IF v_cote IS NULL THEN RETURN NULL; END IF;

  SELECT p.grade_level INTO v_grade FROM public.profiles p WHERE p.id = v_user;

  RETURN jsonb_build_object(
    'cote',       v_cote,
    'best_level', v_best,
    'runs',       v_runs,
    'grade',      v_grade,
    'rank', (
      SELECT COUNT(*) FILTER (WHERE c.cote > v_cote) + 1
        FROM public.game_ultime_cotes c
       WHERE c.game_id = p_game_id
    ),
    'total', (
      SELECT COUNT(*) FROM public.game_ultime_cotes c WHERE c.game_id = p_game_id
    ),
    'grade_rank', (
      SELECT CASE WHEN v_grade IS NULL THEN NULL ELSE
        COUNT(*) FILTER (WHERE c.cote > v_cote) + 1 END
        FROM public.game_ultime_cotes c
        JOIN public.profiles p2 ON p2.id = c.user_id
       WHERE c.game_id = p_game_id AND p2.grade_level = v_grade
    ),
    'grade_total', (
      SELECT CASE WHEN v_grade IS NULL THEN NULL ELSE COUNT(*) END
        FROM public.game_ultime_cotes c
        JOIN public.profiles p2 ON p2.id = c.user_id
       WHERE c.game_id = p_game_id AND p2.grade_level = v_grade
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.ultime_standing(TEXT) TO authenticated;
