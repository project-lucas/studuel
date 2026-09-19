-- =============================================================================
-- 372 — LE CAHIER D'EXERCICES (Lucas, 18/09/2026)
--
-- « Ce n'est pas un quiz mais la résolution d'un problème : un schéma, un
-- document, une analyse de texte avec des questions dessous, l'interprétation
-- d'un graphique, une carte de France […] par palier de difficulté — une,
-- deux, trois étoiles —, débloqués au fur et à mesure, avec des récompenses en
-- gemmes car plus difficiles. »
--
-- Chaque chapitre porte TROIS exercices faits comme une page de manuel : une
-- mise en situation, des documents (carte, graphique, texte, schéma, frise…),
-- des questions dessous. L'exercice 1 (★) ne fait peur à personne, le 3 (★★★)
-- fait croiser les documents. Le 2 s'ouvre quand le 1 est réussi, le 3 quand
-- le 2 l'est.
--
-- LE SERVEUR EST SEUL JUGE. Les réponses ne quittent jamais la base : elles
-- vivent dans `exercices_cles`, qu'aucun rôle de l'API ne lit. L'élève envoie
-- sa réponse question par question (`exercice_verifier`), le serveur la juge,
-- compte les essais (deux par question : 2 points du premier coup, 1 au
-- second), et ne livre la correction qu'une fois la question finie.
-- `exercice_terminer` fait le bilan : réussi à la moitié des points, il ouvre
-- l'exercice suivant et verse, UNE fois par exercice, les gemmes de ses
-- étoiles (5 · 10 · 15, réglables dans la table) et un peu d'XP.
--
-- Les règles pures et leurs tests : lib/exercices/ (juger.ts, normaliser.ts,
-- progression.ts). `exercice_juger` et `exercice_normaliser` en sont les
-- MIROIRS : toute évolution touche les deux.
--
-- Réservé à Studuel+, comme l'exercice de chapitre qu'il remplace à l'écran
-- (le contrôle blanc de la 360 reste, en dernière marche du cahier).
--
-- Tables :
--   exercices            le contenu public (documents, questions sans réponse)
--   exercices_cles       les réponses et explications — AUCUNE policy
--   exercice_passages    un essai d'exercice : l'état de chaque question
--   exercice_resultats   le meilleur passage d'un élève, et ses gemmes
--
-- Le contenu arrive par les migrations 373 et suivantes (générées par
-- scripts/exercices-sql.ts depuis contenu/exercices/).
--
-- PRÉREQUIS : 192, 209, 348 et 368 (portefeuille, gem_events, xp_events,
-- wallet_grant_xp, gemmes_avec_bonus). Idempotente.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ─────────────────────────────────────────────────────────── 1. les tables

CREATE TABLE IF NOT EXISTS public.exercices (
  id            UUID PRIMARY KEY,
  chapter_id    UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  position      SMALLINT NOT NULL CHECK (position BETWEEN 1 AND 9),
  etoiles       SMALLINT NOT NULL CHECK (etoiles BETWEEN 1 AND 3),
  gemmes        INTEGER NOT NULL CHECK (gemmes >= 0),
  xp            INTEGER NOT NULL CHECK (xp >= 0),
  nb_questions  SMALLINT NOT NULL CHECK (nb_questions BETWEEN 1 AND 12),
  -- { titre, competence, situation, documents:[…], questions:[…] } SANS réponse
  contenu       JSONB NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS exercices_chapitre_position_idx
  ON public.exercices (chapter_id, position);

ALTER TABLE public.exercices ENABLE ROW LEVEL SECURITY;

-- Le contenu public se lit comme un cours : toute personne connectée. Rien ne
-- s'écrit par l'API — le catalogue vient des seeds (rôle postgres).
DROP POLICY IF EXISTS "exercices_select" ON public.exercices;
CREATE POLICY "exercices_select" ON public.exercices
  FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.exercices_cles (
  exercice_id  UUID PRIMARY KEY REFERENCES public.exercices(id) ON DELETE CASCADE,
  -- [{ cle:{type,…}, affichage?, explication }, …] dans l'ordre des questions
  cles         JSONB NOT NULL
);

-- RLS SANS AUCUNE POLICY, et plus aucun privilège : seules les fonctions
-- SECURITY DEFINER ci-dessous (propriétaire postgres) lisent les réponses.
ALTER TABLE public.exercices_cles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.exercices_cles FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS public.exercice_passages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercice_id  UUID NOT NULL REFERENCES public.exercices(id) ON DELETE CASCADE,
  -- [{ "essais": 0, "juste": false }, …] une entrée par question
  etats        JSONB NOT NULL,
  score        SMALLINT,
  max          SMALLINT,
  termine_le   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS exercice_passages_user_idx
  ON public.exercice_passages (user_id, exercice_id, created_at DESC);

ALTER TABLE public.exercice_passages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "exercice_passages_select_own" ON public.exercice_passages;
CREATE POLICY "exercice_passages_select_own" ON public.exercice_passages
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

CREATE TABLE IF NOT EXISTS public.exercice_resultats (
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercice_id        UUID NOT NULL REFERENCES public.exercices(id) ON DELETE CASCADE,
  -- Redondant avec exercices.chapter_id : c'est la clé de lecture de l'écran
  -- (un élève, un chapitre).
  chapter_id         UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  meilleur_score     SMALLINT NOT NULL,
  max                SMALLINT NOT NULL,
  reussi             BOOLEAN NOT NULL DEFAULT false,
  parfait            BOOLEAN NOT NULL DEFAULT false,
  passages           INTEGER NOT NULL DEFAULT 0,
  gemmes_versees     INTEGER NOT NULL DEFAULT 0,
  premiere_reussite  TIMESTAMPTZ,
  maj_le             TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, exercice_id)
);

CREATE INDEX IF NOT EXISTS exercice_resultats_chapitre_idx
  ON public.exercice_resultats (user_id, chapter_id);

ALTER TABLE public.exercice_resultats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "exercice_resultats_select_own" ON public.exercice_resultats;
CREATE POLICY "exercice_resultats_select_own" ON public.exercice_resultats
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

-- ───────────────────────────────── 2. les sources de gemmes et d'XP acceptées
-- On AJOUTE 'exercice' aux sources déjà permises, quelles qu'elles soient en
-- production : la liste est relue dans la contrainte existante plutôt que
-- recopiée d'une migration (une source oubliée ferait échouer l'ALTER sur les
-- lignes qui la portent).

DO $$
DECLARE
  v_table   TEXT;
  v_nom     TEXT;
  v_def     TEXT;
  v_sources TEXT[];
BEGIN
  FOREACH v_table IN ARRAY ARRAY['xp_events', 'gem_events'] LOOP
    v_nom := v_table || '_source_check';
    SELECT pg_get_constraintdef(c.oid) INTO v_def
      FROM pg_constraint c
     WHERE c.conname = v_nom AND c.conrelid = ('public.' || v_table)::regclass;
    IF v_def IS NOT NULL AND v_def !~ '\mexercice\M' THEN
      -- Les littéraux de la contrainte, qu'elle s'écrive ARRAY['a'::text, …]
      -- ou '{a,b}'::text[] : on déplie les deux formes.
      SELECT array_agg(DISTINCT btrim(s)) INTO v_sources
        FROM regexp_matches(v_def, '''([^'']+)''', 'g') AS m,
             LATERAL unnest(string_to_array(btrim(m[1], '{}'), ',')) AS s
       WHERE btrim(s) <> '';
      v_sources := array_append(COALESCE(v_sources, ARRAY[]::TEXT[]), 'exercice');
      EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT %I', v_table, v_nom);
      EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I CHECK (source IN (%s))',
                     v_table, v_nom,
                     (SELECT string_agg(quote_literal(x), ', ' ORDER BY x) FROM unnest(v_sources) x));
    END IF;
  END LOOP;
END $$;

-- ─────────────────────────────────────── 3. la normalisation (miroir TS)
-- lib/exercices/normaliser.ts : ligatures, accents (MÊME table), minuscules,
-- tout ce qui n'est ni lettre ni chiffre → espace, espaces resserrés.

CREATE OR REPLACE FUNCTION public.exercice_normaliser(p_texte TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT btrim(regexp_replace(
           lower(translate(
             replace(replace(replace(replace(replace(COALESCE(p_texte, ''),
               'œ', 'oe'), 'Œ', 'oe'), 'æ', 'ae'), 'Æ', 'ae'), 'ß', 'ss'),
             'àáâãäåèéêëìíîïòóôõöùúûüýÿçñÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝŸÇÑ',
             'aaaaaaeeeeiiiiooooouuuuyycnaaaaaaeeeeiiiiooooouuuuyycn')),
           '[^a-z0-9]+', ' ', 'g'))
$$;

REVOKE ALL ON FUNCTION public.exercice_normaliser(TEXT) FROM PUBLIC, anon, authenticated;

-- ─────────────────────────────────────────── 4. le jugement (miroir TS)
-- lib/exercices/juger.ts. Rend {juste, bons, total}. Tout-ou-rien, mais
-- `bons/total` dit combien d'éléments d'une réponse composée sont justes.

CREATE OR REPLACE FUNCTION public.exercice_juger(p_cle JSONB, p_reponse JSONB)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v_type    TEXT := p_cle->>'type';
  v_rep     JSONB := COALESCE(p_reponse, '{}'::jsonb);
  v_att     TEXT[];
  v_don     TEXT[];
  v_bons    INTEGER := 0;
  v_total   INTEGER := 0;
  v_juste   BOOLEAN := false;
  v_val     NUMERIC;
  v_txt     TEXT;
  v_k       TEXT;
  v_obj     JSONB;
  v_i       INTEGER;
BEGIN
  IF jsonb_typeof(v_rep) <> 'object' THEN v_rep := '{}'::jsonb; END IF;

  IF v_type IN ('choix', 'zone', 'ordre') THEN
    v_att := ARRAY(SELECT jsonb_array_elements_text(p_cle->'ids'));
    v_total := COALESCE(array_length(v_att, 1), 0);
    IF jsonb_typeof(v_rep->'ids') = 'array' THEN
      v_don := ARRAY(SELECT e #>> '{}' FROM jsonb_array_elements(v_rep->'ids') e
                      WHERE jsonb_typeof(e) = 'string');
    ELSE
      v_don := ARRAY[]::TEXT[];
    END IF;
    IF v_type = 'ordre' THEN
      FOR v_i IN 1 .. v_total LOOP
        IF v_don[v_i] IS NOT DISTINCT FROM v_att[v_i] THEN v_bons := v_bons + 1; END IF;
      END LOOP;
      v_juste := COALESCE(array_length(v_don, 1), 0) = v_total AND v_bons = v_total;
    ELSE
      v_don := ARRAY(SELECT DISTINCT unnest(v_don));
      v_bons := (SELECT count(*) FROM unnest(v_don) d WHERE d = ANY (v_att));
      v_juste := v_bons = v_total AND COALESCE(array_length(v_don, 1), 0) = v_total;
    END IF;

  ELSIF v_type = 'nombre' THEN
    v_total := 1;
    IF jsonb_typeof(v_rep->'valeur') = 'number' THEN
      v_val := (v_rep->>'valeur')::numeric;
      v_juste := abs(v_val - (p_cle->>'valeur')::numeric)
                 <= (p_cle->>'tolerance')::numeric + 0.000000001;
    END IF;
    v_bons := CASE WHEN v_juste THEN 1 ELSE 0 END;

  ELSIF v_type = 'texte' THEN
    v_total := 1;
    IF jsonb_typeof(v_rep->'texte') = 'string' THEN
      v_txt := public.exercice_normaliser(v_rep->>'texte');
      v_juste := v_txt <> '' AND v_txt IN (SELECT jsonb_array_elements_text(p_cle->'acceptes'));
    END IF;
    v_bons := CASE WHEN v_juste THEN 1 ELSE 0 END;

  ELSIF v_type IN ('association', 'categories') THEN
    v_obj := CASE WHEN v_type = 'association' THEN p_cle->'paires' ELSE p_cle->'items' END;
    FOR v_k IN SELECT jsonb_object_keys(v_obj) LOOP
      v_total := v_total + 1;
      IF jsonb_typeof(v_rep->(CASE WHEN v_type = 'association' THEN 'paires' ELSE 'items' END)->v_k) = 'string'
         AND v_rep->(CASE WHEN v_type = 'association' THEN 'paires' ELSE 'items' END)->>v_k = v_obj->>v_k THEN
        v_bons := v_bons + 1;
      END IF;
    END LOOP;
    v_juste := v_bons = v_total;

  ELSIF v_type = 'trous' THEN
    v_total := jsonb_array_length(p_cle->'trous');
    FOR v_i IN 0 .. v_total - 1 LOOP
      IF jsonb_typeof(v_rep->'trous') = 'array' AND jsonb_typeof(v_rep->'trous'->v_i) = 'string' THEN
        v_txt := public.exercice_normaliser(v_rep->'trous'->>v_i);
        IF v_txt <> '' AND v_txt IN (SELECT jsonb_array_elements_text(p_cle->'trous'->v_i)) THEN
          v_bons := v_bons + 1;
        END IF;
      END IF;
    END LOOP;
    v_juste := v_bons = v_total;
  END IF;

  RETURN jsonb_build_object('juste', v_juste, 'bons', v_bons, 'total', v_total);
END;
$$;

REVOKE ALL ON FUNCTION public.exercice_juger(JSONB, JSONB) FROM PUBLIC, anon, authenticated;

-- ──────────────────────────────────────────── 5. commencer un exercice
-- Vérifie l'abonnement et le déblocage (miroir de lib/exercices/progression :
-- le 1 est ouvert, chaque suivant s'ouvre quand le précédent est réussi),
-- puis ouvre un passage neuf.

CREATE OR REPLACE FUNCTION public.exercice_commencer(p_exercice UUID)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_ex       public.exercices%ROWTYPE;
  v_tier     TEXT;
  v_ouvert     BOOLEAN;
  v_precedent  UUID;
  v_passage    UUID;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('ok', false, 'raison', 'auth'); END IF;

  SELECT * INTO v_ex FROM public.exercices WHERE id = p_exercice;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'raison', 'introuvable'); END IF;

  SELECT subscription_tier INTO v_tier FROM public.profiles WHERE id = v_user;
  IF COALESCE(v_tier, '') NOT IN ('tier1', 'tier2', 'tier3') AND NOT COALESCE(public.is_admin(), false) THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'premium');
  END IF;

  -- Déblocage : ouvert s'il n'a pas de précédent dans le chapitre, ou si ce
  -- précédent est réussi. Un exercice déjà réussi reste ouvert, quoi qu'il
  -- arrive au précédent.
  SELECT id INTO v_precedent FROM public.exercices
   WHERE chapter_id = v_ex.chapter_id AND position < v_ex.position
   ORDER BY position DESC
   LIMIT 1;
  v_ouvert := v_precedent IS NULL
    OR EXISTS (SELECT 1 FROM public.exercice_resultats r
                WHERE r.user_id = v_user AND r.exercice_id IN (v_precedent, v_ex.id) AND r.reussi);
  IF NOT v_ouvert THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'verrouille');
  END IF;

  -- Un plafond large (un élève réel en fait quelques dizaines par jour) : il
  -- n'est là que pour qu'un script ne remplisse pas la table de passages vides.
  IF (SELECT count(*) FROM public.exercice_passages
       WHERE user_id = v_user AND created_at > now() - interval '1 day') >= 300 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'quota');
  END IF;

  INSERT INTO public.exercice_passages (user_id, exercice_id, etats)
  VALUES (v_user, v_ex.id,
          (SELECT jsonb_agg(jsonb_build_object('essais', 0, 'juste', false))
             FROM generate_series(1, v_ex.nb_questions)))
  RETURNING id INTO v_passage;

  RETURN jsonb_build_object('ok', true, 'passage', v_passage);
END;
$$;

REVOKE ALL ON FUNCTION public.exercice_commencer(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.exercice_commencer(UUID) TO authenticated;

-- ─────────────────────────────────────────── 6. vérifier une réponse
-- Deux essais par question. La correction (clé + explication) ne part qu'une
-- fois la question FINIE : juste, ou deux essais faux. Une réponse envoyée à
-- une question finie ne change rien (double tap, réseau qui rejoue).

CREATE OR REPLACE FUNCTION public.exercice_verifier(p_passage UUID, p_question INTEGER, p_reponse JSONB)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_passage  public.exercice_passages%ROWTYPE;
  v_cles     JSONB;
  v_cle      JSONB;
  v_etat     JSONB;
  v_essais   INTEGER;
  v_juste    BOOLEAN;
  v_verdict  JSONB := jsonb_build_object('juste', false, 'bons', 0, 'total', 0);
  v_fini     BOOLEAN;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('ok', false, 'raison', 'auth'); END IF;
  -- Une réponse d'élève tient en quelques centaines d'octets ; au-delà, c'est
  -- un appel direct qui cherche à faire travailler le juge pour rien.
  IF length(COALESCE(p_reponse::text, '')) > 8000 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'introuvable');
  END IF;

  SELECT * INTO v_passage FROM public.exercice_passages
   WHERE id = p_passage AND user_id = v_user
   FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'raison', 'introuvable'); END IF;
  IF v_passage.termine_le IS NOT NULL THEN RETURN jsonb_build_object('ok', false, 'raison', 'termine'); END IF;

  IF p_question IS NULL OR p_question < 0 OR p_question >= jsonb_array_length(v_passage.etats) THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'introuvable');
  END IF;

  SELECT cles INTO v_cles FROM public.exercices_cles WHERE exercice_id = v_passage.exercice_id;
  v_cle := v_cles->p_question;
  IF v_cle IS NULL THEN RETURN jsonb_build_object('ok', false, 'raison', 'introuvable'); END IF;

  v_etat := v_passage.etats->p_question;
  v_essais := COALESCE((v_etat->>'essais')::int, 0);
  v_juste := COALESCE((v_etat->>'juste')::boolean, false);

  IF NOT v_juste AND v_essais < 2 THEN
    v_verdict := public.exercice_juger(v_cle->'cle', p_reponse);
    v_essais := v_essais + 1;
    v_juste := (v_verdict->>'juste')::boolean;
    UPDATE public.exercice_passages
       SET etats = jsonb_set(etats, ARRAY[p_question::text],
                             jsonb_build_object('essais', v_essais, 'juste', v_juste))
     WHERE id = v_passage.id;
  ELSE
    v_verdict := jsonb_build_object('juste', v_juste, 'bons', 0, 'total', 0);
  END IF;

  v_fini := v_juste OR v_essais >= 2;

  RETURN jsonb_build_object(
    'ok', true,
    'juste', v_juste,
    'essais', v_essais,
    'fini', v_fini,
    'bons', (v_verdict->>'bons')::int,
    'total', (v_verdict->>'total')::int,
    'correction', CASE WHEN v_fini THEN
                    jsonb_build_object('cle', v_cle->'cle',
                                       'affichage', v_cle->'affichage',
                                       'explication', v_cle->'explication')
                  END);
END;
$$;

REVOKE ALL ON FUNCTION public.exercice_verifier(UUID, INTEGER, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.exercice_verifier(UUID, INTEGER, JSONB) TO authenticated;

-- ─────────────────────────────────────────── 7. terminer un exercice
-- Le bilan, compté ICI sur les essais rangés (miroir de lib/exercices/
-- progression.bilan) : 2 points du premier coup, 1 au second ; réussi à la
-- moitié. Première réussite : les gemmes de l'exercice (doublées pendant le
-- week-end ×2) et son XP, une seule fois — gem_events et xp_events portent la
-- clé de l'exercice. Rejouer un passage terminé rend le même bilan, sans rien
-- verser.

CREATE OR REPLACE FUNCTION public.exercice_terminer(p_passage UUID)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_passage  public.exercice_passages%ROWTYPE;
  v_ex       public.exercices%ROWTYPE;
  v_score    INTEGER := 0;
  v_max      INTEGER;
  v_reussi   BOOLEAN;
  v_parfait  BOOLEAN;
  v_etat     JSONB;
  v_deja     BOOLEAN;
  v_gemmes   INTEGER := 0;
  v_xp       INTEGER := 0;
  v_avant    INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('ok', false, 'raison', 'auth'); END IF;

  SELECT * INTO v_passage FROM public.exercice_passages
   WHERE id = p_passage AND user_id = v_user
   FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'raison', 'introuvable'); END IF;

  SELECT * INTO v_ex FROM public.exercices WHERE id = v_passage.exercice_id;

  FOR v_etat IN SELECT * FROM jsonb_array_elements(v_passage.etats) LOOP
    IF (v_etat->>'juste')::boolean THEN
      v_score := v_score + CASE WHEN (v_etat->>'essais')::int <= 1 THEN 2 ELSE 1 END;
    END IF;
  END LOOP;
  v_max := 2 * jsonb_array_length(v_passage.etats);
  v_reussi := v_max > 0 AND v_score * 2 >= v_max;
  v_parfait := v_max > 0 AND v_score = v_max;

  IF v_passage.termine_le IS NOT NULL THEN
    RETURN jsonb_build_object('ok', true, 'score', v_score, 'max', v_max, 'reussi', v_reussi,
                              'parfait', v_parfait, 'gemmes', 0, 'xp', 0, 'deja', true);
  END IF;

  UPDATE public.exercice_passages
     SET score = v_score, max = v_max, termine_le = now()
   WHERE id = v_passage.id;

  SELECT reussi INTO v_deja FROM public.exercice_resultats
   WHERE user_id = v_user AND exercice_id = v_ex.id;
  v_deja := COALESCE(v_deja, false);

  INSERT INTO public.exercice_resultats AS r
    (user_id, exercice_id, chapter_id, meilleur_score, max, reussi, parfait, passages, premiere_reussite, maj_le)
  VALUES
    (v_user, v_ex.id, v_ex.chapter_id, v_score, v_max, v_reussi, v_parfait, 1,
     CASE WHEN v_reussi THEN now() END, now())
  ON CONFLICT (user_id, exercice_id) DO UPDATE
    SET meilleur_score    = GREATEST(r.meilleur_score, EXCLUDED.meilleur_score),
        max               = EXCLUDED.max,
        reussi            = r.reussi OR EXCLUDED.reussi,
        parfait           = r.parfait OR EXCLUDED.parfait,
        passages          = r.passages + 1,
        premiere_reussite = COALESCE(r.premiere_reussite, EXCLUDED.premiere_reussite),
        maj_le            = now();

  IF v_reussi AND NOT v_deja THEN
    -- Les gemmes : une ligne par exercice dans gem_events (clé unique).
    IF v_ex.gemmes > 0 THEN
      v_gemmes := public.gemmes_avec_bonus(v_user, v_ex.gemmes);
      INSERT INTO public.gem_events (user_id, source, source_key, amount)
      VALUES (v_user, 'exercice', v_ex.id::text, v_gemmes)
      ON CONFLICT DO NOTHING;
      IF FOUND THEN
        UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_gemmes WHERE id = v_user;
        UPDATE public.exercice_resultats SET gemmes_versees = v_gemmes
         WHERE user_id = v_user AND exercice_id = v_ex.id;
      ELSE
        v_gemmes := 0;
      END IF;
    END IF;
    -- L'XP : par la primitive interne (double XP et gemmes de niveau compris).
    IF v_ex.xp > 0 THEN
      SELECT xp INTO v_avant FROM public.user_wallet WHERE user_id = v_user;
      PERFORM public.wallet_grant_xp(v_user, 'exercice', v_ex.id::text, v_ex.xp);
      SELECT xp - COALESCE(v_avant, 0) INTO v_xp FROM public.user_wallet WHERE user_id = v_user;
    END IF;
  END IF;

  RETURN jsonb_build_object('ok', true, 'score', v_score, 'max', v_max, 'reussi', v_reussi,
                            'parfait', v_parfait, 'gemmes', v_gemmes, 'xp', COALESCE(v_xp, 0),
                            'deja', v_deja);
END;
$$;

REVOKE ALL ON FUNCTION public.exercice_terminer(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.exercice_terminer(UUID) TO authenticated;

-- Contrôle ---------------------------------------------------------------------
-- `tables` DOIT valoir 4, `fonctions` 5.
SELECT
  (SELECT count(*) FROM pg_tables WHERE schemaname = 'public'
     AND tablename IN ('exercices', 'exercices_cles', 'exercice_passages', 'exercice_resultats')) AS tables,
  (SELECT count(*) FROM pg_proc WHERE pronamespace = 'public'::regnamespace
     AND proname IN ('exercice_normaliser', 'exercice_juger', 'exercice_commencer',
                     'exercice_verifier', 'exercice_terminer')) AS fonctions;
