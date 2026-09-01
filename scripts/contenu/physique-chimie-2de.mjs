// Physique-chimie — Seconde : LE PROGRAMME COMPLET (23 fiches).
//
// CE QUE REMPLACE CE MODULE. La 2de n'avait que CINQ chapitres de
// physique-chimie, hérités du tout premier jeu de données (migration 008,
// contenu rempli par la 127) : « Constitution de la matière », « Transformations
// chimiques : équations », « Le mouvement : vitesse et référentiel », « Ondes et
// signaux », « La lumière : spectres ». Cinq fiches pour un programme qui en
// demande vingt-trois. Rien sur la composition d'un mélange, l'identification
// d'une espèce chimique, la configuration électronique, la quantité de matière,
// les changements d'état, la synthèse d'une espèce chimique, les réactions
// nucléaires, le vecteur vitesse, le principe d'inertie, la loi d'Ohm, les
// lentilles ni la construction d'image : un élève de 2de ne trouvait, sur ces
// sujets, RIEN.
//
// LE DÉCOUPAGE. Les 4 chapitres du programme de seconde (arrêté du 17 janvier
// 2019, BO spécial n° 1 du 22 janvier 2019), éclatés en leurs 23 fiches. Chaque
// fiche est un chapitre en base ; le CHAPITRE du programme est porté par `axe`
// (colonne `chapters.theme`), qui fait grouper la page matière — cf.
// docs/template-matiere.md. La physique-chimie n'a qu'un seul rayon : pas de
// `rayon` ici, la page garde un onglet Programme unique.
//
// ⚠️ ZÉRO LATEX. `components/LessonRichContent` ne rend aucune formule : tout
// s'écrit en Unicode et en texte — « P = U × I », « m³ », « 6,02 × 10²³ »,
// « 1/OA' − 1/OA = 1/OF' ». Même règle qu'en maths (module `maths-2de.mjs`).
//
// LES CINQ ANCIENS PARTENT (voir `menage`). Quatre d'entre eux sont des
// CHAPITRES du programme reformulés ; le cinquième (« La lumière : spectres »)
// est une fiche de synthèse que les quatre fiches de « Vision et image »
// recouvrent. Le ménage est borné à leurs cinq titres exacts et au seul niveau
// 2de — rejoué, il ne trouve plus rien et ne touche jamais les 23 fiches neuves.
//
// ⚠️ Le slug reste `physique-chimie` et TROIS modules le portent désormais
// (`physique-chimie-tle.mjs` → 252, `physique-chimie-1re.mjs` → 270, celui-ci →
// 289) : ne JAMAIS générer avec `--slugs physique-chimie`, qui les fusionnerait
// et réécrirait deux migrations. La physique-chimie du collège vient encore des
// migrations écrites à la main (037 → 143), qui ne doivent plus être régénérées.
// Toujours `--modules physique-chimie-2de`.

export default {
  slug: 'physique-chimie',
  nom: 'Physique-Chimie',

  titreMigration: 'PHYSIQUE-CHIMIE 2de — LE PROGRAMME COMPLET (23 fiches)',

  motif: `CONSTAT : la Seconde n'avait que CINQ chapitres de physique-chimie, hérités
du premier jeu de données de l'app, avec une leçon générique chacun. Le
programme officiel s'organise en QUATRE chapitres — constitution et
transformation de la matière, mouvements et interactions, ondes et signaux,
vision et image — qui se déplient en 23 fiches. Un élève de 2de qui révisait la
composition d'un mélange, l'identification d'une espèce chimique, la
configuration électronique, la règle du duet et de l'octet, la quantité de
matière, les changements d'état, la synthèse d'une espèce chimique, les
réactions nucléaires, le vecteur vitesse, le principe d'inertie, la loi d'Ohm,
les lentilles convergentes ou la construction d'une image ne trouvait RIEN.
Cette migration installe les 23 fiches, rangées sous leurs 4 chapitres, et
retire les 5 fiches génériques que ce découpage recouvre.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 23 fiches sous 4 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas
garantir que la 234 soit passée en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 5 anciens chapitres
déjà supprimés et les 23 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités partent. Quatre d'entre eux sont des CHAPITRES du
programme reformulés ("Constitution de la matière", "Transformations chimiques :
équations", "Le mouvement : vitesse et référentiel", "Ondes et signaux") : les
garder en base ferait deux objets du même nom à deux places différentes, un
en-tête de section et une ligne dans la liste. Le cinquième ("La lumière :
spectres") est une fiche de synthèse que les quatre fiches de "Vision et image"
recouvrent.
ATTENTION À LA PONCTUATION : deux de ces titres portent un DEUX-POINTS entouré
d'espaces. Un DELETE approximatif ne trouverait rien EN SILENCE.
Le filtre level = '2de' est indispensable : "Ondes et signaux" est aussi un
chapitre du programme d'autres niveaux.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.
Le ménage tourne AVANT les insertions à CHAQUE passage : sans la borne des cinq
titres, un rejeu effacerait les quiz des 23 fiches neuves.`,
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
   AND c.level = '2de'
   AND c.title IN ('Constitution de la matière',
                   'Transformations chimiques : équations',
                   'Le mouvement : vitesse et référentiel',
                   'Ondes et signaux',
                   'La lumière : spectres');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '2de'
   AND c.title IN ('Constitution de la matière',
                   'Transformations chimiques : équations',
                   'Le mouvement : vitesse et référentiel',
                   'Ondes et signaux',
                   'La lumière : spectres');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '2de'
   AND c.title IN ('Constitution de la matière',
                   'Transformations chimiques : équations',
                   'Le mouvement : vitesse et référentiel',
                   'Ondes et signaux',
                   'La lumière : spectres');`,
    },
  ],

  blocs: [
    {
      niveaux: ['2de'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : constitution et transformation de la matière
        // ===================================================================
        {
          titre: 'Corps purs et mélanges',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Une seule espèce, ou plusieurs',
            cours: `Toute matière est faite d'espèces chimiques. Selon qu'il y en a une seule ou plusieurs, on parle de corps pur ou de mélange.

## Corps pur ou mélange
| Le cas | Sa définition | Ses exemples |
| **Corps pur** | Une **seule** espèce chimique | Fer, dioxygène, eau distillée, saccharose |
| Mélange **homogène** | Plusieurs espèces, une **seule phase** visible | Eau salée, air, alliage |
| Mélange **hétérogène** | Plusieurs phases distinguables | Eau et huile, jus avec pulpe, brouillard |

> Le repérage est visuel, mais le critère est physique : un mélange homogène ne comporte qu'une seule phase.

## Le comportement d'un corps pur
| Le changement d'état de l'eau pure | Sa température, sous 1 013 hPa |
| Fusion | **0 °C** |
| Ébullition | **100 °C** |

> Pendant tout le changement d'état, la température d'un corps pur reste **constante**.

## Séparer un mélange
| La technique | Son principe |
| La **décantation** | Différence de densité, après repos |
| La **filtration** | Elle retient les particules solides |
| La **centrifugation** | Elle accélère la décantation |
| La **distillation** | Différence de température d'ébullition |
| L'**évaporation** | Elle récupère un solide dissous |

## Densité et masse volumique
| La grandeur | Sa formule | Son unité |
| **Masse volumique** ρ | m / V | kg·m⁻³ ou g·cm⁻³ |
| **Densité** | Masse volumique rapportée à celle de l'eau (1,00 g·cm⁻³) | **Sans unité** |

> Un corps de densité inférieure à 1 flotte sur l'eau.

## Identifier un corps pur
| La grandeur caractéristique | Ce qu'elle vaut |
| Température de **fusion** | Propre à l'espèce |
| Température d'**ébullition** | Propre à l'espèce |
| **Masse volumique** | Propre à l'espèce |
| **Indice de réfraction** | Propre à l'espèce |

> Elles ne dépendent pas de la quantité prélevée : ce sont des **cartes d'identité**.`,
          },
          questions: [
            ['Qu’est-ce qu’un corps pur ?', ['Une matière constituée d’une seule espèce chimique', 'Une matière sans impureté visible', 'Un mélange homogène', 'Une matière solide'], 0, 'Il possède des températures de changement d’état bien définies.'],
            ['Qu’est-ce qu’un mélange homogène ?', ['Un mélange dont on ne distingue pas les constituants, même après repos', 'Un mélange de deux solides', 'Un mélange qui se sépare tout seul', 'Un mélange coloré'], 0, 'Il ne comporte qu’une seule phase.'],
            ['Sous pression atmosphérique normale, à quelle température l’eau pure bout-elle ?', ['100 °C', '0 °C', '80 °C', '120 °C'], 0, 'La température reste constante durant l’ébullition.'],
            ['Quelle technique sépare deux liquides ayant des températures d’ébullition différentes ?', ['La distillation', 'La filtration', 'La décantation', 'La centrifugation'], 0, 'On récupère le distillat au condenseur.'],
            ['Quelle est l’expression de la masse volumique ?', ['ρ = m / V', 'ρ = V / m', 'ρ = m × V', 'ρ = m + V'], 0, 'Elle s’exprime par exemple en g·cm⁻³.'],
            ['Que vaut la densité d’un corps par rapport à l’eau, s’il flotte ?', ['Elle est inférieure à 1', 'Elle est supérieure à 1', 'Elle vaut exactement 1', 'Elle est négative'], 0, 'La densité est un nombre sans unité.'],
            ['La masse volumique d’un corps pur dépend de la quantité prélevée.', ['Vrai', 'Faux'], 1, 'C’est une grandeur caractéristique, indépendante de la quantité.'],
            ['Quelle technique permet de retenir un solide en suspension dans un liquide ?', ['La filtration', 'La distillation', 'L’évaporation', 'La chromatographie'], 0, 'Le solide reste sur le filtre, le liquide passe.'],
          ],
        },
        {
          titre: 'Composition d’un mélange',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Dire combien il y en a dans combien',
            cours: `Décrire un mélange, c'est indiquer la proportion de chacun de ses constituants.

## Le vocabulaire de la solution
| Le terme | Sa définition |
| Une **solution** | Un mélange homogène liquide |
| Le **solvant** | L'espèce majoritaire — l'eau : la solution est **aqueuse** |
| Le **soluté** | L'espèce dissoute |
| Une solution **saturée** | Elle ne peut plus dissoudre de soluté |

## La concentration en masse
t = m / V, en g·L⁻¹

> Attention : V est le volume de la **solution obtenue**, et non celui du solvant ajouté.

> Un litre d'eau plus 20 g de sel ne fait pas exactement un litre de solution : c'est pourquoi on complète jusqu'au trait de jauge.

## Préparer une solution
| La méthode | Les étapes |
| Par **dissolution** | Peser la masse voulue, l'introduire dans une **fiole jaugée**, dissoudre, compléter au trait de jauge, homogénéiser |
| Par **dilution** | Prélever un volume précis à la **pipette jaugée**, l'introduire dans une fiole jaugée, compléter |

La dilution **conserve la quantité de soluté** :

t₁ × V₁ = t₂ × V₂

## Le facteur de dilution
F = V₂ / V₁ = t₁ / t₂

> Diluer dix fois : prélever 10,0 mL de solution mère et compléter à 100,0 mL.

## Doser par étalonnage
| L'étape | Ce qu'on fait |
| 1 | Préparer une **gamme d'étalons** de concentrations connues |
| 2 | Mesurer une grandeur qui varie avec la concentration — l'**absorbance**, pour une solution colorée |
| 3 | Tracer la **courbe d'étalonnage** |
| 4 | Y reporter la mesure faite sur la solution inconnue |

## Composition d'un mélange gazeux
| Le gaz de l'air | Sa proportion en volume |
| **Diazote** | Environ 78 % |
| **Dioxygène** | Environ 21 % |
| Autres, dont argon et dioxyde de carbone | Environ 1 % |`,
          },
          questions: [
            ['Dans une solution, quelle espèce appelle-t-on le solvant ?', ['L’espèce majoritaire, dans laquelle se dissout le soluté', 'L’espèce dissoute', 'L’espèce colorée', 'L’espèce solide'], 0, 'Quand c’est l’eau, la solution est dite aqueuse.'],
            ['Quelle est l’expression de la concentration en masse ?', ['t = m / V', 't = V / m', 't = m × V', 't = m − V'], 0, 'V est le volume de la solution obtenue.'],
            ['Quelle verrerie utilise-t-on pour préparer un volume précis de solution ?', ['La fiole jaugée', 'Le bécher', 'L’éprouvette graduée', 'L’erlenmeyer'], 0, 'On complète jusqu’au trait de jauge.'],
            ['Que conserve-t-on lors d’une dilution ?', ['La quantité de soluté', 'Le volume', 'La concentration', 'La masse volumique'], 0, 'D’où la relation t₁ × V₁ = t₂ × V₂.'],
            ['Comment prépare-t-on une dilution au dixième ?', ['On prélève 10,0 mL de solution mère et on complète à 100,0 mL', 'On ajoute 100 mL d’eau à 10 mL de solution', 'On prélève 1 mL et on complète à 10 L', 'On divise la masse de soluté par dix'], 0, 'Le facteur de dilution vaut alors 10.'],
            ['Qu’est-ce qu’une solution saturée ?', ['Une solution qui ne peut plus dissoudre de soluté', 'Une solution très colorée', 'Une solution chauffée', 'Une solution filtrée'], 0, 'La solubilité dépend de la température.'],
            ['Quelle grandeur mesure-t-on au spectrophotomètre pour un dosage par étalonnage ?', ['L’absorbance', 'La masse', 'La température', 'La pression'], 0, 'On la compare à une gamme d’étalons.'],
            ['L’air contient environ 21 % de dioxygène en volume.', ['Vrai', 'Faux'], 0, 'Avec environ 78 % de diazote.'],
          ],
        },
        {
          titre: 'Identification d’une espèce chimique',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Reconnaître ce qu’on a dans le tube',
            cours: `Identifier une espèce chimique, c'est comparer ce qu'on observe à des données de référence.

## Les tests caractéristiques
| L'espèce | Le test | Le résultat |
| **Dioxygène** | Une bûchette incandescente | Elle se **rallume** |
| **Dioxyde de carbone** | L'eau de chaux | Elle se **trouble** |
| **Dihydrogène** | Une flamme approchée | Une **détonation** |
| **Eau** | Le sulfate de cuivre anhydre | Il passe du blanc au **bleu** |

| L'ion | Le réactif | Le précipité |
| Cuivre II | Soude | **Bleu** |
| Fer III | Soude | **Rouille** |
| Fer II | Soude | **Vert** |
| Zinc ou aluminium | Soude | **Blanc** |
| Chlorure | Nitrate d'argent | **Blanc**, qui noircit à la lumière |

## La chromatographie sur couche mince
| L'étape | Ce qu'on fait |
| 1 | Déposer l'échantillon et des références sur la plaque |
| 2 | Laisser migrer l'**éluant** par capillarité |
| 3 | Révéler |
| 4 | Comparer les hauteurs |

Rf = distance parcourue par la tache / distance parcourue par le front d'éluant

Rf est compris entre 0 et 1, et caractérise l'espèce dans un couple support-éluant donné.

> Une chromatographie répond à deux questions : combien y a-t-il d'espèces, et l'une d'elles est-elle identique à une référence ?

## Les grandeurs physiques
| La grandeur | Son instrument |
| Température de **fusion** | Le **banc Kofler** |
| Température d'**ébullition** | Un montage de distillation |
| **Masse volumique** | Balance et éprouvette |
| **Indice de réfraction** | Le réfractomètre |

## Les spectres
Le **spectre d'absorption UV-visible** d'une solution colorée présente un maximum caractéristique de l'espèce dissoute : un outil d'identification, en plus du dosage.

## La démarche
> Une seule mesure suffit rarement : on **croise** plusieurs indices concordants. Et toute mesure porte une **incertitude** — deux valeurs très proches ne prouvent pas l'identité, elles la rendent probable.`,
          },
          questions: [
            ['Quel gaz rallume une bûchette incandescente ?', ['Le dioxygène', 'Le dioxyde de carbone', 'Le dihydrogène', 'Le diazote'], 0, 'Le dioxyde de carbone, lui, trouble l’eau de chaux.'],
            ['Quel test caractérise la présence d’eau ?', ['Le sulfate de cuivre anhydre passe du blanc au bleu', 'L’eau de chaux se trouble', 'Une détonation se produit', 'Un précipité rouille apparaît'], 0, 'C’est un test simple et réversible par chauffage.'],
            ['Quelle couleur a le précipité obtenu avec la soude en présence d’ions fer III ?', ['Rouille', 'Bleu', 'Vert', 'Blanc'], 0, 'Le fer II donne un précipité vert, le cuivre II un précipité bleu.'],
            ['Que met en évidence le nitrate d’argent ?', ['Les ions chlorure, par un précipité blanc qui noircit à la lumière', 'Les ions cuivre', 'Le dioxygène', 'L’eau'], 0, 'Le noircissement est dû à la photosensibilité du chlorure d’argent.'],
            ['Comment calcule-t-on le rapport frontal Rf ?', ['Distance parcourue par la tache divisée par la distance parcourue par le front d’éluant', 'Distance du front divisée par la distance de la tache', 'Masse de l’espèce divisée par le volume', 'Hauteur de la plaque divisée par sa largeur'], 0, 'Rf est compris entre 0 et 1.'],
            ['Que conclut-on si deux dépôts migrent à la même hauteur en chromatographie ?', ['Il s’agit probablement de la même espèce chimique', 'Ils ont la même masse', 'Ils ont la même couleur', 'Ils sont de concentration égale'], 0, 'Dans le même couple support-éluant.'],
            ['Quel appareil permet de mesurer la température de fusion d’un solide ?', ['Le banc Kofler', 'Le spectrophotomètre', 'Le réfractomètre', 'La burette'], 0, 'La température de fusion est une grandeur caractéristique.'],
            ['Une seule mesure suffit à identifier avec certitude une espèce chimique.', ['Vrai', 'Faux'], 1, 'On croise plusieurs indices, et toute mesure porte une incertitude.'],
          ],
        },
        {
          titre: 'Le noyau de l’atome',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Ce qu’il y a dans le noyau, et pourquoi ça compte',
            cours: `Un atome est constitué d'un noyau central, chargé positivement, autour duquel se répartissent des électrons chargés négativement.

## Composition du noyau
| La particule | Sa charge | Sa localisation |
| **Proton** | +e | Le noyau |
| **Neutron** | Neutre | Le noyau |
| **Électron** | −e | Autour du noyau |

| Le nombre | Ce qu'il compte |
| **Z**, numéro atomique | Les **protons** |
| **A**, nombre de masse | Le total des **nucléons** |
| **A − Z** | Les neutrons |

## L'atome est neutre
Autant d'électrons que de protons : la charge totale est nulle. La charge élémentaire vaut e = 1,6 × 10⁻¹⁹ C.

## Une structure lacunaire
| L'objet | Sa taille |
| Le **noyau** | Environ 10⁻¹⁵ m |
| L'**atome** | Environ 10⁻¹⁰ m |
| Le rapport | **100 000** |

L'atome est donc essentiellement **vide** — et pourtant presque toute sa masse est dans le noyau : un nucléon est environ **1 800 fois** plus massif qu'un électron.

> Si le noyau avait la taille d'une bille au centre d'un stade, les électrons occuperaient les gradins.

## Éléments et isotopes
| La notion | Sa définition |
| Un **élément chimique** | Défini par son seul **Z** |
| Des **isotopes** | Même Z, A différents |

| L'isotope | Ses protons | Ses neutrons |
| Carbone 12 | 6 | 6 |
| Carbone 14 | 6 | 8 |

> Les isotopes ont les **mêmes propriétés chimiques** : celles-ci dépendent des électrons.

## Les ions
| L'ion | Ce qui a changé | Sa charge |
| **Cation** | L'atome a **perdu** des électrons | Positive |
| **Anion** | Il en a **gagné** | Négative |

> Le noyau n'est pas modifié : c'est toujours le même élément.

## La masse d'un atome
En pratique : m ≈ A × masse d'un nucléon, l'apport des électrons étant négligeable.`,
          },
          questions: [
            ['Que désigne le numéro atomique Z ?', ['Le nombre de protons du noyau', 'Le nombre de nucléons', 'Le nombre de neutrons', 'Le nombre d’électrons de la couche externe'], 0, 'Il définit l’élément chimique.'],
            ['Comment obtient-on le nombre de neutrons d’un noyau ?', ['En calculant A − Z', 'En calculant A + Z', 'En calculant Z − A', 'En divisant A par Z'], 0, 'A est le nombre total de nucléons.'],
            ['Que sont deux isotopes ?', ['Deux noyaux de même Z mais de A différents', 'Deux noyaux de même A mais de Z différents', 'Deux atomes de charges opposées', 'Deux ions du même élément'], 0, 'Ils ont les mêmes propriétés chimiques.'],
            ['Quel est l’ordre de grandeur du diamètre d’un atome ?', ['10⁻¹⁰ m', '10⁻¹⁵ m', '10⁻⁶ m', '10⁻³ m'], 0, 'Le noyau, lui, mesure environ 10⁻¹⁵ m.'],
            ['Pourquoi dit-on que l’atome a une structure lacunaire ?', ['Parce que le noyau est 100 000 fois plus petit que l’atome', 'Parce qu’il lui manque des électrons', 'Parce qu’il contient des trous', 'Parce qu’il est instable'], 0, 'L’essentiel du volume de l’atome est vide.'],
            ['Où se trouve l’essentiel de la masse d’un atome ?', ['Dans le noyau', 'Dans le nuage électronique', 'Répartie uniformément', 'Dans les neutrons uniquement'], 0, 'Un nucléon est environ 1 800 fois plus massif qu’un électron.'],
            ['Un atome qui perd un électron devient un anion.', ['Vrai', 'Faux'], 1, 'Il devient un cation, de charge positive.'],
            ['Que vaut la charge élémentaire e ?', ['1,6 × 10⁻¹⁹ C', '9,1 × 10⁻³¹ C', '6,02 × 10²³ C', '3,0 × 10⁸ C'], 0, 'Le proton porte +e, l’électron −e.'],
          ],
        },
        {
          titre: 'Configuration électronique d’un atome',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Ranger les électrons pour prévoir la chimie',
            cours: `Les électrons d'un atome ne sont pas placés au hasard : ils occupent des sous-couches, remplies dans un ordre précis.

## Les sous-couches
| La sous-couche | Son nombre maximal d'électrons |
| **s** | 2 |
| **p** | 6 |

L'ordre de remplissage, par énergie croissante : **1s, 2s, 2p, 3s, 3p, 4s**.

## Écrire une configuration
| L'élément | Son Z | Sa configuration |
| Hydrogène | 1 | 1s¹ |
| Carbone | 6 | 1s² 2s² 2p² |
| Oxygène | 8 | 1s² 2s² 2p⁴ |
| Sodium | 11 | 1s² 2s² 2p⁶ 3s¹ |
| Chlore | 17 | 1s² 2s² 2p⁶ 3s² 3p⁵ |

## Les électrons de valence
Ce sont les électrons de la **couche externe**, celle de plus grand numéro.

> Ils sont les seuls à intervenir dans les réactions chimiques : deux éléments qui en ont le même nombre ont des propriétés voisines.

> Toute la chimie d'un élément tient dans sa couche externe : le reste des électrons ne fait que compléter le tableau.

## Le tableau périodique
| Le classement | Son critère |
| Celui de **Mendeleïev** | Masse croissante, et propriétés voisines |
| Le classement actuel | **Numéro atomique** croissant |

| L'axe | Ce qu'il rassemble |
| Une **ligne** (période) | Des éléments dont la couche externe porte le même numéro |
| Une **colonne** (famille) | Des éléments de **même nombre d'électrons de valence** |

## Les grandes familles
| La colonne | La famille | Sa réactivité |
| La première | Les **alcalins** | Très réactifs : ils perdent facilement un électron |
| L'avant-dernière | Les **halogènes** | Ils en gagnent facilement un |
| La dernière | Les **gaz nobles** | Couche externe saturée : chimiquement **inertes** |`,
          },
          questions: [
            ['Combien d’électrons au maximum une sous-couche s peut-elle contenir ?', ['2', '6', '8', '10'], 0, 'Une sous-couche p en contient au maximum 6.'],
            ['Quelle est la configuration électronique de l’oxygène (Z = 8) ?', ['1s² 2s² 2p⁴', '1s² 2s² 2p⁶', '1s² 2s⁴ 2p²', '1s² 2s² 2p² 3s²'], 0, 'Huit électrons répartis par énergie croissante.'],
            ['Qu’appelle-t-on électrons de valence ?', ['Les électrons de la couche externe', 'Tous les électrons de l’atome', 'Les électrons du noyau', 'Les électrons de la première couche'], 0, 'Ce sont eux qui interviennent dans les réactions chimiques.'],
            ['Comment le tableau périodique est-il ordonné aujourd’hui ?', ['Par numéro atomique croissant', 'Par masse volumique croissante', 'Par ordre alphabétique', 'Par température de fusion'], 0, 'Mendeleïev l’avait d’abord ordonné par masse.'],
            ['Que partagent les éléments d’une même colonne du tableau périodique ?', ['Le même nombre d’électrons de valence', 'La même masse atomique', 'Le même nombre de neutrons', 'Le même état physique'], 0, 'D’où des propriétés chimiques semblables.'],
            ['Quelle est la particularité des gaz nobles ?', ['Leur couche externe est saturée, ils sont chimiquement inertes', 'Ils perdent facilement un électron', 'Ils gagnent facilement un électron', 'Ils sont tous radioactifs'], 0, 'Ils occupent la dernière colonne du tableau.'],
            ['Les alcalins de la première colonne perdent facilement un électron.', ['Vrai', 'Faux'], 0, 'C’est ce qui explique leur grande réactivité.'],
            ['Dans quel ordre remplit-on les sous-couches pour les 18 premiers éléments ?', ['1s, 2s, 2p, 3s, 3p', '1s, 2p, 2s, 3p, 3s', '1s, 2s, 3s, 2p, 3p', '2s, 1s, 2p, 3s, 3p'], 0, 'Par énergie croissante.'],
          ],
        },
        {
          titre: 'Stabilité et charge électrique d’une entité chimique',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Pourquoi les atomes s’associent',
            cours: `Un atome isolé n'est presque jamais stable. Pour le devenir, il gagne, perd ou partage des électrons.

## Les règles du duet et de l'octet
| La règle | Le modèle visé | Les électrons externes |
| Le **duet** | L'hélium | **2** |
| L'**octet** | Le néon, l'argon | **8** |

Un atome tend à acquérir la configuration du **gaz noble le plus proche**.

## Les ions monoatomiques
| L'atome | Ce qu'il fait | L'ion formé | Sa configuration |
| Sodium | Il perd 1 électron | Na⁺ | Celle du néon |
| Magnésium | Il en perd 2 | Mg²⁺ | Celle du néon |
| Oxygène | Il en gagne 2 | O²⁻ | Celle du néon |
| Chlore | Il en gagne 1 | Cl⁻ | Celle de l'argon |

> La charge d'un ion se lit directement dans la **colonne** du tableau périodique.

> Perdre ou gagner : l'atome choisit toujours le chemin le plus court vers l'octet.

## La liaison covalente
Deux atomes **partagent** un doublet d'électrons. Chaque atome apporte un électron, et compte le doublet comme lui appartenant.

| L'atome | Ses liaisons covalentes |
| **Carbone** | 4 |
| **Azote** | 3 |
| **Oxygène** | 2 |
| **Hydrogène** et **halogènes** | 1 |

Le nombre de liaisons est fixé par le nombre d'électrons qui **manquent** pour l'octet.

## Les schémas de Lewis
| Le doublet | Ce qu'il représente | Sa notation |
| **Liant** | Une liaison | Un tiret entre les atomes |
| **Non liant** | Une paire non partagée | Un tiret sur l'atome |

> Le schéma de Lewis de l'eau montre deux liaisons O–H et **deux doublets non liants** sur l'oxygène.

## Les molécules
Une molécule est un ensemble d'atomes liés par des liaisons covalentes, électriquement **neutre**.

| La formule | Ce qu'elle donne |
| **Brute** | La nature et le nombre des atomes |
| **Développée** ou semi-développée | L'enchaînement des liaisons |`,
          },
          questions: [
            ['Que dit la règle de l’octet ?', ['Un atome tend à avoir huit électrons sur sa couche externe', 'Un atome tend à avoir huit protons', 'Un atome perd toujours huit électrons', 'Un atome forme huit liaisons'], 0, 'La règle du duet vise deux électrons, pour les éléments légers.'],
            ['Quel ion le sodium (Z = 11) forme-t-il ?', ['Na⁺', 'Na⁻', 'Na²⁺', 'Na²⁻'], 0, 'Il perd son unique électron de la couche 3s.'],
            ['Quel ion l’oxygène forme-t-il ?', ['O²⁻', 'O⁺', 'O²⁺', 'O⁻'], 0, 'Il gagne deux électrons pour atteindre l’octet.'],
            ['Qu’est-ce qu’une liaison covalente ?', ['Le partage d’un doublet d’électrons entre deux atomes', 'Le transfert d’un électron d’un atome à l’autre', 'Une attraction entre deux ions', 'Une liaison entre deux noyaux'], 0, 'Chaque atome apporte un électron au doublet partagé.'],
            ['Combien de liaisons covalentes le carbone forme-t-il ?', ['Quatre', 'Deux', 'Trois', 'Une'], 0, 'Il lui manque quatre électrons pour l’octet.'],
            ['Qu’est-ce qu’un doublet non liant ?', ['Une paire d’électrons de valence non partagée', 'Une liaison double', 'Un électron célibataire', 'Une liaison ionique'], 0, 'L’oxygène de la molécule d’eau en porte deux.'],
            ['Une molécule est électriquement neutre.', ['Vrai', 'Faux'], 0, 'Contrairement à un ion, qui porte une charge.'],
            ['Combien de liaisons l’azote forme-t-il habituellement ?', ['Trois', 'Deux', 'Quatre', 'Une'], 0, 'Il lui manque trois électrons pour compléter son octet.'],
          ],
        },
        {
          titre: 'Compter les entités dans un échantillon de matière',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'La mole, ou comment peser des atomes',
            cours: `Une goutte d'eau contient un nombre inimaginable de molécules. Pour les compter, les chimistes utilisent un paquet de taille fixe : la mole.

## La mole
| Le point | Sa valeur |
| La **constante d'Avogadro** | N_A = 6,02 × 10²³ mol⁻¹ |
| La relation | n = N / N_A |

> La mole n'est ni une masse ni un volume : c'est un **compte**, comme la douzaine — simplement beaucoup plus grand.

## La masse molaire
| L'atome | Sa masse molaire, en g·mol⁻¹ |
| H | 1,0 |
| C | 12,0 |
| N | 14,0 |
| O | 16,0 |

Pour une molécule, on additionne : M(H₂O) = 2 × 1,0 + 16,0 = **18,0 g·mol⁻¹**.

## Les relations à connaître
| On part de… | La relation | L'unité de la constante |
| Une **masse** | n = m / M | M en g·mol⁻¹ |
| Un **volume de liquide** | m = ρ × V, puis n = m / M | ρ en g·mL⁻¹ |
| Un **gaz** | n = V / V_m | V_m = 24,0 L·mol⁻¹ à 20 °C sous 1 013 hPa |
| Une **solution** | c = n / V | c en mol·L⁻¹ |

La concentration en masse s'en déduit : t = c × M.

## Un exemple
| L'étape | Le calcul |
| La donnée | 9,0 g d'eau |
| La quantité | n = 9,0 / 18,0 = **0,50 mol** |
| Le nombre de molécules | 0,50 × 6,02 × 10²³ ≈ **3,0 × 10²³** |

## Les chiffres significatifs
> Un résultat ne peut pas être plus précis que la donnée la moins précise : on garde le même nombre de **chiffres significatifs** que la donnée la plus pauvre — et l'on soigne les unités à chaque étape.`,
          },
          questions: [
            ['Que vaut la constante d’Avogadro ?', ['6,02 × 10²³ mol⁻¹', '1,6 × 10⁻¹⁹ mol⁻¹', '9,81 mol⁻¹', '3,0 × 10⁸ mol⁻¹'], 0, 'C’est le nombre d’entités contenues dans une mole.'],
            ['Quelle relation relie quantité de matière et nombre d’entités ?', ['n = N / N_A', 'n = N × N_A', 'n = N_A / N', 'n = N + N_A'], 0, 'La quantité de matière s’exprime en moles.'],
            ['Quelle est la masse molaire de l’eau H₂O ?', ['18,0 g·mol⁻¹', '16,0 g·mol⁻¹', '20,0 g·mol⁻¹', '34,0 g·mol⁻¹'], 0, 'Soit 2 × 1,0 + 16,0.'],
            ['Comment calcule-t-on une quantité de matière à partir d’une masse ?', ['n = m / M', 'n = m × M', 'n = M / m', 'n = m + M'], 0, 'Avec m en grammes et M en g·mol⁻¹.'],
            ['Quelle quantité de matière représente 9,0 g d’eau ?', ['0,50 mol', '1,0 mol', '2,0 mol', '0,25 mol'], 0, 'n = 9,0 / 18,0 = 0,50 mol.'],
            ['Comment calcule-t-on la quantité de matière d’un gaz ?', ['n = V / V_m', 'n = V × V_m', 'n = V_m / V', 'n = V / M'], 0, 'V_m vaut environ 24,0 L·mol⁻¹ à 20 °C sous 1 013 hPa.'],
            ['La mole est une unité de masse.', ['Vrai', 'Faux'], 1, 'C’est une unité de quantité de matière, donc un compte d’entités.'],
            ['Comment relie-t-on concentration en masse et concentration en quantité de matière ?', ['t = c × M', 't = c / M', 't = M / c', 't = c + M'], 0, 'M est la masse molaire du soluté.'],
          ],
        },
        {
          titre: 'Caractéristiques et représentation d’un changement d’état',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Ce qui change, et ce qui ne change pas',
            cours: `Un changement d'état est une transformation physique : les molécules restent les mêmes, seule leur organisation change.

## Les six changements
| De… | À… | Le nom |
| Solide | Liquide | **Fusion** |
| Liquide | Solide | **Solidification** |
| Liquide | Gaz | **Vaporisation** |
| Gaz | Liquide | **Liquéfaction** |
| Solide | Gaz | **Sublimation** |
| Gaz | Solide | **Condensation** |

## Trois états, trois organisations
| L'état | L'organisation des entités | La forme |
| **Solide** | Ordonnées et **fixes** | Propre |
| **Liquide** | Désordonnées, mais liées et en contact | Celle du récipient |
| **Gaz** | Très éloignées, en mouvement rapide | Tout le volume disponible |

## Le palier de température
| Le corps | Son comportement pendant le changement d'état |
| Un **corps pur** | La température reste **constante** : c'est le **palier** |
| Un **mélange** | Pas de palier net |

> C'est un moyen de distinguer un corps pur d'un mélange.

> Chauffer pendant un palier ne fait pas monter la température : l'énergie apportée sert à **défaire les interactions** entre entités, pas à les agiter davantage.

## L'aspect énergétique
| Le changement | Son bilan |
| Fusion, vaporisation, sublimation | **Endothermiques** : ils absorbent de l'énergie |
| Solidification, liquéfaction, condensation | **Exothermiques** : ils en libèrent |

> C'est pourquoi la transpiration rafraîchit : l'eau qui se vaporise prélève de l'énergie sur la peau.

## L'effet de la pression
| Le lieu | La pression | La température d'ébullition de l'eau |
| Au niveau de la mer | 1 013 hPa | **100 °C** |
| Au sommet de l'Everest | Bien plus faible | Environ **70 °C** |`,
          },
          questions: [
            ['Comment appelle-t-on le passage de l’état solide à l’état gazeux ?', ['La sublimation', 'La fusion', 'La vaporisation', 'La liquéfaction'], 0, 'Le passage inverse est la condensation solide.'],
            ['Comment appelle-t-on le passage de l’état gazeux à l’état liquide ?', ['La liquéfaction', 'La vaporisation', 'La solidification', 'La sublimation'], 0, 'C’est ce qui se produit sur une vitre froide.'],
            ['Que se passe-t-il pour la température d’un corps pur pendant un changement d’état ?', ['Elle reste constante', 'Elle augmente régulièrement', 'Elle diminue', 'Elle varie de façon aléatoire'], 0, 'C’est le palier de changement d’état.'],
            ['Comment distinguer un corps pur d’un mélange à partir d’une courbe de chauffage ?', ['Le corps pur présente un palier net, pas le mélange', 'Le mélange chauffe plus vite', 'Le corps pur ne change pas d’état', 'Le mélange présente deux paliers'], 0, 'C’est un critère expérimental simple.'],
            ['La fusion est-elle endothermique ou exothermique ?', ['Endothermique : elle absorbe de l’énergie', 'Exothermique : elle libère de l’énergie', 'Ni l’un ni l’autre', 'Cela dépend du corps'], 0, 'La solidification, elle, libère de l’énergie.'],
            ['Pourquoi la transpiration rafraîchit-elle ?', ['Parce que la vaporisation de l’eau prélève de l’énergie sur la peau', 'Parce que l’eau est froide', 'Parce que le vent souffle', 'Parce que la peau se dilate'], 0, 'La vaporisation est endothermique.'],
            ['Un changement d’état modifie la nature des molécules.', ['Vrai', 'Faux'], 1, 'C’est une transformation physique : seule l’organisation change.'],
            ['À quelle température l’eau bout-elle au sommet de l’Everest ?', ['Environ 70 °C', 'Exactement 100 °C', 'Environ 120 °C', 'Environ 0 °C'], 0, 'La pression y est bien plus faible qu’au niveau de la mer.'],
          ],
        },
        {
          titre: 'Écriture et analyse d’une réaction chimique',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Équilibrer, puis suivre ce qui disparaît',
            cours: `Lors d'une transformation chimique, des espèces disparaissent — les réactifs — et d'autres se forment — les produits.

## L'équation de réaction
On écrit les réactifs à gauche, les produits à droite, séparés par une flèche.

| Ce qui doit se conserver | Ce que cela impose |
| Les **éléments** | Autant d'atomes de chaque élément de part et d'autre |
| La **charge électrique** | Le total des charges est identique des deux côtés |

CH₄ + 2 O₂ donne CO₂ + 2 H₂O

> Équilibrer une équation, ce n'est pas un jeu d'écriture : c'est traduire que rien ne se perd et que rien ne se crée, ni atome, ni charge.

## Ce que l'équation dit, et ne dit pas
| Elle donne | Elle ne donne pas |
| Les **proportions** dans lesquelles les espèces réagissent | Les quantités réellement engagées |
| — | La **vitesse** de la réaction |

## Le tableau d'avancement
| L'espèce | Sa quantité à l'avancement x |
| Un **réactif** | n(initial) − coefficient × x |
| Un **produit** | n(initial) + coefficient × x |

Trois lignes suffisent : état initial, état intermédiaire, état final.

## Le réactif limitant
| La notion | Sa définition |
| Le **réactif limitant** | Le premier entièrement consommé |
| L'avancement maximal **x_max** | La plus petite valeur qui annule la quantité d'un réactif |
| Un mélange **stœchiométrique** | Tous les réactifs disparaissent en même temps |

## Un exemple
Avec CH₄ + 2 O₂, 1,0 mol de méthane et 1,0 mol de dioxygène :

| Le réactif | La valeur de x qui l'annule |
| Le dioxygène | **0,50 mol** |
| Le méthane | 1,0 mol |

Le limitant est donc le **dioxygène**, et x_max = 0,50 mol.

## Le rôle de l'énergie
| La réaction | Son bilan thermique |
| **Exothermique** | Elle **libère** de l'énergie — une combustion |
| **Endothermique** | Elle en **absorbe** |`,
          },
          questions: [
            ['Que garantit l’équilibrage d’une équation de réaction ?', ['La conservation des éléments et de la charge électrique', 'La conservation du volume', 'La conservation de la température', 'L’égalité des masses molaires'], 0, 'Autant d’atomes de chaque élément de part et d’autre.'],
            ['Quelle équation traduit correctement la combustion complète du méthane ?', ['CH₄ + 2 O₂ donne CO₂ + 2 H₂O', 'CH₄ + O₂ donne CO₂ + H₂O', 'CH₄ + 3 O₂ donne CO₂ + 2 H₂O', 'CH₄ + 2 O₂ donne CO + 2 H₂O'], 0, 'Quatre atomes d’oxygène de chaque côté.'],
            ['Que représente l’avancement x d’une réaction ?', ['Une quantité de matière, en moles, mesurant la progression de la réaction', 'Une vitesse de réaction', 'Une masse de produit', 'Une durée'], 0, 'Il structure le tableau d’avancement.'],
            ['Qu’est-ce que le réactif limitant ?', ['Le réactif entièrement consommé en premier, qui arrête la réaction', 'Le réactif présent en plus grande quantité', 'Le réactif le plus cher', 'Le réactif ajouté en dernier'], 0, 'Il fixe l’avancement maximal.'],
            ['Qu’est-ce qu’un mélange stœchiométrique ?', ['Un mélange où tous les réactifs sont consommés en même temps', 'Un mélange de volumes égaux', 'Un mélange de masses égales', 'Un mélange sans réactif limitant identifiable'], 0, 'Aucun réactif ne reste en excès.'],
            ['Avec 1,0 mol de CH₄ et 1,0 mol de O₂, quel est le réactif limitant ?', ['Le dioxygène', 'Le méthane', 'Aucun, le mélange est stœchiométrique', 'Les deux à la fois'], 0, 'Il s’annule pour x = 0,50 mol, contre 1,0 mol pour le méthane.'],
            ['Une équation de réaction indique la vitesse à laquelle la réaction se produit.', ['Vrai', 'Faux'], 1, 'Elle indique seulement les proportions dans lesquelles les espèces réagissent.'],
            ['Comment qualifie-t-on une réaction qui libère de l’énergie thermique ?', ['Exothermique', 'Endothermique', 'Athermique', 'Isotherme'], 0, 'Les combustions en sont l’exemple classique.'],
          ],
        },
        {
          titre: 'Synthèse d’une espèce chimique présente dans la nature',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Fabriquer au laboratoire ce que la nature produit',
            cours: `Une synthèse consiste à fabriquer une espèce chimique à partir d'autres espèces. Elle peut reproduire une molécule existant dans la nature.

## Pourquoi synthétiser
| La raison | Son contenu |
| La **quantité** disponible | L'extraction naturelle ne suffit pas |
| Le **coût** | L'extraction est bien plus chère |
| La **saisonnalité** | La ressource n'est pas toujours disponible |
| L'**impact** | L'extraction détruirait un milieu |

> Une molécule synthétisée est **identique** à la molécule naturelle si sa structure est la même : le corps ne fait aucune différence entre une vanilline extraite de la gousse et une vanilline de synthèse.

> « Naturel » n'est pas synonyme d'« inoffensif », et « de synthèse » n'est pas synonyme de « dangereux » : ce qui compte est la molécule, sa dose et son usage.

## Les trois étapes d'un protocole
| L'étape | Ce qu'on fait | Son outil |
| La **transformation** | Mélanger les réactifs, souvent en **chauffant à reflux** | Le réfrigérant condense les vapeurs et les renvoie : on chauffe sans rien perdre |
| La **séparation** | Isoler le produit | Filtration, décantation à l'ampoule, extraction, recristallisation |
| L'**identification** | Vérifier ce qu'on a obtenu | Chromatographie, température de fusion, spectres |

## Le rendement
Rendement = quantité obtenue / quantité maximale attendue

| La cause de perte | Son effet |
| Les **transferts** | Il reste toujours du produit dans la verrerie |
| Une réaction **incomplète** | Tout le réactif n'a pas réagi |
| Des réactions **secondaires** | Une partie part ailleurs |

Il est donc toujours inférieur à 1.

## Extraction par solvant
Elle repose sur la différence de **solubilité** de l'espèce dans deux liquides **non miscibles** : on agite, on laisse décanter, on récupère la bonne phase.

## La sécurité
Pictogrammes de danger, mentions H et P, équipements de protection, hotte aspirante, tri des déchets.

> Un protocole de synthèse comprend toujours son volet sécurité.`,
          },
          questions: [
            ['Une molécule de synthèse diffère-t-elle de la même molécule naturelle ?', ['Non, si sa structure est identique', 'Oui, toujours', 'Oui, elle est moins pure par nature', 'Oui, elle a une masse molaire différente'], 0, 'L’organisme ne fait aucune différence.'],
            ['À quoi sert un chauffage à reflux ?', ['Chauffer sans perdre de matière, les vapeurs étant condensées et renvoyées', 'Refroidir le mélange réactionnel', 'Séparer deux liquides', 'Mesurer la température de fusion'], 0, 'Il accélère la réaction sans perte.'],
            ['Quelles sont les trois grandes étapes d’une synthèse ?', ['Transformation, séparation, identification', 'Pesée, dissolution, filtration', 'Mesure, calcul, conclusion', 'Extraction, dilution, dosage'], 0, 'Chacune a ses techniques propres.'],
            ['Comment définit-on le rendement d’une synthèse ?', ['Le rapport de la quantité obtenue à la quantité maximale attendue', 'La masse de produit obtenue', 'Le rapport du volume au temps', 'Le rapport des masses molaires'], 0, 'Il est toujours inférieur à 1.'],
            ['Pourquoi le rendement n’atteint-il jamais 100 % ?', ['Pertes aux transferts, réaction incomplète, réactions secondaires', 'Parce que les réactifs sont impurs par définition', 'Parce que la mole est une approximation', 'Parce que la balance est imprécise'], 0, 'Plusieurs causes se cumulent.'],
            ['Sur quoi repose une extraction par solvant ?', ['La différence de solubilité de l’espèce dans deux liquides non miscibles', 'La différence de température d’ébullition', 'La différence de masse molaire', 'La différence de couleur'], 0, 'On sépare ensuite les phases par décantation.'],
            ['Une espèce naturelle est nécessairement moins dangereuse qu’une espèce de synthèse.', ['Vrai', 'Faux'], 1, 'Ce qui compte est la molécule, sa dose et son usage.'],
            ['Que trouve-t-on sur l’étiquette d’un flacon de produit chimique ?', ['Des pictogrammes de danger et des mentions H et P', 'Le rendement de synthèse', 'La quantité de matière', 'Le protocole complet'], 0, 'Elles guident les précautions à prendre.'],
          ],
        },
        {
          titre: 'Identifier une réaction nucléaire',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Quand c’est le noyau qui change',
            cours: `Une réaction nucléaire modifie le noyau des atomes, contrairement à une réaction chimique, qui ne concerne que les électrons.

## Le critère
| Le type de réaction | Ce qui change | L'ordre de grandeur de l'énergie |
| **Chimique** | Les liaisons entre atomes ; les éléments se **conservent** | L'électronvolt |
| **Nucléaire** | Le **noyau** : un élément se transforme en un autre | Le million d'électronvolts |

## Les lois de conservation
Les **lois de Soddy** suffisent à compléter n'importe quelle équation nucléaire :

| Ce qui se conserve | Le symbole |
| Le nombre de **nucléons** | A |
| Le nombre de **charge** | Z |

## La radioactivité
| Le type | Ce qui est émis | L'effet sur A | L'effet sur Z |
| **α** | Un noyau d'hélium | −4 | −2 |
| **β⁻** | Un électron ; un neutron devient proton | inchangé | **+1** |
| **β⁺** | Un positon | inchangé | **−1** |
| **γ** | Un rayonnement électromagnétique très énergétique | inchangé | inchangé |

Le rayonnement γ accompagne les précédents : c'est un noyau qui se désexcite.

> La désintégration d'un noyau donné est **imprévisible** ; c'est à l'échelle d'un très grand nombre de noyaux qu'une loi statistique apparaît.

## Fission et fusion
| La réaction | Son principe | Où elle se produit |
| La **fission** | Un noyau **lourd** — uranium 235 — se casse en deux, sous l'impact d'un neutron | Les centrales nucléaires |
| La **fusion** | Deux noyaux **légers** s'unissent — isotopes de l'hydrogène | Les étoiles, dont le Soleil |

## Applications et risques
| L'application | Son domaine |
| Datation au **carbone 14** | Archéologie |
| Imagerie et **radiothérapie** | Médecine |
| Production d'électricité | Énergie |

| Le risque | Sa gestion |
| Les **déchets radioactifs** | Stockage de très longue durée |
| L'exposition | La **radioprotection** |
| L'accident | Sûreté et confinement |

> Les choix énergétiques mêlent physique, économie et politique.`,
          },
          questions: [
            ['Qu’est-ce qui distingue une réaction nucléaire d’une réaction chimique ?', ['Elle modifie le noyau et transforme un élément en un autre', 'Elle ne concerne que les électrons', 'Elle libère moins d’énergie', 'Elle conserve la charge des ions'], 0, 'L’énergie mise en jeu est de l’ordre du million de fois plus grande.'],
            ['Que conservent les lois de Soddy ?', ['Le nombre de nucléons A et le nombre de charge Z', 'La masse et le volume', 'La température et la pression', 'Le nombre d’électrons'], 0, 'Elles permettent de compléter une équation nucléaire.'],
            ['Que se passe-t-il lors d’une désintégration α ?', ['Le noyau émet un noyau d’hélium : A diminue de 4, Z de 2', 'Le noyau émet un électron', 'Le noyau émet un positon', 'Le noyau se scinde en deux'], 0, 'La particule α est un noyau d’hélium 4.'],
            ['Que se passe-t-il lors d’une désintégration β⁻ ?', ['Un neutron devient un proton et un électron est émis : Z augmente de 1', 'Un proton devient un neutron', 'Le noyau perd deux protons', 'Le noyau émet un photon seulement'], 0, 'Le nombre de nucléons A reste constant.'],
            ['Qu’est-ce que le rayonnement γ ?', ['Un rayonnement électromagnétique très énergétique émis par un noyau qui se désexcite', 'Un noyau d’hélium', 'Un flux d’électrons', 'Un flux de neutrons'], 0, 'Il accompagne souvent les désintégrations α et β.'],
            ['Qu’est-ce que la fission nucléaire ?', ['La cassure d’un noyau lourd en noyaux plus légers', 'L’union de deux noyaux légers', 'L’émission d’un électron', 'La désexcitation d’un noyau'], 0, 'C’est le principe des centrales nucléaires actuelles.'],
            ['La fusion nucléaire est la source d’énergie des étoiles.', ['Vrai', 'Faux'], 0, 'Elle unit des noyaux légers, comme des isotopes de l’hydrogène.'],
            ['Peut-on prévoir le moment exact où un noyau donné va se désintégrer ?', ['Non, seule une loi statistique apparaît sur un grand nombre de noyaux', 'Oui, avec précision', 'Oui, si l’on connaît sa masse', 'Oui, en le refroidissant'], 0, 'La désintégration individuelle est imprévisible.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 : mouvements et interactions
        // ===================================================================
        {
          titre: 'Relativité du mouvement',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Il n’y a pas de mouvement sans référentiel',
            cours: `Dire qu'un objet bouge n'a aucun sens tant qu'on n'a pas dit par rapport à quoi.

## Le référentiel
Un **référentiel** est un objet de référence, auquel on associe un repère d'espace et une horloge.

| Le passager assis dans un train | Son état |
| Dans le référentiel du **train** | **Immobile** |
| Dans le référentiel du **sol** | **En mouvement** |

> Les deux descriptions sont également justes : c'est la **relativité du mouvement**. Le premier réflexe, en mécanique, est de dire quel référentiel on prend.

## Les référentiels usuels
| Le référentiel | Son centre | Son usage |
| **Terrestre** | Le sol | Les mouvements du quotidien |
| **Géocentrique** | Le centre de la Terre | Les satellites |
| **Héliocentrique** | Le centre du Soleil | Les planètes |

## Trajectoire
La **trajectoire** est l'ensemble des positions successives d'un point, dans un référentiel donné.

| L'observateur | La trajectoire de la valve d'une roue de vélo |
| Le **cycliste** | Un **cercle** |
| Un piéton au bord de la route | Une **cycloïde**, une courbe en arches |

## Décrire un mouvement
| Le critère | Les valeurs |
| La **trajectoire** | Rectiligne, circulaire, curviligne |
| La **vitesse** | Uniforme (constante), accéléré, ralenti |

On combine les deux mots : rectiligne uniforme, circulaire uniforme, rectiligne accéléré.

## La vitesse
| La grandeur | Sa formule ou sa définition |
| La vitesse **moyenne** | v = d / Δt, en m·s⁻¹ |
| La conversion | 1 m·s⁻¹ = 3,6 km·h⁻¹ |
| La vitesse **instantanée** | Mesurée sur un intervalle très court, entre deux positions successives d'un enregistrement |`,
          },
          questions: [
            ['Qu’est-ce qu’un référentiel ?', ['Un objet de référence, muni d’un repère et d’une horloge', 'La trajectoire d’un objet', 'La vitesse d’un mobile', 'Un système d’unités'], 0, 'Sans lui, décrire un mouvement n’a pas de sens.'],
            ['Un passager assis dans un train est-il en mouvement ?', ['Cela dépend du référentiel choisi', 'Oui, toujours', 'Non, jamais', 'Seulement si le train accélère'], 0, 'Immobile dans le référentiel du train, en mouvement dans celui du sol.'],
            ['Quel référentiel utilise-t-on pour étudier le mouvement des planètes ?', ['Le référentiel héliocentrique', 'Le référentiel terrestre', 'Le référentiel géocentrique', 'Le référentiel du laboratoire'], 0, 'Le géocentrique sert aux satellites de la Terre.'],
            ['Qu’est-ce que la trajectoire d’un point ?', ['L’ensemble de ses positions successives dans un référentiel donné', 'La distance qu’il parcourt', 'Sa vitesse au cours du temps', 'Sa position initiale'], 0, 'Elle change si l’on change de référentiel.'],
            ['Quelle courbe décrit la valve d’une roue de vélo pour un observateur au bord de la route ?', ['Une cycloïde', 'Un cercle', 'Une droite', 'Une parabole'], 0, 'Pour le cycliste, elle décrit un cercle.'],
            ['Comment qualifie-t-on un mouvement dont la trajectoire est une droite et la vitesse constante ?', ['Rectiligne uniforme', 'Circulaire uniforme', 'Rectiligne accéléré', 'Curviligne ralenti'], 0, 'Deux informations : la forme et l’évolution de la vitesse.'],
            ['À combien de km·h⁻¹ correspond 1 m·s⁻¹ ?', ['3,6 km·h⁻¹', '1,0 km·h⁻¹', '0,36 km·h⁻¹', '36 km·h⁻¹'], 0, 'On multiplie par 3,6 pour passer des m·s⁻¹ aux km·h⁻¹.'],
            ['La trajectoire d’un objet est la même dans tous les référentiels.', ['Vrai', 'Faux'], 1, 'Elle dépend du référentiel, comme le mouvement lui-même.'],
          ],
        },
        {
          titre: 'Représentation et variation d’un vecteur vitesse',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Une flèche qui dit tout du mouvement',
            cours: `La vitesse d'un point n'est pas seulement un nombre : c'est un vecteur, qui porte quatre informations.

## Les quatre caractéristiques
| La caractéristique | Ce qu'elle est |
| Le **point d'application** | La position du mobile |
| La **direction** | Celle de la **tangente** à la trajectoire |
| Le **sens** | Celui du mouvement |
| La **valeur** | En m·s⁻¹, représentée par la longueur de la flèche, à une **échelle** choisie |

> La direction du vecteur vitesse est toujours tangente à la trajectoire : c'est ce qui rend visible qu'un mouvement circulaire uniforme n'a rien d'un mouvement « sans changement ».

## Le construire depuis un enregistrement
| L'étape | Le geste |
| 1 | Repérer les positions M(i−1), M(i), M(i+1) |
| 2 | Calculer v(i) ≈ distance M(i−1)M(i+1) divisée par 2τ, où τ est l'intervalle entre deux positions |
| 3 | Tracer la flèche à l'échelle, **tangente** à la trajectoire |

## La variation du vecteur vitesse
C'est la **différence** entre le vecteur vitesse final et le vecteur vitesse initial.

| L'étape graphique | Le geste |
| 1 | Reporter les deux vecteurs à partir d'un **même point** |
| 2 | Tracer le vecteur qui joint l'extrémité du premier à celle du second |

## Ce que la variation révèle
| Le mouvement | Ce qui change | La variation |
| **Rectiligne uniforme** | Rien | **Nulle** |
| Rectiligne accéléré | La valeur | Dans le sens du mouvement |
| **Circulaire uniforme** | La **direction** seule | **Non nulle**, dirigée vers le **centre** |

## Le lien avec les forces
> Le vecteur variation de vitesse a le **même sens** que la somme des forces appliquées au système.

C'est cette correspondance qui fait de l'étude du vecteur vitesse le point d'entrée de toute la mécanique.`,
          },
          questions: [
            ['Quelles sont les quatre caractéristiques d’un vecteur vitesse ?', ['Point d’application, direction, sens et valeur', 'Masse, vitesse, temps et distance', 'Origine, longueur, couleur et échelle', 'Position, trajectoire, durée et accélération'], 0, 'La longueur de la flèche représente la valeur, à l’échelle.'],
            ['Quelle est la direction du vecteur vitesse en un point ?', ['Celle de la tangente à la trajectoire', 'Celle de la corde entre deux points', 'Celle du rayon du cercle', 'Toujours horizontale'], 0, 'Le sens est celui du mouvement.'],
            ['Comment estime-t-on la vitesse au point M_i sur un enregistrement ?', ['En divisant la distance M_(i−1)M_(i+1) par 2 τ', 'En divisant M_iM_(i+1) par 2 τ', 'En multipliant la distance par la durée', 'En mesurant la longueur totale de la trajectoire'], 0, 'τ est l’intervalle de temps entre deux positions successives.'],
            ['Comment construit-on graphiquement la variation du vecteur vitesse ?', ['On reporte les deux vecteurs depuis un même point et on joint leurs extrémités', 'On additionne leurs longueurs', 'On les superpose', 'On calcule leur moyenne'], 0, 'La variation va de l’extrémité du vecteur initial à celle du final.'],
            ['Dans un mouvement rectiligne uniforme, que vaut la variation du vecteur vitesse ?', ['Elle est nulle', 'Elle est maximale', 'Elle pointe vers l’avant', 'Elle change de sens'], 0, 'Ni la direction ni la valeur ne changent.'],
            ['Dans un mouvement circulaire uniforme, la variation du vecteur vitesse est-elle nulle ?', ['Non, la direction change en permanence', 'Oui, la vitesse est constante', 'Oui, la trajectoire est fermée', 'Cela dépend du rayon'], 0, 'Elle pointe vers l’intérieur du cercle.'],
            ['Le vecteur variation de vitesse a le même sens que la somme des forces appliquées.', ['Vrai', 'Faux'], 0, 'C’est le lien entre cinématique et dynamique.'],
            ['Dans quelle unité s’exprime la valeur d’un vecteur vitesse dans le système international ?', ['En m·s⁻¹', 'En km·h⁻¹', 'En m·s⁻²', 'En newtons'], 0, 'On convertit en km·h⁻¹ en multipliant par 3,6.'],
          ],
        },
        {
          titre: 'Modélisation d’une action par une force',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Représenter ce qui agit sur un système',
            cours: `Une action mécanique est ce qui peut mettre en mouvement, arrêter, dévier ou déformer un objet. On la modélise par une force.

## Système et actions
| L'étape | Ce qu'on fait |
| 1 | Définir le **système** étudié |
| 2 | Inventorier ce qui agit sur lui |

| Le type d'action | Sa condition | Ses exemples |
| De **contact** | Un contact matériel | Support, fil, ressort, frottements, air |
| À **distance** | Aucun contact | Pesanteur, magnétisme, électrostatique |

## La force, un vecteur
| Sa caractéristique | Son unité |
| Point d'application, direction, sens | — |
| **Valeur** | Le **newton** (N) |

Un **diagramme objet-interaction** aide à n'en oublier aucune : le système au centre, les acteurs autour, une double flèche par interaction.

## Le poids
P = m × g, avec g ≈ 9,8 N·kg⁻¹ à la surface de la Terre

| La grandeur | Son unité | Ce dont elle dépend |
| La **masse** | kg | L'objet seul : identique partout |
| Le **poids** | N | Le **lieu** : sur la Lune, g ≈ 1,6 N·kg⁻¹ |

Le poids est vertical, dirigé vers le bas, appliqué au **centre de gravité**.

> Un astronaute a la même masse sur la Lune et sur Terre, mais un poids six fois plus faible : masse et poids ne sont pas des synonymes.

## La gravitation
F = G × m(A) × m(B) / d², avec G ≈ 6,67 × 10⁻¹¹ dans les unités du système international

| La propriété | Son contenu |
| Elle est **attractive** | Toujours |
| Elle est **réciproque** | Même valeur pour les deux corps, sens opposés |
| Elle décroît en 1/d² | Doubler la distance divise la force par **quatre** |

## Le principe des actions réciproques
Si A exerce une force sur B, B exerce sur A une force de même direction, de même valeur, de sens opposé.

> Les deux forces ne s'appliquent **pas au même objet** : elles ne se compensent donc jamais entre elles.`,
          },
          questions: [
            ['Comment modélise-t-on une action mécanique ?', ['Par une force, représentée par un vecteur', 'Par une distance', 'Par une masse', 'Par une durée'], 0, 'Point d’application, direction, sens et valeur en newtons.'],
            ['Quelle est l’unité de la valeur d’une force ?', ['Le newton', 'Le joule', 'Le pascal', 'Le kilogramme'], 0, 'Symbole N.'],
            ['Quelle est l’expression du poids d’un objet ?', ['P = m × g', 'P = m / g', 'P = g / m', 'P = m + g'], 0, 'Avec g ≈ 9,8 N·kg⁻¹ à la surface de la Terre.'],
            ['Quelle différence entre masse et poids ?', ['La masse est identique partout, le poids dépend du lieu', 'Le poids est identique partout', 'Ce sont deux mots pour la même grandeur', 'La masse se mesure en newtons'], 0, 'Sur la Lune, g vaut environ 1,6 N·kg⁻¹.'],
            ['Quelle est l’expression de la force d’interaction gravitationnelle ?', ['F = G × m_A × m_B / d²', 'F = G × m_A × m_B / d', 'F = G × d² / (m_A × m_B)', 'F = m_A × m_B × d²'], 0, 'Elle décroît comme le carré de la distance.'],
            ['Que devient la force gravitationnelle si la distance double ?', ['Elle est divisée par quatre', 'Elle est divisée par deux', 'Elle est multipliée par deux', 'Elle ne change pas'], 0, 'Le carré de la distance est au dénominateur.'],
            ['Selon le principe des actions réciproques, les deux forces se compensent-elles ?', ['Non, elles ne s’appliquent pas au même objet', 'Oui, toujours', 'Oui, si les masses sont égales', 'Oui, si les corps sont immobiles'], 0, 'Elles sont opposées mais appliquées à deux systèmes différents.'],
            ['La force exercée par un fil sur un objet est une action à distance.', ['Vrai', 'Faux'], 1, 'C’est une action de contact ; le poids est une action à distance.'],
          ],
        },
        {
          titre: 'Le principe d’inertie',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Ce qui se passe quand les forces se compensent',
            cours: `Le principe d'inertie, énoncé par Galilée puis par Newton, relie les forces appliquées à un système et l'évolution de son vecteur vitesse.

## L'énoncé
| La condition | La conséquence |
| Les forces se **compensent** — leur somme est nulle | Le vecteur vitesse **ne varie pas** : le système est immobile, ou en mouvement rectiligne uniforme |
| La réciproque | Un vecteur vitesse constant implique des forces qui se compensent |

Le tout dans un **référentiel galiléen** — le référentiel terrestre en est une bonne approximation pour les expériences de courte durée.

> L'erreur la plus tenace en mécanique consiste à croire qu'il faut une force pour **entretenir** un mouvement. Il en faut une pour le **changer**.

## La contraposée, plus utile en pratique
| L'observation | La conclusion |
| Le vecteur vitesse **varie** — en valeur, en direction, ou les deux | Les forces **ne se compensent pas** |
| Le sens de cette variation | Celui de la **somme des forces** |

C'est ce raisonnement qu'on applique à un enregistrement de mouvement.

## Trois exemples
| La situation | Le bilan des forces | Le mouvement |
| Une voiture à vitesse constante en ligne droite | Le moteur compense exactement les frottements : somme **nulle** | Rectiligne uniforme |
| Une pierre lâchée sans vitesse | Seul le **poids** agit | La vitesse augmente vers le bas |
| Un palet sur coussin d'air, lancé | Presque aucun frottement | Il conserve sa vitesse et sa direction |

## Chute libre
Un corps en **chute libre** n'est soumis qu'à son poids.

| Le milieu | Ce qui se passe |
| Dans le **vide** | Une plume et une bille tombent **ensemble** |
| Dans l'**air** | La résistance de l'air les sépare — et non la masse |

> Tous les corps en chute libre subissent la même variation de vitesse, quelle que soit leur masse.`,
          },
          questions: [
            ['Que dit le principe d’inertie ?', ['Si les forces se compensent, le vecteur vitesse ne varie pas', 'Une force est nécessaire pour maintenir un mouvement', 'Tout corps finit par s’arrêter', 'La vitesse est proportionnelle à la force'], 0, 'Le système est immobile ou en mouvement rectiligne uniforme.'],
            ['Faut-il une force pour entretenir un mouvement rectiligne uniforme ?', ['Non, il en faut une pour le changer', 'Oui, sinon le mouvement cesse', 'Oui, proportionnelle à la vitesse', 'Cela dépend de la masse'], 0, 'C’est l’erreur la plus tenace en mécanique.'],
            ['Que peut-on conclure si le vecteur vitesse d’un système varie ?', ['Les forces ne se compensent pas', 'Le référentiel n’est pas galiléen', 'La masse a changé', 'Le système est immobile'], 0, 'La somme des forces a le même sens que la variation de vitesse.'],
            ['Pourquoi une voiture à vitesse constante sur une route droite vérifie-t-elle le principe d’inertie ?', ['Parce que la force motrice compense exactement les frottements', 'Parce qu’elle n’est soumise à aucune force', 'Parce que son moteur est éteint', 'Parce que sa masse est constante'], 0, 'La somme vectorielle des forces est nulle.'],
            ['Qu’est-ce qu’un corps en chute libre ?', ['Un corps soumis à son seul poids', 'Un corps qui tombe dans l’air', 'Un corps lâché sans vitesse initiale', 'Un corps sans masse'], 0, 'Toute autre force, comme la résistance de l’air, est négligée.'],
            ['Dans un tube où l’on a fait le vide, une plume et une bille tombent-elles ensemble ?', ['Oui, la masse n’intervient pas dans la chute libre', 'Non, la bille tombe plus vite', 'Non, la plume tombe plus vite', 'Cela dépend de la hauteur'], 0, 'Dans l’air, c’est la résistance de l’air qui les sépare.'],
            ['Le référentiel terrestre est une bonne approximation d’un référentiel galiléen pour une expérience courte.', ['Vrai', 'Faux'], 0, 'C’est ce qui permet d’appliquer le principe en classe.'],
            ['Quel savant a le premier formulé l’idée d’inertie ?', ['Galilée', 'Aristote', 'Kepler', 'Archimède'], 0, 'Newton en fera ensuite sa première loi.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : ondes et signaux
        // ===================================================================
        {
          titre: 'Émission et propagation d’un signal sonore',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'Ce qui vibre, ce qui transporte, ce qui reçoit',
            cours: `Un son naît d'un objet qui vibre, se propage dans un milieu matériel, et est reçu par un détecteur.

## La chaîne du son
| L'étape | Ce qui se passe | Des exemples |
| L'**émission** | Une source **vibre** | Corde, membrane, colonne d'air, cordes vocales |
| La **propagation** | De proche en proche, dans un milieu **matériel** | Air, eau, acier |
| La **réception** | Un détecteur convertit la vibration | L'oreille, un microphone |

## La propagation
Le son est une **onde mécanique** : compressions et dilatations successives du milieu, **sans transport de matière**. Chaque molécule oscille autour de sa position d'équilibre et transmet la perturbation à sa voisine.

> Le son ne se propage **pas** dans le vide : sans matière, aucune vibration à transmettre. C'est ce qui rend les explosions bruyantes des films de l'espace physiquement impossibles.

## La célérité
| Le milieu | La célérité |
| L'**air** à 20 °C | Environ **340 m·s⁻¹** |
| L'**eau** | Environ **1 500 m·s⁻¹** |
| L'**acier** | Plus de **5 000 m·s⁻¹** |

> Elle est d'autant plus grande que le milieu est dense et rigide. On la calcule par v = d / Δt.

## Mesurer une distance avec un son
La méthode de l'**écho** : on mesure la durée aller-retour et l'on divise par deux.

d = v × Δt / 2

| L'application | Son domaine |
| Le **sonar** | La mer |
| L'**échographie**, par **ultrasons** | La médecine |

## Le retard
Δt = (d₂ − d₁) / v

| L'usage | Ce qu'il permet |
| Deux détecteurs à des distances différentes | **Localiser** une source sonore |
| Compter les secondes entre l'éclair et le tonnerre | Estimer la distance d'un orage — la lumière arrive presque instantanément |`,
          },
          questions: [
            ['Qu’est-ce qui produit un son ?', ['Un objet qui vibre', 'Un objet chaud', 'Un objet chargé électriquement', 'Un objet en chute libre'], 0, 'La vibration met en mouvement les molécules voisines.'],
            ['Le son se propage-t-il dans le vide ?', ['Non, il lui faut un milieu matériel', 'Oui, comme la lumière', 'Oui, mais plus lentement', 'Seulement les ultrasons'], 0, 'Sans matière, aucune vibration à transmettre.'],
            ['Le son transporte-t-il de la matière ?', ['Non, seulement de l’énergie de proche en proche', 'Oui, l’air se déplace avec lui', 'Oui, dans les solides seulement', 'Oui, à faible distance'], 0, 'Chaque molécule oscille autour de sa position d’équilibre.'],
            ['Quelle est la célérité du son dans l’air à 20 °C ?', ['Environ 340 m·s⁻¹', 'Environ 1 500 m·s⁻¹', 'Environ 3,0 × 10⁸ m·s⁻¹', 'Environ 34 m·s⁻¹'], 0, 'Elle vaut environ 1 500 m·s⁻¹ dans l’eau.'],
            ['Dans quel milieu le son se propage-t-il le plus vite ?', ['Dans l’acier', 'Dans l’air', 'Dans l’eau', 'Dans le vide'], 0, 'La célérité augmente avec la densité et la rigidité du milieu.'],
            ['Comment calcule-t-on une distance par la méthode de l’écho ?', ['d = v × Δt / 2', 'd = v × Δt', 'd = 2 × v × Δt', 'd = Δt / v'], 0, 'La durée mesurée correspond à un aller-retour.'],
            ['Quelle technique médicale utilise les ultrasons ?', ['L’échographie', 'La radiographie', 'L’IRM', 'La scintigraphie'], 0, 'Elle repose sur le même principe que le sonar.'],
            ['Pourquoi voit-on l’éclair avant d’entendre le tonnerre ?', ['Parce que la lumière se propage beaucoup plus vite que le son', 'Parce que l’éclair se produit avant', 'Parce que le son part plus tard', 'Parce que l’oreille est plus lente que l’œil'], 0, 'On estime la distance de l’orage en comptant les secondes.'],
          ],
        },
        {
          titre: 'Les sons : fréquence, intensité et perception',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'De la grandeur physique à la sensation',
            cours: `Un son se décrit par des grandeurs physiques mesurables, auxquelles correspondent des sensations perçues par l'oreille.

## Grandeur physique et sensation
| La grandeur physique | La sensation perçue |
| La **fréquence** | La **hauteur** : grave ou aigu |
| L'**intensité** | La force du son |
| La **forme du signal** | Le **timbre** |

## Période et fréquence
| La grandeur | Sa définition | Son unité |
| La **période** T | La durée d'un motif | Seconde |
| La **fréquence** f | f = 1 / T | **Hertz** (Hz) |

Un signal de période 2,0 ms a une fréquence de **500 Hz**.

## Hauteur
| Le domaine | Sa fréquence | Qui l'entend |
| Les **infrasons** | Moins de 20 Hz | Certains animaux |
| Le domaine **audible** | De **20 Hz à 20 000 Hz** | L'oreille humaine |
| Les **ultrasons** | Plus de 20 000 Hz | Chauve-souris, dauphins |

Plus la fréquence est grande, plus le son est perçu comme **aigu**.

## Timbre
Deux instruments jouant la même note à la même intensité restent reconnaissables : c'est le **timbre**, lié à la forme du signal et à la présence d'**harmoniques**, fréquences multiples du fondamental.

## Intensité et niveau sonore
| La grandeur | Son symbole | Son unité |
| L'**intensité sonore** | I | W·m⁻² |
| Le **niveau d'intensité sonore** | L | **Décibel** (dB) |

L'échelle est **logarithmique** :

| L'opération | Son effet |
| **+10 dB** | L'intensité est multipliée par **10** ; le son paraît deux fois plus fort |
| Deux sources identiques côte à côte | **+3 dB** seulement |

> Les décibels ne s'additionnent pas comme des nombres ordinaires.

## Quelques repères
| La situation | Son niveau |
| Seuil d'audibilité | **0 dB** |
| Conversation | Environ 60 dB |
| Rue passante | 80 dB |
| Concert | 100 dB |
| **Seuil de douleur** | Vers **120 dB** |

## Protéger son audition
> L'exposition prolongée à des niveaux élevés détruit **définitivement** les cellules ciliées de l'oreille interne : elles ne se régénèrent pas. Acouphènes et perte d'audition sont **irréversibles**.

D'où l'intérêt des protections auditives, des pauses, et de la distance aux enceintes.`,
          },
          questions: [
            ['Quelle relation lie période et fréquence ?', ['f = 1 / T', 'f = T', 'f = T²', 'f = 2 × T'], 0, 'La fréquence s’exprime en hertz.'],
            ['Quelle fréquence correspond à une période de 2,0 ms ?', ['500 Hz', '2 000 Hz', '50 Hz', '20 Hz'], 0, 'f = 1 / (2,0 × 10⁻³) = 500 Hz.'],
            ['À quelle grandeur physique la hauteur d’un son est-elle liée ?', ['À la fréquence', 'À l’intensité', 'À la durée', 'À la célérité'], 0, 'Plus la fréquence est grande, plus le son est aigu.'],
            ['Quel est le domaine des fréquences audibles par l’humain ?', ['Environ de 20 Hz à 20 000 Hz', 'De 0 à 100 Hz', 'De 1 000 à 100 000 Hz', 'De 20 000 à 200 000 Hz'], 0, 'En dessous, les infrasons ; au-dessus, les ultrasons.'],
            ['Qu’est-ce que le timbre d’un son ?', ['Ce qui permet de distinguer deux instruments jouant la même note', 'La hauteur du son', 'Le niveau sonore', 'La durée de la note'], 0, 'Il est lié à la présence d’harmoniques.'],
            ['Dans quelle unité exprime-t-on le niveau d’intensité sonore ?', ['Le décibel', 'Le hertz', 'Le watt', 'Le newton'], 0, 'L’échelle des décibels est logarithmique.'],
            ['Que signifie une augmentation de 10 dB ?', ['L’intensité sonore est multipliée par 10', 'L’intensité est multipliée par 2', 'L’intensité augmente de 10 W·m⁻²', 'La fréquence est multipliée par 10'], 0, 'Le son est perçu environ deux fois plus fort.'],
            ['Les cellules ciliées détruites par une exposition sonore excessive se régénèrent avec le temps.', ['Vrai', 'Faux'], 1, 'La perte d’audition et les acouphènes sont irréversibles.'],
          ],
        },
        {
          titre: 'Intensité et tension dans un circuit complexe',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'Deux lois pour lire n’importe quel circuit',
            cours: `Dans un circuit électrique, deux grandeurs se mesurent : l'intensité du courant et la tension aux bornes des dipôles.

## Les deux grandeurs
| La grandeur | Ce qu'elle traduit | Son unité | Son appareil, et son branchement |
| L'**intensité** I | Le débit de charges | Ampère (A) | **Ampèremètre**, en **série** |
| La **tension** U | La différence d'état électrique entre deux points | Volt (V) | **Voltmètre**, en **dérivation** |

> Se tromper de branchement n'est pas une erreur de forme : un ampèremètre monté en dérivation court-circuite le dipôle et peut être détruit.

## Les deux montages
| Le montage | Sa structure |
| En **série** | Les dipôles se suivent sur une **seule boucle** |
| En **dérivation** | Plusieurs branches, partant de deux **nœuds** communs |

## La loi des nœuds
La somme des intensités qui **arrivent** à un nœud égale la somme de celles qui en **repartent**.

> Elle traduit la conservation de la charge : rien ne s'accumule au nœud. Dans un circuit série, l'intensité est donc la **même partout**.

## La loi des mailles
Dans une **maille**, la somme algébrique des tensions est nulle.

| Le montage | Ce qui en découle |
| En **série** | La tension du générateur est la **somme** des tensions aux bornes des récepteurs |
| En **dérivation** | Les branches entre deux mêmes nœuds ont la **même** tension |

## Un exemple
Deux lampes en dérivation sous 6,0 V.

| Le point | Sa valeur |
| Tension aux bornes de chaque lampe | **6,0 V** |
| Intensité dans la première | 0,20 A |
| Intensité dans la seconde | 0,30 A |
| Intensité débitée par le générateur | **0,50 A** |

> Retirer une lampe ne modifie pas la tension de l'autre : c'est pourquoi l'éclairage domestique est câblé en dérivation.`,
          },
          questions: [
            ['Comment branche-t-on un ampèremètre ?', ['En série, pour être traversé par le courant', 'En dérivation aux bornes du dipôle', 'À la place du générateur', 'Entre deux nœuds'], 0, 'Le voltmètre, lui, se branche en dérivation.'],
            ['Dans quelle unité se mesure une tension ?', ['Le volt', 'L’ampère', 'L’ohm', 'Le watt'], 0, 'L’intensité se mesure en ampères.'],
            ['Que dit la loi des nœuds ?', ['La somme des intensités entrantes égale la somme des intensités sortantes', 'La somme des tensions d’une maille est nulle', 'L’intensité est proportionnelle à la tension', 'La tension est la même dans tout le circuit'], 0, 'Elle traduit la conservation de la charge.'],
            ['Dans un circuit série, comment varie l’intensité ?', ['Elle est la même partout', 'Elle diminue à chaque dipôle', 'Elle se partage entre les dipôles', 'Elle augmente vers le générateur'], 0, 'Conséquence directe de la loi des nœuds.'],
            ['Que dit la loi des mailles ?', ['La somme algébrique des tensions le long d’une maille est nulle', 'Les intensités s’additionnent dans une maille', 'La tension augmente à chaque nœud', 'Les tensions se multiplient'], 0, 'Dans un circuit série, la tension du générateur est la somme de celles des récepteurs.'],
            ['Deux lampes en dérivation sous 6,0 V : quelle tension reçoit chacune ?', ['6,0 V', '3,0 V', '12 V', 'Cela dépend de leur résistance'], 0, 'Les branches entre deux mêmes nœuds ont la même tension.'],
            ['Deux branches en dérivation traversées par 0,20 A et 0,30 A : que débite le générateur ?', ['0,50 A', '0,10 A', '0,25 A', '0,06 A'], 0, 'Par application de la loi des nœuds.'],
            ['L’éclairage domestique est câblé en série.', ['Vrai', 'Faux'], 1, 'Il est câblé en dérivation, pour que chaque lampe reçoive la même tension.'],
          ],
        },
        {
          titre: 'La loi d’Ohm et la résistance au courant électrique',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'Une droite, une pente, une résistance',
            cours: `Un conducteur ohmique — ou résistor — est un dipôle qui s'oppose au passage du courant de façon régulière.

## L'énoncé
U = R × I

| La grandeur | Son unité |
| U | Volt (V) |
| I | Ampère (A) |
| R | **Ohm** (Ω) |

La tension et l'intensité sont **proportionnelles**.

## La caractéristique
| Le dipôle | L'allure de U en fonction de I |
| Un **conducteur ohmique** | Une **droite passant par l'origine**, de coefficient directeur R |
| Une **lampe** | Une courbe : sa résistance augmente avec la température — elle n'est pas ohmique |

> Deux vérifications d'un coup : la droite dit que le dipôle est ohmique, sa pente donne la valeur de la résistance.

## Ce dont dépend la résistance
| Le facteur | Son effet |
| La **nature** du matériau | Propre à chacun |
| La **longueur** du fil | La résistance **augmente** avec elle |
| La **section** | Elle **diminue** quand la section augmente |

| L'outil | Ce qu'il donne |
| Le **code de couleurs** à quatre anneaux | La valeur et la tolérance |
| L'**ohmmètre** | La mesure directe, **hors circuit** |

## L'effet Joule
Un conducteur parcouru par un courant s'**échauffe**.

| Où il est… | Ses exemples |
| **Recherché** | Radiateur, grille-pain, bouilloire |
| **Subi** | Composants électroniques, qu'il faut refroidir |

## Puissance et énergie
| La grandeur | Sa formule | Son unité |
| **Puissance** | P = U × I, ou P = R × I² pour un conducteur ohmique | Watt (W) |
| **Énergie** | E = P × Δt | Joule (J), ou **kilowattheure** |

1 kWh = 3,6 × 10⁶ J

## La sécurité
> À tension donnée, l'intensité qui traverse le corps dépend de sa **résistance** — elle-même très diminuée par l'humidité.

D'où l'interdiction absolue de manipuler un appareil électrique les mains mouillées.`,
          },
          questions: [
            ['Quelle est l’expression de la loi d’Ohm ?', ['U = R × I', 'U = I / R', 'R = U × I', 'I = U × R'], 0, 'Avec U en volts, I en ampères, R en ohms.'],
            ['Quelle est l’unité de la résistance ?', ['L’ohm', 'Le volt', 'L’ampère', 'Le watt'], 0, 'Symbole Ω.'],
            ['Quelle est l’allure de la caractéristique U = f(I) d’un conducteur ohmique ?', ['Une droite passant par l’origine', 'Une parabole', 'Une courbe croissante puis décroissante', 'Une droite ne passant pas par l’origine'], 0, 'Son coefficient directeur est la résistance.'],
            ['Une lampe est-elle un conducteur ohmique ?', ['Non, sa résistance augmente avec la température', 'Oui, comme un résistor', 'Oui, si la tension est faible', 'Cela dépend de la couleur du filament'], 0, 'Sa caractéristique n’est pas une droite.'],
            ['Comment la résistance d’un fil varie-t-elle avec sa longueur ?', ['Elle augmente quand la longueur augmente', 'Elle diminue quand la longueur augmente', 'Elle ne dépend pas de la longueur', 'Elle est proportionnelle au carré de la longueur'], 0, 'Elle diminue en revanche quand la section augmente.'],
            ['Qu’est-ce que l’effet Joule ?', ['L’échauffement d’un conducteur parcouru par un courant', 'La production d’un champ magnétique', 'La chute de tension aux bornes d’un générateur', 'La perte d’électrons d’un métal'], 0, 'Recherché dans un radiateur, subi dans un processeur.'],
            ['Quelle est l’expression de la puissance électrique ?', ['P = U × I', 'P = U / I', 'P = U + I', 'P = U² × I'], 0, 'Pour un conducteur ohmique, on a aussi P = R × I².'],
            ['Pourquoi le danger électrique augmente-t-il avec les mains mouillées ?', ['Parce que la résistance du corps diminue, donc l’intensité augmente', 'Parce que la tension augmente', 'Parce que l’eau produit du courant', 'Parce que la puissance diminue'], 0, 'C’est une application directe de la loi d’Ohm.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 : vision et image
        // ===================================================================
        {
          titre: 'Propagation et décomposition de la lumière',
          axe: 'Vision et image',
          lecon: {
            titre: 'Des rayons droits, et un blanc qui n’est pas une couleur',
            cours: `La lumière se propage en ligne droite dans un milieu transparent et homogène : on la modélise par des rayons lumineux.

## Ce que la propagation rectiligne explique
| Le phénomène | Son mécanisme |
| Les **ombres** nettes | Un objet opaque intercepte les rayons |
| La **chambre noire** | Chaque point de l'objet envoie un rayon à travers le trou |
| Les **éclipses** | Un astre entre dans l'ombre d'un autre |
| Le **viseur** | On aligne l'œil, la mire et la cible |

## La vitesse de la lumière
| Le repère | Sa valeur |
| Dans le **vide** | c = **3,00 × 10⁸ m·s⁻¹** |
| Dans un milieu matériel | Plus faible |
| Une **année-lumière** | Environ 9,5 × 10¹⁵ m |

> Voir loin, c'est voir tôt : le Soleil que nous observons est celui d'il y a huit minutes, et une étoile à mille années-lumière nous montre son passé.

## Sources primaires et objets diffusants
| Le type | Ce qu'il fait | Ses exemples |
| Source **primaire** | Elle **produit** sa lumière | Soleil, lampe, écran, flamme |
| Objet **diffusant** | Il **renvoie** dans toutes les directions la lumière reçue | La Lune, une page, un mur |

Sans éclairage, un objet diffusant est invisible.

## La lumière blanche est composite
Un **prisme** ou un réseau **disperse** la lumière blanche et fait apparaître un **spectre continu**, du rouge au violet.

> Newton l'a montré en **recombinant** ce spectre pour retrouver du blanc : le blanc n'est pas une couleur simple, c'est une **superposition**.

## Longueur d'onde et couleur
| Le domaine | Sa longueur d'onde |
| **Ultraviolets** | Moins de 400 nm |
| **Visible** | De **400 nm** (violet) à **800 nm** (rouge) |
| **Infrarouges** | Plus de 800 nm |

| La lumière | Ce qu'elle contient |
| **Monochromatique** | Une seule radiation — un laser |
| **Polychromatique** | Plusieurs |

## Les spectres
| La source | Son spectre |
| Un solide **chaud** | **Continu**, son aspect dépend de la température |
| Un gaz chaud à basse pression | Un spectre de **raies d'émission**, propre à chaque élément |

> C'est ainsi qu'on identifie la composition d'une étoile sans y aller.`,
          },
          questions: [
            ['Dans quel type de milieu la lumière se propage-t-elle en ligne droite ?', ['Un milieu transparent et homogène', 'Un milieu opaque', 'Un milieu quelconque', 'Uniquement dans le vide'], 0, 'C’est le principe de propagation rectiligne.'],
            ['Quelle est la vitesse de la lumière dans le vide ?', ['3,00 × 10⁸ m·s⁻¹', '3,00 × 10⁵ m·s⁻¹', '340 m·s⁻¹', '1,5 × 10³ m·s⁻¹'], 0, 'Elle est plus faible dans un milieu matériel.'],
            ['Qu’est-ce qu’une année-lumière ?', ['La distance parcourue par la lumière en un an', 'La durée d’un trajet lumineux', 'Une unité de temps astronomique', 'La distance Terre-Soleil'], 0, 'Environ 9,5 × 10¹⁵ mètres.'],
            ['Quelle différence entre une source primaire et un objet diffusant ?', ['La source primaire produit sa lumière, l’objet diffusant la renvoie', 'L’objet diffusant est toujours plus lumineux', 'La source primaire est toujours chaude', 'Il n’y a pas de différence'], 0, 'La Lune est un objet diffusant, le Soleil une source primaire.'],
            ['Que produit un prisme éclairé par de la lumière blanche ?', ['Un spectre continu du rouge au violet', 'Une seule radiation', 'Une ombre nette', 'Un rayonnement infrarouge'], 0, 'La lumière blanche est une superposition de radiations.'],
            ['Quel est approximativement le domaine des longueurs d’onde visibles ?', ['De 400 nm à 800 nm', 'De 100 nm à 200 nm', 'De 1 mm à 1 cm', 'De 800 nm à 1 600 nm'], 0, 'En dessous les UV, au-dessus les infrarouges.'],
            ['Qu’est-ce qu’une lumière monochromatique ?', ['Une lumière constituée d’une seule radiation', 'Une lumière blanche', 'Une lumière de faible intensité', 'Une lumière invisible'], 0, 'Un laser en est le meilleur exemple.'],
            ['Un gaz chaud à basse pression donne un spectre continu.', ['Vrai', 'Faux'], 1, 'Il donne un spectre de raies d’émission, caractéristique de l’élément.'],
          ],
        },
        {
          titre: 'Réflexion et réfraction de la lumière, le prisme',
          axe: 'Vision et image',
          lecon: {
            titre: 'Ce qui arrive à un rayon qui change de milieu',
            cours: `Quand un rayon lumineux rencontre la surface séparant deux milieux transparents, une partie rebondit et une partie traverse en changeant de direction.

## Le vocabulaire
| Le terme | Ce qu'il désigne |
| Le rayon **incident** | Celui qui arrive |
| Le **point d'incidence** | Où il touche la surface |
| La **normale** | La perpendiculaire à la surface en ce point |

> Tous les angles se mesurent **par rapport à la normale**, jamais par rapport à la surface. C'est l'erreur la plus fréquente.

## La réflexion
| La loi | Son énoncé |
| L'angle | L'angle de réflexion est **égal** à l'angle d'incidence |
| Le plan | Le rayon réfléchi appartient au plan d'incidence |

| La surface | Le type de réflexion | Son effet |
| **Polie** | **Spéculaire** | Un miroir |
| **Rugueuse** | **Diffuse** | Elle rend les objets visibles de partout |

## La réfraction
La **loi de Snell-Descartes** :

n₁ × sin i₁ = n₂ × sin i₂

| Le milieu | Son indice n |
| Air | 1,00 |
| Eau | 1,33 |
| Verre | Environ 1,5 |

L'indice est un nombre sans unité, supérieur ou égal à 1.

> En passant dans un milieu **plus réfringent**, le rayon se **rapproche** de la normale ; en en sortant, il s'en écarte.

## Ce que la réfraction explique
Le bâton qui semble brisé à la surface de l'eau, la profondeur d'une piscine qui paraît plus faible, les mirages, les lentilles et les fibres optiques.

## La réflexion totale
| La condition | Ce qui se passe |
| Passage d'un milieu **plus** réfringent vers un milieu **moins** réfringent | Au-delà d'un **angle limite**, plus aucun rayon réfracté |
| Toute la lumière | Elle est **réfléchie** |

> C'est le principe de la **fibre optique**, qui guide la lumière sur des kilomètres.

## Le prisme
L'indice de réfraction **dépend de la longueur d'onde** : le **violet** est plus dévié que le rouge.

| Le phénomène | Où on l'observe |
| La **dispersion** | Un prisme sépare les radiations de la lumière blanche |
| L'**arc-en-ciel** | Le même phénomène dans des gouttes d'eau |`,
          },
          questions: [
            ['Par rapport à quoi mesure-t-on les angles en optique ?', ['Par rapport à la normale à la surface', 'Par rapport à la surface elle-même', 'Par rapport au rayon réfléchi', 'Par rapport à l’horizontale'], 0, 'C’est l’erreur la plus fréquente en exercice.'],
            ['Que dit la loi de la réflexion ?', ['L’angle de réflexion est égal à l’angle d’incidence', 'L’angle de réflexion est le double de l’angle d’incidence', 'Le rayon réfléchi est perpendiculaire au rayon incident', 'Le rayon réfléchi suit la normale'], 0, 'Les deux rayons sont dans le plan d’incidence.'],
            ['Quelle est l’expression de la loi de Snell-Descartes pour la réfraction ?', ['n₁ × sin i₁ = n₂ × sin i₂', 'n₁ × i₁ = n₂ × i₂', 'sin i₁ / sin i₂ = n₁ × n₂', 'n₁ / sin i₁ = n₂ / sin i₂'], 0, 'n est l’indice de réfraction du milieu.'],
            ['Que vaut approximativement l’indice de réfraction de l’eau ?', ['1,33', '1,00', '0,75', '2,42'], 0, 'Celui de l’air vaut 1,00, celui du verre environ 1,5.'],
            ['Que se passe-t-il quand un rayon entre dans un milieu plus réfringent ?', ['Il se rapproche de la normale', 'Il s’écarte de la normale', 'Il n’est pas dévié', 'Il est totalement réfléchi'], 0, 'Il s’en écarte en sortant du milieu plus réfringent.'],
            ['Sur quel phénomène repose la fibre optique ?', ['La réflexion totale', 'La dispersion', 'La diffraction', 'L’absorption'], 0, 'Au-delà de l’angle limite, toute la lumière est réfléchie.'],
            ['Pourquoi un prisme disperse-t-il la lumière blanche ?', ['Parce que l’indice de réfraction dépend de la longueur d’onde', 'Parce que le verre est coloré', 'Parce que la lumière ralentit', 'Parce que le prisme est triangulaire'], 0, 'Le violet est plus dévié que le rouge.'],
            ['Une réflexion diffuse se produit sur une surface parfaitement polie.', ['Vrai', 'Faux'], 1, 'Elle se produit sur une surface rugueuse ; le miroir donne une réflexion spéculaire.'],
          ],
        },
        {
          titre: 'Les lentilles convergentes',
          axe: 'Vision et image',
          lecon: {
            titre: 'Un morceau de verre qui rassemble la lumière',
            cours: `Une lentille convergente est plus épaisse au centre qu'aux bords. Elle fait converger un faisceau de lumière parallèle.

## Le vocabulaire
| Le terme | Sa définition |
| Le **centre optique** O | Le point par lequel un rayon passe **sans être dévié** |
| L'**axe optique** | La droite par O, perpendiculaire à la lentille |
| Le **foyer image** F′ | Où convergent les rayons arrivant parallèlement à l'axe |
| Le **foyer objet** F | Symétrique de F′ par rapport à O |
| La **distance focale** f′ | La longueur OF′, en mètres |

## La vergence
C = 1 / f′, en **dioptries** (δ), avec f′ en mètres

| La lentille | Sa vergence |
| De distance focale 0,20 m | **5 δ** |
| Fortement bombée | Grande vergence, très convergente |
| **Divergente** | Vergence **négative** |

> Les corrections optiques sont exprimées en dioptries : le « +2 » d'une paire de lunettes de lecture est une vergence.

## Les trois rayons particuliers
| Le rayon incident | Ce qu'il devient |
| Passant par **O** | Non dévié |
| **Parallèle à l'axe** | Il repart par **F′** |
| Passant par **F** | Il repart **parallèle à l'axe** |

Deux d'entre eux suffisent à construire une image.

## L'œil et son modèle
| L'élément de l'œil | Son équivalent optique |
| Le **cristallin** | Une lentille convergente |
| L'**iris** et la **pupille** | Un diaphragme |
| La **rétine** | Un écran |

L'**accommodation** est la déformation du cristallin qui garde l'image nette quand l'objet se rapproche.

## Les défauts courants
| Le défaut | Où se forme l'image | La correction |
| **Myopie** | **En avant** de la rétine | Une lentille **divergente** |
| **Hypermétropie** | En **arrière** | Une lentille **convergente** |
| **Presbytie** | Le cristallin perd sa souplesse avec l'âge | Une correction de près |`,
          },
          questions: [
            ['Comment reconnaît-on une lentille convergente ?', ['Elle est plus épaisse au centre qu’aux bords', 'Elle est plus fine au centre', 'Elle est plane', 'Elle est teintée'], 0, 'Elle fait converger un faisceau parallèle.'],
            ['Qu’est-ce que le foyer image F′ ?', ['Le point où convergent les rayons arrivant parallèlement à l’axe optique', 'Le centre de la lentille', 'Le point où se trouve l’objet', 'Le point de l’écran'], 0, 'La distance OF′ est la distance focale.'],
            ['Quelle est l’expression de la vergence ?', ['C = 1 / f′', 'C = f′', 'C = f′²', 'C = 2 × f′'], 0, 'Elle s’exprime en dioptries, avec f′ en mètres.'],
            ['Quelle est la distance focale d’une lentille de vergence 5 δ ?', ['0,20 m', '5 m', '0,05 m', '2,0 m'], 0, 'f′ = 1 / 5 = 0,20 m.'],
            ['Que devient un rayon passant par le centre optique ?', ['Il n’est pas dévié', 'Il repart parallèle à l’axe', 'Il passe par F′', 'Il est réfléchi'], 0, 'C’est l’un des trois rayons particuliers.'],
            ['Que devient un rayon arrivant parallèlement à l’axe optique ?', ['Il repart en passant par le foyer image F′', 'Il n’est pas dévié', 'Il repart par le foyer objet F', 'Il est absorbé'], 0, 'C’est la définition même du foyer image.'],
            ['Quel élément de l’œil joue le rôle de lentille convergente ?', ['Le cristallin', 'La rétine', 'L’iris', 'La cornée uniquement'], 0, 'La rétine joue le rôle de l’écran.'],
            ['Par quel type de lentille corrige-t-on la myopie ?', ['Une lentille divergente', 'Une lentille convergente', 'Un prisme', 'Un miroir'], 0, 'Chez le myope, l’image se forme en avant de la rétine.'],
          ],
        },
        {
          titre: 'Construction de l’image d’un objet',
          axe: 'Vision et image',
          lecon: {
            titre: 'Tracer, mesurer, vérifier par le calcul',
            cours: `Construire l'image d'un objet à travers une lentille convergente, c'est suivre deux rayons particuliers et repérer leur point de rencontre.

## La méthode
| L'étape | Le geste |
| 1 | Placer AB **perpendiculairement** à l'axe, A sur l'axe |
| 2 | Depuis B, tracer le rayon passant par **O** : non dévié |
| 3 | Tracer le rayon **parallèle à l'axe** : il repart par F′ |
| 4 | Leur intersection donne **B′** |
| 5 | A′ est sur l'axe, à la verticale de B′ |

## Image réelle, image virtuelle
| La position de l'objet | L'image | Son sens | Où on la voit |
| **Au-delà** de F | **Réelle** | Renversée | Sur un écran |
| **Entre F et la lentille** | **Virtuelle** | Droite, agrandie | À travers la lentille — c'est la **loupe** |

> Une image réelle se **projette**, une image virtuelle se **regarde**.

## Les relations de conjugaison
Avec les mesures algébriques comptées depuis O :

1/OA′ − 1/OA = 1/OF′

γ = A′B′/AB = OA′/OA

| La valeur de γ | Ce qu'elle dit |
| **Négative** | L'image est **renversée** |
| Valeur absolue supérieure à 1 | L'image est **agrandie** |

## Un exemple
| La donnée | Sa valeur |
| Objet à | 30 cm de la lentille |
| Distance focale | 10 cm |
| Position de l'image | **15 cm** de l'autre côté |
| Grandissement | **−0,5** |

L'image est donc réelle, renversée et deux fois plus petite.

## Les applications
| L'instrument | L'image formée |
| L'**appareil photo**, l'**œil** | Réelle et renversée, sur un capteur ou sur la rétine — le cerveau la redresse |
| Le **vidéoprojecteur** | Réelle et agrandie |
| La **loupe**, l'**oculaire** de microscope | **Virtuelle** et agrandie |`,
          },
          questions: [
            ['Combien de rayons particuliers suffisent à construire une image ?', ['Deux', 'Un seul', 'Trois obligatoirement', 'Quatre'], 0, 'Le troisième sert de vérification.'],
            ['Où se forme l’image si l’objet est au-delà du foyer objet F ?', ['De l’autre côté de la lentille, réelle et renversée', 'Du même côté, virtuelle et droite', 'Au foyer image exactement', 'À l’infini'], 0, 'On peut la recueillir sur un écran.'],
            ['Quelle image obtient-on avec une loupe ?', ['Une image virtuelle, droite et agrandie', 'Une image réelle renversée', 'Une image réelle réduite', 'Aucune image'], 0, 'L’objet est placé entre le foyer objet et la lentille.'],
            ['Quelle est la relation de conjugaison ?', ['1/OA′ − 1/OA = 1/OF′', '1/OA′ + 1/OA = 1/OF′', 'OA′ − OA = OF′', 'OA′ × OA = OF′'], 0, 'Avec des mesures algébriques sur l’axe orienté.'],
            ['Comment calcule-t-on le grandissement ?', ['γ = A′B′/AB = OA′/OA', 'γ = AB/A′B′', 'γ = OA/OF′', 'γ = OA × OA′'], 0, 'Un grandissement négatif signale une image renversée.'],
            ['Que signifie un grandissement de −0,5 ?', ['L’image est renversée et deux fois plus petite', 'L’image est droite et deux fois plus grande', 'L’image est virtuelle', 'L’image est à l’infini'], 0, 'Le signe donne le sens, la valeur absolue la taille.'],
            ['L’image formée sur la rétine par l’œil est droite.', ['Vrai', 'Faux'], 1, 'Elle est réelle et renversée ; c’est le cerveau qui la redresse.'],
            ['Quel dispositif forme une image réelle agrandie ?', ['Le vidéoprojecteur', 'La loupe', 'L’appareil photo', 'Le télescope à l’oculaire'], 0, 'L’objet y est placé juste au-delà du foyer objet.'],
          ],
        },
      ],
    },
  ],
}
