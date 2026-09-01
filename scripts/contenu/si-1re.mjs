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
            cours: `Un projet est un ensemble d'activités coordonnées, mené une seule fois, pour atteindre un objectif défini dans un délai et un budget donnés.

> Il se distingue d'une activité de production, qui se répète à l'identique.

## Le triangle du projet
| La contrainte | Ce qu'elle mesure |
| **Coût** | Le budget engagé |
| **Délai** | Le temps disponible |
| **Qualité** (ou périmètre) | Ce que le produit doit faire |

> On ne peut en améliorer une sans peser sur les deux autres : réduire le délai coûte plus cher, ou dégrade la qualité.

## Le cycle de vie
| La phase | Ce qu'elle produit |
| **Conception** | Des solutions techniques comparées |
| **Planification** | Un ordonnancement des tâches |
| **Réalisation** | Le produit |
| **Terminaison** | La livraison et le retour d'expérience |

Chacune se clôt par un **jalon** : une décision de poursuivre, de corriger ou d'arrêter.

## Exprimer le besoin
L'analyse du besoin répond à trois questions :
1. À **qui** le produit rend-il service ?
2. Sur **quoi** agit-il ?
3. Dans quel **but** ?

Le besoin est formalisé dans un **cahier des charges fonctionnel**.

| La fonction | Ce qu'elle exprime |
| **Principale** | Ce qui justifie l'existence du produit |
| **Contrainte** | Les limites imposées par le milieu extérieur : normes, encombrement, température, coût |

Chaque fonction reçoit un **critère**, un **niveau** et une **flexibilité**.

| L'exigence | Est-elle exploitable |
| « Résister à une charge de 150 kg, tolérance ±10 % » | **Oui** |
| « Être solide » | **Non** |

> Le cahier des charges dit **ce qu'il faut faire**, jamais **comment**. Écrire « utiliser un moteur pas à pas » y est une faute : c'est une solution, et elle interdit d'avance toute autre piste.

## Les trois écarts
| L'écart | Entre quoi et quoi | Ce qu'il valide |
| 1 | Cahier des charges et **modèle** | La pertinence du modèle |
| 2 | Modèle et **réel mesuré** | La justesse des hypothèses |
| 3 | Réel et **cahier des charges** | La conformité du produit |`,
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
            cours: `La conception transforme un besoin en solutions techniques comparables. C'est la phase où l'essentiel du coût final se décide, alors que presque rien n'a encore été dépensé.

## Du besoin aux solutions
| Le niveau | Ce qu'il décrit |
| **Fonction de service** | Ce que le produit doit rendre à l'utilisateur |
| **Fonction technique** | Comment le système s'y prend |
| **Solution constructive** | La pièce, le composant, le programme retenu |

> Un même besoin admet toujours plusieurs solutions. C'est l'objet de la phase que de les faire apparaître.

## Les deux temps de la recherche
| Le temps | Ce qu'on fait | Ce qui est interdit |
| **Divergence** | Produire le plus d'idées possible : brainstorming, analogies, combinaisons | **Juger** |
| **Convergence** | Évaluer et retenir | Rouvrir la liste |

> Juger pendant la divergence tue les idées fragiles — dont sortent souvent les meilleures solutions.

## Comparer les solutions
| L'outil | Ce qu'il apporte |
| **Tableau multicritère** | Chaque critère reçoit un **poids**, chaque solution une note ; le total pondéré classe |
| **Diagramme d'aide à la décision** | Il visualise le compromis entre deux critères |
| **Prototypage rapide** | Il éprouve une solution avant de s'engager |

> Le tableau multicritère n'est pas un oracle : il rend le choix **explicite et discutable**. Changer les poids change le classement — et c'est précisément ce qu'il faut savoir montrer.

## Modéliser avant de construire
| L'outil | Ce qu'il vérifie |
| **Maquette numérique** (CAO) | Encombrement, interférences entre pièces, montages |
| **Simulation** | Résistance mécanique, échauffement, consommation |

Chaque simulation repose sur des **hypothèses simplificatrices** : solide indéformable, frottements négligés, régime permanent.

> Les nommer fait partie du travail : un résultat de simulation sans hypothèses n'a aucune valeur.`,
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
            cours: `Planifier, c'est répondre à trois questions : quelles tâches, dans quel ordre, avec quelles ressources.

## Découper le travail
Chaque **tâche** élémentaire est caractérisée par :

| Le caractère | Ce qu'il précise |
| **Durée** | Le temps nécessaire |
| **Ressources** | Machines, opérateurs, matière |
| **Antériorités** | Les tâches à terminer avant qu'elle commence |

## Les deux outils
| L'outil | Sa forme | À quoi il sert |
| **Diagramme de Gantt** | Un rectangle horizontal par tâche, de longueur proportionnelle à sa durée | **Suivre** : il montre les tâches simultanées, c'est le tableau de bord |
| **Réseau PERT** | Un réseau de tâches et d'enchaînements | **Calculer** : dates au plus tôt et au plus tard, marges |

## Le chemin critique
| La date ou la marge | Comment on l'obtient |
| **Au plus tôt** | En parcourant le réseau du début vers la fin |
| **Au plus tard** | En le parcourant de la fin vers le début |
| **Marge** | La différence des deux |

Le **chemin critique** est la suite des tâches de **marge nulle**. Sa longueur donne la **durée minimale** du projet.

> Enseignement central du chapitre : accélérer une tâche qui n'est **pas** sur le chemin critique ne fait gagner **aucun jour** au projet. On ne renforce que ce qui est critique.

Tout retard sur une tâche critique retarde le projet entier.

## Ressources et lissage
Une tâche peut être limitée non par sa logique, mais par la **disponibilité** d'une machine ou d'un opérateur. Le **lissage** consiste à décaler les tâches disposant d'une marge, pour éviter les pics de charge.

## Suivre et corriger
| Le retard porte sur… | La conséquence |
| Une tâche **à marge** | Il se résorbe |
| Une tâche **critique** | Il impose un arbitrage : ajouter des moyens, réduire le périmètre, ou accepter le décalage |`,
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
            cours: `La réalisation met en œuvre ce que la conception a décidé et ce que la planification a ordonné. La terminaison clôt le projet — et c'est la phase que l'on bâcle le plus souvent.

## Réaliser
| L'exigence | Ce qu'elle impose |
| **Suivi d'avancement** | Comparer le réel au prévisionnel |
| **Gestion des modifications** | Toute évolution du besoin doit être **tracée, chiffrée et validée** |
| **Traçabilité** | Versions, pièces, essais |

> Sans gestion des modifications, le projet dérive sans qu'on sache pourquoi.

## Vérifier et valider
Deux mots que l'on confond, et qui ne disent pas la même chose.

| Le mot | La question | Le référentiel |
| **Vérifier** | A-t-on **bien construit** le produit ? | Les **spécifications** |
| **Valider** | A-t-on construit le **bon** produit ? | Le **besoin réel** de l'utilisateur |

> Un produit peut être parfaitement vérifié et rester invalide, s'il répond à une spécification qui traduisait mal le besoin.

## Les essais
On mesure les performances réelles et on les compare aux niveaux du cahier des charges. L'écart obtenu s'analyse :

| L'origine possible de l'écart | Ce qu'il faut examiner |
| Le **produit** | Une fabrication non conforme |
| Le **protocole de mesure** | L'instrument, les conditions |
| Une **hypothèse du modèle** | Trop grossière |

> Cette question est le cœur du raisonnement attendu en SI.

## Terminer
| L'étape | Ce qu'elle comprend |
| **Livraison** et **recette** | La réception avec le client |
| **Documentation** | Notice, plan de maintenance, dossier technique |
| **Bilan** | Écarts de coût et de délai, difficultés, **retour d'expérience** |
| **Clôture** | Dissolution de l'équipe, archivage |

> Sans retour d'expérience, chaque nouveau projet recommence les erreurs du précédent. C'est la seule phase dont le bénéfice ne va pas au projet en cours, mais aux suivants — et c'est pour cela qu'elle est si souvent sacrifiée.`,
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
            cours: `Le SysML est un langage graphique de description des systèmes. Il sert de langue commune entre le client, le mécanicien, l'électronicien et l'informaticien.

## Les trois familles de diagrammes
Elles répondent à trois questions différentes. Les confondre est l'erreur classique du chapitre.

| La question | Le diagramme | Ce qu'il montre |
| **Le besoin** : à quoi le système doit-il répondre ? | **Exigences** (*requirement*) | L'arbre des exigences, chacune identifiée, formulée et **vérifiable** |
| | **Cas d'utilisation** (*use case*) | Les **acteurs** extérieurs et les services rendus |
| **La structure** : de quoi est-il fait ? | **Définition de blocs** (*block definition*) | La décomposition en blocs et leurs compositions |
| | **Blocs internes** (*internal block*) | Les **flux** échangés — matière, énergie, information — et leurs ports |
| **Le comportement** : que fait-il ? | **États** (*state machine*) | Les états successifs et les **transitions**, déclenchées par un événement, parfois soumises à une **garde** |
| | **Séquence** | Les échanges de messages **dans le temps** |

## La chaîne fonctionnelle
| La chaîne | Ses maillons |
| **Information** | Acquérir (capteur) → traiter (calculateur) → communiquer |
| **Énergie** | Alimenter → distribuer (préactionneur) → convertir (actionneur) → transmettre (réducteur, courroie) → agir |

> La chaîne d'information **commande** la chaîne d'énergie, et la mesure lui revient par le capteur : c'est le bouclage, la structure du **système asservi**.

## Pourquoi modéliser
Un modèle n'est jamais la réalité : il en retient ce qui est utile à la question posée.

> Un même système reçoit donc plusieurs modèles, selon ce que l'on cherche à prévoir.`,
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
            cours: `Toute action mécanique se représente par un vecteur. Manipuler des vecteurs n'est pas un préalable mathématique : c'est le langage même de la statique.

## Un vecteur, quatre caractéristiques
| La caractéristique | Ce qu'elle précise |
| **Point d'application** | Où la force s'exerce |
| **Direction** | La droite qui la porte |
| **Sens** | Vers où elle pousse |
| **Norme** (intensité) | Combien : en newtons pour une force |

> Deux vecteurs ne sont égaux que si direction, sens et norme coïncident.

## Repères
Un **repère orthonormé direct** est défini par une origine et des vecteurs de base perpendiculaires, de norme 1, orientés selon la règle de la main droite.

> On choisit le repère qui **simplifie le calcul** : souvent un axe le long du plan incliné, plutôt qu'à l'horizontale.

Un même vecteur a des coordonnées différentes dans deux repères — mais c'est le même vecteur. Changer de repère est un choix de commodité, jamais un changement de physique.

## Opérations
| L'opération | Comment |
| **Somme** | Relation de Chasles, ou parallélogramme ; en coordonnées, composante par composante |
| **Produit par un réel** | La norme est multipliée ; le sens s'inverse si le réel est négatif |
| **Norme** dans le plan | Racine carrée de (x² + y²) |

## La projection
Le geste le plus employé de la statique. Pour un vecteur de norme F faisant un angle α avec l'axe :

composante sur l'axe = F × cos α

composante perpendiculaire = F × sin α

> L'erreur la plus fréquente est d'intervertir sinus et cosinus. Le repère de contrôle : la composante **le long** de l'axe fait intervenir le **cosinus** de l'angle avec cet axe.

## Les deux produits
| Le produit | Ce qu'il donne | Sa formule | À quoi il sert |
| **Scalaire** | Un **nombre** | norme de u × norme de v × cos α ; nul si les vecteurs sont perpendiculaires | Le **travail** d'une force |
| **Vectoriel** | Un **vecteur** perpendiculaire aux deux | de norme : norme de u × norme de v × sin α | Les **moments** |`,
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
            cours: `Une action mécanique est ce qui déforme un solide, le met en mouvement ou l'en empêche. On la modélise pour pouvoir la calculer.

## Deux familles
| La famille | Comment elle s'exerce | L'exemple |
| **À distance** | Sans contact | Le **poids** : appliqué au centre de gravité, P = m × g |
| **De contact** | Par une surface | Appui, liaison, frottement, pression d'un fluide |

> Une action **répartie** sur une surface peut être remplacée par une force unique équivalente, appliquée au point où la répartition s'équilibre.

## La force
Un vecteur, en **newtons**. Son effet dépend de son point d'application autant que de son intensité.

> Pousser une porte près de la poignée ou près des gonds n'a pas le même résultat.

## Le moment
Le **moment** mesure l'aptitude d'une force à faire **tourner** un solide autour d'un point ou d'un axe. Pour une force perpendiculaire au bras de levier :

M = F × d

en newtons-mètres (N·m), où d est la **distance perpendiculaire** entre la droite d'action et le point considéré : le **bras de levier**.

| Le cas | Le moment |
| La droite d'action **passe par le point** | **Nul**, quelle que soit l'intensité |
| Le bras de levier est **allongé** | Grand moment avec une petite force : la clé, le levier, la brouette |
| Rotation dans le sens **direct** | Compté **positivement** |
| Rotation dans l'autre sens | Compté **négativement** |

## Les liaisons mécaniques
Une liaison supprime certains mouvements relatifs et en autorise d'autres. On la caractérise par ses **degrés de liberté** — six au maximum dans l'espace : trois translations, trois rotations.

| La liaison | Ses degrés de liberté | Ce qu'elle transmet |
| **Encastrement** | 0 | Toutes les forces et tous les moments |
| **Pivot** | 1 rotation | C'est la liaison du roulement à billes |
| **Glissière** | 1 translation | — |
| **Ponctuelle** | 5 | Une seule force, perpendiculaire au contact |

> Une liaison **parfaite** est supposée sans jeu et sans frottement : c'est une hypothèse de modélisation, à nommer comme telle.`,
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
            cours: `Résoudre un problème de statique commence toujours par le même geste : isoler un solide. Tant que cette étape n'est pas faite proprement, aucun calcul n'a de sens.

## Isoler
Isoler un solide, c'est le séparer par la pensée de tout ce qui l'entoure, et remplacer chaque élément retiré par l'**action** qu'il exerçait sur lui.

Le **bilan des actions extérieures** s'écrit en liste. Pour chacune :

| Ce qu'on précise | Connu ou inconnu |
| Point d'application | Souvent connu |
| Direction | Parfois imposée par la liaison |
| Sens | Parfois supposé |
| Intensité | Souvent l'inconnue |

> Une action **intérieure** au solide isolé ne figure **jamais** dans le bilan. C'est l'erreur qui fausse le plus de copies : on ne compte que ce qui traverse la frontière de l'isolement.

## Le torseur des actions
La représentation complète d'une action en un point comporte **deux vecteurs** :

| Le vecteur | Ce qu'il représente |
| **Résultante** | La somme des forces |
| **Moment résultant** | Au point choisi |

| Le problème | Le nombre de composantes |
| Dans l'**espace** | 6 : trois de force, trois de moment |
| Dans le **plan** | 3 : deux de force, un de moment |

> Un torseur se **transporte** d'un point à un autre : la résultante ne change pas, mais le moment, si — puisque le bras de levier change.

## Représenter graphiquement
Chaque action est tracée en son point d'application, avec une longueur proportionnelle à son intensité et une **échelle indiquée**.

> Les inconnues sont tracées avec un sens **supposé**. Si le calcul donne une valeur négative, le sens réel est l'inverse — et la solution n'en est pas fausse.

## Deux cas particuliers utiles
| Le solide en équilibre | La propriété |
| Soumis à **deux forces** | Même droite d'action, sens opposés, même intensité |
| Soumis à **trois forces** non parallèles | Droites d'action **concourantes**, somme vectorielle nulle : le triangle des forces se ferme |

> Ces deux propriétés permettent souvent de résoudre **graphiquement**, sans écrire une seule équation.`,
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
            cours: `Un solide est en équilibre dans un référentiel galiléen si, et seulement si, deux conditions sont réunies simultanément.

## Les deux conditions
| La condition | Ce qu'elle interdit |
| La **somme vectorielle** des actions extérieures est nulle | La **translation** |
| La **somme des moments**, calculés en un même point, est nulle | La **rotation** |

> Les deux sont nécessaires : deux forces égales et opposées mais **non alignées** ont une somme nulle et forment pourtant un **couple**, qui fait tourner le solide.

## En projection
Dans un problème plan, ces deux conditions donnent **trois équations scalaires** :
1. Somme des composantes sur x = 0.
2. Somme des composantes sur y = 0.
3. Somme des moments en un point = 0.

| Le nombre d'inconnues | Le problème |
| Au plus **3** | Résoluble |
| Davantage | **Hyperstatique** : il exige des hypothèses supplémentaires |

## La méthode, dans l'ordre
| L'étape | Le point d'attention |
| 1. **Isoler** le solide | Rien de ce qui est intérieur |
| 2. Faire le **bilan** des actions extérieures | Point, direction, sens, intensité |
| 3. Choisir un **repère** commode | Souvent un axe le long du plan incliné |
| 4. Choisir le **point de calcul des moments** | Le prendre là où passent le plus d'inconnues : leur moment y est nul |
| 5. Écrire, résoudre, **vérifier** | Homogénéité et vraisemblance |

> C'est le choix du point de calcul qui décide de la difficulté d'un exercice.

## Le frottement
Tant que le solide ne glisse pas, la composante tangentielle T de l'action de contact s'ajuste d'elle-même, jusqu'à la limite :

T ≤ f × N

où N est la composante normale et f le **coefficient de frottement**. Au-delà, le glissement commence.

| Le mot | Ce qu'il désigne |
| **Adhérence** | Ce qui empêche le glissement |
| **Frottement** | Ce qui s'oppose au glissement **en cours** |

> Une pièce sur un plan incliné reste immobile tant que l'angle du plan reste inférieur à l'**angle d'adhérence**.`,
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
            cours: `Un système technique transforme de l'énergie : électrique en mécanique dans un moteur, mécanique en électrique dans une génératrice, chimique en électrique dans une batterie.

## Énergie et puissance
La **puissance** est un débit d'énergie :

P = E / Δt, donc E = P × Δt

| La grandeur | Son unité |
| Énergie E | **Joule** (J) |
| Puissance P | **Watt** (W) |

> Le kilowattheure, unité des factures, vaut 3,6 × 10⁶ J.

## Les expressions à connaître
| Le domaine | La formule | Les unités |
| **Électrique** | P = U × I | V et A |
| Électrique, dissipation | P = R × I² | Ω et A |
| **Mécanique en translation** | P = F × v | N et m/s |
| **Mécanique en rotation** | P = C × ω | N·m et rad/s |

La conversion demandée à chaque devoir :

ω = 2π × N / 60, où N est en tours par minute

## Le rendement
η = P(utile) / P(absorbée)

Toujours **inférieur à 1**. La différence part en pertes : effet Joule dans les bobinages, frottements dans les paliers, échauffement, bruit.

## Le rendement d'une chaîne
Les rendements des maillons successifs se **multiplient** :

η(total) = η1 × η2 × η3

| Les maillons | Le rendement total |
| Trois maillons à 90 % | 0,90 × 0,90 × 0,90 ≈ **73 %** |
| Trois maillons à 80 % | ≈ **51 %** |

> C'est le résultat contre-intuitif du chapitre : une chaîne longue perd beaucoup, même si chaque maillon est bon.

## Conséquences de conception
| Le levier | Pourquoi |
| **Réduire le nombre de conversions** | Chaque conversion multiplie par un facteur inférieur à 1 |
| Agir sur le maillon **le plus mauvais** | Un maillon à 50 % plafonne tout le reste, quel que soit le soin apporté aux autres |`,
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
            cours: `La cinématique décrit les mouvements sans se préoccuper de leurs causes. C'est la différence avec la dynamique, qui les explique par les forces.

## Les trois grandeurs
| La grandeur | Ce qu'elle est | Son unité |
| **Position** | Un vecteur depuis l'origine du repère | m |
| **Vitesse** | La variation de position par unité de temps ; **tangente à la trajectoire** | m/s |
| **Accélération** | La variation du **vecteur** vitesse | m/s² |

> Le vecteur vitesse peut changer par sa **valeur** ou par sa **direction**. Un mobile qui tourne à vitesse constante accélère, au sens de la mécanique.

## Le mouvement de rotation
Pour un point situé à la distance R de l'axe, tournant à la vitesse angulaire ω :

v = ω × R

| Ce qui est commun à tous les points d'un solide en rotation | Ce qui diffère |
| La **vitesse angulaire** ω | La **vitesse linéaire** v, proportionnelle à la distance à l'axe |

> C'est pourquoi l'extrémité d'une pale se déplace bien plus vite que sa base.

L'accélération d'un point en mouvement circulaire uniforme est dirigée **vers le centre** et vaut a = v² / R.

## Les trois mouvements de base
| Le mouvement | La vitesse | L'accélération |
| **Rectiligne uniforme** | Constante en valeur et direction | **Nulle** ; x = v × t + x0 |
| **Rectiligne uniformément varié** | Elle varie linéairement | **Constante** ; la position varie quadratiquement |
| **Circulaire uniforme** | Constante en valeur | **Centripète**, non nulle |

## Transmission de mouvement
Deux roues dentées ou deux poulies en prise ont la **même vitesse linéaire au contact**, donc des vitesses angulaires inversement proportionnelles à leurs rayons :

ω(sortie) / ω(entrée) = R(entrée) / R(sortie)

| Ce que fait un réducteur | Dans quelle proportion |
| Il **diminue** la vitesse | Le rapport de réduction |
| Il **augmente** le couple | La même |
| La **puissance** | Elle se conserve, aux pertes près |

> C'est la raison d'être de toute boîte de vitesses.`,
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
            cours: `Un signal est la grandeur physique qui porte une information : une tension, un courant, une onde lumineuse ou radio.

## Trois natures de signal
| La nature | Ses valeurs | Un exemple |
| **Analogique** | Une **infinité**, variation continue | La tension d'un microphone |
| **Numérique** | Un nombre **fini**, codées en binaire | Un fichier audio |
| **Logique** | **Deux** seulement, 0 et 1 | Un interrupteur, un capteur de présence |

## De l'analogique au numérique
| L'étape | Ce qu'elle fait | Sa contrainte |
| **Échantillonnage** | Prélever la valeur à intervalles réguliers | La fréquence doit être au moins **double** de la plus haute fréquence du signal |
| **Quantification** | Arrondir chaque échantillon à la valeur disponible la plus proche | La **résolution** : n bits donnent 2 puissance n niveaux |
| **Codage** | Écrire chaque niveau en binaire | — |

> Si la fréquence d'échantillonnage est trop basse, l'information est **irrémédiablement** perdue.

| Ce qu'on augmente | Le gain | Le coût |
| Fréquence d'échantillonnage et résolution | Une copie plus fidèle | Un fichier plus lourd |

> Tout le débat de la compression tient dans cet arbitrage.

## Pourquoi le numérique s'est imposé
| Le signal | Ce qu'il devient après copies et transmissions |
| **Analogique** | Il se **dégrade** : le bruit accumulé ne s'enlève plus |
| **Numérique** | Il se **régénère exactement**, tant que le bruit ne dépasse pas le seuil de décision |

Il se corrige en outre par des **codes détecteurs et correcteurs d'erreurs**.

## Caractériser un signal périodique
| La grandeur | Sa définition |
| **Période** T | La durée d'un motif |
| **Fréquence** f | f = 1 / T |
| **Amplitude** | L'écart entre les valeurs extrêmes |
| **Rapport cyclique** | La fraction de la période pendant laquelle un signal logique vaut 1 |

> C'est le rapport cyclique que l'on fait varier en **MLI** — modulation de largeur d'impulsion — pour régler la puissance envoyée à un moteur ou l'intensité d'une LED.`,
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
            cours: `Toute information traitée par un système numérique est une suite de bits. Ce qu'elle représente dépend entièrement de la convention de codage choisie.

## Les trois bases
| La base | Ses chiffres | À quoi elle sert |
| **Binaire** (2) | 0 et 1 | La seule que le circuit connaît réellement |
| **Décimal** (10) | 0 à 9 | Notre notation usuelle |
| **Hexadécimal** (16) | 0 à 9 puis A à F | Une **abréviation** du binaire : un chiffre vaut exactement **quatre bits** |

## Les conversions
| Le sens | La méthode | Un exemple |
| Binaire → décimal | Chaque bit vaut son poids, puissance de 2 croissante de droite à gauche | 1011 = 8 + 0 + 2 + 1 = **11** |
| Décimal → binaire | Divisions successives par 2, restes lus **de bas en haut** | — |

## Les unités
| L'unité | Sa valeur | Ce qu'elle code |
| 1 **bit** | Un chiffre binaire | 2 valeurs |
| 1 **octet** | 8 bits | **256** valeurs, de 0 à 255 |
| Un mot de n bits | — | **2 puissance n** valeurs |

> Cette dernière relation est à savoir manier dans les deux sens.

## Coder autre chose que des nombres
| Ce qu'on code | Le codage | Sa limite |
| Les **caractères** | **ASCII** sur 7 bits | Insuffisant pour les langues accentuées |
| | **Unicode**, encodé en **UTF-8** | Longueur variable, couvre tous les alphabets |
| Les **images** | Un tableau de **pixels**, chacun par ses composantes rouge, verte, bleue | Un octet par composante donne plus de 16 millions de couleurs |
| Les **entiers signés** | Un bit de signe, ou le complément à deux | — |

> Le même mot 01000001 vaut 65 en entier, la lettre A en ASCII, ou une nuance de gris dans une image. **Rien dans le mot ne dit ce qu'il représente** : c'est la convention, portée par le programme, qui l'interprète.

## Détecter les erreurs
| Le procédé | Ce qu'il permet |
| **Bit de parité** | **Détecter** un nombre impair d'erreurs — sans les corriger |
| **Codes correcteurs** | **Retrouver** la valeur exacte, au prix de bits supplémentaires |`,
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
            cours: `Trois opérateurs suffisent à construire toute fonction logique. Chacun se définit par une table de vérité.

## NON (NOT)
Un seul opérande : la sortie est l'**inverse** de l'entrée.

| Entrée | Sortie |
| 0 | 1 |
| 1 | 0 |

## ET (AND)
La sortie vaut 1 **si et seulement si toutes** les entrées valent 1. On la note par un point, comme une multiplication — et ce n'est pas un hasard.

| a | b | a ET b |
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | **1** |

> Usage typique : une sécurité qui exige **plusieurs** conditions simultanées — la presse ne démarre que si les deux mains sont sur les boutons.

## OU (OR)
La sortie vaut 1 **dès qu'au moins une** entrée vaut 1. On la note par un signe plus.

| a | b | a OU b |
| 0 | 0 | 0 |
| 0 | 1 | **1** |
| 1 | 0 | **1** |
| 1 | 1 | **1** |

> C'est un OU **inclusif** : « 1 OU 1 » vaut 1, à la différence du « ou » exclusif du langage courant — fromage ou dessert.

Usage typique : une alarme déclenchée par **n'importe lequel** des capteurs.

## Les opérateurs dérivés
| L'opérateur | Sa définition | Sa particularité |
| **NON-ET** (NAND) | La sortie du ET, inversée | **Universel** : avec des NAND seuls on reconstruit NON, ET, OU — donc toute fonction. L'industrie les fabrique en masse |
| **NON-OU** (NOR) | La sortie du OU, inversée | Universel également |
| **OU EXCLUSIF** (XOR) | 1 si les entrées sont **différentes** | Il détecte les changements : additionneurs, codes correcteurs |

## Combien de lignes dans une table
| Le nombre d'entrées | Le nombre de lignes |
| 2 | 4 |
| 3 | 8 |
| 4 | 16 |

Une fonction à n entrées a **2 puissance n** lignes. Les écrire dans l'ordre binaire croissant évite d'en oublier.`,
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
            cours: `Une porte logique est le composant électronique qui réalise un opérateur. Les associer permet de construire n'importe quelle fonction.

## Le logigramme
Le schéma d'un montage de portes : entrées à gauche, portes au centre, sortie à droite. Chaque porte a son **symbole normalisé**, et le sens de lecture est toujours le même.

## Les trois représentations
| La représentation | Sa forme | Son intérêt |
| **Table de vérité** | Un tableau | **Exhaustive** : elle ne ment pas |
| **Équation logique** | Algébrique | Elle se **simplifie** |
| **Logigramme** | Graphique | Il se **câble** |

> Savoir passer de l'une à l'autre **dans les deux sens** est la compétence centrale du chapitre.

## De la table à l'équation
| La méthode | On part des lignes où la sortie vaut… | Ce qu'on écrit |
| **Somme de produits** | **1** | Pour chaque ligne, le produit des entrées, complémentées si elles valent 0 ; puis on additionne |
| **Produit de sommes** | **0** | La construction duale |

> La première est la plus employée : il y a en général moins de 1 que de 0, et elle se lit directement.

## De l'équation au logigramme
Chaque opération devient une porte, en respectant les **priorités** :

| L'ordre | L'opérateur |
| 1 | Le **complément** |
| 2 | Le **ET** |
| 3 | Le **OU** |

> Une équation mal parenthésée donne un montage faux, même si l'algèbre était juste.

## Analyser un montage existant
1. Nommer les sorties intermédiaires, porte par porte.
2. Écrire l'équation de chacune.
3. Remonter jusqu'à la sortie finale.
4. Dresser la table de vérité pour **vérifier**.

> Un même comportement admet **plusieurs logigrammes** : le plus simple n'est pas toujours le plus lisible, et le moins coûteux dépend des portes réellement disponibles dans le boîtier utilisé.`,
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
            cours: `L'algèbre de Boole manipule des variables ne prenant que deux valeurs. Elle donne les règles qui transforment une équation logique sans changer la fonction décrite.

## Les propriétés de base
Avec le point pour le ET et le plus pour le OU :

| La propriété | Avec le ET | Avec le OU |
| **Élément neutre** | a . 1 = a | a + 0 = a |
| **Élément absorbant** | a . 0 = 0 | a + 1 = 1 |
| **Idempotence** | a . a = a | a + a = a |
| **Complémentarité** | a . complément de a = 0 | a + complément de a = **1** |
| **Involution** | Le complément du complément de a vaut a | — |

> « a + complément de a = 1 » est la règle qui simplifie le plus : elle fait disparaître des termes entiers.

## Les propriétés structurelles
| La propriété | Son énoncé |
| **Commutativité** | a . b = b . a et a + b = b + a |
| **Associativité** | (a . b) . c = a . (b . c) |
| **Distributivité du ET sur le OU** | a . (b + c) = a . b + a . c — comme en arithmétique |
| **Distributivité du OU sur le ET** | a + (b . c) = (a + b) . (a + c) — **impossible** avec des nombres |

> Cette dernière égalité est le piège du chapitre : elle serait fausse en algèbre ordinaire.

## Les lois de De Morgan
Les deux relations les plus utiles de tout le programme :

le complément de (a . b) = complément de a + complément de b

le complément de (a + b) = complément de a . complément de b

> En un mot : **on complémente chaque terme et on échange les opérateurs**.

Elles servent à transformer un montage pour n'employer qu'un seul type de porte — un montage tout en NON-ET, par exemple.

## Le théorème d'absorption
| L'expression | Se réduit à |
| a + (a . b) | a |
| a . (a + b) | a |

> Il élimine des termes entiers sans calcul, et c'est souvent lui qui fait passer d'une équation à cinq termes à une équation à deux.`,
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
            cours: `Simplifier une expression logique, c'est trouver une écriture équivalente employant moins de termes et moins de variables.

## L'enjeu
| Ce qu'on gagne | Pourquoi |
| Moins de **portes** | Moins de composants, moins de place |
| Moins de **consommation** | Moins de circuits alimentés |
| Moins de **pannes possibles** | Moins de points de défaillance |
| Un **coût** plus bas | Moins de matière et de câblage |

## Simplifier par l'algèbre
| L'étape | Ce qu'on applique |
| 1 | Supprimer les **compléments doubles** |
| 2 | **De Morgan**, pour faire descendre les compléments sur les variables |
| 3 | **Factoriser** les termes qui partagent une variable |
| 4 | Faire apparaître « x + complément de x = 1 » pour éliminer une variable entière |
| 5 | Appliquer l'**absorption** |

> La difficulté : aucune méthode ne garantit qu'on est arrivé au plus simple. On peut toujours avoir manqué une factorisation.

## Le tableau de Karnaugh
D'où l'intérêt de cette méthode **graphique**, systématique et sans risque d'oubli.

| La règle | Son contenu |
| **Le tableau** | 2 puissance n cases, une par ligne de la table de vérité |
| **Le voisinage** | Deux cases voisines ne diffèrent que par **une seule variable** |
| **Les en-têtes** | En **code de Gray** — 00, 01, **11**, 10 — et non en binaire naturel |
| **Les groupes** | Des rectangles de **1, 2, 4 ou 8** cases, aussi **grands** que possible, quitte à se chevaucher |
| **Les bords** | Le tableau se referme : gauche et droite sont voisines, haut et bas aussi |
| **La lecture** | Chaque groupe donne un terme où l'on ne garde que les variables **constantes** dans le groupe |

> Un groupe deux fois plus grand élimine une variable de plus.

## Deux erreurs classiques
| L'erreur | Sa conséquence |
| Écrire les en-têtes en **binaire naturel** | Les voisinages sont faux, la simplification est fausse |
| Former de **petits groupes** alors qu'un plus grand était possible | Le résultat reste juste, mais il n'est pas simplifié |

## Les cas indifférents
Certaines combinaisons d'entrées **ne peuvent pas se produire** dans le système réel. On les note φ et on les utilise **librement** :

| La décision | Quand |
| Les **inclure** dans un groupe | S'ils l'agrandissent |
| Les **ignorer** | Sinon |

> Ce sont un cadeau pour la simplification.`,
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
            cours: `Sécuriser une transmission, c'est répondre à trois exigences distinctes — et une solution qui traite l'une ne traite pas forcément les autres.

## Les exigences
| L'exigence | Ce qu'elle garantit |
| **Intégrité** | Le message reçu est identique à celui qui a été émis |
| **Confidentialité** | Seul le destinataire peut le lire |
| **Disponibilité** | Le service reste accessible quand on en a besoin |
| **Authentification** | Le destinataire est sûr de l'identité de l'émetteur |
| **Non-répudiation** | L'émetteur ne peut nier avoir envoyé le message |

## Protéger l'intégrité
| Le procédé | Ce qu'il fait |
| **Bit de parité** | Détecte un nombre impair d'erreurs, sans les corriger |
| **Somme de contrôle**, **CRC** | Détectent des altérations plus complexes |
| **Codes correcteurs** | **Retrouvent** la valeur exacte : indispensables quand aucune retransmission n'est possible — sonde spatiale, disque optique rayé |
| **Fonction de hachage** | Produit une **empreinte** de taille fixe ; la moindre modification la change entièrement |

## Protéger la confidentialité
| Le chiffrement | Ses clés | Sa vitesse | Sa difficulté |
| **Symétrique** | La **même** pour chiffrer et déchiffrer | Rapide | Il faut **transmettre la clé** |
| **Asymétrique** | Clé **publique** pour chiffrer, clé **privée** jamais transmise pour déchiffrer | Lent | Aucune : il résout l'échange de clés |

> En pratique on **combine** : l'asymétrique transmet une clé symétrique de session, qui chiffre ensuite le trafic. C'est ce que fait HTTPS.

## La signature numérique
Elle **inverse** l'usage des clés : l'émetteur chiffre l'empreinte du message avec sa **clé privée**, et chacun la vérifie avec sa **clé publique**.

| Ce qu'elle apporte | Ce qu'elle n'apporte pas |
| Authentification et non-répudiation | La **confidentialité** : le message peut rester en clair |

> À retenir : le chiffrement protège le **contenu**, la signature garantit l'**origine**. Ce ne sont pas les mêmes besoins, et une bonne conception dit lequel elle vise.`,
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
            cours: `Un réseau relie des équipements pour qu'ils échangent des données. Le faire fonctionner suppose des règles communes : les protocoles.

## Les échelles
| Le sigle | Son étendue | Une technologie |
| **PAN** | Quelques mètres, autour d'une personne | Bluetooth |
| **LAN** | Un bâtiment, un atelier | Ethernet, Wi-Fi |
| **WAN** | Une étendue géographique large | Internet |

## Les topologies
| La topologie | Son principe | Sa faiblesse |
| **Bus** | Un support unique partagé | Une coupure prive tout le monde |
| **Étoile** | Tous reliés à un nœud central | La panne du **centre** affecte tout ; c'est la topologie dominante |
| **Anneau** | Une boucle | Une rupture peut isoler |
| **Maillée** | Plusieurs chemins | Coûteuse en câblage, mais très robuste |

## Adresser
| L'adresse | Sa nature | Ce qu'elle désigne |
| **MAC** | Physique, attribuée en usine, **unique** | La carte réseau |
| **IP** | Logique, attribuée par le réseau, peut changer | La machine **dans le réseau** |
| **Masque de sous-réseau** | Un découpage | Ce qui, dans l'IP, désigne le **réseau** et ce qui désigne la **machine** |
| **Port** | Un numéro | L'**application** destinataire sur la machine |

> C'est le masque qui permet de savoir si deux machines se parlent directement ou doivent passer par un routeur.

## Les protocoles, en couches
| La couche | Le protocole | Ce dont il s'occupe |
| Accès au support | **Ethernet / Wi-Fi** | Le média physique |
| Réseau | **IP** | Adressage et **routage**, sans garantie de livraison |
| Transport | **TCP** | Connexion **fiable** : accusés de réception, retransmission, remise dans l'ordre |
| Transport | **UDP** | Sans connexion ni garantie, mais **rapide** : voix et vidéo en direct |
| Application | **HTTP, FTP, MQTT** | Le service rendu ; MQTT, léger et fondé sur publication-abonnement, est la référence des objets connectés |

> La logique du découpage : chaque couche peut changer sans que les autres soient réécrites. C'est ce qui a permis au Wi-Fi de remplacer le câble sans toucher à HTTP.

## Les équipements
| L'équipement | Ce qu'il fait | D'après quelle adresse |
| **Commutateur** (*switch*) | Distribue les trames dans un réseau local | **MAC** |
| **Routeur** | Relie des réseaux différents, choisit le chemin | **IP** |
| **Point d'accès** | Raccorde les équipements sans fil | — |`,
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
            cours: `Un circuit électrique est un ensemble de dipôles reliés de façon à laisser circuler un courant. Deux lois suffisent à l'analyser entièrement.

## Les deux grandeurs
| La grandeur | Ce qu'elle mesure | Son unité | Son appareil, et son branchement |
| **Intensité** I | Le débit de charges | Ampère (A) | Ampèremètre, **en série** |
| **Tension** U | La différence de potentiel | Volt (V) | Voltmètre, **en dérivation** |

Une tension se représente par une flèche **entre deux points**, une intensité par une flèche **sur le fil**. Le sens conventionnel du courant va du plus vers le moins à l'extérieur du générateur.

## Les deux lois
| La loi | Son énoncé | Ce qu'elle traduit |
| **Des nœuds** | La somme des intensités entrantes égale la somme des sortantes | La conservation de la **charge** : rien ne s'accumule dans un fil |
| **Des mailles** | Le long d'un parcours fermé, la somme algébrique des tensions est **nulle** | La conservation de l'**énergie** : on revient au même potentiel |

## Série et dérivation
| Le point | En **série** | En **dérivation** |
| L'intensité | **La même** partout | Elle **s'additionne** |
| La tension | Elle **s'additionne** | **La même** aux bornes de chaque branche |
| Les résistances | R = R1 + R2 | Les **inverses** s'additionnent |
| Une coupure | Elle arrête **tout** | Elle n'affecte que sa branche |

> C'est pourquoi les installations domestiques sont câblées en dérivation.

## Deux montages à connaître
| Le montage | Ce qu'il fait | Son usage |
| **Pont diviseur de tension** | Deux résistances en série partagent la tension proportionnellement à leur valeur | Adapter un signal de capteur à l'entrée d'un microcontrôleur |
| **Pont diviseur de courant** | L'équivalent en dérivation | — |

> Erreur récurrente : brancher un ampèremètre **en dérivation**. Sa résistance étant presque nulle, il court-circuite le dipôle — l'appareil, ou le circuit, y passe.`,
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
            cours: `Trois dipôles, trois comportements à ne pas confondre.

## Le générateur
Un générateur **réel** se modélise par une force électromotrice E en série avec une **résistance interne** r :

U = E − r × I

> Plus le courant appelé est fort, plus la tension délivrée **chute**. C'est pourquoi les phares d'une voiture faiblissent au démarrage : le démarreur appelle un courant énorme.

| Le générateur idéal | Ce qu'il maintient constant |
| De **tension** | U, quel que soit I |
| De **courant** | I, quelle que soit U |

## La résistance
U = R × I, en ohms

La puissance qu'elle dissipe est intégralement **thermique** : P = U × I = R × I².

| L'usage | L'exemple |
| **Limiter** un courant | La résistance en série d'une LED, sans laquelle elle grille |
| **Fixer** une tension | Le pont diviseur |
| **Convertir** un signal | La résistance de mesure |

La résistance d'un fil dépend de sa **longueur**, de sa **section** et du **matériau**. Celle d'une **thermistance** varie avec la température : c'est un capteur.

## Le condensateur
Il **stocke** des charges sur deux armatures séparées par un isolant.

Q = C × U, avec C en **farads**

Énergie stockée : E = ½ × C × U²

| Son comportement | Ce qu'il implique |
| Il ne laisse **pas** passer le continu en régime établi | Il bloque une composante continue |
| La **tension** à ses bornes ne peut varier brusquement | C'est sa propriété la plus utile |
| Charge et décharge en exponentielle | Constante de temps **τ = R × C** ; régime établi à 99 % au bout de **5 τ** |

## Trois usages qui en découlent
| L'usage | Ce qu'il exploite |
| **Filtrer** | Lisser une tension redressée |
| **Temporiser** | Créer un délai calibré par τ |
| **Découpler** | Absorber les appels de courant brefs d'un circuit numérique |`,
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
            cours: `Trois composants de plus, dont deux non linéaires — et l'un d'eux a rendu l'électronique moderne possible.

## L'inductance
Une **bobine** stocke l'énergie sous forme **magnétique**. Son inductance L s'exprime en **henrys** :

E = ½ × L × I²

Son comportement est le **symétrique** de celui du condensateur.

| Le composant | Ce qui ne peut varier brusquement | Son comportement en continu établi |
| **Condensateur** | La **tension** à ses bornes | Un interrupteur ouvert |
| **Bobine** | Le **courant** qui la traverse | Un simple **fil** |

> Conséquence décisive : couper brutalement le courant dans une bobine — relais, moteur — provoque une **surtension** capable de détruire le transistor de commande. D'où la **diode de roue libre**, montée en inverse à ses bornes, qui offre au courant un chemin pour s'éteindre.

## La diode
Un composant **non linéaire** qui ne laisse passer le courant que dans un seul sens.

| Le sens | Son comportement |
| **Direct** | Elle conduit dès que la tension dépasse la **tension de seuil** — environ 0,7 V au silicium |
| **Inverse** | Elle **bloque** |

| L'usage | Ce qu'il exploite |
| **Redresser** | Le sens unique |
| **Protéger** | Contre une inversion de polarité |
| La **LED** | Elle émet de la lumière — toujours avec une résistance en série |

## Le transistor
Un courant ou une tension **faible** sur une électrode de commande contrôle un courant **fort** entre les deux autres.

| Le régime | Son fonctionnement | Où on l'emploie |
| **Commutation** | Tout ou rien : bloqué (interrupteur ouvert) ou saturé (fermé) | Toute l'électronique **numérique**, et la commande de puissance |
| **Amplification** | Régime linéaire : la sortie reproduit l'entrée, en plus grand | L'électronique **analogique** |

> Un microcontrôleur qui ne délivre que quelques milliampères peut ainsi piloter un moteur.

> Ce qu'il faut retenir : un transistor **ne fournit pas** l'énergie, il la **module**. La puissance vient toujours de l'alimentation ; le transistor ne fait qu'ouvrir et fermer le robinet.`,
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
            cours: `Étudier un circuit, c'est confronter trois sources : le calcul, la simulation et la mesure. Aucune ne remplace les deux autres.

## Les appareils de mesure
| L'appareil | Ce qu'il donne | Ce qu'il ne donne pas |
| **Multimètre** | Tension (en dérivation), intensité (en série), résistance (hors tension) | L'**allure** d'un signal |
| **Oscilloscope** | La **forme du signal en fonction du temps** | Une valeur unique commode |
| **Générateur de fonctions** | Des signaux d'essai calibrés : sinusoïdal, carré, triangulaire | — |

> Seul l'oscilloscope révèle une allure : un signal carré déformé, un temps de montée, un rebond de contact.

| Le réglage de l'oscilloscope | Son unité |
| **Base de temps** | s/div |
| **Sensibilité verticale** | V/div |

## Lire un oscillogramme
On compte les **divisions** et on multiplie par le calibre.

| La lecture | Le calibre | Le résultat |
| Une période sur 4 divisions | 2 ms/div | 8 ms, soit **125 Hz** |
| Une amplitude de 3 divisions | 5 V/div | **15 V** |

## La simulation
Un simulateur calcule tensions et courants à partir de **modèles** de composants. Il permet d'essayer sans risque, de faire varier un paramètre en quelques secondes, d'observer des points inaccessibles à la mesure.

> Sa limite doit être dite : il ne connaît que les phénomènes **modélisés**. Résistances de contact, capacités parasites, échauffement, tolérances de fabrication et perturbations électromagnétiques n'y figurent pas — sauf si on les y met.

## L'analyse des écarts
C'est le raisonnement central de la démarche de l'ingénieur, et ce que l'épreuve attend.

| L'écart | Ce qu'il révèle |
| Calcul / **simulation** | Une erreur de modèle ou d'hypothèse |
| Simulation / **mesure** | Un phénomène réel non modélisé, ou un composant hors tolérance |
| Mesure / **cahier des charges** | Le produit ne répond pas au besoin : il faut décider quoi corriger |

> Un écart n'est pas un échec : c'est une information. Ce qui serait une faute, c'est de ne pas le mesurer, ou de l'expliquer sans l'avoir cherché.`,
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
