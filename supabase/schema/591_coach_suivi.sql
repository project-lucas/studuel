-- =============================================================================
-- 591 — LE SUIVI DU COACH ET LA GESTION DES COACHS (16/10/2026)
--
-- Lucas : « le chantier de la gestion du coach envers l'élève et plusieurs
-- élèves pour garantir un bon suivi scolaire (informations de départ) ; la
-- gestion des coachs (rapide, je suis seul pour l'instant) ; les
-- automatisations via la clé API de Claude pour m'aider à gérer des dizaines,
-- voire cent élèves ».
--
--   coach_fiches_entree : le POINT DE DÉPART d'un élève (établissement,
--                         objectif, filière visée, moyennes de départ par
--                         matière, contraintes d'emploi du temps, points
--                         forts et faibles, contact du parent) — sans lui,
--                         impossible de mesurer une progression ;
--   coach_notes         : les notes privées du coach, datées ;
--   coach_objectifs     : l'objectif de la semaine fixé par le coach (minutes,
--                         jours actifs, quiz), visible par l'élève ;
--   coach_assistant     : le cache des travaux de l'assistant IA (le tri du
--                         matin, un bilan) — on ne repaie pas deux fois le
--                         même calcul dans la journée.
-- Lecture et écriture par RPC (le lien coach ↔ élève revérifié en base) ;
-- l'élève lit SON objectif par `mon_suivi_coach`. L'admin voit les coachs, les
-- nomme et les retire (`admin_coachs`, `admin_nommer_coach`).
--
-- PRÉREQUIS : 028, 044, 084, 192, 560, 583, 587. Idempotente.
-- =============================================================================

-- Le coach suit-il cet élève (ou est-il admin) ? — 587.
-- (`messagerie_coach_suit` est réutilisée telle quelle.)

-- ------------------------------------------------------ 1. la fiche d'entrée ---
CREATE TABLE IF NOT EXISTS public.coach_fiches_entree (
  eleve_id        UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  coach_id        UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  etablissement   TEXT CHECK (etablissement IS NULL OR char_length(etablissement) <= 120),
  objectif        TEXT CHECK (objectif IS NULL OR char_length(objectif) <= 300),
  filiere         TEXT CHECK (filiere IS NULL OR char_length(filiere) <= 120),
  moyennes        JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(moyennes) = 'object' AND octet_length(moyennes::text) <= 2000),
  moyenne_generale NUMERIC(4, 2) CHECK (moyenne_generale IS NULL OR moyenne_generale BETWEEN 0 AND 20),
  contraintes     TEXT CHECK (contraintes IS NULL OR char_length(contraintes) <= 600),
  points_forts    TEXT CHECK (points_forts IS NULL OR char_length(points_forts) <= 600),
  points_faibles  TEXT CHECK (points_faibles IS NULL OR char_length(points_faibles) <= 600),
  contact_parent  TEXT CHECK (contact_parent IS NULL OR char_length(contact_parent) <= 160),
  remarques       TEXT CHECK (remarques IS NULL OR char_length(remarques) <= 2000),
  rempli_par      UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  maj_le          TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (eleve_id, coach_id)
);

CREATE TABLE IF NOT EXISTS public.coach_notes (
  id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  coach_id  UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  eleve_id  UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  corps     TEXT NOT NULL CHECK (char_length(corps) BETWEEN 1 AND 2000),
  cree_le   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS coach_notes_eleve_idx ON public.coach_notes (eleve_id, cree_le DESC);

CREATE TABLE IF NOT EXISTS public.coach_objectifs (
  eleve_id   UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  semaine    DATE NOT NULL CHECK (extract(isodow FROM semaine) = 1),
  minutes    INTEGER CHECK (minutes IS NULL OR minutes BETWEEN 0 AND 3000),
  jours      INTEGER CHECK (jours IS NULL OR jours BETWEEN 0 AND 7),
  quiz       INTEGER CHECK (quiz IS NULL OR quiz BETWEEN 0 AND 200),
  message    TEXT CHECK (message IS NULL OR char_length(message) <= 280),
  fixe_par   UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  fixe_le    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (eleve_id, semaine)
);

CREATE TABLE IF NOT EXISTS public.coach_assistant (
  coach_id  UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  cle       TEXT NOT NULL CHECK (char_length(cle) BETWEEN 1 AND 120),
  contenu   JSONB NOT NULL CHECK (octet_length(contenu::text) <= 60000),
  cree_le   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (coach_id, cle)
);

ALTER TABLE public.coach_fiches_entree ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_objectifs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_assistant ENABLE ROW LEVEL SECURITY;
-- Aucune policy : tout passe par les RPC.
REVOKE ALL ON TABLE public.coach_fiches_entree FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.coach_notes FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.coach_objectifs FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.coach_assistant FROM PUBLIC, anon, authenticated;

-- Le lundi UTC de la semaine en cours.
CREATE OR REPLACE FUNCTION public.coach_lundi()
RETURNS DATE
LANGUAGE sql
STABLE
AS $$
  SELECT (now() AT TIME ZONE 'utc')::date
         - (extract(isodow FROM (now() AT TIME ZONE 'utc')::date)::int - 1);
$$;
REVOKE ALL ON FUNCTION public.coach_lundi() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_lundi() TO authenticated;

-- ------------------------------------------------------ 2. lire, écrire ---
CREATE OR REPLACE FUNCTION public.coach_fiche_entree_lire(p_eleve UUID)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE WHEN public.est_coach() AND public.messagerie_coach_suit(auth.uid(), p_eleve)
    THEN (SELECT to_jsonb(f) - 'eleve_id' - 'coach_id' FROM public.coach_fiches_entree f
           WHERE f.eleve_id = p_eleve
             AND (f.coach_id = auth.uid()
                  OR COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false))
           ORDER BY (f.coach_id = auth.uid()) DESC, f.maj_le DESC
           LIMIT 1)
  END;
$$;
REVOKE ALL ON FUNCTION public.coach_fiche_entree_lire(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_fiche_entree_lire(UUID) TO authenticated;

-- p : les champs de la fiche (les absents ne sont pas touchés).
CREATE OR REPLACE FUNCTION public.coach_fiche_entree_enregistrer(p_eleve UUID, p JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_moy JSONB := '{}'::jsonb;
  v_k TEXT;
  v_v JSONB;
BEGIN
  IF NOT (public.est_coach() AND public.messagerie_coach_suit(auth.uid(), p_eleve)) THEN
    RETURN false;
  END IF;
  -- Les moyennes : { "Maths": 12.5, … }, 20 matières au plus, notes sur 20.
  IF jsonb_typeof(p->'moyennes') = 'object' THEN
    FOR v_k, v_v IN SELECT * FROM jsonb_each(p->'moyennes') LIMIT 20 LOOP
      IF char_length(v_k) BETWEEN 1 AND 40 AND jsonb_typeof(v_v) = 'number'
         AND (v_v #>> '{}')::numeric BETWEEN 0 AND 20 THEN
        v_moy := v_moy || jsonb_build_object(v_k, round((v_v #>> '{}')::numeric, 2));
      END IF;
    END LOOP;
  END IF;

  INSERT INTO public.coach_fiches_entree AS f (
    eleve_id, coach_id, etablissement, objectif, filiere, moyennes, moyenne_generale, contraintes,
    points_forts, points_faibles, contact_parent, remarques, rempli_par, maj_le)
  VALUES (
    p_eleve,
    auth.uid(),
    left(NULLIF(btrim(p->>'etablissement'), ''), 120),
    left(NULLIF(btrim(p->>'objectif'), ''), 300),
    left(NULLIF(btrim(p->>'filiere'), ''), 120),
    v_moy,
    CASE WHEN jsonb_typeof(p->'moyenne_generale') = 'number'
              AND (p->>'moyenne_generale')::numeric BETWEEN 0 AND 20
         THEN round((p->>'moyenne_generale')::numeric, 2) END,
    left(NULLIF(btrim(p->>'contraintes'), ''), 600),
    left(NULLIF(btrim(p->>'points_forts'), ''), 600),
    left(NULLIF(btrim(p->>'points_faibles'), ''), 600),
    left(NULLIF(btrim(p->>'contact_parent'), ''), 160),
    left(NULLIF(btrim(p->>'remarques'), ''), 2000),
    auth.uid(), now())
  ON CONFLICT (eleve_id, coach_id) DO UPDATE SET
    etablissement = EXCLUDED.etablissement,
    objectif = EXCLUDED.objectif,
    filiere = EXCLUDED.filiere,
    moyennes = EXCLUDED.moyennes,
    moyenne_generale = EXCLUDED.moyenne_generale,
    contraintes = EXCLUDED.contraintes,
    points_forts = EXCLUDED.points_forts,
    points_faibles = EXCLUDED.points_faibles,
    contact_parent = EXCLUDED.contact_parent,
    remarques = EXCLUDED.remarques,
    rempli_par = EXCLUDED.rempli_par,
    maj_le = now();
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.coach_fiche_entree_enregistrer(UUID, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_fiche_entree_enregistrer(UUID, JSONB) TO authenticated;

CREATE OR REPLACE FUNCTION public.coach_notes_lire(p_eleve UUID)
RETURNS TABLE (id BIGINT, corps TEXT, cree_le TIMESTAMPTZ, auteur TEXT, moi BOOLEAN)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT n.id, n.corps, n.cree_le, p.full_name, n.coach_id = auth.uid()
    FROM public.coach_notes n
    LEFT JOIN public.profiles p ON p.id = n.coach_id
   WHERE n.eleve_id = p_eleve
     AND public.est_coach()
     AND public.messagerie_coach_suit(auth.uid(), p_eleve)
     -- Un coach lit ses notes ; l'admin lit celles de tous les coachs.
     AND (n.coach_id = auth.uid()
          OR COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false))
   ORDER BY n.cree_le DESC
   LIMIT 200;
$$;
REVOKE ALL ON FUNCTION public.coach_notes_lire(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_notes_lire(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.coach_note_ajouter(p_eleve UUID, p_corps TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id BIGINT;
BEGIN
  IF NOT (public.est_coach() AND public.messagerie_coach_suit(auth.uid(), p_eleve))
     OR char_length(btrim(COALESCE(p_corps, ''))) = 0 THEN
    RETURN NULL;
  END IF;
  INSERT INTO public.coach_notes (coach_id, eleve_id, corps)
  VALUES (auth.uid(), p_eleve, left(btrim(p_corps), 2000))
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.coach_note_ajouter(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_note_ajouter(UUID, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.coach_note_effacer(p_id BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.coach_notes WHERE id = p_id AND coach_id = auth.uid() RETURNING true;
$$;
REVOKE ALL ON FUNCTION public.coach_note_effacer(BIGINT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_note_effacer(BIGINT) TO authenticated;

-- L'objectif de la semaine, pour un ou plusieurs élèves d'un coup (actions
-- groupées). Les élèves qu'on ne suit pas sont ignorés. Rend le nombre fixé.
CREATE OR REPLACE FUNCTION public.coach_objectif_fixer(
  p_eleves UUID[], p_minutes INTEGER, p_jours INTEGER, p_quiz INTEGER, p_message TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_n INTEGER := 0;
  v_e UUID;
BEGIN
  IF NOT public.est_coach() OR p_eleves IS NULL THEN RETURN 0; END IF;
  FOREACH v_e IN ARRAY p_eleves[1:300] LOOP
    CONTINUE WHEN NOT public.messagerie_coach_suit(auth.uid(), v_e);
    INSERT INTO public.coach_objectifs (eleve_id, semaine, minutes, jours, quiz, message, fixe_par, fixe_le)
    VALUES (v_e, public.coach_lundi(),
            CASE WHEN p_minutes BETWEEN 0 AND 3000 THEN p_minutes END,
            CASE WHEN p_jours BETWEEN 0 AND 7 THEN p_jours END,
            CASE WHEN p_quiz BETWEEN 0 AND 200 THEN p_quiz END,
            left(NULLIF(btrim(p_message), ''), 280),
            auth.uid(), now())
    ON CONFLICT (eleve_id, semaine) DO UPDATE SET
      minutes = EXCLUDED.minutes, jours = EXCLUDED.jours, quiz = EXCLUDED.quiz,
      message = EXCLUDED.message, fixe_par = EXCLUDED.fixe_par, fixe_le = now();
    v_n := v_n + 1;
  END LOOP;
  RETURN v_n;
END;
$$;
REVOKE ALL ON FUNCTION public.coach_objectif_fixer(UUID[], INTEGER, INTEGER, INTEGER, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_objectif_fixer(UUID[], INTEGER, INTEGER, INTEGER, TEXT) TO authenticated;

-- ------------------------------------------- 3. ce que la semaine a donné ---
-- L'avancée de la semaine d'un élève (depuis lundi) : minutes, jours actifs, quiz.
CREATE OR REPLACE FUNCTION public.coach_avancee_semaine(p_eleve UUID)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'minutes', COALESCE((SELECT round(sum(seconds) / 60.0) FROM public.work_daily
                          WHERE user_id = p_eleve AND day >= public.coach_lundi()), 0),
    'jours', COALESCE((SELECT count(*) FROM public.work_daily
                        WHERE user_id = p_eleve AND day >= public.coach_lundi() AND seconds > 0), 0),
    'quiz', COALESCE((SELECT count(*) FROM public.test_sessions
                       WHERE user_id = p_eleve
                         AND created_at >= public.coach_lundi()::timestamp AT TIME ZONE 'utc'), 0));
$$;
REVOKE ALL ON FUNCTION public.coach_avancee_semaine(UUID) FROM PUBLIC, anon, authenticated;

-- Le détail d'un élève pour sa fiche : huit semaines, 28 jours, l'activité
-- récente, l'objectif et son avancée, ses fils de messagerie.
CREATE OR REPLACE FUNCTION public.coach_eleve_detail(p_eleve UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today DATE := (now() AT TIME ZONE 'utc')::date;
  v_lundi DATE := public.coach_lundi();
BEGIN
  IF NOT (public.est_coach() AND public.messagerie_coach_suit(auth.uid(), p_eleve)) THEN
    RETURN NULL;
  END IF;
  RETURN jsonb_build_object(
    'semaines', (
      SELECT jsonb_agg(jsonb_build_object(
               'lundi', s.lundi,
               'minutes', COALESCE((SELECT round(sum(seconds) / 60.0) FROM public.work_daily w
                                     WHERE w.user_id = p_eleve AND w.day >= s.lundi AND w.day < s.lundi + 7), 0),
               'jours', COALESCE((SELECT count(*) FROM public.work_daily w
                                   WHERE w.user_id = p_eleve AND w.day >= s.lundi AND w.day < s.lundi + 7 AND w.seconds > 0), 0),
               'quiz', COALESCE((SELECT count(*) FROM public.test_sessions t
                                  WHERE t.user_id = p_eleve
                                    AND t.created_at >= s.lundi::timestamp AT TIME ZONE 'utc'
                                    AND t.created_at < (s.lundi + 7)::timestamp AT TIME ZONE 'utc'), 0),
               'score', (SELECT round(avg(least(t.score::numeric / NULLIF(t.total, 0), 1)), 3)
                           FROM public.test_sessions t
                          WHERE t.user_id = p_eleve AND t.total > 0
                            AND t.created_at >= s.lundi::timestamp AT TIME ZONE 'utc'
                            AND t.created_at < (s.lundi + 7)::timestamp AT TIME ZONE 'utc'))
             ORDER BY s.lundi)
        FROM (SELECT v_lundi - 7 * g AS lundi FROM generate_series(0, 7) g) s),
    'jours', (
      SELECT jsonb_agg(jsonb_build_object('jour', d.jour,
               'minutes', COALESCE((SELECT round(w.seconds / 60.0) FROM public.work_daily w
                                     WHERE w.user_id = p_eleve AND w.day = d.jour), 0)) ORDER BY d.jour)
        FROM (SELECT v_today - g AS jour FROM generate_series(0, 27) g) d),
    'recent', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('source', x.source, 'xp', x.amount, 'quand', x.created_at)
                                ORDER BY x.created_at DESC), '[]'::jsonb)
        FROM (SELECT source, amount, created_at FROM public.xp_events
               WHERE user_id = p_eleve ORDER BY created_at DESC LIMIT 25) x),
    'objectif', (
      SELECT to_jsonb(o) - 'eleve_id' FROM public.coach_objectifs o
       WHERE o.eleve_id = p_eleve AND o.semaine = v_lundi),
    'avancee', public.coach_avancee_semaine(p_eleve),
    'parents', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('id', pp.id, 'prenom', pp.full_name)), '[]'::jsonb)
        FROM public.parent_children pc JOIN public.profiles pp ON pp.id = pc.parent_id
       WHERE pc.child_id = p_eleve),
    'fils', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object('id', c.id, 'type', c.type, 'dernier', c.dernier_message_le)), '[]'::jsonb)
        FROM public.conversations c
       WHERE c.eleve_id = p_eleve AND c.coach_id = auth.uid())
  );
END;
$$;
REVOKE ALL ON FUNCTION public.coach_eleve_detail(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_eleve_detail(UUID) TO authenticated;

-- Le complément du tableau (une lecture pour tous les élèves) : l'objectif de
-- la semaine et son avancée, les messages non lus, la fiche d'entrée remplie.
CREATE OR REPLACE FUNCTION public.coach_tableau_suivi()
RETURNS TABLE (
  eleve_id UUID,
  obj_minutes INTEGER,
  obj_jours INTEGER,
  obj_quiz INTEGER,
  minutes_semaine INTEGER,
  jours_semaine INTEGER,
  quiz_semaine INTEGER,
  non_lus INTEGER,
  fiche_entree BOOLEAN,
  parent_lie BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH membres AS (
    SELECT DISTINCT m.eleve_id
      FROM public.coach_membres m
      JOIN public.coach_groupes g ON g.id = m.groupe_id
     WHERE g.coach_id = auth.uid() AND g.archive_le IS NULL AND m.statut = 'actif'
  ),
  lundi AS (SELECT public.coach_lundi() AS d)
  SELECT mb.eleve_id,
         o.minutes, o.jours, o.quiz,
         COALESCE((SELECT round(sum(w.seconds) / 60.0)::int FROM public.work_daily w, lundi
                    WHERE w.user_id = mb.eleve_id AND w.day >= lundi.d), 0),
         COALESCE((SELECT count(*)::int FROM public.work_daily w, lundi
                    WHERE w.user_id = mb.eleve_id AND w.day >= lundi.d AND w.seconds > 0), 0),
         COALESCE((SELECT count(*)::int FROM public.test_sessions t, lundi
                    WHERE t.user_id = mb.eleve_id AND t.created_at >= lundi.d::timestamp AT TIME ZONE 'utc'), 0),
         COALESCE((SELECT count(*)::int FROM public.conversations c
                     JOIN public.conversation_membres cm ON cm.conversation_id = c.id AND cm.user_id = auth.uid()
                     JOIN public.messages_fil msg ON msg.conversation_id = c.id
                    WHERE c.eleve_id = mb.eleve_id AND msg.cree_le > cm.lu_jusqua
                      AND msg.auteur_id IS DISTINCT FROM auth.uid()), 0),
         EXISTS (SELECT 1 FROM public.coach_fiches_entree f WHERE f.eleve_id = mb.eleve_id AND f.coach_id = auth.uid()),
         EXISTS (SELECT 1 FROM public.parent_children pc WHERE pc.child_id = mb.eleve_id)
    FROM membres mb
    CROSS JOIN lundi
    LEFT JOIN public.coach_objectifs o ON o.eleve_id = mb.eleve_id AND o.semaine = lundi.d;
$$;
REVOKE ALL ON FUNCTION public.coach_tableau_suivi() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_tableau_suivi() TO authenticated;

-- ------------------------------------------------------ 4. côté élève ---
-- Mon coach, mon objectif de la semaine et où j'en suis, mes non-lus.
CREATE OR REPLACE FUNCTION public.mon_suivi_coach()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE WHEN auth.uid() IS NULL THEN NULL ELSE jsonb_build_object(
    'objectif', (SELECT to_jsonb(o) - 'eleve_id' - 'fixe_par' FROM public.coach_objectifs o
                  WHERE o.eleve_id = auth.uid() AND o.semaine = public.coach_lundi()),
    'avancee', public.coach_avancee_semaine(auth.uid()),
    'non_lus', public.messagerie_non_lus(),
    'fils', (SELECT count(*) FROM public.conversation_membres WHERE user_id = auth.uid())
  ) END;
$$;
REVOKE ALL ON FUNCTION public.mon_suivi_coach() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mon_suivi_coach() TO authenticated;

-- ------------------------------------------------------ 5. le cache IA ---
-- Le plafond : 80 travaux de l'assistant par coach et par jour (UTC). L'app
-- prend un jeton AVANT d'appeler Claude ; sans jeton, pas d'appel.
CREATE TABLE IF NOT EXISTS public.coach_ia_usage (
  coach_id  UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  jour      DATE NOT NULL,
  n         INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (coach_id, jour)
);
ALTER TABLE public.coach_ia_usage ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.coach_ia_usage FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.coach_ia_jeton()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_n INTEGER;
BEGIN
  IF auth.uid() IS NULL OR NOT public.est_coach() THEN RETURN false; END IF;
  INSERT INTO public.coach_ia_usage (coach_id, jour, n)
  VALUES (auth.uid(), (now() AT TIME ZONE 'utc')::date, 1)
  ON CONFLICT (coach_id, jour) DO UPDATE SET n = public.coach_ia_usage.n + 1
  RETURNING n INTO v_n;
  RETURN v_n <= 80;
END;
$$;
REVOKE ALL ON FUNCTION public.coach_ia_jeton() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_ia_jeton() TO authenticated;

CREATE OR REPLACE FUNCTION public.coach_assistant_lire(p_cle TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object('contenu', contenu, 'cree_le', cree_le)
    FROM public.coach_assistant
   WHERE coach_id = auth.uid() AND cle = p_cle AND public.est_coach();
$$;
REVOKE ALL ON FUNCTION public.coach_assistant_lire(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_assistant_lire(TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.coach_assistant_ecrire(p_cle TEXT, p_contenu JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.est_coach() THEN RETURN false; END IF;
  INSERT INTO public.coach_assistant (coach_id, cle, contenu)
  VALUES (auth.uid(), left(p_cle, 120), p_contenu)
  ON CONFLICT (coach_id, cle) DO UPDATE SET contenu = EXCLUDED.contenu, cree_le = now();
  -- Ménage : un mois de travaux.
  DELETE FROM public.coach_assistant WHERE coach_id = auth.uid() AND cree_le < now() - INTERVAL '31 days';
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.coach_assistant_ecrire(TEXT, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_assistant_ecrire(TEXT, JSONB) TO authenticated;

-- ------------------------------------------------- 6. la gestion des coachs ---
-- Les coachs (comptes 'coach' et admins), leur charge et leur activité.
CREATE OR REPLACE FUNCTION public.admin_coachs()
RETURNS TABLE (
  id UUID,
  prenom TEXT,
  email TEXT,
  admin BOOLEAN,
  groupes INTEGER,
  eleves INTEGER,
  eleves_inactifs_7 INTEGER,
  messages_7 INTEGER,
  fils_en_attente INTEGER,
  derniere_connexion TIMESTAMPTZ,
  cree_le TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT p.id, p.full_name, u.email::text, COALESCE(p.is_admin, false),
         (SELECT count(*)::int FROM public.coach_groupes g WHERE g.coach_id = p.id AND g.archive_le IS NULL),
         (SELECT count(DISTINCT m.eleve_id)::int FROM public.coach_membres m
            JOIN public.coach_groupes g ON g.id = m.groupe_id
           WHERE g.coach_id = p.id AND g.archive_le IS NULL AND m.statut = 'actif'),
         (SELECT count(DISTINCT m.eleve_id)::int FROM public.coach_membres m
            JOIN public.coach_groupes g ON g.id = m.groupe_id
           WHERE g.coach_id = p.id AND g.archive_le IS NULL AND m.statut = 'actif'
             AND NOT EXISTS (SELECT 1 FROM public.work_daily w
                              WHERE w.user_id = m.eleve_id AND w.seconds > 0
                                AND w.day > (now() AT TIME ZONE 'utc')::date - 7)),
         (SELECT count(*)::int FROM public.messages_fil msg
           WHERE msg.auteur_id = p.id AND msg.cree_le > now() - INTERVAL '7 days'),
         -- Un fil « en attente » : son dernier message n'est pas du coach et a
         -- plus de 24 h.
         (SELECT count(*)::int FROM public.conversations c
           WHERE c.coach_id = p.id AND c.dernier_auteur IS DISTINCT FROM p.id
             AND c.dernier_message_le < now() - INTERVAL '24 hours'),
         u.last_sign_in_at,
         p.created_at
    FROM public.profiles p
    LEFT JOIN auth.users u ON u.id = p.id
   WHERE (p.profile_type = 'coach' OR p.is_admin = true)
     AND COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false)
   ORDER BY p.is_admin DESC NULLS LAST, p.full_name;
$$;
REVOKE ALL ON FUNCTION public.admin_coachs() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_coachs() TO authenticated;

-- Nommer un coach par son e-mail. Rend 'ok' · 'introuvable' · 'deja' ·
-- 'parent' (un compte parent ne devient pas coach) · 'refuse'.
CREATE OR REPLACE FUNCTION public.admin_nommer_coach(p_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_id UUID;
  v_type TEXT;
BEGIN
  IF NOT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false) THEN
    RETURN 'refuse';
  END IF;
  SELECT u.id INTO v_id FROM auth.users u WHERE lower(u.email) = lower(btrim(p_email)) LIMIT 1;
  IF v_id IS NULL THEN RETURN 'introuvable'; END IF;
  SELECT profile_type INTO v_type FROM public.profiles WHERE id = v_id;
  IF v_type = 'coach' THEN RETURN 'deja'; END IF;
  IF v_type = 'parent' THEN RETURN 'parent'; END IF;
  UPDATE public.profiles SET profile_type = 'coach' WHERE id = v_id;
  -- Un coach ne reste pas dans le groupe d'un autre coach.
  UPDATE public.coach_membres SET statut = 'revoque', revoque_le = now(), revoque_par = 'coach'
   WHERE eleve_id = v_id AND statut = 'actif';
  RETURN 'ok';
END;
$$;
REVOKE ALL ON FUNCTION public.admin_nommer_coach(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_nommer_coach(TEXT) TO authenticated;

-- Retirer le rôle : le compte redevient élève, ses groupes sont archivés (les
-- codes cessent de marcher ; rien n'est effacé, les fils restent lisibles par
-- l'admin).
CREATE OR REPLACE FUNCTION public.admin_retirer_coach(p_user UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false)
     OR p_user = auth.uid() THEN
    RETURN false;
  END IF;
  UPDATE public.profiles SET profile_type = 'eleve' WHERE id = p_user AND profile_type = 'coach';
  IF NOT FOUND THEN RETURN false; END IF;
  UPDATE public.coach_groupes SET archive_le = now() WHERE coach_id = p_user AND archive_le IS NULL;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.admin_retirer_coach(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_retirer_coach(UUID) TO authenticated;

-- =============================================================================
-- CONTRÔLES
--   select public.mon_suivi_coach();      → NULL sans session
--   select * from public.admin_coachs();  → (connecté en admin) les coachs
-- =============================================================================
