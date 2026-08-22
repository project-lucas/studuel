// SCIENCES DE L’INGÉNIEUR PREMIÈRE — les 23 fiches du programme officiel,
// rangées sous ses 6 chapitres : analyse du besoin · statique du solide
// indéformable · théorie des mécanismes · cinématique · transfert de
// l’information · électrocinétique.
//
// LE DÉFAUT. Sondé le 21/08/2026 (node _ASSOCIE/sonde-chapitres.mjs 1re si) :
// la spécialité n’a que TROIS fiches composites — « Analyser un système »,
// « Énergie et mécanique », « Information, capteurs et programmation ». Elles
// viennent de la migration 219. Le SysML, le principe fondamental de la
// statique, la cinématique du point, l’algèbre de Boole, les portes logiques,
// les réseaux de données et les composants électriques n’ont AUCUNE entrée :
// c’est-à-dire tout ce que l’élève manipule en travaux pratiques et tout ce que
// l’épreuve interroge.
//
// POURQUOI UN MODULE NEUF plutôt qu’un ajout dans `si.mjs` : celui-ci part dans
// la migration 219, DÉJÀ EXÉCUTÉE, qui ne doit plus être régénérée. Deux
// fichiers, même slug `si` — d’où la génération par `--modules`. ⚠️ La 219 est
// générée par `--modules snt,hlp,llcer-anglais,si,maths-complementaires` : le
// module y est déjà désigné par son FICHIER, l’ajout de `si-1re.mjs` ne la
// touche donc pas.
//
// PÉRIMÈTRE : la PREMIÈRE SEULE. Le ménage est borné à `level = '1re'` : la
// Terminale garde les fiches de la 219, faute de programme écrit pour elle.
//
// LE DÉCOUPAGE EST CELUI DE LA MAQUETTE DE RÉFÉRENCE — 6 chapitres. Le
// programme de SI s’organise officiellement autour de quatre compétences
// (analyser, modéliser, expérimenter, concevoir) qui ne sont pas des chapitres :
// on ne range pas des fiches sous des verbes. Les six chapitres retenus sont
// ceux du cahier, et ils suivent la chaîne du système : le besoin, puis les
// actions mécaniques, puis l’énergie, le mouvement, l’information et enfin le
// circuit qui la porte.
//
// ⚠️ PAS DE LATEX : le composant de rendu ne le connaît pas. Les formules
// s’écrivent en texte — « P = U × I », « M = F × d », « v = ω × R ».

export default {
  slug: 'si',
  nom: 'Sciences de l’ingénieur',

  titreMigration: 'SCIENCES DE L’INGÉNIEUR 1re — LE PROGRAMME OFFICIEL (23 fiches)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs 1re si, 21/08/2026) :
la spécialité Sciences de l'ingénieur de Première n'avait que TROIS fiches
composites, héritées de la migration 219 — « Analyser un système », « Énergie et
mécanique », « Information, capteurs et programmation ». Le SysML, la
modélisation des actions mécaniques, le principe fondamental de la statique, la
cinématique du point, les opérateurs logiques, l'algèbre de Boole, la
simplification des expressions logiques, les réseaux de données et les composants
électriques n'avaient AUCUNE entrée : tout ce que l'élève manipule en travaux
pratiques, et tout ce que l'épreuve interroge.

Cette migration installe les 23 fiches du programme, rangées sous ses 6
chapitres, et retire les 3 fiches composites qu'elles recouvrent.

PÉRIMÈTRE : la PREMIÈRE SEULE. La Terminale garde les fiches de la 219 : le
ménage est borné au niveau 1re.

⚠️ CE QUI EST PERDU AU PASSAGE : les cours et les quiz des 3 fiches composites.
⚠️ LA 219 EST REJOUABLE : la recoller ferait revenir ces trois fiches en
doublon des 23 fiches du programme.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 23 fiches sous 6 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que la 234 n'a jamais été
exécutée telle quelle — sans cette reprise, la migration échouerait sur
"column chapters.theme does not exist", les 3 anciennes fiches déjà supprimées
et les 23 neuves pas encore posées : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 3 fiches composites de la 219 partent, au niveau 1re SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : le critère « pas de chapitre de
programme » vise exactement les trois lignes voulues, antérieures à la colonne
theme, tandis que les 23 fiches neuves en portent un dès l'INSERT — le ménage
tourne AVANT les insertions et ne peut donc jamais mordre sur elles, ni au
premier passage ni au rejeu. C'est aussi le seul repère sûr : rien ne garantit
que la base porte les mêmes apostrophes que ce fichier (piège de la 249).
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins à leur chapitre, et toujours
tirables par le moteur de questions), puis les chapitres, dont les leçons
partent en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'si'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'si'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'si'
   AND c.level = '1re'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      chapitres: [
        // ---- Chapitre 1 : analyse du besoin ---------------------------------
        {
          titre: 'Structure de la démarche de projet',
          axe: 'Analyse du besoin',
          lecon: {
            titre: 'Du besoin au produit',
            cours: `Un **projet** est un ensemble d’activités coordonnées, mené une seule fois, pour atteindre un objectif défini dans un délai et un budget donnés. Il se distingue d’une activité de production, qui se répète à l’identique.

## Le triangle du projet
Trois contraintes se tiennent : le **coût**, le **délai** et la **qualité** (ou périmètre). On ne peut en améliorer une sans peser sur les deux autres — réduire le délai coûte plus cher ou dégrade la qualité. Savoir le formuler est déjà une compétence d’ingénieur.

## Le cycle de vie
Quatre phases se succèdent : **conception**, **planification**, **réalisation**, **terminaison**. Chacune se clôt par un **jalon** — une décision de poursuivre, de corriger ou d’arrêter.

## Exprimer le besoin
Un projet commence par une **analyse du besoin**, qui répond à trois questions : à qui le produit rend-il service ? sur quoi agit-il ? dans quel but ?

Le besoin est ensuite formalisé dans un **cahier des charges fonctionnel**, qui décrit les **fonctions** attendues et non les solutions techniques.

- La **fonction principale** justifie l’existence du produit ;
- les **fonctions contraintes** expriment les limites imposées par le milieu extérieur (normes, encombrement, température, coût).

Chaque fonction reçoit un **critère**, un **niveau** attendu et une **flexibilité**. « Résister à une charge de 150 kg, tolérance ±10 % » est une exigence exploitable ; « être solide » ne l’est pas.

> Le cahier des charges dit **ce qu’il faut faire**, jamais **comment le faire**. Écrire « utiliser un moteur pas à pas » y est une faute : c’est une solution, pas un besoin — et elle interdit d’avance toute autre piste.

## Écarts et validation
La démarche de l’ingénieur se lit dans trois écarts : entre le **cahier des charges** et le **modèle**, entre le **modèle** et le **réel mesuré**, entre le **réel** et le **cahier des charges**. Les analyser, c’est valider — ou corriger — le produit comme le modèle.`,
          },
          questions: [
            ['Quelles sont les trois contraintes du triangle du projet ?', ['Le coût, le délai et la qualité', 'Le besoin, la solution et le client', 'L’étude, la production et la vente', 'La conception, la réalisation et la validation'], 0, 'Améliorer l’une pèse toujours sur les deux autres.'],
            ['Que décrit un cahier des charges fonctionnel ?', ['Les fonctions attendues du produit, pas les solutions techniques', 'Le plan de fabrication détaillé', 'La liste des composants à acheter', 'Le planning de l’équipe'], 0, 'Il dit ce qu’il faut faire, jamais comment le faire.'],
            ['« Le produit doit être solide » est une exigence correctement formulée.', ['Vrai', 'Faux'], 1, 'Il manque un critère, un niveau et une flexibilité mesurables.'],
            ['Qu’est-ce qu’une fonction contrainte ?', ['Une limite imposée par le milieu extérieur au produit', 'La raison d’être du produit', 'Une panne prévisible', 'Un coût de fabrication'], 0, 'Normes, encombrement, température : elle borne les solutions possibles.'],
            ['Qu’est-ce qu’un jalon dans un projet ?', ['Un point de décision qui clôt une phase', 'Une tâche de longue durée', 'Un membre de l’équipe projet', 'Un livrable intermédiaire sans décision'], 0, 'On y décide de poursuivre, de corriger ou d’arrêter.'],
            ['Quelles sont les quatre phases du cycle de vie d’un projet ?', ['Conception, planification, réalisation, terminaison', 'Analyse, achat, montage, vente', 'Besoin, prototype, série, maintenance', 'Étude, essai, correction, livraison'], 0, 'Chacune se clôt par un jalon.'],
            ['Un projet se répète à l’identique, comme une production en série.', ['Vrai', 'Faux'], 1, 'Il est par définition unique et borné dans le temps.'],
            ['Quels écarts la démarche de l’ingénieur analyse-t-elle ?', ['Entre cahier des charges, modèle et réel mesuré', 'Entre coût prévu et coût réel uniquement', 'Entre équipes', 'Entre fournisseurs'], 0, 'Ces trois écarts servent à valider ou à corriger produit et modèle.'],
          ],
        },
        {
          titre: 'Le projet : la phase de conception',
          axe: 'Analyse du besoin',
          lecon: {
            titre: 'Des idées aux solutions techniques',
            cours: `La **conception** transforme un besoin en solutions techniques comparables. C’est la phase où l’essentiel du coût final se décide, alors que presque rien n’a encore été dépensé.

## Du besoin aux fonctions
On part du cahier des charges fonctionnel et l’on **décompose** : chaque fonction de service se décline en **fonctions techniques**, puis en **solutions constructives**. Un même besoin admet toujours plusieurs solutions — c’est l’objet de la phase que de les faire apparaître.

## La recherche de solutions
Deux temps à ne pas mélanger :
- la **divergence** : produire le plus grand nombre d’idées possible, sans juger. Brainstorming, analogies, méthode des combinaisons.
- la **convergence** : évaluer et retenir. C’est seulement ici qu’on écarte.

Juger pendant la divergence tue les idées fragiles, dont sortent souvent les meilleures solutions.

## Comparer les solutions
Les outils sont simples et attendus en devoir :
- le **tableau multicritère**, où chaque critère reçoit un **poids** et chaque solution une note ; le total pondéré classe les solutions ;
- le **diagramme d’aide à la décision**, qui visualise le compromis entre deux critères ;
- le **prototypage rapide**, qui permet d’éprouver une solution avant de s’engager.

> Le tableau multicritère n’est pas un oracle : il rend le choix **explicite et discutable**. Changer les poids change le classement — et c’est précisément ce qu’il faut savoir montrer.

## Modéliser avant de construire
La **maquette numérique** (CAO) permet de vérifier l’encombrement, les interférences entre pièces et les montages avant toute fabrication. La **simulation** vérifie le comportement : résistance mécanique, échauffement, consommation.

Chaque simulation repose sur des **hypothèses simplificatrices** — solide indéformable, frottements négligés, régime permanent. Les nommer fait partie du travail : un résultat de simulation sans hypothèses n’a aucune valeur.`,
          },
          questions: [
            ['Que produit la phase de conception ?', ['Des solutions techniques répondant au besoin', 'Le planning détaillé du projet', 'Le produit fini', 'Le bilan financier'], 0, 'Elle décline les fonctions en solutions constructives.'],
            ['Que faut-il éviter pendant la phase de divergence ?', ['Juger et écarter les idées', 'Produire beaucoup d’idées', 'Utiliser des analogies', 'Noter toutes les propositions'], 0, 'Juger trop tôt tue les idées fragiles.'],
            ['Un tableau multicritère donne la solution objectivement optimale.', ['Vrai', 'Faux'], 1, 'Il rend le choix explicite et discutable : changer les poids change le classement.'],
            ['À quoi sert une maquette numérique en conception ?', ['À vérifier encombrement, interférences et montage avant fabrication', 'À calculer le prix de vente', 'À rédiger le cahier des charges', 'À planifier les tâches'], 0, 'Elle évite de découvrir un défaut au moment de l’assemblage.'],
            ['Pourquoi faut-il expliciter les hypothèses d’une simulation ?', ['Parce qu’un résultat de simulation n’a de sens que dans le cadre de ses hypothèses', 'Pour allonger le rapport', 'Parce que la norme l’impose', 'Pour justifier le coût du logiciel'], 0, 'Solide indéformable, frottements négligés : chacune borne la validité.'],
            ['La phase de conception engage l’essentiel du coût final du produit.', ['Vrai', 'Faux'], 0, 'Elle le décide alors que presque rien n’a encore été dépensé.'],
            ['Qu’est-ce qu’une fonction technique ?', ['La déclinaison interne d’une fonction de service', 'Une contrainte du milieu extérieur', 'Un composant du commerce', 'Un critère de coût'], 0, 'Elle se traduit ensuite en solution constructive.'],
            ['À quoi sert le prototypage rapide ?', ['À éprouver une solution avant de s’engager', 'À produire la série définitive', 'À archiver le projet', 'À former les utilisateurs'], 0, 'Il réduit le risque d’un mauvais choix de conception.'],
          ],
        },
        {
          titre: 'Le projet : la phase de planification',
          axe: 'Analyse du besoin',
          lecon: {
            titre: 'Tâches, antériorités et chemin critique',
            cours: `**Planifier**, c’est répondre à trois questions : quelles tâches, dans quel ordre, avec quelles ressources.

## Découper le travail
On décompose le projet en **tâches** élémentaires, chacune caractérisée par une **durée**, des **ressources** et des **antériorités** — les tâches qui doivent être terminées avant qu’elle commence.

## Le diagramme de Gantt
Chaque tâche y est un **rectangle horizontal**, dont la longueur est proportionnelle à sa durée. Il se lit d’un coup d’œil, montre les tâches **simultanées** et sert de tableau de bord pendant toute la réalisation. C’est l’outil de suivi.

## Le réseau PERT et le chemin critique
Le **PERT** représente les tâches et leurs enchaînements sous forme de réseau. On y calcule, pour chaque tâche :
- sa **date au plus tôt**, en parcourant le réseau du début vers la fin ;
- sa **date au plus tard**, en le parcourant de la fin vers le début ;
- sa **marge**, différence des deux.

Le **chemin critique** est la suite des tâches de **marge nulle**. Sa longueur donne la **durée minimale** du projet, et tout retard sur l’une de ses tâches retarde **le projet entier**.

> C’est l’enseignement central du chapitre : accélérer une tâche qui n’est pas sur le chemin critique ne fait gagner **aucun jour** au projet. On ne renforce que ce qui est critique.

## Ressources et coûts
Une tâche peut être limitée non par sa logique mais par la **disponibilité** d’une ressource — une machine, un opérateur. Le lissage des ressources consiste à décaler les tâches disposant d’une marge pour éviter les pics de charge.

## Suivre et corriger
Pendant la réalisation, on compare l’**avancement réel** au prévisionnel. Un retard sur une tâche à marge se résorbe ; un retard sur le chemin critique impose un arbitrage : ajouter des moyens, réduire le périmètre, ou accepter le décalage.`,
          },
          questions: [
            ['Qu’est-ce que le chemin critique d’un projet ?', ['La suite des tâches de marge nulle, qui fixe la durée minimale du projet', 'La tâche la plus coûteuse', 'La tâche la plus longue', 'La suite des tâches les plus risquées'], 0, 'Tout retard sur l’une d’elles retarde le projet entier.'],
            ['Accélérer une tâche hors du chemin critique raccourcit le projet.', ['Vrai', 'Faux'], 1, 'Elle dispose d’une marge : le projet n’y gagne aucun jour.'],
            ['Que représente un diagramme de Gantt ?', ['Les tâches sous forme de rectangles dont la longueur est proportionnelle à la durée', 'Le réseau des antériorités uniquement', 'Le budget par poste', 'L’organigramme de l’équipe'], 0, 'C’est l’outil de suivi le plus lisible.'],
            ['Qu’est-ce que la marge d’une tâche ?', ['L’écart entre sa date au plus tard et sa date au plus tôt', 'Son coût supplémentaire', 'Sa durée totale', 'Le nombre de personnes qui y travaillent'], 0, 'Une marge nulle place la tâche sur le chemin critique.'],
            ['Qu’appelle-t-on antériorité d’une tâche ?', ['Les tâches qui doivent être achevées avant qu’elle commence', 'Sa date de fin', 'Sa durée estimée', 'Son coût prévisionnel'], 0, 'C’est ce qui structure le réseau PERT.'],
            ['Comment calcule-t-on les dates au plus tard dans un réseau PERT ?', ['En parcourant le réseau de la fin vers le début', 'En parcourant le réseau du début vers la fin', 'En additionnant toutes les durées', 'En prenant la moyenne des durées'], 0, 'Les dates au plus tôt se calculent, elles, en parcours avant.'],
            ['Le lissage des ressources consiste à décaler des tâches disposant d’une marge.', ['Vrai', 'Faux'], 0, 'Il évite les pics de charge sans allonger le projet.'],
            ['Que faire si une tâche du chemin critique prend du retard ?', ['Arbitrer : ajouter des moyens, réduire le périmètre ou accepter le décalage', 'Attendre la fin du projet', 'Réaffecter les marges des autres tâches', 'Supprimer la tâche'], 0, 'Le retard se répercute intégralement sur la fin du projet.'],
          ],
        },
        {
          titre: 'Le projet : les phases de réalisation et de terminaison',
          axe: 'Analyse du besoin',
          lecon: {
            titre: 'Fabriquer, valider, clore',
            cours: `La **réalisation** met en œuvre ce que la conception a décidé et ce que la planification a ordonné. La **terminaison** clôt le projet — et c’est la phase que l’on bâcle le plus souvent.

## Réaliser
On fabrique, on assemble, on programme, on intègre. Trois exigences accompagnent le travail :
- le **suivi d’avancement**, comparant le réel au prévisionnel ;
- la **gestion des modifications** : toute évolution du besoin en cours de route doit être tracée, chiffrée et validée, sinon le projet dérive sans qu’on sache pourquoi ;
- la **traçabilité** des versions, des pièces et des essais.

## Vérifier et valider
Deux mots que l’on confond, et qui ne disent pas la même chose :
- **vérifier**, c’est s’assurer que le produit est conforme aux **spécifications** — a-t-on bien construit le produit ?
- **valider**, c’est s’assurer qu’il répond au **besoin réel** de l’utilisateur — a-t-on construit le bon produit ?

Un produit peut être parfaitement vérifié et rester invalide, s’il répond à une spécification qui traduisait mal le besoin.

## Les essais
On mesure les **performances réelles** et on les compare aux niveaux du cahier des charges. L’écart obtenu est analysé : vient-il du produit, du protocole de mesure, ou d’une hypothèse trop grossière du modèle ? Cette question est le cœur du raisonnement attendu en SI.

## Terminer
La terminaison comprend :
- la **livraison** et la **recette** avec le client ;
- la **documentation** : notice d’utilisation, plan de maintenance, dossier technique ;
- le **bilan** — écarts de coût et de délai, difficultés rencontrées, **retour d’expérience** pour les projets suivants ;
- la dissolution de l’équipe et l’archivage.

> Sans retour d’expérience, chaque nouveau projet recommence les erreurs du précédent. C’est la seule phase dont le bénéfice ne va pas au projet en cours, mais aux suivants — et c’est pour cela qu’elle est si souvent sacrifiée.`,
          },
          questions: [
            ['Quelle est la différence entre vérifier et valider ?', ['Vérifier : conforme aux spécifications ; valider : répond au besoin réel', 'Ce sont deux synonymes', 'Vérifier concerne le coût, valider la qualité', 'Vérifier se fait après la livraison'], 0, '« A-t-on bien construit le produit ? » contre « a-t-on construit le bon produit ? ».'],
            ['Un produit conforme à ses spécifications répond nécessairement au besoin.', ['Vrai', 'Faux'], 1, 'Si la spécification traduisait mal le besoin, le produit est vérifié mais invalide.'],
            ['Que comprend la phase de terminaison ?', ['Livraison, documentation, bilan et retour d’expérience', 'La fabrication des pièces', 'La recherche de solutions', 'Le calcul du chemin critique'], 0, 'C’est aussi le moment de l’archivage et de la dissolution de l’équipe.'],
            ['Pourquoi tracer les modifications en cours de réalisation ?', ['Pour éviter que le projet dérive sans qu’on sache pourquoi', 'Pour allonger la documentation', 'Pour retarder la livraison', 'Parce que le client l’exige toujours'], 0, 'Toute évolution doit être tracée, chiffrée et validée.'],
            ['Que faire d’un écart entre performance mesurée et cahier des charges ?', ['L’analyser : produit, protocole de mesure ou hypothèses du modèle', 'L’ignorer s’il est faible', 'Modifier le cahier des charges', 'Recommencer la conception'], 0, 'C’est le raisonnement central attendu en sciences de l’ingénieur.'],
            ['Le retour d’expérience bénéficie surtout aux projets suivants.', ['Vrai', 'Faux'], 0, 'C’est pourquoi il est si souvent sacrifié, à tort.'],
            ['Qu’est-ce que la recette d’un projet ?', ['La vérification contradictoire du produit livré avec le client', 'La liste des composants', 'Le budget consommé', 'Le planning réel'], 0, 'Elle conditionne l’acceptation formelle de la livraison.'],
            ['Que compare le suivi d’avancement ?', ['L’état réel du projet à son prévisionnel', 'Deux solutions techniques', 'Le produit et son concurrent', 'Les hypothèses du modèle'], 0, 'Il permet de réagir avant que l’écart devienne irrattrapable.'],
          ],
        },
        {
          titre: 'Le SysML',
          axe: 'Analyse du besoin',
          lecon: {
            titre: 'Décrire un système en diagrammes',
            cours: `Le **SysML** (*Systems Modeling Language*) est un langage **graphique** de description des systèmes. Il sert de langue commune entre le client, le mécanicien, l’électronicien et l’informaticien — chacun y lit la même chose.

## Trois familles de diagrammes
Ils répondent à trois questions différentes, et les confondre est l’erreur classique du chapitre.

**Le besoin — à quoi le système doit-il répondre ?**
- **Diagramme des exigences** (*requirement*) : l’arbre des exigences, chacune identifiée, formulée et vérifiable. Il porte la traçabilité du cahier des charges.
- **Diagramme des cas d’utilisation** (*use case*) : les **acteurs** extérieurs et les services que le système leur rend.

**La structure — de quoi est-il fait ?**
- **Diagramme de définition de blocs** (*block definition*) : la décomposition en blocs et leurs relations de composition.
- **Diagramme de blocs internes** (*internal block*) : les **flux** échangés entre blocs — matière, énergie, information — et les ports par lesquels ils passent.

**Le comportement — que fait-il ?**
- **Diagramme d’états** (*state machine*) : les états successifs du système et les **transitions** qui les font changer, chacune déclenchée par un **événement** et éventuellement soumise à une **condition de garde**.
- **Diagramme de séquence** : les échanges de messages entre acteurs et système **dans le temps**.

## La chaîne fonctionnelle
Le SysML sert à décrire une structure qu’on retrouve dans presque tout système :
- la **chaîne d’information** : acquérir (capteur), traiter (calculateur), communiquer ;
- la **chaîne d’énergie** : alimenter, distribuer (préactionneur), convertir (actionneur), transmettre (réducteur, courroie) et agir.

> La chaîne d’information **commande** la chaîne d’énergie, et la mesure lui revient par le capteur : c’est le bouclage, la structure du **système asservi**.

## Pourquoi modéliser
Un modèle n’est jamais la réalité : il en retient ce qui est utile à la question posée. Un même système reçoit donc plusieurs modèles selon ce que l’on cherche à prévoir.`,
          },
          questions: [
            ['Que décrit un diagramme de cas d’utilisation ?', ['Les acteurs extérieurs et les services que le système leur rend', 'La structure interne du système', 'Les états successifs du système', 'Le planning du projet'], 0, 'Il répond à la question du besoin, pas à celle de la structure.'],
            ['Quel diagramme SysML montre les flux échangés entre les blocs ?', ['Le diagramme de blocs internes', 'Le diagramme des exigences', 'Le diagramme d’états', 'Le diagramme de séquence'], 0, 'Matière, énergie et information y circulent par des ports.'],
            ['Un diagramme d’états décrit les transitions déclenchées par des événements.', ['Vrai', 'Faux'], 0, 'Chaque transition peut être soumise à une condition de garde.'],
            ['Quels sont les maillons de la chaîne d’énergie ?', ['Alimenter, distribuer, convertir, transmettre, agir', 'Acquérir, traiter, communiquer', 'Analyser, modéliser, expérimenter', 'Capter, calculer, afficher'], 0, 'La chaîne d’information, elle, acquiert, traite et communique.'],
            ['Quel composant réalise la fonction « acquérir » de la chaîne d’information ?', ['Le capteur', 'L’actionneur', 'Le préactionneur', 'Le réducteur'], 0, 'Il transforme une grandeur physique en signal exploitable.'],
            ['Un modèle doit représenter fidèlement toute la réalité du système.', ['Vrai', 'Faux'], 1, 'Il n’en retient que ce qui est utile à la question posée.'],
            ['À quoi sert le diagramme des exigences ?', ['À porter la traçabilité du cahier des charges sous forme d’arbre', 'À décrire la géométrie des pièces', 'À planifier les tâches', 'À simuler le comportement mécanique'], 0, 'Chaque exigence y est identifiée, formulée et vérifiable.'],
            ['Qu’est-ce qui fait d’un système un système asservi ?', ['La mesure de la sortie revient commander l’entrée', 'Il possède un moteur', 'Il est programmé', 'Il consomme peu d’énergie'], 0, 'C’est le bouclage par le capteur qui le caractérise.'],
          ],
        },

        // ---- Chapitre 2 : statique du solide indéformable -------------------
        {
          titre: 'Calcul vectoriel et repères',
          axe: 'Statique du solide indéformable',
          lecon: {
            titre: 'L’outil de base de la mécanique',
            cours: `Toute action mécanique se représente par un **vecteur**. Manipuler des vecteurs n’est donc pas un préalable mathématique : c’est le langage même de la statique.

## Un vecteur, quatre caractéristiques
- Son **point d’application** ;
- sa **direction** (la droite qui le porte) ;
- son **sens** ;
- sa **norme** (ou intensité), en newtons pour une force.

Deux vecteurs ne sont égaux que si les trois dernières coïncident.

## Repères
Un **repère orthonormé direct** est défini par une origine et des vecteurs de base perpendiculaires, de norme 1, orientés selon la règle de la main droite. En mécanique, on choisit le repère qui **simplifie le calcul** : souvent, un axe le long du plan incliné plutôt qu’à l’horizontale.

Un même vecteur a des **coordonnées différentes** dans deux repères — mais c’est le même vecteur. Changer de repère est un choix de commodité, jamais un changement de physique.

## Opérations
- **Somme** : par la relation de Chasles ou par le parallélogramme ; en coordonnées, on additionne composante par composante.
- **Produit par un réel** : la norme est multipliée, le sens s’inverse si le réel est négatif.
- **Norme** dans le plan : ||u|| = √(x² + y²).

## Projection
Projeter un vecteur sur un axe est le geste le plus employé de la statique. Pour un vecteur de norme F faisant un angle α avec l’axe :

composante sur l’axe = F × cos α
composante perpendiculaire = F × sin α

> L’erreur la plus fréquente est d’intervertir sinus et cosinus. Le repère de contrôle : la composante **le long** de l’axe fait intervenir le **cosinus** de l’angle **avec cet axe**.

## Produit scalaire et produit vectoriel
- Le **produit scalaire** donne un nombre : u · v = ||u|| ||v|| cos α, nul si les vecteurs sont perpendiculaires. Il sert au calcul du travail d’une force.
- Le **produit vectoriel** donne un vecteur perpendiculaire aux deux, de norme ||u|| ||v|| sin α. Il sert au calcul des **moments**.`,
          },
          questions: [
            ['Quelles sont les quatre caractéristiques d’un vecteur force ?', ['Point d’application, direction, sens et norme', 'Masse, vitesse, accélération et temps', 'Longueur, largeur, hauteur et masse', 'Origine, extrémité, couleur et unité'], 0, 'Deux vecteurs sont égaux si direction, sens et norme coïncident.'],
            ['Quelle est la composante d’une force le long d’un axe avec lequel elle fait l’angle α ?', ['F × cos α', 'F × sin α', 'F × tan α', 'F / cos α'], 0, 'La composante perpendiculaire vaut F × sin α.'],
            ['Un même vecteur a les mêmes coordonnées dans tous les repères.', ['Vrai', 'Faux'], 1, 'Les coordonnées changent, le vecteur reste le même.'],
            ['À quoi sert le produit vectoriel en mécanique ?', ['Au calcul des moments', 'Au calcul du travail', 'Au calcul de la norme', 'Au calcul de la masse'], 0, 'Le produit scalaire, lui, sert au calcul du travail d’une force.'],
            ['Que vaut le produit scalaire de deux vecteurs perpendiculaires ?', ['Zéro', 'Le produit de leurs normes', 'Un', 'Leur somme'], 0, 'Parce que le cosinus d’un angle droit est nul.'],
            ['Comment choisit-on un repère en mécanique ?', ['De façon à simplifier les calculs, par exemple selon un plan incliné', 'Toujours horizontal et vertical', 'Toujours centré sur la Terre', 'Au hasard'], 0, 'C’est un choix de commodité, non de physique.'],
            ['Comment calcule-t-on la norme d’un vecteur de coordonnées (x ; y) ?', ['√(x² + y²)', 'x + y', '|x| + |y|', 'x × y'], 0, 'C’est le théorème de Pythagore appliqué aux composantes.'],
            ['Multiplier un vecteur par un réel négatif inverse son sens.', ['Vrai', 'Faux'], 0, 'Et multiplie sa norme par la valeur absolue du réel.'],
          ],
        },
        {
          titre: 'Modélisation des actions',
          axe: 'Statique du solide indéformable',
          lecon: {
            titre: 'Forces, moments et liaisons',
            cours: `Une **action mécanique** est ce qui déforme un solide, le met en mouvement ou l’en empêche. On la modélise pour pouvoir la calculer.

## Deux familles
- Les actions **à distance** s’exercent sans contact : le **poids** en est l’exemple universel. Il s’applique au **centre de gravité** et vaut P = m × g.
- Les actions **de contact** s’exercent par une surface : appui, liaison, frottement, pression d’un fluide.

Une action **répartie** sur une surface peut être remplacée par une force unique équivalente, appliquée au point où la répartition s’équilibre — commodité constante en statique.

## La force
Une force se modélise par un vecteur, en **newtons**. Son effet dépend de son point d’application autant que de son intensité : pousser une porte près de la poignée ou près des gonds n’a pas le même résultat.

## Le moment
Le **moment** mesure l’aptitude d’une force à faire **tourner** un solide autour d’un point ou d’un axe. Pour une force perpendiculaire au bras de levier :

M = F × d

en newtons-mètres (N·m), où d est la **distance perpendiculaire** entre la droite d’action de la force et le point considéré — le **bras de levier**.

> Deux conséquences pratiques : une force dont la droite d’action **passe par le point** a un moment **nul**, quelle que soit son intensité ; et allonger le bras de levier permet d’obtenir un grand moment avec une petite force — c’est le principe de la clé, du levier et de la brouette.

Le moment est **signé** : positif s’il tend à faire tourner dans le sens direct, négatif dans l’autre.

## Les liaisons mécaniques
Une **liaison** entre deux pièces supprime certains mouvements relatifs et en autorise d’autres. On la caractérise par ses **degrés de liberté** — au maximum six dans l’espace : trois translations, trois rotations.

- **Encastrement** : 0 degré de liberté ; il transmet toutes les forces et tous les moments.
- **Pivot** : 1 rotation autorisée ; c’est la liaison du roulement à billes.
- **Glissière** : 1 translation autorisée.
- **Ponctuelle** : 5 degrés de liberté ; elle ne transmet qu’une force perpendiculaire au contact.

Une liaison **parfaite** est supposée sans jeu et sans frottement : c’est une hypothèse de modélisation, à nommer comme telle.`,
          },
          questions: [
            ['Quelle est l’unité d’un moment ?', ['Le newton-mètre', 'Le newton', 'Le joule', 'Le pascal'], 0, 'Il mesure l’aptitude d’une force à faire tourner un solide.'],
            ['Que vaut le moment d’une force dont la droite d’action passe par le point considéré ?', ['Zéro', 'Le produit F × d', 'La force elle-même', 'L’infini'], 0, 'Le bras de levier est nul, quelle que soit l’intensité de la force.'],
            ['Qu’est-ce que le bras de levier ?', ['La distance perpendiculaire entre la droite d’action et le point considéré', 'La longueur du solide', 'La distance entre les deux extrémités de la force', 'La hauteur du point d’application'], 0, 'L’allonger permet d’obtenir un grand moment avec une petite force.'],
            ['Combien de degrés de liberté autorise une liaison pivot ?', ['Un, en rotation', 'Un, en translation', 'Zéro', 'Deux'], 0, 'C’est la liaison réalisée par un roulement à billes.'],
            ['Un encastrement autorise une rotation.', ['Vrai', 'Faux'], 1, 'Il supprime les six degrés de liberté et transmet tout.'],
            ['Où s’applique le poids d’un solide ?', ['Au centre de gravité', 'Au point de contact avec le sol', 'Au centre géométrique toujours', 'Au point le plus bas'], 0, 'C’est une action à distance, de valeur m × g.'],
            ['Combien de degrés de liberté un solide libre possède-t-il dans l’espace ?', ['Six', 'Trois', 'Deux', 'Un'], 0, 'Trois translations et trois rotations.'],
            ['Une liaison parfaite est une hypothèse de modélisation.', ['Vrai', 'Faux'], 0, 'Elle suppose ni jeu ni frottement : il faut la nommer comme hypothèse.'],
          ],
        },
        {
          titre: 'Représentation complète des actions',
          axe: 'Statique du solide indéformable',
          lecon: {
            titre: 'Isoler, inventorier, représenter',
            cours: `Résoudre un problème de statique commence toujours par le même geste : **isoler** un solide. Tant que cette étape n’est pas faite proprement, aucun calcul n’a de sens.

## Isoler
**Isoler** un solide, c’est le séparer par la pensée de tout ce qui l’entoure, et remplacer chaque élément retiré par l’**action** qu’il exerçait sur lui. Le solide isolé se note clairement, et le **bilan des actions extérieures** s’écrit sous forme de liste : pour chacune, son point d’application, sa direction, son sens et son intensité, connus ou inconnus.

> Une action **intérieure** au solide isolé ne figure JAMAIS dans le bilan. C’est l’erreur qui fausse le plus de copies : on ne compte que ce qui traverse la frontière de l’isolement.

## Le torseur des actions
La représentation complète d’une action mécanique en un point comporte **deux vecteurs** :
- la **résultante**, somme des forces ;
- le **moment résultant** au point choisi.

C’est ce couple que l’on appelle **torseur d’action mécanique**. Écrire une action, c’est donner ses six composantes dans l’espace (trois de force, trois de moment) — trois seulement dans un problème plan (deux de force, un de moment).

Un torseur se **transporte** d’un point à un autre : la résultante ne change pas, mais le moment, si — puisque le bras de levier change.

## Représenter graphiquement
Sur un schéma, chaque action est tracée en son point d’application, avec une longueur proportionnelle à son intensité et une échelle indiquée. Les inconnues sont tracées avec un sens **supposé** : si le calcul donne une valeur négative, c’est que le sens réel est l’inverse — et cela ne rend pas la solution fausse.

## Les cas particuliers utiles
- Un solide soumis à **deux forces** en équilibre : elles ont la même droite d’action, des sens opposés et la même intensité.
- Un solide soumis à **trois forces** non parallèles en équilibre : leurs droites d’action sont **concourantes** et la somme vectorielle est nulle — le triangle des forces se ferme.

Ces deux propriétés permettent souvent de résoudre graphiquement, sans écrire une seule équation.`,
          },
          questions: [
            ['Que signifie « isoler un solide » ?', ['Le séparer de son environnement et remplacer chaque élément retiré par son action', 'Le poser sur un support isolant', 'Le retirer du système', 'Négliger son poids'], 0, 'C’est le geste préalable à tout calcul de statique.'],
            ['Les actions intérieures au solide isolé figurent-elles dans le bilan ?', ['Non, jamais', 'Oui, toujours', 'Oui, si elles sont grandes', 'Oui, en dernier'], 0, 'On ne compte que ce qui traverse la frontière de l’isolement.'],
            ['De quoi se compose la représentation complète d’une action mécanique ?', ['D’une résultante et d’un moment résultant en un point', 'D’une force seule', 'D’un moment seul', 'D’une masse et d’une accélération'], 0, 'C’est le torseur d’action mécanique.'],
            ['Quand on transporte un torseur d’un point à un autre, la résultante change.', ['Vrai', 'Faux'], 1, 'La résultante est invariante ; c’est le MOMENT qui change.'],
            ['Un solide en équilibre sous l’action de deux forces : que peut-on dire ?', ['Même droite d’action, sens opposés, même intensité', 'Elles sont perpendiculaires', 'Elles sont concourantes en trois points', 'Leur somme vaut le poids'], 0, 'C’est le cas le plus simple, et le plus utile.'],
            ['Que peut-on dire de trois forces non parallèles maintenant un solide en équilibre ?', ['Leurs droites d’action sont concourantes et leur somme vectorielle est nulle', 'Elles sont toutes égales', 'Elles sont perpendiculaires deux à deux', 'Deux d’entre elles se compensent'], 0, 'Le triangle des forces se ferme : une résolution graphique est possible.'],
            ['Combien de composantes une action mécanique possède-t-elle dans un problème plan ?', ['Trois', 'Six', 'Deux', 'Une'], 0, 'Deux composantes de force et une de moment.'],
            ['Une inconnue tracée dans le mauvais sens rend le calcul faux.', ['Vrai', 'Faux'], 1, 'Le résultat sort simplement négatif : le sens réel est l’inverse du sens supposé.'],
          ],
        },
        {
          titre: 'Principe fondamental de la statique',
          axe: 'Statique du solide indéformable',
          lecon: {
            titre: 'Deux conditions d’équilibre',
            cours: `Un solide est en **équilibre** dans un référentiel galiléen si, et seulement si, deux conditions sont réunies **simultanément**.

## Les deux conditions
1. La **somme vectorielle** des actions extérieures est **nulle** — le solide ne translate pas.
2. La **somme des moments** de ces actions, calculés **en un même point**, est **nulle** — le solide ne tourne pas.

> Les deux sont nécessaires : deux forces égales et opposées mais non alignées ont une somme nulle et forment pourtant un **couple**, qui fait tourner le solide. Vérifier la seule première condition ne prouve rien.

## En projection
Dans un problème plan, ces deux conditions donnent **trois équations scalaires** :
- somme des composantes sur x = 0 ;
- somme des composantes sur y = 0 ;
- somme des moments en un point = 0.

Trois équations, donc au plus **trois inconnues** résolubles. Si le problème en comporte davantage, il est dit **hyperstatique** et exige des hypothèses supplémentaires.

## La méthode, dans l’ordre
1. **Isoler** le solide.
2. Faire le **bilan** des actions extérieures.
3. Choisir un **repère** commode.
4. Choisir le **point de calcul des moments** — et c’est le choix qui décide de la difficulté : le prendre là où passent le plus d’inconnues les élimine, puisque leur moment y est nul.
5. Écrire les trois équations, résoudre, **vérifier l’homogénéité** et la vraisemblance des résultats.

## Le frottement
Tant que le solide ne glisse pas, la composante tangentielle T de l’action de contact s’ajuste d’elle-même pour équilibrer les autres actions, jusqu’à la limite :

T ≤ f × N

où N est la composante normale et f le **coefficient de frottement**. Au-delà, le glissement commence.

L’**adhérence** est ce qui empêche le glissement ; le **frottement** est ce qui s’oppose au glissement en cours. Une pièce sur un plan incliné reste immobile tant que l’angle du plan reste inférieur à l’**angle d’adhérence**.`,
          },
          questions: [
            ['Quelles sont les deux conditions d’équilibre d’un solide ?', ['Somme des forces nulle et somme des moments nulle en un même point', 'Somme des forces nulle seulement', 'Somme des moments nulle seulement', 'Vitesse nulle et accélération nulle'], 0, 'Les deux sont nécessaires et doivent être vérifiées simultanément.'],
            ['Deux forces égales et opposées mais non alignées maintiennent un solide en équilibre.', ['Vrai', 'Faux'], 1, 'Elles forment un COUPLE : la somme est nulle, mais le solide tourne.'],
            ['Combien d’équations scalaires le principe fondamental fournit-il dans un problème plan ?', ['Trois', 'Deux', 'Six', 'Une'], 0, 'Deux de forces et une de moment : donc trois inconnues au plus.'],
            ['Comment choisir judicieusement le point de calcul des moments ?', ['Là où passent le plus d’inconnues, pour les éliminer', 'Toujours au centre de gravité', 'Toujours à l’origine du repère', 'Au hasard, cela ne change rien'], 0, 'Une force dont la droite d’action passe par le point a un moment nul.'],
            ['Qu’est-ce qu’un système hyperstatique ?', ['Un système comportant plus d’inconnues que d’équations disponibles', 'Un système en mouvement', 'Un système sans frottement', 'Un système soumis à trois forces'], 0, 'Sa résolution exige des hypothèses supplémentaires.'],
            ['Quelle est la condition de non-glissement au contact ?', ['T ≤ f × N', 'T ≥ f × N', 'T = N', 'T = 0'], 0, 'f est le coefficient de frottement, N la composante normale.'],
            ['La composante tangentielle du contact s’ajuste tant que le solide ne glisse pas.', ['Vrai', 'Faux'], 0, 'Elle équilibre les autres actions jusqu’à atteindre sa valeur limite.'],
            ['Que vérifie-t-on à la fin d’une résolution de statique ?', ['L’homogénéité et la vraisemblance des résultats', 'La couleur des pièces', 'Le coût du montage', 'Le nombre de liaisons'], 0, 'Une intensité en mètres ou une force de 10⁶ N signale une erreur.'],
          ],
        },

        // ---- Chapitre 3 : théorie des mécanismes ----------------------------
        {
          titre: 'Énergie et puissance',
          axe: 'Théorie des mécanismes',
          lecon: {
            titre: 'Rendement d’une chaîne d’énergie',
            cours: `Un système technique **transforme** de l’énergie : électrique en mécanique dans un moteur, mécanique en électrique dans une génératrice, chimique en électrique dans une batterie.

## Énergie et puissance
La **puissance** est un débit d’énergie : l’énergie transférée par unité de temps.

P = E / Δt, donc E = P × Δt

L’énergie s’exprime en **joules**, la puissance en **watts**. Le **kilowattheure**, unité des factures, vaut 3,6 × 10⁶ J.

## Les expressions à connaître
- **Électrique** : P = U × I ; en courant continu, la puissance dissipée par une résistance vaut P = R × I².
- **Mécanique en translation** : P = F × v, produit d’une force par une vitesse.
- **Mécanique en rotation** : P = C × ω, produit d’un **couple** (en N·m) par une **vitesse angulaire** (en rad/s).

> Le passage entre tours par minute et radians par seconde est un calcul de conversion demandé à chaque devoir : ω = 2π × N / 60, où N est en tours par minute.

## Le rendement
Aucune conversion n’est parfaite. Le **rendement** est le rapport de la puissance utile à la puissance absorbée :

η = P(utile) / P(absorbée)

Il est **toujours inférieur à 1** : la différence part en pertes — effet Joule dans les bobinages, frottements dans les paliers, échauffement, bruit.

## Rendement d’une chaîne
Les rendements des maillons successifs se **multiplient** :

η(total) = η1 × η2 × η3

Trois maillons à 90 % donnent 0,90 × 0,90 × 0,90 ≈ 0,73, soit 73 % seulement. C’est le résultat contre-intuitif du chapitre : une chaîne longue perd beaucoup, même si chaque maillon est bon.

## Conséquences de conception
Améliorer le rendement d’un système, c’est d’abord **réduire le nombre de conversions**, puis agir sur le maillon **le plus mauvais** — un maillon à 50 % plafonne tout le reste, quel que soit le soin apporté aux autres.`,
          },
          questions: [
            ['Quelle relation lie puissance et énergie ?', ['P = E / Δt', 'P = E × Δt', 'E = P / Δt', 'P = E + Δt'], 0, 'La puissance est un débit d’énergie, en watts.'],
            ['Quelle est l’expression de la puissance mécanique en rotation ?', ['P = C × ω', 'P = F × v', 'P = U × I', 'P = C / ω'], 0, 'Le couple en N·m multiplié par la vitesse angulaire en rad/s.'],
            ['Comment se combinent les rendements des maillons successifs d’une chaîne ?', ['Ils se multiplient', 'Ils s’additionnent', 'On prend le plus grand', 'On fait leur moyenne'], 0, 'Trois maillons à 90 % donnent environ 73 % au total.'],
            ['Un rendement peut-il dépasser 1 ?', ['Non, jamais', 'Oui, avec un moteur performant', 'Oui, en régime transitoire', 'Oui, si le système stocke de l’énergie'], 0, 'La puissance utile ne peut excéder la puissance absorbée.'],
            ['Comment convertit-on une vitesse en tours par minute en radians par seconde ?', ['ω = 2π × N / 60', 'ω = N / 60', 'ω = 2π × N', 'ω = 60 × N / 2π'], 0, 'Conversion demandée à presque chaque exercice de puissance.'],
            ['Quelle est l’expression de la puissance mécanique en translation ?', ['P = F × v', 'P = F / v', 'P = C × ω', 'P = F × d'], 0, 'Une force multipliée par une vitesse.'],
            ['Pour améliorer le rendement global, il faut d’abord agir sur le maillon le plus mauvais.', ['Vrai', 'Faux'], 0, 'Un maillon à 50 % plafonne tout le reste de la chaîne.'],
            ['Où partent les pertes dans une chaîne d’énergie ?', ['En effet Joule, frottements, échauffement et bruit', 'Elles disparaissent', 'Elles reviennent à la source', 'Elles augmentent la puissance utile'], 0, 'Elles sont dégradées, principalement en chaleur.'],
          ],
        },

        // ---- Chapitre 4 : cinématique ---------------------------------------
        {
          titre: 'Cinématique du point',
          axe: 'Cinématique',
          lecon: {
            titre: 'Position, vitesse, accélération',
            cours: `La **cinématique** décrit les mouvements **sans se préoccuper de leurs causes**. C’est la différence avec la dynamique, qui les explique par les forces.

## Les trois grandeurs
- La **position** est repérée par un vecteur depuis l’origine du repère.
- La **vitesse** est la variation de la position par unité de temps ; son vecteur est **tangent à la trajectoire**, orienté dans le sens du mouvement, en m/s.
- L’**accélération** est la variation du **vecteur** vitesse ; en m/s².

> Point capital : le vecteur vitesse peut changer par sa **valeur** ou par sa **direction**. Un mobile qui tourne à vitesse constante accélère, au sens de la mécanique.

## Le mouvement de rotation
Pour un point situé à la distance R de l’axe, tournant à la vitesse angulaire ω (en rad/s) :

v = ω × R

Tous les points d’un solide en rotation ont la **même** vitesse angulaire, mais des vitesses linéaires **différentes** : plus le point est loin de l’axe, plus il va vite. C’est pourquoi l’extrémité d’une pale se déplace bien plus vite que sa base.

L’accélération d’un point en mouvement circulaire uniforme est dirigée **vers le centre** et vaut a = v² / R.

## Les mouvements de base
- **Rectiligne uniforme** : vitesse constante en valeur et en direction, accélération nulle, x = v × t + x0.
- **Rectiligne uniformément varié** : accélération constante, la vitesse varie linéairement, la position quadratiquement.
- **Circulaire uniforme** : valeur de la vitesse constante, accélération centripète non nulle.

## Transmission de mouvement
Deux roues dentées ou deux poulies en prise ont la **même vitesse linéaire au contact**, donc des vitesses angulaires inversement proportionnelles à leurs rayons. C’est le **rapport de réduction** :

ω(sortie) / ω(entrée) = R(entrée) / R(sortie)

Un réducteur diminue la vitesse et **augmente le couple** dans la même proportion — la puissance, elle, se conserve aux pertes près. C’est la raison d’être de toute boîte de vitesses.`,
          },
          questions: [
            ['Qu’étudie la cinématique ?', ['Les mouvements sans se préoccuper de leurs causes', 'Les forces qui provoquent les mouvements', 'L’énergie des systèmes', 'Les déformations des solides'], 0, 'C’est la dynamique qui relie mouvements et forces.'],
            ['Quelle relation lie vitesse linéaire et vitesse angulaire ?', ['v = ω × R', 'v = ω / R', 'v = R / ω', 'v = ω × R²'], 0, 'R est la distance du point à l’axe de rotation.'],
            ['Tous les points d’un solide en rotation ont la même vitesse linéaire.', ['Vrai', 'Faux'], 1, 'Ils ont la même vitesse ANGULAIRE ; la vitesse linéaire croît avec la distance à l’axe.'],
            ['Un mobile en mouvement circulaire uniforme a-t-il une accélération ?', ['Oui, dirigée vers le centre', 'Non, sa vitesse est constante', 'Oui, tangente à la trajectoire', 'Non, son accélération est nulle par définition'], 0, 'La direction du vecteur vitesse change en permanence.'],
            ['Que fait un réducteur au couple transmis ?', ['Il l’augmente dans la même proportion qu’il réduit la vitesse', 'Il le diminue', 'Il le laisse inchangé', 'Il l’annule'], 0, 'La puissance se conserve, aux pertes près.'],
            ['Le vecteur vitesse est tangent à la trajectoire.', ['Vrai', 'Faux'], 0, 'Et orienté dans le sens du mouvement.'],
            ['Quelle est l’unité de la vitesse angulaire dans le Système international ?', ['Le radian par seconde', 'Le tour par minute', 'Le mètre par seconde', 'Le degré par seconde'], 0, 'Les tours par minute doivent y être convertis avant tout calcul.'],
            ['Dans un mouvement rectiligne uniformément varié, comment varie la position avec le temps ?', ['De façon quadratique', 'De façon linéaire', 'De façon constante', 'De façon exponentielle'], 0, 'La vitesse, elle, varie linéairement.'],
          ],
        },

        // ---- Chapitre 5 : transfert de l’information -------------------------
        {
          titre: 'Les signaux',
          axe: 'Transfert de l’information',
          lecon: {
            titre: 'Analogique, numérique, logique',
            cours: `Un **signal** est la grandeur physique qui porte une information : une tension, un courant, une onde lumineuse ou radio.

## Trois natures de signal
- **Analogique** : il varie **continûment** et peut prendre une infinité de valeurs. La tension délivrée par un microphone en est un.
- **Numérique** : il ne prend qu’un nombre **fini** de valeurs, codées en binaire.
- **Logique** : cas particulier du numérique à **deux** états seulement, 0 et 1, correspondant à deux plages de tension.

## De l’analogique au numérique
La conversion se fait en trois étapes :
1. l’**échantillonnage** : on prélève la valeur du signal à intervalles réguliers. La **fréquence d’échantillonnage** doit être au moins **double** de la plus haute fréquence du signal, faute de quoi l’information est irrémédiablement perdue ;
2. la **quantification** : chaque échantillon est arrondi à la valeur la plus proche parmi celles disponibles. Le nombre de valeurs dépend de la **résolution** — n bits donnent 2 puissance n niveaux ;
3. le **codage** : chaque niveau est écrit en binaire.

> Deux conséquences : plus la fréquence d’échantillonnage et la résolution sont élevées, plus la copie est fidèle — et plus le fichier est lourd. Tout le débat de la compression tient dans cet arbitrage.

## Pourquoi le numérique s’est imposé
Un signal analogique se dégrade à chaque copie et à chaque transmission, et le bruit accumulé ne s’enlève plus. Une suite de 0 et de 1 se **régénère exactement** : tant que le bruit ne dépasse pas le seuil de décision, le signal reconstruit est identique à l’original. Il se corrige en outre par des **codes détecteurs et correcteurs d’erreurs**.

## Caractériser un signal
Un signal périodique se décrit par sa **période**, sa **fréquence** (f = 1 / T), son **amplitude** et, pour un signal logique, son **rapport cyclique** — la fraction de la période pendant laquelle il vaut 1. C’est ce dernier que l’on fait varier en **MLI** (modulation de largeur d’impulsion) pour régler la puissance envoyée à un moteur ou l’intensité d’une LED.`,
          },
          questions: [
            ['Qu’est-ce qu’un signal logique ?', ['Un signal numérique à deux états seulement', 'Un signal qui varie continûment', 'Un signal sans bruit', 'Un signal de fréquence fixe'], 0, '0 et 1, correspondant à deux plages de tension.'],
            ['Quelles sont les trois étapes de la conversion analogique-numérique ?', ['Échantillonnage, quantification, codage', 'Amplification, filtrage, transmission', 'Mesure, calcul, affichage', 'Compression, envoi, décompression'], 0, 'Dans cet ordre, et chacune a son effet propre sur la fidélité.'],
            ['Quelle doit être au minimum la fréquence d’échantillonnage ?', ['Le double de la plus haute fréquence du signal', 'La moitié de la fréquence du signal', 'Égale à la fréquence du signal', 'Dix fois la fréquence du signal'], 0, 'En dessous, l’information est irrémédiablement perdue.'],
            ['Combien de niveaux permet une quantification sur n bits ?', ['2 puissance n', 'n', 'n²', '2 × n'], 0, 'Huit bits donnent 256 niveaux.'],
            ['Un signal numérique se dégrade à chaque copie, comme un signal analogique.', ['Vrai', 'Faux'], 1, 'Il se RÉGÉNÈRE exactement tant que le bruit reste sous le seuil de décision.'],
            ['Qu’est-ce que le rapport cyclique d’un signal logique ?', ['La fraction de la période pendant laquelle le signal vaut 1', 'Le nombre de périodes par seconde', 'L’amplitude du signal', 'Le temps de montée'], 0, 'C’est lui que fait varier une modulation de largeur d’impulsion.'],
            ['À quoi sert la modulation de largeur d’impulsion (MLI) ?', ['À régler la puissance moyenne envoyée à un récepteur', 'À convertir un signal analogique', 'À corriger les erreurs de transmission', 'À amplifier un signal faible'], 0, 'Elle pilote la vitesse d’un moteur ou l’intensité d’une LED.'],
            ['Augmenter la résolution d’une numérisation augmente la taille du fichier.', ['Vrai', 'Faux'], 0, 'Fidélité et poids sont l’arbitrage permanent de la numérisation.'],
          ],
        },
        {
          titre: 'Codage de l’information',
          axe: 'Transfert de l’information',
          lecon: {
            titre: 'Binaire, hexadécimal et codage des caractères',
            cours: `Toute information traitée par un système numérique est une suite de **bits**. Ce qu’elle représente dépend entièrement de la **convention** de codage choisie.

## Les bases
- **Binaire** (base 2) : chiffres 0 et 1. C’est la seule base que le circuit connaît réellement.
- **Décimal** (base 10) : notre notation usuelle.
- **Hexadécimal** (base 16) : chiffres 0 à 9 puis A à F. Il sert d’**abréviation** du binaire, un chiffre hexadécimal valant exactement **quatre bits**.

Conversion binaire → décimal : chaque bit vaut son poids, puissance de 2 croissante de droite à gauche. 1011 vaut 8 + 0 + 2 + 1 = 11.

Conversion décimal → binaire : divisions successives par 2, les restes lus **de bas en haut**.

## Les unités
- 1 **octet** (byte) = 8 bits, et permet 256 valeurs (0 à 255).
- Un mot de n bits code 2 puissance n valeurs différentes : c’est la relation à savoir manier dans les deux sens.

## Coder autre chose que des nombres
- Les **caractères** : le code **ASCII** sur 7 bits, insuffisant pour les langues accentuées, remplacé par **Unicode** et son encodage **UTF-8**, à longueur variable, qui couvre tous les alphabets.
- Les **images** : une image matricielle est un tableau de **pixels**, chacun codé par ses composantes rouge, verte et bleue — souvent un octet par composante, soit plus de 16 millions de couleurs.
- Les **entiers signés** : un bit sert au signe, ou l’on emploie le complément à deux.

> Le même mot binaire 01000001 vaut 65 en entier, la lettre A en ASCII, ou une nuance de gris dans une image. **Rien dans le mot lui-même ne dit ce qu’il représente** : c’est la convention, portée par le programme, qui l’interprète.

## Détecter les erreurs
Un **bit de parité** ajouté à chaque mot permet de détecter un nombre impair d’erreurs de transmission — sans les corriger. Les codes correcteurs, plus élaborés, retrouvent la valeur exacte au prix de bits supplémentaires.`,
          },
          questions: [
            ['Combien de valeurs différentes un octet peut-il coder ?', ['256', '8', '128', '512'], 0, 'Huit bits, donc 2 puissance 8 combinaisons.'],
            ['À combien de bits correspond un chiffre hexadécimal ?', ['Quatre', 'Huit', 'Deux', 'Seize'], 0, 'C’est ce qui fait de l’hexadécimal une abréviation commode du binaire.'],
            ['Que vaut le nombre binaire 1011 en décimal ?', ['11', '13', '9', '7'], 0, '8 + 0 + 2 + 1 = 11.'],
            ['Le mot binaire lui-même indique ce qu’il représente.', ['Vrai', 'Faux'], 1, 'Seule la convention d’interprétation, portée par le programme, le dit.'],
            ['Quel codage a remplacé l’ASCII pour couvrir tous les alphabets ?', ['Unicode, notamment via UTF-8', 'Le binaire pur', 'L’hexadécimal', 'Le code de parité'], 0, 'L’ASCII sur 7 bits ne suffisait pas aux langues accentuées.'],
            ['Combien de valeurs code un mot de n bits ?', ['2 puissance n', 'n puissance 2', '2 × n', 'n / 2'], 0, 'Relation à savoir utiliser dans les deux sens.'],
            ['Un bit de parité permet de corriger une erreur de transmission.', ['Vrai', 'Faux'], 1, 'Il permet de la DÉTECTER ; corriger exige un code correcteur.'],
            ['Comment convertit-on un nombre décimal en binaire ?', ['Par divisions successives par 2, en lisant les restes de bas en haut', 'En multipliant par 2', 'En le divisant par 16', 'En ajoutant les puissances de 10'], 0, 'L’ordre de lecture des restes est le piège habituel.'],
          ],
        },
        {
          titre: 'Les opérateurs logiques fondamentaux',
          axe: 'Transfert de l’information',
          lecon: {
            titre: 'NON, ET, OU',
            cours: `Trois opérateurs suffisent à construire toute fonction logique. Chacun se définit par une **table de vérité**, qui donne la sortie pour chaque combinaison d’entrées.

## NON (NOT)
Un seul opérande : la sortie est l’**inverse** de l’entrée. On la note avec une barre au-dessus, ou par le mot NON.

- entrée 0 → sortie 1
- entrée 1 → sortie 0

## ET (AND)
La sortie vaut 1 **si et seulement si toutes** les entrées valent 1. On la note par un point, comme une multiplication — et ce n’est pas un hasard : 0 × 1 = 0, 1 × 1 = 1.

Table pour deux entrées : 00 → 0, 01 → 0, 10 → 0, **11 → 1**.

Usage typique : une sécurité qui exige **plusieurs** conditions simultanées — la presse ne démarre que si les deux mains sont sur les boutons.

## OU (OR)
La sortie vaut 1 **dès qu’au moins une** entrée vaut 1. On la note par un signe plus.

Table : 00 → 0, 01 → 1, 10 → 1, **11 → 1**.

> Attention : c’est un OU **inclusif**. « 1 OU 1 » vaut 1, à la différence du « ou » exclusif du langage courant (fromage ou dessert).

Usage typique : une alarme déclenchée par **n’importe lequel** des capteurs.

## Les opérateurs dérivés
- **NON-ET** (NAND) et **NON-OU** (NOR) : la sortie du ET ou du OU, inversée. Ils sont dits **universels** : avec des NAND seuls, on reconstruit NON, ET, OU — et donc n’importe quelle fonction logique. C’est pourquoi l’industrie les fabrique en masse.
- **OU EXCLUSIF** (XOR) : la sortie vaut 1 si les entrées sont **différentes**. Il détecte les changements et sert dans les additionneurs et les codes correcteurs.

## Combien de lignes dans une table ?
Une fonction à n entrées a une table de **2 puissance n** lignes : 4 pour deux entrées, 8 pour trois, 16 pour quatre. Les écrire dans l’ordre binaire croissant évite d’en oublier.`,
          },
          questions: [
            ['Quand la sortie d’un opérateur ET vaut-elle 1 ?', ['Seulement si toutes les entrées valent 1', 'Si au moins une entrée vaut 1', 'Si les entrées sont différentes', 'Si toutes les entrées valent 0'], 0, 'C’est l’opérateur des conditions simultanées.'],
            ['Le OU logique est-il inclusif ou exclusif ?', ['Inclusif : 1 OU 1 vaut 1', 'Exclusif : 1 OU 1 vaut 0', 'Cela dépend du circuit', 'Il n’a pas de valeur pour 1 OU 1'], 0, 'Le OU EXCLUSIF, lui, vaut 1 quand les entrées diffèrent.'],
            ['Combien de lignes compte la table de vérité d’une fonction à trois entrées ?', ['Huit', 'Six', 'Trois', 'Neuf'], 0, '2 puissance 3 combinaisons possibles.'],
            ['Pourquoi l’opérateur NON-ET est-il dit universel ?', ['Parce qu’il permet de reconstruire toutes les autres fonctions logiques', 'Parce qu’il est le plus rapide', 'Parce qu’il consomme moins', 'Parce qu’il a une seule entrée'], 0, 'C’est pourquoi l’industrie le fabrique en masse.'],
            ['Quand la sortie d’un OU EXCLUSIF vaut-elle 1 ?', ['Quand les entrées sont différentes', 'Quand les entrées sont identiques', 'Quand les deux valent 1', 'Quand les deux valent 0'], 0, 'Il sert dans les additionneurs et les codes correcteurs.'],
            ['La sortie d’un opérateur NON est l’inverse de son entrée.', ['Vrai', 'Faux'], 0, 'C’est le seul opérateur fondamental à une seule entrée.'],
            ['Que vaut la sortie d’un NON-OU dont les deux entrées valent 0 ?', ['1', '0', 'Indéterminée', 'Cela dépend du circuit'], 0, 'Le OU donnerait 0 ; le NON-OU l’inverse.'],
            ['Un dispositif de sécurité à deux boutons à presser simultanément utilise un opérateur ET.', ['Vrai', 'Faux'], 0, 'Toutes les conditions doivent être réunies pour autoriser le démarrage.'],
          ],
        },
        {
          titre: 'Association de portes logiques',
          axe: 'Transfert de l’information',
          lecon: {
            titre: 'Du cahier des charges au logigramme',
            cours: `Une **porte logique** est le composant électronique qui réalise un opérateur. Les associer permet de construire n’importe quelle fonction.

## Le logigramme
C’est le schéma d’un montage de portes : les entrées à gauche, les portes au centre, la sortie à droite. Chaque porte a son **symbole normalisé**, et le sens de lecture est toujours le même.

## Les trois représentations
Une même fonction logique s’exprime de trois façons **équivalentes** :
- la **table de vérité**, exhaustive ;
- l’**équation logique**, algébrique ;
- le **logigramme**, graphique.

Savoir passer de l’une à l’autre **dans les deux sens** est la compétence centrale du chapitre.

## De la table à l’équation
Deux méthodes, au choix :
- **somme de produits** : on retient les lignes où la sortie vaut **1**, on écrit pour chacune le produit des entrées (complémentées si elles valent 0), et l’on additionne ces produits ;
- **produit de sommes** : on part des lignes où la sortie vaut 0.

La première est la plus employée, parce qu’il y a en général moins de 1 que de 0 — et parce qu’elle se lit directement.

## De l’équation au logigramme
Chaque opération devient une porte, en respectant les **priorités** : le complément d’abord, puis le ET, puis le OU. Une équation mal parenthésée donne un montage faux même si l’algèbre était juste.

## Analyser un montage existant
Le chemin inverse : nommer les sorties intermédiaires porte par porte, écrire l’équation de chacune, remonter jusqu’à la sortie finale, puis dresser la table de vérité pour vérifier. C’est la méthode à appliquer quand un énoncé fournit un logigramme sans explication.

> Retenir qu’un même comportement admet **plusieurs logigrammes** : le plus simple n’est pas toujours le plus lisible, et le moins coûteux dépend des portes réellement disponibles dans le boîtier utilisé.`,
          },
          questions: [
            ['Quelles sont les trois représentations équivalentes d’une fonction logique ?', ['Table de vérité, équation logique et logigramme', 'Schéma, plan et notice', 'Diagramme d’états, de blocs et de séquence', 'Binaire, décimal et hexadécimal'], 0, 'Savoir passer de l’une à l’autre est la compétence centrale.'],
            ['Dans la méthode de la somme de produits, quelles lignes retient-on ?', ['Celles où la sortie vaut 1', 'Celles où la sortie vaut 0', 'Toutes les lignes', 'La première et la dernière'], 0, 'La méthode du produit de sommes part, elle, des lignes à 0.'],
            ['Quel est l’ordre de priorité des opérations logiques ?', ['Complément, puis ET, puis OU', 'OU, puis ET, puis complément', 'ET, puis OU, puis complément', 'Toutes au même niveau'], 0, 'Une équation mal parenthésée donne un montage faux.'],
            ['Un même comportement logique n’admet qu’un seul logigramme possible.', ['Vrai', 'Faux'], 1, 'Plusieurs montages équivalents existent, de coûts et de lisibilité différents.'],
            ['Comment analyse-t-on un logigramme fourni sans explication ?', ['En nommant les sorties intermédiaires porte par porte, puis en remontant', 'En comptant les portes', 'En mesurant les tensions', 'En simulant au hasard'], 0, 'On dresse ensuite la table de vérité pour vérifier.'],
            ['Où se trouvent les entrées sur un logigramme normalisé ?', ['À gauche', 'À droite', 'En bas', 'Au centre'], 0, 'La sortie est à droite : le sens de lecture est toujours le même.'],
            ['Pourquoi la somme de produits est-elle la méthode la plus employée ?', ['Parce qu’il y a en général moins de 1 que de 0 dans une table', 'Parce qu’elle est plus rigoureuse', 'Parce qu’elle évite les portes NON', 'Parce qu’elle donne toujours le montage le moins cher'], 0, 'Elle se lit aussi plus directement depuis la table.'],
            ['Le choix du logigramme le moins coûteux dépend des portes disponibles dans le boîtier.', ['Vrai', 'Faux'], 0, 'Un montage n’utilisant qu’un type de porte peut être préférable en pratique.'],
          ],
        },
        {
          titre: 'Algèbre de Boole',
          axe: 'Transfert de l’information',
          lecon: {
            titre: 'Les règles du calcul logique',
            cours: `L’**algèbre de Boole** manipule des variables ne prenant que deux valeurs, 0 et 1. Elle donne les règles qui permettent de **transformer** une équation logique sans changer la fonction qu’elle décrit.

## Les propriétés de base
Avec le point pour le ET et le plus pour le OU :
- **Éléments neutres** : a . 1 = a et a + 0 = a
- **Éléments absorbants** : a . 0 = 0 et a + 1 = 1
- **Idempotence** : a . a = a et a + a = a
- **Complémentarité** : a . complément de a = 0 et a + complément de a = 1
- **Involution** : le complément du complément de a vaut a

> Les deux dernières colonnes sont celles qui font disparaître des termes entiers dans une simplification. « a + complément de a = 1 » est la règle qui simplifie le plus.

## Les propriétés structurelles
- **Commutativité** : a . b = b . a et a + b = b + a
- **Associativité** : (a . b) . c = a . (b . c)
- **Distributivité**, et c’est ici que l’algèbre de Boole s’écarte de l’algèbre ordinaire : le ET est distributif sur le OU **comme en arithmétique**, mais le **OU est aussi distributif sur le ET** :

a + (b . c) = (a + b) . (a + c)

Cette seconde égalité serait fausse avec des nombres. C’est le piège du chapitre.

## Les lois de De Morgan
Les deux relations les plus utiles de tout le programme :

le complément de (a . b) = complément de a + complément de b
le complément de (a + b) = complément de a . complément de b

Autrement dit : **on complémente chaque terme et on échange les opérateurs**. Elles servent à transformer un montage pour n’employer qu’un seul type de porte — un montage tout en NON-ET, par exemple.

## Le théorème d’absorption
a + (a . b) = a et a . (a + b) = a

Il élimine des termes entiers sans calcul, et c’est souvent lui qui fait passer d’une équation à cinq termes à une équation à deux.`,
          },
          questions: [
            ['Que vaut a + complément de a ?', ['1', '0', 'a', 'Le complément de a'], 0, 'C’est la règle de complémentarité, qui simplifie le plus souvent.'],
            ['Que vaut a + 1 en algèbre de Boole ?', ['1', 'a', '0', '2'], 0, 'Le 1 est absorbant pour le OU.'],
            ['En algèbre de Boole, le OU est distributif sur le ET.', ['Vrai', 'Faux'], 0, 'a + (b . c) = (a + b) . (a + c) : cette égalité serait fausse avec des nombres.'],
            ['Que donne la loi de De Morgan appliquée au complément de (a . b) ?', ['Complément de a + complément de b', 'Complément de a . complément de b', 'a + b', 'a . b'], 0, 'On complémente chaque terme et on échange les opérateurs.'],
            ['Que vaut a . a en algèbre de Boole ?', ['a', 'a²', '0', '1'], 0, 'C’est l’idempotence : une variable ET elle-même ne change rien.'],
            ['À quoi servent principalement les lois de De Morgan ?', ['À transformer un montage pour n’employer qu’un seul type de porte', 'À calculer une table de vérité', 'À convertir en hexadécimal', 'À mesurer un signal'], 0, 'Un montage tout en NON-ET, par exemple.'],
            ['Que vaut a + (a . b) ?', ['a', 'a . b', 'b', '1'], 0, 'C’est le théorème d’absorption, qui élimine des termes entiers.'],
            ['Le complément du complément de a vaut le complément de a.', ['Vrai', 'Faux'], 1, 'Il vaut a : c’est la propriété d’involution.'],
          ],
        },
        {
          titre: 'Simplification des expressions logiques',
          axe: 'Transfert de l’information',
          lecon: {
            titre: 'Moins de portes, moins de coût',
            cours: `**Simplifier** une expression logique, c’est trouver une écriture équivalente employant **moins de termes et moins de variables**. L’enjeu est concret : moins de portes, donc moins de composants, moins de place, moins de consommation, moins de pannes possibles et un coût plus bas.

## Simplifier par l’algèbre
On applique les règles de Boole, dans un ordre qui n’est pas indifférent :
1. supprimer les compléments doubles ;
2. appliquer De Morgan pour faire descendre les compléments sur les variables ;
3. **factoriser** les termes qui partagent une variable ;
4. faire apparaître « x + complément de x = 1 » pour éliminer une variable entière ;
5. appliquer l’absorption.

La difficulté est qu’aucune méthode ne garantit qu’on est arrivé au plus simple : on peut toujours avoir manqué une factorisation.

## Le tableau de Karnaugh
D’où l’intérêt de cette méthode **graphique**, systématique et sans risque d’oubli.

- On dresse un tableau à 2 puissance n cases, une par ligne de la table de vérité, et l’on y reporte les sorties.
- Les cases voisines ne diffèrent que par **une seule variable** : c’est la propriété qui fait tout fonctionner, et c’est pourquoi les en-têtes suivent un **code de Gray** (00, 01, **11**, 10) et non l’ordre binaire naturel.
- On regroupe les 1 en **paquets rectangulaires** dont la taille est une **puissance de 2** — 1, 2, 4, 8 cases —, aussi **grands** que possible, quitte à ce qu’ils se **chevauchent**.
- Le tableau se referme sur lui-même : les cases des bords **gauche et droit** sont voisines, comme celles du haut et du bas.
- Chaque groupe donne un terme où l’on ne garde que les variables **constantes** dans le groupe. Un groupe deux fois plus grand élimine une variable de plus.

> Deux erreurs classiques : écrire les en-têtes en binaire naturel (les voisinages sont alors faux), et former de petits groupes alors qu’un plus grand était possible — le résultat reste juste, mais il n’est pas simplifié.

## Les cas indifférents
Certaines combinaisons d’entrées **ne peuvent pas se produire** dans le système réel. On les note φ dans le tableau et on les utilise **librement** : les inclure dans un groupe s’il agrandit ce groupe, les ignorer sinon. Elles sont un cadeau pour la simplification.`,
          },
          questions: [
            ['Pourquoi simplifie-t-on une expression logique ?', ['Pour réduire le nombre de portes, donc le coût et la consommation', 'Pour changer la fonction réalisée', 'Pour augmenter la vitesse du signal', 'Pour éviter les tables de vérité'], 0, 'Moins de composants, moins de place, moins de pannes possibles.'],
            ['Pourquoi les en-têtes d’un tableau de Karnaugh suivent-ils un code de Gray ?', ['Pour que deux cases voisines ne diffèrent que par une seule variable', 'Pour économiser de la place', 'Par convention historique', 'Pour respecter l’ordre binaire'], 0, 'C’est la propriété qui rend les regroupements valides.'],
            ['Quelle doit être la taille d’un groupe dans un tableau de Karnaugh ?', ['Une puissance de 2', 'Un nombre pair quelconque', 'Trois cases au minimum', 'Toujours quatre cases'], 0, '1, 2, 4, 8… et aussi grands que possible.'],
            ['Les groupes d’un tableau de Karnaugh peuvent se chevaucher.', ['Vrai', 'Faux'], 0, 'Et il faut les faire aussi grands que possible, quitte à les superposer.'],
            ['Les cases des bords gauche et droit d’un tableau de Karnaugh sont-elles voisines ?', ['Oui, le tableau se referme sur lui-même', 'Non, jamais', 'Seulement pour trois variables', 'Seulement si la sortie vaut 1'], 0, 'Comme celles du haut et du bas.'],
            ['Que garde-t-on d’un groupe pour écrire son terme ?', ['Les variables qui restent constantes dans tout le groupe', 'Toutes les variables', 'La variable la plus fréquente', 'Aucune variable'], 0, 'Un groupe deux fois plus grand élimine une variable de plus.'],
            ['Comment utilise-t-on les cas indifférents dans un tableau de Karnaugh ?', ['Librement, en les incluant s’ils agrandissent un groupe', 'On les traite toujours comme des 0', 'On les traite toujours comme des 1', 'On les supprime du tableau'], 0, 'Ce sont des combinaisons qui ne peuvent pas se produire : un cadeau pour simplifier.'],
            ['Former de petits groupes plutôt qu’un grand donne un résultat faux.', ['Vrai', 'Faux'], 1, 'Le résultat reste juste, mais l’expression n’est pas simplifiée au maximum.'],
          ],
        },
        {
          titre: 'Sécurité du transfert d’information',
          axe: 'Transfert de l’information',
          lecon: {
            titre: 'Intégrité, confidentialité, disponibilité',
            cours: `Sécuriser une transmission, c’est répondre à trois exigences distinctes — et une solution qui traite l’une ne traite pas forcément les autres.

## Les trois exigences
- L’**intégrité** : le message reçu est identique à celui qui a été émis.
- La **confidentialité** : seul le destinataire peut le lire.
- La **disponibilité** : le service reste accessible quand on en a besoin.

S’y ajoutent l’**authentification** — le destinataire est sûr de l’identité de l’émetteur — et la **non-répudiation**, qui empêche l’émetteur de nier avoir envoyé le message.

## Protéger l’intégrité
- Le **bit de parité** détecte un nombre impair d’erreurs, sans les corriger.
- La **somme de contrôle** et le **CRC** détectent des altérations plus complexes.
- Les **codes correcteurs** ajoutent assez de redondance pour retrouver la valeur exacte, ce qui est indispensable quand aucune retransmission n’est possible — une sonde spatiale, un disque optique rayé.
- La **fonction de hachage** produit une **empreinte** de taille fixe : la moindre modification du message change entièrement l’empreinte, ce qui rend l’altération détectable.

## Protéger la confidentialité
- Le **chiffrement symétrique** emploie la **même clé** pour chiffrer et déchiffrer : rapide, mais il faut transmettre la clé, et c’est là toute la difficulté.
- Le **chiffrement asymétrique** emploie une **clé publique** pour chiffrer et une **clé privée**, jamais transmise, pour déchiffrer. Plus lent, il résout le problème de l’échange de clés.
- En pratique on **combine** les deux : l’asymétrique sert à transmettre une clé symétrique de session, qui chiffre ensuite le trafic. C’est ce que fait HTTPS.

## La signature numérique
Elle inverse l’usage des clés : l’émetteur chiffre l’empreinte du message avec sa **clé privée**, et chacun peut la vérifier avec sa **clé publique**. Elle apporte l’authentification et la non-répudiation, mais **pas** la confidentialité — le message, lui, peut rester en clair.

> À retenir : le chiffrement protège le **contenu**, la signature garantit l’**origine**. Ce ne sont pas les mêmes besoins, et une bonne conception dit lequel elle vise.`,
          },
          questions: [
            ['Quelles sont les trois exigences fondamentales de la sécurité d’une transmission ?', ['Intégrité, confidentialité et disponibilité', 'Vitesse, coût et fiabilité', 'Chiffrement, hachage et compression', 'Émission, transport et réception'], 0, 'Authentification et non-répudiation viennent s’y ajouter.'],
            ['Qu’est-ce que le chiffrement asymétrique ?', ['Une clé publique pour chiffrer, une clé privée pour déchiffrer', 'La même clé pour chiffrer et déchiffrer', 'Un chiffrement sans clé', 'Un chiffrement à clé variable dans le temps'], 0, 'Il résout le problème de la transmission de la clé.'],
            ['Le chiffrement symétrique est plus rapide que l’asymétrique.', ['Vrai', 'Faux'], 0, 'C’est pourquoi on combine les deux : l’asymétrique transmet la clé de session.'],
            ['Que garantit une signature numérique ?', ['L’authentification et la non-répudiation, pas la confidentialité', 'La confidentialité du message', 'La disponibilité du service', 'La compression des données'], 0, 'Le message signé peut rester parfaitement lisible.'],
            ['Qu’est-ce qu’une fonction de hachage ?', ['Une fonction produisant une empreinte de taille fixe, très sensible à toute modification', 'Un algorithme de chiffrement réversible', 'Une méthode de compression', 'Un protocole de transmission'], 0, 'La moindre modification du message change entièrement l’empreinte.'],
            ['Quand un code correcteur est-il indispensable plutôt qu’un simple détecteur ?', ['Quand aucune retransmission n’est possible', 'Quand le message est court', 'Quand le canal est rapide', 'Quand le message est chiffré'], 0, 'Une sonde spatiale ou un disque optique rayé, par exemple.'],
            ['Avec quelle clé l’émetteur signe-t-il un message ?', ['Sa clé privée', 'Sa clé publique', 'La clé publique du destinataire', 'Une clé symétrique partagée'], 0, 'Chacun vérifie ensuite avec sa clé publique.'],
            ['Chiffrer un message garantit aussi l’identité de son émetteur.', ['Vrai', 'Faux'], 1, 'Le chiffrement protège le CONTENU ; la signature garantit l’ORIGINE.'],
          ],
        },
        {
          titre: 'Réseau de données',
          axe: 'Transfert de l’information',
          lecon: {
            titre: 'Adresses, protocoles et topologies',
            cours: `Un **réseau** relie des équipements pour qu’ils échangent des données. Le faire fonctionner suppose des règles communes : les **protocoles**.

## Les échelles
- **PAN** : quelques mètres, autour d’une personne (Bluetooth).
- **LAN** : un bâtiment, un atelier (Ethernet, Wi-Fi).
- **WAN** : une étendue géographique large — Internet en est le cas extrême.

## Les topologies
- **Bus** : un support unique partagé ; simple et peu coûteux, mais une coupure prive tout le monde.
- **Étoile** : tous les équipements reliés à un nœud central ; la panne d’une branche n’affecte qu’elle, celle du centre affecte tout. C’est la topologie dominante.
- **Anneau** et **maillée** : la seconde multiplie les chemins, donc la robustesse, au prix du câblage.

## Adresser
- L’**adresse MAC** est physique, unique et attribuée à la carte réseau en usine.
- L’**adresse IP** est logique, attribuée par le réseau, et peut changer — elle situe la machine dans le réseau, comme une adresse postale.
- Le **masque de sous-réseau** sépare, dans l’adresse IP, la partie qui désigne le **réseau** de celle qui désigne la **machine**. C’est lui qui permet de savoir si deux machines peuvent se parler directement ou doivent passer par un routeur.
- Le **port** désigne l’**application** destinataire sur la machine.

## Les protocoles
Ils sont organisés **en couches**, chacune ne s’occupant que de son problème :
- **Ethernet / Wi-Fi** : l’accès au support physique ;
- **IP** : l’adressage et le **routage**, de proche en proche, sans garantie de livraison ;
- **TCP** : la connexion fiable — accusés de réception, retransmission des paquets perdus, remise **dans l’ordre** ;
- **UDP** : sans connexion ni garantie, mais rapide, ce qui convient à la voix et à la vidéo en direct, où un paquet retransmis arriverait trop tard pour servir ;
- **HTTP, FTP, MQTT** : les applications. MQTT, léger et fondé sur la publication-abonnement, est devenu le protocole de référence des objets connectés.

> La logique du découpage en couches : chacune peut changer sans que les autres soient réécrites. C’est ce qui a permis au Wi-Fi de remplacer le câble sans toucher à HTTP.

## Les équipements
Le **commutateur** (*switch*) distribue les trames dans un réseau local d’après l’adresse MAC ; le **routeur** relie des réseaux différents et choisit le chemin d’après l’adresse IP ; le **point d’accès** raccorde les équipements sans fil.`,
          },
          questions: [
            ['Quelle différence entre une adresse MAC et une adresse IP ?', ['La MAC est physique et fixe, l’IP est logique et attribuée par le réseau', 'La MAC est attribuée par le réseau, l’IP par le constructeur', 'Elles sont identiques', 'La MAC désigne l’application, l’IP la machine'], 0, 'L’adresse IP situe la machine dans le réseau, comme une adresse postale.'],
            ['Quel protocole garantit la remise dans l’ordre et la retransmission des paquets perdus ?', ['TCP', 'UDP', 'IP', 'Ethernet'], 0, 'UDP, plus rapide, n’offre aucune de ces garanties.'],
            ['Pourquoi préfère-t-on UDP pour la voix en direct ?', ['Parce qu’un paquet retransmis arriverait trop tard pour servir', 'Parce qu’il est plus fiable', 'Parce qu’il chiffre les données', 'Parce qu’il consomme moins de bande passante que tout autre'], 0, 'La rapidité y prime sur l’exhaustivité.'],
            ['À quoi sert le masque de sous-réseau ?', ['À séparer la partie réseau de la partie machine dans une adresse IP', 'À chiffrer les communications', 'À attribuer les adresses MAC', 'À compter les équipements connectés'], 0, 'Il détermine si deux machines communiquent directement ou via un routeur.'],
            ['Que désigne un numéro de port ?', ['L’application destinataire sur la machine', 'La machine sur le réseau', 'La carte réseau', 'Le réseau lui-même'], 0, 'L’adresse IP situe la machine, le port l’application.'],
            ['Dans une topologie en étoile, la panne du nœud central n’affecte qu’une branche.', ['Vrai', 'Faux'], 1, 'Elle affecte TOUT le réseau ; c’est la panne d’une branche qui reste isolée.'],
            ['Quel équipement relie deux réseaux différents et choisit le chemin ?', ['Le routeur', 'Le commutateur', 'Le point d’accès', 'Le répéteur'], 0, 'Le commutateur, lui, distribue les trames à l’intérieur d’un même réseau local.'],
            ['Quel est l’intérêt d’organiser les protocoles en couches ?', ['Chaque couche peut évoluer sans que les autres soient réécrites', 'Cela accélère la transmission', 'Cela réduit le nombre d’adresses nécessaires', 'Cela chiffre automatiquement les données'], 0, 'Le Wi-Fi a remplacé le câble sans qu’HTTP change d’une ligne.'],
          ],
        },

        // ---- Chapitre 6 : électrocinétique -----------------------------------
        {
          titre: 'Le circuit électrique',
          axe: 'Électrocinétique',
          lecon: {
            titre: 'Lois des mailles et des nœuds',
            cours: `Un **circuit électrique** est un ensemble de dipôles reliés de façon à laisser circuler un courant. Deux lois suffisent à l’analyser entièrement.

## Les grandeurs
- L’**intensité** I, en ampères, est le débit de charges ; elle se mesure avec un ampèremètre placé **en série**.
- La **tension** U, en volts, est la différence de potentiel entre deux points ; elle se mesure avec un voltmètre placé **en dérivation**.

Une tension se représente par une **flèche** entre deux points ; une intensité, par une flèche **sur le fil**. Le sens conventionnel du courant va du **plus** vers le **moins** à l’extérieur du générateur.

## La loi des nœuds
En un **nœud** — un point où se rejoignent au moins trois fils —, la somme des intensités entrantes est égale à la somme des intensités sortantes. C’est la conservation de la charge : rien ne s’accumule dans un fil.

## La loi des mailles
Le long d’une **maille** — un parcours fermé —, la somme algébrique des tensions est **nulle**. C’est la conservation de l’énergie : en revenant au point de départ, on est revenu au même potentiel.

## Série et dérivation
- En **série**, l’intensité est **la même** partout et les tensions **s’additionnent**. Les résistances s’additionnent : R = R1 + R2. Une coupure arrête tout le circuit.
- En **dérivation**, la tension est **la même** aux bornes de chaque branche et les intensités **s’additionnent**. Les inverses des résistances s’additionnent. Une branche peut être coupée sans que les autres cessent de fonctionner — c’est pourquoi les installations domestiques sont câblées ainsi.

## Deux montages à connaître
- Le **pont diviseur de tension** : deux résistances en série partagent la tension proportionnellement à leur valeur. C’est le montage qui adapte un signal de capteur à l’entrée d’un microcontrôleur.
- Le **pont diviseur de courant**, son équivalent en dérivation.

> Erreur récurrente : brancher un ampèremètre en dérivation. Sa résistance étant presque nulle, il court-circuite le dipôle — l’appareil, ou le circuit, y passe.`,
          },
          questions: [
            ['Comment se branche un ampèremètre ?', ['En série dans la branche à mesurer', 'En dérivation aux bornes du dipôle', 'À la place du générateur', 'Peu importe'], 0, 'En dérivation, sa résistance quasi nulle court-circuiterait le dipôle.'],
            ['Que dit la loi des nœuds ?', ['La somme des intensités entrantes égale la somme des sortantes', 'La somme des tensions d’une maille est nulle', 'L’intensité est la même partout', 'La tension est la même partout'], 0, 'C’est la conservation de la charge électrique.'],
            ['Que dit la loi des mailles ?', ['La somme algébrique des tensions le long d’un parcours fermé est nulle', 'Les intensités s’additionnent', 'Les résistances s’additionnent', 'La puissance se conserve'], 0, 'En revenant au point de départ, on retrouve le même potentiel.'],
            ['En dérivation, la tension est la même aux bornes de chaque branche.', ['Vrai', 'Faux'], 0, 'Ce sont les intensités qui s’additionnent.'],
            ['Comment se combinent deux résistances en série ?', ['Elles s’additionnent', 'Leurs inverses s’additionnent', 'On prend la plus grande', 'On prend leur moyenne'], 0, 'En dérivation, ce sont leurs inverses qui s’additionnent.'],
            ['À quoi sert un pont diviseur de tension ?', ['À adapter un signal, par exemple à l’entrée d’un microcontrôleur', 'À mesurer une intensité', 'À produire un courant continu', 'À stocker de l’énergie'], 0, 'Deux résistances en série partagent la tension proportionnellement.'],
            ['Pourquoi les installations domestiques sont-elles câblées en dérivation ?', ['Pour qu’une branche coupée n’arrête pas les autres', 'Pour économiser du câble', 'Pour augmenter la tension', 'Pour réduire l’intensité totale'], 0, 'En série, une seule coupure arrêterait toute l’installation.'],
            ['Le sens conventionnel du courant va du moins vers le plus à l’extérieur du générateur.', ['Vrai', 'Faux'], 1, 'Il va du PLUS vers le MOINS à l’extérieur du générateur.'],
          ],
        },
        {
          titre: 'Les composants électriques : générateur, résistance et condensateur',
          axe: 'Électrocinétique',
          lecon: {
            titre: 'Trois dipôles, trois comportements',
            cours: `## Le générateur
Il fournit l’énergie électrique au circuit. Un générateur **réel** se modélise par une force électromotrice E en série avec une **résistance interne** r :

U = E − r × I

Plus le courant appelé est fort, plus la tension délivrée **chute**. C’est pourquoi les phares d’une voiture faiblissent au démarrage : le démarreur appelle un courant énorme.

Un générateur de **tension** idéal maintient U constante quel que soit I ; un générateur de **courant** idéal maintient I constante.

## La résistance
Un conducteur ohmique obéit à la **loi d’Ohm** :

U = R × I

en ohms. La puissance qu’il dissipe est intégralement thermique : P = U × I = R × I².

Ses usages : limiter un courant (la résistance en série d’une LED, sans laquelle elle grille), fixer une tension (pont diviseur), et convertir un signal (résistance de mesure).

La résistance d’un fil dépend de sa longueur, de sa section et du matériau ; celle d’une **thermistance** varie avec la température, ce qui en fait un capteur.

## Le condensateur
Il **stocke** des charges sur deux armatures séparées par un isolant. Sa **capacité** C, en **farads**, relie la charge à la tension :

Q = C × U

L’énergie stockée vaut E = ½ × C × U².

Son comportement est celui d’un dipôle à **mémoire** :
- il ne laisse **pas** passer le courant continu en régime établi ;
- la tension à ses bornes ne peut **pas** varier brusquement — c’est sa propriété la plus utile ;
- sa charge et sa décharge à travers une résistance suivent une loi exponentielle de **constante de temps τ = R × C**. Le régime est établi à environ 99 % au bout de **5 τ**.

> Trois usages qui découlent directement de là : **filtrer** (lisser une tension redressée), **temporiser** (créer un délai), **découpler** (absorber les appels de courant brefs d’un circuit numérique).`,
          },
          questions: [
            ['Quelle relation modélise un générateur réel ?', ['U = E − r × I', 'U = E + r × I', 'U = R × I', 'U = E × I'], 0, 'r est la résistance interne : la tension chute quand le courant augmente.'],
            ['Quelle est l’unité de la capacité d’un condensateur ?', ['Le farad', 'L’ohm', 'Le henry', 'Le coulomb'], 0, 'Q = C × U, avec Q en coulombs et U en volts.'],
            ['Un condensateur laisse passer le courant continu en régime établi.', ['Vrai', 'Faux'], 1, 'Il se comporte alors comme un interrupteur ouvert.'],
            ['Que vaut la constante de temps de la charge d’un condensateur à travers une résistance ?', ['τ = R × C', 'τ = R / C', 'τ = C / R', 'τ = R × C²'], 0, 'Le régime est établi à environ 99 % au bout de 5 τ.'],
            ['Quelle propriété du condensateur est la plus utilisée en électronique ?', ['La tension à ses bornes ne peut pas varier brusquement', 'Il produit du courant', 'Il chauffe peu', 'Il inverse la tension'], 0, 'D’où ses usages de filtrage, de temporisation et de découplage.'],
            ['Pourquoi place-t-on une résistance en série avec une LED ?', ['Pour limiter le courant qui la traverse', 'Pour augmenter sa luminosité', 'Pour la refroidir', 'Pour inverser sa polarité'], 0, 'Sans elle, la LED grille immédiatement.'],
            ['Quelle est l’expression de l’énergie stockée dans un condensateur ?', ['E = ½ × C × U²', 'E = C × U', 'E = ½ × C × U', 'E = C × U²'], 0, 'Elle croît avec le carré de la tension.'],
            ['La résistance d’une thermistance varie avec la température.', ['Vrai', 'Faux'], 0, 'C’est ce qui en fait un capteur de température très répandu.'],
          ],
        },
        {
          titre: 'Les composants électriques : inductance, diode et transistor',
          axe: 'Électrocinétique',
          lecon: {
            titre: 'Bobine, redressement et commutation',
            cours: `## L’inductance
Une **bobine** est un enroulement de fil qui stocke l’énergie sous forme **magnétique**. Son **inductance** L s’exprime en **henrys**, et l’énergie stockée vaut E = ½ × L × I².

Son comportement est le **symétrique** de celui du condensateur :
- le **courant** qui la traverse ne peut **pas** varier brusquement ;
- en régime continu établi, elle se comporte comme un simple **fil**.

Conséquence pratique décisive : couper brutalement le courant dans une bobine — un relais, un moteur — provoque une **surtension** capable de détruire le transistor qui commandait le circuit. D’où la **diode de roue libre**, montée en inverse aux bornes de la bobine, qui offre au courant un chemin pour s’éteindre.

## La diode
C’est un composant **non linéaire** qui ne laisse passer le courant que dans **un seul sens** :
- en **direct**, elle conduit dès que la tension à ses bornes dépasse une **tension de seuil** — environ 0,7 V pour une diode au silicium ;
- en **inverse**, elle bloque.

Ses usages : **redresser** un courant alternatif, **protéger** contre une inversion de polarité, et, pour la **LED**, émettre de la lumière. Une LED se branche toujours avec une résistance en série.

## Le transistor
C’est le composant qui a rendu l’électronique moderne possible. Un courant ou une tension **faible** sur une électrode de commande contrôle un courant **fort** entre les deux autres. Deux usages, à ne pas confondre :
- en **commutation**, il fonctionne en tout ou rien : bloqué (interrupteur ouvert) ou saturé (interrupteur fermé). C’est le régime de toute l’électronique **numérique** et de la commande de puissance — un microcontrôleur qui ne délivre que quelques milliampères peut ainsi piloter un moteur.
- en **amplification**, il fonctionne en régime linéaire : le signal de sortie reproduit celui d’entrée, en plus grand.

> Ce qu’il faut retenir de tout le chapitre : un transistor **ne fournit pas** l’énergie, il la **module**. La puissance vient toujours de l’alimentation ; le transistor ne fait qu’ouvrir et fermer le robinet.`,
          },
          questions: [
            ['Quelle grandeur ne peut pas varier brusquement dans une bobine ?', ['Le courant qui la traverse', 'La tension à ses bornes', 'Sa résistance', 'Son inductance'], 0, 'C’est le comportement symétrique de celui du condensateur.'],
            ['À quoi sert une diode de roue libre ?', ['À évacuer le courant d’une bobine coupée, évitant une surtension destructrice', 'À redresser un courant alternatif', 'À limiter la luminosité d’une LED', 'À mesurer un courant'], 0, 'Elle protège le transistor de commande.'],
            ['Quelle est la tension de seuil approximative d’une diode au silicium ?', ['Environ 0,7 V', 'Environ 5 V', 'Environ 0,1 V', 'Environ 12 V'], 0, 'En dessous, elle ne conduit pas en direct.'],
            ['Une diode laisse passer le courant dans les deux sens.', ['Vrai', 'Faux'], 1, 'Elle conduit en direct et bloque en inverse : c’est sa raison d’être.'],
            ['Que fait un transistor en régime de commutation ?', ['Il fonctionne en tout ou rien, bloqué ou saturé', 'Il amplifie proportionnellement le signal', 'Il stocke de l’énergie', 'Il redresse le courant'], 0, 'C’est le régime de toute l’électronique numérique.'],
            ['Un transistor fournit l’énergie au circuit qu’il commande.', ['Vrai', 'Faux'], 1, 'Il la MODULE : la puissance vient de l’alimentation.'],
            ['Quelle est l’expression de l’énergie stockée dans une bobine ?', ['E = ½ × L × I²', 'E = ½ × L × U²', 'E = L × I', 'E = L × I²'], 0, 'Symétrique de celle du condensateur, avec le courant à la place de la tension.'],
            ['Pourquoi un microcontrôleur a-t-il besoin d’un transistor pour piloter un moteur ?', ['Parce qu’il ne délivre que quelques milliampères', 'Parce qu’il ne délivre pas de tension', 'Parce que le moteur est analogique', 'Parce que le moteur inverse la polarité'], 0, 'Le transistor commande un courant fort avec un signal faible.'],
          ],
        },
        {
          titre: 'Les outils d’étude',
          axe: 'Électrocinétique',
          lecon: {
            titre: 'Mesurer, simuler, comparer',
            cours: `Étudier un circuit, c’est confronter trois sources : le **calcul**, la **simulation** et la **mesure**. Aucune ne remplace les deux autres.

## Les appareils de mesure
- Le **multimètre** mesure tension (en dérivation), intensité (en série) et résistance (hors tension, composant isolé). Il donne une valeur **moyenne ou efficace**, jamais l’allure d’un signal.
- L’**oscilloscope** montre la **forme du signal en fonction du temps**. C’est le seul appareil qui révèle une allure — un signal carré, une déformation, un temps de montée, un rebond de contact. Ses réglages essentiels : la **base de temps** (en s/div) et la **sensibilité verticale** (en V/div).
- Le **générateur de fonctions** fournit des signaux d’essai calibrés : sinusoïdal, carré, triangulaire, de fréquence et d’amplitude réglables.

## Lire un oscillogramme
On compte les **divisions** et on multiplie par le calibre. Une période occupant 4 divisions à 2 ms/div fait 8 ms, soit une fréquence de 125 Hz. Une amplitude de 3 divisions à 5 V/div fait 15 V.

## La simulation
Un simulateur de circuit calcule tensions et courants à partir de **modèles** de composants. Elle permet d’essayer sans risque, de faire varier un paramètre en quelques secondes et d’observer des points inaccessibles à la mesure.

Ses limites doivent être dites : elle ne connaît que les phénomènes **modélisés**. Les résistances de contact, les capacités parasites, l’échauffement, les tolérances de fabrication et les perturbations électromagnétiques n’y figurent pas — sauf si on les y met.

## L’analyse des écarts
C’est le raisonnement central de la démarche de l’ingénieur, et ce que l’épreuve attend :
- écart **calcul / simulation** : une erreur de modèle ou d’hypothèse ;
- écart **simulation / mesure** : un phénomène réel non modélisé, ou un composant hors tolérance ;
- écart **mesure / cahier des charges** : le produit ne répond pas au besoin, et il faut décider quoi corriger.

> Un écart n’est pas un échec : c’est une information. Ce qui serait une faute, c’est de ne pas le mesurer, ou de l’expliquer sans l’avoir cherché.`,
          },
          questions: [
            ['Quel appareil montre la forme d’un signal en fonction du temps ?', ['L’oscilloscope', 'Le multimètre', 'L’ampèremètre', 'Le générateur de fonctions'], 0, 'Le multimètre ne donne qu’une valeur, jamais une allure.'],
            ['Quels sont les deux réglages essentiels d’un oscilloscope ?', ['La base de temps et la sensibilité verticale', 'La fréquence et la puissance', 'L’intensité et la résistance', 'Le calibre et la polarité'], 0, 'En s/div et en V/div : ce sont eux qui permettent de lire l’écran.'],
            ['Une période occupe 4 divisions réglées à 2 ms/div : quelle est la fréquence ?', ['125 Hz', '8 Hz', '500 Hz', '250 Hz'], 0, 'La période vaut 8 ms, donc f = 1 / 0,008 = 125 Hz.'],
            ['Comment mesure-t-on une résistance au multimètre ?', ['Hors tension, sur le composant isolé du circuit', 'En série, circuit alimenté', 'En dérivation, circuit alimenté', 'Avec un oscilloscope'], 0, 'Le reste du circuit fausserait sinon la mesure.'],
            ['Une simulation prend en compte tous les phénomènes réels d’un circuit.', ['Vrai', 'Faux'], 1, 'Elle ne connaît que ce qui est modélisé : parasites et tolérances en sont souvent absents.'],
            ['Que traduit un écart entre simulation et mesure ?', ['Un phénomène réel non modélisé ou un composant hors tolérance', 'Une erreur de calcul', 'Un cahier des charges mal écrit', 'Une panne du simulateur'], 0, 'L’écart calcul/simulation, lui, signale une erreur de modèle ou d’hypothèse.'],
            ['Un écart mesuré est un échec de la conception.', ['Vrai', 'Faux'], 1, 'C’est une information ; ne pas le mesurer serait la vraie faute.'],
            ['À quoi sert un générateur de fonctions ?', ['À fournir des signaux d’essai calibrés', 'À mesurer une tension', 'À alimenter le circuit en continu uniquement', 'À afficher un oscillogramme'], 0, 'Sinusoïdal, carré ou triangulaire, de fréquence et d’amplitude réglables.'],
          ],
        },
      ],
    },
  ],
}
