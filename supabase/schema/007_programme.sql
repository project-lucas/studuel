-- =============================================================================
-- Scolaria — Migration 007 : onboarding, flashcards du programme, gamification
-- 1) Profil élève : classe, objectif quotidien, onboarding fait
-- 2) Decks de flashcards du programme (catalogue) + cartes
-- 3) Sessions d'étude flashcards (alimentent série + heatmap)
-- PRÉREQUIS : schema.sql, 002, 003 exécutés. Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. PROFILS — personnalisation par classe
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS grade_level TEXT,                    -- 6e … Tle
  ADD COLUMN IF NOT EXISTS daily_goal  INT  NOT NULL DEFAULT 1, -- sessions/jour
  ADD COLUMN IF NOT EXISTS onboarded   BOOLEAN NOT NULL DEFAULT false;

-- L'élève peut modifier son identité et sa configuration,
-- mais toujours PAS son niveau d'abonnement (cf. migration 003).
REVOKE UPDATE ON public.profiles FROM authenticated, anon;
GRANT  UPDATE (full_name, grade_level, daily_goal, onboarded)
  ON public.profiles TO authenticated;

-- -----------------------------------------------------------------------------
-- 2. FLASHCARD_DECKS — decks du programme (catalogue public)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flashcard_decks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  subject     TEXT NOT NULL,
  grade_level TEXT,
  is_free     BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.deck_cards (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id  UUID NOT NULL REFERENCES public.flashcard_decks (id) ON DELETE CASCADE,
  front    TEXT NOT NULL,
  back     TEXT NOT NULL,
  position INT  NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS deck_cards_deck_idx ON public.deck_cards (deck_id);

ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deck_cards      ENABLE ROW LEVEL SECURITY;

-- Catalogue visible par tous ; contenu des cartes gated comme les quiz :
-- deck gratuit OU abonnement Offre 1+.
DROP POLICY IF EXISTS "flashcard_decks_select_all" ON public.flashcard_decks;
CREATE POLICY "flashcard_decks_select_all" ON public.flashcard_decks
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "deck_cards_select_gated" ON public.deck_cards;
CREATE POLICY "deck_cards_select_gated" ON public.deck_cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.flashcard_decks d
      WHERE d.id = deck_id AND d.is_free
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.subscription_tier IN ('tier1', 'tier2', 'tier3')
    )
  );

-- -----------------------------------------------------------------------------
-- 3. STUDY_SESSIONS — une session de flashcards terminée (série + heatmap)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  deck_id     UUID REFERENCES public.flashcard_decks (id) ON DELETE SET NULL,
  cards_count INT  NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS study_sessions_user_created_idx
  ON public.study_sessions (user_id, created_at DESC);

ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "study_sessions_select_own" ON public.study_sessions;
CREATE POLICY "study_sessions_select_own" ON public.study_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "study_sessions_insert_own" ON public.study_sessions;
CREATE POLICY "study_sessions_insert_own" ON public.study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- SEED — decks du programme (UUID fixes → réexécutable)
-- =============================================================================
INSERT INTO public.flashcard_decks (id, title, subject, grade_level, is_free) VALUES
  ('33333333-3333-4333-8333-333333333301', 'Vocabulaire des fractions',   'Maths',    '6e',  true),
  ('33333333-3333-4333-8333-333333333302', 'At school — vocabulaire',     'Anglais',  '6e',  true),
  ('33333333-3333-4333-8333-333333333303', 'Dates clés 1914-1945',        'Histoire', '3e',  true),
  ('33333333-3333-4333-8333-333333333304', 'Figures de style',            'Français', '1re', true),
  ('33333333-3333-4333-8333-333333333305', 'Notions de philosophie',      'Philosophie', 'Tle', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.deck_cards (id, deck_id, front, back, position) VALUES
  -- Vocabulaire des fractions (6e)
  ('44444444-4444-4444-8444-444444444401', '33333333-3333-4333-8333-333333333301', 'Numérateur', 'Le nombre au-dessus de la barre de fraction. Dans 3/4, c''est 3.', 1),
  ('44444444-4444-4444-8444-444444444402', '33333333-3333-4333-8333-333333333301', 'Dénominateur', 'Le nombre en dessous de la barre de fraction. Dans 3/4, c''est 4.', 2),
  ('44444444-4444-4444-8444-444444444403', '33333333-3333-4333-8333-333333333301', 'Fraction équivalente', 'Une fraction qui représente la même valeur : 1/2 = 2/4 = 3/6.', 3),
  ('44444444-4444-4444-8444-444444444404', '33333333-3333-4333-8333-333333333301', 'Simplifier une fraction', 'Diviser le numérateur et le dénominateur par le même nombre.', 4),
  ('44444444-4444-4444-8444-444444444405', '33333333-3333-4333-8333-333333333301', 'Que vaut 1/4 en écriture décimale ?', '0,25', 5),
  ('44444444-4444-4444-8444-444444444406', '33333333-3333-4333-8333-333333333301', 'Que valent les 3/4 de 20 ?', '15 (20 ÷ 4 = 5, puis 5 × 3 = 15).', 6),

  -- At school (6e)
  ('44444444-4444-4444-8444-444444444407', '33333333-3333-4333-8333-333333333302', 'a schoolbag', 'un cartable', 1),
  ('44444444-4444-4444-8444-444444444408', '33333333-3333-4333-8333-333333333302', 'a ruler', 'une règle', 2),
  ('44444444-4444-4444-8444-444444444409', '33333333-3333-4333-8333-333333333302', 'a notebook', 'un cahier', 3),
  ('44444444-4444-4444-8444-444444444410', '33333333-3333-4333-8333-333333333302', 'the playground', 'la cour de récréation', 4),
  ('44444444-4444-4444-8444-444444444411', '33333333-3333-4333-8333-333333333302', 'a timetable', 'un emploi du temps', 5),
  ('44444444-4444-4444-8444-444444444412', '33333333-3333-4333-8333-333333333302', 'homework', 'les devoirs', 6),
  ('44444444-4444-4444-8444-444444444413', '33333333-3333-4333-8333-333333333302', 'to learn', 'apprendre', 7),

  -- Dates clés 1914-1945 (3e)
  ('44444444-4444-4444-8444-444444444414', '33333333-3333-4333-8333-333333333303', '1914', 'Début de la Première Guerre mondiale.', 1),
  ('44444444-4444-4444-8444-444444444415', '33333333-3333-4333-8333-333333333303', '1916', 'Bataille de Verdun.', 2),
  ('44444444-4444-4444-8444-444444444416', '33333333-3333-4333-8333-333333333303', '11 novembre 1918', 'Armistice de la Première Guerre mondiale.', 3),
  ('44444444-4444-4444-8444-444444444417', '33333333-3333-4333-8333-333333333303', '1933', 'Arrivée d''Hitler au pouvoir en Allemagne.', 4),
  ('44444444-4444-4444-8444-444444444418', '33333333-3333-4333-8333-333333333303', '1936', 'Front populaire en France (congés payés).', 5),
  ('44444444-4444-4444-8444-444444444419', '33333333-3333-4333-8333-333333333303', '1er septembre 1939', 'Invasion de la Pologne : début de la Seconde Guerre mondiale.', 6),
  ('44444444-4444-4444-8444-444444444420', '33333333-3333-4333-8333-333333333303', '6 juin 1944', 'Débarquement allié en Normandie.', 7),
  ('44444444-4444-4444-8444-444444444421', '33333333-3333-4333-8333-333333333303', '8 mai 1945', 'Capitulation de l''Allemagne nazie.', 8),

  -- Figures de style (1re)
  ('44444444-4444-4444-8444-444444444422', '33333333-3333-4333-8333-333333333304', 'Métaphore', 'Image sans outil de comparaison : « Cette faucille d''or dans le champ des étoiles ».', 1),
  ('44444444-4444-4444-8444-444444444423', '33333333-3333-4333-8333-333333333304', 'Comparaison', 'Rapprochement avec un outil (comme, tel que) : « beau comme un dieu ».', 2),
  ('44444444-4444-4444-8444-444444444424', '33333333-3333-4333-8333-333333333304', 'Hyperbole', 'Exagération volontaire : « mourir de rire ».', 3),
  ('44444444-4444-4444-8444-444444444425', '33333333-3333-4333-8333-333333333304', 'Litote', 'Dire moins pour suggérer plus : « Va, je ne te hais point ».', 4),
  ('44444444-4444-4444-8444-444444444426', '33333333-3333-4333-8333-333333333304', 'Anaphore', 'Répétition d''un mot en début de phrase ou de vers.', 5),
  ('44444444-4444-4444-8444-444444444427', '33333333-3333-4333-8333-333333333304', 'Oxymore', 'Deux termes opposés accolés : « une obscure clarté ».', 6),
  ('44444444-4444-4444-8444-444444444428', '33333333-3333-4333-8333-333333333304', 'Personnification', 'Attribuer des caractéristiques humaines à une chose ou un animal.', 7),

  -- Notions de philosophie (Tle, Offre 1)
  ('44444444-4444-4444-8444-444444444429', '33333333-3333-4333-8333-333333333305', 'La conscience', 'Connaissance immédiate que l''esprit a de ses états et de ses actes.', 1),
  ('44444444-4444-4444-8444-444444444430', '33333333-3333-4333-8333-333333333305', 'Le devoir', 'Obligation morale, indépendante de la contrainte extérieure (Kant).', 2),
  ('44444444-4444-4444-8444-444444444431', '33333333-3333-4333-8333-333333333305', 'La liberté', 'Capacité d''agir selon sa propre volonté ; s''oppose au déterminisme.', 3),
  ('44444444-4444-4444-8444-444444444432', '33333333-3333-4333-8333-333333333305', 'La justice', 'Principe moral d''équité ; distinguer justice légale et justice morale.', 4),
  ('44444444-4444-4444-8444-444444444433', '33333333-3333-4333-8333-333333333305', 'La vérité', 'Adéquation entre le discours et la réalité ; s''oppose à l''opinion.', 5),
  ('44444444-4444-4444-8444-444444444434', '33333333-3333-4333-8333-333333333305', 'La technique', 'Ensemble des procédés par lesquels l''homme transforme la nature.', 6)
ON CONFLICT (id) DO NOTHING;
