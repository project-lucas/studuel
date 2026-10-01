// Allemand 2de — ce qui est PROPRE à la Seconde, en plus des 36 fiches de langue.
//
// CONSTAT (extraction du 26/09/2026) : la 3e, la 2de, la 1re et la Tle avaient
// EXACTEMENT les mêmes 36 fiches de grammaire. Rien sur les axes culturels de
// la Seconde, rien sur les points de langue que le programme de 2de ajoute.
//
// LE PROGRAMME : arrêté du 5 mai 2025, BO n° 22 du 29 mai 2025, en vigueur en
// Seconde depuis la rentrée 2025. Six axes culturels, dont le sixième propre à
// l'aire germanophone (« Les pays germanophones au carrefour de l'Europe ») ;
// niveau visé A2+/B1 (LVB), B1+ (LVA). Les points de langue retenus ici sont
// tirés des « Repères linguistiques » du même programme et absents des 36
// fiches existantes : subjonctif II passé, rection prépositionnelle, pronoms
// en da- et wo-, genre des noms, masculins faibles, cause et conséquence.
//
// Deux blocs : rayon 'culture' (37 → 42), rayon 'langue' (43 → 48).
// Convention de la maison : la langue s'interroge EN FRANÇAIS.

export default {
  slug: 'allemand',
  nom: 'Allemand',

  titreMigration: 'ALLEMAND 2de — AXES CULTURELS ET LANGUE B1 (programme 2025)',

  motif: `CONSTAT : la 2de d'allemand portait exactement les mêmes 36 fiches de
grammaire que la 3e, la 1re et la Tle. Le programme de Seconde (arrêté du 5 mai
2025, BO n° 22 du 29 mai 2025) fixe six axes culturels, dont un propre à l'aire
germanophone, et des repères de langue de niveau B1. Cette migration AJOUTE
12 fiches propres à la 2de — une par axe, et six fiches de langue absentes de
l'existant — derrière les 36 fiches, sans rien retirer.`,

  blocs: [
    // =====================================================================
    // RAYON CULTURE — les six axes de la Seconde
    // =====================================================================
    {
      niveaux: ['2de'],
      positionDepart: 37,
      rayon: 'culture',
      chapitres: [
        {
          titre: 'Se montrer, être vu : emblèmes, Tracht et autoportraits',
          axe: 'Représentation de soi et rapport à autrui',
          lecon: {
            titre: 'Comment les germanophones se voient — et se montrent',
            cours: `Ordre, ponctualité, bière et Lederhose : l’image des Allemands est pleine de clichés. Cet axe t’invite à regarder comment ils se représentent eux-mêmes, et ce que cela dit de leur rapport aux autres.

## Des emblèmes discrets dans des pays fédéraux
| Pays | Drapeau | À savoir |
| Allemagne | noir, rouge, or | couleurs de la démocratie de 1848, reprises par la République de Weimar puis par la RFA en 1949 |
| Autriche | rouge, blanc, rouge | l’un des plus anciens drapeaux d’Europe |
| Suisse | croix blanche sur fond rouge | 26 cantons, chacun avec ses armoiries |

L’hymne allemand est la **troisième strophe** du *Deutschlandlied* (« *Einigkeit und Recht und Freiheit* »), sur une mélodie de Haydn. Après 1945, l’Allemagne affiche peu ses symboles nationaux : le patriotisme y est resté longtemps suspect. On se sent souvent d’abord Bavarois, Saxon ou Hambourgeois : chaque **Land** a son drapeau, son accent, ses fêtes. Le drapeau est revenu en force en 2006, lors de la Coupe du monde organisée en Allemagne : on a parlé de « patriotisme de fête ».

## Le Tracht, identité ou mode ?
Le *Dirndl* (robe) et la *Lederhose* (culotte de cuir) sont des costumes régionaux de Bavière et d’Autriche. Longtemps vêtements de paysans, ils sont redevenus à la mode, portés par des jeunes à l’**Oktoberfest** de Munich (depuis 1810). Signe d’appartenance à une région, ou déguisement touristique ? Le débat dit beaucoup du rapport à la tradition.

## L’autoportrait, se mettre en scène
En 1500, **Albrecht Dürer** se peint de face, cheveux longs, main sur la poitrine : une pose réservée jusque-là au Christ. L’artiste affirme sa dignité de créateur. Quatre siècles plus tard, l’Autrichien **Egon Schiele** (1890–1918) se représente maigre, tordu, presque nu : l’autoportrait devient l’aveu d’un malaise intérieur.

> Se représenter, c’est choisir ce qu’on montre et ce qu’on cache : un autoportrait, un drapeau, un costume parlent autant de l’image voulue que de la réalité.

## « Zweite Heimat » : s’écrire entre deux cultures
De nombreux auteurs germanophones ont une histoire migratoire. **Saša Stanišić**, né en Bosnie et arrivé enfant en Allemagne, raconte dans *Herkunft* (« Origine », prix du livre allemand 2019) ce que veut dire appartenir à deux pays. La *Heimat* n’est plus seulement le lieu de naissance, mais un lieu choisi.

## Vocabulaire
| Allemand | Français |
| *das Selbstbild* | l’image de soi |
| *das Klischee, das Vorurteil* | le cliché, le préjugé |
| *das Wappen* | les armoiries |
| *die Tracht* | le costume traditionnel |
| *das Selbstporträt* | l’autoportrait |
| *die Herkunft* | l’origine |
| *sich darstellen* | se représenter |

## Expressions
- *Man sagt oft, dass die Deutschen pünktlich sind.* — On dit souvent que…
- *Das ist ein Klischee.* — C’est un cliché.
- *Ich fühle mich eher als Bayer.* — Je me sens plutôt Bavarois.`,
          },
          questions: [
            ['Quelles sont les couleurs du drapeau allemand ?', ['Noir, rouge, or', 'Rouge, blanc, rouge', 'Noir, blanc, rouge', 'Bleu, blanc, rouge'], 0, 'Le noir-rouge-or remonte à la révolution démocratique de 1848.'],
            ['L’hymne allemand actuel est…', ['la première strophe du Deutschlandlied', 'la troisième strophe du Deutschlandlied', 'l’Ode à la joie', 'un chant composé en 1990'], 1, 'Seule la troisième strophe (« *Einigkeit und Recht und Freiheit* ») est chantée depuis la RFA.'],
            ['Pourquoi Dürer choque-t-il en 1500 avec son autoportrait ?', ['Il se peint nu', 'Il prend une pose réservée au Christ', 'Il se peint en roi', 'Il se peint en caricature'], 1, 'De face, main sur la poitrine : l’artiste revendique la dignité de créateur.'],
            ['Egon Schiele était un peintre…', ['suisse', 'autrichien', 'bavarois', 'prussien'], 1, 'Figure de l’expressionnisme viennois, mort en 1918 à 28 ans.'],
            ['Le Dirndl et la Lederhose sont des costumes traditionnels…', ['de la Frise', 'de Bavière et d’Autriche', 'de Berlin', 'de Saxe'], 1, 'Ce sont les *Trachten* de l’espace alpin, portées notamment à l’Oktoberfest.'],
            ['Que signifie « das Vorurteil » ?', ['Le préjugé', 'Le jugement', 'L’avant-propos', 'L’avantage'], 0, '*vor* (avant) + *Urteil* (jugement) : un jugement porté avant de connaître.'],
            ['Après 1945, les Allemands ont longtemps affiché peu leurs symboles nationaux.', ['Vrai', 'Faux'], 0, 'Le patriotisme était suspect après le nazisme ; le drapeau est revenu en masse en 2006.'],
            ['Quel événement a vu le retour massif du drapeau dans les rues allemandes ?', ['La réunification de 1990', 'La Coupe du monde de football 2006', 'Les JO de 1972', 'L’euro en 2002'], 1, 'Organisée en Allemagne, la Coupe du monde 2006 a lancé un « patriotisme de fête ».'],
            ['Dans « Herkunft », Saša Stanišić raconte…', ['la vie à la cour de Vienne', 'son enfance entre la Bosnie et l’Allemagne', 'la chute du Mur', 'un conte de Grimm'], 1, 'Le livre, prix du livre allemand 2019, interroge l’appartenance à deux pays.'],
            ['Comment dit-on « l’autoportrait » ?', ['das Selbstbild', 'das Selbstporträt', 'das Eigenbild', 'die Selbstdarstellung'], 1, '*das Selbstbild* est l’image de soi, au sens psychologique.'],
            ['« Ich fühle mich eher als Bayer » exprime…', ['une identité régionale', 'un rejet de l’Allemagne', 'une nationalité étrangère', 'un cliché sur les Bavarois'], 0, 'Dans un pays fédéral, l’identité régionale compte souvent autant que la nationale.'],
            ['Combien de cantons compte la Suisse ?', ['16', '9', '26', '12'], 2, 'La Suisse compte 26 cantons ; l’Allemagne 16 Länder, l’Autriche 9.'],
          ],
        },

        {
          titre: 'Jeunes et vieux : de 1968 aux maisons multigénérations',
          axe: 'Vivre entre générations',
          lecon: {
            titre: 'Conflit, transmission et nouvelles façons de vivre ensemble',
            cours: `Rarement un pays a vu ses générations s’opposer aussi fort que l’Allemagne de 1968 — et rarement un pays a autant besoin de les faire vivre ensemble, tant sa population vieillit.

## 1968 : « Trau keinem über 30! »
À la fin des années 1960, les étudiants ouest-allemands se révoltent. Leur slogan : « Ne fais confiance à personne de plus de 30 ans ». Au-delà de la guerre du Vietnam et de l’autorité, ils posent une question brûlante à leurs parents : **qu’avez-vous fait sous le nazisme ?** Beaucoup d’anciens nazis occupaient encore des postes importants. Le mouvement, porté par **Rudi Dutschke**, a profondément changé la société : éducation moins autoritaire, travail de mémoire, place des femmes.

## Grandir dans une dynastie
| Famille | Qui ? | Ce qu’on hérite |
| **Bach** | Jean-Sébastien Bach et plusieurs fils compositeurs (Carl Philipp Emanuel, Johann Christian) | le métier, un nom immense |
| **Mann** | Thomas Mann (prix Nobel 1929), ses enfants Klaus et Erika, écrivains eux aussi | la célébrité, l’exil, le poids du père |

Hériter d’un grand nom est une chance… et un fardeau : comment exister face au père ?

## Une société qui vieillit
L’Allemagne est l’un des pays les plus âgés du monde : l’âge médian y dépasse 45 ans. D’où de grandes questions : qui paiera les retraites (*der Generationenvertrag*, le « contrat entre générations ») ? Qui soignera les personnes âgées ?

## Vivre ensemble autrement
| Forme | Principe |
| *das Mehrgenerationenhaus* | maison ouverte où jeunes, familles et seniors se rencontrent, soutenue par l’État depuis 2006 |
| *die Senioren-WG* | colocation (*Wohngemeinschaft*) de personnes âgées |
| *Wohnen für Hilfe* | un étudiant loge chez un senior contre de l’aide |

## Un nouveau conflit ?
Avec **Fridays for Future** (Luisa Neubauer en Allemagne), les jeunes reprochent aux anciens de leur laisser une planète abîmée. Certains parlent d’un *Kampf der Generationen* ; d’autres rappellent que les grands-parents manifestent aussi (*Omas for Future*).

> Chaque génération se définit contre la précédente, mais aussi grâce à elle : le conflit est une forme de transmission.

## Vocabulaire
| Allemand | Français |
| *die Generation* | la génération |
| *die Großeltern, die Enkel* | les grands-parents, les petits-enfants |
| *der Generationenkonflikt* | le conflit de générations |
| *die Rente* | la retraite |
| *die Wohngemeinschaft (WG)* | la colocation |
| *sich gegen jn auflehnen* | se révolter contre qqn |
| *weitergeben* | transmettre |

## Expressions
- *Die Jugend von heute…* — La jeunesse d’aujourd’hui…
- *Wir können voneinander lernen.* — Nous pouvons apprendre les uns des autres.`,
          },
          questions: [
            ['Que signifie le slogan « Trau keinem über 30! » ?', ['Ne fais confiance à personne de plus de 30 ans', 'Il faut avoir 30 ans pour voter', 'Tout change après 30 ans', 'Trente ans de paix'], 0, 'Slogan des étudiants de 1968, en rupture avec la génération de leurs parents.'],
            ['Quelle question les jeunes de 1968 posaient-ils avec insistance à leurs parents ?', ['Leur rôle sous le nazisme', 'Leur salaire', 'Leur religion', 'Leur vote en 1990'], 0, 'Le silence sur le passé nazi était au cœur de la révolte.'],
            ['Qui fut une figure du mouvement étudiant ouest-allemand ?', ['Willy Brandt', 'Rudi Dutschke', 'Helmut Kohl', 'Konrad Adenauer'], 1, 'Rudi Dutschke en était le porte-parole le plus connu.'],
            ['Thomas Mann a reçu le prix Nobel de littérature en…', ['1901', '1929', '1946', '1972'], 1, 'Pour *Les Buddenbrook*, notamment ; ses enfants Klaus et Erika ont aussi écrit.'],
            ['Qu’est-ce qu’un « Mehrgenerationenhaus » ?', ['Une maison de retraite fermée', 'Un lieu ouvert où les générations se rencontrent', 'Une école maternelle', 'Un immeuble réservé aux étudiants'], 1, '*mehr* (plusieurs) + *Generationen* + *Haus* : un lieu de rencontre entre générations.'],
            ['Que désigne « der Generationenvertrag » ?', ['Un traité de paix', 'Le principe selon lequel les actifs paient les retraites des anciens', 'Un contrat de travail', 'Un héritage'], 1, 'C’est la base du système de retraite par répartition.'],
            ['L’âge médian en Allemagne dépasse 45 ans.', ['Vrai', 'Faux'], 0, 'L’Allemagne est l’un des pays les plus âgés du monde.'],
            ['Que signifie « die Enkel » ?', ['Les oncles', 'Les petits-enfants', 'Les ancêtres', 'Les cousins'], 1, '*der Enkel / die Enkelin* : le petit-fils, la petite-fille.'],
            ['Quelle famille de musiciens a compté plusieurs fils compositeurs ?', ['Mann', 'Bach', 'Grimm', 'Brecht'], 1, 'Carl Philipp Emanuel et Johann Christian Bach sont célèbres à leur tour.'],
            ['Comment dit-on « la colocation » ?', ['die Wohngemeinschaft', 'die Wohnung', 'die Gemeinde', 'das Wohnheim'], 0, 'Abrégé en *WG* : une communauté de logement.'],
            ['« Wohnen für Hilfe » désigne…', ['une aide au logement de l’État', 'un étudiant logé chez un senior contre de l’aide', 'une maison de retraite', 'un service de déménagement'], 1, 'Un logement contre des services : une solidarité concrète entre générations.'],
            ['Que signifie « weitergeben » ?', ['Abandonner', 'Transmettre', 'Recevoir', 'Oublier'], 1, '*weiter* (plus loin) + *geben* (donner) : faire passer à d’autres.'],
          ],
        },

        {
          titre: 'Vivre avec son histoire : mémoire, Ostalgie et traditions',
          axe: 'Le passé dans le présent',
          lecon: {
            titre: 'Un passé qui ne passe pas, un passé qu’on regrette',
            cours: `En Allemagne, le passé n’est jamais vraiment passé : il est gravé dans les trottoirs, discuté à l’école, réinventé dans les romans. Il peut peser, et il peut manquer.

## L’Aufarbeitung : regarder les crimes en face
Le mot *Aufarbeitung der Vergangenheit* (le « travail sur le passé ») désigne l’effort de l’Allemagne pour assumer les crimes du régime **national-socialiste** et la **Shoah**. Cela n’a pas été immédiat : il a fallu les procès d’Auschwitz à Francfort (1963–1965), la révolte de 1968, et des gestes forts comme l’agenouillement du chancelier **Willy Brandt** devant le mémorial du ghetto de Varsovie (1970).

| Lieu de mémoire | Ce que c’est |
| *das Denkmal für die ermordeten Juden Europas* (Berlin, 2005) | 2 711 stèles de béton près de la porte de Brandebourg |
| *die Stolpersteine* | pavés de laiton posés devant le dernier domicile d’une victime, par l’artiste Gunter Demnig |
| les camps (Dachau, Buchenwald…) | devenus des mémoriaux visités par les classes |

> « Un homme n’est oublié que lorsque son nom est oublié » : c’est l’idée des *Stolpersteine*, sur lesquels on « trébuche » du regard.

## L’Ostalgie : la nostalgie de la RDA
Après la réunification (1990), certains Allemands de l’Est regrettent des éléments de leur vie en RDA : les produits, la solidarité, la sécurité de l’emploi — sans regretter la dictature ni la Stasi. C’est l’*Ostalgie* (*Ost* + *Nostalgie*). Le film *Good Bye, Lenin!* (2003) en a fait une comédie tendre. Le petit bonhomme des feux piétons de l’Est, l’*Ampelmännchen*, a été sauvé par la mobilisation des Berlinois. Aujourd’hui, des romans (*Ostromane*) racontent cette histoire.

## Des friches aux musées
Dans la **Ruhr**, les mines et aciéries ont fermé. La mine de charbon **Zollverein** à Essen est devenue un site culturel classé au patrimoine mondial de l’UNESCO (2001). La Lusace, à l’est, cherche encore son avenir après le charbon.

## Des traditions qui durent
L’*Abiball* (bal du bac en Allemagne) ou le *Maturaball* (en Autriche) montrent qu’une tradition peut se réinventer à chaque génération.

## Vocabulaire
| Allemand | Français |
| *die Vergangenheit* | le passé |
| *die Erinnerung* | le souvenir, la mémoire |
| *das Denkmal, das Mahnmal* | le monument, le mémorial |
| *die Schuld* | la culpabilité, la faute |
| *die Wiedervereinigung* | la réunification |
| *sich erinnern an* + acc. | se souvenir de |
| *das Erbe* | l’héritage |

## Expressions
- *Man darf nicht vergessen, dass…* — On ne doit pas oublier que…
- *Das erinnert an…* — Cela rappelle…`,
          },
          questions: [
            ['Que désigne « die Aufarbeitung der Vergangenheit » ?', ['La reconstruction des villes', 'Le travail de l’Allemagne pour assumer son passé', 'Un cours d’histoire', 'La réunification'], 1, 'C’est l’effort collectif pour affronter les crimes du national-socialisme.'],
            ['Que sont les « Stolpersteine » ?', ['Des pavés portant le nom de victimes du nazisme', 'Des murs de Berlin', 'Des tombes de soldats', 'Des statues de rois'], 0, 'Posés devant le dernier domicile choisi librement par la victime, ils rappellent un nom.'],
            ['Quel chancelier s’est agenouillé à Varsovie en 1970 ?', ['Konrad Adenauer', 'Helmut Schmidt', 'Willy Brandt', 'Helmut Kohl'], 2, 'Ce geste de Willy Brandt est devenu un symbole de la reconnaissance des crimes allemands.'],
            ['Le mémorial aux Juifs assassinés d’Europe se trouve à…', ['Munich', 'Berlin', 'Nuremberg', 'Francfort'], 1, 'Inauguré en 2005 près de la porte de Brandebourg.'],
            ['Que signifie « Ostalgie » ?', ['La nostalgie de certains aspects de la vie en RDA', 'La haine de l’Est', 'Un parti politique', 'Une tradition bavaroise'], 0, '*Ost* + *Nostalgie* : le regret de certains aspects de la vie à l’Est.'],
            ['Regretter certains aspects de la vie en RDA signifie forcément regretter la dictature.', ['Vrai', 'Faux'], 1, 'L’Ostalgie vise souvent les objets et la vie quotidienne, pas la Stasi ni le régime.'],
            ['Quel film de 2003 a évoqué l’Ostalgie avec humour ?', ['La Vie des autres', 'Good Bye, Lenin!', 'Cours, Lola, cours', 'Le Tambour'], 1, 'Un fils recrée la RDA dans l’appartement de sa mère après la chute du Mur.'],
            ['Qu’est-ce que l’« Ampelmännchen » ?', ['Le bonhomme des feux piétons de l’Est', 'Un gâteau de Noël', 'Une marionnette de la télévision', 'Une mascotte de football'], 0, 'Symbole sauvé après la réunification, il est devenu une marque populaire.'],
            ['La mine Zollverein, classée à l’UNESCO, se trouve…', ['en Lusace', 'dans la Ruhr, à Essen', 'à Hambourg', 'en Bavière'], 1, 'Ancienne mine de charbon devenue site culturel.'],
            ['Que signifie « das Mahnmal » ?', ['Le repas du soir', 'Le mémorial qui avertit', 'La cathédrale', 'L’hôtel de ville'], 1, '*mahnen* = avertir, exhorter : un monument qui met en garde.'],
            ['« Ich erinnere mich ___ meine Kindheit. » Quel mot complète la phrase ?', ['auf', 'an', 'über', 'von'], 1, '*sich erinnern an* + accusatif : se souvenir de.', 'Quelle préposition après sich erinnern ?'],
            ['Que désigne l’« Abiball » ?', ['Le bal du bac', 'Un match de football', 'La fête du 3 octobre', 'Un bal de mariage'], 0, 'Le bal qui fête l’*Abitur* ; en Autriche, on parle de *Maturaball*.'],
          ],
        },

        {
          titre: 'Énergie, démographie, démocratie : les défis allemands',
          axe: 'Défis et transitions',
          lecon: {
            titre: 'Comment l’Allemagne répond aux crises',
            cours: `Sortir du nucléaire, vieillir sans s’appauvrir, défendre une démocratie née des ruines : l’Allemagne mène plusieurs transitions à la fois.

## L’Energiewende, le tournant énergétique
| Date | Étape |
| 2000 | Loi favorisant les énergies renouvelables (*EEG*) |
| 2011 | Après la catastrophe de Fukushima, décision de sortir du nucléaire |
| avril 2023 | Arrêt des trois derniers réacteurs |
| 2038 au plus tard | Sortie prévue du charbon |

Aujourd’hui, **plus de la moitié** de l’électricité allemande vient des renouvelables (éolien, solaire, biomasse). Mais la transition coûte cher, le réseau doit être reconstruit du nord (vent) vers le sud (industrie), et le pays dépend encore du charbon et du gaz.

> L’Energiewende montre qu’une transition est un choix politique : on gagne sur un plan (le risque nucléaire), on paie sur un autre (le prix, le charbon).

## La crise démographique
L’Allemagne fait peu d’enfants (environ 1,4 par femme) et vit longtemps. Conséquences : manque de main-d’œuvre qualifiée (*der Fachkräftemangel*), retraites difficiles à financer (*die Rentenreform*). Une des réponses est l’**immigration** de travailleurs qualifiés.

## Éduquer à la démocratie
Après le nazisme, la RFA a voulu une **démocratie capable de se défendre** (*wehrhafte Demokratie*) : la Loi fondamentale de 1949 commence par « *Die Würde des Menschen ist unantastbar* » (la dignité humaine est intangible). À l’école, l’éducation politique (*politische Bildung*) apprend à débattre ; une agence fédérale, la *Bundeszentrale für politische Bildung*, publie des ressources pour tous.

## Défis locaux : l’avenir des stations de ski
Avec le réchauffement, la neige manque dans les Alpes bavaroises et autrichiennes : canons à neige, ou reconversion vers la randonnée et le VTT ?

## Vocabulaire
| Allemand | Français |
| *die Energiewende* | la transition énergétique |
| *erneuerbare Energien* | les énergies renouvelables |
| *das Kernkraftwerk (AKW)* | la centrale nucléaire |
| *der Klimawandel* | le changement climatique |
| *der Fachkräftemangel* | la pénurie de main-d’œuvre qualifiée |
| *die Herausforderung* | le défi |
| *die Würde* | la dignité |

## Expressions
- *Wir stehen vor einer großen Herausforderung.* — Nous sommes face à un grand défi.
- *Es lohnt sich, …* — Cela vaut la peine de…`,
          },
          questions: [
            ['Que signifie « die Energiewende » ?', ['La crise de l’énergie', 'Le tournant énergétique', 'Le prix de l’énergie', 'Une centrale électrique'], 1, '*die Wende* = le tournant : le passage aux renouvelables et la sortie du nucléaire.'],
            ['Quel événement a poussé l’Allemagne à décider de sortir du nucléaire en 2011 ?', ['Tchernobyl', 'Fukushima', 'La chute du Mur', 'La crise financière'], 1, 'La catastrophe de Fukushima a accéléré la décision du gouvernement Merkel.'],
            ['En quelle année les derniers réacteurs allemands ont-ils été arrêtés ?', ['2011', '2019', '2023', '2038'], 2, 'Les trois derniers ont fermé en avril 2023.'],
            ['Que désigne « der Fachkräftemangel » ?', ['Le chômage des jeunes', 'La pénurie de main-d’œuvre qualifiée', 'Le manque d’écoles', 'La baisse des salaires'], 1, '*die Fachkraft* = le travailleur qualifié ; *der Mangel* = le manque.'],
            ['Par quelle phrase commence la Loi fondamentale allemande ?', ['Wir sind das Volk', 'Die Würde des Menschen ist unantastbar', 'Einigkeit und Recht und Freiheit', 'Alle Macht dem Volke'], 1, 'L’article 1 place la dignité humaine au sommet.'],
            ['Plus de la moitié de l’électricité allemande vient aujourd’hui des renouvelables.', ['Vrai', 'Faux'], 0, 'Éolien, solaire et biomasse dépassent désormais la moitié de la production.'],
            ['Que veut dire « wehrhafte Demokratie » ?', ['Une démocratie armée pour la guerre', 'Une démocratie capable de se défendre contre ses ennemis', 'Une démocratie directe', 'Une monarchie'], 1, 'Leçon de Weimar : la démocratie se donne les moyens d’interdire ce qui veut la détruire.'],
            ['Comment dit-on « la centrale nucléaire » ?', ['das Kernkraftwerk', 'das Kraftwerkkern', 'die Atomstadt', 'das Windrad'], 0, 'Abrégé *AKW* (*Atomkraftwerk*) dans la langue courante.'],
            ['Jusqu’à quand l’Allemagne prévoit-elle au plus tard de sortir du charbon ?', ['2025', '2030', '2038', '2050'], 2, 'La loi fixe 2038 au plus tard.'],
            ['Que signifie « die Herausforderung » ?', ['Le défi', 'La sortie', 'La demande', 'La victoire'], 0, 'Un mot clé de l’axe : *vor einer Herausforderung stehen*, être face à un défi.'],
            ['Quel est le taux de fécondité approximatif en Allemagne ?', ['2,5', '1,4', '3,0', '0,8'], 1, 'Autour de 1,4 enfant par femme, en dessous du seuil de renouvellement.'],
            ['Quel problème touche les stations de ski des Alpes ?', ['Le manque de neige dû au réchauffement', 'L’interdiction du ski', 'La fermeture des frontières', 'Le manque de touristes étrangers'], 0, 'Le réchauffement pousse à se reconvertir vers d’autres activités.'],
          ],
        },

        {
          titre: 'Loreley, Faust, forêts de Grimm : les mythes revisités',
          axe: 'Créer et recréer',
          lecon: {
            titre: 'Des légendes sans cesse réinventées',
            cours: `L’imaginaire allemand est peuplé de sirènes, de savants qui vendent leur âme et de forêts inquiétantes. Chaque époque les reprend et les transforme : c’est tout l’enjeu de « créer et recréer ».

## La Loreley
Un rocher du Rhin, un passage dangereux pour les bateliers… En **1801**, le poète **Clemens Brentano** invente la figure d’une jeune femme, Lore Lay. En **1824**, **Heinrich Heine** en fait une sirène qui peigne ses cheveux d’or et fait sombrer les bateliers : « *Ich weiß nicht, was soll es bedeuten, / Dass ich so traurig bin* ». Mis en musique par Friedrich Silcher, le poème devient une chanson que tous les Allemands connaissent. Aujourd’hui, le rocher attire les touristes, et la Loreley apparaît dans des chansons pop et des publicités.

## Faust, le savant qui vend son âme
| Version | Ce qui change |
| Un vrai Faust (vers 1480–1541) | un alchimiste et charlatan réel |
| Le *Volksbuch* de 1587 | Faust signe un pacte avec le diable et est damné |
| **Goethe**, *Faust I* (1808) | Faust, avide de connaissance, parie avec Méphisto ; l’histoire de Gretchen devient une tragédie |
| Opéras, films, BD… | la figure du chercheur prêt à tout |

La phrase de Goethe « *Zwei Seelen wohnen, ach! in meiner Brust* » (deux âmes habitent, hélas, ma poitrine) dit le déchirement humain. Le mot *faustisch* qualifie une ambition sans limite.

## La forêt, lieu mythique
Dans les *Contes de l’enfance et du foyer* (**1812**) des frères **Grimm**, la forêt est le lieu de l’épreuve : Hänsel et Gretel s’y perdent, le Petit Chaperon rouge y rencontre le loup. Les romantiques y voient un refuge mystérieux (*die Waldeinsamkeit*, la solitude de la forêt). En 2017, la série allemande *Dark* place ses grottes et ses disparitions d’enfants dans une forêt autour de la ville fictive de Winden.

## Siegfried et le marketing
Le héros de la *Chanson des Nibelungen* (vers 1200), vainqueur du dragon, inspire Wagner… et aujourd’hui des marques, des jeux vidéo, des bières. Le mythe devient produit.

> Recréer n’est pas copier : chaque reprise d’un mythe en dit autant sur l’époque qui le reprend que sur le mythe lui-même.

## Vocabulaire
| Allemand | Français |
| *die Sage, die Legende* | la légende |
| *das Märchen* | le conte |
| *der Teufel* | le diable |
| *der Pakt* | le pacte |
| *die Hexe* | la sorcière |
| *der Wald* | la forêt |
| *neu interpretieren* | réinterpréter |`,
          },
          questions: [
            ['Qui a écrit le célèbre poème de la Loreley en 1824 ?', ['Goethe', 'Heinrich Heine', 'Schiller', 'Brecht'], 1, 'Heine en fait une sirène fatale ; Brentano avait inventé la figure en 1801.'],
            ['La Loreley est liée à quel fleuve ?', ['Le Danube', 'L’Elbe', 'Le Rhin', 'L’Oder'], 2, 'C’est un rocher du Rhin moyen, passage autrefois dangereux.'],
            ['Dans le Faust de Goethe, qui est Méphisto ?', ['Le frère de Faust', 'Le diable avec qui Faust fait un pari', 'Un professeur', 'Le père de Gretchen'], 1, 'Méphistophélès, figure du diable, parie qu’il satisfera Faust.'],
            ['En quelle année paraît Faust I ?', ['1587', '1808', '1900', '1945'], 1, 'Goethe publie la première partie en 1808.'],
            ['Que signifie l’adjectif « faustisch » ?', ['Qui a une ambition sans limite', 'Qui est paresseux', 'Qui croit aux fées', 'Qui aime la forêt'], 0, 'Il décrit une soif de savoir et de pouvoir qui ne connaît pas de bornes.'],
            ['Les frères Grimm ont publié leurs contes en…', ['1701', '1812', '1871', '1920'], 1, 'Première édition des *Kinder- und Hausmärchen* en 1812.'],
            ['Dans quelle série allemande la forêt de Winden joue-t-elle un rôle central ?', ['Babylon Berlin', 'Dark', 'Tatort', 'Die Welle'], 1, 'Série de 2017, qui mêle voyages dans le temps et forêt inquiétante.'],
            ['Que signifie « das Märchen » ?', ['Le marché', 'Le conte', 'La légende historique', 'Le roman'], 1, '*das Märchen* est un conte merveilleux ; *die Sage* rattache la légende à un lieu ou un personnage.'],
            ['Siegfried est le héros de…', ['la Chanson des Nibelungen', 'Faust', 'la Loreley', 'Hänsel et Gretel'], 0, 'Épopée médiévale (vers 1200), reprise notamment par Wagner.'],
            ['Faust a réellement existé comme personnage historique.', ['Vrai', 'Faux'], 0, 'Un Johann Georg Faust, alchimiste et charlatan, a vécu au XVIe siècle.'],
            ['Comment dit-on « la sorcière » ?', ['die Hexe', 'die Fee', 'die Göttin', 'die Heldin'], 0, 'La sorcière de Hänsel et Gretel est *die Hexe*.'],
            ['Que révèle la reprise d’un mythe à une nouvelle époque ?', ['Rien, c’est une simple copie', 'Les préoccupations de l’époque qui le reprend', 'Seulement l’époque d’origine', 'Que le mythe est vrai'], 1, 'Chaque réinterprétation reflète les valeurs et les peurs de son temps.'],
          ],
        },

        {
          titre: 'Au cœur de l’Europe : de la Hanse au couple franco-allemand',
          axe: 'Les pays germanophones au carrefour de l’Europe',
          lecon: {
            titre: 'Un espace entre l’Ouest et l’Est',
            cours: `L’Allemagne a neuf voisins, plus que tout autre pays d’Europe. Placée entre l’Ouest et l’Est, l’aire germanophone a été un champ de bataille, puis un moteur de la construction européenne.

## Au milieu de l’Europe
| Voisins de l’Allemagne |
| le Danemark, la Pologne, la Tchéquie, l’Autriche, la Suisse, la France, le Luxembourg, la Belgique, les Pays-Bas |

L’expression *Mitteleuropa* (Europe du milieu) désigne cet espace. Les grands fleuves — Rhin, Danube, Elbe, Oder — relient la mer du Nord, la Baltique et la mer Noire.

## La Hanse, une mondialisation avant l’heure
Du XIIe au XVIIe siècle, la **Hanse** réunit des villes marchandes autour de la mer du Nord et de la Baltique : **Lübeck** (sa « reine »), Hambourg, Brême, mais aussi des comptoirs à Londres, Bruges, Bergen ou Novgorod. Elles commercent le sel, le hareng, le bois, les fourrures. Aujourd’hui encore, les plaques d’immatriculation de Hambourg (**HH**) et de Brême (**HB**) rappellent la *Hansestadt*.

## D’ennemis à partenaires
Après trois guerres (1870, 1914, 1939), la France et l’Allemagne fondent ensemble la construction européenne :
| Date | Étape |
| 1951 | Communauté européenne du charbon et de l’acier (CECA) |
| 1957 | Traités de Rome : naissance de la CEE |
| 1963 | Traité de l’Élysée |
| 2002 | L’euro remplace le mark |

On parle de **couple franco-allemand**, parfois de « moteur » de l’Europe. Est-ce une relation exclusive ? D’autres partenaires comptent de plus en plus.

## À l’Est, du nouveau
Depuis la chute du rideau de fer (1989) et l’élargissement de l’Union européenne (2004), la **Pologne**, la Tchéquie ou la Hongrie sont devenues des partenaires économiques majeurs de l’Allemagne. Les usines s’y sont installées, les échanges d’étudiants se multiplient.

## L’Allemagne, locomotive de l’UE ?
Première économie de l’Union, pays le plus peuplé (environ 84 millions d’habitants), l’Allemagne pèse lourd dans les décisions européennes. Ses voisins attendent qu’elle entraîne, mais craignent qu’elle domine.

> Être au carrefour, c’est être traversé par tous les conflits… et pouvoir relier tous les partenaires.

## Vocabulaire
| Allemand | Français |
| *der Nachbar, das Nachbarland* | le voisin, le pays voisin |
| *die Grenze* | la frontière |
| *der Handel* | le commerce |
| *die Europäische Union (EU)* | l’Union européenne |
| *die Zusammenarbeit* | la coopération |
| *die Versöhnung* | la réconciliation |
| *der Binnenmarkt* | le marché intérieur |`,
          },
          questions: [
            ['Combien de pays voisins l’Allemagne a-t-elle ?', ['5', '7', '9', '12'], 2, 'Neuf voisins : Danemark, Pologne, Tchéquie, Autriche, Suisse, France, Luxembourg, Belgique, Pays-Bas.'],
            ['Quelle ville était surnommée la « reine de la Hanse » ?', ['Hambourg', 'Lübeck', 'Berlin', 'Cologne'], 1, 'Lübeck présidait les assemblées de la Hanse.'],
            ['Que rappelle le « H » des plaques HH et HB ?', ['Hauptstadt', 'Hansestadt', 'Hafen', 'Heimat'], 1, 'Hambourg et Brême sont des villes hanséatiques.'],
            ['Quels traités fondent la CEE en 1957 ?', ['Les traités de Rome', 'Le traité de Maastricht', 'Le traité de l’Élysée', 'Le traité de Versailles'], 0, 'Signés par six pays, dont la France et la RFA.'],
            ['La Hanse était avant tout…', ['une alliance militaire', 'une association de villes marchandes', 'une dynastie royale', 'une Église'], 1, 'Un réseau commercial autour de la mer du Nord et de la Baltique.'],
            ['Que signifie « die Versöhnung » ?', ['La réconciliation', 'La guerre', 'La frontière', 'Le commerce'], 0, 'Mot clé de la relation franco-allemande après 1945.'],
            ['En quelle année l’euro a-t-il remplacé le mark dans les porte-monnaie ?', ['1990', '1999', '2002', '2007'], 2, 'Les pièces et billets en euros circulent depuis le 1er janvier 2002.'],
            ['L’Allemagne est le pays le plus peuplé de l’Union européenne.', ['Vrai', 'Faux'], 0, 'Environ 84 millions d’habitants.'],
            ['Quel pays de l’Est est devenu un partenaire économique majeur de l’Allemagne ?', ['La Pologne', 'L’Islande', 'Le Portugal', 'L’Irlande'], 0, 'Depuis son entrée dans l’UE en 2004, la Pologne est un grand partenaire commercial.'],
            ['Comment dit-on « la frontière » ?', ['die Grenze', 'der Grund', 'das Gebiet', 'die Kante'], 0, '*die Grenze* : un mot essentiel pour parler de l’Europe.'],
            ['Que désigne le terme « Mitteleuropa » ?', ['L’Europe méditerranéenne', 'L’Europe du milieu', 'L’Europe du Nord', 'L’Union européenne'], 1, 'L’espace central de l’Europe, entre l’Ouest et l’Est.'],
            ['Que signifie « die Zusammenarbeit » ?', ['La coopération', 'La concurrence', 'Le chômage', 'L’indépendance'], 0, '*zusammen* (ensemble) + *arbeiten* (travailler).'],
          ],
        },
      ],
    },

    // =====================================================================
    // RAYON LANGUE — repères B1 de la Seconde absents de l'existant
    // =====================================================================
    {
      niveaux: ['2de'],
      positionDepart: 43,
      rayon: 'langue',
      chapitres: [
        {
          titre: 'Le subjonctif II passé : regretter et imaginer le passé',
          axe: 'Les temps',
          lecon: {
            titre: 'Wenn ich das gewusst hätte…',
            cours: `Le subjonctif II présent sert à rêver (« si j’avais de l’argent… »). Le subjonctif II **passé** sert à regretter : « si j’avais su… ». C’est l’irréel du passé, qui répond au conditionnel passé français.

## La formation
Deux morceaux, comme le parfait : **hätte** ou **wäre** + **participe II**.
| Au parfait | Au subjonctif II passé | Français |
| *ich habe gewusst* | *ich* **hätte** *gewusst* | j’aurais su |
| *ich bin gekommen* | *ich* **wäre** *gekommen* | je serais venu |
| *wir haben gespielt* | *wir* **hätten** *gespielt* | nous aurions joué |
| *sie ist geblieben* | *sie* **wäre** *geblieben* | elle serait restée |

> Même choix d’auxiliaire qu’au parfait : *haben* devient *hätte*, *sein* devient *wäre*. Rien d’autre à apprendre.

## La conjugaison de hätte et wäre
| | *haben* | *sein* |
| ich | *hätte* | *wäre* |
| du | *hättest* | *wär(e)st* |
| er/sie/es | *hätte* | *wäre* |
| wir | *hätten* | *wären* |
| ihr | *hättet* | *wär(e)t* |
| sie/Sie | *hätten* | *wären* |

## Ses emplois
1. **La condition irréelle du passé** : *Wenn ich das* **gewusst hätte**, **wäre** *ich* **gekommen**. (Si j’avais su, je serais venu.) Les deux parties sont au subjonctif II passé, alors que le français met un plus-que-parfait après « si ».
2. **Le regret** : *Hätte ich doch mehr* **gelernt**! ou *Wenn ich nur mehr gelernt hätte!* (Si seulement j’avais plus travaillé !)
3. **Le reproche** : *Du* **hättest** *mich anrufen sollen.* (Tu aurais dû m’appeler.)
4. **Ce qui a failli arriver** : *Fast* **wäre** *ich* **gefallen**. (J’ai failli tomber.)

## Ordre des mots
Dans la subordonnée en *wenn*, l’auxiliaire **conjugué** vient en dernier : *…, wenn ich Zeit* **gehabt hätte**. La principale qui suit commence par son verbe : *Wenn ich Zeit gehabt hätte,* **hätte** *ich dir* **geholfen**.

## Exemple travaillé
« Si nous étions partis plus tôt, nous n’aurions pas raté le train. »
1. *partir* → *abfahren*, parfait avec *sein* → *wären … abgefahren*.
2. *rater* → *verpassen*, parfait avec *haben* → *hätten … verpasst*.
3. *Wenn wir früher* **abgefahren wären**, **hätten** *wir den Zug nicht* **verpasst**.

## Piège
Ne confonds pas *hätte* (subjonctif, « aurais ») et *hatte* (prétérit, « avais »). Un seul tréma change le sens : *Ich hatte Zeit* = j’avais le temps ; *Ich hätte Zeit gehabt* = j’aurais eu le temps.`,
          },
          questions: [
            ['Comment dit-on « j’aurais su » ?', ['ich hatte gewusst', 'ich hätte gewusst', 'ich würde wissen', 'ich wäre gewusst'], 1, '*wissen* forme son parfait avec *haben* : subjonctif II passé *hätte gewusst*.'],
            ['Comment dit-on « elle serait venue » ?', ['sie hätte gekommen', 'sie wäre gekommen', 'sie war gekommen', 'sie würde gekommen'], 1, '*kommen* se conjugue avec *sein* : *wäre gekommen*.'],
            ['Quelle phrase exprime un regret ?', ['Ich habe mehr gelernt.', 'Hätte ich doch mehr gelernt!', 'Ich lerne mehr.', 'Ich werde mehr lernen.'], 1, '*Hätte ich doch…!* : si seulement j’avais…'],
            ['« Wenn ich Zeit gehabt ___, hätte ich dir geholfen. » Quel mot complète la phrase ?', ['hatte', 'hätte', 'habe', 'wäre'], 1, 'Irréel du passé des deux côtés : *gehabt hätte*.', 'Quel auxiliaire termine la subordonnée en wenn ?'],
            ['Quelle différence entre « hatte » et « hätte » ?', ['Aucune', 'hatte est un prétérit, hätte un subjonctif II', 'hatte est un subjonctif, hätte un prétérit', 'hätte est seulement écrit'], 1, 'Le tréma change le mode : *ich hatte* = j’avais ; *ich hätte* = j’aurais.'],
            ['Comment dit-on « Tu aurais dû m’appeler » ?', ['Du musstest mich anrufen.', 'Du hättest mich anrufen sollen.', 'Du wärst mich angerufen.', 'Du sollst mich anrufen.'], 1, 'Le reproche : *hättest … sollen*, avec *sollen* à l’infinitif en fin de phrase.'],
            ['Au subjonctif II passé, on choisit hätte ou wäre selon l’auxiliaire du parfait.', ['Vrai', 'Faux'], 0, '*haben* → *hätte*, *sein* → *wäre* : c’est le même choix qu’au parfait.'],
            ['« Fast wäre ich gefallen » signifie…', ['Je suis tombé plusieurs fois', 'J’ai failli tomber', 'Je serais tombé si…', 'Je tombe souvent'], 1, '*fast* + subjonctif II passé : ce qui a failli arriver.'],
            ['Quel est le subjonctif II de « wir sind » ?', ['wir waren', 'wir wären', 'wir hätten', 'wir würden'], 1, '*wären* : forme de subjonctif II de *sein*.'],
            ['Comment traduire « Si nous étions partis plus tôt… » ?', ['Wenn wir früher abgefahren sind…', 'Wenn wir früher abgefahren wären…', 'Wenn wir früher abgefahren hätten…', 'Wenn wir früher abfuhren…'], 1, '*abfahren* prend *sein* : *abgefahren wären*, auxiliaire en fin de subordonnée.'],
            ['Dans une subordonnée en wenn, l’auxiliaire hätte ou wäre se place…', ['en 1re position', 'en 2e position', 'en toute fin', 'juste après wenn'], 2, 'Le verbe conjugué ferme la subordonnée : *wenn ich es gewusst hätte*.'],
            ['Quel temps français correspond à la principale « … wäre ich gekommen » ?', ['Le plus-que-parfait', 'Le conditionnel passé', 'Le passé simple', 'Le futur antérieur'], 1, '« Je serais venu » : conditionnel passé.'],
          ],
        },

        {
          titre: 'Les verbes à rection prépositionnelle',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Warten auf, denken an : la préposition fait partie du verbe',
            cours: `En français, on « attend quelqu’un » sans préposition, mais on « pense à » quelqu’un. En allemand aussi, beaucoup de verbes exigent une préposition précise, avec un cas précis. Ce couple verbe + préposition s’apprend **comme un seul mot**.

## Les incontournables
| Verbe | Préposition + cas | Français |
| *warten* | *auf* + acc. | attendre |
| *denken* | *an* + acc. | penser à |
| *sich erinnern* | *an* + acc. | se souvenir de |
| *sich interessieren* | *für* + acc. | s’intéresser à |
| *sprechen, diskutieren* | *über* + acc. | parler de, discuter de |
| *Angst haben* | *vor* + dat. | avoir peur de |
| *teilnehmen* | *an* + dat. | participer à |
| *träumen* | *von* + dat. | rêver de |
| *abhängen* | *von* + dat. | dépendre de |
| *bitten* | *um* + acc. | demander (qqch à qqn) |
| *sich kümmern* | *um* + acc. | s’occuper de |
| *beitragen* | *zu* + dat. | contribuer à |
| *gehören* | *zu* + dat. | faire partie de |

## Et les adjectifs
| Adjectif | Construction | Français |
| *stolz* | *auf* + acc. | fier de |
| *bereit* | *zu* + dat. | prêt à |
| *interessiert* | *an* + dat. | intéressé par |
| *verantwortlich* | *für* + acc. | responsable de |

> Le français ne t’aide pas : « attendre » n’a pas de préposition, *warten auf* en a une ; « avoir peur **de** » devient *Angst haben* **vor**. Apprends toujours le verbe avec sa préposition et son cas.

## Le cas des prépositions mixtes
Avec *an, auf, über, vor, in*, la rection fixe le cas **une fois pour toutes**, sans idée de lieu ni de mouvement : *auf* est à l’accusatif dans *warten auf*, *vor* au datif dans *Angst haben vor*.

## Une nuance à retenir : sich freuen
- *sich freuen* **auf** + acc. : se réjouir d’une chose **à venir** — *Ich freue mich auf die Ferien.*
- *sich freuen* **über** + acc. : se réjouir d’une chose **présente ou passée** — *Ich freue mich über dein Geschenk.*

## Poser la question
Pour une personne : préposition + *wen/wem* — *Auf wen wartest du?* Pour une chose : *wo(r)* + préposition — *Worauf wartest du?* (voir la fiche sur les pronoms en *da-* et *wo-*).

## Exemple travaillé
« Je m’intéresse à la politique et je participe à un débat. »
1. *sich interessieren für* + acc. → *für die Politik*.
2. *teilnehmen an* + dat., à préverbe séparable → *nehme … an einer Debatte teil*.
3. *Ich interessiere mich für Politik und nehme an einer Debatte teil.*`,
          },
          questions: [
            ['Quelle préposition accompagne « warten » ?', ['für', 'auf', 'an', 'nach'], 1, '*warten auf* + accusatif : *Ich warte auf den Bus.*'],
            ['« Ich habe Angst ___ dem Hund. » Quel mot complète la phrase ?', ['von', 'vor', 'für', 'über'], 1, '*Angst haben vor* + datif : avoir peur de.', 'Quelle préposition après Angst haben ?'],
            ['Comment dit-on « Je m’intéresse à l’art » ?', ['Ich interessiere mich an Kunst.', 'Ich interessiere mich für Kunst.', 'Ich interessiere mich auf Kunst.', 'Ich interessiere Kunst.'], 1, '*sich interessieren für* + accusatif.'],
            ['« Ich freue mich auf die Ferien » parle de vacances…', ['passées', 'à venir', 'en cours', 'annulées'], 1, '*sich freuen auf* : se réjouir de ce qui va arriver.'],
            ['Quel cas suit « an » dans « teilnehmen an » ?', ['L’accusatif', 'Le datif', 'Le génitif', 'Le nominatif'], 1, '*an einer Debatte teilnehmen* : datif.'],
            ['« Er ist stolz ___ seine Tochter. » Quel mot complète la phrase ?', ['von', 'über', 'auf', 'an'], 2, '*stolz sein auf* + accusatif : être fier de.', 'Quelle préposition après stolz ?'],
            ['Dans une rection prépositionnelle, le cas après an, auf, über dépend du mouvement.', ['Vrai', 'Faux'], 1, 'Le cas est fixé par le verbe, indépendamment de toute idée de lieu.'],
            ['Que signifie « Das hängt vom Wetter ab » ?', ['Cela dépend du temps', 'Cela tombe du ciel', 'Il fait mauvais', 'C’est accroché dehors'], 0, '*abhängen von* + datif : dépendre de.'],
            ['Comment dit-on « Je pense à toi » ?', ['Ich denke an dich.', 'Ich denke von dir.', 'Ich denke dir.', 'Ich denke auf dich.'], 0, '*denken an* + accusatif.'],
            ['Quelle question porte sur une personne attendue ?', ['Worauf wartest du?', 'Auf wen wartest du?', 'Wo wartest du?', 'Was wartest du?'], 1, 'Pour une personne : préposition + *wen* ; *worauf* vise une chose.'],
            ['« sich kümmern um » signifie…', ['s’inquiéter de', 's’occuper de', 'se moquer de', 'se souvenir de'], 1, '*Ich kümmere mich um meinen Bruder* : je m’occupe de mon frère.'],
            ['Quelle construction est correcte ?', ['Ich erinnere mich an den Urlaub.', 'Ich erinnere mich von dem Urlaub.', 'Ich erinnere mich über den Urlaub.', 'Ich erinnere den Urlaub mich.'], 0, '*sich erinnern an* + accusatif : se souvenir de.'],
          ],
        },

        {
          titre: 'Darauf, worüber : les pronoms en da- et en wo-',
          axe: 'Les groupes prépositionnels',
          lecon: {
            titre: 'Reprendre et questionner un groupe prépositionnel',
            cours: `« Tu attends le bus ? — Oui, je l’attends. » En allemand, *warten auf den Bus* devient *darauf warten*. Ces petits mots en *da-* et *wo-* sont partout à l’écrit comme à l’oral.

## La formation
**da-** (pour reprendre) ou **wo-** (pour questionner) + **préposition**. Si la préposition commence par une **voyelle**, on intercale un **r** : *da-r-auf*, *wo-r-über*.
| Préposition | Reprise | Question |
| *mit* | *damit* | *womit?* |
| *für* | *dafür* | *wofür?* |
| *von* | *davon* | *wovon?* |
| *auf* | *darauf* | *worauf?* |
| *an* | *daran* | *woran?* |
| *über* | *darüber* | *worüber?* |
| *um* | *darum* | *worum?* |

## Chose ou personne ?
C’est la règle d’or.
| | Une **chose** | Une **personne** |
| Reprise | *Ich warte* **darauf**. (sur le bus) | *Ich warte* **auf ihn**. (sur Paul) |
| Question | **Worauf** *wartest du?* | **Auf wen** *wartest du?* |

> *da-* et *wo-* ne remplacent **que des choses** (ou des idées). Pour une personne, on garde préposition + pronom : *Ich denke an sie*, *An wen denkst du?*

## Annoncer une subordonnée ou un infinitif
Avec un verbe à rection prépositionnelle, le pronom en *da-* peut annoncer ce qui suit :
- *Ich freue mich* **darauf**, *dass du kommst.* (je me réjouis que tu viennes)
- *Wir sprechen* **darüber**, *was wir am Wochenende machen.*
- *Er denkt* **daran**, *sein Handy mitzunehmen.* (il pense à prendre son portable)

Le français n’a pas d’équivalent : il dit simplement « je me réjouis que… ». L’allemand, lui, garde la trace de la préposition.

## Les exceptions
Pas de forme en *da-* avec *ohne*, *seit*, *außer* ni *gegenüber*. Et à l’oral, on entend *Wo wartest du drauf?* : réservé à la langue familière.

## Exemple travaillé
« De quoi parlez-vous ? — Nous parlons des vacances. Nous en parlons depuis une heure. »
1. *sprechen über* + acc. ; question sur une chose : **Worüber** *sprecht ihr?*
2. Réponse : *Wir sprechen über die Ferien.*
3. Reprise de « des vacances » (une chose) : *Wir sprechen seit einer Stunde* **darüber**.`,
          },
          questions: [
            ['Comment reprendre « auf den Bus » dans « Ich warte auf den Bus » ?', ['Ich warte auf ihn.', 'Ich warte darauf.', 'Ich warte worauf.', 'Ich warte daran.'], 1, 'Le bus est une chose : *darauf*.'],
            ['Comment reprendre « auf Paul » dans « Ich warte auf Paul » ?', ['Ich warte darauf.', 'Ich warte auf ihn.', 'Ich warte daran.', 'Ich warte worauf.'], 1, 'Pour une personne, on garde préposition + pronom : *auf ihn*.'],
            ['Pourquoi écrit-on « darüber » avec un r ?', ['Par erreur', 'Parce que über commence par une voyelle', 'Parce que c’est un pluriel', 'Pour marquer le datif'], 1, 'On intercale un *r* devant une préposition à initiale vocalique.'],
            ['Quelle question porte sur une chose ?', ['An wen denkst du?', 'Woran denkst du?', 'Wen denkst du?', 'Wem denkst du?'], 1, '*woran* interroge sur une chose ou une idée.'],
            ['« ___ interessierst du dich? — Für Musik. » Quel mot complète la question ?', ['Wofür', 'Für wen', 'Womit', 'Was'], 0, '*sich interessieren für* ; question sur une chose : *wofür*.', 'Quel mot interroge sur « für Musik » ?'],
            ['Dans « Ich freue mich darauf, dass du kommst », que fait « darauf » ?', ['Il remplace une personne', 'Il annonce la subordonnée en dass', 'Il indique un lieu', 'Il est inutile et fautif'], 1, 'Il garde la trace de *sich freuen auf* et annonce la subordonnée.'],
            ['On peut former « daohne ».', ['Vrai', 'Faux'], 1, '*ohne*, *seit*, *außer* et *gegenüber* n’ont pas de forme en *da-*.'],
            ['Quelle est la forme en wo- de « mit » ?', ['womit', 'wormit', 'wobeimit', 'wiemit'], 0, '*mit* commence par une consonne : pas de *r*. *Womit schreibst du?*'],
            ['« Wir sprechen seit einer Stunde darüber » : « darüber » reprend…', ['une personne', 'une chose ou un sujet de discussion', 'un lieu', 'un moment'], 1, '*sprechen über* + une chose : reprise par *darüber*.'],
            ['Comment demande-t-on « À qui penses-tu ? »', ['Woran denkst du?', 'An wen denkst du?', 'Wem denkst du?', 'Wer denkst du?'], 1, 'Pour une personne : préposition + *wen*.'],
            ['Dans « Er denkt daran, sein Handy mitzunehmen », « daran » annonce…', ['un groupe infinitif', 'un complément de lieu', 'une personne', 'un complément de temps'], 0, 'Le pronom annonce le groupe infinitif en *zu*.'],
            ['Quelle est la forme en da- de « um » ?', ['daum', 'darum', 'dasum', 'dorum'], 1, 'Voyelle initiale : *da-r-um*. *Es geht darum* = il s’agit de cela.'],
          ],
        },

        {
          titre: 'Deviner le genre d’un nom',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Suffixes, sens et mots étrangers : les repères qui marchent',
            cours: `Le genre allemand semble aléatoire. Il ne l’est pas toujours : des **terminaisons** et des **familles de sens** donnent le genre à coup sûr pour des milliers de mots.

## Les suffixes, repères les plus sûrs
| Masculin (*der*) | Féminin (*die*) | Neutre (*das*) |
| *-ling* : *der Frühling* | *-ung* : *die Zeitung* | *-chen* : *das Mädchen* |
| *-ismus* : *der Optimismus* | *-heit* : *die Freiheit* | *-lein* : *das Fräulein* |
| *-ist* : *der Journalist* | *-keit* : *die Möglichkeit* | *-um* : *das Museum* |
| *-or* : *der Motor* | *-schaft* : *die Freundschaft* | *-ment* : *das Argument* |
| *-ant*, *-ent* : *der Student* | *-ion* : *die Nation* | *-ma* : *das Klima, das Thema* |
| *-ig* : *der König* | *-tät* : *die Universität* | |
| | *-ie*, *-ik* : *die Demokratie, die Musik* | |
| | *-ei* : *die Bäckerei* | |

> *-chen* et *-lein* rendent tout neutre, même une personne : *das Mädchen* (la jeune fille). Le genre suit le suffixe, pas le sexe.

## Les familles de sens
| Genre | Famille | Exemples |
| Masculin | jours, mois, saisons | *der Montag, der Mai, der Winter* |
| Masculin | phénomènes météo | *der Regen, der Schnee, der Wind* |
| Masculin | points cardinaux | *der Norden, der Süden* |
| Féminin | la plupart des noms en *-e* | *die Lampe, die Sonne* (mais *der Junge, der Name*) |
| Neutre | infinitifs substantivés | *das Leben, das Essen* |
| Neutre | couleurs substantivées | *das Blau, das Rot* |
| Neutre | la plupart des noms en *Ge-* | *das Gebirge, das Gespräch* |

## Deux formations à connaître
1. **La conversion** : un infinitif ou un adjectif devient nom, et il est **neutre** : *leben* → *das Leben*.
2. **La dérivation implicite** : un radical verbal devenu nom, souvent sans suffixe, est **masculin** : *bauen* → *der Bau*, *fortschreiten* → *der Fortschritt*, *springen* → *der Sprung*.

## Les mots d’origine étrangère
Ils suivent leurs suffixes : *die Nation*, *die Kooperation*, *die Kultur*, *der Optimismus*, *das Klima*, *das Argument*. Ils forment souvent leur pluriel en *-en* (*die Nationen*) ou *-s* (*die Hotels*).

## Et si rien ne marche ?
Pour les mots courts sans suffixe (*der Tisch, die Tür, das Buch*), une seule méthode : apprendre chaque nom **avec son article** et sa couleur dans ton cahier.

## Exemple travaillé
*Wirtschaftlichkeit* : on repère *-keit* → *die*. *Kapitalismus* : *-ismus* → *der*. *Gebäude* : *Ge-* → *das*.`,
          },
          questions: [
            ['Quel est le genre de « Freundschaft » ?', ['der', 'die', 'das', 'Il varie'], 1, 'Les noms en *-schaft* sont toujours féminins.'],
            ['Quel est le genre de « Mädchen » ?', ['der', 'die', 'das', 'Il dépend du sexe'], 2, 'Le suffixe *-chen* rend le nom neutre, même pour une personne.'],
            ['Quel suffixe annonce un nom masculin ?', ['-ung', '-ismus', '-heit', '-ment'], 1, '*der Optimismus*, *der Tourismus* : les noms en *-ismus* sont masculins.'],
            ['Quel est le genre de « Argument » ?', ['der', 'die', 'das', 'Aucun'], 2, 'Les noms en *-ment* d’origine latine sont neutres.'],
            ['Les phénomènes météorologiques sont en général…', ['féminins', 'masculins', 'neutres', 'sans genre'], 1, '*der Regen, der Schnee, der Wind, der Nebel*.'],
            ['Quel est le genre de « das Leben » et pourquoi ?', ['Neutre : infinitif substantivé', 'Masculin : radical verbal', 'Féminin : terminaison -en', 'Neutre : mot étranger'], 0, 'Un infinitif devenu nom est toujours neutre.'],
            ['« der Fortschritt » est masculin parce que…', ['il finit par -t', 'c’est un radical verbal devenu nom', 'c’est un mot étranger', 'il désigne une personne'], 1, 'La dérivation implicite (*fortschreiten* → *der Fortschritt*) donne des masculins.'],
            ['Quel est le genre de « Nation » ?', ['der', 'die', 'das', 'Il varie'], 1, 'Les noms en *-ion* sont féminins.'],
            ['Tous les noms en -e sont féminins.', ['Vrai', 'Faux'], 1, 'La plupart, mais pas tous : *der Junge*, *der Name*, *das Auge*.'],
            ['Quel est le genre de « Klima » ?', ['der', 'die', 'das', 'Aucun'], 2, 'Les noms grecs en *-ma* sont neutres : *das Klima, das Thema*.'],
            ['Quel est le genre de « Universität » ?', ['der', 'die', 'das', 'Il varie'], 1, 'Les noms en *-tät* sont féminins.'],
            ['Quel nom est masculin ?', ['die Zeitung', 'der Frühling', 'das Museum', 'die Bäckerei'], 1, 'Le suffixe *-ling* donne des masculins.'],
          ],
        },

        {
          titre: 'Les masculins faibles : der Mensch, den Menschen',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Des noms qui prennent -n partout sauf au nominatif',
            cours: `*Ich sehe den Student* : faute. On dit *Ich sehe den Studenten* (avec **-en**). Certains noms masculins ajoutent **-(e)n** à tous les cas sauf au nominatif singulier : ce sont les **masculins faibles**.

## La déclinaison
| Cas | Singulier | Pluriel |
| Nominatif | *der Mensch* | *die Menschen* |
| Accusatif | *den Menschen* | *die Menschen* |
| Datif | *dem Menschen* | *den Menschen* |
| Génitif | *des Menschen* | *der Menschen* |

> Une seule forme sans *-en* : le nominatif singulier. Partout ailleurs, singulier comme pluriel, le nom finit en *-(e)n*.

## Comment les reconnaître ?
| Famille | Exemples |
| Masculins en **-e** désignant un être vivant | *der Junge, der Kollege, der Löwe, der Affe* |
| Nationalités en **-e** | *der Franzose, der Russe, der Pole, der Türke* |
| Mots d’origine étrangère en **-ent, -ant, -ist, -at, -oge, -graf** | *der Student, der Präsident, der Praktikant, der Journalist, der Polizist, der Soldat, der Biologe, der Fotograf* |
| Quelques mots courts à retenir | *der Mensch, der Held, der Nachbar, der Bauer, der Bär, der Herr* |

*der Herr* fait *den Herrn* au singulier, mais *die Herren* au pluriel : *Sehr geehrte Damen und Herren*.

## Attention aux faux amis
Tous les masculins en *-ent* ou *-e* ne sont pas faibles : *der Käse* ne désigne pas un être vivant, il reste *den Käse*. Et *der Deutsche* se décline comme un adjectif (*ein Deutscher*) : ce n’est pas un masculin faible.

## Les masculins mixtes
Quelques noms abstraits prennent *-n* à l’accusatif et au datif, et **-ns** au génitif : *der Name* → *den Namen, dem Namen, des Namens*. De même : *der Glaube, der Gedanke, der Wille*. On les retrouve en 1re.

## Exemple travaillé
« Je parle avec le président, puis je pose une question au journaliste. »
1. *mit* + datif → *mit dem Präsidenten*.
2. *fragen* + accusatif → *den Journalisten*.
3. *Ich spreche mit dem Präsidenten, dann frage ich den Journalisten.*

Dans une copie, ces *-en* oubliés sont parmi les fautes les plus fréquentes au niveau B1 : relis chaque *den* et *dem* devant un nom de personne.`,
          },
          questions: [
            ['Quelle phrase est correcte ?', ['Ich sehe den Student.', 'Ich sehe den Studenten.', 'Ich sehe der Studenten.', 'Ich sehe dem Student.'], 1, '*der Student* est un masculin faible : *den Studenten* à l’accusatif.'],
            ['À quel cas un masculin faible ne prend-il PAS de -en au singulier ?', ['Accusatif', 'Datif', 'Nominatif', 'Génitif'], 2, 'Le nominatif singulier est la seule forme sans terminaison.'],
            ['Lequel de ces noms est un masculin faible ?', ['der Tisch', 'der Franzose', 'der Lehrer', 'der Käse'], 1, 'Nationalité en *-e* : *den Franzosen, dem Franzosen*.'],
            ['Quel est l’accusatif singulier de « der Herr » ?', ['den Herr', 'den Herrn', 'den Herren', 'den Herres'], 1, '*den Herrn* au singulier ; *die Herren* au pluriel.'],
            ['« Ich helfe dem ___ » (der Nachbar). Quelle forme complète la phrase ?', ['Nachbar', 'Nachbarn', 'Nachbars', 'Nachbarin'], 1, '*der Nachbar* est un masculin faible : *dem Nachbarn*.', 'Quelle forme de Nachbar après dem ?'],
            ['« der Deutsche » est un masculin faible.', ['Vrai', 'Faux'], 1, 'C’est un adjectif substantivé : *ein Deutscher*, *der Deutsche*.'],
            ['Quel suffixe signale souvent un masculin faible ?', ['-ung', '-ist', '-chen', '-heit'], 1, '*der Journalist, der Polizist* : *den Journalisten*.'],
            ['Quel est le génitif de « der Name » ?', ['des Namen', 'des Names', 'des Namens', 'der Namen'], 2, 'Masculin mixte : *-n* à l’accusatif et au datif, *-ns* au génitif.'],
            ['« Das Kind spielt mit dem ___ » (der Junge). Quelle forme complète la phrase ?', ['Junge', 'Jungen', 'Junges', 'Jungem'], 1, 'Masculin en *-e* désignant un être vivant : *dem Jungen*.', 'Quelle forme de Junge après dem ?'],
            ['Quelle forme est correcte ?', ['die Rechte des Menschs', 'die Rechte des Menschen', 'die Rechte der Mensch', 'die Rechte des Mensches'], 1, 'Génitif d’un masculin faible : *des Menschen*.'],
            ['« der Käse » est un masculin faible parce qu’il finit par -e.', ['Vrai', 'Faux'], 1, 'Seuls les masculins en *-e* désignant des êtres vivants le sont ; *den Käse*.'],
            ['Comment dit-on « J’interroge le policier » ?', ['Ich frage den Polizist.', 'Ich frage den Polizisten.', 'Ich frage dem Polizisten.', 'Ich frage der Polizist.'], 1, '*fragen* + accusatif, et *der Polizist* est faible : *den Polizisten*.'],
          ],
        },

        {
          titre: 'Exprimer la cause et la conséquence',
          axe: 'La phrase',
          lecon: {
            titre: 'Weil, da, denn, nämlich… deshalb, darum, so … dass',
            cours: `Argumenter, c’est relier des idées : ceci arrive **parce que**… ; **c’est pourquoi**… L’allemand a plusieurs outils pour cela, et chacun impose **sa** place au verbe.

## La cause
| Outil | Nature | Place du verbe | Exemple |
| *weil* | subordonnant | verbe **à la fin** | *Ich bleibe zu Hause, weil ich krank* **bin**. |
| *da* | subordonnant, cause **connue** | verbe à la fin, souvent **en tête** | *Da es regnet,* **bleiben** *wir hier.* |
| *denn* | coordonnant (position 0) | ordre **normal** | *Ich bleibe zu Hause, denn ich* **bin** *krank.* |
| *nämlich* | adverbe, **jamais en tête** | après le verbe | *Ich bleibe zu Hause, ich* **bin** *nämlich krank.* |
| *wegen* + gén. | préposition | pas de verbe | *wegen des Regens* (à cause de la pluie) |

> *weil* répond à *warum?* et peut s’employer seul ; *denn* ne peut jamais commencer une réponse ni une phrase isolée.

## La conséquence
| Outil | Nature | Place du verbe | Exemple |
| *deshalb, deswegen, darum, daher* | adverbes | **inversion** : verbe 2e, sujet après | *Ich bin krank, deshalb* **bleibe** *ich zu Hause.* |
| *also* | adverbe (= donc) | inversion | *Es regnet, also* **nehme** *ich einen Schirm.* |
| *so + adjectif, dass* | subordonnant | verbe à la fin | *Er war so müde, dass er sofort* **einschlief**. |
| *sodass* | subordonnant | verbe à la fin | *Es regnete stark, sodass das Spiel ausfiel.* |

## Deux pièges
1. **also ne veut pas dire « aussi »** : « aussi » se dit *auch*. *Also* signifie « donc ».
2. **Après deshalb, le sujet passe derrière le verbe** : *deshalb ich bleibe* est faux, comme *dann ich gehe*.

## Choisir le bon outil
- Pour expliquer une cause nouvelle, qui répond à *warum?* : *weil*.
- Pour une cause déjà connue, posée en début de phrase : *da*.
- Pour ajouter une explication après coup, à l’oral surtout : *denn* ou *nämlich*.
- Pour tirer une conclusion : *deshalb* / *deswegen*.

## Exemple travaillé : un même lien, trois constructions
« Le train était en retard, donc je suis arrivé trop tard. »
1. *Der Zug hatte Verspätung,* **deshalb bin ich** *zu spät gekommen.* (adverbe : inversion)
2. *Ich bin zu spät gekommen,* **weil** *der Zug Verspätung* **hatte**. (subordonnée : verbe à la fin)
3. *Ich bin zu spät gekommen,* **denn** *der Zug* **hatte** *Verspätung.* (coordination : ordre normal)`,
          },
          questions: [
            ['Quelle phrase est correcte ?', ['Ich bleibe zu Hause, weil ich bin krank.', 'Ich bleibe zu Hause, weil ich krank bin.', 'Ich bleibe zu Hause, denn ich krank bin.', 'Ich bleibe zu Hause, weil bin ich krank.'], 1, 'Après *weil*, le verbe conjugué va à la fin.'],
            ['Après « denn », l’ordre des mots est…', ['verbe à la fin', 'ordre normal, verbe en 2e position', 'verbe en 1re position', 'libre'], 1, '*denn* est coordonnant : position zéro, ordre normal.'],
            ['Où se place « nämlich » ?', ['Toujours en tête de phrase', 'Jamais en tête, après le verbe', 'Toujours en fin de phrase', 'Avant le sujet uniquement'], 1, '*Ich bin nämlich krank* : jamais en première position.'],
            ['Quelle phrase est correcte ?', ['Es regnet, deshalb ich bleibe hier.', 'Es regnet, deshalb bleibe ich hier.', 'Es regnet, deshalb ich hier bleibe.', 'Es regnet, deshalb hier ich bleibe.'], 1, 'Après l’adverbe *deshalb*, le verbe reste 2e et le sujet passe derrière.'],
            ['Que signifie « also » ?', ['Aussi', 'Donc', 'Alors que', 'Pourtant'], 1, 'Faux ami : « aussi » se dit *auch* ; *also* = donc.'],
            ['« ___ es regnet, bleiben wir hier. » Quel mot introduisant une cause connue complète la phrase ?', ['Denn', 'Da', 'Deshalb', 'Nämlich'], 1, '*Da* introduit une cause connue, souvent en tête, verbe à la fin.', 'Quel subordonnant de cause se place en tête ?'],
            ['Quel cas suit la préposition « wegen » ?', ['Le datif', 'L’accusatif', 'Le génitif', 'Le nominatif'], 2, '*wegen des Regens* : génitif (le datif est familier).'],
            ['On peut répondre à « Warum? » par « Denn ich bin müde. »', ['Vrai', 'Faux'], 1, 'On répond par *Weil ich müde bin.* ; *denn* ne s’emploie pas seul.'],
            ['« Er war so müde, dass er sofort ___. » Quelle forme complète la phrase ?', ['schlief ein', 'einschlief', 'einschlafen', 'eingeschlafen'], 1, 'Dans la subordonnée en *dass*, le verbe à préverbe se reforme en fin : *einschlief*.', 'Quelle forme de einschlafen après dass ?'],
            ['Lequel de ces mots exprime la conséquence ?', ['weil', 'denn', 'deswegen', 'nämlich'], 2, '*deswegen* = c’est pourquoi ; les trois autres expriment la cause.'],
            ['Dans « Es regnete stark, sodass das Spiel ausfiel », « sodass » introduit…', ['une cause', 'une conséquence', 'un but', 'une opposition'], 1, '*sodass* = si bien que : conséquence, verbe à la fin.'],
            ['« Ich bin zu spät gekommen, denn der Zug ___ Verspätung. » Quel mot complète la phrase ?', ['hatte', 'hat gehabt', 'habe', 'hätte'], 0, 'Après *denn*, ordre normal : le verbe conjugué en 2e position.', 'Quel verbe après denn der Zug ?'],
          ],
        },
      ],
    },
  ],
}
