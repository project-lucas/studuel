// Français — Quatrième : LE PROGRAMME COMPLET (18 fiches).
//
// LE DÉFAUT. La page « Français » d'un élève de 4e s'ouvre sur CINQ fiches
// héritées du tout premier jeu de données (migration 008) : « La lettre et
// l'épistolaire », « Le fantastique », « La ville en poésie », « Les
// propositions subordonnées » et « Cause, conséquence et but ». Cinq lignes pour
// une année entière, et rien sur les quatre questionnements du programme.
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 5 chapitres de la maquette de référence et
// leurs 18 fiches. Le découpage suit celui du BO de cycle 4 : quatre
// questionnements obligatoires, plus un questionnement complémentaire.
//   1. Se chercher, se construire — Dire l'amour                        (6)
//   2. Vivre en société… — Individu et société : confrontations de valeurs ? (2)
//   3. Regarder le monde… — La fiction pour interroger le réel          (3)
//   4. Agir sur le monde — Informer, s'informer, déformer ?             (3)
//   5. Questionnements complémentaires — La ville, lieu de tous les possibles ? (4)
//
// LE TITRE DES CHAPITRES SUIT LA FORME DE LA 3e (migration 290) : le
// questionnement du BO, un tiret cadratin, puis l'entrée retenue. C'est ce qui
// permet à un élève de reconnaître le même programme d'une année sur l'autre.
//
// LES CINQ FICHES HÉRITÉES PARTENT (voir `menage`). « Le fantastique » et « La
// ville en poésie » sont recouvertes par le nouveau découpage (chapitres 3 et 5) ;
// « La lettre et l'épistolaire » ne figure plus au programme de 4e ; « Les
// propositions subordonnées » et « Cause, conséquence et but » sont des points
// de LANGUE, qui n'ont pas leur place dans le rayon des œuvres — la grammaire a
// son propre rayon en 1re (migration 259), et le collège n'en a pas encore.
//
// ⚠️ Le slug `francais` porte désormais NEUF modules (`francais-1re.mjs` = 259,
// `francais-1re-anciens.mjs` = 260, les cinq modules de fiches de lecture
// 261 → 265, `francais-2de.mjs` = 283, `francais-3e.mjs` = 290, celui-ci = 300) :
// ne JAMAIS générer avec `--slugs francais`. Toujours `--modules francais-4e`.

export default {
  slug: 'francais',
  nom: 'Français',

  titreMigration: 'FRANÇAIS 4e — LE PROGRAMME COMPLET (18 fiches)',

  motif: `CONSTAT : le français de 4e n'avait que les 5 fiches du premier jeu de données
de l'app — « La lettre et l'épistolaire », « Le fantastique », « La ville en
poésie », « Les propositions subordonnées », « Cause, conséquence et but ». Un
élève de 4e qui révisait la poésie lyrique, Bérénice, Marivaux, Lorenzaccio, Le
Cid, L'Assommoir, « La Parure », « La Chute de la maison Usher », la lecture de
la presse, la propagande ou la ville en littérature ne trouvait RIEN. Cette
migration installe les 18 fiches, rangées sous les 5 chapitres de la maquette —
les quatre questionnements du BO plus un questionnement complémentaire — et
retire les 5 fiches génériques.
DEUX DES CINQ FICHES RETIRÉES SONT DES POINTS DE LANGUE (« Les propositions
subordonnées », « Cause, conséquence et but ») : la grammaire a son propre rayon
en Première (migration 259) et le collège n'en a pas encore ; les laisser au
milieu des œuvres brouillerait le dossier.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit : ce
module range ses 18 fiches sous 5 chapitres, et l'INSERT écrit la colonne. Elle
est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que
la 234 soit passée en production — sans cette reprise, la migration échouerait
sur "column chapters.theme does not exist", les 5 anciens chapitres déjà
supprimés et les 18 neufs pas encore posés : une matière vide.
Le ménage qui suit LIT cette colonne : elle doit exister avant lui.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités de la 008 partent, au niveau 4e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : « La lettre et l'épistolaire » porte
une apostrophe, et rien ne garantit que la base porte la même que ce fichier
(droite dans le contenu ancien, typographique dans le récent) ; un DELETE par
titre ne trouverait alors pas la ligne, EN SILENCE. Le critère « pas de chapitre
de programme » vise exactement les cinq lignes voulues : elles datent de la 008,
bien avant la colonne theme, tandis que les 18 fiches neuves en portent une dès
l'INSERT — le ménage tourne AVANT les insertions et ne peut donc jamais mordre
sur elles, ni au premier passage ni au rejeu.
Le filtre level = '4e' est indispensable : le français existe sur six niveaux, et
« Le fantastique » comme « La ville en poésie » sont des titres qu'on retrouve
ailleurs.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL), puis
les chapitres, dont les leçons partent en cascade.`,
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
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '4e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['4e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Se chercher, se construire — Dire l'amour
        // ===================================================================
        {
          titre: 'La poésie lyrique et amoureuse de l’Antiquité à nos jours',
          axe: 'Se chercher, se construire — Dire l’amour',
          lecon: {
            titre: 'Vingt-cinq siècles pour dire « je t’aime »',
            cours: `Dire l’amour, c’est presque toujours dire aussi le temps. Les deux thèmes sont inséparables depuis Ronsard.

## Le mot
= Lyrique vient de la LYRE, l’instrument des poètes grecs

À l’origine, la poésie lyrique se **chantait**. Elle exprime les **sentiments personnels** du poète.

## Les grandes étapes
@ VIe siècle av. J.-C. — Sappho dit le trouble amoureux ; plus tard, Ovide écrit L’Art d’aimer
@ Moyen Âge — Les troubadours inventent l’amour courtois
@ XVIe siècle — La Pléiade : Ronsard, Louise Labé, et le sonnet venu de Pétrarque
@ XIXe siècle — Le romantisme : Lamartine, Hugo, Musset
@ XXe siècle — Apollinaire, Éluard, Aragon renouvellent la forme

| Le poète | Son vers célèbre |
| **Ronsard** | « Mignonne, allons voir si la rose… » |
| **Apollinaire** | « Le Pont Mirabeau » |
| **Éluard** | « Liberté » |
| **Aragon** | « Les Yeux d’Elsa » |

Dans l’**amour courtois**, le poète sert une dame inaccessible, et cette souffrance l’élève.

## Les marques du lyrisme
| La marque | Exemple |
| La **première personne** | *je*, *mon*, *mes* |
| L’**apostrophe** | « Ô temps, suspends ton vol ! » |
| La **ponctuation expressive** | Exclamations, interrogations, points de suspension |
| Le **champ lexical** du sentiment | |
| Les **images** | Comparaison et métaphore |

## Les formes
| La forme | Ce qu’elle est |
| Le **sonnet** | **14 vers** : deux quatrains, deux tercets |
| L’**ode** | Un poème de célébration |
| L’**élégie** | Le poème de la **plainte** |
| La **ballade** | |
| Le **vers libre**, le **poème en prose** | Depuis le XIXe siècle |

> La beauté qui passe, l’absence, la mort : le temps est le compagnon obligé du sentiment amoureux en poésie.`,
          },
          questions: [
            ['D’où vient le nom de la poésie lyrique ?', ['De la lyre, l’instrument des poètes grecs', 'Du grec « lyros », qui signifie amour', 'Du nom du poète Lyrios', 'Du mot « lire »'], 0, 'À l’origine, cette poésie se chantait.'],
            ['Qu’exprime la poésie lyrique ?', ['Les sentiments personnels du poète', 'Les exploits des héros', 'Les règles de la société', 'Des récits historiques'], 0, 'Le « je » y est omniprésent.'],
            ['Quelle poétesse grecque du VIe siècle avant J.-C. chante le trouble amoureux ?', ['Sappho', 'Antigone', 'Louise Labé', 'Marie de France'], 0, 'Elle vivait sur l’île de Lesbos.'],
            ['Qu’est-ce que l’amour courtois ?', ['Le service d’une dame inaccessible par le poète', 'Un mariage arrangé à la cour', 'Un amour partagé et heureux', 'Une déclaration faite devant le roi'], 0, 'Les troubadours l’inventent au Moyen Âge.'],
            ['Quel poète du XVIe siècle a écrit « Mignonne, allons voir si la rose… » ?', ['Ronsard', 'Hugo', 'Musset', 'Apollinaire'], 0, 'Il appartient à la Pléiade.'],
            ['Combien de vers compte un sonnet ?', ['14', '12', '10', '16'], 0, 'Deux quatrains suivis de deux tercets.'],
            ['Quelle figure de style consiste à s’adresser directement à un être ou à une chose ?', ['L’apostrophe', 'La métaphore', 'L’antithèse', 'L’allitération'], 0, '« Ô temps, suspends ton vol ! »'],
            ['La poésie lyrique est un genre né au XIXe siècle.', ['Vrai', 'Faux'], 1, 'Elle remonte à l’Antiquité grecque, avec Sappho.'],
          ],
        },
        {
          titre: '« Demain, dès l’aube… », Victor Hugo',
          axe: 'Se chercher, se construire — Dire l’amour',
          lecon: {
            titre: 'Un poème d’amour qui est un poème de deuil',
            cours: `Pendant onze vers, on croit lire un poème d’amour. Un seul mot, au dernier vers, renverse tout.

## Le contexte
@ Septembre 1843 — Léopoldine, fille de Victor Hugo, se noie à 19 ans dans la Seine à Villequier
@ 1856 — Publication des Contemplations, où figure « Demain, dès l’aube… »

## La forme
= Trois quatrains d’alexandrins, en rimes croisées (ABAB)

Une forme **simple, presque nue**.

## Le mouvement du poème
| La strophe | Ce qui s’y passe |
| **1** | L’annonce du départ, au **futur** : « Je partirai. Vois-tu, je sais que tu m’attends. » |
| **2** | Le voyage, replié : « Je marcherai les yeux fixés sur mes pensées » |
| **3** | L’arrivée, et la **chute** : « Je mettrai sur ta tombe / Un bouquet de houx vert et de bruyère en fleur. » |

~ On croit lire un poème d’amour → le mot « tombe » tombe → tout se relit autrement

!> Les indices étaient là : les **yeux baissés**, le refus de voir l’or du soir, le dos tourné au monde. On ne les comprend qu’à la **relecture**.

## Les procédés à relever
| Le procédé | Son effet |
| Le **futur** de la certitude | Le voyage devient inéluctable |
| L’**anaphore** du « je » | Le poème est tourné vers un seul geste |
| Les **négations** de la strophe 2 | « ni l’or du soir qui tombe / Ni les voiles au loin descendant vers Harfleur » |
| L’**antithèse** finale | Le **houx** persistant et piquant, la **bruyère en fleur** fragile |

Fidélité et deuil dans un même bouquet.

> Le poème ne dit jamais le mot « fille », ni le mot « mort ». C’est cette **retenue** qui le rend bouleversant.`,
          },
          questions: [
            ['Dans quel recueil « Demain, dès l’aube… » a-t-il été publié ?', ['Les Contemplations', 'Les Misérables', 'Les Fleurs du mal', 'Les Rayons et les Ombres'], 0, 'Publié en 1856.'],
            ['À qui ce poème est-il adressé ?', ['À Léopoldine, la fille du poète, morte noyée', 'À une femme aimée', 'À la France', 'À un ami disparu'], 0, 'Elle s’est noyée à 19 ans à Villequier, en 1843.'],
            ['Quelle est la forme du poème ?', ['Trois quatrains d’alexandrins en rimes croisées', 'Un sonnet', 'Un poème en prose', 'Quatre tercets en vers libres'], 0, 'Une forme simple, presque nue.'],
            ['Quel mot du dernier vers renverse le sens du poème ?', ['« tombe »', '« bouquet »', '« bruyère »', '« aube »'], 0, 'Le lecteur croyait lire un poème d’amour.'],
            ['Quel temps domine dans le poème ?', ['Le futur', 'Le passé simple', 'L’imparfait', 'Le présent'], 0, 'Il rend le voyage inéluctable.'],
            ['Que refuse de regarder le poète pendant son voyage ?', ['L’or du soir et les voiles descendant vers Harfleur', 'La foule sur les routes', 'La mer et le ciel', 'Les maisons du village'], 0, 'Les négations montrent qu’il s’est fermé au monde.'],
            ['Que dépose le poète sur la tombe ?', ['Un bouquet de houx vert et de bruyère en fleur', 'Une rose blanche', 'Une couronne de lauriers', 'Une lettre'], 0, 'Le houx persistant et la bruyère fragile : fidélité et deuil.'],
            ['Le poème nomme explicitement la mort de Léopoldine.', ['Vrai', 'Faux'], 1, 'Il ne dit ni « fille » ni « mort » : c’est cette retenue qui fait sa force.'],
          ],
        },
        {
          titre: 'La tragédie au XVIIe siècle : Bérénice de Racine',
          axe: 'Se chercher, se construire — Dire l’amour',
          lecon: {
            titre: 'Aimer et renoncer',
            cours: `Un héros tragique n’a aucune issue : quel que soit son choix, il perd. C’est ce qui distingue le tragique du dramatique.

## Les règles de la tragédie classique
| La règle | Ce qu’elle impose |
| Les **trois unités** | Une seule **action**, en un seul **lieu**, en une seule **journée** |
| La **vraisemblance** | Rien d’invraisemblable sur scène |
| La **bienséance** | Ni sang, ni violence, ni mort devant le public : on les **raconte** |
| Le rang | Des personnages **élevés** — rois, princes |
| La forme | L’**alexandrin** en rimes plates ; une **fin malheureuse** |

= La catharsis : purger les passions du spectateur par la terreur et la pitié

C’est le but assigné par **Aristote**.

## Bérénice (1670)
| Le personnage | Sa situation |
| **Titus** | Devenu empereur de Rome, il aime Bérénice |
| **Bérénice** | Reine de Palestine — et Rome interdit à son empereur d’épouser une **reine étrangère** |
| **Antiochus** | Roi de Comagène, ami de Titus, il aime Bérénice en silence |

~ Titus renonce → Bérénice part → Antiochus reste seul

!> **Personne ne meurt.** La pièce s’achève sur un **triple renoncement** — et c’est pourtant une tragédie.

> Racine l’écrit dans sa préface : « Ce n’est point une nécessité qu’il y ait du sang et des morts dans une tragédie ; il suffit que l’action en soit grande. »

## Le conflit tragique
= L’amour contre le devoir

La passion personnelle contre la loi de Rome.

## Le style de Racine
Une langue **simple**, un vocabulaire volontairement **restreint**, une musicalité fondée sur les sonorités.

> Le dernier mot de Bérénice — « Hélas ! » — est le plus court sommet d’une pièce entière.`,
          },
          questions: [
            ['En quoi consiste la règle des trois unités ?', ['Une seule action, un seul lieu, une seule journée', 'Trois actes, trois personnages, trois lieux', 'Trois unités de temps de trois heures', 'Une unité de ton, de style et de genre'], 0, 'C’est la règle centrale du théâtre classique.'],
            ['Que signifie la règle de bienséance ?', ['Ni sang ni violence ne doivent être montrés sur scène', 'Les personnages doivent être polis', 'La pièce doit bien finir', 'Le public doit rester silencieux'], 0, 'Les morts sont racontées, jamais représentées.'],
            ['Qu’est-ce que la catharsis ?', ['La purgation des passions du spectateur par la terreur et la pitié', 'Le dénouement heureux d’une pièce', 'Le monologue final du héros', 'La règle de l’unité de lieu'], 0, 'La notion vient d’Aristote.'],
            ['Pourquoi Titus renonce-t-il à Bérénice ?', ['Parce que Rome interdit à son empereur d’épouser une reine étrangère', 'Parce qu’il ne l’aime plus', 'Parce qu’elle en aime un autre', 'Parce qu’elle est morte'], 0, 'C’est le conflit entre l’amour et le devoir.'],
            ['Qui est Antiochus dans la pièce ?', ['Le roi de Comagène, ami de Titus, qui aime Bérénice en secret', 'Le père de Bérénice', 'Un sénateur romain', 'Le rival militaire de Titus'], 0, 'Il forme le troisième sommet du triangle.'],
            ['Comment s’achève Bérénice ?', ['Par un triple renoncement, sans aucune mort', 'Par le suicide de Bérénice', 'Par le mariage des deux amants', 'Par la mort de Titus'], 0, 'Racine prouve qu’une tragédie n’exige ni sang ni morts.'],
            ['Quel vers l’alexandrin compte-t-il ?', ['Douze syllabes', 'Dix syllabes', 'Huit syllabes', 'Quatorze syllabes'], 0, 'La tragédie classique s’écrit en alexandrins à rimes plates.'],
            ['Le héros tragique dispose toujours d’une issue favorable.', ['Vrai', 'Faux'], 1, 'C’est justement l’absence d’issue qui définit le tragique.'],
          ],
        },
        {
          titre: 'La comédie au XVIIIe siècle',
          axe: 'Se chercher, se construire — Dire l’amour',
          lecon: {
            titre: 'Rire, mais pour dire quelque chose',
            cours: `Au XVIIIe siècle, la comédie continue de faire rire — mais elle critique de plus en plus la société.

## Ce qu’elle garde de Molière
| Les **types** | Le valet rusé, le barbon, l’amoureux, la coquette |
| Le **quiproquo** | Le moteur de l’intrigue |
| Le **double jeu** | |

| Le comique | Ses moyens |
| De **mots** | Jeux de mots, patois, répétitions |
| De **gestes** | Chutes, coups de bâton, déguisements |
| De **situation** | Quiproquo, malentendu, hasard |
| De **caractère** | Le défaut poussé à l’excès |
| De **répétition** | Une même réplique qui revient |

## Ce qui change au XVIIIe siècle
| Le changement | Ce qu’il produit |
| Le **valet** devient l’égal intellectuel de son maître | Et parfois plus lucide que lui |
| La **critique sociale** s’installe | Inégalité des conditions, mariage arrangé, pouvoir des pères |
| Naît la **comédie sensible** | Elle mêle rire et émotion, et prépare le **drame** |

= Figaro reproche à son maître de « s’être donné la peine de naître »

## Marivaux et le marivaudage
**Marivaux** (1688-1763) fait de l’amour un **jeu de langage**.

= Le marivaudage : un dialogue léger et spirituel, où chaque réplique avance masquée

Les personnages parlent **pour ne pas s’avouer** ce qu’ils ressentent, et le spectateur comprend avant eux.

!> Chez Marivaux, l’obstacle n’est **ni le père ni la société** : c’est l’**amour-propre** des personnages, qui refusent de reconnaître leur sentiment.

## Beaumarchais
@ 1775 — Le Barbier de Séville
@ 1784 — Le Mariage de Figaro

La critique va si loin que **Louis XVI** en interdit d’abord la représentation.`,
          },
          questions: [
            ['Quel dramaturge du XVIIe siècle la comédie du XVIIIe prend-elle pour modèle ?', ['Molière', 'Racine', 'Corneille', 'Voltaire'], 0, 'Types et procédés comiques lui sont hérités.'],
            ['Qu’est-ce qu’un quiproquo ?', ['Un malentendu où l’on prend une chose ou une personne pour une autre', 'Un jeu de mots', 'Une chute sur scène', 'Un monologue adressé au public'], 0, 'C’est un comique de situation.'],
            ['Comment évolue le rôle du valet au XVIIIe siècle ?', ['Il devient l’égal intellectuel de son maître, souvent plus lucide', 'Il disparaît de la scène', 'Il devient muet', 'Il ne fait plus rire du tout'], 0, 'Figaro en est l’aboutissement.'],
            ['Qu’appelle-t-on le marivaudage ?', ['Un dialogue léger et spirituel où les personnages avancent masqués', 'Une farce grossière', 'Un long monologue tragique', 'Une critique politique directe'], 0, 'Le spectateur comprend avant les personnages.'],
            ['Quel est l’obstacle principal à l’amour chez Marivaux ?', ['L’amour-propre des personnages', 'L’opposition du père', 'La différence de religion', 'La guerre'], 0, 'Ils refusent de reconnaître leur sentiment.'],
            ['Quelle pièce de Beaumarchais fut d’abord interdite par Louis XVI ?', ['Le Mariage de Figaro', 'Le Jeu de l’amour et du hasard', 'Bérénice', 'L’Assommoir'], 0, 'Sa critique sociale était jugée trop hardie.'],
            ['Qu’est-ce que la comédie sensible ?', ['Une comédie qui mêle le rire et l’émotion', 'Une comédie sans dialogue', 'Une comédie en un seul acte', 'Une comédie jouée sans décor'], 0, 'Elle prépare le drame du siècle suivant.'],
            ['La comédie du XVIIIe siècle se contente de faire rire, sans critiquer la société.', ['Vrai', 'Faux'], 1, 'Sous l’influence des Lumières, la critique sociale y devient centrale.'],
          ],
        },
        {
          titre: 'Un exemple de comédie du XVIIIe siècle : Le Jeu de l’amour et du hasard, Marivaux',
          axe: 'Se chercher, se construire — Dire l’amour',
          lecon: {
            titre: 'Deux déguisements, un même aveu',
            cours: `Deux personnages ont exactement la même idée au même moment : c’est tout le mécanisme de la pièce.

## L’intrigue
@ 1730 — Création du Jeu de l’amour et du hasard, comédie en trois actes et en prose

~ Silvia échange son habit avec sa servante Lisette → Dorante a eu la MÊME idée et se présente en valet → les quatre personnages sont masqués deux à deux, sans le savoir

| Le personnage | Son déguisement |
| **Silvia** | En servante |
| **Lisette**, sa servante | En maîtresse |
| **Dorante** | En valet |
| **Arlequin**, son valet | En maître |

Silvia (en servante) tombe amoureuse de Dorante (en valet), et réciproquement ; Lisette et Arlequin se plaisent aussi.

## Le double registre
!> Le spectateur, lui, **sait tout**. **Monsieur Orgon**, père de Silvia, et son frère **Mario** sont dans la confidence et laissent faire. Ce **double registre** est le ressort comique principal.

## Le vrai sujet
= L’épreuve du sentiment face au préjugé social

Silvia et Dorante s’aiment **en croyant aimer un domestique** : chacun doit choisir entre son cœur et son rang.

| Le personnage | Ce qu’il fait |
| **Dorante** | Il cède le premier et révèle son identité **par amour** |
| **Silvia** | Elle **prolonge** l’épreuve : elle veut être aimée **pour elle-même** |

= « Il se fait justice ! »

!> La pièce s’achève sur la victoire du sentiment — mais **l’ordre social n’est pas renversé** : maîtres et valets se marient chacun dans leur condition.

## Les procédés à connaître
Le **quiproquo** généralisé, l’**ironie dramatique** (le public en sait plus), le **langage** qui trahit le rang malgré l’habit, et l’**aparté** — ces répliques dites au public que les autres personnages n’entendent pas.`,
          },
          questions: [
            ['En quelle année Le Jeu de l’amour et du hasard a-t-il été créé ?', ['1730', '1670', '1784', '1856'], 0, 'C’est une comédie en trois actes et en prose.'],
            ['Pourquoi Silvia échange-t-elle son rôle avec sa servante ?', ['Pour observer son futur époux sans être reconnue', 'Pour fuir le mariage', 'Pour punir Lisette', 'Pour obéir à son père'], 0, 'Dorante a eu exactement la même idée.'],
            ['Comment s’appelle le valet de Dorante ?', ['Arlequin', 'Mario', 'Orgon', 'Figaro'], 0, 'Il joue le rôle du maître pendant que Dorante joue le valet.'],
            ['Qu’est-ce que le double registre dans cette pièce ?', ['Le public sait ce que les personnages ignorent', 'Les personnages parlent deux langues', 'La pièce mêle vers et prose', 'Deux intrigues se déroulent en parallèle'], 0, 'C’est le ressort comique principal.'],
            ['Quel est le véritable sujet de la pièce ?', ['L’épreuve du sentiment face au préjugé social', 'La lutte pour le pouvoir', 'La critique de la religion', 'La guerre entre deux familles'], 0, 'Chacun doit choisir entre son cœur et son rang.'],
            ['Qui révèle son identité le premier ?', ['Dorante', 'Silvia', 'Arlequin', 'Lisette'], 0, 'Silvia prolonge l’épreuve pour être aimée pour elle-même.'],
            ['Qu’est-ce qu’un aparté ?', ['Une réplique adressée au public que les autres personnages n’entendent pas', 'Un monologue en fin d’acte', 'Un dialogue en coulisses', 'Une didascalie'], 0, 'Marivaux en use abondamment.'],
            ['À la fin de la pièce, l’ordre social est renversé.', ['Vrai', 'Faux'], 1, 'Maîtres et valets se marient chacun dans leur condition.'],
          ],
        },
        {
          titre: 'Le drame du XIXe siècle : Lorenzaccio, Alfred de Musset',
          axe: 'Se chercher, se construire — Dire l’amour',
          lecon: {
            titre: 'Le théâtre romantique brise les règles',
            cours: `Le drame romantique rejette en bloc les règles classiques. Hugo en écrit le manifeste, Musset en donne le chef-d’œuvre.

## Le drame romantique
@ 1827 — Victor Hugo le théorise dans la Préface de Cromwell

| La règle classique | Ce que le drame en fait |
| Les **trois unités** | Il les **abolit** : l’action se déplace, s’étale sur des années |
| La séparation des genres | Il **mélange** le sublime et le grotesque, le comique et le tragique |
| L’unité de langue | Il mêle rois et gens du peuple, vers et prose |
| Les personnages tranchés | Il les veut **complexes**, ni bons ni mauvais |
| Le décor conventionnel | Il exige la **couleur locale** : décors, costumes, détails historiques précis |

## Lorenzaccio (1834)
Musset a **24 ans**. La pièce compte **cinq actes**, **39 scènes** et une trentaine de personnages.

@ 1834 — Écriture de la pièce
@ 1896 — Première création, avec Sarah Bernhardt dans le rôle-titre

!> Elle est jugée **injouable** pendant plus de soixante ans, tant elle ignore les contraintes de la scène de son temps.

## L’intrigue
Florence, 1537.

~ Alexandre de Médicis est un tyran → Lorenzo se fait son complice et son entremetteur → c’est un MASQUE : il prépare son assassinat → il le tue → et rien ne change

Les Florentins, indifférents, laissent aussitôt élire un autre Médicis, **Côme**. Lorenzo est assassiné à son tour.

## Le personnage de Lorenzo
Surnommé par mépris **Lorenzaccio**, « le mauvais Lorenzo ».

> « Le vice a été pour moi un vêtement ; maintenant il est collé à ma peau. »

!> À force de jouer le débauché pour approcher le tyran, il l’est **devenu**. Il agit sans plus croire à l’utilité de son acte : il tue **pour rester fidèle** à celui qu’il a été.

## Ce que la pièce interroge
L’**engagement** et son inutilité, le rapport entre l’**être** et le **paraître**, et le désenchantement d’une génération née trop tard pour la Révolution : le « **mal du siècle** ».`,
          },
          questions: [
            ['Dans quel texte Victor Hugo théorise-t-il le drame romantique ?', ['La Préface de Cromwell', 'Les Contemplations', 'La Préface de Bérénice', 'L’Art poétique'], 0, 'Publiée en 1827.'],
            ['Quelle règle classique le drame romantique rejette-t-il ?', ['La règle des trois unités', 'L’usage de la prose', 'La présence d’un héros', 'La division en actes'], 0, 'Il multiplie lieux, époques et intrigues.'],
            ['Que mélange le drame romantique ?', ['Le sublime et le grotesque, le comique et le tragique', 'Le théâtre et le roman', 'La poésie et la musique', 'Le français et le latin'], 0, 'Hugo en fait le principe même du genre.'],
            ['En quelle année Lorenzaccio a-t-il été écrit ?', ['1834', '1827', '1896', '1730'], 0, 'Jugée injouable, la pièce ne sera créée qu’en 1896.'],
            ['Qui Lorenzo assassine-t-il ?', ['Alexandre de Médicis, le tyran de Florence', 'Côme de Médicis', 'Son propre père', 'Le duc de Milan'], 0, 'Il prépare ce meurtre depuis des années.'],
            ['Que se passe-t-il après le meurtre ?', ['Rien ne change : un autre Médicis est élu', 'Florence devient une république', 'Lorenzo prend le pouvoir', 'Le peuple se soulève'], 0, 'C’est l’échec total de l’engagement.'],
            ['Que signifie la réplique « Le vice a été pour moi un vêtement ; maintenant il est collé à ma peau » ?', ['À force de jouer le débauché, Lorenzo l’est devenu', 'Lorenzo regrette sa richesse', 'Lorenzo se déguise pour fuir', 'Lorenzo accuse le tyran'], 0, 'Le masque a dévoré le visage.'],
            ['Lorenzaccio a été jouée dès sa publication.', ['Vrai', 'Faux'], 1, 'Jugée injouable, elle attend 1896 et Sarah Bernhardt.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 : Vivre en société — Individu et société
        // ===================================================================
        {
          titre: 'La tragi-comédie au XVIIe siècle : Le Cid, Corneille',
          axe: 'Vivre en société, participer à la société — Individu et société : confrontations de valeurs ?',
          lecon: {
            titre: 'L’honneur contre l’amour',
            cours: `Le dilemme cornélien : choisir entre deux valeurs également hautes, sans pouvoir les concilier.

## Une tragi-comédie
@ 1637 — Création du Cid
@ 1648 — Corneille la rebaptise « tragédie »

Elle a la **gravité** d’une tragédie mais une **fin heureuse**, et son intrigue est plus libre que les règles ne l’autorisent.

## L’intrigue
| Le personnage | Son lien |
| **Rodrigue** et **Chimène** | Ils s’aiment et vont se marier |
| **Don Gomès** | Père de Chimène ; il insulte et gifle Don Diègue |
| **Don Diègue** | Père de Rodrigue, trop vieux pour se venger lui-même |

~ L’affront → Rodrigue doit choisir → il tue Don Gomès en duel → Chimène doit réclamer sa mort au roi → Rodrigue vainc les Maures → le roi accorde un délai d’un an

Vainqueur des **Maures**, Rodrigue est surnommé **le Cid**, « le seigneur ».

## Le dilemme cornélien
| Rodrigue peut… | Et alors il perd… |
| **Venger son père** | **Chimène** |
| **Renoncer à l’honneur** | Sa **valeur** et son nom |

!> Quel que soit son choix, il perd quelque chose d’essentiel. C’est cela, un dilemme — et non une simple hésitation.

= « Percé jusques au fond du cœur… »

Les **stances** de Rodrigue (acte I, scène 6) sont le monologue où ce déchirement se déploie.

## Le héros cornélien
| Le héros de Corneille | Le héros de Racine |
| Il se définit par sa **volonté** | Il est **écrasé** par une passion qu’il subit |
| Il **choisit**, quoi qu’il en coûte | |
| Il **grandit** par son choix | |

## La querelle du Cid
L’Académie française reprocha à la pièce de violer les **unités** et la **bienséance** — Chimène épouserait le meurtrier de son père.

> Cette querelle contribua à **fixer les règles** du théâtre classique. Une polémique a fait une doctrine.`,
          },
          questions: [
            ['Pourquoi Le Cid est-il d’abord appelé tragi-comédie ?', ['Il a la gravité d’une tragédie mais une fin heureuse', 'Il alterne scènes comiques et tragiques', 'Il est joué par des comédiens amateurs', 'Il mêle vers et prose'], 0, 'Corneille le rebaptisera « tragédie » en 1648.'],
            ['Pourquoi Rodrigue doit-il tuer le père de Chimène ?', ['Parce que celui-ci a giflé son propre père, trop vieux pour se venger', 'Parce qu’il convoite sa fortune', 'Parce que le roi le lui ordonne', 'Parce qu’il l’a trahi à la guerre'], 0, 'L’honneur familial exige réparation.'],
            ['Qu’est-ce qu’un dilemme cornélien ?', ['Un choix entre deux valeurs également hautes, impossibles à concilier', 'Un choix entre le bien et le mal', 'Une hésitation entre deux amours', 'Un pari sur l’avenir'], 0, 'Quel que soit le choix, le héros perd quelque chose d’essentiel.'],
            ['Comment appelle-t-on le monologue de Rodrigue à l’acte I ?', ['Les stances', 'L’aparté', 'La tirade des Maures', 'Le prologue'], 0, '« Percé jusques au fond du cœur… »'],
            ['Pourquoi Rodrigue est-il surnommé « le Cid » ?', ['Parce qu’il a vaincu les Maures, qui le nomment « le seigneur »', 'Parce que c’est son nom de naissance', 'Parce que le roi le lui a donné à sa naissance', 'Parce qu’il est le fils de Don Diègue'], 0, 'Le mot vient de l’arabe et signifie « seigneur ».'],
            ['Qu’est-ce qui définit le héros cornélien ?', ['Sa volonté : il choisit et grandit par son choix', 'Sa passion, qu’il subit', 'Sa naissance illustre', 'Sa ruse'], 0, 'C’est ce qui le distingue du héros racinien.'],
            ['Qu’est-ce que la querelle du Cid ?', ['La polémique sur le respect des unités et de la bienséance dans la pièce', 'Un duel entre Corneille et Racine', 'Un procès intenté à Corneille', 'Une dispute entre deux troupes de théâtre'], 0, 'Elle contribua à fixer les règles du théâtre classique.'],
            ['Le Cid se termine par la mort des deux amants.', ['Vrai', 'Faux'], 1, 'Le roi accorde un délai d’un an : la fin reste ouverte et heureuse.'],
          ],
        },
        {
          titre: 'La nouvelle du XVIIIe siècle à nos jours',
          axe: 'Vivre en société, participer à la société — Individu et société : confrontations de valeurs ?',
          lecon: {
            titre: 'Un récit court qui frappe fort',
            cours: `Le roman prend son temps, la nouvelle vise. C’est la différence entre un portrait à l’huile et un instantané.

## Ce qui définit une nouvelle
| Le trait | Face au roman |
| Une intrigue **resserrée** | Souvent une seule action |
| **Peu de personnages** | Décrits en quelques traits |
| Un cadre **limité** | Dans l’espace et dans le temps |
| Un rythme **rapide** | Avec des **ellipses** |
| Une **chute** | Une fin brève et frappante, qui souvent retourne le sens |

## Les grandes étapes du genre
@ XVIIIe siècle — Le conte philosophique de Voltaire : Candide, Micromégas
@ XIXe siècle — L’âge d’or : la presse publie des nouvelles chaque semaine
@ XXe-XXIe siècles — Science-fiction, absurde, quotidien

| L’auteur | Son domaine |
| **Maupassant** | Le réalisme (*La Parure*, *Boule de Suif*) et le fantastique (*Le Horla*) |
| **Mérimée** | *La Vénus d’Ille* |
| **Poe** | Aux États-Unis |
| **Tchekhov** | En Russie |
| **Bradbury**, **Buzzati**, **Carver** | Science-fiction, absurde, quotidien |

En France aujourd’hui : **Anna Gavalda**, **Bernard Werber**.

## Les registres possibles
| Le registre | Ce qu’il fait |
| **Réaliste** | Peindre le réel tel qu’il est |
| **Fantastique** | L’inexplicable fait irruption |
| **Merveilleux** | Le surnaturel est admis |
| **Policier**, **science-fiction**, **absurde** | |

## La chute
| Elle peut… | |
| **Révéler** une information cachée | *La Parure* |
| **Retourner** la morale attendue | |
| **Laisser en suspens** | Sans réponse |

!> Une bonne chute est toujours **préparée** : à la relecture, les indices étaient là. Une chute qui sort de nulle part n’est pas une chute, c’est une invraisemblance.`,
          },
          questions: [
            ['Qu’est-ce qui distingue une nouvelle d’un roman ?', ['Sa brièveté, son intrigue resserrée et sa chute', 'Sa forme versifiée', 'Son sujet toujours historique', 'Son absence de personnages'], 0, 'Le roman prend son temps, la nouvelle vise.'],
            ['Qu’est-ce que la chute d’une nouvelle ?', ['Une fin brève et frappante, qui retourne souvent le sens du récit', 'Le moment le plus dramatique du milieu', 'La description du décor', 'Le premier paragraphe'], 0, 'Elle est toujours préparée par des indices.'],
            ['Quel auteur du XVIIIe siècle a fait du récit bref un outil philosophique ?', ['Voltaire', 'Maupassant', 'Poe', 'Zola'], 0, 'Candide et Micromégas sont des contes philosophiques.'],
            ['Quel siècle est l’âge d’or de la nouvelle en France ?', ['Le XIXe siècle', 'Le XVIIe siècle', 'Le XVIIIe siècle', 'Le XXe siècle'], 0, 'La presse en publiait chaque semaine.'],
            ['Quelle nouvelle fantastique Maupassant a-t-il écrite ?', ['Le Horla', 'La Parure', 'Boule de Suif', 'La Vénus d’Ille'], 0, 'La Vénus d’Ille est de Mérimée.'],
            ['Que caractérise le registre fantastique ?', ['L’irruption de l’inexplicable dans un cadre réaliste', 'L’acceptation du surnaturel comme allant de soi', 'La peinture fidèle du réel', 'L’enquête policière'], 0, 'Dans le merveilleux, au contraire, le surnaturel ne surprend personne.'],
            ['Quel écrivain russe est un maître de la nouvelle ?', ['Tchekhov', 'Balzac', 'Bradbury', 'Buzzati'], 0, 'Ses nouvelles peignent le quotidien avec une précision aiguë.'],
            ['Une nouvelle peut comporter autant de personnages qu’un roman.', ['Vrai', 'Faux'], 1, 'Sa brièveté impose peu de personnages, décrits en quelques traits.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : Regarder le monde, inventer des mondes
        // ===================================================================
        {
          titre: 'Un roman naturaliste : L’Assommoir de Zola',
          axe: 'Regarder le monde, inventer des mondes — La fiction pour interroger le réel',
          lecon: {
            titre: 'Le roman comme enquête sociale',
            cours: `Zola ne condamne pas Gervaise : il montre comment le milieu défait une femme courageuse.

## Du réalisme au naturalisme
| Le mouvement | Son projet |
| Le **réalisme** — Balzac, Flaubert, Maupassant | Peindre le réel **tel qu’il est**, sans idéaliser |
| Le **naturalisme** — **Zola** | Appliquer au roman la **méthode scientifique** |

Le romancier observe, se documente, expérimente. Il étudie l’effet de l’**hérédité** et du **milieu** sur ses personnages.

> Zola l’écrit dans *Le Roman expérimental* : le romancier est « un observateur et un expérimentateur ».

## Les Rougon-Macquart
= 20 romans, de 1871 à 1893, sur cinq générations d’une même famille

Sous-titre : « **Histoire naturelle et sociale d’une famille sous le Second Empire** ».

@ 1877 — L’Assommoir, septième roman du cycle

## L’Assommoir
Le premier grand roman français consacré au **monde ouvrier**.

~ Gervaise arrive à Paris → elle épouse Coupeau → ils ouvrent une blanchisserie → Coupeau tombe d’un toit → il boit → dettes, faim, déchéance → elle meurt dans un réduit sous l’escalier

**Gervaise Macquart** est blanchisseuse et boiteuse. Leur fille **Nana** deviendra l’héroïne d’un autre roman.

## Le titre
= L’assommoir : le nom populaire du débit d’alcool

La boutique du père Colombe, où l’alambic travaille jour et nuit.

> Le mot dit tout : ce qui **assomme**.

## Ce qui a fait scandale
!> Zola fait entrer dans le roman la **langue du peuple** — argot, familiarités, tournures orales — **y compris dans la narration**, et non seulement dans les dialogues. C’est cette audace-là qui choqua.

Le livre fut accusé de complaisance dans la misère ; il fut aussi son plus grand succès de librairie.`,
          },
          questions: [
            ['Qui a fondé le naturalisme ?', ['Émile Zola', 'Gustave Flaubert', 'Honoré de Balzac', 'Guy de Maupassant'], 0, 'Il l’expose dans Le Roman expérimental.'],
            ['Qu’est-ce qui distingue le naturalisme du réalisme ?', ['Il applique au roman la méthode scientifique, étudiant l’hérédité et le milieu', 'Il idéalise la réalité', 'Il refuse toute documentation', 'Il ne peint que la bourgeoisie'], 0, 'Le romancier y est « observateur et expérimentateur ».'],
            ['Comment s’appelle le cycle romanesque de Zola ?', ['Les Rougon-Macquart', 'La Comédie humaine', 'Les Misérables', 'Les Contemplations'], 0, 'Vingt romans sur cinq générations d’une même famille.'],
            ['Quel est le sujet de L’Assommoir ?', ['La vie et la déchéance d’une blanchisseuse dans le monde ouvrier', 'La montée d’un banquier', 'La guerre de 1870', 'La vie d’une comédienne'], 0, 'C’est le premier grand roman français sur le monde ouvrier.'],
            ['Que désigne le mot « assommoir » ?', ['Un débit d’alcool populaire', 'Un atelier de blanchisserie', 'Un immeuble ouvrier', 'Un outil de zingueur'], 0, 'La boutique du père Colombe, où travaille l’alambic.'],
            ['Comment s’appelle l’héroïne de L’Assommoir ?', ['Gervaise Macquart', 'Nana', 'Emma Bovary', 'Chimène'], 0, 'Sa fille Nana sera l’héroïne d’un autre roman du cycle.'],
            ['Qu’est-ce qui a fait scandale dans L’Assommoir ?', ['L’entrée de la langue populaire, argot compris, jusque dans la narration', 'La présence de personnages historiques', 'Sa longueur excessive', 'Son absence de dialogue'], 0, 'Le roman fut accusé de complaisance dans la misère.'],
            ['Zola condamne moralement son héroïne.', ['Vrai', 'Faux'], 1, 'Il montre comment le milieu défait une femme courageuse.'],
          ],
        },
        {
          titre: 'Une nouvelle réaliste : « La Parure » de Maupassant et l’adaptation éponyme de Claude Chabrol',
          axe: 'Regarder le monde, inventer des mondes — La fiction pour interroger le réel',
          lecon: {
            titre: 'Dix ans de misère pour un bijou faux',
            cours: `Une faute minuscule, une punition de dix ans, et un dernier mot qui rend tout absurde.

## La nouvelle (1884)
~ Mathilde emprunte une rivière de diamants → elle triomphe au bal → elle perd la parure → le couple la remplace pour 36 000 francs → dix ans à rembourser → la révélation

| Le personnage | Qui il est |
| **Mathilde Loisel** | Jolie femme d’un petit employé du ministère, elle souffre de sa condition modeste |
| **Madame Forestier** | L’amie à qui elle emprunte la parure |

Pendant **dix ans**, le couple s’épuise : Mathilde renvoie la bonne, lave, marchande, vieillit prématurément.

> « Oh ! ma pauvre Mathilde ! Mais la mienne était fausse. Elle valait au plus cinq cents francs !… »

## Les procédés
| Le procédé | Son effet |
| Le **narrateur externe** | Il rapporte **sans commenter** |
| Le **portrait initial** | Quelques lignes suffisent à installer l’insatisfaction |
| L’**ellipse** des dix années | Condensées en un paragraphe : la nouvelle accélère là où le roman s’attarderait |
| La **chute** | Préparée par des indices : la boîte qui n’est pas d’origine, le bijoutier qui ne reconnaît pas la parure |

## Ce que la nouvelle interroge
Le poids des **apparences** dans une société où le rang se joue au regard des autres, et la **disproportion** cruelle entre une faute minuscule et sa punition.

!> Chez Maupassant, ce n’est pas la fatalité qui frappe : c’est le **hasard**. Et le hasard n’a pas de justice à rendre.

## L’adaptation de Claude Chabrol (2007)
Réalisée pour la télévision, dans la collection *Chez Maupassant*.

| Ce que la caméra ajoute | Ce qu’elle perd |
| Les **décors**, la lumière du bal | Le discours du **narrateur** |
| La mesquinerie des logements | L’**ellipse instantanée** — dix ans en un paragraphe |
| Le corps, le costume, la **durée réelle** | |`,
          },
          questions: [
            ['Quel bijou Mathilde emprunte-t-elle ?', ['Une rivière de diamants', 'Un collier de perles', 'Une bague en or', 'Une broche de saphirs'], 0, 'Elle appartient à son amie Madame Forestier.'],
            ['Combien de temps le couple Loisel met-il à rembourser la parure ?', ['Dix ans', 'Un an', 'Trois ans', 'Vingt ans'], 0, 'Ces dix années sont condensées en une ellipse.'],
            ['Quelle est la chute de la nouvelle ?', ['La parure empruntée était fausse', 'Mathilde retrouve le bijou perdu', 'Madame Forestier était ruinée', 'Le mari de Mathilde avait volé le bijou'], 0, 'Elle valait au plus cinq cents francs.'],
            ['Qu’est-ce qu’une ellipse dans un récit ?', ['Le passage sous silence d’une période de temps', 'Une description très détaillée', 'Un dialogue rapporté', 'Un retour en arrière'], 0, 'Les dix années de remboursement tiennent en un paragraphe.'],
            ['Quel type de narrateur Maupassant emploie-t-il ?', ['Un narrateur externe, à la troisième personne', 'Un narrateur personnage', 'Un narrateur à la deuxième personne', 'Plusieurs narrateurs successifs'], 0, 'Il rapporte sans commenter.'],
            ['Que dénonce la nouvelle ?', ['Le poids des apparences dans la société', 'La corruption des ministères', 'La guerre franco-prussienne', 'L’exploitation des ouvriers'], 0, 'Une faute minuscule y entraîne une punition démesurée.'],
            ['Qui a réalisé l’adaptation télévisée de « La Parure » en 2007 ?', ['Claude Chabrol', 'François Truffaut', 'Jean Renoir', 'Louis Malle'], 0, 'Dans la collection Chez Maupassant.'],
            ['La chute de « La Parure » arrive sans aucun indice préalable.', ['Vrai', 'Faux'], 1, 'La boîte qui n’est pas d’origine et le bijoutier qui ne reconnaît pas la parure l’annonçaient.'],
          ],
        },
        {
          titre: 'Une nouvelle fantastique : « La Chute de la maison Usher » d’Edgar Allan Poe',
          axe: 'Regarder le monde, inventer des mondes — La fiction pour interroger le réel',
          lecon: {
            titre: 'Quand la maison et la famille s’effondrent ensemble',
            cours: `Le fantastique n’est ni le merveilleux ni la science-fiction : sa marque, c’est l’hésitation.

## Les trois genres à distinguer
| Le genre | Le statut du surnaturel |
| Le **fantastique** | Il **fait irruption** dans un cadre réaliste, et on ne sait jamais s’il faut y croire |
| Le **merveilleux** | Il **va de soi**, comme dans le conte |
| La **science-fiction** | Il est **expliqué** par la science |

!> L’**hésitation** est l’essentiel : surnaturel, ou bien folie, rêve, hallucination ? Un récit qui tranche cesse d’être fantastique.

## La nouvelle (1839)
~ Le narrateur est appelé au chevet de Roderick Usher → il découvre une maison lézardée au bord d’un étang noir → Madeline meurt → on l’enferme dans un caveau → elle reparaît, enterrée vivante → elle entraîne son frère dans la mort → la maison se fend et sombre

| Le personnage | Ce qu’il est |
| Le **narrateur** | Un ami d’enfance, dont on ne saura pas le nom |
| **Roderick Usher** | Dernier héritier d’une famille éteinte ; hypersensible, terrifié par les sons, les lumières, les odeurs |
| **Madeline** | Sa sœur **jumelle** |

## Les procédés du fantastique chez Poe
| Le procédé | Son rôle |
| Le **narrateur interne**, témoin | On peut douter de lui |
| Le **cadre** | Maison isolée, décrépitude, nuit, tempête |
| La **gradation** de l’angoisse | Très progressive |
| Le **lexique** de l’étrange et de la peur | |
| Le **modalisateur** | « il me sembla », « comme si », « peut-être » : le doute reste ouvert |
| La **correspondance** maison / habitant | Les deux se fissurent ensemble, et s’effondrent au même instant |

> Le titre est double : la « chute de la maison Usher » désigne autant le **bâtiment** que la **lignée**. La langue anglaise dit *house* pour les deux.`,
          },
          questions: [
            ['Qu’est-ce qui caractérise le récit fantastique ?', ['L’hésitation entre une explication rationnelle et le surnaturel', 'L’acceptation du surnaturel comme allant de soi', 'L’explication scientifique de l’étrange', 'L’absence de tout événement étrange'], 0, 'C’est ce qui le distingue du merveilleux et de la science-fiction.'],
            ['Qui est Roderick Usher ?', ['Le dernier héritier d’une famille éteinte, ami du narrateur', 'Le médecin du village', 'Le père du narrateur', 'Un aubergiste'], 0, 'Il est hypersensible et terrifié par les sensations.'],
            ['Que devient Madeline Usher ?', ['Elle est enterrée vivante et reparaît', 'Elle s’enfuit de la maison', 'Elle épouse le narrateur', 'Elle disparaît sans laisser de trace'], 0, 'Elle entraîne son frère dans la mort.'],
            ['Que se passe-t-il à la fin de la nouvelle ?', ['La maison se fend et sombre dans l’étang', 'Le narrateur hérite du domaine', 'La maison est vendue', 'Madeline survit seule'], 0, 'La lignée et le bâtiment s’effondrent ensemble.'],
            ['Qu’est-ce qu’un modalisateur ?', ['Un mot qui exprime le doute, comme « il me sembla » ou « peut-être »', 'Un adjectif qui décrit un décor', 'Un verbe de mouvement', 'Un signe de ponctuation'], 0, 'Il maintient l’hésitation propre au fantastique.'],
            ['Quel type de narrateur Poe emploie-t-il ?', ['Un narrateur interne, témoin, dont on peut douter', 'Un narrateur omniscient', 'Un narrateur absent', 'Plusieurs narrateurs successifs'], 0, 'Le doute sur sa fiabilité nourrit le fantastique.'],
            ['Pourquoi le titre est-il double ?', ['« Maison » désigne à la fois le bâtiment et la lignée', 'La nouvelle comporte deux maisons', 'Le titre a été traduit deux fois', 'Usher possédait deux domaines'], 0, 'L’anglais « house » porte les deux sens.'],
            ['Dans le fantastique, le surnaturel est toujours expliqué à la fin.', ['Vrai', 'Faux'], 1, 'L’hésitation reste ouverte : c’est la définition même du genre.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 : Agir sur le monde — Informer, s'informer, déformer ?
        // ===================================================================
        {
          titre: 'Lire et comprendre la presse et les médias',
          axe: 'Agir sur le monde — Informer, s’informer, déformer ?',
          lecon: {
            titre: 'Qui parle, d’où, et pour dire quoi ?',
            cours: `La première question devant un texte de presse : informe-t-il, ou donne-t-il un avis ?

## Les genres journalistiques
| Le genre | Ce qu’il fait |
| La **brève** | Quelques lignes, l’essentiel |
| L’**article informatif** | Il répond aux **cinq questions** : qui, quoi, quand, où, pourquoi |
| Le **reportage** | Le journaliste s’est rendu sur place et raconte ce qu’il a vu |
| L’**interview** | Questions et réponses rapportées |
| L’**enquête** | Une recherche longue, avec recoupement de sources |
| L’**éditorial**, la **chronique**, la **critique** | Des textes d’**opinion**, où l’auteur s’engage |

!> Informer et donner un avis sont **tous deux légitimes**. Les **confondre** ne l’est pas.

## L’architecture d’un article
~ Le titre → le chapô → l’attaque → le corps → la chute

| L’élément | Ce qu’il est |
| Le **titre** | Informatif ou incitatif |
| Le **chapô** | Le paragraphe d’introduction, en gras |
| L’**attaque** | La première phrase |
| L’**intertitre**, la **légende**, le **crédit photo** | Les repères de lecture |

## Vérifier une information
1. La **source** : d’où vient-elle ? est-elle nommée ?
2. La **date** : une image ancienne remise en circulation change de sens ;
3. le **recoupement** : plusieurs médias indépendants la donnent-ils ?
4. l’**auteur** : signé ? par un journaliste identifiable ?
5. l’**image** : une recherche d’image inversée dit souvent d’où elle vient réellement.

## Les pièges du numérique
| Le piège | Ce qu’il fait |
| Le **titre-appât** (« putaclic ») | Il promet plus que l’article ne donne |
| La **bulle de filtres** | Les algorithmes montrent surtout ce qui **confirme** ce qu’on pense déjà |
| L’**infox** (fake news) | Une fausse information **fabriquée** pour tromper |
| La **rumeur** | Une information non vérifiée, relayée **de bonne foi** |

!> Une infox circule d’autant plus vite qu’elle **indigne**. L’émotion est son carburant, pas la vraisemblance.

## Le rôle de la presse en démocratie
@ 1881 — La loi garantit la liberté de la presse

Ses limites : diffamation, injure, incitation à la haine. Un journaliste doit protéger ses **sources** et vérifier ses informations : c’est la **déontologie** du métier.`,
          },
          questions: [
            ['À quelles questions un article informatif doit-il répondre ?', ['Qui, quoi, quand, où, pourquoi', 'Comment, combien, pour qui', 'Qui, contre qui, pour quel prix', 'Quand et seulement quand'], 0, 'La règle dite des cinq W.'],
            ['Qu’est-ce que le chapô d’un article ?', ['Le paragraphe d’introduction, souvent en gras', 'Le titre principal', 'La dernière phrase', 'La légende de la photo'], 0, 'Il résume l’essentiel avant le corps de l’article.'],
            ['Quel genre journalistique exprime une opinion ?', ['L’éditorial', 'La brève', 'Le reportage', 'L’interview'], 0, 'La chronique et la critique aussi.'],
            ['Que faut-il vérifier en premier devant une information ?', ['Sa source et sa date', 'Le nombre de partages', 'La qualité de l’image', 'La longueur du texte'], 0, 'Une image ancienne remise en circulation change de sens.'],
            ['Qu’est-ce qu’un titre-appât (« putaclic ») ?', ['Un titre spectaculaire qui promet plus que l’article ne donne', 'Un titre trop long', 'Un titre sans verbe', 'Un titre en langue étrangère'], 0, 'Il vise le clic, pas l’information.'],
            ['Qu’est-ce que la bulle de filtres ?', ['L’effet des algorithmes qui montrent surtout ce qui confirme nos idées', 'Un filtre appliqué aux photos de presse', 'Une technique de vérification', 'Un logiciel anti-spam'], 0, 'Elle réduit la diversité des points de vue rencontrés.'],
            ['Quelle loi garantit la liberté de la presse en France ?', ['La loi de 1881', 'La loi de 1789', 'La loi de 1905', 'La loi de 1958'], 0, 'Elle connaît des limites : diffamation, injure, incitation à la haine.'],
            ['Une rumeur et une infox sont exactement la même chose.', ['Vrai', 'Faux'], 1, 'L’infox est fabriquée pour tromper ; la rumeur circule souvent de bonne foi.'],
          ],
        },
        {
          titre: 'Étude de textes et documents produits à des fins de propagande',
          axe: 'Agir sur le monde — Informer, s’informer, déformer ?',
          lecon: {
            titre: 'Reconnaître un discours qui veut faire penser',
            cours: `La propagande ne cherche pas à informer, mais à faire adhérer. Elle s’adresse à l’émotion, jamais au raisonnement.

## Trois discours à distinguer
| Le discours | Son but |
| L’**information** | Faire savoir, avec du contradictoire |
| La **publicité** | Vendre un **produit** |
| La **propagande** | Faire **adhérer** à une idée politique ou idéologique |

## Ses procédés
| Le procédé | Comment il agit |
| La **simplification** | Un problème complexe réduit à une formule |
| La **répétition** | Le slogan martelé jusqu’à paraître évident |
| La **désignation d’un ennemi** | Un « eux » responsable de tout, opposé à un « nous » |
| L’**appel aux émotions** | Peur, fierté, colère, pitié |
| Le **culte du chef** | Image héroïsée, contre-plongée, foule en arrière-plan |
| La **falsification** | Chiffres tronqués, photos retouchées ou sorties de leur contexte |
| L’**argument d’autorité** | « tout le monde le sait », « des millions y croient » |

## Analyser un document
~ Nature → auteur et commanditaire → date et contexte → destinataire → message explicite → message implicite

| La question | Ce qu’elle cherche |
| **Nature** | Affiche, discours, film, tract, publication en ligne ? |
| **Auteur et commanditaire** | Qui parle, et pour le compte de qui ? |
| **Date et contexte** | Que se passe-t-il au moment où ce document paraît ? |
| **Procédés visuels** | Cadrage, couleurs, taille relative des personnages, symboles |

!> Distinguer le message **explicite** — ce qu’il dit — du message **implicite** — ce qu’il fait croire **sans le dire**. C’est là que tout se joue.

> Une image ne ment jamais toute seule : c’est le **cadrage**, la **légende** et le **contexte** qui lui font dire ce qu’elle ne montre pas.

## Les contre-pouvoirs
La **pluralité** des médias, le **droit de réponse**, les journalistes de vérification des faits, l’éducation aux médias.

= La question à garder : qui a intérêt à ce que je le croie ?`,
          },
          questions: [
            ['Quel est le but de la propagande ?', ['Faire adhérer à une opinion, pas informer', 'Vendre un produit commercial', 'Divertir le public', 'Enseigner une méthode'], 0, 'Elle s’adresse à l’émotion plutôt qu’au raisonnement.'],
            ['Quel procédé consiste à réduire un problème complexe à une formule ?', ['La simplification', 'Le recoupement', 'La nuance', 'La citation'], 0, 'Souvent associée à la répétition d’un slogan.'],
            ['Qu’est-ce que la désignation d’un ennemi ?', ['La construction d’un « eux » responsable de tout, opposé à un « nous »', 'La déclaration de guerre officielle', 'La critique d’un adversaire politique argumentée', 'Le refus de nommer ses sources'], 0, 'C’est l’un des ressorts les plus constants de la propagande.'],
            ['Qu’est-ce qu’un plan en contre-plongée dans une image de propagande ?', ['Un cadrage vu d’en bas, qui grandit le personnage', 'Un cadrage vu d’en haut, qui écrase le personnage', 'Un gros plan sur les mains', 'Un plan tourné de nuit'], 0, 'Il sert le culte du chef.'],
            ['Que faut-il identifier en premier dans un document de propagande ?', ['Son auteur et son commanditaire', 'Sa longueur', 'Le nombre de couleurs employées', 'Sa police de caractères'], 0, 'Qui parle, et pour le compte de qui ?'],
            ['Qu’est-ce qu’un message implicite ?', ['Ce que le document fait croire sans le dire', 'Le titre du document', 'La légende officielle', 'La signature de l’auteur'], 0, 'Il se distingue du message explicite.'],
            ['Comment une image peut-elle tromper sans être truquée ?', ['Par son cadrage, sa légende et son contexte de publication', 'Par sa taille', 'Par sa date de prise de vue seule', 'Par son format de fichier'], 0, 'On lui fait dire ce qu’elle ne montre pas.'],
            ['La propagande et la publicité poursuivent le même objet.', ['Vrai', 'Faux'], 1, 'La publicité vend un produit ; la propagande vise l’adhésion politique ou idéologique.'],
          ],
        },
        {
          titre: 'Le journalisme à travers les romans et les films du XIXe siècle à nos jours',
          axe: 'Agir sur le monde — Informer, s’informer, déformer ?',
          lecon: {
            titre: 'La fiction regarde ceux qui informent',
            cours: `Chez Balzac comme chez Maupassant, le journaliste n’est pas un menteur isolé : c’est le système qui produit le mensonge.

## Au XIXe siècle : la presse comme machine
| L’œuvre | Ce qu’elle montre |
| **Balzac**, *Illusions perdues* (1837-1843) | **Lucien de Rubempré** monte à Paris, réussit dans le journalisme — et s’y perd. L’**article se vend** ; on démolit une pièce qu’on n’a pas vue |
| **Maupassant**, *Bel-Ami* (1885) | **Georges Duroy**, sans talent, gravit tous les échelons par les femmes et l’intrigue. Le journal est un instrument de **spéculation politique** |

## Au XXe siècle : le journalisme comme contre-pouvoir
| L’œuvre | Ce qu’elle montre |
| **Albert Londres** | Il invente le grand **reportage** |
| *Les Hommes du président* (1976) | Deux journalistes du *Washington Post* et le **Watergate**, jusqu’à la démission d’un président |
| *Spotlight* (2015) | Une **enquête au long cours** : des mois de vérification avant publication |

> Albert Londres : « Notre métier n’est pas de faire plaisir, non plus de faire du tort, il est de porter la plume dans la plaie. »

## Au XXIe siècle
La fiction s’intéresse aux réseaux sociaux, à la vitesse, à la concurrence de l’attention, et interroge la **frontière** entre informer et faire du spectacle.

## Ce que la fiction apporte
!> Là où un article expose un **fait**, le roman ou le film montre **comment ce fait a été obtenu** — et ce qu’il a coûté.

Elle rend visibles les **conditions** du travail journalistique : les délais, la hiérarchie, les pressions économiques et politiques, le doute avant de publier.`,
          },
          questions: [
            ['Quel roman de Balzac décrit le monde du journalisme parisien ?', ['Illusions perdues', 'Le Père Goriot', 'Bel-Ami', 'L’Assommoir'], 0, 'Lucien de Rubempré y réussit puis s’y perd.'],
            ['Qui est le héros de Bel-Ami ?', ['Georges Duroy', 'Lucien de Rubempré', 'Roderick Usher', 'Rodrigue'], 0, 'Il gravit les échelons d’un journal par les femmes et l’intrigue.'],
            ['Que dénoncent Balzac et Maupassant à propos de la presse ?', ['Un système qui produit le mensonge, au-delà des individus', 'L’incompétence technique des imprimeurs', 'Le prix trop élevé des journaux', 'Le manque de lecteurs'], 0, 'L’article s’y vend, la critique dépend de qui paie.'],
            ['Quel journaliste a défini le métier comme « porter la plume dans la plaie » ?', ['Albert Londres', 'Émile Zola', 'Guy de Maupassant', 'Honoré de Balzac'], 0, 'Il est l’inventeur du grand reportage.'],
            ['Quel film suit deux journalistes révélant le scandale du Watergate ?', ['Les Hommes du président', 'Spotlight', 'Citizen Kane', 'La Parure'], 0, 'Leur enquête mène à la démission d’un président.'],
            ['Que montre le film Spotlight ?', ['Une équipe menant une enquête au long cours avant publication', 'Un journaliste corrompu', 'La naissance d’un journal', 'Une rédaction de télévision en direct'], 0, 'Des mois de vérification y précèdent la publication.'],
            ['Qu’apporte la fiction par rapport à un article de presse ?', ['Elle montre comment le fait a été obtenu et ce qu’il a coûté', 'Elle donne des informations plus récentes', 'Elle garantit la véracité des faits', 'Elle remplace le travail des journalistes'], 0, 'Elle rend visibles les conditions du métier.'],
            ['Dans Bel-Ami, Georges Duroy réussit grâce à son talent d’écriture.', ['Vrai', 'Faux'], 1, 'Il réussit par les femmes et l’intrigue, sans talent particulier.'],
          ],
        },
        // ===================================================================
        // Chapitre 5 : Questionnements complémentaires — La ville
        // ===================================================================
        {
          titre: 'La ville comme sujet de roman',
          axe: 'Questionnements complémentaires — La ville, lieu de tous les possibles ?',
          lecon: {
            titre: 'Un décor qui devient un personnage',
            cours: `Depuis le XIXe siècle, la ville n’est plus le lieu où se passe l’histoire : elle en devient l’un des acteurs.

## Pourquoi le XIXe siècle
~ L’exode rural → la révolution industrielle → les grands travaux d’Haussmann → Paris devient méconnaissable en trente ans

Le roman prend acte de cette transformation.

## Trois façons de traiter la ville
| Le romancier | Sa ville | Ce qu’elle fait |
| **Balzac** | Un **champ de bataille** | Elle promet, elle donne — et elle **dévore** |
| **Zola** | Un **milieu qui détermine** | Le quartier explique le destin : *L’Assommoir* se joue dans quelques rues de la Goutte-d’Or |
| **Hugo** | Un **labyrinthe** | Ruelles, égouts et barricades : on s’y cache, on y fuit, on s’y perd |

= Rastignac, du haut du Père-Lachaise : « À nous deux maintenant ! »

## Les procédés à repérer
| Le procédé | Son effet |
| La **description en focalisation interne** | La ville vue **par** un personnage, souvent à son arrivée |
| La **personnification** | La ville « gronde », « dévore », « respire » |
| Les **champs lexicaux** | La foule, le bruit, la lumière, la boue |
| Le **contraste** | Quartiers riches et pauvres, souvent à quelques rues d’écart |
| Le **rythme** des phrases | Il mime l’agitation urbaine |

!> Décrire une ville, c’est toujours porter un **jugement** sur elle. Le choix de ce qu’on montre — vitrines ou taudis — dit l’intention du romancier.`,
          },
          questions: [
            ['Pourquoi la ville devient-elle un sujet de roman au XIXe siècle ?', ['Parce que l’exode rural et l’industrialisation la transforment radicalement', 'Parce que les romanciers y habitent tous', 'Parce que la campagne n’intéresse plus personne', 'Parce que l’imprimerie s’y installe'], 0, 'Les grands travaux d’Haussmann changent Paris en trente ans.'],
            ['Quel personnage de Balzac lance « À nous deux maintenant ! » à Paris ?', ['Rastignac', 'Lucien de Rubempré', 'Georges Duroy', 'Jean Valjean'], 0, 'Il le lance du haut du Père-Lachaise.'],
            ['Comment Zola traite-t-il la ville ?', ['Comme un milieu qui détermine le destin des personnages', 'Comme un décor neutre', 'Comme un lieu de villégiature', 'Comme un souvenir d’enfance'], 0, 'L’Assommoir se joue dans quelques rues de la Goutte-d’Or.'],
            ['Dans quel roman Paris est-il un labyrinthe d’égouts et de barricades ?', ['Les Misérables', 'L’Assommoir', 'Bel-Ami', 'Illusions perdues'], 0, 'Hugo y fait de la ville un dédale.'],
            ['Qu’est-ce que la personnification appliquée à la ville ?', ['Lui prêter des attributs humains : elle gronde, dévore, respire', 'La comparer à une autre ville', 'La décrire en détail', 'La nommer par son quartier'], 0, 'C’est ce qui en fait un personnage à part entière.'],
            ['Qu’est-ce que la focalisation interne dans une description de ville ?', ['La ville vue par les yeux d’un personnage', 'Une description faite par le narrateur omniscient', 'Une description objective et chiffrée', 'Un plan de la ville'], 0, 'Souvent au moment de son arrivée.'],
            ['Que révèle le choix de ce qu’on décrit dans une ville ?', ['L’intention du romancier, son jugement sur elle', 'La saison de l’année', 'Le budget du roman', 'La longueur du chapitre'], 0, 'Montrer les vitrines ou les taudis n’est jamais neutre.'],
            ['Dans le roman du XIXe siècle, la ville n’est qu’un décor sans influence.', ['Vrai', 'Faux'], 1, 'Elle devient un acteur, et chez Zola elle détermine les destins.'],
          ],
        },
        {
          titre: 'La ville comme objet poétique',
          axe: 'Questionnements complémentaires — La ville, lieu de tous les possibles ?',
          lecon: {
            titre: 'De la laideur, faire un poème',
            cours: `« Tu m’as donné ta boue et j’en ai fait de l’or. » La poésie entre dans la ville, et y trouve une beauté nouvelle.

## Baudelaire, l’inventeur
@ 1857 — Les Fleurs du mal ; la section « Tableaux parisiens » fait de Paris un sujet poétique à part entière

Le poète y est un **flâneur** : il marche, observe, capte les visages d’un instant — la passante, la vieille femme, l’aveugle, le cygne échappé.

= « Tu m’as donné ta boue et j’en ai fait de l’or »

## Après lui
| Le poète | Sa ville |
| **Verlaine** | Pluvieuse et mélancolique : « Il pleure dans mon cœur / Comme il pleut sur la ville » |
| **Rimbaud** | Rêvée et démesurée, dans les *Illuminations* |
| **Apollinaire** | « Zone » (1913) ouvre *Alcools* sur un Paris moderne — tour Eiffel, affiches, hangars — **sans ponctuation** |
| **Cendrars**, **Réda**, **Prévert** | Jusqu’à la chanson |

## Les procédés
| Le procédé | Ce qu’il permet |
| La **personnification** | La ville devient un être |
| L’**oxymore** et l’**antithèse** | Dire la beauté du laid : « soleil noir », « fangeuse grandeur » |
| L’**énumération** | Elle mime le défilé du regard |
| La **synesthésie** | Mêler bruits, odeurs et couleurs |
| Le **vers libre** et le **poème en prose** | Des formes assez souples pour épouser le désordre urbain |

!> La poésie de la ville **n’embellit pas** : elle **transfigure**. La distinction est capitale — Baudelaire ne cache pas la boue, il en fait de l’or.

> Elle regarde ce que personne ne regarde, et le rend visible.`,
          },
          questions: [
            ['Quel recueil contient la section « Tableaux parisiens » ?', ['Les Fleurs du mal', 'Alcools', 'Les Contemplations', 'Illuminations'], 0, 'Baudelaire y fait de Paris un sujet poétique.'],
            ['Qu’est-ce qu’un flâneur chez Baudelaire ?', ['Un poète qui marche dans la ville et capte les instants', 'Un promeneur de campagne', 'Un journaliste enquêteur', 'Un habitant sans domicile'], 0, 'Il observe la passante, la vieille femme, l’aveugle.'],
            ['Que signifie « Tu m’as donné ta boue et j’en ai fait de l’or » ?', ['Le poète transfigure la laideur de la ville en poésie', 'Le poète s’est enrichi grâce à la ville', 'La ville a été reconstruite en or', 'Le poète regrette la campagne'], 0, 'C’est le programme de la poésie urbaine.'],
            ['Quel poème d’Apollinaire ouvre Alcools sur un Paris moderne ?', ['« Zone »', '« Le Pont Mirabeau »', '« Demain, dès l’aube… »', '« Le Cygne »'], 0, 'Publié en 1913, sans ponctuation.'],
            ['Qu’est-ce qu’un oxymore ?', ['L’association de deux mots de sens contraires, comme « soleil noir »', 'Une répétition de sons', 'Une comparaison développée', 'Une exagération'], 0, 'Il permet de dire la beauté du laid.'],
            ['Qu’est-ce qu’une synesthésie ?', ['Le mélange de sensations de natures différentes', 'La répétition d’un vers', 'Une rime intérieure', 'Un vers de douze syllabes'], 0, 'Bruits, odeurs et couleurs y sont associés.'],
            ['Quelle forme poétique s’impose pour dire le désordre urbain ?', ['Le vers libre et le poème en prose', 'Le sonnet', 'L’alexandrin à rimes plates', 'La ballade'], 0, 'Des formes assez souples pour épouser la ville moderne.'],
            ['La poésie de la ville cherche à embellir ce qu’elle décrit.', ['Vrai', 'Faux'], 1, 'Elle transfigure : elle rend visible ce que personne ne regarde.'],
          ],
        },
        {
          titre: 'L’importance de la ville dans le roman policier',
          axe: 'Questionnements complémentaires — La ville, lieu de tous les possibles ?',
          lecon: {
            titre: 'Le crime a besoin d’une foule',
            cours: `Le roman policier naît avec la grande ville. Il lui faut une foule pour s’y cacher.

## Les origines
@ 1841 — Poe publie « Double assassinat dans la rue Morgue », premier récit d’énigme, avec le chevalier Dupin
@ 1841 — Paris se dote d’une police criminelle moderne ; Vidocq, ancien bagnard devenu chef de la Sûreté, inspire les romanciers
@ 1887 — Conan Doyle crée Sherlock Holmes dans un Londres de brouillard et de fiacres

Dupin résout par la seule **déduction**.

## Les grandes figures françaises
| L’auteur | Son héros ou son apport |
| **Émile Gaboriau** | Il invente le roman judiciaire |
| **Gaston Leroux** | *Le Mystère de la chambre jaune* (1907), modèle du **crime en chambre close** |
| **Maurice Leblanc** | **Arsène Lupin**, gentleman-cambrioleur : le héros est le **voleur** |
| **Georges Simenon** | Le commissaire **Maigret**, dont les enquêtes tiennent moins à l’indice qu’à l’**atmosphère** |

## Trois sous-genres
| Le sous-genre | Son ressort | Ses auteurs |
| Le **roman à énigme** | Un mystère, des indices, une solution **logique** | Christie, Leroux |
| Le **roman noir** | La société est **corrompue**, le détective désabusé | Chandler, Manchette |
| Le **thriller** | Le **suspense** l’emporte sur l’énigme : on court après le criminel |

## Le rôle de la ville
| Ce qu’elle fournit | |
| L’**anonymat** | On disparaît dans la foule |
| La **variété sociale** | Le crime traverse les milieux |
| Les **lieux typiques** | Bar, port, gare, terrain vague |
| Une **atmosphère** | |

!> Chez les meilleurs auteurs, changer la ville changerait le roman. **Maigret n’existe pas hors de Paris.**`,
          },
          questions: [
            ['Quel récit de 1841 est considéré comme le premier roman policier ?', ['« Double assassinat dans la rue Morgue » de Poe', 'Le Mystère de la chambre jaune', 'Une étude en rouge', 'Arsène Lupin gentleman-cambrioleur'], 0, 'Le chevalier Dupin y résout l’énigme par la déduction.'],
            ['Dans quelle ville Sherlock Holmes enquête-t-il ?', ['Londres', 'Paris', 'New York', 'Édimbourg'], 0, 'Un Londres de brouillard, de fiacres et de bas-fonds.'],
            ['Quel roman de Gaston Leroux est le modèle du crime en chambre close ?', ['Le Mystère de la chambre jaune', 'Bel-Ami', 'Les Misérables', 'La Parure'], 0, 'Publié en 1907.'],
            ['Quel personnage de Maurice Leblanc inverse les rôles du policier et du voleur ?', ['Arsène Lupin', 'Maigret', 'Sherlock Holmes', 'Rouletabille'], 0, 'Le gentleman-cambrioleur est le héros.'],
            ['Sur quoi reposent les enquêtes du commissaire Maigret ?', ['Sur l’atmosphère d’un lieu plus que sur l’indice', 'Sur des analyses scientifiques', 'Sur des courses-poursuites', 'Sur des interrogatoires musclés'], 0, 'Un café, un quartier, une pluie sur la Seine.'],
            ['Qu’est-ce qui caractérise le roman noir ?', ['Une société corrompue, un détective désabusé, une ville hostile', 'Une énigme résolue par la logique', 'Un suspense permanent sans enquête', 'Une intrigue historique'], 0, 'Chandler et Manchette en sont des maîtres.'],
            ['Qu’apporte la grande ville au roman policier ?', ['L’anonymat, la variété sociale et une atmosphère', 'Un climat plus doux', 'Des personnages plus riches', 'Une intrigue plus courte'], 0, 'Maigret n’existe pas hors de Paris.'],
            ['Le roman policier existait bien avant les grandes villes modernes.', ['Vrai', 'Faux'], 1, 'Il naît avec elles, au XIXe siècle : il lui faut une foule et une police organisée.'],
          ],
        },
        {
          titre: 'La ville dans la photographie, les films et la bande-dessinée',
          axe: 'Questionnements complémentaires — La ville, lieu de tous les possibles ?',
          lecon: {
            titre: 'Cadrer la ville, c’est déjà la raconter',
            cours: `Trois arts, une même leçon : ce qui est hors champ compte autant que ce qui est montré.

## La photographie
| Le photographe | Ce qu’il montre |
| **Eugène Atget** | Le vieux Paris **avant sa disparition** : rues vides, boutiques, cours. Une archive devenue œuvre |
| **Robert Doisneau**, **Willy Ronis** | Le Paris populaire de l’après-guerre : enfants, bistrots, amoureux |
| Les documentaristes contemporains | Les périphéries, les grands ensembles, les chantiers |

!> Le fameux **baiser de l’Hôtel de Ville** est une photo **mise en scène**. Une image « spontanée » ne l’est pas toujours.

| La notion | Ce qu’elle désigne |
| Le **cadrage** | Ce qu’on garde, ce qu’on exclut |
| L’**angle de prise de vue** | Plongée, contre-plongée |
| La **profondeur de champ** | |
| L’**instant décisif** | Cher à Cartier-Bresson |

## Le cinéma
| Le film | Sa ville |
| *Metropolis* (Fritz Lang, 1927) | La ville **verticale** : ouvriers sous terre, maîtres au sommet |
| *Blade Runner* (1982) | Il en hérite directement |
| *La Haine* (1995) | La banlieue, filmée comme on avait filmé les quais et les faubourgs |

| La notion | Ce qu’elle désigne |
| L’**échelle de plan** | Plan général pour situer, gros plan pour l’émotion |
| Le **travelling**, le **plan-séquence** | Le mouvement |
| La **bande-son** | Le bruit d’une ville est déjà un récit |

## La bande dessinée
| L’auteur | Sa ville |
| **Hergé** | Il documente Bruxelles, Shanghai, New York |
| **Schuiten et Peeters** | *Les Cités obscures* : des villes inventées, personnages à part entière |
| **Tardi** | Le Paris de 1914, reconstitué rue par rue |

| La notion | Ce qu’elle désigne |
| La **case** et sa taille | L’unité de lecture |
| La **planche** | La composition d’ensemble |
| La **bulle** et le **cartouche** | La parole et le texte du narrateur |
| L’**ellipse** entre deux cases | Ce que le **lecteur** comble lui-même |`,
          },
          questions: [
            ['Quel photographe a documenté le vieux Paris avant sa disparition ?', ['Eugène Atget', 'Robert Doisneau', 'Willy Ronis', 'Henri Cartier-Bresson'], 0, 'Rues vides, boutiques et cours, dans un travail d’archive.'],
            ['Qu’est-ce que le cadrage en photographie ?', ['Le choix de ce que l’image garde et de ce qu’elle exclut', 'Le réglage de la lumière', 'Le format d’impression', 'Le choix de l’appareil'], 0, 'Ce qui est hors champ compte autant que ce qui est montré.'],
            ['Qu’est-ce qu’une contre-plongée ?', ['Une prise de vue d’en bas, qui grandit le sujet', 'Une prise de vue d’en haut', 'Une photo prise de nuit', 'Un cadrage très serré'], 0, 'La plongée, à l’inverse, écrase le sujet.'],
            ['Quel film de 1927 met en scène une ville verticale et divisée ?', ['Metropolis', 'Blade Runner', 'La Haine', 'Les Hommes du président'], 0, 'Fritz Lang y installe les ouvriers sous terre et les maîtres au sommet.'],
            ['Qu’est-ce qu’un plan général au cinéma ?', ['Un plan large qui situe l’action dans son décor', 'Un gros plan sur un visage', 'Un plan filmé en mouvement', 'Un plan sans son'], 0, 'Le gros plan sert, lui, l’émotion.'],
            ['Comment appelle-t-on le texte du narrateur en bande dessinée ?', ['Le cartouche', 'La bulle', 'La case', 'La planche'], 0, 'La bulle contient les paroles des personnages.'],
            ['Quelle série de bande dessinée invente des villes entières comme personnages ?', ['Les Cités obscures, de Schuiten et Peeters', 'Les Aventures de Tintin', 'Les Misérables en BD', 'Astérix'], 0, 'La ville y est le sujet même du récit.'],
            ['En bande dessinée, tout ce qui se passe est montré dans les cases.', ['Vrai', 'Faux'], 1, 'Entre deux cases, une ellipse laisse au lecteur le soin de combler.'],
          ],
        },
      ],
    },
  ],
}
