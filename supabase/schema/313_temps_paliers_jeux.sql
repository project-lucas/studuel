-- Scolaria - Migration 313 : le TEMPS DE BOUCLAGE d'un palier, et son classement.
--
-- Les jeux de salon ont desormais cinq paliers de difficulte (lib/jeux/paliers).
-- Chaque palier garde ses etoiles et son meilleur score EN LOCAL, ce qui suffit
-- a une progression personnelle. Une chose ne peut pas se calculer en local :
-- « tu fais partie des 5 % les plus rapides ». Un classement demande la
-- distribution de tous les joueurs, donc une table.
--
-- CE QU'ON ENREGISTRE, ET SEULEMENT CA : le meilleur temps de bouclage d'un
-- couple (jeu, palier), pour les parties GAGNEES. Une partie abandonnee ou
-- perdue n'a pas de temps : sans cette regle, quitter a la premiere question
-- donnerait le meilleur chrono du jeu et le classement ne voudrait plus rien
-- dire.
--
-- POURQUOI UNE RPC POUR LIRE. La RLS limite chaque eleve a SES lignes — c'est la
-- regle du projet et elle ne bouge pas. Mais un rang se calcule sur les lignes
-- de TOUT LE MONDE. Les deux fonctions ci-dessous sont donc SECURITY DEFINER :
-- elles voient la table entiere et ne rendent qu'un COMPTE (rang, total), jamais
-- l'identite d'un autre joueur. Meme dispositif que `game_ghost` (238).
--
-- Idempotente. A EXECUTER A LA MAIN dans le SQL Editor, apres la 312.
-- Astuce : selectionne TOUT le fichier (Ctrl+A) avant de lancer.
--
-- TANT QU'ELLE N'EST PAS EXECUTEE, l'app fonctionne : l'appel est tolere
-- (app/defi/palier-actions.ts), la carte affiche alors le chrono local sans
-- pourcentage. Rien ne casse, aucun chiffre n'est invente.

-- ------------------------------------------------------------------ 1. la table

CREATE TABLE IF NOT EXISTS public.game_palier_times (
  user_id  UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Meme identite que partout ailleurs : l'id du jeu de lib/jeux/catalog.
  game_id  TEXT    NOT NULL,
  palier   SMALLINT NOT NULL CHECK (palier BETWEEN 1 AND 5),
  -- Meilleur temps de bouclage, en millisecondes. Les bornes sont les memes que
  -- lib/jeux/paliers.isPlausibleTime : sous 2 s aucune partie n'est jouable, au
  -- dela d'une heure l'onglet est reste ouvert.
  best_ms  INTEGER NOT NULL CHECK (best_ms BETWEEN 2000 AND 3600000),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, game_id, palier)
);

-- L'index du classement : on ne lit jamais cette table autrement que « les
-- temps d'un (jeu, palier), tries du plus rapide au plus lent ».
CREATE INDEX IF NOT EXISTS game_palier_times_classement
  ON public.game_palier_times (game_id, palier, best_ms);

ALTER TABLE public.game_palier_times ENABLE ROW LEVEL SECURITY;

-- Chacun ne voit et n'ecrit QUE ses propres temps. Le classement passe par les
-- RPC ci-dessous, qui ne rendent que des comptes.
DROP POLICY IF EXISTS "game_palier_times_select_own" ON public.game_palier_times;
CREATE POLICY "game_palier_times_select_own" ON public.game_palier_times
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "game_palier_times_insert_own" ON public.game_palier_times;
CREATE POLICY "game_palier_times_insert_own" ON public.game_palier_times
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "game_palier_times_update_own" ON public.game_palier_times;
CREATE POLICY "game_palier_times_update_own" ON public.game_palier_times
  FOR UPDATE TO authenticated USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ------------------------------------------------- 2. enregistrer un temps

-- Range un temps de bouclage et rend la place qu'il donne, en un aller-retour :
-- l'ecran de fin de partie a besoin des deux au meme instant.
--
-- Le temps n'est retenu que s'il AMELIORE le precedent (LEAST) : un record ne
-- se perd pas parce qu'on a rejoue mollement.
--
-- Le jeu doit exister au catalogue (game_catalog, migration 238). Sans ce
-- garde-fou, un client fabrique des `game_id` inedits et se classe premier d'un
-- jeu dont il est le seul joueur.
CREATE OR REPLACE FUNCTION public.record_palier_time(
  p_game_id TEXT,
  p_palier  SMALLINT,
  p_ms      INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_best  INTEGER;
  v_rank  INTEGER;
  v_total INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  IF p_palier IS NULL OR p_palier < 1 OR p_palier > 5 THEN RETURN NULL; END IF;
  IF p_ms IS NULL OR p_ms < 2000 OR p_ms > 3600000 THEN RETURN NULL; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.game_catalog WHERE game_id = p_game_id
  ) THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.game_palier_times (user_id, game_id, palier, best_ms)
  VALUES (v_user, p_game_id, p_palier, p_ms)
  ON CONFLICT (user_id, game_id, palier) DO UPDATE
    SET best_ms    = LEAST(public.game_palier_times.best_ms, EXCLUDED.best_ms),
        updated_at = now()
  RETURNING best_ms INTO v_best;

  SELECT COUNT(*)::INTEGER,
         COUNT(*) FILTER (WHERE t.best_ms < v_best)::INTEGER + 1
    INTO v_total, v_rank
    FROM public.game_palier_times t
   WHERE t.game_id = p_game_id AND t.palier = p_palier;

  RETURN jsonb_build_object(
    'palier',  p_palier,
    'best_ms', v_best,
    'rank',    v_rank,
    'total',   v_total
  );
END;
$$;

GRANT EXECUTE ON FUNCTION
  public.record_palier_time(TEXT, SMALLINT, INTEGER) TO authenticated;

-- --------------------------------------------- 3. mes places sur un jeu

-- Les cinq paliers d'un jeu en UNE requete : mon meilleur temps, mon rang et le
-- nombre de joueurs classes. Sert la carte du jeu, qui affiche les cinq lignes
-- d'un coup — cinq allers-retours pour cinq barreaux d'une echelle, non.
--
-- Les paliers que je n'ai jamais boucles ne sortent pas : la carte affiche
-- alors « aucun temps », ce qui est exactement la verite.
CREATE OR REPLACE FUNCTION public.palier_standings(p_game_id TEXT)
RETURNS TABLE (
  palier   SMALLINT,
  best_ms  INTEGER,
  rank     INTEGER,
  total    INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT mien.palier,
         mien.best_ms,
         (SELECT COUNT(*) FILTER (WHERE t.best_ms < mien.best_ms)
            FROM public.game_palier_times t
           WHERE t.game_id = mien.game_id AND t.palier = mien.palier)::INTEGER + 1
           AS rank,
         (SELECT COUNT(*)
            FROM public.game_palier_times t
           WHERE t.game_id = mien.game_id AND t.palier = mien.palier)::INTEGER
           AS total
    FROM public.game_palier_times mien
   WHERE mien.user_id = auth.uid()
     AND mien.game_id = p_game_id
   ORDER BY mien.palier;
$$;

GRANT EXECUTE ON FUNCTION public.palier_standings(TEXT) TO authenticated;
