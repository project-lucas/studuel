-- =============================================================================
-- Studuel — Migration 465 : LE CLASSEMENT ENTRE AMIS (01/10/2026)
--
-- LE BUT. Dans l'onglet Moi, le bloc « Tes matières » laisse sa place à un
-- classement VISUEL de l'élève face à ses amis (Lucas, 01/10/2026 : « un
-- classement visuel du user vis-à-vis de ses amis — trophées, temps de
-- travail, en temps réel — pour qu'il puisse se comparer et vouloir battre les
-- autres, avec la couronne pour le numéro 1 et un autre icône pour celui qui a
-- le plus révisé et gagné de trophées »). Une colonne par personne ; il faut
-- donc, pour moi et pour chacun de mes amis ACCEPTÉS :
--
--   · les TROPHÉES — le total (`profiles.trophies`, le compte de l'arène) et ce
--     qui a été gagné ou perdu CETTE SEMAINE (somme des `game_matches.delta`) ;
--   · le TEMPS DE TRAVAIL — celui de la semaine (`work_daily`, 084) et le cumul
--     (`profiles.work_seconds`, 014).
--
-- Rien de cela n'était lisible pour un ami : `work_daily` et `game_matches` ne
-- se lisent que par leur propriétaire (RLS), et aucune des fonctions d'amis
-- (`friends_overview`, `friends_portraits`, `ligue_etat`) ne rend ni trophées
-- ni temps.
--
-- SECURITY DEFINER, ET LE PÉRIMÈTRE EST DANS LA FONCTION. Elle lit des tables
-- que la RLS réserve à leur propriétaire ; elle ne rend donc QUE le cercle de
-- l'appelant — lui-même et les comptes liés à lui par une amitié `accepted` —,
-- sans paramètre : il n'y a rien à falsifier. Un visiteur sans session reçoit
-- '[]'. Ce qui sort est ce que des amis voient déjà les uns des autres dans
-- l'app (le prénom, le blason, l'XP de la semaine dans la ligue) plus deux
-- nombres : les trophées et le temps de travail.
--
-- LA SEMAINE est celle de la ligue (376) : du lundi 00:00 UTC au lundi
-- suivant. Le « challenger » (celui qui a le plus travaillé et gagné de
-- trophées dans la semaine) est décerné par l'app, sur ces deux nombres
-- (lib/moi/classement-amis.ts).
--
-- LES INDEX SONT DÉJÀ LÀ : `game_matches_user_time_idx (user_id, created_at
-- DESC)` (238) et la clé primaire de `work_daily (user_id, day)` (084) servent
-- les deux sous-requêtes, ami par ami ; `friendships` se lit par ses deux
-- colonnes indexées (019). Un cercle de dix amis coûte une vingtaine de
-- lectures d'index.
--
-- LE CODE TOLÈRE SON ABSENCE : sans la fonction (PGRST202), l'écran montre la
-- seule colonne de l'élève, avec ses propres chiffres, et dit que le classement
-- de ses amis arrive. Déployer avant d'exécuter ne casse rien.
--
-- PRÉREQUIS : 014 (profiles.work_seconds), 019 (friendships), 084 (work_daily),
-- 159 (profiles.trophies), 238 (game_matches). À exécuter APRÈS la 464.
-- Idempotent. À exécuter à la main dans : Supabase Dashboard → SQL Editor →
-- New query → Run.
-- =============================================================================

-- [{ id, nom, portrait, moi, trophees, trophees_semaine, secondes,
--    secondes_semaine }] : l'appelant et ses amis acceptés, du plus titré au
-- moins titré (l'app retrie selon la mesure affichée). '[]' sans session.
CREATE OR REPLACE FUNCTION public.classement_amis()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH moi AS (
    SELECT (SELECT auth.uid()) AS id
  ),
  semaine AS (
    -- Le lundi 00:00 UTC de la semaine en cours.
    SELECT date_trunc('week', now() AT TIME ZONE 'utc') AS debut
  ),
  cercle AS (
    SELECT m.id FROM moi m WHERE m.id IS NOT NULL
    UNION
    SELECT CASE WHEN f.requester_id = m.id THEN f.addressee_id ELSE f.requester_id END
      FROM public.friendships f
      JOIN moi m ON m.id IN (f.requester_id, f.addressee_id)
     WHERE f.status = 'accepted'
  )
  SELECT COALESCE(
    jsonb_agg(jsonb_build_object(
                'id', p.id,
                'nom', split_part(COALESCE(NULLIF(btrim(p.full_name), ''), 'Élève'), ' ', 1),
                'portrait', COALESCE(p.avatar->>'portrait', ''),
                'moi', p.id = (SELECT id FROM moi),
                'trophees', COALESCE(p.trophies, 0),
                'trophees_semaine', COALESCE((
                  SELECT sum(g.delta)
                    FROM public.game_matches g
                   WHERE g.user_id = p.id
                     AND g.created_at >= ((SELECT debut FROM semaine) AT TIME ZONE 'utc')
                ), 0),
                'secondes', COALESCE(p.work_seconds, 0),
                'secondes_semaine', COALESCE((
                  SELECT sum(w.seconds)
                    FROM public.work_daily w
                   WHERE w.user_id = p.id
                     AND w.day >= (SELECT debut FROM semaine)::date
                ), 0))
              ORDER BY COALESCE(p.trophies, 0) DESC, p.id),
    '[]'::jsonb)
    FROM cercle c
    JOIN public.profiles p ON p.id = c.id;
$$;

REVOKE ALL ON FUNCTION public.classement_amis() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.classement_amis() TO authenticated;

-- =============================================================================
-- VÉRIFIER (facultatif) — colle l'UUID d'un élève qui a des amis :
-- BEGIN;
--   SET LOCAL ROLE authenticated;
--   SET LOCAL request.jwt.claims = '{"sub":"COLLE-ICI-UN-UUID-ELEVE","role":"authenticated"}';
--   SELECT jsonb_pretty(public.classement_amis());
--   -- attendu : une ligne pour l'élève ("moi": true) et une par ami accepté,
--   -- jamais un compte qui n'est pas son ami.
-- ROLLBACK;
-- =============================================================================
