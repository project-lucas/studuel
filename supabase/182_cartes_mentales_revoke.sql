-- =============================================================================
-- Studuel — Migration 182 : révocation de la lecture directe des cartes mentales.
--
-- ⚠️⚠️ ORDRE IMPÉRATIF — À EXÉCUTER **APRÈS** :
--        (a) la migration 181 (elle crée `has_mind_map` et la RPC de lecture),
--        (b) le DÉPLOIEMENT du code qui n'interroge plus `chapters.mind_map`.
--
-- Pourquoi cet ordre : avant ce déploiement, cinq requêtes de Réviser faisaient
-- `select('*')` sur `chapters`. Après le retrait de droit ci-dessous, un `*`
-- inclut une colonne interdite et PostgREST répond « permission denied » — donc
-- exécuter cette migration trop tôt casse TOUT l'onglet Réviser en production.
-- Le code a été passé en colonnes explicites (`CHAPTER_COLUMNS` dans
-- `lib/types.ts`) et lit désormais l'existence via `has_mind_map` et le contenu
-- via `chapter_mind_map()` — cf. `lib/mind-map-access.ts`.
--
-- Ce que ça ferme : `supabase.from('chapters').select('mind_map')` avec la clé
-- anon (publique, lisible dans le bundle JS) renvoyait jusqu'ici TOUT le contenu
-- payant à n'importe qui, sans compte ni abonnement.
--
-- ⚠️ PIÈGE POSTGRES — pourquoi on ne fait PAS `REVOKE SELECT (mind_map)` :
-- Supabase accorde par défaut un `SELECT` au niveau TABLE à `anon` et
-- `authenticated`. Or un retrait de droit par COLONNE ne rogne pas un droit
-- accordé sur la TABLE : le REVOKE passerait sans erreur et la colonne
-- resterait lisible — une migration « verte » qui ne protège rien. Il faut
-- retirer le droit de table puis le ré-accorder colonne par colonne, ce que
-- fait le bloc ci-dessous. Toute colonne publique ajoutée plus tard à
-- `chapters` devra être ajoutée ICI **et** dans `CHAPTER_COLUMNS`, sinon elle
-- sera invisible pour l'app.
--
-- `has_mind_map` reste lisible : c'est voulu, l'existence d'une carte n'est pas
-- un secret (la tuile du chapitre l'affiche déjà à tout le monde).
--
-- Les rôles `postgres` / `service_role` ne sont pas touchés : les seeds de
-- contenu (`030+`) continuent d'écrire et de relire les cartes normalement.
--
-- PRÉREQUIS : 181. Idempotente (REVOKE puis GRANT explicites, rejouables).
-- À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

REVOKE SELECT ON public.chapters FROM anon;
REVOKE SELECT ON public.chapters FROM authenticated;

GRANT SELECT (id, subject_id, level, title, position, has_mind_map)
  ON public.chapters TO anon;
GRANT SELECT (id, subject_id, level, title, position, has_mind_map)
  ON public.chapters TO authenticated;

-- Vérification manuelle (à lancer avec la clé anon, hors SQL Editor) :
--   select('mind_map')     → doit répondre « permission denied »
--   select('has_mind_map') → doit répondre true/false
