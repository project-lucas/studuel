-- =============================================================================
-- Studuel — Migration 185 : révocation de la lecture directe des fiches.
--
-- ⚠️⚠️ ORDRE IMPÉRATIF — À EXÉCUTER **APRÈS** :
--        (a) la migration 184 (elle crée `has_revision_sheet` et la RPC),
--        (b) le DÉPLOIEMENT du code qui n'interroge plus `lessons.revision_sheet`
--            en direct et n'utilise plus `select('*')` sur `lessons`.
--
-- Pourquoi cet ordre : quatre requêtes de Réviser faisaient `lessons(*)` ou
-- `.from('lessons').select('*')`. Après le retrait de droit ci-dessous, un `*`
-- inclut une colonne interdite et PostgREST répond « permission denied » — donc
-- exécuter cette migration trop tôt casse TOUT l'onglet Réviser en production.
-- Le code est passé en colonnes explicites (`LESSON_COLUMNS` dans
-- `lib/types.ts`) et lit désormais l'existence via `has_revision_sheet` et le
-- contenu via `lesson_revision_sheet()` — cf. `lib/revision-access.ts`.
--
-- ⚠️ PIÈGE POSTGRES — pourquoi on ne fait PAS `REVOKE SELECT (revision_sheet)` :
-- Supabase accorde par défaut un `SELECT` au niveau TABLE à `anon` et
-- `authenticated`. Or un retrait de droit par COLONNE ne rogne pas un droit
-- accordé sur la TABLE : le REVOKE passerait sans erreur et la colonne
-- resterait lisible — une migration « verte » qui ne protège rien. Il faut
-- retirer le droit de table puis le ré-accorder colonne par colonne, ce que
-- fait le bloc ci-dessous. Toute colonne publique ajoutée plus tard à `lessons`
-- devra être ajoutée ICI **et** dans `LESSON_COLUMNS`, sinon elle sera
-- invisible pour l'app.
--
-- `content` (le cours) RESTE lisible : c'est voulu. `lib/premium.ts` annonce
-- « Cours & quiz de base » dans l'offre gratuite — le fermer trahirait la
-- promesse commerciale affichée à l'élève. Seule la FICHE est payante.
--
-- `has_revision_sheet` reste lisible : l'existence d'une fiche n'est pas un
-- secret, la tuile du hub de leçon l'affiche déjà à tout le monde.
--
-- Les rôles `postgres` / `service_role` ne sont pas touchés : les seeds de
-- contenu (`030+`) continuent d'écrire et de relire les fiches normalement.
--
-- PRÉREQUIS : 184. Idempotente (REVOKE puis GRANT explicites, rejouables).
-- À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

REVOKE SELECT ON public.lessons FROM anon;
REVOKE SELECT ON public.lessons FROM authenticated;

GRANT SELECT (
  id, chapter_id, title, thumbnail_url, content, position,
  studygram_url, has_revision_sheet
) ON public.lessons TO anon;

GRANT SELECT (
  id, chapter_id, title, thumbnail_url, content, position,
  studygram_url, has_revision_sheet
) ON public.lessons TO authenticated;

-- L'écriture du Studio de contenu passe par les policies de la migration 028
-- (`is_admin()`), qu'un retrait de SELECT ne touche pas. La relecture de la
-- fiche par l'éditeur passe désormais par `lesson_revision_sheet()`, qui
-- ouvre explicitement la porte à l'administrateur (migration 184).

-- Vérification manuelle (à lancer avec la clé anon, hors SQL Editor) :
--   select('revision_sheet')     → doit répondre « permission denied »
--   select('has_revision_sheet') → doit répondre true/false
--   select('content')            → doit continuer à répondre (cours gratuit)
