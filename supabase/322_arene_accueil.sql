-- =============================================================================
-- Studuel — Migration 322 : l'arène en UN aller-retour au lieu de vingt
--
-- CE QUE FAIT `/defi` AUJOURD'HUI. La page d'accueil de l'app ouvre une vague
-- de VINGT lectures en parallèle (`Promise.all`), puis une seconde vague de
-- sept une fois le profil connu. Elles sont bien parallélisées : la LATENCE
-- tient (~1 aller-retour, pas vingt). Ce n'est pas le problème.
--
-- Le problème est le NOMBRE. Chaque lecture est une requête HTTP PostgREST qui
-- devient une requête Postgres. À cent mille élèves — ~180 pages/s au pic de
-- 17 h-21 h — cette seule page demande ~4 500 requêtes/s à la base. Aucune
-- instance mono-nœud ne tient ça, et le remède habituel (grossir la machine)
-- coûte linéairement pour un travail qui, lui, ne le nécessite pas : ces vingt
-- lectures interrogent la même base, dans la même transaction possible, pour
-- le même élève.
--
-- CE QUE FAIT CETTE FONCTION. Elle rassemble la vague 1 en un seul appel. Rien
-- n'est réécrit : chaque morceau appelle la MÊME RPC ou fait le MÊME select
-- qu'avant. Postgres fait le va-et-vient en interne, où il ne coûte rien.
--
-- ET ELLE SUPPRIME LA CASCADE. `clan_ranking` et `school_tournament_standings`
-- attendent aujourd'hui la vague 2 parce qu'elles ont besoin du `grade_level`
-- lu dans le profil de la vague 1 — soit un second aller-retour complet pour
-- une donnée que la base avait déjà sous la main. Ici, le profil est lu en
-- premier et le niveau est disponible immédiatement. La vague 2 perd donc ses
-- deux appels les plus lourds.
--
-- SECURITY INVOKER, ET C'EST LE POINT LE PLUS IMPORTANT DU FICHIER. La
-- fonction n'a aucun privilège propre : la RLS de chaque table s'applique
-- exactement comme si l'élève l'interrogeait lui-même. Regrouper vingt
-- lectures dans une fonction SECURITY DEFINER aurait été le raccourci
-- classique — et aurait fait de cette fonction un contournement de RLS sur
-- tout le périmètre personnel de l'élève, pour un gain de performance. Les
-- sous-RPC appelées ici gardent chacune leur propre régime (plusieurs sont
-- DEFINER et vérifient `auth.uid()` elles-mêmes) : on ne change rien à leurs
-- règles, on les appelle simplement d'un cran plus près.
--
-- CHAQUE LECTURE A SON PROPRE FILET, et ce n'est pas de la prudence
-- décorative. Le code TypeScript tolère aujourd'hui l'absence de CHAQUE
-- migration, une par une : `game_trophies` sans la 238, le tournoi sans la
-- 162, les quêtes sans la 205. Une RPC composite perdrait cette granularité —
-- une seule table manquante ferait tomber toute la page. Chaque morceau est
-- donc dans son propre bloc d'exception, et un morceau qui échoue vaut `null`
-- exactement comme un `data: null` côté client. Le `WHEN OTHERS` est large
-- VOLONTAIREMENT : il reproduit le `if (error) → data reste null` du code
-- appelant, qui ne distingue pas non plus les causes.
--
-- `(SELECT auth.uid())` et non `auth.uid()` : évalué une fois, index utilisable
-- — la règle que la 320 rend permanente.
--
-- LE CODE TOLÈRE SON ABSENCE : `/defi` retombe sur ses vingt lectures si la
-- RPC répond PGRST202. Déployer avant d'exécuter ne casse rien.
--
-- PRÉREQUIS : aucun strictement (tout est sous filet). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.arene_accueil(
  p_today      DATE,
  p_prev_week  DATE
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := (SELECT auth.uid());
  v_grade  TEXT;
  v_level  TEXT;
  r        JSONB := '{}'::jsonb;
  v        JSONB;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  -- ---------------------------------------------------------------- profil --
  -- `to_jsonb(p)` et non une liste de colonnes : le client lit ce qu'il
  -- connaît, et une colonne pas encore créée (le code se déploie AVANT ses
  -- migrations) ne fait pas échouer la lecture. C'est ce que faisait déjà
  -- `readRowTolerant` côté TypeScript, en une seule fois au lieu d'un essai
  -- par colonne manquante.
  BEGIN
    SELECT to_jsonb(p) INTO v FROM public.profiles p WHERE p.id = v_user;
    r := r || jsonb_build_object('profile', v);
    v_grade := v ->> 'grade_level';
  EXCEPTION WHEN OTHERS THEN
    r := r || jsonb_build_object('profile', NULL);
  END;

  -- Le cycle scolaire, miroir de `schoolLevelForGrade` (lib/grades.ts) et des
  -- trois branches posées par la 242. C'est lui qui rendait la vague 2
  -- nécessaire : il est ici disponible dès le profil lu.
  --
  -- MIROIR EXACT de `cycleOf` (lib/grades.ts), y compris ses deux pièges :
  --   · les classes du primaire s'écrivent en MAJUSCULES ('CM1', pas 'cm1') ;
  --   · le repli d'une classe inconnue OU ABSENTE est 'college', jamais NULL
  --     ni 'lycee' — c'est le cycle du plus gros des élèves, et le repli
  --     historique de `schoolLevelForGrade`.
  -- Un test compare cette liste à GRADE_CYCLES (lib/clan-level.test.ts) : les
  -- deux ne peuvent plus diverger en silence, ce qui aurait rangé tous les
  -- écoliers dans le classement du collège sans qu'aucune erreur ne s'affiche.
  v_level := CASE
    WHEN btrim(v_grade) IN ('CP', 'CE1', 'CE2', 'CM1', 'CM2') THEN 'primaire'
    WHEN btrim(v_grade) IN ('2de', '1re', '1re techno', 'Tle', 'Tle techno')
      THEN 'lycee'
    ELSE 'college'
  END;
  r := r || jsonb_build_object('level', v_level);

  -- ---------------------------------------------------- classements globaux --
  BEGIN r := r || jsonb_build_object('national', public.national_ranking());
  EXCEPTION WHEN OTHERS THEN r := r || jsonb_build_object('national', NULL); END;

  BEGIN r := r || jsonb_build_object('league', public.league_standings());
  EXCEPTION WHEN OTHERS THEN r := r || jsonb_build_object('league', NULL); END;

  -- Les trois RPC « amis » rendent des TABLE : on les agrège en tableau JSON,
  -- ce que le client recevait déjà de PostgREST.
  BEGIN
    r := r || jsonb_build_object('friends_trophies',
      COALESCE((SELECT jsonb_agg(t) FROM public.friends_trophies() t), '[]'::jsonb));
  EXCEPTION WHEN OTHERS THEN
    r := r || jsonb_build_object('friends_trophies', NULL);
  END;

  BEGIN
    r := r || jsonb_build_object('friends_live',
      COALESCE((SELECT jsonb_agg(t) FROM public.friends_live() t), '[]'::jsonb));
  EXCEPTION WHEN OTHERS THEN
    r := r || jsonb_build_object('friends_live', NULL);
  END;

  BEGIN
    r := r || jsonb_build_object('friends_overview',
      COALESCE((SELECT jsonb_agg(t) FROM public.friends_overview() t), '[]'::jsonb));
  EXCEPTION WHEN OTHERS THEN
    r := r || jsonb_build_object('friends_overview', NULL);
  END;

  -- --------------------------------------------- ce qui dépend DU CYCLE ------
  -- La cascade supprimée : ces deux-là exigeaient un second aller-retour.
  BEGIN r := r || jsonb_build_object('clan', public.clan_ranking(v_level));
  EXCEPTION WHEN OTHERS THEN r := r || jsonb_build_object('clan', NULL); END;

  BEGIN
    r := r || jsonb_build_object('tournament',
                                 public.school_tournament_standings(v_level));
  EXCEPTION WHEN OTHERS THEN
    r := r || jsonb_build_object('tournament', NULL);
  END;

  -- ------------------------------------------------ historique personnel -----
  BEGIN
    r := r || jsonb_build_object('ranked_matches', COALESCE((
      SELECT jsonb_agg(to_jsonb(m) ORDER BY m.created_at DESC)
        FROM (
          SELECT id, won, delta, trophies, opponent, created_at
            FROM public.ranked_matches
           WHERE user_id = v_user
           ORDER BY created_at DESC
           LIMIT 20
        ) m
    ), '[]'::jsonb));
  EXCEPTION WHEN OTHERS THEN
    r := r || jsonb_build_object('ranked_matches', NULL);
  END;

  -- File « À revoir » : même FILTRE, même tri et même borne que `getReviewItems`.
  --
  -- Le filtre `due_date <= aujourd'hui OU en Revanche` n'est pas un détail de
  -- volume : sans lui, la borne de 300 se remplirait d'items PAS ENCORE DUS et
  -- pourrait écarter les Revanches d'un élève qui revient après une longue
  -- absence — alors que la promesse de l'app est qu'elles passent en premier.
  -- Trier ET filtrer avant de couper garde la file honnête (c'est le
  -- raisonnement écrit dans `lib/srs.ts`, repris ici mot pour mot).
  BEGIN
    r := r || jsonb_build_object('review_items', COALESCE((
      SELECT jsonb_agg(to_jsonb(x))
        FROM (
          SELECT item_kind, item_id, subject, streak, lapses, due_date, in_revanche
            FROM public.review_items
           WHERE user_id = v_user
             AND (due_date <= p_today OR in_revanche IS TRUE)
           ORDER BY in_revanche DESC, due_date ASC
           LIMIT 300
        ) x
    ), '[]'::jsonb));
  EXCEPTION WHEN OTHERS THEN
    r := r || jsonb_build_object('review_items', NULL);
  END;

  BEGIN
    r := r || jsonb_build_object('quest_claims', COALESCE((
      SELECT jsonb_agg(quest_id)
        FROM public.daily_quest_claims
       WHERE user_id = v_user AND day_key = p_today
    ), '[]'::jsonb));
  EXCEPTION WHEN OTHERS THEN
    r := r || jsonb_build_object('quest_claims', NULL);
  END;

  BEGIN
    r := r || jsonb_build_object('gauges', COALESCE((
      SELECT jsonb_agg(to_jsonb(g)) FROM public.boss_gauges g WHERE g.user_id = v_user
    ), '[]'::jsonb));
  EXCEPTION WHEN OTHERS THEN
    r := r || jsonb_build_object('gauges', NULL);
  END;

  BEGIN
    r := r || jsonb_build_object('game_trophies', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'subject_slug', subject_slug, 'game_id', game_id, 'trophies', trophies))
        FROM public.game_trophies WHERE user_id = v_user
    ), '[]'::jsonb));
  EXCEPTION WHEN OTHERS THEN
    r := r || jsonb_build_object('game_trophies', NULL);
  END;

  BEGIN
    r := r || jsonb_build_object('subject_peaks', COALESCE((
      SELECT jsonb_agg(jsonb_build_object('subject_slug', subject_slug, 'peak', peak))
        FROM public.subject_peaks WHERE user_id = v_user
    ), '[]'::jsonb));
  EXCEPTION WHEN OTHERS THEN
    r := r || jsonb_build_object('subject_peaks', NULL);
  END;

  -- ------------------------------------------------------ clan et saison -----
  BEGIN r := r || jsonb_build_object('clan_week', public.clan_week_board(NULL));
  EXCEPTION WHEN OTHERS THEN r := r || jsonb_build_object('clan_week', NULL); END;

  BEGIN
    r := r || jsonb_build_object('clan_week_prev',
                                 public.clan_week_board(p_prev_week::TEXT));
  EXCEPTION WHEN OTHERS THEN
    r := r || jsonb_build_object('clan_week_prev', NULL);
  END;

  BEGIN
    r := r || jsonb_build_object('clan_week_claimed', EXISTS (
      SELECT 1 FROM public.clan_week_claims
       WHERE user_id = v_user AND week_key = p_prev_week::TEXT
    ));
  EXCEPTION WHEN OTHERS THEN
    r := r || jsonb_build_object('clan_week_claimed', NULL);
  END;

  BEGIN r := r || jsonb_build_object('season', public.season_state());
  EXCEPTION WHEN OTHERS THEN r := r || jsonb_build_object('season', NULL); END;

  RETURN r;
END;
$$;

GRANT EXECUTE ON FUNCTION public.arene_accueil(DATE, DATE) TO authenticated;

-- =============================================================================
-- VÉRIFIER — en se faisant passer pour un élève réel.
-- Chaque clé doit être présente ; une clé à `null` signale une migration
-- absente pour CE morceau (et l'écran s'en accommode), jamais une panne
-- globale.
-- =============================================================================
-- BEGIN;
--   SET LOCAL ROLE authenticated;
--   SET LOCAL request.jwt.claims = '{"sub":"COLLE-ICI-UN-UUID-ELEVE","role":"authenticated"}';
--   SELECT jsonb_object_keys(public.arene_accueil(current_date, current_date - 7));
--   EXPLAIN (ANALYZE, BUFFERS) SELECT public.arene_accueil(current_date, current_date - 7);
-- ROLLBACK;
