-- =============================================================================
-- Studuel — Migration 184 : accès aux fiches de révision (partie ADDITIVE).
--
-- MÊME FAILLE QUE CELLE CORRIGÉE PAR 181/182 POUR LES CARTES MENTALES, mais sur
-- `lessons` — jamais traitée jusqu'ici.
--
-- Constat : la migration 026 (« lecture anonyme du catalogue ») a remplacé
--
--     CREATE POLICY "lessons_select_auth" ... FOR SELECT TO authenticated USING (true)
--
-- par la même policy SANS `TO authenticated`. Le but était légitime (mettre le
-- catalogue en cache serveur avec un client sans session, cf. lib/catalog.ts),
-- mais l'effet de bord ne l'est pas : `anon` lit désormais TOUTES les colonnes
-- de `lessons`, y compris `revision_sheet` — la fiche de révision, contenu
-- payant. Avec la clé anon (publique, présente dans le bundle JS) et sans
-- aucun compte :
--
--     GET /rest/v1/lessons?select=id,title,revision_sheet
--
-- rendait l'intégralité des fiches du catalogue.
--
-- Ce qui est payant et ce qui ne l'est pas — arbitrage explicite :
--   • `revision_sheet` (la fiche)     → PAYANT. C'est le support que
--     `lib/gems.ts` et la migration 183 promettent de déverrouiller à la gemme,
--     et que l'élève achète.
--   • `content` (le cours)            → GRATUIT, volontairement. `lib/premium.ts`
--     annonce « Cours & quiz de base » dans l'offre gratuite : le fermer
--     trahirait la promesse commerciale affichée.
--   • `studygram_url`, `title`,
--     `thumbnail_url`, `position`     → GRATUIT (habillage et navigation).
--
-- Cette migration ne fait QUE de l'ajout — aucun droit retiré, donc sûre à
-- exécuter à n'importe quel moment. C'est la 185 qui révoque, et elle DOIT
-- passer APRÈS le déploiement du code (cf. son en-tête).
--
--   1. `lessons.has_revision_sheet` : colonne GÉNÉRÉE. L'EXISTENCE d'une fiche
--      n'est pas un secret (la tuile du hub de leçon l'affiche à tout le monde) ;
--      la sortir dans sa propre colonne permet aux pages de ne plus jamais lire
--      le texte pour en tester la présence.
--   2. `lesson_revision_sheet(UUID)` : seul chemin de lecture du CONTENU, en
--      SECURITY DEFINER avec search_path fixé. Trois portes, revérifiées côté
--      serveur : administrateur (le Studio doit pouvoir rouvrir ce qu'il écrit),
--      abonnement premium, ou chapitre déverrouillé à la gemme.
--
-- PRÉREQUIS : 008 (lessons), 025 (revision_sheet), 028 (is_admin),
-- 183 (chapter_unlocks). Idempotente.
-- À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. EXISTENCE de la fiche — colonne générée, publique
--
-- `btrim(...) <> ''` et non un simple IS NOT NULL : les seeds de contenu créent
-- des leçons avec une fiche vide, qui ne doit pas allumer la tuile.
-- -----------------------------------------------------------------------------
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS has_revision_sheet BOOLEAN
  GENERATED ALWAYS AS (
    revision_sheet IS NOT NULL AND btrim(revision_sheet) <> ''
  ) STORED;

-- -----------------------------------------------------------------------------
-- 2. CONTENU de la fiche — RPC gardée
--
-- Renvoie NULL dans tous les cas de refus (pas connecté, pas d'accès, leçon
-- inexistante) : aucun oracle, l'appelant ne distingue pas « tu n'y as pas
-- droit » de « cette leçon n'a pas de fiche ». L'app connaît déjà l'existence
-- par `has_revision_sheet`.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.lesson_revision_sheet(p_lesson_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_tier    TEXT;
  v_chapter UUID;
  v_sheet   TEXT;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  SELECT chapter_id, revision_sheet INTO v_chapter, v_sheet
    FROM public.lessons
   WHERE id = p_lesson_id;
  IF v_chapter IS NULL THEN RETURN NULL; END IF;

  -- Porte 1 : l'administrateur. Le Studio de contenu écrit les fiches ; sans
  -- cette porte, il ne pourrait plus rouvrir celles qu'il vient d'écrire.
  IF public.is_admin() THEN RETURN v_sheet; END IF;

  -- Porte 2 : l'abonnement. Miroir de lib/subscription.ts (PREMIUM_TIERS).
  SELECT subscription_tier INTO v_tier
    FROM public.profiles WHERE id = v_user;
  IF COALESCE(v_tier, '') IN ('tier1', 'tier2', 'tier3') THEN
    RETURN v_sheet;
  END IF;

  -- Porte 3 : la gemme. Miroir de chapterAccess() dans lib/gems.ts — une gemme
  -- ouvre le CHAPITRE, donc toutes les fiches de ses leçons.
  IF EXISTS (
    SELECT 1 FROM public.chapter_unlocks
     WHERE user_id = v_user AND chapter_id = v_chapter
  ) THEN
    RETURN v_sheet;
  END IF;

  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.lesson_revision_sheet(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lesson_revision_sheet(UUID) TO authenticated;
