-- Studuel — Migration 208 : « RLS évaluée une fois, pas une fois par ligne »
--
-- AUCUN changement de règle de sécurité. Chaque policy garde son nom, sa table,
-- sa commande, ses rôles et sa condition LOGIQUE à l'identique. Seule change la
-- FORME de la condition : `auth.uid()` devient `(SELECT auth.uid())`.
--
-- POURQUOI ÇA CHANGE TOUT
-- `auth.uid()` est une fonction STABLE qui lit l'en-tête JWT de la requête.
-- Écrite nue dans une policy, Postgres la traite comme un filtre dépendant de
-- la ligne : il la RÉÉVALUE pour chaque ligne examinée. Sur une table de
-- 50 000 lignes, c'est 50 000 appels — et, pire, le planificateur ne peut plus
-- se servir de l'index sur `user_id`, faute de constante à comparer.
--
-- Enveloppée dans un sous-select, elle devient un InitPlan : Postgres l'évalue
-- UNE FOIS avant le parcours, obtient une constante, et peut alors utiliser
-- l'index. C'est la recommandation officielle de Supabase (« RLS performance
-- recommendations »), et le gain se mesure en ordres de grandeur dès que la
-- table grossit. Sur les tables encore petites, le gain est modeste : c'est un
-- investissement qui paie de plus en plus à mesure que les élèves arrivent.
--
-- COMMENT
-- Plutôt que de réécrire 225 policies à la main — 60 fichiers, autant de risques
-- de faute de frappe dans une règle de sécurité — on lit le catalogue et on
-- réécrit l'expression EXISTANTE. Ce que la base applique aujourd'hui est donc
-- exactement ce qu'elle appliquera demain, à la parenthèse près.
--
-- IDEMPOTENTE : le script « déballe » d'abord toute forme déjà enveloppée avant
-- de réenvelopper. La relancer dix fois donne le même résultat qu'une fois.
-- Elle couvre aussi, automatiquement, les policies des migrations à venir.
--
-- PRÉREQUIS : aucun (agit sur ce qui existe).
-- À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor.
-- Astuce : sélectionne TOUT le fichier (Ctrl+A) avant de lancer.
-- =============================================================================

DO $$
DECLARE
  pol           RECORD;
  new_qual      TEXT;
  new_check     TEXT;
  clauses       TEXT;
  touched       INT := 0;
  scanned       INT := 0;

  -- Les appels d'auth à envelopper. Tous sont STABLE et sans argument, donc
  -- tous gagnent au même traitement.
  auth_fns      TEXT[] := ARRAY['uid', 'jwt', 'role', 'email'];
  fname         TEXT;

  -- Motif de DÉBALLAGE d'une enveloppe déjà posée. `pg_get_expr` rend les
  -- sous-selects sous la forme `( SELECT auth.uid() AS uid)` : le motif doit
  -- donc tolérer l'alias et les espaces. C'est ce déballage préalable qui rend
  -- la migration rejouable sans empiler `(SELECT (SELECT …))`.
  unwrap        TEXT;
BEGIN
  FOR pol IN
    SELECT
      c.relname                                   AS table_name,
      p.polname                                   AS policy_name,
      p.polcmd                                    AS cmd,
      pg_get_expr(p.polqual,      p.polrelid)     AS qual,
      pg_get_expr(p.polwithcheck, p.polrelid)     AS with_check
    FROM pg_policy   p
    JOIN pg_class    c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
    ORDER BY c.relname, p.polname
  LOOP
    scanned := scanned + 1;
    new_qual  := pol.qual;
    new_check := pol.with_check;

    FOREACH fname IN ARRAY auth_fns LOOP
      -- 1. Déballage : `( SELECT auth.uid() AS uid)` → `auth.uid()`
      -- 2. Emballage : `auth.uid()` → `(SELECT auth.uid())`
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

    -- Rien à faire pour cette policy (aucun appel d'auth, ou déjà enveloppé).
    CONTINUE WHEN new_qual IS NOT DISTINCT FROM pol.qual
              AND new_check IS NOT DISTINCT FROM pol.with_check;

    -- ALTER POLICY (et non DROP/CREATE) : nom, rôles et commande sont
    -- préservés par construction — impossible d'ouvrir un trou en chemin.
    -- Une policy INSERT n'a QUE `WITH CHECK` ; SELECT et DELETE n'ont QUE
    -- `USING` ; UPDATE et ALL peuvent avoir les deux.
    clauses := '';
    IF new_qual IS NOT NULL AND pol.cmd <> 'a' THEN
      clauses := clauses || format(' USING (%s)', new_qual);
    END IF;
    IF new_check IS NOT NULL THEN
      clauses := clauses || format(' WITH CHECK (%s)', new_check);
    END IF;

    CONTINUE WHEN clauses = '';

    EXECUTE format(
      'ALTER POLICY %I ON public.%I%s',
      pol.policy_name, pol.table_name, clauses
    );
    touched := touched + 1;
    RAISE NOTICE 'policy optimisée : %.%', pol.table_name, pol.policy_name;
  END LOOP;

  RAISE NOTICE '--- % policies examinées, % réécrites en InitPlan ---', scanned, touched;
END $$;

-- =============================================================================
-- VÉRIFICATION — doit renvoyer 0 ligne : plus aucun appel d'auth « nu ».
-- Décommente et lance après la migration.
-- =============================================================================
-- SELECT c.relname AS table_name, p.polname AS policy_name,
--        pg_get_expr(p.polqual, p.polrelid) AS condition
-- FROM pg_policy p
-- JOIN pg_class c ON c.oid = p.polrelid
-- JOIN pg_namespace n ON n.oid = c.relnamespace
-- WHERE n.nspname = 'public'
--   AND pg_get_expr(p.polqual, p.polrelid) ~ 'auth\.(uid|jwt|role|email)\(\)'
--   AND pg_get_expr(p.polqual, p.polrelid) !~* 'SELECT\s+auth\.';

-- =============================================================================
-- MESURER LE GAIN (facultatif) — chiffrer plutôt que croire.
--
-- À lancer dans le SQL Editor en se faisant passer pour un élève réel : mets
-- son UUID dans les deux `sub` ci-dessous. `EXPLAIN ANALYZE` donne le temps
-- d'exécution en ms ET, surtout, le plan choisi.
--
-- Ce qu'il faut regarder :
--   AVANT  → « Seq Scan on test_sessions » + « Filter: (user_id = auth.uid()) »
--            (la fonction apparaît DANS le filtre : un appel par ligne)
--   APRÈS  → « Index Scan using test_sessions_user_created_idx »
--            + « InitPlan 1 ... » au-dessus (la fonction évaluée UNE fois)
--
-- Le passage de Seq Scan à Index Scan est le vrai signal ; l'écart en ms se
-- creuse à mesure que la table grossit.
-- =============================================================================
-- BEGIN;
--   SET LOCAL ROLE authenticated;
--   SET LOCAL request.jwt.claims = '{"sub":"COLLE-ICI-UN-UUID-ELEVE","role":"authenticated"}';
--   EXPLAIN (ANALYZE, BUFFERS) SELECT created_at, score FROM public.test_sessions;
--   EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM public.habit_logs;
-- ROLLBACK;
