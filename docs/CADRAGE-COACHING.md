# Cadrage — la couche « coaching » (centre de formation, 100+ élèves)

13/10/2026. Brief de Lucas : des élèves rattachés à un coach (cas réel : un
centre de formation basket, 100+ joueurs, de nouveaux arrivants chaque mois)
utilisent le MÊME Studuel que le grand public ; le coach suit leur travail
scolaire depuis un tableau de bord web. Ce document relit le brief à la
lumière du code existant, propose le modèle, les effets dans l'app, le
tableau de bord, et découpe en étapes livrables.

> **Le 13/10/2026, Lucas a simplifié** : « le bouton "j'ai un code" dans
> l'onboarding… il sera automatiquement ajouté à mon interface coach… le
> joueur aura la même interface que n'importe qui… mon interface doit être
> d'excellente qualité pour un suivi global ». **La v1 est livrée sur cette
> base** (migration 560, `lib/coach/`, `app/coach/`, `components/coach/`,
> « J'ai un code » dans `/bienvenue`, « Mon coach » dans Mon compte — voir le
> paragraphe de `CLAUDE.md`). Ce qui suit reste le cadrage des paliers
> suivants : consentement parental, Studuel+ inclus, Boutique conditionnée,
> rappels push, objectifs, notes, temps par matière.

## 1. Ce que le brief suppose et qui n'est pas (ou plus) vrai

| Le brief dit | Le code dit |
|---|---|
| « Écus gagnés en jouant, Cristaux achetables » | Plus d'écus depuis le 16/09/2026. La boucle est **XP → niveaux → gemmes (rares)**, Studuel+ en euros (`profiles.subscription_tier` ∈ tier1..3), packs de gemmes en euros demandés par un parent et crédités par l'admin (`accorder_pack_gemmes`). « Cosmétiques en Écus » → en **gemmes**, inchangé. « Aucun achat de Cristaux » → **aucun pack de gemmes ni Studuel+ en euros**. |
| onglet « Duel (PvP en ligne) » | l'onglet s'appelle **Défi** (l'arène) ; le duel classé en est le cœur. |
| « coaching » comme une couche nouvelle | **le parent existe déjà** : `parent_children` (044), `link_child_by_code` (le `friend_code` de l'élève), `child_dashboard` (319 : temps de la semaine, jours actifs, 4 semaines, score moyen et par matière du plus faible au plus fort, contrôles à venir, dernière activité), `parent_prefs` (objectif hebdo, alerte après N jours), l'espace `/parents` avec bilan en phrases. **Un coach est, techniquement, un parent de cent enfants** : on réutilise le modèle (vérification du lien dans une RPC SECURITY DEFINER, jamais de lecture directe inter-comptes). |
| « rôle coach distinct » | `profiles.profile_type` n'accepte que `'eleve'`, `'parent'` ou NULL (CHECK 048:33) ; `link_child_by_code` refuse seulement `'eleve'`. Le rôle `'coach'` = une migration du CHECK + les gardes. |
| « ajout automatique en amis de tout le groupe » | 30 amis d'office = **×2,0 d'XP dès le premier jour** pour tout le groupe (`xp_amis_comptes` = LEAST(10, amis), `xp_avec_bonus`, 380), gonfle le bonus de ligue (376), le coffre d'équipe (379 : l'XP des 10 amis les plus actifs). Pas de limite au nombre d'amis. |
| « notification push à l'élève » | les push partent du **cron** (`rappels.yml` → `/api/push/send?type=` avec la clé service, `push_*_targets`) ; une exception existe (le défi d'un ami envoie depuis une Server Action avec la clé service). **Pas de file de notifications.** |
| « interface web séparée » | `/parents` et `/admin` vivent dans la même app Next, gardées par le profil ; un second déploiement coûterait l'auth, la RLS et le design deux fois. → **`/coach` dans la même app**, mise en page bureau. |
| « temps de révision par session, matières et chapitres travaillés » | `work_daily` = secondes **par jour, sans matière** ; `test_sessions` = score/total **sans durée, sans matière directe** (via `quiz_id → quizzes → lessons → chapters`), et les séances « À revoir » écrivent `quiz_id NULL` (la matière est perdue). La seule table avec une durée est `carnet_review_sessions`. Les jours actifs, le temps par jour et par semaine, les scores par matière existent. |

## 2. Modèle de données (migration 560, idempotente, RLS + REVOKE complets)

```
profiles.profile_type           CHECK étendu à 'coach'   (un coach n'est ni élève ni parent)

coach_groupes
  id uuid pk · coach_id → auth.users · nom · categorie (U13, U15, U17, U18, libre)
  code text unique (8 caractères, alphabet sans 0/O/1/I/L — le générateur de friend_code, allongé)
  cree_le · archive_le (null = actif)

coach_membres                   (le « rattachement »)
  groupe_id → coach_groupes · eleve_id → auth.users          pk (groupe_id, eleve_id)
  statut : 'attente_parent' | 'actif' | 'revoque'
  demande_le · rattache_le (date d'ACTIVATION = l'arrivée, pour « les nouveaux du mois »)
  parent_email (chiffré au repos ? voir § 6) · jeton_consentement uuid · jeton_expire_le
  consenti_le · consenti_par ('parent_lien' | 'parent_app' | 'coach_papier' | 'majeur')
  revoque_le · revoque_par ('parent' | 'eleve' | 'coach')
  index unique partiel : un seul rattachement 'actif' par élève

coach_prefs                     (seuils du coach, défauts raisonnables)
  coach_id pk · inactif_apres_jours (7) · baisse_pct (50) · chute_score_pts (15)
  objectif_hebdo_minutes (90) · objectif_hebdo_sessions (3)

coach_notes          (étape 2)  id · coach_id · eleve_id · texte · cree_le
coach_objectifs      (étape 3)  eleve_id · coach_id · semaine (lundi) · minutes · sessions · fixe_le
coach_rappels        (étape 3)  id · coach_id · eleve_id · message · cree_le · envoye_le   ← la FILE des push
```

**RPC (SECURITY DEFINER, `auth.uid()` vérifié dedans, déclarées dans
`lib/sante.ts` + `sonde-base.mjs`, conformes à `rls-guard`)** :

- côté coach : `coach_creer_groupe(nom, categorie)`, `coach_renommer_groupe`,
  `coach_regenerer_code`, `coach_archiver_groupe`, `coach_retirer_eleve`,
  `coach_tableau(p_groupe uuid|null)` (**une seule lecture pour 100+ élèves**,
  cf. § 5), `coach_fiche_eleve(p_eleve)` (étape 2 : `child_dashboard` ouvert
  au coach lié), `coach_activite_eleve(p_eleve, p_depuis)` (étape 2 :
  l'historique des sessions, union des tables d'activité), `coach_set_prefs`.
- côté élève : `rattachement_demander(p_code, p_parent_email)`,
  `mon_rattachement()` (groupe, coach, statut — ce que l'élève voit),
  `rattachement_revoquer()`.
- côté parent : `rattachement_consentir(p_jeton)`, `rattachement_refuser(p_jeton)`,
  `rattachement_revoquer_par_jeton(p_jeton)` — **sans compte**, par le lien
  reçu ; et, pour un parent déjà lié dans l'app (`parent_children`),
  `rattachement_consentir_app(p_child)` depuis `/parents`.
- premium : l'activation appelle `grant_subscription(eleve, 'tier1', 12,
  'coach_groupe', groupe_id)` **dans la même transaction** (la RPC est
  réservée à l'admin : on l'appelle depuis la RPC d'activation, qui est
  SECURITY DEFINER) ; la révocation repasse en `free` si la source du dernier
  octroi est `coach_groupe` (table `subscription_grants`).

## 3. Rattachement côté élève

- **Où** : (a) à l'inscription, un champ facultatif « Tu as un code de
  groupe ? » sur l'écran du compte de `/bienvenue` (le brouillon
  `STORAGE_STEP_KEY` le garde) ; (b) plus tard, **Moi → Mon compte →
  carte « Mon coach »** : saisie du code (le champ de `LinkChildForm`),
  puis l'email d'un parent.
- **Consentement** : mineur → email au parent avec un lien
  `/rattachement/<jeton>` (valable 14 jours) : « Le coach X du groupe U15
  demande à suivre le travail scolaire de Léa sur Studuel. Il verra : ses
  jours d'activité, son temps de révision, ses scores par matière. Il ne verra
  pas : ses messages, ses achats, ses amis. » **Accepter / Refuser** ; la
  même page, plus tard, **Révoquer**. Majeur (date de naissance ? on ne l'a
  pas : `grade_level` Tle + case « j'ai 18 ans ») → `consenti_par='majeur'`.
- **Tant que le parent n'a pas répondu** : statut « En attente de ton
  parent », l'élève peut renvoyer l'email (une fois par jour), changer
  l'adresse, annuler.
- **Ce que l'élève voit** : la carte « Mon coach » — nom du coach, nom et
  catégorie du groupe, depuis quand, ce que le coach voit (la même liste que
  le parent), **Quitter le groupe**. C'est aussi l'occasion de montrer enfin
  les parents liés (`parent_children`) qui n'ont aucune UI côté élève
  aujourd'hui (172:24 le reconnaît).

**L'email** : l'app n'envoie aucun email transactionnel (seul Supabase Auth
en envoie). Trois voies, à choisir au § 8 : un fournisseur (Resend, ~0 € à ce
volume, une clé d'env, une route serveur) ; l'envoi par Supabase Auth
(« invitation » détournée — fragile) ; ou le parent déjà lié dans l'app qui
consent depuis `/parents` (ne couvre pas les parents hors app).

## 4. Effets du rattachement dans l'app

- **Amis — ne pas insérer 30 lignes dans `friendships`.** Le groupe devient
  sa propre surface sociale : dans l'onglet Amis, un bloc **« Mon groupe »**
  (nom, catégorie, le classement du groupe à l'XP de la semaine et aux
  trophées — RPC `classement_groupe()`, calquée sur `classement_amis()`),
  avec « Ajouter en ami » sur chaque ligne (une amitié ordinaire, `pending`
  → `accepted`, qui compte dans le ×XP comme pour tout le monde). Si Lucas
  tient à l'ajout automatique : une colonne `origine='groupe'` sur
  `friendships`, **exclue** de `xp_amis_comptes`, du bonus de ligue et du
  coffre d'équipe — sinon le centre entier est à ×2,0 et la ligue est faussée.
- **Classement de groupe** : le bloc ci-dessus, en plus de la ligue (qui reste
  le classement « général » de la semaine) ; pas de troisième classement.
- **Boutique et incitations** : un seul booléen côté serveur, `rattache`
  (lu avec le profil, dans la même vague — `mon_rattachement()`), qui
  **conditionne l'affichage** : `CarteStudueLPlus`, `RayonGemmes`, le bouton
  « Payer par carte » des capsules, `PremiumPill` de l'arène, les
  « Découvrir Studuel+ » (Marcel, atelier d'avatar), la couronne de la porte
  Exercices, les billets verrouillés (ils sont ouverts puisque Studuel+ est
  inclus), `OffrirStuduelPlus` côté parent. Le Marché en gemmes, les capsules
  en gemmes, les fiches en gemmes restent. **Studuel+ inclus** = `tier1`
  accordé à l'activation (12 mois, renouvelé par le coach d'un clic sur le
  groupe, ou automatiquement tant que le rattachement est actif), retiré à la
  révocation.
- **Aucun impact grand public** : tout est derrière `rattache = true` ; le
  seul ajout visible de tous est le champ facultatif du code (inscription et
  Mon compte).

## 5. Ce qui est collecté, ce qu'on ajoute

**Existe déjà, par élève** : horodatage de chaque session (quiz, leçon,
révision, duel, exercice, jeu, `xp_events`), jours actifs (`active_days` de
`child_dashboard`, `jours_actifs()`), temps par jour (`work_daily`) donc par
semaine, score moyen et par matière (`per_subject`), 4 semaines, contrôles à
venir, victoires contre les boss (`boss_gauges.victories`), duels
(`duel_replays` : matière, score, gagné).

**On ajoute, petit et utile tout de suite** (migration 560, même lot) :
`test_sessions.duree_s`, `test_sessions.subject_slug`,
`test_sessions.chapter_id` écrits par `recordTestSession` et par les deux
insertions de `app/reviser/actions.ts` qui mettent `quiz_id NULL` (la matière
cesse d'être perdue). **On n'ajoute pas** le temps par matière (il faudrait
ventiler `work_daily`, chaque écran qui compte le temps devrait dire sa
matière) : la v1 montre le temps total sur 7 jours et la matière la plus
faible par les scores — c'est ce que le brief demande en colonnes.

**Le statut couleur** est une logique PURE (`lib/coach/statut.ts`, testée),
calculée sur les agrégats de `coach_tableau`, avec les seuils de
`coach_prefs` :

| Statut | Règle (défauts) |
|---|---|
| **rouge · décroché** | aucune activité depuis ≥ `inactif_apres_jours` (7), ou 0 jour actif sur 7 |
| **orange · en baisse** | temps des 7 derniers jours < `baisse_pct` (50 %) de la moyenne des 4 semaines précédentes, ou 1-2 jours actifs sur 7, ou une matière dont le score a chuté de ≥ `chute_score_pts` (15 pts) vs les 4 semaines, ou objectif hebdo non atteint (étape 3) |
| **vert · régulier** | le reste |
| **gris · nouveau** | rattaché depuis < 7 jours (on ne juge pas une semaine incomplète) |

`coach_tableau(p_groupe)` renvoie, pour chaque élève actif du coach (ou du
groupe) : id, prénom, classe, groupe, rattaché_le, derniere_activite,
secondes_7j, secondes_4s (moyenne hebdo), jours_actifs_7, matiere_faible
(slug + ratio + ratio 4 semaines), objectif (étape 3). **Une seule RPC, une
seule lecture** pour 100+ lignes (pas 100 appels à `child_dashboard`).

## 6. RGPD — élèves mineurs

- **Consentement tracé** : qui (`consenti_par`), quand, par quel jeton, l'email
  du parent ; conservé après révocation (preuve), purgé 3 ans après.
- **Données minimales côté coach** : prénom, classe, groupe, activité, temps,
  scores, contrôles à venir — **jamais** les messages (il n'y en a pas), les
  achats, les amis, l'avatar dessiné, les notes de Marcel. La RPC le garantit :
  elle ne lit que ces tables-là.
- **Révocation** : par le parent (le lien, à tout moment), par l'élève
  (« Quitter le groupe »), par le coach (« Retirer ») — les trois mettent
  `statut='revoque'`, retirent Studuel+ (si source `coach_groupe`), et les
  notes du coach sur cet élève sont supprimées à 30 jours.
- **`parent_email`** : stocké en clair (il faut pouvoir renvoyer le lien) mais
  lisible par personne via l'app (aucune policy SELECT, la RPC d'envoi seule
  le lit) ; supprimé à la révocation.
- **Pas de nouvelle collecte** : le coach lit ce que l'app enregistre déjà
  pour l'élève lui-même et pour son parent.

## 7. Le tableau de bord `/coach` (même app, mise en page bureau)

- **Garde** : `app/coach/layout.tsx` lit `profile_type='coach'`, sinon
  `notFound()` (comme `/admin`) ; les RPC vérifient le lien de toute façon.
- **Écran principal** : trois compteurs (actifs cette semaine · en baisse ·
  décrochés), le bloc **« À surveiller »** (les rouges et oranges, triés par
  gravité, avec la raison en un mot : « 9 jours sans activité », « −62 % de
  temps », « Maths −18 pts », « objectif 2/3 »), seuils dans un tiroir
  Réglages.
- **Liste** : tableau de 4 colonnes (dernière activité · temps 7 j ·
  régularité `3/7` · matière la plus faible), statut en pastille de couleur en
  tête de ligne (les ÉTATS success / warning / destructive — l'écran est un
  BILAN, le feu tricolore y est autorisé), tri par statut par défaut,
  triable, filtres groupe/catégorie · classe · « arrivés ce mois », recherche
  par prénom ; **pagination par 50** (100-300 lignes : une pagination simple
  suffit, pas de virtualisation ni de `content-visibility`).
- **Fiche élève** (étape 2) : courbe 4 semaines (les `weeks` de
  `child_dashboard`, réutilisés), scores par matière, historique des sessions
  (`coach_activite_eleve`), notes privées datées.
- **Actions groupées** (étape 3) : cases à cocher → « Envoyer un rappel »
  (écrit dans `coach_rappels`, le cron `type=coach` l'envoie dans l'heure,
  texte court, sans nom du coach dans la notification), « Fixer un objectif
  hebdo » (`coach_objectifs`, affiché à l'élève dans sa carte « Mon coach »
  et compté dans son statut).
- **Groupes** : créer, renommer, archiver, code affiché en grand avec
  « Copier » et « Régénérer », retirer un élève, voir les « en attente du
  parent » avec « Renvoyer l'email ».
- **Design** : la grammaire de Réviser (mur crème, `.carte`, `.titre-section`,
  Baloo 2), encre marine, **l'or réservé au seul CTA principal** de l'écran ;
  pas de dessin, pas de jeu : c'est un outil.
- **Comment naît un coach** : l'admin le nomme (`/admin/coachs` : chercher un
  compte par email, « Nommer coach ») — un compte créé par le chemin parent
  de `/bienvenue` convient (il est vouvoyé et n'a pas de classe).

## 8. Les décisions à prendre avant d'écrire une ligne

1. **Amis automatiques** : (a) non — le bloc « Mon groupe » + « Ajouter en
   ami » ; (b) oui, mais exclus du ×XP, de la ligue et du coffre ; (c) oui
   tel quel (tout le centre à ×2,0). Je recommande **(a)**.
2. **Le consentement** : (a) email par Resend (nouveau fournisseur, une clé,
   ~0 €) + lien sans compte ; (b) uniquement le parent déjà lié dans l'app ;
   (c) papier recueilli par le centre, tracé par le coach. Je recommande
   **(a)** avec (b) en raccourci quand le parent est déjà là, et (c) comme
   repli assumé pour les familles hors app — tracé `coach_papier`.
3. **Majeurs** : case « j'ai 18 ans ou plus » (pas de date de naissance en
   base) → pas de consentement parental. OK ?
4. **Studuel+ inclus** : `tier1` 12 mois accordé à l'activation, retiré à la
   révocation ; **qui paie le centre** n'est pas dans l'app (facture hors
   ligne) — OK ? Et les packs de gemmes disparaissent, les gemmes restent à
   gagner.
5. **Les seuils par défaut** du § 5 (7 jours, 50 %, 15 pts, 90 min / 3
   sessions) — à ajuster ?
6. **Le temps par matière** : pas en v1 (trop invasif) ; durée + matière des
   quiz, oui dès la 560. OK ?
7. **La naissance d'un coach** : nommé par l'admin. Combien de coachs, un seul
   centre pour commencer ?
8. **La catégorie** d'un groupe : libre (texte) ou liste (U13 · U15 · U17 ·
   U18 · Autre) ?

## 9. Les étapes livrables, dans l'ordre du brief

| Étape | Contenu | Livrable testable | Durée |
|---|---|---|---|
| **1 · Rattachement + liste** | migration 560 (rôle, groupes, membres, consentement, prefs, colonnes des quiz, RPC `coach_*`, `rattachement_*`, `classement_groupe`, grant premium), email de consentement, champ « code » (inscription + Mon compte), carte « Mon coach » (statut, quitter), `/coach` : groupes (créer, code, régénérer, retirer) + liste avec statuts/colonnes/tri/filtres/recherche/pagination, `lib/coach/statut.ts` pur et testé, boutique et incitations conditionnées, `/admin/coachs` | un coach crée U15, un élève saisit le code, le parent valide par email, l'élève apparaît en liste avec son statut, Studuel+ actif, Boutique sans euros | 5-6 j |
| **2 · Fiche élève** | `coach_fiche_eleve`, `coach_activite_eleve`, notes privées, courbe 4 semaines, scores, historique | clic sur une ligne → la fiche complète, une note datée | 2-3 j |
| **3 · Actions groupées** | sélection multiple, rappel push (file + cron `type=coach`), objectif hebdo (table, carte élève, règle de statut), seuils configurables | 20 élèves cochés → 20 push dans l'heure ; objectif visible chez l'élève | 3 j |
| **4 · Social et RGPD** | bloc « Mon groupe » dans Amis (classement de groupe), révocation par le parent via le lien, purge des notes, journal des consentements consultable par l'admin | — | 2-3 j |

Chaque étape : migration déclarée (`lib/sante.ts`, `sonde-base.mjs`),
exécutée par Lucas à la main ; logique pure dans `lib/coach/` avec ses tests ;
aperçus sans compte `/dev/coach`, `/dev/coach/fiche` (développement
seulement) ; typecheck, lint, Vitest, et le smoke E2E étendu au chemin
« code → consentement → liste ».
