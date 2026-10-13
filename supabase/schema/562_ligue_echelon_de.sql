-- =============================================================================
-- 562 — LA DIVISION DE LIGUE PARTOUT OÙ L'ON LISAIT UN RANG (13/10/2026)
--
-- Lucas : « une seule échelle, la division, gagnée à l'XP de la semaine » ; les
-- trophées restent le score du duel par matière, plus jamais un rang. Trois
-- lectures manquaient pour l'afficher partout :
--
--   1. `ligue_echelon_du_rival(p_replay)` — l'échelon de l'auteur d'une trace
--      de duel (`duel_replays` ne se lit qu'en propre, `ligue_joueurs` n'a pas
--      de policy) : la bannière de rang du RIVAL sur l'écran de fin de duel ;
--   2. `ligue_ma_place()` — mon échelon et ma place dans mon groupe, en UNE
--      lecture légère (sans l'écran entier de `ligue_etat`) : la plaque « Mon
--      rang » du Classement de l'arène, la fiche de profil, la page de garde
--      de Moi ;
--   3. `fiche_joueur` (558) rend aussi l'échelon de l'ami ou du membre de ligue.
--
-- La division est une information publique — elle s'affiche à côté du nom dans
-- toute ligue —, et rien d'autre ne sort. Idempotente. À exécuter à la main.
-- =============================================================================

-- ─────────────────────────────────────────── 1. l'échelon du rival d'une course
CREATE OR REPLACE FUNCTION public.ligue_echelon_du_rival(p_replay UUID)
RETURNS SMALLINT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(j.echelon, 0)::SMALLINT
    FROM public.duel_replays r
    LEFT JOIN public.ligue_joueurs j ON j.user_id = r.user_id
   WHERE r.id = p_replay
     AND auth.uid() IS NOT NULL;
$$;

REVOKE ALL ON FUNCTION public.ligue_echelon_du_rival(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ligue_echelon_du_rival(UUID) TO authenticated;

-- ─────────────────────────────────────────────────── 2. ma place, en une lecture
-- Sans `ligue_mettre_a_jour` : la veille de la ligue (components/LigueVeille,
-- `ligue_toucher`) a déjà clôturé et inscrit au lancement de l'app ; ici on ne
-- fait que lire. `rang` et `taille` sont NULL hors groupe (aucune XP cette
-- semaine).
CREATE OR REPLACE FUNCTION public.ligue_ma_place()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_user    UUID := auth.uid();
  v_echelon INTEGER;
  v_groupe  UUID;
  v_rang    INTEGER;
  v_taille  INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  SELECT j.echelon, j.groupe_id INTO v_echelon, v_groupe
    FROM public.ligue_joueurs j WHERE j.user_id = v_user;

  IF v_groupe IS NOT NULL THEN
    SELECT c.rang, count(*) OVER () INTO v_rang, v_taille
      FROM public.ligue_classement(v_groupe, now()) c
     WHERE c.user_id = v_user
     LIMIT 1;
    -- Le `count(*) OVER ()` est borné par le WHERE : on recompte le groupe.
    SELECT count(*) INTO v_taille FROM public.ligue_classement(v_groupe, now());
  END IF;

  RETURN jsonb_build_object(
    'echelon', COALESCE(v_echelon, 0),
    'inscrit', v_groupe IS NOT NULL AND v_rang IS NOT NULL,
    'rang', v_rang,
    'taille', v_taille);
END;
$$;

REVOKE ALL ON FUNCTION public.ligue_ma_place() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ligue_ma_place() TO authenticated;

-- ───────────────────────────────── 3. la fiche d'un joueur porte son échelon
CREATE OR REPLACE FUNCTION public.fiche_joueur(p_user UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_moi     UUID := auth.uid();
  v_semaine DATE := public.clan_week_key((now() AT TIME ZONE 'utc')::date);
  v_ami     BOOLEAN;
  v_p       public.profiles%ROWTYPE;
  v_xp      INTEGER;
  v_badges  JSONB;
  v_records JSONB;
BEGIN
  IF v_moi IS NULL OR p_user IS NULL THEN RETURN NULL; END IF;

  v_ami := EXISTS (
    SELECT 1 FROM public.friendships
     WHERE status = 'accepted'
       AND ((requester_id = v_moi AND addressee_id = p_user)
         OR (requester_id = p_user AND addressee_id = v_moi))
  );

  -- La porte : soi, un ami, ou un membre de mon groupe de ligue.
  IF p_user <> v_moi AND NOT v_ami AND NOT EXISTS (
    SELECT 1
      FROM public.ligue_joueurs a
      JOIN public.ligue_joueurs b ON b.groupe_id = a.groupe_id
     WHERE a.user_id = v_moi AND b.user_id = p_user AND a.groupe_id IS NOT NULL
  ) THEN
    RETURN NULL;
  END IF;

  SELECT * INTO v_p FROM public.profiles WHERE id = p_user;
  IF v_p.id IS NULL THEN RETURN NULL; END IF;

  SELECT COALESCE(xp, 0) INTO v_xp FROM public.user_wallet WHERE user_id = p_user;

  SELECT COALESCE(jsonb_agg(b.slug ORDER BY ub.unlocked_at), '[]'::jsonb)
    INTO v_badges
    FROM public.user_badges ub
    JOIN public.badges b ON b.id = ub.badge_id
   WHERE ub.user_id = p_user;

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
           'mode', mb.mode_id,
           'best', mb.best,
           'plays', mb.plays,
           'rang', pl.rank,
           'sur', pl.total)
         ORDER BY mb.best DESC), '[]'::jsonb)
    INTO v_records
    FROM public.mode_bests mb
    LEFT JOIN LATERAL public.mode_place(mb.mode_id, 'toujours', v_semaine, v_p.grade_level, mb.best) pl ON TRUE
   WHERE mb.user_id = p_user AND mb.best > 0;

  RETURN jsonb_build_object(
    'id', v_p.id,
    'moi', p_user = v_moi,
    'ami', v_ami,
    'nom', split_part(COALESCE(NULLIF(btrim(v_p.full_name), ''), 'Élève'), ' ', 1),
    'pseudo', v_p.gamertag,
    'portrait', COALESCE(v_p.avatar->>'portrait', ''),
    'classe', v_p.grade_level,
    'xp', COALESCE(v_xp, 0),
    'trophees', COALESCE(v_p.trophies, 0),
    'meilleurs_trophees', COALESCE(v_p.best_trophies, 0),
    'victoires', COALESCE(v_p.wins, 0),
    'defaites', COALESCE(v_p.losses, 0),
    'serie', COALESCE(public.current_streak(p_user), 0),
    'secondes', COALESCE(v_p.work_seconds, 0),
    'badges', v_badges,
    'records', v_records,
    -- 562 : la division de ligue (0 = Bronze 4 … 20 = Maître).
    'echelon', COALESCE((SELECT j.echelon FROM public.ligue_joueurs j WHERE j.user_id = p_user), 0)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.fiche_joueur(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fiche_joueur(UUID) TO authenticated;

-- =============================================================================
-- VÉRIFIER (facultatif) :
--   SELECT public.ligue_echelon_du_rival('<id d''une trace>');   -- en tant qu'élève
--   SELECT public.ligue_echelon_du_rival(gen_random_uuid());      -- NULL (trace inconnue)
--   SELECT jsonb_pretty(public.ligue_ma_place());                 -- {echelon, inscrit, rang, taille}
--   SELECT public.fiche_joueur('<uuid d''un ami>') ->> 'echelon';
-- =============================================================================
