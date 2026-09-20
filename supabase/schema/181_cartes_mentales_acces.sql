-- =============================================================================
-- Studuel — Migration 181 : accès aux cartes mentales (partie ADDITIVE).
--
-- Constat de l'audit du gating premium (2026-07-20) : « Cartes mentales
-- illimitées » est LA contrepartie nommée des offres 4,99 € / 9,99 €, mais la
-- table `chapters` est en RLS `USING (true)` et la colonne `mind_map` est
-- lisible par `anon`. N'importe qui, avec la clé anon (publique, présente dans
-- le bundle JS), peut donc faire :
--
--     supabase.from('chapters').select('mind_map')
--
-- et récupérer TOUT le contenu payant, sans compte et sans abonnement. Le
-- correctif applicatif du même jour (leurre au lieu de la carte floutée) ne
-- fermait que le chemin « page web » ; celui-ci ferme la requête directe.
--
-- Cette migration ne fait QUE de l'ajout — elle ne retire aucun droit, donc
-- elle est sûre à exécuter à n'importe quel moment, avant ou après le déploiement
-- du code. C'est la migration 182 qui révoque la lecture, et elle, elle DOIT
-- passer après le déploiement (cf. son en-tête).
--
--   1. `chapters.has_mind_map` : colonne GÉNÉRÉE (`mind_map IS NOT NULL`).
--      L'EXISTENCE d'une carte n'est pas un secret — la tuile du chapitre
--      l'affiche déjà à tout le monde, abonné ou non. La sortir dans sa propre
--      colonne permet aux pages de ne plus jamais lire le JSONB pour en tester
--      la présence (bonus perf réel : la page matière et le catalogue mis en
--      cache rapatriaient jusqu'ici la carte COMPLÈTE de chaque chapitre).
--   2. `chapter_mind_map(UUID)` : seul chemin de lecture du CONTENU, en
--      SECURITY DEFINER avec `search_path` fixé, qui revérifie l'abonnement
--      côté serveur (miroir SQL de `canAccessMindMaps` dans
--      `lib/subscription.ts` : tier1 | tier2 | tier3).
--
-- PRÉREQUIS : 008 (chapters), 029 (mind_map), 003 (profiles.subscription_tier).
-- Idempotente. À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. EXISTENCE de la carte — colonne générée, publique
-- -----------------------------------------------------------------------------
ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS has_mind_map BOOLEAN
  GENERATED ALWAYS AS (mind_map IS NOT NULL) STORED;

-- -----------------------------------------------------------------------------
-- 2. CONTENU de la carte — RPC gardée par l'abonnement
--
-- Renvoie NULL dans tous les cas de refus (pas connecté, pas abonné, chapitre
-- inexistant) : aucun oracle, l'appelant ne distingue pas « tu n'y as pas
-- droit » de « ce chapitre n'a pas de carte ». L'app connaît déjà l'existence
-- par `has_mind_map`, elle n'a pas besoin que la RPC la lui dise.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.chapter_mind_map(p_chapter_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tier TEXT;
  v_map  JSONB;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT subscription_tier INTO v_tier
    FROM public.profiles
   WHERE id = auth.uid();

  -- Miroir de lib/subscription.ts (PREMIUM_TIERS). Toute évolution des offres
  -- doit toucher LES DEUX, sinon le gate diverge silencieusement.
  IF v_tier IS NULL OR v_tier NOT IN ('tier1', 'tier2', 'tier3') THEN
    RETURN NULL;
  END IF;

  SELECT mind_map INTO v_map
    FROM public.chapters
   WHERE id = p_chapter_id;

  RETURN v_map;
END;
$$;

REVOKE ALL ON FUNCTION public.chapter_mind_map(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.chapter_mind_map(UUID) TO authenticated;
