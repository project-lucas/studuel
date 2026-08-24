-- =============================================================================
-- Studuel — Migration 318 : LE MODE DICTÉE (français, toutes classes).
--
-- Un texte, découpé en SEGMENTS que l'élève écoute un par un et réécrit. À la
-- fin, sa copie est alignée sur le texte attendu (`lib/francais/dictee`), il
-- reçoit une note sur 20, la correction mot à mot, et les explications.
--
-- POURQUOI PAS DE FICHIERS AUDIO
-- Un enregistrement par segment, c'est un studio à monter avant la première
-- dictée, et des mégaoctets à servir pour chacune. La synthèse vocale du
-- navigateur (Web Speech API) lit le texte du segment — elle est déjà en place
-- dans le carnet (`BoutonEcouter`), elle ne coûte pas un octet, et elle rend
-- CHAQUE dictée jouable dès qu'elle est écrite. La colonne `audio_url` existe
-- quand même : le jour où un vrai enregistrement remplace la voix de synthèse,
-- il se pose là sans migration.
--
-- Le TEXTE ENTIER n'est pas stocké : il se recompose en concaténant les
-- segments dans l'ordre. Deux sources de vérité pour le même texte finiraient
-- fatalement par diverger — et c'est le texte de correction qui perdrait.
--
-- PRÉREQUIS : schema.sql (profiles). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ---------------------------------------------------------------- dictées ---
CREATE TABLE IF NOT EXISTS public.dictees (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT UNIQUE NOT NULL,
  titre        TEXT NOT NULL,
  -- L'origine du texte : « Brevet 2026 », « De Gaulle », « Sitting Bull »…
  source       TEXT,
  niveau       TEXT NOT NULL DEFAULT 'intermediaire'
    CHECK (niveau IN ('debutant', 'intermediaire', 'avance')),
  -- Durée annoncée sur la carte, en minutes.
  duree_min    INTEGER NOT NULL DEFAULT 8 CHECK (duree_min BETWEEN 1 AND 60),
  premium      BOOLEAN NOT NULL DEFAULT FALSE,
  -- Les classes où la dictée est proposée. VIDE = toutes : le mode s'adresse à
  -- tout le collège et tout le lycée, et une dictée sans niveau déclaré ne doit
  -- disparaître pour personne.
  grade_levels TEXT[] NOT NULL DEFAULT '{}',
  position     INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS dictees_position_idx ON public.dictees (position);

ALTER TABLE public.dictees ENABLE ROW LEVEL SECURITY;

-- Catalogue de CONTENU : lisible par tout élève connecté, écrit par personne
-- depuis l'app (les dictées entrent par migration, comme les quiz du programme).
DROP POLICY IF EXISTS "dictees_lecture" ON public.dictees;
CREATE POLICY "dictees_lecture" ON public.dictees
  FOR SELECT TO authenticated USING (true);

-- --------------------------------------------------------------- segments ---
CREATE TABLE IF NOT EXISTS public.dictee_segments (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dictee_id UUID NOT NULL REFERENCES public.dictees (id) ON DELETE CASCADE,
  position  INTEGER NOT NULL,
  -- Le morceau tel qu'il est lu ET tel qu'il doit être écrit.
  texte     TEXT NOT NULL,
  -- Enregistrement humain, s'il en existe un ; sinon la synthèse vocale lit
  -- `texte`.
  audio_url TEXT,
  UNIQUE (dictee_id, position)
);

CREATE INDEX IF NOT EXISTS dictee_segments_dictee_idx
  ON public.dictee_segments (dictee_id, position);

ALTER TABLE public.dictee_segments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dictee_segments_lecture" ON public.dictee_segments;
CREATE POLICY "dictee_segments_lecture" ON public.dictee_segments
  FOR SELECT TO authenticated USING (true);

-- ------------------------------------------------------------ tentatives ---
CREATE TABLE IF NOT EXISTS public.dictee_attempts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  dictee_id  UUID NOT NULL REFERENCES public.dictees (id) ON DELETE CASCADE,
  -- La note sur 20, au demi-point (cf. `noteSur20`).
  note       NUMERIC(4, 1) NOT NULL DEFAULT 0
    CHECK (note >= 0 AND note <= 20),
  erreurs    INTEGER NOT NULL DEFAULT 0 CHECK (erreurs >= 0),
  -- Comment l'élève a écrit : dans l'app, ou sur une feuille.
  support    TEXT NOT NULL DEFAULT 'telephone'
    CHECK (support IN ('telephone', 'papier')),
  -- La copie, gardée pour rouvrir la correction plus tard. Bornée côté serveur.
  copie      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- « Sa dernière note sur cette dictée », affichée sur la carte de la liste.
CREATE INDEX IF NOT EXISTS dictee_attempts_user_dictee_idx
  ON public.dictee_attempts (user_id, dictee_id, created_at DESC);

ALTER TABLE public.dictee_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dictee_attempts_all_own" ON public.dictee_attempts;
CREATE POLICY "dictee_attempts_all_own" ON public.dictee_attempts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------- une première dictée ------
-- De quoi jouer le mode dès l'exécution de la migration : une liste vide
-- donnerait un onglet mort, et on ne saurait pas si c'est le contenu ou le code
-- qui manque. Texte du domaine public (Blaise Cendrars, « L'Homme foudroyé »,
-- 1945 — extrait court cité à des fins pédagogiques).
INSERT INTO public.dictees (slug, titre, source, niveau, duree_min, premium, position)
VALUES (
  'homme-foudroye',
  'L''Homme foudroyé',
  'Blaise Cendrars',
  'intermediaire',
  8,
  FALSE,
  0
)
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
  d UUID;
BEGIN
  SELECT id INTO d FROM public.dictees WHERE slug = 'homme-foudroye';
  IF d IS NULL THEN RETURN; END IF;

  -- Rejouable : on repart des segments à chaque exécution plutôt que d'en
  -- empiler des doublons.
  DELETE FROM public.dictee_segments WHERE dictee_id = d;

  INSERT INTO public.dictee_segments (dictee_id, position, texte) VALUES
    (d, 0, 'La peur de mourir.'),
    (d, 1, 'Jamais je n''ai vu quelqu''un avoir aussi peur de ça que Faval.'),
    (d, 2, 'Il en devenait extravagant et tout le monde se moquait de lui'),
    (d, 3, 'et le faisait marcher.'),
    (d, 4, 'Mais lui, comprenant très bien que les camarades lui jouaient des mauvais tours'),
    (d, 5, 'ou lui montaient des bateaux pour lui faire peur, ne se fâchait jamais.');
END $$;
