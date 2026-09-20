-- =============================================================================
-- Studuel — MESURER avant de grossir
--
-- CE FICHIER N'EST PAS UNE MIGRATION. Il ne crée rien, ne modifie rien, et il
-- n'a donc pas de numéro : il ne doit jamais entrer dans `a-executer.sql`. Il
-- se colle dans le SQL Editor quand on veut CHIFFRER l'état de la base plutôt
-- que de le supposer.
--
-- POURQUOI IL EXISTE. Les décisions de scalabilité se prennent presque toujours
-- à l'instinct — « ça doit être lent », « il faudrait une plus grosse machine ».
-- Or les quatre corrections livrées le 26/08/2026 (320 → 323) ont toutes été
-- trouvées en LISANT le code, et deux d'entre elles portaient sur des lectures
-- que personne n'aurait soupçonnées. L'instinct est un mauvais profileur ; ce
-- fichier le remplace.
--
-- MODE D'EMPLOI. Remplace COLLE-ICI-UN-UUID-ELEVE par l'identifiant d'un élève
-- QUI A DE L'HISTORIQUE — un compte neuf ne révèle aucun problème de volume,
-- c'est précisément le piège de ces dettes-là. Puis lance section par section.
-- =============================================================================


-- ┌───────────────────────────────────────────────────────────────────────────┐
-- │ 1. OÙ EN EST LA BASE ? Le volume des tables qui grossissent.             │
-- └───────────────────────────────────────────────────────────────────────────┘
-- `test_sessions` est la table à surveiller : ~3 M de lignes par jour à cent
-- mille élèves. Le seuil de partitionnement retenu est ~50 M de lignes
-- (cf. le plan de scalabilité) — c'est ce chiffre qu'on vient lire ici.
SELECT
  c.relname                                        AS table_name,
  to_char(c.reltuples::bigint, 'FM999G999G999')    AS lignes_estimees,
  pg_size_pretty(pg_total_relation_size(c.oid))    AS taille_totale,
  pg_size_pretty(pg_indexes_size(c.oid))           AS dont_index
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
ORDER BY pg_total_relation_size(c.oid) DESC
LIMIT 15;


-- ┌───────────────────────────────────────────────────────────────────────────┐
-- │ 2. LA RLS EST-ELLE OPTIMISÉE ? Doit rendre ZÉRO ligne.                   │
-- └───────────────────────────────────────────────────────────────────────────┘
-- Chaque ligne rendue est une policy où `auth.uid()` est appelée UNE FOIS PAR
-- LIGNE examinée, et où le planificateur renonce à l'index. La migration 320
-- les corrige toutes et pose le mécanisme permanent — si cette requête rend
-- quelque chose, c'est que la 320 n'a pas été (re)jouée depuis.
SELECT c.relname AS table_name, p.polname AS policy_name
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND coalesce(pg_get_expr(p.polqual, p.polrelid), '')
      || coalesce(pg_get_expr(p.polwithcheck, p.polrelid), '')
      ~ 'auth\.(uid|jwt|role|email)\(\)'
  AND coalesce(pg_get_expr(p.polqual, p.polrelid), '')
      || coalesce(pg_get_expr(p.polwithcheck, p.polrelid), '')
      !~* 'SELECT\s+auth\.'
ORDER BY 1, 2;

-- Le déclencheur de la 320 est-il posé ? 1 ligne = oui (rien à faire),
-- 0 ligne = repli manuel (terminer chaque migration créant une policy par
-- `SELECT public.optimiser_policies_rls();`).
SELECT evtname, evtenabled FROM pg_event_trigger WHERE evtname = 'rls_initplan_auto_trg';


-- ┌───────────────────────────────────────────────────────────────────────────┐
-- │ 3. LES INDEX SERVENT-ILS ? Un index jamais scanné est un coût d'écriture │
-- │    payé pour rien — sur `test_sessions`, ce coût est payé 3 M fois/jour. │
-- └───────────────────────────────────────────────────────────────────────────┘
SELECT s.relname AS table_name,
       s.indexrelname AS index_name,
       s.idx_scan AS scans,
       pg_size_pretty(pg_relation_size(s.indexrelid)) AS taille
FROM pg_stat_user_indexes s
JOIN pg_index i ON i.indexrelid = s.indexrelid
WHERE s.schemaname = 'public'
  AND NOT i.indisunique
ORDER BY s.idx_scan ASC, pg_relation_size(s.indexrelid) DESC
LIMIT 20;


-- ┌───────────────────────────────────────────────────────────────────────────┐
-- │ 4. LE PLAN DES LECTURES CHAUDES, vu par un VRAI élève.                   │
-- └───────────────────────────────────────────────────────────────────────────┘
-- CE QU'IL FAUT REGARDER, dans l'ordre d'importance :
--   · « Seq Scan on test_sessions » = la RLS n'est pas optimisée (voir § 2) ;
--   · « InitPlan 1 » au-dessus d'un Index Scan = c'est gagné ;
--   · le nombre de lignes RENDUES : c'est lui qui traverse le réseau, et c'est
--     lui que les migrations 321 et 323 font chuter.
BEGIN;
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claims =
    '{"sub":"COLLE-ICI-UN-UUID-ELEVE","role":"authenticated"}';

  -- 4a. La maîtrise (321) — comparer l'agrégat à l'ancienne lecture complète.
  EXPLAIN (ANALYZE, BUFFERS) SELECT public.mastery_inputs();
  EXPLAIN (ANALYZE, BUFFERS)
    SELECT quiz_id, score, total FROM public.test_sessions;

  -- 4b. Les jours actifs (323) — au plus 400 lignes, contre une par session.
  SELECT jsonb_array_length(public.jours_actifs(now() - INTERVAL '400 days'))
    AS jours_rendus;
  EXPLAIN (ANALYZE, BUFFERS)
    SELECT public.jours_actifs(now() - INTERVAL '400 days');

  -- 4c. L'arène groupée (322) — toutes les clés doivent être présentes ;
  --     une clé à `null` = migration absente pour CE morceau, pas une panne.
  SELECT jsonb_object_keys(public.arene_accueil(current_date, current_date - 7));
  EXPLAIN (ANALYZE, BUFFERS)
    SELECT public.arene_accueil(current_date, current_date - 7);
ROLLBACK;


-- ┌───────────────────────────────────────────────────────────────────────────┐
-- │ 5. QUI COÛTE LE PLUS CHER, en vrai ? (extension pg_stat_statements)      │
-- └───────────────────────────────────────────────────────────────────────────┘
-- La seule mesure qui ne se discute pas : le temps RÉELLEMENT passé, cumulé
-- sur toutes les exécutions. `mean_exec_time` seul induit en erreur — une
-- requête à 2 ms appelée 4 000 fois/s coûte plus qu'une requête à 200 ms
-- appelée une fois. C'est `total_exec_time` qui décide de ce qu'on optimise.
-- Nécessite : CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
SELECT
  round(total_exec_time::numeric, 0)          AS ms_cumules,
  calls,
  round(mean_exec_time::numeric, 2)           AS ms_moyen,
  round((100 * total_exec_time
         / NULLIF(sum(total_exec_time) OVER (), 0))::numeric, 1) AS pct_du_total,
  left(query, 120)                            AS requete
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;

-- Repartir de zéro avant une campagne de mesure :
-- SELECT pg_stat_statements_reset();
