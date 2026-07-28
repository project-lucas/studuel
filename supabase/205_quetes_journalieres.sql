-- =============================================================================
-- Studuel — Migration 205 : « Quêtes du jour »
--
-- Trois objectifs courts, renouvelés chaque jour à minuit UTC. C'est le
-- rendez-vous quotidien : la quête répond à « qu'est-ce que je fais
-- maintenant ? » et se termine en une session.
--
-- Le TIRAGE des trois quêtes n'est PAS stocké : il est déterministe côté code
-- (lib/quests.dailyQuests, graine = jour + id élève). Seule la PROGRESSION vit
-- ici, en JSONB { "<quest_id>": <avancement> }.
--
-- Sécurité — le compromis est explicite : la progression est poussée par le
-- client (via Server Action), donc théoriquement gonflable avec la clé anon.
-- Ce qui est verrouillé, c'est le VERSEMENT :
--   · la récompense est recalculée ICI depuis le catalogue serveur, jamais
--     envoyée par le client ;
--   · la PK (user_id, day_key, quest_id) de daily_quest_claims interdit de
--     payer deux fois la même quête ;
--   · le montant est donc borné à ~210 XP / 21 gemmes par jour — l'ordre de
--     grandeur d'une journée de jeu honnête. L'abus ne « décolle » pas.
-- Le durcissement complet (dériver la progression des lignes d'activité
-- réelles) est un chantier à part, tracé mais non requis pour livrer.
--
-- MIROIR de lib/quests.ts (catalogue, objectifs, récompenses, bonus).
-- Toute modification du catalogue doit être faite DES DEUX CÔTÉS.
--
-- PRÉREQUIS : schema.sql (profiles), 183 (profiles.gems).
-- Idempotente. À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor.
-- Astuce : sélectionne TOUT le fichier (Ctrl+A) avant de lancer.
-- =============================================================================

-- --- Tables ------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.daily_quests (
  user_id    UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  day_key    DATE NOT NULL,                     -- clé UTC du jour
  progress   JSONB NOT NULL DEFAULT '{}'::jsonb, -- { "<quest_id>": <int> }
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, day_key)
);

-- Une ligne PAR QUÊTE payée (et non par jour) : l'élève qui encaisse sa
-- première quête à 18 h doit pouvoir encaisser la troisième à 21 h. La PK
-- interdit de repayer la même quête, ce qui borne le versement à 3 quêtes + le
-- bonus par jour. Le bonus « journée complète » occupe l'id réservé '__jour__'.
CREATE TABLE IF NOT EXISTS public.daily_quest_claims (
  user_id    UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  day_key    DATE NOT NULL,
  quest_id   TEXT NOT NULL,
  gems       INTEGER NOT NULL DEFAULT 0,
  xp         INTEGER NOT NULL DEFAULT 0,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, day_key, quest_id)
);

-- --- RLS ---------------------------------------------------------------------

ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quest_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS daily_quests_select_own ON public.daily_quests;
CREATE POLICY daily_quests_select_own ON public.daily_quests
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS daily_quest_claims_select_own ON public.daily_quest_claims;
CREATE POLICY daily_quest_claims_select_own ON public.daily_quest_claims
  FOR SELECT USING (auth.uid() = user_id);

-- (Aucune policy d'écriture : tout passe par les RPC SECURITY DEFINER.)

-- --- Catalogue serveur -------------------------------------------------------
-- MIROIR de lib/quests.QUEST_CATALOG. C'est LUI qui fixe ce qu'une quête vaut :
-- le client n'envoie jamais de montant.
CREATE OR REPLACE FUNCTION public.quest_catalog()
RETURNS TABLE (id TEXT, goal INTEGER, xp INTEGER, gems INTEGER)
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT * FROM (VALUES
    ('duel1',      1,  30,  3),
    ('correct10',  10, 30,  3),
    ('revision5',  5,  30,  3),
    ('combo3',     3,  30,  3),
    ('duel3',      3,  60,  6),
    ('win1',       1,  60,  6),
    ('correct25',  25, 60,  6),
    ('prepa1',     1,  60,  6),
    ('revision15', 15, 60,  6),
    ('win3',       3,  120, 12),
    ('combo8',     8,  120, 12),
    ('chapter2',   2,  120, 12),
    ('correct50',  50, 120, 12)
  ) AS c(id, goal, xp, gems);
$$;

-- --- RPC : enregistrer la progression du jour --------------------------------
-- p_progress : l'objet COMPLET recalculé par lib/quests.applyEvent.
-- Le serveur écrête chaque valeur à l'objectif du catalogue et refuse toute
-- clé inconnue : une progression gonflée ne peut pas dépasser « quête finie ».
-- Une progression ne redescend jamais (max avec l'existant) : deux onglets
-- ouverts ne peuvent pas effacer l'avancement l'un de l'autre.
CREATE OR REPLACE FUNCTION public.quest_save_progress(p_progress JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_today    DATE := (now() AT TIME ZONE 'utc')::date;
  v_clean    JSONB;
  v_existing JSONB;
  v_merged   JSONB;
BEGIN
  IF v_user IS NULL THEN RETURN '{}'::jsonb; END IF;
  IF p_progress IS NULL OR jsonb_typeof(p_progress) <> 'object' THEN
    RETURN '{}'::jsonb;
  END IF;

  -- Ne garde que les ids du catalogue dont la valeur est un NOMBRE (une chaîne
  -- ferait planter le cast : la RPC est appelable directement, elle ne suppose
  -- rien de son appelant), écrêtés à leur objectif.
  SELECT COALESCE(jsonb_object_agg(c.id, LEAST(v.val, c.goal)), '{}'::jsonb)
    INTO v_clean
    FROM public.quest_catalog() c
    JOIN LATERAL (
      SELECT GREATEST(0, FLOOR((p_progress ->> c.id)::numeric)::int) AS val
    ) v ON TRUE
   WHERE jsonb_typeof(p_progress -> c.id) = 'number' AND v.val > 0;

  SELECT progress INTO v_existing
    FROM public.daily_quests WHERE user_id = v_user AND day_key = v_today;

  -- Fusion « le plus avancé gagne », clé par clé : une progression ne redescend
  -- jamais. (Lecture puis écriture : deux appels VRAIMENT simultanés du même
  -- élève peuvent perdre un incrément — sans conséquence, le suivant le rattrape.)
  SELECT COALESCE(jsonb_object_agg(k, mx), '{}'::jsonb)
    INTO v_merged
    FROM (
      SELECT key AS k, MAX(value::int) AS mx
        FROM (
          SELECT * FROM jsonb_each_text(COALESCE(v_existing, '{}'::jsonb))
          UNION ALL
          SELECT * FROM jsonb_each_text(v_clean)
        ) u
       GROUP BY key
    ) m;

  INSERT INTO public.daily_quests (user_id, day_key, progress, updated_at)
  VALUES (v_user, v_today, v_merged, now())
  ON CONFLICT (user_id, day_key) DO UPDATE
    SET progress = EXCLUDED.progress, updated_at = now();

  RETURN v_merged;
END;
$$;

REVOKE ALL ON FUNCTION public.quest_save_progress(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.quest_save_progress(JSONB) TO authenticated;

-- --- RPC : réclamer les quêtes terminées du jour -----------------------------
-- Recalcule la récompense DEPUIS la progression stockée et le catalogue serveur.
-- p_quest_ids : les 3 ids tirés pour cet élève aujourd'hui (le tirage vit côté
-- code) — le serveur n'en paie QUE l'intersection avec le catalogue, et ne paie
-- le bonus « journée complète » que si les trois sont effectivement terminées.
-- Une seule réclamation par jour (PK). Renvoie { claimed, gems, xp, all_done }.
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

-- --- Vérifications (connecté en tant qu'élève) -------------------------------
--   select public.quest_save_progress('{"duel1": 5, "inconnu": 99}'::jsonb);
--     → {"duel1": 1}  (écrêté à l'objectif, clé inconnue ignorée)
--   select public.quest_claim(ARRAY['duel1']);   → claimed=true, gems=3
--   select public.quest_claim(ARRAY['duel1']);   → claimed=false (déjà payée)
