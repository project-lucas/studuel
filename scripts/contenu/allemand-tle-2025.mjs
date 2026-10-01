// Allemand Tle — ce qui est PROPRE à la Terminale, en plus des 36 fiches de langue.
//
// CONSTAT (extraction du 26/09/2026) : la 3e, la 2de, la 1re et la Tle avaient
// EXACTEMENT les mêmes 36 fiches de grammaire (posées par `allemand-tle.mjs`,
// migration 249, puis recopiées). Rien sur les axes culturels de la Terminale.
//
// LE PROGRAMME : arrêté du 5 mai 2025, BO n° 22 du 29 mai 2025, en vigueur en
// Terminale à la rentrée 2026 (article 4). Six axes, dont le sixième propre à
// l'aire germanophone (« Deutsch, Sprache der Dichter, Denker und Künstler ») ;
// cinq doivent être traités, l'axe 6 obligatoirement. Niveau visé B1 (LVB),
// B2 (LVA). Les six fiches de langue suivent les repères B2 du même programme
// et prennent ce que les 36 fiches ne font qu'effleurer ou ignorent : le
// subjonctif I et le discours rapporté, le double infinitif, le groupe
// participial épithète, les pronoms indéfinis en irgend-, indem et le moyen,
// les particules illocutoires.
//
// Deux blocs : rayon 'culture' (37 → 42), rayon 'langue' (43 → 48).
// Convention de la maison : la langue s'interroge EN FRANÇAIS.

export default {
  slug: 'allemand',
  nom: 'Allemand',

  titreMigration: 'ALLEMAND Tle — AXES CULTURELS ET LANGUE B2 (programme 2025)',

  motif: `CONSTAT : la Tle d'allemand portait exactement les mêmes 36 fiches de
grammaire que la 3e, la 2de et la 1re. Le programme de Terminale (arrêté du 5
mai 2025, BO n° 22 du 29 mai 2025, en vigueur à la rentrée 2026) fixe six axes
culturels, dont « Deutsch, Sprache der Dichter, Denker und Künstler », propre à
l'aire germanophone et obligatoire, et des repères de langue B2. Cette
migration AJOUTE 12 fiches propres à la Tle — une par axe, et six fiches de
langue — derrière les 36 fiches, sans rien retirer.`,

  blocs: [
    // =====================================================================
    // RAYON CULTURE — les six axes de la Terminale
    // =====================================================================
    {
      niveaux: ['Tle'],
      positionDepart: 37,
      rayon: 'culture',
      chapitres: [
        {
          titre: 'Vie privée, vie publique : des femmes au Datenschutz',
          axe: 'Espace privé et espace public',
          lecon: {
            titre: 'Où finit la sphère privée ?',
            cours: `Les Allemands ont la réputation de protéger jalousement leur vie privée. Mais la frontière entre privé et public a beaucoup bougé : avec l’émancipation des femmes, les dictatures, les Églises et le numérique.

## Kinder, Küche, Kirche… Karriere ?
Sous l’Empire, la formule des « trois K » (enfants, cuisine, église) résumait la place assignée aux femmes : la sphère privée.
| Date | Étape |
| 1918 | Droit de vote des femmes |
| 1949 | La Loi fondamentale : « *Männer und Frauen sind gleichberechtigt* », défendu par la juriste Elisabeth Selbert |
| 1977 | En RFA, une femme mariée n’a plus besoin de l’accord de son mari pour travailler |
| 2005 | Angela Merkel, première femme chancelière |

En RDA, presque toutes les femmes travaillaient, grâce aux crèches ; à l’Ouest, le modèle de la mère au foyer a duré plus longtemps.

## L’école des dictatures
Les dictatures ont effacé la frontière du privé : la **Hitlerjugend** (HJ), obligatoire à partir de 1939, et la **FDJ** (*Freie Deutsche Jugend*) en RDA encadraient les loisirs et les pensées des jeunes. La Stasi, police politique de la RDA, espionnait jusque dans les familles : à l’ouverture des archives, certains ont découvert que leurs proches les avaient surveillés.

## Datenschutz : une passion allemande
| Repère | Ce qu’il montre |
| 1983 | La Cour constitutionnelle crée un « droit à l’autodétermination informationnelle » (*Recht auf informationelle Selbstbestimmung*) |
| 2010 | Des centaines de milliers d’Allemands font flouter leur maison sur Google Street View |
| 2018 | Le RGPD européen (*DSGVO*), inspiré en partie de cette tradition |

> La mémoire de la Gestapo et de la Stasi explique en partie cette méfiance : qui a été surveillé sait ce que valent ses données.

## Les Églises, acteurs publics
Les Églises catholique et protestante prélèvent un impôt d’Église (*Kirchensteuer*) par l’intermédiaire de l’État, gèrent hôpitaux et écoles. En 1989, l’église Saint-Nicolas de Leipzig abritait les prières pour la paix d’où partaient les manifestations du lundi. Aujourd’hui, moins de la moitié des Allemands appartient à une Église.

## Vocabulaire
| Allemand | Français |
| *die Privatsphäre* | la vie privée |
| *die Öffentlichkeit* | l’espace public, le public |
| *der Datenschutz* | la protection des données |
| *die Überwachung* | la surveillance |
| *die Gleichberechtigung* | l’égalité des droits |
| *die Emanzipation* | l’émancipation |`,
          },
          questions: [
            ['Que désignaient les « trois K » ?', ['Kaiser, Krieg, Kultur', 'Kinder, Küche, Kirche', 'Kunst, Kino, Konzert', 'Kopf, Körper, Kraft'], 1, 'Enfants, cuisine, église : la sphère assignée aux femmes.'],
            ['Quelle phrase de la Loi fondamentale défend l’égalité hommes-femmes ?', ['Die Würde des Menschen ist unantastbar', 'Männer und Frauen sind gleichberechtigt', 'Alle Macht geht vom Volke aus', 'Einigkeit und Recht und Freiheit'], 1, 'L’article 3, défendu par Elisabeth Selbert en 1949.'],
            ['Jusqu’en 1977 en RFA, une femme mariée avait besoin de l’accord de son mari pour travailler.', ['Vrai', 'Faux'], 0, 'La réforme du droit du mariage de 1977 y a mis fin.'],
            ['Qu’était la FDJ ?', ['Un parti libéral', 'L’organisation de jeunesse de la RDA', 'Un journal', 'Une Église'], 1, 'La *Freie Deutsche Jugend* encadrait la jeunesse est-allemande.'],
            ['Que crée la Cour constitutionnelle en 1983 ?', ['Le droit de vote à 16 ans', 'Un droit à l’autodétermination informationnelle', 'L’impôt d’Église', 'La liberté de la presse'], 1, 'Un jalon de la protection des données personnelles.'],
            ['Pourquoi de nombreux Allemands ont-ils fait flouter leur maison sur Google Street View ?', ['Par souci de leur vie privée', 'Par obligation légale', 'Par erreur technique', 'Pour des raisons fiscales'], 0, 'Un réflexe très allemand de protection de la sphère privée.'],
            ['Que signifie « die Überwachung » ?', ['La surveillance', 'La victoire', 'Le réveil', 'La traversée'], 0, '*überwachen* = surveiller.'],
            ['Qu’est-ce que la « Kirchensteuer » ?', ['Un don volontaire', 'L’impôt d’Église prélevé via l’État', 'Une taxe sur les monuments', 'Une amende'], 1, 'Les membres des Églises paient cet impôt, collecté par l’administration fiscale.'],
            ['Quelle église de Leipzig a joué un rôle en 1989 ?', ['La Frauenkirche', 'L’église Saint-Nicolas', 'Le Dom de Cologne', 'L’église du Souvenir'], 1, 'Ses prières pour la paix précédaient les manifestations du lundi.'],
            ['Que signifie « die Öffentlichkeit » ?', ['L’ouverture', 'L’espace public, le public', 'La publicité', 'Le bureau'], 1, 'L’opposé de *die Privatsphäre*.'],
            ['Qui fut la première femme chancelière d’Allemagne ?', ['Ursula von der Leyen', 'Angela Merkel', 'Annalena Baerbock', 'Elisabeth Selbert'], 1, 'Angela Merkel, de 2005 à 2021.'],
            ['Comment s’appelle le RGPD en allemand ?', ['DSGVO', 'BGB', 'GG', 'NetzDG'], 0, '*Datenschutz-Grundverordnung*, entrée en application en 2018.'],
          ],
        },

        {
          titre: 'Lieux de mémoire : du Mur à Prora',
          axe: 'Territoire et mémoire',
          lecon: {
            titre: 'Affronter un passé difficile, habiter ses traces',
            cours: `L’Allemagne est couverte de lieux de mémoire : des pans de mur, des camps, des stèles, des bâtiments encombrants. Que garder, que montrer, que détruire ? Chaque choix dit quelle mémoire collective on veut transmettre.

## Que reste-t-il du Mur de Berlin ?
Construit le 13 août 1961 par la RDA, le Mur encerclait Berlin-Ouest sur environ 155 km. Plus de 140 personnes sont mortes en tentant de le franchir à Berlin. Tombé le 9 novembre 1989, il a été presque entièrement détruit.
| Lieu | Ce qu’on y voit |
| *East Side Gallery* | 1,3 km de mur peint par des artistes du monde entier |
| *Gedenkstätte Berliner Mauer* (Bernauer Straße) | le mémorial officiel, avec le « couloir de la mort » |
| Une double rangée de pavés | le tracé du Mur dans la ville |

## Le 9 novembre, jour du destin
| Année | Événement |
| 1918 | Proclamation de la République |
| 1923 | Putsch manqué d’Hitler à Munich |
| 1938 | Pogroms de la « nuit de Cristal » |
| 1989 | Chute du Mur |

Cette date est si chargée qu’on a préféré le **3 octobre** (réunification de 1990) comme fête nationale : on ne pouvait pas célébrer le jour des pogroms.

## Où inscrire la mémoire de la guerre ?
Mémoriaux des camps (Dachau, Buchenwald, Bergen-Belsen), musée de la *Topographie de la terreur* sur l’ancien siège de la Gestapo, mémorial de l’Holocauste, *Stolpersteine* : la mémoire allemande a choisi de montrer les crimes, pas seulement les victimes allemandes.

## Que faire d’un patrimoine embarrassant ?
- **Prora**, sur l’île de Rügen : un complexe balnéaire nazi de 4,5 km pour la *Kraft durch Freude* (« la force par la joie »), jamais achevé. Aujourd’hui, on y trouve des appartements, une auberge de jeunesse… et un centre de documentation.
- Le **Nischel** (« caboche », en saxon) de Chemnitz : une tête de Karl Marx de plus de 7 m, érigée en RDA en 1971, gardée et devenue emblème de la ville.

> Détruire efface la preuve ; conserver sans expliquer glorifie. Le choix allemand : garder et documenter.

## Des minorités allemandes en Europe de l’Est
Des Allemands vivent depuis des siècles en Pologne (Silésie), en Roumanie (les Saxons de Transylvanie) ou en Russie. Klaus Iohannis, issu de la minorité allemande, a été président de la Roumanie de 2014 à 2025.

## Vocabulaire
| Allemand | Français |
| *der Erinnerungsort* | le lieu de mémoire |
| *die Gedenkstätte* | le mémorial |
| *gedenken* + gén. | commémorer |
| *die Spur, die Spuren* | la trace |
| *das Erbe* | l’héritage |
| *die Minderheit* | la minorité |`,
          },
          questions: [
            ['Quand le Mur de Berlin a-t-il été construit ?', ['Le 9 novembre 1949', 'Le 13 août 1961', 'Le 17 juin 1953', 'Le 3 octobre 1990'], 1, 'Dans la nuit du 12 au 13 août 1961.'],
            ['Qu’est-ce que l’East Side Gallery ?', ['Un musée d’art moderne', 'Un pan de mur de 1,3 km peint par des artistes', 'Une galerie commerciale', 'Un poste-frontière'], 1, 'Le plus long fragment conservé du Mur.'],
            ['Pourquoi le 9 novembre n’est-il pas la fête nationale ?', ['C’est un jour de deuil trop chargé (pogroms de 1938)', 'Il tombe pendant les vacances', 'La RDA l’avait choisi', 'Il n’y a rien eu ce jour-là'], 0, 'On a préféré le 3 octobre, jour de la réunification.'],
            ['Qu’était Prora ?', ['Un camp de concentration', 'Un complexe balnéaire nazi sur Rügen', 'Une caserne soviétique', 'Un château prussien'], 1, 'Conçu pour la *Kraft durch Freude*, jamais achevé.'],
            ['Que désigne le « Nischel » de Chemnitz ?', ['Une église', 'Une tête géante de Karl Marx', 'Un pont', 'Un stade'], 1, 'Monument de 1971, devenu emblème de la ville.'],
            ['Que s’est-il passé le 9 novembre 1938 ?', ['La chute du Mur', 'La nuit de Cristal', 'La proclamation de la République', 'Le putsch de la brasserie'], 1, 'Pogroms organisés contre les Juifs dans tout le Reich.'],
            ['Que signifie « die Gedenkstätte » ?', ['Le mémorial', 'Le cimetière militaire', 'Le musée d’art', 'L’hôtel de ville'], 0, '*gedenken* (commémorer) + *die Stätte* (le lieu).'],
            ['La Topographie de la terreur se trouve sur l’ancien siège…', ['du Reichstag', 'de la Gestapo', 'de la Stasi', 'du parti communiste'], 1, 'Un centre de documentation sur les crimes du régime nazi.'],
            ['Quelle attitude l’Allemagne a-t-elle le plus souvent choisie face à un patrimoine embarrassant ?', ['Tout détruire', 'Garder et documenter', 'Le cacher', 'Le vendre'], 1, 'Conserver les traces en les expliquant.'],
            ['Klaus Iohannis, issu de la minorité allemande, a présidé…', ['la Pologne', 'la Roumanie', 'la Hongrie', 'la Tchéquie'], 1, 'Saxon de Transylvanie, président de la Roumanie de 2014 à 2025.'],
            ['« gedenken » se construit avec le génitif : « der Opfer gedenken ».', ['Vrai', 'Faux'], 0, 'Un des rares verbes au génitif, dans un registre soutenu.'],
            ['Combien de kilomètres environ le Mur encerclant Berlin-Ouest mesurait-il ?', ['15', '55', '155', '1 550'], 2, 'Environ 155 km autour de Berlin-Ouest.'],
          ],
        },

        {
          titre: 'Mythes anciens, mythes modernes : d’Arminius au « miracle de Berne »',
          axe: 'Fictions et réalités',
          lecon: {
            titre: 'Comment les récits fabriquent une nation',
            cours: `Toute nation se raconte des histoires. L’Allemagne, unifiée tardivement (1871), a eu besoin de héros fondateurs ; au XXe siècle, elle a produit des mythes nouveaux, et la littérature continue de réécrire l’histoire.

## Les héros fondateurs
| Figure | Réalité | Mythe |
| **Arminius** (« Hermann ») | chef germain qui écrase trois légions romaines dans la forêt de Teutobourg, en l’an 9 | le libérateur de la Germanie ; statue géante (*Hermannsdenkmal*) achevée en 1875 |
| **Barberousse** | empereur Frédéric Ier, mort en 1190 en croisade | il dormirait dans la montagne du Kyffhäuser et se réveillerait pour sauver l’Allemagne |
| **Siegfried** | personnage de fiction de la *Chanson des Nibelungen* | le héros tueur de dragon, repris par Wagner |

Au XIXe siècle, ces figures servent le nationalisme ; les nazis les récupèrent. Aujourd’hui, on les regarde avec distance.

## Les « miracles » de l’après-guerre
- Le **miracle économique** (*Wirtschaftswunder*) : dans les années 1950, la RFA, en ruines en 1945, devient une grande puissance industrielle grâce à la réforme monétaire, au plan Marshall et au travail.
- Le **miracle de Berne** (*Das Wunder von Bern*) : le 4 juillet 1954, l’équipe de RFA bat la Hongrie, favorite, 3 à 2 en finale de la Coupe du monde. Pour beaucoup, c’est la vraie naissance émotionnelle de la RFA : « *Wir sind wieder wer* » (nous revoilà quelqu’un).

## 1989, nouveau mythe fondateur ?
La **révolution pacifique** d’automne 1989 — manifestations du lundi à Leipzig, slogan « *Wir sind das Volk* » — a renversé une dictature sans un coup de feu. Elle est devenue un récit fondateur de l’Allemagne réunifiée.

## Héros réels, héros fabriqués
| Sophie Scholl | Hitlerjunge Quex |
| étudiante de la Rose blanche, exécutée le 22 février 1943 pour des tracts contre Hitler | héros d’un film de propagande de 1933, inspiré d’un jeune nazi tué et transformé en martyr |
| une résistante réelle, devenue un modèle de courage civique | une fiction fabriquée pour embrigader la jeunesse |

> Une dictature fabrique ses héros ; une démocratie se choisit des modèles. La différence est dans le rapport à la vérité.

## Quand le roman réécrit l’histoire
Daniel Kehlmann, dans *Les Arpenteurs du monde* (*Die Vermessung der Welt*, 2005), imagine la rencontre d’Alexander von Humboldt et du mathématicien Gauss : l’histoire devient roman, et le roman fait réfléchir à l’histoire.

## Vocabulaire
| Allemand | Français |
| *der Mythos* | le mythe |
| *der Held, die Heldin* | le héros, l’héroïne |
| *das Wunder* | le miracle |
| *die Wirklichkeit* | la réalité |
| *erfinden, die Fiktion* | inventer, la fiction |
| *verklären* | idéaliser, transfigurer |`,
          },
          questions: [
            ['Qu’a fait Arminius en l’an 9 ?', ['Il a fondé Berlin', 'Il a écrasé trois légions romaines', 'Il a été couronné empereur', 'Il a converti les Germains'], 1, 'Bataille de la forêt de Teutobourg.'],
            ['Selon la légende, où dort Barberousse ?', ['Sous le Rhin', 'Dans le Kyffhäuser', 'À Aix-la-Chapelle', 'Dans la Forêt-Noire'], 1, 'Il se réveillerait pour sauver l’Allemagne.'],
            ['Que désigne « das Wunder von Bern » ?', ['La victoire de la RFA en Coupe du monde 1954', 'Un traité suisse', 'Une découverte scientifique', 'La réunification'], 0, 'Victoire 3-2 sur la Hongrie, le 4 juillet 1954.'],
            ['Que désigne le « Wirtschaftswunder » ?', ['La crise de 1929', 'Le redressement économique rapide de la RFA', 'L’inflation de 1923', 'La monnaie commune'], 1, 'Le miracle économique des années 1950.'],
            ['Quel slogan portaient les manifestants de Leipzig en 1989 ?', ['Wir schaffen das', 'Wir sind das Volk', 'Nie wieder Krieg', 'Ich bin ein Berliner'], 1, '« Le peuple, c’est nous » : contre un régime qui prétendait parler en son nom.'],
            ['Qui était Sophie Scholl ?', ['Une actrice de propagande', 'Une résistante de la Rose blanche', 'Une chancelière', 'Une héroïne de roman'], 1, 'Exécutée le 22 février 1943 avec son frère Hans.'],
            ['« Hitlerjunge Quex » est…', ['un roman de Kehlmann', 'un film de propagande de 1933', 'un résistant', 'un conte de Grimm'], 1, 'Le film transforme un jeune nazi tué en martyr pour embrigader la jeunesse.'],
            ['Siegfried est un personnage historique réel.', ['Vrai', 'Faux'], 1, 'C’est un héros de fiction de la *Chanson des Nibelungen*.'],
            ['Quel roman de Kehlmann met en scène Humboldt et Gauss ?', ['Tyll', 'Die Vermessung der Welt', 'Der Vorleser', 'Die Blechtrommel'], 1, '*Les Arpenteurs du monde*, 2005.'],
            ['Que signifie « verklären » ?', ['Expliquer', 'Idéaliser, transfigurer', 'Déclarer', 'Nettoyer'], 1, 'Un mythe *verklärt* la réalité : il l’embellit.'],
            ['En quelle année l’Allemagne a-t-elle été unifiée pour la première fois comme État-nation ?', ['1648', '1815', '1871', '1919'], 2, 'L’Empire allemand est proclamé en 1871.'],
            ['Que signifie « die Wirklichkeit » ?', ['L’efficacité', 'La réalité', 'L’œuvre', 'La vérité juridique'], 1, 'L’opposé de *die Fiktion*.'],
          ],
        },

        {
          titre: 'Humour, slogans, discours : communiquer en allemand',
          axe: 'Enjeux et formes de la communication',
          lecon: {
            titre: 'Faire rire, convaincre, informer',
            cours: `Un sketch, une affiche, un discours, un journal télévisé : chaque forme de communication a ses codes. Ceux du monde germanophone sont en partie universels, en partie marqués par sa langue et son histoire.

## Un humour germanophone ?
L’idée que « les Allemands n’ont pas d’humour » est un cliché. **Loriot** (Vicco von Bülow) a fait rire plusieurs générations avec des sketches sur la politesse et la maladresse bourgeoises. Le **cabaret politique** (*Kabarett*) se moque des puissants. L’écrivain Erich Kästner a écrit que l’humour est le parapluie des sages (« *Der Humor ist der Regenschirm der Weisen* »).

## L’allemand, langue de slogans ?
La langue allemande se prête aux formules courtes et aux mots composés.
| Slogan | Contexte |
| « *Vorsprung durch Technik* » | publicité d’Audi, connue même à l’étranger |
| « *Wir sind das Volk* » | manifestations de 1989 |
| « *Mehr Demokratie wagen* » | Willy Brandt, 1969 |

## Des discours et des images qui ont changé le monde
| Moment | Pourquoi il compte |
| « *Ich bin ein Berliner* », John F. Kennedy, 1963 | solidarité avec Berlin-Ouest encerclé |
| Günter Schabowski, 9 novembre 1989 | annonce confuse de l’ouverture des frontières, « *sofort, unverzüglich* » : le Mur tombe dans la nuit |
| « *blühende Landschaften* », Helmut Kohl, 1990 | promesse de « paysages florissants » à l’Est, devenue ironique face au chômage |
| Willy Brandt à genoux à Varsovie, 1970 | une image plus forte qu’un discours |

> Une formule réussie condense une époque ; elle peut aussi se retourner contre celui qui l’a prononcée.

## La presse, le quatrième pouvoir
| Média | Particularité |
| *Tagesschau* (ARD) | journal télévisé de référence depuis 1952 |
| *Der Spiegel* | hebdomadaire d’investigation |
| *Süddeutsche Zeitung*, *FAZ* | grands quotidiens nationaux |
| *Bild* | quotidien populaire à sensation, très lu |

Les chaînes publiques (ARD, ZDF) sont financées par une redevance payée par chaque foyer : garantir une information indépendante est une leçon tirée de la propagande nazie et de la RDA.

## Vocabulaire
| Allemand | Français |
| *der Witz* | la blague, l’esprit |
| *die Werbung* | la publicité |
| *die Rede* | le discours |
| *die Pressefreiheit* | la liberté de la presse |
| *die Nachrichten* | les informations |
| *überzeugen* | convaincre |`,
          },
          questions: [
            ['Qui était Loriot ?', ['Un chancelier', 'Un humoriste célèbre', 'Un journaliste du Spiegel', 'Un publicitaire'], 1, 'Vicco von Bülow, maître de l’humour sur les maladresses bourgeoises.'],
            ['Qui a dit « Ich bin ein Berliner » en 1963 ?', ['Willy Brandt', 'John F. Kennedy', 'Konrad Adenauer', 'Ronald Reagan'], 1, 'Kennedy, à Berlin-Ouest, en signe de solidarité.'],
            ['Que promettait Helmut Kohl avec les « blühende Landschaften » ?', ['Des jardins publics', 'La prospérité rapide de l’Est après la réunification', 'La protection de la nature', 'Des vacances pour tous'], 1, 'La formule est devenue ironique face au chômage à l’Est.'],
            ['Quel rôle a joué Günter Schabowski le 9 novembre 1989 ?', ['Il a fait construire le Mur', 'Il a annoncé de façon confuse l’ouverture des frontières', 'Il a manifesté à Leipzig', 'Il a présenté la Tagesschau'], 1, 'Son « sofort, unverzüglich » a précipité la chute du Mur.'],
            ['« Mehr Demokratie wagen » est une formule de…', ['Helmut Kohl', 'Willy Brandt', 'Angela Merkel', 'Konrad Adenauer'], 1, 'Discours de 1969 : « oser plus de démocratie ».'],
            ['Qu’est-ce que la Tagesschau ?', ['Un hebdomadaire', 'Le journal télévisé de l’ARD', 'Un cabaret', 'Un site de publicité'], 1, 'Journal télévisé de référence depuis 1952.'],
            ['Comment sont financées l’ARD et la ZDF ?', ['Par la publicité seulement', 'Par une redevance payée par les foyers', 'Par les partis', 'Par des dons'], 1, 'Pour garantir une information indépendante.'],
            ['Le journal « Bild » est un quotidien populaire à sensation.', ['Vrai', 'Faux'], 0, 'Très lu, il cultive les gros titres.'],
            ['Que signifie « die Werbung » ?', ['La publicité', 'Le travail', 'Le devenir', 'La recommandation officielle'], 0, '*werben* = faire de la publicité, recruter.'],
            ['Pourquoi parle-t-on de la presse comme du « quatrième pouvoir » ?', ['Elle vote les lois', 'Elle contrôle les trois autres pouvoirs par l’information', 'Elle appartient à l’État', 'Elle juge les citoyens'], 1, '*die vierte Gewalt* : elle surveille l’exécutif, le législatif et le judiciaire.'],
            ['Que signifie « überzeugen » ?', ['Convaincre', 'Traverser', 'Surprendre', 'Témoigner'], 0, '*Er hat mich überzeugt* : il m’a convaincu.'],
            ['À qui doit-on la phrase « Der Humor ist der Regenschirm der Weisen » ?', ['Goethe', 'Erich Kästner', 'Loriot', 'Brecht'], 1, 'L’auteur d’*Émile et les détectives*.'],
          ],
        },

        {
          titre: 'Réseaux, infox, IA : être citoyen à l’ère numérique',
          axe: 'Citoyenneté et mondes virtuels',
          lecon: {
            titre: 'L’engagement citoyen dans les espaces virtuels',
            cours: `Les réseaux sociaux ont ouvert une nouvelle arène politique : on y débat, on s’y mobilise, mais on y propage aussi la haine et les fausses informations. L’Allemagne, où l’engagement citoyen est très valorisé, cherche à y fixer des règles.

## Les réseaux, nouvelle arène politique
Les partis font campagne sur TikTok et Instagram ; les jeunes s’informent de plus en plus par les réseaux. Les partis extrêmes y sont souvent les plus visibles. Pour lutter contre la haine en ligne, l’Allemagne a adopté en 2017 la loi *NetzDG*, qui oblige les grandes plateformes à supprimer rapidement les contenus manifestement illégaux ; l’Union européenne a pris le relais avec le règlement sur les services numériques.

## Hashtagaktivismus : Internet au service de l’engagement ?
| Mouvement | Cause |
| *#aufschrei* (2013) | témoignages sur le sexisme au quotidien |
| *#MeTwo* (2018) | témoignages de racisme vécu par des personnes issues de l’immigration |
| *Fridays for Future* | grèves pour le climat, organisées largement en ligne |

Critique fréquente : le « clic » ne remplace pas l’engagement réel. Réponse des militants : le hashtag ouvre le débat que la rue et les urnes poursuivent. Les pétitions en ligne au Bundestag sont un outil officiel de participation.

## Peut-on faire confiance aux médias ?
| Affaire | Ce qu’elle révèle |
| **Affaire du Spiegel** (1962) | après un article critique sur l’armée, la police arrête des journalistes ; le scandale provoque le départ du ministre Franz Josef Strauß : la liberté de la presse l’emporte |
| **Affaire Relotius** (2018) | un reporter star du *Spiegel* avait inventé des passages de ses reportages : le journal enquête lui-même et publie tout |

> La confiance dans les médias ne vient pas de l’absence d’erreurs, mais de la capacité à les reconnaître et à les corriger.

## Fake News et intelligence artificielle
Les infox (*Falschmeldungen*) circulent plus vite que les démentis. L’IA peut fabriquer de fausses images ou voix (*Deepfakes*). Faut-il que l’Europe développe sa propre IA ? Des entreprises allemandes s’y emploient, comme **DeepL** (Cologne), outil de traduction utilisé dans le monde entier. L’Union européenne a adopté en 2024 le premier règlement général sur l’IA.

## Vocabulaire
| Allemand | Français |
| *die sozialen Netzwerke* | les réseaux sociaux |
| *die Falschmeldung, Fake News* | la fausse information |
| *die Hassrede* | le discours de haine |
| *sich engagieren* | s’engager |
| *die Meinungsfreiheit* | la liberté d’expression |
| *die künstliche Intelligenz (KI)* | l’intelligence artificielle |`,
          },
          questions: [
            ['Que prévoit la loi allemande NetzDG de 2017 ?', ['L’interdiction des réseaux sociaux', 'La suppression rapide des contenus manifestement illégaux par les plateformes', 'Le vote en ligne', 'La gratuité d’Internet'], 1, 'Elle vise la haine en ligne sur les grandes plateformes.'],
            ['Que dénonçait le mouvement #MeTwo (2018) ?', ['Le harcèlement scolaire', 'Le racisme vécu par des personnes issues de l’immigration', 'Le changement climatique', 'La corruption'], 1, 'Des milliers de témoignages de racisme au quotidien.'],
            ['Quelle a été la conséquence politique de l’affaire du Spiegel en 1962 ?', ['La fermeture du journal', 'Le départ du ministre Franz Josef Strauß', 'Une nouvelle constitution', 'L’arrestation du chancelier'], 1, 'La liberté de la presse en sort renforcée.'],
            ['Que révèle l’affaire Relotius en 2018 ?', ['Un piratage', 'Des reportages en partie inventés par un journaliste', 'Une censure d’État', 'Une faillite'], 1, 'Le *Spiegel* a enquêté lui-même et tout publié.'],
            ['Que signifie « die Hassrede » ?', ['Le discours de haine', 'Le discours officiel', 'La rédaction', 'Le débat'], 0, '*der Hass* (la haine) + *die Rede* (le discours).'],
            ['DeepL, outil de traduction par IA, est une entreprise…', ['américaine', 'allemande, de Cologne', 'suisse', 'autrichienne'], 1, 'Un exemple d’IA européenne utilisée dans le monde entier.'],
            ['Qu’était « #aufschrei » (2013) ?', ['Une campagne contre le sexisme au quotidien', 'Une campagne électorale', 'Un festival de musique', 'Une grève pour le climat'], 0, '*der Aufschrei* = le cri d’indignation.'],
            ['Les pétitions en ligne au Bundestag sont un outil officiel de participation.', ['Vrai', 'Faux'], 0, 'Chaque citoyen peut en déposer ou en signer.'],
            ['Que signifie « die Falschmeldung » ?', ['La fausse information', 'La mauvaise note', 'L’erreur de calcul', 'Le faux témoin'], 0, 'Synonyme de *Fake News*.'],
            ['Qu’est-ce qu’un « Deepfake » ?', ['Une image ou une voix fabriquée par l’IA', 'Un réseau social', 'Un journal', 'Un mot de passe'], 0, 'Une imitation truquée, difficile à distinguer du vrai.'],
            ['Comment dit-on « la liberté d’expression » ?', ['die Meinungsfreiheit', 'die Pressefreiheit', 'die Redefreiheit des Staates', 'die Freiheitsmeinung'], 0, '*die Meinung* (l’opinion) + *die Freiheit* (la liberté).'],
            ['Quand l’Union européenne a-t-elle adopté son règlement général sur l’IA ?', ['2016', '2020', '2024', '2030'], 2, 'Le premier cadre juridique général sur l’intelligence artificielle.'],
          ],
        },

        {
          titre: 'Poètes, penseurs, artistes : l’Allemagne de la culture',
          axe: 'Deutsch, Sprache der Dichter, Denker und Künstler',
          lecon: {
            titre: 'Des Lumières à Pina Bausch',
            cours: `Au XIXe siècle se popularise une formule qui fait de l’Allemagne le « pays des poètes et des penseurs » (*Land der Dichter und Denker*), en hommage à Goethe, Schiller et Lessing. La formule est devenue un slogan touristique, mais elle dit un attachement profond à la culture, qui a construit l’identité allemande bien avant l’État.

## Un berceau des Lumières et du romantisme
| Mouvement | Figures | Idée |
| Les Lumières (*Aufklärung*) | Kant, Lessing | « *Sapere aude!* Aie le courage de te servir de ton propre entendement » (Kant, 1784) |
| Le classicisme de Weimar | Goethe, Schiller | l’idéal d’une humanité harmonieuse ; l’*Ode à la joie* de Schiller, mise en musique par Beethoven, est l’hymne européen |
| Le romantisme | Novalis, les frères Grimm, Schubert | le rêve, la nature, les contes, l’infini |

## Le cinéma allemand, de Fritz Lang à Maren Ade
- **Fritz Lang** : *Metropolis* (1927), ville futuriste où les ouvriers vivent sous terre ; *M le maudit* (1931).
- Le **nouveau cinéma allemand** des années 1970 : Fassbinder, Wenders, Herzog.
- Aujourd’hui : **Maren Ade** (*Toni Erdmann*, 2016), et des séries comme *Babylon Berlin* ou *Dark*.

## Le théâtre, théâtre engagé ?
**Bertolt Brecht** invente le **théâtre épique** : au lieu de faire pleurer le spectateur, il veut le faire réfléchir. L’**effet de distanciation** (*Verfremdungseffekt*) — acteurs qui s’adressent au public, pancartes, chansons — rappelle qu’on est au théâtre. On lui attribue l’idée que l’art n’est pas un miroir qui reflète la réalité, mais un marteau qui la façonne. *Mère Courage* (1939) montre une femme qui vit de la guerre et y perd ses enfants.

## La danse, de Pina Bausch à Sasha Waltz
**Pina Bausch** dirige à partir de 1973 le *Tanztheater Wuppertal* : un « théâtre dansé » où les danseurs parlent, rient, répètent les gestes du quotidien. Sa phrase « *Tanzt, tanzt, sonst sind wir verloren* » (dansez, sinon nous sommes perdus) résume son art. **Sasha Waltz** a prolongé ce renouveau depuis Berlin.

> La culture allemande ne se limite pas aux livres : film, scène et danse portent la même exigence de penser le monde.

## Vocabulaire
| Allemand | Français |
| *der Dichter, die Dichterin* | le poète, l’écrivain |
| *der Denker* | le penseur |
| *die Aufklärung* | les Lumières |
| *die Bühne* | la scène |
| *das Theaterstück* | la pièce de théâtre |
| *die Inszenierung* | la mise en scène |`,
          },
          questions: [
            ['Que signifie « Land der Dichter und Denker », formule popularisée au XIXe siècle ?', ['Le pays des princes et des soldats', 'Le pays des poètes et des penseurs', 'Le pays des musiciens et des peintres', 'Le pays des savants et des ingénieurs'], 1, 'Une formule popularisée au XIXe siècle, en hommage à Goethe, Schiller et Lessing.'],
            ['Quelle devise Kant donne-t-il aux Lumières ?', ['Carpe diem', 'Sapere aude', 'Veni, vidi, vici', 'Memento mori'], 1, '« Aie le courage de te servir de ton propre entendement » (1784).'],
            ['Quel texte de Schiller est devenu l’hymne européen ?', ['Les Brigands', 'L’Ode à la joie', 'Guillaume Tell', 'Don Carlos'], 1, 'Mis en musique par Beethoven dans sa 9e symphonie.'],
            ['Qui a réalisé « Metropolis » (1927) ?', ['Fritz Lang', 'Wim Wenders', 'Maren Ade', 'Leni Riefenstahl'], 0, 'Un chef-d’œuvre du cinéma muet expressionniste.'],
            ['Que cherche l’effet de distanciation de Brecht ?', ['Faire pleurer le spectateur', 'Faire réfléchir le spectateur', 'Faire oublier qu’on est au théâtre', 'Divertir sans message'], 1, 'Le *Verfremdungseffekt* rappelle au public qu’il est au théâtre.'],
            ['Quelle pièce de Brecht montre une femme qui vit de la guerre ?', ['L’Opéra de quat’sous', 'Mère Courage et ses enfants', 'Faust', 'Woyzeck'], 1, '*Mutter Courage und ihre Kinder*, 1939.'],
            ['Où Pina Bausch a-t-elle dirigé son Tanztheater ?', ['Berlin', 'Wuppertal', 'Munich', 'Vienne'], 1, 'À Wuppertal, à partir de 1973.'],
            ['Quel film de Maren Ade a été remarqué en 2016 ?', ['Toni Erdmann', 'Good Bye, Lenin!', 'La Vie des autres', 'Cours, Lola, cours'], 0, 'Une comédie grinçante entre un père et sa fille.'],
            ['Les frères Grimm appartiennent au mouvement romantique.', ['Vrai', 'Faux'], 0, 'Leur collecte de contes relève de l’intérêt romantique pour la tradition populaire.'],
            ['Que signifie « die Bühne » ?', ['La scène', 'Le livre', 'Le bureau', 'La fenêtre'], 0, 'On monte *auf die Bühne*, sur scène.'],
            ['Que signifie « die Aufklärung » ?', ['Le romantisme', 'Les Lumières', 'La Réforme', 'Le classicisme'], 1, 'Le mouvement de la raison critique au XVIIIe siècle.'],
            ['Que dit la phrase « Tanzt, tanzt, sonst sind wir verloren » ?', ['Dansez, sinon nous sommes perdus', 'Nous avons perdu la danse', 'Dansez moins fort', 'La danse est finie'], 0, 'La devise de Pina Bausch.'],
          ],
        },
      ],
    },

    // =====================================================================
    // RAYON LANGUE — repères B2 de la Terminale
    // =====================================================================
    {
      niveaux: ['Tle'],
      positionDepart: 43,
      rayon: 'langue',
      chapitres: [
        {
          titre: 'Le subjonctif I et le discours rapporté',
          axe: 'Les temps',
          lecon: {
            titre: 'Er sagte, er sei krank : rapporter sans prendre parti',
            cours: `Dans un article de presse, *Der Minister sagte, er habe nichts gewusst* ne veut pas seulement dire « il a dit qu’il ne savait rien » : le journaliste signale qu’il **rapporte** ces paroles sans les garantir. C’est le rôle du **subjonctif I**.

## La formation
Radical de l’infinitif + terminaisons *-e, -est, -e, -en, -et, -en*. Dans la presse, c’est surtout la **3e personne** qui sert.
| Infinitif | er / sie / es | sie (pluriel) |
| *sein* | *sei* | *seien* |
| *haben* | *habe* | (*haben* = indicatif → *hätten*) |
| *werden* | *werde* | (*werden* → *würden*) |
| *kommen* | *komme* | (*kommen* → *kämen*) |
| *können* | *könne* | (*können* → *könnten*) |
| *wissen* | *wisse* | (*wissen* → *wüssten*) |

> Quand le subjonctif I est identique à l’indicatif (souvent au pluriel), on le remplace par le **subjonctif II** : *Sie sagen, sie hätten keine Zeit.*

*sein* a une conjugaison complète et irrégulière : *ich sei, du sei(e)st, er sei, wir seien, ihr seiet, sie seien*.

## Les trois temps du discours rapporté
| Paroles d’origine | Discours rapporté |
| *Ich bin krank.* | *Er sagt, er sei krank.* (présent) |
| *Ich war krank / bin krank gewesen.* | *Er sagt, er sei krank gewesen.* (passé) |
| *Ich werde kommen.* | *Er sagt, er werde kommen.* (futur) |

Le temps du subjonctif ne dépend **pas** du verbe introducteur : *Er sagte, er sei krank*. Le passé rapporté se forme toujours avec *habe / sei* + participe.

## Les autres marqueurs du discours rapporté
| Marqueur | Exemple | Français |
| *laut* + dat./gén. | *Laut der Polizei gab es drei Verletzte.* | Selon la police… |
| *nach* + dat. (souvent après le nom) | *Seiner Meinung nach…* | Selon lui… |
| *angeblich* | *Er ist angeblich krank.* | Il serait malade (à ce qu’on dit). |
| *sollen* | *Er soll sehr reich sein.* | On dit qu’il est très riche. |
| *wollen* | *Er will nichts gesehen haben.* | Il prétend n’avoir rien vu. |

## Exemple travaillé
Paroles : « *Wir haben alles richtig gemacht und werden weiterkämpfen.* »
1. *haben* au pluriel = indicatif → subjonctif II : *hätten*.
2. *werden* au pluriel = indicatif → *würden*.
3. *Die Sprecherin erklärte, sie hätten alles richtig gemacht und würden weiterkämpfen.*

## Reconnaître suffit souvent
Au bac, on te demande surtout de **repérer** le subjonctif I pour comprendre qu’une information est rapportée, voire contestée. Le traduire par « selon lui », « aurait » ou « affirme que » rend cette distance.`,
          },
          questions: [
            ['Quel est le subjonctif I de « er ist » ?', ['er wäre', 'er sei', 'er war', 'er seie'], 1, '*sein* au subjonctif I : *er sei*.'],
            ['À quoi sert principalement le subjonctif I ?', ['À exprimer un souhait irréel', 'À rapporter des paroles sans les garantir', 'À donner un ordre', 'À raconter au passé'], 1, 'C’est le mode du discours indirect, surtout dans la presse.'],
            ['Pourquoi écrit-on « Sie sagen, sie hätten keine Zeit » et non « sie haben » ?', ['Par politesse', 'Parce que le subjonctif I se confond avec l’indicatif', 'Parce que c’est au passé', 'C’est une faute'], 1, 'On passe au subjonctif II quand le subjonctif I ne se distingue pas.'],
            ['Comment rapporter « Ich war krank » ?', ['Er sagt, er war krank.', 'Er sagt, er sei krank gewesen.', 'Er sagt, er wäre krank.', 'Er sagt, er habe krank.'], 1, 'Le passé rapporté : *sei* + participe *gewesen*.'],
            ['« Er soll sehr reich sein » signifie…', ['Il doit être riche (obligation)', 'On dit qu’il est très riche', 'Il veut être riche', 'Il deviendra riche'], 1, '*sollen* rapporte une rumeur.'],
            ['« Er will nichts gesehen haben » signifie…', ['Il ne veut rien voir', 'Il prétend n’avoir rien vu', 'Il n’a rien vu', 'Il voudrait voir'], 1, '*wollen* : le sujet prétend quelque chose, le locuteur en doute.'],
            ['Quel est le subjonctif I de « er kann » ?', ['er könne', 'er könnte', 'er kanne', 'er konnte'], 0, 'Radical de l’infinitif + *-e* : *könne*.'],
            ['Le temps du subjonctif I dépend du temps du verbe introducteur.', ['Vrai', 'Faux'], 1, '*Er sagte, er sei krank* : le verbe introducteur au prétérit n’impose rien.'],
            ['« ___ der Polizei gab es drei Verletzte. » Quel mot signifiant « selon » complète la phrase ?', ['Laut', 'Wegen', 'Trotz', 'Statt'], 0, '*laut* + datif ou génitif : selon.', 'Quel mot introduit la source d’une information ?'],
            ['Comment rapporter « Ich werde kommen » ?', ['Er sagt, er werde kommen.', 'Er sagt, er wird gekommen.', 'Er sagt, er komme gewesen.', 'Er sagt, er würde gekommen sein.'], 0, 'Futur rapporté : *werde* + infinitif.'],
            ['Que signifie « angeblich » ?', ['Certainement', 'Soi-disant, à ce qu’on prétend', 'Heureusement', 'Évidemment'], 1, 'Il marque la distance du locuteur.'],
            ['Quel est le subjonctif I de « sie (pluriel) sind » ?', ['sie wären', 'sie seien', 'sie sein', 'sie sind'], 1, '*sein* a des formes propres au pluriel : *seien*.'],
          ],
        },

        {
          titre: 'Le double infinitif',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Ich habe kommen müssen : quand le participe devient infinitif',
            cours: `*Brecht hat die dänische Sprache nicht lernen wollen.* Deux infinitifs à la suite, et aucun participe : c’est le **double infinitif**, une construction propre à l’allemand, fréquente dès qu’un modal passe au parfait.

## La règle
Au parfait (et aux autres temps composés), un **verbe de modalité** accompagné d’un infinitif ne prend **pas** son participe (*gemusst, gekonnt…*) : il reste à l’**infinitif**.
| Présent | Parfait |
| *Ich muss arbeiten.* | *Ich habe arbeiten müssen.* |
| *Er kann nicht kommen.* | *Er hat nicht kommen können.* |
| *Wir wollen helfen.* | *Wir haben helfen wollen.* |

> Modal **seul** : participe (*Ich habe es gemusst*). Modal **avec un infinitif** : double infinitif (*Ich habe es machen müssen*). L’auxiliaire est toujours *haben*.

## Les autres verbes concernés
*lassen* (faire faire, laisser), et souvent *sehen*, *hören*, *helfen* :
- *Ich habe mein Fahrrad reparieren lassen.* (j’ai fait réparer mon vélo)
- *Ich habe ihn kommen sehen.* (je l’ai vu venir)

## Aux autres temps composés
| Temps | Exemple |
| Plus-que-parfait | *Er hatte nicht kommen können.* |
| Subjonctif II passé | *Du hättest mich anrufen sollen.* (tu aurais dû m’appeler) |
| Futur | *Wir werden warten müssen.* |

Le subjonctif II passé avec double infinitif est très utile pour le **reproche** et le **regret** : *Ich hätte mehr lernen sollen.*

## Dans la subordonnée : l’exception de place
Normalement, le verbe conjugué va à la fin de la subordonnée. Avec un double infinitif, l’auxiliaire conjugué se place **devant** les deux infinitifs :
- *…, weil ich* **habe** *arbeiten müssen.* (et non *arbeiten müssen habe*)
- *…, dass er es* **hätte** *wissen können.*

C’est la seule exception à la règle du verbe final : un détail qui distingue une copie de niveau B2.

## Exemple travaillé
« Il a dû partir parce qu’il n’avait pas pu trouver de logement. »
1. *devoir partir* au parfait : *hat gehen müssen*.
2. *ne pas pouvoir trouver* au plus-que-parfait, dans une subordonnée : *weil er … keine Wohnung hatte finden können*.
3. *Er hat gehen müssen, weil er keine Wohnung hatte finden können.*`,
          },
          questions: [
            ['Comment dit-on « j’ai dû travailler » ?', ['Ich habe arbeiten gemusst.', 'Ich habe arbeiten müssen.', 'Ich bin arbeiten müssen.', 'Ich musste gearbeitet.'], 1, 'Modal avec infinitif au parfait : double infinitif.'],
            ['Quand emploie-t-on le participe « gekonnt » ?', ['Toujours au parfait', 'Quand le modal est employé seul, sans infinitif', 'Dans une subordonnée', 'Jamais'], 1, '*Ich habe es gekonnt* : modal sans infinitif.'],
            ['Quel auxiliaire utilise-t-on avec le double infinitif ?', ['sein', 'haben', 'werden', 'Selon le verbe'], 1, 'Toujours *haben*.'],
            ['Comment dit-on « j’ai fait réparer mon vélo » ?', ['Ich habe mein Fahrrad reparieren lassen.', 'Ich habe mein Fahrrad repariert gelassen.', 'Ich habe mein Fahrrad lassen repariert.', 'Ich ließ mein Fahrrad repariert.'], 0, '*lassen* suit la même règle que les modaux.'],
            ['Dans une subordonnée, où se place l’auxiliaire avec un double infinitif ?', ['À la toute fin', 'Devant les deux infinitifs', 'Juste après la conjonction', 'Entre les deux infinitifs'], 1, '*…, weil ich habe arbeiten müssen.*'],
            ['« Du hättest mich anrufen ___. » Quel mot complète la phrase ?', ['gesollt', 'sollen', 'sollte', 'soll'], 1, 'Subjonctif II passé avec double infinitif : *hättest … anrufen sollen*.', 'Quelle forme de sollen termine la phrase ?'],
            ['Quelle subordonnée est correcte ?', ['…, weil er nicht kommen können hat.', '…, weil er nicht hat kommen können.', '…, weil er hat nicht kommen können.', '…, weil er nicht kommen hat können.'], 1, 'L’auxiliaire précède le bloc des deux infinitifs.'],
            ['« Ich hätte mehr lernen sollen » exprime…', ['un projet', 'un regret', 'une obligation présente', 'une permission'], 1, 'Subjonctif II passé : j’aurais dû.'],
            ['On dit « Ich habe es gemusst » quand le modal n’est suivi d’aucun infinitif.', ['Vrai', 'Faux'], 0, 'Sans infinitif, le modal prend son participe.'],
            ['Comment dit-on « Brecht n’a pas voulu apprendre le danois » ?', ['Brecht hat die dänische Sprache nicht lernen wollen.', 'Brecht hat die dänische Sprache nicht gelernt gewollt.', 'Brecht ist die dänische Sprache nicht lernen wollen.', 'Brecht wollte die dänische Sprache nicht gelernt haben.'], 0, 'Double infinitif : *lernen wollen*, auxiliaire *hat*.'],
            ['Quel est le plus-que-parfait de « Er kann nicht kommen » ?', ['Er hatte nicht kommen können.', 'Er war nicht kommen können.', 'Er hatte nicht gekommen gekonnt.', 'Er konnte nicht gekommen.'], 0, '*hatte* + double infinitif.'],
            ['« Ich habe ihn kommen sehen » signifie…', ['Je l’ai vu venir', 'Je l’ai fait venir', 'Je voulais qu’il vienne', 'Il m’a vu venir'], 0, '*sehen* + infinitif se construit souvent en double infinitif.'],
          ],
        },

        {
          titre: 'Le groupe participial épithète',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Die von den Nazis verbannten Künstler : lire un nom qui arrive tard',
            cours: `*Die von dem nationalsozialistischen Staat verbannten Künstler* : l’article *die* annonce un nom… qui n’arrive que six mots plus loin. Entre les deux, tout un groupe s’est glissé. C’est le **groupe participial épithète**, typique de l’allemand écrit (presse, histoire, science).

## Les deux participes
| Participe | Formation | Sens | Exemple |
| **Participe I** | infinitif + **d** | actif, action **en cours** | *die blühende Landschaft* (le paysage en fleurs, qui fleurit) |
| **Participe II** | *ge-…-t / ge-…-en* | passif ou **accompli** | *die verbannten Künstler* (les artistes bannis) |

Employés devant un nom, ils se déclinent **comme des adjectifs épithètes** : *ein schlafendes Kind*, *mit der gestohlenen Tasche*.

## Le groupe étendu
Le participe peut être précédé de ses propres compléments, placés **entre l’article et le nom** :
| Groupe participial | Traduction par une relative |
| *die im Frühling blühende Landschaft* | le paysage **qui fleurit** au printemps |
| *die von den Nazis verbannten Künstler* | les artistes **qui avaient été bannis** par les nazis |
| *das 1949 verabschiedete Grundgesetz* | la Loi fondamentale **adoptée** en 1949 |

> La méthode tient en trois gestes : repérer l’article, sauter jusqu’au participe et au **nom qui le suit**, puis relire le reste comme une relative.

## Méthode de lecture
1. Un article (*die*, *das*, *ein*…) est suivi d’une préposition ou d’un complément, au lieu d’un nom : alerte.
2. Cherche le **participe** décliné juste avant un **nom** : *verbannten Künstler*.
3. Traduis d’abord le groupe nominal : « les artistes bannis ».
4. Ajoute les compléments : « … par le régime nazi ».

## Transformer en relative (et l’inverse)
- *Die Künstler, die von den Nazis verbannt wurden, …* → *Die von den Nazis verbannten Künstler …*
- *Die Zahl der Menschen, die in Armut leben, steigt.* → *Die Zahl der in Armut lebenden Menschen steigt.*

La relative est plus claire à l’oral ; le groupe participial plus dense à l’écrit.

## zu + participe I : ce qui doit être fait
*die zu lösende Aufgabe* = la tâche **à résoudre**, qui doit être résolue. *Ein nicht zu unterschätzendes Problem* = un problème à ne pas sous-estimer.

## Exemple travaillé
*Die seit Jahren steigenden Mieten in den Großstädten sind ein großes Problem.*
1. *Die* … *Mieten* : les loyers.
2. *steigenden* : participe I, qui augmentent.
3. *seit Jahren* : depuis des années.
4. « Les loyers qui augmentent depuis des années dans les grandes villes sont un gros problème. »`,
          },
          questions: [
            ['Comment se forme le participe I ?', ['ge- + radical + t', 'infinitif + d', 'radical + end', 'zu + infinitif'], 1, '*blühen* → *blühend*, *lesen* → *lesend*.'],
            ['Que signifie « die blühende Landschaft » ?', ['Le paysage fleuri il y a longtemps', 'Le paysage en fleurs', 'Le paysage à fleurir', 'Le paysage fané'], 1, 'Le participe I exprime une action en cours, active.'],
            ['Dans « die von den Nazis verbannten Künstler », quel est le nom noyau ?', ['Nazis', 'Künstler', 'verbannten', 'von'], 1, 'L’article *die* annonce *Künstler*, placé à la fin du groupe.'],
            ['Quelle relative équivaut à « die im Frühling blühende Landschaft » ?', ['die Landschaft, die im Frühling blüht', 'die Landschaft, die im Frühling geblüht wurde', 'die Landschaft, die im Frühling blühen muss', 'die Landschaft, der im Frühling blüht'], 0, 'Participe I actif → relative à l’actif.'],
            ['Le participe II employé comme épithète a en général un sens…', ['actif et en cours', 'passif ou accompli', 'futur', 'impératif'], 1, '*die gestohlene Tasche* : le sac qui a été volé.'],
            ['Un participe épithète se décline comme un adjectif.', ['Vrai', 'Faux'], 0, '*ein schlafendes Kind*, *mit der gestohlenen Tasche*.'],
            ['Que signifie « die zu lösende Aufgabe » ?', ['La tâche résolue', 'La tâche à résoudre', 'La tâche qui résout', 'La tâche impossible'], 1, '*zu* + participe I : ce qui doit être fait.'],
            ['Traduis « das 1949 verabschiedete Grundgesetz ».', ['La Loi fondamentale qui adoptera en 1949', 'La Loi fondamentale adoptée en 1949', 'La Loi fondamentale abolie en 1949', 'La Loi fondamentale adoptant 1949'], 1, '*verabschiedet* : participe II, adoptée.'],
            ['« Die Zahl der in Armut ___ Menschen steigt. » Quel participe complète la phrase ?', ['lebenden', 'gelebten', 'lebende', 'lebend'], 0, 'Participe I décliné après l’article *der* (génitif pluriel) : *lebenden*.', 'Quelle forme de leben avant Menschen ?'],
            ['Quel indice signale un groupe participial épithète ?', ['Un article suivi d’un verbe conjugué', 'Un article suivi d’une préposition ou d’un complément au lieu d’un nom', 'Une virgule', 'Un point d’exclamation'], 1, 'L’article attend son nom, qui arrive plus loin.'],
            ['Que signifie « ein nicht zu unterschätzendes Problem » ?', ['Un problème sous-estimé', 'Un problème à ne pas sous-estimer', 'Un problème mineur', 'Un problème résolu'], 1, '*nicht zu* + participe I : qu’il ne faut pas…'],
            ['« die seit Jahren steigenden Mieten » signifie…', ['les loyers qui ont baissé', 'les loyers qui augmentent depuis des années', 'les loyers à augmenter', 'les loyers de l’an dernier'], 1, '*steigend* : participe I de *steigen*, augmenter.'],
          ],
        },

        {
          titre: 'Les pronoms indéfinis : irgend-, nirgend-, jemand, niemand',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Quelqu’un, n’importe qui, nulle part',
            cours: `« Quelqu’un a appelé », « n’importe quand », « nulle part » : pour parler de personnes, de choses ou de lieux indéterminés, l’allemand dispose d’une famille de pronoms, et le préfixe **irgend-** en est la clé.

## irgend- : le « n’importe quel » allemand
*irgend-* ajoute l’idée d’**indétermination** : peu importe qui, quoi, où.
| Forme | Sens | Exemple |
| *irgendwer* / *irgendjemand* | quelqu’un, n’importe qui | *Irgendwer hat angerufen.* |
| *irgendetwas* | quelque chose, n’importe quoi | *Sag irgendetwas!* |
| *irgendwo* | quelque part | *Mein Handy liegt irgendwo.* |
| *irgendwann* | un jour, à un moment | *Irgendwann schaffe ich das.* |
| *irgendwie* | d’une manière ou d’une autre | *Irgendwie geht es.* |
| *irgendein(e)* | un … quelconque | *Irgendein Schüler weiß es.* |
| *irgendeiner* | l’un quelconque (pronom) | *Irgendeiner muss es tun.* |

## nirgend- et les négatifs
| Positif | Négatif |
| *jemand* (quelqu’un) | *niemand* (personne) |
| *etwas* (quelque chose) | *nichts* (rien) |
| *irgendwo* (quelque part) | *nirgendwo, nirgends* (nulle part) |
| *irgendwann* (un jour) | *nie, niemals* (jamais) |
| *irgendein* | *kein* |

> L’allemand n’emploie **qu’une** négation : *Ich habe niemanden gesehen* (je n’ai vu personne). Jamais *nicht niemand*.

## La déclinaison de jemand / niemand
| Cas | Forme |
| Nominatif | *jemand, niemand* |
| Accusatif | *jemand(en), niemand(en)* |
| Datif | *jemand(em), niemand(em)* |

*Ich habe mit niemandem gesprochen.* À l’oral, la terminaison tombe souvent (*mit niemand*).

## etwas / nichts + adjectif substantivé
Après *etwas*, *nichts*, *viel*, *wenig*, l’adjectif devient un **nom neutre** avec majuscule et terminaison *-es* : *etwas Neues* (quelque chose de nouveau), *nichts Besonderes* (rien de spécial), *viel Gutes*.

## Les autres indéfinis utiles
*man* (on : *einen* à l’accusatif, *einem* au datif), *jeder* (chacun), *alle* (tous), *manche* (certains), *einige* (quelques-uns), *mehrere* (plusieurs).

## Exemple travaillé
« Quelqu’un a dû le voir quelque part, mais personne ne dit rien de précis. »
1. *Irgendjemand muss ihn irgendwo gesehen haben.*
2. *aber niemand sagt etwas Genaues.*
3. Remarque : « ne … rien de précis » après *niemand* devient *etwas Genaues*, une seule négation suffit.`,
          },
          questions: [
            ['Que signifie « irgendwo » ?', ['Nulle part', 'Quelque part', 'Partout', 'Ici'], 1, '*irgend-* + *wo* : un lieu indéterminé.'],
            ['Comment dit-on « nulle part » ?', ['irgendwo', 'nirgendwo', 'niemals', 'nirgendwann'], 1, '*nirgendwo* ou *nirgends*.'],
            ['Quelle phrase est correcte pour « je n’ai vu personne » ?', ['Ich habe nicht niemanden gesehen.', 'Ich habe niemanden gesehen.', 'Ich habe nicht jemand gesehen.', 'Ich habe kein jemand gesehen.'], 1, 'Une seule négation : *niemanden*.'],
            ['Que signifie « irgendwann » ?', ['Jamais', 'Un jour, à un moment', 'Toujours', 'Maintenant'], 1, '*Irgendwann schaffe ich das* : un jour, j’y arriverai.'],
            ['Comment dit-on « quelque chose de nouveau » ?', ['etwas neu', 'etwas Neues', 'etwas neues', 'etwas Neue'], 1, 'Adjectif substantivé neutre : majuscule et *-es*.'],
            ['« Ich habe mit ___ gesprochen. » (personne) Quelle forme complète la phrase ?', ['niemand', 'niemanden', 'niemandem', 'niemandes'], 2, '*mit* + datif : *niemandem*.', 'Quelle forme de niemand après mit ?'],
            ['Que signifie « irgendwie » ?', ['D’une manière ou d’une autre', 'Nulle part', 'Pourquoi', 'Comme toujours'], 0, 'Une manière indéterminée.'],
            ['« Irgendein Schüler weiß es » signifie…', ['Aucun élève ne le sait', 'Un élève quelconque le sait', 'Chaque élève le sait', 'Un seul élève le sait'], 1, '*irgendein* : un … quelconque.'],
            ['En allemand, on peut cumuler deux négations comme « nicht » et « niemand ».', ['Vrai', 'Faux'], 1, 'Une seule négation par idée : *niemand* suffit.'],
            ['Quel est le datif de « man » ?', ['man', 'einen', 'einem', 'mans'], 2, '*man* → *einen* (acc.) → *einem* (dat.).'],
            ['Comment dit-on « rien de spécial » ?', ['nichts Besonderes', 'nicht besonders', 'nichts besondere', 'kein Besonderes'], 0, '*nichts* + adjectif substantivé neutre.'],
            ['Quel mot est l’opposé de « irgendwann » ?', ['nirgends', 'nie', 'nichts', 'niemand'], 1, 'Un jour ↔ jamais.'],
          ],
        },

        {
          titre: 'Exprimer le moyen et la manière : indem, dadurch dass, ohne dass',
          axe: 'La phrase',
          lecon: {
            titre: 'En faisant, sans faire, au lieu de faire',
            cours: `« On apprend une langue **en lisant** beaucoup » : le gérondif français exprime le **moyen**. L’allemand n’a pas de gérondif ; il le remplace par des subordonnées, dont la plus importante est **indem**.

## indem : le moyen
*indem* + verbe **à la fin** répond à la question *wie?* (comment ?). Sujet identique dans les deux propositions.
- *Man lernt eine Sprache, indem man viel liest.* — On apprend une langue en lisant beaucoup.
- *Indem wir weniger Auto fahren, schützen wir das Klima.* — En roulant moins, nous protégeons le climat.

> *indem* traduit le gérondif de **moyen** ; *beim* + infinitif traduit le gérondif de **simultanéité** (*beim Essen* = en mangeant). Ne pas confondre.

## Les autres sens de indem
Au niveau B2, on rencontre aussi *indem* avec une nuance de **concomitance** (pendant que, en même temps) ou de **cause**, surtout dans les textes littéraires : *Er grüßte, indem er den Hut zog.* Le sens principal reste le moyen.

## dadurch, dass… : insister sur le moyen
*dadurch* annonce la subordonnée en *dass* ; la phrase met l’accent sur le moyen, et les sujets peuvent être différents :
*Die Stadt hat die Luftqualität dadurch verbessert, dass sie den Verkehr begrenzt hat.* — La ville a amélioré la qualité de l’air en limitant la circulation.
La préposition *durch* + acc. dit la même chose sans verbe : *durch viel Lesen*.

## Sans faire, au lieu de faire
| Sujet identique | Sujets différents | Sens |
| *ohne … zu* | *ohne dass* | sans (que) |
| *(an)statt … zu* | *(an)statt dass* | au lieu de (que) |

- *Er ging, ohne ein Wort zu sagen.* — Il partit sans dire un mot.
- *Er ging, ohne dass ich es merkte.* — Il partit sans que je m’en aperçoive.
- *Statt zu lernen, spielt er.* — Au lieu de travailler, il joue.

## Poser la question du moyen
*Wie?* / *Womit?* / *Wodurch?* : *Wodurch hat sich die Stadt verändert?* — *Dadurch, dass viele Menschen zugezogen sind.*

## Exemple travaillé
« On peut lutter contre les infox en vérifiant les sources, sans croire tout ce qu’on lit. »
1. Moyen, même sujet : *indem man die Quellen überprüft*.
2. « sans + infinitif », même sujet : *ohne alles zu glauben, was man liest*.
3. *Man kann Fake News bekämpfen, indem man die Quellen überprüft, ohne alles zu glauben, was man liest.*`,
          },
          questions: [
            ['Que traduit « indem » le plus souvent ?', ['Le but', 'Le moyen (en + gérondif)', 'La cause', 'Le temps passé'], 1, '*Man lernt, indem man liest* : en lisant.'],
            ['Où se place le verbe conjugué après « indem » ?', ['En 2e position', 'À la fin', 'En 1re position', 'Juste après indem'], 1, '*indem* est un subordonnant.'],
            ['Comment traduire « en mangeant » (simultanéité) ?', ['indem man isst', 'beim Essen', 'ohne zu essen', 'dadurch essen'], 1, '*beim* + infinitif pour la simultanéité ; *indem* pour le moyen.'],
            ['Comment dit-on « il partit sans dire un mot » ?', ['Er ging, ohne ein Wort zu sagen.', 'Er ging, ohne dass ein Wort sagen.', 'Er ging, ohne sagen ein Wort.', 'Er ging, indem er kein Wort sagte zu.'], 0, 'Même sujet : *ohne … zu*.'],
            ['Quand emploie-t-on « ohne dass » plutôt que « ohne … zu » ?', ['Quand les sujets sont différents', 'Au passé seulement', 'À l’oral seulement', 'Jamais'], 0, '*Er ging, ohne dass ich es merkte.*'],
            ['« Statt zu lernen, spielt er » signifie…', ['Pour apprendre, il joue', 'Au lieu de travailler, il joue', 'Après avoir travaillé, il joue', 'Il joue en apprenant'], 1, '*(an)statt … zu* : au lieu de.'],
            ['Dans « dadurch, dass… », que fait « dadurch » ?', ['Il annonce une subordonnée de moyen', 'Il exprime le temps', 'Il remplace une personne', 'Il marque une opposition'], 0, 'Il met l’accent sur le moyen exprimé par la subordonnée.'],
            ['« Man lernt eine Sprache, indem man viel ___. » Quelle forme complète la phrase ?', ['liest', 'lesen', 'gelesen', 'lese'], 0, 'Verbe conjugué à la fin : *liest*.', 'Quelle forme de lesen termine la subordonnée ?'],
            ['Avec « indem », les deux propositions ont en général le même sujet.', ['Vrai', 'Faux'], 0, 'Comme le gérondif français.'],
            ['Quelle question porte sur le moyen ?', ['Wodurch?', 'Wann?', 'Wo?', 'Wem?'], 0, '*Wodurch?* ou *Wie?* : par quel moyen ?'],
            ['Que signifie « durch viel Lesen » ?', ['Malgré beaucoup de lecture', 'Par beaucoup de lecture', 'Pendant la lecture', 'Sans lire'], 1, '*durch* + accusatif exprime le moyen.'],
            ['Quelle phrase exprime le moyen ?', ['Beim Lesen höre ich Musik.', 'Indem wir weniger Auto fahren, schützen wir das Klima.', 'Während ich lese, schläft er.', 'Bevor ich lese, esse ich.'], 1, 'En roulant moins : moyen.'],
          ],
        },

        {
          titre: 'Les particules modales : ja, doch, wohl, bloß, mal',
          axe: 'La phrase',
          lecon: {
            titre: 'Les petits mots qui disent l’implicite',
            cours: `*Das ist ja interessant!* — *Komm doch mit!* — *Er ist wohl krank.* Ces petits mots ne changent pas l’information, mais le **ton** : évidence, insistance, supposition, agacement. Les comprendre, c’est accéder à l’**implicite** d’un texte ou d’un dialogue.

## Les principales particules
| Particule | Ce qu’elle ajoute | Exemple | Nuance en français |
| *ja* | une évidence partagée, ou la surprise | *Sie wissen ja, dass…* · *Das ist ja toll!* | vous savez bien que… · mais c’est génial ! |
| *doch* | l’insistance, le rappel, l’invitation | *Komm doch mit!* · *Das weißt du doch!* | viens donc ! · tu le sais bien ! |
| *wohl* | la supposition | *Er ist wohl krank.* | il est sans doute malade |
| *bloß*, *nur* | l’avertissement, le souhait | *Mach das bloß nicht!* · *Wenn ich bloß Zeit hätte!* | surtout ne fais pas ça ! · si seulement… |
| *mal* | adoucit une demande | *Komm mal her!* | viens voir |
| *eben*, *halt* | la résignation, c’est comme ça | *Das ist eben so.* | c’est comme ça |
| *denn* | intérêt dans une question | *Was ist denn los?* | qu’est-ce qui se passe donc ? |
| *eigentlich* | nouvelle orientation, « au fait » | *Wie heißt du eigentlich?* | au fait, comment tu t’appelles ? |

> Une particule modale n’est jamais accentuée et se place au milieu de la phrase, après le verbe conjugué et les pronoms. Accentuée, elle change de sens : *DOCH!* est une réponse (si !).

## Une même phrase, plusieurs tons
| Phrase | Ton |
| *Das ist teuer.* | constat neutre |
| *Das ist ja teuer!* | surprise |
| *Das ist doch teuer!* | reproche : je te l’avais dit |
| *Das ist wohl teuer.* | supposition |
| *Das ist eben teuer.* | résignation |

## Dans un commentaire de texte
Repérer une particule permet d’interpréter l’**attitude** du personnage : *Seine Reaktion war ja zu erwarten* (sa réaction était, bien sûr, prévisible) montre que le narrateur n’est pas surpris, voire ironique. Dans un dialogue, *doch* signale souvent un conflit ou une insistance.

## Les utiliser à l’oral, avec mesure
- Pour être poli : *Könnten Sie mir mal helfen?*
- Pour encourager : *Versuch es doch!*
- Pour conclure : *Das ist halt so.*

Mais trop de particules à l’écrit formel alourdissent le texte : on les réserve au dialogue et à l’oral.

## Traduire ou non ?
Souvent, on ne les traduit pas mot à mot : on rend le **ton** (« donc », « bien », « sans doute », « surtout », « au fait ») ou l’intonation.`,
          },
          questions: [
            ['Que signifie « Er ist wohl krank » ?', ['Il est très malade', 'Il est sans doute malade', 'Il n’est pas malade', 'Il est bien malade (c’est certain)'], 1, '*wohl* marque la supposition.'],
            ['« Komm doch mit! » est…', ['un ordre sec', 'une invitation insistante', 'un refus', 'une question'], 1, '*doch* adoucit et insiste : viens donc avec nous !'],
            ['Quelle particule exprime une évidence partagée ?', ['ja', 'mal', 'bloß', 'denn'], 0, '*Sie wissen ja…* : vous le savez bien.'],
            ['Que signifie « Mach das bloß nicht! » ?', ['Fais-le seulement', 'Surtout ne fais pas ça !', 'Fais-le vite', 'Tu ne l’as pas fait'], 1, '*bloß* renforce un avertissement.'],
            ['« Das ist eben so » exprime…', ['la surprise', 'la résignation', 'la colère', 'la supposition'], 1, '*eben* / *halt* : c’est comme ça, on n’y peut rien.'],
            ['Dans « Was ist denn los? », « denn » signifie…', ['car', 'donc, marque l’intérêt dans la question', 'alors, conséquence', 'mais'], 1, 'Particule de question, sans valeur de cause.'],
            ['Une particule modale est normalement accentuée.', ['Vrai', 'Faux'], 1, 'Elle est inaccentuée ; accentuée, elle change de sens.'],
            ['Que signifie « Wie heißt du eigentlich? » ?', ['Au fait, comment tu t’appelles ?', 'Comment tu t’appelles vraiment, officiellement ?', 'Tu t’appelles comment déjà, encore ?', 'Pourquoi tu t’appelles ainsi ?'], 0, '*eigentlich* ouvre une nouvelle orientation : au fait.'],
            ['Quelle phrase exprime un reproche (je te l’avais dit) ?', ['Das ist ja teuer!', 'Das ist doch teuer!', 'Das ist wohl teuer.', 'Das ist mal teuer.'], 1, '*doch* rappelle ce que l’autre aurait dû savoir.'],
            ['Que fait « mal » dans « Komm mal her! » ?', ['Il exprime la répétition', 'Il adoucit la demande', 'Il exprime la négation', 'Il indique le passé'], 1, '*mal* rend la demande plus familière et moins brusque.'],
            ['« Wenn ich bloß Zeit hätte! » exprime…', ['un souhait', 'un ordre', 'un constat', 'un reproche'], 0, 'Si seulement j’avais le temps !'],
            ['Dans « Seine Reaktion war ja zu erwarten », que montre « ja » ?', ['Que le narrateur est surpris', 'Que la réaction était prévisible pour tous', 'Que la réaction est niée', 'Une question'], 1, 'Évidence partagée : bien sûr, on s’y attendait.'],
          ],
        },
      ],
    },
  ],
}
