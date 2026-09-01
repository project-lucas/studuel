// Physique-chimie — Sixième : LE PROGRAMME COMPLET (10 fiches).
//
// LE DÉFAUT. La page « Physique-chimie » d'un élève de 6e s'ouvrait sur DEUX
// fiches héritées du tout premier jeu de données (migration 008) : « États et
// changements d'état » et « Sources et formes d'énergie ». Deux lignes pour une
// année entière — c'était, avec la technologie, la matière la plus pauvre de
// toute l'application.
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 4 chapitres de la maquette de référence et
// leurs 10 fiches :
//   1. Décrire les états et la constitution de la matière (3)
//   2. Observer et décrire les différents types de mouvements (2)
//   3. Identifier différentes sources d'énergie et quelques conversions (3)
//   4. Identifier un signal et une information (2)
//
// POURQUOI CE MODULE EST ÉCRIT ET NON IMPORTÉ. La physique-chimie de 5e, 4e et
// 3e partage un seul module (le cycle 4 est écrit d'un bloc par le BO, cf. la
// campagne 300 → 312). La 6e ne s'y raccroche PAS : elle appartient au CYCLE 3,
// avec l'école élémentaire, et son programme est celui des « sciences et
// technologie » — quatre thèmes qui n'ont pas le même découpage ni le même
// niveau d'exigence que le cycle 4. L'importer aurait mis des réactions
// chimiques et des équations devant des élèves de onze ans.
//
// ⚠️ PAS DE LATEX. `components/LessonRichContent` ne le rend pas : les formules
// s'écrivent en texte (v = d ÷ t, 25 °C).
//
// ⚠️ Le slug `physique-chimie` porte plusieurs modules (2de = 289, 3e = 295,
// Tle = 252, 1re = 270, celui-ci = 6e) : ne JAMAIS générer avec
// `--slugs physique-chimie`. Toujours `--modules physique-chimie-6e`.

export default {
  slug: 'physique-chimie',
  nom: 'Physique-Chimie',

  titreMigration: 'PHYSIQUE-CHIMIE 6e — LE PROGRAMME COMPLET (10 fiches)',

  motif: `CONSTAT : la physique-chimie de 6e n'avait que DEUX fiches, héritées du premier
jeu de données de l'app (« États et changements d'état », « Sources et formes
d'énergie »). C'était la matière la plus pauvre de l'application, dans la classe
qui accueille les nouveaux collégiens. Un élève qui révisait les mélanges, la
trajectoire, la vitesse, les conversions d'énergie ou la transmission d'un signal
ne trouvait RIEN. Cette migration installe les 10 fiches du programme, rangées
sous les 4 chapitres de la maquette, et retire les 2 fiches génériques.
LE CONTENU EST ÉCRIT, PAS IMPORTÉ du cycle 4 : la 6e appartient au CYCLE 3, dont
le programme de sciences n'a ni le même découpage ni le même niveau d'exigence.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit : ce
module range ses 10 fiches sous 4 chapitres, et l'INSERT écrit la colonne. Elle
est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que
la 234 soit passée en production — sans cette reprise, la migration échouerait
sur "column chapters.theme does not exist", les 2 anciens chapitres déjà
supprimés et les 10 neufs pas encore posés : une matière vide.
Le ménage qui suit LIT cette colonne : elle doit exister avant lui.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 2 chapitres hérités de la 008 partent, au niveau 6e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE. Le critère « pas de chapitre de
programme » vise exactement les deux lignes voulues : elles datent de la 008,
bien avant la colonne theme, tandis que les 10 fiches neuves en portent une dès
l'INSERT — le ménage tourne AVANT les insertions et ne peut donc jamais mordre
sur elles, ni au premier passage ni au rejeu.
Le filtre level = '6e' est indispensable : la physique-chimie existe sur sept
niveaux, et la 5e comme la 4e et la 3e ont leurs propres migrations.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL), puis les
chapitres, dont les leçons partent en cascade.`,
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
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '6e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['6e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Décrire les états et la constitution de la matière
        // ===================================================================
        {
          titre: 'La matière',
          axe: 'Décrire les états et la constitution de la matière à l’échelle macroscopique',
          lecon: {
            titre: 'Trois états, une seule matière',
            cours: `Tout ce qui nous entoure est fait de matière : elle occupe de la place et possède une masse. Elle se présente sous trois états.

## Les trois états
| L’état | Sa forme | Son volume | Exemple |
| **Solide** | **Propre** | **Propre** | Un glaçon garde sa forme dans n’importe quel récipient |
| **Liquide** | **Aucune** | **Propre** | L’eau prend la forme du verre ; sa surface libre reste **horizontale** |
| **Gaz** | **Aucune** | **Aucun** | Il occupe **tout** l’espace disponible |

## Les changements d’état
| Le passage | Son nom |
| Solide → liquide | **Fusion** |
| Liquide → solide | **Solidification** |
| Liquide → gaz | **Vaporisation** |
| Gaz → liquide | **Liquéfaction** |
| Solide → gaz **directement** | **Sublimation** |

~ Solidification ← Solide → Fusion → Liquide → Vaporisation → Gaz

## La température ne bouge pas pendant le changement
= L’eau pure fond à 0 °C · L’eau pure bout à 100 °C

!> Pendant qu’un glaçon fond, la température reste **bloquée à 0 °C** tant qu’il reste de la glace. Chauffer plus fort ne la fait pas monter : l’énergie sert à faire fondre.

> Un changement d’état ne change **pas la matière** : la glace, l’eau liquide et la vapeur sont toutes de l’eau.

## La masse se conserve, le volume non
| La grandeur | Ce qu’elle devient |
| La **masse** | 100 g de glace donnent **100 g** d’eau |
| Le **volume** | Il **change** : la glace occupe **plus** de place |

!> C’est pourquoi une bouteille pleine peut **éclater** au congélateur.

## Solide compact, solide divisé
| Le solide | Son comportement |
| **Compact** | Un caillou : un seul bloc |
| **Divisé** | Le sable, la farine : ils s’écoulent comme un liquide, mais **chaque grain garde sa forme** |`,
          },
          questions: [
            ['Quel état a un volume propre mais pas de forme propre ?', ['Le liquide', 'Le solide', 'Le gaz', 'Aucun'], 0, 'Un liquide prend la forme de son récipient.'],
            ['Comment s’appelle le passage de l’état solide à l’état liquide ?', ['La fusion', 'La solidification', 'La vaporisation', 'La liquéfaction'], 0, 'Le sens inverse est la solidification.'],
            ['Comment s’appelle le passage de l’état gazeux à l’état liquide ?', ['La liquéfaction', 'La vaporisation', 'La sublimation', 'La fusion'], 0, 'C’est ce qui se passe sur une vitre froide.'],
            ['À quelle température l’eau pure bout-elle sous la pression normale ?', ['100 °C', '0 °C', '50 °C', '212 °C'], 0, 'Et elle fond à 0 °C.'],
            ['Que devient la température pendant qu’un glaçon fond ?', ['Elle reste bloquée à 0 °C', 'Elle monte régulièrement', 'Elle descend', 'Elle monte puis descend'], 0, 'Elle ne repart qu’une fois toute la glace fondue.'],
            ['Si 100 g de glace fondent, quelle masse d’eau obtient-on ?', ['100 g', 'Moins de 100 g', 'Plus de 100 g', 'On ne peut pas savoir'], 0, 'La masse se conserve lors d’un changement d’état.'],
            ['Pourquoi une bouteille pleine d’eau peut-elle éclater au congélateur ?', ['La glace occupe un volume plus grand que l’eau liquide', 'La masse de l’eau augmente', 'Le froid fragilise le plastique seul', 'L’eau se transforme en gaz'], 0, 'La masse ne change pas, mais le volume augmente.'],
            ['Le sable est un solide divisé.', ['Vrai', 'Faux'], 0, 'Chaque grain garde sa forme, mais l’ensemble s’écoule.'],
          ],
        },
        {
          titre: 'Les propriétés de la matière',
          axe: 'Décrire les états et la constitution de la matière à l’échelle macroscopique',
          lecon: {
            titre: 'Mesurer pour reconnaître',
            cours: `Pour décrire un échantillon de matière, on mesure des grandeurs. Chacune a son instrument et son unité.

## Les trois grandeurs
| La grandeur | Son instrument | Son unité |
| La **masse** | La **balance** | Le **kilogramme (kg)** |
| Le **volume** | L’**éprouvette graduée** | Le **litre (L)** |
| La **température** | Le **thermomètre** | Le **degré Celsius (°C)** |

## La masse
= 1 kg = 1 000 g · 1 g = 1 000 mg

!> La masse ne dépend **pas du lieu** : un objet de 2 kg a la même masse sur la Lune.

## Le volume
= 1 L = 1 000 mL · 1 mL = 1 cm³

~ Poser l’éprouvette à plat → se placer à hauteur de la graduation → lire au BAS du ménisque

## Reconnaître un corps pur
Chaque matière a des **températures de changement d’état** qui lui sont propres : l’eau pure fond à 0 °C, l’alcool bien plus bas.

> Mesurer ces températures permet donc d’**identifier** une substance. C’est une carte d’identité.

## L’air a une masse
~ Peser un ballon dégonflé → le gonfler → le repeser → il est PLUS LOURD

= Un litre d’air pèse environ 1,2 g

> Invisible ne veut pas dire immatériel.

## Trois mots à ne pas confondre
| Le mot | Ce qu’il désigne | Son unité |
| La **masse** | La quantité de matière | Le kg |
| Le **volume** | La place occupée | Le L |
| Le **poids** | L’attraction de la Terre | Ce n’est **pas** la masse |`,
          },
          questions: [
            ['Avec quel instrument mesure-t-on une masse ?', ['Une balance', 'Une éprouvette graduée', 'Un thermomètre', 'Un chronomètre'], 0, 'Le résultat s’exprime en kg ou en g.'],
            ['À combien de millilitres correspond 1 litre ?', ['1 000 mL', '100 mL', '10 mL', '10 000 mL'], 0, 'Et 1 mL vaut 1 cm³.'],
            ['À quoi correspond 1 mL ?', ['1 cm³', '1 dm³', '1 m³', '1 g'], 0, 'C’est l’équivalence à retenir entre volume et capacité.'],
            ['Où lit-on le niveau dans une éprouvette graduée ?', ['Au bas du ménisque, l’œil à la hauteur de la graduation', 'Au sommet du ménisque', 'Au milieu du liquide', 'Peu importe'], 0, 'Une lecture de biais fausse la mesure.'],
            ['Quelle est l’unité de la température ?', ['Le degré Celsius', 'Le gramme', 'Le litre', 'Le newton'], 0, 'Elle se mesure au thermomètre.'],
            ['Combien pèse environ un litre d’air ?', ['1,2 g', '1,2 kg', '12 g', '0 g, l’air n’a pas de masse'], 0, 'On le montre en pesant un ballon gonflé puis dégonflé.'],
            ['Comment peut-on identifier une substance pure ?', ['Par ses températures de changement d’état', 'Par sa couleur seulement', 'Par son volume', 'Par sa forme'], 0, 'L’eau pure fond à 0 °C et bout à 100 °C.'],
            ['La masse d’un objet change si on l’emporte sur la Lune.', ['Vrai', 'Faux'], 1, 'C’est le poids qui change, pas la masse.'],
          ],
        },
        {
          titre: 'Les mélanges',
          axe: 'Décrire les états et la constitution de la matière à l’échelle macroscopique',
          lecon: {
            titre: 'Ce qui se mélange, ce qui se sépare',
            cours: `Un corps pur ne contient qu’une seule substance. Un mélange en contient plusieurs — et il y a deux façons de mélanger.

## Deux familles de mélanges
| Le mélange | Ce qu’on voit | Exemples |
| **Homogène** | On ne distingue **pas** les constituants, même à la loupe | Eau + sel, eau + sirop, l’air |
| **Hétérogène** | On distingue au moins deux constituants | Eau + huile, eau + sable, jus d’orange avec pulpe |

## La dissolution
~ Le soluté (le sel) + le solvant (l’eau) → la solution

!> Le sel qui « disparaît » ne s’évapore pas : il se **dissout**. La masse le prouve.

= 100 g d’eau + 5 g de sel = 105 g de solution

## La saturation
Au-delà d’une certaine quantité, le solvant ne peut plus rien dissoudre : la solution est **saturée**, et le surplus reste au fond.

## Séparer les constituants
| La technique | Ce qu’elle fait | Ce qu’on obtient |
| La **décantation** | On laisse reposer, le plus lourd tombe, on transvase doucement | Deux couches séparées |
| La **filtration** | Un filtre retient les particules solides | Le liquide qui passe est le **filtrat** |
| L’**évaporation** | On chauffe pour faire partir le solvant | On récupère le **soluté** — c’est le sel des marais salants |

!> **La filtration ne sépare PAS un mélange homogène.** De l’eau salée filtrée reste salée : le sel est dissous, pas en morceaux.

## L’air est un mélange
= 78 % de diazote · 21 % de dioxygène · 1 % d’autres gaz

C’est un mélange **homogène** de gaz.`,
          },
          questions: [
            ['Comment appelle-t-on un mélange dont on ne distingue pas les constituants ?', ['Homogène', 'Hétérogène', 'Pur', 'Saturé'], 0, 'L’eau salée en est un exemple.'],
            ['Le mélange eau + huile est…', ['hétérogène', 'homogène', 'un corps pur', 'une solution'], 0, 'On distingue nettement deux couches.'],
            ['Dans l’eau salée, comment appelle-t-on le sel ?', ['Le soluté', 'Le solvant', 'Le filtrat', 'La solution'], 0, 'L’eau est le solvant.'],
            ['On dissout 5 g de sel dans 100 g d’eau. Quelle est la masse de la solution ?', ['105 g', '100 g', '95 g', 'Cela dépend de la température'], 0, 'La masse se conserve lors d’une dissolution.'],
            ['Que signifie « solution saturée » ?', ['Le solvant ne peut plus rien dissoudre', 'La solution est colorée', 'Le mélange est hétérogène', 'Le soluté s’est évaporé'], 0, 'Le surplus reste au fond du récipient.'],
            ['Quelle technique sépare l’eau et le sable ?', ['La filtration', 'L’évaporation seule', 'La dissolution', 'Rien ne les sépare'], 0, 'La décantation fonctionne aussi.'],
            ['Quel gaz est le plus abondant dans l’air ?', ['Le diazote, environ 78 %', 'Le dioxygène, environ 78 %', 'Le dioxyde de carbone', 'La vapeur d’eau'], 0, 'Le dioxygène représente environ 21 %.'],
            ['La filtration permet de séparer l’eau et le sel dissous.', ['Vrai', 'Faux'], 1, 'Il faut évaporer l’eau : un mélange homogène ne se filtre pas.'],
          ],
        },

        // ===================================================================
        // Chapitre 2 : Observer et décrire les différents types de mouvements
        // ===================================================================
        {
          titre: 'La trajectoire et la vitesse moyenne',
          axe: 'Observer et décrire les différents types de mouvements',
          lecon: {
            titre: 'Décrire un mouvement, c’est d’abord choisir d’où on regarde',
            cours: `Dire « la voiture bouge » sans dire par rapport à quoi, c’est une phrase incomplète.

## Le mouvement dépend du point de vue
Un passager assis dans un train est **immobile par rapport au train**, et **en mouvement par rapport au quai**.

= Le référentiel : l’objet par rapport auquel on décrit le mouvement

!> Il faut **toujours** le préciser. Sans référentiel, la question « est-ce que ça bouge ? » n’a pas de réponse.

## La trajectoire
La **trajectoire** est la ligne décrite par un point de l’objet au cours du temps.

| La trajectoire | Sa forme | Exemple |
| **Rectiligne** | Une ligne droite | Une bille sur une table lisse |
| **Circulaire** | Un cercle | Une nacelle de grande roue, la valve d’une roue de vélo |
| **Curviligne** | Une courbe quelconque | Un ballon lancé |

## La vitesse moyenne
= v = d ÷ t

= 30 km en 2 h → v = 30 ÷ 2 = 15 km/h

## Les unités, et le piège
!> La distance et la durée doivent être dans les **mêmes unités** que la vitesse demandée : pour des **m/s**, il faut des **mètres** et des **secondes**.

= Pour passer de km/h à m/s : diviser par 3,6 · 36 km/h = 10 m/s

## Les deux autres formules
| On cherche | La formule |
| La **distance** | d = v × t |
| La **durée** | t = d ÷ v |

## Moyenne ne veut pas dire constante
!> Une vitesse moyenne de 15 km/h ne dit **pas** que le cycliste roulait à 15 km/h à chaque instant : il a pu s’arrêter, puis accélérer.`,
          },
          questions: [
            ['Que faut-il préciser pour décrire un mouvement ?', ['Le référentiel, c’est-à-dire par rapport à quoi on l’observe', 'La couleur de l’objet', 'La masse de l’objet', 'Rien de particulier'], 0, 'Un passager est immobile dans le train, en mouvement pour le quai.'],
            ['Quelle est la trajectoire d’une nacelle de grande roue ?', ['Circulaire', 'Rectiligne', 'Curviligne quelconque', 'Elle n’en a pas'], 0, 'Elle décrit un cercle.'],
            ['Quelle formule donne la vitesse moyenne ?', ['v = d ÷ t', 'v = d × t', 'v = t ÷ d', 'v = d + t'], 0, 'On divise la distance par la durée.'],
            ['Un cycliste parcourt 30 km en 2 h. Quelle est sa vitesse moyenne ?', ['15 km/h', '60 km/h', '30 km/h', '2 km/h'], 0, '30 ÷ 2 = 15.'],
            ['Combien font 36 km/h en m/s ?', ['10 m/s', '36 m/s', '100 m/s', '3,6 m/s'], 0, 'On divise par 3,6 pour passer des km/h aux m/s.'],
            ['Quelle formule donne la distance parcourue ?', ['d = v × t', 'd = v ÷ t', 'd = t ÷ v', 'd = v + t'], 0, 'Elle se déduit de v = d ÷ t.'],
            ['Une trajectoire en ligne droite est dite…', ['rectiligne', 'circulaire', 'curviligne', 'uniforme'], 0, 'Le mot décrit la forme, pas la vitesse.'],
            ['Une vitesse moyenne de 15 km/h signifie que l’objet allait à 15 km/h à chaque instant.', ['Vrai', 'Faux'], 1, 'La moyenne masque les arrêts et les accélérations.'],
          ],
        },
        {
          titre: 'Les variations de vitesse',
          axe: 'Observer et décrire les différents types de mouvements',
          lecon: {
            titre: 'Uniforme, accéléré, ralenti',
            cours: `Décrire un mouvement demande deux choses : la forme du chemin, et l’évolution de la vitesse.

## Les trois cas
| Le mouvement | Sa vitesse | Exemple |
| **Uniforme** | Elle ne **change pas** | Un escalator, un tapis roulant |
| **Accéléré** | Elle **augmente** | Une bille qui dévale une pente, une voiture qui démarre |
| **Ralenti** (décéléré) | Elle **diminue** | Un vélo qui freine, une balle lancée vers le haut |

## Deux mots pour deux choses
!> **Trajectoire** et **vitesse** sont indépendantes. Un mouvement peut être **circulaire uniforme** (une nacelle de grande roue) ou **rectiligne accéléré** (une voiture qui démarre tout droit).

Le **rectiligne uniforme** est le cas le plus simple : chemin droit **et** vitesse constante.

## Lire une chronophotographie
Une **chronophotographie** prend des photos à intervalles de temps **réguliers**.

| Les écarts entre positions | Le mouvement est… |
| **Égaux** | **Uniforme** |
| Ils **s’agrandissent** | **Accéléré** |
| Ils **se resserrent** | **Ralenti** |

~ Photos à intervalles réguliers → mesurer les écarts → lire le mouvement

> C’est l’**espacement** qui parle, parce que la durée entre deux images est toujours la même.

## Pourquoi ça compte
La **distance de freinage** d’un véhicule augmente très vite avec la vitesse.

!> Un mouvement ralenti **ne s’arrête pas instantanément**. C’est exactement la raison pour laquelle on ne traverse pas devant une voiture qui freine.`,
          },
          questions: [
            ['Comment appelle-t-on un mouvement dont la vitesse ne change pas ?', ['Uniforme', 'Accéléré', 'Ralenti', 'Rectiligne'], 0, 'Le mot « rectiligne » décrit la trajectoire, pas la vitesse.'],
            ['Une bille qui dévale une pente a un mouvement…', ['accéléré', 'uniforme', 'ralenti', 'circulaire'], 0, 'Sa vitesse augmente.'],
            ['Sur une chronophotographie, que signifient des écarts qui s’agrandissent ?', ['Le mouvement est accéléré', 'Le mouvement est uniforme', 'Le mouvement est ralenti', 'L’objet est immobile'], 0, 'La durée entre deux images est toujours la même.'],
            ['Sur une chronophotographie, que signifient des écarts égaux ?', ['Le mouvement est uniforme', 'Le mouvement est accéléré', 'Le mouvement est ralenti', 'La trajectoire est circulaire'], 0, 'La vitesse ne change pas.'],
            ['Qu’est-ce qu’une chronophotographie ?', ['Une série de photos prises à intervalles de temps réguliers', 'Une photo prise très vite', 'Un film au ralenti', 'Un graphique de vitesse'], 0, 'C’est la régularité de l’intervalle qui permet la lecture.'],
            ['Un mouvement peut-il être circulaire et uniforme à la fois ?', ['Oui : la trajectoire et la vitesse sont deux choses différentes', 'Non, circulaire implique accéléré', 'Non, uniforme implique rectiligne', 'Seulement pour un satellite'], 0, 'Une nacelle de grande roue en est un exemple.'],
            ['Un vélo qui freine a un mouvement…', ['ralenti', 'uniforme', 'accéléré', 'immobile'], 0, 'Sa vitesse diminue.'],
            ['« Rectiligne » et « uniforme » disent la même chose.', ['Vrai', 'Faux'], 1, 'L’un décrit la trajectoire, l’autre la vitesse.'],
          ],
        },

        // ===================================================================
        // Chapitre 3 : Identifier différentes sources d'énergie
        // ===================================================================
        {
          titre: 'Les différentes formes d’énergie',
          axe: 'Identifier différentes sources d’énergie et connaître quelques conversions',
          lecon: {
            titre: 'L’énergie, ce qui permet d’agir',
            cours: `Posséder de l’énergie, c’est pouvoir mettre en mouvement, chauffer, éclairer ou déformer.

## Les principales formes
| La forme | À quoi elle est liée |
| **Cinétique** | Le **mouvement** — elle augmente avec la masse, et **beaucoup** avec la vitesse |
| **De position** | La **hauteur** : l’eau d’un barrage |
| **Thermique** | La **température** |
| **Électrique** | Ce qui circule dans les fils |
| **Lumineuse** | Transportée par la lumière |
| **Chimique** | Stockée dans les aliments, le bois, l’essence, une pile |
| **Nucléaire** | Le noyau des atomes |

## Les sources d’énergie
| La famille | Sa définition | Ses membres |
| **Renouvelables** | Elles se reconstituent à l’échelle humaine | Soleil, vent, eau, biomasse, géothermie |
| **Non renouvelables** | Leurs réserves s’épuisent | Charbon, pétrole, gaz naturel (les **fossiles**), uranium |

## L’unité
= L’énergie se mesure en joules (J)

Pour l’électricité domestique, on utilise le **kilowattheure (kWh)** — celui qui figure sur les factures.

> Le **Soleil** est la source d’origine de presque toutes les autres : le vent, la pluie, les plantes et même le pétrole en descendent.

## Une chaîne d’énergie
~ Source → convertisseur → utilisation

~ Pile (chimique) → ampoule → lumière et chaleur`,
          },
          questions: [
            ['Quelle forme d’énergie possède un objet en mouvement ?', ['L’énergie cinétique', 'L’énergie de position', 'L’énergie chimique', 'L’énergie thermique'], 0, 'Elle augmente avec la masse et la vitesse.'],
            ['Quelle énergie est stockée dans les aliments et l’essence ?', ['L’énergie chimique', 'L’énergie cinétique', 'L’énergie lumineuse', 'L’énergie nucléaire'], 0, 'Une pile en stocke également.'],
            ['Quelle est l’unité de l’énergie ?', ['Le joule', 'Le watt', 'Le newton', 'Le degré Celsius'], 0, 'Le kilowattheure sert pour l’électricité domestique.'],
            ['Laquelle de ces sources est renouvelable ?', ['Le vent', 'Le charbon', 'Le pétrole', 'L’uranium'], 0, 'Elle se reconstitue à l’échelle humaine.'],
            ['Comment appelle-t-on le charbon, le pétrole et le gaz naturel ?', ['Des énergies fossiles', 'Des énergies renouvelables', 'Des énergies nucléaires', 'Des convertisseurs'], 0, 'Leurs réserves s’épuisent.'],
            ['Quelle énergie possède l’eau retenue en haut d’un barrage ?', ['L’énergie de position', 'L’énergie cinétique', 'L’énergie chimique', 'L’énergie électrique'], 0, 'Elle se convertit en énergie cinétique lors de la chute.'],
            ['Comment représente-t-on une chaîne d’énergie ?', ['Source → convertisseur → utilisation', 'Utilisation → source', 'Par un cercle fermé', 'Par un tableau de mesures'], 0, 'Les flèches indiquent le sens des conversions.'],
            ['Le Soleil est à l’origine de la plupart des autres sources d’énergie.', ['Vrai', 'Faux'], 0, 'Le vent, la pluie, les plantes et le pétrole en descendent.'],
          ],
        },
        {
          titre: 'Les conversions d’énergie',
          axe: 'Identifier différentes sources d’énergie et connaître quelques conversions',
          lecon: {
            titre: 'L’énergie ne se perd pas, elle change de forme',
            cours: `L’énergie ne se crée pas et ne disparaît pas. Elle change de forme — et une partie s’échappe toujours en chaleur.

## Le principe
= La conservation de l’énergie : elle se convertit, ou se transfère, mais ne se perd jamais

## Les convertisseurs
| Le convertisseur | De quoi | Vers quoi |
| Une **pile** | Chimique | Électrique |
| Une **lampe** | Électrique | Lumineuse (et thermique) |
| Un **moteur électrique** | Électrique | Cinétique |
| Un **panneau solaire** | Lumineuse | Électrique |
| Une **éolienne** | Cinétique (du vent) | Électrique |
| Un **barrage** | De position | Cinétique, puis électrique |

## Les pertes
!> **Aucune conversion n’est parfaite** : une partie de l’énergie part toujours en **chaleur**, souvent inutile.

~ Ampoule à filament : 5 % en lumière → 95 % en chaleur → remplacée par la LED

C’est pourquoi une ampoule à filament brûlait les doigts.

> L’énergie « perdue » n’est pas détruite : elle est **dispersée** sous une forme qu’on ne peut plus utiliser.

## Le rendement
Le **rendement** compare l’énergie **utile** à l’énergie **consommée**. Plus il est élevé, moins on gaspille.

## Économiser l’énergie
~ Isoler un logement → éteindre les veilles → préférer les transports en commun → choisir des appareils à bon rendement

Chaque geste réduit la quantité d’énergie à produire.`,
          },
          questions: [
            ['Que devient l’énergie lors d’une conversion ?', ['Elle change de forme sans disparaître', 'Elle est détruite', 'Elle est créée', 'Elle reste identique'], 0, 'C’est le principe de conservation de l’énergie.'],
            ['Quelle conversion réalise un panneau solaire ?', ['Lumineuse → électrique', 'Électrique → lumineuse', 'Chimique → électrique', 'Cinétique → électrique'], 0, 'L’éolienne, elle, convertit du cinétique en électrique.'],
            ['Quelle conversion réalise une pile ?', ['Chimique → électrique', 'Électrique → chimique', 'Lumineuse → électrique', 'Thermique → électrique'], 0, 'L’énergie est stockée sous forme chimique.'],
            ['Sous quelle forme part l’énergie « perdue » d’un appareil ?', ['La chaleur', 'La lumière', 'Le son uniquement', 'Elle disparaît'], 0, 'Elle est dispersée, pas détruite.'],
            ['Que compare le rendement d’un appareil ?', ['L’énergie utile à l’énergie consommée', 'La puissance au prix', 'La masse au volume', 'La durée à la distance'], 0, 'Plus il est élevé, moins on gaspille.'],
            ['Quelle conversion réalise une éolienne ?', ['Cinétique → électrique', 'Électrique → cinétique', 'Lumineuse → électrique', 'Chimique → cinétique'], 0, 'Elle capte l’énergie du vent en mouvement.'],
            ['Pourquoi une ampoule à filament chauffait-elle autant ?', ['Elle convertissait environ 95 % de l’électricité en chaleur', 'Elle consommait peu', 'Elle n’avait pas de convertisseur', 'Elle produisait trop de lumière'], 0, 'La LED a un bien meilleur rendement.'],
            ['Une conversion d’énergie peut être parfaite, sans aucune perte.', ['Vrai', 'Faux'], 1, 'Une part se disperse toujours en chaleur.'],
          ],
        },
        {
          titre: 'L’énergie, une production diverse et une consommation à réduire',
          axe: 'Identifier différentes sources d’énergie et connaître quelques conversions',
          lecon: {
            titre: 'Produire de l’électricité, et en consommer moins',
            cours: `La plupart des centrales fonctionnent sur le même principe. Ce qui change, c’est ce qui fait tourner la turbine.

## Le principe commun
~ Quelque chose fait tourner une TURBINE → la turbine entraîne un ALTERNATEUR → l’alternateur produit l’électricité

## Ce qui fait tourner la turbine
| La centrale | Ce qui entraîne la turbine |
| **Thermique à flamme** | De la vapeur, produite en brûlant charbon, gaz ou fioul |
| **Nucléaire** | De la vapeur, chauffée par la **fission** de l’uranium |
| **Hydraulique** | L’eau d’un **barrage** |
| **Éolienne** | Le **vent** |

!> Le **photovoltaïque** est l’**exception** : le panneau produit l’électricité **directement**, sans turbine ni alternateur.

## Les impacts
| La source | Son inconvénient principal |
| **Thermique à flamme** | Elle rejette du **dioxyde de carbone**, principal gaz à effet de serre |
| **Nucléaire** | Presque pas de CO₂, mais des **déchets radioactifs** à stocker très longtemps |
| **Renouvelables** | Peu d’impact en fonctionnement, mais elles dépendent de la **météo** et occupent de l’espace |

## Le mix énergétique
> Aucune source ne convient à tout : on **combine** plusieurs moyens de production. C’est le **mix énergétique** d’un pays.

## Réduire sa consommation
1. **Isoler** les bâtiments — c’est le premier poste de consommation ;
2. éteindre les **veilles** des appareils ;
3. lire l’**étiquette énergie** avant d’acheter ;
4. privilégier le train, le vélo et la marche.

> La meilleure énergie est celle qu’on ne consomme pas.`,
          },
          questions: [
            ['Quel élément produit l’électricité dans la plupart des centrales ?', ['L’alternateur, entraîné par une turbine', 'La chaudière', 'Le condenseur', 'Le transformateur'], 0, 'Seul le photovoltaïque s’en passe.'],
            ['Quelle centrale produit l’électricité sans turbine ?', ['La centrale photovoltaïque', 'La centrale nucléaire', 'La centrale hydraulique', 'L’éolienne'], 0, 'Le panneau convertit directement la lumière.'],
            ['Quel gaz les centrales thermiques à flamme rejettent-elles principalement ?', ['Le dioxyde de carbone', 'Le dioxygène', 'Le diazote', 'L’hélium'], 0, 'C’est le principal gaz à effet de serre.'],
            ['Quel est le principal inconvénient du nucléaire ?', ['Les déchets radioactifs à stocker très longtemps', 'Les rejets massifs de CO₂', 'Sa dépendance à la météo', 'Son faible rendement'], 0, 'Il émet en revanche très peu de gaz à effet de serre.'],
            ['Qu’appelle-t-on le mix énergétique d’un pays ?', ['La combinaison de ses différents moyens de production', 'Sa consommation totale', 'Son rendement moyen', 'Le prix de son électricité'], 0, 'Aucune source ne convient à tous les usages.'],
            ['Qu’est-ce qui fait tourner la turbine d’une centrale hydraulique ?', ['L’eau retenue par le barrage', 'La vapeur', 'Le vent', 'Le Soleil'], 0, 'L’énergie de position se convertit en énergie cinétique.'],
            ['Quel est le premier poste d’économie d’énergie dans un logement ?', ['L’isolation', 'L’éclairage', 'La télévision', 'Le réfrigérateur'], 0, 'Le chauffage domine la consommation domestique.'],
            ['Les énergies renouvelables produisent de l’électricité de façon parfaitement régulière.', ['Vrai', 'Faux'], 1, 'Le vent et le soleil dépendent de la météo.'],
          ],
        },

        // ===================================================================
        // Chapitre 4 : Identifier un signal et une information
        // ===================================================================
        {
          titre: 'Les signaux',
          axe: 'Identifier un signal et une information',
          lecon: {
            titre: 'Lumière et son : deux façons de transporter un message',
            cours: `La lumière traverse le vide, le son non. Toute la différence entre voir et entendre tient là.

## Le signal lumineux
La lumière se propage en **ligne droite** dans un milieu transparent et homogène.

| La source | Ce qu’elle fait | Exemples |
| **Primaire** | Elle **produit** sa propre lumière | Le Soleil, une lampe, une flamme |
| **Diffusante** | Elle **renvoie** la lumière reçue | La Lune, un mur, ce cahier |

!> On voit un objet quand la lumière qu’il émet ou diffuse **entre dans notre œil**. La Lune n’éclaire pas : elle renvoie.

= Vitesse de la lumière : environ 300 000 km/s

## L’ombre
| L’ombre | Où elle est |
| L’**ombre propre** | La face non éclairée de l’objet |
| L’**ombre portée** | Sur le sol ou l’écran |

C’est la **propagation rectiligne** qui l’explique.

## Le signal sonore
Le son est produit par un objet qui **vibre**. Il se propage dans l’air, mais aussi dans l’eau et les solides.

!> **Le son ne se propage PAS dans le vide** : il lui faut un milieu matériel. La lumière, elle, traverse le vide — c’est pourquoi on voit le Soleil sans entendre les explosions qui s’y produisent.

= Vitesse du son dans l’air : environ 340 m/s

Soit près d’un million de fois moins que la lumière.

> C’est pourquoi on **voit l’éclair avant d’entendre le tonnerre**.

## Le danger du bruit
!> Un son trop fort ou trop long **détruit** les cellules de l’oreille interne, et **elles ne se régénèrent pas**. La perte est **définitive**.`,
          },
          questions: [
            ['Comment la lumière se propage-t-elle dans un milieu transparent et homogène ?', ['En ligne droite', 'En cercle', 'En zigzag', 'Elle ne se propage pas'], 0, 'C’est ce qui explique les ombres.'],
            ['Laquelle est une source primaire de lumière ?', ['Une lampe allumée', 'La Lune', 'Un mur blanc', 'Un miroir'], 0, 'Les autres ne font que diffuser la lumière reçue.'],
            ['Quelle est la vitesse de la lumière ?', ['Environ 300 000 km/s', 'Environ 340 m/s', 'Environ 3 000 km/s', 'Environ 30 km/s'], 0, 'C’est la plus grande vitesse connue.'],
            ['Quelle est la vitesse du son dans l’air ?', ['Environ 340 m/s', 'Environ 300 000 km/s', 'Environ 34 m/s', 'Environ 3 400 m/s'], 0, 'Bien plus lente que la lumière.'],
            ['Le son peut-il se propager dans le vide ?', ['Non, il lui faut un milieu matériel', 'Oui, comme la lumière', 'Oui, mais plus lentement', 'Seulement s’il est très fort'], 0, 'La lumière, elle, traverse le vide.'],
            ['Pourquoi voit-on l’éclair avant d’entendre le tonnerre ?', ['La lumière va bien plus vite que le son', 'L’éclair se produit avant le tonnerre', 'Le son part dans une autre direction', 'L’œil réagit plus vite que l’oreille'], 0, '300 000 km/s contre 340 m/s.'],
            ['Comment un son est-il produit ?', ['Par un objet qui vibre', 'Par un objet qui chauffe', 'Par un objet qui brille', 'Par un objet immobile'], 0, 'La vibration se transmet au milieu.'],
            ['Les cellules de l’oreille interne détruites par le bruit repoussent avec le temps.', ['Vrai', 'Faux'], 1, 'La perte auditive est définitive.'],
          ],
        },
        {
          titre: 'Transmettre l’information',
          axe: 'Identifier un signal et une information',
          lecon: {
            titre: 'De la fumée au fil de verre',
            cours: `Émetteur, canal, récepteur : toute transmission suit le même schéma, du signal de fumée à la fibre optique.

## La chaîne de transmission
~ Émetteur (il code) → canal (il transporte) → récepteur (il décode)

## Une longue histoire
~ Signaux de fumée → tambours → pigeons voyageurs → sémaphores → télégraphe → téléphone → radio → satellites → fibre optique

Chaque progrès a augmenté la **vitesse**, la **distance** et la **quantité** d’information transmise.

## Les supports d’aujourd’hui
| Le support | Sous quelle forme voyage l’information |
| Le **câble électrique** | Un **courant** |
| Les **ondes** — radio, wifi, téléphonie | Elles se propagent dans l’air et le vide, **sans fil** |
| La **fibre optique** | De la **lumière**, dans un fil de verre très fin |

> La fibre est le support le plus rapide, et celui qui transporte le plus de données.

## Le signal numérique
= Le binaire : deux états seulement, 0 et 1

~ Un texte, une image, un son → convertis en 0 et 1 → transmis → reconvertis à l’arrivée

| L’unité | Ses multiples |
| L’**octet** (o) | **ko**, **Mo**, **Go** |

> Une photo, une chanson et un message ne diffèrent, pour le réseau, que par le **nombre** de 0 et de 1.

## Le stockage
Disque dur, clé USB, carte mémoire, ou serveur distant — le « cloud ».

!> Le « cloud » n’est pas un nuage : c’est l’**ordinateur de quelqu’un d’autre**.

## Un usage responsable
!> Une information transmise peut être **copiée**, **conservée** et **rediffusée** sans qu’on le sache. Ce qu’on publie **échappe vite à son auteur**.`,
          },
          questions: [
            ['Quel est le schéma d’une transmission d’information ?', ['Émetteur → canal → récepteur', 'Récepteur → émetteur', 'Canal → émetteur → canal', 'Source → turbine → alternateur'], 0, 'L’émetteur code, le récepteur décode.'],
            ['Sous quelle forme l’information circule-t-elle dans une fibre optique ?', ['Sous forme de lumière', 'Sous forme de courant électrique', 'Sous forme de son', 'Sous forme de chaleur'], 0, 'Dans un fil de verre très fin.'],
            ['Quels sont les deux états du langage binaire ?', ['0 et 1', 'A et B', '+ et −', 'Oui et non uniquement'], 0, 'Toute information y est convertie.'],
            ['Quelle est l’unité de quantité d’information ?', ['L’octet', 'Le joule', 'Le hertz', 'Le mètre'], 0, 'Avec ses multiples : ko, Mo, Go.'],
            ['Quel support transporte le plus de données le plus vite ?', ['La fibre optique', 'Le câble électrique', 'Les ondes radio', 'Le pigeon voyageur'], 0, 'L’information y voyage sous forme de lumière.'],
            ['Que se passe-t-il avant qu’un son soit transmis sur un réseau ?', ['Il est converti en une suite de 0 et de 1', 'Il est amplifié seulement', 'Il est transformé en chaleur', 'Rien, il circule tel quel'], 0, 'Il est reconverti à l’arrivée.'],
            ['Qu’est-ce que le « cloud » ?', ['Des serveurs distants, c’est-à-dire les ordinateurs de quelqu’un d’autre', 'Une mémoire dans les nuages', 'Un type de câble', 'Un logiciel de compression'], 0, 'Les données y sont stockées hors de chez soi.'],
            ['Une information publiée en ligne reste sous le contrôle de son auteur.', ['Vrai', 'Faux'], 1, 'Elle peut être copiée, conservée et rediffusée à son insu.'],
          ],
        },
      ],
    },
  ],
}
