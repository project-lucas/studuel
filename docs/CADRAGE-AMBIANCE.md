# CADRAGE — L'AMBIANCE « ACADÉMIE DE FANTASY » (30/10/2026)

> Audit de l'ambiance de toute l'app, sans code. Lucas : « vois ce que tu peux faire de mieux, de plus adapté à l'ambiance : le branding, les labels, les coulisses ; on corrigera les détails ensuite ». Point de départ : `assets-sources/heros/LORE-STUDUEL.md` (brouillon du monde) et les « Règles du projet » de `CLAUDE.md`.
> **Statut : proposition, rien n'est codé, rien n'est validé.** Les libellés ci-dessous sont des PROPOSITIONS à trier par Lucas. Les textes cités viennent d'une lecture ciblée (onglets, `lib/*`, catalogues) ; un texte non retrouvé est marqué « à vérifier ».

## 0. La règle qui gouverne tout

1. **Le sens avant le décor.** Un élève de 11 à 18 ans doit comprendre ce que fait le bouton sans connaître le lore. Le décor s'ajoute AU mot clair (sous-titre, vignette, ton de la phrase), il ne le remplace pas. « Lancer un duel » reste compris ; « Croiser le fer » ne l'est qu'avec une icône d'épée.
2. **Humour doux.** Un monde de fantasy drôle : la lanterne, la craie, le prof absorbé par sa passion. Jamais d'effroi, jamais de méchanceté, une défaite ne retire rien (règle déjà posée le 13/10).
3. **Pas de calque.** On s'inspire de Tolkien, de Clash Royale, de Duolingo ; on ne copie aucun nom (pas de Mordor, de Poudlard, d'« arène » à la Clash). Les noms propres sont à inventer.
4. **Zéro anachronisme dans le décor, tolérance dans l'outil.** Un bouton « Se connecter » ou « Réessayer » est de l'outil, il reste. Ce qui doit basculer, ce sont les titres, noms de lieux, récompenses, messages de coulisses.
5. **Le violet reste la couleur d'action de l'UI, jamais celle d'un personnage** (garde-fou du brief).

## 1. Ce qui sonne déjà « Académie de fantasy » : à GARDER

| Élément | Où | Pourquoi ça marche |
|---|---|---|
| **L'Académie, la cour d'honneur (l'arène), l'aube/midi/nuit** | `lib/arena-vivante*.ts`, `lib/arena-background`, `DECOR_JOUEUR`, 78 scènes du bureau | Le lieu existe déjà, peint, avec ses six lumières. C'est la colonne vertébrale visuelle. |
| **Les gardiens** (un par matière, rareté 576, « avis de recherche », « RECHERCHÉ / DÉBUSQUÉ », « Il part dans 6 h 12 ») | `lib/traque.ts`, `BossSheet` | Le parchemin de l'affiche est déjà dans le ton. À étendre en « profs-boss ». |
| **Les gemmes** (et non « coins ») ; « Plus de pièces » | `lib/economie.ts`, boutique | Monnaie de fantasy naturelle, déjà débarrassée de l'écu moderne. |
| **Les coffres** (palier, équipe, du soir, du niveau) | `CoffrePalier`, `CoffreDessin`, quêtes | Objet universel de jeu d'aventure, compris de tous. |
| **Marcel, mentor ; le « café de Marcel »** (« Dosette · Grande tasse · Thermos ») | `lib/coach/credits.ts`, `MarcelEndormi`, charte `docs/marcel-charte.md` | Marcel en mentor un peu vieux, sa tasse : humour doux déjà posé. « Marcel dort » est une très bonne idée de lore. |
| **Les capsules**, les **fiches**, **la bibliothèque** | `/carnet` « Ma bibliothèque », FicheCapsule | Parchemins et rayons : vocabulaire de savoir ancien. |
| **L'Encyclopédie** (personnages, événements) | `lib/encyclopedie/` | Déjà un « grimoire » d'histoire. |
| **Les peuples en portraits** (13 portraits, cadre au niveau, vestiaire « Personnages ») | `lib/portraits`, `ChoixPortrait` | Prépare l'élève héros de tous peuples. |
| **La cinématique d'ouverture** (« Il y a une académie où réviser n'a jamais été une corvée. », « L'académie au petit matin, un château violet… ») | `components/welcome/Cinematique.tsx` | Le texte de base du lore est déjà écrit. |
| **Le Musée, la Traque, le dojo, les tanières** | jeux, `BossSheet` | « Traque » et « tanières » sont du bon vocabulaire de quête. |
| **La lettre de bienvenue, le Courrier** | `/courrier` | Boîte aux lettres = parchemin cacheté, parfait. |
| **« Pas de boss rempli à l'avance », « ils ne sortent que si tu travailles »** | catalogue de découverte | La règle du jeu est elle-même une phrase de lore. |
| **Titres de niveau « Apprenti », « Stratège », « Légende »** | `lib/wallet.ts` (`LEVEL_TITLES`) | Déjà des grades de guilde. |
| **Les écrans qui s'ouvrent un par un** (découverte progressive) | `lib/decouverte/catalogue.ts` | = « le donjon se découvre pièce par pièce ». |

## 2. Les ruptures d'ambiance et leurs propositions

Légende : **Garder** = on laisse tel quel ; **Habiller** = on garde le mot clair et on ajoute le décor (sous-titre, ton) ; **Remplacer** = nouveau libellé.

### 2.1 Navigation et noms d'écrans (tous onglets)

| Texte actuel (fichier) | Problème | Proposition | Mode |
|---|---|---|---|
| Onglet **Réviser** (`app/reviser/onglet.tsx`, `title="Réviser"`) | Verbe d'école, correct mais plat | Garder « Réviser » comme nom ; titre de page « Les salles de cours » / sous-titre « Ton programme, chapitre par chapitre » | Habiller |
| Onglet **Défi** / « L'arène » (`catalogue.ts` : « L'arène ») | « Arène » est déjà le mot ; « Défi » en barre | Garder « Défi » (action) ; lieu = « la cour d'honneur » | Habiller |
| Onglet **Amis** (`app/amis/onglet.tsx`) | Réseau social générique | Garder « Amis » ; l'écran-ligue s'appelle « La Ligue de la semaine » (ok) | Garder |
| Onglet **Moi** (`app/moi/onglet.tsx`) | Générique | Titre de page « Mon carnet d'aventurier » ; l'étiquette de l'onglet reste « Moi » | Habiller |
| Onglet **Boutique** (`/tresor`, `app/tresor/onglet.tsx`) | « Boutique » = e-commerce | « Le Marché » est déjà un rayon ; proposer « La Boutique de la guilde » en titre, onglet « Boutique » | Habiller |
| **Marcel, ton coach** (`catalogue.ts` : nom `Marcel, ton coach`) | « Coach » = sport/entreprise ; vs lore « mentor » | « Marcel, ton mentor » (le brief du lore) — attention : « coach » est aussi un rôle réel (`/coach`, console) : NE PAS toucher la console | Remplacer (côté élève seulement) |
| **Le bureau de Marcel** : onglets Aujourd'hui · Radar · Toi · Outils · Examen | « Radar », « Outils » sont techniques | « Aujourd'hui » ok ; « Radar » → « Carte du savoir » ; « Outils » → « L'atelier » ; « Examen » → « Les épreuves » | Remplacer |
| **/compte** « Paramètres » (page du joueur) | Vocabulaire logiciel | « Mon sac » (sous-titre : « Paramètres du compte ») | Habiller |

### 2.2 Onglet Réviser

| Texte actuel | Fichier | Proposition | Mode |
|---|---|---|---|
| « Choisir ma classe » | `app/reviser/onglet.tsx` | « Choisir ma classe » reste (compris) ; ajout d'un sous-titre « ta salle de l'Académie » | Habiller |
| Portes « Programme · Cahier d'exercices · Jeux · Annales » | `PortesMatiere` | « Programme » (garder), « Cahier d'exercices » (garder), « Jeux » → « Salle d'entraînement », « Annales » → « Les épreuves du passé » (sous-titre : « Annales corrigées ») | Habiller |
| « Les sujets tombés, corrigés » | annales | « Les sujets tombés, corrigés » : déjà bien, garder | Garder |
| « Tu t'étais arrêté là » (carte `BoucleOuverte`) | 604 | Bon ton. Option : « Ton marque-page » en titre | Habiller |
| « Mode mémoire » / « Cacher les mots-clés » | `ModeMemoire` | « Mode mémoire » → « Le voile du sage » (sous-titre : « Cache les mots-clés ») | Habiller |
| « Chrono de lecture » | `ChronoLecture` | « Le sablier » (le sablier de Kaiser Fang est dans le lore) | Remplacer |
| « Cours », « Fiche », « Quiz », « Exercice », « Mes erreurs » | écran de chapitre | Garder partout (ce sont des noms d'objets scolaires clairs). Option : « Mes erreurs » → « Mes pièges » | Garder |
| « Plus que N » (boucle ouverte) | `lib/boucle-ouverte.ts` | Garder | Garder |
| « Chapitre suivant » | cahier | « Chapitre suivant » → « Tourner la page » en sous-titre | Garder |
| Tuile « Matière : Sport » (culture sportive) | matière | Garder le nom officiel de la matière | Garder |

### 2.3 Onglet Défi / Arène

| Texte actuel | Fichier | Proposition | Mode |
|---|---|---|---|
| **Duel fantôme** | `lib/defi-modes.ts` | Garder (fantôme = rival rejoué, très bon) | Garder |
| **Blitz 60s** | `lib/defi-modes.ts` | Anglicisme : « Éclair 60 s » (cohérent avec « Conjugaison éclair », « Calcul mental éclair ») | Remplacer |
| **Contre-la-montre** | `lib/defi-modes.ts` | Bon, garder (ou « Course contre le sablier ») | Garder |
| **Survie** | `lib/defi-modes.ts` | Garder | Garder |
| **Boss de la semaine** | `lib/defi-modes.ts` | « Le gardien de la semaine » (le mot gardien existe déjà ailleurs) | Remplacer |
| **Relais 2v2**, **2v2 toutes matières** | `lib/jeux/catalog.ts` | « 2v2 » est du jargon e-sport : « Relais à deux », « À deux, toutes matières » | Remplacer |
| **Cerveau collectif** | `lib/jeux/catalog.ts` | Moderne mais drôle ; « Le conseil des sages » | Remplacer (option) |
| **Traduction flash**, **Traducción flash**, **Falsos amigos** | `lib/jeux/catalog.ts` | « flash » est un anglicisme courant : accepté, mais « éclair » est déjà la famille ; garder « Falsos amigos » (c'est de l'espagnol réel) | Habiller |
| **Anatomie express / Muscles express** | `catalog.ts` | « express » = ok mais cohérence : « éclair » partout, ou « express » partout. Choix à faire. | À trancher |
| **Chasse à la faute**, **Chasse aux éléments**, **Capitales du monde**, **La Frise folle**, **Le Musée**, **Qui a composé ?**, **Classe-moi l'instrument** | `catalog.ts` | Déjà dans le ton (verbes de chasse, jeux de salon). Garder. | Garder |
| Mode « Partie rapide » | `LiveDuelMode` | « Combat amical » sous-titre « Partie rapide » | Habiller |
| **DUEL** (pilule d'or) | arène | Ne pas toucher (règle « rangée de combat intouchable ») | Garder |
| **Trophées** | duels | Garder (compris) | Garder |
| **Palier N**, étoiles, « Sans-faute » | `PalierMap` | Palier → « Salle N » (dans les cartes de donjon) ; garder « Sans-faute » | Habiller |
| **Classement** (`ClassementSheet`) | HUD | « Le Classement » + sous-titre « Tableau d'honneur » | Habiller |
| **Historique** (`app/defi/onglet.tsx`, label) | onglet interne | « Mes combats » | Remplacer |
| **National** (label) | classement | « Tout le royaume » | Remplacer |
| **Ligue** (label dans Défi) | | Garder | Garder |

### 2.4 Onglet Amis (Ligue)

| Texte actuel | Fichier | Proposition | Mode |
|---|---|---|---|
| « Ligue de la semaine » | `lib/ligue.ts` | Garder, ajouter « de l'Académie » : « Ligue de l'Académie » | Habiller |
| Échelons « Bronze 4 … Diamant 1, Maître » | `lib/ligue.ts` | Les métaux sont compris de tous : GARDER ; renommer seulement l'ensemble : « Divisions » → « Rangs d'honneur » dans les titres d'écran | Garder |
| « Les N premiers montent en … » | `ligue.ts` l.457 | Bien. Ajouter la formule : « …montent en Argent II, cap sur la tour suivante » | Habiller |
| « Promotion ! », « Bienvenue en … ! », « Retour en … », « Tu restes en … » | `ligue.ts` l.599-615 | Bons. « Promotion ! » → « Tu es promu ! » (le mot « promotion » est administratif) | Remplacer (léger) |
| **Mes amis**, « Dix places, dix invitations » | `AmisHome` | « Ma compagnie » (la troupe de héros) avec sous-titre « Tes amis » ; « Dix places » → « Dix places dans ta compagnie » | Habiller |
| **Multiplicateur d'XP** (« +10 % par ami ») | `catalogue.ts` | Garder le chiffre ; nom : « Bonus de compagnie » | Habiller |
| **Coffre d'équipe** | amis | « Coffre de la compagnie » | Remplacer |
| **Carte de parrainage** (`ParrainageCard`) | `components/` | « Parrainage » : mot lié aux récompenses réelles. Titre : « Invite un camarade » ; mot « parrainage » gardé en sous-titre | Habiller |
| « Défier » / « Sur quoi tu le défies ? » | amis | Garder | Garder |
| « Défi du jour » | amis / courrier | Garder | Garder |
| Invite : « Copier le lien d'invitation » | `/coach/groupes` | Console coach : ne pas toucher | Garder |

### 2.5 Onglet Moi (carnet + page du joueur)

| Texte actuel | Fichier | Proposition | Mode |
|---|---|---|---|
| Titres de niveau : **Nouveau · Apprenti · Curieux · Régulier · Sérieux · Cerveau en construction · Machine à réviser · Stratège · Expert · Légende** | `lib/wallet.ts` l.131 | « Cerveau en construction » et « Machine à réviser » sont modernes (chantier, machine). Proposition : Nouveau → **Recrue** · Apprenti · Curieux → **Curieux** · Régulier → **Assidu** · Sérieux → **Studieux** · Cerveau en construction → **Esprit en éveil** · Machine à réviser → **Rat de bibliothèque** (drôle, doux) · Stratège · Expert → **Érudit** · Légende | Remplacer |
| « Niveau 7 · Argent II » | `lib/joueur.ts` | Garder | Garder |
| **Palmarès · Amis · Collection** | carnet | « Palmarès » = excellent, garder ; « Collection » → « Trésors » ; « Amis » → « Compagnie » | Habiller |
| **Vestiaire Portrait · Badges · Personnages** | carnet | « Vestiaire » : OK (salle des élèves), ajouter « Ma tenue » | Habiller |
| **Badges** | | « Insignes » (plus médiéval, aussi compris) | Remplacer (option) |
| **Série** / flamme | `FlammeAnimee` | « Série » est le mot de l'écran de Duolingo, il reste. Dans les phrases : « ta flamme » / « ne laisse pas ta flamme s'éteindre » (déjà dit) | Garder |
| « Gel de série » | boutique | « Flamme à l'abri » (ou « Gel de série », compris) | Habiller |
| **Record de la semaine** | `lib/moi/record.ts` | Garder | Garder |
| « Paramètres » → `/compte` | page du joueur | « Mon sac » + sous-titre | Habiller |
| **Cadre photo** (`Cadre photo`) | niveau | « Cadre du portrait » | Remplacer |
| **Ma bibliothèque** : Dossiers · Capsules · Fiches | `/carnet` | Déjà bien. « Dossiers » → « Mes cahiers » | Habiller |
| « Ranger ma bibliothèque » | courrier/bibli | Bien, garder (humour doux) | Garder |

### 2.6 Boutique (/tresor)

| Texte actuel | Fichier | Proposition | Mode |
|---|---|---|---|
| **Boost XP · 2 h** | `components/boutique` | Anglicisme + jargon : « Potion de savoir » (la « potion d'XP » existe déjà dans le code : « La potion d'XP ») ; sous-titre « XP ×2 pendant 2 h » | Remplacer |
| **Bouclier de trophées / Bouclier (PVP)** | boutique | « PVP » est du jargon de jeu : « Bouclier d'honneur » (sous-titre : « protège tes trophées ») | Remplacer |
| **Le Marché** (« un achat par jour ») | `catalogue.ts` | Garder, parfait | Garder |
| **Gel de série** | | « Flamme à l'abri » | Habiller |
| **Les capsules** : « Un cours / Une fiche récap / Un quiz / Un outil » | `FicheCapsule.tsx` | « Une fiche récap » est de l'argot : « Une fiche de révision » ; « Un outil » → « Un secret de Marcel » (sens : outil de Marcel) | Remplacer |
| **Les gemmes** (cartes `CarteMagasin`) | | Garder | Garder |
| **Le café de Marcel** : Dosette · Grande tasse · Thermos | boutique | Garder (très bon) | Garder |
| **Recharge** / « Recharger Marcel » | `Recharges.tsx` | « Recharger » est technique : « Réveiller Marcel » est écarté (« jamais de réveil gratuit ») ; proposer « Offrir un café à Marcel » | Remplacer |
| **Pour ton profil** | boutique | « Pour ta tenue » | Remplacer |
| **Passer à Studuel+** | boutique | NE PAS TOUCHER (nom de marque, paiement) | — |
| **Demande d'achat par carte = « Envoyer la demande »** | `FicheCapsule` | Mot de paiement / légal : garder la formule claire | — |

### 2.7 Marcel (le mentor et ses outils)

Les 24 outils (`lib/coach/outils.ts`) sont des phrases d'élève, claires. Garder le libellé, ajouter au besoin un sous-titre de lore sans le remplacer :

| Libellé actuel | Proposition (en sous-titre ou nom d'atelier) |
|---|---|
| « Poser une question » | garder |
| « Faire une fiche » | garder |
| « Résoudre un exo » | « Résoudre un exo » → « Résoudre un exercice » (abréviation familière, mais compréhensible : garder) |
| « Des flashcards » | « Des flashcards » : anglicisme → « Des cartes-mémoire » (nom plus ancien) |
| « Résume mon cours » | garder |
| « Explique-moi » / « Interroge-moi » | garder (ton parlé de Marcel, parfait) |
| « Carte mentale » | « Carte mentale » → « La carte du savoir » (sous-titre : carte mentale) |
| « Planning de la semaine » | « Le plan de la semaine » |
| « Plan pour mon contrôle » | « Plan de bataille pour mon contrôle » (humour doux, sens clair) |
| « Mon calcul pas à pas », « Ma rédaction », « Mes langues », « Mon exposé » | garder |
| « Corrige ma copie » | garder |
| « Traduis et explique », « Le mot juste » | garder (le second est déjà littéraire) |

**Ton de Marcel :** déjà « Moi, c'est Marcel. J'y suis coach depuis… longtemps. » → remplacer « coach » par « mentor » (« J'y suis mentor depuis… longtemps ») et « Et moi, je te coache » → « Et moi, je te guide ». Marcel « dort » : ajouter une ligne de lore (« Marcel s'est endormi sur ses grimoires. Un café, et il repart. »).

### 2.8 Quêtes, courrier, notifications

| Texte actuel | Fichier | Proposition | Mode |
|---|---|---|---|
| **Quêtes du jour** (Revenir · Apprendre · Se tester · Jouer) | `lib/quests.ts` | Déjà dans le ton (« quête »). Garder. | Garder |
| « Se connecter » / « Fait dès que tu ouvres Studuel » | `quests.ts` l.90 | « Se connecter » est de l'outil. Libellé de quête : « Franchir le portail » + détail inchangé | Remplacer |
| « Lire 1 cours » / « Jusqu'en bas — ça compte tout seul » | `quests.ts` l.91 | « Lire 1 cours » : garder (précis) | Garder |
| « Répondre à 10 questions » | `quests.ts` l.92 | Garder | Garder |
| « Faire 1 partie » | `quests.ts` l.93 | « Faire 1 partie » → « Jouer une partie » (plus naturel) | Remplacer |
| « Quête accomplie » | amis/quêtes | Garder | Garder |
| **Courrier** : « Ta boîte est vide » / « Rien ici pour l'instant » | `components/courrier` | « Aucun courrier » → « Pas de lettre pour le moment. Le facteur de l'Académie repassera. » | Habiller |
| « L'équipe Studuel », « Coach Karim » (aperçus) | `components/courrier` | « L'équipe Studuel » → « Le secrétariat de l'Académie » (ton, mais attention : l'expéditeur réel est l'équipe) | Habiller |
| « Tout marquer comme lu » | courrier | Garder | Garder |
| « Tes révisions t'attendent » / « X à revoir aujourd'hui. C'est le bon moment ! » | `lib/notifications.ts` l.41-42 | « Le parchemin des révisions t'attend » ; corps : « X cartes à revoir. Marcel a préparé ta séance. » | Habiller |
| « Une petite session suffit à la garder en vie 🔥 » | `lib/notifications.ts` l.61 | « session » est anglais ; « Une courte séance suffit à garder ta flamme vivante » (l'émoji peut rester dans la notification système) | Remplacer |
| « Ton coffre d'équipe est ouvert ! » | `lib/notifications.ts` l.73 | « Le coffre de la compagnie est ouvert ! » | Remplacer |
| **Activer les rappels** (`NotificationsOptIn`) | | « Recevoir les messages de Marcel » (sous-titre : activer les rappels) | Habiller |

### 2.9 Onboarding et coulisses d'entrée (voir § 3 pour le lore)

| Texte actuel | Fichier | Proposition | Mode |
|---|---|---|---|
| « Il y a une académie où réviser n'a jamais été une corvée. » | cinématique | Garder tel quel | Garder |
| « Alors, tu entres ? Dis-moi ta classe, je m'occupe du reste. » | `/bienvenue` | Bonne voix de Marcel, garder | Garder |
| « Créer mon compte » / « Crée ton compte pour garder ta série… » | onboarding | « Inscris-toi au registre de l'Académie » en titre, bouton « Créer mon compte » inchangé | Habiller |
| « Défie tes amis », « Le défi », « Réussir mes contrôles », « Remonter ma moyenne » (objectifs) | `lib/welcome.ts` l.338 | Garder : ce sont des objectifs réels de l'élève, clarté d'abord | Garder |
| Rythmes « Détente · Régulier · Sérieux · Intense » | `lib/welcome.ts` l.421-443 | Proposition : « Promenade · Marche régulière · Expédition · Grande quête » (le sens reste lisible : lent → intense) ; à tester avec des élèves | Remplacer (option) |
| « Bien joué ! », « Bonne base ! », « C'est parti » | `lib/welcome.ts` | Garder (ton chaleureux) | Garder |
| Source « TikTok · Instagram · YouTube · App Store » | `lib/welcome.ts` l.329 | Données marketing : NE PAS toucher | — |
| « Tour guidé » devenu « premiers pas » | découverte | Nom de lore : « Le tour de l'Académie » | Habiller |
| « Débloqué » (section de la fête de niveau) | `FeteNiveau` | « Nouvelle salle ouverte » pour un écran, « Nouveau butin » pour un objet | Habiller |
| « Level Up » (commentaires de code, fête de niveau) | `FeteNiveau` | À l'écran : « Niveau supérieur ! » — vérifier qu'aucun « Level Up » n'est visible (à vérifier) | À vérifier |

## 3. Les coulisses : ce qu'on peut raconter

Les coulisses sont l'endroit idéal pour le lore : l'élève y passe peu de temps, le texte est court, un sourire suffit.

### 3.1 Erreurs et filets de sécurité (`components/EcranPepin.tsx`)

| Cas | Texte actuel | Proposition |
|---|---|---|
| Plantage | « Oups, ça a cassé » / « Ce n'est pas de ta faute. Réessaie ; si ça recommence, reviens à l'accueil — on est prévenus et on répare. » | « Un sort a mal tourné » / « Ce n'est pas de ta faute. Réessaie ; si ça recommence, retourne à l'entrée de l'Académie — les sorciers de garde sont prévenus et réparent. » |
| Hors connexion (`EcranPepin`, `public/hors-ligne.html`) | « Tu es hors connexion » / « Reconnecte-toi, puis réessaie. Les cours que tu as déjà ouverts restent lisibles. » | « Le pont-levis est levé » / « Reviens quand la connexion est rétablie. Les cours que tu as déjà ouverts restent lisibles. » (garder la phrase utile entière) |
| Page introuvable | « Cette page n'existe pas » / « Le lien est peut-être ancien, ou la page a changé de place. » | « Cette salle n'existe pas » / « Le lien est peut-être ancien, ou la salle a changé de place. Marcel te ramène à la cour. » |
| Bouton principal | « Réessayer » / « Retour à l'accueil » | « Réessayer » et « Retour à la cour » (sens clair) |
| Signaler (réponse de l'IA) | « Signaler » | Garder (légal/modération) |

### 3.2 Chargement et écran de lancement

- `public/lancement.html` + `SplashScreen` : le seul mot est « Studuel ». Proposition : une phrase tournante sous le logo, tirée d'une liste de 8-10 (une par chargement, jamais deux fois de suite) :
  - « Marcel allume les lanternes… »
  - « On aiguise les crayons… »
  - « Le gardien cherche ses clés… »
  - « Les corbeaux apportent le courrier… »
  - « Un elfe millénaire raconte encore la même bataille… »
  - « Le troll de musique accorde ses flûtes… » (les flûtes couinent, déjà dans le lore)
  - « La cantine sert la soupe d'écuelles. »
- Tout reste en texte court, une seule phrase, jamais bloquante. Principe : la phrase de chargement peut aussi donner une VRAIE petite astuce (« Un cours lu jusqu'en bas compte tout seul »).
- Les `Skeleton` d'onglets ne portent pas de texte : laisser.

### 3.3 Écrans vides (à raconter, pas à excuser)

| Écran | Texte actuel | Proposition |
|---|---|---|
| Courrier vide | « Ta boîte est vide » | « Pas de lettre pour le moment. Le facteur repassera demain. » |
| Aucun ami | « Aucun ami » | « Ta compagnie est vide. Invite un camarade pour partir ensemble. » |
| Aucun duel | « Aucun duel encore » | « Aucun combat encore. La cour d'honneur t'attend. » |
| Aucun gardien en vue | « Aucun gardien en vue » | « Le gardien dort encore. Révise, il se réveillera. » (cohérent avec la rareté 576) |
| Pas de badge | « Pas encore de badge. » | « Pas encore d'insigne. Le premier est à portée de main. » |
| Pas de fiches | « Débloque ta première fiche » | Garder (l'écrin de fiche est déjà dans le ton) |
| Programme terminé | « Programme terminé » | « Programme terminé : bravo, héros ! » |
| Tout est encaissé | « Tout est encaissé : ouvre-le ! » | Garder |
| Rien pour l'instant | « Rien pour l'instant » | « Rien pour l'instant. Marcel te préviendra. » |

### 3.4 Notifications, push, e-mails (vérifier : `lib/notifications.ts`, e-mails Supabase)

- Appui sur la **série** : « Ta flamme s'éteint ce soir » (déjà dans l'esprit) ; garder le sens, ajouter un mot de Marcel.
- **Coffre ouvert**, **ligue clôturée** : formule « Le facteur de l'Académie t'apporte… ».
- **Ami qui te défie** : « Léa te défie ! » (garder).
- E-mails de connexion/reset (`app/reset-password`, formulaires de login) : NE PAS toucher au texte légal et de sécurité ; on peut ajouter une ligne d'en-tête « L'Académie » mais le lien et la consigne restent d'abord.

### 3.5 Onboarding : l'histoire d'arrivée

La cinématique a déjà 5 tableaux. Cadre de lore proposé (sans changer la structure) :
1. L'Académie au petit matin dans la brume (existant).
2. Les enfants de tous les peuples franchissent la porte (elfes, nains, orcs, gobelins, trolls, centaures).
3. Marcel accueille l'élève : « Moi, c'est Marcel. J'y suis mentor depuis… longtemps. »
4. Le choix du **portrait** devient « Choisis ton héros » (étape existante `ChoixPortrait`, titre à changer seulement).
5. La **classe** = la salle où l'élève entre (« Alors, tu entres ? »).
Étape suivante (hors périmètre ici) : le choix du peuple (voir mémoire `heros-eleves-qualite` : plus de races façon Terres d'Arran ; un garçon doit être fier de son perso).

### 3.6 Le Proviseur, boss final

- Il remplace Nox le dimanche et clôt la saison. Écran « RECHERCHÉ / DÉBUSQUÉ » : lui reçoit « DIRECTEUR / CONVOQUÉ » ? À éviter : trop effrayant. Plutôt « CONVOQUÉ AU BUREAU DU PROVISEUR » avec un humour doux (« Il lit tous les bulletins à la fois »).
- Phrase de victoire sur un gardien : « Le gardien rend les armes. Il te félicite d'un hochement de moustache. » (selon le prof).

## 4. Branding

### 4.1 Noms de lieux à trouver

Rien n'est choisi. Trois pistes par lieu (à valider, vérifier qu'aucun nom ne copie une œuvre) :

| Lieu | Pistes | Ma recommandation |
|---|---|---|
| Le **royaume** | Aurélande · Brumeterre · Les Marches d'Ardoise | **Aurélande** (doux, lumineux, sans calque) |
| L'**Académie** | Hautecime · L'Académie des Trois Tours · Violetour | **Hautecime** pour le nom, « l'Académie » dans l'usage courant (toits violets déjà dans l'image) |
| La **cour d'honneur** (l'arène) | La Cour Dorée · La Cour d'honneur | **La cour d'honneur** (déjà utilisé) |
| Les **royaumes voisins** (langues) | Îles de Brume (anglais, déjà au lore) · Monts du Nord (allemand) · Terres du Soleil (espagnol) | Garder les trois du lore |
| L'**Ancien Empire** | (latin/grec, déjà au lore) | Garder |
| Le **bureau de Marcel** | « La Tour de Marcel » ? | « Le bureau de Marcel » reste (décor peint) |

### 4.2 Vocabulaire maison (18 mots)

À employer dans les titres, sous-titres et phrases de Marcel. Le mot officiel reste TOUJOURS lisible à côté au début.

| Mot maison | Remplace / complète | Contexte |
|---|---|---|
| **l'Académie** | l'app | partout dans le lore |
| **la cour (d'honneur)** | l'arène / l'accueil | Défi, retour à l'accueil |
| **la compagnie** | les amis | onglet Amis, coffre |
| **le gardien** | le boss (prof) | Traque |
| **le Proviseur** | boss final | Traque, saison |
| **la quête** | la mission du jour | quêtes |
| **le butin** | les récompenses | ruban de récompenses |
| **la flamme** | la série | série |
| **le sablier** | le chrono | lecture, quiz |
| **le parchemin** | le document, la fiche | fiches, annales |
| **le grimoire** | le cahier, l'encyclopédie | bibliothèque |
| **le marque-page** | « reprendre » | boucle ouverte |
| **la potion** | le boost | boutique |
| **le sceau** | la validation / la confirmation | écrin de fiche, paiements (OK pour décor uniquement) |
| **le facteur** | les notifications | courrier, push |
| **la tenue** | le profil | vestiaire |
| **le héros** | l'élève | titre de page du joueur |
| **les épreuves** | les annales, les examens | annales, mode examen |

### 4.3 Ce qui NE doit PAS changer

- **Studuel+** (nom de l'abonnement) et tout le vocabulaire du paiement : « Passer à Studuel+ », « abonnement », « euros », « paiement », « demande d'achat », « facture », « annuler » : mots clairs pour le parent payeur.
- **Mots légaux** : CGU, confidentialité, mentions légales, `/supprimer-mon-compte`, « Signaler », consentement parental, « Créez votre espace parent » (page parents).
- **Noms de matières officiels** : Mathématiques, Français, Histoire-Géographie, SVT, Physique-chimie, Anglais, Allemand, Espagnol, Latin, Grec, SES, NSI, Enseignement scientifique, Musique, EMC, Sport. Le lore donne un prof à chacune, mais l'intitulé reste celui du programme.
- **Noms de classes** : 6e → Terminale, brevet, bac.
- **Console coach / admin** (`/coach`, `/admin`) : outils de travail, pas de décor.
- **Le CTA DUEL** et la **rangée de combat** (règle du projet).
- **Boutons d'outil neutres** : Se connecter, Réessayer, Annuler, Continuer, Retour, Confirmer.
- **Sources marketing** de l'onboarding (TikTok, Instagram…) et l'étiquette « App Store ».
- **Les unités** (« XP », « niveau », « trophées ») gardent leur forme dans les chiffres ; seuls leurs noms de phrase peuvent s'habiller (voir § 4.4).

### 4.4 Monnaies et objets : où habiller, où garder

| Terme | Verdict | Remarque |
|---|---|---|
| **XP** | Garder le sigle (éclair `XpIcon`, règle du projet) ; en phrase longue on peut écrire « points de savoir » | Sens d'abord |
| **Gemmes** | Garder | Déjà de la fantasy |
| **Café(s)** | Garder | Marcel au café |
| **Trophées** | Garder | Compris |
| **Studuel+** | NE PAS toucher | Marque |
| **Ligue / Divisions** | Garder « Ligue » ; « Division » → « Rang » dans les titres d'écran ; échelons métaux gardés | « Division » est un mot de championnat sportif, hors ton |
| **Quêtes / coffres / gardiens** | Garder | Déjà du lore |
| **Boost XP** | « Potion de savoir » | Anglicisme |
| **Bouclier (PVP)** | « Bouclier d'honneur » | Jargon |

## 5. Garde-fous de ton (rappels pour l'écriture)

- **Pas de violet sur les personnages** : peau, vêtements, créatures. Le violet est réservé aux toits de l'Académie, aux boutons d'action et à la marque.
- **Rien d'effrayant** : pas de sang, pas de monstres menaçants, pas de « tuer » / « mort ». Un gardien « se rend », « repart », « s'endort ». Une défaite ne retire rien.
- **Humour doux** : le prof absorbé qui ne voit pas l'effet qu'il produit ; pas de moquerie envers un peuple (orcs, trolls, gobelins sont des élèves comme les autres). Le ton respectueux des figures historiques et chrétiennes de l'encyclopédie ne change pas.
- **Pas de calque** : aucun nom de lieu ou de créature copié d'une œuvre existante.
- **Une phrase = un sens.** Si un libellé de lore demande une explication, c'est le libellé qui est mauvais.
- **Longueur** : les boutons gardent leur taille (mots courts). Les phrases de coulisses tiennent en une ligne sur mobile.

## 6. Ordre de chantier en trois lots

### Lot 1 — Le plus visible (1-2 jours, zéro migration)
Libellés d'écran seulement, tout en chaînes de caractères :
1. **Titres de niveau** (`lib/wallet.ts`) : Recrue · … · Esprit en éveil · Rat de bibliothèque · Érudit.
2. **Noms de modes et de jeux** : Blitz 60s → Éclair 60 s ; Boss de la semaine → Gardien de la semaine ; Relais 2v2 → Relais à deux (`lib/defi-modes.ts`, `lib/jeux/catalog.ts`).
3. **Boutique** : Boost XP → Potion de savoir ; Bouclier (PVP) → Bouclier d'honneur ; « Une fiche récap » → « Une fiche de révision » ; « Pour ton profil » → « Pour ta tenue ».
4. **Coulisses** : les trois textes d'`EcranPepin`, `public/hors-ligne.html`, les écrans vides du § 3.3, le facteur du courrier.
5. **Quêtes** : « Se connecter » → « Franchir le portail », « Faire 1 partie » → « Jouer une partie ».
6. **Marcel** : « coach » → « mentor » côté élève (cinématique, catalogue de découverte).
→ Chaque libellé est vérifié par les tests existants (`lib/quests.test.ts`, `FeteNiveau.test.tsx`, etc.) ; à adapter dans le même commit.

### Lot 2 — Le branding et les sous-titres (3-5 jours)
1. **Choisir les noms** : royaume, Académie, voisins (§ 4.1) — décision de Lucas AVANT toute écriture.
2. Titres de page habillés : Moi → « Mon carnet d'aventurier », Paramètres → « Mon sac », « La Ligue de l'Académie », « Ma compagnie ».
3. **Phrases de chargement** du lancement (§ 3.2), 8 à 10 phrases dans un fichier de données pur `lib/ambiance/chargement.ts` + test (aucune répétition consécutive).
4. **Onglets de Marcel** : Radar → Carte du savoir, Outils → L'atelier, Examen → Les épreuves ; sous-titres de la bibliothèque (Dossiers → Mes cahiers).
5. **Notifications push** (`lib/notifications.ts`) : tournures dans le ton ; tester l'envoi réel sur un navigateur.
6. **Ligue** : « Division » → « Rang » dans les titres d'écran (pas dans le code ni les colonnes SQL).
→ Un petit module pur `lib/ambiance/*` (vocabulaire, phrases) avec tests Vitest, importé par les composants, pour ne pas disperser le vocabulaire.

### Lot 3 — Le plus fin (au fil de l'eau)
1. **Écran de connexion** et e-mails de connexion/reset : en-tête « L'Académie », sans toucher au contenu de sécurité.
2. **Rythmes d'onboarding** (Détente → Promenade…) : tester avec quelques élèves avant d'adopter.
3. **Le Proviseur** (écran de convocation, victoire, boss final de saison) et les phrases de victoire par gardien.
4. **Les peuples** : choix du peuple au portrait, tenue de l'Académie dans les illustrations (rappel du lore : tunique brune, ceinture de toile, sac de cuir, couverture roulée).
5. **Pages légales** : une ligne d'en-tête, JAMAIS de réécriture du fond.
6. **Journal** : consigner le vocabulaire retenu dans `docs/journal/design.md` (une ligne dans `CLAUDE.md`).
7. **Accessibilité** : vérifier que chaque libellé habillé garde un `aria-label` clair (le sens d'abord, aussi pour un lecteur d'écran).

## 7. Décisions attendues de Lucas

1. Les noms : royaume (Aurélande ?) et Académie (Hautecime ?).
2. « Coach » → « mentor » côté élève : oui/non (la console `/coach` ne change pas).
3. « Division » → « Rang » dans les titres d'écran : oui/non.
4. « Éclair » ou « express » comme famille de noms de jeux (cohérence).
5. Les nouveaux titres de niveau (§ 2.5).
6. Les phrases de chargement : lesquelles garder, ton plus ou moins drôle.
7. Rythmes d'onboarding : habiller ou laisser.
8. Jusqu'où habiller le Courrier (« le facteur ») et les notifications.
