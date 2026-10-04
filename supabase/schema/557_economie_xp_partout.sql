-- =============================================================================
-- Studuel — Migration 557 : L'XP PARTOUT, LES GEMMES RARES
--
-- Lucas, 04/10/2026 : « partout il doit y avoir un gain d'XP, plus ou moins
-- fort, avec une vraie logique. Le gain de gemmes doit être très rare, que pour
-- les dictées, les annales ou quelque chose qui a un vrai impact sur les notes,
-- car plus difficile. »
--
-- MIROIR de lib/economie.ts (barème, plafonds, seuils), vérifié par
-- lib/economie.test.ts. Ce que fait cette migration :
--
--   1. L'XP DE CHAQUE GESTE. `xp_activite(source, clé, points, total)` verse
--      l'XP d'une activité finie — quiz, révision, capsule, encyclopédie,
--      flashcards, jeu de salon, mode de l'arène, défi du jour, duel, première
--      partie — au barème `xp_activite_bareme`, dans un PLAFOND PAR JOUR et par
--      activité (`xp_activite_jour`, compté en XP de BASE : le multiplicateur
--      d'amis et la potion s'appliquent ensuite, sans entamer le plafond).
--   2. LES ÉPREUVES. `epreuve_recompenser(type, id)` relit la note EN BASE
--      (dictée, contrôle blanc, examen blanc) ou le temps passé (annale :
--      `annale_commencer` puis 15 min au moins) et verse l'XP de l'épreuve et,
--      au-dessus du seuil, ses GEMMES — une fois par épreuve et par palier,
--      dans un plafond de 40 gemmes d'épreuves par semaine.
--   3. LES GEMMES FACILES S'ARRÊTENT. Plus rien pour un niveau franchi (15),
--      une série de 7 jours (20 → 50 XP), un chapitre à 3 couronnes (30), une
--      quête ou la journée de quêtes complète, une étoile de jeu de salon
--      (→ 5 × N XP), le coffre d'équipe, le classement d'école, la Traque
--      (→ XP) ; la ligue ne paie plus que le passage à un NOUVEAU RANG (10) ;
--      le coffre de palier de niveau tombe à 10 gemmes (25 tous les 25
--      niveaux) ; seul l'exercice ★★★ du cahier garde 5 gemmes.
--   4. La leçon lue passe de 5 à 10 XP.
--
-- Restent intacts : le parrainage (+30), les packs achetés, les dépenses.
-- Les gemmes déjà gagnées restent acquises ; seuls les versements NEUFS changent.
--
-- PRÉREQUIS : 192, 209, 213, 318, 360, 366, 368, 372, 373, 376, 379, 380, 555,
-- 556. Idempotente. À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor.
-- =============================================================================

-- ─────────────────────────────────────── 1. les sources d'XP et de gemmes

DO $$
DECLARE
  v_table   TEXT;
  v_nom     TEXT;
  v_def     TEXT;
  v_sources TEXT[];
  v_neuves  TEXT[];
  v_s       TEXT;
BEGIN
  FOREACH v_table IN ARRAY ARRAY['xp_events', 'gem_events'] LOOP
    v_nom := v_table || '_source_check';
    v_neuves := CASE v_table
      WHEN 'xp_events' THEN ARRAY['quiz', 'revision', 'examen_blanc', 'controle', 'dictee',
                                  'annale', 'capsule', 'encyclo', 'flashcards', 'jeu', 'arene',
                                  'defi_jour', 'duel', 'bienvenue', 'serie', 'palier', 'traque']
      ELSE ARRAY['epreuve']
    END;
    SELECT pg_get_constraintdef(c.oid) INTO v_def
      FROM pg_constraint c
     WHERE c.conname = v_nom
       AND c.conrelid = ('public.' || v_table)::regclass;
    IF v_def IS NULL THEN CONTINUE; END IF;
    SELECT array_agg(DISTINCT btrim(s)) INTO v_sources
      FROM regexp_matches(v_def, '''([^'']+)''', 'g') AS m,
           LATERAL unnest(string_to_array(btrim(m[1], '{}'), ',')) AS s
     WHERE btrim(s) <> '';
    v_sources := COALESCE(v_sources, ARRAY[]::TEXT[]);
    IF v_neuves <@ v_sources THEN CONTINUE; END IF;
    FOREACH v_s IN ARRAY v_neuves LOOP
      IF NOT (v_s = ANY (v_sources)) THEN v_sources := array_append(v_sources, v_s); END IF;
    END LOOP;
    EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT %I', v_table, v_nom);
    EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I CHECK (source IN (%s))',
                   v_table, v_nom,
                   (SELECT string_agg(quote_literal(x), ', ' ORDER BY x) FROM unnest(v_sources) x));
  END LOOP;
END $$;

-- ─────────────────────────────────────── 2. les tables

-- L'XP de BASE versée par activité et par jour : le plafond se lit ici.
CREATE TABLE IF NOT EXISTS public.xp_activite_jour (
  user_id UUID    NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  jour    DATE    NOT NULL,
  source  TEXT    NOT NULL,
  base    INTEGER NOT NULL DEFAULT 0 CHECK (base >= 0),
  PRIMARY KEY (user_id, jour, source)
);

ALTER TABLE public.xp_activite_jour ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "xp_activite_jour_select_own" ON public.xp_activite_jour;
CREATE POLICY "xp_activite_jour_select_own" ON public.xp_activite_jour
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
REVOKE INSERT, UPDATE, DELETE ON public.xp_activite_jour FROM anon, authenticated;
GRANT SELECT ON public.xp_activite_jour TO authenticated;

-- Le temps passé sur une annale : ouverte, puis traitée (15 min au moins).
CREATE TABLE IF NOT EXISTS public.annales_travail (
  user_id     UUID        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  annale_id   TEXT        NOT NULL CHECK (annale_id ~ '^[a-z0-9-]{3,80}$'),
  commence_le TIMESTAMPTZ NOT NULL DEFAULT now(),
  termine_le  TIMESTAMPTZ,
  PRIMARY KEY (user_id, annale_id)
);

ALTER TABLE public.annales_travail ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "annales_travail_select_own" ON public.annales_travail;
CREATE POLICY "annales_travail_select_own" ON public.annales_travail
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
REVOKE INSERT, UPDATE, DELETE ON public.annales_travail FROM anon, authenticated;
GRANT SELECT ON public.annales_travail TO authenticated;

-- ─────────────────────────────────────── 3. le barème (MIROIR de lib/economie.ts)

-- L'XP de base d'une partie : base + par point (borné au total) + parfait,
-- plafonnée à la partie. Source inconnue → 0.
CREATE OR REPLACE FUNCTION public.xp_activite_bareme(p_source TEXT, p_points INTEGER, p_total INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_base INTEGER; v_par INTEGER; v_parfait INTEGER; v_max INTEGER;
  v_p INTEGER := GREATEST(0, COALESCE(p_points, 0));
  v_t INTEGER := GREATEST(0, COALESCE(p_total, 0));
BEGIN
  -- base · par point · parfait · max par partie
  SELECT b, p, f, m INTO v_base, v_par, v_parfait, v_max FROM (VALUES
    ('quiz',         10, 2, 10,  50),
    ('revision',      0, 2,  0,  40),
    ('examen_blanc', 20, 2, 20, 100),
    ('controle',     20, 2,  0,  60),
    ('dictee',       10, 2,  0,  50),
    ('annale',      150, 0,  0, 150),
    ('capsule',      80, 0,  0,  80),
    ('encyclo',       5, 0,  0,   5),
    ('flashcards',    0, 1,  0,  20),
    ('jeu',           0, 1,  5,  15),
    ('arene',         5, 1,  0,  25),
    ('defi_jour',    30, 0,  0,  30),
    ('duel',         10, 0, 10,  20),
    ('bienvenue',    50, 0,  0,  50)
  ) AS t(s, b, p, f, m) WHERE s = p_source;
  IF v_base IS NULL THEN RETURN 0; END IF;
  IF v_t > 0 THEN v_p := LEAST(v_p, v_t); END IF;
  RETURN LEAST(v_max, v_base + v_par * v_p
                      + CASE WHEN v_t > 0 AND v_p >= v_t THEN v_parfait ELSE 0 END);
END;
$$;

-- Le plafond d'XP de base par jour et par activité.
CREATE OR REPLACE FUNCTION public.xp_activite_plafond(p_source TEXT)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE p_source
    WHEN 'quiz'         THEN 250
    WHEN 'revision'     THEN 120
    WHEN 'examen_blanc' THEN 200
    WHEN 'controle'     THEN 180
    WHEN 'dictee'       THEN 150
    WHEN 'annale'       THEN 300
    WHEN 'capsule'      THEN 240
    WHEN 'encyclo'      THEN 25
    WHEN 'flashcards'   THEN 60
    WHEN 'jeu'          THEN 60
    WHEN 'arene'        THEN 100
    WHEN 'defi_jour'    THEN 30
    WHEN 'duel'         THEN 100
    WHEN 'bienvenue'    THEN 50
    ELSE 0
  END;
$$;

-- Les gemmes d'une épreuve réussie (note sur 20). MIROIR de gemmesEpreuve.
CREATE OR REPLACE FUNCTION public.epreuve_gemmes(p_type TEXT, p_note NUMERIC)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE p_type
    WHEN 'dictee'       THEN CASE WHEN p_note >= 19 THEN 10 WHEN p_note >= 16 THEN 5 ELSE 0 END
    WHEN 'controle'     THEN CASE WHEN p_note >= 17 THEN 10 WHEN p_note >= 14 THEN 5 ELSE 0 END
    WHEN 'examen_blanc' THEN CASE WHEN p_note >= 15 THEN 10 ELSE 0 END
    WHEN 'annale'       THEN 10
    ELSE 0
  END;
$$;

-- Gemmes d'épreuves au plus par semaine (MIROIR de PLAFOND_GEMMES_SEMAINE).
CREATE OR REPLACE FUNCTION public.epreuve_gemmes_semaine_max()
RETURNS INTEGER LANGUAGE sql IMMUTABLE AS $$ SELECT 40 $$;

-- ─────────────────────────────────────── 4. verser (primitives internes)

-- Verse l'XP de base `p_montant` d'une activité, dans son plafond du jour, une
-- fois par (source, clé). Rend l'XP RÉELLEMENT entrée au portefeuille
-- (multiplicateur compris). Interne : appelée par xp_activite et
-- epreuve_recompenser, qui ont déjà vérifié l'élève.
CREATE OR REPLACE FUNCTION public.xp_activite_verser(p_user UUID, p_source TEXT, p_cle TEXT, p_montant INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_deja   INTEGER;
  v_base   INTEGER;
  v_avant  INTEGER;
  v_apres  INTEGER;
  v_cle    TEXT := NULLIF(LEFT(COALESCE(p_cle, ''), 80), '');
BEGIN
  IF p_user IS NULL OR v_cle IS NULL OR COALESCE(p_montant, 0) <= 0 THEN RETURN 0; END IF;
  -- Déjà payée : rien (et le plafond n'est pas entamé).
  IF EXISTS (SELECT 1 FROM public.xp_events
              WHERE user_id = p_user AND source = p_source AND source_key = v_cle) THEN
    RETURN 0;
  END IF;

  INSERT INTO public.xp_activite_jour (user_id, jour, source, base)
  VALUES (p_user, v_today, p_source, 0)
  ON CONFLICT (user_id, jour, source) DO NOTHING;
  SELECT base INTO v_deja FROM public.xp_activite_jour
   WHERE user_id = p_user AND jour = v_today AND source = p_source FOR UPDATE;

  v_base := GREATEST(0, LEAST(p_montant, public.xp_activite_plafond(p_source) - COALESCE(v_deja, 0)));
  IF v_base <= 0 THEN RETURN 0; END IF;

  PERFORM public.wallet_ensure(p_user);
  SELECT xp INTO v_avant FROM public.user_wallet WHERE user_id = p_user;
  PERFORM public.wallet_grant_xp(p_user, p_source, v_cle, v_base);
  SELECT xp INTO v_apres FROM public.user_wallet WHERE user_id = p_user;
  IF COALESCE(v_apres, 0) <= COALESCE(v_avant, 0) THEN RETURN 0; END IF;

  UPDATE public.xp_activite_jour SET base = base + v_base
   WHERE user_id = p_user AND jour = v_today AND source = p_source;
  RETURN v_apres - v_avant;
END;
$$;

REVOKE ALL ON FUNCTION public.xp_activite_verser(UUID, TEXT, TEXT, INTEGER) FROM PUBLIC, anon, authenticated;

-- L'état du portefeuille, dans la forme que lit lib/wallet-server (WalletAward).
CREATE OR REPLACE FUNCTION public.wallet_etat(p_user UUID, p_awarded INTEGER, p_niveau_avant INTEGER, p_gemmes INTEGER)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'awarded', COALESCE(p_awarded, 0),
    'xp', COALESCE(w.xp, 0),
    'level', COALESCE(w.level, 1),
    'level_up', COALESCE(w.level, 1) > COALESCE(p_niveau_avant, COALESCE(w.level, 1)),
    'streak_days', COALESCE(w.streak_days, 0),
    'gems_gained', COALESCE(p_gemmes, 0))
  FROM (SELECT 1) AS un
  LEFT JOIN public.user_wallet w ON w.user_id = p_user;
$$;

REVOKE ALL ON FUNCTION public.wallet_etat(UUID, INTEGER, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;

-- ─────────────────────────────────────── 5. l'XP d'une activité (RPC)

-- Rend { awarded, xp, level, level_up, streak_days, gems_gained }. Fait aussi
-- avancer la série (wallet_touch) : finir une activité, c'est être actif.
-- Les épreuves (dictée, contrôle, examen blanc, annale) passent par
-- epreuve_recompenser, qui relit leur note en base.
CREATE OR REPLACE FUNCTION public.xp_activite(p_source TEXT, p_cle TEXT, p_points INTEGER, p_total INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_cle    TEXT := NULLIF(LEFT(COALESCE(p_cle, ''), 70), '');
  v_touch  JSONB;
  v_niveau INTEGER;
  v_verse  INTEGER := 0;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  IF p_source NOT IN ('quiz', 'revision', 'capsule', 'encyclo', 'flashcards', 'jeu',
                      'arene', 'defi_jour', 'duel', 'bienvenue') THEN
    RETURN public.wallet_etat(v_user, 0, NULL, 0);
  END IF;

  -- Les clés que le SERVEUR fixe : le client ne choisit pas la granularité.
  IF p_source = 'defi_jour' THEN v_cle := v_today::text; END IF;
  IF p_source = 'bienvenue' THEN v_cle := 'bienvenue'; END IF;
  IF v_cle IS NULL THEN RETURN public.wallet_etat(v_user, 0, NULL, 0); END IF;

  -- Une capsule ne paie que TERMINÉE (terminer_capsule, 366).
  IF p_source = 'capsule' AND NOT EXISTS (
       SELECT 1 FROM public.capsule_achats
        WHERE user_id = v_user AND capsule_id = v_cle AND terminee_le IS NOT NULL) THEN
    RETURN public.wallet_etat(v_user, 0, NULL, 0);
  END IF;

  PERFORM public.wallet_ensure(v_user);
  SELECT level INTO v_niveau FROM public.user_wallet WHERE user_id = v_user;
  v_touch := public.wallet_touch();
  v_verse := COALESCE((v_touch ->> 'awarded')::int, 0)
           + public.xp_activite_verser(v_user, p_source, v_cle,
                                       public.xp_activite_bareme(p_source, p_points, p_total));
  RETURN public.wallet_etat(v_user, v_verse, v_niveau, 0);
END;
$$;

REVOKE ALL ON FUNCTION public.xp_activite(TEXT, TEXT, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.xp_activite(TEXT, TEXT, INTEGER, INTEGER) TO authenticated;

-- ─────────────────────────────────────── 6. les épreuves (RPC)

-- Les annales qui existent (contenu/annales/*.json). MIROIR testé par
-- lib/economie.test.ts : une annale ajoutée au dépôt doit l'être ici, par une
-- migration suivante qui redéfinit cette fonction.
CREATE OR REPLACE FUNCTION public.annale_connue(p_annale TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT p_annale = ANY (ARRAY[
    'francais-2023-metropole',
    'francais-2024-asie',
    'francais-2025-asie',
    'francais-brevet-2025-metropole',
    'hggsp-2021-zero-1',
    'hggsp-2021-zero-2',
    'hggsp-2023-metropole-j2',
    'hggsp-2024-centres-etrangers-j1',
    'hggsp-2025-amerique-nord-j1',
    'histoire-geo-brevet-2025-metropole',
    'hlp-2023-metropole-j1',
    'hlp-2024-centres-etrangers-j1',
    'hlp-2025-amerique-nord-secours',
    'maths-2021-zero-1',
    'maths-2023-metropole-j1',
    'maths-2024-centres-etrangers-j1',
    'maths-2025-amerique-nord-j1',
    'maths-anticipee-2026-generale-sans-spe-metropole',
    'maths-anticipee-2026-generale-spe-metropole',
    'maths-anticipee-2026-techno-metropole',
    'maths-brevet-2025-metropole',
    'nsi-2023-metropole-j1',
    'nsi-2024-centres-etrangers-j1',
    'nsi-2025-asie-j1',
    'philosophie-2021-zero-1',
    'philosophie-2023-metropole',
    'philosophie-2024-amerique-nord',
    'philosophie-2025-amerique-nord',
    'physique-chimie-2023-metropole-j1',
    'physique-chimie-2024-polynesie-j2',
    'physique-chimie-2025-amerique-nord-j1',
    'physique-chimie-brevet-2025-metropole',
    'ses-2021-zero-1',
    'ses-2023-metropole-j1',
    'ses-2023-metropole-j2',
    'ses-2024-asie-j1',
    'ses-2025-asie-j2',
    'svt-2021-zero-1',
    'svt-2023-metropole-j1',
    'svt-2024-amerique-nord-j1',
    'svt-2025-amerique-nord-j1',
    'svt-brevet-2025-metropole'
  ]);
$$;

-- Ouvre une annale : le chrono des 15 minutes part de la PREMIÈRE ouverture.
CREATE OR REPLACE FUNCTION public.annale_commencer(p_annale TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL OR p_annale IS NULL OR NOT public.annale_connue(p_annale) THEN RETURN FALSE; END IF;
  INSERT INTO public.annales_travail (user_id, annale_id)
  VALUES (v_user, p_annale)
  ON CONFLICT (user_id, annale_id) DO NOTHING;
  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.annale_commencer(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.annale_commencer(TEXT) TO authenticated;

-- Récompense une épreuve finie, en relisant sa note EN BASE :
--   'dictee'       p_id = la tentative (dictee_attempts.id)
--   'controle'     p_id = la copie (chapter_exercice_reponses.id)
--   'examen_blanc' p_id = la session (exam_blanc_sessions.id)
--   'annale'       p_id = l'identifiant de l'annale (annales_travail)
-- Rend { awarded, xp, level, level_up, streak_days, gems_gained, raison? }.
-- Les gemmes se paient PAR PALIER (clé « type:objet:palier ») : passer de 16
-- à 19 sur la même dictée verse la différence, jamais deux fois le même palier.
CREATE OR REPLACE FUNCTION public.epreuve_recompenser(p_type TEXT, p_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_niveau  INTEGER;
  v_note    NUMERIC := 0;
  v_points  INTEGER := 0;
  v_total   INTEGER := 20;
  v_objet   TEXT;
  v_cle_xp  TEXT;
  v_cible   INTEGER := 0;
  v_deja    INTEGER;
  v_semaine INTEGER;
  v_gemmes  INTEGER := 0;
  v_xp      INTEGER := 0;
  v_touch   JSONB;
  v_lundi   TIMESTAMPTZ := date_trunc('week', now() AT TIME ZONE 'utc') AT TIME ZONE 'utc';
  v_support TEXT;
  v_debut   TIMESTAMPTZ;
BEGIN
  IF v_user IS NULL OR p_id IS NULL THEN RETURN NULL; END IF;

  IF p_type = 'dictee' THEN
    SELECT a.note, a.support, a.dictee_id::text INTO v_note, v_support, v_objet
      FROM public.dictee_attempts a
     WHERE a.id::text = p_id AND a.user_id = v_user;
    IF v_objet IS NULL THEN RETURN public.wallet_etat(v_user, 0, NULL, 0); END IF;
    v_points := floor(v_note)::int;
    v_cle_xp := p_id;
    -- Sur papier, l'élève se corrige lui-même : de l'XP, jamais de gemme.
    IF v_support = 'telephone' THEN
      SELECT public.epreuve_gemmes('dictee', MAX(a.note)) INTO v_cible
        FROM public.dictee_attempts a
       WHERE a.user_id = v_user AND a.dictee_id::text = v_objet AND a.support = 'telephone';
    END IF;

  ELSIF p_type = 'controle' THEN
    SELECT r.note * 20 / GREATEST(r.sur, 1), r.exercice_id::text INTO v_note, v_objet
      FROM public.chapter_exercice_reponses r
     WHERE r.id::text = p_id AND r.user_id = v_user;
    IF v_objet IS NULL THEN RETURN public.wallet_etat(v_user, 0, NULL, 0); END IF;
    v_points := floor(v_note)::int;
    v_cle_xp := p_id;
    SELECT public.epreuve_gemmes('controle', MAX(r.note * 20 / GREATEST(r.sur, 1))) INTO v_cible
      FROM public.chapter_exercice_reponses r
     WHERE r.user_id = v_user AND r.exercice_id::text = v_objet;

  ELSIF p_type = 'examen_blanc' THEN
    SELECT s.score, s.total INTO v_points, v_total
      FROM public.exam_blanc_sessions s
     WHERE s.id::text = p_id AND s.user_id = v_user
       AND s.created_at >= v_lundi;   -- une vieille session ne se resoumet pas chaque lundi
    IF v_total IS NULL OR v_total <= 0 THEN RETURN public.wallet_etat(v_user, 0, NULL, 0); END IF;
    v_note := 20.0 * v_points / v_total;
    v_cle_xp := p_id;
    -- Une fois par semaine, et seulement pour un vrai examen (≥ 20 questions).
    v_objet := to_char(now() AT TIME ZONE 'utc', 'IYYY-"W"IW');
    IF v_total >= 20 THEN v_cible := public.epreuve_gemmes('examen_blanc', v_note); END IF;

  ELSIF p_type = 'annale' THEN
    IF NOT public.annale_connue(p_id) THEN RETURN public.wallet_etat(v_user, 0, NULL, 0); END IF;
    SELECT commence_le INTO v_debut FROM public.annales_travail
     WHERE user_id = v_user AND annale_id = p_id FOR UPDATE;
    IF v_debut IS NULL THEN
      RETURN public.wallet_etat(v_user, 0, NULL, 0) || jsonb_build_object('raison', 'pas_commencee');
    END IF;
    IF now() < v_debut + interval '15 minutes' THEN
      RETURN public.wallet_etat(v_user, 0, NULL, 0)
          || jsonb_build_object('raison', 'trop_tot',
                                'minutes', CEIL(EXTRACT(EPOCH FROM (v_debut + interval '15 minutes' - now())) / 60));
    END IF;
    UPDATE public.annales_travail SET termine_le = COALESCE(termine_le, now())
     WHERE user_id = v_user AND annale_id = p_id;
    v_objet := p_id;
    v_cle_xp := p_id;
    v_cible := public.epreuve_gemmes('annale', 20);

  ELSE
    RETURN public.wallet_etat(v_user, 0, NULL, 0);
  END IF;

  -- Les verrous dans le même ordre que palier_gemmes_reclamer : le PROFIL,
  -- puis le PORTEFEUILLE — sinon deux appels simultanés s'interbloquent.
  PERFORM 1 FROM public.profiles WHERE id = v_user FOR UPDATE;
  PERFORM public.wallet_ensure(v_user);
  SELECT level INTO v_niveau FROM public.user_wallet WHERE user_id = v_user;
  v_touch := public.wallet_touch();

  -- L'XP de l'épreuve (dans son plafond du jour).
  v_xp := COALESCE((v_touch ->> 'awarded')::int, 0)
        + public.xp_activite_verser(v_user, p_type, v_cle_xp,
            CASE p_type
              WHEN 'annale' THEN public.xp_activite_bareme('annale', 0, 0)
              WHEN 'examen_blanc' THEN public.xp_activite_bareme('examen_blanc', v_points, v_total)
              ELSE public.xp_activite_bareme(p_type, v_points, 20)
            END);

  -- Les gemmes : ce qui manque pour atteindre le palier, dans le plafond de la semaine.
  IF COALESCE(v_cible, 0) > 0 THEN
    SELECT COALESCE(SUM(amount), 0) INTO v_deja FROM public.gem_events
     WHERE user_id = v_user AND source = 'epreuve'
       AND source_key LIKE p_type || ':' || v_objet || ':%';
    SELECT COALESCE(SUM(amount), 0) INTO v_semaine FROM public.gem_events
     WHERE user_id = v_user AND source = 'epreuve' AND created_at >= v_lundi;
    v_gemmes := GREATEST(0, LEAST(v_cible - v_deja,
                                  public.epreuve_gemmes_semaine_max() - v_semaine));
    IF v_gemmes > 0 THEN
      INSERT INTO public.gem_events (user_id, source, source_key, amount)
      VALUES (v_user, 'epreuve', LEFT(p_type || ':' || v_objet || ':' || v_cible, 80), v_gemmes)
      ON CONFLICT DO NOTHING;
      IF FOUND THEN
        UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_gemmes WHERE id = v_user;
      ELSE
        v_gemmes := 0;
      END IF;
    END IF;
  END IF;

  RETURN public.wallet_etat(v_user, v_xp, v_niveau, v_gemmes);
END;
$$;

REVOKE ALL ON FUNCTION public.epreuve_recompenser(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.epreuve_recompenser(TEXT, TEXT) TO authenticated;

-- ─────────────────────────────────────── 7. le portefeuille, sans gemmes faciles

-- 7a. wallet_grant_xp — copie de la 368, SANS les 15 gemmes du niveau franchi.
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
  v_amount    INTEGER;
BEGIN
  IF p_user IS NULL OR COALESCE(p_amount, 0) <= 0 THEN RETURN; END IF;

  PERFORM public.wallet_ensure(p_user);
  SELECT * INTO v_wallet FROM public.user_wallet
   WHERE user_id = p_user FOR UPDATE;

  -- Multiplicateur d'amis et potion (380).
  v_amount := public.xp_avec_bonus(p_user, p_amount);

  -- Trace (idempotente si clé, via xp_events_once_per_key) : déjà versé → stop.
  INSERT INTO public.xp_events (user_id, source, source_key, amount)
  VALUES (p_user, p_source, NULLIF(LEFT(COALESCE(p_key, ''), 80), ''), v_amount)
  ON CONFLICT DO NOTHING;
  IF NOT FOUND THEN RETURN; END IF;

  -- 557 · le niveau monte, et c'est tout : la fête et le coffre de palier
  -- (556) disent le passage, plus de gemmes à chaque niveau.
  v_new_level := public.wallet_level_from_xp(v_wallet.xp + v_amount);

  UPDATE public.user_wallet
     SET xp = xp + v_amount,
         level = GREATEST(level, v_new_level),
         updated_at = now()
   WHERE user_id = p_user;
END;
$$;

REVOKE ALL ON FUNCTION public.wallet_grant_xp(UUID, TEXT, TEXT, INTEGER)
  FROM PUBLIC, anon, authenticated;

-- 7b. wallet_touch — copie de la 368 : le palier de 7 jours verse 50 XP au
--     lieu de 20 gemmes. `awarded` dit l'XP de ce palier (0 sinon).
CREATE OR REPLACE FUNCTION public.wallet_touch()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_wallet public.user_wallet%ROWTYPE;
  v_new_streak INTEGER;
  v_avant  INTEGER;
  v_serie  INTEGER := 0;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  PERFORM public.wallet_ensure(v_user);
  SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user FOR UPDATE;

  IF public.serie_appliquer_gels(v_user, v_today) THEN
    SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user;
  END IF;

  IF v_wallet.last_activity_date = v_today THEN
    v_new_streak := v_wallet.streak_days;
  ELSIF v_wallet.last_activity_date = v_today - 1 THEN
    v_new_streak := v_wallet.streak_days + 1;
  ELSE
    v_new_streak := 1;
  END IF;

  UPDATE public.user_wallet
     SET streak_days = v_new_streak,
         last_activity_date = v_today,
         updated_at = now()
   WHERE user_id = v_user;

  -- 557 · le palier de série (7, 14, 21… jours) : 50 XP, une fois par jour.
  IF v_new_streak <> v_wallet.streak_days AND v_new_streak % 7 = 0 THEN
    v_avant := v_wallet.xp;
    PERFORM public.wallet_grant_xp(v_user, 'serie', v_today::text, 50);
    SELECT xp - v_avant INTO v_serie FROM public.user_wallet WHERE user_id = v_user;
  END IF;

  SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user;
  RETURN jsonb_build_object(
    'awarded', GREATEST(0, COALESCE(v_serie, 0)),
    'xp', v_wallet.xp,
    'level', v_wallet.level,
    'level_up', false,
    'streak_days', v_new_streak,
    'gems_gained', 0);
END;
$$;

-- 7c. wallet_award_xp — copie de la 368 : la leçon vaut 10, plus de gemmes de
--     niveau ni de série (le palier de 7 jours verse ses 50 XP par la même
--     primitive que wallet_touch).
CREATE OR REPLACE FUNCTION public.wallet_award_xp(
  p_source TEXT,
  p_key    TEXT DEFAULT NULL,
  p_amount INTEGER DEFAULT NULL   -- ignoré : gardé pour ne pas casser l'appel
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_amount INTEGER;
  v_key    TEXT := NULLIF(LEFT(COALESCE(p_key, ''), 80), '');
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_wallet public.user_wallet%ROWTYPE;
  v_new_streak INTEGER;
  v_new_level  INTEGER;
  v_avant  INTEGER;
  v_serie  INTEGER := 0;
  v_niv0   INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  IF v_key IS NULL THEN RETURN NULL; END IF;

  v_amount := CASE p_source
    WHEN 'lecon'     THEN 10
    WHEN 'carte'     THEN 5
    WHEN 'couronne1' THEN 30
    WHEN 'couronne2' THEN 40
    WHEN 'couronne3' THEN 60
    ELSE NULL
  END;

  IF v_amount IS NULL THEN
    PERFORM public.wallet_ensure(v_user);
    SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user;
    RETURN jsonb_build_object(
      'awarded', 0, 'xp', v_wallet.xp, 'level', v_wallet.level,
      'level_up', false, 'streak_days', v_wallet.streak_days, 'gems_gained', 0);
  END IF;

  PERFORM public.wallet_ensure(v_user);
  SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user FOR UPDATE;
  v_niv0 := v_wallet.level;

  v_amount := public.xp_avec_bonus(v_user, v_amount);

  INSERT INTO public.xp_events (user_id, source, source_key, amount)
  VALUES (v_user, p_source, v_key, v_amount)
  ON CONFLICT DO NOTHING;
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'awarded', 0, 'xp', v_wallet.xp, 'level', v_wallet.level,
      'level_up', false, 'streak_days', v_wallet.streak_days, 'gems_gained', 0);
  END IF;

  IF public.serie_appliquer_gels(v_user, v_today) THEN
    SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user;
  END IF;

  IF v_wallet.last_activity_date = v_today THEN
    v_new_streak := v_wallet.streak_days;
  ELSIF v_wallet.last_activity_date = v_today - 1 THEN
    v_new_streak := v_wallet.streak_days + 1;
  ELSE
    v_new_streak := 1;
  END IF;

  v_new_level := public.wallet_level_from_xp(v_wallet.xp + v_amount);

  UPDATE public.user_wallet
     SET xp = xp + v_amount,
         level = GREATEST(level, v_new_level),
         streak_days = v_new_streak,
         last_activity_date = v_today,
         updated_at = now()
   WHERE user_id = v_user;

  IF v_new_streak <> v_wallet.streak_days AND v_new_streak % 7 = 0 THEN
    SELECT xp INTO v_avant FROM public.user_wallet WHERE user_id = v_user;
    PERFORM public.wallet_grant_xp(v_user, 'serie', v_today::text, 50);
    SELECT xp - v_avant INTO v_serie FROM public.user_wallet WHERE user_id = v_user;
  END IF;

  SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user;
  RETURN jsonb_build_object(
    'awarded', v_amount + GREATEST(0, COALESCE(v_serie, 0)),
    'xp', v_wallet.xp,
    'level', v_wallet.level,
    'level_up', v_wallet.level > v_niv0,
    'streak_days', v_new_streak,
    'gems_gained', 0);
END;
$$;

-- 7d. wallet_award_gems — plus aucune gemme « de jeu » : le chapitre à trois
--     couronnes paie en XP (couronne3, 60), la victoire de défi, le filon et
--     les hauts faits n'avaient plus d'appelant. Gardée pour ne casser aucun
--     vieux client : elle rend 0.
CREATE OR REPLACE FUNCTION public.wallet_award_gems(p_source TEXT, p_key TEXT)
RETURNS INTEGER
LANGUAGE sql
STABLE
AS $$ SELECT 0 $$;

-- ─────────────────────────────────────── 8. niveaux, quêtes, clan

-- Le coffre de palier de niveau : 10 gemmes, 25 tous les 25 niveaux.
-- MIROIR de lib/niveaux.gemmesPalier.
CREATE OR REPLACE FUNCTION public.niveau_palier_gemmes(p_niveau INTEGER)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN p_niveau IS NULL OR p_niveau < 5 OR p_niveau % 5 <> 0 THEN 0
    WHEN p_niveau % 25 = 0 THEN 25
    ELSE 10
  END;
$$;

-- Les quêtes paient en XP seulement. MIROIR de lib/quests.QUEST_CATALOG.
CREATE OR REPLACE FUNCTION public.quest_catalog()
RETURNS TABLE (id TEXT, goal INTEGER, xp INTEGER, gems INTEGER)
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT * FROM (VALUES
    -- Les trois gestes (03/10/2026) — MIROIR de lib/quests.QUEST_CATALOG.
    ('lecon1',     1,  30,  0),
    ('lecon2',     2,  50,  0),
    ('quiz1',      1,  30,  0),
    ('quiz80',     1,  40,  0),
    ('correct20',  20, 40,  0),
    ('exercice1',  1,  50,  0),
    ('duel1',      1,  30,  0),
    ('win1',       1,  40,  0),
    ('partie2',    2,  30,  0),
    -- Les anciennes quêtes, gardées pour payer une journée commencée avant 555.
    ('correct10',  10, 30,  0),
    ('revision5',  5,  30,  0),
    ('combo3',     3,  30,  0),
    ('duel3',      3,  60,  0),
    ('correct25',  25, 60,  0),
    ('prepa1',     1,  60,  0),
    ('revision15', 15, 60,  0),
    ('win3',       3,  120, 0),
    ('combo8',     8,  120, 0),
    ('chapter2',   2,  120, 0),
    ('correct50',  50, 120, 0)
  ) AS c(id, goal, xp, gems);
$$;

-- quest_claim — copie de la 209 : la journée complète vaut 100 XP sans
-- gemme, et l'XP rendue est celle RÉELLEMENT versée (multiplicateur compris).
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
  v_xp       INTEGER := 0;
  v_asked    INTEGER;
  v_finished INTEGER := 0;
  v_all      BOOLEAN := FALSE;
  v_avant    INTEGER;
  v_verse    INTEGER;
  v_none     JSONB := jsonb_build_object('claimed', FALSE, 'gems', 0, 'xp', 0,
                                         'all_done', FALSE);
BEGIN
  IF v_user IS NULL OR p_quest_ids IS NULL THEN RETURN v_none; END IF;
  v_asked := array_length(p_quest_ids, 1);
  IF v_asked IS NULL OR v_asked > 3 THEN RETURN v_none; END IF;

  SELECT progress INTO v_progress
    FROM public.daily_quests WHERE user_id = v_user AND day_key = v_today;
  IF v_progress IS NULL THEN RETURN v_none; END IF;

  WITH gagnees AS (
    SELECT c.id, c.xp
      FROM public.quest_catalog() c
     WHERE c.id = ANY (p_quest_ids)
       AND COALESCE((v_progress ->> c.id)::int, 0) >= c.goal
  ), payees AS (
    INSERT INTO public.daily_quest_claims (user_id, day_key, quest_id, gems, xp)
    SELECT v_user, v_today, id, 0, xp FROM gagnees
    ON CONFLICT (user_id, day_key, quest_id) DO NOTHING
    RETURNING xp
  )
  SELECT COALESCE(SUM(xp), 0), (SELECT count(*) FROM gagnees)
    INTO v_xp, v_finished
    FROM payees;

  -- Bonus de journée complète (MIROIR de ALL_DONE_XP) : 100 XP, plus de gemme.
  v_all := (v_finished = 3 AND v_asked = 3);
  IF v_all THEN
    INSERT INTO public.daily_quest_claims (user_id, day_key, quest_id, gems, xp)
    VALUES (v_user, v_today, '__jour__', 0, 100)
    ON CONFLICT (user_id, day_key, quest_id) DO NOTHING;
    IF FOUND THEN v_xp := v_xp + 100; END IF;
  END IF;

  IF v_xp = 0 THEN RETURN v_none; END IF;

  PERFORM public.wallet_ensure(v_user);
  SELECT xp INTO v_avant FROM public.user_wallet WHERE user_id = v_user;
  PERFORM public.wallet_grant_xp(v_user, 'quests', NULL, v_xp);
  SELECT xp - COALESCE(v_avant, 0) INTO v_verse FROM public.user_wallet WHERE user_id = v_user;

  RETURN jsonb_build_object('claimed', TRUE, 'gems', 0, 'xp', GREATEST(COALESCE(v_verse, 0), 0),
                            'all_done', v_all);
END;
$$;

REVOKE ALL ON FUNCTION public.quest_claim(TEXT[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.quest_claim(TEXT[]) TO authenticated;

-- clan_week_claim — copie de la 209 : l'XP seule, plus de gemmes.
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
  IF v_week >= public.clan_week_key(v_today) THEN RETURN v_none; END IF;

  SELECT points, school_id INTO v_mine, v_school
    FROM public.clan_week_contributions
   WHERE user_id = v_user AND week_key = v_week;
  IF v_mine IS NULL OR v_mine < 50 OR v_school IS NULL THEN RETURN v_none; END IF;

  SELECT rank INTO v_rank FROM (
    SELECT school_id,
           ROW_NUMBER() OVER (ORDER BY SUM(points) DESC, school_id) AS rank
      FROM public.clan_week_contributions
     WHERE week_key = v_week AND school_id IS NOT NULL
     GROUP BY school_id
  ) t WHERE school_id = v_school;
  IF v_rank IS NULL THEN RETURN v_none; END IF;

  IF    v_rank = 1  THEN v_tier := 'or';            v_gems := 0; v_xp := 300;
  ELSIF v_rank <= 3 THEN v_tier := 'argent';        v_gems := 0; v_xp := 200;
  ELSIF v_rank <= 10 THEN v_tier := 'bronze';       v_gems := 0; v_xp := 120;
  ELSE                   v_tier := 'participation'; v_gems := 0; v_xp := 60;
  END IF;

  INSERT INTO public.clan_week_claims (user_id, week_key, tier, gems, xp)
  VALUES (v_user, v_week, v_tier, v_gems, v_xp)
  ON CONFLICT (user_id, week_key) DO NOTHING;
  IF NOT FOUND THEN RETURN v_none; END IF;

  PERFORM public.wallet_grant_xp(v_user, 'clan_week', v_week::text, v_xp);

  RETURN jsonb_build_object('claimed', TRUE, 'tier', v_tier, 'gems', v_gems, 'xp', v_xp);
END;
$$;

REVOKE ALL ON FUNCTION public.clan_week_claim(DATE) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.clan_week_claim(DATE) TO authenticated;

-- ─────────────────────────────────────── 9. jeux, ligue, coffre, Traque, cahier

-- palier_gemmes_reclamer — copie de la 373 : chaque étoile neuve verse
-- 5 × N XP (palier N) au lieu de N gemmes. Les étoiles déjà payées en gemmes
-- (palier_gemmes.etoiles) ne paient plus rien. Rend aussi 'xp'.
CREATE OR REPLACE FUNCTION public.palier_gemmes_reclamer(p_game_id TEXT, p_etoiles INTEGER[])
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_palier  INTEGER;
  v_voulu   INTEGER;
  v_deja    INTEGER;
  v_etoile  INTEGER;
  v_avant   INTEGER;
  v_apres   INTEGER;
  v_solde   INTEGER;
  v_payees  INTEGER[] := ARRAY[0, 0, 0, 0, 0];
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;
  IF p_game_id IS NULL OR p_game_id = 'programme' OR NOT EXISTS (
       SELECT 1 FROM public.game_catalog WHERE game_id = p_game_id
     ) THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'inconnu');
  END IF;
  IF p_etoiles IS NULL OR COALESCE(array_length(p_etoiles, 1), 0) <> 5 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'invalide');
  END IF;

  SELECT gems INTO v_solde FROM public.profiles WHERE id = v_user FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;

  PERFORM public.wallet_ensure(v_user);
  SELECT xp INTO v_avant FROM public.user_wallet WHERE user_id = v_user;

  FOR v_palier IN 1..5 LOOP
    v_voulu := LEAST(3, GREATEST(0, COALESCE(p_etoiles[v_palier], 0)));
    SELECT etoiles INTO v_deja FROM public.palier_gemmes
     WHERE user_id = v_user AND game_id = p_game_id AND palier = v_palier;
    v_deja := COALESCE(v_deja, 0);

    IF v_voulu > v_deja THEN
      FOR v_etoile IN (v_deja + 1)..v_voulu LOOP
        -- Palier N → 5 × N XP par étoile (miroir de xpEtoilePalier).
        PERFORM public.wallet_grant_xp(v_user, 'palier',
          p_game_id || ':' || v_palier || ':' || v_etoile, 5 * v_palier);
      END LOOP;
      INSERT INTO public.palier_gemmes AS p (user_id, game_id, palier, etoiles, gemmes, maj_le)
      VALUES (v_user, p_game_id, v_palier, v_voulu, 0, now())
      ON CONFLICT (user_id, game_id, palier) DO UPDATE
        SET etoiles = GREATEST(p.etoiles, EXCLUDED.etoiles),
            maj_le  = now();
    END IF;

    v_payees[v_palier] := GREATEST(v_voulu, v_deja);
  END LOOP;

  SELECT xp INTO v_apres FROM public.user_wallet WHERE user_id = v_user;
  RETURN jsonb_build_object('ok', true, 'gemmes', 0,
                            'xp', GREATEST(0, COALESCE(v_apres, 0) - COALESCE(v_avant, 0)),
                            'solde', COALESCE(v_solde, 0),
                            'etoiles', to_jsonb(v_payees));
END;
$$;

REVOKE ALL ON FUNCTION public.palier_gemmes_reclamer(TEXT, INTEGER[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.palier_gemmes_reclamer(TEXT, INTEGER[]) TO authenticated;

-- La ligue : seul un NOUVEAU RANG (Bronze → Argent…) rapporte, 10 gemmes.
-- MIROIR de lib/ligue.gemmesFinDeSemaine.
CREATE OR REPLACE FUNCTION public.ligue_gemmes(p_avant INTEGER, p_apres INTEGER, p_rang INTEGER, p_xp INTEGER)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN COALESCE(p_xp, 0) <= 0 THEN 0
    WHEN p_apres > p_avant AND p_apres / 4 <> p_avant / 4 THEN 10
    ELSE 0
  END;
$$;

REVOKE ALL ON FUNCTION public.ligue_gemmes(INTEGER, INTEGER, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;

-- Le coffre d'équipe rend de l'XP, plus de gemmes. MIROIR de COFFRE_NIVEAUX.
CREATE OR REPLACE FUNCTION public.ligue_coffre_niveaux()
RETURNS TABLE (niveau INTEGER, seuil INTEGER, xp INTEGER, gemmes INTEGER)
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  VALUES (1,  100,  100, 0),
         (2,  250,  250, 0),
         (3,  450,  450, 0),
         (4,  700,  700, 0),
         (5, 1000, 1000, 0);
$$;

-- Les coffres déjà enregistrés et pas encore ouverts suivent la règle neuve.
UPDATE public.coffres_equipe SET gemmes = 0 WHERE ouvert_le IS NULL AND gemmes <> 0;

-- traque_victoire — copie de la 213 : la victoire verse de l'XP (30/45/60,
-- Nox 90, ×2 en chasse — miroir de xpTraque), plus de gemmes ni de plafond
-- hebdomadaire de gemmes. Rend 'gems' = 0 et 'xp'.
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
  v_avant  INTEGER;
  v_paid   INTEGER := 0;
  v_key    TEXT;
  v_none   JSONB := jsonb_build_object('won', FALSE, 'gems', 0, 'xp', 0, 'rank', 1,
                                       'victories', 0, 'capped', FALSE);
BEGIN
  IF v_user IS NULL OR v_boss IS NULL THEN RETURN v_none; END IF;

  SELECT * INTO v_row FROM public.boss_gauges
   WHERE user_id = v_user AND boss_id = v_boss FOR UPDATE;
  IF NOT FOUND OR v_row.debusque_at IS NULL THEN RETURN v_none; END IF;
  IF now() >= v_row.debusque_at + public.traque_fenetre() THEN
    UPDATE public.boss_gauges
       SET points = public.traque_apres_defaite(), debusque_at = NULL,
           attempts = 0, updated_at = now()
     WHERE user_id = v_user AND boss_id = v_boss;
    RETURN v_none;
  END IF;

  v_rank := LEAST(1 + v_row.victories, 3);
  v_amount := CASE v_rank WHEN 1 THEN 30 WHEN 2 THEN 45 ELSE 60 END;
  IF v_boss = 'nox' THEN
    v_amount := 90;
  ELSIF public.traque_en_chasse(v_boss, v_today) THEN
    v_amount := v_amount * 2;
  END IF;

  v_key := v_boss || ':' || to_char(v_row.debusque_at AT TIME ZONE 'utc',
                                    'YYYY-MM-DD"T"HH24:MI:SS');
  PERFORM public.wallet_ensure(v_user);
  SELECT xp INTO v_avant FROM public.user_wallet WHERE user_id = v_user;
  PERFORM public.wallet_grant_xp(v_user, 'traque', v_key, v_amount);
  SELECT xp - COALESCE(v_avant, 0) INTO v_paid FROM public.user_wallet WHERE user_id = v_user;

  UPDATE public.boss_gauges
     SET victories = victories + 1, points = 0, debusque_at = NULL,
         attempts = 0, updated_at = now()
   WHERE user_id = v_user AND boss_id = v_boss
   RETURNING * INTO v_row;

  RETURN jsonb_build_object(
    'won',       TRUE,
    'gems',      0,
    'xp',        GREATEST(0, COALESCE(v_paid, 0)),
    'rank',      LEAST(v_row.victories + 1, 3),
    'victories', v_row.victories,
    'capped',    FALSE
  );
END;
$$;

REVOKE ALL ON FUNCTION public.traque_victoire(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.traque_victoire(TEXT) TO authenticated;

-- Le GEL DE SÉRIE revient au Marché (04/10/2026, « achetable et cumulable
-- autant que Duolingo » : deux en réserve, le CHECK de la 368). Il coûtait 60
-- gemmes quand les gemmes tombaient partout ; 20 désormais, le prix du Boost
-- XP. MIROIR de lib/boutique/offres.OFFRES.
INSERT INTO public.boutique_offres (id, kind, prix_gemmes, valeur)
VALUES ('gel-serie','gel_serie',20,1)
ON CONFLICT (id) DO UPDATE SET prix_gemmes = EXCLUDED.prix_gemmes, valeur = EXCLUDED.valeur;

-- Le cahier d'exercices : seul l'exercice ★★★ garde ses gemmes (5).
-- MIROIR de lib/economie.gemmesExerciceCahier.
UPDATE public.exercices
   SET gemmes = CASE WHEN etoiles >= 3 THEN 5 ELSE 0 END
 WHERE gemmes <> CASE WHEN etoiles >= 3 THEN 5 ELSE 0 END;

-- Contrôle ---------------------------------------------------------------------
-- `fonctions` DOIT valoir 7 ; `tables` 2 ; les deux sources : true.
SELECT
  (SELECT count(*) FROM pg_proc WHERE pronamespace = 'public'::regnamespace
     AND proname IN ('xp_activite', 'xp_activite_verser', 'xp_activite_bareme',
                     'epreuve_recompenser', 'annale_commencer', 'wallet_etat',
                     'annale_connue')) AS fonctions,
  (SELECT count(*) FROM pg_tables WHERE schemaname = 'public'
     AND tablename IN ('xp_activite_jour', 'annales_travail')) AS tables,
  (SELECT pg_get_constraintdef(oid) ~ '\mbienvenue\M' FROM pg_constraint
    WHERE conname = 'xp_events_source_check') AS source_xp,
  (SELECT pg_get_constraintdef(oid) ~ '\mepreuve\M' FROM pg_constraint
    WHERE conname = 'gem_events_source_check') AS source_gemmes;
