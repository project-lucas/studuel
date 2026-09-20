-- =============================================================================
-- Studuel — Migration 222 : L'ÉCHELLE DE L'ORAL (doctrine COACH-PROF §4)
--
-- Le bac de français, le grand oral et l'oral du brevet se jouent à l'oral, et
-- aucune app ne s'en occupe : tout le monde cherche à faire NOTER l'oral par une
-- IA. Studuel ne note pas — il fait **répéter**. Quatre barreaux :
--
--   1. les cartes (le carnet et les flashcards existent déjà) ;
--   2. seul, à voix haute, chrono — l'app ne capte RIEN, elle compte le temps ;
--   3. enregistré, avec auto-évaluation sur trois critères ;
--   4. devant quelqu'un — un ami coche les MÊMES trois critères.
--
-- Coût IA : ZÉRO à tous les barreaux. Et le barreau 4 est le seul usage social
-- vraiment neuf de la doctrine : il branche Marcel sur l'onglet Amis et donne
-- une raison d'inviter quelqu'un.
--
-- ⚠️ CE QUI N'EST **PAS** STOCKÉ, ET C'EST LE POINT LE PLUS IMPORTANT :
--    **aucun audio.** Jamais. L'enregistrement du barreau 3 vit dans le
--    navigateur (MediaRecorder → URL locale) et meurt avec l'onglet. On stocke
--    une DURÉE et trois cases à cocher. Pas de voix de mineur sur nos serveurs,
--    donc pas de RGPD à porter, pas de facture de stockage, et rien à fuiter.
--
-- SÉCURITÉ
--   · `oral_sessions` : chacun ne voit et n'écrit que ses lignes.
--   · `oral_listen_requests` : une demande n'existe qu'entre AMIS ACCEPTÉS,
--     vérifié EN BASE par `request_oral_listen` (SECURITY DEFINER) — un appel
--     direct à la clé anon ne permet pas de spammer un inconnu.
--   · L'auditeur ne peut répondre qu'à une demande qui lui est adressée, et
--     seulement une fois : `answer_oral_listen` refuse une demande déjà traitée.
--   · Anti-spam : 20 demandes par élève et par jour, comptées en base.
--
-- Miroir applicatif : `lib/coach/oral.ts` (barreaux, critères, seuils), testé.
--
-- PRÉREQUIS : schema.sql (profiles), 019 (friendships). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. ORAL_SESSIONS — un passage, quel que soit le barreau
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.oral_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  barreau     SMALLINT NOT NULL CHECK (barreau BETWEEN 1 AND 4),
  epreuve     TEXT NOT NULL DEFAULT 'libre',
  sujet       TEXT NOT NULL CHECK (length(sujet) BETWEEN 3 AND 120),
  -- Secondes réellement tenues. Bornée à 2 heures : au-delà, c'est un minuteur
  -- oublié, pas un oral — et une valeur absurde fausserait « meilleure durée ».
  duree       INTEGER NOT NULL DEFAULT 0 CHECK (duree BETWEEN 0 AND 7200),
  -- Les trois critères. NULL = passage sans auto-évaluation (barreau 2).
  intro       BOOLEAN,
  plan        BOOLEAN,
  transitions BOOLEAN,
  jour        DATE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS oral_sessions_user_idx
  ON public.oral_sessions (user_id, created_at DESC);

ALTER TABLE public.oral_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "oral_sessions_own" ON public.oral_sessions;
CREATE POLICY "oral_sessions_own" ON public.oral_sessions
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

REVOKE ALL ON public.oral_sessions FROM authenticated, anon;
GRANT SELECT, INSERT ON public.oral_sessions TO authenticated;

-- -----------------------------------------------------------------------------
-- 2. ORAL_LISTEN_REQUESTS — le barreau 4
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.oral_listen_requests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  speaker_id   UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  listener_id  UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  sujet        TEXT NOT NULL CHECK (length(sujet) BETWEEN 3 AND 120),
  epreuve      TEXT NOT NULL DEFAULT 'libre',
  statut       TEXT NOT NULL DEFAULT 'en_attente'
               CHECK (statut IN ('en_attente', 'ecoutee', 'refusee')),
  intro        BOOLEAN,
  plan         BOOLEAN,
  transitions  BOOLEAN,
  commentaire  TEXT CHECK (commentaire IS NULL OR length(commentaire) <= 280),
  jour         DATE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  answered_at  TIMESTAMPTZ,
  CHECK (speaker_id <> listener_id)
);

CREATE INDEX IF NOT EXISTS oral_listen_speaker_idx
  ON public.oral_listen_requests (speaker_id, created_at DESC);
CREATE INDEX IF NOT EXISTS oral_listen_listener_pending_idx
  ON public.oral_listen_requests (listener_id, created_at DESC)
  WHERE statut = 'en_attente';

ALTER TABLE public.oral_listen_requests ENABLE ROW LEVEL SECURITY;

-- Les deux parties LISENT la demande. Aucune policy d'écriture : tout passe par
-- les deux RPC ci-dessous, qui vérifient l'amitié et l'unicité de la réponse.
DROP POLICY IF EXISTS "oral_listen_select_parties" ON public.oral_listen_requests;
CREATE POLICY "oral_listen_select_parties" ON public.oral_listen_requests
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) IN (speaker_id, listener_id));

REVOKE ALL ON public.oral_listen_requests FROM authenticated, anon;
GRANT SELECT ON public.oral_listen_requests TO authenticated;

-- -----------------------------------------------------------------------------
-- 3. REQUEST_ORAL_LISTEN — demander à un ami de m'écouter
--    Renvoie : 'sent' | 'not_friend' | 'already' | 'rate_limited'
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.request_oral_listen(
  p_listener_id UUID,
  p_sujet TEXT,
  p_epreuve TEXT DEFAULT 'libre'
)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_me    UUID := auth.uid();
  v_jour  DATE := (now() AT TIME ZONE 'utc')::date;
  v_count INTEGER;
BEGIN
  IF v_me IS NULL OR p_listener_id = v_me THEN
    RETURN 'not_friend';
  END IF;

  -- L'amitié est vérifiée ICI, en base : on ne demande pas au client de le
  -- garantir. Sans cela, n'importe qui pourrait faire sonner n'importe qui.
  IF NOT EXISTS (
    SELECT 1 FROM public.friendships f
     WHERE f.status = 'accepted'
       AND ((f.requester_id = v_me AND f.addressee_id = p_listener_id)
         OR (f.addressee_id = v_me AND f.requester_id = p_listener_id))
  ) THEN
    RETURN 'not_friend';
  END IF;

  -- Une seule demande en attente par binôme : sans cette garde, un élève
  -- pressé remplirait l'écran de son ami avec le même exposé.
  IF EXISTS (
    SELECT 1 FROM public.oral_listen_requests r
     WHERE r.speaker_id = v_me
       AND r.listener_id = p_listener_id
       AND r.statut = 'en_attente'
  ) THEN
    RETURN 'already';
  END IF;

  SELECT count(*) INTO v_count
    FROM public.oral_listen_requests r
   WHERE r.speaker_id = v_me AND r.jour = v_jour;
  IF v_count >= 20 THEN
    RETURN 'rate_limited';
  END IF;

  INSERT INTO public.oral_listen_requests (speaker_id, listener_id, sujet, epreuve)
  VALUES (v_me, p_listener_id, trim(p_sujet), COALESCE(p_epreuve, 'libre'));

  RETURN 'sent';
END $$;

REVOKE ALL ON FUNCTION public.request_oral_listen(UUID, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_oral_listen(UUID, TEXT, TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 4. ANSWER_ORAL_LISTEN — l'ami coche les trois cases
--    Renvoie : 'ok' | 'not_found' | 'already'
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.answer_oral_listen(
  p_request_id UUID,
  p_intro BOOLEAN,
  p_plan BOOLEAN,
  p_transitions BOOLEAN,
  p_commentaire TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_me     UUID := auth.uid();
  v_statut TEXT;
BEGIN
  SELECT statut INTO v_statut
    FROM public.oral_listen_requests
   WHERE id = p_request_id AND listener_id = v_me;

  IF v_statut IS NULL THEN RETURN 'not_found'; END IF;
  -- Une écoute ne se rejoue pas : le premier retour est le bon. Sans cette
  -- garde, un auditeur pourrait réécrire son verdict indéfiniment.
  IF v_statut <> 'en_attente' THEN RETURN 'already'; END IF;

  UPDATE public.oral_listen_requests
     SET statut = 'ecoutee',
         intro = COALESCE(p_intro, false),
         plan = COALESCE(p_plan, false),
         transitions = COALESCE(p_transitions, false),
         commentaire = NULLIF(trim(COALESCE(p_commentaire, '')), ''),
         answered_at = now()
   WHERE id = p_request_id;

  -- Le passage entre au compteur de CELUI QUI PARLE : c'est son barreau 4,
  -- pas celui de l'auditeur. Sans cette ligne, l'échelle ne se refermerait
  -- jamais et Marcel réclamerait éternellement un auditeur.
  INSERT INTO public.oral_sessions
    (user_id, barreau, epreuve, sujet, duree, intro, plan, transitions)
  SELECT r.speaker_id, 4, r.epreuve, r.sujet, 0,
         COALESCE(p_intro, false), COALESCE(p_plan, false), COALESCE(p_transitions, false)
    FROM public.oral_listen_requests r
   WHERE r.id = p_request_id;

  RETURN 'ok';
END $$;

REVOKE ALL ON FUNCTION public.answer_oral_listen(UUID, BOOLEAN, BOOLEAN, BOOLEAN, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.answer_oral_listen(UUID, BOOLEAN, BOOLEAN, BOOLEAN, TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 5. DECLINE_ORAL_LISTEN — refuser sans vexer (et sans laisser en attente)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.decline_oral_listen(p_request_id UUID)
RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_me UUID := auth.uid();
BEGIN
  UPDATE public.oral_listen_requests
     SET statut = 'refusee', answered_at = now()
   WHERE id = p_request_id AND listener_id = v_me AND statut = 'en_attente';
  IF NOT FOUND THEN RETURN 'not_found'; END IF;
  RETURN 'ok';
END $$;

REVOKE ALL ON FUNCTION public.decline_oral_listen(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.decline_oral_listen(UUID) TO authenticated;

-- -----------------------------------------------------------------------------
-- 6. LES DEUX LECTURES CROISÉES — par RPC, jamais par jointure
--
-- `profiles` est en RLS « soi uniquement » (schema.sql) : une jointure
-- PostgREST vers le profil d'un ami ne renvoie RIEN. Sans ces deux fonctions,
-- la liste d'amis du barreau 4 serait vide et chaque demande d'écoute
-- s'afficherait « Un ami » — la fonctionnalité aurait l'air cassée sans lever
-- la moindre erreur. C'est le mode de panne n°1 du projet.
--
-- Convention reprise des RPC sociales existantes (159/160/164) : SECURITY
-- DEFINER, et **prénom seul** — jamais le nom de famille d'un mineur.
-- -----------------------------------------------------------------------------

-- Mes amis acceptés, pour proposer « demande à quelqu'un de t'écouter ».
CREATE OR REPLACE FUNCTION public.oral_friends()
RETURNS TABLE (id UUID, name TEXT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, split_part(COALESCE(p.full_name, 'Ami'), ' ', 1)
    FROM public.friendships f
    JOIN public.profiles p
      ON p.id = CASE WHEN f.requester_id = auth.uid()
                     THEN f.addressee_id ELSE f.requester_id END
   WHERE f.status = 'accepted'
     AND auth.uid() IN (f.requester_id, f.addressee_id)
   ORDER BY 2;
$$;

REVOKE ALL ON FUNCTION public.oral_friends() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.oral_friends() TO authenticated;

-- Les demandes d'écoute qui M'ATTENDENT, avec le prénom de qui parle.
CREATE OR REPLACE FUNCTION public.oral_listen_inbox()
RETURNS TABLE (id UUID, sujet TEXT, epreuve TEXT, speaker_name TEXT, created_at TIMESTAMPTZ)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.id, r.sujet, r.epreuve,
         split_part(COALESCE(p.full_name, 'Un ami'), ' ', 1),
         r.created_at
    FROM public.oral_listen_requests r
    JOIN public.profiles p ON p.id = r.speaker_id
   WHERE r.listener_id = auth.uid()
     AND r.statut = 'en_attente'
   ORDER BY r.created_at DESC
   LIMIT 10;
$$;

REVOKE ALL ON FUNCTION public.oral_listen_inbox() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.oral_listen_inbox() TO authenticated;

-- -----------------------------------------------------------------------------
-- 7. Sonde finale
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.oral_sessions') IS NULL
     OR to_regclass('public.oral_listen_requests') IS NULL THEN
    RAISE EXCEPTION 'Migration 222 incomplete : tables absentes';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'request_oral_listen')
     OR NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'answer_oral_listen')
     OR NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'oral_friends')
     OR NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'oral_listen_inbox') THEN
    RAISE EXCEPTION 'Migration 222 incomplete : RPC absentes';
  END IF;
  RAISE NOTICE 'Migration 222 OK : l''echelle de l''oral est en place.';
END $$;
