// Arts plastiques — 6e → Terminale.
// Cycle 3 (6e), cycle 4 (5e-4e-3e), lycée (2de-1re-Tle, option).

export default {
  slug: 'arts-plastiques',
  nom: 'Arts plastiques',
  blocs: [
    {
      niveaux: ['6e'],
      chapitres: [
        {
          titre: 'La couleur',
          lecon: {
            titre: 'Comprendre et utiliser les couleurs',
            cours: `La couleur n’est pas un décor : c’est un outil de composition.

## Primaires, secondaires, tertiaires
| La famille | Comment on l’obtient | Ses membres |
| **Primaires** | On ne peut **pas** les obtenir par mélange | Magenta (rouge), cyan (bleu), jaune |
| **Secondaires** | Le mélange de **deux primaires** | Vert, orange, violet |
| **Tertiaires** | Une primaire **+** une secondaire voisine | |

~ Deux primaires → une secondaire → mélangée à une primaire voisine → une tertiaire

## Les couleurs complémentaires
Elles se font **face** sur le cercle chromatique.

| L’une | Son opposée |
| Rouge | Vert |
| Bleu | Orange |
| Jaune | Violet |

!> **Côte à côte**, elles se **renforcent** ; **mélangées**, elles s’**éteignent en gris**. Le même couple produit l’effet le plus vif ou le plus terne, selon qu’on les pose l’une contre l’autre ou l’une dans l’autre.

## Chaudes et froides
| La famille | Ses couleurs | Ce qu’elles font |
| **Chaudes** | Rouges, oranges, jaunes | Elles semblent **avancer** |
| **Froides** | Bleus, verts | Elles semblent **reculer** |

> C’est un moyen simple de créer de la **profondeur** sans tracer une seule ligne de perspective.

## Valeur et saturation
| La notion | Ce qu’elle mesure |
| La **valeur** | Le degré de **clair** ou de **sombre** |
| La **saturation** | L’**intensité** de la couleur |

!> Les deux notions sont **indépendantes** : une couleur peut être **vive et sombre**, ou **pâle et lumineuse**.`,
          },
          questions: [
            ['Quelles sont les trois couleurs primaires en peinture ?', ['Magenta, cyan, jaune', 'Rouge, vert, bleu', 'Noir, blanc, gris', 'Orange, violet, vert'], 0, 'On ne peut pas les obtenir en mélangeant d’autres couleurs.'],
            ['Quelle est la complémentaire du bleu ?', ['L’orange', 'Le vert', 'Le violet', 'Le rouge'], 0, 'Elles se font face sur le cercle chromatique.'],
            ['Deux couleurs complémentaires mélangées donnent un gris.', ['Vrai', 'Faux'], 0, 'Elles s’éteignent mutuellement ; côte à côte, au contraire, elles se renforcent.'],
            ['Les couleurs froides semblent…', ['Reculer dans l’image', 'Avancer vers le spectateur', 'Disparaître', 'Vibrer'], 0, 'C’est un moyen simple de suggérer la profondeur.'],
            ['Le vert est une couleur secondaire.', ['Vrai', 'Faux'], 0, 'Il naît du mélange du jaune et du cyan.'],
            ['Que désigne la valeur d’une couleur ?', ['Son degré de clair ou de sombre', 'Son prix', 'Son intensité', 'Sa température'], 0, 'À ne pas confondre avec la saturation.'],
            ['La saturation désigne l’intensité d’une couleur.', ['Vrai', 'Faux'], 0, 'Une couleur peu saturée tire vers le gris.'],
            ['Comment obtient-on du violet ?', ['En mélangeant du magenta et du cyan', 'En mélangeant du jaune et du rouge', 'En mélangeant du vert et du bleu', 'En ajoutant du blanc au rouge'], 0, 'Deux primaires donnent une secondaire.'],
          ],
        },
        {
          titre: 'La représentation de l’espace',
          lecon: {
            titre: 'Donner de la profondeur à une image',
            cours: `Une feuille est plate. Représenter l’espace est une construction, jamais une évidence.

## Les procédés simples
| Le procédé | Sa règle |
| La **superposition** | Ce qui **cache** est devant |
| L’**étagement** | Ce qui est plus **haut** sur la feuille est plus loin |
| La **taille relative** | Plus c’est **petit**, plus c’est loin |

## La perspective linéaire
Inventée à la **Renaissance**.

~ Les lignes parallèles convergent → vers un POINT DE FUITE → situé sur la LIGNE D’HORIZON, à hauteur d’œil

| La vue | Ses points de fuite |
| **Frontale** | **Un** |
| **D’angle** | **Deux** |

## La perspective atmosphérique
~ Plus un objet est loin → plus il devient pâle, bleuté, flou et peu contrasté

**Léonard de Vinci** l’utilise dans les arrière-plans de ses tableaux.

## Rompre avec l’espace
| Le mouvement | Ce qu’il fait |
| Le **cubisme** | Il montre **plusieurs points de vue à la fois** |
| L’**abstraction** | Elle abandonne la représentation |

> Le XXe siècle a **délibérément** cassé ces règles. Connaître la règle est ce qui permet d’en jouer.`,
          },
          questions: [
            ['Vers quoi convergent les lignes en perspective linéaire ?', ['Le point de fuite', 'Le centre du tableau', 'Le cadre', 'Le premier plan'], 0, 'Il se situe sur la ligne d’horizon, à hauteur d’œil.'],
            ['La perspective linéaire a été formalisée à la Renaissance.', ['Vrai', 'Faux'], 0, 'Brunelleschi et Alberti en posent les règles au XVe siècle.'],
            ['En perspective atmosphérique, les objets lointains sont…', ['Plus pâles et moins contrastés', 'Plus vifs', 'Plus nets', 'Plus sombres'], 0, 'L’air épaissit et bleuit la vision au loin.'],
            ['La superposition indique que…', ['Ce qui cache est devant', 'Ce qui cache est derrière', 'Les objets sont de même taille', 'L’image est plate'], 0, 'C’est le procédé le plus élémentaire de profondeur.'],
            ['Une vue d’angle nécessite deux points de fuite.', ['Vrai', 'Faux'], 0, 'La vue frontale n’en demande qu’un.'],
            ['Le cubisme…', ['Montre plusieurs points de vue à la fois', 'Perfectionne la perspective', 'Copie la photographie', 'Supprime la couleur'], 0, 'Braque et Picasso brisent le point de vue unique.'],
            ['L’étagement place les éléments lointains plus haut sur la feuille.', ['Vrai', 'Faux'], 0, 'C’est un procédé ancien, très présent avant la Renaissance.'],
            ['La ligne d’horizon correspond…', ['À la hauteur d’œil du spectateur', 'Au bord haut du tableau', 'Au sol', 'Au centre exact de l’image'], 0, 'Elle détermine si l’on regarde de haut ou de bas.'],
          ],
        },
        {
          titre: 'Matières, outils et gestes',
          lecon: {
            titre: 'Faire avec ce qu’on a sous la main',
            cours: `En arts plastiques, le geste et le matériau font partie de l’œuvre.

## Les gestes
~ Tracer → frotter → gratter → déchirer → coller → superposer → effacer → tamponner

!> Chaque geste laisse une trace **reconnaissable**. Une même couleur n’a pas le même effet posée au **pinceau**, au **rouleau** ou à l’**éponge**.

## Les matériaux
| La famille | Ses membres |
| Les **traçants** | Crayon, fusain, encre |
| Les **peintures** | Gouache, aquarelle, pastel |
| Les **matières rapportées** | Papiers, tissus, objets récupérés |

Le **collage**, inventé au début du XXe siècle, introduit le **réel** dans l’œuvre.

## Le format et le support
| Ce qui change | Son effet |
| La **taille** | Minuscule ou monumental |
| La **texture** | Papier lisse ou froissé |
| La **nature** | Toile ou carton |

> Le support n’est **jamais neutre** : un même dessin change de sens selon ce sur quoi il est posé.

## Le hasard maîtrisé
| L’artiste | Son procédé |
| **Max Ernst** | Les **frottages** |
| **Jackson Pollock** | Le **dripping** |

Coulures, empreintes, taches.

!> **Provoquer un accident et savoir le garder est un savoir-faire.** Le hasard en art n’est pas de la négligence : c’est une décision.`,
          },
          questions: [
            ['Le collage introduit…', ['Des éléments du réel dans l’œuvre', 'De la perspective', 'Des couleurs primaires', 'De la symétrie'], 0, 'Il apparaît au début du XXe siècle avec le cubisme.'],
            ['Le support d’une œuvre est un choix neutre.', ['Vrai', 'Faux'], 1, 'Format, texture, matière du support changent le sens de l’image.'],
            ['Quelle technique consiste à laisser couler la peinture ?', ['Le dripping', 'Le frottage', 'Le pochoir', 'Le glacis'], 0, 'Jackson Pollock en a fait sa signature.'],
            ['Le frottage a été développé par…', ['Max Ernst', 'Claude Monet', 'Auguste Rodin', 'Andy Warhol'], 0, 'Il révèle par frottement le relief d’une surface.'],
            ['Une même couleur produit le même effet quel que soit l’outil.', ['Vrai', 'Faux'], 1, 'Pinceau, rouleau, éponge : la trace change tout.'],
            ['Qu’est-ce que le fusain ?', ['Un bâtonnet de charbon de bois pour dessiner', 'Une peinture à l’huile', 'Un papier épais', 'Un vernis'], 0, 'Il permet des noirs profonds et s’estompe facilement.'],
            ['Agrandir un dessin au format monumental change sa perception.', ['Vrai', 'Faux'], 0, 'Le corps du spectateur entre alors en rapport avec l’œuvre.'],
            ['Provoquer un accident et le conserver est…', ['Un savoir-faire artistique', 'Une erreur', 'Interdit', 'Un manque de technique'], 0, 'Le hasard maîtrisé est une démarche assumée.'],
          ],
        },
      ],
    },
    {
      niveaux: ['5e', '4e', '3e'],
      chapitres: [
        {
          titre: 'L’œuvre et son spectateur',
          lecon: {
            titre: 'Où commence et où s’arrête une œuvre ?',
            cours: `Une œuvre n'existe pleinement que regardée.

## Le cadre et le hors-champ
| La notion | Ce qu'elle fait |
| Le **cadre** | Il choisit ce qu'on montre — et donc ce qu'on **cache** |
| Le **hors-champ** | Il travaille l'imagination du spectateur |

> Ce qu'on ne voit pas peut être plus présent que ce qu'on voit.

## L'échelle et le lieu
Une même forme n'a pas le même effet selon l'endroit.

| Le lieu | Ce qu'il fait à l'œuvre |
| Une **vitrine** | Elle devient marchandise |
| Un **musée** | Elle devient patrimoine |
| Une **place publique** | Elle devient affaire de tous |

> L'**in situ** désigne une œuvre conçue pour un lieu précis, indissociable de lui.

## Le spectateur actif
| Ce que l'œuvre demande | Son exemple |
| Se **déplacer** | L'art cinétique joue du mouvement du regardeur |
| **Entrer** dedans | Les installations |
| **Toucher**, participer | Les œuvres interactives |
| **Compléter** mentalement | Ce que le cadre laisse hors champ |

## Le titre
| Le titre | Ce qu'il fait |
| Précis | Il **ferme** ou **déplace** le sens |
| *Sans titre* | Il laisse volontairement libre |

> C'est un élément de l'œuvre, pas une étiquette.`,
          },
          questions: [
            ['Que désigne le hors-champ ?', ['Ce qui est hors du cadre mais reste présent', 'Le fond de l’image', 'Le cadre en bois', 'Le premier plan'], 0, 'Il travaille l’imagination du spectateur.'],
            ['Une œuvre in situ est conçue pour un lieu précis.', ['Vrai', 'Faux'], 0, 'La déplacer la dénature.'],
            ['Le titre d’une œuvre…', ['Fait partie de l’œuvre et oriente sa lecture', 'Est une simple étiquette', 'Est toujours descriptif', 'Est choisi par le musée'], 0, '*Sans titre* est lui-même un choix.'],
            ['L’art cinétique joue avec…', ['Le mouvement', 'Le silence', 'La photographie', 'L’écriture'], 0, 'Mouvement réel de l’œuvre ou déplacement du spectateur.'],
            ['Cadrer, c’est aussi décider ce qu’on cache.', ['Vrai', 'Faux'], 0, 'Le choix du cadre est un acte de sens.'],
            ['Une installation se caractérise par le fait que…', ['Le spectateur y entre ou la parcourt', 'Elle est toujours peinte', 'Elle tient dans une main', 'Elle est numérique'], 0, 'Elle occupe et transforme un espace.'],
            ['Changer une œuvre de lieu ne change jamais son sens.', ['Vrai', 'Faux'], 1, 'Vitrine, musée, rue : le contexte fait partie de la réception.'],
            ['Une œuvre participative suppose…', ['Une action du spectateur', 'Un guide', 'Un grand format', 'Un cadre doré'], 0, 'Sans son intervention, l’œuvre reste incomplète.'],
          ],
        },
        {
          titre: 'Image, message et publicité',
          lecon: {
            titre: 'Décoder les images qui nous entourent',
            cours: `Nous recevons chaque jour des centaines d'images construites pour agir sur nous.

## Dénotation et connotation
| Le niveau | Ce qu'il désigne | L'exemple de la voiture sur une route déserte |
| La **dénotation** | Ce que l'image montre **littéralement** | Une voiture |
| La **connotation** | Ce qu'elle **suggère** : valeurs, émotions, appartenance | La liberté |

## Les procédés de l'image publicitaire
| Le procédé | Son effet |
| Le **cadrage serré** | Il isole et magnifie |
| La **lumière** valorisante | Elle embellit |
| La **retouche** | Elle efface le défaut |
| La **mise en scène du corps** | Elle transfère le désir sur le produit |
| L'**association d'idées** | Un produit + un décor + une musique |
| L'**accroche** textuelle | Elle **ancre** le sens que l'image laissait flottant |

## Détournement et parodie
Depuis les années 1960, de nombreux artistes retournent les codes publicitaires contre eux-mêmes.

> C'est le principe du **détournement**, hérité des situationnistes.

## Regard critique
| La question | Ce qu'elle révèle |
| **Qui** parle ? | L'émetteur, et son intérêt |
| **À qui** ? | La cible visée |
| Pour **vendre quoi** ? | L'objectif réel |
| Que **montre**-t-on ? Que **cache**-t-on ? | Le choix du cadre |

> Ces quatre questions suffisent à transformer un spectateur en lecteur d'images.`,
          },
          questions: [
            ['Que désigne la connotation d’une image ?', ['Ce qu’elle suggère au-delà de ce qu’elle montre', 'Ce qu’elle montre littéralement', 'Son format', 'Son auteur'], 0, 'Valeurs, émotions, associations d’idées.'],
            ['L’accroche d’une publicité sert à ancrer le sens de l’image.', ['Vrai', 'Faux'], 0, 'Sans texte, l’image reste souvent ambiguë.'],
            ['Le détournement consiste à…', ['Réutiliser des codes existants pour les retourner', 'Copier une œuvre', 'Restaurer un tableau', 'Photographier une publicité'], 0, 'La pratique vient notamment des situationnistes.'],
            ['La dénotation, c’est…', ['Ce que l’image montre littéralement', 'Ce qu’elle évoque', 'Sa valeur marchande', 'Son cadre'], 0, 'Le niveau descriptif, avant interprétation.'],
            ['Une image publicitaire est une image neutre.', ['Vrai', 'Faux'], 1, 'Chaque choix (cadrage, lumière, retouche) sert une intention commerciale.'],
            ['Quelle question est la plus utile pour lire une image ?', ['Qui parle, à qui, pour quoi ?', 'Combien coûte-t-elle ?', 'Quelle est sa taille ?', 'Qui l’a imprimée ?'], 0, 'Elle fait apparaître l’intention derrière l’image.'],
            ['La retouche numérique fait partie des procédés publicitaires courants.', ['Vrai', 'Faux'], 0, 'Elle façonne des corps et des objets idéalisés.'],
            ['Une même photo peut changer de sens selon son texte d’accompagnement.', ['Vrai', 'Faux'], 0, 'C’est l’ancrage : le texte fixe l’une des lectures possibles.'],
          ],
        },
        {
          titre: 'Volume, espace et sculpture',
          lecon: {
            titre: 'Travailler en trois dimensions',
            cours: `Passer du plan au volume change tout : l'œuvre a un dos, un poids, une place.

## Les techniques
| La technique | Son geste | Ses matériaux |
| **Tailler** | **Retirer** de la matière | Pierre, bois |
| **Modeler** | **Ajouter** de la matière | Argile, plâtre |
| **Assembler** | Souder, coller, visser | Métal, objets |
| **Mouler** | Reproduire par empreinte | Plâtre, bronze, résine |

## Plein et vide
Un volume se lit autant par ses **creux** que par ses pleins.

> Henry Moore perce ses figures : l'espace traverse la sculpture et devient partie de l'œuvre.

## Socle ou pas de socle
| Le choix | Ce qu'il produit |
| **Avec socle** | Il isole l'œuvre et la **désigne** comme art |
| **Sans socle**, de Brancusi à l'art contemporain | La sculpture descend dans **notre** espace, au même niveau que nous |

## Le ready-made
| L'élément | Le détail |
| L'année | **1917** |
| L'artiste | **Marcel Duchamp** |
| L'objet | Un urinoir renversé et signé, intitulé *Fontaine* |
| Ce qui fait l'œuvre | Non la fabrication, mais le **choix** et le **déplacement** |

> Une bascule dont l'art du XXe siècle ne s'est jamais remis.`,
          },
          questions: [
            ['Quelle technique consiste à retirer de la matière ?', ['La taille', 'Le modelage', 'L’assemblage', 'Le moulage'], 0, 'On taille la pierre ou le bois ; on modèle l’argile.'],
            ['Qui a présenté *Fontaine* en 1917 ?', ['Marcel Duchamp', 'Pablo Picasso', 'Constantin Brancusi', 'Henry Moore'], 0, 'Un urinoir renversé et signé : le premier ready-made exposé.'],
            ['Dans un ready-made, l’artiste fabrique l’objet lui-même.', ['Vrai', 'Faux'], 1, 'C’est le choix et le déplacement de l’objet qui font l’œuvre.'],
            ['Supprimer le socle d’une sculpture…', ['La fait entrer dans notre espace', 'La rend plus fragile', 'La cache', 'La rend abstraite'], 0, 'Elle n’est plus mise à distance comme un objet sacré.'],
            ['Le vide fait partie intégrante d’une sculpture.', ['Vrai', 'Faux'], 0, 'Les creux structurent la lecture autant que les pleins.'],
            ['Le modelage consiste à…', ['Ajouter de la matière', 'Retirer de la matière', 'Souder du métal', 'Peindre un volume'], 0, 'Argile, plâtre, cire : on construit par ajout.'],
            ['Le moulage permet de reproduire une forme par empreinte.', ['Vrai', 'Faux'], 0, 'Il autorise plusieurs exemplaires d’une même sculpture.'],
            ['Une sculpture se regarde…', ['En tournant autour', 'De face uniquement', 'De loin uniquement', 'En photo'], 0, 'Elle a un dos, des angles, une occupation de l’espace.'],
          ],
        },
      ],
    },
    {
      niveaux: ['2de', '1re', 'Tle'],
      chapitres: [
        {
          titre: 'Démarche artistique et projet',
          lecon: {
            titre: 'Conduire un projet plastique',
            cours: `Au lycée, ce qui est évalué n’est pas seulement l’objet produit : c’est la **démarche**. Un projet plastique se conduit en quatre temps, et chacun laisse une trace que le jury peut lire.

## Les quatre temps du projet
1. **Formuler une intention** : une phrase, pas un thème — « je veux rendre visible la disparition », « je veux que le spectateur hésite ».
2. **Chercher** : essais, matériaux, échelles, références. C’est la phase où l’on a le droit de rater.
3. **Réaliser** : les choix plastiques répondent à l’intention, ou la déplacent — et le déplacement se note.
4. **Présenter** : l’accrochage et le texte d’intention font partie de l’œuvre.

## Intention et problématique
Sans question posée, la production reste **illustrative** : elle montre un sujet au lieu de le travailler. La problématique se reconnaît à ce qu’elle admet plusieurs réponses plastiques — si une seule est possible, ce n’est pas une question, c’est une consigne.

## Le carnet de recherche
| Ce qu’on y met | Ce que ça prouve au jury |
| Croquis et variantes | Que des choix ont été écartés |
| Essais ratés, datés | Que la recherche a eu lieu |
| Références annotées | Que le travail se situe |
| Notes d’intention | Que la démarche est consciente |

> Un échec documenté vaut mieux qu’une réussite inexpliquée : c’est le cheminement qui est noté, pas la seule habileté.

## Les références
Situer son travail par rapport à des artistes n’est pas copier : c’est se positionner. Trois relations sont légitimes, à condition d’être conscientes.

| Relation | Ce que je fais de la référence |
| Citer | Je reprends un motif et je l’assume comme emprunt |
| Prolonger | Je poursuis une recherche là où l’artiste l’a laissée |
| Contredire | Je reprends le dispositif pour en renverser le sens |

## Présenter et défendre
Accrochage, éclairage, ordre de lecture, texte d’intention : la présentation est le **dernier acte plastique**, pas une formalité. Défendre son travail, c’est expliciter les choix — jamais justifier les manques.`,
          },
          questions: [
            ['Que montre principalement un carnet de recherche ?', ['Le cheminement, y compris les essais ratés', 'Uniquement les réussites', 'Les notes obtenues', 'La liste du matériel'], 0, 'Un échec documenté vaut mieux qu’une réussite inexpliquée.'],
            ['Citer un artiste dans son projet, c’est copier son travail.', ['Vrai', 'Faux'], 1, 'C’est se positionner : citer, prolonger ou contredire.'],
            ['Une démarche artistique part…', ['D’une intention formulable', 'Du matériel disponible', 'De la note visée', 'Du format imposé'], 0, 'L’intention guide les choix plastiques.'],
            ['L’accrochage fait partie du travail artistique.', ['Vrai', 'Faux'], 0, 'Ordre, hauteur, lumière, espacement : ce sont des choix de sens.'],
            ['Défendre son travail consiste à…', ['Expliciter ses choix', 'Justifier ses manques', 'Comparer avec les autres', 'Décrire la technique seule'], 0, 'On explique pourquoi ces choix-là, pas pourquoi ce n’est pas parfait.'],
            ['Une production sans question posée reste souvent…', ['Illustrative', 'Abstraite', 'Conceptuelle', 'Monumentale'], 0, 'Elle montre sans interroger.'],
            ['Le texte d’intention accompagne utilement une présentation.', ['Vrai', 'Faux'], 0, 'Il donne au spectateur une entrée dans la démarche.'],
            ['Dans un projet, un essai raté est…', ['Une étape utile de la recherche', 'Une perte de temps', 'À cacher', 'Une faute'], 0, 'Il documente les choix écartés et leurs raisons.'],
          ],
        },
        {
          titre: 'Art contemporain : formes et enjeux',
          lecon: {
            titre: 'Comprendre l’art depuis 1960',
            cours: `L’art contemporain déroute souvent parce qu’il a déplacé la question : non plus « est-ce beau ? », mais « qu’est-ce que cela fait ? ». Quatre déplacements suffisent à s’y retrouver.

## Les grands déplacements
| L’œuvre passe… | … à | Ce que ça donne |
| de l’objet | à l’**idée** | Art conceptuel : le protocole vaut l’œuvre |
| de l’atelier | au **lieu** | In situ, land art : l’œuvre tient à son site |
| de l’objet | au **corps** | Performance : l’œuvre est un temps vécu |
| de l’unique | au **reproductible** | Pop art, sérigraphie : la copie n’est plus un défaut |

## Quelques repères
| Artiste | Le geste | Ce qu’il déplace |
| Andy Warhol | La reproduction sérielle | L’unicité de l’œuvre |
| Christo et Jeanne-Claude | L’emballage monumental | L’œuvre devient éphémère et publique |
| Sophie Calle | Le récit et l’enquête | L’artiste devient narratrice |
| Ai Weiwei | L’art politique | L’œuvre comme prise de position |
| Le street art | La rue, puis le marché | L’illégalité devenue valeur |

## Le marché et l’institution
Galeries, foires, biennales, musées : la valeur d’une œuvre contemporaine se construit **aussi socialement**. Ignorer ce circuit, c’est se condamner à trouver les prix absurdes ; le comprendre fait partie de la compréhension de l’œuvre.

## Le rôle du regardeur
> « C’est le regardeur qui fait le tableau », disait **Duchamp**. Beaucoup d’œuvres contemporaines n’existent qu’activées — par une interprétation, une participation ou un récit.

D’où la règle de méthode devant une œuvre qui déroute : ne pas demander ce qu’elle représente, mais **ce qu’elle demande de faire**.`,
          },
          questions: [
            ['Quelle question l’art contemporain déplace-t-il ?', ['De « est-ce beau ? » à « qu’est-ce que cela fait ? »', 'De « qui l’a fait ? » à « combien ça coûte ? »', 'De « où ? » à « quand ? »', 'Aucune, la question reste la même'], 0, 'Le critère se déplace du goût vers l’effet et le sens.'],
            ['L’art conceptuel privilégie…', ['L’idée sur l’objet', 'La technique sur l’idée', 'La peinture à l’huile', 'Le portrait'], 0, 'L’œuvre peut se réduire à un protocole ou un énoncé.'],
            ['La performance met le corps de l’artiste au centre.', ['Vrai', 'Faux'], 0, 'L’œuvre est l’action, souvent éphémère.'],
            ['Qui est associé à la reproduction sérielle et au Pop art ?', ['Andy Warhol', 'Christo', 'Sophie Calle', 'Ai Weiwei'], 0, 'Sérigraphies de Marilyn, de boîtes de soupe, de dollars.'],
            ['Le land art se pratique en atelier.', ['Vrai', 'Faux'], 1, 'Il travaille directement dans le paysage.'],
            ['Selon Duchamp, qui « fait le tableau » ?', ['Le regardeur', 'Le peintre seul', 'Le musée', 'Le collectionneur'], 0, 'L’interprétation est constitutive de l’œuvre.'],
            ['La valeur d’une œuvre contemporaine se construit aussi socialement.', ['Vrai', 'Faux'], 0, 'Galeries, foires, critiques et musées y participent.'],
            ['Le street art est resté en dehors du marché de l’art.', ['Vrai', 'Faux'], 1, 'Il y est largement entré depuis les années 2000.'],
          ],
        },
        {
          titre: 'Image numérique et création',
          lecon: {
            titre: 'Créer avec les outils numériques',
            cours: `Le numérique n’est pas un pinceau de plus : il change le **statut** de l’image — sa matière, sa copie, sa preuve.

## Pixel et vecteur
| | Matricielle (bitmap) | Vectorielle |
| Comment l’image est décrite | Une grille de pixels colorés | Des formules géométriques |
| En l’agrandissant | Elle se dégrade, se pixellise | Elle reste nette, sans perte |
| Usage typique | Photographie, peinture numérique | Logo, typographie, pictogramme |

## Résolution et formats
La résolution se lit deux fois : en **pixels** (les dimensions de l’image) et en **ppp / dpi** (sa finesse à l’impression).

| Format | Ce qu’il fait | Quand l’employer |
| JPEG | Compresse en perdant de l’information | Photo destinée au web |
| PNG | Compresse sans perte, garde la transparence | Image détourée, capture |
| TIFF | Conserve la qualité maximale | Archivage, impression |
| SVG | Vectoriel, éditable en texte | Logo, icône, schéma |

## Le montage et la retouche
Calques, masques, détourage, fondus : le montage permet des images **sans référent réel** — une scène qui n’a jamais eu lieu, photographiquement parfaite.

> D’où la question centrale du chapitre : que reste-t-il de la **valeur de preuve** d’une photographie, quand la retouche ne laisse plus de trace ?

## L’œuvre reproductible
**Walter Benjamin** l’anticipait dès 1935 : la reproduction fait perdre à l’œuvre son « aura », c’est-à-dire son ici-et-maintenant. Le numérique pousse la logique à l’extrême — copie parfaite, diffusion instantanée, auteur parfois indéterminé.`,
          },
          questions: [
            ['Quelle image ne se dégrade pas en s’agrandissant ?', ['L’image vectorielle', 'L’image matricielle', 'Le JPEG', 'La photographie'], 0, 'Elle est décrite par des formules, pas par des pixels.'],
            ['Le JPEG est un format de compression avec perte.', ['Vrai', 'Faux'], 0, 'Il allège le fichier en supprimant de l’information.'],
            ['Quel format conserve la transparence ?', ['Le PNG', 'Le JPEG', 'Le BMP', 'Le TIFF'], 0, 'Il gère un canal alpha.'],
            ['Qui a théorisé la perte d’« aura » de l’œuvre reproduite ?', ['Walter Benjamin', 'Marcel Duchamp', 'André Malraux', 'Roland Barthes'], 0, 'Dans son essai de 1935 sur l’œuvre d’art à l’ère de sa reproductibilité technique.'],
            ['Une photographie numérique constitue toujours une preuve fiable.', ['Vrai', 'Faux'], 1, 'Le montage rend possible une image sans référent réel.'],
            ['À quoi servent les calques dans un logiciel d’image ?', ['À superposer et modifier des éléments indépendamment', 'À compresser le fichier', 'À imprimer', 'À changer le format'], 0, 'Ils rendent le montage non destructif.'],
            ['Un logo gagne à être conçu en vectoriel.', ['Vrai', 'Faux'], 0, 'Il doit rester net de la carte de visite à l’affiche.'],
            ['La résolution d’impression se mesure en…', ['ppp (points par pouce)', 'Hz', 'Ko', 'cm'], 0, 'Elle conditionne la finesse du rendu imprimé.'],
          ],
        },
      ],
    },
  ],
}
