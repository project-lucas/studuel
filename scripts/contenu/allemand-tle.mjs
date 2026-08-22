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
            cours: `En français, la virgule marque souvent une pause de la voix. En allemand, elle marque une **frontière grammaticale** : elle sépare des propositions, et sa présence ou son absence est une règle, pas un choix de style.

## La virgule devant la subordonnée
Toute subordonnée est séparée de la principale par une virgule, sans exception : *Ich weiß**,** dass er kommt.* / *Er bleibt zu Hause**,** weil er krank ist.* / *Das Buch**,** das ich lese**,** ist spannend.* Quand la subordonnée est enchâssée, elle est encadrée de DEUX virgules.

## Pas de virgule devant und ni oder
Dans une énumération ou entre deux propositions coordonnées par *und* / *oder*, la virgule est en principe absente : *Ich lese, ich schreibe **und** ich lerne.* Devant *aber*, *sondern* et *denn*, en revanche, elle est obligatoire.

## Le groupe infinitif
La virgule est obligatoire devant les groupes introduits par **um… zu**, **ohne… zu**, **(an)statt… zu** : *Ich lerne Deutsch**,** um in Berlin zu studieren.* Devant un simple *zu* + infinitif, elle est facultative.

## Les guillemets
L'allemand ouvre en bas et ferme en haut : **„…“** — *Er sagt: „Ich komme morgen.“* Noter aussi les **deux-points** avant le discours direct, là où le français emploie souvent une virgule.

## La majuscule
Tous les **noms communs** prennent la majuscule, où qu'ils soient dans la phrase : *das Haus*, *die Freiheit*, *beim Essen*. Un adjectif ou un infinitif substantivé la prend aussi : *das Wichtigste*, *das Lesen*.

> Le *Sie* de politesse et ses formes (*Ihnen*, *Ihr*) gardent la majuscule ; le *sie* qui signifie « elle » ou « ils » ne la prend pas. C'est parfois la seule chose qui les distingue à l'écrit.

## Le ß
*ß* s'écrit après voyelle longue ou diphtongue (*Straße*, *heißen*), *ss* après voyelle brève (*Fluss*, *dass*). En Suisse, *ß* n'existe pas et s'écrit toujours *ss*.`,
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
            cours: `L'ordre des mots allemand n'est pas libre : il est commandé par la place du verbe conjugué, qui sert de pivot à toute la phrase.

## La règle V2
Dans une déclarative, le verbe conjugué occupe **toujours la deuxième place** — non pas le deuxième mot, mais le deuxième **groupe**. *Ich fahre morgen nach Berlin.* / *Morgen fahre ich nach Berlin.* / *Nach Berlin fahre ich morgen.*

## L'inversion
Dès qu'autre chose que le sujet ouvre la phrase, le sujet passe **derrière le verbe** : *Heute **geht er** ins Kino.* Écrire *Heute er geht…* est la faute la plus repérable d'une copie.

## La parenthèse verbale (Satzklammer)
Quand le verbe est en deux morceaux, le second ferme la phrase, à la toute fin :
- auxiliaire + participe : *Ich **habe** gestern einen Film **gesehen**.*
- modal + infinitif : *Ich **muss** heute Abend **arbeiten**.*
- verbe à préverbe séparable : *Ich **stehe** um sieben Uhr **auf**.*

Tout ce qui compte est enfermé entre les deux : c'est cette parenthèse qui oblige à écouter une phrase allemande jusqu'au bout.

## L'ordre des compléments : TeKaMoLo
Entre les deux morceaux du verbe, les compléments se rangent dans cet ordre : **Te**mporel → **Ka**usal → **Mo**dal → **Lo**cal. *Ich fahre morgen (Te) wegen der Arbeit (Ka) mit dem Zug (Mo) nach München (Lo).*

## Datif avant accusatif — sauf pronom
*Ich gebe **dem Kind** (datif) **das Buch** (accusatif).* Mais si l'accusatif est un pronom, il passe devant : *Ich gebe **es** dem Kind.*

> Le pronom aime le début de phrase : les pronoms compléments remontent juste après le verbe conjugué.`,
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
            cours: `Trois façons de poser une question, et trois places différentes pour le verbe.

## La question fermée
Le verbe conjugué passe en **première position**, devant le sujet : *Kommst du morgen?* / *Hast du das Buch gelesen?* La réponse est *ja*, *nein* — ou *doch*.

## La question ouverte
Elle s'ouvre par un mot en **w-**, et le verbe reste en deuxième position : *Wann kommst du?*
- **wer** (qui), qui se décline : *wen* (accusatif), *wem* (datif), *wessen* (génitif)
- **was** (quoi), **warum / wieso / weshalb** (pourquoi), **wie** (comment)
- **wo** (où, sans mouvement), **wohin** (où, avec mouvement), **woher** (d'où)
- **welcher / welche / welches** (lequel), **was für ein** (quelle sorte de)

## Doch, la réponse qui contredit
Face à une question **négative**, *ja* est impossible : on emploie **doch**. — *Du kommst nicht mit?* — *Doch!* (« si ! »). Le français a la même finesse, l'anglais non.

## La question indirecte
Elle devient une **subordonnée** : le verbe conjugué part **à la fin**, et le point d'interrogation disparaît à l'intérieur.
- avec mot interrogatif : *Ich weiß nicht, **wann** er **kommt**.*
- sans mot interrogatif : on emploie **ob** (« si ») — *Ich frage mich, **ob** er **kommt**.*

> Ne jamais traduire ce *si*-là par *wenn* : *wenn* introduit une condition ou un moment, *ob* une alternative.

## wo + préposition
Pour interroger sur une chose (jamais sur une personne), l'allemand soude *wo(r)-* et la préposition : *Worauf wartest du?* (sur quoi attends-tu ?), *Womit schreibst du?*, *Woran denkst du?* Pour une personne, on garde la préposition : *Auf wen wartest du?*`,
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
            cours: `Deux questions à se poser : **quel mot de négation**, et **à quelle place**. Les deux comptent autant l'une que l'autre.

## kein nie un nom
On emploie **kein** devant un nom précédé de *ein* ou sans article du tout : *Ich habe **ein** Auto* → *Ich habe **kein** Auto.* / *Ich trinke Kaffee* → *Ich trinke **keinen** Kaffee.* *kein* se décline exactement comme *ein*, et possède en plus un pluriel : *keine Freunde*.

## nicht pour tout le reste
Dès que le nom est précédé d'un **article défini**, d'un **possessif** ou d'un **démonstratif**, c'est *nicht* : *Ich kenne **den** Mann **nicht**.* / *Das ist **nicht** mein Buch.* On nie aussi avec *nicht* un verbe, un adjectif, un adverbe ou une phrase entière.

## La place de nicht
- pour nier TOUTE la phrase, *nicht* va **le plus à droite possible**, mais devant le second morceau du verbe : *Ich habe ihn gestern **nicht** gesehen.*
- il passe **devant** l'élément qu'il nie s'il ne nie qu'un mot : *Ich fahre **nicht** morgen, sondern heute.*
- il reste **devant** l'attribut, le complément de lieu directionnel et le préverbe : *Das Buch ist **nicht** interessant.* / *Ich gehe **nicht** ins Kino.*
- il se place **après** le complément d'objet défini et les compléments de temps : *Ich lese das Buch **nicht**.*

## Les autres mots négatifs
*nichts* (rien), *niemand* (personne), *nie / niemals* (jamais), *nirgends* (nulle part), *noch nicht* (pas encore), *nicht mehr* (ne… plus), *weder… noch* (ni… ni).

> Deux négations ne s'additionnent PAS en allemand : contrairement à l'espagnol, une seule suffit — *Ich sehe nichts*, jamais *ich sehe nicht nichts*.

## sondern après une négation
Pour rectifier, l'allemand emploie **sondern** et non *aber* : *Er ist **nicht** Deutscher, **sondern** Österreicher.* *aber* oppose sans rectifier : *Er ist nicht reich, **aber** glücklich.*`,
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
            cours: `Une subordonnée allemande se reconnaît à deux signes : une conjonction en tête, et le **verbe conjugué à la toute fin**.

## Les conjonctions de subordination
- **dass** (que), **ob** (si, alternative)
- **weil / da** (parce que, puisque), **damit** (pour que)
- **wenn** (si, quand — répétable), **als** (quand, une fois dans le passé)
- **obwohl** (bien que), **während** (pendant que, alors que)
- **bevor** (avant que), **nachdem** (après que), **seitdem** (depuis que), **bis** (jusqu'à ce que)
- **falls** (au cas où), **sodass** (si bien que)

## Le verbe à la fin
*Ich bleibe zu Hause, **weil** ich krank **bin**.* Quand le verbe est en deux morceaux, c'est le **conjugué** qui ferme la phrase, après le participe ou l'infinitif : *…, weil ich gearbeitet **habe**.* / *…, weil ich arbeiten **muss**.*

## La subordonnée en tête
Placée devant, la subordonnée occupe **la première position** de la phrase entière : le verbe de la principale suit immédiatement, et le sujet passe derrière. *Weil ich krank bin, **bleibe ich** zu Hause.* Deux verbes se retrouvent alors côte à côte, séparés par la virgule : c'est correct, et c'est même le signe que la construction est juste.

## weil ou denn
Les deux traduisent « parce que », mais **denn** est une conjonction de **coordination** : il ne change rien à l'ordre des mots. *Ich bleibe zu Hause, **denn** ich **bin** krank.* / *…, **weil** ich krank **bin**.*

## wenn ou als
**als** pour un fait unique au passé (*Als ich zehn war…*), **wenn** pour le présent, le futur, ou une répétition au passé (*Immer wenn ich ihn sah…*).

> Piège classique : *wann* ne s'emploie QUE dans une question, directe ou indirecte. « Quand j'étais petit » ne se dit jamais *wann ich klein war*.`,
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
            cours: `La relative complète un nom. Le pronom relatif allemand ressemble à l'article défini — et se décline comme lui, à trois formes près.

## La règle en une phrase
Le pronom relatif prend le **genre et le nombre de l'antécédent**, mais le **cas de sa fonction dans la relative**. C'est tout le raisonnement, et il se fait dans cet ordre.

- *Der Mann, **der** dort steht* (masculin, sujet → nominatif)
- *Der Mann, **den** ich sehe* (masculin, COD → accusatif)
- *Der Mann, **dem** ich helfe* (masculin, COI → datif, car *helfen* régit le datif)

## Les formes
- nominatif : *der, die, das* — pluriel *die*
- accusatif : *den, die, das* — pluriel *die*
- datif : *dem, der, dem* — pluriel **denen**
- génitif : **dessen, deren, dessen** — pluriel **deren**

Trois formes seulement diffèrent de l'article défini : *dessen*, *deren*, *denen*. Tout le reste, on le connaît déjà.

## Le verbe à la fin
La relative est une subordonnée : virgules obligatoires, verbe conjugué **en fin de proposition**. *Das Buch, das ich gestern gekauft **habe**, ist teuer.*

## La préposition ne se déplace pas
Elle reste **devant** le pronom relatif, et c'est elle qui commande le cas : *Der Freund, **mit dem** ich fahre* / *Die Stadt, **in der** ich wohne.*

## Le génitif
*dessen* et *deren* remplacent un possessif : *Der Mann, **dessen** Auto kaputt ist* (l'homme dont la voiture est en panne). Le nom qui suit n'a **pas d'article**.

## was, et non das
Après *alles, nichts, etwas, viel, wenig*, après un superlatif neutre et après une phrase entière, le relatif est **was** : *Alles, **was** du sagst, ist richtig.* / *Er kam zu spät, **was** mich geärgert hat.*`,
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
            cours: `Le passif allemand se construit avec **werden**, jamais avec *sein* — c'est la première chose à retenir, parce que le français dit « être construit » et pousse à la faute.

## Le passif d'action
**werden** conjugué + **participe II** rejeté à la fin.
- présent : *Das Haus **wird** gebaut.* (la maison est en train d'être construite)
- prétérit : *Das Haus **wurde** gebaut.*
- parfait : *Das Haus **ist** gebaut **worden**.*
- futur : *Das Haus **wird** gebaut **werden**.*

## worden, pas geworden
Au parfait du passif, le participe de *werden* perd son *ge-* : c'est **worden**. *Geworden* est réservé au verbe *werden* employé seul, au sens de « devenir » : *Er ist Arzt geworden.*

## Le passif d'état
**sein** + participe II décrit un **résultat**, pas une action : *Das Haus **ist** gebaut* (la maison est construite, elle est là). Confondre les deux, c'est confondre le film et la photo.

## L'agent : von ou durch
- **von** + datif pour une personne ou une force agissante : *Das Buch wurde **von** Goethe geschrieben.*
- **durch** + accusatif pour un moyen, un intermédiaire : *Die Stadt wurde **durch** ein Erdbeben zerstört.*

## Le passif impersonnel
L'allemand sait mettre au passif un verbe sans COD : *Hier **wird** getanzt* (« ici, on danse »). Le *es* de tête disparaît dès qu'un autre élément ouvre la phrase.

## Avec un modal
Le modal se conjugue, et le passif passe à l'infinitif : *Die Arbeit **muss** heute gemacht **werden**.*

> Le tour le plus fréquent à l'oral n'est pas le passif mais **man** : *Man baut ein Haus.* Savoir passer de l'un à l'autre est un réflexe payant au bac.`,
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
            cours: `Le groupe infinitif allemand ferme la phrase, et son *zu* obéit à des règles simples mais sans exception.

## La place de zu
*zu* se place **juste devant l'infinitif**, en fin de groupe : *Ich versuche, pünktlich **zu sein**.* Avec un verbe à préverbe séparable, *zu* s'**intercale** entre le préverbe et le radical, en un seul mot : *ein**zu**kaufen*, *auf**zu**stehen*, *an**zu**rufen*.

## Les verbes qui appellent zu
*versuchen, beginnen, vergessen, hoffen, versprechen, vorhaben, Lust haben, Zeit haben, es ist wichtig / schwer / möglich*… *Es ist wichtig, Deutsch **zu** lernen.*

## Les verbes qui refusent zu
- les six **modaux** : *Ich kann schwimmen.*
- **sehen, hören, lassen** : *Ich höre ihn kommen.* / *Ich lasse mir die Haare schneiden.*
- les verbes de mouvement **gehen, fahren, kommen** : *Ich gehe schwimmen.*
- **bleiben, werden, helfen** (souvent sans *zu*)

## um… zu : le but
*Ich lerne Deutsch, **um** in Berlin **zu** studieren.* La virgule est obligatoire. Le sujet des deux propositions doit être **le même** ; sinon, on passe à **damit** : *Ich erkläre es, **damit** du es verstehst.*

## ohne… zu et (an)statt… zu
*Er ging weg, **ohne** etwas **zu** sagen.* (sans rien dire) / *Er spielt, **statt** **zu** arbeiten.* (au lieu de travailler)

## sein / haben + zu
Deux tours brefs, très fréquents à l'écrit :
- *Die Arbeit **ist** heute **zu** machen.* = elle doit / peut être faite (valeur passive)
- *Ich **habe** viel **zu** tun.* = j'ai beaucoup à faire (valeur active)

> Un groupe infinitif n'a jamais de sujet propre : c'est ce qui le distingue d'une subordonnée en *dass*.`,
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
            cours: `Le déterminant allemand porte à lui seul trois informations : le genre, le nombre et le cas. C'est lui qui fait la grammaire de la phrase, bien plus que la terminaison du nom.

## Trois genres, et aucun hasard à espérer
**der** (masculin), **die** (féminin), **das** (neutre). Le genre allemand ne recoupe pas le français : *die Sonne* (le soleil) est féminin, *der Mond* (la lune) masculin, *das Mädchen* (la jeune fille) neutre parce que tous les diminutifs en *-chen* et *-lein* le sont. On apprend donc chaque nom **avec son article**.

## Quelques repères de genre
- masculins : jours, mois, saisons, points cardinaux, la plupart des noms en *-er*, *-ling*, *-ismus*
- féminins : noms en *-ung*, *-heit*, *-keit*, *-schaft*, *-ion*, *-ei*, *-ie*
- neutres : noms en *-chen*, *-lein*, *-um*, *-ment*, et tout infinitif substantivé (*das Essen*)

## Le pluriel
Au pluriel, l'article défini est **die** pour les trois genres : *die Männer*, *die Frauen*, *die Kinder*. C'est la seule simplification que l'allemand accorde.

## L'article indéfini
**ein** (masculin et neutre), **eine** (féminin). Il n'a **pas de pluriel** : *Ich sehe Kinder* (je vois des enfants). Sa négation, *kein*, en a un : *keine Kinder*.

## Le sujet est au nominatif
Le sujet d'une phrase est toujours au **nominatif** : c'est la forme donnée par le dictionnaire — *der, die, das* / *ein, eine, ein*. *Der Hund schläft.* / *Ein Kind spielt.*

> Attention à *das* : il est à la fois article neutre (*das Buch*) et démonstratif invariable (*Das ist mein Buch* = ça, c'est mon livre). Dans ce second emploi, il ne s'accorde à rien.

## L'absence d'article
Contrairement au français, l'allemand se passe d'article devant les noms de métier après *sein* et *werden* (*Er ist Lehrer*), devant les noms de matière (*Ich trinke Wasser*) et devant la plupart des noms de pays (*Ich fahre nach Deutschland*).`,
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
            cours: `Tout le système allemand tient dans un tableau de quatre cas — et dans le fait que presque tous les déterminants se déclinent de la même façon.

## À quoi sert chaque cas
- **nominatif** : le sujet, et l'attribut après *sein*, *werden*, *bleiben*
- **accusatif** : le complément d'objet direct, et certaines prépositions
- **datif** : le complément d'objet second, et beaucoup de prépositions
- **génitif** : le complément du nom (la possession)

## L'article défini
- masculin : *der* → *den* → *dem* → *des*
- féminin : *die* → *die* → *der* → *der*
- neutre : *das* → *das* → *dem* → *des*
- pluriel : *die* → *die* → **den** → *der*

## L'article indéfini et les possessifs
*ein* → *einen* → *einem* → *eines* (masculin) ; *eine* → *eine* → *einer* → *einer* (féminin) ; *ein* → *ein* → *einem* → *eines* (neutre). **Se déclinent exactement pareil** : *kein* et tous les possessifs (*mein, dein, sein, ihr, unser, euer, Ihr*), qui eux ont un pluriel : *meine* → *meine* → *meinen* → *meiner*.

## Les déterminants en der-
*dieser* (ce), *jeder* (chaque, sans pluriel), *welcher* (quel), *mancher*, *solcher*, *aller* prennent les **terminaisons de l'article défini** : *diesen Mann*, *jedem Kind*, *welche Frau*.

## Les deux marques à ne pas oublier
- **datif pluriel** : l'article devient *den* ET le nom prend un **-n** : *mit den Kinder**n***, *aus den Länder**n***.
- **génitif masculin et neutre** : le nom prend **-(e)s** : *das Auto des Vater**s***, *das Ende des Jahr**es***.

> Le raccourci qui fait gagner du temps : le masculin est le seul genre à changer entre nominatif et accusatif. Si un exercice paraît difficile, c'est presque toujours d'un masculin qu'il s'agit.`,
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
            cours: `Un pronom personnel remplace un groupe nominal : il en garde le genre et prend le cas de sa nouvelle fonction.

## Les trois séries
- nominatif : *ich, du, er, sie, es, wir, ihr, sie / Sie*
- accusatif : *mich, dich, **ihn**, sie, es, uns, euch, sie / Sie*
- datif : *mir, dir, **ihm**, **ihr**, ihm, uns, euch, **ihnen** / Ihnen*

## Le genre grammatical commande
Un objet masculin se reprend par *er*, un objet féminin par *sie*, même s'il s'agit d'une chose : *Der Tisch? **Er** ist alt.* / *Die Lampe? **Sie** ist neu.* Traduire mécaniquement par *es* est une faute que les correcteurs repèrent immédiatement.

## L'ordre des pronoms
Deux pronoms compléments se rangent **accusatif avant datif** : *Ich gebe **es dir**.* C'est l'inverse de l'ordre des groupes nominaux (*Ich gebe **dem Kind das Buch***). Règle unique qui couvre les deux : **le pronom passe devant, et l'accusatif pronom passe devant tout**.

## Leur place dans la phrase
Les pronoms compléments remontent **juste après le verbe conjugué** — et, en cas d'inversion, ils peuvent même précéder le sujet nominal : *Gestern hat **mich** mein Vater angerufen.*

## Le Sie de politesse
*Sie* s'écrit toujours avec une **majuscule**, au singulier comme au pluriel, ainsi que ses formes *Ihnen* et *Ihr*. La conjugaison est celle de la 3e personne du pluriel : *Können **Sie** mir helfen?*

## es, le pronom à tout faire
Sujet apparent (*Es regnet*, *Es gibt…*), reprise d'une proposition entière (*Ich weiß **es***), ou simple ouverture de phrase (*Es kommen viele Leute*) — dans ce dernier cas, il disparaît dès qu'un autre élément prend la première place.

> *man* n'est pas un pronom personnel mais un pronom indéfini : il se conjugue à la 3e personne du singulier et se décline *einen* (accusatif), *einem* (datif).`,
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
            cours: `Montrer, désigner, insister : l'allemand a trois façons de le faire, de la plus neutre à la plus orale.

## dieser, diese, dieses
Le démonstratif de base. Il se décline **comme l'article défini** : *dieser Mann, diesen Mann, diesem Mann, dieses Mannes*. Employé seul, il reprend un élément déjà nommé : *Ich nehme **dieses** hier.*

## jener, et son quasi-abandon
*jener* (celui-là, plus éloigné) appartient à la langue écrite et soutenue. À l'oral, on préfère opposer *dieser… der da* ou employer *der eine… der andere*.

## der, die, das démonstratifs
C'est la forme la plus courante à l'oral : le même mot que l'article, mais **accentué** et souvent en tête de phrase. — *Kennst du Peter?* — ***Den** kenne ich gut!* Sa déclinaison est celle de l'article défini, à deux exceptions près : **datif pluriel *denen*** et **génitif *dessen / deren***.

## dessen et deren
Ils remplacent un possessif pour éviter une ambiguïté : *Ich traf Paul und **dessen** Bruder* (le frère de Paul, et non le mien). C'est un usage soigné, très apprécié à l'écrit.

## derselbe, der gleiche
- **derselbe** : le même, identique — *Wir wohnen in **demselben** Haus.* Les deux morceaux se déclinent : *der-* comme l'article, *-selbe* comme un adjectif faible.
- **der gleiche** : le même, semblable — *Sie hat **das gleiche** Kleid* (un modèle identique, pas le vêtement lui-même).

## das invariable
*das* peut désigner une situation entière, sans accord : *Das ist mein Bruder.* / ***Das** sind meine Eltern.* Le verbe s'accorde alors avec ce qui suit, jamais avec *das*.

> Ne pas confondre *das* (article ou démonstratif) et *dass* (conjonction « que »). Le test : si l'on peut remplacer par *dieses*, c'est *das* avec un seul s.`,
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
            cours: `Le pluriel allemand ne s'obtient pas en ajoutant un *-s* : il y a **cinq schémas**, et le bon s'apprend avec le mot, comme le genre.

## 1. Le pluriel en -e
Le plus fréquent chez les masculins, souvent avec **inflexion** (Umlaut) : *der Tag → die Tage*, *der Sohn → die S**ö**hne*, *die Stadt → die St**ä**dte*.

## 2. Le pluriel en -er
Réservé à des masculins et surtout à des neutres, **toujours** avec inflexion quand la voyelle le permet : *das Kind → die Kinder*, *das Buch → die B**ü**cher*, *der Mann → die M**ä**nner*.

## 3. Le pluriel en -(e)n
Celui de la quasi-totalité des **féminins** : *die Frau → die Frauen*, *die Blume → die Blumen*, *die Zeitung → die Zeitungen*. Jamais d'inflexion dans ce groupe. Les noms en *-in* doublent le n : *die Lehrerin → die Lehrerinnen*.

## 4. Le pluriel sans terminaison
Les masculins et neutres en *-er*, *-el*, *-en* ne changent pas, ou prennent seulement l'inflexion : *der Lehrer → die Lehrer*, *der Vater → die V**ä**ter*, *das Mädchen → die Mädchen*.

## 5. Le pluriel en -s
Les mots empruntés et les abréviations : *das Auto → die Autos*, *das Hotel → die Hotels*, *der Park → die Parks*.

## Le datif pluriel
Quel que soit le schéma, au datif pluriel le nom prend un **-n** s'il n'en a pas déjà un : *mit den Kinder**n***, *aus den Städte**n*** — sauf les pluriels en *-s* (*mit den Autos*).

> Bonne nouvelle : l'article est *die* au nominatif et à l'accusatif pluriel pour les trois genres. Le genre ne compte plus au pluriel.

## Les noms qui n'ont qu'un nombre
*die Leute* (les gens) n'existe qu'au pluriel ; *die Polizei*, *das Obst*, *die Milch* qu'au singulier. *Eine Brille* est un singulier là où le français dit « des lunettes ».`,
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
            cours: `C'est la règle la plus reposante de la grammaire allemande : l'adjectif **attribut** ne se décline **jamais**.

## La règle
Après **sein** (être), **werden** (devenir) et **bleiben** (rester), l'adjectif reste à sa forme nue, quel que soit le genre et le nombre du sujet :
- *Der Mann ist **alt**.*
- *Die Frau ist **alt**.*
- *Das Kind ist **alt**.*
- *Die Kinder sind **alt**.*

Aucun *-e*, aucun *-er*, rien. Le français, qui accorde (« vieille », « vieux »), pousse à la faute.

## La différence avec l'épithète
Dès que l'adjectif se place **devant un nom**, il se décline : *ein **alter** Mann*, *die **alte** Frau*, *das **alte** Kind*. Attribut = après le verbe, invariable ; épithète = devant le nom, déclinée. Savoir dire lequel des deux on a sous les yeux, c'est déjà la moitié du travail.

## L'adverbe aussi est invariable
L'allemand n'a pas de terminaison d'adverbe (comme le français *-ment*) : le même mot sert d'adjectif et d'adverbe. *Er singt **schön*** (il chante bien) / *Das Lied ist **schön*** (la chanson est belle).

## Le comparatif attribut
Il se termine en *-er* — mais c'est la marque du comparatif, pas un accord : *Der Zug ist **schneller** als das Auto.* Idem au superlatif : *Der Zug ist **am schnellsten**.*

## Quelques verbes qui appellent un attribut
*sein, werden, bleiben, scheinen* (paraître), *finden* (trouver, avec un COD) : *Ich finde das Buch **interessant**.*

> Piège : *ein Mann ist alt* mais *ein alter Mann ist gekommen*. Le même adjectif, deux traitements — tout dépend de sa place.`,
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
            cours: `Devant un nom, l'adjectif se décline. La terminaison qu'il prend dépend d'une seule question : **le déterminant porte-t-il déjà la marque du cas ?**

## Le principe
La marque du cas doit apparaître **une fois** dans le groupe nominal. Si le déterminant la porte, l'adjectif se contente d'une terminaison faible ; s'il n'y a pas de déterminant, l'adjectif prend la marque à sa place.

## La déclinaison faible
Après *der, die, das, dieser, jeder, welcher, alle*… L'adjectif ne prend que **-e** ou **-en** :
- *der **alte** Mann*, *die **alte** Frau*, *das **alte** Haus* (nominatif)
- *den **alten** Mann*, *dem **alten** Mann*, *die **alten** Männer*

Retenir : **-e** aux trois nominatifs singuliers et à l'accusatif féminin et neutre, **-en** partout ailleurs.

## La déclinaison mixte
Après *ein, kein* et les possessifs. Ces déterminants ont trois « trous » — masculin nominatif, neutre nominatif et accusatif — où ils ne marquent pas le cas : l'adjectif le fait à leur place.
- *ein **alter** Mann* (le *-er* que *ein* ne porte pas)
- *ein **altes** Haus*
- *eine **alte** Frau*, *einen **alten** Mann*, *meinem **alten** Freund*

## La déclinaison forte
Sans déterminant du tout (souvent au pluriel, avec les noms de matière, après un nombre) : l'adjectif prend les terminaisons de **l'article défini**.
- *kalt**er** Kaffee*, *frisch**e** Milch*, *gut**es** Brot*
- *mit gut**en** Freunden*, *deutsch**er** Wein*

## Les irréguliers utiles
*hoch* perd son *c* devant une terminaison : *ein **hoher** Berg*. *teuer* et *dunkel* perdent leur *e* : *ein **teures** Auto*, *ein **dunkles** Zimmer*.

> La méthode qui marche en devoir : repérer d'abord le cas et le genre du groupe, puis regarder le déterminant. S'il marque déjà le cas → *-e* ou *-en*. S'il ne le marque pas ou n'existe pas → l'adjectif prend la marque.

## Les adjectifs invariables
Ceux qui se terminent par *-a* et les adjectifs de couleur empruntés : *ein **rosa** Kleid*, *eine **lila** Bluse*, *ein **prima** Ergebnis*.`,
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
            cours: `Le possessif allemand pose une difficulté que le français ne prépare pas : il regarde **deux choses à la fois**, le possesseur et l'objet possédé.

## La liste
*mein* (mon), *dein* (ton), **sein** (son, à lui), **ihr** (son, à elle), *unser* (notre), *euer* (votre), *ihr* (leur), *Ihr* (votre de politesse, avec majuscule).

## La règle des deux regards
- Le **radical** dépend du **possesseur** : *sein* si c'est un homme (ou un nom masculin ou neutre), *ihr* si c'est une femme (ou un nom féminin, ou un pluriel).
- La **terminaison** dépend de l'**objet possédé** : genre, nombre et cas.

*Peter und **seine** Schwester* (la sœur DE LUI : radical *sein-*, terminaison féminine) / *Anna und **ihr** Bruder* (le frère D'ELLE : radical *ihr-*, terminaison masculine).

## La déclinaison
Exactement celle de *ein* / *kein*, avec en plus un pluriel : *mein, meinen, meinem, meines* — *meine, meine, meiner, meiner* (féminin) — *meine, meine, meinen, meiner* (pluriel).

## euer perd son e
Devant une terminaison, *euer* devient *eur-* : *eu**re** Mutter*, *eu**ren** Vater*. *unser*, lui, garde le sien : *unsere Mutter*.

## Le possessif employé seul
*Wessen Buch ist das?* — *Das ist **meins**.* Employé sans nom, le possessif prend les terminaisons de l'article défini : *meiner, meine, mein(e)s*.

## Ce que l'allemand ne dit pas avec un possessif
Avec les parties du corps et les vêtements, l'allemand emploie souvent l'article + un datif : *Ich wasche **mir die** Hände* (je me lave les mains), *Er zieht **sich den** Mantel an*.

> À l'écrit, *Ihr* avec majuscule = « votre » (politesse) ; *ihr* sans majuscule = « son (à elle) » ou « leur ». La majuscule n'est pas un détail décoratif.`,
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
            cours: `Le complément du nom se dit de trois façons en allemand, et l'ordre des mots n'est pas le même dans les trois.

## Le génitif saxon avec un nom propre
Le nom du possesseur passe **devant**, suivi d'un **-s sans apostrophe** : ***Peters** Auto*, ***Annas** Buch*, ***Deutschlands** Hauptstadt*. Aucun article : *Peters Auto* et non *das Peters Auto*. Si le nom se termine déjà par un son sifflant, on met une apostrophe : *Thomas' Auto* — ou l'on tourne autrement.

## Le génitif ordinaire
Le complément passe **derrière** le nom déterminé, avec l'article au génitif :
- masculin et neutre : *des* + nom en **-(e)s** — *das Auto **des Vaters***, *das Ende **des Jahres***
- féminin et pluriel : *der*, sans marque sur le nom — *das Haus **der Frau***, *die Bücher **der Kinder***

## von + datif
La solution de l'oral, et la seule possible sans déterminant : *das Auto **von** meinem Vater*, *ein Freund **von** mir*. Correcte, mais tenue pour plus relâchée à l'écrit — au bac, le génitif ordinaire fait meilleure impression.

## La question
**Wessen?** (de qui ?) : *Wessen Buch ist das?* — *Das ist Annas Buch.*

## Les prépositions à génitif
*wegen* (à cause de), *trotz* (malgré), *während* (pendant), *statt* (au lieu de), *innerhalb / außerhalb* (à l'intérieur / à l'extérieur de) : *während **des Sommers***, *trotz **des Regens***. À l'oral, elles glissent souvent au datif — l'écrit, lui, garde le génitif.

> Le génitif recule dans l'allemand parlé, mais il reste un marqueur de niveau de langue : c'est exactement le genre de forme qu'un correcteur remarque.`,
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
            cours: `L'allemand ne connaît pas *plus… que* en deux mots : il ajoute une terminaison à l'adjectif, comme l'anglais.

## La formation
Adjectif + **-er**, quelle que soit la longueur du mot : *schnell → schnell**er***, *interessant → interessant**er***. Là où le français dirait « plus intéressant », l'allemand n'a qu'un mot.

## L'inflexion
Beaucoup d'adjectifs courts d'une syllabe prennent en plus l'**Umlaut** : *alt → **ä**lter*, *jung → j**ü**nger*, *groß → gr**ö**ßer*, *stark → st**ä**rker*, *kurz → k**ü**rzer*, *warm → w**ä**rmer*.

## als pour comparer
Le second terme de la comparaison est introduit par **als** : *Peter ist größer **als** Paul.* Employer *wie* ici est une faute, très courante mais nette.

## so… wie pour l'égalité
*Peter ist **so groß wie** Paul* (aussi grand que). Variantes : *nicht so… wie* (pas aussi), *genauso… wie* (exactement aussi), *doppelt so… wie* (deux fois plus).

## Les irréguliers à connaître par cœur
- *gut → **besser*** (bon → meilleur)
- *viel → **mehr*** (beaucoup → plus)
- *gern → **lieber*** (volontiers → plutôt)
- *hoch → **höher***, *nah → **näher***

*Ich trinke **lieber** Tee als Kaffee* : c'est ainsi qu'on dit « je préfère ».

## Le comparatif épithète se décline
Devant un nom, la marque du comparatif s'ajoute AVANT la terminaison de déclinaison : *ein **größeres** Haus*, *mein **älterer** Bruder*. Deux terminaisons l'une derrière l'autre — c'est normal.

## immer + comparatif
Pour dire « de plus en plus » : *Es wird **immer kälter**.* Et *je… desto / umso* pour « plus… plus » : *Je mehr ich lerne, **desto** besser verstehe ich.*

> Attention à *mehr* : il traduit « plus » de quantité (*mehr Zeit*), jamais « plus » du comparatif d'un adjectif. « Plus grand » ne se dit pas *mehr groß*.`,
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
            cours: `Le superlatif allemand a **deux formes**, et le choix entre les deux dépend de la place de l'adjectif.

## am + -sten : l'attribut et l'adverbe
Après *sein*, *werden*, ou pour qualifier un verbe : *Der Zug ist **am schnellsten**.* / *Er läuft **am schnellsten**.* La forme est figée, elle ne se décline pas.

## der/die/das + -ste : l'épithète
Devant un nom, avec l'article défini et une terminaison de déclinaison : *der **schnellste** Zug*, *die **schönste** Stadt*, *mit dem **besten** Freund*.

## Le -e- de liaison
Après *d, t, s, ß, z, sch*, on intercale un *e* pour pouvoir prononcer : *alt → am **ältesten***, *heiß → am **heißesten***, *kurz → am **kürzesten***.

## L'inflexion, comme au comparatif
*alt → älter → am ältesten*, *jung → jünger → am jüngsten*, *groß → größer → am größten* (sans *e* de liaison, exception).

## Les irréguliers
- *gut → besser → **am besten** / der beste*
- *viel → mehr → **am meisten***
- *gern → lieber → **am liebsten***
- *hoch → höher → **am höchsten***, *nah → näher → **am nächsten***

## Le complément du superlatif
On l'introduit par *von* + datif ou *unter* + datif : *Er ist der Größte **von** allen* / ***unter** seinen Freunden*. Pour un lieu, on emploie souvent *in* : *die größte Stadt **in** Deutschland* — ou le génitif : *Deutschlands größte Stadt*.

> Piège d'écrit : *am liebsten* n'est pas « le plus aimé » mais « ce que je préfère par-dessus tout » — *Am liebsten lese ich Krimis.* C'est une tournure de haut rendement dans une expression d'opinion.`,
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
            cours: `Cinq prépositions imposent l'accusatif, toujours, sans jamais dépendre du sens : elles s'apprennent en bloc, comme une liste.

## La liste des cinq
**durch** (à travers, par), **für** (pour), **gegen** (contre, vers — pour une heure approximative), **ohne** (sans), **um** (autour de, à — pour une heure précise). Beaucoup les retiennent dans l'ordre *durch-für-gegen-ohne-um*, qui se scande facilement.

## En emploi
- *Wir gehen **durch den** Park.* (à travers le parc)
- *Das Geschenk ist **für meinen** Bruder.*
- *Ich bin **gegen diese** Idee.* / *Er kommt **gegen acht** Uhr.* (vers huit heures)
- *Ich trinke den Kaffee **ohne** Zucker.*
- *Sie sitzen **um den** Tisch.* / *Der Zug fährt **um acht** Uhr ab.*

## Trois autres, plus rares
**bis** (jusqu'à) : *bis nächsten Montag* — souvent suivi d'une autre préposition (*bis zum Bahnhof*). **entlang** (le long de), qui se place **après** le nom : *die Straße **entlang***. **wider** (contre, littéraire).

## Les contractions
*durch das → **durchs***, *für das → **fürs***, *um das → **ums***. Elles sont normales à l'écrit courant.

## ohne se passe d'article
*ohne* est souvent suivi d'un nom **sans article** : *ohne Geld*, *ohne Auto*, *ohne Probleme*. Et l'expression *ohne mich* garde le pronom à l'accusatif.

> Erreur fréquente : traduire « pour » par *für* dans un but. « Pour apprendre » n'est pas *für lernen* mais *um zu lernen* — *für* introduit un groupe nominal, jamais un verbe.`,
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
            cours: `Sept prépositions imposent le datif dans tous leurs emplois. La suite *aus-bei-mit-nach-seit-von-zu* se retient comme une formule.

## Ce que chacune veut dire
- **aus** : hors de, en provenance de, en (matière) — *Ich komme **aus der** Schweiz*, *aus Holz*
- **bei** : chez, près de, lors de — *Ich wohne **bei meinen** Eltern*, *beim Essen*
- **mit** : avec, en (moyen de transport) — *mit dem Bus*, *mit meiner Schwester*
- **nach** : après, vers (pays et villes sans article) — *nach dem Film*, *nach Berlin*
- **seit** : depuis — *seit einem Jahr*
- **von** : de (origine, appartenance, agent du passif) — *ein Brief **von meinem** Freund*
- **zu** : chez, vers (personne ou but) — *Ich gehe **zum** Arzt*

## Trois de plus
**gegenüber** (en face de, souvent postposée), **außer** (sauf), **ab** (à partir de).

## Les contractions
*bei dem → **beim***, *von dem → **vom***, *zu dem → **zum***, *zu der → **zur***. Elles sont obligatoires dans l'usage courant : *zum Bahnhof*, *zur Schule*.

## nach, zu ou in
- **nach** + nom de pays ou de ville **sans article** : *nach Deutschland*, *nach Wien*
- **in** + accusatif si le pays a un article : *in **die** Schweiz*, *in **die** Türkei*
- **zu** + personne ou bâtiment vu comme un but : *zum Arzt*, *zur Post*

## seit et le présent
Avec *seit*, l'allemand emploie le **présent** là où le français utilise le passé composé… ou plutôt là où il dit « depuis » avec le présent : *Ich lerne **seit** drei Jahren Deutsch* (j'apprends l'allemand depuis trois ans).

> *nach Hause* (rentrer à la maison, avec mouvement) et *zu Hause* (être à la maison, sans mouvement) sont deux expressions figées : elles ne suivent pas la règle générale.`,
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
            cours: `Neuf prépositions changent de cas selon le sens de la phrase. C'est le point le plus testé de la grammaire allemande, et il tient en une question.

## Les neuf
**an** (à, contre), **auf** (sur), **hinter** (derrière), **in** (dans), **neben** (à côté de), **über** (au-dessus de), **unter** (sous), **vor** (devant), **zwischen** (entre).

## La question à se poser
- **wohin?** (vers où ?) → il y a **déplacement** → **accusatif** : *Ich gehe **in die** Schule.*
- **wo?** (où ?) → il y a **localisation** → **datif** : *Ich bin **in der** Schule.*

Ce n'est pas le verbe de mouvement qui décide, mais le changement de lieu : *Ich laufe **im** Park* (je cours à l'intérieur du parc, datif) contre *Ich laufe **in den** Park* (j'entre dans le parc en courant, accusatif).

## Les couples de verbes qui vont avec
- *stellen* (poser debout, accusatif) / *stehen* (être debout, datif)
- *legen* (coucher, poser à plat) / *liegen* (être couché)
- *setzen* (asseoir) / *sitzen* (être assis)
- *hängen* (accrocher, faible) / *hängen* (être accroché, fort)

*Ich stelle die Flasche **auf den** Tisch* → *Die Flasche steht **auf dem** Tisch.*

## Les contractions
*in das → **ins***, *in dem → **im***, *an das → **ans***, *an dem → **am***, *auf das → **aufs***, *über das → **übers***.

## Les emplois figés
Certaines expressions ne relèvent plus du lieu et se retiennent telles quelles : *an einem Montag*, *am Abend*, *im Januar*, *vor drei Jahren*, *über das Thema sprechen*, *auf Deutsch*, *sich auf etwas freuen* (accusatif).

> Le réflexe qui sauve en devoir : trouver le verbe, se demander *wo?* ou *wohin?*, et n'écrire l'article qu'ensuite.`,
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
            cours: `Les conjonctions de coordination relient deux éléments de même rang. Leur particularité : elles occupent une **position zéro** et ne comptent pas dans l'ordre des mots.

## Les cinq de base
**und** (et), **aber** (mais), **oder** (ou), **denn** (car), **sondern** (mais au contraire). Après elles, la phrase garde son ordre normal : sujet, verbe en deuxième position.

*Ich bleibe zu Hause, **denn ich bin** krank.* — le verbe *bin* reste en deuxième position, derrière le sujet.

## La comparaison qui éclaire tout
- coordination : *Ich bleibe zu Hause, **denn** ich **bin** krank.*
- subordination : *Ich bleibe zu Hause, **weil** ich krank **bin**.*

Même sens, deux syntaxes. Confondre les deux est l'erreur la plus fréquente en expression écrite.

## sondern après une négation
*sondern* ne s'emploie qu'après une négation, pour **rectifier** : *Das ist nicht mein Buch, **sondern** deins.* Sans négation devant, c'est *aber* : *Er ist arm, **aber** glücklich.*

## Les couples corrélatifs
- **entweder… oder** : ou bien… ou bien
- **weder… noch** : ni… ni (attention : la phrase est déjà négative, on n'ajoute pas *nicht*)
- **sowohl… als auch** : aussi bien… que
- **nicht nur… sondern auch** : non seulement… mais aussi
- **zwar… aber** : certes… mais

## La virgule
Obligatoire devant *aber*, *sondern* et *denn* ; absente devant *und* et *oder* quand ils relient deux éléments simples.

## Les adverbes de liaison, faux amis de la coordination
*deshalb, deswegen, trotzdem, dann, außerdem, sonst* ne sont pas des conjonctions : ils occupent **la première position** et provoquent donc l'inversion. *Es regnet, **deshalb bleibe ich** zu Hause.*

> Trois syntaxes pour un même lien logique : *weil* (verbe à la fin), *denn* (rien ne bouge), *deshalb* (inversion). Les tenir séparées, c'est gagner des points à chaque copie.`,
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
            cours: `Dire où l'on est, où l'on va, d'où l'on vient : l'allemand distingue les trois par la préposition ET par le cas.

## wo ? — la localisation
Datif avec les prépositions mixtes, ou prépositions à datif : *Ich bin **in der** Stadt*, ***bei** meinen Eltern*, ***an der** Uni*, ***auf dem** Land* (à la campagne).

## wohin ? — la destination
- **nach** + pays ou ville sans article : *nach Deutschland*, *nach Hause*
- **in** + accusatif si le nom a un article : *in **die** Stadt*, *in **die** Türkei*, *ins Kino*
- **zu** + datif pour une personne ou un but : *zum Arzt*, *zu meiner Tante*
- **an** + accusatif pour un bord : *ans Meer*, *an die Grenze*
- **auf** + accusatif pour une surface ou une institution : *auf die Post*, *aufs Land*

## woher ? — l'origine
**aus** + datif pour sortir d'un lieu ou venir d'un pays : *Ich komme **aus** Frankreich*, *aus dem Haus*. **von** + datif pour un point de départ ou une personne : *Ich komme **von** der Arbeit*, *von meiner Großmutter*.

## Les expressions figées
*nach Hause* (rentrer), *zu Hause* (être chez soi), *auf dem Land / aufs Land*, *im Ausland / ins Ausland* (à l'étranger), *in die Schule gehen* / *in der Schule sein*.

## hin et her
*hin* marque l'éloignement du locuteur, *her* le rapprochement : *Komm **her**!* (viens ici) / *Geh **hin**!* (vas-y). Ils se soudent aux prépositions pour former des préverbes : *hin**ein**gehen* (entrer, vu de l'extérieur), *her**aus**kommen* (sortir, vu de l'intérieur), et se retrouvent dans *wohin* et *woher*, où ils peuvent même se détacher : *Wo gehst du **hin**?*

> Le français dit « je vais chez le médecin » et « je suis chez le médecin » avec le même mot. L'allemand oblige à choisir : *zum Arzt* / *beim Arzt*.`,
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
            cours: `Le temps se dit de trois façons : avec une préposition, avec un accusatif nu, ou avec un adverbe. Chacune a son terrain.

## am, im, um : le trio de base
- **am** + jours et parties de la journée : *am Montag*, *am Abend*, *am Wochenende*, *am 3. Oktober*
- **im** + mois, saisons, années avec « année » : *im Januar*, *im Sommer*, *im Jahr 2026*
- **um** + heure précise : *um acht Uhr*, *um Mitternacht*

Exception à connaître : *in der Nacht* (et non *am*).

## L'accusatif sans préposition
Une durée ou une date entière se met à l'**accusatif**, sans préposition : *jeden Tag*, *jedes Jahr*, *letzte Woche*, *nächsten Monat*, *den ganzen Tag*, *diesen Sommer*.

## Les autres prépositions
- **seit** + datif : depuis (avec le présent) — *seit drei Jahren*
- **vor** + datif : il y a — *vor zwei Wochen*
- **in** + datif : dans (futur) — *in einer Stunde*
- **bis** : jusqu'à — *bis morgen*, *bis zum Abend*
- **von… bis** : de… à — *von Montag bis Freitag*
- **ab** + datif : à partir de — *ab nächster Woche*
- **während** + génitif : pendant — *während der Ferien*

## Les adverbes
*morgens, mittags, abends, nachts* (le matin, à midi, le soir, la nuit — de façon habituelle), *montags* (le lundi, tous les lundis), *heute, gestern, morgen, übermorgen, vorgestern*, *immer, oft, manchmal, selten, nie*.

> *morgen* = demain, *morgens* = le matin, *am Morgen* = ce matin-là. Un *s* fait toute la différence.

## La place dans la phrase
Le complément de temps vient **en premier** parmi les compléments (le *Te* de TeKaMoLo), ou ouvre la phrase — auquel cas le sujet passe derrière le verbe : *Nächste Woche **fahre ich** nach Wien.*`,
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
            cours: `Trois verbes portent à eux seuls toute la conjugaison allemande. Chacun mène une double vie : verbe à part entière, et auxiliaire.

## sein
Présent : *ich **bin**, du **bist**, er **ist**, wir **sind**, ihr **seid**, sie **sind***. Prétérit : *ich **war***. Participe : *gewesen*.
- verbe plein : *Ich bin müde.*
- auxiliaire du parfait des verbes de mouvement et de changement d'état : *Ich **bin** gefahren.*
- auxiliaire du passif d'état : *Das Haus **ist** gebaut.*

## haben
Présent : *ich **habe**, du **hast**, er **hat**, wir **haben**, ihr **habt**, sie **haben***. Prétérit : *ich **hatte***. Participe : *gehabt*.
- verbe plein : *Ich habe ein Auto.*
- auxiliaire du parfait de tous les autres verbes : *Ich **habe** gearbeitet.*

## werden
Présent : *ich **werde**, du **wirst**, er **wird**, wir **werden**, ihr **werdet**, sie **werden***. Prétérit : *ich **wurde***. Participe : *geworden* (verbe plein) / *worden* (passif).
- verbe plein « devenir » : *Er **wird** Arzt.*
- auxiliaire du futur : *Ich **werde** kommen.*
- auxiliaire du passif : *Das Haus **wird** gebaut.*

## haben ou sein au parfait
**sein** avec :
- les verbes de mouvement d'un point à un autre : *gehen, fahren, kommen, fliegen, laufen, reisen*
- les verbes de changement d'état : *aufstehen, einschlafen, aufwachen, sterben, wachsen*
- *sein*, *bleiben*, *werden*, *passieren*, *geschehen*

**haben** avec tous les autres, y compris les verbes de mouvement employés avec un COD : *Ich **habe** das Auto gefahren.*

> Faux ami à haute fréquence : *bekommen* signifie « recevoir », jamais « devenir ». « Je deviens » se dit *ich werde*.`,
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
            cours: `Un verbe allemand s'apprend par ses **trois temps primitifs** : infinitif, prétérit, participe II. Avec eux, toute la conjugaison se déduit.

## Les verbes faibles
Le radical ne change **jamais**. Prétérit en **-te**, participe en **ge- … -t** :
*machen → machte → gemacht* · *spielen → spielte → gespielt* · *lernen → lernte → gelernt*

Ils forment la grande majorité des verbes, et tous les verbes nouveaux (*googeln → googelte → gegoogelt*).

## Les verbes forts
La voyelle du radical **change** (c'est l'alternance vocalique, ou Ablaut). Prétérit **sans terminaison** aux 1re et 3e personnes, participe en **ge- … -en** :
*sprechen → sprach → gesprochen* · *fahren → fuhr → gefahren* · *schreiben → schrieb → geschrieben* · *nehmen → nahm → genommen* · *gehen → ging → gegangen*

## Le changement de voyelle au présent
Beaucoup de verbes forts modifient aussi leur voyelle aux **2e et 3e personnes du singulier** :
- *e → i* : *geben → du **gibst**, er **gibt*** · *sprechen → du **sprichst***
- *e → ie* : *sehen → du **siehst***, *lesen → du **liest***
- *a → ä* : *fahren → du **fährst***, *schlafen → du **schläfst***

Ce changement ne touche que ces deux personnes, et disparaît au pluriel.

## Les verbes mixtes
Ils changent de radical **et** prennent les terminaisons faibles : *bringen → brachte → gebracht*, *denken → dachte → gedacht*, *kennen → kannte → gekannt*, *wissen → wusste → gewusst*.

## Les verbes en -ieren
Toujours faibles, et **sans ge-** au participe : *studieren → studierte → studiert*, *telefonieren → telefoniert*.

> Le seul apprentissage qui paie vraiment : les trois formes, dites ensemble, à voix haute. Les reconnaître sur une copie, c'est reconstruire le sens d'un texte à la lecture.`,
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
            cours: `Les modaux disent le rapport du sujet à l'action : possibilité, obligation, volonté. Ils se conjuguent à part, et envoient l'infinitif à la fin.

## Les six, et leurs nuances
- **können** : pouvoir (capacité) — *Ich kann schwimmen.*
- **dürfen** : avoir le droit — *Darf ich reinkommen?*
- **müssen** : devoir (nécessité) — *Ich muss lernen.*
- **sollen** : devoir (consigne venue d'autrui) — *Ich soll pünktlich sein.*
- **wollen** : vouloir (volonté ferme) — *Ich will nach Berlin.*
- **mögen** : aimer, apprécier — *Ich mag Schokolade.* Sa forme au subjonctif II, **möchte**, est la façon polie de dire « je voudrais ».

## Une conjugaison à part
Au singulier, la voyelle change et il n'y a **aucune terminaison** aux 1re et 3e personnes : *ich **kann**, du **kannst**, er **kann**, wir **können**, ihr **könnt**, sie **können***. Idem : *ich muss, ich darf, ich will, ich soll* (celui-ci sans changement de voyelle), *ich mag*.

## La place de l'infinitif
Le modal se conjugue en deuxième position, l'infinitif ferme la phrase : *Ich **muss** heute Abend **arbeiten**.* En subordonnée, tout part à la fin : *…, weil ich arbeiten **muss**.*

## Le prétérit
Régulier, sans inflexion : *konnte, durfte, musste, sollte, wollte, mochte*. C'est le passé usuel des modaux, même à l'oral.

## Le double infinitif
Au parfait, le modal prend la forme de l'**infinitif** et non du participe : *Ich habe arbeiten **müssen*** (et non *gemusst*). Sans infinitif dépendant, en revanche, le participe existe : *Ich habe es **gemusst**.*

## Le piège de la négation
*Ich muss nicht* = « je ne suis pas obligé », et non « je ne dois pas ». L'interdiction se dit **nicht dürfen** : *Du **darfst** hier nicht rauchen.*

> *sollen* rapporte une consigne extérieure — *Ich soll den Arzt fragen* signifie « on m'a dit de demander au médecin ». C'est un outil précieux pour rapporter un propos sans le prendre à son compte.`,
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
            cours: `Un même radical peut donner dix verbes différents selon le préverbe qui le précède. Encore faut-il savoir si ce préverbe se détache.

## Le test de l'accent
Le préverbe **séparable** est **accentué** : *ÁN-rufen*, *ÁUF-stehen*, *ÉIN-kaufen*. Le préverbe **inséparable** ne l'est pas : *be-SÚCHEN*, *ver-STÉHEN*. C'est le seul critère fiable, et il s'entend.

## Les préverbes séparables
*ab-, an-, auf-, aus-, ein-, mit-, nach-, vor-, zu-, zurück-, weg-, los-, hin-, her-, zusammen-*…
Dans une principale, le préverbe **se détache et ferme la phrase** : *Ich **stehe** um sieben Uhr **auf**.* / *Er **ruft** seine Mutter **an**.*

## Les préverbes inséparables
*be-, ge-, er-, ver-, zer-, ent-, emp-, miss-*. Ils restent soudés en toute circonstance, et le participe passé **n'a pas de ge-** : *besuchen → besucht*, *verstehen → verstanden*, *erzählen → erzählt*.

## Le participe et le zu des séparables
- participe : le *ge-* s'intercale — *auf**ge**standen*, *ein**ge**kauft*, *an**ge**rufen*
- infinitif avec *zu* : le *zu* s'intercale aussi, en un seul mot — *auf**zu**stehen*, *ein**zu**kaufen*

## En subordonnée, tout se recolle
Le verbe conjugué partant à la fin, il rejoint son préverbe : *…, weil er um sieben Uhr **aufsteht**.* Le verbe s'écrit alors en un seul mot.

## Les préverbes à double statut
*durch-, über-, unter-, um-, wieder-* sont séparables ou non selon le sens :
- *Ich setze **über*** (je traverse en bateau) — séparable, sens concret
- *Ich über**setze** den Text* (je traduis) — inséparable, sens figuré

> Le sens dépend entièrement du préverbe : *kommen* (venir), *ankommen* (arriver), *bekommen* (recevoir), *mitkommen* (accompagner), *umkommen* (périr). On n'apprend jamais un verbe allemand sans son préverbe.`,
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
            cours: `Le pronom réfléchi allemand a deux séries, et la différence n'est pas décorative : elle change la construction de la phrase.

## Le réfléchi à l'accusatif
La série est *mich, dich, **sich**, uns, euch, **sich***. C'est le cas de la grande majorité des verbes pronominaux : *sich freuen* (se réjouir), *sich waschen* (se laver), *sich setzen* (s'asseoir), *sich erinnern* (se souvenir), *sich beeilen* (se dépêcher), *sich interessieren für* (s'intéresser à).

*Ich freue **mich**.* / *Er interessiert **sich** für Musik.*

## Le réfléchi au datif
La série change aux deux premières personnes du singulier : ***mir**, **dir**, sich, uns, euch, sich*. On l'emploie dès qu'il y a **déjà un complément d'objet direct** : *Ich wasche **mir** die Hände.* / *Ich sehe **mir** den Film an.* / *Ich kaufe **mir** ein Buch.*

La règle est mécanique : un COD dans la phrase → le réfléchi passe au datif.

## La place du pronom
Juste **après le verbe conjugué** : *Ich freue **mich** auf die Ferien.* En cas d'inversion, il suit toujours le verbe et peut précéder un sujet nominal : *Gestern hat **sich** mein Bruder verletzt.* En subordonnée, il suit le sujet : *…, weil ich **mich** freue.*

## Les prépositions qui vont avec
Beaucoup de verbes pronominaux sont liés à une préposition fixe, à apprendre avec eux : *sich freuen **auf** + accusatif* (se réjouir de ce qui vient), *sich freuen **über** + accusatif* (se réjouir de ce qui est arrivé), *sich interessieren **für***, *sich erinnern **an** + accusatif*, *sich ärgern **über***.

## Les faux pronominaux
Des verbes français pronominaux qui ne le sont pas en allemand : *aufstehen* (se lever), *spazieren gehen* (se promener), *passieren* (se passer), *heißen* (s'appeler), *bleiben* (se maintenir). Et l'inverse existe : *sich verspäten* (être en retard) est pronominal en allemand seulement.

> *sich* ne s'écrit jamais avec une majuscule, même dans le vouvoiement : *Setzen Sie **sich** bitte!*`,
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
            cours: `L'allemand n'a qu'une forme de présent, là où l'anglais en a deux : *ich spiele* traduit aussi bien « je joue » que « je suis en train de jouer ».

## Les terminaisons
Radical (infinitif moins *-en*) + *-e, -st, -t, -en, -t, -en* :
*ich spiel**e**, du spiel**st**, er spiel**t**, wir spiel**en**, ihr spiel**t**, sie spiel**en***.

## Les aménagements de prononciation
- radical en **-d, -t, -n** précédé d'une consonne : on intercale un *e* — *du arbeit**e**st*, *er arbeit**e**t*, *ihr find**e**t*
- radical en **-s, -ß, -z, -x** : le *-st* de la 2e personne perd son *s* — *du heiß**t***, *du sitz**t***, *du reis**t***
- radical en **-el** : le *e* tombe à la 1re personne — *ich samm**le***

## Les verbes forts
Aux **2e et 3e personnes du singulier seulement**, la voyelle change : *e → i* (*du gibst, er gibt* · *du sprichst*), *e → ie* (*du siehst, er sieht* · *du liest*), *a → ä* (*du fährst, er fährt* · *du schläfst*), *au → äu* (*du läufst*).

## Les trois irréguliers majeurs
*sein* : *bin, bist, ist, sind, seid, sind*. *haben* : *habe, hast, hat, haben, habt, haben*. *werden* : *werde, wirst, wird, werden, werdet, werden*.

## Le présent vaut futur
Avec un adverbe de temps, le présent suffit à dire l'avenir — et c'est la tournure la plus naturelle : *Morgen **fahre** ich nach Berlin.* Le futur en *werden* n'est utile que sans repère temporel, ou pour insister.

## Le présent avec seit
Là où le français dit « j'apprends… depuis trois ans », l'allemand fait de même, au présent : *Ich lerne **seit** drei Jahren Deutsch.* Employer le parfait ici est une faute.

> Le présent allemand couvre donc trois valeurs : le moment présent, l'habitude, et l'avenir proche. Une forme, trois emplois.`,
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
            cours: `Le prétérit est le temps du **récit** : romans, presse, exposés, comptes rendus. À l'oral, il ne survit que pour quelques verbes — mais ceux-là sont les plus fréquents de la langue.

## Les verbes faibles
Radical + **-te** + terminaisons. Les 1re et 3e personnes du singulier sont **identiques** et sans terminaison supplémentaire :
*ich spiel**te**, du spiel**test**, er spiel**te**, wir spiel**ten**, ihr spiel**tet**, sie spiel**ten***.

## Les verbes forts
La voyelle change, et les 1re et 3e personnes n'ont **aucune terminaison** :
*ich **ging**, du **gingst**, er **ging**, wir **gingen**, ihr **gingt**, sie **gingen***.

À connaître par cœur : *gehen → ging*, *kommen → kam*, *sehen → sah*, *geben → gab*, *fahren → fuhr*, *sprechen → sprach*, *nehmen → nahm*, *schreiben → schrieb*, *bleiben → blieb*, *finden → fand*, *trinken → trank*, *essen → aß*.

## Les verbes mixtes
Radical modifié, terminaisons faibles : *bringen → brachte*, *denken → dachte*, *kennen → kannte*, *wissen → wusste*.

## Ceux qui survivent à l'oral
*sein → **war***, *haben → **hatte***, *werden → **wurde***, et les six modaux (*konnte, durfte, musste, sollte, wollte, mochte*). Dire *ich bin müde gewesen* n'est pas faux, mais *ich **war** müde* est ce que tout le monde dit.

## Le plus-que-parfait
Prétérit de *haben* ou *sein* + participe II : *Ich **hatte** gegessen*, *Er **war** gegangen*. Il sert à marquer l'antériorité, surtout après *nachdem* : ***Nachdem** ich gegessen **hatte**, ging ich schlafen.*

> Règle de choix à retenir : à l'oral et dans une lettre, on raconte au parfait ; dans un texte narratif ou un résumé écrit, on raconte au prétérit. Mélanger les deux dans un même récit fait désordre.`,
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
            cours: `Le parfait (Perfekt) est le passé de la conversation, du courriel, du message. Il se forme en deux morceaux, comme le passé composé français — mais l'auxiliaire ne se choisit pas de la même façon.

## La formation
**haben** ou **sein** conjugué au présent + **participe II** rejeté en fin de phrase : *Ich **habe** einen Film **gesehen**.* / *Ich **bin** nach Berlin **gefahren**.*

## Le participe II
- verbes faibles : **ge-** + radical + **-t** — *gespielt*, *gelernt*, *gemacht*
- verbes forts : **ge-** + radical (souvent modifié) + **-en** — *gesehen*, *gefahren*, *geschrieben*, *gegessen*
- verbes en **-ieren** : pas de *ge-* — *studiert*, *telefoniert*
- préverbe **inséparable** : pas de *ge-* — *besucht*, *verstanden*, *erzählt*
- préverbe **séparable** : le *ge-* s'intercale — *aufgestanden*, *eingekauft*

## haben ou sein
**sein** s'emploie avec :
- les verbes de déplacement d'un point à un autre : *gehen, kommen, fahren, fliegen, laufen, reisen, steigen*
- les verbes de changement d'état : *aufstehen, einschlafen, aufwachen, wachsen, sterben*
- *sein*, *bleiben*, *werden*, *passieren*, *geschehen*, *begegnen*

**haben** ailleurs — y compris pour un verbe de mouvement employé transitivement : *Ich habe das Auto gefahren.*

## L'ordre des mots
L'auxiliaire est en **deuxième position**, le participe **à la fin** : c'est la parenthèse verbale. En subordonnée, l'auxiliaire passe derrière le participe : *…, weil ich einen Film gesehen **habe**.*

> Le français distingue passé composé et imparfait ; l'allemand, lui, distingue registres (parfait à l'oral, prétérit à l'écrit) et non aspects. Traduire un imparfait par un prétérit est donc juste dans un récit écrit, et par un parfait dans un dialogue.`,
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
            cours: `L'allemand a un futur, mais il ne l'emploie pas aussi souvent que le français. Savoir quand il est nécessaire vaut mieux que de le placer partout.

## Le Futur I
**werden** conjugué + **infinitif** en fin de phrase : *Ich **werde** morgen nach Berlin **fahren**.*
Conjugaison de *werden* : *ich werde, du **wirst**, er **wird**, wir werden, ihr werdet, sie werden*.

## Le présent le remplace
Dès qu'un adverbe de temps précise l'avenir, le présent suffit — et c'est la forme la plus courante : *Morgen **fahre** ich nach Berlin.* / *Nächstes Jahr **mache** ich mein Abitur.* Employer le futur dans ce cas n'est pas faux, seulement plus lourd.

## Quand le futur est vraiment utile
- sans repère de temps, pour lever l'ambiguïté : *Ich **werde** dir helfen.*
- pour une promesse, une résolution, une prédiction : *Das **wird** nicht einfach **sein**.*
- pour marquer une insistance : *Du **wirst** jetzt aufräumen!*

## La valeur de supposition
Le futur exprime aussi une **hypothèse sur le présent**, souvent renforcée par *wohl* : *Er **wird** wohl krank **sein*** = « il doit être malade ». C'est un emploi fréquent, et le contresens est facile.

## Le Futur II
*werden* + participe II + *haben* / *sein* : *Bis morgen **werde** ich das Buch **gelesen haben**.* Rare, il dit une action achevée dans l'avenir — ou une supposition sur le passé : *Er wird es vergessen haben* (il a dû l'oublier).

## Attention à werden
Le même verbe sert à trois choses : « devenir » (*Er wird Arzt*), le futur (*Er wird kommen*), le passif (*Das Haus wird gebaut*). C'est ce qui suit qui tranche — un nom, un infinitif, ou un participe II.

> En subordonnée, les deux morceaux se rejoignent à la fin, et c'est *werden* qui ferme : *…, dass er kommen **wird**.*`,
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
            cours: `On ne donne pas un ordre de la même façon à un camarade, à un groupe ou à un adulte qu'on vouvoie. L'allemand a une forme pour chacun.

## La forme du du
Radical du présent **sans terminaison** et **sans pronom** : *Komm!*, *Geh!*, *Lern!*, *Mach!* Un *-e* final est possible à l'écrit soutenu (*Gehe!*), obligatoire après *-d, -t, -ig* : *Arbeit**e**!*, *Entschuldig**e**!*

Les verbes à alternance *e → i / ie* la **gardent** : *geben → **Gib**!*, *nehmen → **Nimm**!*, *lesen → **Lies**!*, *sehen → **Sieh**!*
Ceux à alternance *a → ä* la **perdent** : *fahren → **Fahr**!*, *schlafen → **Schlaf**!*, *laufen → **Lauf**!*

## La forme du ihr
C'est la forme du présent, **sans pronom** : *Komm**t**!*, *Geh**t**!*, *Arbeit**et**!*

## La forme du Sie
Le verbe à l'infinitif **suivi de Sie** : *Komm**en Sie**!*, *Setz**en Sie** sich!* Le pronom se maintient, contrairement aux deux autres formes.

## La forme du wir
Même construction, avec *wir* : *Gehen wir!* (allons-y), *Fangen wir an!*

## sein est irrégulier
*Sei ruhig!* (du) · *Seid ruhig!* (ihr) · *Seien Sie ruhig!* (Sie).

## Adoucir l'ordre
L'allemand ajoute volontiers *bitte*, *mal*, *doch*, ou les combine : *Komm **doch mal** her!*, *Machen Sie **bitte** die Tür zu!* Sans ces petits mots, un impératif allemand paraît sec.

## La place du verbe
Le verbe ouvre la phrase, en **première position** — et le préverbe séparable part à la fin : *Steh bitte **auf**!*, *Ruf mich **an**!*

> Autres façons de commander sans impératif : l'infinitif seul sur les panneaux (*Nicht rauchen!*), le futur menaçant (*Du wirst jetzt lernen!*) ou la question polie (*Könnten Sie mir helfen?*).`,
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
            cours: `Le subjonctif II (Konjunktiv II) est l'équivalent du conditionnel français. Il sert à trois choses : l'hypothèse, le souhait et la politesse.

## La forme usuelle : würde + infinitif
*ich **würde**, du **würdest**, er **würde**, wir **würden**, ihr **würdet**, sie **würden*** + infinitif en fin de phrase : *Ich **würde** gern nach Berlin **fahren**.* C'est la construction à employer par défaut pour la plupart des verbes.

## Les formes propres à connaître
Certains verbes ont une forme simple, plus courante que *würde* :
- *sein → **wäre*** · *haben → **hätte***
- *werden → **würde*** · *wissen → **wüsste***
- modaux : *können → **könnte***, *müssen → **müsste***, *dürfen → **dürfte***, *mögen → **möchte***, *sollen → **sollte***, *wollen → **wollte***

Elles se forment sur le **prétérit**, avec **inflexion** et un *-e* : *war → wäre*, *hatte → hätte*, *konnte → könnte*.

## L'irréel
*Wenn ich Zeit **hätte**, **würde** ich kommen.* (si j'avais le temps, je viendrais) La subordonnée en *wenn* et la principale portent toutes deux le subjonctif II. *Wenn* peut disparaître, et le verbe prend alors la première place : ***Hätte** ich Zeit, würde ich kommen.*

## La politesse
C'est l'emploi le plus quotidien : ***Könnten** Sie mir helfen?* / *Ich **hätte** gern einen Kaffee.* / *Ich **möchte** bitte zahlen.* / ***Wären** Sie so freundlich…* Un présent à la place ferait brusque.

## Le souhait et le conseil
*Wenn er nur hier **wäre**!* (si seulement il était là) · *Du **solltest** mehr schlafen.* (tu devrais dormir davantage) · *An deiner Stelle **würde** ich es machen.*

## als ob
Après *als ob* (comme si), le subjonctif II est de règle : *Er tut so, **als ob** er alles **wüsste**.*

> Le subjonctif I, lui, sert au discours indirect de la presse (*Er sagte, er **sei** krank*) : il se rencontre à la lecture bien plus qu'il ne s'écrit.`,
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
