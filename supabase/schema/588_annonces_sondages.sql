-- =============================================================================
-- 588 — LA DIFFUSION ET LES SONDAGES (16/10/2026)
--
-- Lucas : « une icône messagerie pour que je puisse envoyer des messages à tous
-- mes users — en coachant si c'est pour mes coachés, si c'est pour les users de
-- Studuel (freemium…), ou à tout le monde » ; « faire des sondages de temps en
-- temps pour mieux connaître les users ».
--
-- Une ANNONCE est un message (titre, texte, lien interne facultatif) ou un
-- SONDAGE (1 à 10 questions : choix unique, choix multiple, note de 1 à 5,
-- réponse libre), envoyé à un PUBLIC :
--   'tous'    tout le monde           (admin)
--   'eleves'  les élèves              (admin)
--   'parents' les parents             (admin)
--   'gratuit' les élèves sans Studuel+ (admin)
--   'plus'    les abonnés Studuel+    (admin)
--   'coaches' les élèves suivis par l'auteur (coach ou admin)
--   'groupe'  un groupe de l'auteur   (coach ou admin)
-- avec, pour les élèves, un filtre facultatif par classe. L'app la montre en
-- fenêtre au lancement (une à la fois), éventuellement avec une notification
-- push ; un sondage disparaît une fois répondu, un message une fois fermé.
--
-- Le texte d'une réponse libre peut contenir n'importe quoi : il n'est lu que
-- par l'auteur du sondage et l'admin, jamais par un autre élève. Un sondage
-- « anonyme » ne montre pas qui a répondu (la base garde l'identifiant pour
-- n'accepter qu'une réponse par personne).
--
-- PRÉREQUIS : 028, 045, 048, 560. Idempotente. À exécuter à la main.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.annonces (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auteur_id   UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('message', 'sondage')),
  titre       TEXT NOT NULL CHECK (char_length(titre) BETWEEN 1 AND 90),
  corps       TEXT NOT NULL DEFAULT '' CHECK (char_length(corps) <= 2000),
  lien        TEXT CHECK (lien IS NULL OR (lien ~ '^/([A-Za-z0-9_?=&#.-][A-Za-z0-9/_?=&#.-]*)?$' AND char_length(lien) <= 200)),
  lien_libelle TEXT CHECK (lien_libelle IS NULL OR char_length(lien_libelle) <= 40),
  segment     TEXT NOT NULL CHECK (segment IN ('tous', 'eleves', 'parents', 'gratuit', 'plus', 'coaches', 'groupe')),
  groupe_id   UUID REFERENCES public.coach_groupes (id) ON DELETE CASCADE,
  classes     TEXT[],
  questions   JSONB,
  anonyme     BOOLEAN NOT NULL DEFAULT false,
  push        BOOLEAN NOT NULL DEFAULT false,
  push_envoye_le TIMESTAMPTZ,
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now(),
  expire_le   TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '14 days',
  archive_le  TIMESTAMPTZ,
  CHECK ((type = 'sondage') = (questions IS NOT NULL)),
  CHECK ((segment = 'groupe') = (groupe_id IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS annonces_actives_idx ON public.annonces (expire_le) WHERE archive_le IS NULL;
CREATE INDEX IF NOT EXISTS annonces_auteur_idx ON public.annonces (auteur_id, cree_le DESC);

CREATE TABLE IF NOT EXISTS public.annonces_vues (
  annonce_id  UUID NOT NULL REFERENCES public.annonces (id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  vue_le      TIMESTAMPTZ NOT NULL DEFAULT now(),
  fermee_le   TIMESTAMPTZ,
  clic_le     TIMESTAMPTZ,
  PRIMARY KEY (annonce_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.sondage_reponses (
  annonce_id  UUID NOT NULL REFERENCES public.annonces (id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  reponses    JSONB NOT NULL,
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (annonce_id, user_id),
  CHECK (octet_length(reponses::text) <= 12000)
);

ALTER TABLE public.annonces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annonces_vues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sondage_reponses ENABLE ROW LEVEL SECURITY;
-- Aucune policy : tout passe par les RPC ci-dessous.
REVOKE ALL ON TABLE public.annonces FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.annonces_vues FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.sondage_reponses FROM PUBLIC, anon, authenticated;

-- ------------------------------------------------- 1. qui est visé ? ---
CREATE OR REPLACE FUNCTION public.annonce_vise(
  p_segment TEXT, p_auteur UUID, p_groupe UUID, p_classes TEXT[], p_user UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN p_user IS NULL OR p_user = p_auteur THEN false
    ELSE COALESCE((
      SELECT
        (CASE p_segment
           WHEN 'tous'    THEN true
           WHEN 'eleves'  THEN p.profile_type IS DISTINCT FROM 'parent' AND p.profile_type IS DISTINCT FROM 'coach'
           WHEN 'parents' THEN p.profile_type = 'parent'
           WHEN 'gratuit' THEN p.profile_type IS DISTINCT FROM 'parent' AND p.profile_type IS DISTINCT FROM 'coach'
                               AND COALESCE(p.subscription_tier, 'free') NOT IN ('tier1', 'tier2', 'tier3')
           WHEN 'plus'    THEN COALESCE(p.subscription_tier, 'free') IN ('tier1', 'tier2', 'tier3')
           WHEN 'coaches' THEN EXISTS (
                                 SELECT 1 FROM public.coach_membres m
                                   JOIN public.coach_groupes g ON g.id = m.groupe_id
                                  WHERE g.coach_id = p_auteur AND g.archive_le IS NULL
                                    AND m.eleve_id = p_user AND m.statut = 'actif')
           WHEN 'groupe'  THEN EXISTS (
                                 SELECT 1 FROM public.coach_membres m
                                   JOIN public.coach_groupes g ON g.id = m.groupe_id
                                  WHERE g.id = p_groupe AND g.coach_id = p_auteur
                                    AND m.eleve_id = p_user AND m.statut = 'actif')
           ELSE false
         END)
        AND (p_classes IS NULL OR cardinality(p_classes) = 0 OR p.profile_type = 'parent'
             OR p.grade_level = ANY (p_classes))
        FROM public.profiles p WHERE p.id = p_user
    ), false)
  END;
$$;
REVOKE ALL ON FUNCTION public.annonce_vise(TEXT, UUID, UUID, TEXT[], UUID) FROM PUBLIC, anon, authenticated;

-- Le compte de la cible, avant d'envoyer (« 1 284 personnes recevront… »).
CREATE OR REPLACE FUNCTION public.annonce_estimer(p_segment TEXT, p_groupe UUID DEFAULT NULL, p_classes TEXT[] DEFAULT NULL)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_moi UUID := auth.uid();
  v_admin BOOLEAN := COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false);
BEGIN
  IF v_moi IS NULL OR NOT public.est_coach() THEN RETURN 0; END IF;
  IF NOT v_admin AND p_segment NOT IN ('coaches', 'groupe') THEN RETURN 0; END IF;
  RETURN (SELECT count(*)::int FROM public.profiles p
           WHERE public.annonce_vise(p_segment, v_moi, p_groupe, p_classes, p.id));
END;
$$;
REVOKE ALL ON FUNCTION public.annonce_estimer(TEXT, UUID, TEXT[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.annonce_estimer(TEXT, UUID, TEXT[]) TO authenticated;

-- ------------------------------------------------- 2. publier ---
-- p : { type, titre, corps, lien, lien_libelle, segment, groupe_id, classes,
--       questions, anonyme, push, jours }  — validé aussi par lib/annonces.
-- Erreurs : 'coach_seulement' · 'segment_interdit' · 'groupe_inconnu'
-- · 'sondage_invalide' · 'trop_d_annonces'.
CREATE OR REPLACE FUNCTION public.annonce_publier(p JSONB)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_moi      UUID := auth.uid();
  v_admin    BOOLEAN := COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false);
  v_type     TEXT := p->>'type';
  v_segment  TEXT := p->>'segment';
  v_groupe   UUID := NULLIF(p->>'groupe_id', '')::uuid;
  v_classes  TEXT[];
  v_q        JSONB := CASE WHEN p->>'type' = 'sondage' THEN p->'questions' ELSE NULL END;
  v_item     JSONB;
  v_jours    INTEGER := GREATEST(1, LEAST(COALESCE((p->>'jours')::int, 14), 60));
  v_id       UUID;
BEGIN
  IF v_moi IS NULL OR NOT public.est_coach() THEN
    RAISE EXCEPTION 'coach_seulement' USING ERRCODE = '42501';
  END IF;
  IF NOT v_admin AND v_segment NOT IN ('coaches', 'groupe') THEN
    RAISE EXCEPTION 'segment_interdit' USING ERRCODE = '42501';
  END IF;
  IF v_segment = 'groupe' AND NOT EXISTS (
       SELECT 1 FROM public.coach_groupes WHERE id = v_groupe AND coach_id = v_moi) THEN
    RAISE EXCEPTION 'groupe_inconnu';
  END IF;
  IF v_segment <> 'groupe' THEN v_groupe := NULL; END IF;

  IF jsonb_typeof(p->'classes') = 'array' AND jsonb_array_length(p->'classes') > 0 THEN
    SELECT array_agg(left(x, 20)) INTO v_classes FROM jsonb_array_elements_text(p->'classes') x;
  END IF;

  IF v_type = 'sondage' THEN
    IF jsonb_typeof(v_q) <> 'array' OR jsonb_array_length(v_q) NOT BETWEEN 1 AND 10 THEN
      RAISE EXCEPTION 'sondage_invalide';
    END IF;
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_q) LOOP
      IF v_item->>'type' NOT IN ('choix', 'multiple', 'note', 'texte')
         OR char_length(COALESCE(v_item->>'id', '')) NOT BETWEEN 1 AND 20
         OR char_length(COALESCE(v_item->>'libelle', '')) NOT BETWEEN 1 AND 200
         OR (v_item->>'type' IN ('choix', 'multiple')
             AND (jsonb_typeof(v_item->'options') <> 'array'
                  OR jsonb_array_length(v_item->'options') NOT BETWEEN 2 AND 8)) THEN
        RAISE EXCEPTION 'sondage_invalide';
      END IF;
    END LOOP;
  END IF;

  -- Un coach (non admin) : dix annonces par jour au plus.
  IF NOT v_admin AND (SELECT count(*) FROM public.annonces
                       WHERE auteur_id = v_moi AND cree_le > now() - INTERVAL '1 day') >= 10 THEN
    RAISE EXCEPTION 'trop_d_annonces';
  END IF;

  INSERT INTO public.annonces (auteur_id, type, titre, corps, lien, lien_libelle, segment, groupe_id,
                               classes, questions, anonyme, push, expire_le)
  VALUES (v_moi, v_type, left(btrim(p->>'titre'), 90), left(COALESCE(p->>'corps', ''), 2000),
          NULLIF(p->>'lien', ''), NULLIF(left(p->>'lien_libelle', 40), ''),
          v_segment, v_groupe, v_classes, v_q,
          COALESCE((p->>'anonyme')::boolean, false), COALESCE((p->>'push')::boolean, false),
          now() + make_interval(days => v_jours))
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.annonce_publier(JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.annonce_publier(JSONB) TO authenticated;

CREATE OR REPLACE FUNCTION public.annonce_archiver(p_annonce UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.annonces SET archive_le = now()
   WHERE id = p_annonce AND archive_le IS NULL
     AND (auteur_id = auth.uid()
          OR COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false))
  RETURNING true;
$$;
REVOKE ALL ON FUNCTION public.annonce_archiver(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.annonce_archiver(UUID) TO authenticated;

-- ------------------------------------------------- 3. côté destinataire ---
-- Les annonces qui m'attendent (3 au plus, la plus ancienne d'abord) : actives,
-- qui me visent, pas fermées ; un sondage, pas encore répondu.
CREATE OR REPLACE FUNCTION public.annonces_pour_moi()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(jsonb_agg(x ORDER BY x->>'cree_le'), '[]'::jsonb) FROM (
    SELECT jsonb_build_object(
             'id', a.id, 'type', a.type, 'titre', a.titre, 'corps', a.corps,
             'lien', a.lien, 'lien_libelle', a.lien_libelle,
             'questions', a.questions, 'anonyme', a.anonyme,
             'auteur', COALESCE(pa.full_name, 'Studuel'),
             'auteur_coach', a.segment IN ('coaches', 'groupe'),
             'cree_le', a.cree_le) AS x
      FROM public.annonces a
      LEFT JOIN public.profiles pa ON pa.id = a.auteur_id
      LEFT JOIN public.annonces_vues v ON v.annonce_id = a.id AND v.user_id = auth.uid()
     WHERE auth.uid() IS NOT NULL
       AND a.archive_le IS NULL
       AND a.expire_le > now()
       AND v.fermee_le IS NULL
       AND NOT EXISTS (SELECT 1 FROM public.sondage_reponses r
                        WHERE r.annonce_id = a.id AND r.user_id = auth.uid())
       AND public.annonce_vise(a.segment, a.auteur_id, a.groupe_id, a.classes, auth.uid())
     ORDER BY a.cree_le ASC
     LIMIT 3
  ) t;
$$;
REVOKE ALL ON FUNCTION public.annonces_pour_moi() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.annonces_pour_moi() TO authenticated;

-- 'vue' (montrée), 'fermee' (ne plus montrer), 'clic' (lien suivi).
CREATE OR REPLACE FUNCTION public.annonce_marquer(p_annonce UUID, p_quoi TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR p_quoi NOT IN ('vue', 'fermee', 'clic') THEN RETURN false; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.annonces a WHERE a.id = p_annonce
                  AND public.annonce_vise(a.segment, a.auteur_id, a.groupe_id, a.classes, auth.uid())) THEN
    RETURN false;
  END IF;
  INSERT INTO public.annonces_vues (annonce_id, user_id) VALUES (p_annonce, auth.uid())
  ON CONFLICT (annonce_id, user_id) DO NOTHING;
  IF p_quoi = 'fermee' THEN
    UPDATE public.annonces_vues SET fermee_le = COALESCE(fermee_le, now())
     WHERE annonce_id = p_annonce AND user_id = auth.uid();
  ELSIF p_quoi = 'clic' THEN
    UPDATE public.annonces_vues SET clic_le = COALESCE(clic_le, now()), fermee_le = COALESCE(fermee_le, now())
     WHERE annonce_id = p_annonce AND user_id = auth.uid();
  END IF;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.annonce_marquer(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.annonce_marquer(UUID, TEXT) TO authenticated;

-- Répondre : { "<id question>": "opt" | ["opt", …] | 4 | "texte" }.
-- Rend 'ok' · 'deja' · 'invalide' · 'ferme'.
CREATE OR REPLACE FUNCTION public.sondage_repondre(p_annonce UUID, p_reponses JSONB)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_a      public.annonces%ROWTYPE;
  v_q      JSONB;
  v_r      JSONB;
  v_propre JSONB := '{}'::jsonb;
  v_opts   JSONB;
BEGIN
  SELECT * INTO v_a FROM public.annonces WHERE id = p_annonce;
  IF auth.uid() IS NULL OR v_a.id IS NULL OR v_a.type <> 'sondage'
     OR v_a.archive_le IS NOT NULL OR v_a.expire_le <= now()
     OR NOT public.annonce_vise(v_a.segment, v_a.auteur_id, v_a.groupe_id, v_a.classes, auth.uid()) THEN
    RETURN 'ferme';
  END IF;
  IF jsonb_typeof(p_reponses) <> 'object' THEN RETURN 'invalide'; END IF;

  -- On ne garde que des réponses bien formées aux questions posées.
  FOR v_q IN SELECT * FROM jsonb_array_elements(v_a.questions) LOOP
    v_r := p_reponses -> (v_q->>'id');
    IF v_r IS NULL OR v_r = 'null'::jsonb THEN CONTINUE; END IF;
    v_opts := v_q->'options';
    IF v_q->>'type' = 'choix' THEN
      IF jsonb_typeof(v_r) = 'string' AND v_opts ? (v_r #>> '{}') THEN
        v_propre := v_propre || jsonb_build_object(v_q->>'id', v_r);
      END IF;
    ELSIF v_q->>'type' = 'multiple' THEN
      IF jsonb_typeof(v_r) = 'array' THEN
        v_propre := v_propre || jsonb_build_object(v_q->>'id',
          (SELECT COALESCE(jsonb_agg(DISTINCT e), '[]'::jsonb)
             FROM jsonb_array_elements_text(v_r) e WHERE v_opts ? e));
      END IF;
    ELSIF v_q->>'type' = 'note' THEN
      IF jsonb_typeof(v_r) = 'number' AND (v_r #>> '{}')::numeric IN (1, 2, 3, 4, 5) THEN
        v_propre := v_propre || jsonb_build_object(v_q->>'id', (v_r #>> '{}')::int);
      END IF;
    ELSIF v_q->>'type' = 'texte' THEN
      IF jsonb_typeof(v_r) = 'string' AND char_length(btrim(v_r #>> '{}')) > 0 THEN
        v_propre := v_propre || jsonb_build_object(v_q->>'id', left(btrim(v_r #>> '{}'), 1000));
      END IF;
    END IF;
  END LOOP;

  IF v_propre = '{}'::jsonb THEN RETURN 'invalide'; END IF;

  INSERT INTO public.sondage_reponses (annonce_id, user_id, reponses)
  VALUES (p_annonce, auth.uid(), v_propre)
  ON CONFLICT (annonce_id, user_id) DO NOTHING;
  IF NOT FOUND THEN RETURN 'deja'; END IF;

  INSERT INTO public.annonces_vues (annonce_id, user_id, fermee_le) VALUES (p_annonce, auth.uid(), now())
  ON CONFLICT (annonce_id, user_id) DO UPDATE SET fermee_le = COALESCE(public.annonces_vues.fermee_le, now());
  RETURN 'ok';
END;
$$;
REVOKE ALL ON FUNCTION public.sondage_repondre(UUID, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sondage_repondre(UUID, JSONB) TO authenticated;

-- ------------------------------------------------- 4. côté auteur ---
-- Mes annonces (toutes, pour l'admin) avec leur portée mesurée.
CREATE OR REPLACE FUNCTION public.annonces_auteur(p_limite INTEGER DEFAULT 100)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin BOOLEAN := COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false);
BEGIN
  IF auth.uid() IS NULL OR NOT public.est_coach() THEN RETURN '[]'::jsonb; END IF;
  RETURN (
    SELECT COALESCE(jsonb_agg(x ORDER BY (x->>'cree_le') DESC), '[]'::jsonb) FROM (
      SELECT jsonb_build_object(
               'id', a.id, 'type', a.type, 'titre', a.titre, 'corps', a.corps,
               'lien', a.lien, 'segment', a.segment, 'classes', a.classes,
               'groupe', g.nom, 'questions', a.questions, 'anonyme', a.anonyme,
               'push', a.push, 'push_envoye_le', a.push_envoye_le,
               'auteur', pa.full_name, 'moi', a.auteur_id = auth.uid(),
               'cree_le', a.cree_le, 'expire_le', a.expire_le, 'archive_le', a.archive_le,
               'vues', (SELECT count(*) FROM public.annonces_vues v WHERE v.annonce_id = a.id),
               'fermees', (SELECT count(*) FROM public.annonces_vues v WHERE v.annonce_id = a.id AND v.fermee_le IS NOT NULL),
               'clics', (SELECT count(*) FROM public.annonces_vues v WHERE v.annonce_id = a.id AND v.clic_le IS NOT NULL),
               'reponses', (SELECT count(*) FROM public.sondage_reponses r WHERE r.annonce_id = a.id)
             ) AS x
        FROM public.annonces a
        LEFT JOIN public.coach_groupes g ON g.id = a.groupe_id
        LEFT JOIN public.profiles pa ON pa.id = a.auteur_id
       WHERE a.auteur_id = auth.uid() OR v_admin
       ORDER BY a.cree_le DESC
       LIMIT GREATEST(1, LEAST(COALESCE(p_limite, 100), 300))
    ) t
  );
END;
$$;
REVOKE ALL ON FUNCTION public.annonces_auteur(INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.annonces_auteur(INTEGER) TO authenticated;

-- Les réponses d'un sondage, brutes (l'app agrège : lib/annonces/resultats) :
-- prénom et classe sauf sondage anonyme. Auteur ou admin seulement.
CREATE OR REPLACE FUNCTION public.sondage_resultats(p_annonce UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_a public.annonces%ROWTYPE;
  v_admin BOOLEAN := COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false);
BEGIN
  SELECT * INTO v_a FROM public.annonces WHERE id = p_annonce;
  IF v_a.id IS NULL OR NOT (v_a.auteur_id = auth.uid() OR v_admin) THEN RETURN NULL; END IF;
  RETURN jsonb_build_object(
    'questions', v_a.questions,
    'anonyme', v_a.anonyme,
    'reponses', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
               'reponses', r.reponses,
               'cree_le', CASE WHEN v_a.anonyme THEN date_trunc('day', r.cree_le) ELSE r.cree_le END,
               'prenom', CASE WHEN v_a.anonyme THEN NULL ELSE p.full_name END,
               'classe', CASE WHEN v_a.anonyme THEN NULL ELSE p.grade_level END
             ) ORDER BY r.cree_le DESC), '[]'::jsonb)
        FROM public.sondage_reponses r
        LEFT JOIN public.profiles p ON p.id = r.user_id
       WHERE r.annonce_id = p_annonce
    )
  );
END;
$$;
REVOKE ALL ON FUNCTION public.sondage_resultats(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sondage_resultats(UUID) TO authenticated;

-- ------------------------------------------------- 5. la notification push ---
-- Rôle service seulement, une seule fois par annonce (la route la déclenche
-- juste après la publication).
CREATE OR REPLACE FUNCTION public.annonce_cibles_push(p_annonce UUID)
RETURNS TABLE (endpoint TEXT, p256dh TEXT, auth TEXT, titre TEXT, type TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_a public.annonces%ROWTYPE;
BEGIN
  UPDATE public.annonces SET push_envoye_le = now()
   WHERE id = p_annonce AND push AND push_envoye_le IS NULL
     AND archive_le IS NULL AND cree_le > now() - INTERVAL '1 hour'
  RETURNING * INTO v_a;
  IF v_a.id IS NULL THEN RETURN; END IF;
  RETURN QUERY
  SELECT s.endpoint, s.p256dh, s.auth, v_a.titre, v_a.type
    FROM public.push_subscriptions s
   WHERE public.annonce_vise(v_a.segment, v_a.auteur_id, v_a.groupe_id, v_a.classes, s.user_id);
END;
$$;
REVOKE ALL ON FUNCTION public.annonce_cibles_push(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.annonce_cibles_push(UUID) TO service_role;

-- =============================================================================
-- CONTRÔLES
--   select public.annonces_pour_moi();     → '[]' (sans session)
--   select public.annonce_estimer('tous'); → 0 sans session ; le compte, en admin
-- =============================================================================
