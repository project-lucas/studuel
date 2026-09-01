// SVT — spécialité TERMINALE : les 22 fiches du programme officiel, dans
// l'ordre des 7 chapitres du BO (thème 1 « La Terre, la vie et l'organisation
// du vivant » → chapitres 1-2, thème 2 « Enjeux planétaires contemporains » →
// chapitres 3-4, thème 3 « Corps humain et santé » → chapitres 5-7).
//
// POURQUOI UN MODULE NEUF plutôt qu'une reprise des migrations 008/142 : la SVT
// de terminale existait en base sous forme de CINQ chapitres composites
// (« Génétique et évolution », « Le temps et les roches », « Les climats de la
// Terre », « Comportement et stress », « De la plante sauvage à la plante
// cultivée »), chacun résumant tout un chapitre du BO en une seule fiche. Deux
// chapitres entiers du programme — le système nerveux et la contraction
// musculaire — n'avaient AUCUNE entrée.
//
// La page matière affiche une liste plate : c'est l'ORDRE qui porte le
// regroupement en 7 chapitres, comme pour histoire-geo-tle et
// enseignement-scientifique-tle.
//
// Pas de LaTeX (LessonRichContent ne le rend pas) : δ18O, 2^23, CO₂ en texte.

export default {
  slug: 'svt',
  nom: 'SVT',

  titreMigration: 'SVT Tle (spécialité) — LES 22 FICHES DU PROGRAMME OFFICIEL',

  motif: `CONSTAT MESURÉ (lecture des migrations 008 et 142, 05/08/2026) : la
spécialité SVT de terminale n'avait que 5 chapitres, taillés dans un découpage
maison (« Génétique et évolution », « Le temps et les roches », « Les climats
de la Terre », « Comportement et stress », « De la plante sauvage à la plante
cultivée ») qui résumait chaque chapitre du BO en UNE fiche. Deux chapitres
entiers du programme n'avaient aucune entrée : « Comportements, mouvement et
système nerveux » et « Produire le mouvement : contraction musculaire et
apport d'énergie ». Un élève qui révisait le réflexe myotatique, le sarcomère,
la régulation de la glycémie, la chronologie absolue, la photosynthèse ou les
paramètres de Milankovitch ne trouvait rien. Cette migration installe les 22
fiches du programme officiel, dans l'ordre des 7 chapitres du BO, et retire
les 5 fiches de synthèse qu'elles recouvrent entièrement.
⚠️ CE QUI EST PERDU AU PASSAGE : les 5 leçons « Exercices types » posées par
la migration 142 (2 exercices type bac corrigés par chapitre) partent avec
leurs chapitres. Elles étaient adossées au découpage composite ; les réécrire
fiche par fiche est un chantier à part.`,

  // ON NE SUPPRIME PAS PAR TITRE DE CHAPITRE mais par titre de LEÇON : c'est le
  // repère le plus sûr. Les 5 anciens chapitres, et eux seuls, portent les deux
  // leçons génériques posées par 008/142 (« L'essentiel du cours » et
  // « Exercices types »). Aucune fiche neuve n'en porte : rejouer la migration
  // ne supprime plus rien.
  //
  // Le filtre `level = 'Tle'` protège les six autres niveaux de SVT, qui
  // portent les mêmes deux leçons génériques et ne sont pas concernés.
  menage: [
    {
      raison: `La file « À revoir » d'abord : review_items.item_id n'a PAS de clé
étrangère (il pointe soit une question, soit une carte). Rien ne casse si on
l'oublie — le lecteur écarte déjà un contenu disparu — mais le compteur
« X à revoir » continuerait de compter des questions qui n'existent plus.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = 'Tle'
   AND l.title IN ('L''essentiel du cours', 'Exercices types');`,
    },
    {
      raison: `Les quiz ensuite : quizzes.lesson_id est ON DELETE SET NULL, donc
supprimer le chapitre laisserait derrière lui des quiz orphelins, rattachés à
aucune leçon mais toujours servis par le moteur de révision.`,
      sql: `DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = 'Tle'
   AND l.title IN ('L''essentiel du cours', 'Exercices types');`,
    },
    {
      raison: `Puis les chapitres : leçons, fiches de révision, supports, progression
et chapitres cochés partent en cascade (toutes les clés étrangères vers
chapters et lessons sont ON DELETE CASCADE).`,
      sql: `DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = 'Tle'
   AND EXISTS (
     SELECT 1 FROM public.lessons l
      WHERE l.chapter_id = c.id
        AND l.title IN ('L''essentiel du cours', 'Exercices types')
   );`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      chapitres: [
        // ===== Chapitre 1 — Origine de la diversité génétique des espèces ====
        {
          titre: 'La conservation des génomes : stabilité génétique et évolution clonale',
          lecon: {
            titre: 'Copier sans se tromper (ou presque)',
            cours: `Un organisme pluricellulaire part d’**une** cellule. Toutes les autres en descendent par mitose et portent **en principe** le même génome. Ce « en principe » est tout le sujet.

## Le cycle cellulaire
| Phase | Ce qui s’y passe | État des chromosomes |
| **G1** | La cellule grandit | Une chromatide chacun |
| **S** | La **réplication** de l’ADN | Deux chromatides sœurs identiques |
| **G2** | Contrôles avant division | Deux chromatides |
| **Mitose** | Les chromatides sœurs se séparent | Une chromatide dans chaque cellule fille |

Le résultat : deux cellules **génétiquement identiques** entre elles et à la cellule mère — un **clone**.

## La réplication est semi-conservative
Chaque brin sert de **matrice** : l’ADN polymérase place en face de chaque nucléotide son complémentaire (A-T, G-C). Chaque molécule fille contient donc **un brin ancien et un brin neuf** — c’est ce qu’a montré l’expérience de **Meselson et Stahl** (1958).

> La complémentarité des bases est ce qui rend l’information **copiable** : l’ADN porte deux fois la même information, une fois sur chaque brin.

## Une fidélité très haute, jamais parfaite
| Étape | Taux d’erreur |
| L’ADN polymérase seule | environ 1 sur 10⁵ |
| Après sa **relecture** | Bien plus bas |
| Après les systèmes de **réparation** | environ **1 sur 10⁹** |

Ce qui échappe devient une **mutation**.

## Mutations somatiques et évolution clonale
Une mutation survenue dans une cellule **somatique** n’est pas transmise à la descendance de l’individu — mais elle l’est à **toutes les cellules filles** de cette cellule.

| Ce qui se forme | Ce qui se passe ensuite |
| Un **clone** de cellules mutées | Il coexiste avec le reste de l’organisme |
| Si les mutations touchent le contrôle du cycle cellulaire | Le clone prolifère : c’est la **cancérisation** |

Un cancer est donc une **évolution clonale** à l’intérieur d’un même corps.

## La reproduction asexuée
| Mécanisme | Exemples |
| Bouturage, marcottage, stolons | Les plantes |
| Scissiparité | Les bactéries |
| Parthénogenèse | Le puceron |

| Avantage | Coût |
| Coloniser vite un milieu favorable | Aucune diversité nouvelle : la population est fragile face à un changement |`,
          },
          questions: [
            ['À quel moment du cycle cellulaire l’ADN est-il répliqué ?', ['En phase S', 'En phase G1', 'En phase G2', 'Pendant l’anaphase'], 0, 'La phase S de l’interphase double chaque chromosome, qui passe à deux chromatides.'],
            ['Que montre l’expérience de Meselson et Stahl ?', ['La réplication est semi-conservative', 'L’ADN est une protéine', 'La mitose précède la réplication', 'Les mutations sont dirigées'], 0, 'Chaque molécule fille garde un brin ancien et gagne un brin neuf.'],
            ['La mitose produit deux cellules génétiquement identiques.', ['Vrai', 'Faux'], 0, 'C’est la définition même d’un clone cellulaire.'],
            ['Quel est l’ordre de grandeur du taux d’erreur APRÈS relecture et réparation ?', ['Une erreur sur 10⁹ nucléotides', 'Une erreur sur 100 nucléotides', 'Une erreur sur 10 nucléotides', 'Aucune erreur'], 0, 'La polymérase se trompe une fois sur 10⁵, mais relecture et réparation corrigent l’essentiel.'],
            ['Une mutation somatique est transmise aux enfants de l’individu.', ['Vrai', 'Faux'], 1, 'Seules les mutations des cellules germinales le sont ; la somatique reste dans le corps.'],
            ['Comment se forme un clone de cellules cancéreuses ?', ['Par mutations somatiques touchant le contrôle du cycle cellulaire', 'Par méiose anormale', 'Par fécondation croisée', 'Par transfert horizontal de gènes'], 0, 'La cellule mutée transmet la mutation à toute sa descendance, qui prolifère.'],
            ['Quel mode de reproduction produit des individus génétiquement identiques au parent ?', ['La reproduction asexuée', 'La reproduction sexuée', 'L’hybridation', 'La polyploïdisation'], 0, 'Bouturage, stolons, scissiparité, parthénogenèse : tous donnent des clones.'],
            ['Quel est le principal inconvénient de la reproduction asexuée ?', ['Elle ne crée aucune diversité génétique nouvelle', 'Elle est trop lente', 'Elle exige deux parents', 'Elle empêche la mitose'], 0, 'Une population clonale est fragile face à un changement du milieu ou à un parasite.'],
          ],
        },
        {
          titre: 'Le brassage des génomes à chaque génération : la reproduction sexuée des eucaryotes',
          lecon: {
            titre: 'Méiose et fécondation : la machine à mélanger',
            cours: `La reproduction sexuée ne se contente pas de transmettre : elle **rebat les cartes** à chaque génération. Deux mécanismes s’enchaînent — la méiose, puis la fécondation.

## Le cycle de développement
| Étape | Ce qui se passe | Chez l’humain |
| Méiose | 2n devient n : quatre gamètes haploïdes | 46 devient 23 |
| Fécondation | n + n redevient 2n | 23 + 23 font 46 |

## La méiose : deux divisions
| Division | Ce qui se sépare | Le résultat |
| **I, réductionnelle** | Les chromosomes **homologues** | On passe de 2n à n |
| **II, équationnelle** | Les **chromatides sœurs** | Comme une mitose |

## Les trois brassages
| Brassage | Quand | Combien de possibilités |
| **Interchromosomique** | Anaphase I : chaque paire se répartit indépendamment | **2²³**, soit plus de 8 millions de gamètes |
| **Intrachromosomique** | Prophase I : les **crossing-over** échangent des portions | Innombrables |
| La **fécondation** | Rencontre au hasard de deux gamètes | Plus de **2⁴⁶** combinaisons par couple |

## Lire un croisement-test
> Le tableau qui tranche entre gènes liés et gènes indépendants — c’est l’exercice le plus fréquent au bac.

| Les gènes sont… | Les phénotypes obtenus |
| **Indépendants** | Quatre phénotypes en proportions **égales**, 25 % chacun |
| **Liés** | Deux phénotypes **parentaux majoritaires** + deux **recombinés minoritaires** |

Les recombinés minoritaires sont la signature du crossing-over : plus ils sont rares, plus les deux gènes sont proches sur le chromosome.

## Quand la méiose dérape
| L’accident | Le mécanisme | Le résultat |
| **Non-disjonction** | Une paire ne se sépare pas (division I) ou deux chromatides (division II) | Un gamète avec un chromosome en trop ou en moins : **trisomie 21**, monosomie |
| **Crossing-over inégal** | Chromatides mal alignées : l’une gagne un segment, l’autre le perd | Une **duplication génique** |

Les copies dupliquées mutent ensuite indépendamment et forment une **famille multigénique** — les gènes des globines, par exemple.

> Ces accidents sont des **erreurs** à l’échelle de l’individu, et une **source d’innovation** à l’échelle de l’évolution. C’est la même chose vue à deux échelles de temps.`,
          },
          questions: [
            ['Combien de cellules haploïdes une méiose produit-elle à partir d’une cellule diploïde ?', ['Quatre', 'Deux', 'Une', 'Huit'], 0, 'Deux divisions successives : la réductionnelle puis l’équationnelle.'],
            ['Quel brassage a lieu à l’anaphase de la première division de méiose ?', ['Le brassage interchromosomique', 'Le brassage intrachromosomique', 'La fécondation', 'La réplication'], 0, 'Chaque paire d’homologues se répartit indépendamment des autres.'],
            ['Le brassage interchromosomique donne 2²³ combinaisons chez l’espèce humaine.', ['Vrai', 'Faux'], 0, 'Soit plus de 8 millions de gamètes différents possibles.'],
            ['Où et quand se produisent les crossing-over ?', ['En prophase de la première division de méiose', 'En métaphase de mitose', 'Pendant la fécondation', 'En phase G1'], 0, 'Les chromatides d’homologues appariés échangent alors des portions.'],
            ['Pour deux gènes LIÉS, un croisement-test donne…', ['Des phénotypes recombinés minoritaires', 'Quatre phénotypes équiprobables', 'Un seul phénotype', 'Aucun phénotype parental'], 0, 'Les recombinés n’apparaissent que si un crossing-over a eu lieu entre les deux gènes.'],
            ['Quelle anomalie de méiose est à l’origine de la trisomie 21 ?', ['Une non-disjonction chromosomique', 'Un crossing-over inégal', 'Une duplication génique', 'Une mutation ponctuelle'], 0, 'La paire 21 ne se sépare pas : le gamète porte un chromosome en trop.'],
            ['Un crossing-over inégal peut créer une duplication de gène.', ['Vrai', 'Faux'], 0, 'C’est l’origine des familles multigéniques, comme celle des globines.'],
            ['Quel est le troisième brassage du cycle sexué, après les deux de la méiose ?', ['La fécondation, qui réunit deux gamètes au hasard', 'La mitose de la cellule œuf', 'La réplication de l’ADN', 'La méiose de la génération suivante'], 0, 'Elle multiplie les combinaisons déjà produites par la méiose.'],
          ],
        },
        {
          titre: 'Mécanismes de diversification des êtres vivants',
          lecon: {
            titre: 'Diversifier autrement que par les gènes',
            cours: `La méiose et la fécondation ne sont pas les seules sources de nouveauté. Le vivant se diversifie aussi par des mécanismes **génétiques mais non sexués** — et même **sans aucune modification du génome**.

## Les quatre voies
| Voie | Le génome change ? | Exemple |
| **Transfert horizontal** | Oui | La résistance aux antibiotiques chez les bactéries |
| **Hybridation et polyploïdisation** | Oui | Le blé tendre |
| **Symbiose** | **Non** | Lichens, mycorhizes, microbiote |
| **Transmission culturelle** | **Non** | Les techniques des chimpanzés |

## Les transferts horizontaux de gènes
Un gène passe d’un organisme à un autre **sans reproduction** : conjugaison, transformation, transduction par des virus.

Chez les eucaryotes, des **virus** ont inséré des séquences dans nos génomes — le gène de la **syncytine**, indispensable au placenta des mammifères, est d’origine virale.

## Hybridation et polyploïdisation
| Étape | Ce qui se passe |
| Deux espèces proches se croisent | L’hybride est souvent **stérile** : le mulet |
| Son stock chromosomique **double** | La méiose redevient possible |
| Résultat | Une **espèce nouvelle en une génération** |

Le **blé tendre** est le produit de deux hybridations-polyploïdisations successives entre graminées sauvages.

## Les associations et symbioses
| Symbiose | Les partenaires | Ce qu’elle apporte |
| **Lichen** | Champignon + algue ou cyanobactérie | Coloniser la roche nue |
| **Mycorhize** | Champignon + racines | Plus de 80 % des plantes en dépendent |
| **Nodosité** | Rhizobium + légumineuse | Fixer le diazote de l’air |
| **Microbiote intestinal** | Bactéries + hôte | Digérer ce que l’hôte ne sait pas digérer |

> La symbiose ne change pas le **génome** des partenaires : elle change ce qu’ils sont **capables de faire**. C’est une diversification du phénotype sans mutation.

## La diversification par la culture
Certains comportements se transmettent par **apprentissage**, d’un individu à l’autre, sans passer par l’ADN.

| Exemple | Ce qu’il montre |
| Les **mésanges** anglaises perçant les capsules des bouteilles de lait | Un comportement se propage de proche en proche |
| Les **chimpanzés** de Gombe pêchant les termites à la brindille | Les techniques diffèrent d’un groupe à l’autre : ce sont des **traditions** |
| Les « dialectes » du chant des **oiseaux** | Ils s’apprennent des adultes |

Ces transmissions créent de la **diversité entre populations** d’une même espèce — et peuvent modifier la pression de sélection qui s’exercera ensuite sur les gènes.`,
          },
          questions: [
            ['Qu’est-ce qu’un transfert horizontal de gènes ?', ['Le passage d’un gène d’un organisme à un autre sans reproduction', 'La transmission d’un gène du parent à l’enfant', 'Un crossing-over', 'Une duplication génique'], 0, 'Il est très fréquent chez les bactéries : conjugaison, transformation, transduction.'],
            ['Le gène de la syncytine, indispensable au placenta, est d’origine virale.', ['Vrai', 'Faux'], 0, 'C’est un exemple de transfert horizontal ancien chez les mammifères.'],
            ['Comment une hybridation peut-elle donner une espèce nouvelle et fertile ?', ['Par polyploïdisation, qui rend la méiose de nouveau possible', 'Par mitose accélérée', 'Par sélection naturelle seule', 'Par dérive génétique'], 0, 'Le doublement du stock chromosomique restaure l’appariement des homologues : c’est l’histoire du blé tendre.'],
            ['Quelle association permet à une légumineuse de profiter du diazote de l’air ?', ['Les nodosités à bactéries Rhizobium', 'Les mycorhizes', 'Les lichens', 'Le microbiote intestinal'], 0, 'Les Rhizobium fixent le N₂ atmosphérique et le cèdent à la plante.'],
            ['Un lichen associe un champignon et une algue ou une cyanobactérie.', ['Vrai', 'Faux'], 0, 'Chaque partenaire y gagne : le phénotype de l’association dépasse la somme des deux.'],
            ['Que montrent les techniques de pêche aux termites des chimpanzés ?', ['Une transmission culturelle, indépendante du génome', 'Une mutation avantageuse', 'Un transfert horizontal de gènes', 'Une polyploïdisation'], 0, 'Les techniques varient d’un groupe à l’autre : ce sont des traditions apprises.'],
            ['La diffusion du perçage des capsules de lait chez les mésanges est un exemple de…', ['Diversification non génétique par apprentissage', 'Sélection artificielle', 'Symbiose', 'Dérive génétique'], 0, 'Le comportement s’est propagé par imitation, pas par hérédité.'],
            ['Une symbiose modifie le génome des deux partenaires.', ['Vrai', 'Faux'], 1, 'Elle modifie leurs capacités, pas leur ADN : les génomes restent distincts.'],
          ],
        },
        {
          titre: 'De la diversification des êtres vivants à l’évolution de la biodiversité',
          lecon: {
            titre: 'Sélection, dérive, spéciation',
            cours: `La diversification fournit la matière ; l’évolution **trie**. Deux forces font varier la fréquence des allèles dans une population : la **sélection naturelle** et la **dérive génétique**.

## Le modèle de Hardy-Weinberg
Dans une population **idéale** — grande, sans migration, sans mutation, sans sélection, à croisements au hasard — les fréquences alléliques **ne changent pas**. Si p et q sont les fréquences des allèles A et a, les génotypes se répartissent en p², 2pq et q².

> Ce modèle n’existe **nulle part** : c’est précisément son intérêt. Il sert de **référence nulle**, et tout écart mesuré entre fréquences observées et attendues signale qu’une force évolutive est à l’œuvre.

## Les deux forces
| | Sélection naturelle | Dérive génétique |
| Le moteur | Un avantage reproductif | Le **hasard** de l’échantillonnage des gamètes |
| Ce qui l’amplifie | Une pression forte | Une population de **petit effectif** |
| Le résultat | Les allèles avantageux se répandent | Un allèle peut disparaître **sans désavantage** |

## Deux exemples de sélection
| Cas | Ce qui se passe |
| La **phalène du bouleau** | La forme sombre, rare, devient majoritaire sur les troncs noircis de suie — puis régresse après les lois anti-pollution |
| La **résistance aux antibiotiques** | L’antibiotique ne **crée** pas la résistance : il sélectionne les bactéries qui la portaient déjà |

> La sélection n’est ni un projet ni un progrès : c’est un **tri**, relatif à un milieu qui peut changer — et qui change.

## L’espèce et ses limites
Le critère le plus courant est l’**interfécondité** : même espèce si les descendants sont **fertiles**.

| Ce critère échoue pour… | Pourquoi |
| Les **fossiles** | On ne peut pas les croiser |
| Les organismes **asexués** | Il n’y a pas de reproduction sexuée |
| Les populations qui s’**hybrident** parfois | La frontière est poreuse |

On combine donc plusieurs critères : morphologique, écologique, génétique, phylogénétique.

## La spéciation
| Étape | Ce qui se passe |
| 1. **Isolement** | Géographique, décalage des périodes de reproduction, parades incompatibles |
| 2. **Divergence** | Sélection et dérive agissent séparément sur chaque population |
| 3. **Isolement reproductif** | Les hybrides ne sont plus viables ou plus fertiles |
| 4. Résultat | **Une espèce est devenue deux** |

## Une biodiversité qui bouge
Les **crises biologiques** éliminent massivement, puis les groupes survivants se diversifient dans les niches libérées. La biodiversité actuelle n’est qu’un **état** de la biosphère, pas son point d’arrivée.`,
          },
          questions: [
            ['À quoi sert le modèle de Hardy-Weinberg ?', ['De référence nulle : tout écart signale une force évolutive', 'À prouver que les espèces ne changent pas', 'À dater les roches', 'À calculer le nombre de gamètes'], 0, 'Il décrit une population idéale où les fréquences alléliques resteraient stables.'],
            ['Dans une population conforme à Hardy-Weinberg, la fréquence des hétérozygotes vaut…', ['2pq', 'p²', 'q²', 'p + q'], 0, 'Avec p² pour un homozygote et q² pour l’autre, la somme faisant 1.'],
            ['L’antibiotique crée la mutation de résistance chez la bactérie.', ['Vrai', 'Faux'], 1, 'Il ne fait que SÉLECTIONNER les bactéries qui la portaient déjà par hasard.'],
            ['Qu’est-ce que la dérive génétique ?', ['Une variation au hasard des fréquences alléliques, marquée en petite population', 'Le tri des mieux adaptés', 'Un transfert horizontal de gènes', 'La migration des allèles entre espèces'], 0, 'Elle peut fixer ou éliminer un allèle sans le moindre avantage sélectif.'],
            ['Quel est le critère d’espèce le plus couramment retenu ?', ['L’interfécondité avec descendance fertile', 'La ressemblance de couleur', 'Le partage d’un même habitat', 'La taille du génome'], 0, 'Il est cependant inapplicable aux fossiles et aux organismes asexués.'],
            ['Que faut-il d’abord pour qu’une spéciation s’amorce ?', ['Un isolement reproducteur entre deux populations', 'Une mutation unique', 'Une crise biologique', 'Une polyploïdisation'], 0, 'Sans échange de gènes, sélection et dérive font diverger les deux populations.'],
            ['La phalène du bouleau illustre la sélection naturelle par la pollution industrielle.', ['Vrai', 'Faux'], 0, 'La forme sombre devient majoritaire sur les troncs noircis, puis régresse après dépollution.'],
            ['Que se passe-t-il après une crise biologique majeure ?', ['Les groupes survivants se diversifient dans les niches libérées', 'La biodiversité reste figée', 'Toutes les espèces disparaissent', 'La dérive génétique cesse'], 0, 'C’est ce qui suit la crise Crétacé-Paléogène pour les mammifères.'],
          ],
        },

        // ===== Chapitre 2 — À la recherche du passé géologique ===============
        {
          titre: 'La chronologie relative : décrypter le temps des roches par l’observation',
          lecon: {
            titre: 'Lire l’ordre des événements sans compter les années',
            cours: `Avant de savoir **dater**, les géologues ont su **ordonner**. La chronologie relative répond à une seule question : qu’est-ce qui est arrivé avant quoi ? Elle repose sur des principes d’observation, applicables sur le terrain sans aucun instrument.

## Les cinq principes
| Principe | Ce qu’il énonce | Le piège |
| **Superposition** | Une couche est plus récente que celle qu’elle recouvre | Vérifier que la série n’a pas été **renversée** |
| **Recoupement** | Ce qui recoupe est **postérieur** | Une faille, un filon, une surface d’érosion |
| **Inclusion** | Ce qui est inclus est **antérieur** | Un galet, une enclave, un cristal |
| **Continuité** | Une même couche a le même âge sur toute son extension | Même si elle **change de faciès** |
| **Identité paléontologique** | Même assemblage de fossiles, même âge | Encore faut-il un bon fossile |

## Comment savoir si une série est renversée
Des **figures sédimentaires** indiquent le haut d’origine : rides de courant, granoclassement, fentes de dessiccation. Sans elles, le principe de superposition peut donner l’ordre exactement à l’envers.

## Le bon fossile stratigraphique
| Critère | Pourquoi |
| **Large répartition** géographique | Pour corréler des coupes éloignées |
| **Courte durée** d’existence | Pour découper finement le temps |
| **Abondance** | Pour avoir une chance de le trouver |

Ammonites, trilobites et foraminifères remplissent ce cahier des charges.

> Une espèce qui a vécu 200 millions d’années est un **mauvais** fossile stratigraphique : elle ne découpe rien. Le cœlacanthe ne date aucune couche.

## De l’échelle locale à l’échelle mondiale
En croisant ces principes de coupe en coupe, les géologues du XIXe siècle ont construit l’**échelle stratigraphique** — ères, périodes, étages — **bien avant** de pouvoir y mettre des dates. La radiochronologie n’a fait ensuite que la **calibrer** en millions d’années.`,
          },
          questions: [
            ['Que dit le principe de superposition ?', ['Dans une série non déformée, une couche est plus récente que celle qu’elle recouvre', 'Un objet inclus est plus récent', 'Une faille est plus ancienne que les couches', 'Deux couches ont toujours le même âge'], 0, 'La restriction « non déformée » est essentielle : une série peut être renversée.'],
            ['Une faille qui décale une couche est plus ancienne que cette couche.', ['Vrai', 'Faux'], 1, 'Le principe de recoupement dit l’inverse : ce qui recoupe est postérieur.'],
            ['Un galet inclus dans un conglomérat est…', ['Plus ancien que le conglomérat', 'Plus récent que le conglomérat', 'Du même âge exactement', 'Indatable'], 0, 'C’est le principe d’inclusion : l’objet inclus préexistait à la roche qui l’enferme.'],
            ['Quelles qualités fait un bon fossile stratigraphique ?', ['Large répartition, courte durée d’existence, abondance', 'Grande taille et rareté', 'Longue durée d’existence', 'Répartition strictement locale'], 0, 'Une espèce qui a duré 200 millions d’années ne découpe aucune tranche de temps.'],
            ['Le principe de continuité affirme qu’une même couche a le même âge sur toute son extension.', ['Vrai', 'Faux'], 0, 'Même si son faciès change latéralement, du calcaire à la marne par exemple.'],
            ['Comment reconnaître qu’une série sédimentaire a été renversée ?', ['Grâce aux figures sédimentaires, comme le granoclassement', 'Grâce à la radiochronologie', 'Grâce à la couleur des roches', 'On ne peut pas le savoir'], 0, 'Ces figures indiquent le haut d’origine de la couche, indépendamment de sa position actuelle.'],
            ['L’échelle stratigraphique a été construite AVANT que l’on sache dater en millions d’années.', ['Vrai', 'Faux'], 0, 'La radiochronologie n’a fait que la calibrer, au XXᵉ siècle.'],
            ['Une surface d’érosion qui tronque des couches plissées est…', ['Postérieure au plissement', 'Antérieure au plissement', 'Contemporaine du dépôt', 'Sans rapport chronologique'], 0, 'Elle recoupe le plissement, donc elle lui succède.'],
          ],
        },
        {
          titre: 'La chronologie absolue : décrypter le temps des roches par des mesures',
          lecon: {
            titre: 'Des horloges dans les cristaux',
            cours: `La chronologie relative **ordonne**, la chronologie absolue **compte**. Elle repose sur une propriété physique indifférente au milieu : la **désintégration radioactive**.

## Une loi de décroissance
Un isotope **père** se désintègre spontanément en un isotope **fils**. À chaque **demi-vie**, il reste la moitié des pères.

> La vitesse ne dépend **ni de la température, ni de la pression, ni de la chimie**. C’est exactement ce qui en fait une horloge fiable — et ce qui la distingue de tout autre indice géologique.

## Ce qu’on mesure, et à quelles conditions
On mesure le **rapport** fils accumulé sur père restant. Deux conditions doivent être remplies :

| Condition | Ce qu’elle exige |
| Le système est **fermé** | Rien n’est entré ni sorti depuis la fermeture |
| La quantité **initiale de fils** est connue | Ou l’on s’en affranchit par une droite **isochrone** |

## Choisir le bon couple
La demi-vie doit être **du même ordre** que l’âge cherché.

| Couple | Demi-vie | Ce qu’il date |
| Carbone 14 → azote 14 | **5 730 ans** | Matière organique de moins de 50 000 ans |
| Potassium 40 → argon 40 | **1,3 milliard d’années** | Roches volcaniques |
| Rubidium 87 → strontium 87 | **48,8 milliards d’années** | Roches magmatiques anciennes |
| Uranium → plomb | environ **4,5 milliards d’années** | Zircons, les plus vieilles roches connues |

> Dater du bois de 3 000 ans au rubidium-strontium n’aurait aucun sens : la quantité de fils produite serait indétectable. Dater une roche de 3 milliards d’années au carbone 14 non plus : il ne resterait plus **un seul** atome père.

## Ce que l’horloge date exactement
Elle date la **fermeture du système**, pas « la roche » en général.

| Objet | Ce qui est daté |
| Une roche magmatique | Sa **cristallisation** |
| Un minéral métamorphique | Son passage sous sa **température de fermeture** |
| Un reste organique, au carbone 14 | La **mort** de l’organisme, qui cesse d’échanger du carbone |

## Le croisement des deux chronologies
Une datation absolue posée sur une coulée volcanique **encadre** toutes les couches que la chronologie relative situe au-dessus et en dessous.

C’est en superposant les deux approches qu’on obtient l’échelle des temps géologiques — et l’âge de la Terre : **4,57 milliards d’années**, obtenu sur des météorites au couple uranium-plomb.`,
          },
          questions: [
            ['Que signifie la demi-vie d’un isotope radioactif ?', ['La durée au bout de laquelle la moitié des atomes pères s’est désintégrée', 'La durée de vie totale de l’isotope', 'La moitié de l’âge de la roche', 'Le temps de refroidissement du magma'], 0, 'La décroissance est exponentielle : il reste 1/4 après deux demi-vies.'],
            ['La vitesse de désintégration dépend de la température et de la pression.', ['Vrai', 'Faux'], 1, 'C’est justement son indifférence aux conditions qui en fait une horloge fiable.'],
            ['Quel couple utilise-t-on pour dater de la matière organique récente ?', ['Carbone 14 / azote 14', 'Potassium 40 / argon 40', 'Rubidium 87 / strontium 87', 'Uranium / plomb'], 0, 'Sa demi-vie de 5 730 ans le limite à environ 50 000 ans.'],
            ['Pourquoi ne date-t-on pas une roche d’un milliard d’années au carbone 14 ?', ['Sa demi-vie est bien trop courte : il ne reste plus d’atomes pères', 'Le carbone 14 n’existe pas dans les roches volcaniques', 'La mesure coûte trop cher', 'Le carbone 14 se désintègre trop lentement'], 0, 'Il faut choisir un couple dont la demi-vie est de l’ordre de l’âge cherché.'],
            ['Que date exactement une mesure faite sur une roche magmatique ?', ['Sa cristallisation, c’est-à-dire la fermeture du système', 'Son érosion', 'Son enfouissement', 'Sa dernière déformation'], 0, 'L’horloge démarre quand le minéral cesse d’échanger avec l’extérieur.'],
            ['Une datation radiochronologique suppose que le système est resté fermé.', ['Vrai', 'Faux'], 0, 'Si des atomes fils sont partis ou entrés, l’âge obtenu est faux.'],
            ['Quel âge donne-t-on aujourd’hui à la Terre ?', ['Environ 4,57 milliards d’années', 'Environ 570 millions d’années', 'Environ 45 millions d’années', 'Environ 13,8 milliards d’années'], 0, 'Obtenu sur des météorites au couple uranium-plomb.'],
            ['À quoi sert de croiser chronologie relative et chronologie absolue ?', ['La datation d’une coulée volcanique encadre les couches situées au-dessus et en dessous', 'À vérifier deux fois le même résultat', 'À remplacer les fossiles stratigraphiques', 'À mesurer la vitesse de sédimentation seule'], 0, 'C’est ainsi que l’échelle stratigraphique a été calibrée en millions d’années.'],
          ],
        },
        {
          titre: 'Formation et disparition des océans : témoins d’un passé mouvementé de la Terre',
          lecon: {
            titre: 'Le cycle de Wilson, lu dans les Alpes',
            cours: `Un océan naît, s’ouvre, se referme, et une chaîne de montagnes le remplace. Ce scénario s’appelle le **cycle de Wilson**, et les Alpes en gardent **toutes** les pièces.

## Les cinq étapes
| Étape | Ce qui se passe | Le témoin dans les Alpes |
| 1. **Rifting** | La lithosphère continentale s’amincit et se casse | Failles normales, **blocs basculés** |
| 2. **Ouverture** | La mer entre, une dorsale produit de la lithosphère océanique | **Marges passives** fossiles |
| 3. **Expansion** | La croûte océanique s’étend | Les **ophiolites** |
| 4. **Subduction** | La lithosphère océanique plonge | Métamorphisme **HP-BT** |
| 5. **Collision** | Les deux continents se percutent | Nappes, racine crustale |

## 1. Le rifting
Failles **normales**, blocs basculés, bassins où s’accumulent des sédiments détritiques, volcanisme de fissure. Le fossé rhénan et le rift est-africain en sont les exemples actuels.

## 3. Reconnaître une ophiolite
Une **ophiolite** est un fragment de lithosphère océanique charrié sur un continent. Sa séquence se lit de bas en haut :

| Étage | Roche | Ce qu’elle était |
| Bas | **Péridotites** | Le manteau |
| | **Gabbros** | Le magma refroidi lentement en profondeur |
| | **Basaltes en coussins** (pillow-lavas) | La lave refroidie sous l’eau |
| Haut | **Radiolarites** | Des sédiments marins profonds |

Le Chenaillet, dans les Hautes-Alpes, en offre un exemple presque intact.

## 4. La subduction
| Le mécanisme | Sa conséquence |
| La lithosphère océanique refroidit et s’**épaissit** | Au-delà d’environ 30 Ma, elle devient plus dense que l’asthénosphère |
| Elle **plonge** en emportant de l’eau | La déshydratation abaisse la température de fusion du manteau : magmatisme d’arc |
| Elle subit un métamorphisme **HP-BT** | Apparition du **glaucophane**, puis des **éclogites** à grenat et jadéite |

> Les métagabbros à glaucophane des Alpes sont la **preuve** qu’une lithosphère océanique y est descendue à plusieurs dizaines de kilomètres — puis remontée.

## 5. La collision
| Ce qui se forme | Ce qui l’explique |
| Plis, failles inverses, chevauchements, **nappes de charriage** | L’épaississement crustal |
| Une **racine crustale** jusqu’à 70 km | La croûte s’enfonce comme un iceberg |
| Un relief que l’**érosion** rabote aussitôt | L’isostasie fait remonter la chaîne à mesure |

C’est pourquoi on trouve aujourd’hui **en surface** des roches formées à 30 km de profondeur.`,
          },
          questions: [
            ['Quelles structures caractérisent la phase de rifting ?', ['Des failles normales et des blocs basculés', 'Des failles inverses et des chevauchements', 'Des nappes de charriage', 'Des éclogites'], 0, 'Le rifting est une phase d’EXTENSION : la lithosphère s’amincit et se casse.'],
            ['Qu’est-ce qu’une ophiolite ?', ['Un fragment de lithosphère océanique charrié sur un continent', 'Une roche du noyau terrestre', 'Un sédiment de marge passive', 'Une roche métamorphique de collision'], 0, 'Sa séquence péridotites-gabbros-basaltes en coussins signe une origine océanique.'],
            ['Les basaltes en coussins se forment lors d’un refroidissement sous l’eau.', ['Vrai', 'Faux'], 0, 'Ces pillow-lavas sont un marqueur direct d’un volcanisme sous-marin.'],
            ['Pourquoi une lithosphère océanique finit-elle par plonger en subduction ?', ['En refroidissant elle s’épaissit et devient plus dense que l’asthénosphère', 'Parce qu’elle est poussée par la dorsale seule', 'Parce qu’elle s’allège avec l’âge', 'Parce que les sédiments l’alourdissent'], 0, 'Le basculement de densité intervient au-delà d’environ 30 millions d’années.'],
            ['Quel minéral signe un métamorphisme haute pression - basse température ?', ['Le glaucophane', 'Le quartz', 'La calcite', 'L’olivine'], 0, 'On le trouve dans les métagabbros alpins, avant les éclogites à grenat et jadéite.'],
            ['Comment la subduction déclenche-t-elle un magmatisme ?', ['La déshydratation des minéraux abaisse la température de fusion du manteau', 'Le frottement fait fondre la plaque plongeante', 'La pression seule liquéfie les roches', 'Le noyau remonte de la chaleur'], 0, 'L’eau libérée provoque une fusion partielle hydratée du manteau sus-jacent.'],
            ['Une chaîne de collision présente un épaississement crustal et une racine.', ['Vrai', 'Faux'], 0, 'La croûte peut y atteindre 70 km, contre 30 km en moyenne sous un continent.'],
            ['Pourquoi trouve-t-on aujourd’hui en surface des roches formées à 30 km de profondeur ?', ['L’isostasie fait remonter la chaîne à mesure que l’érosion la rabote', 'Elles ont été projetées par un volcan', 'Elles se sont formées sur place', 'Un océan les a déposées'], 0, 'Érosion et rééquilibrage isostatique exhument peu à peu les racines de la chaîne.'],
          ],
        },

        // ===== Chapitre 3 — De la plante sauvage à la plante domestiquée =====
        {
          titre: 'Organisation fonctionnelle des plantes à fleurs et adaptation à leurs milieux de vie',
          lecon: {
            titre: 'Vivre fixé entre deux milieux',
            cours: `Une plante ne peut ni fuir la sécheresse, ni chercher son repas, ni échapper à un herbivore. **Toute** son organisation découle de cette contrainte : la **vie fixée**.

## Une double interface
| Milieu | Ce qu’il fournit | L’organe | Son adaptation |
| Le **sol** | Eau et ions minéraux | Les **racines** | Poils absorbants : plusieurs centaines de m² pour un plant de blé |
| Le sol | Phosphore | Les **mycorhizes** | Symbiose avec un champignon, qui décuple la surface |
| L’**atmosphère** | CO₂ et lumière | Les **feuilles** | Larges et minces : surface maximale, masse minimale |

## Les stomates : le compromis permanent
Les échanges gazeux passent par les **stomates**, encadrés de deux cellules de garde, surtout sur la face inférieure des feuilles.

| Stomates | Ce qui entre | Ce qui sort | Le coût |
| **Ouverts** | Le CO₂ | La vapeur d’eau | La transpiration |
| **Fermés** | Rien | Rien | La photosynthèse s’arrête |

> Il n’existe **aucune** position gagnante : la plante arbitre en permanence entre se nourrir et ne pas se dessécher, selon la lumière, l’humidité et son état hydrique.

## La circulation interne
| Réseau | Ce qu’il transporte | D’où vers où | Le moteur |
| **Xylème** | La sève **brute** : eau et ions | Racines vers feuilles | La **transpiration** tire la colonne d’eau |
| **Phloème** | La sève **élaborée** : saccharose | Feuilles vers organes consommateurs, **dans les deux sens** | Un gradient de pression |

Il n’y a **aucune pompe** : c’est l’évaporation au sommet qui tire l’eau depuis le bas, la cohésion des molécules maintenant la colonne.

## Résister sans bouger
| Contrainte | Les adaptations |
| **Froid** | Perte des feuilles, bourgeons à écailles, bulbes et rhizomes, antigels cellulaires |
| **Sécheresse** | Cuticule cireuse, feuilles en épines, stomates enfoncés, réserves d’eau, racines profondes |
| **Herbivores** | Épines, poils urticants, silice — et surtout des **métabolites secondaires** : alcaloïdes, tanins, latex |

> Une plante attaquée peut émettre des composés **volatils** qui alertent ses voisines — et parfois attirent les prédateurs de l’herbivore. Fixée, elle communique quand même.

## Un développement modulaire
Contrairement à un animal, une plante croît **toute sa vie** grâce à ses **méristèmes**, et son architecture s’ajuste au milieu : à l’ombre elle s’allonge vers la lumière, isolée elle s’étale.`,
          },
          questions: [
            ['Quelle contrainte majeure explique l’organisation d’une plante à fleurs ?', ['La vie fixée : elle ne peut ni fuir ni chercher ses ressources', 'Sa petite taille', 'Son absence de cellules', 'Sa reproduction asexuée obligatoire'], 0, 'Elle doit tout prélever sur place, dans le sol et dans l’atmosphère.'],
            ['Que gagne une plante à s’associer à un champignon dans une mycorhize ?', ['Une surface d’absorption accrue et un meilleur accès au phosphore', 'Du dioxygène supplémentaire', 'Une protection contre le froid', 'La capacité de se déplacer'], 0, 'Le champignon reçoit en échange des sucres issus de la photosynthèse.'],
            ['Les stomates sont surtout situés sur la face inférieure des feuilles.', ['Vrai', 'Faux'], 0, 'Cette position limite l’évaporation due à l’ensoleillement direct.'],
            ['Quel compromis les stomates imposent-ils ?', ['Laisser entrer le CO₂ oblige à laisser sortir de l’eau', 'Absorber la lumière empêche d’absorber l’eau', 'Fleurir empêche de croître', 'Produire du sucre empêche de respirer'], 0, 'Fermés, ils économisent l’eau mais arrêtent la photosynthèse.'],
            ['Quel est le moteur de la montée de la sève brute dans le xylème ?', ['La transpiration foliaire, qui tire la colonne d’eau', 'Une pompe située dans la racine', 'La pesanteur', 'La pression du phloème'], 0, 'La cohésion des molécules d’eau maintient la colonne sous tension.'],
            ['Le phloème transporte la sève élaborée dans les deux sens.', ['Vrai', 'Faux'], 0, 'Des feuilles productrices vers tout organe consommateur ou de réserve.'],
            ['Que sont la nicotine, la caféine et les tanins ?', ['Des métabolites secondaires défensifs', 'Des pigments photosynthétiques', 'Des hormones de croissance', 'Des sucres de réserve'], 0, 'Ils rendent la plante toxique ou répulsive pour les herbivores.'],
            ['Comment une plante à l’ombre modifie-t-elle son développement ?', ['Elle s’allonge pour atteindre la lumière', 'Elle cesse de croître définitivement', 'Elle perd ses racines', 'Elle ferme ses stomates en permanence'], 0, 'La croissance des méristèmes reste sensible aux conditions du milieu toute la vie.'],
          ],
        },
        {
          titre: 'La plante, productrice de la matière organique grâce à la photosynthèse',
          lecon: {
            titre: 'De la lumière au sucre',
            cours: `La photosynthèse produit l’essentiel de la matière organique de la biosphère. Son bilan tient en une ligne — **6 CO₂ + 6 H₂O + lumière donne C₆H₁₂O₆ + 6 O₂** — et le détail est plus intéressant que le bilan.

## Le chloroplaste, l’usine
| Compartiment | Ce qu’il contient | La phase qui s’y déroule |
| Les **thylakoïdes** | Les pigments, empilés en granums | La phase **photochimique** |
| Le **stroma** | Les enzymes, dont la RuBisCO | La phase **non photochimique** |

## Les pigments et le spectre d’action
| Pigment | Couleur | Ce qu’il absorbe |
| Chlorophylles a et b | Vert | Le **bleu** et le **rouge** |
| Caroténoïdes | Jaune-orangé | Le bleu |

Les feuilles sont vertes parce que le vert est la couleur **réfléchie**, celle qu’aucun pigment n’absorbe.

> Le **spectre d’action** — l’efficacité photosynthétique selon la longueur d’onde — se superpose au **spectre d’absorption**. C’est la preuve que ce sont bien ces pigments qui captent l’énergie utilisée, et non d’autres molécules.

## Les deux phases
| | Phase **photochimique** | Phase **non photochimique** |
| Où | Thylakoïdes | Stroma |
| Lumière | **Indispensable** | Non requise directement |
| Ce qui s’y passe | Photolyse de l’eau, production d’ATP et de RH₂ | Le **cycle de Calvin** réduit le CO₂ |
| Ce qui en sort | O₂, ATP, RH₂ | Trioses phosphates, précurseurs du glucose |

La photolyse s’écrit : 2 H₂O donne 4 H⁺ + 4 e⁻ + O₂.

> **Le dioxygène rejeté vient de l’eau, pas du CO₂.** C’est le contresens le plus fréquent, et il se corrige d’une phrase.

L’enzyme clé du cycle de Calvin est la **RuBisCO**, qui fixe le CO₂ sur un sucre à 5 carbones : c’est probablement la protéine la plus abondante de la biosphère.

Les deux phases sont **couplées** : sans lumière, plus d’ATP ni de RH₂, et le cycle de Calvin s’arrête en quelques secondes.

## Que devient le glucose
| Destination | Sous quelle forme | À quoi cela sert |
| Réserve | **Amidon** | Graines, tubercules, racines |
| Structure | **Cellulose** | La paroi des cellules, donc la charpente |
| Export | Saccharose, par le phloème | Les organes non chlorophylliens |
| Consommation | Respiration | L’ATP de la plante elle-même |

## Métabolites primaires et secondaires
| | Primaires | Secondaires |
| Exemples | Glucides, lipides, protides | Alcaloïdes, tanins, terpènes, pigments floraux |
| À quoi ils servent | Croissance et fonctionnement | Défense, attraction des pollinisateurs, compétition |
| Indispensables ? | Oui | Non à l’individu — mais décisifs pour l’espèce |

Ce sont les **secondaires** qui font l’intérêt des plantes pour la pharmacie, la parfumerie et l’alimentation.`,
          },
          questions: [
            ['D’où provient le dioxygène rejeté par la photosynthèse ?', ['De l’eau, oxydée lors de la photolyse', 'Du dioxyde de carbone', 'Du glucose', 'De l’air absorbé par les stomates'], 0, 'C’est la photolyse de l’eau dans les thylakoïdes qui libère l’O₂.'],
            ['Où se déroule la phase photochimique de la photosynthèse ?', ['Dans les thylakoïdes du chloroplaste', 'Dans le stroma', 'Dans la mitochondrie', 'Dans le noyau'], 0, 'C’est là que sont logés les pigments qui captent la lumière.'],
            ['Le cycle de Calvin utilise l’ATP et les RH₂ pour réduire le CO₂.', ['Vrai', 'Faux'], 0, 'Il se déroule dans le stroma, et dépend donc indirectement de la lumière.'],
            ['Quelle enzyme fixe le CO₂ dans le cycle de Calvin ?', ['La RuBisCO', 'L’ATP synthase', 'La chlorophylle', 'L’amylase'], 0, 'Elle fixe le CO₂ sur un sucre à 5 carbones ; c’est la protéine la plus abondante de la biosphère.'],
            ['Que montre la superposition du spectre d’action et du spectre d’absorption ?', ['Que ce sont bien les pigments qui captent l’énergie utilisée', 'Que la chlorophylle est verte', 'Que la lumière verte est la plus efficace', 'Que le CO₂ absorbe la lumière'], 0, 'L’efficacité photosynthétique est maximale là où les pigments absorbent : bleu et rouge.'],
            ['Les feuilles sont vertes parce que la chlorophylle absorbe le vert.', ['Vrai', 'Faux'], 1, 'Elle le RÉFLÉCHIT : elle absorbe surtout le bleu et le rouge.'],
            ['Sous quelle forme la plante stocke-t-elle le glucose en réserve ?', ['En amidon', 'En cellulose', 'En saccharose dans le xylème', 'En ATP'], 0, 'La cellulose, elle, sert de charpente dans la paroi des cellules.'],
            ['À quoi servent les métabolites secondaires ?', ['À la défense, à l’attraction des pollinisateurs et à la compétition', 'À la croissance des tiges', 'À la respiration cellulaire', 'À la circulation de la sève'], 0, 'Alcaloïdes, tanins, terpènes : ce sont eux qui intéressent pharmacie et parfumerie.'],
          ],
        },
        {
          titre: 'Reproduction de la plante entre vie fixée et mobilité',
          lecon: {
            titre: 'Faire voyager ce qui ne peut pas bouger',
            cours: `Une plante fixée doit résoudre **deux** problèmes de mobilité : faire se rencontrer des gamètes qui ne peuvent pas se déplacer, et disperser sa descendance loin d’elle. Elle sous-traite les deux.

## La fleur, un organe condensé
| Verticille | Son rôle |
| **Sépales** (calice) | Protéger le bouton |
| **Pétales** (corolle) | Attirer visuellement |
| **Étamines** | Produire le **pollen**, gamétophyte mâle |
| **Pistil** (carpelles) | Stigmate, style et **ovaire** contenant les ovules |

## Les deux pollinisations
| | **Anémogamie** — le vent | **Zoogamie** — les animaux |
| Le pollen | Léger, en énormes quantités | Lourd et collant, en petite quantité |
| La fleur | Discrète, sans pétales voyants ni nectar | Voyante, odorante, avec **nectar** |
| Exemples | Graminées, conifères, noisetier | La grande majorité des plantes à fleurs |
| Le bilan | Beaucoup de gaspillage — d’où les allergies | Beaucoup plus économe |

## La coévolution
Chaque partenaire exerce une pression de sélection sur l’autre, et les deux lignées évoluent conjointement.

> L’exemple canonique : l’orchidée malgache *Angraecum sesquipedale*, dont l’éperon nectarifère mesure **30 cm**. Darwin en déduisit en 1862 l’existence d’un papillon à trompe aussi longue. Il fut découvert **quarante ans plus tard**.

La coévolution ne suppose **aucune intention** : c’est un ajustement réciproque par sélection naturelle, sur des millions d’années.

## Éviter l’autofécondation
| Le dispositif | Comment il agit |
| Maturation décalée | Étamines et pistil ne sont pas mûrs en même temps |
| **Dioécie** | Les sexes sont sur des pieds différents |
| Incompatibilité biochimique | Le stigmate rejette le pollen de la même plante |

L’allofécondation brasse davantage : c’est tout l’enjeu.

## De la fleur au fruit
| Ce qui devient… | … quoi |
| L’**ovule** | La **graine** : embryon + réserves |
| L’**ovaire** | Le **fruit** |

| Mode de dissémination | Le dispositif | Exemple |
| **Zoochorie** | Fruit charnu et sucré, mangé | Cerise, mûre |
| **Anémochorie** | Fruit ailé ou plumeux | Samare de l’érable, akène du pissenlit |
| Épizoochorie | Crochets accrochés au pelage | Bardane |
| Hydrochorie | Flottaison | Noix de coco |

## La multiplication végétative
Stolons du fraisier, rhizomes du bambou, tubercules de la pomme de terre, drageons du peuplier.

| Avantage | Limite |
| Rapide et sûre pour occuper un milieu favorable | Produit un **clone**, sans diversité nouvelle |

Les deux modes coexistent souvent chez la même espèce : le sexué pour l’innovation et la dispersion lointaine, le végétatif pour l’occupation locale.`,
          },
          questions: [
            ['Quel verticille de la fleur produit le pollen ?', ['Les étamines', 'Les pétales', 'Les sépales', 'Le pistil'], 0, 'Le pistil, lui, contient les ovules dans son ovaire.'],
            ['Quelles caractéristiques trahissent une fleur pollinisée par le vent ?', ['Fleurs discrètes, pollen léger produit en grande quantité', 'Pétales colorés et nectar abondant', 'Pollen lourd et collant', 'Fleurs très odorantes'], 0, 'L’anémogamie gaspille beaucoup de pollen — d’où les allergies au printemps.'],
            ['La pollinisation par les animaux est plus économe en pollen que par le vent.', ['Vrai', 'Faux'], 0, 'Le transport est ciblé : il faut produire beaucoup moins de grains.'],
            ['Qu’illustre l’orchidée à long éperon prédite par Darwin ?', ['La coévolution entre une plante et son pollinisateur', 'La multiplication végétative', 'L’anémogamie', 'L’autofécondation'], 0, 'Le papillon à trompe de 30 cm annoncé en 1862 fut découvert quarante ans plus tard.'],
            ['Que devient l’ovule après la fécondation ?', ['La graine', 'Le fruit', 'Le stigmate', 'L’étamine'], 0, 'C’est l’ovaire, lui, qui devient le fruit.'],
            ['La dioécie — des sexes sur des pieds différents — favorise l’autofécondation.', ['Vrai', 'Faux'], 1, 'Elle l’INTERDIT : c’est un dispositif qui impose la fécondation croisée.'],
            ['Quel mode de dissémination correspond à un fruit charnu et sucré ?', ['La zoochorie : il est mangé et la graine rejetée plus loin', 'L’anémochorie', 'La dispersion par l’eau', 'L’autodissémination explosive'], 0, 'La samare de l’érable, elle, mise sur le vent.'],
            ['Quel avantage la multiplication végétative offre-t-elle sur la reproduction sexuée ?', ['Occuper vite et sûrement un milieu déjà favorable', 'Créer de la diversité génétique', 'Disperser les descendants au loin', 'Résister aux parasites'], 0, 'Elle produit un clone : rapidité contre absence de diversité nouvelle.'],
          ],
        },
        {
          titre: 'La domestication des plantes',
          lecon: {
            titre: 'Dix mille ans de sélection humaine',
            cours: `Aucune plante de nos champs n’existe à l’état sauvage sous sa forme actuelle. Toutes sont le produit d’une **sélection artificielle** commencée au Néolithique.

## Le point de départ
Il y a environ **10 000 ans**, au Proche-Orient, en Chine, en Mésoamérique — **indépendamment** — des groupes humains cessent de seulement récolter : ils **sèment** ce qu’ils ont récolté. Le geste suffit à enclencher une sélection.

## Ce que l’humain sélectionne, sans le savoir
| Le caractère retenu | Pourquoi il est retenu |
| Épis qui **ne se désarticulent pas** | Ceux qui perdent leurs graines au sol ne sont pas récoltés |
| Grains **gros** | Ils sont préférés à la récolte |
| **Germination simultanée** | Elle permet une récolte unique |
| Absence d’amertume | Elle rend la plante comestible |

> Résultat : des plantes plus productives mais **incapables de se disséminer seules**. Elles dépendent désormais de nous — comme nous d’elles.

## L’exemple du maïs
| | La **téosinte** sauvage | Le maïs actuel |
| Grains par épi | Une dizaine, durs | Des centaines, tendres |
| L’épi | Minuscule et cassant | Solide, enveloppé de bractées |

Quelques milliers d’années de sélection sur un **très petit nombre de gènes** ont suffi.

## Les techniques de sélection
| Technique | Le principe | Sa limite |
| **Sélection massale** | Ressemer les graines des meilleurs pieds | Lente, imprécise |
| **Sélection généalogique** | Suivre des lignées, contrôler les croisements | Longue |
| **Hybridation F1** | Croiser deux lignées pures : **vigueur hybride** | La F2 perd l’homogénéité : il faut **racheter** des semences |
| **Mutagenèse** | Provoquer des mutations au hasard, puis trier | Aveugle |
| **Transgenèse** | Introduire un gène précis | Encadrement réglementaire, débat public |

Maïs Bt, riz doré enrichi en précurseur de vitamine A : les OGM font l’objet d’un débat sur leurs effets écologiques, sanitaires et économiques.

## Le revers : l’érosion génétique
> La diversité génétique des plantes cultivées est **très inférieure** à celle de leurs ancêtres sauvages : la domestication est un **goulot d’étranglement**.

Une population uniforme est **vulnérable** : un seul parasite adapté peut la ravager — le mildiou de la pomme de terre en Irlande, 1845.

| La parade | Ce qu’elle conserve |
| Les **banques de semences** | Le Svalbard conserve près d’un million d’échantillons |
| Les **variétés paysannes** | Des allèles pour les sélections futures |
| Les apparentés **sauvages** | Le réservoir d’origine |`,
          },
          questions: [
            ['Quand la domestication des plantes a-t-elle commencé ?', ['Il y a environ 10 000 ans, au Néolithique', 'Il y a environ 500 ans', 'Au XIXᵉ siècle', 'Il y a environ 100 000 ans'], 0, 'Elle est apparue indépendamment dans plusieurs foyers : Proche-Orient, Chine, Mésoamérique.'],
            ['Quel caractère a été sélectionné involontairement en ressemant les récoltes ?', ['Des épis qui ne se désarticulent pas', 'Des graines qui se dispersent seules', 'Des racines plus profondes', 'Une floraison plus tardive'], 0, 'Les plantes qui perdent leurs graines au sol ne sont tout simplement pas récoltées.'],
            ['Les plantes cultivées se disséminent en général mieux que leurs ancêtres sauvages.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : elles en sont devenues incapables et dépendent de l’humain.'],
            ['Quelle est l’ancêtre sauvage du maïs ?', ['La téosinte', 'Le blé sauvage', 'Le riz sauvage', 'Le sorgho'], 0, 'Son épi minuscule et cassant portait une dizaine de grains durs.'],
            ['Qu’est-ce que la vigueur hybride ?', ['La supériorité d’un hybride F1 sur ses deux lignées parentales', 'La résistance naturelle des plantes sauvages', 'La vitesse de germination des graines', 'Le rendement des variétés anciennes'], 0, 'Elle est perdue dès la F2, ce qui oblige à racheter des semences chaque année.'],
            ['La transgenèse introduit un gène précis, éventuellement d’une autre espèce.', ['Vrai', 'Faux'], 0, 'Contrairement à la mutagenèse, qui provoque des mutations au hasard puis trie.'],
            ['Pourquoi l’uniformité génétique des cultures est-elle un risque ?', ['Un seul parasite adapté peut ravager toute la culture', 'Elle réduit les rendements immédiats', 'Elle empêche la photosynthèse', 'Elle interdit la reproduction sexuée'], 0, 'Le mildiou de la pomme de terre en Irlande, en 1845, en est l’exemple historique.'],
            ['À quoi servent les banques de semences comme celle du Svalbard ?', ['À conserver des allèles pour les sélections futures', 'À produire des OGM', 'À stocker des engrais', 'À remplacer les variétés paysannes'], 0, 'Elles conservent près d’un million d’échantillons, dont des apparentés sauvages.'],
          ],
        },

        // ===== Chapitre 4 — Les climats de la Terre ==========================
        {
          titre: 'Comprendre les variations climatiques',
          lecon: {
            titre: 'Ce qui fait bouger le thermostat terrestre',
            cours: `Le climat de la Terre n’a **jamais** été stable. Comprendre les variations passées, c’est se donner les moyens de lire celle qui est en cours.

## Le bilan radiatif
| Flux | Valeur |
| Reçu du Soleil | environ **340 W/m²** |
| Renvoyé directement (**albédo**) | environ **30 %** |
| Absorbé, puis réémis en infrarouge | Le reste |

## L’effet de serre
Vapeur d’eau, **CO₂**, méthane et protoxyde d’azote absorbent l’infrarouge émis par le sol et le réémettent en partie **vers le bas**.

| Sans effet de serre | Avec |
| environ **−18 °C** | environ **+15 °C** |

> L’effet de serre n’est donc **pas** une anomalie : c’est son **renforcement** qui pose problème. Confondre les deux est l’erreur qui ruine une copie.

## Les paramètres de Milankovitch
Ils modifient la **répartition** de l’énergie reçue, sans changer le total.

| Paramètre | Ce qu’il fait varier | Sa période |
| **Excentricité** | La forme de l’orbite | environ 100 000 ans |
| **Obliquité** | L’inclinaison de l’axe, entre 22° et 24,5° | environ 41 000 ans |
| **Précession** | L’orientation de l’axe | environ 21 000 ans |

## Les rétroactions
| Rétroaction | Le mécanisme | Son effet |
| **Albédo** | Il fait plus froid, la glace s’étend, l’albédo augmente | Elle **amplifie**, dans les deux sens |
| **CO₂ océanique** | Un océan froid dissout plus de CO₂, l’effet de serre faiblit | Elle amplifie |
| **Vapeur d’eau** | Plus il fait chaud, plus l’air en contient — et c’est un gaz à effet de serre | Elle amplifie |

> Sans rétroactions, les cycles de Milankovitch ne suffiraient **pas** à produire des glaciations. Ils **déclenchent**, les rétroactions **amplifient** : c’est la clé du chapitre.

## Les forçages à l’échelle des millions d’années
| Forçage | Son effet sur le CO₂ ou la température |
| La **tectonique** | Position des continents, passages océaniques, chaînes |
| L’**altération des silicates** des chaînes jeunes | Elle **consomme** du CO₂ — la surrection de l’Himalaya a refroidi le Cénozoïque |
| Le **volcanisme** | Il en **émet** |
| L’**enfouissement** de matière organique | Il soustrait du carbone à l’atmosphère |

Ce carbone enfoui, ce sont les **combustibles fossiles** — que nous rebrûlons aujourd’hui en quelques siècles.`,
          },
          questions: [
            ['Quelle serait la température moyenne de surface sans effet de serre ?', ['Environ −18 °C', 'Environ 0 °C', 'Environ +15 °C', 'Environ +30 °C'], 0, 'L’effet de serre naturel apporte donc plus de 30 °C : c’est son renforcement qui pose problème.'],
            ['Quel est l’ordre de grandeur de l’albédo terrestre moyen ?', ['Environ 30 %', 'Environ 5 %', 'Environ 70 %', 'Environ 95 %'], 0, 'C’est la part du rayonnement solaire directement renvoyée vers l’espace.'],
            ['Quel cycle de Milankovitch dure environ 100 000 ans ?', ['L’excentricité de l’orbite', 'L’obliquité de l’axe', 'La précession des équinoxes', 'Le cycle solaire'], 0, 'L’obliquité tourne autour de 41 000 ans et la précession de 21 000 ans.'],
            ['Les paramètres orbitaux modifient la quantité TOTALE d’énergie reçue du Soleil.', ['Vrai', 'Faux'], 1, 'Ils en modifient surtout la RÉPARTITION dans le temps et selon la latitude.'],
            ['Comment fonctionne la rétroaction positive de l’albédo ?', ['Plus de glace augmente l’albédo, ce qui refroidit encore davantage', 'Plus de glace réchauffe l’atmosphère', 'L’albédo stabilise le climat', 'L’albédo n’agit que sur les océans'], 0, 'Le mécanisme s’emballe aussi dans l’autre sens lors d’un réchauffement.'],
            ['Pourquoi les cycles de Milankovitch suffisent-ils à déclencher une glaciation ?', ['Parce que des rétroactions amplifient leur effet direct, faible', 'Parce qu’ils modifient fortement la constante solaire', 'Parce qu’ils déplacent les continents', 'Parce qu’ils augmentent le volcanisme'], 0, 'Ils déclenchent ; albédo, CO₂ océanique et vapeur d’eau amplifient.'],
            ['L’altération des silicates des chaînes de montagnes consomme du CO₂ atmosphérique.', ['Vrai', 'Faux'], 0, 'La surrection de l’Himalaya a sans doute contribué au refroidissement du Cénozoïque.'],
            ['Que représentent les combustibles fossiles dans le cycle du carbone ?', ['Du carbone soustrait à l’atmosphère par enfouissement, que nous relâchons', 'Du carbone d’origine volcanique récente', 'Du carbone venu de l’espace', 'Du carbone dissous dans l’océan profond'], 0, 'Des millions d’années d’enfouissement rebrûlées en quelques siècles.'],
          ],
        },
        {
          titre: 'Les méthodes d’observation du climat passé',
          lecon: {
            titre: 'Les archives naturelles du climat',
            cours: `Il n’y a pas de thermomètre avant le XVIIe siècle, ni de réseau mondial de mesures avant le XIXe. Pour tout le reste, on lit des indices indirects — des *proxies*. Chacun a sa résolution et sa portée.

## Le tableau des archives
| Archive | Ce qu’elle donne | Résolution | Portée |
| **Carottes de glace** | Composition de l’air **et** température | Annuelle à décennale | environ 800 000 ans |
| **Foraminifères** marins | Température et **volume des glaces** | Millénaire | Des dizaines de millions d’années |
| **Pollens** | La végétation, donc le climat local | Décennale | Des dizaines de milliers d’années |
| **Cernes des arbres** | Année favorable ou non | **Annuelle** | Quelques milliers d’années |
| Moraines, terrasses | L’extension passée des glaciers | Grossière | Variable |
| Archives historiques | Vendanges, gel des rivières, tableaux | Annuelle | Quelques siècles |

## Les carottes de glace
Deux informations **distinctes** sortent de la même carotte :

| Ce qu’on mesure | Ce que cela donne |
| Les **bulles d’air** piégées | Un échantillon **direct** de l’atmosphère ancienne : CO₂, méthane |
| Le rapport isotopique de l’eau (**δ18O**, δD) | La **température** au moment de la précipitation |

> C’est la **seule** archive qui donne à la fois la température et la composition de l’atmosphère **au même instant**. C’est elle qui montre que CO₂ et température varient de concert depuis 800 000 ans — et cet argument-là ne se remplace par aucun autre.

## Les foraminifères
Leur test calcaire porte un **δ18O** qui dépend de deux choses à la fois : la température de l’eau **et** le volume des glaces — les glaces piègent préférentiellement l’isotope léger, enrichissant l’océan en isotope lourd. C’est ce qui rend l’interprétation délicate, et l’enregistrement précieux.

## Modéliser pour comprendre
Les modèles climatiques sont d’abord **testés sur le passé** : s’ils reproduisent les climats reconstitués par les proxies, on peut leur accorder du crédit pour l’avenir.

C’est le principal **argument de fiabilité** des projections — et il repose entièrement sur la qualité des archives naturelles.`,
          },
          questions: [
            ['Que contiennent les bulles d’air piégées dans une carotte de glace ?', ['Un échantillon direct de l’atmosphère ancienne', 'De l’eau de fonte', 'Des pollens fossiles', 'Du carbone 14'], 0, 'On y mesure directement les teneurs passées en CO₂ et en méthane.'],
            ['Jusqu’à quelle ancienneté remontent les plus longues carottes de glace antarctiques ?', ['Environ 800 000 ans', 'Environ 8 000 ans', 'Environ 80 000 ans', 'Environ 8 millions d’années'], 0, 'La carotte EPICA Dome C fait référence pour cette échelle.'],
            ['Le δ18O de la glace renseigne sur la température au moment de la précipitation.', ['Vrai', 'Faux'], 0, 'Une glace pauvre en isotopes lourds s’est déposée par temps froid.'],
            ['De quoi dépend le δ18O des tests de foraminifères ?', ['De la température de l’eau et du volume des glaces', 'De la profondeur seule', 'De la salinité seule', 'De l’âge de l’organisme'], 0, 'Les glaces piègent l’isotope léger et enrichissent l’océan en isotope lourd.'],
            ['Quelle archive offre la meilleure résolution temporelle ?', ['Les cernes des arbres, avec une résolution annuelle', 'Les sédiments marins', 'Les pollens', 'Les moraines'], 0, 'Sa portée est en revanche limitée à quelques milliers d’années.'],
            ['Les pollens fossiles renseignent sur la végétation, donc sur le climat local.', ['Vrai', 'Faux'], 0, 'Chaque espèce a un pollen reconnaissable et des exigences climatiques connues.'],
            ['Quelle archive donne à la fois la température ET la composition de l’atmosphère ?', ['Les carottes de glace', 'Les cernes des arbres', 'Les moraines glaciaires', 'Les registres de vendanges'], 0, 'C’est ce qui permet d’établir que CO₂ et température varient de concert.'],
            ['Comment teste-t-on la fiabilité d’un modèle climatique ?', ['En vérifiant qu’il reproduit les climats passés reconstitués', 'En comparant deux modèles entre eux', 'En attendant cinquante ans', 'En mesurant la température actuelle'], 0, 'C’est le principal argument de crédit accordé aux projections futures.'],
          ],
        },
        {
          titre: 'Comprendre les conséquences du réchauffement climatique et les possibilités d’actions',
          lecon: {
            titre: 'Ce qui vient, et ce sur quoi on peut agir',
            cours: `Le réchauffement en cours se distingue des variations passées par sa **vitesse** et par sa **cause** : les activités humaines.

| Grandeur | Avant l’ère industrielle | Aujourd’hui |
| CO₂ atmosphérique | environ **280 ppm** | plus de **420 ppm** |
| Température moyenne | Référence 1850-1900 | **+1,1 à 1,2 °C** |
| Niveau marin | Référence 1900 | environ **+20 cm**, et cela s’accélère |

Cette valeur de CO₂ n’a jamais été atteinte depuis au moins **800 000 ans**.

## Les mécanismes de la montée des eaux
| Cause | Ce qui se passe |
| **Dilatation thermique** | L’eau de mer se réchauffe et occupe plus de volume |
| Fonte des **glaces continentales** | Calottes du Groenland et de l’Antarctique, glaciers de montagne |

> La fonte de la **banquise** ne fait **pas** monter le niveau : elle flotte déjà, donc elle déplace déjà son volume. C’est le piège classique de l’exercice.

## Les scénarios du GIEC
Le **GIEC** ne fait pas de recherche : il **évalue** l’ensemble de la littérature scientifique publiée.

| Scénario d’émissions | Réchauffement projeté en 2100 |
| Sobre, baisse rapide | environ **+1,5 °C** |
| Intermédiaire | environ +2,5 °C |
| Fortement émetteur | plus de **+4 °C** |

L’écart entre ces trajectoires dépend des **décisions prises maintenant** — pas de l’incertitude scientifique.

## Les conséquences attendues
| Domaine | Ce qui est projeté |
| **Écosystèmes** | Déplacement des aires vers les pôles et l’altitude, **désynchronisation** entre espèces, blanchissement des coraux |
| **Ressources** | Rendements agricoles affectés, stress hydrique, fonte des glaciers alimentant les grands fleuves |
| **Sociétés** | Événements extrêmes plus intenses, submersion des littoraux peuplés, déplacements de population |

La désynchronisation est un exemple parlant : une fleur qui s’ouvre avant l’arrivée de son pollinisateur, et les deux espèces en pâtissent sans qu’aucune n’ait disparu.

## Agir : deux leviers distincts
| | **Atténuation** | **Adaptation** |
| Sur quoi elle agit | La **cause** | Les **conséquences** |
| Ce qu’elle fait | Réduire les émissions à la source | Limiter les dommages du réchauffement déjà engagé |
| Exemples | Sobriété, efficacité, électricité décarbonée, rénovation | Digues, végétalisation des villes, variétés résistantes, alertes |

> Les deux sont nécessaires : une part du réchauffement est **déjà inévitable**, mais son ampleur finale reste ouverte.

## Les puits de carbone
Forêts, sols et océan absorbent aujourd’hui environ **la moitié** de nos émissions. Les préserver et les renforcer fait partie de l’atténuation — mais **ne remplace pas** la baisse des émissions : un puits saturé ne stocke plus.`,
          },
          questions: [
            ['De combien la teneur atmosphérique en CO₂ est-elle passée depuis l’ère préindustrielle ?', ['D’environ 280 ppm à plus de 420 ppm', 'D’environ 100 ppm à 200 ppm', 'D’environ 1 000 ppm à 420 ppm', 'Elle n’a pas changé'], 0, 'Une valeur jamais atteinte depuis au moins 800 000 ans, d’après les carottes de glace.'],
            ['Quel réchauffement moyen a déjà été mesuré depuis 1850-1900 ?', ['Environ 1,1 à 1,2 °C', 'Environ 0,1 °C', 'Environ 4 °C', 'Environ 10 °C'], 0, 'Avec de fortes disparités régionales, l’Arctique se réchauffant bien plus vite.'],
            ['La fonte de la banquise arctique fait monter le niveau des mers.', ['Vrai', 'Faux'], 1, 'Elle flotte déjà : seules les glaces CONTINENTALES et la dilatation thermique font monter le niveau.'],
            ['Quelle est la cause de l’acidification de l’océan ?', ['L’absorption d’une partie du CO₂ émis', 'La fonte des glaciers', 'La hausse de température seule', 'Les pluies acides'], 0, 'L’océan a absorbé environ un quart des émissions, ce qui abaisse son pH.'],
            ['Quel est le rôle du GIEC ?', ['Évaluer l’ensemble de la littérature scientifique publiée', 'Réaliser ses propres expériences', 'Fixer les politiques climatiques des États', 'Mesurer la température mondiale'], 0, 'Il produit une synthèse, pas de la recherche originale.'],
            ['Quelle est la différence entre atténuation et adaptation ?', ['L’atténuation réduit les émissions, l’adaptation limite les dommages', 'L’atténuation est locale, l’adaptation mondiale', 'L’adaptation réduit les émissions', 'Ce sont deux mots pour la même chose'], 0, 'L’une agit sur la cause, l’autre sur les conséquences ; les deux sont nécessaires.'],
            ['Renforcer les puits de carbone suffit à compenser les émissions actuelles.', ['Vrai', 'Faux'], 1, 'Ils absorbent déjà environ la moitié des émissions, mais un puits saturé ne stocke plus.'],
            ['Qu’appelle-t-on désynchronisation dans un écosystème qui se réchauffe ?', ['Une fleur qui s’ouvre avant l’arrivée de son pollinisateur', 'Le décalage des saisons touristiques', 'La migration des continents', 'La variation du δ18O'], 0, 'Les espèces ne décalent pas leur calendrier au même rythme.'],
          ],
        },

        // ===== Chapitre 5 — Comportements, mouvement et système nerveux ======
        {
          titre: 'Les réflexes',
          lecon: {
            titre: 'Le circuit le plus court du corps',
            cours: `Un réflexe est une réponse motrice **involontaire, rapide et stéréotypée**. Le réflexe myotatique — celui du tendon rotulien — est le modèle d’étude, parce que son circuit est le plus simple possible.

## L’arc réflexe : cinq éléments
| Rang | Élément | Sa nature |
| 1 | Le **récepteur** | Le **fuseau neuromusculaire**, sensible à l’étirement |
| 2 | Le nerf **sensitif** | La fibre Ia, vers la moelle |
| 3 | Le **centre nerveux** | La **moelle épinière** — pas le cerveau |
| 4 | Le nerf **moteur** | Le motoneurone |
| 5 | L’**effecteur** | Le muscle, qui se contracte |

> Le réflexe myotatique est **monosynaptique** : **une seule** synapse sépare le neurone sensitif du motoneurone. C’est pourquoi il est si rapide — et pourquoi le cerveau n’a pas le temps d’intervenir.

Sa fonction réelle : maintenir la **posture**. Chaque fois qu’un muscle est étiré par le poids du corps, il se contracte juste ce qu’il faut.

## Le codage du message nerveux
| Niveau | Ce qui varie | Ce qui ne varie **pas** |
| Le long d’une fibre | La **fréquence** des potentiels d’action | Leur amplitude : loi du **tout ou rien** |
| À la synapse | La **concentration** de neurotransmetteur libéré | La nature du neurotransmetteur |

Plus le muscle est étiré, plus les potentiels d’action sont rapprochés : c’est un **codage en fréquence**, et il se lit directement sur un enregistrement.

## La synapse
À la jonction entre deux neurones, ou entre neurone et muscle, le message **change de nature** : il devient **chimique**. L’arrivée des potentiels d’action provoque l’exocytose de neurotransmetteurs — l’**acétylcholine** à la jonction neuromusculaire — qui se fixent sur les récepteurs de la cellule suivante.

## L’intégration par le motoneurone
Un motoneurone reçoit des **milliers** de synapses.

| Type de synapse | Son effet |
| **Excitatrice** | Elle rapproche du seuil |
| **Inhibitrice** | Elle en éloigne |

Il **somme** ces messages et n’émet un potentiel d’action que si le bilan dépasse un seuil. Le réflexe n’est donc pas un automatisme aveugle : il est **modulable**, notamment par des commandes venues du cerveau.

## Explorer le réflexe
L’**électromyogramme** enregistre l’activité électrique du muscle. Le délai entre stimulation et réponse donne la **vitesse de conduction** et permet de localiser une lésion : le réflexe est un outil de **diagnostic** neurologique courant.`,
          },
          questions: [
            ['Quel récepteur déclenche le réflexe myotatique ?', ['Le fuseau neuromusculaire, sensible à l’étirement', 'Le corpuscule tactile de la peau', 'Le motoneurone', 'La synapse neuromusculaire'], 0, 'Il est logé dans le muscle lui-même et détecte sa mise en tension.'],
            ['Quel centre nerveux intègre le réflexe myotatique ?', ['La moelle épinière', 'Le cortex moteur', 'Le cervelet', 'L’hypothalamus'], 0, 'Le cerveau n’intervient pas : c’est ce qui rend la réponse aussi rapide.'],
            ['Le réflexe myotatique est monosynaptique.', ['Vrai', 'Faux'], 0, 'Une seule synapse sépare le neurone sensitif du motoneurone.'],
            ['Comment l’intensité d’un stimulus est-elle codée dans une fibre nerveuse ?', ['Par la fréquence des potentiels d’action', 'Par leur amplitude', 'Par leur durée individuelle', 'Par le nombre de synapses traversées'], 0, 'Les potentiels d’action sont tous identiques : c’est la loi du tout ou rien.'],
            ['Quel neurotransmetteur agit à la jonction neuromusculaire ?', ['L’acétylcholine', 'La dopamine', 'L’adrénaline', 'Le cortisol'], 0, 'Elle est libérée par exocytose dans la fente synaptique.'],
            ['Au niveau d’une synapse, le message nerveux devient chimique.', ['Vrai', 'Faux'], 0, 'Il est codé en concentration de neurotransmetteur libéré.'],
            ['Que fait un motoneurone qui reçoit des milliers de synapses ?', ['Il somme messages excitateurs et inhibiteurs et répond au-delà d’un seuil', 'Il transmet le premier message reçu', 'Il ignore les messages inhibiteurs', 'Il déclenche systématiquement un potentiel d’action'], 0, 'C’est cette intégration qui rend le réflexe modulable par le cerveau.'],
            ['À quoi sert un électromyogramme en clinique ?', ['À mesurer la vitesse de conduction et localiser une lésion nerveuse', 'À enregistrer l’activité du cortex', 'À mesurer la glycémie', 'À visualiser les muscles en trois dimensions'], 0, 'Le réflexe devient alors un outil de diagnostic neurologique.'],
          ],
        },
        {
          titre: 'Cerveau et mouvement volontaire',
          lecon: {
            titre: 'De l’intention au geste',
            cours: `Un mouvement volontaire n’est pas un réflexe : il est **décidé**, planifié, et modifiable en cours d’exécution.

## Le cortex moteur primaire
Situé sur la circonvolution frontale ascendante, juste devant le sillon central. Sa cartographie est **somatotopique** : chaque zone commande une partie précise du corps, et les régions voisines du corps sont représentées côte à côte.

> La surface corticale attribuée à un organe n’est **pas** proportionnelle à sa taille, mais à la **finesse de son contrôle**. La main, la langue et les lèvres occupent une place démesurée : c’est l’**homonculus moteur**, cette représentation déformée du corps.

## Le trajet de la commande
| Étape | Ce qui se passe |
| Le cortex moteur émet | Les axones forment le **faisceau corticospinal** |
| Au niveau du **bulbe rachidien** | Le faisceau **croise la ligne médiane** |
| Dans la moelle | Il rejoint les **motoneurones** |

D’où la règle : **l’hémisphère gauche commande le côté droit**, et réciproquement. Les motoneurones sont la **voie finale commune** — réflexe et mouvement volontaire y passent tous deux.

## Ce que révèlent les lésions
| La lésion | Sa conséquence |
| Cortex moteur **gauche** (AVC, tumeur) | **Hémiplégie** du côté **droit** : controlatérale |
| Section de la **moelle** | Plus de commande volontaire **sous** le niveau lésé — mais les réflexes médullaires peuvent persister |

## Les autres acteurs
| Structure | Son rôle | Ce que son atteinte provoque |
| Aires **prémotrices** | Planifier le geste | Difficulté à organiser une séquence |
| **Cervelet** | Coordination, équilibre, précision | Gestes imprécis, démarche instable |
| **Noyaux gris centraux** | Initiation et automatisation | Maladie de **Parkinson** |

## La plasticité cérébrale
| Type | Quand | Exemple |
| De **développement** | Enfance | Les cartes s’affinent, les connexions inutiles sont élaguées |
| D’**apprentissage** | Toute la vie | La zone des doigts de la main gauche est **agrandie** chez un violoniste |
| De **réparation** | Après une lésion | Des régions voisines reprennent tout ou partie de la fonction |

> C’est le fondement de la **rééducation** : la récupération n’est pas passive, elle se **travaille** — et d’autant mieux qu’elle commence tôt.

## Voir le cerveau au travail
| Technique | Ce qu’elle montre |
| **IRM anatomique** | Les structures |
| **IRMf** | Les régions **actives**, par l’afflux de sang oxygéné |

C’est l’IRMf qui a permis de cartographier les aires motrices chez le sujet **vivant**, sans attendre une lésion.`,
          },
          questions: [
            ['Où se situe le cortex moteur primaire ?', ['Sur la circonvolution frontale ascendante, devant le sillon central', 'Dans le lobe occipital', 'Dans le cervelet', 'Dans la moelle épinière'], 0, 'Sa cartographie y est somatotopique : chaque zone commande une partie du corps.'],
            ['Que représente l’homonculus moteur ?', ['Une carte déformée où chaque organe occupe une place liée à la finesse de son contrôle', 'Un modèle anatomique du cerveau', 'La forme réelle du cortex', 'Le trajet du faisceau pyramidal'], 0, 'La main, la langue et les lèvres y occupent une surface démesurée.'],
            ['Le faisceau corticospinal croise la ligne médiane au niveau du bulbe rachidien.', ['Vrai', 'Faux'], 0, 'D’où le contrôle croisé : l’hémisphère gauche commande le côté droit du corps.'],
            ['Une lésion du cortex moteur gauche entraîne…', ['Une hémiplégie du côté droit', 'Une hémiplégie du côté gauche', 'Une paralysie totale', 'Une perte de la sensibilité seule'], 0, 'La commande motrice est croisée : la paralysie est controlatérale.'],
            ['Quelle structure est en cause dans la maladie de Parkinson ?', ['Les noyaux gris centraux', 'Le cortex visuel', 'La moelle épinière', 'Le fuseau neuromusculaire'], 0, 'Ils interviennent dans l’initiation et l’automatisation des mouvements.'],
            ['Chez un violoniste, la zone corticale des doigts de la main gauche est agrandie.', ['Vrai', 'Faux'], 0, 'C’est la plasticité d’apprentissage : l’entraînement remodèle les cartes corticales.'],
            ['Sur quoi repose la rééducation après un AVC ?', ['Sur la plasticité cérébrale : des régions voisines reprennent la fonction', 'Sur la repousse des axones sectionnés', 'Sur la multiplication des neurones lésés', 'Sur le seul repos'], 0, 'La récupération se travaille, et d’autant mieux qu’elle commence tôt.'],
            ['Que détecte l’IRM fonctionnelle ?', ['L’afflux de sang oxygéné qui accompagne l’activité neuronale', 'Les potentiels d’action un par un', 'La structure anatomique seule', 'La concentration en neurotransmetteurs'], 0, 'Elle permet de cartographier les aires actives chez le sujet vivant.'],
          ],
        },
        {
          titre: 'Le cerveau : un organe fragile à préserver',
          lecon: {
            titre: 'Ce qui l’abîme, ce qui le protège',
            cours: `Le cerveau est protégé par le crâne, les méninges et le liquide cérébrospinal. Cela ne suffit pas : ses neurones se renouvellent très peu, et une lésion est le plus souvent **définitive**.

## Les atteintes et leur prévention
| Atteinte | Le mécanisme | La prévention |
| **Traumatisme crânien** | Commotion, hémorragie, œdème | Casque, ceinture, protocoles de sortie du terrain |
| Commotions **répétées** | Rugby, boxe, football américain | Atteintes cognitives durables documentées |
| **AVC** | Obstruction (ischémie) ou rupture d’un vaisseau | **Urgence absolue** : plus la prise en charge est rapide, plus la zone sauvée est grande |
| Maladies **neurodégénératives** | Destruction progressive des neurones ou de la myéline | Activité physique, intellectuelle et sociale : la **réserve cognitive** retarde les symptômes |

## Les substances psychoactives
Toutes agissent au niveau des **synapses** : elles miment un neurotransmetteur, bloquent sa recapture, ou empêchent sa fixation.

Le **système de récompense** — aire tegmentale ventrale, noyau accumbens, cortex préfrontal — utilise la **dopamine**. Il valorise normalement ce qui est utile à la survie : manger, boire, se reproduire, apprendre.

> Les drogues **court-circuitent** ce système : elles provoquent une libération de dopamine **sans rapport avec un besoin réel**. C’est cette dissociation qui fonde la dépendance.

| L’usage répété entraîne | Ce qui se passe |
| Une **tolérance** | Le cerveau réduit le nombre de récepteurs : il faut augmenter les doses |
| Une **dépendance** | Le manque devient la motivation principale |
| Une **altération du cortex préfrontal** | Siège du contrôle de soi et de l’évaluation des risques |

> L’adolescence est une période de **maturation** du cortex préfrontal, qui se poursuit jusque vers **25 ans**. C’est ce qui rend un cerveau adolescent particulièrement vulnérable aux effets durables des substances.

## Deux cas particuliers
| Substance | Ce qui est documenté |
| **Alcool** | Toxique direct ; consommation massive ponctuelle et chronique toutes deux délétères ; traverse le placenta |
| **Cannabis** | Le THC agit sur les récepteurs endocannabinoïdes ; à l’adolescence, troubles de la mémoire et de l’attention, risque psychotique accru chez les sujets prédisposés |

## Le sommeil
Il **consolide** les apprentissages de la journée et permet l’**élimination des déchets** métaboliques du cerveau. La privation chronique dégrade attention, mémoire et humeur : le protéger est une mesure d’hygiène cérébrale à part entière.`,
          },
          questions: [
            ['Pourquoi une lésion cérébrale est-elle souvent définitive ?', ['Les neurones se renouvellent très peu', 'Le crâne empêche toute réparation', 'Le sang n’y circule pas', 'Les neurones ne communiquent plus entre eux'], 0, 'Seule la plasticité, via des régions voisines, permet une récupération partielle.'],
            ['Que se passe-t-il lors d’un accident vasculaire cérébral ?', ['Une région du cerveau est brutalement privée d’oxygène', 'Les neurones se multiplient trop vite', 'La myéline se reforme en excès', 'La dopamine est libérée massivement'], 0, 'Par obstruction ou rupture d’un vaisseau : c’est une urgence absolue.'],
            ['Les commotions cérébrales répétées sont associées à des atteintes cognitives durables.', ['Vrai', 'Faux'], 0, 'D’où les protocoles de sortie du terrain dans les sports de contact.'],
            ['Quel neurotransmetteur est au cœur du système de récompense ?', ['La dopamine', 'L’acétylcholine', 'L’adrénaline', 'L’insuline'], 0, 'Il valorise normalement ce qui est utile à la survie ; les drogues le court-circuitent.'],
            ['Comment agissent les substances psychoactives ?', ['Au niveau des synapses, en perturbant les neurotransmetteurs', 'En détruisant directement le crâne', 'En modifiant l’ADN des neurones', 'En bloquant la circulation sanguine'], 0, 'Elles miment un neurotransmetteur, bloquent sa recapture ou empêchent sa fixation.'],
            ['Qu’est-ce que la tolérance à une substance ?', ['Le cerveau réduit ses récepteurs, il faut augmenter les doses', 'Le corps élimine la substance plus vite', 'La substance devient inefficace définitivement', 'Le manque disparaît'], 0, 'Elle prépare le terrain à la dépendance.'],
            ['Le cortex préfrontal achève sa maturation vers l’âge de 25 ans.', ['Vrai', 'Faux'], 0, 'C’est ce qui rend le cerveau adolescent particulièrement vulnérable aux substances.'],
            ['Quel rôle le sommeil joue-t-il pour le cerveau ?', ['Il consolide les apprentissages et élimine les déchets métaboliques', 'Il augmente le nombre de neurones', 'Il ralentit la plasticité cérébrale', 'Il n’a aucun effet cognitif'], 0, 'Sa privation chronique dégrade attention, mémoire et humeur.'],
          ],
        },

        // ===== Chapitre 6 — Produire le mouvement ============================
        {
          titre: 'La cellule musculaire : une structure spécialisée permettant son propre raccourcissement',
          lecon: {
            titre: 'Le sarcomère, moteur du mouvement',
            cours: `Un muscle se raccourcit parce que **chacune de ses cellules** se raccourcit. Toute l’organisation de la fibre musculaire est au service de ce geste unique.

## De l’organe à la molécule
| Niveau | Ce que c’est |
| Le **muscle** | Des faisceaux |
| Le **faisceau** | Des **fibres musculaires**, les cellules |
| La **fibre** | Une cellule géante, **allongée** et **plurinucléée** — née de la fusion de plusieurs cellules |
| La **myofibrille** | Une file de **sarcomères** mis bout à bout |

## Le sarcomère, unité contractile
Délimité par deux **stries Z**, il contient deux jeux de filaments qui s’interpénètrent.

| Filament | Sa protéine | Où il est ancré |
| **Fin** | L’**actine** | Sur les stries Z |
| **Épais** | La **myosine** | Au centre |

C’est cette alternance régulière qui donne au muscle son aspect **strié** au microscope.

## Le mécanisme : le glissement
Les têtes de myosine se fixent sur l’actine, **pivotent** en tirant le filament fin vers le centre, se détachent, se replacent et recommencent. Les stries Z se rapprochent.

> Les filaments **ne raccourcissent pas** : ils **glissent**. C’est l’erreur la plus fréquente au bac — parler d’un « raccourcissement de l’actine » est faux, et se voit immédiatement.

## Ce que le cycle exige
| Élément | Son rôle exact | Sans lui |
| L’**ATP** | Sa fixation **détache** la tête de l’actine ; son hydrolyse la **réarme** | Les têtes restent accrochées : c’est la rigidité cadavérique |
| Le **calcium** | Il déplace le complexe qui masque les sites de fixation sur l’actine | Aucune fixation possible |

## Du nerf au calcium
1. Le **motoneurone** libère de l’**acétylcholine** à la jonction neuromusculaire.
2. Un potentiel d’action se propage sur la membrane de la fibre.
3. Le **réticulum sarcoplasmique**, réservoir interne, libère ses ions **Ca²⁺**.
4. La contraction commence.
5. Quand la commande cesse, le calcium est **repompé activement** — donc en consommant de l’ATP — et la fibre se relâche.

Le relâchement coûte de l’énergie autant que la contraction : c’est contre-intuitif, et c’est exact.

## L’unité motrice
Un motoneurone et **toutes** les fibres qu’il innerve : elles se contractent ensemble.

| Muscle | Fibres par unité motrice | Ce que cela donne |
| L’œil | Quelques-unes | La **finesse** du contrôle |
| Le mollet | Plus d’un millier | La **puissance** |

La force développée dépend du **nombre d’unités motrices recrutées** et de la **fréquence** des messages reçus.`,
          },
          questions: [
            ['Qu’est-ce qu’une fibre musculaire ?', ['Une cellule géante, allongée et plurinucléée', 'Un faisceau de plusieurs cellules', 'Un filament de myosine', 'Un tendon'], 0, 'Elle provient de la fusion de plusieurs cellules, d’où ses nombreux noyaux.'],
            ['Quelles protéines constituent les filaments du sarcomère ?', ['L’actine et la myosine', 'Le collagène et l’élastine', 'L’insuline et le glucagon', 'L’ATP et la créatine'], 0, 'Les filaments fins d’actine sont ancrés sur les stries Z, les épais de myosine sont au centre.'],
            ['Lors de la contraction, les filaments d’actine se raccourcissent.', ['Vrai', 'Faux'], 1, 'Ils GLISSENT le long des filaments de myosine : c’est le sarcomère qui raccourcit.'],
            ['Quel est le rôle de l’ATP dans le cycle des têtes de myosine ?', ['Sa fixation détache la tête de l’actine et son hydrolyse la réarme', 'Il libère le calcium du réticulum', 'Il déclenche le potentiel d’action', 'Il allonge le filament d’actine'], 0, 'Sans ATP, les têtes restent accrochées : c’est la rigidité cadavérique.'],
            ['Quel ion libère les sites de fixation sur l’actine ?', ['Le calcium', 'Le sodium', 'Le potassium', 'Le chlorure'], 0, 'Il déplace le complexe protéique qui masque ces sites au repos.'],
            ['Le réticulum sarcoplasmique est le réservoir interne de calcium de la fibre.', ['Vrai', 'Faux'], 0, 'Il le libère à l’arrivée du signal et le repompe activement au relâchement.'],
            ['Qu’appelle-t-on unité motrice ?', ['Un motoneurone et l’ensemble des fibres qu’il innerve', 'Un sarcomère isolé', 'Une myofibrille entière', 'Un muscle et son tendon'], 0, 'Elles se contractent toutes ensemble : quelques fibres pour l’œil, plus de mille pour le mollet.'],
            ['De quoi dépend la force développée par un muscle ?', ['Du nombre d’unités motrices recrutées et de la fréquence des messages', 'De la longueur des filaments de myosine', 'Du nombre de noyaux par fibre', 'De la quantité de calcium disponible seule'], 0, 'Le recrutement progressif permet de doser précisément l’effort.'],
          ],
        },
        {
          titre: 'Origine de l’énergie (ATP) nécessaire à la contraction de la cellule musculaire',
          lecon: {
            titre: 'Trois voies pour régénérer l’ATP',
            cours: `L’ATP est la **seule** molécule directement utilisable par la myosine. Or la fibre n’en contient qu’une réserve dérisoire : de quoi tenir **2 à 3 secondes** d’effort intense. Tout l’enjeu est de la **régénérer** aussi vite qu’elle est consommée.

## Les trois voies
| Voie | Oxygène ? | Rendement | Durée d’efficacité | Effort typique |
| **Phosphocréatine** | Non | Immédiat, sans déchet | environ **10 secondes** | 100 m, haltérophilie, saut |
| **Fermentation lactique** | Non | **2 ATP** par glucose | 30 s à 2 min | 400 m, 800 m |
| **Respiration cellulaire** | **Oui** | **30 à 36 ATP** par glucose | Illimitée | Endurance |

## Voie 1 — la phosphocréatine
ADP + phosphocréatine donne ATP + créatine. Direct, sans oxygène et sans déchet acide — mais la réserve est épuisée en une dizaine de secondes.

## Voie 2 — la fermentation lactique
La **glycolyse** dégrade le glucose dans le cytoplasme jusqu’au pyruvate, transformé en **lactate**. Peu rentable, mais rapide et indépendante de l’apport en O₂. L’accumulation de lactate et de protons accompagne la fatigue et limite la poursuite de l’effort.

## Voie 3 — la respiration cellulaire
| Étape | Où | Ce qu’elle produit |
| **Glycolyse** | Cytoplasme | Le pyruvate |
| **Cycle de Krebs** | Matrice mitochondriale | CO₂ et transporteurs réduits |
| **Chaîne respiratoire** | Membrane interne | L’essentiel de l’ATP, en réduisant l’O₂ en eau |

Les **lipides** peuvent aussi y être dégradés, ce qui donne une réserve énergétique presque illimitée.

> Les trois voies ne se succèdent **pas** comme des interrupteurs : elles fonctionnent **simultanément**, et c’est leur **contribution relative** qui change au cours de l’effort. C’est la nuance qui distingue une bonne copie.

## Ce que l’entraînement modifie
| Entraînement | Ce qu’il augmente |
| **Endurance** | Nombre de mitochondries, densité capillaire, VO₂ max |
| **Musculation** | Section des fibres, réserves de phosphocréatine et de glycogène |

## Fibres lentes et fibres rapides
| | Type I, **lentes** | Type II, **rapides** |
| Mitochondries | Nombreuses | Peu |
| Myoglobine, vascularisation | Riches — fibres rouges | Pauvres — fibres blanches |
| Enzymes dominantes | Respiratoires | Glycolytiques |
| Qualité | Résistantes à la fatigue | Puissantes mais fatigables |
| Athlète type | Le marathonien | Le sprinteur |

La proportion des deux types est en partie **génétique**, en partie modelée par l’entraînement.`,
          },
          questions: [
            ['Combien de temps la réserve d’ATP d’une fibre musculaire permet-elle de tenir ?', ['2 à 3 secondes d’effort intense', 'Environ 2 minutes', 'Environ 10 minutes', 'Plusieurs heures'], 0, 'D’où la nécessité de la régénérer en permanence par trois voies métaboliques.'],
            ['Quelle voie est mobilisée en premier lors d’un sprint de 100 m ?', ['La phosphocréatine', 'La fermentation lactique', 'La respiration cellulaire', 'La dégradation des lipides'], 0, 'Immédiate, sans oxygène, mais épuisée en une dizaine de secondes.'],
            ['Combien d’ATP la fermentation lactique produit-elle par molécule de glucose ?', ['2', '18', '36', '100'], 0, 'C’est peu, mais rapide et indépendant de l’apport en dioxygène.'],
            ['La fermentation lactique se déroule dans la mitochondrie.', ['Vrai', 'Faux'], 1, 'Elle a lieu dans le CYTOPLASME : seule la respiration mobilise la mitochondrie.'],
            ['Où se déroule le cycle de Krebs ?', ['Dans la matrice mitochondriale', 'Dans le cytoplasme', 'Sur la membrane plasmique', 'Dans le réticulum sarcoplasmique'], 0, 'La chaîne respiratoire, elle, siège sur la membrane interne de la mitochondrie.'],
            ['Quel est l’ordre de grandeur du rendement de la respiration cellulaire ?', ['30 à 36 ATP par glucose', '2 ATP par glucose', '4 ATP par glucose', '200 ATP par glucose'], 0, 'Une quinzaine de fois plus que la fermentation : c’est la voie de l’endurance.'],
            ['Les trois voies de régénération de l’ATP fonctionnent simultanément.', ['Vrai', 'Faux'], 0, 'C’est leur contribution RELATIVE qui change au cours de l’effort, pas leur activation.'],
            ['Qu’est-ce qui caractérise une fibre musculaire de type I ?', ['Riche en mitochondries, résistante à la fatigue', 'Pauvre en mitochondries, très puissante', 'Dépourvue de myoglobine', 'Incapable d’utiliser le dioxygène'], 0, 'Ce sont les fibres lentes et rouges, celles du marathonien.'],
          ],
        },
        {
          titre: 'Le contrôle des flux de glucose, source essentielle d’énergie des cellules musculaires',
          lecon: {
            titre: 'Tenir la glycémie à 1 g/L',
            cours: `Le muscle consomme du glucose, parfois brutalement. Pourtant la **glycémie** reste remarquablement stable autour de **1 g/L**, à jeun comme après un repas. C’est un exemple d’**homéostasie** : une stabilité obtenue par régulation active.

## Les stocks de glucose
| Stock | Sous quelle forme | Mobilisable pour… |
| Glycogène **musculaire** | Polymère de glucose | **Le muscle seul** — la fibre n’a pas l’enzyme pour relibérer du glucose dans le sang |
| Glycogène **hépatique** | Idem | **Tout l’organisme** : c’est le foie qui régule la glycémie |
| Tissus **adipeux** | Lipides | L’excédent, à long terme |

## Les capteurs et les messagers
Les **îlots de Langerhans** du pancréas détectent la glycémie et sécrètent deux hormones **antagonistes**.

| Cellules | Hormone | Quand | Effet |
| **β** | **Insuline** | La glycémie **monte** | Seule hormone **hypoglycémiante** : elle fait entrer le glucose (transporteurs **GLUT4**) et stimule le stockage |
| **α** | **Glucagon** | La glycémie **baisse** | **Hyperglycémiante** : hydrolyse du glycogène hépatique, fabrication de glucose |

> Le pancréas est à la fois **capteur** et **émetteur** : il mesure et il répond. Le **foie** est l’effecteur principal, le **muscle** un gros consommateur. Distinguer ces trois rôles est la clé de tout schéma fonctionnel.

## Pendant l’effort
La consommation musculaire augmente, la glycémie tend à baisser, l’insuline chute, le glucagon monte, le foie déstocke. Le muscle, lui, puise d’abord dans son **propre** glycogène.

Particularité importante : à l’effort, la **contraction** fait migrer les GLUT4 vers la membrane **même sans insuline**. C’est un des mécanismes par lesquels l’activité physique améliore le contrôle glycémique.

## Quand la régulation échoue
| | Diabète de **type 1** | Diabète de **type 2** |
| Le mécanisme | Destruction **auto-immune** des cellules β | **Insulinorésistance** : l’insuline est là, sans effet |
| L’insuline | Absente | Présente, puis le pancréas s’épuise |
| L’apparition | Souvent précoce, brutale | Plus tardive, progressive |
| Les facteurs | Auto-immunité | Sédentarité, surpoids, prédispositions |
| Le traitement | Insuline à vie | D’abord le **mode de vie** : activité physique, alimentation |

Dans les deux cas, l’hyperglycémie chronique abîme les **petits vaisseaux** : rétine, reins, nerfs, cœur. C’est ce qui fait la gravité de la maladie — bien plus que le symptôme immédiat.`,
          },
          questions: [
            ['Autour de quelle valeur la glycémie est-elle régulée ?', ['Environ 1 g/L', 'Environ 0,1 g/L', 'Environ 5 g/L', 'Environ 10 g/L'], 0, 'Cette stabilité, à jeun comme après un repas, est un exemple d’homéostasie.'],
            ['Pourquoi le glycogène musculaire ne peut-il pas servir à toute la glycémie ?', ['La fibre musculaire ne peut pas relibérer de glucose dans le sang', 'Il est trop peu abondant', 'Il est dégradé trop lentement', 'Il est stocké sous forme de lipides'], 0, 'Elle n’a pas l’enzyme nécessaire ; c’est le foie qui joue ce rôle.'],
            ['Quelle est la seule hormone hypoglycémiante de l’organisme ?', ['L’insuline', 'Le glucagon', 'L’adrénaline', 'Le cortisol'], 0, 'Elle est produite par les cellules β des îlots de Langerhans.'],
            ['Le glucagon est sécrété par les cellules α du pancréas quand la glycémie baisse.', ['Vrai', 'Faux'], 0, 'Il déclenche dans le foie l’hydrolyse du glycogène et la production de glucose.'],
            ['Quel transporteur l’insuline fait-elle migrer vers la membrane des cellules musculaires ?', ['GLUT4', 'L’ATP synthase', 'La myosine', 'L’acétylcholine'], 0, 'C’est ce qui permet l’entrée massive de glucose dans la cellule.'],
            ['Quel organe est le principal effecteur de la régulation de la glycémie ?', ['Le foie', 'Le pancréas', 'Le muscle', 'Le rein'], 0, 'Le pancréas est le capteur et l’émetteur ; le foie stocke et déstocke.'],
            ['Le diabète de type 1 résulte d’une destruction auto-immune des cellules β.', ['Vrai', 'Faux'], 0, 'Il n’y a alors plus d’insuline du tout : le traitement par insuline est vital.'],
            ['Qu’est-ce qui caractérise le diabète de type 2 ?', ['Une insulinorésistance des cellules cibles', 'Une absence totale d’insuline dès l’enfance', 'Un excès de glucagon d’origine génétique', 'Une destruction du foie'], 0, 'L’insuline est présente mais inefficace ; le pancréas compense puis s’épuise.'],
          ],
        },

        // ===== Chapitre 7 — Comportement et stress ===========================
        {
          titre: 'L’adaptabilité de l’organisme face aux perturbations de l’environnement',
          lecon: {
            titre: 'La réponse au stress, en deux temps',
            cours: `Le stress n’est pas une faiblesse : c’est une **réponse adaptative**, sélectionnée parce qu’elle permet de faire face. Elle se déploie en **deux temps**, portés par deux systèmes distincts.

## Les deux phases
| | Phase 1 — **rapide** | Phase 2 — **lente** |
| Le système | Nerveux **sympathique** | Axe **corticotrope** |
| Le délai | Quelques **secondes** | Quelques dizaines de **minutes** |
| Les messagers | **Adrénaline**, noradrénaline | **CRH**, **ACTH**, **cortisol** |
| La glande | Médullosurrénale | Corticosurrénale |
| Ce qu’elle permet | Agir tout de suite | **Tenir** dans la durée |

## Phase 1 : combat ou fuite
| Effet | Ce qu’il prépare |
| Fréquence cardiaque et pression **augmentent** | Irriguer les muscles |
| Les **bronches** se dilatent | Augmenter les échanges gazeux |
| Le sang est **redistribué** vers muscles et cerveau | Au détriment de la digestion et de la peau |
| La **glycémie** monte | Fournir le carburant |
| Les **pupilles** se dilatent | Augmenter la vigilance |

C’est ce que Cannon a appelé la réponse de « **combat ou fuite** ».

## Phase 2 : la cascade hormonale
1. L’**hypothalamus** libère la **CRH**.
2. L’**hypophyse** antérieure répond en libérant l’**ACTH** dans le sang.
3. La **corticosurrénale** répond en libérant le **cortisol**.

Le cortisol maintient la disponibilité énergétique dans la durée : néoglucogenèse, mobilisation des lipides, modération de la réponse immunitaire.

## Le rétrocontrôle négatif
Le cortisol circulant **freine** la sécrétion de CRH et d’ACTH.

> C’est cette boucle qui fait du stress une réponse **résolutive** : le système s’auto-limite et revient à son état de base. Un système sans rétrocontrôle s’emballerait — et c’est exactement ce qui se détraque dans le stress chronique.

## Le syndrome général d’adaptation
**Hans Selye**, dès 1936, décrit trois phases.

| Phase | Ce qui s’y passe | Bénéfique ? |
| **Alarme** | Mobilisation rapide, sympathique | Oui |
| **Résistance** | Plateau soutenu par le cortisol | Oui |
| **Épuisement** | Les capacités d’adaptation sont dépassées | **Non** |

## Une réponse variable
Face au même événement, les réactions diffèrent selon l’histoire de la personne, son **sentiment de contrôle**, son entourage et sa préparation. Le stress ne dépend pas seulement de l’agent stressant, mais de l’**évaluation** que l’individu en fait.`,
          },
          questions: [
            ['Quelle hormone est libérée par la médullosurrénale lors de la réponse rapide au stress ?', ['L’adrénaline', 'Le cortisol', 'L’insuline', 'La CRH'], 0, 'Elle prépare l’organisme à l’action en quelques secondes.'],
            ['Quels effets caractérisent la phase d’alarme ?', ['Hausse de la fréquence cardiaque, de la glycémie et de la vigilance', 'Ralentissement du cœur et somnolence', 'Baisse de la pression artérielle', 'Augmentation de la digestion'], 0, 'C’est la réponse « combat ou fuite » décrite par Cannon.'],
            ['L’axe corticotrope met en jeu trois étages hormonaux successifs.', ['Vrai', 'Faux'], 0, 'CRH de l’hypothalamus, ACTH de l’hypophyse, cortisol de la corticosurrénale.'],
            ['Quelle hormone l’hypophyse libère-t-elle en réponse à la CRH ?', ['L’ACTH', 'Le cortisol', 'L’adrénaline', 'Le glucagon'], 0, 'L’ACTH circule dans le sang et stimule la corticosurrénale.'],
            ['Quel est le rôle principal du cortisol dans la réponse au stress ?', ['Maintenir la disponibilité énergétique dans la durée', 'Accélérer le cœur en quelques secondes', 'Dilater les pupilles', 'Faire baisser la glycémie'], 0, 'Il stimule la néoglucogenèse et mobilise les lipides.'],
            ['Le cortisol freine la sécrétion de CRH et d’ACTH.', ['Vrai', 'Faux'], 0, 'C’est le rétrocontrôle négatif : le système s’auto-limite et redescend.'],
            ['Quelles sont les trois phases du syndrome général d’adaptation de Selye ?', ['Alarme, résistance, épuisement', 'Alerte, fuite, combat', 'Excitation, plateau, sommeil', 'Contraction, relâchement, repos'], 0, 'Les deux premières sont bénéfiques ; le problème commence à la troisième.'],
            ['De quoi dépend l’intensité de la réponse au stress d’une personne à l’autre ?', ['De son histoire, de son sentiment de contrôle et de son entourage', 'Uniquement de la gravité objective de l’événement', 'De sa masse musculaire', 'De sa glycémie initiale seule'], 0, 'C’est l’ÉVALUATION de la situation qui compte, pas seulement la situation.'],
          ],
        },
        {
          titre: 'L’organisme débordé dans ses capacités d’adaptation',
          lecon: {
            titre: 'Quand le stress ne s’arrête plus',
            cours: `Une réponse au stress efficace est une réponse **qui s’arrête**. Le problème n’est pas le stress aigu, c’est le stress **chronique** : une exposition prolongée qui empêche le retour à l’état de base.

## L’échec du rétrocontrôle
Sous exposition prolongée, les récepteurs au cortisol de l’hypothalamus et de l’hypophyse se **désensibilisent** : le frein fonctionne mal, et le cortisol reste **durablement élevé**.

> Ce qui était une réponse adaptative devient une **agression permanente**. Le mécanisme n’a pas changé : c’est sa durée qui le retourne.

## Les conséquences
| Système | Ce qui se dégrade |
| **Cardiovasculaire** | Hypertension durable, athérosclérose, risque d’infarctus et d’AVC |
| **Immunitaire** | Le cortisol est immunosuppresseur : plus d’infections, cicatrisation retardée |
| **Métabolique** | Hyperglycémie chronique, graisse abdominale, insulinorésistance — terrain de diabète de type 2 |
| **Cérébral** | L’**hippocampe**, riche en récepteurs au cortisol, perd du volume : la mémoire s’altère |
| **Sommeil et humeur** | Insomnies, irritabilité, anxiété, dépression |

> L’atteinte de l’hippocampe crée un **cercle vicieux** : il participe lui-même au rétrocontrôle. Son atteinte aggrave donc le déséquilibre qui l’a causée.

## L’épuisement professionnel
Le **burn-out** associe trois dimensions : épuisement émotionnel et physique, détachement vis-à-vis du travail, sentiment de perte d’efficacité.

| Ce qui le cause | Ce qui ne le cause pas |
| Charge de travail, absence d’autonomie, manque de reconnaissance, conflits de valeurs | Une prétendue fragilité individuelle |

> Le déterminant le mieux documenté n’est pas la **quantité** de contraintes, mais le **sentiment de contrôle** : une forte exigence assortie d’une faible latitude de décision est la combinaison la plus délétère.

## Les leviers de résilience
| Levier | Ce qu’il produit |
| **Activité physique** régulière | Abaisse le cortisol de base, améliore le sommeil |
| **Sommeil** | Condition de la récupération de l’axe corticotrope |
| **Soutien social** | L’un des facteurs protecteurs les mieux établis |
| **Régulation émotionnelle** | Relaxation, respiration, pleine conscience : effets mesurables sur les marqueurs biologiques |
| **Prise en charge médicale** | Le stress chronique est un problème de santé, et il se traite |

## La logique d’ensemble
La réponse au stress est un système **régulé** : capteurs, messagers, effecteurs, boucle de retour. Comme toute régulation biologique, elle a un **domaine de fonctionnement** — efficace à l’intérieur, délétère au-delà.

Le corps humain n’est pas conçu pour un état d’alerte permanent.`,
          },
          questions: [
            ['Que devient le rétrocontrôle négatif en cas de stress chronique ?', ['Il se désensibilise et le cortisol reste durablement élevé', 'Il devient plus efficace', 'Il disparaît immédiatement', 'Il est remplacé par un rétrocontrôle positif'], 0, 'Les récepteurs au cortisol deviennent moins sensibles : le frein fonctionne mal.'],
            ['Quelle structure cérébrale est particulièrement vulnérable au cortisol chronique ?', ['L’hippocampe', 'Le cortex moteur', 'Le cervelet', 'Le bulbe rachidien'], 0, 'Riche en récepteurs au cortisol, il perd du volume, ce qui altère la mémoire.'],
            ['Un cortisol chroniquement élevé affaiblit les défenses immunitaires.', ['Vrai', 'Faux'], 0, 'Le cortisol est immunosuppresseur : infections plus fréquentes, cicatrisation retardée.'],
            ['Pourquoi l’atteinte de l’hippocampe aggrave-t-elle le stress chronique ?', ['Il participe au rétrocontrôle, que son atteinte affaiblit encore', 'Il produit l’adrénaline', 'Il contrôle la fréquence cardiaque', 'Il stocke le glycogène'], 0, 'C’est un cercle vicieux : le cortisol abîme ce qui devait le freiner.'],
            ['Quelle conséquence métabolique le stress chronique favorise-t-il ?', ['Une résistance à l’insuline, terrain du diabète de type 2', 'Une hypoglycémie permanente', 'Une baisse du stockage des graisses', 'Une hausse de la masse musculaire'], 0, 'Avec hyperglycémie chronique et stockage abdominal des graisses.'],
            ['Le burn-out s’explique uniquement par une fragilité individuelle.', ['Vrai', 'Faux'], 1, 'Les facteurs organisationnels — charge, autonomie, reconnaissance — sont déterminants.'],
            ['Quelle combinaison est la plus délétère au travail ?', ['Forte exigence et faible latitude de décision', 'Faible exigence et forte autonomie', 'Forte exigence et forte autonomie', 'Faible exigence et faible autonomie'], 0, 'Le sentiment de contrôle est le déterminant le mieux documenté.'],
            ['Quel levier de résilience abaisse le niveau de cortisol de base ?', ['L’activité physique régulière', 'La privation de sommeil', 'L’isolement social', 'L’augmentation de la charge de travail'], 0, 'Avec le sommeil, le soutien social et la régulation émotionnelle.'],
          ],
        },
      ],
    },
  ],
}
