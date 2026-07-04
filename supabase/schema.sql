-- =============================================================================
-- Scolaria — Schéma initial (PostgreSQL / Supabase)
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
--
-- Fidèle au PRD (tables profiles, courses, flashcards, mind_maps, messages),
-- enrichi de : DEFAULT gen_random_uuid(), ON DELETE CASCADE, timestamps,
-- RLS activée + policies de base, et index sur les clés étrangères.
-- Idempotent : réexécutable sans erreur (IF NOT EXISTS / DROP POLICY IF EXISTS).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. PROFILES — profil applicatif lié à auth.users (abonnements)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  subscription_tier TEXT NOT NULL DEFAULT 'free'
                      CHECK (subscription_tier IN ('free', 'tier1', 'tier2', 'tier3')),
  full_name         TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 2. COURSES — contenu académique (public en lecture)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  content     TEXT,                 -- Markdown
  grade_level TEXT,                 -- 6e à Terminale
  subject     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 3. FLASHCARDS — données IA par utilisateur
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flashcards (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  front      TEXT NOT NULL,
  back       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS flashcards_user_id_idx ON public.flashcards (user_id);

-- -----------------------------------------------------------------------------
-- 4. MIND_MAPS — cartes mentales (React Flow) par utilisateur
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mind_maps (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  nodes_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  edges_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mind_maps_user_id_idx ON public.mind_maps (user_id);

-- -----------------------------------------------------------------------------
-- 5. MESSAGES — coaching (messagerie 1:1)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx    ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS messages_recipient_id_idx ON public.messages (recipient_id);

-- =============================================================================
-- ROW LEVEL SECURITY
-- Sans policy, RLS bloque tout. On active puis on ouvre le strict nécessaire.
-- =============================================================================
ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mind_maps  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages   ENABLE ROW LEVEL SECURITY;

-- PROFILES : chacun lit / crée / modifie son propre profil
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- COURSES : contenu académique lisible par tout utilisateur authentifié
-- (les écritures restent réservées au service_role / back-office)
DROP POLICY IF EXISTS "courses_select_authenticated" ON public.courses;
CREATE POLICY "courses_select_authenticated" ON public.courses
  FOR SELECT TO authenticated USING (true);

-- FLASHCARDS : le propriétaire a tous les droits sur ses cartes
DROP POLICY IF EXISTS "flashcards_all_own" ON public.flashcards;
CREATE POLICY "flashcards_all_own" ON public.flashcards
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- MIND_MAPS : le propriétaire a tous les droits sur ses cartes mentales
DROP POLICY IF EXISTS "mind_maps_all_own" ON public.mind_maps;
CREATE POLICY "mind_maps_all_own" ON public.mind_maps
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- MESSAGES : lisibles par l'expéditeur ou le destinataire ;
-- envoi autorisé uniquement en tant qu'expéditeur
DROP POLICY IF EXISTS "messages_select_participant" ON public.messages;
CREATE POLICY "messages_select_participant" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "messages_insert_as_sender" ON public.messages;
CREATE POLICY "messages_insert_as_sender" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- =============================================================================
-- AUTOMATISATIONS
-- =============================================================================

-- updated_at : mise à jour automatique à chaque UPDATE
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS courses_set_updated_at ON public.courses;
CREATE TRIGGER courses_set_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS mind_maps_set_updated_at ON public.mind_maps;
CREATE TRIGGER mind_maps_set_updated_at BEFORE UPDATE ON public.mind_maps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Création automatique d'un profil à l'inscription d'un utilisateur.
-- SECURITY DEFINER : s'exécute avec les droits du propriétaire pour
-- pouvoir écrire dans public.profiles depuis le schéma auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
