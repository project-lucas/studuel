// EMC — Terminale : le programme « La démocratie », soit 12 fiches.
//
// MÊME SLUG que `emc.mjs` (`emc`), d'où l'usage de `--modules` : la 216, qui
// porte l'EMC de la 6e à la Terminale, est DÉJÀ EXÉCUTÉE en base (sondée le
// 05/08/2026 : ses 21 chapitres y sont) et ne doit plus jamais être régénérée.
// `--slugs emc` fusionnerait les deux modules dans un seul fichier SQL.
//
// Positions : le bloc lycée de `emc.mjs` occupe 1→3 en Terminale (liberté
// d'expression, démocratie et État de droit, numérique) — un socle commun aux
// trois niveaux du lycée, qu'on NE TOUCHE PAS : il est écrit pour la 2de, la
// 1re et la Tle à la fois, et une suppression côté Tle serait de toute façon
// annulée au prochain rejeu de la 216, qui est idempotente. Ce bloc démarre
// donc à 4.

export default {
  slug: 'emc',
  nom: 'EMC',

  titreMigration: 'EMC Tle — LE PROGRAMME « LA DÉMOCRATIE »',

  motif: `CONSTAT MESURÉ (sonde en lecture seule sur la base, 05/08/2026) :
l'EMC de Terminale n'avait que les 3 chapitres du socle lycée, écrits pour
la 2de, la 1re et la Tle à la fois. Le programme propre à la Terminale — « La
démocratie », ses deux axes et ses douze fiches — n'existait nulle part : ni
l'histoire de la démocratie, ni les modes de scrutin, ni la laïcité, ni
l'exemplarité des élus, ni les nouvelles formes de participation.
Cette migration AJOUTE 12 fiches derrière les 3 existantes, qui restent en
place : elles valent pour les trois niveaux du lycée, pas seulement pour la
Terminale.`,

  blocs: [
    {
      niveaux: ['Tle'],
      // 1→3 : le socle lycée de la 216 (exécutée). 4→15 : ce bloc.
      positionDepart: 4,
      chapitres: [
        // ===== Axe 1 — Fondements et expériences de la démocratie =========
        {
          titre: 'Histoire de la démocratie',
          lecon: {
            titre: 'D’Athènes au suffrage universel',
            cours: `La démocratie n’est ni une invention récente ni une évidence : c’est un régime **rare**, longtemps minoritaire, et toujours **réversible**.

## Athènes, Ve siècle avant J.-C.
La démocratie athénienne est **directe** : les citoyens votent eux-mêmes les lois à l’**ecclésia**, et la plupart des magistrats sont **tirés au sort**.

| Groupe | Effectif approximatif | Droits politiques |
| Citoyens | environ **40 000** | Tous |
| Femmes, **métèques**, **esclaves** | le reste des ~300 000 habitants | Aucun |

> Deux enseignements durables. D’abord, la démocratie suppose un peuple **défini** — la première question est toujours « qui en fait partie ? ». Ensuite, le **tirage au sort** est aussi démocratique que l’élection : l’élection, disait Aristote, est plutôt **aristocratique**, puisqu’elle désigne les meilleurs.

## Les jalons
| Date | L’étape | Ce qu’elle apporte |
| **1215** | *Magna Carta* | Limite le pouvoir du roi d’Angleterre |
| **1688-1689** | Glorieuse Révolution, *Bill of Rights* | Installe la monarchie parlementaire |
| **1776** | Déclaration d’indépendance américaine | Le droit de se donner un gouvernement |
| **1787** | Constitution des États-Unis | La séparation des pouvoirs écrite |
| **1789** | Révolution française, **DDHC** | Les droits comme fondement du régime |

## L’élargissement du corps électoral
Le suffrage reste longtemps **censitaire** — réservé aux plus imposés.

| Date | L’extension en France |
| **1848** | Suffrage universel **masculin** |
| **1944** | Droit de vote des **femmes** (premier vote en 1945) |
| **1974** | Majorité abaissée à **18 ans** |

## Les vagues de démocratisation
Le politiste **Samuel Huntington** décrit trois vagues.

| Vague | Période | Exemples |
| Première | XIXe et début du XXe siècle | Europe occidentale, Amérique du Nord |
| Deuxième | Après 1945 | Reconstruction, décolonisation |
| Troisième | À partir de 1974 | Portugal, Espagne, Grèce, Amérique latine, Europe de l’Est après 1989 |

Chaque vague a été suivie d’un **reflux** — d’où l’attention portée aujourd’hui aux reculs démocratiques.`,
          },
          questions: [
            ['Comment étaient désignés la plupart des magistrats à Athènes ?', ['Par tirage au sort', 'Par élection au suffrage universel', 'Par hérédité', 'Par cooptation des riches'], 0, 'Aristote jugeait l’élection plutôt aristocratique, et le tirage au sort démocratique.'],
            ['Qui était exclu de la citoyenneté à Athènes ?', ['Les femmes, les métèques et les esclaves', 'Seulement les esclaves', 'Seulement les étrangers', 'Les artisans et les paysans'], 0, 'Environ 40 000 citoyens pour peut-être 300 000 habitants.'],
            ['Quand les femmes obtiennent-elles le droit de vote en France ?', ['En 1944', 'En 1848', 'En 1918', 'En 1965'], 0, 'Ordonnance de 1944, premier vote effectif en 1945.'],
            ['Le suffrage universel masculin est instauré en France en…', ['1848', '1789', '1875', '1830'], 0, 'Il met fin au suffrage censitaire, réservé aux plus imposés.'],
            ['Qu’est-ce qu’un suffrage censitaire ?', ['Un droit de vote réservé à ceux qui paient un certain impôt', 'Un vote par recensement de la population', 'Un vote obligatoire', 'Un scrutin indirect'], 0, 'Il a longtemps réduit le corps électoral à une minorité de propriétaires.'],
            ['La démocratie athénienne était une démocratie représentative.', ['Vrai', 'Faux'], 1, 'Elle était directe : les citoyens votaient eux-mêmes les lois à l’ecclésia.'],
            ['Quel texte anglais de 1215 limite le pouvoir du roi ?', ['La Magna Carta', 'Le Bill of Rights', 'L’Habeas Corpus', 'L’Acte d’Union'], 0, 'Un jalon précoce de la limitation du pouvoir par le droit.'],
            ['Chaque vague de démocratisation a été suivie d’un reflux.', ['Vrai', 'Faux'], 0, 'C’est ce qui rend l’observation des reculs démocratiques actuels si importante.'],
          ],
        },
        {
          titre: 'La démocratie et le peuple souverain',
          lecon: {
            titre: 'Qui décide, et au nom de qui',
            cours: `« Gouvernement du peuple, par le peuple et pour le peuple » : la formule de Lincoln, reprise à l’**article 2 de la Constitution de 1958**, cache une question difficile — comment un peuple entier peut-il gouverner ?

## Deux conceptions de la souveraineté
| | Souveraineté **populaire** | Souveraineté **nationale** |
| Le théoricien | **Rousseau** | **Sieyès** |
| À qui elle appartient | Au peuple, somme des citoyens | À la Nation, entité abstraite |
| Chacun en détient | Une part | Rien : elle est indivisible |
| Le mandat | **Impératif** : l’élu obéit à ses électeurs | **Représentatif** : l’élu décide librement |
| La forme logique | Démocratie directe | Démocratie représentative |

La Constitution française **combine** les deux : « La souveraineté nationale appartient au peuple qui l’exerce par ses représentants et par la voie du référendum. »

## Trois formes de démocratie
| Forme | Qui décide | Exemples |
| **Directe** | Le peuple lui-même | Référendum, votations suisses |
| **Représentative** | Ceux qu’il élit | Le régime français ordinaire |
| **Participative** | Le peuple est associé sans trancher | Concertations, conventions citoyennes, budgets participatifs |

## Les garanties du régime
| Garantie | Ce qu’elle empêche |
| **Séparation des pouvoirs** (Montesquieu) | Qu’un organe décide et juge à la fois |
| **État de droit** | Que les gouvernants s’exemptent de la loi |
| Hiérarchie des normes contrôlée | Qu’une loi viole la Constitution — **QPC** depuis 2010 |
| **Droits fondamentaux** | Que la majorité décide de tout |

> Point de vigilance pour une copie : la démocratie n’est **pas seulement** la règle de la majorité. Une majorité qui supprimerait les droits d’une minorité détruirait la démocratie tout en respectant la règle du nombre.`,
          },
          questions: [
            ['Selon Rousseau, à qui appartient la souveraineté ?', ['Au peuple, somme des citoyens', 'À la Nation, entité abstraite', 'Aux représentants élus', 'Au chef de l’État'], 0, 'De là découlent le mandat impératif et la préférence pour la démocratie directe.'],
            ['Que défend Sieyès avec la souveraineté nationale ?', ['La Nation ne s’exprime que par des représentants', 'Le peuple doit voter chaque loi', 'Le roi conserve la souveraineté', 'Les régions sont souveraines'], 0, 'Le représentant reçoit un mandat représentatif, sans ordre de ses électeurs.'],
            ['Quel principe, énoncé par Montesquieu, limite le pouvoir par le pouvoir ?', ['La séparation des pouvoirs', 'La souveraineté populaire', 'Le suffrage universel', 'Le contrôle de constitutionnalité'], 0, 'Exécutif, législatif et judiciaire se limitent mutuellement.'],
            ['Que permet la QPC depuis 2010 ?', ['Contester devant le juge une loi déjà en vigueur', 'Organiser un référendum d’initiative citoyenne', 'Destituer un élu', 'Saisir la Cour européenne directement'], 0, 'La question prioritaire de constitutionnalité ouvre le contrôle aux justiciables.'],
            ['La démocratie se réduit à la règle de la majorité.', ['Vrai', 'Faux'], 1, 'Des droits fondamentaux limitent ce qu’une majorité peut décider.'],
            ['Qu’est-ce que la démocratie participative ?', ['Associer les citoyens aux décisions sans qu’ils tranchent seuls', 'Faire voter le peuple sur chaque loi', 'Élire tous les fonctionnaires', 'Tirer au sort les députés'], 0, 'Concertations, conventions citoyennes et budgets participatifs en relèvent.'],
            ['Que signifie l’État de droit ?', ['Les gouvernants eux-mêmes sont soumis au droit', 'L’État peut tout décider', 'Le droit est fixé par la majorité', 'La justice dépend du gouvernement'], 0, 'C’est ce qui distingue un pouvoir légitime d’un pouvoir arbitraire.'],
            ['La Constitution française combine souveraineté nationale et souveraineté populaire.', ['Vrai', 'Faux'], 0, 'Le peuple l’exerce « par ses représentants et par la voie du référendum ».'],
          ],
        },
        {
          titre: 'Les élections, outils de la démocratie',
          lecon: {
            titre: 'Le vote, et ce qu’il produit',
            cours: `L’élection est l’acte démocratique le plus visible. Mais le **mode de scrutin** choisi façonne le résultat autant que les votes eux-mêmes.

## Les principes du vote
| Principe | Ce qu’il signifie | En France |
| **Universel** | Tous les citoyens majeurs votent | Depuis 1944 pour les femmes |
| **Égal** | Une personne, une voix | Oui |
| **Secret** | L’isoloir est obligatoire | Oui |
| **Libre** | Voter n’est pas obligatoire | Oui — à la différence de la Belgique ou de l’Australie |
| **Direct ou indirect** | Les électeurs désignent l’élu, ou des grands électeurs | Indirect pour le **Sénat** |

## Les modes de scrutin, et leurs effets
| Mode | Ce qu’il produit | Ce qu’il coûte |
| **Majoritaire à deux tours** | Des majorités nettes, un lien fort avec la circonscription | Il **sous-représente** les courants minoritaires |
| **Proportionnel** | Une image fidèle de l’opinion | Des assemblées fragmentées, des coalitions instables |
| **Mixte** | Une prime majoritaire ajoutée à la proportionnelle | Un compromis, jamais parfait |

> Il n’existe **aucun** mode de scrutin neutre. Choisir entre représentativité et gouvernabilité est un **choix politique**, pas une question technique — et c’est pourquoi la réforme du mode de scrutin est un débat permanent.

## L’abstention, principal enjeu contemporain
| Phénomène | Ce qu’il produit |
| Abstention | Plus de la moitié des inscrits aux dernières législatives, davantage chez les jeunes et les catégories populaires |
| **Mal-inscription** | On est inscrit ailleurs que là où l’on vit |
| Non-inscription | On n’est pas sur les listes du tout |

Un élu peut ainsi être désigné par une **fraction réduite** du corps électoral — ce qui alimente la contestation de sa **légitimité**, distincte de sa légalité.

## Le contrôle
| Dispositif | Ce qu’il encadre |
| Plafonnement des dépenses | Le coût des campagnes |
| **CNCCFP** | Le contrôle des comptes de campagne |
| **Arcom** | L’égalité du temps de parole |
| Financement public des partis | Leur indépendance vis-à-vis des donateurs |
| Le juge de l’élection | Il peut annuler un scrutin irrégulier |`,
          },
          questions: [
            ['Quel mode de scrutin dégage le plus facilement une majorité stable ?', ['Le scrutin majoritaire', 'La proportionnelle intégrale', 'Le vote préférentiel', 'Le tirage au sort'], 0, 'Au prix d’une sous-représentation des courants minoritaires.'],
            ['Comment sont élus les sénateurs français ?', ['Au suffrage universel indirect', 'Au suffrage universel direct', 'Par tirage au sort', 'Par nomination présidentielle'], 0, 'Par un collège de grands électeurs, essentiellement des élus locaux.'],
            ['Le vote est-il obligatoire en France ?', ['Non, il est libre', 'Oui, sous peine d’amende', 'Oui, pour la présidentielle seulement', 'Oui, depuis 2017'], 0, 'Il l’est en Belgique et en Australie, pas en France.'],
            ['Quel organisme contrôle les comptes de campagne ?', ['La CNCCFP', 'L’Arcom', 'La CNIL', 'La HATVP'], 0, 'L’Arcom veille, elle, à l’équité du temps de parole.'],
            ['La proportionnelle reflète mieux l’opinion mais peut fragmenter l’assemblée.', ['Vrai', 'Faux'], 0, 'D’où les systèmes mixtes, qui ajoutent une prime majoritaire.'],
            ['Qu’appelle-t-on la mal-inscription ?', ['Être inscrit sur les listes d’une commune où l’on ne vit plus', 'Voter deux fois', 'Ne pas être inscrit du tout', 'Se tromper de bulletin'], 0, 'Elle gonfle mécaniquement l’abstention mesurée.'],
            ['Il existe un mode de scrutin politiquement neutre.', ['Vrai', 'Faux'], 1, 'Chaque mode arbitre entre représentativité et gouvernabilité : c’est un choix politique.'],
            ['Quelle réforme de 2000 a rapproché législatives et présidentielle ?', ['Le passage au quinquennat', 'Le non-cumul des mandats', 'La parité', 'La réforme du Sénat'], 0, 'Avec l’inversion du calendrier, les législatives suivent la présidentielle.'],
          ],
        },
        {
          titre: 'Laïcité et démocratie',
          lecon: {
            titre: 'Ce que la laïcité oblige, et ce qu’elle n’interdit pas',
            cours: `La laïcité est l’un des principes les plus mal compris du droit français. Elle ne dit rien des croyances : elle organise le rapport entre l’**État** et les **cultes**.

## La loi de 1905
La loi du **9 décembre 1905** tient dans deux articles fondateurs.

| Article | Ce qu’il pose |
| Article 1er | « La République **assure la liberté de conscience**. Elle **garantit le libre exercice des cultes**. » |
| Article 2 | « La République **ne reconnaît, ne salarie ni ne subventionne** aucun culte. » |

Autrement dit : **liberté** de croire ou de ne pas croire, et **neutralité** de l’État.

## À qui s’applique la neutralité
| Concerné | La règle |
| Les **agents publics** dans l’exercice de leurs fonctions | Ils ne peuvent manifester leur religion |
| Les bâtiments et services publics | Ils n’affichent aucun culte |
| Les **usagers** dans l’espace public | **Ils sont libres** : un particulier peut porter un signe religieux dans la rue |

| L’exception légale | Le texte |
| Signes religieux ostensibles à l’école publique | **Loi de 2004** |
| Dissimulation du visage dans l’espace public | **Loi de 2010** — motifs d’ordre public et de sécurité |
| Neutralité étendue aux missions de service public | **Loi du 24 août 2021** |

## Deux confusions à éviter
| La confusion | La correction |
| Laïcité = athéisme | L’État n’est **pas contre** les religions : il est **neutre** entre elles |
| Critiquer une religion = délit | Le **blasphème n’existe pas** en droit français |

> La ligne de partage est précise : les **idées** sont critiquables, y compris durement ; les **personnes** sont protégées. L’injure et l’incitation à la haine visant des personnes en raison de leur religion sont punies — pas la critique d’un dogme.

## Un cas particulier assumé
L’**Alsace-Moselle**, annexée à l’Empire allemand en 1905, n’a jamais reçu la loi de séparation : elle conserve le régime concordataire, où des cultes sont salariés par l’État.`,
          },
          questions: [
            ['Que garantissent les deux premiers articles de la loi de 1905 ?', ['La liberté de conscience et le libre exercice des cultes', 'L’interdiction des religions dans l’espace public', 'Le financement des cultes par l’État', 'La suppression des jours fériés religieux'], 0, 'Et, dans le même mouvement, la neutralité de l’État qui ne salarie aucun culte.'],
            ['À qui s’applique l’obligation de neutralité religieuse ?', ['Aux agents publics dans leurs fonctions', 'À tous les citoyens dans la rue', 'Aux seuls enseignants', 'Aux entreprises privées'], 0, 'Un usager du service public, lui, n’y est pas soumis.'],
            ['Que prévoit la loi de 2004 ?', ['L’interdiction des signes religieux ostensibles dans les écoles publiques', 'L’interdiction du voile dans la rue', 'La fin du concordat en Alsace-Moselle', 'La neutralité des entreprises'], 0, 'Elle vise les élèves des écoles, collèges et lycées publics.'],
            ['Le blasphème est-il un délit en droit français ?', ['Non', 'Oui, depuis 1905', 'Oui, depuis 2021', 'Oui, pour certaines religions'], 0, 'La critique des idées religieuses est libre ; l’injure envers des personnes ne l’est pas.'],
            ['Laïcité et athéisme d’État sont deux choses différentes.', ['Vrai', 'Faux'], 0, 'L’État n’est pas contre les religions : il est neutre entre elles.'],
            ['Quel territoire français conserve un régime concordataire ?', ['L’Alsace-Moselle', 'La Corse', 'La Guyane', 'Mayotte'], 0, 'Annexée en 1905, elle n’a pas connu l’application de la loi de séparation.'],
            ['Qu’a renforcé la loi du 24 août 2021 ?', ['La neutralité dans les missions de service public et le contrôle des associations', 'L’interdiction des signes religieux dans la rue', 'Le financement des cultes', 'La suppression de l’instruction en famille'], 0, 'Elle encadre aussi plus strictement l’instruction en famille.'],
            ['Un particulier peut porter un signe religieux dans la rue.', ['Vrai', 'Faux'], 0, 'La neutralité s’impose à l’État et à ses agents, pas aux usagers dans l’espace public.'],
          ],
        },
        {
          titre: 'Contestation de la démocratie et transformations des régimes politiques',
          lecon: {
            titre: 'Quand la démocratie recule',
            cours: `Depuis une quinzaine d’années, les grands indices — **V-Dem**, **Freedom House**, *Democracy Index* — constatent la même chose : le nombre de démocraties **recule**, et la population vivant sous régime autoritaire progresse.

## Les régimes non démocratiques
| | **Autoritaire** | **Totalitaire** |
| Ce que le pouvoir contrôle | L’État et la vie politique | La **société entière** |
| L’opposition | Entravée | Supprimée |
| La société civile | Garde des espaces d’autonomie | N’en garde aucun |
| Les moyens | Répression ciblée | Idéologie officielle, parti unique, terreur organisée |

## La forme nouvelle : la démocratie illibérale
Le régime conserve les **apparences** — élections tenues, Parlement en place — mais vide les contre-pouvoirs de leur substance.

| L’apparence conservée | La substance vidée |
| Des élections ont lieu | Découpage électoral sur mesure, médias rachetés |
| Une justice existe | Elle est mise sous tutelle |
| La presse n’est pas interdite | Elle est étouffée économiquement |
| Les associations sont légales | Elles sont harcelées administrativement |

La **Hongrie** en est l’exemple le plus discuté en Europe ; la **Turquie** un autre cas fréquemment cité.

> Le point décisif : on ne renverse plus une démocratie par un **coup d’État militaire**, on la **vide de l’intérieur** en respectant les formes. C’est ce qui rend le recul difficile à dater — et difficile à contester, puisque chaque étape est légale.

## Ce qui alimente la contestation
| Facteur | Comment il agit |
| La **défiance** | Envers les élus et les institutions |
| Le sentiment d’inutilité du vote | Abstention, votes protestataires |
| Les **inégalités** | Déclassement, sentiment d’abandon |
| La **désinformation** | Fragmentation de l’espace informationnel |
| Un modèle alternatif revendiqué | La Chine met en avant l’efficacité contre le pluralisme |

## Ce qui résiste
Des institutions indépendantes, une presse pluraliste, des contre-pouvoirs locaux, une société civile organisée — et l’**alternance** effective. La résilience démocratique se mesure moins aux textes qu’à l’existence **réelle** de ces contre-pouvoirs.`,
          },
          questions: [
            ['Qu’est-ce qu’une démocratie illibérale ?', ['Un régime qui garde les formes électorales mais vide les contre-pouvoirs', 'Une démocratie sans élections', 'Une monarchie constitutionnelle', 'Un régime militaire'], 0, 'Justice sous tutelle, médias contrôlés, société civile harcelée.'],
            ['Qu’est-ce qui distingue un régime totalitaire d’un régime autoritaire ?', ['Il prétend contrôler la société entière avec une idéologie officielle', 'Il organise des élections', 'Il tolère une opposition', 'Il respecte la justice'], 0, 'Parti unique, idéologie obligatoire, terreur organisée.'],
            ['Les indices internationaux constatent une progression continue des démocraties.', ['Vrai', 'Faux'], 1, 'V-Dem et Freedom House mesurent au contraire un recul depuis une quinzaine d’années.'],
            ['Comment une démocratie est-elle aujourd’hui le plus souvent affaiblie ?', ['De l’intérieur, en respectant les formes', 'Par un coup d’État militaire', 'Par une invasion étrangère', 'Par un référendum de dissolution'], 0, 'Ce qui rend le recul difficile à dater et à contester juridiquement.'],
            ['Quel pays européen est le plus souvent cité comme démocratie illibérale ?', ['La Hongrie', 'Le Portugal', 'L’Irlande', 'La Suède'], 0, 'La Turquie est un autre cas fréquemment analysé.'],
            ['Quel facteur alimente la contestation des démocraties ?', ['La défiance envers les élus et le sentiment que le vote ne change rien', 'La hausse de la participation électorale', 'Le renforcement des contre-pouvoirs', 'La stabilité des majorités'], 0, 'S’y ajoutent les inégalités et la désinformation.'],
            ['Qu’est-ce qui mesure le mieux la résilience d’une démocratie ?', ['L’existence réelle de contre-pouvoirs indépendants', 'La longueur de sa Constitution', 'Le nombre de partis', 'La fréquence des référendums'], 0, 'Les textes ne suffisent pas : ce sont les contre-pouvoirs effectifs qui tiennent.'],
            ['La Chine met en avant un modèle fondé sur l’efficacité plutôt que sur le pluralisme.', ['Vrai', 'Faux'], 0, 'C’est l’un des ressorts de la contestation du modèle démocratique à l’échelle mondiale.'],
          ],
        },
        {
          titre: 'La protection des démocraties : les enjeux de sécurité',
          lecon: {
            titre: 'Protéger sans détruire ce qu’on protège',
            cours: `Une démocratie doit assurer la sécurité de ses citoyens **sans sacrifier les libertés qui la définissent**. Tout le sujet tient dans cet équilibre.

## Les menaces
| Menace | Ce qu’elle vise |
| Le **terrorisme** | *Charlie Hebdo* et l’Hyper Cacher (janvier 2015), le 13 novembre 2015, Nice (juillet 2016) |
| Les **cyberattaques** | Hôpitaux, collectivités, entreprises |
| Les **ingérences étrangères** | Manipulation de l’information, financement occulte, influence électorale |
| La criminalité organisée | Trafics, blanchiment |

## Les réponses françaises
| Dispositif | Date | Ce qu’il permet | Qui décide |
| **État d’urgence** | Novembre 2015, prolongé jusqu’en 2017 | Perquisitions administratives, assignations à résidence | L’**administration**, pas un juge |
| **Loi SILT** | 2017 | Fait passer ces mesures dans le droit commun | Sous contrôle du juge administratif |
| **Loi renseignement** | 2015 | Encadre — et élargit — les techniques de surveillance | Contrôle par la **CNCTR** |

## Les garde-fous
| Garde-fou | Son rôle |
| Le **juge** administratif ou judiciaire | Contrôler la proportionnalité des mesures |
| Le **Conseil constitutionnel** | Il a censuré plusieurs dispositions jugées excessives |
| La **CNIL** | Protéger les données personnelles |
| La **CEDH** | Un recours externe, à Strasbourg |
| Le **Parlement** | Limiter dans le temps les régimes d’exception |

## Le raisonnement attendu au bac
Une mesure de sécurité s’apprécie à **trois critères**, et il faut les poser tous les trois :

1. Est-elle **nécessaire** — répond-elle à une menace établie ?
2. Est-elle **proportionnée** — n’existe-t-il pas de moyen moins attentatoire ?
3. Est-elle **contrôlée** — un juge peut-il la censurer ?

> Une mesure d’exception qui devient **permanente** et qui **échappe au contrôle** ne protège plus la démocratie : elle en change la nature.`,
          },
          questions: [
            ['Quand l’état d’urgence a-t-il été déclaré en France après les attentats ?', ['En novembre 2015', 'En janvier 2015', 'En juillet 2016', 'En 2017'], 0, 'Il a été prolongé jusqu’à son remplacement partiel par la loi SILT en 2017.'],
            ['Que permet une perquisition administrative sous état d’urgence ?', ['Une perquisition décidée sans autorisation d’un juge', 'Une perquisition ordonnée par un juge d’instruction', 'Une fouille des seuls lieux publics', 'Une garde à vue prolongée'], 0, 'C’est précisément ce qui la distingue du droit commun — et ce qui la rend contestée.'],
            ['Quelle loi de 2017 fait passer des mesures d’exception dans le droit commun ?', ['La loi SILT', 'La loi renseignement', 'La loi Informatique et libertés', 'La loi de 1905'], 0, 'Sous contrôle du juge administratif.'],
            ['Quelle autorité protège les données personnelles en France ?', ['La CNIL', 'La HATVP', 'L’Arcom', 'La CNCCFP'], 0, 'Elle contrôle notamment les fichiers et les dispositifs de surveillance.'],
            ['Le Conseil constitutionnel a censuré certaines mesures antiterroristes jugées excessives.', ['Vrai', 'Faux'], 0, 'C’est l’un des garde-fous du contrôle de proportionnalité.'],
            ['Quels critères permettent d’apprécier une mesure de sécurité ?', ['Nécessité, proportionnalité, contrôle par un juge', 'Rapidité, coût, efficacité', 'Popularité, urgence, durée', 'Légalité seule'], 0, 'C’est la grille attendue dans une copie d’EMC.'],
            ['Qu’appelle-t-on ingérence étrangère ?', ['Une opération d’influence ou de manipulation venue d’un autre État', 'Une immigration non contrôlée', 'Un investissement étranger', 'Une aide au développement'], 0, 'Manipulation de l’information et financements occultes en sont les formes courantes.'],
            ['Un régime d’exception peut devenir permanent sans changer la nature du régime politique.', ['Vrai', 'Faux'], 1, 'Une exception permanente et sans contrôle transforme le régime lui-même.'],
          ],
        },
        {
          titre: 'La construction européenne et la démocratie',
          lecon: {
            titre: 'L’Europe, contrainte et garantie démocratique',
            cours: `L’Union européenne n’est pas seulement un marché : c’est une **communauté de valeurs** qui conditionne l’adhésion et, de plus en plus, le versement des fonds.

## L’exigence démocratique
Les **critères de Copenhague (1993)** subordonnent l’adhésion à des « institutions stables garantissant la démocratie, l’État de droit, les droits de l’homme et la protection des minorités ».

| Pays | Ce que l’adhésion a ancré |
| Espagne, Portugal, Grèce | La sortie de dictature, dans les années 1980 |
| Europe centrale et orientale | La transition post-communiste, après 1989 |

| Instrument | Ce qu’il permet | Sa limite |
| **Article 2 du TUE** | Énonce les valeurs communes | Déclaratif |
| **Article 7** | Sanctionner un État qui s’en écarte, jusqu’à suspendre son droit de vote | L’**unanimité** requise le rend presque inapplicable |
| **Conditionnalité budgétaire** (2020) | Suspendre les fonds en cas d’atteinte à l’État de droit | Elle, elle a été utilisée |

## Les institutions et la question démocratique
| Institution | Sa légitimité | Ce qu’on lui reproche |
| **Parlement européen** | Élu au suffrage universel direct **depuis 1979** | Une participation faible aux européennes |
| **Conseil** | Réunit des gouvernements élus | La responsabilité est diluée |
| **Commission** | Investie par le Parlement | **Non élue**, et détient l’initiative législative |
| **CJUE** | Fait respecter le droit de l’Union | Accusée de gouverner par la jurisprudence |

La **Charte des droits fondamentaux** a valeur contraignante depuis **2009**.

## La participation citoyenne
| Dispositif | Ce qu’il permet |
| **Initiative citoyenne européenne** | Un million de citoyens d’au moins sept États demandent à la Commission de légiférer |
| **Conférence sur l’avenir de l’Europe** (2021-2022) | Des panels de citoyens tirés au sort |

## Le débat, honnêtement posé
> Ceux qui parlent de **déficit démocratique** pointent une machine lointaine et technique, où la responsabilité se dilue. Ceux qui le contestent rappellent que chaque décision est prise soit par des députés élus, soit par des gouvernements responsables devant leurs Parlements. Les deux arguments sont recevables : c’est la **lisibilité** du système, plus que sa légitimité formelle, qui fait problème.`,
          },
          questions: [
            ['Que fixent les critères de Copenhague de 1993 ?', ['Les conditions démocratiques d’adhésion à l’Union', 'Les règles budgétaires de la zone euro', 'Les quotas migratoires', 'Le fonctionnement de la BCE'], 0, 'Institutions stables, État de droit, droits de l’homme, protection des minorités.'],
            ['Depuis quand le Parlement européen est-il élu au suffrage universel direct ?', ['1979', '1957', '1992', '2009'], 0, 'Ses pouvoirs se sont ensuite considérablement étendus.'],
            ['Que permet l’article 7 du traité sur l’Union européenne ?', ['Sanctionner un État qui s’écarte des valeurs communes', 'Sortir de l’Union', 'Créer une armée commune', 'Suspendre l’euro'], 0, 'L’unanimité requise le rend très difficile à appliquer — d’où la conditionnalité budgétaire.'],
            ['Quelle institution européenne détient l’initiative législative ?', ['La Commission', 'Le Parlement', 'Le Conseil', 'La CJUE'], 0, 'C’est l’un des arguments avancés pour parler de déficit démocratique.'],
            ['Que permet l’initiative citoyenne européenne ?', ['Demander à la Commission de légiférer avec un million de signatures', 'Organiser un référendum européen', 'Destituer un commissaire', 'Élire le président de la Commission'], 0, 'Les signatures doivent venir d’au moins sept États membres.'],
            ['L’adhésion à l’Union a servi d’ancrage démocratique après des dictatures.', ['Vrai', 'Faux'], 0, 'Espagne, Portugal, Grèce, puis les pays d’Europe centrale après 1989.'],
            ['Depuis quand la Charte des droits fondamentaux a-t-elle valeur contraignante ?', ['2009', '2000', '1993', '2016'], 0, 'Avec l’entrée en vigueur du traité de Lisbonne.'],
            ['Aucune décision européenne n’est prise par des responsables issus d’élections.', ['Vrai', 'Faux'], 1, 'Elles le sont par des députés élus ou par des gouvernements responsables devant leurs Parlements.'],
          ],
        },

        // ===== Axe 2 — Repenser et faire vivre la démocratie ===============
        {
          titre: 'Faire vivre le débat dans une démocratie',
          lecon: {
            titre: 'Argumenter, écouter, se contredire',
            cours: `Une démocratie ne tient pas seulement par ses institutions : elle tient par la **qualité de son débat**. Or celle-ci n’a rien de spontané.

## Débat n’est pas dispute
| | Débattre | Se disputer |
| Ce qu’on avance | Des raisons et des faits vérifiables | Des affirmations |
| Ce qu’on fait de l’objection | On l’écoute, on la prend au sérieux | On l’ignore ou on la ridiculise |
| Ce qu’on attaque | L’**idée** | La **personne** |
| Ce qu’on cherche | Ce qui est vrai | À avoir raison |

> Dans un débat démocratique, le **désaccord argumenté est productif** : il oblige chacun à préciser sa position. C’est le désaccord non argumenté qui stérilise.

## L’espace public
Le philosophe **Habermas** appelle *espace public* le lieu où les citoyens discutent des affaires communes : autrefois la presse, les cafés, les partis ; aujourd’hui, principalement, les médias et les **réseaux sociaux**.

| La difficulté | Ce qu’elle produit |
| La **concentration** des médias | Une question de pluralisme |
| Les **algorithmes** de recommandation | Bulles de filtre, chambres d’écho : on voit ce qui confirme et ce qui indigne |
| La **désinformation** | Elle circule plus vite que sa correction |
| L’anonymat et le harcèlement | Ils font taire |

## Les réponses
| Réponse | Ce qu’elle vise |
| **Éducation aux médias et à l’information** | Former le lecteur, inscrite dans les programmes |
| Règles de pluralisme (Arcom) | Garantir les temps de parole |
| *Fact-checking*, règlement européen sur les services numériques | Responsabiliser les plateformes |
| Débat organisé | CNDP, enquêtes publiques, **conventions citoyennes** — 150 citoyens tirés au sort pour celle sur le climat |

## Ce qu’on attend de toi
1. **Construire** un argument : thèse, raison, exemple.
2. **Repérer un sophisme** : attaque personnelle, faux dilemme, généralisation abusive.
3. **Vérifier** une source.
4. **Exposer honnêtement** la position adverse **avant** de la discuter.`,
          },
          questions: [
            ['Qu’est-ce qu’argumenter ?', ['Appuyer une position sur des raisons et des faits vérifiables', 'Répéter son opinion avec conviction', 'Convaincre par tous les moyens', 'Éviter le désaccord'], 0, 'Sans raisons vérifiables, il n’y a pas de débat mais une confrontation d’affirmations.'],
            ['Quel philosophe a théorisé la notion d’espace public ?', ['Habermas', 'Montesquieu', 'Rousseau', 'Tocqueville'], 0, 'Le lieu où les citoyens discutent publiquement des affaires communes.'],
            ['Qu’est-ce qu’une bulle de filtre ?', ['Une exposition sélective à des contenus qui confirment nos opinions', 'Un filtre anti-spam', 'Une censure d’État', 'Un dispositif de fact-checking'], 0, 'Les algorithmes privilégient ce qui confirme et ce qui indigne.'],
            ['Combien de citoyens tirés au sort composaient la Convention citoyenne pour le climat ?', ['150', '50', '500', '1 000'], 0, 'Une expérimentation majeure de délibération citoyenne en France.'],
            ['Un désaccord argumenté est utile à la démocratie.', ['Vrai', 'Faux'], 0, 'C’est le désaccord non argumenté, ou l’absence de débat, qui l’abîme.'],
            ['Qu’est-ce qu’un sophisme ?', ['Un raisonnement trompeur qui a l’apparence de la logique', 'Une opinion minoritaire', 'Une information fausse', 'Un argument d’autorité valide'], 0, 'Attaque personnelle, faux dilemme et généralisation abusive en sont des formes courantes.'],
            ['La désinformation circule généralement plus vite que sa correction.', ['Vrai', 'Faux'], 0, 'C’est l’une des difficultés structurelles de l’espace informationnel actuel.'],
            ['Que vise l’éducation aux médias et à l’information ?', ['Apprendre à vérifier et à hiérarchiser l’information', 'Interdire les réseaux sociaux aux mineurs', 'Former des journalistes', 'Contrôler les contenus en ligne'], 0, 'Elle est inscrite dans les programmes scolaires.'],
          ],
        },
        {
          titre: 'Le modèle démocratique en question : exemplarité et transparence',
          lecon: {
            titre: 'Ce qu’on exige désormais des élus',
            cours: `La défiance envers les responsables politiques est devenue un fait durable des démocraties. La réponse construite depuis dix ans tient en deux mots : **transparence** et **exemplarité**.

## Le tournant de 2013
L’affaire Cahuzac — un ministre du Budget mentant sur un compte à l’étranger — provoque une réforme d’ampleur.

| L’institution créée | Ce qu’elle contrôle |
| La **HATVP** | Les **déclarations de patrimoine** et les **déclarations d’intérêts** de milliers de responsables publics, publiées pour certains |

## Les lois de 2017
| La mesure | Ce qu’elle interdit ou impose |
| Emplois familiaux | Interdits aux parlementaires |
| Réserve parlementaire | Supprimée |
| Frais de mandat | Encadrés et justifiés |
| Casier judiciaire | Doit être compatible avec l’exercice d’un mandat |
| **Non-cumul** | Entre un mandat parlementaire et un exécutif local |

## Encadrer l’influence
| Notion | Sa définition | L’obligation |
| **Représentant d’intérêts** | Un lobbyiste | S’inscrire au répertoire public de la HATVP et déclarer ses actions |
| **Conflit d’intérêts** | Une situation où un intérêt privé peut influencer une fonction publique | Le déclarer, et se **déporter** |

## Protéger ceux qui alertent
| Texte | Ce qu’il apporte |
| **Loi Sapin II** (2016) | Premier statut du **lanceur d’alerte** |
| **Loi de 2022** | Transpose la directive européenne de 2019 : protection contre les représailles, procédure de signalement clarifiée |

## Contrôler l’argent public
La **Cour des comptes** contrôle l’emploi des fonds publics et publie ses rapports ; les données publiques sont diffusées en **open data** ; les marchés publics sont encadrés.

> À nuancer, comme toujours : la transparence **n’est pas la vertu**. Elle rend le contrôle possible, elle ne le garantit pas — et poussée à l’extrême, elle peut se retourner en défiance permanente, ou en surveillance de la vie privée des élus.`,
          },
          questions: [
            ['Quelle autorité contrôle les déclarations de patrimoine des responsables publics ?', ['La HATVP', 'La CNIL', 'La Cour des comptes', 'Le Conseil constitutionnel'], 0, 'Créée en 2013 après l’affaire Cahuzac.'],
            ['Qu’interdisent les lois de 2017 pour la confiance dans la vie politique ?', ['Les emplois familiaux des parlementaires', 'Le financement public des partis', 'Le lobbying', 'Le cumul de deux mandats locaux'], 0, 'Elles suppriment aussi la réserve parlementaire et encadrent les frais de mandat.'],
            ['Qu’est-ce qu’un conflit d’intérêts ?', ['Une situation où un intérêt privé peut influencer une fonction publique', 'Un désaccord entre deux ministères', 'Une grève dans le service public', 'Un litige commercial'], 0, 'Il doit être déclaré, et la personne concernée doit se déporter.'],
            ['Quelle loi de 2016 protège les lanceurs d’alerte ?', ['La loi Sapin II', 'La loi SILT', 'La loi Informatique et libertés', 'La loi de 1905'], 0, 'Renforcée en 2022 par la transposition d’une directive européenne.'],
            ['Les lobbyistes doivent s’inscrire sur un répertoire public.', ['Vrai', 'Faux'], 0, 'Tenu par la HATVP, il oblige à déclarer les actions d’influence menées.'],
            ['Quelle institution contrôle l’emploi des fonds publics ?', ['La Cour des comptes', 'La HATVP', 'Le Conseil d’État', 'L’Arcom'], 0, 'Ses rapports publics alimentent le débat démocratique.'],
            ['Le non-cumul entre mandat parlementaire et exécutif local s’applique depuis…', ['2017', '2013', '2008', '2022'], 0, 'Une transformation importante du métier de parlementaire.'],
            ['La transparence garantit à elle seule la probité des élus.', ['Vrai', 'Faux'], 1, 'Elle rend le contrôle possible ; elle ne remplace ni la déontologie ni la sanction.'],
          ],
        },
        {
          titre: 'S’engager dans la démocratie au XXIe siècle',
          lecon: {
            titre: 'Voter n’est pas la seule façon d’agir',
            cours: `L’engagement ne disparaît pas : il **change de forme**. Le militantisme de long terme recule, l’engagement ponctuel, concret et choisi progresse.

## Les formes classiques
| Forme | Son état en France |
| Le **vote** | Premier acte civique, mais en recul |
| Les **partis politiques** | Effectifs fortement diminués |
| Les **syndicats** | Taux de syndicalisation autour de **10 %**, l’un des plus faibles d’Europe — alors que la couverture des accords collectifs y est l’une des plus élevées |
| Les **associations** | Plus d’**un million**, environ **20 millions de bénévoles** : la première forme d’engagement du pays |

## Les formes nouvelles
| Forme | Ce qu’elle est |
| Pétitions en ligne, campagnes sur les réseaux | Une mobilisation rapide, sans organisation |
| **Consommation engagée** | Boycott, achat responsable |
| **Désobéissance civile** | Violation **publique, assumée et non violente** d’une règle jugée injuste, en acceptant la sanction — Thoreau, Gandhi, King |
| **Service civique** (depuis 2010) | Ouvert aux 16-25 ans, plusieurs centaines de milliers de missions |
| Engagement local | Conseils de quartier, conseils municipaux de jeunes, budgets participatifs |

## Les limites à connaître
| Le risque | Ce qui le distingue d’un vrai engagement |
| Le « **slacktivisme** » | Un clic qui donne le sentiment d’agir, sans coût ni effet |
| À l’inverse | Une pétition massive peut porter un sujet jusqu’au Parlement |

> Ce qui sépare les deux : la **continuité** de l’action et son **ancrage** dans une organisation. Un geste isolé n’est pas un engagement, même s’il est sincère.

## Ce que le programme te demande
Identifier une cause, choisir une forme d’action **proportionnée et légale**, en mesurer les effets — et savoir distinguer l’**engagement**, qui vise l’intérêt général, de la simple expression d’une opinion.`,
          },
          questions: [
            ['Quelle est aujourd’hui la première forme d’engagement en France ?', ['Le bénévolat associatif', 'L’adhésion à un parti', 'La syndicalisation', 'La pétition en ligne'], 0, 'Plus d’un million d’associations et de l’ordre de 20 millions de bénévoles.'],
            ['Quel est l’ordre de grandeur du taux de syndicalisation en France ?', ['Environ 10 %', 'Environ 40 %', 'Environ 25 %', 'Environ 60 %'], 0, 'L’un des plus faibles d’Europe, alors que la couverture des accords y est très large.'],
            ['Qu’est-ce que la désobéissance civile ?', ['Violer publiquement et sans violence une règle jugée injuste, en acceptant la sanction', 'Refuser de payer ses impôts en secret', 'Manifester sans autorisation', 'Voter blanc'], 0, 'Thoreau, Gandhi et Martin Luther King en sont les références classiques.'],
            ['Depuis quelle année existe le service civique ?', ['2010', '1997', '2000', '2016'], 0, 'Ouvert aux 16-25 ans, pour des missions d’intérêt général.'],
            ['Qu’appelle-t-on le « slacktivisme » ?', ['Un engagement en ligne sans effort ni effet réel', 'Un militantisme syndical radical', 'Un boycott organisé', 'Une grève illimitée'], 0, 'Ce qui fait la différence : la continuité de l’action et son ancrage collectif.'],
            ['Les effectifs des partis politiques ont fortement diminué en France.', ['Vrai', 'Faux'], 0, 'L’engagement se reporte vers des formes plus ponctuelles et choisies.'],
            ['Qu’est-ce qu’un budget participatif ?', ['Une part du budget local dont l’affectation est décidée par les habitants', 'Le budget de l’État voté par référendum', 'Une cagnotte associative', 'Le financement participatif d’une entreprise'], 0, 'Une forme concrète de démocratie participative locale.'],
            ['Une pétition en ligne ne peut avoir aucun effet institutionnel.', ['Vrai', 'Faux'], 1, 'Une pétition massive peut porter un sujet jusqu’au Parlement.'],
          ],
        },
        {
          titre: 'Nouvelles aspirations démocratiques',
          lecon: {
            titre: 'Délibérer, tirer au sort, associer',
            cours: `À côté du vote, de nouvelles pratiques cherchent à associer les citoyens **entre** deux élections. Elles ne remplacent pas la démocratie représentative : elles la complètent — et la mettent sous tension.

## La démocratie délibérative
Son pari : une décision est meilleure et plus légitime si elle est précédée d’une **délibération informée**.

| Dispositif | Date | Ce qu’il a produit |
| Convention citoyenne pour le **climat** | 2019-2020 | 149 propositions, reprises très partiellement |
| Convention sur la **fin de vie** | 2022-2023 | Un avis favorable à une aide active à mourir |
| Panels européens | Depuis 2021 | Des recommandations à la Commission |

Le **tirage au sort** revient ainsi dans le débat.

| Ce qu’il apporte | Ce qui lui manque |
| Une diversité sociale que l’élection ne produit pas | Un **mandat** : personne n’a voté pour ces citoyens |

D’où la question, toujours ouverte : **que fait-on des propositions ?**

## La démocratie participative locale
| Dispositif | Ce qu’il permet |
| **Budgets participatifs** | Les habitants affectent une part du budget municipal |
| Conseils de quartier, jurys citoyens | Un avis organisé sur les projets |
| **Enquêtes publiques** et **CNDP** | Un débat obligatoire avant les grands aménagements |

## Les demandes plus radicales
Le **référendum d’initiative citoyenne (RIC)** est réclamé notamment depuis le mouvement des Gilets jaunes. Le droit français ne connaît que le **référendum d’initiative partagée** (2008).

| Seuil du RIP | Valeur |
| Parlementaires signataires | Un **cinquième** |
| Électeurs signataires | Un **dixième**, soit environ **4,8 millions** |
| Fois où la procédure est allée à son terme | **Aucune** |

## Les nouveaux objets du débat
| Objet | Ce qui l’encadre |
| **Démocratie environnementale** | La **Charte de l’environnement**, adossée à la Constitution en **2005** : droit à l’information et à la participation |
| Droits des **générations futures** | Invoqués dans les contentieux climatiques |
| **Transparence des algorithmes** | Ceux utilisés par l’administration |
| *Civic tech* | Consulter par le numérique — au risque de consultations sans suite |

> La question qui traverse tout le chapitre : associer davantage les citoyens **renforce** la démocratie si les décisions en tiennent compte. Sinon, chaque consultation sans effet **aggrave** la défiance qu’elle prétendait réduire.`,
          },
          questions: [
            ['Sur quel pari repose la démocratie délibérative ?', ['Une décision précédée d’une délibération informée est plus légitime', 'La majorité a toujours raison', 'Les experts doivent décider seuls', 'Le vote suffit à légitimer'], 0, 'D’où les panels de citoyens tirés au sort et formés avant de délibérer.'],
            ['Quel est l’avantage du tirage au sort par rapport à l’élection ?', ['Il assure une diversité sociale que l’élection ne produit pas', 'Il donne un mandat plus fort', 'Il coûte moins cher', 'Il évite tout débat'], 0, 'En revanche, il ne confère pas de mandat : le sort des propositions reste la difficulté.'],
            ['Quel référendum existe en droit français depuis 2008 ?', ['Le référendum d’initiative partagée', 'Le référendum d’initiative citoyenne', 'Le référendum révocatoire', 'Le référendum local obligatoire'], 0, 'Ses seuils, très élevés, n’ont jamais été franchis jusqu’au bout.'],
            ['Que garantit la Charte de l’environnement adossée à la Constitution en 2005 ?', ['Un droit à l’information et à la participation du public', 'L’interdiction des énergies fossiles', 'Un droit de veto écologique', 'La neutralité carbone'], 0, 'Elle fonde la démocratie environnementale en droit français.'],
            ['Un budget participatif laisse les habitants décider d’une part du budget local.', ['Vrai', 'Faux'], 0, 'C’est la forme la plus répandue de démocratie participative locale.'],
            ['Quelle convention citoyenne a réuni 150 personnes tirées au sort en 2019-2020 ?', ['La Convention citoyenne pour le climat', 'La Convention sur la fin de vie', 'Le Grand Débat national', 'La Conférence sur l’avenir de l’Europe'], 0, 'Ses propositions ont été partiellement reprises, ce qui a nourri le débat sur les suites données.'],
            ['Une consultation citoyenne sans suite renforce la confiance envers les institutions.', ['Vrai', 'Faux'], 1, 'Elle produit l’inverse : la déception aggrave la défiance qu’elle prétendait réduire.'],
            ['Que désigne la civic tech ?', ['Les outils numériques de consultation et de participation citoyenne', 'La surveillance algorithmique', 'Le vote électronique obligatoire', 'Les réseaux sociaux politiques'], 0, 'Elle facilite la consultation, sans régler la question du suivi des avis recueillis.'],
          ],
        },
        {
          titre: 'Conscience démocratique et relations internationales',
          lecon: {
            titre: 'Des droits universels, un monde d’États souverains',
            cours: `Depuis 1945, un ordre juridique international proclame des droits **universels**. Il se heurte en permanence à un principe aussi fort : la **souveraineté** des États.

## Les textes fondateurs
| Texte | Date | Force contraignante |
| **Déclaration universelle des droits de l’homme** | 1948 | **Aucune** — mais une référence morale et juridique universelle |
| **Convention européenne des droits de l’homme** | 1950 | **Oui** : la CEDH peut condamner un État sur requête d’un simple individu |
| Pactes internationaux | 1966 | Oui, avec un contrôle faible |
| Convention des droits de l’enfant | 1989 | Oui |

## La justice pénale internationale
La **Cour pénale internationale** — statut de Rome, **1998**, en vigueur **2002** — juge des **individus**, et non des États.

| Ce qu’elle juge | Ses limites |
| Génocide | Les États-Unis, la Chine, la Russie et l’Inde n’ont pas ratifié |
| Crimes contre l’humanité | Elle dépend des États pour arrêter les personnes recherchées |
| Crimes de guerre, crime d’agression | Ses procédures sont longues |

## Intervenir ou non
| Notion | Ce qu’elle pose | Ce qui la bloque |
| **Droit d’ingérence** | Une communauté internationale peut intervenir | Il n’a jamais eu de base juridique claire |
| **Responsabilité de protéger** (ONU, 2005) | Un État qui massacre sa population perd la protection de sa souveraineté | Son application dépend du **Conseil de sécurité**, où cinq membres ont le **veto** |

C’est ce veto qui a bloqué l’action sur la Syrie comme sur d’autres crises.

## Les acteurs non étatiques
Les **ONG** — Amnesty International, Human Rights Watch, Médecins sans frontières, Reporters sans frontières — documentent, alertent, plaident.

> Leur pouvoir est celui de la **preuve** et de l’**opinion**. Elles n’ont aucune force contraignante, mais leurs rapports pèsent sur les décisions et les réputations : c’est une puissance sans moyens de coercition.

## Le débat honnête
| L’argument | Ce qu’il rappelle |
| Les réussites | L’élargissement européen a ancré des démocraties |
| Les échecs | Là où elle a été **imposée par la force**, la démocratie n’a pas pris |
| Le reproche | Le « **deux poids, deux mesures** » adressé aux puissances occidentales |

Ce que le programme attend : comprendre que la conscience démocratique **ne s’arrête pas aux frontières**, tout en mesurant ce qui limite son application — souveraineté, veto, rapports de force.`,
          },
          questions: [
            ['En quelle année la Déclaration universelle des droits de l’homme est-elle adoptée ?', ['1948', '1945', '1950', '1966'], 0, 'Par l’Assemblée générale de l’ONU : une référence sans force contraignante.'],
            ['Quelle cour peut condamner un État sur requête d’un individu ?', ['La Cour européenne des droits de l’homme', 'La Cour pénale internationale', 'La Cour internationale de justice', 'La CJUE'], 0, 'Elle applique la Convention européenne des droits de l’homme de 1950.'],
            ['Que juge la Cour pénale internationale ?', ['Des individus, pour les crimes les plus graves', 'Des États, pour violation de traités', 'Des entreprises', 'Des organisations internationales'], 0, 'Génocide, crimes contre l’humanité, crimes de guerre, crime d’agression.'],
            ['Toutes les grandes puissances ont ratifié le statut de Rome.', ['Vrai', 'Faux'], 1, 'États-Unis, Chine, Russie et Inde ne l’ont pas ratifié — une limite majeure.'],
            ['Qu’est-ce que la responsabilité de protéger, adoptée en 2005 ?', ['Le principe autorisant la communauté internationale à agir quand un État massacre sa population', 'L’obligation d’accueillir des réfugiés', 'La protection des ambassades', 'Le devoir d’aide au développement'], 0, 'Son application dépend du Conseil de sécurité, donc du droit de veto.'],
            ['Quel mécanisme bloque souvent l’action du Conseil de sécurité ?', ['Le droit de veto des cinq membres permanents', 'Le vote à la majorité qualifiée', 'L’absence de budget', 'Le retrait des ONG'], 0, 'Il a notamment paralysé l’action sur la Syrie.'],
            ['Quel est le principal pouvoir des ONG de défense des droits humains ?', ['Documenter et alerter l’opinion', 'Sanctionner les États', 'Arrêter les responsables', 'Voter à l’ONU'], 0, 'Leurs rapports pèsent par la preuve et la réputation, non par la contrainte.'],
            ['La promotion de la démocratie par la force a produit des résultats contrastés.', ['Vrai', 'Faux'], 0, 'Ancrage réussi par l’élargissement européen, échecs coûteux là où elle a été imposée militairement.'],
          ],
        },
      ],
    },
  ],
}
