// BIOLOGIE ET PHYSIOPATHOLOGIE HUMAINES — PREMIÈRE ST2S (voie technologique).
//
// Programme officiel : annexe 1 de l'arrêté du 17/01/2019, BO spécial n° 1 du
// 22 janvier 2019 (« Programme de biologie et physiopathologie humaines de
// première ST2S »). Cinq parties : Organisation et fonctionnement intégré de
// l'être humain · Appareil locomoteur et motricité · Appareil digestif et
// nutrition · Appareil cardio-vasculaire et circulation sanguine · Appareil
// respiratoire et échanges gazeux. Chaque fiche porte en `axe` la partie qui la
// coiffe.
//
// Matière NEUVE (slug `biologie-physiopathologie`), déclarée pour la seule
// classe « 1re techno » : le contenu est rangé au niveau '1re'.

export default {
  slug: 'biologie-physiopathologie',
  nom: 'Biologie et physiopathologie humaines',

  titreMigration: 'BIOLOGIE ET PHYSIOPATHOLOGIE HUMAINES 1re ST2S — le programme officiel (16 fiches)',

  motif: `La série ST2S n'avait aucun contenu de biologie et physiopathologie humaines.
Cette migration installe 15 fiches qui suivent les cinq parties du programme
officiel de première (BO spécial n° 1 du 22 janvier 2019) — organisation de
l'être humain, appareil locomoteur, appareil digestif et nutrition, appareil
cardio-vasculaire, appareil respiratoire — avec les pathologies au programme,
et une fiche méthode, 12 questions chacune.`,

  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 1,
      chapitres: [
        // ──────────────── ORGANISATION ET FONCTIONNEMENT INTÉGRÉ ────────────────
        {
          titre: 'Les niveaux d’organisation et le repérage anatomique',
          axe: 'Organisation et fonctionnement intégré de l’être humain',
          lecon: {
            titre: 'De l’appareil à la molécule',
            cours: `Pour comprendre une maladie, il faut savoir à quel niveau elle frappe : un organe, un tissu, une cellule, une molécule. L'organisme humain s'analyse comme un emboîtement de niveaux, et se repère dans l'espace avec un vocabulaire précis.

## Six niveaux emboîtés
| Le niveau | La définition | Exemple |
| **Appareil** ou système | Ensemble d'organes qui assurent une même fonction | Appareil digestif |
| **Organe** | Structure formée de plusieurs tissus, à fonction précise | Estomac |
| **Tissu** | Ensemble de cellules semblables et de leur matrice | Épithélium gastrique |
| **Cellule** | Unité de base du vivant | Cellule de la muqueuse gastrique |
| **Ultrastructure** | Organite visible au microscope électronique | Mitochondrie, noyau |
| **Molécule** | Assemblage d'atomes | Protéine, ADN, phospholipide |

## Chaque niveau a sa technique d'exploration
| La technique | Le niveau observé |
| **Imagerie médicale** (radiographie, scanner, IRM, échographie) | Appareil, organe |
| **Microscopie optique** | Tissu, cellule |
| **Microscopie électronique** | Ultrastructure |
| **Analyse biochimique** (bilan sanguin) | Molécule |

## S'orienter : les plans de coupe
Le corps est décrit en **position anatomique** : debout, face à l'observateur, paumes vers l'avant. Sur un cliché vu de face, la droite du patient est à gauche de l'image.

| La coupe | Le plan | Ce qu'elle sépare |
| **Sagittale** | Vertical, d'avant en arrière | La droite de la gauche |
| **Frontale** (coronale) | Vertical, parallèle au front | L'avant (antérieur) de l'arrière (postérieur) |
| **Transversale** (axiale) | Horizontal | Le haut (supérieur) du bas (inférieur) |

## Les cavités et leurs organes
| La cavité | Les principaux organes |
| **Crânienne** | Encéphale |
| **Rachidienne** (canal vertébral) | Moelle épinière |
| **Thoracique** | Cœur, poumons, trachée, œsophage |
| **Abdominale** | Estomac, foie, pancréas, rate, intestins, reins (en arrière) |
| **Pelvienne** | Vessie, rectum, utérus et ovaires ou prostate |

Le **diaphragme**, muscle en forme de dôme, sépare la cavité thoracique de la cavité abdominale.

## Des appareils interdépendants
Aucun appareil ne fonctionne seul. L'appareil digestif fournit les nutriments, l'appareil respiratoire le dioxygène ; l'appareil cardio-vasculaire les distribue à toutes les cellules et emporte leurs déchets vers les poumons (CO₂) et les reins (urée). Le système nerveux et le système hormonal transmettent l'**information** qui coordonne l'ensemble.

> Une atteinte d'un seul appareil retentit sur tous les autres : une insuffisance respiratoire prive de dioxygène le cœur, les muscles et le cerveau.

Racines utiles : **cyt(o)** = cellule (cytologie), **hist(o)** = tissu (histologie).`,
          },
          questions: [
            ['Quel est l’ordre correct des niveaux d’organisation, du plus grand au plus petit ?', ['Organe, appareil, tissu, cellule', 'Appareil, organe, tissu, cellule', 'Tissu, organe, cellule, appareil', 'Appareil, tissu, organe, molécule'], 1, 'L’appareil regroupe des organes, formés de tissus, eux-mêmes formés de cellules.'],
            ['Une mitochondrie appartient au niveau :', ['De l’organe', 'Du tissu', 'De l’ultrastructure cellulaire', 'De l’appareil'], 2, 'C’est un organite, visible en détail au microscope électronique.'],
            ['Quelle coupe sépare le corps en une partie droite et une partie gauche ?', ['Frontale', 'Transversale', 'Sagittale', 'Horizontale'], 2, 'Le plan sagittal est vertical, d’avant en arrière.'],
            ['Quelle coupe sépare le haut du bas du corps ?', ['Sagittale', 'Frontale', 'Transversale', 'Coronale'], 2, 'La coupe transversale (ou axiale) est horizontale, comme celles du scanner.'],
            ['Dans quelle cavité se trouve la moelle épinière ?', ['Crânienne', 'Rachidienne', 'Thoracique', 'Abdominale'], 1, 'Elle est logée dans le canal vertébral de la colonne.'],
            ['Quel muscle sépare les cavités thoracique et abdominale ?', ['Le psoas', 'Le diaphragme', 'Le grand pectoral', 'Le muscle cardiaque'], 1, 'C’est aussi le principal muscle inspiratoire.'],
            ['Quelle technique permet d’observer une molécule du sang comme le glucose ?', ['La radiographie', 'L’analyse biochimique', 'La microscopie optique', 'L’échographie'], 1, 'Le bilan sanguin dose les molécules : glycémie, cholestérol, urée.'],
            ['Que signifie la racine « hist(o) » ?', ['Cellule', 'Tissu', 'Os', 'Sang'], 1, 'L’histologie est l’étude des tissus ; la cytologie, celle des cellules.'],
            ['Sur un cliché de face, la droite du patient apparaît à gauche de l’image.', ['Vrai', 'Faux'], 0, 'On regarde le patient face à face, comme s’il était devant nous.'],
            ['Dans quelle cavité se situent la vessie et le rectum ?', ['Thoracique', 'Abdominale', 'Pelvienne', 'Crânienne'], 2, 'La cavité pelvienne est la partie basse, protégée par le bassin.'],
            ['Quel appareil distribue le dioxygène et les nutriments à toutes les cellules ?', ['L’appareil digestif', 'L’appareil respiratoire', 'L’appareil cardio-vasculaire', 'L’appareil locomoteur'], 2, 'Le sang, mis en mouvement par le cœur, relie tous les autres appareils.'],
            ['Les appareils de l’organisme fonctionnent indépendamment les uns des autres.', ['Vrai', 'Faux'], 1, 'Ils échangent matière et information : c’est le fonctionnement intégré de l’organisme.'],
          ],
        },
        {
          titre: 'Tissus, cellules et ultrastructures',
          axe: 'Organisation et fonctionnement intégré de l’être humain',
          lecon: {
            titre: 'Une structure adaptée à chaque fonction',
            cours: `Un globule rouge sans noyau, un neurone long d'un mètre, une cellule intestinale hérissée de microvillosités : partout dans le corps, la **structure** d'un tissu ou d'une cellule est adaptée à sa **fonction**.

## Quatre familles de tissus
Le corps compte quatre grands types de tissus : **épithélial**, **conjonctif**, **musculaire** et **nerveux**. Les deux premiers s'opposent point par point.

| Le critère | Tissu épithélial | Tissu conjonctif |
| Cellules | **Jointives**, serrées les unes contre les autres | **Dispersées** |
| Matrice extracellulaire | Presque absente | **Abondante** (fibres de collagène, d'élastine, substance fondamentale) |
| Vaisseaux sanguins | **Absents** : il est nourri par diffusion depuis le conjonctif | Présents |
| Support | Repose sur une **lame basale** | — |
| Fonctions | Revêtement (peau, muqueuses), sécrétion (glandes) | Soutien, nutrition, défense, réserve |

Le tissu conjonctif prend des formes variées : conjonctif lâche sous les épithéliums, tissu **adipeux** (réserve de graisses), **cartilage**, **os**, et même le **sang**, dont la matrice est liquide (le plasma).

Un épithélium se nomme selon le **nombre de couches** (simple ou stratifié) et la **forme** des cellules (pavimenteuses, cubiques, prismatiques). L'épiderme est pavimenteux stratifié : plusieurs couches, résistant aux frottements. L'épithélium intestinal est prismatique simple : une seule couche, qui facilite les échanges.

## Des cellules très diverses
| La cellule | Sa particularité | Sa fonction |
| **Hématie** (globule rouge) | Sans noyau, biconcave, pleine d'hémoglobine | Transport du dioxygène |
| **Neurone** | Prolongements très longs | Conduction du message nerveux |
| **Fibre musculaire striée** | Très longue, plusieurs noyaux | Contraction |
| **Entérocyte** | Microvillosités au pôle apical | Absorption des nutriments |

## Les ultrastructures et leur rôle
| L'ultrastructure | Son rôle principal |
| **Membrane plasmique** | Délimite la cellule, contrôle les échanges |
| **Noyau** | Contient l'ADN, l'information génétique |
| **Ribosomes** | Synthèse des protéines |
| **Réticulum endoplasmique rugueux** | Synthèse et transport des protéines (ribosomes fixés) |
| **Réticulum endoplasmique lisse** | Synthèse des lipides |
| **Appareil de Golgi** | Maturation, tri et sécrétion des protéines |
| **Mitochondrie** | **Respiration cellulaire**, production d'ATP |
| **Lysosome** | Digestion intracellulaire |
| **Cytosquelette** | Forme de la cellule, mouvements |

## Les molécules de l'organisation
La membrane plasmique est une **bicouche de phospholipides** dans laquelle sont insérées des **protéines** et du cholestérol, avec des glucides en surface. Le noyau contient l'**ADN** associé à des protéines. Les ribosomes sont faits d'ARN et de protéines.

> Une cellule qui sécrète beaucoup de protéines (cellule pancréatique) est riche en réticulum rugueux et en Golgi ; une cellule qui consomme beaucoup d'énergie (fibre musculaire) est riche en mitochondries.`,
          },
          questions: [
            ['Qu’est-ce qui caractérise un tissu épithélial ?', ['Des cellules dispersées dans une matrice abondante', 'Des cellules jointives reposant sur une lame basale, sans vaisseaux', 'Des cellules contractiles', 'Une matrice liquide'], 1, 'Il est nourri par diffusion à partir du tissu conjonctif sous-jacent.'],
            ['Lequel de ces tissus est un tissu conjonctif ?', ['L’épiderme', 'Le tissu adipeux', 'L’épithélium intestinal', 'Le revêtement de la bouche'], 1, 'Cellules dispersées dans une matrice : c’est un conjonctif spécialisé dans la réserve.'],
            ['Quel organite est le siège de la respiration cellulaire ?', ['Le noyau', 'La mitochondrie', 'L’appareil de Golgi', 'Le lysosome'], 1, 'Elle y produit l’essentiel de l’ATP de la cellule.'],
            ['Où est stockée l’information génétique ?', ['Dans les ribosomes', 'Dans le noyau', 'Dans la membrane', 'Dans les lysosomes'], 1, 'L’ADN du noyau porte les gènes.'],
            ['Quel est le rôle de l’appareil de Golgi ?', ['Produire de l’ATP', 'Maturation, tri et sécrétion des protéines', 'Digérer les déchets', 'Copier l’ADN'], 1, 'Il reçoit les protéines du réticulum rugueux et les expédie.'],
            ['Un épithélium formé de plusieurs couches de cellules est dit :', ['Simple', 'Stratifié', 'Glandulaire', 'Conjonctif'], 1, 'L’épiderme, pavimenteux stratifié, résiste aux frottements.'],
            ['Le sang est considéré comme un tissu conjonctif à matrice liquide.', ['Vrai', 'Faux'], 0, 'Ses cellules sont dispersées dans le plasma, qui tient lieu de matrice.'],
            ['Quelle particularité de l’entérocyte favorise l’absorption ?', ['L’absence de noyau', 'Les microvillosités de son pôle apical', 'Sa forme en étoile', 'Ses nombreux lysosomes'], 1, 'Elles multiplient la surface d’échange avec le contenu intestinal.'],
            ['Quelles molécules forment la trame de la membrane plasmique ?', ['Des acides nucléiques', 'Une bicouche de phospholipides', 'Des glucides seuls', 'Du collagène'], 1, 'Des protéines et du cholestérol y sont insérés.'],
            ['Une cellule qui sécrète beaucoup de protéines est riche en :', ['Réticulum endoplasmique rugueux et appareil de Golgi', 'Gouttelettes lipidiques', 'Cils', 'Lysosomes uniquement'], 0, 'Ribosomes du réticulum rugueux pour produire, Golgi pour sécréter.'],
            ['Quelle cellule ne possède pas de noyau à maturité ?', ['Le neurone', 'L’hématie', 'L’entérocyte', 'La fibre musculaire'], 1, 'Le globule rouge perd son noyau et se remplit d’hémoglobine.'],
            ['Le tissu épithélial est richement vascularisé.', ['Vrai', 'Faux'], 1, 'Il ne contient pas de vaisseaux : c’est le conjonctif voisin qui le nourrit.'],
          ],
        },
        // ──────────────────────── APPAREIL LOCOMOTEUR ────────────────────────
        {
          titre: 'Le squelette, les articulations et leur imagerie',
          axe: 'Appareil locomoteur et motricité',
          lecon: {
            titre: 'La charpente du mouvement',
            cours: `Le mouvement naît de l'association d'os, d'articulations, de muscles et de nerfs. La charpente, c'est le squelette ; les images qui la montrent sont parmi les plus prescrites en médecine.

## L'organisation du squelette
Le squelette adulte compte environ **206 os**, répartis en deux ensembles.

| L'ensemble | Ce qu'il comprend |
| **Squelette axial** | Crâne, **colonne vertébrale** (7 vertèbres cervicales, 12 thoraciques, 5 lombaires, sacrum, coccyx), 12 paires de côtes, sternum |
| **Squelette appendiculaire** | **Ceinture scapulaire** (clavicule, scapula) et membres supérieurs (humérus, radius, ulna, os de la main) ; **ceinture pelvienne** (os coxaux) et membres inférieurs (fémur, patella, tibia, fibula, os du pied) |

Le squelette soutient le corps, protège les organes (crâne, cage thoracique), sert de levier aux muscles, stocke le calcium et produit les cellules sanguines dans la **moelle osseuse rouge**.

## L'articulation mobile
Une articulation mobile (synoviale), comme le genou ou la hanche, est construite ainsi :

| L'élément | Son rôle |
| **Cartilage articulaire** | Recouvre les extrémités osseuses, amortit et fait glisser |
| **Capsule articulaire** | Manchon fibreux qui enferme l'articulation |
| **Membrane synoviale** | Tapisse la capsule et sécrète le liquide synovial |
| **Liquide synovial** | Lubrifie et nourrit le cartilage |
| **Ligaments** | Relient les os entre eux et stabilisent |

Les **tendons**, eux, relient les **muscles aux os**.

## Trois techniques d'imagerie
| La technique | Le principe | Ses intérêts | Ses limites |
| **Radiographie** | Des **rayons X** traversent le corps et sont plus ou moins absorbés : l'os, très absorbant, apparaît **blanc** | Simple, rapide, peu coûteuse : fractures, arthrose, déformations | Rayons **ionisants** ; image plane où les structures se superposent ; contre-indiquée en principe chez la femme enceinte |
| **Scanographie** (TDM) | Un tube à rayons X tourne autour du patient ; l'ordinateur reconstruit des **coupes** et des images en 3D | Détail fin, pas de superposition ; fractures complexes, traumatismes | Dose de rayons X plus élevée qu'une radiographie |
| **IRM** | Un **champ magnétique** intense et des **ondes de radiofréquence** font émettre un signal aux noyaux d'hydrogène des tissus | Excellente pour les **tissus mous** (moelle, encéphale, ligaments, ménisques), **aucun rayonnement ionisant** | Contre-indiquée avec certains objets métalliques ou dispositifs (certains pacemakers, éclats métalliques) ; examen long et bruyant |

> Radiographie et scanner montrent bien l'os ; l'IRM montre ce que les rayons X voient mal : les tissus mous.

## Le vocabulaire médical
| La racine | Le sens |
| **osté(o)** | Os |
| **arthr(o)** | Articulation |
| **chondr(o)** | Cartilage |
| **cost(o)** | Côte |
| **cox(o)** | Hanche |
| **gon(o)** | Genou |
| **rachi, rachid(o)** | Colonne vertébrale |
| **tendin(o)** | Tendon |

Exemples : **arthrose** (usure du cartilage articulaire), **coxarthrose** (arthrose de la hanche), **gonarthrose** (du genou), **ostéoporose** (fragilisation de l'os).`,
          },
          questions: [
            ['Combien de vertèbres cervicales compte la colonne vertébrale ?', ['5', '7', '12', '33'], 1, 'Sept cervicales, douze thoraciques et cinq lombaires, puis le sacrum et le coccyx.'],
            ['Quel os appartient au squelette axial ?', ['Le fémur', 'La clavicule', 'Le sternum', 'L’humérus'], 2, 'Le squelette axial comprend crâne, colonne, côtes et sternum.'],
            ['Quel est le rôle du liquide synovial ?', ['Relier les muscles aux os', 'Lubrifier l’articulation et nourrir le cartilage', 'Produire les globules rouges', 'Contracter l’articulation'], 1, 'Il est sécrété par la membrane synoviale.'],
            ['Qu’est-ce qui relie un muscle à un os ?', ['Un ligament', 'Un tendon', 'Une capsule', 'Un cartilage'], 1, 'Les ligaments, eux, relient les os entre eux.'],
            ['Pourquoi l’os apparaît-il blanc sur une radiographie ?', ['Parce qu’il émet de la lumière', 'Parce qu’il absorbe fortement les rayons X', 'Parce qu’il réfléchit les ultrasons', 'Parce qu’il contient de l’eau'], 1, 'Les rayons X arrêtés par l’os n’atteignent pas le détecteur.'],
            ['Quelle technique d’imagerie n’utilise pas de rayonnement ionisant ?', ['La radiographie', 'Le scanner', 'L’IRM', 'L’angiographie'], 2, 'Elle repose sur un champ magnétique et des ondes de radiofréquence.'],
            ['Quel avantage le scanner a-t-il sur la radiographie ?', ['Il n’irradie pas', 'Il donne des coupes sans superposition des structures', 'Il est moins cher', 'Il ne nécessite aucun appareil'], 1, 'L’ordinateur reconstruit des coupes et des images en trois dimensions.'],
            ['Quel examen est le plus adapté pour explorer un ligament du genou ?', ['La radiographie', 'L’IRM', 'Le bilan sanguin', 'La spirométrie'], 1, 'Les tissus mous sont mal vus par les rayons X, très bien par l’IRM.'],
            ['Que signifie « gonarthrose » ?', ['Une fracture de la hanche', 'Une arthrose du genou', 'Une inflammation d’un tendon', 'Une fragilité osseuse généralisée'], 1, 'gon(o) = genou, arthr(o) = articulation, -ose = affection non inflammatoire.'],
            ['Un porteur d’éclats métalliques peut passer une IRM sans précaution.', ['Vrai', 'Faux'], 1, 'Le champ magnétique intense peut déplacer ou chauffer un objet métallique : c’est une contre-indication.'],
            ['Où sont produites les cellules sanguines ?', ['Dans le cartilage', 'Dans la moelle osseuse rouge', 'Dans le liquide synovial', 'Dans les ligaments'], 1, 'La moelle osseuse rouge est logée dans l’os spongieux.'],
            ['Quels os forment la ceinture scapulaire ?', ['Les os coxaux', 'La clavicule et la scapula', 'Le radius et l’ulna', 'Le tibia et la fibula'], 1, 'Elle rattache les membres supérieurs au tronc.'],
          ],
        },
        {
          titre: 'Le système nerveux et le message nerveux',
          axe: 'Appareil locomoteur et motricité',
          lecon: {
            titre: 'Du neurone au nerf : l’influx nerveux',
            cours: `Aucun mouvement volontaire sans commande nerveuse. L'ordre part de l'encéphale, descend dans la moelle épinière et atteint le muscle par un nerf, sous la forme d'un signal électrique : l'**influx nerveux**.

## Deux grandes parties
| La partie | Ses éléments |
| **Système nerveux central** (SNC) | **Encéphale** (cerveau, cervelet, tronc cérébral), dans le crâne ; **moelle épinière**, dans le canal vertébral |
| **Système nerveux périphérique** (SNP) | **Nerfs crâniens** (12 paires) et **nerfs rachidiens** (31 paires), ganglions |

Le SNC intègre et commande ; le SNP relie le SNC aux organes : les fibres **sensitives** apportent l'information au SNC, les fibres **motrices** portent les ordres aux muscles.

## Le neurone
| L'élément | Son rôle |
| **Corps cellulaire** | Contient le noyau |
| **Dendrites** | Courts prolongements qui reçoivent les messages |
| **Axone** | Long prolongement unique qui conduit l'influx vers la terminaison |
| **Gaine de myéline** | Manchon isolant autour de l'axone, interrompu par les **nœuds de Ranvier** |
| **Arborisation terminale**, boutons synaptiques | Transmettent le message à la cellule suivante |

Pour schématiser un neurone : l'influx va des dendrites vers le corps cellulaire, puis le long de l'axone jusqu'aux terminaisons.

## Le nerf
Un **nerf** est un faisceau de nombreuses **fibres nerveuses** (axones) regroupées en **fascicules**. Chaque fibre est entourée d'une fine enveloppe conjonctive (endonèvre), chaque fascicule d'une gaine (périnèvre), et le nerf entier d'une enveloppe externe (épinèvre) avec ses vaisseaux sanguins.

## Le potentiel de repos et le potentiel d'action
Au repos, l'intérieur de la fibre est **négatif** par rapport à l'extérieur : c'est le **potentiel de repos**, d'environ **− 70 mV**.

Stimulée au-delà d'un **seuil**, la fibre répond par un **potentiel d'action** (PA) : une brève inversion de la polarité (jusqu'à environ + 30 mV), en 1 à 2 ms.

| La phase | Ce qui se passe |
| **Dépolarisation** | Le potentiel monte jusqu'à devenir positif |
| **Repolarisation** | Il redescend |
| **Hyperpolarisation** | Il passe brièvement sous le potentiel de repos, puis y revient |

Propriétés du PA d'une fibre :
1. Il obéit à la loi du **tout ou rien** : sous le seuil, pas de PA ; au-dessus, un PA d'amplitude constante.
2. L'intensité de la stimulation est codée par la **fréquence** des PA, pas par leur amplitude.
3. Il se **propage** sans s'affaiblir. Sur une fibre myélinisée, il saute d'un nœud de Ranvier à l'autre : la conduction est plus **rapide**.

Dans un **nerf**, qui contient des fibres de seuils différents, l'amplitude de la réponse globale **augmente** avec l'intensité de stimulation, par **recrutement** de fibres, jusqu'à un maximum quand toutes répondent.

Racines : **neur(o)**, **névr(o)** = nerf ; **médull(o)**, **myél(o)** = moelle ; **cérébr(o)** = cerveau.`,
          },
          questions: [
            ['Quels organes forment le système nerveux central ?', ['Les nerfs crâniens et rachidiens', 'L’encéphale et la moelle épinière', 'Les ganglions et les nerfs', 'Le cœur et le cerveau'], 1, 'Le SNC intègre les informations et élabore les commandes.'],
            ['Quel prolongement du neurone conduit l’influx vers les terminaisons ?', ['La dendrite', 'L’axone', 'Le noyau', 'La synapse'], 1, 'Chaque neurone n’a qu’un axone ; les dendrites reçoivent les messages.'],
            ['Quelle est la valeur approximative du potentiel de repos d’une fibre nerveuse ?', ['+ 30 mV', '0 mV', '− 70 mV', '− 200 mV'], 2, 'L’intérieur de la fibre est négatif par rapport à l’extérieur.'],
            ['Comment l’intensité d’une stimulation est-elle codée sur une fibre nerveuse ?', ['Par l’amplitude des potentiels d’action', 'Par la fréquence des potentiels d’action', 'Par la durée du potentiel de repos', 'Par la vitesse de la fibre'], 1, 'Le PA d’une fibre a une amplitude constante : seule sa fréquence varie.'],
            ['Que signifie la loi du « tout ou rien » ?', ['Une fibre répond toujours, quelle que soit la stimulation', 'Sous le seuil, pas de PA ; au-dessus, un PA d’amplitude constante', 'L’amplitude du PA augmente avec la stimulation', 'Le nerf ne répond qu’une fois'], 1, 'Elle s’applique à une fibre isolée, pas au nerf entier.'],
            ['Pourquoi la réponse d’un nerf augmente-t-elle avec l’intensité de la stimulation ?', ['Chaque fibre produit des PA plus grands', 'De plus en plus de fibres, de seuils différents, sont recrutées', 'La myéline s’épaissit', 'Le potentiel de repos diminue'], 1, 'Quand toutes les fibres répondent, la réponse atteint son maximum.'],
            ['Quel est le rôle de la gaine de myéline ?', ['Produire l’influx', 'Accélérer la conduction de l’influx', 'Nourrir le corps cellulaire', 'Relier deux os'], 1, 'L’influx saute d’un nœud de Ranvier à l’autre : c’est la conduction saltatoire.'],
            ['Combien de paires de nerfs rachidiens compte l’être humain ?', ['12', '24', '31', '206'], 2, 'Ils naissent de la moelle épinière ; les nerfs crâniens, eux, sont 12 paires.'],
            ['Pendant la dépolarisation, l’intérieur de la fibre devient momentanément positif.', ['Vrai', 'Faux'], 0, 'Le potentiel passe d’environ − 70 mV à environ + 30 mV.'],
            ['Un nerf est formé :', ['D’un seul neurone', 'De nombreuses fibres nerveuses regroupées en fascicules', 'De cellules musculaires', 'De moelle épinière'], 1, 'Chaque fascicule est entouré de périnèvre, le nerf entier d’épinèvre.'],
            ['Que désigne la racine « myél(o) » ?', ['Le muscle', 'La moelle', 'Le cerveau', 'Le nerf'], 1, 'La myélite est une inflammation de la moelle épinière.'],
            ['Les fibres motrices apportent au SNC les informations des organes des sens.', ['Vrai', 'Faux'], 1, 'Ce sont les fibres sensitives ; les motrices portent les ordres vers les muscles.'],
          ],
        },
        {
          titre: 'Le muscle strié squelettique et sa contraction',
          axe: 'Appareil locomoteur et motricité',
          lecon: {
            titre: 'Du muscle au sarcomère',
            cours: `Plier le bras, marcher, parler : chaque mouvement volontaire est le raccourcissement d'un muscle strié squelettique, commandé par un nerf. Le secret de ce raccourcissement se trouve à l'échelle du millième de millimètre.

## Une organisation hiérarchisée
~ Muscle → faisceaux → fibres musculaires → myofibrilles → sarcomères → myofilaments

| Le niveau | Sa description |
| **Muscle** | Entouré d'une enveloppe conjonctive, prolongé par les tendons |
| **Faisceau** | Groupe de fibres |
| **Fibre musculaire** | Cellule géante, très longue, à **plusieurs noyaux** ; sa membrane est le sarcolemme |
| **Myofibrille** | Structure contractile qui remplit la fibre, montrant une alternance de bandes claires et sombres : la **striation** |
| **Sarcomère** | Unité contractile, délimitée par deux **stries Z** |
| **Myofilaments** | Filaments fins d'**actine**, filaments épais de **myosine** |

## Le sarcomère
| La zone | Ce qu'elle contient |
| **Bande I** (claire) | Seulement des filaments d'actine ; coupée en son milieu par la strie Z |
| **Bande A** (sombre) | Toute la longueur des filaments de myosine, chevauchés par l'actine |
| **Zone H** | Centre de la bande A, où il n'y a que de la myosine |

## Le glissement des myofilaments
Lors de la contraction, les têtes de **myosine** s'accrochent à l'**actine** et la tirent vers le centre du sarcomère : les filaments **glissent** les uns sur les autres, sans changer de longueur.

| Au cours de la contraction | La longueur… |
| Sarcomère | **Diminue** |
| Bande I et zone H | **Diminuent** |
| Bande A | **Reste constante** |

Ce glissement consomme de l'**ATP** et nécessite des ions **calcium** Ca²⁺, libérés dans la fibre quand elle est excitée. La fibre musculaire est riche en **mitochondries**, qui produisent l'ATP.

## La jonction neuromusculaire
Le motoneurone et la fibre musculaire communiquent par une synapse particulière, la **jonction neuromusculaire** (ou plaque motrice).

1. Un potentiel d'action arrive à la terminaison de l'axone.
2. Des vésicules libèrent un **neurotransmetteur**, l'**acétylcholine**, dans la fente synaptique (exocytose).
3. L'acétylcholine se fixe sur des **récepteurs** de la membrane de la fibre musculaire.
4. Cette fixation déclenche un potentiel d'action **musculaire**, qui provoque la libération du calcium et la contraction.
5. L'acétylcholine est rapidement dégradée par une enzyme, l'acétylcholinestérase : la commande s'arrête.

> Le message électrique devient chimique dans la fente, puis redevient électrique sur la fibre.

Racines : **my(o)** = muscle (myopathie, myalgie), **tendin(o)** = tendon (tendinite).`,
          },
          questions: [
            ['Qu’est-ce qu’un sarcomère ?', ['Un faisceau de fibres', 'L’unité contractile délimitée par deux stries Z', 'Une cellule nerveuse', 'L’enveloppe du muscle'], 1, 'C’est la plus petite unité capable de se contracter.'],
            ['Quelles protéines forment les myofilaments ?', ['L’hémoglobine et la myoglobine', 'L’actine et la myosine', 'Le collagène et l’élastine', 'L’insuline et le glucagon'], 1, 'L’actine forme les filaments fins, la myosine les filaments épais.'],
            ['Au cours de la contraction, quelle zone garde la même longueur ?', ['La bande I', 'La zone H', 'La bande A', 'Le sarcomère'], 2, 'La bande A correspond à la longueur des filaments de myosine, qui ne raccourcissent pas.'],
            ['Pendant la contraction, les myofilaments raccourcissent.', ['Vrai', 'Faux'], 1, 'Ils glissent les uns sur les autres sans changer de longueur ; c’est le sarcomère qui raccourcit.'],
            ['Quel neurotransmetteur agit à la jonction neuromusculaire ?', ['La dopamine', 'L’acétylcholine', 'L’adrénaline', 'La sérotonine'], 1, 'Libérée par le motoneurone, elle se fixe sur les récepteurs de la fibre musculaire.'],
            ['Quels éléments sont nécessaires au glissement des myofilaments ?', ['L’ATP et les ions calcium', 'Le glucose et l’insuline', 'Le dioxygène seul', 'Les ions chlorure'], 0, 'L’ATP fournit l’énergie, le calcium autorise l’accrochage de la myosine à l’actine.'],
            ['Combien de noyaux possède une fibre musculaire striée squelettique ?', ['Aucun', 'Un seul', 'Plusieurs', 'Deux exactement'], 2, 'C’est une cellule géante plurinucléée.'],
            ['Quelle zone du sarcomère ne contient que des filaments d’actine ?', ['La bande A', 'La bande I', 'La zone H', 'La strie M'], 1, 'La bande I, claire, est traversée en son milieu par la strie Z.'],
            ['Quel est le rôle de l’acétylcholinestérase ?', ['Produire l’acétylcholine', 'Dégrader l’acétylcholine pour arrêter la commande', 'Fixer le calcium', 'Fabriquer de l’ATP'], 1, 'Sans elle, le muscle resterait stimulé.'],
            ['Dans quel ordre se succèdent ces niveaux, du plus grand au plus petit ?', ['Fibre, muscle, myofibrille, sarcomère', 'Muscle, faisceau, fibre, myofibrille', 'Myofibrille, fibre, faisceau, muscle', 'Sarcomère, myofibrille, fibre, muscle'], 1, 'Le muscle contient des faisceaux de fibres, remplies de myofibrilles.'],
            ['Que signifie « myalgie » ?', ['Une douleur musculaire', 'Une inflammation du tendon', 'Une paralysie', 'Une fracture'], 0, 'my(o) = muscle, -algie = douleur.'],
            ['Pourquoi les fibres musculaires sont-elles riches en mitochondries ?', ['Pour stocker le calcium', 'Pour produire l’ATP nécessaire à la contraction', 'Pour fabriquer l’acétylcholine', 'Pour former les stries Z'], 1, 'La contraction consomme beaucoup d’énergie.'],
          ],
        },
        {
          titre: 'Lésions de la moelle épinière et accident vasculaire cérébral',
          axe: 'Appareil locomoteur et motricité',
          lecon: {
            titre: 'Quand le système nerveux central est atteint',
            cours: `Un accident de la route peut sectionner la moelle épinière ; un caillot peut boucher une artère du cerveau. Dans les deux cas, la commande nerveuse est interrompue, et la **localisation** de la lésion décide des conséquences.

## La lésion de la moelle épinière
La moelle conduit les ordres moteurs de l'encéphale vers les muscles et les informations sensitives du corps vers l'encéphale. Une lésion **interrompt** ces voies **sous** son niveau.

| Le niveau de la lésion | La conséquence |
| **Cervical** (cou) | **Tétraplégie** : paralysie des quatre membres ; si la lésion est très haute, la respiration est touchée |
| **Thoracique** ou **lombaire** | **Paraplégie** : paralysie des deux membres inférieurs |

| La gravité | La conséquence |
| **Lésion complète** | Perte totale de la motricité et de la sensibilité sous la lésion |
| **Lésion incomplète** | Perte partielle, récupération possible |

Signes associés : troubles de la sensibilité (**paresthésies** : fourmillements, engourdissements), troubles urinaires, digestifs et sexuels.

- **Signes paracliniques** : l'IRM montre la moelle et la lésion ; le scanner montre les fractures vertébrales.
- **Facteurs de risque** : accidents de la route, chutes, plongeons en eau peu profonde, sports à risque.
- **Prise en charge** : immobilisation du rachis dès le ramassage (ne pas déplacer la victime), chirurgie de stabilisation, puis **rééducation** longue.

## L'accident vasculaire cérébral (AVC)
Un AVC est l'arrêt brutal de la circulation du sang dans une partie de l'encéphale : les neurones privés de dioxygène meurent en quelques minutes.

| Le type | Le mécanisme | Sa fréquence |
| **AVC ischémique** (infarctus cérébral) | Une artère est **bouchée** par un caillot | Environ 80 % |
| **AVC hémorragique** | Une artère se **rompt** et le sang se répand | Environ 20 % |

Les conséquences dépendent de la **zone** touchée. Chaque hémisphère commande la moitié **opposée** du corps : une lésion de l'hémisphère gauche provoque une **hémiplégie droite**. Chez la plupart des droitiers, le langage dépend de l'hémisphère gauche : son atteinte provoque une **aphasie** (trouble du langage). D'autres zones touchées entraînent des troubles de la mémoire (**amnésie**), de la vision ou de l'équilibre.

> Visage paralysé, bras qui retombe, parole troublée : c'est peut-être un AVC. Appeler le 15 immédiatement.

- **Diagnostic** : l'IRM ou le scanner cérébral, en urgence, distinguent l'AVC ischémique de l'hémorragique.
- **Traitement de l'AVC ischémique** : dissoudre le caillot (**thrombolyse**) ou le retirer (**thrombectomie**), dans les toutes premières heures.
- **Facteurs de risque** : **hypertension artérielle** (le premier), tabac, diabète, excès de cholestérol, fibrillation atriale, alcool, sédentarité, âge.

## Le vocabulaire
| Le terme | Le sens |
| **Paraplégie** | Paralysie des deux membres inférieurs |
| **Tétraplégie** | Paralysie des quatre membres |
| **Aphasie** | Trouble du langage |
| **Amnésie** | Perte de mémoire |
| **Paresthésie** | Sensation anormale (fourmillements) |`,
          },
          questions: [
            ['Une lésion de la moelle épinière au niveau cervical provoque en général :', ['Une paraplégie', 'Une tétraplégie', 'Une aphasie', 'Aucun trouble moteur'], 1, 'La lésion interrompt les voies destinées aux quatre membres.'],
            ['Qu’est-ce qu’une paraplégie ?', ['La paralysie des quatre membres', 'La paralysie des deux membres inférieurs', 'La perte de la parole', 'La perte de la mémoire'], 1, 'Elle résulte d’une lésion thoracique ou lombaire de la moelle.'],
            ['Quelle est la cause d’un AVC ischémique ?', ['La rupture d’une artère cérébrale', 'L’obstruction d’une artère cérébrale par un caillot', 'Une infection du cerveau', 'Une fracture du crâne'], 1, 'C’est la forme la plus fréquente, environ 80 % des AVC.'],
            ['Une lésion de l’hémisphère cérébral gauche entraîne une paralysie :', ['Du côté gauche du corps', 'Du côté droit du corps', 'Des deux côtés', 'Des yeux seulement'], 1, 'Les voies motrices se croisent : chaque hémisphère commande le côté opposé.'],
            ['Que désigne l’aphasie ?', ['Une paralysie d’un membre', 'Un trouble du langage', 'Une perte de mémoire', 'Un fourmillement'], 1, 'Elle survient souvent après une atteinte de l’hémisphère gauche.'],
            ['Quel est le premier facteur de risque de l’AVC ?', ['L’hypertension artérielle', 'La myopie', 'L’asthme', 'L’anémie'], 0, 'Elle fragilise les artères et favorise leur obstruction comme leur rupture.'],
            ['Quel examen distingue en urgence un AVC ischémique d’un AVC hémorragique ?', ['L’électrocardiogramme', 'L’imagerie cérébrale (IRM ou scanner)', 'La spirométrie', 'La fibroscopie'], 1, 'Le traitement est opposé : on ne dissout pas un caillot en cas d’hémorragie.'],
            ['Que signifie « paresthésie » ?', ['Une sensation anormale comme des fourmillements', 'Une paralysie totale', 'Une douleur thoracique', 'Une perte de mémoire'], 0, 'C’est un trouble de la sensibilité fréquent dans les lésions nerveuses.'],
            ['Face à une victime d’accident suspecte de lésion de la moelle, il faut la déplacer rapidement.', ['Vrai', 'Faux'], 1, 'On immobilise le rachis : un déplacement peut aggraver la lésion.'],
            ['Dans une lésion complète de la moelle, la motricité et la sensibilité sous la lésion sont :', ['Conservées', 'Totalement perdues', 'Augmentées', 'Perdues au-dessus seulement'], 1, 'Une lésion incomplète laisse une perte partielle et un espoir de récupération.'],
            ['Pourquoi l’AVC est-il une urgence absolue ?', ['Parce qu’il est contagieux', 'Parce que les neurones privés de dioxygène meurent en quelques minutes', 'Parce qu’il provoque toujours une fièvre', 'Parce qu’il ne se soigne qu’à l’hôpital de jour'], 1, 'La thrombolyse ou la thrombectomie ne sont possibles que dans les premières heures.'],
            ['L’AVC hémorragique est plus fréquent que l’AVC ischémique.', ['Vrai', 'Faux'], 1, 'L’AVC ischémique représente environ 80 % des cas.'],
          ],
        },
        // ────────────────────── APPAREIL DIGESTIF ET NUTRITION ──────────────────────
        {
          titre: 'Aliments, nutriments et équilibre alimentaire',
          axe: 'Appareil digestif et nutrition',
          lecon: {
            titre: 'Couvrir ses besoins, ni plus ni moins',
            cours: `On mange des **aliments** ; l'organisme utilise des **nutriments**. Entre les deux, la digestion. Et l'équilibre alimentaire consiste à apporter chaque nutriment en quantité suffisante, sans excès.

## Aliments et nutriments
Un **aliment** est une denrée consommée (pain, lait, pomme). Un **nutriment** est une molécule directement utilisable par l'organisme, obtenue après digestion ou absorbée telle quelle (glucose, acides aminés, eau, ions).

| La catégorie | Les nutriments | Nature |
| **Macronutriments** (besoins de l'ordre de la dizaine ou centaine de grammes par jour) | Glucides, lipides, protides | Organiques |
| **Micronutriments** (besoins en milligrammes ou microgrammes) | Vitamines, minéraux, oligo-éléments | Organiques (vitamines) ou minéraux |

L'**eau** représente environ 60 % de la masse du corps adulte : solvant, milieu des réactions, transport, régulation de la température. On en perd chaque jour 2 à 2,5 L, qu'il faut remplacer.

## Trois rôles
| Le rôle | Les nutriments principaux |
| **Énergétique** | Glucides et lipides (et protides en appoint) |
| **Structural** (construction) | Protéines, lipides des membranes, calcium et phosphore des os |
| **Fonctionnel** (régulation) | Vitamines, oligo-éléments (fer, iode, zinc), certaines protéines (enzymes, hormones) |

## Monomères, dimères, polymères
| La taille | Exemples |
| **Monomère** | Glucose, acide aminé, acide gras |
| **Dimère** | Saccharose, lactose, maltose |
| **Polymère** | Amidon, glycogène, protéines |

Seuls les monomères (et l'eau, les ions, les vitamines) traversent la paroi intestinale : les polymères doivent être digérés.

## Les besoins
Les besoins sont **quantitatifs** (combien d'énergie) et **qualitatifs** (quels nutriments : acides aminés et acides gras **indispensables**, vitamines, minéraux).

Ils varient selon l'**âge**, le **sexe**, l'**activité physique**, la **croissance**, la **grossesse** ou l'allaitement, le climat.

Pour un adulte, les apports énergétiques se répartissent en ordre de grandeur ainsi : glucides 40 à 55 %, lipides 35 à 40 %, protéines 10 à 20 %.

Le **bilan énergétique** compare les apports (ce qui est mangé) aux dépenses (métabolisme de base, activité, thermorégulation). Positif et durable : prise de poids. Négatif : amaigrissement.

## L'indice de masse corporelle
> IMC = masse (kg) / taille² (m²)

| L'IMC de l'adulte | L'interprétation |
| Moins de 18,5 | Maigreur |
| De 18,5 à moins de 25 | Corpulence normale |
| De 25 à moins de 30 | Surpoids |
| 30 et plus | Obésité |

Exemple : 81 kg pour 1,80 m. IMC = 81 / (1,80 × 1,80) = 81 / 3,24 = 25 : c'est la limite du surpoids.

> Chez l'enfant et l'adolescent, l'IMC s'interprète sur des **courbes de corpulence** selon l'âge et le sexe, pas avec ces seuils.`,
          },
          questions: [
            ['Quelle est la différence entre un aliment et un nutriment ?', ['Il n’y en a aucune', 'L’aliment est la denrée consommée, le nutriment la molécule utilisable par l’organisme', 'Le nutriment est toujours d’origine animale', 'L’aliment est une molécule, le nutriment un repas'], 1, 'La digestion transforme les aliments en nutriments.'],
            ['Lequel est un micronutriment ?', ['Les glucides', 'Les lipides', 'La vitamine C', 'Les protides'], 2, 'Vitamines et minéraux sont nécessaires en très petites quantités.'],
            ['Quel est le rôle principal des protéines ?', ['Énergétique', 'Structural (construction)', 'Uniquement fonctionnel', 'Aucun'], 1, 'Elles construisent et renouvellent les tissus, même si certaines ont aussi un rôle fonctionnel.'],
            ['Lequel de ces glucides est un polymère ?', ['Le glucose', 'Le saccharose', 'L’amidon', 'Le fructose'], 2, 'L’amidon est une longue chaîne de glucoses ; le saccharose est un dimère.'],
            ['Quelle part de la masse corporelle l’eau représente-t-elle environ chez l’adulte ?', ['10 %', '30 %', '60 %', '95 %'], 2, 'Elle est le solvant de toutes les réactions de l’organisme.'],
            ['Comment calcule-t-on l’IMC ?', ['Masse × taille', 'Masse / taille²', 'Taille / masse', 'Masse / âge'], 1, 'Masse en kilogrammes, taille en mètres.'],
            ['Une personne de 64 kg mesure 1,60 m. Quel est son IMC ?', ['25', '40', '20', '16'], 0, 'IMC = 64 / (1,60 × 1,60) = 64 / 2,56 = 25.'],
            ['À partir de quel IMC parle-t-on d’obésité chez l’adulte ?', ['18,5', '25', '30', '40'], 2, 'Entre 25 et 30, on parle de surpoids.'],
            ['Un bilan énergétique durablement positif entraîne :', ['Un amaigrissement', 'Une prise de poids', 'Aucun changement', 'Une carence en fer'], 1, 'Les apports dépassent les dépenses : l’excédent est stocké, surtout en graisses.'],
            ['Les besoins nutritionnels d’une adolescente en croissance sont les mêmes que ceux d’une femme âgée sédentaire.', ['Vrai', 'Faux'], 1, 'Âge, croissance et activité physique modifient les besoins.'],
            ['Qu’est-ce qu’un besoin qualitatif ?', ['La quantité totale d’énergie', 'Le besoin en nutriments précis, comme les acides aminés indispensables ou les vitamines', 'Le nombre de repas par jour', 'Le poids idéal'], 1, 'Un apport énergétique suffisant peut rester qualitativement déséquilibré.'],
            ['Quels nutriments traversent la paroi intestinale sans digestion préalable ?', ['L’amidon et les protéines', 'L’eau, les ions et les monomères', 'Les triglycérides entiers', 'Le glycogène'], 1, 'Les polymères doivent d’abord être hydrolysés en monomères.'],
          ],
        },
        {
          titre: 'L’obésité et les carences : deux malnutritions',
          axe: 'Appareil digestif et nutrition',
          lecon: {
            titre: 'Malnutrition par excès et par défaut',
            cours: `La **malnutrition** n'est pas seulement le manque de nourriture : c'est tout déséquilibre entre les apports et les besoins. Elle peut venir d'un excès, l'**obésité**, ou d'un manque, la **carence**.

## L'obésité, une malnutrition par excès
L'obésité est un excès de masse grasse qui nuit à la santé ; chez l'adulte, elle correspond à un IMC de 30 ou plus. En France, elle touche environ 17 % des adultes.

**Facteurs de risque** :
| Le type | Exemples |
| **Comportementaux** | Alimentation trop riche en graisses et en sucres, grignotage, boissons sucrées, **sédentarité**, manque de sommeil |
| **Biologiques** | Prédisposition génétique, certains troubles hormonaux, certains médicaments |
| **Sociaux et environnementaux** | Précarité, offre alimentaire, publicité, stress |

**Conséquences pathologiques** : diabète de type 2, **hypertension artérielle**, maladies cardio-vasculaires (athérosclérose), apnée du sommeil, arthrose (surtout du genou), certains cancers, souffrance psychologique et stigmatisation.

**Traitements** :
1. Rééquilibrer l'alimentation, sans régime draconien.
2. Augmenter l'**activité physique** et réduire le temps assis.
3. Accompagnement psychologique et éducation thérapeutique.
4. Dans les obésités sévères, traitements médicamenteux ou **chirurgie bariatrique** (réduction de l'estomac), sous conditions strictes.

> La prise en charge est longue et pluridisciplinaire : médecin, diététicien, éducateur sportif, psychologue.

## Les carences, une malnutrition par défaut
Une **carence** est un apport insuffisant d'un ou plusieurs nutriments.

| L'origine | Le sens | Exemple |
| **Quantitative** | Apport global insuffisant | Famine, anorexie mentale : amaigrissement jusqu'à la **cachexie** |
| **Qualitative** | Apport suffisant en énergie mais pauvre en un nutriment précis | Carence en fer, en vitamine C, en vitamine D |

## Un exemple : l'anémie par carence en fer
Le **fer** est indispensable à la fabrication de l'**hémoglobine**, qui transporte le dioxygène dans les globules rouges.

- **Signes cliniques** : fatigue, **pâleur**, essoufflement à l'effort, accélération du cœur, ongles cassants.
- **Signes paracliniques** : au bilan sanguin, **hémoglobine basse** (moins de 12 g/dL chez la femme, 13 g/dL chez l'homme) et **ferritine basse** (les réserves de fer sont vides).
- **Facteurs de risque** : règles abondantes, grossesse, croissance, alimentation pauvre en fer (peu de viande, de poisson, de légumineuses), saignements digestifs.
- **Traitement** : supplémentation en fer, alimentation riche en fer, recherche et traitement de la cause.

> La vitamine C favorise l'absorption du fer d'origine végétale : un agrume au repas aide.

Autres exemples : le **scorbut** (carence en vitamine C : gencives qui saignent, fatigue), le **rachitisme** (carence en vitamine D chez l'enfant : os mal minéralisés).

## Le vocabulaire
| Le terme | Le sens |
| **Anorexie** | Perte ou refus de l'appétit |
| **Cachexie** | Amaigrissement extrême avec fonte des muscles |
| **Polyphagie** | Faim excessive, besoin de manger en grande quantité |
| **adip(o)** | Graisse (tissu adipeux) |`,
          },
          questions: [
            ['L’obésité est une malnutrition :', ['Par défaut', 'Par excès', 'Qui ne touche que les enfants', 'Sans lien avec l’alimentation'], 1, 'Elle résulte d’un excès d’apports par rapport aux dépenses.'],
            ['Laquelle est une conséquence de l’obésité ?', ['L’anémie ferriprive', 'Le diabète de type 2', 'Le scorbut', 'La myopie'], 1, 'L’obésité favorise aussi l’hypertension, l’apnée du sommeil et l’arthrose.'],
            ['Quel est un traitement de première intention de l’obésité ?', ['La chirurgie immédiate', 'Le rééquilibrage alimentaire associé à l’activité physique', 'Le jeûne complet', 'Les antibiotiques'], 1, 'La chirurgie bariatrique est réservée aux obésités sévères.'],
            ['Qu’est-ce qu’une carence qualitative ?', ['Un apport énergétique global insuffisant', 'Un apport suffisant en énergie mais pauvre en un nutriment précis', 'Un excès de sucres', 'Une intoxication'], 1, 'Exemple : une alimentation abondante mais pauvre en fer.'],
            ['Pourquoi une carence en fer provoque-t-elle une anémie ?', ['Le fer est nécessaire à la fabrication de l’hémoglobine', 'Le fer détruit les globules rouges', 'Le fer bloque la respiration', 'Le fer est un sucre énergétique'], 0, 'Sans fer, l’hémoglobine manque et le sang transporte moins de dioxygène.'],
            ['Quel signe clinique évoque une anémie ?', ['Une fièvre élevée', 'Une pâleur et une fatigue', 'Une douleur au genou', 'Une toux grasse'], 1, 'Le manque de dioxygène apporté aux tissus fatigue et essouffle.'],
            ['Quel dosage sanguin indique que les réserves de fer sont vides ?', ['La glycémie', 'La ferritine', 'La créatinine', 'Le cholestérol'], 1, 'Une ferritine basse signe une carence en fer.'],
            ['Que désigne la cachexie ?', ['Une faim excessive', 'Un amaigrissement extrême avec fonte musculaire', 'Une prise de poids rapide', 'Une inflammation de l’estomac'], 1, 'C’est l’aboutissement d’une malnutrition quantitative sévère ou de certaines maladies.'],
            ['La vitamine C favorise l’absorption du fer d’origine végétale.', ['Vrai', 'Faux'], 0, 'C’est pourquoi on conseille un fruit riche en vitamine C au cours du repas.'],
            ['Quelle carence provoque le scorbut ?', ['En vitamine D', 'En vitamine C', 'En fer', 'En calcium'], 1, 'Gencives qui saignent et fatigue en sont les signes classiques.'],
            ['La sédentarité est un facteur de risque d’obésité.', ['Vrai', 'Faux'], 0, 'Elle réduit les dépenses énergétiques et déséquilibre le bilan.'],
            ['Que signifie « polyphagie » ?', ['Un refus de s’alimenter', 'Un besoin excessif de manger', 'Une difficulté à avaler', 'Une perte de goût'], 1, 'poly = beaucoup, -phagie = manger.'],
          ],
        },
        {
          titre: 'L’appareil digestif et la digestion',
          axe: 'Appareil digestif et nutrition',
          lecon: {
            titre: 'Des aliments aux nutriments',
            cours: `Un morceau de pain met plusieurs heures à devenir du glucose dans le sang. Entre-temps, il a été broyé, brassé, mélangé à des sucs et découpé par des enzymes : la digestion associe des phénomènes **mécaniques** et **chimiques**.

## L'organisation de l'appareil digestif
~ Bouche → pharynx → œsophage → estomac → intestin grêle → gros intestin → anus

| L'ensemble | Les organes |
| **Tube digestif** | Bouche, pharynx, œsophage, estomac, **intestin grêle** (duodénum, jéjunum, iléon), **gros intestin** (côlon, rectum), anus |
| **Glandes annexes** | Glandes **salivaires**, **foie** (produit la bile, stockée dans la vésicule biliaire), **pancréas** |

Les aliments passent dans le tube digestif ; les glandes annexes, elles, déversent leurs sécrétions sans être traversées par les aliments.

## La paroi du tube digestif
De l'intérieur vers l'extérieur, la paroi comprend quatre tuniques :

| La tunique | Sa composition et son rôle |
| **Muqueuse** | Épithélium au contact des aliments (sécrétion, absorption), sur un conjonctif |
| **Sous-muqueuse** | Conjonctif riche en vaisseaux et nerfs |
| **Musculeuse** | Muscles lisses : brassage et progression des aliments |
| **Séreuse** | Enveloppe externe (le péritoine) |

Elle s'adapte à la fonction : l'estomac a une musculeuse épaisse (trois couches) pour brasser et une muqueuse pleine de **glandes gastriques** ; l'intestin grêle a des **villosités** pour absorber.

## Les phénomènes mécaniques
**Mastication** par les dents, **déglutition**, **brassage** par l'estomac, **péristaltisme** (contractions en vague qui font progresser le bol alimentaire). Ils fragmentent les aliments et augmentent la surface offerte aux enzymes.

## Les phénomènes chimiques : les enzymes
Une **enzyme digestive** est une protéine qui **hydrolyse** un substrat précis (**spécificité**), à une température optimale (37 °C) et à un **pH optimal**.

| Le lieu | L'enzyme | Son action |
| **Bouche** | Amylase salivaire | Amidon → maltose |
| **Estomac** (pH ≈ 2) | Pepsine | Protéines → peptides |
| **Intestin grêle** (suc pancréatique) | Amylase pancréatique, trypsine, **lipase** | Amidon → maltose ; peptides → petits peptides ; triglycérides → acides gras + monoglycérides |
| **Intestin grêle** (bordure des entérocytes) | Maltase, lactase, saccharase, peptidases | Dimères → monomères ; peptides → acides aminés |

> La **bile** n'est pas une enzyme : ses sels **émulsionnent** les graisses en fines gouttelettes, ce qui augmente la surface d'action de la lipase.

Au terme de la digestion : glucides → **oses** (glucose…), protéines → **acides aminés**, triglycérides → **acides gras** et monoglycérides.

## Le microbiote intestinal
Le côlon héberge des milliards de bactéries : le **microbiote**. Il **fermente les fibres** que nos enzymes ne digèrent pas, produit certaines vitamines (K, B), participe à la défense contre les microbes pathogènes et à la maturation de l'immunité. Les antibiotiques peuvent le déséquilibrer.

Racines : **gastr(o)** estomac, **entér(o)** intestin, **col(o)** côlon, **hépat(o)** foie, **chol(é)** bile, **cholécyst(o)** vésicule biliaire, **œsophag(o)** œsophage, **stomat(o)** bouche.`,
          },
          questions: [
            ['Lequel est une glande annexe du tube digestif ?', ['L’estomac', 'Le pancréas', 'Le côlon', 'L’œsophage'], 1, 'Il déverse le suc pancréatique dans le duodénum sans être traversé par les aliments.'],
            ['Quel est l’ordre de passage des aliments ?', ['Bouche, œsophage, estomac, intestin grêle, côlon', 'Bouche, estomac, œsophage, côlon, intestin grêle', 'Bouche, pharynx, foie, estomac', 'Œsophage, bouche, estomac, rectum'], 0, 'Le pharynx suit la bouche, puis viennent œsophage, estomac, grêle et gros intestin.'],
            ['Quelle tunique de la paroi digestive assure le brassage et la progression des aliments ?', ['La muqueuse', 'La sous-muqueuse', 'La musculeuse', 'La séreuse'], 2, 'Ses muscles lisses produisent le péristaltisme.'],
            ['Quelle enzyme commence la digestion des protéines dans l’estomac ?', ['L’amylase', 'La lipase', 'La pepsine', 'La lactase'], 2, 'Elle agit à pH très acide, environ 2.'],
            ['Quel est le rôle de la bile ?', ['Hydrolyser l’amidon', 'Émulsionner les graisses', 'Digérer les protéines', 'Produire de l’insuline'], 1, 'Elle fragmente les graisses en gouttelettes, sans être une enzyme.'],
            ['Quels sont les produits de la digestion des triglycérides ?', ['Glucose et fructose', 'Acides aminés', 'Acides gras et monoglycérides', 'Maltose'], 2, 'L’action de la lipase pancréatique libère des acides gras.'],
            ['Où la bile est-elle produite ?', ['Dans la vésicule biliaire', 'Dans le foie', 'Dans le pancréas', 'Dans l’estomac'], 1, 'Elle est seulement stockée et concentrée dans la vésicule biliaire.'],
            ['Une enzyme digestive agit sur n’importe quel substrat.', ['Vrai', 'Faux'], 1, 'Elle est spécifique : l’amylase n’agit que sur l’amidon, pas sur les protéines.'],
            ['Pourquoi la mastication facilite-t-elle la digestion chimique ?', ['Elle chauffe les aliments', 'Elle fragmente les aliments et augmente la surface d’action des enzymes', 'Elle neutralise l’acidité', 'Elle absorbe le glucose'], 1, 'Phénomènes mécaniques et chimiques se complètent.'],
            ['Quel rôle joue le microbiote intestinal ?', ['Il produit la bile', 'Il fermente les fibres et produit certaines vitamines', 'Il digère l’amidon dans la bouche', 'Il absorbe l’eau dans l’estomac'], 1, 'Il participe aussi à la défense contre les pathogènes.'],
            ['Que désigne la racine « hépat(o) » ?', ['L’estomac', 'Le foie', 'L’intestin', 'La vésicule biliaire'], 1, 'L’hépatite est une inflammation du foie.'],
            ['L’amylase salivaire transforme l’amidon en :', ['Glucose directement', 'Maltose', 'Acides aminés', 'Lactose'], 1, 'Le maltose sera hydrolysé en glucose par la maltase intestinale.'],
          ],
        },
        {
          titre: 'L’absorption intestinale, la fibroscopie et la malabsorption',
          axe: 'Appareil digestif et nutrition',
          lecon: {
            titre: 'Passer de l’intestin au sang',
            cours: `Digérer ne suffit pas : encore faut-il que les nutriments franchissent la paroi de l'intestin pour rejoindre le sang ou la lymphe. C'est l'**absorption**, et quand elle échoue, la personne se dénutrit même en mangeant.

## Une surface d'échange immense
L'intestin grêle mesure plusieurs mètres et sa muqueuse multiplie les replis :

| La structure | L'échelle | L'effet |
| **Valvules conniventes** | Replis visibles à l'œil nu | Augmentent la surface |
| **Villosités** | Replis de la muqueuse, d'environ 1 mm | Chacune contient un réseau de **capillaires sanguins** et un vaisseau lymphatique central, le **chylifère** |
| **Microvillosités** | Replis de la membrane des entérocytes (bordure en brosse) | Multiplient encore la surface, portent des enzymes |

S'y ajoutent une paroi **très fine** (un seul épithélium) et une **riche vascularisation** : la structure est adaptée à la fonction d'absorption.

## Deux voies d'absorption
| La voie | Les nutriments | Pourquoi |
| **Sanguine** : capillaires, puis **veine porte** vers le foie | Oses (glucose), acides aminés, eau, ions, vitamines **hydrosolubles** (B, C), acides gras courts | Ce sont des molécules **hydrophiles**, solubles dans le plasma |
| **Lymphatique** : chylifère, puis circulation lymphatique qui rejoint le sang | Acides gras longs et monoglycérides, **reconstitués en triglycérides** et emballés dans des **chylomicrons** ; vitamines **liposolubles** (A, D, E, K) | Ce sont des molécules **hydrophobes**, qui ne voyagent pas librement dans le sang |

## L'absorption de l'eau
L'eau est absorbée par **osmose** : elle traverse la paroi en suivant les nutriments et les ions absorbés, du milieu le moins concentré vers le plus concentré. La plus grande part est absorbée dans l'intestin grêle, le reste dans le côlon, qui concentre les selles.

## La fibroscopie
La **fibroscopie** (endoscopie) consiste à introduire un tube souple muni d'une caméra et d'une source lumineuse dans le tube digestif : par la bouche pour l'œsophage, l'estomac et le duodénum (**fibroscopie œso-gastro-duodénale**), par l'anus pour le côlon (**coloscopie**).

| Ses intérêts | Ses risques |
| Voir directement la muqueuse (ulcère, inflammation, **polype**, tumeur), faire des **biopsies**, parfois traiter (retirer un polype, arrêter un saignement) | Rares : perforation, saignement, infection, complications de l'anesthésie |

## Un exemple de malabsorption : la maladie cœliaque
Dans la **maladie cœliaque**, le **gluten** (protéine du blé, de l'orge, du seigle) déclenche chez des personnes prédisposées une réaction immunitaire qui détruit les **villosités** : c'est l'**atrophie villositaire**. La surface d'absorption s'effondre.

- **Signes cliniques** : **diarrhée** chronique, ballonnements, amaigrissement, fatigue ; chez l'enfant, retard de croissance.
- **Signes paracliniques** : anticorps spécifiques dans le sang, **biopsie du duodénum** par fibroscopie qui montre l'atrophie ; carences associées (anémie par manque de fer, manque de vitamines).
- **Mécanisme** : moins de villosités → moins de surface → nutriments non absorbés → carences et diarrhée.
- **Traitement** : **régime strict sans gluten**, à vie ; les villosités repoussent.

Vocabulaire : **diarrhée** (selles liquides et fréquentes), **hématémèse** (vomissement de sang), **rectorragie** (saignement par l'anus), **ulcère** (perte de substance de la muqueuse), **polype** (excroissance de la muqueuse).`,
          },
          questions: [
            ['Quelle structure de la muqueuse intestinale contient un chylifère ?', ['La valvule connivente', 'La villosité', 'La microvillosité', 'La glande gastrique'], 1, 'Chaque villosité contient des capillaires sanguins et un vaisseau lymphatique central.'],
            ['Par quelle voie le glucose rejoint-il la circulation ?', ['La voie lymphatique', 'La voie sanguine, par la veine porte', 'Il reste dans l’intestin', 'Par la bile'], 1, 'Hydrophile, il passe dans les capillaires sanguins puis va au foie.'],
            ['Par quelle voie les acides gras longs sont-ils principalement absorbés ?', ['La voie sanguine directe', 'La voie lymphatique, sous forme de chylomicrons', 'Ils ne sont jamais absorbés', 'Par l’estomac'], 1, 'Reconstitués en triglycérides, ils sont emballés dans des chylomicrons.'],
            ['Comment l’eau est-elle absorbée dans l’intestin ?', ['Par digestion enzymatique', 'Par osmose', 'Par la bile', 'Par la voie lymphatique uniquement'], 1, 'Elle suit les nutriments et ions absorbés, vers le milieu le plus concentré.'],
            ['Quelles caractéristiques de l’intestin grêle favorisent l’absorption ?', ['Une paroi épaisse et peu vascularisée', 'Une surface immense, une paroi fine et une riche vascularisation', 'L’absence de replis', 'Une muqueuse kératinisée'], 1, 'Replis, villosités et microvillosités multiplient la surface.'],
            ['Quelles vitamines empruntent la voie lymphatique ?', ['Les vitamines B et C', 'Les vitamines A, D, E et K', 'Toutes les vitamines', 'Aucune vitamine'], 1, 'Ce sont les vitamines liposolubles, absorbées avec les graisses.'],
            ['Qu’est-ce qu’une fibroscopie œso-gastro-duodénale ?', ['Une radiographie de l’abdomen', 'L’introduction par la bouche d’un tube souple muni d’une caméra', 'Un dosage sanguin', 'Une échographie du foie'], 1, 'Elle permet de voir la muqueuse et de faire des biopsies.'],
            ['Quelle lésion caractérise la maladie cœliaque ?', ['Un ulcère de l’estomac', 'L’atrophie des villosités intestinales', 'Un polype du côlon', 'Une obstruction de l’œsophage'], 1, 'Le gluten déclenche une réaction qui détruit les villosités.'],
            ['Quel est le traitement de la maladie cœliaque ?', ['Des antibiotiques', 'Un régime strict sans gluten à vie', 'Une chirurgie de l’estomac', 'Un régime riche en blé'], 1, 'Sans gluten, les villosités repoussent.'],
            ['Que signifie « rectorragie » ?', ['Un vomissement de sang', 'Un saignement par l’anus', 'Une inflammation du rectum', 'Une douleur abdominale'], 1, 'rect(o) = rectum, -rragie = écoulement de sang.'],
            ['La fibroscopie permet de réaliser des biopsies.', ['Vrai', 'Faux'], 0, 'Des prélèvements de muqueuse sont analysés au microscope.'],
            ['Pourquoi une malabsorption peut-elle provoquer une anémie ?', ['Parce que le fer n’est plus absorbé correctement', 'Parce que l’intestin détruit les globules rouges', 'Parce que le gluten contient du fer', 'Parce que la bile manque'], 0, 'Les villosités détruites laissent passer moins de fer et de vitamines.'],
          ],
        },
        // ──────────────────── APPAREIL CARDIO-VASCULAIRE ────────────────────
        {
          titre: 'Le cœur et la révolution cardiaque',
          axe: 'Appareil cardio-vasculaire et circulation sanguine',
          lecon: {
            titre: 'Une double pompe automatique',
            cours: `Environ 100 000 battements par jour, sans jamais s'arrêter, et sans que tu aies à y penser : le cœur est une double pompe musculaire dotée de son propre générateur électrique.

## L'anatomie du cœur
Le cœur, logé dans le thorax entre les deux poumons, est entouré du **péricarde**. Sa paroi est faite d'un muscle, le **myocarde**, tapissé à l'intérieur par l'**endocarde**.

| La cavité | Elle reçoit… | Elle envoie… |
| **Oreillette droite** | Le sang pauvre en O₂ des **veines caves** | Vers le ventricule droit |
| **Ventricule droit** | — | Dans l'**artère pulmonaire**, vers les poumons |
| **Oreillette gauche** | Le sang riche en O₂ des **veines pulmonaires** | Vers le ventricule gauche |
| **Ventricule gauche** | — | Dans l'**aorte**, vers tout le corps |

Le cœur droit et le cœur gauche ne communiquent pas (cloison). Le **ventricule gauche** a la paroi la plus épaisse : il doit propulser le sang dans tout l'organisme.

Des **valves** imposent un sens unique : entre oreillettes et ventricules, les valves **auriculo-ventriculaires** (tricuspide à droite, **mitrale** à gauche) ; à la sortie des ventricules, les valves **sigmoïdes** (pulmonaire et aortique).

## La double circulation
| La circulation | Le trajet |
| **Pulmonaire** (petite) | Ventricule droit → artère pulmonaire → poumons → veines pulmonaires → oreillette gauche |
| **Systémique** (grande) | Ventricule gauche → aorte → organes → veines caves → oreillette droite |

## La révolution cardiaque
Un cycle dure environ 0,8 s au repos.
1. **Systole auriculaire** : les oreillettes se contractent et achèvent le remplissage des ventricules.
2. **Systole ventriculaire** : les ventricules se contractent ; les valves auriculo-ventriculaires se ferment, puis les sigmoïdes s'ouvrent : c'est l'**éjection**.
3. **Diastole** : le cœur se relâche, les sigmoïdes se ferment, les ventricules se remplissent.

> Le volume d'éjection systolique VES = volume en fin de diastole − volume en fin de systole. Exemple : 130 − 60 = 70 mL.

Fréquence cardiaque fC (battements/min) et débit cardiaque : **DC = fC × VES**. Avec 70 battements/min et 70 mL : DC ≈ 4,9 L/min.

## L'automatisme cardiaque
Un cœur isolé, privé de nerfs, continue de battre : il est **automatique**. Son activité électrique naît dans le **tissu nodal**.

~ Nœud sinusal → oreillettes → nœud atrio-ventriculaire → faisceau de His → réseau de Purkinje

| L'élément | Son rôle |
| **Nœud sinusal** (dans l'oreillette droite) | **Pacemaker** : donne le rythme, environ 70 à 80 par minute au repos |
| **Nœud atrio-ventriculaire** | Retarde légèrement l'influx, le temps que les ventricules se remplissent |
| **Faisceau de His** et **réseau de Purkinje** | Distribuent l'excitation à tout le myocarde ventriculaire |

Racines : **cardi(o)** cœur, **valvul(o)** valve, **coronar(o)** artères coronaires.`,
          },
          questions: [
            ['Quelle cavité cardiaque envoie le sang dans l’aorte ?', ['L’oreillette droite', 'Le ventricule droit', 'L’oreillette gauche', 'Le ventricule gauche'], 3, 'Le ventricule gauche, à la paroi la plus épaisse, alimente la grande circulation.'],
            ['Par quels vaisseaux le sang revient-il des poumons au cœur ?', ['Les veines caves', 'Les artères pulmonaires', 'Les veines pulmonaires', 'L’aorte'], 2, 'Riche en dioxygène, il arrive dans l’oreillette gauche.'],
            ['Quelle valve sépare l’oreillette gauche du ventricule gauche ?', ['La valve tricuspide', 'La valve mitrale', 'La valve aortique', 'La valve pulmonaire'], 1, 'La tricuspide est son équivalent dans le cœur droit.'],
            ['Pourquoi le ventricule gauche a-t-il une paroi plus épaisse que le droit ?', ['Il reçoit plus de sang', 'Il doit propulser le sang dans tout l’organisme', 'Il contient le tissu nodal', 'Il est plus ancien'], 1, 'La grande circulation oppose une résistance bien plus forte que la petite.'],
            ['Quel élément joue le rôle de pacemaker naturel du cœur ?', ['Le faisceau de His', 'Le nœud sinusal', 'La valve mitrale', 'Le péricarde'], 1, 'Situé dans l’oreillette droite, il impose le rythme cardiaque.'],
            ['Un cœur isolé de tout nerf cesse immédiatement de battre.', ['Vrai', 'Faux'], 1, 'Il continue de battre grâce à l’automatisme de son tissu nodal.'],
            ['Volume en fin de diastole 120 mL, en fin de systole 50 mL. Quel est le VES ?', ['170 mL', '70 mL', '60 mL', '2,4 mL'], 1, 'VES = 120 − 50 = 70 mL.'],
            ['fC = 80 battements/min et VES = 60 mL. Quel est le débit cardiaque ?', ['140 mL/min', '4,8 L/min', '1,3 L/min', '48 L/min'], 1, 'DC = 80 × 60 = 4 800 mL/min = 4,8 L/min.'],
            ['Pendant l’éjection ventriculaire, les valves sigmoïdes sont :', ['Fermées', 'Ouvertes', 'Absentes', 'Retournées'], 1, 'Elles s’ouvrent quand la pression ventriculaire dépasse celle des artères.'],
            ['Quel est le trajet de la circulation pulmonaire ?', ['Ventricule gauche, aorte, organes', 'Ventricule droit, artère pulmonaire, poumons, veines pulmonaires, oreillette gauche', 'Oreillette droite, aorte, poumons', 'Veines caves, poumons, ventricule gauche'], 1, 'C’est la petite circulation, qui recharge le sang en dioxygène.'],
            ['Quel est le rôle du nœud atrio-ventriculaire ?', ['Donner le rythme', 'Retarder légèrement l’influx pour laisser les ventricules se remplir', 'Fermer les valves', 'Produire le sang'], 1, 'Ce délai coordonne la contraction des oreillettes puis des ventricules.'],
            ['Quelle enveloppe entoure le cœur ?', ['L’endocarde', 'Le péricarde', 'La plèvre', 'Le péritoine'], 1, 'L’endocarde tapisse l’intérieur, le péricarde enveloppe l’extérieur.'],
          ],
        },
        {
          titre: 'Vaisseaux, tension artérielle et exploration cardiaque',
          axe: 'Appareil cardio-vasculaire et circulation sanguine',
          lecon: {
            titre: 'Des vaisseaux, une pression régulée, des examens',
            cours: `Le sang circule dans près de 100 000 km de vaisseaux. Sa pression doit rester stable, même après une hémorragie, et le médecin dispose de nombreux examens pour en juger.

## Trois types de vaisseaux
| Le vaisseau | Sa paroi | Sa fonction |
| **Artère** | Trois tuniques : intima, **média épaisse** (élastique et musculaire), adventice | Conduire le sang **sous forte pression** depuis le cœur ; l'élasticité amortit les à-coups |
| **Veine** | Mêmes tuniques mais **paroi mince**, lumière large, **valvules** anti-reflux | Ramener le sang **à basse pression** vers le cœur |
| **Capillaire** | Un seul **endothélium** sur une lame basale | Paroi très fine : **échanges** entre sang et tissus |

## La tension artérielle
La mesure au **tensiomètre** (brassard gonflé qui comprime l'artère du bras, stéthoscope ou capteur électronique) donne deux valeurs : la **systolique** (maximale, pendant l'éjection) et la **diastolique** (minimale).

| La mesure (au repos) | L'interprétation |
| Vers 12/8 cmHg (120/80 mmHg) | Normale |
| 14/9 cmHg (140/90 mmHg) ou plus, de façon répétée | **Hypertension** artérielle |
| Systolique inférieure à 9 cmHg (90 mmHg) | **Hypotension** |

## La régulation : l'arc réflexe cardiaque
La pression artérielle est surveillée en permanence par un **arc réflexe**.

| L'élément | Sa localisation |
| **Récepteurs** : barorécepteurs, sensibles à l'étirement de la paroi | Sinus carotidien et crosse de l'aorte |
| **Voies afférentes** (sensitives) | Nerfs qui partent des barorécepteurs |
| **Centre nerveux** | Bulbe rachidien (tronc cérébral) |
| **Voies efférentes** (motrices) | Nerf **parasympathique** (nerf vague), qui **ralentit** le cœur ; nerfs **sympathiques**, qui l'**accélèrent** et contractent les vaisseaux |
| **Effecteurs** | Cœur (nœud sinusal) et vaisseaux |

**Cas d'une hémorragie** : la pression baisse, les barorécepteurs sont moins étirés et envoient moins de messages ; le bulbe diminue l'action du parasympathique et augmente celle du sympathique. Résultat : le cœur **s'accélère** (tachycardie) et les vaisseaux **se resserrent** (vasoconstriction) : la pression remonte.

## Les techniques d'exploration
| La technique | Le principe | L'intérêt |
| **Électrocardiogramme (ECG)** | Enregistre l'activité **électrique** du cœur par des électrodes sur la peau | Rythme, troubles de conduction, infarctus |
| **Échographie** | Des **ultrasons** se réfléchissent sur les structures | Voir le cœur battre, les valves, mesurer le VES |
| **Doppler** | La fréquence des ultrasons réfléchis par les globules en mouvement change | Mesurer la **vitesse du sang**, repérer un rétrécissement |
| **Angiographie** | Un **produit de contraste** iodé injecté rend les vaisseaux visibles aux rayons X | Voir une artère bouchée (coronarographie) |
| **Scintigraphie** | Un **traceur radioactif** injecté se fixe sur les tissus irrigués ; une gamma-caméra le détecte | Repérer une zone du myocarde mal irriguée |

**Lire un ECG** : l'onde **P** correspond à la dépolarisation des oreillettes, le complexe **QRS** à celle des ventricules, l'onde **T** à la repolarisation des ventricules.

> fC = 60 / durée d'un cycle (en s), mesurée entre deux pics R. Si R–R = 0,75 s, fC = 80 battements/min.`,
          },
          questions: [
            ['Quel vaisseau possède une paroi réduite à un endothélium ?', ['L’artère', 'La veine', 'Le capillaire', 'L’aorte'], 2, 'Cette paroi très fine permet les échanges avec les tissus.'],
            ['À quoi servent les valvules des veines ?', ['À accélérer le sang', 'À empêcher le reflux du sang', 'À filtrer le sang', 'À produire des globules'], 1, 'Elles aident le retour du sang vers le cœur, à basse pression.'],
            ['Où sont situés les barorécepteurs ?', ['Dans le bulbe rachidien', 'Dans le sinus carotidien et la crosse de l’aorte', 'Dans les veines des jambes', 'Dans le ventricule droit'], 1, 'Ils sont sensibles à l’étirement de la paroi artérielle.'],
            ['Quel nerf ralentit le cœur ?', ['Le nerf sympathique', 'Le nerf vague (parasympathique)', 'Le nerf optique', 'Le nerf sciatique'], 1, 'Le sympathique, au contraire, l’accélère.'],
            ['Après une hémorragie, la fréquence cardiaque :', ['Diminue', 'Augmente', 'Ne change pas', 'S’annule'], 1, 'Le sympathique est stimulé : tachycardie et vasoconstriction font remonter la pression.'],
            ['Que représente l’onde P de l’ECG ?', ['La dépolarisation des ventricules', 'La dépolarisation des oreillettes', 'La repolarisation des ventricules', 'La fermeture des valves'], 1, 'Le complexe QRS correspond aux ventricules.'],
            ['Deux pics R sont séparés de 0,60 s. Quelle est la fréquence cardiaque ?', ['60 battements/min', '100 battements/min', '120 battements/min', '36 battements/min'], 1, 'fC = 60 / 0,60 = 100 battements/min.'],
            ['Quel examen utilise un produit de contraste iodé et des rayons X pour visualiser les artères ?', ['L’échographie', 'L’angiographie', 'La scintigraphie', 'L’ECG'], 1, 'Appliquée aux artères du cœur, c’est la coronarographie.'],
            ['Quelle technique mesure la vitesse du sang dans un vaisseau ?', ['Le Doppler', 'La radiographie simple', 'L’ECG', 'La spirométrie'], 0, 'La fréquence des ultrasons réfléchis dépend de la vitesse des globules.'],
            ['Une tension de 15/10 cmHg mesurée à plusieurs reprises au repos évoque :', ['Une hypotension', 'Une tension normale', 'Une hypertension artérielle', 'Une hémorragie'], 2, 'Le seuil de l’hypertension est 14/9 cmHg.'],
            ['Le centre nerveux de la régulation cardiaque se situe dans le bulbe rachidien.', ['Vrai', 'Faux'], 0, 'Il reçoit les messages des barorécepteurs et commande cœur et vaisseaux.'],
            ['Quelle technique utilise un traceur radioactif et une gamma-caméra ?', ['La scintigraphie', 'Le Doppler', 'L’angiographie', 'L’IRM'], 0, 'Elle repère les zones du myocarde mal irriguées.'],
          ],
        },
        {
          titre: 'L’athérosclérose, l’angor et l’infarctus du myocarde',
          axe: 'Appareil cardio-vasculaire et circulation sanguine',
          lecon: {
            titre: 'Quand les artères se bouchent',
            cours: `Les maladies cardio-vasculaires sont l'une des deux premières causes de mortalité en France, avec les cancers. Leur origine principale est une lente maladie des artères : l'**athérosclérose**.

## L'athérosclérose, étape par étape
1. Le **LDL-cholestérol** en excès pénètre dans l'**intima** (la tunique interne) d'une artère et s'y oxyde.
2. Des globules blancs (monocytes devenus macrophages) l'absorbent et se gorgent de lipides : ce sont les **cellules spumeuses**. Elles forment une **strie lipidique**.
3. Des cellules musculaires et des fibres s'accumulent : la lésion devient une **plaque d'athérome**, recouverte d'une **chape fibreuse**.
4. La plaque grossit et rétrécit la lumière de l'artère : c'est une **sténose**. Le sang passe moins.
5. La plaque peut se **rompre** : un **caillot** (thrombus) se forme au contact et peut boucher l'artère d'un coup (**thrombose**), ou se détacher et aller boucher une artère plus loin (**embolie**).

## Les conséquences selon l'artère touchée
Une artère rétrécie ou bouchée prive un organe de dioxygène : c'est l'**ischémie** ; si elle dure, les cellules meurent : c'est la **nécrose**.

| L'artère atteinte | La conséquence |
| **Coronaires** (qui nourrissent le cœur) | Angor, infarctus du myocarde |
| **Artères cérébrales** ou carotides | Accident vasculaire cérébral |
| **Artères des jambes** | Artériopathie : douleurs à la marche |

## Angor et infarctus : deux maladies des coronaires
| Le critère | Angor (angine de poitrine) | Infarctus du myocarde (IDM) |
| Mécanisme | **Sténose** : ischémie **transitoire**, quand le besoin en O₂ augmente | **Occlusion** complète par un caillot : ischémie durable puis **nécrose** |
| Douleur | Thoracique, en étau, souvent irradiant au bras gauche ou à la mâchoire, **à l'effort** | Même douleur, mais **intense, prolongée** (plus de 20 minutes), souvent **au repos** |
| Évolution | **Cède au repos** ou à la **trinitrine** en quelques minutes | **Ne cède pas** à la trinitrine |
| ECG | Normal au repos, anomalies à l'effort | Anomalies caractéristiques (sus-décalage du segment ST) |
| Enzymes cardiaques (troponine) | Normales | **Élevées** : elles sont libérées par les cellules nécrosées |

> Devant une douleur thoracique qui dure : appeler le 15. Chaque minute compte, car le muscle nécrosé ne se régénère pas.

**Traitement de l'infarctus** : rouvrir l'artère au plus vite, par **angioplastie** (un ballonnet écrase la plaque et on pose un **stent**, petit ressort qui maintient l'artère ouverte) ou par un médicament qui dissout le caillot (**thrombolyse**) ; puis antiagrégants plaquettaires et contrôle des facteurs de risque.

## Les facteurs de risque et la prévention
| Non modifiables | Modifiables |
| Âge, sexe masculin, hérédité | **Tabac**, **hypertension artérielle**, **excès de LDL-cholestérol**, **diabète**, obésité, sédentarité, alimentation trop riche en graisses saturées, stress |

Prévenir : ne pas fumer, bouger au moins 30 minutes par jour, manger équilibré (fruits, légumes, poissons, huiles végétales), surveiller tension, glycémie et cholestérol.

Vocabulaire : **athéro** (dépôt graisseux), **thromb(o)** caillot, **angi(o)** vaisseau, **nécr(o)** mort, **ischémie**, **sténose**, **embolie**, **anévrisme** (dilatation d'une artère), **arythmie** (rythme irrégulier).`,
          },
          questions: [
            ['Quelle molécule est au départ de la formation d’une plaque d’athérome ?', ['Le glucose', 'Le LDL-cholestérol', 'L’hémoglobine', 'L’urée'], 1, 'En excès, il s’infiltre dans l’intima de l’artère et s’y oxyde.'],
            ['Que sont les cellules spumeuses ?', ['Des globules rouges déformés', 'Des macrophages gorgés de lipides', 'Des cellules musculaires cardiaques', 'Des plaquettes'], 1, 'Elles forment la strie lipidique, premier stade de la plaque.'],
            ['Qu’est-ce qu’une sténose ?', ['Une rupture d’artère', 'Un rétrécissement de la lumière d’un vaisseau', 'Une dilatation d’artère', 'Une infection du cœur'], 1, 'La plaque qui grossit réduit le passage du sang.'],
            ['Qu’est-ce que l’ischémie ?', ['Un excès de sang dans un organe', 'Un apport insuffisant de sang et de dioxygène à un organe', 'Une mort cellulaire', 'Une inflammation'], 1, 'Si elle dure, elle aboutit à la nécrose.'],
            ['Quelle douleur évoque un angor ?', ['Une douleur thoracique à l’effort qui cède au repos', 'Une douleur thoracique de plus d’une heure au repos', 'Une douleur au genou', 'Une douleur abdominale après le repas'], 0, 'L’ischémie est transitoire : quand le besoin en dioxygène baisse, la douleur disparaît.'],
            ['Dans l’infarctus du myocarde, la douleur cède à la trinitrine.', ['Vrai', 'Faux'], 1, 'L’artère est bouchée : la trinitrine ne suffit pas, la douleur persiste.'],
            ['Pourquoi dose-t-on la troponine en cas de douleur thoracique ?', ['Elle signe une infection', 'Elle est libérée par les cellules du myocarde nécrosées', 'Elle mesure le cholestérol', 'Elle mesure la glycémie'], 1, 'Son élévation confirme l’infarctus.'],
            ['Quelles artères nourrissent le muscle cardiaque ?', ['Les carotides', 'Les coronaires', 'Les artères pulmonaires', 'Les artères fémorales'], 1, 'Leur obstruction provoque angor et infarctus.'],
            ['Qu’est-ce qu’un stent ?', ['Un médicament contre le cholestérol', 'Un petit ressort qui maintient une artère ouverte', 'Un stimulateur cardiaque', 'Une valve artificielle'], 1, 'Il est posé lors d’une angioplastie.'],
            ['Lequel est un facteur de risque modifiable de l’athérosclérose ?', ['L’âge', 'Le sexe', 'Le tabagisme', 'L’hérédité'], 2, 'Arrêter de fumer réduit fortement le risque cardio-vasculaire.'],
            ['Qu’est-ce qu’une embolie ?', ['L’obstruction d’un vaisseau par un caillot venu d’ailleurs', 'La dilatation d’une artère', 'La rupture du cœur', 'Une baisse de tension'], 0, 'Le caillot migre avec le sang et bloque un vaisseau plus étroit.'],
            ['Que signifie « nécrose » ?', ['La mort de cellules ou d’un tissu', 'Un rétrécissement d’artère', 'Un caillot', 'Un trouble du rythme'], 0, 'Dans l’infarctus, une partie du myocarde est nécrosée.'],
          ],
        },
        // ──────────────────── APPAREIL RESPIRATOIRE ────────────────────
        {
          titre: 'L’appareil respiratoire et les échanges gazeux',
          axe: 'Appareil respiratoire et échanges gazeux',
          lecon: {
            titre: 'De l’air aux mitochondries',
            cours: `Chaque cellule a besoin de dioxygène pour produire son énergie et rejette du dioxyde de carbone. L'appareil respiratoire et le sang assurent ces échanges, du nez jusqu'aux mitochondries.

## L'organisation de l'appareil respiratoire
~ Fosses nasales → pharynx → larynx → trachée → bronches → bronchioles → alvéoles

Les poumons, enveloppés par la **plèvre**, occupent la cavité thoracique de part et d'autre du cœur, auquel ils sont reliés par les artères et veines pulmonaires. Le **diaphragme** et les muscles intercostaux assurent la ventilation.

## Des parois adaptées
| Le conduit | Sa paroi | Son rôle |
| **Trachée**, bronches | Anneaux de **cartilage** (en C dans la trachée), épithélium **cilié** avec cellules à **mucus** | Rester ouvertes ; le mucus piège les particules, les cils les remontent vers la gorge |
| **Bronchioles** | Pas de cartilage, **muscle lisse** | Régler le passage de l'air (elles se contractent dans l'asthme) |
| **Alvéoles** | Paroi très fine, entourée de capillaires | Échanges gazeux |

## La barrière alvéolo-capillaire
Entre l'air de l'alvéole et le sang : l'**épithélium alvéolaire**, une **lame basale** commune et l'**endothélium** du capillaire. Épaisse d'environ 0,5 µm, étendue sur près de 100 m², elle est idéale pour la **diffusion**.

## Le sens des échanges
Un gaz diffuse du milieu où sa **pression partielle** est la plus forte vers celui où elle est la plus faible.

| Le lieu | Le dioxygène O₂ | Le dioxyde de carbone CO₂ |
| **Poumons** | Passe de l'air alvéolaire (≈ 100 mmHg) au sang veineux (≈ 40 mmHg) | Passe du sang (≈ 46 mmHg) à l'air alvéolaire (≈ 40 mmHg) |
| **Tissus** | Passe du sang aux cellules, qui le consomment | Passe des cellules, qui le produisent, au sang |

## Le transport des gaz
| Le gaz | Ses formes de transport dans le sang |
| **O₂** | Environ 98 % **fixé à l'hémoglobine** (oxyhémoglobine) ; environ 2 % dissous |
| **CO₂** | Environ 70 % sous forme d'**ions hydrogénocarbonate** HCO₃⁻ ; environ 20 % fixé à l'hémoglobine (carbaminohémoglobine) ; environ 10 % dissous |

L'**hémoglobine** est une protéine de quatre chaînes (deux α, deux β), portant chacune un **hème** avec un atome de **fer** Fe²⁺ sur lequel se fixe une molécule d'O₂ : une hémoglobine transporte jusqu'à **quatre O₂**.

## L'affinité de l'hémoglobine
La **courbe de saturation** donne le pourcentage d'hémoglobine chargée en O₂ selon la pression partielle d'O₂ : dans les poumons, elle est saturée à près de 98 % ; dans les tissus, elle en libère une partie.

Une **baisse du pH**, une **hausse du CO₂** et une **hausse de la température** diminuent l'affinité de l'hémoglobine pour l'O₂ : la courbe se déplace vers la droite (effet Bohr).

> C'est exactement ce qui se passe dans un muscle en activité, chaud, acide et riche en CO₂ : l'hémoglobine y **libère davantage d'O₂**, là où il est le plus utile.

## La respiration cellulaire
Dans les **mitochondries**, les cellules oxydent les nutriments (glucose) grâce au dioxygène et produisent de l'énergie sous forme d'**ATP** : C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + énergie.

Racines : **pneum(o)**, **pulm(o)** poumon ; **bronch(o)** bronche ; **traché(o)** trachée ; **-pnée** respiration (dyspnée : difficulté à respirer).`,
          },
          questions: [
            ['Dans quel ordre l’air traverse-t-il les voies respiratoires ?', ['Trachée, larynx, bronches, alvéoles', 'Fosses nasales, pharynx, larynx, trachée, bronches, bronchioles, alvéoles', 'Pharynx, bronches, trachée, larynx', 'Alvéoles, bronchioles, trachée, larynx'], 1, 'Les voies supérieures précèdent la trachée et l’arbre bronchique.'],
            ['Pourquoi la trachée reste-t-elle toujours ouverte ?', ['Grâce à ses anneaux de cartilage', 'Grâce à la pression du sang', 'Grâce au mucus', 'Parce qu’elle est dépourvue de paroi'], 0, 'Ces anneaux en forme de C l’empêchent de s’affaisser.'],
            ['Quels éléments composent la barrière alvéolo-capillaire ?', ['Cartilage et muscle', 'Épithélium alvéolaire, lame basale et endothélium capillaire', 'Plèvre et diaphragme', 'Mucus et cils'], 1, 'Très fine et très étendue, elle favorise la diffusion des gaz.'],
            ['Dans les poumons, le dioxygène diffuse :', ['Du sang vers l’air alvéolaire', 'De l’air alvéolaire vers le sang', 'Des tissus vers les poumons', 'Il ne diffuse pas'], 1, 'Sa pression partielle est plus forte dans l’air alvéolaire que dans le sang veineux.'],
            ['Sous quelle forme la majorité du dioxygène est-elle transportée dans le sang ?', ['Dissous dans le plasma', 'Fixé à l’hémoglobine', 'Sous forme d’hydrogénocarbonate', 'Dans les plaquettes'], 1, 'Environ 98 % du dioxygène est porté par l’hémoglobine.'],
            ['Sous quelle forme la majorité du CO₂ est-elle transportée ?', ['Fixé au fer de l’hème', 'Sous forme d’ions hydrogénocarbonate', 'Dissous uniquement', 'Sous forme de glucose'], 1, 'Environ 70 % du CO₂ voyage sous forme d’ions HCO₃⁻.'],
            ['Combien de molécules de dioxygène une hémoglobine peut-elle fixer ?', ['1', '2', '4', '8'], 2, 'Une par hème, et elle en compte quatre.'],
            ['Quel effet une baisse du pH a-t-elle sur l’hémoglobine ?', ['Elle augmente son affinité pour l’O₂', 'Elle diminue son affinité pour l’O₂, qui est davantage libéré', 'Elle la détruit', 'Aucun effet'], 1, 'C’est l’effet Bohr, utile dans les muscles en activité.'],
            ['Où se déroule la respiration cellulaire ?', ['Dans le noyau', 'Dans les mitochondries', 'Dans les alvéoles', 'Dans le plasma'], 1, 'Les mitochondries oxydent les nutriments et produisent l’ATP.'],
            ['Les bronchioles ne contiennent pas de cartilage mais du muscle lisse.', ['Vrai', 'Faux'], 0, 'Leur muscle lisse règle leur diamètre ; il se contracte dans la crise d’asthme.'],
            ['Quel est le rôle des cils de l’épithélium respiratoire ?', ['Absorber le dioxygène', 'Remonter le mucus chargé de particules vers la gorge', 'Produire du surfactant', 'Contracter les bronches'], 1, 'C’est l’escalator muco-ciliaire, qui nettoie les voies aériennes.'],
            ['Que signifie « dyspnée » ?', ['Une toux sèche', 'Une difficulté à respirer', 'Un crachat de sang', 'Une coloration bleue de la peau'], 1, 'dys = difficulté, -pnée = respiration.'],
          ],
        },
        {
          titre: 'La spirométrie, l’asthme et le tabagisme',
          axe: 'Appareil respiratoire et échanges gazeux',
          lecon: {
            titre: 'Explorer la fonction respiratoire et comprendre ses atteintes',
            cours: `L'asthme touche plusieurs millions de personnes en France ; le tabac y cause environ 75 000 décès par an. Pour les diagnostiquer et les suivre, on mesure les volumes d'air que les poumons mobilisent.

## La spirométrie
Le patient souffle dans un **spiromètre**, qui enregistre les volumes d'air en fonction du temps : c'est le **spirogramme**.

| Le volume | Sa définition | Ordre de grandeur (adulte) |
| **Volume courant** (VC) | Air mobilisé à chaque respiration calme | 0,5 L |
| **Volume de réserve inspiratoire** (VRI) | Air inspiré en plus, en forçant | 2,5 à 3 L |
| **Volume de réserve expiratoire** (VRE) | Air expiré en plus, en forçant | 1 à 1,5 L |
| **Capacité vitale** (CV) | VC + VRI + VRE | 4 à 5 L |
| **Volume résiduel** | Air qui reste toujours dans les poumons, non mesurable par le spiromètre simple | ≈ 1,2 L |
| **VEMS** | Volume expiré en une seconde lors d'une expiration forcée | ≈ 80 % de la CV |

Le **rapport de Tiffeneau** = VEMS / CV. Inférieur à environ 70 %, il signe un **trouble ventilatoire obstructif** : l'air a du mal à sortir parce que les bronches sont rétrécies.

Les autres techniques : la **radiographie** et le **scanner** du thorax (images des poumons), la **fibroscopie bronchique** (voir l'intérieur des bronches, faire des prélèvements).

## L'asthme
L'asthme est une **inflammation chronique des bronches**, qui les rend **hyperréactives**. Lors d'une crise, trois phénomènes rétrécissent les bronchioles :
1. la **contraction** du muscle lisse (bronchoconstriction) ;
2. l'**œdème** de la muqueuse enflammée ;
3. l'**hypersécrétion** de mucus.

- **Signes cliniques** : gêne respiratoire surtout **expiratoire**, **sifflements**, toux, oppression thoracique, souvent la nuit ; dans une crise grave, **cyanose** (lèvres bleues).
- **Signe paraclinique** : trouble ventilatoire obstructif **réversible** après inhalation d'un bronchodilatateur.
- **Facteurs de risque et déclenchants** : allergènes (acariens, pollens, poils d'animaux), **tabac** (y compris passif), pollution, infections, effort, froid, terrain allergique familial.

| Le traitement | Son action |
| **Bronchodilatateur** de courte durée, inhalé | Relâche le muscle lisse : traite la **crise** |
| **Corticoïde inhalé** | Réduit l'inflammation : traitement **de fond** |
| **Éviction** des allergènes et du tabac | Prévention des crises |

## Le tabagisme
| Le constituant de la fumée | Son effet |
| **Nicotine** | Crée la **dépendance** ; accélère le cœur, resserre les vaisseaux |
| **Goudrons** | **Cancérigènes** (cancers du poumon, de la gorge, de la vessie…) ; paralysent les cils |
| **Monoxyde de carbone** (CO) | Se fixe sur l'hémoglobine **plus de 200 fois plus fortement** que le dioxygène : le sang transporte moins d'O₂ |
| **Irritants** | Enflamment les bronches, augmentent le mucus |

Conséquences : **BPCO** (bronchopneumopathie chronique obstructive, obstruction qui, elle, n'est **pas réversible**), **cancer broncho-pulmonaire**, maladies cardio-vasculaires (infarctus, AVC, artériopathie).

> Arrêter de fumer est bénéfique à tout âge : le CO disparaît du sang en quelques jours et le risque d'infarctus baisse nettement dès la première année.

Vocabulaire : **cyanose** (coloration bleutée de la peau et des lèvres), **expectorations** (crachats), **hémoptysie** (crachat de sang), **spir(o)** respirer.`,
          },
          questions: [
            ['Qu’est-ce que la capacité vitale ?', ['Le volume d’air qui reste dans les poumons', 'La somme du volume courant et des volumes de réserve inspiratoire et expiratoire', 'Le volume d’une respiration calme', 'Le volume expiré en une seconde'], 1, 'CV = VC + VRI + VRE, environ 4 à 5 L chez l’adulte.'],
            ['Quel est l’ordre de grandeur du volume courant chez l’adulte au repos ?', ['0,05 L', '0,5 L', '5 L', '50 L'], 1, 'Un demi-litre d’air à chaque respiration calme.'],
            ['Un rapport VEMS / CV nettement inférieur à 70 % indique :', ['Une fonction respiratoire normale', 'Un trouble ventilatoire obstructif', 'Une anémie', 'Une hypertension'], 1, 'L’air sort difficilement : les bronches sont rétrécies.'],
            ['Le volume résiduel peut être mesuré par un spiromètre simple.', ['Vrai', 'Faux'], 1, 'Cet air reste toujours dans les poumons : le spiromètre ne le voit pas.'],
            ['Quels phénomènes rétrécissent les bronchioles lors d’une crise d’asthme ?', ['Bronchoconstriction, œdème et hypersécrétion de mucus', 'Dilatation des bronches', 'Destruction des alvéoles seule', 'Formation d’une plaque d’athérome'], 0, 'Les trois s’additionnent pour gêner le passage de l’air.'],
            ['Quel traitement soulage une crise d’asthme ?', ['Un corticoïde de fond seul', 'Un bronchodilatateur inhalé de courte durée', 'Un antibiotique', 'Un anticoagulant'], 1, 'Il relâche le muscle lisse des bronchioles en quelques minutes.'],
            ['Quelle est une caractéristique de l’obstruction bronchique dans l’asthme ?', ['Elle est réversible après un bronchodilatateur', 'Elle est toujours définitive', 'Elle n’apparaît qu’à l’inspiration', 'Elle est due au monoxyde de carbone'], 0, 'C’est ce qui la distingue de la BPCO.'],
            ['Lequel est un facteur déclenchant de l’asthme ?', ['Les acariens', 'Le calcium', 'La vitamine C', 'L’eau potable'], 0, 'Les allergènes comme les acariens et les pollens déclenchent les crises.'],
            ['Quel constituant de la fumée du tabac crée la dépendance ?', ['Les goudrons', 'La nicotine', 'Le monoxyde de carbone', 'La vapeur d’eau'], 1, 'Elle agit sur le cerveau et entretient le besoin de fumer.'],
            ['Pourquoi le monoxyde de carbone réduit-il le transport du dioxygène ?', ['Il détruit les poumons', 'Il se fixe sur l’hémoglobine bien plus fortement que le dioxygène', 'Il bloque la trachée', 'Il dissout les globules rouges'], 1, 'L’hémoglobine occupée par le CO ne porte plus d’O₂.'],
            ['Quels constituants du tabac sont cancérigènes ?', ['La nicotine', 'Les goudrons', 'L’eau', 'Le dioxygène'], 1, 'Ils sont responsables des cancers du poumon, de la gorge, de la vessie…'],
            ['Que désigne l’hémoptysie ?', ['Un vomissement de sang', 'Un crachat de sang d’origine respiratoire', 'Une coloration bleue des lèvres', 'Une toux sèche'], 1, 'hém(o) = sang, -ptysie = crachat.'],
          ],
        },
        // ──────────────────────── MÉTHODE ────────────────────────
        {
          titre: 'Méthode : analyser des documents et raisonner en physiopathologie',
          axe: 'Méthodologie',
          lecon: {
            titre: 'Réussir les devoirs de biologie et physiopathologie humaines',
            cours: `La biologie et physiopathologie humaines est une spécialité de **première**, évaluée au bac par le **contrôle continu** (ta moyenne de l'année). Mais ses notions reviennent dans l'épreuve écrite de **chimie, biologie et physiopathologie humaines** de terminale, qui porte aussi sur le programme de première. Les méthodes de cette fiche te serviront deux ans.

## Le raisonnement physiopathologique
Chaque pathologie du programme s'étudie selon le même plan. Retiens-le : il structure tes réponses.

| L'étape | La question à se poser |
| **Rappel physiologique** | Comment l'organe fonctionne-t-il normalement ? |
| **Signes cliniques** | Que ressent et que montre le patient ? (douleur, dyspnée, pâleur) |
| **Signes paracliniques** | Que montrent les examens ? (imagerie, ECG, bilan sanguin, spirométrie) |
| **Mécanisme** | Quel dysfonctionnement explique ces signes ? |
| **Facteurs de risque** | Qu'est-ce qui favorise la maladie ? |
| **Traitements** | Comment agissent-ils sur le mécanisme ? |
| **Prévention** | Comment agir sur les facteurs de risque ? |

> Justifier un traitement, c'est montrer qu'il corrige le mécanisme : le bronchodilatateur relâche le muscle lisse, donc les bronches s'ouvrent, donc l'air passe.

## Analyser un document
1. Lire le **titre**, la source, les axes et leurs **unités**.
2. **Décrire** : citer des valeurs précises (« la troponine passe de 0,01 à 2,5 µg/L en 6 heures »).
3. **Comparer** à une référence : valeur normale, témoin, autre patient.
4. **Interpréter** avec une connaissance du cours.
5. **Conclure** en répondant à la question posée.

Un bon réflexe : **une idée, une donnée chiffrée, une explication**.

## Réussir un schéma
1. Un **titre** précis (« Coupe longitudinale d'un sarcomère contracté »).
2. Un tracé net, au crayon, **proportionné**.
3. Des **légendes** alignées, reliées par des traits tirés **à la règle**, qui ne se croisent pas.
4. Des **flèches** pour les sens de circulation, de diffusion ou de propagation.
5. Une **orientation** quand elle compte (droite du patient, pôle apical, sens de l'influx).

## Construire le vocabulaire médical
Le programme liste des racines : combine-les avec des préfixes et suffixes.

| L'élément | Le sens | Exemple |
| **-ite** | Inflammation | Gastrite, arthrite |
| **-ose** | Affection non inflammatoire, dégénérescence | Arthrose, athérosclérose |
| **-algie** | Douleur | Myalgie |
| **-ectomie** | Ablation | Cholécystectomie |
| **-scopie** | Examen visuel | Fibroscopie |
| **-graphie** | Enregistrement, image | Électrocardiographie |
| **-émie** | Présence dans le sang | Glycémie |
| **-plégie** | Paralysie | Hémiplégie |
| **dys-** | Difficulté, anomalie | Dyspnée |
| **hyper- / hypo-** | Excès / insuffisance | Hypertension, hypotension |
| **a-, an-** | Absence | Aphasie, anémie |

## Les erreurs à éviter
| L'erreur | La correction |
| Confondre signe clinique et paraclinique | Clinique : examen du patient ; paraclinique : examens complémentaires |
| Réciter le cours sans utiliser le document | Chaque réponse s'appuie sur une donnée prélevée |
| Répondre sans unité | Toujours l'unité : mmHg, L/min, g/dL |
| Oublier la conclusion | La dernière phrase répond à la question |`,
          },
          questions: [
            ['Qu’est-ce qu’un signe paraclinique ?', ['Un symptôme ressenti par le patient', 'Un résultat d’examen complémentaire (imagerie, bilan sanguin, ECG)', 'Un facteur de risque', 'Un traitement'], 1, 'Le signe clinique se constate à l’examen du patient ; le paraclinique, par les examens.'],
            ['Que signifie le suffixe « -ite » ?', ['Douleur', 'Inflammation', 'Ablation', 'Paralysie'], 1, 'Gastrite, arthrite, hépatite : des inflammations.'],
            ['Que signifie « cholécystectomie » ?', ['L’inflammation de la vésicule biliaire', 'L’ablation de la vésicule biliaire', 'L’examen de l’estomac', 'Une douleur du foie'], 1, 'cholécyst(o) = vésicule biliaire, -ectomie = ablation.'],
            ['Quelle est la bonne démarche pour analyser une courbe ?', ['Donner directement la conclusion', 'Lire titre et unités, décrire avec des valeurs, comparer, interpréter, conclure', 'Recopier la légende', 'Ne regarder que le dernier point'], 1, 'Chaque étape s’appuie sur des données précises du document.'],
            ['Comment tracer les traits de légende d’un schéma ?', ['À main levée, en les croisant', 'À la règle, sans qu’ils se croisent', 'En couleur vive, sans ordre', 'Aucun trait n’est nécessaire'], 1, 'Des légendes alignées et des traits droits rendent le schéma lisible.'],
            ['Justifier un traitement consiste à :', ['Citer son nom', 'Montrer comment il corrige le mécanisme de la maladie', 'Donner son prix', 'Le comparer à un autre au hasard'], 1, 'Exemple : l’antiagrégant empêche la formation d’un nouveau caillot.'],
            ['Le suffixe « -émie » signifie :', ['Présence dans le sang', 'Absence de sang', 'Inflammation du sang', 'Écoulement de sang'], 0, 'Glycémie : présence de glucose dans le sang.'],
            ['La biologie et physiopathologie humaines de première est évaluée par une épreuve écrite finale en fin de première.', ['Vrai', 'Faux'], 1, 'Elle est évaluée en contrôle continu ; ses notions reviennent dans l’épreuve de CBPH de terminale.'],
            ['Quel préfixe indique une difficulté ou une anomalie ?', ['Hyper-', 'Dys-', 'Hypo-', 'Poly-'], 1, 'Dyspnée : difficulté à respirer.'],
            ['Dans une réponse à un document, une bonne idée doit être associée à :', ['Une donnée chiffrée prélevée et une explication', 'Une opinion personnelle', 'Une citation d’un autre chapitre sans lien', 'Rien d’autre'], 0, 'Une idée, une donnée, une explication : c’est ce qui rapporte les points.'],
            ['Qu’est-ce que « hypotension » ?', ['Une tension artérielle trop élevée', 'Une tension artérielle trop basse', 'Une tension normale', 'Une douleur thoracique'], 1, 'hypo- = insuffisance.'],
            ['Dans le raisonnement physiopathologique, les facteurs de risque servent surtout à construire :', ['Le diagnostic d’imagerie', 'La prévention', 'Le schéma anatomique', 'Le calcul du débit'], 1, 'Agir sur un facteur de risque modifiable, c’est prévenir la maladie.'],
          ],
        },
      ],
    },
  ],
}
