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
            cours: `## La règle générale
On forme le pluriel en ajoutant **-s** : *a cat → two cats*, *a book → three books*.

## Les cas particuliers
- Noms en **-s, -ss, -sh, -ch, -x** → on ajoute **-es** : *a bus → buses*, *a box → boxes*, *a watch → watches*.
- Noms en **consonne + y** → le y devient **-ies** : *a city → cities*, *a baby → babies*.
  Mais **voyelle + y** garde le y : *a boy → boys*, *a day → days*.
- Noms en **-f / -fe** → souvent **-ves** : *a knife → knives*, *a leaf → leaves*.

## Les pluriels irréguliers — à savoir par cœur
| singulier | pluriel |
|---|---|
| a man | **men** |
| a woman | **women** |
| a child | **children** |
| a foot | **feet** |
| a tooth | **teeth** |
| a mouse | **mice** |
| a person | **people** |

Certains ne changent pas : *a sheep → sheep*, *a fish → fish*.

## Dénombrables et indénombrables
- **Countable** : on peut les compter, ils ont un pluriel — *an apple, two apples*.
- **Uncountable** : pas de pluriel, pas de *a/an* — *water*, *money*, *bread*, *information*, *homework*.
  On dit *some water*, jamais « a water ».

> Attention : *information* et *homework* sont indénombrables en anglais alors que « des informations » et « des devoirs » se disent au pluriel en français. C’est un piège classique.

## La prononciation du -s final
Trois sons : **/s/** après p, t, k, f (*cats*) ; **/z/** après une sonore ou une voyelle (*dogs*) ; **/ɪz/** après un sifflement (*buses*, *watches*).`,
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
            cours: `## L’article indéfini : a / an
Il correspond à « un / une », et ne s’emploie qu’au **singulier dénombrable**.
- **a** devant un **son** de consonne : *a book*, *a car*, *a university* (on entend « you »).
- **an** devant un **son** de voyelle : *an apple*, *an orange*, *an hour* (le h ne se prononce pas).

> Le choix dépend du **son**, pas de la lettre. *A university* mais *an hour* : c’est le piège du chapitre.

## L’article défini : the
Il correspond à « le, la, les » et s’emploie au singulier comme au pluriel, pour quelque chose de **précis** ou de **déjà connu**.
*I have a dog. **The** dog is black.* — d’abord on présente, ensuite on désigne.

Il se prononce **/ðə/** devant une consonne et **/ði/** devant une voyelle.

## L’article zéro — quand on ne met rien
C’est la différence la plus visible avec le français. Pas d’article devant :
- les **généralités** au pluriel : *Cats are independent.* (Les chats sont indépendants.)
- les **indénombrables** en général : *I like music.*
- les **pays**, **villes**, **langues** : *France*, *London*, *English*.
- les **repas**, les **sports**, les **matières** : *at breakfast*, *play tennis*, *study maths*.
- devant *school, home, work, bed* pris dans leur fonction : *go to school*, *at home*.

## Exceptions à connaître
On dit **the** United States, **the** United Kingdom, **the** Netherlands — des noms de pays au pluriel ou contenant un nom commun.`,
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
            cours: `## Le tableau complet
|  | proche (ici) | éloigné (là-bas) |
|---|---|---|
| **singulier** | **this** | **that** |
| **pluriel** | **these** | **those** |

*This book is mine.* (ce livre-ci) — *That car is red.* (cette voiture-là)
*These shoes are new.* (ces chaussures-ci) — *Those birds are big.* (ces oiseaux-là)

## Deux critères, pas un
Le français dit « ce / cette / ces » sans distinguer la distance. L’anglais demande **deux** décisions à chaque fois :
1. proche ou éloigné ?
2. singulier ou pluriel ?

## La prononciation, le vrai piège
**this** /ðɪs/ est court, **these** /ðiːz/ est long. C’est le seul indice à l’oral : les confondre change le nombre.

## Les emplois particuliers
- Au **téléphone** : *Hello, **this** is Tom.* (c’est Tom à l’appareil)
- Pour **présenter quelqu’un** : *This is my sister.*
- Dans le **temps** : *this morning* (ce matin), *these days* (ces jours-ci), *that day* (ce jour-là).

## Sans nom derrière
Les démonstratifs peuvent s’employer seuls, comme pronoms :
*What’s **this**? — **That**’s my bag.*

> En français on ajoute souvent « -ci » ou « -là » ; en anglais, l’information est déjà dans le mot.`,
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
            cours: `## Le génitif : ’s
Pour dire « le … de … » avec un **possesseur humain** ou animé, l’anglais inverse l’ordre du français :
*Paul’s bike* = le vélo **de** Paul.
On lit de droite à gauche : **possesseur + ’s + objet possédé**.

Au **pluriel** déjà en -s, on ajoute seulement l’apostrophe : *my parents’ car* (la voiture de mes parents).
Pour un pluriel irrégulier, on garde ’s : *the children’s room*.

## Pour les choses : of
Avec un objet inanimé, on préfère **of** :
*the door **of** the house*, *the end **of** the film*.

## Les adjectifs possessifs
Ils se placent **devant le nom** et ne s’accordent **jamais** avec lui :

| personne | adjectif |
|---|---|
| I | **my** |
| you | **your** |
| he | **his** |
| she | **her** |
| it | **its** |
| we | **our** |
| they | **their** |

*his sister* = sa sœur (à lui) — *her brother* = son frère (à elle).

> C’est l’erreur numéro un des francophones : en anglais, le possessif s’accorde avec le **POSSESSEUR**, pas avec l’objet. « Sa voiture » se dit *his car* si c’est un garçon, *her car* si c’est une fille.

## Les pronoms possessifs
Ils remplacent le groupe entier, sans nom derrière : **mine, yours, his, hers, ours, theirs**.
*This book is **mine**.* (= my book)

## Le piège its / it’s
**its** = son, sa (possessif) — **it’s** = *it is*. Deux mots différents.`,
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
            cours: `## Some et any
- **some** = « du, de la, des », dans les phrases **affirmatives**.
  *I have **some** money. / There are **some** apples.*
- **any** dans les phrases **négatives** et **interrogatives**.
  *I don’t have **any** money. / Do you have **any** apples?*

**L’exception à connaître** : on emploie **some** dans une question quand on **propose** ou qu’on **demande** quelque chose.
*Would you like **some** tea?* — *Can I have **some** water?*

## Much et many
- **many** + nom **dénombrable** pluriel : *How **many** books?*
- **much** + nom **indénombrable** : *How **much** money?*
Tous deux s’emploient surtout en question et en négation.

## A lot of / lots of
Dans une phrase **affirmative**, on préfère **a lot of**, qui marche avec les deux :
*I have **a lot of** friends. / There is **a lot of** water.*

> On ne dit pas « I have much money » : on dit *a lot of money*. C’est une règle d’usage, pas de grammaire.

## Peu et un peu
- **a few** + dénombrable = quelques (positif) — *a few friends*
- **few** + dénombrable = peu (négatif) — *few friends*
- **a little** + indénombrable = un peu — *a little milk*
- **little** + indénombrable = peu — *little hope*

## There is / there are
Pour dire « il y a » : **there is** + singulier ou indénombrable, **there are** + pluriel.
*There **is** a book. / There **are** two books.*`,
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
            cours: `## Deux règles absolues
1. L’adjectif se place **DEVANT** le nom : *a **red** car*, *an **old** house*.
2. L’adjectif est **INVARIABLE** : jamais de -s, jamais de féminin.
   *a red car / two **red** cars* — pas « reds ».

> Ces deux règles couvrent presque tous les emplois, et l’erreur française consiste à faire l’inverse des deux : « une voiture rouge », « des voitures rouges ».

## L’ordre des adjectifs
Quand il y en a plusieurs, l’anglais suit un ordre assez fixe :
**opinion → taille → âge → forme → couleur → origine → matière**
*a **beautiful little old round red** Italian **wooden** table.*
On en emploie rarement plus de trois à la fois.

## Après le verbe être
L’adjectif peut aussi suivre *be*, *look*, *seem*, *feel* :
*The car **is red**. / She **looks tired**.*

## Les adjectifs en -ed et en -ing
- **-ed** décrit ce qu’on **ressent** : *I am bored.* (je m’ennuie)
- **-ing** décrit ce qui **provoque** : *The film is boring.* (le film est ennuyeux)
Confondre les deux donne *I am boring* — « je suis ennuyeux ».

## Les adjectifs de nationalité
Ils prennent une **majuscule** : *French*, *English*, *Spanish*, *Italian*.
*She is **French**.* (sans article)

## Very et too
- **very** = très (constat) — *It’s very hot.*
- **too** = trop (excès, problème) — *It’s too hot.*`,
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
            cours: `## La conjugaison au présent
| personne | forme | contraction |
|---|---|---|
| I | am | **I’m** |
| you | are | **you’re** |
| he / she / it | is | **he’s** |
| we / you / they | are | **we’re** |

## Les trois formes
- **Affirmative** : *I am French.*
- **Négative** : on ajoute **not** APRÈS be — *I am **not** French* → *I’m not*, *he isn’t*, *they aren’t*.
- **Interrogative** : on **inverse** be et le sujet — ***Are** you French?*

> BE se débrouille seul : il n’a besoin ni de DO pour la question, ni de DO pour la négation. C’est ce qui le distingue de tous les autres verbes.

## Le prétérit
**was** (I, he, she, it) et **were** (you, we, they).
*I **was** tired. / They **were** at home.*
Négatif : *wasn’t*, *weren’t*.

## Les emplois où le français dit « avoir »
C’est le piège majeur du chapitre :
- l’**âge** : *I **am** 12.* (j’ai 12 ans)
- **faim, soif, froid, chaud, peur** : *I **am** hungry / thirsty / cold / hot / afraid.*
- la **raison** : *You **are** right / wrong.*

## Il y a
*There **is*** + singulier, *there **are*** + pluriel.

## Be + -ing
BE sert aussi à construire le présent progressif : *I **am** working.* (voir la fiche sur le présent en BE + -ING).`,
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
            cours: `## La forme
**have got** (I, you, we, they) et **has got** (he, she, it).
*I **have got** a bike. / She **has got** a cat.*

Contractions courantes : *I’ve got*, *you’ve got*, *he’s got*, *she’s got*.

> Attention : *he’s* peut être *he is* OU *he has*. C’est le contexte qui tranche — *he’s tired* (is) contre *he’s got a car* (has).

## Négation et question
Elles se construisent **sans DO**, comme avec BE :
- négatif : *I **haven’t got** a bike. / He **hasn’t got** a cat.*
- question : ***Have** you **got** a bike? / **Has** she **got** a cat?*

## Have got ou have ?
Les deux disent la même chose pour la possession.
- **have got** : plus courant en anglais **britannique**, surtout à l’oral.
- **have** seul : plus courant en **américain**, et il se conjugue alors avec **DO** :
  *Do you **have** a bike? / I don’t **have** a bike.*
Les deux sont corrects — il faut seulement ne pas les mélanger dans une même phrase.

## Ce qu’on exprime avec HAVE GOT
- la **possession** : *I’ve got a phone.*
- la **famille** : *She’s got two brothers.*
- la **description** : *He’s got blue eyes and brown hair.*
- la **maladie** : *I’ve got a headache.*

## Le prétérit
Il n’y a pas de « had got » courant : au passé, on emploie **had**.
*I **had** a bike when I was ten.*`,
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
            cours: `## À quoi il sert
Tous les verbes **sauf BE** et les modaux ont besoin de **DO** pour former la question et la négation au présent.

## La question
**Do** + sujet + **verbe à la base verbale** ?
*Do you **like** pizza? / **Does** he **play** football?*

⚠️ Avec *does*, le verbe **perd son -s** : *He plays* → *Does he **play**?* — le -s est déjà passé sur *does*.

## La négation
Sujet + **don’t / doesn’t** + base verbale.
*I **don’t like** fish. / She **doesn’t speak** French.*
Même règle : *doesn’t speak*, jamais « doesn’t speaks ».

> Le -s de la 3e personne ne se met qu’UNE fois dans la phrase. S’il est sur *does*, il ne peut pas être aussi sur le verbe.

## Le prétérit : did
Une seule forme pour toutes les personnes.
*Did you **go**? / I **didn’t go**.*
Et là encore, le verbe revient à la **base verbale** : *didn’t go*, jamais « didn’t went ».

## DO, verbe lexical
*do* est aussi un verbe ordinaire signifiant « faire » — d’où des phrases à deux *do* :
*What **do** you **do**?* (Que fais-tu dans la vie ?)
*I **didn’t do** my homework.*

## Les réponses courtes
On répond avec l’auxiliaire seul, jamais par *yes* ou *no* tout secs :
*Do you like tea? — **Yes, I do.** / **No, I don’t.***`,
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
            cours: `## Les trois emplois
- la **capacité** : *I **can** swim.* (je sais nager)
- la **permission** : ***Can** I go out?* (est-ce que je peux ?)
- la **demande polie** : ***Can** you help me?*

## Les règles des modaux — les trois d’un coup
1. **Jamais de -s** à la 3e personne : *he **can**, she **can*** — jamais « cans ».
2. Le verbe qui suit est à la **base verbale**, sans *to* : *I can **swim*** — jamais « can to swim ».
3. **Pas de DO** : la question se fait par **inversion**, la négation avec **not**.
   ***Can** you swim? / I **cannot** swim* → *I **can’t** swim.*

> Ces trois règles valent pour TOUS les modaux — can, must, will, should. Les apprendre une fois, c’est les avoir toutes.

## La négation
**cannot** s’écrit en un seul mot ; la contraction est **can’t**.

## Le passé : could
*I **could** swim when I was five.*
Négatif : *couldn’t*.

## Poliment
*Could* sert aussi de forme **polie** au présent : *Could you help me, please?* est plus poli que *Can you…*

## Ce que CAN ne fait pas
Il n’a pas d’infinitif ni de participe. Pour le futur ou le parfait, on emploie **be able to** :
*I **will be able to** drive next year.*`,
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
            cours: `## L’obligation
**must** + base verbale exprime une obligation, souvent **venue de celui qui parle** :
*You **must** wear a helmet.*
Il suit les trois règles des modaux : pas de -s, pas de *to*, pas de DO.

## L’interdiction
**mustn’t** = il ne faut **pas**, c’est **interdit**.
*You **mustn’t** smoke here.*

## Le piège central du chapitre
**mustn’t** et **don’t have to** ne veulent PAS dire la même chose :
- *You **mustn’t** go.* = tu ne dois pas y aller — **c’est interdit**.
- *You **don’t have to** go.* = tu n’es pas obligé d’y aller — **c’est ton choix**.

> Confondre les deux fait dire l’inverse de ce qu’on pense. C’est l’erreur à ne pas commettre.

## Must ou have to ?
- **must** : l’obligation vient du locuteur, elle est personnelle.
  *I **must** call my grandmother.*
- **have to** : l’obligation vient de l’**extérieur** — une règle, un horaire, la loi.
  *I **have to** wear a uniform at school.*

## Au passé et au futur
*must* n’a pas de passé : on emploie **had to**.
*I **had to** stay at home yesterday.*
Au futur : *I **will have to** work.*

## Should : le conseil
Plus faible que *must*, **should** donne un conseil :
*You **should** sleep more.* (tu devrais)`,
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
            cours: `## La forme
Base verbale à toutes les personnes, **sauf** à la 3e personne du singulier, qui prend **-s**.
*I work / you work / **he works** / we work / they work.*

## L’orthographe du -s
- verbes en **-o, -s, -ss, -sh, -ch, -x** → **-es** : *he go**es***, *she watch**es***, *he do**es***.
- verbes en **consonne + y** → **-ies** : *he stud**ies***, *she fl**ies***.
- verbes en **voyelle + y** → simple -s : *he play**s***.

## Les emplois
- une **habitude** : *I go to school every day.*
- une **vérité générale** : *Water boils at 100 degrees.*
- un **goût**, un **état** : *She likes chocolate.*
- un **horaire** : *The train leaves at 8.*

## Question et négation
Avec **DO** — et le verbe perd alors son -s :
*Do you work? / **Does** he **work**? / He **doesn’t work**.*

> Le -s de la 3e personne ne se met qu’une fois : sur le verbe OU sur l’auxiliaire, jamais sur les deux.

## Les mots qui l’accompagnent
**always, usually, often, sometimes, never** se placent **avant** le verbe (mais après *be*) :
*She **often** plays tennis. / He **is** always late.*
Les expressions de fréquence — *every day*, *twice a week*, *on Mondays* — se placent en fin de phrase.

## Ne pas confondre
Le présent simple dit ce qui est **habituel** ; le présent en BE + -ING dit ce qui se passe **maintenant**.
*I play tennis* (en général) — *I am playing tennis* (là, maintenant).`,
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
            cours: `## La forme
**BE** conjugué au présent + verbe en **-ing**.
*I **am working**. / She **is playing**. / They **are eating**.*

## L’orthographe du -ing
- verbe en **-e muet** → on retire le e : *make → mak**ing***, *write → writ**ing***.
- verbe court en **consonne-voyelle-consonne** → on **double** la consonne finale : *run → ru**nn**ing*, *swim → swi**mm**ing*, *sit → si**tt**ing*.
- verbe en **-ie** → devient **-ying** : *lie → l**ying***.

## Les emplois
- une action **en cours** au moment où l’on parle : *Look! It **is raining**.*
- une action **temporaire** : *I **am staying** with my aunt this week.*
- un **projet** proche déjà organisé : *We **are meeting** at 6.*
- avec *always*, une **irritation** : *He **is always losing** his keys.*

## Question et négation
Sans DO — c’est BE qui travaille :
*Are you working? / I **am not** working. / She **isn’t** playing.*

## Les verbes qui refusent le -ing
Les verbes d’**état** ne s’emploient pas à cette forme : *know, like, love, hate, want, need, understand, believe, prefer*.
On dit *I **know** the answer*, jamais « I am knowing ».

> La règle simple : on met -ing sur ce qu’on FAIT, pas sur ce qu’on PENSE ou ce qu’on RESSENT.

## Le contraste à retenir
*I **read** books.* — j’en lis en général.
*I **am reading** a book.* — je suis en train d’en lire un.`,
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
            cours: `## La forme régulière
On ajoute **-ed** à la base verbale, **à toutes les personnes** :
*I work**ed**, you work**ed**, he work**ed**…*

## L’orthographe du -ed
- verbe en **-e** → seulement **-d** : *like → liked*.
- **consonne + y** → **-ied** : *study → stud**ied***.
- verbe court en consonne-voyelle-consonne → on **double** : *stop → sto**pp**ed*.

## Les verbes irréguliers
Ils ne prennent pas -ed et changent de forme — il faut les apprendre :
*go → **went**, have → **had**, see → **saw**, do → **did**, be → **was/were**, eat → **ate**, take → **took**, come → **came**, get → **got**, make → **made**.*

## Question et négation : avec DID
*Did you **go**? / I **didn’t go**.*
⚠️ Après **did** et **didn’t**, le verbe revient à la **base verbale** — jamais « didn’t went ».

> Le passé n’est marqué qu’UNE fois dans la phrase : sur le verbe, ou sur l’auxiliaire. Jamais sur les deux.

## Les emplois
- une action **terminée** à un moment **précis** du passé : *I saw him **yesterday**.*
- une **suite** d’actions passées : *I got up, had breakfast and left.*
- une **habitude passée** : *When I was young, I played football.*

## Les repères de temps
*yesterday, last week, two days ago, in 2010, when I was young* — ces mots réclament le prétérit.

## La prononciation du -ed
Trois sons : **/t/** après un son sourd (*worked*), **/d/** après un son sonore (*played*), **/ɪd/** après **t** ou **d** (*wanted*, *needed*).`,
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
            cours: `## Trois colonnes
Un verbe irrégulier s’apprend en **trois formes** :
**base verbale — prétérit — participe passé**
*go — went — gone*

En 6e, les deux premières suffisent pour la plupart des usages ; la troisième servira plus tard.

## Les plus fréquents
| base | prétérit | participe |
|---|---|---|
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
- **Les trois pareils** : *put — put — put*, *cut*, *let*, *cost*, *hit*.
- **Les deux derniers pareils** : *buy — bought — bought*, *bring*, *think*, *teach*.
- **-i → -a → -u** : *drink — drank — drunk*, *sing*, *swim*, *begin*.

> Apprendre par familles divise le travail par trois. Une liste alphabétique est le plus mauvais ordre possible.

## Le piège de READ
*read — read — read* s’écrit pareil aux trois formes mais se **prononce** /riːd/ au présent et /red/ au passé.

## Comment les réviser
Par petits paquets de cinq, à voix haute, et toujours dans l’ordre des trois colonnes.`,
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
            cours: `## BE GOING TO — l’intention et la preuve
**be** + **going to** + base verbale.
*I **am going to** watch a film tonight.*

Deux emplois :
- une **intention** déjà décidée : *She **is going to** study medicine.*
- une **prévision fondée sur un indice visible** : *Look at those clouds — it **is going to** rain.*

## WILL — la décision et la prédiction
**will** + base verbale, à toutes les personnes. Contraction : **’ll**.
- une **décision prise à l’instant** : *The phone is ringing — I **’ll** answer it.*
- une **prédiction**, une opinion : *I think it **will** be sunny.*
- une **promesse** : *I **will** help you.*
Négatif : **won’t**.

> La différence tient en un mot : **going to** regarde en arrière (une décision déjà prise, un indice déjà là), **will** décide sur le moment.

## Le présent en BE + -ING pour le futur
Il sert aux rendez-vous **organisés** : *I **am meeting** Tom at 6.*

## Le présent simple pour les horaires
Pour les trains, avions, cinémas : *The film **starts** at 8.*

## Les repères de temps
*tomorrow, next week, in two days, tonight, soon*.

## Question et négation
*Will you come? / I won’t come.*
*Are you going to come? / I’m not going to come.*`,
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
            cours: `## Les deux séries
| sujet | complément |
|---|---|
| **I** | **me** |
| **you** | **you** |
| **he** | **him** |
| **she** | **her** |
| **it** | **it** |
| **we** | **us** |
| **they** | **them** |

*I* est **toujours** en majuscule, où qu’il soit dans la phrase.

## Où les employer
- Le pronom **sujet** est devant le verbe : ***She** likes music.*
- Le pronom **complément** vient après le verbe ou après une préposition : *I know **her**. / Give it to **him**.*

## La règle qui simplifie tout
En anglais, **le sujet ne peut jamais être omis**. Le français dit « il pleut » et l’anglais aussi : ***It** rains* — mais là où le français peut dire « faut y aller », l’anglais met toujours un sujet.

## IT, le pronom à tout faire
*it* remplace un objet, un animal, mais aussi :
- le **temps qu’il fait** : *It’s raining.*
- l’**heure** : *It’s 5 o’clock.*
- la **distance** : *It’s 3 km.*

> Ces phrases n’ont pas de vrai sujet en français (« il pleut » ne parle de personne). L’anglais en réclame un quand même : c’est *it*.

## THEY, pour les choses aussi
*they* remplace tous les pluriels, personnes ou objets :
*The books? **They** are on the table.*

## L’ordre de la phrase
**Sujet + Verbe + Complément** — et cet ordre ne change presque jamais. C’est ce qui rend l’anglais lisible : la position d’un mot dit sa fonction.`,
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
            cours: `## Les questions fermées (oui / non)
Trois cas, et un seul principe : **l’auxiliaire passe devant le sujet**.
- avec **BE** : ***Are** you happy?*
- avec un **modal** : ***Can** you swim?*
- avec **tous les autres verbes** : on fait appel à **DO** — ***Do** you like pizza? / **Does** he play?*

## Les mots interrogatifs
| mot | sens |
|---|---|
| **what** | quoi, que |
| **who** | qui |
| **where** | où |
| **when** | quand |
| **why** | pourquoi |
| **how** | comment |
| **which** | lequel |
| **whose** | à qui |

## L’ordre, toujours le même
**Mot interrogatif + auxiliaire + sujet + verbe**
*Where **do** you live? / What **is** she doing? / Why **did** he leave?*

> Le mot interrogatif se met devant, mais il ne remplace pas l’auxiliaire. « Where you live? » est incorrect : il manque *do*.

## How + adjectif
*How **old** are you? / How **much** is it? / How **many** books? / How **far** is it? / How **long** does it take?*

## L’exception du sujet
Quand le mot interrogatif est lui-même le **sujet**, il n’y a **pas** d’auxiliaire :
***Who** lives here?* — et non « Who does live here? »

## La réponse courte
On reprend l’auxiliaire : *Yes, I do. / No, she isn’t. / Yes, they can.*`,
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
            cours: `## Le principe
La négation se forme avec **not**, placé **après l’auxiliaire**.
- **BE** : *I am **not** French.* → *I’m not*, *he isn’t*, *they aren’t*.
- **modal** : *I can**not** swim.* → *I can’t swim.*
- **autres verbes** : on emploie **DO** — *I **do not** like fish* → *I **don’t** like fish. / He **doesn’t** like fish.*
- **prétérit** : *I **didn’t** go.*

⚠️ Après *doesn’t* et *didn’t*, le verbe revient à la **base verbale**.

## Une seule négation par phrase
C’est la règle qui déroute le plus les francophones : le français dit « je **ne** vois **rien** » avec deux mots négatifs, l’anglais **un seul**.
*I don’t see **anything**.* ou *I see **nothing**.* — jamais « I don’t see nothing ».

> Deux négations en anglais s’annulent : « I don’t see nothing » signifie littéralement « je ne vois pas rien », donc « je vois quelque chose ».

## Les mots négatifs
**no, nothing, nobody, never, nowhere** sont **déjà** négatifs : on ne leur ajoute pas *not*.
*I **never** eat meat.* — et non « I don’t never eat meat ».

## No et not
- **no** + nom : *There is **no** milk.*
- **not** + le reste : *There is**n’t** any milk.*
Les deux phrases sont correctes et disent la même chose.

## Les contractions
*isn’t, aren’t, wasn’t, weren’t, don’t, doesn’t, didn’t, can’t, won’t, mustn’t, haven’t, hasn’t.*
Elles sont normales à l’oral et dans un texte courant ; on les évite dans un écrit très formel.`,
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
            cours: `## La forme la plus simple de l’anglais
L’impératif est la **base verbale**, sans sujet et sans terminaison :
***Come** here! / **Sit** down. / **Listen** carefully.*

Il n’y a **qu’une seule forme**, quel que soit le nombre de personnes à qui l’on s’adresse.

## La négation
**Don’t** + base verbale :
***Don’t** touch that! / **Don’t** be late.*
Même avec *be*, on emploie *don’t* — c’est le seul cas où *be* passe par DO.

## L’adoucir
Un ordre brut est rarement poli. On l’atténue par :
- **please** : *Sit down, **please**.*
- une question modale : ***Could you** sit down?*
- *let’s* pour une proposition collective : ***Let’s** go!* (= let us)

> En anglais, un impératif nu n’est pas impoli en soi — c’est le contexte qui décide. Mais dans une demande à un adulte ou un inconnu, on ajoute presque toujours *please* ou on passe par *could*.

## Où on le rencontre
Consignes d’exercices (*Read the text. Answer the questions. Fill in the blanks. Match the words.*), recettes, panneaux (*Push, Pull, Keep off the grass*), notices.

## Let’s
*Let’s* + base verbale propose une action **à faire ensemble** :
*Let’s play football. / Let’s not argue.*

## À ne pas confondre
*Don’t forget* (n’oublie pas) et *Forget it* (laisse tomber) : même verbe, sens opposés.`,
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
            cours: `## Le comparatif de supériorité
Deux constructions, selon la **longueur** de l’adjectif :
- **adjectif court** (1 syllabe, ou 2 en -y) → **-er than**
  *tall → tall**er than*** — *He is taller **than** me.*
- **adjectif long** (2 syllabes et plus) → **more … than**
  *interesting → **more** interesting **than***

## L’orthographe du -er
- en **-e** → seulement -r : *nice → nicer*
- **consonne + y** → -ier : *happy → happ**ier***
- court en consonne-voyelle-consonne → on double : *big → bi**gg**er*

## Le superlatif
- **court** : **the … -est** — *the tall**est***
- **long** : **the most …** — *the **most** interesting*

## Les irréguliers — à savoir par cœur
| adjectif | comparatif | superlatif |
|---|---|---|
| good | **better** | the best |
| bad | **worse** | the worst |
| far | **further / farther** | the furthest |
| many / much | **more** | the most |
| little | **less** | the least |

> *good → better → the best* est le trio le plus employé de la langue. Il ne se déduit d’aucune règle : il s’apprend.

## L’égalité et l’infériorité
- égalité : **as … as** — *She is **as** tall **as** me.*
- négation : *not **as** tall **as***
- infériorité : **less … than** — *less expensive than*

## Le piège
On ne cumule jamais les deux formes : *more taller* est incorrect. Un adjectif prend **-er** OU **more**, jamais les deux.`,
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
