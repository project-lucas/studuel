// Espagnol TERMINALE — les six axes culturels du programme 2025 et une
// grammaire propre au niveau (B2).
//
// SOURCE : arrêté du 5 mai 2025, BO n° 22 du 29 mai 2025, annexe 10 (programme
// d'espagnol du lycée), en vigueur en Tle à la rentrée 2026. Intitulés des axes
// et objets d'étude relevés sur La Clé des langues (ENS de Lyon), qui reproduit
// l'annexe. Voie générale : cinq axes sur six, dont OBLIGATOIREMENT l'axe 6,
// « La richesse des métissages dans le monde hispanique ».
//
// POURQUOI CE MODULE : la Tle avait les mêmes 37 fiches que la 2de et la 1re
// (cf. espagnol-tle.mjs, migration 231), et aucune fiche sur les axes du
// nouveau programme — la fiche « Le monde hispanique aujourd'hui » reprenait
// l'ancien découpage. On AJOUTE, on ne retire rien : deux blocs à la suite des
// fiches existantes (positions 40 → 51), rayon « culture » pour les axes, rayon
// « langue » pour la grammaire.
//
// Convention de la maison : la langue s'interroge EN FRANÇAIS ; l'espagnol est
// cité en exemple, jamais en énoncé.

export default {
  slug: 'espagnol',
  nom: 'Espagnol',

  titreMigration: 'ESPAGNOL Tle — AXES CULTURELS 2025 ET GRAMMAIRE DU NIVEAU',

  motif: `CONSTAT : la Tle portait les mêmes 37 fiches que la 2de et la 1re
(grammaire en 4 chapitres et 3 fiches sans chapitre), et aucune fiche sur les
axes culturels du programme de langues vivantes publié au BO n° 22 du
29 mai 2025 (arrêté du 5 mai 2025), en vigueur en Tle à la rentrée 2026.
Cette migration AJOUTE, sans rien retirer : une fiche par axe de Tle (six,
dont l'axe 6 propre à l'espagnol, « La richesse des métissages dans le monde
hispanique »), rangées dans le rayon « culture », et six fiches de grammaire
de niveau B2 sur des points absents des fiches existantes (concordance des
temps, hypothèse avec si, concession, but et condition, discours rapporté,
mise en relief), rangées dans le rayon « langue ».`,

  blocs: [
    // ======================================================================
    // LES SIX AXES CULTURELS DE TERMINALE
    // ======================================================================
    {
      niveaux: ['Tle'],
      positionDepart: 40,
      rayon: 'culture',
      chapitres: [
        // ---- Axe 1 ---------------------------------------------------------
        {
          titre: 'Femmes, places publiques et vies en ligne',
          axe: 'Espace privé et espace public',
          lecon: {
            titre: 'Où finit l’intime, où commence le public ?',
            cours: `Longtemps, les femmes ont été cantonnées à la maison et la place publique réservée aux hommes ; aujourd’hui, les réseaux sociaux exposent l’intime à tous. L’axe 1 t’invite à suivre cette frontière mouvante dans le monde hispanique.

## Ce que recouvre l’axe
1. **La place des femmes** : revendications d’hier et d’aujourd’hui.
2. **La ville et les villages** comme espaces sociaux.
3. **La frontière entre l’espace public et l’espace privé** : les défis à l’heure des réseaux sociaux.

## Repères : la place des femmes
@ 1931 — Les Espagnoles obtiennent le droit de vote sous la IIe République, grâce notamment à la députée Clara Campoamor.
@ 1939 — Sous Franco, la femme mariée a besoin de l’autorisation de son mari (*permiso marital*) pour travailler ou ouvrir un compte, jusqu’en 1975.
@ 2004 — Loi espagnole contre les violences de genre, pionnière en Europe.
@ 2015 — En Argentine, le mouvement *Ni una menos* dénonce les féminicides et gagne toute l’Amérique latine.
@ 2018 — Le 8 mars, une grève féministe historique mobilise des millions de personnes en Espagne.
@ 2020 — L’Argentine légalise l’avortement.

## Repères : la ville et les villages
| Repère | Ce qu’il faut savoir |
| La *plaza mayor* | Cœur de la ville hispanique, des deux côtés de l’Atlantique : marché, fêtes, rassemblements. |
| La *España vaciada* | Des régions entières de l’intérieur (Teruel, Soria, Cuenca) se vident ; en 2019, la liste *Teruel Existe* entre au Parlement. |
| Les quartiers informels | *Villas miseria* de Buenos Aires, *comunas* de Medellín : la ville se construit aussi sans plan. |

## Repères : l’intime exposé
| Repère | Ce qu’il faut savoir |
| *Roma*, Alfonso Cuarón (2018) | La vie d’une employée de maison indigène dans une famille aisée de Mexico en 1970-1971 : l’intime d’une maison, la violence de la rue. Oscar du meilleur réalisateur. |
| Les réseaux sociaux | Harcèlement en ligne, contrôle du partenaire par le téléphone, diffusion d’images sans consentement : l’Espagne débat depuis 2024 d’une loi pour protéger les mineurs dans les environnements numériques. |

## Le vocabulaire
| Espagnol | Français |
| la igualdad, la desigualdad | l’égalité, l’inégalité |
| la violencia de género | les violences faites aux femmes |
| el feminicidio | le féminicide |
| reivindicar, la reivindicación | revendiquer, la revendication |
| el ámbito privado / público | la sphère privée / publique |
| la intimidad | la vie privée, l’intimité |
| la despoblación | le dépeuplement |
| el acoso, el ciberacoso | le harcèlement, le cyberharcèlement |
| las redes sociales | les réseaux sociaux |

## Problématiques et documents
- *¿Qué conquistas han logrado las mujeres y cuáles quedan por lograr?* Documents : une photo du 8 mars 2018, le slogan *Ni una menos*.
- *¿El pueblo sigue siendo un espacio de convivencia?* Documents : un reportage sur la *España vaciada*.
- *¿Lo que publicamos nos sigue perteneciendo?* Documents : une campagne contre le cyberharcèlement, une scène de *Roma*.

## Argumenter à l’oral (B2)
| Pour… | Dis… |
| Introduire une thèse | *Se podría afirmar que…* |
| Concéder et réfuter | *Si bien es cierto que…, no es menos cierto que…* |
| Insister | *Lo que está en juego es…* |
| Exiger | *Es imprescindible que…* (+ subjonctif) |

> La frontière entre public et privé n’est pas fixe : chaque génération la redessine, et les femmes ont été les premières à la contester.

## Exemple travaillé
*Si bien es cierto que las españolas votan desde 1931, no es menos cierto que el franquismo les quitó muchos derechos. Hoy, lo que está en juego es la violencia de género, que sale del ámbito privado para convertirse en un asunto público. Es imprescindible que la sociedad entera se implique.*`,
          },
          questions: [
            ['En quelle année les Espagnoles ont-elles obtenu le droit de vote ?', ['1931', '1945', '1977', '1905'], 0, 'Sous la IIe République, grâce notamment à Clara Campoamor.'],
            ['Qu’était le *permiso marital* sous Franco ?', ['Un congé de mariage', 'L’autorisation du mari nécessaire à la femme pour travailler ou ouvrir un compte', 'Un certificat de mariage religieux', 'Un impôt sur le mariage'], 1, 'Il a été supprimé en 1975.'],
            ['Dans quel pays est né le mouvement *Ni una menos* en 2015 ?', ['En Espagne', 'Au Mexique', 'En Argentine', 'Au Chili'], 2, 'Il dénonce les féminicides et s’est étendu à toute l’Amérique latine.'],
            ['Que désigne la *España vaciada* ?', ['Les plages désertes en hiver', 'Les régions intérieures qui se dépeuplent', 'Les villes après la crise de 2008', 'Les usines fermées'], 1, 'Teruel, Soria ou Cuenca perdent leurs habitants.'],
            ['Que raconte *Roma* d’Alfonso Cuarón ?', ['La Rome antique', 'Un voyage en Italie', 'La vie d’un footballeur', 'La vie d’une employée de maison indigène à Mexico vers 1970'], 3, 'Le film mêle l’intime d’une maison et la violence de la rue.'],
            ['Que signifie *la intimidad* ?', ['L’intimidation', 'La vie privée, l’intimité', 'L’amitié', 'La timidité'], 1, '*Derecho a la intimidad* = droit à la vie privée.'],
            ['En quelle année l’Espagne a-t-elle adopté sa loi contre les violences de genre ?', ['1981', '2004', '2015', '1931'], 1, 'Cette loi a été pionnière en Europe.'],
            ['Que signifie *el ciberacoso* ?', ['Le piratage', 'La cybersécurité', 'Le cyberharcèlement', 'Le cybercafé'], 2, '*Acosar* = harceler.'],
            ['Le 8 mars 2018, une grève féministe massive a eu lieu en Espagne.', ['Vrai', 'Faux'], 0, 'Des millions de personnes y ont participé.'],
            ['Quelle formule permet de concéder puis réfuter ?', ['Lo que está en juego es…', 'Se podría afirmar que…', 'Es imprescindible que…', 'Si bien es cierto que…, no es menos cierto que…'], 3, '« S’il est vrai que…, il n’en est pas moins vrai que… »'],
            ['Quelle liste est entrée au Parlement espagnol en 2019 pour défendre une province dépeuplée ?', ['Teruel Existe', 'Soria Vive', 'Cuenca Ahora', 'Galicia Unida'], 0, 'Son nom même est un cri contre l’oubli.'],
            ['Après *Es imprescindible que…*, on emploie l’indicatif.', ['Vrai', 'Faux'], 1, 'Une nécessité impersonnelle + *que* entraîne le subjonctif.'],
          ],
        },

        // ---- Axe 2 ---------------------------------------------------------
        {
          titre: 'Mémoire historique : fosses, procès et œuvres contre l’oubli',
          axe: 'Territoire et mémoire',
          lecon: {
            titre: 'Se souvenir des dictatures, lire les paysages',
            cours: `L’Espagne et l’Amérique latine ont connu des guerres civiles et des dictatures dont les blessures sont encore ouvertes. L’axe 2 te fait voir comment une société se souvient — par la loi, par la justice, par l’art — et comment l’être humain modèle aussi la mémoire des paysages.

## Ce que recouvre l’axe
1. **La mémoire historique** dans les pays hispanophones.
2. **Le paysage remodelé** par l’être humain.
3. **La création artistique** pour ne pas oublier.

## Repères : l’Espagne
@ 1936 — Début de la guerre civile (1936-1939), puis dictature de Franco jusqu’en 1975.
@ 1977 — Loi d’amnistie : la Transition démocratique se fait sans juger les crimes du franquisme (le « pacte de l’oubli »).
@ 2007 — Loi de mémoire historique : reconnaissance des victimes, retrait de symboles franquistes.
@ 2019 — Les restes de Franco quittent le Valle de los Caídos.
@ 2022 — Loi de mémoire démocratique : l’État prend en charge la recherche des disparus dans les fosses communes.

## Repères : l’Amérique latine
| Pays | Ce qu’il faut savoir |
| Argentine | Dictature (1976-1983), environ 30 000 disparus selon les organisations de défense des droits humains. Le procès des juntes (1985) est raconté par le film *Argentina, 1985* (2022). L’ancienne école de mécanique de la Marine (ESMA) est devenue un lieu de mémoire. |
| Chili | Dictature de Pinochet (1973-1990) ; le Musée de la Mémoire et des Droits de l’Homme ouvre à Santiago en 2010. |
| Guatemala | Guerre civile (1960-1996) : des massacres de villages mayas qu’un tribunal guatémaltèque a qualifiés de génocide (jugement de 2013, annulé pour vice de procédure, puis réaffirmé en 2018). |

## Repères : le paysage remodelé
| Repère | Ce qu’il faut savoir |
| Les villages engloutis | Des barrages ont noyé des villages entiers en Espagne (Riaño, en León, en 1987) : les habitants ont perdu leur terre et leur mémoire. |
| Les terrasses incas (*andenes*) | Les Incas ont sculpté les pentes des Andes en terrasses pour cultiver. |
| Le canal de Panamá (1914) | Un pays coupé en deux pour relier deux océans. |

## Repères : créer pour ne pas oublier
| Œuvre | Ce qu’il faut savoir |
| *Soldados de Salamina*, Javier Cercas (2001) | Un « récit réel » sur un épisode de la guerre civile. |
| *El laberinto del fauno*, Guillermo del Toro (2006) | Un conte fantastique dans l’Espagne de 1944, entre maquis et répression. |
| *Madres paralelas*, Almodóvar (2021) | Le film s’achève sur l’ouverture d’une fosse commune. |
| *Fragmentos*, Doris Salcedo (Bogotá, 2018) | Un sol fait avec les armes fondues des FARC après l’accord de paix de 2016. |
| *La memoria*, León Gieco (2001) | Chanson argentine contre l’oubli des crimes de la dictature. |

## Le vocabulaire
| Espagnol | Français |
| la memoria histórica | la mémoire historique |
| la fosa común | la fosse commune |
| exhumar, la exhumación | exhumer, l’exhumation |
| los desaparecidos | les disparus |
| el olvido, olvidar | l’oubli, oublier |
| la reparación | la réparation |
| el embalse | le barrage, le lac de retenue |
| rendir cuentas | rendre des comptes |

## Argumenter à l’oral (B2)
| Pour… | Dis… |
| Poser un débat | *Cabe plantearse si es preferible recordar u olvidar.* |
| Présenter deux positions | *Mientras que unos defienden…, otros sostienen que…* |
| Conclure avec nuance | *A fin de cuentas, no se trata de…, sino de…* |

> Une démocratie ne se construit pas seulement sur l’avenir : elle doit dire ce qu’elle fait de son passé, et c’est souvent l’art qui pose la question le premier.

## Exemple travaillé
*Mientras que unos defienden que hay que pasar página para convivir en paz, otros sostienen que las familias tienen derecho a enterrar a sus muertos. A fin de cuentas, no se trata de reabrir heridas, sino de cerrarlas con verdad y justicia.*`,
          },
          questions: [
            ['Quelle loi espagnole de 1977 a permis la Transition sans juger les crimes du franquisme ?', ['La loi d’amnistie', 'La loi de mémoire historique', 'La Constitution', 'La loi de mémoire démocratique'], 0, 'On parle souvent du « pacte de l’oubli ».'],
            ['Que prévoit la loi de mémoire démocratique de 2022 ?', ['L’amnistie des anciens ministres', 'L’interdiction de la corrida', 'La prise en charge par l’État de la recherche des disparus', 'Le retour de la monarchie'], 2, 'L’État prend en charge les exhumations dans les fosses communes.'],
            ['Quel film raconte le procès des juntes militaires argentines de 1985 ?', ['Roma', 'Madres paralelas', 'La jaula de oro', 'Argentina, 1985'], 3, 'Sorti en 2022, il suit le procureur Julio Strassera.'],
            ['Qu’est devenue l’ESMA à Buenos Aires ?', ['Un stade', 'Un lieu de mémoire', 'Une caserne en activité', 'Un centre commercial'], 1, 'Ancien centre clandestin de détention, c’est aujourd’hui un espace de mémoire.'],
            ['Quand le Musée de la Mémoire et des Droits de l’Homme a-t-il ouvert à Santiago du Chili ?', ['En 1973', 'En 1990', 'En 2010', 'En 2022'], 2, 'Il retrace la dictature de Pinochet (1973-1990).'],
            ['Avec quoi est fait le sol de l’œuvre *Fragmentos* de Doris Salcedo ?', ['Des armes fondues des FARC', 'Des pierres de fosses communes', 'Du verre recyclé', 'Des livres brûlés'], 0, 'L’œuvre est née de l’accord de paix colombien de 2016.'],
            ['Dans quel contexte se déroule *El laberinto del fauno* ?', ['Le Mexique révolutionnaire', 'L’Espagne de 1944, entre maquis et répression', 'L’Argentine de 1985', 'Madrid pendant la Movida'], 1, 'Guillermo del Toro mêle conte fantastique et réalité historique.'],
            ['Que signifie *la fosa común* ?', ['Le fossé commun', 'La place commune', 'La maison commune', 'La fosse commune'], 3, 'Des milliers de victimes de la guerre civile y reposent encore.'],
            ['Riaño, en León, est un village englouti par un barrage en 1987.', ['Vrai', 'Faux'], 0, 'Les habitants ont perdu leurs terres et une part de leur mémoire.'],
            ['Que sont les *andenes* incas ?', ['Des temples', 'Des routes', 'Des terrasses de culture', 'Des canaux souterrains'], 2, 'Les Incas ont sculpté les pentes des Andes pour cultiver.'],
            ['Quel auteur a écrit *Soldados de Salamina* (2001) ?', ['Javier Cercas', 'Arturo Pérez-Reverte', 'Carlos Ruiz Zafón', 'Almudena Grandes'], 0, 'Il le présente comme un « récit réel ».'],
            ['Les restes de Franco reposent toujours au Valle de los Caídos.', ['Vrai', 'Faux'], 1, 'Ils en ont été exhumés en 2019 ; le lieu s’appelle aujourd’hui Cuelgamuros.'],
          ],
        },

        // ---- Axe 3 ---------------------------------------------------------
        {
          titre: 'Réalisme magique et récits vrais',
          axe: 'Fictions et réalités',
          lecon: {
            titre: 'Quand la fiction dit le réel',
            cours: `Des tableaux de Goya aux romans de García Márquez, la culture hispanique n’a cessé de brouiller la frontière entre ce qui est inventé et ce qui est arrivé. L’axe 3 te demande comment la fiction témoigne du réel, et ce qu’elle en fait.

## Ce que recouvre l’axe
1. **Raconter le réel** : jusqu’où les représentations artistiques du réel témoignent-elles de l’histoire ?
2. **Les mondes imaginaires** : des espaces de réflexion sur la vie réelle.
3. **Fiction et faits historiques** : convergences et oppositions.

## Raconter le réel
| Œuvre | Ce qu’il faut savoir |
| *El 3 de mayo de 1808*, Goya (1814) | L’exécution de Madrilènes par les soldats de Napoléon : un tableau-témoignage, au Prado. |
| *Muerte de un miliciano*, Robert Capa (1936) | Photo d’un républicain fauché par une balle : l’une des images les plus célèbres de la guerre civile, dont l’authenticité fait débat. |
| *Roma*, Alfonso Cuarón (2018) | Le massacre d’étudiants du 10 juin 1971 à Mexico (*el Halconazo*) vu depuis la vie d’une employée de maison. |

## Les mondes imaginaires
| Œuvre | Ce qu’il faut savoir |
| *Don Quijote*, Cervantes (1605 et 1615) | Un lecteur qui prend la fiction pour la réalité : le premier roman moderne. |
| *Ficciones*, Jorge Luis Borges (1944) | Bibliothèques infinies, labyrinthes : l’imaginaire comme réflexion sur le savoir. |
| *Pedro Páramo*, Juan Rulfo (1955) | Un village mexicain peuplé de morts qui parlent. |
| *Cien años de soledad*, Gabriel García Márquez (1967) | Macondo et la famille Buendía : le chef-d’œuvre du **réalisme magique**, où l’extraordinaire est raconté comme ordinaire. Nobel en 1982. |
| *La casa de los espíritus*, Isabel Allende (1982) | Une saga familiale chilienne qui aboutit au coup d’État de 1973. |

## Fiction et faits historiques
| Œuvre | Le fait réel |
| *Cien años de soledad* | Le massacre des ouvriers des bananeraies de Ciénaga (Colombie, 1928), que le roman amplifie et que la ville du roman oublie aussitôt. |
| *La fiesta del Chivo*, Mario Vargas Llosa (2000) | La dictature de Trujillo en République dominicaine et son assassinat en 1961. Vargas Llosa : Nobel en 2010. |
| *El Ministerio del Tiempo* (série, 2015) | Des agents qui voyagent dans l’histoire d’Espagne pour la protéger. |

## Le vocabulaire
| Espagnol | Français |
| el relato, narrar | le récit, raconter |
| el testimonio, atestiguar | le témoignage, témoigner |
| verosímil | vraisemblable |
| el realismo mágico | le réalisme magique |
| inventar, la invención | inventer, l’invention |
| los hechos históricos | les faits historiques |
| el narrador, la narradora | le narrateur, la narratrice |
| la novela, el cuento | le roman, la nouvelle |

## Problématiques et documents
- *¿Una obra de arte puede ser un documento histórico?* Documents : *El 3 de mayo de 1808*, la photo de Capa.
- *¿Por qué inventar mundos para hablar del nuestro?* Documents : l’incipit de *Cien años de soledad*.
- *¿Tiene derecho la ficción a modificar la historia?* Documents : un extrait de *La fiesta del Chivo*.

## Argumenter à l’oral (B2)
| Pour… | Dis… |
| Analyser un procédé | *El autor recurre a… para…* |
| Interpréter | *Cabe interpretar esta escena como…* |
| Distinguer | *Conviene distinguir entre… y…* |
| Hypothèse | *Si el autor hubiera contado solo los hechos, la obra habría perdido…* |

> La fiction ne ment pas quand elle invente : elle ment quand elle fait croire qu’elle n’invente pas. Le réalisme magique, lui, avoue tout.

## Exemple travaillé
*En Cien años de soledad, García Márquez recurre al realismo mágico para contar la masacre de las bananeras de 1928. Cabe interpretar el olvido de los habitantes de Macondo como una crítica de la historia oficial. Si el autor hubiera contado solo los hechos, la obra habría perdido su fuerza universal.*`,
          },
          questions: [
            ['Que représente *El 3 de mayo de 1808* de Goya ?', ['Une fête populaire', 'L’exécution de Madrilènes par les soldats de Napoléon', 'La bataille de Trafalgar', 'Le couronnement d’un roi'], 1, 'Peint en 1814, ce tableau-témoignage est au Prado.'],
            ['Quel roman a fait du réalisme magique un mouvement mondial ?', ['Don Quijote', 'La fiesta del Chivo', 'Cien años de soledad', 'Soldados de Salamina'], 2, 'Publié en 1967 par Gabriel García Márquez.'],
            ['Comment s’appelle le village de *Cien años de soledad* ?', ['Macondo', 'Comala', 'Santa María', 'Aracataca'], 0, 'Aracataca est le village natal de García Márquez ; Comala est celui de *Pedro Páramo*.'],
            ['Quel fait historique évoque *Cien años de soledad* ?', ['La Révolution mexicaine', 'La guerre civile espagnole', 'Le coup d’État de Pinochet', 'Le massacre des ouvriers des bananeraies de 1928'], 3, 'Le roman amplifie le massacre de Ciénaga, puis montre la ville qui l’oublie.'],
            ['Quelle dictature raconte *La fiesta del Chivo* de Vargas Llosa ?', ['Celle de Franco', 'Celle de Trujillo en République dominicaine', 'Celle de Pinochet', 'Celle de Somoza'], 1, 'Le roman culmine avec l’assassinat de Trujillo en 1961.'],
            ['En quelle année García Márquez a-t-il reçu le prix Nobel ?', ['1967', '2010', '1982', '1945'], 2, 'Vargas Llosa l’a reçu en 2010.'],
            ['Que signifie *verosímil* ?', ['Vraisemblable', 'Véritable', 'Vérifié', 'Invraisemblable'], 0, 'Ce qui paraît vrai, même si c’est inventé.'],
            ['Quel auteur argentin a écrit *Ficciones* (1944) ?', ['Julio Cortázar', 'Ernesto Sabato', 'Juan Rulfo', 'Jorge Luis Borges'], 3, 'Bibliothèques infinies et labyrinthes y questionnent le savoir.'],
            ['Dans *Pedro Páramo*, le village est peuplé de morts qui parlent.', ['Vrai', 'Faux'], 0, 'Le roman de Juan Rulfo (1955) a inspiré tout le réalisme magique.'],
            ['Que caractérise le réalisme magique ?', ['Un récit de science-fiction futuriste', 'L’extraordinaire raconté comme ordinaire', 'Un journal intime', 'Une enquête policière'], 1, 'Chez García Márquez, une femme monte au ciel sans que personne s’en étonne.'],
            ['Quel temps suit *si* dans *Si el autor ___ contado solo los hechos…* ?', ['habría', 'haya', 'hubiera', 'había'], 2, 'Irréel du passé : plus-que-parfait du subjonctif après *si*.', 'Quel auxiliaire après si pour l’irréel du passé ?'],
            ['Quel événement de 1971 apparaît dans *Roma* ?', ['Le tremblement de terre de Mexico', 'Les Jeux olympiques', 'Le massacre d’étudiants appelé *el Halconazo*', 'L’élection d’Allende'], 2, 'Le 10 juin 1971, des étudiants sont tués à Mexico.'],
          ],
        },

        // ---- Axe 4 ---------------------------------------------------------
        {
          titre: 'Discours, publicité et traduction',
          axe: 'Enjeux et formes de la communication',
          lecon: {
            titre: 'Convaincre, séduire, traduire',
            cours: `Un dernier discours à la radio, une publicité qui ressuscite une star, un traducteur automatique qui rate une blague : communiquer, c’est toujours choisir une forme et viser un effet. L’axe 4 t’apprend à décrypter ces formes.

## Ce que recouvre l’axe
1. **Les formes du discours** : évolution au fil des époques.
2. **La publicité** : une mécanique de séduction qui repose sur des référentiels culturels précis.
3. **L’art de la traduction** à l’heure du numérique.

## Les formes du discours
| Repère | Ce qu’il faut savoir |
| La lettre de Colomb (1493) | Il annonce aux Rois catholiques la découverte de terres nouvelles : un récit qui doit convaincre et obtenir d’autres fonds. |
| La Real Academia Española (1713) | Sa devise, *Limpia, fija y da esplendor*, résume l’idée d’une langue à protéger ; elle publie le dictionnaire de référence. |
| Le dernier discours d’Allende (11 septembre 1973) | À la radio, sous les bombes, le président chilien parle pour l’histoire : *Estas son mis últimas palabras*. |
| *Latinoamérica*, Calle 13 (2011) | Le rap comme discours politique : l’identité d’un continent en une chanson. |
| Le langage inclusif | Débat actuel entre ceux qui proposent *todes* ou *-x* et la RAE, qui défend le masculin générique. |

## La publicité
| Repère | Ce qu’il faut savoir |
| La Lotería de Navidad | Ses publicités de Noël, émouvantes et très attendues, jouent sur la solidarité et le tirage du 22 décembre, une tradition nationale. |
| « Con mucho acento », Cruzcampo (2021) | La bière fait « revivre » la chanteuse Lola Flores par intelligence artificielle pour célébrer les accents andalous : prouesse ou manipulation ? |
| Les références culturelles | Une publicité parle d’une culture : la famille, la fête, la région, l’humour. Traduite telle quelle, elle peut ne plus rien dire. |

## La traduction
| Repère | Ce qu’il faut savoir |
| Une langue mondiale | L’espagnol compte près de 500 millions de locuteurs natifs, environ 600 millions au total selon l’Instituto Cervantes (fondé en 1991). |
| Julio Cortázar traducteur | L’écrivain argentin a traduit toute la prose d’Edgar Allan Poe. |
| La machine | Les traducteurs automatiques traduisent vite, mais trébuchent sur l’humour, les jeux de mots, les registres et les *falsos amigos* (*embarazada* = enceinte). |

## Le vocabulaire
| Espagnol | Français |
| el discurso, el orador | le discours, l’orateur |
| convencer, persuadir | convaincre, persuader |
| el anuncio, el eslogan | la publicité, le slogan |
| el público objetivo | la cible |
| seducir | séduire |
| la traducción automática | la traduction automatique |
| el matiz, matizar | la nuance, nuancer |
| el juego de palabras | le jeu de mots |

## Problématiques et documents
- *¿Cómo ha cambiado la manera de convencer?* Documents : le discours d’Allende, un extrait de *Latinoamérica*.
- *¿La publicidad vende productos o valores?* Documents : la publicité Cruzcampo de 2021.
- *¿Puede una máquina traducir una cultura?* Documents : une blague traduite par une machine, un entretien de traducteur.

## Argumenter à l’oral (B2)
| Pour… | Dis… |
| Analyser une stratégie | *El anuncio apela a…, juega con…* |
| Montrer un effet | *Lo que pretende es que el espectador…* (+ subjonctif) |
| Critiquer | *Cabe cuestionar el uso de…* |

> Toute communication a une forme et une cible : décrypter un discours, c’est se demander qui parle, à qui, et pour obtenir quoi.

## Exemple travaillé
*El anuncio de Cruzcampo apela a la nostalgia: devuelve la voz a Lola Flores gracias a la inteligencia artificial. Lo que pretende es que el espectador asocie la cerveza con el orgullo andaluz. Sin embargo, cabe cuestionar el uso de la imagen de una persona fallecida.*`,
          },
          questions: [
            ['Quelle est la devise de la Real Academia Española ?', ['Plus ultra', 'Limpia, fija y da esplendor', 'Una, grande y libre', 'Libertad, igualdad'], 1, 'Fondée en 1713, la RAE publie le dictionnaire de référence.'],
            ['Dans quelles circonstances Allende prononce-t-il son dernier discours ?', ['Lors de son élection en 1970', 'À l’ONU', 'À la radio, pendant le coup d’État du 11 septembre 1973', 'Dans un stade'], 2, '*Estas son mis últimas palabras* : il parle pour l’histoire.'],
            ['Quel groupe a chanté *Latinoamérica* (2011) ?', ['Calle 13', 'Maná', 'Los Prisioneros', 'Soda Stereo'], 0, 'Le groupe portoricain en a fait un hymne continental.'],
            ['Qu’a fait la publicité Cruzcampo « Con mucho acento » (2021) ?', ['Elle a été tournée sans acteurs', 'Elle a interdit l’accent andalou', 'Elle a été censurée', 'Elle a fait « revivre » Lola Flores par intelligence artificielle'], 3, 'Elle pose la question de l’usage de l’image d’une personne décédée.'],
            ['Quand a lieu le tirage de la Lotería de Navidad ?', ['Le 6 janvier', 'Le 22 décembre', 'Le 31 décembre', 'Le 12 octobre'], 1, 'Une tradition nationale suivie par toute l’Espagne.'],
            ['Combien de personnes environ parlent espagnol dans le monde, selon l’Instituto Cervantes ?', ['60 millions', '200 millions', 'Environ 600 millions', '2 milliards'], 2, 'Dont près de 500 millions de locuteurs natifs.'],
            ['Quel écrivain argentin a traduit toute la prose d’Edgar Allan Poe ?', ['Julio Cortázar', 'Jorge Luis Borges', 'Ernesto Sabato', 'Manuel Puig'], 0, 'La traduction a nourri sa propre écriture fantastique.'],
            ['Que signifie *embarazada* ?', ['Embarrassée', 'Embrassée', 'Embarquée', 'Enceinte'], 3, 'Faux ami classique, piège des traducteurs automatiques.'],
            ['La RAE est favorable à l’écriture *todes*.', ['Vrai', 'Faux'], 1, 'Elle défend le masculin générique et refuse ces formes.'],
            ['Que signifie *el público objetivo* ?', ['Le public objectif et neutre', 'La cible', 'Le jury', 'Les spectateurs du film'], 1, 'Le public que la publicité vise.'],
            ['Pourquoi Colomb écrit-il sa lettre de 1493 ?', ['Pour démissionner', 'Pour annoncer sa découverte et obtenir d’autres fonds', 'Pour se plaindre de son équipage', 'Pour raconter son enfance'], 1, 'Le récit doit convaincre les Rois catholiques.'],
            ['Complète : *Lo que pretende es que el espectador ___ la cerveza con el orgullo andaluz.*', ['asocia', 'asociará', 'asocie', 'asociaba'], 2, '*Pretender que* (chercher à ce que) entraîne le subjonctif.', 'Quel mode après pretender que ?'],
          ],
        },

        // ---- Axe 5 ---------------------------------------------------------
        {
          titre: 'Réseaux, désinformation et école numérique',
          axe: 'Citoyenneté et mondes virtuels',
          lecon: {
            titre: 'Être citoyen à l’ère des écrans',
            cours: `Les réseaux sociaux ont rempli les places du monde hispanique, mais ils propagent aussi les fausses nouvelles ; le numérique ouvre l’école à tous, mais creuse de nouvelles inégalités. L’axe 5 t’invite à peser ces deux faces.

## Ce que recouvre l’axe
1. **Citoyens connectés, citoyens engagés ?** Le rôle des réseaux sociaux dans les initiatives citoyennes.
2. **Information** : entre réalité et manipulation.
3. **Apprendre et se former grâce au numérique** : avantages et limites.

## Des réseaux à la rue
@ 2011 — Le 15-M : appelés par les réseaux sociaux, les « Indignés » occupent la Puerta del Sol à Madrid.
@ 2012 — Au Mexique, le mouvement étudiant *Yo Soy 132* naît d’une vidéo partagée en ligne.
@ 2015 — *#NiUnaMenos* part d’un tweet en Argentine.
@ 2019 — Au Chili, l’*estallido social* commence en octobre par une hausse du ticket de métro ; il débouche sur un processus constituant.

## Informer ou manipuler
| Repère | Ce qu’il faut savoir |
| Les *bulos* | Nom espagnol des fausses nouvelles, qui circulent surtout par les messageries. |
| Les vérificateurs | Maldita.es et Newtral en Espagne, Chequeado en Argentine (depuis 2010) vérifient les déclarations publiques. |
| Les bulles de filtre | Les algorithmes montrent à chacun ce qui confirme ses opinions. |

## Apprendre en ligne
| Repère | Ce qu’il faut savoir |
| Le Plan Ceibal (Uruguay, 2007) | Un ordinateur portable pour chaque élève de l’école publique : une première nationale. |
| La pandémie de 2020 | Écoles fermées : les cours en ligne révèlent la *brecha digital* entre élèves connectés et non connectés, surtout en zone rurale. |
| Les MOOC en espagnol | Des universités d’Espagne et d’Amérique latine proposent des cours gratuits en ligne. |

## Le vocabulaire
| Espagnol | Français |
| el ciudadano, la ciudadanía | le citoyen, la citoyenneté |
| movilizarse, la movilización | se mobiliser, la mobilisation |
| el bulo, la noticia falsa | la fausse nouvelle |
| verificar, contrastar | vérifier, recouper |
| el algoritmo | l’algorithme |
| la brecha digital | la fracture numérique |
| la enseñanza a distancia | l’enseignement à distance |
| el pensamiento crítico | l’esprit critique |

## Problématiques et documents
- *¿Un clic basta para ser un ciudadano comprometido?* Documents : photos du 15-M, un tweet *#NiUnaMenos*.
- *¿Cómo distinguir la información de la manipulación?* Documents : un *bulo* démonté par Maldita.es.
- *¿La escuela del futuro será digital?* Documents : un reportage sur le Plan Ceibal, un témoignage d’élève pendant la pandémie.

## Argumenter à l’oral (B2)
| Pour… | Dis… |
| Opposer deux faces | *Por una parte…, por otra…* |
| Relativiser | *Conviene matizar esta idea.* |
| Donner une condition | *Siempre y cuando…* (+ subjonctif) |
| Conclure | *En definitiva, todo depende de…* |

> Les réseaux ne créent pas l’engagement, ils l’accélèrent ; et ils accélèrent de la même façon le vrai et le faux.

## Exemple travaillé
*Por una parte, las redes sociales permitieron que miles de jóvenes se movilizaran en 2011. Por otra, difunden bulos a gran velocidad. Conviene matizar: las redes son útiles siempre y cuando los ciudadanos desarrollen su pensamiento crítico.*`,
          },
          questions: [
            ['Qu’est-ce qu’un *bulo* ?', ['Un réseau social', 'Une fausse nouvelle', 'Un blog', 'Un tweet'], 1, 'Le mot désigne les fausses informations qui circulent en ligne.'],
            ['Qu’a déclenché l’*estallido social* au Chili en octobre 2019 ?', ['Une élection', 'Une hausse du ticket de métro', 'Un match de football', 'Un tremblement de terre'], 1, 'La colère s’est élargie aux inégalités et a débouché sur un processus constituant.'],
            ['Quel mouvement mexicain est né en 2012 d’une vidéo partagée en ligne ?', ['Ni una menos', 'Yo Soy 132', '15-M', 'Chequeado'], 1, 'Un mouvement étudiant pendant la campagne présidentielle.'],
            ['Qu’est-ce que Chequeado ?', ['Un réseau social argentin', 'Un journal satirique', 'Un site argentin de vérification des faits', 'Une application de messagerie'], 2, 'Fondé en 2010, il vérifie les déclarations publiques.'],
            ['Quel était le but du Plan Ceibal en Uruguay (2007) ?', ['Un ordinateur portable pour chaque élève du public', 'L’interdiction des téléphones à l’école', 'Des cours de robotique pour adultes', 'La création d’un réseau social national'], 0, 'Une première nationale pour réduire la fracture numérique.'],
            ['Que signifie *la brecha digital* ?', ['Le piratage', 'Le code numérique', 'La mise à jour', 'La fracture numérique'], 3, 'L’écart entre ceux qui ont accès au numérique et les autres.'],
            ['Que signifie *contrastar una información* ?', ['La contredire', 'La recouper, la vérifier', 'La partager', 'La supprimer'], 1, 'Faux ami partiel : *contrastar* = confronter à d’autres sources.'],
            ['Qu’appelle-t-on une « bulle de filtre » ?', ['Un anti-virus', 'Un réseau privé', 'L’effet des algorithmes qui montrent ce qui confirme nos opinions', 'Un filtre photo'], 2, 'Chacun finit par ne voir que ce qui lui ressemble.'],
            ['Le 15-M a été largement convoqué par les réseaux sociaux.', ['Vrai', 'Faux'], 0, 'En mai 2011, les « Indignés » ont occupé la Puerta del Sol.'],
            ['Après *siempre y cuando…*, quel mode faut-il ?', ['L’indicatif', 'Le futur', 'L’infinitif', 'Le subjonctif'], 3, 'Condition : *siempre y cuando* + subjonctif.'],
            ['Que signifie *el pensamiento crítico* ?', ['L’esprit critique', 'La critique littéraire', 'La pensée négative', 'Le reproche'], 0, 'Aptitude à examiner une information avant de la croire.'],
            ['Pendant la pandémie de 2020, l’école en ligne a effacé les inégalités entre élèves.', ['Vrai', 'Faux'], 1, 'Elle les a au contraire révélées, surtout en zone rurale.'],
          ],
        },

        // ---- Axe 6 ---------------------------------------------------------
        {
          titre: 'Mestizaje : Guadalupe, al-Andalus et les mots voyageurs',
          axe: 'La richesse des métissages dans le monde hispanique',
          lecon: {
            titre: 'Un monde né du mélange',
            cours: `Le monde hispanique est né de rencontres — parfois violentes — entre cultures ibériques, arabes, juives, amérindiennes, africaines et asiatiques. L’axe 6, propre à l’espagnol et **obligatoire** en Terminale, te fait voir la richesse de ces métissages dans l’art, la foi et la langue.

## Ce que recouvre l’axe
1. **Une mixité culturelle** omniprésente et féconde.
2. **Le syncrétisme religieux** en Amérique latine.
3. **La langue espagnole** : apports, évolutions, adaptations au fil du temps.

## Repères : la mixité culturelle
| Repère | Ce qu’il faut savoir |
| Al-Andalus (711-1492) | Huit siècles de présence musulmane dans la péninsule ; à Tolède, l’École des traducteurs réunit savants chrétiens, juifs et musulmans (XIIe-XIIIe siècles). |
| L’art mudéjar | Art des musulmans restés en terre chrétienne : briques et céramique à Teruel (patrimoine mondial). La Mezquita de Cordoue abrite une cathédrale en son centre. |
| L’Inca Garcilaso de la Vega (1539-1616) | Fils d’un conquistador et d’une princesse inca, il écrit les *Comentarios reales* (1609) : le premier grand écrivain métis. |
| *La raza cósmica*, José Vasconcelos (1925) | L’essayiste mexicain fait du métissage l’avenir de l’humanité. |
| Musiques et cuisines | Le tango de Buenos Aires (UNESCO 2009), la salsa, la cumbia ; au Pérou, la cuisine *nikkei* (japonaise) et le *chifa* (chinois). |

## Repères : le syncrétisme religieux
| Repère | Ce qu’il faut savoir |
| La Vierge de Guadalupe (Mexique) | Elle serait apparue en 1531 à l’Indien Juan Diego sur la colline du Tepeyac, lieu d’un ancien culte à la déesse Tonantzin : une Vierge au visage métis, symbole national. |
| El Día de Muertos | Mêle rites préhispaniques et fêtes catholiques de la Toussaint. |
| La santería (Cuba) | Née des esclaves yorubas : chaque divinité africaine (*orisha*) a un saint catholique pour double, Changó et sainte Barbe, Yemayá et la Vierge de Regla. |
| La Virgen del Cerro (Potosí, XVIIIe s.) | Tableau où la Vierge se confond avec la montagne, image de la Pachamama. |

## Repères : la langue métissée
| Origine | Exemples |
| Arabe (plusieurs milliers de mots) | *aceite, almohada, azúcar, alcalde, ojalá* (« si Dieu le veut ») |
| Nahuatl | *chocolate, tomate, aguacate, chicle* |
| Taïno (Caraïbes) | *huracán, canoa, hamaca, barbacoa* |
| Quechua | *papa, cóndor, llama, pampa* |
| Anglais | *fútbol, líder, wifi* |

Les variantes d’Amérique : le **voseo** en Argentine (*vos tenés*), *ustedes* à la place de *vosotros*, le *seseo* (*z* et *c* prononcés comme *s*). En 1492, Nebrija publie la première grammaire du castillan.

## Le vocabulaire
| Espagnol | Français |
| el mestizaje, mestizo | le métissage, métis |
| el sincretismo | le syncrétisme |
| la mezcla, mezclar | le mélange, mélanger |
| la herencia cultural | l’héritage culturel |
| la convivencia | la coexistence |
| el préstamo lingüístico | l’emprunt linguistique |
| enriquecer | enrichir |

## Argumenter à l’oral (B2)
| Pour… | Dis… |
| Montrer une fusion | *Se funden…, confluyen…* |
| Nuancer une vision idéale | *No hay que olvidar que este mestizaje nació de la conquista.* |
| Conclure | *Lejos de empobrecer…, el mestizaje enriquece…* |

> Le métissage n’est pas une addition paisible : il est né de conquêtes et de dominations, mais il a produit des cultures nouvelles, que personne n’aurait pu inventer seul.

## Exemple travaillé
*La Virgen de Guadalupe es un ejemplo de sincretismo: se apareció, según la tradición, en el cerro del Tepeyac, donde se veneraba a Tonantzin. No hay que olvidar que este mestizaje nació de la conquista. Sin embargo, lejos de empobrecer la cultura mexicana, la ha enriquecido.*`,
          },
          questions: [
            ['À qui la Vierge de Guadalupe serait-elle apparue en 1531 ?', ['À Hernán Cortés', 'À l’Indien Juan Diego', 'À Moctezuma', 'Au pape'], 1, 'Sur la colline du Tepeyac, lieu d’un ancien culte à Tonantzin.'],
            ['Que désigne la santería cubaine ?', ['Une danse', 'Un culte qui associe divinités yorubas et saints catholiques', 'Un ordre religieux espagnol', 'Une fête de village'], 1, 'Changó a pour double sainte Barbe, Yemayá la Vierge de Regla.'],
            ['Qui a écrit les *Comentarios reales* (1609) ?', ['Bartolomé de las Casas', 'Hernán Cortés', 'L’Inca Garcilaso de la Vega', 'Sor Juana Inés de la Cruz'], 2, 'Fils d’un conquistador et d’une princesse inca, il est le premier grand écrivain métis.'],
            ['De quelle langue vient le mot *ojalá* ?', ['De l’arabe', 'Du latin', 'Du nahuatl', 'Du basque'], 0, 'Il signifie à l’origine « si Dieu le veut ».'],
            ['Quel mot espagnol vient du nahuatl ?', ['huracán', 'papa', 'almohada', 'chocolate'], 3, 'Comme *tomate* et *aguacate* ; *huracán* vient du taïno, *papa* du quechua.'],
            ['Qu’est-ce que le *voseo* argentin ?', ['L’emploi de *vos* à la place de *tú* : *vos tenés*', 'La prononciation du *z* comme *s*', 'L’usage de *vosotros*', 'L’oubli des accents'], 0, 'Il a ses propres conjugaisons : *vos sos, vos tenés*.'],
            ['Quelles dates bornent al-Andalus ?', ['1492-1898', '711-1492', '1036-1231', '1810-1824'], 1, 'De la conquête musulmane à la chute de Grenade.'],
            ['Qu’est-ce que la cuisine *nikkei* au Pérou ?', ['Une cuisine inca', 'Une cuisine espagnole', 'Une cuisine chinoise', 'Une cuisine née de l’immigration japonaise'], 3, 'Le *chifa*, lui, est la cuisine sino-péruvienne.'],
            ['*Huracán* est un mot d’origine taïno.', ['Vrai', 'Faux'], 0, 'Comme *canoa, hamaca, barbacoa* : les premiers mots américains entrés en espagnol.'],
            ['Qui a publié en 1492 la première grammaire du castillan ?', ['Cervantes', 'Nebrija', 'Alphonse X', 'Colomb'], 1, 'Antonio de Nebrija, la même année que la chute de Grenade.'],
            ['Que signifie *el préstamo lingüístico* ?', ['Le prêt bancaire', 'La faute de langue', 'L’emprunt linguistique', 'La traduction'], 2, 'Un mot pris à une autre langue.'],
            ['Quel essayiste a écrit *La raza cósmica* (1925) ?', ['Octavio Paz', 'José Vasconcelos', 'José Martí', 'Rubén Darío'], 1, 'Pour lui, le métissage est l’avenir de l’humanité.'],
          ],
        },
      ],
    },

    // ======================================================================
    // LA GRAMMAIRE DE TERMINALE (B2)
    // ======================================================================
    {
      niveaux: ['Tle'],
      positionDepart: 46,
      rayon: 'langue',
      chapitres: [
        {
          titre: 'La concordance des temps',
          axe: 'Les temps',
          lecon: {
            titre: 'Accorder le subjonctif au temps de la principale',
            cours: `En français, on dit « je voulais qu’il vienne » ; en espagnol, cette phrase est fausse. L’espagnol accorde **strictement** le temps du subjonctif à celui du verbe principal : c’est la concordance des temps.

## La règle en un tableau
| Verbe principal | Subjonctif de la subordonnée | Exemple |
| présent, futur, passé composé, impératif | **présent** du subjonctif | *Quiero que vengas. Le he dicho que venga.* |
| imparfait, passé simple, plus-que-parfait, conditionnel | **imparfait** du subjonctif | *Quería que vinieras. Le dije que viniera. Me gustaría que vinieras.* |

> Principale au passé ou au conditionnel → subordonnée à l’imparfait du subjonctif. Sans exception à l’écrit.

!> Erreur classique : *Quería que vengas*. Il faut *Quería que vinieras*.

## Elle vaut pour toutes les subordonnées
| Type | Exemple au présent | Exemple au passé |
| Complétive | *Te pido que me ayudes.* | *Te pedí que me ayudaras.* |
| Relative | *Busco a alguien que hable ruso.* | *Buscaba a alguien que hablara ruso.* |
| Temporelle | *Te llamaré cuando llegue.* | *Me dijo que me llamaría cuando llegara.* |
| But | *Lo explico para que lo entiendas.* | *Lo expliqué para que lo entendieras.* |
| Concession | *Aunque llueva, saldré.* | *Aunque lloviera, saldría.* |

## Les cas à connaître
1. **Le passé composé** est un temps du présent en espagnol : *Le he pedido que venga* (présent du subjonctif).
2. Pour une action **antérieure**, on emploie le subjonctif passé ou plus-que-parfait : *Me alegro de que hayas venido. Me alegré de que hubieras venido.*
3. Un verbe au présent peut commander un imparfait du subjonctif si la subordonnée parle du **passé** : *No creo que lo hiciera él* (je ne crois pas que ce soit lui qui l’ait fait).
4. Avec **como si**, toujours l’imparfait (ou plus-que-parfait) du subjonctif, quel que soit le temps principal.

## La méthode, en trois questions
1. La subordonnée exige-t-elle le subjonctif ? (volonté, sentiment, but, doute, futur après *cuando*…)
2. À quel temps est le verbe principal ?
3. L’action de la subordonnée est-elle simultanée, postérieure ou antérieure ?

## Exemple travaillé
Mets au passé : *El profesor exige que los alumnos lleguen a la hora y que no usen el móvil cuando estén en clase.*
1. *exige* → *exigió* (passé simple).
2. *lleguen* → **llegaran** ; *usen* → **usaran** ; *estén* → **estuvieran**.
→ *El profesor exigió que los alumnos llegaran a la hora y que no usaran el móvil cuando estuvieran en clase.*`,
          },
          questions: [
            ['Complète : *Quería que tú ___.*', ['vengas', 'vinieras', 'vienes', 'vendrás'], 1, 'Principale à l’imparfait → imparfait du subjonctif.', 'Quel temps après quería que ?'],
            ['Après un verbe principal au conditionnel, le subjonctif est…', ['Au présent', 'Au futur', 'À l’imparfait', 'Inutile'], 2, '*Me gustaría que vinieras.*'],
            ['*Le he pedido que ___.* Quel mot complète la phrase ?', ['venga', 'viniera', 'vendría', 'vino'], 0, 'Le passé composé est un temps du présent : présent du subjonctif.', 'Quel temps après le passé composé ?'],
            ['Quelle phrase est correcte ?', ['Buscaba a alguien que habla ruso', 'Buscaba a alguien que hable ruso', 'Buscaba a alguien que hablaría ruso', 'Buscaba a alguien que hablara ruso'], 3, 'Relative au subjonctif, principale au passé → imparfait du subjonctif.'],
            ['Mets au passé : *Lo explico para que lo entiendas.*', ['Lo expliqué para que lo entiendas', 'Lo expliqué para que lo entendieras', 'Lo expliqué para que lo entendías', 'Lo expliqué para que lo entenderías'], 1, 'Le but suit la concordance.'],
            ['*Me dijo que me llamaría cuando ___.* Quel mot complète la phrase ?', ['llegue', 'llegará', 'llegara', 'llegaba'], 2, 'Futur vu depuis le passé → imparfait du subjonctif après *cuando*.', 'Quel temps après cuando dans un récit au passé ?'],
            ['*Me alegro de que hayas venido* : pourquoi le subjonctif passé ?', ['L’action de venir est antérieure', 'C’est une faute', 'Parce que *alegrarse* est au passé', 'Parce que c’est un ordre'], 0, 'Principale au présent, action antérieure : subjonctif passé.'],
            ['Après *como si*, quel temps emploie-t-on toujours ?', ['Le présent du subjonctif', 'L’indicatif', 'Le conditionnel', 'L’imparfait ou le plus-que-parfait du subjonctif'], 3, '*Habla como si lo supiera todo.*'],
            ['*Quería que vengas* est correct en espagnol.', ['Vrai', 'Faux'], 1, 'Calque du français : il faut *Quería que vinieras*.'],
            ['*No creo que lo hiciera él* : pourquoi l’imparfait du subjonctif après un présent ?', ['C’est une faute', 'La subordonnée parle d’un fait passé', 'Parce que *creer* l’exige toujours', 'Parce que la phrase est négative'], 1, 'Le temps suit alors l’époque de l’action.'],
            ['Mets au passé : *Aunque llueva, saldré.*', ['Aunque lloviera, saldría', 'Aunque llueva, saldría', 'Aunque llovía, saldré', 'Aunque lloverá, salía'], 0, 'Concession hypothétique au passé : imparfait du subjonctif + conditionnel.'],
            ['La concordance des temps concerne aussi les propositions relatives.', ['Vrai', 'Faux'], 0, 'Elle vaut pour toute subordonnée au subjonctif.'],
          ],
        },
        {
          titre: 'L’hypothèse et la condition avec si',
          axe: 'La phrase',
          lecon: {
            titre: 'Si + présent, si + imparfait du subjonctif, si + plus-que-parfait',
            cours: `« Si j’avais su, je serais venu » : le système hypothétique espagnol a trois étages, comme le français, mais l’irréel passe par le **subjonctif**. C’est une structure attendue dans toute copie de Terminale.

## Les trois systèmes
| Hypothèse | Après si | Principale | Exemple |
| Réalisable | présent de l’indicatif | présent, futur, impératif | *Si llueve, me quedo / me quedaré / quédate.* |
| Irréel du présent | **imparfait du subjonctif** | conditionnel | *Si tuviera tiempo, viajaría.* |
| Irréel du passé | **plus-que-parfait du subjonctif** | conditionnel passé (ou plus-que-parfait du subjonctif) | *Si hubiera sabido, habría venido / hubiera venido.* |

!> Après *si* hypothétique : jamais de futur, jamais de conditionnel, jamais de présent du subjonctif. *Si tendría* et *Si tenga* sont des fautes lourdes.

## Mélanger les époques
On peut croiser les systèmes quand la condition et le résultat ne sont pas au même moment :
*Si hubiera estudiado (hier), ahora estaría tranquilo (aujourd’hui).*

## Si non hypothétique
Quand *si* signifie « est-ce que » (interrogation indirecte), il accepte le futur et le conditionnel : *No sé si vendrá. Me preguntó si iría.*

## Les autres façons d’exprimer l’hypothèse
| Tournure | Mode | Exemple |
| de + infinitif | — | *De haberlo sabido, habría venido.* (si j’avais su) |
| como + subjonctif (menace) | subjonctif | *Como no estudies, suspenderás.* (si tu ne travailles pas…) |
| en caso de que | subjonctif | *En caso de que llueva, lo aplazamos.* |
| por si (acaso) | indicatif | *Llévate el paraguas por si llueve.* (au cas où) |
| gérondif | — | *Estudiando así, aprobarás.* |

## Comme si
**Como si** + imparfait ou plus-que-parfait du subjonctif : *Me miró como si no me conociera. Habla como si hubiera vivido allí.*

## Exemple travaillé
Traduis « Si j’avais eu de l’argent, j’aurais fait le tour de l’Amérique latine ; et si j’en avais maintenant, je partirais demain. »
1. Irréel du passé : *Si hubiera tenido dinero, habría dado la vuelta a América Latina.*
2. Irréel du présent : *y si lo tuviera ahora, me iría mañana.*`,
          },
          questions: [
            ['Complète : *Si ___ tiempo, viajaría.*', ['tendría', 'tenga', 'tuviera', 'tengo'], 2, 'Irréel du présent : imparfait du subjonctif + conditionnel.', 'Quel temps après si pour l’irréel du présent ?'],
            ['Quelle phrase exprime l’irréel du passé ?', ['Si hubiera sabido, habría venido', 'Si sabía, venía', 'Si sabré, vendré', 'Si supiera, vendría'], 0, 'Plus-que-parfait du subjonctif + conditionnel passé.'],
            ['*Si llueve, me quedo* exprime…', ['Un irréel du passé', 'Un irréel du présent', 'Un regret', 'Une hypothèse réalisable'], 3, '*Si* + présent de l’indicatif.'],
            ['Quelle phrase est fautive ?', ['Si llueve, me quedaré', 'Si tendría dinero, viajaría', 'Si tuviera dinero, viajaría', 'No sé si vendrá'], 1, 'Jamais de conditionnel après *si* hypothétique.'],
            ['Pourquoi *No sé si vendrá* est-il correct ?', ['Parce que *si* signifie ici « est-ce que »', 'Parce que *vendrá* est un subjonctif', 'Parce que la phrase est négative', 'C’est une exception régionale'], 0, 'Dans l’interrogation indirecte, *si* accepte le futur.'],
            ['Que signifie *De haberlo sabido, habría venido* ?', ['Pour l’avoir su, je suis venu', 'Si je l’avais su, je serais venu', 'Depuis que je le sais, je viens', 'Sachant cela, je viendrai'], 1, '*De* + infinitif passé = hypothèse irréelle du passé.'],
            ['*Como no estudies, suspenderás* exprime…', ['Une cause', 'Une comparaison', 'Une menace, une condition', 'Un souhait'], 2, '*Como* + subjonctif = si (menace).'],
            ['*Llévate el paraguas por si ___.* Quel mot complète la phrase ?', ['llueva', 'lloviera', 'lloverá', 'llueve'], 3, '*Por si* (au cas où) se construit avec l’indicatif.', 'Quel mode après por si ?'],
            ['*Si hubiera estudiado, ahora estaría tranquilo* mélange deux époques.', ['Vrai', 'Faux'], 0, 'Condition passée, résultat présent.'],
            ['Complète : *Me miró como si no me ___.*', ['conoce', 'conociera', 'conozca', 'conocería'], 1, '*Como si* + imparfait du subjonctif.', 'Quel temps après como si ?'],
            ['Quelle tournure signifie « au cas où » et exige le subjonctif ?', ['por si', 'como si', 'en caso de que', 'si no'], 2, '*En caso de que llueva, lo aplazamos.*'],
            ['Dans l’irréel du passé, la principale peut aussi être au plus-que-parfait du subjonctif : *Si hubiera sabido, hubiera venido*.', ['Vrai', 'Faux'], 0, 'Les deux formes, *habría venido* et *hubiera venido*, sont admises.'],
          ],
        },
        {
          titre: 'La concession et l’opposition',
          axe: 'La phrase',
          lecon: {
            titre: 'Aunque, a pesar de, por mucho que, sin embargo',
            cours: `Reconnaître un argument avant de le dépasser : c’est le geste le plus efficace d’une argumentation. L’espagnol a pour cela des outils précis, et un choix de mode qui change le sens.

## Aunque : indicatif ou subjonctif ?
| Aunque + … | Sens | Exemple |
| indicatif | fait **réel**, reconnu | *Aunque llueve, salgo.* (il pleut, je sors quand même) |
| subjonctif présent | fait **possible** ou non pertinent | *Aunque llueva, saldré.* (même s’il pleut) |
| imparfait du subjonctif | fait **irréel** | *Aunque tuviera dinero, no lo compraría.* (même si j’avais de l’argent) |

> *Aunque* + indicatif = « bien que » d’un fait réel ; *aunque* + subjonctif = « même si ». Le français fait l’inverse avec « bien que » + subjonctif : attention au calque.

## Les autres outils de la concession
| Tournure | Construction | Exemple |
| a pesar de + nom / infinitif | — | *A pesar del frío, salimos. A pesar de estar cansado, siguió.* |
| a pesar de que | indicatif ou subjonctif (comme *aunque*) | *A pesar de que era tarde, llamó.* |
| por mucho que, por más que | verbe + subjonctif (ou indicatif si fait réel) | *Por mucho que insistas, no iré.* |
| por muy + adjectif + que | subjonctif | *Por muy difícil que sea, lo intentaré.* |
| si bien | indicatif, registre soutenu | *Si bien es cierto…* |
| aun + gérondif | — | *Aun sabiéndolo, no dijo nada.* |

## L’opposition
| Connecteur | Sens | Exemple |
| sin embargo, no obstante | cependant | *Es caro; sin embargo, lo compro.* |
| en cambio | en revanche | *Yo soy tímido; mi hermana, en cambio, habla con todos.* |
| mientras que | alors que | *Unos ganan mucho, mientras que otros no tienen nada.* |
| pero / sino | mais | *No es rojo, sino azul.* (*sino* après une négation, pour rectifier) |

!> *Sin embargo* ne signifie pas « sans embargo » : c’est « cependant ». Et *sino* ne s’emploie qu’après une négation.

## Exemple travaillé
Relie en concédant : « Le tourisme crée des emplois. Il détruit les côtes. »
1. Fait réel reconnu : *Aunque el turismo crea empleo, destruye las costas.*
2. Registre soutenu : *Si bien el turismo crea empleo, no es menos cierto que destruye las costas.*
3. Insistance : *Por mucho empleo que cree, el turismo destruye las costas.*`,
          },
          questions: [
            ['*Aunque llueve, salgo* signifie…', ['Même s’il pleuvait, je sortirais', 'Il pleut, mais je sors quand même', 'S’il pleut, je ne sors pas', 'Même s’il pleut demain, je sortirai'], 1, '*Aunque* + indicatif : fait réel, reconnu.'],
            ['*Aunque llueva, saldré* signifie…', ['Même s’il pleut, je sortirai', 'Il pleut et je sors', 'Il a plu, je suis sorti', 'Parce qu’il pleut, je sortirai'], 0, '*Aunque* + subjonctif : fait possible, « même si ».'],
            ['Complète : *Por muy difícil que ___, lo intentaré.*', ['es', 'será', 'sería', 'sea'], 3, '*Por muy* + adjectif + *que* + subjonctif.', 'Quel mode après por muy… que ?'],
            ['Comment dit-on « malgré le froid » ?', ['a pesar el frío', 'aunque el frío', 'a pesar del frío', 'sin embargo el frío'], 2, '*A pesar de* + nom ; *de + el = del*.'],
            ['Que signifie *sin embargo* ?', ['Cependant', 'Sans obstacle', 'Sans doute', 'C’est pourquoi'], 0, 'Connecteur d’opposition.'],
            ['Quel connecteur signifie « en revanche » ?', ['sino', 'en cambio', 'aunque', 'por eso'], 1, '*Mi hermana, en cambio, habla con todos.*'],
            ['Complète : *No es rojo, ___ azul.*', ['pero', 'sin embargo', 'aunque', 'sino'], 3, '*Sino* rectifie après une négation.', 'Quel mot pour rectifier après une négation ?'],
            ['*Aunque tuviera dinero, no lo compraría* exprime…', ['Un fait réel', 'Une cause', 'Une hypothèse irréelle', 'Un ordre'], 2, 'Imparfait du subjonctif : même si j’avais (ce qui n’est pas le cas).'],
            ['*Por mucho que insistas, no iré* : le subjonctif est correct.', ['Vrai', 'Faux'], 0, '*Por mucho que* + subjonctif = « tu auras beau insister ».'],
            ['*Aun sabiéndolo, no dijo nada* signifie…', ['Tout en le sachant / même en le sachant, il n’a rien dit', 'Parce qu’il le savait, il n’a rien dit', 'Il ne le savait pas encore', 'Dès qu’il l’a su, il a parlé'], 0, '*Aun* + gérondif exprime la concession.'],
            ['Quel connecteur signifie « alors que » (opposition) ?', ['ya que', 'mientras que', 'para que', 'así que'], 1, '*Unos ganan mucho, mientras que otros no tienen nada.*'],
            ['On peut employer *sino* sans négation dans la première partie.', ['Vrai', 'Faux'], 1, '*Sino* s’emploie seulement après une négation ; sinon, on dit *pero*.'],
          ],
        },
        {
          titre: 'Exprimer le but et la condition',
          axe: 'La phrase',
          lecon: {
            titre: 'Para que, a fin de que, con tal de que, a no ser que',
            cours: `Le but et la condition ont un point commun : ils parlent de ce qui n’est pas encore réel. C’est pourquoi, en espagnol, ils appellent presque toujours le **subjonctif**.

## Le but
| Tournure | Quand | Exemple |
| para + infinitif | même sujet | *Estudio para aprobar.* |
| para que + subjonctif | sujets différents | *Te lo explico para que lo entiendas.* |
| a fin de (que), con el fin de (que) | registre soutenu | *Se tomaron medidas a fin de que no se repitiera.* |
| con el objetivo de, con vistas a | but plus lointain | *Con el objetivo de reducir la contaminación…* |
| de modo que, de manera que + subjonctif | de sorte que (but) | *Habla despacio de modo que te entiendan.* |
| a + infinitif (après un verbe de mouvement) | but d’un déplacement | *Vine a verte.* |

> Même sujet → infinitif ; sujets différents → *que* + subjonctif. *Para que* n’est jamais suivi de l’indicatif.

!> Erreur classique : *Lo digo para que lo sabes*. Il faut *para que lo sepas*.

## La condition
| Tournure | Sens | Exemple |
| con tal de que, siempre que, siempre y cuando | pourvu que, à condition que | *Te lo presto con tal de que me lo devuelvas.* |
| a condición de que | à condition que | *Iré a condición de que vengas tú.* |
| a no ser que, a menos que | à moins que | *Saldremos, a no ser que llueva.* |
| en caso de que | au cas où | *En caso de que no puedas, avísame.* |
| sin que | sans que | *Salió sin que nadie lo viera.* |

Toutes ces conjonctions exigent le **subjonctif**, et suivent la concordance : *Me lo prestó con tal de que se lo devolviera.*

## Siempre que : deux sens
- *Siempre que* + **indicatif** = chaque fois que : *Siempre que viene, trae flores.*
- *Siempre que* + **subjonctif** = à condition que : *Puedes salir siempre que vuelvas pronto.*

## Exemple travaillé
Traduis « Le gouvernement a lancé un plan pour que les jeunes trouvent un logement, à condition qu’ils aient moins de trente ans. »
1. But, sujets différents, principale au passé : *para que los jóvenes encontraran vivienda*.
2. Condition, concordance : *siempre que tuvieran menos de treinta años*.
→ *El Gobierno lanzó un plan para que los jóvenes encontraran vivienda, siempre que tuvieran menos de treinta años.*`,
          },
          questions: [
            ['Complète : *Te lo explico para que lo ___.*', ['entiendes', 'entiendas', 'entender', 'entenderás'], 1, '*Para que* + subjonctif, toujours.', 'Quel mode après para que ?'],
            ['*Estudio para aprobar* : pourquoi l’infinitif ?', ['Le sujet est le même', 'C’est un ordre', 'C’est une condition', 'L’action est passée'], 0, 'Même sujet : *para* + infinitif.'],
            ['Que signifie *a no ser que* ?', ['À condition que', 'Pour que', 'À moins que', 'Bien que'], 2, '*Saldremos, a no ser que llueva.*'],
            ['*Siempre que viene, trae flores* signifie…', ['À condition qu’il vienne, il apporte des fleurs', 'Il ne vient jamais sans fleurs', 'Il viendra toujours avec des fleurs', 'Chaque fois qu’il vient, il apporte des fleurs'], 3, '*Siempre que* + indicatif = chaque fois que.'],
            ['*Puedes salir siempre que vuelvas pronto* signifie…', ['Tu peux sortir à condition de rentrer tôt', 'Tu sors chaque fois que tu rentres tôt', 'Tu es toujours sorti tôt', 'Tu dois rentrer tôt car tu sors'], 0, '*Siempre que* + subjonctif = à condition que.'],
            ['Complète : *Salió sin que nadie lo ___.*', ['vio', 've', 'viera', 'vería'], 2, '*Sin que* + subjonctif, ici à l’imparfait par concordance.', 'Quel temps après sin que dans un récit au passé ?'],
            ['Mets au passé : *Me lo presta con tal de que se lo devuelva.*', ['Me lo prestó con tal de que se lo devuelva', 'Me lo prestó con tal de que se lo devolviera', 'Me lo prestó con tal de que se lo devolvía', 'Me lo prestó con tal de que se lo devolvería'], 1, 'Concordance : imparfait du subjonctif.'],
            ['Quelle tournure de but appartient au registre soutenu ?', ['para', 'a', 'a fin de que', 'por'], 2, '*Se tomaron medidas a fin de que no se repitiera.*'],
            ['*Lo digo para que lo sabes* est correct.', ['Vrai', 'Faux'], 1, 'Il faut le subjonctif : *para que lo sepas*.'],
            ['Que signifie *Vine a verte* ?', ['Je suis venu te voir', 'Je viens de te voir', 'Je te verrai venir', 'Je t’ai vu venir'], 0, 'Après un verbe de mouvement, le but s’exprime avec *a* + infinitif.'],
            ['Quelle conjonction signifie « au cas où » et exige le subjonctif ?', ['por si', 'siempre que', 'sin que', 'en caso de que'], 3, '*En caso de que no puedas, avísame.*'],
            ['*Con tal de que* exige le subjonctif.', ['Vrai', 'Faux'], 0, 'Comme toutes les conjonctions de condition : *con tal de que me lo devuelvas*.'],
          ],
        },
        {
          titre: 'Le discours rapporté',
          axe: 'La phrase',
          lecon: {
            titre: 'Du style direct au style indirect',
            cours: `Rapporter les paroles de quelqu’un — dans un résumé de document, une synthèse ou un récit — oblige à tout transposer : les personnes, les temps, les repères de lieu et de moment. C’est un exercice classique de compréhension écrite et de restitution orale.

## Les verbes introducteurs
*decir, afirmar, explicar, contar, preguntar, responder, añadir, asegurar, reconocer, pedir, ordenar, aconsejar.* Varie-les : *dijo que… dijo que…* appauvrit une restitution.

## Quand le verbe introducteur est au présent
Les temps ne changent pas ; seules les personnes bougent : *«Estoy cansado»* → *Dice que está cansado.*

## Quand le verbe introducteur est au passé : les temps reculent
| Style direct | Style indirect |
| présent : *«Tengo hambre»* | imparfait : *Dijo que tenía hambre.* |
| passé composé / passé simple : *«He terminado» / «Terminé»* | plus-que-parfait : *Dijo que había terminado.* |
| futur : *«Vendré»* | conditionnel : *Dijo que vendría.* |
| imparfait : *«Vivía allí»* | imparfait (inchangé) : *Dijo que vivía allí.* |
| conditionnel : *«Me gustaría»* | conditionnel (inchangé) |

## L’ordre devient subjonctif
Un impératif rapporté devient **que + subjonctif**, avec la concordance :
*«Ven»* → *Me pide que vaya* / *Me pidió que fuera.*
*«No gritéis»* → *Nos dijo que no gritáramos.*

!> *Me dijo de venir* est un calque du français : on dit *Me dijo que viniera.*

## Les questions rapportées
- Question totale : **si** + indicatif. *«¿Vienes?»* → *Me preguntó si iba.*
- Question partielle : l’interrogatif **garde son accent**. *«¿Dónde vives?»* → *Me preguntó dónde vivía.*

## Les repères de lieu et de temps
| Direct | Indirect (au passé) |
| hoy | aquel día, ese día |
| ayer | el día anterior |
| mañana | al día siguiente |
| ahora | entonces, en aquel momento |
| aquí | allí |
| este, esta | aquel, aquella |
| venir, traer | ir, llevar (souvent) |

## Exemple travaillé
Rapporte : *La alcaldesa declaró: «Mañana cerraremos esta calle al tráfico. ¿Queréis una ciudad sin coches? Participad en la consulta.»*
1. Futur → conditionnel ; *mañana* → *al día siguiente* ; *esta* → *aquella*.
2. Question totale → *si* ; *queréis* → *querían*.
3. Impératif → *que* + imparfait du subjonctif.
→ *La alcaldesa declaró que al día siguiente cerrarían aquella calle al tráfico; preguntó a los vecinos si querían una ciudad sin coches y les pidió que participaran en la consulta.*`,
          },
          questions: [
            ['Rapporte au passé : *«Tengo hambre»*.', ['Dijo que tiene hambre', 'Dijo que tenía hambre', 'Dijo que tendrá hambre', 'Dijo que tuviera hambre'], 1, 'Présent → imparfait quand le verbe introducteur est au passé.'],
            ['Rapporte au passé : *«Vendré»*.', ['Dijo que vendrá', 'Dijo que viene', 'Dijo que vendría', 'Dijo que viniera'], 2, 'Futur → conditionnel.'],
            ['Rapporte au passé : *«Ven»*.', ['Me pidió que fuera', 'Me pidió de ir', 'Me pidió que ven', 'Me pidió que iba'], 0, 'L’impératif devient *que* + subjonctif, à l’imparfait par concordance ; *venir* devient souvent *ir*.'],
            ['Que devient *mañana* dans un discours rapporté au passé ?', ['el día anterior', 'aquel día', 'entonces', 'al día siguiente'], 3, '*Ayer* devient *el día anterior*, *hoy* devient *aquel día*.'],
            ['Rapporte : *«¿Dónde vives?»* (au passé).', ['Me preguntó donde vivía', 'Me preguntó dónde vivía', 'Me preguntó que dónde vives', 'Me preguntó si dónde vivía'], 1, 'L’interrogatif garde son accent, même sans point d’interrogation.'],
            ['Comment rapporter une question totale (*«¿Vienes?»*) ?', ['Avec *que* + subjonctif', 'Avec *cuál*', 'Avec *si* + indicatif', 'Avec *qué*'], 2, '*Me preguntó si iba.*'],
            ['Rapporte au passé : *«He terminado»*.', ['Dijo que había terminado', 'Dijo que ha terminado', 'Dijo que terminara', 'Dijo que terminaría'], 0, 'Passé composé → plus-que-parfait.'],
            ['*Me dijo de venir* est correct en espagnol.', ['Vrai', 'Faux'], 1, 'Calque du français : *Me dijo que viniera*.'],
            ['Si le verbe introducteur est au présent, les temps…', ['Reculent tous d’un cran', 'Passent au subjonctif', 'Passent au futur', 'Ne changent pas'], 3, '*Dice que está cansado.*'],
            ['Que devient *aquí* au style indirect passé ?', ['allí', 'aquí mismo', 'acá', 'ahí dentro'], 0, 'Le repère de lieu s’éloigne : *aquí* → *allí*.'],
            ['Rapporte au passé : *«No gritéis»*.', ['Nos dijo que no gritemos', 'Nos dijo que no gritáramos', 'Nos dijo de no gritar', 'Nos dijo que no gritábamos'], 1, 'Défense rapportée : *que no* + imparfait du subjonctif.'],
            ['L’imparfait du style direct reste à l’imparfait au style indirect.', ['Vrai', 'Faux'], 0, '*«Vivía allí»* → *Dijo que vivía allí*.'],
          ],
        },
        {
          titre: 'La mise en relief',
          axe: 'La phrase',
          lecon: {
            titre: 'C’est… qui, c’est… que : insister en espagnol',
            cours: `« C’est Marie qui a gagné », « c’est ici que je suis né » : le français a une seule tournure, l’espagnol en a plusieurs, et elles s’accordent. C’est une marque de niveau B2 à l’écrit comme à l’oral.

## La structure de base
**Ser + élément mis en relief + relatif adapté** :
| Élément mis en relief | Relatif | Exemple |
| une personne | quien, quienes, el que, la que, los que | *Fue María quien ganó.* |
| une chose | el que, la que, lo que | *Es este libro el que quiero.* |
| une idée neutre | lo que | *Es la verdad lo que importa.* |
| un lieu | donde | *Es aquí donde nací.* |
| un moment | cuando | *Fue en 1492 cuando llegó Colón.* |
| une manière | como | *Es así como se hace.* |
| une cause | por lo que, por eso | *Es por eso por lo que no vine.* |

!> Le calque *Es aquí que nací* est une faute : il faut *Es aquí **donde** nací.*

## Les deux accords
1. **Ser s’accorde en personne et en nombre** avec l’élément mis en relief : *Soy yo quien lo dice. Fueron ellos quienes llamaron.*
2. **Ser se met au temps de l’action** : *Fue ayer cuando lo vi* (passé), *Será mañana cuando lo sepamos* (futur).

## L’ordre peut s’inverser
*Quien ganó fue María. Lo que quiero es descansar. Donde nací es aquí.* Cette tournure, très fréquente, met en valeur ce qui vient après *ser*.

## Les autres moyens d’insister
| Tournure | Exemple | Sens |
| lo + adjectif / adverbe + que | *No sabes lo difícil que es.* | à quel point c’est difficile |
| lo que pasa es que / es que | *Es que no tengo tiempo.* | c’est que, en fait |
| el caso es que | *El caso es que nadie lo sabía.* | toujours est-il que |
| sí que | *Esto sí que es importante.* | ça, c’est vraiment important |
| mismo, misma | *Hoy mismo. Él mismo lo dijo.* | aujourd’hui même, lui-même |

Dans *lo + adjectif + que*, l’adjectif **s’accorde** avec le nom : *No imaginas lo cansadas que estaban.*

## Exemple travaillé
Mets en relief chaque élément de *Picasso pintó el Guernica en París en 1937* :
1. La personne : *Fue Picasso quien pintó el Guernica en París.*
2. Le lieu : *Fue en París donde Picasso pintó el Guernica.*
3. Le moment : *Fue en 1937 cuando Picasso pintó el Guernica.*
4. L’œuvre : *Fue el Guernica el que Picasso pintó en 1937.*`,
          },
          questions: [
            ['Comment traduire « C’est ici que je suis né » ?', ['Es aquí que nací', 'Es aquí donde nací', 'Es aquí cuando nací', 'Está aquí donde nací'], 1, 'Pour un lieu, le relatif est *donde*.'],
            ['Comment traduire « C’est en 1492 que Colomb est arrivé » ?', ['Es en 1492 que llegó Colón', 'Fue en 1492 donde llegó Colón', 'Fue en 1492 cuando llegó Colón', 'Era 1492 que llegó Colón'], 2, 'Moment → *cuando* ; *ser* au temps de l’action.'],
            ['Complète : *___ yo quien lo dice.*', ['Soy', 'Es', 'Está', 'Fue'], 0, '*Ser* s’accorde en personne avec l’élément mis en relief.', 'Quelle forme de ser devant yo quien ?'],
            ['Complète : *Fueron ellos ___ llamaron.*', ['que', 'cual', 'quien', 'quienes'], 3, 'Personne au pluriel → *quienes* (ou *los que*).', 'Quel relatif pour une personne au pluriel ?'],
            ['Que signifie *No sabes lo difícil que es* ?', ['Tu ne sais pas ce qui est difficile', 'Tu ne sais pas à quel point c’est difficile', 'Ce n’est pas difficile, tu sais', 'Tu ne sais pas que c’est difficile'], 1, '*Lo* + adjectif + *que* exprime l’intensité.'],
            ['Complète : *No imaginas lo ___ que estaban ellas.*', ['cansado', 'cansados', 'cansadas', 'cansada'], 2, 'L’adjectif s’accorde avec le nom : *ellas → cansadas*.', 'Quel accord de l’adjectif après lo ?'],
            ['*Lo que quiero es descansar* met en relief…', ['Descansar', 'Quiero', 'Lo', 'Rien'], 0, 'L’ordre inversé met en valeur ce qui suit *ser*.'],
            ['Quel relatif s’emploie pour mettre en relief une manière ?', ['donde', 'cuando', 'quien', 'como'], 3, '*Es así como se hace.*'],
            ['Dans la mise en relief, *ser* se met au temps de l’action.', ['Vrai', 'Faux'], 0, '*Fue ayer cuando lo vi.*'],
            ['Que signifie *El caso es que nadie lo sabía* ?', ['Le cas est que personne ne le savait', 'Toujours est-il que personne ne le savait', 'Dans ce cas, personne ne le savait', 'Il se peut que personne ne le sache'], 1, 'Formule d’insistance de l’oral et de l’écrit.'],
            ['Que signifie *Esto sí que es importante* ?', ['Ceci est-il important ?', 'Si c’est important', 'Ça, c’est vraiment important', 'C’est aussi important'], 2, '*Sí que* renforce l’affirmation.'],
            ['*Es aquí que nací* est une phrase correcte.', ['Vrai', 'Faux'], 1, 'Calque du français : il faut *Es aquí donde nací*.'],
          ],
        },
      ],
    },
  ],
}
