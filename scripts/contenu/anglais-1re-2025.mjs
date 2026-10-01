// Anglais — Première : LES AXES CULTURELS DU PROGRAMME 2025 et UNE GRAMMAIRE
// PROPRE À LA PREMIÈRE (13 fiches).
//
// LE CONSTAT. La 1re montrait les 24 fiches de grammaire de Terminale
// (anglais-1re.mjs les importe de anglais-tle.mjs) et aucun des six axes du
// programme de langues vivantes (arrêté du 5 mai 2025, BO n° 22 du 29 mai
// 2025), qui s'applique en première à la rentrée 2026. L'axe 6, « Les aires
// anglophones américaines », est OBLIGATOIRE (cinq axes sur six en voie
// générale, dont toujours l'axe 6).
//
// CE QUE CE MODULE AJOUTE (rien n'est supprimé) :
//   - rayon 'culture' : les six axes de 1re, intitulés recopiés du BO, une fiche
//     par axe et deux pour l'axe 6 ;
//   - rayon 'langue' : six fiches B1 → B1+ tirées des « outils linguistiques »
//     de 1re et ABSENTES des 24 fiches communes (souhait et regret, équivalents
//     des modaux, structures infinitives, distributifs, chassé-croisé et
//     résultatives, prépositions après un adjectif ou un nom).
//
// ⚠️ Toujours générer avec `--modules anglais-1re-2025`, jamais `--slugs anglais`.

const AXE = {
  identites: 'Identités et échanges',
  diversite: 'Diversité et inclusion',
  art: 'Art et pouvoir',
  sciences: 'Innovations scientifiques et responsabilité',
  nature: 'L’être humain et la nature',
  ameriques: 'Les aires anglophones américaines',
}

export default {
  slug: 'anglais',
  nom: 'Anglais',

  titreMigration: 'ANGLAIS 1re — axes culturels du programme 2025 et grammaire B1 → B1+',

  motif: `CONSTAT : la 1re d'anglais montrait les mêmes 24 fiches de grammaire que la
2de et la Tle, et aucun des six axes culturels du programme 2025 (arrêté du
5 mai 2025, BO n° 22 du 29 mai 2025, en vigueur en 1re à la rentrée 2026),
dont l'axe 6 « Les aires anglophones américaines », obligatoire.
Cette migration AJOUTE derrière les 24 fiches (positions 25 → 37) : 7 fiches
culturelles (rayon 'culture', une par axe, deux pour l'axe 6) et 6 fiches de
langue propres à la première (rayon 'langue'). Rien n'est supprimé.`,

  blocs: [
    // ============================== LES AXES CULTURELS ======================
    {
      niveaux: ['1re'],
      positionDepart: 25,
      rayon: 'culture',
      chapitres: [
        // ---------------------------------------------------------- Axe 1 ---
        {
          titre: 'Migrations et identités : Canada, Windrush, frontières',
          axe: AXE.identites,
          lecon: {
            titre: 'Crossing borders, building identities',
            cours: `Un navire qui accoste en 1948, un pays qui choisit ses immigrés par points, une frontière qu’on traverse chaque jour pour travailler : les migrations fabriquent des identités autant qu’elles en déplacent.

## Ce que recouvre l’axe
Le programme pose deux questions : quels **bénéfices réciproques** les terres d’accueil anglophones et leurs nouveaux arrivants ont-ils tirés des flux migratoires ? Et comment les **identités** se construisent-elles **en dépit des frontières, ou grâce à elles** ?

## Repères culturels
| Repère | Ce qu’il montre |
| **Ellis Island** (New York, 1892-1954) | La porte d’entrée de millions d’Européens aux États-Unis |
| Le **système à points** canadien (1967) | Choisir ses immigrés selon la langue, le diplôme, le métier |
| Le **multiculturalisme** canadien (politique de 1971, loi de 1988) | Reconnaître la diversité au lieu d’exiger l’assimilation |
| L’**Empire Windrush** accoste à Tilbury le **22 juin 1948** | Des centaines de Caribéens viennent reconstruire le Royaume-Uni |
| Le **carnaval de Notting Hill** (depuis 1966) | La culture caribéenne au cœur de Londres |
| Le **scandale Windrush** (2018) | Des Britanniques arrivés enfants menacés d’expulsion faute de papiers |
| *Small Island* (Andrea Levy, 2004) | Le roman de la génération Windrush |
| La frontière **Canada – États-Unis** | La plus longue frontière terrestre entre deux pays (environ 8 900 km) |

## Vocabulaire utile
| Anglais | Français |
| to migrate / a migrant | migrer / un migrant |
| an immigrant / an emigrant | celui qui arrive / celui qui part |
| a newcomer | un nouvel arrivant |
| to settle | s’installer |
| a host country | un pays d’accueil |
| a melting pot | un creuset |
| a salad bowl / a mosaic | une mosaïque (on garde sa culture) |
| to fit in | s’intégrer |
| a border | une frontière |

## Problématiques et documents
- *Has immigration been a win-win situation for Canada?*
- *What did the Windrush generation bring to Britain?*
- *Are borders places of exchange or of separation?*
- Documents : la photo des passagers du Windrush, une affiche du gouvernement canadien, un extrait de *Small Island*.

## Pour argumenter à l’oral
- *Both sides benefited from…* — Les deux parties ont profité de…
- *It is worth noting that…* — Il faut noter que…
- *This raises the question of…* — Cela pose la question de…

> Melting pot (on se fond dans un modèle commun) ou mosaïque (chacun garde sa couleur) : c’est l’opposition classique entre les États-Unis et le Canada, à nuancer toujours.

## Exemple travaillé
*The Windrush generation helped rebuild post-war Britain, working in hospitals and on buses. Yet, seventy years later, some of them were treated as illegal immigrants. Their story shows that belonging is not only a matter of papers.*`,
          },
          questions: [
            ['Quand l’Empire Windrush accoste-t-il au Royaume-Uni ?', ['Le 22 juin 1948', 'Le 8 mai 1945', 'Le 1er janvier 1973', 'Le 23 juin 2016'], 0, 'Cette date est aujourd’hui le Windrush Day.'],
            ['D’où venaient majoritairement les passagers du Windrush ?', ['D’Inde', 'D’Irlande', 'D’Australie', 'Des Caraïbes'], 3, 'Surtout de la Jamaïque et de Trinidad.'],
            ['Qu’a révélé le scandale Windrush de 2018 ?', ['Un naufrage', 'Des Britanniques arrivés enfants menacés d’expulsion', 'Une fraude électorale', 'Une grève des dockers'], 1, 'Faute de papiers, certains ont perdu leur emploi ou ont été expulsés.'],
            ['Quel pays adopte en 1971 une politique officielle de multiculturalisme ?', ['Les États-Unis', 'Le Canada', 'Le Royaume-Uni', 'L’Australie'], 1, 'Sous Pierre Elliott Trudeau ; la loi suit en 1988.'],
            ['Quelle image oppose-t-on souvent au « melting pot » ?', ['Le mur', 'Le pont', 'La forteresse', 'La mosaïque ou le saladier'], 3, 'Dans une mosaïque, chacun garde sa culture d’origine.'],
            ['Ellis Island a accueilli des millions d’immigrants à New York entre 1892 et 1954.', ['Vrai', 'Faux'], 0, 'Aujourd’hui musée de l’immigration.'],
            ['Que signifie « to settle » ?', ['S’installer', 'Régler une dette seulement', 'Voyager', 'Repartir'], 0, 'To settle in a country : s’y installer.'],
            ['Qui a écrit Small Island (2004) ?', ['Zadie Smith', 'Chimamanda Ngozi Adichie', 'Andrea Levy', 'Toni Morrison'], 2, 'Le roman suit deux couples, jamaïcain et anglais, en 1948.'],
            ['Que désigne « a host country » ?', ['Le pays d’origine', 'Un pays en guerre', 'Un pays voisin', 'Le pays d’accueil'], 3, 'Host = hôte, celui qui accueille.'],
            ['Quel événement londonien célèbre la culture caribéenne depuis 1966 ?', ['Les Proms', 'Le carnaval de Notting Hill', 'Wimbledon', 'Le Trooping the Colour'], 1, 'L’un des plus grands carnavals de rue d’Europe.'],
            ['Quel critère le système à points canadien prend-il en compte ?', ['La religion', 'La couleur de peau', 'La langue, le diplôme et le métier', 'Le pays d’origine uniquement'], 2, 'Instauré en 1967, il remplace des critères d’origine.'],
            ['« To fit in » signifie…', ['S’intégrer, trouver sa place', 'Être en forme', 'Remplir un formulaire', 'Se battre'], 0, 'To fit in with a group : s’y intégrer.'],
          ],
        },

        // ---------------------------------------------------------- Axe 2 ---
        {
          titre: 'Minorités, justice et inclusion',
          axe: AXE.diversite,
          lecon: {
            titre: 'Equal before the law?',
            cours: `Neuf juges nommés à vie ont décidé, à Washington, qu’on pouvait séparer les Noirs des Blancs — puis qu’on ne le pouvait plus. Le droit peut exclure comme il peut inclure.

## Ce que recouvre l’axe
Le programme interroge le rôle des **institutions politiques et judiciaires** dans la **représentation** et l’affirmation des **minorités**, et la manière dont les pratiques sociales, économiques et culturelles (le logement, l’école, l’emploi) nourrissent ou combattent les **discriminations**.

## La Cour suprême des États-Unis, matrice d’inclusion et d’exclusion
Neuf juges nommés **à vie** par le président, avec l’accord du Sénat, qui interprètent la Constitution.

| Arrêt | Date | Décision |
| *Plessy v. Ferguson* | 1896 | La ségrégation est légale : « séparés mais égaux » (*separate but equal*) |
| *Brown v. Board of Education* | 1954 | La ségrégation dans les écoles publiques est inconstitutionnelle |
| *Loving v. Virginia* | 1967 | Les lois interdisant les mariages interraciaux sont annulées |
| *Obergefell v. Hodges* | 2015 | Le mariage entre personnes de même sexe devient un droit dans tout le pays |
| *Students for Fair Admissions v. Harvard* | 2023 | Fin de la prise en compte de l’origine ethnique dans les admissions universitaires |

## Logement et mixité sociale
1. Le **redlining** (années 1930) : les banques refusent les prêts dans les quartiers noirs, entourés de rouge sur les cartes.
2. Le **Fair Housing Act** (1968) interdit la discrimination dans le logement.
3. Au Royaume-Uni, les **council estates** (logements sociaux) ; l’incendie de la **tour Grenfell** (Londres, 14 juin 2017, 72 morts) a révélé la négligence envers leurs habitants.

## Représentation des peuples premiers
- En Nouvelle-Zélande, des **sièges maoris** existent au Parlement depuis 1867.
- En Australie, le **référendum sur la « Voice »** (octobre 2023), qui devait créer un organe consultatif autochtone, a été rejeté.
- Aux États-Unis, **Deb Haaland** devient en 2021 la première Amérindienne ministre (Intérieur).

## Vocabulaire utile
| Anglais | Français |
| a minority | une minorité |
| segregation | la ségrégation |
| a ruling | une décision de justice |
| to overturn | annuler, renverser |
| affirmative action | la discrimination positive |
| civil rights | les droits civiques |
| to be under-represented | être sous-représenté |
| housing | le logement |

## Pour argumenter à l’oral
- *The law can be a tool for change, but…*
- *This ruling paved the way for…* — Cet arrêt a ouvert la voie à…
- *Equality on paper does not mean equality in practice.*

> Exemple travaillé : *In 1896, the Supreme Court declared segregation legal; in 1954, the same Court declared it unconstitutional. The Constitution had not changed — the society and the judges had.*`,
          },
          questions: [
            ['Quel arrêt de 1896 a légalisé la ségrégation (« separate but equal ») ?', ['Brown v. Board of Education', 'Roe v. Wade', 'Marbury v. Madison', 'Plessy v. Ferguson'], 3, 'Il faut attendre 1954 pour qu’il soit renversé à l’école.'],
            ['Que décide l’arrêt Brown v. Board of Education (1954) ?', ['Le droit de vote des femmes', 'La ségrégation scolaire est inconstitutionnelle', 'La fin de l’esclavage', 'Le mariage pour tous'], 1, 'Un tournant du mouvement des droits civiques.'],
            ['Combien de juges siègent à la Cour suprême des États-Unis ?', ['Cinq', 'Neuf', 'Sept', 'Douze'], 1, 'Nommés à vie par le président, confirmés par le Sénat.'],
            ['En quelle année Obergefell v. Hodges ouvre-t-il le mariage aux couples de même sexe ?', ['1967', '2003', '2023', '2015'], 3, 'Le mariage devient un droit dans les cinquante États.'],
            ['Qu’était le « redlining » ?', ['Le refus de prêts bancaires dans les quartiers noirs', 'Un parti politique', 'Une ligne de métro', 'Une loi antiségrégation'], 0, 'Les quartiers étaient entourés de rouge sur les cartes des banques.'],
            ['« Affirmative action » se traduit par…', ['L’action affirmative d’un gouvernement', 'Le droit de grève', 'La discrimination positive', 'L’égalité salariale'], 2, 'Des mesures qui favorisent l’accès des minorités.'],
            ['L’arrêt de 2023 Students for Fair Admissions v. Harvard a mis fin à la prise en compte de l’origine ethnique dans les admissions universitaires.', ['Vrai', 'Faux'], 0, 'La Cour a jugé ces critères contraires à l’égalité devant la loi.'],
            ['Quel drame londonien de 2017 a révélé la négligence envers les habitants de logements sociaux ?', ['Les émeutes de Brixton', 'L’attentat de Westminster', 'La crue de la Tamise', 'L’incendie de la tour Grenfell'], 3, '72 personnes sont mortes le 14 juin 2017.'],
            ['Que signifie « to overturn a ruling » ?', ['Confirmer une décision', 'Annuler une décision', 'Publier une décision', 'Contester un juge'], 1, 'To overturn = renverser.'],
            ['Quel pays réserve des sièges parlementaires à ses populations autochtones depuis 1867 ?', ['L’Australie', 'Le Canada', 'La Nouvelle-Zélande', 'Les États-Unis'], 2, 'Les sièges maoris.'],
            ['Le référendum australien de 2023 sur la « Voice » autochtone a été approuvé.', ['Vrai', 'Faux'], 1, 'Il a été rejeté par une majorité d’électeurs.'],
            ['Quelle loi de 1968 interdit la discrimination dans le logement aux États-Unis ?', ['Le Fair Housing Act', 'Le Civil Rights Act de 1964', 'Le Voting Rights Act', 'Le Patriot Act'], 0, 'Votée quelques jours après l’assassinat de Martin Luther King.'],
          ],
        },

        // ---------------------------------------------------------- Axe 3 ---
        {
          titre: 'L’art face au pouvoir',
          axe: AXE.art,
          lecon: {
            titre: 'Portraits, protest songs and cartoons',
            cours: `Un roi se fait peindre pour paraître invincible ; un graffeur anonyme peint pour se moquer de lui. L’art sert le pouvoir — et le défie.

## Ce que recouvre l’axe
Le programme demande comment l’expression artistique, **quelle qu’en soit la forme**, peut **représenter** le pouvoir institutionnel, le **renforcer**, ou au contraire le **remettre en cause**.

## L’art au service du pouvoir
| Œuvre | Ce qu’elle affirme |
| Les portraits d’**Henri VIII** par Hans Holbein (années 1530) | Un roi massif, jambes écartées, qui occupe tout l’espace |
| L’***Armada Portrait*** d’**Élisabeth Ire** (vers 1588) | La main sur le globe : l’Angleterre maîtresse des mers |
| L’affiche ***Hope*** de Shepard Fairey (2008) | Le visage de Barack Obama devient une icône de campagne |

## L’art comme résistance ou reconnaissance
| Œuvre | Ce qu’elle dénonce |
| ***Strange Fruit***, chantée par **Billie Holiday** (1939) | Les lynchages dans le Sud des États-Unis |
| ***Migrant Mother***, photo de **Dorothea Lange** (1936) | La misère de la Grande Dépression |
| ***Mississippi Goddam*** de **Nina Simone** (1964) | La violence raciste |
| ***The Problem We All Live With***, **Norman Rockwell** (1964) | Ruby Bridges, six ans, escortée par des policiers fédéraux pour aller à l’école |
| Les pochoirs de **Banksy** (depuis les années 1990) | La guerre, la surveillance, la société de consommation |

## La presse, la caricature et la fiction
1. Le caricaturiste **James Gillray** (fin XVIIIe) se moque de George III et de Napoléon.
2. L’émission de marionnettes ***Spitting Image*** (1984) ridiculise Margaret Thatcher et la famille royale.
3. Les séries ***The West Wing*** (1999-2006), ***House of Cards*** (2013) ou ***The Crown*** (2016-2023) mettent en scène le pouvoir, entre admiration et soupçon.

## Vocabulaire utile
| Anglais | Français |
| a portrait | un portrait |
| propaganda | la propagande |
| to glorify | glorifier |
| to denounce | dénoncer |
| a protest song | une chanson engagée |
| a cartoon / a cartoonist | un dessin de presse / un dessinateur |
| to mock | se moquer de |
| censorship | la censure |
| committed | engagé |

## Pour argumenter à l’oral
- *The artist uses… to convey…*
- *This work challenges / reinforces the power of…*
- *Far from glorifying…, it exposes…* — Loin de glorifier…, elle révèle…

> Face à une œuvre, trois questions : qui l’a commandée ou produite ? pour quel public ? pour servir ou pour contester le pouvoir ?

## Exemple travaillé
*In The Problem We All Live With, Rockwell paints the marshals without heads: the viewer sees only a small girl walking to school, and the insult written on the wall behind her. The painting turns a news event into a moral question.*`,
          },
          questions: [
            ['Quelle chanteuse a interprété Strange Fruit en 1939 ?', ['Nina Simone', 'Billie Holiday', 'Aretha Franklin', 'Ella Fitzgerald'], 1, 'La chanson dénonce les lynchages dans le Sud.'],
            ['Que montre le tableau The Problem We All Live With de Norman Rockwell ?', ['Une manifestation ouvrière', 'Ruby Bridges escortée vers son école', 'Martin Luther King à Washington', 'Un soldat revenant de guerre'], 1, 'Peint en 1964, il représente la déségrégation scolaire.'],
            ['Quelle souveraine est représentée la main sur un globe dans l’Armada Portrait ?', ['Victoria', 'Marie Stuart', 'Élisabeth II', 'Élisabeth Ire'], 3, 'Le tableau célèbre la victoire contre l’Armada espagnole (1588).'],
            ['Qui a photographié Migrant Mother en 1936 ?', ['Dorothea Lange', 'Annie Leibovitz', 'Diane Arbus', 'Walker Evans'], 0, 'L’image symbolise la Grande Dépression.'],
            ['Que signifie « to mock » ?', ['Admirer', 'Glorifier', 'Imiter pour se moquer, ridiculiser', 'Censurer'], 2, 'Spitting Image mocked politicians.'],
            ['L’affiche Hope de Shepard Fairey a été créée pour la campagne de Barack Obama en 2008.', ['Vrai', 'Faux'], 0, 'Elle est devenue une icône de l’art politique.'],
            ['Quel peintre a fixé l’image imposante d’Henri VIII ?', ['Turner', 'Constable', 'Gainsborough', 'Holbein'], 3, 'Hans Holbein le Jeune, peintre de la cour.'],
            ['Quelle émission britannique de 1984 ridiculisait les puissants avec des marionnettes ?', ['Monty Python', 'Spitting Image', 'Mr Bean', 'The Office'], 1, 'Margaret Thatcher et la famille royale y étaient caricaturées.'],
            ['« A protest song » est…', ['Un hymne national', 'Une berceuse', 'Une chanson engagée', 'Une chanson d’amour'], 2, 'To protest = protester, contester.'],
            ['Quel artiste anonyme est connu pour ses pochoirs contestataires ?', ['Banksy', 'Andy Warhol', 'Keith Haring', 'David Hockney'], 0, 'Son identité reste officiellement inconnue.'],
            ['« Censorship » se traduit par…', ['Le recensement', 'La critique', 'La censure', 'Le centre'], 2, 'To censor = censurer.'],
            ['Quelle série raconte le règne d’Élisabeth II ?', ['The Crown', 'The West Wing', 'House of Cards', 'Downton Abbey'], 0, 'Diffusée de 2016 à 2023.'],
          ],
        },

        // ---------------------------------------------------------- Axe 4 ---
        {
          titre: 'Science, progrès et éthique',
          axe: AXE.sciences,
          lecon: {
            titre: 'Can we do it — and should we?',
            cours: `Une brebis clonée en Écosse, un bébé conçu en éprouvette en Angleterre, un homme sur la Lune : chaque exploit scientifique pose la même question — tout ce qui est possible est-il souhaitable ?

## Ce que recouvre l’axe
Le programme demande comment **concilier éthique et progrès scientifique**, si toutes les découvertes vont dans le sens du respect de l’être humain et de son **environnement**, et quel éclairage propre apportent les pays anglophones.

## Repères culturels
| Repère | Ce qu’il pose comme question |
| La **révolution industrielle** britannique (à partir des années 1760), la machine à vapeur améliorée par **James Watt** | Le progrès enrichit, mais abîme le travail et l’air |
| Les **luddites** (1811-1816) brisent les machines textiles | Refuser une technologie qui menace l’emploi |
| ***Frankenstein*** de **Mary Shelley** (1818) | Le savant est-il responsable de sa créature ? |
| **Alan Turing** (1912-1954) | Les débuts de l’informatique et de l’intelligence artificielle |
| **Apollo 11**, 20 juillet 1969 | Premier homme sur la Lune |
| Le **traité de l’espace** (1967) | L’espace n’appartient à aucun État |
| **Louise Brown**, née en 1978 à Oldham | Premier bébé conçu par fécondation in vitro |
| **Dolly** la brebis, clonée en 1996 au Roslin Institute (Écosse) | Le premier mammifère cloné à partir d’une cellule adulte |
| L’**Écosse** : pétrole de la mer du Nord (années 1970), puis éolien en mer | Passer des énergies d’hier à celles de demain |

## La quête de l’homme parfait
Modifier les gènes, augmenter le corps, prolonger la vie : c’est le rêve **transhumaniste**. Le roman ***Brave New World*** d’Aldous Huxley (1932) imagine déjà des humains fabriqués et triés dès la naissance.

## Vocabulaire utile
| Anglais | Français |
| a breakthrough | une percée, une avancée décisive |
| a discovery / to discover | une découverte / découvrir |
| cloning | le clonage |
| genetic engineering | le génie génétique |
| renewable energy | l’énergie renouvelable |
| a wind farm | un parc éolien |
| ethics / ethical | l’éthique / éthique |
| to tamper with nature | trafiquer la nature |
| groundbreaking | révolutionnaire |

## Pour argumenter à l’oral
- *Science is neither good nor bad in itself: it depends on…*
- *There are limits that should not be crossed.*
- *The benefits outweigh the risks.* — Les bénéfices l’emportent sur les risques.

> Une argumentation solide sur ce thème distingue toujours la **découverte** (neutre) de son **usage** (qui se juge).

## Exemple travaillé
*When Dolly the sheep was cloned in 1996, many people feared that human cloning would follow. Most countries then banned it: society decided that some things are possible but not acceptable.*`,
          },
          questions: [
            ['Où la brebis Dolly a-t-elle été clonée en 1996 ?', ['À Cambridge', 'Au Roslin Institute, en Écosse', 'À Harvard', 'À Oxford'], 1, 'Premier mammifère cloné à partir d’une cellule adulte.'],
            ['Quand Apollo 11 se pose-t-il sur la Lune ?', ['Le 12 avril 1961', 'Le 4 octobre 1957', 'Le 28 janvier 1986', 'Le 20 juillet 1969'], 3, 'Neil Armstrong est le premier à marcher sur la Lune.'],
            ['Qui étaient les luddites ?', ['Des ouvriers qui brisaient les machines', 'Des inventeurs', 'Des astronautes', 'Des banquiers'], 0, 'Entre 1811 et 1816, ils refusent les machines textiles.'],
            ['Que dit le traité de l’espace de 1967 ?', ['L’espace appartient aux États-Unis', 'La Lune appartient à l’ONU', 'L’espace n’appartient à aucun État', 'Les satellites sont interdits'], 2, 'Aucun État ne peut s’approprier un corps céleste.'],
            ['Quel roman de 1818 pose la question de la responsabilité du savant ?', ['Dracula', 'Brave New World', '1984', 'Frankenstein'], 3, 'Écrit par Mary Shelley.'],
            ['Louise Brown, née en 1978, est le premier bébé conçu par fécondation in vitro.', ['Vrai', 'Faux'], 0, 'Née à Oldham, en Angleterre.'],
            ['Que signifie « a breakthrough » ?', ['Une panne', 'Une percée, une avancée décisive', 'Une rupture amoureuse', 'Un échec'], 1, 'To break through = percer.'],
            ['Quel mathématicien britannique est un pionnier de l’informatique ?', ['Isaac Newton', 'Charles Darwin', 'Alan Turing', 'Stephen Hawking'], 2, 'Il a aussi contribué à déchiffrer Enigma.'],
            ['Quel roman d’Aldous Huxley (1932) imagine des humains fabriqués et triés ?', ['Brave New World', 'The Time Machine', 'Fahrenheit 451', 'Never Let Me Go'], 0, 'Une dystopie de l’homme « parfait ».'],
            ['« A wind farm » est…', ['Une ferme venteuse', 'Une centrale nucléaire', 'Un parc éolien', 'Un moulin à farine'], 2, 'Wind = vent ; farm = ici, installation.'],
            ['Quelle expression signifie « les bénéfices l’emportent sur les risques » ?', ['The benefits outweigh the risks.', 'The risks are bigger.', 'There are no risks.', 'The risks outweigh the benefits.'], 0, 'To outweigh = peser plus lourd que.'],
            ['Quelle ressource a fait la richesse de l’Écosse à partir des années 1970 ?', ['Le charbon', 'L’or', 'Le cuivre', 'Le pétrole de la mer du Nord'], 3, 'L’Écosse mise désormais sur l’éolien.'],
          ],
        },

        // ---------------------------------------------------------- Axe 5 ---
        {
          titre: 'Nature sauvage et nature protégée',
          axe: AXE.nature,
          lecon: {
            titre: 'Wilderness, parks and storms',
            cours: `Les Américains ont inventé l’idée de parc national ; ils ont aussi inventé le Dust Bowl. La relation à la nature, dans le monde anglophone, oscille entre émerveillement et exploitation.

## Ce que recouvre l’axe
Le programme demande comment l’être humain peut **vivre en harmonie avec la nature**, ce qu’il met en place pour la **préserver**, l’**exploiter** et s’y **adapter**, et comment les sociétés anglophones s’emparent de ces enjeux.

## Préserver : les parcs nationaux
| Repère | Ce qu’il montre |
| **Yellowstone** (1872) | Le premier parc national du monde |
| **John Muir** fonde le **Sierra Club** (1892) | Protéger la *wilderness* pour elle-même |
| **Theodore Roosevelt** (président 1901-1909) | Il multiplie les espaces protégés |
| Les premiers parcs nationaux britanniques (1951 : **Peak District**, puis **Lake District**) | Protéger des paysages habités et cultivés |

## Admirer : la nature sacralisée
1. Les poètes **romantiques** anglais : **William Wordsworth** et ses jonquilles (*I Wandered Lonely as a Cloud*, 1807), dans le Lake District.
2. **Henry David Thoreau**, ***Walden*** (1854) : deux ans dans une cabane au bord d’un lac.
3. Les photos d’**Ansel Adams** (Yosemite) : la nature grandiose, sans humains.

## Subir et s’adapter
| Événement | Ce qu’il révèle |
| Le **Dust Bowl** (années 1930), raconté dans ***The Grapes of Wrath*** de **John Steinbeck** (1939) | Des sols épuisés par l’agriculture intensive s’envolent |
| ***Silent Spring*** de **Rachel Carson** (1962) | Les pesticides tuent les oiseaux : naissance de l’écologie moderne |
| L’ouragan **Katrina** (La Nouvelle-Orléans, août 2005) | Une catastrophe naturelle aggravée par les inégalités |
| Le **Black Summer** australien (2019-2020) | Des incendies géants liés à la sécheresse |

## Vocabulaire utile
| Anglais | Français |
| wilderness | la nature sauvage |
| to preserve / to protect | préserver / protéger |
| wildlife | la faune sauvage |
| endangered species | les espèces menacées |
| a drought | une sécheresse |
| a wildfire | un feu de forêt |
| a flood | une inondation |
| to deplete resources | épuiser les ressources |

## Pour argumenter à l’oral
- *Man is part of nature, not its master.*
- *Protecting nature sometimes means keeping people out.*
- *Natural disasters are not only natural: they hit the poorest hardest.*

> Préserver (garder intact) n’est pas conserver (utiliser sans épuiser) : Muir voulait préserver, d’autres voulaient gérer les forêts pour l’exploitation. Cette nuance structure encore le débat.

## Exemple travaillé
*When Hurricane Katrina struck New Orleans in 2005, the poorest neighbourhoods were the worst hit. The storm was natural; the disaster was also social.*`,
          },
          questions: [
            ['Quel est le premier parc national du monde, créé en 1872 ?', ['Yosemite', 'Grand Canyon', 'Lake District', 'Yellowstone'], 3, 'Aux États-Unis, entre le Wyoming, le Montana et l’Idaho.'],
            ['Qui fonde le Sierra Club en 1892 ?', ['John Muir', 'Theodore Roosevelt', 'Henry David Thoreau', 'Ansel Adams'], 0, 'Grand défenseur de la wilderness.'],
            ['Quel roman de Steinbeck raconte l’exode des victimes du Dust Bowl ?', ['Of Mice and Men', 'East of Eden', 'The Grapes of Wrath', 'Cannery Row'], 2, 'Publié en 1939.'],
            ['Quel livre de Rachel Carson (1962) dénonce les pesticides ?', ['Walden', 'Nature', 'The Sea Around Us', 'Silent Spring'], 3, 'Le « printemps silencieux » est celui où les oiseaux ne chantent plus.'],
            ['Que signifie « a drought » ?', ['Une inondation', 'Une sécheresse', 'Une tempête', 'Un incendie'], 1, 'À ne pas confondre avec draught (courant d’air).'],
            ['Walden, de Thoreau, raconte deux années passées dans une cabane au bord d’un lac.', ['Vrai', 'Faux'], 0, 'Publié en 1854.'],
            ['Quelle ville l’ouragan Katrina a-t-il dévastée en 2005 ?', ['Miami', 'Houston', 'La Nouvelle-Orléans', 'New York'], 2, 'Les quartiers pauvres ont été les plus touchés.'],
            ['Quel poète romantique a écrit sur les jonquilles du Lake District ?', ['William Wordsworth', 'Lord Byron', 'John Keats', 'William Blake'], 0, 'I Wandered Lonely as a Cloud (1807).'],
            ['« Endangered species » désigne…', ['Des espèces dangereuses', 'Des espèces disparues', 'Des espèces menacées', 'Des espèces domestiques'], 2, 'Endangered = mis en danger.'],
            ['Quel nom a-t-on donné aux incendies géants de l’été 2019-2020 en Australie ?', ['Black Summer', 'Red Winter', 'Dust Bowl', 'Dry Season'], 0, 'Des millions d’hectares brûlés.'],
            ['En quelle année le Royaume-Uni crée-t-il ses premiers parcs nationaux ?', ['1872', '1914', '1990', '1951'], 3, 'Le Peak District, puis le Lake District.'],
            ['Que signifie « wildlife » ?', ['Une vie agitée', 'La vie sauvage, la faune', 'La jungle', 'La chasse'], 1, 'Wild = sauvage.'],
          ],
        },

        // ---------------------------------------------------------- Axe 6 ---
        {
          titre: 'Les Amériques anglophones : influences croisées',
          axe: AXE.ameriques,
          lecon: {
            titre: 'Across the Americas',
            cours: `Des Grands Lacs aux Antilles, l’anglais se parle sur tout un continent, mais pas de la même façon : entre les États-Unis et leurs voisins, les influences circulent, souvent à sens inégal.

## Ce que recouvre l’axe (obligatoire)
Le programme demande quelles **influences réciproques** créent une **perméabilité culturelle**, parfois **inégale**, autour du continent américain. C’est l’axe que ta classe étudie forcément cette année.

## Les aires anglophones du continent
| Espace | Repères |
| Les **États-Unis** | Première puissance mondiale ; leur cinéma, leur musique, leurs réseaux sociaux se diffusent partout |
| Le **Canada** | Deux langues officielles (anglais et français) ; indépendance acquise pas à pas (1867, 1931, 1982) ; roi Charles III chef d’État |
| Les **Caraïbes anglophones** | Jamaïque et Trinité-et-Tobago indépendantes en 1962 ; Barbade devenue république le 30 novembre 2021 |
| Le **Belize** et le **Guyana** | Anciennes colonies britanniques sur le continent |

## Un pôle d’attraction nord-américain
1. La **doctrine Monroe** (1823) : les Européens ne doivent plus intervenir en Amérique — le continent devient la zone d’influence des États-Unis.
2. Le commerce : l’**ALENA** (1994) puis l’**ACEUM** (*USMCA*, 2020) lient États-Unis, Canada et Mexique.
3. La **fuite des cerveaux** (*brain drain*) : chercheurs et artistes canadiens ou caribéens partent vers les États-Unis.

## Des influences qui remontent aussi vers le nord
| De → vers | Exemple |
| Jamaïque → monde | Le **reggae** de **Bob Marley** |
| Barbade → États-Unis | **Rihanna**, star mondiale |
| Canada → États-Unis | Des humoristes et des chanteurs (Drake, Justin Bieber) |
| Caraïbes → Royaume-Uni | La génération Windrush et le carnaval |

## Vocabulaire utile
| Anglais | Français |
| soft power | l’influence culturelle |
| a neighbour | un voisin |
| to spread | se répandre |
| cross-border | transfrontalier |
| a trade agreement | un accord commercial |
| brain drain | la fuite des cerveaux |
| a dominant culture | une culture dominante |
| to resist | résister |

## Pour argumenter à l’oral
- *The influence goes both ways, but…*
- *Canada defines itself partly against the United States.*
- *American culture is everywhere, yet local cultures resist.*

> La perméabilité est « parfois inégale » : les États-Unis exportent bien plus qu’ils n’importent — mais le reggae, le hip-hop né de DJ d’origine jamaïcaine dans le Bronx ou les séries canadiennes montrent que la circulation n’est jamais à sens unique.

## Exemple travaillé
*Hip-hop was born in the Bronx in the 1970s, partly thanks to DJ Kool Herc, who had grown up in Jamaica. An American music with Caribbean roots then conquered the world: a perfect example of cross-influence.*`,
          },
          questions: [
            ['Quelles sont les deux langues officielles du Canada ?', ['L’anglais et le français', 'L’anglais et l’espagnol', 'L’anglais et l’inuktitut', 'Le français et l’espagnol'], 0, 'Le bilinguisme est inscrit dans la loi depuis 1969.'],
            ['Quand la Barbade devient-elle une république ?', ['Le 6 août 1962', 'Le 1er juillet 1867', 'Le 30 novembre 2021', 'Le 4 juillet 1776'], 2, 'Elle reste membre du Commonwealth.'],
            ['Que proclame la doctrine Monroe de 1823 ?', ['L’abolition de l’esclavage', 'L’indépendance du Canada', 'L’achat de l’Alaska', 'Les Européens ne doivent plus intervenir en Amérique'], 3, 'Le continent devient la zone d’influence des États-Unis.'],
            ['Quel accord commercial a remplacé l’ALENA en 2020 ?', ['Le CETA', 'L’USMCA (ACEUM)', 'Le Mercosur', 'L’OMC'], 1, 'Il lie les États-Unis, le Canada et le Mexique.'],
            ['Quelle chanteuse mondialement connue vient de la Barbade ?', ['Beyoncé', 'Nicki Minaj', 'Rihanna', 'Alicia Keys'], 2, 'Elle a été déclarée héroïne nationale en 2021.'],
            ['La Jamaïque est devenue indépendante en 1962.', ['Vrai', 'Faux'], 0, 'Le 6 août 1962, comme Trinité-et-Tobago quelques semaines plus tard.'],
            ['Que signifie « brain drain » ?', ['La fuite des cerveaux', 'Un lavage de cerveau', 'Un mal de tête', 'Un concours de culture'], 0, 'Les talents partent là où ils sont mieux payés.'],
            ['Où le hip-hop est-il né dans les années 1970 ?', ['À Kingston', 'À Toronto', 'Dans le Bronx, à New York', 'À Londres'], 2, 'DJ Kool Herc, arrivé de Jamaïque, y joue un rôle fondateur.'],
            ['Qui est le chef de l’État canadien ?', ['Le roi Charles III', 'Le Premier ministre', 'Le président des États-Unis', 'Le gouverneur du Québec'], 0, 'Le Canada est un royaume du Commonwealth.'],
            ['« Soft power » désigne…', ['La puissance militaire', 'Un pouvoir faible', 'La diplomatie secrète', 'L’influence culturelle et l’attrait d’un pays'], 3, 'Concept forgé par Joseph Nye.'],
            ['Quel musicien jamaïcain a diffusé le reggae dans le monde entier ?', ['Jimi Hendrix', 'Bob Marley', 'Harry Belafonte', 'Sean Paul'], 1, 'Avec les Wailers, dans les années 1970.'],
            ['Quelle expression signifie « l’influence va dans les deux sens » ?', ['The influence is one-way.', 'The influence goes both ways.', 'There is no influence.', 'The influence stops here.'], 1, 'Both ways = dans les deux sens.'],
          ],
        },
        {
          titre: 'Caraïbes, Porto Rico, Vancouver et Seattle',
          axe: AXE.ameriques,
          lecon: {
            titre: 'Islands, territories and twin cities',
            cours: `Une île dont les habitants sont citoyens américains mais ne votent pas pour le président ; deux villes de part et d’autre d’une frontière qui se ressemblent comme des sœurs. Deux cas pour penser les liens du continent.

## Porto Rico : le 51e État ?
| Date | Étape |
| 1898 | Cédé par l’Espagne aux États-Unis après la guerre hispano-américaine |
| 1917 | Le **Jones Act** fait des Portoricains des **citoyens américains** |
| 1952 | Statut d’**État libre associé** (*Commonwealth*) |
| 2017 | L’ouragan **Maria** dévaste l’île ; les secours tardent |
| 2012-2024 | Plusieurs **référendums** non contraignants sur le statut |

Ce qu’il faut retenir : les Portoricains sont citoyens américains, mais l’île n’est **pas un État**. Ils **ne votent pas** à l’élection présidentielle depuis l’île et n’ont au Congrès qu’un **commissaire résident** sans droit de vote en séance plénière. L’espagnol y domine, l’anglais y est aussi officiel. **Lin-Manuel Miranda** (*Hamilton*) et **Bad Bunny** portent cette culture sur la scène mondiale.

## Les Caraïbes dans les Amériques et le monde
1. La **CARICOM** (1973) rassemble les pays des Caraïbes pour peser ensemble.
2. Des **prix Nobel de littérature** : **Derek Walcott** (Sainte-Lucie, 1992) et **V. S. Naipaul** (né à Trinité, 2001).
3. Le **carnaval de Trinité** et la musique (calypso, soca, reggae) s’exportent à Londres, New York et Toronto.
4. Le sport : **Usain Bolt** (Jamaïque), le cricket des **West Indies**.

## Vancouver et Seattle : regards croisés
Deux grandes villes du **Pacific Northwest**, à quelques heures de route de part et d’autre de la frontière.

| | Vancouver (Canada) | Seattle (États-Unis) |
| Économie | Port, cinéma (« Hollywood North »), technologies | Boeing, Microsoft (à Redmond), Amazon (siège à Seattle, né en 1994), Starbucks (1971) |
| Grands événements | Jeux olympiques d’hiver de 2010 | Exposition universelle de 1962 (Space Needle) |
| Défis communs | Prix du logement, sans-abrisme | Prix du logement, sans-abrisme |

Les deux villes ont accueilli des matchs de la **Coupe du monde de football 2026**, organisée par le Canada, les États-Unis et le Mexique.

## Vocabulaire utile
| Anglais | Français |
| a territory | un territoire |
| statehood | le statut d’État |
| citizenship | la citoyenneté |
| to be entitled to | avoir droit à |
| a hurricane | un ouragan |
| relief | les secours |
| twin cities | des villes jumelles |
| housing crisis | la crise du logement |

## Pour argumenter à l’oral
- *Puerto Ricans are American citizens, yet…*
- *Although they are on different sides of the border, the two cities share…*
- *The debate over statehood reveals…*

> Porto Rico montre qu’on peut appartenir à un pays sans en être tout à fait membre : une citoyenneté sans tous les droits.

## Exemple travaillé
*Puerto Ricans have been US citizens since 1917, but they cannot vote for the president unless they move to one of the fifty states. After Hurricane Maria in 2017, many felt treated like second-class citizens.*`,
          },
          questions: [
            ['Depuis quelle année les Portoricains sont-ils citoyens américains ?', ['1898', '1952', '1917', '2017'], 2, 'Grâce au Jones Act.'],
            ['Quel pays a cédé Porto Rico aux États-Unis en 1898 ?', ['Le Royaume-Uni', 'La France', 'Le Mexique', 'L’Espagne'], 3, 'À l’issue de la guerre hispano-américaine.'],
            ['Les Portoricains résidant sur l’île votent à l’élection présidentielle américaine.', ['Vrai', 'Faux'], 1, 'Porto Rico n’est pas un État : ils ne votent qu’en s’installant dans l’un des cinquante États.'],
            ['Quel ouragan a dévasté Porto Rico en 2017 ?', ['Katrina', 'Maria', 'Sandy', 'Andrew'], 1, 'Les secours ont tardé, ce qui a nourri la colère des habitants.'],
            ['Que signifie « statehood » ?', ['L’état d’esprit', 'L’État-providence', 'Le statut d’État', 'La nationalité'], 2, 'Le débat sur le 51e État.'],
            ['Quel écrivain de Sainte-Lucie a reçu le prix Nobel de littérature en 1992 ?', ['Derek Walcott', 'V. S. Naipaul', 'Bob Marley', 'Jamaica Kincaid'], 0, 'Auteur du long poème Omeros.'],
            ['Quelle entreprise née en 1994 a son siège à Seattle ?', ['Apple', 'Google', 'Amazon', 'Netflix'], 2, 'Fondée par Jeff Bezos, d’abord comme librairie en ligne.'],
            ['Quelle ville a accueilli les Jeux olympiques d’hiver de 2010 ?', ['Vancouver', 'Seattle', 'Calgary', 'Salt Lake City'], 0, 'Vancouver, en Colombie-Britannique.'],
            ['Que regroupe la CARICOM, créée en 1973 ?', ['Les États du Pacifique', 'Les pays d’Amérique du Sud', 'Les provinces canadiennes', 'Les pays des Caraïbes'], 3, 'Une communauté pour peser ensemble.'],
            ['Quel artiste d’origine portoricaine a créé la comédie musicale Hamilton ?', ['Bad Bunny', 'Lin-Manuel Miranda', 'Ricky Martin', 'Marc Anthony'], 1, 'Créée à Broadway en 2015.'],
            ['Quelle expression convient pour comparer deux villes malgré la frontière ?', ['Because they are identical…', 'Although they are on different sides of the border, the two cities share…', 'The two cities never meet…', 'Unless the border…'], 1, 'Although introduit la concession.'],
            ['« To be entitled to » signifie…', ['Avoir un titre de noblesse', 'Être intitulé', 'Être obligé de', 'Avoir droit à'], 3, 'Entitled to vote : avoir le droit de voter.'],
          ],
        },
      ],
    },

    // ================================ LA LANGUE =============================
    {
      niveaux: ['1re'],
      positionDepart: 32,
      rayon: 'langue',
      chapitres: [
        {
          titre: 'Wish, if only, it’s time : le souhait et le regret',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Si seulement… — le prétérit qui rêve',
            cours: `« Si seulement j’avais su » : en anglais, pour dire ce qui n’est pas et qu’on voudrait, on recule le temps d’un cran. Le passé devient la langue du rêve et du regret.

## Le principe : le prétérit « modal »
Après **wish**, **if only**, **it’s (high) time** et **I’d rather**, le prétérit ne parle pas du passé : il parle de l’**irréel**. C’est le même mécanisme que dans *If I were rich…*

## Wish et if only : trois cas
| Ce qu’on regrette | Structure | Exemple | Sens |
| Le **présent** | *wish* + **prétérit** | *I wish I **knew** the answer.* | J’aimerais savoir (mais je ne sais pas). |
| Le **passé** | *wish* + **past perfect** | *I wish I **had studied** harder.* | Je regrette de ne pas avoir travaillé davantage. |
| Le comportement de **quelqu’un d’autre** | *wish* + sujet + **would** | *I wish you **would stop** shouting.* | Si seulement tu arrêtais de crier (agacement). |

**If only** fonctionne de la même façon, avec plus d’émotion : *If only I had listened to her!*

> Avec *be*, l’anglais soutenu emploie **were** à toutes les personnes : *I wish I were taller.* (*was* s’entend à l’oral.)

## Wish n’est pas hope
| hope | wish |
| Ce qui est **possible** | Ce qui est **irréel** ou trop tard |
| *I hope you **pass** your exam.* | *I wish I **had passed** my exam.* |

## It’s time et I’d rather
1. **It’s (high) time + sujet + prétérit** : il est (grand) temps que… — *It’s high time we **left**.*
2. **It’s time + to + base verbale** quand il n’y a pas de sujet différent : *It’s time to go.*
3. **I’d rather + sujet + prétérit** : je préférerais que (quelqu’un d’autre)… — *I’d rather you **didn’t tell** anyone.*
4. **I’d rather + base verbale** pour soi-même : *I’d rather stay at home.*

## Le regret avec should have
*I should have listened.* — J’aurais dû écouter. C’est le même regret que *I wish I had listened*, vu comme un reproche fait à soi-même.

## Exemple travaillé
« Je regrette de ne pas parler espagnol, et j’aurais aimé partir avec eux l’été dernier. Il est temps que je m’inscrive à un cours. »
→ *I wish I **spoke** Spanish, and I wish I **had gone** with them last summer. It’s high time I **signed up** for a course.*
Trois verbes au passé, et aucun ne raconte le passé au sens strict : le premier dit un regret présent, le deuxième un regret passé, le troisième une urgence.`,
          },
          questions: [
            ['Comment dire « J’aimerais connaître la réponse (mais je ne la connais pas) » ?', ['I wish I know the answer.', 'I hope I knew the answer.', 'I wish I will know the answer.', 'I wish I knew the answer.'], 3, 'Regret sur le présent : wish + prétérit.'],
            ['Comment exprimer un regret sur le PASSÉ ?', ['wish + prétérit', 'wish + past perfect', 'wish + would', 'hope + présent'], 1, 'I wish I had studied harder.'],
            ['« I wish you would stop shouting » exprime…', ['Un souhait poli pour l’avenir', 'Un regret sur le passé', 'L’agacement face au comportement de quelqu’un', 'Une certitude'], 2, 'Wish + would vise le comportement d’autrui.'],
            ['Complète : « I ___ you pass your exam tomorrow. »', ['hope', 'wish', 'regret', 'would'], 0, 'Un souhait réalisable s’exprime avec hope.', 'Quel verbe exprime un souhait réalisable ?'],
            ['Complète : « It’s high time we ___. »', ['leave', 'will leave', 'left', 'are leaving'], 2, 'It’s high time + sujet + prétérit.', 'Quel temps suit « It’s high time we » ?'],
            ['« I’d rather you didn’t tell anyone » signifie…', ['Je préférerais que tu n’en parles à personne', 'Je n’ai rien dit à personne', 'Tu n’as rien dit', 'Je préfère parler à tout le monde'], 0, 'I’d rather + autre sujet + prétérit.'],
            ['Dans un anglais soutenu, on écrit « I wish I were taller ».', ['Vrai', 'Faux'], 0, 'Were à toutes les personnes après wish ; was s’entend à l’oral.'],
            ['Comment traduire « Si seulement je l’avais écoutée ! » ?', ['If only I listened to her!', 'If only I would listen to her!', 'If only I have listened to her!', 'If only I had listened to her!'], 3, 'Regret passé : if only + past perfect.'],
            ['Laquelle est correcte pour parler de soi ?', ['I’d rather to stay at home.', 'I’d rather stay at home.', 'I’d rather staying at home.', 'I’d rather I stay at home.'], 1, 'Même sujet : I’d rather + base verbale.'],
            ['« I should have listened » se traduit par…', ['Je devrais écouter', 'J’aurais dû écouter', 'Je dois écouter', 'J’écouterai'], 1, 'Should have + participe passé : le reproche sur le passé.'],
            ['Complète : « I wish I ___ Spanish. » (je ne le parle pas)', ['speak', 'will speak', 'have spoken', 'spoke'], 3, 'Regret présent : prétérit.', 'Quel temps exprime un regret sur le présent ?'],
            ['« It’s time to go » est correct car…', ['Il n’y a pas de sujet différent', 'Le prétérit est interdit après time', 'Go est irrégulier', 'Time est un verbe'], 0, 'Sans sujet exprimé, on emploie to + base verbale.'],
          ],
        },
        {
          titre: 'Be able to, have to, be allowed to : les équivalents des modaux',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Quand le modal ne suffit plus',
            cours: `*Can* n’a pas de futur, *must* n’a pas de passé : les modaux sont des verbes incomplets. Pour les conjuguer à tous les temps, l’anglais leur a donné des remplaçants.

## Pourquoi des équivalents ?
Un modal n’a **ni infinitif, ni participe, ni futur**, et deux modaux ne se suivent jamais. *Il pourra* ne peut donc pas se dire *will can*.

| Modal | Équivalent | Sens |
| *can* | **be able to** | capacité |
| *can* / *may* | **be allowed to** | permission |
| *must* | **have to** | obligation |
| *should* / *ought to* | — | conseil, devoir moral |

## Be able to : la capacité à tous les temps
- Futur : *She **will be able to** drive next year.*
- Present perfect : *I **haven’t been able to** sleep.*
- Après un autre modal : *You **might be able to** help.*

## Could ou was able to ?
C’est le point le plus subtil de la fiche.

| could | was / were able to, managed to |
| Une capacité **générale** dans le passé | Une **réussite ponctuelle**, une fois |
| *At ten, she **could** swim.* | *The sea was rough, but she **was able to** swim to the shore.* |

> Pour une réussite précise, on n’emploie pas *could* à l’affirmatif : *He **managed to** escape* (il a réussi à s’échapper). À la négation, *couldn’t* va partout : *He couldn’t escape.*

## Have to et must
1. **must** : l’obligation vient de **celui qui parle** (*I must call my mum*).
2. **have to** : l’obligation vient de **l’extérieur**, d’une règle (*I have to wear a uniform at school*).
3. **have to** se conjugue : *I **had to** leave early. You **will have to** wait.*

## Le piège de la négation
| don’t have to | mustn’t |
| **absence** d’obligation | **interdiction** |
| *You don’t have to come.* (ce n’est pas la peine) | *You mustn’t come.* (tu ne dois pas venir) |

## Be allowed to et ought to
- *We **weren’t allowed to** use our phones.* — On n’avait pas le droit.
- *You **ought to** apologise.* — Tu devrais t’excuser (conseil moral, proche de *should*).
- *Shall I open the window?* — **Shall** propose ou demande un avis, à la première personne.

## Exemple travaillé
« Quand il était petit, il savait nager, mais ce jour-là il n’a pas pu atteindre le bateau ; heureusement, il a réussi à s’accrocher à une bouée. Il devra prendre des cours. »
→ *As a child, he **could** swim, but that day he **couldn’t** reach the boat; luckily, he **managed to** hold on to a buoy. He **will have to** take lessons.*`,
          },
          questions: [
            ['Comment dire « Elle pourra conduire l’an prochain » ?', ['She will can drive next year.', 'She will be able to drive next year.', 'She can will drive next year.', 'She could drive next year.'], 1, 'Deux modaux ne se suivent jamais : will be able to.'],
            ['Pour une réussite PONCTUELLE dans le passé, on emploie de préférence…', ['could', 'can', 'was able to / managed to', 'must'], 2, 'Could exprime une capacité générale.'],
            ['« You don’t have to come » signifie…', ['Ce n’est pas la peine de venir', 'Tu ne dois pas venir', 'Tu ne peux pas venir', 'Tu ne veux pas venir'], 0, 'Absence d’obligation.'],
            ['« You mustn’t come » exprime…', ['Une absence d’obligation', 'Un conseil', 'Une interdiction', 'Une capacité'], 2, 'Mustn’t = il est interdit de.'],
            ['Quel est le passé de « I must leave early » ?', ['I had to leave early.', 'I musted leave early.', 'I must have leave early.', 'I did must leave early.'], 0, 'Must n’a pas de passé : on emploie had to.'],
            ['« At ten, she could swim » est correct.', ['Vrai', 'Faux'], 0, 'Capacité générale dans le passé : could.'],
            ['Complète : « We weren’t ___ to use our phones in class. »', ['able', 'must', 'can', 'allowed'], 3, 'Be allowed to = avoir la permission.', 'Quel mot exprime la permission ?'],
            ['« I have to wear a uniform » : d’où vient l’obligation ?', ['De celui qui parle', 'D’une règle extérieure', 'D’un conseil', 'D’un souhait'], 1, 'Have to : obligation imposée de l’extérieur.'],
            ['Comment traduire « Il a réussi à s’échapper » ?', ['He could escape.', 'He managed to escape.', 'He can escape.', 'He must escape.'], 1, 'Réussite ponctuelle : managed to.'],
            ['Quel sens a « You ought to apologise » ?', ['Tu es obligé par la loi de t’excuser', 'Tu t’es excusé', 'Tu peux t’excuser', 'Tu devrais t’excuser'], 3, 'Ought to : conseil ou devoir moral, comme should.'],
            ['Comment dire « Je n’ai pas pu dormir » (depuis un moment) ?', ['I haven’t been able to sleep.', 'I haven’t could sleep.', 'I didn’t can sleep.', 'I haven’t can slept.'], 0, 'Be able to se met au present perfect.'],
            ['« Shall I open the window? » sert à…', ['Donner un ordre', 'Exprimer le futur lointain', 'Proposer quelque chose', 'Interdire'], 2, 'Shall à la première personne propose ou demande un avis.'],
          ],
        },
        {
          titre: 'Want someone to do : les structures infinitives',
          axe: 'La phrase',
          lecon: {
            titre: 'Je veux que tu viennes — sans « that »',
            cours: `« Je veux que tu viennes » : le francophone cherche un *that* et un subjonctif. L’anglais n’en veut pas. Il dit : *I want you to come*.

## La structure
**Verbe + complément + to + base verbale**

| Français | Anglais |
| Je veux que tu viennes. | *I want **you to come**.* |
| Ils attendent de nous que nous gagnions. | *They expect **us to win**.* |
| J’aimerais qu’elle reste. | *I’d like **her to stay**.* |
| Il m’a demandé de l’aider. | *He asked **me to help** him.* |

> Jamais *I want that you come*. Et le pronom est **complément** : *I want **him** to leave*, pas *I want he leaves*.

## Les verbes qui l’acceptent
| Famille | Verbes |
| Volonté | *want, would like, would prefer, wish* |
| Attente | *expect* |
| Demande, ordre | *ask, tell, order, beg* |
| Conseil, encouragement | *advise, encourage, persuade, urge* |
| Permission, aide | *allow, help* |

*She told me **to wait**.* (Elle m’a dit d’attendre.) — *They encouraged him **to apply**.*

## La négation : not devant to
*I asked him **not to** tell anyone.* — Je lui ai demandé de ne rien dire.
La négation porte sur l’action demandée, pas sur la demande.

## Les verbes qui se construisent autrement
1. **make** et **let** : **sans to** — *She made me **laugh**. They let us **go**.*
2. **suggest** : jamais de complément + to — *I suggested **that we go** / I suggested **going***. On ne dit pas *I suggested him to go*.
3. **help** : *to* facultatif — *He helped me (to) carry the box.*

## Pour + nom + infinitif : for… to
Après un adjectif ou un nom, quand l’action a un sujet propre : *It’s important **for young people to vote**.* — Il est important que les jeunes votent.

## Exemple travaillé
« Mes parents aimeraient que je devienne médecin, mais mon professeur m’encourage à faire des études d’art ; il est essentiel que chacun choisisse sa voie. »
→ *My parents **would like me to become** a doctor, but my teacher **encourages me to study** art; it is essential **for everyone to choose** their own path.*`,
          },
          questions: [
            ['Comment traduire « Je veux que tu viennes » ?', ['I want that you come.', 'I want you come.', 'I want you to come.', 'I want that you to come.'], 2, 'Verbe + complément + to + base verbale.'],
            ['Laquelle est correcte ?', ['I want him to leave.', 'I want he leaves.', 'I want that he leaves.', 'I want him leave.'], 0, 'Le pronom est complément : him.'],
            ['Comment dire « Il m’a demandé de ne rien dire » ?', ['He didn’t ask me to say anything.', 'He asked me to not saying anything.', 'He asked me not to say anything.', 'He asked that I not say nothing.'], 2, 'Not se place devant to.'],
            ['Quel verbe se construit SANS « to » ?', ['make', 'want', 'expect', 'ask'], 0, 'She made me laugh.'],
            ['« I suggested him to go » est correct.', ['Vrai', 'Faux'], 1, 'On dit I suggested that he go / should go, ou I suggested going.'],
            ['Complète : « They expect us ___ the match. »', ['win', 'winning', 'that we win', 'to win'], 3, 'Expect + complément + to.', 'Quelle forme suit « expect us » ?'],
            ['Comment traduire « Elle m’a dit d’attendre » ?', ['She said me to wait.', 'She told me to wait.', 'She told me waiting.', 'She told that I wait.'], 1, 'Tell + complément + to ; say ne prend pas de complément de personne direct.'],
            ['« It’s important for young people to vote » signifie…', ['Les jeunes ont voté', 'Il est important que les jeunes votent', 'Voter est important pour les vieux', 'Les jeunes veulent voter'], 1, 'For + nom + to : l’action a son propre sujet.'],
            ['Complète : « They let us ___ early. »', ['to leave', 'leaving', 'left', 'leave'], 3, 'Let se construit sans to.', 'Quelle forme suit « let us » ?'],
            ['Quel verbe exprime l’encouragement dans cette structure ?', ['encourage', 'suggest', 'hope', 'make'], 0, 'They encouraged him to apply.'],
            ['Avec « help », le « to » est…', ['Obligatoire', 'Interdit', 'Facultatif', 'Placé après le verbe'], 2, 'He helped me (to) carry the box.'],
            ['Comment dire « J’aimerais qu’elle reste » ?', ['I’d like that she stays.', 'I’d like she stay.', 'I’d like her staying.', 'I’d like her to stay.'], 3, 'Would like + complément + to.'],
          ],
        },
        {
          titre: 'Both, either, neither, each, every : les distributifs',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Les deux, l’un ou l’autre, aucun des deux, chacun',
            cours: `Deux élèves, ou vingt ? Ensemble, ou un par un ? Les distributifs répondent à ces deux questions, et chacun a sa grammaire.

## Le tableau d’ensemble
| Mot | Combien ? | Sens | Exemple |
| **both** | 2 | les deux, ensemble | *Both answers are correct.* |
| **either** | 2 | l’un ou l’autre, n’importe lequel | *You can take either bus.* |
| **neither** | 2 | aucun des deux | *Neither answer is correct.* |
| **each** | 2 ou plus | chacun, pris un par un | *Each student has a book.* |
| **every** | 3 ou plus | tous, sans exception | *Every student has a book.* |

## Both : les deux ensemble
- Suivi d’un **pluriel** : *both answers, both of them*.
- *Both… and…* : *She speaks **both** English **and** Spanish.*
- Place : devant le verbe, après *be* ou l’auxiliaire : *They **both** agree. They are **both** tired.*

## Either et neither : l’un ou l’autre, ni l’un ni l’autre
- Suivis d’un **singulier** : *either day, neither answer*.
- *Either… or…* : *You can **either** stay **or** leave.*
- *Neither… nor…* : ***Neither** Tom **nor** Anna came.*
- En fin de phrase négative, *either* veut dire « non plus » : *I don’t like it **either**.*

> *Neither* contient déjà la négation : ***Neither** of them came* — jamais *Neither of them didn’t come*.

## Each ou every ?
| each | every |
| Insiste sur l’**individu** | Insiste sur le **groupe entier** |
| Dès 2 éléments | À partir de 3 |
| Peut s’employer seul : *They cost ten pounds **each**.* | Jamais seul |
| *each of* + pronom : *each of us* | pas de *every of* : *every one of us* |

Les deux sont suivis d’un **singulier** et d’un **verbe au singulier** : *Every student **has**… Each child **gets**…*

## Every et la fréquence
*every day* (chaque jour), *every other day* (un jour sur deux), *every three weeks* (toutes les trois semaines).

## Exemple travaillé
« Les deux candidats ont parlé, mais aucun des deux n’a convaincu ; chaque électeur devra choisir, et tous les votes compteront. »
→ ***Both** candidates spoke, but **neither** convinced the audience; **each** voter will have to choose, and **every** vote will count.*`,
          },
          questions: [
            ['Quel mot signifie « aucun des deux » ?', ['neither', 'both', 'either', 'every'], 0, 'Neither contient la négation.'],
            ['Complète : « ___ answers are correct. » (les deux)', ['Either', 'Each', 'Both', 'Every'], 2, 'Both + pluriel.', 'Quel mot signifie « les deux » ?'],
            ['« You can take either bus » signifie…', ['Tu peux prendre l’un ou l’autre bus', 'Tu dois prendre les deux bus', 'Tu ne peux prendre aucun bus', 'Tu prends chaque bus'], 0, 'Either = n’importe lequel des deux.'],
            ['Laquelle est correcte ?', ['Neither of them didn’t come.', 'Neither of them not came.', 'Either of them didn’t came.', 'Neither of them came.'], 3, 'Neither porte déjà la négation.'],
            ['« Every » s’emploie avec…', ['Deux éléments seulement', 'Trois éléments ou plus', 'Un nom pluriel', 'Un indénombrable'], 1, 'Every vise un groupe d’au moins trois.'],
            ['On peut dire « every of us ».', ['Vrai', 'Faux'], 1, 'On dit each of us ou every one of us.'],
            ['Complète : « I don’t like it ___. » (moi non plus)', ['too', 'either', 'neither', 'both'], 1, 'En fin de phrase négative, either = non plus.', 'Quel mot signifie « non plus » en fin de phrase négative ?'],
            ['Comment dire « Ni Tom ni Anna ne sont venus » ?', ['Either Tom or Anna came.', 'Both Tom and Anna didn’t come.', 'Neither Tom or Anna didn’t come.', 'Neither Tom nor Anna came.'], 3, 'Neither… nor…, sans autre négation.'],
            ['Quel verbe suit « Every student » ?', ['has', 'have', 'are having', 'haves'], 0, 'Every + singulier + verbe au singulier.'],
            ['« They cost ten pounds each » signifie…', ['Ils coûtent dix livres au total', 'Chacun paie dix livres', 'Ils coûtent dix livres pièce', 'Ils coûtent tous dix pence'], 2, 'Each peut s’employer seul, en fin de phrase.'],
            ['Que signifie « every other day » ?', ['Chaque jour', 'Tous les autres jours', 'Jamais', 'Un jour sur deux'], 3, 'Other = l’autre : un jour oui, un jour non.'],
            ['Où place-t-on « both » dans « They are tired » pour dire « Ils sont tous les deux fatigués » ?', ['Avant are', 'Après are', 'En fin de phrase', 'Avant They'], 1, 'Après be : They are both tired.'],
          ],
        },
        {
          titre: 'Le chassé-croisé et les structures résultatives',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'He swam across the river',
            cours: `« Il a traversé la rivière à la nage » : le français dit le déplacement dans le verbe et la manière à côté. L’anglais fait exactement l’inverse. On appelle cet échange le **chassé-croisé**.

## Le chassé-croisé
| Ce que dit… | Le français | L’anglais |
| Le **verbe** | le déplacement (*traverser*) | la manière (*swim*) |
| Le **complément** | la manière (*à la nage*) | le déplacement (*across*) |

| Français | Anglais |
| Il a traversé la rivière **à la nage**. | *He **swam across** the river.* |
| Elle est sortie **en courant**. | *She **ran out**.* |
| Ils sont rentrés **à pied**. | *They **walked back** home.* |
| L’oiseau s’est envolé. | *The bird **flew away**.* |
| Il a descendu l’escalier **en titubant**. | *He **staggered down** the stairs.* |

> Méthode de traduction vers l’anglais : 1. trouve **comment** on bouge (nager, courir, ramper) → c’est le verbe ; 2. trouve **où** on va (dedans, dehors, à travers, en haut) → c’est la particule (*in, out, across, up, down, away, back*).

## Les particules du mouvement
| Particule | Sens | Exemple |
| *in / into* | vers l’intérieur | *She rushed into the room.* |
| *out (of)* | vers l’extérieur | *He crawled out of the tent.* |
| *across* | d’un côté à l’autre | *They sailed across the Atlantic.* |
| *up / down* | vers le haut / le bas | *She climbed up the hill.* |
| *away* | au loin | *The thief ran away.* |
| *back* | retour | *He drove back to London.* |

## Les structures résultatives
L’anglais dit aussi le **résultat** d’une action par un adjectif ou une particule placé **après le complément**.
1. *She slammed the door **shut**.* — Elle a claqué la porte (qui s’est fermée).
2. *He painted the wall **red**.* — Il a peint le mur en rouge.
3. *The wind blew the door **open**.* — Le vent a ouvert la porte d’un coup.
4. *His death made me **cry**.* — Sa mort m’a fait pleurer (structure causative avec résultat).
5. *She kicked the ball **away**.*

## Du français vers l’anglais, et retour
Traduire *He tiptoed into the room* par « il est entré dans la pièce sur la pointe des pieds » : on remet le déplacement dans le verbe français (*entrer*) et la manière dans un complément (*sur la pointe des pieds*).

## Exemple travaillé
« Le chat est sorti de la cuisine à toute vitesse, et le vent a fait claquer la porte. » → *The cat **dashed out of** the kitchen, and the wind **banged the door shut**.*`,
          },
          questions: [
            ['Comment traduire « Il a traversé la rivière à la nage » ?', ['He crossed the river swimming.', 'He traversed the river by swim.', 'He swam across the river.', 'He crossed swimming the river.'], 2, 'Le verbe dit la manière, la particule le déplacement.'],
            ['Dans « She ran out », que dit le verbe ?', ['La manière (courir)', 'Le déplacement', 'Le résultat', 'Le temps'], 0, 'Ran dit comment ; out dit où.'],
            ['Comment traduire « L’oiseau s’est envolé » ?', ['The bird went flying.', 'The bird left by flying.', 'The bird is envolated.', 'The bird flew away.'], 3, 'Fly (manière) + away (déplacement).'],
            ['« He tiptoed into the room » se traduit par…', ['Il a marché sur ses orteils', 'Il est entré dans la pièce sur la pointe des pieds', 'Il a quitté la pièce en courant', 'Il a dansé dans la pièce'], 1, 'On remet le déplacement dans le verbe français.'],
            ['Quelle particule signifie « d’un côté à l’autre » ?', ['away', 'across', 'back', 'down'], 1, 'They sailed across the Atlantic.'],
            ['« She slammed the door shut » signifie qu’elle a claqué la porte et que celle-ci s’est fermée.', ['Vrai', 'Faux'], 0, 'Shut indique le résultat de l’action.'],
            ['Comment traduire « Ils sont rentrés à pied » ?', ['They returned by feet.', 'They came back walking.', 'They rentered on foot.', 'They walked back home.'], 3, 'Walk (manière) + back (retour).'],
            ['Dans « He painted the wall red », « red » exprime…', ['Le résultat', 'La cause', 'La manière de peindre', 'Le moment'], 0, 'Structure résultative : le mur devient rouge.'],
            ['Quelle traduction de « Le voleur s’est enfui en courant » est la plus naturelle ?', ['The thief escaped running.', 'The thief fled by running.', 'The thief ran away.', 'The thief went away by run.'], 2, 'L’anglais met la manière dans le verbe (*ran*) et le déplacement dans la particule (*away*) : c’est le chassé-croisé.'],
            ['Comment dire « Il est sorti de la tente en rampant » ?', ['He went out of the tent crawling.', 'He exited the tent by crawl.', 'He crawled into the tent.', 'He crawled out of the tent.'], 3, 'Crawl (manière) + out of (sortie).'],
            ['Comment traduire « Le vent a ouvert la porte d’un coup » ?', ['The wind opened the door by blow.', 'The wind blew the door open.', 'The wind blew open by the door.', 'The wind made open the door.'], 1, 'Blow (manière) + open (résultat).'],
            ['Où se place l’adjectif de résultat dans « She kicked the box ___ » ?', ['Avant le verbe', 'Entre le sujet et le verbe', 'Après le complément', 'Avant le sujet'], 2, 'Verbe + complément + résultat.', 'Où se place l’adjectif qui exprime le résultat ?'],
          ],
        },
        {
          titre: 'Adjectifs et noms suivis d’une préposition',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Good at, interested in, the reason for',
            cours: `« Bon en maths », « intéressé par l’art », « la raison de son départ » : chaque fois, la préposition française pousse vers la mauvaise préposition anglaise. Ces couples s’apprennent par cœur, mais ils se rangent.

## Les adjectifs + préposition les plus utiles
| Préposition | Adjectifs | Exemple |
| **at** (une compétence) | *good at, bad at, brilliant at* | *She’s **good at** maths.* |
| **in** (un domaine) | *interested in, involved in, rich in* | *He’s **interested in** art.* |
| **of** (un sentiment, une qualité) | *afraid of, proud of, aware of, fond of, full of, tired of* | *I’m **proud of** you.* |
| **about** (un sujet d’émotion) | *worried about, excited about, sorry about, angry about* | *Don’t be **worried about** it.* |
| **with** (une personne, un état) | *angry with, pleased with, bored with, satisfied with* | *She was **pleased with** the result.* |
| **for** (une cause, une fonction) | *famous for, responsible for, ready for, grateful for* | *Liverpool is **famous for** the Beatles.* |
| **to** (une relation) | *similar to, married to, kind to, used to* | *He’s **married to** a doctor.* |
| **from** (une différence) | *different from, far from, absent from* | *It’s **different from** mine.* |

> *Angry **about** something, angry **with** someone.* Et en anglais, on est marié **à** quelqu’un (*married to*), jamais *married with*.

## Les noms + préposition
| Nom | Préposition | Exemple |
| *reason* | **for** | *the reason **for** his departure* |
| *cause* | **of** | *the cause **of** the fire* |
| *increase / decrease* | **in** | *an increase **in** prices* |
| *solution / key / answer* | **to** | *the solution **to** the problem* |
| *demand / need* | **for** | *a need **for** change* |
| *attitude / reaction* | **to / towards** | *her reaction **to** the news* |
| *effect / impact* | **on** | *the impact **on** young people* |

## La règle qui suit la préposition : -ING
Après toute préposition, un verbe prend **-ING** : *She’s good at **drawing**. I’m tired of **waiting**. The reason for **leaving**…*

## Les calques à fuir
| Faute | Correct |
| *depend of* | *depend **on*** |
| *interested by* | *interested **in*** |
| *responsible of* | *responsible **for*** |
| *good in maths* (possible mais rare) | *good **at** maths* |

## Exemple travaillé
« Les jeunes sont conscients des risques et inquiets pour l’avenir ; la raison de cette inquiétude est l’impact du changement climatique sur leur vie. »
→ *Young people are **aware of** the risks and **worried about** the future; the reason **for** this anxiety is the impact **of** climate change **on** their lives.*`,
          },
          questions: [
            ['Complète : « She’s good ___ maths. »', ['at', 'in', 'on', 'for'], 0, 'Une compétence : good at.', 'Quelle préposition suit « good » pour une compétence ?'],
            ['Laquelle est correcte ?', ['He’s interested by art.', 'He’s interested for art.', 'He’s interested of art.', 'He’s interested in art.'], 3, 'Interested in, jamais interested by.'],
            ['Comment dire « la raison de son départ » ?', ['the reason of his departure', 'the reason for his departure', 'the reason to his departure', 'the reason in his departure'], 1, 'On dit *the reason for* : en anglais, la raison « de » quelque chose se construit avec *for*, jamais avec *of*.'],
            ['Complète : « It depends ___ the weather. »', ['of', 'on', 'from', 'at'], 1, 'Depend on, jamais depend of.', 'Quelle préposition suit « depend » ?'],
            ['« Angry with » s’emploie avec…', ['Une chose', 'Un lieu', 'Une date', 'Une personne'], 3, 'Angry with someone, angry about something.'],
            ['On dit « married with a doctor ».', ['Vrai', 'Faux'], 1, 'On dit married to.'],
            ['Quelle forme suit « tired of » ?', ['waiting', 'wait', 'to wait', 'waited'], 0, 'Après une préposition, le verbe prend -ING.'],
            ['Complète : « Liverpool is famous ___ the Beatles. »', ['of', 'by', 'for', 'with'], 2, '*Famous for* : on est célèbre « pour » quelque chose. De même *known for* et *responsible for*.', 'Quelle préposition suit « famous » ?'],
            ['Comment dire « une hausse des prix » ?', ['an increase of prices', 'an increase on prices', 'an increase at prices', 'an increase in prices'], 3, '*An increase in* : la hausse « de » quelque chose se construit avec *in*, comme *a rise in* ou *a fall in*.'],
            ['Complète : « the solution ___ the problem »', ['of', 'to', 'for', 'at'], 1, 'Solution to, key to, answer to.', 'Quelle préposition suit « solution » ?'],
            ['« Responsible of » est une faute : on dit…', ['responsible to', 'responsible in', 'responsible for', 'responsible with'], 2, 'Responsible for.'],
            ['Comment dire « l’impact sur les jeunes » ?', ['the impact on young people', 'the impact to young people', 'the impact for young people', 'the impact of young people'], 0, 'Impact on, effect on.'],
          ],
        },
      ],
    },
  ],
}
