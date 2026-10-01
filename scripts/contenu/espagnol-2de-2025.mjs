// Espagnol SECONDE — les six axes culturels du programme 2025 et une
// grammaire propre au niveau (A2 → B1).
//
// SOURCE : arrêté du 5 mai 2025, BO n° 22 du 29 mai 2025, annexe 10 (programme
// d'espagnol du lycée), en vigueur en 2de depuis la rentrée 2025. Intitulés des
// axes et objets d'étude relevés sur La Clé des langues (ENS de Lyon), qui
// reproduit l'annexe. Cinq axes sur six sont à traiter dans l'année, dont
// OBLIGATOIREMENT l'axe 6, « L'Espagne au-delà des clichés ».
//
// POURQUOI CE MODULE : la 2de, la 1re et la Tle avaient exactement les mêmes
// 37 fiches de grammaire, et aucune fiche sur les axes culturels, qui sont
// pourtant la matière de chaque séquence et de chaque oral. On AJOUTE, on ne
// retire rien : deux blocs à la suite des fiches existantes (positions 40 → 51),
// rayon « culture » pour les axes, rayon « langue » pour la grammaire.
//
// Convention de la maison : la langue s'interroge EN FRANÇAIS ; l'espagnol est
// cité en exemple, jamais en énoncé.

export default {
  slug: 'espagnol',
  nom: 'Espagnol',

  titreMigration: 'ESPAGNOL 2de — AXES CULTURELS 2025 ET GRAMMAIRE DU NIVEAU',

  motif: `CONSTAT : la 2de, la 1re et la Tle portaient les mêmes 37 fiches
(grammaire en 4 chapitres et 3 fiches sans chapitre), et aucune fiche sur les
axes culturels du programme de langues vivantes publié au BO n° 22 du
29 mai 2025 (arrêté du 5 mai 2025), en vigueur en 2de depuis la rentrée 2025.
Cette migration AJOUTE, sans rien retirer : une fiche par axe de 2de (six,
dont l'axe 6 propre à l'espagnol, « L'Espagne au-delà des clichés »), rangées
dans le rayon « culture », et six fiches de grammaire du niveau A2 → B1 sur
des points absents des fiches existantes (impératif, por et para, la
préposition a, la durée, les nombres et l'heure, diminutifs et augmentatifs),
rangées dans le rayon « langue ».`,

  blocs: [
    // ======================================================================
    // LES SIX AXES CULTURELS DE SECONDE
    // ======================================================================
    {
      niveaux: ['2de'],
      positionDepart: 40,
      rayon: 'culture',
      chapitres: [
        // ---- Axe 1 ---------------------------------------------------------
        {
          titre: 'Se dire, se montrer : portraits et appartenances',
          axe: 'Représentation de soi et rapport à autrui',
          lecon: {
            titre: 'Qui suis-je, et qui sont les autres ?',
            cours: `Se peindre, se raconter, dire d’où l’on vient et quelle langue on parle : c’est ce que l’axe 1 te demande d’observer dans le monde hispanique, où l’autoportrait est un art majeur et la langue une question d’identité.

## Ce que recouvre l’axe
Le programme propose trois objets d’étude :
1. **Portraits et autoportraits** : traces de l’histoire personnelle et de la société ?
2. **Le sentiment d’appartenance** : à une famille, un quartier, une région, un pays, un groupe.
3. **La langue comme identité** : parler catalan, quechua ou « spanglish », c’est dire qui l’on est.

## Repères en Espagne
| Repère | Ce qu’il faut savoir |
| *Las Meninas*, Velázquez (1656) | Le peintre s’est représenté lui-même, pinceau à la main, à côté de l’infante : un autoportrait glissé dans un portrait de cour. Musée du Prado, Madrid. |
| Les autoportraits de Goya | Il se peint vieilli, malade, sans flatterie : le portrait devient aveu. |
| Les langues co-officielles | La Constitution de 1978 (art. 3) fait du castillan la langue officielle de l’État, et reconnaît les autres langues dans leurs communautés : **catalan, basque (euskera), galicien**. |

## Repères en Amérique latine
| Repère | Ce qu’il faut savoir |
| Frida Kahlo (Mexique, 1907-1954) | Plus de cinquante autoportraits. *Las dos Fridas* (1939) montre deux Frida, l’une en robe européenne, l’autre en costume tehuana : une identité double. |
| Le guarani au Paraguay | Langue co-officielle avec l’espagnol (Constitution de 1992), parlée par la majorité de la population. |
| Le « spanglish » | Mélange d’anglais et d’espagnol des Latinos des États-Unis : *parquear* (se garer), *lonche* (déjeuner). |

## Le vocabulaire
| Espagnol | Français |
| el autorretrato | l’autoportrait |
| el rostro, los rasgos | le visage, les traits |
| la mirada | le regard |
| reflejar | refléter |
| el sentimiento de pertenencia | le sentiment d’appartenance |
| sentirse de | se sentir de (originaire de) |
| las raíces | les racines |
| la lengua materna | la langue maternelle |
| bilingüe | bilingue |

## Problématiques et documents
- *¿Qué revela un autorretrato de su autor y de su época?* Documents : *Las dos Fridas*, un autoportrait de Goya, un selfie retouché.
- *¿Se puede pertenecer a dos culturas a la vez?* Documents : un témoignage d’un jeune Latino aux États-Unis, une chanson en spanglish.
- *¿Hablar una lengua es tener una identidad?* Documents : un article sur l’enseignement du catalan, une carte des langues d’Espagne.

## Argumenter à l’oral
| Pour… | Dis… |
| Décrire | *En primer plano se ve…, al fondo aparece…* |
| Interpréter | *Parece que la pintora quiere mostrar…* |
| Donner ton avis | *A mi parecer…, creo que…* |
| Nuancer | *Sin embargo…, aunque…* |

> Un autoportrait ne montre jamais seulement un visage : il montre la place qu’une personne veut occuper dans son époque.

## Exemple travaillé : présenter *Las dos Fridas* en trois phrases
*Es un autorretrato de Frida Kahlo pintado en 1939. Se ven dos Fridas sentadas, unidas por una arteria: una lleva un vestido europeo y la otra un traje mexicano. Creo que la pintora expresa su doble identidad y el dolor de su separación con Diego Rivera.*`,
          },
          questions: [
            ['Qui a peint *Las Meninas* (1656), où il s’est représenté pinceau à la main ?', ['Goya', 'Velázquez', 'El Greco', 'Murillo'], 1, 'Diego Velázquez, peintre de la cour de Philippe IV, s’y montre à côté de l’infante Marguerite ; le tableau est au Prado.'],
            ['Que montre *Las dos Fridas* (1939) de Frida Kahlo ?', ['Deux sœurs jumelles', 'La peintre et sa mère', 'Deux Frida, l’une en robe européenne, l’autre en costume mexicain', 'Frida et Diego Rivera'], 2, 'Le tableau met en scène une identité double, européenne et mexicaine, reliée par une même artère.'],
            ['Quelles langues sont co-officielles dans leurs communautés en Espagne, à côté du castillan ?', ['Catalan, basque, galicien', 'Portugais, catalan, occitan', 'Basque, arabe, galicien', 'Andalou, catalan, basque'], 0, 'La Constitution de 1978 reconnaît ces langues dans leurs communautés autonomes ; l’andalou est un accent du castillan, pas une langue.'],
            ['Dans quel pays le guarani est-il langue co-officielle avec l’espagnol ?', ['Au Pérou', 'Au Mexique', 'En Bolivie seulement', 'Au Paraguay'], 3, 'Le Paraguay a fait du guarani une langue officielle en 1992 ; la majorité des Paraguayens le parlent.'],
            ['Que signifie *el autorretrato* ?', ['Le portrait de groupe', 'L’autoportrait', 'La caricature', 'La photo d’identité'], 1, '*Auto-* marque ce qu’on fait sur soi-même, comme en français.'],
            ['Que désigne le « spanglish » ?', ['L’espagnol parlé en Angleterre', 'Un dialecte des Canaries', 'Le mélange d’anglais et d’espagnol des Latinos des États-Unis', 'L’anglais appris en Espagne'], 2, 'Des mots comme *parquear* (se garer) ou *lonche* (déjeuner) viennent de l’anglais adapté à l’espagnol.'],
            ['Comment dire « le sentiment d’appartenance » ?', ['el sentimiento de pertenencia', 'el sentido de la partencia', 'la pertenencia sentida', 'el sentir de apartenencia'], 0, '*Pertenecer a* signifie « appartenir à », d’où *la pertenencia*.'],
            ['Quelle expression sert à décrire le premier plan d’une image ?', ['Al fondo aparece…', 'En primer plano se ve…', 'A mi parecer…', 'Sin embargo…'], 1, '*En primer plano* = au premier plan ; *al fondo* = à l’arrière-plan.'],
            ['Goya s’est peint vieilli et malade, sans chercher à se flatter.', ['Vrai', 'Faux'], 0, 'Ses autoportraits tardifs font du portrait un aveu plutôt qu’une vitrine.'],
            ['Que signifie *las raíces* dans *Tengo raíces mexicanas* ?', ['Les rêves', 'Les racines', 'Les voyages', 'Les parents'], 1, '*La raíz, las raíces* : les racines, au propre comme au figuré (les origines).'],
            ['Quel connecteur permet de NUANCER une idée à l’oral ?', ['En primer plano', 'Creo que', 'Sin embargo', 'Se ve'], 2, '*Sin embargo* = cependant : il introduit une réserve.'],
            ['Selon l’axe, un autoportrait ne renseigne que sur le visage du peintre.', ['Vrai', 'Faux'], 1, 'Il renseigne aussi sur son époque et sur la place qu’il veut y tenir : c’est tout l’enjeu de l’objet d’étude.'],
          ],
        },

        // ---- Axe 2 ---------------------------------------------------------
        {
          titre: 'Grands-parents, parents, enfants : ce qui se transmet',
          axe: 'Vivre entre générations',
          lecon: {
            titre: 'Transmettre et se comprendre d’une génération à l’autre',
            cours: `Dans le monde hispanique, la famille élargie tient une grande place, et les grands-parents sont souvent les gardiens d’une mémoire douloureuse. L’axe 2 t’invite à regarder ce qui passe — ou se perd — entre les générations.

## Ce que recouvre l’axe
1. **L’histoire en héritage** : ce que les aînés ont vécu et transmettent.
2. **Famille(s), les liens du sang ?** : familles recomposées, monoparentales, choisies.
3. **Se tourner vers les autres** pour consolider les liens intergénérationnels.

## Repères en Espagne
| Repère | Ce qu’il faut savoir |
| La guerre civile (1936-1939) et la dictature de Franco (1939-1975) | Beaucoup de familles ont longtemps gardé le silence ; ce sont souvent les petits-enfants qui posent les questions. |
| *Volver*, Pedro Almodóvar (2006) | Trois générations de femmes de la Manche, des secrets de famille et le retour d’une mère que l’on croyait morte. |
| *Alcarràs*, Carla Simón (Ours d’or 2022) | Une famille de cultivateurs de pêches en Catalogne : grands-parents, parents et enfants face à la fin d’un mode de vie. |
| Les grands-parents gardiens | En Espagne, les *abuelos* gardent très souvent les petits-enfants : un pilier discret de l’économie familiale. |

## Repères en Amérique latine
| Repère | Ce qu’il faut savoir |
| Les *Abuelas de Plaza de Mayo* (Argentine, 1977) | Des grands-mères cherchent les petits-enfants volés par la dictature (1976-1983) ; plus de 130 ont retrouvé leur identité. |
| *Coco* (Pixar, 2017) | Film situé au Mexique : un garçon découvre ses ancêtres le jour des morts ; la mémoire familiale y est vitale. |
| *Mafalda*, Quino (Argentine, 1964-1973) | Une petite fille qui interroge le monde des adultes : le regard d’une génération sur l’autre. |

## Le vocabulaire
| Espagnol | Français |
| los abuelos, los nietos | les grands-parents, les petits-enfants |
| la brecha generacional | le fossé des générations |
| heredar, la herencia | hériter, l’héritage |
| transmitir | transmettre |
| el recuerdo | le souvenir |
| criar, la crianza | élever, l’éducation (des enfants) |
| la familia monoparental | la famille monoparentale |
| llevarse bien con | bien s’entendre avec |
| convivir | vivre ensemble, cohabiter |

## Problématiques et documents
- *¿Qué nos transmiten nuestros abuelos?* Documents : une scène de *Coco*, un témoignage d’une grand-mère de la Plaza de Mayo.
- *¿La familia se define por la sangre?* Documents : une affiche de *Volver*, un article sur les familles recomposées.
- *¿Cómo acercar a los jóvenes y a los mayores?* Documents : un reportage sur des étudiants logés chez des personnes âgées.

## Argumenter à l’oral
| Pour… | Dis… |
| Comparer | *Mientras que los jóvenes…, los mayores…* |
| Exprimer une cause | *Esto se debe a que…* |
| Concéder | *Es verdad que…, pero…* |
| Conclure | *En resumen…, para concluir…* |

> Entre générations, on n’hérite pas seulement de biens : on hérite de souvenirs, de silences et de questions.

## Exemple travaillé : réagir à un document
*En este documento vemos a una abuela argentina que busca a su nieto. Es verdad que la dictadura terminó en 1983, pero la herida sigue abierta. Creo que su lucha demuestra que la memoria se transmite de una generación a otra.*`,
          },
          questions: [
            ['Que cherchent les *Abuelas de Plaza de Mayo* ?', ['Les tombes de leurs maris', 'Leurs petits-enfants volés par la dictature', 'Un emploi pour leurs enfants', 'La reconnaissance de leur langue'], 1, 'Fondées en 1977 en Argentine, elles ont aidé plus de 130 petits-enfants à retrouver leur identité.'],
            ['Quelles années la dictature argentine couvre-t-elle ?', ['1939-1975', '1973-1990', '1976-1983', '1910-1920'], 2, 'La junte militaire gouverne l’Argentine de 1976 à 1983 ; 1939-1975 est la dictature de Franco.'],
            ['Quel film de Pedro Almodóvar réunit trois générations de femmes autour de secrets de famille ?', ['Volver', 'Alcarràs', 'Coco', 'Mafalda'], 0, '*Volver* (2006) se passe entre Madrid et la Manche.'],
            ['Que signifie *la brecha generacional* ?', ['L’héritage familial', 'La retraite', 'La crise du logement', 'Le fossé des générations'], 3, '*La brecha* : la brèche, l’écart.'],
            ['Quel film a remporté l’Ours d’or en 2022 avec une famille de cultivateurs catalans ?', ['Volver', 'Alcarràs', 'Roma', 'Coco'], 1, 'Carla Simón y filme trois générations face à la fin de leur verger.'],
            ['Comment dit-on « les petits-enfants » ?', ['los sobrinos', 'los primos', 'los nietos', 'los hijos'], 2, '*Los nietos* ; *los sobrinos* = neveux, *los primos* = cousins.'],
            ['Où se passe le film *Coco* (Pixar, 2017) ?', ['Au Mexique', 'En Espagne', 'En Argentine', 'Au Pérou'], 0, 'Il se déroule pendant le jour des morts mexicain, fête de la mémoire des ancêtres.'],
            ['Quelle expression introduit une concession ?', ['Esto se debe a que…', 'Es verdad que…, pero…', 'En resumen…', 'Mientras que…'], 1, '*Es verdad que…, pero…* reconnaît un point avant de le dépasser.'],
            ['*Mafalda* est une bande dessinée argentine de Quino.', ['Vrai', 'Faux'], 0, 'Publiée de 1964 à 1973, elle montre une petite fille qui interroge le monde des adultes.'],
            ['Que signifie *llevarse bien con alguien* ?', ['Emmener quelqu’un', 'Bien s’entendre avec quelqu’un', 'Porter quelqu’un', 'Se séparer de quelqu’un'], 1, 'Expression très utile pour parler des relations familiales.'],
            ['Quand la dictature de Franco a-t-elle pris fin ?', ['En 1939', 'En 1982', 'En 1936', 'En 1975'], 3, 'Franco meurt en novembre 1975 ; commence alors la Transition démocratique.'],
            ['Que veut dire *heredar* ?', ['Transmettre', 'Se souvenir', 'Hériter', 'Élever'], 2, '*Heredar* = hériter, *la herencia* = l’héritage ; *transmitir* = transmettre.'],
          ],
        },

        // ---- Axe 3 ---------------------------------------------------------
        {
          titre: 'Fêtes, monuments, récits : le passé toujours vivant',
          axe: 'Le passé dans le présent',
          lecon: {
            titre: 'Comment le passé habite le présent hispanique',
            cours: `Dans le monde hispanique, le passé ne reste pas au musée : il défile dans les rues, se célèbre chaque année et fait encore débat. L’axe 3 te fait voir ces traces vivantes.

## Ce que recouvre l’axe
1. **Sur les traces du passé** : appréhender un héritage culturel (monuments, sites, traditions).
2. **Les fêtes traditionnelles** qui rythment le calendrier du monde hispanique.
3. **Le récit national** : entre célébration, réinterprétation et opposition.

## Repères : le patrimoine
| Lieu | Ce qu’il faut savoir |
| L’Alhambra de Grenade | Palais des souverains nasrides, derniers rois musulmans d’al-Andalus ; Grenade tombe en 1492 aux mains des Rois catholiques. |
| Chichén Itzá (Yucatán, Mexique) | Grande cité maya ; la pyramide de Kukulcán projette un serpent d’ombre aux équinoxes. |
| Teotihuacan (Mexique) | Cité précolombienne des pyramides du Soleil et de la Lune. |

## Repères : les fêtes
| Fête | Où, quand | Ce qu’on célèbre |
| Las Fallas | Valence, mars | Des figures géantes brûlées le 19 mars ; patrimoine de l’UNESCO depuis 2016. |
| San Fermín | Pampelune, 6-14 juillet | Les *encierros*, course devant les taureaux, rendus célèbres par Hemingway. |
| La Semana Santa | Toute l’Espagne, printemps | Processions de confréries, surtout en Andalousie. |
| El Día de Muertos | Mexique, 1er et 2 novembre | On accueille les défunts avec des autels (*ofrendas*), des calaveras en sucre et des fleurs de *cempasúchil*. |
| El Inti Raymi | Cuzco, Pérou, 24 juin | La fête inca du Soleil, rejouée à Sacsayhuamán. |

## Repères : le récit national en débat
Le **12 octobre** (arrivée de Colomb en 1492) est la *Fiesta Nacional* de l’Espagne. En Amérique, ce jour a été rebaptisé : **Día de la Resistencia Indígena** au Venezuela (2002), **Día del Respeto a la Diversidad Cultural** en Argentine (2010). Même date, trois récits.

## Le vocabulaire
| Espagnol | Français |
| el patrimonio | le patrimoine |
| la huella | la trace |
| la fiesta patronal | la fête du saint patron |
| el desfile, la procesión | le défilé, la procession |
| conmemorar | commémorer |
| la conquista | la conquête |
| los pueblos originarios | les peuples autochtones |
| el antepasado | l’ancêtre |

## Problématiques et documents
- *¿Por qué seguimos celebrando fiestas tan antiguas?* Documents : photos des Fallas, affiche du Día de Muertos.
- *¿El 12 de octubre: celebración o polémica?* Documents : deux articles, l’un espagnol, l’autre latino-américain.
- *¿Cómo conservar un patrimonio visitado por millones de turistas?* Document : un reportage sur l’Alhambra.

## Argumenter à l’oral
| Pour… | Dis… |
| Situer | *Esta fiesta se celebra en… desde…* |
| Opposer deux points de vue | *Para unos…, para otros…* |
| Montrer une évolution | *Hoy en día…, antes…* |
| Donner ton avis | *Me parece importante que…* (+ subjonctif) |

> Une fête est un passé que l’on rejoue chaque année : c’est pour cela qu’elle change, et qu’elle fait parfois débat.

## Exemple travaillé
*El Día de Muertos se celebra en México el 1 y el 2 de noviembre. Las familias preparan ofrendas con fotos, flores y comida para recibir a sus difuntos. Para unos es una tradición religiosa, para otros una fiesta de la memoria: en los dos casos, el pasado sigue presente.*`,
          },
          questions: [
            ['Quand se célèbre le Día de Muertos au Mexique ?', ['Le 12 octobre', 'Les 1er et 2 novembre', 'Le 24 juin', 'Le 19 mars'], 1, 'Les familles dressent des *ofrendas* pour accueillir leurs défunts.'],
            ['Dans quelle ville ont lieu les Fallas ?', ['Séville', 'Pampelune', 'Valence', 'Cuzco'], 2, 'Les figures géantes y brûlent le 19 mars ; la fête est au patrimoine de l’UNESCO depuis 2016.'],
            ['Que fête-t-on lors de l’Inti Raymi à Cuzco ?', ['Le Soleil, dans la tradition inca', 'L’indépendance du Pérou', 'La Vierge Marie', 'La récolte du café'], 0, '*Inti* signifie « soleil » en quechua ; la fête a lieu le 24 juin.'],
            ['Quels souverains ont bâti l’Alhambra de Grenade ?', ['Les Rois catholiques', 'Les Incas', 'Les Wisigoths', 'Les Nasrides'], 3, 'Derniers rois musulmans d’al-Andalus, les Nasrides perdent Grenade en 1492.'],
            ['Sous quel nom le Venezuela commémore-t-il le 12 octobre depuis 2002 ?', ['Fiesta Nacional', 'Día de la Resistencia Indígena', 'Día de la Hispanidad', 'Día de Muertos'], 1, 'Le changement de nom retourne le récit : on célèbre la résistance, pas l’arrivée de Colomb.'],
            ['Que sont les *encierros* de San Fermín ?', ['Des processions religieuses', 'Des feux d’artifice', 'Des courses devant les taureaux dans les rues', 'Des concours de danse'], 2, 'Ils ont lieu à Pampelune du 7 au 14 juillet, pendant les fêtes qui s’ouvrent le 6.'],
            ['Que signifie *la huella* ?', ['La trace', 'La fête', 'La guerre', 'La maison'], 0, '*Seguir las huellas del pasado* = suivre les traces du passé.'],
            ['Chichén Itzá est une cité…', ['Inca', 'Aztèque de Tenochtitlan', 'Romaine', 'Maya'], 3, 'Elle se trouve dans la péninsule du Yucatán, au Mexique.'],
            ['Le 12 octobre est la fête nationale de l’Espagne.', ['Vrai', 'Faux'], 0, 'La *Fiesta Nacional* commémore l’arrivée de Colomb en Amérique en 1492.'],
            ['Quelle tournure oppose deux points de vue ?', ['Hoy en día…', 'Para unos…, para otros…', 'Se celebra en…', 'Me parece importante'], 1, 'Elle est précieuse pour présenter un débat comme celui du 12 octobre.'],
            ['Comment dit-on « les peuples autochtones » ?', ['los pueblos originarios', 'los pueblos antiguos', 'los primeros vecinos', 'los indianos'], 0, 'On dit aussi *pueblos indígenas* ; *indiano* désigne un Espagnol revenu enrichi d’Amérique.'],
            ['Après *Me parece importante que…*, quel mode faut-il ?', ['L’indicatif', 'L’infinitif', 'Le subjonctif', 'Le gérondif'], 2, 'Un jugement de valeur suivi de *que* entraîne le subjonctif : *Me parece importante que se conserve*.'],
          ],
        },

        // ---- Axe 4 ---------------------------------------------------------
        {
          titre: 'Villes, jeunesse, tourisme : un monde qui change',
          axe: 'Défis et transitions',
          lecon: {
            titre: 'Les défis du monde hispanique d’aujourd’hui',
            cours: `Climat, logement, tourisme de masse, engagement des jeunes : l’Espagne et l’Amérique latine inventent des réponses que le monde entier observe. L’axe 4 te fait étudier ces transitions.

## Ce que recouvre l’axe
1. **La ville de demain** : répondre aux défis environnementaux et sociaux.
2. **L’engagement de la jeunesse**.
3. **Le tourisme, une (r)évolution en marche ?**

## Repères : la ville
| Repère | Ce qu’il faut savoir |
| Les *superilles* de Barcelone | Depuis 2016 (quartier de Poblenou), des îlots de rues rendus aux piétons, aux arbres et aux jeux. |
| Madrid Central (2018) | Zone à faibles émissions au cœur de Madrid, pour réduire la pollution de l’air. |
| Le Metrocable de Medellín (Colombie, 2004) | Un téléphérique relie les quartiers pauvres des collines au métro : un transport devenu outil d’intégration. |

## Repères : la jeunesse
| Repère | Ce qu’il faut savoir |
| Le 15-M (15 mai 2011) | Les « Indignés » occupent la Puerta del Sol à Madrid contre le chômage et la crise. |
| Les jeunes pour le climat | Grèves scolaires pour le climat à partir de 2019, en Espagne comme au Chili ou en Argentine. |
| Le chômage des jeunes | En Espagne, il reste parmi les plus élevés de l’Union européenne. |

## Repères : le tourisme
| Repère | Ce qu’il faut savoir |
| Un pays très visité | L’Espagne reçoit chaque année plus de 80 millions de touristes étrangers. |
| *Canarias tiene un límite* | Le 20 avril 2024, des dizaines de milliers de Canariens manifestent contre le tourisme de masse et la hausse des loyers. |
| Machu Picchu (Pérou) | Le nombre de visiteurs par jour est limité pour protéger le site. |

## Le vocabulaire
| Espagnol | Français |
| el medio ambiente | l’environnement |
| la contaminación | la pollution |
| el cambio climático | le changement climatique |
| peatonal | piétonnier |
| el alquiler | le loyer, la location |
| comprometerse, el compromiso | s’engager, l’engagement |
| la manifestación | la manifestation |
| el turismo masivo | le tourisme de masse |
| sostenible | durable |

## Problématiques et documents
- *¿Cómo será la ciudad del mañana?* Documents : plan d’une *superilla*, photo du Metrocable.
- *¿Los jóvenes pueden cambiar la sociedad?* Documents : photos du 15-M, affiche d’une grève pour le climat.
- *¿El turismo: riqueza o amenaza?* Documents : une pancarte « Canarias tiene un límite », un graphique du nombre de touristes.

## Argumenter à l’oral
| Pour… | Dis… |
| Présenter un problème | *El problema es que…* |
| Proposer une solution | *Habría que…, sería necesario…* |
| Exprimer un avantage / un inconvénient | *La ventaja es que…, el inconveniente es que…* |
| Exprimer un souhait | *Ojalá…* (+ subjonctif) |

> Une transition réussie concilie deux choses qui s’opposent souvent : vivre de l’économie et protéger les habitants et leur environnement.

## Exemple travaillé
*El turismo trae riqueza a Canarias, pero el problema es que los alquileres suben y los habitantes no pueden vivir en su propia isla. Habría que limitar los pisos turísticos. Ojalá el turismo sea más sostenible.*`,
          },
          questions: [
            ['Que sont les *superilles* de Barcelone ?', ['Des îlots de rues rendus aux piétons et à la verdure', 'Des îles artificielles', 'Des immeubles de luxe', 'Des lignes de métro'], 0, 'Lancées à Poblenou en 2016, elles réduisent la place de la voiture.'],
            ['Que relie le Metrocable de Medellín, ouvert en 2004 ?', ['L’aéroport au centre', 'Deux stades', 'Les quartiers des collines au métro', 'Deux pays voisins'], 2, 'Ce téléphérique a désenclavé des quartiers pauvres : un transport devenu outil d’intégration.'],
            ['Que désigne le « 15-M » ?', ['Une loi sur le climat', 'Le mouvement des Indignés né le 15 mai 2011 à Madrid', 'Une fête valencienne', 'Un plan d’urbanisme'], 1, 'Les jeunes ont occupé la Puerta del Sol contre le chômage et la crise.'],
            ['Contre quoi protestent les manifestants de *Canarias tiene un límite* (avril 2024) ?', ['Contre la sécheresse', 'Contre l’indépendance', 'Contre la fermeture des écoles', 'Contre le tourisme de masse et la hausse des loyers'], 3, 'Ils dénoncent un modèle où les habitants ne peuvent plus se loger sur leurs îles.'],
            ['Que signifie *sostenible* ?', ['Solide', 'Durable', 'Soutenu', 'Lourd'], 1, '*El desarrollo sostenible* = le développement durable.'],
            ['Comment dit-on « le loyer » ?', ['el alquiler', 'el piso', 'el precio', 'el alojamiento'], 0, '*Alquilar* = louer ; *el alquiler* = le loyer ou la location.'],
            ['Quelle formule sert à PROPOSER une solution ?', ['El problema es que…', 'La ventaja es que…', 'Habría que…', 'Ojalá…'], 2, '*Habría que* + infinitif = il faudrait.'],
            ['Après *Ojalá*, on emploie…', ['L’indicatif présent', 'Le futur', 'L’infinitif', 'Le subjonctif'], 3, '*Ojalá* exprime un souhait : *Ojalá llueva*.'],
            ['Madrid Central est une zone à faibles émissions créée en 2018.', ['Vrai', 'Faux'], 0, 'Elle limite l’accès des véhicules les plus polluants au centre de Madrid.'],
            ['Pourquoi limite-t-on le nombre de visiteurs quotidiens au Machu Picchu ?', ['Pour augmenter les prix', 'Pour protéger le site', 'Pour des raisons religieuses', 'À cause de la guerre'], 1, 'Trop de visiteurs abîment la cité inca ; les quotas protègent le patrimoine.'],
            ['Que signifie *comprometerse* ?', ['Promettre en mariage', 'Compromettre', 'S’engager', 'Comprendre'], 2, 'Faux ami partiel : *un joven comprometido* est un jeune engagé.'],
            ['L’Espagne reçoit chaque année moins de 20 millions de touristes étrangers.', ['Vrai', 'Faux'], 1, 'Elle en reçoit plus de 80 millions : c’est l’une des premières destinations du monde.'],
          ],
        },

        // ---- Axe 5 ---------------------------------------------------------
        {
          titre: 'Revisiter les chefs-d’œuvre, la mode et les légendes',
          axe: 'Créer et recréer',
          lecon: {
            titre: 'Créer à partir de ce qui existe déjà',
            cours: `Créer, ce n’est pas toujours partir de rien : Picasso refait Velázquez, Botero grossit la Joconde, la mode puise dans les costumes traditionnels, les légendes renaissent au cinéma. L’axe 5 t’apprend à reconnaître ces reprises.

## Ce que recouvre l’axe
1. **L’art revisité** : réinterprétations et détournements d’œuvres connues.
2. **La mode** : à l’image de la société ?
3. **Contes et légendes** d’hier à aujourd’hui.

## Repères : l’art revisité
| Œuvre | Ce qu’il faut savoir |
| *Las Meninas*, Picasso (1957) | Picasso peint **58 toiles** d’après le tableau de Velázquez ; elles sont au Museu Picasso de Barcelone. |
| Fernando Botero (Colombie, 1932-2023) | Il reprend des chefs-d’œuvre avec ses figures rondes : *Mona Lisa a los doce años* (1959). |
| Salvador Dalí (1904-1989) | Le surréaliste détourne les objets familiers : les montres molles de *La persistance de la mémoire* (1931). |

## Repères : la mode
| Repère | Ce qu’il faut savoir |
| Cristóbal Balenciaga (né à Getaria, 1895) | Grand couturier basque, inspiré par les costumes espagnols et les habits religieux. |
| Zara (Inditex, fondée en 1975 en Galice) | Symbole de la mode rapide mondiale, et de ses critiques : surconsommation, conditions de travail. |
| Carolina Herrera (Venezuela) | Créatrice installée à New York, accusée par le Mexique en 2019 d’avoir repris des motifs indigènes sans les citer : le débat sur l’**appropriation culturelle**. |

## Repères : contes et légendes
| Légende | Ce qu’il faut savoir |
| La Llorona (Mexique) | Une femme en pleurs qui erre la nuit en cherchant ses enfants ; reprise au cinéma et en chanson. |
| El Dorado (Colombie) | Le mythe d’un roi couvert d’or, né d’un rite muisca à la lagune de Guatavita ; il a lancé les conquistadors à la recherche d’une cité imaginaire. |
| Don Quichotte (Cervantes, 1605 et 1615) | Un chevalier qui prend des moulins pour des géants : sans cesse réécrit, dessiné, adapté. |

## Le vocabulaire
| Espagnol | Français |
| la obra maestra | le chef-d’œuvre |
| la versión, reinterpretar | la version, réinterpréter |
| el homenaje | l’hommage |
| la parodia | la parodie |
| inspirarse en | s’inspirer de |
| el diseñador, la diseñadora | le créateur, la créatrice (de mode) |
| la moda rápida | la mode rapide |
| la leyenda, el cuento | la légende, le conte |

## Problématiques et documents
- *¿Copiar es crear?* Documents : *Las Meninas* de Velázquez et une version de Picasso côte à côte.
- *¿La moda refleja la sociedad?* Documents : une publicité de mode, un article sur la mode rapide.
- *¿Por qué las leyendas siguen vivas?* Documents : une affiche de film sur La Llorona.

## Argumenter à l’oral
| Pour… | Dis… |
| Comparer deux œuvres | *A diferencia del original…, en esta versión…* |
| Parler d’une reprise | *El artista se inspira en…, rinde homenaje a…* |
| Juger | *Me llama la atención…, lo que más me gusta es…* |

> Reprendre une œuvre, c’est dialoguer avec elle : l’hommage, la parodie et le détournement disent autant sur le nouvel artiste que sur l’ancien.

## Exemple travaillé
*A diferencia del cuadro de Velázquez, la versión de Picasso es casi en blanco y negro y las figuras están deformadas. El artista rinde homenaje al maestro, pero también impone su propio estilo. Lo que más me llama la atención es la libertad de las formas.*`,
          },
          questions: [
            ['Combien de toiles Picasso a-t-il peintes d’après *Las Meninas* en 1957 ?', ['3', '12', '58', '100'], 2, 'Cette série de 58 œuvres est conservée au Museu Picasso de Barcelone.'],
            ['Quel artiste colombien est connu pour ses figures rondes, comme *Mona Lisa a los doce años* ?', ['Fernando Botero', 'Diego Rivera', 'Joan Miró', 'Frida Kahlo'], 0, 'Botero (1932-2023) a revisité de nombreux chefs-d’œuvre avec ses volumes généreux.'],
            ['Quel tableau de Dalí montre des montres molles ?', ['Guernica', 'Las Meninas', 'Las dos Fridas', 'La persistance de la mémoire'], 3, 'Peint en 1931, c’est une icône du surréalisme.'],
            ['Dans quelle région d’Espagne est née l’entreprise Zara ?', ['En Catalogne', 'En Galice', 'En Andalousie', 'À Madrid'], 1, 'Inditex, maison mère de Zara, a été fondée en 1975 en Galice (siège à Arteixo).'],
            ['Que reprochait le Mexique à Carolina Herrera en 2019 ?', ['Des prix trop élevés', 'Des défilés trop longs', 'D’avoir repris des motifs indigènes sans les citer', 'D’avoir quitté le Venezuela'], 2, 'Le débat porte sur l’appropriation culturelle.'],
            ['Qui est La Llorona ?', ['Une femme en pleurs qui cherche ses enfants la nuit', 'Une reine inca', 'Une sainte andalouse', 'Une chanteuse de flamenco'], 0, 'Cette légende mexicaine a été reprise au cinéma et en chanson.'],
            ['D’où vient le mythe d’El Dorado ?', ['D’un roman de Cervantes', 'D’un rite muisca à la lagune de Guatavita', 'D’une mine du Potosí', 'D’un tableau du Prado'], 1, 'Un chef se couvrait de poudre d’or : les conquistadors en ont fait une cité d’or imaginaire.'],
            ['Que signifie *la obra maestra* ?', ['Le maître d’école', 'L’œuvre de jeunesse', 'Le musée', 'Le chef-d’œuvre'], 3, 'Littéralement « l’œuvre maîtresse ».'],
            ['Comment dit-on « s’inspirer de » ?', ['inspirarse de', 'inspirarse en', 'inspirar a', 'inspirarse con'], 1, 'Attention à la préposition : *inspirarse en*.'],
            ['Cristóbal Balenciaga était un couturier basque.', ['Vrai', 'Faux'], 0, 'Né à Getaria en 1895, il s’inspirait des costumes espagnols.'],
            ['Quelle expression permet de comparer une reprise à son modèle ?', ['Ojalá…', 'A diferencia del original…', 'Esto se debe a que…', 'Habría que…'], 1, '*A diferencia de* = à la différence de.'],
            ['*Rendir homenaje a* signifie…', ['Rendre un devoir', 'Critiquer', 'Rendre hommage à', 'Copier'], 2, '*El artista rinde homenaje a Velázquez.*'],
          ],
        },

        // ---- Axe 6 ---------------------------------------------------------
        {
          titre: 'Madrid, la mer et les clichés : une autre Espagne',
          axe: 'L’Espagne au-delà des clichés',
          lecon: {
            titre: 'Dépasser la carte postale : l’Espagne réelle',
            cours: `Soleil, flamenco, paella, corrida : l’image de l’Espagne à l’étranger tient souvent en quatre mots. L’axe 6, propre à l’espagnol et **obligatoire** en 2de, te demande de dépasser ces clichés pour voir un pays de paysages, de langues et de cultures très variés.

## Ce que recouvre l’axe
1. **Les représentations de la culture espagnole** : dépasser les stéréotypes.
2. **Madrid, une capitale fascinante**.
3. **La mer, une ressource de premier ordre**.

## Un pays pluriel
- **17 communautés autonomes** et 2 villes autonomes (Ceuta et Melilla), avec leurs institutions, leurs fêtes et parfois leur langue.
- Des paysages très contrastés : la Galice verte et pluvieuse, la Meseta sèche du centre, les Pyrénées, le désert de Tabernas (Almería), les îles Canaries volcaniques (le Teide, 3 715 m, point culminant de l’Espagne).
- **Le flamenco** est andalou et gitan (patrimoine immatériel de l’UNESCO depuis 2010) ; **la paella** est valencienne ; **la corrida** fait débat : le Parlement de Catalogne l’a interdite en 2010, une décision annulée par le Tribunal constitutionnel en 2016.

## Madrid
| Repère | Ce qu’il faut savoir |
| Capitale depuis 1561 | Philippe II y installe la cour. |
| La Puerta del Sol | Le « kilomètre zéro » des routes d’Espagne ; on y mange les douze raisins à minuit le 31 décembre. |
| Le Paseo del Prado et le Retiro | Inscrits à l’UNESCO en 2021 (« Paysage de la lumière ») : Prado, Thyssen, Reina Sofía, où se trouve *Guernica* de Picasso (1937). |
| La Movida madrileña | Explosion culturelle des années 1980, après la dictature : Almodóvar y fait ses débuts. |

## La mer
| Repère | Ce qu’il faut savoir |
| Près de 8 000 km de côtes | Méditerranée, Atlantique, Cantabrique : pêche, commerce, tourisme. |
| La pêche | L’Espagne a la première flotte de pêche de l’Union européenne ; Vigo (Galice) est l’un des premiers ports de pêche d’Europe. |
| Le *Prestige* (2002) | Marée noire au large de la Galice ; des milliers de bénévoles nettoient les plages, le mouvement *Nunca Máis* naît. |
| La Mar Menor (Murcie) | Lagune polluée par l’agriculture intensive ; en 2022, une loi lui donne la personnalité juridique, une première en Europe. |

## Le vocabulaire
| Espagnol | Français |
| el tópico, el estereotipo | le cliché, le stéréotype |
| la comunidad autónoma | la communauté autonome |
| el paisaje | le paysage |
| la costa, el litoral | la côte, le littoral |
| la pesca, el pescador | la pêche, le pêcheur |
| la marea negra | la marée noire |
| la capital, el madrileño | la capitale, le Madrilène |
| diverso, la diversidad | varié, la diversité |

## Problématiques et documents
- *¿Qué hay detrás de los tópicos sobre España?* Documents : une affiche touristique des années 1960, une carte des communautés autonomes.
- *¿Por qué Madrid fascina?* Documents : une photo de la Puerta del Sol, *Guernica*.
- *¿El mar: riqueza en peligro?* Documents : photos du *Prestige*, un article sur la Mar Menor.

## Argumenter à l’oral
| Pour… | Dis… |
| Dénoncer un cliché | *Se suele pensar que…, pero en realidad…* |
| Généraliser prudemment | *No todos los españoles…* |
| Illustrer | *Por ejemplo…, es el caso de…* |

> Un cliché n’est pas toujours faux, il est surtout incomplet : le flamenco existe, mais il n’est ni galicien ni basque.

## Exemple travaillé
*Se suele pensar que en España siempre hace sol, pero en realidad en Galicia llueve mucho y el paisaje es muy verde. Por ejemplo, Vigo vive de la pesca y no del turismo de playa. No todos los españoles bailan flamenco: es una tradición andaluza.*`,
          },
          questions: [
            ['Combien l’Espagne compte-t-elle de communautés autonomes ?', ['12', '17', '22', '50'], 1, 'Dix-sept communautés, plus les villes autonomes de Ceuta et Melilla.'],
            ['Depuis quand Madrid est-elle la capitale de l’Espagne ?', ['1492', '1812', '1561', '1978'], 2, 'Philippe II y installe la cour en 1561.'],
            ['Dans quel musée madrilène se trouve *Guernica* de Picasso ?', ['Le Reina Sofía', 'Le Prado', 'Le Thyssen', 'Le Museu Picasso'], 0, 'Le tableau de 1937 y est exposé depuis 1992.'],
            ['Quelle catastrophe a touché la Galice en 2002 ?', ['Un tremblement de terre', 'Une sécheresse historique', 'Une éruption volcanique', 'La marée noire du *Prestige*'], 3, 'Le mouvement citoyen *Nunca Máis* est né de cette catastrophe.'],
            ['Qu’a obtenu la lagune de la Mar Menor en 2022 ?', ['Le statut de parc national', 'La personnalité juridique', 'L’inscription à l’UNESCO', 'Une interdiction de baignade définitive'], 1, 'Une première en Europe : la lagune peut être défendue en justice pour elle-même.'],
            ['De quelle région le flamenco est-il originaire ?', ['La Galice', 'Le Pays basque', 'L’Andalousie', 'La Catalogne'], 2, 'Il est andalou et gitan, inscrit à l’UNESCO en 2010.'],
            ['Que désigne la Puerta del Sol ?', ['Une plage de Valence', 'Une porte de l’Alhambra', 'Un musée', 'Le kilomètre zéro des routes d’Espagne'], 3, 'C’est aussi là qu’on mange les douze raisins du Nouvel An.'],
            ['Que signifie *el tópico* ?', ['Le cliché', 'Le sujet d’examen', 'Le tropique', 'Le touriste'], 0, 'Faux ami : *un tópico* est un lieu commun, un cliché.'],
            ['La paella est un plat originaire de Valence.', ['Vrai', 'Faux'], 0, 'C’est un plat valencien, pas un plat « national » partagé partout.'],
            ['Comment dit-on « la marée noire » ?', ['la marea oscura', 'la marea negra', 'la ola negra', 'el mar sucio'], 1, '*Negro* ici, comme en français « noire ».'],
            ['Quelle formule sert à contredire un cliché ?', ['Por ejemplo…', 'Es el caso de…', 'Se suele pensar que…, pero en realidad…', 'Me llama la atención…'], 2, '*Soler* + infinitif exprime l’habitude : « on a coutume de penser ».'],
            ['Quel est le point culminant de l’Espagne ?', ['Le Mulhacén', 'L’Aneto', 'Le Teide', 'Le Montserrat'], 2, 'Le Teide, volcan de Tenerife (Canaries), culmine à 3 715 m ; le Mulhacén est le plus haut sommet de la péninsule.'],
          ],
        },
      ],
    },

    // ======================================================================
    // LA GRAMMAIRE DE SECONDE (A2 → B1)
    // ======================================================================
    {
      niveaux: ['2de'],
      positionDepart: 46,
      rayon: 'langue',
      chapitres: [
        {
          titre: 'L’impératif affirmatif et négatif',
          axe: 'Les temps',
          lecon: {
            titre: 'Donner un ordre, l’interdire',
            cours: `Donner un ordre en espagnol, c’est jongler entre deux temps : l’impératif pour dire « fais », le subjonctif pour dire « ne fais pas ». Et les pronoms changent de place selon le cas.

## L’impératif affirmatif
| Personne | Formation | hablar | comer | vivir |
| tú | 3e pers. du sing. du présent | habla | come | vive |
| usted | subjonctif présent | hable | coma | viva |
| nosotros | subjonctif présent | hablemos | comamos | vivamos |
| vosotros | infinitif : -r devient -d | hablad | comed | vivid |
| ustedes | subjonctif présent | hablen | coman | vivan |

> Seules les formes **tú** et **vosotros** sont de « vrais » impératifs ; toutes les autres viennent du subjonctif présent.

## Les huit irréguliers à la personne tú
| Infinitif | Impératif | Infinitif | Impératif |
| decir | di | salir | sal |
| hacer | haz | ser | sé |
| ir | ve | tener | ten |
| poner | pon | venir | ven |

Les verbes à diphtongue gardent leur diphtongue : *cierra, vuelve, pide*.

## L’impératif négatif
On emploie **no + subjonctif présent** à toutes les personnes :
| Affirmatif | Négatif |
| habla | no hables |
| come | no comas |
| haz | no hagas |
| hablad | no habléis |

## La place des pronoms
1. À l’affirmatif, les pronoms se **soudent** à la fin du verbe (enclise) : *dímelo, levántate, cómpralo*. On ajoute un accent écrit pour garder l’accent tonique.
2. Au négatif, ils se placent **devant** le verbe : *no me lo digas, no te levantes*.
3. Avec **nosotros**, le -s tombe devant *nos* : *sentemos + nos → sentémonos*.
4. Avec **vosotros**, le -d tombe devant *os* : *levantad + os → levantaos* (seule exception : *idos*).

## Exemple travaillé
Transforme « Dis-le-moi » puis « Ne me le dis pas » :
1. Impératif tú de *decir* : **di**.
2. Pronoms COI puis COD : *me* + *lo* → *dímelo* (accent sur *í*).
3. Négatif : *no* + subjonctif *digas*, pronoms devant → **no me lo digas**.

## Les pièges
| Faux | Juste | Pourquoi |
| no habla (ordre) | no hables | le négatif passe au subjonctif |
| sentémosnos | sentémonos | le -s tombe devant nos |
| levantados | levantaos | le -d tombe devant os |
| hace eso | haz eso | impératif irrégulier de hacer |`,
          },
          questions: [
            ['Quel est l’impératif (tú) de *hacer* ?', ['hace', 'haga', 'haz', 'hazte'], 2, '*Hacer* fait partie des huit irréguliers : *haz*.'],
            ['Comment se forme l’impératif négatif ?', ['no + infinitif', 'no + subjonctif présent', 'no + impératif', 'no + présent de l’indicatif'], 1, 'À toutes les personnes : *no hables, no comáis, no hagan*.'],
            ['Quel est l’impératif vosotros de *comer* ?', ['comed', 'comáis', 'comad', 'comid'], 0, 'On remplace le -r de l’infinitif par -d.'],
            ['Comment dit-on « Ne me le dis pas » (tú) ?', ['No dímelo', 'No me lo dices', 'No lo me digas', 'No me lo digas'], 3, 'Au négatif, les pronoms précèdent le verbe, au subjonctif, dans l’ordre COI + COD.'],
            ['*Sentémonos* : pourquoi le -s de *sentemos* disparaît-il ?', ['C’est une faute d’orthographe tolérée', 'Il tombe devant le pronom nos', 'Parce que le verbe est irrégulier', 'Parce que c’est du subjonctif'], 1, 'On écrit *sentémonos*, *vámonos*.'],
            ['Quel est l’impératif tú de *salir* ?', ['sal', 'sale', 'salga', 'sali'], 0, '*Salir → sal*, comme *poner → pon*, *venir → ven*, *tener → ten*.'],
            ['Quelle forme correspond à « Lève-toi » (tú) ?', ['Te levanta', 'Levantate', 'Levántate', 'Te levantes'], 2, 'Enclise du pronom et accent écrit pour garder l’accent tonique sur *-van-*.'],
            ['Pour *usted*, l’impératif affirmatif emprunte ses formes…', ['À l’indicatif présent', 'Au futur', 'À l’infinitif', 'Au subjonctif présent'], 3, '*Hable usted, coma usted, siéntese.*'],
            ['*Levantaos* est la forme correcte de l’impératif vosotros de *levantarse*.', ['Vrai', 'Faux'], 0, 'Le -d tombe devant *os* ; seule exception : *idos*.'],
            ['Quel est l’impératif tú de *ser* ?', ['es', 'sé', 'sea', 'sed'], 1, '*Sé bueno* = sois sage ; *sed* est la forme vosotros.'],
            ['Quelle phrase est une défense correcte adressée à un ami ?', ['No toca eso', 'No toques eso', 'No tocar eso', 'No tócalo'], 1, 'Défense = *no* + subjonctif : *no toques*.'],
            ['Quel est l’impératif tú de *volver* ?', ['volve', 'vuelva', 'vuelve', 'volved'], 2, 'La diphtongue se maintient : 3e personne du présent, *vuelve*.'],
          ],
        },
        {
          titre: 'Por ou para ?',
          axe: 'Les prépositions',
          lecon: {
            titre: 'Deux prépositions pour un seul « pour »',
            cours: `Le français dit « pour » ; l’espagnol hésite entre *por* et *para*. La règle tient en une image : **para regarde vers le but**, **por regarde vers la cause et le chemin**.

## Para : le but, la destination
| Emploi | Exemple | Traduction |
| But (+ infinitif) | *Estudio para aprobar.* | pour réussir |
| Destination | *Salgo para Madrid.* | je pars pour Madrid |
| Destinataire | *Este regalo es para ti.* | pour toi |
| Date limite | *Para el lunes.* | pour lundi |
| Point de vue | *Para mí, es fácil.* | selon moi |
| Comparaison | *Es alto para su edad.* | pour son âge |

## Por : la cause, le moyen, le passage
| Emploi | Exemple | Traduction |
| Cause | *Lo hizo por amor.* | par amour |
| Moyen | *Hablamos por teléfono.* | par téléphone |
| Lieu traversé ou vague | *Paseo por el parque.* | dans / à travers le parc |
| Moment de la journée | *Por la mañana.* | le matin |
| Échange, prix | *Lo compré por diez euros.* | pour dix euros |
| Agent du passif | *Escrito por Cervantes.* | écrit par |
| En faveur de, à la place de | *Lucho por mis derechos.* | pour mes droits |

> Pose-toi la question : « dans quel but ? » → **para** ; « à cause de quoi, par où, contre quoi ? » → **por**.

!> Erreur classique : *Gracias para tu ayuda*. On remercie « à cause de » l’aide : *Gracias por tu ayuda*.

## Les couples qui changent le sens
| Por | Para |
| *Trabajo por mi familia* : à cause d’elle, en sa faveur | *Trabajo para mi familia* : elle est mon employeur, ou le destinataire |
| *Pasé por Toledo* : j’ai traversé Toledo | *Voy para Toledo* : je vais vers Toledo |

## Les expressions figées
- avec **por** : *por fin* (enfin), *por eso* (c’est pourquoi), *por supuesto* (bien sûr), *por ejemplo*, *por favor*, *por lo menos* (au moins).
- avec **para** : *para siempre* (pour toujours), *para colmo* (pour couronner le tout).
- *Estar para* + infinitif = être sur le point de ; *estar por* + infinitif = rester à faire : *La casa está por limpiar*.

## Exemple travaillé
Complète : *Gracias ___ tu ayuda. Te llamo ___ decirte que salgo ___ Sevilla ___ la tarde.*
1. On remercie « à cause de » l’aide : **por**.
2. But, suivi d’un infinitif : **para**.
3. Destination : **para**.
4. Moment de la journée : **por**.`,
          },
          questions: [
            ['Quelle préposition exprime le but devant un infinitif ?', ['por', 'para', 'a', 'de'], 1, '*Estudio para aprobar* : dans quel but ? → para.'],
            ['Comment dit-on « par téléphone » ?', ['para teléfono', 'en teléfono', 'por teléfono', 'de teléfono'], 2, 'Le moyen s’exprime avec *por*.'],
            ['*Lo compré ___ diez euros.* Quel mot complète la phrase ?', ['para', 'a', 'de', 'por'], 3, 'L’échange et le prix se disent avec *por*.', 'Quelle préposition pour le prix ?'],
            ['*Este regalo es ___ ti.* Quel mot complète la phrase ?', ['para', 'por', 'a', 'con'], 0, 'Le destinataire s’exprime avec *para*.', 'Quelle préposition pour le destinataire ?'],
            ['Comment dit-on « le matin » (moment de la journée) ?', ['para la mañana', 'por la mañana', 'en la mañana', 'a la mañana'], 1, '*Por la mañana, por la tarde, por la noche* (l’Amérique dit aussi *en la mañana*).'],
            ['*Don Quijote fue escrito ___ Cervantes.* Quel mot complète la phrase ?', ['para', 'de', 'por', 'con'], 2, 'L’agent du passif est introduit par *por*.', 'Quelle préposition pour l’agent du passif ?'],
            ['Que signifie *Para mí, es fácil* ?', ['C’est facile pour moi à faire à ta place', 'Selon moi, c’est facile', 'Grâce à moi, c’est facile', 'C’est facile à cause de moi'], 1, '*Para mí* introduit un point de vue.'],
            ['Que signifie *La casa está por limpiar* ?', ['La maison est propre', 'La maison va être vendue', 'La maison reste à nettoyer', 'La maison est en travaux'], 2, '*Estar por* + infinitif = rester à faire.'],
            ['*Por eso* signifie « c’est pourquoi ».', ['Vrai', 'Faux'], 0, 'Expression figée de conséquence : *Llovía; por eso no salí.*'],
            ['*Pasé por Toledo* signifie…', ['Je suis passé par Tolède', 'Je vais à Tolède', 'Je suis resté à Tolède', 'Je suis parti de Tolède'], 0, '*Por* marque le lieu traversé.'],
            ['*Lo hizo por amor* : quelle valeur a *por* ?', ['Le but', 'Le destinataire', 'La date limite', 'La cause'], 3, 'Il l’a fait à cause de l’amour, mû par l’amour.'],
            ['Comment dit-on « pour lundi » (date limite) ?', ['por el lunes', 'a el lunes', 'para el lunes', 'en el lunes'], 2, 'L’échéance se dit avec *para* : *Es para el lunes*.'],
          ],
        },
        {
          titre: 'La préposition a et ses voisines',
          axe: 'Les prépositions',
          lecon: {
            titre: 'A, en, de : situer, viser, déplacer',
            cours: `Une petite préposition, beaucoup de fautes : *a* marque le mouvement, l’heure… et, surtout, la personne complément d’objet, un emploi que le français ne connaît pas.

## Le « a » devant le COD de personne
En espagnol, un complément d’objet direct qui désigne une **personne précise** est introduit par **a** :
| Sans a | Avec a |
| *Veo la casa.* (chose) | *Veo a María.* (personne) |
| *Busco un médico.* (n’importe lequel) | *Busco al médico de mi abuela.* (un médecin précis) |
| *Tengo dos hermanos.* (tener : jamais de a) | *Quiero a mis padres.* (aimer quelqu’un) |

> *Querer algo* = vouloir quelque chose ; *querer a alguien* = aimer quelqu’un. Le *a* change le sens.

On le met aussi devant un animal familier (*Paseo a mi perro*) et devant *alguien, nadie, quien* : *¿A quién buscas? No veo a nadie.*

## A : le mouvement et la destination
- Après un verbe de mouvement : *Voy a Madrid. Llegamos a casa.*
- Avant un infinitif, après un verbe de mouvement ou de début : *Vengo a verte. Empieza a llover. Aprendo a nadar.*
- *Ir a* + infinitif = futur proche : *Voy a estudiar.*

## En : le lieu où l’on est
| A (mouvement) | En (sans mouvement) |
| *Voy a la playa.* | *Estoy en la playa.* |
| *Llego a Sevilla.* | *Vivo en Sevilla.* |

On dit aussi *en tren, en coche, en avión*, mais **a pie** (à pied) et **a caballo** (à cheval).

## Le temps
| Pour dire… | On emploie | Exemple |
| L’heure | a | *a las ocho* |
| Le mois, la saison, l’année | en | *en julio, en verano, en 2025* |
| Le jour | aucune préposition | *el lunes, los sábados* |
| « Dans » (délai futur) | dentro de | *dentro de dos días* |

## De : l’origine, la matière, l’appartenance
*Soy de Lyon. Una mesa de madera. El coche de mi padre.* Rappel : *a + el = al*, *de + el = del*.

## Exemple travaillé
Traduis « Le samedi, je vais voir mes grands-parents à Tolède, en train ».
1. Jour sans préposition : *Los sábados*.
2. Mouvement + infinitif : *voy a ver*.
3. COD de personne précise : *a mis abuelos*.
4. Destination : *a Toledo*, moyen de transport : *en tren*.
→ *Los sábados voy a ver a mis abuelos a Toledo en tren.*`,
          },
          questions: [
            ['Quelle phrase est correcte ?', ['Veo María', 'Veo a María', 'Veo en María', 'Veo de María'], 1, 'Un COD de personne précise est introduit par *a*.'],
            ['Quelle phrase est correcte ?', ['Tengo a dos hermanos', 'Tengo de dos hermanos', 'Tengo dos hermanos', 'Tengo en dos hermanos'], 2, '*Tener* ne prend pas de *a* devant son complément.'],
            ['Que signifie *Quiero a mis padres* ?', ['J’aime mes parents', 'Je veux mes parents', 'Je cherche mes parents', 'Je vais chez mes parents'], 0, '*Querer a alguien* = aimer quelqu’un.'],
            ['*Estoy ___ la playa.* Quel mot complète la phrase ?', ['a', 'de', 'para', 'en'], 3, 'Pas de mouvement : *en*.', 'Quelle préposition sans mouvement ?'],
            ['Comment dit-on « à pied » ?', ['en pie', 'a pie', 'de pie', 'por pie'], 1, 'On dit *a pie* et *a caballo*, mais *en tren*, *en coche*. (*De pie* = debout.)'],
            ['Comment dit-on « à huit heures » ?', ['en las ocho', 'por las ocho', 'a las ocho', 'las ocho'], 2, 'L’heure se dit avec *a*.'],
            ['Comment dit-on « le lundi, je vais au sport » ?', ['El lunes voy al deporte', 'En lunes voy al deporte', 'A el lunes voy al deporte', 'Por lunes voy al deporte'], 0, 'Aucune préposition devant un jour : *el lunes*.'],
            ['Comment dit-on « dans deux jours » (futur) ?', ['en dos días', 'a dos días', 'hace dos días', 'dentro de dos días'], 3, '*Dentro de* marque le délai futur ; *hace dos días* = il y a deux jours.'],
            ['*No veo a nadie* est correct.', ['Vrai', 'Faux'], 0, '*Nadie, alguien, quien* sont précédés de *a* quand ils sont COD.'],
            ['Quelle phrase dit « Il commence à pleuvoir » ?', ['Empieza de llover', 'Empieza a llover', 'Empieza llover', 'Empieza en llover'], 1, '*Empezar a* + infinitif.'],
            ['*Busco un médico* : pourquoi n’y a-t-il pas de *a* ?', ['Parce que *médico* est masculin', 'Parce que *buscar* ne prend jamais *a*', 'Parce que le médecin n’est pas précis', 'C’est une faute'], 2, 'N’importe quel médecin : personne indéterminée, pas de *a*. Un médecin précis : *busco al médico*.'],
            ['Comment dit-on « en été » ?', ['a verano', 'en verano', 'por verano', 'de verano'], 1, 'Mois, saisons et années prennent *en*.'],
          ],
        },
        {
          titre: 'Dire la durée : hace, desde hace, llevar',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Il y a, depuis, cela fait… que',
            cours: `« Il y a deux ans », « depuis deux ans », « cela fait deux ans que » : le français mélange tout, l’espagnol distingue soigneusement le moment passé et la durée qui continue.

## Hay ou hace ?
| Français | Espagnol | Sens |
| Il y a des élèves | **hay** alumnos | existence |
| Il y a deux ans | **hace** dos años | moment dans le passé |

> *Hay* sert à dire qu’une chose existe ; *hace* + durée situe un événement dans le passé. Ne les confonds jamais.

!> Erreur classique : *Hay dos años que vivo aquí*. Il faut *Hace dos años que vivo aquí*.

*Hace dos años que llegué a Madrid* ou *Llegué a Madrid hace dos años* : l’action est finie → **passé simple**.

## La durée qui continue encore
Pour une action commencée dans le passé et **toujours en cours**, l’espagnol emploie le **présent**, comme le français :
| Tournure | Exemple |
| desde hace + durée | *Vivo aquí desde hace tres años.* |
| hace + durée + que + présent | *Hace tres años que vivo aquí.* |
| llevar + durée + gérondif | *Llevo tres años viviendo aquí.* |
| desde + date | *Vivo aquí desde 2022.* |
| desde que + verbe | *Vivo aquí desde que nací.* |

La tournure avec **llevar** est la plus idiomatique : *Llevo una hora esperándote* (ça fait une heure que je t’attends).

## Au passé
On décale tout à l’imparfait : *Hacía tres años que vivía allí. Llevaba una hora esperando.*

## Le futur et les autres repères
| Pour dire… | Espagnol |
| dans deux jours | dentro de dos días |
| au bout de deux jours | al cabo de dos días |
| pendant deux jours | durante dos días |
| il y a longtemps | hace mucho (tiempo) |
| depuis quand ? | ¿desde cuándo? |
| depuis combien de temps ? | ¿cuánto tiempo hace que…? / ¿cuánto tiempo llevas…? |

## Exemple travaillé
Traduis « Cela fait six mois que j’apprends l’espagnol » de trois façons :
1. *Aprendo español desde hace seis meses.*
2. *Hace seis meses que aprendo español.*
3. *Llevo seis meses aprendiendo español.*
Dans les trois cas, le verbe est au **présent** : l’apprentissage continue.`,
          },
          questions: [
            ['Comment dit-on « il y a deux ans » (moment passé) ?', ['hay dos años', 'hace dos años', 'desde dos años', 'lleva dos años'], 1, '*Hace* + durée situe un moment dans le passé.'],
            ['Comment dit-on « il y a beaucoup d’élèves » ?', ['Hace muchos alumnos', 'Está muchos alumnos', 'Hay muchos alumnos', 'Lleva muchos alumnos'], 2, '*Hay* exprime l’existence.'],
            ['Quelle phrase dit « J’habite ici depuis trois ans » ?', ['Vivo aquí desde hace tres años', 'Viví aquí hace tres años', 'Vivo aquí hay tres años', 'Vivo aquí dentro de tres años'], 0, 'Durée qui continue : présent + *desde hace*.'],
            ['*Llevo una hora ___.* Quel mot complète la phrase (« ça fait une heure que je t’attends ») ?', ['esperarte', 'esperado', 'que te espero', 'esperándote'], 3, '*Llevar* + durée + gérondif.', 'Quelle forme suit llevar + durée ?'],
            ['Dans *Hace tres años que vivo aquí*, à quel temps est le verbe ?', ['Au passé simple', 'Au présent, car l’action continue', 'Au futur', 'À l’imparfait'], 1, 'Comme en français : « cela fait trois ans que j’habite ici ».'],
            ['Comment dit-on « au bout de deux jours » ?', ['dentro de dos días', 'durante dos días', 'al cabo de dos días', 'hace dos días'], 2, '*Al cabo de* = au bout de.'],
            ['*Llegué a Madrid hace dos años* : le passé simple est correct, car l’arrivée est une action finie.', ['Vrai', 'Faux'], 0, 'Moment ponctuel et terminé : passé simple.'],
            ['Comment dit-on « depuis 2022 » ?', ['desde hace 2022', 'hace 2022', 'dentro de 2022', 'desde 2022'], 3, '*Desde* + date ; *desde hace* + durée.'],
            ['Au passé, « cela faisait une heure que j’attendais » se dit…', ['Hace una hora que esperé', 'Llevaba una hora esperando', 'Llevo una hora esperando', 'Hubo una hora que esperaba'], 1, 'On décale à l’imparfait : *llevaba… esperando* ou *hacía… que esperaba*.'],
            ['Comment demande-t-on « depuis quand ? » ?', ['¿desde cuándo?', '¿hace cuándo?', '¿cuándo hace?', '¿desde qué?'], 0, 'Pour la durée : *¿cuánto tiempo hace que…?*'],
            ['*Dentro de dos días* signifie…', ['Il y a deux jours', 'Pendant deux jours', 'Dans deux jours', 'Depuis deux jours'], 2, 'Délai tourné vers le futur.'],
            ['*Hay dos años que vivo aquí* est correct.', ['Vrai', 'Faux'], 1, 'Faute classique : il faut *Hace dos años que vivo aquí*.'],
          ],
        },
        {
          titre: 'Les nombres, la date et l’heure',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Compter, dater, donner l’heure',
            cours: `Les nombres sont partout — prix, dates, heures, pourcentages — et quelques pièges reviennent sans cesse : *cien* ou *ciento*, *quinientos*, l’accord des centaines.

## De 0 à 100
- De 16 à 29, on écrit en **un seul mot** : *dieciséis, diecisiete, veintiuno, veintidós, veintitrés*.
- À partir de 31, en trois mots avec **y** : *treinta y uno, cuarenta y cinco, noventa y nueve*.
- Le **y** ne se place qu’entre les dizaines et les unités : *ciento cinco* (pas *ciento y cinco*).
- *Uno* devient *un* devant un nom masculin : *veintiún años*.

## Cien ou ciento ?
| Cien | Ciento |
| 100 tout seul ou devant un nom : *cien euros, cien mil* | 101 à 199 : *ciento uno, ciento veinte* |

## Les centaines s’accordent
*Doscientos chicos, doscientas chicas.* Trois formes irrégulières : **quinientos** (500), **setecientos** (700), **novecientos** (900).

## Mil et millón
| Mil | Millón |
| invariable : *dos mil, tres mil* | nom : *dos millones* |
| pas d’article : *mil personas* | suivi de **de** : *un millón de personas* |

## Les ordinaux
*primero, segundo, tercero, cuarto, quinto, sexto, séptimo, octavo, noveno, décimo.* *Primero* et *tercero* perdent leur -o devant un nom masculin : *el primer día, el tercer piso*. Au-delà de dix, on emploie le cardinal : *el siglo XXI* (veintiuno), *Alfonso X* (décimo), *Juan XXIII* (veintitrés).

## La date
*Hoy es lunes, 12 de octubre de 2026.* On dit aussi *Estamos a 12 de octubre*. L’année se lit comme un nombre : *dos mil veintiséis*. Les décennies : *los años ochenta*.

## L’heure
| Question / heure | Espagnol |
| Quelle heure est-il ? | *¿Qué hora es?* |
| Il est une heure | *Es la una.* |
| Il est deux heures | *Son las dos.* |
| 3 h 15 | *Son las tres y cuarto.* |
| 3 h 30 | *Son las tres y media.* |
| 3 h 45 | *Son las cuatro menos cuarto.* |
| À 8 heures du soir | *A las ocho de la tarde / de la noche.* |

> *La hora* est féminine : on dit *la una, las dos*, et le verbe est au singulier seulement pour une heure.

## Exemple travaillé
Lis à voix haute : « Le 23 avril 1616, 500 personnes… »
1. Date : *el veintitrés de abril de mil seiscientos dieciséis*.
2. Nombre + nom féminin : *quinientas personas* (la centaine s’accorde).`,
          },
          questions: [
            ['Comment dit-on « 100 euros » ?', ['ciento euros', 'cien euros', 'cientos euros', 'un ciento euros'], 1, '*Cien* seul ou devant un nom ; *ciento* de 101 à 199.'],
            ['Comment écrit-on 500 ?', ['cincocientos', 'quincientos', 'quinientos', 'cinco cientos'], 2, 'Forme irrégulière, comme *setecientos* et *novecientos*.'],
            ['Comment dit-on « 200 filles » ?', ['doscientas chicas', 'doscientos chicas', 'dos cien chicas', 'doscientas de chicas'], 0, 'Les centaines s’accordent avec le nom.'],
            ['Comment dit-on « un million de personnes » ?', ['un millón personas', 'un mil personas', 'millón de personas', 'un millón de personas'], 3, '*Millón* est un nom : il faut *de*.'],
            ['Comment écrit-on 45 ?', ['cuarentaicinco', 'cuarenta y cinco', 'cuarenta cinco', 'cuarentay cinco'], 1, 'À partir de 31, trois mots avec *y*.'],
            ['Comment dit-on « Il est une heure » ?', ['Son la una', 'Es las una', 'Es la una', 'Está la una'], 2, 'Singulier pour une heure seulement : *es la una* ; *son las dos*.'],
            ['Comment dit-on 3 h 45 ?', ['Son las cuatro menos cuarto', 'Son las tres y cuarenta y cinco menos', 'Son las tres menos cuarto', 'Es las cuatro y cuarto'], 0, 'On retire un quart à l’heure suivante, comme en français.'],
            ['Comment lit-on « le XXIe siècle » ?', ['el siglo vigésimo primero', 'el siglo veintiún', 'el siglo veinte y uno', 'el siglo veintiuno'], 3, 'Au-delà de dix, on emploie le cardinal : *el siglo XXI* se lit *veintiuno*.'],
            ['*Mil* est invariable : on dit *dos mil*.', ['Vrai', 'Faux'], 0, 'Contrairement à *millón*, qui fait *millones*.'],
            ['Comment dit-on « le premier jour » ?', ['el primero día', 'el primer día', 'el uno día', 'el primo día'], 1, '*Primero* perd son -o devant un nom masculin singulier.'],
            ['Comment écrit-on 21 ans ?', ['veinte y un años', 'veintiuno años', 'veintiún años', 'veintiuna años'], 2, 'Un seul mot, et *uno* s’apocope en *-ún* devant un nom masculin.'],
            ['Comment écrit-on 105 ?', ['ciento y cinco', 'ciento cinco', 'cien cinco', 'cien y cinco'], 1, 'Le *y* ne se met qu’entre dizaines et unités.'],
          ],
        },
        {
          titre: 'Diminutifs et augmentatifs',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Petit, grand, affectueux, péjoratif : les suffixes',
            cours: `Un *cafecito*, une *casita*, un *golpazo* : l’espagnol ajoute à un mot un suffixe qui le rend plus petit, plus grand, plus tendre ou plus méprisant. C’est une des marques les plus vivantes de la langue parlée.

## Les diminutifs
| Suffixe | Exemple | Sens |
| -ito / -ita | *casa → casita, perro → perrito* | petit, mignon |
| -cito / -cita | *café → cafecito, joven → jovencito, canción → cancioncita* | après -e, -n, -r |
| -ecito / -ecita | *flor → florecita, pan → panecito* | mots d’une syllabe |
| -illo / -illa | *chico → chiquillo* | fréquent en Andalousie |
| -ico / -ica | *pequeño → pequeñico* | Aragon, Murcie, Costa Rica (les *ticos*) |
| -ín / -ina | *pequeño → pequeñín* | Asturies |

> Le diminutif dit souvent l’**affection** plus que la taille : *mi abuelita* n’est pas petite, elle est aimée.

## L’orthographe bouge
Pour garder le son, on modifie la consonne : *poco → poquito, amigo → amiguito, taza → tacita, luz → lucecita*. On supprime la voyelle finale : *mesa → mesita*.

## En Amérique latine
Le diminutif s’accroche même aux adverbes : *ahora → ahorita* (tout de suite… ou plus tard, au Mexique), *cerca → cerquita*, *adiós → adiosito*.

## Les augmentatifs et les péjoratifs
| Suffixe | Exemple | Sens |
| -ón / -ona | *cabeza → cabezón, casa → casona* | grand ; parfois moqueur |
| -azo / -aza | *perro → perrazo* | énorme |
| -azo (coup) | *codo → codazo, puerta → portazo* | un coup donné avec |
| -ote / -ota | *grande → grandote, palabra → palabrota* | gros, grossier |
| -ucho / -ucha | *casa → casucha, cuarto → cuartucho* | misérable |

## Les mots devenus autonomes
Certains dérivés ont pris un sens à part : *bocadillo* (sandwich), *zapatilla* (chausson, basket), *bombilla* (ampoule), *ventanilla* (guichet), *sillón* (fauteuil), *cajón* (tiroir), *camisón* (chemise de nuit), *ratón* (souris). Ce ne sont plus des diminutifs ni des augmentatifs : apprends-les comme des mots.

## Exemple travaillé
*Dame un momentito, que tomo un cafecito y te llamo ahorita.*
1. *momentito* : un tout petit moment — pour adoucir la demande.
2. *cafecito* : -cito après -é.
3. *ahorita* : tout de suite, à la mexicaine.
La phrase n’est pas « plus petite » : elle est plus chaleureuse.`,
          },
          questions: [
            ['Quel est le diminutif de *café* ?', ['cafeíto', 'cafecito', 'cafito', 'cafetito'], 1, 'Après une voyelle accentuée finale, on ajoute *-cito*.'],
            ['Quel est le diminutif de *poco* ?', ['pocito', 'pocquito', 'poquito', 'pocoito'], 2, 'Le *c* devient *qu* pour garder le son [k].'],
            ['Que signifie *mi abuelita* ?', ['Ma grand-mère chérie', 'Ma petite-fille', 'Ma grand-mère de petite taille seulement', 'Mon arrière-grand-mère'], 0, 'Le diminutif exprime surtout l’affection.'],
            ['Que signifie *un portazo* ?', ['Une grande porte', 'Un portier', 'Une petite porte', 'Un claquement de porte'], 3, '*-azo* désigne souvent un coup donné avec l’objet.'],
            ['Que signifie *una casucha* ?', ['Une belle maison', 'Une masure, une maison misérable', 'Une maison de campagne', 'Une petite maison mignonne'], 1, '*-ucho, -ucha* est péjoratif.'],
            ['Que signifie *bocadillo* ?', ['Une petite bouche', 'Un bouchon', 'Un sandwich', 'Un baiser'], 2, 'Mot lexicalisé : ce n’est plus un diminutif.'],
            ['Que désigne *una palabrota* ?', ['Un gros mot', 'Un long discours', 'Un mot savant', 'Un petit mot doux'], 0, '*-ota* peut être augmentatif et péjoratif.'],
            ['Dans quel pays appelle-t-on les habitants *ticos*, à cause de leur diminutif en *-ico* ?', ['Au Mexique', 'En Argentine', 'Au Chili', 'Au Costa Rica'], 3, 'Les Costariciens disent *chiquitico*, *momentico*.'],
            ['*Ratón* (souris) est aujourd’hui un mot autonome, et non un simple augmentatif de *rata*.', ['Vrai', 'Faux'], 0, 'Comme *sillón* ou *cajón*, il a pris un sens propre.'],
            ['Quel est le diminutif de *flor* ?', ['florita', 'florecita', 'florcita', 'florilla'], 1, 'Mot d’une syllabe : *-ecito, -ecita*.'],
            ['Au Mexique, que peut vouloir dire *ahorita* ?', ['Hier', 'Jamais', 'Tout de suite, ou un peu plus tard', 'Il y a longtemps'], 2, 'Le diminutif s’accroche aux adverbes en Amérique latine.'],
            ['Quel suffixe exprime la grande taille, parfois avec moquerie ?', ['-ito', '-illo', '-ecito', '-ón'], 3, '*cabezón* = grosse tête, ou têtu.'],
          ],
        },
      ],
    },
  ],
}
