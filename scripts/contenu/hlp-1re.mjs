// HLP PREMIÈRE (Humanités, littérature et philosophie) — les 19 fiches du
// programme officiel, rangées sous ses 6 chapitres. Le programme de Première
// tient en deux semestres : « Les pouvoirs de la parole » (chapitres 1 à 3) et
// « Les représentations du monde » (chapitres 4 à 6).
//
// LE DÉFAUT. Sondé le 21/08/2026 (node _ASSOCIE/sonde-chapitres.mjs 1re hlp) :
// la spécialité de Première n’a que TROIS fiches — « Les pouvoirs de la
// parole », « Les représentations du monde », « Lire, analyser, écrire ». Les
// deux premières résument chacune un SEMESTRE entier en une fiche ; la
// troisième est une fiche de méthode. La rhétorique, le mythe, la séduction de
// la parole, la découverte de l’autre, la perspective, l’encyclopédie et la
// question animale n’ont aucune entrée propre.
//
// POURQUOI UN TROISIÈME MODULE : `hlp.mjs` part dans la 219 et `hlp-tle.mjs`
// dans la 232, toutes deux DÉJÀ EXÉCUTÉES. Trois fichiers, même slug `hlp` —
// d’où la génération par `--modules`, jamais par `--slugs`. La 219 est elle-même
// générée par `--modules snt,hlp,llcer-anglais,si,maths-complementaires`, donc
// par FICHIER : l’ajout de ce module ne la touche pas.
//
// PÉRIMÈTRE : la PREMIÈRE SEULE. Le ménage est borné à `level = '1re'` : la
// Terminale a reçu ses 18 fiches avec la 232, rangées sous ses 6 chapitres par
// la 257.
//
// LA FICHE DE MÉTHODE PART AUSSI. « Lire, analyser, écrire » n’est pas un
// chapitre du programme mais un mode d’emploi de l’épreuve — et la règle inscrite
// dans CLAUDE.md est qu’un dossier de matière ne montre QUE son programme. Même
// arbitrage qu’en HLP de Terminale (257), où « Méthode de l’épreuve » a été
// laissée HORS chapitre parce qu’une annale la visait ; ici, aucune annale ne
// pointe la fiche de 1re, elle part avec les deux composites.

export default {
  slug: 'hlp',
  nom: 'HLP',

  titreMigration: 'HLP 1re — LE PROGRAMME OFFICIEL (19 fiches)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs 1re hlp, 21/08/2026) :
la spécialité HLP de Première n'avait que TROIS fiches — « Les pouvoirs de la
parole », « Les représentations du monde », « Lire, analyser, écrire ». Les deux
premières résument chacune un SEMESTRE ENTIER du programme en une fiche de dix
questions ; la troisième est une fiche de méthode. La rhétorique et ses
fonctions, le mythe comme parole fondatrice, l'autorité morale de la parole, le
discours amoureux, la découverte de l'autre, la représentation de l'étranger,
l'art baroque, l'entreprise encyclopédique, l'invention de la perspective et la
question animale n'avaient AUCUNE entrée propre.

Cette migration installe les 19 fiches du programme, rangées sous ses 6
chapitres, et retire les 3 fiches héritées qu'elles recouvrent.

PÉRIMÈTRE : la PREMIÈRE SEULE. La Terminale a reçu les siennes avec la 232,
rangée sous ses chapitres par la 257 : le ménage est borné au niveau 1re.

⚠️ LA FICHE DE MÉTHODE « Lire, analyser, écrire » PART AUSSI : ce n'est pas un
chapitre du programme mais un mode d'emploi de l'épreuve, et un dossier de
matière ne montre que son programme (règle de CLAUDE.md). Aucune annale ne la
vise, contrairement à « Méthode de l'épreuve » en Terminale, laissée hors
chapitre par la 257.

⚠️ LA 219 EST REJOUABLE : la recoller ferait revenir les 3 fiches en doublon.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 19 fiches sous 6 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que la 234 n'a jamais été
exécutée telle quelle — sans cette reprise, la migration échouerait sur
"column chapters.theme does not exist", les 3 anciennes fiches déjà supprimées
et les 19 neuves pas encore posées : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 3 fiches héritées partent, au niveau 1re SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : le critère « pas de chapitre de
programme » vise exactement les trois lignes voulues, antérieures à la colonne
theme, tandis que les 19 fiches neuves en portent un dès l'INSERT — le ménage
tourne AVANT les insertions et ne peut donc jamais mordre sur elles, ni au
premier passage ni au rejeu. C'est aussi le seul repère sûr : rien ne garantit
que la base porte les mêmes apostrophes que ce fichier (piège de la 249).
⚠️ CE CRITÈRE VISE AUSSI LA FICHE DE MÉTHODE, ET C'EST VOULU (cf. le motif).
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
   AND s.slug = 'hlp'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'hlp'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'hlp'
   AND c.level = '1re'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      chapitres: [
        // ---- Chapitre 1 : l’art de la parole ---------------------------------
        {
          titre: 'Qu’est-ce que la rhétorique ?',
          axe: 'L’art de la parole',
          lecon: {
            titre: 'L’art de bien dire, et ses cinq parties',
            cours: `La rhétorique est l'art de bien dire en vue de persuader. Née dans la Sicile du Ve siècle avant notre ère, à l'occasion de procès en restitution de terres, elle est d'emblée liée à la démocratie.

> Là où l'on décide par la parole, il faut savoir parler.

## Les trois genres
| Le genre | Son temps | Sa fin | Son lieu |
| **Judiciaire** | Le passé | Le **juste** | Le tribunal |
| **Délibératif** | L'avenir | L'**utile** | L'assemblée politique |
| **Épidictique** | Le présent | Le **beau** : louer ou blâmer | La cérémonie |

## Les cinq parties
| La partie | Ce qu'elle fait |
| **Invention** | Trouver les arguments |
| **Disposition** | Les ordonner : exorde, narration, confirmation, péroraison |
| **Élocution** | Les mettre en mots, choisir le style et les figures |
| **Mémoire** | Retenir le discours |
| **Action** | Le prononcer : la voix, le regard, le geste |

> Démosthène, à qui l'on demandait ce qui compte le plus dans l'éloquence, aurait répondu trois fois « l'action ». Le corps n'accompagne pas le discours : il en fait partie.

## Les trois moyens de persuasion
| Le moyen | Ce qu'il mobilise |
| **Ethos** | Ce que l'orateur donne à voir de lui : crédibilité, droiture apparente |
| **Pathos** | Les émotions de l'auditoire |
| **Logos** | Le raisonnement, les preuves, la logique |

## Le procès de la rhétorique
| Le philosophe | Sa position |
| **Platon**, dans le *Gorgias* | Une **flatterie** : elle apprend à paraître savant devant qui ne sait pas, sans se soucier du vrai |
| **Aristote**, dans la *Rhétorique* | Une **technique**, moralement neutre — et l'ignorer laisserait le champ libre à ceux qui en usent mal |

> Le débat n'a rien perdu de son actualité : reconnaître une figure, un appel à l'émotion ou un argument d'autorité est aujourd'hui une compétence de défense autant que d'attaque.`,
          },
          questions: [
            ['Dans quel contexte historique la rhétorique est-elle née ?', ['Dans la Sicile du Ve siècle avant notre ère, à l’occasion de procès', 'À Rome sous l’Empire', 'En France au XVIIe siècle', 'En Grèce à l’époque homérique'], 0, 'Elle est d’emblée liée à la démocratie et au règlement des litiges par la parole.'],
            ['Quel genre rhétorique porte sur l’avenir et vise l’utile ?', ['Le délibératif', 'Le judiciaire', 'L’épidictique', 'Le narratif'], 0, 'C’est le genre de l’assemblée politique.'],
            ['Quelles sont les cinq parties de la rhétorique ?', ['Invention, disposition, élocution, mémoire, action', 'Exorde, narration, confirmation, péroraison, conclusion', 'Ethos, pathos, logos, mythos, kairos', 'Lire, écrire, parler, écouter, retenir'], 0, 'Elles suivent l’ordre du travail de l’orateur.'],
            ['Que désigne l’ethos dans la persuasion ?', ['L’image que l’orateur donne de lui-même', 'L’émotion suscitée chez l’auditoire', 'Le raisonnement logique', 'Le sujet du discours'], 0, 'Le pathos vise l’émotion, le logos le raisonnement.'],
            ['Platon fait l’éloge de la rhétorique dans le Gorgias.', ['Vrai', 'Faux'], 1, 'Il en fait le PROCÈS : une flatterie qui néglige le vrai.'],
            ['Comment Aristote défend-il la rhétorique ?', ['Comme une technique moralement neutre, qu’il vaut mieux connaître', 'Comme une science exacte', 'Comme un art réservé aux philosophes', 'Comme une forme de poésie'], 0, 'L’ignorer laisserait le champ libre à ceux qui en usent mal.'],
            ['Que recouvre l’« action » dans les cinq parties de la rhétorique ?', ['La prononciation du discours : voix, regard, geste', 'Le fait d’agir après avoir parlé', 'La recherche des arguments', 'L’ordre des parties du discours'], 0, 'Démosthène en faisait, dit-on, l’essentiel de l’éloquence.'],
            ['Quel genre rhétorique loue ou blâme au présent ?', ['L’épidictique', 'Le judiciaire', 'Le délibératif', 'Le polémique'], 0, 'Il vise le beau, là où le judiciaire vise le juste.'],
          ],
        },
        {
          titre: 'Plaire et persuader : les fonctions de la rhétorique',
          axe: 'L’art de la parole',
          lecon: {
            titre: 'Instruire, plaire, émouvoir',
            cours: `La tradition latine assigne au discours trois fonctions, que Cicéron résume : instruire, plaire, émouvoir.

## Trois fonctions, trois styles
| La fonction | Son nom latin | Son style |
| **Instruire** | *docere* | **Simple** |
| **Plaire** | *delectare* | **Tempéré** |
| **Émouvoir** | *movere* | **Sublime** |

> Le grand orateur les alterne : un discours entièrement sublime épuise, un discours entièrement simple n'emporte rien.

## Convaincre ou persuader
La distinction est au cœur du chapitre, et régulièrement demandée.

| Le verbe | Ce à quoi il s'adresse | Ses moyens | Ce qu'il obtient |
| **Convaincre** | La **raison** | Preuves, arguments | L'assentiment de l'intelligence |
| **Persuader** | La **sensibilité** | Émotion, images, présence | L'adhésion de tout l'être |

> On peut être convaincu sans être persuadé — savoir qu'il faudrait agir sans s'y résoudre — et persuadé sans être convaincu, ce qui est le danger.

## Les figures au service des fonctions
| La famille | Les figures | Ce qu'elles font |
| **Analogie** | Métaphore, comparaison, personnification | Rendre sensible l'abstrait |
| **Insistance** | Anaphore, hyperbole, gradation | Marteler et amplifier |
| **Opposition** | Antithèse, oxymore, chiasme | Structurer la pensée en tensions |
| **Atténuation** | Litote, euphémisme | Dire moins pour suggérer plus |

## L'éloquence en action
| Le lieu | Le genre |
| L'assemblée | La **délibération** politique |
| Le tribunal | Le **plaidoyer** |
| L'église | Le **sermon** |
| Aujourd'hui | Le débat télévisé, la vidéo en ligne |

La forme change, la structure reste : capter l'attention, établir sa crédibilité, avancer ses raisons, toucher, conclure.

> Une question traverse toute la spécialité : la parole qui plaît et émeut sert-elle la vérité, ou la remplace-t-elle ? Les deux réponses ont leurs textes, et un devoir de HLP attend qu'on les fasse dialoguer plutôt que de trancher trop vite.`,
          },
          questions: [
            ['Quelles sont les trois fonctions du discours selon la tradition latine ?', ['Instruire, plaire, émouvoir', 'Décrire, raconter, argumenter', 'Louer, blâmer, juger', 'Écouter, parler, écrire'], 0, 'Docere, delectare, movere chez Cicéron.'],
            ['Quelle est la différence entre convaincre et persuader ?', ['Convaincre s’adresse à la raison, persuader à la sensibilité', 'Convaincre s’adresse aux émotions, persuader à la logique', 'Ce sont des synonymes', 'Convaincre concerne l’écrit, persuader l’oral'], 0, 'On peut être convaincu sans être persuadé, et l’inverse.'],
            ['Peut-on être persuadé sans être convaincu ?', ['Oui, et c’est précisément le danger', 'Non, jamais', 'Oui, mais uniquement à l’écrit', 'Non, les deux sont identiques'], 0, 'L’adhésion emporte alors sans que la raison ait été satisfaite.'],
            ['À quelle famille appartient l’anaphore ?', ['Aux figures d’insistance', 'Aux figures d’analogie', 'Aux figures d’opposition', 'Aux figures d’atténuation'], 0, 'Elle martèle en répétant un mot en tête de plusieurs segments.'],
            ['Qu’est-ce qu’une litote ?', ['Une figure qui dit moins pour suggérer plus', 'Une exagération volontaire', 'Une comparaison sans outil', 'Une opposition de deux termes'], 0, 'Elle appartient aux figures d’atténuation, avec l’euphémisme.'],
            ['Un discours entièrement écrit dans le style sublime est le plus efficace.', ['Vrai', 'Faux'], 1, 'Il épuise l’auditoire : le grand orateur alterne les trois styles.'],
            ['Qu’est-ce qu’un oxymore ?', ['Le rapprochement de deux termes contradictoires', 'La répétition d’un mot en début de phrase', 'Une comparaison développée', 'Un adoucissement du propos'], 0, 'Il appartient aux figures d’opposition, avec l’antithèse et le chiasme.'],
            ['Le débat télévisé relève des mêmes mécanismes rhétoriques que le plaidoyer antique.', ['Vrai', 'Faux'], 0, 'La forme change, la structure de la persuasion reste.'],
          ],
        },
        {
          titre: 'Les nouvelles figures de la rhétorique',
          axe: 'L’art de la parole',
          lecon: {
            titre: 'La parole publique aujourd’hui',
            cours: `La rhétorique n'a pas disparu avec l'Antiquité : elle a changé de supports, et ces supports ont changé ses règles.

## Ce que les nouveaux médias imposent
| La contrainte | Sa conséquence |
| La **brièveté** | La formule frappante l'emporte sur le développement argumenté |
| La **visibilité algorithmique** | Ce qui circule est ce qui suscite le plus de **réactions** : prime à l'indignation |
| L'**image** | Un discours se juge autant à son montage, sa musique, son cadrage qu'à ses mots |
| L'**horizontalité** | Chacun peut prendre la parole publiquement, ce que les siècles précédents réservaient à une élite |

## Les nouvelles figures
| La figure | Son fonctionnement |
| **Slogan** et **élément de langage** | Formules répétées jusqu'à s'imposer comme évidences |
| **Petite phrase** | Conçue pour être extraite et reprise |
| *Storytelling* | Remplace l'argument par un récit incarné : plus mémorable, plus difficile à réfuter |
| **Mème** | Argument condensé en image, qui fonctionne par connivence |

## Ce qui n'a pas changé
Les ressorts restent ceux d'Aristote.

| Le ressort | Sa forme actuelle |
| **Ethos** | L'authenticité mise en scène : « je vous parle vrai » |
| **Pathos** | L'émotion, plus efficace que jamais |
| **Logos** | Souvent le parent pauvre |

> Le paradoxe : jamais autant de personnes n'ont eu accès à la parole publique, et jamais l'attention n'a été aussi disputée. La rareté a changé de camp — ce n'est plus le droit de parler qui manque, c'est le temps d'écouter.

## Enjeux
La **désinformation** exploite ces mêmes ressorts : une fausse information conçue pour l'émotion circule plus vite qu'un démenti argumenté.

| Le réflexe critique | La question à poser |
| Identifier la **source** | Qui parle, et d'où ? |
| Distinguer le **fait** de l'**opinion** | Est-ce vérifiable ? |
| Repérer l'appel à l'**émotion** | Que veut-on me faire ressentir ? |
| Repérer l'argument d'**autorité** | A-t-on examiné le propos, ou seulement son auteur ? |

> Savoir analyser un discours n'est plus un exercice scolaire : c'est ce qui permet de ne pas être parlé par ce qu'on écoute.`,
          },
          questions: [
            ['Quelle contrainte les réseaux sociaux imposent-ils à la parole publique ?', ['La brièveté et la recherche de la formule frappante', 'La rigueur argumentative', 'La longueur du développement', 'Le respect des cinq parties de la rhétorique'], 0, 'Quelques secondes pour capter l’attention.'],
            ['Qu’est-ce que le storytelling en rhétorique contemporaine ?', ['Le remplacement de l’argument par un récit incarné', 'Une figure d’opposition', 'Un genre judiciaire', 'Un type de sondage'], 0, 'Plus mémorable, et plus difficile à réfuter qu’un argument.'],
            ['Les ressorts de la rhétorique antique ont disparu des médias contemporains.', ['Vrai', 'Faux'], 1, 'Ethos, pathos et logos y sont toujours à l’œuvre : ce sont les supports qui ont changé.'],
            ['Que favorise la visibilité algorithmique ?', ['Les contenus qui suscitent le plus de réactions', 'Les contenus les mieux argumentés', 'Les contenus les plus longs', 'Les contenus les plus anciens'], 0, 'D’où une prime à l’indignation et à la polémique.'],
            ['Pourquoi une fausse information circule-t-elle souvent plus vite qu’un démenti ?', ['Parce qu’elle est conçue pour l’émotion, plus contagieuse que l’argument', 'Parce qu’elle est plus longue', 'Parce qu’elle vient de sources officielles', 'Parce qu’elle est mieux écrite'], 0, 'Le démenti argumenté arrive après, et circule moins.'],
            ['Qu’est-ce qu’un élément de langage ?', ['Une formule préparée et répétée jusqu’à s’imposer comme une évidence', 'Une figure de style antique', 'Un mot rare', 'Un terme technique'], 0, 'Proche du slogan dans son fonctionnement.'],
            ['Quel ressort aristotélicien est le parent pauvre de la communication contemporaine ?', ['Le logos', 'L’ethos', 'Le pathos', 'Aucun'], 0, 'Le raisonnement cède le pas à l’image de soi et à l’émotion.'],
            ['Analyser un discours est aujourd’hui une compétence de défense autant que d’attaque.', ['Vrai', 'Faux'], 0, 'C’est ce qui permet de ne pas être parlé par ce qu’on écoute.'],
          ],
        },

        // ---- Chapitre 2 : l’autorité de la parole ---------------------------
        {
          titre: 'Le mythe, une parole fondatrice',
          axe: 'L’autorité de la parole',
          lecon: {
            titre: 'Ce que raconte un récit qui fonde',
            cours: `Un mythe est un récit anonyme et collectif, transmis par la tradition, qui explique une origine — et fonde ainsi un ordre.

## Ce qui le distingue
| Le récit | Sa marque propre |
| La **fable** | Une leçon morale explicite |
| La **légende** | Un ancrage dans un lieu et un personnage historique |
| Le **conte** | Personne n'attend qu'il soit vrai |
| L'**histoire** | Elle produit des preuves et se corrige |
| Le **mythe** | Ni preuve ni auteur : son autorité tient à ce qu'il est **reçu** |

## Les trois fonctions du mythe
| La fonction | Ce qu'elle fait | Un exemple |
| **Expliquer** | Ce que l'on ne sait pas | D'où vient le feu, pourquoi il y a des saisons, pourquoi on meurt |
| **Fonder** | Une communauté | Romulus pour Rome, la dispute d'Athéna et de Poséidon pour Athènes |
| **Justifier** | Un ordre social | Prométhée et la technique, Pandore et une hiérarchie, la Genèse et le travail |

> Le mythe ne se discute pas : il se raconte. C'est ce qui fait sa puissance — il n'a pas besoin d'être démontré — et son danger : un récit d'origine peut légitimer une domination sans qu'on puisse le réfuter.

## Mythe et philosophie
| Le terme grec | Ce qu'il désigne |
| *Muthos* | Le récit reçu |
| *Logos* | Le discours qui rend raison |

La philosophie grecque naît en partie **contre** le mythe. Mais Platon lui-même y recourt — la caverne, l'attelage ailé, le mythe d'Er — là où l'argument ne suffit plus.

> Le mythe **prolonge** alors le raisonnement au lieu de s'y opposer.

## Le mythe aujourd'hui
Barthes, dans *Mythologies*, montre que le mythe s'est déplacé vers la publicité, le sport, la politique, où des images transforment une construction historique en **évidence naturelle**.

> Reconnaître un mythe contemporain, c'est repérer ce qui se donne pour allant de soi.`,
          },
          questions: [
            ['Qu’est-ce qui caractérise un mythe ?', ['Un récit anonyme et collectif qui explique une origine et fonde un ordre', 'Un récit d’auteur avec une morale explicite', 'Un récit historique vérifiable', 'Un récit destiné aux enfants'], 0, 'Son autorité tient à ce qu’il est reçu et répété, non prouvé.'],
            ['Qu’est-ce qui distingue le mythe de la fable ?', ['La fable vise une leçon morale explicite', 'La fable est plus ancienne', 'La fable est collective et anonyme', 'La fable explique une origine'], 0, 'Le mythe fonde, la fable enseigne.'],
            ['Un mythe se démontre par des preuves.', ['Vrai', 'Faux'], 1, 'Il se raconte : c’est sa force et son danger.'],
            ['Quelle est la fonction fondatrice du mythe ?', ['Faire d’un groupe un « nous » par un récit d’origine partagé', 'Distraire l’auditoire', 'Établir des faits historiques', 'Enseigner une technique'], 0, 'Rome a Romulus, Athènes la dispute d’Athéna et de Poséidon.'],
            ['Que signifie l’opposition entre muthos et logos chez Platon ?', ['Entre le récit reçu et le discours qui rend raison', 'Entre le vrai et le faux', 'Entre l’écrit et l’oral', 'Entre le grec et le latin'], 0, 'Platon recourt pourtant lui-même au mythe quand l’argument ne suffit plus.'],
            ['Platon rejette totalement le recours au mythe.', ['Vrai', 'Faux'], 1, 'La caverne, l’attelage ailé, le mythe d’Er : il y recourt quand l’argument s’arrête.'],
            ['Que montre Barthes dans Mythologies ?', ['Que le mythe transforme aujourd’hui des constructions historiques en évidences naturelles', 'Que les mythes antiques sont faux', 'Que le mythe a disparu de la modernité', 'Que la publicité ignore le mythe'], 0, 'Publicité, sport et politique en sont les nouveaux lieux.'],
            ['Un récit d’origine peut légitimer une domination sans qu’on puisse le réfuter.', ['Vrai', 'Faux'], 0, 'C’est le danger propre à une parole qui ne se discute pas.'],
          ],
        },
        {
          titre: 'L’autorité morale de la parole',
          axe: 'L’autorité de la parole',
          lecon: {
            titre: 'Qui a le droit de parler, et pourquoi on l’écoute',
            cours: `Toute parole n'a pas le même poids. Ce qui fait qu'on écoute quelqu'un tient autant à sa position qu'à ce qu'il dit.

## Les sources de l'autorité
| L'autorité | D'où elle vient | Ses figures |
| **Institutionnelle** | La **fonction**, indépendamment des qualités | Le juge, le maître, le prêtre |
| De **compétence** | Le **savoir** | Le médecin, le savant, l'expert |
| **Morale** | L'**exemplarité** : la vie garantit la parole | Socrate, les prophètes |
| **Charismatique** | Une présence, un don de séduction | Weber l'a montrée puissante et instable |

## L'exigence de cohérence
L'autorité morale se distingue en ceci qu'elle est **révocable par la conduite** : celui dont les actes démentent les mots la perd instantanément, ce qui n'est pas le cas d'une autorité de fonction.

> Socrate en est la figure limite : il n'écrit rien, n'enseigne aucune doctrine, ne réclame aucun titre — et accepte de mourir plutôt que de renier ce qu'il a dit. Sa mort **authentifie** sa parole.

## Les paroles instituées
Certaines paroles **font** ce qu'elles disent : le verdict, le serment, la promesse, la déclaration de mariage. Austin les appelle des énoncés **performatifs** — dire, c'est faire.

| Ce qui fait leur efficacité | Ce qui ne suffit pas |
| Le **cadre** institutionnel | Les mots seuls |

> Le même « je vous déclare unis » prononcé par un passant ne marie personne.

## L'argument d'autorité
Invoquer la position de celui qui parle **au lieu** d'examiner ce qu'il dit est un **sophisme**.

| L'attitude | Ce qu'elle fait |
| La **confiance raisonnée** | Elle s'enquiert de la compétence, des désaccords, des intérêts en jeu |
| La **soumission** | Elle s'en dispense |

> Il n'est pas illégitime de faire confiance à un spécialiste — on ne peut pas tout vérifier. Toute la question est de savoir laquelle des deux attitudes on adopte.`,
          },
          questions: [
            ['Quelle autorité repose sur l’exemplarité de celui qui parle ?', ['L’autorité morale', 'L’autorité institutionnelle', 'L’autorité de compétence', 'L’autorité charismatique'], 0, 'Sa vie garantit sa parole — et la démentir la lui fait perdre.'],
            ['Qu’est-ce qu’un énoncé performatif selon Austin ?', ['Un énoncé qui accomplit ce qu’il dit en le disant', 'Un énoncé particulièrement convaincant', 'Un énoncé qui décrit un fait', 'Un énoncé poétique'], 0, 'Le verdict, le serment, la promesse en sont des exemples.'],
            ['Un performatif est efficace quel que soit celui qui le prononce.', ['Vrai', 'Faux'], 1, 'Il exige un cadre institutionnel : « je vous déclare unis » ne marie pas si un passant le dit.'],
            ['Pourquoi la mort de Socrate authentifie-t-elle sa parole ?', ['Parce qu’il accepte de mourir plutôt que de renier ce qu’il a dit', 'Parce qu’il a écrit une œuvre', 'Parce qu’il détenait une fonction officielle', 'Parce qu’il était le plus savant'], 0, 'Sa conduite garantit son propos : c’est l’autorité morale à l’état pur.'],
            ['Qu’est-ce que l’argument d’autorité ?', ['Invoquer la position de celui qui parle au lieu d’examiner ce qu’il dit', 'Citer une source fiable', 'Employer un ton assuré', 'Parler au nom d’un groupe'], 0, 'C’est un sophisme, à distinguer de la confiance raisonnée en un spécialiste.'],
            ['L’autorité institutionnelle dépend des qualités personnelles de celui qui l’exerce.', ['Vrai', 'Faux'], 1, 'Elle vient de la FONCTION : c’est l’autorité morale qui se perd par la conduite.'],
            ['Qui a analysé l’autorité charismatique ?', ['Max Weber', 'John Austin', 'Roland Barthes', 'Platon'], 0, 'Il en souligne la puissance et l’instabilité.'],
            ['Faire confiance à un spécialiste est toujours un sophisme.', ['Vrai', 'Faux'], 1, 'On ne peut pas tout vérifier : la confiance raisonnée se distingue de la soumission.'],
          ],
        },
        {
          titre: 'S’imposer par la parole',
          axe: 'L’autorité de la parole',
          lecon: {
            titre: 'Éloquence, domination et résistance',
            cours: `La parole ne sert pas seulement à échanger : elle établit des rapports de force. Qui parle, à qui, dans quel ordre, avec quel droit d'interrompre — tout cela dessine une hiérarchie.

## L'éloquence comme pouvoir
| Le lieu | Ce que la parole y donne |
| L'Athènes démocratique | L'accès au pouvoir ; les **sophistes** l'enseignent contre rémunération |
| La Rome républicaine | La carrière politique passe par le barreau et la tribune — Cicéron doit tout à sa voix |

Les sophistes prétendent rendre « le discours le plus faible le plus fort ». C'est exactement ce que Platon leur reproche.

## Trois gestes de pouvoir
| Le geste | Ce qu'il suppose ou révèle |
| **Prendre** la parole | Qu'on vous la reconnaisse. L'histoire des femmes, des esclaves, des colonisés est d'abord celle d'un droit de parole refusé |
| **Garder** la parole | L'interruption, le monopole du temps, le refus de céder le tour |
| **Imposer le silence** | Censure, menace, ostracisme : la forme la plus brutale, et la plus révélatrice |

> La **parrhêsia** grecque désigne le franc-parler : dire toute la vérité, y compris à qui a le pouvoir de vous nuire. Elle suppose un courage, parce qu'elle expose. Foucault en a fait une figure centrale du rapport entre vérité et pouvoir.

## Les mots qui font le monde
Nommer, c'est déjà classer et hiérarchiser.

| Un mot | Son concurrent | Ce que le choix engage |
| « Migrant » | « Exilé » | La contrainte subie, ou non |
| « Réforme » | « Recul » | Le progrès, ou la perte |
| « Émeute » | « Soulèvement » | Le désordre, ou la légitimité |

> Klemperer, dans *LTI*, a montré comment un régime transforme une langue pour transformer les esprits.

## La parole des dominés
| L'arme | Un exemple |
| Le discours de tribune | Victor Hugo sur la misère |
| Le discours politique | Simone Veil, en 1974 |
| Le témoignage | Les récits des rescapés |

> Prendre la parole quand elle vous était refusée est en soi un acte politique, avant même ce qu'on dit.`,
          },
          questions: [
            ['Que prétendaient enseigner les sophistes ?', ['L’art de faire triompher n’importe quelle cause par le discours', 'La science de la nature', 'La grammaire grecque', 'La géométrie'], 0, 'Rendre « le discours le plus faible le plus fort » : ce que Platon leur reproche.'],
            ['Qu’est-ce que la parrhêsia ?', ['Le franc-parler : dire la vérité même à qui peut vous nuire', 'L’art de flatter le puissant', 'Le silence imposé', 'Une figure de style'], 0, 'Foucault en fait une figure centrale du rapport entre vérité et pouvoir.'],
            ['Interrompre et monopoliser le temps de parole sont des gestes de pouvoir.', ['Vrai', 'Faux'], 0, 'Prendre, garder et refuser la parole dessinent une hiérarchie.'],
            ['Qu’a montré Klemperer dans LTI ?', ['Comment un régime transforme la langue pour transformer les esprits', 'Comment traduire le latin', 'Comment enseigner la rhétorique', 'Comment se construit un mythe'], 0, 'Le combat politique est aussi un combat sur les mots.'],
            ['Nommer une réalité est un acte neutre.', ['Vrai', 'Faux'], 1, 'Nommer classe et hiérarchise : « émeute » ou « soulèvement » ne disent pas la même chose.'],
            ['Pourquoi l’histoire des dominés est-elle d’abord celle d’un droit de parole ?', ['Parce que prendre la parole quand elle est refusée est déjà un acte politique', 'Parce qu’ils parlaient une autre langue', 'Parce qu’ils ne savaient pas écrire', 'Parce que la parole était sans importance'], 0, 'L’acte compte avant même le contenu de ce qui est dit.'],
            ['À Rome, quelle voie la carrière politique empruntait-elle principalement ?', ['Le barreau et la tribune', 'L’armée seule', 'Le commerce', 'La prêtrise'], 0, 'Cicéron doit tout à son éloquence.'],
            ['La censure est la forme la plus brutale du pouvoir sur la parole.', ['Vrai', 'Faux'], 0, 'Imposer le silence est aussi la plus révélatrice des rapports de force.'],
          ],
        },
        {
          titre: 'L’art du poète',
          axe: 'Les séductions de la parole',
          lecon: {
            titre: 'La parole qui enchante',
            cours: `Le poète ne cherche pas d'abord à convaincre : il enchante. Sa parole vaut par elle-même, avant tout message.

## L'origine sacrée
Dans la tradition grecque, le poète est **inspiré** : les Muses parlent par sa bouche. D'où l'*enthousiasme*, littéralement le fait d'avoir un dieu en soi.

| L'œuvre | Ce qu'elle pose |
| L'*Ion* de Platon | Si le poète ne sait pas d'où lui vient ce qu'il dit, il ne peut pas en répondre |
| Le mythe d'**Orphée** | Son chant fait pleurer les pierres, suspend les fleuves, arrache une morte aux Enfers |

> La parole poétique y est une **puissance** sur le monde, non une décoration.

## Les moyens du poète
| Le moyen | Ce qu'il produit |
| **Rythme** et **mètre** | Ils font entendre autre chose que le sens |
| **Sonorités** — allitérations, assonances, rimes | Elles lient les mots par le son |
| **Image** — métaphore, comparaison, symbole | Elle donne à voir |
| L'**écart** avec la langue ordinaire | Il oblige à ralentir |

> Ce dernier point est décisif : le poème résiste, il ne se laisse pas consommer. C'est cette résistance qui fait qu'on le relit.

## Poésie et vérité
| Le philosophe | Sa position |
| **Platon** | Il bannit les poètes de la Cité idéale : ils imitent les apparences, flattent les passions, éloignent du vrai |
| **Aristote** | La poésie dit le **général** quand l'histoire dit le **particulier** : elle est donc « plus philosophique » que l'histoire |

> Les modernes déplacent la question : la poésie ne dit pas une vérité **sur** le monde, elle fait éprouver une **manière** de l'habiter. Ce n'est pas un savoir de moins, c'est un savoir d'un autre ordre.

## Le poète moderne
Baudelaire, Rimbaud, Mallarmé rompent avec la belle langue : ils cherchent l'inconnu, dérèglent la syntaxe, travaillent la matière sonore.

| Ce qu'il cesse d'être | Ce qu'il devient |
| Le porte-parole des dieux | Un **explorateur du langage**, et souvent une figure marginale |

> L'albatros de Baudelaire : ses ailes de géant l'empêchent de marcher.`,
          },
          questions: [
            ['Que signifie l’enthousiasme, dans la tradition poétique grecque ?', ['Le fait d’avoir un dieu en soi, d’être inspiré', 'Une grande joie', 'Un travail acharné', 'Une technique apprise'], 0, 'Les Muses parlent par la bouche du poète.'],
            ['Que reproche Platon aux poètes dans la République ?', ['D’imiter les apparences et de flatter les passions', 'D’être trop savants', 'D’écrire en prose', 'De ne pas respecter le mètre'], 0, 'Il les bannit de sa Cité idéale.'],
            ['Selon Aristote, la poésie est plus philosophique que l’histoire.', ['Vrai', 'Faux'], 0, 'Parce qu’elle dit le général là où l’histoire dit le particulier.'],
            ['Que représente la figure d’Orphée ?', ['La puissance de la parole poétique sur le monde', 'La rigueur du raisonnement', 'L’autorité politique', 'La modestie du poète'], 0, 'Son chant suspend les fleuves et arrache une morte aux Enfers.'],
            ['Quel effet produit l’écart entre la langue poétique et la langue ordinaire ?', ['Il oblige à ralentir : le poème résiste et se relit', 'Il rend le poème plus clair', 'Il accélère la lecture', 'Il supprime toute ambiguïté'], 0, 'Cette résistance fait la valeur du texte.'],
            ['Dans l’Ion, Platon montre que le poète peut rendre compte de son savoir.', ['Vrai', 'Faux'], 1, 'Il montre l’inverse : ne sachant d’où vient ce qu’il dit, il n’en peut répondre.'],
            ['Qu’ont en commun Baudelaire, Rimbaud et Mallarmé ?', ['Ils rompent avec la belle langue et explorent la matière du langage', 'Ils écrivent des épopées', 'Ils défendent la poésie didactique', 'Ils reviennent aux formes antiques'], 0, 'Le poète devient explorateur du langage et figure marginale.'],
            ['Que symbolise l’albatros de Baudelaire ?', ['Le poète, majestueux en son élément et empêché parmi les hommes', 'La liberté absolue', 'La puissance politique', 'La pureté de la langue'], 0, 'Ses ailes de géant l’empêchent de marcher.'],
          ],
        },
        {
          titre: 'Le discours amoureux',
          axe: 'Les séductions de la parole',
          lecon: {
            titre: 'Dire l’amour, ou l’inventer',
            cours: `Le discours amoureux est le lieu où la parole cherche à faire naître ce qu'elle prétend seulement exprimer.

## Une parole codée
| Le code | Son époque | Ce qu'il impose |
| L'**amour courtois** | Le Moyen Âge | Le poète sert une dame inaccessible ; le désir se nourrit de l'obstacle |
| Le **pétrarquisme** | La Renaissance | Le teint de lys, le feu et la glace, le doux supplice — images que Du Bellay et Shakespeare finiront par moquer |
| La **carte de Tendre** | Le XVIIe siècle | Les étapes du sentiment cartographiées comme un itinéraire |

> Chaque époque fournit aux amants les mots pour dire ce qu'ils éprouvent — et, en les fournissant, façonne ce qu'ils éprouvent. La Rochefoucauld : bien des gens n'auraient jamais été amoureux s'ils n'avaient entendu parler de l'amour.

## Séduire, c'est parler
| La figure | Ce qu'elle révèle |
| **Dom Juan** | Il promet, jure, épouse **en paroles** : sa force n'est pas dans ce qu'il ressent mais dans ce qu'il sait dire |
| La **lettre**, chez Rousseau et Laclos | On écrit parce qu'on ne peut pas dire ; l'écriture creuse le manque autant qu'elle le comble |

> Dom Juan inquiète précisément parce qu'il montre que le discours amoureux **peut fonctionner à vide**.

## L'insuffisance des mots
Les mots sont **usés**, partagés par tous, incapables de dire ce qui se veut unique.

| Le recours | Ce qu'il tente |
| L'**hyperbole** | Forcer la langue pour dépasser l'ordinaire |
| Le **néologisme** | Inventer un mot qui n'aurait servi à personne d'autre |
| Le **silence** | Avouer que rien ne convient |

> Barthes, dans les *Fragments d'un discours amoureux*, décrit l'amoureux comme quelqu'un qui parle **seul**, dans une langue que personne ne partage — et qui pourtant reprend, sans le savoir, les figures de tous ceux qui ont aimé avant lui.

## Ce que le chapitre demande
Non pas de juger la sincérité des amants, mais d'observer **comment la parole travaille** : ce qu'elle promet, ce qu'elle institue, ce qu'elle échoue à dire.`,
          },
          questions: [
            ['Qu’est-ce que l’amour courtois médiéval ?', ['Un code où le poète sert une dame inaccessible et où l’obstacle nourrit le désir', 'Un mariage arrangé', 'Une déclaration spontanée', 'Un genre théâtral'], 0, 'Le désir s’y entretient de la distance.'],
            ['Qu’est-ce que le pétrarquisme ?', ['Un ensemble d’images convenues pour dire l’amour à la Renaissance', 'Une école philosophique', 'Une forme de sonnet uniquement', 'Un traité de rhétorique'], 0, 'Feu et glace, doux supplice : Du Bellay et Shakespeare finiront par les moquer.'],
            ['Selon La Rochefoucauld, la littérature amoureuse façonne le sentiment lui-même.', ['Vrai', 'Faux'], 0, 'Bien des gens n’auraient jamais aimé s’ils n’en avaient entendu parler.'],
            ['Pourquoi le personnage de Dom Juan inquiète-t-il ?', ['Parce qu’il montre que le discours amoureux peut fonctionner à vide', 'Parce qu’il est trop sincère', 'Parce qu’il refuse de parler', 'Parce qu’il écrit des lettres'], 0, 'Sa force est dans ce qu’il sait dire, non dans ce qu’il ressent.'],
            ['À quoi se heurte le discours amoureux, selon les auteurs du chapitre ?', ['À l’usure des mots, partagés par tous et incapables de dire l’unique', 'À l’interdiction sociale', 'À la brièveté du sentiment', 'À l’absence de vocabulaire'], 0, 'D’où l’hyperbole, le néologisme, ou le silence.'],
            ['Que décrit Barthes dans les Fragments d’un discours amoureux ?', ['Un amoureux qui parle seul et reprend pourtant les figures de tous ses prédécesseurs', 'Une histoire de l’amour courtois', 'Un manuel de séduction', 'Une critique du mariage'], 0, 'La langue la plus intime est aussi la plus héritée.'],
            ['La carte de Tendre représente les étapes du sentiment comme un itinéraire.', ['Vrai', 'Faux'], 0, 'Le XVIIe siècle cartographie ainsi la naissance de l’inclination.'],
            ['Que fait la lettre d’amour, chez Rousseau ou Laclos ?', ['Elle donne une forme à l’absence, et creuse le manque autant qu’elle le comble', 'Elle remplace la rencontre', 'Elle supprime l’obstacle', 'Elle abolit les codes'], 0, 'On écrit parce qu’on ne peut pas dire.'],
          ],
        },
        {
          titre: 'Du bon usage de la parole',
          axe: 'Les séductions de la parole',
          lecon: {
            titre: 'Mensonge, silence et vérité',
            cours: `Après avoir vu ce que la parole peut, reste à demander ce qu'elle doit. Le chapitre est le versant éthique de tout le semestre.

## Le mensonge : deux positions
| L'auteur | Sa thèse | Son argument |
| **Kant** | Le mensonge est **toujours** interdit | Mentir, c'est traiter autrui comme un moyen — et ruiner la condition même du langage : universalisé, le mensonge viderait la parole de sens |
| **Benjamin Constant** | Il dépend du destinataire | Dire la vérité n'est un devoir qu'envers celui qui a **droit** à la vérité |

> Kant maintient l'interdit jusque dans le cas du meurtrier qui demande où se cache sa victime. Position qui a fait scandale, et qu'il faut savoir exposer sans la caricaturer.

## La médisance et la calomnie
| Le trait de la rumeur | Ce qu'il produit |
| Elle circule | Chacun la relaie en la croyant vérifiée par le fait qu'un autre l'a dite |
| Elle est **irréversible** | Un démenti n'efface pas ce qui a été entendu |

## Le silence
Il n'est pas l'absence de parole, mais l'une de ses formes.

| Le silence | Ce qu'il fait |
| De **prudence** | Il retient ce qui blesserait inutilement |
| De **complicité** | Il laisse faire : « qui ne dit mot consent » |
| De **respect** | Devant la douleur ou l'indicible |
| **Imposé** | Celui du censeur |

> Après les catastrophes du XXe siècle, la question s'est déplacée : ce qui pose problème n'est plus seulement ce qu'on dit, mais ce qu'on **n'arrive pas** à dire — et le devoir de continuer malgré tout, pour le témoignage.

## La parole juste
| L'exigence | Ce qu'elle demande |
| Parler **à propos** | Le *kairos* grec : savoir le moment |
| Mesurer la **portée** | Devant qui, et avec quelles conséquences |
| **Écouter** avant de répondre | Ne pas parler contre |
| Ne pas confondre | Le **droit** de dire et le **devoir** de tout dire |

> La question du bon usage de la parole n'est pas une question de politesse mais de responsabilité — et elle se pose à chaque publication en ligne.`,
          },
          questions: [
            ['Pourquoi Kant juge-t-il le mensonge toujours interdit ?', ['Parce qu’il ruine la condition même du langage et traite autrui comme un moyen', 'Parce qu’il est inefficace', 'Parce qu’il est puni par la loi', 'Parce qu’il finit toujours par se savoir'], 0, 'Il maintient l’interdit jusque dans le cas du meurtrier à la porte.'],
            ['Que répond Benjamin Constant à Kant ?', ['Dire la vérité n’est un devoir qu’envers celui qui y a droit', 'Le mensonge est toujours permis', 'La vérité est inaccessible', 'Le silence vaut mieux que la parole'], 0, 'Le meurtrier qui cherche sa victime n’a pas droit à la vérité.'],
            ['Une rumeur se répand parce qu’elle a été vérifiée.', ['Vrai', 'Faux'], 1, 'Elle se répand parce qu’elle circule : chacun la croit vérifiée par le fait qu’un autre l’a dite.'],
            ['Qu’est-ce qui rend la calomnie particulièrement grave ?', ['Son irréversibilité : un démenti n’efface pas ce qui a été entendu', 'Sa lenteur de propagation', 'Son caractère écrit', 'Sa légalité'], 0, 'Le mal est fait avant que la vérité arrive.'],
            ['Le silence est toujours l’absence de parole.', ['Vrai', 'Faux'], 1, 'Il en est une forme : prudence, complicité, respect ou censure.'],
            ['Que désigne le kairos grec ?', ['Le moment opportun pour parler', 'Le franc-parler', 'La beauté du style', 'L’autorité de l’orateur'], 0, 'Parler à propos fait partie de la parole juste.'],
            ['Quel silence relève de la complicité ?', ['Celui qui laisse faire ce qu’on désapprouve', 'Celui qui respecte la douleur', 'Celui qui retient une parole blessante', 'Celui qu’impose le censeur'], 0, '« Qui ne dit mot consent. »'],
            ['Le droit de dire équivaut au devoir de tout dire.', ['Vrai', 'Faux'], 1, 'Mesurer la portée de sa parole fait partie de son bon usage.'],
          ],
        },

        // ---- Chapitre 4 : découverte du monde et rencontre des cultures -----
        {
          titre: 'La découverte de l’autre',
          axe: 'Découverte du monde et rencontre des cultures',
          lecon: {
            titre: 'Le choc des mondes, et ce qu’il révèle',
            cours: `En quelques décennies, l'Europe apprend l'existence de peuples entiers dont aucun de ses livres ne parlait. Cette rencontre l'oblige à se penser elle-même.

## L'événement
1492 : Colomb atteint l'Amérique en croyant aborder les Indes. Suivent la conquête, l'effondrement démographique des populations amérindiennes, l'évangélisation forcée et la traite.

> La « découverte » est aussi une **destruction** : c'est sous ce double aspect que le programme demande de l'étudier.

## Trois attitudes devant l'autre
| L'attitude | Ce qu'elle affirme | Ce qu'elle produit |
| **Réduire** | L'autre est un sauvage, un être inachevé | Elle légitime la conquête |
| **Idéaliser** | L'autre vit dans l'innocence que nous avons perdue | Le **bon sauvage** : renversement généreux, mais qui reste une projection |
| **Comprendre** | L'autre a une culture entière, avec sa cohérence propre | La seule qui regarde vraiment |

## La controverse de Valladolid
En 1550, l'Espagne organise un débat public sur la question de savoir si les Indiens ont une âme et des droits.

| L'orateur | Sa thèse |
| **Las Casas**, qui a vu la conquête | Leur pleine humanité |
| **Sepúlveda** | La guerre juste, et la servitude naturelle d'Aristote |

> Que la question ait dû être **posée** en dit autant que la réponse.

## Montaigne, « Des cannibales »
Le texte central du chapitre. Montaigne rapporte les usages des Tupinambas, anthropophagie rituelle comprise, et retourne le jugement : « chacun appelle barbarie ce qui n'est pas de son usage ».

| La cruauté | Sur qui elle s'exerce |
| Celle du cannibale | Sur un **mort** |
| Celle des guerres de religion | Sur un **vivant** |

> Le geste de Montaigne n'est pas de dire que tout se vaut, mais de **suspendre** le jugement le temps de regarder — et de découvrir que la mesure avec laquelle on jugeait était locale.

## L'ethnocentrisme
Juger les autres cultures à l'aune de la sienne, en la tenant pour la mesure de toutes.

> Lévi-Strauss, dans *Race et histoire*, en fait l'attitude la mieux partagée du monde : chaque société tend à réserver le nom d'humanité à ses propres membres. Le reconnaître est la condition d'un regard moins étroit.`,
          },
          questions: [
            ['Pourquoi la « découverte » de l’Amérique doit-elle être étudiée sous un double aspect ?', ['Parce qu’elle est aussi une conquête et une destruction', 'Parce que Colomb s’est trompé de route', 'Parce qu’elle fut tardive', 'Parce qu’elle a enrichi l’Europe'], 0, 'Effondrement démographique, évangélisation forcée et traite l’accompagnent.'],
            ['Quelle attitude consiste à voir dans l’autre l’innocence perdue de l’Europe ?', ['L’idéalisation, avec la figure du bon sauvage', 'La réduction à la barbarie', 'La compréhension ethnographique', 'L’indifférence'], 0, 'Le renversement est généreux, mais on parle encore de soi.'],
            ['Quel est l’enjeu de la controverse de Valladolid en 1550 ?', ['Savoir si les Indiens ont une âme et des droits', 'Le partage des terres conquises', 'La route des Indes', 'Le commerce des épices'], 0, 'Que la question ait dû être posée en dit autant que la réponse.'],
            ['Qui plaide pour la pleine humanité des Indiens à Valladolid ?', ['Las Casas', 'Sepúlveda', 'Montaigne', 'Colomb'], 0, 'Sepúlveda défend, lui, la guerre juste et la servitude naturelle.'],
            ['Que soutient Montaigne dans « Des cannibales » ?', ['Que chacun appelle barbarie ce qui n’est pas de son usage', 'Que les cannibales doivent être civilisés', 'Que toutes les cultures se valent en tout point', 'Que l’Europe est supérieure'], 0, 'Il compare la cruauté du cannibale à celle des guerres de religion.'],
            ['Montaigne conclut que tous les usages se valent indifféremment.', ['Vrai', 'Faux'], 1, 'Il suspend le jugement le temps de regarder, et découvre que sa mesure était locale.'],
            ['Qu’est-ce que l’ethnocentrisme ?', ['Juger les autres cultures à l’aune de la sienne, tenue pour la mesure de toutes', 'L’étude scientifique des peuples', 'Le refus de voyager', 'La comparaison des langues'], 0, 'Lévi-Strauss en fait l’attitude la mieux partagée du monde.'],
            ['Dans quel ouvrage Lévi-Strauss analyse-t-il l’ethnocentrisme ?', ['Race et histoire', 'Les Essais', 'Le Contrat social', 'Les Mythologies'], 0, 'Chaque société tend à réserver le nom d’humanité à ses membres.'],
          ],
        },
        {
          titre: 'La représentation de l’étranger',
          axe: 'Découverte du monde et rencontre des cultures',
          lecon: {
            titre: 'Ce que l’image de l’autre dit de nous',
            cours: `L'autre n'est presque jamais rencontré : il est d'abord représenté. Une figure de l'étranger circule bien avant lui.

## Les figures héritées
| La figure | Son époque | Ce qui la définit |
| Le **barbare** | La Grèce | Celui qui ne parle pas grec : la frontière est **linguistique** avant d'être morale |
| Le **monstre** | Le Moyen Âge | Les cartes peuplent les marges du monde de cynocéphales et d'hommes sans tête |
| L'**exotique** | L'âge classique | L'ailleurs comme décor, désirable et sans consistance propre |
| L'**orientalisme**, selon Said | Le XIXe siècle | Un Orient rêvé, immobile et sensuel, qui en dit plus sur l'Occident |

## Le regard renversé
Une stratégie littéraire majeure : faire décrire **notre** monde par un étranger, pour le rendre étrange.

| L'œuvre | Son procédé |
| Montesquieu, *Lettres persanes* | Deux Persans à Paris trouvent bizarres nos usages ; « comment peut-on être Persan ? » retourne l'étonnement contre celui qui s'étonne |
| Voltaire, *Micromégas* et *L'Ingénu* | Le regard naïf démasque l'arbitraire de ce que nous tenons pour naturel |

> Le procédé s'appelle la **défamiliarisation** : rendre étrange le familier pour le voir enfin. C'est l'un des grands outils des Lumières, et il fonctionne encore.

## Les images d'aujourd'hui
| Le trait du stéréotype | Ce qu'il produit |
| Il est **économique** | Il dispense de connaître |
| Il **circule vite** | Il se transmet sans examen |
| Il se **confirme lui-même** | On remarque ce qui le vérifie, on oublie ce qui le dément |

Médias, publicité et cinéma en produisent en continu.

## Ce que le chapitre demande
| La question | Ce qu'elle cherche |
| Quelle figure est **construite** ? | Le portrait exact |
| Par quels **moyens** ? | Images, mots, cadrages |
| À qui **profite**-t-elle ? | L'intérêt servi |
| Que révèle-t-elle de celui qui la trace ? | L'autoportrait involontaire |

> Une représentation de l'étranger est toujours, aussi, un autoportrait.`,
          },
          questions: [
            ['Que désigne le mot « barbare » chez les Grecs ?', ['Celui qui ne parle pas grec', 'Un ennemi militaire', 'Un être cruel', 'Un habitant du Nord'], 0, 'La frontière est linguistique avant d’être morale.'],
            ['Qu’a nommé Edward Said « orientalisme » ?', ['Le discours occidental qui construit un Orient rêvé et immobile', 'L’étude des langues orientales', 'Un courant pictural', 'Une religion'], 0, 'Il en dit plus sur l’Occident que sur l’Orient.'],
            ['Quel procédé Montesquieu emploie-t-il dans les Lettres persanes ?', ['Faire décrire la France par des étrangers pour la rendre étrange', 'Décrire la Perse avec exactitude', 'Comparer deux religions', 'Raconter un voyage réel'], 0, '« Comment peut-on être Persan ? » retourne l’étonnement.'],
            ['Comment appelle-t-on le fait de rendre étrange le familier pour le voir enfin ?', ['La défamiliarisation', 'L’ethnocentrisme', 'L’exotisme', 'L’allégorie'], 0, 'C’est l’un des grands outils littéraires des Lumières.'],
            ['Pourquoi les stéréotypes sont-ils si tenaces ?', ['Ils dispensent de connaître et se confirment eux-mêmes', 'Ils sont vérifiés par la science', 'Ils sont transmis par la loi', 'Ils sont rarement diffusés'], 0, 'On remarque ce qui les vérifie et on oublie ce qui les dément.'],
            ['Les cartes médiévales peuplent les marges du monde de créatures monstrueuses.', ['Vrai', 'Faux'], 0, 'L’inconnu s’écrit d’abord en monstres.'],
            ['Que révèle une représentation de l’étranger ?', ['Autant celui qui la trace que celui qu’elle prétend décrire', 'Uniquement la culture décrite', 'Rien de significatif', 'La vérité historique'], 0, 'Elle est toujours, aussi, un autoportrait.'],
            ['Le regard naïf de L’Ingénu sert à démasquer l’arbitraire des usages français.', ['Vrai', 'Faux'], 0, 'Voltaire emploie le même procédé que Montesquieu.'],
          ],
        },
        {
          titre: 'D’un monde clos à l’univers infini',
          axe: 'Découverte du monde et rencontre des cultures',
          lecon: {
            titre: 'La révolution astronomique et ses effets',
            cours: `Entre le XVIe et le XVIIe siècle, l'Europe change de cosmos. Ce n'est pas une simple révision scientifique : c'est la place de l'homme dans l'être qui se déplace.

## Le monde d'avant
Le modèle d'**Aristote et Ptolémée** décrit un univers **fini**, **clos** et **hiérarchisé**.

| Le domaine | Ce qui y règne |
| **Sublunaire** | Le changement et la corruption |
| **Supralunaire** | La perfection et les mouvements circulaires éternels |

La Terre est immobile au centre, entourée de sphères concentriques.

> Ce cosmos est **habitable** au sens fort : chaque chose y a un lieu propre, et l'homme y occupe le centre.

## Les étapes de la rupture
| La date | Le savant | Ce qu'il établit | Ce qu'il lui en coûte |
| **1543** | **Copernic** | Le Soleil au centre — d'abord comme hypothèse de calcul | — |
| **1600** | **Giordano Bruno** | L'univers **infini** et la pluralité des mondes | Il est brûlé |
| **1610-1633** | **Galilée** | Les satellites de Jupiter (tout ne tourne pas autour de la Terre) et les reliefs de la Lune (fin de la perfection supralunaire) | Il est condamné |
| **1687** | **Newton** | Ciel et terre unifiés sous une même loi de gravitation | — |

## Ce qui se perd
| Ce qui disparaît | Sa conséquence |
| La position **centrale** de l'homme | Il n'est plus au milieu de l'être |
| Le **haut** et le **bas** | Plus d'ordre naturel des places |
| La nature comme **livre** à déchiffrer | Elle devient un système à **mesurer** |

Alexandre Koyré a résumé le mouvement d'une formule : « du monde clos à l'univers infini ».

> Pascal en tire l'effroi le plus célèbre : « le silence éternel de ces espaces infinis m'effraie ». Et pourtant, dans le même mouvement, il fait de la pensée la grandeur du roseau : l'homme est écrasé par l'univers, mais il le sait, et l'univers ne sait rien.

## Un décentrement inachevé
Chaque avancée le reconduit : le Soleil n'est qu'une étoile parmi des milliards, la galaxie une parmi des milliards d'autres.

> Le chapitre demande moins de retenir des dates que de mesurer ce que coûte, et ce que vaut, un tel changement de cadre.`,
          },
          questions: [
            ['Comment le cosmos d’Aristote et Ptolémée est-il conçu ?', ['Fini, clos et hiérarchisé, avec la Terre immobile au centre', 'Infini et homogène', 'Centré sur le Soleil', 'Sans ordre déterminé'], 0, 'Le monde sublunaire y est celui du changement, le supralunaire celui de la perfection.'],
            ['Qui a affirmé l’infinité de l’univers et la pluralité des mondes ?', ['Giordano Bruno', 'Copernic', 'Ptolémée', 'Newton'], 0, 'Il est brûlé en 1600 pour cette thèse, entre autres.'],
            ['Qu’observent les premières lunettes de Galilée ?', ['Les satellites de Jupiter et les reliefs de la Lune', 'Les anneaux de Saturne uniquement', 'Les galaxies lointaines', 'Le mouvement des comètes'], 0, 'Tout ne tourne donc pas autour de la Terre, et le ciel n’est pas parfait.'],
            ['Copernic place le Soleil au centre dès 1543.', ['Vrai', 'Faux'], 0, 'D’abord comme hypothèse de calcul, avant que d’autres en tirent les conséquences.'],
            ['Quelle formule d’Alexandre Koyré résume la révolution astronomique ?', ['Du monde clos à l’univers infini', 'De la Terre au Soleil', 'Du mythe au logos', 'De la foi à la raison'], 0, 'Elle donne son titre au chapitre.'],
            ['Que perd l’homme dans ce changement de cosmos ?', ['Sa position centrale et un univers ordonné par des places naturelles', 'Sa capacité de calcul', 'Son rapport à la religion uniquement', 'Rien d’essentiel'], 0, 'L’univers n’a plus de haut ni de bas.'],
            ['Quelle est la réponse de Pascal à l’effroi devant les espaces infinis ?', ['La pensée fait la grandeur de l’homme, qui sait ce qui l’écrase', 'Le retour au géocentrisme', 'Le refus de la science', 'L’indifférence'], 0, 'L’univers écrase l’homme, mais il n’en sait rien.'],
            ['Newton unifie le ciel et la terre sous une même loi.', ['Vrai', 'Faux'], 0, 'La gravitation universelle abolit la séparation entre sublunaire et supralunaire.'],
          ],
        },
        {
          titre: 'L’art baroque, expression de l’angoisse métaphysique',
          axe: 'Découverte du monde et rencontre des cultures',
          lecon: {
            titre: 'Un art du mouvement et de l’instabilité',
            cours: `Le baroque naît à la fin du XVIe siècle et domine le XVIIe européen. Il est la traduction esthétique d'un monde qui a perdu ses repères.

## Le mot
De *barroco*, la perle irrégulière.

> Le mot dit déjà l'essentiel : ce qui n'est pas rond, pas régulier, pas apaisé.

## Les traits
| Le trait | Sa manifestation |
| Le **mouvement** | Lignes courbes, torsions, diagonales, drapés agités : rien n'est stable |
| L'**illusion** | Trompe-l'œil, plafonds ouverts sur le ciel, machines de théâtre — l'art montre qu'il fait illusion |
| La **métamorphose** | Les êtres changent d'état, se déguisent ; le théâtre dans le théâtre en est la forme achevée |
| Le **contraste** | Ombre et lumière violemment opposées : le clair-obscur du Caravage |
| L'**excès** | Profusion des ornements, démesure, saturation |

## Les grands motifs
| Le motif | Ce qu'il rappelle | Ses signes |
| **Vanité** | La brièveté de la vie | Crâne, sablier, fleur fanée, bulle de savon |
| *Memento mori* | Souviens-toi que tu vas mourir | — |
| *Theatrum mundi* | Le monde est un théâtre, chacun y joue un rôle qu'il n'a pas choisi | Shakespeare, Calderón (*La vie est un songe*), Corneille (*L'Illusion comique*) |

> L'instabilité baroque n'est pas un goût décoratif : c'est une **réponse** à un monde où plus rien ne tient. Si l'univers est infini et si la Terre bouge, alors les apparences peuvent tromper — et l'art le met en scène.

## Baroque et classicisme
| L'esthétique | Ce qu'elle cherche |
| **Baroque** | Mouvement, illusion, excès, instabilité |
| **Classicisme** | Mesure, symétrie, clarté, règles, unité |

> Les deux coexistent et se répondent : Versailles est classique, mais ses fêtes sont baroques.

Le chapitre demande de savoir **repérer** les traits baroques dans un tableau, un texte ou une scène, et de les rattacher à l'inquiétude qui les produit.`,
          },
          questions: [
            ['D’où vient le mot « baroque » ?', ['De barroco, la perle irrégulière', 'Du nom d’un architecte', 'D’un mot grec signifiant excès', 'Du latin barbarus'], 0, 'Le mot dit déjà l’irrégularité et l’instabilité.'],
            ['Quel trait N’EST PAS caractéristique du baroque ?', ['La symétrie apaisée', 'Le mouvement', 'L’illusion', 'La métamorphose'], 0, 'La symétrie et la mesure sont du côté du classicisme.'],
            ['Que signifie le motif du theatrum mundi ?', ['Le monde est un théâtre où chacun joue un rôle qu’il n’a pas choisi', 'Le théâtre doit imiter le monde', 'Les acteurs sont des modèles', 'Le monde est un rêve sans réalité'], 0, 'Shakespeare, Calderón et Corneille y reviennent.'],
            ['Qu’est-ce qu’une vanité, en peinture baroque ?', ['Une composition rappelant la brièveté de la vie par des objets symboliques', 'Un portrait flatteur', 'Un paysage idéalisé', 'Une scène religieuse'], 0, 'Crâne, sablier, fleur fanée, bulle de savon.'],
            ['L’instabilité baroque est un simple goût décoratif.', ['Vrai', 'Faux'], 1, 'C’est une réponse esthétique à un monde qui a perdu ses repères.'],
            ['Quel peintre est associé au clair-obscur violemment contrasté ?', ['Le Caravage', 'Poussin', 'Vermeer', 'Raphaël'], 0, 'Le contraste ombre-lumière est un trait baroque majeur.'],
            ['Que cherche le classicisme français, à l’inverse du baroque ?', ['La mesure, la symétrie, la clarté et le respect des règles', 'Le mouvement et l’excès', 'L’illusion et le trompe-l’œil', 'La métamorphose'], 0, 'Les deux esthétiques coexistent pourtant, et se répondent.'],
            ['La vie est un songe, de Calderón, illustre le motif du monde comme théâtre.', ['Vrai', 'Faux'], 0, 'Le rôle, le déguisement et l’incertitude sur le réel y sont centraux.'],
          ],
        },

        // ---- Chapitre 5 : décrire, figurer, imaginer ------------------------
        {
          titre: 'Dire le monde : l’entreprise encyclopédique',
          axe: 'Décrire, figurer, imaginer',
          lecon: {
            titre: 'Rassembler tout le savoir, et le classer',
            cours: `Encyclopédie vient du grec : le « cercle » des connaissances. L'ambition est ancienne, mais elle change de nature au XVIIIe siècle.

## L'Encyclopédie de Diderot et d'Alembert
| Le chiffre | Sa valeur |
| Années de publication | **1751 à 1772** |
| Volumes | 28 |
| Articles | Plus de 70 000 |
| Collaborateurs | Environ 150 |

## Ses partis pris, qui en font une œuvre de combat
| Le parti pris | Ce qu'il implique |
| Le savoir doit être **utile** et **accessible** | Une place considérable aux **arts mécaniques**, aux métiers, aux techniques, et **onze volumes de planches** qui les montrent |
| La connaissance vient de l'**expérience** et de la **raison** | Ni autorité, ni révélation |
| L'ordre du savoir ne doit rien à la théologie | L'**arbre des connaissances** le range selon les facultés humaines |

| La faculté | La branche du savoir |
| **Mémoire** | L'histoire |
| **Raison** | La philosophie |
| **Imagination** | La poésie |

## Une œuvre censurée
Le privilège est révoqué en **1759** ; l'ouvrage se poursuit dans la semi-clandestinité.

> Les encyclopédistes déjouent la censure par le **système des renvois** : un article anodin renvoie à un autre qui en ruine le contenu. C'est une stratégie d'écriture, et il faut savoir l'expliquer.

## Le problème du classement
| Le classement | Son avantage | Son inconvénient |
| Par **matières** | Il montre les liens entre savoirs | Il suppose de connaître d'avance les frontières entre disciplines |
| Par ordre **alphabétique** | Neutre, et consultable par qui ne sait pas encore | Arbitraire, il émiette |

L'Encyclopédie choisit l'alphabet **et** l'arbre, et compense l'émiettement par les renvois.

> Classer, c'est déjà interpréter. Le choix n'est jamais innocent.

## Le rêve encyclopédique aujourd'hui
Bases de données, moteurs de recherche, encyclopédies collaboratives : les questions n'ont pas changé.

| La question | Ce qu'elle vise |
| Qui **écrit** ? | La légitimité |
| Selon quelles **règles** ? | La méthode |
| Avec quelle **vérification** ? | La fiabilité |
| Qu'est-ce qui reste **absent** ? | Les angles morts |

> Toute encyclopédie en a : ce qu'elle juge indigne d'un article, les savoirs qu'elle ne reconnaît pas comme tels, les régions du monde qu'elle traite à la marge. Les repérer fait partie de la lecture.`,
          },
          questions: [
            ['Que signifie étymologiquement « encyclopédie » ?', ['Le cercle des connaissances', 'Le livre des sciences', 'La somme des livres', 'L’art de classer'], 0, 'L’ambition est ancienne, mais change de nature au XVIIIe siècle.'],
            ['Quelle place l’Encyclopédie de Diderot donne-t-elle aux arts mécaniques ?', ['Une place considérable, avec onze volumes de planches', 'Une place marginale', 'Aucune place', 'Une place réservée aux annexes'], 0, 'Les métiers et les techniques étaient jusque-là méprisés.'],
            ['Sur quoi l’Encyclopédie fonde-t-elle la connaissance ?', ['Sur l’expérience et la raison, non sur l’autorité', 'Sur la révélation', 'Sur la tradition scolastique', 'Sur le consensus des savants'], 0, 'C’est ce qui en fait une œuvre de combat.'],
            ['Comment les encyclopédistes déjouent-ils la censure ?', ['Par un système de renvois entre articles', 'En publiant à l’étranger uniquement', 'En signant sous pseudonyme', 'En supprimant les articles sensibles'], 0, 'Un article anodin renvoie à un autre qui en ruine le contenu.'],
            ['Selon quelles facultés l’arbre des connaissances range-t-il le savoir ?', ['Mémoire, raison et imagination', 'Théologie, droit et médecine', 'Nature, homme et Dieu', 'Passé, présent et avenir'], 0, 'À quoi correspondent l’histoire, la philosophie et la poésie.'],
            ['Classer le savoir est un geste neutre.', ['Vrai', 'Faux'], 1, 'Classer, c’est déjà interpréter : le choix de l’ordre engage une conception du savoir.'],
            ['Quel avantage l’ordre alphabétique présente-t-il ?', ['Il rend l’ouvrage consultable par qui ne connaît pas encore les disciplines', 'Il respecte la hiérarchie des sciences', 'Il évite les renvois', 'Il regroupe les sujets voisins'], 0, 'Il est arbitraire, mais neutre et accessible.'],
            ['Toute encyclopédie comporte des angles morts.', ['Vrai', 'Faux'], 0, 'Repérer ce qu’elle juge indigne d’un article fait partie de sa lecture.'],
          ],
        },
        {
          titre: 'L’invention de la perspective',
          axe: 'Décrire, figurer, imaginer',
          lecon: {
            titre: 'Représenter l’espace, et choisir un point de vue',
            cours: `La perspective linéaire est une construction géométrique mise au point à Florence au début du XVe siècle par Brunelleschi, et théorisée par Alberti en 1435.

## Le principe
Le tableau est traité comme une **fenêtre** ouverte sur l'espace.

| La règle | Son effet |
| Les parallèles perpendiculaires au plan du tableau **convergent** | Vers un unique **point de fuite**, sur la ligne d'horizon |
| La taille décroît avec l'éloignement | Proportionnellement à la distance |

## Ce qui change avec elle
| Avant | Après |
| La taille des figures dépend de leur **importance** — le Christ est grand parce qu'il est le Christ | Elle dépend de leur **position** |
| L'espace est symbolique | L'espace est **mesurable** et cohérent : on peut y calculer les distances |
| Le regard n'est pas situé | Le tableau suppose un **spectateur unique**, à un endroit précis |

> La perspective **institue** un point de vue, et l'humanisme s'y reconnaît : le monde est organisé depuis le regard d'un homme.

> Panofsky a soutenu qu'elle est une **forme symbolique** : non la vision « vraie », mais une convention historique. D'autres cultures ont représenté l'espace autrement, sans erreur ni retard.

## Les usages du procédé
| Le procédé | Ce qu'il fait | Son exemple |
| L'**anamorphose** | L'image ne se recompose que d'un point oblique | Le crâne des *Ambassadeurs* de Holbein : la vanité surgit quand on quitte la place assignée |
| Le **trompe-l'œil** | Il fait disparaître la limite entre espace peint et espace réel | Les plafonds baroques |

## La remise en cause
| Le moment | Ce qui advient |
| **Cézanne**, puis le **cubisme** | Plusieurs points de vue coexistent sur la même toile : un objet ne se donne jamais d'un seul coup |
| La **photographie** | Elle produit mécaniquement une image perspective, et libère la peinture de cette tâche |

> Ce que le chapitre retient : représenter n'est jamais **enregistrer**. Toute représentation est une construction, qui choisit un point de vue et, ce faisant, en exclut d'autres.`,
          },
          questions: [
            ['Qui met au point la perspective linéaire au début du XVe siècle ?', ['Brunelleschi, à Florence', 'Alberti, à Rome', 'Léonard de Vinci, à Milan', 'Giotto, à Assise'], 0, 'Alberti la théorise ensuite dans son traité de 1435.'],
            ['Vers quoi convergent les lignes de fuite d’une perspective linéaire ?', ['Vers un point de fuite unique sur la ligne d’horizon', 'Vers les quatre coins du tableau', 'Vers le centre géométrique de la toile', 'Vers plusieurs points dispersés'], 0, 'La taille des objets décroît avec l’éloignement.'],
            ['De quoi dépendait la taille des figures dans l’art médiéval ?', ['De leur importance symbolique', 'De leur distance au spectateur', 'De la place disponible', 'De la richesse du commanditaire'], 0, 'La perspective substitue la position à l’importance : un changement de logique complet.'],
            ['Que soutient Panofsky à propos de la perspective ?', ['Qu’elle est une forme symbolique, convention historique et non vision vraie', 'Qu’elle est la seule représentation exacte', 'Qu’elle est un progrès technique sans conséquence', 'Qu’elle vient de l’Antiquité'], 0, 'D’autres cultures ont représenté l’espace autrement, sans erreur ni retard.'],
            ['Qu’est-ce qu’une anamorphose ?', ['Une image déformée qui ne se recompose que vue d’un point oblique', 'Une peinture sans perspective', 'Un portrait de groupe', 'Une esquisse préparatoire'], 0, 'Le crâne des Ambassadeurs de Holbein en est l’exemple canonique.'],
            ['La perspective suppose un spectateur placé en un point précis.', ['Vrai', 'Faux'], 0, 'Elle institue un point de vue : le monde s’organise depuis un regard.'],
            ['Qu’apporte le cubisme à la question de la représentation de l’espace ?', ['Plusieurs points de vue coexistent sur la même toile', 'Un point de fuite plus précis', 'Le retour à l’art médiéval', 'La suppression de la couleur'], 0, 'Un objet ne se donne jamais d’un seul coup.'],
            ['Représenter, c’est enregistrer fidèlement ce qui est.', ['Vrai', 'Faux'], 1, 'Toute représentation construit, choisit un point de vue et en exclut d’autres.'],
          ],
        },
        {
          titre: 'L’imagination et le savoir',
          axe: 'Décrire, figurer, imaginer',
          lecon: {
            titre: 'Faculté trompeuse ou condition de la connaissance ?',
            cours: `L'imagination est la faculté de se représenter ce qui n'est pas présent, et de composer des images inédites. Égare-t-elle, ou fait-elle connaître ?

## Le procès
| L'auteur | Sa formule ou sa thèse |
| **Malebranche** | « La folle du logis » |
| **Pascal** | « Maîtresse d'erreur et de fausseté » — d'autant plus dangereuse qu'elle est parfois juste |
| **Descartes** | Il l'écarte de la méthode : le morceau de cire est connu par l'**entendement** seul |

> Le reproche est constant : l'imagination confond ce qu'elle produit avec ce qui est, et elle emporte le jugement par la vivacité de ses images.

## La réhabilitation
| L'auteur | Ce qu'il en fait |
| **Kant** | Une faculté **nécessaire** : sans elle pour synthétiser le divers des sensations, aucune expérience unifiée ne serait possible |
| Le **romantisme**, Baudelaire | « La reine des facultés » : elle atteint ce que la raison ne peut dire |
| **Bachelard** | Elle est **dynamique** : elle ne recopie pas les images, elle les **déforme**, et c'est là qu'elle crée |

## Imagination et science
Le point le plus intéressant, et celui qu'un devoir attend : la science elle-même en dépend.

| Le moment scientifique | Ce que l'imagination y fait |
| L'**hypothèse** | Imaginer ce qui pourrait expliquer, avant de le vérifier |
| L'**expérience de pensée** | La chute des corps chez Galilée, l'ascenseur d'Einstein : faire avancer la théorie sans instrument |
| Le **modèle** | Une fiction utile : personne n'a vu un atome comme on le dessine |

> Ce qui distingue la science de la rêverie n'est donc pas l'absence d'imagination, mais la **soumission de l'imaginé à l'épreuve** des faits. Imaginer est le premier temps ; vérifier est le second, et il est obligatoire.

## Un usage éthique
Se représenter la situation d'autrui, ce qu'il éprouve, ce que subirait quelqu'un d'autre à notre place : c'est encore l'imagination qui rend possible l'**empathie**, et avec elle une bonne part du jugement moral.`,
          },
          questions: [
            ['Qui appelle l’imagination « la folle du logis » ?', ['Malebranche', 'Pascal', 'Descartes', 'Kant'], 0, 'Pascal, lui, en fait « maîtresse d’erreur et de fausseté ».'],
            ['Pourquoi Pascal juge-t-il l’imagination d’autant plus dangereuse ?', ['Parce qu’elle est parfois juste, si bien qu’on ne peut s’en défier systématiquement', 'Parce qu’elle est toujours fausse', 'Parce qu’elle est rare', 'Parce qu’elle est propre aux artistes'], 0, 'Une faculté toujours trompeuse serait facile à écarter.'],
            ['Quel rôle Kant assigne-t-il à l’imagination ?', ['Une faculté nécessaire à la connaissance, qui synthétise le divers des sensations', 'Une faculté à bannir', 'Une simple faculté artistique', 'Un obstacle à l’entendement'], 0, 'Sans elle, aucune expérience unifiée ne serait possible.'],
            ['Qui nomme l’imagination « la reine des facultés » ?', ['Baudelaire', 'Descartes', 'Malebranche', 'Bachelard'], 0, 'Le romantisme en fait la faculté suprême.'],
            ['Que montre Bachelard à propos de l’imagination ?', ['Qu’elle déforme les images plutôt qu’elle ne les recopie, et que c’est là sa force', 'Qu’elle est une mémoire fidèle', 'Qu’elle est propre à l’enfance', 'Qu’elle disparaît avec le savoir'], 0, 'L’imagination est dynamique, non reproductrice.'],
            ['La démarche scientifique se passe d’imagination.', ['Vrai', 'Faux'], 1, 'L’hypothèse, l’expérience de pensée et le modèle en sont des actes.'],
            ['Qu’est-ce qui distingue la science de la rêverie ?', ['La soumission de l’imaginé à l’épreuve des faits', 'L’absence totale d’imagination', 'L’usage du calcul', 'Le recours à des instruments'], 0, 'Imaginer est le premier temps ; vérifier est obligatoire.'],
            ['L’imagination joue un rôle dans le jugement moral.', ['Vrai', 'Faux'], 0, 'Se représenter ce qu’éprouve autrui rend l’empathie possible.'],
          ],
        },

        // ---- Chapitre 6 : l’homme et l’animal --------------------------------
        {
          titre: 'L’espèce humaine',
          axe: 'L’homme et l’animal',
          lecon: {
            titre: 'Ce qui fait le propre de l’homme',
            cours: `Chercher le propre de l'homme, c'est chercher ce qui l'en distingue absolument. Chaque critère proposé a été contesté — et ce reflux même est instructif.

## Les critères classiques
| Le critère | Qui l'avance | Ce qu'il affirme |
| Le **langage** | **Aristote** | L'homme est l'animal doué de *logos*, seul capable de dire le juste et l'injuste |
| Le langage, encore | **Descartes** | Les animaux ne composent jamais un discours nouveau pour une situation nouvelle |
| La **conscience de soi** | — | La capacité de dire « je » |
| La **technique** | **Bergson** | *Homo faber* plutôt que *sapiens* : il fabrique des outils **à fabriquer des outils** |
| La **culture cumulative** | — | Chaque génération part de ce que la précédente a laissé |
| La **conscience de la mort** | — | Les sépultures l'attestent |
| Le **rire** | **Rabelais** | — |

## Ce que l'éthologie a montré
| Le critère | Ce qu'on a observé ailleurs |
| Les **outils** | Fabriqués et transmis par des chimpanzés, des corbeaux, des loutres |
| Les **cultures locales** | Des techniques propres à un groupe et transmises |
| Le **langage** | Des systèmes structurés ; certains grands singes manient des symboles |
| L'**empathie** | Coopération, sens de l'équité, formes de deuil chez plusieurs espèces |

> Le programme n'en conclut pas qu'il n'y a pas de différence, mais qu'elle est plus vraisemblablement de **degré** que de nature — et que chaque critère avancé disait autant du regard porté que de l'objet regardé.

## Une longue histoire du classement
| L'étape | Ce qu'elle établit |
| **Linné**, XVIIIe siècle | Il range l'homme parmi les primates |
| **Darwin** | Il l'inscrit dans une continuité évolutive |
| La **paléoanthropologie** | Plusieurs espèces humaines ont coexisté ; *Homo sapiens* est resté longtemps l'une d'elles |

## Ce qui reste
Peut-être moins un critère unique qu'un **faisceau** : le langage articulé et sa syntaxe, la culture cumulative sur des milliers de générations, la capacité de se représenter des mondes possibles.

> Et celle de se poser la question elle-même, qu'aucun autre animal ne semble se poser.`,
          },
          questions: [
            ['Selon Aristote, qu’est-ce qui distingue l’homme de l’animal ?', ['Le logos, qui permet de dire le juste et l’injuste', 'La station debout', 'La force physique', 'La longévité'], 0, 'L’animal exprime plaisir et douleur, il ne délibère pas.'],
            ['Pourquoi Bergson préfère-t-il homo faber à homo sapiens ?', ['Parce que l’homme fabrique des outils à fabriquer des outils', 'Parce qu’il travaille la terre', 'Parce qu’il construit des maisons', 'Parce qu’il domestique les animaux'], 0, 'C’est la technique récursive, non la simple intelligence, qui le caractérise.'],
            ['Qu’a montré l’éthologie sur la fabrication d’outils ?', ['Plusieurs espèces animales en fabriquent et se les transmettent', 'Seuls les humains en fabriquent', 'Les animaux les utilisent sans les fabriquer', 'Les outils animaux sont innés'], 0, 'Chimpanzés, corbeaux et loutres en fournissent des exemples.'],
            ['Quel est le critère décisif du propre de l’homme chez Descartes ?', ['Le langage, entendu comme réponse nouvelle à une situation nouvelle', 'La conscience de la mort', 'Le rire', 'La sociabilité'], 0, 'Les animaux ne composent jamais un discours inédit, selon lui.'],
            ['La différence entre l’homme et l’animal est aujourd’hui pensée comme une différence de nature.', ['Vrai', 'Faux'], 1, 'Elle est plus vraisemblablement de DEGRÉ, chaque critère absolu ayant reculé.'],
            ['Qui range l’homme parmi les primates dès le XVIIIe siècle ?', ['Linné', 'Darwin', 'Buffon', 'Aristote'], 0, 'Darwin l’inscrira ensuite dans une continuité évolutive.'],
            ['Plusieurs espèces humaines ont coexisté au cours de la préhistoire.', ['Vrai', 'Faux'], 0, 'Homo sapiens est resté longtemps l’une d’elles.'],
            ['Que reste-t-il du propre de l’homme selon le chapitre ?', ['Un faisceau de traits, dont la capacité de se poser la question elle-même', 'Un critère unique et définitif', 'Rien du tout', 'La seule supériorité physique'], 0, 'Langage articulé, culture cumulative, mondes possibles.'],
          ],
        },
        {
          titre: 'Qu’est-ce qu’un animal ?',
          axe: 'L’homme et l’animal',
          lecon: {
            titre: 'De la machine au sujet sensible',
            cours: `Le mot « animal » recouvre des réalités sans commune mesure : l'éponge et le chimpanzé, la fourmi et l'éléphant. Le penser au singulier est déjà une décision.

## L'animal-machine
**Descartes** soutient que les animaux sont des **automates** : ni pensée ni âme, et leurs cris ne sont pas plus des plaintes que le grincement d'un ressort.

| Le fondement de la thèse | Sa conséquence pratique |
| La pensée est une substance à part, dont le **langage** est le signe ; faute de langage, pas de pensée | La vivisection ne pose alors aucun problème moral |

## Les objections
| L'auteur | Son objection |
| **Montaigne** | « Quand je me joue à ma chatte, qui sait si elle ne se joue pas plus de moi que moi d'elle ? » — il renverse la position de surplomb |
| **La Fontaine** | Tout un *Discours à Madame de la Sablière* pour réfuter l'animal-machine |
| **Bentham** | La question n'est pas « peuvent-ils raisonner ? » ni « peuvent-ils parler ? » mais **« peuvent-ils souffrir ? »** |

> Avec Bentham, le critère moral cesse d'être l'intelligence pour devenir la **sensibilité**. C'est la citation clé du chapitre.

## L'apport de l'éthologie
Ce que l'on sait aujourd'hui documenter, selon les espèces : la douleur, l'anticipation, la mémoire à long terme, la reconnaissance de soi dans un miroir, la coopération, la transmission culturelle, des formes de deuil.

> Von Uexküll a introduit une idée décisive : chaque espèce vit dans son propre **Umwelt**, un monde perçu structuré par ses organes et ses besoins. La tique n'habite pas le même monde que nous — non parce qu'il lui manque quelque chose, mais parce que son monde est autrement fait.

## Le statut juridique
| La période | Le statut de l'animal en droit français |
| Longtemps | Un **bien meuble** |
| Depuis **2015** | Un **être vivant doué de sensibilité**, tout en restant soumis au régime des biens |

> Ce compromis dit exactement où en est la question : la sensibilité est reconnue, les conséquences ne sont pas tirées.`,
          },
          questions: [
            ['Que soutient Descartes avec la thèse de l’animal-machine ?', ['Les animaux sont des automates sans pensée ni sensibilité au sens propre', 'Les animaux pensent comme les hommes', 'Les animaux ont une âme immortelle', 'Les animaux communiquent par le langage'], 0, 'La vivisection n’y pose alors aucun problème moral.'],
            ['Quelle question Bentham substitue-t-il à celle de la raison animale ?', ['Peuvent-ils souffrir ?', 'Peuvent-ils parler ?', 'Peuvent-ils travailler ?', 'Peuvent-ils apprendre ?'], 0, 'Le critère moral devient la sensibilité, non l’intelligence.'],
            ['Comment Montaigne renverse-t-il la position de surplomb sur l’animal ?', ['En se demandant si sa chatte ne se joue pas de lui autant que lui d’elle', 'En affirmant la supériorité humaine', 'En comparant les langages', 'En décrivant des expériences'], 0, 'Le doute porte sur le point de vue même de celui qui juge.'],
            ['Qu’est-ce que l’Umwelt selon von Uexküll ?', ['Le monde perçu propre à chaque espèce, structuré par ses organes et ses besoins', 'L’environnement physique commun à tous', 'Le territoire d’un animal', 'La niche écologique d’une espèce'], 0, 'La tique n’habite pas un monde appauvri : un monde autrement fait.'],
            ['Depuis 2015, le code civil français reconnaît l’animal comme un être doué de sensibilité.', ['Vrai', 'Faux'], 0, 'Tout en le soumettant encore au régime des biens : le compromis est parlant.'],
            ['Qui consacre un Discours à Madame de la Sablière à réfuter l’animal-machine ?', ['La Fontaine', 'Montaigne', 'Voltaire', 'Rousseau'], 0, 'Il y oppose les conduites animales observées à la thèse cartésienne.'],
            ['Penser « l’animal » au singulier va de soi.', ['Vrai', 'Faux'], 1, 'Le mot recouvre l’éponge et le chimpanzé : le singulier est déjà une décision.'],
            ['Qu’est-ce que le test du miroir met en évidence chez certaines espèces ?', ['Une forme de reconnaissance de soi', 'La vision des couleurs', 'La mémoire spatiale', 'La capacité de communiquer'], 0, 'Il fait partie des observations qui ont fait reculer la thèse de l’automate.'],
          ],
        },
        {
          titre: 'L’animal, une question politique',
          axe: 'L’homme et l’animal',
          lecon: {
            titre: 'Quels droits, quelles obligations ?',
            cours: `Une fois reconnue la sensibilité animale, la question cesse d'être seulement métaphysique : elle devient politique, c'est-à-dire affaire de règles communes et de justice.

## Les positions en présence
| La position | Son critère | Ce qu'elle demande |
| **Welfarisme** | La souffrance | Réduire la souffrance sans contester l'usage : élevage, transport, abattage, expérimentation encadrés. C'est la position dominante du droit européen |
| **Utilitarisme** (Peter Singer) | L'intérêt de tout être sensible | Écarter un intérêt au motif qu'il est animal serait un **spécisme**, analogue dans sa forme au racisme |
| **Abolitionnisme** (Tom Regan) | Le **droit** | Un animal capable de préférences est un « sujet-d'une-vie » : il ne peut être traité comme un moyen. Non plus améliorer l'usage, mais y mettre fin |
| **Contractualisme** | La réciprocité | Les droits supposent des obligations réciproques, impossibles pour un animal |

> À la dernière objection, on répond par le cas des jeunes enfants et des personnes très vulnérables : titulaires de droits sans devoirs correspondants.

## L'état du droit
| Ce que le droit français interdit ou encadre | Ce qu'il maintient |
| Mauvais traitements et actes de cruauté | L'élevage |
| L'expérimentation, par la règle des trois R — **remplacer**, **réduire**, **raffiner** | La chasse et la pêche |
| Des normes d'élevage et d'abattage | La corrida, sous conditions |

> La cohérence d'ensemble est régulièrement contestée devant les tribunaux et devant l'opinion.

## Les enjeux qui s'ajoutent
| L'enjeu | Son contenu |
| **Écologique** | L'élevage intensif pèse sur les émissions, les terres et l'eau ; l'effondrement de la biodiversité déplace la question de l'individu vers l'**espèce** |
| **Sanitaire** | La promiscuité de l'élevage industriel favorise les zoonoses et la résistance aux antibiotiques |
| **Social** | Toute transformation des filières engage des emplois, des territoires, des habitudes alimentaires |

## Ce que le chapitre attend
Non pas une opinion tranchée, mais une **argumentation** :
1. Identifier la position défendue par le texte.
2. Nommer le **critère moral** qu'elle retient — sensibilité, intérêt, droit, réciprocité.
3. Dire ce qu'elle implique **concrètement**.
4. Exposer les objections qu'elle doit affronter.`,
          },
          questions: [
            ['Que défend la position welfariste ?', ['Réduire la souffrance animale sans contester l’usage des animaux', 'Abolir tout usage des animaux', 'Accorder des droits identiques aux humains et aux animaux', 'Supprimer toute réglementation'], 0, 'C’est la position dominante dans le droit européen.'],
            ['Qu’est-ce que le spécisme selon Peter Singer ?', ['Le fait d’écarter un intérêt au seul motif qu’il est celui d’un animal', 'La classification des espèces', 'La protection des espèces menacées', 'L’élevage sélectif'], 0, 'Il en fait une discrimination analogue, dans sa forme, au racisme.'],
            ['Sur quelle notion Tom Regan fonde-t-il sa position abolitionniste ?', ['Le sujet-d’une-vie, capable de préférences, qui ne peut être un moyen', 'Le contrat social', 'La réduction de la souffrance', 'La valeur économique'], 0, 'Il raisonne en termes de droits, non de bien-être.'],
            ['Que recouvre la règle des trois R en expérimentation animale ?', ['Remplacer, réduire, raffiner', 'Recenser, réglementer, rapporter', 'Répertorier, restreindre, rétribuer', 'Reconnaître, respecter, réparer'], 0, 'Elle encadre l’expérimentation sans l’interdire.'],
            ['Quelle objection les contractualistes opposent-ils aux droits des animaux ?', ['Les droits supposent des obligations réciproques, impossibles pour un animal', 'Les animaux ne souffrent pas', 'Les animaux ne sont pas nombreux', 'Le droit ne concerne que la propriété'], 0, 'On y répond par le cas des jeunes enfants, titulaires de droits sans devoirs.'],
            ['L’élevage intensif pose des enjeux écologiques et sanitaires, en plus de la question animale.', ['Vrai', 'Faux'], 0, 'Émissions, usage des terres, zoonoses et résistance aux antibiotiques.'],
            ['Le droit français est parfaitement cohérent sur le statut de l’animal.', ['Vrai', 'Faux'], 1, 'Il punit la cruauté tout en maintenant élevage, chasse et corrida sous conditions.'],
            ['Qu’attend un devoir de HLP sur cette question ?', ['Une argumentation identifiant le critère moral retenu et ses objections', 'Une opinion personnelle tranchée', 'Un exposé des seules données scientifiques', 'Un résumé du droit en vigueur'], 0, 'Sensibilité, intérêt, droit ou réciprocité : le critère décide de tout.'],
          ],
        },
      ],
    },
  ],
}
