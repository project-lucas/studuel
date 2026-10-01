// Allemand 3e — ce qui est PROPRE à la 3e, en plus des 36 fiches de grammaire.
//
// CONSTAT (extraction du 26/09/2026) : la 3e, la 2de, la 1re et la Tle avaient
// EXACTEMENT les mêmes 36 fiches de langue. Un élève de 3e ne trouvait rien de
// la culture du cycle 4, ni les savoir-faire de niveau A2 qui ne relèvent pas
// d'un chapitre de grammaire (l'heure, les nombres, les mots composés, raconter
// dans l'ordre, écrire un message, donner son avis).
//
// LE PROGRAMME EN VIGUEUR EN 3e À LA RENTRÉE 2026 : celui du cycle 4 (BO
// spécial n° 11 du 26 novembre 2015, ajusté au BO n° 31 du 30 juillet 2020).
// Le nouveau programme de LV (arrêté du 5 mai 2025, BO n° 22 du 29 mai 2025)
// n'atteint la 3e qu'à la rentrée 2028 (article 4 de l'arrêté). Ses quatre
// thèmes culturels, communs à toutes les langues : « Langages », « École et
// société », « Voyages et migrations », « Rencontres avec d'autres cultures ».
// Niveau visé en fin de 3e : A2 (LV2), B1 (LV1).
//
// Deux blocs : le rayon 'culture' (un thème = une fiche), puis le rayon
// 'langue' (5 fiches A2). Les 36 fiches existantes occupent les positions 1 à
// 36 ; on range derrière (37 → 45).
//
// Convention de la maison : la langue s'interroge EN FRANÇAIS ; l'allemand est
// cité en exemple.

export default {
  slug: 'allemand',
  nom: 'Allemand',

  titreMigration: 'ALLEMAND 3e — THÈMES CULTURELS DU CYCLE 4 ET LANGUE A2',

  motif: `CONSTAT : la 3e, la 2de, la 1re et la Tle d'allemand portaient exactement
les mêmes 36 fiches de grammaire. Un élève de 3e ne trouvait ni la culture de
son programme (cycle 4 : Langages, École et société, Voyages et migrations,
Rencontres avec d'autres cultures) ni les savoir-faire A2 de la vie courante.
Cette migration AJOUTE 9 fiches propres à la 3e — 4 de culture, 5 de langue —
derrière les 36 existantes, sans rien retirer.`,

  blocs: [
    // =====================================================================
    // RAYON CULTURE — les quatre thèmes du cycle 4
    // =====================================================================
    {
      niveaux: ['3e'],
      positionDepart: 37,
      rayon: 'culture',
      chapitres: [
        // ---- Langages ------------------------------------------------------
        {
          titre: 'Une langue, plusieurs pays : l’allemand et ses variantes',
          axe: 'Langages',
          lecon: {
            titre: 'Hochdeutsch, dialectes et langage des jeunes',
            cours: `L’allemand n’est pas la langue d’un seul pays : c’est la langue maternelle d’environ 100 millions de personnes en Europe, et chacun le parle un peu à sa façon.

## Où parle-t-on allemand ?
| Pays | Statut de l’allemand | Capitale |
| **Allemagne** (*Deutschland*) | Langue officielle | Berlin |
| **Autriche** (*Österreich*) | Langue officielle | Vienne (*Wien*) |
| **Suisse** (*die Schweiz*) | Une des quatre langues nationales, avec le français, l’italien et le romanche | Berne (*Bern*) |
| **Liechtenstein** | Langue officielle | Vaduz |
| **Luxembourg** | Langue officielle, avec le français et le luxembourgeois | Luxembourg |

On l’entend aussi dans l’est de la Belgique et dans le Tyrol du Sud, en Italie. C’est la langue maternelle la plus parlée de l’Union européenne.

## Hochdeutsch et dialectes
L’allemand « standard », celui des journaux, de l’école et de la télévision, s’appelle le *Hochdeutsch*. Mais à la maison, beaucoup parlent un **dialecte** (*der Dialekt*) : le bavarois, le souabe, le saxon, le *Plattdeutsch* du Nord… En Suisse, le *Schwiizerdütsch* est la langue de tous les jours, et le *Hochdeutsch* celle de l’écrit.

| On dit en Allemagne | En Autriche | En Suisse | Sens |
| *Guten Tag* | *Grüß Gott* / *Servus* | *Grüezi* | Bonjour |
| *Tschüss* | *Servus* / *Baba* | *Ciao* / *Uf Widerluege* | Au revoir |
| *das Brötchen* | *die Semmel* | *das Brötli* | le petit pain |
| *die Tomate* | *der Paradeiser* | *die Tomate* | la tomate |

> Parler un dialecte n’est pas « mal parler » : c’est une identité régionale, dont beaucoup sont fiers.

## La langue des jeunes
Comme en français, les ados inventent leurs mots. Chaque année, un éditeur de dictionnaires fait voter le *Jugendwort des Jahres*, le « mot jeune de l’année ».
| Mot | Sens |
| *cool*, *krass* | génial, dingue |
| *Digga* | mon pote |
| *chillen* | se détendre |
| *lost* | à côté de la plaque |

## D’autres langages
Le mot *Langages* du programme ne se limite pas aux langues : la **musique**, l’**image**, les **gestes**, les **emojis** sont aussi des langages. L’Allemagne est le pays de Bach, de Beethoven, mais aussi de groupes pop et rap actuels ; les contes des frères **Grimm** (*Hänsel und Gretel*, *Rotkäppchen*) ont été traduits dans plus de 160 langues.

## Vocabulaire utile
| Allemand | Français |
| *die Sprache* | la langue |
| *die Muttersprache* | la langue maternelle |
| *die Fremdsprache* | la langue étrangère |
| *sprechen, verstehen* | parler, comprendre |
| *zweisprachig* | bilingue |
| *der Wortschatz* | le vocabulaire |

## Expressions pour en parler
- *Ich spreche ein bisschen Deutsch.* — Je parle un peu allemand.
- *Wie sagt man … auf Deutsch?* — Comment dit-on … en allemand ?
- *Kannst du das bitte wiederholen?* — Tu peux répéter, s’il te plaît ?`,
          },
          questions: [
            ['Dans quel pays l’allemand est-il l’une des quatre langues nationales ?', ['En Autriche', 'En Suisse', 'Au Liechtenstein', 'En Allemagne'], 1, 'La Suisse a quatre langues nationales : l’allemand, le français, l’italien et le romanche.'],
            ['Quelle est la capitale de l’Autriche ?', ['Salzbourg', 'Innsbruck', 'Vienne', 'Graz'], 2, 'Vienne, en allemand *Wien*, est la capitale de l’Autriche.'],
            ['Comment appelle-t-on l’allemand standard, celui de l’école et des journaux ?', ['Le Plattdeutsch', 'Le Schwiizerdütsch', 'Le Hochdeutsch', 'Le Dialekt'], 2, 'Le *Hochdeutsch* est l’allemand commun à tous ; les dialectes varient d’une région à l’autre.'],
            ['« Grüß Gott » est une salutation typique…', ['de l’Autriche et du sud de l’Allemagne', 'de Berlin', 'du nord de l’Allemagne', 'de la Suisse romande'], 0, 'On dit *Grüß Gott* en Bavière et en Autriche, régions de tradition catholique.'],
            ['En Suisse alémanique, on dit bonjour avec…', ['Moin', 'Servus', 'Grüezi', 'Hallöchen'], 2, '*Grüezi* est le bonjour suisse ; *Moin* est celui du nord de l’Allemagne.'],
            ['Parler un dialecte, c’est mal parler allemand.', ['Vrai', 'Faux'], 1, 'Un dialecte est une variante régionale de la langue, avec sa grammaire et sa fierté ; ce n’est pas une faute.'],
            ['Que signifie « die Muttersprache » ?', ['La langue étrangère', 'La langue maternelle', 'La langue de la mère patrie', 'Le dialecte'], 1, '*Mutter* = mère, *Sprache* = langue : la langue qu’on a apprise en premier.'],
            ['Un Autrichien appelle la tomate…', ['der Paradeiser', 'die Semmel', 'das Brötli', 'der Erdapfel'], 0, 'En Autriche, la tomate est *der Paradeiser* ; *die Semmel* y désigne le petit pain.'],
            ['Qu’est-ce que le « Jugendwort des Jahres » ?', ['Un prix littéraire pour la jeunesse', 'Le mot jeune de l’année, élu par vote', 'Un dictionnaire scolaire', 'Un concours d’orthographe'], 1, 'Chaque année, un vote désigne le mot le plus représentatif de la langue des jeunes.'],
            ['Comment dit-on « bilingue » en allemand ?', ['zweisprachig', 'doppelsprachig', 'bisprachlich', 'zweisprecher'], 0, '*zwei* = deux, *sprachig* = qui parle une langue : *zweisprachig*.'],
            ['L’allemand est la langue maternelle la plus parlée de l’Union européenne.', ['Vrai', 'Faux'], 0, 'Avec l’Allemagne, l’Autriche, une partie de la Suisse, du Luxembourg et de la Belgique, c’est la première langue maternelle de l’UE.'],
            ['Quelle phrase sert à demander de répéter ?', ['Wie sagt man das?', 'Kannst du das bitte wiederholen?', 'Ich spreche ein bisschen Deutsch.', 'Was ist das?'], 1, '*wiederholen* = répéter. Une phrase clé pour toute conversation.'],
          ],
        },

        // ---- École et société ----------------------------------------------
        {
          titre: 'L’école en Allemagne : un autre rythme',
          axe: 'École et société',
          lecon: {
            titre: 'Une journée, une scolarité, une société',
            cours: `Aller en cours à 7 h 45, finir à 13 h, avoir des notes de 1 à 6 où le 1 est la meilleure : l’école allemande ne ressemble pas tout à fait à la tienne.

## Une journée d’école
Traditionnellement, les cours commencent tôt (vers 7 h 45 ou 8 h) et finissent en début d’après-midi. Mais de plus en plus d’établissements deviennent des **Ganztagsschulen**, des écoles « à la journée », avec cantine et activités l’après-midi. Les heures de cours durent 45 minutes, souvent groupées par deux (*Doppelstunde*).

## Le parcours scolaire
| Âge | École | Équivalent approximatif |
| 3–6 ans | *der Kindergarten* | la maternelle (non obligatoire) |
| 6–10 ans | *die Grundschule* | l’école primaire (4 ans) |
| dès 10 ans | *das Gymnasium* | collège + lycée général, jusqu’à l’*Abitur* |
| dès 10 ans | *die Realschule*, *die Gesamtschule*… | autres filières, selon les Länder |

Après la *Grundschule*, les élèves sont **orientés très tôt**, vers 10 ans. L’éducation relève des **Länder** (les 16 États fédérés) : chaque Land a son propre système, ses propres vacances.

> Le 1er jour d’école, les petits Allemands reçoivent une *Schultüte*, un grand cornet rempli de bonbons et de fournitures.

## Les notes et le bac
| Note | Sens |
| 1 (*sehr gut*) | très bien |
| 2 (*gut*) | bien |
| 3 (*befriedigend*) | assez bien |
| 4 (*ausreichend*) | passable |
| 5 (*mangelhaft*) | insuffisant |
| 6 (*ungenügend*) | très insuffisant |

Le bac allemand s’appelle l’**Abitur** (familièrement *das Abi*). L’**apprentissage** (*die Ausbildung*), qui alterne entreprise et école professionnelle, est très respecté : c’est le célèbre **système dual**.

## École et société
L’école reflète la société : on y apprend la démocratie par les délégués (*die Schülervertretung*), on y débat. Beaucoup d’élèves font aussi partie d’un **club** (*der Verein*) : sport, musique, pompiers volontaires… La vie associative est une part forte de la société allemande.

## Vocabulaire utile
| Allemand | Français |
| *das Fach, die Fächer* | la matière |
| *der Stundenplan* | l’emploi du temps |
| *die Pause* | la récréation |
| *die Hausaufgaben* | les devoirs |
| *die Klassenarbeit* | le contrôle |
| *das Zeugnis* | le bulletin |
| *sitzen bleiben* | redoubler |

## Expressions
- *Mein Lieblingsfach ist Mathe.* — Ma matière préférée, ce sont les maths.
- *Ich habe eine Eins in Deutsch!* — J’ai eu un 1 (la meilleure note) en allemand !
- *Wir haben heute sechs Stunden.* — Nous avons six heures de cours aujourd’hui.`,
          },
          questions: [
            ['En Allemagne, quelle est la meilleure note ?', ['6', '1', '20', '10'], 1, 'Les notes vont de 1 (*sehr gut*) à 6 (*ungenügend*) : 1 est la meilleure.'],
            ['Comment s’appelle le bac allemand ?', ['das Zeugnis', 'die Ausbildung', 'das Abitur', 'die Klassenarbeit'], 2, 'L’*Abitur*, ou *Abi*, clôt les études au *Gymnasium*.'],
            ['Qu’est-ce que la « Schultüte » ?', ['Le cartable', 'Le cornet de bonbons du premier jour d’école', 'La cantine', 'Le bulletin de fin d’année'], 1, 'Le jour de la rentrée en *Grundschule*, l’enfant reçoit ce grand cornet décoré.'],
            ['À quel âge environ les élèves allemands sont-ils orientés après la Grundschule ?', ['6 ans', '10 ans', '15 ans', '18 ans'], 1, 'La *Grundschule* dure en général quatre ans ; l’orientation se fait vers 10 ans.'],
            ['Qui organise l’école en Allemagne ?', ['L’État fédéral seul', 'Les Länder', 'Les communes', 'L’Union européenne'], 1, 'L’éducation est une compétence des 16 Länder : les systèmes et les vacances varient.'],
            ['Que signifie « der Stundenplan » ?', ['L’emploi du temps', 'La récréation', 'Le bulletin', 'La salle de classe'], 0, '*die Stunde* = l’heure, *der Plan* = le plan : l’emploi du temps.'],
            ['Une « Ganztagsschule » est une école…', ['du soir', 'à la journée entière, avec l’après-midi', 'réservée aux adultes', 'privée'], 1, '*ganzer Tag* = la journée entière : cours et activités jusqu’en fin d’après-midi.'],
            ['Le système dual allemand associe…', ['deux langues à l’école', 'l’entreprise et l’école professionnelle', 'le collège et le lycée', 'la ville et la campagne'], 1, 'L’*Ausbildung* alterne travail en entreprise et cours en école professionnelle.'],
            ['« Ich habe eine Fünf » est une bonne nouvelle.', ['Vrai', 'Faux'], 1, 'Un 5 (*mangelhaft*) est une note insuffisante.'],
            ['Comment dit-on « les devoirs » ?', ['die Hausaufgaben', 'die Hausarbeiten', 'die Schularbeit', 'die Aufgabenhäuser'], 0, '*das Haus* + *die Aufgabe* : les tâches à faire à la maison.'],
            ['Que veut dire « sitzen bleiben » à l’école ?', ['Rester assis', 'Redoubler', 'Être collé', 'Sécher les cours'], 1, 'Mot à mot « rester assis » : on reste dans la même classe l’année suivante.'],
            ['Qu’est-ce qu’un « Verein » ?', ['Une matière', 'Un club ou une association', 'Une école', 'Un examen'], 1, 'Le *Verein* (club, association) tient une grande place dans la vie allemande.'],
          ],
        },

        // ---- Voyages et migrations -----------------------------------------
        {
          titre: 'Partir, arriver : voyages et migrations dans l’espace germanophone',
          axe: 'Voyages et migrations',
          lecon: {
            titre: 'Du voyage de classe à l’histoire des migrations',
            cours: `Voyager, c’est partir quelques jours ; migrer, c’est partir pour vivre ailleurs. Les pays germanophones connaissent les deux, depuis des siècles.

## Voyager en Allemagne
L’Allemagne se parcourt en train (*die Deutsche Bahn*, l’ICE), à vélo le long des fleuves (Rhin, Danube, Elbe) ou en *Jugendherberge*, les auberges de jeunesse — une invention allemande de 1909. Les élèves partent en *Klassenfahrt* (voyage de classe) et beaucoup font un **échange** avec la France.

| Lieu | Ce qu’on y voit |
| Berlin | la porte de Brandebourg, les restes du Mur |
| Munich (*München*) | l’Oktoberfest, les Alpes toutes proches |
| Hambourg | le port, la *Speicherstadt* |
| Le Rhin | les châteaux, le rocher de la Loreley |
| Vienne | le château de Schönbrunn, les cafés |

## Un pays d’émigration…
Au XIXe siècle, des millions d’Allemands ont **émigré** (*auswandern*), surtout vers les **États-Unis**, pour fuir la pauvreté. Aujourd’hui encore, des dizaines de millions d’Américains se disent d’ascendance allemande. Le port de Bremerhaven, d’où partaient les bateaux, a un musée de l’émigration.

## … devenu un pays d’immigration
| Période | Qui arrive | Pourquoi |
| Années 1950–1970 | Les **Gastarbeiter** (Italie, Turquie, Grèce…) | Main-d’œuvre pour le « miracle économique » |
| Après 1989 | Allemands d’Europe de l’Est (*Spätaussiedler*) | Chute du rideau de fer |
| 2015–2016 | Plus d’un million de réfugiés, surtout de Syrie | Guerre ; « *Wir schaffen das* » (Angela Merkel) |
| Depuis 2022 | Réfugiés d’Ukraine | Guerre |

> Aujourd’hui, environ une personne sur quatre en Allemagne a une « histoire migratoire » (*Migrationshintergrund*) : elle ou au moins un de ses parents est né avec une autre nationalité.

Le mot *Gastarbeiter* (« travailleur invité ») montre qu’on pensait qu’ils repartiraient ; beaucoup sont restés, et leurs enfants et petits-enfants sont Allemands. Le *Döner* en sandwich, popularisé à Berlin par des immigrés turcs, est devenu un plat national.

## Vocabulaire utile
| Allemand | Français |
| *reisen* | voyager |
| *die Reise* | le voyage |
| *auswandern* / *einwandern* | émigrer / immigrer |
| *der Flüchtling* | le réfugié |
| *die Heimat* | le pays natal, le « chez soi » |
| *der Koffer* | la valise |
| *das Heimweh* | le mal du pays |

## Expressions
- *Ich fahre nach Berlin.* — Je vais à Berlin (ville, pays : *nach*).
- *Ich fahre in die Schweiz.* — Je vais en Suisse (pays avec article : *in* + accusatif).
- *Gute Reise!* — Bon voyage !`,
          },
          questions: [
            ['Vers quel pays la plupart des émigrants allemands du XIXe siècle sont-ils partis ?', ['Le Brésil', 'Les États-Unis', 'La France', 'L’Australie'], 1, 'Des millions d’Allemands ont traversé l’Atlantique vers les États-Unis au XIXe siècle.'],
            ['Qui étaient les « Gastarbeiter » ?', ['Des touristes', 'Des travailleurs étrangers recrutés dans les années 1950–1970', 'Des soldats', 'Des étudiants en échange'], 1, 'On les a recrutés pour le miracle économique ; le mot « invité » supposait un départ qui n’a souvent pas eu lieu.'],
            ['Que signifie « auswandern » ?', ['Voyager', 'Immigrer', 'Émigrer', 'Randonner'], 2, '*aus* = hors de : on quitte son pays. *einwandern* = immigrer (*ein* = dans).'],
            ['Que veut dire « das Heimweh » ?', ['Le mal du pays', 'La maison de vacances', 'Le mal de mer', 'La patrie'], 0, '*Heim* = chez soi, *Weh* = la douleur : la nostalgie de son pays.'],
            ['Quelle phrase est correcte pour « Je vais en Suisse » ?', ['Ich fahre nach Schweiz.', 'Ich fahre in die Schweiz.', 'Ich fahre zu Schweiz.', 'Ich fahre in der Schweiz.'], 1, 'Un pays avec article (*die Schweiz*) se construit avec *in* + accusatif pour la direction.'],
            ['Qu’est-ce qu’une « Jugendherberge » ?', ['Une auberge de jeunesse', 'Un camp de réfugiés', 'Une école', 'Un train de nuit'], 0, 'L’auberge de jeunesse est née en Allemagne, en 1909.'],
            ['Quelle phrase d’Angela Merkel est restée associée à l’accueil des réfugiés en 2015 ?', ['Ich bin ein Berliner', 'Wir schaffen das', 'Wir sind das Volk', 'Mehr Demokratie wagen'], 1, '« Nous y arriverons » : la chancelière défendait l’accueil de plus d’un million de réfugiés.'],
            ['En Allemagne, environ une personne sur quatre a une histoire migratoire.', ['Vrai', 'Faux'], 0, 'Elle ou au moins l’un de ses parents est né avec une nationalité étrangère.'],
            ['Que signifie « der Flüchtling » ?', ['Le voyageur', 'Le réfugié', 'Le fugitif recherché par la police', 'Le touriste'], 1, '*flüchten* = fuir : le réfugié fuit une guerre ou une persécution.'],
            ['« Ich fahre ___ Berlin. » Quel mot complète la phrase ?', ['in', 'zu', 'nach', 'auf'], 2, 'Devant une ville ou un pays sans article, la direction se dit avec *nach*.', 'Quelle préposition pour aller à Berlin ?'],
            ['Dans quelle ville le Döner en sandwich a-t-il été popularisé ?', ['À Istanbul', 'À Berlin', 'À Vienne', 'À Munich'], 1, 'Le sandwich au pain et à la viande grillée a été popularisé à Berlin par des immigrés turcs.'],
            ['Que signifie « die Heimat » ?', ['La maison louée', 'Le pays natal, le chez-soi', 'L’étranger', 'La frontière'], 1, '*Heimat* désigne le lieu où l’on se sent chez soi ; un mot chargé d’émotion en allemand.'],
          ],
        },

        // ---- Rencontres avec d'autres cultures ------------------------------
        {
          titre: 'Voisins et amis : la rencontre franco-allemande',
          axe: 'Rencontres avec d’autres cultures',
          lecon: {
            titre: 'D’ennemis héréditaires à partenaires',
            cours: `La France et l’Allemagne se sont fait la guerre trois fois en 70 ans. Elles sont aujourd’hui le couple le plus étroit d’Europe : c’est une rencontre qui s’est construite.

## Le traité de l’Élysée (1963)
Le 22 janvier 1963, le général **de Gaulle** et le chancelier **Konrad Adenauer** signent le **traité de l’Élysée**. Les deux pays promettent de se consulter et de rapprocher leurs jeunesses. La même année naît l’**OFAJ** (*Office franco-allemand pour la Jeunesse*, en allemand *DFJW*), qui a permis à près de dix millions de jeunes de se rencontrer.

| Date | Événement |
| 1963 | Traité de l’Élysée, création de l’OFAJ |
| 1984 | Mitterrand et Kohl, main dans la main à Verdun |
| 1992 | Création d’Arte, chaîne franco-allemande |
| 2003 | Le 22 janvier devient la Journée franco-allemande |
| 2019 | Traité d’Aix-la-Chapelle, qui renouvelle celui de l’Élysée |

## Se rencontrer aujourd’hui
Les **échanges scolaires**, les **jumelages** de villes (plus de 2 000 !), le programme Voltaire ou les lycées franco-allemands permettent de vivre chez l’autre. Le *Deutsch-Französisches Jugendwerk* finance des séjours.

## Des habitudes différentes
| En Allemagne | En France |
| On dîne tôt, parfois un repas froid (*Abendbrot*) | On dîne plus tard, un repas chaud |
| On se serre la main, sans bise | On fait la bise |
| La ponctualité est très importante | Un petit retard est souvent toléré |
| On trie ses déchets avec soin, on rapporte ses bouteilles (*Pfand*) | Le tri progresse |

> Rencontrer une autre culture, ce n’est pas juger ses habitudes, c’est les comprendre — et regarder les siennes autrement.

## D’autres rencontres
L’Allemagne est aussi un lieu de rencontre de nombreuses cultures : la communauté d’origine turque, les nouveaux arrivants d’Ukraine ou de Syrie, les touristes du monde entier à Berlin. La devise de l’Union européenne, dont l’Allemagne et la France sont membres fondateurs, le résume : « Unie dans la diversité » (*In Vielfalt geeint*).

## Vocabulaire utile
| Allemand | Français |
| *der Austausch* | l’échange |
| *die Gastfamilie* | la famille d’accueil |
| *der Brieffreund, die Brieffreundin* | le/la correspondant(e) |
| *die Freundschaft* | l’amitié |
| *das Nachbarland* | le pays voisin |
| *die Städtepartnerschaft* | le jumelage |

## Expressions
- *Ich wohne bei meiner Gastfamilie.* — J’habite chez ma famille d’accueil.
- *Bei uns in Frankreich isst man später.* — Chez nous, en France, on mange plus tard.
- *Das ist anders als bei uns.* — C’est différent de chez nous.`,
          },
          questions: [
            ['Qui a signé le traité de l’Élysée en 1963 ?', ['Mitterrand et Kohl', 'De Gaulle et Adenauer', 'Macron et Merkel', 'Pompidou et Brandt'], 1, 'Le général de Gaulle et le chancelier Adenauer scellent la réconciliation le 22 janvier 1963.'],
            ['Que signifie le sigle OFAJ ?', ['Office franco-allemand pour la Jeunesse', 'Organisation fédérale des associations de jeunes', 'Office de formation des adultes et des jeunes', 'Orchestre franco-allemand des jeunes'], 0, 'Créé en 1963, il finance les échanges entre jeunes des deux pays.'],
            ['Quelle date est la Journée franco-allemande ?', ['Le 3 octobre', 'Le 9 novembre', 'Le 22 janvier', 'Le 14 juillet'], 2, 'C’est l’anniversaire du traité de l’Élysée.'],
            ['Quelle chaîne de télévision est franco-allemande ?', ['ZDF', 'Arte', 'TV5', 'RTL'], 1, 'Arte, créée en 1992, diffuse ses programmes dans les deux langues.'],
            ['Que signifie « der Austausch » ?', ['L’échange', 'La sortie', 'Le voyage de classe', 'La frontière'], 0, 'On part en *Austausch* pour vivre chez un correspondant.'],
            ['En 1984, Mitterrand et Kohl se sont tenu la main à…', ['Berlin', 'Verdun', 'Strasbourg', 'Bonn'], 1, 'Sur le lieu de la bataille de 1916, ce geste a symbolisé la réconciliation.'],
            ['Quel traité a renouvelé celui de l’Élysée en 2019 ?', ['Le traité de Rome', 'Le traité de Maastricht', 'Le traité d’Aix-la-Chapelle', 'Le traité de Versailles'], 2, 'Signé à Aix-la-Chapelle (*Aachen*), il approfondit la coopération.'],
            ['En Allemagne, le « Pfand » est…', ['une consigne sur les bouteilles', 'un plat du soir', 'une salutation', 'un jour férié'], 0, 'On paie quelques centimes de plus et on les récupère en rapportant la bouteille.'],
            ['Entre Allemands qui se rencontrent, la bise est la règle.', ['Vrai', 'Faux'], 1, 'On se serre plutôt la main ; entre amis proches, on se prend parfois dans les bras.'],
            ['Comment dit-on « la famille d’accueil » ?', ['die Gastfamilie', 'die Gästehaus', 'die Hausfamilie', 'die Nachbarfamilie'], 0, '*der Gast* = l’invité : la famille qui reçoit l’invité.'],
            ['« Das ist anders als bei uns » signifie…', ['C’est comme chez nous', 'C’est différent de chez nous', 'C’est mieux chez nous', 'Ce n’est pas chez nous'], 1, '*anders als* = différent de ; *bei uns* = chez nous.'],
            ['Quelle est la devise de l’Union européenne en allemand ?', ['Einigkeit und Recht und Freiheit', 'In Vielfalt geeint', 'Wir sind ein Volk', 'Freiheit für alle'], 1, '« Unie dans la diversité ». *Einigkeit und Recht und Freiheit* est le début de l’hymne allemand.'],
          ],
        },
      ],
    },

    // =====================================================================
    // RAYON LANGUE — savoir-faire A2 absents des 36 fiches
    // =====================================================================
    {
      niveaux: ['3e'],
      positionDepart: 41,
      rayon: 'langue',
      chapitres: [
        {
          titre: 'Les nombres, l’heure et la date',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Compter à l’envers et dire « la demie de huit »',
            cours: `Deux pièges attendent un francophone : l’allemand dit les unités **avant** les dizaines, et « halb acht » veut dire 7 h 30, pas 8 h 30.

## Les nombres
| 1–12 | 13–19 | Dizaines |
| *eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn, elf, zwölf* | *dreizehn, vierzehn, fünfzehn, sechzehn, siebzehn, achtzehn, neunzehn* | *zwanzig, dreißig, vierzig, fünfzig, sechzig, siebzig, achtzig, neunzig, hundert* |

Attention aux formes raccourcies : *sechzehn* (pas *sechszehn*), *siebzehn*, *sechzig*, *siebzig* — le *s* de *sechs* et le *en* de *sieben* tombent —, et *dreißig* avec **ß**.

## Les unités d’abord
Entre 21 et 99, on dit l’unité, puis *und*, puis la dizaine, **en un seul mot** :
- 21 = *einundzwanzig* (« un et vingt »)
- 47 = *siebenundvierzig*
- 365 = *dreihundertfünfundsechzig*
- 2026 (année) = *zweitausendsechsundzwanzig*

> Pour écrire un nombre sous la dictée, note d’abord l’unité à droite, puis la dizaine à gauche.

## L’heure
| Officielle (radio, horaires) | Familière (conversation) | Heure |
| *Es ist acht Uhr.* | *Es ist acht.* | 8 h 00 |
| *acht Uhr fünfzehn* | *Viertel nach acht* | 8 h 15 |
| *acht Uhr dreißig* | *halb neun* | 8 h 30 |
| *acht Uhr fünfundvierzig* | *Viertel vor neun* | 8 h 45 |
| *zwanzig Uhr zehn* | *zehn nach acht* | 20 h 10 |

*halb neun*, c’est « la moitié **vers** neuf » : il manque une demi-heure pour arriver à 9 h. Pour demander : *Wie spät ist es?* ou *Wie viel Uhr ist es?* Pour dire « à » : **um** *halb neun*.

## Les ordinaux et la date
L’ordinal ajoute *-te* jusqu’à 19, *-ste* à partir de 20, et s’écrit avec un **point** : *der 3.* = *der dritte*.
| Nombre | Ordinal |
| 1 | *der erste* (irrégulier) |
| 3 | *der dritte* (irrégulier) |
| 7 | *der siebte* |
| 20 | *der zwanzigste* |

- *Heute ist der 3. Oktober.* (nominatif : *der dritte*)
- *Ich habe am 14. Mai Geburtstag.* (datif après *am* : *am vierzehnten*)
- Une date écrite : *Berlin, den 22.01.2026*.

## Exemple travaillé
« Mon train part à 7 h 30 le 21 mars » : *Mein Zug fährt am einundzwanzigsten März um halb acht ab.*
1. La date : *am* + ordinal + *-en* : *am einundzwanzigsten*.
2. L’heure : *um halb acht* (7 h 30 !).
3. Le verbe à préverbe séparable *abfahren* : *ab* en fin de phrase.`,
          },
          questions: [
            ['Comment dit-on 47 en allemand ?', ['vierzigsieben', 'siebenundvierzig', 'vierundsiebzig', 'siebenvierzig'], 1, 'L’unité d’abord, puis *und*, puis la dizaine : *sieben-und-vierzig*.'],
            ['« halb neun » correspond à…', ['8 h 30', '9 h 30', '9 h 00', '8 h 50'], 0, '*halb neun* = la demie qui mène à neuf heures, donc 8 h 30.'],
            ['Quelle est l’orthographe correcte de 16 ?', ['sechszehn', 'sechzehn', 'sechsehn', 'sechzen'], 1, 'Le *s* de *sechs* tombe devant *-zehn* et *-zig* : *sechzehn*, *sechzig*.'],
            ['« Viertel vor drei » correspond à…', ['3 h 15', '2 h 45', '2 h 15', '3 h 45'], 1, '*Viertel vor* = moins le quart : un quart d’heure avant trois heures.'],
            ['Quelle question sert à demander l’heure ?', ['Wie alt bist du?', 'Wie spät ist es?', 'Wann ist es?', 'Wie lange ist es?'], 1, '*Wie spät ist es?* (ou *Wie viel Uhr ist es?*) : quelle heure est-il ?'],
            ['« Ich komme ___ halb acht. » Quel mot complète la phrase ?', ['am', 'im', 'um', 'in'], 2, 'L’heure précise se construit avec *um*.', 'Quelle préposition devant une heure ?'],
            ['Comment écrit-on 30 ?', ['dreizig', 'dreißig', 'dreissig', 'dreizich'], 1, '30 est la seule dizaine en *-ßig* : *dreißig*.'],
            ['Quel est l’ordinal de 3 ?', ['der dreite', 'der dritte', 'der dreiste', 'der drite'], 1, '*erste* et *dritte* sont irréguliers ; *siebte* aussi perd une syllabe.'],
            ['« Ich habe am 14. Mai Geburtstag » se lit…', ['am vierzehn Mai', 'am vierzehnte Mai', 'am vierzehnten Mai', 'am vierzehnsten Mai'], 2, 'Après *am* (datif), l’ordinal prend la terminaison *-en*.'],
            ['En allemand, un ordinal écrit en chiffres se reconnaît au point qui le suit.', ['Vrai', 'Faux'], 0, '*der 3. Oktober* se lit *der dritte Oktober* : le point marque l’ordinal.'],
            ['« zwanzig Uhr zehn » correspond à…', ['20 h 10', '10 h 20', '8 h 10 du matin', '20 h 50'], 0, 'L’heure officielle se dit sur 24 heures, heure puis minutes.'],
            ['Quel est l’ordinal de 20 ?', ['der zwanzigte', 'der zwanzigste', 'der zwanzigen', 'der zwanzigerste'], 1, 'À partir de 20, l’ordinal se forme avec *-ste*.'],
          ],
        },

        {
          titre: 'Les mots composés',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Lire un mot allemand de droite à gauche',
            cours: `*Handschuh*, *Kühlschrank*, *Fußballweltmeisterschaft* : l’allemand colle les mots entre eux. Bonne nouvelle : une seule règle suffit pour les comprendre.

## La règle d’or
Dans un mot composé, **le dernier mot est le mot de base** : il donne le **sens principal** et le **genre**. Les mots placés devant le **précisent**.
| Composé | Découpage | Sens |
| *das Klassenzimmer* | *die Klasse* + *das Zimmer* | la salle de classe |
| *der Kühlschrank* | *kühl* + *der Schrank* | le réfrigérateur (« armoire froide ») |
| *die Haustür* | *das Haus* + *die Tür* | la porte d’entrée |
| *der Handschuh* | *die Hand* + *der Schuh* | le gant (« chaussure de main ») |

> On lit un composé **de droite à gauche** : *der Apfelbaum* est un arbre (*Baum*) qui porte des pommes, *der Baumapfel* serait une pomme… d’arbre.

## Le genre vient du dernier mot
*das Haus* + *die Tür* = **die** Haustür. *die Schule* + *der Hof* = **der** Schulhof (la cour de récréation). C’est un vrai raccourci pour retenir le genre de milliers de mots.

## Ce qui peut se coller
| Éléments | Exemple | Sens |
| nom + nom | *die Hausaufgabe* | le devoir |
| adjectif + nom | *die Großstadt* | la grande ville |
| verbe (radical) + nom | *das Schwimmbad* | la piscine (*schwimmen*) |
| préposition + nom | *der Vorname* | le prénom |

## Les lettres de liaison
Entre deux noms, on ajoute parfois une lettre de liaison (*Fugenelement*) : **-s-**, **-n-**, **-en-**, **-er-**.
- *die Geburt* + **s** + *der Tag* = *der Geburtstag* (l’anniversaire)
- *die Straße* + **n** + *die Bahn* = *die Straßenbahn* (le tramway)
- *das Kind* + **er** + *der Garten* = *der Kindergarten*

Il n’y a pas de règle simple : on les retient avec le mot.

## Exemple travaillé
*die Fußballweltmeisterschaft* :
1. On coupe : *Fußball* / *Welt* / *Meisterschaft*.
2. Mot de base : *die Meisterschaft* (le championnat) → le mot est **féminin**.
3. Les précisions : *Welt* (du monde) puis *Fußball* : le championnat du monde de football.

## Vocabulaire utile
| Composé | Sens |
| *das Lieblingsfach* | la matière préférée |
| *der Bahnhof* | la gare |
| *das Wörterbuch* | le dictionnaire |
| *die Jugendherberge* | l’auberge de jeunesse |`,
          },
          questions: [
            ['Dans un mot composé, quel élément donne le genre ?', ['Le premier', 'Le dernier', 'Le plus long', 'Celui du milieu'], 1, 'Le dernier élément est le mot de base : il porte le genre et le sens principal.'],
            ['Quel est le genre de « Haustür » (das Haus + die Tür) ?', ['der', 'die', 'das', 'Il dépend du contexte'], 1, 'Le genre vient de *die Tür* : *die Haustür*.'],
            ['Que signifie « der Handschuh » ?', ['La chaussure', 'Le gant', 'La chaussette', 'La main'], 1, 'Mot à mot « chaussure de main » : le gant.'],
            ['« der Apfelbaum » désigne…', ['une pomme', 'un pommier', 'une tarte aux pommes', 'une branche'], 1, 'Le mot de base est *Baum* (arbre) : un arbre à pommes, un pommier.'],
            ['Quelle lettre de liaison trouve-t-on dans « Geburtstag » ?', ['-n-', '-s-', '-er-', '-en-'], 1, '*Geburt* + *s* + *Tag* : l’anniversaire.'],
            ['« das Schwimmbad » est formé de…', ['deux noms', 'un verbe et un nom', 'un adjectif et un nom', 'une préposition et un nom'], 1, 'Le radical de *schwimmen* + *das Bad* : la piscine.'],
            ['Quel est le genre de « Schulhof » ?', ['der', 'die', 'das', 'Aucun'], 0, '*die Schule* + *der Hof* : c’est *der Hof* qui décide.'],
            ['Que signifie « die Großstadt » ?', ['La grande ville', 'La vieille ville', 'La capitale', 'Le grand magasin'], 0, '*groß* (grand) + *die Stadt* (la ville).'],
            ['On lit un mot composé allemand de droite à gauche pour en trouver le sens principal.', ['Vrai', 'Faux'], 0, 'On repère d’abord le mot de base, à droite, puis ce qui le précise.'],
            ['Quel est le mot de base de « Fußballweltmeisterschaft » ?', ['Fußball', 'Welt', 'Meisterschaft', 'Ball'], 2, '*die Meisterschaft* (le championnat) : le mot est donc féminin.'],
            ['Comment dit-on « le dictionnaire » ?', ['das Buchwort', 'das Wörterbuch', 'der Wortbuch', 'die Wörterbücherei'], 1, 'Un livre (*Buch*) de mots (*Wörter*) : *das Wörterbuch*.'],
            ['« die Straßenbahn » signifie…', ['la rue piétonne', 'le tramway', 'l’autoroute', 'la gare routière'], 1, 'Un train (*Bahn*) qui roule dans la rue (*Straße*) : le tramway.'],
          ],
        },

        {
          titre: 'Raconter dans l’ordre : les connecteurs chronologiques',
          axe: 'La phrase',
          lecon: {
            titre: 'Zuerst, dann, danach… et le verbe en deuxième position',
            cours: `Raconter un week-end ou un voyage, c’est enchaîner des étapes. En allemand, les mots qui marquent l’ordre ont une conséquence cachée : ils changent la place du sujet.

## Les connecteurs de l’ordre
| Connecteur | Sens |
| *zuerst* / *zunächst* | d’abord |
| *dann* | ensuite, puis |
| *danach* | après ça |
| *später* | plus tard |
| *am Anfang* | au début |
| *plötzlich* | soudain |
| *schließlich* / *zum Schluss* | finalement, pour finir |
| *am Ende* | à la fin |

## Ils occupent la première place
Ces mots sont des **adverbes** : placés en tête, ils occupent la **première position**. Le verbe conjugué reste en **deuxième** position, et le sujet passe **derrière** lui.
| Ordre normal | Avec un connecteur en tête |
| *Ich frühstücke.* | *Zuerst* **frühstücke ich**. |
| *Wir fahren in die Stadt.* | *Dann* **fahren wir** *in die Stadt.* |
| *Ich bin müde.* | *Am Ende* **bin ich** *müde.* |

> Connecteur en tête = inversion. *Dann ich gehe* est la faute la plus fréquente de l’élève francophone : on dit *Dann gehe ich*.

## Les mots qui ne comptent pas
*und*, *aber*, *oder*, *denn* et *sondern* sont des **conjonctions de coordination** : ils se placent en **position zéro** et ne changent rien. *Ich esse* **und dann** *gehe ich* : c’est *dann* qui provoque l’inversion, pas *und*.

## Raconter au passé
À l’oral et dans un message, on raconte au **parfait** : l’auxiliaire en 2e position, le participe à la fin.
*Zuerst* **habe** *ich Fußball* **gespielt**. *Dann* **bin** *ich nach Hause* **gegangen**.

## Exemple travaillé : mon samedi
*Am Samstag bin ich früh aufgestanden.* **Zuerst** *habe ich gefrühstückt.* **Dann** *bin ich mit meinem Freund ins Kino gegangen.* **Danach** *haben wir eine Pizza gegessen.* **Plötzlich** *hat es geregnet!* **Schließlich** *sind wir mit dem Bus nach Hause gefahren.*

1. Chaque phrase commence par un repère : un jour, puis un connecteur.
2. Derrière chaque connecteur : auxiliaire, puis sujet.
3. Le participe passé ferme la phrase.

## Pour aller plus loin
*bevor* (avant que) et *nachdem* (après que) sont des **subordonnants** : ils envoient le verbe à la fin (*Nachdem ich gegessen hatte, …*). *danach* et *vorher*, eux, sont des adverbes : ne les confonds pas.`,
          },
          questions: [
            ['Que signifie « zuerst » ?', ['Finalement', 'D’abord', 'Soudain', 'Ensuite'], 1, '*zuerst* ou *zunächst* ouvrent un récit : d’abord.'],
            ['Quelle phrase est correcte ?', ['Dann ich gehe ins Kino.', 'Dann gehe ich ins Kino.', 'Dann ich ins Kino gehe.', 'Gehe dann ich ins Kino.'], 1, 'Le connecteur occupe la 1re place, le verbe reste 2e, le sujet passe derrière.'],
            ['Que signifie « plötzlich » ?', ['Lentement', 'Soudain', 'Plus tard', 'Au début'], 1, '*plötzlich* introduit un événement inattendu.'],
            ['« und » provoque l’inversion du sujet et du verbe.', ['Vrai', 'Faux'], 1, '*und* est en position zéro : *Ich esse und ich trinke*. Seuls les adverbes comme *dann* occupent la 1re place.'],
            ['« ___ bin ich nach Hause gegangen. » Quel mot signifiant « finalement » complète la phrase ?', ['Zuerst', 'Plötzlich', 'Schließlich', 'Später'], 2, '*schließlich* = finalement, pour finir.', 'Quel connecteur signifie « finalement » ?'],
            ['Quelle est la bonne suite : « Danach … »', ['… wir haben gegessen.', '… haben wir gegessen.', '… gegessen wir haben.', '… wir gegessen haben.'], 1, 'Après *danach*, l’auxiliaire en 2e position, puis le sujet, puis le participe à la fin.'],
            ['À l’oral, on raconte le plus souvent un week-end…', ['au prétérit', 'au parfait', 'au futur', 'au présent seulement'], 1, 'Le parfait est le temps du récit oral et des messages.'],
            ['Que signifie « am Ende » ?', ['Au début', 'À la fin', 'Au milieu', 'En avance'], 1, '*das Ende* = la fin.'],
            ['Quel mot envoie le verbe conjugué à la fin de la proposition ?', ['danach', 'dann', 'nachdem', 'später'], 2, '*nachdem* est une conjonction de subordination ; *danach* est un adverbe.'],
            ['« Zuerst habe ich Fußball ___. » Quel participe complète la phrase ?', ['spielen', 'gespielt', 'spielt', 'gespielen'], 1, 'Le parfait de *spielen* : *habe … gespielt*, le participe en fin de phrase.', 'Quel est le participe passé de spielen ?'],
            ['Dans « Dann fahren wir in die Stadt », quel élément est en 2e position ?', ['Dann', 'fahren', 'wir', 'in die Stadt'], 1, 'Le verbe conjugué est toujours le 2e élément de la phrase déclarative.'],
            ['Que signifie « später » ?', ['Plus tôt', 'Plus tard', 'Jamais', 'Souvent'], 1, '*spät* = tard ; *später* = plus tard.'],
          ],
        },

        {
          titre: 'Écrire un message, un courriel, une lettre',
          axe: 'La phrase',
          lecon: {
            titre: 'Liebe Lena, … Viele Grüße',
            cours: `Écrire à un correspondant, remercier une famille d’accueil, répondre à une annonce : en 3e, l’écrit se fait souvent sous forme de message. L’allemand a ses codes, et un correcteur les attend.

## La structure
1. **Le lieu et la date** (lettre) : *Paris, den 5. März 2026*.
2. **L’appel**, suivi d’une **virgule** : *Liebe Lena,* / *Lieber Tom,*.
3. **Le corps** : la première ligne commence par une **minuscule** (sauf nom ou *Sie*).
4. **La formule finale** sur sa ligne, sans virgule : *Viele Grüße*.
5. **La signature**.

## Tutoyer ou vouvoyer ?
| | À un ami (*du*) | À un adulte inconnu (*Sie*) |
| Appel | *Liebe Anna,* / *Lieber Paul,* / *Hallo Max,* | *Sehr geehrte Frau Weber,* / *Sehr geehrter Herr Klein,* |
| Pronoms | *du, dich, dir, dein* | *Sie, Ihnen, Ihr* (majuscule !) |
| Fin | *Viele Grüße*, *Liebe Grüße*, *Bis bald!* | *Mit freundlichen Grüßen* |

> *Liebe* pour une fille ou une femme, *Lieber* pour un garçon ou un homme : l’adjectif s’accorde. Et *Sehr geehrte* pour une femme, *Sehr geehrter* pour un homme.

## Les phrases qui servent toujours
| Allemand | Français |
| *Vielen Dank für deine Nachricht!* | Merci beaucoup pour ton message ! |
| *Wie geht es dir?* | Comment vas-tu ? |
| *Mir geht es gut.* | Je vais bien. |
| *Ich freue mich auf deinen Besuch.* | Je me réjouis de ta visite. |
| *Leider kann ich nicht kommen.* | Malheureusement, je ne peux pas venir. |
| *Schreib mir bald!* | Écris-moi vite ! |
| *Ich möchte mich vorstellen.* | Je voudrais me présenter. |

## Exemple travaillé
*Liebe Lena,*
*vielen Dank für deine Nachricht! Mir geht es gut. Nächsten Sommer komme ich nach Hamburg, weil ich einen Austausch mache. Ich freue mich schon sehr auf deine Stadt! Hast du Zeit am 12. Juli?*
*Schreib mir bald!*
*Viele Grüße*
*Chloé*

Repère ce qui fait la qualité du message : la virgule après l’appel, la minuscule à *vielen*, un connecteur (*weil*) avec le verbe à la fin, une question pour appeler une réponse.

## Les fautes qui coûtent des points
- Oublier la **majuscule** de *Sie* et *Ihnen* dans un message poli.
- Écrire *Lieber Lena* (Lena est une fille : *Liebe*).
- Terminer un courriel poli par *Tschüss*.`,
          },
          questions: [
            ['Comment commencer un message à ton ami Paul ?', ['Liebe Paul,', 'Lieber Paul,', 'Lieben Paul,', 'Liebes Paul,'], 1, 'Pour un garçon, l’adjectif prend *-er* : *Lieber Paul*.'],
            ['Quelle formule termine une lettre polie à un adulte inconnu ?', ['Viele Grüße', 'Bis bald!', 'Mit freundlichen Grüßen', 'Tschüss'], 2, '*Mit freundlichen Grüßen* est la formule standard du courrier poli.'],
            ['Après « Liebe Lena, », la première ligne du message commence…', ['par une majuscule', 'par une minuscule, sauf nom ou Sie', 'par un tiret', 'par la date'], 1, 'L’appel se termine par une virgule, la phrase suivante continue donc en minuscule.'],
            ['Comment écrire à une femme inconnue, Mme Weber ?', ['Liebe Frau Weber,', 'Sehr geehrter Frau Weber,', 'Sehr geehrte Frau Weber,', 'Hallo Frau Weber,'], 2, '*Sehr geehrte* pour une femme, *Sehr geehrter* pour un homme.'],
            ['Dans un message poli, on écrit « ihnen » en minuscule quand on s’adresse à la personne.', ['Vrai', 'Faux'], 1, 'Le vouvoiement prend la majuscule : *Sie*, *Ihnen*, *Ihr*.'],
            ['Que signifie « Ich freue mich auf deinen Besuch » ?', ['Je te remercie pour ta visite', 'Je me réjouis de ta visite', 'Je regrette ta visite', 'Je t’attends à la gare'], 1, '*sich freuen auf* = se réjouir de quelque chose à venir.'],
            ['Comment dit-on « Malheureusement, je ne peux pas venir » ?', ['Leider kann ich nicht kommen.', 'Leider ich kann nicht kommen.', 'Gerne kann ich nicht kommen.', 'Leider komme ich kann nicht.'], 0, '*leider* en 1re position : verbe en 2e, sujet derrière.'],
            ['« ___ Dank für deine Nachricht! » Quel mot complète la phrase ?', ['Viel', 'Vielen', 'Viele', 'Vieles'], 1, 'On dit *Vielen Dank* : merci beaucoup.', 'Quelle forme de viel devant Dank ?'],
            ['Où place-t-on la date dans une lettre ?', ['En haut, avec le lieu', 'Sous la signature', 'Après l’appel', 'On ne la met jamais'], 0, 'En haut : *Paris, den 5. März 2026*.'],
            ['« Mir geht es gut » répond à…', ['Wo wohnst du?', 'Wie geht es dir?', 'Wie heißt du?', 'Was machst du?'], 1, 'À « Comment vas-tu ? », on répond « Je vais bien ».'],
            ['Quel signe suit l’appel « Hallo Max » ?', ['Un point', 'Deux points', 'Une virgule', 'Un point d’exclamation obligatoire'], 2, 'En allemand, l’appel est normalement suivi d’une virgule.'],
            ['Que signifie « Schreib mir bald! » ?', ['Écris-moi vite !', 'Je t’écris bientôt', 'Écris-lui vite !', 'Écrivez-moi !'], 0, 'Impératif de *schreiben* à la 2e personne : *schreib*.'],
          ],
        },

        {
          titre: 'Donner son avis et le justifier',
          axe: 'La phrase',
          lecon: {
            titre: 'Ich finde, dass… — parce que je pense que…',
            cours: `À l’oral du brevet comme en classe, on te demande : « *Was denkst du?* ». Donner son avis en allemand demande quelques formules, et surtout de bien placer le verbe.

## Exprimer son opinion
| Formule | Ce qui suit | Exemple |
| *Ich finde, …* | une principale (verbe 2e) | *Ich finde, das Buch ist spannend.* |
| *Ich finde, dass …* | une subordonnée (verbe à la fin) | *Ich finde, dass das Buch spannend ist.* |
| *Ich denke / glaube, dass …* | subordonnée | *Ich glaube, dass er recht hat.* |
| *Meiner Meinung nach …* | inversion (verbe 2e, sujet après) | *Meiner Meinung nach ist das gefährlich.* |
| *Für mich …* | inversion | *Für mich ist Sport wichtig.* |

> *Meiner Meinung nach* compte pour **une seule** position : derrière, le verbe, puis le sujet.

## Être d’accord ou pas
| Allemand | Français |
| *Ich bin einverstanden.* / *Ich bin deiner Meinung.* | Je suis d’accord. |
| *Das stimmt.* | C’est vrai. |
| *Da hast du recht.* | Là, tu as raison. |
| *Ich bin nicht einverstanden.* | Je ne suis pas d’accord. |
| *Das stimmt nicht.* | Ce n’est pas vrai. |
| *Ich sehe das anders.* | Je vois ça autrement. |

## Justifier
Un avis sans raison ne vaut pas grand-chose. Deux outils :
1. *weil* (parce que) : **verbe à la fin**. *Ich mag das Handy,* **weil** *ich mit meinen Freunden chatten* **kann**.
2. *denn* (car) : **ordre normal**. *Ich mag das Handy,* **denn** *ich* **kann** *mit meinen Freunden chatten.*

## Peser le pour et le contre
- *Einerseits* … *andererseits* … — D’un côté… de l’autre…
- *Der Vorteil ist, dass …* — L’avantage, c’est que…
- *Der Nachteil ist, dass …* — L’inconvénient, c’est que…
- *Aber* … — Mais…

## Exemple travaillé : faut-il interdire le portable au collège ?
*Meiner Meinung nach ist das Handy nützlich, weil man schnell Informationen finden kann. Einerseits kann man mit den Eltern telefonieren, andererseits lenkt es im Unterricht ab. Der Nachteil ist, dass manche Schüler zu viel Zeit online verbringen. Deshalb finde ich, dass man es in der Pause benutzen darf, aber nicht in der Stunde.*

Repère : *Meiner Meinung nach ist* (inversion), *weil … kann* (verbe à la fin), *Einerseits kann man* (inversion), *dass … verbringen* (verbe à la fin).

## Adjectifs pour juger
| Positif | Négatif |
| *interessant, spannend, lustig, nützlich, toll* | *langweilig, gefährlich, blöd, nutzlos, schrecklich* |`,
          },
          questions: [
            ['Quelle phrase est correcte ?', ['Meiner Meinung nach das ist gefährlich.', 'Meiner Meinung nach ist das gefährlich.', 'Meiner Meinung nach das gefährlich ist.', 'Meiner Meinung ist nach das gefährlich.'], 1, '*Meiner Meinung nach* occupe la 1re place : verbe en 2e, sujet derrière.'],
            ['Après « Ich finde, dass … », le verbe conjugué se place…', ['en 2e position', 'en 1re position', 'à la fin', 'juste après dass'], 2, '*dass* introduit une subordonnée : verbe conjugué à la fin.'],
            ['Comment dit-on « Je ne suis pas d’accord » ?', ['Ich bin nicht einverstanden.', 'Ich habe nicht recht.', 'Das stimmt.', 'Ich bin nicht deiner.'], 0, '*einverstanden sein* = être d’accord.'],
            ['Quelle différence entre « weil » et « denn » ?', ['Aucune, les deux envoient le verbe à la fin', 'weil envoie le verbe à la fin, denn garde l’ordre normal', 'denn envoie le verbe à la fin, weil garde l’ordre normal', 'weil s’emploie seulement à l’écrit'], 1, '*weil* est subordonnant ; *denn* est coordonnant, en position zéro.'],
            ['Que signifie « Da hast du recht » ?', ['Là, tu as raison', 'Là, tu as tort', 'Tu as le droit', 'Tu es là'], 0, '*recht haben* = avoir raison.'],
            ['« Einerseits … andererseits » permet de…', ['raconter dans l’ordre', 'peser le pour et le contre', 'poser une question', 'exprimer un souhait'], 1, 'D’un côté… de l’autre : on met deux arguments en balance.'],
            ['« Ich mag Sport, weil er gesund ___. » Quel mot complète la phrase ?', ['ist', 'sein', 'bin', 'sind'], 0, 'Après *weil*, le verbe conjugué *ist* se place à la fin.', 'Quel verbe termine la subordonnée en weil ?'],
            ['Après « Ich finde, », on peut aussi continuer avec une principale sans dass.', ['Vrai', 'Faux'], 0, '*Ich finde, das Buch ist spannend* est correct : sans *dass*, le verbe reste 2e.'],
            ['Que signifie « der Nachteil » ?', ['L’avantage', 'L’inconvénient', 'La nuit', 'La conclusion'], 1, '*der Vorteil* = l’avantage, *der Nachteil* = l’inconvénient.'],
            ['Quel adjectif est négatif ?', ['spannend', 'nützlich', 'langweilig', 'lustig'], 2, '*langweilig* = ennuyeux.'],
            ['« Ich sehe das anders » signifie…', ['Je vois mal', 'Je vois ça autrement', 'Je vois la même chose', 'Je regarde ailleurs'], 1, 'Une manière polie d’exprimer son désaccord.'],
            ['Quelle phrase est correcte ?', ['Für mich Sport ist wichtig.', 'Für mich ist Sport wichtig.', 'Für mich ist wichtig Sport ist.', 'Sport für mich wichtig ist.'], 1, '*Für mich* en tête : inversion, le verbe *ist* en 2e position.'],
          ],
        },
      ],
    },
  ],
}
