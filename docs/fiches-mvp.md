# Les fiches de révision MVP — lesquelles, combien, dans quel ordre

*13/10/2026. Lucas : « nous devons commencer à créer les fiches de révision via Nano Banana (crédit 2), d'abord 3e, 2de, 1re, Terminale ; des fiches pour tous les chapitres ne sont pas nécessaires ; il me reste 691 crédits ; définis le nombre et lesquelles de quelles matières on doit prioriser ».*

## Le principe

Une fiche de révision ne vaut que là où il y a une **épreuve** : le brevet en 3e, le bac anticipé en 1re (français écrit + oral, et depuis la session 2027 l'épreuve anticipée de maths), le bac en Terminale (philosophie pour tous, les deux spécialités, le Grand oral). La 2de n'a pas d'examen : elle n'a droit qu'à un socle de maths et aux deux vocabulaires (poésie, théâtre) qui servent en 1re.

Dans chaque matière on prend **les chapitres qui tombent**, pas le programme entier : en maths de 3e, Thalès et Pythagore avant « Se repérer sur la sphère terrestre » ; en SVT de Tle, le brassage des génomes avant la domestication des plantes. Les langues, l'EPS, les arts, les options et les séries technologiques n'en ont pas dans ce lot (le catalogue en compte 1 100 sur 2 301 ; on y reviendra matière par matière si ces fiches se vendent).

## Le budget

- **691 crédits Higgsfield**, Nano Banana à **2 crédits l'image** (le 2k, nécessaire pour qu'une page de texte reste lisible).
- Une fiche **entière** générée par l'IA (texte compris) se rate souvent : accents, formules, un mot inventé. Il faut compter **une image sur trois à refaire** → une fiche coûte ~2,7 crédits en pratique.
- Donc **~250 fiches au plus**, à condition de ne rien générer d'autre entre-temps.

Deux paliers, pour ne pas finir à sec au milieu des spécialités :

| Palier | Fiches | Crédits (avec les reprises) | Ce que c'est |
|---|---|---|---|
| **P1 — l'épreuve** | **151** | ~400 | ce qui tombe au brevet et au bac, chaque année |
| **P2 — le complément** | **109** | ~290 | le reste des matières à examen, la 2de, les spécialités de 1re |
| Total | 260 | ~690 | tout le budget |

**Ordre de production : P1 en entier, puis P2 dans l'ordre du tableau** — si le taux de reprise dépasse un tiers, c'est la fin de P2 qui saute (maths expertes, NSI, 2de), jamais le brevet ni le bac.

> Alternative qui double le lot : l'IA ne dessine que l'**illustration** (la figure, la scène — 1,5 crédit en 1k, presque jamais à refaire) et le **texte reste composé en HTML** (le gabarit Thalès de `assets-sources/fiches/gabarit-pdf/`), donc toujours juste et modifiable. Même budget → ~400 fiches. À décider avant la série ; le premier exemplaire sert de modèle dans les deux cas.

## Répartition

| Niveau | P1 | P2 | Total | Chapitres au catalogue |
|---|---|---|---|---|
| 3e (brevet) | 58 | 39 | 97 | 307 |
| 2de | 0 | 12 | 12 | 336 |
| 1re (bac anticipé) | 24 | 30 | 54 | 947 (dont 260 fiches de lecture) |
| Terminale (bac) | 69 | 28 | 97 | 711 |
| **Total** | **151** | **109** | **260** | 2 301 |

Les titres ci-dessous sont **ceux de la base** (`chapters.title`), pour que la production retrouve chaque chapitre sans ambiguïté.

---

## 3e — le brevet (97)

Pondération du brevet : maths 100, français 100, histoire-géo-EMC 50, sciences 50 (deux matières sur SVT, physique-chimie, technologie, tirées au sort).

### Maths — P1 : 20 · P2 : 6 (sur 28)

**P1**
- Utiliser le théorème de Thalès
- Le théorème de Pythagore et sa réciproque
- Trigonométrie dans un triangle rectangle
- Triangles semblables
- L'homothétie
- Sphère et boule
- Sections planes de solides
- Transformations du plan : symétries, translation, rotation
- Puissances d'un nombre et écriture scientifique
- Nombres premiers et fractions irréductibles
- Calcul littéral et équation
- Identités remarquables : développer, factoriser, démontrer
- Équations produits nuls, inéquations et mise en équation
- Grandeurs composées : vitesse, débit, masse volumique
- Aires, volumes et conversions : le formulaire du brevet
- Agrandissement et réduction : échelles, aires et volumes
- Caractéristiques d'une série statistique
- Les probabilités
- Comprendre et utiliser la notion de fonction
- Les fonctions affines

**P2**
- Fonction linéaire et proportionnalité
- Pourcentages et évolutions
- La racine carrée et l'équation x² = a
- Division euclidienne, diviseurs et problèmes de partage
- Programmer avec Scratch : boucles, conditions, variables
- Méthode : réussir l'épreuve de maths du brevet

### Français — P1 : 10 · P2 : 6 (sur 18)

**P1**
- Les principales figures de style
- Les différents types de discours
- Les différences de focalisation dans un texte
- Les valeurs du présent, du passé simple, de l'imparfait et du futur
- Construire une argumentation
- Le vocabulaire de la poésie
- Le vocabulaire du théâtre
- L'autobiographie : se raconter
- Les formes de satire
- La littérature témoin de l'Histoire

**P2**
- L'autoportrait
- L'autobiographie : raconter le monde
- La science, source d'espoirs et d'exaltation
- La science, source de désillusion et d'inquiétudes
- La satire : une arme
- Le regard du poète sur le monde

### Histoire-géo — P1 : 14 · P2 : 8 (sur 26)

**P1**
- La Première Guerre mondiale : vers une guerre totale
- Les régimes totalitaires dans les années 1930
- La France durant l'entre-deux-guerres
- La Seconde Guerre mondiale : une guerre d'anéantissement
- La France de Vichy (1940-1944)
- 1944-1947 : refonder la République, redéfinir la démocratie
- Les années de Gaulle (1958-1969)
- La Ve République à l'épreuve de la durée (1958-2012)
- La décolonisation
- Le monde durant la guerre froide (1947-1962)
- Le monde durant la guerre froide (1963-1991)
- Les aires urbaines en France
- Les espaces productifs : la France industrielle
- L'aménagement comme réponse aux inégalités territoriales

**P2**
- Les Trente Glorieuses
- Les espaces productifs : la France agricole
- Les espaces productifs : la France des services
- Les espaces de faible densité
- L'Union européenne : un territoire en construction
- La France dans l'Union européenne
- La construction européenne
- La géopolitique du monde actuel

### EMC — P2 : 5 (sur 10)
- La laïcité en France
- La justice en France
- La citoyenneté française et européenne
- Voter : le droit de vote et les élections
- La liberté d'expression et ses limites

### Physique-chimie — P1 : 8 · P2 : 6 (sur 31)

**P1**
- Les atomes et la transformation chimique
- Les ions
- Le pH ou potentiel hydrogène
- Les différentes formes d'énergie
- Transferts et conversions d'énergie
- Calculer la vitesse et l'énergie cinétique
- Poids et gravitation
- Puissance et énergie électrique

**P2**
- Les mouvements
- La masse volumique
- Les tests caractéristiques des espèces chimiques
- La tension électrique
- L'intensité électrique
- La lumière

### SVT — P1 : 6 · P2 : 4 (sur 31)

**P1**
- La diversité génétique au sein d'une espèce, le gène et ses allèles
- La transmission de l'information génétique et des informations héréditaires
- La tectonique des plaques
- Les séismes : causes et risques associés
- La contamination par les micro-organismes et la mémoire immunitaire
- Le changement climatique et les écosystèmes

**P2**
- Volcanisme et risques associés
- Prévenir et soigner les infections
- De la fécondation à la naissance
- L'évolution des espèces et la sélection naturelle

### Technologie — P2 : 4 (sur 23)
- La chaîne d'énergie
- La chaîne d'information
- Bases de la programmation
- La circulation de l'information dans un réseau informatique

---

## 2de — pas d'examen (12, tout en P2)

### Maths — 10 (sur 20)
- Généralités sur les fonctions
- La fonction affine
- La fonction carré
- La fonction inverse
- Vecteurs du plan et opérations
- Équations de droites
- Les identités remarquables
- Les équations et inéquations
- Probabilités : vocabulaire et outils
- Statistique descriptive

### Français — 2 (sur 24)
- Le vocabulaire poétique
- Le vocabulaire du théâtre

---

## 1re — le bac anticipé (54)

Français : écrit (commentaire ou dissertation) et oral (explication de texte, **question de grammaire**, entretien sur une œuvre). Maths : épreuve anticipée de la session 2027, coefficient 2, bâtie sur les **automatismes**.

### Français — P1 : 14 · P2 : 12 (sur 64 hors fiches de lecture)

**P1 — la question de grammaire de l'oral et les quatre objets d'étude**
- La méthode de la question de grammaire
- Les fonctions grammaticales à savoir nommer
- L'interrogation totale et partielle
- L'interrogation directe et indirecte
- L'expression de la négation
- Phrase simple et phrase complexe
- Juxtaposition et coordination
- La proposition subordonnée relative
- La proposition subordonnée conjonctive complétive
- Les propositions subordonnées circonstancielles
- La poésie du XIXe au XXIe siècle
- La littérature d'idées du XVIe au XVIIIe siècle
- Le roman et le récit du Moyen Âge au XXIe siècle
- Le théâtre du XVIIe au XXIe siècle

**P2 — les douze œuvres au programme (session 2027)**
- Les Cahiers de Douai
- La rage de l'expression
- Mes forêts
- Discours de la servitude volontaire
- Entretiens sur la pluralité des mondes
- Lettres d'une Péruvienne
- Le Chevalier de la charrette
- Pot-Bouille
- Pluie et vent sur Télumée Miracle
- Le Menteur
- On ne badine pas avec l'amour
- Pour un oui ou pour un non

### Maths — P1 : 10 · P2 : 4 (sur 25)

**P1 — l'épreuve anticipée**
- Automatismes : proportions et pourcentages
- Automatismes : évolutions et taux
- Automatismes : calcul numérique et littéral
- Automatismes : fonctions et représentations graphiques
- Automatismes : statistiques et probabilités
- L'épreuve anticipée de mathématiques : la méthode
- Dérivation
- Les suites arithmétiques et géométriques
- Le second degré
- Probabilités conditionnelles et indépendance

**P2**
- Variations et courbes représentatives de fonctions
- Fonction exponentielle
- Variable aléatoire et loi de probabilité
- Calcul vectoriel et produit scalaire

### Spécialités de 1re — P2 : 14

**Physique-chimie (4 sur 22)** : Représentation de Lewis d'un atome et d'une molécule · La mole et ses formules · Dosage par titrage · L'énergie mécanique : énergies cinétique et potentielle

**SVT (4 sur 21)** : La réplication de l'ADN · L'expression du patrimoine génétique · La tectonique des plaques, caractérisation de la mobilité horizontale · L'immunité adaptative

**SES (4 sur 23)** : Comment la monnaie est-elle créée ? · Comment un marché concurrentiel fonctionne-t-il ? · Quelles sont les principales défaillances du marché ? · De la socialisation primaire à la socialisation secondaire

**HGGSP (2 sur 25)** : La démocratie, les démocraties : quelles caractéristiques aujourd'hui ? · Les formes des frontières dans le monde

---

## Terminale — le bac (97)

Philosophie coefficient 8 pour tous ; chaque spécialité coefficient 16 ; le Grand oral 8 (12 en voie technologique).

### Philosophie — P1 : 19 (toutes)
- La conscience
- L'inconscient
- La nature
- Le bonheur
- Le travail
- L'État
- La justice et le droit
- Le devoir
- La raison
- La liberté de faire ce qui me plaît
- Le libre arbitre
- La liberté politique
- Le langage
- La vérité
- La science
- La technique
- L'art
- La religion
- Le temps

### Maths (spécialité) — P1 : 12 · P2 : 3 (sur 19)

**P1**
- Raisonnement par récurrence
- Limites de suites
- Limites de fonctions
- Dérivée de 2 fonctions composées
- Fonctions convexes
- Continuité des fonctions d'une variable réelle
- Fonction logarithme népérien (ln)
- Primitives et équations différentielles
- Calcul intégral
- Succession d'épreuves indépendantes, lois de Bernoulli et binomiale
- Produit scalaire, orthogonalité et distances dans l'espace
- Représentations paramétriques de droites et équations cartésiennes de plans de l'espace

**P2**
- Fonctions cosinus et sinus
- Factorielle, k-uplet, permutation et combinaison
- Loi des grands nombres et concentration

### Physique-chimie (spécialité) — P1 : 10 · P2 : 4 (sur 31)

**P1**
- Le premier principe de la thermodynamique
- Transferts thermiques
- Suivi temporel d'une réaction chimique : modèle macroscopique
- Évolution d'une population de noyaux radioactifs
- L'effet Doppler
- Interférences de deux ondes
- Appliquer la deuxième loi de Newton
- Mouvement dans un champ uniforme
- Acides et bases selon Brönsted
- Les piles : générateurs électrochimiques

**P2**
- Diffraction d'une onde
- Système optique et formation d'images : la lunette astronomique
- Mouvement dans un champ de gravitation
- Équilibre chimique et calcul du pH d'une solution

### SVT (spécialité) — P1 : 8 · P2 : 4 (sur 22)

**P1**
- Le brassage des génomes à chaque génération : la reproduction sexuée des eucaryotes
- Mécanismes de diversification des êtres vivants
- La chronologie relative : décrypter le temps des roches par l'observation
- La chronologie absolue : décrypter le temps des roches par des mesures
- Les réflexes
- Cerveau et mouvement volontaire
- La plante, productrice de la matière organique grâce à la photosynthèse
- Comprendre les variations climatiques

**P2**
- La conservation des génomes : stabilité génétique et évolution clonale
- La cellule musculaire : une structure spécialisée permettant son propre raccourcissement
- La domestication des plantes
- Comprendre les conséquences du réchauffement climatique et les possibilités d'actions

### SES (spécialité) — P1 : 10 · P2 : 4 (sur 31)

**P1**
- Les sources de la croissance économique
- Les fondements du commerce international
- Définir et mesurer le chômage
- Les politiques de lutte contre le chômage
- Les caractéristiques de la crise financière des années 1930 et de celle de 2008
- Qu'est-ce que la mobilité sociale ?
- L'évolution de la structure sociale en France depuis la seconde moitié du XXe siècle
- Des inégalités multiformes et cumulatives
- Une inégalité des chances persistante
- Les principaux instruments des politiques climatiques

**P2**
- Le processus d'intégration européenne
- Diverses formes d'engagement citoyen
- Les instruments de régulation monétaire
- Les théories des classes sociales

### HGGSP (spécialité) — P1 : 6 · P2 : 2 (sur 24)

**P1 — un chapitre par thème**
- Vers une société de la connaissance
- Le changement climatique : approches historique et géopolitique
- La préservation du patrimoine
- De la guerre entre États à de nouvelles formes de conflits
- Histoire et mémoires : l'exemple de la guerre d'Algérie
- Les enjeux géopolitiques de la conquête spatiale

**P2**
- Guerres et paix au Moyen-Orient
- L'histoire et les mémoires du génocide des Juifs et des Tsiganes

### HLP (spécialité) — P1 : 4 · P2 : 2 (sur 21)

**P1**
- Méthode de l'épreuve
- Les transformations historiques de l'ego
- Le fantasme de la toute-puissance humaine
- L'Humanité en question

**P2**
- « Un seul être vous manque et tout est dépeuplé » : le sentiment romantique
- Violence et société

### NSI (spécialité) — P2 : 4 (sur 20)
- Le langage SQL
- Algorithme récursif
- Programmation orientée objet
- Arbres et structure de données

### Maths complémentaires — P2 : 3 (sur 15)
- Fonctions, dérivées et optimisation
- Lois à densité
- Intégration

### Maths expertes — P2 : 2 (sur 12)
- Les nombres complexes d'un point de vue algébrique
- Divisibilité et congruences dans Z

---

## Ce qu'on ne fait pas dans ce lot, et pourquoi

- **Les 260 fiches de lecture de 1re** : une image ne remplace pas une fiche de lecture, et chaque élève n'en lit que quelques-unes.
- **L'histoire-géo de Terminale (53), l'enseignement scientifique, l'EMC du lycée** : contrôle continu, pas d'épreuve finale.
- **Les langues (anglais, espagnol, allemand), LLCER** : une fiche de grammaire anglaise se vend moins qu'une fiche de Thalès, et la série est longue (130 chapitres).
- **Les séries technologiques** (STMG, ST2S, STI2D, STL : ~300 chapitres) : à traiter comme un lot à part quand les séries générales seront couvertes.
- **La 2de au-delà de 12 fiches** : pas d'examen.

## Avant la série

1. **Un exemplaire fini**, validé par Lucas, avant toute production (règle de la maison) — le même chapitre que le gabarit, Thalès en 3e, dans la forme choisie (fiche entière générée, ou illustration générée + texte composé).
2. Un script de production qui lit cette liste (titres exacts), tire le cours de la base pour nourrir le prompt, et nomme chaque fichier par l'identifiant du chapitre.
3. Le stockage : pas `public/` (contenu payant, ~260 × 400 Ko) — un bucket privé Supabase Storage gardé par `chapter_unlocks`, servi par la page Fiche du chapitre.
