// Anglais — Troisième : LE PROGRAMME DE LANGUE (41 fiches).
//
// LE DÉFAUT. La page « Anglais » d'un élève de 3e s'ouvre sur CINQ fiches
// héritées du tout premier jeu de données (migration 008) : « Le passif », « Les
// modaux : conseils et obligation », « Present perfect vs prétérit », « Le monde
// du travail » et « Préparer l'épreuve orale ». Cinq lignes pour une année
// entière. Un élève qui bloque sur les dénombrables, les question tags, le
// gérondif, le discours indirect ou l'expression de la durée ne trouve RIEN.
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 4 chapitres de la maquette de référence et
// leurs 41 fiches :
//   1. Le groupe nominal  (6)    3. Les temps   (8)
//   2. Le groupe verbal  (14)    4. La phrase  (13)
//
// ⚠️ POURQUOI CELUI-CI EST ÉCRIT, ET NON IMPORTÉ DE LA TERMINALE. L'espagnol
// (297) et l'allemand (299) de 3e importent les fiches du lycée, parce que leurs
// maquettes de 3e sont, titre pour titre, celles de la Terminale. Ce n'est PAS
// le cas de l'anglais : `anglais-tle.mjs` (migration 226, rangée par la 243)
// tient le programme en 24 fiches FUSIONNÉES — un seul « Les auxiliaires
// modaux », un seul « Le comparatif et le superlatif », un seul « Les questions »
// —, là où la maquette de 3e en demande 41, dépliées une notion à la fois : sept
// fiches pour la seule modalité, une pour le comparatif et une pour le
// superlatif, une pour les question tags. Importer les 24 fiches donnerait un
// dossier qui ne ressemble pas à la maquette et qui, surtout, oblige l'élève de
// collège à chercher « donner un conseil » à l'intérieur d'une fiche qui traite
// aussi de la probabilité et de la permission. Le découpage fin est ici la
// valeur : les 41 fiches sont donc ÉCRITES.
//
// Conséquence assumée : une même règle peut exister à deux endroits, dite plus
// simplement en 3e et plus largement en Tle. Une correction de règle devra être
// portée aux deux modules — c'est le prix du découpage propre à chaque niveau.
//
// LES CINQ FICHES HÉRITÉES PARTENT (voir `menage`), toutes recouvertes par le
// nouveau découpage : « Le passif » devient « La voix passive », « Les modaux »
// se déplient en sept fiches, « Present perfect vs prétérit » en quatre, « Le
// monde du travail » et « Préparer l'épreuve orale » ne sont pas des points de
// langue — ce sont des thèmes, et un dossier de matière ne montre que son
// programme (CLAUDE.md).
//
// ⚠️ Le slug `anglais` porte désormais QUATRE modules (`anglais-tle.mjs` → 226,
// `anglais-1re.mjs` → 266, `anglais-2de.mjs` → 286, celui-ci → 298) : ne JAMAIS
// générer avec `--slugs anglais`, qui les fusionnerait et réécrirait trois
// migrations. Toujours `--modules anglais-3e`.

export default {
  slug: 'anglais',
  nom: 'Anglais',

  titreMigration: 'L’ANGLAIS DE TROISIÈME, RENDU À SON PROGRAMME (41 fiches)',

  motif: `LE DÉFAUT : l'anglais de 3e n'avait que les 5 fiches du premier jeu de données
de l'app — « Le passif », « Les modaux : conseils et obligation », « Present
perfect vs prétérit », « Le monde du travail », « Préparer l'épreuve orale ». Un
élève qui bloque sur les dénombrables, les question tags, le gérondif, le
discours indirect ou l'expression de la durée ne trouvait RIEN à réviser.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme de LANGUE, en
suivant la maquette de référence — 4 chapitres (Le groupe nominal, Le groupe
verbal, Les temps, La phrase) et leurs 41 fiches, aux positions 1 à 41. Les 5
fiches héritées partent, leurs quiz et leurs lignes de la file « À revoir » avec
elles.
POURQUOI ÉCRITE ET NON IMPORTÉE DU LYCÉE, contrairement à l'espagnol (297) et à
l'allemand (299) de 3e : le module de Terminale tient le programme en 24 fiches
FUSIONNÉES (un seul « Les auxiliaires modaux », un seul « Le comparatif et le
superlatif »), là où la maquette de 3e en demande 41, dépliées une notion à la
fois. Le découpage fin est ici la valeur : un élève de collège doit trouver
« donner un conseil » comme une fiche, pas comme un paragraphe au milieu d'une
autre.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme, et l'INSERT l'écrit pour les 41 fiches. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS, comme dans les migrations 243 à 299 — la 234 n'a jamais été
exécutée telle quelle. Sans cette reprise, la migration échouerait sur « column
chapters.theme does not exist », les 5 anciennes fiches déjà supprimées et les 41
neuves pas encore posées : une matière vide.
Le ménage qui suit LIT cette colonne : elle doit exister avant lui, pas seulement
avant les insertions.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
(pour cacher mind_map) et ne l'a rendu que colonne par colonne ; une colonne
ajoutée après elle n'hérite d'aucun droit, et l'app lirait « permission denied »
au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 fiches héritées de la 008 partent, au niveau 3e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — même choix qu'en 266, 286 et 297 :
« Préparer l'épreuve orale » porte une apostrophe, et rien ne garantit que la
base porte la même que ce fichier (droite dans le contenu ancien, typographique
dans le récent) ; un DELETE par titre ne trouverait alors pas la ligne, EN
SILENCE. Le critère « pas de chapitre de programme » vise exactement les cinq
lignes voulues : elles datent de la 008, bien avant la colonne theme, tandis que
les 41 fiches neuves en portent un dès l'INSERT — le ménage tourne AVANT les
insertions et ne peut donc jamais mordre sur elles, ni au premier passage ni au
rejeu.
Le filtre level = '3e' est indispensable : l'anglais existe sur SEPT niveaux, et
les autres niveaux du collège portent eux aussi des chapitres sans theme.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins, sans leçon mais toujours rattachés
à « Anglais / 3e » par subject + grade_level, donc toujours tirables par le
moteur de questions), puis les chapitres, dont les leçons partent en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = '3e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = '3e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = '3e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['3e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Le groupe nominal
        // ===================================================================
        {
          titre: 'Les noms',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Dénombrables, indénombrables, pluriels irréguliers',
            cours: `Un nom anglais se range d'abord dans l'une de deux familles — et tout le reste en découle.

## Dénombrable ou indénombrable
| Le critère | **Dénombrable** | **Indénombrable** |
| On peut le compter | **Oui** : a book, two books | **Non** |
| Le pluriel | Il existe | **Aucun** |
| L'article **a / an** | Possible au singulier | **Impossible** |
| Le verbe | Singulier ou pluriel | Toujours **singulier** |

## Le pluriel régulier
| La terminaison du nom | Sa marque de pluriel | Un exemple |
| Cas général | **-s** | cars, tables |
| **-s, -sh, -ch, -x, -o** | **-es** | boxes, watches, potatoes |
| **Consonne + y** | **-ies** | city → cit**ies** (mais boy → boys) |
| **-f / -fe** | Souvent **-ves** | leaf → lea**ves**, knife → kni**ves** |

## Les pluriels irréguliers
| Le singulier | Le pluriel |
| man | **men** |
| woman | **women** |
| child | **children** |
| foot | **feet** |
| tooth | **teeth** |
| mouse | **mice** |
| person | **people** |
| sheep, fish, deer | **Inchangés** |

## Les indénombrables courants
water, money, **information**, **advice**, **news**, **furniture**, homework, music

| La règle | Son exemple |
| Verbe au singulier | *The news is good* |
| Pour les compter : un **partitif** | a **glass of** water, a **piece of** advice, two **pieces of** furniture |

> Attention aux faux amis : **information**, **advice**, **news** et **furniture** sont indénombrables en anglais, alors qu'on dit « des informations » et « des conseils ».

## Le génitif
| Le possesseur | Sa marque | Un exemple |
| Singulier | **'s** | my sister**'s** phone |
| Pluriel en -s | L'apostrophe **seule** | the student**s'** books |`,
          },
          questions: [
            ['Quel est le pluriel de « child » ?', ['children', 'childs', 'childes', 'childrens'], 0, 'C’est l’un des pluriels irréguliers les plus fréquents.'],
            ['Quel est le pluriel de « city » ?', ['cities', 'citys', 'cityes', 'cityies'], 0, 'Consonne + y donne -ies ; « boy » fait « boys » car le y suit une voyelle.'],
            ['Quelle phrase est correcte ?', ['I need some advice.', 'I need an advice.', 'I need some advices.', 'I need two advices.'], 0, '« Advice » est indénombrable : on dit « a piece of advice ».'],
            ['Comment compte-t-on un nom indénombrable ?', ['En employant un partitif, comme « a piece of »', 'En ajoutant -s', 'En le faisant précéder de « a »', 'C’est impossible'], 0, 'A glass of water, a piece of furniture.'],
            ['Quel verbe accompagne « the news » ?', ['is', 'are', 'were', 'have'], 0, 'Malgré le -s final, « news » est indénombrable et singulier.'],
            ['Quel est le pluriel de « knife » ?', ['knives', 'knifes', 'knifs', 'knifves'], 0, 'Les noms en -f ou -fe font souvent leur pluriel en -ves.'],
            ['Comment exprime-t-on la possession avec un nom animé ?', ['Avec ’s : my sister’s phone', 'Avec « of » uniquement', 'En inversant les deux noms sans marque', 'Avec « to » devant le possesseur'], 0, 'Au pluriel en -s, on met l’apostrophe seule : the students’ books.'],
            ['« Furniture » peut se mettre au pluriel en anglais.', ['Vrai', 'Faux'], 1, 'C’est un indénombrable : on dit « two pieces of furniture ».'],
          ],
        },
        {
          titre: 'Les articles définis et les articles indéfinis',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'A, an, the — et l’article zéro',
            cours: `L'anglais dispose de trois possibilités devant un nom : a/an, the, ou rien du tout.

## L'article indéfini a / an
| Sa condition | Son emploi |
| **Singulier dénombrable** seulement | Un élément **non identifié** |
| **a** | Devant un **son** de consonne : a book, a university |
| **an** | Devant un **son** de voyelle : an apple, an hour |

> C'est le **son**, jamais la lettre, qui décide entre a et an.

| L'emploi particulier | Son exemple |
| Le **métier** | *She is a dentist* |
| La **fréquence** | *twice a week* |

## L'article défini the
| Son emploi | Un exemple |
| Ce qui est **déjà mentionné** | *I bought a car. The car is red.* |
| Les objets **uniques** | **the** sun, **the** moon |
| Les **superlatifs** | **the** best |
| Fleuves, océans, chaînes, pays au pluriel | the Thames, the Atlantic, the Alps, the Netherlands |

## L'article zéro
| Le cas | Un exemple |
| Un **pluriel** ou un **indénombrable** au sens général | *I like dogs* ; *Water is essential* |
| Les **noms propres**, pays, villes, langues | France, Paris, English |
| Les **repas**, les **matières**, les **saisons** | *for breakfast*, *at school*, *in winter* |

## Les pièges du français
| L'anglais dit | Et non |
| *I play the piano* | Un instrument prend **the** |
| *I play – football* | Un sport n'en prend **pas** |
| *she goes to – school* | Pour **étudier** |
| *she goes to the school* | Le **bâtiment** précis |`,
          },
          questions: [
            ['Quand emploie-t-on « an » plutôt que « a » ?', ['Devant un son de voyelle', 'Devant la lettre A, E, I, O ou U', 'Devant un nom pluriel', 'Devant un nom propre'], 0, '« An hour » (h muet) mais « a university » (son « you »).'],
            ['Quelle phrase est correcte ?', ['She is a dentist.', 'She is dentist.', 'She is the dentist by profession.', 'She is an dentist.'], 0, 'Le métier prend l’article indéfini en anglais.'],
            ['Comment traduit-on « J’aime les chiens » ?', ['I like dogs.', 'I like the dogs.', 'I like a dogs.', 'I like some the dogs.'], 0, 'Un pluriel au sens général ne prend aucun article.'],
            ['Quelle phrase est correcte ?', ['I play the piano and I play football.', 'I play piano and I play the football.', 'I play the piano and I play the football.', 'I play piano and I play football.'], 0, 'Instrument de musique avec « the », sport sans article.'],
            ['Devant quel type de nom géographique emploie-t-on « the » ?', ['Les fleuves, océans et chaînes de montagnes', 'Les villes', 'Les pays au singulier', 'Les continents'], 0, 'The Thames, the Atlantic, the Alps, the Netherlands.'],
            ['Comment traduit-on « deux fois par semaine » ?', ['twice a week', 'twice the week', 'twice week', 'two times the week'], 0, 'L’article indéfini exprime la fréquence.'],
            ['Quelle différence y a-t-il entre « go to school » et « go to the school » ?', ['Le premier désigne l’activité d’étudier, le second le bâtiment précis', 'Le premier est familier, le second soutenu', 'Les deux sont identiques', 'Le second est incorrect'], 0, 'Même distinction pour « hospital » ou « church ».'],
            ['C’est la première lettre du mot qui décide entre « a » et « an ».', ['Vrai', 'Faux'], 1, 'C’est le son : « an hour » commence par un h muet, « a university » par un son « you ».'],
          ],
        },
        {
          titre: 'Les adjectifs démonstratifs',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'This, that, these, those',
            cours: `Les démonstratifs désignent : ils montrent de quel élément on parle. L’anglais en compte **quatre**, croisant le **nombre** et la **distance**.

|  | Proche | Éloigné |
|---|---|---|
| **Singulier** | **this** | **that** |
| **Pluriel** | **these** | **those** |

- ***This** book is interesting.* (le livre que je tiens)
- ***That** house over there is old.* (là-bas)
- ***These** shoes are new.*
- ***Those** were the days.*

## La distance peut être dans le temps
- **this** pour le présent ou le futur proche : *this morning*, *this week* ;
- **that** pour le passé ou ce qui s’éloigne : *that summer*, *that was strange*.

## Adjectif ou pronom
- **Adjectif** : suivi d’un nom — *this car*.
- **Pronom** : employé seul — *This is my car.* / *I prefer these.*

## Deux pièges de prononciation et d’orthographe
- **this** [ɪ] court contre **these** [iː] long : c’est la seule différence audible entre le singulier et le pluriel.
- **those** ne s’écrit jamais « thoses » : les démonstratifs ne prennent pas de -s supplémentaire, ils sont déjà au pluriel.

## Au téléphone et en présentation
L’anglais emploie les démonstratifs là où le français dirait autre chose :
- *Hello, **this** is Paul speaking.* (« c’est Paul »)
- ***This** is my sister, Kate.* (pour présenter quelqu’un)

> Le démonstratif s’accorde toujours en nombre avec le nom qui suit : *this child*, *these children*.`,
          },
          questions: [
            ['Quel démonstratif emploie-t-on pour un objet proche au pluriel ?', ['these', 'this', 'those', 'that'], 0, '« These shoes are new. »'],
            ['Quel démonstratif emploie-t-on pour un objet éloigné au singulier ?', ['that', 'this', 'these', 'those'], 0, '« That house over there is old. »'],
            ['Quelle phrase est correcte ?', ['These children are noisy.', 'This children are noisy.', 'Thoses children are noisy.', 'That children are noisy.'], 0, 'Le démonstratif s’accorde en nombre avec le nom.'],
            ['Quel démonstratif emploie-t-on pour parler de ce matin ?', ['this morning', 'that morning', 'these morning', 'those morning'], 0, '« This » vaut aussi pour la proximité dans le temps.'],
            ['Comment se présente-t-on au téléphone en anglais ?', ['This is Paul speaking.', 'It is Paul speaking.', 'That is Paul speaking.', 'Here Paul speaking.'], 0, 'L’anglais emploie le démonstratif là où le français dit « c’est ».'],
            ['Quelle est la différence entre un démonstratif adjectif et pronom ?', ['L’adjectif est suivi d’un nom, le pronom s’emploie seul', 'L’adjectif est toujours au pluriel', 'Le pronom se place après le verbe', 'Il n’y a aucune différence'], 0, '« This car » contre « This is my car ».'],
            ['Quel démonstratif emploie-t-on pour un souvenir lointain au pluriel ?', ['those', 'these', 'that', 'this'], 0, '« Those were the days. »'],
            ['« Those » peut s’écrire « thoses » au pluriel.', ['Vrai', 'Faux'], 1, 'Il est déjà pluriel : les démonstratifs ne prennent jamais de -s supplémentaire.'],
          ],
        },
        {
          titre: 'Exprimer la possession',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Le génitif, les adjectifs et les pronoms possessifs',
            cours: `L’anglais dispose de **trois** moyens pour dire à qui appartient quelque chose.

## 1. Le génitif ’s
On l’emploie surtout avec des **êtres animés** — personnes, animaux — et des expressions de temps.
- singulier : *my brother**’s** bike* ;
- pluriel en -s : apostrophe seule, *the girl**s’** room* ;
- pluriel irrégulier : *the childre**n’s** toys* ;
- temps : *today**’s** newspaper*, *a week**’s** holiday*.

> L’ordre est **inverse du français** : possesseur + ’s + objet possédé. « La voiture de mon père » devient *my father’s car*.

## 2. La structure avec of
Pour les **objets** et les notions abstraites : *the roof **of** the house*, *the end **of** the film*.

## 3. Les adjectifs et pronoms possessifs

| Sujet | Adjectif | Pronom |
|---|---|---|
| I | **my** | **mine** |
| you | **your** | **yours** |
| he | **his** | **his** |
| she | **her** | **hers** |
| it | **its** | — |
| we | **our** | **ours** |
| they | **their** | **theirs** |

- L’**adjectif** précède le nom : *my book*.
- Le **pronom** remplace le groupe entier : *This book is **mine***.

## Trois pièges à retenir
- Le possessif s’accorde avec le **possesseur**, pas avec l’objet : *Kate and **her** brother*, *Paul and **his** sister*.
- **its** (possessif) n’a pas d’apostrophe ; **it’s** est la contraction de « it is ».
- Un pronom possessif ne se fait **jamais** suivre d’un nom : on dit *mine*, jamais « mine book ».

## Whose
La question du possesseur se pose avec **whose** : *Whose bag is this? — It’s Kate’s.*`,
          },
          questions: [
            ['Comment traduit-on « la voiture de mon père » ?', ['my father’s car', 'the car of my father', 'my father car', 'the father’s my car'], 0, 'L’ordre est inverse du français : possesseur + ’s + objet.'],
            ['Comment écrit-on « la chambre des filles » ?', ['the girls’ room', 'the girl’s room', 'the girls’s room', 'the room of girls'], 0, 'Pluriel déjà en -s : l’apostrophe seule suffit.'],
            ['Comment écrit-on « les jouets des enfants » ?', ['the children’s toys', 'the childrens’ toys', 'the children toys', 'the toys of children'], 0, 'Pluriel irrégulier : on ajoute ’s normalement.'],
            ['Quel possessif emploie-t-on avec un objet inanimé ?', ['La structure avec « of » : the roof of the house', 'Toujours ’s', 'Toujours « its »', 'Aucun possessif n’est possible'], 0, 'Le génitif ’s est réservé surtout aux êtres animés et au temps.'],
            ['Quelle phrase est correcte ?', ['This book is mine.', 'This book is my.', 'This is mine book.', 'This book is my one.'], 0, 'Le pronom possessif n’est jamais suivi d’un nom.'],
            ['Avec quoi le possessif s’accorde-t-il en anglais ?', ['Avec le possesseur', 'Avec l’objet possédé', 'Avec le verbe', 'Avec le sujet de la phrase'], 0, '« Paul and his sister », « Kate and her brother ».'],
            ['Quelle est la différence entre « its » et « it’s » ?', ['« its » est le possessif, « it’s » la contraction de « it is »', '« its » est la contraction de « it is »', 'Les deux sont interchangeables', '« it’s » est le possessif au pluriel'], 0, 'L’apostrophe marque la contraction, jamais le possessif de « it ».'],
            ['On dit « the car of my father » pour traduire « la voiture de mon père ».', ['Vrai', 'Faux'], 1, 'Avec un être animé, l’anglais emploie le génitif : « my father’s car ».'],
          ],
        },
        {
          titre: 'Exprimer une quantité',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Some, any, much, many, a few, a little',
            cours: `Le choix du quantifieur dépend de deux questions : le nom est-il dénombrable, et la phrase est-elle affirmative ?

## Some et any
| Le mot | Son emploi | Un exemple |
| **some** | Phrases **affirmatives** | *I have some money* |
| **some** | Offres et demandes **polies** | *Would you like some tea?* |
| **any** | **Négatives** et **interrogatives** | *I don't have any money* |
| **any** | En affirmative : « n'importe quel » | *Take any book you like* |

## Much et many
| Le mot | Son nom | Un exemple |
| **much** | **Indénombrable** | *How much water?* |
| **many** | **Dénombrable pluriel** | *How many books?* |
| **a lot of / lots of** | Les **deux**, surtout à l'affirmative | *I have a lot of work / friends* |

## A few et a little
| Le mot | Son nom | Son sens |
| **a few** | Dénombrable | Quelques, **assez** |
| **a little** | Indénombrable | Un peu, assez |
| **few** (sans a) | Dénombrable | **Peu** : trop peu |
| **little** (sans a) | Indénombrable | Peu : trop peu |

> C'est l'un des rares cas où l'article change le sens : *a few* **rassure**, *few* **inquiète**.

## Les autres quantifieurs
| Le mot | Son sens | Un exemple |
| **no** | Pas de — équivaut à *not any* | *There is no milk* |
| **enough** | Assez — après un adjectif | *enough money*, *fast enough* |
| **too much / too many** | Trop | Selon le nom |
| **both**, **all** | Les deux, tous | — |
| **every** + singulier, **each** | Chaque, chacun | — |

## Le tableau de décision
| Le nom | Ses quantifieurs |
| **Dénombrable** | many, a few, few, a lot of |
| **Indénombrable** | much, a little, little, a lot of |`,
          },
          questions: [
            ['Quel quantifieur emploie-t-on dans une phrase négative ?', ['any', 'some', 'much of', 'a few'], 0, '« I don’t have any money. »'],
            ['Quel quantifieur emploie-t-on avec un nom indénombrable dans une question ?', ['much', 'many', 'a few', 'several'], 0, '« How much water? » contre « How many books? »'],
            ['Que signifie « a few friends » ?', ['Quelques amis, un nombre suffisant', 'Trop peu d’amis', 'Aucun ami', 'Beaucoup d’amis'], 0, 'Sans l’article, « few friends » a un sens négatif.'],
            ['Quel quantifieur emploie-t-on avec un indénombrable pour dire « un peu de » ?', ['a little', 'a few', 'many', 'several'], 0, '« A little time », « a few minutes ».'],
            ['Quelle phrase propose poliment quelque chose ?', ['Would you like some tea?', 'Would you like any tea?', 'Do you like some tea?', 'Would you like much tea?'], 0, '« Some » s’emploie dans les offres et demandes polies.'],
            ['Que signifie « any » dans une phrase affirmative ?', ['N’importe quel', 'Aucun', 'Beaucoup de', 'Quelques'], 0, '« Take any book you like. »'],
            ['Quel quantifieur remplace « much » et « many » à l’affirmative ?', ['a lot of', 'any', 'no', 'each'], 0, 'Il fonctionne avec les dénombrables comme avec les indénombrables.'],
            ['« Few » et « a few » ont exactement le même sens.', ['Vrai', 'Faux'], 1, '« A few » signifie « quelques, assez » ; « few » signifie « trop peu ».'],
          ],
        },
        {
          titre: 'Les adjectifs qualificatifs',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Invariables, avant le nom, et dans le bon ordre',
            cours: `Trois règles de base, et deux pièges.

## Les trois règles
| La règle | Son contenu | Un exemple |
| **Invariable** | Ni genre, ni nombre | *a red car*, *two red cars* |
| **Avant** le nom | L'inverse du français | *a beautiful house* |
| Après un verbe d'état | be, seem, look, feel, become, get | *She looks tired* |

## L'ordre des adjectifs
opinion → taille → âge → forme → couleur → origine → matière → but

*a lovely little old round black French wooden table*

> On ne dépasse guère **trois** adjectifs dans la vraie langue.

## Les adjectifs en -ed et en -ing
| La terminaison | Ce qu'elle décrit | Un exemple |
| **-ed** | Ce que **ressent** la personne | *I am bored* — je m'ennuie |
| **-ing** | Ce qui **provoque** ce sentiment | *The film is boring* |

| Le couple | Son emploi |
| interested / interesting | Intéressé / intéressant |
| tired / tiring | Fatigué / fatigant |
| surprised / surprising | Surpris / surprenant |
| frightened / frightening | Effrayé / effrayant |

> *I am boring* ne veut pas dire « je m'ennuie » mais « je suis ennuyeux ». L'erreur est classique — et gênante.

## Les adjectifs composés
| La règle | Un exemple |
| Un **trait d'union**, et le nom au **singulier** | *a five-year-old boy*, *a two-hour film* |

## Les adjectifs substantivés
Précédés de **the**, certains adjectifs désignent un groupe entier, avec un verbe au **pluriel**.

*the rich*, *the poor*, *the young*, *the homeless*`,
          },
          questions: [
            ['Où se place l’adjectif en anglais ?', ['Avant le nom', 'Après le nom', 'À la fin de la phrase', 'Cela dépend de son sens'], 0, '« A beautiful house », l’inverse du français.'],
            ['Comment l’adjectif anglais s’accorde-t-il ?', ['Il est invariable', 'Il s’accorde en nombre', 'Il s’accorde en genre', 'Il s’accorde en genre et en nombre'], 0, '« Two red cars », sans -s à l’adjectif.'],
            ['Que signifie « I am bored » ?', ['Je m’ennuie', 'Je suis ennuyeux', 'J’ennuie les autres', 'Je suis fatigant'], 0, 'La forme en -ed décrit ce que ressent la personne.'],
            ['Comment dit-on « le film est ennuyeux » ?', ['The film is boring.', 'The film is bored.', 'The film is boredom.', 'The film is bore.'], 0, 'La forme en -ing décrit ce qui provoque le sentiment.'],
            ['Quel est l’ordre correct des adjectifs ?', ['a small old black car', 'a black old small car', 'an old black small car', 'a black small old car'], 0, 'Taille, puis âge, puis couleur.'],
            ['Comment écrit-on « un garçon de cinq ans » ?', ['a five-year-old boy', 'a five-years-old boy', 'a five year old boy', 'a boy of five years old'], 0, 'Adjectif composé : traits d’union et nom au singulier.'],
            ['Après quels verbes l’adjectif peut-il se placer ?', ['Après be, seem, look, feel, become', 'Après tous les verbes', 'Après les verbes d’action uniquement', 'Jamais après un verbe'], 0, 'Ce sont les verbes d’état : « She looks tired. »'],
            ['« The poor » se construit avec un verbe au singulier.', ['Vrai', 'Faux'], 1, 'Un adjectif substantivé désigne un groupe : le verbe se met au pluriel.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 : Le groupe verbal
        // ===================================================================
        {
          titre: 'Les verbes lexicaux et les auxiliaires',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Deux familles de verbes, deux rôles',
            cours: `Tous les verbes anglais ne jouent pas le même rôle dans la phrase.

## Deux familles
| La famille | Ce qu'elle porte | Ses exemples |
| Les verbes **lexicaux** | Un **sens** | work, eat, run, think, believe |
| Les **auxiliaires** | La **construction** de la phrase | be, have, do, et les modaux |

> Seuls, les verbes lexicaux ne savent former ni question ni négation : il leur faut un auxiliaire.

## Les quatre familles d'auxiliaires
| L'auxiliaire | Ce qu'il forme | Un exemple |
| **be** | Les temps en **-ING** et le **passif** | *She is working*, *It was built* |
| **have** | Les temps **composés** | *I have finished* |
| **do** | Négation, interrogation, insistance aux **temps simples** | *I don't know*, *Do you know?* |
| Les **modaux** | can, must, should, may, will — invariables | *You can go* |

## Les trois pouvoirs de l'auxiliaire
| Le pouvoir | Son mécanisme | Un exemple |
| La **question** | Il passe **devant** le sujet | *Are you ready?* / *Have you finished?* |
| La **négation** | **not** se place **après** lui | isn't, hasn't, doesn't, can't |
| La **reprise courte** | Il évite de répéter le verbe | *Yes, I do* ; *No, she isn't* |

> C'est la clé de toute la grammaire anglaise : **repérer l'auxiliaire**, et le reste se construit tout seul.

## Be et have peuvent être lexicaux
| La phrase | Le statut du verbe | La question correspondante |
| *I am French* | **be** lexical, mais il garde ses pouvoirs | *Am I French?* |
| *I have a car* | **have** lexical : il faut **do** | *Do you have a car?* |`,
          },
          questions: [
            ['À quoi servent les auxiliaires ?', ['À construire la question, la négation et la reprise courte', 'À donner le sens principal du verbe', 'À accorder le verbe avec le sujet', 'À former le pluriel'], 0, 'Les verbes lexicaux, eux, portent le sens.'],
            ['Quel auxiliaire forme les temps en -ING et la voix passive ?', ['be', 'have', 'do', 'will'], 0, '« She is working », « It was built ».'],
            ['Quel auxiliaire forme les temps composés ?', ['have', 'be', 'do', 'can'], 0, '« I have finished. »'],
            ['À quoi sert l’auxiliaire « do » ?', ['À la négation, à l’interrogation et à l’insistance aux temps simples', 'À former le passif', 'À former le present perfect', 'À exprimer la capacité'], 0, '« I don’t know », « Do you know? »'],
            ['Où se place l’auxiliaire dans une question ?', ['Devant le sujet', 'Après le verbe', 'À la fin de la phrase', 'Il disparaît'], 0, '« Are you ready? », « Have you finished? »'],
            ['Où se place « not » dans une négation ?', ['Juste après l’auxiliaire', 'Avant l’auxiliaire', 'Après le verbe lexical', 'À la fin de la phrase'], 0, 'isn’t, hasn’t, doesn’t, can’t.'],
            ['Comment répond-on brièvement à « Do you like tea? » ?', ['Yes, I do.', 'Yes, I like.', 'Yes, I am.', 'Yes, I have.'], 0, 'La reprise courte réutilise l’auxiliaire de la question.'],
            ['« Have » au sens de posséder se construit sans auxiliaire dans une question.', ['Vrai', 'Faux'], 1, 'Il est alors lexical et demande « do » : « Do you have a car? »'],
          ],
        },
        {
          titre: 'Les auxiliaires BE et HAVE',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Les deux piliers de la conjugaison anglaise',
            cours: `Les deux piliers de la conjugaison anglaise.

## BE : la conjugaison
| Le temps | Les formes |
| **Présent** | I **am** ; he/she/it **is** ; you/we/they **are** |
| **Prétérit** | I/he/she/it **was** ; you/we/they **were** |
| **Participe passé** | **been** |

## BE : les emplois
| L'emploi | Un exemple |
| Verbe d'**état** | *She is a teacher* |
| Auxiliaire des formes en **-ING** | *He is reading* |
| Auxiliaire du **passif** | *The window was broken* |
| Là où le français dit « avoir » | *I am 15*, *I am cold / hungry / thirsty / right / afraid* |

> « J'ai 15 ans » se dit *I am 15*, jamais *I have 15*. C'est l'erreur la plus fréquente du collège.

## HAVE : la conjugaison
| Le temps | Les formes |
| **Présent** | I/you/we/they **have** ; he/she/it **has** |
| **Prétérit** | **had**, pour toutes les personnes |
| **Participe passé** | **had** |

## HAVE : les emplois
| L'emploi | Son exemple | Sa question |
| **Lexical** : posséder | *I have a bike* | *Do you have…?* |
| Auxiliaire des temps **composés** | *I have seen this film* | *Have you seen…?* |
| **have got** : posséder, britannique | *I have got a bike* | *Have you got…?* — **sans** do |
| Dans des expressions d'**action** | *have breakfast, have a shower, have a good time* | Avec **do** |

## Les contractions
| La contraction | Ce qu'elle vaut |
| I'm, he's, we're | be |
| I've, we've | have |
| we'd | we **had** ou we **would** |
| **he's** | he **is** ou he **has** |

> C'est ce qui **suit** qui tranche : *he's tired* (is) contre *he's finished* (has).`,
          },
          questions: [
            ['Comment dit-on « J’ai 15 ans » ?', ['I am 15.', 'I have 15.', 'I have 15 years.', 'I am 15 years.'], 0, 'L’anglais emploie « be » là où le français emploie « avoir ».'],
            ['Quelle est la forme de « be » au prétérit avec « they » ?', ['were', 'was', 'been', 'are'], 0, 'I, he, she, it prennent « was ».'],
            ['Quel est le participe passé de « be » ?', ['been', 'was', 'being', 'be'], 0, '« I have been to London. »'],
            ['Quelle est la forme de « have » à la troisième personne du singulier au présent ?', ['has', 'have', 'haves', 'had'], 0, '« She has a bike. »'],
            ['Comment interroge-t-on avec « have got » ?', ['Have you got a bike?', 'Do you have got a bike?', 'Do you got a bike?', 'Are you got a bike?'], 0, '« Have got » se passe de « do » : l’auxiliaire est déjà là.'],
            ['Quel auxiliaire forme la voix passive ?', ['be', 'have', 'do', 'will'], 0, '« The window was broken. »'],
            ['Que peut signifier la contraction « he’s » ?', ['« he is » ou « he has »', '« he is » uniquement', '« he has » uniquement', '« he was »'], 0, 'C’est ce qui suit qui tranche : « he’s tired » ou « he’s finished ».'],
            ['« Have » est toujours un auxiliaire.', ['Vrai', 'Faux'], 1, 'Il est lexical dans « I have a bike » ou « have breakfast ».'],
          ],
        },
        {
          titre: 'L’auxiliaire DO',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'L’auxiliaire qui n’apparaît que quand il le faut',
            cours: `DO est l'auxiliaire des temps simples — présent simple et prétérit simple. Il n'apparaît que dans trois situations.

## Les trois emplois
| L'emploi | Sa forme | Un exemple |
| La **négation** | don't / doesn't / didn't | *I don't like coffee* |
| L'**interrogation** | Do / Does / Did | *Does she work here?* |
| L'**insistance** | do / does / did accentué | *I do like it!* |

| Le temps | Les formes |
| **Présent** | **don't** (I, you, we, they) / **doesn't** (he, she, it) |
| **Prétérit** | **didn't**, pour toutes les personnes |

## La règle d'or : une seule marque de temps
Dès que **do** apparaît, il prend la marque du temps et de la personne. Le verbe lexical revient à la **base verbale**.

| La forme correcte | La forme fautive |
| *She doesn't work* | doesn't works |
| *He didn't go* | didn't went |
| *Did you go?* | did you went |

> C'est l'erreur numéro un du collège : doubler la marque du temps. Une phrase n'en porte **qu'une seule**.

## Quand DO n'apparaît pas
| Le cas | Un exemple |
| Avec **be** | *Is she a teacher?* / *She isn't tired* |
| Avec un **modal** | *Can you swim?* / *You mustn't shout* |
| Avec **have** auxiliaire ou **have got** | *Have you finished?* |
| Quand **who / what** est le **sujet** | *Who broke the window?* |

## DO peut aussi être lexical
*I do my homework.*

> Il faut alors un **second** do pour interroger : *What do you do?*`,
          },
          questions: [
            ['Dans quels cas l’auxiliaire DO apparaît-il ?', ['À la négation, à l’interrogation et à l’insistance', 'Dans toutes les phrases', 'Seulement au passé', 'Seulement avec les modaux'], 0, 'Aux temps simples uniquement.'],
            ['Quelle phrase est correcte ?', ['She doesn’t work here.', 'She doesn’t works here.', 'She don’t works here.', 'She not work here.'], 0, 'DO porte la marque de la personne, le verbe revient à la base verbale.'],
            ['Comment met-on « He went » à la forme négative ?', ['He didn’t go.', 'He didn’t went.', 'He not went.', 'He doesn’t went.'], 0, 'Une phrase ne porte qu’une seule marque de temps.'],
            ['Quelle question est correcte ?', ['Did you go to school?', 'Did you went to school?', 'Do you went to school?', 'You did go to school?'], 0, 'DID porte le passé, le verbe reste à la base verbale.'],
            ['Avec quel verbe l’auxiliaire DO n’apparaît-il jamais ?', ['be', 'work', 'go', 'like'], 0, '« Be » est son propre auxiliaire : « Is she a teacher? »'],
            ['Que signifie « I do like it » ?', ['J’aime vraiment ça : c’est une insistance', 'Je fais ce que j’aime', 'Je n’aime pas ça', 'C’est une question'], 0, 'La forme emphatique s’accentue à l’oral.'],
            ['Quand « who » est sujet de la question, emploie-t-on DO ?', ['Non : « Who broke the window? »', 'Oui, toujours', 'Oui, seulement au passé', 'Oui, seulement au présent'], 0, 'Le sujet étant déjà en tête, l’ordre n’a pas à être inversé.'],
            ['On peut écrire « Did you went? » au passé.', ['Vrai', 'Faux'], 1, 'DID porte déjà le passé : le verbe reste à la base verbale.'],
          ],
        },
        {
          titre: 'Expression de la modalité : l’obligation',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Must, have to, mustn’t, needn’t',
            cours: `Deux façons d'imposer, qui ne viennent pas du même endroit.

## Must ou have to
| Le point | **MUST** | **HAVE TO** |
| D'où vient l'obligation | De **celui qui parle** : conviction personnelle | De l'**extérieur** : règlement, circonstances |
| Sa conjugaison | **Invariable** : pas de -s, pas de « to » | *he has to*, *I had to*, *I will have to* |
| Sa question et sa négation | Directes | Avec **do** : *Do you have to go?* |
| Son passé | Il n'en a pas : on prend **had to** | *had to* |

> *I must stop smoking* (je l'ai décidé) contre *I have to stop smoking* (le médecin me l'a dit).

## Les négations, qui ne se ressemblent pas
| La forme | Son sens | Un exemple |
| **mustn't** | **Interdiction** | *You mustn't smoke here* — c'est interdit |
| **don't have to** | **Absence d'obligation** | *You don't have to come* — ce n'est pas obligatoire |
| **needn't** | Même sens que *don't have to* | *You needn't worry* |

> C'est la distinction la plus piégeuse du chapitre : la négation de *must* n'est **pas** *don't have to*.

## Should, l'obligation faible
| Le modal | Son sens |
| **should** | Le **conseil**, pas l'obligation : *You should see a doctor* |

## Au passé
| Ce qu'on exprime | La forme |
| L'**obligation** | **had to** — *I had to stay home* |
| L'**interdiction** | **couldn't**, ou *wasn't allowed to* |`,
          },
          questions: [
            ['D’où vient l’obligation exprimée par « must » ?', ['De celui qui parle', 'Du règlement extérieur', 'D’une loi écrite', 'De personne'], 0, '« Have to » exprime, lui, une contrainte extérieure.'],
            ['Que signifie « You mustn’t smoke here » ?', ['Il est interdit de fumer ici', 'Tu n’es pas obligé de fumer', 'Tu peux fumer si tu veux', 'Tu devrais fumer dehors'], 0, '« Mustn’t » exprime l’interdiction.'],
            ['Que signifie « You don’t have to come » ?', ['Tu n’es pas obligé de venir', 'Il t’est interdit de venir', 'Tu dois venir', 'Tu devrais venir'], 0, 'Absence d’obligation, pas interdiction.'],
            ['Comment exprime-t-on l’obligation au passé ?', ['had to', 'musted', 'must have', 'was must'], 0, '« Must » n’a pas de forme passée.'],
            ['Quelle phrase est correcte ?', ['She must go now.', 'She musts go now.', 'She must to go now.', 'She must going now.'], 0, 'Un modal est invariable et se construit sans « to ».'],
            ['Comment interroge-t-on avec « have to » ?', ['Do you have to go?', 'Have you to go?', 'Do you must go?', 'Are you have to go?'], 0, '« Have to » se comporte comme un verbe lexical : il demande « do ».'],
            ['Quel modal exprime le conseil plutôt que l’obligation ?', ['should', 'must', 'have to', 'need to'], 0, '« You should see a doctor. »'],
            ['« Mustn’t » et « don’t have to » ont le même sens.', ['Vrai', 'Faux'], 1, 'Le premier interdit, le second dispense : c’est le piège du chapitre.'],
          ],
        },
        {
          titre: 'Expression de la modalité : la capacité',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Can, could, be able to',
            cours: `## CAN
**can** exprime la **capacité** au présent — savoir faire, être en mesure de.
*I **can** swim.* / *She **can** speak three languages.*

- **invariable** : jamais de -s, jamais de « to » derrière ;
- négation : **can’t** (ou *cannot*, en un seul mot) ;
- question : **Can** you swim?

Il exprime aussi la **perception** avec les verbes see, hear, feel, smell, taste : *I **can** see the sea from here* — que le français traduit sans « pouvoir » : « je vois la mer ».

## COULD
- **capacité passée générale** : *I **could** swim when I was five.*
- **politesse** au présent : ***Could** you help me, please?* — plus poli que *can*.

> Pour une **réussite ponctuelle** au passé, on n’emploie pas *could* mais **was/were able to** ou **managed to** : *He **was able to** open the door* (il y est parvenu, cette fois-là).

## BE ABLE TO
C’est la forme de remplacement, qui se conjugue à tous les temps là où *can* ne le peut pas :
- futur : *I **will be able to** drive next year.*
- present perfect : *I **have been able to** finish.*
- après un autre modal : *You might **be able to** come.*

## Le tableau de décision
| Situation | Forme |
|---|---|
| Capacité présente | can |
| Capacité passée générale | could |
| Réussite ponctuelle passée | was/were able to |
| Capacité future | will be able to |
| Demande polie | could / would you mind |`,
          },
          questions: [
            ['Quel modal exprime la capacité au présent ?', ['can', 'must', 'should', 'may'], 0, '« I can swim. »'],
            ['Quelle phrase est correcte ?', ['She can speak three languages.', 'She cans speak three languages.', 'She can to speak three languages.', 'She can speaking three languages.'], 0, 'Un modal est invariable et se construit sans « to ».'],
            ['Comment exprime-t-on une capacité passée générale ?', ['could', 'can', 'was can', 'could to'], 0, '« I could swim when I was five. »'],
            ['Comment exprime-t-on une réussite ponctuelle au passé ?', ['was/were able to', 'could', 'can', 'must have'], 0, '« He was able to open the door » : il y est parvenu cette fois-là.'],
            ['Comment exprime-t-on une capacité future ?', ['will be able to', 'will can', 'can will', 'shall can'], 0, 'Deux modaux ne peuvent jamais se suivre.'],
            ['Comment traduit-on « Je vois la mer d’ici » ?', ['I can see the sea from here.', 'I see the sea from here, can.', 'I am seeing the sea from here.', 'I could see the sea from here.'], 0, 'Avec les verbes de perception, « can » ne se traduit pas en français.'],
            ['Quelle formule est la plus polie pour demander de l’aide ?', ['Could you help me, please?', 'Can you help me!', 'You must help me.', 'You help me?'], 0, '« Could » atténue la demande.'],
            ['On peut dire « I will can swim » pour exprimer une capacité future.', ['Vrai', 'Faux'], 1, 'Deux modaux ne se suivent jamais : « I will be able to swim ».'],
          ],
        },
        {
          titre: 'Expression de la modalité : la permission',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Can, may, be allowed to',
            cours: `Demander ou donner la permission se fait avec trois formes, graduées en **politesse**.

## CAN
Le plus courant, à l’oral et entre proches.
*You **can** use my phone.* / ***Can** I go out?*
- négation : **can’t** = interdiction — *You **can’t** park here.*

## MAY
Plus **formel** et plus poli, employé à l’écrit, avec un adulte ou dans un règlement.
***May** I come in?* / *Students **may** not use their phones in class.*

## COULD
Pour **demander** poliment — mais jamais pour **accorder** la permission.
- ***Could** I borrow your pen?* (demande, correcte)
- *You could go* ne signifie pas « tu as la permission » mais « tu pourrais » : c’est une suggestion.

## BE ALLOWED TO
La forme qui se conjugue à tous les temps, et qui insiste sur une **règle extérieure**.
*I **am allowed to** stay up late.* / *We **weren’t allowed to** leave.* / *You **will be allowed to** vote at 18.*

> Pour le **passé**, on n’emploie pas *could* dans le sens de la permission accordée une fois : on dit *I **was allowed to** go*.

## Refuser
- **can’t / cannot** : *You **can’t** do that.*
- **mustn’t** : plus fort, c’est une **interdiction** — *You **mustn’t** touch it.*
- **may not** : formel, dans les règlements écrits.

## Le tableau
| Registre | Demander | Accorder | Refuser |
|---|---|---|---|
| Familier | Can I…? | You can | You can’t |
| Poli | Could I…? | — | — |
| Formel | May I…? | You may | You may not |`,
          },
          questions: [
            ['Quel modal est le plus formel pour demander la permission ?', ['may', 'can', 'could', 'must'], 0, '« May I come in? » s’emploie à l’écrit ou avec un adulte.'],
            ['Quelle phrase demande poliment une permission ?', ['Could I borrow your pen?', 'You could borrow my pen.', 'I can borrow your pen.', 'Must I borrow your pen?'], 0, '« Could » sert à demander, jamais à accorder.'],
            ['Comment accorde-t-on une permission de façon familière ?', ['You can use my phone.', 'You could use my phone.', 'You may not use my phone.', 'You must use my phone.'], 0, '« Could » n’accorde pas : il suggérerait.'],
            ['Comment exprime-t-on une permission au passé ?', ['I was allowed to go.', 'I could to go.', 'I may went.', 'I can went.'], 0, '« Could » ne convient pas pour une permission accordée une fois.'],
            ['Que signifie « You mustn’t touch it » ?', ['C’est une interdiction stricte', 'Tu n’es pas obligé d’y toucher', 'Tu peux y toucher', 'Tu devrais y toucher'], 0, 'Plus fort que « you can’t ».'],
            ['Quelle forme se conjugue à tous les temps ?', ['be allowed to', 'may', 'can', 'could'], 0, '« I will be allowed to vote at 18. »'],
            ['Quelle formule apparaît dans un règlement écrit ?', ['Students may not use their phones.', 'Students can’t use their phones, ok?', 'Students could not use phones.', 'Students don’t use phones.'], 0, '« May not » appartient au registre formel.'],
            ['« Could » sert aussi bien à demander qu’à accorder une permission.', ['Vrai', 'Faux'], 1, 'Pour accorder, on emploie « can » ou « may ».'],
          ],
        },
        {
          titre: 'Expression de la modalité : donner un conseil',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Should, ought to, had better',
            cours: `Trois façons de conseiller, de la plus neutre à la plus pressante.

## Les trois formes
| La forme | Sa construction | Son degré |
| **should** | + base verbale, sans « to » | Le conseil ordinaire |
| **ought to** | + **to** + verbe | Même sens, plus **formel** et plus rare |
| **had better** | + base verbale, **sans** « to » | Un conseil **pressant**, avec menace implicite |

## SHOULD
| L'emploi | Un exemple |
| Le conseil | *You should revise for the test* |
| La négation | *You shouldn't eat so late* |
| La question | *Should I call her?* |
| Ce qui est **normal** ou attendu | *The train should arrive at six* |

Il est **invariable** : pas de -s, pas de « to ».

## HAD BETTER
| Le point | Son contenu |
| Sa construction | had better + **base verbale**, malgré le « had » |
| Sa négation | *You'd better not be late* |
| Sa conjugaison | **Aucune** : expression figée, pour le présent et le futur |

*You'd better hurry (or you'll miss the bus).*

> Trois degrés à distinguer : *You should rest* (conseil), *You'd better rest* (pressant), *You must rest* (obligation).

## Le conseil au passé, avec un regret
**should have + participe passé** exprime ce qu'on aurait dû faire — et qu'on n'a pas fait.

| La phrase | Ce qu'elle signifie |
| *You should have told me* | Tu aurais dû me le dire |
| *I shouldn't have said that* | Je n'aurais pas dû |

## Autres formulations
| La tournure | Un exemple |
| *Why don't you…?* | *Why don't you call her?* |
| *If I were you, I would…* | *If I were you, I'd apologise* |`,
          },
          questions: [
            ['Quel modal exprime le conseil de base ?', ['should', 'must', 'can', 'may'], 0, '« You should revise for the test. »'],
            ['Quelle phrase est correcte ?', ['You should revise tonight.', 'You should to revise tonight.', 'You shoulds revise tonight.', 'You should revising tonight.'], 0, 'Un modal est suivi de la base verbale sans « to ».'],
            ['Quel modal du conseil se construit avec « to » ?', ['ought to', 'should', 'must', 'had better'], 0, 'C’est le seul modal suivi de « to ».'],
            ['Que signifie « You’d better hurry » ?', ['Tu ferais mieux de te dépêcher, sinon…', 'Tu pourrais te dépêcher', 'Tu es obligé de te dépêcher', 'Tu as bien fait de te dépêcher'], 0, 'Un conseil pressant, avec une conséquence implicite.'],
            ['Comment se construit « had better » ?', ['had better + base verbale', 'had better + to + verbe', 'had better + verbe en -ing', 'had better + participe passé'], 0, 'Malgré le « had », il n’y a ni « to » ni passé.'],
            ['Comment dit-on « Tu aurais dû me le dire » ?', ['You should have told me.', 'You should tell me.', 'You had better tell me.', 'You must have told me.'], 0, '« Should have + participe passé » exprime le reproche ou le regret.'],
            ['Quelle formule propose un conseil sous forme de question ?', ['Why don’t you call her?', 'You must call her.', 'You’d better call her.', 'You ought to call her.'], 0, 'Elle adoucit le conseil en suggestion.'],
            ['« Had better » se conjugue au passé comme au présent.', ['Vrai', 'Faux'], 1, 'C’est une expression figée qui vaut pour le présent et le futur.'],
          ],
        },
        {
          titre: 'Expression de la modalité : la suggestion',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Let’s, shall we, how about, why don’t we',
            cours: `Suggérer, c'est proposer de faire quelque chose ensemble, ou inviter l'autre à agir.

## Les formes et leurs constructions
| La forme | Ce qui suit | Un exemple |
| **Let's** | La **base verbale** | *Let's go to the cinema* |
| **Let's not** | La base verbale | *Let's not waste time* |
| **Shall I / Shall we** | La base verbale | *Shall we start?* |
| **How about / What about** | Un **nom** ou un verbe en **-ING** | *What about going out tonight?* |
| **Why don't we** | La **base verbale** | *Why don't we meet at six?* |
| **Why not** | La base verbale | *Why not try again?* |

> Attention à la construction : *How about going?* avec -ING, mais *Why don't we go?* et *Let's go!* avec la base verbale. C'est la faute la plus fréquente du chapitre.

**Shall we** s'ajoute aussi en tag : *Let's go, shall we?*

## Accepter ou refuser
| La réponse | Ses formules |
| **Accepter** | *Good idea!* / *That sounds great* / *Why not!* |
| **Refuser** poliment | *I'd rather not* / *I'm afraid I can't* / *Sorry, I'm busy* |

## Would rather, pour dire sa préférence
| La construction | Un exemple |
| would rather + **base verbale** | *I'd rather stay home* |
| Pour comparer : + **than** | *I'd rather stay home than go out* |`,
          },
          questions: [
            ['Comment se construit « Let’s » ?', ['Let’s + base verbale', 'Let’s + to + verbe', 'Let’s + verbe en -ING', 'Let’s + participe passé'], 0, '« Let’s go to the cinema. »'],
            ['Comment se construit « How about » ?', ['How about + nom ou verbe en -ING', 'How about + base verbale', 'How about + to + verbe', 'How about + participe passé'], 0, '« How about going out tonight? »'],
            ['Quelle phrase est correcte ?', ['Why don’t we meet at six?', 'Why don’t we meeting at six?', 'Why we don’t meet at six?', 'Why don’t we to meet at six?'], 0, '« Why don’t we » est suivi de la base verbale.'],
            ['Que signifie « Shall we start? » ?', ['On commence ? — une proposition', 'Nous commencerons', 'Nous devons commencer', 'Nous avons commencé'], 0, '« Shall » sert à proposer, surtout en anglais britannique.'],
            ['Comment forme-t-on la négation de « Let’s » ?', ['Let’s not waste time.', 'Let’s don’t waste time.', 'Don’t let’s waste time.', 'Let’s no waste time.'], 0, '« Not » se place directement après « let’s ».'],
            ['Comment exprime-t-on une préférence ?', ['I’d rather stay home.', 'I’d rather to stay home.', 'I’d rather staying home.', 'I rather would stay home.'], 0, '« Would rather » est suivi de la base verbale.'],
            ['Comment refuse-t-on poliment une suggestion ?', ['I’d rather not.', 'No.', 'I don’t want.', 'Never.'], 0, '« I’m afraid I can’t » convient également.'],
            ['On peut dire « How about go out tonight? ».', ['Vrai', 'Faux'], 1, '« How about » exige un nom ou un verbe en -ING : « How about going out? »'],
          ],
        },
        {
          titre: 'Expression de la modalité : le souhait et le regret',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Wish, if only, would like',
            cours: `Would like dit le souhait ordinaire ; wish dit le souhait irréel.

## Would like — le souhait ordinaire
| La construction | Un exemple |
| would like + **to** + verbe | *I'd like to travel* |
| En question | *Would you like a drink?* |

Plus poli que *want* — c'est la forme attendue dans une demande.

## Wish — le souhait irréel
Sa construction dépend du moment visé.

| Le regret porte sur… | Le temps employé | Un exemple |
| Le **présent** | Le **prétérit** | *I wish I had more time* |
| Le **passé** | Le **past perfect** | *I wish I had studied harder* |
| Un **changement** souhaité | **would** | *I wish it would stop raining* |

> La règle à retenir : **on recule d'un temps**. Le regret sur le présent se dit au prétérit, le regret sur le passé au past perfect.

Avec le verbe be, la forme irréelle est **were** à toutes les personnes : *I wish I were taller.*

## If only
Même construction que *wish*, avec une charge émotionnelle plus forte.

*If only I knew the answer!* / *If only I had listened!*

## Autres formes du regret
| La forme | Un exemple |
| **should have** + participe passé | *I should have told you* |
| **regret** + -ING | *I regret saying that* |

## Les pièges du français
| L'anglais dit | Et non |
| *I'd like* | I would want |
| *I wish you a happy birthday* | La **seule** construction de wish qui ne recule pas d'un temps |`,
          },
          questions: [
            ['Quelle construction suit « would like » ?', ['to + verbe', 'la base verbale', 'le verbe en -ING', 'le participe passé'], 0, '« I’d like to travel. »'],
            ['Quel temps suit « wish » pour un regret sur le présent ?', ['Le prétérit', 'Le présent', 'Le past perfect', 'Le futur'], 0, '« I wish I had more time. »'],
            ['Quel temps suit « wish » pour un regret sur le passé ?', ['Le past perfect', 'Le prétérit', 'Le present perfect', 'Le conditionnel'], 0, '« I wish I had studied harder. »'],
            ['Comment exprime-t-on le souhait qu’une situation change ?', ['wish + would', 'wish + will', 'wish + can', 'wish + must'], 0, '« I wish it would stop raining. »'],
            ['Quelle phrase exprime un regret sur le présent ?', ['I wish I were taller.', 'I wish I am taller.', 'I wish I will be taller.', 'I wish I had been taller.'], 0, '« Were » s’emploie à toutes les personnes dans cette forme irréelle.'],
            ['Quelle expression renforce le regret exprimé par « wish » ?', ['If only', 'As well', 'Even so', 'At last'], 0, '« If only I had listened! »'],
            ['Comment dit-on « J’aurais dû te le dire » ?', ['I should have told you.', 'I should tell you.', 'I wish I tell you.', 'I would like to tell you.'], 0, '« Should have + participe passé » exprime le regret.'],
            ['« I wish you a happy birthday » suit la règle du recul d’un temps.', ['Vrai', 'Faux'], 1, 'Souhaiter quelque chose À quelqu’un est la seule construction de « wish » qui n’y est pas soumise.'],
          ],
        },
        {
          titre: 'Expression de la modalité : la probabilité',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Du certain à l’impossible',
            cours: `Les modaux permettent de graduer le **degré de certitude** d’une affirmation.

## L’échelle, du plus sûr au moins sûr
| Degré | Modal | Exemple |
|---|---|---|
| Certitude positive | **must** | *He **must** be tired.* (il doit être fatigué, j’en suis sûr) |
| Forte probabilité | **should** | *She **should** be home by now.* |
| Possibilité | **may**, **might**, **could** | *It **may** rain.* / *It **might** rain.* |
| Doute plus grand | **might** | *He **might** know.* |
| Certitude négative | **can’t** | *He **can’t** be serious!* (ce n’est pas possible) |

> La négation de la certitude n’est pas *mustn’t* mais **can’t** : *He **can’t** be at home* = « il ne peut pas être chez lui ». *Mustn’t* garderait le sens d’interdiction.

## Parler du passé : modal + HAVE + participe passé
- *He **must have** missed the train.* (il a dû rater le train)
- *She **may have** forgotten.* (elle a peut-être oublié)
- *They **can’t have** arrived yet.* (ils ne peuvent pas être déjà arrivés)
- *You **should have** called.* (tu aurais dû appeler)

## Les autres moyens
- **be likely to** : *It’s **likely to** rain.*
- **probably / maybe / perhaps** : *He’s **probably** at work.* (attention à la place : *probably* se met après l’auxiliaire, avant le verbe lexical)
- **I’m sure / I doubt** : *I’m sure he **knows**.*

## May et might
*Might* marque une probabilité un peu plus faible que *may*, mais les deux sont souvent interchangeables à l’oral.`,
          },
          questions: [
            ['Quel modal exprime la quasi-certitude positive ?', ['must', 'might', 'can’t', 'may'], 0, '« He must be tired » : j’en suis presque sûr.'],
            ['Quel modal exprime la certitude négative ?', ['can’t', 'mustn’t', 'shouldn’t', 'may not'], 0, '« He can’t be serious! » — ce n’est pas possible.'],
            ['Quels modaux expriment une simple possibilité ?', ['may, might, could', 'must, should', 'can’t, mustn’t', 'will, shall'], 0, '« It may rain », « it might rain ».'],
            ['Comment exprime-t-on une déduction sur le passé ?', ['modal + have + participe passé', 'modal + prétérit', 'modal + to + verbe', 'modal + verbe en -ING'], 0, '« He must have missed the train. »'],
            ['Que signifie « She may have forgotten » ?', ['Elle a peut-être oublié', 'Elle doit oublier', 'Elle ne peut pas avoir oublié', 'Elle aurait dû oublier'], 0, '« May have » exprime une possibilité passée.'],
            ['Quel modal marque la probabilité la plus faible ?', ['might', 'must', 'should', 'will'], 0, 'Il est un cran en dessous de « may ».'],
            ['Où se place « probably » dans la phrase ?', ['Après l’auxiliaire, avant le verbe lexical', 'En tête de phrase uniquement', 'À la fin de la phrase', 'Après le complément'], 0, '« He’s probably at work », « He will probably come ».'],
            ['La négation de la certitude « must » est « mustn’t ».', ['Vrai', 'Faux'], 1, 'C’est « can’t » : « mustn’t » garderait le sens d’interdiction.'],
          ],
        },
        {
          titre: 'Faire faire quelque chose à quelqu’un',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Make, let, have et get',
            cours: `Quatre verbes traduisent le « faire faire » du français, avec des constructions différentes.

## Le tableau des constructions
| Le verbe | Ce qui suit le complément | Son sens |
| **make** | La **base verbale** | **Obliger** |
| **let** | La **base verbale** | **Autoriser** |
| **have** | Le **participe passé** | Faire faire par un professionnel |
| **get** | **to** + verbe, ou le participe passé | Convaincre, ou faire faire |

## MAKE — obliger
*My parents make me do my homework.* / *The film made me cry.*

> Au **passif**, « to » réapparaît : *I was made to wait.*

## LET — autoriser
*She let me borrow her bike.*

> Il n'a **pas de passif** : on emploie *be allowed to*.

## HAVE — la structure causative
*I had my hair cut.* / *We had the car repaired.*

> C'est ce que le français rend par « **se faire** + infinitif ». Le sujet ne fait pas l'action : il la **commande**.

## GET
| La construction | Son sens | Un exemple |
| get + **to** + verbe | **Convaincre** quelqu'un | *I got him to help me* |
| get + **participe passé** | Même sens causatif que *have*, plus familier | *I got my phone fixed* |

## Le piège du français
| Ce qu'on veut dire | La forme correcte | La forme fautive |
| Je me suis fait couper les cheveux | *I had my hair cut* | *I cut my hair* — qui signifie que je les ai coupés moi-même |`,
          },
          questions: [
            ['Quelle construction suit « make » au sens d’obliger ?', ['make + complément + base verbale', 'make + complément + to + verbe', 'make + complément + participe passé', 'make + complément + verbe en -ING'], 0, '« My parents make me do my homework. »'],
            ['Quelle construction suit « let » ?', ['let + complément + base verbale', 'let + complément + to + verbe', 'let + complément + participe passé', 'let + to + verbe'], 0, '« She let me borrow her bike. »'],
            ['Comment dit-on « Je me suis fait couper les cheveux » ?', ['I had my hair cut.', 'I cut my hair.', 'I made cut my hair.', 'I let my hair cut.'], 0, '« I cut my hair » signifierait que je les ai coupés moi-même.'],
            ['Quelle construction suit « have » au sens causatif ?', ['have + complément + participe passé', 'have + complément + base verbale', 'have + to + verbe', 'have + verbe en -ING'], 0, '« We had the car repaired. »'],
            ['Que signifie « I got him to help me » ?', ['J’ai réussi à le convaincre de m’aider', 'Je l’ai obligé à m’aider', 'Je l’ai laissé m’aider', 'Il m’a aidé sans que je demande'], 0, '« Get + to + verbe » suppose un effort de persuasion.'],
            ['Que devient « make » à la voix passive ?', ['Il est suivi de « to » : I was made to wait.', 'Il reste sans « to »', 'Il devient « let »', 'Il n’a pas de passif'], 0, 'C’est la seule situation où « make » prend « to ».'],
            ['Quel verbe n’a pas de forme passive et se remplace par « be allowed to » ?', ['let', 'make', 'have', 'get'], 0, '« I was allowed to leave » remplace le passif de « let ».'],
            ['« I made him to wait » est une phrase correcte.', ['Vrai', 'Faux'], 1, '« Make » à la voix active est suivi de la base verbale, sans « to ».'],
          ],
        },
        {
          titre: 'Les verbes à particule et les verbes prépositionnels',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Get up, look after, put off',
            cours: `L'anglais accole souvent au verbe un petit mot qui en change le sens. Deux familles à distinguer.

## Les deux familles
| La famille | Le petit mot | Le complément |
| Verbe **à particule** (phrasal verb) | Une **particule adverbiale** | Il peut se placer **avant ou après** |
| Verbe **prépositionnel** | Une **préposition**, inséparable | Toujours **après** |

> Le test : si on peut dire *turn the light on*, c'est une **particule**. Si le complément ne peut pas se glisser au milieu, c'est une **préposition**.

## Les verbes à particule
| Le verbe seul | Avec la particule | Son sens |
| give | give **up** | Abandonner |
| look | look **up** | Chercher dans un dictionnaire |
| put | put **off** | Reporter |
| turn | turn **on / off** | Allumer / éteindre |

| La position du complément | Sa règle |
| Un **nom** | Avant ou après : *Turn on the light* = *Turn the light on* |
| Un **pronom** | **Obligatoirement avant** : *Turn it on* — jamais « turn on it » |

## Les verbes prépositionnels
| Le verbe | Son sens | Un exemple |
| look **after** | S'occuper de | *She looks after them* |
| listen **to** | Écouter | — |
| wait **for** | Attendre | — |
| depend **on** | Dépendre de | — |
| belong **to** | Appartenir à | — |

## Ceux qu'il faut connaître au brevet
| Le verbe | Son sens |
| get up, wake up | Se lever, se réveiller |
| look for | Chercher |
| look after | S'occuper de |
| look forward to | Attendre avec impatience |
| give up | Abandonner |
| find out | Découvrir |
| take off | Décoller, enlever |
| put on | Mettre un vêtement |
| grow up | Grandir |
| go on, carry on | Continuer |
| run out of | Être à court de |

> Le sens du groupe n'est presque jamais la somme des deux mots : *look after* n'a rien à voir avec « regarder après ». Ils s'apprennent comme des **mots de vocabulaire entiers**.`,
          },
          questions: [
            ['Que signifie « give up » ?', ['Abandonner', 'Donner en haut', 'Rendre un objet', 'Se lever'], 0, 'Le sens du groupe n’est pas la somme des deux mots.'],
            ['Que signifie « look after » ?', ['S’occuper de', 'Chercher', 'Regarder derrière', 'Ressembler à'], 0, '« Look for » signifie chercher.'],
            ['Où se place obligatoirement un pronom complément avec un verbe à particule ?', ['Avant la particule', 'Après la particule', 'En début de phrase', 'À la fin de la phrase'], 0, '« Turn it on », jamais « turn on it ».'],
            ['Quelle phrase est correcte ?', ['Turn the light on.', 'Turn on it.', 'Turn on the light on.', 'Turn it on the light.'], 0, 'Avec un nom, le complément peut se placer avant ou après la particule.'],
            ['Que signifie « put off » ?', ['Reporter', 'Éteindre définitivement', 'Enlever un vêtement', 'Déposer quelqu’un'], 0, '« Put on » signifie mettre un vêtement.'],
            ['Quelle est la différence entre une particule et une préposition ?', ['La particule peut être séparée du verbe, la préposition non', 'La préposition change le sens, pas la particule', 'La particule se place toujours en fin de phrase', 'Il n’y a aucune différence'], 0, 'Le test : peut-on glisser le complément au milieu ?'],
            ['Que signifie « find out » ?', ['Découvrir, apprendre une information', 'Sortir', 'Trouver un objet perdu', 'Chercher dehors'], 0, 'Très fréquent au brevet.'],
            ['Le sens d’un verbe à particule se déduit du sens de ses deux mots.', ['Vrai', 'Faux'], 1, '« Look after » n’a rien à voir avec « regarder après » : ils s’apprennent comme des mots entiers.'],
          ],
        },
        {
          titre: 'Infinitif et gérondif',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'To + verbe ou verbe en -ING ?',
            cours: `Après un verbe, l'anglais impose l'une ou l'autre forme — et parfois les deux, avec un sens différent.

## Les verbes suivis de TO + verbe
want, would like, decide, hope, need, promise, agree, refuse, learn, offer, manage, seem

*I want to go.* / *She decided to leave.*

## Les verbes suivis de -ING
enjoy, like, love, hate, finish, avoid, mind, suggest, keep, practise, imagine, miss, can't stand, **look forward to**

*I enjoy reading.* / *She finished working.*

> **look forward to** est suivi de **-ING** malgré son « to » : c'est ici une **préposition**, pas un infinitif.

## Les règles automatiques
| Ce qui précède | La forme obligatoire | Un exemple |
| Une **préposition** | **-ING** | *before leaving*, *without saying a word*, *good at swimming* |
| Un **modal** | La **base verbale** | *You must go*, *I can swim* |

## Les verbes qui changent de sens
| Avec **to** | Avec **-ING** |
| *stop to smoke* — s'arrêter **pour** fumer | *stop smoking* — arrêter de fumer |
| *remember to lock* — penser à fermer | *remember locking* — se souvenir d'avoir fermé |
| *try to open* — essayer d'ouvrir | *try opening* — essayer **en** ouvrant, pour voir |

## L'infinitif de but
| Pour dire « pour + verbe » | La forme |
| Correcte | **to** ou **in order to** : *I went to the shop to buy bread* |
| Fautive | *for buying* |`,
          },
          questions: [
            ['Quelle forme suit « enjoy » ?', ['Le verbe en -ING', 'to + verbe', 'La base verbale', 'Le participe passé'], 0, '« I enjoy reading. »'],
            ['Quelle forme suit « decide » ?', ['to + verbe', 'Le verbe en -ING', 'La base verbale', 'Le participe passé'], 0, '« She decided to leave. »'],
            ['Quelle forme suit une préposition ?', ['Le verbe en -ING', 'to + verbe', 'La base verbale', 'Le prétérit'], 0, '« Before leaving », « good at swimming ».'],
            ['Quelle forme suit un modal ?', ['La base verbale', 'to + verbe', 'Le verbe en -ING', 'Le participe passé'], 0, '« You must go », « I can swim ».'],
            ['Quelle est la différence entre « stop to smoke » et « stop smoking » ?', ['Le premier signifie s’arrêter pour fumer, le second arrêter de fumer', 'Les deux sont identiques', 'Le premier est incorrect', 'Le second signifie s’arrêter de marcher'], 0, 'Le choix de la forme change complètement le sens.'],
            ['Quelle forme suit « look forward to » ?', ['Le verbe en -ING', 'La base verbale', 'to + verbe', 'Le participe passé'], 0, 'Son « to » est une préposition : « I look forward to seeing you. »'],
            ['Comment traduit-on « Je suis allé au magasin pour acheter du pain » ?', ['I went to the shop to buy bread.', 'I went to the shop for buying bread.', 'I went to the shop for buy bread.', 'I went to the shop buying bread.'], 0, 'L’infinitif de but s’exprime avec « to » ou « in order to ».'],
            ['« Avoid » est suivi de « to + verbe ».', ['Vrai', 'Faux'], 1, 'Il est suivi du verbe en -ING : « avoid making noise ».'],
          ],
        },
        {
          titre: 'Les adverbes',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Formation, sens et place dans la phrase',
            cours: `Un adverbe modifie un verbe, un adjectif ou un autre adverbe. Il est invariable.

## La formation en -ly
| L'adjectif | Son adverbe |
| Cas général | slow → slow**ly**, careful → careful**ly** |
| En **-y** | happy → happ**ily** |
| En **-le** | simple → simp**ly** |

## Les irréguliers à connaître
| L'adjectif | Son adverbe | Le piège |
| good | **well** | *She sings well* |
| fast, hard, late, early | **Identiques** | Aucune terminaison en -ly |
| hard | **hardly** | Il signifie **à peine**, pas « durement » |
| late | **lately** | Il signifie **récemment**, pas « tardivement » |

## Les familles et leur place
| La famille | Ses exemples | Sa place |
| De **manière** | slowly, well, carefully | Après le verbe ou son complément |
| De **fréquence** | always, often, usually, never | **Avant** le verbe lexical, **après** l'auxiliaire ou be |
| De **temps** | yesterday, now, soon | Début ou fin de phrase |
| De **lieu** | here, there, outside | Fin de phrase |
| De **degré** | very, quite, too, really | **Devant** l'adjectif |
| **enough** | — | **Après** l'adjectif : *fast enough* |

| L'exemple de fréquence | Sa position |
| *I always get up early* | Avant le verbe lexical |
| *She is always late* | Après **be** |
| *I have never been there* | Après l'auxiliaire |

> L'ordre habituel en fin de phrase : **manière → lieu → temps**. *She sang beautifully at the concert last night.*

## Un piège permanent
> On n'intercale **jamais** un adverbe entre le verbe et son complément d'objet : *I speak English well*, jamais « I speak well English ».`,
          },
          questions: [
            ['Comment forme-t-on la plupart des adverbes ?', ['En ajoutant -ly à l’adjectif', 'En ajoutant -ed au verbe', 'En ajoutant -ing au verbe', 'En doublant l’adjectif'], 0, 'slow → slowly, careful → carefully.'],
            ['Quel est l’adverbe correspondant à « good » ?', ['well', 'goodly', 'better', 'good'], 0, 'C’est le principal irrégulier : « She sings well. »'],
            ['Que signifie « hardly » ?', ['À peine', 'Durement', 'Fortement', 'Rapidement'], 0, '« I can hardly hear you » signifie « je t’entends à peine ».'],
            ['Où se place un adverbe de fréquence comme « always » ?', ['Avant le verbe lexical, après l’auxiliaire ou be', 'Toujours en fin de phrase', 'Toujours en début de phrase', 'Après le complément'], 0, '« I always get up early », « She is always late ».'],
            ['Où se place « enough » ?', ['Après l’adjectif : fast enough', 'Avant l’adjectif', 'En fin de phrase toujours', 'Avant le verbe'], 0, 'C’est le seul adverbe de degré à se placer après.'],
            ['Quel est l’ordre habituel des compléments en fin de phrase ?', ['Manière, lieu, temps', 'Temps, lieu, manière', 'Lieu, temps, manière', 'Manière, temps, lieu'], 0, '« She sang beautifully at the concert last night. »'],
            ['Quelle phrase est correcte ?', ['I speak English well.', 'I speak well English.', 'I well speak English.', 'I speak English good.'], 0, 'On n’intercale jamais l’adverbe entre le verbe et son complément d’objet.'],
            ['« Lately » signifie « tardivement ».', ['Vrai', 'Faux'], 1, 'Il signifie « récemment » ; « tard » se dit « late ».'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : Les temps
        // ===================================================================
        {
          titre: 'Le présent simple et le présent en BE + -ING',
          axe: 'Les temps',
          lecon: {
            titre: 'Ce qui est habituel, ce qui se passe maintenant',
            cours: `L'anglais possède deux présents, qui ne disent pas la même chose.

## Les deux formes
| Le point | Présent **simple** | Présent en **BE + -ING** |
| Sa forme | Base verbale, **-s** à la 3e personne | be + verbe en -ING |
| Sa négation | Avec **do** : *I don't work* | *I am not working* |
| Ce qu'il exprime | L'**habituel**, le permanent | Ce qui est **en cours** |

## Le présent simple
| L'orthographe de la 3e personne | Son exemple |
| Cas général : **-s** | works |
| En -o, -sh, -ch, -x, -ss : **-es** | goes, watches, misses |
| En consonne + y : **-ies** | study → stud**ies** |

| Son emploi | Un exemple |
| Une **habitude** | *I go to school by bus* |
| Une **vérité générale** | *Water boils at 100 °C* |
| Un **état permanent** | *She lives in Paris* |
| Un **programme** fixe | *The train leaves at six* |

Il s'accompagne des adverbes de fréquence : always, often, usually, never, every day.

## Le présent en BE + -ING
| Son emploi | Un exemple |
| Une action **en cours** | *Look! It is raining* |
| Une situation **temporaire** | *I am staying with my aunt this week* |
| Un **projet** organisé | *We are meeting Tom tonight* |
| Avec *always* : un **agacement** | *He is always losing his keys!* |

> **Habituel → présent simple. En train de se faire → BE + -ING.** *I play tennis* (chaque semaine) contre *I am playing tennis* (en ce moment).

## Les verbes qui n'acceptent pas -ING
Les verbes d'**état** : know, like, love, hate, want, need, understand, believe, prefer, seem, belong.

> *I know the answer*, jamais « I am knowing ».`,
          },
          questions: [
            ['Quel temps exprime une habitude ?', ['Le présent simple', 'Le présent en BE + -ING', 'Le prétérit', 'Le present perfect'], 0, '« I go to school by bus. »'],
            ['Quel temps exprime une action en cours au moment où l’on parle ?', ['Le présent en BE + -ING', 'Le présent simple', 'Le prétérit simple', 'Le past perfect'], 0, '« Look! It is raining. »'],
            ['Quelle est la forme correcte à la troisième personne du singulier ?', ['She studies English.', 'She studys English.', 'She study English.', 'She studyes English.'], 0, 'Consonne + y donne -ies.'],
            ['Quelle phrase est correcte ?', ['She doesn’t work here.', 'She doesn’t works here.', 'She don’t work here.', 'She not works here.'], 0, 'DOES porte la marque de la personne.'],
            ['Quel verbe n’accepte pas la forme en -ING ?', ['know', 'work', 'run', 'read'], 0, 'Les verbes d’état restent au présent simple.'],
            ['Comment exprime-t-on un projet déjà organisé ?', ['We are meeting Tom tonight.', 'We meet Tom tonight.', 'We will meet Tom tonight, maybe.', 'We are meet Tom tonight.'], 0, 'Le présent en BE + -ING vaut pour l’avenir organisé.'],
            ['Que signifie « He is always losing his keys! » ?', ['Un agacement devant une habitude répétée', 'Une action en cours en ce moment', 'Une vérité générale', 'Un projet futur'], 0, '« Always » avec BE + -ING exprime l’exaspération.'],
            ['« I am knowing the answer » est une phrase correcte.', ['Vrai', 'Faux'], 1, '« Know » est un verbe d’état : « I know the answer ».'],
          ],
        },
        {
          titre: 'Le prétérit simple',
          axe: 'Les temps',
          lecon: {
            titre: 'Le temps du passé révolu',
            cours: `Le prétérit simple raconte un fait passé, daté et terminé, sans aucun lien avec le présent.

## La forme
| Le type de verbe | Sa formation | Un exemple |
| **Régulier** | Base verbale + **-ed** | worked, played, visited |
| En -e | **-d** | lived |
| Consonne + y | **-ied** | study → stud**ied** |
| Voyelle courte accentuée | Consonne **doublée** | stop → sto**pped** |
| **Irrégulier** | La **2e colonne** de la liste | go → **went**, see → **saw**, take → **took** |

> **Même forme à toutes les personnes**, sauf pour *be* : was / were.

## Négation et question : DID
| La forme | Son exemple |
| Négation | *I didn't go* |
| Question | *Did you go?* |

> Le verbe revient à la **base verbale** : DID porte déjà le passé.

## Les emplois
| L'emploi | Un exemple |
| Une action **ponctuelle** passée | *I saw him yesterday* |
| Une **suite** d'actions | *She opened the door, took her coat and left* |
| Une **habitude passée** | *We played together every summer* |

## Les marqueurs de temps
yesterday, last week, in 2019, two days ago, when I was young, then

> **La présence d'un repère passé précis impose le prétérit** — jamais le present perfect. *I have seen him yesterday* est faux ; c'est *I saw him yesterday*.

## USED TO
| La forme | Son sens |
| **used to** + base verbale | Une habitude passée **qui n'a plus cours** |
| Sa négation | *I didn't use to like it* |

*I used to play football.* — avant, plus maintenant.

## La prononciation de -ed
| Le son final du verbe | La réalisation | Un exemple |
| **Sourd** | [t] | worked |
| **Sonore** | [d] | played |
| **t** ou **d** | [ɪd] | wanted, needed |`,
          },
          questions: [
            ['Quel temps emploie-t-on avec « yesterday » ?', ['Le prétérit simple', 'Le present perfect', 'Le présent simple', 'Le past perfect'], 0, 'Un repère passé précis impose le prétérit.'],
            ['Quel est le prétérit de « study » ?', ['studied', 'studyed', 'studed', 'studying'], 0, 'Consonne + y donne -ied.'],
            ['Quel est le prétérit de « stop » ?', ['stopped', 'stoped', 'stopt', 'stopping'], 0, 'La consonne finale double après une voyelle courte accentuée.'],
            ['Quelle phrase est correcte ?', ['I didn’t go to school.', 'I didn’t went to school.', 'I not went to school.', 'I don’t went to school.'], 0, 'DID porte le passé, le verbe reste à la base verbale.'],
            ['Comment se conjugue le prétérit régulier selon les personnes ?', ['Il est identique à toutes les personnes', 'Il prend un -s à la troisième personne', 'Il change à chaque personne', 'Il n’existe qu’à la première personne'], 0, 'Seul « be » fait exception, avec was et were.'],
            ['Que signifie « I used to play football » ?', ['Je jouais au football autrefois, ce n’est plus le cas', 'Je joue habituellement au football', 'J’ai l’habitude d’utiliser un ballon', 'Je vais jouer au football'], 0, '« Used to » marque une habitude passée révolue.'],
            ['Quel est le prétérit de « see » ?', ['saw', 'seen', 'seed', 'sawed'], 0, '« Seen » est le participe passé, pas le prétérit.'],
            ['On peut dire « I have seen him yesterday ».', ['Vrai', 'Faux'], 1, 'Avec un repère passé daté, le prétérit s’impose : « I saw him yesterday ».'],
          ],
        },
        {
          titre: 'Le prétérit en BE + -ING',
          axe: 'Les temps',
          lecon: {
            titre: 'Le décor d’une scène passée',
            cours: `Le prétérit en BE + -ING décrit une action en cours à un moment du passé.

## La forme
was / were + verbe en **-ING**

| La phrase | Sa forme |
| Affirmative | *I was working* |
| Négative | *They weren't playing* |
| Interrogative | *Were you working?* |

## Les emplois
| L'emploi | Un exemple |
| Une action **en cours** à un moment précis | *At eight o'clock last night, I was watching TV* |
| Le **décor** d'un récit, interrompu | *I was walking home when it started to rain* |
| Deux actions **simultanées** | *She was cooking while he was doing his homework* |

## Le couple décor / événement
| L'action | Sa durée | Son temps | Sa conjonction |
| Le **décor** | Longue | **BE + -ING** | **while** |
| L'**événement** | Courte | Prétérit **simple** | **when** |

> Le test : ce qui **encadre** est en -ING, ce qui **survient** est au prétérit simple.

## Ce qu'il n'exprime pas
| La phrase | Ce qu'elle dit |
| *I watched a film last night* | Le film est **fini** |
| *I was watching a film* | On ne sait pas s'il est allé au bout |

## Les verbes d'état
Comme au présent, ils n'acceptent pas -ING.

> *I knew the answer*, jamais « I was knowing ».`,
          },
          questions: [
            ['Quelle forme prend le prétérit en BE + -ING ?', ['was / were + verbe en -ING', 'did + verbe en -ING', 'have + participe passé', 'was + participe passé'], 0, '« I was working », « They were playing ».'],
            ['Quel temps décrit le décor d’une scène passée ?', ['Le prétérit en BE + -ING', 'Le prétérit simple', 'Le present perfect', 'Le présent simple'], 0, 'L’action ponctuelle qui l’interrompt se met au prétérit simple.'],
            ['Quelle phrase est correcte ?', ['I was walking home when it started to rain.', 'I walked home when it was starting to rain.', 'I was walking home when it was started to rain.', 'I walk home when it started to rain.'], 0, 'Action longue en -ING, action courte au prétérit simple.'],
            ['Quelle conjonction introduit l’action courte ?', ['when', 'while', 'since', 'for'], 0, '« While » introduit plutôt l’action longue.'],
            ['Comment exprime-t-on deux actions passées simultanées ?', ['Les deux au prétérit en BE + -ING, reliées par « while »', 'Les deux au prétérit simple', 'L’une au présent, l’autre au passé', 'Les deux au present perfect'], 0, '« She was cooking while he was doing his homework. »'],
            ['Quelle différence y a-t-il entre « I watched a film » et « I was watching a film » ?', ['Le premier dit que le film est terminé, le second non', 'Les deux sont identiques', 'Le second est incorrect', 'Le premier est au présent'], 0, 'La forme en -ING ne dit rien de l’achèvement.'],
            ['Quelle est la négation de « They were playing » ?', ['They weren’t playing.', 'They didn’t were playing.', 'They wasn’t playing.', 'They not were playing.'], 0, '« Not » se place après l’auxiliaire « be ».'],
            ['« I was knowing the answer » est correct.', ['Vrai', 'Faux'], 1, 'Les verbes d’état n’acceptent pas la forme en -ING : « I knew the answer ».'],
          ],
        },
        {
          titre: 'Le present perfect',
          axe: 'Les temps',
          lecon: {
            titre: 'Le passé qui compte encore aujourd’hui',
            cours: `Le **present perfect** relie le **passé** au **présent** : il parle d’un fait passé dont le **résultat** ou la **pertinence** vaut maintenant.

## La forme
**have / has + participe passé**
*I **have finished**.* / *She **has gone**.* / *We **haven’t seen** him.* / ***Have** you **finished**?*

Le participe passé est la **troisième colonne** de la liste des verbes irréguliers (go → gone, see → seen), ou la forme en **-ed** pour les réguliers.

## Les trois emplois
**1. Un fait passé sans date, avec un résultat présent**
*I **have lost** my keys.* (je ne les ai toujours pas)

**2. Une expérience de vie**
*I **have never been** to Japan.* / ***Have** you **ever eaten** sushi?*
Marqueurs : **ever, never, already, yet, just, before**.

**3. Une action commencée dans le passé et qui continue**
*I **have lived** here **for** five years.* / *She **has worked** here **since** 2020.*
- **for** + une **durée** : for two hours, for a long time ;
- **since** + un **point de départ** : since Monday, since 2020, since I was ten.

## La différence avec le prétérit
| Present perfect | Prétérit |
|---|---|
| pas de date | date précise |
| lien avec le présent | passé coupé du présent |
| *I **have seen** that film.* | *I **saw** it last night.* |

> Dès qu’un repère passé précis apparaît — yesterday, last week, in 2019, ago — le present perfect devient impossible.

## La place des marqueurs
- **already, just, never, ever** : entre l’auxiliaire et le participe passé — *I have **just** arrived.*
- **yet** : en fin de phrase, dans les questions et les négations — *Have you finished **yet**?* / *I haven’t finished **yet**.*`,
          },
          questions: [
            ['Comment se forme le present perfect ?', ['have / has + participe passé', 'have / has + base verbale', 'be + participe passé', 'did + participe passé'], 0, '« I have finished », « She has gone ».'],
            ['Que signifie « I have lost my keys » ?', ['Je les ai perdues et je ne les ai toujours pas', 'Je les avais perdues hier et retrouvées depuis', 'Je vais les perdre', 'Je les perdais souvent'], 0, 'Le present perfect insiste sur le résultat présent.'],
            ['Quelle préposition introduit une durée ?', ['for', 'since', 'ago', 'during'], 0, '« For five years » contre « since 2020 ».'],
            ['Quelle préposition introduit un point de départ ?', ['since', 'for', 'yet', 'already'], 0, '« Since Monday », « since I was ten ».'],
            ['Où se place « yet » ?', ['En fin de phrase, dans les questions et les négations', 'Entre l’auxiliaire et le participe passé', 'En début de phrase', 'Après le sujet'], 0, '« Have you finished yet? », « I haven’t finished yet. »'],
            ['Où se place « just » ?', ['Entre l’auxiliaire et le participe passé', 'En fin de phrase', 'Avant le sujet', 'Après le complément'], 0, '« I have just arrived. »'],
            ['Quelle phrase est correcte ?', ['I have seen that film.', 'I have seen that film last night.', 'I have saw that film.', 'I has seen that film.'], 0, 'Avec « last night », il faudrait le prétérit : « I saw it last night ».'],
            ['On peut employer le present perfect avec « in 2019 ».', ['Vrai', 'Faux'], 1, 'Un repère passé daté impose le prétérit.'],
          ],
        },
        {
          titre: 'Le past perfect',
          axe: 'Les temps',
          lecon: {
            titre: 'Le passé avant le passé',
            cours: `Le past perfect situe une action antérieure à une autre action passée. C'est le « passé du passé ».

## La forme
had + participe passé, à toutes les personnes

| La phrase | Sa forme |
| Affirmative | *I had finished* |
| Négative | *She hadn't left* |
| Interrogative | *Had you seen him?* |

> Contraction : *I'd finished*. Attention, **'d** peut aussi valoir *would*.

## L'emploi principal : l'antériorité
| L'action | Son temps | Un exemple |
| La plus **ancienne** | **Past perfect** | *the train had already left* |
| La plus **récente** | Prétérit simple | *When I arrived…* |

*She was upset because she had failed the test.*

> Sans past perfect, l'ordre se perd : *When I arrived, the train left* signifierait que le train est parti **après** mon arrivée.

## Les autres emplois
| L'emploi | Un exemple |
| Après **after, before, when**, pour marquer l'ordre | *After he had eaten, he went out* |
| Au **discours indirect** | *« I saw him. »* → *He said he had seen him* |
| Après **wish** et **if only** | *I wish I had studied harder* |
| Dans la **troisième condition** | *If I had known, I would have come* |

## Quand il n'est pas nécessaire
> Quand l'ordre chronologique est déjà clair : *She opened the door, took her coat and left.* Trois prétérits simples suffisent.`,
          },
          questions: [
            ['Comment se forme le past perfect ?', ['had + participe passé', 'have + participe passé', 'was + participe passé', 'did + participe passé'], 0, '« I had finished », à toutes les personnes.'],
            ['Que situe le past perfect ?', ['Une action antérieure à une autre action passée', 'Une action en cours dans le passé', 'Une action future', 'Une habitude présente'], 0, 'C’est le passé du passé.'],
            ['Quelle phrase est correcte ?', ['When I arrived, the train had already left.', 'When I had arrived, the train left already.', 'When I arrived, the train has already left.', 'When I arrive, the train had left.'], 0, 'L’action la plus ancienne se met au past perfect.'],
            ['Quel temps emploie-t-on après « wish » pour un regret sur le passé ?', ['Le past perfect', 'Le prétérit', 'Le present perfect', 'Le conditionnel'], 0, '« I wish I had studied harder. »'],
            ['Que devient un prétérit au discours indirect ?', ['Un past perfect', 'Un present perfect', 'Un présent simple', 'Il ne change pas'], 0, '« I saw him » devient « He said he had seen him ».'],
            ['Quel temps emploie-t-on dans la troisième condition ?', ['Le past perfect après « if »', 'Le prétérit après « if »', 'Le présent après « if »', 'Le futur après « if »'], 0, '« If I had known, I would have come. »'],
            ['Quand le past perfect n’est-il pas nécessaire ?', ['Quand le récit suit déjà les événements dans l’ordre chronologique', 'Quand il y a deux actions passées', 'Quand la phrase contient « after »', 'Quand le sujet est au pluriel'], 0, 'Trois prétérits simples suffisent alors.'],
            ['La contraction « ’d » désigne toujours « had ».', ['Vrai', 'Faux'], 1, 'Elle peut aussi valoir « would » : c’est ce qui suit qui tranche.'],
          ],
        },
        {
          titre: 'Exprimer le futur',
          axe: 'Les temps',
          lecon: {
            titre: 'Will, be going to, présent en -ING',
            cours: `L'anglais n'a pas de temps futur unique : il choisit une forme selon la façon dont on envisage l'avenir.

## Les quatre formes
| La forme | Ce qu'elle exprime | Un exemple |
| **will** | Une décision **prise au moment de parler**, une prédiction, une promesse | *The phone's ringing — I'll get it!* |
| **be going to** | Une **intention** déjà formée, ou une prédiction fondée sur un **indice présent** | *Look at those clouds — it's going to rain* |
| **BE + -ING** | Un **rendez-vous organisé**, avec date et lieu | *I am meeting Sarah at six* |
| Le **présent simple** | Un **horaire officiel** | *The train leaves at 7.15* |

> Les trois premières se distinguent par le **degré de préparation** : décision immédiate → intention → rendez-vous fixé.

## WILL en détail
| L'emploi | Un exemple |
| Décision immédiate | *I'll get it!* |
| Prédiction, opinion | *I think it will be sunny* |
| Promesse, offre | *I will always be there* |

Négation : **won't**. Question : *Will you come?*

## Après les conjonctions de temps
| La forme correcte | La forme fautive |
| *I'll call you when I arrive* | when I **will** arrive |

Après **when, as soon as, before, after, until**, l'anglais emploie le **présent**.

## Le futur proche du passé
| La forme | Son sens |
| **was / were going to** | J'avais l'intention — *I was going to call you, but I forgot* |`,
          },
          questions: [
            ['Quelle forme exprime une décision prise au moment de parler ?', ['will', 'be going to', 'le présent en BE + -ING', 'le présent simple'], 0, '« The phone’s ringing — I’ll get it! »'],
            ['Quelle forme exprime une intention déjà formée ?', ['be going to', 'will', 'le présent simple', 'le past perfect'], 0, '« We are going to buy a house. »'],
            ['Quelle forme emploie-t-on pour un rendez-vous organisé ?', ['Le présent en BE + -ING', 'will', 'Le présent simple', 'be going to'], 0, '« I am meeting Sarah at six. »'],
            ['Quelle forme emploie-t-on pour un horaire officiel ?', ['Le présent simple', 'will', 'be going to', 'Le present perfect'], 0, '« The train leaves at 7.15. »'],
            ['Quelle phrase est correcte ?', ['I’ll call you when I arrive.', 'I’ll call you when I will arrive.', 'I call you when I will arrive.', 'I’ll call you when I arrived.'], 0, 'Après « when », l’anglais emploie le présent.'],
            ['Comment prédit-on la pluie en voyant des nuages ?', ['It’s going to rain.', 'It will rain, I promise.', 'It rains.', 'It is raining tomorrow.'], 0, 'Une prédiction fondée sur un indice présent appelle « be going to ».'],
            ['Comment dit-on « J’allais t’appeler, mais j’ai oublié » ?', ['I was going to call you, but I forgot.', 'I will call you, but I forgot.', 'I am going to call you, but I forgot.', 'I would call you, but I forgot.'], 0, '« Was going to » exprime une intention passée non réalisée.'],
            ['« Will » s’emploie après « as soon as ».', ['Vrai', 'Faux'], 1, 'Après les conjonctions de temps, l’anglais emploie le présent.'],
          ],
        },
        {
          titre: 'Exprimer le conditionnel',
          axe: 'Les temps',
          lecon: {
            titre: 'Les trois conditions',
            cours: `Une phrase conditionnelle comporte une proposition en **if** et une proposition principale. L’anglais en distingue **trois types**, selon le degré de réalité.

## Type 1 — le possible
**if + présent simple, ... will + base verbale**
*If it **rains**, I **will stay** home.*
Ce qui est envisagé peut réellement arriver.

## Type 2 — l’irréel du présent
**if + prétérit, ... would + base verbale**
*If I **had** more time, I **would travel**.* (je n’ai pas le temps)
*If I **were** you, I **would** apologise.* — **were** à toutes les personnes dans cette structure.

## Type 3 — l’irréel du passé, le regret
**if + past perfect, ... would have + participe passé**
*If I **had studied**, I **would have passed**.* (je n’ai pas étudié, j’ai échoué)

## Le tableau
| Type | Sens | If… | Principale |
|---|---|---|---|
| 1 | possible | présent | will + BV |
| 2 | irréel présent | prétérit | would + BV |
| 3 | irréel passé | past perfect | would have + PP |

> **Jamais de *will* ni de *would* après *if***. Le décalage de temps porte à lui seul l’irréel — c’est la faute la plus fréquente du chapitre.

## L’ordre des propositions
Les deux ordres sont possibles. Quand *if* ouvre la phrase, une **virgule** sépare les deux propositions :
*If it rains**,** I will stay home.* / *I will stay home **if** it rains.*

## Le conditionnel hors de « if »
- politesse : *I **would like** a coffee.*
- préférence : *I **would rather** stay.*
- après *wish* : *I wish I **could** come.*`,
          },
          questions: [
            ['Quelle structure suit une condition de type 1 ?', ['if + présent, will + base verbale', 'if + prétérit, would + base verbale', 'if + will, présent', 'if + past perfect, would have + participe passé'], 0, '« If it rains, I will stay home. »'],
            ['Quelle structure exprime l’irréel du présent ?', ['if + prétérit, would + base verbale', 'if + présent, will + base verbale', 'if + past perfect, would have', 'if + would, prétérit'], 0, '« If I had more time, I would travel. »'],
            ['Quelle structure exprime le regret sur le passé ?', ['if + past perfect, would have + participe passé', 'if + prétérit, would + base verbale', 'if + présent, will', 'if + present perfect, will have'], 0, '« If I had studied, I would have passed. »'],
            ['Quelle phrase est correcte ?', ['If I were you, I would apologise.', 'If I was you, I will apologise.', 'If I would be you, I would apologise.', 'If I am you, I would apologise.'], 0, '« Were » s’emploie à toutes les personnes dans cette structure.'],
            ['Que ne trouve-t-on jamais après « if » ?', ['will ou would', 'le présent', 'le prétérit', 'le past perfect'], 0, 'C’est la faute la plus fréquente du chapitre.'],
            ['Que signifie « If I had studied, I would have passed » ?', ['Je n’ai pas étudié et j’ai échoué', 'J’ai étudié et j’ai réussi', 'Je vais étudier pour réussir', 'J’étudie donc je réussirai'], 0, 'Le type 3 exprime un fait contraire à la réalité passée.'],
            ['Quand met-on une virgule dans une phrase conditionnelle ?', ['Quand la proposition en « if » ouvre la phrase', 'Toujours', 'Jamais', 'Quand la principale ouvre la phrase'], 0, '« If it rains, I will stay home » mais « I will stay home if it rains ».'],
            ['On peut dire « If I will have time, I will come ».', ['Vrai', 'Faux'], 1, 'Après « if », on emploie le présent : « If I have time, I will come ».'],
          ],
        },
        {
          titre: 'Verbes irréguliers',
          axe: 'Les temps',
          lecon: {
            titre: 'Les trois colonnes, et comment les apprendre',
            cours: `Environ 180 verbes anglais ne suivent pas la règle du -ed. Ils s'apprennent en trois colonnes.

base verbale → prétérit → participe passé

## À quoi sert chaque colonne
| La colonne | Ses emplois |
| **1re** | Présent, après un **modal**, après **to**, après **did** |
| **2e** | Le prétérit simple **affirmatif** uniquement |
| **3e** | Present perfect, past perfect, **voix passive** |

> *I saw* (colonne 2), *I have seen* (colonne 3), *I didn't see* (colonne 1). Se tromper de colonne est la faute la plus visible d'une copie.

## Les familles, pour retenir plus vite
| La famille | Ses verbes |
| **Trois formes identiques** | cut, put, let, hit, cost, shut, read — la prononciation change pour *read* |
| **1 = 3** | come – came – come, become, run |
| **2 = 3** | buy – bought – bought, bring, think, teach, catch, sell, tell, find, have, make, say, pay, leave, feel, keep, meet, sleep, win, stand, understand |
| **Trois formes différentes** | go – went – gone, see – saw – seen, take – took – taken, write – wrote – written, speak, break, drink, begin, know, give, eat, fly |

## Les vingt à connaître absolument
| Le verbe | Ses trois formes |
| be | was/were – been |
| have | had – had |
| do | did – done |
| go | went – gone |
| see | saw – seen |
| take | took – taken |
| come | came – come |
| get | got – got |
| make | made – made |
| know | knew – known |
| think | thought – thought |
| say | said – said |
| give | gave – given |
| find | found – found |
| write | wrote – written |
| read | read – read |
| speak | spoke – spoken |
| eat | ate – eaten |
| drink | drank – drunk |
| buy | bought – bought |

## La méthode
> Les apprendre **par famille** plutôt que par ordre alphabétique, à voix haute, et toujours **les trois formes ensemble** : une forme isolée ne sert à rien.`,
          },
          questions: [
            ['À quoi sert la troisième colonne des verbes irréguliers ?', ['Au present perfect, au past perfect et à la voix passive', 'Au prétérit simple', 'Au présent simple', 'Au futur'], 0, 'La deuxième colonne sert au prétérit affirmatif.'],
            ['Quelle forme emploie-t-on après « did » ?', ['La base verbale (première colonne)', 'Le prétérit (deuxième colonne)', 'Le participe passé (troisième colonne)', 'Le verbe en -ING'], 0, '« I didn’t see », jamais « I didn’t saw ».'],
            ['Quel est le participe passé de « see » ?', ['seen', 'saw', 'seed', 'sawn'], 0, '« Saw » est le prétérit.'],
            ['Quelles sont les trois formes de « write » ?', ['write – wrote – written', 'write – written – wrote', 'write – writed – written', 'write – wrote – wrote'], 0, 'Trois formes différentes.'],
            ['Quel verbe a ses trois formes identiques ?', ['cut', 'go', 'see', 'take'], 0, 'Put, let, hit, cost et shut aussi.'],
            ['Quelles sont les trois formes de « buy » ?', ['buy – bought – bought', 'buy – buyed – buyed', 'buy – bought – boughten', 'buy – brought – brought'], 0, 'Deuxième et troisième formes identiques, comme bring, think ou teach.'],
            ['Quelles sont les trois formes de « be » ?', ['be – was/were – been', 'be – been – was', 'be – beed – been', 'be – was – was'], 0, 'C’est le seul verbe à avoir deux formes au prétérit.'],
            ['Une seule des trois formes d’un verbe irrégulier suffit à l’employer correctement.', ['Vrai', 'Faux'], 1, 'Chaque colonne a son emploi : elles s’apprennent ensemble.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 : La phrase
        // ===================================================================
        {
          titre: 'Phrase simple et phrase complexe',
          axe: 'La phrase',
          lecon: {
            titre: 'L’ordre des mots, cette règle qui ne se négocie pas',
            cours: `L'ordre des mots anglais ne se négocie pas.

## L'ordre de base : S-V-O
Sujet – Verbe – Complément d'objet

*She (S) bought (V) a new phone (O).*

| La règle | Son exemple |
| Le **sujet est obligatoire** | *It is raining*, *There is a problem* |
| L'ordre des compléments | **manière → lieu → temps** |

*She played the piano beautifully at the concert last night.*

Un complément de temps peut aussi ouvrir la phrase.

## La phrase complexe
| Le procédé | Son principe | Ses mots |
| La **coordination** | Deux propositions de **même rang** | and, but, or, so, because, yet |
| La **subordination** | Une proposition **dépend** de l'autre | Voir ci-dessous |

| La subordonnée | Ses mots introducteurs | Un exemple |
| **Relative** | that, which, who | *the book that I read* |
| **Complétive** | that, souvent omis | *I think (that) he is right* |
| De **temps** | when, while, before, after, as soon as, until | — |
| De **cause** | because, since, as | — |
| De **but** | so that, in order to | — |
| De **condition** | if, unless | — |

> Après les conjonctions de temps et après **if**, l'anglais emploie le **présent** pour parler de l'avenir : *I'll call you when I arrive.*

## Trois pièges pour un francophone
| L'erreur | La forme correcte |
| La **double négation** | *I didn't see anybody* — jamais « didn't see nobody » |
| L'adverbe entre verbe et objet | *I speak English well* — jamais « speak well English » |
| L'adverbe de **fréquence** | **Avant** le verbe lexical : *I often go there* |`,
          },
          questions: [
            ['Quel est l’ordre de base d’une phrase anglaise ?', ['Sujet – Verbe – Complément d’objet', 'Verbe – Sujet – Complément', 'Sujet – Complément – Verbe', 'Complément – Verbe – Sujet'], 0, 'Cet ordre ne se déplace pas.'],
            ['Pourquoi dit-on « It is raining » ?', ['Parce que le sujet est obligatoire en anglais', 'Parce que « it » désigne le ciel', 'Parce que c’est une tournure familière', 'Parce que « rain » est un nom'], 0, 'Même vide de sens, le sujet doit être exprimé.'],
            ['Quel est l’ordre des compléments après l’objet ?', ['Manière, lieu, temps', 'Temps, manière, lieu', 'Lieu, manière, temps', 'Temps, lieu, manière'], 0, '« beautifully at the concert last night ».'],
            ['Quelle conjonction relie deux propositions de même rang ?', ['but', 'that', 'which', 'whose'], 0, 'And, or, so, because et yet aussi.'],
            ['Quel temps emploie-t-on après « when » pour parler de l’avenir ?', ['Le présent', 'Le futur avec will', 'Le prétérit', 'Le conditionnel'], 0, '« I’ll call you when I arrive. »'],
            ['Quelle phrase est correcte ?', ['I didn’t see anybody.', 'I didn’t see nobody.', 'I not saw nobody.', 'I didn’t saw anybody.'], 0, 'L’anglais n’admet pas la double négation.'],
            ['Où se place un adverbe de fréquence comme « often » ?', ['Avant le verbe lexical', 'Après le complément d’objet', 'En début de phrase seulement', 'Entre le verbe et son objet'], 0, '« I often go there. »'],
            ['Le sujet peut être omis en anglais quand il est évident.', ['Vrai', 'Faux'], 1, 'Il est toujours obligatoire, même quand il ne désigne rien.'],
          ],
        },
        {
          titre: 'Les pronoms personnels',
          axe: 'La phrase',
          lecon: {
            titre: 'Sujets, compléments, réfléchis',
            cours: `## Le tableau complet

| Sujet | Complément | Adjectif possessif | Pronom possessif | Réfléchi |
|---|---|---|---|---|
| I | me | my | mine | myself |
| you | you | your | yours | yourself / yourselves |
| he | him | his | his | himself |
| she | her | her | hers | herself |
| it | it | its | — | itself |
| we | us | our | ours | ourselves |
| they | them | their | theirs | themselves |

## Les pronoms sujets
Ils précèdent le verbe et sont **obligatoires** : *She works here.*

## Les pronoms compléments
Ils suivent le verbe ou une **préposition** : *I saw **him*** / *with **them*** / *for **us***.

## IT et ONE
- **it** reprend une chose, un animal non identifié, et sert de sujet vide : *It’s cold.* / *It’s five o’clock.* / *It takes an hour.*
- **one / ones** évite de répéter un nom : *I prefer the red **one**.*

## Les pronoms réfléchis
Emplois :
- l’action revient sur le sujet : *He hurt **himself**.* ;
- l’insistance : *I did it **myself**.* ;
- **by + réfléchi** = tout seul : *She lives **by herself**.*

> Attention : certains verbes pronominaux français ne le sont pas en anglais. *I wash* (je me lave), *I get up* (je me lève), *I feel* (je me sens) — sans pronom réfléchi.

## THEY, pronom neutre
*They* sert aussi de pronom **singulier neutre** quand le genre est inconnu ou non pertinent : *Someone called — **they** left a message.* C’est une tournure standard, y compris à l’écrit.`,
          },
          questions: [
            ['Quel est le pronom complément correspondant à « they » ?', ['them', 'their', 'theirs', 'themselves'], 0, '« I saw them. »'],
            ['Où se place un pronom complément ?', ['Après le verbe ou après une préposition', 'Avant le verbe', 'En début de phrase', 'Après le sujet'], 0, '« with them », « for us ».'],
            ['Quel pronom sert de sujet vide dans « Il fait froid » ?', ['it', 'he', 'there', 'this'], 0, '« It’s cold », « It’s five o’clock ».'],
            ['Comment évite-t-on de répéter un nom déjà cité ?', ['Avec « one » ou « ones »', 'Avec « it » uniquement', 'En le supprimant', 'Avec « that »'], 0, '« I prefer the red one. »'],
            ['Que signifie « by herself » ?', ['Toute seule', 'Près d’elle', 'Grâce à elle', 'Selon elle'], 0, '« By + réfléchi » signifie « tout seul ».'],
            ['Comment dit-on « je me lève » ?', ['I get up.', 'I get up myself.', 'I myself get up.', 'I raise me.'], 0, 'Beaucoup de verbes pronominaux français ne le sont pas en anglais.'],
            ['Quel pronom réfléchi correspond à « we » ?', ['ourselves', 'ourself', 'us', 'ours'], 0, 'Le pluriel prend -selves.'],
            ['« They » ne peut désigner qu’un pluriel.', ['Vrai', 'Faux'], 1, 'Il sert aussi de pronom singulier neutre quand le genre est inconnu.'],
          ],
        },
        {
          titre: 'Les pronoms relatifs',
          axe: 'La phrase',
          lecon: {
            titre: 'Who, which, that, whose, where',
            cours: `Un pronom relatif relie deux propositions en évitant de répéter un nom.

## Le choix du pronom
| Le pronom | Son antécédent | Un exemple |
| **who** | Une **personne** | *the man who lives here* |
| **which** | Une **chose**, un animal | *the book which I bought* |
| **that** | Personne ou chose, en relative **déterminative** | *the book that I bought* |
| **whose** | La **possession** | *the girl whose father is a doctor* |
| **where** | Un **lieu** | *the town where I was born* |
| **when** | Un **temps** | *the day when we met* |

## Deux sortes de relatives
| La relative | Sa ponctuation | *that* y est-il possible | Le pronom peut-il sauter |
| **Déterminative** — indispensable au sens | **Sans** virgule | **Oui** | **Oui**, s'il est complément |
| **Explicative** — elle ajoute une information | **Entre virgules** | **Non** | **Jamais** |

*The man who lives next door is a doctor.* (déterminative)

*My brother, who lives in London, is a teacher.* (explicative)

## Le test de l'omission
| La fonction du relatif | Est-il obligatoire | Un exemple |
| **Sujet** de la relative | **Oui** | *the man who called* |
| **Complément** | **Non** | *the man (who) I called* |

## Le relatif et la préposition
| Le registre | Sa construction |
| **Courant** | La préposition à la **fin** : *the girl who I spoke to* |
| **Soutenu** | Elle remonte : *the girl to whom I spoke* |

## L'erreur du francophone
> Le relatif ne se traduit pas mot à mot : « que » peut donner *that*, *which*, *who*, ou **rien du tout**. C'est la **fonction** dans la relative qui décide, pas le mot français.`,
          },
          questions: [
            ['Quel pronom relatif emploie-t-on pour une personne ?', ['who', 'which', 'whose', 'where'], 0, '« The man who lives here. »'],
            ['Quel pronom relatif emploie-t-on pour une chose ?', ['which', 'who', 'whom', 'when'], 0, '« The book which I bought. »'],
            ['Quel pronom relatif exprime la possession ?', ['whose', 'who', 'which', 'that'], 0, '« The girl whose father is a doctor. »'],
            ['Quand le pronom relatif peut-il être omis ?', ['Quand il est complément dans une relative déterminative', 'Quand il est sujet', 'Dans une relative explicative', 'Jamais'], 0, '« The book (that) I bought. »'],
            ['Qu’est-ce qui distingue une relative explicative ?', ['Elle est entre virgules et ajoute une information non indispensable', 'Elle est indispensable au sens', 'Elle emploie toujours « that »', 'Elle se place en début de phrase'], 0, '« My brother, who lives in London, is a teacher. »'],
            ['Quel pronom est impossible dans une relative explicative ?', ['that', 'who', 'which', 'whose'], 0, 'Entre virgules, on emploie who ou which.'],
            ['Où se place la préposition en anglais courant ?', ['À la fin de la relative', 'Devant le pronom relatif', 'En début de phrase', 'Elle disparaît'], 0, '« The girl who I spoke to. »'],
            ['On peut omettre le pronom relatif quand il est sujet de la relative.', ['Vrai', 'Faux'], 1, 'Sujet, il est obligatoire ; complément, il peut sauter.'],
          ],
        },
        {
          titre: 'La phrase interrogative',
          axe: 'La phrase',
          lecon: {
            titre: 'Questions fermées, questions ouvertes',
            cours: `Deux sortes de questions, deux constructions.

## Les questions fermées
Réponse **yes / no**. On place l'**auxiliaire devant le sujet**.

| Le cas | Sa forme |
| Avec **be** | *Are you ready?* |
| Avec un auxiliaire déjà présent | *Have you finished?* / *Can you swim?* |
| Avec un **temps simple** | On introduit **do/does/did** : *Do you like it?* |

## Les questions ouvertes
mot interrogatif + auxiliaire + sujet + verbe

| Le mot interrogatif | Ce qu'il demande |
| **what** | Quoi |
| **who** | Qui |
| **where** | Où |
| **when** | Quand |
| **why** | Pourquoi |
| **how** | Comment |
| **which** | Lequel, dans un choix limité |
| **whose** | À qui |
| **how much / how many** | Combien |
| **how long / how often / how old / how far** | Durée, fréquence, âge, distance |

*Where do you live?* / *What did she say?* / *How long have you been here?*

## L'exception : le mot interrogatif est SUJET
Pas d'inversion, pas de **do** — l'ordre reste celui de l'affirmative.

| La question | La fonction de *who* | La construction |
| *Who broke the window?* | **Sujet** | Pas de do |
| *Who did you see?* | **Complément** | Avec do |

## La question indirecte
Après *I wonder*, *Do you know*, *Could you tell me*, la question **reprend l'ordre de l'affirmative**.

| La forme correcte | La forme fautive |
| *Do you know where he lives?* | where **does** he live |

> C'est le piège classique : dès que la question est enchâssée, elle cesse d'être une question **dans sa forme**.`,
          },
          questions: [
            ['Comment forme-t-on une question fermée avec un temps simple ?', ['En ajoutant do, does ou did devant le sujet', 'En inversant simplement le verbe et le sujet', 'En ajoutant « est-ce que »', 'En changeant l’intonation seulement'], 0, '« Do you like it? », « Did she come? »'],
            ['Quel est l’ordre dans une question ouverte ?', ['Mot interrogatif + auxiliaire + sujet + verbe', 'Mot interrogatif + sujet + auxiliaire + verbe', 'Auxiliaire + mot interrogatif + sujet', 'Sujet + mot interrogatif + verbe'], 0, '« Where do you live? »'],
            ['Que se passe-t-il quand « who » est sujet de la question ?', ['On n’emploie pas « do » et l’ordre reste celui de l’affirmative', 'On emploie « do » comme d’habitude', 'On inverse le sujet et le verbe', 'On ajoute « does » à la fin'], 0, '« Who broke the window? »'],
            ['Quelle question interroge sur une durée ?', ['How long have you been here?', 'How much time you are here?', 'How often are you here?', 'How far are you here?'], 0, '« How long » interroge sur la durée.'],
            ['Quel mot interrogatif suppose un choix limité ?', ['which', 'what', 'who', 'how'], 0, '« Which one do you prefer? »'],
            ['Quelle phrase est correcte ?', ['Do you know where he lives?', 'Do you know where does he live?', 'Do you know where lives he?', 'Do you know where he does live?'], 0, 'Une question indirecte reprend l’ordre de l’affirmative.'],
            ['Comment interroge-t-on sur la fréquence ?', ['How often do you go there?', 'How much do you go there?', 'How long do you go there?', 'How many do you go there?'], 0, '« How often » interroge sur la fréquence.'],
            ['« Who did break the window? » est la forme normale quand « who » est sujet.', ['Vrai', 'Faux'], 1, 'On dit « Who broke the window? » ; avec « did », ce serait une insistance.'],
          ],
        },
        {
          titre: 'Les question tags',
          axe: 'La phrase',
          lecon: {
            titre: 'N’est-ce pas ?',
            cours: `Un question tag est la courte question ajoutée en fin de phrase pour demander confirmation — l'équivalent du « n'est-ce pas ? ».

## La règle des trois points
| Le point | Sa règle |
| 1 | Le tag reprend l'**auxiliaire** de la phrase ; s'il n'y en a pas, on emploie **do / does / did** |
| 2 | Le tag est de **polarité inverse** |
| 3 | Le sujet est repris sous forme de **pronom** |

| La phrase | Son tag |
| **Affirmative** | **Négatif** : *You are French, aren't you?* |
| **Négative** | **Affirmatif** : *You aren't French, are you?* |

## Des exemples complets
| La phrase | Son tag |
| *She is a teacher* | *isn't she?* |
| *You can swim* | *can't you?* |
| *They didn't come* | *did they?* |
| *He has finished* | *hasn't he?* |
| *You like coffee* | *don't you?* |

## Les cas particuliers
| La phrase | Son tag |
| *I am…* | *aren't I?* — forme consacrée |
| *Let's…* | *shall we?* |
| Un **impératif** | *will you?* — *Close the door, will you?* |
| Sujet indéfini : somebody, nobody, everyone | Avec *they* : *Somebody called, didn't they?* |
| *There is / there are* | Il reprend **there** : *There is a problem, isn't there?* |

## L'intonation change le sens
| L'intonation | Ce qu'elle signifie |
| **Descendante** | On est sûr : on cherche l'accord |
| **Montante** | On doute vraiment : c'est une vraie question |

> Le tag ne s'invente pas : il se **déduit** mécaniquement. Auxiliaire, polarité inversée, pronom sujet — dans cet ordre.`,
          },
          questions: [
            ['Que reprend un question tag ?', ['L’auxiliaire de la phrase', 'Le verbe lexical', 'Le complément d’objet', 'L’adverbe'], 0, 'Sans auxiliaire, on emploie do, does ou did.'],
            ['Quel tag suit « You are French » ?', ['aren’t you?', 'are you?', 'don’t you?', 'isn’t it?'], 0, 'Phrase affirmative, tag négatif.'],
            ['Quel tag suit « They didn’t come » ?', ['did they?', 'didn’t they?', 'do they?', 'were they?'], 0, 'Phrase négative, tag affirmatif.'],
            ['Quel tag suit « Your sister lives here » ?', ['doesn’t she?', 'doesn’t it?', 'isn’t she?', 'don’t they?'], 0, 'Pas d’auxiliaire dans la phrase : on emploie « does », et le sujet devient un pronom.'],
            ['Quel tag suit « I am late » ?', ['aren’t I?', 'amn’t I?', 'am I not?', 'isn’t I?'], 0, '« Aren’t I » est la forme consacrée.'],
            ['Quel tag suit « Let’s go » ?', ['shall we?', 'will you?', 'don’t we?', 'do we?'], 0, 'Après un impératif, ce serait « will you? ».'],
            ['Quel tag suit « There is a problem » ?', ['isn’t there?', 'isn’t it?', 'aren’t they?', 'doesn’t it?'], 0, 'Le tag reprend « there » comme sujet.'],
            ['Un question tag reprend toujours la même polarité que la phrase.', ['Vrai', 'Faux'], 1, 'Il l’inverse : affirmative → tag négatif, et inversement.'],
          ],
        },
        {
          titre: 'La phrase exclamative',
          axe: 'La phrase',
          lecon: {
            titre: 'What et how',
            cours: `L'exclamation exprime la surprise, l'admiration ou l'indignation. Deux mots l'introduisent.

## La règle en une ligne
| Le mot | Ce qui le suit |
| **what** | Un **nom** |
| **how** | Un **adjectif** ou un **adverbe** |

## WHAT + groupe nominal
| Le nom | La construction | Un exemple |
| Singulier dénombrable | What **a / an** + (adjectif) + nom | *What a beautiful day!* |
| Pluriel ou indénombrable | What + (adjectif) + nom, **sans article** | *What terrible weather!* |

## HOW + adjectif ou adverbe
How + adjectif ou adverbe (+ sujet + verbe)

*How strange!* / *How beautiful this place is!* / *How fast he runs!*

## L'ordre des mots
> L'anglais **ne fait pas d'inversion** dans l'exclamation : le sujet reste devant le verbe. *How beautiful this place is!* — jamais « how beautiful is this place ».

## So et such, la même idée en phrase ordinaire
| La construction | Ce qui suit | Un exemple |
| **so** | Un adjectif ou un adverbe | *She is so kind!* |
| **such a** | Adjectif + nom **singulier** | *It was such a good film!* |
| **such** | Adjectif + nom pluriel ou indénombrable | *They are such nice people!* |

## Les exclamations toutes faites
| L'expression | Son sens |
| *What a pity!* / *What a shame!* | Quel dommage |
| *How come?* | Comment ça se fait ? |
| *No way!* | Pas question |
| *That's amazing!* | C'est incroyable |
| *Well done!* | Bravo |

## Le piège du francophone
| Ce qu'on veut dire | La forme correcte | La forme fautive |
| Comme c'est beau ! | *How beautiful it is!* ou *How beautiful!* | *How is it beautiful!* |`,
          },
          questions: [
            ['Quel mot introduit une exclamation devant un nom ?', ['what', 'how', 'so', 'such'], 0, '« What a beautiful day! »'],
            ['Quel mot introduit une exclamation devant un adjectif ?', ['how', 'what', 'such', 'that'], 0, '« How strange! »'],
            ['Quelle phrase est correcte ?', ['What beautiful flowers!', 'What a beautiful flowers!', 'How beautiful flowers!', 'What beautiful a flowers!'], 0, 'Pas d’article devant un pluriel.'],
            ['Quelle phrase est correcte ?', ['How beautiful this place is!', 'How beautiful is this place!', 'How is beautiful this place!', 'What beautiful is this place!'], 0, 'L’anglais ne fait pas d’inversion dans l’exclamation.'],
            ['Quelle construction suit « such » avec un nom singulier ?', ['such a + adjectif + nom', 'such + adjectif + nom', 'such the + nom', 'such of + nom'], 0, '« It was such a good film! »'],
            ['Quelle construction suit « so » ?', ['so + adjectif ou adverbe', 'so + nom', 'so a + nom', 'so + verbe'], 0, '« She is so kind! »'],
            ['Comment dit-on « Quel dommage ! » ?', ['What a pity!', 'How a pity!', 'What pity!', 'Such pity!'], 0, '« What a shame! » convient également.'],
            ['On dit « How beautiful is this place! » pour exclamer son admiration.', ['Vrai', 'Faux'], 1, 'Sans inversion : « How beautiful this place is! »'],
          ],
        },
        {
          titre: 'La voix passive',
          axe: 'La phrase',
          lecon: {
            titre: 'Quand l’action compte plus que l’auteur',
            cours: `À la voix **passive**, le sujet **subit** l’action au lieu de la faire.

## La formation
**be (au temps voulu) + participe passé**

| Temps | Actif | Passif |
|---|---|---|
| Présent | They **build** houses. | Houses **are built**. |
| Prétérit | They **built** it. | It **was built**. |
| Present perfect | They **have built** it. | It **has been built**. |
| Futur | They **will build** it. | It **will be built**. |
| Modal | They **can build** it. | It **can be built**. |

## La transformation
1. Le **complément d’objet** de l’actif devient **sujet** du passif.
2. Le verbe devient **be + participe passé**, au **même temps**.
3. L’ancien sujet, si on le mentionne, est introduit par **by**.

*Shakespeare **wrote** Hamlet.* → *Hamlet **was written by** Shakespeare.*

## Pourquoi l’employer
- l’auteur de l’action est **inconnu** : *My bike **was stolen**.* ;
- il est **évident** ou sans intérêt : *The shop **is closed** at six.* ;
- on veut mettre en avant **ce qui a été fait** : c’est pourquoi le passif abonde dans les textes scientifiques et les journaux.

> Le complément d’agent (**by** + auteur) est **omis dans la grande majorité** des phrases passives : s’il était intéressant, on aurait gardé l’actif.

## Le double passif
Un verbe à deux compléments (give, send, tell, offer) donne **deux** passifs possibles :
*They gave **me** **a prize**.* → *I **was given** a prize.* (le plus courant) ou *A prize **was given** to me.*

## L’erreur classique
Ne pas oublier **be** : *The window broken* est incomplet ; il faut *The window **was** broken*.`,
          },
          questions: [
            ['Comment se forme la voix passive ?', ['be + participe passé', 'have + participe passé', 'do + base verbale', 'be + verbe en -ING'], 0, '« It was built », « Houses are built ».'],
            ['Que devient le complément d’objet de la phrase active ?', ['Il devient sujet de la phrase passive', 'Il disparaît', 'Il devient complément d’agent', 'Il reste complément d’objet'], 0, '« They built it » devient « It was built ».'],
            ['Comment introduit-on l’auteur de l’action au passif ?', ['Par « by »', 'Par « from »', 'Par « with »', 'Par « of »'], 0, '« Hamlet was written by Shakespeare. »'],
            ['Quel est le passif de « They have built it » ?', ['It has been built.', 'It has built.', 'It was been built.', 'It is being built.'], 0, 'Le present perfect passif combine « has been » et le participe passé.'],
            ['Quel est le passif de « They can build it » ?', ['It can be built.', 'It can built.', 'It can been built.', 'It is can built.'], 0, 'Après un modal, « be » reste à la base verbale.'],
            ['Pourquoi emploie-t-on souvent le passif ?', ['Parce que l’auteur de l’action est inconnu ou sans intérêt', 'Parce qu’il est plus poli', 'Parce qu’il est plus court', 'Parce qu’il est obligatoire au passé'], 0, 'Le complément d’agent est omis dans la plupart des phrases passives.'],
            ['Quel est le passif le plus courant de « They gave me a prize » ?', ['I was given a prize.', 'A prize was given me.', 'Me was given a prize.', 'A prize gave me.'], 0, 'Avec un verbe à deux compléments, l’anglais préfère le passif de la personne.'],
            ['On peut écrire « The window broken by the storm » comme phrase complète.', ['Vrai', 'Faux'], 1, 'Il manque l’auxiliaire : « The window was broken by the storm ».'],
          ],
        },
        {
          titre: 'Le comparatif',
          axe: 'La phrase',
          lecon: {
            titre: 'Plus, moins, aussi',
            cours: `La forme du comparatif dépend de la longueur de l'adjectif.

## Le comparatif de supériorité
| L'adjectif | Sa construction | Un exemple |
| **Court** — une syllabe, ou deux en -y | adjectif + **-er** + than | tall → tall**er than** |
| Consonne finale doublée | — | big → big**ger than** |
| En **-y** | y → i | happy → happ**ier than** |
| **Long** — deux syllabes ou plus | **more** + adjectif + than | **more** expensive **than** |

## Les trois comparatifs
| Le comparatif | Sa construction | Un exemple |
| De **supériorité** | -er than, ou more … than | *taller than* |
| D'**infériorité** | **less** + adjectif + than | *less expensive than* |
| D'**égalité** | **as** + adjectif + **as** | *She is as tall as her brother* |
| Égalité **négative** | **not as / so** + adjectif + as | *He is not as fast as you* |

## Les irréguliers, à connaître par cœur
| L'adjectif | Son comparatif |
| good | **better than** |
| bad | **worse than** |
| far | **farther / further than** |
| little | **less than** |
| much / many | **more than** |

## Le comparatif avec un nom
| Le nom | Plus | Moins |
| **Dénombrable** | more books | **fewer** books |
| **Indénombrable** | more money | **less** money |

## Deux structures utiles
| La structure | Son exemple |
| De plus en plus | *bigger and bigger*, *more and more expensive* |
| Plus… plus… | *The more you practise, the better you get* |

> L'erreur la plus fréquente est de cumuler les deux marques : *more taller* est faux. Un adjectif ne prend **jamais** *-er* et *more* à la fois.`,
          },
          questions: [
            ['Comment forme-t-on le comparatif d’un adjectif court ?', ['adjectif + -er + than', 'more + adjectif + than', 'as + adjectif + as', 'the + adjectif + -est'], 0, '« Taller than », « bigger than ».'],
            ['Comment forme-t-on le comparatif d’un adjectif long ?', ['more + adjectif + than', 'adjectif + -er + than', 'adjectif + -est', 'less + adjectif'], 0, '« More expensive than ».'],
            ['Quel est le comparatif de « good » ?', ['better', 'gooder', 'more good', 'best'], 0, 'C’est l’irrégulier le plus fréquent.'],
            ['Quel est le comparatif de « bad » ?', ['worse', 'badder', 'more bad', 'worst'], 0, '« Worst » est le superlatif.'],
            ['Comment exprime-t-on l’égalité ?', ['as + adjectif + as', 'so + adjectif + than', 'more + adjectif + as', 'the same + adjectif'], 0, '« She is as tall as her brother. »'],
            ['Quel comparatif emploie-t-on avec un nom dénombrable pour dire « moins de » ?', ['fewer', 'less', 'least', 'lesser'], 0, '« Less » s’emploie avec les indénombrables : less money, fewer books.'],
            ['Comment dit-on « de plus en plus cher » ?', ['more and more expensive', 'more expensive and more', 'expensiver and expensiver', 'the more expensive'], 0, 'Avec un adjectif court : « bigger and bigger ».'],
            ['On peut dire « more taller than » pour insister.', ['Vrai', 'Faux'], 1, 'Un adjectif ne prend jamais -er et « more » à la fois.'],
          ],
        },
        {
          titre: 'Le superlatif',
          axe: 'La phrase',
          lecon: {
            titre: 'Le plus, le moins',
            cours: `Le superlatif désigne l'élément qui l'emporte sur tous les autres.

## La formation
| L'adjectif | Sa construction | Un exemple |
| **Court** | **the** + adjectif + **-est** | **the** tall**est**, **the** big**gest**, **the** happ**iest** |
| **Long** | **the most** + adjectif | **the most** expensive |
| Infériorité | **the least** + adjectif | the least expensive |

> **L'article « the » est obligatoire** devant un superlatif : c'est l'oubli le plus fréquent.

## Les irréguliers
| L'adjectif | Son superlatif |
| good | **the best** |
| bad | **the worst** |
| far | **the farthest / the furthest** |
| little | **the least** |
| much / many | **the most** |

## Ce qui suit le superlatif
| La préposition | Ce qu'elle introduit | Un exemple |
| **in** | Un **lieu** ou un groupe | *the tallest boy in the class* |
| **of** | Un **ensemble** ou une période | *the coldest day of the year* |
| Une relative au **present perfect** | Une expérience | *the best film I have ever seen* |

## Comparatif ou superlatif
| Le nombre d'éléments comparés | La forme | Un exemple |
| **Deux** | Le **comparatif** | *He is the taller of the two* |
| **Trois ou plus** | Le **superlatif** | *He is the tallest of the three* |

## Avec un nom
*the most books*, *the least money*, *the fewest mistakes*

## L'erreur classique
> On ne cumule jamais les deux marques : *the most tallest* est faux, comme *more taller* au comparatif.`,
          },
          questions: [
            ['Comment forme-t-on le superlatif d’un adjectif court ?', ['the + adjectif + -est', 'the most + adjectif', 'adjectif + -er + than', 'as + adjectif + as'], 0, '« The tallest », « the biggest ».'],
            ['Comment forme-t-on le superlatif d’un adjectif long ?', ['the most + adjectif', 'the + adjectif + -est', 'more + adjectif + than', 'the more + adjectif'], 0, '« The most expensive ».'],
            ['Quel article accompagne obligatoirement le superlatif ?', ['the', 'a', 'an', 'aucun'], 0, 'C’est l’oubli le plus fréquent.'],
            ['Quel est le superlatif de « good » ?', ['the best', 'the goodest', 'the most good', 'the better'], 0, '« Better » est le comparatif.'],
            ['Quelle préposition suit un superlatif devant un lieu ?', ['in', 'of', 'at', 'from'], 0, '« The tallest boy in the class. »'],
            ['Quel temps emploie-t-on dans « the best film I have ever seen » ?', ['Le present perfect', 'Le prétérit', 'Le présent simple', 'Le past perfect'], 0, 'La relative après un superlatif se met au present perfect.'],
            ['Que faut-il employer pour comparer seulement deux éléments ?', ['Le comparatif', 'Le superlatif', 'L’égalité', 'Le comparatif d’infériorité obligatoirement'], 0, '« He is the taller of the two. »'],
            ['« The most tallest » est une forme correcte d’insistance.', ['Vrai', 'Faux'], 1, 'On ne cumule jamais « most » et « -est ».'],
          ],
        },
        {
          titre: 'Exprimer l’habitude',
          axe: 'La phrase',
          lecon: {
            titre: 'Aujourd’hui, autrefois, et ce à quoi on s’habitue',
            cours: `Trois moments, trois structures — souvent confondues parce qu’elles emploient toutes le mot *used*.

## L’habitude présente : le présent simple
*I **go** to school by bus.* / *She **plays** tennis every Saturday.*
Avec les adverbes de fréquence : **always, usually, often, sometimes, rarely, never**, placés **avant** le verbe lexical et **après** *be* ou l’auxiliaire.

## L’habitude passée : USED TO
**used to + base verbale** — une habitude passée **révolue** :
*I **used to** play football.* (avant, plus maintenant)
- négation : *I **didn’t use to** like it* (sans -d après *did*) ;
- question : ***Did** you **use to** live here?*

**WOULD** exprime aussi une habitude passée, mais seulement pour des **actions répétées**, jamais pour un état :
*Every summer, we **would go** to the beach.*
> *I would be shy* est faux : pour un état, seul *used to* convient — *I **used to** be shy.*

## S’habituer : BE / GET USED TO
**be used to + nom ou verbe en -ING** = être habitué à
*I **am used to getting** up early.*
**get used to** = s’habituer progressivement
*She **is getting used to** her new school.*

## Le tableau qui range tout
| Sens | Structure | Suite |
|---|---|---|
| Habitude passée révolue | used to | **base verbale** |
| Être habitué à | be used to | **-ING** ou nom |
| S’habituer à | get used to | **-ING** ou nom |

> Le piège tient en un mot : après *used to* (habitude passée), **base verbale** ; après *be/get used to* (habitude acquise), **-ING**. *I used to **swim*** contre *I am used to **swimming***.`,
          },
          questions: [
            ['Quel temps exprime une habitude présente ?', ['Le présent simple', 'Le présent en BE + -ING', 'Le present perfect', 'Le prétérit'], 0, '« I go to school by bus. »'],
            ['Que signifie « I used to play football » ?', ['Je jouais autrefois, ce n’est plus le cas', 'J’ai l’habitude de jouer', 'Je m’habitue à jouer', 'Je joue chaque semaine'], 0, '« Used to » marque une habitude passée révolue.'],
            ['Quelle forme suit « used to » au sens d’habitude passée ?', ['La base verbale', 'Le verbe en -ING', 'Le participe passé', 'to + verbe'], 0, '« I used to swim. »'],
            ['Quelle forme suit « be used to » ?', ['Le verbe en -ING ou un nom', 'La base verbale', 'Le participe passé', 'Le prétérit'], 0, '« I am used to getting up early. »'],
            ['Que signifie « She is getting used to her new school » ?', ['Elle s’habitue progressivement à sa nouvelle école', 'Elle avait l’habitude d’y aller', 'Elle y allait autrefois', 'Elle est obligée d’y aller'], 0, '« Get used to » marque l’habitude en train de se prendre.'],
            ['Quelle est la forme négative de « used to » ?', ['I didn’t use to like it.', 'I didn’t used to like it.', 'I usedn’t like it.', 'I not used to like it.'], 0, 'Après « did », le verbe revient à la base verbale.'],
            ['Quand peut-on employer « would » pour une habitude passée ?', ['Pour des actions répétées, jamais pour un état', 'Pour tous les cas', 'Uniquement pour les états', 'Uniquement au négatif'], 0, '« I would be shy » est faux : il faut « I used to be shy ».'],
            ['« I am used to swim » est une phrase correcte.', ['Vrai', 'Faux'], 1, 'Après « be used to », le verbe se met en -ING : « I am used to swimming ».'],
          ],
        },
        {
          titre: 'Exprimer le but',
          axe: 'La phrase',
          lecon: {
            titre: 'To, in order to, so that',
            cours: `Dire pourquoi on fait quelque chose se construit de trois façons — et jamais avec for + verbe.

## Les trois constructions
| La forme | Son registre | Sa condition |
| **to** + base verbale | Courante | Même sujet dans les deux propositions |
| **in order to / so as to** | **Formelle** | Même sujet |
| **so that** + proposition | Toute | Le but concerne **un autre sujet** |

## TO + base verbale
*I went to the shop to buy bread.* / *She works hard to succeed.*

## IN ORDER TO / SO AS TO
| L'emploi | Un exemple |
| Le but, avec insistance | *He left early in order to catch the train* |
| Le but **négatif** — la seule forme possible | *I wrote it down so as not to forget* |

## SO THAT + proposition
Quand le but concerne un **autre sujet**, il faut une proposition complète.

*I'll speak slowly so that you can understand.*

*She saved money so that her son could study abroad.*

> Le verbe de la subordonnée porte souvent un modal : **can / could / will / would**.

## FOR : deux emplois, jamais avec un verbe conjugué
| La construction | Son sens | Un exemple |
| **for** + **nom** | Aller chercher | *I went to the shop for bread* |
| **for** + **-ING** | À quoi sert un objet | *This knife is for cutting bread* |

> **Attention :** *I went to the shop for buying bread* est faux. C'est l'erreur la plus fréquente du chapitre : pour le but d'une action, l'anglais emploie **to + base verbale**.

## Interroger sur le but
| La question | Un exemple |
| *What… for?* | *What did you do that for?* |
| *Why?* | La réponse commence souvent par *To…* : *Why did you call? — To ask you something* |`,
          },
          questions: [
            ['Comment exprime-t-on simplement le but d’une action ?', ['to + base verbale', 'for + verbe en -ING', 'for + base verbale', 'so + base verbale'], 0, '« I went to the shop to buy bread. »'],
            ['Quelle phrase est correcte ?', ['I went to the shop to buy bread.', 'I went to the shop for buying bread.', 'I went to the shop for buy bread.', 'I went to the shop buying bread.'], 0, 'C’est l’erreur la plus fréquente du chapitre.'],
            ['Quelle structure emploie-t-on quand le but concerne un autre sujet ?', ['so that + proposition', 'to + base verbale', 'for + nom', 'in order to + verbe'], 0, '« I’ll speak slowly so that you can understand. »'],
            ['Comment exprime-t-on un but négatif ?', ['so as not to / in order not to + base verbale', 'not to + base verbale seul', 'for not + -ING', 'so that not'], 0, '« I wrote it down so as not to forget. »'],
            ['Quel verbe accompagne souvent « so that » dans la subordonnée ?', ['Un modal comme can, could, will ou would', 'Toujours le prétérit', 'Toujours le present perfect', 'Aucun verbe'], 0, '« So that her son could study abroad. »'],
            ['Dans quel cas emploie-t-on « for » ?', ['Devant un nom, ou devant -ING pour dire à quoi sert un objet', 'Devant une base verbale', 'Devant un participe passé', 'Jamais'], 0, '« This knife is for cutting bread. »'],
            ['Comment interroge-t-on sur le but ?', ['What did you do that for?', 'For what you did that?', 'What for you did that?', 'Why for did you do that?'], 0, '« Why? » convient également.'],
            ['« In order to » est plus formel que « to » seul.', ['Vrai', 'Faux'], 0, 'Il insiste davantage sur l’intention, comme « so as to ».'],
          ],
        },
        {
          titre: 'Exprimer la durée',
          axe: 'La phrase',
          lecon: {
            titre: 'For, since, ago, how long',
            cours: `Trois mots que le français rend souvent par « depuis », et qui ne s’emploient pas au même endroit.

## FOR — une durée
**for + durée** : for two hours, for a week, for a long time, for ages.
*I have lived here **for** five years.*
Il s’emploie à tous les temps : *I worked there **for** two years* (fini), *I have worked here **for** two years* (toujours en cours).

## SINCE — un point de départ
**since + moment précis** : since Monday, since 2020, since I was ten, since this morning.
*She has worked here **since** 2020.*
**Since s’emploie presque toujours avec le present perfect** : il relie un point du passé au présent.

## AGO — une distance dans le passé
**durée + ago**, à la fin du groupe, et **toujours avec le prétérit** :
*I met him three years **ago**.* — jamais *I have met him three years ago*.

## Interroger
- ***How long** have you been here?* (durée d’une situation en cours)
- ***When** did you arrive?* (moment précis)

## Le tableau
| Mot | Suivi de | Temps |
|---|---|---|
| for | une durée | tous |
| since | un point de départ | present perfect |
| ago | une durée, placée après | prétérit |

## Deux autres outils
- **it’s been … since** : *It**’s been** two years **since** I saw him.*
- **during + nom** : *during the holidays* — jamais *during two hours*, qui doit devenir *for two hours*.

> Le test le plus sûr : peut-on répondre « **combien de temps ?** » → *for*. Peut-on répondre « **depuis quand ?** » → *since*.`,
          },
          questions: [
            ['Quelle préposition introduit une durée ?', ['for', 'since', 'ago', 'during'], 0, '« For five years », « for a long time ».'],
            ['Quelle préposition introduit un point de départ ?', ['since', 'for', 'ago', 'from'], 0, '« Since 2020 », « since Monday ».'],
            ['Avec quel temps s’emploie « ago » ?', ['Le prétérit', 'Le present perfect', 'Le présent', 'Le past perfect'], 0, '« I met him three years ago. »'],
            ['Où se place « ago » ?', ['Après la durée', 'Avant la durée', 'En début de phrase', 'Après le verbe'], 0, '« Three years ago », jamais « ago three years ».'],
            ['Avec quel temps s’emploie « since » ?', ['Le present perfect', 'Le prétérit', 'Le futur', 'Le présent simple'], 0, 'Il relie un point du passé au présent.'],
            ['Comment interroge-t-on sur la durée d’une situation en cours ?', ['How long have you been here?', 'When did you arrive here?', 'How much are you here?', 'Since when you are here?'], 0, '« How long » appelle une réponse en « for » ou « since ».'],
            ['Quelle phrase est correcte ?', ['I waited for two hours.', 'I waited during two hours.', 'I waited since two hours.', 'I waited two hours ago for the bus arrival.'], 0, '« During » se construit avec un nom, pas avec une durée chiffrée.'],
            ['On peut dire « I have met him three years ago ».', ['Vrai', 'Faux'], 1, '« Ago » impose le prétérit : « I met him three years ago ».'],
          ],
        },
        {
          titre: 'Le discours indirect',
          axe: 'La phrase',
          lecon: {
            titre: 'Rapporter les paroles de quelqu’un',
            cours: `Le **discours indirect** rapporte des paroles sans les citer. Trois choses changent : le **temps**, les **pronoms**, les **repères**.

## Le recul des temps
Quand le verbe introducteur est au passé (*said, told*), chaque temps recule d’un cran :
| Direct | Indirect |
|---|---|
| présent simple | prétérit |
| présent en BE + -ING | prétérit en BE + -ING |
| prétérit | past perfect |
| present perfect | past perfect |
| will | would |
| can | could |
| must | had to |

*« I **am** tired. » → He said he **was** tired.*
*« I **saw** her. » → He said he **had seen** her.*

## Les pronoms et les possessifs
Ils s’adaptent au nouveau locuteur : *« **I** lost **my** keys. » → He said **he** had lost **his** keys.*

## Les repères de temps et de lieu
now → then · today → that day · tomorrow → the next day · yesterday → the day before · here → there · this → that.

## SAY ou TELL
- **say** ne prend pas de complément de personne : *He **said** (that) he was tired.*
- **tell** en exige un : *He **told me** (that) he was tired.*

## Les questions rapportées
Elles **reprennent l’ordre de l’affirmative**, sans auxiliaire déplacé :
- question ouverte : *« Where do you live? » → He asked me **where I lived**.*
- question fermée : on emploie **if** ou **whether** — *« Are you ready? » → He asked me **if I was ready**.*

## Les ordres rapportés
**tell / ask + complément + to + base verbale** :
*« Close the door. » → She told me **to close** the door.*
*« Don’t be late. » → She told me **not to be** late.*

> Le recul des temps ne s’applique **pas** quand le verbe introducteur est au présent (*He says he is tired*) ni quand le fait rapporté est toujours vrai.`,
          },
          questions: [
            ['Que devient un présent simple au discours indirect après « he said » ?', ['Un prétérit', 'Un present perfect', 'Un past perfect', 'Il ne change pas'], 0, '« I am tired » devient « He said he was tired ».'],
            ['Que devient un prétérit au discours indirect ?', ['Un past perfect', 'Un present perfect', 'Un présent', 'Un conditionnel'], 0, '« I saw her » devient « He said he had seen her ».'],
            ['Que devient « will » au discours indirect ?', ['would', 'will', 'shall', 'was going'], 0, 'Comme « can » devient « could » et « must » devient « had to ».'],
            ['Quelle est la différence entre « say » et « tell » ?', ['« Tell » exige un complément de personne, pas « say »', '« Say » exige un complément de personne', 'Les deux sont interchangeables', '« Tell » ne s’emploie qu’au présent'], 0, '« He told me » contre « He said (that) ».'],
            ['Comment rapporte-t-on une question fermée ?', ['Avec « if » ou « whether »', 'Avec « that »', 'Avec « what »', 'En gardant l’inversion'], 0, '« He asked me if I was ready. »'],
            ['Quel est l’ordre des mots dans une question rapportée ?', ['Celui de l’affirmative', 'Celui de l’interrogative, avec inversion', 'Le verbe en premier', 'Le complément en premier'], 0, '« He asked me where I lived », pas « where did I live ».'],
            ['Comment rapporte-t-on un ordre ?', ['tell + complément + to + base verbale', 'tell + that + proposition', 'say + to + base verbale', 'ask + if + proposition'], 0, '« She told me to close the door. »'],
            ['Le recul des temps s’applique même quand le verbe introducteur est au présent.', ['Vrai', 'Faux'], 1, '« He says he is tired » garde le présent.'],
          ],
        },
      ],
    },
  ],
}
