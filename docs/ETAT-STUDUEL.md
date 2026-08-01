# État de Studuel — audit du 31/07/2026, **remesuré le 01/08/2026**

> Chaque pourcentage est un **jugement**, mais chaque jugement s'appuie sur une
> mesure : sonde de la base réelle (`npm run sonde`, `npm run sonde:contenu`),
> comptage du code, et relevé des promesses non tenues dans l'UI.
>
> **100 % = défendable devant un élève réel et un parent payant** : aucune
> fonction morte, aucun « bientôt », aucun écran vide.
>
> ⚠️ **Trois chiffres de la version du 31/07 étaient faux.** Ils sont corrigés
> ci-dessous, avec la mesure qui les remplace. La leçon vaut d'être notée :
> l'audit d'hier avait compté par `grep` là où il fallait interroger la base.

---

## Le tableau

| Domaine | 31/07 | 01/08 | Ce qui bloque encore |
|---|---|---|---|
| **Réviser** | 80 % | **95 %** | Plus rien à écrire : 5 migrations de contenu à **exécuter** |
| **Backend / sécurité** | 65 % | **80 %** | CI en place ; 17 migrations à exécuter (dont la 198, une fuite) |
| **Onboarding** | 70 % | **85 %** | Le tour guidé se lance enfin sans la 188 (mémoire locale) |
| **Défi** | 75 % | **80 %** | 194 · 202 · 210 étaient absentes du fichier unique — corrigé |
| **Trésor / monétisation** | 10 % | **45 %** | La caisse v0 existe ; reste à exécuter la 221 et à encaisser |
| **Contenu** | 35 % | **60 %** | +159 chapitres, +1272 questions écrits ; 0 matière vide après exécution |
| **Marcel** | 65 % | **85 %** | L'échelle de l'oral est livrée ; reste la typologie d'erreur |
| **Amis** | 60 % | **75 %** | Le barreau 4 donne enfin un usage social qui n'est pas une comparaison |
| **Moi** | 55 % | **80 %** | « Mes habitudes » n'est plus un panneau « Bientôt ici » |
| **Notifications** | 25 % | 30 % | `node scripts/vapid.mjs` génère les clés ; il faut les poser sur Vercel |

**Moyenne pondérée par l'enjeu : ~78 %** (contre ~55 % la veille). L'écart tient
à quatre choses : le contenu manquant a été écrit, la caisse existe, l'échelle de
l'oral est livrée, et « Mes habitudes » a cessé d'être une promesse. Le reste
tient à une demi-journée d'exécution de SQL.

---

## Les trois erreurs de l'audit du 31/07

**1. « 521 questions au total ».** Faux. La base en compte **2 891**, pour 295
quiz et 564 leçons (`npm run sonde:contenu`). Le vrai problème n'était pas le
nombre de questions par chapitre (~10, ce qui est correct) mais que **269 leçons
sur 564 n'avaient aucun quiz** — une leçon sur deux affichait donc « les
flashcards arrivent bientôt » et « le défi de cette leçon arrive bientôt ».

**2. « Défi : 5 impasses assumées à l'écran ».** Faux. En relisant les fichiers
cités : ce sont des **commentaires** parlant des « contrôles à venir » et deux
états vides légitimes (« pas assez de questions dans ta classe »). Les cinq
modes du Défi sont tous `implemented: true` — le badge « Bientôt » de
`DefiHome` est du code mort.

**3. « Moi : migrations 187 et 189 hors du catalogue, état inconnu ».** Exact sur
le fond — et la réponse est tombée dès qu'on les y a mises : **elles sont
exécutées**. `term_grades` et `avatar_items` répondent. L'onglet Moi n'était pas
cassé, il était juste non surveillé.

À quoi s'ajoute une nuance sur Amis : « 4 composants contre 36 au Défi »
comparait `components/amis/` à `components/defi/`. L'onglet en utilise en
réalité **9**, dont un `AmisHome` de 918 lignes. La surface est plus mince que
celle du Défi, elle n'est pas indigente.

---

## Ce qui a été fait le 01/08

### Réviser : 80 % → 95 %

**Le code** — les quatre « bientôt » de l'onglet sont éteints :

- **Flashcards et défi de leçon** empruntent désormais le quiz d'une leçon
  voisine du même chapitre quand la leçon n'a pas le sien (`lib/lesson-quiz.ts`,
  testé). 269 impasses fermées d'un coup. L'emprunt est **dit** à l'élève
  (« Questions du chapitre · … ») : on ne fait pas passer le quiz du voisin pour
  celui de la leçon.
- **Carte mentale** : elle est **dérivée du cours** quand aucune n'a été rédigée
  à la main (`lib/mind-map-auto.ts`, testé) — le chapitre au centre, une branche
  par leçon, un rameau par section `##`. Une carte mentale n'est rien d'autre
  que la structure du cours, et cette structure existait déjà. Le verrou payant
  ne bouge pas : on ne dérive que pour un élève qui y a droit.
- La page matière tient compte des deux replis (onglets Flashcards, Défis et
  Cartes ne sont plus à moitié vides).

**Le contenu** — 159 chapitres, 159 leçons, 159 quiz, **1 272 questions**,
écrits à la main et validés :

| Migration | Matières | Volume |
|---|---|---|
| 216 | EMC, Sport | 42 chap. · 336 q. |
| 217 | Musique, Arts plastiques | 42 chap. · 336 q. |
| 218 | Allemand, Grec | 30 chap. · 240 q. |
| 219 | SNT, HLP, LLCER, SI, Maths compl. | 27 chap. · 216 q. |
| 220 | Espagnol, Latin **au lycée** | 18 chap. · 144 q. |

Après exécution : **zéro couple (matière × niveau) vide** sur les 149 que
propose le catalogue. La 220 comble un trou que l'audit n'avait pas vu —
espagnol et latin s'arrêtaient en 3e alors que leurs `levels` vont jusqu'en
terminale.

Le contenu vit en JavaScript (`scripts/contenu/*.mjs`) et le SQL est **généré**
(`npm run contenu`). Le générateur refuse de produire quoi que ce soit si un
cours n'a pas de section `##` (carte mentale non dérivable), si un chapitre a
moins de 6 questions, si une question est mal formée ou si deux chapitres
portent le même titre au même niveau. La CI le fait tourner à chaque poussée.

### Trésor : 10 % → 45 %

**La caisse existe** (migration 221). Ce qui a changé :

- cliquer « Choisir cette offre » **enregistre** la demande (offre, contact
  facultatif, note) au lieu d'afficher « le paiement arrive très bientôt » et de
  jeter l'information ;
- `/admin/abonnements` liste les demandes et permet d'**accorder réellement** un
  abonnement, avec une durée bornée (0 à 36 mois), une référence de paiement et
  une trace inaltérable (`subscription_grants`) ;
- `expire_subscriptions()` fait appliquer les échéances — sans quoi « 1 mois »
  voudrait dire « à vie » ;
- `grant_subscription` est le **seul** chemin vers `profiles.subscription_tier`,
  en `SECURITY DEFINER`, réservé aux admins, infalsifiable depuis le client.

**Ce qui n'a PAS été décidé à la place de Lucas** : aucun prestataire de
paiement. Le paiement se fait hors de l'app (virement, lien externe). Le jour où
un prestataire est branché, son webhook n'aura qu'à appeler
`grant_subscription` — la moitié serveur est déjà là.

### Onboarding : 70 % → 85 %

Le tour guidé se lançait « uniquement si la colonne `tutorial_completed` dit
faux ». Colonne absente (188 en attente) → jamais faux → **le tour ne partait
jamais**. Il s'appuie désormais sur la base **quand elle répond**, et sur la
mémoire locale du navigateur sinon (`lib/tour-local.ts`, testé). La
fonctionnalité est vivante aujourd'hui, sans attendre la migration.

### Backend : 65 % → 80 %

- **Une CI** (`.github/workflows/ci.yml`) : `tsc --noEmit`, `eslint`, `vitest`,
  `next build` à chaque poussée, plus un job qui revalide tout le contenu
  scolaire et vérifie que le SQL généré est à jour. Rien n'empêchait jusqu'ici
  de déployer une branche cassée.
- **Le catalogue de santé ne commence plus à 188** : 187 et 189 y sont entrées
  (et se révèlent exécutées), ainsi que 216 → 221.
- **`_ASSOCIE/a-executer.sql` était incomplet** : 210, 211 et 214 étaient dans
  la sonde mais **absentes du fichier unique** — donc jamais collées, quelle que
  soit la discipline de Lucas. Corrigé (21 migrations, 166 Ko).

### Notifications : 25 % → 30 %

`node scripts/vapid.mjs` génère la paire de clés et imprime exactement quoi
coller, où, et comment vérifier. Le reste est une action humaine : poser quatre
variables sur Vercel, redéployer, exécuter 195 et 196.

### Marcel : 65 % → 85 % · Amis : 60 % → 75 % · Moi : 55 % → 80 %

**L'échelle de l'oral** (migration 222), les quatre barreaux de la doctrine
§4 — le différenciateur le plus fort et le moins cher du produit, et **aucune
app ne le fait**, parce que tout le monde cherche à faire NOTER l'oral par une
IA. Studuel ne note pas : il fait répéter.

1. **Tes cartes** — elles existent déjà (carnet, flashcards).
2. **Seul, à voix haute** — chrono, et rien d'autre. Aucun micro.
3. **Enregistré** — l'élève se réécoute et coche trois cases. `MediaRecorder`,
   lecture depuis une URL locale : **l'audio ne quitte jamais l'appareil**, et
   il n'existe aucun chemin, dans le code, entre ce Blob et le réseau. La base
   ne stocke qu'une durée et trois booléens.
4. **Devant quelqu'un** — un ami reçoit la demande **en tête de l'onglet Amis**
   et coche les mêmes trois critères.

Coût IA : **zéro**, aux quatre barreaux.

C'est aussi la réponse au reproche fait à Amis (« backend réel, surface
pauvre ») : jusqu'ici l'onglet ne proposait que de se **comparer** — classements,
trophées, ligue. Le barreau 4 y installe le premier usage social qui demande
quelque chose à quelqu'un, et où ce qu'on rend a de la valeur.

Deux pièges évités, tous deux du type « échec silencieux » :

- les noms d'amis passent par des RPC `SECURITY DEFINER` (`oral_friends`,
  `oral_listen_inbox`), **jamais par jointure** : `profiles` est en RLS « soi
  uniquement », une jointure aurait rendu la liste d'amis vide et chaque demande
  anonyme *sans lever la moindre erreur* ;
- l'amitié est vérifiée **en base** avant toute demande : on ne peut pas faire
  sonner un inconnu, même en appelant la RPC directement.

**« Mes habitudes »**, la moitié de l'onglet Moi, était littéralement un panneau
« Bientôt ici ». Les données existaient pourtant toutes, et la page les chargeait
déjà pour calculer la capacité : séries en cours, régularité sur 28 jours,
rythme de la semaine, part de validations automatiques. Le panneau est branché
dessus (`lib/moi/habitudes.ts`, testé), sans une requête de plus. Il ne rend
aucune note globale — un chiffre unique écraserait la seule information utile :
quelle habitude tient, et laquelle lâche.

---

## Ce qu'il reste à faire, dans cet ordre

**1. Exécuter les migrations.** C'est devenu le goulot d'étranglement de tout le
reste. Deux gestes :

- coller `_ASSOCIE/a-executer.sql` (21 migrations structurelles, dont la **198**,
  qui ferme un relais LLM ouvert — c'est une fuite, pas une fonctionnalité) ;
- puis, un par un, `supabase/216…` `217…` `218…` `219…` `220…` (le contenu, trop
  volumineux pour un seul collage), `221_abonnements_v0.sql` (la caisse) et
  `222_oral_echelle.sql` (l'échelle de l'oral).

Vérification : `npm run sonde` doit tout passer à ✓.

**2. Encaisser pour de vrai.** La caisse v0 permet à un parent de dire oui et à
Lucas d'accorder l'accès. Il manque le geste commercial : un prix affiché, un
moyen de payer, une première famille.

**3. Les clés VAPID.** Deux minutes, un levier de rétention complet.

**4. Marcel.** L'échelle de l'oral (les 4 barreaux, dont « devant un ami ») et la
typologie d'erreur restent les deux plus gros manques face à sa propre doctrine.

**5. Le ménage.** ✅ **Fait le 01/08.** Le verdict n'était pas le même pour les
trois routes, et c'est la leçon : « zéro lien entrant » ne veut pas dire
« morte ».

- `/ia` — **supprimée.** C'était une vraie promesse à l'écran (« Bientôt
  disponible », une barre de saisie désactivée) pour un tuteur IA que Marcel
  rend aujourd'hui. Une page que personne n'atteint et qui promet une fonction
  qui n'existe pas ne coûte rien à retirer.
- `/formation` et `/habitude` — **gardées.** Ce sont des `redirect()` de trois
  lignes vers `/reviser` et `/moi`. Leur absence de lien entrant est leur raison
  d'être : elles rattrapent les anciennes URL. Le commentaire en tête le dit
  désormais, pour que le prochain audit ne les recompte pas comme orphelines.
- **Carnet** — les deux entrées « Importer des questions » et « Insérer un
  fichier », grisées avec un ruban « Bientôt » dans la feuille de création, sont
  retirées. Un menu ne montre pas des portes qui ne s'ouvrent pas.
- **Non touché, et volontairement** : le badge « Bientôt » de `DefiHome`. L'audit
  du 31/07 le disait « code mort » parce que les 5 modes sont `implemented:
  true` — exact, mais le drapeau est un garde *testé* qui sert au 6ᵉ mode du
  jour où il arrivera. Rien ne s'affiche à l'élève aujourd'hui. Le supprimer
  ferait perdre une sécurité pour ne rien gagner à l'écran.

---

## Ce qui est vraiment bon, et qu'il ne faut pas casser

La discipline `lib/` : **1 923 tests** verts (contre 1 813 la veille), sur une
logique métier volontairement pure. La sonde de santé, qui a permis de faire cet
audit sur des faits — et de corriger ses propres erreurs de la veille. Et deux
gardes qui ont fait leur travail pendant cette session : le **miroir SQL ↔ app
des paliers premium**, qui a refusé la première version de la migration 221, et
le **test miroir du catalogue de santé**, qui a exigé que la sonde CLI suive.
