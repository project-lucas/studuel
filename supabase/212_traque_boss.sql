-- =============================================================================
-- Studuel — Migration 212 : « La Traque » (boss débusqués par la révision)
--
-- L'élève ne CHOISIT plus de combattre un boss : il le DÉBUSQUE en révisant.
-- Chaque matière a son gardien ; le travail réel sur cette matière remplit une
-- jauge de traque. À 100 %, le boss sort de sa tanière et reste défiable
-- pendant UNE HEURE. Le combat porte sur les chapitres qui ont rempli sa jauge.
--
-- MIROIR de lib/traque.ts — barème, seuil (100), plafond quotidien (150),
-- fenêtre (60 min), retombée après défaite (50), gemmes par rang, bonus du
-- boss en chasse et plafond hebdomadaire. Toute évolution du barème doit
-- toucher LES DEUX CÔTÉS. Le calendrier de la chasse est lui aussi dupliqué
-- ici (fonction traque_en_chasse) : c'est le serveur qui décide du bonus, pas
-- le client.
--
-- Sécurité : la table n'a AUCUNE policy d'écriture. Tout passe par les trois
-- RPC SECURITY DEFINER ci-dessous, qui bornent les points (plafond du jour),
-- vérifient que la fenêtre de combat est réellement ouverte avant de payer, et
-- fixent les montants côté serveur. Une victoire ne se paie qu'UNE fois par
-- débusquage (clé d'idempotence dans gem_events).
--
-- PRÉREQUIS : schema.sql (profiles), 183 (profiles.gems), 192 (gem_events).
-- ⚠️ La 211 est réservée au chantier « contrôles partout ».
-- Idempotente. À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor.
-- Astuce : sélectionne TOUT le fichier (Ctrl+A) avant de lancer.
-- =============================================================================

-- --- Table -------------------------------------------------------------------
-- Une ligne par (élève, boss). Les victoires vivaient jusqu'ici en
-- localStorage ('scolaria-boss-victories') : une progression qui représente du
-- travail réel doit être en base, sinon changer de téléphone l'efface.

CREATE TABLE IF NOT EXISTS public.boss_gauges (
  user_id     UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  boss_id     TEXT NOT NULL,
  -- Points de traque, écrêtés au seuil (100).
  points      INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
  -- Chapitres qui ont nourri la jauge, LE PLUS RÉCENT EN TÊTE : c'est d'eux
  -- qu'est tiré le pool du combat. JSONB tableau de textes.
  chapters    JSONB NOT NULL DEFAULT '[]'::jsonb,
  victories   INTEGER NOT NULL DEFAULT 0 CHECK (victories >= 0),
  -- Instant du débusquage — NULL tant que le boss rôde.
  debusque_at TIMESTAMPTZ,
  -- Plafond quotidien : jour du dernier crédit + points crédités ce jour-là.
  day_key     DATE,
  day_points  INTEGER NOT NULL DEFAULT 0 CHECK (day_points >= 0),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, boss_id)
);

-- Lecture de la feuille Boss : toutes les jauges d'un élève d'un coup.
CREATE INDEX IF NOT EXISTS boss_gauges_user_idx
  ON public.boss_gauges (user_id);

-- --- RLS ---------------------------------------------------------------------

ALTER TABLE public.boss_gauges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS boss_gauges_select_own ON public.boss_gauges;
CREATE POLICY boss_gauges_select_own ON public.boss_gauges
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- Aucune policy d'écriture : tout passe par les RPC SECURITY DEFINER.
REVOKE INSERT, UPDATE, DELETE ON public.boss_gauges FROM anon, authenticated;
GRANT SELECT ON public.boss_gauges TO authenticated;

-- --- Nouvelle source de gemmes ----------------------------------------------
-- gem_events.source porte un CHECK fermé (192). La traque en devient la
-- cinquième source. ALTER plutôt que recréation : la 192 est déjà exécutée.

ALTER TABLE public.gem_events DROP CONSTRAINT IF EXISTS gem_events_source_check;
ALTER TABLE public.gem_events ADD CONSTRAINT gem_events_source_check
  CHECK (source IN ('chapter_crowns', 'streak_7', 'defi_win', 'level_up',
                    'traque_win'));

-- --- Constantes du barème (miroir de lib/traque.ts) --------------------------

CREATE OR REPLACE FUNCTION public.traque_seuil() RETURNS INTEGER
LANGUAGE sql IMMUTABLE AS $$ SELECT 100 $$;

CREATE OR REPLACE FUNCTION public.traque_plafond_jour() RETURNS INTEGER
LANGUAGE sql IMMUTABLE AS $$ SELECT 150 $$;

CREATE OR REPLACE FUNCTION public.traque_fenetre() RETURNS INTERVAL
LANGUAGE sql IMMUTABLE AS $$ SELECT INTERVAL '60 minutes' $$;

-- Où retombe la jauge après une défaite (ou une fenêtre laissée passer).
-- Jamais zéro : vider entièrement punit d'avoir essayé.
CREATE OR REPLACE FUNCTION public.traque_apres_defaite() RETURNS INTEGER
LANGUAGE sql IMMUTABLE AS $$ SELECT 50 $$;

-- Plafond HEBDOMADAIRE de gemmes gagnables à la traque : sans lui, le
-- catalogue s'ouvre en trois semaines et Studuel+ perd sa contrepartie.
CREATE OR REPLACE FUNCTION public.traque_gems_week_cap() RETURNS INTEGER
LANGUAGE sql IMMUTABLE AS $$ SELECT 90 $$;

-- Le CALENDRIER de la chasse — miroir de lib/traque.CHASSE_BY_WEEKDAY.
-- Le week-end (samedi, dimanche), tout le monde chasse : c'est le rattrapage.
CREATE OR REPLACE FUNCTION public.traque_en_chasse(p_boss_id TEXT, p_day DATE)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  -- EXTRACT(isodow) : lundi = 1 … dimanche = 7.
  v_dow INTEGER := EXTRACT(isodow FROM p_day)::int;
BEGIN
  IF v_dow >= 6 THEN RETURN TRUE; END IF;
  RETURN p_boss_id = ANY (
    CASE v_dow
      WHEN 1 THEN ARRAY['delta', 'imperator']         -- Maths · Latin
      WHEN 2 THEN ARRAY['grammatork', 'plasma']       -- Français · Physique-Chimie
      WHEN 3 THEN ARRAY['chronos', 'bigben']          -- Histoire-Géo · Anglais
      WHEN 4 THEN ARRAY['mitochondrix', 'eltoro']     -- SVT · Espagnol
      ELSE       ARRAY['kaiser-fang', 'krach']        -- Allemand · SES
    END
  );
END;
$$;

-- --- Fusion des chapitres nourris (miroir de lib/traque.feedChapters) --------
-- Le chapitre fraîchement travaillé passe DEVANT, la liste déduplique et reste
-- bornée à 12 : c'est de sa tête qu'est tiré le pool du combat.
CREATE OR REPLACE FUNCTION public.traque_merge_chapters(
  p_existing JSONB,
  p_fresh    TEXT[]
)
RETURNS JSONB
LANGUAGE sql
IMMUTABLE
AS $$
  WITH tous AS (
    -- Le frais d'abord (ordinalité basse), l'existant ensuite (décalé de 1000).
    SELECT f.c, f.ord
      FROM unnest(COALESCE(p_fresh, ARRAY[]::TEXT[]))
             WITH ORDINALITY AS f(c, ord)
    UNION ALL
    SELECT e.c, 1000 + e.ord
      FROM jsonb_array_elements_text(
             CASE WHEN jsonb_typeof(p_existing) = 'array'
                  THEN p_existing ELSE '[]'::jsonb END
           ) WITH ORDINALITY AS e(c, ord)
  ), uniques AS (
    SELECT c, MIN(ord) AS ord
      FROM tous
     WHERE c IS NOT NULL AND c <> ''
     GROUP BY c
     ORDER BY MIN(ord)
     LIMIT 12
  )
  SELECT COALESCE(jsonb_agg(c ORDER BY ord), '[]'::jsonb) FROM uniques;
$$;

-- --- RPC 1 : créditer la jauge -----------------------------------------------
-- Appelée par les Server Actions à chaque geste de travail réel (carte
-- révisée, bonne réponse, leçon terminée, quiz de chapitre). Le CLIENT
-- n'envoie que des points déjà calculés par lib/traque.pointsFor ; le serveur
-- les borne au plafond du jour, écrête la jauge au seuil et décide seul du
-- débusquage.
--
-- Renvoie { points, percent, chapters, victories, debusque_at, just_debusque }.
CREATE OR REPLACE FUNCTION public.traque_credit(
  p_boss_id  TEXT,
  p_points   INTEGER,
  p_chapters TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := (SELECT auth.uid());
  v_boss    TEXT := NULLIF(LEFT(COALESCE(p_boss_id, ''), 40), '');
  v_today   DATE := (now() AT TIME ZONE 'utc')::date;
  v_seuil   INTEGER := public.traque_seuil();
  v_ask     INTEGER := GREATEST(0, LEAST(COALESCE(p_points, 0),
                                         public.traque_plafond_jour()));
  v_row     public.boss_gauges;
  v_day_pts INTEGER;
  v_grant   INTEGER;
  v_points  INTEGER;
  v_fresh   BOOLEAN := FALSE;
BEGIN
  IF v_user IS NULL OR v_boss IS NULL THEN RETURN NULL; END IF;

  INSERT INTO public.boss_gauges (user_id, boss_id, day_key)
  VALUES (v_user, v_boss, v_today)
  ON CONFLICT (user_id, boss_id) DO NOTHING;

  -- Verrou de ligne : deux onglets qui révisent en même temps ne doivent pas
  -- perdre un crédit ni débusquer deux fois.
  SELECT * INTO v_row FROM public.boss_gauges
   WHERE user_id = v_user AND boss_id = v_boss FOR UPDATE;

  v_points := v_row.points;

  -- Fenêtre laissée passer : le boss s'est recouché, la jauge repart de la
  -- moitié. On le fait à la LECTURE suivante — pas de tâche planifiée.
  IF v_row.debusque_at IS NOT NULL
     AND now() >= v_row.debusque_at + public.traque_fenetre() THEN
    v_row.debusque_at := NULL;
    v_points := public.traque_apres_defaite();
  END IF;

  -- Plafond du jour : remis à zéro au changement de jour UTC.
  v_day_pts := CASE WHEN v_row.day_key = v_today THEN v_row.day_points ELSE 0 END;
  v_grant := GREATEST(0, LEAST(v_ask, public.traque_plafond_jour() - v_day_pts));

  -- Boss déjà sorti : la jauge n'avance plus (elle est pleine), mais les
  -- chapitres continuent de se nourrir — le pool du combat reste à jour. Le
  -- plafond du jour n'est pas entamé pour autant : réviser pendant la fenêtre
  -- de combat ne doit pas grignoter le budget de la prochaine traque.
  IF v_row.debusque_at IS NULL THEN
    v_points := LEAST(v_seuil, v_points + v_grant);
    IF v_points >= v_seuil THEN
      v_row.debusque_at := now();
      v_fresh := TRUE;
    END IF;
  ELSE
    v_grant := 0;
  END IF;

  UPDATE public.boss_gauges
     SET points      = v_points,
         chapters    = public.traque_merge_chapters(chapters, p_chapters),
         debusque_at = v_row.debusque_at,
         day_key     = v_today,
         day_points  = v_day_pts + v_grant,
         updated_at  = now()
   WHERE user_id = v_user AND boss_id = v_boss
   RETURNING * INTO v_row;

  RETURN jsonb_build_object(
    'boss_id',       v_row.boss_id,
    'points',        v_row.points,
    'percent',       LEAST(100, (v_row.points * 100) / v_seuil),
    'chapters',      v_row.chapters,
    'victories',     v_row.victories,
    'debusque_at',   v_row.debusque_at,
    'just_debusque', v_fresh
  );
END;
$$;

REVOKE ALL ON FUNCTION public.traque_credit(TEXT, INTEGER, TEXT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.traque_credit(TEXT, INTEGER, TEXT[])
  TO authenticated;

-- --- RPC 2 : encaisser une victoire ------------------------------------------
-- Le serveur REVÉRIFIE que le boss était bien sorti et que la fenêtre d'une
-- heure court encore : une victoire déclarée hors fenêtre ne paie rien. Le
-- rang, le bonus du jour et le montant sont recalculés ici — jamais reçus du
-- client. L'idempotence tient à la clé « boss:instant-du-débusquage » dans
-- gem_events : rejouer l'appel ne paie pas deux fois.
--
-- Renvoie { won, gems, rank, victories, capped }.
CREATE OR REPLACE FUNCTION public.traque_victoire(p_boss_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := (SELECT auth.uid());
  v_boss   TEXT := NULLIF(LEFT(COALESCE(p_boss_id, ''), 40), '');
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_row    public.boss_gauges;
  v_rank   INTEGER;
  v_amount INTEGER;
  v_week   TIMESTAMPTZ;
  v_spent  INTEGER;
  v_paid   INTEGER := 0;
  v_key    TEXT;
  v_none   JSONB := jsonb_build_object('won', FALSE, 'gems', 0, 'rank', 1,
                                       'victories', 0, 'capped', FALSE);
BEGIN
  IF v_user IS NULL OR v_boss IS NULL THEN RETURN v_none; END IF;

  SELECT * INTO v_row FROM public.boss_gauges
   WHERE user_id = v_user AND boss_id = v_boss FOR UPDATE;
  IF NOT FOUND OR v_row.debusque_at IS NULL THEN RETURN v_none; END IF;
  -- Fenêtre refermée : le combat n'a pas eu lieu dans les temps.
  IF now() >= v_row.debusque_at + public.traque_fenetre() THEN
    UPDATE public.boss_gauges
       SET points = public.traque_apres_defaite(), debusque_at = NULL,
           updated_at = now()
     WHERE user_id = v_user AND boss_id = v_boss;
    RETURN v_none;
  END IF;

  -- Rang I → III (miroir de lib/bosses.rankFromVictories).
  v_rank := LEAST(1 + v_row.victories, 3);
  v_amount := CASE v_rank WHEN 1 THEN 10 WHEN 2 THEN 15 ELSE 20 END;
  IF v_boss = 'nox' THEN
    v_amount := 30;                                   -- Nox = un chapitre entier
  ELSIF public.traque_en_chasse(v_boss, v_today) THEN
    v_amount := v_amount * 2;                         -- boss en chasse du jour
  END IF;

  -- Plafond hebdomadaire (semaine ISO, lundi 00:00 UTC).
  v_week := date_trunc('week', now() AT TIME ZONE 'utc') AT TIME ZONE 'utc';
  SELECT COALESCE(SUM(amount), 0) INTO v_spent
    FROM public.gem_events
   WHERE user_id = v_user AND source = 'traque_win' AND created_at >= v_week;
  v_amount := GREATEST(0, LEAST(v_amount,
                                public.traque_gems_week_cap() - v_spent));

  -- Une victoire payée UNE fois par débusquage.
  IF v_amount > 0 THEN
    v_key := v_boss || ':' || to_char(v_row.debusque_at AT TIME ZONE 'utc',
                                      'YYYY-MM-DD"T"HH24:MI:SS');
    INSERT INTO public.gem_events (user_id, source, source_key, amount)
    VALUES (v_user, 'traque_win', v_key, v_amount)
    ON CONFLICT (user_id, source, source_key) DO NOTHING;
    IF FOUND THEN
      UPDATE public.profiles SET gems = gems + v_amount WHERE id = v_user;
      v_paid := v_amount;
    END IF;
  END IF;

  -- Le boss retourne dans sa tanière, plus fort : jauge à zéro, rang +1.
  UPDATE public.boss_gauges
     SET victories = victories + 1, points = 0, debusque_at = NULL,
         updated_at = now()
   WHERE user_id = v_user AND boss_id = v_boss
   RETURNING * INTO v_row;

  RETURN jsonb_build_object(
    'won',       TRUE,
    'gems',      v_paid,
    'rank',      LEAST(v_row.victories + 1, 3),
    'victories', v_row.victories,
    'capped',    v_paid = 0
  );
END;
$$;

REVOKE ALL ON FUNCTION public.traque_victoire(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.traque_victoire(TEXT) TO authenticated;

-- --- RPC 3 : encaisser une défaite -------------------------------------------
-- La jauge retombe à la MOITIÉ, jamais à zéro, et le boss se recouche.
CREATE OR REPLACE FUNCTION public.traque_defaite(p_boss_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := (SELECT auth.uid());
  v_boss TEXT := NULLIF(LEFT(COALESCE(p_boss_id, ''), 40), '');
  v_row  public.boss_gauges;
BEGIN
  IF v_user IS NULL OR v_boss IS NULL THEN RETURN NULL; END IF;

  UPDATE public.boss_gauges
     SET points = public.traque_apres_defaite(), debusque_at = NULL,
         updated_at = now()
   WHERE user_id = v_user AND boss_id = v_boss AND debusque_at IS NOT NULL
   RETURNING * INTO v_row;
  IF NOT FOUND THEN RETURN NULL; END IF;

  RETURN jsonb_build_object('points', v_row.points, 'debusque_at', NULL);
END;
$$;

REVOKE ALL ON FUNCTION public.traque_defaite(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.traque_defaite(TEXT) TO authenticated;

-- =============================================================================
-- Fin de la migration 212.
-- =============================================================================
