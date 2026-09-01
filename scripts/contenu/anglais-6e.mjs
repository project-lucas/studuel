// Anglais — Sixième : LE PROGRAMME DE LANGUE (21 fiches).
//
// LE DÉFAUT. L'anglais de 6e n'avait que CINQ chapitres hérités du premier jeu
// de données (« Se présenter et parler de soi », « Present simple : routines »,
// « La famille et les animaux », « L'école en pays anglophone », « Fêtes et
// traditions ») — et cinq leçons « Exercices types » sans aucun quiz derrière
// (migration 331). Maigre ET trouée : avec l'histoire-géo de 4e, c'était l'un
// des deux seuls points du tronc commun dans ce cas.
//
// ⚠️ POURQUOI ON N'IMPORTE PAS LES 41 FICHES DE LA 4e. C'est la question qu'il
// faut se poser, parce que le dépôt le fait partout ailleurs : anglais 4e = 3e,
// espagnol 5e = 3e, allemand 2de = Tle. La raison de ces imports est écrite
// dans le README de scripts/contenu — le BO rédige les langues vivantes pour le
// CYCLE 4 tout entier, et la grammaire y est la même d'une année à l'autre.
//
// La 6e n'est pas dans le cycle 4. Elle appartient au CYCLE 3, avec l'école
// élémentaire, et son objectif est le niveau A1 : se présenter, décrire,
// raconter au présent. Les 41 fiches de 4e contiennent le present perfect, le
// past perfect, la voix passive, le discours indirect et le conditionnel —
// mettre ça devant un élève de onze ans ne l'aiderait pas, ça l'éteindrait.
//
// On garde donc la STRUCTURE des modules de langue (4 chapitres : le groupe
// nominal, le groupe verbal, les temps, la phrase), qui rend les niveaux
// comparables, et on écrit le contenu au niveau du cycle 3.
//
// ⚠️ Le slug `anglais` porte plusieurs modules (Tle = 226, 1re = 266,
// 2de = 286, 3e = 298, 4e/5e = 304/311, celui-ci = 6e) : ne JAMAIS générer avec
// `--slugs anglais`. Toujours `--modules anglais-6e`.

export default {
  slug: 'anglais',
  nom: 'Anglais',

  titreMigration: 'ANGLAIS 6e — LE PROGRAMME DE LANGUE (21 fiches)',

  motif: `CONSTAT : l'anglais de 6e n'avait que les 5 fiches du premier jeu de données, et
cinq de ses leçons « Exercices types » n'avaient aucun quiz (traité par la 331).
Maigre ET trouée : avec l'histoire-géo de 4e, l'un des deux seuls points du tronc
commun dans ce cas, donc l'un des deux plus dangereux de l'app.
Cette migration installe 21 fiches rangées sous les 4 chapitres de langue (le
groupe nominal, le groupe verbal, les temps, la phrase) et retire les 5 fiches
génériques.
ÉCRIT, PAS IMPORTÉ DE LA 4e, et c'est un choix : le dépôt importe les langues
d'un niveau à l'autre parce que le BO les rédige pour le CYCLE 4 entier. La 6e
relève du CYCLE 3 et vise le niveau A1. Les 41 fiches de 4e portent le present
perfect, le past perfect, la voix passive et le discours indirect — devant un
élève de onze ans, ce n'est pas de l'avance, c'est un mur.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit : ce
module range ses 21 fiches sous 4 chapitres, et l'INSERT écrit la colonne. Elle
est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que
la 234 soit passée en production — sans cette reprise, la migration échouerait
sur "column chapters.theme does not exist", les 5 anciens chapitres déjà
supprimés et les 21 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités partent, au niveau 6e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : le critère « pas de chapitre de
programme » vise exactement les cinq lignes voulues. Elles datent d'avant la
colonne theme, tandis que les 21 fiches neuves en portent une dès l'INSERT — le
ménage tourne AVANT les insertions et ne peut donc jamais mordre sur elles, ni
au premier passage ni au rejeu.
Le filtre level = '6e' est indispensable : l'anglais existe sur sept niveaux, et
la 4e comme la 3e ont leurs propres migrations.
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
   AND s.slug = 'anglais'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = '6e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['6e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Le groupe nominal (6)
        // ===================================================================
        {
          titre: 'Les noms et le pluriel',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Ajouter un -s, sauf quand il ne faut pas',
            cours: `Le pluriel anglais s’écrit presque toujours avec un -s. Ce sont les « presque » qu’il faut connaître.

## La règle générale
= a cat → two cats · a book → three books

## Les cas particuliers
| Le nom finit par… | On ajoute | Exemples |
| **-s, -ss, -sh, -ch, -x** | **-es** | *a bus → buses*, *a box → boxes*, *a watch → watches* |
| **consonne + y** | **-ies** | *a city → cities*, *a baby → babies* |
| **voyelle + y** | **-s** seulement | *a boy → boys*, *a day → days* |
| **-f / -fe** | souvent **-ves** | *a knife → knives*, *a leaf → leaves* |

## Les pluriels irréguliers
| Singulier | Pluriel |
| a man | **men** |
| a woman | **women** |
| a child | **children** |
| a foot | **feet** |
| a tooth | **teeth** |
| a mouse | **mice** |
| a person | **people** |

Certains ne changent pas : *a sheep → sheep*, *a fish → fish*.

## Dénombrables et indénombrables
| Le nom | Ce qu’il accepte | Exemples |
| **Countable** | Un pluriel, et *a/an* | *an apple, two apples* |
| **Uncountable** | **Ni pluriel, ni a/an** | *water*, *money*, *bread*, *information*, *homework* |

On dit *some water*, **jamais** « a water ».

!> ***Information*** et ***homework*** sont **indénombrables** en anglais, alors que « des informations » et « des devoirs » se disent au **pluriel** en français. C’est le piège classique du chapitre.

## La prononciation du -s final
| Le son | Après quoi | Exemple |
| **/s/** | p, t, k, f | *cats* |
| **/z/** | Une sonore ou une voyelle | *dogs* |
| **/ɪz/** | Un sifflement | *buses*, *watches* |`,
          },
          questions: [
            ['Quel est le pluriel de « a box » ?', ['boxes', 'boxs', 'boxies', 'box'], 0, 'Les noms en -x prennent -es.'],
            ['Quel est le pluriel de « a city » ?', ['cities', 'citys', 'cityes', 'city'], 0, 'Consonne + y → -ies.'],
            ['Quel est le pluriel de « a boy » ?', ['boys', 'boies', 'boyes', 'boy'], 0, 'Voyelle + y : le y reste.'],
            ['Quel est le pluriel de « a child » ?', ['children', 'childs', 'childes', 'childrens'], 0, 'C’est un pluriel irrégulier.'],
            ['Quel est le pluriel de « a foot » ?', ['feet', 'foots', 'feets', 'footes'], 0, 'Comme tooth → teeth.'],
            ['Comment dit-on « des informations » ?', ['some information', 'some informations', 'an information', 'informations'], 0, '« Information » est indénombrable en anglais.'],
            ['Quel est le pluriel de « a knife » ?', ['knives', 'knifes', 'knifies', 'knife'], 0, 'Les noms en -f / -fe font souvent -ves.'],
            ['« A sheep » a le même pluriel qu’au singulier.', ['Vrai', 'Faux'], 0, 'Comme « fish ».'],
          ],
        },
        {
          titre: 'Les articles : a, an, the',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Un, une, le, la — et le zéro',
            cours: `Le choix entre a et an dépend du SON qui suit, pas de la lettre.

## L’article indéfini : a / an
Il correspond à « un / une », et ne s’emploie qu’au **singulier dénombrable**.

| On écrit | Devant | Exemples |
| **a** | Un **son** de consonne | *a book*, *a car*, *a university* (on entend « you ») |
| **an** | Un **son** de voyelle | *an apple*, *an orange*, *an hour* (le h ne se prononce pas) |

!> *A university* mais *an hour* : la lettre dit une chose, le son en dit une autre. **C’est toujours le son qui décide.**

## L’article défini : the
Pour quelque chose de **précis** ou de **déjà connu**, au singulier comme au pluriel.

~ I have A dog. → THE dog is black.

> D’abord on **présente**, ensuite on **désigne**.

Il se prononce **/ðə/** devant une consonne et **/ði/** devant une voyelle.

## L’article zéro — quand on ne met rien
| Devant… | Exemple |
| Les **généralités** au pluriel | *Cats are independent.* (Les chats sont indépendants) |
| Les **indénombrables** en général | *I like music.* |
| Les **pays**, **villes**, **langues** | *France*, *London*, *English* |
| Les **repas**, **sports**, **matières** | *at breakfast*, *play tennis*, *study maths* |
| *school, home, work, bed* dans leur fonction | *go to school*, *at home* |

!> C’est la différence la plus visible avec le français, qui met un article partout : « **les** chats », « **la** France », « **le** tennis ».

## Les exceptions à connaître
= the United States · the United Kingdom · the Netherlands

Des noms de pays au pluriel ou contenant un nom commun.`,
          },
          questions: [
            ['Quel article place-t-on devant « apple » ?', ['an', 'a', 'the seulement', 'aucun'], 0, 'Devant un son de voyelle.'],
            ['Quel article place-t-on devant « university » ?', ['a', 'an', 'the obligatoirement', 'aucun'], 0, 'On entend « you », donc un son de consonne.'],
            ['Quel article place-t-on devant « hour » ?', ['an', 'a', 'the', 'aucun'], 0, 'Le h ne se prononce pas : on entend une voyelle.'],
            ['Comment traduit-on « Les chats sont indépendants » ?', ['Cats are independent.', 'The cats are independent.', 'A cats are independent.', 'The cat are independent.'], 0, 'Pas d’article pour une généralité au pluriel.'],
            ['Comment dit-on « J’aime la musique » ?', ['I like music.', 'I like the music.', 'I like a music.', 'I like musics.'], 0, 'Pas d’article devant un indénombrable pris en général.'],
            ['Comment dit-on « aller à l’école » ?', ['go to school', 'go to the school', 'go to a school', 'go school'], 0, 'Article zéro devant school pris dans sa fonction.'],
            ['Quel pays prend l’article « the » ?', ['the United States', 'France', 'Spain', 'Italy'], 0, 'Comme the United Kingdom et the Netherlands.'],
            ['On choisit entre « a » et « an » d’après la première lettre du mot.', ['Vrai', 'Faux'], 1, 'C’est le SON qui décide, pas la lettre.'],
          ],
        },
        {
          titre: 'Les démonstratifs : this, that, these, those',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Ici et là-bas, un et plusieurs',
            cours: `Le français dit « ce, cette, ces ». L’anglais demande deux décisions à chaque fois.

## Le tableau complet
| | Proche (ici) | Éloigné (là-bas) |
| **Singulier** | **this** | **that** |
| **Pluriel** | **these** | **those** |

= This book is mine · That car is red · These shoes are new · Those birds are big

## Deux critères, pas un
~ Proche ou éloigné ? → Singulier ou pluriel ? → le bon mot

## La prononciation, le vrai piège
!> **this** /ðɪs/ est **court**, **these** /ðiːz/ est **long**. C’est le seul indice à l’oral : les confondre change le **nombre**.

## Les emplois particuliers
| La situation | Ce qu’on dit |
| Au **téléphone** | *Hello, **this** is Tom.* (c’est Tom à l’appareil) |
| Pour **présenter quelqu’un** | *This is my sister.* |
| Dans le **temps** | *this morning*, *these days*, *that day* |

## Sans nom derrière
Les démonstratifs peuvent s’employer seuls, comme **pronoms**.

= What’s this? — That’s my bag.

> En français on ajoute souvent « -ci » ou « -là » ; en anglais, l’information est **déjà dans le mot**.`,
          },
          questions: [
            ['Quel démonstratif pour un objet proche au singulier ?', ['this', 'that', 'these', 'those'], 0, 'Proche + singulier.'],
            ['Quel démonstratif pour des objets éloignés au pluriel ?', ['those', 'these', 'that', 'this'], 0, 'Éloigné + pluriel.'],
            ['Comment traduit-on « Ces chaussures-ci sont neuves » ?', ['These shoes are new.', 'This shoes are new.', 'Those shoes are new.', 'That shoes are new.'], 0, 'Proche et pluriel.'],
            ['Que dit-on au téléphone pour se présenter ?', ['This is Tom.', 'That is Tom.', 'These is Tom.', 'It is Tom here.'], 0, 'C’est un emploi figé de « this ».'],
            ['Quelles sont les deux questions à se poser avant de choisir ?', ['Proche ou éloigné, singulier ou pluriel', 'Masculin ou féminin', 'Sujet ou complément', 'Compté ou non compté'], 0, 'Le français ne distingue que rarement la distance.'],
            ['Comment traduit-on « ce matin » ?', ['this morning', 'that morning', 'these morning', 'those morning'], 0, 'Le démonstratif sert aussi au temps.'],
            ['Quelle différence de prononciation entre « this » et « these » ?', ['« this » est court, « these » est long', 'Ils se prononcent pareil', '« this » est long', 'Seule l’écriture change'], 0, 'À l’oral, c’est le seul indice du nombre.'],
            ['Un démonstratif doit toujours être suivi d’un nom.', ['Vrai', 'Faux'], 1, 'Il peut s’employer seul : « What’s this? »'],
          ],
        },
        {
          titre: 'Exprimer la possession',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Le génitif et les possessifs',
            cours: `En anglais, le possessif s’accorde avec le POSSESSEUR, pas avec l’objet. C’est l’erreur numéro un des francophones.

## Le génitif : ’s
Pour dire « le … de … » avec un **possesseur humain** ou animé, l’anglais **inverse** l’ordre du français.

= Paul’s bike = le vélo DE Paul

~ Possesseur → ’s → objet possédé

| Le cas | Ce qu’on écrit | Exemple |
| Pluriel **déjà en -s** | Seulement l’apostrophe | *my parents’ car* |
| Pluriel **irrégulier** | On garde ’s | *the children’s room* |

## Pour les choses : of
= the door OF the house · the end OF the film

## Les adjectifs possessifs
Ils se placent **devant le nom** et ne s’accordent **jamais** avec lui.

| Personne | Adjectif |
| I | **my** |
| you | **your** |
| he | **his** |
| she | **her** |
| it | **its** |
| we | **our** |
| they | **their** |

!> « Sa voiture » se dit ***his car*** si le possesseur est un garçon, ***her car*** si c’est une fille. Le genre de la voiture ne compte pas — seul compte celui de la personne.

= his sister = sa sœur (à lui) · her brother = son frère (à elle)

## Les pronoms possessifs
Ils remplacent le groupe entier, **sans nom derrière** : **mine, yours, his, hers, ours, theirs**.

= This book is mine (= my book)

## Le piège its / it’s
| L’écriture | Ce que c’est |
| **its** | Son, sa — le **possessif** |
| **it’s** | *it is* |`,
          },
          questions: [
            ['Comment dit-on « le vélo de Paul » ?', ['Paul’s bike', 'the bike of Paul', 'bike Paul’s', 'Paul bike'], 0, 'Possesseur + ’s + objet possédé.'],
            ['Comment dit-on « la voiture de mes parents » ?', ['my parents’ car', 'my parents’s car', 'the car of my parents', 'my parent’s car'], 0, 'Pluriel déjà en -s : apostrophe seule.'],
            ['Comment traduit-on « la porte de la maison » ?', ['the door of the house', 'the house’s door obligatoirement', 'the house door’s', 'door of house'], 0, 'Pour un objet inanimé, on préfère « of ».'],
            ['Comment dit-on « sa voiture » en parlant d’une fille ?', ['her car', 'his car', 'its car', 'their car'], 0, 'Le possessif s’accorde avec le possesseur.'],
            ['Avec quoi s’accorde l’adjectif possessif anglais ?', ['Avec le possesseur', 'Avec l’objet possédé', 'Avec le verbe', 'Il ne s’accorde jamais'], 0, 'C’est l’erreur numéro un des francophones.'],
            ['Comment dit-on « la chambre des enfants » ?', ['the children’s room', 'the childrens’ room', 'the room of children', 'the children room'], 0, 'Pluriel irrégulier : on garde ’s.'],
            ['Quelle est la différence entre « its » et « it’s » ?', ['« its » est un possessif, « it’s » signifie « it is »', 'Aucune', '« its » est un pluriel', '« it’s » est un possessif'], 0, 'Deux mots différents malgré la ressemblance.'],
            ['« This book is mine » est correct.', ['Vrai', 'Faux'], 0, '« Mine » est un pronom possessif : il remplace « my book ».'],
          ],
        },
        {
          titre: 'Exprimer une quantité',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Some, any, much, many',
            cours: `Some ou any, much ou many : deux paires de choix, et deux critères différents.

## Some et any
| Le mot | Dans quelle phrase | Exemple |
| **some** | **Affirmative** | *I have **some** money.* |
| **any** | **Négative** et **interrogative** | *I don’t have **any** money. / Do you have **any** apples?* |

!> **L’exception à connaître** : on emploie **some** dans une question quand on **propose** ou qu’on **demande** quelque chose. *Would you like **some** tea?* — *Can I have **some** water?*

## Much et many
| Le mot | Avec quoi | Exemple |
| **many** | Un dénombrable **pluriel** | *How **many** books?* |
| **much** | Un **indénombrable** | *How **much** money?* |

Tous deux s’emploient surtout en question et en négation.

## A lot of / lots of
Dans une phrase **affirmative**, on préfère **a lot of**, qui marche avec les deux.

= I have a lot of friends · There is a lot of water

!> On ne dit **pas** « I have much money » : on dit *a lot of money*. C’est une règle d’**usage**, pas de grammaire — et elle se retient telle quelle.

## Peu et un peu
| Le mot | Avec quoi | Son sens |
| **a few** | Dénombrable | Quelques — **positif** |
| **few** | Dénombrable | Peu — **négatif** |
| **a little** | Indénombrable | Un peu |
| **little** | Indénombrable | Peu |

= a few friends · few friends · a little milk · little hope

## There is / there are
| La forme | Avec quoi |
| **there is** | Singulier ou indénombrable |
| **there are** | Pluriel |`,
          },
          questions: [
            ['Quel mot emploie-t-on dans une phrase affirmative : « J’ai de l’argent » ?', ['I have some money.', 'I have any money.', 'I have much money.', 'I have many money.'], 0, '« Some » en affirmatif.'],
            ['Comment dit-on « Je n’ai pas de pommes » ?', ['I don’t have any apples.', 'I don’t have some apples.', 'I have not many apples.', 'I don’t have much apples.'], 0, '« Any » en négatif.'],
            ['Quand emploie-t-on « some » dans une question ?', ['Quand on propose ou qu’on demande quelque chose', 'Jamais', 'Toujours', 'Seulement avec un pluriel'], 0, '« Would you like some tea? »'],
            ['Quel mot accompagne un nom dénombrable pluriel ?', ['many', 'much', 'a little', 'little'], 0, '« How many books? »'],
            ['Quel mot accompagne un nom indénombrable ?', ['much', 'many', 'a few', 'few'], 0, '« How much money? »'],
            ['Comment dit-on « J’ai beaucoup d’amis » ?', ['I have a lot of friends.', 'I have much friends.', 'I have many friends of them.', 'I have a lot friends.'], 0, 'En affirmatif, on préfère « a lot of ».'],
            ['Quelle différence entre « a few » et « few » ?', ['« a few » est positif (quelques), « few » est négatif (peu)', 'Aucune', '« few » va avec les indénombrables', '« a few » est une question'], 0, 'Même distinction entre « a little » et « little ».'],
            ['On dit « There are a book ».', ['Vrai', 'Faux'], 1, 'On dit « There is a book » : singulier.'],
          ],
        },
        {
          titre: 'Les adjectifs qualificatifs',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Invariables, et devant le nom',
            cours: `Deux règles absolues, et l’erreur française consiste à faire l’inverse des deux.

## Les deux règles
| La règle | Exemple |
| L’adjectif se place **DEVANT** le nom | *a **red** car*, *an **old** house* |
| L’adjectif est **INVARIABLE** | *a red car / two **red** cars* — jamais « reds » |

!> Le français dit « une voiture **rouge** » (après) et « des voitures **rouges** » (accordé). L’anglais fait l’inverse **sur les deux points**.

## L’ordre des adjectifs
~ opinion → taille → âge → forme → couleur → origine → matière

= a beautiful little old round red Italian wooden table

On en emploie rarement plus de trois à la fois.

## Après le verbe être
L’adjectif peut aussi suivre *be*, *look*, *seem*, *feel*.

= The car is red · She looks tired

## Les adjectifs en -ed et en -ing
| La terminaison | Ce qu’elle décrit | Exemple |
| **-ed** | Ce qu’on **ressent** | *I am bored.* (je m’ennuie) |
| **-ing** | Ce qui **provoque** | *The film is boring.* (le film est ennuyeux) |

!> Confondre les deux donne *I am boring* — « je suis ennuyeux ». Le contresens est complet.

## Les adjectifs de nationalité
Ils prennent une **majuscule** : *French*, *English*, *Spanish*, *Italian*.

= She is French (sans article)

## Very et too
| Le mot | Son sens | Exemple |
| **very** | Très — un **constat** | *It’s very hot.* |
| **too** | Trop — un **excès**, un problème | *It’s too hot.* |`,
          },
          questions: [
            ['Où se place l’adjectif en anglais ?', ['Devant le nom', 'Après le nom', 'À la fin de la phrase', 'Cela dépend de l’adjectif'], 0, 'C’est l’inverse du français.'],
            ['Comment dit-on « deux voitures rouges » ?', ['two red cars', 'two reds cars', 'two cars red', 'two cars reds'], 0, 'L’adjectif est invariable.'],
            ['Quelle est la différence entre « bored » et « boring » ?', ['« bored » décrit ce qu’on ressent, « boring » ce qui le provoque', 'Aucune', '« bored » est un nom', '« boring » est un verbe'], 0, '« I am boring » signifie « je suis ennuyeux ».'],
            ['Comment dit-on « Elle est française » ?', ['She is French.', 'She is french.', 'She is a French.', 'She is Frenchs.'], 0, 'Majuscule, et sans article.'],
            ['Quel est l’ordre correct des adjectifs ?', ['opinion, taille, âge, couleur, origine, matière', 'couleur, taille, opinion', 'matière, origine, âge', 'aucun ordre particulier'], 0, 'On en emploie rarement plus de trois.'],
            ['Quelle différence entre « very » et « too » ?', ['« very » est un constat, « too » marque un excès', 'Aucune', '« too » signifie « aussi » uniquement', '« very » marque un excès'], 0, '« It’s too hot » signale un problème.'],
            ['Après quels verbes l’adjectif peut-il suivre le nom ?', ['be, look, seem, feel', 'go, come, run', 'have, do, make', 'aucun'], 0, '« She looks tired. »'],
            ['Les adjectifs anglais s’accordent en nombre.', ['Vrai', 'Faux'], 1, 'Ils sont totalement invariables.'],
          ],
        },

        // ===================================================================
        // Chapitre 2 : Le groupe verbal (5)
        // ===================================================================
        {
          titre: 'L’auxiliaire BE',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Le verbe le plus utile de l’anglais',
            cours: `BE se débrouille seul : il n’a besoin de DO ni pour la question, ni pour la négation.

## La conjugaison au présent
| Personne | Forme | Contraction |
| I | am | **I’m** |
| you | are | **you’re** |
| he / she / it | is | **he’s** |
| we / you / they | are | **we’re** |

## Les trois formes
| La forme | Comment | Exemple |
| **Affirmative** | | *I am French.* |
| **Négative** | **not** APRÈS be | *I’m not*, *he isn’t*, *they aren’t* |
| **Interrogative** | On **inverse** be et le sujet | ***Are** you French?* |

!> C’est ce qui distingue BE de **tous** les autres verbes : il fait sa question et sa négation **tout seul**.

## Le prétérit
| Personnes | Forme | Négatif |
| I, he, she, it | **was** | *wasn’t* |
| you, we, they | **were** | *weren’t* |

## Les emplois où le français dit « avoir »
| En français | En anglais |
| J’**ai** 12 ans | *I **am** 12* |
| J’**ai** faim, soif, froid, chaud, peur | *I **am** hungry / thirsty / cold / hot / afraid* |
| Tu **as** raison, tort | *You **are** right / wrong* |

!> C’est **le** piège du chapitre : là où le français dit « avoir », l’anglais dit **be**.

## Il y a
= there is + singulier · there are + pluriel

## Be + -ing
BE sert aussi à construire le présent progressif : *I **am** working.*`,
          },
          questions: [
            ['Quelle est la forme de BE avec « he » ?', ['is', 'am', 'are', 'be'], 0, 'He / she / it → is.'],
            ['Comment dit-on « J’ai 12 ans » ?', ['I am 12.', 'I have 12.', 'I have 12 years.', 'I am 12 years.'], 0, 'L’anglais emploie BE pour l’âge.'],
            ['Comment dit-on « J’ai faim » ?', ['I am hungry.', 'I have hungry.', 'I have hunger.', 'I am hunger.'], 0, 'Faim, soif, froid, chaud et peur se disent avec BE.'],
            ['Comment forme-t-on la question avec BE ?', ['On inverse be et le sujet : Are you French?', 'On ajoute do : Do you be French?', 'On ajoute -s', 'On ne change rien'], 0, 'BE n’a pas besoin de DO.'],
            ['Où se place « not » avec BE ?', ['Juste après be', 'Avant be', 'À la fin de la phrase', 'Avant le sujet'], 0, '« I am not French. »'],
            ['Quelle est la forme de BE au prétérit avec « they » ?', ['were', 'was', 'is', 'are'], 0, 'was pour I/he/she/it, were pour les autres.'],
            ['Quelle contraction correspond à « he is » ?', ['he’s', 'he are', 'hes', 'he’re'], 0, 'Comme I’m, you’re, we’re.'],
            ['BE a besoin de l’auxiliaire DO pour former une question.', ['Vrai', 'Faux'], 1, 'Il se débrouille seul, par inversion.'],
          ],
        },
        {
          titre: 'HAVE GOT : la possession',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Avoir, à l’anglaise',
            cours: `Have got dit la possession, et il se débrouille sans DO — comme BE.

## La forme
| Personnes | Forme | Contraction |
| I, you, we, they | **have got** | *I’ve got*, *you’ve got* |
| he, she, it | **has got** | *he’s got*, *she’s got* |

!> ***he’s*** peut être ***he is*** OU ***he has***. C’est le contexte qui tranche : *he’s tired* (is) contre *he’s got a car* (has).

## Négation et question
Elles se construisent **sans DO**, comme avec BE.

| La forme | Exemple |
| **Négative** | *I **haven’t got** a bike. / He **hasn’t got** a cat.* |
| **Interrogative** | ***Have** you **got** a bike? / **Has** she **got** a cat?* |

## Have got ou have ?
| La forme | Où | Comment elle se construit |
| **have got** | Anglais **britannique**, surtout à l’oral | Sans DO |
| **have** seul | Anglais **américain** | **Avec DO** : *Do you **have** a bike? / I don’t **have** a bike* |

!> Les deux sont corrects. Ce qu’il ne faut pas, c’est les **mélanger dans une même phrase**.

## Ce qu’on exprime avec HAVE GOT
| L’emploi | Exemple |
| La **possession** | *I’ve got a phone.* |
| La **famille** | *She’s got two brothers.* |
| La **description** | *He’s got blue eyes and brown hair.* |
| La **maladie** | *I’ve got a headache.* |

## Le prétérit
> Il n’y a pas de « had got » courant : au passé, on emploie simplement **had**. *I **had** a bike when I was ten.*`,
          },
          questions: [
            ['Quelle forme emploie-t-on avec « she » ?', ['has got', 'have got', 'haves got', 'is got'], 0, 'He / she / it → has got.'],
            ['Comment dit-on « Je n’ai pas de vélo » avec have got ?', ['I haven’t got a bike.', 'I don’t have got a bike.', 'I not have got a bike.', 'I haven’t a bike got.'], 0, 'Pas de DO avec have got.'],
            ['Comment pose-t-on la question « As-tu un vélo ? » ?', ['Have you got a bike?', 'Do you have got a bike?', 'You have got a bike?', 'Are you got a bike?'], 0, 'Par inversion, comme avec BE.'],
            ['Que peut signifier « he’s » ?', ['« he is » ou « he has »', 'Uniquement « he is »', 'Uniquement « he has »', 'Uniquement « he was »'], 0, 'Le contexte tranche.'],
            ['Quelle forme est plus courante en anglais américain ?', ['have, avec DO pour la question', 'have got', 'has got', 'had got'], 0, '« Do you have a bike? »'],
            ['Comment décrit-on quelqu’un physiquement ?', ['He’s got blue eyes.', 'He is blue eyes.', 'He has blue eyes got.', 'He got blue eyes.'], 0, 'HAVE GOT sert à la description.'],
            ['Comment dit-on « J’ai mal à la tête » ?', ['I’ve got a headache.', 'I am a headache.', 'I have a head hurt.', 'I got headache.'], 0, 'HAVE GOT s’emploie pour la maladie.'],
            ['On dit « I had got a bike when I was ten ».', ['Vrai', 'Faux'], 1, 'Au passé, on emploie simplement « had ».'],
          ],
        },
        {
          titre: 'L’auxiliaire DO',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Le mot qui fabrique les questions et les négations',
            cours: `Tous les verbes sauf BE et les modaux ont besoin de DO pour faire une question ou une négation.

## Qui a besoin de DO
| Le verbe | A-t-il besoin de DO ? |
| **BE** | **Non** — il s’inverse tout seul |
| Les **modaux** (can, must, will…) | **Non** |
| **Tous les autres** | **Oui** |

## La question
= DO + sujet + BASE VERBALE ?

= Do you like pizza? · Does he play football?

!> Avec ***does***, le verbe **perd son -s** : *He plays* devient *Does he **play**?* Le -s est déjà passé sur *does*.

## La négation
= Sujet + don’t / doesn’t + BASE VERBALE

= I don’t like fish · She doesn’t speak French

Même règle : *doesn’t speak*, jamais « doesn’t speaks ».

> Le -s de la 3e personne ne se met qu’**une** fois dans la phrase. S’il est sur *does*, il ne peut pas être aussi sur le verbe.

## Le prétérit : did
Une seule forme pour toutes les personnes.

= Did you go? · I didn’t go

!> Là encore, le verbe revient à la **base verbale** : *didn’t go*, **jamais** « didn’t went ».

## DO, verbe lexical
*do* est aussi un verbe ordinaire signifiant « faire » — d’où des phrases à deux *do*.

| La phrase | Le premier *do* | Le second |
| *What **do** you **do**?* | L’**auxiliaire** | Le **verbe** « faire » |
| *I **didn’t do** my homework.* | L’**auxiliaire** | Le **verbe** |

## Les réponses courtes
On répond avec l’**auxiliaire seul**.

= Do you like tea? — Yes, I do. / No, I don’t.`,
          },
          questions: [
            ['Quels verbes n’ont pas besoin de DO ?', ['BE et les modaux', 'Tous les verbes en -ing', 'Les verbes irréguliers', 'Aucun'], 0, 'Ils forment seuls question et négation.'],
            ['Comment pose-t-on la question avec « he » ?', ['Does he play football?', 'Do he plays football?', 'Does he plays football?', 'Do he play football?'], 0, 'Le -s passe sur « does ».'],
            ['Comment dit-on « Elle ne parle pas français » ?', ['She doesn’t speak French.', 'She doesn’t speaks French.', 'She don’t speak French.', 'She not speak French.'], 0, 'Le verbe revient à la base verbale.'],
            ['Quelle forme de DO emploie-t-on au prétérit ?', ['did, pour toutes les personnes', 'do et does', 'done', 'doed'], 0, 'Une seule forme.'],
            ['Comment dit-on « Je ne suis pas allé » ?', ['I didn’t go.', 'I didn’t went.', 'I not went.', 'I don’t went.'], 0, 'Après « didn’t », base verbale.'],
            ['Comment répond-on brièvement à « Do you like tea? » ?', ['Yes, I do. / No, I don’t.', 'Yes. / No.', 'Yes, I like. / No, I not.', 'Yes, I am.'], 0, 'On reprend l’auxiliaire.'],
            ['Que signifie « What do you do? » ?', ['Que fais-tu dans la vie ?', 'Que fais-tu maintenant ?', 'Qui es-tu ?', 'Où vas-tu ?'], 0, 'Le premier « do » est l’auxiliaire, le second le verbe.'],
            ['On peut écrire « Does he plays football? ».', ['Vrai', 'Faux'], 1, 'Le -s ne se met qu’une fois : sur « does ».'],
          ],
        },
        {
          titre: 'CAN : capacité et permission',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Le premier modal',
            cours: `Les trois règles des modaux s’apprennent une fois — et servent pour can, must, will et should.

## Les trois emplois de CAN
| L’emploi | Exemple |
| La **capacité** | *I **can** swim.* (je sais nager) |
| La **permission** | ***Can** I go out?* |
| La **demande polie** | ***Can** you help me?* |

## Les trois règles des modaux
1. **Jamais de -s** à la 3e personne : *he **can**, she **can*** — jamais « cans » ;
2. le verbe qui suit est à la **base verbale, sans *to*** : *I can **swim*** — jamais « can to swim » ;
3. **pas de DO** : la question se fait par **inversion**, la négation avec **not**.

= Can you swim? · I cannot swim → I can’t swim

!> Ces trois règles valent pour **TOUS** les modaux. Les apprendre une fois, c’est les avoir toutes.

## La négation
**cannot** s’écrit en **un seul mot** ; la contraction est **can’t**.

## Le passé : could
= I could swim when I was five · couldn’t

## Poliment
*Could* sert aussi de forme **polie au présent** : *Could you help me, please?* est plus poli que *Can you…*

## Ce que CAN ne fait pas
!> Il n’a **ni infinitif, ni participe**. Pour le futur ou le parfait, on emploie **be able to** : *I **will be able to** drive next year.*`,
          },
          questions: [
            ['Comment dit-on « Il sait nager » ?', ['He can swim.', 'He cans swim.', 'He can to swim.', 'He can swims.'], 0, 'Pas de -s, pas de « to ».'],
            ['Comment forme-t-on la question avec « can » ?', ['Par inversion : Can you swim?', 'Avec do : Do you can swim?', 'En ajoutant -s', 'En ajoutant « to »'], 0, 'Les modaux n’ont pas besoin de DO.'],
            ['Comment s’écrit la négation de « can » ?', ['cannot, contracté en can’t', 'can not, contracté en cann’t', 'don’t can', 'no can'], 0, '« Cannot » s’écrit en un seul mot.'],
            ['Quel est le passé de « can » ?', ['could', 'canned', 'caned', 'did can'], 0, 'Négatif : couldn’t.'],
            ['Quelle forme est la plus polie pour demander de l’aide ?', ['Could you help me, please?', 'Can you help me?', 'Do you help me?', 'You help me?'], 0, '« Could » adoucit la demande.'],
            ['Quelles sont les trois règles des modaux ?', ['Pas de -s, base verbale sans to, pas de DO', 'Toujours -s, avec to, avec DO', 'Pas de -s, avec to, avec DO', 'Toujours au passé'], 0, 'Elles valent pour tous les modaux.'],
            ['Comment dit-on « Je pourrai conduire l’an prochain » ?', ['I will be able to drive next year.', 'I will can drive next year.', 'I can drive next year.', 'I could drive next year.'], 0, '« Can » n’a pas d’infinitif : on passe par « be able to ».'],
            ['On peut écrire « She cans play the piano ».', ['Vrai', 'Faux'], 1, 'Un modal ne prend jamais de -s.'],
          ],
        },
        {
          titre: 'MUST : l’obligation',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Ce qu’il faut faire, et ce qu’il ne faut pas',
            cours: `Mustn’t et don’t have to ne veulent pas dire la même chose. Les confondre fait dire l’inverse de ce qu’on pense.

## L’obligation
**must** + base verbale, souvent une obligation venue de **celui qui parle**.

= You must wear a helmet

Il suit les trois règles des modaux : pas de -s, pas de *to*, pas de DO.

## Le piège central du chapitre
| La forme | Ce qu’elle dit |
| *You **mustn’t** go.* | Tu ne dois pas y aller — **c’est interdit** |
| *You **don’t have to** go.* | Tu n’es pas obligé — **c’est ton choix** |

!> Ce sont deux sens **opposés**. C’est l’erreur à ne pas commettre du chapitre.

## Must ou have to ?
| La forme | D’où vient l’obligation | Exemple |
| **must** | Du **locuteur** : elle est personnelle | *I **must** call my grandmother.* |
| **have to** | De l’**extérieur** : une règle, un horaire, la loi | *I **have to** wear a uniform at school.* |

## Au passé et au futur
!> *must* **n’a pas de passé**. On emploie **had to** : *I **had to** stay at home yesterday.* Au futur : *I **will have to** work.*

## Should : le conseil
Plus faible que *must*.

= You should sleep more (tu devrais)`,
          },
          questions: [
            ['Comment dit-on « Tu dois porter un casque » ?', ['You must wear a helmet.', 'You must to wear a helmet.', 'You musts wear a helmet.', 'You do must wear a helmet.'], 0, 'Base verbale, sans « to ».'],
            ['Que signifie « You mustn’t smoke here » ?', ['Il est interdit de fumer ici', 'Tu n’es pas obligé de fumer', 'Tu peux fumer', 'Tu devrais fumer'], 0, '« Mustn’t » marque une interdiction.'],
            ['Que signifie « You don’t have to go » ?', ['Tu n’es pas obligé d’y aller', 'Il est interdit d’y aller', 'Tu dois y aller', 'Tu devrais y aller'], 0, 'C’est l’absence d’obligation, pas une interdiction.'],
            ['Quelle différence entre « must » et « have to » ?', ['« must » vient du locuteur, « have to » d’une contrainte extérieure', 'Aucune', '« must » est au passé', '« have to » est un modal'], 0, 'Une règle ou la loi appelle « have to ».'],
            ['Quel est le passé de « must » ?', ['had to', 'musted', 'must have', 'did must'], 0, '« Must » n’a pas de forme passée propre.'],
            ['Quel modal donne un conseil ?', ['should', 'must', 'can', 'have to'], 0, '« You should sleep more. »'],
            ['Comment dit-on « Je devrai travailler » ?', ['I will have to work.', 'I will must work.', 'I must work later.', 'I had to work.'], 0, '« Must » n’a pas d’infinitif.'],
            ['« Mustn’t » et « don’t have to » sont interchangeables.', ['Vrai', 'Faux'], 1, 'L’un interdit, l’autre libère : ils disent l’inverse.'],
          ],
        },

        // ===================================================================
        // Chapitre 3 : Les temps (5)
        // ===================================================================
        {
          titre: 'Le présent simple',
          axe: 'Les temps',
          lecon: {
            titre: 'Les habitudes et ce qui est toujours vrai',
            cours: `Le présent simple dit ce qui est habituel. Sa seule difficulté tient dans un -s.

## La forme
Base verbale à toutes les personnes, **sauf** à la 3e personne du singulier, qui prend **-s**.

= I work · you work · HE WORKS · we work · they work

## L’orthographe du -s
| Le verbe finit par… | On ajoute | Exemples |
| **-o, -s, -ss, -sh, -ch, -x** | **-es** | *he go**es***, *she watch**es***, *he do**es*** |
| **consonne + y** | **-ies** | *he stud**ies***, *she fl**ies*** |
| **voyelle + y** | **-s** | *he play**s*** |

## Les emplois
| L’emploi | Exemple |
| Une **habitude** | *I go to school every day.* |
| Une **vérité générale** | *Water boils at 100 degrees.* |
| Un **goût**, un **état** | *She likes chocolate.* |
| Un **horaire** | *The train leaves at 8.* |

## Question et négation
Avec **DO** — et le verbe **perd** alors son -s.

= Do you work? · Does he work? · He doesn’t work

!> Le -s de la 3e personne ne se met qu’une fois : sur le **verbe** OU sur l’**auxiliaire**, jamais sur les deux.

## Les mots qui l’accompagnent
| Le mot | Où il se place |
| **always, usually, often, sometimes, never** | **Avant** le verbe — mais **après** *be* |
| *every day*, *twice a week*, *on Mondays* | **En fin** de phrase |

= She often plays tennis · He IS always late

## Ne pas confondre
= I play tennis (en général) · I am playing tennis (là, maintenant)`,
          },
          questions: [
            ['Quelle personne prend un -s au présent simple ?', ['La 3e personne du singulier', 'Toutes', 'La 1re personne', 'Le pluriel'], 0, 'He / she / it.'],
            ['Quelle est la forme correcte : « il va » ?', ['he goes', 'he gos', 'he go', 'he goies'], 0, 'Les verbes en -o prennent -es.'],
            ['Quelle est la forme correcte : « elle étudie » ?', ['she studies', 'she studys', 'she studyes', 'she study'], 0, 'Consonne + y → -ies.'],
            ['Comment dit-on « Il ne travaille pas » ?', ['He doesn’t work.', 'He doesn’t works.', 'He don’t work.', 'He not works.'], 0, 'Le verbe perd son -s après « doesn’t ».'],
            ['Où se placent « always » et « often » ?', ['Avant le verbe, mais après be', 'À la fin de la phrase', 'Au début toujours', 'Après le complément'], 0, '« She often plays tennis. »'],
            ['Quel emploi correspond au présent simple ?', ['Une habitude ou une vérité générale', 'Une action en cours maintenant', 'Une action terminée', 'Un projet futur immédiat'], 0, '« Water boils at 100 degrees. »'],
            ['Comment pose-t-on la question à la 3e personne ?', ['Does he work?', 'Do he works?', 'Does he works?', 'Do he work?'], 0, 'Le -s passe sur « does ».'],
            ['« I am playing tennis » et « I play tennis » disent la même chose.', ['Vrai', 'Faux'], 1, 'L’un décrit le moment présent, l’autre une habitude.'],
          ],
        },
        {
          titre: 'Le présent en BE + -ING',
          axe: 'Les temps',
          lecon: {
            titre: 'Ce qui se passe en ce moment',
            cours: `On met -ing sur ce qu’on FAIT, pas sur ce qu’on PENSE ou ce qu’on RESSENT.

## La forme
= BE conjugué au présent + verbe en -ing

= I am working · She is playing · They are eating

## L’orthographe du -ing
| Le verbe | Ce qui se passe | Exemples |
| En **-e muet** | On **retire** le e | *make → mak**ing***, *write → writ**ing*** |
| Court, en **consonne-voyelle-consonne** | On **double** la consonne finale | *run → ru**nn**ing*, *swim → swi**mm**ing*, *sit → si**tt**ing* |
| En **-ie** | Devient **-ying** | *lie → l**ying*** |

## Les emplois
| L’emploi | Exemple |
| Une action **en cours** | *Look! It **is raining**.* |
| Une action **temporaire** | *I **am staying** with my aunt this week.* |
| Un **projet** proche déjà organisé | *We **are meeting** at 6.* |
| Avec *always*, une **irritation** | *He **is always losing** his keys.* |

## Question et négation
Sans DO — c’est **BE** qui travaille.

= Are you working? · I am not working · She isn’t playing

## Les verbes qui refusent le -ing
!> Les verbes d’**état** ne s’emploient **pas** à cette forme : *know, like, love, hate, want, need, understand, believe, prefer*. On dit *I **know** the answer*, jamais « I am knowing ».

## Le contraste à retenir
= I read books (j’en lis en général) · I am reading a book (je suis en train d’en lire un)`,
          },
          questions: [
            ['Comment se forme le présent en BE + -ING ?', ['BE au présent + verbe en -ing', 'DO + verbe en -ing', 'HAVE + verbe en -ing', 'Verbe en -ing seul'], 0, '« I am working. »'],
            ['Quelle est la forme en -ing de « run » ?', ['running', 'runing', 'runnig', 'runnning'], 0, 'Consonne-voyelle-consonne : on double la finale.'],
            ['Quelle est la forme en -ing de « make » ?', ['making', 'makeing', 'makking', 'makying'], 0, 'Le e muet disparaît.'],
            ['Quel emploi correspond à cette forme ?', ['Une action en cours au moment où l’on parle', 'Une habitude', 'Une vérité générale', 'Un horaire de train'], 0, '« Look! It is raining. »'],
            ['Comment forme-t-on la négation ?', ['I am not working.', 'I don’t working.', 'I not am working.', 'I doesn’t working.'], 0, 'C’est BE qui porte la négation.'],
            ['Lequel de ces verbes ne s’emploie pas en -ing ?', ['know', 'play', 'run', 'eat'], 0, 'Les verbes d’état refusent le -ing.'],
            ['Que signifie « He is always losing his keys » ?', ['Une irritation face à une habitude agaçante', 'Une action en cours', 'Une vérité générale', 'Un projet futur'], 0, '« Always » + -ing exprime l’agacement.'],
            ['On peut dire « I am knowing the answer ».', ['Vrai', 'Faux'], 1, '« Know » est un verbe d’état : « I know the answer ».'],
          ],
        },
        {
          titre: 'Le prétérit simple',
          axe: 'Les temps',
          lecon: {
            titre: 'Le passé terminé',
            cours: `Le passé n’est marqué qu’une fois dans la phrase : sur le verbe, ou sur l’auxiliaire. Jamais sur les deux.

## La forme régulière
On ajoute **-ed**, **à toutes les personnes**.

= I worked · you worked · he worked

## L’orthographe du -ed
| Le verbe | Ce qu’on ajoute | Exemple |
| En **-e** | **-d** seulement | *like → liked* |
| **Consonne + y** | **-ied** | *study → stud**ied*** |
| Court, consonne-voyelle-consonne | On **double** | *stop → sto**pp**ed* |

## Les verbes irréguliers
= go → went · have → had · see → saw · do → did · be → was/were

= eat → ate · take → took · come → came · get → got · make → made

## Question et négation : avec DID
= Did you go? · I didn’t go

!> Après **did** et **didn’t**, le verbe revient à la **base verbale** — jamais « didn’t went ».

## Les emplois
| L’emploi | Exemple |
| Une action **terminée** à un moment précis | *I saw him **yesterday**.* |
| Une **suite** d’actions passées | *I got up, had breakfast and left.* |
| Une **habitude passée** | *When I was young, I played football.* |

## Les repères de temps
= yesterday · last week · two days ago · in 2010 · when I was young

Ces mots **réclament** le prétérit.

## La prononciation du -ed
| Le son | Après quoi | Exemple |
| **/t/** | Un son **sourd** | *worked* |
| **/d/** | Un son **sonore** | *played* |
| **/ɪd/** | Un **t** ou un **d** | *wanted*, *needed* |`,
          },
          questions: [
            ['Comment forme-t-on le prétérit d’un verbe régulier ?', ['On ajoute -ed à toutes les personnes', 'On ajoute -s', 'On ajoute -ing', 'On change la voyelle'], 0, 'La forme est la même pour tous.'],
            ['Quel est le prétérit de « study » ?', ['studied', 'studyed', 'studed', 'studies'], 0, 'Consonne + y → -ied.'],
            ['Quel est le prétérit de « stop » ?', ['stopped', 'stoped', 'stopd', 'stopping'], 0, 'On double la consonne finale.'],
            ['Quel est le prétérit de « go » ?', ['went', 'goed', 'gone', 'goes'], 0, 'C’est un verbe irrégulier.'],
            ['Comment dit-on « Je ne suis pas allé » ?', ['I didn’t go.', 'I didn’t went.', 'I not went.', 'I don’t went.'], 0, 'Après « didn’t », base verbale.'],
            ['Quel repère de temps appelle le prétérit ?', ['yesterday', 'now', 'every day', 'at the moment'], 0, 'Comme last week, two days ago, in 2010.'],
            ['Quel est le prétérit de « see » ?', ['saw', 'seed', 'seen', 'sees'], 0, 'Un irrégulier à connaître par cœur.'],
            ['On peut écrire « Did you went to school? ».', ['Vrai', 'Faux'], 1, 'Le passé est déjà sur « did » : « Did you go? »'],
          ],
        },
        {
          titre: 'Les verbes irréguliers',
          axe: 'Les temps',
          lecon: {
            titre: 'La liste qu’il faut savoir',
            cours: `Apprendre les verbes irréguliers par familles divise le travail par trois. La liste alphabétique est le plus mauvais ordre possible.

## Trois colonnes
~ Base verbale → prétérit → participe passé

= go — went — gone

En 6e, les deux premières suffisent pour la plupart des usages.

## Les plus fréquents
| Base | Prétérit | Participe |
| be | was / were | been |
| have | had | had |
| do | did | done |
| go | went | gone |
| say | said | said |
| get | got | got |
| make | made | made |
| take | took | taken |
| come | came | come |
| see | saw | seen |
| know | knew | known |
| think | thought | thought |
| give | gave | given |
| find | found | found |
| eat | ate | eaten |
| drink | drank | drunk |
| write | wrote | written |
| read | read | read |
| buy | bought | bought |
| put | put | put |

## Des familles pour retenir
| La famille | Le modèle | Les autres |
| **Les trois pareils** | *put — put — put* | *cut*, *let*, *cost*, *hit* |
| **Les deux derniers pareils** | *buy — bought — bought* | *bring*, *think*, *teach* |
| **-i → -a → -u** | *drink — drank — drunk* | *sing*, *swim*, *begin* |

## Le piège de READ
!> *read — read — read* s’écrit **pareil** aux trois formes, mais se **prononce** /riːd/ au présent et **/red/** au passé. Seule l’oreille distingue.

## Comment les réviser
~ Par paquets de cinq → à voix haute → toujours dans l’ordre des trois colonnes`,
          },
          questions: [
            ['En combien de formes apprend-on un verbe irrégulier ?', ['Trois : base, prétérit, participe passé', 'Deux', 'Une seule', 'Quatre'], 0, 'go — went — gone.'],
            ['Quel est le prétérit de « take » ?', ['took', 'taked', 'taken', 'takes'], 0, 'Participe passé : taken.'],
            ['Quel verbe a les trois formes identiques ?', ['put', 'go', 'see', 'drink'], 0, 'Comme cut, let, cost, hit.'],
            ['Quel est le prétérit de « think » ?', ['thought', 'thinked', 'thinkt', 'thunk'], 0, 'Prétérit et participe sont identiques.'],
            ['Quelle famille suit le schéma -i → -a → -u ?', ['drink — drank — drunk', 'buy — bought — bought', 'put — put — put', 'go — went — gone'], 0, 'Comme sing, swim, begin.'],
            ['Quelle particularité a le verbe « read » ?', ['Il s’écrit pareil aux trois formes mais se prononce différemment', 'Il n’a pas de prétérit', 'Il est régulier', 'Il n’a pas de participe'], 0, '/riːd/ au présent, /red/ au passé.'],
            ['Quel est le prétérit de « give » ?', ['gave', 'gived', 'given', 'gives'], 0, 'Participe passé : given.'],
            ['Le meilleur ordre pour apprendre les verbes irréguliers est l’ordre alphabétique.', ['Vrai', 'Faux'], 1, 'Par familles de schémas, on divise le travail par trois.'],
          ],
        },
        {
          titre: 'Exprimer le futur',
          axe: 'Les temps',
          lecon: {
            titre: 'Be going to, will et le présent',
            cours: `Going to regarde en arrière ; will décide sur le moment. Toute la différence est là.

## BE GOING TO — l’intention et la preuve
= be + going to + base verbale

| L’emploi | Exemple |
| Une **intention** déjà décidée | *She **is going to** study medicine.* |
| Une **prévision fondée sur un indice visible** | *Look at those clouds — it **is going to** rain.* |

## WILL — la décision et la prédiction
**will** + base verbale, à toutes les personnes. Contraction : **’ll**, négatif : **won’t**.

| L’emploi | Exemple |
| Une **décision prise à l’instant** | *The phone is ringing — I**’ll** answer it.* |
| Une **prédiction**, une opinion | *I think it **will** be sunny.* |
| Une **promesse** | *I **will** help you.* |

!> La différence tient en un mot : **going to** s’appuie sur quelque chose de **déjà là** — une décision prise, un nuage visible. **will** ne s’appuie sur rien : il décide maintenant.

## Les autres façons de dire le futur
| La forme | Pour quoi | Exemple |
| Le présent en **BE + -ING** | Les rendez-vous **organisés** | *I **am meeting** Tom at 6.* |
| Le **présent simple** | Les **horaires** : trains, avions, cinémas | *The film **starts** at 8.* |

## Les repères de temps
= tomorrow · next week · in two days · tonight · soon

## Question et négation
= Will you come? / I won’t come.

= Are you going to come? / I’m not going to come.`,
          },
          questions: [
            ['Quelle forme exprime une intention déjà décidée ?', ['be going to', 'will', 'le présent simple', 'le prétérit'], 0, '« She is going to study medicine. »'],
            ['Comment dit-on « Regarde ces nuages, il va pleuvoir » ?', ['It is going to rain.', 'It will rain.', 'It rains.', 'It is raining.'], 0, 'Une prévision fondée sur un indice visible.'],
            ['Quelle forme emploie-t-on pour une décision prise à l’instant ?', ['will', 'be going to', 'le présent simple', 'le prétérit'], 0, '« The phone is ringing — I’ll answer it. »'],
            ['Quelle est la contraction négative de « will » ?', ['won’t', 'willn’t', 'don’t will', 'not will'], 0, 'La forme contractée affirmative est ’ll.'],
            ['Quelle forme emploie-t-on pour un rendez-vous organisé ?', ['Le présent en BE + -ING', 'will', 'le présent simple', 'le prétérit'], 0, '« I am meeting Tom at 6. »'],
            ['Quelle forme emploie-t-on pour un horaire de train ?', ['Le présent simple', 'will', 'be going to', 'le présent en BE + -ING'], 0, '« The train leaves at 8. »'],
            ['Quelle est la différence entre « going to » et « will » ?', ['« going to » suit une décision déjà prise, « will » décide sur le moment', 'Aucune', '« will » est au passé', '« going to » est plus poli'], 0, 'L’un regarde en arrière, l’autre décide.'],
            ['« Will » prend un -s à la 3e personne.', ['Vrai', 'Faux'], 1, 'C’est un modal : jamais de -s.'],
          ],
        },

        // ===================================================================
        // Chapitre 4 : La phrase (5)
        // ===================================================================
        {
          titre: 'Les pronoms personnels',
          axe: 'La phrase',
          lecon: {
            titre: 'Sujet et complément',
            cours: `En anglais, le sujet ne peut jamais être omis. Même quand il ne désigne personne.

## Les deux séries
| Sujet | Complément |
| **I** | **me** |
| **you** | **you** |
| **he** | **him** |
| **she** | **her** |
| **it** | **it** |
| **we** | **us** |
| **they** | **them** |

!> ***I*** est **toujours** en majuscule, où qu’il soit dans la phrase.

## Où les employer
| Le pronom | Sa place | Exemple |
| **Sujet** | Devant le verbe | ***She** likes music.* |
| **Complément** | Après le verbe ou après une préposition | *I know **her**. / Give it to **him**.* |

## IT, le pronom à tout faire
| L’emploi | Exemple |
| Le **temps qu’il fait** | *It’s raining.* |
| L’**heure** | *It’s 5 o’clock.* |
| La **distance** | *It’s 3 km.* |

!> Ces phrases n’ont pas de vrai sujet en français — « il pleut » ne parle de personne. L’anglais en réclame un **quand même** : c’est *it*.

## THEY, pour les choses aussi
*they* remplace **tous** les pluriels, personnes ou objets.

= The books? They are on the table.

## L’ordre de la phrase
~ Sujet → Verbe → Complément

> Cet ordre ne change presque jamais. C’est ce qui rend l’anglais lisible : la **position** d’un mot dit sa **fonction**.`,
          },
          questions: [
            ['Quel est le pronom complément de « he » ?', ['him', 'his', 'he', 'her'], 0, 'I know him.'],
            ['Quel est le pronom complément de « she » ?', ['her', 'hers', 'she', 'him'], 0, 'Attention : « her » est aussi un adjectif possessif.'],
            ['Quel est le pronom complément de « they » ?', ['them', 'their', 'theirs', 'they'], 0, 'I saw them.'],
            ['Où se place le pronom sujet ?', ['Devant le verbe', 'Après le verbe', 'À la fin', 'Après la préposition'], 0, 'Le pronom complément vient après.'],
            ['Comment dit-on « Il pleut » ?', ['It’s raining.', 'Is raining.', 'He is raining.', 'Raining.'], 0, 'L’anglais exige toujours un sujet.'],
            ['Quel pronom emploie-t-on pour l’heure ?', ['it', 'he', 'they', 'this'], 0, '« It’s 5 o’clock. »'],
            ['Quel est l’ordre normal de la phrase anglaise ?', ['Sujet + Verbe + Complément', 'Verbe + Sujet + Complément', 'Complément + Verbe + Sujet', 'L’ordre est libre'], 0, 'La position d’un mot dit sa fonction.'],
            ['Le pronom « I » ne prend une majuscule qu’en début de phrase.', ['Vrai', 'Faux'], 1, 'Il en prend une partout dans la phrase.'],
          ],
        },
        {
          titre: 'La phrase interrogative',
          axe: 'La phrase',
          lecon: {
            titre: 'Poser une question',
            cours: `Poser une question, c’est faire passer l’auxiliaire devant le sujet. Un seul principe, trois cas.

## Les questions fermées (oui / non)
| Le verbe | Ce qu’on met devant | Exemple |
| **BE** | *be* lui-même | ***Are** you happy?* |
| Un **modal** | Le modal | ***Can** you swim?* |
| **Tous les autres** | On appelle **DO** | ***Do** you like pizza? / **Does** he play?* |

## Les mots interrogatifs
| Le mot | Son sens |
| **what** | Quoi, que |
| **who** | Qui |
| **where** | Où |
| **when** | Quand |
| **why** | Pourquoi |
| **how** | Comment |
| **which** | Lequel |
| **whose** | À qui |

## L’ordre, toujours le même
~ Mot interrogatif → auxiliaire → sujet → verbe

= Where do you live? · What is she doing? · Why did he leave?

!> Le mot interrogatif se met devant, mais **il ne remplace pas l’auxiliaire**. « Where you live? » est incorrect : il manque *do*.

## How + adjectif
= How old are you? · How much is it? · How many books? · How far is it? · How long does it take?

## L’exception du sujet
!> Quand le mot interrogatif est **lui-même le sujet**, il n’y a **pas** d’auxiliaire : ***Who** lives here?* — et non « Who does live here? »

## La réponse courte
On reprend l’auxiliaire.

= Yes, I do. / No, she isn’t. / Yes, they can.`,
          },
          questions: [
            ['Comment pose-t-on une question avec BE ?', ['Are you happy?', 'Do you be happy?', 'You are happy?', 'Be you happy?'], 0, 'L’auxiliaire passe devant le sujet.'],
            ['Quel est l’ordre d’une question avec mot interrogatif ?', ['Mot interrogatif + auxiliaire + sujet + verbe', 'Mot interrogatif + sujet + verbe', 'Sujet + auxiliaire + mot interrogatif', 'Verbe + sujet'], 0, '« Where do you live? »'],
            ['Que signifie « whose » ?', ['à qui', 'qui', 'où', 'pourquoi'], 0, '« Whose book is this? »'],
            ['Comment demande-t-on l’âge ?', ['How old are you?', 'How many years have you?', 'What age you have?', 'How much old are you?'], 0, 'How + adjectif.'],
            ['Comment dit-on « Qui habite ici ? » ?', ['Who lives here?', 'Who does live here?', 'Who do live here?', 'Who is live here?'], 0, 'Quand le mot interrogatif est le sujet, pas d’auxiliaire.'],
            ['Quel mot emploie-t-on pour demander une quantité indénombrable ?', ['How much', 'How many', 'How long', 'How far'], 0, '« How much is it? »'],
            ['Comment répond-on brièvement à « Can you swim? » ?', ['Yes, I can.', 'Yes, I do.', 'Yes, I am.', 'Yes.'], 0, 'On reprend l’auxiliaire de la question.'],
            ['« Where you live? » est une question correcte.', ['Vrai', 'Faux'], 1, 'Il manque l’auxiliaire : « Where do you live? »'],
          ],
        },
        {
          titre: 'La phrase négative',
          axe: 'La phrase',
          lecon: {
            titre: 'Dire non, une seule fois',
            cours: `Deux négations en anglais s’annulent. Une seule suffit — et c’est tout le chapitre.

## Le principe
La négation se forme avec **not**, placé **après l’auxiliaire**.

| Le verbe | La négation | Contraction |
| **BE** | *I am **not** French* | *I’m not*, *he isn’t*, *they aren’t* |
| Un **modal** | *I can**not** swim* | *I can’t swim* |
| **Les autres** | *I **do not** like fish* | *I **don’t** like fish. / He **doesn’t** like fish* |
| Au **prétérit** | | *I **didn’t** go* |

!> Après *doesn’t* et *didn’t*, le verbe revient à la **base verbale**.

## Une seule négation par phrase
= I don’t see anything. OU I see nothing. — jamais les deux.

!> « I don’t see nothing » signifie littéralement « je ne vois pas rien », **donc « je vois quelque chose »**. Le français dit « je **ne** vois **rien** » avec deux mots ; l’anglais **un seul**.

## Les mots déjà négatifs
= no · nothing · nobody · never · nowhere

On ne leur ajoute **pas** *not*.

= I never eat meat — et non « I don’t never eat meat »

## No et not
| La forme | Ce qui suit | Exemple |
| **no** | Un **nom** | *There is **no** milk.* |
| **not** | Le reste | *There is**n’t** any milk.* |

Les deux phrases sont correctes et disent la même chose.

## Les contractions
= isn’t · aren’t · wasn’t · weren’t · don’t · doesn’t · didn’t · can’t · won’t · mustn’t · haven’t · hasn’t

Normales à l’oral et dans un texte courant ; on les évite dans un écrit très formel.`,
          },
          questions: [
            ['Où se place « not » ?', ['Après l’auxiliaire', 'Avant le sujet', 'À la fin de la phrase', 'Avant l’auxiliaire'], 0, '« I am not French. »'],
            ['Comment dit-on « Je n’aime pas le poisson » ?', ['I don’t like fish.', 'I not like fish.', 'I don’t likes fish.', 'I am not like fish.'], 0, 'On fait appel à DO.'],
            ['Combien de négations une phrase anglaise peut-elle contenir ?', ['Une seule', 'Deux', 'Autant qu’on veut', 'Deux au minimum'], 0, 'Deux négations s’annulent.'],
            ['Comment dit-on « Je ne vois rien » ?', ['I don’t see anything.', 'I don’t see nothing.', 'I not see nothing.', 'I see not anything.'], 0, 'Ou bien « I see nothing ».'],
            ['Comment dit-on « Je ne mange jamais de viande » ?', ['I never eat meat.', 'I don’t never eat meat.', 'I never don’t eat meat.', 'I not never eat meat.'], 0, '« Never » est déjà négatif.'],
            ['Quelle est la négation de « can » ?', ['cannot, contracté en can’t', 'don’t can', 'can not do', 'no can'], 0, 'Les modaux prennent « not » directement.'],
            ['Comment dit-on « Il n’y a pas de lait » ?', ['There is no milk.', 'There is not milk.', 'There isn’t no milk.', 'There has no milk.'], 0, 'Ou « There isn’t any milk ».'],
            ['« I don’t see nothing » est correct en anglais standard.', ['Vrai', 'Faux'], 1, 'Deux négations s’annulent : cela signifierait « je vois quelque chose ».'],
          ],
        },
        {
          titre: 'L’impératif',
          axe: 'La phrase',
          lecon: {
            titre: 'Donner un ordre, un conseil, une consigne',
            cours: `L’impératif est la forme la plus simple de l’anglais : la base verbale, sans sujet et sans terminaison.

## La forme
= Come here! · Sit down. · Listen carefully.

Il n’y a **qu’une seule forme**, quel que soit le nombre de personnes à qui l’on s’adresse.

## La négation
= Don’t + base verbale

= Don’t touch that! · Don’t be late.

!> Même avec ***be***, on emploie ***don’t***. C’est le **seul** cas où *be* passe par DO.

## L’adoucir
| Le moyen | Exemple |
| **please** | *Sit down, **please**.* |
| Une question **modale** | ***Could you** sit down?* |
| ***let’s*** pour une proposition collective | ***Let’s** go!* (= let us) |

> Un impératif nu n’est pas impoli en soi — c’est le contexte qui décide. Mais dans une demande à un adulte ou à un inconnu, on ajoute presque toujours *please*, ou l’on passe par *could*.

## Où on le rencontre
| Le lieu | Exemples |
| Les **consignes** d’exercices | *Read the text. Answer the questions. Fill in the blanks. Match the words.* |
| Les **panneaux** | *Push*, *Pull*, *Keep off the grass* |
| Les **recettes**, les **notices** | |

## Let’s
*Let’s* + base verbale propose une action **à faire ensemble**.

= Let’s play football. · Let’s not argue.

## À ne pas confondre
!> *Don’t forget* (n’oublie pas) et *Forget it* (laisse tomber) : **même verbe, sens opposés**.`,
          },
          questions: [
            ['Comment forme-t-on l’impératif ?', ['La base verbale, sans sujet', 'Le verbe + -s', 'Do + verbe', 'Will + verbe'], 0, '« Come here! »'],
            ['Comment forme-t-on l’impératif négatif ?', ['Don’t + base verbale', 'Not + verbe', 'No + verbe', 'Doesn’t + verbe'], 0, '« Don’t touch that! »'],
            ['Comment dit-on « Ne sois pas en retard » ?', ['Don’t be late.', 'Not be late.', 'Be not late.', 'Doesn’t be late.'], 0, 'Seul cas où « be » passe par DO.'],
            ['Combien de formes l’impératif anglais a-t-il ?', ['Une seule', 'Deux', 'Trois', 'Une par personne'], 0, 'Quel que soit le nombre d’interlocuteurs.'],
            ['Que signifie « Let’s go! » ?', ['Allons-y !', 'Laisse-moi partir', 'Va-t’en', 'Il part'], 0, '« Let’s » = let us, une proposition collective.'],
            ['Comment adoucir un ordre ?', ['Ajouter « please » ou employer « Could you… »', 'Parler plus fort', 'Ajouter -s au verbe', 'Mettre le verbe au passé'], 0, 'Surtout avec un adulte ou un inconnu.'],
            ['Où rencontre-t-on souvent l’impératif ?', ['Consignes d’exercices, recettes, panneaux', 'Uniquement à l’oral', 'Dans les romans seulement', 'Nulle part à l’écrit'], 0, '« Read the text. Answer the questions. »'],
            ['L’impératif anglais change de forme au pluriel.', ['Vrai', 'Faux'], 1, 'Il n’a qu’une seule forme.'],
          ],
        },
        {
          titre: 'Le comparatif et le superlatif',
          axe: 'La phrase',
          lecon: {
            titre: 'Plus grand, le plus grand',
            cours: `Un adjectif prend -er OU more, jamais les deux. Tout dépend de sa longueur.

## Le comparatif de supériorité
| L’adjectif | La construction | Exemple |
| **Court** — 1 syllabe, ou 2 en -y | **-er than** | *He is tall**er than** me.* |
| **Long** — 2 syllabes et plus | **more … than** | ***more** interesting **than*** |

## L’orthographe du -er
| L’adjectif | Ce qu’on ajoute | Exemple |
| En **-e** | **-r** seulement | *nice → nicer* |
| **Consonne + y** | **-ier** | *happy → happ**ier*** |
| Court, consonne-voyelle-consonne | On **double** | *big → bi**gg**er* |

## Le superlatif
| L’adjectif | La construction | Exemple |
| **Court** | **the … -est** | *the tall**est*** |
| **Long** | **the most …** | *the **most** interesting* |

## Les irréguliers — à savoir par cœur
| Adjectif | Comparatif | Superlatif |
| good | **better** | the best |
| bad | **worse** | the worst |
| far | **further / farther** | the furthest |
| many / much | **more** | the most |
| little | **less** | the least |

> *good → better → the best* est le trio le plus employé de la langue. Il ne se déduit d’aucune règle : il s’apprend.

## L’égalité et l’infériorité
| Le rapport | La construction | Exemple |
| **Égalité** | **as … as** | *She is **as** tall **as** me.* |
| Égalité **niée** | *not as … as* | *not **as** tall **as*** |
| **Infériorité** | **less … than** | *less expensive than* |

## Le piège
!> On ne **cumule jamais** les deux formes : « more taller » est incorrect.`,
          },
          questions: [
            ['Comment forme-t-on le comparatif d’un adjectif court ?', ['adjectif + -er than', 'more + adjectif + than', 'the most + adjectif', 'as + adjectif + as'], 0, '« He is taller than me. »'],
            ['Comment forme-t-on le comparatif d’un adjectif long ?', ['more + adjectif + than', 'adjectif + -er than', 'the + adjectif + -est', 'less + adjectif'], 0, '« more interesting than ».'],
            ['Quel est le comparatif de « good » ?', ['better', 'gooder', 'more good', 'best'], 0, 'Superlatif : the best.'],
            ['Quel est le comparatif de « bad » ?', ['worse', 'badder', 'more bad', 'worst'], 0, 'Superlatif : the worst.'],
            ['Quel est le comparatif de « big » ?', ['bigger', 'biger', 'more big', 'bigest'], 0, 'On double la consonne finale.'],
            ['Comment exprime-t-on l’égalité ?', ['as … as', 'more … than', 'the most …', 'less … than'], 0, '« She is as tall as me. »'],
            ['Quel est le superlatif de « interesting » ?', ['the most interesting', 'the interestingest', 'the more interesting', 'the interesting most'], 0, 'Adjectif long : the most.'],
            ['On peut dire « more taller ».', ['Vrai', 'Faux'], 1, 'Un adjectif prend -er OU more, jamais les deux.'],
          ],
        },
      ],
    },
  ],
}
