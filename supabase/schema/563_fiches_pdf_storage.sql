-- =============================================================================
-- Studuel — Migration 563 : LES FICHES DE RÉVISION EN PDF (13/10/2026).
--
-- Les 260 fiches du MVP (docs/fiches-mvp.md : une page A4 composée par
-- scripts/fiches-rendre.mjs, illustrée) sont vendues PAR CHAPITRE, au prix et
-- par la porte qui existent déjà : `chapter_unlocks` (183, 30 gemmes via
-- `unlock_chapter_with_gem`) ou l'abonnement Studuel+. Rien ne change au
-- déblocage ; cette migration ne fait que RANGER les fichiers et en GARDER la
-- lecture.
--
--   1. Le bucket PRIVÉ `fiches` : un objet par chapitre, `<chapter_id>.pdf`.
--      Déposé par `node scripts/fiches-deposer.mjs` (clé service, hors app).
--      Jamais `public/` : Next servirait le PDF à qui connaît l'adresse.
--   2. Le bucket PUBLIC `fiches-apercus` : l'illustration de la fiche en 360 px,
--      `<chapter_id>.webp`. Elle VEND la fiche à qui ne l'a pas encore : ce
--      n'est pas le contenu payant (le PDF l'est), et l'app la montre à tous.
--   3. `fiche_pdf_acces(p_nom)` : les trois portes de `lesson_revision_sheet`
--      (184), revérifiées en base — administrateur, abonnement, chapitre
--      déverrouillé. La policy de lecture du bucket `fiches` s'appuie dessus :
--      l'app crée une URL signée AVEC LA SESSION DE L'ÉLÈVE (le serveur n'a que
--      la clé anonyme), et Storage ne la signe que si cette policy l'y autorise.
--
-- PRÉREQUIS : 028 (is_admin), 183 (chapter_unlocks), 184 (subscription_tier).
-- Idempotente. À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- Sans elle, rien ne casse : la page Fiche vend et débloque comme avant, mais
-- « Ouvrir la fiche » répond « la fiche n'a pas pu être chargée ».
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Le bucket des PDF — privé
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fiches',
  'fiches',
  FALSE,
  4194304,  -- 4 Mo : une page A4 composée pèse ~0,9 Mo
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE
  SET file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types,
      public = EXCLUDED.public;

-- -----------------------------------------------------------------------------
-- 2. Le bucket des aperçus — public
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fiches-apercus',
  'fiches-apercus',
  TRUE,
  262144,  -- 256 Ko : une illustration de 360 px pèse ~15 Ko
  ARRAY['image/webp']
)
ON CONFLICT (id) DO UPDATE
  SET file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types,
      public = EXCLUDED.public;

-- -----------------------------------------------------------------------------
-- 3. Qui peut lire le PDF d'un chapitre — miroir de lesson_revision_sheet (184)
--
-- Rend FALSE dans tous les cas de refus (pas de session, nom qui n'est pas un
-- `<uuid>.pdf`, chapitre fermé) : aucun oracle. SECURITY DEFINER parce que la
-- policy s'évalue avec le rôle de l'élève, qui ne lit `profiles` que pour lui
-- et `chapter_unlocks` que pour lui — c'est exactement ce qu'on vérifie, mais
-- on ne veut pas que la policy dépende de celles de ces tables.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fiche_pdf_acces(p_nom TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_tier    TEXT;
  v_chapter UUID;
BEGIN
  IF v_user IS NULL THEN RETURN FALSE; END IF;
  IF p_nom !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$' THEN
    RETURN FALSE;
  END IF;
  v_chapter := left(p_nom, 36)::uuid;

  -- Porte 1 : l'administrateur.
  IF public.is_admin() THEN RETURN TRUE; END IF;

  -- Porte 2 : l'abonnement. Miroir de lib/gems.ts (PREMIUM_TIERS).
  SELECT subscription_tier INTO v_tier
    FROM public.profiles WHERE id = v_user;
  IF COALESCE(v_tier, '') IN ('tier1', 'tier2', 'tier3') THEN RETURN TRUE; END IF;

  -- Porte 3 : la gemme — le chapitre déverrouillé, à vie.
  RETURN EXISTS (
    SELECT 1 FROM public.chapter_unlocks
     WHERE user_id = v_user AND chapter_id = v_chapter
  );
END;
$$;

REVOKE ALL ON FUNCTION public.fiche_pdf_acces(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fiche_pdf_acces(TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 4. Les policies de lecture. Aucune policy d'écriture : seul le dépôt par la
--    clé service (scripts/fiches-deposer.mjs) écrit dans ces deux buckets.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "fiches_pdf_lire" ON storage.objects;
CREATE POLICY "fiches_pdf_lire" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'fiches' AND public.fiche_pdf_acces(name));

DROP POLICY IF EXISTS "fiches_apercus_lire" ON storage.objects;
CREATE POLICY "fiches_apercus_lire" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'fiches-apercus');

-- =============================================================================
-- CONTRÔLES (SQL Editor, après exécution)
--   select id, public from storage.buckets where id in ('fiches', 'fiches-apercus');
--   select fiche_pdf_acces('00000000-0000-0000-0000-000000000000.pdf');  → false sans session
--   (connecté, chapitre débloqué) select fiche_pdf_acces('<chapter_id>.pdf'); → true
-- =============================================================================
