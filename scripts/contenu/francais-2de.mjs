// Français — Seconde : LE PROGRAMME COMPLET (24 fiches).
//
// CE QUE REMPLACE CE MODULE. La 2de n'avait que CINQ chapitres de français,
// hérités du tout premier jeu de données (migration 008, contenu rempli par la
// 123) : « Le roman et le récit », « La poésie du Moyen Âge au XVIIIe », « Le
// théâtre du XVIIe au XXIe », « La littérature d'idées et la presse » et
// « Méthode du commentaire ». Quatre d'entre eux sont les intitulés des QUATRE
// objets d'étude du programme, réduits chacun à une fiche unique : un élève de
// 2de qui révisait le vocabulaire poétique, le Roman de Renart, le sonnet de la
// Pléiade, la fable des Lumières, les fondamentaux du journalisme, la presse du
// XIXe siècle, l'exil en poésie, le récit réaliste, l'autobiographie, le
// vocabulaire du théâtre ou le drame romantique ne trouvait RIEN.
//
// LE DÉCOUPAGE. Les 4 objets d'étude du programme de seconde (arrêté du 17
// janvier 2019, BO spécial n° 1 du 22 janvier 2019), éclatés en leurs 24
// fiches. Chaque fiche est un chapitre en base ; l'OBJET D'ÉTUDE est porté par
// `axe` (colonne `chapters.theme`), qui fait grouper la page matière — cf.
// docs/template-matiere.md. Le français de 2de n'a qu'un seul rayon : pas de
// `rayon` ici, la page garde un onglet Programme unique (contrairement au
// français de 1re, qui en a trois depuis la 259).
//
// LES QUATRE FICHES « REPÈRES ». La maquette de référence ouvre chaque objet
// d'étude par une fiche panorama qui porte le nom de l'objet lui-même. Reprise
// telle quelle, elle ferait DEUX objets du même nom à deux places différentes :
// l'en-tête de section et la première ligne de la liste. Elles sont donc
// titrées « Repères : … », qui dit ce qu'on y apprend au lieu de répéter le
// titre au-dessus. Le contenu, lui, est bien celui d'une fiche panorama.
//
// LES CINQ ANCIENS PARTENT (voir `menage`). Quatre d'entre eux deviennent des
// OBJETS D'ÉTUDE du programme : les laisser en base ferait, là encore, deux
// objets du même nom à deux places différentes. Le cinquième (« Méthode du
// commentaire ») est une fiche de méthode hors programme de seconde — l'écrit
// du bac se prépare en première, et le dossier d'une matière ne montre que son
// programme. Le ménage est borné à leurs cinq titres exacts et au seul niveau
// 2de — rejoué, il ne trouve plus rien et ne touche jamais les 24 fiches
// neuves.
//
// ⚠️ Le slug reste `francais` et SEPT modules le portent désormais
// (`francais-1re.mjs` → 259, `francais-1re-anciens.mjs` → 260,
// `francais-fiches-a…e.mjs` → 261 à 265, celui-ci → 283) : ne JAMAIS générer
// avec `--slugs francais`, qui les fusionnerait et réécrirait sept migrations.
// Toujours `--modules francais-2de`.

export default {
  slug: 'francais',
  nom: 'Français',

  titreMigration: 'FRANÇAIS 2de — LE PROGRAMME COMPLET (24 fiches)',

  motif: `CONSTAT : la Seconde n'avait que CINQ chapitres de français, hérités du
premier jeu de données de l'app. Quatre d'entre eux sont les intitulés des
QUATRE objets d'étude du programme (la poésie du Moyen Âge au XVIIIe siècle, la
littérature d'idées et la presse du XIXe au XXIe siècle, le roman et le récit du
XVIIIe au XXIe siècle, le théâtre du XVIIe au XXIe siècle), réduits chacun à une
fiche unique ; le cinquième est une méthode de commentaire qui relève de la
première. Un élève de 2de qui révisait le vocabulaire poétique, le Roman de
Renart, le sonnet de la Pléiade, la fable des Lumières, les fondamentaux du
journalisme, la presse du XIXe siècle, l'exil en poésie, le récit réaliste,
l'autobiographie, le vocabulaire du théâtre ou le drame romantique ne trouvait
RIEN. Cette migration installe les 24 fiches, rangées sous leurs 4 objets
d'étude, et retire les 5 fiches génériques que ce découpage recouvre.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 24 fiches sous 4 objets d'étude, et l'INSERT écrit la
colonne. Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut
pas garantir que la 234 soit passée en production — sans cette reprise, la
migration échouerait sur "column chapters.theme does not exist", les 5 anciens
chapitres déjà supprimés et les 24 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités partent. Quatre d'entre eux deviennent des OBJETS
D'ÉTUDE du programme ("Le roman et le récit", "La poésie du Moyen Âge au
XVIIIe", "Le théâtre du XVIIe au XXIe", "La littérature d'idées et la presse") :
les garder en base ferait deux objets du même nom à deux places différentes, un
en-tête de section et une ligne dans la liste. Le cinquième ("Méthode du
commentaire") est une fiche de méthode hors du programme de seconde — l'écrit du
bac se prépare en première, et un dossier de matière ne montre que son
programme.
ATTENTION À L'APOSTROPHE : les titres de la 008 portent une apostrophe DROITE
(U+0027), doublée ici selon la règle SQL. Les 24 fiches neuves écrivent, elles,
l'apostrophe typographique — aucun de leurs titres ne peut donc être atteint par
ces DELETE, même par accident.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.
Les trois DELETE sont bornés aux CINQ TITRES EXACTS et au seul niveau 2de. Sans
cette borne, "Le roman et le récit" mordrait sur d'autres niveaux — et un rejeu
après coup effacerait les quiz des 24 fiches neuves, le ménage tournant avant
les insertions à CHAQUE passage.`,
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
   AND c.level = '2de'
   AND c.title IN ('Le roman et le récit',
                   'La poésie du Moyen Âge au XVIIIe',
                   'Le théâtre du XVIIe au XXIe',
                   'La littérature d''idées et la presse',
                   'Méthode du commentaire');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '2de'
   AND c.title IN ('Le roman et le récit',
                   'La poésie du Moyen Âge au XVIIIe',
                   'Le théâtre du XVIIe au XXIe',
                   'La littérature d''idées et la presse',
                   'Méthode du commentaire');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '2de'
   AND c.title IN ('Le roman et le récit',
                   'La poésie du Moyen Âge au XVIIIe',
                   'Le théâtre du XVIIe au XXIe',
                   'La littérature d''idées et la presse',
                   'Méthode du commentaire');`,
    },
  ],

  blocs: [
    {
      niveaux: ['2de'],
      chapitres: [
        // ===================================================================
        // Objet d'étude 1 : la poésie du Moyen Âge au XVIIIe siècle
        // ===================================================================
        {
          titre: 'Repères : de la poésie médiévale aux Lumières',
          axe: 'La poésie du Moyen Âge au XVIIIe siècle',
          lecon: {
            titre: 'Six siècles de poésie en une page',
            cours: `Pendant six siècles, la poésie française change de forme, de sujet et de public — mais elle garde une constante : elle travaille la langue pour la rendre plus dense que la prose.

## Six siècles en un tableau
| Le siècle | Ce que la poésie y fait | Ses figures |
| **Moyen Âge** | Elle se **chante** : l'amour courtois, une dame inaccessible, un chevalier à son service | Troubadours au sud, **trouvères** au nord ; **Villon** en rupture |
| **Renaissance** | Elle passe au **français** et devient savante | La **Pléiade** : **Ronsard**, **Du Bellay** |
| **XVIIe** | Elle obéit à la **règle** : mètres fixes, rimes riches, respect des genres | **La Fontaine** et la fable |
| **XVIIIe** | Elle devient une **arme** contre l'intolérance et l'injustice | Les **Lumières** |

## Le Moyen Âge
À la fin de la période, **François Villon** rompt avec le monde poli de la courtoisie et écrit la faim, la prison et la mort dans une langue directe.

## La Renaissance
Le **sonnet**, importé d'Italie, triomphe. Les thèmes traverseront les siècles : la fuite du temps, la beauté qui passe, l'exil.

> *Défense et illustration de la langue française* (Du Bellay, 1549) : le manifeste d'une génération qui veut faire du français une langue de poésie.

## Le XVIIIe siècle
Le siècle préfère l'essai, le conte et la fable au lyrisme. La fable cache sa cible derrière des animaux — et devient d'autant plus efficace.

## Ce qui reste, d'un bout à l'autre
| Le travail | Ses moyens |
| Le **rythme** | Le vers, la strophe, la césure |
| Le **son** | La rime, les allitérations, les assonances |
| L'**image** | Comparaison, métaphore, personnification |`,
          },
          questions: [
            ['Comment la poésie médiévale était-elle d’abord diffusée ?', ['Chantée, accompagnée de musique', 'Imprimée en recueils', 'Lue en silence', 'Affichée dans les églises'], 0, 'Troubadours et trouvères sont autant musiciens que poètes.'],
            ['Qu’est-ce que l’amour courtois ?', ['Le service amoureux d’un chevalier envers une dame idéalisée', 'Un mariage arrangé par le roi', 'L’amour entre paysans', 'Une forme de poésie religieuse'], 0, 'La dame est inaccessible : c’est le désir, pas sa satisfaction, qui fait le poème.'],
            ['Quel poète du XVe siècle écrit la faim, la prison et la mort ?', ['François Villon', 'Pierre de Ronsard', 'Joachim Du Bellay', 'Jean de La Fontaine'], 0, 'Il rompt avec la poésie courtoise par sa langue directe.'],
            ['Que revendique la Pléiade au XVIe siècle ?', ['Écrire une poésie savante en français plutôt qu’en latin', 'Revenir au latin', 'Supprimer la rime', 'Abandonner le sonnet'], 0, 'C’est le programme de la « Défense et illustration de la langue française ».'],
            ['D’où vient la forme du sonnet ?', ['D’Italie', 'D’Angleterre', 'D’Espagne', 'De Grèce'], 0, 'Pétrarque en fait le modèle que la Pléiade importe en France.'],
            ['Quel genre poétique La Fontaine porte-t-il au premier plan au XVIIe siècle ?', ['La fable', 'L’ode', 'La ballade', 'Le calligramme'], 0, 'Elle fait entrer le récit et la satire dans le vers.'],
            ['Au XVIIIe siècle, la poésie est surtout mise au service des idées.', ['Vrai', 'Faux'], 0, 'Le siècle des Lumières préfère l’argumentation au lyrisme.'],
            ['Quels sont les trois grands chantiers du poète, quel que soit le siècle ?', ['Le rythme, le son et l’image', 'La grammaire, l’orthographe et le style', 'L’intrigue, les personnages et le décor', 'La thèse, l’argument et l’exemple'], 0, 'Vers et strophe, rime et sonorités, comparaison et métaphore.'],
          ],
        },
        {
          titre: 'Le vocabulaire poétique',
          axe: 'La poésie du Moyen Âge au XVIIIe siècle',
          lecon: {
            titre: 'Les mots pour analyser un poème',
            cours: `Analyser un poème, ce n'est pas dire ce qu'on ressent : c'est nommer ce que le texte fait.

## Compter les syllabes
| Le mètre | Son nombre de syllabes |
| **Octosyllabe** | 8 |
| **Décasyllabe** | 10 |
| **Alexandrin** | 12, coupé en deux **hémistiches** de 6 par une **césure** |

| Le cas du **e** muet | Compte-t-il |
| Devant une **consonne** | **Oui** |
| Devant une **voyelle** — élision | Non |
| En **fin de vers** | Non |

| Le phénomène | Ce qu'il fait | Un exemple |
| La **diérèse** | Deux voyelles en **deux** syllabes | li-on |
| La **synérèse** | Deux voyelles en **une** syllabe | lion |

## Ranger les rimes
| La disposition | Son schéma |
| Suivies, ou plates | AABB |
| **Croisées** | ABAB |
| **Embrassées** | ABBA |

| La richesse | Les sons communs |
| **Pauvre** | 1 |
| **Suffisante** | 2 |
| **Riche** | 3 ou plus |

On distingue aussi les rimes **féminines**, finissant par un e muet, et **masculines**.

## Nommer les strophes
| Le nombre de vers | Son nom |
| 2 | Distique |
| 3 | Tercet |
| 4 | **Quatrain** |
| 5 | Quintil |
| 6 | Sizain |
| 8 | Huitain |
| 14 | Le **sonnet** : deux quatrains, deux tercets |

## Quand le sens déborde
| Le procédé | Sa définition |
| L'**enjambement** | Le sens déborde du vers sur le suivant |
| Le **rejet** | Le débordement est court, mis en valeur **au début** du vers suivant |
| Le **contre-rejet** | Il est à la **fin** du vers précédent |

## Travailler le son et l'image
| La figure | Ce qu'elle fait |
| L'**allitération** | Elle répète une **consonne** |
| L'**assonance** | Elle répète une **voyelle** |
| L'**anaphore** | Elle répète un mot en début de vers |
| La **comparaison** | Elle rapproche avec un outil : comme, tel, pareil à |
| La **métaphore** | Elle supprime l'outil |
| La **personnification** | Elle prête une conduite humaine à une chose |
| L'**allégorie** | Elle représente une idée abstraite par une figure concrète |
| L'**hyperbole** | Elle exagère |
| La **litote** | Elle dit moins pour suggérer plus |
| L'**oxymore** | Elle accole deux mots contraires |

> Ces répétitions ne décorent pas : elles imitent, insistent, martèlent.`,
          },
          questions: [
            ['Combien de syllabes compte un alexandrin ?', ['12', '10', '8', '14'], 0, 'Il se coupe souvent en deux hémistiches de six syllabes.'],
            ['Qu’est-ce que la césure ?', ['La coupe qui sépare un vers en deux hémistiches', 'La rime finale', 'Le passage à la strophe suivante', 'Le silence entre deux poèmes'], 0, 'Dans l’alexandrin classique, elle tombe après la sixième syllabe.'],
            ['Qu’appelle-t-on diérèse ?', ['Prononcer en deux syllabes deux voyelles voisines', 'Supprimer un e muet', 'Répéter une consonne', 'Couper un vers en deux'], 0, 'Li-on compte alors deux syllabes au lieu d’une.'],
            ['Comment se nomme le schéma de rimes ABBA ?', ['Rimes embrassées', 'Rimes croisées', 'Rimes suivies', 'Rimes plates'], 0, 'Les rimes croisées sont en ABAB, les suivies en AABB.'],
            ['De quoi est composé un sonnet ?', ['Deux quatrains et deux tercets', 'Trois quatrains et un distique', 'Quatre tercets', 'Deux sizains'], 0, 'Soit quatorze vers au total.'],
            ['Qu’est-ce qu’un rejet ?', ['Un fragment de phrase qui déborde au début du vers suivant', 'Une rime pauvre', 'Un vers supprimé', 'Une strophe isolée'], 0, 'Le débordement met le mot rejeté en relief.'],
            ['Une allitération répète une voyelle.', ['Vrai', 'Faux'], 1, 'Elle répète une consonne ; la répétition d’une voyelle est une assonance.'],
            ['Qu’est-ce qu’un oxymore ?', ['L’association de deux mots de sens contraire', 'Une exagération', 'Une comparaison sans outil', 'Une répétition en début de vers'], 0, 'Comme « une clarté obscure ».'],
          ],
        },
        {
          titre: 'Les animaux au service du rire et de la dénonciation : le Roman de Renart',
          axe: 'La poésie du Moyen Âge au XVIIIe siècle',
          lecon: {
            titre: 'Rire des puissants sous le masque des bêtes',
            cours: `Le Roman de Renart n'est pas un roman ni l'œuvre d'un seul auteur : c'est un ensemble de récits en vers, les branches, composés entre 1170 et 1250 environ.

## Une parodie
| Le modèle sérieux | Ce que Renart en fait |
| La **chanson de geste** | Des ruses de goupil à la place des combats héroïques |
| Le **roman courtois** | Des animaux à la place des chevaliers |
| Le procès féodal | Un tribunal grotesque où l'on juge un renard dans les formes |

La **parodie** est l'imitation comique d'un modèle sérieux.

## Une société transposée
| L'animal | Son rôle social |
| **Noble** le lion | Le roi |
| **Ysengrin** le loup | Le grand baron brutal |
| **Brun** l'ours, **Tibert** le chat | Des vassaux |
| **Chantecler** le coq | Un naïf plein de vanité |
| **Renart** le goupil | Le petit, qui n'a que sa ruse |

> Le succès du personnage est tel que son nom propre a remplacé le mot « goupil » : le renard s'appelle aujourd'hui renard **à cause de lui**.

> Faire parler des animaux permet de dire des choses qu'un texte sur des humains ne pourrait pas dire impunément.

## Le comique
| Sa forme | Ses ressorts |
| De **situation** | Ruses, déguisements, coups reçus — proche de la farce |
| De **mots** | Jeux de mots, serments détournés |

## La satire
| Ce qu'elle vise | Comment |
| La **justice** | On l'achète |
| La **force** | Elle tient lieu de droit |
| La **religion** | Elle sert de couverture |

> Renart n'est pas un héros positif — il est menteur, voleur et cruel — mais ses victimes le sont autant que lui, et ce sont elles qui détiennent le pouvoir.`,
          },
          questions: [
            ['Qu’est-ce qu’une branche du Roman de Renart ?', ['Un récit indépendant qui compose l’ensemble', 'Un chapitre de roman moderne', 'Une famille de personnages', 'Un épisode musical'], 0, 'Les branches sont écrites par des auteurs différents sur près d’un siècle.'],
            ['Quels genres le Roman de Renart parodie-t-il ?', ['La chanson de geste et le roman courtois', 'La tragédie et la comédie', 'Le sonnet et l’ode', 'L’autobiographie et le journal'], 0, 'Il imite leurs codes pour en faire rire.'],
            ['Quel animal est le roi dans le Roman de Renart ?', ['Noble le lion', 'Ysengrin le loup', 'Brun l’ours', 'Tibert le chat'], 0, 'La cour reproduit la hiérarchie féodale.'],
            ['Qui est le rival principal de Renart ?', ['Ysengrin le loup', 'Chantecler le coq', 'Tibert le chat', 'Noble le lion'], 0, 'Le grand baron brutal, toujours victime de la ruse du goupil.'],
            ['Quelle trace le personnage a-t-il laissée dans la langue française ?', ['Son nom propre a remplacé le mot goupil', 'Il a donné son nom au loup', 'Il a créé le mot roman', 'Il a fait disparaître le mot lion'], 0, 'C’est un cas rare de nom propre devenu nom commun.'],
            ['Renart est un héros exemplaire et vertueux.', ['Vrai', 'Faux'], 1, 'Il est menteur, voleur et cruel : la satire ne propose pas de modèle.'],
            ['Que vise la satire du Roman de Renart ?', ['Les puissants, la justice féodale et l’hypocrisie religieuse', 'Les paysans', 'Les femmes de la cour', 'Les auteurs de romans courtois'], 0, 'Le rire sert de couverture à la critique sociale.'],
            ['Pourquoi faire parler des animaux plutôt que des hommes ?', ['Le masque animal permet de critiquer sans nommer directement', 'Parce que les animaux étaient à la mode', 'Pour éviter d’écrire des dialogues', 'Pour respecter les règles du roman'], 0, 'La fable utilisera plus tard exactement le même procédé.'],
          ],
        },
        {
          titre: 'Sonnets : structure et animalité (Du Bellay et Ronsard)',
          axe: 'La poésie du Moyen Âge au XVIIIe siècle',
          lecon: {
            titre: 'Quatorze vers pour dire le temps et le désir',
            cours: `Le sonnet arrive d'Italie au XVIe siècle et devient la forme reine de la poésie française avec la Pléiade.

## La structure
| La partie | Son contenu | Ses rimes |
| Deux **quatrains** | La situation, l'image posée | Le plus souvent ABBA ABBA |
| Deux **tercets** | La **rupture** : on change de ton, on répond | Combinaisons variées, CCD EED en France |
| Le dernier vers | La **chute** : elle condense tout le poème | — |

> Un sonnet, ce n'est pas un poème court : c'est un **raisonnement en quatorze vers**, avec une bascule au milieu et une pointe à la fin.

## Du Bellay : l'exil et le regret
| L'élément | Son contenu |
| Le recueil | *Les Regrets*, **1558**, écrits pendant son séjour à Rome |
| Le style | Abandon du style savant pour une langue simple et personnelle |
| Le sonnet fameux | « Heureux qui, comme Ulysse, a fait un beau voyage » |
| Son procédé | Opposer la grandeur romaine à la douceur du village natal |

> Le voyage antique sert à dire le mal du pays d'un homme réel.

## Ronsard : la fuite du temps
| L'élément | Son contenu |
| Le thème | Le **carpe diem**, hérité d'Horace : la beauté passe, il faut en jouir |
| Le sonnet fameux | « Mignonne, allons voir si la rose » |
| Son procédé | Toute une **comparaison** entre la fleur fanée en un jour et la jeunesse de Cassandre |

## L'animalité dans le sonnet
| L'image | Ce qu'elle dit |
| Le poète en **cerf blessé** | La douleur du désir |
| Le poète en **oiseau en cage** | La dépendance |
| Le poète en **abeille** qui butine | Le désir qui va de fleur en fleur |
| La dame en **biche** insaisissable | L'inaccessible |

Ces figures viennent de Pétrarque.

> L'animal n'y est pas une bête réelle : c'est un **véhicule de la métaphore**, qui permet de dire ce que le poète ne peut pas dire en propre.`,
          },
          questions: [
            ['Comment se répartissent les 14 vers d’un sonnet ?', ['Deux quatrains puis deux tercets', 'Trois quatrains puis un distique', 'Deux sizains puis un distique', 'Quatorze vers sans strophes'], 0, 'La bascule se fait au passage des quatrains aux tercets.'],
            ['Comment appelle-t-on le dernier vers du sonnet, qui condense le propos ?', ['La chute', 'La césure', 'L’envoi', 'Le refrain'], 0, 'Elle donne au sonnet sa forme de raisonnement.'],
            ['Dans quel recueil Du Bellay écrit-il « Heureux qui, comme Ulysse » ?', ['Les Regrets', 'Les Amours', 'Les Antiquités de Rome', 'Les Odes'], 0, 'Un recueil né de son séjour à Rome.'],
            ['Que dit ce sonnet de Du Bellay ?', ['Qu’il préfère son village natal à la grandeur de Rome', 'Qu’il veut rester à Rome', 'Qu’il rêve de partir en Grèce', 'Qu’il renonce à la poésie'], 0, 'Le voyage antique sert à dire le mal du pays.'],
            ['Que signifie carpe diem ?', ['Cueille le jour, profite du présent', 'Souviens-toi que tu mourras', 'Connais-toi toi-même', 'Rien de trop'], 0, 'La formule vient d’Horace ; Ronsard en fait un art d’aimer.'],
            ['Sur quelle figure repose « Mignonne, allons voir si la rose » ?', ['Une comparaison entre la rose fanée et la jeunesse qui passe', 'Une personnification du temps', 'Une allitération en r', 'Une litote'], 0, 'La fleur d’un jour donne sa leçon au poème.'],
            ['Dans le sonnet de la Pléiade, l’animal est surtout un support d’image.', ['Vrai', 'Faux'], 0, 'Cerf blessé, oiseau en cage, biche insaisissable : des métaphores du désir.'],
            ['De quel poète italien viennent ces images animales du désir ?', ['Pétrarque', 'Dante', 'Boccace', 'Virgile'], 0, 'Le pétrarquisme fournit à toute l’Europe son répertoire amoureux.'],
          ],
        },
        {
          titre: 'Universalité et pluralité de l’image du lion',
          axe: 'La poésie du Moyen Âge au XVIIIe siècle',
          lecon: {
            titre: 'Une même bête, des sens contraires',
            cours: `Le lion traverse toute la littérature — et il n'y veut jamais dire tout à fait la même chose. C'est un excellent terrain pour comprendre qu'une image n'a pas de sens fixe.

## Le lion des origines
| La source | Ce qu'il y représente |
| La **Bible** | À la fois la menace — la fosse aux lions — et la force au service du juste : Samson, Daniel |
| Les fables d'**Ésope** | Le puissant dont la part est prise d'avance : « la part du lion » |

## Le lion médiéval
| Le texte | Ce qu'il en fait |
| Le **bestiaire** | Des vertus chrétiennes : il efface ses traces, dort les yeux ouverts, ranime ses petits au troisième jour — autant de symboles du Christ |
| Le *Chevalier au lion* de Chrétien de Troyes | Le **compagnon fidèle** d'Yvain |
| Le *Roman de Renart* | **Noble**, un roi faible et partial |

> Le lion n'est ni bon ni mauvais : il est un **signe**, et un signe se lit dans son contexte.

## Le lion classique
| La fable de **La Fontaine** | Ce qu'elle montre |
| « La Génisse, la Chèvre et la Brebis en société avec le Lion » | La loi du plus fort déguisée en contrat |
| « Le Lion et le Rat » | On a toujours besoin d'un plus petit que soi : le rapport de force se retourne |

## Le lion moderne
| Son usage | Sa forme |
| **Emblème** politique | Drapeaux, blasons |
| Emblème commercial | Logos, marques |
| Sujet **romanesque** | *Le Lion* de Joseph Kessel, où l'animal sauvage interroge la place de l'homme dans la nature |

## Ce qu'il faut retenir
| Le caractère du motif | Ce qu'il signifie |
| **Universel** | On le retrouve partout |
| **Pluriel** | Il change de valeur selon l'époque, le genre et l'intention de l'auteur |`,
          },
          questions: [
            ['Que signifie l’expression « la part du lion » ?', ['La plus grosse part, prise par le plus fort', 'Une part égale pour tous', 'Une part symbolique', 'La part réservée aux invités'], 0, 'Elle vient des fables antiques d’Ésope.'],
            ['Que représente le lion dans le bestiaire médiéval chrétien ?', ['Une figure du Christ', 'Le diable uniquement', 'La paresse', 'La gourmandise'], 0, 'Il ranime ses petits au troisième jour : l’image de la résurrection.'],
            ['Dans quel roman de Chrétien de Troyes un lion devient-il le compagnon du héros ?', ['Le Chevalier au lion (Yvain)', 'Perceval', 'Lancelot', 'Érec et Énide'], 0, 'Le lion sauvé par Yvain lui reste fidèle.'],
            ['Comment s’appelle le lion du Roman de Renart ?', ['Noble', 'Ysengrin', 'Brun', 'Tibert'], 0, 'Un roi faible et partial, cible de la satire.'],
            ['Que montre « La Génisse, la Chèvre et la Brebis en société avec le Lion » ?', ['La loi du plus fort déguisée en contrat', 'La solidarité entre animaux', 'La récompense du travail', 'La supériorité de la ruse'], 0, 'Le partage est décidé d’avance par celui qui a la force.'],
            ['Quelle leçon tire-t-on du « Lion et le Rat » ?', ['On a souvent besoin d’un plus petit que soi', 'Il faut se méfier des faibles', 'La force finit toujours par gagner', 'Mieux vaut ne rien devoir à personne'], 0, 'La fable retourne le rapport de force.'],
            ['Quel écrivain du XXe siècle a intitulé un roman « Le Lion » ?', ['Joseph Kessel', 'Albert Camus', 'André Malraux', 'Romain Gary'], 0, 'Le roman interroge la place de l’homme face à la nature sauvage.'],
            ['Le sens d’un motif littéraire comme le lion est fixe d’une époque à l’autre.', ['Vrai', 'Faux'], 1, 'Universel dans sa présence, il est pluriel dans ses valeurs.'],
          ],
        },
        {
          titre: 'La fable comme écho et reflet des combats des Lumières',
          axe: 'La poésie du Moyen Âge au XVIIIe siècle',
          lecon: {
            titre: 'Une arme brève contre l’injustice',
            cours: `La fable est un récit court, souvent en vers, mettant en scène des animaux et débouchant sur une morale. C'est un apologue : un récit qui sert une démonstration.

## Sa mécanique
| Le temps | Son contenu |
| Le **récit** | La situation, la rencontre, l'issue |
| La **morale** | Explicite en tête ou en fin, parfois implicite |

| L'effet de l'**animalisation** | Ce qu'il produit |
| Le **plaisir** | La scène est plaisante, donc lue |
| La **protection** | L'auteur parle d'un loup, non d'un ministre |
| La **brièveté** | Une fable se retient, donc elle circule |

## La Fontaine, un siècle avant les Lumières
Publiées de **1668 à 1694**, les *Fables* critiquent déjà la cour, l'arbitraire du pouvoir et la justice inégale.

> « Selon que vous serez puissant ou misérable, les jugements de cour vous rendront blanc ou noir. »

## Les combats des Lumières
| Ce que le siècle **combat** | Ce qu'il **défend** |
| L'**intolérance** religieuse | La **raison** |
| La **torture** et les erreurs judiciaires — Voltaire et l'affaire Calas | La **tolérance** |
| L'**esclavage** — le nègre de Surinam dans *Candide* | L'**égalité devant la loi** |
| La **censure** et l'arbitraire du pouvoir | La liberté d'expression |

> Les Lumières n'inventent pas la fable : elles la trouvent déjà chargée, et elles la rechargent.

## Les formes voisines
| La forme | Un exemple |
| Le **conte philosophique** | *Candide*, *Micromégas* |
| Le **dictionnaire** | Le *Dictionnaire philosophique* |
| L'**article d'encyclopédie** | L'*Encyclopédie* |
| Le **pamphlet** | Des textes de combat |
| La **lettre fictive** | Les *Lettres persanes* de Montesquieu |

> Toutes partagent la stratégie de la fable : détourner le regard vers un ailleurs — un animal, un naïf, un étranger — pour faire voir le scandale de chez soi.

## L'ironie
L'arme commune : dire le contraire de ce qu'on pense pour le rendre insoutenable.

> Le lecteur qui la décode devient complice, donc convaincu par lui-même.`,
          },
          questions: [
            ['Qu’est-ce qu’un apologue ?', ['Un récit bref qui sert une démonstration', 'Un poème d’amour', 'Une pièce en un acte', 'Un discours de tribunal'], 0, 'La fable, le conte philosophique et la parabole en sont.'],
            ['De quels deux temps la fable est-elle faite ?', ['Un récit et une morale', 'Une thèse et une antithèse', 'Un prologue et un épilogue', 'Une strophe et un refrain'], 0, 'La morale peut être explicite ou implicite.'],
            ['Quel double effet produit l’animalisation des personnages ?', ['Elle plaît et elle protège l’auteur', 'Elle allonge le récit', 'Elle supprime la morale', 'Elle rend le texte plus difficile'], 0, 'On parle d’un loup, pas d’un ministre.'],
            ['Que dénonce le vers « Selon que vous serez puissant ou misérable » ?', ['L’inégalité de la justice', 'La pauvreté des campagnes', 'La guerre', 'L’ignorance du peuple'], 0, 'La fable des Animaux malades de la peste vise les jugements de cour.'],
            ['Quelle affaire judiciaire Voltaire a-t-il combattue ?', ['L’affaire Calas', 'L’affaire Dreyfus', 'L’affaire du collier', 'L’affaire Fouquet'], 0, 'Un père protestant exécuté sur des preuves inexistantes.'],
            ['Dans quel conte de Voltaire figure l’épisode du nègre de Surinam ?', ['Candide', 'Micromégas', 'Zadig', 'L’Ingénu'], 0, 'Un des textes les plus durs du siècle contre l’esclavage.'],
            ['Quel procédé partagent la fable et le conte philosophique des Lumières ?', ['L’ironie', 'La rime riche', 'Le monologue intérieur', 'Le récit à la première personne'], 0, 'Dire le contraire de ce qu’on pense pour le rendre insoutenable.'],
            ['Les Lumières ont inventé la forme de la fable.', ['Vrai', 'Faux'], 1, 'Elle est antique ; elles en héritent et la rechargent de leurs combats.'],
          ],
        },
        // ===================================================================
        // Objet d'étude 2 : la littérature d'idées et la presse du XIXe au XXIe
        // ===================================================================
        {
          titre: 'Repères : littérature d’idées et presse, du XIXe au XXIe siècle',
          axe: 'La littérature d’idées et la presse du XIXe siècle au XXIe siècle',
          lecon: {
            titre: 'Quand écrire, c’est prendre parti',
            cours: `La littérature d'idées regroupe tous les textes qui cherchent à convaincre, persuader ou faire réfléchir.

## Trois visées à distinguer
| Le verbe | Ce à quoi il s'adresse | Ses moyens |
| **Convaincre** | La **raison** | Arguments, preuves |
| **Persuader** | Les **émotions** | Images, exemples frappants, rythme |
| **Délibérer** | Le jugement | Peser plusieurs thèses avant de trancher |

Un texte efficace combine souvent les trois.

## Le XIXe siècle : le siècle de la presse
| Le facteur | Son effet |
| L'imprimerie industrielle | Des tirages de masse |
| L'**alphabétisation** | Un lectorat élargi |
| La **loi du 29 juillet 1881** | La liberté de la presse |

Écrivains et journalistes sont les mêmes hommes : **Hugo**, **Zola**, **Sand** publient dans les journaux.

> Le sommet du genre : **J'accuse… !** de Zola, en une de *L'Aurore*, le 13 janvier **1898**, pendant l'affaire Dreyfus.

> Un journal, ce n'est pas seulement de l'information : c'est une tribune, et la tribune est une forme littéraire.

## Le XXe siècle
| La cause | Un texte |
| L'antifascisme, la Résistance | Des écrits de combat |
| La **décolonisation** | Essais et discours |
| Le **féminisme** | *Le Deuxième Sexe*, Simone de Beauvoir, 1949 |
| L'antiracisme | Tribunes et récits |

La littérature d'idées doute aussi de ses propres armes, après les propagandes de masse.

## Le XXIe siècle
| Le changement | La question qu'il pose |
| Chaque lecteur devient **diffuseur** | Comment **vérifier** ? |
| De nouveaux financements | **Qui** finance ? |
| L'abondance d'**images** | Que valent-elles comme preuve ? |

Les genres migrent : tribunes en ligne, podcasts, documentaires, vidéos.

## Ce qu'on apprend à repérer
| L'élément | Sa fonction |
| La **thèse** | Ce que le texte soutient |
| Les **arguments** | Ce qui la soutient |
| Les **exemples** | Ce qui l'illustre |
| Les **connecteurs logiques** | Ce qui l'organise |
| Les **procédés de style** | Ironie, question rhétorique, hyperbole, apostrophe |`,
          },
          questions: [
            ['Quelle différence entre convaincre et persuader ?', ['Convaincre s’adresse à la raison, persuader aux émotions', 'Convaincre s’adresse aux émotions, persuader à la raison', 'Les deux sont synonymes', 'Convaincre concerne l’oral, persuader l’écrit'], 0, 'Un texte efficace combine souvent les deux.'],
            ['Que garantit la loi du 29 juillet 1881 ?', ['La liberté de la presse', 'La gratuité de l’école', 'La séparation des Églises et de l’État', 'Le droit de grève'], 0, 'Elle fait du journal le premier média de masse.'],
            ['Dans quel journal Zola publie-t-il « J’accuse…! » ?', ['L’Aurore', 'Le Figaro', 'Le Temps', 'La Presse'], 0, 'En une, le 13 janvier 1898.'],
            ['À quelle affaire ce texte est-il lié ?', ['L’affaire Dreyfus', 'L’affaire Calas', 'L’affaire du collier', 'L’affaire Stavisky'], 0, 'Une erreur judiciaire devenue crise politique.'],
            ['Qui publie « Le Deuxième Sexe » en 1949 ?', ['Simone de Beauvoir', 'Colette', 'Marguerite Duras', 'Louise Michel'], 0, 'Un essai fondateur de la pensée féministe.'],
            ['Qu’est-ce que la thèse d’un texte argumentatif ?', ['L’idée que le texte soutient', 'L’exemple le plus long', 'La conclusion du dernier paragraphe uniquement', 'Le sujet du texte'], 0, 'Les arguments la soutiennent, les exemples l’illustrent.'],
            ['Au XIXe siècle, écrivains et journalistes sont souvent les mêmes personnes.', ['Vrai', 'Faux'], 0, 'Hugo, Zola et Sand publient dans la presse.'],
            ['Quel procédé consiste à poser une question dont on attend qu’elle réponde d’elle-même ?', ['La question rhétorique', 'L’anaphore', 'La litote', 'La périphrase'], 0, 'Elle fait participer le lecteur au raisonnement.'],
          ],
        },
        {
          titre: 'Les fondamentaux du journalisme',
          axe: 'La littérature d’idées et la presse du XIXe siècle au XXIe siècle',
          lecon: {
            titre: 'Ce qui sépare une information d’une opinion',
            cours: `Le journalisme n'est pas l'art de raconter : c'est celui d'établir puis de hiérarchiser des faits.

## Les cinq questions
| La question | Ce qu'elle établit |
| **Qui** | Les acteurs |
| **Quoi** | Le fait |
| **Quand** | La date |
| **Où** | Le lieu |
| **Pourquoi** | La cause |
| **Comment** | Le déroulement |

> Ce qui est le plus important vient en premier : c'est la **pyramide inversée**, qui permet de couper la fin d'un article sans perdre l'essentiel.

## Les genres
| La famille | Le genre | Ce qu'il fait |
| **Information** | La **brève** | Le fait, en quelques lignes |
| | Le **reportage** | Le journaliste raconte ce qu'il a vu |
| | L'**interview** | Il donne la parole |
| | L'**enquête** | Une recherche longue sur ce qu'on veut cacher |
| **Opinion** | L'**éditorial** | La position du journal |
| | La **chronique**, la **critique** | Un point de vue signé |
| | La **tribune** | Signée par quelqu'un d'extérieur |

> Confondre les deux familles est la première source de malentendus. Un fait se **vérifie**, une opinion se **discute** — et un journal honnête signale clairement laquelle des deux il publie.

## L'habillage
| L'élément | Son rôle |
| Le **titre** | Il accroche |
| Le **chapô** | Il résume |
| L'**attaque** | La première phrase |
| La **chute** | La dernière |
| L'**intertitre** | Il aère |
| La **légende** | Elle dit ce que la photo ne dit pas seule |

## La déontologie
La **Charte de Munich** (1971) fixe les devoirs :
- respecter la **vérité** et vérifier avant de publier ;
- ne pas dénaturer les informations ;
- **rectifier** ses erreurs ;
- protéger ses **sources** ;
- ne pas confondre le métier avec la publicité.

> Un fait se **recoupe** : on le tient d'au moins deux sources indépendantes.

## Vérifier aujourd'hui
| Le réflexe | Ce qu'il permet |
| Remonter à la **source primaire** | Voir le document d'origine |
| Dater et localiser une image | Une recherche d'image inversée |
| Distinguer le **compte satirique** du média d'information | Éviter le contresens |
| Se méfier des titres à forte émotion | C'est souvent leur seule fonction |`,
          },
          questions: [
            ['Quelles sont les cinq questions de base d’un article ?', ['Qui, quoi, quand, où, pourquoi', 'Comment, combien, pourquoi, quand, qui', 'Où, quand, combien, à qui, pour quoi faire', 'Qui, comment, combien, pourquoi, où'], 0, 'Souvent complétées par « comment ».'],
            ['Qu’est-ce que la pyramide inversée ?', ['Donner l’essentiel d’abord, les détails ensuite', 'Terminer par l’information principale', 'Alterner faits et opinions', 'Classer les articles par longueur'], 0, 'Elle permet de couper la fin sans perdre l’essentiel.'],
            ['Lequel de ces genres relève de l’opinion et non de l’information ?', ['L’éditorial', 'La brève', 'Le reportage', 'L’enquête'], 0, 'Il exprime la position du journal.'],
            ['Qu’est-ce qu’un chapô ?', ['Le court texte qui résume l’article sous le titre', 'La première phrase de l’article', 'La légende d’une photo', 'La signature du journaliste'], 0, 'L’attaque est la première phrase, la chute la dernière.'],
            ['Que fixe la Charte de Munich de 1971 ?', ['Les devoirs et les droits des journalistes', 'Le prix des journaux', 'La formation des rédacteurs', 'Le statut des photographes'], 0, 'Vérité, vérification, rectification, protection des sources.'],
            ['Que signifie recouper une information ?', ['La confirmer par au moins deux sources indépendantes', 'La raccourcir', 'La publier en plusieurs parties', 'La traduire'], 0, 'Une source unique ne suffit jamais.'],
            ['Une opinion se vérifie de la même manière qu’un fait.', ['Vrai', 'Faux'], 1, 'Un fait se vérifie, une opinion se discute.'],
            ['Quel réflexe permet de dater et situer une photo suspecte ?', ['La recherche d’image inversée', 'La lecture des commentaires', 'Le comptage des partages', 'La vérification de l’orthographe'], 0, 'Elle retrouve les publications antérieures de la même image.'],
          ],
        },
        {
          titre: 'La presse au XIXe siècle, essor journalistique et littéraire',
          axe: 'La littérature d’idées et la presse du XIXe siècle au XXIe siècle',
          lecon: {
            titre: 'Le siècle où le journal devient une machine',
            cours: `En cent ans, le journal passe d'une feuille coûteuse réservée à quelques milliers de lecteurs au premier objet culturel de masse.

## Les conditions de l'essor
| La cause | Son contenu |
| Les **progrès techniques** | Presse rotative, papier bon marché, télégraphe, chemin de fer pour la diffusion |
| L'**alphabétisation** | Accélérée par les lois **Ferry** de 1881-1882 : école gratuite, laïque, obligatoire |
| L'invention **économique** de Girardin | En **1836**, il divise par deux le prix de *La Presse* en la finançant par la **publicité** |

## Le roman-feuilleton
Pour fidéliser le lecteur, on publie un roman en épisodes au bas de la une.

| L'auteur | Son feuilleton |
| **Eugène Sue** | *Les Mystères de Paris* |
| **Alexandre Dumas** | *Les Trois Mousquetaires*, *Le Comte de Monte-Cristo* |

| La contrainte | Son effet sur l'écriture |
| Le **suspense** en fin d'épisode | Des chapitres courts |
| La parution régulière | Des rebondissements fréquents |
| Un public large | Des personnages **typés**, reconnaissables |

> La littérature et le journalisme partagent le même papier, les mêmes auteurs et le même public : au XIXe siècle, la frontière entre les deux est un mince filet de colle.

## Les grands textes de combat
| L'auteur | Son combat |
| **Hugo** | Contre le coup d'État de Louis-Napoléon Bonaparte, et contre la peine de mort |
| **Zola** | **J'accuse… !** (1898), qui lui vaudra un procès et l'exil |

La **loi de 1881** protège cette liberté tout en punissant la diffamation.

## L'autre face
| L'invention du siècle | Son revers |
| Le **fait divers**, la chronique judiciaire | La course au sensationnel |
| Les **campagnes de presse** | Elles peuvent détruire une réputation |
| La **caricature** — Daumier, *Le Charivari* | Censure et procès |

## Ce qui reste
La une, le titre accrocheur, la série à épisodes, la tribune signée, le débat public par journaux interposés.`,
          },
          questions: [
            ['Quelle invention économique Girardin introduit-il en 1836 ?', ['Financer le journal par la publicité pour en baisser le prix', 'Vendre le journal par abonnement uniquement', 'Supprimer les illustrations', 'Imprimer sur du papier de luxe'], 0, 'La Presse coûte deux fois moins cher que ses concurrents.'],
            ['Qu’est-ce qu’un roman-feuilleton ?', ['Un roman publié en épisodes dans un journal', 'Un roman écrit par plusieurs auteurs', 'Un roman illustré', 'Un roman court en un seul numéro'], 0, 'Il se termine sur un suspense pour faire acheter le numéro suivant.'],
            ['Quel auteur publie « Les Mystères de Paris » en feuilleton ?', ['Eugène Sue', 'Alexandre Dumas', 'Émile Zola', 'Honoré de Balzac'], 0, 'Un immense succès populaire des années 1840.'],
            ['Que garantissent les lois Ferry de 1881-1882 ?', ['Une école gratuite, laïque et obligatoire', 'La liberté de la presse', 'Le droit de vote des femmes', 'La liberté syndicale'], 0, 'L’alphabétisation crée le public des journaux.'],
            ['Quelle technique permet la diffusion rapide des dépêches au XIXe siècle ?', ['Le télégraphe', 'Le téléphone portable', 'La radio', 'La photographie'], 0, 'Relayé par le chemin de fer pour la distribution.'],
            ['Contre quoi Victor Hugo mène-t-il campagne dans la presse ?', ['La peine de mort et le coup d’État de 1851', 'La liberté de la presse', 'L’école gratuite', 'Le roman-feuilleton'], 0, 'Il paiera son opposition de dix-neuf ans d’exil.'],
            ['La loi de 1881 supprime toute sanction contre les journaux.', ['Vrai', 'Faux'], 1, 'Elle protège la liberté mais punit notamment la diffamation.'],
            ['Quel dessinateur incarne la caricature de presse au XIXe siècle ?', ['Honoré Daumier', 'Gustave Doré', 'Édouard Manet', 'Félix Nadar'], 0, 'Il publie notamment dans Le Charivari, sous la censure.'],
          ],
        },
        {
          titre: 'Victor Hugo, « Exil » : l’absence et le manque (XIXe siècle)',
          axe: 'La littérature d’idées et la presse du XIXe siècle au XXIe siècle',
          lecon: {
            titre: 'Un poète chassé qui fait de son absence une arme',
            cours: `Le 2 décembre 1851, Louis-Napoléon Bonaparte prend le pouvoir par un coup d'État. Victor Hugo, député opposé au coup de force, fuit.

## Le parcours de l'exil
| L'étape | Sa date |
| Le **coup d'État** | 2 décembre 1851 |
| Bruxelles, puis Jersey | 1852-1855 |
| **Guernesey** | 1855-1870 |
| Le retour | **1870**, après dix-neuf ans |

## Un exil choisi
Hugo aurait pu accepter l'**amnistie de 1859**. Il la refuse : quand la liberté rentrera, il rentrera.

> L'exil cesse d'être une punition subie pour devenir une **position morale** — et le poète en tire une autorité que le pouvoir ne peut pas lui retirer.

> « Et s'il n'en reste qu'un, je serai celui-là. » (*Ultima verba*, *Les Châtiments*)

## Deux registres, deux recueils
| Le recueil | Sa date | Son registre | Son sujet |
| *Les Châtiments* | 1853 | La **colère** : satire, invective, pamphlet en vers | « Napoléon le Petit » |
| *Les Contemplations* | 1856 | Le **deuil** | La mort de **Léopoldine**, noyée en 1843 |

*Les Contemplations* s'organisent en « Autrefois » et « Aujourd'hui », séparés par ce gouffre.

## Dire l'absence
| Le procédé | Ce qu'il produit |
| L'**antithèse** entre ici et là-bas | Le partage du monde en deux |
| Le **champ lexical** de la mer et de l'île | L'enfermement et l'horizon |
| L'**apostrophe** au pays perdu | Il devient un interlocuteur |
| L'**anaphore** | Elle martèle |
| La **personnification** de la France ou de l'Océan | Des forces qui répondent |

> Le lieu de l'exil, l'île, est à la fois prison et poste d'observation.

## L'exil comme force
Hugo continue de publier, se fait photographier sur son rocher, écrit *Les Misérables* à Guernesey.

> Absent du territoire, il devient omniprésent dans les esprits : l'exil, chez lui, est une manière de rester.`,
          },
          questions: [
            ['Quel événement provoque l’exil de Victor Hugo ?', ['Le coup d’État du 2 décembre 1851', 'La révolution de 1848', 'La Commune de Paris', 'La guerre de 1870'], 0, 'Il s’oppose à Louis-Napoléon Bonaparte, futur Napoléon III.'],
            ['Sur quelle île Hugo passe-t-il l’essentiel de son exil ?', ['Guernesey', 'La Corse', 'Sainte-Hélène', 'Malte'], 0, 'Après Bruxelles et Jersey.'],
            ['Pourquoi refuse-t-il l’amnistie de 1859 ?', ['Il ne veut rentrer que lorsque la liberté sera rétablie', 'Il craint d’être arrêté', 'Il ne peut plus voyager', 'Il a perdu la nationalité française'], 0, 'Le refus transforme la punition en position morale.'],
            ['Quel recueil de 1853 est le pamphlet en vers contre Napoléon III ?', ['Les Châtiments', 'Les Contemplations', 'Les Feuilles d’automne', 'La Légende des siècles'], 0, 'Satire et invective y dominent.'],
            ['Quel deuil est au cœur des Contemplations ?', ['La mort de sa fille Léopoldine', 'La mort de sa femme', 'La mort de son frère', 'La mort de son père'], 0, 'Noyée en 1843 ; le recueil se partage entre « Autrefois » et « Aujourd’hui ».'],
            ['Quelle figure oppose deux réalités, ici le pays perdu et l’île ?', ['L’antithèse', 'L’allitération', 'L’ellipse', 'La litote'], 0, 'Elle structure toute la poésie de l’exil.'],
            ['Hugo a cessé d’écrire pendant son exil.', ['Vrai', 'Faux'], 1, 'Il y écrit notamment Les Misérables.'],
            ['Quel vers résume la solitude assumée du poète en exil ?', ['« Et s’il n’en reste qu’un, je serai celui-là »', '« Demain, dès l’aube… »', '« Je suis une force qui va »', '« Un vent d’oubli passe sur nous »'], 0, 'Il clôt Ultima verba, dans Les Châtiments.'],
          ],
        },
        {
          titre: 'Exil en poésie, poésie en exil (XXe siècle)',
          axe: 'La littérature d’idées et la presse du XIXe siècle au XXIe siècle',
          lecon: {
            titre: 'Écrire depuis l’ailleurs, au siècle des déplacements forcés',
            cours: `Le XXe siècle est celui des exils de masse : guerres mondiales, régimes totalitaires, guerres coloniales, dictatures. La poésie enregistre ces départs et en fait une forme.

## Deux exils
| L'exil | Ce qu'il est |
| **Subi** | On fuit une menace |
| **Intérieur** | On reste au pays, mais on ne s'y reconnaît plus |

Beaucoup de poèmes du siècle jouent des deux à la fois.

## Des voix
| Le poète | Son exil et son œuvre |
| **Aimé Césaire** | Le *Cahier d'un retour au pays natal* (1939) : le retour comme épreuve ; il forge le mot **négritude**, transformant une insulte en fierté |
| **Léopold Sédar Senghor** | Il écrit l'Afrique depuis Paris |
| **Nâzim Hikmet** | Poète turc, il écrit depuis la prison puis l'exil |
| **Paul Celan** | Survivant de la Shoah, il écrit en **allemand** — la langue des bourreaux — une poésie trouée |
| **Mahmoud Darwich** | Il fait de la Palestine perdue un territoire de langue |

> Quand la terre manque, il reste la langue : beaucoup de poètes exilés en font leur seul pays.

## Ce que l'exil fait à la forme
| Le procédé | Ce qu'il imite |
| Le **vers libre** | La rupture avec l'ordre ancien |
| Les **blancs** typographiques, les phrases inachevées | Ce qui manque |
| Le **plurilinguisme** | Des mots de la langue perdue au milieu du poème |

| L'image récurrente | Ce qu'elle porte |
| La valise, le train | Le départ |
| La frontière, la mer | Le passage |
| La fenêtre, la carte | Le regard vers l'ailleurs |
| La **clé** d'une maison qui n'existe plus | La perte irréversible |

## Chanter aussi
La chanson prolonge ces poèmes — Barbara, Ferré, Moustaki, plus tard le rap — parce qu'elle circule là où le livre n'entre pas.

## Lire un poème d'exil
| La question | Ce qu'elle cherche |
| Que **nomme**-t-il ? | Un lieu, une date, un nom propre |
| Que **tait**-il ? | Les silences, les blancs |
| Comment sa **forme** imite-t-elle la rupture ? | Vers coupés, énumérations qui s'essoufflent, retours obsessionnels d'un même mot |`,
          },
          questions: [
            ['Quelle différence entre exil subi et exil intérieur ?', ['L’un fait quitter le pays, l’autre se vit sur place sans s’y reconnaître', 'L’un est temporaire, l’autre définitif', 'L’un concerne les écrivains, l’autre les citoyens', 'Il n’y a aucune différence'], 0, 'Beaucoup de poèmes du XXe siècle mêlent les deux.'],
            ['Quel poète forge le mot négritude dans le Cahier d’un retour au pays natal ?', ['Aimé Césaire', 'Léopold Sédar Senghor', 'Mahmoud Darwich', 'Paul Celan'], 0, 'Le mot retourne une insulte en fierté.'],
            ['Dans quelle langue Paul Celan, rescapé de la Shoah, écrit-il ?', ['En allemand', 'En yiddish', 'En roumain', 'En français'], 0, 'Écrire dans la langue des bourreaux est au cœur de son œuvre.'],
            ['Quel poète fait de la Palestine perdue un territoire de langue ?', ['Mahmoud Darwich', 'Nâzim Hikmet', 'Aimé Césaire', 'Léopold Sédar Senghor'], 0, 'La langue devient le pays qui manque.'],
            ['Quelle forme le poème d’exil privilégie-t-il souvent au XXe siècle ?', ['Le vers libre, avec ruptures et blancs', 'L’alexandrin régulier', 'Le sonnet', 'La ballade'], 0, 'La forme imite la rupture qu’elle raconte.'],
            ['Qu’appelle-t-on plurilinguisme dans un poème ?', ['La présence de plusieurs langues dans le même texte', 'La traduction du poème', 'L’emploi de mots rares', 'Le mélange de prose et de vers'], 0, 'Des mots de la langue perdue surgissent dans le poème.'],
            ['La chanson a prolongé les poèmes d’exil au XXe siècle.', ['Vrai', 'Faux'], 0, 'Elle circule là où le livre n’entre pas.'],
            ['Que faut-il chercher en lisant un poème d’exil ?', ['Ce qu’il nomme, ce qu’il tait, et ce que sa forme imite', 'Le nombre de strophes uniquement', 'La date de publication seule', 'La biographie complète de l’auteur'], 0, 'Le non-dit est aussi signifiant que le dit.'],
          ],
        },
        {
          titre: 'Mise en scène de destins en souffrance : Migrants, Sonia Ristic (XXIe siècle)',
          axe: 'La littérature d’idées et la presse du XIXe siècle au XXIe siècle',
          lecon: {
            titre: 'Le théâtre documentaire face à l’actualité',
            cours: `Sonia Ristić, née à Belgrade en 1972, a elle-même connu l'exil au moment des guerres de Yougoslavie. Sa pièce *Migrants* porte à la scène des trajectoires contemporaines.

## Un théâtre de l'urgence
La pièce appartient au **théâtre documentaire**, ou théâtre du réel.

| Sa matière première | Sa transformation |
| Témoignages, rapports, articles | Mis en forme dramatique |

> Le spectateur n'est pas invité à s'évader, mais à regarder ce qu'il croit déjà connaître par les journaux.

## Des voix plutôt que des héros
| Qui parle | Ce que cela produit |
| Des personnes déplacées, des passeurs, des fonctionnaires, des témoins | Une écriture **chorale** |
| Parfois sans être nommés | Le destin individuel cède la place à une **situation collective** |

> Le chiffre anesthésie, le récit réveille : c'est le pari du théâtre documentaire.

## Le procédé
| Le choix scénique | Son effet |
| Récits **fragmentés**, monologues | Aucune intrigue linéaire à suivre |
| L'**adresse directe** au public | Le spectateur est pris à partie |
| L'**absence de décor** réaliste | Le plateau vide oblige à imaginer |
| L'alternance concret / silence | Un nom de ville, une somme, une durée d'attente — puis rien |

## De quoi ça parle vraiment
Moins de la migration comme problème politique que de ce que **l'attente, la frontière et l'administration** font à des personnes : la dignité, la peur, l'espoir, la mémoire du pays quitté.

> Le texte ne conclut pas à la place du public : il installe une question.

## À rapprocher
Romans, documentaires, photographies, chansons.

> La question posée par tous est la même : comment représenter la souffrance d'autrui sans la transformer en spectacle ?`,
          },
          questions: [
            ['D’où vient Sonia Ristić ?', ['De Belgrade, en ex-Yougoslavie', 'De Grèce', 'Du Maroc', 'De Roumanie'], 0, 'Elle a elle-même connu l’exil pendant les guerres de Yougoslavie.'],
            ['À quelle famille théâtrale la pièce Migrants appartient-elle ?', ['Le théâtre documentaire, ou théâtre du réel', 'La comédie de mœurs', 'La tragédie classique', 'Le vaudeville'], 0, 'Elle part de témoignages et de documents.'],
            ['Qu’est-ce qu’une écriture chorale ?', ['Une écriture qui fait entendre plusieurs voix sans héros unique', 'Une pièce entièrement chantée', 'Un texte écrit à plusieurs auteurs', 'Un dialogue à deux personnages'], 0, 'Elle remplace le destin individuel par une situation collective.'],
            ['Quel effet vise le plateau vide, sans décor réaliste ?', ['Obliger le spectateur à imaginer', 'Réduire le coût de la production', 'Rendre la pièce plus courte', 'Faciliter les déplacements des acteurs'], 0, 'L’imagination fait plus que l’illustration.'],
            ['Que signifie l’adresse directe au public au théâtre ?', ['Un personnage s’adresse aux spectateurs sans passer par la fiction', 'Les acteurs improvisent', 'Le public monte sur scène', 'Le texte est distribué à l’entrée'], 0, 'Elle rompt l’illusion et implique la salle.'],
            ['Quel est le pari du théâtre documentaire face aux chiffres de l’actualité ?', ['Le récit réveille là où le chiffre anesthésie', 'Le chiffre est plus convaincant', 'Il faut éviter tout témoignage', 'Il faut divertir avant d’informer'], 0, 'Un nom et une durée d’attente frappent plus qu’une statistique.'],
            ['Migrants propose une solution politique claire en conclusion.', ['Vrai', 'Faux'], 1, 'La pièce installe une question plutôt qu’une réponse.'],
            ['Quelle question éthique traverse ce type d’œuvres ?', ['Comment représenter la souffrance d’autrui sans en faire un spectacle', 'Comment financer une création théâtrale', 'Comment écrire en alexandrins', 'Comment respecter les trois unités'], 0, 'Elle vaut pour le théâtre, le roman et la photographie.'],
          ],
        },
        // ===================================================================
        // Objet d'étude 3 : le roman et le récit du XVIIIe au XXIe siècle
        // ===================================================================
        {
          titre: 'Repères : le roman et le récit, du XVIIIe au XXIe siècle',
          axe: 'Le roman et le récit du XVIIIe siècle au XXIe siècle',
          lecon: {
            titre: 'Trois siècles de romans, et les outils pour les lire',
            cours: `Le roman est le genre qui change le plus vite, parce qu'il n'a jamais eu de règles fixes. C'est aussi celui qui prétend le plus souvent dire la vérité sur la société.

## Les outils de base
| L'outil | Ses valeurs |
| Le **narrateur** | **Externe** (troisième personne, de l'extérieur) ou **interne** (un personnage raconte) |
| Le **point de vue** | **Zéro** (il sait tout), **interne** (on ne sait que ce qu'un personnage sait), **externe** (on ne voit que les comportements) |

> Le narrateur n'est pas l'auteur.

| Le rythme du récit | Ce qu'il fait |
| Le **sommaire** | On résume |
| La **scène** | On raconte au rythme réel |
| L'**ellipse** | On saute |
| La **pause** | On décrit |

## Trois siècles en un tableau
| Le siècle | Ce que le roman y devient | Ses auteurs |
| **XVIIIe** | Il conquiert sa légitimité en se **déguisant** | Laclos (*Les Liaisons dangereuses*), Prévost (*Manon Lescaut*), Voltaire (*Candide*) |
| **XIXe** | **Réalisme** et **naturalisme** : le personnage est déterminé par son milieu | **Balzac**, **Flaubert**, **Zola** |
| **XXe** | Le récit **doute de lui-même** | **Proust**, **Céline**, **Camus**, le Nouveau Roman |
| **XXIe** | Retour du **récit du réel** | Autofiction, récits de filiation, romans d'enquête |

## Le XVIIIe siècle
Roman par lettres, mémoires fictifs, conte philosophique : le roman raconte l'apprentissage d'un individu confronté au monde.

## Le XIXe siècle
Balzac veut faire concurrence à l'état civil, Flaubert travaille la banalité, Zola applique au roman une méthode qu'il dit expérimentale.

> Le roman du XIXe siècle raconte moins des aventures que des **places sociales** : monter, tomber, tenir.

## Le XXe siècle
Monologue intérieur, chronologie éclatée, personnage sans nom ni psychologie stable. Proust explore la mémoire, Céline casse la langue écrite, Camus écrit une voix blanche, le Nouveau Roman supprime l'intrigue.

## Le XXIe siècle
Le roman reprend le rôle de témoin, sans renoncer aux libertés gagnées au siècle précédent.`,
          },
          questions: [
            ['Le narrateur d’un roman est-il l’auteur ?', ['Non, c’est une voix construite par le texte', 'Oui, toujours', 'Oui, sauf dans les récits à la première personne', 'Seulement dans les romans historiques'], 0, 'Confondre les deux est l’erreur la plus fréquente en commentaire.'],
            ['Qu’est-ce que la focalisation interne ?', ['On ne connaît que ce que sait un personnage', 'Le narrateur sait tout de tous', 'On ne voit que les comportements extérieurs', 'Le récit est écrit à la première personne'], 0, 'Elle produit l’identification et le suspense par ignorance.'],
            ['Qu’est-ce qu’une ellipse narrative ?', ['Un moment du récit passé sous silence', 'Une longue description', 'Un dialogue rapporté', 'Un retour en arrière'], 0, 'Elle accélère le récit en sautant du temps.'],
            ['Quel roman du XVIIIe siècle est écrit entièrement par lettres ?', ['Les Liaisons dangereuses', 'Manon Lescaut', 'Candide', 'La Princesse de Clèves'], 0, 'Laclos y fait de la forme épistolaire une arme.'],
            ['Que voulait faire Balzac avec La Comédie humaine ?', ['Faire concurrence à l’état civil en peignant toute la société', 'Écrire un seul roman parfait', 'Réformer la langue française', 'Défendre la monarchie'], 0, 'Des personnages reparaissent d’un roman à l’autre.'],
            ['Quel écrivain revendique une méthode dite expérimentale pour le roman ?', ['Émile Zola', 'Gustave Flaubert', 'Stendhal', 'Marcel Proust'], 0, 'Le naturalisme applique au récit un modèle scientifique.'],
            ['Le XXe siècle conserve intacte la structure du roman réaliste.', ['Vrai', 'Faux'], 1, 'Monologue intérieur, chronologie éclatée, personnage instable la défont.'],
            ['Qu’est-ce que l’autofiction ?', ['Un récit qui mêle éléments autobiographiques et fiction assumée', 'Une biographie officielle', 'Un roman écrit par plusieurs auteurs', 'Un récit de voyage'], 0, 'Le pacte de lecture y est volontairement ambigu.'],
          ],
        },
        {
          titre: 'Récit réaliste et critique sociale : Maupassant et le XIXe siècle',
          axe: 'Le roman et le récit du XVIIIe siècle au XXIe siècle',
          lecon: {
            titre: 'Peindre le réel pour le mettre en accusation',
            cours: `Le réalisme ne se contente pas de décrire : il choisit ce qu'il décrit, et ce choix est déjà un jugement.

## Le programme réaliste
| Ce qu'il écrit | Ce qu'il abandonne |
| Les métiers, l'argent, les intérieurs, les corps | L'idéalisation |
| La province autant que Paris | Le seul monde des salons |

| L'outil | Son rôle |
| La **documentation** | Zola visite des mines, Flaubert lit des traités |
| Le **détail vrai** | Il fait croire au reste |
| Le **discours indirect libre** | Il fait passer les pensées d'un personnage dans le récit, sans guillemets ni verbe introducteur |

## Maupassant
| Le fait | Son détail |
| Ses dates | 1850-1893 |
| Son maître | **Flaubert** |
| Son œuvre | Environ **trois cents nouvelles** |
| Sa forme | Peu de pages, une situation resserrée, souvent une **chute** qui retourne le sens |

> Dans « La Parure », dix ans de misère pour rembourser un bijou faux : la chute ne surprend pas seulement, elle **accuse**.

## Ce qu'il met en accusation
| La cible | La nouvelle |
| La **hiérarchie sociale** et le mépris | « Boule de suif » : des notables sacrifient une prostituée, puis la méprisent |
| La **vanité** et l'apparence | « La Parure » |
| L'**hypocrisie** familiale et l'argent | « Aux champs », « Mon oncle Jules » |
| La **guerre** de 1870 et ses lâchetés | Plusieurs récits |

## Comment il s'y prend
| Le procédé | Son effet |
| Un narrateur qui **montre** sans expliquer | Le lecteur juge lui-même |
| Une **ironie froide** | Les personnages se condamnent par leurs propres paroles |
| Des descriptions **brèves mais orientées** | Une robe, une pièce de monnaie, une soupe disent la place sociale |

## Réalisme et naturalisme
| Le courant | Sa thèse |
| Le **réalisme** | Décrire le personnage **dans** son milieu |
| Le **naturalisme** | Le personnage est le **produit** de son hérédité et de son milieu |

> Maupassant reste plus proche du réalisme : il accuse la société sans se réclamer d'une science.`,
          },
          questions: [
            ['Qu’est-ce que le discours indirect libre ?', ['Les pensées d’un personnage passent dans le récit sans guillemets ni verbe introducteur', 'Un dialogue entre deux personnages', 'Un monologue au théâtre', 'Une citation entre guillemets'], 0, 'Il permet l’ironie : on ne sait plus qui parle, du personnage ou du narrateur.'],
            ['De qui Maupassant a-t-il été l’élève ?', ['Gustave Flaubert', 'Honoré de Balzac', 'Victor Hugo', 'Stendhal'], 0, 'Flaubert lui apprend l’exigence de la phrase.'],
            ['Qu’est-ce que la chute d’une nouvelle ?', ['Le retournement final qui éclaire tout le récit', 'La première phrase', 'La description initiale', 'Le titre du texte'], 0, 'Dans « La Parure », elle révèle que le bijou était faux.'],
            ['Que dénonce « Boule de suif » ?', ['L’hypocrisie et la lâcheté des notables', 'La misère paysanne', 'La corruption de la presse', 'L’exil politique'], 0, 'Ils se servent d’une prostituée puis la méprisent.'],
            ['Quel objet ordinaire suffit souvent, chez Maupassant, à dire une position sociale ?', ['Un détail matériel comme une robe ou une pièce de monnaie', 'Un discours du narrateur', 'Une citation latine', 'Un portrait psychologique long'], 0, 'Montrer plutôt qu’expliquer : c’est la méthode réaliste.'],
            ['Qu’ajoute le naturalisme au programme réaliste ?', ['L’idée que le personnage est le produit de son hérédité et de son milieu', 'Le refus de la description', 'Le retour au merveilleux', 'L’abandon du narrateur externe'], 0, 'Zola en fait une méthode revendiquée.'],
            ['Le réalisme décrit le monde sans jamais porter de jugement.', ['Vrai', 'Faux'], 1, 'Le choix de ce qu’on décrit est déjà un jugement.'],
            ['Quel ton domine chez Maupassant pour laisser les personnages se juger eux-mêmes ?', ['Une ironie froide', 'Le lyrisme', 'L’emphase épique', 'Le pathétique appuyé'], 0, 'Le narrateur ne commente pas : il rapporte.'],
          ],
        },
        {
          titre: 'L’Étranger de Camus : une œuvre « à part »',
          axe: 'Le roman et le récit du XVIIIe siècle au XXIe siècle',
          lecon: {
            titre: 'Un roman écrit à voix blanche',
            cours: `Publié en 1942, *L'Étranger* d'Albert Camus raconte à la première personne quelques mois de la vie de Meursault, employé à Alger.

## L'histoire
| L'étape | Ce qui se passe |
| Le début | La mort de sa mère, et l'enterrement |
| Ensuite | Une liaison avec Marie, une vie ordinaire |
| Le basculement | Un **meurtre** sur une plage, sous un soleil écrasant |
| La fin | Le procès, et la condamnation à mort |

## Une langue sans effet
| Le trait | Son effet |
| Un français **court**, au **passé composé** | Les faits arrivent comme des constats |
| Aucune subordination complexe, aucune image | Rien n'est interprété pour le lecteur |

> Cette **voix blanche** produit un malaise : le narrateur dit tout et n'explique rien.

## Un héros qui ne joue pas le jeu
| Ce que Meursault ne fait pas | Ce qu'on lui reproche |
| Pleurer à l'enterrement de sa mère | D'avoir « enterré sa mère avec un cœur de criminel » |
| Mentir, dire qu'il aime | De ne pas se conformer |
| Se justifier | De refuser le rituel du procès |

> Ce n'est pas l'acte qui est jugé, c'est l'**écart**. La société ne pardonne pas qu'on refuse ses rituels.

## L'absurde
Camus range l'œuvre dans son « cycle de l'absurde ».

| L'œuvre du cycle | Son genre |
| *L'Étranger* | Roman |
| *Le Mythe de Sisyphe* | Essai |
| *Caligula* | Théâtre |

L'**absurde** naît de la rencontre entre le besoin humain de sens et le silence du monde.

> La révolte, chez Camus, consiste à vivre lucidement sans se raconter d'histoires.

## Deux parties, deux temps
| La partie | Ce qu'elle fait |
| **Première** | Elle suit une vie ordinaire jusqu'au meurtre |
| **Seconde** | La prison et le procès **relisent** ces mêmes faits, et les déforment |

> Racontés par d'autres, les mêmes faits deviennent des preuves de monstruosité. Le roman démonte ainsi la **fabrication d'une culpabilité**.

## Une œuvre à part
À part par sa langue, par son héros, et par sa place : traduit dans le monde entier, l'un des romans français les plus lus — et l'un des plus discutés, notamment pour la figure sans nom de l'Arabe tué sur la plage.`,
          },
          questions: [
            ['En quelle année paraît L’Étranger ?', ['1942', '1932', '1957', '1968'], 0, 'Camus recevra le prix Nobel en 1957.'],
            ['Comment s’appelle le narrateur du roman ?', ['Meursault', 'Rieux', 'Caligula', 'Clamence'], 0, 'Il raconte à la première personne.'],
            ['Quel temps verbal domine le récit ?', ['Le passé composé', 'Le passé simple', 'Le présent de narration', 'L’imparfait'], 0, 'Il donne au récit sa platitude volontaire.'],
            ['Qu’appelle-t-on la voix blanche du roman ?', ['Une écriture neutre, sans effets ni explications', 'Un narrateur qui crie', 'Un texte sans dialogue', 'Un récit écrit en vers'], 0, 'Elle produit le malaise du lecteur.'],
            ['Pour quoi Meursault est-il en réalité condamné, selon le roman ?', ['Pour son écart avec les rituels sociaux, autant que pour le meurtre', 'Pour vol', 'Pour trahison', 'Pour blasphème'], 0, 'On lui reproche de n’avoir pas pleuré à l’enterrement de sa mère.'],
            ['Dans quel cycle Camus range-t-il L’Étranger ?', ['Le cycle de l’absurde', 'Le cycle de la révolte', 'Le cycle de l’amour', 'Le cycle du pouvoir'], 0, 'Avec Le Mythe de Sisyphe et Caligula.'],
            ['Qu’est-ce que l’absurde chez Camus ?', ['La rencontre entre le besoin humain de sens et le silence du monde', 'Une situation comique', 'Une erreur de raisonnement', 'Un refus de la morale'], 0, 'La lucidité, et non le désespoir, en est la réponse.'],
            ['La seconde partie du roman raconte des faits nouveaux, sans lien avec la première.', ['Vrai', 'Faux'], 1, 'Elle relit les mêmes faits et montre comment on fabrique une culpabilité.'],
          ],
        },
        {
          titre: 'L’autobiographie : pourquoi s’écrire ? Comment s’écrire ?',
          axe: 'Le roman et le récit du XVIIIe siècle au XXIe siècle',
          lecon: {
            titre: 'Le récit de soi et ses pièges',
            cours: `L'autobiographie est le récit rétrospectif qu'une personne réelle fait de sa propre existence, en mettant l'accent sur sa vie individuelle.

## Le pacte autobiographique
| Ce qui doit coïncider | La conséquence |
| L'**auteur**, le **narrateur** et le **personnage** | C'est la même personne |

C'est le **pacte autobiographique**, formulé par Philippe Lejeune.

## Les genres voisins
| Le genre | Ce qui le distingue |
| Les **Mémoires** | Ils racontent une **époque**, à travers un témoin |
| Le **journal intime** | Il s'écrit au jour le jour, sans recul |
| Le **roman autobiographique** | La fiction sert de paravent |
| L'**autofiction** | Elle assume de mêler les deux |
| Le **récit de filiation** | Il part des parents ou des grands-parents pour se comprendre soi |

## Pourquoi s'écrire
| Le motif | Son exemple |
| Se **justifier** | **Rousseau** ouvre *Les Confessions* (1782) en promettant de tout dire |
| **Témoigner** | Les récits de déportation, **Primo Levi** |
| Comprendre son **parcours social** | **Annie Ernaux** |
| Garder une **mémoire menacée** | Récits de familles, de langues, de métiers disparus |

> « Je forme une entreprise qui n'eut jamais d'exemple. » — Rousseau, *Les Confessions*.

## Comment s'écrire : trois problèmes
| Le problème | Sa difficulté |
| Le **temps** | Deux « je » cohabitent : celui qui vécut et celui qui écrit — et le second sait ce que le premier ignorait |
| La **mémoire** | Elle trie, déforme, invente sans le vouloir |
| La **sincérité** | Elle n'est pas la vérité : on ne se raconte jamais devant personne |

## Le style
| Le choix | Ce qu'il produit |
| Le **temps** verbal | Imparfait de l'habitude, passé composé du bilan, présent qui rapproche |
| La **distance** | Ironie, tendresse, froideur |
| Le **cadre** | Une maison, une classe, un objet |

> Annie Ernaux écrit dans une langue volontairement plate, sans effets, pour ne pas trahir le milieu dont elle vient : c'est une décision politique autant qu'esthétique.

## Lire une autobiographie
Ne pas croire tout ce qu'elle dit, ne pas la réduire à un document : chercher ce qu'elle **choisit** de raconter, ce qu'elle **tait**, et **pour qui** elle est écrite.`,
          },
          questions: [
            ['Qu’est-ce que le pacte autobiographique ?', ['L’identité entre auteur, narrateur et personnage', 'La promesse de ne rien inventer', 'Le contrat avec l’éditeur', 'L’engagement à publier après sa mort'], 0, 'La formule est de Philippe Lejeune.'],
            ['Qu’est-ce qui distingue le journal intime de l’autobiographie ?', ['Il s’écrit au jour le jour, sans recul rétrospectif', 'Il est toujours publié', 'Il est écrit à la troisième personne', 'Il concerne uniquement l’enfance'], 0, 'L’autobiographie est un récit rétrospectif.'],
            ['Qui ouvre Les Confessions en 1782 en promettant de tout dire ?', ['Jean-Jacques Rousseau', 'Michel de Montaigne', 'Chateaubriand', 'Voltaire'], 0, 'Un texte fondateur du genre.'],
            ['Quel écrivain italien témoigne de la déportation dans un récit devenu classique ?', ['Primo Levi', 'Italo Calvino', 'Umberto Eco', 'Alberto Moravia'], 0, 'Témoigner est l’une des grandes raisons de s’écrire.'],
            ['Quelle particularité de style caractérise Annie Ernaux ?', ['Une écriture plate, sans effets, assumée comme un choix', 'Un lyrisme abondant', 'Un vocabulaire savant', 'Un récit en vers'], 0, 'Ne pas trahir par le style le milieu dont elle vient.'],
            ['Quels deux « je » cohabitent dans un texte autobiographique ?', ['Celui qui a vécu et celui qui écrit', 'Le vrai et le faux', 'L’auteur et l’éditeur', 'Le narrateur et le lecteur'], 0, 'Le second sait ce que le premier ignorait.'],
            ['La sincérité d’un auteur garantit la vérité de son récit.', ['Vrai', 'Faux'], 1, 'La mémoire trie et déforme, et l’on se raconte toujours pour quelqu’un.'],
            ['Qu’est-ce qu’un récit de filiation ?', ['Un récit qui part des parents ou grands-parents pour se comprendre soi', 'Une biographie d’un inconnu', 'Un arbre généalogique commenté', 'Un roman historique familial'], 0, 'Une forme très présente dans la littérature contemporaine.'],
          ],
        },
        {
          titre: 'Parcours du héros et engagement social : Qu’Allah bénisse la France, Abd Al Malik',
          axe: 'Le roman et le récit du XVIIIe siècle au XXIe siècle',
          lecon: {
            titre: 'D’un quartier de Strasbourg à la scène',
            cours: `Abd Al Malik, né Régis Fayette-Mikano en 1975, publie en 2004 *Qu'Allah bénisse la France*, récit autobiographique de son enfance à Strasbourg, dans le quartier du Neuhof.

## Un récit de trajectoire
| L'étape | Ce qu'elle apporte |
| Une famille congolaise, la **précarité** | Le point de départ |
| L'**école**, où il réussit | Une porte |
| La **délinquance**, en parallèle | L'autre chemin, simultané |
| La découverte du **rap** | Une langue à soi |
| La **conversion**, puis le choix d'un islam soufi de paix | Une discipline intérieure |

> Le héros n'est pas exemplaire d'avance : il **devient** ce qu'il raconte.

## Un récit d'ascension et de dette
La réussite n'efface pas le point de départ. Le narrateur revient sans cesse sur ce qu'il doit — à sa mère, à un frère, à un professeur, à un quartier.

> C'est un **récit de transfuge** : celui qui change de monde social découvre qu'on n'en change jamais tout à fait.

> Le titre est une provocation calculée : il accole deux mots que le débat public tient pour incompatibles, et le livre entier travaille à montrer qu'ils ne le sont pas.

## Une langue mêlée
| Le registre présent | Ce qu'il apporte |
| Le français courant | La narration |
| L'**argot** du quartier, le verlan | La voix réelle |
| Les références **religieuses** | La quête intérieure |
| Les références **littéraires** | L'appropriation d'un héritage |

> Cette langue composite est le sujet même du livre : elle prouve qu'une identité peut être plusieurs choses à la fois.

## L'engagement
| Le discours refusé | Pourquoi |
| Le quartier comme **décor de misère** | Il nie les personnes |
| Le quartier **idéalisé** | Il nie les difficultés |

| Ce que le livre défend | Son rôle |
| L'**éducation** | Une issue réelle |
| La **spiritualité** | Un travail sur soi |
| La **parole** | Un moyen d'exister |

Abd Al Malik en tire un album, puis un film qu'il réalise en 2014.

## Ce qu'on en retient
> Un même parcours peut être raconté comme fait divers, comme statistique ou comme récit à la première personne — et le récit est le seul des trois à rendre au sujet le droit de se définir lui-même.`,
          },
          questions: [
            ['En quelle année paraît Qu’Allah bénisse la France ?', ['2004', '1994', '2014', '2020'], 0, 'Le film que l’auteur en tire date, lui, de 2014.'],
            ['Dans quel quartier de Strasbourg l’auteur a-t-il grandi ?', ['Le Neuhof', 'La Meinau', 'La Krutenau', 'Hautepierre'], 0, 'Le quartier est un personnage du livre.'],
            ['Quelle est la profession première d’Abd Al Malik ?', ['Rappeur', 'Journaliste', 'Professeur', 'Comédien'], 0, 'Il vient du groupe NAP avant sa carrière solo.'],
            ['Qu’est-ce qu’un récit de transfuge social ?', ['Le récit de quelqu’un qui change de monde social et en garde la trace', 'Le récit d’un exil politique', 'Le récit d’un voyage à l’étranger', 'Le récit d’une conversion religieuse uniquement'], 0, 'La réussite n’efface jamais le point de départ.'],
            ['Pourquoi le titre est-il une provocation calculée ?', ['Il accole deux mots que le débat public croit incompatibles', 'Il cite un slogan politique', 'Il traduit une prière ancienne', 'Il reprend un titre de chanson américaine'], 0, 'Le livre travaille à montrer qu’ils ne le sont pas.'],
            ['Quelle particularité présente la langue du récit ?', ['Elle mêle français courant, argot, verlan et références religieuses', 'Elle est écrite en vers libres', 'Elle n’emploie que le passé simple', 'Elle est entièrement en langue lingala'], 0, 'La langue composite est le sujet même du livre.'],
            ['Le récit idéalise la vie dans les quartiers populaires.', ['Vrai', 'Faux'], 1, 'Il refuse autant l’idéalisation que le décor de misère.'],
            ['Quelle valeur le livre défend-il comme moyen de s’en sortir ?', ['L’éducation et le travail sur soi', 'La force physique', 'La chance', 'Le silence'], 0, 'Avec la parole, qui permet d’exister publiquement.'],
          ],
        },
        {
          titre: 'Écritures urbaines et représentations sociales',
          axe: 'Le roman et le récit du XVIIIe siècle au XXIe siècle',
          lecon: {
            titre: 'La ville comme personnage et comme jugement',
            cours: `La ville n'est pas un décor : dans le récit, elle classe les personnages. Dire où quelqu'un habite, c'est déjà dire ce qu'il peut espérer.

## La ville du XIXe siècle
| L'auteur | Ce qu'il met en scène |
| **Balzac** | La pension Vauquer contre le faubourg Saint-Germain |
| **Hugo** | Les égouts, les barricades des *Misérables* |
| **Zola** | Les Halles, le grand magasin, le quartier ouvrier |

> La **description** y est un outil d'analyse sociale : le mobilier, l'odeur, la lumière disent un revenu et une trajectoire.

## Le XXe siècle
| Le nouvel espace | Ce que le récit y cherche |
| Banlieues, grands ensembles, périphéries | La dilatation de la ville |
| La cité, la zone, l'usine, la gare | Les **marges** et ceux qui les habitent |

La **littérature ouvrière**, puis les écritures issues de l'immigration, entrent dans le champ du roman.

> Décrire une cité comme un paysage exotique, c'est déjà la mettre à distance : la question de **qui parle** est ici décisive.

## Le XXIe siècle
| La tendance | Sa position |
| Les récits écrits **de l'intérieur** | Par des auteurs venus des quartiers populaires |
| Les récits d'**enquête** | Nourris de terrain |
| Les formes venues d'ailleurs | **Rap**, slam, séries, documentaires |

## Les procédés à repérer
| Le procédé | Ce qu'il révèle |
| Le **champ lexical** de l'espace | Béton, cage d'escalier, périph, terrasse |
| La **métonymie** | « La cité » pour ses habitants |
| L'**opposition** centre / périphérie | Une hiérarchie spatiale |
| La **focalisation** | Voit-on la cité de l'intérieur, ou depuis une voiture qui passe ? |
| L'**oralité** | Discours direct et argot font entendre une langue réelle |

## L'enjeu
> Une représentation n'est jamais neutre : elle produit de la sympathie, de la peur ou de l'indifférence. Étudier les écritures urbaines, c'est apprendre à lire les images sociales qu'on nous propose — et à se demander qui les fabrique.`,
          },
          questions: [
            ['Quel rôle joue la ville dans un récit réaliste ?', ['Elle classe socialement les personnages', 'Elle sert uniquement de décor', 'Elle remplace l’intrigue', 'Elle n’a pas d’importance'], 0, 'Dire où l’on habite, c’est dire ce qu’on peut espérer.'],
            ['Quelle pension parisienne ouvre Le Père Goriot de Balzac ?', ['La pension Vauquer', 'La pension Vauquelin', 'La pension Sainte-Périne', 'La pension Grandet'], 0, 'Sa description est une analyse sociale déguisée.'],
            ['Quel roman de Zola se déroule dans un grand magasin ?', ['Au Bonheur des Dames', 'Germinal', 'L’Assommoir', 'La Bête humaine'], 0, 'Le commerce moderne y est décrit comme une machine.'],
            ['Quelle figure désigne un ensemble par l’un de ses éléments, comme « la cité » pour ses habitants ?', ['La métonymie', 'La comparaison', 'L’hyperbole', 'La litote'], 0, 'Elle peut aussi effacer les individus derrière le lieu.'],
            ['Pourquoi la question « qui parle ? » est-elle décisive dans les écritures urbaines ?', ['Parce que le point de vue produit sympathie, peur ou indifférence', 'Parce que l’auteur doit être connu', 'Parce que le narrateur doit être omniscient', 'Parce que le récit doit être vrai'], 0, 'Voir la cité de l’intérieur ou depuis une voiture qui passe ne donne pas le même texte.'],
            ['Quelles formes venues d’ailleurs nourrissent la littérature urbaine contemporaine ?', ['Le rap, le slam, les séries et le documentaire', 'Le sonnet et l’ode', 'La tragédie classique', 'Le conte merveilleux'], 0, 'Elles imposent leurs images de la ville.'],
            ['Une description de ville est un élément neutre du récit.', ['Vrai', 'Faux'], 1, 'Elle porte toujours un jugement social implicite.'],
            ['Quel effet produit l’emploi du discours direct et de l’argot dans ces récits ?', ['Faire entendre une langue réelle et rendre la parole aux personnages', 'Rendre le texte plus difficile', 'Allonger le récit', 'Respecter les règles classiques'], 0, 'L’oralité est un choix politique autant que stylistique.'],
          ],
        },
        // ===================================================================
        // Objet d'étude 4 : le théâtre du XVIIe au XXIe siècle
        // ===================================================================
        {
          titre: 'Le vocabulaire du théâtre',
          axe: 'Le théâtre du XVIIe siècle au XXIe siècle',
          lecon: {
            titre: 'Les mots pour analyser une pièce',
            cours: `Une pièce de théâtre est un texte fait pour être joué : tout s'y analyse en double, comme écriture et comme représentation.

## Le texte
| Le terme | Sa définition |
| Le **dialogue** | L'essentiel du texte |
| Les **didascalies** | Les indications scéniques — décor, gestes, ton, entrées et sorties — non prononcées |
| La **réplique** | Ce que dit un personnage |
| La **tirade** | Une longue réplique |
| La **stichomythie** | Un échange de répliques très courtes |
| Le **monologue** | Une parole seule en scène |
| L'**aparté** | Dit au public, sans être entendu des autres personnages |

## La structure
| L'élément | Son rôle |
| L'**acte** | La grande division |
| La **scène** | Elle change dès qu'un personnage entre ou sort |
| L'**exposition** | Elle informe le spectateur |
| Le **nœud** | Il installe le conflit |
| Les **péripéties** | Elles le relancent |
| Le **dénouement** | Il le résout |
| Le **coup de théâtre** | Un renversement brutal |

> La **double énonciation** est la clé du genre : un personnage parle à un autre personnage, et en même temps l'auteur parle au public.

## Les registres
| Le registre | Son effet |
| **Tragique** | Un personnage face à une fatalité qui le dépasse |
| **Comique** | Le rire par les mots, les gestes, les situations, les caractères, la répétition |
| **Pathétique** | Il émeut |
| **Lyrique** | Il dit les sentiments |

> L'**ironie tragique** fait dire à un personnage plus qu'il ne croit dire : le spectateur, lui, sait.

## Les grandes formes
| La forme | Ses règles ou son parti pris |
| La **tragédie** classique | Les **trois unités** — un jour, un lieu, une action —, la vraisemblance, la **bienséance** : pas de mort sur scène |
| La **comédie** | Elle peint les mœurs |
| Le **drame romantique** | Il revendique le **mélange** des genres |
| Les théâtres des XXe et XXIe siècles | Ils cassent la fable, le personnage, parfois le dialogue |

## La représentation
La **mise en scène** interprète le texte : décor, lumière, costumes, son, jeu, rythme.

> Deux mises en scène du même texte peuvent dire des choses opposées — c'est ce qui fait qu'une pièce ne vieillit pas.`,
          },
          questions: [
            ['Qu’est-ce qu’une didascalie ?', ['Une indication scénique non prononcée par les acteurs', 'Une longue réplique', 'Un monologue', 'Une scène muette'], 0, 'Elle précise décor, gestes, ton, entrées et sorties.'],
            ['Qu’est-ce qu’un aparté ?', ['Une parole adressée au public sans être entendue des autres personnages', 'Un dialogue rapide', 'Une réplique de plus de dix vers', 'Une scène sans dialogue'], 0, 'Il joue de la complicité avec la salle.'],
            ['Qu’est-ce que la double énonciation ?', ['Un personnage parle à un autre, et l’auteur parle en même temps au public', 'Deux acteurs disent la même réplique', 'Un texte joué deux fois', 'Un dialogue traduit en deux langues'], 0, 'C’est la clé de lecture du genre théâtral.'],
            ['Quand change-t-on de scène dans une pièce classique ?', ['Quand un personnage entre ou sort', 'À chaque changement de décor', 'Toutes les dix répliques', 'À chaque acte'], 0, 'C’est une convention d’écriture, pas de mise en scène.'],
            ['Quelles sont les trois unités de la tragédie classique ?', ['Un jour, un lieu, une action', 'Un acte, une scène, un personnage', 'Le temps, l’espace, la parole', 'La vraisemblance, la bienséance, la clarté'], 0, 'La vraisemblance et la bienséance sont d’autres règles.'],
            ['Qu’interdit la règle de bienséance au XVIIe siècle ?', ['Montrer la mort et la violence sur scène', 'Faire rire le public', 'Employer le vers', 'Changer de décor'], 0, 'La violence est racontée par un récit, non montrée.'],
            ['Qu’est-ce que l’ironie tragique ?', ['Un personnage dit plus qu’il ne croit dire, et le spectateur le sait', 'Une plaisanterie dans une tragédie', 'Un dénouement heureux', 'Une réplique adressée au public'], 0, 'Elle repose sur l’écart entre son savoir et celui du personnage.'],
            ['Deux mises en scène d’un même texte disent nécessairement la même chose.', ['Vrai', 'Faux'], 1, 'La mise en scène est une interprétation : c’est ce qui fait vivre les pièces.'],
          ],
        },
        {
          titre: 'L’impossible amour : Roméo et Juliette, Shakespeare',
          axe: 'Le théâtre du XVIIe siècle au XXIe siècle',
          lecon: {
            titre: 'Deux enfants, deux familles, cinq jours',
            cours: `Écrite vers 1595, *Roméo et Juliette* met en scène deux adolescents de Vérone qui s'aiment alors que leurs familles se haïssent.

## Une tragédie annoncée
Le **prologue**, dit par un chœur, révèle dès l'ouverture que les amants mourront.

| Ce que le spectateur regarde | Ce qu'il ne cherche pas |
| **Comment** cela devient inévitable | Ce qui va se passer : il le sait déjà |

> Chaque scène rapproche d'une fin déjà connue : c'est l'un des grands effets de l'**ironie tragique**.

## Ce qui rend l'amour impossible
| L'obstacle | Son contenu |
| La **haine héritée** | Entre Montaigu et Capulet — personne n'en connaît plus l'origine |
| L'**ordre patriarcal** | Juliette est destinée à Pâris sans qu'on lui demande son avis |
| Le **hasard** | Un message qui n'arrive pas, un réveil trop tardif |

> La fatalité, chez Shakespeare, passe par des détails ordinaires.

> Aimer devient un acte politique : choisir l'autre camp, c'est trahir le sien.

## Un théâtre libre
| La règle française future | Ce que Shakespeare fait |
| Unité de temps | L'action dure **plusieurs jours** |
| Unité de lieu | Elle change de lieu |
| Séparation des genres | Il mêle **comique** — la nourrice, Mercutio — et **tragique** |
| Unité de style | Il mêle la prose et le vers, les nobles et les valets |

> Cette liberté, condamnée par les classiques, deviendra le modèle des romantiques.

## Une langue d'images
| Le réseau d'images | Son emploi |
| La lumière et la nuit | Juliette est le soleil, à la scène du balcon |
| Le poison et le remède | La même substance sauve ou tue |
| Le faucon et l'oiseau | L'appel et la captivité |

Les amants inventent une langue à eux — jusqu'à un **sonnet partagé** lors de leur première rencontre.

## Une œuvre sans cesse rejouée
Ballets, opéras, comédies musicales — *West Side Story* transpose l'intrigue dans les gangs new-yorkais —, films, adaptations en cité, en camp de réfugiés, en réseau social.

> La pièce fonctionne partout où existent deux camps et une frontière.`,
          },
          questions: [
            ['Comment s’appellent les deux familles ennemies de la pièce ?', ['Les Montaigu et les Capulet', 'Les Médicis et les Borgia', 'Les York et les Lancastre', 'Les Sforza et les Visconti'], 0, 'Leur haine n’a plus d’origine connue.'],
            ['Que révèle le prologue de la pièce ?', ['Que les deux amants vont mourir', 'Le nom du meurtrier', 'La fin heureuse de l’histoire', 'Le lieu de la dernière scène uniquement'], 0, 'Le spectateur regarde alors comment la fin devient inévitable.'],
            ['Dans quelle ville se déroule l’action ?', ['Vérone', 'Venise', 'Florence', 'Milan'], 0, 'Shakespeare situe plusieurs pièces en Italie.'],
            ['Quel élément, très concret, précipite le dénouement ?', ['Un message qui n’arrive pas à temps', 'Une trahison de la nourrice', 'Un duel perdu par Juliette', 'Une décision du prince'], 0, 'La fatalité passe par des détails ordinaires.'],
            ['En quoi Shakespeare s’éloigne-t-il des futures règles classiques françaises ?', ['Il mêle comique et tragique, change de lieu et étend la durée', 'Il refuse les dialogues', 'Il n’écrit qu’en prose', 'Il supprime les personnages secondaires'], 0, 'Cette liberté deviendra le modèle des romantiques.'],
            ['Quelle forme poétique les amants partagent-ils lors de leur première rencontre ?', ['Un sonnet', 'Une ballade', 'Une ode', 'Un rondeau'], 0, 'Leur langue commune scelle leur accord avant les mots d’amour.'],
            ['Quelle comédie musicale transpose l’intrigue dans les gangs de New York ?', ['West Side Story', 'Cabaret', 'Chicago', 'Hair'], 0, 'La pièce fonctionne partout où il y a deux camps et une frontière.'],
            ['Dans la pièce, l’amour de Roméo et Juliette est un choix sans conséquence politique.', ['Vrai', 'Faux'], 1, 'Choisir l’autre camp, c’est trahir le sien.'],
          ],
        },
        {
          titre: 'Drame romantique et triangle amoureux : Les Caprices de Marianne, Musset',
          axe: 'Le théâtre du XVIIe siècle au XXIe siècle',
          lecon: {
            titre: 'Trois personnages, une mort, aucun coupable simple',
            cours: `Alfred de Musset publie *Les Caprices de Marianne* en 1833. La pièce est d'abord écrite pour être lue : après l'échec de sa première pièce, Musset publie un recueil intitulé *Un spectacle dans un fauteuil*.

## L'intrigue
| L'étape | Ce qui se passe |
| Le désir | **Cœlio** aime **Marianne**, mariée au vieux juge **Claudio** |
| La délégation | Timide, il demande à son ami **Octave** de plaider sa cause |
| Le déplacement | Marianne se refuse à Cœlio, puis se rapproche d'Octave |
| Le drame | Un malentendu envoie Cœlio à un rendez-vous piégé : il y est tué par les hommes de Claudio |

## Le triangle
| Le personnage | Son rapport à l'amour |
| **Cœlio** | L'**idéaliste**, qui préfère le rêve à la rencontre |
| **Octave** | Le **libertin** cynique, qui se découvre incapable d'aimer |
| **Marianne** | Enfermée dans un mariage : ses « caprices » sont les seules libertés qu'on lui laisse |

Les deux amis sont dits « deux moitiés d'un même homme ».

> « Je ne t'aimais pas, Cœlio, c'est toi qui m'aimais. » La réplique finale de Marianne à Octave rend la mort irréparable — et sans coupable désignable.

## Le drame romantique
| Le trait | Ce à quoi il s'oppose |
| Le **mélange** des registres, fantaisie et tragédie | La séparation classique des genres |
| Le refus des **unités** | Les trois unités |
| L'usage de la **prose** | L'alexandrin |
| Le **hasard** et l'ironie constante | La nécessité tragique |

| Le texte fondateur | Sa date |
| La **préface de Cromwell**, manifeste de Hugo | 1827 |
| La bataille d'**Hernani** | 1830 |

## Le mal du siècle
Cœlio et Octave portent le **mal du siècle** : une génération née après l'épopée napoléonienne, sans guerre à faire, sans foi solide, oscillant entre le rêve et le cynisme.

Musset l'analyse dans *La Confession d'un enfant du siècle*.

## Ce que la pièce interroge
| La question | Son enjeu |
| La condition faite aux **femmes mariées** | Un mariage subi, sans issue |
| L'**amitié masculine** | Et ses aveuglements |
| La **parole déléguée** | Parler pour un autre, c'est déjà parler à sa place |`,
          },
          questions: [
            ['En quelle année Musset publie-t-il Les Caprices de Marianne ?', ['1833', '1830', '1843', '1827'], 0, 'Dans le recueil Un spectacle dans un fauteuil.'],
            ['Qui aime Marianne au début de la pièce ?', ['Cœlio', 'Octave', 'Claudio', 'Tibia'], 0, 'Il charge son ami Octave de plaider sa cause.'],
            ['Qui est Claudio ?', ['Le vieux juge, mari de Marianne', 'Le père de Cœlio', 'Un ami d’Octave', 'Un serviteur'], 0, 'C’est lui qui fait tendre le piège mortel.'],
            ['Comment Musset caractérise-t-il Cœlio et Octave ?', ['Comme deux moitiés d’un même homme', 'Comme deux frères ennemis', 'Comme maître et valet', 'Comme rivaux politiques'], 0, 'L’idéaliste et le libertin s’éclairent l’un l’autre.'],
            ['À quoi correspondent en réalité les « caprices » de Marianne ?', ['Aux seules libertés que sa condition lui laisse', 'À une maladie nerveuse', 'À un jeu cruel gratuit', 'À une stratégie financière'], 0, 'La pièce interroge la condition des femmes mariées.'],
            ['Quel texte sert de manifeste au drame romantique ?', ['La préface de Cromwell, de Victor Hugo', 'L’Art poétique de Boileau', 'La préface de Pierre et Jean', 'Le Discours de la méthode'], 0, 'Publiée en 1827, trois ans avant la bataille d’Hernani.'],
            ['Qu’appelle-t-on le mal du siècle chez les romantiques ?', ['Le désœuvrement d’une génération née après l’épopée napoléonienne', 'Une épidémie du XIXe siècle', 'La misère ouvrière', 'La censure du théâtre'], 0, 'Musset l’analyse dans La Confession d’un enfant du siècle.'],
            ['Le drame romantique respecte la règle des trois unités.', ['Vrai', 'Faux'], 1, 'Il la refuse, comme il refuse la séparation des registres.'],
          ],
        },
        {
          titre: 'Héros tragique et destin meurtrier : Roberto Zucco, Koltès',
          axe: 'Le théâtre du XVIIe siècle au XXIe siècle',
          lecon: {
            titre: 'Une tragédie contemporaine sans dieux',
            cours: `Bernard-Marie Koltès (1948-1989) écrit *Roberto Zucco* peu avant sa mort ; la pièce est créée en 1990. Elle s'inspire librement d'un fait divers.

## Une structure de tragédie
| Le choix | Son effet |
| **Quinze tableaux** titrés, plutôt que des actes | Une progression par **stations** |
| Des lieux traversés — prison, chambre, métro, parc, commissariat, toit | Un chemin, non une intrigue |

> Cette progression rappelle autant la tragédie antique que le chemin de croix.

## Un héros sans psychologie
| Ce que Koltès refuse | Ce qu'il donne à la place |
| Un mobile | Une **énergie** qui passe et détruit |
| Une enfance analysée | Rien |
| Une leçon | Un regard |

| Le personnage | Sa désignation |
| **La Gamine**, **la Mère**, **la Sœur** | Une fonction, pas un nom |
| **La Dame**, **le Costaud** | Idem |

> Cette désignation par fonction les rapproche des figures mythiques.

> « Un tueur est une chose fragile. » Koltès ne demande ni compréhension ni pardon : il demande qu'on regarde.

## Une langue
| Le registre | Où il apparaît |
| Un français très **écrit**, presque classique dans son rythme | Les monologues |
| Une parole **brute** | Les scènes de rue |

Les monologues de Zucco touchent au mythe : le soleil, le rhinocéros, la disparition. Le dernier tableau, sur un toit en plein soleil, transforme la capture en apothéose ambiguë.

## Faits divers et théâtre
| L'objection | La réponse de Koltès |
| Représenter un criminel réel, est-ce le glorifier ? | Zucco n'est pas un **portrait**, c'est une **figure** — comme Œdipe ou Médée |
| Que vise alors la pièce ? | La violence d'une **société entière**, plutôt que la folie d'un homme |

## Ce qu'il faut retenir
> La tragédie moderne se passe de dieux et de rois : la fatalité y prend la forme d'un déterminisme social, d'une famille, d'une ville — et le héros n'a plus de grandeur, seulement une trajectoire qu'il ne maîtrise pas.`,
          },
          questions: [
            ['Qui a écrit Roberto Zucco ?', ['Bernard-Marie Koltès', 'Jean Genet', 'Samuel Beckett', 'Eugène Ionesco'], 0, 'La pièce est créée en 1990, après la mort de l’auteur.'],
            ['De quoi la pièce s’inspire-t-elle ?', ['D’un fait divers, le parcours du criminel Roberto Succo', 'D’un mythe grec', 'D’un roman de Camus', 'D’un épisode de la Résistance'], 0, 'Koltès en fait une figure, non un portrait.'],
            ['Comment la pièce est-elle découpée ?', ['En quinze tableaux titrés', 'En cinq actes', 'En trois journées', 'En scènes numérotées sans titre'], 0, 'Une progression par stations, de lieu en lieu.'],
            ['Comment les autres personnages sont-ils désignés ?', ['Par leur fonction : la Gamine, la Mère, la Dame', 'Par leur prénom complet', 'Par des numéros', 'Par leur métier uniquement'], 0, 'Cela les rapproche des figures mythiques.'],
            ['Koltès explique-t-il les mobiles de son personnage ?', ['Non, il refuse toute explication psychologique', 'Oui, par une enfance maltraitée', 'Oui, par un mobile financier', 'Oui, par la vengeance'], 0, 'Le personnage est une énergie qui passe et détruit.'],
            ['Où se déroule le dernier tableau de la pièce ?', ['Sur un toit, en plein soleil', 'Dans une prison', 'Dans un métro', 'Dans un parc'], 0, 'La capture y devient une apothéose ambiguë.'],
            ['Quel débat la pièce a-t-elle provoqué ?', ['Représenter un criminel réel revient-il à le glorifier', 'Faut-il jouer en costume d’époque', 'Le théâtre doit-il être en vers', 'Peut-on jouer sans décor'], 0, 'Koltès répond par le déplacement vers la figure mythique.'],
            ['Dans la tragédie contemporaine, la fatalité vient encore des dieux.', ['Vrai', 'Faux'], 1, 'Elle prend la forme d’un déterminisme social et familial.'],
          ],
        },
        {
          titre: 'Les représentations de la mort dans le théâtre',
          axe: 'Le théâtre du XVIIe siècle au XXIe siècle',
          lecon: {
            titre: 'Montrer, raconter, suggérer',
            cours: `Le théâtre parle sans cesse de la mort, mais il n'a jamais eu une seule manière de la traiter.

## Quatre traitements, quatre époques
| L'époque | Le traitement | Son moyen |
| Antiquité et **classicisme** | **Raconter** | Le récit du messager, le hors-scène |
| Théâtre élisabéthain et **romantisme** | **Montrer** | La mort sur scène |
| Le **XXe siècle** | **Suspendre** | L'attente remplace l'événement |
| Aujourd'hui | **Documenter** | Témoignage, chœur, liste de noms |

## Raconter
La tragédie grecque évite de tuer devant le public : le **messager** vient raconter ce qui s'est passé hors scène. Le théâtre classique reprend la règle sous le nom de **bienséance** — chez **Racine**, la mort d'Hippolyte est rapportée par un **récit**, morceau de bravoure où la parole doit faire voir.

> Le **hors-scène** rend la mort plus grande que ne le ferait sa représentation.

## Montrer
Dans *Hamlet*, le dernier acte laisse un plateau jonché de corps. Le **drame romantique** français revendique cette liberté au nom de la vérité, contre les règles.

> Faire entrer un cadavre sur scène ou en faire le récit ne raconte pas la même histoire : dans un cas la mort est un **fait**, dans l'autre un **événement de langage**.

## Suspendre
| L'auteur | Ce qu'il en fait |
| **Beckett** | On n'en finit pas de mourir : l'attente est le sujet |
| **Ionesco**, *Le roi se meurt* | Une cérémonie lente et absurde |

Le théâtre de l'**absurde** transforme la mort en **durée** plutôt qu'en coup de théâtre.

## Documenter
Le théâtre contemporain reprend la mort réelle — guerres, attentats, migrations, épidémies — et cherche des formes qui ne la transforment pas en spectacle.

## Les procédés à repérer
| Le procédé | Ce qu'il fait |
| Le **hors-scène** et le récit | Il délègue à la parole |
| Le **chœur** | Il commente et amplifie |
| L'**objet** qui reste | Une arme, un vêtement |
| La **lumière** qui baisse, le **silence** | Ils suspendent |
| L'**ellipse** | Elle laisse un vide |

> Et toujours la même question : que gagne-t-on à montrer, que gagne-t-on à cacher ?`,
          },
          questions: [
            ['Comment la tragédie classique traite-t-elle la mort d’un personnage ?', ['Elle la fait raconter hors scène, par un récit', 'Elle la montre en détail', 'Elle la supprime de l’intrigue', 'Elle la met en musique'], 0, 'C’est l’effet de la règle de bienséance.'],
            ['Qui, dans la tragédie grecque, vient raconter ce qui s’est passé hors scène ?', ['Le messager', 'Le coryphée', 'Le roi', 'Le devin'], 0, 'La parole doit faire voir ce qu’on ne montre pas.'],
            ['Quel dramaturge français est célèbre pour ses récits de mort, comme celui d’Hippolyte ?', ['Jean Racine', 'Molière', 'Pierre Corneille', 'Beaumarchais'], 0, 'Le récit de Théramène est un morceau de bravoure.'],
            ['Quel théâtre, à l’inverse, laisse le plateau jonché de corps à la fin d’Hamlet ?', ['Le théâtre élisabéthain', 'Le théâtre classique français', 'Le théâtre de boulevard', 'La comédie italienne'], 0, 'Shakespeare ne suit pas la règle de bienséance.'],
            ['Que fait le théâtre de l’absurde de la mort ?', ['Il la transforme en durée et en attente', 'Il la rend comique', 'Il la supprime', 'Il la représente réalistement'], 0, 'Chez Beckett, on n’en finit pas de mourir.'],
            ['Quelle pièce d’Ionesco fait de la mort une cérémonie lente ?', ['Le roi se meurt', 'La Cantatrice chauve', 'Rhinocéros', 'Les Chaises'], 0, 'Le titre annonce le programme de la pièce.'],
            ['Le hors-scène affaiblit toujours l’effet produit par la mort.', ['Vrai', 'Faux'], 1, 'Il la rend souvent plus grande, en la confiant à l’imagination.'],
            ['Quel enjeu traverse le traitement de la mort réelle au théâtre contemporain ?', ['Ne pas transformer la mort d’autrui en spectacle', 'Rendre les scènes plus violentes', 'Respecter les trois unités', 'Éviter tout témoignage'], 0, 'D’où le recours au chœur, au silence, à la liste de noms.'],
          ],
        },
        {
          titre: 'Repères : le théâtre, du XVIIe au XXIe siècle',
          axe: 'Le théâtre du XVIIe siècle au XXIe siècle',
          lecon: {
            titre: 'Quatre siècles de scène en une page',
            cours: `Le théâtre change quand changent son public, sa salle et ce qu'on lui autorise à montrer.

## Quatre siècles en un tableau
| Le siècle | Son principe | Ses auteurs |
| **XVIIe** | La **règle** classique | Corneille, Racine, Molière |
| **XVIIIe** | Le **glissement** vers le sentiment et la critique | Marivaux, Beaumarchais |
| **XIXe** | La **rupture** romantique | Hugo, Musset, Vigny |
| **XXe-XXIe** | La **mise en question** | Brecht, Beckett, Ionesco, Koltès |

## Le XVIIe siècle : la règle
| La contrainte | Son contenu |
| Les **trois unités** | Un jour, un lieu, une action |
| La **vraisemblance** | Rien d'incroyable |
| La **bienséance** | Rien de choquant sur scène |
| La séparation des genres | Tragédie et comédie ne se mêlent pas |

| L'auteur | Son domaine |
| **Corneille** | Le conflit du devoir et de la passion |
| **Racine** | La fatalité amoureuse |
| **Molière** | La comédie de caractère et de mœurs : *Tartuffe*, *Dom Juan*, *L'Avare*, *Le Misanthrope* |

Le théâtre est un art de cour, soumis à la censure et au goût du roi.

## Le XVIIIe siècle
| L'auteur ou la forme | Son apport |
| **Marivaux** | Le langage du sentiment, le brouillage des rangs sociaux |
| **Beaumarchais**, *Le Mariage de Figaro* | Une critique politique dans la bouche d'un valet |
| Le **drame bourgeois** | Des héros ordinaires, des sujets sérieux |

## Le XIXe siècle
Le **drame romantique** revendique le mélange des genres, la couleur locale, la liberté de la scène. La **bataille d'Hernani** (1830) en est le symbole. Le mélodrame et le vaudeville occupent le théâtre populaire.

> Le XIXe siècle donne à la scène ce qu'elle n'avait pas : le droit de tout montrer, et l'obligation d'avoir un point de vue.

## Les XXe et XXIe siècles
| L'apport | Son auteur |
| Le **metteur en scène** devient un auteur | — |
| La **distanciation**, pour empêcher l'identification et faire penser | **Brecht** |
| L'intrigue et le langage défaits | **Beckett**, **Ionesco** |
| Le dialogue réinventé | **Koltès**, Vinaver, Lagarce |
| Le départ du **réel** | Témoignages, documents, faits divers |

## Le fil commun
> Depuis quatre siècles, une pièce répond toujours aux mêmes trois questions : que montre-t-on, à qui, et depuis quel point de vue ?`,
          },
          questions: [
            ['Quelles règles encadrent la tragédie au XVIIe siècle ?', ['Les trois unités, la vraisemblance et la bienséance', 'Le mélange des genres', 'La liberté du lieu et du temps', 'L’usage exclusif de la prose'], 0, 'Le classicisme fait de la contrainte une esthétique.'],
            ['Quel auteur du XVIIe siècle est le maître de la comédie de mœurs et de caractère ?', ['Molière', 'Racine', 'Corneille', 'Rotrou'], 0, 'Tartuffe, L’Avare, Le Misanthrope.'],
            ['Quelle pièce de Beaumarchais met une critique politique dans la bouche d’un valet ?', ['Le Mariage de Figaro', 'Le Jeu de l’amour et du hasard', 'Le Barbier de Séville uniquement', 'La Fausse Suivante'], 0, 'Son monologue annonce les remises en cause révolutionnaires.'],
            ['Quel événement de 1830 symbolise le conflit entre classiques et romantiques ?', ['La bataille d’Hernani', 'La première de Tartuffe', 'La querelle du Cid', 'La création de Ruy Blas'], 0, 'Une pièce de Hugo, un affrontement de salle.'],
            ['Qu’est-ce que la distanciation chez Brecht ?', ['Un ensemble de procédés qui empêchent l’identification pour faire réfléchir', 'Un éloignement du décor', 'Une mise en scène sans acteurs', 'Un jeu très réaliste'], 0, 'Le spectateur doit juger, pas seulement ressentir.'],
            ['Quel courant du XXe siècle défait l’intrigue et le langage lui-même ?', ['Le théâtre de l’absurde', 'Le drame bourgeois', 'Le vaudeville', 'La commedia dell’arte'], 0, 'Beckett et Ionesco en sont les figures majeures.'],
            ['Au XXe siècle, le metteur en scène devient un auteur à part entière.', ['Vrai', 'Faux'], 0, 'Sa lecture du texte fait partie de l’œuvre.'],
            ['Quelles trois questions traversent le théâtre depuis quatre siècles ?', ['Que montre-t-on, à qui, depuis quel point de vue', 'Qui écrit, qui paie, qui joue', 'Combien d’actes, de scènes, de personnages', 'Quel décor, quel costume, quelle musique'], 0, 'Elles suffisent à comparer deux pièces éloignées de trois siècles.'],
          ],
        },
      ],
    },
  ],
}
