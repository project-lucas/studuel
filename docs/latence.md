# Latence — pour des onglets qui s'ouvrent comme chez Duolingo

Chantier ouvert le 03/09/2026. Lucas testait l'app sur son téléphone : « ce n'est
pas fluide du tout ». Ce document dit ce qui a été **mesuré**, ce qui a été
changé, comment le vérifier, et ce qui reste.

## Ce qui a été mesuré (prod, 03/09/2026)

Mesures prises sur `studuel.vercel.app` depuis un navigateur connecté, fonctions
chaudes (`x-vercel-id: cdg1::cdg1`, donc bien à Paris).

**Temps serveur d'un onglet** (charge utile RSC complète, 6 mesures, médiane) :

| Onglet     | médiane | min → max   | taille |
|------------|---------|-------------|--------|
| /defi      | 412 ms  | 363 → 591   | 65 Ko  |
| /moi       | 315 ms  | 265 → 1 537 | 58 Ko  |
| /reviser   | 206 ms  | 171 → 344   | 61 Ko  |
| /amis      | 193 ms  | 187 → 206   | 26 Ko  |
| /marcel    | 170 ms  | 146 → 198   | 36 Ko  |
| /tresor    | 120 ms  | 108 → 141   | 29 Ko  |

**Démarrage à froid** : la première requête après une pause coûte ~780 ms de
plus (`curl` sur /login : 785 ms puis 115 à 240 ms). Un testeur qui ouvre l'app
par intermittence tombe **souvent** dessus.

**Premier chargement de /defi connecté** : document terminé à 3,9 s, `load` à
4,1 s, 513 Ko de JavaScript compressé (21 morceaux), 803 Ko d'images — dont
**483 Ko pour la favicon** (`app/icon.png` en 512 px), rechargée à chaque page.

**Changement d'onglet** : aucun préchargement (`prefetch={false}` partout, et le
balayage n'en faisait plus non plus, depuis l'épisode des 503 du 22/08). Chaque
premier passage sur un onglet attendait donc le serveur (200 à 600 ms à chaud,
plus à froid), plus 2 ou 3 morceaux de JavaScript, derrière un squelette.

Deux pièges de mesure rencontrés, à connaître :

- Un onglet de navigateur **caché** bride ses minuteurs à 1 par seconde (puis 1
  par minute après 5 min) : tout chrono fondé sur `setTimeout` y lit « 1 000 ms »
  et les `fetch` y restent en attente. Mesurer dans un onglet visible, ou par
  `MutationObserver` + `history.pushState`.
- React 19.2 attend jusqu'à 800 ms que les `<img>` non paresseuses d'une
  transition soient décodées avant de l'afficher (`suspensey images`). Ça ne
  concerne PAS `next/image` (qui pose toujours un `onLoad`), seulement les
  `<img>` bruts sans `loading="lazy"`. Vérifié : pas en cause ici.

## Ce qui a été changé

1. **Le préchargement piloté des onglets** — `lib/precharge-onglets.ts` (la
   règle, pure, testée) + `components/PrechargeurOnglets.tsx` (monté dans le
   layout, connecté seulement). Une fois le premier écran peint, il demande au
   routeur les quatre autres onglets **en entier** (`kind: 'full'`, pas le
   simple squelette), **un par un**, espacés de 400 ms, voisins de balayage en
   tête. Puis une ronde toutes les 45 s ne relance que ce qui a expiré (le cache
   du routeur tranche : `staleTimes.dynamic` = 120 s). Il s'arrête hors des
   onglets, app cachée, ou élève inactif depuis 3 min. Les actions serveur qui
   invalident le cache relancent une ronde après 3 s.
   La barre d'onglets relance aussi l'onglet visé dès que le doigt se pose
   (`onPointerDown`), au cas où son entrée a expiré — sans coût si elle est
   fraîche.
   Coût serveur : 4 rendus à l'ouverture, puis au plus 4 rendus par 2 min par
   élève actif et visible. C'est ce qui rend un tap instantané.
2. **La transition de page** (`app/template.tsx`) : fondu de 150 ms, plus de
   glissement de 300 ms — avec des onglets déjà en mémoire, l'animation était
   devenue l'attente.
3. **L'arène en 4 vagues au lieu de 7** : `getProfileData()` (badges → stats →
   bannières → école) était attendu APRÈS les deux vagues de la page ; il part
   maintenant en parallèle, et ses bannières ont rejoint sa vague de lectures.
4. **Le client Supabase du navigateur sorti des écrans** : `lib/mastery.ts`
   mélangeait règles pures et lecture serveur ; importé par des composants
   client, il embarquait `lib/catalog` et supabase-js (57 Ko gz) sur /defi,
   /reviser, /marcel, la page matière et le quiz. La lecture vit dans
   `lib/mastery-server.ts`. Les deux modes en direct (`LiveDuelMode`,
   `CoopMode`) se chargent à la demande dans `DefiHome`.
   Résultat (build local, visiteur) : /defi 481 → 422 Ko gz ; /reviser 293,
   /marcel 287, /login 223.
5. **Les icônes** : `app/icon.png` 483 → 17 Ko (192 px, palette),
   `apple-icon` 76 → 15 Ko, `icons/icon-192` 85 → 17 Ko, `icon-512` 483 → 85 Ko.

### Second lot (03/09, soir) — les dossiers de matière

Lucas : « l'ouverture des dossiers de matière est longue au premier clic ».
Cause, lue dans `app/reviser/[subject]/page.tsx` : **cinq allers-retours
Supabase en file indienne** (profil → programme → données personnelles → cours
du carnet → questions du carnet), et parmi eux la lecture la plus lourde du
dossier : les **colonnes complètes de toutes les questions de la matière**
(énoncé, options, explication — plusieurs centaines de lignes) pour n'en garder
que 60 au hasard pour le boss. Et rien ne préchargeait un dossier avant le tap.

Changé :

- **3 vagues au lieu de 5** : tout ce qui ne dépend que de l'élève et de la
  matière (avancement, file SRS, classement, axes, annales, gardien, cours du
  carnet) part PENDANT la lecture du programme ; la vague finale ne garde que
  ce qui dépend des quiz ou du carnet.
- **Le boss tire au sort 10 quiz** et ne lit en entier que leurs questions ;
  le compte par quiz et le rattachement SRS ne lisent que les identifiants.
- **`PrechargeurDossiers`** (monté par la grille de Réviser) : les 3 premiers
  dossiers de la grille sont préchargés en entier, un par un, une fois les
  onglets servis (`DELAI_PREMIER_DOSSIER_MS`). Et le doigt qui se pose sur un
  dossier relance celui-là (`onPointerDown`).

### Troisième lot (05/09) — framer-motion quitte quatre onglets

`components/carnet/BottomSheet.tsx` (la feuille montante des volets de
Réviser, Moi et Marcel) et les deux modales d'Amis (`FriendAddButton`,
`FriendQrButton`) jouaient leur entrée et leur sortie avec framer-motion —
~45 Ko gz embarqués sur chaque onglet pour un voile qui apparaît et un panneau
qui monte. Réécrits en CSS (`@keyframes feuille-*` et `modale-*`,
globals.css) ; la sortie garde le panneau monté jusqu'à `animationend`
(`components/useSortieAnimee.ts`), avec un filet de 400 ms.

JavaScript client par onglet (build local, chunks non différés du manifeste
RSC, gzip) :

| Onglet   | avant  | après  |
|----------|--------|--------|
| /reviser | 126 Ko | 81 Ko  |
| /moi     | 215 Ko | 170 Ko |
| /marcel  | 120 Ko | 75 Ko  |
| /amis    | 119 Ko | 74 Ko  |
| /defi    | 255 Ko | 255 Ko (framer-motion y reste nécessaire au premier rendu) |

Mesure : `node <scratch>/poids.mjs` lit `.next/server/app/<route>/page_client-reference-manifest.js`
et somme les chunks `async: false`. Next 16 n'imprime plus les tailles par
route au build.

Même jour, un défaut qui n'est pas de latence mais de JUSTESSE et qui touchait
tous les onglets : PostgREST plafonne chaque réponse à 1 000 lignes et le
catalogue l'avait dépassé (2 323 chapitres). Voir la règle dans CLAUDE.md et
`lib/postgrest-pages.ts`.

### Quatrième lot (19/09) — une vague par onglet, et le PvP qui tient la charge

Le constat, onglet par onglet : chaque aller-retour Supabase coûte ~60 ms depuis
cdg1, et les pages les enchaînaient.

| Écran | Avant | Après |
|---|---|---|
| Profil de jeu (`getProfileData`, arène ET Moi) | 3 vagues : attribution des badges → lectures → école | 1 vague : l'attribution tourne en parallèle, l'école est chaînée sur le seul profil, catalogue des badges et bannières en cache |
| Moi | 1 vague + 4 tables d'activité lues sur **400 jours** + `my_grade_standings` lue deux fois + une écriture attendue | `jours_actifs()` (1 RPC) ; sessions du JOUR seulement si une habitude se coche seule ; place du niveau lue une fois ; écriture dans `after()` |
| Arène | 2 vagues (la 2e attendait TOUT la 1re) ; maîtrise lue deux fois ; quiz de la classe relus sans cache | 1 vague : ce qui dépend de la classe part dès la lecture groupée ; maîtrise partagée ; quiz par matière en cache |
| Amis | 3 vagues (grande lecture → école → demandes d'écoute) | 1 vague, l'école chaînée sur le profil |
| Marcel | 2 vagues ; 3 tables d'activité sur 400 jours ; lisait `controle_sessions`, **table qui n'existe pas** | 1 vague ; `jours_actifs()` ; `sessions_preparation` (la mission voit enfin les contrôles planifiés) |
| Réviser, Carnet, Revoir | `carnet_questions` lue SANS filtre : la RLS testait chaque question de TOUS les élèves | jointure `carnet_courses!inner(owner_id)` : l'index des cours de l'élève |
| Boutique | objets de profil et capsules relus à chaque rendu | cache serveur (5 min) |
| Carnet | aucun squelette : le tap restait muet | `app/carnet/loading.tsx` |

Et autour de la navigation :

- **Revalidations.** `markLessonActivity` (appelée à chaque leçon) revalidait
  /reviser pour rien ; les réglages de Réviser appellent `refresh()` (ne relit
  que l'écran courant) au lieu de `revalidatePath` (jette TOUS les onglets
  préchargés). Après une invalidation, la ronde de préchargement repart à
  **400 ms** au lieu de 3 s.
- **La course classée** ne revalide plus rien (elle re-rendait la course
  elle-même, ~14 requêtes, puis faisait recharger quatre onglets — à chaque
  revanche) ; le préchargeur se tait pendant tout écran plein écran, et
  rafraîchit UNE fois en sortant de la course. Par course : de ~70-100 requêtes
  à une vingtaine. La fin de course passe par `/api/duel/fin` (interruptible,
  relançable, idempotente) et, avec la migration 374, par UNE transaction au
  lieu de huit appels.
- **Base (migration 374)** : Realtime vérifié par clé primaire (plus de parcours
  complet de `live_duels` à chaque connexion), six index en double retirés
  (chaque écriture les payait), `friendships(addressee_id)` ajouté.

## Comment vérifier sur le téléphone (après déploiement)

1. Ouvrir l'app, attendre le hub (rideau levé), **ne rien toucher 3 s**.
2. Toucher chaque onglet de la barre : le contenu doit apparaître **dans la
   foulée du tap**, sans squelette. Revenir dessus : idem.
3. Attendre 2 min sans quitter l'app, toucher un onglet : encore instantané (la
   ronde a rafraîchi ce qui avait expiré).
4. Depuis un ordinateur, onglet **visible**, console :
   `performance.getEntriesByType('resource').filter(r => r.name.includes('_rsc'))`
   après 5 s sur /defi doit lister 4 requêtes (une par onglet), puis aucune lors
   des taps.

Reste vrai : la **première** ouverture après une pause paie le démarrage à froid
de la fonction Vercel (~0,8 s) plus le rideau (450 ms minimum). Ce point n'est
pas réglé par ce chantier (voir ci-dessous).

## Ce qui reste

- **Démarrage à froid** : un ping externe toutes les 5 min sur `/login`
  (cron-job.org, UptimeRobot) garde la fonction chaude — décision de Lucas, hors
  dépôt. Alternative payante : Fluid Compute / instances réservées Vercel.
- ~~**framer-motion** (43 + 24 Ko gz) sur Réviser, Moi, Marcel et Amis~~ —
  RÉGLÉ. `BottomSheet` et les boutons d'ajout d'ami animent en CSS
  (`useSortieAnimee`) ; le dernier usage d'entrée sur Amis, le balancement du
  blason courant de `RailDivisions`, est passé en CSS le 18/09/2026
  (`float-y`, `motion-safe:`). La librairie ne reste que là où elle sert au
  premier rendu (arène : HUD, bandeau de saison) et dans les sessions de quiz.
- **/moi** pointe à 1,5 s par moments : à profiler sur `pg_stat_statements`
  (voir `supabase/outils/_mesurer-perf.sql`) avant d'y toucher.
- **Niveau 3** (jamais fait) : `cacheComponents` + `<Suspense>` sur les données
  personnelles + `unstable_instant` par route — la coquille statique de chaque
  onglet servie depuis le CDN, les données en flux. C'est le vrai modèle
  « instantané » de Next 16, mais chaque page lit les cookies en tête : gros
  chantier, à mener page par page.
