# Audit design du 23 septembre 2026 — incohérences de couleur, de police et de blocs entre les onglets

_But : homogénéiser les onglets. Ce document liste ce qui s'écarte du système « crème & violet » (CLAUDE.md) ou d'un onglet à l'autre, sur captures d'écran (390 px, compte élève de 3e) puis dans le code. Les dérogations assumées de CLAUDE.md (or du DUEL, feu tricolore du tableau Progrès, teintes des outils de Marcel, des capsules, des périodes, des documents d'exercices, des billets de modes) ne sont pas remises en cause : elles ne sont citées que là où le code les déborde._

## 1. Ce que montrent les captures

### 1.1 Les fonds de page : quatre familles pour un seul système

| Fond | Où | Règle |
|---|---|---|
| Mur crème quadrillé | Boutique, Réviser (accueil, À revoir, Examen blanc, Dictées), Amis, Compte, Marcel, Carnet, Studio, Habitudes, onboarding | conforme |
| **La teinte de la matière en lavis clair** sur l'en-tête, parfois toute la page (bleu ciel Maths, sable Histoire-Géo, rose Français, menthe SVT) — `subjectTheme` (`lib/subject-style`) sur le chapitre, la carte, l'exercice ; `.quiz-fond` avec `--jeu-accent` sur le quiz (crayon géant en filigrane) et l'écran de score | **chapitre**, **cours**, **fiche de révision (carte)**, **exercice**, **quiz**, **score du quiz** | ce n'est pas une couleur en dur, c'est un système : mais CLAUDE.md dit que la teinte de matière est une identité qui « ne touche que l'icône, sa pastille et le liseré », et que Réviser est « violet + crème ». Ici elle colore le fond de toute une famille d'écrans, ceux où l'élève passe le plus de temps. Dérogation à écrire, ou à retirer |
| **Aplat plein de la teinte de la matière** en en-tête, titre blanc (bleu Maths, vert SVT, orange Histoire-Géo et encyclopédie) | dossiers de matière, encyclopédie | même question, en plus fort : l'en-tête entier est de la couleur de la matière, l'or ou le violet n'y ont plus de place |
| **Robe du jeu** (turquoise Calcul mental, rose Boss…) sur toute la page | carte d'un jeu, palier, accueil Boss / Blitz | `.jeu-*` est documenté pour la PIÈCE autour de la table ; ici elle teinte aussi les cartes blanches et le bouton GO (voir 1.4) |
| Violet profond / navy | arène, course, feuilles Modes et Quêtes, en-tête de Moi | décors déclarés |

### 1.2 Les en-têtes de page : sept recettes

1. Bouton retour rond blanc **puis** H1 en dessous, Baloo 2 ~30 px : Compte, Studio, Marcel (titre à contour violet, unique), Exercice.
2. Bouton retour rond **et** titre sur la même ligne : Carnet (« Mon carnet »), jeux de salon (titre **italique en capitales**, unique dans l'app, avec une pastille de matière).
3. Lien texte « ‹ Réviser » / « ‹ Mes habitudes » sans bouton rond : Dictées, Habitudes.
4. Pas de retour, H1 seul, aligné à gauche : À revoir, Examen blanc.
5. Bloc coloré plein (teinte de matière) avec retour rond blanc posé dessus, titre blanc, sous-titre « Programme de 3e · 0/14 fiches », rangée d'onglets-pilules : dossiers, encyclopédie.
6. Bloc ciel bleu, surtitre « Chapitre 1 » gris, H1 centré, sous-titre gris : chapitre, cours, carte, exercice.
7. Ni bandeau ni retour : Moi (carte violette sombre avec ses propres pilules gemmes et réglages), Vestiaire (dégradé lavande, pilule d'écus dorée en haut à droite), arène (HUD propre).

Le bandeau HUD (pilule blanche niveau · flamme · gemmes) est présent partout **sauf** sur Moi, le vestiaire et l'arène ; sur les pages de jeu il prend une robe sombre (pilule violet nuit). Trois HUD différents pour la même information.

### 1.3 Titres et casse

- Titres de page en Baloo 2 partout, mais la taille varie : « À revoir » / « Examen blanc » (~30 px, à gauche), « Mon compte » (~34 px), « Studio » (~30 px), « Coach Marcel » (~36 px avec contour), « SVT » (~40 px blanc sur aplat), « Puissances d'un nombre… » (~26 px centré), « Calcul mental éclair » (italique capitales ~14 px puis ~34 px sur la scène).
- Surtitres : « APPRENDRE · MÉMORISER · SE TESTER », « TON CLASSEMENT », « MON RANG », « LA CITATION DU JOUR », « ABONNEMENT », « CLASSEMENT DES AMIS », « DÉFI DU JOUR », « RÉCOMPENSES » en petites capitales espacées — mais « Mes matières », « Ta collection », « Le dojo des astuces », « Ton rythme », « Ma classe » en Baloo 2 casse normale pour le même rôle de titre de section. Deux conventions cohabitent, parfois sur le même écran (Classement : « MON RANG » puis « Mes matières »).
- Boutons : en **capitales** dans tout l'onboarding (« C'EST PARTI », « CONTINUER », « CRÉER MON COMPTE », « VÉRIFIER ») et sur le quiz (« VALIDER », « CONTINUER »), en **casse de phrase** partout ailleurs (« Passer à Studuel+ », « Revoir mes 4 erreurs », « Retour à Réviser », « Débloquer avec Studuel+ », « Encaisser »). « GO » seul en anglais (examen blanc, paliers, Blitz, Boss, `/defi/jouer`).

### 1.4 Boutons : couleurs hors rôle

- **Vert** en action principale : « Revoir mes 4 erreurs » (écran de score, bouton le plus gros de l'écran), « Je le savais ! » (flashcards). Le vert est `success`, un état, pas une action.
- **Corail** « À revoir » (flashcards) : le rôle `destructive` pour « revoir une carte », qui n'a rien d'une alerte.
- **Turquoise** « GO » sur le palier de Calcul mental, **violet** « GO » sur Blitz : le bouton prend `--jeu-accent` (la robe du jeu, `GameShell.tsx:140`), alors que la règle réserve la teinte du jeu à la pièce et à l'icône, jamais au bouton. Même mécanique pour « VALIDER » du quiz (`quiz-plaque`, bord `--plaque-bord` dérivé de l'accent de la matière : bleu-gris en Maths) et pour les barres de progression du quiz.
- **Vert** « Revoir mes 4 erreurs » : c'est bien le rôle `success` (`ROBE_ERREURS`, `QuizPlayer.tsx:106`), mais posé sur l'action la plus grosse de l'écran, pour « revoir ses erreurs » : un état utilisé comme action, à côté du violet « Quiz suivant ».
- **Or** sur des actions hors arène : « Passer à Studuel+ » (Boutique), « Commencer le test », « Continuer » (résultat du placement), « Encaisser » (quêtes), « Lire la fiche » est violet mais posé sur une carte menthe. CLAUDE.md réserve l'or au DUEL de l'arène et au gain.
- **VALIDER** du quiz : plaque bleu-gris cerclée (`quiz-plaque`), unique ; le même geste est un bouton violet plein « VÉRIFIER » dans l'onboarding.
- Boutons ronds géants « GO » (examen blanc, paliers, modes) contre boutons larges à bord épais partout ailleurs.
- Trois familles de « chunky » : `onb-btn` (onboarding), `btn-chunky` (app), `olympe-*` / `arena-plate` (arène), plus le `Button` shadcn plat (outline sur Compte : « Se déconnecter », « Espace parents », « Revoir le tutoriel »).

### 1.5 Cartes et blocs

- Réviser accueil : pilules blanches à ombre portée douce (matières) ; dossier : **cartes violettes pleines** à coins très arrondis (chapitres) contenant des cartes blanches (fiches) ; chapitre : tuiles blanches `rounded-3xl` à ombre ; cours : tableaux à fond sable ; Classement : cartes blanches à bord violet clair ; Quêtes : cartes violettes translucides ; Boutique : cartes Clash Royale à liseré noir, textes cernés ; Moi : carte violet nuit et cartes blanches à ombre ; Habitudes : **dégradé fuchsia → violet** (seul endroit de l'app avec ce rose) ; Marcel : bulles blanches ; encyclopédie : carte **menthe** pour la citation du jour (une teinte de plus, ni période ni rôle).
- Rayons de coin : `rounded-2xl`, `rounded-3xl`, `rounded-[28px]`, pilules pleines : au moins quatre rayons pour « une carte ».
- Ombres : ombre portée douce (Réviser), bord épais `border-b-4` (chunky), ombre noire décalée (Boutique), aucune (cours). 

### 1.6 Icônes

- Matières : **emoji** dans les pilules de l'accueil Réviser et dans les jeux (🗺️ Capitales, 📜 Frise, 📘 Ton programme), **vignettes webp** dans l'arène, la course et le Classement, **lucide** ailleurs. Trois vocabulaires pour le même objet.
- Retour : flèche lucide dans un rond blanc, ou chevron texte « ‹ », ou croix « × » (quiz, feuilles).

### 1.7 Écrans orphelins qui gardent l'ancien design

- `/defi/jouer` (sans `?mode`) : carte « BRONZE IV · ALLER AU COMBAT », tuiles rouge et or « DUEL FANTÔME +20 XP », « BLITZ 60S », gros « GO » or « +110 XP » : l'arène d'avant, avec des promesses d'XP retirées depuis. Aucun lien n'y mène, l'URL répond.
- Écran de score du quiz (« Pas mal ! ») : ciel bleu + vert + violet, seule page à mélanger les trois.
- « Duel en direct » (`/defi/duel-rapide`) : panneau crème vide « Connexion… » posé sur le décor.

## 2. Ce que montre le code

Scan de `app/**` et `components/**` (`.tsx` et `.css`, tests exclus).

### 2.1 Couleurs en dur (hex, rgb, oklch) et palettes Tailwind nommées, par onglet

| Onglet | Couleurs en dur | Où | Classes de palette nommée (`bg-green-600`, `text-amber-700`…) |
|---|---|---|---|
| Défi | 123 | `ModeTicket.module.css` (18), `RankingTabs.tsx` (11, code mort), `ModeHero.module.css` (9), `BossSheet.tsx` (8), `DuelHistory.tsx` (6), `ModesSheet.module.css` (6), `Course.module.css` (6), `LiveDuelMode.tsx` (6) | **47** : les six modes (`BlitzMode`, `BossMode`, `ChronoMode`, `SurvivalMode`, `DuelMode`, `CoopMode`) et `DefiHome` partagent la même recette `border-green-600 bg-green-600 text-green-700 text-green-400` + `bg-red-50 text-red-300` pour juste/faux, au lieu de `success` / `destructive` |
| Réviser | 111 | `exercices/manuel.module.css` (53, dérogation documentée), documents d'exercices (Scratch 9, Carte 8, Circuit 5…, dérogation), `Encyclopedie.module.css` (7), **`SubjectHeader.tsx` (5)** | 3 (`BossArena.tsx` : emerald) |
| Moi | 78 | `vestiaire-assets.tsx` (54, dessins), `CouronneArt.tsx` (20, dessin), `CarteProfil.tsx` (3), `OngletsMoi.tsx` (1) | 0 |
| Onboarding | 53 | `PencilLogo.tsx` (18, dessin), **`WelcomeSteps.tsx` (18)**, **`EngageSteps.tsx` (12)**, `OnbBits.tsx` (3), `SignUpStep.tsx` (2) | 0 |
| Marcel | 44 | `PointDuJourHero.tsx` (9), `DemanderMarcel.tsx` (6), `ProgresPanel.tsx` (6, feu tricolore documenté), `OralPanel.tsx` (5), `SeanceCard.tsx` (5), `OralAtelier.tsx` (4), `MethodePanel.tsx` (3), `app/marcel/page.tsx` (2) | 0 |
| Boutique | 6 | modules CSS des cartes et bandeaux (ombres) | 0 |
| Amis | 3 | `RailDivisions.tsx` (2), `FriendStories.tsx` (1) | 9 : `bg-green-500/600`, `text-green-*`, `ring-orange-400` |
| Parents | 0 | — | 1 |
| Global | 764 dans `globals.css` (tokens et mondes : normal), puis `FriendQrButton.tsx` (11), `TopHud.tsx` (8), `BoutonsOAuth.tsx` (6), `FriendAddCard.tsx` (6), `FriendAddButton.tsx` (5), `SerieCelebration.tsx` (4) | 75 : `ExamBlancPlayer` (amber), `MindMap` (sky), `StreakMascot` (`from-amber-400 to-orange-600`, flamme : autorisé), `SubjectsHome` (`ring-green-500`, `bg-amber-500`, `text-slate-400`), formulaires de connexion (`text-green-700`) |

Lecture : hors dessins (vestiaire, couronnes, crayon) et dérogations écrites (documents d'exercices, feu tricolore), il reste ~80 couleurs en dur dans des composants d'interface (Défi, Marcel, onboarding, `SubjectHeader`, `TopHud`, boutons d'ajout d'ami) et ~130 classes de palette nommée, presque toutes pour dire « juste / faux / en attente » en vert, rouge, ambre, là où `success`, `destructive` et `warning` existent.

### 2.2 Familles de boutons

| Famille | Occurrences | Onglets |
|---|---|---|
| `<Button>` shadcn (variants default / outline / ghost…) | 169 | tous |
| `arena-plate` / `arena-plaque` / `olympe-glass` / `olympe-gold` / `defi2-press` | 33 / 17 / 17 / 7 / 16 | Défi (et `olympe-gold` repris par Boutique, Amis, vestiaire, carnet) |
| `quiz-plaque` / `quiz-pilule` | 21 / 7 | quiz, flashcards, examen blanc |
| `onb-btn` | 13 | onboarding |
| `btn-chunky` | 11 | Boutique, Réviser (verrous, exercice) |

Cinq familles de « gros bouton » pour le même geste, plus le `Button` plat. `olympe-gold` (l'or du DUEL) est repris hors arène par `CarteStudueLPlus`, `RivalCard`, `TeamChestCard`, `AvatarStudio`, `ItemTile`, `PurchaseModal`, `BentoCarnet`.

### 2.3 Rayons de coin

`rounded-full` 681 · `rounded-2xl` 377 · `rounded-xl` 140 · `rounded-3xl` 119 · `rounded-lg` 27 · `rounded-md` 9 · `rounded-sm` 5, plus les modules CSS (18 px pour `quiz-plaque`, 28 px pour les cartes de chapitre…). Trois rayons dominants pour « une carte » (`xl`, `2xl`, `3xl`), sans règle de choix.

### 2.4 Titres de page

Tous en `font-heading`, mais : `text-2xl font-bold` centré (chapitre, cours, carte, flashcards), `text-3xl font-extrabold` à gauche (dictées), `text-2xl font-extrabold` (oral de Marcel), `text-[17px] font-extrabold truncate` (habitudes, titre dans la barre de retour), et la plupart des pages d'onglet n'ont pas de `<h1>` du tout (le titre est un `<h2>` ou un `<div>` : accueil Réviser, Amis, Moi, Boutique, Compte, Carnet, Studio). `font-bold` et `font-extrabold` alternent pour le même rôle.

### 2.5 Par onglet, ce que la relecture du code ajoute (contre-vérifié sur les points cités)

- **Boutique** : l'onglet le plus propre (1 couleur en dur, 100 % `Button`). Deux écarts : la feuille modale est crème (`Feuille.tsx`, `bg-background`) quand toutes les autres feuilles sont blanches ; les cartes sont sans ombre quand le reste de l'app en porte une.
- **Réviser** : les sous-pages posent une feuille opaque `rounded-t-3xl bg-background` qui **couvre le mur quadrillé** (`[chapter]/page.tsx:81`, `cours/page.tsx:88`, révision, studygram, encyclopédie, exercice) alors que la règle dit que ces écrans sont posés sur le papier ; `SubjectStickyBar.tsx:59` est fixe et flouté. 184 tailles `text-[…]` arbitraires (31 valeurs). Huit recettes de carte (`rev-card` 28 px, `Card` 32 px, `rounded-3xl bg-card ring`, `border-2`, `rounded-xl border` du carnet…). CTA verts : « Revoir mes erreurs », « Commencer à écrire » et « Voir mon score » (`DicteeSession.tsx:185, 323`). Une vingtaine de boutons faits à la main en `bg-primary` au lieu de `Button`. Or en action : « Défier » (`BossApparition.tsx:228`), génération du carnet (`QuestionEditor.tsx:114`). Les verdicts de flashcards sont deux boutons maison, différents de ceux du Défi. Le quiz et la dictée sont en plein écran, mais flashcards, cahier, contrôle blanc, examen blanc et révision du carnet gardent bandeau et onglets. La gemme est un tracé `GemIcon` ici, une image `CristalIcon` dans le HUD et la Boutique.
- **Défi** : les six modes historiques (Blitz, Chrono, Survie, Boss, Duel, Coop, + Duel en direct et `DefiHome`) écrivent juste/faux en `green-600 / red-50` (≈ 50 occurrences) quand `AnswerBoard` (quiz et jeux) utilise déjà `success` / `destructive`. Encres sur fond sombre en hex (`#faf6ef`, `#d8c9ff`, `#c9b4ff`, `#ece5f7` : `ProfileChip`, `CompteTropheesArene`, `DailyQuests`, `TopHud`). Quatre encres différentes sur jaune. Sept recettes de « violet profond » (`.defi-arena-bg`, `.mode-stage-dark`, `.traque-salle`, `.jeu-monde`, `.defi3-sheet`, `.defi-modes-screen`, `.olympe-glass`). Titres MAJUSCULES italiques propres au Défi ; énoncé de question en `text-xl font-bold` dans les modes et `text-2xl font-extrabold` dans les jeux ; `font-mono` pour les compteurs (72 fois) contre `font-heading tabular-nums` ailleurs. Trophée lucide dans 17 fichiers contre la coupe illustrée ailleurs ; jeux en emoji dans le Classement contre leurs scènes webp sur les billets. `ModeStage.tsx:106` et `ArenaBackButton.tsx:35` sont fixes et floutés.
- **Amis** : les CTA sont **verts** (« Ajouter un ami » `FriendAddButton.tsx:105`, dégradé oklch 145 ; « Mon QR code » `FriendQrButton.tsx` avec `#14532d` ; panneau `FriendAddCard.tsx:35`) ; présence en `bg-green-500`. La modale d'ajout est centrée quand les autres sont des feuilles en bas. Trois formulations : « Inviter un ami », « Invite un ami », « Ajouter un ami ».
- **Moi** : trois recettes de carte sur un même écran (`.moi-bloc` 22 px sans bord, `.moi-card` 39 px liseré 2 px et socle, `Card` shadcn sur `/compte`, `NotificationsOptIn` en `rounded-xl border`). 43 tailles arbitraires jusqu'à `text-[9.5px]`. Quatre tailles de titre de section. Familles d'habitudes en emerald / orange / sky / purple (`lib/moi/familles.ts:45-62`), sans dérogation. « Mes habitudes » cohabite avec « Tes badges », « Ton palmarès ».
- **Marcel** : l'encre `--foreground` codée en dur dans 18 ombres (`rgba(36,48,79,…)`), pastille de série en `#ffeed2` / `#b4550c` avec une `<Flame>` lucide au lieu de `FlammeAnimee`. Cartes à 20 px (21 fois), 18 px ou 26 px : 30 rayons et 37 ombres arbitraires, 88 tailles `text-[…]` — l'onglet le plus hors échelle. Achat de jetons sur un bouton **or** (`DemanderMarcel.tsx:592`) quand la Boutique paie en gemmes sur du violet. Double gouttière (`px-4` sur `px-4`, `app/marcel/page.tsx:106`) : 32 px de marge contre 16 ailleurs.
- **Onboarding** : **aucun `font-heading`** — les titres sont en Nunito 800 (`.onb-title`, `globals.css:2106`), seul monde sans Baloo 2. Vert de réussite `#2AA36B` différent de `--success`. `.onb` (`globals.css:2087`) redéclare les tokens de `:root` en hex. `/login` (`LoginForm.tsx`, `PageHeader` + `Card`) est dans l'ancien gabarit quand l'inscription est dans le monde `.onb`.
- **Parents** : `bg-background min-h-svh` (`app/parents/page.tsx:209`) **masque le mur**. Titres en `font-semibold` (unique dans l'app, `ConseilsPanel.tsx:44`), surtitres sans `font-heading`. **Aucun `Button`** : CTA plats `rounded-xl`, `OffrirStuduelPlus.tsx:75` en jaune. Le feu tricolore, « limité au tableau Progrès », déborde dans `MatieresSuivi.tsx:94-98`, `ControleBlanc.tsx:334`, `ExamBlancPlayer.tsx:28-31` et l'urgence de `SubjectsHome.tsx:36-37`.
- **Coquille** : le repli du bandeau (`app/layout.tsx:154`) est `bg-card/85 backdrop-blur-md` alors que la règle veut un bandeau opaque. `BackButton` est majoritaire (≈ 20 usages) mais neuf autres recettes de retour existent. `max-w-md / xl / 2xl / 4xl` pour des rôles équivalents. **La couleur de matière a quatre sources** : `subjects.color` en base alimente `robe-*`, `tile-subject-*`, `subject-style` et `SUBJECT_PASTEL`, les billets suivent `TEINTE_MATIERE` — Physique-Chimie est violette en base (`008_reviser.sql`) et turquoise sur les billets, l'Espagnol jaune en base et corail sur les billets ; une matière violette contredit « violet = action ». Conforme partout : le séparateur « · », les points de suspension « … », aucun titre terminé par « : ».

## 3. Les chantiers d'homogénéisation qui rapportent le plus

1. **Un seul fond dans Réviser** : remplacer le dégradé ciel bleu (chapitre, cours, carte, exercice, quiz, score) par le mur crème, et décider du sort de l'aplat de matière des dossiers (dérogation écrite, ou en-tête violet + médaillon teinté).
2. **Une seule recette d'en-tête de page** : retour rond blanc + H1 Baloo 2 à taille fixe + sous-titre gris, et la rangée de pilules d'onglets quand il y en a. Supprimer les liens « ‹ Réviser » et les H1 sans retour.
3. **Un seul HUD** : la pilule blanche partout, y compris Moi et le vestiaire (ou l'inverse, mais une seule).
4. **Boutons** : violet plein pour l'action principale, `btn-chunky` comme unique famille chunky hors arène, casse de phrase partout (ou capitales partout), « GO » → « C'est parti » ; vert et corail réservés aux états ; turquoise interdit sur un bouton ; or réservé à l'arène et aux gains (donc « Passer à Studuel+ » et « Encaisser » en violet, ou dérogation écrite).
5. **Titres de section** : une convention (petites capitales espacées OU Baloo 2), pas les deux.
6. **Une carte** : un rayon, une ombre, un fond, déclinés en deux ou trois variantes nommées (`card`, `card-plate`, `card-dark`) au lieu des recettes locales.
7. **Icônes de matière** : les vignettes webp partout (accueil Réviser, jeux), plus d'emoji.
8. **Supprimer ou redessiner** `/defi/jouer` sans mode et l'écran de score du quiz.
9. **Rose / menthe / fuchsia** : sortir les teintes sans rôle (Habitudes, citation du jour, familles d'habitudes) ou les nommer dans les tokens ; créer `--ink-on-dark` (et sa variante atténuée) pour remplacer les quatre hex crème et lavande du Défi, et une seule encre sur jaune.
10. **Les feuilles de l'arène** : Classement clair, Quêtes et Modes sombres — décider d'une robe pour les trois, et ramener les sept « violets profonds » à un ou deux.
11. **Le Défi juste / faux** : passer les six modes historiques de `green-600 / red-50` à `success / destructive` en les faisant passer par `AnswerBoard` (≈ 50 occurrences, 8 fichiers).
12. **L'échelle de tailles** : ramener les ≈ 520 `text-[Npx]` à l'échelle Tailwind (au plus deux tokens ajoutés), en commençant par Marcel, l'onboarding et Moi ; `font-heading font-extrabold` pour tous les titres (donc `PageHeader`, Parents, `CardTitle`, onboarding).
13. **Fonds et flou** : rendre le mur visible sous Parents et sous les feuilles `bg-background` des sous-pages de Réviser ; retirer `backdrop-blur` des éléments fixes (repli du bandeau, `SubjectStickyBar`, `ModeStage`, `ArenaBackButton`).
14. **Une seule source pour la couleur d'une matière** (base ou `TEINTE_MATIERE`), et plus de matière violette.
15. **Iconographie** : `CristalIcon` partout (plus de `GemIcon` ni de `Gem` lucide), la coupe illustrée partout (plus de `Trophy` lucide), `FlammeAnimee` pour la série et aucune flamme hors série.
16. **Décisions à prendre par Lucas** : la robe des trois feuilles de l'arène ; l'extension (ou le retrait) du feu tricolore hors du tableau Progrès ; le sort de la teinte de matière en fond d'écran dans Réviser ; l'or sur « Passer à Studuel+ » et « Encaisser » (gain ou action ?).
