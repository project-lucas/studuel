-- =============================================================================
-- 357 — L'ORIGINE D'UNE QUESTION DU CARNET (`carnet_questions.source`)
--
-- Lucas, 10/09/2026 : « on doit mieux dissocier le contenu des dossiers avec
-- un code couleur : rouge si PDF inséré dans le dossier, violet si flashcard ».
-- Le type d'une question suffit à savoir qu'elle est une flashcard ; savoir
-- qu'elle vient d'un PDF demande de le RETENIR au moment de l'écrire. D'où
-- cette colonne, posée par les actions qui créent des questions :
--
--   manuel  créée à la main         texte  IA sur un cours collé / un thème
--   pdf     IA sur un PDF inséré     photo  IA sur une photo transcrite
--
-- NULL pour les questions antérieures : elles gardent la teinte de leur type.
-- Logique pure et tests dans lib/carnet/origine.ts. Idempotente.
-- =============================================================================

ALTER TABLE public.carnet_questions
  ADD COLUMN IF NOT EXISTS source TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'carnet_questions_source_check'
      AND conrelid = 'public.carnet_questions'::regclass
  ) THEN
    ALTER TABLE public.carnet_questions
      ADD CONSTRAINT carnet_questions_source_check
      CHECK (source IS NULL OR source IN ('manuel', 'texte', 'pdf', 'photo'));
  END IF;
END $$;

-- La policy « owner par le cours » de la 186 couvre la nouvelle colonne :
-- rien à ajouter côté RLS.
