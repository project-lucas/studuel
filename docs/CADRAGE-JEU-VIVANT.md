# Cadrage — « Le jeu vivant » (25/10/2026)

> Lucas a envoyé seize maquettes d'un jeu mobile qui marche (un tycoon de commissariat : avatars, rubans de récompenses, boss à durée limitée, page du personnage, tuto progressif, cinématiques, courrier) et a demandé d'**analyser et de lancer plusieurs chantiers en même temps**, en prenant les décisions à sa place (« je ne serai pas là pour répondre… à toi de jouer »). Ce document est l'analyse, les décisions et le découpage en chantiers parallèles. Chaque chantier livré ajoute UNE ligne à `CLAUDE.md` et son paragraphe au journal du domaine.

## 1. Ce que fait ce jeu, et pourquoi ça marche

| Mécanique vue | Ce qu'elle fait au joueur | Ce que Studuel a déjà | Ce qui manque |
|---|---|---|---|
| Choix d'avatar : grand aperçu, onglets ♂ / ♀, grille, « Confirmer » | Le joueur se projette AVANT de jouer ; un choix net, sans texte | 13 portraits v2 (bustes) en grille, aperçu moyen | Le grand aperçu en pied, la séparation garçons / filles, un seul geste de confirmation |
| Ruban « Récompenses » animé en continu, tap n'importe où pour fermer | Chaque gain est une fête courte et sans friction | `PanneauRecompenses` + vol des jetons (Clash Royale) | Le RUBAN plein écran (titre qui ondule, carte de gain, lumière), fermeture d'un tap |
| Bannière de niveau propre et animée ; gain de gemmes animé | Le niveau est un ÉVÉNEMENT | `FeteNiveau` (éclair, chiffre qui tombe, coffre de palier) | Le ruban, le « avant → après », la liste « Débloqué », les gemmes qui tombent en pluie |
| Boss à durée limitée : affiche, 3 sous-objectifs « Aller », compte à rebours, récompenses | Une URGENCE lisible, un chemin tracé vers la récompense | La Traque (jauge remplie par le travail, 1 h pour l'abattre, un jour par gardien) | L'AFFICHE : « il part dans 6 h 12 », « 3 gestes à faire » avec un bouton chacun, le gain en grand |
| Page du personnage plein écran (avatar en détail, nom, niveau, stats, Paramètres) | Le joueur se voit, c'est SA fiche | Le carnet de Moi, le vestiaire `/moi/avatar` | Une VRAIE page du joueur en touchant l'avatar du bandeau : le héros en pied, le rang, ses chiffres, Paramètres |
| Icônes de navigation qui se déverrouillent, tout expliqué pas à pas | Pas de mur de fonctionnalités le premier jour | Le tour guidé de 7 bulles (`TourGuide`), le tuto de 3 diapos de l'onboarding | La DÉCOUVERTE PROGRESSIVE : des onglets qui s'ouvrent au niveau, « Nouveau ! » à chaque niveau, un mini-tour par fonctionnalité |
| Cinématique au déblocage | L'univers a une HISTOIRE | Rien | La première cinématique de Studuel, avec Marcel, à l'ouverture de l'onboarding |
| Courrier riche, avec badge, qui invite à revenir | Un rendez-vous quotidien, des cadeaux à ramasser | Annonces (588), messagerie coach, défis reçus | Un COURRIER unique : lettres de Marcel, cadeaux à encaisser, défis, annonces — avec un badge |
| Déblocage d'une fiche : un moment de jeu | Dépenser = se faire plaisir | `UnlockChapterCard` : cadenas, texte gris, bouton violet, feuille de confirmation blanche | Un ÉCRIN : la fiche roulée au sceau, le bouton d'or « 30 gemmes », l'ouverture animée |
| Marcel et le café | L'IA se paie avec un objet DRÔLE, pas un crédit | Crédits du mois, recharges en euros, Marcel dort (pose) | Les CAFÉS : dosette · tasse · grande tasse · thermos ; Marcel endormi qui respire, une tasse qui le réveille, le compteur vivant |

**Le fil conducteur** : chaque écran de ce jeu donne un OBJET à regarder et UN geste à faire. Studuel a déjà les mécaniques (XP, gemmes, ligue, traque, Marcel) ; ce qui manque, c'est la mise en scène des moments — gagner, monter, débloquer, découvrir.

## 2. Les décisions prises (à la place de Lucas)

1. **Rien de rétroactif ni de punitif.** La découverte progressive ne verrouille des onglets QUE pour les comptes créés après la migration 601 ; un compte existant voit tout. Réviser et Moi ne se verrouillent jamais.
2. **Les gains restent décidés par le serveur.** Le ruban de récompenses, la pluie de gemmes et le courrier n'affichent que ce que la base a versé ; un cadeau du courrier s'encaisse par RPC et passe par les mêmes barèmes (`lib/economie.ts`, `xp_activite`).
3. **Le café remplace le mot « crédit » partout à l'écran** (colonnes SQL inchangées : `coach_credits_*`, `coach_tokens`). 1 demande = 1 café ; les outils qui sont des PAGES sont offerts ; un avatar dessiné = 25 cafés. Pas de migration pour cela.
4. **Le courrier est une table** (602), pas une vue sur les tables existantes : une lettre est un objet qu'on ouvre, qu'on lit, dont on ramasse le cadeau. Les producteurs v1 : la lettre de bienvenue de Marcel (XP), la lettre de palier de niveau (déjà le coffre : la lettre pointe vers lui), les diffusions du coach / de l'admin (588 → une lettre par diffusion), un défi reçu d'un ami (558).
5. **La page du joueur remplace `/moi/avatar` comme cible de l'avatar du bandeau** ; le vestiaire reste à un tap depuis elle. Les Paramètres (`/compte`) y ont leur bouton, comme dans le jeu.
6. **La cinématique est une suite de tableaux peints** (WebP + mouvement CSS transform/opacity, texte qui s'écrit), passable d'un tap, ≤ 400 Ko au total ; pas de vidéo lourde au premier écran de l'app.
7. **Une seule esthétique** : tokens de `globals.css`, Baloo 2 pour les titres, or = gain, violet = action, animations en transform/opacity avec valeurs littérales. Pas d'hex en dur hors flamme.
8. **Les bulles au milieu de la fontaine de l'arène sont retirées** (les gouttes et la brume restent).

## 3. Les chantiers, leurs périmètres (DISJOINTS) et leurs migrations

| # | Chantier | Fichiers possédés | Migration |
|---|---|---|---|
| B+H | Fêtes : ruban de récompenses, fête de niveau refaite, gemmes animées, écrin de déblocage de fiche | `components/recompenses/*`, `components/niveau/*`, `components/UnlockChapterCard.tsx` (+ nouveaux `components/fiche/*`), `app/reviser/[subject]/[chapter]/carte/page.tsx`, `app/dev/niveau/*`, `app/dev/recompenses/*`, `app/dev/fiche-debloquer/*`, `lib/gains.ts` (ajouts seulement) | — |
| C | L'affiche du gardien (avis de recherche, 3 gestes « Aller », compte à rebours, gains) | `components/defi/BossSheet*`, `lib/traque*.ts`, `components/dev/ApercuTraque.tsx`, `app/dev/traque/*`, `app/dev/boss/*` | — |
| E | Découverte progressive + tuto | `components/TourGuide.tsx`, `lib/tour*.ts`, `lib/decouverte/*` (sauf `catalogue.ts`, livré), `components/decouverte/*`, `components/Navigation.tsx`, `app/reviser/onglet.tsx` (montage), `app/decouverte-actions.ts`, `supabase/schema/601_decouvertes.sql`, `lib/sante.ts`, `_ASSOCIE/sonde-base.mjs`, `supabase/README.md` | **601** |
| G | Le courrier | `supabase/schema/602_courrier.sql`, `lib/courrier*.ts`, `components/courrier/*`, `app/courrier/*`, `app/api/courrier/*`, `app/layout.tsx` (UNE ligne : le bouton flottant), `lib/sante.ts`, `_ASSOCIE/sonde-base.mjs`, `supabase/README.md` | **602** |
| A+D | Choix de l'avatar (♂ / ♀, grand aperçu) + page du joueur | `components/welcome/WelcomeSteps.tsx` (écran avatar), `components/avatar/*` (onglet Portrait), `lib/portraits.ts` (ajouts), `components/joueur/*`, `app/joueur/*`, `components/TopHud.tsx` (le lien de l'avatar), `public/images/profil/pied/*`, `app/dev/joueur/*` | — |
| I | Marcel au café | `lib/coach/credits.ts`, `jetons.ts`, `recharges.ts`, `sommeil.ts`, `catalogue-outils.ts` (+ tests), `components/marcel/**`, `components/boutique/RayonRecharges.tsx`, `components/plus/EcranPlus.tsx`, `lib/studuel-plus/formule.ts`, `app/dev/marcel/*`, `public/images/marcel/cafe/*`, `scripts/marcel-illustrations.mjs` | — |
| F | La cinématique | `components/welcome/Cinematique.tsx` (+ css), `public/images/cinematique/*`, `app/dev/cinematique/*` ; le branchement dans `WelcomeFlow.tsx` est fait par le chantier A+D ou à la fin | — |
| J | Les bulles de la fontaine | `components/defi/ArenaVivante.tsx` | — |

Chaque agent : lit le journal de son domaine (`docs/journal/*.md`) AVANT de toucher un écran ; lit `node_modules/next/dist/docs/` avant du code Next ; logique pure dans `lib/` avec Vitest ; vérifications UNE PAR UNE (`npx tsc --noEmit` ciblé ou complet, `npx eslint <fichiers>`, `npx vitest run <dossier>`), jamais en parallèle ; **jamais `npm run build`** (le serveur de dev tourne) ; pas de commit ; textes en français ; une page `/dev/<écran>` sans compte pour chaque écran livré ; captures à 390 × 844 avec son propre pilote Chromium (voir § 5).

## 4. Le détail de chaque chantier

### B — Le ruban de récompenses et la fête de niveau

- **`RubanRecompenses`** (nouveau, dans `components/recompenses/`) : un écran plein (portail, z au-dessus des feuilles, sous la couche des jetons), fond assombri, un RUBAN d'or qui traverse l'écran avec « Récompenses » en Baloo 2 (le ruban ondule en continu : `transform` seul, images-clés littérales), dessous la ou les CARTES de gain (icône de l'unité en grand, montant en très gros, libellé), une lumière tournante derrière (un cône en `conic-gradient` qui tourne — transform). Un tap n'importe où ferme ; à la fermeture, `celebrer(gains, origines, { vague: true })` fait voler les jetons depuis les cartes vers le bandeau. Accessible : `role="dialog"`, le texte des gains lisible, `prefers-reduced-motion` = pas d'ondulation ni de lumière.
- Où l'utiliser : exposer `ouvrirRuban(gains, options)` dans `RecompensesProvider` (contexte), et le brancher sur : le coffre de palier (`FeteNiveau`), l'ouverture du coffre de quêtes (`OuvrirCoffre`), la victoire sur un gardien (`TraqueCombat`), la fin d'une annale (`ValiderAnnale`). Les autres écrans de fin gardent le panneau (ne pas alourdir un quiz).
- **La fête de niveau** (`FeteNiveau`) refaite façon « Level Up » du jeu : ruban « Niveau 7 ! », le badge de niveau qui tourne et grossit (transform), « avant → après » (6 → 7) avec la barre qui se remplit, puis la section **« Débloqué »** : les nouveautés du niveau depuis `decouvertesAuNiveau(niveau)` (`lib/decouverte/catalogue.ts`, livré) — chaque nouveauté est une ligne avec son dessin, son nom et un bouton « Découvrir » qui mène à `href + '?decouvrir=' + cle`. Le coffre de palier reste (tous les 5 niveaux) : son ouverture fait tomber les gemmes en PLUIE (10 cristaux qui tombent en transform/opacity, puis le vol vers le bandeau).
- **Dev** : `/dev/niveau?n=7`, `/dev/recompenses?gains=xp:40,gemme:5`.

### H — L'écrin de déblocage d'une fiche

Lucas, images #65-#67 : « à revoir absolument… texte illisible et pas nécessaire, bouton pas satisfaisant, ni Clash Royale friendly… c'est un aboutissement de temps de travail de débloquer une fiche… un rendu bien plus gamifié ou plaisant » ; la feuille « Débloquer ce chapitre ? » : « je n'aime pas du tout, il faut être plus cohérent avec l'app ».

- **`EcrinFiche`** remplace l'intérieur de `UnlockChapterCard` : au centre, la FICHE ROULÉE (illustration `public/images/fiche/rouleau.webp`, livrée par le chantier d'assets ; repli : le coffre de palier `coffre-palier-ferme.webp` tant qu'elle n'est pas là) posée sur un plateau or/violet façon `CarteMagasin` (voir `components/tresor/CarteMagasin*`), le titre du chapitre en Baloo 2, UNE phrase : « Ta fiche, à toi pour toujours. », un GROS bouton d'or `Button` variante or (« Débloquer · 30 💎 », l'icône `GemIcon` dedans) et dessous, petit : « Il te reste N gemmes » ou « Il te manque N — invite un ami ». Le lien Studuel+ reste, discret, sous le bouton. Plus de cadenas gris, plus de paragraphe gris.
- **La confirmation** n'est plus une feuille blanche : le bouton d'or passe par un état « Maintenir pour débloquer » ? NON — trop original. Décision : une feuille `SheetShell` (`components/ui/SheetShell`, format popup, celui des tanières) avec la même fiche roulée, « Dépenser 30 gemmes ? », le solde après en petit, « Débloquer » en or, « Pas maintenant » en ghost. Même famille que tout l'app.
- **L'ouverture** : au succès, le rouleau se DÉROULE (une illustration `rouleau-ouvert.webp` qui apparaît par transform scale + opacity, étincelles `Eclats` de `components/moi/carnet/Croquis`), puis `router.refresh()` montre la fiche. Si le ruban B existe, l'appeler avec un gain « fiche débloquée » n'est PAS nécessaire : la fiche ne verse rien.
- **Dev** : `/dev/fiche-debloquer?gemmes=45` (et `?gemmes=10` pour l'état sans gemmes).

### C — L'affiche du gardien (avis de recherche)

Lucas : « inspire-toi et trouve le juste milieu pour Studuel pour les boss des matières ». Le jeu annonce proprement le temps limité, trois sous-objectifs avec un bouton, la récompense.

- Dans `BossSheet`, chaque tanière du JOUR devient une **AFFICHE** : au-dessus de la scène, un bandeau parchemin « RECHERCHÉ » (ou « AUJOURD'HUI SEULEMENT ») ; dans la bande blanche, le compte à rebours jusqu'à MINUIT (heure de Paris, `lib/time.ts`) « Il part dans 6 h 12 » (vivant, `useClock`), puis **trois gestes** calculés par une fonction pure `gestesPourTraquer(card)` dans `lib/traque.ts` : d'après `TRAQUE_POINTS` et les points restants, proposer p. ex. « Lire 1 cours (+15) · Aller », « Répondre à 10 questions (+20) · Aller », « Finir 1 quiz (+30) · Aller », chacun avec son lien vers Réviser filtré (`/reviser/<matière>` + ancre ou `?onglet=`), cochés ✓ quand la jauge dit qu'ils sont faits (approximation par points : un geste est « fait » si les points du jour ≥ sa somme cumulée — documenter l'approximation). La ligne des gains (XP + gemmes) passe en GRAND sur l'affiche, en or.
- Un gardien débusqué garde sa carte d'or « Défier » + « Il disparaît dans 42 min ». Un gardien indisponible garde son ruban, mais l'affiche dit « Revient mardi » avec le jour en toutes lettres (déjà `backOn`).
- Tests : `gestesPourTraquer` (pur) ; `BossSheet.test.tsx` mis à jour.
- Dev : `/dev/traque` existe (`ApercuTraque`) — y ajouter les états.

### E — La découverte progressive et le tuto

Lucas : « il faut aussi créer un tuto bien plus abouti et clair de toutes les fonctionnalités de l'app sans être trop pénible, les gains des premiers niveaux pourraient envoyer le user vers une autre fonctionnalité qui débloque et qui est expliquée ».

- **Le catalogue est livré** : `lib/decouverte/catalogue.ts` — `DECOUVERTES` (clé, nom, phrase, niveau d'ouverture, `href`, `onglet` verrouillé ou non, dessin, étapes du mini-tour avec leurs cibles `data-tour`). NE PAS le modifier sans raison ; les deux chantiers B et E s'y appuient.
- **Migration 601** `decouvertes` : `user_id uuid references auth.users on delete cascade`, `cle text`, `vu_at timestamptz default now()`, PK `(user_id, cle)`, RLS select/insert pour soi, `REVOKE … FROM anon`, RPC `decouverte_marquer(p_cle)` (SECURITY DEFINER, borne sur les clés du catalogue — recopier la liste), `mes_decouvertes()` ; et `profiles.decouverte_depuis timestamptz` : posé à `now()` **par défaut pour les nouveaux profils seulement** (ALTER … ADD COLUMN DEFAULT now() puis `UPDATE profiles SET decouverte_depuis = NULL` dans la même migration pour les comptes existants — ils ont tout). Testée sur PGlite (mémoire `migrations-pglite`), inscrite dans `lib/sante.ts` / `_ASSOCIE/sonde-base.mjs` / `supabase/README.md`.
- **La logique pure** `lib/decouverte/etat.ts` : `onglesVerrouilles(niveau, decouvertesVues, decouverteDepuis)` → quels onglets sont fermés ; `nouveautesAAnnoncer(niveauAvant, niveauApres)` ; tout testé.
- **La barre d'onglets** (`Navigation.tsx`) : un onglet verrouillé garde son dessin en GRIS avec un petit cadenas et « Niv. 2 » ; le toucher ouvre une feuille « Se débloque au niveau 2 — encore 60 XP » (barre), jamais une navigation. Réviser et Moi ne se verrouillent jamais. Niveaux : Défi au 2, Amis au 3, Boutique au 3, Marcel au 2 (la tête de Marcel dans Réviser), Ma bibliothèque au 2, les gardiens au 4, les quêtes dès le 1 (déjà), le courrier dès le 1.
- **Le mini-tour** : `?decouvrir=<cle>` sur une page lance `TourGuide` avec les étapes de cette clé (2-3 bulles, spotlight), puis `decouverte_marquer`. Le tour de 7 bulles d'aujourd'hui devient le tour « premiers pas » (Réviser seulement : la série, la file du jour, Marcel, les quêtes) — court. Chaque onglet a ses bulles dans le catalogue (ancrages `data-tour` à ajouter dans les écrans, en coordination : les ancres sont des ATTRIBUTS, ajouter sans réécrire).
- Les comptes existants (`decouverte_depuis` NULL) : rien ne change pour eux, sauf « Revoir le tutoriel » qui rejoue les premiers pas.
- Dev : `/dev/decouverte?niveau=1`.

### G — Le courrier

Lucas : « il faut créer un espace courriel plus abouti ou plus riche ». Le jeu : un courrier qui invite à revenir, cadeaux à ramasser, « tout lire ».

- **Migration 602** : table `courrier` (`id uuid`, `user_id` → cascade, `type text` in (marcel, cadeau, coach, ami, nouveaute), `titre`, `corps`, `lien text null`, `gains jsonb null` (ex. `{"xp":50}`), `expediteur text`, `lu_at`, `encaisse_at`, `created_at`, `expire_at null`), RLS select pour soi, pas d'insert direct ; RPC `courrier_lire(p_id)`, `courrier_tout_lire()`, `courrier_encaisser(p_id)` (verse par `xp_activite('courrier', …)` ou l'équivalent existant, UNE fois), `courrier_non_lus()`, `courrier_deposer(p_user, p_type, …)` interne (SECURITY DEFINER, révoquée à anon/authenticated : seul le serveur/admin l'appelle) ; producteurs : `courrier_bienvenue()` appelée à la création du profil (trigger ou appelée par `app/bienvenue/actions.ts`), et une extension de la diffusion 588 (une lettre par destinataire — si trop lourd, la lettre « coach » est une VUE sur `annonces` lue côté serveur et fusionnée dans la liste ; décider après lecture de la 588). Tout testé sur PGlite.
- **L'écran** `/courrier` : une page plein écran façon boîte aux lettres (en-tête `EnTetePage`, onglets Tout · Marcel · Amis · Coach), chaque lettre une `.carte` avec le portrait de l'expéditeur (Marcel = `PoseMarcel`, un ami = son blason, le coach = icône), un point non-lu, un bouton « Récupérer » en or quand un cadeau attend (vol des jetons par `celebrer`), « Tout lire et récupérer » en bas. Un badge rouge de non-lus sur le bouton flottant.
- **Le bouton flottant** `components/courrier/BoutonCourrierFlottant.tsx` : une enveloppe (illustration famille nav `public/images/courrier/enveloppe.webp` livrée par le chantier d'assets ; repli : l'icône `Mail` de lucide dans un rond blanc), posée AU-DESSUS du bouton des quêtes (même règles de position que `BoutonQuetesFlottant` : arène, tête de Marcel, champ), montée dans `app/layout.tsx` à côté de `BoutonQuetesFlottant`. Il ne s'affiche que s'il y a du non-lu (sinon l'accès reste dans la page du joueur).
- `lib/courrier.ts` pur : tri, groupes par onglet, « il y a 2 h », `nonLus`.
- Dev : `/dev/courrier`.

### A — Le choix de l'avatar

- Écran `avatar` de l'onboarding (`WelcomeSteps.tsx`) et onglet Portrait du vestiaire (`components/avatar/*`) partagent un composant **`ChoixPortrait`** : en haut, le GRAND aperçu du portrait choisi (en pied si `portraitPiedSrc(key)` existe — livré par le chantier D —, sinon le buste), sur un fond crème quadrillé avec un socle ; au milieu, deux onglets « Garçons » / « Filles » (icônes ♂ ♀, la répartition des 13 clés est dans `lib/portraits.ts` : `PORTRAITS_GARCONS`, `PORTRAITS_FILLES` à déterminer EN REGARDANT les images ; un portrait ambigu va dans les deux) ; dessous, la grille 4 colonnes des bustes, le choisi cerné de violet avec une coche ; en bas « Confirmer » (violet). L'onboarding garde ses boutons, le vestiaire enregistre au « Confirmer ».

### D — La page du joueur

Lucas : « vois ce que tu peux faire pour que l'on ait un meilleur rendu lorsque l'on clique sur l'avatar en haut à gauche dans Studuel (et développe via Higgsfield si besoin la version la plus développée possible) » + « mettre l'icône des Paramètres dans cet espace ».

- **Assets** : 13 portraits EN PIED (`public/images/profil/pied/<key>.webp`, ~600 px de haut, détourés), générés d'après les bustes v2. Tant qu'un fichier manque, la page montre le buste.
- **`/joueur`** (`app/joueur/page.tsx`, serveur : relit `getProfileData` + rang + stats) : plein écran, le fond du monde (`.tab-bg`), en haut à gauche un retour, à droite le bouton **Paramètres** (engrenage → `/compte`) ; le HÉROS en pied au centre (ou le buste dans `AvatarRang` en grand), son nom en Baloo 2, « Niveau 7 · Argent II », la barre d'XP ; une rangée de 3-4 chiffres (`.carte` : série, trophées, XP de la semaine, amis) ; des boutons : « Changer d'avatar » (→ `/moi/avatar`), « Mon carnet » (→ `/moi`), « Courrier » (→ `/courrier`, si le chantier G existe ; sinon le lien est ajouté à la fin). Le bandeau (`TopHud`) est masqué sur cette page (`lib/top-hud-routes.ts`), comme sur `/marcel`.
- `TopHud.tsx` : le lien de l'avatar (`href="/moi/avatar"`) devient `/joueur`.
- Dev : `/dev/joueur`.

### I — Marcel au café

Lucas : « les recharges de Marcel deviennent le café (dosette, grosse tasse…) fais les illustrations, c'est plus marrant de recharger Marcel avec du café qu'avec des capsules éclair, fais tout le nécessaire » ; « quand Marcel est épuisé : Marcel qui dort, animé pour qu'il ait vraiment l'air endormi ; en appuyant sur une tasse de café il se réveille ; un compteur animé et vivant des cafés restants » ; grille d'outils : « retire le sous-texte gris, améliore les blocs (bordure blanche trop simple) » ; « corrige le coût en café de chaque outil (un ratio avec le nombre de jetons que possède l'utilisateur) » ; « retire les bulles au milieu de la fontaine » (chantier J).

- **Vocabulaire** : `lib/coach/credits.ts` — `motCafes(n)` (« 1 café », « 174 cafés »), `CAFES_MENSUELS = 200`, `COUT_QUESTION = 1`, `COUT_AVATAR = 25` ; garder les anciens noms en alias (`CREDITS_MENSUELS`, `motCredits`) pour ne rien casser, mais plus aucun « crédit » à l'ÉCRAN : `jetons.ts` (messages), `sommeil.ts`, `recharges.ts` (`RECHARGES` deviennent les CAFÉS : « Dosette » 50 · « Grande tasse » 150 · « Thermos » 400, mêmes prix, même `id`), `formule.ts` (« 200 cafés par mois »), `RayonRecharges.tsx` (« Le café de Marcel »), `EcranPlus.tsx`, `DemanderMarcel.tsx`, `OralAtelier.tsx`, `AtelierAvatarIa.tsx` (« 25 cafés »), `PanneauOutils.tsx`.
- **Illustrations** (livrées dans `assets-sources/marcel-cafe/*.png` par le chantier d'assets, passées par `scripts/marcel-illustrations.mjs` → `public/images/marcel/cafe/{dosette,tasse,grande-tasse,thermos}.webp`) : la dosette est l'ICÔNE du café partout (compteur, coût d'un outil) ; tasse · grande tasse · thermos sont les trois recharges.
- **Marcel endormi** : la pose `dort` existante, ANIMÉE en CSS : la cage thoracique qui se soulève (scale Y 1 → 1.03 sur 3 s), les « z » qui montent et s'effacent (transform + opacity, trois z décalés). Une **tasse** (`tasse.webp`) posée à côté, qui tremble doucement ; la toucher = « Réveiller Marcel » → ouvre `/tresor#recharges` (le café s'achète, le serveur décide ; aucun réveil gratuit). Si une recharge vient d'être accordée (`jetons > 0`), Marcel passe en pose `recharge` (il tient la tasse) avec « Marcel est réveillé ! ».
- **Le compteur vivant** : `CompteurCafes` (`components/marcel/CompteurCafes.tsx`) — la dosette qui bascule (rotate ±6°) et un nombre qui s'égrène quand il change (`useEncaissement`-like, local), posé dans l'en-tête du bureau (`EnTeteBureau`, coin droit, en pilule blanche) et dans `PanneauOutils`.
- **La grille d'outils** : plus de `mots` affichés (garder la donnée pour `aria-label`), bloc = plaque crème à bord lavande (`.carte-plaque` ou mieux : un dégradé doux, ombre portée nette 0 3px 0, l'illustration qui déborde légèrement du haut comme un objet posé), le nom en Baloo 2 ; en bas de chaque bloc le COÛT : « 1 ☕ » (dosette) pour un mode, « Offert » pour une page ; un outil couronné (gratuit) garde sa couronne.
- Le ratio demandé : l'en-tête des outils dit « Il te reste 174 cafés · une demande = 1 café ». Pas d'autre barème (pas de migration) ; si Lucas veut des outils à 2 cafés, `coach_ask_allowed` devra prendre un coût — noter dans le journal.
- Tests mis à jour (`credits.test.ts`, `jetons.test.ts`, `recharges.test.ts`, `sommeil` si testé) ; dev `/dev/marcel?etat=endormi`.

### F — La cinématique

Lucas : « j'aimerais en ajouter une au début de l'onboarding au minimum pour romancer l'histoire ou l'univers de Studuel (fais le nécessaire pour avoir notre première cinématique avec Marcel) ».

- **Le scénario** (≈ 25 s, 5 tableaux, texte qui s'écrit ligne à ligne, Marcel en voix off écrite) :
  1. *L'académie au petit matin* — « Il y a une académie où réviser n'a jamais été une corvée. »
  2. *Marcel à son bureau, la lampe allumée* — « Moi, c'est Marcel. J'y suis coach depuis… longtemps. »
  3. *La cour d'honneur, deux élèves en duel, la fontaine* — « Ici, on s'affronte pour de l'XP, on monte de ligue, on collectionne des trophées. »
  4. *Les gardiens dans l'ombre* — « Et chaque matière a son gardien. Ils ne sortent que si tu travailles. »
  5. *Marcel tend la main* — « Prêt à entrer ? Choisis ton avatar, je m'occupe du reste. »
- **Mise en œuvre** : `components/welcome/Cinematique.tsx` — chaque tableau une image WebP (1080 × 1350, livrées dans `public/images/cinematique/0N.webp`, ≤ 80 Ko chacune) en mouvement lent (Ken Burns : `transform: scale(1.05 → 1.15) translate`, 6 s, images-clés littérales), fondu entre tableaux (opacity), le texte en Baloo 2 blanc sur un dégradé prune en bas (comme l'intro), qui s'écrit (clip en transform `scaleX` sur un masque, ou mot par mot par opacity) ; « Passer » en haut à droite dès la première seconde ; un tap = tableau suivant ; à la fin, « C'est parti » (`OnbButton`). `prefers-reduced-motion` : les tableaux sans zoom.
- Le composant s'auto-suffit (props : `onFin`), avec sa page `/dev/cinematique`. Le branchement : un nouvel écran `cinematique` dans `lib/welcome.ts` AVANT `intro` ? NON : l'intro reste le premier écran (le bouton « J'ai déjà un compte » doit rester à portée) ; la cinématique se joue au tap sur « C'est parti » de l'intro, avant `tuto` — et remplace les trois diapos du `tuto` (qui disent la même chose). Branché à la fin du chantier A+D (même fichier `WelcomeFlow.tsx`).

## 5. Outils communs aux agents

- Serveur de dev déjà lancé sur `http://localhost:3000` (ne pas le relancer, ne pas lancer `npm run build`).
- Captures : lancer SON pilote Chromium (un par agent, port distinct 9341 → 9347) : `node C:/Users/potier/AppData/Local/Temp/claude/C--Users-potier-Documents-Studuel-app/c02149f1-6018-4c77-a475-36f27572b065/scratchpad/play-kit/driver.mjs 934N 390 844 2` en arrière-plan, puis `curl -s -X POST localhost:934N/goto -d '{"url":"http://localhost:3000/dev/...","wait":6000}'` et `/shot {"out":"<chemin>.png"}` ; lire la capture avec l'outil Read. L'optimiseur d'images du dev est lent : attendre, puis rejouer.
- Migrations : rejouer deux fois sur PGlite depuis un dossier du scratchpad (voir la mémoire `C:/Users/potier/.claude/projects/C--Users-potier-Documents-Studuel-app/memory/migrations-pglite.md`), respecter `lib/rls-guard.test.ts` et `lib/sante.test.ts`.
- Les fichiers sont en CRLF par endroits : éditer avec l'outil Edit, pas avec sed.

## 6. Ce qui reste à Lucas après livraison

- Exécuter les migrations 601 et 602 (SQL Editor), dans l'ordre — contrôles : `select count(*) from public.profiles where decouverte_depuis is not null;` → 0 juste après la 601 ; `select count(*) from pg_proc where proname like 'courrier_%';` → 12 après la 602.
- Regarder chaque écran sur `/dev/*` et dire ce qu'il garde.
- Choisir, pour le café, s'il veut des outils à plusieurs cafés (migration à venir).

## 7. Livraison (25/10/2026, 23 h) — tout est livré, rien n'est commité

Sept agents, neuf chantiers, vérifications complètes au bout : `tsc` 0 erreur, `eslint` 0 erreur, Vitest 384 fichiers / 8 829 tests verts.

| Chantier | Aperçu sans compte | Journal |
|---|---|---|
| B+H fêtes et écrin | `/dev/niveau?n=2`, `/dev/niveau?de=4&a=5`, `/dev/recompenses?gains=xp:40,gemme:5&auto=1`, `/dev/fiche-debloquer` | quetes, reviser |
| C affiche du gardien | `/dev/traque` (`?e=debusque\|chasse\|indisponible\|expire\|vide`) | arene |
| E découverte progressive | `/dev/decouverte?niveau=1`, `?niveau=2&decouvrir=defi`, `&feuille=defi` | parcours |
| G courrier | `/dev/courrier?e=garnie\|vide\|lues\|absente` | parcours |
| A+D portrait et joueur | `/dev/joueur`, `/dev/joueur?vue=choix`, `/bienvenue?etape=avatar` | moi |
| I Marcel au café | `/dev/marcel?etat=endormi\|reveille\|fatigue\|repos\|gratuit`, `/tresor#recharges` | marcel |
| F cinématique | `/dev/cinematique?tableau=3`, `/bienvenue` puis « C'est parti » | parcours |
| J bulles de la fontaine | `/defi` | arene |

Décisions prises en route, à connaître :
- Le compte à rebours de l'affiche vise **minuit UTC** (la clé du jour de la 576), pas minuit Paris ; viser Paris demanderait de changer `traque_credit`.
- La page racine `/` envoie toujours vers `/defi` : pour un compte NEUF (arène fermée), `DecouverteVeille` le renvoie vers `/reviser` après un bref passage par l'arène. Lire `decouverte_depuis` dans `app/page.tsx` coûterait une requête à chaque lancement pour tous ; laissé tel quel.
- Un nouveau compte reçoit la lettre de bienvenue (50 XP) EN PLUS des 50 XP de l'onboarding.
- L'onglet Portrait du vestiaire ne propose plus « Avatar dessiné » (DiceBear) ; l'atelier de Marcel y mène toujours. `ItemGrid` / `FreeFieldRow` / `ItemTile` sont sans doute morts, `TutoStep.tsx` n'est plus appelé : à nettoyer après validation.
- Le coffre des quêtes garde sa vague d'éclairs (pas de ruban entre deux quêtes encaissées à la suite).
- Les cartes du café sont turquoise (identité de Marcel), pas d'une teinte « café » neuve.
- Le budget total de `public/` passe de 20 à 24 Mo (`lib/public-poids.test.ts`) : ~1 Mo d'images réellement servies ajoutées.
- Un avertissement React préexistant « unique key — OuterLayoutRouter » (routes parallèles) apparaît dans l'overlay de dev ; pas de ce chantier.
