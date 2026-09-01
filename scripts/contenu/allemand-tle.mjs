// Allemand TERMINALE — les 36 fiches du programme officiel, dans l'ordre de ses
// 5 chapitres : « La phrase » (8), « Le groupe nominal » (11), « Les groupes
// prépositionnels » (6), « Le groupe verbal » (5), « Les temps » (6).
//
// POURQUOI UN SECOND MODULE plutôt qu'un ajout dans `allemand.mjs` : celui-ci
// part dans la migration 218, DÉJÀ EXÉCUTÉE, qui ne doit plus jamais être
// régénérée. Deux fichiers, même slug `allemand` — d'où la génération par
// `--modules` et non par `--slugs` (cf. le README).
//
// PÉRIMÈTRE : la TERMINALE SEULE. Le programme transmis est celui de l'année du
// bac, et c'est là qu'il s'applique. La 2de et la 1re gardent donc les 3 fiches
// posées par la 218 — le ménage ci-dessous est borné à `level = 'Tle'`, sans
// quoi il les viderait entièrement sans rien mettre à la place.
//
// LES TROIS ANCIENNES FICHES PARTENT (voir `menage`), au niveau Tle seulement :
//   · « Raconter au passé » est recouverte par « Le prétérit » et « Le parfait » ;
//   · « Le datif et les prépositions » l'est par les trois fiches de prépositions
//     du chapitre 3 ;
//   · « L'Allemagne d'aujourd'hui » est une fiche de civilisation hors programme
//     de langue — même décision que pour « Le monde hispanique aujourd'hui »
//     (migration 244) : un dossier de matière ne montre QUE son programme.
//
// Convention de la maison : la langue s'interroge EN FRANÇAIS, comme le reste
// de l'app. L'allemand est cité en exemple, jamais en énoncé.

export default {
  slug: 'allemand',
  nom: 'Allemand',

  titreMigration: 'ALLEMAND Tle — LE PROGRAMME OFFICIEL (36 fiches)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs Tle allemand,
20/08/2026) : l'allemand de Terminale n'avait que TROIS chapitres, hérités du
bloc lycée de la migration 218 et identiques en 2de, en 1re et en Tle
(« Raconter au passé », « Le datif et les prépositions », « L'Allemagne
d'aujourd'hui »). Un élève de Terminale qui révisait la déclinaison de
l'adjectif épithète, le passif, la relative, le subjonctif II, les verbes à
préverbe séparable ou le génitif ne trouvait RIEN — alors que ce sont
exactement les points sur lesquels une copie se perd. Cette migration installe
les 36 fiches du programme, rangées sous ses 5 chapitres (la phrase, le groupe
nominal, les groupes prépositionnels, le groupe verbal, les temps), et retire
les 3 fiches que ce découpage recouvre.

PÉRIMÈTRE : la TERMINALE SEULE — c'est le programme de l'année du bac. La 2de
et la 1re conservent telles quelles les 3 fiches de la 218 : le ménage est
borné au niveau Tle, sans quoi il les viderait entièrement sans rien mettre à
la place. Le collège (5e, 4e, 3e), qui a son propre bloc, n'est pas touché.

⚠️ Si quelqu'un recolle un jour la migration 218, les trois anciennes fiches
reviennent au niveau Tle. C'est le prix de l'idempotence : 218 ne peut pas être
modifiée.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 36 fiches sous 5 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que la 234 n'a jamais été
exécutée en production (sondé le 19/08/2026) — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 3 anciennes fiches
déjà supprimées et les 36 neuves pas encore posées : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 3 fiches héritées partent, au niveau Tle SEULEMENT. Deux sont des
composites que les fiches neuves recouvrent entièrement ("Raconter au passé" se
lit désormais en "Le prétérit" et "Le parfait", "Le datif et les prépositions"
en trois fiches du chapitre 3) ; la troisième, "L'Allemagne d'aujourd'hui", est
une fiche de civilisation qui n'appartient à aucun chapitre du programme de
langue — même décision que pour "Le monde hispanique aujourd'hui" (244).
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.
Les trois DELETE sont bornés aux TROIS TITRES EXACTS et au seul niveau Tle. Sans
cette borne, un rejeu effacerait les quiz des 36 fiches neuves — le ménage
tourne avant les insertions à CHAQUE passage.
⚠️ Le titre "L'Allemagne d'aujourd'hui" est écrit avec l'apostrophe TYPOGRAPHIQUE
(U+2019), celle que porte la 218 et donc la base. Écrit avec l'apostrophe droite
(et son doublement SQL), le DELETE ne trouverait rien et la fiche de civilisation
survivrait, sans que la migration signale quoi que ce soit.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'allemand'
   AND c.level = 'Tle'
   AND c.title IN ('Raconter au passé',
                   'Le datif et les prépositions',
                   'L’Allemagne d’aujourd’hui');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'allemand'
   AND c.level = 'Tle'
   AND c.title IN ('Raconter au passé',
                   'Le datif et les prépositions',
                   'L’Allemagne d’aujourd’hui');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'allemand'
   AND c.level = 'Tle'
   AND c.title IN ('Raconter au passé',
                   'Le datif et les prépositions',
                   'L’Allemagne d’aujourd’hui');`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      chapitres: [
        // ---- Chapitre 1 du programme : La phrase -----------------------------
        {
          titre: 'La ponctuation',
          axe: 'La phrase',
          lecon: {
            titre: 'La virgule allemande n’est pas une respiration',
            cours: `En français, la virgule marque souvent une pause de la voix. En allemand, elle marque une **frontière grammaticale** : sa présence ou son absence est une **règle**, pas un choix de style.

## Virgule ou pas
| Devant… | Virgule ? | Exemple |
| Une **subordonnée** | **Oui**, toujours | *Ich weiß, dass er kommt* |
| Une subordonnée **enchâssée** | Oui, des **deux** côtés | *Das Buch, das ich lese, ist spannend* |
| *und*, *oder* | **Non**, en principe | *Ich lese, ich schreibe und ich lerne* |
| *aber*, *sondern*, *denn* | **Oui** | *Er ist arm, aber glücklich* |
| *um… zu*, *ohne… zu*, *statt… zu* | **Oui** | *Ich lerne Deutsch, um in Berlin zu studieren* |
| *zu* + infinitif simple | Facultative | *Ich versuche zu kommen* |

## Les guillemets et les deux-points
L’allemand ouvre **en bas** et ferme **en haut** : „…“ — et il emploie les **deux-points** avant le discours direct, là où le français met souvent une virgule.

*Er sagt: „Ich komme morgen.“*

## La majuscule
| Ce qui prend la majuscule | Exemple |
| **Tous** les noms communs, où qu’ils soient | *das Haus*, *die Freiheit*, *beim Essen* |
| Les adjectifs substantivés | *das Wichtigste* |
| Les infinitifs substantivés | *das Lesen* |
| Le *Sie* de politesse et ses formes | *Sie*, *Ihnen*, *Ihr* |

> Le *Sie* de politesse garde la majuscule, le *sie* qui signifie « elle » ou « ils » ne la prend pas. **C’est parfois la seule chose qui les distingue à l’écrit** — et l’oublier change le destinataire de la phrase.

## Le ß
| On écrit | Après quoi | Exemple |
| **ß** | Voyelle longue ou diphtongue | *Straße*, *heißen* |
| **ss** | Voyelle brève | *Fluss*, *dass* |

En Suisse, le *ß* n’existe pas : il s’écrit toujours *ss*.`,
          },
          questions: [
            ['Devant une subordonnée introduite par « dass », la virgule est…', ['Obligatoire', 'Facultative', 'Interdite', 'Remplacée par un tiret'], 0, 'La virgule allemande sépare des propositions : *Ich weiß, dass er kommt.*'],
            ['En allemand, on met une virgule devant « und » dans une énumération.', ['Vrai', 'Faux'], 1, 'Pas de virgule devant *und* ni *oder* ; mais elle est obligatoire devant *aber*, *sondern* et *denn*.'],
            ['Comment s’écrivent les guillemets allemands ?', ['En bas à l’ouverture, en haut à la fermeture', 'Avec des chevrons, comme en français', 'Les deux en haut, comme en anglais', 'Ils n’existent pas'], 0, '*Er sagt: „Ich komme.“* — et deux-points avant le discours direct.'],
            ['Quel groupe infinitif exige une virgule ?', ['Celui introduit par um… zu', 'Tout groupe contenant zu', 'Aucun groupe infinitif', 'Seulement celui introduit par dass'], 0, '*Ich lerne, um zu bestehen.* Idem pour *ohne… zu* et *statt… zu*.'],
            ['Un adjectif substantivé prend la majuscule.', ['Vrai', 'Faux'], 0, '*das Wichtigste*, *das Neue* : dès qu’un mot devient nom, il prend la majuscule.'],
            ['Qu’est-ce qui distingue « Sie » de « sie » à l’écrit ?', ['La majuscule du vouvoiement', 'L’accent sur le e', 'Rien du tout', 'La place dans la phrase'], 0, 'Le *Sie* de politesse et ses formes (*Ihnen*, *Ihr*) gardent la majuscule.'],
            ['Après une voyelle brève, on écrit…', ['ss, comme dans Fluss et dass', 'ß, comme dans Fluß et daß', 'un s simple', 'sz'], 0, '*ß* est réservé aux voyelles longues et aux diphtongues : *Straße*, *heißen*.'],
            ['Une subordonnée enchâssée dans la principale est encadrée de deux virgules.', ['Vrai', 'Faux'], 0, '*Das Buch, das ich lese, ist spannend.*'],
          ],
        },
        {
          titre: 'La syntaxe de la phrase déclarative',
          axe: 'La phrase',
          lecon: {
            titre: 'Le verbe en deuxième position, et le reste autour',
            cours: `L’ordre des mots allemand n’est **pas** libre : il est commandé par la place du verbe conjugué, qui sert de **pivot** à toute la phrase.

## La règle V2
Dans une déclarative, le verbe conjugué occupe **toujours la deuxième place** — non pas le deuxième **mot**, mais le deuxième **groupe**.

| Première position | Verbe | Le reste |
| *Ich* | *fahre* | *morgen nach Berlin* |
| *Morgen* | *fahre* | *ich nach Berlin* |
| *Nach Berlin* | *fahre* | *ich morgen* |

> Dès qu’autre chose que le sujet ouvre la phrase, le sujet passe **derrière** le verbe : c’est l’**inversion**. Écrire *Heute er geht…* est la faute la plus repérable d’une copie — elle se voit à la première ligne.

## La parenthèse verbale
Quand le verbe est en deux morceaux, le second **ferme la phrase**, à la toute fin.

| Type | Ouvrant | Fermant | Exemple |
| Temps composé | *habe* | Participe | *Ich habe gestern einen Film gesehen* |
| Modal | *muss* | Infinitif | *Ich muss heute Abend arbeiten* |
| Préverbe séparable | *stehe* | Préverbe | *Ich stehe um sieben Uhr auf* |

Tout ce qui compte est **enfermé entre les deux**. C’est cette parenthèse qui oblige à écouter une phrase allemande **jusqu’au bout** : la négation, le sens du verbe, tout arrive à la fin.

## L’ordre des compléments : TeKaMoLo
| Rang | Type | Exemple |
| **Te** | Temporel | *morgen* |
| **Ka** | Causal | *wegen der Arbeit* |
| **Mo** | Modal | *mit dem Zug* |
| **Lo** | Local | *nach München* |

*Ich fahre morgen wegen der Arbeit mit dem Zug nach München.*

## Datif avant accusatif — sauf pronom
| Cas | Ordre | Exemple |
| Deux groupes nominaux | **Datif** puis accusatif | *Ich gebe dem Kind das Buch* |
| L’accusatif est un **pronom** | Il **passe devant** | *Ich gebe es dem Kind* |

Le pronom aime le début de phrase : les pronoms compléments remontent juste après le verbe conjugué.`,
          },
          questions: [
            ['Dans une déclarative allemande, le verbe conjugué occupe…', ['La deuxième place', 'La première place', 'La dernière place', 'N’importe quelle place'], 0, 'La deuxième POSITION, c’est-à-dire le deuxième groupe, pas le deuxième mot.'],
            ['« Heute er geht ins Kino » est correct.', ['Vrai', 'Faux'], 1, 'Quand un autre élément ouvre la phrase, le sujet passe après le verbe : *Heute geht er…*'],
            ['Où se place l’infinitif dépendant d’un verbe de modalité ?', ['À la fin de la phrase', 'Juste après le modal', 'En première position', 'Avant le sujet'], 0, 'C’est la parenthèse verbale : *Ich muss heute Abend arbeiten.*'],
            ['Que signifie l’ordre TeKaMoLo ?', ['Temps, cause, manière, lieu', 'Temps, lieu, cause, manière', 'Lieu, temps, cause, manière', 'Cause, lieu, temps, manière'], 0, '*Ich fahre morgen wegen der Arbeit mit dem Zug nach München.*'],
            ['Avec deux groupes nominaux, l’ordre est datif puis accusatif.', ['Vrai', 'Faux'], 0, '*Ich gebe dem Kind das Buch.* L’ordre s’inverse si l’accusatif est un pronom.'],
            ['Comment traduire « Je le donne à l’enfant » ?', ['Ich gebe es dem Kind', 'Ich gebe dem Kind es', 'Ich es gebe dem Kind', 'Ich gebe dem es Kind'], 0, 'Le pronom accusatif remonte devant le groupe au datif.'],
            ['Dans « Ich stehe um sieben Uhr auf », « auf » est…', ['Le préverbe séparable, rejeté en fin de phrase', 'Une préposition de lieu', 'Un adverbe de temps', 'Une faute de frappe'], 0, '*aufstehen* : le préverbe ferme la parenthèse verbale.'],
            ['« Nach Berlin fahre ich morgen » est une phrase correcte.', ['Vrai', 'Faux'], 0, 'N’importe quel groupe peut occuper la première place, tant que le verbe garde la deuxième.'],
          ],
        },
        {
          titre: 'La phrase interrogative',
          axe: 'La phrase',
          lecon: {
            titre: 'Question fermée, question ouverte, question indirecte',
            cours: `Trois façons de poser une question, et **trois places différentes** pour le verbe.

## Les trois questions
| Type | Place du verbe | Exemple |
| **Fermée** | **Première** position | *Kommst du morgen?* |
| **Ouverte** | Deuxième position, après le mot en w- | *Wann kommst du?* |
| **Indirecte** | **À la fin** : c’est une subordonnée | *Ich weiß nicht, wann er kommt* |

## Les mots interrogatifs
| Mot | Sens | Remarque |
| *wer* | Qui | Il **se décline** : *wen*, *wem*, *wessen* |
| *was* | Quoi | |
| *warum, wieso, weshalb* | Pourquoi | Interchangeables |
| *wie* | Comment | |
| *wo* | Où, **sans** mouvement | |
| *wohin* | Où, **avec** mouvement | |
| *woher* | D’où | |
| *welcher / welche / welches* | Lequel | Il se décline |
| *was für ein* | Quelle sorte de | |

## Doch, la réponse qui contredit
Face à une question **négative**, *ja* est impossible.

| La question | La réponse qui contredit |
| *Du kommst nicht mit?* | *Doch!* — « si ! » |

Le français a la même finesse avec « si », l’anglais non.

## La question indirecte
Le verbe part **à la fin**, et le point d’interrogation disparaît.

| Avec mot interrogatif | Sans mot interrogatif |
| *Ich weiß nicht, wann er kommt* | *Ich frage mich, ob er kommt* |

> Ne **jamais** traduire ce « si »-là par *wenn* : *wenn* introduit une **condition** ou un **moment**, *ob* une **alternative**. C’est une faute de sens, pas de forme.

## wo + préposition
Pour interroger sur une **chose** — jamais sur une personne — l’allemand soude *wo(r)-* et la préposition.

| Sur une chose | Sur une personne |
| *Worauf wartest du?* | *Auf wen wartest du?* |
| *Womit schreibst du?* | *Mit wem sprichst du?* |
| *Woran denkst du?* | *An wen denkst du?* |`,
          },
          questions: [
            ['Dans une question fermée, où se place le verbe conjugué ?', ['En première position', 'En deuxième position', 'À la fin de la phrase', 'Juste après le sujet'], 0, '*Kommst du morgen?* La réponse attendue est *ja*, *nein* ou *doch*.'],
            ['Dans une question ouverte, le verbe reste en deuxième position.', ['Vrai', 'Faux'], 0, 'Le mot en *w-* occupe la première place : *Wann kommst du?*'],
            ['Quelle est la forme accusative de « wer » ?', ['wen', 'wem', 'wessen', 'was'], 0, '*Wen siehst du?* — *wem* est le datif, *wessen* le génitif.'],
            ['Comment répondre « si ! » à « Du kommst nicht mit? »', ['Doch!', 'Ja!', 'Nein!', 'So!'], 0, 'Après une question négative, *ja* est impossible : c’est *doch* qui contredit.'],
            ['Dans une question indirecte, le verbe conjugué se place…', ['À la fin de la subordonnée', 'En première position', 'En deuxième position', 'Devant le sujet'], 0, '*Ich weiß nicht, wann er kommt.*'],
            ['Le « si » d’une question indirecte se traduit par « wenn ».', ['Vrai', 'Faux'], 1, 'C’est *ob* : *Ich frage mich, ob er kommt.* *wenn* introduit une condition ou un moment.'],
            ['Que demande « wohin » ?', ['La destination d’un déplacement', 'Le lieu où l’on se trouve', 'Le lieu d’où l’on vient', 'La cause'], 0, '*wo* = sans mouvement, *wohin* = vers où, *woher* = d’où.'],
            ['Comment demander « À quoi penses-tu ? »', ['Woran denkst du?', 'An was denkst du nicht?', 'Wen denkst du?', 'Wo denkst du?'], 0, 'Pour une CHOSE, l’allemand soude *wo(r)-* et la préposition.'],
          ],
        },
        {
          titre: 'La négation dans la phrase (nicht / kein)',
          axe: 'La phrase',
          lecon: {
            titre: 'Choisir entre nicht et kein, et savoir où le poser',
            cours: `Deux questions à se poser, et elles comptent autant l’une que l’autre : **quel mot de négation**, et **à quelle place**.

## kein ou nicht
| On emploie | Quand le nom est… | Exemple |
| **kein** | Précédé de *ein*, ou **sans article** | *Ich habe kein Auto* · *Ich trinke keinen Kaffee* |
| **nicht** | Précédé d’un **article défini**, d’un possessif, d’un démonstratif | *Ich kenne den Mann nicht* · *Das ist nicht mein Buch* |

*kein* se décline exactement comme *ein* — et possède **en plus** un pluriel : *keine Freunde*.

On nie aussi avec *nicht* un verbe, un adjectif, un adverbe ou une phrase entière.

## La place de nicht
| Ce qu’on nie | Où va *nicht* | Exemple |
| Toute la phrase | **Le plus à droite possible**, devant le second morceau du verbe | *Ich habe ihn gestern nicht gesehen* |
| Un seul mot | **Devant** ce mot | *Ich fahre nicht morgen, sondern heute* |
| Un attribut | Devant | *Das Buch ist nicht interessant* |
| Un lieu **directionnel** | Devant | *Ich gehe nicht ins Kino* |
| Un COD **défini** | **Après** | *Ich lese das Buch nicht* |

## Les autres mots négatifs
| Mot | Sens |
| *nichts* | Rien |
| *niemand* | Personne |
| *nie / niemals* | Jamais |
| *nirgends* | Nulle part |
| *noch nicht* | Pas encore |
| *nicht mehr* | Ne… plus |
| *weder… noch* | Ni… ni |

> Deux négations **ne s’additionnent pas** en allemand : contrairement à l’espagnol, **une seule suffit**. *Ich sehe nichts*, jamais « ich sehe nicht nichts ».

## sondern après une négation
| Conjonction | Ce qu’elle fait | Exemple |
| **sondern** | Elle **rectifie** après une négation | *Er ist nicht Deutscher, sondern Österreicher* |
| **aber** | Elle **oppose** sans rectifier | *Er ist nicht reich, aber glücklich* |`,
          },
          questions: [
            ['Comment nier « Ich habe ein Auto » ?', ['Ich habe kein Auto', 'Ich habe nicht ein Auto', 'Ich habe nicht Auto', 'Ich habe ein Auto nicht'], 0, 'Devant un nom avec *ein* ou sans article, c’est *kein*.'],
            ['Comment nier « Ich kenne den Mann » ?', ['Ich kenne den Mann nicht', 'Ich kenne keinen Mann', 'Ich kenne den Mann kein', 'Ich nicht kenne den Mann'], 0, 'Le nom porte un article défini : la négation est *nicht*, rejetée à droite.'],
            ['« kein » se décline comme « ein » et possède un pluriel.', ['Vrai', 'Faux'], 0, '*keine Freunde*, *keinen Kaffee*, *keinem Kind*.'],
            ['Où se place « nicht » par rapport à un attribut ?', ['Devant l’attribut', 'Après l’attribut', 'En fin de phrase', 'Devant le sujet'], 0, '*Das Buch ist nicht interessant.*'],
            ['Dans « Ich habe ihn gestern nicht gesehen », « nicht » se place…', ['Devant le participe passé', 'Après le participe passé', 'Juste après l’auxiliaire', 'En première position'], 0, '*nicht* va le plus à droite possible, mais reste devant le second morceau du verbe.'],
            ['En allemand, la double négation renforce la négation.', ['Vrai', 'Faux'], 1, 'Une seule négation suffit : *Ich sehe nichts.* C’est l’espagnol qui double.'],
            ['Que signifie « nicht mehr » ?', ['Ne… plus', 'Pas encore', 'Jamais', 'Nulle part'], 0, '*noch nicht* signifie « pas encore ».'],
            ['Après une négation, pour rectifier, on emploie…', ['sondern', 'aber', 'denn', 'oder'], 0, '*Er ist nicht Deutscher, sondern Österreicher.* *aber* oppose sans rectifier.'],
          ],
        },
        {
          titre: 'La phrase subordonnée',
          axe: 'La phrase',
          lecon: {
            titre: 'La conjonction envoie le verbe à la fin',
            cours: `Une subordonnée allemande se reconnaît à **deux** signes : une conjonction en tête, et le **verbe conjugué à la toute fin**.

## Les conjonctions de subordination
| Conjonction | Sens |
| *dass* | Que |
| *ob* | Si — alternative |
| *weil*, *da* | Parce que, puisque |
| *damit* | Pour que |
| *wenn* | Si ; quand, répétable |
| *als* | Quand — **une fois** dans le passé |
| *obwohl* | Bien que |
| *während* | Pendant que, alors que |
| *bevor*, *nachdem*, *seitdem*, *bis* | Avant que, après que, depuis que, jusqu’à ce que |
| *falls* | Au cas où |
| *sodass* | Si bien que |

## Le verbe à la fin
| Cas | Ce qui ferme la phrase | Exemple |
| Verbe simple | Le verbe conjugué | *…, weil ich krank bin* |
| Temps composé | L’**auxiliaire** conjugué, après le participe | *…, weil ich gearbeitet habe* |
| Modal | Le **modal** conjugué, après l’infinitif | *…, weil ich arbeiten muss* |

## La subordonnée en tête
Placée devant, elle occupe **la première position** de la phrase entière : le verbe de la principale suit **immédiatement**, et le sujet passe derrière.

*Weil ich krank bin, bleibe ich zu Hause.*

> Deux verbes se retrouvent alors **côte à côte**, séparés par la seule virgule. C’est correct — et c’est même le signe que la construction est juste.

## Trois paires à ne pas confondre
| | Le premier | Le second |
| **weil / denn** | *weil* : subordination, verbe à la fin | *denn* : **coordination**, ordre inchangé |
| **wenn / als** | *wenn* : présent, futur, répétition passée | *als* : un fait **unique** au passé |
| **wenn / wann** | *wenn* : condition ou moment | *wann* : **uniquement** dans une question |

> Piège classique : « quand j’étais petit » ne se dit **jamais** *wann ich klein war*, mais *als ich klein war*.`,
          },
          questions: [
            ['Dans une subordonnée, le verbe conjugué se place…', ['À la fin de la subordonnée', 'En deuxième position', 'Juste après la conjonction', 'En première position'], 0, '*Ich bleibe zu Hause, weil ich krank bin.*'],
            ['Dans « …, weil ich gearbeitet habe », quel mot ferme la phrase ?', ['L’auxiliaire conjugué habe', 'Le participe gearbeitet', 'Le sujet ich', 'La conjonction weil'], 0, 'Le verbe CONJUGUÉ passe après le participe : c’est propre à la subordonnée.'],
            ['« denn » envoie le verbe à la fin, comme « weil ».', ['Vrai', 'Faux'], 1, '*denn* est une conjonction de coordination : *Ich bleibe zu Hause, denn ich bin krank.*'],
            ['Si la subordonnée ouvre la phrase, que se passe-t-il dans la principale ?', ['Le verbe suit immédiatement la virgule', 'Le sujet suit immédiatement la virgule', 'Rien ne change', 'La principale perd son verbe'], 0, '*Weil ich krank bin, bleibe ich zu Hause.* La subordonnée occupe la première position.'],
            ['Quelle conjonction traduit « quand » pour un fait unique du passé ?', ['als', 'wenn', 'wann', 'ob'], 0, '*Als ich zehn Jahre alt war…* — *wenn* vaut pour la répétition ou le présent.'],
            ['« wann » peut introduire une subordonnée de temps ordinaire.', ['Vrai', 'Faux'], 1, '*wann* n’apparaît que dans une question, directe ou indirecte.'],
            ['Que signifie « obwohl » ?', ['Bien que', 'Parce que', 'Pour que', 'Depuis que'], 0, '*Obwohl es regnet, gehe ich spazieren.*'],
            ['Quelle conjonction exprime le but ?', ['damit', 'weil', 'obwohl', 'nachdem'], 0, '*Ich lerne, damit ich das Abitur bestehe.*'],
          ],
        },
        {
          titre: 'La phrase subordonnée relative',
          axe: 'La phrase',
          lecon: {
            titre: 'Le genre vient d’avant, le cas vient d’après',
            cours: `La relative complète un nom. Le pronom relatif allemand ressemble à l’article défini — et se décline comme lui, à **trois formes près**.

## La règle en une phrase
> Le pronom prend le **genre et le nombre de l’antécédent**, mais le **cas de sa fonction dans la relative**. C’est tout le raisonnement — et il se fait **dans cet ordre**.

| Phrase | Genre, venu d’avant | Cas, venu d’après |
| *Der Mann, der dort steht* | Masculin | Sujet : nominatif |
| *Der Mann, den ich sehe* | Masculin | COD : accusatif |
| *Der Mann, dem ich helfe* | Masculin | COI : datif, car *helfen* régit le datif |

## Les formes
| Cas | Masculin | Féminin | Neutre | Pluriel |
| Nominatif | *der* | *die* | *das* | *die* |
| Accusatif | *den* | *die* | *das* | *die* |
| Datif | *dem* | *der* | *dem* | *denen* |
| Génitif | *dessen* | *deren* | *dessen* | *deren* |

Trois formes seulement diffèrent de l’article défini : *dessen*, *deren*, *denen*. Tout le reste est déjà connu.

## Les règles de construction
| Règle | Exemple |
| Virgules obligatoires, verbe **à la fin** | *Das Buch, das ich gestern gekauft habe, ist teuer* |
| La **préposition** reste devant le relatif — et commande le cas | *Der Freund, mit dem ich fahre* |
| Après *dessen* et *deren*, le nom n’a **pas d’article** | *Der Mann, dessen Auto kaputt ist* |

## was, et non das
| Après… | Le relatif est |
| *alles, nichts, etwas, viel, wenig* | *was* |
| Un superlatif neutre | *was* |
| Une **phrase entière** | *was* |

*Alles, was du sagst, ist richtig.* · *Er kam zu spät, was mich geärgert hat.*`,
          },
          questions: [
            ['Le pronom relatif prend son genre de l’antécédent et son cas…', ['De sa fonction dans la relative', 'De la fonction de l’antécédent', 'Du verbe de la principale', 'Il ne prend jamais de cas'], 0, 'C’est le raisonnement en deux temps : genre avant, cas après.'],
            ['Comment traduire « l’homme que je vois » ?', ['Der Mann, den ich sehe', 'Der Mann, der ich sehe', 'Der Mann, dem ich sehe', 'Der Mann, dessen ich sehe'], 0, 'Masculin + fonction de COD → accusatif *den*.'],
            ['Quelle est la forme du relatif au datif pluriel ?', ['denen', 'den', 'deren', 'die'], 0, '*Die Freunde, denen ich helfe.* C’est l’une des trois formes qui diffèrent de l’article.'],
            ['Dans une relative, le verbe conjugué reste en deuxième position.', ['Vrai', 'Faux'], 1, 'La relative est une subordonnée : le verbe conjugué ferme la proposition.'],
            ['Où se place la préposition dans une relative ?', ['Devant le pronom relatif', 'À la fin de la relative', 'Après le verbe', 'Elle disparaît'], 0, '*Die Stadt, in der ich wohne.* Et c’est elle qui commande le cas.'],
            ['Comment traduire « l’homme dont la voiture est en panne » ?', ['Der Mann, dessen Auto kaputt ist', 'Der Mann, deren Auto kaputt ist', 'Der Mann, den Auto kaputt ist', 'Der Mann, wessen Auto kaputt ist'], 0, 'Génitif masculin *dessen*, et le nom qui suit n’a pas d’article.'],
            ['Après « alles », « nichts » ou « etwas », le relatif est…', ['was', 'das', 'wer', 'dessen'], 0, '*Alles, was du sagst, ist richtig.*'],
            ['« deren » sert au génitif féminin et au génitif pluriel.', ['Vrai', 'Faux'], 0, '*Die Frau, deren Sohn…* / *Die Leute, deren Kinder…*'],
          ],
        },
        {
          titre: 'La phrase à la voix passive',
          axe: 'La phrase',
          lecon: {
            titre: 'werden + participe II, et le fameux worden',
            cours: `Le passif allemand se construit avec **werden**, **jamais** avec *sein*. C’est la première chose à retenir, parce que le français dit « **être** construit » et pousse directement à la faute.

## Le passif d’action
**werden** conjugué + **participe II** rejeté à la fin.

| Temps | Forme | Exemple |
| Présent | *wird* + participe | *Das Haus wird gebaut* |
| Prétérit | *wurde* + participe | *Das Haus wurde gebaut* |
| Parfait | *ist* + participe + *worden* | *Das Haus ist gebaut worden* |
| Futur | *wird* + participe + *werden* | *Das Haus wird gebaut werden* |

> Au parfait du passif, le participe de *werden* **perd son ge-** : c’est **worden**. *Geworden* est réservé au verbe *werden* employé seul, au sens de « devenir » — *Er ist Arzt geworden*.

## Passif d’action ou passif d’état
| | *werden* + participe | *sein* + participe |
| Ce qu’il décrit | Une **action** en cours | Un **résultat** acquis |
| Exemple | *Das Haus wird gebaut* | *Das Haus ist gebaut* |
| L’image | Le film | La photo |

## L’agent
| Préposition | Cas | Quand l’employer | Exemple |
| **von** | Datif | Une personne, une force agissante | *Das Buch wurde von Goethe geschrieben* |
| **durch** | Accusatif | Un moyen, un intermédiaire | *Die Stadt wurde durch ein Erdbeben zerstört* |

## Deux constructions à connaître
| Construction | Ce qu’elle permet | Exemple |
| Le passif **impersonnel** | Mettre au passif un verbe **sans COD** | *Hier wird getanzt* — « ici, on danse » |
| Le passif avec **modal** | Le modal se conjugue, le passif passe à l’infinitif | *Die Arbeit muss heute gemacht werden* |

> Le tour le plus fréquent à l’oral n’est pourtant pas le passif, mais **man** : *Man baut ein Haus.* Savoir passer de l’un à l’autre est un réflexe qui paie au bac.`,
          },
          questions: [
            ['Avec quel auxiliaire se construit le passif d’action ?', ['werden', 'sein', 'haben', 'lassen'], 0, '*Das Haus wird gebaut.* C’est *sein* qui donne le passif d’état.'],
            ['Comment dit-on « la maison a été construite » ?', ['Das Haus ist gebaut worden', 'Das Haus ist gebaut geworden', 'Das Haus hat gebaut worden', 'Das Haus war gebaut'], 0, 'Au parfait du passif, le participe de *werden* perd son *ge-* : *worden*.'],
            ['« Das Haus ist gebaut » exprime…', ['Un résultat, un état', 'Une action en cours', 'Un futur', 'Une supposition'], 0, 'C’est le passif d’état : la photo, pas le film.'],
            ['Quel mot introduit l’agent quand c’est une personne ?', ['von + datif', 'durch + accusatif', 'mit + datif', 'für + accusatif'], 0, '*Das Buch wurde von Goethe geschrieben.* *durch* introduit un moyen.'],
            ['L’allemand peut mettre au passif un verbe sans complément d’objet.', ['Vrai', 'Faux'], 0, 'C’est le passif impersonnel : *Hier wird getanzt.*'],
            ['Comment traduire « le travail doit être fait aujourd’hui » ?', ['Die Arbeit muss heute gemacht werden', 'Die Arbeit muss heute gemacht worden', 'Die Arbeit wird heute machen müssen', 'Die Arbeit ist heute gemacht müssen'], 0, 'Le modal se conjugue, le passif passe à l’infinitif en fin de phrase.'],
            ['« Er ist Arzt geworden » contient un passif.', ['Vrai', 'Faux'], 1, 'C’est *werden* employé seul, au sens de « devenir » — d’où *geworden* et non *worden*.'],
            ['Quelle tournure active remplace souvent le passif à l’oral ?', ['man + verbe actif', 'es gibt', 'sein + zu', 'lassen'], 0, '*Man baut ein Haus* est plus courant que *Ein Haus wird gebaut.*'],
          ],
        },
        {
          titre: 'La proposition infinitive',
          axe: 'La phrase',
          lecon: {
            titre: 'zu + infinitif, et les cas où zu disparaît',
            cours: `Le groupe infinitif allemand **ferme la phrase**, et son *zu* obéit à des règles simples mais **sans exception**.

## La place de zu
*zu* se place juste **devant l’infinitif**, en fin de groupe : *Ich versuche, pünktlich zu sein*.

> Avec un verbe à **préverbe séparable**, *zu* s’**intercale** entre le préverbe et le radical, **en un seul mot** : *einzukaufen*, *aufzustehen*, *anzurufen*. C’est le détail qui distingue une copie sûre.

## Avec ou sans zu
| Les verbes qui **appellent** *zu* | Les verbes qui le **refusent** |
| *versuchen, beginnen, vergessen* | Les six **modaux** : *Ich kann schwimmen* |
| *hoffen, versprechen, vorhaben* | *sehen, hören, lassen* : *Ich höre ihn kommen* |
| *Lust haben, Zeit haben* | Les verbes de mouvement : *Ich gehe schwimmen* |
| *es ist wichtig / schwer / möglich* | *bleiben, werden, helfen* |

## Les trois groupes à virgule obligatoire
| Groupe | Ce qu’il exprime | Exemple |
| **um… zu** | Le **but** | *Ich lerne Deutsch, um in Berlin zu studieren* |
| **ohne… zu** | La privation | *Er ging weg, ohne etwas zu sagen* |
| **(an)statt… zu** | La substitution | *Er spielt, statt zu arbeiten* |

> *um… zu* exige que les **deux propositions aient le même sujet**. Si le sujet change, il faut passer à **damit** : *Ich erkläre es, damit du es verstehst*.

## sein et haben + zu
Deux tours brefs, très fréquents à l’écrit.

| Tour | Sa valeur | Exemple |
| *sein* + *zu* + infinitif | **Passive** : doit ou peut être fait | *Die Arbeit ist heute zu machen* |
| *haben* + *zu* + infinitif | **Active** : avoir à faire | *Ich habe viel zu tun* |

Un groupe infinitif n’a **jamais** de sujet propre : c’est ce qui le distingue d’une subordonnée en *dass*.`,
          },
          questions: [
            ['Où se place « zu » avec un verbe à préverbe séparable ?', ['Entre le préverbe et le radical, en un seul mot', 'Devant le préverbe', 'Après l’infinitif', 'Il disparaît'], 0, '*einzukaufen*, *aufzustehen*, *anzurufen*.'],
            ['Après un verbe de modalité, l’infinitif prend « zu ».', ['Vrai', 'Faux'], 1, '*Ich kann schwimmen.* Les modaux, *sehen*, *hören* et *lassen* refusent *zu*.'],
            ['Comment traduire « J’apprends l’allemand pour étudier à Berlin » ?', ['Ich lerne Deutsch, um in Berlin zu studieren', 'Ich lerne Deutsch, für in Berlin studieren', 'Ich lerne Deutsch zu studieren in Berlin', 'Ich lerne Deutsch, damit in Berlin zu studieren'], 0, '*um… zu* exprime le but, avec virgule obligatoire.'],
            ['Quand faut-il employer « damit » plutôt que « um… zu » ?', ['Quand les deux propositions n’ont pas le même sujet', 'Quand la phrase est négative', 'Quand le verbe est séparable', 'Jamais'], 0, '*Ich erkläre es, damit du es verstehst.*'],
            ['Que signifie « ohne etwas zu sagen » ?', ['Sans rien dire', 'Au lieu de parler', 'Pour ne rien dire', 'En disant quelque chose'], 0, '*statt… zu* signifie « au lieu de ».'],
            ['« Ich habe viel zu tun » signifie…', ['J’ai beaucoup à faire', 'Je dois être fait', 'Je fais beaucoup', 'J’aime beaucoup faire'], 0, '*haben + zu* a une valeur active ; *sein + zu* une valeur passive.'],
            ['« Die Arbeit ist heute zu machen » a une valeur passive.', ['Vrai', 'Faux'], 0, 'Elle équivaut à *Die Arbeit muss heute gemacht werden.*'],
            ['Après « Ich gehe », le verbe suivant prend « zu ».', ['Vrai', 'Faux'], 1, 'Les verbes de mouvement s’en passent : *Ich gehe schwimmen.*'],
          ],
        },
        // ---- Chapitre 2 du programme : Le groupe nominal ---------------------
        {
          titre: 'Les déterminants définis et indéfinis sujets',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'der, die, das — ein, eine, ein',
            cours: `Le déterminant allemand porte à lui seul **trois** informations : le genre, le nombre et le cas. C’est lui qui fait la grammaire de la phrase, bien plus que la terminaison du nom.

## Trois genres, et aucun hasard à espérer
| Article | Genre | Le piège français |
| **der** | Masculin | *der Mond* — la lune |
| **die** | Féminin | *die Sonne* — le soleil |
| **das** | Neutre | *das Mädchen* — la jeune fille |

*Mädchen* est neutre parce que **tous** les diminutifs en *-chen* et *-lein* le sont : la grammaire l’emporte sur le sens. On apprend donc chaque nom **avec son article**.

## Les repères de genre
| Genre | Ce qui le signale |
| **Masculin** | Jours, mois, saisons, points cardinaux ; noms en *-er*, *-ling*, *-ismus* |
| **Féminin** | Noms en *-ung*, *-heit*, *-keit*, *-schaft*, *-ion*, *-ei*, *-ie* |
| **Neutre** | Noms en *-chen*, *-lein*, *-um*, *-ment* ; tout **infinitif substantivé** : *das Essen* |

## Le pluriel et l’indéfini
| | Défini | Indéfini |
| Singulier | *der / die / das* | *ein / eine / ein* |
| **Pluriel** | **die** pour les trois genres | **Aucun** : *Ich sehe Kinder* |

C’est la seule simplification que l’allemand accorde. Et si *ein* n’a pas de pluriel, sa négation *kein* en a un : *keine Kinder*.

## Le sujet est au nominatif
Le sujet est **toujours** au nominatif — la forme donnée par le dictionnaire.

> Attention à *das* : il est à la fois **article** neutre (*das Buch*) et **démonstratif invariable** (*Das ist mein Buch* — ça, c’est mon livre). Dans ce second emploi, il ne s’accorde à rien du tout.

## L’absence d’article
| Cas | Exemple | Le français dirait |
| Métier après *sein* ou *werden* | *Er ist Lehrer* | « Il est **un** professeur » — non |
| Nom de matière | *Ich trinke Wasser* | « de l’eau » |
| Plupart des noms de pays | *Ich fahre nach Deutschland* | « en Allemagne » |`,
          },
          questions: [
            ['Quel est l’article défini neutre ?', ['das', 'der', 'die', 'den'], 0, '*das Buch*, *das Haus*, *das Kind*.'],
            ['Au pluriel, l’article défini est « die » pour les trois genres.', ['Vrai', 'Faux'], 0, '*die Männer*, *die Frauen*, *die Kinder*.'],
            ['Quel est le genre de « Mädchen » ?', ['Neutre', 'Féminin', 'Masculin', 'Il n’en a pas'], 0, 'Tous les diminutifs en *-chen* et *-lein* sont neutres, quel que soit le sens.'],
            ['Les noms en -ung sont généralement…', ['Féminins', 'Masculins', 'Neutres', 'Sans genre'], 0, '*die Zeitung*, *die Wohnung*, *die Meinung*. Comme les noms en *-heit* et *-keit*.'],
            ['L’article indéfini « ein » possède un pluriel.', ['Vrai', 'Faux'], 1, 'On dit simplement *Ich sehe Kinder*. Seule sa négation *kein* a un pluriel.'],
            ['À quel cas se met le sujet de la phrase ?', ['Au nominatif', 'À l’accusatif', 'Au datif', 'Au génitif'], 0, 'C’est la forme du dictionnaire : *Der Hund schläft.*'],
            ['Comment traduire « il est professeur » ?', ['Er ist Lehrer', 'Er ist ein Lehrer', 'Er ist der Lehrer', 'Er ist einen Lehrer'], 0, 'Pas d’article devant un nom de métier après *sein* ou *werden*.'],
            ['Dans « Das ist mein Buch », « das » est un article neutre.', ['Vrai', 'Faux'], 1, 'C’est un démonstratif invariable qui signifie « ça » : il ne s’accorde à rien.'],
          ],
        },
        {
          titre: 'Les déterminants et leurs déclinaisons',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Quatre cas, deux familles de déterminants',
            cours: `Tout le système allemand tient dans un tableau de **quatre cas** — et dans le fait que presque tous les déterminants se déclinent **de la même façon**.

## À quoi sert chaque cas
| Cas | Sa fonction |
| **Nominatif** | Le sujet, et l’attribut après *sein*, *werden*, *bleiben* |
| **Accusatif** | Le COD, et certaines prépositions |
| **Datif** | Le COI, et beaucoup de prépositions |
| **Génitif** | Le complément du nom : la possession |

## L’article défini
| Cas | Masculin | Féminin | Neutre | Pluriel |
| Nominatif | *der* | *die* | *das* | *die* |
| Accusatif | **den** | *die* | *das* | *die* |
| Datif | *dem* | *der* | *dem* | **den** |
| Génitif | *des* | *der* | *des* | *der* |

## L’article indéfini
| Cas | Masculin | Féminin | Neutre |
| Nominatif | *ein* | *eine* | *ein* |
| Accusatif | **einen** | *eine* | *ein* |
| Datif | *einem* | *einer* | *einem* |
| Génitif | *eines* | *einer* | *eines* |

**Se déclinent exactement pareil** : *kein* et **tous** les possessifs — *mein, dein, sein, ihr, unser, euer, Ihr* — qui, eux, ont un pluriel : *meine, meine, meinen, meiner*.

## Les déterminants en der-
*dieser*, *jeder* (sans pluriel), *welcher*, *mancher*, *solcher*, *aller* prennent les **terminaisons de l’article défini** : *diesen Mann*, *jedem Kind*, *welche Frau*.

## Les deux marques à ne pas oublier
| Cas | Ce qui change en plus | Exemple |
| **Datif pluriel** | Le **nom** prend un -n | *mit den Kindern*, *aus den Ländern* |
| **Génitif** masculin et neutre | Le nom prend -(e)s | *das Auto des Vaters* |

> Le raccourci qui fait gagner du temps : **le masculin est le seul genre à changer entre nominatif et accusatif**. Si un exercice paraît difficile, c’est presque toujours d’un masculin qu’il s’agit.`,
          },
          questions: [
            ['À quel cas se met le complément d’objet direct ?', ['À l’accusatif', 'Au datif', 'Au nominatif', 'Au génitif'], 0, 'Le datif est celui du complément d’objet second.'],
            ['Que devient « der » au datif ?', ['dem', 'den', 'des', 'der'], 0, '*mit dem Mann*. *den* est l’accusatif, *des* le génitif.'],
            ['Que devient « die » (féminin) au datif ?', ['der', 'dem', 'den', 'die'], 0, 'Piège classique : *der* est à la fois le masculin nominatif et le féminin datif.'],
            ['Au datif pluriel, le nom prend un -n supplémentaire.', ['Vrai', 'Faux'], 0, '*mit den Kindern*, *aus den Ländern*.'],
            ['Les possessifs se déclinent comme…', ['ein et kein', 'l’article défini', 'les adjectifs forts', 'ils ne se déclinent pas'], 0, 'D’où leur nom de « déterminants en ein- » : *meinen Bruder*, *meiner Schwester*.'],
            ['« dieser » prend les terminaisons de l’article défini.', ['Vrai', 'Faux'], 0, '*diesen Mann*, *diesem Kind*, *dieser Frau*. Comme *jeder* et *welcher*.'],
            ['Au génitif masculin, le nom prend…', ['-(e)s', '-n', '-er', 'rien du tout'], 0, '*das Auto des Vaters*, *das Ende des Jahres*.'],
            ['Quel genre change entre le nominatif et l’accusatif ?', ['Le masculin seul', 'Le féminin seul', 'Le neutre seul', 'Les trois genres'], 0, '*der* → *den*, *ein* → *einen*. Féminin, neutre et pluriel ne bougent pas.'],
          ],
        },
        {
          titre: 'Les pronoms personnels',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'ich, mich, mir — et l’ordre des pronoms',
            cours: `Un pronom personnel remplace un groupe nominal : il en garde le **genre** et prend le **cas de sa nouvelle fonction**.

## Les trois séries
| Personne | Nominatif | Accusatif | Datif |
| 1re sing. | *ich* | *mich* | *mir* |
| 2e sing. | *du* | *dich* | *dir* |
| 3e masc. | *er* | *ihn* | *ihm* |
| 3e fém. | *sie* | *sie* | *ihr* |
| 3e neutre | *es* | *es* | *ihm* |
| 1re plur. | *wir* | *uns* | *uns* |
| 2e plur. | *ihr* | *euch* | *euch* |
| 3e plur. | *sie* | *sie* | *ihnen* |
| Politesse | *Sie* | *Sie* | *Ihnen* |

## Le genre grammatical commande
| L’objet | On le reprend par |
| *Der Tisch* | *Er ist alt* |
| *Die Lampe* | *Sie ist neu* |
| *Das Buch* | *Es ist neu* |

> Traduire mécaniquement une chose par *es* est une faute que les correcteurs repèrent **immédiatement** : en allemand, une table est « il ».

## L’ordre des pronoms
| Ce qu’on a | L’ordre | Exemple |
| Deux **groupes nominaux** | Datif puis accusatif | *Ich gebe dem Kind das Buch* |
| Deux **pronoms** | **Accusatif** puis datif | *Ich gebe es dir* |

Règle unique qui couvre les deux : **le pronom passe devant, et l’accusatif pronom passe devant tout**.

Leur place : juste **après le verbe conjugué** — et en cas d’inversion, ils peuvent précéder le sujet nominal : *Gestern hat mich mein Vater angerufen*.

## Deux cas particuliers
| Mot | Ce qu’il est | Ses formes |
| *Sie* de politesse | **Majuscule** toujours, conjugaison de la 3e du pluriel | *Sie*, *Ihnen*, *Ihr* |
| *man* | Un pronom **indéfini**, pas personnel | Décliné *einen*, *einem* |

## es, le pronom à tout faire
| Emploi | Exemple |
| Sujet apparent | *Es regnet* · *Es gibt…* |
| Reprise d’une proposition | *Ich weiß es* |
| Simple ouverture de phrase | *Es kommen viele Leute* |

Dans ce dernier cas, *es* **disparaît** dès qu’un autre élément prend la première place.`,
          },
          questions: [
            ['Quel est le pronom accusatif de « er » ?', ['ihn', 'ihm', 'sie', 'es'], 0, '*Ich sehe ihn.* *ihm* est le datif.'],
            ['Comment reprendre « der Tisch » par un pronom ?', ['er', 'es', 'sie', 'ihn'], 0, 'Le genre GRAMMATICAL commande : un objet masculin se reprend par *er*.'],
            ['Quel est le pronom datif de « sie » (elle) ?', ['ihr', 'ihn', 'ihnen', 'sie'], 0, '*Ich helfe ihr.* Ne pas le confondre avec *ihr* = vous (2e personne du pluriel).'],
            ['Avec deux pronoms compléments, l’ordre est…', ['Accusatif puis datif', 'Datif puis accusatif', 'Indifférent', 'Toujours alphabétique'], 0, '*Ich gebe es dir* — l’inverse de l’ordre des groupes nominaux.'],
            ['« Sie » de politesse se conjugue comme la 3e personne du pluriel.', ['Vrai', 'Faux'], 0, '*Können Sie mir helfen?* Et il garde toujours sa majuscule.'],
            ['Dans « Es regnet », « es » est…', ['Un sujet apparent', 'Un COD', 'Un possessif', 'Une faute'], 0, 'Comme dans *Es gibt* : un sujet grammatical vide.'],
            ['« man » se décline « einen » à l’accusatif et « einem » au datif.', ['Vrai', 'Faux'], 0, '*Das macht einen müde.* C’est un pronom indéfini, pas un pronom personnel.'],
            ['Où remontent les pronoms compléments dans la phrase ?', ['Juste après le verbe conjugué', 'À la fin de la phrase', 'Avant le verbe conjugué', 'Après le participe passé'], 0, '*Gestern hat mich mein Vater angerufen* : ils peuvent même précéder le sujet nominal.'],
          ],
        },
        {
          titre: 'Les pronoms démonstratifs',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'dieser, jener — et le der qui montre du doigt',
            cours: `Montrer, désigner, insister : l’allemand a trois façons de le faire, de la plus **neutre** à la plus **orale**.

## Les trois démonstratifs
| Forme | Registre | Emploi |
| **dieser, diese, dieses** | Neutre, écrit et oral | Le démonstratif de base |
| **jener** | Soutenu, en recul | « Celui-là », plus éloigné — l’oral préfère *dieser… der da* |
| **der, die, das** accentué | **Oral courant** | Le plus fréquent : « celui-là ! » |

*dieser* se décline **comme l’article défini** : *dieser Mann, diesen Mann, diesem Mann, dieses Mannes*.

Le *der* démonstratif se décline lui aussi comme l’article, à **deux exceptions** : datif pluriel *denen*, génitif *dessen / deren*.

— *Kennst du Peter?* — *Den kenne ich gut!*

## dessen et deren
Ils remplacent un possessif **pour lever une ambiguïté**.

| Phrase | Ce qu’elle dit |
| *Ich traf Paul und seinen Bruder* | Ambigu : le frère de qui ? |
| *Ich traf Paul und dessen Bruder* | Le frère **de Paul**, sans équivoque |

C’est un usage soigné, très apprécié à l’écrit.

## derselbe ou der gleiche
| Forme | Ce qu’elle dit | Exemple |
| **derselbe** | Le même, **identique** — un seul objet | *Wir wohnen in demselben Haus* |
| **der gleiche** | Le même, **semblable** — deux objets | *Sie hat das gleiche Kleid* |

Dans *derselbe*, les deux morceaux se déclinent : *der-* comme l’article, *-selbe* comme un adjectif faible.

## das invariable
*das* peut désigner une situation entière, **sans accord** : *Das ist mein Bruder* · *Das sind meine Eltern*. Le verbe s’accorde alors avec ce qui **suit**, jamais avec *das*.

> Ne pas confondre *das* et *dass*. Le test est infaillible : si l’on peut remplacer par *dieses*, c’est *das* avec **un seul s**.`,
          },
          questions: [
            ['« dieser » se décline comme…', ['L’article défini', 'L’article indéfini', 'Un adjectif fort', 'Il ne se décline pas'], 0, '*diesen Mann*, *diesem Kind*, *dieser Frau*.'],
            ['Dans « Den kenne ich gut! », « den » est…', ['Un démonstratif accentué', 'Un article défini', 'Un pronom relatif', 'Une préposition'], 0, 'C’est la forme démonstrative la plus courante à l’oral.'],
            ['Quelle est la forme du démonstratif au datif pluriel ?', ['denen', 'den', 'dessen', 'deren'], 0, 'Comme le pronom relatif : *denen* et non *den*.'],
            ['« Ich traf Paul und dessen Bruder » signifie…', ['Le frère de Paul', 'Mon frère', 'Le frère de quelqu’un d’autre', 'Le même frère'], 0, '*dessen* lève l’ambiguïté que *seinen* laisserait planer.'],
            ['« derselbe » se décline sur ses deux morceaux.', ['Vrai', 'Faux'], 0, '*in demselben Haus* : *der-* comme l’article, *-selbe* comme un adjectif faible.'],
            ['Comment traduire « Ce sont mes parents » ?', ['Das sind meine Eltern', 'Die sind meine Eltern', 'Das ist meine Eltern', 'Diese sind meine Eltern'], 0, '*das* reste invariable ; le verbe s’accorde avec ce qui suit.'],
            ['« dass » et « das » s’emploient indifféremment.', ['Vrai', 'Faux'], 1, '*dass* est la conjonction « que » ; *das* l’article ou le démonstratif. Test : remplacer par *dieses*.'],
            ['« jener » appartient surtout…', ['À la langue écrite et soutenue', 'À l’oral familier', 'Au vocabulaire technique', 'Au vieil allemand disparu'], 0, 'À l’oral, on lui préfère *dieser… der da*.'],
          ],
        },
        {
          titre: 'Le pluriel des noms',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Cinq façons de faire un pluriel',
            cours: `Le pluriel allemand ne s’obtient **pas** en ajoutant un *-s* : il y a **cinq schémas**, et le bon s’apprend avec le mot, comme le genre.

## Les cinq schémas
| Schéma | Genre dominant | Inflexion ? | Exemples |
| **-e** | Masculins | Souvent | *der Tag → die Tage* · *der Sohn → die Söhne* |
| **-er** | Neutres, quelques masculins | **Toujours** si possible | *das Kind → die Kinder* · *das Buch → die Bücher* |
| **-(e)n** | Presque tous les **féminins** | **Jamais** | *die Frau → die Frauen* · *die Zeitung → die Zeitungen* |
| **Aucune** terminaison | Masculins et neutres en -er, -el, -en | Parfois | *der Lehrer → die Lehrer* · *der Vater → die Väter* |
| **-s** | Emprunts, abréviations | Jamais | *das Auto → die Autos* · *der Park → die Parks* |

Les noms féminins en *-in* **doublent le n** : *die Lehrerin → die Lehrerinnen*.

## Le datif pluriel
Quel que soit le schéma, le nom prend un **-n** au datif pluriel s’il n’en a pas déjà un.

| Pluriel | Au datif |
| *die Kinder* | *mit den Kindern* |
| *die Städte* | *aus den Städten* |
| *die Autos* | *mit den Autos* — **exception** : pas de -n après -s |

> Bonne nouvelle : l’article est *die* au nominatif et à l’accusatif pluriel pour **les trois genres**. Le genre ne compte plus au pluriel — c’est le seul endroit où l’allemand simplifie.

## Les noms qui n’ont qu’un nombre
| Uniquement au pluriel | Uniquement au singulier | Singulier là où le français met un pluriel |
| *die Leute* — les gens | *die Polizei*, *das Obst*, *die Milch* | *eine Brille* — des lunettes |`,
          },
          questions: [
            ['Quel est le pluriel de « das Buch » ?', ['die Bücher', 'die Buche', 'die Buchs', 'die Buchen'], 0, 'Pluriel en *-er* avec inflexion, typique des neutres.'],
            ['La quasi-totalité des féminins font leur pluriel en…', ['-(e)n', '-e', '-er', '-s'], 0, '*die Frauen*, *die Blumen*, *die Zeitungen* — et jamais d’inflexion.'],
            ['« der Lehrer » a le même mot au singulier et au pluriel.', ['Vrai', 'Faux'], 0, 'Les masculins en *-er*, *-el*, *-en* ne changent pas : seul l’article le dit.'],
            ['Quel est le pluriel de « das Auto » ?', ['die Autos', 'die Auten', 'die Autoer', 'die Aute'], 0, 'Les emprunts font leur pluriel en *-s*.'],
            ['Au datif pluriel, que prend le nom ?', ['Un -n s’il n’en a pas déjà un', 'Un -s', 'Un -er', 'Rien'], 0, '*mit den Kindern*, *aus den Städten* — sauf les pluriels en *-s*.'],
            ['Quel est le pluriel de « die Lehrerin » ?', ['die Lehrerinnen', 'die Lehrerins', 'die Lehrerine', 'die Lehrerinen'], 0, 'Les noms en *-in* doublent le n avant *-en*.'],
            ['« die Leute » n’existe qu’au pluriel.', ['Vrai', 'Faux'], 0, 'Comme *die Polizei* ou *die Milch* n’existent qu’au singulier.'],
            ['Au pluriel, l’article défini dépend du genre du nom.', ['Vrai', 'Faux'], 1, 'C’est *die* pour les trois genres au nominatif et à l’accusatif.'],
          ],
        },
        {
          titre: 'L’adjectif attribut',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Après sein, werden et bleiben : rien ne bouge',
            cours: `C’est la règle la plus **reposante** de la grammaire allemande : l’adjectif **attribut** ne se décline **jamais**.

## La règle
Après **sein**, **werden** et **bleiben**, l’adjectif reste à sa forme nue.

| Phrase | L’adjectif |
| *Der Mann ist alt* | *alt* |
| *Die Frau ist alt* | *alt* |
| *Das Kind ist alt* | *alt* |
| *Die Kinder sind alt* | *alt* |

Aucun -e, aucun -er, **rien**. Le français, qui accorde (« vieille », « vieux »), pousse directement à la faute.

## Attribut ou épithète
| | **Attribut** | **Épithète** |
| Sa place | **Après** le verbe | **Devant** le nom |
| Se décline-t-il ? | **Jamais** | **Toujours** |
| Exemple | *Ein Mann ist alt* | *Ein alter Mann ist gekommen* |

> Le même adjectif, deux traitements — tout dépend de sa **place**. Savoir dire lequel des deux on a sous les yeux, c’est déjà la moitié du travail.

## L’adverbe aussi est invariable
L’allemand n’a **pas** de terminaison d’adverbe comme le *-ment* français : le même mot sert d’adjectif et d’adverbe.

| Emploi | Exemple | Traduction |
| Adverbe | *Er singt schön* | Il chante **bien** |
| Adjectif | *Das Lied ist schön* | La chanson est **belle** |

## Le comparatif attribut
Il se termine en *-er* — mais c’est la marque du **comparatif**, pas un accord : *Der Zug ist schneller als das Auto*. Idem au superlatif : *Der Zug ist am schnellsten*.

## Les verbes qui appellent un attribut
*sein*, *werden*, *bleiben*, *scheinen* (paraître) — et *finden* avec un COD : *Ich finde das Buch interessant*.`,
          },
          questions: [
            ['Après « sein », l’adjectif attribut…', ['Reste invariable', 'S’accorde en genre', 'S’accorde en nombre', 'Prend toujours -e'], 0, '*Der Mann ist alt*, *die Frau ist alt*, *die Kinder sind alt*.'],
            ['« Die Frau ist alte » est correct.', ['Vrai', 'Faux'], 1, 'L’attribut ne prend aucune terminaison : *Die Frau ist alt.*'],
            ['Quel verbe n’appelle PAS un attribut invariable ?', ['sehen', 'sein', 'werden', 'bleiben'], 0, '*sein*, *werden* et *bleiben* sont les trois verbes de base de l’attribut.'],
            ['Comment traduire « une vieille femme » ?', ['eine alte Frau', 'eine alt Frau', 'ein alte Frau', 'eine alten Frau'], 0, 'Devant le nom, l’adjectif est épithète : il se décline.'],
            ['En allemand, l’adverbe se forme avec une terminaison spéciale.', ['Vrai', 'Faux'], 1, 'Le même mot sert d’adjectif et d’adverbe : *Er singt schön.*'],
            ['Dans « Der Zug ist schneller », la terminaison -er marque…', ['Le comparatif', 'Le masculin', 'Le pluriel', 'Le datif'], 0, 'Ce n’est pas un accord : l’attribut ne s’accorde jamais.'],
            ['Comment traduire « je trouve le livre intéressant » ?', ['Ich finde das Buch interessant', 'Ich finde das Buch interessantes', 'Ich finde das interessante Buch', 'Ich finde interessant das Buch'], 0, '*finden* + COD + attribut invariable.'],
            ['La différence entre attribut et épithète tient à la place de l’adjectif.', ['Vrai', 'Faux'], 0, 'Après le verbe : invariable. Devant le nom : décliné.'],
          ],
        },
        {
          titre: 'L’adjectif épithète et ses déclinaisons',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Faible, mixte, forte : qui porte la marque du cas',
            cours: `Devant un nom, l’adjectif se décline. La terminaison dépend d’**une seule question** : le déterminant porte-t-il déjà la marque du cas ?

## Le principe
> La marque du cas doit apparaître **une fois** dans le groupe nominal. Si le déterminant la porte, l’adjectif se contente d’une terminaison faible ; s’il ne la porte pas, l’adjectif la prend **à sa place**.

## Les trois déclinaisons
| Déclinaison | Après quoi | Terminaisons de l’adjectif |
| **Faible** | *der, die, das, dieser, jeder, welcher, alle* | **-e** ou **-en** seulement |
| **Mixte** | *ein, kein*, les possessifs | -er, -es là où le déterminant ne marque rien ; -e et -en ailleurs |
| **Forte** | **Aucun** déterminant | Celles de **l’article défini** |

## La faible, en détail
| Cas | Masculin | Féminin | Neutre | Pluriel |
| Nominatif | *der alte* | *die alte* | *das alte* | *die alten* |
| Accusatif | *den alten* | *die alte* | *das alte* | *die alten* |
| Datif, génitif | *-en* | *-en* | *-en* | *-en* |

Retenir : **-e** aux trois nominatifs singuliers et à l’accusatif féminin et neutre, **-en** partout ailleurs.

## La mixte, et ses trois « trous »
*ein* ne marque pas le cas à trois endroits — l’adjectif le fait pour lui.

| Groupe | L’adjectif compense |
| *ein alter Mann* | Le -er que *ein* ne porte pas |
| *ein altes Haus* | Le -es |
| *eine alte Frau* | *eine* marquant déjà : terminaison faible |

## La forte
Sans déterminant — souvent au pluriel, avec les noms de matière, après un nombre.

*kalter Kaffee* · *frische Milch* · *gutes Brot* · *mit guten Freunden*

## Les irréguliers utiles
| Adjectif | Ce qu’il perd | Exemple |
| *hoch* | Son c | *ein hoher Berg* |
| *teuer* | Son e | *ein teures Auto* |
| *dunkel* | Son e | *ein dunkles Zimmer* |

> La méthode en devoir : repérer d’abord le **cas et le genre** du groupe, **puis** regarder le déterminant. S’il marque déjà le cas, l’adjectif prend -e ou -en. Sinon, c’est lui qui porte la marque.

## Les invariables
Ceux en *-a* et les couleurs empruntées : *ein rosa Kleid*, *eine lila Bluse*, *ein prima Ergebnis*.`,
          },
          questions: [
            ['Quand l’adjectif prend-il la déclinaison forte ?', ['Quand aucun déterminant ne porte la marque du cas', 'Après l’article défini', 'Après ein et kein', 'Jamais au pluriel'], 0, '*kalter Kaffee*, *frische Milch* : l’adjectif prend les terminaisons de l’article défini.'],
            ['Comment traduire « un vieil homme » (nominatif) ?', ['ein alter Mann', 'ein alt Mann', 'ein alten Mann', 'ein alte Mann'], 0, '*ein* ne marque pas le masculin nominatif : l’adjectif le fait à sa place.'],
            ['Après « der », l’adjectif prend seulement -e ou -en.', ['Vrai', 'Faux'], 0, 'C’est la déclinaison faible : *der alte Mann*, *dem alten Mann*.'],
            ['Comment dit-on « une vieille maison » à l’accusatif (das Haus) ?', ['ein altes Haus', 'ein alten Haus', 'eine alte Haus', 'ein alte Haus'], 0, 'Neutre accusatif : *ein* ne marque rien, l’adjectif prend *-es*.'],
            ['Après « meinem », l’adjectif prend…', ['-en', '-er', '-es', '-e'], 0, 'Le possessif marque déjà le datif : *meinem alten Freund*.'],
            ['« hoch » garde son c devant une terminaison.', ['Vrai', 'Faux'], 1, '*ein hoher Berg*, *das hohe Haus* : le *c* disparaît.'],
            ['Que devient « teuer » dans « ein … Auto » ?', ['teures', 'teueres', 'teuers', 'teuer'], 0, '*teuer* et *dunkel* perdent leur *e* : *ein teures Auto*, *ein dunkles Zimmer*.'],
            ['« rosa » et « lila » se déclinent comme les autres adjectifs.', ['Vrai', 'Faux'], 1, 'Les adjectifs en *-a* sont invariables : *ein rosa Kleid*.'],
          ],
        },
        {
          titre: 'L’adjectif possessif',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'sein ou ihr : c’est le possesseur qui décide',
            cours: `Le possessif allemand pose une difficulté que le français ne prépare pas : il regarde **deux choses à la fois**.

## La règle des deux regards
| Ce qui varie | Ce qui le commande |
| Le **radical** — *sein* ou *ihr* | Le **possesseur** |
| La **terminaison** | L’**objet possédé** : genre, nombre, cas |

| Phrase | Radical | Terminaison |
| *Peter und seine Schwester* | *sein-*, car Peter est un homme | *-e*, car *Schwester* est féminin |
| *Anna und ihr Bruder* | *ihr-*, car Anna est une femme | Rien, car *Bruder* est masculin nominatif |

> Le français dit « **sa** sœur » et « **son** frère » sans jamais regarder qui possède. L’allemand fait exactement l’inverse du français sur le radical, et la même chose sur la terminaison.

## La liste
| Allemand | Français |
| *mein* | mon |
| *dein* | ton |
| *sein* | son — **à lui** |
| *ihr* | son — **à elle** |
| *unser* | notre |
| *euer* | votre |
| *ihr* | leur |
| *Ihr* | votre, de politesse — **majuscule** |

## La déclinaison
Exactement celle de *ein* et *kein*, **avec en plus un pluriel** : *meine, meine, meinen, meiner*.

| Déterminant | Ce qu’il devient devant une terminaison |
| *euer* | *eur-* : *eure Mutter*, *euren Vater* |
| *unser* | Il **garde** son e : *unsere Mutter* |

## Le possessif employé seul
*Wessen Buch ist das?* — *Das ist meins.* Sans nom, il prend les terminaisons de l’article défini : *meiner, meine, mein(e)s*.

## Ce que l’allemand ne dit pas avec un possessif
Avec les parties du corps et les vêtements, il emploie **l’article + un datif** :

| Allemand | Français |
| *Ich wasche mir die Hände* | Je me lave **les** mains |
| *Er zieht sich den Mantel an* | Il met **son** manteau |`,
          },
          questions: [
            ['Comment traduire « Anna et son frère » ?', ['Anna und ihr Bruder', 'Anna und sein Bruder', 'Anna und seinen Bruder', 'Anna und ihre Bruder'], 0, 'Le radical suit le POSSESSEUR (Anna → *ihr-*), la terminaison l’objet possédé (*Bruder*, masculin).'],
            ['Comment traduire « Peter et sa sœur » ?', ['Peter und seine Schwester', 'Peter und ihre Schwester', 'Peter und sein Schwester', 'Peter und ihren Schwester'], 0, 'Radical *sein-* (Peter), terminaison féminine (*Schwester*).'],
            ['Le possessif se décline comme…', ['ein et kein', 'l’article défini', 'un adjectif faible', 'il ne se décline pas'], 0, 'Avec en plus un pluriel : *meine Freunde*, *meinen Freunden*.'],
            ['Que devient « euer » devant une terminaison ?', ['eur-', 'euer-', 'eue-', 'eur-e-'], 0, '*eure Mutter*, *euren Vater*. *unser*, lui, garde son *e*.'],
            ['« Ihr » avec majuscule signifie « leur ».', ['Vrai', 'Faux'], 1, 'Avec majuscule, c’est le possessif de politesse : « votre ».'],
            ['Comment dit-on « je me lave les mains » ?', ['Ich wasche mir die Hände', 'Ich wasche meine Hände mir', 'Ich wasche mich die Hände', 'Ich wasche meinen Händen'], 0, 'Avec les parties du corps, l’allemand préfère article + datif au possessif.'],
            ['Employé seul, « mein » prend les terminaisons de l’article défini.', ['Vrai', 'Faux'], 0, '*Das ist meins*, *Das ist meiner* : il devient pronom possessif.'],
            ['Dans « Das Kind und seine Mutter », pourquoi « seine » ?', ['Parce que « Kind » est neutre, donc radical sein-', 'Parce que « Mutter » est féminin', 'Parce que l’enfant est un garçon', 'Parce que c’est une exception'], 0, 'Le radical suit le genre GRAMMATICAL du possesseur, pas son sexe.'],
          ],
        },
        {
          titre: 'Le génitif saxon',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'Peters Auto, das Auto des Vaters, das Auto von Peter',
            cours: `Le complément du nom se dit de **trois** façons en allemand — et l’ordre des mots n’est pas le même dans les trois.

## Les trois constructions
| Construction | Où va le possesseur | Registre | Exemple |
| **Génitif saxon** | **Devant**, avec -s sans apostrophe | Courant, noms propres | *Peters Auto* |
| **Génitif ordinaire** | **Derrière**, avec l’article au génitif | Écrit, soigné | *das Auto des Vaters* |
| *von* **+ datif** | Derrière, avec *von* | Oral, plus relâché | *das Auto von meinem Vater* |

## Le génitif saxon
Aucun article : *Peters Auto*, jamais « das Peters Auto ». Si le nom se termine déjà par un son sifflant, on met une apostrophe — *Thomas’ Auto* — ou l’on tourne autrement.

## Le génitif ordinaire
| Genre | L’article | Le nom |
| Masculin, neutre | *des* | Il prend **-(e)s** : *des Vaters*, *des Jahres* |
| Féminin, pluriel | *der* | **Aucune** marque : *der Frau*, *der Kinder* |

## Les prépositions à génitif
| Préposition | Sens |
| *wegen* | À cause de |
| *trotz* | Malgré |
| *während* | Pendant |
| *statt* | Au lieu de |
| *innerhalb / außerhalb* | À l’intérieur / à l’extérieur de |

*während des Sommers* · *trotz des Regens*

À l’oral, elles glissent souvent au **datif**. L’écrit, lui, garde le génitif.

> Le génitif recule dans l’allemand parlé — mais il reste un **marqueur de niveau de langue**. C’est exactement le genre de forme qu’un correcteur remarque, dans un sens comme dans l’autre.

## La question
**Wessen?** — de qui ? *Wessen Buch ist das?* — *Das ist Annas Buch.*`,
          },
          questions: [
            ['Comment dit-on « la voiture de Peter » ?', ['Peters Auto', 'Peter’s Auto', 'das Auto Peters', 'der Peter Auto'], 0, 'Le nom propre passe devant, avec un *-s* sans apostrophe.'],
            ['Comment dit-on « la voiture du père » ?', ['das Auto des Vaters', 'das Auto der Vater', 'des Vaters das Auto', 'das Auto dem Vater'], 0, 'Génitif masculin : *des* + nom en *-(e)s*, placé derrière.'],
            ['Au génitif féminin, le nom prend un -s.', ['Vrai', 'Faux'], 1, 'Seuls les masculins et les neutres le prennent : *das Haus der Frau*.'],
            ['Quelle question introduit le génitif ?', ['Wessen?', 'Wem?', 'Wen?', 'Wo?'], 0, '*Wessen Buch ist das?*'],
            ['Quelle préposition régit le génitif ?', ['während', 'mit', 'für', 'bei'], 0, 'Comme *wegen*, *trotz*, *statt*, *innerhalb* : *während des Sommers*.'],
            ['« ein Freund von mir » est une tournure correcte.', ['Vrai', 'Faux'], 0, '*von* + datif remplace le génitif, surtout à l’oral.'],
            ['Le génitif saxon s’écrit avec une apostrophe, comme en anglais.', ['Vrai', 'Faux'], 1, '*Annas Buch*, sans apostrophe — sauf après un son sifflant : *Thomas’ Auto*.'],
            ['Au génitif pluriel, l’article est…', ['der', 'des', 'den', 'die'], 0, '*die Bücher der Kinder*, sans marque supplémentaire sur le nom.'],
          ],
        },
        {
          titre: 'Le comparatif',
          axe: 'Le groupe nominal',
          lecon: {
            titre: '-er, als, so… wie',
            cours: `L’allemand ne connaît pas « plus… que » en deux mots : il ajoute une **terminaison** à l’adjectif, comme l’anglais.

## La formation
Adjectif + **-er**, **quelle que soit la longueur** du mot.

| Français | Allemand |
| plus rapide | *schneller* |
| plus intéressant | *interessanter* |

Beaucoup d’adjectifs courts prennent en plus l’**Umlaut** : *alt → älter*, *jung → jünger*, *groß → größer*, *stark → stärker*, *kurz → kürzer*, *warm → wärmer*.

## Les trois comparaisons
| Relation | Structure | Exemple |
| Supériorité | comparatif + **als** | *Peter ist größer als Paul* |
| Égalité | **so**… **wie** | *Peter ist so groß wie Paul* |
| Infériorité | *nicht so*… *wie* | *Peter ist nicht so groß wie Paul* |

> Employer *wie* après un comparatif est une faute **très courante et très nette** : c’est **als** après *größer*, *wie* seulement après *so*.

Variantes utiles : *genauso… wie* (exactement aussi), *doppelt so… wie* (deux fois plus).

## Les irréguliers
| Adjectif ou adverbe | Comparatif | Ce qu’il permet de dire |
| *gut* | *besser* | Meilleur |
| *viel* | *mehr* | Plus, en quantité |
| *gern* | *lieber* | **Préférer** : *Ich trinke lieber Tee als Kaffee* |
| *hoch* | *höher* | |
| *nah* | *näher* | |

## Le comparatif épithète se décline
La marque du comparatif s’ajoute **avant** la terminaison de déclinaison : *ein größeres Haus*, *mein älterer Bruder*. Deux terminaisons l’une derrière l’autre — c’est normal, et c’est correct.

## Deux tournures de haut rendement
| Structure | Sens | Exemple |
| *immer* + comparatif | De plus en plus | *Es wird immer kälter* |
| *je*… *desto / umso* | Plus… plus | *Je mehr ich lerne, desto besser verstehe ich* |

> Attention à *mehr* : il traduit « plus » de **quantité** (*mehr Zeit*), **jamais** le comparatif d’un adjectif. « Plus grand » ne se dit pas *mehr groß*.`,
          },
          questions: [
            ['Comment forme-t-on le comparatif d’un adjectif long comme « interessant » ?', ['interessanter', 'mehr interessant', 'am interessanten', 'interessant als'], 0, 'Quelle que soit la longueur du mot, c’est la terminaison *-er*.'],
            ['Quel mot introduit le second terme d’une comparaison d’inégalité ?', ['als', 'wie', 'wenn', 'denn'], 0, '*Peter ist größer als Paul.* *wie* sert à l’égalité.'],
            ['Comment dit-on « aussi grand que » ?', ['so groß wie', 'so groß als', 'größer wie', 'als groß wie'], 0, '*so… wie* pour l’égalité, *…-er als* pour l’inégalité.'],
            ['Quel est le comparatif de « gut » ?', ['besser', 'guter', 'mehr gut', 'gutter'], 0, 'Irrégulier, comme *viel → mehr* et *gern → lieber*.'],
            ['« Ich trinke lieber Tee » signifie…', ['Je préfère le thé', 'Je bois beaucoup de thé', 'Je bois le meilleur thé', 'J’aimerais du thé'], 0, '*lieber* est le comparatif de *gern* : c’est ainsi qu’on exprime la préférence.'],
            ['Devant un nom, le comparatif ne se décline pas.', ['Vrai', 'Faux'], 1, '*ein größeres Haus*, *mein älterer Bruder* : deux terminaisons se suivent.'],
            ['Comment dit-on « de plus en plus froid » ?', ['immer kälter', 'mehr und mehr kalt', 'so kalt wie', 'am kältesten'], 0, '*Es wird immer kälter.* Et *je… desto* pour « plus… plus ».'],
            ['« mehr groß » est une façon correcte de dire « plus grand ».', ['Vrai', 'Faux'], 1, '*mehr* traduit « plus » de quantité ; le comparatif d’un adjectif se fait en *-er*.'],
          ],
        },
        {
          titre: 'Le superlatif',
          axe: 'Le groupe nominal',
          lecon: {
            titre: 'am schnellsten ou der schnellste',
            cours: `Le superlatif allemand a **deux formes**, et le choix dépend de la **place** de l’adjectif.

## Les deux formes
| Forme | Quand | Se décline ? | Exemple |
| **am** + *-sten* | Attribut ou adverbe | **Non**, elle est figée | *Der Zug ist am schnellsten* |
| *der / die / das* + *-ste* | **Épithète**, devant un nom | **Oui** | *der schnellste Zug* |

*Er läuft am schnellsten* (adverbe) · *mit dem besten Freund* (épithète déclinée).

## Le -e- de liaison
Après **d, t, s, ß, z, sch**, on intercale un *e* pour pouvoir prononcer.

| Adjectif | Superlatif |
| *alt* | *am ältesten* |
| *heiß* | *am heißesten* |
| *kurz* | *am kürzesten* |
| *groß* | *am größten* — **exception**, sans e |

## Les irréguliers
| Adjectif | Comparatif | Superlatif |
| *gut* | *besser* | *am besten*, *der beste* |
| *viel* | *mehr* | *am meisten* |
| *gern* | *lieber* | *am liebsten* |
| *hoch* | *höher* | *am höchsten* |
| *nah* | *näher* | *am nächsten* |

## Le complément du superlatif
| Structure | Exemple |
| *von* + datif | *Er ist der Größte von allen* |
| *unter* + datif | *der Größte unter seinen Freunden* |
| *in* + datif, pour un lieu | *die größte Stadt in Deutschland* |
| Le génitif | *Deutschlands größte Stadt* |

> Piège d’écrit : *am liebsten* n’est pas « le plus aimé » mais « **ce que je préfère par-dessus tout** » — *Am liebsten lese ich Krimis.* C’est une tournure de très haut rendement dans une expression d’opinion.`,
          },
          questions: [
            ['Quelle forme du superlatif s’emploie après « sein » ?', ['am + -sten', 'der + -ste', 'mehr + adjectif', 'so + adjectif'], 0, '*Der Zug ist am schnellsten.* La forme en *der/die/das* est réservée à l’épithète.'],
            ['Comment dit-on « le train le plus rapide » ?', ['der schnellste Zug', 'der Zug am schnellsten', 'am schnellsten Zug', 'der schneller Zug'], 0, 'Épithète : article défini + adjectif au superlatif décliné.'],
            ['Pourquoi dit-on « am ältesten » et non « am altsten » ?', ['On intercale un e après d, t, s, ß, z', 'C’est une exception unique', 'Le e marque le datif', 'Pour éviter l’Umlaut'], 0, 'Un *e* de liaison rend la forme prononçable.'],
            ['Quel est le superlatif de « gut » ?', ['am besten', 'am gutsten', 'am mehrsten', 'am guten'], 0, 'Série irrégulière : *gut → besser → am besten*.'],
            ['« am liebsten » signifie…', ['Ce que je préfère par-dessus tout', 'Le plus aimé de tous', 'Avec amour', 'Aussi volontiers que'], 0, '*Am liebsten lese ich Krimis* — une tournure très utile pour donner son avis.'],
            ['La forme « am schnellsten » se décline devant un nom.', ['Vrai', 'Faux'], 1, 'Elle est figée ; devant un nom, on passe à *der schnellste*.'],
            ['Quel est le superlatif de « hoch » ?', ['am höchsten', 'am hochsten', 'am höhesten', 'am hohesten'], 0, 'Comme *nah → am nächsten* : à apprendre par cœur.'],
            ['Comment introduire le complément d’un superlatif ?', ['von ou unter + datif', 'als + nominatif', 'wie + accusatif', 'für + accusatif'], 0, '*Er ist der Größte von allen* / *unter seinen Freunden*.'],
          ],
        },
        // ---- Chapitre 3 du programme : Les groupes prépositionnels -----------
        {
          titre: 'Les prépositions suivies de l’accusatif',
          axe: 'Les groupes prépositionnels',
          lecon: {
            titre: 'durch, für, gegen, ohne, um',
            cours: `Cinq prépositions imposent l’accusatif **toujours**, sans jamais dépendre du sens. Elles s’apprennent en bloc, comme une liste.

## Les cinq
| Préposition | Sens | Exemple |
| **durch** | À travers, par | *Wir gehen durch den Park* |
| **für** | Pour | *Das Geschenk ist für meinen Bruder* |
| **gegen** | Contre ; vers, pour une heure **approximative** | *Ich bin gegen diese Idee* · *gegen acht Uhr* |
| **ohne** | Sans | *Ich trinke den Kaffee ohne Zucker* |
| **um** | Autour de ; à, pour une heure **précise** | *um den Tisch* · *um acht Uhr* |

Beaucoup les retiennent dans l’ordre **durch-für-gegen-ohne-um**, qui se scande facilement.

> *gegen* et *um* se distinguent sur l’heure : *gegen acht* = vers huit heures, *um acht* = à huit heures pile. Une seule préposition d’écart, et le rendez-vous n’est plus le même.

## Trois autres, plus rares
| Préposition | Sens | Sa particularité |
| **bis** | Jusqu’à | Souvent suivie d’une autre préposition : *bis zum Bahnhof* |
| **entlang** | Le long de | Elle se place **après** le nom : *die Straße entlang* |
| **wider** | Contre | Littéraire |

## Les contractions
*durch das → durchs* · *für das → fürs* · *um das → ums*

## ohne se passe d’article
*ohne Geld*, *ohne Auto*, *ohne Probleme* — et l’expression *ohne mich* garde le pronom à l’accusatif.

> Erreur fréquente : traduire « pour » par *für* devant un but. « Pour apprendre » n’est **pas** *für lernen* mais *um zu lernen* : *für* introduit un **groupe nominal**, jamais un verbe.`,
          },
          questions: [
            ['Quelles prépositions régissent toujours l’accusatif ?', ['durch, für, gegen, ohne, um', 'aus, bei, mit, nach, von', 'an, auf, in, über, unter', 'wegen, trotz, während'], 0, 'Une liste à apprendre en bloc : elle ne dépend jamais du sens.'],
            ['Comment traduire « pour mon frère » ?', ['für meinen Bruder', 'für meinem Bruder', 'für mein Bruder', 'für meines Bruders'], 0, '*für* + accusatif : le masculin devient *meinen*.'],
            ['« gegen acht Uhr » signifie…', ['Vers huit heures', 'À huit heures précises', 'Avant huit heures', 'Contre huit heures'], 0, 'Pour l’heure précise, c’est *um acht Uhr*.'],
            ['Où se place « entlang » ?', ['Après le nom', 'Avant le nom', 'En fin de phrase', 'Devant le verbe'], 0, '*die Straße entlang* : c’est la seule de la liste à se postposer.'],
            ['« für das » se contracte en « fürs ».', ['Vrai', 'Faux'], 0, 'Comme *durch das → durchs* et *um das → ums*.'],
            ['Comment traduire « sans argent » ?', ['ohne Geld', 'ohne dem Geld', 'ohne das Geld haben', 'ohne Geldes'], 0, '*ohne* se passe le plus souvent d’article.'],
            ['Comment traduire « pour apprendre » ?', ['um zu lernen', 'für lernen', 'für zu lernen', 'um lernen'], 0, '*für* introduit un groupe nominal, jamais un verbe : le but se dit *um… zu*.'],
            ['« bis » est souvent suivi d’une seconde préposition.', ['Vrai', 'Faux'], 0, '*bis zum Bahnhof*, *bis zur Brücke* — et c’est alors elle qui commande le cas.'],
          ],
        },
        {
          titre: 'Les prépositions suivies du datif',
          axe: 'Les groupes prépositionnels',
          lecon: {
            titre: 'aus, bei, mit, nach, seit, von, zu',
            cours: `Sept prépositions imposent le datif dans **tous** leurs emplois. La suite *aus-bei-mit-nach-seit-von-zu* se retient comme une formule.

## Les sept
| Préposition | Sens | Exemple |
| **aus** | Hors de, en provenance de, en (matière) | *aus der Schweiz*, *aus Holz* |
| **bei** | Chez, près de, lors de | *bei meinen Eltern*, *beim Essen* |
| **mit** | Avec, en (moyen de transport) | *mit dem Bus*, *mit meiner Schwester* |
| **nach** | Après ; vers, pays et villes **sans article** | *nach dem Film*, *nach Berlin* |
| **seit** | Depuis | *seit einem Jahr* |
| **von** | De : origine, appartenance, agent du passif | *ein Brief von meinem Freund* |
| **zu** | Chez, vers — personne ou but | *zum Arzt* |

Trois de plus : **gegenüber** (en face de, souvent postposée), **außer** (sauf), **ab** (à partir de).

## Les contractions
| Forme pleine | Contractée |
| *bei dem* | *beim* |
| *von dem* | *vom* |
| *zu dem* | *zum* |
| *zu der* | *zur* |

Elles sont **obligatoires** dans l’usage courant : *zum Bahnhof*, *zur Schule*.

## nach, zu ou in
| On emploie | Devant quoi | Exemple |
| **nach** | Pays ou ville **sans article** | *nach Deutschland*, *nach Wien* |
| **in** + accusatif | Pays **avec** article | *in die Schweiz*, *in die Türkei* |
| **zu** | Personne ou bâtiment vu comme but | *zum Arzt*, *zur Post* |

## seit et le présent
> Avec *seit*, l’allemand emploie le **présent** : *Ich lerne seit drei Jahren Deutsch*. C’est le même piège qu’en anglais avec le present perfect — sauf que l’allemand, lui, fait comme le français.

## Deux expressions figées
*nach Hause* (rentrer à la maison, **avec** mouvement) et *zu Hause* (être à la maison, **sans** mouvement) ne suivent pas la règle générale : elles s’apprennent telles quelles.`,
          },
          questions: [
            ['Quelle série de prépositions régit le datif ?', ['aus, bei, mit, nach, seit, von, zu', 'durch, für, gegen, ohne, um', 'wegen, trotz, während, statt', 'an, auf, hinter, in, neben'], 0, 'La formule *aus-bei-mit-nach-seit-von-zu* se retient d’un bloc.'],
            ['« Ich komme aus der Schweiz » est correct.', ['Vrai', 'Faux'], 0, '*aus* impose le datif : *die Schweiz* devient *der Schweiz*.'],
            ['En quoi se contracte « zu der » ?', ['zur', 'zum', 'zud', 'zurd'], 0, '*zur Schule*, *zur Post*. Et *zu dem → zum*.'],
            ['Comment dit-on « je vais chez le médecin » ?', ['Ich gehe zum Arzt', 'Ich gehe nach dem Arzt', 'Ich gehe bei dem Arzt', 'Ich gehe in den Arzt'], 0, '*zu* + personne vue comme un but ; *bei* dirait où l’on se trouve déjà.'],
            ['Avec « seit », quel temps emploie-t-on en allemand ?', ['Le présent', 'Le parfait', 'Le prétérit', 'Le futur'], 0, '*Ich lerne seit drei Jahren Deutsch.*'],
            ['Comment dit-on « je vais en Suisse » ?', ['Ich fahre in die Schweiz', 'Ich fahre nach die Schweiz', 'Ich fahre nach der Schweiz', 'Ich fahre zu Schweiz'], 0, 'Les pays qui ont un article prennent *in* + accusatif ; les autres, *nach*.'],
            ['« nach Hause » et « zu Hause » signifient la même chose.', ['Vrai', 'Faux'], 1, '*nach Hause* = vers la maison (mouvement), *zu Hause* = à la maison (sans mouvement).'],
            ['Que signifie « bei » dans « beim Essen » ?', ['Pendant, lors de', 'Après', 'Sans', 'Contre'], 0, '*bei* couvre aussi le moment d’une action en cours.'],
          ],
        },
        {
          titre: 'Les prépositions mixtes',
          axe: 'Les groupes prépositionnels',
          lecon: {
            titre: 'wo ? datif — wohin ? accusatif',
            cours: `Neuf prépositions **changent de cas** selon le sens de la phrase. C’est le point le plus testé de la grammaire allemande — et il tient en une seule question.

## La question à se poser
| La question | Ce qu’il y a | Le cas | Exemple |
| **wohin?** — vers où ? | Un **déplacement** | **Accusatif** | *Ich gehe in die Schule* |
| **wo?** — où ? | Une **localisation** | **Datif** | *Ich bin in der Schule* |

> Ce n’est **pas** le verbe de mouvement qui décide, mais le **changement de lieu** : *Ich laufe im Park* (je cours à l’intérieur du parc, datif) contre *Ich laufe in den Park* (j’y entre en courant, accusatif). Même verbe, deux cas.

## Les neuf
**an** (à, contre), **auf** (sur), **hinter** (derrière), **in** (dans), **neben** (à côté de), **über** (au-dessus de), **unter** (sous), **vor** (devant), **zwischen** (entre).

## Les couples de verbes
| Action — accusatif | État — datif |
| *stellen* — poser debout | *stehen* — être debout |
| *legen* — poser à plat | *liegen* — être couché |
| *setzen* — asseoir | *sitzen* — être assis |
| *hängen* (faible) — accrocher | *hängen* (fort) — être accroché |

*Ich stelle die Flasche auf den Tisch* devient *Die Flasche steht auf dem Tisch*.

## Les contractions
*in das → ins* · *in dem → im* · *an das → ans* · *an dem → am* · *auf das → aufs* · *über das → übers*

## Les emplois figés
Certaines expressions ne relèvent plus du lieu et se retiennent telles quelles : *an einem Montag*, *am Abend*, *im Januar*, *vor drei Jahren*, *über das Thema sprechen*, *auf Deutsch*, *sich auf etwas freuen* (accusatif).

> Le réflexe qui sauve en devoir : trouver le **verbe**, se demander *wo?* ou *wohin?* — et n’écrire l’article qu’**ensuite**.`,
          },
          questions: [
            ['Quel cas suit une préposition mixte en cas de déplacement ?', ['L’accusatif', 'Le datif', 'Le génitif', 'Le nominatif'], 0, 'Question *wohin?* → accusatif. Question *wo?* → datif.'],
            ['« Ich bin in der Schule » exprime…', ['Une localisation', 'Un déplacement', 'Une possession', 'Une cause'], 0, 'Question *wo?* → datif.'],
            ['Combien y a-t-il de prépositions mixtes ?', ['Neuf', 'Cinq', 'Sept', 'Douze'], 0, '*an, auf, hinter, in, neben, über, unter, vor, zwischen*.'],
            ['Quel verbe demande le datif : « stehen » ou « stellen » ?', ['stehen', 'stellen', 'Les deux', 'Aucun des deux'], 0, '*stehen* décrit un état (datif) ; *stellen* un déplacement (accusatif).'],
            ['« Ich laufe im Park » signifie que je cours à l’intérieur du parc.', ['Vrai', 'Faux'], 0, '*in den Park* dirait que j’y entre. Ce n’est pas le verbe qui décide, mais le changement de lieu.'],
            ['En quoi se contracte « in das » ?', ['ins', 'im', 'ind', 'ins dem'], 0, '*in dem* donne *im* : ne pas les confondre, ils n’ont pas le même cas.'],
            ['Comment dit-on « en janvier » ?', ['im Januar', 'in Januar', 'am Januar', 'an Januar'], 0, 'Emploi figé : *im* + mois et saisons, *am* + jours et dates.'],
            ['« sich auf etwas freuen » se construit avec le datif.', ['Vrai', 'Faux'], 1, 'C’est un emploi figé à l’accusatif : *Ich freue mich auf die Ferien.*'],
          ],
        },
        {
          titre: 'Les conjonctions de coordination',
          axe: 'Les groupes prépositionnels',
          lecon: {
            titre: 'Cinq mots qui ne touchent pas à l’ordre des mots',
            cours: `Les conjonctions de coordination relient deux éléments de **même rang**. Leur particularité : elles occupent une **position zéro** et ne comptent pas dans l’ordre des mots.

## Les cinq de base
| Conjonction | Sens | Virgule devant ? |
| **und** | Et | Non, en principe |
| **oder** | Ou | Non |
| **aber** | Mais | **Oui** |
| **denn** | Car | **Oui** |
| **sondern** | Mais au contraire | **Oui** |

Après elles, la phrase garde son ordre normal : sujet, puis verbe en deuxième position.

## La comparaison qui éclaire tout
| Type | Exemple | Où va le verbe |
| **Coordination** | *Ich bleibe zu Hause, denn ich bin krank* | Deuxième position, rien ne bouge |
| **Subordination** | *Ich bleibe zu Hause, weil ich krank bin* | **À la fin** |
| **Adverbe** de liaison | *Es regnet, deshalb bleibe ich zu Hause* | **Inversion** |

> Trois syntaxes pour un **même lien logique**. Les tenir séparées, c’est gagner des points à chaque copie — et les confondre est l’erreur la plus fréquente en expression écrite.

Les adverbes concernés : *deshalb, deswegen, trotzdem, dann, außerdem, sonst*. Ils occupent la **première** position, donc ils provoquent l’inversion.

## sondern après une négation
| Conjonction | Condition | Exemple |
| **sondern** | Il faut une **négation** devant | *Das ist nicht mein Buch, sondern deins* |
| **aber** | Sans négation, ou opposition simple | *Er ist arm, aber glücklich* |

## Les couples corrélatifs
| Couple | Sens | Attention |
| *entweder… oder* | Ou bien… ou bien | |
| *weder… noch* | Ni… ni | La phrase est **déjà** négative : pas de *nicht* |
| *sowohl… als auch* | Aussi bien… que | |
| *nicht nur… sondern auch* | Non seulement… mais aussi | Très valorisé à l’écrit |
| *zwar… aber* | Certes… mais | Idéal pour concéder |`,
          },
          questions: [
            ['Après « denn », où se place le verbe conjugué ?', ['En deuxième position, comme d’habitude', 'À la fin de la proposition', 'En première position', 'Juste après denn'], 0, '*denn* est une coordination : il ne compte pas dans l’ordre des mots.'],
            ['Quelle conjonction envoie le verbe à la fin ?', ['weil', 'denn', 'aber', 'und'], 0, '*weil* subordonne ; *denn* coordonne, pour le même sens.'],
            ['« sondern » s’emploie…', ['Après une négation, pour rectifier', 'Après une affirmation', 'Pour exprimer la cause', 'Pour exprimer le but'], 0, '*Das ist nicht mein Buch, sondern deins.*'],
            ['Que signifie « weder… noch » ?', ['Ni… ni', 'Ou bien… ou bien', 'Non seulement… mais aussi', 'Certes… mais'], 0, 'La phrase est déjà négative : on n’ajoute pas *nicht*.'],
            ['La virgule est obligatoire devant « aber ».', ['Vrai', 'Faux'], 0, 'Comme devant *sondern* et *denn* ; elle est absente devant *und* et *oder*.'],
            ['Dans « Es regnet, deshalb bleibe ich zu Hause », pourquoi « bleibe » précède-t-il « ich » ?', ['Parce que deshalb occupe la première position', 'Parce que c’est une subordonnée', 'Parce que deshalb est une conjonction', 'C’est une faute'], 0, '*deshalb* est un adverbe : il prend la première place et provoque l’inversion.'],
            ['« entweder… oder » signifie « ou bien… ou bien ».', ['Vrai', 'Faux'], 0, 'À ne pas confondre avec *sowohl… als auch*, « aussi bien… que ».'],
            ['Quelle conjonction s’emploie sans négation devant, pour opposer ?', ['aber', 'sondern', 'weder', 'denn'], 0, '*Er ist arm, aber glücklich.* *sondern* exige une négation devant lui.'],
          ],
        },
        {
          titre: 'Les compléments de lieu (locatif / directionnel)',
          axe: 'Les groupes prépositionnels',
          lecon: {
            titre: 'wo, wohin, woher — trois questions, trois constructions',
            cours: `Dire où l’on est, où l’on va, d’où l’on vient : l’allemand distingue les trois par la **préposition** ET par le **cas**.

## Les trois questions
| Question | Ce qu’elle demande | Le cas dominant |
| **wo?** | La localisation | **Datif** |
| **wohin?** | La destination | **Accusatif** ou *nach* / *zu* |
| **woher?** | L’origine | **Datif** avec *aus* ou *von* |

## wohin ? — le tableau qui tranche
| Préposition | Devant quoi | Exemple |
| **nach** | Pays ou ville **sans article** | *nach Deutschland*, *nach Hause* |
| **in** + accusatif | Nom **avec** article | *in die Stadt*, *in die Türkei*, *ins Kino* |
| **zu** + datif | Une **personne** ou un but | *zum Arzt*, *zu meiner Tante* |
| **an** + accusatif | Un **bord** | *ans Meer*, *an die Grenze* |
| **auf** + accusatif | Une surface, une institution | *auf die Post*, *aufs Land* |

## woher ? — l’origine
| Préposition | Ce qu’elle marque | Exemple |
| **aus** + datif | Sortir d’un lieu, venir d’un pays | *aus Frankreich*, *aus dem Haus* |
| **von** + datif | Un point de départ, une personne | *von der Arbeit*, *von meiner Großmutter* |

## Les expressions figées
*nach Hause* / *zu Hause* · *aufs Land* / *auf dem Land* · *ins Ausland* / *im Ausland* · *in die Schule gehen* / *in der Schule sein*

Elles se présentent **toujours** par paires : une avec mouvement, une sans.

## hin et her
| Particule | Ce qu’elle marque | Exemple |
| **hin** | L’éloignement du locuteur | *Geh hin!* — vas-y |
| **her** | Le rapprochement | *Komm her!* — viens ici |

Elles se soudent aux prépositions pour former des préverbes — *hineingehen* (entrer, vu du dehors), *herauskommen* (sortir, vu du dedans) — et se retrouvent dans *wohin* et *woher*, où elles peuvent même se **détacher** : *Wo gehst du hin?*

> Le français dit « je vais **chez** le médecin » et « je suis **chez** le médecin » avec le même mot. L’allemand oblige à choisir : *zum Arzt* / *beim Arzt*.`,
          },
          questions: [
            ['Quelle question appelle un complément de lieu au datif ?', ['wo?', 'wohin?', 'woher?', 'wann?'], 0, '*wo?* = localisation → datif. *wohin?* = déplacement → accusatif.'],
            ['Comment dit-on « je vais chez le médecin » ?', ['Ich gehe zum Arzt', 'Ich gehe beim Arzt', 'Ich gehe nach dem Arzt', 'Ich gehe in Arzt'], 0, '*zu* pour la destination, *bei* pour la localisation : *beim Arzt sein*.'],
            ['Comment dit-on « je viens de France » ?', ['Ich komme aus Frankreich', 'Ich komme von Frankreich', 'Ich komme nach Frankreich', 'Ich komme in Frankreich'], 0, '*aus* + pays d’origine ; *von* marque un point de départ ou une personne.'],
            ['« nach » s’emploie devant un pays qui a un article.', ['Vrai', 'Faux'], 1, 'Avec article, c’est *in* + accusatif : *in die Schweiz*, *in die Türkei*.'],
            ['Que signifie « auf dem Land » ?', ['À la campagne', 'Sur le pays', 'Au bord de la mer', 'À l’étranger'], 0, 'Et *aufs Land* pour le déplacement : *Wir fahren aufs Land.*'],
            ['Que marque la particule « her » ?', ['Le rapprochement vers le locuteur', 'L’éloignement du locuteur', 'La répétition', 'Le passé'], 0, '*Komm her!* — *hin* marque au contraire l’éloignement.'],
            ['« Wo gehst du hin? » est correct.', ['Vrai', 'Faux'], 0, 'La particule de *wohin* peut se détacher et partir en fin de phrase.'],
            ['Comment dit-on « je rentre à la maison » ?', ['Ich gehe nach Hause', 'Ich gehe zu Hause', 'Ich gehe in Hause', 'Ich gehe im Haus'], 0, '*nach Hause* pour le mouvement, *zu Hause* pour l’état.'],
          ],
        },
        {
          titre: 'Les compléments de temps',
          axe: 'Les groupes prépositionnels',
          lecon: {
            titre: 'am, im, um — et l’accusatif sans préposition',
            cours: `Le temps se dit de **trois** façons : avec une préposition, avec un accusatif nu, ou avec un adverbe. Chacune a son terrain.

## Le trio de base
| Préposition | Devant quoi | Exemples |
| **am** | Jours, parties de la journée, dates | *am Montag*, *am Abend*, *am 3. Oktober* |
| **im** | Mois, saisons, années | *im Januar*, *im Sommer*, *im Jahr 2026* |
| **um** | Heure **précise** | *um acht Uhr*, *um Mitternacht* |

Exception à connaître : *in der Nacht*, et non *am*.

## L’accusatif sans préposition
Une durée ou une date entière se met à l’**accusatif**, **sans** préposition.

*jeden Tag* · *jedes Jahr* · *letzte Woche* · *nächsten Monat* · *den ganzen Tag* · *diesen Sommer*

## Les autres prépositions
| Préposition | Sens | Exemple |
| **seit** + datif | Depuis, avec le **présent** | *seit drei Jahren* |
| **vor** + datif | Il y a | *vor zwei Wochen* |
| **in** + datif | Dans, au futur | *in einer Stunde* |
| **bis** | Jusqu’à | *bis morgen*, *bis zum Abend* |
| **von… bis** | De… à | *von Montag bis Freitag* |
| **ab** + datif | À partir de | *ab nächster Woche* |
| **während** + génitif | Pendant | *während der Ferien* |

## Les adverbes
| Adverbe | Sens |
| *morgens, mittags, abends, nachts* | Le matin, à midi, le soir, la nuit — **habituellement** |
| *montags* | Le lundi, tous les lundis |
| *heute, gestern, morgen, übermorgen, vorgestern* | Les repères du jour |
| *immer, oft, manchmal, selten, nie* | La fréquence |

> Trois mots, trois sens, un seul *s* d’écart : *morgen* = demain · *morgens* = le matin, en général · *am Morgen* = ce matin-là.

## La place dans la phrase
Le complément de temps vient **en premier** parmi les compléments — le *Te* de TeKaMoLo — ou **ouvre** la phrase, auquel cas le sujet passe derrière le verbe : *Nächste Woche fahre ich nach Wien.*`,
          },
          questions: [
            ['Comment dit-on « le lundi » (un lundi précis) ?', ['am Montag', 'im Montag', 'um Montag', 'in Montag'], 0, '*am* + jours et parties de la journée.'],
            ['Comment dit-on « en été » ?', ['im Sommer', 'am Sommer', 'um Sommer', 'in Sommer'], 0, '*im* + mois, saisons et années.'],
            ['Comment dit-on « à huit heures » ?', ['um acht Uhr', 'am acht Uhr', 'im acht Uhr', 'in acht Uhr'], 0, '*um* + heure précise.'],
            ['« jeden Tag » est au…', ['Accusatif, sans préposition', 'Datif, sans préposition', 'Génitif', 'Nominatif'], 0, 'Durées et dates entières se mettent à l’accusatif nu : *letzte Woche*, *den ganzen Tag*.'],
            ['Comment dit-on « il y a deux semaines » ?', ['vor zwei Wochen', 'seit zwei Wochen', 'in zwei Wochen', 'ab zwei Wochen'], 0, '*vor* + datif pour le passé ; *in* + datif pour le futur.'],
            ['« morgens » signifie « demain ».', ['Vrai', 'Faux'], 1, '*morgen* = demain, *morgens* = le matin (habituellement).'],
            ['Quelle préposition régit le génitif ?', ['während', 'seit', 'ab', 'bis'], 0, '*während der Ferien*, *während des Sommers*.'],
            ['Où se place le complément de temps parmi les compléments ?', ['En premier', 'En dernier', 'Après le lieu', 'Après la manière'], 0, 'C’est le *Te* de TeKaMoLo : temps, cause, manière, lieu.'],
          ],
        },
        // ---- Chapitre 4 du programme : Le groupe verbal ----------------------
        {
          titre: 'Les auxiliaires',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'sein, haben, werden : trois verbes, six emplois',
            cours: `Trois verbes portent à eux seuls toute la conjugaison allemande. Chacun mène une **double vie** : verbe à part entière, et auxiliaire.

## Les trois, et leurs emplois
| Verbe | Comme verbe plein | Comme auxiliaire |
| **sein** | Être : *Ich bin müde* | Parfait des verbes de mouvement ; passif **d’état** |
| **haben** | Avoir : *Ich habe ein Auto* | Parfait de **tous les autres** verbes |
| **werden** | Devenir : *Er wird Arzt* | **Futur** ; **passif** d’action |

## Les formes à savoir
| | Présent (ich) | Prétérit | Participe |
| *sein* | *bin, bist, ist, sind, seid, sind* | *war* | *gewesen* |
| *haben* | *habe, hast, hat, haben, habt, haben* | *hatte* | *gehabt* |
| *werden* | *werde, wirst, wird, werden, werdet, werden* | *wurde* | *geworden* / *worden* au passif |

## haben ou sein au parfait
| On emploie **sein** | Exemples |
| Verbes de **mouvement** d’un point à un autre | *gehen, fahren, kommen, fliegen, laufen, reisen* |
| Verbes de **changement d’état** | *aufstehen, einschlafen, aufwachen, sterben, wachsen* |
| Les quatre à part | *sein*, *bleiben*, *werden*, *passieren* |

**haben** avec tous les autres — **y compris** un verbe de mouvement employé avec un COD : *Ich habe das Auto gefahren*.

> C’est le sens de la phrase qui tranche, pas le verbe lui-même : *Ich bin gefahren* (je me suis déplacé) contre *Ich habe das Auto gefahren* (j’ai conduit la voiture).

## Un faux ami à haute fréquence
*bekommen* signifie « **recevoir** », jamais « devenir ». « Je deviens » se dit *ich werde*. La confusion produit des contresens complets.`,
          },
          questions: [
            ['Quel auxiliaire s’emploie au parfait avec les verbes de mouvement ?', ['sein', 'haben', 'werden', 'lassen'], 0, '*Ich bin gefahren*, *ich bin gegangen*.'],
            ['Quel est le prétérit de « haben » à la 1re personne ?', ['ich hatte', 'ich habte', 'ich hatt', 'ich war'], 0, 'Verbe mixte : radical modifié + terminaison faible.'],
            ['« werden » sert d’auxiliaire au futur ET au passif.', ['Vrai', 'Faux'], 0, '*Ich werde kommen* (futur) / *Das Haus wird gebaut* (passif).'],
            ['Comment se conjugue « sein » à la 2e personne du pluriel ?', ['ihr seid', 'ihr sind', 'ihr seit', 'ihr bist'], 0, '*seid* avec un d — *seit* avec un t est la préposition « depuis ».'],
            ['Que signifie « bekommen » ?', ['Recevoir', 'Devenir', 'Venir', 'Convenir'], 0, 'Faux ami classique : « devenir » se dit *werden*.'],
            ['« Ich habe das Auto gefahren » est correct.', ['Vrai', 'Faux'], 0, 'Employé avec un COD, un verbe de mouvement prend *haben*.'],
            ['Quel est le participe passé de « werden » dans un passif ?', ['worden', 'geworden', 'gewerdet', 'werdet'], 0, '*geworden* est réservé au verbe plein : *Er ist Arzt geworden.*'],
            ['Quel auxiliaire prend « bleiben » au parfait ?', ['sein', 'haben', 'werden', 'les deux au choix'], 0, '*Ich bin zu Hause geblieben*, comme *sein* et *passieren*.'],
          ],
        },
        {
          titre: 'Les verbes faibles et les verbes forts',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Trois formes à retenir par verbe',
            cours: `Un verbe allemand s’apprend par ses **trois temps primitifs** : infinitif, prétérit, participe II. Avec eux, toute la conjugaison se déduit.

## Les deux grandes familles
| | **Faibles** | **Forts** |
| Le radical | Ne change **jamais** | La voyelle **change** — l’*Ablaut* |
| Prétérit | En **-te** | **Sans terminaison** aux 1re et 3e personnes |
| Participe | ge- … **-t** | ge- … **-en** |
| Exemple | *machen → machte → gemacht* | *sprechen → sprach → gesprochen* |

Les faibles forment la grande majorité des verbes — et **tous les verbes nouveaux** : *googeln → googelte → gegoogelt*.

## Quelques forts à connaître
| Infinitif | Prétérit | Participe |
| *fahren* | *fuhr* | *gefahren* |
| *schreiben* | *schrieb* | *geschrieben* |
| *nehmen* | *nahm* | *genommen* |
| *gehen* | *ging* | *gegangen* |
| *sprechen* | *sprach* | *gesprochen* |

## Le changement de voyelle au présent
Beaucoup de verbes forts modifient leur voyelle aux **2e et 3e personnes du singulier seulement**.

| Changement | Exemples |
| *e → i* | *geben → du gibst, er gibt* · *sprechen → du sprichst* |
| *e → ie* | *sehen → du siehst* · *lesen → du liest* |
| *a → ä* | *fahren → du fährst* · *schlafen → du schläfst* |

Il disparaît au pluriel : *wir geben*, *ihr gebt*.

## Les cas particuliers
| Famille | Ce qu’elle fait | Exemples |
| **Mixtes** | Radical **modifié** + terminaisons **faibles** | *bringen → brachte → gebracht* · *denken → dachte → gedacht* |
| Verbes en **-ieren** | Faibles, et **sans ge-** au participe | *studieren → studiert* · *telefonieren → telefoniert* |

> Le seul apprentissage qui paie vraiment : les **trois formes dites ensemble**, à voix haute. Les reconnaître, c’est reconstruire le sens d’un texte à la lecture — pas seulement réussir un exercice.`,
          },
          questions: [
            ['Qu’appelle-t-on les trois temps primitifs d’un verbe ?', ['Infinitif, prétérit, participe II', 'Présent, futur, passé', 'Infinitif, présent, parfait', 'Radical, préverbe, terminaison'], 0, 'Avec eux, toute la conjugaison se déduit.'],
            ['Quel est le participe passé de « spielen » ?', ['gespielt', 'gespielen', 'spielte', 'gespiel'], 0, 'Verbe faible : *ge-* + radical + *-t*.'],
            ['Un verbe fort change de voyelle au prétérit.', ['Vrai', 'Faux'], 0, 'C’est l’alternance vocalique : *sprechen → sprach*, *fahren → fuhr*.'],
            ['Comment se conjugue « geben » à la 3e personne du singulier ?', ['er gibt', 'er gebt', 'er gab', 'er gibst'], 0, 'Alternance *e → i* aux 2e et 3e personnes du singulier seulement.'],
            ['Comment se conjugue « fahren » à la 2e personne du singulier ?', ['du fährst', 'du fahrst', 'du fuhrst', 'du fährt'], 0, 'Alternance *a → ä*, qui disparaît au pluriel.'],
            ['« bringen → brachte → gebracht » est un verbe…', ['Mixte', 'Faible régulier', 'Fort', 'Irrégulier isolé'], 0, 'Radical modifié mais terminaisons faibles, comme *denken* et *wissen*.'],
            ['Les verbes en -ieren prennent « ge- » au participe.', ['Vrai', 'Faux'], 1, '*studiert*, *telefoniert*, *fotografiert* : jamais de *ge-*.'],
            ['Quel est le prétérit de « schreiben » ?', ['schrieb', 'schreibte', 'schrob', 'geschrieben'], 0, 'Verbe fort : *schreiben → schrieb → geschrieben*.'],
          ],
        },
        {
          titre: 'Les verbes de modalité',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Six verbes qui changent le sens de la phrase',
            cours: `Les modaux disent le **rapport du sujet à l’action** : possibilité, obligation, volonté. Ils se conjuguent à part, et envoient l’infinitif à la fin.

## Les six, et leurs nuances
| Modal | Ce qu’il exprime | Exemple |
| **können** | Pouvoir — la **capacité** | *Ich kann schwimmen* |
| **dürfen** | Avoir le **droit** | *Darf ich reinkommen?* |
| **müssen** | Devoir — la **nécessité** | *Ich muss lernen* |
| **sollen** | Devoir — une **consigne venue d’autrui** | *Ich soll pünktlich sein* |
| **wollen** | Vouloir — la volonté ferme | *Ich will nach Berlin* |
| **mögen** | Aimer, apprécier | *Ich mag Schokolade* |

*möchte*, subjonctif II de *mögen*, est la façon **polie** de dire « je voudrais » — c’est la forme la plus employée des six.

## Une conjugaison à part
Au singulier, la voyelle change et il n’y a **aucune terminaison** aux 1re et 3e personnes.

| Personne | *können* |
| ich | *kann* |
| du | *kannst* |
| er / sie / es | *kann* |
| wir | *können* |
| ihr | *könnt* |
| sie / Sie | *können* |

Prétérit régulier, **sans inflexion** : *konnte, durfte, musste, sollte, wollte, mochte*. C’est le passé usuel des modaux, même à l’oral.

## Deux constructions
| Cas | Ce qui se passe | Exemple |
| Principale | Le modal en 2e position, l’infinitif à la fin | *Ich muss heute Abend arbeiten* |
| Subordonnée | Tout part à la fin | *…, weil ich arbeiten muss* |
| Parfait avec infinitif | **Double infinitif** : pas de participe | *Ich habe arbeiten müssen* |
| Parfait sans infinitif | Le participe existe | *Ich habe es gemusst* |

## Le piège de la négation
| Structure | Ce qu’elle dit vraiment |
| *Ich muss nicht* | Je **ne suis pas obligé** |
| *Ich darf nicht* | Je **n’ai pas le droit** — l’interdiction |

> C’est l’un des contresens les plus coûteux : *Du musst nicht rauchen* ne veut **pas** dire « tu ne dois pas fumer », mais « tu n’es pas obligé de fumer ».

Et *sollen* rapporte une consigne **extérieure** : *Ich soll den Arzt fragen* signifie « on m’a dit de demander au médecin ». C’est un outil précieux pour rapporter un propos sans le prendre à son compte.`,
          },
          questions: [
            ['Où se place l’infinitif dépendant d’un modal, dans une principale ?', ['À la fin de la phrase', 'Juste après le modal', 'Devant le sujet', 'En première position'], 0, '*Ich muss heute Abend arbeiten.*'],
            ['Comment se conjugue « können » à la 1re personne du singulier ?', ['ich kann', 'ich könne', 'ich kanne', 'ich könnt'], 0, 'Les modaux n’ont aucune terminaison aux 1re et 3e personnes du singulier.'],
            ['« Ich muss nicht kommen » signifie…', ['Je ne suis pas obligé de venir', 'Je ne dois pas venir', 'Je ne peux pas venir', 'Je ne veux pas venir'], 0, 'L’interdiction se dit *nicht dürfen* : *Du darfst nicht kommen.*'],
            ['Quel modal exprime une consigne venue d’autrui ?', ['sollen', 'wollen', 'können', 'mögen'], 0, '*Ich soll den Arzt fragen* : on m’a dit de le faire.'],
            ['Quel est le prétérit de « müssen » ?', ['musste', 'müsste', 'mochte', 'gemusst'], 0, 'Sans inflexion : *musste*. *müsste* est le subjonctif II.'],
            ['Au parfait, avec un infinitif dépendant, le modal prend la forme du participe.', ['Vrai', 'Faux'], 1, 'C’est le double infinitif : *Ich habe arbeiten müssen.*'],
            ['Comment dire poliment « je voudrais un café » ?', ['Ich möchte einen Kaffee', 'Ich will einen Kaffee', 'Ich mag einen Kaffee', 'Ich muss einen Kaffee'], 0, '*möchte* est le subjonctif II de *mögen* : la forme polie usuelle.'],
            ['Quel modal exprime l’autorisation ?', ['dürfen', 'müssen', 'wollen', 'sollen'], 0, '*Darf ich reinkommen?* — *können* dit la capacité.'],
          ],
        },
        {
          titre: 'Les verbes à préverbe séparable',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'Le préverbe part à la fin — sauf quand il ne part pas',
            cours: `Un même radical peut donner dix verbes différents selon le préverbe qui le précède. Encore faut-il savoir si ce préverbe **se détache**.

## Le test de l’accent
| Type | Accentué ? | Exemple |
| **Séparable** | **Oui**, sur le préverbe | *ÁN-rufen*, *ÁUF-stehen*, *ÉIN-kaufen* |
| **Inséparable** | Non, sur le radical | *be-SÚCHEN*, *ver-STÉHEN* |

C’est le **seul** critère fiable — et il s’entend.

## Les deux listes
| Séparables | Inséparables |
| *ab-, an-, auf-, aus-, ein-* | *be-, ge-, er-* |
| *mit-, nach-, vor-, zu-* | *ver-, zer-, ent-* |
| *zurück-, weg-, los-, hin-, her-* | *emp-, miss-* |

## Ce que chacun fait
| Situation | Séparable | Inséparable |
| Dans une principale | Le préverbe **ferme la phrase** : *Ich stehe um sieben Uhr auf* | Rien ne bouge : *Ich besuche meine Tante* |
| Au participe | Le *ge-* **s’intercale** : *aufgestanden* | **Pas de ge-** : *besucht*, *verstanden* |
| Avec *zu* | Le *zu* s’intercale : *aufzustehen* | *zu* reste devant : *zu besuchen* |
| En subordonnée | Tout se **recolle** : *…, weil er aufsteht* | Inchangé |

## Les préverbes à double statut
*durch-, über-, unter-, um-, wieder-* sont séparables ou non **selon le sens**.

| Phrase | Statut | Sens |
| *Ich setze über* | Séparable | Je traverse en bateau — sens **concret** |
| *Ich übersetze den Text* | Inséparable | Je traduis — sens **figuré** |

> Le sens dépend **entièrement** du préverbe : *kommen* (venir), *ankommen* (arriver), *bekommen* (recevoir), *mitkommen* (accompagner), *umkommen* (périr). On n’apprend jamais un verbe allemand sans son préverbe.`,
          },
          questions: [
            ['Comment reconnaître un préverbe séparable ?', ['Il porte l’accent du mot', 'Il commence par be-', 'Il se termine par -en', 'Il est toujours plus long'], 0, '*ÁNrufen* contre *be-SÚCHEN* : le critère s’entend.'],
            ['Dans une principale, où va le préverbe séparable ?', ['À la fin de la phrase', 'Devant le verbe', 'Après le sujet', 'Il reste soudé'], 0, '*Ich stehe um sieben Uhr auf.*'],
            ['Quel est le participe passé de « aufstehen » ?', ['aufgestanden', 'geaufstanden', 'aufstanden', 'gestandenauf'], 0, 'Le *ge-* s’intercale entre le préverbe et le radical.'],
            ['Quel est le participe passé de « besuchen » ?', ['besucht', 'gebesucht', 'besuchen', 'gesucht'], 0, 'Les préverbes inséparables (*be-, ver-, er-, ent-*) interdisent le *ge-*.'],
            ['Comment écrit-on « einkaufen » avec « zu » ?', ['einzukaufen', 'zu einkaufen', 'einkaufen zu', 'zueinkaufen'], 0, 'Le *zu* s’intercale, et le tout s’écrit en un seul mot.'],
            ['En subordonnée, le préverbe reste détaché.', ['Vrai', 'Faux'], 1, 'Le verbe conjugué part à la fin et rejoint son préverbe : *…, weil er aufsteht.*'],
            ['« übersetzen » est toujours inséparable.', ['Vrai', 'Faux'], 1, 'Séparable au sens concret (traverser), inséparable au sens figuré (traduire).'],
            ['Que signifie « ankommen » ?', ['Arriver', 'Venir', 'Recevoir', 'Accompagner'], 0, '*bekommen* = recevoir, *mitkommen* = accompagner : le préverbe fait le sens.'],
          ],
        },
        {
          titre: 'Les verbes pronominaux',
          axe: 'Le groupe verbal',
          lecon: {
            titre: 'sich, à l’accusatif ou au datif',
            cours: `Le pronom réfléchi allemand a **deux séries**, et la différence n’est pas décorative : elle change la construction de la phrase.

## Les deux séries
| Personne | Accusatif | Datif |
| ich | *mich* | *mir* |
| du | *dich* | *dir* |
| er / sie / es | *sich* | *sich* |
| wir | *uns* | *uns* |
| ihr | *euch* | *euch* |
| sie / Sie | *sich* | *sich* |

Elles ne diffèrent **qu’aux deux premières personnes du singulier**.

## La règle qui choisit
| Y a-t-il déjà un COD ? | Le réfléchi est au… | Exemple |
| **Non** | Accusatif | *Ich wasche mich* |
| **Oui** | **Datif** | *Ich wasche mir die Hände* |

Elle est mécanique : un COD dans la phrase, et le réfléchi passe au datif. *Ich sehe mir den Film an* · *Ich kaufe mir ein Buch*.

## La place du pronom
| Contexte | Où il va | Exemple |
| Principale | Juste après le verbe conjugué | *Ich freue mich auf die Ferien* |
| Inversion | Après le verbe, avant un sujet nominal | *Gestern hat sich mein Bruder verletzt* |
| Subordonnée | Après le sujet | *…, weil ich mich freue* |

## Les prépositions qui vont avec
| Verbe | Préposition | Nuance |
| *sich freuen* | *auf* + accusatif | Se réjouir de ce **qui vient** |
| *sich freuen* | *über* + accusatif | Se réjouir de ce **qui est arrivé** |
| *sich interessieren* | *für* + accusatif | S’intéresser à |
| *sich erinnern* | *an* + accusatif | Se souvenir de |
| *sich ärgern* | *über* + accusatif | S’agacer de |

## Les faux pronominaux
| Pronominal en français, pas en allemand | Pronominal en allemand, pas en français |
| *aufstehen* — se lever | *sich verspäten* — être en retard |
| *spazieren gehen* — se promener | |
| *passieren* — se passer | |
| *heißen* — s’appeler | |

> *sich* ne s’écrit **jamais** avec une majuscule, même dans le vouvoiement : *Setzen Sie sich bitte!* Le *Sie* la prend, le *sich* non.`,
          },
          questions: [
            ['Quelle est la forme du réfléchi à la 3e personne, à l’accusatif comme au datif ?', ['sich', 'ihn', 'ihm', 'es'], 0, '*sich* couvre les deux cas à la 3e personne, singulier et pluriel.'],
            ['Quand emploie-t-on le réfléchi au datif ?', ['Quand la phrase contient déjà un COD', 'Quand le verbe est fort', 'Quand la phrase est négative', 'Quand le sujet est au pluriel'], 0, '*Ich wasche mir die Hände* : *die Hände* est le COD.'],
            ['Comment dit-on « je me lave » (sans complément) ?', ['Ich wasche mich', 'Ich wasche mir', 'Ich wasche mich die', 'Ich wasche sich'], 0, 'Sans COD, le réfléchi reste à l’accusatif.'],
            ['Où se place le pronom réfléchi dans une principale ?', ['Juste après le verbe conjugué', 'À la fin de la phrase', 'Devant le sujet toujours', 'Après le participe passé'], 0, '*Ich freue mich auf die Ferien.*'],
            ['« sich freuen auf » se construit avec…', ['L’accusatif', 'Le datif', 'Le génitif', 'Le nominatif'], 0, 'Comme *sich interessieren für* et *sich erinnern an* : préposition + accusatif.'],
            ['« aufstehen » est un verbe pronominal en allemand.', ['Vrai', 'Faux'], 1, '« Se lever » se dit *aufstehen*, sans pronom réfléchi.'],
            ['Dans le vouvoiement, « sich » prend une majuscule.', ['Vrai', 'Faux'], 1, '*Setzen Sie sich bitte!* — seul *Sie* et ses formes possessives la prennent.'],
            ['Comment dit-on « je m’achète un livre » ?', ['Ich kaufe mir ein Buch', 'Ich kaufe mich ein Buch', 'Ich kaufe sich ein Buch', 'Ich kaufe mein Buch'], 0, 'Il y a un COD (*ein Buch*) : le réfléchi passe au datif.'],
          ],
        },
        // ---- Chapitre 5 du programme : Les temps -----------------------------
        {
          titre: 'L’indicatif présent',
          axe: 'Les temps',
          lecon: {
            titre: 'Un seul présent, et il dit aussi le futur',
            cours: `L’allemand n’a **qu’une** forme de présent, là où l’anglais en a deux : *ich spiele* traduit aussi bien « je joue » que « je suis en train de jouer ».

## Les terminaisons
| Personne | Terminaison | *spielen* |
| ich | -e | *spiele* |
| du | -st | *spielst* |
| er / sie / es | -t | *spielt* |
| wir | -en | *spielen* |
| ihr | -t | *spielt* |
| sie / Sie | -en | *spielen* |

## Les aménagements de prononciation
| Le radical finit par… | Ce qui se passe | Exemple |
| -d, -t, -n après consonne | On intercale un **e** | *du arbeitest*, *ihr findet* |
| -s, -ß, -z, -x | Le -st perd son **s** | *du heißt*, *du sitzt* |
| -el | Le e tombe à la 1re personne | *ich sammle* |

## Les verbes forts
Aux **2e et 3e personnes du singulier seulement** :

| Changement | Exemples |
| *e → i* | *du gibst, er gibt* · *du sprichst* |
| *e → ie* | *du siehst, er sieht* · *du liest* |
| *a → ä* | *du fährst, er fährt* · *du schläfst* |
| *au → äu* | *du läufst* |

## Les trois valeurs du présent
| Valeur | Exemple |
| Le **moment présent** | *Ich spiele jetzt* |
| L’**habitude** | *Ich spiele jeden Tag* |
| L’**avenir proche** | *Morgen fahre ich nach Berlin* |

> Avec un adverbe de temps, le présent **suffit** à dire l’avenir — et c’est la tournure la plus naturelle. Le futur en *werden* n’est utile que **sans** repère temporel, ou pour insister.

## Le présent avec seit
Là où le français dit « j’apprends… depuis trois ans », l’allemand fait **de même**, au présent : *Ich lerne seit drei Jahren Deutsch*. Employer le parfait ici est une faute — c’est l’anglais qui fait autrement, pas le français.`,
          },
          questions: [
            ['Quelle est la terminaison de la 2e personne du singulier ?', ['-st', '-t', '-e', '-en'], 0, '*du spielst*, *du lernst*, *du wohnst*.'],
            ['Comment se conjugue « arbeiten » à la 3e personne du singulier ?', ['er arbeitet', 'er arbeitt', 'er arbeit', 'er arbeitest'], 0, 'Radical en *-t* : on intercale un *e* pour pouvoir prononcer.'],
            ['Comment se conjugue « heißen » à la 2e personne du singulier ?', ['du heißt', 'du heißst', 'du heißest', 'du heißen'], 0, 'Après *-s, -ß, -z*, le *-st* perd son *s*.'],
            ['Le changement de voyelle des verbes forts touche aussi le pluriel.', ['Vrai', 'Faux'], 1, 'Il ne concerne que les 2e et 3e personnes du singulier : *wir fahren*, pas *wir fähren*.'],
            ['Comment se conjugue « lesen » à la 3e personne du singulier ?', ['er liest', 'er lest', 'er läst', 'er liesst'], 0, 'Alternance *e → ie*, et le *-st* fusionne avec le *s* du radical.'],
            ['Comment traduire « demain, je vais à Berlin » ?', ['Morgen fahre ich nach Berlin', 'Morgen ich fahre nach Berlin', 'Morgen werde ich fahren nach Berlin', 'Morgen ich werde nach Berlin'], 0, 'Le présent suffit à dire l’avenir dès qu’un adverbe de temps le précise.'],
            ['Avec « seit », l’allemand emploie le parfait.', ['Vrai', 'Faux'], 1, 'C’est le présent : *Ich lerne seit drei Jahren Deutsch.*'],
            ['Comment se conjugue « werden » à la 2e personne du singulier ?', ['du wirst', 'du werdest', 'du werdst', 'du wird'], 0, '*werde, wirst, wird, werden, werdet, werden*.'],
          ],
        },
        {
          titre: 'Le prétérit',
          axe: 'Les temps',
          lecon: {
            titre: 'Le passé de l’écrit et du récit',
            cours: `Le prétérit est le temps du **récit** : romans, presse, exposés, comptes rendus. À l’oral, il ne survit que pour quelques verbes — mais ceux-là sont les plus fréquents de la langue.

## Les trois familles
| Famille | Formation | Exemple |
| **Faibles** | Radical + **-te** + terminaisons | *ich spielte, du spieltest, er spielte* |
| **Forts** | Voyelle changée, **aucune terminaison** aux 1re et 3e | *ich ging, du gingst, er ging* |
| **Mixtes** | Radical modifié + terminaisons faibles | *bringen → brachte* · *denken → dachte* |

Dans les deux premières, les 1re et 3e personnes du singulier sont **identiques** : c’est le contexte qui les distingue.

## Les forts à connaître par cœur
| Infinitif | Prétérit | Infinitif | Prétérit |
| *gehen* | *ging* | *nehmen* | *nahm* |
| *kommen* | *kam* | *schreiben* | *schrieb* |
| *sehen* | *sah* | *bleiben* | *blieb* |
| *geben* | *gab* | *finden* | *fand* |
| *fahren* | *fuhr* | *trinken* | *trank* |
| *sprechen* | *sprach* | *essen* | *aß* |

## Ceux qui survivent à l’oral
*sein → war* · *haben → hatte* · *werden → wurde* · et les six modaux : *konnte, durfte, musste, sollte, wollte, mochte*.

Dire *ich bin müde gewesen* n’est pas faux — mais *ich war müde* est ce que **tout le monde** dit.

## Le plus-que-parfait
Prétérit de *haben* ou *sein* + participe II : *Ich hatte gegessen*, *Er war gegangen*. Il marque l’antériorité, surtout après *nachdem* : *Nachdem ich gegessen hatte, ging ich schlafen*.

> Règle de choix : à l’**oral** et dans une lettre, on raconte au **parfait** ; dans un texte **narratif** ou un résumé écrit, on raconte au **prétérit**. Mélanger les deux dans un même récit fait désordre — et se voit.`,
          },
          questions: [
            ['Le prétérit est le temps…', ['De l’écrit et du récit', 'De l’oral courant', 'Du futur proche', 'De l’hypothèse'], 0, 'À l’oral, on raconte au parfait — sauf pour *sein*, *haben* et les modaux.'],
            ['Quelle est la marque du prétérit des verbes faibles ?', ['-te', '-en', '-st', 'Un changement de voyelle'], 0, '*ich spielte*, *er spielte* : les deux formes sont identiques.'],
            ['Quel est le prétérit de « gehen » ?', ['ging', 'gehte', 'gang', 'gegangen'], 0, 'Verbe fort : *gehen → ging → gegangen*.'],
            ['Aux 1re et 3e personnes, un verbe fort au prétérit ne prend aucune terminaison.', ['Vrai', 'Faux'], 0, '*ich ging*, *er ging* : la forme est nue.'],
            ['Quel est le prétérit de « wissen » ?', ['wusste', 'wisste', 'wieß', 'gewusst'], 0, 'Verbe mixte : radical modifié, terminaison faible.'],
            ['Quels verbes emploie-t-on au prétérit même à l’oral ?', ['sein, haben, werden et les modaux', 'Tous les verbes forts', 'Les verbes en -ieren', 'Aucun'], 0, '*Ich war müde* est bien plus naturel que *ich bin müde gewesen*.'],
            ['Comment forme-t-on le plus-que-parfait ?', ['Prétérit de haben ou sein + participe II', 'Présent de werden + infinitif', 'Prétérit + zu', 'Parfait + würde'], 0, '*Ich hatte gegessen*, *er war gegangen* — surtout après *nachdem*.'],
            ['Quel est le prétérit de « nehmen » ?', ['nahm', 'nehmte', 'nimmte', 'genommen'], 0, 'Alternance forte : *nehmen → nahm → genommen*.'],
          ],
        },
        {
          titre: 'Le parfait',
          axe: 'Les temps',
          lecon: {
            titre: 'Le passé qu’on parle',
            cours: `Le parfait est le passé de la **conversation**, du courriel, du message. Il se forme en deux morceaux, comme le passé composé français — mais l’auxiliaire ne se choisit **pas** de la même façon.

## La formation
**haben** ou **sein** au présent + **participe II** rejeté en fin de phrase.

*Ich habe einen Film gesehen.* · *Ich bin nach Berlin gefahren.*

## Le participe II
| Type de verbe | Formation | Exemples |
| Faible | **ge-** + radical + **-t** | *gespielt*, *gelernt*, *gemacht* |
| Fort | **ge-** + radical modifié + **-en** | *gesehen*, *gefahren*, *gegessen* |
| En **-ieren** | **Pas** de ge- | *studiert*, *telefoniert* |
| Préverbe **inséparable** | **Pas** de ge- | *besucht*, *verstanden*, *erzählt* |
| Préverbe **séparable** | Le ge- **s’intercale** | *aufgestanden*, *eingekauft* |

## haben ou sein
| On emploie **sein** avec | Exemples |
| Les verbes de **déplacement** d’un point à un autre | *gehen, kommen, fahren, fliegen, laufen, reisen, steigen* |
| Les verbes de **changement d’état** | *aufstehen, einschlafen, aufwachen, wachsen, sterben* |
| Six à part | *sein*, *bleiben*, *werden*, *passieren*, *geschehen*, *begegnen* |

**haben** ailleurs — y compris pour un verbe de mouvement employé **transitivement** : *Ich habe das Auto gefahren*.

## L’ordre des mots
| Contexte | L’auxiliaire | Le participe |
| Principale | **2e position** | À la fin |
| Subordonnée | **À la toute fin**, après le participe | Avant l’auxiliaire |

*…, weil ich einen Film gesehen habe.*

> Le français distingue passé composé et imparfait — une opposition d’**aspect**. L’allemand, lui, distingue parfait et prétérit — une opposition de **registre**. Un imparfait français se traduit donc par un prétérit dans un récit écrit, et par un parfait dans un dialogue.`,
          },
          questions: [
            ['Où se place le participe II dans une principale au parfait ?', ['À la fin de la phrase', 'Juste après l’auxiliaire', 'En deuxième position', 'Devant le sujet'], 0, 'C’est la parenthèse verbale : l’auxiliaire ouvre, le participe ferme.'],
            ['Quel est le participe II de « fahren » ?', ['gefahren', 'gefahrt', 'fahren', 'gefuhr'], 0, 'Verbe fort : *ge-* + radical + *-en*.'],
            ['Quel auxiliaire prend « einschlafen » au parfait ?', ['sein', 'haben', 'werden', 'Les deux'], 0, 'C’est un verbe de changement d’état : *Ich bin eingeschlafen.*'],
            ['Quel est le participe II de « telefonieren » ?', ['telefoniert', 'getelefoniert', 'telefonierte', 'getelefonierte'], 0, 'Les verbes en *-ieren* n’ont jamais de *ge-*.'],
            ['Quel est le participe II de « einkaufen » ?', ['eingekauft', 'geeinkauft', 'einkauft', 'gekaufein'], 0, 'Préverbe séparable : le *ge-* s’intercale.'],
            ['« Ich habe das Auto gefahren » est une faute.', ['Vrai', 'Faux'], 1, 'Employé avec un COD, *fahren* prend *haben*.'],
            ['En subordonnée, où se place l’auxiliaire au parfait ?', ['Après le participe, à la toute fin', 'En deuxième position', 'Devant le participe', 'Il disparaît'], 0, '*…, weil ich einen Film gesehen habe.*'],
            ['Le parfait est le passé de la conversation.', ['Vrai', 'Faux'], 0, 'Le prétérit, lui, est celui du récit écrit.'],
          ],
        },
        {
          titre: 'Le futur',
          axe: 'Les temps',
          lecon: {
            titre: 'werden + infinitif, et le présent qui suffit souvent',
            cours: `L’allemand a un futur, mais il ne l’emploie **pas** aussi souvent que le français. Savoir quand il est nécessaire vaut mieux que de le placer partout.

## Le Futur I
**werden** conjugué + **infinitif** en fin de phrase : *Ich werde morgen nach Berlin fahren*.

Conjugaison de *werden* : *ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden*.

## Présent ou futur
| Situation | Ce qu’on emploie | Exemple |
| Un adverbe de temps précise l’avenir | Le **présent** suffit | *Morgen fahre ich nach Berlin* |
| Aucun repère de temps | Le **futur**, pour lever l’ambiguïté | *Ich werde dir helfen* |
| Une promesse, une prédiction | Le futur | *Das wird nicht einfach sein* |
| Une insistance, presque une menace | Le futur | *Du wirst jetzt aufräumen!* |

Employer le futur avec un adverbe de temps n’est pas faux — seulement plus lourd.

## La valeur de supposition
Le futur exprime aussi une **hypothèse sur le présent**, souvent renforcée par *wohl*.

| Phrase | Ce qu’elle dit vraiment |
| *Er wird wohl krank sein* | « Il **doit** être malade » — pas « il sera malade » |
| *Er wird es vergessen haben* | « Il a dû l’oublier » — Futur II de supposition |

> C’est un emploi fréquent, et le contresens est facile : un futur allemand ne parle pas toujours de l’avenir.

## Attention à werden
Le même verbe sert à **trois** choses. C’est ce qui **suit** qui tranche.

| Ce qui suit *werden* | Ce que la phrase exprime | Exemple |
| Un **nom** ou un adjectif | « Devenir » | *Er wird Arzt* |
| Un **infinitif** | Le **futur** | *Er wird kommen* |
| Un **participe II** | Le **passif** | *Das Haus wird gebaut* |

En subordonnée, les deux morceaux se rejoignent à la fin, et c’est *werden* qui ferme : *…, dass er kommen wird*.`,
          },
          questions: [
            ['Comment se forme le Futur I ?', ['werden + infinitif', 'sein + participe II', 'haben + infinitif', 'werden + participe II'], 0, '*Ich werde morgen fahren*, l’infinitif en fin de phrase.'],
            ['Comment se conjugue « werden » à la 3e personne du singulier ?', ['er wird', 'er werd', 'er werdet', 'er wurde'], 0, '*ich werde, du wirst, er wird…*'],
            ['Quand le présent suffit-il à exprimer le futur ?', ['Quand un adverbe de temps précise l’avenir', 'Jamais', 'Uniquement avec les modaux', 'Uniquement à l’écrit'], 0, '*Morgen fahre ich nach Berlin* est la forme la plus courante.'],
            ['« Er wird wohl krank sein » signifie…', ['Il doit être malade (supposition)', 'Il sera malade demain', 'Il est tombé malade', 'Il veut être malade'], 0, 'Le futur exprime aussi une hypothèse sur le présent, souvent avec *wohl*.'],
            ['« Das Haus wird gebaut » est un futur.', ['Vrai', 'Faux'], 1, 'C’est un passif : *werden* + participe II. Le futur demanderait un infinitif.'],
            ['Que signifie « Er wird Arzt » ?', ['Il devient médecin', 'Il sera médecin demain', 'Il est fait médecin', 'Il doit être médecin'], 0, '*werden* + nom : c’est le verbe plein « devenir ».'],
            ['En subordonnée, quel mot ferme une phrase au futur ?', ['werden conjugué', 'L’infinitif', 'Le sujet', 'La conjonction'], 0, '*…, dass er kommen wird.*'],
            ['Le Futur II exprime une action achevée dans l’avenir.', ['Vrai', 'Faux'], 0, '*Bis morgen werde ich das Buch gelesen haben* — ou une supposition sur le passé.'],
          ],
        },
        {
          titre: 'L’impératif',
          axe: 'Les temps',
          lecon: {
            titre: 'Trois personnes, trois formes',
            cours: `On ne donne pas un ordre de la même façon à un camarade, à un groupe ou à un adulte qu’on vouvoie. L’allemand a une forme pour chacun.

## Les quatre formes
| Personne | Formation | Pronom ? | Exemple |
| **du** | Radical du présent, **sans terminaison** | **Non** | *Komm!*, *Geh!*, *Mach!* |
| **ihr** | La forme du présent | **Non** | *Kommt!*, *Arbeitet!* |
| **Sie** | L’infinitif + *Sie* | **Oui** | *Kommen Sie!* |
| **wir** | L’infinitif + *wir* | Oui | *Gehen wir!* — allons-y |

Un *-e* final est possible à l’écrit soutenu (*Gehe!*), et **obligatoire** après -d, -t, -ig : *Arbeite!*, *Entschuldige!*

## Les alternances vocaliques
| Alternance | À l’impératif du *du* | Exemples |
| *e → i / ie* | Elle se **garde** | *Gib!*, *Nimm!*, *Lies!*, *Sieh!* |
| *a → ä* | Elle se **perd** | *Fahr!*, *Schlaf!*, *Lauf!* |

C’est le seul point vraiment irrégulier de l’impératif.

## sein est à part
*Sei ruhig!* (du) · *Seid ruhig!* (ihr) · *Seien Sie ruhig!* (Sie).

## Adoucir l’ordre
| Particule | Ce qu’elle ajoute |
| *bitte* | La politesse |
| *mal* | La légèreté, l’occasion |
| *doch* | L’insistance amicale |

*Komm doch mal her!* · *Machen Sie bitte die Tür zu!*

> Sans ces petits mots, un impératif allemand paraît **sec** — parfois hostile. Les ajouter n’est pas un ornement : c’est ce qui rend l’ordre acceptable.

## La place du verbe
Le verbe **ouvre** la phrase, en première position — et le préverbe séparable part **à la fin** : *Steh bitte auf!*, *Ruf mich an!*

## Commander sans impératif
| Moyen | Exemple | Registre |
| L’infinitif seul | *Nicht rauchen!* | Panneaux, consignes |
| Le futur | *Du wirst jetzt lernen!* | Menaçant |
| La question au subjonctif II | *Könnten Sie mir helfen?* | Très poli |`,
          },
          questions: [
            ['Quelle est la forme d’impératif de « kommen » pour « du » ?', ['Komm!', 'Kommst!', 'Komme du!', 'Kommen!'], 0, 'Radical sans terminaison et sans pronom.'],
            ['Comment dit-on « Donne ! » (du) ?', ['Gib!', 'Geb!', 'Gebe!', 'Gibst!'], 0, 'L’alternance *e → i* se maintient à l’impératif.'],
            ['« Fahre! » garde-t-il l’inflexion de « du fährst » ?', ['Non, on dit Fahr!', 'Oui, on dit Fähr!', 'Oui, on dit Fährst!', 'Les deux sont possibles'], 0, 'L’alternance *a → ä* disparaît à l’impératif.'],
            ['À la forme de politesse, le pronom « Sie » se maintient.', ['Vrai', 'Faux'], 0, '*Kommen Sie!*, *Setzen Sie sich!* — contrairement aux formes du *du* et du *ihr*.'],
            ['Quelle est la forme d’impératif de « sein » pour « ihr » ?', ['Seid ruhig!', 'Sei ruhig!', 'Seien ruhig!', 'Seid Sie ruhig!'], 0, '*Sei* (du), *Seid* (ihr), *Seien Sie* (politesse).'],
            ['À quoi servent « doch » et « mal » dans un impératif ?', ['À adoucir l’ordre', 'À le renforcer', 'À le nier', 'À marquer le passé'], 0, 'Sans eux, un impératif allemand paraît très sec.'],
            ['Où part le préverbe séparable à l’impératif ?', ['À la fin de la phrase', 'Devant le verbe', 'Il reste soudé', 'Après le sujet'], 0, '*Ruf mich an!*, *Steh bitte auf!*'],
            ['« Nicht rauchen! » est un impératif conjugué.', ['Vrai', 'Faux'], 1, 'C’est un infinitif employé comme consigne, typique des panneaux.'],
          ],
        },
        {
          titre: 'Le subjonctif II présent',
          axe: 'Les temps',
          lecon: {
            titre: 'würde, hätte, wäre : l’irréel et la politesse',
            cours: `Le subjonctif II est l’équivalent du **conditionnel** français. Il sert à trois choses : l’**hypothèse**, le **souhait** et la **politesse**.

## Les deux façons de le former
| Forme | Quand l’employer | Exemple |
| **würde** + infinitif | Par **défaut**, pour la plupart des verbes | *Ich würde gern nach Berlin fahren* |
| La forme **simple** | Pour une petite liste de verbes très fréquents | *Ich hätte gern einen Kaffee* |

## Les formes simples à connaître
| Verbe | Subjonctif II | Verbe | Subjonctif II |
| *sein* | *wäre* | *können* | *könnte* |
| *haben* | *hätte* | *müssen* | *müsste* |
| *werden* | *würde* | *dürfen* | *dürfte* |
| *wissen* | *wüsste* | *mögen* | *möchte* |
| | | *sollen* | *sollte* |

Elles se forment sur le **prétérit**, avec **inflexion** et un *-e* : *war → wäre*, *hatte → hätte*, *konnte → könnte*.

## Les trois emplois
| Emploi | Structure | Exemple |
| L’**irréel** | *wenn* + subj. II, puis *würde* | *Wenn ich Zeit hätte, würde ich kommen* |
| La **politesse** | Forme simple de préférence | *Könnten Sie mir helfen?* · *Ich möchte bitte zahlen* |
| Le **souhait**, le conseil | *wenn nur…* · *solltest* | *Wenn er nur hier wäre!* · *Du solltest mehr schlafen* |

> *Wenn* peut **disparaître** — et le verbe prend alors la **première** place : *Hätte ich Zeit, würde ich kommen*. C’est une tournure élégante, très valorisée à l’écrit.

## La politesse, l’emploi le plus quotidien
Un présent à la place ferait brusque : *Ich will einen Kaffee* sonne comme un ordre, *Ich hätte gern einen Kaffee* comme une demande.

## als ob
Après *als ob* — « comme si » — le subjonctif II est de **règle** : *Er tut so, als ob er alles wüsste.*

## Et le subjonctif I ?
Il sert au **discours indirect de la presse** : *Er sagte, er sei krank*. On le rencontre à la **lecture** bien plus qu’on ne l’écrit soi-même — le reconnaître suffit.`,
          },
          questions: [
            ['Quelle est la construction usuelle du subjonctif II ?', ['würde + infinitif', 'werden + participe II', 'hätte + infinitif', 'sein + zu + infinitif'], 0, '*Ich würde gern nach Berlin fahren.*'],
            ['Quelle est la forme de subjonctif II de « sein » ?', ['wäre', 'wurde', 'sei', 'war'], 0, 'Formée sur le prétérit *war*, avec inflexion et *-e*.'],
            ['Comment traduire « je voudrais un café » ?', ['Ich hätte gern einen Kaffee', 'Ich habe gern einen Kaffee', 'Ich würde einen Kaffee', 'Ich will einen Kaffee'], 0, '*hätte gern* est la formule de politesse standard.'],
            ['Dans « Wenn ich Zeit hätte, würde ich kommen », combien de verbes sont au subjonctif II ?', ['Deux', 'Un seul', 'Aucun', 'Trois'], 0, 'La subordonnée et la principale le portent toutes les deux.'],
            ['« Wenn » peut être omis, le verbe prenant alors la première place.', ['Vrai', 'Faux'], 0, '*Hätte ich Zeit, würde ich kommen.*'],
            ['Quelle est la forme de subjonctif II de « können » ?', ['könnte', 'konnte', 'kann', 'könne'], 0, '*Könnten Sie mir helfen?* — sans inflexion, c’est le prétérit *konnte*.'],
            ['Après « als ob », quel mode emploie-t-on ?', ['Le subjonctif II', 'L’indicatif présent', 'L’impératif', 'Le futur'], 0, '*Er tut so, als ob er alles wüsste.*'],
            ['« Du solltest mehr schlafen » exprime…', ['Un conseil', 'Une obligation stricte', 'une interdiction', 'Un fait passé'], 0, 'Le subjonctif II de *sollen* adoucit la consigne en conseil.'],
          ],
        },
      ],
    },
  ],
}
