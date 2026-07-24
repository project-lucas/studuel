-- =============================================================================
-- Scolaria — Migration 200 : Profil de jeu (onglet Défi, façon Clash Royale)
-- =============================================================================
-- Ajoute la couche « identité de joueur » surfacée en haut-gauche de /defi :
--   - un PSEUDO de jeu (`gamertag`) distinct du nom réel (confidentialité) ;
--   - jusqu'à 3 BADGES ÉQUIPÉS mis en avant sur la carte de profil ;
--   - une BANNIÈRE de profil illustrée, découplée de l'avatar DiceBear.
--
-- Le catalogue de badges (table `badges`) existe déjà (010/014/015) mais rien
-- ne les attribuait : la RPC `award_earned_badges` recalcule les badges mérités
-- à partir des données RÉELLES (anti-triche, miroir de `claim_avatar_unlocks`)
-- et crédite `user_badges`. `set_equipped_badges` valide que chaque badge mis en
-- avant est bien acquis. `equip_profile_banner` valide la possession de la
-- bannière (item du vestiaire).
--
-- Sécurité (mêmes règles que le vestiaire, cf. 189) :
--   - `equipped_badges` / `profile_banner` : AUCUN GRANT UPDATE direct — seules
--     les RPC SECURITY DEFINER écrivent, après vérification de possession ;
--   - `gamertag` : GRANT UPDATE par colonne (validé aussi par la Server Action) ;
--   - les nouvelles bannières sont des `avatar_items` (catégorie 'banner') : le
--     prix/déblocage est lu EN BASE, jamais reçu du client.
--
-- Idempotente : ré-exécutable sans effet de bord. À EXÉCUTER À LA MAIN dans le
-- SQL Editor du dashboard.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. COLONNES PROFIL
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gamertag       TEXT,
  ADD COLUMN IF NOT EXISTS equipped_badges UUID[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS profile_banner TEXT;

-- Le pseudo est éditable directement (validé côté Server Action : longueur,
-- caractères). equipped_badges et profile_banner passent par RPC — pas de GRANT.
GRANT UPDATE (gamertag) ON public.profiles TO authenticated;

-- ---------------------------------------------------------------------------
-- 2. RPC — équiper jusqu'à 3 badges mis en avant
-- ---------------------------------------------------------------------------
-- Garde uniquement les badges RÉELLEMENT acquis par l'appelant, dans l'ordre
-- reçu, dédupliqués, bornés à 3. Un client ne peut pas mettre en avant un badge
-- qu'il n'a pas gagné.
CREATE OR REPLACE FUNCTION public.set_equipped_badges(p_badge_ids UUID[])
RETURNS UUID[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_clean   UUID[];
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  -- Ordre reçu préservé (WITH ORDINALITY) ; on ne garde que les badges acquis ;
  -- doublons retirés (DISTINCT ON id, plus petit rang) ; borné aux 3 premiers.
  SELECT COALESCE(array_agg(r.id ORDER BY r.ord), '{}')
  INTO v_clean
  FROM (
    SELECT d.id, d.ord, row_number() OVER (ORDER BY d.ord) AS rn
    FROM (
      SELECT DISTINCT ON (t.id) t.id AS id, t.ord AS ord
      FROM unnest(p_badge_ids) WITH ORDINALITY AS t(id, ord)
      WHERE EXISTS (
        SELECT 1 FROM public.user_badges ub
        WHERE ub.user_id = v_user AND ub.badge_id = t.id
      )
      ORDER BY t.id, t.ord
    ) d
  ) r
  WHERE r.rn <= 3;

  UPDATE public.profiles
  SET equipped_badges = v_clean
  WHERE id = v_user;

  RETURN v_clean;
END;
$$;

REVOKE ALL ON FUNCTION public.set_equipped_badges(UUID[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_equipped_badges(UUID[]) TO authenticated;

-- ---------------------------------------------------------------------------
-- 3. RPC — équiper une bannière de profil possédée
-- ---------------------------------------------------------------------------
-- Écrit `profile_banner` seulement si l'appelant possède l'item bannière
-- correspondant (dans user_avatar_items) OU si la bannière est gratuite d'office
-- (price NULL et unlock_condition NULL). Le client ne peut pas équiper un
-- cosmétique non débloqué.
CREATE OR REPLACE FUNCTION public.equip_profile_banner(p_banner TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_ok    BOOLEAN;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.avatar_items i
    WHERE i.category = 'banner'
      AND i.asset_key = p_banner
      AND (
        -- gratuite d'office
        (i.price IS NULL AND i.unlock_condition IS NULL)
        -- ou possédée
        OR EXISTS (
          SELECT 1 FROM public.user_avatar_items ua
          WHERE ua.user_id = v_user AND ua.item_id = i.id
        )
      )
  )
  INTO v_ok;

  IF NOT v_ok THEN
    RAISE EXCEPTION 'banner not owned or unknown: %', p_banner;
  END IF;

  UPDATE public.profiles SET profile_banner = p_banner WHERE id = v_user;
  RETURN p_banner;
END;
$$;

REVOKE ALL ON FUNCTION public.equip_profile_banner(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.equip_profile_banner(TEXT) TO authenticated;

-- ---------------------------------------------------------------------------
-- 4. SEED — bannières de profil illustrées (catégorie 'banner')
-- ---------------------------------------------------------------------------
-- Modèle MIXTE (gagnable + quelques exclusifs payants) :
--   - gratuites d'office (base généreuse) ;
--   - débloquées par progression (rang/série/niveau) ;
--   - achetables en pièces (Trésor) ;
--   - 2 exclusives LÉGENDAIRES payantes (leviers de conversion).
-- Les asset_key pointent des visuels À GÉNÉRER (phase 5) : /banners/<key>.webp.
INSERT INTO public.avatar_items
  (id, category, name, asset_key, price, unlock_condition, rarity, sort) VALUES
  -- Gratuites d'office
  ('banner-arene-crepuscule', 'banner', 'Arène au crépuscule', 'arene-crepuscule',
     NULL, NULL, 'common', 10),
  ('banner-cour-recre',       'banner', 'Cour de récré',        'cour-recre',
     NULL, NULL, 'common', 11),
  -- Débloquables par progression
  ('banner-flamme-serie',     'banner', 'Flamme de série',      'flamme-serie',
     NULL, '{"type":"streak","value":7}',  'rare', 20),
  ('banner-podium-or',        'banner', 'Podium d’or',          'podium-or',
     NULL, '{"type":"level","value":10}',  'rare', 21),
  -- Achetables en pièces
  ('banner-cosmos',           'banner', 'Cosmos studieux',      'cosmos',
     150,  NULL, 'rare', 30),
  ('banner-vitrail',          'banner', 'Vitrail savant',       'vitrail',
     220,  NULL, 'rare', 31),
  -- Exclusives légendaires payantes
  ('banner-couronne-royale',  'banner', 'Couronne royale',      'couronne-royale',
     500,  NULL, 'legendary', 40),
  ('banner-dragon-savoir',    'banner', 'Dragon du savoir',     'dragon-savoir',
     500,  NULL, 'legendary', 41)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 5. RPC — attribuer les badges mérités (anti-triche, recalcul serveur)
-- ---------------------------------------------------------------------------
-- Miroir de `claim_avatar_unlocks` (189) pour le catalogue `badges` (010/014/015).
-- Recalcule chaque stat à partir des tables SOURCES (le client ne fournit aucun
-- nombre), puis crédite `user_badges` pour tout badge dont la condition est
-- satisfaite. Renvoie les slugs NOUVELLEMENT débloqués (pour une éventuelle
-- célébration). Monotone : ON CONFLICT DO NOTHING, un badge acquis le reste.
--
-- Sources (traçées) : série via public.current_streak (155/170, bornée),
-- quiz via test_sessions + challenge_sessions, temps via profiles.work_seconds,
-- habitudes via habits/habit_logs, trajet via commute_slots + heure de Paris.
-- Note : le calcul « trajet » (heure Europe/Paris dans un créneau) approche la
-- logique JS de lib/trajet ; l'écart éventuel ne peut que retarder/avancer le
-- déblocage d'un badge cosmétique, jamais fausser une autre donnée.
CREATE OR REPLACE FUNCTION public.award_earned_badges()
RETURNS SETOF TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user            UUID := auth.uid();
  v_streak          INT;
  v_quiz_count      BIGINT;
  v_perfect         BOOLEAN;
  v_study_minutes   BIGINT;
  v_habits_count    BIGINT;
  v_habit_streak    INT;
  v_commute_quizzes BIGINT;
  v_commute_streak  INT;
  v_slots           JSONB;
BEGIN
  IF v_user IS NULL THEN RETURN; END IF;

  -- Série quotidienne : MÊME source que le vestiaire et le classement amis.
  v_streak := COALESCE(public.current_streak(v_user), 0);

  -- Quiz terminés = sessions de test + défis solo (cohérent avec « quiz/défis »).
  SELECT COUNT(*) INTO v_quiz_count FROM public.test_sessions WHERE user_id = v_user;
  v_quiz_count := v_quiz_count
    + (SELECT COUNT(*) FROM public.challenge_sessions WHERE user_id = v_user);

  -- 100 % déjà réussi une fois.
  SELECT EXISTS (
    SELECT 1 FROM public.test_sessions
    WHERE user_id = v_user AND total > 0 AND score >= total
  ) INTO v_perfect;

  -- Temps de travail cumulé (work_seconds → minutes).
  SELECT COALESCE(work_seconds, 0) / 60 INTO v_study_minutes
  FROM public.profiles WHERE id = v_user;
  v_study_minutes := COALESCE(v_study_minutes, 0);

  -- Habitudes actives.
  SELECT COUNT(*) INTO v_habits_count FROM public.habits WHERE user_id = v_user;

  -- Plus longue série d'une habitude (gap-and-islands sur les jours validés).
  SELECT COALESCE(MAX(cnt), 0) INTO v_habit_streak
  FROM (
    SELECT COUNT(*) AS cnt
    FROM (
      SELECT habit_id,
             date - (ROW_NUMBER() OVER (PARTITION BY habit_id ORDER BY date))::int AS g
      FROM public.habit_logs
      WHERE user_id = v_user AND completed
    ) d
    GROUP BY habit_id, g
  ) s;

  -- Créneaux de trajet de l'élève.
  v_slots := COALESCE(
    (SELECT commute_slots FROM public.profiles WHERE id = v_user), '[]'::jsonb);

  -- Sessions jouées pendant un trajet (heure de Paris dans un créneau).
  SELECT COUNT(*) INTO v_commute_quizzes
  FROM (
    SELECT created_at FROM public.test_sessions      WHERE user_id = v_user
    UNION ALL
    SELECT created_at FROM public.challenge_sessions WHERE user_id = v_user
  ) t
  WHERE jsonb_array_length(v_slots) > 0
    AND EXISTS (
      SELECT 1 FROM jsonb_array_elements(v_slots) slot
      WHERE (EXTRACT(hour   FROM t.created_at AT TIME ZONE 'Europe/Paris') * 60
           + EXTRACT(minute FROM t.created_at AT TIME ZONE 'Europe/Paris'))
        BETWEEN (split_part(slot->>'start', ':', 1)::int * 60
               + split_part(slot->>'start', ':', 2)::int)
            AND (split_part(slot->>'end',   ':', 1)::int * 60
               + split_part(slot->>'end',   ':', 2)::int)
    );

  -- Série de jours (Paris) avec au moins une session en trajet.
  SELECT COALESCE(MAX(cnt), 0) INTO v_commute_streak
  FROM (
    SELECT COUNT(*) AS cnt
    FROM (
      SELECT d, d - (ROW_NUMBER() OVER (ORDER BY d))::int AS g
      FROM (
        SELECT DISTINCT (t.created_at AT TIME ZONE 'Europe/Paris')::date AS d
        FROM (
          SELECT created_at FROM public.test_sessions      WHERE user_id = v_user
          UNION ALL
          SELECT created_at FROM public.challenge_sessions WHERE user_id = v_user
        ) t
        WHERE jsonb_array_length(v_slots) > 0
          AND EXISTS (
            SELECT 1 FROM jsonb_array_elements(v_slots) slot
            WHERE (EXTRACT(hour   FROM t.created_at AT TIME ZONE 'Europe/Paris') * 60
                 + EXTRACT(minute FROM t.created_at AT TIME ZONE 'Europe/Paris'))
              BETWEEN (split_part(slot->>'start', ':', 1)::int * 60
                     + split_part(slot->>'start', ':', 2)::int)
                  AND (split_part(slot->>'end',   ':', 1)::int * 60
                     + split_part(slot->>'end',   ':', 2)::int)
          )
      ) days
    ) grp
    GROUP BY g
  ) s;

  -- Crédite tout badge mérité, renvoie les slugs neufs.
  RETURN QUERY
  WITH ins AS (
    INSERT INTO public.user_badges (user_id, badge_id)
    SELECT v_user, b.id
    FROM public.badges b
    WHERE CASE b.condition->>'type'
            WHEN 'streak'          THEN v_streak          >= (b.condition->>'days')::int
            WHEN 'commute_streak'  THEN v_commute_streak  >= (b.condition->>'days')::int
            WHEN 'habit_anchored'  THEN v_habit_streak    >= (b.condition->>'days')::int
            WHEN 'habits_count'    THEN v_habits_count    >= (b.condition->>'count')::int
            WHEN 'quiz_count'      THEN v_quiz_count      >= (b.condition->>'count')::int
            WHEN 'commute_quizzes' THEN v_commute_quizzes >= (b.condition->>'count')::int
            WHEN 'study_minutes'   THEN v_study_minutes   >= (b.condition->>'minutes')::int
            WHEN 'perfect_quiz'    THEN v_perfect
            ELSE false
          END
    ON CONFLICT (user_id, badge_id) DO NOTHING
    RETURNING badge_id
  )
  SELECT b.slug FROM ins JOIN public.badges b ON b.id = ins.badge_id;
END;
$$;

REVOKE ALL ON FUNCTION public.award_earned_badges() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.award_earned_badges() TO authenticated;

-- ---------------------------------------------------------------------------
-- 6. VERROU — l'attribution des badges passe DÉSORMAIS par la RPC uniquement
-- ---------------------------------------------------------------------------
-- La policy INSERT ouverte de 010_moi.sql laissait un client s'auto-décerner
-- n'importe quel badge (cosmétique, mais incohérent avec le cadre du vestiaire).
-- Aucun code n'attribuait de badge par ce biais : on la retire. La RPC
-- SECURITY DEFINER écrit en contournant la RLS ; la lecture reste ouverte.
DROP POLICY IF EXISTS "user_badges_insert_own" ON public.user_badges;

