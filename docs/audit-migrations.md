# Audit des migrations Supabase — 22/09/2026

> Question posée : « l'app n'est pas fluide ; avec plus de 300 migrations, il y
> en a sûrement en doublon ou périmées — lesquelles retirer ou regrouper ? »
>
> Réponse courte : **le nombre de fichiers dans `supabase/` n'a aucun effet sur
> la vitesse de l'app**, et l'inventaire de l'état final ne révèle qu'un ménage
> mineur (six index redondants, cinq tables mortes, une fonction morte —
> migration 375). Ce qui coûte, mesuré et non supposé, est ailleurs : **quatorze
> migrations de performance jamais exécutées en production**, sur lesquelles le
> code tourne en mode dégradé, et trois facteurs hors base (démarrage à froid,
> région, JavaScript). Tout est détaillé ci-dessous, avec la marche à suivre.

## 1. Pourquoi le nombre de migrations ne compte pas

Une migration est un script SQL collé **une fois** dans le SQL Editor. La base
en garde le RÉSULTAT (tables, fonctions, policies, index) et ne relit jamais le
dossier. Cent ou mille fichiers produisent le même schéma, et une requête de
l'app ne sait pas combien de fichiers l'ont construit.

Ce qui peut coûter, côté base, ce sont des OBJETS : une policy évaluée ligne par
ligne, un index en double entretenu à chaque écriture, un trigger lourd sur une
table chaude, une fonction qui lit trop. C'est cela que l'audit a inventorié.

## 2. L'état final produit par les 147 fichiers de `schema/`

Inventaire reconstruit par script (chaque `CREATE`, `ALTER`, `DROP` rejoué dans
l'ordre, dernière définition retenue), puis croisé avec le code (`app/`, `lib/`,
`components/`, `scripts/`) et avec le corps de chaque fonction SQL vivante.

| Objets vivants | Nombre | Remarque |
|---|---|---|
| Tables | 115 | 2 supprimées au fil des migrations |
| Fonctions (RPC, triggers) | 169 | `child_dashboard` redéfinie 5 fois, `apply_ranked_match`, `current_streak`, `clan_mates` 4 fois — c'est normal : seule la dernière compte |
| Policies RLS | 149 | au plus 4 par table |
| Index | 107 | la 374 en retire déjà 6 en double (pas encore en prod) |
| Triggers | 11 | tous légers (voir § 4) |
| Vues | 2 | `activity_days`, `question_scope` |

**Ce qui est mort** (plus rien ne le nomme) :

| Objet | Créé par | Pourquoi mort | Sort |
|---|---|---|---|
| `revision_subjects`, `revision_items` | 005 | tableau de révision retiré avec le code mort (`f345eb0`) | supprimées (375) |
| `debrief_habits`, `debrief_logs` | 027 | débrief du soir retiré (`f345eb0`) | supprimées (375) |
| `library_items` | 158 | remplacée par le carnet | supprimée (375) |
| `season_crowns_for_tier()` | 207 | barème recopié dans `lib/saison`, jamais appelée | supprimée (375) |
| `app_flags` | 192 | garde-fou anti-rejeu de la 192 (re-multiplierait les gemmes) | **gardée** |

**Index redondants** (préfixe exact d'une clé primaire ou d'une contrainte
UNIQUE de la même table — le planificateur ne les choisit jamais) :
`chapters_subject_level_idx`, `lessons_chapter_idx`, `chapter_unlocks_user_idx`,
`boss_gauges_user_idx`, `exam_papers_subject_level_idx`,
`dictee_segments_dictee_idx`. Retirés par la 375.

**Ce qui n'est PAS mort, contrairement aux apparences** : 27 tables ne sont
nommées par aucun fichier TypeScript mais sont lues ou écrites par des
fonctions SQL vivantes (`game_matches`, `duel_replays`, `gem_events`,
`season_progress`, `parent_children`…). Les supprimer casserait des RPC.

**Doublons de migrations** : il n'y en a pas au sens « même chose faite deux
fois ». Les redéfinitions successives d'une fonction (`CREATE OR REPLACE`) sont
l'histoire du produit ; en base il n'en reste qu'une version.

## 3. Ce qui coûte vraiment — mesuré en production le 22/09/2026

### 3a. Quatorze migrations de performance dorment

`npm run sonde` (lecture seule, clé anon) : **353 · 354 · 355 · 363 · 364 ·
366 → 374 sont absentes**. Le code les tolère en retombant sur des chemins plus
lents — c'est voulu (déployer avant d'exécuter ne doit rien casser), mais c'est
exactement le mode dégradé que l'on constate :

| Migration absente | Ce que le code fait à la place | Coût |
|---|---|---|
| **354** (comptes de questions en base) | relit `quiz_questions` par pages de 1 000 pour compter — 18 262 lignes, 19 allers-retours | ~1 s par rafraîchissement du cache catalogue (5 min) |
| **374** (tenir la charge) | fin de course en **huit** appels au lieu d'une transaction ; chaque connexion à un duel en direct **parcourt toute** `live_duels` ; six index en double entretenus à chaque écriture ; `friendships(addressee_id)` sans index | à chaque course et à chaque duel |
| **371 · 373** (bouclier, paliers) | RPC absentes → replis silencieux | fonctionnel plus que perf |
| **353 · 355 · 363 · 364 · 366 → 370 · 372** | features éteintes (carnet, palmarès, capsules, marché, cahier d'exercices) | fonctionnel |

**Marche à suivre** : `_ASSOCIE/a-executer.sql` a été régénéré (14 migrations,
221 Ko, un seul lot) et se termine désormais par le filet RLS de la 320 (voir
3b). Le coller en entier dans le SQL Editor → Run. Puis coller
`contenu/365_exercices_6e.sql` (dépend de la 364), puis
`schema/375_menage_schema.sql`.

### 3b. La 320 (RLS en InitPlan) est-elle complète ? — à vérifier par Lucas

C'est le point le plus important pour la base, et il n'est **pas mesurable à la
clé anon**. La 320 réécrit `auth.uid()` en `(SELECT auth.uid())` dans toutes les
policies (une évaluation par requête au lieu d'une par ligne, et l'index sur
`user_id` redevient utilisable) et pose un EVENT TRIGGER pour les policies
futures — que Supabase peut avoir refusé. Dans les fichiers, **88 policies sont
encore écrites nues** ; en base, elles ne le sont que si la 320 n'a pas tourné
ou si le trigger manque.

À coller dans le SQL Editor — `supabase/outils/_mesurer-perf.sql` § 2 :

```sql
-- doit rendre ZÉRO ligne
SELECT c.relname, p.polname FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND coalesce(pg_get_expr(p.polqual, p.polrelid), '') || coalesce(pg_get_expr(p.polwithcheck, p.polrelid), '')
      ~ 'auth\.(uid|jwt|role|email)\(\)'
  AND coalesce(pg_get_expr(p.polqual, p.polrelid), '') || coalesce(pg_get_expr(p.polwithcheck, p.polrelid), '')
      !~* 'SELECT\s+auth\.';
-- 1 ligne = le trigger est posé
SELECT evtname FROM pg_event_trigger WHERE evtname = 'rls_initplan_auto_trg';
```

S'il reste des lignes : `SELECT public.optimiser_policies_rls();` (idempotent).
Le générateur de lots l'ajoute désormais en queue de chaque rattrapage.

### 3c. Les trois facteurs hors base

Mesuré aujourd'hui sur `studuel.vercel.app` (fonctions à Paris, `cdg1`) :

| Page (visiteur) | à chaud | à froid |
|---|---|---|
| `/login` | 104 → 166 ms | 635 ms |
| `/defi` | 133 → 188 ms | 329 ms |

- **Le démarrage à froid** (~0,5 à 0,8 s) touche chaque ouverture après une
  pause — le cas normal d'un élève sur téléphone. Un ping externe toutes les
  5 min sur `/login` (UptimeRobot, cron-job.org) le supprime ; c'est une
  décision hors dépôt, notée dans `docs/latence.md` depuis le 03/09.
- **La région de l'instance Supabase** : invisible depuis le code (gateway
  Cloudflare). Chaque aller-retour coûte ~60 ms depuis Paris, ce qui est le
  prix d'une traversée vers l'Irlande ou Francfort, pas d'un voisin. À lire
  dans le tableau de bord Supabase → Settings → General. Si l'instance n'est
  pas en Europe de l'Ouest, c'est le premier chantier ; si elle y est, le
  compute (micro/small) plafonne les requêtes par seconde.
- **Le JavaScript de l'arène** : 255 Ko gz sur `/defi` (framer-motion
  nécessaire au premier rendu), contre 75–80 Ko sur les autres onglets.

### 3d. Ce que seul `pg_stat_statements` peut dire

`docs/latence.md` note « /moi pointe à 1,5 s par moments ». Aucune lecture du
code ne tranchera : `_mesurer-perf.sql` § 5 (`total_exec_time` décroissant)
donne la liste des requêtes qui coûtent réellement, et § 3 les index jamais
scannés. À faire sur un compte **avec de l'historique**.

## 4. Ce qui a été vérifié et jugé sain

- **Triggers sur les tables chaudes** : `test_sessions_daily_cap` (un `COUNT`
  par insertion, servi par `test_sessions_user_created_idx`),
  `test_sessions_activate_referral` (un `UPDATE … WHERE status = 'pending'`,
  encapsulé, jamais bloquant), `review_items_due_date_sync` (recopie de
  colonne). Rien à retirer.
- **Policies à sous-requête** : 14, toutes corrélées à une clé (`quiz_id`,
  `course_id`, `owner_id`) — des semi-jointures par index, pas des boucles.
  `quiz_questions_select_gated` (002) combine un `EXISTS` sur `quizzes` par PK
  et un `EXISTS` non corrélé sur `profiles` (hissé en InitPlan). Correct.
- **Index des tables chaudes** : `test_sessions (user_id, created_at)`,
  `(user_id, quiz_id)`, `(quiz_id)` [374] ; `study_sessions`,
  `challenge_sessions`, `game_matches`, `review_items` (`user_id` + échéance,
  chapitre, matière), `carnet_review_sessions` — présents.
- **Les 65 replis `isMissingSchemaObject`** ne se déclenchent que sur « objet
  absent » (PGRST202/204/205, 42883, 42703, 42P01), jamais sur un refus de
  droit. Une fois les migrations collées, ils ne coûtent rien.

## 5. « Regrouper » les migrations : ce que ça veut dire, et ce qui ne se fait pas

- **Ne pas fusionner les fichiers existants.** Une migration exécutée ne se
  modifie jamais (règle du projet), et les fichiers ne décrivent plus
  exactement la production : les policies ont été réécrites en base (208,
  320), des contenus ont été corrigés depuis l'admin, certains seeds n'ont
  jamais tourné. Une fusion « à la main » produirait un schéma faux.
- **Le vrai regroupement est un `pg_dump --schema-only`** de la production,
  à faire le jour où l'on recrée un projet Supabase de zéro : un seul fichier
  de départ, exact. Il demande le mot de passe de la base (Dashboard →
  Settings → Database) et la CLI Supabase ou `pg_dump` :
  `pg_dump --schema-only --no-owner --no-privileges "$DATABASE_URL" > supabase/schema/baseline.sql`.
  Ce n'est pas un chantier de performance.
- **Ce qui reste utile dans le dépôt** : `schema/` (147 fichiers, 1,4 Mo) est
  l'histoire lisible du produit et la source des tests miroirs ; `contenu/`
  (226 fichiers, 21 Mo) est le contenu scolaire. Aucun des deux n'est chargé
  par l'app.

## 6. Résumé des actions

| Fait | Où |
|---|---|
| Inventaire complet de l'état final + croisement avec le code | ce document, § 2 |
| Migration de ménage (6 index, 5 tables, 1 fonction), sondable | `schema/375_menage_schema.sql`, sonde `table-absente` |
| Fichier de rattrapage régénéré, avec le filet RLS en queue | `_ASSOCIE/a-executer.sql`, `_ASSOCIE/genere-a-executer.mjs` |
| **À faire par Lucas** : coller `a-executer.sql`, puis 365, puis 375 | SQL Editor |
| **À faire par Lucas** : `_mesurer-perf.sql` § 2 (RLS) et § 5 (`pg_stat_statements`) | SQL Editor |
| **À lire par Lucas** : région et compute de l'instance | Dashboard Supabase |
| **À décider par Lucas** : ping toutes les 5 min pour tuer le démarrage à froid | hors dépôt |
