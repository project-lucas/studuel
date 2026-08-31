// Français — Sixième : LE PROGRAMME COMPLET (10 fiches).
//
// LE DÉFAUT. La page « Français » d'un élève de 6e s'ouvrait sur cinq fiches
// héritées du premier jeu de données (migration 008) : « Le conte merveilleux »,
// « Récits d'aventures », « Poésie : jeux de langage », « Le groupe nominal et
// ses accords » et « Conjugaison : présent et imparfait ».
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 3 chapitres de la maquette de référence et
// leurs 10 fiches :
//   1. Créer, recréer le monde : récit des origines        (3)
//   2. Chanter et enchanter le monde : mots et merveilles  (3)
//   3. Se masquer, jouer, déjouer : ruses en action        (4)
//
// LE DÉCOUPAGE SUIT LES « QUESTIONNEMENTS » DU BO, PAS LES GENRES. Le programme
// de français du cycle 3 n'est pas une liste de notions mais une suite
// d'entrées thématiques, chacune adossée à des œuvres. La maquette de référence
// les reprend telles quelles — d'où des titres de fiches qui nomment des ŒUVRES
// (Le Médecin malgré lui, Les Fourberies de Scapin) et non des points de langue.
//
// LA LANGUE N'EST PAS ABSENTE, ELLE EST INTÉGRÉE. Chaque fiche porte, dans son
// cours, les outils que l'œuvre appelle : le passé simple pour le récit des
// origines, les images pour la poésie, le dialogue et les didascalies pour le
// théâtre. C'est le parti de la maquette, et il vaut mieux qu'une fiche
// « Conjugaison » hors-sol : on révise la langue là où on la rencontre.
//
// ⚠️ Le slug `francais` porte de nombreux modules (1re, 2de, 3e, 4e, 5e, les
// fiches A→E, celui-ci = 6e) : ne JAMAIS générer avec `--slugs francais`.
// Toujours `--modules francais-6e`.

export default {
  slug: 'francais',
  nom: 'Français',

  titreMigration: 'FRANÇAIS 6e — LE PROGRAMME COMPLET (10 fiches)',

  motif: `CONSTAT : le français de 6e n'avait que les 5 fiches du premier jeu de données de
l'app — « Le conte merveilleux », « Récits d'aventures », « Poésie : jeux de
langage », « Le groupe nominal et ses accords », « Conjugaison : présent et
imparfait ». Un élève qui préparait un contrôle sur les récits de création, sur
Molière ou sur la poésie du programme ne trouvait RIEN. Cette migration installe
les 10 fiches, rangées sous les 3 chapitres de la maquette, et retire les 5
fiches génériques.
LE DÉCOUPAGE SUIT LES QUESTIONNEMENTS DU BO, pas les genres : le programme de
cycle 3 est une suite d'entrées thématiques adossées à des œuvres, d'où des
titres de fiches qui nomment des œuvres. La langue n'est pas pour autant absente
— elle est traitée dans le cours de chaque fiche, là où l'œuvre l'appelle.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit : ce
module range ses 10 fiches sous 3 chapitres, et l'INSERT écrit la colonne. Elle
est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que
la 234 soit passée en production — sans cette reprise, la migration échouerait
sur "column chapters.theme does not exist", les 5 anciens chapitres déjà
supprimés et les 10 neufs pas encore posés : une matière vide.
Le ménage qui suit LIT cette colonne : elle doit exister avant lui.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités de la 008 partent, au niveau 6e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : le critère « pas de chapitre de
programme » vise exactement les cinq lignes voulues. Elles datent de la 008, bien
avant la colonne theme, tandis que les 10 fiches neuves en portent une dès
l'INSERT — le ménage tourne AVANT les insertions et ne peut donc jamais mordre
sur elles, ni au premier passage ni au rejeu.
Le filtre level = '6e' est indispensable : le français existe sur sept niveaux,
et chacun a sa propre migration.
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
   AND s.slug = 'francais'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '6e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['6e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Créer, recréer le monde : récit des origines
        // ===================================================================
        {
          titre: 'Créer, recréer le monde : récits des origines dans les différentes religions monothéistes',
          axe: 'Créer, recréer le monde : récit des origines',
          lecon: {
            titre: 'La Genèse, et ce qu’un récit de création raconte',
            cours: `Toutes les cultures ont cherché à répondre à la même question : **d’où vient le monde ?** Ces réponses prennent la forme de **récits des origines**, ou **cosmogonies**.

## Le récit de la Genèse
La Bible s’ouvre sur la création en **sept jours** — six jours d’action, un jour de repos. Ce récit est partagé, avec des variantes, par les trois **monothéismes** : judaïsme, christianisme, islam. « Monothéiste » vient du grec *monos* (seul) et *theos* (dieu) : **un seul dieu**.

## Ce qui fait sa force d’écriture
- La **répétition** : « Dieu dit… et cela fut ainsi », reprise à chaque étape, donne un **rythme** solennel.
- La **progression** : du plus général (la lumière, le ciel) au plus particulier (les animaux, l’humain).
- La **parole créatrice** : ici, dire suffit à faire exister. C’est un choix littéraire fort.
- Le **déluge** est un récit de **re**-création : le monde est effacé, puis recommencé avec Noé.

## Les outils de la langue du récit
- Le **passé simple** raconte les actions principales, achevées : *il créa*, *il sépara*.
- L’**imparfait** décrit le décor et l’état des choses : *la terre était informe*.
- Les **connecteurs de temps** organisent : *au commencement*, *puis*, *le septième jour*.

> Le passé simple fait avancer l’histoire ; l’imparfait installe le décor. C’est la répartition à retenir pour tout récit.

## Lire ces textes en classe
On les étudie comme des **textes fondateurs** : des œuvres littéraires qui ont façonné la culture, les arts et la langue. On y cherche la construction et les images, pas une vérité scientifique — ce n’est pas le même terrain.`,
          },
          questions: [
            ['Qu’est-ce qu’un récit des origines ?', ['Un récit qui explique la naissance du monde', 'Un récit d’aventures', 'Une pièce de théâtre', 'Un poème d’amour'], 0, 'On parle aussi de cosmogonie.'],
            ['Que signifie « monothéiste » ?', ['Qui ne reconnaît qu’un seul dieu', 'Qui reconnaît plusieurs dieux', 'Qui ne croit en aucun dieu', 'Qui adore la nature'], 0, 'Du grec monos, seul, et theos, dieu.'],
            ['En combien de jours la création est-elle racontée dans la Genèse ?', ['Sept', 'Trois', 'Douze', 'Quarante'], 0, 'Six jours d’action et un jour de repos.'],
            ['Quel procédé donne son rythme solennel au récit de la Genèse ?', ['La répétition de formules', 'Le dialogue', 'La rime', 'Le suspense'], 0, '« Dieu dit… et cela fut ainsi ».'],
            ['Quel temps raconte les actions principales d’un récit ?', ['Le passé simple', 'L’imparfait', 'Le présent', 'Le futur'], 0, 'L’imparfait, lui, installe le décor.'],
            ['À quoi sert l’imparfait dans un récit ?', ['À décrire le décor et l’état des choses', 'À raconter les actions brèves', 'À exprimer un ordre', 'À poser une question'], 0, '« La terre était informe ».'],
            ['Quel épisode de la Bible est un récit de re-création ?', ['Le déluge', 'La tour de Babel', 'L’Exode', 'La Nativité'], 0, 'Le monde est effacé, puis recommencé avec Noé.'],
            ['On étudie les textes fondateurs comme des documents scientifiques.', ['Vrai', 'Faux'], 1, 'On les lit comme des œuvres littéraires qui ont façonné la culture.'],
          ],
        },
        {
          titre: 'Création et recréation du monde dans les différentes religions polythéistes',
          axe: 'Créer, recréer le monde : récit des origines',
          lecon: {
            titre: 'Quand les dieux sont nombreux',
            cours: `Une religion **polythéiste** reconnaît **plusieurs** dieux (*poly*, nombreux). Grecs, Romains, Égyptiens, Nordiques, Mésopotamiens : leurs récits des origines sont peuplés de divinités qui se disputent, s’aiment et se trahissent.

## La cosmogonie grecque
Chez **Hésiode** (*La Théogonie*), le monde naît du **Chaos**, vide originel. Puis viennent **Gaïa** (la Terre) et **Ouranos** (le Ciel). Leur fils **Cronos** renverse son père ; **Zeus**, fils de Cronos, le renverse à son tour et s’installe sur l’**Olympe** avec les douze dieux.

## Ce qui distingue ces récits
- Les dieux sont **anthropomorphes** : ils ont un corps, un caractère, des défauts humains — jalousie, colère, ruse.
- Le monde naît d’une **succession de générations** et de conflits, non d’une parole unique.
- Chaque dieu a un **domaine** : Zeus le ciel, Poséidon la mer, Hadès les Enfers, Athéna la sagesse, Arès la guerre.

## Les grands mythes qui en découlent
- **Prométhée** vole le feu pour les humains et sera puni : le mythe du savoir conquis contre les dieux.
- **Pandore** ouvre la jarre d’où s’échappent les maux, ne laissant que l’espérance.
- Le **déluge** existe aussi chez les Grecs (Deucalion) et chez les Mésopotamiens (*L’Épopée de Gilgamesh*, bien plus ancienne que la Bible).

> Le même motif — un monde détruit puis refait — traverse des cultures qui ne se connaissaient pas. C’est ce qui rend ces récits passionnants à comparer.

## Ce que ces récits nous laissent
Une **langue** : *panique* (Pan), *narcissique* (Narcisse), *titanesque*, *olympien*, *dédale*. Et des œuvres sans nombre, de la peinture au cinéma.`,
          },
          questions: [
            ['Que signifie « polythéiste » ?', ['Qui reconnaît plusieurs dieux', 'Qui ne reconnaît qu’un dieu', 'Qui ne croit en rien', 'Qui adore les ancêtres'], 0, 'Du grec poly, nombreux.'],
            ['De quoi naît le monde dans la cosmogonie grecque d’Hésiode ?', ['Du Chaos', 'De l’Olympe', 'De la mer', 'D’un œuf'], 0, 'Puis viennent Gaïa et Ouranos.'],
            ['Qui règne sur l’Olympe après avoir renversé Cronos ?', ['Zeus', 'Poséidon', 'Hadès', 'Prométhée'], 0, 'Cronos avait lui-même renversé Ouranos.'],
            ['Que signifie « anthropomorphe » pour un dieu ?', ['Il a une forme et un caractère humains', 'Il est invisible', 'Il est unique', 'Il vit sous terre'], 0, 'Les dieux grecs ont des défauts très humains.'],
            ['Qu’a fait Prométhée pour les humains ?', ['Il leur a volé le feu', 'Il leur a donné la parole', 'Il a créé la Terre', 'Il a ouvert une jarre'], 0, 'Il en sera puni par Zeus.'],
            ['Qu’a laissé Pandore dans la jarre après en avoir libéré les maux ?', ['L’espérance', 'Le feu', 'La sagesse', 'Rien'], 0, 'Tous les autres maux s’en étaient échappés.'],
            ['Quel dieu grec règne sur la mer ?', ['Poséidon', 'Hadès', 'Arès', 'Athéna'], 0, 'Hadès règne sur les Enfers.'],
            ['Le motif du déluge n’existe que dans la Bible.', ['Vrai', 'Faux'], 1, 'On le trouve chez les Grecs et dans L’Épopée de Gilgamesh, plus ancienne.'],
          ],
        },
        {
          titre: 'Un conte étiologique : « Comment le chameau eut sa bosse », Histoires comme ça, de Rudyard Kipling',
          axe: 'Créer, recréer le monde : récit des origines',
          lecon: {
            titre: 'Le conte qui explique pourquoi',
            cours: `## Qu’est-ce qu’un conte étiologique ?
Un **conte étiologique** (ou conte des origines) explique **pourquoi** une chose est comme elle est : pourquoi le chameau a une bosse, pourquoi la mer est salée, pourquoi le léopard a des taches. Le mot vient du grec *aitia*, la cause.

## L’histoire de Kipling
Dans *Histoires comme ça* (1902), **Rudyard Kipling** raconte un chameau paresseux qui refuse de travailler et répond toujours « **Bof !** » Le Djinn du désert le punit : ce « Bof » se change en **bosse**, qui lui permettra de travailler trois jours sans manger.

## La structure, toujours la même
1. Une **situation initiale** où la chose n’existe pas encore (le chameau n’a pas de bosse) ;
2. un **événement** — une faute, une ruse, une punition ;
3. une **situation finale** qui explique l’état actuel, valable **pour toujours** et pour **toute l’espèce**.

## Le ton de Kipling
- Il s’adresse **directement** au lecteur : « Ô Bien-Aimé ». Ce procédé s’appelle l’**apostrophe**.
- Il joue sur les **répétitions** et les mots inventés, qui font entendre une voix de conteur.
- L’**humour** est constant : la morale n’est pas assenée, elle est glissée dans le rire.

> Le conte étiologique n’explique pas vraiment : il **fait semblant** d’expliquer, et c’est le jeu qui plaît.

## Écrire le sien
On choisit une particularité animale, on invente la faute et la sanction, on écrit au **passé simple** pour les actions et à l’**imparfait** pour les descriptions, et on termine par une formule qui installe le définitif : *« et depuis ce jour… »*.`,
          },
          questions: [
            ['Qu’explique un conte étiologique ?', ['Pourquoi une chose est comme elle est', 'Comment finit une aventure', 'Qui a gagné une guerre', 'Comment cuisiner'], 0, 'Du grec aitia, la cause.'],
            ['Qui a écrit Histoires comme ça ?', ['Rudyard Kipling', 'Charles Perrault', 'Jean de La Fontaine', 'Joël Pommerat'], 0, 'Le recueil paraît en 1902.'],
            ['Que devient le « Bof » du chameau dans le conte ?', ['Sa bosse', 'Sa longue patte', 'Son cri', 'Sa fourrure'], 0, 'Le Djinn le punit de sa paresse.'],
            ['Comment appelle-t-on le fait de s’adresser directement au lecteur ?', ['L’apostrophe', 'La comparaison', 'La métaphore', 'La rime'], 0, 'Kipling dit « Ô Bien-Aimé ».'],
            ['Par quoi commence un conte étiologique ?', ['Une situation où la chose n’existe pas encore', 'La situation finale', 'Une morale', 'Un dialogue'], 0, 'Puis vient l’événement qui la fait apparaître.'],
            ['Quel temps emploie-t-on pour les actions d’un conte ?', ['Le passé simple', 'Le présent', 'Le futur', 'Le conditionnel'], 0, 'L’imparfait sert aux descriptions.'],
            ['Quelle formule installe le caractère définitif de l’explication ?', ['« Et depuis ce jour… »', '« Il était une fois »', '« Soudain »', '« En effet »'], 0, 'Elle vaut pour toute l’espèce et pour toujours.'],
            ['Un conte étiologique donne une explication scientifique.', ['Vrai', 'Faux'], 1, 'Il fait semblant d’expliquer : c’est un jeu littéraire.'],
          ],
        },

        // ===================================================================
        // Chapitre 2 : Chanter et enchanter le monde : mots et merveilles
        // ===================================================================
        {
          titre: 'Créer une autre manière de s’exprimer grâce à la poésie',
          axe: 'Chanter et enchanter le monde : mots et merveilles',
          lecon: {
            titre: 'Les outils du poète',
            cours: `La poésie ne dit pas les choses autrement pour compliquer : elle les dit autrement pour les faire **voir** et **entendre**.

## Le vers et la strophe
Un **vers** est une ligne du poème. On le compte en **syllabes** :
- 8 syllabes : **octosyllabe** ;
- 10 : **décasyllabe** ;
- 12 : **alexandrin**, le vers le plus célèbre de la poésie française.
Une **strophe** est un groupe de vers : **distique** (2), **tercet** (3), **quatrain** (4).

## La rime
Deux vers riment quand leurs derniers sons se répondent. Les dispositions :
- **suivies** (AABB), **croisées** (ABAB), **embrassées** (ABBA).

## Les images
- **Comparaison** : deux éléments rapprochés par un **outil** (comme, tel, semblable à). *Il est fort **comme** un lion.*
- **Métaphore** : la même image **sans** outil. *C’est un lion.*
- **Personnification** : on prête à une chose ou à un animal des traits humains. *Le vent **murmure**.*

> La différence entre comparaison et métaphore tient à un seul mot : l’outil de comparaison. C’est le piège classique des contrôles.

## Les jeux de sons
- **Allitération** : répétition de **consonnes** (*Pour qui sont ces serpents qui sifflent sur nos têtes ?*).
- **Assonance** : répétition de **voyelles**.
Ces répétitions créent une musique qui **imite** parfois ce que le texte décrit.

## La poésie libre
Depuis le XIXe siècle, les poètes s’affranchissent des règles : **vers libres** sans compte fixe, **calligrammes** dont la forme dessine le sujet (Apollinaire). La contrainte disparaît, l’intention reste.`,
          },
          questions: [
            ['Combien de syllabes compte un alexandrin ?', ['Douze', 'Dix', 'Huit', 'Quatorze'], 0, 'C’est le vers le plus célèbre de la poésie française.'],
            ['Comment appelle-t-on une strophe de quatre vers ?', ['Un quatrain', 'Un tercet', 'Un distique', 'Un sonnet'], 0, 'Le tercet en compte trois.'],
            ['Quelle est la différence entre comparaison et métaphore ?', ['La comparaison utilise un outil comme « comme », la métaphore non', 'La métaphore utilise un outil, la comparaison non', 'Il n’y en a aucune', 'La métaphore concerne les animaux'], 0, 'C’est le piège classique des contrôles.'],
            ['Qu’est-ce qu’une personnification ?', ['Prêter des traits humains à une chose ou un animal', 'Comparer deux personnes', 'Répéter une consonne', 'Décrire un personnage'], 0, '« Le vent murmure ».'],
            ['Qu’est-ce qu’une allitération ?', ['La répétition d’un son consonne', 'La répétition d’un son voyelle', 'Une rime croisée', 'Un vers de douze syllabes'], 0, 'L’assonance concerne les voyelles.'],
            ['Comment appelle-t-on la disposition de rimes ABAB ?', ['Rimes croisées', 'Rimes suivies', 'Rimes embrassées', 'Rimes libres'], 0, 'ABBA donne des rimes embrassées.'],
            ['Qu’est-ce qu’un calligramme ?', ['Un poème dont la forme dessine son sujet', 'Un poème sans rime', 'Un poème de douze vers', 'Un poème chanté'], 0, 'Apollinaire en a écrit de célèbres.'],
            ['Un vers libre ne compte pas un nombre fixe de syllabes.', ['Vrai', 'Faux'], 0, 'La contrainte disparaît, mais l’intention poétique demeure.'],
          ],
        },
        {
          titre: 'La poésie pour chanter et enchanter le monde',
          axe: 'Chanter et enchanter le monde : mots et merveilles',
          lecon: {
            titre: 'Célébrer, émerveiller, transformer',
            cours: `## Ce que fait la poésie lyrique
« **Lyrique** » vient de la **lyre**, l’instrument dont s’accompagnait le poète antique **Orphée**. La poésie lyrique **chante** : elle exprime des sentiments — joie, amour, tristesse, émerveillement — et cherche à les faire partager.

## Le monde vu autrement
Le poète prend un objet banal et le rend **extraordinaire**. Une flaque devient un miroir du ciel, un caillou une planète. C’est le regard qui change, pas la chose.

## Les marques du lyrisme
- la première personne : **je**, **mon**, **mes** ;
- les **exclamations** et les **apostrophes** (*Ô temps ! suspends ton vol*) ;
- le champ lexical du **sentiment** ;
- des images fortes, comparaisons et métaphores.

## La musique du poème
- Le **rythme** naît de la longueur des vers et des pauses.
- Les **répétitions** — d’un mot, d’un vers entier (le **refrain**) — installent une mélodie.
- Les **sonorités** peuvent imiter le réel : c’est l’**harmonie imitative**.

## Poésie et chanson
La frontière est mince : beaucoup de poèmes ont été **mis en musique**, et les textes de chansons obéissent aux mêmes outils — rimes, refrains, images. Étudier un texte de chanson, c’est faire de la poésie.

> Le mot « lyrique » raconte lui-même cette parenté : à l’origine, le poème se chantait.

## Dire un poème
Un poème s’entend autant qu’il se lit. Le **dire à voix haute** — en respectant les pauses, en détachant les images, en variant le volume — fait apparaître ce que l’œil seul ne perçoit pas.`,
          },
          questions: [
            ['D’où vient le mot « lyrique » ?', ['De la lyre, l’instrument du poète antique', 'Du nom d’un poète', 'D’une ville grecque', 'Du mot « lire »'], 0, 'À l’origine, le poème se chantait.'],
            ['Qu’exprime la poésie lyrique ?', ['Des sentiments', 'Des démonstrations scientifiques', 'Des règles de grammaire', 'Des faits historiques'], 0, 'Joie, amour, tristesse, émerveillement.'],
            ['Quelle marque grammaticale signale souvent le lyrisme ?', ['La première personne : je, mon, mes', 'La troisième personne', 'Le pronom « on »', 'Le passé simple'], 0, 'Le poète parle en son nom.'],
            ['Qu’est-ce qu’un refrain ?', ['Un vers ou un groupe de vers répété', 'La première strophe', 'La dernière rime', 'Un vers de douze syllabes'], 0, 'Il installe une mélodie.'],
            ['Qu’est-ce que l’harmonie imitative ?', ['Des sonorités qui imitent ce que le texte décrit', 'Une rime parfaite', 'Un vers régulier', 'Une strophe de quatre vers'], 0, 'Le son rejoint le sens.'],
            ['Quel poète antique jouait de la lyre ?', ['Orphée', 'Homère', 'Hésiode', 'Molière'], 0, 'Son nom est resté attaché au chant poétique.'],
            ['Que fait le poète d’un objet banal ?', ['Il en transforme le regard qu’on porte dessus', 'Il le décrit scientifiquement', 'Il le supprime', 'Il le compte'], 0, 'Une flaque devient un miroir du ciel.'],
            ['Un texte de chanson ne peut pas être étudié comme un poème.', ['Vrai', 'Faux'], 1, 'Il emploie les mêmes outils : rimes, refrains, images.'],
          ],
        },
        {
          titre: 'Jeux d’ani-mots : Jacques Roubaud, Les Animaux de tout le monde',
          axe: 'Chanter et enchanter le monde : mots et merveilles',
          lecon: {
            titre: 'Quand le mot devient un jouet',
            cours: `## Le recueil
Dans **Les Animaux de tout le monde** (1990), **Jacques Roubaud** consacre un poème à chaque animal — de la sardine au morse. Ce sont des poèmes courts, drôles, pleins de jeux de mots, où l’animal sert de prétexte à jouer avec la langue.

## L’Oulipo
Roubaud appartient à l’**Oulipo** (Ouvroir de Littérature Potentielle), un groupe d’écrivains qui s’imposent des **contraintes** volontaires pour écrire : n’employer aucun *e*, remplacer chaque nom par le septième qui le suit dans le dictionnaire, écrire un poème dont les vers se recombinent.

> La contrainte n’empêche pas d’écrire : elle **oblige à trouver** ce qu’on n’aurait pas cherché.

## Les jeux de langue du recueil
- Le **calembour** : jouer sur deux sens ou deux sons proches d’un mot.
- Le **mot-valise** : fondre deux mots en un (*ani-mots* : animal + mots).
- La **paronymie** : rapprocher des mots qui se ressemblent (*sardine* / *sourdine*).
- Le **détournement** de proverbes et d’expressions figées.

## Le ton
Roubaud écrit **pour les enfants sans écrire en dessous d’eux** : la fantaisie est réelle, mais la langue est exigeante. L’humour vient du décalage entre le sérieux de la forme poétique et la drôlerie du sujet.

## Écrire à sa manière
On choisit un animal, on cherche tous les mots que son nom contient ou évoque, on s’impose une **contrainte** (une seule voyelle, un acrostiche, une rime imposée) — et c’est la contrainte qui fait surgir l’idée.`,
          },
          questions: [
            ['Qui a écrit Les Animaux de tout le monde ?', ['Jacques Roubaud', 'Rudyard Kipling', 'Guillaume Apollinaire', 'Raymond Queneau'], 0, 'Le recueil paraît en 1990.'],
            ['Qu’est-ce que l’Oulipo ?', ['Un groupe d’écrivains qui s’imposent des contraintes d’écriture', 'Une maison d’édition', 'Un mouvement politique', 'Un prix littéraire'], 0, 'Ouvroir de Littérature Potentielle.'],
            ['Qu’est-ce qu’un mot-valise ?', ['Un mot formé en fondant deux mots en un', 'Un mot très long', 'Un mot inventé sans sens', 'Un mot étranger'], 0, '« Ani-mots » est formé sur animal et mots.'],
            ['Qu’est-ce qu’un calembour ?', ['Un jeu sur deux sens ou deux sons proches d’un mot', 'Une rime riche', 'Un vers de dix syllabes', 'Une strophe'], 0, 'C’est un ressort central du recueil.'],
            ['À quoi sert une contrainte d’écriture selon l’Oulipo ?', ['Elle oblige à trouver ce qu’on n’aurait pas cherché', 'Elle empêche d’écrire', 'Elle simplifie le travail', 'Elle sert à corriger les fautes'], 0, 'La contrainte est un moteur, pas un frein.'],
            ['Qu’est-ce que la paronymie ?', ['Le rapprochement de mots qui se ressemblent', 'La répétition d’une voyelle', 'L’emploi de synonymes', 'Le contraire d’un mot'], 0, 'Sardine et sourdine, par exemple.'],
            ['À quoi chaque poème du recueil est-il consacré ?', ['À un animal', 'À une saison', 'À une ville', 'À un sentiment'], 0, 'De la sardine au morse.'],
            ['Écrire sous contrainte empêche toute créativité.', ['Vrai', 'Faux'], 1, 'C’est précisément le pari inverse de l’Oulipo.'],
          ],
        },

        // ===================================================================
        // Chapitre 3 : Se masquer, jouer, déjouer : ruses en action
        // ===================================================================
        {
          titre: 'Le Médecin malgré lui, Molière',
          axe: 'Se masquer, jouer, déjouer : ruses en action',
          lecon: {
            titre: 'Un faux médecin, une vraie farce',
            cours: `## La pièce
*Le Médecin malgré lui* (**1666**) est une **comédie** en trois actes de **Molière**. **Sganarelle**, bûcheron ivrogne et paresseux, bat sa femme Martine ; pour se venger, elle le fait passer pour un médecin génial qui ne reconnaît son talent que sous les coups. Roué de bâton, Sganarelle finit par « avouer » qu’il est médecin — et se prend au jeu.

## La farce
Molière reprend les ressorts de la **farce** médiévale :
- les **coups de bâton** ;
- le **déguisement** et l’**imposture** ;
- le **quiproquo** : un malentendu où chacun croit parler de la même chose ;
- le **comique de mots** : Sganarelle débite du faux latin, que personne n’ose contredire.

## Les formes de comique
- **de gestes** : coups, chutes, grimaces ;
- **de mots** : jeux de langage, patois, latin de cuisine, répétitions ;
- **de situation** : quiproquos, déguisements ;
- **de caractère** : l’ivrogne, le crédule, le pédant ;
- **de répétition** : une réplique qui revient et déclenche le rire.

## Ce que la pièce dénonce
Derrière le rire, Molière moque les **médecins** de son temps — leur jargon, leur assurance et leur incapacité à guérir — et la **crédulité** de ceux qui se laissent impressionner par un vocabulaire qu’ils ne comprennent pas.

> Sganarelle ne trompe personne par son savoir : il trompe par son **assurance**. C’est le vrai sujet de la pièce.

## Le vocabulaire du théâtre
Une **réplique** est ce que dit un personnage ; une **tirade** une longue réplique ; un **monologue** un personnage seul en scène ; un **aparté** ce qu’un personnage dit sans être entendu des autres. Les **didascalies** sont les indications de mise en scène, en italique.`,
          },
          questions: [
            ['En quelle année Le Médecin malgré lui a-t-il été créé ?', ['1666', '1670', '1622', '1700'], 0, 'C’est une comédie en trois actes.'],
            ['Qui est Sganarelle au début de la pièce ?', ['Un bûcheron ivrogne', 'Un vrai médecin', 'Un noble', 'Un valet de comédie'], 0, 'Sa femme le fait passer pour médecin par vengeance.'],
            ['Qu’est-ce qu’un quiproquo ?', ['Un malentendu où l’on croit parler de la même chose', 'Un long discours', 'Une indication de mise en scène', 'Un personnage seul en scène'], 0, 'C’est un ressort classique de la farce.'],
            ['Comment appelle-t-on les indications de mise en scène ?', ['Les didascalies', 'Les répliques', 'Les tirades', 'Les apartés'], 0, 'Elles sont écrites en italique.'],
            ['Qu’est-ce qu’un aparté ?', ['Ce qu’un personnage dit sans être entendu des autres', 'Une longue réplique', 'Un dialogue à deux', 'Le titre d’un acte'], 0, 'Le public l’entend, pas les personnages.'],
            ['Quel comique repose sur les coups de bâton et les grimaces ?', ['Le comique de gestes', 'Le comique de mots', 'Le comique de caractère', 'Le comique de situation'], 0, 'C’est un héritage direct de la farce.'],
            ['Que moque Molière derrière le rire de cette pièce ?', ['Les médecins de son temps et la crédulité du public', 'Les paysans', 'Les rois', 'Les comédiens'], 0, 'Sganarelle impressionne par son assurance, pas par son savoir.'],
            ['Une tirade est une réplique très courte.', ['Vrai', 'Faux'], 1, 'C’est au contraire une longue réplique.'],
          ],
        },
        {
          titre: 'Les Fourberies de Scapin, Molière',
          axe: 'Se masquer, jouer, déjouer : ruses en action',
          lecon: {
            titre: 'Le valet qui mène le jeu',
            cours: `## La pièce
*Les Fourberies de Scapin* (**1671**) est une **comédie** en trois actes. **Scapin**, valet rusé, aide deux jeunes gens — Octave et Léandre — à épouser celles qu’ils aiment, contre la volonté de leurs pères **Argante** et **Géronte**. Pour cela, il ment, invente, manipule et soutire de l’argent.

## Une « fourberie », c’est quoi ?
Une **ruse**, une tromperie habile. Scapin en enchaîne : il invente un mariage forcé, un frère vengeur, une galère turque. Chaque mensonge en appelle un autre — c’est le moteur de la pièce.

## La scène du sac
La scène la plus célèbre (acte III) : Scapin persuade Géronte de se cacher dans un **sac** pour échapper à des ennemis imaginaires, puis le **roue de coups** en imitant plusieurs voix. Il se venge ainsi de son maître tout en prétendant le sauver.
C’est de cette scène que vient la réplique passée en proverbe : « **Que diable allait-il faire dans cette galère ?** »

## Le type du valet rusé
Scapin descend d’une longue lignée : l’esclave malin de la comédie latine, le **zanni** de la **commedia dell’arte** italienne. Il est **plus intelligent que ses maîtres**, et c’est là que la pièce devient piquante : le pouvoir social et l’intelligence ne sont pas du même côté.

> Molière fait rire d’un ordre renversé — le valet mène, les maîtres suivent.

## Le rythme
Les répliques sont **courtes**, s’enchaînent vite, se répètent en écho (la scène du sac, celle où Argante répète « Je te chasserai »). Cette vitesse est l’essentiel du comique : il faut la retrouver quand on lit à voix haute.`,
          },
          questions: [
            ['En quelle année Les Fourberies de Scapin ont-elles été créées ?', ['1671', '1666', '1680', '1650'], 0, 'C’est une comédie en trois actes.'],
            ['Qu’est-ce qu’une « fourberie » ?', ['Une ruse, une tromperie habile', 'Un costume', 'Une chanson', 'Un pardon'], 0, 'Scapin en enchaîne tout au long de la pièce.'],
            ['Que fait Scapin subir à Géronte dans la scène du sac ?', ['Il le fait cacher dans un sac et le roue de coups', 'Il le déguise en médecin', 'Il le marie de force', 'Il le vole discrètement'], 0, 'Il imite plusieurs voix pour le tromper.'],
            ['Quelle réplique célèbre vient de cette pièce ?', ['« Que diable allait-il faire dans cette galère ? »', '« Tu l’as voulu, Georges Dandin »', '« Couvrez ce sein »', '« Le poumon ! »'], 0, 'Elle est passée en proverbe.'],
            ['De quelle tradition italienne Scapin descend-il ?', ['La commedia dell’arte', 'L’opéra', 'La tragédie grecque', 'Le roman de chevalerie'], 0, 'Le personnage du zanni, valet rusé.'],
            ['Qui Scapin aide-t-il ?', ['Deux jeunes gens qui veulent épouser celles qu’ils aiment', 'Les deux pères', 'Un médecin', 'Un roi'], 0, 'Contre la volonté d’Argante et Géronte.'],
            ['Qu’est-ce qui fait le comique du rythme de la pièce ?', ['Des répliques courtes qui s’enchaînent vite', 'De longues tirades', 'Le silence des personnages', 'L’absence de dialogue'], 0, 'On le retrouve en lisant à voix haute.'],
            ['Dans la pièce, les maîtres sont plus intelligents que le valet.', ['Vrai', 'Faux'], 1, 'C’est l’inverse, et c’est ce renversement qui fait rire.'],
          ],
        },
        {
          titre: 'Le théâtre, un art de l’illusion ?',
          axe: 'Se masquer, jouer, déjouer : ruses en action',
          lecon: {
            titre: 'Faire croire, tout en sachant',
            cours: `## Un art qui se joue
Le théâtre est le seul genre écrit **pour être joué**. Un texte de théâtre n’est achevé que sur une scène, devant un public : il attend des corps, des voix, une lumière.

## Le double jeu du spectateur
Le spectateur sait parfaitement que la scène est un décor et l’acteur un comédien. Pourtant il **accepte d’y croire** le temps de la représentation : c’est la **convention théâtrale**, ou « suspension volontaire de l’incrédulité ».

> On ne se laisse pas tromper : on **accepte** d’être trompé. C’est un contrat, pas une naïveté.

## Les outils de l’illusion
- le **décor** et les **accessoires** ;
- le **costume** et le **maquillage** ;
- la **lumière**, qui isole, colore et rythme ;
- le **son** et la **musique** ;
- le **jeu** de l’acteur — voix, geste, regard, silence.

## Le théâtre dans le théâtre
Certaines pièces montrent des personnages qui **jouent la comédie** à d’autres personnages : Sganarelle joue au médecin, Scapin joue la peur. Le spectateur voit alors **deux niveaux** : il sait ce que le personnage trompé ignore. Ce décalage s’appelle l’**ironie dramatique**, et c’est une grande source de plaisir.

## Le vocabulaire de la représentation
La **mise en scène** est le travail du **metteur en scène** : il choisit comment le texte devient spectacle. Les **coulisses** sont l’espace caché, le **plateau** l’espace de jeu, la **réplique** ce que dit un personnage, la **scène** à la fois le lieu et une unité du texte.

## Deux grands genres
La **comédie** fait rire de personnages ordinaires et finit bien ; la **tragédie** met en scène des personnages illustres pris dans un destin funeste et finit mal.`,
          },
          questions: [
            ['Qu’est-ce que la convention théâtrale ?', ['L’accord tacite du spectateur pour croire à ce qu’il voit', 'Le contrat de l’acteur', 'Le règlement de la salle', 'Le plan du décor'], 0, 'On accepte d’être trompé, on n’est pas dupe.'],
            ['Comment appelle-t-on le travail de celui qui transforme le texte en spectacle ?', ['La mise en scène', 'La dramaturgie', 'La scénographie seule', 'La régie'], 0, 'Elle est signée par le metteur en scène.'],
            ['Qu’est-ce que l’ironie dramatique ?', ['Le spectateur sait ce qu’un personnage ignore', 'Un personnage se moque d’un autre', 'Une réplique drôle', 'Un décor comique'], 0, 'Elle naît souvent du théâtre dans le théâtre.'],
            ['Comment appelle-t-on l’espace caché du public ?', ['Les coulisses', 'Le plateau', 'La scène', 'Le parterre'], 0, 'Le plateau est l’espace de jeu.'],
            ['Qu’est-ce qui distingue la tragédie de la comédie ?', ['Elle met en scène des personnages illustres et finit mal', 'Elle est plus courte', 'Elle n’a pas de dialogue', 'Elle se joue sans décor'], 0, 'La comédie met en scène des personnages ordinaires.'],
            ['Pourquoi dit-on qu’un texte de théâtre n’est pas achevé sur la page ?', ['Il est écrit pour être joué devant un public', 'Il est toujours trop court', 'Il manque des mots', 'Il n’a pas de fin'], 0, 'Il attend des corps, des voix, une lumière.'],
            ['Lequel de ces éléments n’est PAS un outil de l’illusion théâtrale ?', ['La table des matières', 'Le costume', 'La lumière', 'Le décor'], 0, 'Le son et le jeu de l’acteur en sont aussi.'],
            ['Le spectateur de théâtre croit vraiment que ce qu’il voit est réel.', ['Vrai', 'Faux'], 1, 'Il accepte d’y croire : c’est une convention, pas une illusion subie.'],
          ],
        },
        {
          titre: 'Le Petit Chaperon Rouge de Joël Pommerat',
          axe: 'Se masquer, jouer, déjouer : ruses en action',
          lecon: {
            titre: 'Réécrire un conte pour aujourd’hui',
            cours: `## La pièce
**Joël Pommerat** est un auteur et metteur en scène contemporain. Son *Petit Chaperon Rouge* (**2004**) réécrit le conte de **Charles Perrault** pour la scène : même trame, tout autre éclairage.

## Ce qu’il garde, ce qu’il change
- **Il garde** : la petite fille, la mère, la grand-mère, le loup, le chemin, la dévoration.
- **Il change** : un **narrateur** vient sur scène raconter et commenter ; les personnages n’ont pas de nom (« la petite fille », « la mère ») ; l’histoire est ramenée à un cadre **quotidien** — une mère trop occupée, une enfant qui s’ennuie et cherche l’aventure.

## Le rôle de la lumière
La pièce se joue dans une **quasi-obscurité** traversée de faisceaux. La peur naît de ce qu’on **ne voit pas** : le loup est souvent une ombre, une voix, une silhouette. C’est un choix de mise en scène qui fait le sujet même du spectacle.

> Chez Pommerat, le noir n’est pas une absence de décor : c’est le décor.

## Le thème
Le conte parle de l’**enfance qui grandit** : quitter la maison, désobéir, affronter la peur, revenir changé. Pommerat déplace l’accent de la morale (« n’écoutez pas les inconnus ») vers la **solitude** de l’enfant et le **désir d’aventure**.

## Réécriture, adaptation, parodie
- **Réécrire** : reprendre une trame et la traiter autrement.
- **Adapter** : faire passer une œuvre d’un genre à un autre (conte → théâtre).
- **Parodier** : imiter en exagérant, pour faire rire.
Pommerat **réécrit** et **adapte** ; il ne parodie pas — son texte est grave.

## Comparer deux versions
Comparer Perrault et Pommerat, c’est mesurer ce qu’une époque fait d’une même histoire : la fin, le rôle de la mère, la présence ou l’absence de morale explicite.`,
          },
          questions: [
            ['Qui a écrit ce Petit Chaperon Rouge pour le théâtre ?', ['Joël Pommerat', 'Charles Perrault', 'Les frères Grimm', 'Molière'], 0, 'La pièce date de 2004.'],
            ['De qui Pommerat reprend-il le conte ?', ['Charles Perrault', 'Jacques Roubaud', 'Rudyard Kipling', 'Jean de La Fontaine'], 0, 'Il en garde la trame et en change l’éclairage.'],
            ['Comment les personnages sont-ils désignés dans la pièce ?', ['Sans nom propre : « la petite fille », « la mère »', 'Par des prénoms modernes', 'Par des numéros', 'Par des noms d’animaux'], 0, 'Cela leur donne une portée générale.'],
            ['Quel élément de mise en scène crée la peur ?', ['La quasi-obscurité et ce qu’on ne voit pas', 'Les décors très détaillés', 'La musique forte', 'Les costumes colorés'], 0, 'Le loup est souvent une ombre ou une voix.'],
            ['Quel personnage vient commenter l’histoire sur scène ?', ['Un narrateur', 'Le loup', 'La grand-mère', 'Un chœur d’enfants'], 0, 'Il raconte et fait le lien avec le public.'],
            ['Que signifie « adapter » une œuvre ?', ['La faire passer d’un genre à un autre', 'L’imiter en exagérant', 'La traduire', 'La résumer'], 0, 'Ici, du conte au théâtre.'],
            ['Sur quoi Pommerat déplace-t-il l’accent du conte ?', ['La solitude de l’enfant et son désir d’aventure', 'La punition du loup', 'La richesse de la grand-mère', 'La morale explicite'], 0, 'Perrault insistait sur l’avertissement.'],
            ['Le Petit Chaperon Rouge de Pommerat est une parodie comique.', ['Vrai', 'Faux'], 1, 'C’est une réécriture grave, non une parodie.'],
          ],
        },
      ],
    },
  ],
}
