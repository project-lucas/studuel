# Partitionner `test_sessions` — le jour où il faudra

> **À NE PAS FAIRE MAINTENANT.** Ce document décrit une opération à déclencher
> sur un SEUIL, pas sur une intuition. Partitionner une table de deux millions
> de lignes coûte une interruption de service et ne rapporte rien.

## Le seuil

**~50 millions de lignes dans `test_sessions`.** Il se lit avec la section 1 de
`supabase/_mesurer-perf.sql` :

```sql
SELECT c.relname, c.reltuples::bigint AS lignes_estimees
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'test_sessions';
```

À cent mille élèves actifs, `test_sessions` prend environ **3 millions de lignes
par jour** : le seuil tombe donc en deux à trois semaines d'activité à cette
échelle. À l'échelle actuelle, il est très loin — d'où ce document plutôt qu'une
migration.

## Pourquoi ce seuil, et pas un autre

Ce n'est pas la taille qui fait mal, c'est ce qu'elle empêche :

- **L'autovacuum décroche.** Au-delà de quelques dizaines de millions de lignes,
  un `VACUUM` complet ne tient plus dans une fenêtre creuse, les lignes mortes
  s'accumulent et les scans ralentissent — y compris ceux qui utilisent un
  index.
- **Les index cessent de tenir en mémoire.** Tant que l'index
  `test_sessions_user_quiz_idx` tient dans le cache, l'agrégat de la
  migration 321 est quasi gratuit. Quand il déborde, chaque lecture retourne
  sur disque.
- **Purger devient impossible.** Supprimer l'historique de plus de deux ans est
  un `DELETE` de plusieurs dizaines de millions de lignes — des heures de
  verrous. Sur une table partitionnée, c'est un `DROP TABLE` par mois :
  instantané.

Ce dernier point est le vrai motif. On ne partitionne pas pour lire plus vite,
**on partitionne pour pouvoir jeter**.

## Ce qu'il faut faire avant

1. **Les migrations 320 → 323 doivent être passées.** Elles retirent
   l'essentiel des lectures non bornées ; partitionner sans elles reviendrait à
   rendre plus rapide un travail qui n'a pas lieu d'être fait.
2. **Mesurer `pg_stat_statements`** (section 5 du fichier de mesure). Si
   `test_sessions` n'apparaît pas dans les vingt premières lignes de
   `total_exec_time`, le problème est ailleurs.
3. **Décider de la rétention.** Le partitionnement n'a d'intérêt que si l'on
   sait ce qu'on garde. Proposition : 24 mois glissants — deux années
   scolaires, soit assez pour la courbe de progression d'un élève de seconde
   arrivé en terminale.

## La forme retenue

Partitionnement **par plage sur `created_at`, une partition par mois**.

Le mois, et non la semaine : ~24 partitions vivantes pour deux ans de
rétention. Postgres planifie mal au-delà de quelques centaines de partitions,
et la semaine en produirait une centaine pour le même service.

Pas de partitionnement par `user_id` (hachage) : il accélérerait les lectures
par élève, mais c'est déjà le rôle de `test_sessions_user_quiz_idx`, et il
rendrait la purge par date impossible — c'est-à-dire qu'il coûterait la seule
chose qu'on vient chercher.

## La marche à suivre

Postgres ne convertit pas une table en table partitionnée sur place. Il faut
créer la nouvelle, copier, permuter :

```sql
-- 1. La table partitionnée, à côté.
CREATE TABLE public.test_sessions_part (LIKE public.test_sessions INCLUDING ALL)
  PARTITION BY RANGE (created_at);

-- 2. Une partition par mois, sur la fenêtre de rétention + le mois à venir.
--    À générer en boucle plutôt qu'à la main.
CREATE TABLE public.test_sessions_2026_08 PARTITION OF public.test_sessions_part
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');

-- 3. Copier PAR TRANCHES, hors des heures de pointe. Jamais d'un seul INSERT :
--    il tiendrait un verrou et gonflerait le WAL jusqu'à saturer le disque.
INSERT INTO public.test_sessions_part
  SELECT * FROM public.test_sessions
   WHERE created_at >= '2026-08-01' AND created_at < '2026-09-01';

-- 4. La permutation, dans UNE transaction courte.
BEGIN;
  ALTER TABLE public.test_sessions RENAME TO test_sessions_ancienne;
  ALTER TABLE public.test_sessions_part RENAME TO test_sessions;
COMMIT;

-- 5. Ne PAS supprimer l'ancienne avant plusieurs jours de service normal.
-- DROP TABLE public.test_sessions_ancienne;
```

### Les quatre pièges

- **La RLS ne suit pas.** `INCLUDING ALL` copie les index et les contraintes,
  **pas les policies**. Il faut les recréer sur la table partitionnée, puis
  rejouer la migration 320 (ou `SELECT public.optimiser_policies_rls();`) pour
  qu'elles soient enveloppées. Une table partitionnée sans policy est une table
  **entièrement lisible** — c'est le risque le plus grave de l'opération.
- **La clé primaire doit contenir `created_at`.** Postgres l'exige sur une table
  partitionnée. Si la PK actuelle est `id` seul, elle devient `(id, created_at)`
  — vérifier qu'aucun code ne suppose l'unicité de `id` seul.
- **Les écritures pendant la copie.** Les sessions jouées entre l'étape 3 et
  l'étape 4 arrivent dans l'ancienne table. Soit on copie en deux passes (la
  seconde très courte, juste avant la permutation), soit on accepte une fenêtre
  de maintenance de quelques minutes.
- **PostgREST met en cache le schéma.** Après la permutation, forcer un
  rechargement (`NOTIFY pgrst, 'reload schema';`) — sinon l'API continue de
  servir l'ancienne table jusqu'à son propre rafraîchissement.

## L'entretien, ensuite

Une partition doit exister AVANT que des lignes ne veuillent y entrer, sinon
l'insertion échoue — c'est-à-dire qu'un élève ne peut plus jouer. Deux options :

- **`pg_partman`**, si l'extension est disponible sur le projet : elle crée les
  partitions à venir et supprime les anciennes toute seule.
- **Un job mensuel** dans le cron GitHub Actions existant
  (`.github/workflows/rappels.yml`), qui crée la partition du mois suivant et
  détache celle qui sort de la fenêtre de rétention.

Dans les deux cas, prévoir **trois mois d'avance**, pas un : un cron qui échoue
en silence ne doit pas se traduire par une app qui refuse les réponses le
1er du mois.
