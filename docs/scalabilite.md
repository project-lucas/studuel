# Tenir cent mille élèves par jour

> État au 26/08/2026. Chaque chiffre de ce document vient d'une mesure ou d'une
> lecture du code, jamais d'une estimation de principe. Les deux inconnues sont
> nommées à la fin.

## L'arithmétique

| | Calcul | Résultat |
|---|---|---|
| Pages vues / jour | 100 k élèves × ~30 | **3 M** |
| Concentration | ~65 % entre 17 h et 21 h | 1,95 M sur 3 h |
| Pages / seconde au pic | 1,95 M ÷ 10 800 s | **~180/s** |
| Croissance de `test_sessions` | 100 k × ~30 sessions | **~3 M lignes/jour** |

Vercel ne bronchera pas : 180 invocations/s à ~200 ms font ~36 fonctions
concurrentes. **Le goulot est Postgres, et lui seul.** Une requête depuis la
France coûte ~105 ms (mesuré : 237 / 113 / 104 ms) — ce sont des appels HTTP
PostgREST, pas des requêtes sur une connexion ouverte. Ce qui compte n'est donc
pas leur durée mais leur NOMBRE.

## Ce qui a été corrigé

### 320 — L'optimisation RLS rendue permanente

`auth.uid()` écrite nue dans une policy est réévaluée **par ligne examinée**, et
le planificateur renonce à l'index. `(SELECT auth.uid())` en fait un InitPlan
évalué une fois. La migration 208 avait corrigé l'existant mais n'installait
rien de permanent : **100 policies nues contre 13 enveloppées** au moment de
l'audit, y compris `parent_prefs` créée le jour même.

La 320 pose trois niveaux : une fonction appelable, un rattrapage immédiat, et
un `EVENT TRIGGER` qui enveloppe toute policy à sa création — avec repli propre
si Supabase refuse le privilège superutilisateur. Côté dépôt,
`lib/rls-guard.ts` refuse désormais qu'un fichier neuf écrive une policy nue.

**C'est le point le plus important du lot** : sans lui, tout le reste se
redégrade au fil des migrations.

### 321 — La maîtrise s'agrège en base

`getChapterMastery` lisait `test_sessions` **sans limite et sans agrégat** — une
ligne par session jouée depuis l'inscription — pour n'en tirer qu'un `max` par
quiz, en JavaScript. Sur la table qui grossit le plus vite, pour une fonction
qui a **sept sites d'appel** (/defi, /reviser, /moi, Marcel…).

`mastery_inputs()` rend une ligne par quiz *joué*, borné par le catalogue.

### 322 — L'arène en un aller-retour

`/defi` ouvrait **20 lectures** puis 7 autres. Parallélisées, donc rapides — mais
~4 500 requêtes/s à la base au pic. `arene_accueil()` les groupe, et supprime au
passage la cascade : le cycle scolaire, qui obligeait à une seconde vague, est
maintenant dérivé en SQL au moment où le profil est lu.

### 323 — La série cesse de transférer l'historique

`/reviser` lisait **quatre tables d'activité sur 400 jours** pour n'en tirer
qu'un ensemble d'au plus 400 dates — et ramenait au passage trois colonnes
(`score`, `cards_count`, `xp`) que plus rien ne consommait, malgré un
commentaire affirmant le contraire.

## Ce qui était déjà juste

Le crédit revient à l'existant, et ce n'est pas rien :

- **La RLS partout** : c'est elle qui rendra les réplicas de lecture triviaux.
  Beaucoup d'apps ne scalent pas précisément parce que l'autorisation vit dans
  le code applicatif.
- **`getCurrentUser`** vérifie le JWT **en local** (ES256, WebCrypto) au lieu
  d'un aller-retour réseau, et `cache()` de React déduplique par requête. À 3 M
  de pages/jour, ce sont 3 M d'allers-retours économisés.
- **Le temps réel en `broadcast` seul**, jamais en `postgres_changes` : duels et
  coop ne mettent **aucune charge sur la base**. C'est le bon choix, et il est
  rarement fait.
- **La migration 166** avait déjà retiré le `ROW_NUMBER()` global des
  classements — ils comptent au lieu de trier, avec les index qu'il faut.
- **`regions: ["cdg1"]`** : les fonctions sont à Paris, les élèves aussi.

## Le cache par utilisateur : pourquoi il n'a pas été ajouté

Le plan initial prévoyait un cache serveur de 30-60 s sur les compteurs lents.
L'examen a montré que **ce serait presque entièrement redondant** :
`next.config.ts` pose déjà `staleTimes: { dynamic: 120 }`, soit un cache de
navigation de deux minutes côté client. Un cache serveur par utilisateur ne sert
que le même utilisateur — c'est-à-dire exactement ce que le router couvre déjà —
tout en ajoutant un risque d'invalidation réel : `revalidatePath` **n'invalide
pas** `unstable_cache`, il faudrait convertir les 19 appels à
`revalidatePath('/defi')` en `revalidateTag`, et en oublier un afficherait des
trophées périmés après un duel.

Ce qui aiderait vraiment est un cache **partagé** sur les données identiques
pour tous — le top 50 d'un classement, le nombre total de joueurs : 180
calculs/s deviendraient un par minute. Mais ces données sont aujourd'hui
servies à l'intérieur de `arene_accueil`, et les en extraire rétablirait
l'aller-retour supplémentaire que la 322 vient de supprimer.

**Les deux objectifs tirent en sens inverse, et c'est un arbitrage à faire les
chiffres en main**, pas à trancher d'avance. La marche à suivre : exécuter
320 → 323, puis lire `pg_stat_statements` (section 5 du fichier de mesure). Si
les classements y pèsent, on les sort du groupement et on les cache
globalement ; sinon, le groupement reste le meilleur choix.

## Mesurer — `supabase/_mesurer-perf.sql`

Cinq sections à coller dans le SQL Editor : volume des tables, policies non
optimisées (doit rendre zéro ligne), index jamais scannés, plans des lectures
chaudes vus par un vrai élève, et `pg_stat_statements`.

Une règle vaut d'être retenue : c'est **`total_exec_time` qui décide** de ce
qu'on optimise, jamais `mean_exec_time`. Une requête à 2 ms appelée 4 000
fois/s coûte plus qu'une requête à 200 ms appelée une fois.

Et il faut mesurer sur un compte **qui a de l'historique** : un compte neuf ne
révèle aucun problème de volume — c'est précisément le piège de ces dettes-là.

## Ce qui reste, et dans quel ordre

1. **Exécuter 320 → 323.** Elles sont dans `_ASSOCIE/a-executer.sql`. Tant
   qu'elles dorment, le code tourne sur ses replis : correct, mais au prix
   d'avant.
2. **Mesurer**, avec le fichier ci-dessus, et trancher l'arbitrage du cache.
3. **Partitionner `test_sessions`** au seuil de ~50 M de lignes — voir
   [partitionner-test-sessions.md](partitionner-test-sessions.md). On ne
   partitionne pas pour lire plus vite, **on partitionne pour pouvoir jeter**.
4. **Les réplicas de lecture, en dernier.** C'est un problème d'argent, pas
   d'architecture : la RLS étant en base, un réplica applique les mêmes règles
   sans une ligne de code à changer. Il faudra router les lectures vers le
   réplica et garder les écritures sur le primaire — et accepter un retard de
   réplication de quelques centaines de millisecondes, invisible sur un
   classement, gênant juste après une mutation. Le repère : **y venir quand
   `pg_stat_statements` montre que la lecture domine et que le primaire sature
   malgré les points 1 à 3**, pas avant.

## Les deux inconnues

Elles ne changent pas les conclusions, mais elles changent les chiffres, et
elles se lisent toutes les deux dans le tableau de bord Supabase :

- **La taille de compute de l'instance.** Elle décide du plafond en requêtes/s.
- **Sa région exacte.** Le gateway Cloudflare la masque. Si elle n'est pas en
  Europe de l'Ouest, chaque requête paie deux fois la traversée depuis `cdg1`.
