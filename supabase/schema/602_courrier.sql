-- =============================================================================
-- 602 — Le courrier (25/10/2026, cadrage « le jeu vivant » § G)
--
-- Une BOÎTE AUX LETTRES par élève : les mots de Marcel, les cadeaux à
-- récupérer, les nouveautés — et, FUSIONNÉS côté serveur sans être copiés, les
-- diffusions du coach et de l'admin (588) et les défis reçus des amis (558).
--
--   · `courrier` : une ligne par lettre et par destinataire (type marcel ·
--     cadeau · coach · ami · nouveaute, titre, corps, lien interne, `gains`
--     jsonb — {"xp": 50} et/ou {"gemmes": 5} —, expéditeur, `lu_at`,
--     `encaisse_at`, `expire_at`). `cle` rend un producteur IDEMPOTENT (la
--     lettre de bienvenue ne s'écrit qu'une fois par compte). Lisible par son
--     destinataire seul ; AUCUNE écriture directe (ni insert, ni update) : tout
--     passe par les fonctions. ON DELETE CASCADE : un compte supprimé (596)
--     emporte son courrier.
--   · `courrier_deposer(...)` : la SEULE porte d'écriture, réservée à
--     `service_role` (révoquée à anon ET authenticated) — l'app n'écrit pas de
--     lettre depuis le client. `courrier_bienvenue_pour(user)` : le premier
--     producteur, une lettre de Marcel avec 50 XP, appelée par un TRIGGER à la
--     création du profil (jamais pour un parent, jamais bloquante) et, pour les
--     comptes qui existaient avant cette migration, à leur première ouverture
--     de la boîte (`courrier_boite` / `courrier_non_lus`) — une seule fois.
--   · `courrier_lire(id)`, `courrier_tout_lire()` : marquer lu.
--   · `courrier_encaisser(id)` : verse les gains UNE SEULE FOIS, par le barème
--     existant — l'XP par `wallet_grant_xp` (557 : multiplicateur d'amis, potion,
--     niveau, trace `xp_events` idempotente à la clé « courrier/<id> »), les
--     gemmes par `gem_events` + `profiles.gems` (pattern 557 des épreuves, même
--     clé). `courrier_tout_encaisser()` pour « Tout lire et récupérer ».
--   · `courrier_boite()` : UNE vague — les lettres, les diffusions de type
--     message qui visent l'élève (30 jours, par `annonce_vise`, avec leur état
--     vu/fermé) et les défis reçus (`defis_recus()`, 7 jours). Les SONDAGES
--     restent dans leur fenêtre (588) : on y répond, on ne les « lit » pas.
--   · `courrier_non_lus()` : le compte du badge — lettres non lues ou cadeaux
--     non récupérés + diffusions jamais vues + défis non joués.
--   · Les sources `courrier` sont ajoutées aux CHECK de `xp_events` et
--     `gem_events` par le même bloc que la 557 (relit la contrainte, idempotent).
--
-- PRÉREQUIS : 192, 557 (wallet_grant_xp, xp_events, gem_events), 558
-- (defis_recus), 588 (annonces, annonce_vise, annonce_marquer). Idempotente.
-- À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

-- ─────────────────────────────────────── 1. les sources « courrier » (557 § 1)

DO $$
DECLARE
  v_table   TEXT;
  v_nom     TEXT;
  v_def     TEXT;
  v_sources TEXT[];
  v_neuves  TEXT[] := ARRAY['courrier'];
  v_s       TEXT;
BEGIN
  FOREACH v_table IN ARRAY ARRAY['xp_events', 'gem_events'] LOOP
    v_nom := v_table || '_source_check';
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

-- ─────────────────────────────────────── 2. les gains d'une lettre

-- {"xp": 1..1000} et/ou {"gemmes": 1..100}, rien d'autre ; NULL = pas de cadeau.
-- Une fonction plutôt qu'un CHECK inline : SQL ne garantit pas l'ordre
-- d'évaluation d'un AND, et un cast sur une valeur non numérique casserait.
CREATE OR REPLACE FUNCTION public.courrier_gains_ok(p JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF p IS NULL THEN RETURN true; END IF;
  IF jsonb_typeof(p) <> 'object' THEN RETURN false; END IF;
  IF (p - 'xp' - 'gemmes') <> '{}'::jsonb THEN RETURN false; END IF;
  IF NOT (p ? 'xp' OR p ? 'gemmes') THEN RETURN false; END IF;
  IF p ? 'xp' THEN
    IF jsonb_typeof(p -> 'xp') <> 'number' OR (p ->> 'xp') !~ '^[0-9]{1,4}$' THEN RETURN false; END IF;
    IF (p ->> 'xp')::int NOT BETWEEN 1 AND 1000 THEN RETURN false; END IF;
  END IF;
  IF p ? 'gemmes' THEN
    IF jsonb_typeof(p -> 'gemmes') <> 'number' OR (p ->> 'gemmes') !~ '^[0-9]{1,3}$' THEN RETURN false; END IF;
    IF (p ->> 'gemmes')::int NOT BETWEEN 1 AND 100 THEN RETURN false; END IF;
  END IF;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.courrier_gains_ok(JSONB) FROM PUBLIC, anon, authenticated;

-- ─────────────────────────────────────── 3. la table

CREATE TABLE IF NOT EXISTS public.courrier (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('marcel', 'cadeau', 'coach', 'ami', 'nouveaute')),
  titre       TEXT NOT NULL CHECK (char_length(titre) BETWEEN 1 AND 90),
  corps       TEXT NOT NULL DEFAULT '' CHECK (char_length(corps) <= 2000),
  lien        TEXT CHECK (lien IS NULL OR (lien ~ '^/([A-Za-z0-9_?=&#.-][A-Za-z0-9/_?=&#.-]*)?$' AND char_length(lien) <= 200)),
  gains       JSONB CHECK (public.courrier_gains_ok(gains)),
  expediteur  TEXT NOT NULL DEFAULT 'Marcel' CHECK (char_length(expediteur) BETWEEN 1 AND 60),
  -- Idempotence d'un producteur : (user_id, cle) unique quand elle est posée.
  cle         TEXT CHECK (cle IS NULL OR char_length(cle) BETWEEN 1 AND 80),
  -- Habillage : {"pose": "invite"} pour Marcel, {"portrait": "…"} pour un ami.
  meta        JSONB CHECK (meta IS NULL OR jsonb_typeof(meta) = 'object'),
  lu_at       TIMESTAMPTZ,
  encaisse_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expire_at   TIMESTAMPTZ,
  CHECK (encaisse_at IS NULL OR gains IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS courrier_user_idx
  ON public.courrier (user_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS courrier_user_cle_idx
  ON public.courrier (user_id, cle) WHERE cle IS NOT NULL;

ALTER TABLE public.courrier ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS courrier_select_soi ON public.courrier;
CREATE POLICY courrier_select_soi ON public.courrier
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));
-- Pas de policy INSERT / UPDATE / DELETE : les fonctions ci-dessous seulement.

REVOKE ALL ON public.courrier FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.courrier TO authenticated;

-- ─────────────────────────────────────── 4. déposer (service_role seulement)

CREATE OR REPLACE FUNCTION public.courrier_deposer(
  p_user       UUID,
  p_type       TEXT,
  p_titre      TEXT,
  p_corps      TEXT DEFAULT '',
  p_lien       TEXT DEFAULT NULL,
  p_gains      JSONB DEFAULT NULL,
  p_expediteur TEXT DEFAULT 'Marcel',
  p_cle        TEXT DEFAULT NULL,
  p_meta       JSONB DEFAULT NULL,
  p_expire_at  TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF p_user IS NULL THEN RETURN NULL; END IF;
  IF p_cle IS NOT NULL THEN
    SELECT id INTO v_id FROM public.courrier WHERE user_id = p_user AND cle = p_cle;
    IF v_id IS NOT NULL THEN RETURN v_id; END IF;
  END IF;
  INSERT INTO public.courrier (user_id, type, titre, corps, lien, gains, expediteur, cle, meta, expire_at)
  VALUES (p_user, p_type, left(COALESCE(p_titre, ''), 90), left(COALESCE(p_corps, ''), 2000),
          p_lien, p_gains, left(COALESCE(NULLIF(btrim(p_expediteur), ''), 'Marcel'), 60),
          p_cle, p_meta, p_expire_at)
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_id;
  IF v_id IS NULL AND p_cle IS NOT NULL THEN
    SELECT id INTO v_id FROM public.courrier WHERE user_id = p_user AND cle = p_cle;
  END IF;
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.courrier_deposer(UUID, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT, JSONB, TIMESTAMPTZ)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.courrier_deposer(UUID, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT, JSONB, TIMESTAMPTZ)
  TO service_role;

-- ─────────────────────────────────────── 5. la lettre de bienvenue

-- Interne : une lettre de Marcel avec 50 XP, une seule fois par compte
-- (cle 'bienvenue'). Jamais pour un parent : son espace n'a pas de boîte.
CREATE OR REPLACE FUNCTION public.courrier_bienvenue_pour(p_user UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_user IS NULL THEN RETURN NULL; END IF;
  IF EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = p_user AND p.profile_type = 'parent') THEN
    RETURN NULL;
  END IF;
  RETURN public.courrier_deposer(
    p_user, 'marcel',
    'Bienvenue dans ta boîte aux lettres !',
    'Salut, moi c''est Marcel, ton coach. Ici tu recevras mes mots, les défis de tes amis et les nouvelles de ton coach. Pour commencer, un petit cadeau : 50 XP. Appuie sur « Récupérer » pour les faire voler jusqu''à ta barre.',
    '/reviser',
    '{"xp": 50}'::jsonb,
    'Marcel',
    'bienvenue',
    '{"pose": "invite"}'::jsonb,
    NULL);
END;
$$;

REVOKE ALL ON FUNCTION public.courrier_bienvenue_pour(UUID) FROM PUBLIC, anon, authenticated;

-- Pour le compte connecté (les comptes nés avant la migration) : 'ok' si la
-- lettre vient d'être écrite, 'deja' si elle l'était, 'anonyme' sans session.
CREATE OR REPLACE FUNCTION public.courrier_bienvenue()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := (SELECT auth.uid());
BEGIN
  IF v_user IS NULL THEN RETURN 'anonyme'; END IF;
  IF EXISTS (SELECT 1 FROM public.courrier WHERE user_id = v_user AND cle = 'bienvenue') THEN
    RETURN 'deja';
  END IF;
  IF public.courrier_bienvenue_pour(v_user) IS NULL THEN RETURN 'parent'; END IF;
  RETURN 'ok';
END;
$$;

REVOKE ALL ON FUNCTION public.courrier_bienvenue() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.courrier_bienvenue() TO authenticated;

-- Le trigger : à la naissance du profil (handle_new_user, 361). Une lettre qui
-- échouerait ne doit JAMAIS empêcher une inscription : l'erreur est avalée,
-- et la première ouverture de la boîte rattrape la lettre de toute façon.
CREATE OR REPLACE FUNCTION public.courrier_profil_cree()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    PERFORM public.courrier_bienvenue_pour(NEW.id);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.courrier_profil_cree() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_profile_created_courrier ON public.profiles;
CREATE TRIGGER on_profile_created_courrier
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.courrier_profil_cree();

-- ─────────────────────────────────────── 6. lire

CREATE OR REPLACE FUNCTION public.courrier_lire(p_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := (SELECT auth.uid());
BEGIN
  IF v_user IS NULL OR p_id IS NULL THEN RETURN false; END IF;
  UPDATE public.courrier SET lu_at = COALESCE(lu_at, now())
   WHERE id = p_id AND user_id = v_user;
  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.courrier_lire(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.courrier_lire(UUID) TO authenticated;

-- Marque lues toutes les lettres ; rend le nombre de lettres touchées.
CREATE OR REPLACE FUNCTION public.courrier_tout_lire()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := (SELECT auth.uid());
  v_n    INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN 0; END IF;
  UPDATE public.courrier SET lu_at = now()
   WHERE user_id = v_user AND lu_at IS NULL;
  GET DIAGNOSTICS v_n = ROW_COUNT;
  RETURN v_n;
END;
$$;

REVOKE ALL ON FUNCTION public.courrier_tout_lire() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.courrier_tout_lire() TO authenticated;

-- ─────────────────────────────────────── 7. encaisser

-- {"xp": n, "gemmes": n, "raison": 'ok' | 'deja' | 'rien' | 'inconnue' |
-- 'expiree' | 'anonyme'} — xp et gemmes = ce qui a VRAIMENT été versé (l'XP
-- après multiplicateur, mesurée sur le portefeuille).
CREATE OR REPLACE FUNCTION public.courrier_encaisser(p_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := (SELECT auth.uid());
  v_lettre public.courrier%ROWTYPE;
  v_xp     INTEGER := 0;
  v_gemmes INTEGER := 0;
  v_avant  INTEGER := 0;
  v_apres  INTEGER := 0;
  v_xp_verse     INTEGER := 0;
  v_gemmes_versees INTEGER := 0;
BEGIN
  IF v_user IS NULL OR p_id IS NULL THEN
    RETURN jsonb_build_object('xp', 0, 'gemmes', 0, 'raison', 'anonyme');
  END IF;

  -- Les verrous dans l'ordre de la 557 : le PROFIL, puis la lettre, puis le
  -- PORTEFEUILLE (dans wallet_grant_xp).
  PERFORM 1 FROM public.profiles WHERE id = v_user FOR UPDATE;
  SELECT * INTO v_lettre FROM public.courrier
   WHERE id = p_id AND user_id = v_user FOR UPDATE;
  IF v_lettre.id IS NULL THEN
    RETURN jsonb_build_object('xp', 0, 'gemmes', 0, 'raison', 'inconnue');
  END IF;

  IF v_lettre.gains IS NULL THEN
    UPDATE public.courrier SET lu_at = COALESCE(lu_at, now()) WHERE id = p_id;
    RETURN jsonb_build_object('xp', 0, 'gemmes', 0, 'raison', 'rien');
  END IF;
  IF v_lettre.encaisse_at IS NOT NULL THEN
    RETURN jsonb_build_object('xp', 0, 'gemmes', 0, 'raison', 'deja');
  END IF;
  IF v_lettre.expire_at IS NOT NULL AND v_lettre.expire_at < now() THEN
    UPDATE public.courrier SET lu_at = COALESCE(lu_at, now()) WHERE id = p_id;
    RETURN jsonb_build_object('xp', 0, 'gemmes', 0, 'raison', 'expiree');
  END IF;

  v_xp     := COALESCE((v_lettre.gains ->> 'xp')::int, 0);
  v_gemmes := COALESCE((v_lettre.gains ->> 'gemmes')::int, 0);

  IF v_xp > 0 THEN
    PERFORM public.wallet_ensure(v_user);
    SELECT xp INTO v_avant FROM public.user_wallet WHERE user_id = v_user;
    -- Idempotent par xp_events_once_per_key (courrier / id de la lettre).
    PERFORM public.wallet_grant_xp(v_user, 'courrier', p_id::text, v_xp);
    SELECT xp INTO v_apres FROM public.user_wallet WHERE user_id = v_user;
    v_xp_verse := GREATEST(0, COALESCE(v_apres, 0) - COALESCE(v_avant, 0));
  END IF;

  IF v_gemmes > 0 THEN
    INSERT INTO public.gem_events (user_id, source, source_key, amount)
    VALUES (v_user, 'courrier', p_id::text, v_gemmes)
    ON CONFLICT DO NOTHING;
    IF FOUND THEN
      UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_gemmes WHERE id = v_user;
      v_gemmes_versees := v_gemmes;
    END IF;
  END IF;

  UPDATE public.courrier
     SET encaisse_at = now(), lu_at = COALESCE(lu_at, now())
   WHERE id = p_id;

  RETURN jsonb_build_object('xp', v_xp_verse, 'gemmes', v_gemmes_versees, 'raison', 'ok');
END;
$$;

REVOKE ALL ON FUNCTION public.courrier_encaisser(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.courrier_encaisser(UUID) TO authenticated;

-- « Tout lire et récupérer » : chaque cadeau en attente, puis tout marqué lu.
-- {"xp": total versé, "gemmes": total versé, "lettres": nombre de cadeaux}.
CREATE OR REPLACE FUNCTION public.courrier_tout_encaisser()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := (SELECT auth.uid());
  v_id     UUID;
  v_un     JSONB;
  v_xp     INTEGER := 0;
  v_gemmes INTEGER := 0;
  v_n      INTEGER := 0;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('xp', 0, 'gemmes', 0, 'lettres', 0);
  END IF;
  FOR v_id IN
    SELECT id FROM public.courrier
     WHERE user_id = v_user AND gains IS NOT NULL AND encaisse_at IS NULL
       AND (expire_at IS NULL OR expire_at > now())
     ORDER BY created_at
  LOOP
    v_un := public.courrier_encaisser(v_id);
    IF v_un ->> 'raison' = 'ok' THEN
      v_xp     := v_xp + COALESCE((v_un ->> 'xp')::int, 0);
      v_gemmes := v_gemmes + COALESCE((v_un ->> 'gemmes')::int, 0);
      v_n      := v_n + 1;
    END IF;
  END LOOP;
  PERFORM public.courrier_tout_lire();
  RETURN jsonb_build_object('xp', v_xp, 'gemmes', v_gemmes, 'lettres', v_n);
END;
$$;

REVOKE ALL ON FUNCTION public.courrier_tout_encaisser() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.courrier_tout_encaisser() TO authenticated;

-- ─────────────────────────────────────── 8. les diffusions, fusionnées (588)

-- Les messages (pas les sondages) qui visent l'élève, 30 derniers jours, non
-- archivés — avec son état : vue_le / fermee_le. « Lire » depuis la boîte =
-- annonce_marquer(id, 'fermee') (588), et la fenêtre ne le remontrera pas.
CREATE OR REPLACE FUNCTION public.courrier_annonces()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(jsonb_agg(x ORDER BY x ->> 'cree_le' DESC), '[]'::jsonb) FROM (
    SELECT jsonb_build_object(
             'id', a.id, 'titre', a.titre, 'corps', a.corps,
             'lien', a.lien, 'lien_libelle', a.lien_libelle,
             'auteur', COALESCE(NULLIF(btrim(pa.full_name), ''), 'Studuel'),
             'auteur_coach', a.segment IN ('coaches', 'groupe'),
             'cree_le', a.cree_le,
             'vue_le', v.vue_le, 'fermee_le', v.fermee_le) AS x
      FROM public.annonces a
      LEFT JOIN public.profiles pa ON pa.id = a.auteur_id
      LEFT JOIN public.annonces_vues v ON v.annonce_id = a.id AND v.user_id = (SELECT auth.uid())
     WHERE (SELECT auth.uid()) IS NOT NULL
       AND a.type = 'message'
       AND a.archive_le IS NULL
       AND a.cree_le > now() - interval '30 days'
       AND public.annonce_vise(a.segment, a.auteur_id, a.groupe_id, a.classes, (SELECT auth.uid()))
     ORDER BY a.cree_le DESC
     LIMIT 50
  ) t;
$$;

REVOKE ALL ON FUNCTION public.courrier_annonces() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.courrier_annonces() TO authenticated;

-- ─────────────────────────────────────── 9. la boîte, en une vague

-- {"lettres": [...], "annonces": [...], "defis": [...]} — les lettres non
-- expirées (100 max), les diffusions (§ 8) et les défis reçus (558).
-- Volatile : rattrape la lettre de bienvenue des comptes nés avant la 602.
CREATE OR REPLACE FUNCTION public.courrier_boite()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := (SELECT auth.uid());
  v_lettres JSONB;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('lettres', '[]'::jsonb, 'annonces', '[]'::jsonb, 'defis', '[]'::jsonb);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.courrier WHERE user_id = v_user AND cle = 'bienvenue') THEN
    PERFORM public.courrier_bienvenue_pour(v_user);
  END IF;

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
           'id', c.id, 'type', c.type, 'titre', c.titre, 'corps', c.corps,
           'lien', c.lien, 'gains', c.gains, 'expediteur', c.expediteur,
           'meta', c.meta, 'lu_at', c.lu_at, 'encaisse_at', c.encaisse_at,
           'created_at', c.created_at, 'expire_at', c.expire_at)
         ORDER BY c.created_at DESC), '[]'::jsonb)
    INTO v_lettres
    FROM (SELECT * FROM public.courrier
           WHERE user_id = v_user
             AND (expire_at IS NULL OR expire_at > now())
           ORDER BY created_at DESC
           LIMIT 100) c;

  RETURN jsonb_build_object(
    'lettres',  v_lettres,
    'annonces', public.courrier_annonces(),
    'defis',    public.defis_recus());
END;
$$;

REVOKE ALL ON FUNCTION public.courrier_boite() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.courrier_boite() TO authenticated;

-- ─────────────────────────────────────── 10. le badge

-- Lettres non lues ou cadeaux non récupérés (non expirés) + diffusions jamais
-- vues + défis reçus non joués. Volatile pour la même raison que la boîte.
CREATE OR REPLACE FUNCTION public.courrier_non_lus()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := (SELECT auth.uid());
  v_n    INTEGER := 0;
BEGIN
  IF v_user IS NULL THEN RETURN 0; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.courrier WHERE user_id = v_user AND cle = 'bienvenue') THEN
    PERFORM public.courrier_bienvenue_pour(v_user);
  END IF;

  SELECT count(*)::int INTO v_n
    FROM public.courrier
   WHERE user_id = v_user
     AND (expire_at IS NULL OR expire_at > now())
     AND (lu_at IS NULL OR (gains IS NOT NULL AND encaisse_at IS NULL));

  v_n := v_n + COALESCE((
    SELECT count(*)::int FROM jsonb_array_elements(public.courrier_annonces()) a
     WHERE a ->> 'vue_le' IS NULL), 0);

  v_n := v_n + COALESCE(jsonb_array_length(public.defis_recus()), 0);

  RETURN v_n;
END;
$$;

REVOKE ALL ON FUNCTION public.courrier_non_lus() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.courrier_non_lus() TO authenticated;

-- ─────────────────────────────────────── contrôle

-- SELECT
--   (SELECT count(*) FROM pg_proc WHERE proname LIKE 'courrier_%') AS fonctions,  -- 12
--   (SELECT pg_get_constraintdef(oid) ~ '\mcourrier\M' FROM pg_constraint
--     WHERE conname = 'xp_events_source_check') AS source_xp,
--   (SELECT pg_get_constraintdef(oid) ~ '\mcourrier\M' FROM pg_constraint
--     WHERE conname = 'gem_events_source_check') AS source_gemmes,
--   (SELECT count(*) FROM pg_trigger WHERE tgname = 'on_profile_created_courrier') AS trigger;
