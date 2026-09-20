-- =============================================================================
-- Studuel — Migration 324 : fermer les trois outils d'exploitation de la 320
--
-- ⚠️ CORRECTIF DE SÉCURITÉ. À exécuter dès que possible.
--
-- CE QUI S'EST PASSÉ. La migration 320 crée trois fonctions d'exploitation qui
-- exécutent du DDL (`ALTER POLICY`) en SECURITY DEFINER, et croyait les fermer
-- avec :
--
--     REVOKE ALL ON FUNCTION public.optimiser_une_policy(OID) FROM PUBLIC;
--
-- Ça ne suffit pas, et c'est vérifiable : après exécution de la 320, un appel
-- ANONYME à `/rest/v1/rpc/optimiser_une_policy` répond HTTP 200.
--
-- POURQUOI. Supabase accorde `EXECUTE` sur les fonctions du schéma `public` aux
-- rôles `anon` et `authenticated` par des GRANT EXPLICITES (via ses
-- `ALTER DEFAULT PRIVILEGES`). Or `REVOKE … FROM PUBLIC` ne retire que le
-- privilège du pseudo-rôle PUBLIC : il ne touche pas à un GRANT nommé. La
-- fonction restait donc appelable par n'importe quel visiteur, alors que le
-- code disait le contraire — le pire des deux mondes, puisque la ligne de
-- REVOKE donnait l'illusion que la question était traitée.
--
-- CE QUE ÇA PERMETTAIT, EXACTEMENT. Pas d'élévation de privilège : ces
-- fonctions ne changent que la FORME d'une expression de policy
-- (`auth.uid()` → `(SELECT auth.uid())`), jamais sa logique — un attaquant ne
-- pouvait ni lire ni affaiblir quoi que ce soit. Le risque est un DÉNI DE
-- SERVICE : chaque appel prend un verrou de niveau ALTER sur la table visée,
-- et `optimiser_policies_rls()` en prend un sur les ~130 policies de la base.
-- Appelée en boucle par un visiteur non authentifié, elle bloque les écritures
-- de toute l'application.
--
-- LA RÈGLE À RETENIR, ET ELLE VAUT POUR TOUTE FONCTION FUTURE : sur ce projet,
-- fermer une fonction demande de révoquer NOMMÉMENT `anon` et `authenticated`,
-- pas seulement PUBLIC. Un test du dépôt (`lib/rls-guard.test.ts`) le vérifie
-- désormais sur chaque migration neuve.
--
-- `rls_initplan_auto()` est incluse par principe. Appelée directement, elle
-- échoue déjà (0A000 : une fonction de déclencheur d'événement ne s'appelle pas
-- hors de son contexte) — mais on ne laisse pas une fonction ouverte au motif
-- qu'elle échoue vite.
--
-- PRÉREQUIS : 320. Idempotent — REVOKE sur un privilège absent est un no-op.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

REVOKE ALL ON FUNCTION public.optimiser_une_policy(OID)
  FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.optimiser_policies_rls()
  FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.rls_initplan_auto()
  FROM PUBLIC, anon, authenticated;

-- =============================================================================
-- VÉRIFIER — doit rendre TROIS lignes, toutes à `false`.
-- `has_function_privilege` répond sur le privilège EFFECTIF : c'est la seule
-- réponse qui vaille, celle qu'un REVOKE mal ciblé ne peut pas simuler.
-- =============================================================================
-- SELECT p.proname,
--        has_function_privilege('anon',          p.oid, 'EXECUTE') AS anon_peut,
--        has_function_privilege('authenticated', p.oid, 'EXECUTE') AS authentifie_peut
--   FROM pg_proc p
--   JOIN pg_namespace n ON n.oid = p.pronamespace
--  WHERE n.nspname = 'public'
--    AND p.proname IN ('optimiser_une_policy', 'optimiser_policies_rls', 'rls_initplan_auto')
--  ORDER BY 1;

-- =============================================================================
-- LE MÊME CONTRÔLE, SUR TOUTE LA BASE — les fonctions SECURITY DEFINER
-- exécutables par un visiteur ANONYME. Le résultat n'est pas censé être vide
-- (plusieurs RPC légitimes s'appellent avant connexion), mais toute nouvelle
-- ligne mérite qu'on se demande pourquoi elle est là.
-- =============================================================================
-- SELECT p.proname
--   FROM pg_proc p
--   JOIN pg_namespace n ON n.oid = p.pronamespace
--  WHERE n.nspname = 'public'
--    AND p.prosecdef
--    AND has_function_privilege('anon', p.oid, 'EXECUTE')
--  ORDER BY 1;
