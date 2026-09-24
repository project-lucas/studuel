-- =============================================================================
-- Studuel — Migration 377 : LA TIRELIRE D'AMIS (onglet Amis, 24/09/2026)
--
-- Lucas : « le gain de gemmes dans un espace "ajouter un ami" = +30 gemmes, et
-- à l'endroit prévu une cagnotte d'XP, une tirelire, qui augmente en fonction
-- de son nombre d'amis : plus ses amis jouent, plus la cagnotte monte et donne
-- des récompenses ».
--
-- LA RÈGLE (miroir de lib/ligue.ts : `tirelire`, `TIRELIRE_PALIERS`) :
--   • chaque ami accepté fait tomber dans MA tirelire 10 % de MON XP de la
--     semaine (le « ×1,3 » du bandeau : 3 amis), jusqu'à 10 amis ;
--   • ET 10 % de SON XP de la semaine — les 10 amis qui ont le plus joué ;
--   • des PALIERS dans la semaine : 100 XP → +5 gemmes, 300 → +10, 600 → +20,
--     à encaisser depuis l'onglet (`tirelire_encaisser`) et versés d'office à
--     la clôture s'ils ont été oubliés ;
--   • le lundi, la tirelire se casse : tout son XP tombe dans la barre de
--     niveau (source « bonus_amis », hors ligue) — les niveaux gagnés paient
--     leurs gemmes comme partout.
--   Rien sans avoir joué : sans XP à soi dans la semaine, ni palier ni
--   versement (on ne vit pas de l'XP de ses amis).
--
-- Elle REMPLACE, par-dessus la 376, `ligue_cloturer` (le bonus devient la
-- tirelire) et `ligue_etat` (qui rend la tirelire de la semaine). La 376 n'est
-- pas modifiée.
--
-- PRÉREQUIS : 376 (ligue), 368 (gemmes_avec_bonus, wallet_grant_xp). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ───────────────────────────────────────── 1. le bilan dit ce que la tirelire a rendu

ALTER TABLE public.ligue_bilans
  ADD COLUMN IF NOT EXISTS gemmes_tirelire SMALLINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tirelire_amis   INTEGER  NOT NULL DEFAULT 0;

-- ─────────────────────────────────────────── 2. une source de gemmes de plus
-- Lue dans la contrainte EXISTANTE (méthode de la 373) : rejouer n'ajoute rien.

DO $$
DECLARE
  v_def     TEXT;
  v_sources TEXT[];
BEGIN
  SELECT pg_get_constraintdef(c.oid) INTO v_def
    FROM pg_constraint c
   WHERE c.conname = 'gem_events_source_check'
     AND c.conrelid = 'public.gem_events'::regclass;
  IF v_def IS NOT NULL AND v_def !~ '\mtirelire\M' THEN
    SELECT array_agg(DISTINCT btrim(s)) INTO v_sources
      FROM regexp_matches(v_def, '''([^'']+)''', 'g') AS m,
           LATERAL unnest(string_to_array(btrim(m[1], '{}'), ',')) AS s
     WHERE btrim(s) <> '';
    v_sources := array_append(COALESCE(v_sources, ARRAY[]::TEXT[]), 'tirelire');
    EXECUTE 'ALTER TABLE public.gem_events DROP CONSTRAINT gem_events_source_check';
    EXECUTE format('ALTER TABLE public.gem_events ADD CONSTRAINT gem_events_source_check CHECK (source IN (%s))',
                   (SELECT string_agg(quote_literal(x), ', ' ORDER BY x) FROM unnest(v_sources) x));
  END IF;
END $$;

-- ──────────────────────────────────────────────── 3. la tirelire (règles pures)

-- Les paliers de la semaine : le seuil d'XP de la tirelire, et ses gemmes.
CREATE OR REPLACE FUNCTION public.ligue_tirelire_paliers()
RETURNS TABLE (seuil INTEGER, gemmes INTEGER)
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  VALUES (100, 5), (300, 10), (600, 20);
$$;

-- La tirelire d'un élève pour une semaine : sa part (10 % de son XP par ami,
-- 10 amis au plus), la part de ses amis (10 % de l'XP des 10 qui ont le plus
-- joué), le total.
CREATE OR REPLACE FUNCTION public.ligue_tirelire(p_user UUID, p_semaine DATE)
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
  v_somme     INTEGER := 0;
  v_part_moi  INTEGER;
  v_part_amis INTEGER;
BEGIN
  SELECT count(*), COALESCE(SUM(t.xp) FILTER (WHERE t.ordre <= 10), 0)
    INTO v_nb_amis, v_somme
    FROM (
      SELECT a.xp, ROW_NUMBER() OVER (ORDER BY a.xp DESC) AS ordre
        FROM (
          SELECT public.ligue_xp_semaine(
                   CASE WHEN f.requester_id = p_user THEN f.addressee_id ELSE f.requester_id END,
                   p_semaine) AS xp
            FROM public.friendships f
           WHERE f.status = 'accepted' AND p_user IN (f.requester_id, f.addressee_id)
        ) a
    ) t;

  v_part_moi  := (v_xp_moi * LEAST(10, v_nb_amis)) / 10;
  v_part_amis := v_somme / 10;
  RETURN jsonb_build_object(
    'xp_moi', v_xp_moi,
    'nb_amis', v_nb_amis,
    'part_moi', v_part_moi,
    'part_amis', v_part_amis,
    'total', v_part_moi + v_part_amis);
END;
$$;

-- Verse les paliers atteints et pas encore payés (une fois chacun, jamais
-- deux : la clé unique de gem_events). Rend les gemmes versées. Rien sans XP à
-- soi dans la semaine.
CREATE OR REPLACE FUNCTION public.ligue_tirelire_payer(p_user UUID, p_semaine DATE, p_total INTEGER, p_xp_moi INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_palier RECORD;
  v_gemmes INTEGER;
  v_verse  INTEGER := 0;
BEGIN
  IF COALESCE(p_xp_moi, 0) <= 0 THEN RETURN 0; END IF;
  FOR v_palier IN SELECT seuil, gemmes FROM public.ligue_tirelire_paliers() ORDER BY seuil LOOP
    EXIT WHEN COALESCE(p_total, 0) < v_palier.seuil;
    v_gemmes := public.gemmes_avec_bonus(p_user, v_palier.gemmes);
    INSERT INTO public.gem_events (user_id, source, source_key, amount)
    VALUES (p_user, 'tirelire', p_semaine::text || ':' || v_palier.seuil, v_gemmes)
    ON CONFLICT DO NOTHING;
    IF FOUND THEN
      UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_gemmes WHERE id = p_user;
      v_verse := v_verse + v_gemmes;
    END IF;
  END LOOP;
  RETURN v_verse;
END;
$$;

-- Les paliers déjà encaissés cette semaine (leurs seuils).
CREATE OR REPLACE FUNCTION public.ligue_tirelire_payes(p_user UUID, p_semaine DATE)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(jsonb_agg(split_part(e.source_key, ':', 2)::INTEGER
                           ORDER BY split_part(e.source_key, ':', 2)::INTEGER), '[]'::jsonb)
    FROM public.gem_events e
   WHERE e.user_id = p_user
     AND e.source = 'tirelire'
     AND e.source_key LIKE p_semaine::text || ':%';
$$;

-- ────────────────────────────────────────────────── 4. encaisser (public)

-- « Encaisser » depuis l'onglet : verse les paliers atteints. Le serveur
-- recalcule tout — rien ne vient de l'appelant.
CREATE OR REPLACE FUNCTION public.tirelire_encaisser()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_user     UUID := auth.uid();
  v_semaine  DATE := public.ligue_lundi(now());
  v_tirelire JSONB;
  v_gemmes   INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('gemmes', 0, 'payes', '[]'::jsonb); END IF;
  v_tirelire := public.ligue_tirelire(v_user, v_semaine);
  v_gemmes := public.ligue_tirelire_payer(
    v_user, v_semaine, (v_tirelire->>'total')::INTEGER, (v_tirelire->>'xp_moi')::INTEGER);
  RETURN jsonb_build_object(
    'gemmes', v_gemmes,
    'payes', public.ligue_tirelire_payes(v_user, v_semaine));
END;
$$;

-- ─────────────────────────────────── 5. la clôture : la tirelire se casse

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
  v_tirelire  JSONB;
  v_amis      INTEGER := 0;
  v_bonus     INTEGER := 0;
  v_part_amis INTEGER := 0;
  v_gem_tir   INTEGER := 0;
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

  -- LA TIRELIRE : sa part et celle des amis ; les paliers oubliés d'abord,
  -- puis tout son XP dans la barre de niveau. Rien sans XP à soi.
  v_tirelire  := public.ligue_tirelire(p_user, v_semaine);
  v_amis      := (v_tirelire->>'nb_amis')::INTEGER;
  v_part_amis := CASE WHEN v_xp > 0 THEN (v_tirelire->>'part_amis')::INTEGER ELSE 0 END;
  v_bonus     := CASE WHEN v_xp > 0 THEN (v_tirelire->>'total')::INTEGER ELSE 0 END;
  v_gem_tir   := public.ligue_tirelire_payer(p_user, v_semaine, v_bonus, v_xp);

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
    nb_amis, bonus_xp, niveau_avant, niveau_apres, gemmes_niveau,
    gemmes_tirelire, tirelire_amis)
  VALUES (
    p_user, v_semaine, v_echelon, v_apres, v_rang, v_taille, v_xp, v_gemmes,
    LEAST(v_amis, 32767), COALESCE(v_verse, 0), v_niv_avant, v_niv_apres, v_gem_niv,
    LEAST(v_gem_tir, 32767), v_part_amis)
  ON CONFLICT (user_id, semaine) DO NOTHING;

  UPDATE public.ligue_joueurs
     SET echelon = v_apres, groupe_id = NULL, maj_le = now()
   WHERE user_id = p_user;
END;
$$;

-- ─────────────────────────── 6. l'écran de la ligue rend aussi la tirelire

CREATE OR REPLACE FUNCTION public.ligue_etat()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_user     UUID := auth.uid();
  v_lundi    DATE := public.ligue_lundi(now());
  v_echelon  INTEGER;
  v_groupe   UUID;
  v_liste    JSONB;
  v_amis     JSONB;
  v_nb_amis  INTEGER;
  v_bilan    JSONB;
  v_tirelire JSONB;
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

  v_tirelire := public.ligue_tirelire(v_user, v_lundi)
    || jsonb_build_object('payes', public.ligue_tirelire_payes(v_user, v_lundi));

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
    'tirelire', v_tirelire);
END;
$$;

-- ─────────────────────────────────────────────────────────────── 7. droits

REVOKE ALL ON FUNCTION public.ligue_tirelire_paliers() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_tirelire(UUID, DATE) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_tirelire_payer(UUID, DATE, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_tirelire_payes(UUID, DATE) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_cloturer(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ligue_etat() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.tirelire_encaisser() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ligue_etat() TO authenticated;
GRANT EXECUTE ON FUNCTION public.tirelire_encaisser() TO authenticated;

-- Vérifications (facultatives) :
--   SELECT * FROM public.ligue_tirelire_paliers();
--   SELECT public.ligue_tirelire('<élève>', public.ligue_lundi(now()));
