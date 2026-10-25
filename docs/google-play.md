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
   - Start URL : `/lancement.html`
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
| Accès à l'app | Fournir un compte de test (e-mail + mot de passe) pour l'examinateur |
| Annonces | Non, l'app ne contient pas de publicité |
| Classification du contenu | Questionnaire IARC — catégorie *Éducation* ; pas de violence, chat entre utilisateurs : **oui** (messagerie coach, pseudos visibles) |
| Public cible | **Les tranches d'âge réelles : 9-12 ans, 13-15, 16-17** (la 6e commence à 11 ans). Inclure moins de 13 ans soumet l'app au **programme Familles** : pas de SDK publicitaire (aucun), politique de confidentialité (faite), contenu adapté |
| Application d'actualités | Non |
| Suppression des données | Oui, dans l'app et par `https://studuel.app/supprimer-mon-compte` |
| Fonctions d'IA générative | Oui (Marcel, avatar dessiné) — voir le point bloquant ci-dessous |

### Sécurité des données (Data safety)

Données collectées, **toutes chiffrées en transit**, **aucune vendue**, **aucune
partagée à des fins publicitaires** ; l'utilisateur **peut demander leur suppression**.

| Type de données | Collectée | Pourquoi |
|---|---|---|
| Adresse e-mail | Oui | Gestion du compte |
| Nom (pseudo choisi) | Oui | Fonctionnalités de l'app, gestion du compte |
| Messages dans l'app (messagerie coach, questions à Marcel) | Oui | Fonctionnalités de l'app |
| Photos (jointes à Marcel ou au coach, facultatif) | Oui | Fonctionnalités de l'app |
| Activité dans l'app (pages, interactions, progression) | Oui | Fonctionnalités, statistiques |
| Plantages, diagnostics | Oui | Statistiques, correction |
| Historique d'achats (abonnement) | Oui | Fonctionnalités de l'app |
| Localisation, contacts, identifiants publicitaires | **Non** | — |

« Partagées » au sens de Google : **non** — les prestataires (Vercel, Supabase,
DeepSeek, OpenAI, Google Gemini) sont des sous-traitants, ce qui n'est pas un
partage au sens de la fiche.

### Fiche du Store

- **Nom** : Studuel — Réviser en jouant
- **Description courte** (80 car.) : `Révise de la 6e à la Terminale : quiz, fiches, duels et un coach IA.`
- **Description longue** : à écrire avec le plan de contenu (point c).
- **Visuels** : icône 512 × 512 (`public/icons/icon-512.png`), **bannière 1024 × 500**
  (à dessiner), **au moins 4 captures** de téléphone (Réviser, un quiz, l'arène, Marcel).
- **Catégorie** : Éducation · **E-mail de contact** : `contact@studuel.app`

## 6. ⚠️ Deux points bloquants avant d'envoyer en production

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
