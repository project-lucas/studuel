-- Scolaria - Migration 238 : la ROUTE DES TROPHEES (trophees par matiere x jeu).
--
-- Change le moteur de la ladder. Jusqu'ici : UN compteur global
-- (profiles.trophies) alimente par le mode « Classe » toutes matieres, avec un
-- bareme Elo-lite (migration 079, filet Bronze en 202). Desormais : un compteur
-- PAR JEU, sur une courbe par bandes qui ralentit a mesure qu'on monte.
--
--   trophees du jeu  ->  montent match par match (bande 0-99 : +10/-0 ...
--                        bande 800+ : +2/-8)
--   total matiere    =  somme de ses jeux
--   total global     =  somme de tout  ->  recopie dans profiles.trophies
--
-- POURQUOI profiles.trophies SURVIT. Il devient une valeur DERIVEE (la somme),
-- maintenue par la RPC ci-dessous. Tout ce qui le lit deja — friends_trophies,
-- le classement des amis, la cartouche de rang — continue de marcher sans une
-- ligne de code a changer. Une seule ecriture, un seul endroit.
--
-- MIROIR EXACT de lib/trophy-road.ts (TROPHY_BANDS / applyGameResult). Toute
-- evolution de la courbe doit toucher les deux, comme la regle qui liait deja
-- lib/trophies.ts a apply_ranked_match.
--
-- RESET ASSUME. Les comptes existants repartent de zero : le pic Elo est
-- conserve dans profiles.legacy_best_trophies (trophee d'honneur de l'ancienne
-- saison), et trophies/best_trophies retombent a 0. C'est un vrai lancement de
-- saison, pas une conversion bancale entre deux baremes incomparables.
--
-- Idempotente. A EXECUTER A LA MAIN dans le SQL Editor, apres la 237.
-- Astuce : selectionne TOUT le fichier (Ctrl+A) avant de lancer.

-- ---------------------------------------------------------------- 1. catalogue
-- La liste blanche des couples (matiere, jeu) qui peuvent porter des trophees.
-- SANS ELLE, un client malveillant inventerait des couples inedits : chaque
-- nouveau couple demarre a 0 trophee, donc dans la bande +10/-0, et le global
-- (une somme) se gonflerait sans plafond. La RPC refuse tout couple absent.

-- La matiere est identifiee par son SLUG (« histoire-geo »), jamais par son nom
-- affiche (« Histoire-Geo »). Un nom d'affichage porte des accents et peut etre
-- reecrit un jour ; une CLE ne doit dependre ni de l'un ni de l'autre. C'est
-- deja l'identite utilisee dans les URLs (lib/jeux/programme.programmeSlug),
-- et son aller-retour est verrouille par un test.
CREATE TABLE IF NOT EXISTS public.game_catalog (
  subject_slug TEXT NOT NULL,
  game_id      TEXT NOT NULL,
  PRIMARY KEY (subject_slug, game_id)
);

ALTER TABLE public.game_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "game_catalog_select_all" ON public.game_catalog;
CREATE POLICY "game_catalog_select_all" ON public.game_catalog
  FOR SELECT TO authenticated USING (true);

-- Miroir de lib/jeux/catalog.ts (jeux implemented: true) + le jeu « programme »
-- de lib/jeux/programme.ts, present dans CHAQUE matiere. La coherence est
-- verifiee par lib/trophy-catalog.test.ts, qui relit CE fichier.
INSERT INTO public.game_catalog (subject_slug, game_id) VALUES
  ('histoire-geo',    'capitales'),
  ('histoire-geo',    'frise-folle'),
  ('histoire-geo',    'programme'),
  ('francais',        'orthographe'),
  ('francais',        'chasse-faute'),
  ('francais',        'conjugaison-eclair'),
  ('francais',        'programme'),
  ('maths',           'calcul-mental'),
  ('maths',           'compte-est-bon'),
  ('maths',           'suite-logique'),
  ('maths',           'programme'),
  ('anglais',         'traduction-flash'),
  ('anglais',         'faux-amis'),
  ('anglais',         'phrase-en-vrac'),
  ('anglais',         'programme'),
  ('espagnol',        'traduccion-flash'),
  ('espagnol',        'falsos-amigos'),
  ('espagnol',        'programme'),
  ('svt',             'anatomie-express'),
  ('svt',             'classe-moi-ca'),
  ('svt',             'programme'),
  ('physique-chimie', 'chasse-elements'),
  ('physique-chimie', 'bonne-unite'),
  ('physique-chimie', 'programme')
ON CONFLICT (subject_slug, game_id) DO NOTHING;

-- ------------------------------------------------------------- 2. les compteurs

CREATE TABLE IF NOT EXISTS public.game_trophies (
  user_id    UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_slug TEXT  NOT NULL,
  game_id    TEXT    NOT NULL,
  trophies   INTEGER NOT NULL DEFAULT 0 CHECK (trophies >= 0),
  best       INTEGER NOT NULL DEFAULT 0 CHECK (best >= 0),
  -- Saison a laquelle ce compteur appartient ('YYYY-MM', meme cle que
  -- lib/saison.seasonKey). Sert a la bascule PARESSEUSE : l'app n'a pas de cron,
  -- donc le rattrapage se fait a la premiere partie jouee dans la nouvelle
  -- saison, joueur par joueur et jeu par jeu.
  season     TEXT    NOT NULL DEFAULT to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, subject_slug, game_id)
);

-- Colonne ajoutee separement : la table peut deja exister d'un premier passage
-- de cette migration, avant que la saison n'y soit prevue.
ALTER TABLE public.game_trophies
  ADD COLUMN IF NOT EXISTS season TEXT NOT NULL
  DEFAULT to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM');

ALTER TABLE public.game_trophies ENABLE ROW LEVEL SECURITY;

-- Lecture : les siens. L'ECRITURE n'a AUCUNE policy — elle passe exclusivement
-- par apply_game_trophies (SECURITY DEFINER), sinon le client poserait son
-- compteur ou il veut et la courbe ne servirait a rien.
DROP POLICY IF EXISTS "game_trophies_select_own" ON public.game_trophies;
CREATE POLICY "game_trophies_select_own" ON public.game_trophies
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

CREATE INDEX IF NOT EXISTS game_trophies_user_idx
  ON public.game_trophies (user_id);

-- Journal des parties classees : sert de borne de rythme (anti-farming), et
-- portera les manches enregistrees quand les fantomes reels remplaceront les
-- bots.
CREATE TABLE IF NOT EXISTS public.game_matches (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_slug TEXT  NOT NULL,
  game_id    TEXT    NOT NULL,
  won        BOOLEAN NOT NULL,
  delta      INTEGER NOT NULL,
  trophies   INTEGER NOT NULL,
  score      INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.game_matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "game_matches_select_own" ON public.game_matches;
CREATE POLICY "game_matches_select_own" ON public.game_matches
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

CREATE INDEX IF NOT EXISTS game_matches_user_time_idx
  ON public.game_matches (user_id, created_at DESC);

-- Le pic de l'ancienne saison (bareme Elo), garde comme trophee d'honneur.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS legacy_best_trophies INTEGER NOT NULL DEFAULT 0;

-- ------------------------------------------------------- 2 bis. le PIC PAR MATIERE
-- Le meilleur total jamais atteint sur UNE matiere. Le ladder est cloisonne par
-- matiere (lib/subject-rank) : chaque matiere a donc son rang, et un rang sans
-- record n'a pas de memoire — « j'ai ete Or II en maths » disparaitrait a la
-- premiere defaite.
--
-- POURQUOI PAS LA SOMME DES `game_trophies.best`. Parce que les pics de deux
-- jeux ne sont pas simultanes : additionner le record de calcul mental (obtenu
-- en mars) et celui du Programme (obtenu en juin) fabriquerait un total que
-- l'eleve n'a jamais eu. On enregistre donc le pic du TOTAL, au moment ou il
-- est atteint, comme profiles.best_trophies le fait pour le global.
CREATE TABLE IF NOT EXISTS public.subject_peaks (
  user_id      UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_slug TEXT    NOT NULL,
  peak         INTEGER NOT NULL DEFAULT 0 CHECK (peak >= 0),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, subject_slug)
);

ALTER TABLE public.subject_peaks ENABLE ROW LEVEL SECURITY;

-- Lecture seule cote client, comme game_trophies : l'ECRITURE passe uniquement
-- par apply_game_trophies, sinon un client poserait son record ou il veut.
DROP POLICY IF EXISTS "subject_peaks_select_own" ON public.subject_peaks;
CREATE POLICY "subject_peaks_select_own" ON public.subject_peaks
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

-- ------------------------------------------------------------------ 3. la RPC

CREATE OR REPLACE FUNCTION public.apply_game_trophies(
  p_subject_slug TEXT,
  p_game_id TEXT,
  p_won     BOOLEAN,
  p_score   INTEGER DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_before INTEGER;
  v_best   INTEGER;
  v_band   INTEGER;
  v_win    INTEGER;
  v_loss   INTEGER;
  v_delta  INTEGER;
  v_after  INTEGER;
  v_total  INTEGER;
  v_peak   INTEGER;
  v_subject_total INTEGER;
  v_subject_peak  INTEGER;
  v_season TEXT;
  -- Saison courante, meme cle que lib/saison.seasonKey ('YYYY-MM', UTC).
  v_now_season CONSTANT TEXT := to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM');
  -- Largeur d'une bande, miroir de BAND_SPAN (lib/trophy-road.ts).
  v_band_span CONSTANT INTEGER := 100;
  -- Index de la derniere bande (0-based) : 9 bandes, la 9e est ouverte.
  v_last_band CONSTANT INTEGER := 8;
  -- Plancher protege a la bascule de saison, miroir de SEASON_KEEP_FLOOR.
  v_season_floor CONSTANT INTEGER := 500;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  -- Couple inconnu du catalogue : on refuse. C'est le garde-fou anti-farming
  -- decrit en tete de fichier.
  IF NOT EXISTS (
    SELECT 1 FROM public.game_catalog
     WHERE subject_slug = p_subject_slug AND game_id = p_game_id
  ) THEN
    RETURN NULL;
  END IF;

  -- Borne de rythme : 60 parties classees par heure glissante. Une partie dure
  -- 60 a 90 secondes, donc 60 remplit deja l'heure entiere de jeu reel — au-dela
  -- c'est un appel en boucle, pas un eleve.
  IF (SELECT count(*) FROM public.game_matches
        WHERE user_id = v_user
          AND created_at >= now() - INTERVAL '1 hour') >= 60 THEN
    RETURN NULL;
  END IF;

  -- Cree la ligne au premier match sur ce jeu, et la verrouille.
  INSERT INTO public.game_trophies (user_id, subject_slug, game_id)
  VALUES (v_user, p_subject_slug, p_game_id)
  ON CONFLICT (user_id, subject_slug, game_id) DO NOTHING;

  SELECT trophies, best, season INTO v_before, v_best, v_season
    FROM public.game_trophies
   WHERE user_id = v_user AND subject_slug = p_subject_slug AND game_id = p_game_id
     FOR UPDATE;

  -- BASCULE DE SAISON, en paresseux : l'app n'a pas de cron, donc le rattrapage
  -- se fait ici, a la premiere partie jouee dans la nouvelle saison. Seul ce
  -- qui depasse le plancher retombe, et de moitie seulement — la grande
  -- majorite des eleves ne verra jamais de remise a zero, et celui qui
  -- plafonnait recupere une bande plus genereuse.
  -- MIROIR de lib/trophy-road.seasonReset.
  IF v_season IS DISTINCT FROM v_now_season THEN
    IF v_before > v_season_floor THEN
      v_before := v_season_floor + ((v_before - v_season_floor) / 2);
    END IF;
    UPDATE public.game_trophies
       SET trophies = v_before, season = v_now_season
     WHERE user_id = v_user AND subject_slug = p_subject_slug AND game_id = p_game_id;
  END IF;

  -- La bande du compteur, plafonnee sur la derniere (ouverte vers le haut).
  v_band := LEAST(v_last_band, v_before / v_band_span);
  -- Miroir de TROPHY_BANDS : gain 10..2 (decroissant), perte 0..8 (croissant).
  v_win  := 10 - v_band;
  v_loss := v_band;

  IF p_won THEN
    v_delta := v_win;
  ELSE
    v_delta := -v_loss;
  END IF;

  v_after := GREATEST(0, v_before + v_delta);
  -- Delta REEL apres ecretage : l'ecran de fin annonce le mouvement observe du
  -- compteur, pas le bareme theorique.
  v_delta := v_after - v_before;
  v_best  := GREATEST(v_best, v_after);

  UPDATE public.game_trophies
     SET trophies = v_after, best = v_best, season = v_now_season,
         updated_at = now()
   WHERE user_id = v_user AND subject_slug = p_subject_slug AND game_id = p_game_id;

  INSERT INTO public.game_matches
    (user_id, subject_slug, game_id, won, delta, trophies, score)
  VALUES (v_user, p_subject_slug, p_game_id, p_won, v_delta, v_after, p_score);

  -- Le total de la MATIERE, et son pic. C'est ce couple que lit le ladder par
  -- matiere (rang + division + record). Le pic est enregistre ICI, au moment ou
  -- le total est atteint : additionner apres coup les records des jeux
  -- fabriquerait un total que l'eleve n'a jamais eu.
  SELECT COALESCE(sum(trophies), 0) INTO v_subject_total
    FROM public.game_trophies
   WHERE user_id = v_user AND subject_slug = p_subject_slug;

  INSERT INTO public.subject_peaks (user_id, subject_slug, peak)
  VALUES (v_user, p_subject_slug, v_subject_total)
  ON CONFLICT (user_id, subject_slug) DO UPDATE
    SET peak = GREATEST(public.subject_peaks.peak, EXCLUDED.peak),
        updated_at = now()
  RETURNING peak INTO v_subject_peak;

  -- Le global est la SOMME, recopiee dans profiles pour que le classement des
  -- amis et la cartouche de rang continuent de le lire au meme endroit.
  SELECT COALESCE(sum(trophies), 0) INTO v_total
    FROM public.game_trophies WHERE user_id = v_user;

  UPDATE public.profiles
     SET trophies = v_total,
         best_trophies = GREATEST(best_trophies, v_total)
   WHERE id = v_user
  RETURNING best_trophies INTO v_peak;

  RETURN jsonb_build_object(
    'before',  v_before,
    'after',   v_after,
    'delta',   v_delta,
    'best',    v_best,
    'total',   v_total,
    'peak',    COALESCE(v_peak, v_total),
    'subjectTotal', v_subject_total,
    'subjectPeak',  v_subject_peak,
    'bandWin', v_win,
    'bandLoss', v_loss
  );
END;
$$;

GRANT EXECUTE ON FUNCTION
  public.apply_game_trophies(TEXT, TEXT, BOOLEAN, INTEGER) TO authenticated;

-- ------------------------------------------------------ 3 bis. le FANTOME
-- Le meilleur score d'un AMI sur ce jeu — ce qu'on affiche a battre.
--
-- Il remplace les « adversaires » du mode classe supprime : dix noms en dur
-- (Maxou, BrainZ, La Taupe...) tires par une graine. Un eleve reperait vite
-- qu'ils etaient scriptes, et la ladder devenait une machine a sous. Ici la
-- ligne a battre appartient a quelqu'un de reel, qui a vraiment joue.
--
-- AMIS SEULEMENT, et c'est un choix de vie privee autant que de jeu : servir
-- le prenom et le score d'un inconnu de la meme tranche de trophees aurait
-- expose des eleves les uns aux autres sans qu'ils se connaissent. Pas d'ami
-- ayant joue ce jeu -> aucune ligne, et l'ecran n'affiche simplement pas de
-- fantome (on ne fabrique pas un adversaire pour combler le vide : c'est
-- exactement l'erreur qu'on repare).
CREATE OR REPLACE FUNCTION public.game_ghost(
  p_subject_slug TEXT,
  p_game_id TEXT
)
RETURNS TABLE (
  friend_id UUID,
  full_name TEXT,
  score     INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.user_id, p.full_name, max(m.score)::int AS score
  FROM public.game_matches m
  JOIN public.profiles p ON p.id = m.user_id
  WHERE m.subject_slug = p_subject_slug
    AND m.game_id = p_game_id
    AND m.score IS NOT NULL
    AND m.user_id IN (
      SELECT CASE WHEN f.requester_id = auth.uid()
                  THEN f.addressee_id ELSE f.requester_id END
      FROM public.friendships f
      WHERE f.status = 'accepted'
        AND auth.uid() IN (f.requester_id, f.addressee_id)
    )
  GROUP BY m.user_id, p.full_name
  ORDER BY max(m.score) DESC
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.game_ghost(TEXT, TEXT) TO authenticated;

-- ------------------------------------------- 3 ter. les FANTOMES DU DUEL CLASSE
-- Les adversaires possibles sur UNE matiere : ceux qui y ont joue, avec leur
-- compteur sur cette matiere et le meilleur score qu'ils y ont pose.
--
-- CE QUE CETTE FONCTION EXPOSE, ET POURQUOI. Le fantome des jeux de salon
-- (game_ghost, juste au-dessus) est limite aux AMIS : c'etait le bon choix pour
-- une ligne affichee en permanence sur une tuile. Le duel classe, lui, doit
-- apparier sur (matiere, trophees +/-150) — une contrainte qu'un cercle d'amis
-- ne peut pas satisfaire : il faudrait avoir un ami exactement a son niveau
-- dans chaque matiere, et l'ecran serait vide presque toujours.
--
-- On elargit donc, mais TROIS garde-fous encadrent l'ouverture :
--   1. MEME NIVEAU DE CLASSE uniquement (profiles.grade_level). Un eleve de 3e
--      n'est jamais expose a un eleve de 6e, ni l'inverse.
--   2. PRENOM SEUL (premier mot de full_name) — c'est deja la regle de tout le
--      social de l'app, et la fonction la fait respecter EN SQL, pas dans le
--      client.
--   3. AUCUNE donnee de contact, aucun identifiant utilisable pour retrouver
--      quelqu'un ailleurs dans l'app : la ligne rendue sert a jouer contre un
--      score, pas a rencontrer une personne.
-- C'est exactement le meme perimetre que le classement de cohorte deja en place
-- (223, « Top 2 % des 3e »), qui expose deja des eleves les uns aux autres a
-- l'interieur d'un niveau.
--
-- L'appariement lui-meme (fourchette, elargissement, choix du plus proche) vit
-- dans lib/defi/matchmaking.ts : la base sert le vivier, elle ne decide pas.
CREATE OR REPLACE FUNCTION public.subject_ranked_ghosts(
  p_subject_slug TEXT,
  p_limit INTEGER DEFAULT 40
)
RETURNS TABLE (
  user_id  UUID,
  name     TEXT,
  trophies INTEGER,
  score    INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH moi AS (
    SELECT grade_level FROM public.profiles WHERE id = auth.uid()
  )
  SELECT
    t.user_id,
    -- Prenom seul, impose ici et pas dans le client.
    COALESCE(split_part(p.full_name, ' ', 1), 'Un eleve') AS name,
    -- Le compteur de la MATIERE : la somme de ses jeux, l'echelle sur laquelle
    -- lib/subject-rank calcule le rang.
    COALESCE(sum(t.trophies), 0)::int AS trophies,
    COALESCE(max(m.score), 0)::int    AS score
  FROM public.game_trophies t
  JOIN public.profiles p ON p.id = t.user_id
  JOIN moi ON moi.grade_level IS NOT DISTINCT FROM p.grade_level
  LEFT JOIN public.game_matches m
    ON m.user_id = t.user_id
   AND m.subject_slug = t.subject_slug
   AND m.score IS NOT NULL
  WHERE t.subject_slug = p_subject_slug
    AND t.user_id <> auth.uid()
  GROUP BY t.user_id, p.full_name
  -- Un adversaire sans aucun score enregistre n'a rien a faire rejouer.
  HAVING COALESCE(max(m.score), 0) > 0
  ORDER BY sum(t.trophies) DESC
  LIMIT GREATEST(1, LEAST(p_limit, 200));
$$;

GRANT EXECUTE ON FUNCTION public.subject_ranked_ghosts(TEXT, INTEGER) TO authenticated;

-- ------------------------------------------- 4. l'ancien bareme devient inerte
-- profiles.trophies n'est plus un compteur qu'on incremente : c'est la SOMME
-- des game_trophies, recopiee par la RPC ci-dessus. Un SECOND ecrivain ne
-- « rajouterait » donc pas des trophees, il poserait une autre valeur que la
-- partie suivante ecraserait par la somme — les deux baremes s'effaceraient
-- l'un l'autre a tour de role.
--
-- Le code appelant a ete retire (le bouton « Classe » a fusionne dans COMBAT,
-- et le duel 90 s ne touche plus aux trophees), mais un client en cache peut
-- encore appeler cette RPC : on la neutralise DANS LA BASE, seul endroit qu'un
-- vieux client ne peut pas contourner. Elle garde sa signature pour ne rien
-- faire planter, et renvoie NULL — ce que les appelants traitaient deja comme
-- « pas de mouvement ».
CREATE OR REPLACE FUNCTION public.apply_ranked_match(
  p_won BOOLEAN,
  p_opponent_trophies INTEGER,
  p_opponent_label TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Remplacee par apply_game_trophies (Route des trophees, migration 238).
  RETURN NULL;
END;
$$;

-- ------------------------------------------------------------- 5. le reset
-- Les comptes existants repartent de zero sur le nouveau bareme. Le pic Elo
-- part dans legacy_best_trophies (trophee d'honneur), une seule fois : la garde
-- `legacy_best_trophies = 0` rend le bloc rejouable sans ecraser le pic garde
-- lors du premier passage par des zeros du nouveau bareme.

UPDATE public.profiles
   SET legacy_best_trophies = GREATEST(best_trophies, trophies),
       trophies = 0,
       best_trophies = 0
 WHERE legacy_best_trophies = 0
   AND (best_trophies > 0 OR trophies > 0);
