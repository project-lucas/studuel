-- =============================================================================
-- Studuel — Migration 379 : LE COFFRE D'ÉQUIPE (onglet Amis, 24/09/2026)
--
-- Lucas remplace la tirelire d'amis (377) par un COFFRE D'ÉQUIPE : toute l'XP
-- qu'un élève gagne dans la semaine compte DEUX fois — une fois dans sa barre
-- de niveau (comme avant), une fois dans son coffre —, et celle de ses amis
-- aussi, à 100 %.
--
-- LA RÈGLE (miroir de lib/ligue.ts : `COFFRE_NIVEAUX`, `calculerCoffre`,
-- `niveauCoffre`) :
--   • les POINTS du coffre = MON XP de la semaine + l'XP de la semaine de mes
--     amis acceptés — les 10 qui ont le plus joué, garde-fou contre les
--     comptes créés pour gonfler un coffre ;
--   • CINQ NIVEAUX, le contenu du niveau ATTEINT (pas la somme) :
--       niveau 1 :   100 points → +100 XP  · +5 gemmes
--       niveau 2 :   250 points → +250 XP  · +10 gemmes
--       niveau 3 :   450 points → +450 XP  · +15 gemmes
--       niveau 4 :   700 points → +700 XP  · +25 gemmes
--       niveau 5 : 1 000 points → +1 000 XP · +40 gemmes
--     sous 100 points : niveau 0, le coffre est vide ;
--   • il ne s'ouvre qu'une fois la semaine FINIE (lundi 00:00 UTC). La clôture
--     paresseuse de la 376 (`ligue_cloturer`, joueur par joueur) ENREGISTRE un
--     coffre prêt — rien n'est versé ; l'élève l'OUVRE quand il veut
--     (`coffre_equipe_ouvrir`), et c'est là seulement que l'XP (source
--     « coffre_equipe », dans la barre de niveau, doublée si un Boost XP court)
--     et les gemmes (doublées pendant le week-end ×2) sont versées. Un coffre
--     non ouvert le reste indéfiniment ;
--   • rien sans avoir joué soi-même : sans XP à soi dans la semaine, pas de
--     coffre (on ne vit pas de l'XP de ses amis) ;
--   • l'XP rendue par un coffre (et l'ancien bonus d'amis) ne compte ni dans
--     la ligue ni dans le coffre de la semaine où elle tombe
--     (`ligue_xp_semaine`) ;
--   • le lundi à 8 h (Paris), un push : « ton coffre d'équipe est ouvert »
--     (`push_coffre_targets`, type « coffre » du journal d'envoi).
--
-- Plus de paliers de gemmes en cours de semaine (`tirelire_encaisser` devient
-- une coquille qui ne paie rien) ni de tirelire qui se casse dans la barre de
-- niveau (plus de « bonus_amis ») : le coffre les remplace. Les fonctions
-- internes de la tirelire (377) restent en base, sans appelant.
--
-- Elle REMPLACE, par-dessus la 376 et la 377 : `ligue_xp_semaine`,
-- `ligue_cloturer`, `ligue_mettre_a_jour`, `ligue_etat`, `ligue_toucher` et
-- `tirelire_encaisser`. Ni la 376 ni la 377 ne sont modifiées.
--
-- PRÉREQUIS : 376 (ligue), 377 (tirelire : colonnes du bilan, reprises ici par
-- sécurité), 368 (wallet_grant_xp, gemmes_avec_bonus), 195 (push_send_log),
-- 045 (push_subscriptions). À exécuter APRÈS la 378. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ─────────────────────────────────────────────────── 1. les coffres prêts

-- Un coffre par élève et par semaine FINIE, enregistré à la clôture avec son
-- contenu (les gemmes de BASE : le bonus du week-end ×2 se décide à
-- l'ouverture), puis marqué ouvert avec ce qui a VRAIMENT été versé.
CREATE TABLE IF NOT EXISTS public.coffres_equipe (
  user_id        UUID        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  semaine        DATE        NOT NULL,
  niveau         SMALLINT    NOT NULL CHECK (niveau BETWEEN 1 AND 5),
  points         INTEGER     NOT NULL DEFAULT 0 CHECK (points >= 0),
  xp             INTEGER     NOT NULL CHECK (xp >= 0),
  gemmes         INTEGER     NOT NULL CHECK (gemmes >= 0),
  cree_le        TIMESTAMPTZ NOT NULL DEFAULT now(),
  ouvert_le      TIMESTAMPTZ,
  xp_versee      INTEGER,
  gemmes_versees INTEGER,
  PRIMARY KEY (user_id, semaine)
);

-- « Un coffre attend-il ? » est lu à chaque retour dans l'app (ligue_toucher)
-- et par le push du lundi : un petit index des seuls coffres pas encore
-- ouverts, qui se vide à mesure qu'on les ouvre.
CREATE INDEX IF NOT EXISTS coffres_equipe_prets_idx
  ON public.coffres_equipe (user_id, semaine)
  WHERE ouvert_le IS NULL;

-- L'élève lit SES coffres ; seules les fonctions SECURITY DEFINER ci-dessous
-- écrivent (aucune policy d'écriture, aucun droit d'écriture).
ALTER TABLE public.coffres_equipe ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coffres_equipe_select_own" ON public.coffres_equipe;
CREATE POLICY "coffres_equipe_select_own" ON public.coffres_equipe
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

REVOKE ALL ON TABLE public.coffres_equipe FROM anon, authenticated;
GRANT SELECT ON TABLE public.coffres_equipe TO authenticated;

-- Le bilan de la semaine dit quel coffre la clôture a enregistré (0 : aucun).
-- Les deux colonnes de la 377 sont reprises par sécurité (sans effet si elle
-- est passée) : `ligue_cloturer` ci-dessous les écrit.
ALTER TABLE public.ligue_bilans
  ADD COLUMN IF NOT EXISTS gemmes_tirelire SMALLINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tirelire_amis   INTEGER  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS coffre_niveau   SMALLINT NOT NULL DEFAULT 0;

-- ──────────────────────────────────────────── 2. trois sources de plus
-- Lues dans la contrainte EXISTANTE (méthode de la 373, 376, 377) : rejouer
-- n'ajoute rien deux fois.

DO $$
DECLARE
  v_def     TEXT;
  v_sources TEXT[];
BEGIN
  -- L'XP rendue par un coffre.
  SELECT pg_get_constraintdef(c.oid) INTO v_def
    FROM pg_constraint c
   WHERE c.conname = 'xp_events_source_check'
     AND c.conrelid = 'public.xp_events'::regclass;
  IF v_def IS NOT NULL AND v_def !~ '\mcoffre_equipe\M' THEN
    SELECT array_agg(DISTINCT btrim(s)) INTO v_sources
      FROM regexp_matches(v_def, '''([^'']+)''', 'g') AS m,
           LATERAL unnest(string_to_array(btrim(m[1], '{}'), ',')) AS s
     WHERE btrim(s) <> '';
    v_sources := array_append(COALESCE(v_sources, ARRAY[]::TEXT[]), 'coffre_equipe');
    EXECUTE 'ALTER TABLE public.xp_events DROP CONSTRAINT xp_events_source_check';
    EXECUTE format('ALTER TABLE public.xp_events ADD CONSTRAINT xp_events_source_check CHECK (source IN (%s))',
                   (SELECT string_agg(quote_literal(x), ', ' ORDER BY x) FROM unnest(v_sources) x));
  END IF;

  -- Les gemmes rendues par un coffre.
  SELECT pg_get_constraintdef(c.oid) INTO v_def
    FROM pg_constraint c
   WHERE c.conname = 'gem_events_source_check'
     AND c.conrelid = 'public.gem_events'::regclass;
  IF v_def IS NOT NULL AND v_def !~ '\mcoffre_equipe\M' THEN
    SELECT array_agg(DISTINCT btrim(s)) INTO v_sources
      FROM regexp_matches(v_def, '''([^'']+)''', 'g') AS m,
           LATERAL unnest(string_to_array(btrim(m[1], '{}'), ',')) AS s
     WHERE btrim(s) <> '';
    v_sources := array_append(COALESCE(v_sources, ARRAY[]::TEXT[]), 'coffre_equipe');
    EXECUTE 'ALTER TABLE public.gem_events DROP CONSTRAINT gem_events_source_check';
    EXECUTE format('ALTER TABLE public.gem_events ADD CONSTRAINT gem_events_source_check CHECK (source IN (%s))',
                   (SELECT string_agg(quote_literal(x), ', ' ORDER BY x) FROM unnest(v_sources) x));
  END IF;

  -- Le push du lundi : un type de rappel de plus dans le journal d'envoi (195).
  v_def := NULL;
  IF to_regclass('public.push_send_log') IS NOT NULL THEN
    SELECT pg_get_constraintdef(c.oid) INTO v_def
      FROM pg_constraint c
     WHERE c.conname = 'push_send_log_kind_check'
       AND c.conrelid = 'public.push_send_log'::regclass;
  END IF;
  IF v_def IS NOT NULL AND v_def !~ '\mcoffre\M' THEN
    SELECT array_agg(DISTINCT btrim(s)) INTO v_sources
      FROM regexp_matches(v_def, '''([^'']+)''', 'g') AS m,
           LATERAL unnest(string_to_array(btrim(m[1], '{}'), ',')) AS s
     WHERE btrim(s) <> '';
    v_sources := array_append(COALESCE(v_sources, ARRAY[]::TEXT[]), 'coffre');
    EXECUTE 'ALTER TABLE public.push_send_log DROP CONSTRAINT push_send_log_kind_check';
    EXECUTE format('ALTER TABLE public.push_send_log ADD CONSTRAINT push_send_log_kind_check CHECK (kind IN (%s))',
                   (SELECT string_agg(quote_literal(x), ', ' ORDER BY x) FROM unnest(v_sources) x));
  END IF;
END $$;

-- ───────────────────────────── 3. les règles (miroir de lib/ligue.ts)

-- Les cinq niveaux : le seuil de points, et ce que le coffre contient.
CREATE OR REPLACE FUNCTION public.ligue_coffre_niveaux()
RETURNS TABLE (niveau INTEGER, seuil INTEGER, xp INTEGER, gemmes INTEGER)
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  VALUES (1,  100,  100,  5),
         (2,  250,  250, 10),
         (3,  450,  450, 15),
         (4,  700,  700, 25),
         (5, 1000, 1000, 40);
$$;

-- L'XP de la semaine, sans ce qui est RENDU : l'ancien bonus d'amis (376, 377)
-- et l'XP d'un coffre ouvert — versés le lundi, ils gonfleraient la ligue et
-- le coffre de la semaine suivante.
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
     AND e.source NOT IN ('bonus_amis', 'coffre_equipe');
$$;

-- Le coffre d'un élève pour une semaine : son XP, le nombre de ses amis, la
-- part de ses amis (l'XP des 10 qui ont le plus joué, à 100 %), les points et
-- le niveau atteint (0 → 5). Un ami lié dans les deux sens ne compte qu'une fois.
CREATE OR REPLACE FUNCTION public.ligue_coffre(p_user UUID, p_semaine DATE)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_xp_moi    INTEGER := public.ligue_xp_semaine(p_user, p_semaine);
  v_nb_amis   INTEGER := 0;
  v_part_amis INTEGER := 0;
  v_points    INTEGER;
  v_niveau    INTEGER;
BEGIN
  SELECT count(*), COALESCE(SUM(t.xp) FILTER (WHERE t.ordre <= 10), 0)
    INTO v_nb_amis, v_part_amis
    FROM (
      SELECT x.xp, ROW_NUMBER() OVER (ORDER BY x.xp DESC) AS ordre
        FROM (
          SELECT public.ligue_xp_semaine(a.ami, p_semaine) AS xp
            FROM (
              SELECT DISTINCT
                     CASE WHEN f.requester_id = p_user THEN f.addressee_id ELSE f.requester_id END AS ami
                FROM public.friendships f
               WHERE f.status = 'accepted' AND p_user IN (f.requester_id, f.addressee_id)
            ) a
        ) x
    ) t;

  v_points := v_xp_moi + v_part_amis;
  SELECT COALESCE(MAX(n.niveau), 0) INTO v_niveau
    FROM public.ligue_coffre_niveaux() n
   WHERE n.seuil <= v_points;

  RETURN jsonb_build_object(
    'xp_moi', v_xp_moi,
    'nb_amis', v_nb_amis,
    'part_amis', v_part_amis,
    'points', v_points,
    'niveau', v_niveau);
END;
$$;

-- ─────────────────────────── 4. enregistrer un coffre prêt (interne)

-- Enregistre le coffre d'une semaine FINIE, calculé par `ligue_coffre` —
-- rien n'est versé. Rend le niveau du coffre enregistré (celui déjà en base
-- s'il existe), 0 s'il n'y en a pas : semaine pas finie, pas d'XP à soi, ou
-- moins de 100 points. Une fois par semaine, jamais deux (clé primaire).
CREATE OR REPLACE FUNCTION public.ligue_coffre_enregistrer(p_user UUID, p_semaine DATE, p_coffre JSONB)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_niveau   INTEGER := COALESCE((p_coffre->>'niveau')::INTEGER, 0);
  v_xp_moi   INTEGER := COALESCE((p_coffre->>'xp_moi')::INTEGER, 0);
  v_existant INTEGER;
BEGIN
  IF p_user IS NULL OR p_semaine IS NULL OR p_semaine >= public.ligue_lundi(now()) THEN
    RETURN 0;
  END IF;

  SELECT c.niveau INTO v_existant
    FROM public.coffres_equipe c
   WHERE c.user_id = p_user AND c.semaine = p_semaine;
  IF FOUND THEN RETURN v_existant; END IF;

  IF v_xp_moi <= 0 OR v_niveau < 1 THEN RETURN 0; END IF;

  INSERT INTO public.coffres_equipe (user_id, semaine, niveau, points, xp, gemmes)
  SELECT p_user, p_semaine, n.niveau, GREATEST(0, COALESCE((p_coffre->>'points')::INTEGER, 0)),
         n.xp, n.gemmes
    FROM public.ligue_coffre_niveaux() n
   WHERE n.niveau = v_niveau
  ON CONFLICT (user_id, semaine) DO NOTHING;

  RETURN v_niveau;
END;
$$;

-- ────────────────────── 5. la clôture : le coffre s'enregistre, rien ne tombe

-- La partie ligue est celle de la 376/377 (classement à la fin de la semaine,
-- montée ou descente, gemmes de ligue). La tirelire disparaît : ni paliers, ni
-- XP « bonus_amis » ; le coffre de la semaine est enregistré, à ouvrir.
CREATE OR REPLACE FUNCTION public.ligue_cloturer(p_user UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_groupe     UUID;
  v_semaine    DATE;
  v_echelon    INTEGER;
  v_rang       INTEGER;
  v_xp         INTEGER;
  v_taille     CONSTANT INTEGER := 30;
  v_apres      INTEGER;
  v_gemmes     INTEGER := 0;
  v_coffre     JSONB;
  v_coffre_niv INTEGER := 0;
  v_niveau     INTEGER;
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

  -- LE COFFRE D'ÉQUIPE : enregistré, pas versé — l'élève l'ouvrira. Rien sans
  -- XP à soi, rien sous 100 points.
  v_coffre     := public.ligue_coffre(p_user, v_semaine);
  v_coffre_niv := public.ligue_coffre_enregistrer(p_user, v_semaine, v_coffre);

  -- Rien ne tombe dans la barre de niveau à la clôture : le niveau du bilan
  -- est celui du portefeuille, avant comme après.
  PERFORM public.wallet_ensure(p_user);
  SELECT w.level INTO v_niveau FROM public.user_wallet w WHERE w.user_id = p_user;

  INSERT INTO public.ligue_bilans (
    user_id, semaine, echelon_avant, echelon_apres, rang, taille, xp, gemmes,
    nb_amis, bonus_xp, niveau_avant, niveau_apres, gemmes_niveau,
    gemmes_tirelire, tirelire_amis, coffre_niveau)
  VALUES (
    p_user, v_semaine, v_echelon, v_apres, v_rang, v_taille, v_xp, v_gemmes,
    LEAST(COALESCE((v_coffre->>'nb_amis')::INTEGER, 0), 32767), 0, v_niveau, v_niveau, 0,
    0, COALESCE((v_coffre->>'part_amis')::INTEGER, 0), v_coffre_niv)
  ON CONFLICT (user_id, semaine) DO NOTHING;

  UPDATE public.ligue_joueurs
     SET echelon = v_apres, groupe_id = NULL, maj_le = now()
   WHERE user_id = p_user;
END;
$$;

-- Le passage commun des fonctions publiques (376), avec une étape de plus :
-- le coffre de la semaine PASSÉE s'enregistre aussi pour qui n'est jamais
-- entré dans un groupe. On n'entre dans la ligue qu'au réveil qui SUIT la
-- première XP (`ligue_rejoindre`) : un élève qui a joué une seule fois, sans
-- revenir de la semaine, n'a pas de groupe à clôturer — mais il a bien joué,
-- et le push du lundi lui a annoncé son coffre.
CREATE OR REPLACE FUNCTION public.ligue_mettre_a_jour(p_user UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_passee DATE := public.ligue_lundi(now()) - 7;
BEGIN
  INSERT INTO public.ligue_joueurs (user_id) VALUES (p_user) ON CONFLICT DO NOTHING;
  PERFORM public.ligue_cloturer(p_user);
  -- La lecture la moins chère d'abord : déjà enregistré, ou pas d'XP à soi.
  IF NOT EXISTS (SELECT 1 FROM public.coffres_equipe c
                  WHERE c.user_id = p_user AND c.semaine = v_passee)
     AND public.ligue_xp_semaine(p_user, v_passee) > 0 THEN
    PERFORM public.ligue_coffre_enregistrer(p_user, v_passee, public.ligue_coffre(p_user, v_passee));
  END IF;
  PERFORM public.ligue_rejoindre(p_user);
END;
$$;

-- ───────────────────────────── 6. ce que l'app appelle : la ligue et le coffre

-- Léger, à chaque retour dans l'app (components/LigueVeille) : clôture,
-- entrée, « un bilan attend-il ? » et « un coffre attend-il d'être ouvert ? ».
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
    'bilan', EXISTS (SELECT 1 FROM public.ligue_bilans b WHERE b.user_id = v_user AND NOT b.vu),
    'coffre', EXISTS (SELECT 1 FROM public.coffres_equipe c
                       WHERE c.user_id = v_user AND c.ouvert_le IS NULL));
END;
$$;

-- Tout l'écran en un appel (celui de la 377, la tirelire en moins) : le coffre
-- de la semaine en cours, et les coffres des semaines finies pas encore
-- ouverts, le plus ancien d'abord.
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
  v_prets   JSONB;
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

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
           'semaine', c.semaine,
           'niveau', c.niveau,
           'points', c.points,
           'xp', c.xp,
           'gemmes', c.gemmes)
         ORDER BY c.semaine), '[]'::jsonb)
    INTO v_prets
    FROM public.coffres_equipe c
   WHERE c.user_id = v_user AND c.ouvert_le IS NULL;

  RETURN jsonb_build_object(
    'semaine', v_lundi,
    'fin', ((v_lundi + 7)::timestamp AT TIME ZONE 'utc'),
    'echelon', COALESCE(v_echelon, 0),
    'inscrit', v_groupe IS NOT NULL,
    'groupe', COALESCE(v_liste, '[]'::jsonb),
    'xp_semaine', public.ligue_xp_semaine(v_user, v_lundi),
    'nb_amis', v_nb_amis,
    'amis', v_amis,
    'bilan', v_bilan,
    'coffre', public.ligue_coffre(v_user, v_lundi),
    'coffres_prets', v_prets);
END;
$$;

-- ─────────────────────────────────────────── 7. ouvrir un coffre (public)

-- L'élève ouvre le coffre d'une semaine finie : l'XP dans sa barre de niveau,
-- les gemmes dans son solde, une fois, jamais deux — la ligne est verrouillée,
-- et les traces (xp_events, gem_events) ont chacune leur clé unique. Rien ne
-- vient de l'appelant que la semaine : le contenu a été fixé à la clôture.
CREATE OR REPLACE FUNCTION public.coffre_equipe_ouvrir(p_semaine DATE)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_user      UUID := auth.uid();
  v_coffre    public.coffres_equipe%ROWTYPE;
  v_niv_avant INTEGER;
  v_niv_apres INTEGER;
  v_xp        INTEGER;
  v_gemmes    INTEGER;
  v_gem_niv   INTEGER := 0;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;
  IF p_semaine IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'introuvable');
  END IF;

  -- La semaine vient peut-être de finir et sa clôture paresseuse n'a pas
  -- encore eu lieu : on la réveille d'abord, comme au retour dans l'app.
  PERFORM public.ligue_mettre_a_jour(v_user);

  SELECT * INTO v_coffre
    FROM public.coffres_equipe c
   WHERE c.user_id = v_user AND c.semaine = p_semaine
   FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'introuvable');
  END IF;
  IF v_coffre.ouvert_le IS NOT NULL THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja_ouvert');
  END IF;

  PERFORM public.wallet_ensure(v_user);
  SELECT w.level INTO v_niv_avant FROM public.user_wallet w WHERE w.user_id = v_user;

  -- L'XP, dans la barre de niveau (doublée si un Boost XP court), relue dans
  -- sa trace : c'est ce qui a VRAIMENT été versé.
  PERFORM public.wallet_grant_xp(v_user, 'coffre_equipe', p_semaine::text, v_coffre.xp);
  SELECT e.amount INTO v_xp
    FROM public.xp_events e
   WHERE e.user_id = v_user AND e.source = 'coffre_equipe' AND e.source_key = p_semaine::text;

  -- Les gemmes (doublées pendant le week-end ×2), relues dans leur trace.
  v_gemmes := public.gemmes_avec_bonus(v_user, v_coffre.gemmes);
  IF v_gemmes > 0 THEN
    INSERT INTO public.gem_events (user_id, source, source_key, amount)
    VALUES (v_user, 'coffre_equipe', p_semaine::text, v_gemmes)
    ON CONFLICT DO NOTHING;
    IF FOUND THEN
      UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_gemmes WHERE id = v_user;
    END IF;
  END IF;
  SELECT e.amount INTO v_gemmes
    FROM public.gem_events e
   WHERE e.user_id = v_user AND e.source = 'coffre_equipe' AND e.source_key = p_semaine::text;

  -- Les niveaux de joueur gagnés grâce au coffre paient leurs gemmes (versées
  -- par wallet_grant_xp) : on les compte pour l'écran.
  SELECT w.level INTO v_niv_apres FROM public.user_wallet w WHERE w.user_id = v_user;
  IF COALESCE(v_niv_apres, 0) > COALESCE(v_niv_avant, 0) THEN
    SELECT COALESCE(SUM(e.amount), 0) INTO v_gem_niv
      FROM public.gem_events e
     WHERE e.user_id = v_user AND e.source = 'level_up'
       AND e.source_key ~ '^\d+$'
       AND e.source_key::INTEGER > v_niv_avant AND e.source_key::INTEGER <= v_niv_apres;
  END IF;

  UPDATE public.coffres_equipe
     SET ouvert_le = now(),
         xp_versee = COALESCE(v_xp, 0),
         gemmes_versees = COALESCE(v_gemmes, 0)
   WHERE user_id = v_user AND semaine = p_semaine;

  RETURN jsonb_build_object(
    'ok', true,
    'semaine', p_semaine,
    'niveau', v_coffre.niveau,
    'xp', COALESCE(v_xp, 0),
    'gemmes', COALESCE(v_gemmes, 0),
    'niveau_avant', v_niv_avant,
    'niveau_apres', v_niv_apres,
    'gemmes_niveau', v_gem_niv);
END;
$$;

-- Le coffre dans le bandeau du haut, lecture LÉGÈRE (ni clôture ni entrée) :
-- le coffre de la semaine en cours (mêmes clés que `ligue_coffre` : xp_moi,
-- nb_amis, part_amis, points, niveau) et « un coffre attend-il d'être ouvert ? ».
CREATE OR REPLACE FUNCTION public.coffre_equipe_etat()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  RETURN public.ligue_coffre(v_user, public.ligue_lundi(now()))
      || jsonb_build_object(
           'pret', EXISTS (SELECT 1 FROM public.coffres_equipe c
                            WHERE c.user_id = v_user AND c.ouvert_le IS NULL));
END;
$$;

-- ──────────────────────────────────────── 8. le push du lundi (le cron)

-- Cibles du rappel « ton coffre d'équipe est ouvert » (lundi 8 h, Paris) :
-- chaque appareil abonné d'un élève dont le coffre de la semaine PASSÉE est
-- prêt et pas ouvert — enregistré à la clôture, ou (clôture paresseuse pas
-- encore passée) calculé ici, à condition d'avoir de l'XP à soi et au moins
-- 100 points. Sans les élèves déjà notifiés aujourd'hui (type « coffre »).
-- `ligue_coffre` n'est calculé que pour les abonnés au push qui ont joué la
-- semaine passée et n'ont pas encore de coffre enregistré.
-- Appelée avec la clé service_role (RLS contournée) par le cron.
CREATE OR REPLACE FUNCTION public.push_coffre_targets(p_today DATE)
RETURNS TABLE (
  user_id  UUID,
  endpoint TEXT,
  p256dh   TEXT,
  auth     TEXT,
  niveau   INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH semaine AS MATERIALIZED (
    SELECT public.ligue_lundi(now()) - 7 AS s
  ),
  abonnes AS MATERIALIZED (
    SELECT DISTINCT ps.user_id AS uid
      FROM public.push_subscriptions ps
     WHERE NOT EXISTS (
             SELECT 1 FROM public.push_send_log l
              WHERE l.user_id = ps.user_id
                AND l.kind = 'coffre'
                AND l.sent_on = p_today)
  ),
  enregistres AS MATERIALIZED (
    SELECT a.uid, c.niveau::INTEGER AS niv, (c.ouvert_le IS NULL) AS a_ouvrir
      FROM abonnes a
      JOIN public.coffres_equipe c
        ON c.user_id = a.uid AND c.semaine = (SELECT s FROM semaine)
  ),
  a_calculer AS MATERIALIZED (
    SELECT a.uid
      FROM abonnes a
     WHERE NOT EXISTS (SELECT 1 FROM enregistres e WHERE e.uid = a.uid)
       AND public.ligue_xp_semaine(a.uid, (SELECT s FROM semaine)) > 0
  ),
  calcules AS MATERIALIZED (
    SELECT k.uid, public.ligue_coffre(k.uid, (SELECT s FROM semaine)) AS coffre
      FROM a_calculer k
  ),
  prets AS (
    SELECT e.uid, e.niv FROM enregistres e WHERE e.a_ouvrir
    UNION ALL
    SELECT c.uid, (c.coffre->>'niveau')::INTEGER
      FROM calcules c
     WHERE (c.coffre->>'xp_moi')::INTEGER > 0
       AND (c.coffre->>'niveau')::INTEGER >= 1
  )
  SELECT ps.user_id, ps.endpoint, ps.p256dh, ps.auth, p.niv
    FROM prets p
    JOIN public.push_subscriptions ps ON ps.user_id = p.uid;
$$;

-- ──────────────────────────── 9. la tirelire ne paie plus rien (coquille)

-- Gardée pour les appelants encore en place (et la sonde de santé de la 377) :
-- plus aucun palier ne se paie en cours de semaine, le coffre les remplace.
CREATE OR REPLACE FUNCTION public.tirelire_encaisser()
RETURNS JSONB
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT jsonb_build_object('gemmes', 0, 'payes', '[]'::jsonb);
$$;

-- ─────────────────────────────────────────────────────────────── 10. droits

REVOKE ALL ON FUNCTION public.ligue_coffre_niveaux() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_xp_semaine(UUID, DATE) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_coffre(UUID, DATE) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_coffre_enregistrer(UUID, DATE, JSONB) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_cloturer(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_mettre_a_jour(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.push_coffre_targets(DATE) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.ligue_toucher() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_etat() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.coffre_equipe_ouvrir(DATE) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.coffre_equipe_etat() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tirelire_encaisser() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.ligue_toucher() TO authenticated;
GRANT EXECUTE ON FUNCTION public.ligue_etat() TO authenticated;
GRANT EXECUTE ON FUNCTION public.coffre_equipe_ouvrir(DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.coffre_equipe_etat() TO authenticated;
GRANT EXECUTE ON FUNCTION public.tirelire_encaisser() TO authenticated;
-- Le cron seulement (clé service_role), jamais un élève.
GRANT EXECUTE ON FUNCTION public.push_coffre_targets(DATE) TO service_role;

-- Vérifications (facultatives) :
--   SELECT * FROM public.ligue_coffre_niveaux();
--   SELECT public.ligue_coffre('<élève>', public.ligue_lundi(now()));
--   SELECT * FROM public.coffres_equipe WHERE ouvert_le IS NULL ORDER BY semaine DESC LIMIT 20;
--   SELECT count(*) FROM public.push_coffre_targets((now() AT TIME ZONE 'utc')::date);
--   SELECT pg_get_constraintdef(oid) FROM pg_constraint
--    WHERE conname IN ('xp_events_source_check', 'gem_events_source_check', 'push_send_log_kind_check');
