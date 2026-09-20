-- =============================================================================
-- 360 — L'EXERCICE DE CHAPITRE (le faux contrôle rédigé et corrigé par l'IA)
--
-- Lucas, 16/09/2026 : l'écran de chapitre se range en trois groupes
-- (Apprendre · Mémoriser · Se tester), le Défi solo de leçon disparaît et,
-- à sa place dans « Se tester », l'EXERCICE : un problème en maths, un texte à
-- traduire en langue, une question rédigée ailleurs — écrit par l'IA depuis le
-- cours du chapitre, noté sur 20 par elle. Réservé à Studuel+ (la correction
-- coûte un appel à chaque copie).
--
-- Deux tables :
--
--   chapter_exercices          l'épreuve, PARTAGÉE : un chapitre a le même
--                              cours pour tout le monde, donc son exercice est
--                              généré une fois et resservi. Toute personne
--                              connectée peut le lire ; celui qui le génère le
--                              signe (created_by).
--   chapter_exercice_reponses  la copie d'UN élève et sa correction : à lui
--                              seul. La meilleure note fait la pastille de la
--                              tuile « Exercice » (lib/chapter-supports).
--
-- Et le quota IA (198) apprend un troisième type d'appel, `exercice`, plafonné
-- à 12 par jour et par élève : une génération OU une correction = un appel.
--
-- Logique pure et tests dans lib/exercice.ts. Idempotente.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.chapter_exercices (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id  UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  -- probleme · traduction · redaction · application (lib/exercice.ts)
  style       TEXT NOT NULL,
  -- { titre, consigne, enonce, bareme:[{critere, points}], dureeMin }
  contenu     JSONB NOT NULL,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chapter_exercices_style_check'
      AND conrelid = 'public.chapter_exercices'::regclass
  ) THEN
    ALTER TABLE public.chapter_exercices
      ADD CONSTRAINT chapter_exercices_style_check
      CHECK (style IN ('probleme', 'traduction', 'redaction', 'application'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS chapter_exercices_chapter_idx
  ON public.chapter_exercices (chapter_id, created_at DESC);

ALTER TABLE public.chapter_exercices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chapter_exercices_select" ON public.chapter_exercices;
CREATE POLICY "chapter_exercices_select" ON public.chapter_exercices
  FOR SELECT TO authenticated USING (true);

-- Celui qui génère signe. Pas de UPDATE ni de DELETE : une épreuve rendue ne
-- change plus (les copies y sont accrochées) ; on en génère une nouvelle.
DROP POLICY IF EXISTS "chapter_exercices_insert" ON public.chapter_exercices;
CREATE POLICY "chapter_exercices_insert" ON public.chapter_exercices
  FOR INSERT TO authenticated WITH CHECK (created_by = (SELECT auth.uid()));

-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.chapter_exercice_reponses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercice_id  UUID NOT NULL REFERENCES public.chapter_exercices(id) ON DELETE CASCADE,
  -- Redondant avec exercice_id → chapter_id, mais c'est la clé de lecture de
  -- la tuile (un élève, un chapitre) : on évite une jointure à chaque écran.
  chapter_id   UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  reponse      TEXT NOT NULL,
  note         NUMERIC(4,1) NOT NULL CHECK (note >= 0 AND note <= 20),
  sur          INTEGER NOT NULL DEFAULT 20 CHECK (sur > 0),
  -- { points:[{critere, obtenu, maximum, commentaire}], bilan, corrige }
  feedback     JSONB NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chapter_exercice_reponses_user_chapter_idx
  ON public.chapter_exercice_reponses (user_id, chapter_id);

ALTER TABLE public.chapter_exercice_reponses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chapter_exercice_reponses_select_own" ON public.chapter_exercice_reponses;
CREATE POLICY "chapter_exercice_reponses_select_own" ON public.chapter_exercice_reponses
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "chapter_exercice_reponses_insert_own" ON public.chapter_exercice_reponses;
CREATE POLICY "chapter_exercice_reponses_insert_own" ON public.chapter_exercice_reponses
  FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

-- -----------------------------------------------------------------------------
-- Le quota IA (198) : un troisième type, `exercice`. Même fonction, même
-- table, même règle — le plafond est décidé ICI, jamais fourni par l'appelant.

CREATE OR REPLACE FUNCTION public.ai_call_allowed(p_kind TEXT)
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_day   DATE := (now() AT TIME ZONE 'utc')::date;
  v_limit INT;
  v_count INT;
BEGIN
  IF v_user IS NULL THEN RETURN false; END IF;

  v_limit := CASE p_kind
               WHEN 'generation' THEN 15
               WHEN 'feedback'   THEN 40
               WHEN 'exercice'   THEN 12
               ELSE 0                    -- type inconnu : rien n'est permis
             END;
  IF v_limit = 0 THEN RETURN false; END IF;

  INSERT INTO public.ai_call_attempts (user_id, day_bucket, kind, attempts)
  VALUES (v_user, v_day, p_kind, 1)
  ON CONFLICT (user_id, day_bucket, kind)
    DO UPDATE SET attempts = ai_call_attempts.attempts + 1
  RETURNING attempts INTO v_count;

  RETURN v_count <= v_limit;
END;
$$;

-- « FROM PUBLIC » seul ne ferme rien sur ce projet (cf. lib/rls-guard) : on
-- ferme les trois, puis on rouvre aux seuls comptes connectés.
REVOKE ALL ON FUNCTION public.ai_call_allowed(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ai_call_allowed(TEXT) TO authenticated;
