// Espagnol PREMIÈRE — les six axes culturels du programme 2025 et une
// grammaire propre au niveau (B1 → B2).
//
// SOURCE : arrêté du 5 mai 2025, BO n° 22 du 29 mai 2025, annexe 10 (programme
// d'espagnol du lycée), en vigueur en 1re à la rentrée 2026. Intitulés des axes
// et objets d'étude relevés sur La Clé des langues (ENS de Lyon), qui reproduit
// l'annexe. Cinq axes sur six à traiter dans l'année, dont OBLIGATOIREMENT
// l'axe 6, « L'espace andin, la colonne vertébrale de l'Amérique du Sud ».
//
// POURQUOI CE MODULE : la 1re avait les mêmes 37 fiches que la 2de et la Tle,
// et aucune fiche sur les axes culturels. On AJOUTE, on ne retire rien : deux
// blocs à la suite des fiches existantes (positions 40 → 51), rayon « culture »
// pour les axes, rayon « langue » pour la grammaire.
//
// Convention de la maison : la langue s'interroge EN FRANÇAIS ; l'espagnol est
// cité en exemple, jamais en énoncé.

export default {
  slug: 'espagnol',
  nom: 'Espagnol',

  titreMigration: 'ESPAGNOL 1re — AXES CULTURELS 2025 ET GRAMMAIRE DU NIVEAU',

  motif: `CONSTAT : la 1re portait les mêmes 37 fiches que la 2de et la Tle
(grammaire en 4 chapitres et 3 fiches sans chapitre), et aucune fiche sur les
axes culturels du programme de langues vivantes publié au BO n° 22 du
29 mai 2025 (arrêté du 5 mai 2025), en vigueur en 1re à la rentrée 2026.
Cette migration AJOUTE, sans rien retirer : une fiche par axe de 1re (six,
dont l'axe 6 propre à l'espagnol, « L'espace andin, la colonne vertébrale de
l'Amérique du Sud »), rangées dans le rayon « culture », et six fiches de
grammaire du niveau B1 → B2 sur des points absents des fiches existantes
(imparfait du subjonctif, temps composés, traduire « devenir », traduire
« on » et le passif, subordonnées de temps, cause et conséquence), rangées
dans le rayon « langue ».`,

  blocs: [
    // ======================================================================
    // LES SIX AXES CULTURELS DE PREMIÈRE
    // ======================================================================
    {
      niveaux: ['1re'],
      positionDepart: 40,
      rayon: 'culture',
      chapitres: [
        // ---- Axe 1 ---------------------------------------------------------
        {
          titre: 'Voyages, frontières et migrations',
          axe: 'Identités et échanges',
          lecon: {
            titre: 'Partir, passer, arriver : le monde hispanique en mouvement',
            cours: `Le monde hispanique s’est construit par des départs : conquistadors, émigrants espagnols vers l’Amérique, exilés républicains, migrants latino-américains vers le nord. L’axe 1 interroge ce que le voyage, la frontière et la migration font à l’identité.

## Ce que recouvre l’axe
1. **Voyager pour aller à la rencontre de l’autre**.
2. **Les frontières** : lignes de séparation ou de rencontre ?
3. **La migration** comme quête d’une terre d’accueil ou comme fuite.

## Repères : voyager
| Repère | Ce qu’il faut savoir |
| Le chemin de Saint-Jacques | Pèlerinage vers Saint-Jacques-de-Compostelle (Galice) depuis le Moyen Âge ; aujourd’hui, des centaines de milliers de marcheurs par an. |
| *Diarios de motocicleta* | Le voyage du jeune Ernesto Guevara à travers l’Amérique du Sud en 1952, filmé par Walter Salles (2004) : le voyage qui fait découvrir l’injustice. |

## Repères : les frontières
| Repère | Ce qu’il faut savoir |
| La frontière Mexique – États-Unis | Environ 3 100 km, en partie murée ; des migrants d’Amérique centrale la rejoignent sur le toit du train surnommé *La Bestia*. Film : *La jaula de oro* (Diego Quemada-Díez, 2013). |
| Ceuta et Melilla | Villes espagnoles en Afrique du Nord, entourées de hautes clôtures (*vallas*) : la frontière terrestre de l’Union européenne avec le Maroc. |

## Repères : les migrations
| Repère | Ce qu’il faut savoir |
| L’émigration espagnole | Vers l’Amérique à la fin du XIXe siècle ; vers la France, l’Allemagne, la Suisse dans les années 1960. |
| La Retirada (1939) | À la fin de la guerre civile, près d’un demi-million de républicains fuient vers la France. |
| L’exode vénézuélien | Depuis 2015, plus de sept millions de Vénézuéliens ont quitté leur pays, surtout vers la Colombie et le Pérou. |
| Les *cayucos* des Canaries | Des pirogues venues d’Afrique de l’Ouest tentent la traversée atlantique vers les Canaries, au prix de nombreux naufrages. |

## Le vocabulaire
| Espagnol | Français |
| emigrar, inmigrar | émigrer, immigrer |
| el emigrante, el inmigrante | l’émigré, l’immigré |
| el exilio, exiliarse | l’exil, s’exiler |
| cruzar la frontera | passer la frontière |
| el muro, la valla | le mur, la clôture |
| el país de acogida | le pays d’accueil |
| echar de menos | regretter, avoir le mal du pays |
| integrarse | s’intégrer |
| sin papeles | sans papiers |

## Problématiques et documents
- *¿Viajar nos transforma?* Documents : extrait de *Diarios de motocicleta*, une photo du chemin de Saint-Jacques.
- *¿Las fronteras separan o unen?* Documents : une photo du mur à Tijuana, la chanson *Clandestino* de Manu Chao (1998).
- *¿Por qué se emigra?* Documents : un graphique de l’exode vénézuélien, une photo de la Retirada.

## Argumenter à l’oral
| Pour… | Dis… |
| Poser le problème | *Cabe preguntarse si…* |
| Expliquer une cause | *Muchos emigran porque…, ya que…* |
| Opposer | *Por un lado…, por otro lado…* |
| Conclure | *En definitiva…* |

> Une frontière est à la fois un mur et un lieu de passage : c’est cette ambivalence que l’axe te demande de montrer.

## Exemple travaillé
*Este documento muestra el muro entre México y Estados Unidos. Por un lado, protege un territorio; por otro lado, separa familias. Cabe preguntarse si un muro puede frenar a quien huye de la pobreza. En definitiva, la frontera es tanto una barrera como un lugar de encuentro.*`,
          },
          questions: [
            ['Quel voyage raconte *Diarios de motocicleta* ?', ['Le voyage de Colomb en 1492', 'Le voyage du jeune Ernesto Guevara en Amérique du Sud en 1952', 'Le pèlerinage de Saint-Jacques', 'L’exil de Neruda'], 1, 'Le film de Walter Salles (2004) montre comment le voyage révèle l’injustice sociale.'],
            ['Quelle est la longueur approximative de la frontière entre le Mexique et les États-Unis ?', ['500 km', '1 200 km', '3 100 km', '8 000 km'], 2, 'Environ 3 100 km, dont une partie est murée.'],
            ['Comment surnomme-t-on le train de marchandises que prennent les migrants au Mexique ?', ['La Bestia', 'El Dorado', 'La Retirada', 'El Cayuco'], 0, 'Les migrants voyagent sur son toit, au péril de leur vie.'],
            ['Que désigne la Retirada de 1939 ?', ['Le retour des émigrés d’Amérique', 'La fin de la Reconquête', 'La défaite de l’Invincible Armada', 'L’exil de près d’un demi-million de républicains vers la France'], 3, 'À la fin de la guerre civile, ils fuient la victoire de Franco.'],
            ['Où se trouvent Ceuta et Melilla ?', ['Aux Canaries', 'En Afrique du Nord, face au Maroc', 'Dans les Pyrénées', 'Aux Baléares'], 1, 'Ce sont deux villes espagnoles sur le continent africain.'],
            ['Depuis 2015, combien de Vénézuéliens environ ont quitté leur pays ?', ['Quelques milliers', 'Environ 100 000', 'Plus de sept millions', 'Un million exactement'], 2, 'C’est l’un des plus grands exodes du monde actuel.'],
            ['Que signifie *echar de menos* ?', ['Regretter, manquer de quelqu’un', 'Jeter', 'Oublier', 'Diminuer'], 0, '*Echo de menos a mi familia* = ma famille me manque.'],
            ['Comment dit-on « le pays d’accueil » ?', ['el país de origen', 'el país de salida', 'el país vecino', 'el país de acogida'], 3, '*Acoger* = accueillir.'],
            ['Que sont les *cayucos* ?', ['Des pirogues de migrants vers les Canaries', 'Des trains', 'Des passeports', 'Des camps de réfugiés'], 0, 'Venues d’Afrique de l’Ouest, elles tentent une traversée atlantique très dangereuse.'],
            ['Dans les années 1960, beaucoup d’Espagnols ont émigré vers la France, l’Allemagne ou la Suisse.', ['Vrai', 'Faux'], 0, 'Ils fuyaient la pauvreté de l’Espagne franquiste.'],
            ['Quelle formule sert à POSER un problème ?', ['En definitiva…', 'Cabe preguntarse si…', 'Por otro lado…', 'Ya que…'], 1, '« On peut se demander si… » : idéal pour une problématique.'],
            ['Qui chante *Clandestino* (1998) ?', ['Mercedes Sosa', 'Shakira', 'Manu Chao', 'Víctor Jara'], 2, 'La chanson donne voix aux sans-papiers : *Solo voy con mi pena…*'],
          ],
        },

        // ---- Axe 2 ---------------------------------------------------------
        {
          titre: 'Minorités, droits et pluralité des langues',
          axe: 'Diversité et inclusion',
          lecon: {
            titre: 'Vivre ensemble avec nos différences',
            cours: `Peuples autochtones, Gitans, afrodescendants, personnes handicapées, minorités sexuelles, langues minoritaires : l’axe 2 te demande comment les sociétés hispaniques rendent visibles leurs différences et apprennent à vivre ensemble.

## Ce que recouvre l’axe
1. **Vivre ensemble avec nos différences**.
2. **Rendre visibles les minorités culturelles**.
3. **La pluralité linguistique** dans les pays hispanophones.

## Repères : vivre ensemble
| Repère | Ce qu’il faut savoir |
| Le mariage pour tous en Espagne (2005) | L’Espagne est l’un des premiers pays au monde à l’ouvrir aux couples de même sexe ; l’Argentine suit en 2010. |
| *Campeones*, Javier Fesser (2018) | Un entraîneur doit diriger une équipe de basket de joueurs ayant une déficience intellectuelle ; les acteurs le sont aussi. Goya du meilleur film. |

## Repères : les minorités visibles
| Repère | Ce qu’il faut savoir |
| Les Gitans d’Espagne | Présents depuis le XVe siècle, longtemps discriminés ; leur culture a nourri le flamenco. |
| Rigoberta Menchú (Guatemala) | Militante maya k’iche’, prix Nobel de la paix en 1992 pour sa défense des peuples autochtones. |
| La Bolivie plurinationale | La Constitution de 2009 fait de la Bolivie un « État plurinational » et reconnaît les langues des peuples autochtones ; Evo Morales, d’origine aymara, a été président de 2006 à 2019. |
| Les afrodescendants | Descendants des esclaves africains, nombreux en Colombie (Chocó, Carthagène), à Cuba, au Pérou ; San Basilio de Palenque (Colombie) est un village fondé par des esclaves en fuite. |

## Repères : la pluralité linguistique
| Pays | Langues |
| Espagne | castillan ; catalan, basque, galicien co-officiels dans leurs communautés |
| Mexique | espagnol et 68 langues autochtones reconnues comme nationales (loi de 2003), dont le nahuatl, la langue des Aztèques |
| Pérou, Bolivie | quechua et aymara, à côté de l’espagnol |
| Paraguay | espagnol et guarani, tous deux officiels |

## Le vocabulaire
| Espagnol | Français |
| la minoría, minoritario | la minorité, minoritaire |
| la inclusión, incluir | l’inclusion, inclure |
| la discriminación, discriminar | la discrimination, discriminer |
| la igualdad de derechos | l’égalité des droits |
| la discapacidad | le handicap |
| los pueblos indígenas | les peuples autochtones |
| visibilizar | rendre visible |
| la lengua cooficial | la langue co-officielle |
| la convivencia | le vivre-ensemble |

## Problématiques et documents
- *¿Cómo convivir con nuestras diferencias?* Documents : l’affiche de *Campeones*, un article sur le mariage pour tous.
- *¿Qué papel tienen los artistas para visibilizar a las minorías?* Documents : le discours de Rigoberta Menchú, une photo de Palenque.
- *¿Una lengua minoritaria está condenada a desaparecer?* Documents : une carte des langues du Mexique, un article sur l’enseignement du quechua.

## Argumenter à l’oral
| Pour… | Dis… |
| Exprimer une nécessité | *Es necesario que…, hace falta que…* (+ subjonctif) |
| Dénoncer | *Es inadmisible que…* (+ subjonctif) |
| Reconnaître un progrès | *Se ha avanzado mucho, pero queda mucho por hacer.* |
| Illustrer | *Un buen ejemplo de ello es…* |

> L’inclusion ne consiste pas à effacer les différences, mais à donner à chacun les mêmes droits et la même visibilité.

## Exemple travaillé
*En Bolivia, la Constitución de 2009 reconoce las lenguas de los pueblos indígenas. Un buen ejemplo de ello es el aymara, que se enseña hoy en las escuelas. Se ha avanzado mucho, pero queda mucho por hacer: es necesario que estas lenguas se usen también en la administración.*`,
          },
          questions: [
            ['En quelle année l’Espagne a-t-elle ouvert le mariage aux couples de même sexe ?', ['1978', '2005', '2015', '1992'], 1, 'Elle est l’un des premiers pays au monde à le faire ; l’Argentine suit en 2010.'],
            ['Qui est Rigoberta Menchú ?', ['Une chanteuse argentine', 'Une présidente chilienne', 'Une militante maya, prix Nobel de la paix 1992', 'Une peintre mexicaine'], 2, 'Elle défend les droits des peuples autochtones du Guatemala.'],
            ['Quelle Constitution a fait de la Bolivie un « État plurinational » ?', ['Celle de 2009', 'Celle de 1825', 'Celle de 1952', 'Celle de 1978'], 0, 'Elle reconnaît les peuples et les langues autochtones.'],
            ['Que raconte le film *Campeones* (2018) ?', ['L’histoire d’un club de football', 'La vie d’un torero', 'Un voyage en Amérique', 'Une équipe de basket de joueurs ayant une déficience intellectuelle'], 3, 'Les acteurs de l’équipe ont eux-mêmes une déficience intellectuelle ; le film a reçu le Goya du meilleur film.'],
            ['Quelle langue parlaient les Aztèques ?', ['Le quechua', 'Le nahuatl', 'Le guarani', 'L’aymara'], 1, 'Le nahuatl est encore parlé par plus d’un million de Mexicains.'],
            ['Combien de langues autochtones le Mexique reconnaît-il comme nationales ?', ['3', '12', '68', '200'], 2, 'La loi de 2003 leur donne le statut de langues nationales, à côté de l’espagnol.'],
            ['Qu’est-ce que San Basilio de Palenque ?', ['Un village colombien fondé par des esclaves en fuite', 'Un quartier de Madrid', 'Une île des Caraïbes', 'Une réserve naturelle'], 0, 'Ses habitants, afrodescendants, parlent une langue créole, le palenquero.'],
            ['Que signifie *la discapacidad* ?', ['La capacité', 'La discipline', 'La discrimination', 'Le handicap'], 3, '*Una persona con discapacidad* = une personne handicapée.'],
            ['Evo Morales, président de la Bolivie de 2006 à 2019, est d’origine aymara.', ['Vrai', 'Faux'], 0, 'Il a été le premier chef d’État issu d’un peuple autochtone en Bolivie.'],
            ['Après *Es necesario que…*, quel mode emploie-t-on ?', ['L’indicatif', 'Le subjonctif', 'L’infinitif', 'Le conditionnel'], 1, 'Une nécessité exprimée par une tournure impersonnelle + *que* appelle le subjonctif.'],
            ['Que signifie *la convivencia* ?', ['La convocation', 'La convivialité d’un repas', 'Le vivre-ensemble', 'La conviction'], 2, '*Convivir* = vivre ensemble, cohabiter.'],
            ['Au Paraguay, seul l’espagnol est langue officielle.', ['Vrai', 'Faux'], 1, 'Le guarani est lui aussi langue officielle, et parlé par la majorité de la population.'],
          ],
        },

        // ---- Axe 3 ---------------------------------------------------------
        {
          titre: 'Peindre pour le prince, chanter contre le dictateur',
          axe: 'Art et pouvoir',
          lecon: {
            titre: 'L’art entre commande, censure et engagement',
            cours: `Les rois ont eu leurs peintres, les révolutions leurs muralistes, les dictatures leurs censeurs, et la résistance ses chanteurs. L’axe 3 t’invite à observer les liens entre l’art et le pouvoir dans le monde hispanique.

## Ce que recouvre l’axe
1. **L’art au service du pouvoir** ou censuré par le pouvoir.
2. **L’artiste engagé**.
3. **Le pouvoir de l’art**.

## L’art au service du pouvoir
| Repère | Ce qu’il faut savoir |
| Velázquez, peintre du roi | Portraitiste de Philippe IV au XVIIe siècle, il glorifie la monarchie (*La reddition de Breda*, 1635). |
| Le muralisme mexicain | Après la Révolution (1910-1920), l’État commande des fresques murales pour raconter l’histoire au peuple : Diego Rivera, José Clemente Orozco, David Alfaro Siqueiros, à partir de 1921. |
| Le Valle de los Caídos | Monument bâti sous Franco, où il a été enterré jusqu’en 2019 ; rebaptisé Valle de Cuelgamuros en 2022. |

## L’art censuré
| Repère | Ce qu’il faut savoir |
| La censure franquiste | Livres, films et chansons contrôlés jusqu’en 1977. *Viridiana* de Luis Buñuel, Palme d’or 1961, est interdit en Espagne. |
| Víctor Jara (Chili) | Chanteur engagé, assassiné en septembre 1973, quelques jours après le coup d’État de Pinochet. |
| La fresque de Rivera à New York | En 1934, la fresque commandée par Rockefeller est détruite parce qu’elle montrait Lénine. |

## L’artiste engagé et le pouvoir de l’art
| Repère | Ce qu’il faut savoir |
| *Guernica*, Picasso (1937) | Peint après le bombardement de la ville basque par l’aviation allemande alliée de Franco ; Picasso refuse qu’il entre en Espagne avant le retour de la démocratie : il n’y arrive qu’en 1981. |
| Violeta Parra (Chili) | Chanteuse et collecteuse de musique populaire : *Gracias a la vida* (1966). |
| Mercedes Sosa (Argentine) | « La voix des sans-voix », exilée sous la dictature. |
| Les *arpilleras* chiliennes | Tapisseries brodées par des femmes sous Pinochet pour dénoncer les disparitions. |

## Le vocabulaire
| Espagnol | Français |
| el encargo, encargar | la commande, commander |
| la censura, censurar | la censure, censurer |
| el mural, el muralista | la fresque, le muraliste |
| comprometido | engagé |
| denunciar | dénoncer |
| la propaganda | la propagande |
| la dictadura, el dictador | la dictature, le dictateur |
| desaparecer, los desaparecidos | disparaître, les disparus |

## Problématiques et documents
- *¿Puede un artista ser libre si trabaja para el poder?* Documents : *La reddition de Breda*, une fresque de Rivera.
- *¿Por qué los dictadores temen a los artistas?* Documents : la biographie de Víctor Jara, une *arpillera*.
- *¿Un cuadro puede cambiar la historia?* Document : *Guernica* et son voyage de retour en 1981.

## Argumenter à l’oral
| Pour… | Dis… |
| Analyser une intention | *El artista pretende…, busca denunciar…* |
| Évaluer l’effet | *Esta obra consigue que el espectador…* (+ subjonctif) |
| Nuancer | *Si bien…, no es menos cierto que…* |

> L’art peut servir le pouvoir, le contester ou lui survivre : *Guernica* est devenu plus célèbre que le bombardement qu’il dénonce.

## Exemple travaillé
*Guernica es un cuadro que Picasso pintó en 1937 para denunciar el bombardeo de una ciudad vasca. El artista pretende mostrar el horror de la guerra con figuras deformadas y en blanco y negro. Si bien no detuvo la guerra, esta obra consigue que el espectador no olvide a las víctimas.*`,
          },
          questions: [
            ['De quel roi Velázquez était-il le peintre ?', ['Charles Quint', 'Philippe II', 'Philippe IV', 'Alphonse XIII'], 2, 'Au XVIIe siècle, il peint la cour et glorifie la monarchie.'],
            ['Pourquoi l’État mexicain a-t-il commandé des fresques murales après la Révolution ?', ['Pour décorer les églises', 'Pour raconter l’histoire au peuple', 'Pour attirer les touristes', 'Pour imiter l’Europe'], 1, 'À partir de 1921, Rivera, Orozco et Siqueiros peignent l’histoire nationale sur les murs publics.'],
            ['Quel film de Buñuel, Palme d’or 1961, fut interdit en Espagne ?', ['Viridiana', 'Volver', 'Campeones', 'Roma'], 0, 'La censure franquiste l’a jugé blasphématoire.'],
            ['Qu’est-il arrivé à Víctor Jara en septembre 1973 ?', ['Il est parti en exil à Paris', 'Il a reçu le prix Nobel', 'Il est devenu ministre', 'Il a été assassiné après le coup d’État de Pinochet'], 3, 'Chanteur engagé, il est tué quelques jours après le coup d’État.'],
            ['Quand *Guernica* est-il arrivé en Espagne ?', ['En 1937', 'En 1981, après le retour de la démocratie', 'En 1975, à la mort de Franco', 'En 1992, pour les Jeux olympiques'], 1, 'Picasso refusait que le tableau entre en Espagne tant que la démocratie n’y était pas rétablie.'],
            ['Que sont les *arpilleras* chiliennes ?', ['Des chansons populaires', 'Des danses', 'Des tapisseries brodées pour dénoncer les disparitions', 'Des journaux clandestins'], 2, 'Des femmes les brodaient sous Pinochet.'],
            ['Qui a chanté *Gracias a la vida* (1966) ?', ['Violeta Parra', 'Mercedes Sosa en premier', 'Víctor Jara', 'Shakira'], 0, 'Violeta Parra l’a composée et enregistrée ; Mercedes Sosa l’a rendue célèbre dans toute l’Amérique.'],
            ['Pourquoi la fresque de Rivera au Rockefeller Center fut-elle détruite ?', ['Elle était trop grande', 'Elle s’effritait', 'Elle représentait Franco', 'Elle montrait Lénine'], 3, 'Le commanditaire refusait ce portrait ; la fresque fut détruite en 1934.'],
            ['Que signifie *comprometido* en parlant d’un artiste ?', ['Compromis', 'Engagé', 'Célèbre', 'Censuré'], 1, '*Un artista comprometido* = un artiste engagé.'],
            ['La censure franquiste a duré jusqu’en 1977.', ['Vrai', 'Faux'], 0, 'Elle disparaît pendant la Transition, avant la Constitution de 1978.'],
            ['Après *Esta obra consigue que el espectador…*, quel mode faut-il ?', ['L’indicatif', 'L’infinitif', 'Le subjonctif', 'Le gérondif'], 2, '*Conseguir que* exprime un effet obtenu sur autrui : subjonctif.'],
            ['Quel nouveau nom le Valle de los Caídos a-t-il reçu en 2022 ?', ['Valle de la Paz', 'Valle de Cuelgamuros', 'Valle de la Memoria', 'Valle de Guernica'], 1, 'La loi de mémoire démocratique a rendu au lieu son nom géographique.'],
          ],
        },

        // ---- Axe 4 ---------------------------------------------------------
        {
          titre: 'Ramón y Cajal, les robots et le bistouri',
          axe: 'Innovations scientifiques et responsabilité',
          lecon: {
            titre: 'Innover, oui : mais à quel prix ?',
            cours: `Le progrès scientifique ouvre des possibilités immenses et pose des questions nouvelles : qui travaille quand les machines travaillent ? Jusqu’où peut-on modifier un corps ? L’axe 4 t’invite à réfléchir à la responsabilité qui accompagne l’innovation, à partir d’un grand savant espagnol.

## Ce que recouvre l’axe
1. **Le monde du travail bouleversé** à l’heure des innovations.
2. **Santiago Ramón y Cajal** : le père des neurosciences.
3. **Chirurgie esthétique… et éthique ?**

## Santiago Ramón y Cajal (1852-1934)
| Repère | Ce qu’il faut savoir |
| Origine | Né à Petilla de Aragón (Navarre), fils de médecin, enfant turbulent passionné de dessin. |
| La découverte | Il montre que le système nerveux est fait de cellules distinctes, les **neurones**, qui communiquent sans se toucher : c’est la « doctrine du neurone ». |
| La méthode | Il perfectionne la coloration à l’argent inventée par l’Italien Camillo Golgi et dessine des milliers de neurones à la main. |
| Le Nobel | Prix Nobel de physiologie ou médecine en **1906**, partagé avec Golgi. |
| L’image | Il appelait les neurones « les papillons de l’âme » (*las mariposas del alma*). |

Autre Nobel espagnol de médecine : Severo Ochoa, en 1959, pour ses travaux sur l’ARN.

## Le travail bouleversé
| Repère | Ce qu’il faut savoir |
| Les livreurs des plateformes | En Espagne, la « loi Rider » (2021) présume que les livreurs à vélo sont des salariés et non des indépendants. |
| Le télétravail | Généralisé pendant la pandémie de 2020, il reste une question : liberté ou isolement ? |
| L’intelligence artificielle | Elle transforme les métiers de la traduction, de la banque ou du service client. |

## La chirurgie esthétique
Le Mexique et la Colombie figurent parmi les pays où l’on pratique le plus d’opérations de chirurgie esthétique. Des séries et des romans (*Sin tetas no hay paraíso*, en Colombie) ont montré la pression de modèles de beauté parfois imposés par l’argent. La question éthique : liberté de disposer de son corps, ou soumission à une norme ?

## Le vocabulaire
| Espagnol | Français |
| el avance, el progreso | l’avancée, le progrès |
| el investigador, la investigación | le chercheur, la recherche |
| la neurona, el cerebro | le neurone, le cerveau |
| el premio Nobel | le prix Nobel |
| el empleo, el paro | l’emploi, le chômage |
| el teletrabajo | le télétravail |
| la inteligencia artificial | l’intelligence artificielle |
| la cirugía estética | la chirurgie esthétique |
| el canon de belleza | le canon de beauté |

## Problématiques et documents
- *¿Qué hace de Ramón y Cajal un modelo para la ciencia?* Documents : un de ses dessins de neurones, une biographie.
- *¿La tecnología destruye o crea empleo?* Documents : un article sur la loi Rider, un dessin de presse sur l’IA.
- *¿Hasta dónde se puede transformar el cuerpo?* Documents : une publicité de clinique, un témoignage.

## Argumenter à l’oral
| Pour… | Dis… |
| Peser le pour et le contre | *Tiene ventajas, como…; sin embargo, plantea problemas…* |
| Exprimer une réserve | *No cabe duda de que…, pero…* |
| Exprimer une condition | *Siempre que…* (+ subjonctif) |
| Poser la question éthique | *¿Es ético que…?* (+ subjonctif) |

> Le progrès n’est pas bon ou mauvais en soi : tout dépend de l’usage qu’on en fait et de qui en paie le prix.

## Exemple travaillé
*Ramón y Cajal descubrió que el cerebro está formado por neuronas independientes. No cabe duda de que sus dibujos cambiaron la ciencia. Hoy la inteligencia artificial imita esas redes de neuronas: tiene ventajas, como la rapidez; sin embargo, plantea problemas, como la pérdida de empleos.*`,
          },
          questions: [
            ['Quelle découverte a rendu célèbre Santiago Ramón y Cajal ?', ['Le vaccin contre la rage', 'La structure de l’ADN', 'Le système nerveux fait de cellules distinctes, les neurones', 'La circulation du sang'], 2, 'C’est la « doctrine du neurone », fondement des neurosciences.'],
            ['En quelle année Ramón y Cajal a-t-il reçu le prix Nobel ?', ['1906', '1959', '1934', '1898'], 0, 'Il l’a partagé avec l’Italien Camillo Golgi.'],
            ['Comment Ramón y Cajal appelait-il les neurones ?', ['Les étoiles du cerveau', 'Les arbres de la pensée', 'Les soldats de l’esprit', 'Les papillons de l’âme'], 3, '*Las mariposas del alma* : une image de dessinateur autant que de savant.'],
            ['Avec qui Ramón y Cajal a-t-il partagé son prix Nobel ?', ['Severo Ochoa', 'Camillo Golgi', 'Louis Pasteur', 'Marie Curie'], 1, 'Golgi avait inventé la coloration à l’argent que Cajal a perfectionnée.'],
            ['Que prévoit la « loi Rider » espagnole de 2021 ?', ['L’interdiction des vélos en ville', 'Des aides aux cyclistes', 'Que les livreurs des plateformes sont présumés salariés', 'La fin du télétravail'], 2, 'Elle protège les livreurs contre le faux statut d’indépendant.'],
            ['Quel autre Espagnol a reçu le Nobel de médecine, en 1959 ?', ['Severo Ochoa', 'Pablo Neruda', 'Juan Ramón Jiménez', 'Gabriel García Márquez'], 0, 'Ses travaux portaient sur l’ARN ; les trois autres sont des Nobel de littérature.'],
            ['Que signifie *el paro* en Espagne ?', ['La grève', 'Le chômage', 'Le parking', 'La paresse'], 1, '*Estar en paro* = être au chômage ; la grève se dit *la huelga*.'],
            ['Que signifie *el canon de belleza* ?', ['Le canon de beauté', 'Le salon de beauté', 'Le concours de beauté', 'Le produit de beauté'], 0, 'Le modèle idéal imposé par une société.'],
            ['Ramón y Cajal dessinait les neurones à la main.', ['Vrai', 'Faux'], 0, 'Ses milliers de dessins servent encore aujourd’hui dans l’enseignement.'],
            ['Après *¿Es ético que…?*, quel mode faut-il ?', ['L’indicatif', 'L’infinitif', 'Le futur', 'Le subjonctif'], 3, 'Un jugement de valeur + *que* entraîne le subjonctif : *¿Es ético que una clínica anuncie…?*'],
            ['Que signifie *No cabe duda de que…* ?', ['Il n’y a pas de place pour…', 'Il ne fait aucun doute que…', 'Je doute que…', 'Il n’est pas certain que…'], 1, 'Une certitude : suivie de l’indicatif.'],
            ['Dans quelle région est né Ramón y Cajal ?', ['En Galice', 'En Andalousie', 'En Navarre, à Petilla de Aragón', 'À Madrid'], 2, 'Petilla de Aragón est une enclave navarraise entourée par l’Aragon.'],
          ],
        },

        // ---- Axe 5 ---------------------------------------------------------
        {
          titre: 'Protéger la nature, de Doñana aux Galápagos',
          axe: 'L’être humain et la nature',
          lecon: {
            titre: 'La nature, source de culture et ressource menacée',
            cours: `Du culte de la Pachamama aux colonnes-arbres de Gaudí, la nature est au cœur de la culture hispanique. Elle est aussi exploitée jusqu’à l’épuisement. L’axe 5 te fait passer de l’admiration à la responsabilité.

## Ce que recouvre l’axe
1. **La nature au cœur de la culture hispanique**.
2. **La préservation du milieu naturel**.
3. **Les conséquences de la surexploitation** de la nature.

## La nature dans la culture
| Repère | Ce qu’il faut savoir |
| La Pachamama | La « Terre-Mère » des peuples andins, que l’on remercie par des offrandes. |
| Gaudí et la Sagrada Familia | À Barcelone, les colonnes de la nef se ramifient comme des arbres : Gaudí voulait une forêt de pierre. |
| Neruda, *Canto general* (1950) | Le poète chilien chante les fleuves, les arbres et les animaux du continent américain. |
| L’Équateur et les droits de la nature | Sa Constitution de 2008 est la première au monde à reconnaître des droits à la nature. |

## La préservation
| Repère | Ce qu’il faut savoir |
| Doñana (Andalousie) | Parc national depuis 1969, patrimoine mondial depuis 1994 : l’une des plus grandes zones humides d’Europe, menacée par le pompage de l’eau pour l’agriculture. |
| Les îles Galápagos (Équateur) | Laboratoire de Darwin, parc national depuis 1959 ; le tourisme y est strictement encadré. |
| Le Costa Rica | Environ un quart du territoire est protégé ; le pays a reboisé une grande partie de ses forêts et vit de l’écotourisme. |

## La surexploitation
| Repère | Ce qu’il faut savoir |
| L’Amazonie | La déforestation (élevage, soja, mines) touche aussi la Colombie, le Pérou et la Bolivie. |
| La sécheresse en Espagne | Réservoirs à leur plus bas niveau en Catalogne en 2024 ; les serres d’Almería et les cultures irriguées assèchent les nappes. |
| Les incendies | Chaque été, des milliers d’hectares brûlent en Espagne, au Chili, en Argentine. |

## Le vocabulaire
| Espagnol | Français |
| el medio natural | le milieu naturel |
| el espacio protegido | l’espace protégé |
| la deforestación | la déforestation |
| la sequía | la sécheresse |
| el incendio forestal | l’incendie de forêt |
| agotar, el agotamiento | épuiser, l’épuisement |
| la especie en peligro de extinción | l’espèce menacée d’extinction |
| los recursos naturales | les ressources naturelles |
| el invernadero | la serre |

## Problématiques et documents
- *¿Por qué la naturaleza inspira a los artistas hispanos?* Documents : une photo de la Sagrada Familia, un poème de Neruda.
- *¿Se puede proteger la naturaleza y vivir de ella?* Documents : un reportage sur l’écotourisme au Costa Rica.
- *¿Quién paga el precio de la sobreexplotación?* Documents : une photo satellite des serres d’Almería, un graphique de la déforestation.

## Argumenter à l’oral
| Pour… | Dis… |
| Alerter | *Es urgente que…* (+ subjonctif) |
| Montrer une conséquence | *Por consiguiente…, lo que provoca…* |
| Proposer | *Convendría…, deberíamos…* |
| Relativiser | *Hay que matizar: …* |

> La nature n’est pas un décor : elle est une ressource, un héritage et, en Équateur, un sujet de droit.

## Exemple travaillé
*Doñana es uno de los humedales más importantes de Europa. Sin embargo, los agricultores extraen demasiada agua, lo que provoca la desaparición de las lagunas. Es urgente que se proteja el acuífero; convendría limitar los cultivos más exigentes en agua.*`,
          },
          questions: [
            ['Que désigne la Pachamama ?', ['Un volcan', 'La Terre-Mère des peuples andins', 'Une danse bolivienne', 'Une déesse aztèque de la guerre'], 1, 'On la remercie par des offrandes, notamment en août.'],
            ['Quel pays a reconnu le premier des droits à la nature dans sa Constitution, en 2008 ?', ['L’Espagne', 'Le Mexique', 'L’Équateur', 'Le Chili'], 2, 'La Constitution équatorienne de 2008 fait de la nature un sujet de droit.'],
            ['Où se trouve le parc national de Doñana ?', ['En Andalousie', 'En Galice', 'Aux Canaries', 'En Catalogne'], 0, 'C’est l’une des plus grandes zones humides d’Europe.'],
            ['Quelle menace pèse principalement sur Doñana ?', ['Les volcans', 'Le tourisme de ski', 'Les ouragans', 'Le pompage de l’eau pour l’agriculture'], 3, 'L’irrigation assèche l’aquifère qui alimente les lagunes.'],
            ['À quoi ressemblent les colonnes de la Sagrada Familia ?', ['À des vagues', 'À des arbres qui se ramifient', 'À des montagnes', 'À des nuages'], 1, 'Gaudí voulait une forêt de pierre.'],
            ['Quel poète chilien a écrit le *Canto general* (1950) ?', ['Gabriela Mistral', 'Octavio Paz', 'Pablo Neruda', 'Federico García Lorca'], 2, 'Il y chante la nature et l’histoire de tout le continent.'],
            ['Que signifie *la sequía* ?', ['La sécheresse', 'La récolte', 'La soif', 'La forêt'], 0, '*Seco* = sec ; *la sequía* = la sécheresse.'],
            ['Quelle part approximative du Costa Rica est protégée ?', ['Presque rien', 'La totalité', 'La moitié exactement', 'Environ un quart'], 3, 'Le pays vit en partie de l’écotourisme.'],
            ['Les îles Galápagos appartiennent à l’Équateur.', ['Vrai', 'Faux'], 0, 'Elles sont célèbres pour les observations de Darwin.'],
            ['Que signifie *el invernadero* ?', ['L’hiver', 'La serre', 'L’inventaire', 'L’entrepôt'], 1, 'Les serres d’Almería forment une « mer de plastique » visible depuis l’espace.'],
            ['Quelle expression introduit une conséquence ?', ['Es urgente que', 'Hay que matizar', 'Por consiguiente', 'Convendría'], 2, '*Por consiguiente* = par conséquent.'],
            ['Comment dit-on « une espèce menacée d’extinction » ?', ['una especie en peligro de extinción', 'una especie amenazada de desaparición', 'una especie en extinción peligrosa', 'una especie peligrosa'], 0, '*Estar en peligro de extinción* est l’expression consacrée.'],
          ],
        },

        // ---- Axe 6 ---------------------------------------------------------
        {
          titre: 'Les Andes, des Incas au lithium',
          axe: 'L’espace andin, la colonne vertébrale de l’Amérique du Sud',
          lecon: {
            titre: 'Une cordillère, sept pays, un héritage commun',
            cours: `Les Andes, plus longue chaîne de montagnes du monde, traversent l’Amérique du Sud du nord au sud. L’axe 6, propre à l’espagnol et **obligatoire** en 1re, te fait découvrir cet espace qui fascine, qui unit des peuples très divers, et qui affronte de grands défis.

## Ce que recouvre l’axe
1. **Les Andes, un espace fascinant** qui alimente l’imaginaire collectif.
2. **Entre diversité géographique et héritage identitaire commun**.
3. **Les défis socio-économiques et environnementaux** actuels dans les pays andins.

## Un espace immense
| Repère | Ce qu’il faut savoir |
| 7 pays | Venezuela, Colombie, Équateur, Pérou, Bolivie, Chili, Argentine. |
| Environ 7 000 km | La plus longue chaîne de montagnes continentale du monde. |
| L’Aconcagua (Argentine) | 6 961 m : le plus haut sommet des Amériques. |
| Le lac Titicaca | À plus de 3 800 m, entre le Pérou et la Bolivie. |
| La Paz (Bolivie) | Siège du gouvernement, vers 3 600 m d’altitude. |
| Des paysages contrastés | Glaciers, hauts plateaux (*altiplano*), désert d’Atacama (Chili), forêts tropicales sur le versant amazonien. |

## Un héritage commun
| Repère | Ce qu’il faut savoir |
| L’Empire inca (Tawantinsuyu) | Capitale : Cuzco. Au XVe siècle, il s’étend de l’Équateur au Chili, relié par le Qhapaq Ñan, réseau de chemins inscrit à l’UNESCO en 2014. |
| Machu Picchu | Cité inca du XVe siècle, révélée au monde par Hiram Bingham en 1911, patrimoine mondial depuis 1983. |
| Les langues | Le quechua et l’aymara sont encore parlés par des millions de personnes. |
| La pomme de terre | Domestiquée dans les Andes ; le Pérou en cultive des milliers de variétés. |
| Les animaux | Le condor, le lama, l’alpaga, la vigogne. |
| L’indépendance | Simón Bolívar libère le nord des Andes ; la Bolivie porte son nom depuis 1825. |

## L’imaginaire
*El cóndor pasa*, air composé par le Péruvien Daniel Alomía Robles en 1913, a fait le tour du monde. Neruda consacre à Machu Picchu *Alturas de Macchu Picchu*, dans le *Canto general*.

## Les défis d’aujourd’hui
| Défi | Ce qu’il faut savoir |
| Les mines | Argent de Potosí à l’époque coloniale ; aujourd’hui, le Chili est le premier producteur mondial de cuivre. |
| Le lithium | Le « triangle du lithium » (Bolivie, Chili, Argentine) concentre une grande part des réserves mondiales, utilisées pour les batteries : richesse ou pillage de l’eau des salars ? |
| La fonte des glaciers | Le glacier de Chacaltaya (Bolivie) a disparu vers 2009 ; les villes andines dépendent de l’eau des glaciers. |
| Les inégalités | Entre villes et campagnes, entre populations métisses et autochtones. |
| Le *buen vivir* | Principe andin (*sumak kawsay* en quechua) inscrit dans les Constitutions de l’Équateur (2008) et de la Bolivie (2009) : vivre en harmonie avec la communauté et la nature. |

## Le vocabulaire
| Espagnol | Français |
| la cordillera | la cordillère |
| el altiplano | le haut plateau |
| la cumbre | le sommet |
| el glaciar | le glacier |
| la minería, la mina | l’exploitation minière, la mine |
| el salar | le désert de sel |
| el mestizaje | le métissage |
| las comunidades campesinas | les communautés paysannes |

## Argumenter à l’oral
| Pour… | Dis… |
| Présenter un espace | *Se extiende desde… hasta…* |
| Souligner un paradoxe | *Paradójicamente…, a pesar de sus riquezas…* |
| Envisager l’avenir | *En el futuro, será necesario que…* (+ subjonctif) |

> Les Andes sont une colonne vertébrale au sens propre : elles relient sept pays par une même montagne, une même histoire et les mêmes défis.

## Exemple travaillé
*La cordillera de los Andes se extiende desde Venezuela hasta el sur de Chile y Argentina. Paradójicamente, a pesar de sus riquezas mineras como el litio, muchas comunidades campesinas siguen siendo pobres. En el futuro, será necesario que la explotación respete el agua y a los pueblos indígenas.*`,
          },
          questions: [
            ['Combien de pays la cordillère des Andes traverse-t-elle ?', ['3', '5', '7', '10'], 2, 'Venezuela, Colombie, Équateur, Pérou, Bolivie, Chili, Argentine.'],
            ['Quel est le plus haut sommet des Amériques ?', ['L’Aconcagua', 'Le Chimborazo', 'Le Huascarán', 'Le Popocatépetl'], 0, 'Situé en Argentine, il culmine à 6 961 m.'],
            ['Entre quels pays se trouve le lac Titicaca ?', ['Le Chili et l’Argentine', 'L’Équateur et la Colombie', 'Le Venezuela et la Colombie', 'Le Pérou et la Bolivie'], 3, 'C’est l’un des plus hauts lacs navigables du monde, à plus de 3 800 m.'],
            ['Quelle était la capitale de l’Empire inca ?', ['Lima', 'Cuzco', 'Quito', 'La Paz'], 1, 'Lima a été fondée par les Espagnols en 1535.'],
            ['Qui a révélé Machu Picchu au monde en 1911 ?', ['Simón Bolívar', 'Francisco Pizarro', 'Hiram Bingham', 'Pablo Neruda'], 2, 'L’explorateur américain a fait connaître le site, que les paysans des environs connaissaient.'],
            ['Quels pays forment le « triangle du lithium » ?', ['Bolivie, Chili, Argentine', 'Pérou, Équateur, Colombie', 'Mexique, Cuba, Venezuela', 'Espagne, Portugal, Maroc'], 0, 'Leurs salars concentrent une grande part des réserves mondiales.'],
            ['De quel métal le Chili est-il le premier producteur mondial ?', ['L’or', 'L’argent', 'Le fer', 'Le cuivre'], 3, 'Le cuivre est la première exportation chilienne.'],
            ['Que signifie *el buen vivir* (*sumak kawsay*) ?', ['La gastronomie andine', 'Vivre en harmonie avec la communauté et la nature', 'Un parti politique', 'La richesse individuelle'], 1, 'Le principe est inscrit dans les Constitutions de l’Équateur (2008) et de la Bolivie (2009).'],
            ['Le quechua et l’aymara sont encore parlés par des millions de personnes.', ['Vrai', 'Faux'], 0, 'Surtout au Pérou, en Bolivie et en Équateur.'],
            ['Que signifie *el altiplano* ?', ['La plaine côtière', 'Le haut plateau', 'La forêt tropicale', 'Le sommet enneigé'], 1, 'Le haut plateau andin, entre le Pérou, la Bolivie, le Chili et l’Argentine.'],
            ['Qui a composé *El cóndor pasa* en 1913 ?', ['Víctor Jara', 'Violeta Parra', 'Daniel Alomía Robles', 'Simon et Garfunkel'], 2, 'Le compositeur péruvien s’est inspiré de mélodies andines ; Simon et Garfunkel l’ont repris en 1970.'],
            ['Quel glacier bolivien a disparu vers 2009 ?', ['Le Perito Moreno', 'Le glacier de Chacaltaya', 'Le glacier de l’Aconcagua', 'Le glacier du Teide'], 1, 'Sa disparition symbolise la fonte des glaciers andins, dont dépend l’eau des villes.'],
          ],
        },
      ],
    },

    // ======================================================================
    // LA GRAMMAIRE DE PREMIÈRE (B1 → B2)
    // ======================================================================
    {
      niveaux: ['1re'],
      positionDepart: 46,
      rayon: 'langue',
      chapitres: [
        {
          titre: 'L’imparfait du subjonctif',
          axe: 'Les temps',
          lecon: {
            titre: 'Former et employer le subjonctif du passé',
            cours: `En français, l’imparfait du subjonctif a presque disparu ; en espagnol, il est partout, à l’oral comme à l’écrit. Bonne nouvelle : il se forme sur une seule base, qui ne connaît aucune exception.

## La formation, en trois étapes
1. Prends la **3e personne du pluriel du passé simple** : *hablaron, comieron, tuvieron, fueron*.
2. Retire **-ron** : *habla-, comie-, tuvie-, fue-*.
3. Ajoute les terminaisons en **-ra** ou en **-se**.

| Personne | -ra | -se |
| yo | hablara | hablase |
| tú | hablaras | hablases |
| él, ella, usted | hablara | hablase |
| nosotros | habláramos | hablásemos |
| vosotros | hablarais | hablaseis |
| ellos, ustedes | hablaran | hablasen |

> Tous les verbes, même les plus irréguliers, suivent cette règle : si tu connais le passé simple, tu connais l’imparfait du subjonctif.

La forme **nosotros** porte toujours un accent écrit : *habláramos, comiéramos, tuviéramos*.

## Les irréguliers se déduisent
| Infinitif | Passé simple (ellos) | Imparfait du subjonctif |
| tener | tuvieron | tuviera |
| ser / ir | fueron | fuera |
| hacer | hicieron | hiciera |
| decir | dijeron | dijera |
| poder | pudieron | pudiera |
| pedir | pidieron | pidiera |
| dormir | durmieron | durmiera |
| leer | leyeron | leyera |

## Les emplois
1. **La concordance** : après un verbe au passé ou au conditionnel qui exige le subjonctif. *Quiero que vengas* → *Quería que vinieras.*
2. **L’hypothèse irréelle** : *Si tuviera dinero, viajaría.*

!> Jamais de conditionnel après *si* : *Si tendría dinero* est une faute.

3. **Como si** : toujours suivi de l’imparfait du subjonctif. *Habla como si fuera el jefe.*
4. **Le souhait irréel** : *Ojalá estuvieras aquí* (tu n’es pas là).
5. **La politesse** : *Quisiera un café* (je voudrais).

## -ra ou -se ?
Les deux formes sont équivalentes dans presque tous les emplois ; la forme en **-ra** est la plus courante, surtout en Amérique. Seule la forme en -ra s’emploie pour la politesse : *quisiera*, *debiera*.

## Exemple travaillé
Mets au passé : *Mi madre me pide que ponga la mesa.*
1. Le verbe principal passe au passé simple ou à l’imparfait : *me pidió*.
2. Passé simple de *poner* à la 3e pers. du pluriel : *pusieron* → base *pusie-*.
3. → *Mi madre me pidió que **pusiera** la mesa.*`,
          },
          questions: [
            ['Sur quelle base se forme l’imparfait du subjonctif ?', ['L’infinitif', 'La 3e personne du pluriel du passé simple', 'La 1re personne du présent', 'Le radical du futur'], 1, 'On retire *-ron* et on ajoute *-ra* ou *-se*.'],
            ['Quel est l’imparfait du subjonctif de *tener* (yo) ?', ['teniera', 'tenga', 'tuviera', 'tendría'], 2, '*Tuvieron* → *tuvie-* → *tuviera*.'],
            ['Quelle forme est correcte pour *nosotros* ?', ['habláramos', 'hablaramos', 'hablaremos', 'hablábamos'], 0, 'La forme *nosotros* porte toujours un accent écrit.'],
            ['*Ser* et *ir* ont le même imparfait du subjonctif. Lequel ?', ['siera', 'iera', 'era', 'fuera'], 3, 'Leur passé simple est commun : *fueron* → *fuera*.'],
            ['Complète : *Quería que tú ___ conmigo.*', ['vienes', 'vinieras', 'vengas', 'vendrías'], 1, 'Verbe principal au passé → imparfait du subjonctif.', 'Quel temps après un verbe principal au passé ?'],
            ['Après *como si*, quel temps emploie-t-on ?', ['Le présent du subjonctif', 'L’indicatif', 'L’imparfait du subjonctif', 'Le conditionnel'], 2, '*Habla como si fuera el jefe.*'],
            ['Quelle est la bonne phrase ?', ['Si tuviera dinero, viajaría', 'Si tendría dinero, viajaría', 'Si tenga dinero, viajaría', 'Si tuviese dinero, viajaré'], 0, 'Jamais de conditionnel après *si* : imparfait du subjonctif + conditionnel.'],
            ['Quel est l’imparfait du subjonctif de *decir* (él) ?', ['diciera', 'diga', 'decía', 'dijera'], 3, '*Dijeron* → *dijera*.'],
            ['*Quisiera un café* est une formule de politesse.', ['Vrai', 'Faux'], 0, 'Seule la forme en *-ra* s’emploie ainsi.'],
            ['Quel est l’imparfait du subjonctif de *dormir* (ellos) ?', ['dormieran', 'durmieran', 'duerman', 'dormirían'], 1, 'Passé simple *durmieron* → *durmieran*.'],
            ['*Ojalá estuvieras aquí* exprime…', ['Un ordre', 'Un souhait réalisable demain', 'Un souhait irréel dans le présent', 'Un fait passé réel'], 2, 'Tu n’es pas là : l’imparfait du subjonctif marque l’irréel.'],
            ['Les formes en -ra et en -se sont équivalentes dans presque tous les emplois.', ['Vrai', 'Faux'], 0, '*Hablara* ou *hablase* : même sens ; *-ra* est plus courant.'],
          ],
        },
        {
          titre: 'Les temps composés : plus-que-parfait, futur et conditionnel passé',
          axe: 'Les temps',
          lecon: {
            titre: 'Haber + participe à tous les temps',
            cours: `Les temps composés espagnols se construisent tous de la même façon : **haber conjugué + participe passé invariable**. Il suffit de connaître *haber* à chaque temps pour les maîtriser tous.

## Le tableau des temps composés
| Temps | Haber | Exemple | Sens |
| Passé composé | he, has, ha… | *he hablado* | j’ai parlé |
| Plus-que-parfait | había, habías, había… | *había hablado* | j’avais parlé |
| Futur antérieur | habré, habrás, habrá… | *habré hablado* | j’aurai parlé |
| Conditionnel passé | habría, habrías, habría… | *habría hablado* | j’aurais parlé |
| Subjonctif passé | haya, hayas, haya… | *haya hablado* | que j’aie parlé |
| Plus-que-parfait du subjonctif | hubiera, hubieras… | *hubiera hablado* | que j’eusse parlé |

## Trois règles d’or
1. L’auxiliaire est **toujours haber**, jamais *ser* : *He ido, me he levantado* (« je suis allé, je me suis levé »).
2. Le participe est **invariable** : *Las cartas que he escrito.*
3. On ne sépare **jamais** *haber* du participe : les pronoms se placent devant *haber* (*Se lo había dicho*), les adverbes avant ou après le bloc (*Nunca lo había visto*).

## Les participes irréguliers
*abrir → abierto, cubrir → cubierto, decir → dicho, escribir → escrito, hacer → hecho, morir → muerto, poner → puesto, romper → roto, ver → visto, volver → vuelto, resolver → resuelto, descubrir → descubierto.*

## Les emplois
| Temps | Emploi | Exemple |
| Plus-que-parfait | Antériorité dans le passé | *Cuando llegué, el tren ya había salido.* |
| Futur antérieur | Action achevée avant un moment futur | *En junio habré terminado el curso.* |
| Futur antérieur | Probabilité dans le passé proche | *No contesta: habrá salido.* (il a dû sortir) |
| Conditionnel passé | Irréel du passé | *Habría venido, pero estaba enfermo.* |
| Conditionnel passé | Probabilité dans le passé lointain | *Serían las diez: habría llegado ya.* |

## Le passé antérieur
*Hube hablado* existe, mais il est littéraire : après *cuando, en cuanto*, la langue courante emploie le passé simple (*En cuanto terminó, salió*).

> Le passé composé, le plus-que-parfait et le futur antérieur se construisent comme en français ; la vraie différence, c’est l’auxiliaire unique : *haber*.

## Exemple travaillé
Traduis « Quand je suis arrivé, ils étaient déjà partis ; ils m’auraient attendu si j’avais appelé. »
1. Action antérieure au passé : *ya se habían ido*.
2. Irréel du passé : *me habrían esperado*.
3. Condition irréelle du passé : *si hubiera llamado*.
→ *Cuando llegué, ya se habían ido; me habrían esperado si hubiera llamado.*`,
          },
          questions: [
            ['Quel auxiliaire emploie-t-on pour « je suis allé » ?', ['soy ido', 'estoy ido', 'he ido', 'fui ido'], 2, 'L’espagnol n’emploie que *haber* aux temps composés.'],
            ['Comment dit-on « j’avais parlé » ?', ['había hablado', 'he hablado', 'habré hablado', 'hube hablo'], 0, 'Plus-que-parfait : *haber* à l’imparfait + participe.'],
            ['Quel est le participe passé de *romper* ?', ['rompido', 'rompto', 'rompado', 'roto'], 3, 'Participe irrégulier : *roto*.'],
            ['Quelle phrase est correcte ?', ['Había se lo dicho', 'Se lo había dicho', 'Había dicho se lo', 'Había díchoselo'], 1, 'Les pronoms se placent devant *haber*, jamais entre l’auxiliaire et le participe.'],
            ['*Las cartas que he ___.* Quel mot complète la phrase ?', ['escritas', 'escribidas', 'escrito', 'escrita'], 2, 'Le participe est invariable avec *haber*.', 'Quelle forme de participe après haber ?'],
            ['Que signifie *No contesta: habrá salido* ?', ['Il a dû sortir', 'Il sortira', 'Il serait sorti', 'Il était sorti'], 0, 'Le futur antérieur exprime ici la probabilité dans le passé proche.'],
            ['Quel temps exprime l’irréel du passé dans *___ venido, pero estaba enfermo* ?', ['Había', 'Habré', 'Haya', 'Habría'], 3, 'Conditionnel passé : j’aurais pu venir, mais je ne suis pas venu.', 'Quel auxiliaire pour l’irréel du passé ?'],
            ['Quel est le participe passé de *volver* ?', ['volvido', 'vuelto', 'vuelvido', 'volto'], 1, 'Comme *resolver → resuelto*.'],
            ['Le passé antérieur (*hube hablado*) est surtout littéraire.', ['Vrai', 'Faux'], 0, 'Dans la langue courante, on le remplace par le passé simple.'],
            ['Comment dit-on « En juin, j’aurai fini le cours » ?', ['En junio habría terminado el curso', 'En junio había terminado el curso', 'En junio habré terminado el curso', 'En junio he terminado el curso'], 2, 'Futur antérieur : action achevée avant un moment futur.'],
            ['Quel est le participe passé de *poner* ?', ['puesto', 'ponido', 'ponto', 'pusto'], 0, 'Comme ses composés : *propuesto, compuesto*.'],
            ['Avec *haber*, le participe s’accorde avec le complément placé avant.', ['Vrai', 'Faux'], 1, 'Contrairement au français, il reste toujours invariable.'],
          ],
        },
        {
          titre: 'Traduire « devenir »',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Ponerse, volverse, hacerse, convertirse, llegar a ser, quedarse',
            cours: `L’espagnol n’a pas de verbe unique pour « devenir » : il en choisit un selon la **nature du changement**. Passager ou durable ? Voulu ou subi ? C’est cette question qui guide le choix.

## Le tableau des six verbes
| Verbe | Type de changement | Exemple |
| **ponerse** + adjectif | passager, soudain : humeur, couleur, santé | *Se puso rojo. Me pongo nervioso.* |
| **volverse** + adjectif | profond, durable, souvent subi | *Se volvió loco. Se ha vuelto desconfiado.* |
| **hacerse** + adjectif ou nom | progressif, souvent voulu ou par effort | *Se hizo rico. Se hizo médico. Nos hacemos mayores.* |
| **convertirse en** + nom | transformation complète | *La rana se convirtió en príncipe.* |
| **llegar a ser** + nom ou adjectif | aboutissement d’un long parcours | *Llegó a ser presidente.* |
| **quedarse** + adjectif | état résultant d’un événement, souvent une perte | *Se quedó ciego. Se quedó sin trabajo.* |

> Demande-toi : « Est-ce que ça passe ? » → *ponerse*. « Est-ce que ça le change en profondeur ? » → *volverse*. « L’a-t-il voulu ? » → *hacerse*. « Qu’est-ce qui lui est resté ? » → *quedarse*.

## Les distinctions fines
- *Se puso triste* (il est devenu triste sur le moment) / *Se volvió triste* (il est devenu quelqu’un de triste).
- *Se hizo famoso* (par son travail) / *Llegó a ser famoso* (au terme d’un long chemin, avec une idée de mérite).
- *Se quedó viudo, se quedó embarazada, se quedó sorprendido* : état qui résulte d’un événement.

## Les autres tournures
- **pasar a ser** : changer de statut. *Pasó a ser jefe de sección.*
- **acabar** + gérondif ou **terminar** + gérondif : finir par. *Acabó siendo mi mejor amigo.*
- **¿Qué ha sido de…?** : « qu’est devenu… ? » *¿Qué ha sido de tu hermano?*
- Beaucoup de verbes intègrent le changement : *envejecer* (vieillir), *enriquecerse* (s’enrichir), *enfadarse* (se fâcher), *adelgazar* (maigrir), *enloquecer* (devenir fou).

## Exemple travaillé
Traduis : « En apprenant la nouvelle, elle est devenue pâle ; avec les années, elle est devenue avocate, puis elle est devenue ministre. »
1. Changement soudain de couleur : *se puso pálida*.
2. Métier obtenu par l’effort : *se hizo abogada*.
3. Sommet d’un parcours : *llegó a ser ministra*.
→ *Al enterarse de la noticia, se puso pálida; con los años se hizo abogada y luego llegó a ser ministra.*`,
          },
          questions: [
            ['Comment traduire « il est devenu rouge (de honte) » ?', ['Se volvió rojo', 'Se puso rojo', 'Se hizo rojo', 'Llegó a ser rojo'], 1, 'Changement passager et soudain : *ponerse*.'],
            ['Comment traduire « il est devenu fou » ?', ['Se puso loco', 'Se quedó loco', 'Se volvió loco', 'Se convirtió loco'], 2, 'Changement profond, subi : *volverse*.'],
            ['Comment traduire « elle est devenue médecin » (par ses études) ?', ['Se hizo médica', 'Se puso médica', 'Se volvió médica', 'Se quedó médica'], 0, 'Métier, changement voulu : *hacerse*.'],
            ['Quelle préposition suit *convertirse* ?', ['a', 'de', 'por', 'en'], 3, '*Convertirse en* + nom : *se convirtió en una estrella*.'],
            ['Comment traduire « il est devenu aveugle » (après un accident) ?', ['Se puso ciego', 'Se quedó ciego', 'Se hizo ciego', 'Llegó a ser ciego'], 1, 'État résultant d’un événement : *quedarse*.'],
            ['Quelle tournure marque l’aboutissement d’un long parcours ?', ['ponerse', 'quedarse', 'llegar a ser', 'volverse'], 2, '*Llegó a ser presidente* : il a fini par devenir président.'],
            ['Comment demande-t-on « Qu’est devenu ton frère ? » ?', ['¿Qué ha sido de tu hermano?', '¿Qué se ha puesto tu hermano?', '¿En qué se ha vuelto tu hermano?', '¿Qué ha llegado tu hermano?'], 0, 'Tournure figée : *¿Qué ha sido de…?*'],
            ['*Se quedó sin trabajo* signifie…', ['Il a trouvé du travail', 'Il est resté au travail', 'Il est devenu travailleur', 'Il s’est retrouvé sans travail'], 3, '*Quedarse sin* = se retrouver privé de.'],
            ['*Me pongo nervioso antes de los exámenes* décrit un changement passager.', ['Vrai', 'Faux'], 0, 'La nervosité passe : *ponerse*.'],
            ['Quel verbe signifie « vieillir » ?', ['enriquecer', 'envejecer', 'enfadarse', 'adelgazar'], 1, '*Viejo → envejecer*. *Enriquecerse* = s’enrichir.'],
            ['*Acabó siendo mi mejor amigo* signifie…', ['Il a cessé d’être mon meilleur ami', 'Il vient de devenir mon meilleur ami', 'Il a fini par devenir mon meilleur ami', 'Il était mon meilleur ami'], 2, '*Acabar* + gérondif = finir par.'],
            ['*Se hizo rico* et *Se puso rico* ont le même sens.', ['Vrai', 'Faux'], 1, '*Se hizo rico* = il s’est enrichi ; *ponerse* ne convient pas à un changement durable.'],
          ],
        },
        {
          titre: 'Traduire « on » et la voix passive',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Se, uno, ellos, nosotros : les visages du « on »',
            cours: `Le français dit « on » à tout propos ; l’espagnol n’a pas ce pronom. Il choisit une tournure selon que le locuteur est inclus ou non, et selon la construction du verbe.

## Les quatre traductions de « on »
| Tournure | Quand | Exemple |
| **se** + verbe à la 3e personne | sens général, impersonnel | *Aquí se vive bien.* (on vit bien ici) |
| **3e personne du pluriel** | les autres, sans moi | *Dicen que va a llover. Llaman a la puerta.* |
| **nosotros** | un groupe qui m’inclut | *En casa comemos a las dos.* |
| **uno / una** | avec un verbe déjà pronominal, ou pour parler de soi | *Uno se acostumbra a todo.* |

## Le « se » passif : l’accord
Quand le verbe a un complément de **chose**, il s’accorde avec lui :
| Singulier | Pluriel |
| *Se vende piso.* (appartement à vendre) | *Se venden pisos.* |
| *Se habla español.* | *Se hablan varias lenguas.* |

Quand le complément est une **personne précise** (introduite par *a*), le verbe reste au **singulier** : *Se detuvo a los ladrones* (on a arrêté les voleurs).

> Chose au pluriel → verbe au pluriel ; personne avec *a* → verbe au singulier.

## Pourquoi « uno » avec les pronominaux
*Se se acuesta* est impossible : on ne peut pas mettre deux *se*. On dit donc **uno se acuesta tarde** ou **nos acostamos tarde**.

## La voix passive avec ser
**Ser + participe accordé + por + agent** : *La ley fue aprobada por el Parlamento. Las pirámides fueron construidas por los mayas.*
Elle existe surtout à l’écrit (presse, histoire). À l’oral, l’espagnol préfère l’actif ou le *se* passif : *Se aprobó la ley.*

## Ser ou estar + participe
| Ser + participe | Estar + participe |
| l’action subie | le résultat, l’état |
| *La puerta fue abierta por el viento.* | *La puerta está abierta.* |

## Le « tú » générique
À l’oral, on emploie aussi *tú* pour « on » : *Cuando estudias mucho, aprendes.*

## Exemple travaillé
Traduis « On dit qu’en Espagne on dîne tard ; ici, on vend des maisons anciennes. »
1. « On dit » (les gens, sans moi) : *Dicen que*.
2. Sens général : *en España se cena tarde*.
3. Chose au pluriel : *aquí se venden casas antiguas*.`,
          },
          questions: [
            ['Comment traduire « Ici, on vit bien » (sens général) ?', ['Aquí vive bien', 'Aquí se vive bien', 'Aquí uno vive bienes', 'Aquí se viven bien'], 1, 'Sens impersonnel : *se* + 3e personne du singulier.'],
            ['Comment traduire « On vend des appartements » ?', ['Se vende pisos', 'Venden a pisos', 'Se venden pisos', 'Se vendemos pisos'], 2, 'Le verbe s’accorde avec la chose au pluriel.'],
            ['Comment traduire « On frappe à la porte » ?', ['Llaman a la puerta', 'Se llama a la puerta los', 'Uno llama a la puerta', 'Llamamos a la puerta'], 0, 'Des gens autres que moi : 3e personne du pluriel.'],
            ['Pourquoi dit-on *Uno se acostumbra a todo* et non *Se se acostumbra* ?', ['Parce que *acostumbrar* est irrégulier', 'Parce que *uno* est plus poli', 'Par simple habitude régionale', 'Parce qu’on ne peut pas mettre deux *se* de suite'], 3, 'Avec un verbe déjà pronominal, *uno* ou *nosotros* remplacent le *se* impersonnel.'],
            ['*Se detuvo a los ladrones* : pourquoi le verbe est-il au singulier ?', ['C’est une faute', 'Parce que le complément est une personne introduite par *a*', 'Parce que *ladrones* est singulier', 'Parce que le verbe est au passé'], 1, 'Avec *a* + personne, le verbe reste au singulier.'],
            ['Comment forme-t-on la voix passive avec *ser* ?', ['ser + infinitif + de', 'ser + gérondif + por', 'ser + participe accordé + por', 'estar + participe invariable + para'], 2, '*La ley fue aprobada por el Parlamento.*'],
            ['*La puerta está abierta* exprime…', ['Le résultat, l’état de la porte', 'L’action d’ouvrir', 'Un ordre', 'Un souhait'], 0, '*Estar* + participe = état résultant ; *ser* + participe = action subie.'],
            ['*En casa ___ a las dos* (on déjeune, ma famille et moi).', ['se comen', 'comen', 'uno comen', 'comemos'], 3, 'Groupe qui m’inclut : *nosotros*.', 'Quelle forme pour un « on » qui inclut le locuteur ?'],
            ['À l’oral, l’espagnol préfère souvent le *se* passif à la voix passive avec *ser*.', ['Vrai', 'Faux'], 0, '*Se aprobó la ley* est plus naturel que *La ley fue aprobada*.'],
            ['Comment traduire « On dit qu’il va pleuvoir » ?', ['Se dicen que va a llover', 'Dicen que va a llover', 'Uno dicen que va a llover', 'Es dicho que va a llover'], 1, '*Dicen que* = on dit que (les gens).'],
            ['*Las pirámides ___ construidas por los mayas.* Quel mot complète la phrase ?', ['estaban', 'han', 'fueron', 'se'], 2, 'Action subie, avec agent : *ser* + participe.', 'Quel auxiliaire pour la voix passive avec agent ?'],
            ['*Se habla español* peut se traduire par « on parle espagnol ».', ['Vrai', 'Faux'], 0, 'C’est le *se* impersonnel ou passif, très fréquent sur les panneaux.'],
          ],
        },
        {
          titre: 'Les subordonnées de temps',
          axe: 'La phrase',
          lecon: {
            titre: 'Cuando, en cuanto, mientras : indicatif ou subjonctif ?',
            cours: `« Quand tu arriveras, appelle-moi » : le français met un futur, l’espagnol un **subjonctif**. C’est l’une des différences les plus sanctionnées dans les copies.

## La règle fondamentale
| Action | Mode | Exemple |
| Habituelle ou passée (réelle) | indicatif | *Cuando llego, cenamos. Cuando llegué, cenamos.* |
| À venir (pas encore réalisée) | **subjonctif** | *Cuando llegues, cenaremos.* |

> Jamais de futur ni de conditionnel après *cuando* : le futur du français devient un subjonctif présent en espagnol.

!> Erreur classique : *Cuando llegarás, llámame*. Il faut *Cuando llegues, llámame*.

## Les conjonctions de temps
| Conjonction | Sens | Exemple au futur |
| cuando | quand | *Cuando seas mayor, lo entenderás.* |
| en cuanto, tan pronto como | dès que | *En cuanto termine, te llamo.* |
| hasta que | jusqu’à ce que | *Espera hasta que vuelva.* |
| mientras | pendant que / tant que | *Mientras estudies, te ayudaré.* |
| después de que | après que | *Después de que se vayan, limpiamos.* |
| cada vez que | chaque fois que | *Cada vez que vengas, te invitaré.* |
| antes de que | avant que | **toujours** subjonctif : *Vete antes de que llueva.* |

## Mientras : deux sens
- *Mientras* + indicatif = **pendant que** : *Mientras cocino, escucho música.*
- *Mientras* + subjonctif = **tant que** (condition) : *Mientras no me pidas perdón, no te hablo.*

## Au passé : la concordance
Si l’action future est vue depuis le passé, le subjonctif passe à l’imparfait : *Me dijo que me llamaría cuando llegara.*

## Les tournures avec l’infinitif
| Tournure | Sens | Exemple |
| al + infinitif | au moment où, en | *Al salir, vi a Luis.* (en sortant) |
| nada más + infinitif | dès que, à peine | *Nada más llegar, se durmió.* |
| antes de + infinitif | avant de | *Lávate las manos antes de comer.* |
| después de + infinitif | après avoir | *Después de comer, descansamos.* |

L’infinitif s’emploie quand le sujet est le même dans les deux propositions.

## Exemple travaillé
Traduis « Dès que j’aurai mon bac, je partirai au Pérou, et je resterai là-bas jusqu’à ce que je n’aie plus d’argent. »
1. « Dès que » + action future : *en cuanto* + subjonctif → *en cuanto apruebe el bachillerato*.
2. Principale au futur : *me iré a Perú*.
3. « Jusqu’à ce que » + futur : *hasta que no me quede dinero*.`,
          },
          questions: [
            ['Complète : *Cuando ___ mayor, lo entenderás.*', ['serás', 'eres', 'seas', 'serías'], 2, 'Action à venir après *cuando* : subjonctif présent.', 'Quel mode après cuando pour une action future ?'],
            ['*Cuando llego a casa, ceno* : pourquoi l’indicatif ?', ['C’est une action habituelle', 'C’est une faute', 'Parce que *llegar* est irrégulier', 'C’est une action future'], 0, 'Action réelle et habituelle : indicatif.'],
            ['Quelle conjonction est TOUJOURS suivie du subjonctif ?', ['cuando', 'mientras', 'en cuanto', 'antes de que'], 3, 'Ce qui est « avant » n’a pas encore eu lieu.'],
            ['Que signifie *Mientras no me pidas perdón, no te hablo* ?', ['Pendant que tu t’excuses, je ne te parle pas', 'Tant que tu ne me demandes pas pardon, je ne te parle pas', 'Quand tu m’as demandé pardon, je ne t’ai pas parlé', 'Avant que tu t’excuses, je te parle'], 1, '*Mientras* + subjonctif = tant que.'],
            ['Comment traduire « En sortant, j’ai vu Luis » ?', ['Saliendo de, vi a Luis', 'Cuando saldré, vi a Luis', 'Al salir, vi a Luis', 'En salir, vi a Luis'], 2, '*Al* + infinitif = au moment où, en.'],
            ['Que signifie *nada más llegar* ?', ['Dès son arrivée', 'Sans arriver', 'Rien n’arrive', 'Après être arrivé longtemps'], 0, '*Nada más* + infinitif = à peine, dès que.'],
            ['*Me dijo que me llamaría cuando ___.* Quel mot complète la phrase ?', ['llegue', 'llegará', 'llegaría', 'llegara'], 3, 'Concordance : futur vu depuis le passé → imparfait du subjonctif.', 'Quel temps après cuando dans un récit au passé ?'],
            ['Comment dit-on « dès que » ?', ['hasta que', 'en cuanto', 'mientras', 'antes de'], 1, 'On dit aussi *tan pronto como*.'],
            ['On peut dire *Cuando llegarás, llámame*.', ['Vrai', 'Faux'], 1, 'Jamais de futur après *cuando* : *Cuando llegues, llámame*.'],
            ['*Lávate las manos antes de comer* : pourquoi l’infinitif ?', ['Parce que le sujet est le même', 'Parce que c’est un ordre', 'Parce que l’action est passée', 'Parce que *antes de* refuse toujours le subjonctif'], 0, 'Même sujet → *antes de* + infinitif ; sujets différents → *antes de que* + subjonctif.'],
            ['*Mientras cocino, escucho música* : quel est le sens de *mientras* ?', ['Tant que', 'Avant que', 'Pendant que', 'Dès que'], 2, 'Avec l’indicatif, *mientras* marque la simultanéité.'],
            ['Complète : *Espera aquí hasta que yo ___.*', ['vuelva', 'vuelvo', 'volveré', 'volvería'], 0, 'Action à venir après *hasta que* : subjonctif.', 'Quel mode après hasta que pour une action à venir ?'],
          ],
        },
        {
          titre: 'Exprimer la cause et la conséquence',
          axe: 'La phrase',
          lecon: {
            titre: 'Porque, como, ya que… así que, por eso, tan… que',
            cours: `Expliquer pourquoi, puis dire ce qui en découle : c’est le cœur de toute argumentation. L’espagnol a des connecteurs précis, et une place à respecter pour chacun.

## La cause
| Connecteur | Place, nuance | Exemple |
| porque | après la principale | *No salí porque llovía.* |
| como | **en tête** de phrase | *Como llovía, no salí.* |
| ya que, puesto que, dado que | cause connue, argumentation | *Ya que estás aquí, ayúdame.* |
| a causa de, debido a + nom | registre soutenu | *Debido a la lluvia, se suspendió el partido.* |
| gracias a + nom | cause heureuse | *Aprobé gracias a tu ayuda.* |
| por + infinitif ou nom | cause d’un reproche, d’une sanction | *Lo castigaron por mentir.* |

> *Porque* ne se place jamais en tête pour exprimer une cause : on commence par *como*.

!> Erreur classique : *Porque llovía, no salí*. Il faut *Como llovía, no salí*.

## Nier une cause
*No porque* + **subjonctif**, souvent suivi de *sino porque* + indicatif : *No lo digo porque seas mi amigo, sino porque es verdad.*

## La conséquence
| Connecteur | Nuance | Exemple |
| así que | donc (courant) | *Estaba cansado, así que me acosté.* |
| por eso | c’est pourquoi | *Llovía; por eso no salí.* |
| por lo tanto, por consiguiente | par conséquent (écrit, argumentation) | *Los precios suben; por lo tanto, se consume menos.* |
| de modo que, de manera que + indicatif | de sorte que (conséquence) | *Habló alto, de modo que todos lo oyeron.* |
| conque | alors (familier) | *Ya es tarde, conque vámonos.* |

Attention : *de modo que* + **subjonctif** exprime le **but** : *Habla alto de modo que todos te oigan.*

## La conséquence liée à l’intensité
| Structure | Exemple |
| tan + adjectif / adverbe + que | *Estaba tan cansado que se durmió.* |
| tanto, tanta, tantos, tantas + nom + que | *Había tanta gente que no pudimos entrar.* |
| verbe + tanto que | *Comió tanto que se puso malo.* |

## Exemple travaillé
Relie ces idées : « Les loyers augmentent (cause) ; beaucoup de jeunes vivent chez leurs parents (conséquence). »
1. Cause en tête : *Como los alquileres suben, muchos jóvenes viven con sus padres.*
2. Cause après : *Muchos jóvenes viven con sus padres porque los alquileres suben.*
3. Conséquence : *Los alquileres suben tanto que muchos jóvenes viven con sus padres.*`,
          },
          questions: [
            ['Quel connecteur de cause se place en tête de phrase ?', ['porque', 'como', 'así que', 'por eso'], 1, '*Como llovía, no salí.* *Porque* ne se place pas en tête.'],
            ['*Porque llovía, no salí* est une phrase correcte.', ['Vrai', 'Faux'], 1, 'En tête, il faut *como* : *Como llovía, no salí*.'],
            ['Complète : *No lo digo porque ___ mi amigo, sino porque es verdad.*', ['eres', 'serás', 'seas', 'eras'], 2, '*No porque* nie la cause : subjonctif.', 'Quel mode après no porque ?'],
            ['Quel connecteur exprime une cause heureuse ?', ['gracias a', 'debido a', 'a causa de', 'por culpa de'], 0, '*Aprobé gracias a tu ayuda.*'],
            ['Que signifie *así que* ?', ['Ainsi que', 'Comme si', 'Aussi… que', 'Donc'], 3, '*Estaba cansado, así que me acosté.*'],
            ['*Habla alto de modo que todos te oigan* exprime…', ['Une conséquence réalisée', 'Un but', 'Une cause', 'Une concession'], 1, '*De modo que* + subjonctif = but ; + indicatif = conséquence.'],
            ['Complète : *Había ___ gente que no pudimos entrar.*', ['tan', 'tanto', 'tanta', 'tantas'], 2, '*Tanto* s’accorde avec le nom : *tanta gente*.', 'Quelle forme de tanto devant gente ?'],
            ['Complète : *Estaba ___ cansado que se durmió.*', ['tan', 'tanto', 'tal', 'muy'], 0, 'Devant un adjectif : *tan… que*.', 'Quel mot devant un adjectif pour l’intensité ?'],
            ['Quel connecteur appartient au registre familier ?', ['por consiguiente', 'puesto que', 'debido a', 'conque'], 3, '*Ya es tarde, conque vámonos.*'],
            ['*Lo castigaron por mentir* : quelle valeur a *por* ?', ['Le but', 'La cause', 'Le moyen', 'Le lieu'], 1, '*Por* + infinitif donne la cause d’une sanction.'],
            ['Quel connecteur convient à une argumentation écrite pour « par conséquent » ?', ['conque', 'así que', 'por lo tanto', 'porque'], 2, 'On dit aussi *por consiguiente*.'],
            ['*Ya que estás aquí, ayúdame* : *ya que* exprime une cause connue de tous.', ['Vrai', 'Faux'], 0, 'Comme « puisque » : la cause est évidente pour les deux interlocuteurs.'],
          ],
        },
      ],
    },
  ],
}
