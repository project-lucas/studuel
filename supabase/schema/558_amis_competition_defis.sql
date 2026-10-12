-- =============================================================================
-- 558 — Les amis en compétition : la course de la semaine, la fiche d'un
--       joueur, et le défi d'un ami sur N'IMPORTE QUEL mode (05/10/2026)
--
-- Lucas, 05/10/2026 :
--   · « si le user a des amis on doit voir qui de ses amis est devant par
--     rapport au groupe (nombre de trophées gagnés, gain de niveau, gain d'XP),
--     il faut appuyer le côté compétition » ;
--   · « la fonction de défier un ami doit être présente dans l'onglet Amis […]
--     il cliquera sur l'ami en question, une invitation sera envoyée et
--     notifiée à son ami, puis un panneau de choix des modes de jeu s'ouvrira » ;
--   · « il faut permettre aux joueurs de voir le carnet ou le résumé des autres
--     joueurs (comme sur Clash Royale : victoires, défaites, records, badges) ».
--
-- CINQ CHANGEMENTS, tous idempotents :
--
--   1. `classement_amis()` rend aussi l'XP cumulée (`xp`) et l'XP de la
--      semaine (`xp_semaine`) : l'app en déduit les NIVEAUX gagnés depuis lundi
--      (lib/moi/course-amis). Même signature, deux clés de plus : l'ancienne
--      app lit toujours ce qu'elle lisait.
--
--   2. Un duel entre amis peut porter un MODE DE JEU (`duels.mode_id`) : le
--      score est alors celui du mode (jusqu'à 30 000 points), d'où la borne de
--      `total` portée de 50 à 100 000. Et plus « un duel par jour en tout » :
--      un duel par ami et par jour — défier trois amis le même soir est le jeu.
--      `create_duel` (019) est réécrite sur le nouvel index.
--
--   3. `creer_defi_ami(ami, mode)` : le défi, contre un ami accepté, sur un
--      mode du palmarès (`mode_catalog`, 352/355).
--
--   4. `defis_recus()` : les défis qu'on m'a lancés et que je n'ai pas encore
--      joués (le bandeau « Léa te défie ! » de l'onglet Amis).
--      `defi_ami_cibles_push(duel)` : les abonnements push de l'ami défié,
--      RÉSERVÉE au rôle service (la route /api/amis/defi l'appelle après avoir
--      vérifié, avec la session de l'élève, que le duel est bien le sien) ; un
--      défi n'est notifié qu'UNE fois (`notifie_le`).
--
--   5. `fiche_joueur(id)` : le résumé d'un autre élève, comme la fiche d'un
--      joueur de Clash Royale — prénom, pseudo, blason, niveau, trophées et
--      record, victoires et défaites, série, badges, records des modes et leur
--      place. LISIBLE SEULEMENT par soi-même, un ami accepté ou un membre du
--      même groupe de ligue cette semaine (les deux portes de l'onglet Amis).
--      Rien de l'école, rien du compte : ce sont des élèves de 11 à 18 ans.
--
-- PRÉREQUIS : 019 (duels), 045 (push), 192 (portefeuille, xp_events), 201,
-- 352/355 (palmarès), 376 (ligue), 465 (classement_amis).
-- =============================================================================

-- --------------------------------------------------------------------- 1.
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
                ), 0),
                -- 558 : l'XP, pour la course de la semaine.
                'xp', COALESCE((SELECT uw.xp FROM public.user_wallet uw WHERE uw.user_id = p.id), 0),
                'xp_semaine', COALESCE((
                  SELECT sum(e.amount)
                    FROM public.xp_events e
                   WHERE e.user_id = p.id
                     AND e.created_at >= ((SELECT debut FROM semaine) AT TIME ZONE 'utc')
                ), 0))
              ORDER BY COALESCE(p.trophies, 0) DESC, p.id),
    '[]'::jsonb)
    FROM cercle c
    JOIN public.profiles p ON p.id = c.id;
$$;

REVOKE ALL ON FUNCTION public.classement_amis() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.classement_amis() TO authenticated;

-- --------------------------------------------------------------------- 2.
ALTER TABLE public.duels ADD COLUMN IF NOT EXISTS mode_id TEXT;
ALTER TABLE public.duels ADD COLUMN IF NOT EXISTS notifie_le TIMESTAMPTZ;

-- La borne de `total` (1..50, écrite en ligne en 019) : retirée quel que soit
-- le nom que Postgres lui a donné, puis reposée à 100 000.
DO $$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT conname
      FROM pg_constraint
     WHERE conrelid = 'public.duels'::regclass
       AND contype = 'c'
       AND pg_get_constraintdef(oid) ILIKE '%total%'
       AND pg_get_constraintdef(oid) ILIKE '%50%'
  LOOP
    EXECUTE format('ALTER TABLE public.duels DROP CONSTRAINT %I', c.conname);
  END LOOP;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conrelid = 'public.duels'::regclass AND conname = 'duels_total_borne'
  ) THEN
    ALTER TABLE public.duels
      ADD CONSTRAINT duels_total_borne CHECK (total BETWEEN 1 AND 100000);
  END IF;
END;
$$;

-- Un duel par AMI et par jour (et non plus un seul en tout).
CREATE UNIQUE INDEX IF NOT EXISTS duels_un_par_ami_par_jour
  ON public.duels (challenger_id, opponent_id, day);
DROP INDEX IF EXISTS public.duels_one_per_day;

CREATE OR REPLACE FUNCTION public.create_duel(p_opponent UUID, p_subject TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_id   UUID;
BEGIN
  IF v_user IS NULL OR p_opponent IS NULL OR p_opponent = v_user THEN
    RETURN NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.friendships
    WHERE status = 'accepted'
      AND ((requester_id = v_user AND addressee_id = p_opponent)
        OR (requester_id = p_opponent AND addressee_id = v_user))
  ) THEN RETURN NULL; END IF;

  INSERT INTO public.duels (challenger_id, opponent_id, subject)
  VALUES (v_user, p_opponent, left(coalesce(p_subject, 'Duel'), 80))
  ON CONFLICT (challenger_id, opponent_id, day) DO NOTHING
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_duel(UUID, TEXT) TO authenticated;

-- --------------------------------------------------------------------- 3.
-- Rend l'id du duel, ou NULL : pas ami, mode inconnu, ou cet ami déjà défié
-- aujourd'hui (le duel du jour existant est alors rendu, pour rejouer dessus
-- s'il n'a pas encore été joué).
CREATE OR REPLACE FUNCTION public.creer_defi_ami(p_ami UUID, p_mode TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_max  INTEGER;
  v_id   UUID;
BEGIN
  IF v_user IS NULL OR p_ami IS NULL OR p_ami = v_user THEN
    RETURN NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.friendships
    WHERE status = 'accepted'
      AND ((requester_id = v_user AND addressee_id = p_ami)
        OR (requester_id = p_ami AND addressee_id = v_user))
  ) THEN RETURN NULL; END IF;

  SELECT max_score INTO v_max FROM public.mode_catalog WHERE mode_id = p_mode;
  IF v_max IS NULL THEN RETURN NULL; END IF;

  INSERT INTO public.duels (challenger_id, opponent_id, subject, mode_id, total)
  VALUES (v_user, p_ami, left(p_mode, 80), p_mode, LEAST(v_max, 100000))
  ON CONFLICT (challenger_id, opponent_id, day) DO NOTHING
  RETURNING id INTO v_id;

  -- Cet ami est déjà défié aujourd'hui : tant que PERSONNE n'a joué, le duel
  -- passe sur le mode choisi (sinon un score de mode serait borné à 5).
  IF v_id IS NULL THEN
    UPDATE public.duels
       SET mode_id = p_mode, subject = left(p_mode, 80), total = LEAST(v_max, 100000)
     WHERE challenger_id = v_user
       AND opponent_id = p_ami
       AND day = (now() AT TIME ZONE 'utc')::date
       AND challenger_score IS NULL
       AND opponent_score IS NULL
    RETURNING id INTO v_id;
  END IF;
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.creer_defi_ami(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.creer_defi_ami(UUID, TEXT) TO authenticated;

-- --------------------------------------------------------------------- 4.
-- Les défis reçus, pas encore joués, des sept derniers jours.
CREATE OR REPLACE FUNCTION public.defis_recus()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
           'id', d.id,
           'de', d.challenger_id,
           'nom', split_part(COALESCE(NULLIF(btrim(p.full_name), ''), 'Élève'), ' ', 1),
           'portrait', COALESCE(p.avatar->>'portrait', ''),
           'mode', COALESCE(d.mode_id, ''),
           'son_score', d.challenger_score,
           'le', d.created_at)
         ORDER BY d.created_at DESC), '[]'::jsonb)
    FROM public.duels d
    JOIN public.profiles p ON p.id = d.challenger_id
   WHERE d.opponent_id = (SELECT auth.uid())
     AND d.opponent_score IS NULL
     AND d.created_at >= now() - interval '7 days';
$$;

REVOKE ALL ON FUNCTION public.defis_recus() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.defis_recus() TO authenticated;

-- Les abonnements push de l'ami défié — une seule fois par duel. Réservée au
-- rôle service : un élève ne doit jamais lire les abonnements d'un autre.
CREATE OR REPLACE FUNCTION public.defi_ami_cibles_push(p_duel UUID, p_lanceur UUID)
RETURNS TABLE (endpoint TEXT, p256dh TEXT, auth TEXT, lanceur TEXT, mode TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_duel public.duels%ROWTYPE;
BEGIN
  SELECT * INTO v_duel FROM public.duels WHERE id = p_duel;
  IF v_duel.id IS NULL
     OR v_duel.challenger_id <> p_lanceur
     OR v_duel.notifie_le IS NOT NULL
     OR v_duel.created_at < now() - interval '1 hour' THEN
    RETURN;
  END IF;

  UPDATE public.duels SET notifie_le = now() WHERE id = p_duel;

  RETURN QUERY
    SELECT s.endpoint, s.p256dh, s.auth,
           split_part(COALESCE(NULLIF(btrim(p.full_name), ''), 'Un ami'), ' ', 1),
           COALESCE(v_duel.mode_id, '')
      FROM public.push_subscriptions s
      JOIN public.profiles p ON p.id = v_duel.challenger_id
     WHERE s.user_id = v_duel.opponent_id;
END;
$$;

REVOKE ALL ON FUNCTION public.defi_ami_cibles_push(UUID, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.defi_ami_cibles_push(UUID, UUID) TO service_role;

-- --------------------------------------------------------------------- 5.
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
    'records', v_records
  );
END;
$$;

REVOKE ALL ON FUNCTION public.fiche_joueur(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fiche_joueur(UUID) TO authenticated;

-- =============================================================================
-- VÉRIFIER (facultatif) :
--   SELECT jsonb_pretty(public.classement_amis());   -- en tant qu'élève
--   SELECT public.fiche_joueur('<uuid d''un ami>');
--   SELECT indexname FROM pg_indexes WHERE tablename = 'duels';
-- =============================================================================
