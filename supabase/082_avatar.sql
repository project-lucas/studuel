-- =============================================================================
-- Studuel — Migration 082 : avatar personnalisable (onglet Moi, façon Duolingo)
-- L'élève compose son avatar (peau, coiffure, yeux, bouche, lunettes, tenue…).
-- La configuration choisie est stockée en JSONB sur le profil ; le rendu SVG
-- est calculé côté application (lib/avatar.ts, DiceBear « avataaars »), la base
-- ne stocke que les options (catalogue fermé, validées par l'action serveur).
--
-- avatar est écrit directement par saveAvatar (pas sensible comme coins) : on
-- l'ajoute donc au GRANT UPDATE par colonnes. Grant ADDITIF (pas de REVOKE) —
-- il s'empile sur les colonnes déjà accordées par 016 et 048.
-- PRÉREQUIS : schema.sql (profiles). Idempotent.
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar JSONB;

GRANT UPDATE (avatar) ON public.profiles TO authenticated;
