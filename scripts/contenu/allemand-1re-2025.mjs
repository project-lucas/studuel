// Allemand 1re — ce qui est PROPRE à la Première, en plus des 36 fiches de langue.
//
// CONSTAT (extraction du 26/09/2026) : la 3e, la 2de, la 1re et la Tle avaient
// EXACTEMENT les mêmes 36 fiches de grammaire. Rien sur les axes culturels de
// la Première.
//
// LE PROGRAMME : arrêté du 5 mai 2025, BO n° 22 du 29 mai 2025, en vigueur en
// Première à la rentrée 2026 (article 4). Six axes, dont le sixième propre à
// l'aire germanophone (« L'Allemagne dans le monde ») ; cinq doivent être
// traités, l'axe 6 obligatoirement. Niveau visé B1 (LVB), B1+ (LVA).
// Les six fiches de langue suivent les « Repères linguistiques » B1/B1+ du même
// programme et prennent ce que les 36 fiches ne font qu'effleurer : le
// plus-que-parfait et l'antériorité, la rection casuelle, le sens des
// préverbes, la concomitance, les connecteurs de l'argumentation, les modaux
// qui modalisent.
//
// Deux blocs : rayon 'culture' (37 → 42), rayon 'langue' (43 → 48).
// Convention de la maison : la langue s'interroge EN FRANÇAIS.

export default {
  slug: 'allemand',
  nom: 'Allemand',

  titreMigration: 'ALLEMAND 1re — AXES CULTURELS ET LANGUE B1+ (programme 2025)',

  motif: `CONSTAT : la 1re d'allemand portait exactement les mêmes 36 fiches de
grammaire que la 3e, la 2de et la Tle. Le programme de Première (arrêté du 5 mai
2025, BO n° 22 du 29 mai 2025, en vigueur à la rentrée 2026) fixe six axes
culturels, dont « L'Allemagne dans le monde », propre à l'aire germanophone et
obligatoire, et des repères de langue B1/B1+. Cette migration AJOUTE 12 fiches
propres à la 1re — une par axe, et six fiches de langue — derrière les 36
fiches, sans rien retirer.`,

  blocs: [
    // =====================================================================
    // RAYON CULTURE — les six axes de la Première
    // =====================================================================
    {
      niveaux: ['1re'],
      positionDepart: 37,
      rayon: 'culture',
      chapitres: [
        {
          titre: 'Fleuves, accueil, argent : un espace d’échanges',
          axe: 'Identités et échanges',
          lecon: {
            titre: 'Le monde germanophone, carrefour pluriel',
            cours: `Au cœur de l’espace Schengen, l’Allemagne et ses voisins germanophones sont traversés par les échanges : des marchandises sur les fleuves, des hommes qui arrivent, de l’argent qui circule. Chaque échange a transformé leur identité.

## Les fleuves, routes de l’Europe
| Fleuve | Ce qu’il relie |
| *der Rhein* (≈ 1 230 km) | des Alpes suisses à la mer du Nord ; frontière franco-allemande, le fleuve le plus fréquenté d’Europe |
| *die Donau* (≈ 2 850 km) | de la Forêt-Noire à la mer Noire, à travers dix pays et quatre capitales (Vienne, Bratislava, Budapest, Belgrade) |
| *die Elbe* | la Tchéquie à la mer du Nord, par Dresde et le port de Hambourg |
| *die Oder* | frontière germano-polonaise depuis 1945, reconnue définitivement en 1990 |

Longtemps frontières et champs de bataille, ces fleuves sont devenus des axes de coopération : le pont de l’Europe relie Strasbourg à Kehl, et une piste cyclable longe le Danube de bout en bout.

## Willkommenskultur : l’Allemagne, terre d’accueil ?
En 2015, plus d’un million de réfugiés arrivent. Des bénévoles les accueillent dans les gares : on parle de *Willkommenskultur* (culture de l’accueil). La chancelière Angela Merkel déclare « *Wir schaffen das* ». Le pays a aussi connu la méfiance et la montée d’un parti hostile à l’immigration. Intégrer, c’est aujourd’hui un défi quotidien : langue, école, travail.

## La gastronomie, reflet des échanges
La *Currywurst*, inventée à Berlin en 1949 avec le ketchup et le curry des soldats alliés, le *Döner* popularisé par des immigrés turcs, la pizza et les pâtes des *Gastarbeiter* italiens : ce que mangent les Allemands raconte leur histoire.

## L’argent, simple monnaie d’échange ?
| Repère | Ce qu’il dit |
| La *Fuggerei* d’Augsbourg (1521) | la plus ancienne cité sociale encore habitée, fondée par le banquier Jakob Fugger |
| Le *Deutsche Mark* (1948) | symbole du miracle économique et de la stabilité |
| L’euro (2002) | la Banque centrale européenne siège à Francfort |
| « *Nur Bares ist Wahres* » | seul le liquide est vrai : les Allemands restent attachés aux espèces et à l’épargne |

> Un échange ne laisse jamais intact : il change aussi celui qui accueille.

## Vocabulaire
| Allemand | Français |
| *der Austausch* | l’échange |
| *die Aufnahme* | l’accueil |
| *die Integration* | l’intégration |
| *der Fluss, das Ufer* | le fleuve, la rive |
| *das Geld, sparen* | l’argent, épargner |
| *die Vielfalt* | la diversité |
| *prägen* | marquer, façonner |`,
          },
          questions: [
            ['Combien de pays le Danube traverse-t-il ou longe-t-il ?', ['Quatre', 'Sept', 'Dix', 'Quinze'], 2, 'Dix pays et quatre capitales : Vienne, Bratislava, Budapest, Belgrade.'],
            ['Quel fleuve marque la frontière entre l’Allemagne et la Pologne ?', ['Le Rhin', 'L’Oder', 'L’Elbe', 'Le Main'], 1, 'La ligne Oder-Neisse, frontière depuis 1945, reconnue définitivement en 1990.'],
            ['Que désigne la « Willkommenskultur » ?', ['Une fête de bienvenue scolaire', 'La culture de l’accueil des réfugiés en 2015', 'Une tradition de Noël', 'Un programme touristique'], 1, 'Des milliers de bénévoles ont accueilli les réfugiés arrivés en 2015.'],
            ['Où et quand serait née la Currywurst ?', ['À Munich en 1810', 'À Berlin en 1949', 'À Hambourg en 1900', 'À Vienne en 1955'], 1, 'Selon la tradition, Herta Heuwer l’a créée à Berlin avec des produits des soldats alliés.'],
            ['Qu’est-ce que la Fuggerei ?', ['Une banque en ligne', 'La plus ancienne cité sociale encore habitée', 'Un marché de Noël', 'Un château sur le Rhin'], 1, 'Fondée en 1521 à Augsbourg par Jakob Fugger, elle loge des habitants pour un loyer symbolique.'],
            ['Où siège la Banque centrale européenne ?', ['Berlin', 'Bruxelles', 'Francfort', 'Luxembourg'], 2, 'La BCE (*EZB*) est installée à Francfort-sur-le-Main.'],
            ['« Nur Bares ist Wahres » exprime…', ['l’attachement à l’argent liquide', 'le rejet de l’argent', 'la passion du troc', 'la confiance dans les banques en ligne'], 0, 'Mot à mot : seul le liquide est vrai.'],
            ['Le Deutsche Mark a été introduit en…', ['1871', '1948', '1990', '2002'], 1, 'La réforme monétaire de 1948 lance le miracle économique ouest-allemand.'],
            ['Que signifie « prägen » ?', ['Payer', 'Marquer, façonner', 'Prier', 'Traverser'], 1, '*Die Migration hat die Stadt geprägt* : la migration a façonné la ville.'],
            ['Le Rhin prend sa source dans les Alpes suisses.', ['Vrai', 'Faux'], 0, 'Il naît en Suisse et se jette dans la mer du Nord aux Pays-Bas.'],
            ['Que signifie « die Aufnahme » dans le contexte des réfugiés ?', ['L’enregistrement vidéo', 'L’accueil', 'Le départ', 'Le refus'], 1, '*Aufnahme* a plusieurs sens ; ici, c’est l’accueil.'],
            ['Quel pont symbolise la coopération franco-allemande sur le Rhin ?', ['Le pont de l’Europe entre Strasbourg et Kehl', 'Le pont de Remagen', 'Le pont Charles', 'L’Oberbaumbrücke'], 0, 'Il relie Strasbourg et Kehl, deux villes autrefois séparées par la frontière.'],
          ],
        },

        {
          titre: 'Vivre ensemble à l’allemande : Zusammenleben et inclusion',
          axe: 'Diversité et inclusion',
          lecon: {
            titre: 'Tolérance, solidarité, droits : l’art de vivre ensemble',
            cours: `*Das Zusammenleben*, le « vivre ensemble », est un mot que les Allemands emploient volontiers. Héritier des Lumières, il suppose la tolérance, l’accueil des différences et la solidarité.

## Un héritage des Lumières
En 1779, **Gotthold Ephraim Lessing** publie *Nathan le Sage*. Dans la « parabole des trois anneaux », un père lègue trois bagues identiques à ses trois fils : impossible de dire laquelle est la vraie, comme il est impossible de dire quelle religion (judaïsme, christianisme, islam) est la seule vraie. Chacun doit prouver la valeur de la sienne par sa conduite. C’est un texte fondateur de la **tolérance** en Allemagne.

## Les garants de la solidarité
| Garant | Rôle |
| *das Grundgesetz* (1949) | l’article 3 interdit toute discrimination ; depuis 1994 : « *Niemand darf wegen seiner Behinderung benachteiligt werden* » |
| *das Vereinswesen* | plus de 600 000 associations : sport, culture, entraide, pompiers volontaires |
| *der Sozialstaat* | l’État social, inscrit dans la Loi fondamentale |

> Le *Verein* est une école de démocratie : on y élit un bureau, on y vote, on s’y engage pour les autres.

## La place des personnes handicapées
Depuis la ratification de la convention de l’ONU relative aux droits des personnes handicapées (2009), l’Allemagne développe l’**inclusion** (*Inklusion*) : scolariser les élèves handicapés dans les classes ordinaires plutôt que dans des écoles spécialisées. Le chemin est encore long, mais les Jeux paralympiques et le sport pour tous ont changé les regards.

## Droits des minorités sexuelles et de genre
| Date | Étape |
| 1919 | Magnus Hirschfeld fonde à Berlin un institut pionnier de sexologie, pillé par les nazis en 1933 |
| 1994 | Suppression définitive du paragraphe 175, qui punissait l’homosexualité |
| 2017 | Mariage pour tous (*Ehe für alle*) |
| 2024 | Loi permettant de changer plus simplement de genre à l’état civil |

Une histoire faite de long combat, de persécutions et d’avancées : l’Allemagne a été à la fois pionnière (Berlin des années 1920) et répressive.

## Vivre autrement
Colocations (*WG*), écovillages, *Bauwagen* (roulottes) : la diversité des modes de vie est aussi une forme de diversité.

## Vocabulaire
| Allemand | Français |
| *das Zusammenleben* | le vivre-ensemble |
| *die Toleranz* | la tolérance |
| *die Behinderung* | le handicap |
| *benachteiligen* | défavoriser, discriminer |
| *die Gleichberechtigung* | l’égalité des droits |
| *sich engagieren* | s’engager |
| *der Verein* | l’association, le club |`,
          },
          questions: [
            ['Quelle œuvre de Lessing est un texte fondateur de la tolérance ?', ['Faust', 'Nathan le Sage', 'Les Brigands', 'Le Tambour'], 1, 'La parabole des trois anneaux y met les trois religions sur un pied d’égalité.'],
            ['Dans la parabole des anneaux, comment prouver la valeur de sa religion ?', ['Par l’ancienneté', 'Par sa conduite', 'Par un miracle', 'Par un vote'], 1, 'Aucun anneau ne se distingue : c’est la conduite de chacun qui compte.'],
            ['Que dit l’article 3 de la Loi fondamentale depuis 1994 ?', ['Que le handicap ne doit désavantager personne', 'Que l’allemand est langue officielle', 'Que l’école est gratuite', 'Que le service militaire est obligatoire'], 0, '« *Niemand darf wegen seiner Behinderung benachteiligt werden.* »'],
            ['Combien d’associations (Vereine) compte-t-on environ en Allemagne ?', ['6 000', '60 000', 'plus de 600 000', '6 millions'], 2, 'Plus de 600 000 : le *Vereinswesen* est un pilier de la société.'],
            ['Que désigne l’« Inklusion » à l’école ?', ['Des écoles réservées aux élèves handicapés', 'La scolarisation des élèves handicapés dans les classes ordinaires', 'Un examen d’entrée', 'L’apprentissage d’une langue étrangère'], 1, 'Elle découle de la convention de l’ONU ratifiée en 2009.'],
            ['En quelle année le mariage pour tous a-t-il été adopté en Allemagne ?', ['2001', '2013', '2017', '2022'], 2, 'La *Ehe für alle* est en vigueur depuis octobre 2017.'],
            ['Le paragraphe 175, qui punissait l’homosexualité, a été définitivement supprimé en 1994.', ['Vrai', 'Faux'], 0, 'Il existait depuis 1871 et avait été durci par les nazis.'],
            ['Qui fonde à Berlin en 1919 un institut pionnier de sexologie ?', ['Sigmund Freud', 'Magnus Hirschfeld', 'Albert Einstein', 'Robert Koch'], 1, 'L’institut de Magnus Hirschfeld a été pillé par les nazis en 1933.'],
            ['Que signifie « benachteiligen » ?', ['Avantager', 'Défavoriser', 'Partager', 'Juger'], 1, '*der Nachteil* = l’inconvénient : *benachteiligen*, désavantager.'],
            ['Comment dit-on « l’égalité des droits » ?', ['die Gleichberechtigung', 'die Gleichgültigkeit', 'die Rechtschreibung', 'die Gleichzeitigkeit'], 0, '*gleich* (égal) + *Berechtigung* (droit). *Gleichgültigkeit* = indifférence.'],
            ['Pourquoi dit-on que le Verein est une école de démocratie ?', ['On y apprend le droit', 'On y élit, on y vote, on s’y engage', 'Il est géré par l’État', 'Il remplace l’école'], 1, 'Assemblée, bureau élu, votes : le club fonctionne comme une petite démocratie.'],
            ['Que désigne « das Zusammenleben » ?', ['La vie en couple uniquement', 'Le vivre-ensemble', 'La vie en ville', 'La vie après la mort'], 1, '*zusammen* (ensemble) + *leben* (vivre).'],
          ],
        },

        {
          titre: 'Artistes face au pouvoir : propagande, exil et cabaret',
          axe: 'Art et pouvoir',
          lecon: {
            titre: 'Servir, fuir ou contester',
            cours: `L’Allemagne a connu au XXe siècle deux dictatures, le IIIe Reich et la RDA. Dans les deux cas, le pouvoir a voulu contrôler l’art — et des artistes ont résisté, par l’exil ou par le rire.

## L’art au service du IIIe Reich
Dès 1933, **Joseph Goebbels**, ministre de la Propagande, crée la Chambre de la culture du Reich (*Reichskulturkammer*) : un artiste qui n’en est pas membre ne peut plus travailler. Les Juifs et les opposants en sont exclus.
| Date | Événement |
| 10 mai 1933 | Autodafés : des étudiants brûlent les livres d’auteurs juifs, pacifistes, communistes |
| 1935 | *Le Triomphe de la volonté*, film de Leni Riefenstahl à la gloire du parti |
| 1937 | Exposition « Art dégénéré » (*Entartete Kunst*) à Munich, qui ridiculise l’art moderne |

Un siècle plus tôt, Heinrich Heine avait écrit : « *Dort, wo man Bücher verbrennt, verbrennt man auch am Ende Menschen.* » (Là où l’on brûle des livres, on finit par brûler des hommes.)

## Les artistes en exil
Des centaines d’écrivains, de musiciens et d’acteurs fuient : **Thomas Mann** part aux États-Unis et parle aux Allemands par la radio de la BBC ; **Bertolt Brecht** passe par le Danemark avant les États-Unis ; **Marlene Dietrich** refuse de revenir tourner pour les nazis. L’exil est souvent pauvreté et solitude, mais il permet de témoigner.

## Le rire contre le pouvoir
Le **cabaret politique** (*das Kabarett*) est une vieille tradition allemande. En janvier 1933, **Erika Mann** ouvre à Munich *Die Pfeffermühle* (le moulin à poivre) qui se moque des nazis, puis doit poursuivre en Suisse. En RDA, le chansonnier **Wolf Biermann**, auteur de la chanson *Ermutigung* (« Encouragement »), est déchu de sa nationalité en 1976 alors qu’il donne un concert à l’Ouest : de nombreux artistes protestent.

## Littérature et politique
Après 1945, des écrivains prennent la parole : **Heinrich Böll** et **Günter Grass**, tous deux prix Nobel, interrogent le passé et la société ouest-allemande.

> L’art peut servir le pouvoir, s’en protéger par l’exil, ou le contester : chaque dictature a produit les trois.

## Vocabulaire
| Allemand | Français |
| *die Macht* | le pouvoir |
| *die Propaganda* | la propagande |
| *die Zensur* | la censure |
| *das Exil, emigrieren* | l’exil, émigrer |
| *die Bücherverbrennung* | l’autodafé |
| *verbieten, verboten* | interdire, interdit |
| *sich widersetzen* + dat. | s’opposer à |`,
          },
          questions: [
            ['Quel ministre nazi contrôlait la culture et la propagande ?', ['Heinrich Himmler', 'Joseph Goebbels', 'Hermann Göring', 'Albert Speer'], 1, 'Goebbels crée dès 1933 la *Reichskulturkammer*.'],
            ['Que s’est-il passé le 10 mai 1933 ?', ['L’incendie du Reichstag', 'Des autodafés de livres', 'L’exposition Art dégénéré', 'La nuit de Cristal'], 1, 'Des étudiants brûlent les livres d’auteurs jugés « non allemands ».'],
            ['Que voulait montrer l’exposition « Entartete Kunst » de 1937 ?', ['La grandeur de l’art moderne', 'Le ridicule supposé de l’art moderne', 'L’art des colonies', 'Les œuvres d’Hitler'], 1, 'Les nazis y exposaient l’art moderne pour le dénigrer.'],
            ['Qui a réalisé le film « Le Triomphe de la volonté » ?', ['Fritz Lang', 'Leni Riefenstahl', 'Marlene Dietrich', 'Bertolt Brecht'], 1, 'Film de propagande de 1935 sur le congrès du parti nazi à Nuremberg.'],
            ['Qui a écrit « Là où l’on brûle des livres, on finit par brûler des hommes » ?', ['Goethe', 'Heinrich Heine', 'Brecht', 'Thomas Mann'], 1, 'Heine l’écrit en 1821, plus d’un siècle avant les autodafés nazis.'],
            ['Comment Thomas Mann s’adressait-il aux Allemands depuis l’exil ?', ['Par des tracts', 'Par la radio de la BBC', 'Par des films', 'Par la télévision'], 1, 'Ses discours « Deutsche Hörer! » étaient diffusés par la BBC.'],
            ['Qu’était « Die Pfeffermühle » ?', ['Un journal nazi', 'Le cabaret antinazi d’Erika Mann', 'Un film de Riefenstahl', 'Une maison d’édition de RDA'], 1, 'Ouvert à Munich en 1933, il a poursuivi en Suisse.'],
            ['Wolf Biermann a été déchu de sa nationalité est-allemande en…', ['1961', '1968', '1976', '1989'], 2, 'En 1976, pendant une tournée à l’Ouest ; de nombreux artistes ont protesté.'],
            ['Que signifie « die Zensur » ?', ['La censure', 'Le recensement', 'Le centre', 'La sentence'], 0, 'Un mot clé pour parler de l’art sous les dictatures.'],
            ['Bertolt Brecht est resté en Allemagne pendant tout le IIIe Reich.', ['Vrai', 'Faux'], 1, 'Il s’exile dès 1933 : Danemark, puis Finlande et États-Unis.'],
            ['Quels écrivains ouest-allemands d’après-guerre ont reçu le prix Nobel ?', ['Böll et Grass', 'Goethe et Schiller', 'Kafka et Rilke', 'Brecht et Mann'], 0, 'Heinrich Böll en 1972, Günter Grass en 1999.'],
            ['« sich der Macht widersetzen » signifie…', ['prendre le pouvoir', 's’opposer au pouvoir', 'servir le pouvoir', 'fuir le pouvoir'], 1, '*sich widersetzen* + datif : résister, s’opposer.'],
          ],
        },

        {
          titre: 'Des inventeurs aux dilemmes : science et responsabilité',
          axe: 'Innovations scientifiques et responsabilité',
          lecon: {
            titre: 'Découvrir, et répondre de ses découvertes',
            cours: `L’imprimerie, les rayons X, l’automobile, le vaccin à ARN messager : les pays germanophones ont beaucoup inventé. Mais une découverte n’est jamais neutre, et la question de la responsabilité du scientifique s’y pose avec force.

## Des inventions qui ont changé le monde
| Qui | Quoi | Quand |
| Johannes **Gutenberg** (Mayence) | l’imprimerie à caractères mobiles | vers 1450 |
| Wilhelm Conrad **Röntgen** | les rayons X, premier prix Nobel de physique (1901) | 1895 |
| Carl **Benz** | l’automobile à moteur (brevet) | 1886 |
| Robert **Koch** | le bacille de la tuberculose | 1882 |
| Albert **Einstein** | la relativité, prix Nobel 1921 | 1905–1915 |
| Özlem **Türeci** et Uğur **Şahin** (BioNTech, Mayence) | un vaccin à ARN messager contre le Covid-19 | 2020 |

## Koch contre Pasteur
Après la guerre de 1870, la rivalité scientifique entre l’Allemand Robert Koch et le Français Louis Pasteur est aussi nationale. Les deux fondent pourtant ensemble la microbiologie moderne : la science avance aussi par la concurrence.

## Les femmes, grandes oubliées ?
**Lise Meitner**, physicienne autrichienne, explique en 1939 avec son neveu Otto Frisch la **fission nucléaire** découverte avec Otto Hahn. Juive, elle avait dû fuir l’Allemagne en 1938. Le prix Nobel de chimie est attribué à Hahn seul. Un élément chimique porte aujourd’hui son nom : le meitnerium.

## La responsabilité du savant
**Fritz Haber** reçoit le prix Nobel pour la synthèse de l’ammoniac, qui permet de fabriquer des engrais et de nourrir des milliards d’hommes. Mais il dirige aussi, en 1915, la première attaque au gaz de combat à Ypres. Un même savoir peut nourrir ou tuer.

> Plus une découverte est puissante, plus la question « à quoi va-t-elle servir ? » devient la responsabilité de tous.

## L’auto, fleuron ou modèle en crise ?
Volkswagen, Mercedes, BMW, Porsche : l’automobile est le cœur de l’industrie allemande. En 2015, le scandale des moteurs diesel truqués (*Dieselgate*) a terni cette image ; la transition vers l’électrique est un défi majeur.

## Vocabulaire
| Allemand | Français |
| *die Erfindung, erfinden* | l’invention, inventer |
| *die Entdeckung, entdecken* | la découverte, découvrir |
| *die Forschung, der Forscher* | la recherche, le chercheur |
| *die Verantwortung* | la responsabilité |
| *der Fortschritt* | le progrès |
| *missbrauchen* | détourner, abuser de |`,
          },
          questions: [
            ['Qui a mis au point l’imprimerie à caractères mobiles vers 1450 ?', ['Röntgen', 'Gutenberg', 'Benz', 'Koch'], 1, 'Johannes Gutenberg, à Mayence.'],
            ['Pour quelle découverte Röntgen a-t-il reçu le premier Nobel de physique ?', ['L’électricité', 'Les rayons X', 'La radioactivité', 'Le téléphone'], 1, 'Découverts en 1895, les rayons X ont révolutionné la médecine.'],
            ['Quel bacille Robert Koch a-t-il identifié en 1882 ?', ['Celui de la rage', 'Celui de la tuberculose', 'Celui de la peste', 'Celui du choléra seulement'], 1, 'On parle encore du « bacille de Koch ».'],
            ['Quel rôle Lise Meitner a-t-elle joué ?', ['Elle a inventé l’automobile', 'Elle a expliqué la fission nucléaire', 'Elle a découvert l’insuline', 'Elle a fondé BioNTech'], 1, 'Avec Otto Frisch, en 1939 ; le Nobel est allé à Otto Hahn seul.'],
            ['Pourquoi Fritz Haber incarne-t-il le dilemme du savant ?', ['Il a refusé le Nobel', 'Ses travaux ont servi aux engrais et aux gaz de combat', 'Il a fui l’Allemagne', 'Il a inventé la bombe atomique'], 1, 'L’ammoniac nourrit le monde ; mais Haber a aussi dirigé l’attaque au gaz d’Ypres en 1915.'],
            ['Qui a cofondé BioNTech et développé un vaccin à ARN messager ?', ['Lise Meitner', 'Özlem Türeci et Uğur Şahin', 'Robert Koch', 'Carl Benz'], 1, 'Le couple de chercheurs de Mayence a mis au point le vaccin en 2020.'],
            ['Carl Benz a déposé le brevet de l’automobile en 1886.', ['Vrai', 'Faux'], 0, 'Sa *Motorwagen* est considérée comme la première automobile.'],
            ['Que désigne le « Dieselgate » de 2015 ?', ['Une grève des usines', 'Le trucage des émissions de moteurs diesel', 'La fin du moteur diesel', 'Une invention de Rudolf Diesel'], 1, 'Volkswagen avait truqué les tests de pollution de ses moteurs.'],
            ['Que signifie « die Verantwortung » ?', ['La réponse', 'La responsabilité', 'La vérité', 'La recherche'], 1, '*verantworten* = répondre de : un mot clé de l’axe.'],
            ['Quelle est la différence entre « erfinden » et « entdecken » ?', ['Aucune', 'erfinden = inventer, entdecken = découvrir', 'erfinden = découvrir, entdecken = inventer', 'entdecken s’emploie seulement pour les pays'], 1, 'On invente une machine ; on découvre ce qui existait déjà (un bacille, un continent).'],
            ['Quel élément chimique porte le nom de Lise Meitner ?', ['Le meitnerium', 'L’einsteinium', 'Le hahnium', 'Le germanium'], 0, 'Un hommage tardif à une scientifique longtemps oubliée.'],
            ['Que signifie « der Fortschritt » ?', ['Le recul', 'Le progrès', 'La marche', 'Le pas de côté'], 1, '*fort* (en avant) + *Schritt* (le pas).'],
          ],
        },

        {
          titre: 'La nature, refuge et combat : du romantisme aux Verts',
          axe: 'L’être humain et la nature',
          lecon: {
            titre: 'Un motif culturel devenu politique',
            cours: `Pour les Allemands, la nature n’est pas seulement un paysage : c’est un refuge, un idéal, une cause. De la forêt romantique au parti des Verts, elle traverse leur histoire.

## Le refuge romantique
Vers 1818, **Caspar David Friedrich** peint *Le Voyageur contemplant une mer de nuages* : un homme de dos, face à l’immensité. Pour les romantiques, la nature est le lieu du sentiment, du mystère, de l’infini. La forêt (*der Wald*) devient un symbole de l’âme allemande.

## Fuir la ville : Wandervogel et Lebensreform
Vers 1900, l’industrialisation fait grandir les villes. Des jeunes fondent le **Wandervogel** (1901) : ils partent randonner, chanter, dormir dehors. Le mouvement de la **Lebensreform** (réforme de la vie) prône une alimentation végétarienne, le grand air, et la **FKK** (*Freikörperkultur*, la culture du corps libre, c’est-à-dire le naturisme), restée très populaire, notamment en RDA.

## La nature dans la ville
| Lieu | Ce que c’est |
| *der Schrebergarten* | jardin ouvrier en location, nommé d’après le médecin Moritz Schreber (premier à Leipzig, 1864) |
| *der Stadtpark* | grand parc urbain, comme le Tiergarten de Berlin |
| *die Datsche* | petite maison de campagne, très répandue en RDA |

## Protéger : une invention allemande ?
En 1713, le forestier saxon **Hans Carl von Carlowitz** invente le mot *Nachhaltigkeit* (durabilité) : ne couper pas plus de bois qu’il n’en repousse. En 1970 naît le premier parc national allemand, la forêt bavaroise (*Nationalpark Bayerischer Wald*). Les zones protégées (*Naturschutzgebiete*) se multiplient.

## La nature, enjeu politique
Dans les années 1980, la peur de la mort des forêts (*das Waldsterben*, causée par les pluies acides) et le mouvement antinucléaire font naître un parti : **die Grünen**, fondé en 1980, entré au Bundestag en 1983. C’est l’un des premiers partis écologistes au monde à peser au niveau national.

> En Allemagne, la nature est passée du tableau au bulletin de vote : du sentiment romantique à l’action politique.

## Vocabulaire
| Allemand | Français |
| *die Natur, die Umwelt* | la nature, l’environnement |
| *der Umweltschutz* | la protection de l’environnement |
| *die Nachhaltigkeit, nachhaltig* | la durabilité, durable |
| *wandern* | randonner |
| *die Landschaft* | le paysage |
| *das Naturschutzgebiet* | la réserve naturelle |`,
          },
          questions: [
            ['Qui a peint « Le Voyageur contemplant une mer de nuages » ?', ['Albrecht Dürer', 'Caspar David Friedrich', 'Egon Schiele', 'Paul Klee'], 1, 'Chef-d’œuvre du romantisme allemand, vers 1818.'],
            ['Qu’était le Wandervogel ?', ['Un oiseau migrateur protégé', 'Un mouvement de jeunesse de randonnée', 'Un parti politique', 'Une réserve naturelle'], 1, 'Fondé en 1901, il invitait les jeunes à fuir la ville pour la nature.'],
            ['Que signifie le sigle FKK ?', ['La culture du corps libre (naturisme)', 'Un club de football', 'Une fédération de randonnée', 'La réforme des forêts'], 0, '*Freikörperkultur* : un mouvement né vers 1900, populaire en RDA.'],
            ['D’où vient le nom « Schrebergarten » ?', ['D’un roi de Saxe', 'Du médecin Moritz Schreber', 'D’une ville de Bavière', 'D’un poète romantique'], 1, 'Le premier jardin de ce type a été créé à Leipzig en 1864.'],
            ['Qui a forgé le mot « Nachhaltigkeit » en 1713 ?', ['Goethe', 'Hans Carl von Carlowitz', 'Alexander von Humboldt', 'Caspar David Friedrich'], 1, 'Un forestier saxon : ne pas couper plus de bois qu’il n’en repousse.'],
            ['Quel est le premier parc national allemand (1970) ?', ['La Forêt-Noire', 'La forêt bavaroise', 'La Suisse saxonne', 'Le Harz'], 1, 'Le *Nationalpark Bayerischer Wald*.'],
            ['En quelle année le parti des Verts (die Grünen) a-t-il été fondé ?', ['1968', '1980', '1990', '2000'], 1, 'Fondé en 1980, il entre au Bundestag en 1983.'],
            ['Que désignait « das Waldsterben » dans les années 1980 ?', ['La déforestation en Amazonie', 'La mort des forêts due aux pluies acides', 'La coupe des sapins de Noël', 'Un roman romantique'], 1, 'Cette peur a nourri le mouvement écologiste allemand.'],
            ['Que signifie « nachhaltig » ?', ['Rapide', 'Durable', 'Naturel', 'Dangereux'], 1, '*nachhaltig* = durable : *eine nachhaltige Entwicklung*.'],
            ['Pour les romantiques, la forêt est surtout un lieu de production de bois.', ['Vrai', 'Faux'], 1, 'Elle est pour eux un lieu de sentiment, de mystère et d’identité.'],
            ['Qu’est-ce qu’une « Datsche » ?', ['Une petite maison de campagne, très répandue en RDA', 'Un plat de viande', 'Un parc national', 'Une randonnée'], 0, 'Le mot vient du russe *datcha*.'],
            ['Comment dit-on « la protection de l’environnement » ?', ['der Umweltschutz', 'die Umweltschuld', 'der Naturgarten', 'die Schutzumwelt'], 0, '*die Umwelt* (l’environnement) + *der Schutz* (la protection).'],
          ],
        },

        {
          titre: 'Émigration, colonies, soft power : l’Allemagne et le monde',
          axe: 'L’Allemagne dans le monde',
          lecon: {
            titre: 'Hier et aujourd’hui, une influence qui dépasse ses frontières',
            cours: `Des millions d’émigrés, un empire colonial, une puissance exportatrice, une diplomatie prudente : l’Allemagne a eu, et a encore, un poids réel sur le reste du monde.

## Un pays d’émigration
Dès 1683, des Allemands fondent **Germantown** en Pennsylvanie. Au XIXe siècle, plus de cinq millions émigrent vers les États-Unis. Aux États-Unis, l’ascendance allemande est l’une des plus déclarées ; au Brésil, au Chili ou en Namibie, des communautés parlent encore allemand.

## Le colonialisme allemand et ses traces
| Date | Repère |
| 1884–1885 | Conférence de Berlin : les puissances européennes se partagent l’Afrique |
| 1897 | Le ministre von Bülow réclame pour l’Allemagne « une place au soleil » (*ein Platz an der Sonne*) |
| 1904–1908 | Massacre des Herero et des Nama en Namibie (*Deutsch-Südwestafrika*) |
| 1919 | Le traité de Versailles retire à l’Allemagne toutes ses colonies |
| 2021 | L’Allemagne reconnaît ce massacre comme un génocide |

Colonies : Namibie, Cameroun, Togo, Tanzanie (*Deutsch-Ostafrika*)… Longtemps oubliée, cette histoire revient dans le débat : rues rebaptisées, restitution d’objets pris en Afrique.

## La « soft power » allemande
| Outil | Rôle |
| le **Goethe-Institut** (1951) | fait connaître la langue et la culture allemandes, avec plus de 150 instituts dans le monde |
| la **Deutsche Welle** | radio et télévision internationales en une trentaine de langues |
| les produits « *Made in Germany* » | voitures, machines, qualité reconnue |
| le football, la musique, les universités gratuites | rayonnement et attractivité |

## Une politique étrangère prudente
Après 1945, la RFA mise sur l’ancrage à l’Ouest (OTAN, Europe) puis, avec **Willy Brandt**, sur la détente avec l’Est (*Ostpolitik*). L’armée (*Bundeswehr*) n’intervient à l’étranger qu’à partir des années 1990. En février 2022, après l’invasion de l’Ukraine, le chancelier Olaf Scholz parle d’un « changement d’époque » (*Zeitenwende*) : l’Allemagne réarme et assume davantage de responsabilités.

> Économiquement géante, politiquement longtemps discrète : l’Allemagne cherche encore le juste rôle que lui confèrent son poids et son histoire.

## Vocabulaire
| Allemand | Français |
| *die Auswanderung* | l’émigration |
| *die Kolonie, der Kolonialismus* | la colonie, le colonialisme |
| *die Außenpolitik* | la politique étrangère |
| *der Export, exportieren* | l’exportation |
| *der Einfluss* (auf + acc.) | l’influence (sur) |
| *die Wiedergutmachung* | la réparation |`,
          },
          questions: [
            ['Quelle colonie allemande correspond à l’actuelle Namibie ?', ['Deutsch-Ostafrika', 'Deutsch-Südwestafrika', 'Kamerun', 'Togo'], 1, '*Deutsch-Südwestafrika*, lieu du massacre des Herero et des Nama.'],
            ['Que réclamait von Bülow en 1897 ?', ['La paix avec la France', 'Une place au soleil pour l’Allemagne', 'L’unité allemande', 'La fin des colonies'], 1, '« *Ein Platz an der Sonne* » : la revendication d’un empire colonial.'],
            ['En quelle année l’Allemagne a-t-elle perdu toutes ses colonies ?', ['1871', '1919', '1945', '1990'], 1, 'Le traité de Versailles les lui retire.'],
            ['En 2021, l’Allemagne a reconnu comme génocide…', ['le massacre des Herero et des Nama', 'la guerre de 1870', 'la partition de 1949', 'la conférence de Berlin'], 0, 'Commis entre 1904 et 1908 en Namibie.'],
            ['Quel est le rôle du Goethe-Institut ?', ['Former des diplomates', 'Faire connaître la langue et la culture allemandes', 'Gérer les musées', 'Organiser le bac'], 1, 'Fondé en 1951, il compte plus de 150 instituts dans le monde.'],
            ['Qu’est-ce que la Deutsche Welle ?', ['Une chaîne internationale de radio et de télévision', 'Une vague de migrations', 'Un parti politique', 'Une banque'], 0, 'Elle diffuse en une trentaine de langues.'],
            ['Que désigne l’« Ostpolitik » de Willy Brandt ?', ['Une guerre à l’Est', 'La détente avec les pays de l’Est', 'La réunification', 'La colonisation de l’Est'], 1, 'Brandt a reçu le prix Nobel de la paix en 1971 pour cette politique.'],
            ['Quel mot Olaf Scholz a-t-il employé en février 2022 ?', ['Wende', 'Zeitenwende', 'Wiedervereinigung', 'Wirtschaftswunder'], 1, '« Changement d’époque » après l’invasion de l’Ukraine.'],
            ['Germantown, fondée en 1683, se trouve…', ['en Namibie', 'en Pennsylvanie', 'au Brésil', 'en Australie'], 1, 'Une des premières implantations allemandes en Amérique.'],
            ['Que signifie « die Außenpolitik » ?', ['La politique étrangère', 'La politique intérieure', 'La politique locale', 'L’opposition'], 0, '*außen* = dehors ; *Innenpolitik* = politique intérieure.'],
            ['La Bundeswehr intervient à l’étranger depuis sa création en 1955.', ['Vrai', 'Faux'], 1, 'Ses premières interventions armées à l’étranger datent des années 1990.'],
            ['Quelle préposition suit « der Einfluss » ?', ['auf', 'an', 'für', 'von'], 0, '*Einfluss haben auf* + accusatif : avoir de l’influence sur.'],
          ],
        },
      ],
    },

    // =====================================================================
    // RAYON LANGUE — repères B1/B1+ de la Première
    // =====================================================================
    {
      niveaux: ['1re'],
      positionDepart: 43,
      rayon: 'langue',
      chapitres: [
        {
          titre: 'Le plus-que-parfait et l’antériorité',
          axe: 'Les temps',
          lecon: {
            titre: 'Nachdem, bevor, vorher, nachher : mettre les événements en ordre',
            cours: `Raconter, ce n’est pas seulement dire ce qui s’est passé, c’est dire **dans quel ordre**. L’allemand marque l’antériorité par un temps, le plus-que-parfait, et par des mots précis.

## Le plus-que-parfait
**Prétérit de haben ou sein** + **participe II**, avec le même choix d’auxiliaire qu’au parfait.
| Parfait | Plus-que-parfait | Français |
| *ich habe gegessen* | *ich hatte gegessen* | j’avais mangé |
| *er ist gegangen* | *er war gegangen* | il était parti |
| *wir haben gewartet* | *wir hatten gewartet* | nous avions attendu |

Il exprime une action **antérieure** à une autre action passée : *Als ich ankam, war der Zug schon abgefahren.* (Quand je suis arrivé, le train était déjà parti.)

## nachdem : le décalage des temps
*nachdem* (après que) impose un **décalage** : la subordonnée est **un cran plus loin dans le passé** que la principale.
| Subordonnée en *nachdem* | Principale |
| plus-que-parfait | prétérit (ou parfait) |
| parfait | présent (ou futur) |

- *Nachdem er gegessen hatte, ging er schlafen.*
- *Nachdem ich die Hausaufgaben gemacht habe, gehe ich ins Kino.*

> Avec *nachdem*, jamais le même temps des deux côtés : c’est le premier réflexe qu’un correcteur vérifie.

## bevor : pas de décalage
*bevor* (avant que, avant de) garde le **même temps** que la principale : *Bevor ich schlafen ging, las ich noch.* Attention : « avant de + infinitif » se dit aussi *bevor* avec un verbe conjugué, jamais *vor … zu* : *Bevor ich gehe, rufe ich dich an.*

## Les adverbes et prépositions
| Nature | Antériorité | Postériorité |
| Subordonnant (verbe à la fin) | *bevor* | *nachdem* |
| Adverbe (inversion) | *vorher* (avant, auparavant) | *nachher, danach* (après) |
| Préposition + datif | *vor dem Essen* | *nach dem Essen* |

Ne confonds pas *nach* (préposition), *nachher* (adverbe) et *nachdem* (subordonnant) : *Nach dem Film* / *Nachher gehen wir…* / *Nachdem der Film zu Ende war, …*

## Exemple travaillé
« Après avoir visité le musée, nous sommes allés au café. »
1. Le français dit « après avoir + infinitif » ; l’allemand exige une subordonnée conjuguée : *nachdem wir … besucht hatten*.
2. La principale au prétérit : *gingen wir*.
3. *Nachdem wir das Museum besucht hatten, gingen wir ins Café.*

On peut aussi alléger : *Nach dem Museumsbesuch gingen wir ins Café.*`,
          },
          questions: [
            ['Comment dit-on « j’avais mangé » ?', ['ich habe gegessen', 'ich hatte gegessen', 'ich hätte gegessen', 'ich aß'], 1, 'Prétérit de *haben* + participe : plus-que-parfait.'],
            ['Comment dit-on « il était parti » ?', ['er hatte gegangen', 'er war gegangen', 'er ist gegangen', 'er wäre gegangen'], 1, '*gehen* prend *sein* : *war gegangen*.'],
            ['« Nachdem er gegessen ___, ging er schlafen. » Quel mot complète la phrase ?', ['hat', 'hatte', 'hätte', 'ist'], 1, 'Principale au prétérit : la subordonnée en *nachdem* passe au plus-que-parfait.', 'Quel auxiliaire après nachdem er gegessen ?'],
            ['Avec « nachdem » et une principale au présent, la subordonnée est au…', ['présent', 'parfait', 'plus-que-parfait', 'futur'], 1, 'Le décalage : un cran plus loin dans le passé que la principale.'],
            ['Après « bevor », faut-il décaler les temps ?', ['Oui, toujours', 'Non, même temps que la principale', 'Seulement au futur', 'Seulement à l’écrit'], 1, '*Bevor ich ging, las ich noch* : même temps des deux côtés.'],
            ['Quel mot est un adverbe (et provoque l’inversion) ?', ['nachdem', 'nach', 'nachher', 'bevor'], 2, '*Nachher gehen wir ins Kino* : adverbe en 1re position, verbe 2e.'],
            ['Comment traduire « avant de partir, je t’appelle » ?', ['Vor zu gehen, rufe ich dich an.', 'Bevor ich gehe, rufe ich dich an.', 'Bevor zu gehen, ich rufe dich an.', 'Vorher ich gehe, rufe ich dich an.'], 1, '« Avant de » se rend par *bevor* + verbe conjugué.'],
            ['« Als ich ankam, war der Zug schon abgefahren » : quelle action a eu lieu en premier ?', ['L’arrivée', 'Le départ du train', 'Les deux en même temps', 'On ne peut pas le savoir'], 1, 'Le plus-que-parfait *war abgefahren* marque l’antériorité.'],
            ['Avec « nachdem », on peut mettre le même temps dans les deux propositions.', ['Vrai', 'Faux'], 1, '*nachdem* impose toujours un décalage de temps.'],
            ['Quelle préposition exprime « après le repas » ?', ['nachdem dem Essen', 'nach dem Essen', 'nachher dem Essen', 'danach Essen'], 1, '*nach* + datif : *nach dem Essen*.'],
            ['Comment traduire « Après avoir visité le musée, nous sommes allés au café » ?', ['Nach besucht das Museum gingen wir ins Café.', 'Nachdem wir das Museum besucht hatten, gingen wir ins Café.', 'Nachdem wir das Museum besuchten, gingen wir ins Café.', 'Nachher wir das Museum besucht hatten, gingen wir ins Café.'], 1, 'Subordonnée au plus-que-parfait, principale au prétérit.'],
            ['Que signifie « vorher » ?', ['Après', 'Auparavant', 'Pendant', 'Ensuite'], 1, '*vorher* = avant, auparavant ; *nachher* = après.'],
          ],
        },

        {
          titre: 'Les verbes à rection casuelle : datif, accusatif, génitif',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Helfen, danken, fragen : le cas que le verbe impose',
            cours: `« J’aide mon frère » : en français, « mon frère » est un COD. En allemand, *helfen* exige le **datif** : *Ich helfe meinem Bruder*. Certains verbes imposent un cas que le français ne laisse pas deviner.

## Les verbes suivis du datif
| Verbe | Français | Exemple |
| *helfen* | aider | *Ich helfe dir.* |
| *danken* | remercier | *Ich danke Ihnen.* |
| *folgen* | suivre | *Folgen Sie mir!* |
| *gefallen* | plaire | *Der Film gefällt mir.* |
| *gehören* | appartenir | *Das Buch gehört meiner Schwester.* |
| *gratulieren* | féliciter | *Wir gratulieren dem Sieger.* |
| *antworten* | répondre (à qqn) | *Er antwortet dem Lehrer.* |
| *glauben* | croire (qqn) | *Ich glaube dir.* |
| *vertrauen* | faire confiance à | *Ich vertraue ihr.* |
| *widersprechen* | contredire | *Er widerspricht seinem Vater.* |
| *zuhören* | écouter (qqn) | *Hör mir zu!* |
| *begegnen* | rencontrer (par hasard) | *Ich bin ihm begegnet.* |

> *helfen, danken, folgen* : trois verbes « à COD » en français, au datif en allemand. Les apprendre par cœur évite des fautes à chaque copie.

## Les verbes à l’accusatif là où le français dit « à »
| Verbe | Français | Exemple |
| *jn fragen* | demander à qqn | *Ich frage den Lehrer.* |
| *jn anrufen* | téléphoner à qqn | *Ruf mich an!* |
| *jn um etwas bitten* | demander qqch à qqn | *Er bittet mich um Hilfe.* |

## Les verbes à deux compléments
Personne au **datif**, chose à l’**accusatif** : *jm etwas geben, schenken, zeigen, erklären, schicken*.
*Ich erkläre dem Schüler die Regel.* · *Ich erkläre sie ihm.* (deux pronoms : l’accusatif d’abord).

## Quelques constructions au génitif (écrit soutenu)
- *sich einer Sache bewusst sein* : être conscient de qqch — *Er ist sich der Gefahr bewusst.*
- *der Opfer gedenken* : commémorer les victimes.

## Le verbe pronominal au datif
Quand le verbe a déjà un COD, le réfléchi passe au **datif** : *Ich wasche mich* (je me lave) mais *Ich wasche mir die Hände* (je me lave les mains) ; *Ich sehe mir eine Ausstellung an* (je vais voir une exposition).

## Exemple travaillé
« Je remercie mon amie et je lui demande de l’aide. »
1. *danken* + datif : *meiner Freundin*.
2. *bitten* + accusatif de la personne + *um* : *sie um Hilfe*.
3. *Ich danke meiner Freundin und bitte sie um Hilfe.*`,
          },
          questions: [
            ['Quelle phrase est correcte ?', ['Ich helfe meinen Bruder.', 'Ich helfe meinem Bruder.', 'Ich helfe mein Bruder.', 'Ich helfe meines Bruders.'], 1, '*helfen* régit le datif : *meinem Bruder*.'],
            ['Comment dit-on « Le film me plaît » ?', ['Der Film gefällt mich.', 'Der Film gefällt mir.', 'Ich gefalle den Film.', 'Mir gefällt mich der Film.'], 1, '*gefallen* + datif : la personne à qui ça plaît est au datif.'],
            ['Quel verbe se construit avec l’accusatif de la personne ?', ['danken', 'helfen', 'fragen', 'antworten'], 2, '*Ich frage den Lehrer* : accusatif, alors que le français dit « demander à ».'],
            ['« Ich danke ___ für die Einladung. » (vous, politesse) Quel mot complète la phrase ?', ['Sie', 'Ihnen', 'Ihr', 'Ihre'], 1, '*danken* + datif : *Ihnen*.', 'Quel pronom après danken ?'],
            ['Comment dit-on « Il me demande de l’aide » ?', ['Er bittet mir um Hilfe.', 'Er bittet mich um Hilfe.', 'Er fragt mir Hilfe.', 'Er bittet mich für Hilfe.'], 1, '*jn um etwas bitten* : accusatif de la personne, *um* pour la chose.'],
            ['Dans « Ich erkläre dem Schüler die Regel », quel est le cas de « dem Schüler » ?', ['Nominatif', 'Accusatif', 'Datif', 'Génitif'], 2, 'La personne à qui l’on explique est au datif.'],
            ['« Das Buch gehört ___ Schwester. » Quel mot complète la phrase ?', ['meine', 'meiner', 'meinen', 'meines'], 1, '*gehören* + datif ; *Schwester* est féminin : *meiner*.', 'Quelle forme de mein après gehören ?'],
            ['Comment dit-on « je me lave les mains » ?', ['Ich wasche mich die Hände.', 'Ich wasche mir die Hände.', 'Ich wasche meine Hände mich.', 'Ich wasche die Hände mir mich.'], 1, 'Le COD est *die Hände* : le réfléchi passe au datif, *mir*.'],
            ['« glauben » se construit avec le datif quand on croit une personne.', ['Vrai', 'Faux'], 0, '*Ich glaube dir* : je te crois. Pour une chose : *Ich glaube das.*'],
            ['« Er ist sich der Gefahr bewusst » : quel est le cas de « der Gefahr » ?', ['Datif', 'Génitif', 'Accusatif', 'Nominatif'], 1, '*sich einer Sache bewusst sein* régit le génitif.'],
            ['Quelle phrase est correcte ?', ['Ich rufe dir morgen an.', 'Ich rufe dich morgen an.', 'Ich rufe morgen an dich.', 'Ich anrufe dich morgen.'], 1, '*anrufen* + accusatif, et le préverbe *an* en fin de phrase.'],
            ['Que signifie « Er widerspricht seinem Vater » ?', ['Il obéit à son père', 'Il contredit son père', 'Il parle de son père', 'Il répond à son père'], 1, '*widersprechen* + datif : contredire.'],
          ],
        },

        {
          titre: 'Le sens des préverbes',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Aus-, um-, zurück-, er-, ver- : deviner le sens d’un verbe',
            cours: `*wandern*, *auswandern*, *einwandern*, *abwandern* : un même radical, quatre sens. Connaître le sens des préverbes permet de comprendre des centaines de verbes sans dictionnaire.

## Les préverbes séparables : une idée d’espace
| Préverbe | Idée | Exemples |
| **aus-** | vers l’extérieur, jusqu’au bout | *auswandern* (émigrer), *ausleben* (vivre pleinement), *aussteigen* (descendre) |
| **ein-** | vers l’intérieur | *einwandern* (immigrer), *einsteigen* (monter dans) |
| **um-** | changement, autour | *umziehen* (déménager), *umsteigen* (changer de train), *umdenken* (changer sa façon de penser) |
| **zurück-** | retour, en arrière | *zurückkommen* (revenir), *sich zurückhalten* (se retenir) |
| **mit-** | avec | *mitmachen* (participer), *mitbringen* (apporter) |
| **weg-** | au loin, disparition | *weggehen* (s’en aller), *wegwerfen* (jeter) |
| **an-** | contact, début | *ankommen* (arriver), *anfangen* (commencer) |
| **auf-** | vers le haut, ouverture | *aufstehen* (se lever), *aufmachen* (ouvrir) |

## Les préverbes inséparables : un changement de sens
| Préverbe | Idée | Exemples |
| **be-** | rend le verbe transitif | *antworten auf* → *beantworten* (une question) |
| **er-** | aboutir, rendre (souvent à partir d’un adjectif) | *erreichen* (atteindre), *erleichtern* (faciliter, de *leicht*), *erneuern* (renouveler, de *neu*) |
| **ver-** | transformation, erreur, disparition | *verändern* (transformer), *sich verlaufen* (se perdre), *verschwinden* (disparaître) |
| **ent-** | éloignement, retrait | *entkommen* (s’échapper), *entdecken* (découvrir, « ôter la couverture ») |
| **zer-** | destruction en morceaux | *zerstören* (détruire), *zerbrechen* (briser) |
| **miss-** | mal, de travers | *missverstehen* (mal comprendre) |

> Un préverbe inséparable ne se détache jamais et son participe n’a pas de *ge-* : *verändert*, *erreicht*, *zerstört*.

## Méthode pour deviner un verbe inconnu
1. Isole le préverbe : *um / denken*.
2. Donne le sens du radical : *denken* = penser.
3. Ajoute l’idée du préverbe : *um-* = changement → changer sa façon de penser.
4. Vérifie dans le contexte : *Wir müssen in der Klimapolitik umdenken.*

## ver- : le préverbe le plus traître
*ver-* a plusieurs valeurs : transformation (*verbessern*, améliorer, de *besser*), erreur (*sich verschreiben*, faire une faute d’écriture ; *verschlafen*, dormir trop longtemps), consommation complète (*verbrauchen*). Le contexte tranche.

## Exemple travaillé
*Viele Menschen wanderten im 19. Jahrhundert nach Amerika aus.* → *aus-* (vers l’extérieur) + *wandern* (se déplacer) = émigrer. En Amérique, ils sont *eingewandert* (ils ont immigré).`,
          },
          questions: [
            ['Que signifie « umziehen » ?', ['Se déshabiller seulement', 'Déménager', 'Retourner', 'Tirer'], 1, '*um-* marque le changement : changer de logement (aussi « se changer »).'],
            ['Que signifie « einwandern » ?', ['Émigrer', 'Immigrer', 'Randonner', 'Revenir'], 1, '*ein-* = vers l’intérieur : entrer dans un pays pour y vivre.'],
            ['Quel préverbe exprime la destruction en morceaux ?', ['ent-', 'zer-', 'er-', 'be-'], 1, '*zerstören*, *zerbrechen* : détruire, briser.'],
            ['« erneuern » est formé sur…', ['le verbe nennen', 'l’adjectif neu', 'le nom Nerv', 'le verbe nehmen'], 1, '*er-* + *neu* : rendre neuf, renouveler.'],
            ['Que signifie « sich verlaufen » ?', ['Se promener', 'Se perdre', 'Courir vite', 'Se sauver'], 1, '*ver-* marque ici l’erreur : marcher dans la mauvaise direction.'],
            ['Quel est le participe II de « verändern » ?', ['geverändert', 'verändert', 'vergeändert', 'veränderte'], 1, 'Préverbe inséparable : pas de *ge-*.'],
            ['« umdenken » signifie…', ['penser à quelqu’un', 'changer sa façon de penser', 'réfléchir longtemps', 'oublier'], 1, '*um-* (changement) + *denken* (penser).'],
            ['« be- » transforme souvent un verbe à préposition en verbe transitif.', ['Vrai', 'Faux'], 0, '*auf eine Frage antworten* → *eine Frage beantworten*.'],
            ['Que signifie « sich zurückhalten » ?', ['Se retenir', 'Revenir', 'Retenir quelqu’un', 'Se retourner'], 0, '*zurück-* (en arrière) + *halten* (tenir) : se retenir, rester en retrait.'],
            ['Que signifie « entdecken » ?', ['Couvrir', 'Découvrir', 'Décorer', 'Détruire'], 1, '*ent-* (retrait) + *decken* (couvrir) : ôter la couverture, découvrir.'],
            ['Que signifie « missverstehen » ?', ['Comprendre parfaitement', 'Mal comprendre', 'Ne pas entendre', 'Expliquer'], 1, '*miss-* = de travers.'],
            ['Dans « Ich steige in Köln um », que fait le locuteur ?', ['Il descend définitivement', 'Il change de train', 'Il monte dans le train', 'Il rate son train'], 1, '*umsteigen* : changer (de train, de bus).'],
          ],
        },

        {
          titre: 'Exprimer la simultanéité',
          axe: 'La phrase',
          lecon: {
            titre: 'Während, beim, gleichzeitig : deux actions en même temps',
            cours: `« Pendant que je travaille, il dort » ; « en mangeant » ; « au même moment » : l’allemand a plusieurs outils pour dire que deux choses arrivent **en même temps**, et chacun a sa construction.

## Les outils
| Outil | Nature | Construction | Exemple |
| *während* | subordonnant | verbe **à la fin** | *Während ich arbeite, schläft er.* |
| *während* + gén. | préposition | groupe nominal | *während des Unterrichts* |
| *beim* + infinitif substantivé | préposition + nom | pas de verbe conjugué | *beim Essen* (en mangeant) |
| *gleichzeitig, zugleich* | adverbes | **inversion** | *Gleichzeitig telefoniert sie.* |
| *solange* | subordonnant | verbe à la fin | *Solange es regnet, bleiben wir hier.* |
| *als* | subordonnant (un moment du passé) | verbe à la fin | *Als ich ankam, regnete es.* |

## beim + infinitif : une construction très allemande
Pour traduire le gérondif français « en + participe présent » :
- *beim Lesen* = en lisant
- *beim Autofahren* = en conduisant
- *Beim Frühstück hören wir Radio.* = Au petit-déjeuner, nous écoutons la radio.

*beim* = *bei dem* : l’infinitif devient un **nom neutre** et prend une **majuscule**.

> *beim* + infinitif ne marche que si l’action est la même pour tout le monde dans la phrase : *Beim Lesen höre ich Musik* (je lis et j’écoute).

## Les deux sens de während
1. **Temporel** (pendant que) : *Während er kocht, deckt sie den Tisch.*
2. **Adversatif** (tandis que, alors que) : *Während Paul Sport liebt, liest seine Schwester lieber.*

Seul le contexte les distingue : si les deux actions s’**opposent**, c’est l’adversatif.

## als ou wenn ?
- *als* : **une seule fois** dans le passé — *Als ich klein war…*
- *wenn* : **chaque fois**, ou au présent/futur — *Immer wenn ich ihn sehe, lacht er.*

## Exemple travaillé
« En faisant ses devoirs, il écoute de la musique ; pendant ce temps, sa sœur regarde la télévision. »
1. « En faisant ses devoirs » → *Bei den Hausaufgaben* ou *Beim Hausaufgabenmachen*.
2. Inversion après ce groupe : *hört er Musik*.
3. « pendant ce temps » → *währenddessen*, adverbe : *währenddessen sieht seine Schwester fern*.
4. *Bei den Hausaufgaben hört er Musik; währenddessen sieht seine Schwester fern.*`,
          },
          questions: [
            ['Comment traduire « en mangeant » ?', ['beim Essen', 'bei essen', 'während essen', 'mit Essen'], 0, '*beim* + infinitif substantivé, avec majuscule.'],
            ['« Während ich arbeite, ___ er. » Quelle forme complète la phrase ?', ['er schläft', 'schläft', 'schlafen', 'geschlafen'], 1, 'La subordonnée en tête occupe la 1re place : le verbe de la principale suit immédiatement.', 'Quel verbe après la subordonnée en während ?'],
            ['Après la préposition « während », quel cas emploie-t-on ?', ['Le datif', 'Le génitif', 'L’accusatif', 'Le nominatif'], 1, '*während des Unterrichts* : génitif.'],
            ['Dans « Während Paul Sport liebt, liest seine Schwester lieber », « während » a un sens…', ['temporel', 'adversatif (tandis que)', 'causal', 'final'], 1, 'Les deux actions s’opposent : tandis que.'],
            ['Quelle phrase est correcte ?', ['Gleichzeitig sie telefoniert.', 'Gleichzeitig telefoniert sie.', 'Gleichzeitig sie telefonieren.', 'Sie gleichzeitig telefoniert.'], 1, 'Adverbe en tête : inversion, verbe 2e.'],
            ['« Als » s’emploie pour…', ['une action répétée', 'une action unique dans le passé', 'le futur', 'une condition'], 1, '*Als ich klein war* : un moment unique du passé.'],
            ['« ___ ich ihn sehe, lacht er. » (chaque fois) Quel mot complète la phrase ?', ['Als', 'Wenn', 'Während', 'Beim'], 1, 'Répétition : *(immer) wenn*.', 'Quel subordonnant pour « chaque fois que » ?'],
            ['Dans « beim Lesen », « Lesen » prend une majuscule parce que c’est un nom.', ['Vrai', 'Faux'], 0, 'L’infinitif substantivé est un nom neutre : majuscule.'],
            ['Que signifie « solange es regnet » ?', ['Depuis qu’il pleut', 'Tant qu’il pleut', 'Avant qu’il pleuve', 'Bien qu’il pleuve'], 1, '*solange* = tant que.'],
            ['Que signifie « währenddessen » ?', ['Pendant ce temps', 'Pourtant', 'Ensuite', 'Depuis'], 0, 'Adverbe : *währenddessen* reprend la simultanéité.'],
            ['Comment dit-on « en conduisant » ?', ['beim Autofahren', 'bei Autofahren', 'während Autofahren', 'im Autofahrt'], 0, '*beim* + infinitif substantivé : *beim Autofahren*.'],
            ['Quel mot est un adverbe synonyme de « gleichzeitig » ?', ['während', 'zugleich', 'solange', 'als'], 1, '*zugleich* = en même temps ; les autres sont des subordonnants.'],
          ],
        },

        {
          titre: 'Les connecteurs de l’argumentation',
          axe: 'La phrase',
          lecon: {
            titre: 'Concéder, opposer, ajouter, reformuler',
            cours: `Une bonne argumentation ne juxtapose pas des idées : elle les **articule**. L’allemand a pour cela des connecteurs de trois natures, et chacun gouverne la place du verbe.

## Trois natures, trois ordres des mots
| Nature | Exemples | Place du verbe |
| Coordonnant (position 0) | *aber, und, oder, denn, sondern* | ordre normal |
| Adverbe (position 1) | *trotzdem, außerdem, dagegen, deshalb* | inversion : verbe 2e, sujet après |
| Subordonnant | *obwohl, während, auch wenn* | verbe à la fin |

## La concession : reconnaître pour mieux contredire
| Connecteur | Nature | Exemple |
| *obwohl* | subordonnant (bien que) | *Obwohl es regnet, gehen wir spazieren.* |
| *trotzdem* | adverbe (quand même) | *Es regnet, trotzdem gehen wir spazieren.* |
| *trotz* + gén. | préposition (malgré) | *Trotz des Regens gehen wir spazieren.* |
| *zwar … aber* | certes… mais | *Das ist zwar teuer, aber praktisch.* |
| *auch wenn* | même si | *Auch wenn es regnet, gehen wir spazieren.* |

> Une même idée, trois constructions : *obwohl* (verbe à la fin), *trotzdem* (inversion), *trotz* (sans verbe). Savoir passer de l’une à l’autre enrichit une copie.

## L’opposition
- *aber* : mais ; *sondern* : mais au contraire, après une négation (*nicht teuer, sondern billig*).
- *dagegen*, *hingegen* : en revanche (adverbes) — *Berlin ist groß, Bonn dagegen ist klein.*
- *im Gegensatz zu* + dat. : contrairement à.
- *während* (tandis que) : *Während die Stadt wächst, schrumpft das Dorf.*

## L’ajout et la reformulation
| Connecteur | Sens |
| *außerdem, darüber hinaus, zudem* | de plus, en outre |
| *übrigens* | d’ailleurs, au fait |
| *auch, ebenso* | aussi, de même |
| *das heißt (d. h.)* | c’est-à-dire |
| *anders gesagt* | autrement dit |
| *beziehungsweise (bzw.)* | ou plutôt, respectivement |
| *zum Beispiel (z. B.)* | par exemple |

## Structurer un paragraphe
1. **Einerseits** … (d’un côté) — l’argument pour.
2. **Andererseits** … (de l’autre) — l’argument contre.
3. **Außerdem** … — un argument de plus.
4. **Zusammenfassend kann man sagen, dass** … — pour conclure.

## Exemple travaillé
*Soziale Netzwerke sind zwar praktisch, aber sie können süchtig machen. Außerdem verbreiten sich Falschmeldungen sehr schnell. Trotzdem nutzen fast alle Jugendlichen sie täglich, d. h. man muss lernen, kritisch damit umzugehen.*

Repère : *zwar … aber* (concession), *Außerdem verbreiten sich* (inversion), *Trotzdem nutzen* (inversion), *d. h.* (reformulation).`,
          },
          questions: [
            ['Quelle phrase est correcte ?', ['Obwohl es regnet, wir gehen spazieren.', 'Obwohl es regnet, gehen wir spazieren.', 'Obwohl regnet es, gehen wir spazieren.', 'Obwohl es regnet, spazieren wir gehen.'], 1, 'Subordonnée en tête, puis verbe de la principale, puis sujet.'],
            ['Quelle est la nature de « trotzdem » ?', ['Subordonnant', 'Adverbe', 'Préposition', 'Coordonnant'], 1, 'Adverbe : il occupe la 1re place et provoque l’inversion.'],
            ['Que signifie « trotz des Regens » ?', ['À cause de la pluie', 'Malgré la pluie', 'Pendant la pluie', 'Après la pluie'], 1, '*trotz* + génitif : malgré.'],
            ['« Das ist ___ teuer, aber praktisch. » Quel mot complète la phrase ?', ['zwar', 'trotzdem', 'obwohl', 'sondern'], 0, '*zwar … aber* : certes… mais.', 'Quel mot forme « certes… mais » avec aber ?'],
            ['Que signifie « dagegen » dans « Bonn dagegen ist klein » ?', ['Contre cela', 'En revanche', 'De plus', 'Donc'], 1, '*dagegen* marque l’opposition entre deux éléments.'],
            ['Que signifie l’abréviation « bzw. » ?', ['Par exemple', 'Beziehungsweise : ou plutôt, respectivement', 'C’est-à-dire', 'Et cetera'], 1, '*beziehungsweise* précise ou distribue.'],
            ['Que signifie « übrigens » ?', ['D’ailleurs, au fait', 'Ensuite', 'Pourtant', 'Finalement'], 0, 'Il introduit une remarque en passant.'],
            ['Après « außerdem » en tête de phrase, le sujet se place après le verbe.', ['Vrai', 'Faux'], 0, '*Außerdem ist das teuer* : adverbe en 1re position, inversion.'],
            ['Comment dit-on « même si » ?', ['obwohl', 'auch wenn', 'wenn auch nicht', 'sogar'], 1, '*auch wenn* : concession hypothétique.'],
            ['« Das ist nicht teuer, ___ billig. » Quel mot complète la phrase ?', ['aber', 'sondern', 'dagegen', 'trotzdem'], 1, 'Après une négation, « mais au contraire » se dit *sondern*.', 'Quel mot après une négation ?'],
            ['Quelle expression sert à conclure ?', ['Einerseits', 'Zusammenfassend kann man sagen, dass…', 'Zum Beispiel', 'Außerdem'], 1, 'Pour conclure : *zusammenfassend*, en résumé.'],
            ['Que signifie « d. h. » ?', ['das heißt : c’est-à-dire', 'der Hauptsatz', 'durchaus hier', 'dort hinten'], 0, '*das heißt* introduit une reformulation.'],
          ],
        },

        {
          titre: 'Nuancer son propos avec les verbes de modalité',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Das mag sein, er muss krank sein : quand les modaux jugent',
            cours: `*Er muss krank sein* ne veut pas dire « il a l’obligation d’être malade », mais « il doit être malade » — sûrement. Les verbes de modalité ont un **second emploi** : exprimer le degré de certitude du locuteur.

## Deux emplois pour un même verbe
| Emploi | Ce que dit le modal | Exemple |
| Objectif | obligation, permission, capacité du sujet | *Er muss arbeiten.* (il est obligé de travailler) |
| Subjectif | ce que le locuteur **pense probable** | *Er muss krank sein.* (il est sûrement malade) |

## L’échelle de certitude
| Modal | Degré | Exemple | Français |
| *muss* | presque certain | *Das muss ein Fehler sein.* | Ça doit être une erreur. |
| *dürfte* | très probable | *Er dürfte jetzt zu Hause sein.* | Il est sans doute chez lui. |
| *kann / könnte* | possible | *Das könnte stimmen.* | Ça pourrait être vrai. |
| *kann nicht* | impossible | *Das kann nicht sein!* | Ce n’est pas possible ! |
| *mag* | concession | *Das mag sein, aber…* | C’est possible, mais… |

> *Das mag sein, aber…* est la formule idéale pour concéder un argument avant de le réfuter, comme l’anglais *it may be true, but…*

## Au passé : modal + infinitif passé
Pour juger un fait passé, le modal reste au présent et l’infinitif passe au **passé** (participe + *haben/sein*) :
- *Er muss krank gewesen sein.* — Il a dû être malade.
- *Sie kann den Bus verpasst haben.* — Elle a pu rater le bus.
- *Das dürfte schwierig gewesen sein.* — Ça a dû être difficile.

## Les adverbes qui disent la même chose
| Adverbe | Degré |
| *bestimmt, sicher* | certain |
| *wahrscheinlich* | probable |
| *vielleicht* | peut-être |
| *kaum* | à peine, peu probable |

*Er ist sicher krank* = *Er muss krank sein*. Varier entre modal et adverbe évite les répétitions.

## Exemple travaillé
Tu commentes un texte où un personnage se tait : « Il a sûrement eu peur, mais il a peut-être aussi voulu protéger sa famille. »
1. Certitude sur le passé : *Er muss Angst gehabt haben*.
2. Possibilité : *vielleicht* ou *kann … gewollt haben*.
3. *Er muss Angst gehabt haben, aber vielleicht wollte er auch seine Familie schützen.*

## Piège
*Er muss nicht kommen* ne veut pas dire « il ne doit pas venir » mais « il n’est **pas obligé** de venir ». L’interdiction se dit *Er darf nicht kommen*.`,
          },
          questions: [
            ['Que signifie « Er muss krank sein » ?', ['Il est obligé d’être malade', 'Il est sûrement malade', 'Il n’est pas malade', 'Il veut être malade'], 1, 'Emploi subjectif : le locuteur est presque certain.'],
            ['Quel modal exprime une forte probabilité, un peu moins sûre que « muss » ?', ['darf', 'dürfte', 'soll', 'will'], 1, '*Er dürfte zu Hause sein* : il est sans doute chez lui.'],
            ['« Das mag sein, aber… » sert à…', ['exprimer un goût', 'concéder avant de réfuter', 'donner un ordre', 'exprimer un souhait'], 1, 'C’est possible, mais… : une formule de concession.'],
            ['Comment dit-on « Il a dû être malade » (supposition) ?', ['Er musste krank sein.', 'Er muss krank gewesen sein.', 'Er hat krank sein müssen.', 'Er muss krank war.'], 1, 'Modal au présent + infinitif passé : *krank gewesen sein*.'],
            ['« Das kann nicht sein! » signifie…', ['Ce n’est pas possible !', 'Il ne peut pas venir', 'Ça ne peut pas attendre', 'Ce n’est pas permis'], 0, '*kann nicht* dans son emploi subjectif : impossible.'],
            ['Que signifie « Er muss nicht kommen » ?', ['Il ne doit pas venir (interdit)', 'Il n’est pas obligé de venir', 'Il ne viendra pas', 'Il ne peut pas venir'], 1, 'L’interdiction se dit *darf nicht*.'],
            ['« Sie kann den Bus verpasst ___. » Quel mot complète la phrase ?', ['hat', 'haben', 'hatte', 'gehabt'], 1, 'Infinitif passé : participe + *haben* à l’infinitif.', 'Quel auxiliaire à l’infinitif ?'],
            ['Quel adverbe équivaut à l’emploi subjectif de « muss » ?', ['vielleicht', 'kaum', 'bestimmt', 'nie'], 2, '*bestimmt*, *sicher* : certainement.'],
            ['Dans « Er muss arbeiten », le modal a un emploi objectif (obligation).', ['Vrai', 'Faux'], 0, 'Ici, c’est une obligation qui pèse sur le sujet.'],
            ['« Das könnte stimmen » exprime…', ['une certitude', 'une possibilité', 'une interdiction', 'un ordre'], 1, '*könnte* : ça pourrait être vrai.'],
            ['Que signifie « wahrscheinlich » ?', ['Vraiment', 'Probablement', 'Heureusement', 'Rarement'], 1, '*wahrscheinlich* = probablement.'],
            ['Comment dire « Ça a dû être difficile » ?', ['Das dürfte schwierig gewesen sein.', 'Das durfte schwierig sein.', 'Das hat schwierig sein dürfen.', 'Das dürfte schwierig war.'], 0, 'Modal subjectif + infinitif passé.'],
          ],
        },
      ],
    },
  ],
}
