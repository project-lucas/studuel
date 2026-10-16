-- =============================================================================
-- 590 — LE JOURNAL D'USAGE (16/10/2026)
--
-- Ce que la base ne voit pas : les écrans ouverts et le temps qu'on y passe,
-- les recherches qui ne trouvent rien, les boutons touchés. Lucas : « avoir un
-- maximum de données sur l'utilisation et le comportement de mes users ».
--
-- Même circuit que la remontée des erreurs (559) : le navigateur met les
-- événements en file et les envoie par lots (`sendBeacon`, lib/evenements-*),
-- la route `/api/evenements` appelle `evenements_signaler`, seule porte
-- d'écriture, ouverte à anon (l'onboarding est public) et authenticated.
--
-- RIEN DE PERSONNEL : un nom d'événement (`^[a-z_]{2,40}$`), une PAGE déjà
-- normalisée par l'app (`/reviser/[matiere]`, jamais d'identifiant ni de
-- paramètre de recherche), quelques propriétés courtes (≤ 600 caractères), un
-- identifiant de session tiré au lancement. Le texte d'une recherche est gardé
-- (borné à 60 caractères) : c'est lui qui dit le contenu qui manque.
--
-- Bornes : 400 événements par session ou par élève par 10 min, 20 000 par
-- heure en tout (la route borne aussi par adresse IP) ; ménage à 90 jours. Lu par l'admin seul (`admin_usage`).
--
-- PRÉREQUIS : 028. Idempotente. À exécuter à la main.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.evenements_app (
  id          BIGSERIAL PRIMARY KEY,
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id     UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  session_id  TEXT NOT NULL CHECK (session_id ~ '^[A-Za-z0-9_-]{8,40}$'),
  nom         TEXT NOT NULL CHECK (nom ~ '^[a-z_]{2,40}$'),
  page        TEXT CHECK (page IS NULL OR char_length(page) <= 120),
  duree_ms    INTEGER CHECK (duree_ms IS NULL OR duree_ms BETWEEN 0 AND 7200000),
  props       JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (octet_length(props::text) <= 600)
);
CREATE INDEX IF NOT EXISTS evenements_app_cree_le_idx ON public.evenements_app (cree_le DESC);
CREATE INDEX IF NOT EXISTS evenements_app_nom_idx ON public.evenements_app (nom, cree_le DESC);
CREATE INDEX IF NOT EXISTS evenements_app_session_idx ON public.evenements_app (session_id, cree_le DESC);

ALTER TABLE public.evenements_app ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.evenements_app FROM PUBLIC, anon, authenticated;
REVOKE ALL ON SEQUENCE public.evenements_app_id_seq FROM PUBLIC, anon, authenticated;

-- p_lot : [{ "nom": "page_vue", "page": "/reviser", "duree_ms": 1200,
--            "props": {...}, "t": "2026-10-16T08:00:00Z" }, …] — 50 au plus.
-- Rend le nombre d'événements gardés.
CREATE OR REPLACE FUNCTION public.evenements_signaler(p_session TEXT, p_lot JSONB)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_recents INTEGER;
  v_n       INTEGER := 0;
  v_e       JSONB;
  v_quand   TIMESTAMPTZ;
BEGIN
  IF p_session IS NULL OR p_session !~ '^[A-Za-z0-9_-]{8,40}$' THEN RETURN 0; END IF;
  IF jsonb_typeof(p_lot) <> 'array' THEN RETURN 0; END IF;

  SELECT count(*) INTO v_recents FROM public.evenements_app
   WHERE cree_le > now() - INTERVAL '10 minutes'
     AND (session_id = p_session OR (v_user IS NOT NULL AND user_id = v_user));
  IF v_recents >= 400 THEN RETURN 0; END IF;
  SELECT count(*) INTO v_recents FROM public.evenements_app WHERE cree_le > now() - INTERVAL '1 hour';
  IF v_recents >= 20000 THEN RETURN 0; END IF;

  FOR v_e IN SELECT * FROM jsonb_array_elements(p_lot) LIMIT 50 LOOP
    CONTINUE WHEN jsonb_typeof(v_e) <> 'object';
    CONTINUE WHEN COALESCE(v_e->>'nom', '') !~ '^[a-z_]{2,40}$';
    BEGIN
      v_quand := (v_e->>'t')::timestamptz;
    EXCEPTION WHEN others THEN
      v_quand := NULL;
    END;
    -- Un horodatage du navigateur n'est cru qu'à une heure près.
    IF v_quand IS NULL OR v_quand > now() + INTERVAL '5 minutes' OR v_quand < now() - INTERVAL '1 hour' THEN
      v_quand := now();
    END IF;
    BEGIN
      INSERT INTO public.evenements_app (cree_le, user_id, session_id, nom, page, duree_ms, props)
      VALUES (v_quand, v_user, p_session, v_e->>'nom',
              left(NULLIF(v_e->>'page', ''), 120),
              CASE WHEN jsonb_typeof(v_e->'duree_ms') = 'number'
                   THEN LEAST(GREATEST((v_e->>'duree_ms')::numeric, 0), 7200000)::int END,
              CASE WHEN jsonb_typeof(v_e->'props') = 'object' AND octet_length((v_e->'props')::text) <= 600
                   THEN v_e->'props' ELSE '{}'::jsonb END);
      v_n := v_n + 1;
    EXCEPTION WHEN check_violation THEN
      NULL;
    END;
  END LOOP;

  -- Ménage paresseux, une fois sur ~200 appels.
  IF random() < 0.005 THEN
    DELETE FROM public.evenements_app WHERE cree_le < now() - INTERVAL '90 days';
  END IF;
  RETURN v_n;
END;
$$;
REVOKE ALL ON FUNCTION public.evenements_signaler(TEXT, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.evenements_signaler(TEXT, JSONB) TO anon, authenticated;

-- L'usage, pour l'admin : les écrans (vues, visiteurs, temps moyen et médian),
-- les sessions (nombre, durée), les recherches sans résultat, les gestes.
CREATE OR REPLACE FUNCTION public.admin_usage(p_jours INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_n  INTEGER := GREATEST(1, LEAST(COALESCE(p_jours, 30), 90));
  v_ts TIMESTAMPTZ := now() - make_interval(days => GREATEST(1, LEAST(COALESCE(p_jours, 30), 90)));
BEGIN
  IF NOT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false) THEN
    RETURN NULL;
  END IF;

  RETURN jsonb_build_object(
    'jours', v_n,
    'total', (SELECT count(*) FROM public.evenements_app WHERE cree_le >= v_ts),
    'depuis', (SELECT min(cree_le) FROM public.evenements_app),

    'pages', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('page', page, 'vues', vues, 'visiteurs', v,
               'temps_moyen_s', round(moy / 1000.0), 'temps_median_s', round(med / 1000.0)) ORDER BY vues DESC), '[]'::jsonb)
        FROM (SELECT page, count(*) FILTER (WHERE nom = 'page_vue') AS vues,
                     count(DISTINCT COALESCE(user_id::text, session_id)) AS v,
                     avg(duree_ms) FILTER (WHERE nom = 'page_quitte') AS moy,
                     percentile_cont(0.5) WITHIN GROUP (ORDER BY duree_ms) FILTER (WHERE nom = 'page_quitte') AS med
                FROM public.evenements_app
               WHERE cree_le >= v_ts AND page IS NOT NULL AND nom IN ('page_vue', 'page_quitte')
               GROUP BY page
               ORDER BY count(*) FILTER (WHERE nom = 'page_vue') DESC
               LIMIT 80) t),

    'sessions', (
      SELECT jsonb_build_object(
               'n', count(*),
               'pages_moy', round(avg(p), 1),
               'duree_mediane_s', round(percentile_cont(0.5) WITHIN GROUP (ORDER BY d) / 1000.0),
               'connectees', count(*) FILTER (WHERE u))
        FROM (SELECT session_id,
                     count(*) FILTER (WHERE nom = 'page_vue') AS p,
                     COALESCE(sum(duree_ms) FILTER (WHERE nom = 'page_quitte'), 0) AS d,
                     bool_or(user_id IS NOT NULL) AS u
                FROM public.evenements_app WHERE cree_le >= v_ts GROUP BY session_id) s),

    'recherches_vides', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('texte', texte, 'n', n, 'ou', ou) ORDER BY n DESC), '[]'::jsonb)
        FROM (SELECT lower(left(props->>'texte', 60)) AS texte, count(*) AS n, min(page) AS ou
                FROM public.evenements_app
               WHERE cree_le >= v_ts AND nom = 'recherche' AND (props->>'resultats') = '0'
                 AND char_length(COALESCE(props->>'texte', '')) >= 2
               GROUP BY 1 ORDER BY count(*) DESC LIMIT 50) t),

    'gestes', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('nom', nom, 'cible', cible, 'n', n, 'visiteurs', v) ORDER BY n DESC), '[]'::jsonb)
        FROM (SELECT nom, props->>'cible' AS cible, count(*) AS n, count(DISTINCT COALESCE(user_id::text, session_id)) AS v
                FROM public.evenements_app
               WHERE cree_le >= v_ts AND nom NOT IN ('page_vue', 'page_quitte')
               GROUP BY nom, props->>'cible' ORDER BY count(*) DESC LIMIT 80) t),

    'appareils', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('appareil', a, 'n', n) ORDER BY n DESC), '[]'::jsonb)
        FROM (SELECT COALESCE(props->>'appareil', '?') AS a, count(DISTINCT session_id) AS n
                FROM public.evenements_app
               WHERE cree_le >= v_ts AND nom = 'session'
               GROUP BY 1) t)
  );
END;
$$;
REVOKE ALL ON FUNCTION public.admin_usage(INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_usage(INTEGER) TO authenticated;

-- =============================================================================
-- CONTRÔLES
--   select public.evenements_signaler('abcdefgh12', '[{"nom":"page_vue","page":"/reviser"}]'); → 1
--   select public.admin_usage(7);   → NULL hors admin
-- =============================================================================
