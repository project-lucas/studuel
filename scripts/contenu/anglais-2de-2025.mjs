// Anglais — Seconde : LES AXES CULTURELS DU PROGRAMME 2025 et UNE GRAMMAIRE
// PROPRE À LA SECONDE (13 fiches).
//
// LE CONSTAT. La 2de, la 1re et la Tle avaient EXACTEMENT les mêmes 24 fiches
// de grammaire (anglais-2de.mjs importe anglais-tle.mjs), et aucun axe culturel
// du programme de langues vivantes paru au BO n° 22 du 29 mai 2025 (arrêté du
// 5 mai 2025, en vigueur en seconde depuis la rentrée 2025). Un élève de 2de ne
// trouvait rien sur le Commonwealth, pourtant axe OBLIGATOIRE de son année.
//
// CE QUE CE MODULE AJOUTE (rien n'est supprimé) :
//   - rayon 'culture' : les six axes de 2de, intitulés recopiés du BO, une fiche
//     par axe et deux pour l'axe 6 (obligatoire : cinq axes sur six sont traités
//     dans l'année en voie générale, dont toujours l'axe 6) ;
//   - rayon 'langue' : six fiches A2+ → B1+ prises dans les « outils
//     linguistiques » de 2de et ABSENTES des 24 fiches communes (réfléchis et
//     réciproques, noms composés, partitifs, reprises, connecteurs, lieu).
//
// ⚠️ Toujours générer avec `--modules anglais-2de-2025`, jamais `--slugs anglais`.

const AXE = {
  soi: 'Représentation de soi et rapport à autrui',
  generations: 'Vivre entre générations',
  passe: 'Le passé dans le présent',
  defis: 'Défis et transitions',
  creer: 'Créer et recréer',
  commonwealth: 'Les pays du Commonwealth : héritages, unité, diversité',
}

export default {
  slug: 'anglais',
  nom: 'Anglais',

  titreMigration: 'ANGLAIS 2de — axes culturels du programme 2025 et grammaire A2+ → B1+',

  motif: `CONSTAT : la 2de, la 1re et la Tle d'anglais montraient les mêmes 24 fiches
de grammaire et aucun des six axes culturels du programme 2025 (arrêté du
5 mai 2025, BO n° 22 du 29 mai 2025, en vigueur en 2de depuis la rentrée 2025),
dont l'axe 6 « Les pays du Commonwealth », obligatoire.
Cette migration AJOUTE derrière les 24 fiches (positions 25 → 37) : 7 fiches
culturelles (rayon 'culture', une par axe, deux pour l'axe 6) et 6 fiches de
langue propres à la seconde (rayon 'langue'). Rien n'est supprimé.`,

  blocs: [
    // ============================== LES AXES CULTURELS ======================
    {
      niveaux: ['2de'],
      positionDepart: 25,
      rayon: 'culture',
      chapitres: [
        // ---------------------------------------------------------- Axe 1 ---
        {
          titre: 'Normes, apparence et identités',
          axe: AXE.soi,
          lecon: {
            titre: 'What we show, what we are',
            cours: `Ce que l’on montre de soi n’est jamais neutre : une coiffure, un vêtement, une photo de profil disent à quel groupe on appartient — ou contre quoi on se dresse.

## Ce que recouvre l’axe
Le programme part d’un constat : l’apparence compte de plus en plus. Il te demande de te demander si les arts visuels, la littérature et les médias imposent une **beauté normée**, ou s’ils permettent au contraire aux **différences** d’émerger, de s’affirmer et d’être acceptées. On y étudie la manière dont on **se présente** à l’autre et dont on **représente** l’autre.

## Repères culturels
| Repère | Ce qu’il montre |
| Les **Préraphaélites** (1848 : Rossetti, Millais, Hunt) | Un canon de beauté : longue chevelure, teint pâle — l’*Ophelia* de Millais (1851-1852) |
| **Miss America** (Atlantic City, 1921) | Le *beauty pageant*, concours qui fixe une norme ; en 1968, des féministes manifestent devant le concours |
| **Mary Quant** et la minijupe (années 1960, Londres) | La mode comme manifeste d’une génération |
| Le **punk** de Vivienne Westwood (années 1970) | S’habiller pour contester |
| **David Bowie** et Ziggy Stardust (1972) | Jouer avec les identités et le genre |
| **Cindy Sherman**, *Untitled Film Stills* (1977-1980) | La photographe se met en scène dans des rôles de femmes stéréotypés |
| Le mouvement **body positivity** (années 2010) | Accepter tous les corps sur les réseaux sociaux |

## Vocabulaire utile
| Anglais | Français |
| appearance / looks | l’apparence |
| to fit the stereotype | correspondre au stéréotype |
| beauty standards | les canons de beauté |
| self-esteem | l’estime de soi |
| body shaming | le fait de moquer le physique de quelqu’un |
| outfit | la tenue |
| to stand out | se démarquer |
| to conform | se conformer |

## Problématiques et documents
- *Do the media promote a single model of beauty?*
- *Can fashion be a form of protest?*
- Documents typiques : un tableau préraphaélite, une affiche de Miss America, une publicité, un extrait de série, un post d’influenceur.

## Pour argumenter à l’oral
- *At first sight, this picture seems to…* — Au premier abord, cette image semble…
- *It reflects / conveys the idea that…* — Elle reflète / transmet l’idée que…
- *On the one hand… on the other hand…* — D’un côté… de l’autre…
- *I’m convinced that… / I can’t help thinking that…*

> Exemple travaillé : face à une publicité, décris d’abord (*In the foreground, we can see…*), puis interprète (*The advertiser wants us to believe that…*), puis juge (*In my opinion, this image reinforces beauty standards because…*).`,
          },
          questions: [
            ['Quel mouvement artistique anglais, né en 1848, a imposé un canon de beauté aux longs cheveux et au teint pâle ?', ['Les Préraphaélites', 'Le cubisme', 'Le Pop Art', 'L’impressionnisme'], 0, 'Rossetti, Millais et Hunt fondent la Pre-Raphaelite Brotherhood en 1848.'],
            ['Dans quelle ville se tient le premier concours Miss America, en 1921 ?', ['Las Vegas', 'Los Angeles', 'Miami', 'Atlantic City'], 3, 'Le concours naît à Atlantic City, dans le New Jersey.'],
            ['Que signifie « to fit the stereotype » ?', ['Combattre un stéréotype', 'Correspondre au stéréotype', 'Inventer un stéréotype', 'Ignorer un stéréotype'], 1, 'To fit = aller, convenir : on colle au modèle attendu.'],
            ['Quelle créatrice londonienne est associée à la minijupe des années 1960 ?', ['Vivienne Westwood', 'Mary Quant', 'Stella McCartney', 'Coco Chanel'], 1, 'Mary Quant en fait le symbole de la jeunesse du Swinging London.'],
            ['« Self-esteem » se traduit par…', ['L’égoïsme', 'La timidité', 'La vanité', 'L’estime de soi'], 3, 'Self- (soi-même) + esteem (estime).'],
            ['Cindy Sherman se photographie elle-même dans des rôles de femmes stéréotypées.', ['Vrai', 'Faux'], 0, 'Ses Untitled Film Stills (1977-1980) imitent des images de films pour montrer la construction des rôles.'],
            ['Quel artiste a incarné Ziggy Stardust en 1972 ?', ['David Bowie', 'Elton John', 'Freddie Mercury', 'Mick Jagger'], 0, 'Bowie brouille les frontières du genre et de l’identité avec ce personnage.'],
            ['Que désigne « body shaming » ?', ['Le culte du corps', 'Le fait de se muscler', 'Le fait de moquer le physique de quelqu’un', 'Un régime alimentaire'], 2, 'To shame = faire honte : c’est l’inverse de la body positivity.'],
            ['Quelle expression permet de commencer la description d’une image ?', ['In a nutshell…', 'To sum up…', 'All things considered…', 'In the foreground, we can see…'], 3, 'On décrit avant d’interpréter : les trois autres servent à conclure.'],
            ['Pour quelle raison des féministes manifestent-elles devant Miss America en 1968 ?', ['Pour réclamer un prix plus élevé', 'Pour dénoncer un concours qui juge les femmes sur leur physique', 'Pour défendre le concours', 'Pour demander un concours masculin'], 1, 'Elles contestent le principe même d’une norme de beauté imposée.'],
            ['Le style punk de Vivienne Westwood relève d’une mode…', ['De cour royale', 'Sportive', 'De contestation', 'Militaire'], 2, 'Épingles, tissus déchirés : s’habiller devient un acte de révolte.'],
            ['Que signifie « to stand out » ?', ['Se démarquer', 'Rester debout', 'Sortir', 'Se conformer'], 0, 'To stand out from the crowd : sortir du lot, l’inverse de to conform.'],
          ],
        },

        // ---------------------------------------------------------- Axe 2 ---
        {
          titre: 'Familles et transmissions entre générations',
          axe: AXE.generations,
          lecon: {
            titre: 'Passing things on',
            cours: `Entre les grands-parents et les petits-enfants, il y a des maisons, des langues, des recettes et des désaccords : c’est tout cela qui se transmet — ou se perd.

## Ce que recouvre l’axe
Le programme interroge l’évolution de la **famille** et des **relations intergénérationnelles** dans le monde anglophone sous l’effet des transformations économiques, démographiques et culturelles. Il pose aussi la question de la **transmission** du patrimoine, matériel (une maison, un domaine) et immatériel (une langue, des traditions).

## Repères culturels
| Repère | Ce qu’il montre |
| La **diaspora indienne** au Royaume-Uni (Southall, Leicester) | Des enfants nés en Angleterre entre deux cultures |
| *Bend It Like Beckham* (Gurinder Chadha, 2002) | Une fille sikh veut jouer au football, ses parents veulent autre chose |
| *The Namesake* (Jhumpa Lahiri, 2003) | Un fils d’immigrés bengalis aux États-Unis et le prénom qui l’encombre |
| Les **baby boomers** (nés 1946-1964) et la **Gen Z** | Deux générations qui s’opposent sur le logement, le travail, le climat |
| *OK boomer* (2019) | Formule moqueuse des jeunes envers leurs aînés |
| *Downton Abbey* (série, 2010-2015) | Un domaine aristocratique qui se transmet par héritage |
| Le **National Trust** (fondé en 1895) | Une association qui conserve maisons et paysages pour les générations futures |

## Vocabulaire utile
| Anglais | Français |
| relatives | les membres de la famille |
| sibling | le frère ou la sœur |
| blended family | la famille recomposée |
| the elderly | les personnes âgées |
| to inherit | hériter |
| heir | l’héritier |
| generation gap | le fossé des générations |
| to hand down | transmettre |

## Problématiques et documents
- *Is the generation gap wider today than before?*
- *What do second-generation immigrants inherit from their parents?*
- *Is climate change a generational divide?*
- Documents : une scène de *Bend It Like Beckham*, un graphique sur l’accès à la propriété selon l’âge, un discours de jeune militant pour le climat.

## Pour argumenter à l’oral
- *Unlike their parents, young people…* — Contrairement à leurs parents…
- *This is a matter of…* — C’est une question de…
- *To some extent, I agree that…* — Dans une certaine mesure…

> Exemple travaillé : pour comparer deux générations, construis une phrase en *whereas* : *Baby boomers could buy a house in their twenties, whereas many young Britons now rent until their thirties.*`,
          },
          questions: [
            ['Quel film de Gurinder Chadha (2002) raconte l’histoire d’une jeune Sikh passionnée de football ?', ['Slumdog Millionaire', 'East Is East', 'Billy Elliot', 'Bend It Like Beckham'], 3, 'Jess joue au football malgré les attentes de ses parents.'],
            ['Entre quelles années sont nés les baby boomers ?', ['1920-1935', '1946-1964', '1980-1995', '1965-1980'], 1, 'Le baby-boom suit la Seconde Guerre mondiale.'],
            ['« Sibling » désigne…', ['Un cousin', 'Un frère ou une sœur', 'Un parent éloigné', 'Un beau-parent'], 1, 'Mot neutre, sans distinction de sexe.'],
            ['Qui a écrit The Namesake (2003) ?', ['Zadie Smith', 'Salman Rushdie', 'Arundhati Roy', 'Jhumpa Lahiri'], 3, 'Jhumpa Lahiri, écrivaine américaine d’origine bengalie.'],
            ['Que signifie « a blended family » ?', ['Une famille recomposée', 'Une famille nombreuse', 'Une famille monoparentale', 'Une famille d’accueil'], 0, 'To blend = mélanger : deux familles se réunissent.'],
            ['Le National Trust a été fondé en…', ['1945', '1066', '1895', '1997'], 2, 'Il protège depuis 1895 maisons historiques et paysages.'],
            ['La formule « OK boomer » est employée par les jeunes pour se moquer de leurs aînés.', ['Vrai', 'Faux'], 0, 'Devenue virale en 2019, elle résume le fossé des générations.'],
            ['Quel verbe signifie « transmettre » (un objet, une tradition) ?', ['To hand out', 'To hand in', 'To hand over', 'To hand down'], 3, 'Down : de haut en bas, des anciens vers les jeunes.'],
            ['« The generation gap » désigne…', ['Une génération perdue', 'Le fossé des générations', 'Le taux de natalité', 'L’écart de salaire'], 1, 'Gap = écart, fossé.'],
            ['Quelle série raconte la vie d’un domaine aristocratique anglais transmis par héritage ?', ['The Crown', 'Peaky Blinders', 'Downton Abbey', 'Sherlock'], 2, 'La question de l’héritier (heir) est au cœur de l’intrigue.'],
            ['« The elderly » prend un article et désigne…', ['Les personnes âgées', 'Les aînés d’une fratrie', 'Les anciens élèves', 'Les ancêtres'], 0, 'Adjectif substantivé, toujours au pluriel de sens.'],
            ['Dans « Baby boomers could buy a house, whereas young people rent », « whereas » exprime…', ['Une cause', 'Un but', 'Une opposition', 'Une conséquence'], 2, 'Whereas met deux faits en regard.'],
          ],
        },

        // ---------------------------------------------------------- Axe 3 ---
        {
          titre: 'Mémoire, patrimoine et réconciliation',
          axe: AXE.passe,
          lecon: {
            titre: 'Facing the past',
            cours: `Un pays ne choisit pas son passé, mais il choisit ce qu’il en garde : des statues, des musées, des excuses officielles.

## Ce que recouvre l’axe
Le programme s’intéresse au **patrimoine** culturel, matériel et immatériel, comme témoin du passé, et aux stratégies — souvent politiques — pour le **protéger** et l’**interpréter**. Il invite surtout à voir comment un pays **tire les leçons de ses pages sombres** : oppression, conflits, discriminations.

## Repères culturels
| Repère | Ce qu’il montre |
| Les **Aborigènes** d’Australie, présents depuis plus de 60 000 ans | La plus ancienne culture vivante continue |
| **Uluru**, rendu aux Anangu en 1985 | Un lieu sacré restitué |
| L’arrêt **Mabo** (1992) | La Haute Cour reconnaît des droits fonciers autochtones et rejette l’idée d’une terre « à personne » (*terra nullius*) |
| Les **Stolen Generations** | Enfants aborigènes retirés à leurs familles (fin XIXe – années 1970) |
| La **National Apology** de Kevin Rudd (13 février 2008) | Le Premier ministre australien présente les excuses de l’État |
| La **Commission vérité et réconciliation** d’Afrique du Sud (1996), présidée par Desmond Tutu | Entendre victimes et bourreaux après l’apartheid |
| La commission canadienne (2008-2015) | Les pensionnats autochtones (*residential schools*) |
| La **statue d’Edward Colston** renversée à Bristol (7 juin 2020) | Un marchand d’esclaves déboulonné, puis exposé au musée |
| La Couronne : **Charles III**, roi en 2022, couronné le 6 mai 2023 | Une institution qui dure en se voulant neutre |

## Vocabulaire utile
| Anglais | Français |
| heritage | le patrimoine |
| legacy | l’héritage, ce qui reste |
| to commemorate | commémorer |
| to pay tribute to | rendre hommage à |
| to apologise | présenter ses excuses |
| reconciliation | la réconciliation |
| Indigenous peoples | les peuples autochtones |
| to tear down a statue | déboulonner une statue |

## Problématiques et documents
- *Should statues of controversial figures be torn down?*
- *Can an apology repair the past?*
- Documents : un extrait du discours de Kevin Rudd, une photo de Colston jeté dans le port, une peinture aborigène à points (*dot painting*).

## Pour argumenter à l’oral
- *It is important to remember that…*
- *Some people argue that…, while others claim that…*
- *This event marked a turning point in…* — Cet événement marqua un tournant…

> Exemple travaillé : *In 2008, Kevin Rudd apologised to the Stolen Generations. This apology did not erase the past, but it acknowledged the suffering of thousands of families.* — deux phrases : le fait daté, puis sa portée.`,
          },
          questions: [
            ['Quel Premier ministre australien a présenté les excuses officielles aux Stolen Generations en 2008 ?', ['John Howard', 'Kevin Rudd', 'Julia Gillard', 'Anthony Albanese'], 1, 'La National Apology date du 13 février 2008.'],
            ['Qui a présidé la Commission vérité et réconciliation d’Afrique du Sud ?', ['Nelson Mandela', 'Desmond Tutu', 'Frederik de Klerk', 'Thabo Mbeki'], 1, 'L’archevêque Desmond Tutu la préside à partir de 1996.'],
            ['Que désignent les « Stolen Generations » ?', ['Des soldats morts à la guerre', 'Des colons anglais', 'Des migrants européens', 'Des enfants aborigènes retirés à leurs familles'], 3, 'Stolen = volé : on leur a pris leur famille et leur culture.'],
            ['Quelle statue a été renversée à Bristol le 7 juin 2020 ?', ['Celle d’Edward Colston', 'Celle de Winston Churchill', 'Celle de Cecil Rhodes', 'Celle de la reine Victoria'], 0, 'Marchand d’esclaves, Colston a été jeté dans le port, puis sa statue exposée au musée.'],
            ['Que reconnaît l’arrêt Mabo de 1992 ?', ['Le droit de vote des femmes', 'L’indépendance de l’Australie', 'Des droits fonciers autochtones', 'La fin de la monarchie'], 2, 'Il rejette la fiction d’une terre « à personne » (terra nullius).'],
            ['« Legacy » se traduit le plus souvent par…', ['La légende', 'La loi', 'Le légat du pape', 'L’héritage, ce que l’on laisse'], 3, 'Un faux ami partiel : ce qu’une personne ou une époque laisse derrière elle.'],
            ['Uluru a été rendu à ses propriétaires traditionnels, les Anangu, en 1985.', ['Vrai', 'Faux'], 0, 'Le site est depuis cogéré avec l’État.'],
            ['Quel verbe signifie « rendre hommage à » ?', ['To pay back', 'To pay tribute to', 'To pay off', 'To pay attention'], 1, 'Tribute = hommage.'],
            ['Quand Charles III a-t-il été couronné ?', ['Le 8 septembre 2022', 'Le 2 juin 1953', 'Le 6 mai 2023', 'Le 29 avril 2011'], 2, 'Il devient roi le 8 septembre 2022 et est couronné le 6 mai 2023.'],
            ['Que désignent les « residential schools » au Canada ?', ['Des pensionnats où l’on retirait aux enfants autochtones leur culture', 'Des universités d’élite', 'Des écoles de quartier', 'Des cours à domicile'], 0, 'Une commission a enquêté sur ces pensionnats de 2008 à 2015.'],
            ['Quelle expression introduit deux avis opposés ?', ['As a result…', 'For instance…', 'Some people argue that…, while others claim that…', 'First of all…'], 2, 'While met en regard les deux camps du débat.'],
            ['« To apologise » signifie…', ['Présenter ses excuses', 'Faire l’apologie', 'Accuser', 'Oublier'], 0, 'Faux ami : faire l’apologie se dit to praise.'],
          ],
        },

        // ---------------------------------------------------------- Axe 4 ---
        {
          titre: 'Mobilisations et espaces en mutation',
          axe: AXE.defis,
          lecon: {
            titre: 'Changing times, changing places',
            cours: `Des mineurs en grève aux hashtags, des premières lignes de métro aux jardins suspendus : le monde anglophone change, et ses habitants se mobilisent.

## Ce que recouvre l’axe
Le programme demande dans quelle mesure les grands **bouleversements** écologiques, démographiques et sociaux changent notre rapport à l’**espace** et à la **nature**. Il replace ces enjeux dans une perspective historique, et s’appuie volontiers sur la **fiction** (romans, films) pour les nuancer.

## Repères culturels
| Repère | Ce qu’il montre |
| Les **Tolpuddle Martyrs** (1834) | Six ouvriers agricoles déportés pour avoir fondé un syndicat |
| La **grève des mineurs** (1984-1985) contre Margaret Thatcher | Le déclin des *trade unions* |
| **#MeToo** (2017, expression lancée par Tarana Burke en 2006) | La mobilisation passe par les réseaux sociaux |
| **#BlackLivesMatter** (2013, puis 2020) | Un mot-clé devenu mouvement |
| Le **métro de Londres** (1863) | Le premier chemin de fer souterrain du monde |
| Le **péage urbain** de Londres (*congestion charge*, 2003) | Faire payer la voiture pour libérer la ville |
| La **High Line** de New York (2009) | Une voie ferrée aérienne devenue jardin |
| **Detroit** | Une ville de l’automobile qui s’est vidée |

## Vocabulaire utile
| Anglais | Français |
| trade union | le syndicat |
| to go on strike | faire grève |
| to raise awareness | sensibiliser |
| a demonstration | une manifestation |
| urban sprawl | l’étalement urbain |
| commuter | la personne qui fait le trajet domicile-travail |
| to recycle | recycler |
| greenhouse gas emissions | les émissions de gaz à effet de serre |

## Problématiques et documents
- *From trade unions to hashtags: has protest changed?*
- *How can cities be rethought for tomorrow?*
- Documents : une affiche syndicale, un tweet militant, un plan du métro, une photo de la High Line.

## Pour argumenter à l’oral
- *Nowadays, more and more people…*
- *This shows / proves that…*
- *As a consequence, …* — Par conséquent…
- *It remains to be seen whether…* — Reste à savoir si…

> Exemple travaillé : *In 1834, joining a union could get you deported; today, a hashtag can mobilise millions of people in a few hours. Protest has not disappeared: it has moved online.*`,
          },
          questions: [
            ['Pourquoi les Tolpuddle Martyrs ont-ils été condamnés en 1834 ?', ['Pour vol', 'Pour avoir formé un syndicat', 'Pour trahison envers le roi', 'Pour avoir refusé l’impôt'], 1, 'Ils sont devenus les héros fondateurs du syndicalisme britannique.'],
            ['Contre quel Premier ministre les mineurs britanniques font-ils grève en 1984-1985 ?', ['Tony Blair', 'Winston Churchill', 'Harold Wilson', 'Margaret Thatcher'], 3, 'La défaite des mineurs affaiblit durablement les syndicats.'],
            ['Quelle ville possède le plus ancien métro du monde (1863) ?', ['Londres', 'Paris', 'New York', 'Boston'], 0, 'Le Metropolitan Railway ouvre à Londres en 1863.'],
            ['Que signifie « to go on strike » ?', ['Frapper fort', 'Manifester', 'Faire grève', 'Démissionner'], 2, 'Strike = la grève.'],
            ['Quelle activiste a lancé l’expression « Me Too » dès 2006 ?', ['Rosa Parks', 'Michelle Obama', 'Malala Yousafzai', 'Tarana Burke'], 3, 'L’expression devient virale en 2017 avec le hashtag #MeToo.'],
            ['Qu’est-ce que la High Line de New York ?', ['Un pont suspendu', 'Une ancienne voie ferrée aérienne transformée en jardin', 'Une autoroute', 'Une ligne de métro'], 1, 'Ouverte en 2009, elle illustre la reconversion des espaces urbains.'],
            ['« Urban sprawl » désigne…', ['Le métro', 'La densité urbaine', 'L’étalement urbain', 'Un quartier pauvre'], 2, 'To sprawl = s’étaler.'],
            ['Le péage urbain de Londres a été instauré en 2003.', ['Vrai', 'Faux'], 0, 'La congestion charge fait payer l’entrée des voitures dans le centre.'],
            ['Un « commuter » est…', ['Une personne qui fait chaque jour le trajet domicile-travail', 'Un ordinateur', 'Un élu local', 'Un chauffeur de taxi'], 0, 'To commute = faire la navette.'],
            ['Que signifie « to raise awareness » ?', ['Lever la main', 'Augmenter les prix', 'Sensibiliser', 'Réveiller quelqu’un'], 2, 'Awareness = la conscience, le fait d’être informé.'],
            ['Quel connecteur introduit une conséquence ?', ['As a consequence', 'However', 'Although', 'For instance'], 0, 'As a consequence = par conséquent.'],
            ['Quelle ville américaine, capitale de l’automobile, a perdu une grande partie de sa population ?', ['Seattle', 'Austin', 'Miami', 'Detroit'], 3, 'La Motor City symbolise la désindustrialisation.'],
          ],
        },

        // ---------------------------------------------------------- Axe 5 ---
        {
          titre: 'Mythes, légendes et réécritures',
          axe: AXE.creer,
          lecon: {
            titre: 'Old stories, new versions',
            cours: `Roméo et Juliette dansent à New York, le cowboy devient un héros fragile, Robin des Bois change de visage à chaque siècle : les histoires anciennes ne meurent pas, elles se réécrivent.

## Ce que recouvre l’axe
Le programme demande comment les **mythes**, les **légendes** et les **œuvres classiques** sont revisités ou exploités, et comment ces réécritures suivent — ou provoquent — des **changements dans la société**.

## Repères culturels
| Repère | Ce qu’il montre |
| Le **cowboy** du *Buffalo Bill’s Wild West* (spectacle, à partir de 1883) | L’Ouest mis en scène pour le public |
| *Stagecoach* de John Ford (1939), avec John Wayne | Le cowboy héroïque du western classique |
| *Brokeback Mountain* (Ang Lee, 2005) | Deux cowboys amoureux : le mythe viril remis en question |
| **Robin Hood** et le roi **Arthur** | Des légendes médiévales réinventées sans cesse |
| *Romeo and Juliet* (Shakespeare, vers 1595) → *West Side Story* (comédie musicale 1957, films 1961 et 2021) | Vérone devient le New York des gangs |
| Le panneau **Hollywood** (1923, « Hollywoodland » à l’origine) | L’usine à rêves |
| *La La Land* (2016), *Once Upon a Time in Hollywood* (2019) | Hollywood se met lui-même en scène |

## Vocabulaire utile
| Anglais | Français |
| a myth / a legend | un mythe / une légende |
| a remake | une nouvelle version d’un film |
| an adaptation | une adaptation |
| plot | l’intrigue |
| to retell | raconter à nouveau |
| a hero / a heroine | un héros / une héroïne |
| storytelling | l’art de raconter |
| the Wild West | le Far West |

## Problématiques et documents
- *Why do we keep retelling the same stories?*
- *Is the cowboy still an American hero?*
- Documents : une affiche de western, une scène de *West Side Story*, deux versions d’un même conte.

## Pour argumenter à l’oral
- *This version is more faithful to / departs from the original.* — plus fidèle à / s’éloigne de l’original.
- *The director updates the story by…*
- *What strikes me is that…* — Ce qui me frappe, c’est que…

> Exemple travaillé : *West Side Story keeps the plot of Romeo and Juliet — two young lovers from rival groups — but replaces the Montagues and Capulets with two New York gangs, the Jets and the Sharks. The story becomes a reflection on racism and immigration.*`,
          },
          questions: [
            ['De quelle pièce de Shakespeare West Side Story est-il une réécriture ?', ['Hamlet', 'Macbeth', 'Othello', 'Romeo and Juliet'], 3, 'Les Jets et les Sharks remplacent les Montaigu et les Capulet.'],
            ['Quel acteur est l’icône du western classique, notamment dans Stagecoach (1939) ?', ['John Wayne', 'Clint Eastwood', 'James Dean', 'Marlon Brando'], 0, 'Le film de John Ford le rend célèbre.'],
            ['Que disait à l’origine le panneau Hollywood installé en 1923 ?', ['Hollywood Studios', 'Holy Wood', 'Hollywoodland', 'Los Angeles'], 2, 'C’était une publicité pour un lotissement.'],
            ['En quoi Brokeback Mountain (2005) bouscule-t-il le mythe du cowboy ?', ['Il se passe dans l’espace', 'Il n’a aucun cheval', 'Il est muet', 'Il montre deux cowboys amoureux'], 3, 'La figure virile du cowboy est remise en question.'],
            ['« Plot » se traduit par…', ['Le complot seulement', 'L’intrigue', 'Le décor', 'Le personnage'], 1, 'The plot of a novel = l’intrigue ; le mot peut aussi désigner un complot.'],
            ['Buffalo Bill a créé un spectacle sur le Far West à partir de 1883.', ['Vrai', 'Faux'], 0, 'Le Buffalo Bill’s Wild West a même tourné en Europe.'],
            ['Que signifie « to retell » ?', ['Mentir', 'Répondre', 'Raconter à nouveau', 'Résumer'], 2, 'Le préfixe re- marque la répétition.'],
            ['Quels deux gangs s’affrontent dans West Side Story ?', ['Les Jets et les Sharks', 'Les Bloods et les Crips', 'Les Mods et les Rockers', 'Les Yankees et les Rebels'], 0, 'Les Sharks sont d’origine portoricaine.'],
            ['Quelle expression dit qu’une version « s’éloigne de l’original » ?', ['It is faithful to the original', 'It copies the original', 'It departs from the original', 'It ignores the audience'], 2, 'To depart from = s’écarter de.'],
            ['Quel héros légendaire vole aux riches pour donner aux pauvres ?', ['Robin Hood', 'King Arthur', 'Merlin', 'Beowulf'], 0, 'La légende de la forêt de Sherwood est adaptée à chaque époque.'],
            ['« A remake » est…', ['Une suite', 'Un documentaire', 'Une bande-annonce', 'Un film tourné à nouveau à partir d’un film existant'], 3, 'Remake = refaire.'],
            ['Quel film de 2016 met en scène deux jeunes artistes qui rêvent de réussir à Los Angeles ?', ['Titanic', 'La La Land', 'Grease', 'Barbie'], 1, 'Hollywood y raconte ses propres rêves.'],
          ],
        },

        // ---------------------------------------------------------- Axe 6 ---
        {
          titre: 'Le Commonwealth, de l’Empire aux indépendances',
          axe: AXE.commonwealth,
          lecon: {
            titre: 'From Empire to Commonwealth',
            cours: `Le plus grand empire de l’histoire s’est défait en quelques décennies ; ce qui en reste, c’est une famille de 56 pays libres qui choisissent de rester liés.

## Ce que recouvre l’axe (obligatoire)
Le **Commonwealth of Nations** rassemble des pays qui partagent une langue et un héritage politique complexe. Le programme demande quelle place il occupe dans le monde anglophone et comment ses membres y évoluent **tout en affirmant leur singularité**. C’est l’axe que ta classe étudie forcément cette année.

## De l’Empire au Commonwealth
| Date | Étape |
| 1926 | La **déclaration Balfour** reconnaît les dominions (Canada, Australie…) comme égaux au Royaume-Uni |
| 1931 | Le **Statut de Westminster** leur donne l’indépendance législative |
| 15 août 1947 | **Indépendance de l’Inde** et partition avec le Pakistan |
| 1949 | La **déclaration de Londres** : on peut être membre en étant une république ; le « British » disparaît du nom |
| 1957 | Le **Ghana** de Kwame Nkrumah, première colonie d’Afrique subsaharienne indépendante |
| 1961 | L’Afrique du Sud de l’apartheid quitte le Commonwealth (elle y revient en 1994) |
| 2022 | Le **Gabon** et le **Togo**, jamais colonisés par Londres, adhèrent |

## Comment fonctionne-t-il ?
1. **56 États** membres, libres et égaux, dont une majorité de républiques.
2. Un **chef symbolique**, le souverain britannique : Charles III depuis 2022.
3. Environ quinze **royaumes** (*Commonwealth realms* : Canada, Australie, Jamaïque…) ont gardé le roi comme chef d’État.
4. Un sommet tous les deux ans environ, le **CHOGM**, et des **Commonwealth Games** tous les quatre ans (les premiers : Hamilton, Canada, 1930).

## Vocabulaire utile
| Anglais | Français |
| the British Empire | l’Empire britannique |
| a colony | une colonie |
| independence | l’indépendance |
| to gain independence | accéder à l’indépendance |
| decolonisation | la décolonisation |
| a member state | un État membre |
| the Crown | la Couronne |
| partition | la partition |

## Pour argumenter à l’oral
- *The Commonwealth is often described as…*
- *It is a legacy of the British Empire, yet…*
- *What unites these countries is…*

> Exemple travaillé : *Why do former colonies stay in the Commonwealth? Membership is voluntary: countries stay for trade, education and sport, not out of loyalty to the Crown.*`,
          },
          questions: [
            ['Combien de pays compte le Commonwealth of Nations ?', ['56', '12', '27', '193'], 0, 'Depuis l’adhésion du Gabon et du Togo en 2022.'],
            ['Quand l’Inde devient-elle indépendante ?', ['Le 4 juillet 1776', 'Le 26 janvier 1950', 'Le 15 août 1947', 'Le 1er juillet 1867'], 2, 'L’indépendance s’accompagne de la partition avec le Pakistan.'],
            ['Quel est le premier pays d’Afrique subsaharienne à devenir indépendant, en 1957 ?', ['Le Nigeria', 'Le Kenya', 'L’Afrique du Sud', 'Le Ghana'], 3, 'Sous la conduite de Kwame Nkrumah.'],
            ['Qui est le chef du Commonwealth depuis 2022 ?', ['Le Premier ministre britannique', 'Charles III', 'Le secrétaire général de l’ONU', 'Le président de l’Inde'], 1, 'Un rôle symbolique, sans pouvoir politique.'],
            ['Que permet la déclaration de Londres de 1949 ?', ['De créer l’euro', 'De dissoudre l’Empire', 'De rester membre en devenant une république', 'D’interdire les Jeux'], 2, 'L’Inde, républicaine, peut ainsi rester membre.'],
            ['Tous les membres du Commonwealth ont été des colonies britanniques.', ['Vrai', 'Faux'], 1, 'Le Mozambique, le Rwanda, le Gabon et le Togo n’en ont jamais été.'],
            ['« To gain independence » signifie…', ['Accéder à l’indépendance', 'Perdre son indépendance', 'Refuser l’indépendance', 'Célébrer l’indépendance'], 0, 'To gain = obtenir, gagner.'],
            ['Qu’est-ce qu’un « Commonwealth realm » ?', ['Une ancienne colonie française', 'Une république du Commonwealth', 'Un pays qui a gardé le souverain britannique comme chef d’État', 'Un territoire sans gouvernement'], 2, 'Le Canada, l’Australie ou la Jamaïque, par exemple.'],
            ['Où se sont déroulés les premiers Jeux de l’Empire britannique, en 1930 ?', ['À Hamilton, au Canada', 'À Londres', 'À Sydney', 'À Delhi'], 0, 'Ils sont devenus les Commonwealth Games.'],
            ['Que reconnaît la déclaration Balfour de 1926 ?', ['L’indépendance de l’Irlande', 'La fin de l’esclavage', 'La création de l’ONU', 'L’égalité des dominions avec le Royaume-Uni'], 3, 'Le Statut de Westminster (1931) la traduit en droit.'],
            ['Quel pays quitte le Commonwealth en 1961 à cause de l’apartheid ?', ['Le Canada', 'L’Afrique du Sud', 'L’Inde', 'La Nouvelle-Zélande'], 1, 'Il y revient en 1994, après la fin de l’apartheid.'],
            ['Quel sigle désigne le sommet des chefs de gouvernement du Commonwealth ?', ['G7', 'CHOGM', 'NATO', 'UN'], 1, 'Commonwealth Heads of Government Meeting.'],
          ],
        },
        {
          titre: 'Le Commonwealth aujourd’hui : littératures et héritages',
          axe: AXE.commonwealth,
          lecon: {
            titre: 'Writing back to the Empire',
            cours: `L’anglais est la langue de l’ancien colonisateur ; des écrivains du Nigeria, de l’Inde ou des Caraïbes s’en sont emparés pour raconter leur propre histoire.

## Ce que l’héritage britannique a laissé
1. **La langue** : l’anglais, langue commune des 56 membres, souvent à côté de langues nationales (hindi, swahili…).
2. **Le système de Westminster** : un Parlement, un Premier ministre issu de la majorité, une opposition officielle — au Canada, en Inde, en Australie.
3. **La common law** : un droit fondé sur les décisions des juges.
4. **Le sport** : le cricket et le rugby unissent l’Inde, l’Australie, l’Afrique du Sud ou les Antilles.
5. **Des fêtes** : le *Commonwealth Day*, deuxième lundi de mars.

## Les littératures du Commonwealth
| Œuvre | Auteur, pays, date | Ce qu’elle raconte |
| *Things Fall Apart* | Chinua Achebe, Nigeria, 1958 | Une société igbo bouleversée par l’arrivée des colons |
| *Midnight’s Children* | Salman Rushdie, Inde, 1981 (Booker Prize) | Les enfants nés à minuit le jour de l’indépendance |
| *The God of Small Things* | Arundhati Roy, Inde, 1997 (Booker Prize) | Castes et famille dans le Kerala |
| *Half of a Yellow Sun* | Chimamanda Ngozi Adichie, Nigeria, 2006 | La guerre du Biafra |
| *Long Walk to Freedom* | Nelson Mandela, Afrique du Sud, 1994 | L’autobiographie d’un prisonnier devenu président |

On parle de littérature **postcoloniale** : elle « répond » à l’Empire (*the Empire writes back*) en racontant l’histoire du point de vue des colonisés.

## Unité et diversité
Le Commonwealth réunit des pays immenses (l’Inde) et minuscules (Nauru), riches et pauvres, qui n’ont en commun ni religion, ni régime, ni continent. Les **valeurs** inscrites dans la *Commonwealth Charter* (2013) — démocratie, droits humains, État de droit — sont ce qui les rassemble.

## Vocabulaire utile
| Anglais | Français |
| a novelist | un romancier |
| postcolonial | postcolonial |
| to shape an identity | façonner une identité |
| common law | le droit coutumier jurisprudentiel |
| a caste | une caste |
| diversity | la diversité |
| ties | les liens |

## Pour argumenter à l’oral
- *Through this novel, the author gives a voice to…*
- *These countries share a common heritage, but…*
- *Despite their differences, …*

> Exemple travaillé : *In Things Fall Apart, Achebe writes in English, the language of the colonisers, to tell the story of the colonised. He turns the Empire’s language into a tool to rewrite history.*`,
          },
          questions: [
            ['Qui a écrit Things Fall Apart (1958) ?', ['Wole Soyinka', 'Ngugi wa Thiong’o', 'Chinua Achebe', 'Nelson Mandela'], 2, 'Le roman nigérian le plus lu au monde.'],
            ['De quoi parle Midnight’s Children de Salman Rushdie ?', ['D’un conte de Noël', 'De la guerre du Biafra', 'D’une école anglaise', 'D’enfants nés à minuit le jour de l’indépendance de l’Inde'], 3, 'Leur destin se mêle à celui de l’Inde indépendante.'],
            ['Quel jour célèbre-t-on le Commonwealth Day ?', ['Le 25 décembre', 'Le deuxième lundi de mars', 'Le 4 juillet', 'Le 1er janvier'], 1, 'Le Commonwealth Day tombe chaque année le deuxième lundi de mars.'],
            ['Qu’appelle-t-on le « système de Westminster » ?', ['Un système de défense', 'Une monnaie commune', 'Un modèle parlementaire hérité du Royaume-Uni', 'Une église'], 2, 'Parlement, Premier ministre issu de la majorité, opposition officielle.'],
            ['Quel sport est emblématique du Commonwealth, de l’Inde aux Antilles ?', ['Le cricket', 'Le baseball', 'Le hockey sur glace', 'Le basket-ball'], 0, 'Un héritage direct de l’Empire.'],
            ['Chimamanda Ngozi Adichie a écrit Half of a Yellow Sun sur la guerre du Biafra.', ['Vrai', 'Faux'], 0, 'Roman publié en 2006.'],
            ['Que signifie l’expression « the Empire writes back » ?', ['L’Empire publie des journaux', 'Les rois écrivent leurs mémoires', 'Les anciens colonisés répondent à l’Empire par la littérature', 'La Couronne censure les livres'], 2, 'Elle désigne la littérature postcoloniale.'],
            ['Quelle œuvre est l’autobiographie de Nelson Mandela ?', ['Long Walk to Freedom', 'The God of Small Things', 'Half of a Yellow Sun', 'Things Fall Apart'], 0, 'Publiée en 1994, l’année de son élection.'],
            ['Arundhati Roy a reçu le Booker Prize pour…', ['Midnight’s Children', 'White Teeth', 'Wolf Hall', 'The God of Small Things'], 3, 'En 1997, pour ce roman situé au Kerala.'],
            ['Quel texte de 2013 énonce les valeurs communes du Commonwealth ?', ['La Magna Carta', 'La Commonwealth Charter', 'Le Bill of Rights', 'La Déclaration d’indépendance'], 1, 'Démocratie, droits humains, État de droit.'],
            ['« Ties » dans « economic ties » signifie…', ['Les cravates', 'Les liens', 'Les dettes', 'Les frontières'], 1, 'Tie = lien (et aussi cravate, selon le contexte).'],
            ['Quelle phrase met en avant ce qui unit malgré les différences ?', ['These countries are all identical.', 'Nothing unites these countries.', 'These countries are all monarchies.', 'Despite their differences, these countries share a language.'], 3, 'Despite + nom : malgré leurs différences.'],
          ],
        },
      ],
    },

    // ================================ LA LANGUE =============================
    {
      niveaux: ['2de'],
      positionDepart: 32,
      rayon: 'langue',
      chapitres: [
        {
          titre: 'Les pronoms réfléchis et réciproques',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Myself, each other — qui fait quoi à qui',
            cours: `« Ils se regardent » : dans un miroir, ou l’un l’autre ? Le français dit « se » dans les deux cas ; l’anglais, lui, tranche.

## Les pronoms réfléchis
Ils se forment avec **-self** au singulier et **-selves** au pluriel.

| Sujet | Réfléchi |
| I | myself |
| you (singulier) | yourself |
| he / she / it | himself / herself / itself |
| we | ourselves |
| you (pluriel) | yourselves |
| they | themselves |
| one | oneself |

On les emploie quand le sujet et le complément sont **la même personne** : *She introduced herself.* (Elle s’est présentée.) — *Enjoy yourselves!* (Amusez-vous bien !)

## Réfléchi ou réciproque ?
| Réfléchi : chacun sur soi | Réciproque : l’un sur l’autre |
| *They looked at themselves in the mirror.* | *They looked at each other.* |
| Ils se sont regardés dans le miroir. | Ils se sont regardés (l’un l’autre). |

**Each other** et **one another** sont les pronoms réciproques ; dans l’usage courant, ils sont interchangeables.

## Le piège : les verbes « pronominaux » français
Beaucoup de verbes pronominaux français n’ont **pas** de réfléchi en anglais.

| Français | Anglais |
| se lever | *to get up* |
| se réveiller | *to wake up* |
| se souvenir | *to remember* |
| se dépêcher | *to hurry* |
| se sentir bien | *to feel good* |
| se rencontrer | *to meet* |
| s’habiller | *to get dressed* |

*I got up at seven* — jamais *I got myself up*.

## L’emphase et « tout seul »
1. Le réfléchi peut **insister** : *I did it myself* (je l’ai fait moi-même). *The Queen herself came.*
2. **By + réfléchi** = tout seul, sans aide : *She lives by herself.*

> Réfléchi = l’action revient sur le sujet. Réciproque = l’action va de l’un à l’autre. Et avant d’ajouter un « self », vérifie que le verbe anglais en veut un.

## Exemple travaillé
« Ils se sont disputés, puis ils se sont excusés l’un auprès de l’autre, et chacun s’est senti mieux. » → *They argued, then they apologised to each other, and they both felt better.* Trois « se » en français, un seul pronom en anglais.`,
          },
          questions: [
            ['Quel est le pronom réfléchi de « we » ?', ['ourself', 'usselves', 'weselves', 'ourselves'], 3, 'Pluriel en -selves, construit sur our.'],
            ['« They looked at each other » signifie…', ['Ils se sont regardés dans le miroir', 'Ils se sont regardés l’un l’autre', 'Ils ont regardé les autres', 'Chacun a regardé ailleurs'], 1, 'Each other marque la réciprocité.'],
            ['Complète : « She introduced ___ to the class. »', ['her', 'hers', 'herself', 'himself'], 2, 'Sujet et complément sont la même personne.', 'Quel pronom convient après « introduced » ?'],
            ['Comment traduire « Je me suis levé à sept heures » ?', ['I got up at seven.', 'I raised myself at seven.', 'I got myself up at seven.', 'I stood me at seven.'], 0, 'To get up n’a pas besoin de pronom réfléchi.'],
            ['« She lives by herself » signifie…', ['Elle vit près de chez elle', 'Elle vit pour elle-même', 'Elle vit toute seule', 'Elle vit avec sa sœur'], 2, 'By + réfléchi = sans personne.'],
            ['Quel est le réfléchi de « they » ?', ['themselves', 'themself', 'theirselves', 'theyselves'], 0, 'Construit sur them, au pluriel.'],
            ['Dans « I did it myself », le pronom réfléchi…', ['Est une faute', 'Marque la réciprocité', 'Remplace le sujet', 'Insiste : moi-même, sans aide'], 3, 'C’est l’emploi emphatique.'],
            ['« Se souvenir » se traduit par « to remember oneself ».', ['Vrai', 'Faux'], 1, 'On dit simplement to remember.'],
            ['« Enjoy yourselves! » s’adresse…', ['À une seule personne', 'À plusieurs personnes', 'À soi-même', 'À un animal'], 1, 'Yourselves est le pluriel de yourself.'],
            ['Complète : « The two friends helped ___ with their homework. »', ['themselves', 'each other', 'theirselves', 'them'], 1, 'Chacun aide l’autre : c’est réciproque.', 'Quel pronom indique que les deux amis s’aident mutuellement ?'],
            ['Comment traduire « s’habiller » ?', ['to dress oneself up', 'to wear oneself', 'to clothe', 'to get dressed'], 3, 'L’anglais courant dit to get dressed.'],
            ['Quel pronom réfléchi correspond à « it » ?', ['itself', 'itselves', 'its self', 'himself'], 0, 'The door closed by itself.'],
          ],
        },
        {
          titre: 'Les noms composés et les adjectifs composés',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'A teacup, a ten-minute break',
            cours: `Là où le français empile des prépositions (« une tasse à thé », « une pause de dix minutes »), l’anglais colle les mots — et le mot important est toujours **à droite**.

## La règle d’or : on lit de droite à gauche
Dans un nom composé, le **dernier** nom est le nom principal ; ce qui précède le précise.

| Anglais | Ce que c’est | Français |
| *a teacup* | une tasse | une tasse à thé |
| *a cup of tea* | du thé | une tasse de thé |
| *a sports car* | une voiture | une voiture de sport |
| *a car park* | un parc | un parking |
| *the Home Secretary* | un ministre | le ministre de l’Intérieur |

> *A teacup* est une tasse (vide ou pleine) ; *a cup of tea* est le thé qu’elle contient. Le nom de droite dit toujours de quoi on parle.

## Trois façons d’assembler deux noms
1. **Nom + nom** : *a history teacher, a bus stop, a sportsman* (parfois soudés en un seul mot).
2. **Nom’s + nom** (génitif de catégorie) : *a children’s book* (un livre pour enfants), *a day’s work* (une journée de travail).
3. **Nom of nom** : pour une **quantité** ou un **contenu** : *a pair of shoes, a piece of advice, a cup of tea*.

## Le premier nom ne prend pas de -s
Le premier nom joue le rôle d’un adjectif : il reste **au singulier**.
- *a shoe shop* (un magasin de chaussures), pas *a shoes shop* ;
- *a ten-year-old girl*, pas *a ten-years-old girl*.

## Les adjectifs composés
Ils s’écrivent avec des **traits d’union** et se placent devant le nom.

| Structure | Exemple | Sens |
| nombre + nom | *a ten-minute break* | une pause de dix minutes |
| adjectif + nom + -ed | *a black-haired man* | un homme aux cheveux noirs |
| adverbe + participe | *a well-known singer* | un chanteur célèbre |
| nom + participe en -ing | *a heart-breaking story* | une histoire déchirante |
| nom + participe passé | *a home-made cake* | un gâteau fait maison |

Attention : *a ten-minute break* (adjectif, pas de -s) mais *a break of ten minutes* (nom, avec -s).

## Exemple travaillé
« Un garçon de quinze ans aux yeux bleus lit un roman policier dans une salle d’attente. » → *A blue-eyed fifteen-year-old boy is reading a detective novel in a waiting room.* On part du nom principal (*boy*, *novel*, *room*) et on empile les précisions à sa gauche.`,
          },
          questions: [
            ['Que désigne « a teacup » ?', ['Une tasse de thé', 'Une tasse à thé', 'Un sachet de thé', 'Une théière'], 1, 'Le nom de droite (cup) est l’objet ; tea le précise.'],
            ['Comment dire « une pause de dix minutes » avec un adjectif composé ?', ['a ten-minutes break', 'a ten minutes’ break', 'a ten-minute break', 'a break ten-minute'], 2, 'Le nom employé comme adjectif reste au singulier.'],
            ['« A children’s book » signifie…', ['Un livre pour enfants', 'Le livre des enfants de quelqu’un', 'Un livre écrit par un enfant précis', 'Des livres d’enfants'], 0, 'Génitif de catégorie : un type de livre.'],
            ['Dans « a sports car », quel est le nom principal ?', ['sports', 'a', 'car', 'les deux'], 2, 'On lit de droite à gauche : c’est une voiture.'],
            ['Laquelle de ces formes est correcte ?', ['a shoe shop', 'a shoes shop', 'a shop of shoes', 'a shoe’s shop'], 0, 'Le premier nom reste au singulier.'],
            ['« A black-haired man » est…', ['Un homme noir', 'Un coiffeur', 'Un homme chauve', 'Un homme aux cheveux noirs'], 3, 'Adjectif + nom + -ed.'],
            ['On écrit « a ten-years-old girl ».', ['Vrai', 'Faux'], 1, 'On écrit a ten-year-old girl : pas de -s dans l’adjectif composé.'],
            ['Quelle structure convient pour une quantité ?', ['a shoes pair', 'a pair of shoes', 'a shoes’ pair', 'a pair-shoes'], 1, 'Nom of nom pour la quantité ou le contenu.'],
            ['Que signifie « the Home Secretary » ?', ['La secrétaire à domicile', 'Le ministre de l’Intérieur', 'Le chef de famille', 'Le président de l’Assemblée'], 1, 'Un titre politique britannique.'],
            ['« A home-made cake » est…', ['Un gâteau acheté', 'Un gâteau pour la maison', 'Un gâteau d’anniversaire', 'Un gâteau fait maison'], 3, 'Nom + participe passé.'],
            ['Comment traduire « une histoire déchirante » ?', ['a heart-breaking story', 'a heart-broken story', 'a breaking-heart story', 'a story heart-breaking'], 0, 'Participe en -ing : c’est l’histoire qui brise le cœur.'],
            ['Dans « a well-known singer », « well-known » se place…', ['Après le nom', 'En fin de phrase', 'Devant le nom', 'N’importe où'], 2, 'Comme tout adjectif épithète anglais.'],
          ],
        },
        {
          titre: 'Les partitifs : most of us, some of them',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Most people ou most of the people ?',
            cours: `« La plupart des élèves », « certains d’entre nous », « aucun d’eux » : pour parler d’une partie d’un groupe, l’anglais a une règle simple — encore faut-il savoir quand mettre **of**.

## Les mots qui expriment une partie
| Anglais | Français |
| all | tous, tout |
| most | la plupart |
| many / much | beaucoup |
| some | certains, une partie |
| a few / a little | quelques-uns / un peu |
| none | aucun |
| half | la moitié |
| both | les deux |

## Avec ou sans « of » : tout dépend de ce qui suit
1. Devant un **nom sans déterminant**, on parle **en général** : **pas de of**.
   *Most people like music.* — La plupart des gens (en général).
2. Devant un groupe **précis** (the, my, these…) ou un **pronom**, on met **of**.
   *Most of the students in my class like music.* — La plupart des élèves de ma classe.
   *Most of us agree.* — La plupart d’entre nous.

| En général | Un groupe précis |
| *Most teenagers use social media.* | *Most of my friends use social media.* |
| *Some people disagree.* | *Some of them disagree.* |

> Pas de déterminant → pas de *of*. Un *the*, un possessif ou un pronom → *of*. Et après *of*, le pronom est toujours complément : *of us, of them*, jamais *of we*.

## None of : « aucun d’entre eux »
*None of them came.* La négation est **déjà dans none** : on ne rajoute pas *not*. Avec un nom pluriel, le verbe peut être au singulier (plus soutenu) ou au pluriel (courant) : *None of my friends is / are here.*

## All et both : « of » facultatif
Devant *the* ou un possessif, **of** est facultatif : *all (of) the students, both (of) my parents*. Devant un pronom, il est obligatoire : *all of them, both of us*.

## Le verbe s’accorde avec le nom
*Most of the cake **was** eaten* (le gâteau : indénombrable). *Most of the cakes **were** eaten* (les gâteaux : pluriel).

## Exemple travaillé
« La plupart des Britanniques boivent du thé, mais aucun de mes cousins n’aime ça, et la moitié d’entre nous préfère le café. » → *Most British people drink tea, but none of my cousins likes it, and half of us prefer coffee.*`,
          },
          questions: [
            ['Complète : « ___ people like music. » (en général)', ['Most of', 'The most', 'Most', 'Most of the'], 2, 'Nom sans déterminant : pas de of.', 'Quelle forme convient pour parler des gens en général ?'],
            ['Laquelle est correcte ?', ['Most of us agree.', 'Most of we agree.', 'Most us agree.', 'The most of us agree.'], 0, 'Après of, le pronom est complément : us.'],
            ['« None of them came » signifie…', ['Ils sont tous venus', 'Certains sont venus', 'Aucun d’eux n’est venu', 'Personne ne les a invités'], 2, 'None contient déjà la négation.'],
            ['On peut écrire « None of them didn’t come » pour dire « aucun n’est venu ».', ['Vrai', 'Faux'], 1, 'Double négation fautive : None of them came.'],
            ['Complète : « Most ___ my friends play video games. »', ['of', 'the', 'from', 'in'], 0, 'Devant un possessif, on met of.', 'Quel mot relie « most » à « my friends » ?'],
            ['Comment dire « les deux » devant un pronom ?', ['both us', 'the both us', 'both we', 'both of us'], 3, 'Devant un pronom, of est obligatoire.'],
            ['Dans « all the students », « of » est…', ['Obligatoire', 'Facultatif', 'Interdit', 'Placé à la fin'], 1, 'All (of) the students : les deux se disent.'],
            ['Choisis le bon verbe : « Most of the cake ___ eaten. »', ['were', 'was', 'are', 'have'], 1, 'Cake ici est indénombrable (le gâteau) : singulier.', 'Quel verbe s’accorde avec « most of the cake » ?'],
            ['Quel mot signifie « la moitié » ?', ['halves', 'middle', 'part', 'half'], 3, 'Half of us : la moitié d’entre nous.'],
            ['« Some of them disagree » signifie…', ['Certains d’entre eux ne sont pas d’accord', 'Ils sont tous d’accord', 'Aucun n’est d’accord', 'Ils sont un peu d’accord'], 0, 'Some of = une partie d’un groupe précis.'],
            ['Laquelle parle d’un groupe PRÉCIS ?', ['Most teenagers use phones.', 'Teenagers use phones.', 'Most of the teenagers in this school use phones.', 'Many teenagers use phones.'], 2, 'The + précision : un groupe identifié, donc of.'],
            ['Complète : « ___ of my parents work in London. » (les deux)', ['All', 'Either', 'Half', 'Both'], 3, 'Both = les deux, pour un groupe de deux.', 'Quel mot signifie « les deux » ?'],
          ],
        },
        {
          titre: 'Les réponses courtes et les reprises : So do I, Neither can she',
          axe: 'La phrase',
          lecon: {
            titre: 'L’auxiliaire qui répond à ta place',
            cours: `En anglais, on ne répond presque jamais « oui » tout court : on répond « oui, je le fais », « moi aussi », « moi non plus » — et c’est l’**auxiliaire** qui fait tout le travail.

## Les réponses courtes
On reprend le **sujet** en pronom et l’**auxiliaire** de la question.

| Question | Oui | Non |
| *Do you like tea?* | *Yes, I do.* | *No, I don’t.* |
| *Is she French?* | *Yes, she is.* | *No, she isn’t.* |
| *Have they finished?* | *Yes, they have.* | *No, they haven’t.* |
| *Can he swim?* | *Yes, he can.* | *No, he can’t.* |
| *Did you see it?* | *Yes, I did.* | *No, I didn’t.* |

Un simple *Yes.* sonne sec, parfois impoli. Dans la réponse affirmative, on ne contracte **jamais** : *Yes, I am* (pas *Yes, I’m*).

## Moi aussi, moi non plus
1. **So + auxiliaire + sujet** : accord avec une phrase **affirmative**.
   *I love pizza. — **So do I.*** (Moi aussi.)
2. **Neither / Nor + auxiliaire + sujet** : accord avec une phrase **négative**.
   *I can’t swim. — **Neither can I.*** (Moi non plus.)

> L’auxiliaire **se choisit sur la phrase de départ** : *She has been to London* → *So have I* ; *He went home* → *So did I* ; *They won’t come* → *Neither will we*. Et l’ordre est inversé : auxiliaire **avant** le sujet.

## Le désaccord
On garde le sujet devant l’auxiliaire, et on inverse la polarité :
- *I love pizza. — Oh, I **don’t**.* (Moi, non.)
- *I can’t swim. — I **can**.* (Moi, si.)

## Les reprises « I think so », « I hope not »
Pour éviter de répéter toute une proposition :
| Positif | Négatif |
| *I think so.* (je crois que oui) | *I don’t think so.* (je ne crois pas) |
| *I hope so.* (j’espère) | *I hope not.* (j’espère que non) |
| *I’m afraid so.* (hélas oui) | *I’m afraid not.* (hélas non) |

## Les réactions en question
Pour montrer son intérêt : *I’ve just moved to Leeds. — **Have you?*** (Ah bon ?)

## Exemple travaillé
*— Tom doesn’t eat meat. — Neither does his sister. — Does your brother? — Yes, he does, but I don’t think he will for long!* Chaque réplique reprend l’auxiliaire de la phrase précédente.`,
          },
          questions: [
            ['Réponds brièvement et positivement : « Do you like tea? »', ['Yes, I do.', 'Yes, I like.', 'Yes, I am.', 'Yes, I does.'], 0, 'On reprend l’auxiliaire do.'],
            ['« I love pizza. » Comment dire « Moi aussi » ?', ['So I do.', 'Neither do I.', 'So do I.', 'Me too do.'], 2, 'So + auxiliaire + sujet, dans cet ordre.'],
            ['« I can’t swim. » Comment dire « Moi non plus » ?', ['Neither can I.', 'So can I.', 'Neither I can.', 'Me neither can.'], 0, 'Neither pour une phrase négative, avec l’auxiliaire can.'],
            ['« She has been to London. » Complète : « So ___ I. »', ['do', 'did', 'am', 'have'], 3, 'L’auxiliaire se choisit sur la phrase de départ : has → have.', 'Quel auxiliaire reprend « has been » ?'],
            ['« He went home early. » Moi aussi :', ['So went I.', 'So did I.', 'So do I.', 'So was I.'], 1, 'Prétérit simple : l’auxiliaire est did.'],
            ['La réponse « Yes, I’m » est correcte.', ['Vrai', 'Faux'], 1, 'Pas de contraction dans une réponse courte affirmative : Yes, I am.'],
            ['Comment dire « J’espère que non » ?', ['I don’t hope so.', 'I hope not.', 'I hope no.', 'I not hope.'], 1, 'Hope se construit avec not, pas avec don’t.'],
            ['« Will they come? » — « Je crois que oui » :', ['I think yes.', 'I think it.', 'I believe that yes.', 'I think so.'], 3, 'So reprend toute la proposition.'],
            ['« I can’t swim. — I can. » La seconde réplique exprime…', ['Le désaccord : moi, si', 'L’accord', 'Une question', 'Un ordre'], 0, 'Sujet devant l’auxiliaire, polarité inversée.'],
            ['« They won’t come. » Nous non plus :', ['Neither we will.', 'So won’t we.', 'Neither will we.', 'Neither do we.'], 2, 'Will est l’auxiliaire de la phrase de départ.'],
            ['« I’ve just moved to Leeds. — Have you? » La réponse signifie…', ['Tu as déménagé ?', 'Où ça ?', 'Moi aussi.', 'Ah bon ?'], 3, 'Une question-réaction qui marque l’intérêt.'],
            ['« Is she French? » Réponse négative :', ['No, she doesn’t.', 'No, she isn’t.', 'No, she not.', 'No, isn’t she.'], 1, 'On reprend l’auxiliaire be.'],
          ],
        },
        {
          titre: 'Les connecteurs pour enchaîner ses idées',
          axe: 'La phrase',
          lecon: {
            titre: 'First, moreover, for instance, as a result',
            cours: `Une bonne idée mal reliée à la précédente passe inaperçue. Les connecteurs sont les panneaux indicateurs de ton texte : ils disent au lecteur où tu l’emmènes.

## Les connecteurs selon ce qu’ils annoncent
| Rôle | Anglais | Français |
| Ordonner | *first (of all), then, next, finally* | d’abord, ensuite, enfin |
| Ajouter | *moreover, besides, in addition, what is more* | de plus, en outre |
| Illustrer | *for example, for instance, such as, like* | par exemple, comme |
| Conséquence | *so, therefore, consequently, as a result* | donc, par conséquent |
| Opposer | *however, yet, on the other hand* | cependant, pourtant |
| Conclure | *to conclude, all in all, to sum up* | pour conclure, en somme |

## La ponctuation qui va avec
1. En tête de phrase, les connecteurs adverbiaux prennent une **virgule** : *Moreover, it is cheap.* — *However, it is slow.*
2. *So* relie deux propositions dans la même phrase : *It was raining, so we stayed at home.*
3. *Such as* et *like* introduisent un exemple **sans virgule après** : *sports such as rugby*.

## Les pièges des francophones
| À éviter | Correct | Pourquoi |
| *Firstly… Secondly… At last, …* | *Finally, …* | *At last* = enfin (soulagement), pas « en dernier lieu » |
| *In a first time* | *First (of all)* | calque du français « dans un premier temps » |
| *Moreover* pour opposer | *However* | *moreover* AJOUTE, il n’oppose pas |
| *Actually* = actuellement | *Actually* = en fait | « actuellement » se dit *currently, nowadays* |

> Avant d’écrire un connecteur, demande-toi : « est-ce que j’ajoute, j’illustre, je conclus ou j’oppose ? » Le mauvais connecteur fait dire à ta phrase le contraire de ce que tu penses.

## Exemple travaillé
Trois phrases sans lien : *Cycling is good for your health. It does not pollute. Many people still drive to work.*
Avec connecteurs : ***First of all**, cycling is good for your health. **Moreover**, it does not pollute. **However**, many people still drive to work, **so** cities should build more cycle lanes.*
Le lecteur comprend désormais que les deux premières idées vont dans le même sens et que la troisième apporte une objection.`,
          },
          questions: [
            ['Quel connecteur AJOUTE une idée ?', ['However', 'Therefore', 'Moreover', 'Yet'], 2, 'Moreover = de plus.'],
            ['Que signifie « for instance » ?', ['Par exemple', 'Pour l’instant', 'Instantanément', 'Pour conclure'], 0, 'Synonyme de for example.'],
            ['Quel connecteur introduit une conséquence ?', ['Besides', 'Such as', 'However', 'As a result'], 3, 'As a result = en conséquence.'],
            ['« At last » peut remplacer « finally » pour annoncer le dernier argument.', ['Vrai', 'Faux'], 1, 'At last exprime le soulagement : « enfin ! ». Pour le dernier point : finally.'],
            ['Que signifie « actually » ?', ['Actuellement', 'En fait', 'Activement', 'Autrefois'], 1, 'Faux ami : « actuellement » se dit currently ou nowadays.'],
            ['Complète : « It was raining, ___ we stayed at home. »', ['however', 'so', 'moreover', 'such as'], 1, 'So relie deux propositions pour marquer la conséquence.', 'Quel mot exprime la conséquence dans cette phrase ?'],
            ['Comment dire « dans un premier temps » dans un essai ?', ['In a first time', 'At first time', 'Firstly time', 'First of all'], 3, 'In a first time est un calque fautif.'],
            ['Quelle ponctuation suit « However » en tête de phrase ?', ['Une virgule', 'Aucune', 'Un point-virgule', 'Deux-points'], 0, 'However, the results are good.'],
            ['Quel connecteur introduit une opposition ?', ['In addition', 'What is more', 'On the other hand', 'Such as'], 2, 'On the other hand = d’un autre côté.'],
            ['Quel connecteur sert à conclure ?', ['Besides', 'For example', 'Next', 'To sum up'], 3, 'To sum up = pour résumer.'],
            ['Dans « sports such as rugby », « such as » sert à…', ['Opposer', 'Illustrer par un exemple', 'Conclure', 'Ajouter un argument'], 1, 'Such as = comme, tel que.'],
            ['Quel connecteur est synonyme de « therefore » ?', ['Although', 'Besides', 'Consequently', 'Meanwhile'], 2, 'Tous deux signifient « par conséquent ».'],
          ],
        },
        {
          titre: 'Situer dans l’espace : les prépositions de lieu',
          axe: 'La phrase',
          lecon: {
            titre: 'In, on, at — et au bout de la rue',
            cours: `« À Londres », « à la gare », « à la télé » : trois « à » en français, trois prépositions différentes en anglais. Tout dépend de la façon dont on se représente le lieu.

## In, on, at : trois manières de voir un lieu
| Préposition | Le lieu vu comme… | Exemples |
| **in** | un **volume**, un espace fermé ou une grande zone | *in the kitchen, in London, in France, in the car* |
| **on** | une **surface**, une ligne | *on the table, on the wall, on the second floor, on the bus* |
| **at** | un **point**, un lieu d’activité | *at the station, at school, at the corner, at home* |

> Ville, pays : **in**. Adresse précise avec numéro : **at** (*at 10 Downing Street*). Rue sans numéro : **in** en anglais britannique, **on** en américain (*in / on Oxford Street*).

## Les transports
- *in a car, in a taxi* (on y est assis, enfermé) ;
- *on a bus, on a train, on a plane, on a bike* (on peut s’y déplacer, ou on est dessus).

## Situer précisément
| Anglais | Français |
| *next to, beside* | à côté de |
| *opposite* | en face de |
| *between… and…* | entre… et… |
| *behind / in front of* | derrière / devant |
| *not far from* | non loin de |
| *round the corner* | juste au coin |
| *at the far end of* | tout au bout de |
| *over there* | là-bas |
| *in the top left-hand corner* | dans le coin en haut à gauche |

## Décrire une image
C’est l’usage qui compte au bac : *In the foreground* (au premier plan), *in the background* (à l’arrière-plan), *in the middle / in the centre*, *on the left / on the right*, *at the top / at the bottom*.

## Le mouvement
Pour aller vers un lieu, on emploie **to** : *I go to school*. Pour entrer, **into** : *She walked into the room*. Mais on dit *go home* (sans *to*) et *arrive in London / at the station* (jamais *arrive to*).

## Exemple travaillé
Décris une photo : *In the foreground, a woman is sitting **on** a bench **in** the park. **Behind** her, **at the far end of** the path, two children are playing. **In the top right-hand corner**, we can see a church.*`,
          },
          questions: [
            ['Complète : « She lives ___ London. »', ['in', 'at', 'on', 'to'], 0, 'Une ville : in.', 'Quelle préposition convient devant une ville ?'],
            ['Complète : « The picture is ___ the wall. »', ['in', 'at', 'into', 'on'], 3, 'Une surface : on.', 'Quelle préposition convient pour une surface ?'],
            ['Complète : « I’ll meet you ___ the station. »', ['in', 'at', 'on', 'to'], 1, 'Un point de rendez-vous : at.', 'Quelle préposition convient pour un point de rendez-vous ?'],
            ['Comment dire « au premier plan » ?', ['In the first plan', 'In the foreground', 'At the front plan', 'On the first ground'], 1, 'In the first plan est un calque fautif.'],
            ['Quelle forme est correcte ?', ['We arrived to London.', 'We arrived at London.', 'We arrived on London.', 'We arrived in London.'], 3, 'Arrive in pour une ville, jamais arrive to.'],
            ['On dit « on the bus » mais « in a car ».', ['Vrai', 'Faux'], 0, 'On se déplace dans un bus ; on est enfermé dans une voiture.'],
            ['Que signifie « opposite » dans « the bank is opposite the church » ?', ['En face de', 'À côté de', 'Derrière', 'Loin de'], 0, 'Opposite = en face de.'],
            ['Comment dire « tout au bout de la rue » ?', ['in the end street', 'on the far street', 'at the far end of the street', 'at the last of the street'], 2, 'At the far end of = tout au bout de.'],
            ['Complète : « She walked ___ the room. » (elle est entrée)', ['in', 'at', 'on', 'into'], 3, 'Into marque l’entrée dans un espace.', 'Quelle préposition marque l’entrée dans une pièce ?'],
            ['Quelle forme est correcte ?', ['I go to home.', 'I go home.', 'I go at home.', 'I go in home.'], 1, 'Home s’emploie sans préposition après un verbe de mouvement.'],
            ['Comment dire « dans le coin en haut à gauche » ?', ['at the left top corner', 'on the up left corner', 'in the top left-hand corner', 'in the corner of top left'], 2, 'L’expression figée pour décrire une image.'],
            ['Complète : « They live ___ 10 Downing Street. »', ['at', 'in', 'on', 'to'], 0, 'Une adresse précise avec un numéro : at.', 'Quelle préposition précède une adresse avec numéro ?'],
          ],
        },
      ],
    },
  ],
}
