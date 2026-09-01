// Enseignement scientifique — Terminale (tronc commun, séries générales).
//
// Découpage : les 16 fiches du programme officiel, regroupées par le programme
// en 6 chapitres (Science climat et société · Le futur des énergies × 2 ·
// Une histoire du vivant × 3). Ce module ne pose que l'ORDRE : le chapitre qui
// coiffe chaque fiche (`chapters.theme`) est écrit par la MIGRATION 248, à la
// main, comme pour l'anglais (243) et l'espagnol (244). Ne pas y ajouter d'`axe`
// ici — la 228 est un fichier généré, et elle doit rester reproductible à
// l'octet près depuis ce module.
//
// Cette matière est bicéphale — physique-chimie, SVT, histoire des sciences et
// numérique dans un même programme. Chaque cours reste donc ancré sur des
// ORDRES DE GRANDEUR chiffrés (340 W/m², 280 → 420 ppm, 800 000 ans de
// carottes, 8 milliards d'humains) : au bac, l'épreuve porte moins sur des
// définitions que sur l'exploitation de données, et un élève qui n'a pas les
// repères chiffrés en tête ne sait pas commenter un graphique.
//
// Pas de LaTeX (LessonRichContent ne le rend pas) : P = R × I², E = P × t.

export default {
  slug: 'enseignement-scientifique',
  nom: 'Ens. scientifique',

  titreMigration: 'ENSEIGNEMENT SCIENTIFIQUE Tle — LE PROGRAMME OFFICIEL',

  motif: `CONSTAT MESURÉ (sonde en lecture seule sur la base, 05/08/2026) :
l'enseignement scientifique de Terminale n'avait que 4 chapitres, taillés
dans un découpage maison (« L'atmosphère et le climat », « L'énergie :
conversions et enjeux », « Une histoire du vivant », « L'intelligence
artificielle ») qui résumait TOUT le programme en quatre fiches. Un élève qui
révisait le transport de l'électricité, les modèles démographiques, les
cycles de Milankovitch ou l'histoire de la lignée humaine ne trouvait rien.
Cette migration installe les 16 fiches du programme officiel, dans l'ordre
des 6 chapitres du BO, et retire les 4 fiches de synthèse qu'elles
recouvrent entièrement.`,

  // Les 4 anciens chapitres partent : ce sont des composites que les 16
  // nouveaux recouvrent entièrement, et les laisser afficherait deux fois le
  // même cours sur la page matière (« L'atmosphère et le climat » juste devant
  // « L'atmosphère terrestre : son rôle… »).
  //
  // ON NE SUPPRIME PAS PAR TITRE : le repère est la LEÇON. Les 4 anciens
  // chapitres, et eux seuls, portent les deux leçons génériques posées par
  // 076/148 (« L'essentiel du cours » et « Exercices types ») — vérifié en base
  // le 05/08/2026. Aucun chapitre neuf n'en porte : rejouer la migration ne
  // supprime plus rien. Le filtre `level = 'Tle'` protège la Première, qui
  // porte les mêmes deux leçons génériques sur ses 4 chapitres et n'est pas
  // concernée par cette migration.
  menage: [
    {
      raison: `La file « À revoir » d'abord : review_items.item_id n'a PAS de clé
étrangère (il pointe soit une question, soit une carte). Rien ne casse si on
l'oublie — le lecteur écarte déjà un contenu disparu — mais le compteur
« X à revoir » continuerait de compter des questions qui n'existent plus.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'enseignement-scientifique'
   AND c.level = 'Tle'
   AND l.title IN ('L''essentiel du cours', 'Exercices types');`,
    },
    {
      raison: `Les quiz ensuite : quizzes.lesson_id est ON DELETE SET NULL, donc
supprimer le chapitre laisserait derrière lui des quiz orphelins, rattachés à
aucune leçon mais toujours servis par le moteur de révision.`,
      sql: `DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'enseignement-scientifique'
   AND c.level = 'Tle'
   AND l.title IN ('L''essentiel du cours', 'Exercices types');`,
    },
    {
      raison: `Puis les chapitres : leçons, fiches de révision, supports, progression
et chapitres cochés partent en cascade (toutes les clés étrangères vers
chapters et lessons sont ON DELETE CASCADE).`,
      sql: `DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'enseignement-scientifique'
   AND c.level = 'Tle'
   AND EXISTS (
     SELECT 1 FROM public.lessons l
      WHERE l.chapter_id = c.id
        AND l.title IN ('L''essentiel du cours', 'Exercices types')
   );`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      chapitres: [
        // ===== Chapitre 1 — Science, climat et société ======================
        {
          titre: 'L’atmosphère terrestre : son rôle dans l’apparition et dans le maintien de la vie',
          lecon: {
            titre: 'Une atmosphère fabriquée par le vivant',
            cours: `L’air que tu respires n’a rien d’un décor posé une fois pour toutes : sa composition actuelle est le **produit** de la vie, pas sa condition de départ.

## L’atmosphère primitive
Il y a environ **4,5 milliards d’années**, l’atmosphère issue du dégazage volcanique n’a rien de commun avec l’actuelle.

| Gaz | Atmosphère primitive | Atmosphère actuelle |
| Diazote | Présent | **78 %** |
| Dioxygène | **Absent** | **21 %** |
| Dioxyde de carbone | Très abondant | 0,04 % |
| Vapeur d’eau | Très abondante | Variable |

En se refroidissant, la vapeur d’eau se condense : les **océans** se forment il y a environ 4,4 à 4 milliards d’années. Une grande partie du CO₂ s’y dissout puis se fixe dans les roches carbonatées — d’où l’effondrement de sa teneur.

## L’irruption du dioxygène
| Date | L’événement |
| −3,8 milliards d’années | La vie apparaît dans l’eau |
| Puis | Les **cyanobactéries** photosynthétiques produisent du O₂ |
| D’abord | Il est consommé par l’oxydation du fer dissous : les **fers rubanés** |
| −2,4 milliards d’années | Il s’accumule dans l’atmosphère : la **Grande Oxydation** |

> La composition actuelle est une **signature du vivant** : aucune planète voisine n’a un tel taux de dioxygène. Chercher du O₂ dans l’atmosphère d’une exoplanète, c’est y chercher de la vie.

## Le bouclier d’ozone
Une partie du dioxygène de la haute atmosphère est transformée en **ozone (O₃)** par le rayonnement solaire. La couche d’ozone se constitue entre environ 2 milliards et 500 millions d’années et absorbe les **UV** les plus énergétiques.

Sans elle, la vie ne pouvait rester qu’**immergée** — l’eau faisait écran. C’est son installation qui rend possible la **sortie des eaux**, il y a environ 500 à 400 millions d’années.

## Ce que l’atmosphère fait aujourd’hui
| Fonction | Ce qu’elle permet |
| Fournir le dioxygène et le CO₂ | Respiration et photosynthèse |
| Filtrer les UV, grâce à l’ozone | La vie hors de l’eau |
| Maintenir l’**effet de serre** | Une température compatible avec l’eau liquide |
| Redistribuer l’énergie reçue | De l’équateur vers les pôles |`,
          },
          questions: [
            ['Quel gaz était ABSENT de l’atmosphère primitive ?', ['Le dioxygène', 'Le dioxyde de carbone', 'La vapeur d’eau', 'Le diazote'], 0, 'Le dioxygène est un produit tardif de la photosynthèse, pas un gaz du dégazage volcanique.'],
            ['Quels organismes sont à l’origine du dioxygène atmosphérique ?', ['Les cyanobactéries', 'Les premiers animaux', 'Les champignons', 'Les végétaux terrestres'], 0, 'Ces micro-organismes photosynthétiques oxygènent l’océan puis l’atmosphère.'],
            ['La Grande Oxydation date d’environ 2,4 milliards d’années.', ['Vrai', 'Faux'], 0, 'Le O₂ commence à s’accumuler une fois le fer océanique oxydé (fers rubanés).'],
            ['Quelle est la composition approximative de l’atmosphère actuelle ?', ['78 % N₂, 21 % O₂', '50 % N₂, 50 % O₂', '78 % O₂, 21 % N₂', '90 % CO₂, 10 % O₂'], 0, 'Le CO₂ ne représente qu’environ 0,04 %, malgré son rôle climatique majeur.'],
            ['Quel rôle joue la couche d’ozone ?', ['Elle absorbe les UV les plus énergétiques', 'Elle produit le dioxygène', 'Elle refroidit la surface', 'Elle dissout le CO₂'], 0, 'C’est ce filtre qui a rendu possible la vie hors de l’eau.'],
            ['La sortie des eaux a été possible avant la formation de la couche d’ozone.', ['Vrai', 'Faux'], 1, 'Sans filtre à UV, la vie ne pouvait subsister qu’immergée : l’ozone précède la conquête des continents.'],
            ['Où est parti l’essentiel du CO₂ de l’atmosphère primitive ?', ['Dissous dans l’océan puis piégé dans les roches carbonatées', 'Détruit par les UV', 'Échappé dans l’espace', 'Transformé en ozone'], 0, 'La formation des océans a lessivé l’atmosphère de son CO₂.'],
            ['La composition de l’atmosphère actuelle est indépendante de la vie.', ['Vrai', 'Faux'], 1, 'Les 21 % de dioxygène en sont directement issus : l’atmosphère est un produit du vivant.'],
          ],
        },
        {
          titre: 'Le climat : un système complexe',
          lecon: {
            titre: 'Bilan radiatif, rétroactions et couplages',
            cours: `Le climat n’est pas la météo : c’est la **statistique** du temps sur au moins **30 ans**. Et cette statistique est pilotée par une comptabilité d’énergie.

## Le bilan radiatif
| Flux | Valeur | Ce qu’il devient |
| Reçu du Soleil | environ **340 W/m²** | En moyenne sur toute la surface |
| Réfléchi | environ **30 %** | Nuages, glaces, surfaces claires : c’est l’**albédo** |
| Absorbé | le reste | Réémis vers l’espace en **infrarouge** |

À l’équilibre, entrées = sorties, et la température moyenne reste stable.

## L’effet de serre
Certains gaz absorbent l’infrarouge émis par le sol et en réémettent une partie **vers le bas** : vapeur d’eau, **CO₂**, **méthane (CH₄)**, protoxyde d’azote.

| Sans effet de serre | Avec l’effet de serre naturel |
| environ **−18 °C** | environ **+15 °C** |

> Un **forçage radiatif** positif, c’est un déséquilibre : la Terre reçoit plus qu’elle ne renvoie. Elle se réchauffe jusqu’à retrouver un équilibre — à une température plus haute.

## Les rétroactions
Le système ne réagit pas proportionnellement, parce qu’il se répond à lui-même.

| Type | Le mécanisme | Son effet |
| **Positive** | La fonte des glaces diminue l’albédo, donc la surface absorbe plus, donc elle fond plus | Elle **amplifie** |
| **Positive** | Un air plus chaud contient plus de vapeur d’eau, qui est un gaz à effet de serre | Elle amplifie |
| **Négative** | Un sol plus chaud rayonne plus d’infrarouge, donc évacue plus d’énergie | Elle **freine** |

## Les couplages
| Réservoir | Ce qu’il absorbe | Comment il redistribue |
| L’**océan** | Plus de 90 % de l’excès de chaleur, un quart du CO₂ émis | La **circulation thermohaline** |
| L’**atmosphère** | Le reste | Les **cellules de convection** |

Les deux fluides sont couplés : **El Niño**, oscillation du Pacifique, dérègle les précipitations à l’échelle du globe.

## Pourquoi « complexe »
| La difficulté | Sa conséquence |
| Beaucoup de variables | Aucune ne suffit à prédire |
| Des échelles de temps très différentes | L’atmosphère réagit en jours, l’océan profond en siècles |
| Des rétroactions et des seuils | La réponse n’est ni linéaire ni immédiate |`,
          },
          questions: [
            ['Quelle est la puissance solaire moyenne reçue par mètre carré de surface terrestre ?', ['Environ 340 W/m²', 'Environ 1 360 W/m²', 'Environ 100 W/m²', 'Environ 1 000 W/m²'], 0, '1 360 W/m² est la constante solaire face au Soleil ; répartie sur toute la sphère, elle donne environ 340 W/m².'],
            ['Que désigne l’albédo ?', ['La part du rayonnement réfléchie vers l’espace', 'La part absorbée par le sol', 'L’énergie émise en infrarouge', 'La quantité de CO₂ atmosphérique'], 0, 'Il vaut environ 0,3 pour la Terre ; la glace et les nuages ont un albédo élevé.'],
            ['Sans effet de serre, la température moyenne de la Terre serait d’environ −18 °C.', ['Vrai', 'Faux'], 0, 'Contre +15 °C aujourd’hui : l’effet de serre naturel vaut environ 33 °C.'],
            ['La fonte des glaces qui diminue l’albédo est un exemple de…', ['Rétroaction positive', 'Rétroaction négative', 'Forçage négatif', 'Couplage thermohalin'], 0, 'Moins de glace → plus d’absorption → plus de réchauffement → moins de glace.'],
            ['Où va la plus grande partie de l’excès de chaleur accumulé ?', ['Dans l’océan', 'Dans l’atmosphère', 'Dans les sols', 'Dans les glaciers'], 0, 'Plus de 90 % : c’est pourquoi le réchauffement se poursuit longtemps après les émissions.'],
            ['La différence entre météo et climat tient à la durée : le climat se définit sur au moins 30 ans.', ['Vrai', 'Faux'], 0, 'Un hiver froid ne dit rien du climat, seule la statistique longue compte.'],
            ['Quel phénomène couple océan et atmosphère à l’échelle du Pacifique ?', ['El Niño', 'La mousson', 'L’effet de serre', 'La circulation de Hadley'], 0, 'Cette oscillation dérègle les précipitations bien au-delà du Pacifique.'],
            ['Un forçage radiatif positif refroidit la planète.', ['Vrai', 'Faux'], 1, 'Il signifie que la Terre reçoit plus d’énergie qu’elle n’en renvoie : elle se réchauffe.'],
          ],
        },
        {
          titre: 'Variations passées, récentes et futures du climat',
          lecon: {
            titre: 'Lire le climat dans la glace',
            cours: `Le climat a toujours varié. L’argument n’infirme rien : ce qui distingue le réchauffement actuel, c’est sa **vitesse** et sa **cause**.

## Les archives naturelles
On reconstitue les climats anciens sans thermomètre, grâce à des **indicateurs**.

| Archive | Ce qu’elle donne | Jusqu’où elle remonte |
| **Carottes de glace** (Vostok, EPICA) | La composition de l’air, par les bulles piégées | Plus de **800 000 ans** |
| Isotopes de l’oxygène (δ¹⁸O) | La température | Idem, et plus loin dans les coquilles |
| **Pollens** | La végétation, donc le climat | Quelques dizaines de milliers d’années |
| **Cernes des arbres** | Année par année | Quelques milliers d’années |

> Ces archives montrent une **corrélation étroite** entre teneur en CO₂ et température sur 800 000 ans, avec une alternance glaciaire / interglaciaire d’environ 100 000 ans.

## Les causes des variations passées
Aux échelles de 10 000 à 100 000 ans, les **paramètres orbitaux** — cycles de **Milankovitch** — modifient la distribution de l’énergie reçue.

| Paramètre | Ce qu’il fait varier | Sa période |
| **Excentricité** | La forme de l’orbite | environ 100 000 ans |
| **Obliquité** | L’inclinaison de l’axe | environ 41 000 ans |
| **Précession** | L’orientation de l’axe | environ 21 000 ans |

S’y ajoutent le volcanisme, l’activité solaire, la dérive des continents. Tous ces facteurs sont **naturels** — et tous sont trop lents ou trop faibles pour expliquer le siècle écoulé.

## Le réchauffement récent
| Grandeur | 1850-1900 | Aujourd’hui |
| Température moyenne globale | Référence | **+1,1 à 1,2 °C** |
| CO₂ atmosphérique | environ **280 ppm** | plus de **420 ppm** |

Ce niveau de CO₂ est inédit depuis au moins 800 000 ans, et la **signature isotopique** du carbone ajouté désigne les combustibles fossiles. Le **GIEC** conclut que l’influence humaine sur ce réchauffement est **sans équivoque**.

## Les futurs possibles
| Scénario d’émissions | Réchauffement à la fin du siècle |
| Chute rapide | **+1,5 à +2 °C** |
| Poursuite | **+4 °C** et au-delà |

Conséquences attendues : montée du niveau marin, événements extrêmes plus intenses, déplacement des zones climatiques, acidification de l’océan.`,
          },
          questions: [
            ['Jusqu’à quelle ancienneté les carottes de glace antarctiques renseignent-elles le climat ?', ['Plus de 800 000 ans', 'Environ 10 000 ans', 'Environ 100 000 ans', 'Plus de 10 millions d’années'], 0, 'Les bulles d’air piégées y conservent la composition de l’atmosphère de l’époque.'],
            ['Quel cycle orbital dure environ 100 000 ans ?', ['L’excentricité', 'L’obliquité', 'La précession', 'La rotation'], 0, 'Obliquité ≈ 41 000 ans, précession ≈ 21 000 ans.'],
            ['La teneur en CO₂ est passée d’environ 280 ppm en 1850 à plus de 420 ppm aujourd’hui.', ['Vrai', 'Faux'], 0, 'Un niveau jamais atteint sur les 800 000 dernières années.'],
            ['De combien la température moyenne globale a-t-elle augmenté depuis 1850-1900 ?', ['Environ 1,1 °C', 'Environ 0,1 °C', 'Environ 3 °C', 'Environ 5 °C'], 0, 'L’essentiel de cette hausse s’est produit depuis 1975.'],
            ['Les cycles de Milankovitch suffisent à expliquer le réchauffement depuis 1900.', ['Vrai', 'Faux'], 1, 'Ils agissent sur des dizaines de milliers d’années : bien trop lents pour un siècle.'],
            ['Que mesure-t-on avec le rapport isotopique δ¹⁸O ?', ['La température de l’époque', 'La teneur en CO₂', 'Le niveau de la mer', 'L’activité volcanique'], 0, 'C’est le thermomètre des paléoclimatologues, lu dans la glace ou les coquilles.'],
            ['Quel organisme évalue et synthétise l’état des connaissances sur le climat ?', ['Le GIEC', 'L’OMC', 'L’AIEA', 'L’UNESCO'], 0, 'Il ne fait pas de recherche propre : il expertise la littérature scientifique existante.'],
            ['Le climat a toujours varié, donc le réchauffement actuel n’a rien de particulier.', ['Vrai', 'Faux'], 1, 'Ce qui est inédit, c’est la vitesse de la hausse et sa cause, mesurée comme anthropique.'],
          ],
        },
        {
          titre: 'Modèles prédictifs du climat du futur',
          lecon: {
            titre: 'Ce qu’un modèle peut dire, et ce qu’il ne peut pas',
            cours: `Un modèle climatique n’est pas une boule de cristal : c’est de la **physique résolue numériquement**, avec des incertitudes que les climatologues chiffrent eux-mêmes.

## Comment fonctionne un modèle
L’atmosphère et l’océan sont découpés en **mailles** de quelques dizaines de kilomètres de côté. Dans chaque maille, l’ordinateur résout pas de temps après pas de temps :

1. Les équations de la **mécanique des fluides** — les mouvements d’air et d’eau.
2. Le **transfert radiatif** — les échanges de rayonnement.
3. La **thermodynamique** — les changements d’état et de température.

> Ce qui est plus petit que la maille — un nuage, un orage — ne peut pas être calculé : il est **paramétré**, c’est-à-dire représenté de façon approchée. C’est la principale source d’incertitude physique, et les climatologues la nomment eux-mêmes.

## Comment on lui fait confiance
On **valide** un modèle en lui faisant rejouer le passé.

| Le test | Ce qu’il vérifie |
| Rejouer le climat du XXe siècle | Le modèle reproduit-il ce qu’on a mesuré ? |
| Les grandes éruptions volcaniques | Reproduit-il le refroidissement qui suit ? |
| Les climats anciens | Retrouve-t-il les périodes glaciaires ? |

Le test décisif : les modèles ne reproduisent le réchauffement observé **que si on y injecte les émissions humaines**. Avec les seuls facteurs naturels, la courbe reste plate.

## Prévoir le temps n’est pas projeter le climat
| | Prévision météo | Projection climatique |
| Horizon | Une dizaine de jours au plus | Un siècle |
| Ce qu’elle donne | Le temps qu’il fera tel jour | Des **statistiques** : moyennes, extrêmes |
| Pourquoi la limite | Le système est **chaotique** : une erreur minuscule enfle | Le forçage, lui, est connu |

## Les scénarios
Les modèles ne connaissent pas nos décisions futures. On leur fournit donc des **scénarios d’émissions** contrastés.

| Les trois sources d’incertitude | Leur poids |
| Le **scénario** — nos choix | De loin la plus grande |
| La physique du modèle | Modérée |
| La variabilité naturelle | Faible à long terme |

> Autrement dit : le futur climatique dépend surtout de **nous**, pas de la qualité des modèles.`,
          },
          questions: [
            ['Comment un modèle climatique découpe-t-il l’atmosphère ?', ['En mailles où il résout des équations physiques', 'En courbes statistiques ajustées aux données', 'En scénarios politiques', 'En archives naturelles'], 0, 'Chaque maille échange énergie et matière avec ses voisines, pas de temps après pas de temps.'],
            ['Comment valide-t-on un modèle climatique ?', ['En lui faisant rejouer des climats passés connus', 'En attendant la fin du siècle', 'En le comparant à la prévision météo', 'En le faisant valider par un vote'], 0, 'S’il reproduit le passé observé, sa physique est jugée fiable pour projeter.'],
            ['Les modèles reproduisent le réchauffement observé même sans les émissions humaines.', ['Vrai', 'Faux'], 1, 'Avec les seuls facteurs naturels, la courbe simulée reste plate : c’est le test d’attribution.'],
            ['Pourquoi la prévision météo est-elle limitée à une dizaine de jours ?', ['Parce que le système est chaotique', 'Parce que les ordinateurs sont trop lents', 'Parce que les satellites manquent', 'Parce que le climat change'], 0, 'Une erreur infime sur l’état initial est amplifiée jusqu’à rendre la prévision inutile.'],
            ['Que représentent les scénarios utilisés par les modèles ?', ['Des hypothèses d’émissions futures', 'Des erreurs de mesure', 'Des variantes de mailles', 'Des climats du passé'], 0, 'Le modèle calcule la physique ; le scénario, lui, encode nos choix collectifs.'],
            ['Une projection climatique prétend donner le temps qu’il fera à une date précise en 2087.', ['Vrai', 'Faux'], 1, 'Elle donne des statistiques (moyennes, extrêmes) en réponse à un forçage, jamais un bulletin météo.'],
            ['Quelle est la principale source d’incertitude sur le climat de 2100 ?', ['Le scénario d’émissions', 'La taille des mailles', 'La variabilité naturelle', 'La mesure des températures'], 0, 'Autrement dit : nos décisions pèsent plus que les limites des modèles.'],
            ['Ce qui est plus petit que la maille, comme un nuage, doit être paramétré.', ['Vrai', 'Faux'], 0, 'Cette représentation approchée est la principale source d’incertitude physique des modèles.'],
          ],
        },

        // ===== Chapitre 2 — Le futur des énergies : l'électricité ==========
        {
          titre: 'L’énergie électrique au cours des deux derniers siècles : le XIXe siècle',
          lecon: {
            titre: 'De la pile de Volta au réseau naissant',
            cours: `En un siècle, l’électricité passe du statut de curiosité de laboratoire à celui d’énergie industrielle. Tout tient à une découverte : on sait désormais la **produire en continu** et la **convertir**.

## Les trois découvertes fondatrices
| Date | Le savant | La découverte |
| **1800** | **Volta** | La **pile** : un courant continu et durable |
| **1820** | Œrsted | Un courant dévie une aiguille aimantée : électricité et magnétisme sont liés |
| **1831** | **Faraday** | L’**induction électromagnétique** |

> L’induction est le principe de **toute** la production électrique actuelle : faire tourner un aimant devant des bobines. Une centrale nucléaire, un barrage et une éolienne ne diffèrent que par **ce qui fait tourner l’aimant**.

## Les machines
| Date | La machine | Ce qu’elle apporte |
| 1869 | La **dynamo** de Zénobe Gramme | Du courant en quantité industrielle |
| Puis | L’**alternateur** | Du courant alternatif |

La machine tourne dans les deux sens : le même dispositif convertit l’énergie mécanique en énergie électrique (**générateur**) ou l’inverse (**moteur**).

## Les usages
**1879** : Edison met au point une lampe à **incandescence** durable. L’éclairage public et domestique se répand ; expositions universelles, tramways et premiers réseaux urbains font de la « fée électricité » un symbole de modernité.

## Les grandeurs à connaître
| Relation | Unités | Ce qu’elle donne |
| P = U × I | watts, volts, ampères | La puissance |
| E = P × t | joules, watts, secondes | L’énergie |
| 1 kWh = 3,6 × 10⁶ J | | L’unité de la facture |
| Rendement = énergie utile / énergie reçue | sans unité | Toujours inférieur à 1 |

L’écart au rendement de 1 part toujours en **chaleur** : c’est ce qui rend une conversion irréversible.`,
          },
          questions: [
            ['Qui met au point la première pile en 1800 ?', ['Volta', 'Faraday', 'Edison', 'Gramme'], 0, 'La pile de Volta fournit pour la première fois un courant continu durable.'],
            ['Que découvre Faraday en 1831 ?', ['L’induction électromagnétique', 'La lampe à incandescence', 'L’effet Joule', 'Le transistor'], 0, 'Un aimant en mouvement près d’une bobine y fait naître un courant : c’est le principe de toute production électrique.'],
            ['Une centrale nucléaire et une éolienne produisent l’électricité par le même principe physique.', ['Vrai', 'Faux'], 0, 'Dans les deux cas, l’induction : seule diffère la source qui fait tourner l’alternateur.'],
            ['Que produit une dynamo ?', ['De l’énergie électrique à partir d’énergie mécanique', 'De l’énergie mécanique à partir d’électricité', 'De la chaleur à partir de lumière', 'Du courant alternatif à partir de courant continu'], 0, 'La machine est réversible : utilisée à l’envers, c’est un moteur.'],
            ['Quelle relation donne la puissance électrique ?', ['P = U × I', 'P = U / I', 'P = R × I', 'P = E × t'], 0, 'En watts, avec U en volts et I en ampères.'],
            ['Un kilowattheure vaut 3,6 millions de joules.', ['Vrai', 'Faux'], 0, '1 kWh = 1 000 W × 3 600 s = 3,6 × 10⁶ J : c’est l’unité de la facture.'],
            ['Qui rend l’éclairage électrique domestique praticable en 1879 ?', ['Edison', 'Œrsted', 'Volta', 'Ampère'], 0, 'Sa lampe à incandescence est assez durable pour un usage courant.'],
            ['Le rendement d’une conversion d’énergie peut dépasser 1.', ['Vrai', 'Faux'], 1, 'Il est toujours inférieur à 1 : une part de l’énergie est dégradée en chaleur.'],
          ],
        },
        {
          titre: 'L’énergie électrique au cours des deux derniers siècles : le XXe siècle',
          lecon: {
            titre: 'Le siècle du réseau et des grandes centrales',
            cours: `Au XXe siècle, l’électricité cesse d’être un luxe urbain pour devenir une **infrastructure nationale**, puis la condition de tout ce qui suit — de l’électroménager à l’ordinateur.

## L’électrification du territoire
Les années 1920-1950 voient l’électrification des campagnes françaises, village par village. **EDF est créée en 1946** par nationalisation : production, transport et distribution sont unifiés dans une seule main.

## Les grandes filières de production
| Filière | Ce qui fait tourner la turbine | Sa qualité |
| **Hydraulique** | L’eau d’un barrage | Mobilisable en minutes |
| **Thermique à flamme** | La vapeur, chauffée au charbon, au fioul ou au gaz | Pilotable, mais carbonée |
| **Nucléaire** | La vapeur, chauffée par la **fission** de l’uranium | Massive et peu carbonée |

> Toutes ces filières, **sauf le photovoltaïque**, se ramènent au même schéma : une source d’énergie fait tourner une turbine, la turbine entraîne un alternateur, l’alternateur produit le courant. Retenir ce schéma, c’est retenir la moitié du chapitre.

| Date | L’étape du nucléaire français |
| 1973 | Le **choc pétrolier** |
| 1974 | Lancement du **plan Messmer** |
| 1975-1990 | L’essentiel du parc est construit |
| Aujourd’hui | **65 à 70 %** de la production électrique |

## La consommation qui suit
La consommation est multipliée par plusieurs dizaines sur le siècle : équipement des ménages, chauffage électrique, industrie, puis **électronique**. Le **transistor** (1947) puis le circuit intégré ouvrent l’informatique — un secteur entièrement dépendant de l’électricité.

## Ce que le siècle laisse en héritage
| Le système hérité | Ce que le XXIe siècle y raccorde |
| Centralisé | Décentralisé |
| De gros moyens **pilotables** | Des sources **intermittentes** : éolien, solaire |
| Un sens unique, du producteur au client | Des clients qui produisent aussi |

Toute la question de la transition tient dans cet écart.`,
          },
          questions: [
            ['Quand EDF est-elle créée ?', ['En 1946', 'En 1900', 'En 1973', 'En 1990'], 0, 'Par nationalisation, ce qui unifie production, transport et distribution.'],
            ['Quel événement déclenche le programme nucléaire français ?', ['Le choc pétrolier de 1973', 'La Seconde Guerre mondiale', 'La création de l’Union européenne', 'L’accident de Tchernobyl'], 0, 'Le plan Messmer vise l’indépendance énergétique après la flambée du pétrole.'],
            ['Dans une centrale nucléaire, la fission remplace la flamme comme source de chaleur.', ['Vrai', 'Faux'], 0, 'Le reste de la chaîne — vapeur, turbine, alternateur — est identique à une centrale thermique.'],
            ['Quelle filière fournit l’essentiel de l’électricité française ?', ['Le nucléaire', 'Le charbon', 'L’éolien', 'Le gaz'], 0, 'De l’ordre de 65 à 70 % de la production, d’où une électricité peu carbonée.'],
            ['Quel composant, inventé en 1947, ouvre l’ère de l’électronique ?', ['Le transistor', 'L’alternateur', 'Le transformateur', 'La diode à vide'], 0, 'Il permettra le circuit intégré, donc l’informatique.'],
            ['Le photovoltaïque produit du courant en faisant tourner une turbine.', ['Vrai', 'Faux'], 1, 'C’est la seule grande filière sans machine tournante : la conversion y est directe.'],
            ['Quel est l’atout de l’hydroélectricité dans un réseau ?', ['Elle est mobilisable en quelques minutes', 'Elle ne coûte rien à construire', 'Elle fonctionne sans eau', 'Elle produit de façon constante'], 0, 'Cette souplesse en fait un outil d’ajustement de la production.'],
            ['Le réseau du XXe siècle a été conçu pour des sources décentralisées et intermittentes.', ['Vrai', 'Faux'], 1, 'Il a été bâti pour de grosses unités pilotables : c’est précisément la difficulté de la transition.'],
          ],
        },
        {
          titre: 'Le transport de l’électricité',
          lecon: {
            titre: 'Pourquoi la très haute tension',
            cours: `L’électricité se produit rarement là où elle se consomme. Entre les deux, un réseau — et un problème de physique : les **pertes par effet Joule**.

## L’effet Joule
Un conducteur parcouru par un courant s’échauffe. La puissance perdue vaut :

**P(perdue) = R × I²**

| Si l’intensité… | Les pertes… |
| Double | Sont **multipliées par 4** |
| Est divisée par 10 | Sont divisées par **100** |
| Est divisée par 100 | Sont divisées par **10 000** |

Le carré est décisif : c’est lui qui commande toute l’architecture du réseau.

## La parade : monter la tension
La puissance transportée vaut P = U × I. Pour transporter la **même** puissance avec **moins d’intensité**, il faut donc une **tension plus élevée**.

> C’est pourquoi les grandes lignes fonctionnent en très haute tension — **225 000 et 400 000 volts**. Les pertes sur le réseau français restent ainsi de l’ordre de **2 à 3 %** seulement.

## Le transformateur, et pourquoi le courant est alternatif
Élever puis abaisser la tension se fait avec un **transformateur** : deux bobines couplées par un noyau magnétique.

| | Courant continu | Courant alternatif |
| Le transformateur fonctionne-t-il ? | **Non** | **Oui** |
| Pourquoi | Aucun champ variable, donc aucune induction | La variation du champ induit la tension |

C’est l’origine de la « guerre des courants » entre **Edison** (continu) et **Tesla / Westinghouse** (alternatif) à la fin du XIXe siècle. L’alternatif l’emporte pour une seule raison : il se **transporte**.

## La chaîne complète
| Étape | Tension |
| Centrale | Quelques kV |
| Transformateur **élévateur** | vers 400 kV |
| Lignes THT | 400 kV |
| Réseau de distribution | 20 kV |
| Transformateur **abaisseur** de quartier | 230 V |

## L’équilibre permanent
L’électricité ne se stocke pas à grande échelle : à chaque instant, la production doit **égaler** la consommation, sinon la **fréquence** (50 Hz en Europe) dérive et le réseau décroche.

C’est le métier de **RTE**, qui pilote cet équilibre en temps réel. Les seuls stockages massifs disponibles sont les **STEP** — stations de pompage-turbinage — et, à plus petite échelle, les batteries.`,
          },
          questions: [
            ['Quelle est l’expression des pertes par effet Joule dans une ligne ?', ['P = R × I²', 'P = U × I', 'P = R / I', 'P = U × R'], 0, 'Le carré de l’intensité : doubler I quadruple les pertes.'],
            ['Pourquoi transporte-t-on l’électricité en très haute tension ?', ['Pour réduire l’intensité, donc les pertes', 'Pour augmenter la puissance transportée', 'Pour éviter les transformateurs', 'Pour produire du courant continu'], 0, 'À puissance donnée, une tension élevée signifie une intensité faible.'],
            ['Les grandes lignes du réseau français fonctionnent sous 400 000 volts.', ['Vrai', 'Faux'], 0, '400 kV et 225 kV pour le réseau de transport ; 230 V seulement en bout de chaîne.'],
            ['Pourquoi le courant du réseau est-il alternatif ?', ['Parce que le transformateur n’agit qu’en alternatif', 'Parce qu’il est plus sûr', 'Parce qu’il se stocke mieux', 'Parce qu’il perd moins d’énergie dans les moteurs'], 0, 'Sans transformateur, impossible d’élever puis d’abaisser la tension.'],
            ['Quelle fréquence le réseau européen doit-il maintenir ?', ['50 Hz', '60 Hz', '100 Hz', '400 Hz'], 0, 'Un écart durable signale un déséquilibre entre production et consommation.'],
            ['L’électricité se stocke facilement en grande quantité.', ['Vrai', 'Faux'], 1, 'C’est la contrainte majeure du réseau : production et consommation doivent s’égaler en permanence.'],
            ['Quel dispositif stocke aujourd’hui l’électricité à grande échelle ?', ['Les stations de pompage-turbinage (STEP)', 'Les batteries au lithium', 'Les condensateurs', 'Les lignes THT'], 0, 'On remonte l’eau dans un bassin quand il y a surplus, on la turbine quand il manque.'],
            ['Multiplier la tension de transport par 100 divise les pertes par 100.', ['Vrai', 'Faux'], 1, 'Par 10 000 : l’intensité est divisée par 100 et les pertes varient comme son carré.'],
          ],
        },
        {
          titre: 'Les atouts de l’électricité et ses enjeux dans le développement durable',
          lecon: {
            titre: 'Un vecteur, pas une source',
            cours: `Première chose à ne pas confondre : l’électricité n’est pas une **source** d’énergie, c’est un **vecteur**. Elle ne se trouve pas dans le sol : on la fabrique à partir d’autre chose, et on la transporte.

## Les atouts
| Atout | Ce qu’il permet |
| **Polyvalence** | Elle se convertit en chaleur, lumière, mouvement, information |
| **Transport** | Des centaines de kilomètres, pour quelques pour cent de pertes |
| **Rendement d’usage** | Un moteur électrique dépasse 90 %, un moteur thermique 30 à 40 % |
| **Aucune émission au point d’usage** | Décisif en ville, pour la qualité de l’air |

## Le point de vigilance
Une électricité n’est propre que si sa **production** l’est. On compare les filières par leur **intensité carbone**, sur tout le cycle de vie.

| Filière | Grammes de CO₂ par kWh |
| Charbon | environ **820** |
| Gaz | environ **490** |
| Solaire photovoltaïque | Quelques dizaines |
| Éolien, hydraulique, nucléaire | **5 à 15** |

> Une voiture électrique n’est vertueuse que branchée sur un **mix décarboné**. La même voiture émet très différemment selon le pays où elle se recharge — l’objet n’a pas changé, le réseau si.

## L’analyse du cycle de vie
On ne juge pas une technologie sur sa seule utilisation. L’**ACV** compte cinq phases : extraction des matériaux, fabrication, transport, usage, fin de vie. Un panneau solaire n’émet rien en fonctionnant, mais sa fabrication a un coût énergétique et matériel réel.

## Les enjeux
| Enjeu | Ce qu’il suppose |
| **Électrifier les usages** | Transport, chauffage : sortir des fossiles |
| Gérer l’**intermittence** | Stockage, pilotage de la demande, interconnexions |
| Sécuriser les **ressources critiques** | Cuivre, lithium, terres rares |
| La **sobriété** | L’énergie la moins polluante reste celle qu’on ne consomme pas |`,
          },
          questions: [
            ['L’électricité est-elle une source ou un vecteur d’énergie ?', ['Un vecteur', 'Une source', 'Une réserve naturelle', 'Un combustible'], 0, 'Elle est produite à partir d’autre chose, puis transportée jusqu’à l’usage.'],
            ['Quel est l’ordre de grandeur du rendement d’un moteur électrique ?', ['Plus de 90 %', 'Environ 30 %', 'Environ 50 %', 'Environ 70 %'], 0, 'Contre 30 à 40 % pour un moteur thermique : pour la même énergie utile, il en faut bien moins.'],
            ['Quelle filière émet le plus de CO₂ par kWh produit ?', ['Le charbon', 'Le gaz', 'Le solaire', 'L’éolien'], 0, 'Environ 820 g/kWh, contre 490 pour le gaz et quelques grammes pour l’éolien.'],
            ['Une voiture électrique est aussi vertueuse quel que soit le pays où elle se recharge.', ['Vrai', 'Faux'], 1, 'Son bilan dépend entièrement de l’intensité carbone du mix électrique local.'],
            ['Que compte une analyse du cycle de vie (ACV) ?', ['L’extraction, la fabrication, l’usage et la fin de vie', 'Seulement les émissions à l’usage', 'Seulement le coût financier', 'Seulement la durée de vie du matériel'], 0, 'C’est ce qui empêche de juger une technologie sur son seul fonctionnement.'],
            ['L’électricité n’émet aucun polluant au point d’usage.', ['Vrai', 'Faux'], 0, 'Atout majeur pour la qualité de l’air urbain — les émissions sont reportées sur la production.'],
            ['Quel est le principal frein au développement de l’éolien et du solaire ?', ['Leur intermittence', 'Leur coût de production du kWh', 'Leurs émissions de CO₂', 'Leur rendement de conversion'], 0, 'Il faut du stockage, du pilotage de la demande et des interconnexions pour l’absorber.'],
            ['La sobriété consiste à améliorer le rendement des appareils.', ['Vrai', 'Faux'], 1, 'Cela, c’est l’efficacité. La sobriété consiste à réduire l’usage lui-même.'],
          ],
        },

        // ===== Chapitre 3 — Choix de développement et futur climatique =====
        {
          titre: 'La nécessité d’une transition énergétique pour agir sur le futur climatique',
          lecon: {
            titre: 'Budget carbone et neutralité',
            cours: `Agir sur le climat futur ne se joue pas sur les gestes symboliques mais sur une **comptabilité** : celle des gaz à effet de serre que nous émettons encore.

## D’où viennent les émissions
La consommation mondiale d’énergie repose encore à environ **80 %** sur les **combustibles fossiles** — charbon, pétrole, gaz.

> Brûler un carbone fossile, c’est réinjecter dans l’atmosphère un carbone stocké depuis des **millions d’années**. Le cycle du carbone, qui était à l’équilibre, ne l’est plus : c’est toute la différence avec le carbone d’un arbre, qui revient d’où il vient.

Les émissions se répartissent entre production d’énergie, industrie, transports, bâtiments et agriculture.

## Le budget carbone
La hausse de température est à peu près **proportionnelle au CO₂ cumulé** émis depuis l’ère industrielle. On peut donc calculer un **budget carbone** : la quantité totale qu’il reste à émettre pour ne pas dépasser un seuil.

| Seuil visé | Le budget restant | À quoi il correspond |
| +1,5 °C | Quelques centaines de milliards de tonnes | Une poignée d’années au rythme actuel |

> Conséquence directe : ce n’est pas le **niveau** des émissions annuelles qui fixe le réchauffement, c’est leur **somme**. Retarder la baisse ne repousse pas le problème — cela consomme le budget.

## Neutralité carbone
Être **neutre en carbone** ne veut pas dire n’émettre plus rien : cela veut dire que les émissions résiduelles sont **compensées par des puits** — forêts, sols, océans, captage.

| Engagement | Le contenu |
| **Accord de Paris** (2015) | Contenir le réchauffement bien en dessous de 2 °C, poursuivre vers 1,5 °C |
| Union européenne | Neutralité carbone en **2050** |

## Les quatre leviers
1. **Sobriété** : consommer moins d’énergie.
2. **Efficacité** : consommer mieux à service rendu égal — isolation, rendement.
3. **Décarbonation de l’énergie** : remplacer les fossiles par de l’électricité bas carbone et des renouvelables.
4. **Puits de carbone** : préserver forêts et sols, développer le captage.

Aucun ne suffit seul : c’est leur **combinaison**, et leur **vitesse**, qui décident de la trajectoire.`,
          },
          questions: [
            ['Quelle part de l’énergie mondiale provient encore des combustibles fossiles ?', ['Environ 80 %', 'Environ 30 %', 'Environ 50 %', 'Environ 95 %'], 0, 'Charbon, pétrole et gaz dominent encore largement le mix énergétique mondial.'],
            ['À quoi la hausse de température est-elle à peu près proportionnelle ?', ['Au CO₂ cumulé émis', 'Aux émissions de l’année en cours', 'À la population mondiale', 'À la surface des forêts'], 0, 'C’est ce qui permet de définir un budget carbone.'],
            ['La neutralité carbone signifie n’émettre plus aucun gaz à effet de serre.', ['Vrai', 'Faux'], 1, 'Elle signifie que les émissions résiduelles sont compensées par des puits de carbone.'],
            ['Que fixe l’Accord de Paris de 2015 ?', ['Contenir le réchauffement bien en dessous de 2 °C', 'Interdire le charbon en 2030', 'Créer une taxe carbone mondiale', 'Fermer les centrales nucléaires'], 0, 'Avec l’objectif de poursuivre les efforts pour ne pas dépasser 1,5 °C.'],
            ['Quel levier consiste à réduire l’usage lui-même ?', ['La sobriété', 'L’efficacité', 'La décarbonation', 'La compensation'], 0, 'L’efficacité, elle, rend le même service en consommant moins.'],
            ['Retarder la baisse des émissions ne change rien puisque le total finira par baisser.', ['Vrai', 'Faux'], 1, 'C’est le cumul qui compte : chaque année de retard consomme le budget carbone restant.'],
            ['Qu’est-ce qu’un puits de carbone ?', ['Un milieu qui absorbe plus de carbone qu’il n’en émet', 'Un gisement de pétrole', 'Un site de stockage de déchets', 'Une centrale à charbon équipée de filtres'], 0, 'Forêts, sols et océans en sont les principaux.'],
            ['Brûler un combustible fossile réinjecte dans l’atmosphère un carbone stocké depuis des millions d’années.', ['Vrai', 'Faux'], 0, 'C’est exactement ce qui déséquilibre le cycle du carbone.'],
          ],
        },
        {
          titre: 'Le choix énergétique : une décision stratégique à fort impact sur les sociétés',
          lecon: {
            titre: 'Arbitrer avec des chiffres, pas avec des impressions',
            cours: `Choisir un mix énergétique n’est pas un débat d’opinion : c’est un arbitrage entre des critères **mesurables** — qui ne pointent pas tous dans la même direction.

## Les critères d’un choix
| Critère | Ce qu’il mesure |
| Émissions de CO₂ par kWh | Sur tout le cycle de vie |
| Coût du kWh | Investissement compris : le « coût complet » |
| Disponibilité | Pilotable, ou intermittente |
| Emprise au sol | Et acceptabilité locale |
| Risques | Accident, déchets |
| Dépendance aux importations | Combustible, mais aussi métaux et composants |
| Emplois | Filières industrielles associées |

> **Aucune filière n’est la meilleure sur tous les critères à la fois.** C’est pourquoi ces choix se tranchent politiquement — mais doivent s’argumenter avec des données.

## L’inertie, souvent sous-estimée
| Objet | Durée de construction | Durée de vie |
| Une centrale | 5 à 15 ans | 40 à 60 ans |
| Un parc de logements | — | Renouvelé à environ **1 % par an** |

Une décision énergétique **engage plusieurs décennies**. C’est ce qui rend le retard si coûteux — et les revirements si difficiles.

## Le rôle des sociétés
Le mix d’un pays reflète son histoire et sa géographie autant que la physique.

| Pays | Son mix | Sa raison |
| **France** | Nucléaire | L’indépendance énergétique, après 1973 |
| **Norvège** | Hydraulique | Le relief et les précipitations |
| **Allemagne** | Sortie du nucléaire, longtemps compensée au charbon | Un choix politique assumé |
| Pays du Golfe | Hydrocarbures | La ressource du sous-sol |

## Ce qu’on attend de toi au bac
Non pas une opinion, mais un **raisonnement sur documents** :

1. Lire un graphique d’émissions ou de coûts.
2. Comparer deux filières sur un critère **explicite**.
3. Distinguer un **fait mesuré** d’un **jugement de valeur**.
4. Énoncer les **limites** des données utilisées : périmètre, année, source.`,
          },
          questions: [
            ['Que signifie qu’une filière est « pilotable » ?', ['Sa production peut être ajustée à la demande', 'Elle ne produit aucun déchet', 'Elle fonctionne sans combustible', 'Son coût est fixe'], 0, 'L’hydraulique et le gaz le sont ; l’éolien et le solaire ne le sont pas.'],
            ['Une filière peut être la meilleure sur tous les critères à la fois.', ['Vrai', 'Faux'], 1, 'Émissions, coût, disponibilité, risques et emprise se contredisent : le choix est un arbitrage.'],
            ['Combien de temps fonctionne typiquement une grande centrale électrique ?', ['40 à 60 ans', '5 à 10 ans', '15 à 20 ans', 'Plus de 100 ans'], 0, 'Cette inertie engage un pays pour plusieurs décennies.'],
            ['Pourquoi la France a-t-elle massivement investi le nucléaire ?', ['Pour son indépendance énergétique après 1973', 'Parce qu’elle manquait de charbon depuis 1900', 'Pour respecter l’Accord de Paris', 'Pour exporter de l’uranium'], 0, 'Le choc pétrolier a fait de la dépendance au pétrole un risque stratégique.'],
            ['Que compare-t-on avec les grammes de CO₂ par kWh ?', ['L’intensité carbone des filières de production', 'Le coût du kWh', 'Le rendement des turbines', 'La durée de vie des centrales'], 0, 'Ce critère doit s’entendre sur tout le cycle de vie, pas seulement à l’usage.'],
            ['Au bac, on attend une opinion personnelle sur le nucléaire.', ['Vrai', 'Faux'], 1, 'On attend un raisonnement sur documents : lire les données, comparer, distinguer fait et jugement.'],
            ['Qu’est-ce que le coût complet d’un kWh ?', ['Un coût incluant l’investissement initial, pas seulement le fonctionnement', 'Le prix payé par le consommateur final', 'Le coût du combustible seul', 'Le coût du transport sur le réseau'], 0, 'Sans lui, on compare des filières dont les charges sont réparties très différemment dans le temps.'],
            ['La dépendance aux importations ne concerne que les combustibles.', ['Vrai', 'Faux'], 1, 'Elle porte aussi sur les métaux et composants nécessaires aux éoliennes, panneaux et batteries.'],
          ],
        },

        // ===== Chapitre 4 — Biodiversité et dynamique des populations ======
        {
          titre: 'Origine et évolution de la biodiversité',
          lecon: {
            titre: 'Trois niveaux, cinq crises, et une sixième',
            cours: `La biodiversité n’est pas un catalogue d’espèces : c’est un **état instantané** d’un processus qui n’a jamais cessé de la produire et de la détruire.

## Trois niveaux
| Niveau | Ce qu’il désigne | Pourquoi il compte |
| **Génétique** | La diversité des allèles dans une espèce | Une espèce uniforme est fragile face à une maladie |
| **Spécifique** | La diversité des espèces d’un milieu | C’est le niveau le plus souvent cité |
| **Écosystémique** | La diversité des milieux eux-mêmes | Un milieu détruit emporte tout ce qu’il abrite |

## Ce qu’on en connaît
| Espèces | Nombre |
| Décrites | environ **2 millions** |
| Estimées | **8 à 10 millions**, hors micro-organismes |

Une part majeure de la biodiversité n’a donc **jamais été inventoriée**.

## Estimer sans tout compter
On ne dénombre pas une population entière : on **échantillonne**. La méthode de **capture-marquage-recapture** en est l’exemple type.

**N = (n₁ × n₂) / m**

| Symbole | Ce qu’il désigne |
| n₁ | Individus capturés et marqués la première fois |
| n₂ | Individus capturés la seconde fois |
| m | Parmi eux, ceux qui portent une marque |

| L’hypothèse | Si elle est fausse |
| Les individus se sont remélangés | L’estimation est biaisée |
| Aucune naissance ni mort entre les deux captures | Le nombre a changé entre-temps |
| Le marquage ne change pas les chances d’être repris | Les marqués sont sur- ou sous-représentés |

Toute estimation est donc assortie d’une **incertitude** : c’est ce que le bac demande de dire.

## Les crises biologiques
| Crise | Date | Ce qu’elle emporte |
| **Permien-Trias** | environ −252 Ma | La plus grave : plus de 90 % des espèces marines |
| **Crétacé-Paléogène** | environ −66 Ma | Les dinosaures non aviens ; astéroïde et volcanisme |

Après chaque crise, les groupes survivants se **diversifient** dans les niches libérées : les mammifères doivent leur essor à la cinquième.

## La sixième
Le rythme actuel d’extinction est estimé **100 à 1 000 fois** supérieur au rythme naturel. Ses causes sont **anthropiques** : destruction des habitats, surexploitation, espèces invasives, pollutions, changement climatique.`,
          },
          questions: [
            ['Quels sont les trois niveaux de la biodiversité ?', ['Génétique, spécifique, écosystémique', 'Animale, végétale, microbienne', 'Terrestre, marine, aérienne', 'Locale, nationale, mondiale'], 0, 'La diversité génétique interne aux espèces compte autant que le nombre d’espèces.'],
            ['Combien d’espèces sont décrites aujourd’hui ?', ['Environ 2 millions', 'Environ 100 000', 'Environ 20 millions', 'Environ 500 000'], 0, 'Sur un total estimé entre 8 et 10 millions : l’essentiel reste à décrire.'],
            ['Quelle formule estime un effectif par capture-marquage-recapture ?', ['N = (n₁ × n₂) / m', 'N = n₁ + n₂ − m', 'N = m / (n₁ × n₂)', 'N = (n₁ + n₂) × m'], 0, 'Avec m le nombre d’individus marqués retrouvés lors de la seconde capture.'],
            ['Cette méthode d’estimation suppose que les individus se sont remélangés entre les deux captures.', ['Vrai', 'Faux'], 0, 'Sans remélange, l’estimation est biaisée : c’est une des limites du modèle.'],
            ['Quelle crise biologique est la plus grave de l’histoire de la vie ?', ['La crise Permien-Trias', 'La crise Crétacé-Paléogène', 'La crise Ordovicien-Silurien', 'La crise actuelle'], 0, 'Il y a environ 252 Ma : plus de 90 % des espèces marines disparaissent.'],
            ['Après une crise biologique, les groupes survivants se diversifient.', ['Vrai', 'Faux'], 0, 'Ils occupent les niches libérées : les mammifères doivent leur essor à la crise de −66 Ma.'],
            ['De combien le rythme actuel d’extinction dépasse-t-il le rythme naturel ?', ['De 100 à 1 000 fois', 'De 2 à 3 fois', 'De 10 000 fois', 'Il ne le dépasse pas'], 0, 'Un rythme qui justifie de parler d’une sixième crise, d’origine humaine.'],
            ['Une espèce nombreuse est toujours à l’abri de l’extinction.', ['Vrai', 'Faux'], 1, 'Une population génétiquement uniforme peut être décimée par un seul agent pathogène.'],
          ],
        },
        {
          titre: 'Modèles démographiques : comprendre l’évolution quantitative des populations',
          lecon: {
            titre: 'Trois modèles, et leurs limites',
            cours: `Une population n’évolue pas au hasard : quelques modèles simples suffisent à décrire — et à prévoir un temps — son effectif.

## Les trois modèles
| Modèle | Ce qui est constant | Formule | Allure du graphique |
| **Linéaire** | Un **nombre** d’individus ajouté | N(t) = N₀ + a × t | Une droite |
| **Exponentiel** | Un **pourcentage** | N(t) = N₀ × (1 + r)^t | Elle s’envole |
| **Logistique** | Rien : le milieu limite | Vers un plateau K | Une courbe en **S** |

Le **taux de variation** dépend des naissances, des morts et des migrations. On note **r** le taux d’accroissement — r = 0,02 pour +2 % par an.

## Le temps de doublement
Avec une croissance exponentielle, le temps de doublement est **constant**.

| Taux annuel | Temps de doublement |
| 1 % | environ 70 ans |
| 2 % | environ **35 ans** |
| 3,5 % | environ 20 ans |

Règle des 70 : doublement ≈ 70 divisé par le taux en pourcentage.

## Le modèle logistique
Aucun milieu n’est infini. Le modèle introduit une **capacité biotique K** — l’effectif maximal que le milieu peut soutenir.

> Le passage du modèle exponentiel au modèle logistique, c’est le moment où les **ressources** deviennent limitantes : nourriture, espace, prédation, maladies.

## La démographie humaine
| Repère | Valeur |
| Population mondiale | **8 milliards** franchis en 2022 |
| Au XXe siècle | Multipliée par 4 |
| Le taux d’accroissement | **Diminue** depuis les années 1970 |
| Projection de plafond | environ **10 milliards** au XXIe siècle |

La **transition démographique** explique la poussée : la mortalité baisse d’abord, la natalité ensuite, et c’est l’**écart** entre les deux qui fait la croissance.

## Ce qu’un modèle ne fait pas
> Il ne **prédit** pas : il **prolonge une hypothèse**. Changez le taux, la courbe change. Un modèle se juge à sa capacité à reproduire les données passées, et s’utilise en énonçant ses limites.`,
          },
          questions: [
            ['Dans un modèle exponentiel, qu’est-ce qui est constant ?', ['Le pourcentage d’augmentation', 'Le nombre d’individus ajoutés', 'L’effectif total', 'La capacité du milieu'], 0, 'D’où un temps de doublement constant, et une courbe qui s’envole.'],
            ['Que représente la capacité biotique K du modèle logistique ?', ['L’effectif maximal que le milieu peut soutenir', 'Le taux de natalité', 'La durée de vie moyenne', 'Le nombre de naissances annuelles'], 0, 'C’est elle qui donne à la courbe sa forme en S.'],
            ['Avec un taux de croissance de 2 % par an, une population double en environ 35 ans.', ['Vrai', 'Faux'], 0, 'Règle des 70 : temps de doublement ≈ 70 divisé par le taux exprimé en pourcentage.'],
            ['Quelle forme a la courbe du modèle logistique ?', ['Une courbe en S', 'Une droite', 'Une exponentielle', 'Une courbe en cloche'], 0, 'Croissance rapide, puis ralentissement à l’approche de K, puis plateau.'],
            ['Quand la population mondiale a-t-elle franchi les 8 milliards ?', ['En 2022', 'En 2000', 'En 2010', 'En 1990'], 0, 'Elle a été multipliée par quatre au cours du XXe siècle.'],
            ['Le taux d’accroissement de la population mondiale augmente depuis 1970.', ['Vrai', 'Faux'], 1, 'Il diminue : la transition démographique ramène la natalité vers la mortalité.'],
            ['Qu’est-ce qui fait la poussée démographique lors d’une transition démographique ?', ['La mortalité baisse avant la natalité', 'La natalité augmente brutalement', 'Les migrations s’intensifient', 'L’espérance de vie stagne'], 0, 'L’écart entre les deux courbes, pendant qu’il dure, fait croître la population.'],
            ['Un modèle démographique prédit l’avenir avec certitude.', ['Vrai', 'Faux'], 1, 'Il prolonge une hypothèse : changez le taux retenu, la trajectoire change.'],
          ],
        },

        // ===== Chapitre 5 — Théorie de l'évolution ==========================
        {
          titre: 'L’évolution comme grille de lecture du monde',
          lecon: {
            titre: 'Sélection naturelle et dérive génétique',
            cours: `La théorie de l’évolution n’est pas une hypothèse sur le passé lointain : c’est un **outil de lecture du présent**, qui explique la résistance aux antibiotiques comme la forme du bec d’un pinson.

## Le mécanisme darwinien
Publié en **1859** par Darwin, il tient en trois conditions — toutes **observables**.

| Condition | Ce qu’elle exige |
| 1. Variation | Les individus d’une population diffèrent |
| 2. Hérédité | Une partie de cette variation se transmet |
| 3. Succès reproducteur inégal | Tous n’ont pas la même descendance dans ce milieu |

Alors, **mécaniquement**, les caractères favorables deviennent plus fréquents à la génération suivante. C’est la **sélection naturelle** : elle n’agit pas sur l’individu — qui ne change pas — mais sur la **fréquence des allèles dans la population**.

> Le piège de formulation à éviter absolument : une bactérie ne « devient » pas résistante **pour** survivre. Certaines l’étaient déjà par **mutation aléatoire** ; l’antibiotique élimine les autres, et les résistantes se multiplient. La mutation précède la pression, elle ne lui répond pas.

## La dérive génétique
| | Sélection naturelle | Dérive génétique |
| Le moteur | L’avantage reproductif | Le **hasard** de l’échantillonnage |
| Ce qui l’amplifie | Une pression forte | Une **petite** population |
| Le résultat | Les allèles utiles se répandent | Un allèle peut disparaître **sans désavantage** |

## Ce que l’évolution n’est pas
| L’idée fausse | La correction |
| Un **progrès** | Elle n’a ni but ni direction : elle ajuste à un milieu qui change |
| Une **hiérarchie** | Une bactérie actuelle a exactement autant d’évolution derrière elle qu’un mammifère |
| Une recherche de la perfection | Elle bricole avec l’existant, sans repartir de zéro |

## Applications concrètes
| Cas | Ce que l’évolution explique |
| **Antibiorésistance** | Chaque usage inutile sélectionne des souches résistantes |
| Insecticides et herbicides | Même mécanisme sur les insectes et les adventices |
| **Sélection artificielle** | L’humain remplace le milieu comme facteur de tri : races de chiens, variétés de blé |
| Virus de la **grippe** | Il mute vite, d’où un vaccin reformulé chaque année |`,
          },
          questions: [
            ['Sur quoi agit la sélection naturelle ?', ['Sur la fréquence des allèles dans une population', 'Sur les caractères acquis d’un individu', 'Sur la volonté des organismes', 'Sur les mutations, qu’elle provoque'], 0, 'L’individu ne change pas : c’est la composition de la population qui se déplace.'],
            ['En quelle année Darwin publie-t-il sa théorie ?', ['1859', '1809', '1900', '1953'], 0, '« L’Origine des espèces » y expose la sélection naturelle.'],
            ['Une bactérie devient résistante parce qu’elle est exposée à l’antibiotique.', ['Vrai', 'Faux'], 1, 'Certaines l’étaient déjà par mutation aléatoire ; l’antibiotique ne fait que trier.'],
            ['Qu’est-ce que la dérive génétique ?', ['Une évolution due au hasard de l’échantillonnage des allèles', 'Une sélection des individus les plus forts', 'Une mutation dirigée par le milieu', 'Un transfert de gènes entre espèces'], 0, 'Elle est d’autant plus forte que la population est petite.'],
            ['Quelles sont les trois conditions de la sélection naturelle ?', ['Variation, hérédité, différence de succès reproducteur', 'Mutation, migration, isolement', 'Adaptation, croissance, reproduction', 'Compétition, coopération, prédation'], 0, 'Réunies, elles suffisent : le tri devient mécanique.'],
            ['L’évolution est un progrès orienté vers des formes de plus en plus perfectionnées.', ['Vrai', 'Faux'], 1, 'Elle n’a ni but ni direction : elle ajuste à un milieu qui change lui-même.'],
            ['Pourquoi le vaccin contre la grippe est-il reformulé chaque année ?', ['Parce que le virus mute rapidement', 'Parce que le vaccin se périme', 'Parce que l’immunité disparaît en un an', 'Parce que la souche est détruite'], 0, 'Les souches dominantes changent : l’évolution se joue à l’échelle d’une saison.'],
            ['La sélection artificielle repose sur un mécanisme différent de la sélection naturelle.', ['Vrai', 'Faux'], 1, 'C’est le même tri : seul change le facteur qui trie, l’humain au lieu du milieu.'],
          ],
        },
        {
          titre: 'Histoire évolutive de la lignée humaine',
          lecon: {
            titre: 'Un buisson, pas une échelle',
            cours: `L’image de la « marche du progrès » — un singe courbé qui se redresse jusqu’à l’homme moderne — est **fausse**. La lignée humaine est un **buisson** : des branches qui coexistent, et dont une seule subsiste.

## Notre place dans le vivant
| Fait | Valeur |
| Différence entre nos génomes et celui du chimpanzé | environ **1 %** |
| Dernier ancêtre commun avec les chimpanzés | il y a **7 à 10 millions d’années** |

> Nous ne descendons **pas** du chimpanzé : nous en sommes des **cousins**. Le chimpanzé a autant évolué que nous depuis l’ancêtre commun.

## Les caractères dérivés du genre Homo
| Caractère | Ce qui l’atteste sur un fossile |
| **Bipédie permanente** | Trou occipital avancé, bassin court et large, courbures de la colonne, voûte plantaire |
| **Volume crânien** croissant | environ 400 cm³ chez les australopithèques, **1 350 cm³** chez *Homo sapiens* |
| **Face réduite** | Mâchoire moins puissante, front plus vertical |
| Outils, feu, art, langage | Des traces **indirectes** : les fossiles n’en gardent pas la preuve directe |

## Quelques repères fossiles
| Fossile ou espèce | Âge | Ce qu’il apporte |
| **Toumaï** (*Sahelanthropus*) | environ 7 Ma, Tchad | Près de la séparation des lignées |
| **Lucy** (*Australopithecus afarensis*) | environ 3,2 Ma, Éthiopie | Bipède, mais encore bonne grimpeuse |
| *Homo habilis* | environ 2,4 Ma | Les premiers outils taillés |
| *Homo erectus* | environ 1,9 Ma | Le premier à sortir d’Afrique |
| *Homo neanderthalensis* | Éteint il y a environ 40 000 ans | En Europe |
| *Homo sapiens* | environ 300 000 ans (Jebel Irhoud, Maroc) | Nous |

## Ce que dit la génétique
L’ADN ancien a tranché plusieurs débats.

| Question | La réponse génétique |
| L’origine de *Homo sapiens* | **Africaine**, avec essaimage ultérieur |
| A-t-il coexisté avec d’autres Homo ? | Oui : Néandertal, Denisova |
| S’est-il croisé avec eux ? | Oui : **1 à 3 %** d’ADN néandertalien chez les non-Africains actuels |

> Plusieurs espèces d’*Homo* ont vécu **en même temps**. Être seuls sur la planète est une situation récente et exceptionnelle — pas l’aboutissement d’une marche.`,
          },
          questions: [
            ['De quel pourcentage nos génomes diffèrent-ils de celui du chimpanzé ?', ['Environ 1 %', 'Environ 10 %', 'Environ 25 %', 'Environ 0,01 %'], 0, 'Notre dernier ancêtre commun vivait il y a 7 à 10 millions d’années.'],
            ['L’humain descend du chimpanzé.', ['Vrai', 'Faux'], 1, 'Ce sont deux branches cousines issues d’un ancêtre commun, aujourd’hui disparu.'],
            ['Quel fossile, daté d’environ 3,2 millions d’années, appartient à Australopithecus afarensis ?', ['Lucy', 'Toumaï', 'Cro-Magnon', 'L’homme de Néandertal'], 0, 'Bipède, mais dotée de caractères encore adaptés au grimper.'],
            ['Quel indice osseux atteste la bipédie permanente ?', ['La position avancée du trou occipital', 'La longueur des bras', 'La taille des dents', 'L’épaisseur du crâne'], 0, 'Le crâne est posé en équilibre sur la colonne, signe d’une station verticale.'],
            ['Où ont été trouvés les plus anciens fossiles connus d’Homo sapiens ?', ['À Jebel Irhoud, au Maroc', 'En Éthiopie', 'En France', 'En Indonésie'], 0, 'Datés d’environ 300 000 ans, ils confirment l’origine africaine de notre espèce.'],
            ['Homo sapiens et Homo neanderthalensis ont coexisté puis se sont croisés.', ['Vrai', 'Faux'], 0, 'Les populations non africaines actuelles portent environ 1 à 3 % d’ADN néandertalien.'],
            ['Quel volume crânien moyen a Homo sapiens ?', ['Environ 1 350 cm³', 'Environ 400 cm³', 'Environ 800 cm³', 'Environ 2 000 cm³'], 0, 'Contre environ 400 cm³ chez les australopithèques.'],
            ['L’évolution humaine est une ligne droite d’espèces qui se succèdent.', ['Vrai', 'Faux'], 1, 'C’est un buisson : plusieurs espèces d’Homo ont vécu en même temps.'],
          ],
        },

        // ===== Chapitre 6 — Nouvelles technologies et vivant ================
        {
          titre: 'Automatisation du traitement de l’information : une évolution des capacités humaines',
          lecon: {
            titre: 'De la Pascaline au circuit intégré',
            cours: `Automatiser le traitement de l’information, c’est confier à une machine une opération qu’un humain faisait de tête : compter, trier, comparer. L’histoire de cette délégation est ancienne — et elle s’accélère.

## La chronologie
| Date | L’étape | Ce qu’elle apporte |
| **1642** | La **Pascaline** de Pascal | Une machine à additionner, à roues dentées |
| XIXe siècle | La **machine analytique** de Babbage | Programmable — jamais achevée |
| XIXe siècle | **Ada Lovelace** | Le premier algorithme pour machine, et l’idée qu’elle traiterait autre chose que des nombres |
| **1936** | La **machine de Turing** | Ce qui est calculable, et ce qui ne l’est pas |
| **1947** | Le **transistor** | Plus petit, plus fiable, moins gourmand que le tube |
| **1965** | La **loi de Moore** | Le nombre de transistors double environ tous les deux ans |

## Le fondement théorique
Turing définit un modèle abstrait de machine qui **délimite ce qui est calculable**. Résultat décisif : certains problèmes ne sont **pas** calculables, quelle que soit la puissance de la machine.

> L’automatisation a donc des limites **théoriques**, et pas seulement techniques. Aucun progrès matériel ne les repoussera.

## Algorithme et programme
| Terme | Ce qu’il désigne |
| **Algorithme** | Une suite finie d’instructions non ambiguës résolvant un problème |
| **Programme** | Sa traduction dans un langage exécutable |

Le traitement automatisé suppose des **données codées en binaire**, et il traite d’autant mieux qu’elles sont nombreuses et bien structurées.

## Ce que cela change pour nous
| La machine… | Exemples |
| **Augmente** certaines capacités | Mémoire, vitesse de calcul, accès à l’information |
| **Délègue** d’autres | Orientation, calcul mental, mémorisation |

Ce transfert n’est pas neutre : il pose la question de ce que nous conservons la capacité de faire **nous-mêmes**, et de notre dépendance à des systèmes qu’aucun individu ne contrôle.`,
          },
          questions: [
            ['Qui écrit le premier algorithme destiné à une machine ?', ['Ada Lovelace', 'Blaise Pascal', 'Alan Turing', 'Charles Babbage'], 0, 'Pour la machine analytique de Babbage, jamais achevée.'],
            ['Qu’établit Turing en 1936 avec sa machine abstraite ?', ['Que certains problèmes ne sont pas calculables', 'Que tout problème peut être résolu par une machine', 'Que le transistor remplacera le tube', 'Que les données doivent être binaires'], 0, 'L’automatisation a donc des limites théoriques, pas seulement techniques.'],
            ['Qu’observe la loi de Moore ?', ['Le doublement du nombre de transistors par puce environ tous les deux ans', 'La baisse du prix de l’électricité', 'L’augmentation de la vitesse d’Internet', 'La croissance du nombre d’utilisateurs'], 0, 'C’est une observation empirique, pas une loi physique.'],
            ['Quel composant remplace le tube à vide à partir de 1947 ?', ['Le transistor', 'Le circuit intégré', 'Le microprocesseur', 'Le condensateur'], 0, 'Plus petit, plus fiable et moins gourmand en énergie.'],
            ['Un algorithme et un programme sont la même chose.', ['Vrai', 'Faux'], 1, 'L’algorithme est la méthode ; le programme en est la traduction dans un langage exécutable.'],
            ['Qu’est-ce qu’un algorithme ?', ['Une suite finie d’instructions non ambiguës', 'Un langage de programmation', 'Un composant électronique', 'Un ensemble de données'], 0, 'Il doit se terminer et ne laisser aucune instruction à l’interprétation.'],
            ['La Pascaline, construite en 1642, sait effectuer des additions.', ['Vrai', 'Faux'], 0, 'C’est l’un des premiers dispositifs mécanisant une opération intellectuelle.'],
            ['Quel effet l’automatisation a-t-elle sur les capacités humaines ?', ['Elle en augmente certaines et en délègue d’autres', 'Elle les augmente toutes', 'Elle ne change rien', 'Elle les remplace intégralement'], 0, 'Le transfert n’est pas neutre : il pose la question de ce qu’on garde la capacité de faire soi-même.'],
          ],
        },
        {
          titre: 'L’intelligence artificielle : enjeux et débats',
          lecon: {
            titre: 'Ce qu’apprend une machine — et ce que ça coûte',
            cours: `L’intelligence artificielle désigne un ensemble de techniques permettant à une machine d’accomplir des tâches qui, faites par un humain, demanderaient de l’intelligence. Le mot est ancien — **1956** ; ce qui est récent, c’est **ce qui la fait fonctionner**.

## Apprendre au lieu d’être programmé
| | Programme classique | Apprentissage automatique |
| Ce qu’on fournit | Des **règles** écrites par un humain | Un grand nombre d’**exemples** |
| Ce que la machine produit | Le résultat de ces règles | Des **paramètres ajustés** qui reproduisent la relation observée |
| Ce qu’on peut expliquer | Chaque décision | Difficilement : le modèle est une boîte noire |

Les **réseaux de neurones artificiels** — vaguement inspirés des neurones biologiques, sans en être un modèle — sont aujourd’hui l’architecture dominante.

Trois ingrédients l’ont rendue possible : des **données massives**, une **puissance de calcul** considérable, et des **algorithmes d’optimisation** efficaces.

> Un système d’IA ne « comprend » pas : il **généralise à partir des données** qu’on lui a montrées. D’où sa force, et **toutes** ses faiblesses.

## Les débats, sans caricature
| Enjeu | Ce qui est en cause |
| **Biais** | Un système entraîné sur des données biaisées reproduit et amplifie ces biais — le biais vient des **données**, pas d’une intention |
| **Explicabilité** | Difficile d’exiger la justification d’une décision médicale ou judiciaire |
| **Responsabilité** | Qui répond d’un accident de véhicule autonome ? |
| **Emploi** | Des tâches disparaissent, d’autres apparaissent : le débat porte sur le **rythme** et sur qui en paie le coût |
| **Vie privée** | L’IA a faim de données personnelles |
| **Coût énergétique** | Électricité, eau de refroidissement, métaux — l’enjeu rejoint celui du climat |

## Ce que le programme attend
| À distinguer | Ce que c’est |
| Le **fait technique** | Comment ça marche, ce que ça peut et ne peut pas |
| Le **choix de société** | Ce qu’on autorise, et sous quel contrôle |

Une position argumentée s’appuie sur des données. Une crainte ou un enthousiasme, non.`,
          },
          questions: [
            ['Qu’est-ce qui distingue l’apprentissage automatique d’un programme classique ?', ['Le système ajuste ses paramètres à partir d’exemples', 'Il fonctionne sans électricité', 'Il applique des règles écrites par un humain', 'Il n’a pas besoin de données'], 0, 'Au lieu de recevoir les règles, il les infère des données montrées.'],
            ['D’où viennent les biais d’un système d’IA ?', ['Des données d’entraînement', 'D’une intention de la machine', 'Du langage de programmation', 'De la puissance de calcul'], 0, 'Le système reproduit et amplifie ce que ses données contiennent déjà.'],
            ['Un système d’intelligence artificielle comprend le sens de ce qu’il traite.', ['Vrai', 'Faux'], 1, 'Il généralise à partir des exemples vus : c’est sa force et l’origine de ses erreurs.'],
            ['Quels trois ingrédients ont permis l’essor récent de l’IA ?', ['Données massives, puissance de calcul, algorithmes d’optimisation', 'Internet, satellites, fibre optique', 'Robotique, capteurs, batteries', 'Cloud, blockchain, 5G'], 0, 'Aucun des trois n’aurait suffi seul.'],
            ['Que désigne le problème de l’explicabilité ?', ['La difficulté à justifier la décision d’un modèle', 'La lenteur des calculs', 'Le coût des serveurs', 'Le manque de données disponibles'], 0, 'Problème sérieux dès que la décision engage une personne : santé, justice, crédit.'],
            ['L’entraînement des grands modèles a un coût énergétique significatif.', ['Vrai', 'Faux'], 0, 'Électricité, eau de refroidissement et métaux : l’enjeu rejoint celui du climat.'],
            ['Sur quoi porte le débat sur la responsabilité en cas d’accident de véhicule autonome ?', ['Sur qui répond du dommage : constructeur, programmeur ou propriétaire', 'Sur la vitesse maximale autorisée', 'Sur le prix des véhicules', 'Sur le nombre de capteurs'], 0, 'Le droit doit désigner un responsable là où la décision a été déléguée à un système.'],
            ['Une position argumentée sur l’IA doit s’appuyer sur des données, pas sur une crainte.', ['Vrai', 'Faux'], 0, 'Le programme attend qu’on distingue le fait technique du choix de société.'],
          ],
        },
      ],
    },
  ],
}
