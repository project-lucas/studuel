// Anglais — Terminale : LES AXES CULTURELS DU PROGRAMME 2025 et UNE GRAMMAIRE
// PROPRE À LA TERMINALE (13 fiches).
//
// LE CONSTAT. La Tle avait ses 24 fiches de grammaire (migration 226, module
// anglais-tle.mjs, À NE PAS RÉGÉNÉRER) — les mêmes qu'en 2de et en 1re — et
// aucun des six axes du programme de langues vivantes (arrêté du 5 mai 2025,
// BO n° 22 du 29 mai 2025), qui s'applique en terminale à la rentrée 2026.
// L'axe 6, « Le Royaume-Uni et ses nations », est OBLIGATOIRE (cinq axes sur
// six en voie générale, dont toujours l'axe 6).
//
// CE QUE CE MODULE AJOUTE (rien n'est supprimé) :
//   - rayon 'culture' : les six axes de Tle, intitulés recopiés du BO, une fiche
//     par axe et deux pour l'axe 6 ;
//   - rayon 'langue' : six fiches B2, tirées des « outils linguistiques » de
//     Tle et tournées vers l'écrit argumenté et la traduction, ABSENTES des 24
//     fiches communes (inversion, subjonctif, BE + -ING à tous les temps,
//     passif avancé, formation des mots, faux amis) ; les deux dernières
//     ouvrent un chapitre de langue « Lexique et traduction ».
//
// ⚠️ Toujours générer avec `--modules anglais-tle-2025`, jamais `--slugs anglais`
// (qui réécrirait la migration 226).

const AXE = {
  espace: 'Espace privé et espace public',
  memoire: 'Territoire et mémoire',
  fictions: 'Fictions et réalités',
  communication: 'Enjeux et formes de la communication',
  citoyennete: 'Citoyenneté et mondes virtuels',
  royaumeUni: 'Le Royaume-Uni et ses nations',
}

export default {
  slug: 'anglais',
  nom: 'Anglais',

  titreMigration: 'ANGLAIS Tle — axes culturels du programme 2025 et grammaire B2',

  motif: `CONSTAT : la Tle d'anglais montrait les mêmes 24 fiches de grammaire que la
2de et la 1re, et aucun des six axes culturels du programme 2025 (arrêté du
5 mai 2025, BO n° 22 du 29 mai 2025, en vigueur en Tle à la rentrée 2026),
dont l'axe 6 « Le Royaume-Uni et ses nations », obligatoire.
Cette migration AJOUTE derrière les 24 fiches (positions 25 → 37) : 7 fiches
culturelles (rayon 'culture', une par axe, deux pour l'axe 6) et 6 fiches de
langue B2 propres à la terminale (rayon 'langue'). Rien n'est supprimé.`,

  blocs: [
    // ============================== LES AXES CULTURELS ======================
    {
      niveaux: ['Tle'],
      positionDepart: 25,
      rayon: 'culture',
      chapitres: [
        // ---------------------------------------------------------- Axe 1 ---
        {
          titre: 'Sphère privée, sphère publique',
          axe: AXE.espace,
          lecon: {
            titre: 'Behind closed doors',
            cours: `« La maison d’un Anglais est son château », dit le proverbe. Pourtant, de Salem aux réseaux sociaux, la frontière entre ce qui est privé et ce qui regarde tout le monde n’a jamais cessé de bouger.

## Ce que recouvre l’axe
Le programme interroge les **lieux de rencontre** et les **transitions** entre espace privé et espace public, et la capacité de la sphère privée à **résister à l’intrusion** de la sphère publique. Il invite aussi à traiter le **fait religieux** : dans bien des pays anglophones, la religion irrigue la culture, les traditions et les institutions.

## Les chasses aux sorcières, de Salem à Hollywood
| Repère | Ce qu’il montre |
| Les **procès de Salem** (Massachusetts, 1692) : dix-neuf personnes pendues pour sorcellerie | La rumeur et la peur font un tribunal |
| La **HUAC** et les **Hollywood Ten** (1947) | Des scénaristes condamnés pour avoir refusé de dire s’ils étaient communistes |
| Le sénateur **Joseph McCarthy** (à partir de 1950) | La « peur rouge » et les listes noires |
| ***The Crucible*** d’**Arthur Miller** (1953) | Salem pour parler du maccarthysme |

## Le corps des femmes, entre loi et intimité
- Les **suffragettes** d’Emmeline Pankhurst (WSPU, 1903) ; le droit de vote des Britanniques en 1918, puis à égalité avec les hommes en 1928.
- **Roe v. Wade** (1973) protège l’avortement aux États-Unis ; l’arrêt **Dobbs** (24 juin 2022) le renverse et rend la décision à chaque État.
- ***The Handmaid’s Tale*** de **Margaret Atwood** (1985) : une dystopie où l’État contrôle le corps des femmes.

## Religion et institutions
1. Le souverain britannique est **gouverneur suprême de l’Église d’Angleterre** : Henri VIII, en rompant avec Rome (1534), s’en était proclamé « chef suprême », titre devenu « gouverneur suprême » sous Élisabeth Ire (1559).
2. Aux États-Unis, le **premier amendement** (1791) interdit une religion d’État… mais *In God We Trust* est la devise nationale depuis 1956.
3. Les **Pilgrim Fathers** du *Mayflower* (1620) fuyaient les persécutions religieuses.

## Vocabulaire utile
| Anglais | Français |
| privacy | la vie privée |
| to intrude / an intrusion | s’immiscer / une intrusion |
| a witch hunt | une chasse aux sorcières |
| to be blacklisted | être mis sur liste noire |
| a trial | un procès |
| scrutiny | l’examen minutieux, la surveillance |
| the tabloids | la presse à scandale |
| a faith / a believer | une foi / un croyant |
| a gated community | une résidence fermée |

## Pour argumenter à l’oral
- *Where should we draw the line between…?* — Où tracer la limite entre… ?
- *This is none of the State’s business.* — Cela ne regarde pas l’État.
- *Public figures are entitled to privacy too.*

> Une « chasse aux sorcières » (*witch hunt*) n’a plus besoin de sorcières : l’expression désigne toute persécution collective fondée sur la peur et l’accusation sans preuve.

## Exemple travaillé
*Arthur Miller set The Crucible in 1692, but his audience in 1953 understood: the hysteria of Salem mirrored the hunt for communists. Fiction allowed him to criticise the present without naming it.*`,
          },
          questions: [
            ['En quelle année ont eu lieu les procès des sorcières de Salem ?', ['1692', '1620', '1776', '1865'], 0, 'Dix-neuf personnes y sont pendues.'],
            ['Quelle pièce d’Arthur Miller utilise Salem pour dénoncer le maccarthysme ?', ['Death of a Salesman', 'A View from the Bridge', 'All My Sons', 'The Crucible'], 3, 'Créée en 1953, en pleine peur rouge.'],
            ['Qui étaient les « Hollywood Ten » ?', ['Des acteurs oscarisés', 'Des scénaristes et réalisateurs condamnés en 1947 pour avoir refusé de répondre à la HUAC', 'Les fondateurs des grands studios', 'Des sénateurs'], 1, 'Ils ont été mis sur liste noire.'],
            ['Quel arrêt de 2022 a renversé Roe v. Wade ?', ['Obergefell', 'Dobbs', 'Brown', 'Plessy'], 1, 'L’avortement relève désormais de chaque État.'],
            ['Que signifie « privacy » ?', ['La privation', 'Le secteur privé', 'La propriété', 'La vie privée'], 3, 'Faux ami partiel : privacy n’est pas « privation ».'],
            ['Qui est le gouverneur suprême de l’Église d’Angleterre ?', ['Le souverain britannique', 'L’archevêque de Cantorbéry', 'Le Premier ministre', 'Le pape'], 0, 'Titre fixé sous Élisabeth Ire (1559), après la rupture d’Henri VIII avec Rome.'],
            ['Le premier amendement de la Constitution américaine interdit l’établissement d’une religion d’État.', ['Vrai', 'Faux'], 0, 'Adopté en 1791 avec la Déclaration des droits.'],
            ['Qui a écrit The Handmaid’s Tale (1985) ?', ['Toni Morrison', 'Alice Munro', 'Margaret Atwood', 'Sylvia Plath'], 2, 'Autrice canadienne.'],
            ['En quelle année les Britanniques obtiennent-elles le droit de vote à égalité avec les hommes ?', ['1918', '1945', '1969', '1928'], 3, 'En 1918, seules les femmes de plus de 30 ans votaient.'],
            ['Que désigne « a witch hunt » au sens figuré ?', ['Une fête d’Halloween', 'Une persécution collective sans preuve', 'Une enquête scientifique', 'Une chasse traditionnelle'], 1, 'L’expression vaut pour Salem comme pour le maccarthysme.'],
            ['Quelle est la devise nationale des États-Unis depuis 1956 ?', ['E pluribus unum', 'Liberty and Justice', 'In God We Trust', 'Land of the Free'], 2, 'Elle figure sur les billets de banque.'],
            ['Que signifie « This is none of the State’s business » ?', ['Cela ne regarde pas l’État', 'L’État est en faillite', 'L’État n’a pas d’entreprises', 'C’est l’affaire de l’État'], 0, 'Business = ici, ce qui nous regarde.'],
          ],
        },

        // ---------------------------------------------------------- Axe 2 ---
        {
          titre: 'Mémoire de l’esclavage et des colonisations',
          axe: AXE.memoire,
          lecon: {
            titre: 'Remembering, reclaiming, repairing',
            cours: `Un musée à Liverpool, un jour férié au Texas, un coquelicot à la boutonnière : chaque société choisit ce dont elle se souvient, et comment.

## Ce que recouvre l’axe
Des peuples et des sociétés cherchent à **faire entendre leur voix** et à **se réapproprier leur passé**, en pérennisant leurs traditions par des **lieux d’histoire ou de commémoration**. Le programme demande comment on construit, à partir de l’histoire, un **héritage collectif**.

## L’esclavage dans le monde anglophone
| Date | Repère |
| 1619 | Arrivée des premiers Africains réduits en esclavage en Virginie |
| 1807 | Le Royaume-Uni abolit la **traite** |
| 1833 | Le **Slavery Abolition Act** abolit l’esclavage dans l’Empire britannique |
| 1865 | Le **13e amendement** abolit l’esclavage aux États-Unis |
| 19 juin 1865 | À Galveston (Texas), les derniers esclaves apprennent leur liberté : **Juneteenth**, jour férié fédéral depuis 2021 |
| 2007 | Ouverture de l’**International Slavery Museum** de Liverpool |
| 2016 | Ouverture du **musée national de l’histoire afro-américaine** à Washington |

Œuvres : ***Beloved*** de **Toni Morrison** (1987) ; ***12 Years a Slave*** de **Steve McQueen** (2013, Oscar du meilleur film).

## Commémorer au sein du Commonwealth
1. **Remembrance Day** (11 novembre) et le **coquelicot** (*poppy*), fleur des champs de bataille de Flandre.
2. **ANZAC Day** (25 avril) : Australiens et Néo-Zélandais se souviennent de Gallipoli (1915).
3. Au Canada, la **Journée nationale de la vérité et de la réconciliation** (30 septembre, depuis 2021) rappelle les pensionnats autochtones.
4. **Robben Island**, où Mandela fut emprisonné, est inscrite au patrimoine mondial (1999).

## Territoires autochtones
- Le **traité de Waitangi** (1840) entre la Couronne et des chefs maoris, fondateur de la Nouvelle-Zélande.
- **Wounded Knee** (1890) : massacre de Lakotas par l’armée américaine.
- **Standing Rock** (2016) : les Sioux s’opposent à un oléoduc sur leurs terres sacrées.

## Vocabulaire utile
| Anglais | Français |
| a memorial | un mémorial |
| to commemorate | commémorer |
| the slave trade | la traite négrière |
| enslaved people | les personnes réduites en esclavage |
| to abolish / abolition | abolir / l’abolition |
| reparations | les réparations |
| collective memory | la mémoire collective |
| to reclaim | se réapproprier, revendiquer |

## Pour argumenter à l’oral
- *Remembering is not the same as repenting.*
- *Museums give a voice to those who were silenced.*
- *Can a nation be proud of its history and acknowledge its crimes?*

> On dit de plus en plus *enslaved people* plutôt que *slaves* : l’expression rappelle qu’on a **réduit** des personnes en esclavage, qu’elles ne l’étaient pas par nature.

## Exemple travaillé
*Juneteenth became a federal holiday in 2021, more than 150 years after 1865. The date had long been celebrated by African Americans; national recognition came late, which shows that collective memory is built step by step.*`,
          },
          questions: [
            ['Quelle loi britannique de 1833 abolit l’esclavage dans l’Empire ?', ['Le Slave Trade Act', 'Le Bill of Rights', 'Le Reform Act', 'Le Slavery Abolition Act'], 3, 'La traite, elle, avait été abolie en 1807.'],
            ['Que commémore Juneteenth ?', ['L’indépendance américaine', 'L’annonce de leur liberté aux derniers esclaves du Texas, en 1865', 'La fin de la guerre de Corée', 'Le discours de Martin Luther King'], 1, 'Jour férié fédéral depuis 2021.'],
            ['Quel amendement abolit l’esclavage aux États-Unis en 1865 ?', ['Le 1er', 'Le 13e', 'Le 5e', 'Le 19e'], 1, 'Adopté à la fin de la guerre de Sécession.'],
            ['Quelle fleur porte-t-on pour Remembrance Day ?', ['La rose', 'La jonquille', 'Le chardon', 'Le coquelicot'], 3, 'Le poppy des champs de bataille de Flandre.'],
            ['Quel roman de Toni Morrison (1987) évoque l’héritage de l’esclavage ?', ['Beloved', 'The Color Purple', 'Roots', 'Invisible Man'], 0, 'Prix Pulitzer 1988.'],
            ['ANZAC Day commémore la bataille de Gallipoli (1915).', ['Vrai', 'Faux'], 0, 'Le 25 avril, en Australie et en Nouvelle-Zélande.'],
            ['Quel traité de 1840 lie la Couronne britannique à des chefs maoris ?', ['Le traité de Paris', 'Le traité de Versailles', 'Le traité de Waitangi', 'Le traité d’Utrecht'], 2, 'Texte fondateur de la Nouvelle-Zélande.'],
            ['Dans quelle ville britannique a ouvert l’International Slavery Museum en 2007 ?', ['Londres', 'Bristol', 'Glasgow', 'Liverpool'], 3, 'Liverpool fut l’un des grands ports de la traite.'],
            ['Que signifie « to reclaim one’s past » ?', ['Réclamer un remboursement', 'Se réapproprier son passé', 'Oublier son passé', 'Réécrire un contrat'], 1, 'To reclaim = revendiquer, reprendre possession.'],
            ['Pourquoi préfère-t-on souvent « enslaved people » à « slaves » ?', ['Pour raccourcir la phrase', 'Parce que slave est un mot familier', 'Pour rappeler que ces personnes ont été réduites en esclavage', 'Parce que c’est plus ancien'], 2, 'L’expression met l’accent sur l’acte subi.'],
            ['Quel film de Steve McQueen a reçu l’Oscar du meilleur film en 2014 ?', ['12 Years a Slave', 'Selma', 'Django Unchained', 'The Help'], 0, 'Sorti en 2013, d’après le récit de Solomon Northup.'],
            ['En quelle année les premiers Africains réduits en esclavage arrivent-ils en Virginie ?', ['1492', '1776', '1619', '1807'], 2, 'Une date devenue centrale dans la mémoire américaine.'],
          ],
        },

        // ---------------------------------------------------------- Axe 3 ---
        {
          titre: 'Utopies, dystopies et rêve américain',
          axe: AXE.fictions,
          lecon: {
            titre: 'What if…?',
            cours: `Big Brother, les Hunger Games, Gatsby devant sa lumière verte : la fiction anglophone invente des mondes pour mieux regarder le nôtre.

## Ce que recouvre l’axe
Le programme demande comment s’articulent **réalité et fantasme** dans la construction d’un **récit national**, et dans quelle mesure la fiction se nourrit du réel pour le **questionner**, le **sublimer** ou le **réinventer**.

## La dystopie, une catharsis ?
| Œuvre | Auteur, date | Ce qu’elle dénonce |
| ***Nineteen Eighty-Four*** | George Orwell, 1949 | La surveillance totale : *Big Brother is watching you* |
| ***Fahrenheit 451*** | Ray Bradbury, 1953 | Une société qui brûle ses livres |
| ***The Hunger Games*** | Suzanne Collins, 2008 | Des jeux mortels devenus spectacle télévisé |
| ***Black Mirror*** | Charlie Brooker, série, depuis 2011 | Les dérives de nos technologies |

Une dystopie **exagère** une tendance réelle pour la rendre visible : elle fait peur pour faire réfléchir.

## La société de classes britannique dans la fiction
- **Jane Austen**, *Pride and Prejudice* (1813) : le mariage et la fortune.
- **Charles Dickens**, *Oliver Twist* (1837-1839) : les enfants pauvres de Londres.
- **Ken Loach**, *I, Daniel Blake* (2016, Palme d’or) : un menuisier face à l’administration.

## Quand la science-fiction nourrit l’innovation
1. **Arthur C. Clarke** décrit dès 1945 des satellites de télécommunication en orbite géostationnaire.
2. ***2001: A Space Odyssey*** (Kubrick et Clarke, 1968) imagine HAL, une intelligence artificielle qui parle.
3. Les communicateurs de ***Star Trek*** (série, 1966) ont inspiré, dit-on, les téléphones à clapet.

## Le rêve américain en question
| Repère | Ce qu’il dit du mythe |
| L’expression est popularisée par **James Truslow Adams** (1931) | Chacun peut réussir par son travail |
| ***The Great Gatsby***, F. Scott Fitzgerald (1925) | La fortune ne suffit pas à effacer l’origine |
| ***Of Mice and Men***, John Steinbeck (1937) | Le rêve d’un lopin de terre qui n’arrive jamais |
| ***Death of a Salesman***, Arthur Miller (1949) | Un représentant brisé par l’idéal de réussite |

## Vocabulaire utile
| Anglais | Français |
| a dystopia / dystopian | une dystopie / dystopique |
| a utopia | une utopie |
| a cautionary tale | un récit d’avertissement |
| a self-made man | un homme parti de rien |
| rags to riches | de la misère à la fortune |
| to foreshadow | préfigurer |
| upward mobility | l’ascension sociale |
| surveillance | la surveillance |

## Pour argumenter à l’oral
- *Fiction holds up a mirror to society.*
- *This novel can be read as a warning against…*
- *The American Dream is still alive, but…*

> Une dystopie n’est pas une prophétie : c’est un *cautionary tale*, un avertissement. Son but est que le futur qu’elle décrit n’arrive jamais.

## Exemple travaillé
*Gatsby becomes rich, throws lavish parties and still loses Daisy: in Fitzgerald’s novel, money can buy a mansion, not a place in the old elite. The American Dream is shown as a promise that excludes as much as it includes.*`,
          },
          questions: [
            ['Qui a écrit Nineteen Eighty-Four (1949) ?', ['Aldous Huxley', 'George Orwell', 'Ray Bradbury', 'H. G. Wells'], 1, 'Big Brother is watching you.'],
            ['Que brûle-t-on dans Fahrenheit 451 ?', ['Des drapeaux', 'Des livres', 'Des forêts', 'Des maisons'], 1, '451 °F serait la température à laquelle le papier s’enflamme.'],
            ['Qui a popularisé l’expression « American Dream » en 1931 ?', ['F. Scott Fitzgerald', 'Abraham Lincoln', 'Walt Whitman', 'James Truslow Adams'], 3, 'Dans son livre The Epic of America.'],
            ['Quel roman de 1925 montre les limites du rêve américain à travers un millionnaire mystérieux ?', ['The Great Gatsby', 'The Grapes of Wrath', 'Moby-Dick', 'Little Women'], 0, 'Écrit par F. Scott Fitzgerald.'],
            ['Que signifie « a cautionary tale » ?', ['Un conte pour enfants', 'Une histoire vraie', 'Un récit d’avertissement', 'Une légende religieuse'], 2, 'Caution = prudence.'],
            ['Quel film de Ken Loach a reçu la Palme d’or en 2016 ?', ['Kes', 'The Full Monty', 'Billy Elliot', 'I, Daniel Blake'], 3, 'Un menuisier malade face à l’administration sociale.'],
            ['Arthur C. Clarke a décrit dès 1945 des satellites de télécommunication en orbite géostationnaire.', ['Vrai', 'Faux'], 0, 'L’orbite géostationnaire est parfois appelée « orbite de Clarke ».'],
            ['Dans quelle œuvre apparaît l’intelligence artificielle HAL ?', ['Star Wars', '2001: A Space Odyssey', 'Blade Runner', 'The Matrix'], 1, 'Film de Kubrick (1968), écrit avec Clarke.'],
            ['Que signifie « rags to riches » ?', ['De la richesse à la ruine', 'Des vêtements de luxe', 'De la misère à la fortune', 'La mode du recyclage'], 2, 'Rags = haillons.'],
            ['Quel roman de Steinbeck (1937) raconte le rêve de deux ouvriers agricoles ?', ['Of Mice and Men', 'East of Eden', 'The Pearl', 'Cannery Row'], 0, 'George et Lennie rêvent d’un lopin de terre.'],
            ['Quelle série de Charlie Brooker explore les dérives de la technologie ?', ['Stranger Things', 'Westworld', 'Black Mirror', 'The Office'], 2, 'Lancée en 2011, la série imagine dans chaque épisode un futur proche où une technologie tourne mal : une dystopie.'],
            ['Quel roman de Charles Dickens suit un orphelin dans le Londres pauvre ?', ['Oliver Twist', 'Great Expectations', 'Hard Times', 'David Copperfield'], 0, 'Publié de 1837 à 1839.'],
          ],
        },

        // ---------------------------------------------------------- Axe 4 ---
        {
          titre: 'L’anglais, langue-monde, et le pouvoir des mots',
          axe: AXE.communication,
          lecon: {
            titre: 'Words that unite, words that divide',
            cours: `Environ un milliard et demi de personnes parlent anglais, dont moins d’un tiers en langue maternelle : aucune langue n’a jamais été aussi partagée — ni aussi puissante.

## Ce que recouvre l’axe
Le programme interroge le rôle singulier de l’anglais, **langue-monde** : dans quelle mesure peut-il **fédérer**, faire entendre des **voix minoritaires**, dire le monde dans sa diversité — mais aussi **uniformiser** ou **manipuler** ?

## L’anglophonie, nouvelle tour de Babel ?
1. L’anglais est la langue des sciences, d’Internet, de l’aviation, de la diplomatie.
2. Le **Globish** : un anglais simplifié, réduit à l’essentiel, parlé entre non-natifs.
3. Les **Englishes** : l’anglais indien, nigérian, singapourien (le *Singlish*) inventent leurs propres mots.

## Forme et portée du discours politique
| Discours | Orateur, date | Formule |
| Devant les Communes, 13 mai 1940 | **Winston Churchill** | *I have nothing to offer but blood, toil, tears and sweat.* |
| Le 4 juin 1940, après Dunkerque | Churchill | *We shall fight on the beaches.* |
| Washington, 28 août 1963 | **Martin Luther King** | *I have a dream.* |
| Campagne présidentielle, 2008 | **Barack Obama** | *Yes we can.* |

Churchill reçoit le **prix Nobel de littérature** en 1953, notamment pour son éloquence. Aujourd’hui, le discours politique passe aussi par les réseaux sociaux : phrases courtes, slogans, attaques personnelles.

## Chacun sa vérité ? Le défi du complotisme
- **Post-truth** est élu mot de l’année par l’Oxford Dictionary en **2016**.
- ***Alternative facts*** : l’expression employée par une conseillère de la Maison-Blanche en janvier 2017.
- Les théories du complot (la Lune n’aurait jamais été foulée, QAnon) se répandent plus vite que leurs démentis.
- **George Orwell**, *Politics and the English Language* (1946) : un langage flou sert à cacher la vérité.

## Les précautions sémantiques : inclusion, censure ou trahison ?
En 2023, l’éditeur de **Roald Dahl** réécrit certains passages jugés blessants (des mots comme *fat* disparaissent) ; face à la polémique, les versions originales restent en vente. Où s’arrête le respect du lecteur, où commence la trahison de l’auteur ?

## Vocabulaire utile
| Anglais | Français |
| a lingua franca | une langue véhiculaire |
| a native speaker | un locuteur natif |
| a speech | un discours |
| rhetoric | la rhétorique |
| a conspiracy theory | une théorie du complot |
| misinformation | la désinformation |
| to debunk | démystifier, démonter |
| censorship | la censure |
| to rewrite | réécrire |

## Pour argumenter à l’oral
- *Language is never neutral.*
- *Words can be used to unite or to divide.*
- *Rewriting a book is a way of…*

> Une langue commune rapproche ceux qui la parlent — et éloigne ceux qui ne la parlent pas : c’est tout le paradoxe d’une langue-monde.

## Exemple travaillé
*Churchill’s speeches rely on repetition — « we shall fight on the beaches, we shall fight on the landing grounds… » — to turn fear into determination. Rhetoric here is not manipulation: it is a way of holding a nation together.*`,
          },
          questions: [
            ['Qui a prononcé « I have nothing to offer but blood, toil, tears and sweat » en 1940 ?', ['Franklin D. Roosevelt', 'Winston Churchill', 'Neville Chamberlain', 'Charles de Gaulle'], 1, 'Devant la Chambre des communes, le 13 mai 1940.'],
            ['Quand Martin Luther King prononce-t-il « I have a dream » ?', ['Le 4 avril 1968', 'Le 1er décembre 1955', 'Le 20 janvier 1961', 'Le 28 août 1963'], 3, 'Lors de la marche sur Washington.'],
            ['Quel mot l’Oxford Dictionary élit-il mot de l’année en 2016 ?', ['Post-truth', 'Selfie', 'Brexit', 'Fake news'], 0, 'Une ère où l’émotion pèse plus que les faits.'],
            ['Churchill a reçu le prix Nobel de…', ['La paix', 'Économie', 'Littérature', 'Physique'], 2, 'Il le reçoit en 1953, pour ses écrits historiques et ses discours — et non le Nobel de la paix, comme on le croit souvent.'],
            ['Que signifie « to debunk » ?', ['Dormir en couchette', 'Débarquer', 'Déboucher', 'Démystifier, démonter une fausse idée'], 3, 'To debunk a conspiracy theory.'],
            ['Qu’appelle-t-on le « Globish » ?', ['L’anglais de la reine', 'Un anglais simplifié parlé entre non-natifs', 'Un dialecte écossais', 'L’argot londonien'], 1, 'Global + English.'],
            ['En 2023, des livres de Roald Dahl ont été réécrits par son éditeur pour retirer des mots jugés blessants.', ['Vrai', 'Faux'], 0, 'Les versions originales sont restées disponibles après la polémique.'],
            ['Quel essai de George Orwell (1946) dénonce le langage flou qui cache la vérité ?', ['Animal Farm', 'Nineteen Eighty-Four', 'Politics and the English Language', 'Homage to Catalonia'], 2, 'Un texte encore étudié dans les écoles de journalisme.'],
            ['« A lingua franca » est…', ['Une langue véhiculaire, commune à des locuteurs différents', 'Une langue morte', 'Le français', 'Une langue secrète'], 0, 'Aujourd’hui, l’anglais joue ce rôle.'],
            ['Quelle formule résume la campagne de Barack Obama en 2008 ?', ['Make America Great Again', 'I like Ike', 'Yes we can', 'Change we need'], 2, 'Un slogan court, inclusif, répétable.'],
            ['Que désigne « misinformation » ?', ['Une information fausse ou trompeuse', 'Une mission secrète', 'Un manque d’informations', 'Une information exclusive'], 0, 'Le préfixe mis- marque l’erreur.'],
            ['Quel procédé Churchill emploie-t-il dans « we shall fight on the beaches, we shall fight on the landing grounds » ?', ['L’ironie', 'La litote', 'L’euphémisme', 'La répétition'], 3, 'L’anaphore martèle la détermination.'],
          ],
        },

        // ---------------------------------------------------------- Axe 5 ---
        {
          titre: 'Démocratie et vie connectée',
          axe: AXE.citoyennete,
          lecon: {
            titre: 'Citizens online',
            cours: `Un clic pour signer une pétition, un algorithme qui choisit ce que tu lis, des données vendues à ton insu : la démocratie se joue aussi derrière les écrans.

## Ce que recouvre l’axe
À l’heure des **mondes virtuels**, le programme demande quels sont les **enjeux démocratiques** dans les aires anglophones, et comment les citoyens peuvent s’emparer des **outils numériques** tout en en **gardant la maîtrise**.

## Repères culturels
| Repère | Ce qu’il montre |
| Les révélations d’**Edward Snowden** (2013) | La NSA surveille massivement les communications |
| Le scandale **Cambridge Analytica** (2018) | Les données de dizaines de millions d’utilisateurs de Facebook utilisées à des fins électorales |
| L’assaut du **Capitole** (6 janvier 2021) | Une mobilisation organisée en ligne ; Donald Trump est ensuite suspendu de plusieurs réseaux |
| L’**Online Safety Act** britannique (2023) | Obliger les plateformes à protéger les mineurs |
| L’**Australie** interdit les réseaux sociaux aux moins de 16 ans (loi de 2024) | Une première mondiale |
| ***Black Mirror***, épisode *Nosedive* (2016) | Une société où chacun note tout le monde |

## Le jeu vidéo, nouveau soft power américain ?
1. ***America’s Army*** (2002) : un jeu gratuit conçu par l’armée américaine pour recruter.
2. ***Fortnite*** (Epic Games, 2017) : des concerts virtuels suivis par des millions de joueurs.
3. ***Grand Theft Auto*** : une Amérique caricaturée… conçue en grande partie à **Édimbourg** (Rockstar North).

## Apprendre à l’heure de l’intelligence artificielle
**ChatGPT**, lancé fin 2022 par OpenAI (San Francisco), bouleverse l’école : triche facilitée ou nouvel outil ? Écoles et universités anglophones hésitent entre interdire, encadrer et enseigner à s’en servir.

## La parole sur les réseaux : un pouvoir horizontal ?
- **Pour** : chacun peut publier, s’organiser, alerter (#MeToo, #BlackLivesMatter).
- **Contre** : les bulles de filtre (*filter bubbles*), le harcèlement, la désinformation, le pouvoir de quelques plateformes privées.

## Vocabulaire utile
| Anglais | Français |
| a user | un utilisateur |
| personal data | les données personnelles |
| an algorithm | un algorithme |
| a filter bubble | une bulle de filtre |
| surveillance | la surveillance |
| a whistleblower | un lanceur d’alerte |
| to go viral | devenir viral |
| cyberbullying | le cyberharcèlement |
| to log off | se déconnecter |

## Pour argumenter à l’oral
- *If the service is free, you are the product.*
- *Social media have given a voice to…, but…*
- *Digital citizenship means…*

> Le paradoxe de l’axe : les outils qui permettent à chacun de s’exprimer sont possédés par une poignée d’entreprises privées. La question n’est pas « pour ou contre le numérique », mais « qui en garde le contrôle ».

## Exemple travaillé
*The Cambridge Analytica scandal showed that a personality quiz could become a political weapon: users thought they were playing, while their data were used to target voters. Digital citizenship starts with knowing what we share.*`,
          },
          questions: [
            ['Qu’a révélé Edward Snowden en 2013 ?', ['Des fraudes électorales', 'La création de Facebook', 'Un piratage de banque', 'La surveillance de masse pratiquée par la NSA'], 3, 'Il est devenu l’un des lanceurs d’alerte les plus célèbres.'],
            ['Quel scandale de 2018 concerne l’exploitation des données de Facebook à des fins électorales ?', ['Cambridge Analytica', 'Watergate', 'WikiLeaks', 'Panama Papers'], 0, 'Des dizaines de millions de profils étaient concernés.'],
            ['Que signifie « a whistleblower » ?', ['Un arbitre', 'Un pirate informatique', 'Un lanceur d’alerte', 'Un musicien'], 2, 'Littéralement : celui qui donne un coup de sifflet.'],
            ['Quel jeu vidéo gratuit l’armée américaine a-t-elle créé en 2002 pour recruter ?', ['Call of Duty', 'Fortnite', 'Halo', 'America’s Army'], 3, 'Un exemple de soft power par le jeu.'],
            ['Quel pays a voté en 2024 l’interdiction des réseaux sociaux aux moins de 16 ans ?', ['Le Royaume-Uni', 'L’Australie', 'Les États-Unis', 'Le Canada'], 1, 'Une première mondiale.'],
            ['Une grande partie de Grand Theft Auto est développée à Édimbourg.', ['Vrai', 'Faux'], 0, 'Par le studio Rockstar North.'],
            ['Qu’est-ce qu’une « filter bubble » ?', ['Un filtre photo', 'Un antivirus', 'Un environnement où l’algorithme ne montre que ce qui conforte nos opinions', 'Un réseau privé'], 2, 'On ne voit plus que ce qui nous ressemble.'],
            ['Quand a eu lieu l’assaut du Capitole ?', ['Le 6 janvier 2021', 'Le 11 septembre 2001', 'Le 8 novembre 2016', 'Le 20 janvier 2017'], 0, 'Une mobilisation largement organisée en ligne.'],
            ['Que signifie « to go viral » ?', ['Tomber malade', 'Être piraté', 'Se répandre très vite en ligne', 'Supprimer un compte'], 2, 'Comme un virus qui se propage.'],
            ['Que dit la formule « If the service is free, you are the product » ?', ['Nos données sont ce que vendent les services gratuits', 'Les services gratuits sont mauvais', 'Il faut payer pour tout', 'Les produits sont gratuits'], 0, 'Le modèle publicitaire des plateformes.'],
            ['Quelle loi britannique de 2023 impose aux plateformes de protéger les mineurs ?', ['Le Data Protection Act', 'Le Human Rights Act', 'Le Digital Economy Act', 'L’Online Safety Act'], 3, 'Elle vise notamment les contenus dangereux pour les enfants.'],
            ['« Cyberbullying » se traduit par…', ['Le cybercrime', 'Le cyberharcèlement', 'La cybersécurité', 'La cyberdépendance'], 1, 'To bully = harceler, brutaliser.'],
          ],
        },

        // ---------------------------------------------------------- Axe 6 ---
        {
          titre: 'Un Royaume toujours uni ? Nations et dévolution',
          axe: AXE.royaumeUni,
          lecon: {
            titre: 'Four nations, one kingdom?',
            cours: `Un seul État, quatre nations, trois parlements régionaux, deux référendums qui ont tout bousculé : le Royaume-Uni est « uni » par l’histoire, pas par l’évidence.

## Ce que recouvre l’axe (obligatoire)
Le programme demande comment ont évolué les relations entre les **nations** qui composent le Royaume-Uni, comment les identités individuelles et collectives se définissent **par rapport à ces nations**, et quels sont les **vecteurs d’union**. C’est l’axe que ta classe étudie forcément cette année.

## Quatre nations
| Nation | Capitale | Saint patron | Parlement propre |
| Angleterre | Londres | saint George | non (Westminster) |
| Écosse | Édimbourg | saint Andrew | Scottish Parliament (1999) |
| Pays de Galles | Cardiff | saint David | Senedd (1999) |
| Irlande du Nord | Belfast | saint Patrick | Northern Ireland Assembly (1998) |

## Comment le Royaume s’est construit
@ 1535-1542 — Les Laws in Wales Acts rattachent le pays de Galles à l’Angleterre
@ 1603 — Union des couronnes : Jacques VI d’Écosse devient aussi Jacques Ier d’Angleterre
@ 1707 — Actes d’Union : naissance du royaume de Grande-Bretagne
@ 1801 — Union avec l’Irlande : le Royaume-Uni de Grande-Bretagne et d’Irlande
@ 1922 — L’État libre d’Irlande se sépare ; l’Irlande du Nord reste britannique
@ 1997-1999 — Référendums, puis dévolution : l’Écosse et le pays de Galles ont leur parlement
@ 2014 — Référendum écossais : 55 % pour rester dans le Royaume-Uni
@ 2016 — Brexit : 52 % pour quitter l’UE, mais l’Écosse (62 %) et l’Irlande du Nord (56 %) votent pour rester
@ 2020 — Le Royaume-Uni quitte l’Union européenne (31 janvier)

## La dévolution
**Devolution** : Londres **délègue** des compétences (éducation, santé, parfois fiscalité) aux nations, sans renoncer à sa souveraineté. En 2022, la **Cour suprême** a jugé que l’Écosse ne pouvait organiser seule un nouveau référendum d’indépendance.

## Les vecteurs d’union
1. La **Couronne** et le drapeau, l’**Union Jack**, qui superpose les croix de saint George, saint Andrew et saint Patrick (le pays de Galles n’y figure pas).
2. La **BBC** (fondée en 1922), média public de tout le Royaume — et vecteur de *soft power* dans le monde.
3. Le **NHS** (1948), fierté partagée.
4. Mais le **sport** divise : chaque nation a sa propre équipe de football et de rugby.

## Vocabulaire utile
| Anglais | Français |
| devolution | la dévolution, décentralisation politique |
| a referendum | un référendum |
| to secede / secession | faire sécession |
| independence | l’indépendance |
| a nation / a state | une nation / un État |
| to leave / to remain | partir / rester |
| sovereignty | la souveraineté |
| the Union Jack | le drapeau britannique |

## Pour argumenter à l’oral
- *Brexit has strengthened the case for Scottish independence.*
- *One can feel both Scottish and British.*
- *What still holds the United Kingdom together is…*

> Nation n’est pas État : l’Écosse est une **nation** (une histoire, une identité, un parlement), le Royaume-Uni est l’**État**. Un Écossais peut se dire *Scottish* et *British* à la fois.

## Exemple travaillé
*In 2014, 55 % of Scots voted to stay in the UK, partly to remain in the EU. Two years later, Scotland voted 62 % to remain in the EU but was taken out with the rest of the UK: the question of independence came back.*`,
          },
          questions: [
            ['Quel texte de 1707 crée le royaume de Grande-Bretagne ?', ['Les Actes d’Union', 'La Magna Carta', 'Le Bill of Rights', 'Le traité de Paris'], 0, 'L’Angleterre et l’Écosse n’ont plus qu’un Parlement.'],
            ['Quel résultat donne le référendum écossais de 2014 ?', ['Environ 55 % pour l’indépendance', 'Une égalité parfaite', 'Environ 55 % pour rester dans le Royaume-Uni', 'Il a été annulé'], 2, 'Le « No » l’emporte.'],
            ['Comment l’Écosse vote-t-elle au référendum sur le Brexit en 2016 ?', ['À 62 % pour quitter l’UE', 'À 52 % pour quitter l’UE', 'Elle ne vote pas', 'À 62 % pour rester dans l’UE'], 3, 'Une fracture avec l’Angleterre.'],
            ['Que signifie « devolution » ?', ['Une révolution', 'Le transfert de compétences de Londres vers les nations', 'L’indépendance', 'Un retour en arrière'], 1, 'Mise en place en 1998-1999.'],
            ['Quelle nation n’est pas représentée sur l’Union Jack ?', ['L’Angleterre', 'L’Écosse', 'Le pays de Galles', 'L’Irlande'], 2, 'Le pays de Galles était déjà rattaché à l’Angleterre.'],
            ['Quel est le saint patron de l’Écosse ?', ['Saint Andrew', 'Saint George', 'Saint David', 'Saint Patrick'], 0, 'Sa croix blanche sur fond bleu est le drapeau écossais.'],
            ['En 1603, Jacques VI d’Écosse devient aussi roi d’Angleterre.', ['Vrai', 'Faux'], 0, 'C’est l’union des couronnes, pas encore celle des parlements.'],
            ['Quand le Royaume-Uni quitte-t-il officiellement l’Union européenne ?', ['Le 23 juin 2016', 'Le 29 mars 2019', 'Le 31 janvier 2020', 'Le 1er janvier 2021'], 2, 'La période de transition dure ensuite jusqu’à fin 2020.'],
            ['Comment s’appelle le parlement gallois ?', ['Senedd', 'Holyrood', 'Stormont', 'Westminster'], 0, 'Holyrood est écossais, Stormont nord-irlandais.'],
            ['Qu’a jugé la Cour suprême britannique en 2022 ?', ['Que le Brexit était illégal', 'Que le pays de Galles était indépendant', 'Que la BBC devait être privatisée', 'Que l’Écosse ne pouvait organiser seule un nouveau référendum d’indépendance'], 3, 'Il faut l’accord de Westminster.'],
            ['« Sovereignty » se traduit par…', ['Le souverain', 'La souveraineté', 'La société', 'La sécurité'], 1, 'Un mot central des débats sur le Brexit.'],
            ['En quelle année la BBC a-t-elle été fondée ?', ['1945', '1922', '1066', '1999'], 1, 'D’abord société privée, elle devient publique en 1927.'],
          ],
        },
        {
          titre: 'Écosse, pays de Galles, Irlande du Nord : identités plurielles',
          axe: AXE.royaumeUni,
          lecon: {
            titre: 'Scottish, Welsh, Irish — and British?',
            cours: `On peut être britannique et se sentir d’abord écossais, gallois, irlandais — ou refuser l’un des deux mots. Trois nations, trois façons de vivre l’Union.

## L’Écosse : Glasgow et Édimbourg, deux visages
| | Glasgow | Édimbourg |
| Identité | La ville ouvrière, les chantiers navals de la **Clyde** | La capitale, les institutions, le château |
| Aujourd’hui | Reconversion culturelle ; a accueilli la **COP26** (2021) | Le **Festival** et le **Fringe** (depuis 1947), le Parlement de **Holyrood** (bâtiment ouvert en 2004) |
| Image | Populaire, rebelle | Bourgeoise, touristique |

Repères écossais : le **SNP** (parti indépendantiste), le poète **Robert Burns** fêté chaque 25 janvier (*Burns Night*), le **gaélique écossais**, la **pierre du destin** rendue à l’Écosse en 1996.

## Le pays de Galles : une langue qui revit
1. Le **gallois** (*Cymraeg*), langue celtique, est parlé par environ un Gallois sur six.
2. Le **Welsh Language Act** (1993) puis une loi de 2011 lui donnent un statut officiel : panneaux bilingues, écoles en gallois.
3. L’**Eisteddfod**, festival de poésie et de musique en gallois, se tient chaque année.
4. Le rugby est une passion nationale.

## L’Irlande du Nord : identités plurielles
| Unionistes / loyalistes | Nationalistes / républicains |
| Majoritairement protestants | Majoritairement catholiques |
| Veulent rester dans le Royaume-Uni | Souhaitent la réunification avec l’Irlande |
| Disent *Londonderry* | Disent *Derry* |

- Les **Troubles** (fin des années 1960 – 1998) : environ 3 500 morts.
- **Bloody Sunday**, 30 janvier 1972 à Derry : treize manifestants tués par l’armée britannique le jour même.
- Les **accords du Vendredi saint** (*Good Friday Agreement*, 10 avril 1998) : partage du pouvoir entre les deux communautés, droit de se dire britannique, irlandais, ou les deux.
- Les **murs de la paix** (*peace walls*) séparent encore certains quartiers de Belfast.
- Le Brexit rouvre la question de la frontière irlandaise ; en 2024, **Michelle O’Neill** devient la première Première ministre nationaliste.

## Vocabulaire utile
| Anglais | Français |
| a unionist / a nationalist | un unioniste / un nationaliste |
| the Troubles | les « troubles », le conflit nord-irlandais |
| a ceasefire | un cessez-le-feu |
| power-sharing | le partage du pouvoir |
| a peace wall | un mur de la paix |
| shipbuilding | la construction navale |
| a minority language | une langue minoritaire |
| to revive | faire revivre |

## Pour argumenter à l’oral
- *Identity is not a single box to tick.*
- *The Good Friday Agreement allows people to be British, Irish, or both.*
- *Language is a key part of Welsh identity.*

> Le point commun des trois nations : l’identité se dit au pluriel. L’accord de 1998 l’inscrit même dans le droit, en laissant chacun choisir sa ou ses nationalités.

## Exemple travaillé
*In Belfast, peace walls still separate some Catholic and Protestant neighbourhoods, more than twenty-five years after the Good Friday Agreement. Peace was signed in 1998; living together is still being built.*`,
          },
          questions: [
            ['Quand sont signés les accords du Vendredi saint ?', ['Le 30 janvier 1972', 'Le 18 septembre 2014', 'Le 10 avril 1998', 'Le 1er janvier 1973'], 2, 'Ils mettent fin aux Troubles.'],
            ['Que s’est-il passé le 30 janvier 1972 à Derry ?', ['La signature d’un traité', 'Un match de rugby', 'La fondation du SNP', 'Bloody Sunday : treize manifestants tués par l’armée britannique'], 3, 'Un tournant des Troubles.'],
            ['Quel fleuve est associé aux chantiers navals de Glasgow ?', ['La Tamise', 'La Clyde', 'La Severn', 'Le Tay'], 1, 'Des milliers de navires y furent construits.'],
            ['Quel festival se tient à Édimbourg depuis 1947 ?', ['Glastonbury', 'L’Eisteddfod', 'Le Fringe', 'Notting Hill'], 2, 'Avec le Festival international, le plus grand festival d’arts du monde.'],
            ['Que fête-t-on le 25 janvier en Écosse ?', ['Burns Night', 'Saint Andrew', 'Hogmanay', 'La fête nationale'], 0, 'L’anniversaire du poète Robert Burns.'],
            ['Les nationalistes nord-irlandais souhaitent majoritairement la réunification avec l’Irlande.', ['Vrai', 'Faux'], 0, 'Les unionistes veulent rester dans le Royaume-Uni.'],
            ['Quel festival gallois célèbre la poésie et la musique en gallois ?', ['Le Fringe', 'Hogmanay', 'L’Eisteddfod', 'Les Proms'], 2, 'Il se tient chaque année.'],
            ['Que signifie « power-sharing » ?', ['Le partage du pouvoir entre communautés', 'La séparation des pouvoirs', 'La coupure d’électricité', 'La dictature'], 0, 'Le principe clé de l’accord de 1998.'],
            ['Quelle ville a accueilli la COP26 en 2021 ?', ['Édimbourg', 'Cardiff', 'Belfast', 'Glasgow'], 3, 'La conférence de l’ONU sur le climat.'],
            ['Que désignent les « peace walls » de Belfast ?', ['Des monuments aux morts', 'Des murs qui séparent des quartiers catholiques et protestants', 'Des murs de graffitis', 'Les remparts médiévaux'], 1, 'Beaucoup sont encore debout.'],
            ['Quel nom de ville emploient plutôt les unionistes ?', ['Derry', 'Londonderry', 'Belfast', 'Dublin'], 1, 'Les nationalistes disent Derry.'],
            ['Quelle loi de 1993 donne un statut officiel au gallois ?', ['Le Scotland Act', 'L’Act of Union', 'Le Education Act', 'Le Welsh Language Act'], 3, 'Une loi de 2011 renforce ce statut.'],
          ],
        },
      ],
    },

    // ================================ LA LANGUE =============================
    {
      niveaux: ['Tle'],
      positionDepart: 32,
      rayon: 'langue',
      chapitres: [
        {
          titre: 'L’inversion : Not only did he…, Had I known…',
          axe: 'La phrase',
          lecon: {
            titre: 'Mettre l’auxiliaire devant le sujet pour frapper fort',
            cours: `*Never have I seen such a crowd* : l’auxiliaire passe devant le sujet, comme dans une question, mais la phrase n’interroge pas. Elle **insiste**. C’est l’une des marques de l’anglais écrit soutenu.

## Le mécanisme
Quand une phrase commence par un **adverbe négatif ou restrictif**, on inverse **auxiliaire** et **sujet**, exactement comme dans une question.

| Phrase neutre | Phrase avec inversion |
| *I have **never** seen such a crowd.* | ***Never have I** seen such a crowd.* |
| *She **rarely** complains.* | ***Rarely does she** complain.* |
| *He **not only** lied, he also stole.* | ***Not only did he** lie, he also stole.* |

> S’il n’y a pas d’auxiliaire (présent ou prétérit simple), on appelle **do / does / did**, comme pour une question : *Rarely **does** she complain.*

## Les déclencheurs à connaître
| Adverbe | Sens | Exemple |
| *Never* | jamais | *Never had they felt so free.* |
| *Rarely, Seldom* | rarement | *Seldom do we see such courage.* |
| *Not only… but also* | non seulement… mais aussi | *Not only is it cheap, but it is also efficient.* |
| *Hardly… when* | à peine… que | *Hardly had she arrived when the phone rang.* |
| *No sooner… than* | à peine… que | *No sooner had he left than it started to rain.* |
| *Under no circumstances* | en aucun cas | *Under no circumstances should you open this door.* |
| *Only then / Only later* | ce n’est qu’alors que | *Only then did I understand.* |
| *Little* | (bien) peu | *Little did they know that…* |

!> *Hardly* va avec **when**, *No sooner* avec **than** : *No sooner had he left **when**…* est une faute classique.

## L’inversion dans la condition
Dans un anglais soutenu, on peut supprimer **if** et inverser.
1. ***Had I known**, I would have come.* = *If I had known…*
2. ***Were she** here, she would help us.* = *If she were here…*
3. ***Should you need** help, call me.* = *If you (should) need help…*

## À quoi ça sert dans une copie
L’inversion met en relief une idée forte, souvent en ouverture ou en conclusion de paragraphe. Une ou deux par essai suffisent : au-delà, le style devient pesant.

## Exemple travaillé
Phrase de départ : *The government did not only ignore the warnings; it also cut the budget.*
Version soutenue : ***Not only did the government ignore** the warnings, **but** it **also** cut the budget.*
Traduction : « Non seulement le gouvernement a ignoré les avertissements, mais il a aussi réduit le budget. »`,
          },
          questions: [
            ['Complète : « Never ___ such a crowd. »', ['I have seen', 'I saw', 'did I saw', 'have I seen'], 3, 'Adverbe négatif en tête : auxiliaire avant le sujet.', 'Quelle forme suit « Never » en tête de phrase ?'],
            ['Complète : « Rarely ___ complain. »', ['she does', 'does she', 'she', 'did she complains'], 1, 'Pas d’auxiliaire au présent simple : on appelle does.', 'Quelle forme suit « Rarely » en tête de phrase ?'],
            ['Quelle conjonction accompagne « No sooner » ?', ['when', 'that', 'than', 'as'], 2, 'No sooner… than ; Hardly… when.'],
            ['« Had I known, I would have come » équivaut à…', ['If I had known, I would have come.', 'If I knew, I would come.', 'When I knew, I came.', 'I knew and I came.'], 0, 'Inversion sans if pour l’irréel du passé.'],
            ['« Hardly had she arrived when the phone rang » signifie…', ['Elle est arrivée difficilement', 'Elle n’est jamais arrivée', 'À peine était-elle arrivée que le téléphone a sonné', 'Elle est arrivée après l’appel'], 2, 'Hardly… when = à peine… que.'],
            ['« Not only it is cheap, but it is also efficient » est correct.', ['Vrai', 'Faux'], 1, 'On inverse : Not only is it cheap…'],
            ['Comment dire « En aucun cas vous ne devez ouvrir cette porte » ?', ['Under no circumstances should you open this door.', 'Under no circumstances you should open this door.', 'In no case you must open this door.', 'Under no circumstances you open this door.'], 0, 'Expression négative en tête : inversion.'],
            ['« Should you need help, call me » signifie…', ['Tu devrais avoir besoin d’aide', 'Tu as besoin d’aide, appelle-moi', 'Tu n’as pas besoin d’aide', 'Si jamais tu as besoin d’aide, appelle-moi'], 3, 'Should inversé = if + should.'],
            ['« Little did they know that… » se traduit par…', ['Ils savaient un peu que…', 'Ils étaient loin de se douter que…', 'Ils savaient tout de…', 'Ils ont appris peu à peu que…'], 1, 'Little inversé = ils ignoraient complètement.'],
            ['Complète : « Only then ___ the truth. »', ['I understood', 'did I understand', 'I did understand', 'understood I'], 1, 'Only then en tête : inversion avec did.', 'Quelle forme suit « Only then » en tête de phrase ?'],
            ['Quelle phrase contient une inversion conditionnelle correcte ?', ['Was she here, she helps us.', 'If were she here, she would help.', 'She were here, she would help us.', 'Were she here, she would help us.'], 3, 'Were + sujet = if + sujet + were.'],
            ['Pourquoi emploie-t-on l’inversion dans un essai ?', ['Pour mettre en relief une idée forte', 'Pour poser une question', 'Pour exprimer le futur', 'Pour éviter le passif'], 0, 'C’est un procédé d’insistance du registre soutenu.'],
          ],
        },
        {
          titre: 'Le subjonctif et l’irréel : It is essential that he be…',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Exiger, proposer, préférer — la base verbale nue',
            cours: `*It is essential that every citizen **be** informed* : pas de *is*, pas de *-s*. Ce n’est pas une faute, c’est le **subjonctif** anglais, discret mais très présent dans l’écrit argumenté.

## Le subjonctif « présent » : la base verbale à toutes les personnes
Après les verbes et adjectifs d’**exigence**, de **recommandation** ou d’**importance**, suivis de **that**, on emploie la **base verbale**, sans -s, même à la troisième personne.

| Déclencheur | Exemple |
| *insist, demand, require* | *They insisted that he **leave** at once.* |
| *suggest, recommend, propose* | *I recommend that she **see** a doctor.* |
| *it is essential / vital / crucial that* | *It is essential that everyone **be** equal before the law.* |
| *it is important / necessary that* | *It is important that the law **protect** minorities.* |

- Avec **be** : *be* à toutes les personnes (*that he **be***, *that they **be***).
- À la négation : **not** + base verbale, sans *do* : *We suggest that he **not** travel alone.*

> L’anglais britannique courant remplace souvent le subjonctif par **should** : *I suggest that he **should** leave.* Les deux sont corrects ; en copie, le subjonctif fait plus soutenu.

## Le subjonctif « passé » : l’irréel
| Structure | Exemple | Sens |
| *as if / as though* + prétérit | *He talks **as if** he **knew** everything.* | Comme s’il savait tout (il ne sait pas). |
| *as if* + past perfect | *She looked **as if** she **had seen** a ghost.* | Comme si elle avait vu un fantôme. |
| *I’d rather* + sujet + prétérit | *I’d rather you **stayed**.* | Je préférerais que tu restes. |
| *it’s (high) time* + prétérit | *It’s high time the government **acted**.* | Il est grand temps que… |
| *if I were* | *If I **were** you, I would accept.* | Si j’étais toi… |

## Les formules figées
Le subjonctif survit dans des expressions toutes faites : *God **save** the King*, *Long **live** the Queen*, *Be that as it may* (quoi qu’il en soit), *Come what may* (advienne que pourra), *So **be** it* (ainsi soit-il).

!> *It is essential that he **is** present* n’est pas faux dans l’usage courant, mais *that he **be** present* est la forme attendue à l’écrit soutenu. En revanche, *that he **bes*** ou *that he **to be*** n’existent pas.

## Exemple travaillé
« Il est indispensable que chaque élève soit traité de la même façon, et je propose que l’école ne fasse aucune exception. »
→ *It is essential that every pupil **be** treated equally, and I propose that the school **not make** any exception.*`,
          },
          questions: [
            ['Complète : « It is essential that everyone ___ equal before the law. »', ['is being', 'be', 'are', 'to be'], 1, 'Subjonctif : base verbale be.', 'Quelle forme suit « It is essential that everyone » à l’écrit soutenu ?'],
            ['Complète : « They insisted that he ___ at once. »', ['leaves', 'left', 'leave', 'to leave'], 2, 'Base verbale sans -s après insist that.', 'Quelle forme suit « insisted that he » ?'],
            ['Comment met-on un subjonctif à la négation ?', ['not + base verbale', 'don’t + base verbale', 'doesn’t + base verbale', 'base verbale + not'], 0, 'We suggest that he not travel alone.'],
            ['Quelle alternative britannique courante remplace le subjonctif ?', ['would', 'must', 'should', 'will'], 2, 'I suggest that he should leave.'],
            ['« He talks as if he knew everything » signifie…', ['Il parle comme s’il savait tout', 'Il sait tout', 'Il parlait de tout', 'Il saura tout'], 0, 'As if + prétérit : l’irréel.'],
            ['« I’d rather you stayed » signifie…', ['Tu es resté', 'Je préfère rester', 'Tu préfères rester', 'Je préférerais que tu restes'], 3, 'I’d rather + autre sujet + prétérit.'],
            ['« God save the King » contient un subjonctif.', ['Vrai', 'Faux'], 0, 'Sinon, on dirait saves.'],
            ['Complète : « It’s high time the government ___. »', ['act', 'acted', 'acts', 'will act'], 1, 'It’s high time + prétérit.', 'Quel temps suit « It’s high time the government » ?'],
            ['Que signifie « Come what may » ?', ['Viens quand tu veux', 'Advienne que pourra', 'Qui vivra verra', 'Viens en mai'], 1, 'Une formule figée au subjonctif.'],
            ['Complète : « She looked as if she ___ a ghost. »', ['saw', 'has seen', 'sees', 'had seen'], 3, 'As if + past perfect pour un irréel antérieur.', 'Quel temps suit « as if she » pour une action antérieure ?'],
            ['Laquelle est correcte ?', ['I recommend that she see a doctor.', 'I recommend that she sees a doctor.', 'I recommend that she to see a doctor.', 'I recommend she seeing a doctor.'], 0, 'Subjonctif : base verbale.'],
            ['Comment traduire « Si j’étais toi, j’accepterais » ?', ['If I was you, I will accept.', 'If I am you, I would accept.', 'If I were you, I would accept.', 'Were I you, I will accept.'], 2, 'If I were : subjonctif de l’irréel.'],
          ],
        },
        {
          titre: 'BE + -ING à tous les temps et avec les modaux',
          axe: 'Les temps',
          lecon: {
            titre: 'Will be living, could have been waiting',
            cours: `Tu connais *I am working* et *I was working*. Mais *BE + -ING* se combine avec **tous** les temps et **tous** les modaux, et chaque combinaison garde la même valeur : l’action vue **en cours**, de l’intérieur.

## La valeur, toujours la même
BE + -ING présente une action **en déroulement**, **inachevée**, ou **temporaire**, et souvent le point de vue de celui qui parle sur elle. Seul le repère (passé, futur, hypothèse) change.

## Le futur en BE + -ING
| Forme | Exemple | Valeur |
| *will be* + V-ING | *This time tomorrow, I**’ll be flying** to Boston.* | Action en cours à un moment du futur |
| *will be* + V-ING | *In 2050, people **will be living** in new places.* | Une situation qui se déroulera |
| *will have been* + V-ING | *By June, she **will have been working** here for ten years.* | Durée jusqu’à un point du futur |

*Will you **be using** the car tonight?* : une question polie, qui demande un programme sans faire pression.

## Les modaux + BE + -ING
| Forme | Exemple | Sens |
| modal + *be* + V-ING | *She **must be sleeping**.* | Elle doit être en train de dormir (déduction sur le présent) |
| | *They **might be waiting** for us.* | Ils nous attendent peut-être en ce moment |
| modal + *have been* + V-ING | *He **must have been lying**.* | Il devait mentir (déduction sur une action en cours dans le passé) |
| | *They **could have been waiting** for hours.* | Ils ont pu attendre des heures |
| | *You **should have been listening**!* | Tu aurais dû écouter (au lieu de…) |

> Comparer : *He must have lied* (il a dû mentir, un fait ponctuel) — *He must have been lying* (il devait être en train de mentir, pendant tout ce temps).

## Le past perfect en BE + -ING, rappel utile
*She **had been crying** when I arrived.* — Ses yeux rouges sont le résultat d’une activité qui a duré juste avant.

## Les verbes qui refusent BE + -ING
Les verbes d’**état** (*know, believe, belong, own, seem, understand*) ne se mettent pas à la forme en -ING, quel que soit le temps : *By then, I **will have known** him for twenty years* — pas *will have been knowing*.

!> *I will be knowing the results tomorrow* est une faute : *know* est un verbe d’état → *I will know the results tomorrow*.

## Exemple travaillé
« Il devait être en train de conduire quand tu l’as appelé ; à cette heure-ci demain, il sera en route pour Londres. »
→ *He **must have been driving** when you called him; this time tomorrow, he**’ll be travelling** to London.*`,
          },
          questions: [
            ['Comment dire « Demain à cette heure-ci, je serai en train de voler vers Boston » ?', ['This time tomorrow, I will fly to Boston.', 'This time tomorrow, I’m flying to Boston.', 'This time tomorrow, I’ll be flying to Boston.', 'This time tomorrow, I will have flown to Boston.'], 2, 'Will be + V-ING : action en cours dans le futur.'],
            ['« She must be sleeping » exprime…', ['Une déduction : elle doit être en train de dormir', 'Une obligation de dormir', 'Un conseil', 'Un souvenir'], 0, 'Modal épistémique + be + V-ING.'],
            ['Quelle différence entre « He must have lied » et « He must have been lying » ?', ['Aucune', 'La première parle du futur', 'La seconde insiste sur une action en cours, qui a duré', 'La seconde est fautive'], 2, 'BE + -ING = l’action vue en déroulement.'],
            ['Complète : « By June, she ___ here for ten years. »', ['will have been working', 'will work', 'is working', 'has been working'], 0, 'Durée jusqu’à un point du futur.', 'Quelle forme exprime une durée jusqu’à un moment du futur ?'],
            ['« They could have been waiting for hours » signifie…', ['Ils attendront des heures', 'Ils ne peuvent pas attendre', 'Ils attendent depuis des heures', 'Ils ont pu attendre des heures'], 3, 'Could have been + V-ING : une possibilité sur une durée passée.'],
            ['« I will be knowing the results tomorrow » est correct.', ['Vrai', 'Faux'], 1, 'Know est un verbe d’état : I will know.'],
            ['« Will you be using the car tonight? » est…', ['Un ordre', 'Une question polie sur un programme', 'Un reproche', 'Une menace'], 1, 'Elle demande sans faire pression.'],
            ['Complète : « You should have been ___! » (tu aurais dû écouter)', ['listen', 'listening', 'listened', 'to listen'], 1, 'Should have been + V-ING.', 'Quelle forme complète « should have been » ?'],
            ['« She had been crying when I arrived » suggère…', ['Qu’elle a pleuré après mon arrivée', 'Qu’elle ne pleure jamais', 'Qu’elle pleurera', 'Qu’elle avait pleuré juste avant mon arrivée, et que ça se voyait'], 3, 'Past perfect BE + -ING : trace d’une activité antérieure.'],
            ['Quel verbe ne se met PAS à la forme en -ING ?', ['believe', 'work', 'travel', 'wait'], 0, 'Believe est un verbe d’état.'],
            ['« They might be waiting for us » signifie…', ['Ils nous attendaient peut-être', 'Ils doivent nous attendre', 'Ils nous attendent peut-être en ce moment', 'Ils nous attendront sûrement'], 2, 'Might + be + V-ING : possibilité sur le présent.'],
            ['Comment traduire « Il devait être en train de conduire quand tu l’as appelé » ?', ['He must drive when you called him.', 'He had to drive when you called him.', 'He must be driving when you called him.', 'He must have been driving when you called him.'], 3, 'Déduction sur une action en cours dans le passé.'],
          ],
        },
        {
          titre: 'Le passif avancé : modaux, verbes à particule, compléments',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Should have been done, was looked after',
            cours: `Tu sais former *The bridge was built in 1890*. Au niveau B2, le passif se combine avec les **modaux**, les **verbes à particule** et les **compléments doubles** — trois terrains où les francophones trébuchent.

## Le passif avec un modal
**Modal + be + participe passé** (présent ou futur) ; **modal + have been + participe passé** (passé).

| Actif | Passif |
| *They must repair the road.* | *The road **must be repaired**.* |
| *Someone should have warned them.* | *They **should have been warned**.* |
| *We can’t solve this problem easily.* | *This problem **can’t be solved** easily.* |
| *They might have stolen it.* | *It **might have been stolen**.* |

> Le modal ne bouge pas : c’est *be* (ou *have been*) qui porte le passif. *The road must **be** repaired*, jamais *must repaired*.

## Le passif des verbes à particule
La particule **reste collée au verbe**, même si elle se retrouve en fin de phrase.
- *They looked after the children well.* → *The children **were** well **looked after**.*
- *Nobody has dealt with the complaint.* → *The complaint **hasn’t been dealt with**.*
- *The crowd laughed at him.* → *He **was laughed at**.*

!> Ne jamais supprimer la préposition : *The complaint hasn’t been dealt* ne veut rien dire.

## Les compléments complexes
1. **Deux compléments** (*give, offer, tell, grant, deny*) : on met en sujet la **personne**, c’est plus naturel.
   *They didn’t give women the freedom they claimed.* → ***Women were not given** the freedom they rightly claimed.*
2. **Verbe + complément + infinitif** (*make, see, hear*) : le *to* réapparaît au passif.
   *They made him apologise.* → *He **was made to** apologise.*
3. **Tournures impersonnelles** de l’opinion : *He **is said to be** rich* (on dit qu’il est riche) ; *She **is believed to have left** the country* (on pense qu’elle a quitté le pays).

## Get + participe passé
À l’oral, **get** remplace souvent *be* pour un changement ou un incident : *He **got fired**. They **got married**. My bike **got stolen**.*

## Exemple travaillé
« On aurait dû prévenir les habitants ; on dit que la digue a été mal entretenue, et personne ne s’est occupé des plaintes. »
→ *The residents **should have been warned**; the dyke **is said to have been** poorly maintained, and the complaints **were never dealt with**.*`,
          },
          questions: [
            ['Passif de « They must repair the road » :', ['The road must be repaired.', 'The road must repaired.', 'The road must being repaired.', 'The road is must repaired.'], 0, 'Modal + be + participe passé.'],
            ['Passif de « Someone should have warned them » :', ['They should have warned.', 'They should be warned.', 'They should have been warned.', 'They should had been warned.'], 2, 'Modal + have been + participe passé pour le passé.'],
            ['Passif de « They looked after the children well » :', ['The children were well looked after.', 'The children were well looked.', 'The children were looked well.', 'The children looked after well.'], 0, 'La particule reste collée au verbe.'],
            ['« He was laughed at » signifie…', ['Il a ri', 'Il a fait rire', 'Il riait de tout', 'On s’est moqué de lui'], 3, 'Passif de to laugh at someone.'],
            ['Passif naturel de « They didn’t give women the right to vote » :', ['The right was not given women.', 'Women were not given the right to vote.', 'Women did not give the right.', 'The right to vote was not giving.'], 1, 'On met la personne en sujet.'],
            ['Passif de « They made him apologise » :', ['He was made apologise.', 'He was made to apologise.', 'He made to apologise.', 'He was make to apologise.'], 1, 'Le to réapparaît au passif après make.'],
            ['« She is believed to have left the country » signifie…', ['Elle croit avoir quitté le pays', 'Elle quittera le pays', 'On l’a obligée à partir', 'On pense qu’elle a quitté le pays'], 3, 'Tournure impersonnelle de l’opinion.'],
            ['« The complaint hasn’t been dealt » est une phrase correcte.', ['Vrai', 'Faux'], 1, 'Il manque with : hasn’t been dealt with.'],
            ['« My bike got stolen » est…', ['Un passif familier avec get', 'Une faute', 'Un actif', 'Un futur'], 0, 'Get + participe : changement ou incident.'],
            ['Comment dire « On dit qu’il est riche » ?', ['He says to be rich.', 'It says he rich.', 'He is said to be rich.', 'He is saying rich.'], 2, 'Be said to + base verbale.'],
            ['Passif de « We can’t solve this problem easily » :', ['This problem can’t solved easily.', 'This problem isn’t can solved.', 'This problem can’t being solved.', 'This problem can’t be solved easily.'], 3, 'Modal + be + participe passé.'],
            ['Passif de « They might have stolen it » :', ['It might be stolen.', 'It might have been stolen.', 'It might have stolen.', 'It might has been stolen.'], 1, 'Modal + have been + participe passé.'],
          ],
        },
        {
          titre: 'Former les mots : préfixes, suffixes, conversion',
          axe: 'Lexique et traduction',
          lecon: {
            titre: 'Deviner un mot qu’on n’a jamais vu',
            cours: `*Unbreakable*, *homelessness*, *to google* : tu ne les as peut-être jamais appris, mais tu peux les comprendre. L’anglais fabrique ses mots avec des pièces détachées — les connaître, c’est lire plus vite et écrire plus juste.

## Les préfixes : ils changent le sens
| Préfixe | Sens | Exemples |
| *un-, in-, im-, il-, ir-, dis-* | contraire | *unfair, invisible, impossible, illegal, irrelevant, dishonest* |
| *mis-* | mal, de travers | *to misunderstand, misleading* |
| *re-* | de nouveau | *to rebuild, to rethink* |
| *over- / under-* | trop / pas assez | *overcrowded, underpaid* |
| *pre- / post-* | avant / après | *pre-war, postcolonial* |
| *anti- / pro-* | contre / pour | *anti-racist, pro-European* |
| *co-* | ensemble | *to cooperate, co-author* |

## Les suffixes : ils changent la nature du mot
| Suffixe | Forme | Exemples |
| *-ness, -ity, -ment, -tion, -hood* | des **noms** | *happiness, equality, government, education, childhood* |
| *-er, -or, -ist* | une **personne** | *employer, actor, scientist* |
| *-ee* | celui qui **subit** | *employee, refugee, trainee* |
| *-ful / -less* | avec / sans | *hopeful, hopeless, careless* |
| *-able, -ible* | qu’on peut | *affordable, unbreakable* |
| *-ize / -ise, -en, -ify* | des **verbes** | *to modernise, to widen, to simplify* |
| *-ly* | des **adverbes** | *quickly, freely* |

> Pour décoder un mot long, découpe-le : *un-employ-ment* = le fait de ne pas avoir d’emploi, le chômage. *home-less-ness* = le fait d’être sans logis.

## La conversion : même mot, autre nature
L’anglais transforme un mot en une autre catégorie **sans rien changer** à sa forme.
- nom → verbe : *a text* → *to text* ; *Google* → *to google* ; *a bottle* → *to bottle*.
- verbe → nom : *to run* → *a run* ; *to look* → *a look*.
- adjectif → verbe : *empty* → *to empty* ; *clean* → *to clean*.
Parfois seul l’**accent** bouge : *a **REC**ord* (nom) / *to re**CORD*** (verbe) ; *a **PRO**test* / *to pro**TEST***.

## La composition
Deux mots en font un troisième : *breakthrough, lifestyle, heartbroken, far-reaching, self-made*.

!> Le préfixe négatif ne se choisit pas au hasard : on dit *unhappy* mais *dishonest*, *impossible* mais *unable*. En cas de doute, apprends le mot entier avec son contraire.

## Exemple travaillé
Dans un article : *The government’s overambitious reforms left many underpaid workers feeling powerless.*
Découpage : *over-ambitious* (trop ambitieuses), *under-paid* (sous-payés), *power-less* (impuissants).
Traduction : « Les réformes trop ambitieuses du gouvernement ont laissé de nombreux travailleurs sous-payés dans un sentiment d’impuissance. »`,
          },
          questions: [
            ['Quel est le contraire de « honest » ?', ['unhonest', 'inhonest', 'dishonest', 'mishonest'], 2, 'Dis- ici, pas un-.'],
            ['Que signifie « to misunderstand » ?', ['Mal comprendre', 'Comprendre à nouveau', 'Faire comprendre', 'Ne pas vouloir comprendre'], 0, 'Mis- = mal, de travers.'],
            ['« An employee » est…', ['Un employeur', 'Un chômeur', 'Un emploi', 'Un salarié, un employé'], 3, '-ee désigne celui qui subit l’action ; -er celui qui la fait.'],
            ['Quel suffixe forme un nom abstrait à partir de « happy » ?', ['-ful', '-ness', '-ly', '-ize'], 1, '*-ness* transforme un adjectif en nom abstrait : *happy* → *happiness* (le *y* devient *i*), *kind* → *kindness*.'],
            ['Que signifie « homelessness » ?', ['Le mal du pays', 'Le fait d’être sans logis', 'Le confort du foyer', 'La vie de famille'], 1, 'Home + less (sans) + ness (le fait de).'],
            ['« To text » est un exemple de conversion d’un nom en verbe.', ['Vrai', 'Faux'], 0, 'A text → to text, sans changer la forme.'],
            ['Comment distingue-t-on à l’oral « a record » et « to record » ?', ['Par l’orthographe', 'Par un -s', 'On ne peut pas', 'Par la place de l’accent'], 3, 'REcord (nom) / reCORD (verbe).'],
            ['Que signifie « overcrowded » ?', ['Surpeuplé', 'Désert', 'Bien organisé', 'Couvert'], 0, 'Le préfixe *over-* veut dire « trop » : *overcrowded*, c’est trop de monde (*crowd* = la foule).'],
            ['Quel est le contraire de « careful » ?', ['uncareful', 'discareful', 'careless', 'carefree'], 2, 'Le suffixe *-less* veut dire « sans » : *careless* = sans soin. *Carefree* existe, mais signifie « insouciant ».'],
            ['Quel suffixe forme un verbe à partir de « wide » ?', ['-ness', '-ful', '-ity', '-en'], 3, 'To widen = élargir.'],
            ['Que signifie « unaffordable » ?', ['Gratuit', 'Inabordable, trop cher', 'Bon marché', 'Disponible'], 1, 'Un- + afford (avoir les moyens) + -able.'],
            ['Quel préfixe signifie « après » ?', ['pre-', 'anti-', 'post-', 'co-'], 2, 'Postcolonial, post-war.'],
          ],
        },
        {
          titre: 'Les faux amis et les pièges de la traduction',
          axe: 'Lexique et traduction',
          lecon: {
            titre: 'Eventually n’a rien d’éventuel',
            cours: `*Actually*, *eventually*, *library* : ils ressemblent à des mots français et ne disent pas du tout la même chose. En version comme en essai, un faux ami suffit à renverser le sens d’une phrase.

## Les faux amis les plus coûteux
| Anglais | Veut dire | Ne veut PAS dire | « Le mot français » se dit… |
| *actually* | en fait | actuellement | *currently, nowadays* |
| *eventually* | finalement | éventuellement | *possibly* |
| *library* | bibliothèque | librairie | *bookshop* |
| *sensible* | raisonnable | sensible | *sensitive* |
| *to attend* | assister à | attendre | *to wait* |
| *to pretend* | faire semblant | prétendre (affirmer) | *to claim* |
| *to realise* | se rendre compte | réaliser (un projet) | *to carry out, to achieve* |
| *a journey* | un voyage, un trajet | une journée | *a day* |
| *deception* | la tromperie | la déception | *disappointment* |
| *to support* | soutenir | supporter (endurer) | *to bear, to stand* |
| *a lecture* | un cours magistral | une lecture | *reading* |
| *to control* | maîtriser, diriger | contrôler (vérifier) | *to check* |
| *chance* | le hasard, la probabilité | la chance (fortune) | *luck* |

> Réflexe de relecture : chaque fois que tu écris un mot anglais qui ressemble trop au français, vérifie-le. C’est souvent là que se cache la faute.

## Les calques de structure
Traduire mot à mot produit de l’anglais qui n’en est pas.
1. « Il y a deux ans » → *two years **ago*** (pas *there are two years*).
2. « Je suis ici depuis lundi » → *I **have been** here **since** Monday* (pas *I am here since*).
3. « Cela dépend de » → *it depends **on*** (pas *of*).
4. « Assister à un match » → *to **attend** a match* ou *to **watch** a match* (pas *to assist*).
5. « Plus de 30 personnes » → *more than 30 people* ; « les gens » → *people* (déjà pluriel : *people **are***).
6. « Informations », « conseils », « bagages » → *information, advice, luggage* : **indénombrables**, jamais de -s.

## Traduire vers le français : rendre le naturel
- *He was said to be rich* → « On disait qu’il était riche » (pas « Il était dit être riche »).
- *She swam across the river* → « Elle a traversé la rivière à la nage ».
- *I’ve been waiting for an hour* → « J’attends depuis une heure » (présent en français).

!> *Eventually, the plan might fail* ne veut pas dire « éventuellement, le plan pourrait échouer » mais « au bout du compte, le plan pourrait échouer ».

## Exemple travaillé
Phrase à traduire : « Actuellement, les étudiants qui assistent aux cours magistraux se rendent compte qu’ils doivent faire semblant de comprendre. »
→ *Currently, students who **attend lectures realise** that they have to **pretend** to understand.*
Quatre faux amis dans la version anglaise… et tous employés dans leur vrai sens.`,
          },
          questions: [
            ['Que signifie « eventually » ?', ['Finalement', 'Éventuellement', 'Évidemment', 'Actuellement'], 0, '« Éventuellement » se dit possibly.'],
            ['Comment dire « actuellement » ?', ['actually', 'eventually', 'actively', 'currently'], 3, 'Actually = en fait.'],
            ['« A library » est…', ['Une librairie', 'Une bibliothèque', 'Un libraire', 'Un livre'], 1, 'La librairie se dit bookshop.'],
            ['« He is a sensible person » signifie qu’il est…', ['Sensible, émotif', 'Raisonnable', 'Sensuel', 'Susceptible'], 1, '« Sensible » en français se dit sensitive.'],
            ['Que signifie « to attend a lecture » ?', ['Attendre une lecture', 'Lire un livre', 'Faire une conférence de presse', 'Assister à un cours magistral'], 3, 'Deux faux amis en trois mots.'],
            ['« To pretend » signifie « prétendre, affirmer ».', ['Vrai', 'Faux'], 1, 'To pretend = faire semblant ; prétendre se dit to claim.'],
            ['Comment traduire « Il y a deux ans » ?', ['Two years ago', 'There are two years', 'Since two years', 'It has two years'], 0, 'Ago se place après la durée.'],
            ['Comment dire « Je suis ici depuis lundi » ?', ['I am here since Monday.', 'I am here for Monday.', 'I have been here since Monday.', 'I was here since Monday.'], 2, 'Present perfect avec since.'],
            ['« Deception » se traduit par…', ['La déception', 'La réception', 'La conception', 'La tromperie'], 3, 'La déception se dit disappointment.'],
            ['Laquelle est correcte ?', ['He gave me many advices.', 'He gave me a lot of advice.', 'He gave me an advice.', 'He gave me advices.'], 1, 'Advice est indénombrable.'],
            ['« To realise » signifie le plus souvent…', ['Réaliser un projet', 'Réaliser un film', 'Se rendre compte', 'Rendre réel'], 2, 'Réaliser un projet se dit to carry out.'],
            ['Comment traduire « She swam across the river » ?', ['Elle a traversé la rivière à la nage', 'Elle a nagé à travers la rivière', 'Elle nageait près de la rivière', 'Elle a longé la rivière'], 0, 'On rend le chassé-croisé naturellement en français.'],
          ],
        },
      ],
    },
  ],
}
