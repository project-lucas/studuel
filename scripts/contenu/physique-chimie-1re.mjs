// PHYSIQUE-CHIMIE PREMIÈRE (spécialité) — les 22 fiches du programme officiel,
// rangées sous ses 6 chapitres : mouvements et interactions · lumière, images et
// couleurs · énergie · constitution et transformations de la matière · structure
// de la matière · propriétés physico-chimiques.
//
// LE DÉFAUT. Sondé le 21/08/2026 (node _ASSOCIE/sonde-chapitres.mjs 1re
// physique-chimie) : la spécialité de Première n’a que CINQ fiches composites —
// « Suivi d’une transformation chimique », « Structure des entités chimiques »,
// « Mouvement et interactions », « L’énergie mécanique », « Ondes mécaniques ».
// Elles viennent des migrations écrites à la main (037 → 143). Le titrage, la
// relation de conjugaison, le champ électrique, la représentation de Lewis,
// l’électronégativité, la nomenclature, la synthèse organique et les combustions
// n’ont AUCUNE entrée — c’est-à-dire la moitié du programme, et l’essentiel de
// ce qui se joue en travaux pratiques.
//
// POURQUOI UN MODULE NEUF plutôt qu’un ajout dans `physique-chimie-tle.mjs` :
// celui-ci part dans la migration 252, qui ne doit plus être régénérée. Deux
// fichiers, même slug `physique-chimie` — d’où la génération par `--modules`.
//
// PÉRIMÈTRE : la PREMIÈRE SEULE. Le ménage est borné à `level = '1re'` : les six
// autres niveaux gardent leurs fiches, héritées des migrations 037 → 143.
//
// LE DÉCOUPAGE EST CELUI DE LA MAQUETTE DE RÉFÉRENCE — 6 chapitres. Le BO en
// compte quatre (« Constitution et transformations de la matière », « Mouvement
// et interactions », « L’énergie : conversions et transferts », « Ondes et
// signaux ») ; la maquette scinde la chimie en trois blocs qui correspondent aux
// trois moments de l’année (quantité de matière et suivi de réaction · structure
// et cohésion · chimie organique) et sort l’optique des ondes. Six en-têtes pour
// 22 fiches rangent mieux que quatre, et c’est ce découpage-là que l’élève a sur
// son cahier.
//
// ⚠️ PAS DE LATEX : le composant de rendu ne le connaît pas. Les formules
// s’écrivent en texte — « P = U × I », « v = d / t », « x² ».

export default {
  slug: 'physique-chimie',
  nom: 'Physique-Chimie',

  titreMigration: 'PHYSIQUE-CHIMIE 1re (spécialité) — LE PROGRAMME OFFICIEL (22 fiches)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs 1re physique-chimie,
21/08/2026) : la spécialité de Première n'avait que CINQ fiches composites —
« Suivi d'une transformation chimique », « Structure des entités chimiques »,
« Mouvement et interactions », « L'énergie mécanique », « Ondes mécaniques » —,
héritées des migrations écrites à la main (037 → 143). Le dosage par titrage, la
relation de conjugaison, le champ électrique, la représentation de Lewis,
l'électronégativité, la nomenclature, la synthèse organique et les réactions de
combustion n'avaient AUCUNE entrée : la moitié du programme, et l'essentiel de
ce qui se joue en travaux pratiques comme à l'écrit.

Cette migration installe les 22 fiches du programme, rangées sous ses 6
chapitres, et retire les 5 fiches composites qu'elles recouvrent.

PÉRIMÈTRE : la PREMIÈRE SEULE. Les six autres niveaux gardent leurs fiches : le
ménage est borné au niveau 1re. La Terminale a reçu les siennes avec la 252.

⚠️ CE QUI EST PERDU AU PASSAGE : les cours et les quiz des 5 fiches composites.
Ils étaient adossés à un découpage que les 22 fiches recouvrent entièrement.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 22 fiches sous 6 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que la 234 n'a jamais été
exécutée telle quelle — sans cette reprise, la migration échouerait sur
"column chapters.theme does not exist", les 5 anciennes fiches déjà supprimées
et les 22 neuves pas encore posées : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 fiches composites partent, au niveau 1re SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : deux de ces cinq titres portent une
apostrophe, et rien ne garantit que la base porte la même que ce fichier
(droite dans le contenu ancien, typographique dans le récent) ; un DELETE par
titre ne trouverait alors pas la ligne, EN SILENCE (piège de la 249, contourné
depuis en 258, 259, 266 à 269). Le critère « pas de chapitre de programme » vise
exactement les cinq lignes voulues : elles sont antérieures à la colonne theme,
tandis que les 22 fiches neuves en portent un dès l'INSERT — le ménage tourne
AVANT les insertions et ne peut donc jamais mordre sur elles, ni au premier
passage ni au rejeu.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins à leur chapitre, et toujours
tirables par le moteur de questions), puis les chapitres, dont les leçons
partent en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '1re'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      chapitres: [
        // ---- Chapitre 1 : mouvements et interactions ------------------------
        {
          titre: 'La statique des fluides',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Pression, poussée d’Archimède, loi de Mariotte',
            cours: `Un fluide au repos exerce des forces sur tout ce qu'il touche. Trois lois suffisent à décrire l'essentiel.

## La pression
La **pression** est le quotient de la force pressante par la surface :

p = F / S

| La grandeur | Son unité | Un repère |
| Pression p | **Pascal** (Pa), avec 1 Pa = 1 N/m² | 1 bar = 100 000 Pa |
| Force pressante F | Newton (N) | Toujours **perpendiculaire** à la surface |
| Surface S | Mètre carré (m²) | — |

> La pression atmosphérique vaut environ 1 013 hPa au niveau de la mer.

## La loi fondamentale de la statique des fluides
Dans un liquide incompressible au repos, la pression augmente avec la profondeur :

p(B) − p(A) = ρ × g × (z(A) − z(B))

où ρ est la masse volumique du liquide, en kg/m³, et g l'intensité de pesanteur.

> Deux points d'un même liquide à la **même profondeur** sont à la **même pression** : c'est le principe des vases communicants.

## La poussée d'Archimède
Tout corps plongé dans un fluide subit une force **verticale, vers le haut**, égale au **poids du fluide déplacé** :

F = ρ(fluide) × V(immergé) × g

| La masse volumique du corps | Ce qui se passe |
| **Inférieure** à celle du fluide | Il **flotte** |
| **Supérieure** | Il **coule** |

## La loi de Mariotte
Pour un **gaz** à température constante :

p × V = constante

| L'action | La conséquence |
| Comprimer le gaz de moitié | Sa pression **double** |
| Doubler son volume | Sa pression est **divisée par deux** |

> Cette loi ne vaut que pour un gaz, à température fixée. Un liquide est considéré comme **incompressible**.`,
          },
          questions: [
            ['Quelle est l’unité de pression du Système international ?', ['Le pascal', 'Le newton', 'Le bar', 'Le joule'], 0, '1 Pa = 1 N/m² ; le bar et l’hectopascal en sont des multiples pratiques.'],
            ['Dans un liquide au repos, deux points à la même profondeur sont à la même pression.', ['Vrai', 'Faux'], 0, 'C’est le fondement du principe des vases communicants.'],
            ['À quoi est égale la poussée d’Archimède ?', ['Au poids du fluide déplacé', 'Au poids du corps immergé', 'À la pression atmosphérique', 'Au volume du corps immergé'], 0, 'Elle est verticale et dirigée vers le haut.'],
            ['Que dit la loi de Mariotte ?', ['Le produit p × V d’un gaz est constant à température constante', 'La pression augmente avec la profondeur', 'La pression est proportionnelle à la température', 'Le volume d’un liquide est constant'], 0, 'Elle ne s’applique qu’aux gaz, à température fixée.'],
            ['Une force pressante s’exerce parallèlement à la surface.', ['Vrai', 'Faux'], 1, 'Elle est toujours PERPENDICULAIRE à la surface pressée.'],
            ['Que devient la pression si l’on double la surface, à force pressante constante ?', ['Elle est divisée par deux', 'Elle est doublée', 'Elle est inchangée', 'Elle est multipliée par quatre'], 0, 'p = F / S : la pression est inversement proportionnelle à la surface.'],
            ['Un corps flotte si sa masse volumique moyenne est inférieure à celle du fluide.', ['Vrai', 'Faux'], 0, 'La poussée d’Archimède compense alors le poids avant immersion totale.'],
            ['De quoi dépend l’augmentation de pression dans un liquide au repos ?', ['De la masse volumique du liquide et de la profondeur', 'De la forme du récipient', 'De la surface libre du liquide', 'Du volume total de liquide'], 0, 'p augmente de ρ × g × h, indépendamment de la forme du récipient.'],
          ],
        },
        {
          titre: 'Mouvements et cinématique',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Décrire un mouvement, puis l’expliquer',
            cours: `Un mouvement n'existe jamais « en soi » : décrire un mouvement suppose d'abord de choisir un référentiel.

## Le référentiel
| Le référentiel | Le passager assis dans un train |
| Celui du **train** | Immobile |
| Celui du **sol** | En mouvement |

## Vitesse et accélération
| Le vecteur | Ce qu'il indique |
| **Vitesse** | Tangent à la trajectoire, orienté dans le sens du mouvement ; sa valeur est v = d / t pour un mouvement uniforme |
| **Accélération** | La variation du vecteur vitesse : en **valeur** (accélérer, freiner) **ou en direction** (tourner) |

> Un mobile en mouvement circulaire uniforme a une vitesse de valeur constante et une accélération **non nulle**, dirigée vers le centre : c'est la direction qui change.

## Les trois lois de Newton
| La loi | Son énoncé |
| **Première** (inertie) | Dans un référentiel galiléen, si la somme des forces est nulle, le centre de masse est immobile ou en mouvement rectiligne uniforme — et réciproquement |
| **Deuxième** | Σ F = m × a |
| **Troisième** (actions réciproques) | Si A exerce une force sur B, B exerce sur A une force de même valeur, même direction, sens opposé |

> Les deux forces de la troisième loi s'appliquent à **deux corps différents** : elles ne se compensent jamais.

## La méthode, toujours la même
1. Définir le **système**.
2. Choisir le **référentiel**.
3. Faire le **bilan des forces**.
4. Appliquer la **deuxième loi** pour obtenir l'accélération.
5. Intégrer pour obtenir la vitesse, puis la position.

## Deux cas particuliers utiles
| Le cas | Ce qui le caractérise |
| **Chute libre** | Seule la pesanteur agit ; l'accélération vaut g, **indépendante de la masse** |
| **Rectiligne uniformément accéléré** | L'accélération est constante, la vitesse varie linéairement avec le temps |`,
          },
          questions: [
            ['Que faut-il choisir avant de décrire un mouvement ?', ['Un référentiel', 'Une force', 'Une masse', 'Une énergie'], 0, 'Un mouvement n’a de sens que relativement à un référentiel.'],
            ['Un mobile en mouvement circulaire uniforme a une accélération nulle.', ['Vrai', 'Faux'], 1, 'La direction du vecteur vitesse change : l’accélération est dirigée vers le centre.'],
            ['Que dit la deuxième loi de Newton ?', ['La somme des forces est égale au produit de la masse par l’accélération', 'Toute action entraîne une réaction opposée', 'Un corps isolé garde une vitesse constante', 'L’énergie se conserve'], 0, 'Σ F = m × a, dans un référentiel galiléen.'],
            ['Les deux forces de la troisième loi de Newton se compensent.', ['Vrai', 'Faux'], 1, 'Elles s’appliquent à DEUX corps différents : elles ne peuvent pas se compenser.'],
            ['En chute libre, de quoi dépend l’accélération d’un corps ?', ['Uniquement de l’intensité de pesanteur', 'De sa masse', 'De sa forme', 'De sa vitesse initiale'], 0, 'C’est pourquoi une plume et une bille tombent ensemble dans le vide.'],
            ['Le vecteur vitesse est tangent à la trajectoire.', ['Vrai', 'Faux'], 0, 'Il est orienté dans le sens du mouvement.'],
            ['Que peut-on conclure si la somme des forces sur un système est nulle ?', ['Son centre de masse est immobile ou en mouvement rectiligne uniforme', 'Il est nécessairement immobile', 'Il accélère uniformément', 'Sa trajectoire est circulaire'], 0, 'C’est le principe d’inertie, valable dans un référentiel galiléen.'],
            ['Une accélération peut être non nulle même si la valeur de la vitesse ne change pas.', ['Vrai', 'Faux'], 0, 'Un changement de DIRECTION suffit : c’est le cas du mouvement circulaire uniforme.'],
          ],
        },
        {
          titre: 'Le champ gravitationnel',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'De la loi de Newton au champ de pesanteur',
            cours: `Deux corps possédant une masse s'attirent. La gravitation est la seule des quatre interactions fondamentales qui soit toujours attractive et de portée infinie.

## La loi de gravitation universelle
Deux corps ponctuels de masses m(A) et m(B), distants de d, s'attirent avec une force de valeur :

F = G × m(A) × m(B) / d²

avec G ≈ 6,67 × 10⁻¹¹ dans les unités du Système international. La force est portée par la droite qui joint les deux corps.

| La distance | La force |
| Doublée | Divisée par **quatre** |
| Triplée | Divisée par **neuf** |

> La dépendance en 1 / d² est décisive : doubler la distance divise la force par quatre, et non par deux.

## Du champ à la force
Un corps massique crée autour de lui un **champ gravitationnel**. À la distance d d'un astre de masse M :

g = G × M / d²

Il est dirigé vers le centre de l'astre. Une masse m placée en ce point subit alors la force F = m × g.

## Masse et poids
| La grandeur | Son unité | Ce dont elle dépend |
| **Masse** | Kilogramme (kg) | Le corps seul : elle est **invariable** |
| **Poids** | Newton (N) | L'astre : P = m × g |

> Sur la Lune, où g vaut environ 1,6 N/kg, un astronaute a exactement le même corps et un poids six fois plus faible.

## Champ uniforme ou non
| L'échelle | Le champ de pesanteur |
| Une salle de classe | **Uniforme** : même valeur (environ 9,8 N/kg), même direction, même sens |
| Un satellite en orbite | **Non uniforme** : sa valeur décroît avec l'altitude, sa direction change |`,
          },
          questions: [
            ['Comment varie la force gravitationnelle si la distance est doublée ?', ['Elle est divisée par quatre', 'Elle est divisée par deux', 'Elle est multipliée par deux', 'Elle est inchangée'], 0, 'La force varie en 1 / d² : c’est une décroissance quadratique.'],
            ['L’interaction gravitationnelle peut-elle être répulsive ?', ['Non, elle est toujours attractive', 'Oui, entre deux masses opposées', 'Oui, à très courte distance', 'Oui, dans le vide'], 0, 'C’est ce qui la distingue de l’interaction électrostatique.'],
            ['Quelle est l’unité du champ de pesanteur g ?', ['Le newton par kilogramme', 'Le newton', 'Le kilogramme', 'Le joule'], 0, 'Le N/kg, dimensionnellement équivalent au m/s².'],
            ['La masse d’un astronaute change lorsqu’il se rend sur la Lune.', ['Vrai', 'Faux'], 1, 'Sa MASSE est invariable ; c’est son POIDS qui est six fois plus faible.'],
            ['De quoi dépend la valeur du champ gravitationnel créé par un astre en un point ?', ['De la masse de l’astre et de la distance au point', 'De la masse du corps qui subit le champ', 'De la vitesse du corps', 'De la température de l’astre'], 0, 'g = G × M / d², indépendamment du corps qui le subit.'],
            ['Le champ de pesanteur terrestre peut être considéré comme uniforme à l’échelle d’une salle de classe.', ['Vrai', 'Faux'], 0, 'Même valeur, même direction, même sens sur cette étendue.'],
            ['Quelle relation lie le poids, la masse et le champ de pesanteur ?', ['P = m × g', 'P = m / g', 'P = g / m', 'P = m × g²'], 0, 'Le poids est la force exercée par le champ sur la masse.'],
            ['Le champ gravitationnel est dirigé vers le centre de l’astre qui le crée.', ['Vrai', 'Faux'], 0, 'C’est ce qui donne à la verticale son sens physique.'],
          ],
        },
        {
          titre: 'Champ électrique et électrostatique',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'La loi de Coulomb et le condensateur plan',
            cours: `Deux corps portant une charge électrique interagissent. À la différence de la gravitation, cette interaction peut être attractive ou répulsive.

## La loi de Coulomb
Deux charges ponctuelles q(A) et q(B), distantes de d, exercent l'une sur l'autre une force de valeur :

F = k × q(A) × q(B) / d²  (en valeurs absolues)

avec k ≈ 9 × 10⁹ dans les unités du Système international.

| Les signes des charges | L'effet |
| **Même** signe | Elles se **repoussent** |
| Signes **contraires** | Elles s'**attirent** |

Les charges se comptent en **coulombs** (C) ; la charge élémentaire vaut e ≈ 1,6 × 10⁻¹⁹ C.

> Même forme mathématique que la loi de Newton, en 1 / d² — mais une intensité sans commune mesure : entre deux protons, la répulsion électrique est environ 10³⁶ fois plus grande que l'attraction gravitationnelle.

## Le champ électrique
Une charge q placée en un point où règne un champ E subit la force :

F = q × E

| Le signe de q | Le sens de la force |
| **Positive** | Dans le sens du champ |
| **Négative** | Dans le sens **opposé** |

Le champ se mesure en volts par mètre (V/m).

## Le condensateur plan
Entre deux plaques parallèles portant des charges opposées, le champ est **uniforme** : même valeur, même direction, même sens en tout point.

E = U / d

où U est la tension appliquée et d la distance entre les plaques. Les lignes de champ y sont des droites parallèles, perpendiculaires aux plaques, orientées du plus vers le moins.

## Lignes de champ
| Autour d'une charge… | Les lignes sont… |
| **Positive** | Radiales et **sortantes** |
| **Négative** | Radiales et **entrantes** |

Une ligne de champ est tangente au vecteur champ en chacun de ses points.`,
          },
          questions: [
            ['Deux charges de même signe…', ['se repoussent', 's’attirent', 'ne s’influencent pas', 's’annulent'], 0, 'C’est ce qui distingue l’interaction électrostatique de la gravitation, toujours attractive.'],
            ['Quelle est l’unité de charge électrique du Système international ?', ['Le coulomb', 'L’ampère', 'Le volt', 'Le farad'], 0, 'La charge élémentaire vaut environ 1,6 × 10⁻¹⁹ C.'],
            ['La loi de Coulomb a la même dépendance en distance que la loi de gravitation.', ['Vrai', 'Faux'], 0, 'Toutes deux varient en 1 / d², mais avec des intensités sans commune mesure.'],
            ['Quelle est la relation entre le champ électrique et la force subie par une charge q ?', ['F = q × E', 'F = E / q', 'F = q / E', 'F = q × E²'], 0, 'La force est colinéaire au champ, de même sens si q est positive.'],
            ['Comment est le champ électrique entre les plaques d’un condensateur plan ?', ['Uniforme', 'Radial', 'Nul', 'Variable dans le temps'], 0, 'Même valeur, même direction et même sens en tout point.'],
            ['Quelle relation donne la valeur du champ dans un condensateur plan ?', ['E = U / d', 'E = U × d', 'E = d / U', 'E = U × d²'], 0, 'U est la tension entre les plaques, d leur distance.'],
            ['Une charge négative subit une force de même sens que le champ électrique.', ['Vrai', 'Faux'], 1, 'La force est alors de sens OPPOSÉ au champ.'],
            ['Comment sont orientées les lignes de champ autour d’une charge ponctuelle négative ?', ['Radiales et entrantes', 'Radiales et sortantes', 'Circulaires', 'Parallèles'], 0, 'Le champ pointe vers la charge négative.'],
          ],
        },

        // ---- Chapitre 2 : lumière, images et couleurs -----------------------
        {
          titre: 'Définition des ondes',
          axe: 'Lumière, images et couleurs',
          lecon: {
            titre: 'Propagation, période, longueur d’onde',
            cours: `Une onde est la propagation d'une perturbation dans un milieu, sans transport de matière mais avec transport d'énergie.

> Un bouchon sur l'eau monte et descend au passage d'une vague : il n'avance pas avec elle.

## Deux classements
| Le critère | Les deux familles |
| **Milieu nécessaire** | **Mécaniques** (son, vagues, ondes sismiques) : un milieu matériel est indispensable — le son ne se propage pas dans le vide. **Électromagnétiques** : la lumière traverse le vide |
| **Direction de la perturbation** | **Transversale** (perpendiculaire à la propagation, comme sur une corde). **Longitudinale** (parallèle, comme le son dans l'air) |

## Les grandeurs
| La grandeur | Son symbole | Son unité | Sa définition |
| Période | T | seconde (s) | La durée d'un motif complet |
| Fréquence | f | hertz (Hz) | Le nombre de motifs par seconde : f = 1 / T |
| Longueur d'onde | λ | mètre (m) | La distance parcourue pendant une période |
| Célérité | v | m/s | La vitesse de propagation |

La relation à connaître les relie toutes :

λ = v × T = v / f

> La fréquence est imposée par la **source** et ne change pas quand l'onde change de milieu. La célérité, elle, dépend du milieu — donc la longueur d'onde aussi.

## Quelques ordres de grandeur
| Le milieu | La célérité du son |
| Air | Environ 340 m/s |
| Eau | Environ 1 500 m/s |
| Acier | Environ 5 000 m/s |

Plus le milieu est rigide, plus l'onde va vite. La lumière se propage à environ 3,00 × 10⁸ m/s dans le vide.

## Retard et distance
Deux points séparés d'une distance d reçoivent la même perturbation avec un retard :

τ = d / v

> C'est ce qui permet de localiser un orage en comptant les secondes entre l'éclair et le tonnerre.`,
          },
          questions: [
            ['Que transporte une onde ?', ['De l’énergie, sans transport de matière', 'De la matière, sans énergie', 'De la matière et de l’énergie', 'Ni l’une ni l’autre'], 0, 'Le bouchon sur l’eau oscille sur place au passage de la vague.'],
            ['Le son peut-il se propager dans le vide ?', ['Non, c’est une onde mécanique', 'Oui, comme la lumière', 'Oui, mais plus lentement', 'Oui, s’il est très intense'], 0, 'Une onde mécanique exige un milieu matériel.'],
            ['Quelle relation lie longueur d’onde, célérité et fréquence ?', ['λ = v / f', 'λ = v × f', 'λ = f / v', 'λ = v + f'], 0, 'Équivalente à λ = v × T, puisque f = 1 / T.'],
            ['La fréquence d’une onde change quand elle passe d’un milieu à un autre.', ['Vrai', 'Faux'], 1, 'Elle est imposée par la source ; ce sont la célérité et la longueur d’onde qui changent.'],
            ['Une onde sonore dans l’air est…', ['longitudinale', 'transversale', 'électromagnétique', 'stationnaire'], 0, 'La perturbation est parallèle à la direction de propagation.'],
            ['Quelle est l’unité de la fréquence ?', ['Le hertz', 'La seconde', 'Le mètre', 'Le mètre par seconde'], 0, '1 Hz = un motif par seconde.'],
            ['Le son se propage plus vite dans l’acier que dans l’air.', ['Vrai', 'Faux'], 0, 'Environ 5 000 m/s contre 340 m/s : la rigidité du milieu accélère la propagation.'],
            ['Comment calcule-t-on le retard entre deux points distants de d ?', ['τ = d / v', 'τ = d × v', 'τ = v / d', 'τ = d × f'], 0, 'C’est ce calcul qui permet de situer un orage.'],
          ],
        },
        {
          titre: 'Ondes et spectre électromagnétiques',
          axe: 'Lumière, images et couleurs',
          lecon: {
            titre: 'Du gamma aux ondes radio',
            cours: `Une onde électromagnétique est la propagation couplée d'un champ électrique et d'un champ magnétique. Elle n'a besoin d'aucun support et va à c ≈ 3,00 × 10⁸ m/s dans le vide.

## Un domaine continu
Toutes ces ondes sont de même nature : seules leur **fréquence** et leur **longueur d'onde** les distinguent.

| Le domaine | Sa longueur d'onde | Un usage ou un effet |
| **Ondes radio** | Au-delà du mètre | Télécommunications |
| **Micro-ondes** | Du millimètre au décimètre | Radar, four, Wi-Fi |
| **Infrarouge** | De 800 nm à 1 mm | Chaleur, télécommandes |
| **Visible** | De **400 à 800 nm** | Du violet au rouge |
| **Ultraviolet** | De 10 à 400 nm | Bronzage, brûlures |
| **Rayons X** | Environ 0,01 à 10 nm | Radiographie |
| **Rayons gamma** | En deçà | Les plus énergétiques, d'origine nucléaire |

Du haut vers le bas du tableau : la fréquence et l'énergie **augmentent**.

> Le domaine visible n'occupe qu'une bande minuscule du spectre. Ce n'est pas la lumière qui est particulière : c'est notre œil.

## Les trois types de spectres
| Le spectre | Sa source | Son aspect |
| **Continu** | Un corps chaud : filament, étoile | Toutes les longueurs d'onde ; le maximum se déplace vers le bleu quand la **température** monte |
| **Raies d'émission** | Un gaz atomique excité | Quelques raies colorées sur fond noir |
| **Raies d'absorption** | Lumière blanche traversant un gaz froid | Un fond continu **barré de raies noires** |

> Les raies noires d'absorption sont exactement aux positions où le même gaz émettrait. Chaque jeu de raies est la **signature** d'un élément : c'est ainsi qu'on lit la composition d'une étoile ou d'une atmosphère planétaire.`,
          },
          questions: [
            ['Quel est le domaine approximatif de la lumière visible ?', ['De 400 à 800 nm', 'De 10 à 400 nm', 'De 800 nm à 1 mm', 'Au-delà du mètre'], 0, 'Du violet au rouge, une bande minuscule du spectre total.'],
            ['Les ondes électromagnétiques ont-elles besoin d’un milieu matériel ?', ['Non, elles se propagent dans le vide', 'Oui, comme le son', 'Oui, sauf la lumière', 'Uniquement les rayons X'], 0, 'C’est ce qui permet à la lumière des étoiles de nous parvenir.'],
            ['Quel rayonnement est plus énergétique que la lumière visible ?', ['L’ultraviolet', 'L’infrarouge', 'Les micro-ondes', 'Les ondes radio'], 0, 'Plus la fréquence est élevée, plus l’énergie du rayonnement est grande.'],
            ['Un spectre de raies d’émission est caractéristique de l’élément qui l’émet.', ['Vrai', 'Faux'], 0, 'C’est une signature, qui permet d’identifier la composition d’une étoile.'],
            ['Qu’observe-t-on dans un spectre d’absorption ?', ['Des raies noires sur un fond continu', 'Des raies colorées sur fond noir', 'Un fond uniformément noir', 'Un spectre continu sans particularité'], 0, 'Le gaz froid absorbe exactement les longueurs d’onde qu’il émettrait.'],
            ['De quoi dépend la répartition d’un spectre continu d’émission ?', ['De la température du corps', 'De sa composition chimique', 'De sa masse', 'De sa distance'], 0, 'Plus le corps est chaud, plus le maximum se décale vers le bleu.'],
            ['Les micro-ondes ont une longueur d’onde plus courte que les ondes radio.', ['Vrai', 'Faux'], 0, 'Du millimètre au décimètre, contre plus d’un mètre pour les ondes radio.'],
            ['À quelle vitesse une onde électromagnétique se propage-t-elle dans le vide ?', ['Environ 3,00 × 10⁸ m/s', 'Environ 340 m/s', 'Environ 1 500 m/s', 'Elle varie selon la fréquence'], 0, 'C’est la même pour toutes les ondes du spectre.'],
          ],
        },
        {
          titre: 'Les photons et l’interaction matière-lumière',
          axe: 'Lumière, images et couleurs',
          lecon: {
            titre: 'Quantification de l’énergie',
            cours: `La lumière se comporte aussi comme un flux de grains d'énergie, les photons. C'est la seule façon d'expliquer que la matière n'absorbe et n'émette que par valeurs précises.

## L'énergie d'un photon
E = h × f = h × c / λ

avec h ≈ 6,63 × 10⁻³⁴ J·s, la constante de Planck.

| Le photon | Sa longueur d'onde | Son énergie |
| **Bleu** | Petite | **Grande** |
| **Rouge** | Grande | **Petite** |

Les énergies atomiques étant minuscules en joules, on emploie l'**électronvolt** : 1 eV ≈ 1,60 × 10⁻¹⁹ J.

## Les niveaux d'énergie
L'énergie d'un atome ne prend que certaines valeurs : elle est **quantifiée**. On la représente par un **diagramme de niveaux**, échelons horizontaux.

| Le niveau | Ce qu'il est |
| Le plus bas | L'**état fondamental** |
| Les autres | Des **états excités** |

## Absorption et émission
| Le phénomène | Ce qui se passe |
| **Absorption** | L'atome n'absorbe un photon que si son énergie correspond **exactement** à l'écart entre deux niveaux |
| **Émission** | Un atome excité redescend et émet un photon d'énergie égale à la différence des niveaux |

E(photon) = E(haut) − E(bas)

> Un photon d'énergie intermédiaire n'est pas absorbé du tout : il n'existe pas de demi-transition. C'est ce qui explique les spectres de raies — chaque raie correspond à un écart d'énergie propre à l'élément.

## Deux applications
| L'application | Ce qu'elle exploite |
| Le **laser** | Une émission provoquée entre deux niveaux : lumière monochromatique et directive |
| La **photosynthèse**, la **vision**, l'effet photoélectrique | L'absorption d'un photon par une molécule ou un métal |`,
          },
          questions: [
            ['Quelle relation donne l’énergie d’un photon ?', ['E = h × f', 'E = h / f', 'E = h × λ', 'E = f / h'], 0, 'Équivalente à E = h × c / λ.'],
            ['Un photon bleu est plus énergétique qu’un photon rouge.', ['Vrai', 'Faux'], 0, 'Sa longueur d’onde est plus courte, donc sa fréquence et son énergie plus grandes.'],
            ['Que signifie « l’énergie d’un atome est quantifiée » ?', ['Elle ne peut prendre que certaines valeurs déterminées', 'Elle peut prendre n’importe quelle valeur', 'Elle est toujours nulle', 'Elle augmente continûment avec la température'], 0, 'D’où la représentation en niveaux discrets.'],
            ['À quelle condition un atome absorbe-t-il un photon ?', ['Si l’énergie du photon correspond exactement à un écart entre deux niveaux', 'Si le photon est assez énergétique', 'Si le photon est visible', 'Toujours'], 0, 'Un photon d’énergie intermédiaire n’est pas absorbé du tout.'],
            ['Combien vaut approximativement un électronvolt en joules ?', ['1,60 × 10⁻¹⁹ J', '6,63 × 10⁻³⁴ J', '3,00 × 10⁸ J', '9,00 × 10⁹ J'], 0, 'Unité commode à l’échelle atomique, où le joule est démesuré.'],
            ['Comment appelle-t-on le niveau d’énergie le plus bas d’un atome ?', ['L’état fondamental', 'L’état excité', 'L’état ionisé', 'L’état stationnaire'], 0, 'Les niveaux supérieurs sont les états excités.'],
            ['Un atome excité qui se désexcite émet un photon.', ['Vrai', 'Faux'], 0, 'Son énergie vaut exactement la différence entre les deux niveaux.'],
            ['Pourquoi les spectres de raies sont-ils caractéristiques d’un élément ?', ['Parce que ses écarts entre niveaux d’énergie lui sont propres', 'Parce que sa température est unique', 'Parce que sa masse est unique', 'Parce qu’il émet toutes les longueurs d’onde'], 0, 'Chaque raie correspond à une transition entre deux niveaux donnés.'],
          ],
        },
        {
          titre: 'Vergence, image, grandissement et relation de conjugaison',
          axe: 'Lumière, images et couleurs',
          lecon: {
            titre: 'La lentille mince convergente',
            cours: `Une lentille mince convergente fait converger en un point les rayons qui la traversent parallèlement à son axe optique. Ce point est le foyer image F'.

## Les deux grandeurs
| La grandeur | Son unité | Sa définition |
| **Distance focale** f' | Mètre (m) | La distance du centre optique O au foyer image F' |
| **Vergence** C | **Dioptrie** (δ) | Son inverse : C = 1 / f' |

Une lentille de 5 dioptries a une distance focale de 0,20 m. Plus la vergence est grande, plus la lentille est convergente.

## Les trois rayons à savoir tracer
| Le rayon incident | Ce qu'il devient |
| Passant par le **centre optique O** | Il n'est **pas dévié** |
| **Parallèle à l'axe** | Il ressort en passant par **F'** |
| Passant par le **foyer objet F** | Il ressort **parallèle à l'axe** |

> Deux de ces trois rayons suffisent à construire l'image d'un point.

## La relation de conjugaison
Avec les mesures algébriques comptées depuis le centre optique O :

1 / OA' − 1 / OA = 1 / f'

## Le grandissement
γ = A'B' / AB = OA' / OA

| La valeur de γ | Ce qu'elle dit de l'image |
| Valeur absolue supérieure à 1 | Elle est **agrandie** |
| Valeur absolue inférieure à 1 | Elle est **réduite** |
| γ **négatif** | Elle est **renversée** |
| γ positif | Elle est **droite** |

## Réelle ou virtuelle
| L'image | Où est l'objet | Ce qu'elle donne |
| **Réelle** | Au-delà de 2f' | Renversée, plus petite, recueillie sur un écran : l'œil, l'appareil photo |
| **Virtuelle** | Entre O et F | Droite, agrandie, vue à travers la lentille : la loupe |

> Une image réelle peut être recueillie sur un écran, du côté opposé à l'objet. Une image virtuelle ne le peut pas : elle est du même côté que l'objet.`,
          },
          questions: [
            ['Quelle est l’unité de la vergence d’une lentille ?', ['La dioptrie', 'Le mètre', 'Le lumen', 'Le hertz'], 0, 'La vergence est l’inverse de la distance focale exprimée en mètres.'],
            ['Quelle est la distance focale d’une lentille de vergence 5 dioptries ?', ['0,20 m', '5 m', '0,05 m', '2 m'], 0, 'f’ = 1 / C = 1 / 5 = 0,20 m.'],
            ['Un rayon passant par le centre optique d’une lentille mince n’est pas dévié.', ['Vrai', 'Faux'], 0, 'C’est l’un des trois rayons particuliers utilisés en construction.'],
            ['Que devient un rayon parallèle à l’axe optique après la lentille convergente ?', ['Il passe par le foyer image F’', 'Il reste parallèle à l’axe', 'Il passe par le centre optique', 'Il est réfléchi'], 0, 'C’est la définition même du foyer image.'],
            ['Que signifie un grandissement négatif ?', ['L’image est renversée', 'L’image est réduite', 'L’image est virtuelle', 'L’image est floue'], 0, 'Le signe donne le sens, la valeur absolue la taille.'],
            ['Une image virtuelle peut être recueillie sur un écran.', ['Vrai', 'Faux'], 1, 'Seule une image RÉELLE peut l’être ; la virtuelle s’observe à travers la lentille.'],
            ['Où placer un objet pour obtenir une image virtuelle, droite et agrandie ?', ['Entre le centre optique et le foyer objet', 'Au-delà de 2f’', 'Exactement au foyer objet', 'À l’infini'], 0, 'C’est le fonctionnement de la loupe.'],
            ['Plus la vergence d’une lentille est grande, plus sa distance focale est petite.', ['Vrai', 'Faux'], 0, 'Elles sont inverses l’une de l’autre.'],
          ],
        },
        {
          titre: 'Couleurs',
          axe: 'Lumière, images et couleurs',
          lecon: {
            titre: 'Synthèses, absorption et perception',
            cours: `La couleur perçue résulte de trois choses : la lumière qui éclaire, l'objet qui la modifie, l'œil qui la reçoit. Changer l'une d'elles change la couleur.

## Les deux synthèses
| La synthèse | Ce qu'elle combine | Ses primaires | Leur superposition | Où on la trouve |
| **Additive** | Des **lumières** colorées | Rouge, vert, bleu (RVB) | Du **blanc** | Les écrans |
| **Soustractive** | Des **matières** qui retranchent des longueurs d'onde | Cyan, magenta, jaune | Du **noir** | Imprimerie, peinture |

## Couleur d'un objet
| L'objet | Ce qui détermine sa couleur |
| **Opaque** | La lumière qu'il **diffuse** ; il absorbe le reste |
| **Transparent** | La lumière qu'il **transmet** |
| **Noir** | Il absorbe toutes les longueurs d'onde |
| **Blanc** | Il les diffuse toutes |

> Un pull rouge éclairé en lumière verte paraît **noir** : il n'a rien à diffuser.

## Couleurs complémentaires
Deux couleurs sont complémentaires si leur superposition en synthèse additive donne du blanc.

| La couleur | Sa complémentaire |
| Rouge | Cyan |
| Vert | Magenta |
| Bleu | Jaune |

> Une solution absorbe la couleur complémentaire de celle qu'elle paraît avoir : une solution bleue absorbe dans le jaune-orangé. C'est directement utile en spectrophotométrie.

## La vision des couleurs
| Le récepteur | Sa sensibilité |
| Les trois types de **cônes** | Rouge, vert, bleu ; ils fonctionnent en pleine lumière |
| Les **bâtonnets** | Très sensibles mais **aveugles à la couleur** : d'où la vision nocturne en niveaux de gris |

Le cerveau reconstruit la couleur à partir des trois signaux.

> La couleur est une **construction**, pas une propriété de l'objet. Le **daltonisme** vient d'une déficience d'un type de cônes ; qu'un objet change de teinte selon l'éclairage n'est pas une illusion, mais la conséquence directe du mécanisme.`,
          },
          questions: [
            ['Quelles sont les trois couleurs primaires de la synthèse additive ?', ['Rouge, vert, bleu', 'Cyan, magenta, jaune', 'Rouge, jaune, bleu', 'Vert, orange, violet'], 0, 'Leur superposition donne du blanc : c’est le principe des écrans.'],
            ['La superposition des trois primaires de la synthèse soustractive donne du blanc.', ['Vrai', 'Faux'], 1, 'Elle donne du NOIR : chaque matière retranche des longueurs d’onde.'],
            ['De quelle couleur apparaît un pull rouge éclairé en lumière verte ?', ['Noir', 'Rouge', 'Vert', 'Jaune'], 0, 'Il n’a aucune lumière rouge à diffuser, et absorbe le vert.'],
            ['Quelle est la couleur complémentaire du bleu ?', ['Le jaune', 'Le rouge', 'Le vert', 'Le magenta'], 0, 'Leur superposition en synthèse additive donne du blanc.'],
            ['Un objet opaque apparaît de la couleur qu’il diffuse.', ['Vrai', 'Faux'], 0, 'Il absorbe les autres longueurs d’onde du spectre incident.'],
            ['Quelles cellules de la rétine permettent la vision des couleurs ?', ['Les cônes', 'Les bâtonnets', 'Les neurones du nerf optique', 'Les cellules du cristallin'], 0, 'Trois types de cônes, sensibles au rouge, au vert et au bleu.'],
            ['Pourquoi la vision nocturne se fait-elle en niveaux de gris ?', ['Parce que seuls les bâtonnets, insensibles à la couleur, restent actifs', 'Parce que les objets perdent leur couleur', 'Parce que le cristallin se déforme', 'Parce que la lumière change de nature'], 0, 'Les bâtonnets sont très sensibles mais ne distinguent pas les couleurs.'],
            ['Une solution colorée absorbe la couleur complémentaire de celle qu’elle paraît avoir.', ['Vrai', 'Faux'], 0, 'Une solution bleue absorbe dans le jaune-orangé : c’est la base de la spectrophotométrie.'],
          ],
        },

        // ---- Chapitre 3 : énergie -------------------------------------------
        {
          titre: 'L’énergie mécanique : énergies cinétique et potentielle',
          axe: 'Énergie : conversions et transferts',
          lecon: {
            titre: 'Conservation et non-conservation',
            cours: `L'énergie mécanique d'un système est la somme de son énergie cinétique et de son énergie potentielle de pesanteur.

Em = Ec + Epp

## Les deux termes
| L'énergie | Sa formule | Ce dont elle dépend |
| **Cinétique** Ec | ½ × m × v² | Le **mouvement** |
| **Potentielle de pesanteur** Epp | m × g × z | L'**altitude** |

> Ec croît avec le **carré** de la vitesse : doubler la vitesse **quadruple** l'énergie cinétique. C'est l'argument physique des limitations de vitesse.

L'énergie potentielle dépend du choix de l'**origine des altitudes**, choisie librement : seules ses **variations** ont un sens physique.

## Le théorème de l'énergie cinétique
La variation d'énergie cinétique entre deux points est égale à la somme des **travaux** des forces appliquées :

ΔEc = Σ W(F)

Pour une force constante sur un déplacement rectiligne : W = F × d × cos α.

> Une force **perpendiculaire** au déplacement ne travaille pas — c'est le cas de la pesanteur pour un mouvement horizontal.

## Conservation et non-conservation
| Le cas | Ce qui se passe | Le bilan |
| Seules des forces **conservatives** travaillent (la pesanteur) | L'énergie mécanique **se conserve** | Ce qui est perdu en altitude est gagné en vitesse |
| Des **frottements** interviennent | L'énergie mécanique **diminue** | ΔEm est égale au travail des frottements, négatif |

> Sur un toboggan sans frottement, la vitesse en bas ne dépend pas de la forme de la piste, mais seulement de la dénivellation.

L'énergie dissipée n'est pas « perdue » — le premier principe reste vrai — mais **transférée** au milieu sous forme thermique, et dégradée.`,
          },
          questions: [
            ['Quelle est l’expression de l’énergie cinétique ?', ['Ec = ½ × m × v²', 'Ec = m × g × z', 'Ec = m × v', 'Ec = ½ × m × v'], 0, 'Elle croît avec le carré de la vitesse.'],
            ['Que devient l’énergie cinétique d’un véhicule dont la vitesse double ?', ['Elle est multipliée par quatre', 'Elle est doublée', 'Elle est multipliée par huit', 'Elle est inchangée'], 0, 'La dépendance en v² est l’argument physique des limitations de vitesse.'],
            ['L’énergie potentielle de pesanteur dépend du choix de l’origine des altitudes.', ['Vrai', 'Faux'], 0, 'Seules ses VARIATIONS ont un sens physique.'],
            ['Que dit le théorème de l’énergie cinétique ?', ['La variation d’énergie cinétique égale la somme des travaux des forces', 'L’énergie mécanique se conserve toujours', 'Le travail est nul pour toute force', 'L’énergie cinétique est constante'], 0, 'ΔEc = Σ W(F) entre les deux points considérés.'],
            ['Une force perpendiculaire au déplacement ne travaille pas.', ['Vrai', 'Faux'], 0, 'W = F × d × cos α, et cos 90° = 0.'],
            ['Dans quel cas l’énergie mécanique se conserve-t-elle ?', ['Quand seules des forces conservatives travaillent', 'Quand la vitesse est constante', 'Quand l’altitude est constante', 'Toujours'], 0, 'Les frottements, eux, la font diminuer.'],
            ['Que devient l’énergie mécanique dissipée par les frottements ?', ['Elle est transférée au milieu sous forme thermique', 'Elle disparaît', 'Elle se transforme en énergie potentielle', 'Elle augmente l’énergie cinétique'], 0, 'Elle est dégradée, non détruite : le premier principe reste vrai.'],
            ['Sans frottement, la vitesse en bas d’un toboggan dépend de la forme de la piste.', ['Vrai', 'Faux'], 1, 'Elle ne dépend que de la dénivellation, par conservation de l’énergie mécanique.'],
          ],
        },
        {
          titre: 'L’énergie électrique',
          axe: 'Énergie : conversions et transferts',
          lecon: {
            titre: 'Puissance, effet Joule et rendement',
            cours: `Un circuit électrique transfère de l'énergie d'un générateur vers des récepteurs, qui la convertissent en une autre forme.

## Puissance et énergie
| La grandeur | Sa formule | Son unité |
| **Puissance** P | U × I | Watt (W), avec U en volts et I en ampères |
| **Énergie** E | P × Δt | Joule (J) si Δt est en secondes |

> Le **kilowattheure**, unité des factures, vaut 3,6 × 10⁶ J.

## La loi d'Ohm et l'effet Joule
Pour un conducteur ohmique de résistance R, en ohms :

U = R × I

La puissance qu'il dissipe entièrement sous forme thermique vaut :

P = R × I²

| L'effet Joule est… | Où |
| **Utile** | Radiateur, grille-pain, fusible |
| **Nuisible** | Ordinateur, ligne électrique |

> Les pertes varient avec le **carré** de I : d'où le transport de l'électricité à très haute tension, qui réduit l'intensité et donc les pertes.

## Le rendement
η = E(utile) / E(reçue)

Toujours inférieur à 1, souvent exprimé en pourcentage.

| Le convertisseur | Son rendement lumineux |
| Lampe à incandescence | Moins de 5 % |
| LED | Largement plus de 30 % |

## Le générateur réel
Sa **résistance interne** r dissipe une part de l'énergie produite :

U = E − r × I

où E est la force électromotrice.

> Plus le courant appelé est fort, plus la tension délivrée chute.

## Le bilan, toujours le même
énergie fournie = énergie utile + énergie dissipée`,
          },
          questions: [
            ['Quelle relation donne la puissance électrique d’un dipôle ?', ['P = U × I', 'P = U / I', 'P = U + I', 'P = U × I²'], 0, 'Avec U en volts et I en ampères, P est en watts.'],
            ['Quelle est l’expression de la puissance dissipée par effet Joule ?', ['P = R × I²', 'P = R × I', 'P = R / I', 'P = I / R'], 0, 'Elle varie avec le CARRÉ de l’intensité.'],
            ['Pourquoi transporte-t-on l’électricité à très haute tension ?', ['Pour réduire l’intensité, donc les pertes par effet Joule', 'Pour augmenter la puissance transportée', 'Pour diminuer la résistance des câbles', 'Pour éviter les courts-circuits'], 0, 'À puissance donnée, augmenter U diminue I, et les pertes varient en I².'],
            ['Un rendement peut-il dépasser 1 ?', ['Non, jamais', 'Oui, pour un générateur', 'Oui, avec une LED', 'Oui, en régime transitoire'], 0, 'L’énergie utile ne peut excéder l’énergie reçue.'],
            ['Combien de joules vaut un kilowattheure ?', ['3,6 × 10⁶ J', '1 000 J', '3 600 J', '10⁹ J'], 0, '1 kW pendant 3 600 s.'],
            ['La résistance interne d’un générateur fait chuter la tension à ses bornes quand le courant augmente.', ['Vrai', 'Faux'], 0, 'U = E − r × I : la chute est proportionnelle à l’intensité.'],
            ['Que dit la loi d’Ohm pour un conducteur ohmique ?', ['U = R × I', 'U = R / I', 'U = I / R', 'U = R × I²'], 0, 'La tension est proportionnelle à l’intensité qui le traverse.'],
            ['L’effet Joule est toujours un phénomène nuisible.', ['Vrai', 'Faux'], 1, 'Il est recherché dans un radiateur ou un grille-pain, subi ailleurs.'],
          ],
        },

        // ---- Chapitre 4 : constitution et transformations de la matière -----
        {
          titre: 'La mole et ses formules',
          axe: 'Constitution et transformations de la matière',
          lecon: {
            titre: 'Compter les entités sans les compter',
            cours: `Un chimiste ne compte pas les atomes un par un : il les pèse. La mole est le pont entre l'échelle de la balance et celle de la molécule.

## La mole
Une mole contient N(A) ≈ 6,02 × 10²³ entités — la **constante d'Avogadro**.

n = N / N(A)

## Les quatre relations à savoir
| On part de… | La relation | L'unité de la grandeur intermédiaire |
| Une **masse** | n = m / M | M, masse molaire, en g/mol |
| Un **gaz** | n = V / V(m) | V(m), volume molaire, environ 24 L/mol dans les conditions usuelles |
| Un **volume de liquide** | m = ρ × V, puis n = m / M | ρ, masse volumique, en g/L ou g/mL |
| Une **solution** | n = C × V | C, concentration en quantité de matière, en mol/L |

> Le volume molaire ne dépend **pas** de la nature du gaz.

> Piège classique : la masse molaire d'une molécule s'obtient en additionnant celles de tous ses atomes. Pour l'eau H₂O : 2 × 1,0 + 16,0 = 18,0 g/mol.

## Les deux concentrations
| La concentration | Son symbole | Son unité |
| En **masse** | t | g/L |
| En **quantité de matière** | C | mol/L |

Elles sont reliées par la masse molaire :

t = C × M

## La dilution
Diluer, c'est ajouter du solvant **sans changer la quantité de soluté**. D'où :

C(mère) × V(prélevé) = C(fille) × V(fille)

| L'étape | Le geste |
| 1 | Prélever V(prélevé) à la **pipette jaugée** |
| 2 | Verser dans une **fiole jaugée** de volume V(fille) |
| 3 | Compléter **au trait de jauge** |
| 4 | Boucher et **homogénéiser** |

Le **facteur de dilution** est le rapport C(mère) / C(fille).`,
          },
          questions: [
            ['Combien d’entités contient une mole ?', ['Environ 6,02 × 10²³', 'Environ 3,00 × 10⁸', 'Environ 1,60 × 10⁻¹⁹', 'Environ 6,63 × 10⁻³⁴'], 0, 'C’est la constante d’Avogadro.'],
            ['Quelle relation lie quantité de matière, masse et masse molaire ?', ['n = m / M', 'n = m × M', 'n = M / m', 'n = m + M'], 0, 'La masse molaire s’exprime en g/mol.'],
            ['Le volume molaire d’un gaz dépend de la nature de ce gaz.', ['Vrai', 'Faux'], 1, 'Dans les mêmes conditions de température et de pression, il est le même pour tous les gaz.'],
            ['Quelle est la masse molaire de l’eau H₂O ?', ['18,0 g/mol', '16,0 g/mol', '20,0 g/mol', '2,0 g/mol'], 0, '2 × 1,0 pour l’hydrogène + 16,0 pour l’oxygène.'],
            ['Quelle relation utilise-t-on pour une dilution ?', ['C(mère) × V(prélevé) = C(fille) × V(fille)', 'C(mère) × V(fille) = C(fille) × V(prélevé)', 'C(mère) + C(fille) = V', 'C(mère) / V(prélevé) = C(fille) × V(fille)'], 0, 'La quantité de soluté prélevée est conservée.'],
            ['Une dilution modifie la quantité de matière de soluté prélevée.', ['Vrai', 'Faux'], 1, 'Elle la conserve : seul le volume de solvant change.'],
            ['Comment passe-t-on de la concentration molaire à la concentration en masse ?', ['En multipliant par la masse molaire', 'En divisant par la masse molaire', 'En multipliant par le volume', 'En multipliant par la constante d’Avogadro'], 0, 't = C × M, en g/L.'],
            ['Quelle relation donne la quantité de matière d’un soluté en solution ?', ['n = C × V', 'n = C / V', 'n = V / C', 'n = C × M'], 0, 'Avec C en mol/L et V en litres.'],
          ],
        },
        {
          titre: 'Absorbance et spectre d’absorption',
          axe: 'Constitution et transformations de la matière',
          lecon: {
            titre: 'Doser une espèce colorée sans la toucher',
            cours: `Une espèce colorée absorbe une partie de la lumière qui la traverse. Mesurer cette absorption donne sa concentration sans prélèvement ni réaction.

## L'absorbance
L'**absorbance** A est une grandeur **sans unité**, mesurée par un spectrophotomètre. Elle vaut 0 pour une solution qui n'absorbe rien et croît avec la lumière retenue.

## Le spectre d'absorption
On trace A en fonction de la longueur d'onde. Le maximum obtenu, **λ(max)**, est la longueur d'onde la plus absorbée.

| Pourquoi travailler à λ(max) | La raison |
| **Sensibilité** | La variation d'absorbance est la plus forte |
| **Précision** | Un petit écart de réglage change peu le résultat |

> λ(max) correspond à la couleur **complémentaire** de la solution : une solution bleue absorbe dans le jaune-orangé, autour de 600 nm.

## La loi de Beer-Lambert
Pour une solution **diluée**, à une longueur d'onde donnée :

A = k × C

L'absorbance est **proportionnelle** à la concentration. Le coefficient k dépend de l'espèce, de la longueur d'onde et de la longueur de cuve traversée.

## Le dosage par étalonnage
1. Préparer une **gamme d'étalons** de concentrations connues, par dilutions successives d'une solution mère.
2. Régler le spectrophotomètre à **λ(max)** et faire le **blanc** avec le solvant seul.
3. Mesurer chaque étalon et tracer la **droite d'étalonnage** A = f(C), qui passe par l'origine.
4. Mesurer la solution inconnue et **lire sa concentration** sur la droite.

## Les limites
| La limite | Sa conséquence |
| Solutions **trop concentrées** | La droite s'incurve : la loi n'est plus valable |
| Espèce qui **réagit** | La concentration change pendant la mesure |
| Cuve sale ou rayée | Une trace de doigt fausse le résultat |`,
          },
          questions: [
            ['Quelle est l’unité de l’absorbance ?', ['Elle n’a pas d’unité', 'Le mol/L', 'Le mètre', 'Le hertz'], 0, 'C’est une grandeur sans dimension.'],
            ['Que dit la loi de Beer-Lambert ?', ['L’absorbance est proportionnelle à la concentration, pour une solution diluée', 'L’absorbance est inversement proportionnelle à la concentration', 'L’absorbance dépend uniquement du volume', 'L’absorbance est constante'], 0, 'A = k × C, à longueur d’onde et cuve fixées.'],
            ['À quelle longueur d’onde faut-il régler le spectrophotomètre ?', ['À λ(max), le maximum d’absorption de l’espèce étudiée', 'À 400 nm systématiquement', 'À la couleur de la solution', 'À n’importe quelle longueur d’onde'], 0, 'C’est là que la mesure est la plus sensible et la plus précise.'],
            ['Une solution bleue absorbe principalement dans le bleu.', ['Vrai', 'Faux'], 1, 'Elle absorbe la couleur COMPLÉMENTAIRE, le jaune-orangé.'],
            ['À quoi sert le « blanc » avant une série de mesures ?', ['À ne mesurer que l’absorption de l’espèce étudiée, sans celle du solvant et de la cuve', 'À nettoyer l’appareil', 'À vérifier la couleur de la solution', 'À diluer les étalons'], 0, 'Il fixe le zéro de l’appareil.'],
            ['La droite d’étalonnage A = f(C) passe par l’origine.', ['Vrai', 'Faux'], 0, 'Une solution de concentration nulle n’absorbe rien.'],
            ['La loi de Beer-Lambert reste valable pour une solution très concentrée.', ['Vrai', 'Faux'], 1, 'La proportionnalité se perd : la courbe s’incurve, il faut diluer.'],
            ['Comment prépare-t-on une gamme d’étalons ?', ['Par dilutions successives d’une solution mère de concentration connue', 'Par évaporation du solvant', 'Par mélange de solutions inconnues', 'Par chauffage progressif'], 0, 'Chaque étalon a une concentration parfaitement connue.'],
          ],
        },
        {
          titre: 'Modélisation de l’évolution d’une réaction chimique',
          axe: 'Constitution et transformations de la matière',
          lecon: {
            titre: 'Avancement, tableau et réactif limitant',
            cours: `Une transformation chimique se modélise par une équation équilibrée : mêmes atomes, en même nombre, de part et d'autre de la flèche. La charge se conserve aussi.

## L'avancement
L'**avancement** x, en moles, mesure la progression de la réaction. Il vaut 0 à l'état initial et croît jusqu'à x(max).

| L'espèce | Sa quantité à l'instant considéré |
| Un **réactif** | n = n(initial) − coefficient × x |
| Un **produit** | n = n(initial) + coefficient × x |

> Les **coefficients stœchiométriques** entrent directement dans le calcul : ils ne sont pas décoratifs.

## Le tableau d'avancement
Trois lignes — état initial, état intermédiaire, état final — et une colonne par espèce. C'est l'outil qui structure tout exercice de quantité de matière.

## Le réactif limitant
La réaction s'arrête quand le premier réactif est épuisé.

| L'étape | Le calcul |
| 1 | Pour chaque réactif, calculer n(initial) / coefficient |
| 2 | Le **plus petit rapport** désigne le **réactif limitant** |
| 3 | x(max) vaut ce rapport |

> Erreur fréquente : croire que le limitant est celui dont la quantité initiale est la plus faible. C'est faux dès que les coefficients diffèrent — il faut **diviser par le coefficient**.

## Le mélange stœchiométrique
Si tous les rapports sont égaux, tous les réactifs s'épuisent en même temps : aucun n'est gaspillé. C'est l'objectif d'une synthèse industrielle.

## Le bilan de matière
On remplace x par x(max) pour obtenir les quantités restantes, puis on convertit :

| La conversion | La formule |
| En **masse** | m = n × M |
| En **volume de gaz** | V = n × V(m) |

La comparaison à la mesure expérimentale donne le **rendement**.`,
          },
          questions: [
            ['Que mesure l’avancement d’une réaction ?', ['Le degré de progression de la réaction, en moles', 'La masse de produit formé', 'La vitesse de la réaction', 'La concentration des réactifs'], 0, 'Il vaut 0 à l’état initial et x(max) à l’état final.'],
            ['Comment identifie-t-on le réactif limitant ?', ['En comparant les rapports n(initial) divisé par le coefficient stœchiométrique', 'En prenant celui dont la quantité initiale est la plus faible', 'En prenant celui de plus grande masse molaire', 'En prenant celui qui est en solution'], 0, 'Le plus petit rapport désigne le limitant.'],
            ['Le réactif limitant est toujours celui dont la quantité initiale est la plus faible.', ['Vrai', 'Faux'], 1, 'C’est faux dès que les coefficients stœchiométriques diffèrent.'],
            ['Comment évolue la quantité d’un produit avec l’avancement ?', ['Elle augmente de coefficient × x', 'Elle diminue de coefficient × x', 'Elle reste constante', 'Elle est proportionnelle à 1 / x'], 0, 'Les réactifs, eux, voient leur quantité diminuer.'],
            ['Qu’est-ce qu’un mélange stœchiométrique ?', ['Un mélange où tous les réactifs sont épuisés simultanément', 'Un mélange où un réactif est en excès', 'Un mélange de volumes égaux', 'Un mélange de masses égales'], 0, 'Tous les rapports n(initial) / coefficient sont alors égaux.'],
            ['Une équation de réaction doit conserver les atomes et la charge.', ['Vrai', 'Faux'], 0, 'C’est la double condition d’un ajustement correct.'],
            ['Que vaut l’avancement à l’état initial ?', ['0', '1', 'x(max)', 'La quantité du réactif limitant'], 0, 'Il croît ensuite au fur et à mesure de la transformation.'],
            ['Comment convertit-on une quantité de matière de gaz en volume ?', ['V = n × V(m)', 'V = n / V(m)', 'V = n × M', 'V = n × C'], 0, 'V(m) vaut environ 24 L/mol dans les conditions usuelles.'],
          ],
        },
        {
          titre: 'Dosage par titrage',
          axe: 'Constitution et transformations de la matière',
          lecon: {
            titre: 'Trouver une concentration par une réaction',
            cours: `Un titrage détermine la concentration inconnue d'une espèce en la faisant réagir avec une solution de concentration connue, versée progressivement à la burette.

## Les deux acteurs
| Le réactif | Sa concentration | Où il se trouve |
| **Titré** | **Inconnue**, c'est ce qu'on cherche | Dans le bécher |
| **Titrant** | **Connue** | Dans la burette |

## Les conditions d'un bon titrage
La réaction support doit être :
- **totale** — sans quoi le calcul ne vaut rien ;
- **rapide** — pour que l'équivalence soit nette ;
- **unique** — aucune réaction parasite ;
- **repérable** — son terme doit se voir ou se mesurer.

## L'équivalence
C'est l'instant où les réactifs ont été introduits dans les **proportions stœchiométriques**.

| Le moment | Le réactif limitant |
| **Avant** l'équivalence | Le **titrant** |
| **Après** | Le titré a disparu, le titrant s'accumule |

Pour une réaction de coefficients 1-1 :

C(titré) × V(titré) = C(titrant) × V(équivalence)

> Si les coefficients diffèrent, ils entrent dans la relation. C'est l'erreur la plus fréquente en devoir.

## Comment repérer l'équivalence
| Le type de titrage | Ce qu'on suit | Où est l'équivalence |
| **Colorimétrique** | Une couleur | Au **premier changement persistant** — indicateur coloré, ou décoloration du permanganate |
| **Conductimétrique** | La conductivité | À l'**intersection des deux droites** |
| **pH-métrique** | Le pH | Au **saut de pH**, point d'inflexion repéré par les tangentes parallèles |

## Le mode opératoire
| Le geste | La verrerie |
| Prélever le titré | **Pipette jaugée** : précise |
| Verser le titrant | **Burette graduée** |

On peut ajouter de l'eau distillée dans le bécher **sans fausser le résultat** : elle change la concentration, pas la quantité de matière titrée.

> Ce qui compte, à l'équivalence, c'est une **quantité de matière** — pas une concentration.`,
          },
          questions: [
            ['Qu’est-ce que l’équivalence d’un titrage ?', ['L’instant où les réactifs ont été mélangés dans les proportions stœchiométriques', 'L’instant où la solution devient neutre', 'L’instant où la burette est vide', 'L’instant où la couleur disparaît totalement'], 0, 'Avant, le titrant est limitant ; après, c’est le titré qui a disparu.'],
            ['Quelle qualité la réaction support d’un titrage doit-elle avoir ?', ['Être totale, rapide et unique', 'Être lente et réversible', 'Être exothermique', 'Produire un gaz'], 0, 'Sans quoi la relation à l’équivalence ne serait pas exploitable.'],
            ['Ajouter de l’eau distillée dans le bécher fausse le résultat d’un titrage.', ['Vrai', 'Faux'], 1, 'La QUANTITÉ de matière titrée est inchangée : seule la concentration momentanée varie.'],
            ['Comment repère-t-on l’équivalence dans un titrage conductimétrique ?', ['À l’intersection des deux droites de la courbe', 'Au maximum de conductivité', 'Au changement de couleur', 'Au point où la conductivité s’annule'], 0, 'La conductivité varie linéairement de part et d’autre.'],
            ['Avec quel instrument prélève-t-on le réactif titré ?', ['La pipette jaugée', 'La burette graduée', 'L’éprouvette graduée', 'Le bécher'], 0, 'C’est l’instrument de prélèvement le plus précis.'],
            ['Dans un titrage pH-métrique, l’équivalence correspond au saut de pH.', ['Vrai', 'Faux'], 0, 'On la repère au point d’inflexion, par la méthode des tangentes.'],
            ['Que devient le réactif titrant après l’équivalence ?', ['Il s’accumule dans le mélange', 'Il est totalement consommé', 'Il précipite', 'Il se décompose'], 0, 'C’est ce qui rend visible le changement de couleur persistant.'],
            ['Les coefficients stœchiométriques interviennent-ils dans la relation à l’équivalence ?', ['Oui, dès qu’ils diffèrent de 1', 'Non, jamais', 'Uniquement en colorimétrie', 'Uniquement si un gaz se forme'], 0, 'Les oublier est l’erreur la plus fréquente en devoir.'],
          ],
        },

        // ---- Chapitre 5 : structure de la matière ---------------------------
        {
          titre: 'Représentation de Lewis d’un atome et d’une molécule',
          axe: 'Structure de la matière',
          lecon: {
            titre: 'Compter les électrons de valence',
            cours: `La représentation de Lewis montre comment les électrons de valence — ceux de la couche la plus externe — se répartissent dans une molécule.

## Compter les électrons de valence
Le nombre se lit dans le tableau périodique : il correspond au numéro de colonne, dont on retranche 10 pour les colonnes 13 à 18.

| L'atome | Ses électrons de valence | Ses liaisons | Ses doublets non liants |
| **Carbone** | 4 | **4** | 0 |
| **Azote** | 5 | **3** | 1 |
| **Oxygène** | 6 | **2** | 2 |
| **Halogène** | 7 | **1** | 3 |
| **Hydrogène** | 1 | **1** | 0 |

> Retenir cette colonne des liaisons évite de compter à chaque fois : elle donne directement la structure d'une molécule usuelle.

## La règle de l'octet
Un atome tend à s'entourer de **huit électrons** de valence, comme le gaz noble le plus proche — **deux** pour l'hydrogène, c'est la règle du duet.

## Établir un schéma de Lewis
1. Compter le **total** des électrons de valence de tous les atomes, en ajoutant ou retranchant pour un ion.
2. Placer les **liaisons simples** entre atomes voisins.
3. Compléter les octets avec les **doublets non liants**.
4. Si un atome reste incomplet, former une liaison **double** ou **triple**.

## De Lewis à la géométrie
Les doublets, liants comme non liants, se **repoussent** et s'écartent au maximum.

| Le nombre de doublets autour de l'atome | La géométrie |
| 2 | **Linéaire** |
| 3 | **Triangulaire plane** |
| 4 | **Tétraédrique** |

> C'est ainsi que l'eau est **coudée** — deux liaisons et deux doublets non liants autour de l'oxygène — et non linéaire. Cette différence explique ensuite toute sa chimie.`,
          },
          questions: [
            ['Que représente un schéma de Lewis ?', ['La répartition des électrons de valence dans une molécule', 'La position des noyaux atomiques', 'Le nombre de neutrons', 'L’énergie de la molécule'], 0, 'Doublets liants et doublets non liants y figurent.'],
            ['Combien de liaisons le carbone forme-t-il habituellement ?', ['Quatre', 'Deux', 'Trois', 'Une'], 0, 'Avec quatre électrons de valence, il complète son octet par quatre liaisons.'],
            ['Combien de doublets non liants porte l’atome d’oxygène dans l’eau ?', ['Deux', 'Un', 'Trois', 'Aucun'], 0, 'Deux liaisons et deux doublets non liants : six électrons de valence.'],
            ['La règle de l’octet s’applique à l’hydrogène.', ['Vrai', 'Faux'], 1, 'L’hydrogène suit la règle du DUET : deux électrons.'],
            ['Pourquoi la molécule d’eau est-elle coudée ?', ['Parce que les deux doublets non liants de l’oxygène repoussent les liaisons', 'Parce que l’hydrogène est petit', 'Parce qu’elle est polaire', 'Parce qu’elle est liquide'], 0, 'La répulsion entre doublets impose la géométrie.'],
            ['Combien d’électrons de valence possède l’azote ?', ['Cinq', 'Trois', 'Quatre', 'Six'], 0, 'Il forme donc trois liaisons et porte un doublet non liant.'],
            ['Un doublet non liant participe à une liaison entre deux atomes.', ['Vrai', 'Faux'], 1, 'Il appartient à un seul atome ; seul le doublet LIANT est partagé.'],
            ['Que faire si un atome reste incomplet après avoir placé les liaisons simples ?', ['Former une liaison double ou triple', 'Ajouter un atome d’hydrogène', 'Retirer un doublet non liant', 'Ioniser la molécule'], 0, 'C’est l’étape finale de la construction d’un schéma de Lewis.'],
          ],
        },
        {
          titre: 'Électronégativité des atomes et polarité des molécules',
          axe: 'Structure de la matière',
          lecon: {
            titre: 'Quand une liaison n’est pas partagée à égalité',
            cours: `L'électronégativité mesure la tendance d'un atome à attirer vers lui les électrons d'une liaison qu'il partage.

## Comment elle varie
| Le sens de parcours | L'électronégativité |
| De **gauche à droite** sur une période | Elle **augmente** |
| De **haut en bas** dans une colonne | Elle **diminue** |

Le **fluor** est le plus électronégatif, suivi de l'oxygène, de l'azote et du chlore. Les métaux le sont peu.

## Liaison polarisée
| Les deux atomes liés | La liaison | La notation |
| D'électronégativités **différentes** | **Polarisée** : le doublet est déplacé vers le plus électronégatif | δ− sur l'atome enrichi, δ+ sur l'autre |
| **Identiques** (H₂, O₂, Cl₂) | Non polarisée | Aucune |

> δ+ et δ− sont des **charges partielles**, pas des ions.

## Molécule polaire ou apolaire
Une molécule est **polaire** si ses liaisons sont polarisées **et** si les charges partielles ne se compensent pas.

| La molécule | Ses liaisons | Sa géométrie | Le verdict |
| **H₂O** | Polarisées | **Coudée** | **Polaire** : rien ne se compense |
| **CO₂** | Fortement polarisées | **Linéaire** et symétrique | **Apolaire** : les deux effets s'annulent |

> La géométrie compte donc autant que l'électronégativité. Deux molécules aux mêmes liaisons peuvent avoir des polarités opposées.

## Ce que la polarité commande
| La propriété | La règle |
| **Solubilité** | « Semblable dissout semblable » : polaire ou ionique dans l'eau ou l'éthanol ; apolaire dans le cyclohexane ou l'huile |
| **Température de changement d'état** | Les molécules polaires s'attirent davantage, donc bouillent plus haut à masse comparable |
| **Propriétés du vivant** | L'eau doit à sa polarité d'être un solvant biologique et d'avoir une tension superficielle élevée |`,
          },
          questions: [
            ['Que mesure l’électronégativité ?', ['La tendance d’un atome à attirer les électrons d’une liaison', 'La charge d’un ion', 'Le nombre d’électrons de valence', 'L’énergie d’ionisation'], 0, 'Elle décide de la polarisation des liaisons.'],
            ['Quel est l’élément le plus électronégatif ?', ['Le fluor', 'L’oxygène', 'L’azote', 'Le chlore'], 0, 'Suivi de l’oxygène, de l’azote et du chlore.'],
            ['La liaison dans la molécule de dioxygène O₂ est polarisée.', ['Vrai', 'Faux'], 1, 'Les deux atomes sont identiques : aucun ne l’emporte.'],
            ['La molécule de dioxyde de carbone CO₂ est-elle polaire ?', ['Non, sa géométrie linéaire compense les polarités', 'Oui, car ses liaisons sont polarisées', 'Oui, car elle contient de l’oxygène', 'Non, car ses liaisons ne sont pas polarisées'], 0, 'La géométrie compte autant que l’électronégativité.'],
            ['Que signifie la notation δ− sur un atome ?', ['Il porte une charge partielle négative', 'Il porte une charge entière négative', 'Il a perdu un électron', 'Il est un anion'], 0, 'Ce sont des charges PARTIELLES, non des ions.'],
            ['Comment varie l’électronégativité de gauche à droite dans une période ?', ['Elle augmente', 'Elle diminue', 'Elle reste constante', 'Elle varie sans règle'], 0, 'Et elle diminue de haut en bas dans une colonne.'],
            ['Un soluté polaire se dissout mieux dans un solvant polaire.', ['Vrai', 'Faux'], 0, 'C’est le principe « semblable dissout semblable ».'],
            ['À masse molaire comparable, une molécule polaire bout à plus haute température qu’une apolaire.', ['Vrai', 'Faux'], 0, 'Les interactions entre molécules polaires sont plus fortes à rompre.'],
          ],
        },
        {
          titre: 'Cohésion de la matière',
          axe: 'Structure de la matière',
          lecon: {
            titre: 'Ce qui tient les entités ensemble',
            cours: `Ce qui tient une molécule est différent de ce qui tient les molécules entre elles. Confondre les deux est l'erreur la plus coûteuse du chapitre.

## À l'intérieur : les liaisons fortes
| La liaison | Son principe | Ce qu'elle forme |
| **Covalente** | Un doublet partagé entre deux atomes | La molécule ; c'est elle qu'on rompt dans une réaction chimique |
| **Ionique** | Attraction entre ions de charges opposées | Un **solide ionique** : empilement régulier, électriquement neutre |

## Entre les entités : les interactions faibles
| L'interaction | Quand elle existe | Ce qui la renforce |
| **Van der Waals** | Entre **toutes** les molécules | La taille de la molécule et sa polarité |
| **Liaison hydrogène** | Un H lié à O, N ou F s'approche du doublet non liant d'un autre atome électronégatif | Plus forte que Van der Waals |

> Dans une famille d'alcanes, la température d'ébullition croît avec la longueur de la chaîne : les interactions de Van der Waals augmentent avec la taille.

> La liaison hydrogène explique l'anomalie de l'eau : à masse molaire comparable, elle devrait être gazeuse comme le sulfure d'hydrogène. Elle est liquide, et sa glace flotte.

## L'ordre de grandeur
Les interactions faibles sont **dix à cent fois** moins énergétiques que les liaisons covalentes.

> D'où une conséquence à retenir : **fondre** ou **vaporiser** un corps moléculaire ne casse **aucune** liaison covalente. Ces changements d'état ne rompent que les interactions entre molécules.

## La dissolution d'un solide ionique
| L'étape | Ce qui se passe |
| **Dissociation** | Les ions se séparent |
| **Solvatation** | Les molécules d'eau orientent leur pôle opposé vers chaque ion |
| **Dispersion** | Les ions solvatés se répartissent dans le solvant |

L'eau y réussit précisément parce qu'elle est **polaire**.`,
          },
          questions: [
            ['Quelle liaison est rompue lors d’une réaction chimique ?', ['La liaison covalente', 'La liaison hydrogène', 'L’interaction de Van der Waals', 'Aucune'], 0, 'Les interactions faibles, elles, sont rompues lors des changements d’état.'],
            ['La vaporisation d’un corps moléculaire rompt des liaisons covalentes.', ['Vrai', 'Faux'], 1, 'Elle ne rompt que les interactions ENTRE molécules.'],
            ['Entre quels atomes s’établit une liaison hydrogène ?', ['Un hydrogène lié à O, N ou F et un atome électronégatif porteur d’un doublet non liant', 'Deux atomes de carbone', 'Deux ions de charges opposées', 'Deux hydrogènes'], 0, 'Elle exige un atome très électronégatif des deux côtés.'],
            ['Pourquoi la température d’ébullition croît-elle avec la longueur d’une chaîne carbonée ?', ['Parce que les interactions de Van der Waals augmentent avec la taille', 'Parce que les liaisons covalentes se renforcent', 'Parce que la masse volumique augmente', 'Parce que la molécule devient polaire'], 0, 'Plus de contacts entre molécules, donc plus d’énergie à fournir.'],
            ['Les interactions de Van der Waals n’existent qu’entre molécules polaires.', ['Vrai', 'Faux'], 1, 'Elles existent entre TOUTES les molécules, et se renforcent avec la polarité.'],
            ['Qu’est-ce que la solvatation ?', ['L’entourage d’un ion par les molécules de solvant orientées', 'La dissociation d’un solide ionique', 'L’évaporation du solvant', 'La formation d’un précipité'], 0, 'C’est la deuxième étape de la dissolution.'],
            ['Pourquoi l’eau est-elle liquide à température ambiante malgré sa faible masse molaire ?', ['À cause des liaisons hydrogène entre ses molécules', 'À cause de sa masse volumique', 'À cause de sa géométrie linéaire', 'À cause de ses liaisons covalentes'], 0, 'Sans elles, elle serait gazeuse comme le sulfure d’hydrogène.'],
            ['Un solide ionique est électriquement neutre dans son ensemble.', ['Vrai', 'Faux'], 0, 'Les charges des cations et des anions s’y compensent exactement.'],
          ],
        },
        {
          titre: 'Solubilité et extraction par solvant',
          axe: 'Structure de la matière',
          lecon: {
            titre: 'Faire passer une espèce d’une phase à l’autre',
            cours: `La solubilité d'une espèce est la masse maximale que l'on peut dissoudre dans un litre de solvant, à une température donnée. Au-delà, la solution est saturée.

## Ce qui décide de la solubilité
| L'espèce | Le solvant qui la dissout | Des exemples |
| **Ionique** ou **polaire** | **Polaire** | Sel, sucre, éthanol dans l'eau |
| **Apolaire** | **Apolaire** | Huiles, diiode, hydrocarbures dans le cyclohexane ou l'éther |

> La règle tient en trois mots : **semblable dissout semblable**.

## L'effet de la température
| L'espèce dissoute | Quand la température monte |
| Un **solide** | Sa solubilité **augmente** presque toujours |
| Un **gaz** | Sa solubilité **diminue** |

> D'où une boisson gazeuse qui se dégaze en se réchauffant.

## L'extraction liquide-liquide
Faire passer une espèce d'un solvant à un autre. Deux conditions sur le solvant extracteur :
- il doit **mieux dissoudre** l'espèce recherchée que le solvant de départ ;
- il doit être **non miscible** avec lui, sans quoi les phases ne se sépareraient pas.

## Le mode opératoire
| L'étape | Le geste | Pourquoi |
| 1 | Verser mélange et solvant dans l'**ampoule à décanter** | — |
| 2 | Agiter en **dégazant** régulièrement | L'agitation libère des vapeurs qui font monter la pression |
| 3 | Laisser **décanter** | Les deux phases se séparent nettement |
| 4 | Récupérer chaque phase | — |

## Quelle phase est en haut
La moins **dense** surnage.

| Le solvant | Sa masse volumique | Sa position par rapport à l'eau |
| Dichlorométhane | 1,33 g/mL | **Dessous** |
| Éther | 0,71 g/mL | **Dessus** |

## Ensuite
Le solvant extracteur est éliminé par **évaporation**, laissant l'espèce extraite.

> Les mêmes principes gouvernent la **chromatographie sur couche mince**, où l'espèce se partage entre une phase fixe et une phase mobile — et qui sert à vérifier la pureté d'un produit de synthèse.`,
          },
          questions: [
            ['Qu’est-ce qu’une solution saturée ?', ['Une solution qui a atteint la solubilité maximale de l’espèce dissoute', 'Une solution très diluée', 'Une solution colorée', 'Une solution chauffée'], 0, 'Le surplus de soluté reste alors à l’état solide.'],
            ['Quelles conditions doit remplir un solvant extracteur ?', ['Mieux dissoudre l’espèce et être non miscible au solvant de départ', 'Être plus dense que l’eau', 'Être coloré', 'Être miscible au solvant de départ'], 0, 'Sans non-miscibilité, aucune séparation de phases n’est possible.'],
            ['La solubilité d’un gaz augmente avec la température.', ['Vrai', 'Faux'], 1, 'Elle DIMINUE : une boisson gazeuse se dégaze en se réchauffant.'],
            ['Quel matériel utilise-t-on pour une extraction liquide-liquide ?', ['L’ampoule à décanter', 'La burette graduée', 'Le réfrigérant à boules', 'La fiole jaugée'], 0, 'Elle permet d’agiter puis de soutirer la phase du bas.'],
            ['Comment savoir quelle phase se trouve au-dessus dans l’ampoule à décanter ?', ['En comparant les masses volumiques : la moins dense surnage', 'En comparant les couleurs', 'En comparant les volumes', 'La phase aqueuse est toujours en bas'], 0, 'Le dichlorométhane passe sous l’eau, l’éther au-dessus.'],
            ['Pourquoi faut-il dégazer pendant l’agitation ?', ['Parce que l’agitation libère des vapeurs qui font monter la pression', 'Pour mieux mélanger les phases', 'Pour accélérer la décantation', 'Pour refroidir le mélange'], 0, 'Sans dégazage, le bouchon peut être expulsé.'],
            ['Une espèce apolaire se dissout mieux dans le cyclohexane que dans l’eau.', ['Vrai', 'Faux'], 0, 'Semblable dissout semblable : le cyclohexane est apolaire.'],
            ['À quoi sert une chromatographie sur couche mince après une synthèse ?', ['À vérifier la pureté du produit obtenu', 'À mesurer sa masse', 'À le purifier par distillation', 'À déterminer sa concentration'], 0, 'L’espèce se partage entre une phase fixe et une phase mobile.'],
          ],
        },

        // ---- Chapitre 6 : propriétés physico-chimiques ----------------------
        {
          titre: 'Les différentes représentations des molécules et leur nomenclature',
          axe: 'Propriétés physico-chimiques',
          lecon: {
            titre: 'Écrire et nommer une molécule organique',
            cours: `Une même molécule s'écrit de plusieurs façons, du plus explicite au plus rapide.

## Les quatre représentations
| La formule | Ce qu'elle montre | Un exemple pour le butane |
| **Brute** | Le nombre de chaque atome, sans structure | C₄H₁₀ |
| **Développée** | Toutes les liaisons, hydrogènes compris | Toutes les liaisons dessinées |
| **Semi-développée** | Les liaisons avec les hydrogènes sont sous-entendues | CH₃−CH₂−CH₂−CH₃ |
| **Topologique** | Chaque extrémité et chaque sommet est un carbone ; les H portés par les C ne sont pas écrits | Une ligne brisée |

> Deux molécules de même formule brute mais de structures différentes sont des **isomères** — et n'ont pas les mêmes propriétés.

## Nommer une chaîne carbonée
1. Repérer la **chaîne principale**, la plus longue.
2. La **numéroter** de façon à donner les plus petits indices aux substituants ou à la fonction.
3. Nommer les **ramifications** en substituants (méthyl-, éthyl-), avec leur indice et un multiplicateur s'il y en a plusieurs (di-, tri-).
4. Ajouter la **terminaison** de la famille.

| Le nombre de carbones | Le préfixe |
| 1 | méth- |
| 2 | éth- |
| 3 | prop- |
| 4 | but- |
| 5 | pent- |
| 6 | hex- |
| 7 | hept- |
| 8 | oct- |

## Les familles au programme
| La famille | Sa terminaison |
| **Alcane** | -ane |
| **Alcène** | -ène, avec l'indice de la double liaison |
| **Alcool** | -ol |
| **Aldéhyde** | -al |
| **Cétone** | -one |
| **Acide carboxylique** | acide …-oïque |
| **Ester** | -oate de …-yle |
| **Amine** | -amine |

## Ce que la structure change
> À nombre de carbones égal, une chaîne **ramifiée** bout plus bas qu'une chaîne **linéaire** : ses molécules s'emboîtent moins bien, et les interactions de Van der Waals y sont plus faibles.`,
          },
          questions: [
            ['Que représente chaque sommet d’une formule topologique ?', ['Un atome de carbone', 'Un atome d’hydrogène', 'Une liaison double', 'Un groupe fonctionnel'], 0, 'Les hydrogènes portés par ces carbones ne sont pas écrits.'],
            ['Que sont deux isomères ?', ['Deux molécules de même formule brute et de structures différentes', 'Deux molécules identiques', 'Deux molécules de masses molaires différentes', 'Deux molécules du même groupe fonctionnel'], 0, 'Leurs propriétés diffèrent, parfois beaucoup.'],
            ['Quelle terminaison caractérise un alcool ?', ['-ol', '-al', '-one', '-ane'], 0, '-al pour l’aldéhyde, -one pour la cétone, -ane pour l’alcane.'],
            ['Comment numérote-t-on la chaîne principale ?', ['De façon à obtenir les plus petits indices', 'Toujours de gauche à droite', 'En partant du carbone le plus ramifié', 'Dans le sens de l’écriture'], 0, 'C’est la règle qui lève toute ambiguïté de nommage.'],
            ['Une formule brute renseigne sur l’enchaînement des atomes.', ['Vrai', 'Faux'], 1, 'Elle ne donne que le NOMBRE de chaque atome.'],
            ['Quel préfixe correspond à une chaîne principale de cinq carbones ?', ['pent-', 'but-', 'hex-', 'prop-'], 0, 'Méth-, éth-, prop-, but-, pent- : la série à connaître par cœur.'],
            ['À nombre de carbones égal, un alcane ramifié bout plus bas qu’un alcane linéaire.', ['Vrai', 'Faux'], 0, 'Ses molécules s’emboîtent moins bien : interactions de Van der Waals plus faibles.'],
            ['Quelle terminaison caractérise un acide carboxylique ?', ['acide …-oïque', '…-oate de …-yle', '-amine', '-ène'], 0, 'L’ester, lui, se nomme …-oate de …-yle.'],
          ],
        },
        {
          titre: 'Synthèse organique',
          axe: 'Propriétés physico-chimiques',
          lecon: {
            titre: 'Fabriquer, isoler, purifier, identifier',
            cours: `Une synthèse organique fabrique une espèce chimique au laboratoire. Le protocole suit toujours les mêmes quatre étapes, et chacune a sa raison d'être.

## Les quatre étapes
| L'étape | Ce qu'elle fait |
| 1. **Transformation** | Les réactifs réagissent |
| 2. **Isolement** | On sépare le produit du mélange |
| 3. **Purification** | On élimine les impuretés restantes |
| 4. **Identification** | On vérifie que c'est bien le produit voulu |

## 1. La transformation
Les réactifs sont mélangés dans un ballon, souvent **chauffés à reflux**. Le **réfrigérant** vertical condense les vapeurs, qui retombent dans le ballon : on chauffe **sans rien perdre**. La **pierre ponce** régule l'ébullition.

| Le facteur cinétique | Son effet |
| La **température** | Elle accélère la réaction |
| La **concentration** des réactifs | Elle l'accélère aussi |
| Un **catalyseur** | Il accélère sans être consommé et **sans modifier l'état final** |

## 2. L'isolement
| La technique | Quand l'employer |
| **Extraction** liquide-liquide | Le produit est plus soluble dans un autre solvant |
| **Filtration sur Büchner** | Le produit est solide |
| **Distillation** | Les températures d'ébullition diffèrent assez |

## 3. La purification
| L'état du produit | La technique | Son principe |
| **Solide** | **Recristallisation** | Dissoudre à chaud, refroidir lentement : le produit cristallise, les impuretés plus solubles restent en solution |
| **Liquide** | **Distillation fractionnée** | Séparer par températures d'ébullition |

## 4. L'identification
| La méthode | Ce qu'elle révèle |
| Température de **fusion** ou d'**ébullition** | Comparaison aux valeurs tabulées |
| **Chromatographie sur couche mince** | Trois dépôts — brut, purifié, référence : même hauteur de tache, même espèce |
| **Infrarouge** | Les groupes fonctionnels |
| **RMN** | Le squelette carboné |

## Le rendement
η = n(produit obtenu) / n(produit théorique maximal)

> Toujours inférieur à 1 : la réaction n'est jamais totale, et chaque manipulation en perd un peu. Le calculer suppose d'avoir identifié le **réactif limitant**.`,
          },
          questions: [
            ['À quoi sert un chauffage à reflux ?', ['Chauffer pour accélérer la réaction sans perdre de matière', 'Refroidir le mélange réactionnel', 'Séparer deux liquides', 'Purifier un solide'], 0, 'Le réfrigérant condense les vapeurs, qui retombent dans le ballon.'],
            ['Quels sont les deux facteurs cinétiques au programme ?', ['La température et la concentration des réactifs', 'La pression et le volume', 'La masse et la densité', 'Le pH et la couleur'], 0, 'Un catalyseur accélère aussi, mais il n’est pas un facteur cinétique au même titre.'],
            ['Un catalyseur modifie l’état final d’un système chimique.', ['Vrai', 'Faux'], 1, 'Il accélère seulement l’évolution, sans être consommé.'],
            ['Quelle technique purifie un solide obtenu par synthèse ?', ['La recristallisation', 'La distillation fractionnée', 'L’extraction liquide-liquide', 'La chromatographie'], 0, 'On dissout à chaud puis on laisse cristalliser lentement.'],
            ['Quelle spectroscopie révèle surtout les groupes fonctionnels ?', ['La spectroscopie infrarouge', 'La RMN', 'La spectrophotométrie UV-visible', 'La chromatographie'], 0, 'La RMN, elle, renseigne sur le squelette carboné.'],
            ['Le rendement d’une synthèse peut-il atteindre 100 % en pratique ?', ['Non, chaque étape en perd un peu', 'Oui, si la réaction est totale', 'Oui, avec un catalyseur', 'Oui, si le mélange est stœchiométrique'], 0, 'Réaction incomplète et pertes de manipulation s’additionnent.'],
            ['Sur une chromatographie, deux taches à la même hauteur signalent la même espèce chimique.', ['Vrai', 'Faux'], 0, 'C’est le principe de l’identification par comparaison à une référence.'],
            ['Pourquoi ajoute-t-on de la pierre ponce dans le ballon ?', ['Pour réguler l’ébullition', 'Pour catalyser la réaction', 'Pour colorer le mélange', 'Pour absorber les impuretés'], 0, 'Elle évite les soubresauts d’une ébullition brutale.'],
          ],
        },
        {
          titre: 'Les réactions de combustion',
          axe: 'Propriétés physico-chimiques',
          lecon: {
            titre: 'Énergie libérée et bilan de matière',
            cours: `Une combustion est la réaction d'un combustible avec le dioxygène, accompagnée d'une libération d'énergie. Elle est exothermique : elle cède de l'énergie au milieu.

## Complète ou incomplète
| La combustion | Le dioxygène | Les produits | Le danger |
| **Complète** | En excès | **Dioxyde de carbone** et **eau** | — |
| **Incomplète** | En défaut | **Monoxyde de carbone** (CO) et **suie** | CO est **inodore, incolore et mortel** |

> Le monoxyde de carbone se fixe sur l'hémoglobine à la place du dioxygène. C'est la première cause d'intoxication domestique liée au chauffage. La suie rend la flamme jaune et fumeuse.

## Ajuster l'équation
Exemple du méthane : CH₄ + 2 O₂ → CO₂ + 2 H₂O

| L'ordre à suivre | L'élément |
| 1 | Le **carbone** |
| 2 | L'**hydrogène** |
| 3 | L'**oxygène**, en dernier |

## L'énergie libérée
Le **pouvoir calorifique** est l'énergie libérée par la combustion complète d'un kilogramme — ou d'un mètre cube — de combustible.

E = m × pouvoir calorifique

| Le bilan par les énergies de liaison | Son signe |
| **Rompre** les liaisons des réactifs | Coûte de l'énergie |
| **Former** celles des produits | En libère |
| Le total, pour une réaction exothermique | **Négatif** |

## L'enjeu environnemental
| Le combustible | Le carbone libéré | Le bilan |
| **Fossile** | Stocké depuis des millions d'années | Un **ajout net** à l'atmosphère |
| **Biomasse** | Prélevé récemment par photosynthèse | Un bilan de nature différente |

> Cela ne supprime pas les autres polluants émis : particules fines, oxydes d'azote.`,
          },
          questions: [
            ['Quels sont les produits d’une combustion complète d’un hydrocarbure ?', ['Du dioxyde de carbone et de l’eau', 'Du monoxyde de carbone et de la suie', 'Du dioxygène et du carbone', 'De l’eau seulement'], 0, 'La combustion incomplète, elle, produit CO et des particules.'],
            ['Une combustion est une réaction endothermique.', ['Vrai', 'Faux'], 1, 'Elle est EXOTHERMIQUE : elle libère de l’énergie vers le milieu.'],
            ['Quel gaz dangereux se forme lors d’une combustion incomplète ?', ['Le monoxyde de carbone', 'Le dioxyde de carbone', 'Le dioxygène', 'Le diazote'], 0, 'Inodore et incolore, il se fixe sur l’hémoglobine à la place du dioxygène.'],
            ['Dans quel ordre ajuste-t-on l’équation d’une combustion ?', ['Carbone, hydrogène, puis oxygène', 'Oxygène, carbone, puis hydrogène', 'Hydrogène, oxygène, puis carbone', 'Dans n’importe quel ordre'], 0, 'L’oxygène en dernier, parce qu’il apparaît dans les deux produits.'],
            ['Qu’est-ce que le pouvoir calorifique d’un combustible ?', ['L’énergie libérée par la combustion complète d’un kilogramme de ce combustible', 'La température de sa flamme', 'La masse de CO₂ produite', 'Le volume de dioxygène nécessaire'], 0, 'Il permet de calculer l’énergie dégagée par une masse donnée.'],
            ['Une flamme jaune et fumeuse signale une combustion complète.', ['Vrai', 'Faux'], 1, 'Elle signale une combustion INCOMPLÈTE, avec formation de suie.'],
            ['Comment le bilan carbone de la biomasse diffère-t-il de celui des combustibles fossiles ?', ['Le carbone relâché a été prélevé récemment par photosynthèse', 'La biomasse ne produit pas de CO₂', 'La biomasse libère moins d’énergie', 'La biomasse ne produit aucun polluant'], 0, 'Les fossiles, eux, libèrent un carbone stocké depuis des millions d’années.'],
            ['Comment calcule-t-on l’énergie d’une réaction à partir des énergies de liaison ?', ['En comparant l’énergie dépensée pour rompre les liaisons et celle libérée en en formant', 'En additionnant toutes les énergies de liaison', 'En multipliant par la masse molaire', 'En mesurant la température de la flamme'], 0, 'Le bilan est négatif pour une réaction exothermique.'],
          ],
        },
      ],
    },
  ],
}
