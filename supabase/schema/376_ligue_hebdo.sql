-- =============================================================================
-- 376 — LA LIGUE DE LA SEMAINE, DANS L'ONGLET AMIS (Lucas, 24/09/2026)
--
-- « À l'identique de Duolingo » : chaque semaine (lundi 00:00 UTC → lundi
-- suivant), l'élève est placé dans un GROUPE de 30 joueurs du même ÉCHELON,
-- classé à l'XP gagnée dans la semaine (xp_events). À la fin, les 7 premiers
-- MONTENT d'un échelon, les 5 derniers DESCENDENT, et tout recommence.
--
-- LES ÉCHELONS : les rangs de l'app (lib/rank : Bronze → Maître) en quatre
-- divisions — Bronze 4, 3, 2, 1, puis Argent 4… — et Maître au sommet, sans
-- division : 21 marches, index 0 (Bronze 4) → 20 (Maître). Les trophées ne
-- jouent plus ici ; ils restent au duel classé.
--
-- LES RIVAUX IA. Tant que l'app n'a pas 30 élèves actifs par échelon et par
-- semaine, un groupe se complète jusqu'à 30 avec des rivaux : leur XP de la
-- semaine est tirée de l'identifiant du groupe et de leur place (la même pour
-- tous, à tout instant), elle monte au fil de la semaine, et elle grandit avec
-- l'échelon. Ils sont marqués « IA » à l'écran, comme au duel classé. Un vrai
-- élève qui rejoint le groupe prend la place du dernier rival.
--
-- LES AMIS MULTIPLIENT L'XP : +10 % de l'XP de la semaine par ami accepté,
-- jusqu'à ×2 à 10 amis, versés À LA CLÔTURE dans la barre de niveau
-- (`wallet_grant_xp`, source 'bonus_amis') ; les niveaux gagnés paient leurs
-- gemmes comme partout. Ce bonus ne compte pas dans la ligue.
--
-- LES GEMMES DE LA LIGUE (source 'ligue', une fois par semaine) : 10 pour une
-- division gagnée, 25 pour un rang (Bronze 1 → Argent 4), et le podium 15 / 10
-- / 5. Rien sans XP dans la semaine. Doublées pendant le week-end ×2 comme les
-- autres gemmes de jeu (`gemmes_avec_bonus`).
--
-- LA CLÔTURE EST PARESSEUSE, joueur par joueur : pas de tâche planifiée. Au
-- premier appel de la semaine suivante (`ligue_toucher`, que l'app lance à
-- chaque retour, ou `ligue_etat`, qui dessine l'onglet), le groupe passé est
-- classé À SA FIN — le classement est une fonction pure du groupe et de
-- l'instant, donc le même pour chacun de ses membres, quel que soit le jour où
-- il revient — et son bilan s'écrit dans `ligue_bilans`, que l'écran rejoue en
-- animation une seule fois.
--
-- Miroir TS : lib/ligue.ts (échelons, promus/relégués, gemmes, multiplicateur).
-- L'ancienne ligue du Défi (161 · 164 · 166 : `league_standings`,
-- `process_league_rollover`, `profiles.league_tier`) comptait
-- `challenge_sessions.xp`, que le jeu ne verse plus depuis la 348 : elle est
-- remplacée à l'écran, ses objets restent en base sans effet.
--
-- PRÉREQUIS : 019 (friendships), 082 (profiles.avatar), 192 (xp_events,
-- user_wallet, wallet_ensure, wallet_level_from_xp), 368 (wallet_grant_xp,
-- gemmes_avec_bonus). Idempotente. À exécuter à la main dans :
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ─────────────────────────────────────────────────────────── 1. les tables

CREATE TABLE IF NOT EXISTS public.ligue_groupes (
  id      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  semaine DATE        NOT NULL,
  echelon SMALLINT    NOT NULL CHECK (echelon BETWEEN 0 AND 20),
  -- Les VRAIS élèves du groupe ; les rivaux IA complètent jusqu'à 30.
  taille  SMALLINT    NOT NULL DEFAULT 0 CHECK (taille BETWEEN 0 AND 30),
  cree_le TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ligue_groupes_semaine_echelon_idx
  ON public.ligue_groupes (semaine, echelon, cree_le);

CREATE TABLE IF NOT EXISTS public.ligue_joueurs (
  user_id   UUID        PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  echelon   SMALLINT    NOT NULL DEFAULT 0 CHECK (echelon BETWEEN 0 AND 20),
  -- Le groupe de la semaine en cours (ou d'une semaine pas encore clôturée).
  groupe_id UUID        REFERENCES public.ligue_groupes (id) ON DELETE SET NULL,
  maj_le    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ligue_membres (
  groupe_id  UUID        NOT NULL REFERENCES public.ligue_groupes (id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  rejoint_le TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (groupe_id, user_id)
);
CREATE INDEX IF NOT EXISTS ligue_membres_user_idx ON public.ligue_membres (user_id);

CREATE TABLE IF NOT EXISTS public.ligue_bilans (
  user_id       UUID        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  semaine       DATE        NOT NULL,
  echelon_avant SMALLINT    NOT NULL,
  echelon_apres SMALLINT    NOT NULL,
  rang          SMALLINT    NOT NULL,
  taille        SMALLINT    NOT NULL,
  xp            INTEGER     NOT NULL DEFAULT 0,
  gemmes        INTEGER     NOT NULL DEFAULT 0,
  nb_amis       SMALLINT    NOT NULL DEFAULT 0,
  bonus_xp      INTEGER     NOT NULL DEFAULT 0,
  niveau_avant  INTEGER,
  niveau_apres  INTEGER,
  gemmes_niveau INTEGER     NOT NULL DEFAULT 0,
  -- L'écran rejoue le bilan en animation UNE fois, puis le marque vu.
  vu            BOOLEAN     NOT NULL DEFAULT false,
  cree_le       TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, semaine)
);

-- Tout passe par les fonctions ci-dessous (SECURITY DEFINER) : aucune policy,
-- aucune lecture ni écriture directe depuis l'API.
ALTER TABLE public.ligue_groupes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ligue_joueurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ligue_membres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ligue_bilans  ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.ligue_groupes, public.ligue_joueurs, public.ligue_membres, public.ligue_bilans
  FROM anon, authenticated;

-- ─────────────────────────────────── 2. l'XP de la semaine, vite retrouvée

CREATE INDEX IF NOT EXISTS xp_events_user_created_idx
  ON public.xp_events (user_id, created_at);

-- ─────────────────────────────────────────── 3. deux sources de plus
-- Lues dans la contrainte EXISTANTE plutôt que recopiées d'une migration
-- (la méthode de la 373) : rejouer n'ajoute rien deux fois.

DO $$
DECLARE
  v_def     TEXT;
  v_sources TEXT[];
BEGIN
  SELECT pg_get_constraintdef(c.oid) INTO v_def
    FROM pg_constraint c
   WHERE c.conname = 'xp_events_source_check'
     AND c.conrelid = 'public.xp_events'::regclass;
  IF v_def IS NOT NULL AND v_def !~ '\mbonus_amis\M' THEN
    SELECT array_agg(DISTINCT btrim(s)) INTO v_sources
      FROM regexp_matches(v_def, '''([^'']+)''', 'g') AS m,
           LATERAL unnest(string_to_array(btrim(m[1], '{}'), ',')) AS s
     WHERE btrim(s) <> '';
    v_sources := array_append(COALESCE(v_sources, ARRAY[]::TEXT[]), 'bonus_amis');
    EXECUTE 'ALTER TABLE public.xp_events DROP CONSTRAINT xp_events_source_check';
    EXECUTE format('ALTER TABLE public.xp_events ADD CONSTRAINT xp_events_source_check CHECK (source IN (%s))',
                   (SELECT string_agg(quote_literal(x), ', ' ORDER BY x) FROM unnest(v_sources) x));
  END IF;

  SELECT pg_get_constraintdef(c.oid) INTO v_def
    FROM pg_constraint c
   WHERE c.conname = 'gem_events_source_check'
     AND c.conrelid = 'public.gem_events'::regclass;
  IF v_def IS NOT NULL AND v_def !~ '\mligue\M' THEN
    SELECT array_agg(DISTINCT btrim(s)) INTO v_sources
      FROM regexp_matches(v_def, '''([^'']+)''', 'g') AS m,
           LATERAL unnest(string_to_array(btrim(m[1], '{}'), ',')) AS s
     WHERE btrim(s) <> '';
    v_sources := array_append(COALESCE(v_sources, ARRAY[]::TEXT[]), 'ligue');
    EXECUTE 'ALTER TABLE public.gem_events DROP CONSTRAINT gem_events_source_check';
    EXECUTE format('ALTER TABLE public.gem_events ADD CONSTRAINT gem_events_source_check CHECK (source IN (%s))',
                   (SELECT string_agg(quote_literal(x), ', ' ORDER BY x) FROM unnest(v_sources) x));
  END IF;
END $$;

-- ───────────────────────────── 4. les règles (miroir de lib/ligue.ts)

-- Le lundi (UTC) de la semaine d'un instant.
CREATE OR REPLACE FUNCTION public.ligue_lundi(p_instant TIMESTAMPTZ)
RETURNS DATE
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT (date_trunc('week', p_instant AT TIME ZONE 'utc'))::date;
$$;

-- Combien montent : 7 sur 30, au moins un dès qu'on est deux, personne au sommet.
CREATE OR REPLACE FUNCTION public.ligue_nb_promus(p_taille INTEGER, p_echelon INTEGER)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE WHEN p_echelon >= 20 OR p_taille < 2 THEN 0
              ELSE GREATEST(1, (p_taille * 7) / 30) END;
$$;

-- Combien descendent : 5 sur 30, personne sous Bronze 4.
CREATE OR REPLACE FUNCTION public.ligue_nb_relegues(p_taille INTEGER, p_echelon INTEGER)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE WHEN p_echelon <= 0 THEN 0 ELSE (p_taille * 5) / 30 END;
$$;

-- Les gemmes de fin de semaine : division 10, rang 25 (l'index / 4 est le
-- rang : Bronze 0 … Diamant 4, Maître 5), podium 15 / 10 / 5 ; rien sans XP.
CREATE OR REPLACE FUNCTION public.ligue_gemmes(p_avant INTEGER, p_apres INTEGER, p_rang INTEGER, p_xp INTEGER)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE WHEN COALESCE(p_xp, 0) <= 0 THEN 0 ELSE
    (CASE WHEN p_apres > p_avant THEN
            CASE WHEN p_apres / 4 <> p_avant / 4 THEN 25 ELSE 10 END
          ELSE 0 END)
    + (CASE p_rang WHEN 1 THEN 15 WHEN 2 THEN 10 WHEN 3 THEN 5 ELSE 0 END)
  END;
$$;

-- ─────────────────────────────────────────────────────── 5. les rivaux IA

-- Un tirage stable dans [0, 1) : le groupe, la place, et ce qu'on tire.
CREATE OR REPLACE FUNCTION public.ligue_robot_hasard(p_groupe UUID, p_slot INTEGER, p_sel TEXT)
RETURNS NUMERIC
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT ((hashtext(p_groupe::text || ':' || p_slot || ':' || p_sel)::bigint & 2147483647) % 100000)
         / 100000.0;
$$;

-- L'XP qu'un rival aura à la fin de la semaine. 12 % ne jouent pas ; les autres
-- s'étalent de 0,25 à 2,15 fois une base qui grandit avec l'échelon (120 XP en
-- Bronze 4, ~1 500 au sommet), la plupart vers le bas de la fourchette — un
-- élève qui révise un peu chaque jour a sa chance de monter en Bronze, il
-- faut une vraie semaine de travail pour monter en Diamant.
CREATE OR REPLACE FUNCTION public.ligue_robot_cible(p_groupe UUID, p_slot INTEGER, p_echelon INTEGER)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE WHEN h.u < 0.12 THEN 0
              ELSE (round((120 + 70 * p_echelon) * (0.25 + 1.9 * power((h.u - 0.12) / 0.88, 1.6)) / 5) * 5)::INTEGER
         END
    FROM (SELECT public.ligue_robot_hasard(p_groupe, p_slot, 'cible') AS u) h;
$$;

-- L'XP d'un rival à un instant de la semaine (fraction 0 → 1) : chacun son
-- rythme, les uns en avance, les autres au dernier moment ; en multiples de 5,
-- comme les vraies XP.
CREATE OR REPLACE FUNCTION public.ligue_robot_xp(p_groupe UUID, p_slot INTEGER, p_echelon INTEGER, p_fraction NUMERIC)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT (floor(public.ligue_robot_cible(p_groupe, p_slot, p_echelon)
                * power(LEAST(1, GREATEST(0, p_fraction)),
                        0.8 + 0.4 * public.ligue_robot_hasard(p_groupe, p_slot, 'rythme')) / 5) * 5)::INTEGER;
$$;

-- Le prénom d'un rival.
CREATE OR REPLACE FUNCTION public.ligue_robot_nom(p_groupe UUID, p_slot INTEGER)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT (ARRAY[
    'Léa', 'Hugo', 'Chloé', 'Nathan', 'Inès', 'Lucas', 'Jade', 'Yanis', 'Manon', 'Adam',
    'Camille', 'Noah', 'Sarah', 'Enzo', 'Zoé', 'Rayan', 'Lina', 'Théo', 'Emma', 'Mathis',
    'Louise', 'Sacha', 'Ambre', 'Tom', 'Maëlys', 'Ethan', 'Nina', 'Gabin', 'Alice', 'Ilyes',
    'Rose', 'Lenny', 'Mila', 'Nolan', 'Anna', 'Timéo', 'Lou', 'Kylian', 'Juliette', 'Axel',
    'Léna', 'Maxence', 'Clara', 'Évan', 'Margaux', 'Samuel', 'Agathe', 'Mohamed', 'Élise', 'Robin'
  ])[1 + floor(public.ligue_robot_hasard(p_groupe, p_slot, 'nom') * 50)::INTEGER];
$$;

-- ───────────────────────────────────────────────── 6. l'XP de la semaine

-- Tout ce que l'élève a gagné du lundi au lundi, sauf le bonus d'amis versé à
-- la clôture précédente — il fausserait le classement suivant.
CREATE OR REPLACE FUNCTION public.ligue_xp_semaine(p_user UUID, p_semaine DATE)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(e.amount), 0)::INTEGER
    FROM public.xp_events e
   WHERE e.user_id = p_user
     AND e.created_at >= (p_semaine::timestamp AT TIME ZONE 'utc')
     AND e.created_at <  ((p_semaine + 7)::timestamp AT TIME ZONE 'utc')
     AND e.source <> 'bonus_amis';
$$;

-- ─────────────────────────────────────────────────────── 7. le classement

-- Les 30 du groupe à un instant : les vrais élèves, puis les rivaux IA qui
-- complètent. Ordre total — XP, puis le premier arrivé, puis la clé — donc le
-- même classement pour chaque membre, à la clôture comme à l'écran.
CREATE OR REPLACE FUNCTION public.ligue_classement(p_groupe UUID, p_instant TIMESTAMPTZ)
RETURNS TABLE (cle TEXT, user_id UUID, xp INTEGER, rejoint TIMESTAMPTZ, robot BOOLEAN, slot INTEGER, rang INTEGER)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_semaine  DATE;
  v_echelon  INTEGER;
  v_reels    INTEGER;
  v_debut    TIMESTAMPTZ;
  v_fraction NUMERIC;
BEGIN
  SELECT g.semaine, g.echelon INTO v_semaine, v_echelon
    FROM public.ligue_groupes g WHERE g.id = p_groupe;
  IF v_semaine IS NULL THEN RETURN; END IF;

  v_debut := v_semaine::timestamp AT TIME ZONE 'utc';
  v_fraction := LEAST(1, GREATEST(0, EXTRACT(EPOCH FROM (p_instant - v_debut)) / (7 * 86400.0)));
  SELECT count(*) INTO v_reels FROM public.ligue_membres m WHERE m.groupe_id = p_groupe;

  RETURN QUERY
  WITH tous AS (
    SELECT 'u:' || m.user_id::text AS k, m.user_id AS uid,
           public.ligue_xp_semaine(m.user_id, v_semaine) AS pts,
           m.rejoint_le AS depuis, false AS ia, 0 AS place
      FROM public.ligue_membres m
     WHERE m.groupe_id = p_groupe
    UNION ALL
    SELECT 'r:' || p_groupe::text || ':' || s, NULL::uuid,
           public.ligue_robot_xp(p_groupe, s, v_echelon, v_fraction),
           v_debut + make_interval(secs => s), true, s
      FROM generate_series(1, GREATEST(0, 30 - v_reels)) AS s
  )
  SELECT t.k, t.uid, t.pts, t.depuis, t.ia, t.place,
         (ROW_NUMBER() OVER (ORDER BY t.pts DESC, t.depuis ASC, t.k COLLATE "C" ASC))::INTEGER
    FROM tous t;
END;
$$;

-- ─────────────────────────────────────── 8. la clôture et l'entrée (internes)

-- Clôture la semaine PASSÉE d'un joueur : son rang à la fin de la semaine, sa
-- montée ou sa descente, ses gemmes, le bonus d'amis dans sa barre de niveau,
-- et le bilan que l'écran rejouera. Sans effet si la semaine n'est pas finie.
CREATE OR REPLACE FUNCTION public.ligue_cloturer(p_user UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_groupe    UUID;
  v_semaine   DATE;
  v_echelon   INTEGER;
  v_rang      INTEGER;
  v_xp        INTEGER;
  v_taille    CONSTANT INTEGER := 30;
  v_apres     INTEGER;
  v_gemmes    INTEGER := 0;
  v_amis      INTEGER := 0;
  v_bonus     INTEGER := 0;
  v_verse     INTEGER := 0;
  v_niv_avant INTEGER;
  v_niv_apres INTEGER;
  v_gem_niv   INTEGER := 0;
BEGIN
  SELECT j.groupe_id INTO v_groupe
    FROM public.ligue_joueurs j WHERE j.user_id = p_user FOR UPDATE;
  IF v_groupe IS NULL THEN RETURN; END IF;

  SELECT g.semaine, g.echelon INTO v_semaine, v_echelon
    FROM public.ligue_groupes g WHERE g.id = v_groupe;
  IF v_semaine IS NULL OR v_semaine >= public.ligue_lundi(now()) THEN RETURN; END IF;

  -- Le classement À LA FIN de la semaine : les rivaux au bout de leur course.
  SELECT c.rang, c.xp INTO v_rang, v_xp
    FROM public.ligue_classement(v_groupe, (v_semaine + 7)::timestamp AT TIME ZONE 'utc') c
   WHERE c.user_id = p_user;
  v_rang := COALESCE(v_rang, v_taille);
  v_xp := COALESCE(v_xp, 0);

  v_apres := v_echelon;
  IF v_rang <= public.ligue_nb_promus(v_taille, v_echelon) AND v_xp > 0 THEN
    v_apres := LEAST(20, v_echelon + 1);
  ELSIF public.ligue_nb_relegues(v_taille, v_echelon) > 0
        AND v_rang > v_taille - public.ligue_nb_relegues(v_taille, v_echelon) THEN
    v_apres := GREATEST(0, v_echelon - 1);
  END IF;

  -- Les gemmes de la ligue : une fois par semaine, jamais deux.
  v_gemmes := public.ligue_gemmes(v_echelon, v_apres, v_rang, v_xp);
  IF v_gemmes > 0 THEN
    v_gemmes := public.gemmes_avec_bonus(p_user, v_gemmes);
    INSERT INTO public.gem_events (user_id, source, source_key, amount)
    VALUES (p_user, 'ligue', v_semaine::text, v_gemmes)
    ON CONFLICT DO NOTHING;
    IF FOUND THEN
      UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_gemmes WHERE id = p_user;
    ELSE
      v_gemmes := 0;
    END IF;
  END IF;

  -- Le multiplicateur d'amis : +10 % par ami accepté, jusqu'à 10 amis.
  SELECT count(*) INTO v_amis
    FROM public.friendships f
   WHERE f.status = 'accepted' AND p_user IN (f.requester_id, f.addressee_id);
  v_bonus := (v_xp * LEAST(10, v_amis)) / 10;

  PERFORM public.wallet_ensure(p_user);
  SELECT w.level INTO v_niv_avant FROM public.user_wallet w WHERE w.user_id = p_user;
  IF v_bonus > 0 THEN
    PERFORM public.wallet_grant_xp(p_user, 'bonus_amis', v_semaine::text, v_bonus);
    SELECT e.amount INTO v_verse
      FROM public.xp_events e
     WHERE e.user_id = p_user AND e.source = 'bonus_amis' AND e.source_key = v_semaine::text;
  END IF;
  SELECT w.level INTO v_niv_apres FROM public.user_wallet w WHERE w.user_id = p_user;
  IF COALESCE(v_niv_apres, 0) > COALESCE(v_niv_avant, 0) THEN
    SELECT COALESCE(SUM(e.amount), 0) INTO v_gem_niv
      FROM public.gem_events e
     WHERE e.user_id = p_user AND e.source = 'level_up'
       AND e.source_key ~ '^\d+$'
       AND e.source_key::INTEGER > v_niv_avant AND e.source_key::INTEGER <= v_niv_apres;
  END IF;

  INSERT INTO public.ligue_bilans (
    user_id, semaine, echelon_avant, echelon_apres, rang, taille, xp, gemmes,
    nb_amis, bonus_xp, niveau_avant, niveau_apres, gemmes_niveau)
  VALUES (
    p_user, v_semaine, v_echelon, v_apres, v_rang, v_taille, v_xp, v_gemmes,
    LEAST(v_amis, 32767), COALESCE(v_verse, 0), v_niv_avant, v_niv_apres, v_gem_niv)
  ON CONFLICT (user_id, semaine) DO NOTHING;

  UPDATE public.ligue_joueurs
     SET echelon = v_apres, groupe_id = NULL, maj_le = now()
   WHERE user_id = p_user;
END;
$$;

-- Entre dans le groupe de la semaine — dès la première XP de la semaine,
-- comme chez Duolingo. Les vrais élèves remplissent d'abord les groupes déjà
-- ouverts de leur échelon (ils se retrouvent entre eux), puis un nouveau.
CREATE OR REPLACE FUNCTION public.ligue_rejoindre(p_user UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_echelon INTEGER;
  v_groupe  UUID;
  v_lundi   DATE := public.ligue_lundi(now());
BEGIN
  SELECT j.echelon, j.groupe_id INTO v_echelon, v_groupe
    FROM public.ligue_joueurs j WHERE j.user_id = p_user FOR UPDATE;
  IF NOT FOUND OR v_groupe IS NOT NULL THEN RETURN; END IF;
  IF public.ligue_xp_semaine(p_user, v_lundi) <= 0 THEN RETURN; END IF;

  SELECT g.id INTO v_groupe
    FROM public.ligue_groupes g
   WHERE g.semaine = v_lundi AND g.echelon = v_echelon AND g.taille < 30
   ORDER BY g.cree_le, g.id
   LIMIT 1
   FOR UPDATE SKIP LOCKED;
  IF v_groupe IS NULL THEN
    INSERT INTO public.ligue_groupes (semaine, echelon)
    VALUES (v_lundi, v_echelon)
    RETURNING id INTO v_groupe;
  END IF;

  INSERT INTO public.ligue_membres (groupe_id, user_id)
  VALUES (v_groupe, p_user)
  ON CONFLICT DO NOTHING;
  IF FOUND THEN
    UPDATE public.ligue_groupes SET taille = taille + 1 WHERE id = v_groupe;
  END IF;

  UPDATE public.ligue_joueurs SET groupe_id = v_groupe, maj_le = now() WHERE user_id = p_user;
END;
$$;

-- Le passage commun des deux fonctions publiques : le joueur existe, sa
-- semaine passée est clôturée, il entre dans celle-ci s'il a de l'XP.
CREATE OR REPLACE FUNCTION public.ligue_mettre_a_jour(p_user UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.ligue_joueurs (user_id) VALUES (p_user) ON CONFLICT DO NOTHING;
  PERFORM public.ligue_cloturer(p_user);
  PERFORM public.ligue_rejoindre(p_user);
END;
$$;

-- ─────────────────────────────────────────── 9. ce que l'app appelle

-- Léger, appelé à chaque retour dans l'app (components/LigueVeille) : clôture,
-- entrée, et « un bilan attend-il ? » pour la pastille de l'onglet.
CREATE OR REPLACE FUNCTION public.ligue_toucher()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  PERFORM public.ligue_mettre_a_jour(v_user);
  RETURN jsonb_build_object(
    'echelon', (SELECT j.echelon FROM public.ligue_joueurs j WHERE j.user_id = v_user),
    'bilan', EXISTS (SELECT 1 FROM public.ligue_bilans b WHERE b.user_id = v_user AND NOT b.vu));
END;
$$;

-- Tout l'écran de la ligue en un appel : l'échelon, le groupe classé (les 30,
-- rivaux compris), l'XP de la semaine, les amis et leur XP de la semaine (pour
-- leur classement et le multiplicateur), et le dernier bilan pas encore vu.
CREATE OR REPLACE FUNCTION public.ligue_etat()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_user    UUID := auth.uid();
  v_lundi   DATE := public.ligue_lundi(now());
  v_echelon INTEGER;
  v_groupe  UUID;
  v_liste   JSONB;
  v_amis    JSONB;
  v_nb_amis INTEGER;
  v_bilan   JSONB;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  PERFORM public.ligue_mettre_a_jour(v_user);

  SELECT j.echelon, j.groupe_id INTO v_echelon, v_groupe
    FROM public.ligue_joueurs j WHERE j.user_id = v_user;

  IF v_groupe IS NOT NULL THEN
    SELECT jsonb_agg(jsonb_build_object(
             'cle', c.cle,
             'id', c.user_id,
             'robot', c.robot,
             'xp', c.xp,
             'rang', c.rang,
             'nom', CASE WHEN c.robot THEN public.ligue_robot_nom(v_groupe, c.slot)
                         ELSE split_part(COALESCE(NULLIF(btrim(p.full_name), ''), 'Élève'), ' ', 1) END,
             'portrait', COALESCE(p.avatar->>'portrait', ''),
             'moi', c.user_id IS NOT DISTINCT FROM v_user)
           ORDER BY c.rang)
      INTO v_liste
      FROM public.ligue_classement(v_groupe, now()) c
      LEFT JOIN public.profiles p ON p.id = c.user_id;
  END IF;

  -- Chaque ami : son XP de la semaine et SA division (Bronze 4 s'il n'est
  -- jamais entré dans une ligue) — le classement des amis se lit comme la ligue.
  SELECT count(*),
         COALESCE(jsonb_agg(jsonb_build_object(
           'id', a.ami,
           'xp', public.ligue_xp_semaine(a.ami, v_lundi),
           'echelon', COALESCE(lj.echelon, 0))), '[]'::jsonb)
    INTO v_nb_amis, v_amis
    FROM (SELECT CASE WHEN f.requester_id = v_user THEN f.addressee_id ELSE f.requester_id END AS ami
            FROM public.friendships f
           WHERE f.status = 'accepted' AND v_user IN (f.requester_id, f.addressee_id)) a
    LEFT JOIN public.ligue_joueurs lj ON lj.user_id = a.ami;

  SELECT to_jsonb(b) - 'user_id' INTO v_bilan
    FROM public.ligue_bilans b
   WHERE b.user_id = v_user AND NOT b.vu
   ORDER BY b.semaine DESC
   LIMIT 1;

  RETURN jsonb_build_object(
    'semaine', v_lundi,
    'fin', ((v_lundi + 7)::timestamp AT TIME ZONE 'utc'),
    'echelon', COALESCE(v_echelon, 0),
    'inscrit', v_groupe IS NOT NULL,
    'groupe', COALESCE(v_liste, '[]'::jsonb),
    'xp_semaine', public.ligue_xp_semaine(v_user, v_lundi),
    'nb_amis', v_nb_amis,
    'amis', v_amis,
    'bilan', v_bilan);
END;
$$;

-- Le bilan a été vu (l'animation jouée) : il ne revient plus. Les bilans plus
-- anciens encore en attente passent avec lui — on ne rejoue pas trois semaines.
CREATE OR REPLACE FUNCTION public.ligue_bilan_vu(p_semaine DATE)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.ligue_bilans
     SET vu = true
   WHERE user_id = (SELECT auth.uid()) AND semaine <= p_semaine AND NOT vu;
$$;

-- ─────────────────────────────────────────────────────────────── 10. droits

REVOKE ALL ON FUNCTION public.ligue_lundi(TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_nb_promus(INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_nb_relegues(INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_gemmes(INTEGER, INTEGER, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_robot_hasard(UUID, INTEGER, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_robot_cible(UUID, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_robot_xp(UUID, INTEGER, INTEGER, NUMERIC) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_robot_nom(UUID, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_xp_semaine(UUID, DATE) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_classement(UUID, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_cloturer(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_rejoindre(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_mettre_a_jour(UUID) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.ligue_toucher() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_etat() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_bilan_vu(DATE) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ligue_toucher() TO authenticated;
GRANT EXECUTE ON FUNCTION public.ligue_etat() TO authenticated;
GRANT EXECUTE ON FUNCTION public.ligue_bilan_vu(DATE) TO authenticated;

-- Vérifications (facultatives) :
--   SELECT public.ligue_gemmes(3, 4, 1, 100);   -- 40 : Argent 4 atteint + 1er
--   SELECT public.ligue_nb_promus(30, 5), public.ligue_nb_relegues(30, 5);  -- 7, 5
--   SELECT * FROM public.ligue_classement('<groupe>', now());
