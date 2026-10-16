-- =============================================================================
-- 587 — LA MESSAGERIE DU COACH (16/10/2026)
--
-- Lucas : « avoir un channel de conversation moi et élève et parent, moi élève
-- et moi parent, au format WhatsApp ».
--
-- Trois sortes de fils, toujours ouverts par le COACH (ou l'admin) :
--   'eleve'  : le coach et l'élève ;
--   'parent' : le coach et un parent de l'élève (parent_children, 044) ;
--   'trio'   : le coach, l'élève et ce parent.
-- L'élève et le parent répondent ; ils n'ouvrent pas de fil.
--
-- LES GARDE-FOUS (des élèves mineurs écrivent à un adulte) :
--   · un fil n'est JAMAIS effacé, un message non plus (ni par son auteur) ;
--   · un fil coach ↔ élève exige un consentement : un parent lié dans l'app
--     (il voit alors que le fil existe), ou une case cochée par le coach
--     (« consentement écrit recueilli » / « l'élève est majeur ») — tracée ;
--   · l'admin lit tous les fils (supervision des coachs recrutés) ;
--   · tout membre peut SIGNALER un message (`messages_signalements`) ;
--   · un coach dont l'élève a quitté le groupe garde l'archive mais ne peut
--     plus écrire.
--
-- La table s'appelle `messages_fil` : la production garde une table `messages`
-- du schéma d'origine (sender_id, recipient_id), inutilisée, qu'on ne touche pas.
--
-- Lecture : policies `messagerie_peut_lire` (membre, ou admin) — c'est aussi ce
-- que Supabase Realtime applique aux messages poussés en direct. Écriture :
-- uniquement par RPC. Pièces jointes : bucket PRIVÉ `messagerie`, un dossier
-- par fil (`<conversation_id>/<fichier>`), lisible par les membres seuls.
--
-- PRÉREQUIS : 028 (is_admin), 044 (parent_children), 045 (push_subscriptions),
-- 560 (coach_groupes, coach_membres, est_coach). Idempotente.
-- À exécuter à la main : Supabase Dashboard → SQL Editor.
-- =============================================================================

-- ------------------------------------------------------------- 1. les fils ---
CREATE TABLE IF NOT EXISTS public.conversations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type                TEXT NOT NULL CHECK (type IN ('eleve', 'parent', 'trio')),
  coach_id            UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  eleve_id            UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  parent_id           UUID REFERENCES auth.users (id) ON DELETE CASCADE,
  consentement        TEXT CHECK (consentement IS NULL OR consentement IN ('parent_app', 'papier', 'majeur')),
  cree_le             TIMESTAMPTZ NOT NULL DEFAULT now(),
  dernier_message_le  TIMESTAMPTZ,
  dernier_extrait     TEXT CHECK (dernier_extrait IS NULL OR char_length(dernier_extrait) <= 140),
  dernier_auteur      UUID,
  CHECK ((type = 'eleve') = (parent_id IS NULL))
);
-- Un seul fil de chaque sorte entre les mêmes personnes.
CREATE UNIQUE INDEX IF NOT EXISTS conversations_unique
  ON public.conversations (coach_id, eleve_id, type,
                           COALESCE(parent_id, '00000000-0000-0000-0000-000000000000'::uuid));
CREATE INDEX IF NOT EXISTS conversations_eleve_idx ON public.conversations (eleve_id);

CREATE TABLE IF NOT EXISTS public.conversation_membres (
  conversation_id  UUID NOT NULL REFERENCES public.conversations (id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role             TEXT NOT NULL CHECK (role IN ('coach', 'eleve', 'parent')),
  lu_jusqua        TIMESTAMPTZ NOT NULL DEFAULT to_timestamp(0),
  PRIMARY KEY (conversation_id, user_id)
);
CREATE INDEX IF NOT EXISTS conversation_membres_user_idx ON public.conversation_membres (user_id);

CREATE TABLE IF NOT EXISTS public.messages_fil (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  UUID NOT NULL REFERENCES public.conversations (id) ON DELETE CASCADE,
  auteur_id        UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  corps            TEXT NOT NULL DEFAULT '' CHECK (char_length(corps) <= 4000),
  piece_chemin     TEXT CHECK (piece_chemin IS NULL OR char_length(piece_chemin) <= 200),
  piece_nom        TEXT CHECK (piece_nom IS NULL OR char_length(piece_nom) <= 120),
  piece_type       TEXT CHECK (piece_type IS NULL OR piece_type IN ('image', 'pdf')),
  cree_le          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (char_length(btrim(corps)) > 0 OR piece_chemin IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS messages_fil_conversation_idx ON public.messages_fil (conversation_id, cree_le DESC);
CREATE INDEX IF NOT EXISTS messages_fil_auteur_idx ON public.messages_fil (auteur_id, cree_le DESC);

CREATE TABLE IF NOT EXISTS public.messages_signalements (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  message_id  UUID NOT NULL REFERENCES public.messages_fil (id) ON DELETE CASCADE,
  par         UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  raison      TEXT NOT NULL CHECK (char_length(raison) BETWEEN 1 AND 500),
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now(),
  traite_le   TIMESTAMPTZ,
  UNIQUE (message_id, par)
);

-- Qui peut lire un fil : ses membres et l'admin.
CREATE OR REPLACE FUNCTION public.messagerie_peut_lire(p_conv UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false)
      OR EXISTS (
           SELECT 1
             FROM public.conversation_membres mb
             JOIN public.conversations c ON c.id = mb.conversation_id
             JOIN public.profiles p ON p.id = mb.user_id
            WHERE mb.conversation_id = p_conv
              AND mb.user_id = auth.uid()
              AND CASE mb.role
                    -- Un coach retiré (admin_retirer_coach) perd l'accès à ses fils.
                    WHEN 'coach'  THEN p.profile_type = 'coach' OR COALESCE(p.is_admin, false)
                    -- Un parent délié par l'enfant perd l'accès au fil.
                    WHEN 'parent' THEN p.profile_type = 'parent' AND EXISTS (
                                         SELECT 1 FROM public.parent_children pc
                                          WHERE pc.parent_id = mb.user_id AND pc.child_id = c.eleve_id)
                    ELSE true
                  END);
$$;
REVOKE ALL ON FUNCTION public.messagerie_peut_lire(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.messagerie_peut_lire(UUID) TO authenticated;

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_membres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages_fil ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages_signalements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS conversations_lire ON public.conversations;
CREATE POLICY conversations_lire ON public.conversations
  FOR SELECT TO authenticated USING (public.messagerie_peut_lire(id));
DROP POLICY IF EXISTS conversation_membres_lire ON public.conversation_membres;
CREATE POLICY conversation_membres_lire ON public.conversation_membres
  FOR SELECT TO authenticated USING (public.messagerie_peut_lire(conversation_id));
DROP POLICY IF EXISTS messages_fil_lire ON public.messages_fil;
CREATE POLICY messages_fil_lire ON public.messages_fil
  FOR SELECT TO authenticated USING (public.messagerie_peut_lire(conversation_id));
-- Les signalements : l'admin seul, par RPC.

REVOKE ALL ON TABLE public.conversations FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.conversation_membres FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.messages_fil FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.messages_signalements FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.conversations TO authenticated;
GRANT SELECT ON TABLE public.conversation_membres TO authenticated;
GRANT SELECT ON TABLE public.messages_fil TO authenticated;

-- Le direct : Realtime pousse les nouveaux messages aux membres (sa diffusion
-- respecte la policy de lecture ci-dessus). Absent hors Supabase (PGlite).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (SELECT 1 FROM pg_publication_tables
                      WHERE pubname = 'supabase_realtime'
                        AND schemaname = 'public' AND tablename = 'messages_fil') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages_fil;
  END IF;
END;
$$;

-- ------------------------------------------------------- 2. les liens réels ---
-- Le coach (non admin) suit-il ENCORE cet élève ? (un groupe à lui, actif).
CREATE OR REPLACE FUNCTION public.messagerie_coach_suit(p_coach UUID, p_eleve UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = p_coach), false)
      OR EXISTS (
           SELECT 1 FROM public.coach_membres m
             JOIN public.coach_groupes g ON g.id = m.groupe_id
            WHERE g.coach_id = p_coach AND g.archive_le IS NULL
              AND m.eleve_id = p_eleve AND m.statut = 'actif');
$$;
REVOKE ALL ON FUNCTION public.messagerie_coach_suit(UUID, UUID) FROM PUBLIC, anon, authenticated;

-- ------------------------------------------------------- 3. ouvrir un fil ---
-- Rend l'identifiant du fil (existant ou neuf). Erreurs levées, lues par l'app :
--   'coach_seulement' · 'eleve_inconnu' · 'sans_parent' · 'consentement'.
CREATE OR REPLACE FUNCTION public.messagerie_ouvrir(
  p_eleve UUID,
  p_type TEXT,
  p_consentement TEXT DEFAULT NULL,
  p_parent UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_moi     UUID := auth.uid();
  v_parent  UUID;
  v_consent TEXT;
  v_id      UUID;
BEGIN
  IF v_moi IS NULL OR NOT public.est_coach() THEN
    RAISE EXCEPTION 'coach_seulement' USING ERRCODE = '42501';
  END IF;
  IF p_type NOT IN ('eleve', 'parent', 'trio') THEN
    RAISE EXCEPTION 'type_inconnu';
  END IF;
  IF p_eleve IS NULL OR p_eleve = v_moi OR NOT public.messagerie_coach_suit(v_moi, p_eleve) THEN
    RAISE EXCEPTION 'eleve_inconnu' USING ERRCODE = '42501';
  END IF;

  -- Le parent : celui demandé s'il est bien lié, sinon le premier lié.
  SELECT pc.parent_id INTO v_parent
    FROM public.parent_children pc
    JOIN public.profiles pp ON pp.id = pc.parent_id AND pp.profile_type = 'parent'
   WHERE pc.child_id = p_eleve
     AND (p_parent IS NULL OR pc.parent_id = p_parent)
   ORDER BY pc.created_at ASC
   LIMIT 1;

  IF p_type IN ('parent', 'trio') AND v_parent IS NULL THEN
    RAISE EXCEPTION 'sans_parent';
  END IF;

  IF p_consentement = 'majeur' AND v_parent IS NULL
     AND (SELECT grade_level FROM public.profiles WHERE id = p_eleve) IN ('6e', '5e', '4e', '3e', '2de', '1re') THEN
    RAISE EXCEPTION 'majeur_improbable';
  END IF;
  IF v_parent IS NOT NULL THEN
    v_consent := 'parent_app';
  ELSIF p_consentement IN ('papier', 'majeur') THEN
    v_consent := p_consentement;
  ELSE
    RAISE EXCEPTION 'consentement';
  END IF;

  SELECT c.id INTO v_id
    FROM public.conversations c
   WHERE c.coach_id = v_moi AND c.eleve_id = p_eleve AND c.type = p_type
     AND (p_type = 'eleve' OR c.parent_id = v_parent);
  IF v_id IS NOT NULL THEN RETURN v_id; END IF;

  INSERT INTO public.conversations (type, coach_id, eleve_id, parent_id, consentement)
  VALUES (p_type, v_moi, p_eleve, CASE WHEN p_type = 'eleve' THEN NULL ELSE v_parent END, v_consent)
  RETURNING id INTO v_id;

  INSERT INTO public.conversation_membres (conversation_id, user_id, role, lu_jusqua)
  VALUES (v_id, v_moi, 'coach', now());
  IF p_type IN ('eleve', 'trio') THEN
    INSERT INTO public.conversation_membres (conversation_id, user_id, role)
    VALUES (v_id, p_eleve, 'eleve');
  END IF;
  IF p_type IN ('parent', 'trio') THEN
    INSERT INTO public.conversation_membres (conversation_id, user_id, role)
    VALUES (v_id, v_parent, 'parent');
  END IF;
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.messagerie_ouvrir(UUID, TEXT, TEXT, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.messagerie_ouvrir(UUID, TEXT, TEXT, UUID) TO authenticated;

-- ------------------------------------------------------- 4. écrire, lire ---
-- Erreurs : 'pas_membre' · 'vide' · 'trop_long' · 'lien_rompu' · 'trop_vite'
-- · 'piece_invalide'. Rend { id, cree_le }.
CREATE OR REPLACE FUNCTION public.message_envoyer(
  p_conv UUID,
  p_corps TEXT,
  p_piece_chemin TEXT DEFAULT NULL,
  p_piece_nom TEXT DEFAULT NULL,
  p_piece_type TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_moi    UUID := auth.uid();
  v_role   TEXT;
  v_conv   public.conversations%ROWTYPE;
  v_corps  TEXT := btrim(COALESCE(p_corps, ''));
  v_id     UUID;
  v_quand  TIMESTAMPTZ := clock_timestamp();
  v_recent INTEGER;
BEGIN
  SELECT role INTO v_role FROM public.conversation_membres
   WHERE conversation_id = p_conv AND user_id = v_moi;
  IF v_moi IS NULL OR v_role IS NULL OR NOT public.messagerie_peut_lire(p_conv) THEN
    RAISE EXCEPTION 'pas_membre' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_conv FROM public.conversations WHERE id = p_conv;

  IF char_length(v_corps) > 4000 THEN RAISE EXCEPTION 'trop_long'; END IF;
  IF p_piece_chemin IS NOT NULL THEN
    IF p_piece_type NOT IN ('image', 'pdf')
       OR p_piece_chemin NOT LIKE p_conv::text || '/%'
       OR p_piece_chemin LIKE '%..%'
       OR char_length(p_piece_chemin) > 200 THEN
      RAISE EXCEPTION 'piece_invalide';
    END IF;
  ELSIF char_length(v_corps) = 0 THEN
    RAISE EXCEPTION 'vide';
  END IF;

  -- Le coach n'écrit plus à un élève qui a quitté ses groupes (l'archive reste).
  -- Symétrique : l'élève et le parent n'écrivent plus à un coach qui ne suit plus.
  IF NOT public.messagerie_coach_suit(v_conv.coach_id, v_conv.eleve_id) THEN
    RAISE EXCEPTION 'lien_rompu';
  END IF;

  SELECT count(*) INTO v_recent FROM public.messages_fil
   WHERE auteur_id = v_moi AND cree_le > now() - INTERVAL '1 minute';
  IF v_recent >= 30 THEN RAISE EXCEPTION 'trop_vite'; END IF;

  INSERT INTO public.messages_fil (conversation_id, auteur_id, corps, piece_chemin, piece_nom, piece_type, cree_le)
  VALUES (p_conv, v_moi, v_corps, p_piece_chemin, left(p_piece_nom, 120), p_piece_type, v_quand)
  RETURNING id INTO v_id;

  UPDATE public.conversations
     SET dernier_message_le = v_quand,
         dernier_extrait = left(CASE WHEN char_length(v_corps) > 0 THEN v_corps
                                     WHEN p_piece_type = 'image' THEN '📷 Photo'
                                     ELSE '📄 Document' END, 140),
         dernier_auteur = v_moi
   WHERE id = p_conv;
  UPDATE public.conversation_membres SET lu_jusqua = v_quand
   WHERE conversation_id = p_conv AND user_id = v_moi;

  RETURN jsonb_build_object('id', v_id, 'cree_le', v_quand);
END;
$$;
REVOKE ALL ON FUNCTION public.message_envoyer(UUID, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.message_envoyer(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.messagerie_lu(p_conv UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.conversation_membres SET lu_jusqua = now()
   WHERE conversation_id = p_conv AND user_id = auth.uid()
  RETURNING true;
$$;
REVOKE ALL ON FUNCTION public.messagerie_lu(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.messagerie_lu(UUID) TO authenticated;

-- Mes fils (ou, pour l'admin qui le demande, TOUS les fils : la supervision).
-- Les noms sont résolus ici : profiles n'est pas lisible d'un compte à l'autre.
CREATE OR REPLACE FUNCTION public.messagerie_fils(p_tous BOOLEAN DEFAULT false)
RETURNS TABLE (
  id UUID,
  type TEXT,
  coach_id UUID,
  coach_prenom TEXT,
  eleve_id UUID,
  eleve_prenom TEXT,
  eleve_classe TEXT,
  parent_prenom TEXT,
  consentement TEXT,
  mon_role TEXT,
  cree_le TIMESTAMPTZ,
  dernier_message_le TIMESTAMPTZ,
  dernier_extrait TEXT,
  dernier_auteur_moi BOOLEAN,
  non_lus INTEGER,
  peut_ecrire BOOLEAN,
  signalements INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH moi AS (
    SELECT auth.uid() AS id,
           COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false) AS admin
  )
  SELECT c.id, c.type,
         c.coach_id, pc.full_name,
         c.eleve_id, pe.full_name, pe.grade_level,
         pp.full_name,
         c.consentement,
         mb.role,
         c.cree_le, c.dernier_message_le, c.dernier_extrait,
         (c.dernier_auteur = moi.id),
         CASE WHEN mb.role IS NULL THEN 0 ELSE
           (SELECT count(*)::int FROM public.messages_fil m
             WHERE m.conversation_id = c.id AND m.cree_le > mb.lu_jusqua
               AND m.auteur_id IS DISTINCT FROM moi.id) END,
         (mb.role IS NOT NULL AND public.messagerie_coach_suit(c.coach_id, c.eleve_id)),
         (SELECT count(*)::int FROM public.messages_signalements s
            JOIN public.messages_fil m ON m.id = s.message_id
           WHERE m.conversation_id = c.id AND s.traite_le IS NULL AND moi.admin)
    FROM moi
    JOIN public.conversations c ON true
    LEFT JOIN public.conversation_membres mb ON mb.conversation_id = c.id AND mb.user_id = moi.id
    LEFT JOIN public.profiles pc ON pc.id = c.coach_id
    LEFT JOIN public.profiles pe ON pe.id = c.eleve_id
    LEFT JOIN public.profiles pp ON pp.id = c.parent_id
   WHERE moi.id IS NOT NULL
     AND ((mb.user_id IS NOT NULL AND public.messagerie_peut_lire(c.id)) OR (p_tous AND moi.admin))
   ORDER BY COALESCE(c.dernier_message_le, c.cree_le) DESC
   LIMIT 500;
$$;
REVOKE ALL ON FUNCTION public.messagerie_fils(BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.messagerie_fils(BOOLEAN) TO authenticated;

-- Les messages d'un fil, du plus récent au plus ancien (pagination par date).
CREATE OR REPLACE FUNCTION public.messagerie_messages(
  p_conv UUID,
  p_avant TIMESTAMPTZ DEFAULT NULL,
  p_limite INTEGER DEFAULT 60
)
RETURNS TABLE (
  id UUID,
  auteur_id UUID,
  auteur_prenom TEXT,
  auteur_role TEXT,
  corps TEXT,
  piece_chemin TEXT,
  piece_nom TEXT,
  piece_type TEXT,
  cree_le TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.id, m.auteur_id, p.full_name, mb.role,
         m.corps, m.piece_chemin, m.piece_nom, m.piece_type, m.cree_le
    FROM public.messages_fil m
    LEFT JOIN public.profiles p ON p.id = m.auteur_id
    LEFT JOIN public.conversation_membres mb
           ON mb.conversation_id = m.conversation_id AND mb.user_id = m.auteur_id
   WHERE m.conversation_id = p_conv
     AND public.messagerie_peut_lire(p_conv)
     AND (p_avant IS NULL OR m.cree_le < p_avant)
   ORDER BY m.cree_le DESC
   LIMIT GREATEST(1, LEAST(COALESCE(p_limite, 60), 200));
$$;
REVOKE ALL ON FUNCTION public.messagerie_messages(UUID, TIMESTAMPTZ, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.messagerie_messages(UUID, TIMESTAMPTZ, INTEGER) TO authenticated;

-- Le total de mes messages non lus (la pastille), et les fils qui en ont.
CREATE OR REPLACE FUNCTION public.messagerie_non_lus()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(sum(n), 0)::int FROM (
    SELECT (SELECT count(*) FROM public.messages_fil m
             WHERE m.conversation_id = mb.conversation_id
               AND m.cree_le > mb.lu_jusqua
               AND m.auteur_id IS DISTINCT FROM mb.user_id) AS n
      FROM public.conversation_membres mb
     WHERE mb.user_id = auth.uid()
  ) t;
$$;
REVOKE ALL ON FUNCTION public.messagerie_non_lus() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.messagerie_non_lus() TO authenticated;

-- Le même message à PLUSIEURS élèves (les actions groupées du tableau) : chacun
-- dans son fil coach ↔ élève, ouvert au besoin. Mêmes règles qu'un à un (lien,
-- consentement) ; `p_consentement` vaut pour ceux qui n'ont pas de parent lié.
-- 300 élèves au plus, 1 500 messages par 10 minutes. Rend
-- { envoyes, messages: [id…], sans_consentement: [eleve_id…], ignores }.
CREATE OR REPLACE FUNCTION public.message_envoyer_groupe(
  p_eleves UUID[],
  p_corps TEXT,
  p_consentement TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_moi      UUID := auth.uid();
  v_corps    TEXT := btrim(COALESCE(p_corps, ''));
  v_e        UUID;
  v_conv     UUID;
  v_parent   BOOLEAN;
  v_id       UUID;
  v_quand    TIMESTAMPTZ;
  v_ids      UUID[] := ARRAY[]::UUID[];
  v_sans     UUID[] := ARRAY[]::UUID[];
  v_ignores  INTEGER := 0;
BEGIN
  IF v_moi IS NULL OR NOT public.est_coach() THEN
    RAISE EXCEPTION 'coach_seulement' USING ERRCODE = '42501';
  END IF;
  IF char_length(v_corps) = 0 THEN RAISE EXCEPTION 'vide'; END IF;
  IF char_length(v_corps) > 4000 THEN RAISE EXCEPTION 'trop_long'; END IF;
  IF (SELECT count(*) FROM public.messages_fil m
       WHERE m.auteur_id = v_moi AND m.cree_le > now() - INTERVAL '10 minutes') >= 1500 THEN
    RAISE EXCEPTION 'trop_vite';
  END IF;

  FOREACH v_e IN ARRAY (COALESCE(p_eleves, ARRAY[]::UUID[]))[1:300] LOOP
    IF NOT public.messagerie_coach_suit(v_moi, v_e) OR v_e = v_moi THEN
      v_ignores := v_ignores + 1;
      CONTINUE;
    END IF;
    SELECT c.id INTO v_conv FROM public.conversations c
     WHERE c.coach_id = v_moi AND c.eleve_id = v_e AND c.type = 'eleve';
    IF v_conv IS NULL THEN
      v_parent := EXISTS (SELECT 1 FROM public.parent_children pc
                            JOIN public.profiles pp ON pp.id = pc.parent_id AND pp.profile_type = 'parent'
                           WHERE pc.child_id = v_e);
      IF NOT v_parent AND p_consentement = 'majeur'
         AND (SELECT grade_level FROM public.profiles WHERE id = v_e) IN ('6e', '5e', '4e', '3e', '2de', '1re') THEN
        v_sans := array_append(v_sans, v_e);
        CONTINUE;
      END IF;
      IF NOT v_parent AND COALESCE(p_consentement, '') NOT IN ('papier', 'majeur') THEN
        v_sans := array_append(v_sans, v_e);
        CONTINUE;
      END IF;
      INSERT INTO public.conversations (type, coach_id, eleve_id, consentement)
      VALUES ('eleve', v_moi, v_e, CASE WHEN v_parent THEN 'parent_app' ELSE p_consentement END)
      RETURNING id INTO v_conv;
      INSERT INTO public.conversation_membres (conversation_id, user_id, role, lu_jusqua)
      VALUES (v_conv, v_moi, 'coach', now()), (v_conv, v_e, 'eleve', to_timestamp(0));
    END IF;
    v_quand := clock_timestamp();
    INSERT INTO public.messages_fil (conversation_id, auteur_id, corps, cree_le)
    VALUES (v_conv, v_moi, v_corps, v_quand)
    RETURNING id INTO v_id;
    UPDATE public.conversations
       SET dernier_message_le = v_quand, dernier_extrait = left(v_corps, 140), dernier_auteur = v_moi
     WHERE id = v_conv;
    UPDATE public.conversation_membres SET lu_jusqua = v_quand
     WHERE conversation_id = v_conv AND user_id = v_moi;
    v_ids := array_append(v_ids, v_id);
  END LOOP;

  RETURN jsonb_build_object(
    'envoyes', cardinality(v_ids),
    'messages', to_jsonb(v_ids),
    'sans_consentement', to_jsonb(v_sans),
    'ignores', v_ignores);
END;
$$;
REVOKE ALL ON FUNCTION public.message_envoyer_groupe(UUID[], TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.message_envoyer_groupe(UUID[], TEXT, TEXT) TO authenticated;

-- ------------------------------------------------------- 5. signaler ---
CREATE OR REPLACE FUNCTION public.message_signaler(p_message UUID, p_raison TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conv UUID;
BEGIN
  SELECT conversation_id INTO v_conv FROM public.messages_fil WHERE id = p_message;
  IF v_conv IS NULL OR NOT EXISTS (
       SELECT 1 FROM public.conversation_membres
        WHERE conversation_id = v_conv AND user_id = auth.uid()) THEN
    RETURN false;
  END IF;
  INSERT INTO public.messages_signalements (message_id, par, raison)
  VALUES (p_message, auth.uid(), left(COALESCE(NULLIF(btrim(p_raison), ''), 'Sans précision'), 500))
  ON CONFLICT (message_id, par) DO NOTHING;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.message_signaler(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.message_signaler(UUID, TEXT) TO authenticated;

-- Les signalements ouverts, pour l'admin.
CREATE OR REPLACE FUNCTION public.admin_signalements()
RETURNS TABLE (
  id BIGINT,
  message_id UUID,
  conversation_id UUID,
  corps TEXT,
  auteur_prenom TEXT,
  par_prenom TEXT,
  raison TEXT,
  cree_le TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, s.message_id, m.conversation_id, m.corps, pa.full_name, pp.full_name, s.raison, s.cree_le
    FROM public.messages_signalements s
    JOIN public.messages_fil m ON m.id = s.message_id
    LEFT JOIN public.profiles pa ON pa.id = m.auteur_id
    LEFT JOIN public.profiles pp ON pp.id = s.par
   WHERE s.traite_le IS NULL
     AND COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false)
   ORDER BY s.cree_le DESC
   LIMIT 200;
$$;
REVOKE ALL ON FUNCTION public.admin_signalements() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_signalements() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_signalement_traiter(p_id BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.messages_signalements SET traite_le = now()
   WHERE id = p_id AND traite_le IS NULL
     AND COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false)
  RETURNING true;
$$;
REVOKE ALL ON FUNCTION public.admin_signalement_traiter(BIGINT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_signalement_traiter(BIGINT) TO authenticated;

-- ------------------------------------------------- 6. le fil vu par l'élève ---
-- Pour la page /messages de l'élève et du parent : les fils de mon ENFANT dont
-- je ne suis pas membre (transparence : le parent sait qu'un fil existe, il
-- n'en lit pas le contenu).
CREATE OR REPLACE FUNCTION public.messagerie_fils_enfants()
RETURNS TABLE (
  conversation_id UUID,
  eleve_prenom TEXT,
  coach_prenom TEXT,
  cree_le TIMESTAMPTZ,
  dernier_message_le TIMESTAMPTZ,
  messages INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, pe.full_name, pc.full_name, c.cree_le, c.dernier_message_le,
         (SELECT count(*)::int FROM public.messages_fil m WHERE m.conversation_id = c.id)
    FROM public.parent_children l
    JOIN public.profiles pl ON pl.id = l.parent_id AND pl.profile_type = 'parent'
    JOIN public.conversations c ON c.eleve_id = l.child_id AND c.type = 'eleve'
    LEFT JOIN public.profiles pe ON pe.id = c.eleve_id
    LEFT JOIN public.profiles pc ON pc.id = c.coach_id
   WHERE l.parent_id = auth.uid()
   ORDER BY COALESCE(c.dernier_message_le, c.cree_le) DESC;
$$;
REVOKE ALL ON FUNCTION public.messagerie_fils_enfants() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.messagerie_fils_enfants() TO authenticated;

-- ------------------------------------------------- 7. la notification push ---
-- Rôle service seulement (la route l'appelle avec la clé service, juste après
-- l'envoi) : les appareils des AUTRES membres du fil, une seule fois par message.
CREATE TABLE IF NOT EXISTS public.messages_push (
  message_id  UUID PRIMARY KEY REFERENCES public.messages_fil (id) ON DELETE CASCADE,
  envoye_le   TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages_push ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.messages_push FROM PUBLIC, anon, authenticated;

DROP FUNCTION IF EXISTS public.messagerie_cibles_push(UUID, UUID);
CREATE OR REPLACE FUNCTION public.messagerie_cibles_push(p_message UUID, p_auteur UUID)
RETURNS TABLE (endpoint TEXT, p256dh TEXT, auth TEXT, auteur TEXT, role TEXT, destinataire TEXT, conversation_id UUID, extrait TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conv UUID;
BEGIN
  SELECT m.conversation_id INTO v_conv FROM public.messages_fil m
   WHERE m.id = p_message AND m.auteur_id = p_auteur
     AND m.cree_le > now() - INTERVAL '10 minutes';
  IF v_conv IS NULL THEN RETURN; END IF;
  INSERT INTO public.messages_push (message_id) VALUES (p_message)
  ON CONFLICT (message_id) DO NOTHING;
  IF NOT FOUND THEN RETURN; END IF;

  RETURN QUERY
  SELECT s.endpoint, s.p256dh, s.auth,
         COALESCE(pa.full_name, 'Ton coach'),
         mb_auteur.role,
         mb.role,
         v_conv,
         left(m.corps, 120)
    FROM public.messages_fil m
    JOIN public.conversation_membres mb ON mb.conversation_id = v_conv AND mb.user_id <> p_auteur
    JOIN public.push_subscriptions s ON s.user_id = mb.user_id
    LEFT JOIN public.profiles pa ON pa.id = p_auteur
    LEFT JOIN public.conversation_membres mb_auteur
           ON mb_auteur.conversation_id = v_conv AND mb_auteur.user_id = p_auteur
   WHERE m.id = p_message;
END;
$$;
REVOKE ALL ON FUNCTION public.messagerie_cibles_push(UUID, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.messagerie_cibles_push(UUID, UUID) TO service_role;

-- ------------------------------------------------- 8. les pièces jointes ---
-- Bucket PRIVÉ ; chemin `<conversation_id>/<uuid>.<ext>`. Un membre dépose et
-- lit dans le dossier de SES fils ; l'admin lit tout. Rien ne s'efface.
CREATE OR REPLACE FUNCTION public.messagerie_dossier_ok(p_nom TEXT, p_ecriture BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conv UUID;
  v_dossier TEXT := split_part(p_nom, '/', 1);
BEGIN
  IF v_dossier !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RETURN false;
  END IF;
  v_conv := v_dossier::uuid;
  IF p_ecriture THEN
    IF NOT EXISTS (SELECT 1 FROM public.conversation_membres
                    WHERE conversation_id = v_conv AND user_id = auth.uid())
       OR NOT public.messagerie_peut_lire(v_conv)
       OR NOT EXISTS (SELECT 1 FROM public.conversations c
                       WHERE c.id = v_conv AND public.messagerie_coach_suit(c.coach_id, c.eleve_id)) THEN
      RETURN false;
    END IF;
    RETURN (SELECT count(*) FROM storage.objects o
             WHERE o.bucket_id = 'messagerie' AND o.name LIKE v_dossier || '/%') < 300;
  END IF;
  RETURN public.messagerie_peut_lire(v_conv);
END;
$$;
REVOKE ALL ON FUNCTION public.messagerie_dossier_ok(TEXT, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.messagerie_dossier_ok(TEXT, BOOLEAN) TO authenticated;

DO $$
BEGIN
  IF to_regclass('storage.buckets') IS NOT NULL THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('messagerie', 'messagerie', FALSE, 8388608,
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'])
    ON CONFLICT (id) DO UPDATE
      SET file_size_limit = EXCLUDED.file_size_limit,
          allowed_mime_types = EXCLUDED.allowed_mime_types,
          public = EXCLUDED.public;

    EXECUTE 'DROP POLICY IF EXISTS "messagerie_lire" ON storage.objects';
    EXECUTE 'CREATE POLICY "messagerie_lire" ON storage.objects FOR SELECT TO authenticated
               USING (bucket_id = ''messagerie'' AND public.messagerie_dossier_ok(name, false))';
    EXECUTE 'DROP POLICY IF EXISTS "messagerie_deposer" ON storage.objects';
    EXECUTE 'CREATE POLICY "messagerie_deposer" ON storage.objects FOR INSERT TO authenticated
               WITH CHECK (bucket_id = ''messagerie'' AND public.messagerie_dossier_ok(name, true))';
  END IF;
END;
$$;

-- =============================================================================
-- CONTRÔLES (SQL Editor, après exécution)
--   select public.messagerie_non_lus();                    → 0 (sans session : 0)
--   select count(*) from pg_publication_tables
--    where pubname = 'supabase_realtime' and tablename = 'messages_fil';  → 1
--   select id, public from storage.buckets where id = 'messagerie';  → false
-- =============================================================================
