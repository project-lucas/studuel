-- =============================================================================
-- Studuel — Migration 316 : le carnet PERSONNALISABLE et RICHE (lots 3, 4, 5).
--
-- Suite de la 315 (le moteur). Là où la 315 réglait QUAND une carte revient,
-- celle-ci règle CE QU'ON RÉVISE, SOUS QUELLE FORME, et OÙ LE CARNET S'ACCROCHE
-- dans le reste de l'app.
--
-- 1. ÉTIQUETTES TRANSVERSES (`carnet_tags`, `carnet_question_tags`)
--    Un chapitre est un DOSSIER : une question n'y est qu'à un seul endroit.
--    Impossible, donc, de dire « révise tout ce qui est marqué *bac* » à
--    travers plusieurs cours. Les étiquettes traversent les cours.
--
-- 2. ÉCHÉANCE ET ANCRAGE D'UN COURS (`exam_on`, `subject_id`, `grade_level`)
--    Un cours du carnet n'était rattaché à RIEN : ni matière, ni classe, ni
--    date. Il ne pouvait donc pas apparaître à côté du chapitre du programme
--    qu'il révise, ni être planifié à rebours depuis la date d'un contrôle.
--
-- 3. TROIS TYPES DE QUESTION DE PLUS (appariement, remise en ordre, numérique)
--    La contrainte CHECK de la 186 fermait la liste à cinq types.
--
-- 4. MÉDIAS (bucket `carnet-medias`)
--    Le carnet était en TEXTE SEUL : pas d'image, donc pas de schéma de SVT,
--    pas de carte de géo, pas d'énoncé photographié. Le bucket est PRIVÉ et
--    rangé par élève (`<user_id>/…`) — un carnet reste privé, y compris ses
--    images.
--
-- PRÉREQUIS : 186 (carnet_*), 315 (moteur v2), 008 (subjects). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- --------------------------------------------------------------- étiquettes ---
CREATE TABLE IF NOT EXISTS public.carnet_tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  -- Même vocabulaire de teintes que les cours (lib/carnet-cours COURSE_COLORS).
  color      TEXT NOT NULL DEFAULT 'violet',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Deux étiquettes du même nom chez le même élève n'ont aucun sens : c'est le
-- moyen le plus sûr de fabriquer deux « bac » qui ne se rejoignent jamais.
CREATE UNIQUE INDEX IF NOT EXISTS carnet_tags_owner_label_idx
  ON public.carnet_tags (owner_id, lower(label));

ALTER TABLE public.carnet_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "carnet_tags_all_own" ON public.carnet_tags;
CREATE POLICY "carnet_tags_all_own" ON public.carnet_tags
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE TABLE IF NOT EXISTS public.carnet_question_tags (
  question_id UUID NOT NULL
    REFERENCES public.carnet_questions (id) ON DELETE CASCADE,
  tag_id      UUID NOT NULL
    REFERENCES public.carnet_tags (id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, tag_id)
);

-- « Quelles questions portent CETTE étiquette ? » — la requête de la portée
-- « étiquette » d'une session.
CREATE INDEX IF NOT EXISTS carnet_question_tags_tag_idx
  ON public.carnet_question_tags (tag_id);

ALTER TABLE public.carnet_question_tags ENABLE ROW LEVEL SECURITY;

-- Les DEUX bouts doivent être à l'élève : la question (via son cours) ET
-- l'étiquette. Contrôler un seul côté laisserait accrocher son étiquette à la
-- question d'un autre, ou l'étiquette d'un autre à sa propre question.
DROP POLICY IF EXISTS "carnet_question_tags_all_own"
  ON public.carnet_question_tags;
CREATE POLICY "carnet_question_tags_all_own" ON public.carnet_question_tags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.carnet_questions q
      JOIN public.carnet_courses c ON c.id = q.course_id
      WHERE q.id = question_id AND c.owner_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM public.carnet_tags t
      WHERE t.id = tag_id AND t.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carnet_questions q
      JOIN public.carnet_courses c ON c.id = q.course_id
      WHERE q.id = question_id AND c.owner_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM public.carnet_tags t
      WHERE t.id = tag_id AND t.owner_id = auth.uid()
    )
  );

-- ------------------------------------------- échéance et ancrage d'un cours ---
-- La date du contrôle : elle permet de planifier à rebours et d'afficher un
-- compte à rebours sur la carte du cours.
ALTER TABLE public.carnet_courses
  ADD COLUMN IF NOT EXISTS exam_on DATE;

-- La matière et la classe : c'est ce qui permet à un cours du carnet
-- d'apparaître DANS le dossier de la matière, à côté du programme officiel —
-- le pont que ni Anki ni Wooflash ne peuvent construire.
ALTER TABLE public.carnet_courses
  ADD COLUMN IF NOT EXISTS subject_id UUID
    REFERENCES public.subjects (id) ON DELETE SET NULL;
ALTER TABLE public.carnet_courses
  ADD COLUMN IF NOT EXISTS grade_level TEXT;

-- « Les cours de carnet de CETTE matière », pour la page de la matière.
CREATE INDEX IF NOT EXISTS carnet_courses_subject_idx
  ON public.carnet_courses (owner_id, subject_id)
  WHERE subject_id IS NOT NULL;

-- ------------------------------------------------ trois types de plus ---------
-- La contrainte de la 186 fermait la liste à cinq types. On la remplace plutôt
-- que de l'étendre en double (une contrainte du même nom ne peut exister qu'une
-- fois — le DROP la rend rejouable).
DO $$
DECLARE
  nom TEXT;
BEGIN
  SELECT conname INTO nom
  FROM pg_constraint
  WHERE conrelid = 'public.carnet_questions'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) LIKE '%texte_a_trous%';
  IF nom IS NOT NULL THEN
    EXECUTE format(
      'ALTER TABLE public.carnet_questions DROP CONSTRAINT %I', nom
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'carnet_questions_type_valide'
  ) THEN
    ALTER TABLE public.carnet_questions
      ADD CONSTRAINT carnet_questions_type_valide
      CHECK (type IN (
        'qcm', 'flashcard', 'vrai_faux', 'texte_a_trous', 'reponse_libre',
        -- Nouveaux (migration 316) :
        --   appariement     : { "paires": [ { "gauche": "…", "droite": "…" }, … ] }
        --   remise_en_ordre : { "enonce": "…", "elements": ["…", …] }  (ordre = le bon)
        --   numerique       : { "enonce": "…", "valeur": 3.14, "tolerance": 0.01,
        --                       "unite": "…"|null }
        'appariement', 'remise_en_ordre', 'numerique'
      ));
  END IF;
END $$;

-- ---------------------------------------------------------------- médias ------
-- Bucket PRIVÉ : un carnet est privé, ses images aussi. Les fichiers sont
-- rangés par élève (`<user_id>/<nom>`), et les policies s'appuient sur ce
-- premier segment de chemin.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'carnet-medias',
  'carnet-medias',
  FALSE,
  5242880,  -- 5 Mo : une photo de cours, pas une vidéo
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
  SET file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types,
      public = EXCLUDED.public;

DROP POLICY IF EXISTS "carnet_medias_lire" ON storage.objects;
CREATE POLICY "carnet_medias_lire" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'carnet-medias'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "carnet_medias_ecrire" ON storage.objects;
CREATE POLICY "carnet_medias_ecrire" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'carnet-medias'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "carnet_medias_supprimer" ON storage.objects;
CREATE POLICY "carnet_medias_supprimer" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'carnet-medias'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
