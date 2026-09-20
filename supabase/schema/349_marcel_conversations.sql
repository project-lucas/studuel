-- =============================================================================
-- Studuel — Migration 349 : Marcel — les conversations gardées
--
-- CE QU'ELLE INSTALLE.
--   1. `coach_conversations` — un fil par sujet, nommé et renommable ;
--   2. `coach_messages`      — les messages du fil (élève / Marcel).
--
-- POURQUOI. Une question à Marcel ne laissait aucune trace : la réponse
-- s'affichait, et disparaissait au rechargement. L'élève ne pouvait ni la
-- retrouver le lendemain, ni enchaîner (« explique autrement » n'avait aucun
-- « quoi »), ni la ranger dans son carnet. Trois manques pour la même cause.
--
-- CE QUE ÇA NE CHANGE PAS. Le coût. La porte reste `coach_ask_allowed`
-- (migration 215) : quota du jour, puis jeton, jamais au-delà du plafond
-- absolu. Le fil ne repart PAS en entier au modèle — deux tours tronqués
-- suffisent à donner un « quoi » à « explique autrement » (cf.
-- lib/coach/conversations.ts, qui tient cette borne et la teste).
--
-- RLS ORDINAIRE, PAS DE FONCTION DEFINER. C'est la différence avec la 215 :
-- là-bas on écrivait des COMPTEURS, qui décident de ce qui est payant, donc
-- interdits au client. Ici on écrit le texte de l'élève, dans ses propres
-- lignes — le modèle du carnet (186) s'applique tel quel : tous les droits sur
-- ce qu'on possède, rien sur le reste.
--
-- Les longueurs sont bornées EN BASE et pas seulement dans le code : un client
-- bricolé ne doit pas pouvoir pousser un mégaoctet par message.
--
-- PRÉREQUIS : 001 (profiles). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ---------------------------------------------------------------- les fils ---
CREATE TABLE IF NOT EXISTS public.coach_conversations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  -- Le titre est la première question de l'élève, coupée au mot
  -- (lib/coach/conversations.ts · titreAuto). Il se renomme.
  title        TEXT NOT NULL DEFAULT 'Nouvelle question',
  -- La matière du fil, pour rappeler la bonne méthode d'un tour à l'autre.
  subject_slug TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  ALTER TABLE public.coach_conversations
    ADD CONSTRAINT coach_conversations_title_len
    CHECK (char_length(title) BETWEEN 1 AND 120);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- L'historique se lit toujours du plus récent au plus ancien, pour un élève.
CREATE INDEX IF NOT EXISTS coach_conversations_owner_idx
  ON public.coach_conversations (owner_id, updated_at DESC);

ALTER TABLE public.coach_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS coach_conversations_all_own ON public.coach_conversations;
CREATE POLICY coach_conversations_all_own ON public.coach_conversations
  FOR ALL USING (owner_id = (SELECT auth.uid())) WITH CHECK (owner_id = (SELECT auth.uid()));

-- ------------------------------------------------------------ les messages ---
CREATE TABLE IF NOT EXISTS public.coach_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL
    REFERENCES public.coach_conversations (id) ON DELETE CASCADE,
  -- Deux voix, pas plus : l'élève et Marcel. Le mot est en français, comme le
  -- reste du domaine — la traduction vers le vocabulaire du fournisseur (user /
  -- assistant) se fait au moment de l'appel, et n'a pas à fuir jusqu'ici.
  role            TEXT NOT NULL CHECK (role IN ('eleve', 'marcel')),
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  ALTER TABLE public.coach_messages
    ADD CONSTRAINT coach_messages_content_len
    CHECK (char_length(content) BETWEEN 1 AND 4000);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Un fil se lit dans l'ordre où il s'est écrit.
CREATE INDEX IF NOT EXISTS coach_messages_fil_idx
  ON public.coach_messages (conversation_id, created_at);

ALTER TABLE public.coach_messages ENABLE ROW LEVEL SECURITY;

-- Les droits suivent le fil parent : c'est lui qui porte le propriétaire.
DROP POLICY IF EXISTS coach_messages_all_own ON public.coach_messages;
CREATE POLICY coach_messages_all_own ON public.coach_messages
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.coach_conversations c
    WHERE c.id = conversation_id AND c.owner_id = (SELECT auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.coach_conversations c
    WHERE c.id = conversation_id AND c.owner_id = (SELECT auth.uid())
  ));
