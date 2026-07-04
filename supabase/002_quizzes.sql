-- =============================================================================
-- Scolaria — Migration 002 : module Test (quiz)
-- PRÉREQUIS : avoir exécuté supabase/schema.sql (profiles est référencé ici).
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : réexécutable sans erreur.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. QUIZZES — catalogue des tests (métadonnées publiques)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quizzes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  subject     TEXT NOT NULL,            -- Maths, Français, Histoire…
  grade_level TEXT,                     -- 6e à Terminale
  chapter     TEXT,                     -- chapitre du programme
  is_free     BOOLEAN NOT NULL DEFAULT false,  -- false = réservé Offre 1 (tier1+)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS quizzes_subject_idx ON public.quizzes (subject);

-- -----------------------------------------------------------------------------
-- 2. QUIZ_QUESTIONS — contenu des tests (protégé par RLS)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id       UUID NOT NULL REFERENCES public.quizzes (id) ON DELETE CASCADE,
  question      TEXT NOT NULL,
  kind          TEXT NOT NULL CHECK (kind IN ('mcq', 'true_false')),
  options       JSONB NOT NULL DEFAULT '[]'::jsonb,  -- tableau de libellés
  correct_index INT  NOT NULL DEFAULT 0,             -- index de la bonne réponse
  explanation   TEXT,
  position      INT  NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS quiz_questions_quiz_id_idx ON public.quiz_questions (quiz_id);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- Catalogue visible par tous (y compris visiteurs) ; contenu des questions
-- accessible seulement si le quiz est gratuit OU si l'utilisateur a l'Offre 1+.
-- -----------------------------------------------------------------------------
ALTER TABLE public.quizzes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quizzes_select_all" ON public.quizzes;
CREATE POLICY "quizzes_select_all" ON public.quizzes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "quiz_questions_select_gated" ON public.quiz_questions;
CREATE POLICY "quiz_questions_select_gated" ON public.quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      WHERE q.id = quiz_id AND q.is_free
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.subscription_tier IN ('tier1', 'tier2', 'tier3')
    )
  );

-- Écritures réservées au service_role / back-office (aucune policy INSERT/UPDATE).

-- =============================================================================
-- SEED — données de démonstration (UUID fixes → réexécutable)
-- =============================================================================
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free) VALUES
  ('11111111-1111-4111-8111-111111111101', 'Les fractions',                     'Maths',    '6e', 'Nombres et calculs',        true),
  ('11111111-1111-4111-8111-111111111102', 'Présent de l''indicatif',           'Français', '6e', 'Conjugaison',               false),
  ('11111111-1111-4111-8111-111111111103', 'La Révolution française',           'Histoire', '4e', 'L''Europe et le monde',     false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position) VALUES
  -- Quiz 1 : Les fractions (gratuit)
  ('22222222-2222-4222-8222-222222222201', '11111111-1111-4111-8111-111111111101',
   'Combien vaut 1/2 + 1/4 ?', 'mcq',
   '["3/4", "2/6", "1/6", "2/4"]', 0,
   'On met au même dénominateur : 1/2 = 2/4, donc 2/4 + 1/4 = 3/4.', 1),
  ('22222222-2222-4222-8222-222222222202', '11111111-1111-4111-8111-111111111101',
   '3/6 est égal à 1/2.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On simplifie 3/6 en divisant numérateur et dénominateur par 3.', 2),
  ('22222222-2222-4222-8222-222222222203', '11111111-1111-4111-8111-111111111101',
   'Quelle fraction est la plus grande ?', 'mcq',
   '["2/3", "3/5", "1/2", "4/9"]', 0,
   '2/3 ≈ 0,67 ; 3/5 = 0,6 ; 1/2 = 0,5 ; 4/9 ≈ 0,44.', 3),
  ('22222222-2222-4222-8222-222222222204', '11111111-1111-4111-8111-111111111101',
   'Le numérateur est le nombre du bas dans une fraction.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Le numérateur est en haut, le dénominateur est en bas.', 4),

  -- Quiz 2 : Présent de l'indicatif (Offre 1)
  ('22222222-2222-4222-8222-222222222205', '11111111-1111-4111-8111-111111111102',
   'Quelle est la bonne conjugaison : « Nous ___ (finir) nos devoirs. »', 'mcq',
   '["finissons", "finisons", "finnissons", "finons"]', 0,
   'Finir est un verbe du 2e groupe : nous finissons.', 1),
  ('22222222-2222-4222-8222-222222222206', '11111111-1111-4111-8111-111111111102',
   '« Ils voit » est correct au présent.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'La forme correcte est « ils voient ».', 2),
  ('22222222-2222-4222-8222-222222222207', '11111111-1111-4111-8111-111111111102',
   'Quelle est la bonne conjugaison : « Tu ___ (aller) au collège. »', 'mcq',
   '["vas", "va", "vais", "allez"]', 0,
   'Aller au présent : je vais, tu vas, il va.', 3),

  -- Quiz 3 : La Révolution française (Offre 1)
  ('22222222-2222-4222-8222-222222222208', '11111111-1111-4111-8111-111111111103',
   'En quelle année a eu lieu la prise de la Bastille ?', 'mcq',
   '["1789", "1799", "1769", "1815"]', 0,
   'La prise de la Bastille a eu lieu le 14 juillet 1789.', 1),
  ('22222222-2222-4222-8222-222222222209', '11111111-1111-4111-8111-111111111103',
   'Louis XVI a été guillotiné en 1793.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Louis XVI est guillotiné le 21 janvier 1793.', 2),
  ('22222222-2222-4222-8222-222222222210', '11111111-1111-4111-8111-111111111103',
   'Quel document est adopté en août 1789 ?', 'mcq',
   '["La Déclaration des droits de l''homme et du citoyen", "Le Code civil", "La Constitution de 1958", "L''édit de Nantes"]', 0,
   'La DDHC est adoptée le 26 août 1789.', 3)
ON CONFLICT (id) DO NOTHING;
