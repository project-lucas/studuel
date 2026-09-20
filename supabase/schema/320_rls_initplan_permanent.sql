-- =============================================================================
-- Studuel — Migration 320 : l'optimisation RLS cesse d'être un geste ponctuel
--
-- LE PROBLÈME QUE LA 208 N'A PAS RÉSOLU. La 208 enveloppe `auth.uid()` en
-- `(SELECT auth.uid())` dans toutes les policies — ce qui fait passer Postgres
-- d'un appel PAR LIGNE à un InitPlan évalué UNE fois, et lui rend l'usage de
-- l'index. C'est le levier de performance n° 1 de toute base sous RLS.
--
-- Mais la 208 traite les policies EXISTANT AU MOMENT OÙ ON LA LANCE. Son
-- en-tête affirme qu'elle « couvre aussi, automatiquement, les policies des
-- migrations à venir » — c'est faux, et c'est vérifiable : elle n'installe
-- aucun mécanisme permanent. Toute policy écrite après son passage est nue.
--
-- Au 26/08/2026, le dépôt compte 102 policies avec `auth.uid()` nu contre 13
-- enveloppées. Tout ce qui a été créé depuis la 209 — jusqu'à `parent_prefs`
-- de la 319, écrite le jour même — attend une réexécution manuelle que
-- personne ne pense à faire. C'est un piège à retardement : il ne coûte rien
-- sur une table de mille lignes, et il devient mortel sur `test_sessions`, qui
-- prendra ~3 M de lignes PAR JOUR à cent mille élèves.
--
-- CE QUE FAIT CETTE MIGRATION, en trois niveaux de garantie décroissante :
--
--   1. `optimiser_policies_rls()` — la logique de la 208 rendue APPELABLE.
--      Une ligne à la fin de n'importe quelle migration future suffit alors :
--          SELECT public.optimiser_policies_rls();
--      C'est le niveau qui marche partout, quels que soient les droits.
--
--   2. Exécution immédiate — rattrape les ~102 policies nues d'aujourd'hui,
--      `parent_prefs` comprise.
--
--   3. Un EVENT TRIGGER qui enveloppe toute policy À SA CRÉATION, donc sans
--      que personne ait à y penser. `CREATE EVENT TRIGGER` exige le
--      superutilisateur, que Supabase n'accorde pas toujours au rôle
--      `postgres` : la tentative est donc RATTRAPÉE. Si elle échoue, la
--      migration réussit quand même et le dit — les niveaux 1 et 2 tiennent
--      seuls. Une migration qui planterait là-dessus laisserait la base à
--      moitié optimisée pour une commodité.
--
-- AUCUN CHANGEMENT DE RÈGLE DE SÉCURITÉ, ici comme dans la 208. Chaque policy
-- garde son nom, sa table, sa commande, ses rôles et sa condition LOGIQUE.
-- Seule change la FORME de l'expression, par ALTER POLICY (jamais DROP/CREATE,
-- qui ouvrirait une fenêtre sans policy). `(SELECT auth.uid())` et
-- `auth.uid()` rendent exactement la même valeur : c'est le PLANIFICATEUR qui
-- les traite différemment, pas la logique.
--
-- LE FILET CÔTÉ DÉPÔT. `lib/rls-guard.ts` et son test refusent désormais toute
-- policy écrite avec un appel d'auth nu dans un fichier neuf. Le déclencheur
-- répare en base ; le test empêche d'écrire la faute. Les deux servent : le
-- premier couvre ce qui existe, le second ce qu'on ajoutera.
--
-- PRÉREQUIS : aucun (agit sur ce qui existe). Idempotent — la fonction déballe
-- toute enveloppe déjà posée avant de réenvelopper, donc dix passages valent
-- un passage.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ------------------------------------------- 1. ENVELOPPER UNE POLICY ------
-- Le cœur, isolé pour une seule raison : il sert à la fois au rattrapage en
-- masse (niveau 2) et au déclencheur (niveau 3). Deux copies de cette logique
-- finiraient par diverger, et une divergence ici s'écrit dans des règles de
-- sécurité.
--
-- Renvoie TRUE si la policy a été réécrite, FALSE si elle n'avait rien à
-- gagner (aucun appel d'auth, ou déjà enveloppée).
CREATE OR REPLACE FUNCTION public.optimiser_une_policy(p_oid OID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pol        RECORD;
  new_qual   TEXT;
  new_check  TEXT;
  clauses    TEXT := '';
  -- Les appels d'auth à envelopper : tous STABLE et sans argument, donc tous
  -- gagnent au même traitement. Liste reprise telle quelle de la 208.
  auth_fns   TEXT[] := ARRAY['uid', 'jwt', 'role', 'email'];
  fname      TEXT;
  unwrap     TEXT;
BEGIN
  SELECT c.relname                                AS table_name,
         p.polname                                AS policy_name,
         p.polcmd                                 AS cmd,
         pg_get_expr(p.polqual,      p.polrelid)  AS qual,
         pg_get_expr(p.polwithcheck, p.polrelid)  AS with_check
    INTO pol
    FROM pg_policy   p
    JOIN pg_class    c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
   WHERE p.oid = p_oid
     AND n.nspname = 'public';

  IF NOT FOUND THEN RETURN FALSE; END IF;

  new_qual  := pol.qual;
  new_check := pol.with_check;

  FOREACH fname IN ARRAY auth_fns LOOP
    -- Déballage d'abord : `( SELECT auth.uid() AS uid)` → `auth.uid()`.
    -- `pg_get_expr` rend les sous-selects avec un alias et des espaces
    -- variables ; le motif doit les tolérer. C'est ce déballage préalable qui
    -- rend l'opération rejouable sans empiler `(SELECT (SELECT …))`.
    unwrap := format('\(\s*SELECT\s+auth\.%s\(\)(\s+AS\s+\w+)?\s*\)', fname);

    IF new_qual IS NOT NULL THEN
      new_qual := regexp_replace(new_qual, unwrap, format('auth.%s()', fname), 'gi');
      new_qual := replace(new_qual, format('auth.%s()', fname), format('(SELECT auth.%s())', fname));
    END IF;

    IF new_check IS NOT NULL THEN
      new_check := regexp_replace(new_check, unwrap, format('auth.%s()', fname), 'gi');
      new_check := replace(new_check, format('auth.%s()', fname), format('(SELECT auth.%s())', fname));
    END IF;
  END LOOP;

  IF new_qual IS NOT DISTINCT FROM pol.qual
     AND new_check IS NOT DISTINCT FROM pol.with_check THEN
    RETURN FALSE;
  END IF;

  -- ALTER POLICY et non DROP/CREATE : nom, rôles et commande sont préservés
  -- par construction — impossible d'ouvrir un trou en chemin.
  -- Une policy INSERT ('a') n'a QUE `WITH CHECK` ; SELECT et DELETE n'ont QUE
  -- `USING` ; UPDATE et ALL peuvent avoir les deux.
  IF new_qual IS NOT NULL AND pol.cmd <> 'a' THEN
    clauses := clauses || format(' USING (%s)', new_qual);
  END IF;
  IF new_check IS NOT NULL THEN
    clauses := clauses || format(' WITH CHECK (%s)', new_check);
  END IF;

  IF clauses = '' THEN RETURN FALSE; END IF;

  EXECUTE format('ALTER POLICY %I ON public.%I%s',
                 pol.policy_name, pol.table_name, clauses);
  RETURN TRUE;
END;
$$;

-- Personne n'appelle ça depuis l'app : ni l'élève, ni le visiteur. C'est un
-- outil d'exploitation, il reste au propriétaire de la base.
REVOKE ALL ON FUNCTION public.optimiser_une_policy(OID) FROM PUBLIC;

-- ------------------------------------------ 2. RATTRAPER TOUT L'EXISTANT ---
-- Le rattrapage en masse, appelable à la fin de n'importe quelle migration.
-- Renvoie le nombre de policies réécrites.
CREATE OR REPLACE FUNCTION public.optimiser_policies_rls()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec      RECORD;
  touched  INTEGER := 0;
  scanned  INTEGER := 0;
BEGIN
  FOR rec IN
    SELECT p.oid
      FROM pg_policy   p
      JOIN pg_class    c ON c.oid = p.polrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'public'
     ORDER BY c.relname, p.polname
  LOOP
    scanned := scanned + 1;
    IF public.optimiser_une_policy(rec.oid) THEN
      touched := touched + 1;
    END IF;
  END LOOP;

  RAISE NOTICE '--- % policies examinées, % réécrites en InitPlan ---', scanned, touched;
  RETURN touched;
END;
$$;

REVOKE ALL ON FUNCTION public.optimiser_policies_rls() FROM PUBLIC;

-- On rattrape MAINTENANT : toutes les policies écrites depuis le passage de la
-- 208 sont nues, `parent_prefs` (319) comprise.
SELECT public.optimiser_policies_rls();

-- ------------------------------------------------ 3. LE DÉCLENCHEUR --------
-- Ce que fait le déclencheur : à chaque `CREATE POLICY`, il enveloppe la
-- policy qui vient de naître. Plus personne n'a à y penser, et une migration
-- oubliée ne peut plus laisser un `Seq Scan` derrière elle.
--
-- PAS DE RÉCURSION : le déclencheur n'écoute QUE `CREATE POLICY`, et son seul
-- effet est un `ALTER POLICY` — dont l'étiquette de commande est différente.
-- Il ne peut donc pas se rappeler lui-même. C'est pour cette raison que
-- `ALTER POLICY` est volontairement HORS de la liste des étiquettes écoutées :
-- l'y mettre demanderait un verrou anti-récursion pour couvrir le cas
-- marginal d'une policy réécrite à la main en forme nue — le rattrapage du
-- niveau 2, relancé à l'occasion, s'en charge sans complexité supplémentaire.
CREATE OR REPLACE FUNCTION public.rls_initplan_auto()
RETURNS EVENT_TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  obj RECORD;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_ddl_commands() LOOP
    IF obj.command_tag = 'CREATE POLICY' THEN
      PERFORM public.optimiser_une_policy(obj.objid);
    END IF;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.rls_initplan_auto() FROM PUBLIC;

-- La pose du déclencheur exige le superutilisateur. Sur une base gérée
-- (Supabase), le rôle `postgres` ne l'est pas toujours : la tentative est
-- rattrapée, et son échec n'empêche NI la migration de réussir, NI les
-- niveaux 1 et 2 de fonctionner. On préfère une base optimisée avec un geste
-- manuel à une migration qui plante au milieu pour une commodité.
DO $$
BEGIN
  DROP EVENT TRIGGER IF EXISTS rls_initplan_auto_trg;
  CREATE EVENT TRIGGER rls_initplan_auto_trg
    ON ddl_command_end
    WHEN TAG IN ('CREATE POLICY')
    EXECUTE FUNCTION public.rls_initplan_auto();

  RAISE NOTICE '✓ Déclencheur posé : toute policy créée désormais sera enveloppée automatiquement.';
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE '× Déclencheur NON posé (droits insuffisants — attendu sur Supabase).';
    RAISE NOTICE '  Rien n''est cassé : ajoute « SELECT public.optimiser_policies_rls(); »';
    RAISE NOTICE '  en DERNIÈRE ligne de chaque migration qui crée une policy.';
  WHEN OTHERS THEN
    RAISE NOTICE '× Déclencheur NON posé (%) — même consigne de repli.', SQLERRM;
END;
$$;

-- =============================================================================
-- VÉRIFICATION — doit renvoyer 0 ligne : plus aucun appel d'auth « nu ».
-- =============================================================================
-- SELECT c.relname AS table_name, p.polname AS policy_name,
--        pg_get_expr(p.polqual, p.polrelid) AS condition
-- FROM pg_policy p
-- JOIN pg_class c ON c.oid = p.polrelid
-- JOIN pg_namespace n ON n.oid = c.relnamespace
-- WHERE n.nspname = 'public'
--   AND coalesce(pg_get_expr(p.polqual, p.polrelid), '')
--       || coalesce(pg_get_expr(p.polwithcheck, p.polrelid), '')
--       ~ 'auth\.(uid|jwt|role|email)\(\)'
--   AND coalesce(pg_get_expr(p.polqual, p.polrelid), '')
--       || coalesce(pg_get_expr(p.polwithcheck, p.polrelid), '')
--       !~* 'SELECT\s+auth\.';

-- =============================================================================
-- LE DÉCLENCHEUR EST-IL EN PLACE ? (1 ligne = oui, 0 = repli manuel)
-- =============================================================================
-- SELECT evtname, evtenabled FROM pg_event_trigger WHERE evtname = 'rls_initplan_auto_trg';
