// Enseignement scientifique — Terminale (tronc commun, séries générales).
//
// Découpage : les 16 fiches du programme officiel, regroupées par le programme
// en 6 chapitres (Science climat et société · Le futur des énergies × 2 ·
// Une histoire du vivant × 3). La page matière affiche une liste plate : c'est
// l'ORDRE qui porte le regroupement d'origine, comme pour histoire-geo-tle.
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
            cours: `L'air que tu respires n'a rien d'un décor posé une fois pour toutes : sa composition actuelle est le PRODUIT de la vie, pas sa condition de départ.

## L'atmosphère primitive
Il y a environ **4,5 milliards d'années**, l'atmosphère issue du dégazage volcanique contient surtout de la **vapeur d'eau**, du **dioxyde de carbone** et du **diazote** — et **pas de dioxygène**. En se refroidissant, la vapeur d'eau se condense : les **océans** se forment il y a environ 4,4 à 4 milliards d'années. Une grande partie du CO₂ s'y dissout puis se fixe dans les roches carbonatées, ce qui fait chuter sa teneur.

## L'irruption du dioxygène
La vie apparaît dans l'eau il y a au moins **3,8 milliards d'années**. Des micro-organismes photosynthétiques, les **cyanobactéries**, produisent du dioxygène. Il est d'abord consommé par l'oxydation du fer dissous dans l'océan — d'où les **fers rubanés** — puis s'accumule dans l'atmosphère à partir d'environ **2,4 milliards d'années** : c'est la **Grande Oxydation**.

> La composition actuelle (78 % de diazote, 21 % de dioxygène, 0,04 % de CO₂) est une signature du vivant : aucune planète voisine n'a un tel taux de O₂.

## Le bouclier d'ozone
Une partie du dioxygène de la haute atmosphère est transformée en **ozone (O₃)** sous l'effet du rayonnement solaire. La **couche d'ozone**, constituée entre environ 2 milliards et 500 millions d'années, absorbe les **UV** les plus énergétiques. Sans elle, la vie ne pouvait rester qu'immergée : c'est son installation qui rend possible la **sortie des eaux**, il y a environ 500 à 400 millions d'années.

## Ce que l'atmosphère fait aujourd'hui
- elle fournit le **dioxygène** de la respiration et le **CO₂** de la photosynthèse ;
- elle **filtre** les UV grâce à l'ozone ;
- elle maintient, par l'**effet de serre**, une température moyenne compatible avec l'eau liquide ;
- elle **redistribue** l'énergie reçue de l'équateur vers les pôles.`,
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
            cours: `Le climat n'est pas la météo : c'est la **statistique** du temps sur au moins **30 ans**. Et cette statistique est pilotée par une comptabilité d'énergie.

## Le bilan radiatif
La Terre reçoit du Soleil, en moyenne sur toute sa surface, environ **340 W/m²**. Environ **30 %** repartent aussitôt, réfléchis par les nuages, les glaces et les surfaces claires : c'est l'**albédo**. Le reste est absorbé, puis réémis vers l'espace sous forme de **rayonnement infrarouge**. À l'équilibre, entrées = sorties, et la température moyenne reste stable.

## L'effet de serre
Certains gaz — **vapeur d'eau**, **CO₂**, **méthane (CH₄)**, **protoxyde d'azote** — absorbent l'infrarouge émis par le sol et en réémettent une partie vers le bas. Sans cet effet de serre naturel, la température moyenne serait d'environ **−18 °C** au lieu de **+15 °C**.

> Un **forçage radiatif** positif, c'est un déséquilibre : la Terre reçoit plus qu'elle ne renvoie, elle se réchauffe jusqu'à retrouver un équilibre à une température plus haute.

## Les rétroactions
Le système ne réagit pas proportionnellement, parce qu'il se répond à lui-même.
- **Rétroaction positive (amplifie)** : la fonte des glaces diminue l'albédo, donc la surface absorbe davantage, donc elle fond encore plus. Idem pour la vapeur d'eau — un air plus chaud en contient plus, et elle est elle-même un gaz à effet de serre.
- **Rétroaction négative (freine)** : un sol plus chaud rayonne plus d'infrarouge, ce qui évacue de l'énergie.

## Les couplages
L'**océan** stocke plus de 90 % de l'excès de chaleur et absorbe environ un quart du CO₂ émis. Il redistribue l'énergie par la **circulation thermohaline**, l'atmosphère par les **cellules de convection**. Les deux fluides sont couplés : **El Niño**, oscillation du Pacifique, dérègle les précipitations à l'échelle du globe.

## Pourquoi « complexe »
Beaucoup de variables, des échelles de temps très différentes (l'atmosphère réagit en jours, l'océan profond en siècles), des rétroactions, des seuils : la réponse du climat n'est ni linéaire ni immédiate.`,
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
            cours: `Le climat a toujours varié. L'argument n'infirme rien : ce qui distingue le réchauffement actuel, c'est sa **vitesse** et sa **cause**.

## Les archives naturelles
On reconstitue les climats anciens sans thermomètre, grâce à des **indicateurs** :
- les **carottes de glace** (Vostok, EPICA en Antarctique) remontent à plus de **800 000 ans** : les bulles d'air piégées donnent la composition de l'atmosphère d'alors ;
- le rapport des **isotopes de l'oxygène** (δ¹⁸O) dans la glace ou les coquilles donne la température ;
- **pollens**, **cernes des arbres**, sédiments complètent le tableau sur les périodes récentes.

> Ces archives montrent une corrélation étroite entre teneur en CO₂ et température sur 800 000 ans, avec une alternance glaciaire / interglaciaire d'environ 100 000 ans.

## Les causes des variations passées
Aux échelles de 10 000 à 100 000 ans, les **paramètres orbitaux** (cycles de **Milankovitch**) modifient la distribution de l'énergie reçue : **excentricité** (~100 000 ans), **obliquité** (~41 000 ans), **précession** (~21 000 ans). S'y ajoutent le volcanisme, l'activité solaire, la dérive des continents. Ces facteurs sont **naturels** — et ils sont trop lents ou trop faibles pour expliquer le siècle écoulé.

## Le réchauffement récent
Depuis 1850-1900, la température moyenne globale a augmenté d'environ **1,1 à 1,2 °C**. Dans le même temps, le CO₂ est passé d'environ **280 ppm** à plus de **420 ppm**, un niveau inédit depuis au moins 800 000 ans. La signature isotopique du carbone ajouté désigne les **combustibles fossiles**. Le **GIEC** conclut que l'influence humaine sur ce réchauffement est **sans équivoque**.

## Les futurs possibles
Les projections dépendent des **scénarios d'émissions** : de l'ordre de **+1,5 à +2 °C** à la fin du siècle si les émissions chutent vite, jusqu'à **+4 °C et au-delà** si elles se poursuivent. Conséquences attendues : montée du niveau marin, événements extrêmes plus intenses, déplacement des zones climatiques, acidification de l'océan.`,
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
            cours: `Un modèle climatique n'est pas une boule de cristal : c'est de la **physique résolue numériquement**, avec des incertitudes que les climatologues chiffrent eux-mêmes.

## Comment fonctionne un modèle
L'atmosphère et l'océan sont découpés en **mailles** (quelques dizaines de kilomètres de côté). Dans chaque maille, l'ordinateur résout les équations de la mécanique des fluides, du transfert radiatif, de la thermodynamique, pas de temps après pas de temps. Ce qui est plus petit que la maille — un nuage, un orage — doit être **paramétré**, c'est-à-dire représenté de façon approchée : c'est la principale source d'incertitude physique.

## Comment on lui fait confiance
On **valide** un modèle en lui faisant rejouer le passé : s'il reproduit le climat du XXe siècle, les refroidissements qui suivent les grandes éruptions volcaniques et les climats anciens, il est jugé fiable. Test décisif : les modèles ne reproduisent le réchauffement observé que si on y injecte les **émissions humaines** — les seuls facteurs naturels donnent une courbe plate.

## Prévoir le temps ≠ projeter le climat
La prévision météo perd toute valeur au-delà d'une dizaine de jours, parce que le système est **chaotique** : une erreur minuscule sur l'état initial enfle. Une projection climatique ne prétend pas dire le temps qu'il fera le 3 mai 2087 ; elle donne des **statistiques** (moyennes, extrêmes) en réponse à un forçage donné.

## Les scénarios
Les modèles ne connaissent pas nos décisions futures. On leur fournit donc des **scénarios d'émissions** contrastés, et chacun donne une trajectoire :
- émissions fortement réduites → réchauffement contenu autour de **+1,5 à 2 °C** ;
- émissions maintenues → **+4 °C** et au-delà à la fin du siècle.

> Les trois sources d'incertitude : le scénario (nos choix), la physique du modèle, et la variabilité naturelle. La première est de loin la plus grande — c'est-à-dire que le futur climatique dépend surtout de nous.`,
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
            cours: `En un siècle, l'électricité passe du statut de curiosité de laboratoire à celui d'énergie industrielle. Tout tient à une découverte : on sait désormais la **produire en continu** et la **convertir**.

## Produire un courant
**1800** : Volta empile disques de zinc et de cuivre séparés par un tissu imbibé — la **pile** délivre pour la première fois un courant continu et durable. **1820** : Œrsted observe qu'un courant dévie une aiguille aimantée — l'électricité et le magnétisme sont liés. **1831** : **Faraday** découvre l'**induction électromagnétique** — un aimant en mouvement près d'une bobine y fait naître un courant.

> L'induction, c'est le principe de TOUTE la production électrique actuelle : faire tourner un aimant devant des bobines. Une centrale nucléaire, un barrage et une éolienne ne diffèrent que par ce qui fait tourner l'aimant.

## Les machines
**1869** : Zénobe **Gramme** construit une dynamo capable de fournir du courant en quantité industrielle. Puis l'**alternateur** produit du courant alternatif. La machine tourne dans les deux sens : le même dispositif convertit l'énergie mécanique en énergie électrique (**générateur**) ou l'inverse (**moteur électrique**).

## Les usages
**1879** : Edison met au point une lampe à **incandescence** durable ; l'éclairage public et domestique se répand. Expositions universelles, tramways, premiers réseaux urbains : la « fée électricité » devient un symbole de modernité.

## Les grandeurs à connaître
- **P = U × I** (puissance en watts, tension en volts, intensité en ampères) ;
- **E = P × t** (énergie en joules si t est en secondes) ;
- **1 kWh = 3,6 × 10⁶ J** — l'unité de la facture ;
- le **rendement** d'une conversion = énergie utile / énergie reçue ; il est toujours inférieur à 1, l'écart partant en chaleur.`,
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
            cours: `Au XXe siècle, l'électricité cesse d'être un luxe urbain pour devenir une **infrastructure nationale**, puis la condition de tout ce qui suit — de l'électroménager à l'ordinateur.

## L'électrification du territoire
Les années 1920-1950 voient l'électrification des campagnes françaises : le réseau est étendu village par village. **EDF est créée en 1946** par nationalisation, ce qui unifie production, transport et distribution.

## Les grandes filières de production
- **Hydraulique** : les grands barrages d'après-guerre (Génissiat, Tignes, Serre-Ponçon) ; production souple, mobilisable en minutes.
- **Thermique à flamme** : charbon, fioul, puis gaz — on chauffe de l'eau, la vapeur fait tourner la turbine.
- **Nucléaire** : la **fission** de l'uranium remplace la flamme comme source de chaleur. Après le **choc pétrolier de 1973**, la France lance le **plan Messmer** : le parc de réacteurs est construit pour l'essentiel entre 1975 et 1990. L'électricité française devient **massivement nucléaire** (de l'ordre de 65 à 70 % de la production) et peu carbonée.

> Toutes ces filières, sauf le photovoltaïque, se ramènent au même schéma : une source d'énergie fait tourner une turbine, la turbine entraîne un alternateur, l'alternateur produit le courant.

## La consommation qui suit
La consommation d'électricité est multipliée par plusieurs dizaines sur le siècle : équipement des ménages, chauffage électrique, industrie, puis **électronique**. Le **transistor** (1947) puis le circuit intégré ouvrent l'informatique — un secteur entièrement dépendant de l'électricité.

## Ce que le siècle laisse en héritage
Un système centralisé, conçu pour de gros moyens de production pilotables, alors que le XXIe siècle y raccorde des sources **décentralisées et intermittentes** (éolien, solaire). Toute la question de la transition tient dans cet écart.`,
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
            cours: `L'électricité se produit rarement là où elle se consomme. Entre les deux, un réseau — et un problème de physique : les **pertes par effet Joule**.

## L'effet Joule
Un conducteur parcouru par un courant s'échauffe. La puissance perdue vaut :

**P(perdue) = R × I²**

avec R la résistance de la ligne et I l'intensité. Le carré est décisif : **doubler l'intensité quadruple les pertes**.

## La parade : monter la tension
La puissance transportée vaut P = U × I. Pour transporter la même puissance avec **moins d'intensité**, il faut donc une **tension plus élevée**. Multiplier U par 100 divise I par 100, donc les pertes par 10 000.

> C'est pourquoi les grandes lignes fonctionnent en **très haute tension : 225 000 et 400 000 volts**. Les pertes sur le réseau français restent ainsi de l'ordre de 2 à 3 %.

## Le transformateur, et pourquoi le courant est alternatif
Élever puis abaisser la tension se fait avec un **transformateur** — deux bobines couplées par un noyau magnétique. Or un transformateur **ne fonctionne qu'en courant alternatif** : c'est la variation du champ qui induit la tension au secondaire. C'est là l'origine de la « guerre des courants » entre Edison (continu) et Tesla / Westinghouse (alternatif) à la fin du XIXe : l'alternatif l'emporte parce qu'il se transporte.

## La chaîne complète
Centrale → transformateur **élévateur** → lignes THT (400 kV) → postes → réseau de distribution (20 kV) → transformateur **abaisseur** de quartier → 230 V chez toi.

## L'équilibre permanent
L'électricité ne se stocke pas à grande échelle : à chaque instant, la production doit **égaler** la consommation, sinon la **fréquence** (50 Hz en Europe) dérive et le réseau décroche. C'est le métier de **RTE**, qui pilote l'équilibre en temps réel. Les seuls stockages massifs disponibles sont les **STEP** (stations de pompage-turbinage) et, à plus petite échelle, les batteries.`,
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
            cours: `Première chose à ne pas confondre : l'électricité n'est pas une **source** d'énergie, c'est un **vecteur**. Elle ne se trouve pas dans le sol : on la fabrique à partir d'autre chose, et on la transporte.

## Les atouts
- **Polyvalence** : elle se convertit facilement en chaleur, lumière, mouvement, information.
- **Transport** : sur des centaines de kilomètres avec des pertes de quelques pour cent.
- **Rendement d'usage élevé** : un moteur électrique dépasse 90 % de rendement, contre environ 30 à 40 % pour un moteur thermique — pour la même énergie utile, il en faut bien moins.
- **Aucune émission au point d'usage** : décisif en ville pour la qualité de l'air.

## Le point de vigilance
Une électricité n'est propre que si sa **production** l'est. On compare les filières par leur **intensité carbone**, en grammes de CO₂ par kWh sur tout le cycle de vie :
- charbon : environ **820** g/kWh ;
- gaz : environ **490** g/kWh ;
- solaire photovoltaïque : quelques dizaines ;
- éolien, hydraulique, nucléaire : de l'ordre de **5 à 15** g/kWh.

> Une voiture électrique n'est vertueuse que branchée sur un mix décarboné : la même voiture émet très différemment selon le pays où elle se recharge.

## L'analyse du cycle de vie
On ne juge pas une technologie sur sa seule utilisation : l'**ACV** compte l'extraction des matériaux, la fabrication, le transport, l'usage et la fin de vie. Un panneau solaire n'émet rien en fonctionnant, mais sa fabrication a un coût énergétique et matériel.

## Les enjeux
- **Électrifier les usages** (transport, chauffage) pour sortir des fossiles ;
- gérer l'**intermittence** de l'éolien et du solaire (stockage, pilotage de la demande, interconnexions) ;
- sécuriser les **ressources critiques** : cuivre, lithium, terres rares ;
- ne pas oublier la **sobriété** : l'énergie la moins polluante reste celle qu'on ne consomme pas.`,
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
            cours: `Agir sur le climat futur ne se joue pas sur les gestes symboliques mais sur une comptabilité : celle des **gaz à effet de serre** que nous émettons encore.

## D'où viennent les émissions
La consommation mondiale d'énergie repose encore à environ **80 %** sur les **combustibles fossiles** (charbon, pétrole, gaz). Or brûler un carbone fossile, c'est réinjecter dans l'atmosphère un carbone stocké depuis des millions d'années : le cycle du carbone en est déséquilibré. Les émissions se répartissent entre production d'énergie, industrie, transports, bâtiments et agriculture.

## Le budget carbone
La hausse de température est à peu près **proportionnelle au CO₂ cumulé** émis depuis l'ère industrielle. On peut donc calculer un **budget carbone** : la quantité totale qu'il reste à émettre pour ne pas dépasser un seuil. Pour rester sous **+1,5 °C**, ce budget se compte en quelques centaines de milliards de tonnes — soit une poignée d'années au rythme actuel.

> Conséquence directe : ce n'est pas le niveau des émissions annuelles qui fixe le réchauffement, c'est leur **somme**. Retarder la baisse consomme le budget.

## Neutralité carbone
Être **neutre en carbone** ne veut pas dire n'émettre plus rien : cela veut dire que les émissions résiduelles sont **compensées par des puits** (forêts, sols, océans, captage). L'**Accord de Paris (2015)** engage les États à contenir le réchauffement **bien en dessous de 2 °C** et à poursuivre les efforts pour **1,5 °C** ; l'Union européenne vise la neutralité en **2050**.

## Les quatre leviers
1. **Sobriété** : consommer moins d'énergie.
2. **Efficacité** : consommer mieux à service rendu égal (isolation, rendement).
3. **Décarbonation de l'énergie** : remplacer les fossiles par de l'électricité bas carbone et des renouvelables.
4. **Puits de carbone** : préserver forêts et sols, développer le captage.

Aucun ne suffit seul : c'est leur combinaison, et leur **vitesse**, qui décident de la trajectoire.`,
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
            cours: `Choisir un mix énergétique n'est pas un débat d'opinion : c'est un arbitrage entre des critères **mesurables** qui ne pointent pas tous dans la même direction.

## Les critères d'un choix
- **Émissions de CO₂ par kWh** sur tout le cycle de vie ;
- **coût** du kWh produit, en incluant l'investissement (le « coût complet ») ;
- **disponibilité** : pilotable ou intermittente ;
- **emprise au sol** et acceptabilité locale ;
- **risques** (accident, déchets) ;
- **dépendance** aux importations : combustible, mais aussi métaux et composants ;
- **emplois** et filières industrielles.

> Aucune filière n'est la meilleure sur tous les critères à la fois. C'est pourquoi ces choix se tranchent politiquement, mais doivent s'argumenter avec des données.

## L'inertie, souvent sous-estimée
Une centrale se construit en 5 à 15 ans et fonctionne 40 à 60 ans ; un parc de logements se renouvelle à environ 1 % par an. Une décision énergétique **engage donc plusieurs décennies** : c'est ce qui rend le retard si coûteux, et les revirements si difficiles.

## Le rôle des sociétés
Le mix d'un pays reflète son histoire et sa géographie autant que la physique : la France a fait le choix du nucléaire après 1973 pour son indépendance ; la Norvège s'appuie sur son hydraulique ; l'Allemagne a longtemps combiné sortie du nucléaire et charbon ; les pays du Golfe dépendent de leurs hydrocarbures.

## Ce qu'on attend de toi au bac
Non pas une opinion, mais un **raisonnement sur documents** : lire un graphique d'émissions ou de coûts, comparer deux filières sur un critère explicite, distinguer un **fait mesuré** d'un **jugement de valeur**, et énoncer les limites des données utilisées (périmètre, année, source).`,
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
            cours: `La biodiversité n'est pas un catalogue d'espèces : c'est un **état instantané** d'un processus qui n'a jamais cessé de la produire et de la détruire.

## Trois niveaux
- **génétique** : la diversité des allèles au sein d'une même espèce ;
- **spécifique** : la diversité des espèces d'un milieu ;
- **écosystémique** : la diversité des milieux eux-mêmes.

Les trois comptent : une espèce nombreuse mais génétiquement uniforme est fragile face à une maladie.

## Ce qu'on en connaît
Environ **2 millions d'espèces** sont décrites, sur un total estimé entre **8 et 10 millions** — sans compter les micro-organismes. Une part majeure de la biodiversité n'a donc jamais été inventoriée.

## Estimer sans tout compter
On ne dénombre pas une population entière : on **échantillonne**. La méthode de **capture-marquage-recapture** en est l'exemple type. On capture n₁ individus, on les marque, on les relâche ; lors d'une seconde capture de n₂ individus, m sont marqués. On estime alors :

**N = (n₁ × n₂) / m**

Cette estimation suppose que les individus se sont **remélangés**, qu'aucun n'est né ni mort entre les deux captures, et que le marquage ne change pas leurs chances d'être repris. Toute estimation est donc assortie d'une **incertitude**.

## Les crises biologiques
L'histoire de la vie compte **cinq crises majeures**, définies par la disparition d'un grand nombre d'espèces en un temps géologiquement court :
- **Permien-Trias**, il y a environ **252 millions d'années** : la plus grave, plus de 90 % des espèces marines disparaissent ;
- **Crétacé-Paléogène**, il y a **66 millions d'années** : fin des dinosaures non aviens, liée à un astéroïde et à un volcanisme intense.

Après chaque crise, les groupes survivants se **diversifient** dans les niches libérées : les mammifères doivent leur essor à la cinquième.

## La sixième
Le rythme actuel d'extinction est estimé de **100 à 1 000 fois** supérieur au rythme naturel. Ses causes sont **anthropiques** : destruction des habitats, surexploitation, espèces invasives, pollutions, changement climatique.`,
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
            cours: `Une population n'évolue pas au hasard : quelques modèles simples suffisent à décrire — et à prévoir un temps — son effectif.

## Le vocabulaire
Le **taux de variation** d'une population dépend des naissances, des morts, et des migrations. On note souvent **r** le taux d'accroissement (par exemple r = 0,02 pour +2 % par an).

## Le modèle linéaire
La population augmente d'un **nombre constant** d'individus par unité de temps : N(t) = N₀ + a × t. Le graphique est une **droite**. Modèle rarement réaliste sur le vivant.

## Le modèle exponentiel (ou géométrique)
La population augmente d'un **pourcentage constant** : chaque année, elle est multipliée par (1 + r).

**N(t) = N₀ × (1 + r)^t**

Le graphique s'envole : c'est la croissance qui donne un **temps de doublement** constant. Ordre de grandeur utile : avec r = 2 % par an, la population double en environ **35 ans** (règle des 70 : doublement ≈ 70 / taux en %).

## Le modèle logistique
Aucun milieu n'est infini. Le modèle logistique introduit une **capacité biotique K** — l'effectif maximal que le milieu peut soutenir. La courbe est en **S** : croissance quasi exponentielle au départ, ralentissement quand N approche de K, puis plateau.

> Le passage du modèle exponentiel au modèle logistique, c'est le moment où les **ressources** deviennent limitantes : nourriture, espace, prédation, maladies.

## La démographie humaine
La population mondiale a franchi les **8 milliards en 2022**. Elle a été multipliée par 4 au XXe siècle, mais le taux d'accroissement **diminue** depuis les années 1970 : c'est la **transition démographique** — la mortalité baisse d'abord, la natalité ensuite, et l'écart entre les deux fait la poussée. Les projections situent un plafond autour de **10 milliards** au cours du XXIe siècle.

## Ce qu'un modèle ne fait pas
Il ne **prédit** pas : il **prolonge une hypothèse**. Changez le taux, la courbe change. Un modèle se juge à sa capacité à reproduire les données passées, et s'utilise en énonçant ses limites.`,
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
            cours: `La théorie de l'évolution n'est pas une hypothèse sur le passé lointain : c'est un **outil de lecture** du présent, qui explique la résistance aux antibiotiques comme la forme du bec d'un pinson.

## Le mécanisme darwinien
Publié en **1859** par Darwin, il tient en trois conditions, toutes observables :
1. les individus d'une population **varient** ;
2. une partie de cette variation est **héréditaire** ;
3. tous n'ont pas le même **succès reproducteur** dans le milieu donné.

Alors, mécaniquement, les caractères favorables deviennent plus fréquents à la génération suivante. C'est la **sélection naturelle**. Elle n'agit pas sur l'individu — qui ne change pas — mais sur la **fréquence des allèles dans la population**.

> Attention au piège de formulation : une bactérie ne « devient » pas résistante pour survivre à l'antibiotique. Certaines l'étaient déjà par **mutation aléatoire** ; l'antibiotique élimine les autres, et les résistantes se multiplient.

## La dérive génétique
Le hasard aussi fait évoluer. À chaque génération, un échantillon d'allèles est transmis : dans une **petite population**, cet échantillonnage suffit à faire disparaître un allèle ou à l'imposer, **indépendamment de tout avantage**. C'est la **dérive génétique** — elle est d'autant plus forte que la population est réduite.

## Ce que l'évolution n'est pas
- Ce n'est pas un **progrès** : elle n'a ni but ni direction, elle ajuste à un milieu qui change lui-même.
- Ce n'est pas une **hiérarchie** : une bactérie actuelle est aussi « évoluée » qu'un mammifère, même durée d'évolution derrière elle.
- L'évolution ne cherche pas la perfection : elle bricole avec l'existant.

## Applications concrètes
- **Antibiorésistance** : chaque usage inutile d'antibiotique sélectionne des souches résistantes — enjeu de santé publique majeur.
- **Résistance des insectes aux insecticides** et des adventices aux herbicides.
- **Sélection artificielle** : c'est le même mécanisme, avec l'humain comme facteur de tri — d'où les races de chiens et les variétés de blé.
- **Virus** : le virus de la grippe mute vite, d'où un vaccin reformulé chaque année.`,
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
            cours: `L'image de la « marche du progrès » — un singe courbé qui se redresse jusqu'à l'homme moderne — est **fausse**. La lignée humaine est un **buisson** : des branches qui coexistent, et dont une seule subsiste.

## Notre place dans le vivant
Nous sommes des **primates**, très proches des chimpanzés et bonobos : nos génomes diffèrent d'environ **1 %**. Notre dernier ancêtre commun avec eux vivait il y a **7 à 10 millions d'années**. Nous ne descendons donc pas du chimpanzé : nous en sommes des **cousins**.

## Les caractères dérivés du genre Homo
- **bipédie permanente** : trou occipital avancé, bassin court et large, courbures de la colonne, pied à voûte plantaire ;
- **volume crânien** croissant : environ 400 cm³ chez les australopithèques, 1 350 cm³ en moyenne chez *Homo sapiens* ;
- **face réduite**, mâchoire moins puissante ;
- **outils**, **feu**, **art**, **langage** — des caractères culturels que les fossiles n'attestent qu'indirectement.

## Quelques repères fossiles
- **Toumaï** (*Sahelanthropus*), environ **7 millions d'années**, Tchad ;
- **Lucy** (*Australopithecus afarensis*), environ **3,2 millions d'années**, Éthiopie — bipède mais encore bonne grimpeuse ;
- ***Homo habilis***, environ 2,4 Ma, premiers outils taillés ;
- ***Homo erectus***, environ 1,9 Ma, premier à sortir d'Afrique ;
- ***Homo neanderthalensis***, en Europe, éteint il y a environ **40 000 ans** ;
- ***Homo sapiens***, dont les plus anciens fossiles connus (Jebel Irhoud, Maroc) datent d'environ **300 000 ans**.

## Ce que dit la génétique
L'ADN ancien a tranché plusieurs débats. *Homo sapiens* est d'**origine africaine** et a essaimé ensuite sur les autres continents. Il a **coexisté** avec Néandertal et Denisova, et s'est croisé avec eux : les populations non africaines actuelles portent environ **1 à 3 %** d'ADN néandertalien.

> Plusieurs espèces d'*Homo* ont vécu en même temps. Être seuls sur la planète est une situation récente et exceptionnelle.`,
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
            cours: `Automatiser le traitement de l'information, c'est confier à une machine une opération qu'un humain faisait de tête : compter, trier, comparer. L'histoire de cette délégation est ancienne — et elle s'accélère.

## Mécaniser le calcul
**1642** : Pascal construit la **Pascaline**, machine à additionner à roues dentées. Au XIXe, **Charles Babbage** conçoit une **machine analytique** programmable, jamais achevée ; **Ada Lovelace** en écrit le premier algorithme destiné à une machine et comprend, la première, qu'elle pourrait traiter autre chose que des nombres.

## Le fondement théorique
**1936** : **Alan Turing** définit un modèle abstrait de machine — la **machine de Turing** — qui délimite ce qui est **calculable**. Résultat décisif : certains problèmes ne sont **pas** calculables, quelle que soit la puissance de la machine. L'automatisation a donc des limites théoriques, pas seulement techniques.

## L'électronique
**1947** : le **transistor** remplace le tube à vide — plus petit, plus fiable, moins gourmand. Puis le **circuit intégré** en réunit des milliers sur une puce. La **loi de Moore** (1965) observe un doublement du nombre de transistors par puce environ tous les deux ans : c'est cette progression, tenue pendant des décennies, qui rend possibles l'ordinateur personnel, le smartphone, puis les données massives.

## Algorithme et programme
- un **algorithme** est une suite finie d'instructions non ambiguës résolvant un problème ;
- un **programme** en est la traduction dans un langage exécutable par la machine.

Le traitement automatisé suppose des **données** codées en binaire, et il traite d'autant mieux qu'elles sont nombreuses et bien structurées.

## Ce que cela change pour nous
La machine **augmente** certaines capacités : mémoire, vitesse de calcul, accès à l'information. Elle en **délègue** d'autres : orientation, calcul mental, mémorisation. Ce transfert n'est pas neutre — il pose la question de ce que nous conservons la capacité de faire nous-mêmes, et de notre dépendance à des systèmes que nous ne contrôlons pas individuellement.`,
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
            cours: `L'intelligence artificielle désigne un ensemble de techniques permettant à une machine d'accomplir des tâches qui, faites par un humain, demanderaient de l'intelligence. Le mot est ancien (1956) ; ce qui est récent, c'est ce qui la fait fonctionner.

## Apprendre au lieu d'être programmé
Un programme classique applique des règles écrites par un humain. Un système d'**apprentissage automatique** (*machine learning*) fait l'inverse : on lui fournit un grand nombre d'**exemples**, il en **ajuste ses paramètres** jusqu'à reproduire la relation entrée-sortie. Les **réseaux de neurones artificiels** — vaguement inspirés des neurones biologiques, sans en être un modèle — sont aujourd'hui l'architecture dominante.

Trois ingrédients l'ont rendue possible : des **données massives**, une **puissance de calcul** considérable, et des **algorithmes** d'optimisation efficaces.

> Un système d'IA ne « comprend » pas : il **généralise à partir des données** qu'on lui a montrées. D'où sa force, et toutes ses faiblesses.

## Les débats, sans caricature
- **Biais** : un système entraîné sur des données biaisées reproduit et amplifie ces biais (recrutement, justice prédictive, reconnaissance faciale moins fiable selon les visages). Le biais vient des **données**, pas d'une intention de la machine.
- **Explicabilité** : les grands modèles sont des « boîtes noires ». Difficile d'exiger la justification d'une décision médicale ou judiciaire.
- **Responsabilité** : qui répond d'un accident de véhicule autonome — le constructeur, le programmeur, le propriétaire ?
- **Emploi** : des tâches disparaissent, d'autres apparaissent ; le débat porte sur le rythme et sur qui en supporte le coût.
- **Vie privée** : l'IA a faim de données personnelles.
- **Coût énergétique** : entraîner et faire tourner de grands modèles consomme électricité, eau de refroidissement et métaux — un enjeu qui rejoint directement le thème du climat.

## Ce que le programme attend
Distinguer ce qui relève du **fait technique** (comment ça marche, ce que ça peut) de ce qui relève du **choix de société** (ce qu'on autorise, et sous quel contrôle). Une position argumentée s'appuie sur des données ; une crainte ou un enthousiasme, non.`,
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
