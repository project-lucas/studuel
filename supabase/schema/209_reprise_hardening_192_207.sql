-- Studuel — Migration 209 : REPRISE du durcissement de l'audit (commit e7aca3a)
--
-- POURQUOI CETTE MIGRATION EXISTE
-- Le 28/07, l'audit `e7aca3a` a durci SUR PLACE les migrations créditrices
-- 192 · 200 · 203 · 204 · 205 · 207, en supposant qu'elles n'avaient JAMAIS été
-- exécutées (précédent 15577ed). Cette supposition était fausse : la sonde
-- (`_ASSOCIE/sonde-base.mjs`) montre que ces six migrations étaient DÉJÀ passées
-- en base. Or « on ne modifie pas une migration exécutée » : le durcissement
-- écrit dans ces fichiers ne rejouera donc jamais. C'est exactement le piège du
-- projet — un correctif qu'on croit appliqué et qui ne l'est pas.
--
-- Cette migration RÉAPPLIQUE ce durcissement, une seule fois, de façon
-- strictement IDEMPOTENTE. Elle est sûre dans les deux mondes possibles :
--   • si la base tourne les VIEILLES versions (le cas mesuré) → elle corrige ;
--   • si Lucas avait déjà exécuté les versions de e7aca3a → elle est un no-op
--     (CREATE OR REPLACE à l'identique, DROP IF EXISTS + ADD de la même borne).
--
-- Elle NE crée aucune table ni colonne (192/200/203 les ont déjà posées) : elle
-- ne fait que (ré)installer des FONCTIONS et des CONTRAINTES. Rien de destructif.
--
-- ⚠️ À EXÉCUTER PAR LUCAS dans le SQL Editor, APRÈS les 192→207 (déjà passées).
--    Ordre : elle vient après toute la vague créditrice. Aucune donnée touchée.

-- =============================================================================
-- 1. xp_events — étendre le CHECK des sources internes ('quests', 'clan_week')
--    La 192 exécutée n'admet que les 5 sources d'origine ; wallet_grant_xp
--    (§2) verse sous ces deux sources-là. Sans cet ALTER, l'INSERT échoue et
--    l'XP des quêtes / du clan n'est jamais tracée.
-- =============================================================================
ALTER TABLE public.xp_events DROP CONSTRAINT IF EXISTS xp_events_source_check;
ALTER TABLE public.xp_events ADD CONSTRAINT xp_events_source_check
  CHECK (source IN ('quiz', 'quiz_top', 'flashcards', 'defi', 'defi_arena',
                    'quests', 'clan_week'));

-- =============================================================================
-- 2. wallet_grant_xp — la primitive de versement d'XP INTERNE (déplacée de 192)
--
-- La primitive de versement pour les AUTRES RPC definer (quêtes 205, coffre du
-- clan 204) : elles calculent un montant depuis LEUR barème serveur, déjà borné
-- par leur propre verrou (PK de réclamation), et le versent ici selon les mêmes
-- règles que wallet_award_xp — trace xp_events, niveau recalculé, +15 💎 par
-- niveau franchi (une seule fois par niveau). Deux différences assumées :
--   • pas de mise à jour de série : les activités qui ont rempli la quête ont
--     déjà fait vivre la série, encaisser le soir ne doit pas la doubler ;
--   • pas de plafond « 30 événements/jour » : l'appelant a déjà borné.
--
-- AUCUN GRANT : la clé anon ne peut pas l'appeler. Seul le corps d'une fonction
-- SECURITY DEFINER (exécuté avec les droits du propriétaire) y accède.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.wallet_grant_xp(
  p_user   UUID,
  p_source TEXT,
  p_key    TEXT,
  p_amount INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet    public.user_wallet%ROWTYPE;
  v_new_level INTEGER;
  v_gems      INTEGER := 0;
  v_lvl       INTEGER;
BEGIN
  IF p_user IS NULL OR COALESCE(p_amount, 0) <= 0 THEN RETURN; END IF;

  PERFORM public.wallet_ensure(p_user);
  SELECT * INTO v_wallet FROM public.user_wallet
   WHERE user_id = p_user FOR UPDATE;

  -- Trace (idempotente si clé, via xp_events_once_per_key) : déjà versé → stop.
  INSERT INTO public.xp_events (user_id, source, source_key, amount)
  VALUES (p_user, p_source, NULLIF(LEFT(COALESCE(p_key, ''), 80), ''), p_amount)
  ON CONFLICT DO NOTHING;
  IF NOT FOUND THEN RETURN; END IF;

  -- Niveau : +15 💎 par niveau franchi, chacun une seule fois (même règle que
  -- wallet_award_xp — l'élève ne doit pas voir deux barèmes de passage).
  v_new_level := public.wallet_level_from_xp(v_wallet.xp + p_amount);
  IF v_new_level > v_wallet.level THEN
    FOR v_lvl IN (v_wallet.level + 1) .. v_new_level LOOP
      INSERT INTO public.gem_events (user_id, source, source_key, amount)
      VALUES (p_user, 'level_up', v_lvl::text, 15)
      ON CONFLICT DO NOTHING;
      IF FOUND THEN v_gems := v_gems + 15; END IF;
    END LOOP;
  END IF;

  UPDATE public.user_wallet
     SET xp = xp + p_amount,
         level = GREATEST(level, v_new_level),
         updated_at = now()
   WHERE user_id = p_user;

  IF v_gems > 0 THEN
    UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_gems
     WHERE id = p_user;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.wallet_grant_xp(UUID, TEXT, TEXT, INTEGER) FROM PUBLIC;

-- =============================================================================
-- 3. profiles.gamertag — la borne de longueur (durcissement 200)
--    Le GRANT UPDATE(gamertag) rend le pseudo modifiable par requête PostgREST
--    DIRECTE, hors Server Action : la base doit porter sa propre borne (3–16,
--    comme GAMERTAG_RE de app/defi/profile-actions.ts) et refuser les caractères
--    de contrôle. Le filtre fin d'alphabet reste côté app.
-- =============================================================================
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_gamertag_borne;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_gamertag_borne
  CHECK (
    gamertag IS NULL
    OR (char_length(gamertag) BETWEEN 3 AND 16 AND gamertag !~ '[[:cntrl:]]')
  );

-- =============================================================================
-- 4. create_controle — bornes anti-abus (durcissement 203)
--    La RPC est appelable directement (clé anon publique) : un payload forgé ne
--    doit pas pouvoir inonder controles/sessions_preparation. Bornes LARGES.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.create_controle(
  p_subject  TEXT,
  p_chapters JSONB,
  p_date     DATE,
  p_grade    TEXT,
  p_sessions JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_id   UUID;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  -- Invariant : ni contrôle sans chapitre, ni contrôle sans plan.
  IF p_chapters IS NULL OR jsonb_typeof(p_chapters) <> 'array'
     OR jsonb_array_length(p_chapters) = 0 THEN RETURN NULL; END IF;
  IF p_sessions IS NULL OR jsonb_typeof(p_sessions) <> 'array'
     OR jsonb_array_length(p_sessions) = 0 THEN RETURN NULL; END IF;
  -- Bornes anti-abus : la RPC est appelable directement (clé anon publique), un
  -- payload forgé ne doit pas pouvoir inonder les tables. Un plan légitime tient
  -- en quelques sessions (lib/prep-plan.planDates) et quelques chapitres — on
  -- borne LARGE pour ne jamais gêner l'app.
  IF jsonb_array_length(p_chapters) > 30
     OR jsonb_array_length(p_sessions) > 60 THEN RETURN NULL; END IF;

  INSERT INTO public.controles (user_id, subject_slug, chapters, exam_date, grade)
  VALUES (v_user, LEFT(COALESCE(p_subject, ''), 80), p_chapters, p_date,
          LEFT(COALESCE(p_grade, ''), 20))
  RETURNING id INTO v_id;

  INSERT INTO public.sessions_preparation
    (controle_id, user_id, planned_date, duration_min, chapter_id, position)
  SELECT
    v_id,
    v_user,
    (s->>'plannedDate')::date,
    LEAST(240, GREATEST(1, COALESCE((s->>'durationMin')::int, 10))),
    LEFT(COALESCE(s->>'chapterId', ''), 80),
    COALESCE((s->>'position')::int, 0)
  FROM jsonb_array_elements(p_sessions) s;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_controle(TEXT, JSONB, DATE, TEXT, JSONB)
  TO authenticated;

-- =============================================================================
-- 5. clan_week_claim — VERSER l'XP annoncée au portefeuille (durcissement 204)
--    Sans le PERFORM wallet_grant_xp, l'écran promettait jusqu'à 300 XP/semaine
--    que le portefeuille ne voyait jamais.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.clan_week_claim(p_week DATE)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_today    DATE := (now() AT TIME ZONE 'utc')::date;
  v_week     DATE;
  v_school   UUID;
  v_mine     INTEGER;
  v_rank     INTEGER;
  v_tier     TEXT;
  v_gems     INTEGER := 0;
  v_xp       INTEGER := 0;
  v_none     JSONB := jsonb_build_object('claimed', FALSE, 'tier', 'aucune',
                                         'gems', 0, 'xp', 0);
BEGIN
  IF v_user IS NULL OR p_week IS NULL THEN RETURN v_none; END IF;
  v_week := public.clan_week_key(p_week);

  -- La semaine doit être close (son lundi est antérieur à celui d'aujourd'hui).
  IF v_week >= public.clan_week_key(v_today) THEN RETURN v_none; END IF;

  SELECT points, school_id INTO v_mine, v_school
    FROM public.clan_week_contributions
   WHERE user_id = v_user AND week_key = v_week;

  -- Contribution personnelle minimale : on ne récolte pas le travail des autres.
  IF v_mine IS NULL OR v_mine < 50 OR v_school IS NULL THEN RETURN v_none; END IF;

  SELECT rank INTO v_rank FROM (
    SELECT school_id,
           ROW_NUMBER() OVER (ORDER BY SUM(points) DESC, school_id) AS rank
      FROM public.clan_week_contributions
     WHERE week_key = v_week AND school_id IS NOT NULL
     GROUP BY school_id
  ) t WHERE school_id = v_school;
  IF v_rank IS NULL THEN RETURN v_none; END IF;

  IF    v_rank = 1  THEN v_tier := 'or';            v_gems := 150; v_xp := 300;
  ELSIF v_rank <= 3 THEN v_tier := 'argent';        v_gems := 90;  v_xp := 200;
  ELSIF v_rank <= 10 THEN v_tier := 'bronze';       v_gems := 50;  v_xp := 120;
  ELSE                   v_tier := 'participation'; v_gems := 20;  v_xp := 60;
  END IF;

  -- La PK fait le verrou : une deuxième réclamation ne fait rien.
  INSERT INTO public.clan_week_claims (user_id, week_key, tier, gems, xp)
  VALUES (v_user, v_week, v_tier, v_gems, v_xp)
  ON CONFLICT (user_id, week_key) DO NOTHING;
  IF NOT FOUND THEN RETURN v_none; END IF;

  UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_gems WHERE id = v_user;
  -- L'XP annoncée est VERSÉE (wallet 192) — sinon l'écran promet un montant que
  -- le portefeuille ne voit jamais. Le verrou PK ci-dessus garantit un seul
  -- versement par semaine ; la clé le redouble côté xp_events.
  PERFORM public.wallet_grant_xp(v_user, 'clan_week', v_week::text, v_xp);

  RETURN jsonb_build_object('claimed', TRUE, 'tier', v_tier,
                            'gems', v_gems, 'xp', v_xp);
END;
$$;

REVOKE ALL ON FUNCTION public.clan_week_claim(DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.clan_week_claim(DATE) TO authenticated;

-- =============================================================================
-- 6. quest_claim — VERSER l'XP annoncée au portefeuille (durcissement 205)
--    Sans le PERFORM wallet_grant_xp, l'écran promettait jusqu'à 310 XP/jour de
--    quêtes que le portefeuille ne voyait jamais.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.quest_claim(p_quest_ids TEXT[])
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_today    DATE := (now() AT TIME ZONE 'utc')::date;
  v_progress JSONB;
  v_gems     INTEGER := 0;
  v_xp       INTEGER := 0;
  v_asked    INTEGER;
  v_finished INTEGER := 0;
  v_all      BOOLEAN := FALSE;
  v_none     JSONB := jsonb_build_object('claimed', FALSE, 'gems', 0, 'xp', 0,
                                         'all_done', FALSE);
BEGIN
  IF v_user IS NULL OR p_quest_ids IS NULL THEN RETURN v_none; END IF;
  -- Trois quêtes par jour : une liste plus longue est une tentative d'abus.
  v_asked := array_length(p_quest_ids, 1);
  IF v_asked IS NULL OR v_asked > 3 THEN RETURN v_none; END IF;

  SELECT progress INTO v_progress
    FROM public.daily_quests WHERE user_id = v_user AND day_key = v_today;
  IF v_progress IS NULL THEN RETURN v_none; END IF;

  -- Insère UNE ligne par quête terminée et pas encore payée. Le ON CONFLICT
  -- fait office de verrou : ré-encaisser une quête déjà payée n'insère rien,
  -- donc ne rapporte rien. On somme ce qui a RÉELLEMENT été inséré.
  WITH gagnees AS (
    SELECT c.id, c.xp, c.gems
      FROM public.quest_catalog() c
     WHERE c.id = ANY (p_quest_ids)
       AND COALESCE((v_progress ->> c.id)::int, 0) >= c.goal
  ), payees AS (
    INSERT INTO public.daily_quest_claims (user_id, day_key, quest_id, gems, xp)
    SELECT v_user, v_today, id, gems, xp FROM gagnees
    ON CONFLICT (user_id, day_key, quest_id) DO NOTHING
    RETURNING xp, gems
  )
  SELECT COALESCE(SUM(xp), 0), COALESCE(SUM(gems), 0),
         (SELECT count(*) FROM gagnees)
    INTO v_xp, v_gems, v_finished
    FROM payees;

  -- Bonus de journée complète (MIROIR de ALL_DONE_XP / ALL_DONE_GEMS) : versé
  -- une seule fois, sous l'id réservé, quand les TROIS quêtes sont finies.
  v_all := (v_finished = 3 AND v_asked = 3);
  IF v_all THEN
    INSERT INTO public.daily_quest_claims (user_id, day_key, quest_id, gems, xp)
    VALUES (v_user, v_today, '__jour__', 15, 100)
    ON CONFLICT (user_id, day_key, quest_id) DO NOTHING;
    IF FOUND THEN v_xp := v_xp + 100; v_gems := v_gems + 15; END IF;
  END IF;

  IF v_xp = 0 AND v_gems = 0 THEN RETURN v_none; END IF;

  UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_gems WHERE id = v_user;
  -- L'XP annoncée est VERSÉE (wallet 192) — sinon l'écran promet un montant que
  -- le portefeuille ne voit jamais. Pas de clé : plusieurs réclamations par jour
  -- sont légitimes (une par quête finie), chacune déjà verrouillée par la PK de
  -- daily_quest_claims — on n'atteint ce point qu'avec du RÉELLEMENT neuf.
  PERFORM public.wallet_grant_xp(v_user, 'quests', NULL, v_xp);

  RETURN jsonb_build_object('claimed', TRUE, 'gems', v_gems, 'xp', v_xp,
                            'all_done', v_all);
END;
$$;

REVOKE ALL ON FUNCTION public.quest_claim(TEXT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.quest_claim(TEXT[]) TO authenticated;

-- =============================================================================
-- 7. season_claim — titre aligné sur l'apostrophe TYPOGRAPHIQUE (durcissement 207)
--    MIROIR de lib/saison.TITLES : « Légende de l'arène » avec ’ et non ''. Sans
--    ça, deux graphies du même titre coexistent à l'écran.
-- =============================================================================
CREATE OR REPLACE FUNCTION public.season_claim(p_tier INTEGER, p_lane TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_season  TEXT;
  v_crowns  INTEGER := 0;
  v_kind    TEXT;
  v_amount  INTEGER := 0;
  v_title   TEXT;
  -- MIROIR de lib/saison.TITLES, à l'apostrophe TYPOGRAPHIQUE près (’ et non
  -- '') : le titre écrit en base doit être strictement égal à celui que la
  -- piste affiche, sinon deux graphies du même titre coexistent à l'écran.
  v_titles  TEXT[] := ARRAY['Recrue', 'Assidu·e', 'Tête chercheuse', 'Métronome',
                            'Sans faute', 'Bourreau de travail',
                            'Légende de l’arène'];
  v_none    JSONB := jsonb_build_object('claimed', FALSE, 'kind', NULL,
                                        'amount', 0, 'title', NULL);
BEGIN
  IF v_user IS NULL THEN RETURN v_none; END IF;
  IF p_tier IS NULL OR p_tier < 1 OR p_tier > 30 THEN RETURN v_none; END IF;
  IF p_lane NOT IN ('libre', 'prestige') THEN RETURN v_none; END IF;
  -- La voie prestige exige l'abonnement, vérifié CÔTÉ SERVEUR.
  IF p_lane = 'prestige' AND NOT public.season_has_pass(v_user) THEN
    RETURN v_none;
  END IF;

  v_season := public.season_key_of((now() AT TIME ZONE 'utc')::date);

  SELECT COALESCE(crowns, 0) INTO v_crowns
    FROM public.season_progress
   WHERE user_id = v_user AND season_key = v_season;

  -- Palier réellement atteint ? Le client ne décide pas de sa progression.
  IF public.season_tier_for(COALESCE(v_crowns, 0)) < p_tier THEN RETURN v_none; END IF;

  IF p_lane = 'libre' THEN
    v_kind := 'gemmes';
    v_amount := CASE WHEN p_tier % 5 = 0 THEN 15 ELSE 5 END;
  ELSIF p_tier % 5 = 0 THEN
    v_kind := 'titre';
    v_amount := 1;
    v_title := v_titles[LEAST(array_length(v_titles, 1), p_tier / 5)];
  ELSE
    v_kind := 'gemmes';
    v_amount := 20;
  END IF;

  INSERT INTO public.season_claims
    (user_id, season_key, tier, lane, kind, amount, title)
  VALUES (v_user, v_season, p_tier, p_lane, v_kind, v_amount, v_title)
  ON CONFLICT (user_id, season_key, tier, lane) DO NOTHING;
  IF NOT FOUND THEN RETURN v_none; END IF;

  IF v_kind = 'gemmes' THEN
    UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_amount
     WHERE id = v_user;
  ELSE
    -- Le titre s'équipe tout de suite : une récompense qu'il faut aller
    -- chercher dans un menu n'est pas une récompense.
    UPDATE public.profiles SET season_title = v_title WHERE id = v_user;
  END IF;

  RETURN jsonb_build_object('claimed', TRUE, 'kind', v_kind,
                            'amount', v_amount, 'title', v_title);
END;
$$;

REVOKE ALL ON FUNCTION public.season_claim(INTEGER, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.season_claim(INTEGER, TEXT) TO authenticated;

-- --- Vérifications (connecté en tant qu'élève) -------------------------------
--   insert into xp_events (…, source, …) values (…, 'quests', …)   → autorisé
--   select public.quest_claim(ARRAY['duel1']);        → l'XP versée = l'XP rendue
--   select public.clan_week_claim(current_date - 7);  → idem côté clan
--   update profiles set gamertag = 'xx';              → refusé (< 3 caractères)
