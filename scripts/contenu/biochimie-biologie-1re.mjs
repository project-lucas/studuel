// Biochimie-biologie — 1re STL (voie technologique). Programme officiel :
// annexe 1 du BO spécial n° 1 du 22 janvier 2019. Deux modules thématiques
// (01 nutrition : digestion et excrétion ; 02 reproduction et transmission des
// caractères) et quatre modules transversaux (A biomolécules, B structures et
// fonctions, C milieu intérieur, D information et communication).
//
// La matière est NEUVE (slug `biochimie-biologie`, créé par le coordinateur,
// déclaré pour la seule classe « 1re techno ») : le bloc part donc de la
// position 1. L'axe de chaque fiche est l'intitulé du module officiel.

export default {
  slug: 'biochimie-biologie',
  nom: 'Biochimie-biologie',
  titreMigration: 'BIOCHIMIE-BIOLOGIE 1re STL — LE PROGRAMME OFFICIEL (17 fiches)',
  motif: `La série STL n'avait aucun contenu propre : un élève de 1re techno STL ne
trouvait rien pour sa spécialité de biochimie-biologie (4 h par semaine, évaluée en
contrôle continu puisqu'elle s'arrête en fin de première). Cette migration installe
17 fiches qui suivent le programme officiel (BO spécial n° 1 du 22 janvier 2019) :
les deux modules thématiques — la nutrition (digestion, absorption, glycémie,
excrétion rénale) et la reproduction (appareils génitaux, régulations hormonales,
méiose, fécondation, transmission des caractères) — et les quatre modules
transversaux (structure des biomolécules, cellule et imagerie, milieu intérieur et
homéostasie, expression et transmission de l'information génétique).`,
  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 1,
      chapitres: [
        {
          titre: 'Les aliments et les besoins nutritionnels',
          axe: '01 – Mécanismes moléculaires et physiologiques de la nutrition',
          lecon: {
            titre: 'Ce que contient ton assiette',
            cours: `Avant de comprendre la digestion, il faut savoir ce qu’on mange. Un aliment n’est pas une molécule : c’est un mélange de **constituants alimentaires**, que la digestion va trier et simplifier.

## Les constituants des aliments
| Famille | Exemples | Rôle principal |
| **Glucides** | amidon, saccharose, lactose | énergie rapide |
| **Lipides** | triglycérides, cholestérol | énergie de réserve, membranes |
| **Protides** | protéines de la viande, des légumineuses | construction, enzymes |
| **Eau et sels minéraux** | Na⁺, Ca²⁺, Fe²⁺ | milieu intérieur, os, transport de O₂ |
| **Vitamines** | A, C, D, B12 | cofacteurs, à très faible dose |
| **Fibres** | cellulose | non digestibles, transit |

Glucides, lipides et protides sont des **macronutriments** (on en mange des dizaines de grammes par jour) ; vitamines et oligo-éléments sont des **micronutriments** (quelques milligrammes, voire microgrammes).

## Besoins quantitatifs et qualitatifs
- **Besoins quantitatifs** : l’énergie qu’il faut couvrir chaque jour (environ 2 000 à 2 800 kcal pour un adolescent selon le sexe et l’activité). Repère : 1 g de glucide ou de protide apporte environ 4 kcal (17 kJ), 1 g de lipide environ 9 kcal (38 kJ).
- **Besoins qualitatifs** : certaines molécules ne peuvent pas être fabriquées par l’organisme. Il **doit** les trouver dans son alimentation.

> Un nutriment **essentiel** est un nutriment que l’organisme ne sait pas synthétiser : il doit être apporté par l’alimentation.

C’est le cas de **neuf acides aminés essentiels** chez l’adulte (dont la lysine, le tryptophane, la valine) et de deux **acides gras essentiels** (l’acide linoléique, oméga-6, et l’acide alpha-linolénique, oméga-3).

## Recommandation et allégation
Une **recommandation** nutritionnelle vient des autorités de santé (par exemple les repères du Programme national nutrition santé : au moins cinq fruits et légumes par jour, limiter le sucre et le sel). Une **allégation** est une affirmation portée sur l’emballage (« riche en fibres », « source de calcium ») : elle est encadrée par la réglementation européenne, mais reste un argument commercial.

## Exemple : lire une étiquette
Un yaourt de 125 g affiche pour 100 g : 3,5 g de protéines, 4,7 g de glucides, 3,2 g de lipides. Pour le pot entier, l’énergie vaut : 1,25 × (3,5 × 4 + 4,7 × 4 + 3,2 × 9) ≈ 1,25 × 61,6 ≈ **77 kcal**.

## Déséquilibres
Une ration trop riche en lipides et en sucres rapides favorise l’obésité et le diabète de type 2 ; une ration pauvre en fer provoque une anémie, une ration pauvre en vitamine C le scorbut. Une alimentation variée couvre à la fois les besoins quantitatifs et qualitatifs.`,
          },
          questions: [
            ['Quelle famille de constituants apporte le plus d’énergie par gramme ?', ['Les glucides', 'Les protides', 'Les lipides', 'Les fibres'], 2, 'Un gramme de lipide apporte environ 9 kcal, contre environ 4 kcal pour un gramme de glucide ou de protide.'],
            ['Un acide aminé essentiel est un acide aminé…', ['Que l’organisme ne sait pas synthétiser', 'Présent dans toutes les protéines', 'Qui fournit le plus d’énergie', 'Qui n’existe que dans la viande'], 0, 'Essentiel signifie « indispensable à apporter par l’alimentation », car l’organisme ne le fabrique pas.'],
            ['Lequel de ces constituants est un micronutriment ?', ['L’amidon', 'Les triglycérides', 'Les protéines', 'La vitamine C'], 3, 'Les vitamines sont nécessaires à très faible dose : ce sont des micronutriments.'],
            ['La cellulose est un aliment non digestible par l’être humain.', ['Vrai', 'Faux'], 0, 'L’être humain n’a pas l’enzyme qui hydrolyse la cellulose : elle forme les fibres, utiles au transit.'],
            ['Quels sont les deux acides gras essentiels ?', ['Acide palmitique et acide stéarique', 'Acide linoléique et acide alpha-linolénique', 'Acide oléique et acide acétique', 'Cholestérol et glycérol'], 1, 'Ce sont un oméga-6 et un oméga-3, que l’organisme ne sait pas produire.'],
            ['« Riche en fibres » inscrit sur un paquet de céréales est…', ['Une recommandation officielle', 'Un besoin quantitatif', 'Un micronutriment', 'Une allégation'], 3, 'L’allégation est une affirmation commerciale sur l’emballage, encadrée par la réglementation.'],
            ['Un aliment contient 10 g de glucides et 5 g de lipides. Quelle énergie apporte-t-il environ ?', ['130 kcal', '60 kcal', '85 kcal', '45 kcal'], 2, '10 × 4 + 5 × 9 = 40 + 45 = 85 kcal.'],
            ['Les besoins quantitatifs correspondent…', ['À l’énergie qu’il faut apporter chaque jour', 'Aux molécules que l’organisme ne sait pas fabriquer', 'Aux vitamines seulement', 'À la quantité d’eau bue'], 0, 'Le besoin quantitatif est d’abord un besoin énergétique ; le besoin qualitatif concerne la nature des nutriments.'],
            ['Quel minéral participe au transport du dioxygène dans le sang ?', ['Le sodium', 'Le fer', 'Le calcium', 'Le potassium'], 1, 'Le fer est au cœur de l’hémoglobine ; sa carence provoque une anémie.'],
            ['Quelle famille de constituants sert d’abord à construire les cellules et les enzymes ?', ['Les glucides', 'Les protides', 'Les fibres', 'L’eau'], 1, 'Les protéines sont les molécules de construction et de fonction : enzymes, transporteurs, hormones peptidiques.'],
            ['Une carence prolongée en vitamine C provoque…', ['Le rachitisme', 'Le diabète', 'L’anémie', 'Le scorbut'], 3, 'Le scorbut des marins au long cours venait du manque de fruits et légumes frais.'],
            ['Les protides et les glucides apportent la même énergie par gramme, environ 4 kcal.', ['Vrai', 'Faux'], 0, 'Environ 17 kJ par gramme pour chacun, contre environ 38 kJ pour les lipides.'],
          ],
        },
        {
          titre: 'L’appareil digestif et la digestion enzymatique',
          axe: '01 – Mécanismes moléculaires et physiologiques de la nutrition',
          lecon: {
            titre: 'Simplifier les molécules',
            cours: `La digestion transforme de grosses molécules, qui ne peuvent pas traverser la paroi de l’intestin, en petites molécules absorbables : les **nutriments**. C’est une **simplification moléculaire**.

## Le tube digestif et ses glandes annexes
Le **tube digestif** va de la bouche à l’anus : bouche, pharynx, œsophage, estomac, intestin grêle (duodénum, jéjunum, iléon), gros intestin. Son intérieur, la **lumière**, appartient au **milieu extérieur** : ce qui y circule n’est pas encore dans l’organisme.

Les **glandes annexes** déversent leurs sécrétions dans la lumière : glandes salivaires, **foie** (la bile, stockée dans la vésicule biliaire), **pancréas exocrine** (le suc pancréatique). Une glande **exocrine** sécrète vers une cavité ou l’extérieur ; une glande **endocrine** sécrète dans le sang.

## Trois mécanismes de digestion
| Mécanisme | Ce qui se passe | Exemple |
| **Mécanique** | fragmentation, brassage | mastication, péristaltisme |
| **Chimique** | action d’un agent non enzymatique | acidité gastrique (HCl), émulsion des lipides par la bile |
| **Enzymatique** | **hydrolyse** catalysée par une enzyme | amylase, pepsine, lipase |

Le **péristaltisme** est la succession de contractions des **muscles lisses** de la paroi, qui fait avancer le bol alimentaire puis le chyme.

## L’hydrolyse enzymatique
Une **hydrolyse** coupe une liaison grâce à une molécule d’eau. Les enzymes digestives sont **spécifiques** de leur substrat et ont un **pH optimal** et une **température optimale** (37 °C chez l’être humain).

| Enzyme | Lieu | Substrat → produits | pH optimal |
| Amylase salivaire | bouche | amidon → maltose | ≈ 7 |
| Pepsine | estomac | protéines → peptides | ≈ 2 |
| Amylase pancréatique | intestin grêle | amidon → maltose | ≈ 8 |
| Lipase pancréatique | intestin grêle | triglycérides → acides gras + monoglycérides | ≈ 8 |
| Trypsine | intestin grêle | peptides → petits peptides | ≈ 8 |

> Les **sels biliaires** ne sont pas des enzymes : ils **émulsionnent** les lipides en fines gouttelettes, ce qui multiplie la surface d’action de la lipase.

## Exemple d’expérience
On place de l’empois d’amidon avec de la salive à 37 °C. Au début, l’eau iodée donne une coloration bleu-noir (amidon présent). Au bout de quelques minutes, la coloration disparaît et la liqueur de Fehling chauffée donne un précipité rouge brique : l’amidon a été hydrolysé en sucre réducteur (maltose). Le tube témoin, sans salive, reste bleu-noir. À 0 °C ou après ébullition de la salive, rien ne se passe : l’enzyme est inactive, puis dénaturée.

## Le rôle du microbiote
Le gros intestin héberge des milliards de bactéries : le **microbiote**. Il vit en **symbiose** avec nous : il fermente les fibres non digérées, produit des vitamines (K, B12) et protège contre les pathogènes.`,
          },
          questions: [
            ['La lumière du tube digestif appartient…', ['Au milieu extérieur', 'Au milieu intérieur', 'Au sang', 'À la lymphe'], 0, 'Tant qu’une molécule n’a pas traversé la paroi intestinale, elle reste dans le milieu extérieur.'],
            ['Quelle glande annexe produit la bile ?', ['Le pancréas', 'L’estomac', 'Le foie', 'Les glandes salivaires'], 2, 'La bile est produite par le foie et stockée dans la vésicule biliaire.'],
            ['Une hydrolyse est une réaction qui…', ['Oxyde une molécule', 'Forme une liaison en libérant de l’eau', 'Coupe une liaison grâce à une molécule d’eau', 'Transporte une molécule'], 2, 'Hydro-lyse : couper par l’eau. La réaction inverse, une condensation, libère de l’eau.'],
            ['La pepsine agit dans l’estomac à un pH optimal voisin de…', ['2', '7', '8', '12'], 0, 'La pepsine est adaptée à l’acidité gastrique due à l’acide chlorhydrique.'],
            ['Les sels biliaires sont des enzymes qui hydrolysent les lipides.', ['Vrai', 'Faux'], 1, 'Ils émulsionnent les lipides : c’est une action chimique, pas enzymatique. L’hydrolyse est faite par la lipase.'],
            ['Quel est le produit de l’action de l’amylase sur l’amidon ?', ['Le glucose seul', 'Le lactose', 'Le saccharose', 'Le maltose'], 3, 'L’amylase libère surtout du maltose, un diholoside ensuite hydrolysé en glucose par la maltase.'],
            ['Le péristaltisme est dû…', ['Aux enzymes pancréatiques', 'Aux contractions des muscles lisses de la paroi', 'Aux muscles squelettiques de l’abdomen', 'Au microbiote'], 1, 'C’est une digestion mécanique : les muscles lisses se contractent de proche en proche.'],
            ['Après ébullition, la salive n’hydrolyse plus l’amidon. Pourquoi ?', ['L’amidon a été détruit', 'Il manque de l’eau', 'Le pH est devenu trop acide', 'L’amylase a été dénaturée'], 3, 'La chaleur détruit la structure tridimensionnelle de l’enzyme, donc son site actif.'],
            ['Une glande exocrine déverse sa sécrétion…', ['Dans le sang', 'Dans la lymphe', 'Dans une cavité ou vers l’extérieur', 'Dans le liquide intracellulaire'], 2, 'Le pancréas exocrine déverse son suc dans le duodénum ; le pancréas endocrine libère ses hormones dans le sang.'],
            ['La lipase pancréatique hydrolyse les triglycérides en…', ['Acides gras et monoglycérides', 'Acides aminés', 'Glucose', 'Cholestérol'], 0, 'Elle coupe les liaisons ester entre le glycérol et les acides gras.'],
            ['Le microbiote intestinal vit avec nous en…', ['Parasitisme', 'Symbiose', 'Compétition', 'Prédation'], 1, 'Les deux partenaires y gagnent : nous le nourrissons, il fermente les fibres et produit des vitamines.'],
            ['Dans l’expérience amylase-amidon, le tube sans salive sert de…', ['Substrat', 'Témoin', 'Réactif', 'Catalyseur'], 1, 'Le témoin montre que la disparition de l’amidon est bien due à la salive.'],
          ],
        },
        {
          titre: 'L’absorption intestinale et le devenir des nutriments',
          axe: '01 – Mécanismes moléculaires et physiologiques de la nutrition',
          lecon: {
            titre: 'Du chyle au foie',
            cours: `Une fois digérés, les nutriments doivent quitter la lumière intestinale pour entrer dans le milieu intérieur. C’est l’**absorption**, qui a lieu surtout dans l’intestin grêle.

## Une surface d’échange immense
La paroi de l’intestin grêle multiplie sa surface à tous les niveaux :
| Niveau | Structure | Effet |
| Organe | replis circulaires | × 3 |
| Tissu | **villosités** (≈ 1 mm) | × 10 |
| Cellule | **microvillosités** de l’entérocyte | × 20 |

Résultat : environ **200 m²**, la surface d’un court de tennis, pour quelques mètres de tube. Chaque villosité contient un capillaire sanguin et un **chylifère** (vaisseau lymphatique), à moins d’un dixième de millimètre de la lumière.

## L’entérocyte, une cellule polarisée
L’**entérocyte** est une cellule **polarisée** : sa **membrane apicale** (côté lumière, avec la bordure en brosse) et sa **membrane basale** (côté milieu intérieur) ne portent pas les mêmes transporteurs. Les cellules sont soudées par des **jonctions serrées** : les molécules doivent traverser les cellules.

## Les modes de transport
| Mode | Énergie | Sens | Exemple |
| **Diffusion simple** | non | selon le gradient | acides gras à travers la bicouche |
| **Transport passif facilité** | non | selon le gradient, par un transporteur | fructose, glucose (sortie basale) |
| **Transport actif** | oui (ATP ou gradient) | contre le gradient | glucose avec Na⁺ (co-transport) |

> Le **co-transport** Na⁺/glucose utilise le **gradient électrochimique** du sodium, entretenu par la pompe Na⁺/K⁺ qui consomme de l’ATP : le glucose entre contre son gradient, « porté » par le sodium.

## Deux voies de circulation
- Les nutriments **hydrosolubles** (glucose, acides aminés, vitamines B et C) passent dans le **sang**, puis la **veine porte hépatique** les conduit au foie. C’est un **système porte** : deux réseaux de capillaires se suivent (intestin puis foie).
- Les **lipides** sont réassemblés en triglycérides dans l’entérocyte, emballés en chylomicrons, et passent dans la **lymphe** (le chyle), qui rejoint le sang près du cœur sans passer d’abord par le foie.

## Stocker et libérer
| Cellule | Stockage (anabolisme) | Libération (catabolisme) |
| **Hépatocyte** | **glycogénogenèse** : glucose → glycogène | **glycogénolyse** : glycogène → glucose |
| **Adipocyte** | **lipogenèse** : triglycérides mis en réserve | **lipolyse** : acides gras libérés |

Le foie stocke environ 100 g de glycogène et peut libérer du glucose dans le sang ; le muscle stocke aussi du glycogène mais le garde pour lui.`,
          },
          questions: [
            ['Où a lieu l’essentiel de l’absorption des nutriments ?', ['Dans l’estomac', 'Dans l’œsophage', 'Dans le gros intestin', 'Dans l’intestin grêle'], 3, 'Sa surface d’environ 200 m² et sa paroi fine en font l’organe de l’absorption.'],
            ['Les microvillosités sont portées par…', ['La membrane apicale des entérocytes', 'La membrane basale des entérocytes', 'Les capillaires sanguins', 'Les chylifères'], 0, 'Elles forment la bordure en brosse, côté lumière.'],
            ['Le co-transport Na⁺/glucose est un transport…', ['Passif, sans énergie', 'Par diffusion simple', 'Actif, utilisant le gradient de Na⁺', 'Par phagocytose'], 2, 'Le glucose entre contre son gradient grâce au gradient de sodium entretenu par la pompe Na⁺/K⁺.'],
            ['Par quelle voie les lipides absorbés rejoignent-ils d’abord la circulation ?', ['La veine porte hépatique', 'L’artère mésentérique', 'La lymphe', 'L’urine'], 2, 'Emballés en chylomicrons, ils passent dans les chylifères puis la lymphe.'],
            ['Un système porte relie…', ['Deux réseaux de capillaires successifs', 'Une artère et une veine sans capillaires', 'Le cœur et les poumons', 'Deux vaisseaux lymphatiques'], 0, 'La veine porte relie les capillaires intestinaux aux capillaires du foie.'],
            ['La glycogénogenèse est…', ['La libération de glucose à partir du glycogène', 'La destruction des acides gras', 'La synthèse de lipides', 'La synthèse de glycogène à partir du glucose'], 3, 'Genèse = fabrication. La glycogénolyse est l’inverse.'],
            ['Les jonctions serrées entre entérocytes obligent les nutriments à traverser les cellules.', ['Vrai', 'Faux'], 0, 'Elles ferment l’espace entre cellules voisines : le passage est transcellulaire et contrôlé.'],
            ['Quelle cellule stocke les triglycérides en grande quantité ?', ['L’hépatocyte', 'L’adipocyte', 'L’entérocyte', 'Le globule rouge'], 1, 'Le tissu adipeux est la grande réserve d’énergie de l’organisme.'],
            ['Une cellule polarisée est une cellule…', ['Chargée électriquement', 'Qui n’a pas de noyau', 'Qui se divise vite', 'Dont les deux faces ont des membranes différentes'], 3, 'Membranes apicale et basale portent des transporteurs différents, ce qui oriente l’absorption.'],
            ['Un transport passif se fait…', ['Contre le gradient de concentration', 'Toujours avec de l’ATP', 'Dans le sens du gradient, sans énergie', 'Uniquement pour les ions'], 2, 'Il suit le gradient ; un transporteur peut le faciliter sans dépenser d’énergie.'],
            ['Le glycogène du muscle peut être libéré sous forme de glucose dans le sang.', ['Vrai', 'Faux'], 1, 'Seul le foie libère du glucose dans le sang ; le muscle garde son glycogène pour lui-même.'],
            ['Quel vaisseau conduit le glucose absorbé vers le foie ?', ['La veine porte hépatique', 'La veine cave', 'L’aorte', 'Le canal thoracique'], 0, 'Le foie reçoit en premier les nutriments hydrosolubles, qu’il peut stocker ou transformer.'],
          ],
        },
        {
          titre: 'La régulation de la glycémie',
          axe: '01 – Mécanismes moléculaires et physiologiques de la nutrition',
          lecon: {
            titre: 'Un taux tenu à un gramme près',
            cours: `La **glycémie** est la concentration de glucose dans le plasma. Chez une personne à jeun, elle reste proche de **1 g·L⁻¹** (entre 0,7 et 1,1 g·L⁻¹ environ), alors que nous mangeons par à-coups et que nos cellules consomment du glucose en continu. Ce maintien est un exemple d’**homéostasie**.

## Hyperglycémie et hypoglycémie
- **Hyperglycémie** : glycémie trop élevée (après un repas, ou dans le diabète).
- **Hypoglycémie** : glycémie trop basse (effort prolongé, jeûne, excès d’insuline) ; le cerveau, qui consomme surtout du glucose, souffre en premier.

## Une boucle de régulation
| Élément | Dans la régulation de la glycémie |
| **Grandeur régulée** | la glycémie |
| **Valeur de consigne** | environ 1 g·L⁻¹ |
| **Capteurs** | cellules des îlots de Langerhans du pancréas |
| **Messagers** | les **hormones** insuline et glucagon, transportées par le sang |
| **Effecteurs** | foie, muscles, tissu adipeux |

Une **hormone** est une molécule sécrétée dans le sang par une glande endocrine, qui agit à distance sur des cellules cibles portant son **récepteur**.

## Deux hormones antagonistes
| Hormone | Cellules productrices | Quand | Effets |
| **Insuline** | cellules **β** des îlots | hyperglycémie | entrée du glucose dans les cellules, glycogénogenèse, lipogenèse : la glycémie **baisse** |
| **Glucagon** | cellules **α** des îlots | hypoglycémie | glycogénolyse dans le foie : la glycémie **monte** |

> L’insuline est la **seule hormone hypoglycémiante** de l’organisme : quand elle manque ou agit mal, rien ne la remplace.

## Exemple : l’hyperglycémie provoquée
On fait boire 75 g de glucose à jeun, puis on mesure la glycémie toutes les 30 minutes. Chez une personne saine, elle monte vers 1,4 g·L⁻¹ puis revient sous 1,4 g·L⁻¹ à 2 h ; l’insulinémie suit la même courbe avec un léger retard. Chez une personne diabétique, la glycémie à 2 h dépasse 2 g·L⁻¹.

## Les diabètes
| | Diabète de type 1 | Diabète de type 2 |
| Cause | destruction auto-immune des cellules β | résistance des cellules à l’insuline |
| Insuline | absente | présente, mais peu efficace |
| Âge d’apparition | souvent jeune | souvent adulte, lié au surpoids et à la sédentarité |
| Traitement | injections d’insuline | hygiène de vie, médicaments, parfois insuline |

C’est une **rétroaction négative** : l’écart à la consigne déclenche une réponse qui réduit cet écart.`,
          },
          questions: [
            ['Quelle est la valeur de consigne de la glycémie à jeun ?', ['0,1 g·L⁻¹', 'Environ 1 g·L⁻¹', '5 g·L⁻¹', '10 g·L⁻¹'], 1, 'La glycémie à jeun reste voisine de 1 g·L⁻¹, soit environ 5,5 mmol·L⁻¹.'],
            ['Quelles cellules sécrètent l’insuline ?', ['Les cellules α des îlots de Langerhans', 'Les cellules β des îlots de Langerhans', 'Les hépatocytes', 'Les adipocytes'], 1, 'Les cellules β réagissent à l’hyperglycémie en libérant de l’insuline.'],
            ['Le glucagon a pour effet principal…', ['De faire entrer le glucose dans les muscles', 'De détruire les cellules β', 'De stocker les lipides', 'De stimuler la glycogénolyse dans le foie'], 3, 'Il fait libérer du glucose par le foie : la glycémie remonte.'],
            ['L’insuline est la seule hormone hypoglycémiante.', ['Vrai', 'Faux'], 0, 'Plusieurs hormones font monter la glycémie, une seule la fait baisser : d’où la gravité du diabète.'],
            ['Dans la boucle de régulation, le foie joue le rôle…', ['D’effecteur', 'De capteur', 'De grandeur régulée', 'De messager'], 0, 'Il reçoit l’ordre hormonal et stocke ou libère le glucose.'],
            ['Le diabète de type 1 est dû…', ['À une résistance à l’insuline', 'À un excès de glucagon', 'À la destruction auto-immune des cellules β', 'À un manque de glucose'], 2, 'Le système immunitaire détruit les cellules productrices : il faut injecter de l’insuline.'],
            ['Une hormone est transportée jusqu’à ses cellules cibles par…', ['Les nerfs', 'La lymphe seulement', 'Le sang', 'L’urine'], 2, 'Sécrétée par une glande endocrine, elle circule dans le sang et agit sur les cellules qui ont son récepteur.'],
            ['Après un repas riche en glucides, on observe…', ['Une hausse de l’insulinémie', 'Une baisse de l’insulinémie', 'Une hausse du glucagon', 'Une glycogénolyse intense'], 0, 'L’hyperglycémie stimule les cellules β, qui libèrent de l’insuline.'],
            ['La régulation de la glycémie fonctionne par…', ['Rétroaction positive', 'Action nerveuse seulement', 'Absence de rétroaction', 'Rétroaction négative'], 3, 'Toute variation déclenche une réponse qui la corrige : c’est le propre de l’homéostasie.'],
            ['Lors d’une hyperglycémie provoquée, une glycémie supérieure à 2 g·L⁻¹ à 2 h évoque…', ['Une hypoglycémie', 'Un diabète', 'Une réponse normale', 'Un jeûne prolongé'], 1, 'Chez une personne saine, la glycémie est revenue sous 1,4 g·L⁻¹ à 2 h.'],
            ['Le diabète de type 2 est d’abord lié…', ['À une absence totale d’insuline', 'À une infection', 'À un excès d’insuline', 'À une résistance des cellules à l’insuline'], 3, 'L’insuline est produite mais les cellules y répondent mal ; surpoids et sédentarité en sont des facteurs.'],
            ['Quel organe consomme presque exclusivement du glucose et souffre en premier d’une hypoglycémie ?', ['Le foie', 'Le rein', 'Le cerveau', 'Le tissu adipeux'], 2, 'D’où les malaises, la confusion puis la perte de connaissance en cas d’hypoglycémie sévère.'],
          ],
        },
        {
          titre: 'Le rein et la formation de l’urine',
          axe: '01 – Mécanismes moléculaires et physiologiques de la nutrition',
          lecon: {
            titre: 'Filtrer, reprendre, rejeter',
            cours: `Chaque jour, les reins filtrent environ **180 litres** de plasma et n’en rejettent qu’environ **1,5 litre** sous forme d’urine. Ils éliminent les déchets (urée, créatinine) et règlent la quantité d’eau et d’ions du sang.

## L’appareil urinaire
Deux **reins** produisent l’urine ; deux **uretères** la conduisent à la **vessie**, qui la stocke ; l’**urètre** l’évacue. Attention à l’orthographe : l’uret**è**re vient du rein, l’urètre sort de la vessie.

## Le néphron, unité fonctionnelle
Chaque rein contient environ un million de **néphrons**. Un néphron comprend :
1. le **corpuscule rénal** : un **glomérule** (pelote de capillaires) dans la capsule de Bowman ;
2. le **tube contourné proximal** ;
3. l’**anse de Henlé** ;
4. le **tube contourné distal** ;
5. le **tube collecteur**, commun à plusieurs néphrons.

## Trois étapes
| Étape | Lieu | Ce qui se passe |
| **Filtration** | glomérule | le plasma passe dans la capsule, sauf les cellules et les grosses protéines : c’est l’**urine primitive** |
| **Réabsorption** | tubes | l’eau, le glucose, les ions utiles retournent dans le sang |
| **Sécrétion** | tubes | certaines molécules (H⁺, médicaments) passent du sang vers le tube |

L’urine **définitive** est ce qui reste au bout du tube collecteur.

## Une filtration sélective
La barrière de filtration est faite de l’endothélium percé des capillaires, d’une membrane basale et des **podocytes**, dont les **pédicelles** laissent entre eux des fentes étroites. Les molécules de masse inférieure à environ 60 000 Da passent ; l’albumine et les cellules restent dans le sang.

> Trouver des protéines ou des globules rouges dans l’urine signale une lésion de la barrière de filtration.

## La réabsorption du glucose
Dans le tube proximal, le glucose est réabsorbé par **co-transport avec Na⁺**, comme dans l’intestin, puis sort par transport passif. Les transporteurs sont en nombre limité : au-delà d’une glycémie d’environ **1,8 g·L⁻¹**, ils sont **saturés** et le glucose apparaît dans l’urine (**glycosurie**), signe classique d’un diabète.

## La réabsorption de l’eau et l’ADH
L’eau suit un **gradient hydrique** (osmotique). Dans le tube collecteur, sa réabsorption est réglée par l’**ADH** (hormone antidiurétique), libérée par la **neurohypophyse** quand l’organisme manque d’eau. L’ADH fait insérer des **aquaporines** (canaux à eau) dans la membrane des cellules : plus d’eau retourne au sang, l’urine est plus concentrée et la **diurèse** (volume d’urine) diminue. Sans ADH (diabète insipide), on peut uriner plus de 10 litres par jour.

## Comparaison des liquides (g·L⁻¹)
| Molécule | Plasma | Urine primitive | Urine définitive |
| Protéines | 70 | ≈ 0 | 0 |
| Glucose | 1 | 1 | 0 |
| Urée | 0,3 | 0,3 | ≈ 20 |`,
          },
          questions: [
            ['Quelle est l’unité fonctionnelle du rein ?', ['Le néphron', 'Le glomérule', 'L’uretère', 'La capsule'], 0, 'Le néphron filtre, réabsorbe et sécrète : il forme l’urine à lui seul.'],
            ['Quel conduit relie un rein à la vessie ?', ['L’urètre', 'L’uretère', 'L’aorte', 'Le tube collecteur'], 1, 'L’uretère part du rein ; l’urètre évacue l’urine de la vessie vers l’extérieur.'],
            ['Où a lieu la filtration du plasma ?', ['Dans l’anse de Henlé', 'Dans le glomérule', 'Dans la vessie', 'Dans le tube collecteur'], 1, 'Le plasma passe du glomérule dans la capsule de Bowman : c’est l’urine primitive.'],
            ['Normalement, l’urine primitive contient…', ['Des globules rouges', 'Beaucoup de protéines', 'Des plaquettes', 'Du glucose'], 3, 'Le glucose est filtré, puis réabsorbé en totalité dans le tube proximal.'],
            ['Les podocytes appartiennent à…', ['La barrière de filtration glomérulaire', 'La vessie', 'L’anse de Henlé', 'L’urètre'], 0, 'Leurs pédicelles ménagent des fentes qui retiennent les grosses molécules.'],
            ['Pourquoi du glucose apparaît-il dans l’urine au-delà de 1,8 g·L⁻¹ de glycémie ?', ['La filtration s’arrête', 'L’ADH manque', 'Les transporteurs de réabsorption sont saturés', 'Le glucose est sécrété'], 2, 'Tout le glucose filtré ne peut plus être repris : c’est la glycosurie du diabète.'],
            ['L’ADH est libérée par…', ['Le pancréas', 'Le rein', 'La neurohypophyse', 'Le foie'], 2, 'Elle est produite par l’hypothalamus et stockée puis libérée par la neurohypophyse.'],
            ['L’ADH augmente la réabsorption d’eau en…', ['Faisant insérer des aquaporines', 'Détruisant les néphrons', 'Augmentant la filtration', 'Bloquant le sodium'], 0, 'Les aquaporines sont des canaux à eau : l’eau retourne au sang et l’urine se concentre.'],
            ['Un manque d’ADH provoque une diurèse très abondante.', ['Vrai', 'Faux'], 0, 'C’est le diabète insipide : l’eau n’est plus réabsorbée dans le tube collecteur.'],
            ['Quel déchet est bien plus concentré dans l’urine définitive que dans le plasma ?', ['Le glucose', 'Le calcium', 'L’albumine', 'L’urée'], 3, 'L’urée est filtrée puis concentrée par la réabsorption de l’eau.'],
            ['La présence de protéines dans l’urine indique plutôt…', ['Un diabète', 'Une lésion de la barrière de filtration', 'Un excès d’ADH', 'Une déshydratation'], 1, 'Les grosses protéines ne franchissent pas une barrière glomérulaire saine.'],
            ['Environ quel volume de plasma les reins filtrent-ils chaque jour ?', ['1,5 L', '18 L', '1 800 L', '180 L'], 3, 'Environ 180 L filtrés pour 1,5 L d’urine : plus de 99 % de l’eau est réabsorbée.'],
          ],
        },
        {
          titre: 'Les appareils reproducteurs et la testostérone',
          axe: '02 – Mécanismes physiologiques et moléculaires de la reproduction et de la transmission des caractères héréditaires',
          lecon: {
            titre: 'Des gonades sous contrôle',
            cours: `La reproduction repose sur des organes spécialisés, les **gonades**, qui produisent les gamètes et des hormones. Leur activité est pilotée par le cerveau.

## Les appareils génitaux
| | Homme | Femme |
| **Gonades** | testicules | ovaires |
| **Gamètes** | spermatozoïdes, produits en continu dès la puberté | ovocytes, un par cycle environ |
| **Voies génitales** | épididyme, canal déférent, urètre | trompes (oviductes), utérus, vagin |
| **Glandes annexes** | vésicules séminales, prostate | glandes du col de l’utérus |

Les **caractères sexuels primaires** sont les organes génitaux eux-mêmes ; les **caractères sexuels secondaires** apparaissent à la puberté (pilosité, voix grave, développement musculaire chez l’homme ; seins, répartition des graisses chez la femme).

## Le testicule, deux fonctions
Une coupe de testicule montre :
1. les **tubes séminifères**, où se déroule la **spermatogenèse** (production des spermatozoïdes), avec les cellules de Sertoli qui nourrissent les cellules germinales ;
2. entre les tubes, les **cellules de Leydig**, qui sécrètent la **testostérone** dans le sang.

## Le rôle de la testostérone
La testostérone est une **hormone stéroïde** (dérivée du cholestérol). Elle :
- permet la spermatogenèse ;
- entretient les caractères sexuels secondaires masculins ;
- agit sur l’hypothalamus et l’hypophyse (voir plus bas).

Une castration fait disparaître la testostérone et régresser les caractères sexuels secondaires ; des injections de testostérone les restaurent.

## L’axe hypothalamo-hypophysaire
| Étage | Hormone | Cible |
| **Hypothalamus** | **GnRH** | hypophyse antérieure |
| **Hypophyse** | **LH** et **FSH** | testicule |
| **Testicule** | **testostérone** | organes cibles et… hypothalamus et hypophyse |

La LH stimule les cellules de Leydig (testostérone) ; la FSH agit sur les cellules de Sertoli (spermatogenèse). C’est une **cascade de régulation**.

> Chez l’homme, la testostérone exerce un **rétrocontrôle négatif** : quand elle est trop élevée, elle freine la sécrétion de GnRH, de LH et de FSH. Sa concentration reste ainsi à peu près constante.

## Exemple d’interprétation
Un sportif qui prend des stéroïdes anabolisants de synthèse voit ses testicules diminuer de volume et sa production de spermatozoïdes chuter : l’hormone ajoutée exerce un rétrocontrôle négatif, LH et FSH s’effondrent et les testicules ne sont plus stimulés.`,
          },
          questions: [
            ['Quelles sont les gonades masculines ?', ['La prostate', 'Les vésicules séminales', 'Les testicules', 'L’épididyme'], 2, 'Les gonades produisent les gamètes et des hormones sexuelles.'],
            ['Quelles cellules sécrètent la testostérone ?', ['Les cellules de Leydig', 'Les cellules de Sertoli', 'Les spermatozoïdes', 'Les cellules de l’hypophyse'], 0, 'Elles sont situées entre les tubes séminifères.'],
            ['La spermatogenèse a lieu…', ['Dans la prostate', 'Dans les tubes séminifères', 'Dans le canal déférent', 'Dans l’hypophyse'], 1, 'Les cellules germinales s’y différencient en spermatozoïdes, de la périphérie vers la lumière du tube.'],
            ['La voix grave et la pilosité sont des caractères sexuels…', ['Primaires', 'Secondaires', 'Héréditaires seulement', 'Embryonnaires'], 1, 'Ils apparaissent à la puberté sous l’effet des hormones sexuelles.'],
            ['Quelle hormone l’hypothalamus sécrète-t-il pour stimuler l’hypophyse ?', ['La LH', 'La FSH', 'La testostérone', 'La GnRH'], 3, 'La GnRH déclenche la libération de LH et de FSH par l’hypophyse.'],
            ['La LH stimule chez l’homme…', ['Les cellules de Leydig', 'La prostate', 'Les ovaires', 'Le foie'], 0, 'Elle déclenche la sécrétion de testostérone.'],
            ['La testostérone est une hormone…', ['Peptidique', 'Glucidique', 'Stéroïde', 'Nucléique'], 2, 'Comme toutes les hormones sexuelles, elle dérive du cholestérol et porte un noyau stérane.'],
            ['Chez l’homme, un excès de testostérone freine la sécrétion de LH et de FSH.', ['Vrai', 'Faux'], 0, 'C’est un rétrocontrôle négatif, qui maintient la testostéronémie à peu près constante.'],
            ['Pourquoi la prise de stéroïdes anabolisants diminue-t-elle la production de spermatozoïdes ?', ['Ils détruisent les spermatozoïdes', 'Ils bloquent l’urètre', 'Ils freinent LH et FSH par rétrocontrôle négatif', 'Ils augmentent la GnRH'], 2, 'Sans LH ni FSH, les testicules ne sont plus stimulés.'],
            ['Quelle voie génitale conduit les spermatozoïdes de l’épididyme vers l’urètre ?', ['Le canal déférent', 'L’uretère', 'La trompe', 'Le tube séminifère'], 0, 'Les spermatozoïdes mûrissent dans l’épididyme puis empruntent le canal déférent.'],
            ['La prostate est…', ['Une gonade', 'Une hormone', 'Une voie génitale', 'Une glande annexe'], 3, 'Elle produit une partie du liquide séminal.'],
            ['Une régulation où chaque glande stimule la suivante s’appelle…', ['Un rétrocontrôle positif', 'Une cascade de régulation', 'Une homéostasie', 'Une diffusion'], 1, 'Hypothalamus, puis hypophyse, puis gonade : chaque étage commande le suivant.'],
          ],
        },
        {
          titre: 'Les cycles féminins, la contraception et l’AMP',
          axe: '02 – Mécanismes physiologiques et moléculaires de la reproduction et de la transmission des caractères héréditaires',
          lecon: {
            titre: 'Vingt-huit jours de dialogue hormonal',
            cours: `Chez la femme, de la puberté à la ménopause, l’ovaire et l’utérus fonctionnent de manière **cyclique**, sur environ **28 jours**. Le premier jour des règles est le jour 1 du cycle.

## Le cycle ovarien
| Phase | Jours (repère) | Événements dans l’ovaire | Hormone ovarienne dominante |
| **Folliculaire** | 1 à 14 | croissance de follicules (**folliculogenèse**), un seul arrive à maturité | **œstrogènes** croissants |
| **Ovulation** | ≈ 14 | le follicule mûr libère l’ovocyte | pic d’œstrogènes |
| **Lutéale** | 15 à 28 | le follicule vide devient **corps jaune** | **progestérone** et œstrogènes |

Sans fécondation, le corps jaune dégénère vers le jour 28 : la progestérone chute.

## Le cycle utérin
L’**endomètre** (muqueuse utérine) suit l’ovaire :
- les **œstrogènes** le font **proliférer** (épaississement) ;
- la **progestérone** le rend apte à la **nidation** (dentelle utérine, glandes sécrétrices) ;
- la chute des deux hormones provoque sa destruction : ce sont les **menstruations**.

Si un embryon s’implante, il sécrète une hormone (hCG) qui maintient le corps jaune : la progestérone reste élevée et les règles n’ont pas lieu.

## La régulation par l’hypophyse
L’hypothalamus sécrète la GnRH ; l’hypophyse libère **FSH** (croissance des follicules) et **LH**. Les hormones ovariennes rétroagissent :

> Pendant la plus grande partie du cycle, les œstrogènes exercent un **rétrocontrôle négatif**. Mais quand ils dépassent une **valeur seuil** en fin de phase folliculaire, le rétrocontrôle devient **positif** : il déclenche le **pic de LH**, qui provoque l’ovulation environ 36 heures plus tard.

## La contraception hormonale
La pilule combinée apporte chaque jour des œstrogènes et un progestatif de synthèse. Ils exercent un **rétrocontrôle négatif permanent** : pas de pic de LH, donc **pas d’ovulation**. Le progestatif épaissit aussi la **glaire cervicale**, qui bloque les spermatozoïdes. La pilule progestative seule agit surtout sur la glaire. La **contraception d’urgence** (dans les heures qui suivent un rapport) retarde ou bloque l’ovulation.

## L’assistance médicale à la procréation
En cas d’infertilité, l’**AMP** propose l’insémination artificielle ou la **fécondation in vitro** (FIV). Le protocole de stimulation ovarienne suit la logique des hormones :
1. bloquer le cycle naturel ;
2. injecter de la FSH pour faire mûrir plusieurs follicules ;
3. déclencher l’ovulation par une injection qui imite le pic de LH ;
4. ponctionner les ovocytes et les féconder au laboratoire.`,
          },
          questions: [
            ['Quelle hormone est sécrétée par le corps jaune ?', ['La FSH', 'La GnRH', 'La LH', 'La progestérone'], 3, 'Le corps jaune sécrète surtout de la progestérone, et aussi des œstrogènes.'],
            ['Qu’est-ce qui déclenche l’ovulation ?', ['La chute de la progestérone', 'Les menstruations', 'Un pic de LH', 'La hCG'], 2, 'Le pic de LH provoque la rupture du follicule mûr environ 36 h plus tard.'],
            ['Pendant la phase folliculaire, l’endomètre…', ['Prolifère sous l’effet des œstrogènes', 'Se détruit', 'Reste inchangé', 'Devient un corps jaune'], 0, 'Les œstrogènes font épaissir la muqueuse utérine.'],
            ['Les menstruations sont provoquées par…', ['La hausse de la LH', 'La chute de la progestérone et des œstrogènes', 'L’ovulation', 'La hausse de la FSH'], 1, 'Sans hormones ovariennes, l’endomètre n’est plus entretenu et se détache.'],
            ['En fin de phase folliculaire, le rétrocontrôle des œstrogènes devient positif.', ['Vrai', 'Faux'], 0, 'Au-delà d’une valeur seuil, les œstrogènes stimulent la libération massive de LH.'],
            ['Comment la pilule combinée empêche-t-elle l’ovulation ?', ['En détruisant les ovocytes', 'Par un rétrocontrôle négatif permanent qui supprime le pic de LH', 'En augmentant la FSH', 'En bloquant les trompes'], 1, 'Sans pic de LH, le follicule ne libère pas d’ovocyte.'],
            ['Le premier jour du cycle correspond…', ['À l’ovulation', 'Au pic de LH', 'À la formation du corps jaune', 'Au premier jour des règles'], 3, 'Par convention, le cycle commence avec les menstruations.'],
            ['Qu’est-ce qui maintient le corps jaune en cas de grossesse ?', ['L’hormone hCG sécrétée par l’embryon', 'La FSH', 'La testostérone', 'L’insuline'], 0, 'La hCG entretient la sécrétion de progestérone : pas de règles. C’est elle que détectent les tests de grossesse.'],
            ['La FSH stimule…', ['La sécrétion de hCG', 'La destruction de l’endomètre', 'La croissance des follicules', 'La glaire cervicale'], 2, 'FSH signifie hormone folliculo-stimulante.'],
            ['Un progestatif épaissit la glaire cervicale, ce qui…', ['Favorise la nidation', 'Déclenche l’ovulation', 'Bloque le passage des spermatozoïdes', 'Provoque les règles'], 2, 'C’est le mode d’action principal de la pilule progestative seule.'],
            ['Dans une FIV, pourquoi injecte-t-on de la FSH ?', ['Pour faire mûrir plusieurs follicules', 'Pour bloquer l’ovulation', 'Pour provoquer les règles', 'Pour détruire le corps jaune'], 0, 'On cherche à obtenir plusieurs ovocytes à ponctionner.'],
            ['La nidation a lieu dans…', ['L’ovaire', 'La trompe', 'Le col de l’utérus', 'L’endomètre'], 3, 'L’embryon s’implante dans la muqueuse utérine préparée par la progestérone.'],
          ],
        },
        {
          titre: 'Méiose, gamétogenèse et fécondation',
          axe: '02 – Mécanismes physiologiques et moléculaires de la reproduction et de la transmission des caractères héréditaires',
          lecon: {
            titre: 'De 46 à 23, puis de 23 + 23 à 46',
            cours: `Nos cellules somatiques ont **46 chromosomes**, rangés en 23 paires : elles sont **diploïdes** (2n = 46). Nos gamètes n’en ont que **23**, un de chaque paire : ils sont **haploïdes** (n = 23). La **méiose** divise le nombre de chromosomes par deux ; la **fécondation** le rétablit.

## Mitose et méiose
| | Mitose | Méiose |
| Rôle | multiplier les cellules | produire les gamètes |
| Nombre de divisions | une | deux successives |
| Cellules obtenues | 2 cellules diploïdes identiques | 4 cellules haploïdes différentes |
| Type | division **équationnelle** | division **réductionnelle** puis équationnelle |

## Les deux divisions de la méiose
1. **Méiose I (réductionnelle)** : les **chromosomes homologues** s’apparient, puis se séparent. Chaque cellule fille reçoit un chromosome de chaque paire, encore formé de deux **chromatides**.
2. **Méiose II (équationnelle)** : les deux chromatides de chaque chromosome se séparent, comme en mitose.

## La gamétogenèse
| | Spermatogenèse | Ovogenèse |
| Lieu | tubes séminifères | ovaire |
| Durée | environ 74 jours, en continu | commence avant la naissance, se termine à la fécondation |
| Produits d’une cellule | 4 spermatozoïdes | 1 ovocyte + des globules polaires |

La division de l’ovogenèse est **asymétrique** : l’ovocyte garde presque tout le cytoplasme, les **globules polaires** dégénèrent. Particularité importante : l’ovocyte expulsé à l’ovulation est un **ovocyte II bloqué en métaphase II**. Il n’achève sa méiose **que si un spermatozoïde y pénètre**.

## La fécondation
1. Un spermatozoïde traverse les enveloppes de l’ovocyte II.
2. La pénétration débloque la méiose II : second globule polaire.
3. Les deux noyaux haploïdes se rapprochent et leurs chromosomes s’associent : **additivité des génomes nucléaires**.
4. La cellule-œuf (zygote) est diploïde.

> Le génome **mitochondrial**, lui, n’est transmis que par la **mère** : les mitochondries du spermatozoïde ne sont pas conservées. Une maladie due à une mutation de l’ADN mitochondrial passe de la mère à tous ses enfants, jamais du père.

## Exemple : une anomalie de la méiose
Si les chromosomes 21 ne se séparent pas en méiose I, un gamète reçoit deux chromosomes 21. Fécondé par un gamète normal, il donne une cellule-œuf à trois chromosomes 21 : c’est la **trisomie 21** (47 chromosomes), visible sur le **caryotype**.`,
          },
          questions: [
            ['Combien de chromosomes contient un gamète humain ?', ['46', '23', '92', '44'], 1, 'Les gamètes sont haploïdes : un chromosome de chaque paire.'],
            ['La méiose produit, à partir d’une cellule…', ['2 cellules diploïdes identiques', '1 cellule haploïde', '4 cellules diploïdes', '4 cellules haploïdes'], 3, 'Deux divisions successives donnent quatre cellules à 23 chromosomes.'],
            ['Pendant la méiose I se séparent…', ['Les chromatides sœurs', 'Les mitochondries', 'Les chromosomes homologues', 'Les deux noyaux'], 2, 'C’est la division réductionnelle : le nombre de chromosomes est divisé par deux.'],
            ['L’ovocyte libéré à l’ovulation est bloqué en…', ['Métaphase II', 'Prophase I', 'Anaphase I', 'Interphase'], 0, 'Il n’achève la méiose II qu’après la pénétration du spermatozoïde.'],
            ['Pourquoi l’ovogenèse est-elle une division asymétrique ?', ['Elle produit 4 ovocytes', 'L’ovocyte garde presque tout le cytoplasme, les globules polaires dégénèrent', 'Elle ne dure qu’un jour', 'Elle se fait sans méiose'], 1, 'Une seule cellule utile, riche en réserves, est produite par ovogenèse.'],
            ['Le génome mitochondrial est transmis…', ['Par le père seulement', 'Par la mère seulement', 'Par les deux parents', 'Au hasard'], 1, 'Les mitochondries du zygote viennent de l’ovocyte.'],
            ['La mitose est une division équationnelle.', ['Vrai', 'Faux'], 0, 'Les cellules filles ont le même nombre de chromosomes que la cellule mère.'],
            ['La trisomie 21 résulte le plus souvent…', ['D’une mutation d’un gène', 'D’une erreur de la mitose du zygote seulement', 'D’une infection', 'D’une mauvaise séparation des chromosomes pendant la méiose'], 3, 'Un gamète à deux chromosomes 21 donne, après fécondation, une cellule à 47 chromosomes.'],
            ['Quel document permet de compter et classer les chromosomes d’une cellule ?', ['Un caryotype', 'Un arbre généalogique', 'Une électrophorèse de protéines', 'Un antibiogramme'], 0, 'Les chromosomes photographiés en métaphase sont rangés par paires.'],
            ['Combien de spermatozoïdes une cellule germinale donne-t-elle après méiose ?', ['1', '2', '4', '8'], 2, 'Contrairement à l’ovogenèse, la spermatogenèse garde les quatre produits de la méiose.'],
            ['La fécondation rétablit la diploïdie par…', ['La duplication de l’ADN', 'La mitose de l’ovocyte', 'L’additivité des génomes nucléaires des deux gamètes', 'La perte d’un globule polaire'], 2, '23 chromosomes paternels + 23 maternels = 46 chromosomes.'],
            ['Chaque chromosome, au début de la méiose, est formé de…', ['Deux chromatides', 'Une seule chromatide', 'Quatre chromatides', 'Aucune chromatide'], 0, 'L’ADN a été répliqué avant la division : chaque chromosome porte deux chromatides sœurs.'],
          ],
        },
        {
          titre: 'Brassages génétiques et transmission des caractères',
          axe: '02 – Mécanismes physiologiques et moléculaires de la reproduction et de la transmission des caractères héréditaires',
          lecon: {
            titre: 'Pourquoi frères et sœurs diffèrent',
            cours: `Deux enfants des mêmes parents ne sont jamais génétiquement identiques (sauf les vrais jumeaux). La méiose et la fécondation créent une diversité presque infinie de combinaisons.

## Gène, allèle, génotype, phénotype
- Un **gène** est une portion d’ADN qui code une protéine ; il occupe une place précise sur un chromosome.
- Un **allèle** est une version d’un gène. Une cellule diploïde porte **deux allèles** de chaque gène (un par chromosome homologue).
- Le **génotype** est la combinaison des allèles ; le **phénotype** est ce qu’on observe (moléculaire, cellulaire, ou à l’échelle de l’organisme).
- **Homozygote** : deux allèles identiques ; **hétérozygote** : deux allèles différents.

## Dominance et récessivité
Chez un hétérozygote, l’allèle qui s’exprime est **dominant**, l’autre est **récessif**. On note souvent l’allèle dominant par une majuscule (A) et le récessif par une minuscule (a). Un phénotype récessif n’apparaît que chez l’homozygote a//a.

> Exemple : la **drépanocytose**. Une seule mutation (GAG → GTG) remplace l’acide glutamique par la valine en position 6 de la chaîne β de l’hémoglobine. L’hémoglobine S forme des fibres, les globules rouges prennent une forme de faucille : la maladie ne s’exprime que chez les homozygotes.

## Deux brassages pendant la méiose
| Brassage | Moment | Mécanisme |
| **Intrachromosomique** | prophase I | **crossing-over** : échange de portions de chromatides entre homologues appariés |
| **Interchromosomique** | anaphase I | **ségrégation aléatoire** des homologues de chaque paire |

Rien qu’avec le brassage interchromosomique, un être humain peut produire 2²³ ≈ 8 millions de gamètes différents. La **fécondation**, qui réunit au hasard deux gamètes, multiplie encore cette diversité.

## Lire un arbre généalogique
Les carrés sont les hommes, les ronds les femmes, les symboles pleins les personnes atteintes.
1. **Deux parents sains ont un enfant atteint** : l’allèle est **récessif** ; les parents sont hétérozygotes.
2. Si l’allèle est dominant, toute personne atteinte a au moins un parent atteint.
3. Pour savoir si le gène est sur un **autosome** ou un **gonosome** (X) : si une fille atteinte d’une maladie récessive a un père sain, le gène n’est pas sur le chromosome X (le père lui aurait transmis son X, donc l’allèle).

## Exemple : un échiquier de croisement
Deux parents hétérozygotes A//a. Chacun produit 50 % de gamètes A et 50 % de gamètes a.
| | A | a |
| **A** | A//A | A//a |
| **a** | A//a | a//a |
Probabilité d’un enfant atteint (a//a) : **1/4**.`,
          },
          questions: [
            ['Un allèle est…', ['Un chromosome entier', 'Un gamète', 'Une protéine', 'Une version d’un gène'], 3, 'Un même gène peut exister en plusieurs versions qui diffèrent par leur séquence.'],
            ['Un individu A//a est…', ['Homozygote dominant', 'Hétérozygote', 'Homozygote récessif', 'Haploïde'], 1, 'Il porte deux allèles différents du même gène.'],
            ['Le crossing-over est responsable du brassage…', ['Interchromosomique', 'Cytoplasmique', 'Mitochondrial', 'Intrachromosomique'], 3, 'Il échange des portions de chromatides entre chromosomes homologues en prophase I.'],
            ['Deux parents sains ont un enfant atteint. L’allèle responsable est…', ['Dominant', 'Forcément sur le chromosome Y', 'Récessif', 'Mitochondrial'], 2, 'Les parents portent l’allèle sans l’exprimer : ils sont hétérozygotes.'],
            ['Quelle est la probabilité d’un enfant a//a pour deux parents A//a ?', ['1/4', '1/2', '3/4', '0'], 0, 'L’échiquier donne une case a//a sur quatre.'],
            ['Le brassage interchromosomique a lieu…', ['En prophase I', 'En anaphase I', 'Pendant la fécondation', 'En interphase'], 1, 'Les homologues de chaque paire partent au hasard vers l’un ou l’autre pôle.'],
            ['Dans la drépanocytose, la mutation remplace l’acide glutamique par…', ['La lysine', 'La valine', 'La sérine', 'La cystéine'], 1, 'Une seule base change (GAG → GTG), et un acide aminé hydrophobe prend la place d’un acide aminé chargé.'],
            ['Le phénotype peut se décrire à l’échelle moléculaire.', ['Vrai', 'Faux'], 0, 'La forme d’une protéine (hémoglobine S) est déjà un phénotype, avant même la forme des globules rouges.'],
            ['Combien de gamètes différents le seul brassage interchromosomique permet-il chez l’humain ?', ['46', '23²', '2⁴⁶', '2²³, environ 8 millions'], 3, 'Chacune des 23 paires se sépare au hasard : 2 possibilités par paire.'],
            ['Dans un arbre généalogique, un rond plein représente…', ['Une femme atteinte', 'Un homme sain', 'Un homme atteint', 'Une femme saine'], 0, 'Rond = femme, carré = homme ; le symbole plein signale une personne atteinte.'],
            ['Un gène porté par le chromosome X est porté par…', ['Un autosome', 'L’ADN mitochondrial', 'Un gonosome', 'Un plasmide'], 2, 'Les chromosomes sexuels X et Y sont les gonosomes ; les 22 autres paires sont des autosomes.'],
            ['Deux vrais jumeaux ont le même génotype.', ['Vrai', 'Faux'], 0, 'Ils proviennent d’une seule cellule-œuf qui s’est séparée en deux embryons.'],
          ],
        },
        {
          titre: 'Les glucides : oses et osides',
          axe: 'A – Relations structures et propriétés des biomolécules',
          lecon: {
            titre: 'Du glucose à l’amidon',
            cours: `Les **glucides** sont les biomolécules de l’énergie rapide et des réserves. Leur structure explique à la fois leur goût sucré, leur solubilité et la façon dont les enzymes les découpent.

## Les groupes caractéristiques à connaître
| Fonction | Groupe caractéristique |
| Alcool | –OH |
| Aldéhyde | –CHO |
| Cétone | C=O entre deux carbones |
| Acide carboxylique | –COOH |
| Amine | –NH₂ |
| Ester | –COO– |
| Amide | –CO–NH– |

## Les oses
Un **ose** (sucre simple) porte plusieurs fonctions alcool et **une** fonction aldéhyde ou cétone.
| Ose | Nombre de C | Fonction | Classement |
| **D-glucose** | 6 | aldéhyde | aldohexose |
| **D-galactose** | 6 | aldéhyde | aldohexose |
| **D-fructose** | 6 | cétone | cétohexose |
| **D-ribose** | 5 | aldéhyde | aldopentose |
| **D-désoxyribose** | 5 | aldéhyde | aldopentose, un –OH en moins sur le carbone 2 |

Le galactose ne diffère du glucose que par la position d’un –OH (carbone 4). Deux molécules de même formule brute peuvent donc avoir des propriétés biologiques différentes.

## Deux représentations
- En **projection de Fischer**, la chaîne carbonée est verticale, le carbone 1 en haut ; la lettre **D** signifie que le –OH de l’avant-dernier carbone est à **droite**.
- En solution, le glucose se referme sur lui-même : c’est la représentation cyclique de **Haworth**, un cycle à six sommets (5 C + 1 O).

## Les osides
Les oses se lient par une **liaison osidique** en éliminant une molécule d’eau (condensation). La digestion la coupe par hydrolyse.
| Oside | Composition | Où on le trouve |
| **Maltose** | glucose + glucose | produit de l’hydrolyse de l’amidon |
| **Lactose** | galactose + glucose | lait |
| **Saccharose** | glucose + fructose | sucre de table |
| **Amidon** | des milliers de glucoses | réserve végétale |
| **Glycogène** | des milliers de glucoses, très ramifié | réserve animale (foie, muscles) |

Le maltose est un **dimère**, l’amidon un **polymère** : ce sont des **holosides** (faits uniquement d’oses).

> La **cellulose** est aussi un polymère de glucose, mais ses liaisons osidiques ont une autre orientation : nos enzymes ne la reconnaissent pas. Même monomère, liaison différente, destin différent.

## Exemple : identifier un oside
Un oside inconnu est hydrolysé ; la chromatographie de l’hydrolysat montre deux taches, l’une au niveau du glucose, l’autre au niveau du galactose. L’oside est le **lactose**.`,
          },
          questions: [
            ['Le D-glucose est un…', ['Cétohexose', 'Aldopentose', 'Aldohexose', 'Diholoside'], 2, 'Il a 6 carbones et une fonction aldéhyde.'],
            ['Le D-fructose porte une fonction…', ['Cétone', 'Aldéhyde', 'Acide carboxylique', 'Amine'], 0, 'C’est un cétohexose : sa fonction carbonyle est sur le carbone 2.'],
            ['Le saccharose est formé de…', ['Glucose + glucose', 'Glucose + galactose', 'Fructose + galactose', 'Glucose + fructose'], 3, 'C’est le sucre de table, extrait de la betterave ou de la canne.'],
            ['Quelle liaison relie deux oses ?', ['La liaison peptidique', 'La liaison osidique', 'La liaison ester', 'Le pont disulfure'], 1, 'Elle se forme avec élimination d’eau et se coupe par hydrolyse.'],
            ['Le glycogène est une réserve…', ['Végétale', 'Lipidique', 'Bactérienne seulement', 'Animale'], 3, 'Il est stocké dans le foie et les muscles.'],
            ['Le désoxyribose diffère du ribose par…', ['Un carbone en plus', 'Une fonction cétone', 'Un –OH en moins sur le carbone 2', 'Un groupe phosphate'], 2, 'D’où son nom : désoxy- signifie « un oxygène en moins ».'],
            ['Dans une projection de Fischer, la lettre D signifie que le –OH de l’avant-dernier carbone est…', ['À droite', 'À gauche', 'En haut', 'Absent'], 0, 'C’est la convention qui définit la série D des oses.'],
            ['L’amidon et la cellulose sont tous deux des polymères de glucose.', ['Vrai', 'Faux'], 0, 'Ils ne diffèrent que par l’orientation des liaisons osidiques, ce qui suffit à rendre la cellulose indigestible pour nous.'],
            ['Le groupe –COOH caractérise la fonction…', ['Alcool', 'Acide carboxylique', 'Aldéhyde', 'Ester'], 1, 'On le retrouve dans les acides aminés et les acides gras.'],
            ['L’hydrolyse d’un oside donne du glucose et du galactose. Il s’agit…', ['Du maltose', 'Du lactose', 'Du saccharose', 'De l’amidon'], 1, 'Le lactose du lait est formé de galactose et de glucose.'],
            ['Un holoside est un oside formé…', ['D’oses et de protéines', 'D’un seul ose', 'D’oses et de lipides', 'Uniquement d’oses'], 3, 'Maltose, saccharose, amidon et glycogène sont des holosides.'],
            ['Le D-ribose est un aldopentose qui entre dans la composition…', ['De l’ARN', 'De l’ADN', 'De l’amidon', 'Du glycogène'], 0, 'Le ribose est l’ose de l’ARN ; l’ADN contient du désoxyribose.'],
          ],
        },
        {
          titre: 'Acides aminés et protéines',
          axe: 'A – Relations structures et propriétés des biomolécules',
          lecon: {
            titre: 'Vingt briques et une forme',
            cours: `Les **protéines** font presque tout dans la cellule : elles catalysent (enzymes), transportent (hémoglobine), reçoivent des signaux (récepteurs), défendent (anticorps). Leur fonction dépend de leur **forme**, et leur forme dépend de leur **séquence**.

## L’acide α-aminé
Un acide aminé porte, sur le même carbone (le **carbone α**) :
- une fonction **amine** –NH₂ ;
- une fonction **acide carboxylique** –COOH ;
- un atome d’hydrogène ;
- un **radical R**, différent pour chacun des 20 acides aminés.

Le carbone α porte quatre groupes différents : il est **asymétrique** (sauf pour la glycine, dont R = H). Il existe donc deux formes, images l’une de l’autre dans un miroir ; les protéines n’utilisent que les acides aminés de la **série L** (en projection de Fischer, –NH₂ à gauche).

## Cinq acides aminés à reconnaître
| Acide aminé | Radical | Propriété |
| **Valine** | chaîne carbonée ramifiée | **hydrophobe** |
| **Sérine** | –CH₂–OH | polaire, hydrophile |
| **Cystéine** | –CH₂–SH | forme des **ponts disulfure** |
| **Lysine** | chaîne terminée par –NH₂ | chargée **+** à pH 7 |
| **Acide glutamique** | chaîne terminée par –COOH | chargé **−** à pH 7 |

## La liaison peptidique
Deux acides aminés se lient par une **liaison peptidique** (–CO–NH–, une fonction amide) entre le –COOH de l’un et le –NH₂ du suivant, avec élimination d’eau. Une chaîne a un sens : on l’écrit de l’extrémité **N-terminale** (–NH₂ libre) vers l’extrémité **C-terminale** (–COOH libre). L’ordre des acides aminés est la **structure primaire**.

## La structure tridimensionnelle
La chaîne se replie grâce à des liaisons entre radicaux :
| Liaison | Entre | Force |
| **Pont disulfure** | deux cystéines | covalente, solide |
| **Liaison ionique** | radicaux de charges opposées (Lys⁺/Glu⁻) | faible |
| **Liaison hydrogène** | groupes polaires | faible |
| **Interactions hydrophobes** | radicaux apolaires regroupés au cœur de la protéine | faibles |

> La forme d’une protéine tient surtout à des **liaisons faibles**. Une hausse de température ou un pH extrême les rompt : la protéine est **dénaturée** et perd sa fonction, même si sa séquence est intacte.

## Exemple : l’hémoglobine S
Dans la drépanocytose, un acide glutamique (chargé, hydrophile) est remplacé par une valine (hydrophobe) à la surface de l’hémoglobine. Ces valines « collantes » associent les molécules entre elles en longues fibres : un seul acide aminé change, toute la fonction s’effondre.`,
          },
          questions: [
            ['Quelles fonctions un acide α-aminé porte-t-il sur son carbone α ?', ['Deux fonctions alcool', 'Une fonction aldéhyde et une fonction cétone', 'Une fonction amine et une fonction acide carboxylique', 'Une fonction ester'], 2, 'D’où son nom : acide (–COOH) aminé (–NH₂).'],
            ['Quel acide aminé forme des ponts disulfure ?', ['La valine', 'La sérine', 'La cystéine', 'La lysine'], 2, 'Son radical porte un groupe –SH ; deux –SH peuvent se lier par une liaison covalente S–S.'],
            ['La liaison peptidique relie…', ['Le –COOH d’un acide aminé et le –NH₂ du suivant', 'Deux oses', 'Deux radicaux R', 'Deux cystéines'], 0, 'C’est une fonction amide, formée avec élimination d’eau.'],
            ['La structure primaire d’une protéine est…', ['Sa forme en 3D', 'Sa masse', 'Le nombre de ponts disulfure', 'La séquence de ses acides aminés'], 3, 'Elle est lue de l’extrémité N-terminale vers l’extrémité C-terminale.'],
            ['La valine est un acide aminé…', ['Chargé positivement', 'Hydrophobe', 'Chargé négativement', 'Soufré'], 1, 'Son radical est une chaîne carbonée sans groupe polaire.'],
            ['À pH 7, la lysine est chargée…', ['Négativement', 'Doublement négativement', 'Elle est neutre', 'Positivement'], 3, 'Son radical se termine par une fonction amine, protonée en –NH₃⁺.'],
            ['Les protéines humaines sont formées d’acides aminés de la série L.', ['Vrai', 'Faux'], 0, 'En projection de Fischer, leur –NH₂ est à gauche du carbone α.'],
            ['Pourquoi le carbone α est-il asymétrique (sauf pour la glycine) ?', ['Il est chargé', 'Il porte deux hydrogènes', 'Il porte quatre groupes différents', 'Il est lié à un soufre'], 2, 'Un carbone asymétrique porte quatre substituants tous différents.'],
            ['Une protéine dénaturée par la chaleur…', ['A perdu sa forme tridimensionnelle', 'A perdu sa séquence', 'Est devenue un glucide', 'Fonctionne mieux'], 0, 'Les liaisons faibles sont rompues ; la séquence, tenue par des liaisons covalentes, reste intacte.'],
            ['Dans une protéine soluble, les radicaux hydrophobes sont plutôt…', ['À la surface, au contact de l’eau', 'Regroupés au cœur de la protéine', 'Absents', 'Liés à l’ADN'], 1, 'Ils fuient l’eau : ces interactions hydrophobes stabilisent le repliement.'],
            ['Une liaison ionique dans une protéine peut s’établir entre…', ['Deux valines', 'Une lysine et un acide glutamique', 'Deux sérines', 'Une glycine et une valine'], 1, 'Charges opposées : le radical + de la lysine attire le radical − de l’acide glutamique.'],
            ['Quel acide aminé n’a pas de carbone asymétrique ?', ['La sérine', 'La cystéine', 'La lysine', 'La glycine'], 3, 'Son radical est un simple H : le carbone α porte deux H.'],
          ],
        },
        {
          titre: 'Lipides et membranes biologiques',
          axe: 'A – Relations structures et propriétés des biomolécules',
          lecon: {
            titre: 'Des molécules qui fuient l’eau',
            cours: `Les **lipides** sont définis par une propriété plus que par une structure : ils sont **peu solubles dans l’eau** et solubles dans les solvants organiques. Cette propriété vient de leurs longues chaînes carbonées apolaires.

## Polarité et interactions avec l’eau
Dans une liaison entre deux atomes d’**électronégativité** différente (O–H, N–H), les électrons sont attirés vers le plus électronégatif : la liaison est **polaire**. Les zones polaires forment des **liaisons hydrogène** avec l’eau : elles sont **hydrophiles**. Les chaînes C–H, apolaires, sont **hydrophobes**.

## Les acides gras
Un **acide gras** est une longue chaîne carbonée (souvent 16 ou 18 C) terminée par une fonction acide carboxylique.
| Type | Double liaison C=C | Exemple | État à 20 °C |
| **Saturé** | aucune | acide palmitique C16:0, acide stéarique C18:0 | solide (beurre) |
| **Mono-insaturé** | une | acide oléique C18:1 (9) | liquide (huile d’olive) |
| **Poly-insaturé** | plusieurs | acide linoléique C18:2 (9,12) | liquide |

**Nomenclature** : C18:1 (9) se lit « 18 carbones, 1 double liaison, qui part du carbone 9 », en numérotant depuis le carbone de la fonction acide (carbone 1). La double liaison crée un coude dans la chaîne, qui gêne l’empilement des molécules : d’où l’état liquide des huiles.

## Les triglycérides
Un **triglycéride** est l’ester du **glycérol** (trois fonctions alcool) et de **trois acides gras**. C’est la forme de réserve (tissu adipeux) : totalement hydrophobe.

## Les phospholipides, molécules amphiphiles
Un **phospholipide** porte deux acides gras (queues hydrophobes) et un groupement phosphate (tête hydrophile). Il est **amphiphile**. Dans l’eau, les molécules amphiphiles s’organisent spontanément :
- en **micelles** (queues vers l’intérieur), surtout celles à une seule chaîne (acides gras, savons) ;
- en **bicouche** : deux couches, têtes vers l’eau, queues face à face — c’est l’organisation typique des phospholipides.

> La **membrane plasmique** est une bicouche phospholipidique dans laquelle sont insérées des protéines. Les petites molécules apolaires la traversent ; les ions et les grosses molécules polaires ont besoin de protéines.

## Transporteur et récepteur
| Protéine membranaire | Rôle | Exemple |
| **Transporteur** | fait **passer** une molécule d’un côté à l’autre | transporteur du glucose, aquaporine |
| **Récepteur** | **fixe** un messager sans le faire entrer, et déclenche une réponse | récepteur de l’insuline |

## Le noyau stérane
Le **cholestérol** porte un noyau à quatre cycles, le **noyau stérane**. On le retrouve dans les **hormones stéroïdes** (testostérone, œstrogènes, progestérone) : ce noyau permet de les reconnaître d’un coup d’œil ; la **vitamine D** en dérive aussi, avec un cycle ouvert. Le cholestérol est aussi un constituant des membranes animales.`,
          },
          questions: [
            ['Un acide gras saturé…', ['Ne possède aucune double liaison C=C', 'Possède au moins une double liaison C=C', 'Est toujours liquide', 'Contient un noyau stérane'], 0, 'Saturé en hydrogène : toutes ses liaisons carbone-carbone sont simples.'],
            ['Que signifie la notation C18:1 (9) ?', ['9 carbones et 18 hydrogènes', '18 doubles liaisons', '18 carbones, 1 double liaison partant du carbone 9', '1 carbone et 9 oxygènes'], 2, 'On numérote depuis le carbone de la fonction acide carboxylique.'],
            ['Un triglycéride est formé de…', ['Trois glycérols', 'Glucose et trois acides gras', 'Glycérol et trois acides gras', 'Un phosphate et deux acides gras'], 2, 'C’est un triester du glycérol : la forme de réserve des lipides.'],
            ['Une molécule amphiphile possède…', ['Une partie hydrophile et une partie hydrophobe', 'Uniquement une partie hydrophobe', 'Uniquement une partie hydrophile', 'Un noyau stérane'], 0, 'Le phospholipide a une tête hydrophile et deux queues hydrophobes.'],
            ['Dans une bicouche phospholipidique, les queues hydrophobes sont…', ['Tournées vers l’eau', 'Liées à l’ADN', 'À l’extérieur de la cellule', 'Face à face au centre de la membrane'], 3, 'Elles fuient l’eau et se regroupent au cœur de la bicouche.'],
            ['Quelle molécule contient un noyau stérane ?', ['L’acide oléique', 'La testostérone', 'Le glycérol', 'Le glucose'], 1, 'Les hormones stéroïdes dérivent du cholestérol et en gardent le noyau à quatre cycles.'],
            ['Une liaison O–H est polaire parce que…', ['Elle est ionique', 'Elle est double', 'Elle contient du carbone', 'L’oxygène est plus électronégatif que l’hydrogène'], 3, 'L’oxygène attire les électrons de la liaison : il porte une charge partielle négative.'],
            ['Un récepteur membranaire fait entrer son messager dans la cellule.', ['Vrai', 'Faux'], 1, 'Il le fixe et déclenche une réponse ; c’est le transporteur qui fait traverser une molécule.'],
            ['Pourquoi les huiles sont-elles liquides à 20 °C ?', ['Elles contiennent de l’eau', 'Elles n’ont pas d’acides gras', 'Leurs acides gras insaturés, coudés, s’empilent mal', 'Elles sont chauffées'], 2, 'Les doubles liaisons coudent les chaînes et empêchent un empilement serré.'],
            ['Une aquaporine est…', ['Un transporteur d’eau', 'Un récepteur hormonal', 'Un phospholipide', 'Une hormone'], 0, 'C’est un canal protéique qui laisse passer l’eau à travers la membrane.'],
            ['Quelle molécule traverse facilement la bicouche lipidique sans protéine ?', ['Un ion Na⁺', 'Une petite molécule apolaire comme le dioxygène', 'Le glucose', 'Une protéine'], 1, 'Le cœur hydrophobe de la bicouche laisse passer les petites molécules apolaires.'],
            ['Les zones hydrophiles d’une biomolécule interagissent avec l’eau par…', ['Des ponts disulfure', 'Des liaisons hydrogène', 'Des liaisons peptidiques', 'Des liaisons osidiques'], 1, 'Les groupes polaires (–OH, –NH, C=O) forment des liaisons hydrogène avec l’eau.'],
          ],
        },
        {
          titre: 'Les acides nucléiques : ADN et ARN',
          axe: 'A – Relations structures et propriétés des biomolécules',
          lecon: {
            titre: 'Quatre lettres et deux brins',
            cours: `L’information génétique est écrite dans un alphabet de quatre lettres, porté par les **acides nucléiques**. Leur structure explique à la fois qu’ils portent une information et qu’ils puissent être copiés.

## Le nucléotide
Un **nucléotide** est formé de trois parties :
1. un **groupement phosphate** ;
2. un **ose** à cinq carbones : **désoxyribose** dans l’ADN, **ribose** dans l’ARN ;
3. une **base azotée**.

| Base | Lettre | Dans l’ADN | Dans l’ARN |
| Adénine | A | oui | oui |
| Guanine | G | oui | oui |
| Cytosine | C | oui | oui |
| Thymine | T | oui | non |
| Uracile | U | non | oui |

## Le brin et son orientation
Les nucléotides se lient par des **liaisons phosphodiester** entre le phosphate de l’un et l’ose du suivant. Un brin a donc deux extrémités différentes, **5'** (phosphate libre) et **3'** (–OH libre) : on écrit toujours une séquence de 5' vers 3', par exemple 5'-ATGCCA-3'.

## La double hélice d’ADN
L’ADN est formé de **deux brins** enroulés en hélice :
- ils sont **complémentaires** : A face à T (**deux** liaisons hydrogène), G face à C (**trois** liaisons hydrogène) ;
- ils sont **antiparallèles** : l’un va de 5' en 3', l’autre de 3' en 5'.

> Connaître un brin, c’est connaître l’autre. La séquence 5'-ATGC-3' a pour brin complémentaire 3'-TACG-5', soit, écrit dans le sens conventionnel, 5'-GCAT-3'.

## ADN et ARN comparés
| | ADN | ARN |
| Ose | désoxyribose | ribose |
| Bases | A, T, G, C | A, **U**, G, C |
| Brins | deux | un seul |
| Taille | très long (des millions de nucléotides) | court |
| Lieu | noyau (et mitochondries) | noyau et cytoplasme |
| Rôle | stocker l’information | la transmettre (ARN messager) |

## L’hybridation moléculaire
Les liaisons hydrogène sont **faibles** : en chauffant vers 90 °C, les deux brins se séparent (**dénaturation**) ; en refroidissant, les brins complémentaires se réassocient. Deux brins d’origines différentes mais complémentaires peuvent s’apparier : c’est l’**hybridation moléculaire**, qui permet de repérer une séquence précise avec une **sonde**. Un ADN riche en G-C résiste mieux à la chaleur, car chaque paire G-C compte une liaison hydrogène de plus.

## Exemple
Un fragment d’ADN double brin de 100 paires de bases contient 30 % d’adénine. Il contient donc 30 % de thymine (A = T), et 40 % à se partager en G et C, soit 20 % de guanine et 20 % de cytosine.`,
          },
          questions: [
            ['Un nucléotide est formé de…', ['Un ose et un phosphate seulement', 'Un acide aminé et un ose', 'Trois acides gras et un glycérol', 'Un phosphate, un ose et une base azotée'], 3, 'Ce sont les trois composants de chaque « lettre » de l’ADN ou de l’ARN.'],
            ['Quelle base remplace la thymine dans l’ARN ?', ['L’uracile', 'La cytosine', 'L’adénine', 'La guanine'], 0, 'L’ARN utilise A, U, G et C.'],
            ['Dans l’ADN, la guanine s’apparie avec…', ['L’adénine', 'La thymine', 'La cytosine', 'L’uracile'], 2, 'G-C, avec trois liaisons hydrogène.'],
            ['Les deux brins d’ADN sont antiparallèles.', ['Vrai', 'Faux'], 0, 'L’un va de 5′ en 3′, l’autre de 3′ en 5′.'],
            ['Quel est le brin complémentaire de 5′-AATG-3′, écrit de 5′ vers 3′ ?', ['5′-TTAC-3′', '5′-GTAA-3′', '5′-CATT-3′', '5′-AATG-3′'], 2, 'Complémentaire : 3′-TTAC-5′, qu’on réécrit de 5′ vers 3′ : 5′-CATT-3′.'],
            ['Quel ose contient l’ADN ?', ['Le désoxyribose', 'Le ribose', 'Le glucose', 'Le fructose'], 0, 'ADN = acide désoxyribonucléique.'],
            ['Les nucléotides d’un brin sont reliés par des liaisons…', ['Peptidiques', 'Disulfure', 'Osidiques', 'Phosphodiester'], 3, 'Elles relient le phosphate d’un nucléotide à l’ose du suivant.'],
            ['Pourquoi un ADN riche en G-C se dénature-t-il à plus haute température ?', ['G et C sont plus lourds', 'Les paires G-C comptent trois liaisons hydrogène', 'Il est plus court', 'Il contient de l’uracile'], 1, 'Il faut plus d’énergie pour rompre trois liaisons hydrogène que deux.'],
            ['Un ADN contient 30 % d’adénine. Quel est son pourcentage de guanine ?', ['30 %', '70 %', '40 %', '20 %'], 3, 'A = T = 30 %, il reste 40 % pour G + C, avec G = C = 20 %.'],
            ['L’hybridation moléculaire repose sur…', ['La liaison osidique', 'Les ponts disulfure', 'La complémentarité des bases', 'Les interactions ioniques des protéines'], 2, 'Deux brins complémentaires se réassocient par liaisons hydrogène : une sonde repère ainsi sa séquence cible.'],
            ['L’ARN messager est en général…', ['Simple brin et court', 'Double brin et très long', 'Circulaire', 'Fait d’acides aminés'], 0, 'Il ne copie qu’un gène, sous la forme d’un seul brin.'],
            ['Par convention, une séquence nucléotidique s’écrit…', ['De 3′ vers 5′', 'De 5′ vers 3′', 'De la base la plus lourde à la plus légère', 'Dans n’importe quel sens'], 1, 'C’est aussi le sens dans lequel les brins sont synthétisés.'],
          ],
        },
        {
          titre: 'La cellule, les échelles et l’imagerie médicale',
          axe: 'B – Relations structures et fonctions physiologiques',
          lecon: {
            titre: 'De l’organe à l’organite',
            cours: `Le vivant s’organise en niveaux emboîtés : **organisme → appareil → organe → tissu → cellule → organite → molécule**. Chaque niveau a sa taille, et chaque taille son outil d’observation.

## Ordres de grandeur
| Objet | Taille | Outil |
| Organe (rein) | ≈ 10 cm | œil, imagerie médicale |
| Cellule animale | 10 à 100 µm | microscope optique |
| Bactérie | 1 à 5 µm | microscope optique (limite) |
| Mitochondrie | ≈ 1 µm | microscope électronique pour les détails |
| Virus | 20 à 300 nm | microscope électronique |
| Membrane plasmique | ≈ 7 nm | microscope électronique |

Rappels : 1 mm = 1 000 µm ; 1 µm = 1 000 nm. Le **microscope optique** ne distingue pas deux points séparés de moins de 0,2 µm environ ; le **microscope électronique** descend au nanomètre.

## La cellule eucaryote et ses organites
| Organite | Rôle |
| **Noyau** | protège l’ADN ; enveloppe nucléaire double percée de **pores nucléaires** |
| **Réticulum endoplasmique rugueux** | synthèse des protéines destinées à la sécrétion (ribosomes accrochés) |
| **Appareil de Golgi** | modifie et emballe les protéines dans des **vésicules** |
| **Mitochondrie** | respiration cellulaire, production d’ATP |
| **Membrane plasmique** | limite et échanges |

La voie de **sécrétion** suit l’ordre : ribosome → réticulum → Golgi → vésicule → **exocytose** (la vésicule fusionne avec la membrane et libère son contenu).

Une cellule **procaryote** (bactérie) n’a ni noyau ni organites membranaires : son ADN est libre dans le cytoplasme.

## Les tissus épithéliaux
Un épithélium est un tissu de cellules jointives, posé sur une **membrane basale**. Les épithéliums de l’intestin, du néphron ou des glandes exocrines ont des cellules **polarisées** (face apicale / face basale), reliées par des **jonctions serrées** : leur structure est adaptée à l’absorption ou à la sécrétion.

## Le noyau dans la mitose
Pendant la mitose, l’enveloppe nucléaire se fragmente, les chromosomes condensés se séparent, puis deux enveloppes se reforment : le noyau protège l’ADN hors division et se réorganise pour la division.

## Choisir une technique d’imagerie
| Technique | Principe | Ce qu’on voit bien |
| **Radiographie** | rayons X absorbés par les tissus denses | **os** (blancs), tissus mous peu contrastés |
| **Échographie** | ultrasons réfléchis aux interfaces | **tissus mous** : ovaires, fœtus, reins |
| Produit de contraste | substance opaque aux rayons X injectée ou avalée | vaisseaux, tube digestif |

> On choisit l’imagerie selon le tissu : les rayons X pour ce qui est dense (os), les ultrasons pour les organes mous, sans rayonnement ionisant (donc pendant la grossesse).

## Exemple de calcul
Sur une microphotographie agrandie 1 000 fois, une cellule mesure 25 mm. Sa taille réelle est 25 mm / 1 000 = 0,025 mm = **25 µm**.`,
          },
          questions: [
            ['Quelle est la taille typique d’une cellule animale ?', ['10 à 100 nm', '10 à 100 µm', '1 à 10 mm', '1 à 10 cm'], 1, 'On l’observe facilement au microscope optique.'],
            ['Pour observer la structure d’un virus, on utilise…', ['Une loupe', 'Un microscope optique', 'Une radiographie', 'Un microscope électronique'], 3, 'Les virus mesurent quelques dizaines à quelques centaines de nanomètres.'],
            ['Quel organite modifie et emballe les protéines dans des vésicules ?', ['L’appareil de Golgi', 'La mitochondrie', 'Le noyau', 'Le ribosome libre'], 0, 'Les protéines venues du réticulum y sont triées puis expédiées.'],
            ['L’exocytose est…', ['L’entrée de molécules dans la cellule', 'La division du noyau', 'La libération du contenu d’une vésicule hors de la cellule', 'La synthèse d’ATP'], 2, 'La membrane de la vésicule fusionne avec la membrane plasmique.'],
            ['Une bactérie possède un noyau entouré d’une enveloppe.', ['Vrai', 'Faux'], 1, 'C’est une cellule procaryote : son ADN est libre dans le cytoplasme.'],
            ['Sur un cliché agrandi 500 fois, une cellule mesure 10 mm. Sa taille réelle est…', ['50 µm', '5 µm', '20 µm', '2 µm'], 2, '10 mm / 500 = 0,02 mm = 20 µm.'],
            ['La radiographie aux rayons X montre surtout…', ['Les os', 'Les tissus mous', 'Les ovaires', 'Les cellules'], 0, 'Les tissus denses absorbent les rayons X et apparaissent blancs.'],
            ['Pourquoi suit-on une grossesse par échographie plutôt que par radiographie ?', ['L’échographie montre mieux les os', 'Les rayons X ne traversent pas le corps', 'La radiographie est trop lente', 'Les ultrasons ne sont pas ionisants et montrent les tissus mous'], 3, 'Pas de rayonnement ionisant pour le fœtus, et de bons contrastes pour les tissus mous.'],
            ['Les pores nucléaires se trouvent…', ['Dans la membrane plasmique', 'Dans l’enveloppe du noyau', 'Dans la mitochondrie', 'Dans l’appareil de Golgi'], 1, 'Ils permettent les échanges entre noyau et cytoplasme, par exemple la sortie des ARN messagers.'],
            ['Un épithélium repose sur…', ['Un pore nucléaire', 'Un chromosome', 'Un produit de contraste', 'Une membrane basale'], 3, 'La membrane basale sépare l’épithélium du tissu conjonctif sous-jacent.'],
            ['1 µm vaut…', ['1 000 mm', '100 nm', '1 000 nm', '10 nm'], 2, '1 µm = 10⁻⁶ m et 1 nm = 10⁻⁹ m.'],
            ['Dans quel ordre une protéine sécrétée circule-t-elle ?', ['Réticulum → Golgi → vésicule → exocytose', 'Golgi → réticulum → vésicule', 'Noyau → mitochondrie → Golgi', 'Vésicule → réticulum → noyau'], 0, 'C’est la voie de sécrétion, observée par autoradiographie.'],
          ],
        },
        {
          titre: 'Le milieu intérieur et l’homéostasie',
          axe: 'C – Milieu intérieur et homéostasie',
          lecon: {
            titre: 'Un océan intérieur à entretenir',
            cours: `Nos cellules baignent dans un liquide dont la composition doit rester stable : le **milieu intérieur**. Le maintenir constant malgré les perturbations, c’est l’**homéostasie**.

## Les compartiments liquidiens
L’eau représente environ 60 % de la masse d’un adulte. Elle se répartit en :
| Compartiment | Part de l’eau totale | Contenu |
| **Liquide intracellulaire** | ≈ 2/3 | dans les cellules, riche en K⁺ |
| **Liquide interstitiel** | ≈ 1/4 | entre les cellules, riche en Na⁺ |
| **Plasma** | ≈ 1/12 | partie liquide du sang, riche en Na⁺ et en protéines |
| **Lymphe canalisée** | faible | dans les vaisseaux lymphatiques |

Liquide interstitiel, plasma et lymphe forment le **liquide extracellulaire** : c’est lui, le milieu intérieur.

## Des compositions différentes
| Constituant | Plasma | Liquide interstitiel | Liquide intracellulaire |
| Na⁺ | élevé | élevé | faible |
| K⁺ | faible | faible | élevé |
| Protéines | élevées | faibles | élevées |

Le liquide interstitiel ressemble au plasma sans ses grosses protéines, qui ne traversent pas la paroi des capillaires. Le sang contient aussi des **cellules sanguines** (globules rouges et blancs, plaquettes). Chaque constituant a une **valeur de référence**, un **intervalle physiologique** (par exemple 135–145 mmol·L⁻¹ pour Na⁺ dans le plasma) : un bilan sanguin compare les résultats à ces intervalles.

## Les échanges entre compartiments
- Au niveau des capillaires, le plasma filtre vers le liquide interstitiel ; l’excédent retourne au sang par la **lymphe**.
- Entre liquide interstitiel et cellule, la **membrane cellulaire** trie : **diffusion** (O₂, CO₂), transport par **transporteur** passif ou actif (glucose, ions), **osmose** pour l’eau.

L’**osmose** est le passage de l’eau à travers une membrane vers le compartiment le plus concentré en solutés. Un globule rouge placé dans de l’eau pure gonfle et éclate ; dans une solution très salée, il se ratatine.

## La boucle de régulation
> Toute homéostasie repose sur la même boucle : une **grandeur régulée** est comparée à une **valeur de consigne** par des **capteurs** ; en cas d’écart, un centre commande des **effecteurs** dont la **réponse** ramène la grandeur à la consigne : c’est une **rétroaction négative**.

| Élément | Glycémie | Volume d’eau (volémie) |
| Grandeur régulée | glycémie | volume et concentration du plasma |
| Capteurs | cellules du pancréas | capteurs de l’hypothalamus |
| Messager | insuline, glucagon | ADH |
| Effecteurs | foie, muscles, tissu adipeux | rein (tube collecteur) |

## Exemple : l’hyperglycémie provoquée
Après ingestion de glucose, la glycémie monte (perturbation), l’insuline est libérée (réponse), la glycémie redescend (correction) : on voit la boucle fonctionner en temps réel. Quand un maillon est défaillant (pas d’insuline), la perturbation n’est plus corrigée : c’est une **pathologie**.`,
          },
          questions: [
            ['Le milieu intérieur est constitué…', ['Du liquide intracellulaire', 'Du liquide extracellulaire : plasma, liquide interstitiel, lymphe', 'Du contenu du tube digestif', 'De l’urine'], 1, 'C’est le liquide qui baigne les cellules.'],
            ['Quel ion est le plus concentré dans le liquide intracellulaire ?', ['Na⁺', 'K⁺', 'Cl⁻', 'Ca²⁺'], 1, 'Les cellules sont riches en potassium, le milieu extracellulaire en sodium.'],
            ['Le liquide interstitiel diffère du plasma surtout par…', ['Sa richesse en globules rouges', 'Sa richesse en K⁺', 'Son absence d’eau', 'Sa pauvreté en grosses protéines'], 3, 'Les grosses protéines plasmatiques ne traversent pas la paroi des capillaires.'],
            ['Environ quelle part de l’eau de l’organisme est dans les cellules ?', ['2/3', '1/4', '1/12', 'La totalité'], 0, 'Le liquide intracellulaire est de loin le plus grand compartiment.'],
            ['Un globule rouge placé dans de l’eau pure…', ['Se ratatine', 'Ne change pas', 'Gonfle et peut éclater', 'Se divise'], 2, 'L’eau entre par osmose vers le compartiment le plus concentré, ici la cellule.'],
            ['Dans une boucle de régulation, la valeur de consigne est…', ['La réponse de l’effecteur', 'La perturbation', 'La valeur de référence autour de laquelle la grandeur est maintenue', 'Le capteur'], 2, 'La grandeur régulée est comparée en permanence à cette valeur.'],
            ['La lymphe ramène au sang une partie du liquide interstitiel.', ['Vrai', 'Faux'], 0, 'Elle draine l’excédent de liquide sorti des capillaires.'],
            ['Dans la régulation de l’eau, quel organe est l’effecteur ?', ['Le rein', 'Le pancréas', 'Le cœur', 'Le foie'], 0, 'Sous l’effet de l’ADH, le tube collecteur réabsorbe plus ou moins d’eau.'],
            ['Un intervalle physiologique permet…', ['De dater un fossile', 'De mesurer la taille d’une cellule', 'De classer les bactéries', 'De diagnostiquer un écart à la normale dans un bilan sanguin'], 3, 'Un résultat hors de l’intervalle de référence signale un dysfonctionnement possible.'],
            ['Le dioxygène traverse la membrane cellulaire par…', ['Transport actif', 'Diffusion', 'Exocytose', 'Osmose'], 1, 'Petite molécule apolaire, il suit son gradient à travers la bicouche.'],
            ['L’homéostasie repose sur une rétroaction…', ['Positive', 'Aléatoire', 'Absente', 'Négative'], 3, 'La réponse corrige l’écart à la consigne au lieu de l’amplifier.'],
            ['Quel liquide contient des globules rouges ?', ['Le liquide interstitiel', 'La lymphe canalisée', 'Le sang', 'Le liquide intracellulaire'], 2, 'Les globules rouges restent dans les vaisseaux sanguins ; seul le plasma filtre vers les tissus.'],
          ],
        },
        {
          titre: 'De l’ADN à la protéine : transcription, traduction, mutations',
          axe: 'D – Information et communication',
          lecon: {
            titre: 'Lire un gène',
            cours: `Un gène n’agit pas directement : son information est d’abord **copiée** en ARN messager, puis **traduite** en protéine. C’est l’**expression génétique**.

## La transcription, dans le noyau
L’**ARN polymérase** ouvre la double hélice et synthétise un **ARN messager** (ARNm) complémentaire du **brin transcrit** de l’ADN, en remplaçant T par U. L’ARNm a donc la même séquence que l’autre brin, le **brin non transcrit** (ou brin codant), avec U à la place de T.

Exemple :
- brin transcrit : 3'-TAC GGA TTC-5'
- ARNm : 5'-AUG CCU AAG-3'

L’ARNm quitte le noyau par les pores nucléaires.

## La traduction, dans le cytoplasme
Les **ribosomes** lisent l’ARNm par groupes de trois nucléotides, les **codons**. Chaque codon correspond à un acide aminé selon le **code génétique** :
- la lecture commence au codon **AUG** (méthionine) : il fixe le **cadre de lecture** ;
- elle s’arrête à un **codon stop** (UAA, UAG, UGA), qui ne code aucun acide aminé ;
- le code est **redondant** : 64 codons pour 20 acides aminés, plusieurs codons pour un même acide aminé.

Avec l’ARNm ci-dessus : AUG → Met, CCU → Pro, AAG → Lys. Peptide : **Met-Pro-Lys**.

## Les mutations ponctuelles
Une **mutation** est une modification de la séquence de l’ADN. L’**allèle sauvage** est l’allèle de référence.
| Mutation | Effet sur la protéine | Exemple |
| **Silencieuse** | aucun : le nouveau codon code le même acide aminé | CCU → CCC, toujours Pro |
| **Faux-sens** | un acide aminé remplacé par un autre | GAG → GUG : Glu → Val (drépanocytose) |
| **Non-sens** | apparition d’un codon stop : protéine **tronquée** | AAG → UAG |
| **Décalage du cadre de lecture** (addition ou délétion d’un nucléotide) | tous les codons suivants changent | protéine souvent **non fonctionnelle** |

> Une mutation modifie le **génotype** ; elle ne modifie le **phénotype** que si elle change la protéine, et seulement si ce changement touche sa fonction.

## Méthode d’exercice
1. Écris l’ARNm à partir du brin transcrit (complémentaire, U à la place de T), ou recopie le brin non transcrit en changeant T en U.
2. Repère l’AUG initiateur et découpe en codons.
3. Traduis avec le tableau du code génétique jusqu’au codon stop.
4. Compare séquence sauvage et séquence mutée, codon par codon, et nomme la mutation.

Les expériences historiques l’ont montré : l’ARN radioactif fabriqué dans le noyau migre ensuite vers le cytoplasme, où se fabriquent les protéines ; c’est l’ARN messager qui fait le lien.`,
          },
          questions: [
            ['Où a lieu la transcription chez les eucaryotes ?', ['Dans le noyau', 'Dans le cytoplasme', 'Dans le ribosome', 'Dans l’appareil de Golgi'], 0, 'L’ARNm est fabriqué dans le noyau, puis sort par les pores nucléaires.'],
            ['Quelle enzyme synthétise l’ARN messager ?', ['L’ADN polymérase', 'L’ARN polymérase', 'La ligase', 'L’amylase'], 1, 'Elle copie le brin transcrit de l’ADN en ARN.'],
            ['Un codon est formé de…', ['Un nucléotide', 'Trois nucléotides', 'Deux nucléotides', 'Un acide aminé'], 1, 'Chaque triplet de l’ARNm correspond à un acide aminé ou à un signal stop.'],
            ['Le codon AUG…', ['Est un codon stop', 'Code la valine', 'Ne code rien', 'Initie la traduction et code la méthionine'], 3, 'Il fixe le cadre de lecture.'],
            ['Le brin transcrit est 3′-TAC-5′. Quel est le codon de l’ARNm ?', ['5′-AUG-3′', '5′-ATG-3′', '5′-UAC-3′', '5′-TAC-3′'], 0, 'Complémentaire du brin transcrit, avec U à la place de T.'],
            ['Une mutation non-sens…', ['Ne change rien à la protéine', 'Remplace un acide aminé par un autre', 'Fait apparaître un codon stop prématuré', 'Ajoute un gène'], 2, 'La protéine est tronquée, souvent non fonctionnelle.'],
            ['Grâce à la redondance du code génétique, certaines mutations sont silencieuses.', ['Vrai', 'Faux'], 0, 'Plusieurs codons codent le même acide aminé : la protéine reste identique.'],
            ['La mutation de la drépanocytose (Glu → Val) est une mutation…', ['Silencieuse', 'Non-sens', 'Faux-sens', 'Par décalage du cadre de lecture'], 2, 'Un acide aminé est remplacé par un autre.'],
            ['Pourquoi la délétion d’un seul nucléotide a-t-elle souvent des effets graves ?', ['Elle décale le cadre de lecture : tous les codons suivants changent', 'Elle détruit l’ARN polymérase', 'Elle supprime un chromosome', 'Elle empêche la transcription'], 0, 'La lecture par triplets est décalée à partir de la mutation.'],
            ['Où se fait la traduction ?', ['Dans le noyau', 'Dans la membrane plasmique', 'Dans les mitochondries uniquement', 'Sur les ribosomes du cytoplasme'], 3, 'Les ribosomes lisent l’ARNm et assemblent les acides aminés.'],
            ['L’ARNm 5′-AUG CCU AAG UAA-3′ donne le peptide…', ['Met-Pro-Lys-Stop-Met', 'Met-Pro-Lys', 'Pro-Lys', 'Met-Lys-Pro'], 1, 'UAA est un codon stop : il arrête la traduction sans ajouter d’acide aminé.'],
            ['Combien de codons comporte le code génétique ?', ['20', '61', '4', '64'], 3, '4³ = 64 codons : 61 codent des acides aminés, 3 sont des codons stop.'],
          ],
        },
        {
          titre: 'Réplication de l’ADN, mitose et cycle cellulaire',
          axe: 'D – Information et communication',
          lecon: {
            titre: 'Copier avant de partager',
            cours: `Avant de se diviser, une cellule doit **doubler** son ADN, puis le **répartir** exactement entre ses deux cellules filles. C’est ainsi que toutes nos cellules somatiques portent la même information génétique.

## Le cycle cellulaire
| Phase | Durée relative | Ce qui se passe |
| **G1** | longue | croissance, activité normale ; chromosomes à 1 chromatide |
| **S** | quelques heures | **réplication** de l’ADN : chaque chromosome passe à 2 chromatides |
| **G2** | courte | préparation de la division |
| **M (mitose)** | environ 1 h | séparation des chromatides |

G1, S et G2 forment l’**interphase**.

## La réplication
L’**hélicase** sépare les deux brins, puis l’**ADN polymérase** fabrique, face à chacun, un brin complémentaire. Chaque molécule fille contient un brin ancien et un brin neuf : la réplication est **semi-conservative**. Elle est très **fidèle** (environ une erreur pour un milliard de nucléotides après correction), ce qui garantit la transmission de l’information ; les rares erreurs non corrigées sont des **mutations**.

## Les étapes de la mitose
1. **Prophase** : les chromosomes se condensent, l’enveloppe nucléaire se fragmente, le **fuseau mitotique** (fait de **microtubules**) se forme.
2. **Métaphase** : les chromosomes s’alignent au centre de la cellule (plaque équatoriale).
3. **Anaphase** : les deux **chromatides** de chaque chromosome se séparent et migrent vers les pôles opposés.
4. **Télophase** : deux noyaux se reforment, la cellule se divise en deux.

> En mitose se séparent les **chromatides sœurs** ; en méiose I se séparent les **chromosomes homologues**. C’est toute la différence entre une division équationnelle et une division réductionnelle.

## La courbe de la quantité d’ADN
On note q la quantité d’ADN d’une cellule en G1.
| Moment | Mitose | Méiose |
| G1 | q | q |
| Après la phase S | 2q | 2q |
| Après la 1re division | q (deux cellules identiques) | q (deux cellules à n chromosomes doubles) |
| Après la 2e division | — | q/2 (gamètes) |

En mitose, la courbe monte de q à 2q pendant la phase S (pente progressive), puis redescend brutalement à q à la fin de la division. En méiose, elle redescend en **deux marches** : 2q → q → q/2.

## Exemple : identifier une phase
Une cellule humaine montre 46 chromosomes à deux chromatides alignés au centre : c’est une **métaphase de mitose**. Si l’on voit 23 chromosomes à deux chromatides alignés, c’est une **métaphase II de méiose**. Si l’on voit des chromosomes homologues appariés, on est en **méiose I**.`,
          },
          questions: [
            ['Pendant quelle phase l’ADN est-il répliqué ?', ['G1', 'G2', 'S', 'M'], 2, 'S comme synthèse : chaque chromosome passe de une à deux chromatides.'],
            ['La réplication est dite semi-conservative parce que…', ['Chaque molécule fille garde un brin ancien et reçoit un brin neuf', 'La moitié de l’ADN est détruite', 'Seule la moitié des gènes est copiée', 'Elle se fait à moitié dans le noyau'], 0, 'Chaque brin parental sert de modèle.'],
            ['Quelle enzyme réplique l’ADN ?', ['L’ARN polymérase', 'L’ADN polymérase', 'La pepsine', 'La lipase'], 1, 'Elle ajoute des nucléotides complémentaires du brin modèle.'],
            ['Pendant l’anaphase de mitose, ce qui se sépare, ce sont…', ['Les chromosomes homologues', 'Les chromatides sœurs', 'Les noyaux', 'Les ribosomes'], 1, 'Chaque cellule fille reçoit une chromatide de chaque chromosome.'],
            ['Le fuseau mitotique est constitué de…', ['Glycogène', 'Phospholipides', 'ARN messager', 'Microtubules'], 3, 'Ces fibres protéiques tirent les chromatides vers les pôles.'],
            ['En métaphase, les chromosomes…', ['S’alignent au centre de la cellule', 'Sont décondensés dans le noyau', 'Migrent vers les pôles', 'Se répliquent'], 0, 'Ils forment la plaque équatoriale, le meilleur moment pour les photographier.'],
            ['Si une cellule en G1 contient une quantité q d’ADN, combien en contient-elle en G2 ?', ['q/2', 'q', '2q', '4q'], 2, 'La phase S a doublé l’ADN.'],
            ['Après une méiose complète, chaque gamète contient…', ['2q', 'q', 'q/2', '4q'], 2, 'Deux divisions successives à partir de 2q : q puis q/2.'],
            ['Les deux cellules filles d’une mitose ont la même information génétique.', ['Vrai', 'Faux'], 0, 'La réplication fidèle puis la séparation des chromatides sœurs donnent deux copies identiques.'],
            ['Une cellule humaine montre 23 chromosomes à deux chromatides alignés au centre. C’est…', ['Une métaphase II de méiose', 'Une métaphase de mitose', 'Une prophase I', 'Une interphase'], 0, 'La cellule est déjà haploïde mais ses chromosomes ont encore deux chromatides.'],
            ['Quelle est la phase la plus longue du cycle cellulaire en général ?', ['La mitose', 'L’anaphase', 'La métaphase', 'L’interphase'], 3, 'La mitose ne dure qu’environ une heure sur un cycle de près d’un jour.'],
            ['Une erreur de réplication non corrigée est…', ['Une transcription', 'Une mutation', 'Une traduction', 'Une hybridation'], 1, 'Elle sera transmise aux cellules filles.'],
          ],
        },
      ],
    },
  ],
}
