# Studuel sur Google Play — le guide

> 25/10/2026. Studuel part sur le Play Store en **Trusted Web Activity (TWA)** :
> la même app web, ouverte en plein écran par Chrome. Rien à réécrire, et chaque
> déploiement Vercel met l'app Android à jour sans repasser par Google.
> Un nouveau paquet n'est envoyé que pour changer l'icône, le nom ou la version
> d'Android visée.

## 0. Ce qui est déjà prêt dans le code

| Pièce | Où |
|---|---|
| Manifeste PWA (nom, couleurs, portrait, `start_url`) | `app/manifest.ts` |
| Icônes « maskable » avec marge de sécurité | `public/icons/icon-maskable-*.png` |
| Preuve de propriété `/.well-known/assetlinks.json` | `app/api/assetlinks/route.ts`, `lib/twa.ts` (variables `ANDROID_PACKAGE`, `ANDROID_SHA256`) |
| CGU · confidentialité · mentions légales | `/cgu`, `/confidentialite`, `/mentions-legales` (valeurs dans `lib/legal/editeur.ts`) |
| Suppression du compte dans l'app + page publique | Mon compte, `/supprimer-mon-compte` (migration 596) |
| Service worker, hors-ligne | `public/sw.js` |

## 1. Avant de commencer (Lucas)

1. **Le domaine** `studuel.app` branché sur Vercel (voir la conversation du 25/10). Le
   paquet Android est lié au domaine : le choisir AVANT de construire le paquet.
2. **Les blancs des pages légales** : `lib/legal/editeur.ts`, toutes les valeurs qui
   commencent par « À compléter » (surlignées en jaune sur les pages).
3. **L'adresse `contact@studuel.app`** qui reçoit vraiment les e-mails.
4. **Le compte Google Play Console** (25 $, une fois) — de préférence **au nom de la
   société** (compte « organisation », numéro D-U-N-S demandé). Un compte
   **personnel** créé depuis fin 2023 doit d'abord faire un **test fermé de 14 jours
   avec au moins 12 testeurs** avant de pouvoir publier.
5. **La migration 596** exécutée en production (SQL Editor).

## 2. Le nom du paquet

Proposition : **`app.studuel`** (le domaine à l'envers). Il est définitif : une fois
envoyé sur Google Play, il ne change plus jamais.

## 3. Construire le paquet

Le plus simple : **PWABuilder** (pwabuilder.com), dans le navigateur.

1. Entrer `https://studuel.app`, puis *Package for stores* › *Android* › *Google Play*.
2. Réglages :
   - Package ID : `app.studuel`
   - App name : `Studuel` · Short name : `Studuel`
   - Start URL : `/lancement.html?canal=play` (**indispensable** : c'est ce qui cache les euros)
   - Theme color `#7a3fe0` · Background color `#25184c` · Display : standalone · Orientation : portrait
   - Signing key : *Create new* — **garder précieusement** le fichier `.keystore` et ses
     mots de passe (dans un gestionnaire de mots de passe, pas dans le dépôt)
3. Télécharger le zip : il contient le **`.aab`** (à envoyer sur Google Play), le
   `.keystore`, et un `assetlinks.json` d'exemple.

(Alternative en ligne de commande : `npx @bubblewrap/cli init --manifest https://studuel.app/manifest.webmanifest`
puis `bubblewrap build` — demande le JDK 17 et le SDK Android.)

## 4. Relier l'app au site (sinon : barre d'adresse en haut de l'app)

1. Play Console › l'app › *Test et publication* › *Intégrité de l'app* › *Signature
   d'app* : copier l'empreinte **SHA-256** du *certificat de la clé de signature
   d'application*, et celle de la *clé d'importation*.
2. Vercel › Settings › Environment Variables (Production) :
   - `ANDROID_PACKAGE` = `app.studuel`
   - `ANDROID_SHA256` = les deux empreintes, séparées par une virgule
3. Redéployer, puis vérifier : `https://studuel.app/.well-known/assetlinks.json` montre
   le paquet et les empreintes.

## 5. La fiche Play Console

### Contenu de l'app (rubrique « Règles »)

| Question | Réponse |
|---|---|
| Règles de confidentialité | `https://studuel.app/confidentialite` |
| Accès à l'app | « Tout ou partie des fonctionnalités sont soumises à des restrictions d'accès » → compte de démonstration `demo.playstore@studuel.app` (élève de 3e, prénom Léa, créé le 25/10/2026 ; mot de passe remis à Lucas hors dépôt). Instructions pour l'examinateur : « Ouvrir l'app, toucher *J'ai déjà un compte*, saisir l'e-mail et le mot de passe. » À passer en Studuel+ (`subscription_tier`) pour que l'examinateur voie Marcel en entier |
| Annonces | Non, l'app ne contient pas de publicité |
| Classification du contenu | Questionnaire IARC — catégorie *Éducation* ; pas de violence, chat entre utilisateurs : **oui** (messagerie coach, pseudos visibles) |
| Public cible | **Les tranches d'âge réelles : 9-12 ans, 13-15, 16-17** (la 6e commence à 11 ans). Inclure moins de 13 ans soumet l'app au **programme Familles** : pas de SDK publicitaire (aucun), politique de confidentialité (faite), contenu adapté |
| Application d'actualités | Non |
| Suppression des données | Oui, dans l'app et par `https://studuel.app/supprimer-mon-compte` |
| Fonctions d'IA générative | Oui (Marcel, avatar dessiné) — voir le point bloquant ci-dessous |

### Sécurité des données (Data safety)

Données collectées, **toutes chiffrées en transit**, **aucune vendue**, **aucune
partagée à des fins publicitaires** ; l'utilisateur **peut demander leur suppression**.

**Les trois questions d'ouverture du formulaire** (25/10/2026) :

| Question | Réponse |
|---|---|
| L'app collecte-t-elle ou partage-t-elle des données utilisateur ? | **Oui** |
| Toutes les données collectées sont-elles chiffrées en transit ? | **Oui** (HTTPS partout) |
| Proposez-vous un moyen de demander la suppression des données ? | **Oui** : dans l'app (Compte → Supprimer mon compte) et sur `https://studuel.app/supprimer-mon-compte` |
| Examen de sécurité indépendant (MASA) | Non |
| Engagement envers le règlement Familles | Oui (public cible dès 9-12 ans) |

**Puis, type par type** — « Partagée » est **Non** partout : les prestataires
(Vercel, Supabase, Cloudflare, DeepSeek, OpenAI, Google Gemini, Anthropic) sont des
sous-traitants qui traitent pour notre compte, ce qui n'est pas un partage au sens
de la fiche. Aucune donnée n'est vendue ni utilisée pour de la publicité.

| Catégorie Google | Type | Collectée | Obligatoire ? | Traitée de façon éphémère ? | Finalités à cocher |
|---|---|---|---|---|---|
| Informations personnelles | Adresse e-mail | Oui | Obligatoire | Non | Gestion du compte, communications du développeur |
| Informations personnelles | Nom (prénom ou pseudo choisi) | Oui | Obligatoire | Non | Fonctionnalités de l'app, gestion du compte |
| Informations personnelles | Autres infos (classe, matières suivies, objectif du jour) | Oui | Obligatoire | Non | Fonctionnalités de l'app, personnalisation |
| Messages | Autres messages dans l'app (questions à Marcel, messagerie coach ↔ élève ↔ parent) | Oui | Facultatif | Non | Fonctionnalités de l'app |
| Photos et vidéos | Photos (cahier joint à Marcel ou au coach) | Oui | Facultatif | Non | Fonctionnalités de l'app |
| Fichiers et documents | Fichiers texte joints à Marcel | Oui | Facultatif | Non | Fonctionnalités de l'app |
| Activité dans l'app | Interactions dans l'app (pages vues, parties jouées, progression, séries) | Oui | Obligatoire | Non | Fonctionnalités de l'app, statistiques, personnalisation |
| Activité dans l'app | Autres contenus générés par l'utilisateur (dossiers de cours écrits dans Ma bibliothèque, notes confiées à Marcel) | Oui | Facultatif | Non | Fonctionnalités de l'app |
| Informations sur l'app et performances | Journaux de plantage, diagnostics (`erreur_signaler`) | Oui | Obligatoire | Non | Statistiques, fonctionnalités de l'app |
| Informations financières | Historique des achats (statut Studuel+, achats en gemmes) | Oui | Obligatoire | Non | Fonctionnalités de l'app |
| Appareil ou autres identifiants | Adresse technique de notification (si l'élève active les rappels) | Oui | Facultatif | Non | Fonctionnalités de l'app |
| Position, contacts, calendrier, santé, audio, historique web, SMS | — | **Non** | — | — | — |

Détails qui comptent : le **micro** passe par la dictée du navigateur (l'app ne
reçoit que du texte, jamais d'enregistrement) ; aucun **identifiant publicitaire** ;
aucun SDK tiers de mesure. La version Play ne vend rien en euros (`estAppPlay()`),
l'historique d'achats ne décrit donc que le statut d'abonnement et les gemmes.

### Fiche du Store

Le kit est prêt depuis le 25/10/2026 : les textes ci-dessous, les visuels dans
`assets-sources/play-store/` (captures 1080 × 1920 habillées, bannière 1024 × 500,
icône 512), produits par le script du scratchpad `play-kit/rendre.mjs` à partir
des pages `/dev/*` et d'un compte de démo.

- **Nom** (30 car. max) : `Studuel : réviser en jouant` (27)
- **Description courte** (80 car. max) : `Révise de la 6e à la Terminale : quiz, fiches, duels et un coach IA.` (68)
- **Catégorie** : Éducation · **Tags** : Éducation, Révisions, Quiz · **E-mail de contact** : `contact@studuel.app`
- **Visuels** : icône 512 × 512 (`public/icons/icon-512.png`), bannière 1024 × 500
  (`assets-sources/play-store/banniere-1024x500.png`), **huit captures** de téléphone
  maximum parmi les neuf de `assets-sources/play-store/v2/` (version validée par Lucas
  le 25/10/2026 : fonds à rayons, téléphone incliné, Marcel redessiné d'après sa
  référence, poses dans `assets-sources/play-store/marcel/` ; la version sobre reste
  à la racine). On garde les huit premières ; « 09-parents » en réserve ou à la place
  de « 08-carnet ».
- **Textes des captures** (validés le 25/10/2026). L'ordre suit la lecture de la
  fiche : l'image 1 est vue par tout le monde, la 3 par une minorité. La 1 dit ce
  qu'est l'app et pour qui, la 2 rassure sur le sérieux (parent), la 3 montre le jeu.
  Une idée par image, un seul mot fort en couleur, jamais de vocabulaire de loterie
  (« gagne gros ») pour un public mineur.

  | # | Titre (mot fort en gras) | Sous-titre |
  |---|---|---|
  | 01 | Révise en **jouant**, de la 6e à la Tle | Cours, quiz au chrono, duels entre amis et Marcel, ton coach. |
  | 02 | Ton **programme**, du début à la fin | Cours, fiche, quiz et exercices pour chaque chapitre du programme officiel. |
  | 03 | Réponds vite, **gagne de l'XP** | Des quiz au chrono. Tes erreurs reviennent jusqu'à ce que ça rentre. |
  | 04 | **Marcel**, ton coach perso | Il sait où tu en es, prépare ta séance et répond à tes questions. |
  | 05 | Entre dans l'**arène** ! | Défie tes amis en duel, débusque les gardiens, gagne des trophées. |
  | 06 | Monte en **ligue** ! | 30 joueurs, une semaine : qui révise le plus monte de division. |
  | 07 | Le brevet et le bac, **sans stress** | Les vrais sujets, corrigés par Studuel, et ce qui tombe chaque année. |
  | 08 | Collectionne tes **victoires** | Série, trophées, badges, cadres : tout est dans ton carnet. |
  | 09 | Pour les **parents** | La semaine racontée : ce qu'il a révisé, son point fort, le prochain contrôle. |
- **Description longue** (4 000 car. max) :

```
Studuel, c'est la révision qui se joue comme un jeu, de la 6e à la Terminale.

TOUT TON PROGRAMME, CHAPITRE PAR CHAPITRE
Maths, français, histoire-géo, anglais, espagnol, allemand, physique-chimie, SVT, SES, philosophie, HGGSP, enseignement scientifique, NSI, les spécialités des voies générale et technologique… Chaque matière a son dossier : le cours, la fiche de révision, le quiz, le cahier d'exercices et les annales. Tu sais toujours où tu en es et ce qu'il te reste à voir.

DES QUIZ QUI T'APPRENNENT VRAIMENT
Les quiz se jouent au chrono. Tu te trompes ? Studuel t'explique la bonne réponse et garde tes erreurs dans « Mes erreurs » pour que tu puisses y revenir. Chaque bonne réponse rapporte de l'XP.

MARCEL, TON COACH
Marcel connaît ta classe, tes matières et ton prochain contrôle. Il te prépare une séance du jour, répond à tes questions, corrige tes exercices et réexplique un cours autrement. En 3e, 1re et Terminale, son mode Examen te mène jusqu'au brevet et au bac : où tu en es, les gestes de la semaine, les épreuves, le jour J.

2 900 FICHES DE RÉVISION ET LES ANNALES CORRIGÉES
Une fiche par chapitre, claire et illustrée. Les vrais sujets du brevet et du bac, avec un corrigé rédigé par Studuel et le récap de ce qui est tombé chaque année, pour réviser ce qui compte.

L'ARÈNE : DÉFIE TES AMIS
Des duels en course à 1 000 points contre un ami ou un rival, des jeux par matière (Calcul mental, Capitales du monde, Anatomie express, Le Musée…) et des gardiens à débusquer. Tu gagnes de l'XP à chaque partie.

LA LIGUE DE LA SEMAINE
Chaque semaine, tu joues dans un groupe de 30 à l'XP. Les meilleurs montent de division. Ta série de jours, tes trophées, tes badges et ta collection vivent dans ton carnet.

POUR LES PARENTS
Un espace parents qui raconte la semaine de votre enfant en quelques phrases : ce qui a été révisé, le point fort, ce qu'il faut surveiller, le prochain contrôle. Un parent peut suivre plusieurs enfants.

Studuel est fait en France, en français, sans publicité.

Classes : 6e, 5e, 4e, 3e, 2de, 1re, Terminale (voies générale et technologique).
```

## 6. Les deux points bloquants — LEVÉS le 25/10/2026

- **Euros (voie A, choix de Lucas)** : l'app Android démarre sur `/lancement.html?canal=play`
  (à régler comme *Start URL* dans PWABuilder), qui pose le cookie `studuel_canal=play`
  (`lib/canal.ts`) ; la Boutique, `/plus` et l'espace parents ne montrent alors aucune
  offre en euros. Les capsules restent achetables en gemmes.
- **Signaler une réponse de l'IA** : « Signaler » sous chaque réponse de Marcel
  (migration 597), relu sur /admin/signalements-ia.

Historique de ce qui bloquait :

1. **Les paiements en euros.** Dans une app du Play Store, un contenu numérique
   (Studuel+, gemmes, capsules, recharges de Marcel) se vend par **Google Play
   Billing**, ou ne se vend pas dans l'app. Aujourd'hui l'app propose des demandes
   d'achat payées hors de l'app : refus assuré. Deux voies :
   - **A (recommandée pour démarrer)** : la version Play n'affiche aucune offre en
     euros (l'app sait qu'elle est lancée depuis le Play Store) ; l'abonnement
     s'achète sur le web, sans que l'app le dise.
   - **B** : brancher Google Play Billing (Digital Goods API) — plusieurs semaines,
     commission de 15 %.
2. **Signaler une réponse de l'IA.** Les règles de Google sur l'IA générative
   exigent un bouton pour signaler une réponse choquante **sans quitter l'app**.
   Marcel n'en a pas encore.

## 7. Envoyer

1. *Test interne* d'abord (jusqu'à 100 testeurs, sans examen) : vérifier sur un vrai
   téléphone que l'app s'ouvre **sans barre d'adresse** (sinon : point 4).
2. *Test fermé* (obligatoire 14 jours / 12 testeurs pour un compte personnel).
3. *Production*. Premier examen de Google : quelques jours, parfois plus pour une
   app destinée aux moins de 13 ans.
