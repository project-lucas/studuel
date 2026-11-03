# Cadrage : les étudiants arrivent (le supérieur)

> 03/11/2026. Chantier mené en autonomie pendant l'absence de Lucas. Ce qui est livré, ce qui a été décidé sans lui (§ 4), ce qui reste à faire (§ 6). Rien n'est commité.

Lucas : « inspire-toi de notre travail, des templates actuels, ne réinvente pas la roue ». Ses demandes :
- le Pareto des secteurs, des cursus et des matières ;
- des icônes de matières dans le thème de Studuel, mises par défaut ;
- un onboarding où « étudiant en droit L1 » reçoit les matières de son année, qu'il trie ensuite au stylo ;
- le contenu du Pareto d'abord (cours qu'on peut cacher, exercices, quiz, fiches) ;
- UN boss par grand secteur ;
- les modes de jeu.

## 1. Le Pareto

Parcoursup 2025, nombre de vœux par formation (sources : Parcoursup, l'Étudiant, Diplomeo, Digischool) :

| Cursus | Vœux 2025 | Pourquoi d'abord |
|---|---|---|
| PASS (santé) | plus de 840 000 | premier vœu de France, l'année la plus redoutée |
| Droit | 359 728 | licence la plus demandée, cours très « par cœur » |
| STAPS | environ 155 000 | public sportif, déjà proche de nos joueurs de basket (coaching, 594) |
| Psychologie | 153 853 | grosse demande, beaucoup de notions à mémoriser |
| Économie-gestion | 146 431 | prolonge les SES du lycée |

À elles cinq, ces formations couvrent l'essentiel des primo-entrants en licence. La **vague 2**, non commencée, comprend :
- biologie ;
- LEA ;
- histoire ;
- AES ;
- informatique ;
- sociologie.

## 2. Les cursus et leurs matières

La source de vérité est `lib/superieur/cursus.ts` : 5 cursus, 13 classes et 60 matières, chaque matière avec son programme par année. Tout le reste est dérivé de ce fichier, à commencer par la migration 606, que `scripts/superieur-matieres-sql.mjs` génère depuis lui.

- **Droit** (L1, L2, L3), gardien Thémistor.
  - L1 : Droit civil · Droit constitutionnel · Histoire du droit et des institutions · Institutions juridictionnelles · Science politique · Introduction à l'économie · Méthodologie juridique.
  - L2 : Droit civil · Droit administratif · Droit pénal · Finances publiques · Droit des affaires · Droit de l'Union européenne · Méthodologie juridique.
  - L3 : Droit civil · Droit administratif · Droit pénal · Droit des affaires · Droit international public · Droit du travail · Libertés fondamentales · Droit fiscal · Procédure civile · Méthodologie juridique.
- **Santé, PASS**, gardien Asclépion.
  - Chimie générale et organique · Biochimie · Biologie cellulaire · Biologie moléculaire et génétique · Biophysique · Physiologie · Anatomie · Histologie et embryologie · Biostatistiques · Santé, société, humanité · Initiation à la connaissance du médicament.
- **STAPS** (L1, L2, L3), gardien Coach Turbo, celui du Sport.
  - L1 : Anatomie fonctionnelle · Physiologie de l'exercice · Biomécanique · Psychologie du sport · Sociologie et histoire du sport · Théorie de l'entraînement.
  - L2 : ajoute Contrôle et apprentissage moteur, et retire l'Anatomie fonctionnelle.
  - L3 : ajoute Management du sport et Activité physique adaptée.
- **Psychologie** (L1, L2, L3), gardienne Dame Psyché.
  - L1 : Psychologie du développement · Psychologie sociale · Psychologie cognitive · Neurosciences et psychophysiologie · Psychologie clinique et psychopathologie · Méthodologie et statistiques · Histoire et épistémologie de la psychologie.
  - L2 : ajoute la Psychologie différentielle et retire l'Histoire et épistémologie.
  - L3 : ajoute la Psychologie du travail.
- **Économie-gestion** (L1, L2, L3), gardien Krach, celui des SES.
  - L1 : Microéconomie · Macroéconomie · Mathématiques pour l'économie · Statistiques et probabilités · Comptabilité · Management des organisations · Histoire des faits économiques.
  - L2 : Microéconomie · Macroéconomie · Mathématiques pour l'économie · Statistiques et probabilités · Comptabilité · Marketing · Finance d'entreprise · Monnaie et banque · Économie internationale.
  - L3 : Microéconomie · Macroéconomie · Économétrie · Management des organisations · Finance d'entreprise · Économie internationale · Économie publique · Contrôle de gestion.

Les programmes suivent les maquettes de licence les plus courantes. Ils varient d'une faculté à l'autre, et l'étudiant fait le tri au stylo.

## 3. L'architecture : on a reproduit les templates existants

- **Une classe par année et par cursus** (« L1 droit », « L2 droit »…, « PASS »).
  - Elles sont déclarées dans `GRADE_LEVELS` comme l'a été la voie techno, et forment un quatrième cycle, `superieur`, dans `lib/grades.ts`.
  - Le contenu vit à la classe EXACTE (`chapters.level = 'L1 droit'`), sans alias.
  - Une matière sans chapitre s'affiche « Bientôt », comme partout ailleurs.
- **Les matières de l'année sont toutes cochées par défaut** (`PROGRAMME_PAR_CLASSE`, `aChoisir` vide). L'étudiant retire ce qu'il ne suit pas avec le stylo de Réviser (« Éditer » → `profiles.selected_subjects`).
- **L'onboarding** : l'étape « Ta classe » affiche, sous « Études supérieures », un bloc par cursus avec ses années (`ClassesSuperieur` dans `components/welcome/WelcomeSteps.tsx`).
- **Les icônes de matières** :
  - 60 vignettes peintes avec Higgsfield (Nano Banana 2.1, avec trois vignettes existantes en référence de style). Les originaux sont dans `assets-sources/superieur/vignettes/`.
  - `scripts/vignettes-superieur.mjs` intègre les nouvelles vignettes au lot existant sans déplacer la cible d'encre des 25 vignettes déjà validées (`echellePour`).
  - L'icône de trait de chaque matière est celle de son secteur (`ICONE_SECTEUR`, `lib/subject-style.ts`).
- **Les boss : un gardien par SECTEUR**.
  - Le droit, la santé et la psychologie ont un prof neuf de l'Académie, dans `GARDIENS_SUP` (`lib/bosses.ts`) :
    - Thémistor, « le Lion de la Haute Cour » ;
    - Asclépion, « le Héron de l'Infirmerie » ;
    - Dame Psyché, « la Phalène des Songes ».
  - L'économie garde Krach et STAPS garde Coach Turbo.
  - Le routage se fait par nom ou par slug EXACT (`GARDIEN_SUP_PAR_MATIERE`), jamais par regex : « Histologie » aurait sinon été attrapé par `/hist/`.
  - Les nouveaux gardiens restent hors d'`ALL_BOSSES`, ce qui laisse intacte la rotation du boss de la semaine et son miroir SQL.
  - Chacun a son jour de traque : Thémistor le mardi, Dame Psyché le mercredi, Asclépion le jeudi (`lib/traque.ts`, migration 607).
- **Le contenu** suit la chaîne `scripts/seed-contenu.mjs` (un module par matière et par année, dans `scripts/contenu/sup-*.mjs`).
  - Le **gras** d'un cours est ce que le mode mémoire cache : c'est « la possibilité de cacher » demandée par Lucas.
  - Le modèle est le Droit civil L1 (migration 608) : 11 chapitres, des cours au niveau licence avec un cas pratique en syllogisme, 12 questions par chapitre.
- **Les modes de jeu** :
  - Les modes de l'arène (Blitz, Chrono, Survie, Boss, Duel classé) marchent seuls dès qu'une matière a des quiz.
  - Les jeux de salon suivent le moule des salons. Le modèle est **Quel tribunal ?** (Institutions juridictionnelles, L1 droit, `lib/jeux/quel-tribunal.ts`, migration 609) : une affaire, quatre juridictions, une banque graduée en trois paliers et des leurres écrits à la main.
  - Un salon du supérieur ne se montre qu'aux étudiants dont l'année suit la matière (`salonVisiblePour`, `lib/jeux/catalog.ts`). Un collégien ne le voit ni dans sa roulette de duel ni dans « Modes de jeu ».

## 4. Les décisions prises sans Lucas, à confirmer

1. Les cinq cursus du Pareto, et pas un de plus.
2. Pas de culture générale ni d'anglais obligatoire au supérieur pour l'instant.
3. **Pas de clan pour un étudiant.** Il n'y a pas d'école « université » en base : un étudiant est replié sur `'college'`, comme le fait déjà le SQL de la 322. Le ton des verdicts reste celui du lycée.
4. Le PASS est seul sur sa ligne dans la grille des classes.
5. Les noms des trois nouveaux gardiens et leurs jours de traque.
6. Krach garde l'économie-gestion et Coach Turbo garde STAPS, plutôt que deux profs de plus.
7. L'icône de trait d'une matière est celle de son secteur (la vignette peinte, elle, est propre à chaque matière).
8. Le catalogue des salons était « figé sans décision de Lucas ». Son « il faudra également créer les modes de jeu » est pris comme cette décision, pour UN jeu modèle.

## 5. Les migrations à exécuter, dans l'ordre

| N° | Fichier | Ce qu'elle fait |
|---|---|---|
| 606 | `schema/606_matieres_superieur.sql` | les 60 matières et leurs classes |
| 607 | `schema/607_traque_gardiens_superieur.sql` | `traque_en_chasse` connaît les trois gardiens |
| 608 | `contenu/608_sup_droit_civil_l1.sql` | Droit civil L1 : 11 chapitres, 11 cours, 132 questions |
| 609 | `schema/609_jeu_quel_tribunal.sql` | Quel tribunal ? dans `game_catalog` et `mode_catalog` |

La 606 passe avant la 608 et la 609, qui supposent la matière en base.

## 6. Les tâches

✅ fait · 🟡 en cours · ⬜ à faire

**A. Le socle**
- ✅ Les classes, le cycle et les libellés (`lib/types.ts`, `lib/grades.ts`, `lib/superieur/cursus.ts`).
- ✅ Les programmes par classe, cochés par défaut (`lib/programme-classes.ts`).
- ✅ L'onboarding, étape « Ta classe ».
- ✅ La migration 606.
- ⬜ L'onboarding « jouer d'abord » (`lib/welcome.ts`) : la question de placement et la première partie sont encore celles du lycée pour un étudiant. Prévoir un placement par cursus.
- ⬜ Le bandeau et `/joueur` : vérifier dans l'app la puce « L1 Droit » sur un vrai compte étudiant.
- ⬜ Le clan universitaire (une école « université » en base, une migration). À décider.

**B. Les icônes des matières**
- ✅ Les 60 vignettes peintes, détourées et servies (`public/images/matieres/vignettes/<slug>.webp`).
- ✅ Les icônes de trait par secteur.
- ⬜ Deux vignettes ont été repeintes après une première version écartée (anatomie, APA, dans `assets-sources/superieur/ecartees/`). Lucas doit regarder la planche.

**C. Les boss**
- ✅ Thémistor, Asclépion et Dame Psyché : scène 16:9, portrait en pied 9:16 et buste détouré (`public/images/boss/<id>-prof{,-scene,-pied}.webp`).
- ✅ Les jours de traque (`lib/traque.ts` + 607).
- ⬜ **Les sprites de combat** des trois gardiens (`scripts/combat-sprites.mjs`, `COMBATTANTS_BOSS`). En attendant, `combattantBoss` rend `null` et la Traque reprend l'ancien affichage, sans casser.
- ⬜ Leur attaque fétiche (`lib/combat/*`).

**D. Le contenu** (un agent à la fois, sur le modèle du Droit civil L1)
- 🟡 Droit L1 : Droit civil ✅ (608). Restent Droit constitutionnel, Histoire du droit, Institutions juridictionnelles, Science politique, Introduction à l'économie et Méthodologie juridique.
- ⬜ Le PASS : les 11 matières, la plus grosse demande.
- ⬜ Psychologie L1, Économie-gestion L1, STAPS L1.
- ⬜ Les L2 et L3 de chaque cursus.
- ⬜ Les fiches de révision PDF (chaîne `scripts/fiches-rendre.mjs` → R2), une fois les cours en base.
- ⬜ Le cahier d'exercices façon manuel (`contenu/exercices/`) : cas pratiques en droit, exercices de calcul en éco, en biostatistiques et en biophysique.
- ⬜ Les annales : pas d'annales nationales à la fac. Remplacer par des sujets types de partiels écrits par Studuel.

**E. Les modes de jeu**
- ✅ Les modes de l'arène, automatiques dès que les quiz sont en base.
- ✅ Quel tribunal ? (droit, migration 609), le modèle.
- ⬜ Les jeux suivants, un par cursus, sur des moteurs existants :
  - **PASS** : « Os et muscles », sur le moteur d'Anatomie express (la planche est un paramètre, `lib/jeux/planches.ts`) ; « Quelle molécule ? » (biochimie, groupes fonctionnels).
  - **Psychologie** : « Qui a dit ? » (Piaget, Freud, Skinner, Bandura, Vygotski… : une théorie, quatre auteurs, le moule de Qui a composé ?).
  - **Économie** : « Courbes folles » (offre et demande : qui se déplace ?) et « Quel indicateur ? » (PIB, inflation, chômage).
  - **STAPS** : « Muscles express » déjà en Sport, à ouvrir aux L1 STAPS ; « Quelle filière énergétique ? ».
  - **Droit L2** : « Délit ou crime ? » (qualification pénale) et « Quel acte administratif ? ».
- ⬜ La scène et le talon peints de Quel tribunal ? (`GAME_SCENE_IDS`, `GAME_TALON_IDS`). Sans eux, le billet affiche la vignette de la matière et l'emoji ⚖️.

**F. Après la vague 1**
- ⬜ Vague 2 : biologie, LEA, histoire, AES, informatique, sociologie.
- ⬜ La boutique et Studuel+ côté étudiant : prix, prépa des concours (déjà la piste « prépa du supérieur » dans `docs/CADRAGE-STUDUEL-PLUS.md`).

## 7. Les points de droit relus

Le Droit civil L1 a été écrit de mémoire par un agent. Les dates et articles qu'il a signalés comme douteux ont été vérifiés :
- Jacques Vabre, 24 mai 1975 ;
- Nicolo, 20 octobre 1989 ;
- Sarran, 30 octobre 1998 ;
- Saint-Chamond, Cass. civ. 2e, 28 janvier 1954 ;
- seuil de la preuve écrite à 1 500 € ;
- art. 238 (un an) ;
- art. 262-1, 321, 333, 342-11, 372-2, 373-2-9 et 388-1.

Un point a été corrigé : le divorce d'un majeur en tutelle ne relève pas de la simple information du protecteur, le majeur y est représenté par son tuteur. **Une relecture par un juriste reste souhaitable avant d'ouvrir la matière à des étudiants.** Il en va de même pour les 33 affaires de Quel tribunal ? (droit au 03/11/2026 : tribunal judiciaire depuis 2020, cour criminelle départementale depuis 2023).
