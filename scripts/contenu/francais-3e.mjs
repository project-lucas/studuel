// Français — Troisième : LE PROGRAMME COMPLET (18 fiches).
//
// CE QUE REMPLACE CE MODULE. La 3e n'avait que CINQ chapitres de français,
// hérités du tout premier jeu de données (migration 008, contenu rempli par la
// 114) : « Se raconter : l'autobiographie », « Dénoncer les travers de la
// société », « La poésie engagée », « Le discours rapporté », « Préparer l'oral
// du brevet ». Cinq titres pour un programme qui s'organise en QUATRE
// questionnements, un questionnement complémentaire et une boîte à outils
// d'analyse littéraire. Rien sur l'autoportrait, rien sur les formes de la
// satire, rien sur la littérature témoin de l'Histoire, rien sur les progrès et
// les rêves scientifiques, rien sur la focalisation ni sur les valeurs des
// temps : un élève de 3e qui révisait ces points ne trouvait RIEN.
//
// LE DÉCOUPAGE. Les 6 chapitres de la maquette de référence, éclatés en leurs
// 18 fiches. Chaque fiche est un chapitre en base ; le CHAPITRE du programme est
// porté par `axe` (colonne `chapters.theme`), qui fait grouper la page matière —
// cf. docs/template-matiere.md. Un seul rayon : le français de 3e n'a pas les
// trois onglets du français de 1re (Programme · Fiches · Grammaire), il n'a
// qu'un onglet Programme.
//
// LE SIXIÈME CHAPITRE N'EST PAS UN QUESTIONNEMENT. « Outils d'analyse
// littéraire » ne figure pas au BO comme entrée de programme : c'est la boîte à
// outils que l'élève mobilise DANS les quatre questionnements et à l'épreuve du
// brevet (types de discours, focalisation, valeurs des temps, figures de style,
// argumentation, vocabulaire de la poésie et du théâtre). La maquette de
// référence en fait un chapitre à part entière ; on la suit, parce qu'un élève
// qui cherche « qu'est-ce qu'une anaphore » ne la cherche pas dans un
// questionnement, il la cherche dans une liste d'outils.
//
// LES CINQ ANCIENS PARTENT (voir `menage`). Deux d'entre eux sont recouverts au
// titre près par le nouveau découpage (« Se raconter : l'autobiographie » →
// deux fiches d'autobiographie, « Dénoncer les travers de la société » → le
// chapitre 2 lui-même), « La poésie engagée » se répartit entre les chapitres 3
// et 4, « Le discours rapporté » devient « Les différents types de discours », et
// « Préparer l'oral du brevet » sort du programme de français (l'oral du brevet
// porte sur un projet, pas sur une œuvre). Le ménage est borné à leurs cinq
// titres exacts et au seul niveau 3e — rejoué, il ne trouve plus rien et ne
// touche jamais les 18 fiches neuves.
//
// ⚠️ Le slug reste `francais` et SEPT modules le portent désormais
// (`francais-fiches-a` → `-e` = 261→265, `francais-1re` = 259, `francais-2de` =
// 283, celui-ci = 290) : ne JAMAIS générer avec `--slugs francais`, qui les
// fusionnerait et réécrirait sept migrations. Toujours `--modules francais-3e`.

export default {
  slug: 'francais',
  nom: 'Français',

  titreMigration: 'FRANÇAIS 3e — LE PROGRAMME COMPLET (18 fiches)',

  motif: `CONSTAT : la Troisième n'avait que CINQ chapitres de français, hérités du
premier jeu de données de l'app. Le programme du cycle 4 s'organise en quatre
questionnements — se chercher et se construire, vivre en société, regarder le
monde et inventer des mondes, agir sur le monde — auxquels s'ajoutent un
questionnement complémentaire (progrès et rêves scientifiques) et la boîte à
outils d'analyse littéraire qu'exige l'épreuve du brevet. Un élève de 3e qui
révisait l'autoportrait, les formes de la satire, la littérature témoin de
l'Histoire, la science comme source d'espoir ou d'inquiétude, la focalisation,
les valeurs des temps, les figures de style ou le vocabulaire du théâtre ne
trouvait RIEN. Cette migration installe les 18 fiches, rangées sous leurs 6
chapitres, et retire les 5 fiches génériques que ce découpage recouvre.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 18 fiches sous 6 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas
garantir que la 234 soit passée en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 5 anciens chapitres
déjà supprimés et les 18 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités partent. "Se raconter : l'autobiographie" et
"Dénoncer les travers de la société" sont recouverts au titre près par le
nouveau découpage : les garder ferait deux objets du même nom à deux places
différentes, un en-tête de section et une ligne dans la liste. "La poésie
engagée" se répartit entre le chapitre 3 (visions poétiques du monde) et le
chapitre 4 (agir dans la cité). "Le discours rapporté" devient "Les différents
types de discours". "Préparer l'oral du brevet" ne relève pas du programme de
français : l'épreuve orale du brevet porte sur un projet mené dans l'année.
ATTENTION À L'APOSTROPHE : les titres de la 008 s'écrivent avec l'apostrophe
DROITE, pas la typographique qu'emploient les fiches neuves. Un DELETE qui se
tromperait de signe ne trouverait rien EN SILENCE.
Le filtre level = '3e' est indispensable : "Dénoncer les travers de la société"
est aussi un questionnement de 4e, et le ménage viderait le collège.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.
Le ménage tourne AVANT les insertions à CHAQUE passage : sans la borne des cinq
titres, un rejeu effacerait les quiz des 18 fiches neuves.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '3e'
   AND c.title IN ('Se raconter : l''autobiographie',
                   'Dénoncer les travers de la société',
                   'La poésie engagée',
                   'Le discours rapporté',
                   'Préparer l''oral du brevet');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '3e'
   AND c.title IN ('Se raconter : l''autobiographie',
                   'Dénoncer les travers de la société',
                   'La poésie engagée',
                   'Le discours rapporté',
                   'Préparer l''oral du brevet');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '3e'
   AND c.title IN ('Se raconter : l''autobiographie',
                   'Dénoncer les travers de la société',
                   'La poésie engagée',
                   'Le discours rapporté',
                   'Préparer l''oral du brevet');`,
    },
  ],

  blocs: [
    {
      niveaux: ['3e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Se chercher, se construire — Se raconter, se représenter
        // ===================================================================
        {
          titre: 'L’autoportrait',
          axe: 'Se chercher, se construire — Se raconter, se représenter',
          lecon: {
            titre: 'Se peindre soi-même, en mots ou en couleurs',
            cours: `L’**autoportrait** est la représentation que quelqu’un donne de lui-même : un peintre le fait avec des couleurs, un écrivain avec des mots. Dans les deux cas, l’auteur est à la fois **celui qui regarde** et **celui qui est regardé**.

## Ce qui distingue l’autoportrait de l’autobiographie
L’autobiographie **raconte** une vie : elle suit le fil du temps, de l’enfance à aujourd’hui. L’autoportrait **décrit** un être : son visage, son caractère, ses goûts, ses contradictions. L’un est un **récit**, l’autre est un **tableau**. Montaigne, dans les *Essais*, écrit : « Je suis moi-même la matière de mon livre » — il ne raconte pas sa vie, il se peint.

> L’autoportrait ne répond pas à « qu’est-ce qui m’est arrivé ? » mais à « qui suis-je ? ».

## Les outils de la langue
- La **première personne** (« je », « moi », « mon ») : l’auteur parle en son nom.
- Le **présent d’énonciation**, qui donne l’impression d’un être saisi maintenant.
- Le **portrait physique** (le corps, le visage) et le **portrait moral** (le caractère, les défauts).
- Le **champ lexical** des qualités et des défauts, souvent mêlés : un autoportrait honnête n’est pas un éloge.

## L’autoportrait en peinture
Rembrandt s’est peint plus de quatre-vingts fois, du jeune homme assuré au vieillard fatigué. Van Gogh se peint l’oreille bandée. Frida Kahlo fait de son corps blessé le sujet même de son œuvre. Le peintre choisit une **pose**, une **lumière**, un **décor** : ces choix disent autant que les traits du visage.

## La sincérité en question
Se peindre, c’est choisir ce qu’on montre. L’auteur peut **s’embellir**, se **noircir** par modestie, ou se réinventer. Le lecteur doit donc lire un autoportrait comme une **construction**, pas comme un miroir : ce que l’auteur veut faire croire de lui fait partie de son portrait.

## Quelques repères
Montaigne (*Essais*), La Rochefoucauld (*Portrait de La Rochefoucauld par lui-même*), Michel Leiris (*L’Âge d’homme*), Nathalie Sarraute (*Enfance*), Annie Ernaux.`,
          },
          questions: [
            ['Qu’est-ce qu’un autoportrait littéraire ?', ['Une description que l’auteur donne de lui-même', 'Le récit chronologique de sa vie', 'Le portrait d’un proche', 'Un roman à la première personne'], 0, 'Il décrit un être là où l’autobiographie raconte une vie.'],
            ['Quelle phrase de Montaigne résume le projet de l’autoportrait ?', ['« Je suis moi-même la matière de mon livre »', '« Le moi est haïssable »', '« Je pense donc je suis »', '« Rien ne sert de courir »'], 0, 'Elle ouvre les Essais et annonce un livre dont le sujet est son auteur.'],
            ['Quelle personne grammaticale domine l’autoportrait ?', ['La première personne', 'La deuxième personne', 'La troisième personne', 'La troisième personne du pluriel'], 0, 'L’auteur parle de lui, en son nom propre.'],
            ['Quel temps donne l’impression d’un être saisi au moment où il écrit ?', ['Le présent d’énonciation', 'Le passé simple', 'Le plus-que-parfait', 'Le futur antérieur'], 0, 'Il installe l’auteur devant le lecteur, ici et maintenant.'],
            ['Que distingue-t-on dans un portrait complet ?', ['Le portrait physique et le portrait moral', 'Le portrait long et le portrait court', 'Le portrait vrai et le portrait faux', 'Le portrait en vers et en prose'], 0, 'Le corps d’un côté, le caractère de l’autre.'],
            ['Quel peintre s’est représenté plus de quatre-vingts fois ?', ['Rembrandt', 'Monet', 'Delacroix', 'Picasso'], 0, 'Ses autoportraits successifs forment une autobiographie peinte.'],
            ['Un autoportrait est-il forcément un miroir fidèle ?', ['Non, c’est une construction : l’auteur choisit ce qu’il montre', 'Oui, le pacte oblige à tout dire', 'Oui, sinon ce serait un roman', 'Non, car il est toujours écrit par un tiers'], 0, 'Ce que l’auteur veut faire croire de lui fait partie du portrait.'],
            ['L’autoportrait suit obligatoirement l’ordre chronologique d’une vie.', ['Vrai', 'Faux'], 1, 'C’est l’autobiographie qui suit le fil du temps ; l’autoportrait décrit.'],
          ],
        },
        {
          titre: 'L’autobiographie : se raconter',
          axe: 'Se chercher, se construire — Se raconter, se représenter',
          lecon: {
            titre: 'Le pacte, le « je » et la mémoire',
            cours: `Une **autobiographie** est le récit **rétrospectif** qu’une personne réelle fait de sa **propre existence**. Le mot vient du grec : *auto* (soi-même), *bios* (la vie), *graphein* (écrire).

## Le pacte autobiographique
Philippe Lejeune appelle **pacte autobiographique** l’engagement que l’auteur prend envers son lecteur : dire la vérité sur sa propre vie. Il repose sur une **identité triple** — l’auteur, le narrateur et le personnage principal sont **une seule et même personne**. C’est ce pacte qui sépare l’autobiographie du roman, où le narrateur est une invention.

> Rousseau ouvre les *Confessions* par une promesse : « Je forme une entreprise qui n’eut jamais d’exemple. »

## Les deux « je »
Le récit s’écrit à la première personne, mais il y a en réalité **deux voix** : le **je qui écrit** (l’adulte, aujourd’hui) et le **je qui a vécu** (l’enfant, autrefois). L’adulte commente, juge, explique ; l’enfant agit sans savoir. Ce décalage s’appelle le **regard rétrospectif**, et c’est souvent là que naît l’émotion.

## Les temps du récit d’enfance
- L’**imparfait** pour les habitudes et le décor : « chaque été, nous partions… ».
- Le **passé simple** ou le **passé composé** pour les événements marquants.
- Le **présent de vérité générale** quand l’adulte tire une leçon.

## Les genres voisins
Les **Mémoires** racontent surtout la vie publique et les grands événements traversés (Chateaubriand). Le **journal intime** s’écrit au jour le jour, sans recul (Anne Frank). L’**autofiction** mêle sciemment le vrai et l’inventé. Le **roman autobiographique** garde la matière d’une vie mais renonce au pacte.

## Pourquoi se raconter ?
Pour **se souvenir** avant que la mémoire ne s’efface, pour **se comprendre**, pour **se justifier** devant les autres, pour **témoigner** d’une époque, ou simplement pour **transmettre**. Une même œuvre mêle souvent plusieurs de ces motifs.

## Quelques repères
Rousseau (*Les Confessions*), Chateaubriand (*Mémoires d’outre-tombe*), Nathalie Sarraute (*Enfance*), Georges Perec (*W ou le souvenir d’enfance*), Annie Ernaux (*La Place*).`,
          },
          questions: [
            ['Que signifie littéralement le mot « autobiographie » ?', ['Écrire soi-même sa vie', 'Écrire la vie d’un autre', 'Écrire une histoire vraie', 'Écrire chaque jour'], 0, 'Du grec auto (soi-même), bios (la vie), graphein (écrire).'],
            ['Qui a formulé la notion de « pacte autobiographique » ?', ['Philippe Lejeune', 'Jean-Jacques Rousseau', 'Roland Barthes', 'Gérard Genette'], 0, 'Il décrit l’engagement de vérité pris envers le lecteur.'],
            ['Qu’implique ce pacte ?', ['L’auteur, le narrateur et le personnage principal sont la même personne', 'Le récit doit être publié après la mort de l’auteur', 'Le récit doit suivre l’ordre chronologique', 'Le récit ne doit pas contenir de dialogues'], 0, 'C’est cette identité triple qui distingue l’autobiographie du roman.'],
            ['Que désigne le « regard rétrospectif » ?', ['Le décalage entre l’adulte qui écrit et l’enfant qui a vécu', 'Le refus de raconter son enfance', 'Le point de vue d’un témoin extérieur', 'Le récit écrit au jour le jour'], 0, 'Deux « je » cohabitent dans le même texte.'],
            ['Quel temps domine pour décrire les habitudes de l’enfance ?', ['L’imparfait', 'Le passé simple', 'Le futur simple', 'Le conditionnel'], 0, 'Il installe le décor et les gestes répétés.'],
            ['Quel genre s’écrit au jour le jour, sans recul ?', ['Le journal intime', 'Les Mémoires', 'L’autofiction', 'Le roman autobiographique'], 0, 'Le Journal d’Anne Frank en est l’exemple le plus connu.'],
            ['Que racontent surtout les Mémoires ?', ['La vie publique et les grands événements traversés', 'Les rêves de l’auteur', 'L’enfance uniquement', 'La vie d’un proche'], 0, 'Chateaubriand y traverse la Révolution et l’Empire.'],
            ['L’autofiction respecte strictement le pacte autobiographique.', ['Vrai', 'Faux'], 1, 'Elle mêle volontairement le vécu et l’inventé.'],
          ],
        },
        {
          titre: 'L’autobiographie : raconter le monde',
          axe: 'Se chercher, se construire — Se raconter, se représenter',
          lecon: {
            titre: 'Quand une vie raconte une époque',
            cours: `Certaines autobiographies ne cherchent pas seulement à dire « qui je suis » : elles se servent d’une vie singulière pour **faire voir un monde**. Le « je » devient alors une **fenêtre** ouverte sur une famille, une classe sociale, une guerre, un exil.

## Le témoignage
Quand l’auteur a traversé un événement historique, son récit devient un **témoignage** : il engage sa parole pour que l’on sache. Primo Levi raconte Auschwitz dans *Si c’est un homme* ; Charlotte Delbo, Elie Wiesel, Anne Frank écrivent depuis l’intérieur de la catastrophe. Le témoignage a une valeur **documentaire** et une valeur **morale** : il lutte contre l’oubli et contre le mensonge.

> « Vous qui vivez en toute quiétude / Dans vos maisons bien chaudes… » — Primo Levi s’adresse directement au lecteur d’après.

## Le récit d’un milieu
L’autobiographie peut aussi éclairer un **milieu social**. Annie Ernaux, dans *La Place*, raconte son père, petit commerçant normand, et à travers lui l’écart douloureux entre le monde d’où elle vient et celui où l’école l’a menée. L’écriture s’y fait volontairement **plate**, sans effets, pour ne pas trahir ce qu’elle décrit.

## Le récit d’enfance et d’exil
Chez Georges Perec (*W ou le souvenir d’enfance*), le trou de la mémoire dit la disparition des parents. Chez Azouz Begag (*Le Gone du Chaâba*), l’enfance dans un bidonville lyonnais raconte l’immigration. Le détail vécu vaut alors mieux qu’un chapitre d’histoire : il rend le passé **habitable**.

## Ce que cela change pour le lecteur
Lire ces récits, ce n’est pas seulement s’intéresser à une personne : c’est **comprendre de l’intérieur** une situation qu’un manuel décrit de l’extérieur. Le lecteur passe de « je sais que cela a eu lieu » à « je vois ce que cela faisait ».

## Les procédés à repérer
- L’**ancrage référentiel** : dates, lieux, noms réels.
- L’**adresse au lecteur**, qui l’implique et l’oblige.
- Le **détail concret** (un objet, une odeur, un mot entendu), plus parlant qu’une généralité.
- L’**alternance** entre le récit et le commentaire de l’adulte.`,
          },
          questions: [
            ['Que devient une autobiographie quand l’auteur a traversé un événement historique ?', ['Un témoignage', 'Un pamphlet', 'Une fable', 'Un journal de bord'], 0, 'L’auteur engage sa parole pour que l’on sache.'],
            ['Quelle œuvre de Primo Levi raconte Auschwitz ?', ['Si c’est un homme', 'La Peste', 'Le Journal', 'Le Premier Homme'], 0, 'Elle est l’un des grands textes de la littérature concentrationnaire.'],
            ['Quelle double valeur porte un témoignage ?', ['Documentaire et morale', 'Comique et tragique', 'Poétique et musicale', 'Scientifique et technique'], 0, 'Il informe et il lutte contre l’oubli.'],
            ['Dans La Place, que raconte Annie Ernaux à travers son père ?', ['L’écart entre son milieu d’origine et celui où l’école l’a menée', 'La guerre d’Algérie', 'Un voyage en Italie', 'Une histoire d’amour de jeunesse'], 0, 'Le récit d’une vie éclaire une condition sociale.'],
            ['Pourquoi Annie Ernaux choisit-elle une écriture volontairement plate ?', ['Pour ne pas trahir le monde qu’elle décrit', 'Parce qu’elle écrit vite', 'Pour imiter le style de son père', 'Parce que le sujet est joyeux'], 0, 'Les effets de style trahiraient la simplicité du milieu raconté.'],
            ['Que raconte Azouz Begag dans Le Gone du Chaâba ?', ['Son enfance dans un bidonville lyonnais', 'Son service militaire', 'Une expédition polaire', 'Sa carrière de peintre'], 0, 'L’enfance vécue donne à voir l’immigration de l’intérieur.'],
            ['Qu’est-ce que l’ancrage référentiel ?', ['La présence de dates, de lieux et de noms réels', 'L’usage exclusif du présent', 'Le refus de tout dialogue', 'La présence d’un narrateur extérieur'], 0, 'Il rattache le récit au monde vérifiable.'],
            ['Un détail concret vaut souvent mieux qu’une généralité pour faire comprendre une époque.', ['Vrai', 'Faux'], 0, 'Une odeur, un objet, un mot entendu rendent le passé habitable.'],
          ],
        },

        // ===================================================================
        // Chapitre 2 : Vivre en société — Dénoncer les travers de la société
        // ===================================================================
        {
          titre: 'Les formes de satire',
          axe: 'Vivre en société, participer à la société — Dénoncer les travers de la société',
          lecon: {
            titre: 'Rire pour faire voir ce qui cloche',
            cours: `La **satire** est un texte qui **critique en faisant rire** ou sourire. Elle vise les défauts d’une personne, d’un groupe ou d’une société entière. Son projet est double : **amuser** et **corriger**. Molière le résume : « castigat ridendo mores », elle corrige les mœurs par le rire.

## La caricature
La caricature **grossit un trait** jusqu’à le rendre ridicule : l’avare devient obsédé par sa cassette, le médecin ne parle plus qu’en latin. En dessin comme en littérature, elle rend visible d’un coup ce qu’un discours mettrait une page à expliquer.

## La parodie et le pastiche
- Le **pastiche** imite le style d’un auteur ou d’un genre.
- La **parodie** imite pour se moquer : elle applique un style noble à un sujet bas.
- L’**héroï-comique** raconte une dispute de village dans le style de l’épopée ; le **burlesque** fait l’inverse et fait parler les héros comme des valets.

## L’ironie et l’antiphrase
L’**ironie** consiste à dire le contraire de ce que l’on pense, en laissant entendre qu’on n’en pense pas un mot. Sa figure principale est l’**antiphrase** : « Quelle brillante idée ! » pour dire l’inverse. Elle demande une **complicité** avec le lecteur, qui doit rétablir seul le vrai sens — c’est ce qui la rend efficace et dangereuse.

> Voltaire, dans *Candide*, écrit que « tout est pour le mieux dans le meilleur des mondes possibles » — au milieu d’un désastre.

## L’apologue
La **fable**, le **conte philosophique** et l’**utopie** racontent une histoire pour faire passer une leçon. L’apologue protège : on peut critiquer un roi en parlant d’un lion.

## Les registres voisins
- Le **comique** fait rire sans forcément critiquer.
- Le **pamphlet** attaque frontalement, sans passer par le rire.
- La **satire** occupe le milieu : elle attaque, mais par le détour du rire.`,
          },
          questions: [
            ['Quel est le double projet de la satire ?', ['Amuser et corriger', 'Émouvoir et consoler', 'Informer et classer', 'Décrire et raconter'], 0, 'Elle critique en faisant rire : « castigat ridendo mores ».'],
            ['Que fait une caricature ?', ['Elle grossit un trait jusqu’au ridicule', 'Elle décrit avec exactitude', 'Elle supprime tout détail', 'Elle raconte une vie entière'], 0, 'Le procédé rend le défaut visible d’un seul coup.'],
            ['Quelle différence entre pastiche et parodie ?', ['Le pastiche imite, la parodie imite pour se moquer', 'Le pastiche est en vers, la parodie en prose', 'Le pastiche est ancien, la parodie moderne', 'Il n’y a aucune différence'], 0, 'La parodie ajoute l’intention moqueuse à l’imitation.'],
            ['Qu’est-ce que l’héroï-comique ?', ['Traiter un sujet banal dans un style épique', 'Traiter un sujet noble dans un style familier', 'Mélanger vers et prose', 'Raconter la vie d’un héros réel'], 0, 'Le burlesque fait exactement l’inverse.'],
            ['Quelle figure est au cœur de l’ironie ?', ['L’antiphrase', 'La métaphore', 'L’anaphore', 'La périphrase'], 0, 'Elle consiste à dire le contraire de ce que l’on pense.'],
            ['Pourquoi l’ironie exige-t-elle une complicité avec le lecteur ?', ['Parce que le lecteur doit rétablir seul le vrai sens', 'Parce qu’elle est toujours écrite en vers', 'Parce qu’elle s’adresse aux enfants', 'Parce qu’elle nécessite une note de bas de page'], 0, 'Sans cette complicité, le texte est compris à l’envers.'],
            ['À quoi sert l’apologue pour un auteur qui critique le pouvoir ?', ['Il protège : on peut critiquer un roi en parlant d’un lion', 'Il allonge le récit', 'Il évite d’avoir à conclure', 'Il supprime la morale'], 0, 'Le détour de la fiction déjoue la censure.'],
            ['Un pamphlet attaque frontalement, sans passer par le rire.', ['Vrai', 'Faux'], 0, 'C’est ce qui le distingue de la satire.'],
          ],
        },
        {
          titre: 'La satire : une arme',
          axe: 'Vivre en société, participer à la société — Dénoncer les travers de la société',
          lecon: {
            titre: 'Ce que le rire peut contre le pouvoir',
            cours: `Faire rire d’un puissant, c’est lui retirer une part de sa puissance. Depuis l’Antiquité, la satire sert d’**arme** aux auteurs qui n’en ont pas d’autre — et les pouvoirs le savent, puisqu’ils la censurent.

## Cibles et enjeux
La satire vise les **abus de pouvoir**, les **injustices sociales**, l’**hypocrisie religieuse**, la **vanité** des grands, la **bêtise** des modes. Molière attaque les faux dévots dans *Tartuffe* — la pièce est interdite cinq ans. La Fontaine met en scène des animaux : « La raison du plus fort est toujours la meilleure » ouvre *Le Loup et l’Agneau*.

## Le détour comme protection
Trois détours reviennent sans cesse :
- l’**animal** (la fable), qui permet de nommer sans nommer ;
- le **pays imaginaire** (l’utopie, le conte), où l’injustice est décrite ailleurs ;
- le **regard étranger** (le Persan de Montesquieu, le Huron de Voltaire), qui trouve absurde ce que l’habitude nous a rendu normal.

> Rendre étrange ce qui est familier : c’est le ressort le plus sûr de la satire.

## Les armes du texte
L’**hyperbole** grossit, l’**accumulation** écrase, l’**antiphrase** feint d’approuver, la **fausse naïveté** feint de ne pas comprendre, l’**énumération** ridicule met sur le même plan des choses incomparables. La satire aime aussi la **chute** brève, qui referme le texte sur un constat sans appel.

## De la fable au dessin de presse
La satire n’a pas quitté la scène : dessin de presse, chanson, sketch, caricature en ligne prolongent la tradition. Elle continue de poser la même question, qui est une question de démocratie : **jusqu’où peut-on rire, et de qui ?**

## Ses limites
Le rire peut manquer sa cible : il peut renforcer un préjugé au lieu de l’attaquer, ou blesser une personne quand il visait une idée. Une satire réussie fait rire **de ce qui mérite d’être combattu**, pas de ceux qui subissent déjà.`,
          },
          questions: [
            ['Pourquoi la satire est-elle une arme ?', ['Faire rire d’un puissant lui retire une part de sa puissance', 'Elle remplace un discours juridique', 'Elle interdit la publication d’autres textes', 'Elle est toujours anonyme'], 0, 'Les pouvoirs la censurent précisément pour cette raison.'],
            ['Quelle pièce de Molière contre les faux dévots fut interdite cinq ans ?', ['Tartuffe', 'Le Misanthrope', 'L’Avare', 'Les Fourberies de Scapin'], 0, 'La cabale des dévots obtint son interdiction.'],
            ['Quel vers ouvre Le Loup et l’Agneau de La Fontaine ?', ['« La raison du plus fort est toujours la meilleure »', '« Rien ne sert de courir, il faut partir à point »', '« Je plie et ne romps pas »', '« Tel est pris qui croyait prendre »'], 0, 'La morale est annoncée avant même le récit.'],
            ['Quel est l’intérêt du regard étranger dans la satire ?', ['Il trouve absurde ce que l’habitude a rendu normal', 'Il permet d’écrire dans une autre langue', 'Il évite d’avoir à décrire', 'Il rallonge le texte'], 0, 'Montesquieu s’en sert dans les Lettres persanes.'],
            ['Quelle figure feint d’approuver ce que l’on condamne ?', ['L’antiphrase', 'La comparaison', 'L’allitération', 'La litote'], 0, 'Elle est le cœur de l’ironie.'],
            ['Que fait une accumulation dans un texte satirique ?', ['Elle écrase la cible sous une avalanche de détails', 'Elle suspend le sens', 'Elle atténue la critique', 'Elle introduit un dialogue'], 0, 'La quantité elle-même devient ridicule.'],
            ['Quelles formes prolongent aujourd’hui la tradition satirique ?', ['Le dessin de presse, la chanson, le sketch', 'Le manuel scolaire et le dictionnaire', 'Le mode d’emploi et la notice', 'Le compte rendu et le procès-verbal'], 0, 'Le support change, la fonction reste.'],
            ['Une satire peut manquer sa cible et blesser ceux qu’elle prétendait défendre.', ['Vrai', 'Faux'], 0, 'C’est sa limite : le rire doit viser ce qui mérite d’être combattu.'],
          ],
        },

        // ===================================================================
        // Chapitre 3 : Regarder le monde — Visions poétiques du monde
        // ===================================================================
        {
          titre: 'Le regard du poète sur le monde',
          axe: 'Regarder le monde, inventer des mondes — Visions poétiques du monde',
          lecon: {
            titre: 'Voir autrement ce que tout le monde voit',
            cours: `Le poète ne regarde pas des choses différentes : il regarde **différemment** les mêmes choses. Une rue, une fenêtre, un passant, une saison deviennent, dans un poème, l’occasion d’une découverte.

## Le poète, un voyant
Rimbaud écrit que « le poète se fait **voyant** ». Il ne se contente pas de décrire : il perçoit, sous l’apparence, des liens que le regard ordinaire ne voit pas. Baudelaire parle de **correspondances** — des échos secrets entre les parfums, les couleurs et les sons.

> « Les parfums, les couleurs et les sons se répondent. » (Baudelaire, *Correspondances*)

## Les thèmes du regard poétique
- La **nature** et les saisons, miroirs des états d’âme (le **lyrisme**).
- La **ville moderne**, ses foules, ses vitrines, ses solitudes (Apollinaire, Cendrars).
- Le **quotidien** et les objets humbles, que le poème rend soudain remarquables (Ponge, *Le Parti pris des choses*).
- Le **temps qui passe**, la fuite de la jeunesse, la mémoire.

## Les outils du poème
Le **vers** et la **strophe** découpent le texte autrement que la prose ; la **rime** et le **rythme** créent une musique ; les **images** — comparaison, métaphore, personnification — rapprochent des réalités éloignées. Un **enjambement** fait déborder la phrase d’un vers sur le suivant et surprend l’oreille.

## Formes fixes et vers libre
Le **sonnet** (deux quatrains, deux tercets) traverse cinq siècles. Le **calligramme** dessine avec les mots. Le **vers libre**, sans rime ni mètre régulier, laisse au rythme de la phrase le soin de faire poème. Aucune de ces formes n’est plus « poétique » qu’une autre : c’est l’usage qu’on en fait qui décide.

## Comment lire un poème
Repérer d’abord la **forme** (vers, strophes, rimes), puis les **images**, puis les **sonorités** (allitérations, assonances), enfin le **mouvement** du texte : d’où part-il, où arrive-t-il ? Un poème est un trajet, pas une liste.`,
          },
          questions: [
            ['Que veut dire Rimbaud quand il écrit que le poète « se fait voyant » ?', ['Il perçoit, sous l’apparence, des liens que le regard ordinaire ne voit pas', 'Il prédit l’avenir avec exactitude', 'Il décrit uniquement ce qu’il a vu de ses yeux', 'Il refuse de regarder le monde réel'], 0, 'Voir devient un travail, pas un don passif.'],
            ['Qu’appelle-t-on les « correspondances » chez Baudelaire ?', ['Des échos secrets entre parfums, couleurs et sons', 'Des lettres échangées entre poètes', 'Des rimes suivies', 'Des strophes de longueur égale'], 0, 'Le sonnet Correspondances en fait le programme.'],
            ['Quel recueil de Francis Ponge fait des objets humbles le sujet du poème ?', ['Le Parti pris des choses', 'Alcools', 'Les Fleurs du mal', 'Feuilles d’herbe'], 0, 'Le pain, l’huître, le cageot y deviennent remarquables.'],
            ['Qu’est-ce qu’un enjambement ?', ['La phrase déborde d’un vers sur le suivant', 'Deux vers riment entre eux', 'Un vers est répété à l’identique', 'Un vers compte douze syllabes'], 0, 'Le décalage entre phrase et vers surprend l’oreille.'],
            ['De quoi est composé un sonnet ?', ['Deux quatrains et deux tercets', 'Trois quatrains et un distique', 'Quatre tercets', 'Deux strophes de six vers'], 0, 'Quatorze vers au total.'],
            ['Qu’est-ce qu’un calligramme ?', ['Un poème dont la disposition dessine ce dont il parle', 'Un poème sans rime', 'Un poème en prose', 'Un poème de douze vers'], 0, 'Apollinaire en a fait un recueil entier.'],
            ['Qu’est-ce que le vers libre ?', ['Un vers sans rime ni mètre régulier', 'Un vers de onze syllabes', 'Un vers récité sans ponctuation', 'Un vers réservé au théâtre'], 0, 'Le rythme de la phrase y remplace le mètre.'],
            ['Une forme fixe est toujours plus poétique qu’un vers libre.', ['Vrai', 'Faux'], 1, 'C’est l’usage qu’on en fait qui décide, pas la forme elle-même.'],
          ],
        },
        {
          titre: 'Le poète métamorphose le monde',
          axe: 'Regarder le monde, inventer des mondes — Visions poétiques du monde',
          lecon: {
            titre: 'Quand l’image transforme la réalité',
            cours: `Le poème ne se contente pas de montrer le monde : il le **transforme**. Un objet banal devient monstre, un ciel devient mer, une ville devient corps. Cette transformation passe d’abord par les **images**.

## Les figures de la métamorphose
- La **comparaison** rapproche deux réalités avec un outil (« comme », « tel », « ressemble à »).
- La **métaphore** supprime l’outil et fait passer l’une pour l’autre : « la mer, ce grand miroir ».
- La **personnification** prête à une chose ou à un animal des traits humains : « le vent gémit ».
- L’**allégorie** représente une idée abstraite par une figure concrète : la Mort en faucheuse.
- L’**hyperbole** exagère jusqu’à créer une vision.

## Le pouvoir des mots
Les **sonorités** participent à la métamorphose : l’**allitération** (répétition de consonnes) et l’**assonance** (répétition de voyelles) installent une atmosphère. « Pour qui sont ces serpents qui sifflent sur nos têtes ? » : le sifflement est dans le vers avant d’être dans l’image.

> Le poème fait entendre ce qu’il décrit ; c’est ce qui le sépare d’une description ordinaire.

## Inventer d’autres mondes
Certains poètes ne transforment plus, ils **inventent**. Les **surréalistes** rapprochent des mots que rien ne rapprochait, écrivent sous la dictée du rêve, cherchent l’image qui étonne. Le merveilleux, le fantastique, l’ailleurs (l’*Invitation au voyage* de Baudelaire) ouvrent un monde parallèle où le désir peut enfin se dire.

## La force du rythme
Le **rythme** ne décore pas : il porte le sens. Un vers court accélère, un alexandrin ample déploie, une **anaphore** (même mot en tête de plusieurs vers) martèle. Un poème se lit donc à voix haute — l’oreille comprend souvent avant l’œil.

## Lire une métamorphose
Se demander, devant une image : **quelles deux réalités sont rapprochées ?** puis **qu’est-ce que ce rapprochement fait voir ?** Une métaphore réussie n’est pas un ornement : elle apporte une connaissance qu’aucune phrase littérale ne donnerait.`,
          },
          questions: [
            ['Quelle différence entre comparaison et métaphore ?', ['La comparaison garde un outil comme « comme », la métaphore le supprime', 'La comparaison est en vers, la métaphore en prose', 'La comparaison est toujours brève', 'Il n’y a aucune différence'], 0, 'La métaphore fait passer une réalité pour une autre, sans transition.'],
            ['Que fait une personnification ?', ['Elle prête des traits humains à une chose ou à un animal', 'Elle exagère une quantité', 'Elle répète un mot en tête de vers', 'Elle inverse l’ordre des mots'], 0, '« Le vent gémit » en est un exemple.'],
            ['Qu’est-ce qu’une allégorie ?', ['La représentation d’une idée abstraite par une figure concrète', 'Une comparaison filée sur deux vers', 'Un poème de quatorze vers', 'Une répétition de consonnes'], 0, 'La Mort représentée en faucheuse est l’exemple classique.'],
            ['Qu’est-ce qu’une allitération ?', ['La répétition d’une même consonne', 'La répétition d’une même voyelle', 'La répétition d’un mot en fin de vers', 'L’absence de ponctuation'], 0, 'L’assonance, elle, répète une voyelle.'],
            ['Que cherchent les surréalistes dans leurs images ?', ['Rapprocher des mots que rien ne rapprochait, pour étonner', 'Décrire le réel avec exactitude', 'Respecter les formes fixes anciennes', 'Écrire uniquement en alexandrins'], 0, 'Le rêve et le hasard y deviennent des méthodes.'],
            ['Qu’est-ce qu’une anaphore ?', ['La reprise d’un même mot en tête de plusieurs vers', 'Un vers de dix syllabes', 'Une rime intérieure', 'Une strophe de trois vers'], 0, 'Elle martèle et donne au poème une force d’insistance.'],
            ['Quelle question poser devant une image poétique ?', ['Quelles réalités sont rapprochées, et que ce rapprochement fait voir', 'Combien de syllabes compte le vers', 'Qui est l’éditeur du recueil', 'À quelle date le poème a été écrit'], 0, 'Une métaphore apporte une connaissance, pas un ornement.'],
            ['Le rythme d’un poème est un simple ornement sans effet sur le sens.', ['Vrai', 'Faux'], 1, 'Il porte le sens : un vers court accélère, une anaphore martèle.'],
          ],
        },

        // ===================================================================
        // Chapitre 4 : Agir sur le monde — Agir dans la cité : individu et pouvoir
        // ===================================================================
        {
          titre: 'L’art comme outil de dénonciation des horreurs de la guerre',
          axe: 'Agir sur le monde — Agir dans la cité : individu et pouvoir',
          lecon: {
            titre: 'Montrer l’insupportable pour qu’il cesse',
            cours: `Devant la guerre, l’art hésite entre deux tentations : **se taire**, parce que les mots semblent indignes, ou **montrer**, pour que personne ne puisse dire qu’il ne savait pas. La littérature et la peinture ont choisi le plus souvent de montrer.

## Les grandes œuvres de la dénonciation
Goya grave *Les Désastres de la guerre* et peint *Tres de Mayo* ; Picasso peint *Guernica* après le bombardement de la ville basque en 1937. En littérature, Voltaire décrit dans *Candide* une bataille en la nommant « boucherie héroïque » ; Barbusse (*Le Feu*), Genevoix (*Ceux de 14*), Céline racontent les tranchées ; Apollinaire, Aragon, Éluard écrivent la guerre en poèmes.

> *Guernica* ne montre ni avion, ni soldat, ni uniforme : la souffrance y suffit à désigner le crime.

## Les procédés de la dénonciation
- L’**ironie**, qui feint d’admirer ce qu’elle condamne (« boucherie héroïque »).
- Le **contraste** entre la beauté du décor et l’horreur des faits.
- L’**hyperbole** et l’**accumulation** de détails insoutenables.
- Le **point de vue** de la victime ou du simple soldat, jamais celui de l’état-major.
- Le **registre pathétique**, qui provoque la pitié, et le **registre polémique**, qui accuse.

## L’argument du témoin
Un texte de guerre tire souvent sa force de son **authenticité** : l’auteur y était. Le détail vrai — une odeur, un objet, un prénom — pèse plus lourd qu’une abstraction. C’est pourquoi le témoignage et la fiction se mêlent souvent dans ces œuvres.

## Ce que l’art peut, et ce qu’il ne peut pas
L’art n’arrête pas une guerre. Mais il **empêche l’oubli**, il **désigne les responsables**, il **rend une voix** à ceux qui n’en ont plus, et il transmet à ceux qui n’ont pas vécu l’événement quelque chose que les chiffres ne transmettent pas.

## Écrire après la catastrophe
Adorno a écrit qu’il serait « barbare d’écrire un poème après Auschwitz ». Les auteurs lui ont répondu en écrivant quand même — mais autrement : phrases nues, refus du lyrisme, méfiance envers les belles images. La forme elle-même devient une prise de position.`,
          },
          questions: [
            ['Quel tableau Picasso peint-il après le bombardement d’une ville basque en 1937 ?', ['Guernica', 'Les Désastres de la guerre', 'Le Radeau de la Méduse', 'La Liberté guidant le peuple'], 0, 'Il devient le symbole mondial de la dénonciation de la guerre.'],
            ['Quelle expression ironique Voltaire emploie-t-il dans Candide pour désigner une bataille ?', ['« boucherie héroïque »', '« belle journée »', '« art de la guerre »', '« champ d’honneur »'], 0, 'L’adjectif noble accolé au mot boucherie fait toute la charge.'],
            ['Quel roman de Barbusse raconte les tranchées de 1914-1918 ?', ['Le Feu', 'Le Silence de la mer', 'Les Misérables', 'La Peste'], 0, 'Il paraît en 1916, en pleine guerre.'],
            ['Quel procédé consiste à opposer la beauté du décor à l’horreur des faits ?', ['Le contraste', 'L’anaphore', 'La litote', 'L’ellipse'], 0, 'Le décalage rend l’horreur plus visible encore.'],
            ['Quel point de vue les œuvres de dénonciation adoptent-elles le plus souvent ?', ['Celui de la victime ou du simple soldat', 'Celui de l’état-major', 'Celui d’un historien du siècle suivant', 'Celui d’un journaliste neutre'], 0, 'Regarder d’en bas rend le crime tangible.'],
            ['Quel registre cherche à provoquer la pitié ?', ['Le registre pathétique', 'Le registre comique', 'Le registre didactique', 'Le registre épique'], 0, 'Le registre polémique, lui, accuse.'],
            ['Que peut l’art face à la guerre, selon le cours ?', ['Empêcher l’oubli et rendre une voix aux victimes', 'Arrêter les combats', 'Remplacer un traité de paix', 'Juger les responsables'], 0, 'Il n’arrête pas une guerre, mais il transmet ce que les chiffres ne transmettent pas.'],
            ['Après la Shoah, certains auteurs ont changé de forme : phrases nues, refus du lyrisme.', ['Vrai', 'Faux'], 0, 'La forme choisie devient elle-même une prise de position.'],
          ],
        },
        {
          titre: 'La littérature témoin de l’Histoire',
          axe: 'Agir sur le monde — Agir dans la cité : individu et pouvoir',
          lecon: {
            titre: 'L’écrivain engagé et sa parole',
            cours: `Un écrivain **engagé** met son écriture au service d’une cause : la justice, la liberté, la paix, l’égalité. Il ne quitte pas la littérature pour la politique — il fait de la littérature un moyen d’agir.

## Des exemples fondateurs
Victor Hugo attaque Napoléon III dans *Les Châtiments* depuis l’exil. Émile Zola publie en 1898 « **J’accuse…!** » à la une de *L’Aurore* pour défendre le capitaine Dreyfus, et paie sa prise de position d’un procès et d’un exil. Sous l’Occupation, Vercors publie clandestinement *Le Silence de la mer* ; Éluard fait circuler *Liberté*. Aimé Césaire, avec le *Cahier d’un retour au pays natal*, écrit contre le colonialisme.

> Un texte engagé se reconnaît à ce qu’il prend un **risque** : il désigne, il nomme, il s’expose.

## Les formes de l’engagement
- Le **pamphlet** et la **lettre ouverte**, frontaux.
- Le **poème de résistance**, qui se retient et circule à voix basse.
- Le **roman**, qui fait vivre une injustice de l’intérieur.
- Le **théâtre**, qui la met sous les yeux d’un public rassemblé.
- La **chanson**, qui la fait retenir par cœur.

## Les procédés de l’argumentation engagée
L’**apostrophe** interpelle (« Vous qui… »), l’**anaphore** martèle, la **question rhétorique** oblige le lecteur à répondre en lui-même, le **lexique du droit et de la vérité** pose l’auteur en accusateur, l’**alternance du je et du nous** transforme une voix en collectif.

## Directement ou par le détour ?
Deux stratégies s’opposent. **Dire directement** frappe fort mais expose à la censure et au procès. **Passer par la fiction** (fable, conte, science-fiction, apologue) protège l’auteur et laisse au lecteur le plaisir de comprendre seul. Le contexte historique décide souvent laquelle est possible.

## Et aujourd’hui
L’engagement littéraire n’a pas disparu : romans sur l’exil, théâtre documentaire, slam, bande dessinée de reportage. La question reste la même : comment faire qu’un lecteur, qui n’était pas là, ne puisse plus dire qu’il ne savait pas ?`,
          },
          questions: [
            ['Qu’est-ce qu’un écrivain engagé ?', ['Un auteur qui met son écriture au service d’une cause', 'Un auteur payé par un journal', 'Un auteur qui n’écrit que des essais', 'Un auteur membre d’un parti politique'], 0, 'Il fait de la littérature un moyen d’agir.'],
            ['Quel texte Zola publie-t-il en 1898 pour défendre le capitaine Dreyfus ?', ['« J’accuse…! »', '« Germinal »', '« Les Châtiments »', '« Le Silence de la mer »'], 0, 'Publié à la une de L’Aurore, il lui vaut un procès et l’exil.'],
            ['Contre qui Victor Hugo écrit-il Les Châtiments ?', ['Napoléon III', 'Louis XVI', 'Charles X', 'Napoléon Ier'], 0, 'Hugo écrit depuis l’exil, après le coup d’État de 1851.'],
            ['Quel récit Vercors publie-t-il clandestinement sous l’Occupation ?', ['Le Silence de la mer', 'La Peste', 'Le Feu', 'Antigone'], 0, 'Il paraît en 1942 aux Éditions de Minuit clandestines.'],
            ['Quel poète a écrit Liberté, diffusé sous l’Occupation ?', ['Paul Éluard', 'Arthur Rimbaud', 'Alfred de Musset', 'Francis Ponge'], 0, 'Le poème circule et est parachuté au-dessus de la France occupée.'],
            ['Quelle figure interpelle directement le destinataire ?', ['L’apostrophe', 'L’assonance', 'L’ellipse', 'L’euphémisme'], 0, '« Vous qui… » oblige le lecteur à se sentir visé.'],
            ['Quel est l’avantage du détour par la fiction ?', ['Il protège l’auteur et laisse au lecteur le plaisir de comprendre seul', 'Il permet d’écrire plus vite', 'Il évite d’avoir un point de vue', 'Il garantit le succès commercial'], 0, 'Dire directement frappe fort mais expose à la censure.'],
            ['Aimé Césaire écrit le Cahier d’un retour au pays natal contre le colonialisme.', ['Vrai', 'Faux'], 0, 'Le texte est l’un des fondements de la négritude.'],
          ],
        },

        // ===================================================================
        // Chapitre 5 : Questionnements complémentaires — Progrès et rêves
        //              scientifiques
        // ===================================================================
        {
          titre: 'La science, source d’espoirs et d’exaltation',
          axe: 'Questionnements complémentaires — Progrès et rêves scientifiques',
          lecon: {
            titre: 'Le siècle qui croyait au progrès',
            cours: `Au XIXe siècle, la science change le monde à vue d’œil : chemin de fer, électricité, vaccin, photographie, télégraphe. La littérature s’en empare et **rêve tout haut** de ce que l’avenir permettra.

## Le mot « progrès »
Le **progrès** désigne l’idée que l’humanité avance, que demain sera meilleur qu’hier grâce au savoir. Cette confiance porte le **positivisme** d’Auguste Comte, les grandes **Expositions universelles**, et une littérature qui célèbre l’ingénieur, l’explorateur, le savant.

> Hugo, dans *Plein Ciel*, voit dans le vol humain la promesse d’une humanité enfin libérée.

## Jules Verne et les Voyages extraordinaires
Jules Verne invente un genre : le **roman d’anticipation scientifique**. *Vingt Mille Lieues sous les mers*, *De la Terre à la Lune*, *Voyage au centre de la Terre* mêlent aventure, documentation technique et émerveillement. Ses machines sont décrites avec un sérieux d’ingénieur : le lecteur y croit parce que le texte explique.

## Les procédés de l’exaltation
- Le **champ lexical** de la lumière, de la conquête, de l’élan.
- L’**hyperbole** et l’**énumération** des inventions.
- Le **registre épique** : le savant devient un héros, la machine un personnage.
- Le **présent** ou le **futur** qui rendent l’avenir présent.
- Le **vocabulaire technique**, garant de vraisemblance.

## Utopies
L’**utopie** décrit une société idéale rendue possible par la raison et la technique : plus de faim, plus de maladie, plus de travail pénible. Elle sert moins à prédire qu’à **critiquer le présent** en montrant ce qu’il pourrait être.

## Ce que l’enthousiasme apprend
Ces textes ne sont pas naïfs : ils formulent un **désir**. Lire aujourd’hui l’enthousiasme du XIXe siècle, c’est mesurer ce que nous avons obtenu, ce que nous avons abandonné, et ce que nous continuons d’espérer de la science.`,
          },
          questions: [
            ['Que désigne l’idée de progrès au XIXe siècle ?', ['L’idée que l’humanité avance grâce au savoir', 'Le retour aux techniques anciennes', 'La croissance de la population', 'L’extension des empires coloniaux'], 0, 'Elle porte le positivisme et les Expositions universelles.'],
            ['Quel philosophe est associé au positivisme ?', ['Auguste Comte', 'Jean-Jacques Rousseau', 'Michel de Montaigne', 'Blaise Pascal'], 0, 'Il fonde la confiance de l’époque dans la science.'],
            ['Quel genre Jules Verne invente-t-il ?', ['Le roman d’anticipation scientifique', 'Le roman policier', 'Le roman épistolaire', 'La tragédie classique'], 0, 'Les Voyages extraordinaires en sont la série.'],
            ['Pourquoi les machines de Jules Verne paraissent-elles crédibles ?', ['Parce qu’elles sont décrites avec un sérieux d’ingénieur', 'Parce qu’elles ont vraiment existé', 'Parce qu’elles ne sont jamais décrites', 'Parce qu’elles sont magiques'], 0, 'Le texte explique le fonctionnement : le lecteur y croit.'],
            ['Quel registre transforme le savant en héros ?', ['Le registre épique', 'Le registre pathétique', 'Le registre satirique', 'Le registre didactique'], 0, 'La machine y devient un personnage à part entière.'],
            ['Qu’est-ce qu’une utopie ?', ['La description d’une société idéale rendue possible par la raison', 'Un récit de catastrophe', 'Une autobiographie d’ingénieur', 'Un poème en vers libres'], 0, 'Elle critique le présent en montrant ce qu’il pourrait être.'],
            ['Quel champ lexical domine les textes exaltant le progrès ?', ['La lumière, la conquête, l’élan', 'L’ombre, la ruine, le froid', 'La faim, la maladie, la peur', 'Le silence, l’attente, l’ennui'], 0, 'Le vocabulaire porte l’enthousiasme.'],
            ['L’utopie sert surtout à prédire exactement l’avenir.', ['Vrai', 'Faux'], 1, 'Elle sert d’abord à critiquer le présent.'],
          ],
        },
        {
          titre: 'La science, source de désillusion et d’inquiétudes',
          axe: 'Questionnements complémentaires — Progrès et rêves scientifiques',
          lecon: {
            titre: 'Quand le savant crée ce qu’il ne maîtrise plus',
            cours: `Au même moment que l’enthousiasme naît l’**inquiétude**. Et si le savoir servait à détruire ? Et si la machine remplaçait l’homme ? Et si le savant créait ce qu’il ne pourrait plus arrêter ?

## Frankenstein, le récit fondateur
En 1818, Mary Shelley publie *Frankenstein ou le Prométhée moderne* : un étudiant en sciences donne la vie à une créature, puis la rejette. Le monstre n’est pas mauvais par nature ; il le devient parce qu’il est abandonné. Le sous-titre dit tout : Prométhée, dans le mythe grec, vole le feu aux dieux — et il est puni.

> La question de Shelley n’est pas « peut-on le faire ? » mais « **doit-on** le faire ? ».

## La contre-utopie
La **contre-utopie** (ou **dystopie**) décrit une société parfaitement organisée… et invivable. *Le Meilleur des mondes* d’Aldous Huxley (1932) fabrique des humains sur mesure et supprime la souffrance en supprimant la liberté. *1984* d’Orwell (1949) invente une surveillance totale et une langue appauvrie pour rendre la révolte impensable. *Fahrenheit 451* de Bradbury brûle les livres.

## Le savant fou et l’apprenti sorcier
La figure du **savant fou** traverse le fantastique (*Docteur Jekyll et Mister Hyde*, *L’Île du docteur Moreau*). Celle de l’**apprenti sorcier** dit le même danger : déclencher un processus qu’on ne sait plus arrêter. Après 1945, la bombe atomique donne à ces récits une réalité brutale.

## Les procédés de l’inquiétude
- Le **registre fantastique** et le doute qu’il installe.
- Le **champ lexical** de la nuit, du froid, de l’enfermement.
- L’**anticipation** d’un futur proche, donc crédible.
- Le **retournement** : l’invention se retourne contre son inventeur.
- L’**ironie** d’un monde qui se dit heureux.

## Une question toujours ouverte
Ces textes ne sont pas contre la science : ils demandent qui la contrôle, pour quoi et à quel prix. Intelligence artificielle, manipulations génétiques, données personnelles, climat : les questions posées par Shelley, Huxley et Orwell n’ont pas vieilli.`,
          },
          questions: [
            ['Qui a écrit Frankenstein ou le Prométhée moderne, publié en 1818 ?', ['Mary Shelley', 'Jules Verne', 'Bram Stoker', 'H. G. Wells'], 0, 'Elle a une vingtaine d’années lorsqu’elle l’écrit.'],
            ['Pourquoi la créature de Frankenstein devient-elle violente ?', ['Parce qu’elle est rejetée et abandonnée', 'Parce qu’elle est née mauvaise', 'Parce qu’elle est mal construite', 'Parce qu’elle est privée de nourriture'], 0, 'Le roman déplace la faute du monstre vers son créateur.'],
            ['À quel personnage mythologique le sous-titre du roman renvoie-t-il ?', ['Prométhée, qui vole le feu aux dieux', 'Icare, qui vole trop près du soleil', 'Sisyphe et son rocher', 'Ulysse et son voyage'], 0, 'Comme lui, le savant est puni de son audace.'],
            ['Qu’est-ce qu’une contre-utopie ?', ['La description d’une société parfaitement organisée mais invivable', 'Le récit d’une société idéale et heureuse', 'Une autobiographie de savant', 'Un poème sur la nature'], 0, 'On l’appelle aussi dystopie.'],
            ['Que supprime la société du Meilleur des mondes pour supprimer la souffrance ?', ['La liberté', 'La science', 'La musique', 'Le langage écrit'], 0, 'Le bonheur y est fabriqué au prix du choix.'],
            ['Quel roman d’Orwell invente une surveillance totale et une langue appauvrie ?', ['1984', 'Fahrenheit 451', 'La Ferme des animaux', 'Le Meilleur des mondes'], 0, 'La novlangue y rend la révolte littéralement impensable.'],
            ['Que fait-on des livres dans Fahrenheit 451 de Bradbury ?', ['On les brûle', 'On les réécrit', 'On les traduit', 'On les vend'], 0, 'Le titre désigne la température d’inflammation du papier.'],
            ['Ces récits sont des textes hostiles à toute science.', ['Vrai', 'Faux'], 1, 'Ils demandent qui la contrôle, pour quoi et à quel prix.'],
          ],
        },

        // ===================================================================
        // Chapitre 6 : Outils d’analyse littéraire
        // ===================================================================
        {
          titre: 'Les différents types de discours',
          axe: 'Outils d’analyse littéraire',
          lecon: {
            titre: 'Rapporter les paroles : direct, indirect, narrativisé',
            cours: `Quand un récit fait parler ses personnages, il doit choisir **comment** rapporter leurs paroles. Ce choix change tout : la vivacité de la scène, la distance du narrateur, la place du lecteur.

## Le discours direct
Les paroles sont rapportées **telles quelles**, entre guillemets ou après un tiret, avec un **verbe de parole** (« dit-il », « répondit-elle »). Le temps et les personnes sont ceux du personnage.
- *Il dit : « Je pars demain. »*
- Effet : **vivacité**, présence, on entend la voix.

## Le discours indirect
Les paroles sont **intégrées** à la phrase du narrateur, dans une **subordonnée** introduite par « que », « si », « ce que ». Guillemets et tirets disparaissent ; les temps, les personnes et les repères de temps et de lieu **changent**.
- *Il dit qu’il partait le lendemain.*
- « je » devient « il », le présent devient l’imparfait, « demain » devient « le lendemain ».

## Le discours indirect libre
Ni guillemets, ni « que » : la parole du personnage **traverse** le récit du narrateur. Les temps sont ceux du discours indirect, mais l’exclamation, l’interrogation et le vocabulaire restent ceux du personnage.
- *Il fallait partir. Demain ? Non, il n’aurait jamais le courage.*
- Effet : on ne sait plus **qui parle**, du personnage ou du narrateur — c’est l’outil favori de Flaubert.

## Le discours narrativisé
La parole est **résumée** par un simple verbe, sans être rapportée.
- *Il annonça son départ.*
- Effet : rapidité, mise à distance.

## Ce qu’il faut savoir transposer
Passer du direct à l’indirect suppose de modifier :
- les **personnes** (je → il) ;
- les **temps** (présent → imparfait, passé composé → plus-que-parfait, futur → conditionnel) ;
- les **indicateurs** (aujourd’hui → ce jour-là, hier → la veille, ici → là) ;
- la **ponctuation expressive**, qui disparaît au discours indirect.

> Au brevet, la question porte presque toujours sur l’**effet** produit, pas seulement sur le nom du procédé.`,
          },
          questions: [
            ['Quel discours rapporte les paroles telles quelles, entre guillemets ?', ['Le discours direct', 'Le discours indirect', 'Le discours indirect libre', 'Le discours narrativisé'], 0, 'Un verbe de parole l’introduit ou le suit.'],
            ['Comment les paroles sont-elles intégrées au discours indirect ?', ['Dans une subordonnée introduite par « que » ou « si »', 'Entre guillemets', 'Après un tiret', 'En italique sans lien grammatical'], 0, 'Elles dépendent grammaticalement de la phrase du narrateur.'],
            ['Au discours indirect, en quoi se transforme un présent ?', ['En imparfait', 'En passé simple', 'En futur', 'Il reste au présent'], 0, 'La concordance des temps s’applique.'],
            ['Que devient « demain » au discours indirect ?', ['« le lendemain »', '« aujourd’hui »', '« la veille »', '« ce jour-là »'], 0, 'Les repères de temps sont recalculés depuis le récit.'],
            ['Quelle est la particularité du discours indirect libre ?', ['Ni guillemets ni « que » : on ne sait plus qui parle', 'Il emploie toujours le présent', 'Il exige un verbe de parole', 'Il est réservé au théâtre'], 0, 'Flaubert en a fait son outil de prédilection.'],
            ['Qu’est-ce que le discours narrativisé ?', ['La parole résumée par un simple verbe, sans être rapportée', 'La parole rapportée mot à mot', 'Un dialogue sans ponctuation', 'Un monologue intérieur'], 0, '« Il annonça son départ » en est un exemple.'],
            ['Quel effet principal produit le discours direct ?', ['La vivacité : on entend la voix du personnage', 'La mise à distance', 'Le résumé rapide', 'La confusion des voix'], 0, 'Le lecteur assiste à la scène.'],
            ['La ponctuation expressive disparaît au passage au discours indirect.', ['Vrai', 'Faux'], 0, 'Points d’exclamation et d’interrogation ne survivent pas à la subordination.'],
          ],
        },
        {
          titre: 'Les différences de focalisation dans un texte',
          axe: 'Outils d’analyse littéraire',
          lecon: {
            titre: 'Par quels yeux le lecteur voit-il l’histoire ?',
            cours: `La **focalisation** — ou point de vue narratif — désigne la **quantité d’information** que le narrateur donne au lecteur, et par quels yeux il la fait passer. Il ne faut pas la confondre avec la personne grammaticale : un récit à la première personne peut adopter plusieurs focalisations.

## La focalisation zéro (narrateur omniscient)
Le narrateur **sait tout** : le passé, l’avenir, les pensées de tous les personnages, ce qui se passe en même temps ailleurs. Il peut commenter, juger, annoncer.
- Indices : accès aux pensées de **plusieurs** personnages, informations qu’aucun d’eux ne possède.
- Effet : le lecteur **domine** l’histoire ; c’est le point de vue du roman du XIXe siècle (Balzac, Hugo).

## La focalisation interne
Le récit passe par les yeux d’**un seul** personnage : on ne sait que ce qu’il sait, on ne voit que ce qu’il voit, on ignore ce qu’il ignore.
- Indices : verbes de perception et de pensée (« il crut voir », « il lui sembla »), hypothèses, zones d’ombre.
- Effet : **identification** et **suspense** — le lecteur découvre en même temps que le personnage. C’est le point de vue du fantastique et du policier.

## La focalisation externe
Le narrateur se comporte comme une **caméra** : il enregistre les gestes, les paroles, les décors, sans entrer dans aucune conscience.
- Indices : aucun accès aux pensées, description behavioriste, hypothèses laissées au lecteur.
- Effet : **mystère**, neutralité, parfois inquiétude — on voit sans comprendre.

## Pourquoi cela compte
Changer de focalisation change le sens d’une scène. Une même dispute racontée en focalisation interne par l’un puis par l’autre donne deux vérités différentes. Un roman peut **alterner** les points de vue d’un chapitre à l’autre : le lecteur reconstitue alors le puzzle.

> Question type : « Quel est le point de vue adopté ? Justifiez, puis dites ce qu’il produit. » La justification se fait toujours par un **relevé** dans le texte.`,
          },
          questions: [
            ['Que désigne la focalisation ?', ['La quantité d’information donnée au lecteur et par quels yeux elle passe', 'Le temps verbal dominant du récit', 'Le nombre de personnages', 'La longueur des chapitres'], 0, 'Elle ne se confond pas avec la personne grammaticale.'],
            ['Quel point de vue permet de connaître les pensées de tous les personnages ?', ['La focalisation zéro', 'La focalisation interne', 'La focalisation externe', 'Le discours indirect libre'], 0, 'Le narrateur omniscient sait tout, y compris l’avenir.'],
            ['Quel point de vue crée le plus d’identification et de suspense ?', ['La focalisation interne', 'La focalisation zéro', 'La focalisation externe', 'Le discours narrativisé'], 0, 'Le lecteur découvre en même temps que le personnage.'],
            ['Quels indices signalent une focalisation interne ?', ['Les verbes de perception comme « il lui sembla »', 'Les commentaires du narrateur sur l’avenir', 'L’absence totale de pensées', 'La présence de dialogues'], 0, 'Le doute du personnage devient celui du lecteur.'],
            ['À quoi compare-t-on souvent la focalisation externe ?', ['À une caméra', 'À un miroir', 'À un journal intime', 'À une lettre'], 0, 'Elle enregistre gestes et paroles sans entrer dans les consciences.'],
            ['Quel genre utilise volontiers la focalisation interne ?', ['Le fantastique et le policier', 'Le manuel scolaire', 'La notice technique', 'Le dictionnaire'], 0, 'L’ignorance du personnage fait le suspense.'],
            ['Que produit l’alternance des points de vue dans un roman ?', ['Le lecteur reconstitue le puzzle à partir de vérités partielles', 'Le récit devient impossible à suivre', 'Le narrateur disparaît', 'Le texte perd sa chronologie'], 0, 'Une même scène change de sens selon les yeux qui la voient.'],
            ['Un récit à la première personne est forcément en focalisation interne.', ['Vrai', 'Faux'], 1, 'La personne grammaticale et la focalisation sont deux choses distinctes.'],
          ],
        },
        {
          titre: 'Les valeurs du présent, du passé simple, de l’imparfait et du futur',
          axe: 'Outils d’analyse littéraire',
          lecon: {
            titre: 'Ce qu’un temps verbal fait au sens',
            cours: `Un temps verbal ne dit pas seulement **quand** : il dit aussi **comment** l’action est vue — brève ou durable, unique ou répétée, achevée ou en cours. C’est ce qu’on appelle ses **valeurs**.

## Les valeurs du présent
- **Présent d’énonciation** : au moment où l’on parle (« je t’écoute »).
- **Présent de narration** : un récit au passé bascule au présent pour rendre une scène plus vivante.
- **Présent de vérité générale** : ce qui vaut toujours (« l’eau bout à 100 °C »).
- **Présent d’habitude** : une action répétée (« il court tous les matins »).
- **Présent à valeur de passé ou de futur proche** : « j’arrive », « il sort à l’instant ».

## Les valeurs du passé simple
Temps du **récit écrit**, il présente une action **brève**, **achevée**, qui fait **avancer l’histoire**. Il pose les événements de premier plan, les uns après les autres.
- *Il ouvrit la porte, entra, s’assit.*

## Les valeurs de l’imparfait
Temps de l’**arrière-plan**, il présente une action **en cours**, **durable** ou **répétée**.
- **Imparfait descriptif** : le décor, le portrait.
- **Imparfait d’habitude** : « chaque été, nous partions… ».
- **Imparfait de rupture** : une action longue interrompue par un passé simple.
- **Imparfait dans l’hypothèse** : « si j’avais le temps… ».

> Le couple imparfait / passé simple est le moteur du récit : le décor dure, l’événement surgit.

## Les valeurs du futur
- **Futur simple** : ce qui arrivera, une prédiction, une promesse.
- **Futur antérieur** : une action achevée avant une autre à venir.
- **Futur de politesse ou d’atténuation** : « je vous demanderai de patienter ».
- **Futur historique** : dans un récit au passé, il annonce une suite (« il deviendra empereur »).

## Méthode d’analyse
Repérer d’abord le temps **dominant**, puis les **ruptures** : c’est presque toujours au moment où le texte change de temps que quelque chose d’important se produit.`,
          },
          questions: [
            ['Quel présent rend une scène de récit plus vivante ?', ['Le présent de narration', 'Le présent de vérité générale', 'Le présent d’habitude', 'Le présent d’énonciation'], 0, 'Le récit au passé bascule brusquement au présent.'],
            ['Quelle valeur a le présent dans « l’eau bout à 100 °C » ?', ['Vérité générale', 'Énonciation', 'Habitude', 'Futur proche'], 0, 'L’énoncé vaut en tout temps.'],
            ['Que présente le passé simple ?', ['Une action brève et achevée qui fait avancer le récit', 'Une action en cours et durable', 'Une action répétée chaque jour', 'Une action hypothétique'], 0, 'C’est le temps du premier plan.'],
            ['Quel temps installe le décor et l’arrière-plan du récit ?', ['L’imparfait', 'Le passé simple', 'Le passé antérieur', 'Le futur simple'], 0, 'Il présente une action en cours, durable ou répétée.'],
            ['Que décrit un imparfait de rupture ?', ['Une action longue interrompue par un passé simple', 'Une action instantanée', 'Une action future', 'Une action impossible'], 0, '« Il dormait quand le téléphone sonna. »'],
            ['Qu’exprime le futur antérieur ?', ['Une action achevée avant une autre action à venir', 'Une action en cours dans le futur', 'Une action répétée dans le passé', 'Une hypothèse irréelle'], 0, '« Quand tu arriveras, j’aurai terminé. »'],
            ['Que signale un futur historique dans un récit au passé ?', ['Il annonce une suite que le lecteur ignore encore', 'Il marque une hypothèse', 'Il exprime la politesse', 'Il décrit une habitude'], 0, '« Cet enfant deviendra empereur. »'],
            ['Un changement de temps dans un texte est rarement significatif.', ['Vrai', 'Faux'], 1, 'C’est souvent au moment de la rupture que l’essentiel se produit.'],
          ],
        },
        {
          titre: 'Les principales figures de style',
          axe: 'Outils d’analyse littéraire',
          lecon: {
            titre: 'Nommer un procédé, et dire ce qu’il fait',
            cours: `Une **figure de style** est un écart volontaire par rapport à l’expression ordinaire, destiné à produire un **effet**. Les nommer ne suffit pas : au brevet, il faut toujours dire **ce qu’elles produisent**.

## Les figures d’analogie
- **Comparaison** : rapproche deux réalités avec un outil (« comme », « tel », « semblable à »).
- **Métaphore** : même rapprochement, sans outil (« cet homme est un lion »).
- **Personnification** : prête des traits humains à une chose ou à un animal.
- **Allégorie** : représente une idée abstraite par une figure concrète.

## Les figures d’insistance
- **Hyperbole** : exagération (« mourir de rire »).
- **Anaphore** : reprise du même mot en tête de plusieurs vers ou phrases.
- **Gradation** : termes de force croissante ou décroissante.
- **Accumulation** : longue énumération qui écrase.
- **Répétition** et **pléonasme**.

## Les figures d’atténuation
- **Litote** : dire moins pour suggérer plus (« ce n’est pas mauvais » = c’est très bon).
- **Euphémisme** : adoucir une réalité pénible (« il nous a quittés »).

## Les figures d’opposition
- **Antithèse** : deux termes opposés dans la même phrase.
- **Oxymore** : deux termes contradictoires accolés (« une obscure clarté »).
- **Chiasme** : construction croisée (A-B-B-A).
- **Antiphrase** : dire le contraire de ce que l’on pense — moteur de l’ironie.

## Les figures de construction et de sonorité
- **Parallélisme** : deux structures identiques.
- **Ellipse** : suppression d’un mot attendu.
- **Allitération** (consonnes) et **assonance** (voyelles).
- **Périphrase** : dire en plusieurs mots ce qu’un seul dirait (« l’astre du jour »).
- **Métonymie** : nommer par un lien logique (« boire un verre »).

> Méthode en trois temps : **je repère** (je cite), **je nomme** (la figure), **j’interprète** (l’effet dans ce texte-ci).`,
          },
          questions: [
            ['Qu’est-ce qu’un oxymore ?', ['Deux termes contradictoires accolés', 'Deux termes opposés dans la même phrase', 'Une exagération', 'Une répétition en début de vers'], 0, '« Une obscure clarté » de Corneille en est l’exemple type.'],
            ['Qu’est-ce qu’une litote ?', ['Dire moins pour suggérer plus', 'Exagérer volontairement', 'Adoucir une réalité pénible', 'Répéter un mot'], 0, '« Ce n’est pas mauvais » signifie « c’est excellent ».'],
            ['Quelle figure adoucit une réalité pénible ?', ['L’euphémisme', 'L’hyperbole', 'L’anaphore', 'Le chiasme'], 0, '« Il nous a quittés » pour « il est mort ».'],
            ['Qu’est-ce qu’un chiasme ?', ['Une construction croisée de type A-B-B-A', 'Une répétition en tête de phrase', 'Une énumération croissante', 'Une suppression de mot'], 0, 'Le croisement met les termes en miroir.'],
            ['Qu’est-ce qu’une gradation ?', ['Une suite de termes de force croissante ou décroissante', 'Deux structures identiques', 'Une comparaison sans outil', 'Une répétition de consonnes'], 0, 'Elle fait monter ou retomber l’intensité.'],
            ['Qu’est-ce qu’une métonymie ?', ['Nommer une chose par un lien logique, comme « boire un verre »', 'Comparer deux réalités avec « comme »', 'Répéter une voyelle', 'Supprimer un mot attendu'], 0, 'Le contenant désigne le contenu.'],
            ['Qu’est-ce qu’une périphrase ?', ['Dire en plusieurs mots ce qu’un seul suffirait à dire', 'Employer un mot pour un autre par ironie', 'Répéter la même structure', 'Opposer deux termes'], 0, '« L’astre du jour » pour « le soleil ».'],
            ['Nommer une figure suffit pour répondre à une question de brevet.', ['Vrai', 'Faux'], 1, 'Il faut repérer, nommer, puis interpréter l’effet produit.'],
          ],
        },
        {
          titre: 'Construire une argumentation',
          axe: 'Outils d’analyse littéraire',
          lecon: {
            titre: 'Thèse, arguments, exemples : la charpente',
            cours: `**Argumenter**, c’est défendre une **opinion** en donnant des **raisons** de la partager. Un texte argumentatif se reconnaît à trois pièces : une **thèse**, des **arguments**, des **exemples**.

## Les trois pièces
- La **thèse** est l’opinion défendue. Elle peut être annoncée d’emblée ou apparaître à la fin.
- L’**argument** est la raison qui la soutient : c’est une **idée**, pas un fait.
- L’**exemple** illustre l’argument : c’est un **fait précis** (une œuvre, une expérience, un chiffre, une anecdote).

> Un argument sans exemple reste abstrait ; un exemple sans argument ne prouve rien.

## Thèse et contre-thèse
La **thèse adverse** (ou contre-thèse) est l’opinion que l’on combat. La **concession** consiste à lui reconnaître une part de vérité (« certes… ») avant de la réfuter (« mais… ») : loin d’affaiblir le texte, elle le renforce, parce qu’elle montre qu’on a compris l’autre camp.

## Les connecteurs logiques
Ils rendent le raisonnement lisible :
- **addition** : de plus, en outre, par ailleurs ;
- **cause** : car, en effet, parce que ;
- **conséquence** : donc, ainsi, par conséquent ;
- **opposition** : mais, cependant, néanmoins, toutefois ;
- **concession** : certes, bien sûr, il est vrai que ;
- **conclusion** : enfin, en somme, pour conclure.

## Convaincre ou persuader
**Convaincre** s’adresse à la raison : logique, preuves, chiffres, exemples vérifiables. **Persuader** s’adresse aux sentiments : images, émotion, apostrophe, question rhétorique, engagement de la personne. Les meilleurs textes font les deux.

## Les formes de l’argumentation
- **Directe** : essai, article, lettre ouverte, discours — l’auteur dit ce qu’il pense.
- **Indirecte** : fable, conte, apologue, théâtre — l’auteur fait comprendre par une histoire.

## Construire un paragraphe
Une idée par paragraphe, dans cet ordre : **argument** → **exemple** → **explication de l’exemple**. Sans la troisième étape, le lecteur ne voit pas le lien, et l’exemple reste décoratif.`,
          },
          questions: [
            ['Qu’est-ce que la thèse d’un texte argumentatif ?', ['L’opinion défendue par l’auteur', 'Le fait précis qui illustre une idée', 'Le mot de liaison entre deux idées', 'La conclusion du dernier paragraphe'], 0, 'Elle peut être annoncée d’emblée ou n’apparaître qu’à la fin.'],
            ['Quelle différence entre un argument et un exemple ?', ['L’argument est une idée, l’exemple est un fait précis', 'L’argument est court, l’exemple est long', 'L’argument est écrit, l’exemple est oral', 'Il n’y a aucune différence'], 0, 'L’un raisonne, l’autre illustre.'],
            ['Qu’est-ce qu’une concession ?', ['Reconnaître une part de vérité à la thèse adverse avant de la réfuter', 'Abandonner sa propre thèse', 'Répéter l’argument principal', 'Conclure sans argument'], 0, 'Elle renforce le texte au lieu de l’affaiblir.'],
            ['Quel connecteur exprime la conséquence ?', ['Par conséquent', 'Cependant', 'En effet', 'Certes'], 0, '« Donc » et « ainsi » jouent le même rôle.'],
            ['Quel connecteur introduit une concession ?', ['Certes', 'Donc', 'De plus', 'Enfin'], 0, 'Il annonce un « mais » à venir.'],
            ['Quelle différence entre convaincre et persuader ?', ['Convaincre s’adresse à la raison, persuader aux sentiments', 'Convaincre est écrit, persuader est oral', 'Convaincre est long, persuader est bref', 'Les deux mots sont synonymes'], 0, 'Les meilleurs textes combinent les deux.'],
            ['Qu’est-ce qu’une argumentation indirecte ?', ['Faire comprendre une thèse par une histoire, comme la fable', 'Écrire une lettre ouverte', 'Publier un essai', 'Prononcer un discours'], 0, 'L’apologue en est la forme la plus classique.'],
            ['Dans un paragraphe argumenté, l’exemple se suffit à lui-même.', ['Vrai', 'Faux'], 1, 'Sans explication du lien, l’exemple reste décoratif.'],
          ],
        },
        {
          titre: 'Le vocabulaire de la poésie',
          axe: 'Outils d’analyse littéraire',
          lecon: {
            titre: 'Les mots pour parler d’un poème',
            cours: `Analyser un poème demande un vocabulaire précis. Ces mots ne sont pas des ornements d’examen : ils permettent de dire **exactement** ce que le texte fait.

## Le vers et sa mesure
Un **vers** se mesure en **syllabes**. Les mètres les plus courants :
- **octosyllabe** : 8 syllabes ;
- **décasyllabe** : 10 syllabes ;
- **alexandrin** : 12 syllabes.
Le **e** en fin de mot compte s’il est suivi d’une consonne, mais pas devant une voyelle ni en fin de vers. La **diérèse** sépare en deux syllabes ce qu’on prononce d’ordinaire en une (« pas-si-on »).

## Les strophes
- **distique** : 2 vers ; **tercet** : 3 ; **quatrain** : 4 ; **quintil** : 5 ; **sizain** : 6.
- Un **sonnet** compte deux quatrains et deux tercets.

## Les rimes
- **Disposition** : **plates** (AABB), **croisées** (ABAB), **embrassées** (ABBA).
- **Richesse** : **pauvre** (un son commun), **suffisante** (deux), **riche** (trois ou plus).
- **Genre** : **féminine** (se termine par un *e* muet), **masculine** (sinon).

## Le rythme
La **césure** coupe le vers (l’alexandrin classique se coupe en deux **hémistiches** de 6). L’**enjambement** fait déborder la phrase sur le vers suivant ; le **rejet** place un mot bref au début du vers suivant ; le **contre-rejet** l’annonce à la fin du vers précédent.

## Les sonorités
**Allitération** (consonne répétée), **assonance** (voyelle répétée), **harmonie imitative** (les sons imitent ce qu’ils décrivent), **paronomase** (mots de sonorités proches).

## Les formes
**Sonnet**, **ode**, **ballade**, **fable**, **calligramme**, **poème en prose**, **vers libre**. Le **lyrisme** exprime les sentiments personnels ; le registre **élégiaque** dit la plainte et le deuil ; le registre **épique** amplifie et grandit.

> Devant un poème : compter d’abord, écouter ensuite, interpréter enfin.`,
          },
          questions: [
            ['Combien de syllabes compte un alexandrin ?', ['12', '10', '8', '14'], 0, 'Le décasyllabe en compte 10, l’octosyllabe 8.'],
            ['Comment s’appelle une strophe de quatre vers ?', ['Un quatrain', 'Un tercet', 'Un distique', 'Un sizain'], 0, 'Le sonnet en compte deux, suivis de deux tercets.'],
            ['Quelle est la disposition des rimes croisées ?', ['ABAB', 'AABB', 'ABBA', 'AAAB'], 0, 'Les rimes plates sont AABB, les embrassées ABBA.'],
            ['Qu’est-ce qu’une rime riche ?', ['Une rime qui partage au moins trois sons', 'Une rime qui partage un seul son', 'Une rime de fin de strophe', 'Une rime entre deux vers éloignés'], 0, 'La rime pauvre n’en partage qu’un, la suffisante deux.'],
            ['Qu’est-ce qu’un hémistiche ?', ['Chacune des deux moitiés d’un alexandrin séparées par la césure', 'Une strophe de six vers', 'Une rime intérieure', 'Un vers sans rime'], 0, 'La césure classique tombe après la sixième syllabe.'],
            ['Qu’est-ce qu’un rejet ?', ['Un mot bref renvoyé au début du vers suivant', 'Une rime supprimée', 'Une strophe isolée', 'Un vers répété'], 0, 'Le contre-rejet, lui, l’annonce à la fin du vers précédent.'],
            ['Qu’est-ce qu’une diérèse ?', ['Prononcer en deux syllabes ce qu’on dit d’ordinaire en une', 'Supprimer une syllabe', 'Répéter une voyelle', 'Couper un vers en deux'], 0, 'Elle sert souvent à obtenir le compte exact du mètre.'],
            ['Une rime est dite féminine lorsqu’elle se termine par un e muet.', ['Vrai', 'Faux'], 0, 'Toutes les autres sont dites masculines.'],
          ],
        },
        {
          titre: 'Le vocabulaire du théâtre',
          axe: 'Outils d’analyse littéraire',
          lecon: {
            titre: 'Le texte, la scène et le spectateur',
            cours: `Une pièce de théâtre est un texte **écrit pour être joué**. Son vocabulaire distingue toujours deux plans : ce qui est **écrit** et ce qui se **passe sur scène**.

## La structure de la pièce
- **Acte** : grande partie, souvent marquée par un changement de lieu ou de temps.
- **Scène** : subdivision d’un acte ; on change de scène quand un personnage entre ou sort.
- **Tableau** : dans le théâtre moderne, une unité qui remplace l’acte.
- **Exposition** : les premières scènes, qui posent le lieu, les personnages et l’intrigue.
- **Nœud**, **péripéties**, **coup de théâtre**, **dénouement** : les étapes de l’action.

## Les formes de parole
- **Réplique** : ce que dit un personnage.
- **Tirade** : longue réplique ininterrompue.
- **Monologue** : un personnage seul parle à voix haute.
- **Stichomythie** : échange de répliques très brèves, une par vers ou par ligne.
- **Aparté** : ce qu’un personnage dit à part, entendu du public mais pas des autres personnages.
- **Didascalie** : indication scénique qui n’est pas prononcée (décor, gestes, ton).

## La double énonciation
Au théâtre, un personnage parle à un autre personnage **et** au public en même temps : c’est la **double énonciation**. Elle explique qu’un personnage puisse rappeler une information que son interlocuteur connaît déjà — c’est le spectateur qui l’ignore.

> L’**ironie tragique** naît quand le spectateur sait ce que le personnage ignore.

## Les genres
- La **tragédie** : personnages nobles, destin, fin malheureuse ; règles classiques des trois unités (action, lieu, temps).
- La **comédie** : personnages ordinaires, fin heureuse, correction des mœurs par le rire.
- Le **drame romantique** : mélange des registres, refus des règles (Hugo).
- Le **théâtre de l’absurde** : langage en panne, action réduite (Ionesco, Beckett).

## Les ressorts du comique
**Comique de mots** (jeux de langage, répétitions), **de gestes** (chutes, coups), **de situation** (quiproquo, malentendu), **de caractère** (le défaut poussé à l’extrême), **de répétition**.`,
          },
          questions: [
            ['Qu’est-ce qu’une didascalie ?', ['Une indication scénique qui n’est pas prononcée', 'Une longue réplique', 'Un échange rapide de répliques', 'Une scène finale'], 0, 'Elle indique décor, gestes, ton ou déplacements.'],
            ['Qu’est-ce qu’un aparté ?', ['Une parole entendue du public mais pas des autres personnages', 'Un monologue de fin d’acte', 'Une réplique de plus de dix vers', 'Une indication de décor'], 0, 'Le spectateur devient complice.'],
            ['Qu’est-ce qu’une stichomythie ?', ['Un échange de répliques très brèves', 'Une réplique longue et ininterrompue', 'Un discours adressé au public', 'Une scène sans parole'], 0, 'Elle accélère le rythme et marque souvent l’affrontement.'],
            ['Qu’appelle-t-on la double énonciation ?', ['Un personnage parle à un autre et au public en même temps', 'Deux personnages parlent ensemble', 'Une réplique répétée deux fois', 'Un texte joué deux soirs de suite'], 0, 'Elle explique les informations rappelées pour le seul spectateur.'],
            ['Que posent les scènes d’exposition ?', ['Le lieu, les personnages et l’intrigue', 'Le dénouement', 'La morale de la pièce', 'La liste des accessoires'], 0, 'Elles donnent au spectateur ce qu’il doit savoir pour suivre.'],
            ['Quelles sont les trois unités de la tragédie classique ?', ['Action, lieu, temps', 'Acte, scène, tableau', 'Décor, costume, lumière', 'Auteur, acteur, public'], 0, 'Le drame romantique les rejette explicitement.'],
            ['Qu’est-ce qu’un quiproquo ?', ['Un malentendu qui fait prendre une chose ou une personne pour une autre', 'Une répétition de mots', 'Une chute sur scène', 'Un défaut poussé à l’extrême'], 0, 'C’est un ressort du comique de situation.'],
            ['L’ironie tragique naît quand le spectateur sait ce que le personnage ignore.', ['Vrai', 'Faux'], 0, 'Le décalage de savoir crée la tension.'],
          ],
        },
      ],
    },
  ],
}
