// Histoire-Géographie — Cinquième : LE PROGRAMME COMPLET (21 fiches, 2 rayons).
//
// CE QUE REMPLACE CE MODULE. La 5e n'avait que CINQ chapitres d'histoire-géo,
// hérités du tout premier jeu de données (migration 008) : « Byzance et l'Europe
// carolingienne », « Société, Église et pouvoir féodal », « L'islam médiéval :
// pouvoirs et cultures », « La croissance démographique et ses effets » et
// « L'accès aux ressources : énergie et eau ». Trois d'histoire, deux de
// géographie, pour deux programmes entiers.
//
// ⚠️ CE MODULE OUVRE LES DEUX ONGLETS D'UN SEUL COUP. Contrairement à la 3e, où
// l'histoire (291) et la géographie (293) sont arrivées en deux temps, les deux
// maquettes de 5e ont été relevées ensemble : un seul module, deux blocs, deux
// rayons (`chapters.discipline`, migration 247). `disciplinesOf`
// (lib/subject-template) rend un onglet par rayon dès qu'il y en a DEUX — le
// dossier s'ouvre donc sur « Histoire » et « Géographie » dès l'exécution.
//
// LE DÉCOUPAGE.
//   Rayon HISTOIRE (positions 1 → 13) — 3 chapitres, 13 fiches
//   Rayon GÉOGRAPHIE (positions 14 → 21) — 3 chapitres, 8 fiches
// Les positions se suivent d'un rayon à l'autre : la page trie par position à
// l'intérieur de chaque onglet, mais l'arène, la file « À revoir » et les exports
// ignorent le rayon — deux numérotations partant de 1 y mêleraient les deux
// moitiés du dossier.
//
// ⚠️ UNE COLLISION DE TITRE, ET ELLE EST EXACTE. La fiche héritée « La croissance
// démographique et ses effets » porte le titre EXACT d'une fiche du programme
// neuf de géographie, et `chapters` porte UNIQUE(subject_id, level, title). Le
// ménage est donc OBLIGATOIRE — sans lui, l'INSERT tomberait dans le ON CONFLICT
// DO NOTHING et sa leçon échouerait sur une clé étrangère absente. Et c'est le
// repère `theme IS NULL` qui rend le REJEU sûr : borné au titre, le ménage
// supprimerait au second passage la fiche neuve, qui porte le même titre.
//
// ⚠️ Le slug `histoire-geo` porte désormais HUIT modules (`histoire-geo-tle` =
// 227, `geographie-tle` = 229, `histoire-geo-1re` = 245, `histoire-tle-1-6` =
// 246, `histoire-geo-2de` = 279, `histoire-3e` = 291, `geographie-3e` = 293,
// celui-ci = 306) : ne JAMAIS générer avec `--slugs histoire-geo`, qui les
// fusionnerait et réécrirait sept migrations. Toujours `--modules histoire-geo-5e`.

export default {
  slug: 'histoire-geo',
  nom: 'Histoire-Géographie',

  titreMigration: 'HISTOIRE-GÉO 5e — LE PROGRAMME COMPLET (21 fiches, 2 onglets)',

  motif: `CONSTAT : la Cinquième n'avait que CINQ chapitres d'histoire-géo, hérités du
premier jeu de données de l'app — trois d'histoire, deux de géographie, pour deux
programmes entiers. Un élève de 5e qui révisait l'Empire byzantin, la
Méditerranée médiévale, les paysans et les seigneurs, l'émergence des villes,
l'affirmation de l'État royal, les grandes découvertes, l'humanisme, les conflits
religieux, la monarchie absolue, le développement durable, les inégalités
mondiales, l'alimentation, l'eau, l'énergie ou les risques ne trouvait presque
RIEN.
CE QUE FAIT CETTE MIGRATION : elle installe les 21 fiches des deux programmes,
rangées sous leurs 6 chapitres, et retire les 5 fiches génériques.
ELLE OUVRE AUSSI LES DEUX ONGLETS DU DOSSIER : les 13 fiches d'histoire portent
le rayon "histoire", les 8 fiches de géographie le rayon "geographie", et la page
matière rend un onglet par rayon dès qu'il y en a DEUX. Le dossier d'histoire-géo
de 5e s'ouvre donc sur "Histoire" et "Géographie", comme en 3e, en 2de, en 1re et
en Terminale.`,

  menage: [
    {
      raison: `Les colonnes chapters.theme (migration 234) et chapters.discipline
(migration 247) conditionnent tout ce qui suit : ce module range ses 21 fiches
sous 6 chapitres et deux rayons, et l'INSERT écrit les deux colonnes. Elles sont
REPRISES ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que la
234 et la 247 soient passées en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 5 anciens chapitres
déjà supprimés et les 21 neufs pas encore posés : une matière vide.
Le ménage qui suit LIT la colonne theme : elle doit exister avant lui, pas
seulement avant les insertions.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre, et l'onglet ne se dédoublerait pas.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS discipline TEXT;
GRANT SELECT (discipline) ON public.chapters TO anon;
GRANT SELECT (discipline) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités de la 008 partent, au niveau 5e SEULEMENT.

CE MÉNAGE EST OBLIGATOIRE, pas seulement souhaitable : "La croissance
démographique et ses effets" est à la fois un titre hérité et le titre d'une
fiche du programme neuf de géographie, et chapters porte
UNIQUE(subject_id, level, title). Sans ménage préalable, cet INSERT tomberait
dans le ON CONFLICT DO NOTHING et sa leçon échouerait ensuite sur une clé
étrangère absente — la migration s'arrêterait à mi-parcours.

LE REPÈRE EST theme IS NULL, ET C'EST CE QUI REND LE REJEU SÛR. Borné au titre,
le ménage supprimerait au second passage la fiche NEUVE qui porte ce même titre.
L'ancienne série date de la 008, bien avant la colonne theme, tandis que les 21
fiches neuves en portent une dès l'INSERT : la distinction est exacte et stable.
Elle évite au passage la question des apostrophes de "L'islam médiéval" et de
"L'accès aux ressources".
Le filtre level = '5e' est indispensable : l'histoire-géo existe sur sept
niveaux, et plusieurs portent encore des chapitres sans theme.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '5e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '5e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '5e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    // =====================================================================
    // RAYON HISTOIRE — positions 1 → 13
    // =====================================================================
    {
      niveaux: ['5e'],
      rayon: 'histoire',
      chapitres: [
        {
          titre: 'Empire et civilisation arabo-musulmans',
          axe: 'Chrétientés et islam (VIe-XIIIe siècles), des mondes en contact',
          lecon: {
            titre: 'Naissance d’une religion, naissance d’un empire',
            cours: `En un siècle, une religion née dans le désert d’Arabie devient l’empire le plus vaste du monde — et le passeur des savoirs de l’Antiquité.

## La naissance de l’islam
@ 610 — Muhammad, marchand de La Mecque, commence à prêcher un dieu unique, Allah
@ 622 — L’Hégire : chassé de La Mecque, il rejoint Médine. C’est l’an 1 du calendrier musulman
@ 630 — Il revient prendre La Mecque
@ 632 — Mort de Muhammad

Le livre sacré est le **Coran**.

## Les cinq piliers
~ La profession de foi → Les cinq prières quotidiennes → L’aumône → Le jeûne du ramadan → Le pèlerinage à La Mecque

## Un empire en un siècle
Après la mort de Muhammad, les **califes** — ses successeurs — conquièrent Arabie, Syrie, Égypte, Perse, Afrique du Nord et Espagne (**al-Andalus**).

@ 750 — L’empire va de l’Indus aux Pyrénées

| La dynastie | Sa capitale | Depuis |
| Les **Omeyyades** | **Damas** | |
| Les **Abbassides** | **Bagdad** | 750 |

## Une civilisation brillante
| Le lieu ou l’homme | Son apport |
| **Bagdad** | Peut-être un million d’habitants au IXe siècle |
| La **Maison de la Sagesse** | Elle traduit et prolonge les savoirs grecs, perses et indiens |
| **Al-Khwarizmi** | Il fonde l’**algèbre** |
| **Avicenne** | Un canon de médecine lu en Europe pendant cinq siècles |

~ Les chiffres, venus d’Inde → l’empire arabo-musulman → l’Europe

Le **papier**, venu de Chine, suit le même chemin.

> L’empire arabo-musulman n’est pas seulement un conquérant : c’est un **passeur**, qui transmet à l’Europe médiévale des savoirs qu’elle avait perdus.

## Une société diverse
Musulmans, chrétiens et juifs cohabitent. Les **dhimmis** — chrétiens et juifs — conservent leur religion contre un impôt spécifique.

!> Leur statut est **inférieur mais protégé** : ce n’est ni l’égalité, ni la persécution. Le raccourci dans un sens ou dans l’autre est faux.`,
          },
          questions: [
            ['En quelle année a lieu l’Hégire ?', ['622', '610', '630', '750'], 0, 'Le départ de Muhammad vers Médine ouvre le calendrier musulman.'],
            ['Dans quelle ville Muhammad prêche-t-il d’abord ?', ['La Mecque', 'Médine', 'Damas', 'Bagdad'], 0, 'Il rejoint Médine en 622 après en avoir été chassé.'],
            ['Comment s’appelle le livre sacré de l’islam ?', ['Le Coran', 'La Torah', 'Les Évangiles', 'La Sunna'], 0, 'Les pratiques reposent sur les cinq piliers.'],
            ['Quelle dynastie installe sa capitale à Bagdad en 750 ?', ['Les Abbassides', 'Les Omeyyades', 'Les Fatimides', 'Les Seldjoukides'], 0, 'Les Omeyyades gouvernaient depuis Damas.'],
            ['Jusqu’où s’étend l’empire musulman en 750 ?', ['De l’Indus aux Pyrénées', 'De la Chine à l’Atlantique', 'De l’Égypte à la Grèce', 'De l’Arabie à la mer Noire'], 0, 'Un siècle de conquêtes après la mort de Muhammad.'],
            ['Qu’est-ce que la Maison de la Sagesse ?', ['Un centre de traduction et de savoir à Bagdad', 'Une mosquée de La Mecque', 'Un palais califal de Damas', 'Une école coranique de Cordoue'], 0, 'Elle transmet les savoirs grecs, perses et indiens.'],
            ['Qui sont les dhimmis ?', ['Les chrétiens et les juifs, qui gardent leur religion contre un impôt', 'Les esclaves de l’empire', 'Les soldats du calife', 'Les marchands étrangers'], 0, 'Un statut inférieur mais protégé.'],
            ['L’empire musulman s’est constitué en plusieurs siècles.', ['Vrai', 'Faux'], 1, 'L’essentiel des conquêtes tient en un siècle, de 632 à 750.'],
          ],
        },
        {
          titre: 'L’Empire byzantin',
          axe: 'Chrétientés et islam (VIe-XIIIe siècles), des mondes en contact',
          lecon: {
            titre: 'L’Empire romain d’Orient, mille ans de plus',
            cours: `L’Empire romain d’Occident tombe en 476. Sa moitié orientale, elle, tient mille ans de plus.

## L’héritier de Rome
@ 330 — Constantin fonde Constantinople, l’ancienne Byzance
@ 395 — L’Empire romain se divise en deux
@ 476 — Chute de l’Empire d’Occident
@ 1453 — Chute de Constantinople : fin de l’Empire byzantin

!> On les appelle « Byzantins », mais eux se disent **Romains**. Le mot « byzantin » a été forgé bien plus tard, par des historiens occidentaux.

## Constantinople
| Son atout | Le détail |
| Sa **position** | Sur le **Bosphore**, entre l’Europe et l’Asie |
| Ses **routes** | À la charnière de la Méditerranée et de la mer Noire |
| Ses **murailles** | Triples : elle résiste à tous les sièges jusqu’en 1204 |
| Sa **taille** | Plusieurs centaines de milliers d’habitants, quand Paris en a quelques dizaines de milliers |

On y trouve **Sainte-Sophie**, l’**hippodrome**, le **palais impérial**, et des marchés où se croisent Vénitiens, Arabes, Slaves et Scandinaves.

## L’empereur
Le **basileus** cumule tout : chef politique, chef militaire, chef de l’Église — il nomme le **patriarche**. Son pouvoir est dit **théocratique** : il représente Dieu sur terre.

| **Justinien** (527-565) | Ce qu’il fait |
| La reconquête | Il tente de reprendre l’Occident |
| Le **Code justinien** | Il rassemble tout le droit romain |
| **Sainte-Sophie** | Il la fait construire |

## Le christianisme orthodoxe
| Byzance | Rome |
| Langue **grecque** | Langue **latine** |
| Mariage des prêtres autorisé | Célibat |
| Refus de l’autorité du pape | Autorité du pape |

@ 1054 — Le schisme sépare l’Église orthodoxe de l’Église catholique

Les **icônes** — images peintes du Christ et des saints — occupent une place centrale dans la piété orthodoxe.

## La fin
@ 1204 — La quatrième croisade pille Constantinople
@ 29 mai 1453 — Mehmed II et les Ottomans prennent la ville ; Sainte-Sophie devient une mosquée`,
          },
          questions: [
            ['Quelle est la capitale de l’Empire byzantin ?', ['Constantinople', 'Rome', 'Athènes', 'Damas'], 0, 'L’ancienne Byzance, l’actuelle Istanbul.'],
            ['En quelle année l’Empire romain se divise-t-il ?', ['395', '476', '330', '1054'], 0, 'La partie occidentale s’effondre en 476, l’orientale survit mille ans.'],
            ['Comment appelle-t-on l’empereur byzantin ?', ['Le basileus', 'Le calife', 'Le patriarche', 'Le doge'], 0, 'Il cumule pouvoir politique, militaire et religieux.'],
            ['Quel empereur fait construire Sainte-Sophie et rédiger un code de lois ?', ['Justinien', 'Constantin', 'Charlemagne', 'Mehmed II'], 0, 'Il règne de 527 à 565.'],
            ['Qu’est-ce que le schisme de 1054 ?', ['La séparation entre l’Église orthodoxe et l’Église catholique', 'La chute de Constantinople', 'La division de l’Empire romain', 'La première croisade'], 0, 'Langue, autorité du pape et pratiques divergeaient depuis longtemps.'],
            ['Quelle langue parle-t-on à Byzance ?', ['Le grec', 'Le latin', 'L’arabe', 'Le slavon uniquement'], 0, 'C’est l’une des différences avec Rome.'],
            ['En quelle année Constantinople tombe-t-elle aux mains des Ottomans ?', ['1453', '1204', '1054', '1492'], 0, 'Mehmed II s’en empare le 29 mai.'],
            ['Les habitants de l’Empire byzantin se disaient Byzantins.', ['Vrai', 'Faux'], 1, 'Ils se disaient Romains : le mot « byzantin » est postérieur.'],
          ],
        },
        {
          titre: 'L’Europe carolingienne',
          axe: 'Chrétientés et islam (VIe-XIIIe siècles), des mondes en contact',
          lecon: {
            titre: 'Charlemagne et la renaissance d’un empire d’Occident',
            cours: `Trois siècles après la chute de Rome, l’Occident se redonne un empereur. Il ne durera qu’une génération.

## Des Mérovingiens aux Carolingiens
@ Vers 496 — Baptême de Clovis, premier roi franc chrétien
@ 751 — Pépin le Bref écarte les Mérovingiens et fonde la dynastie carolingienne, avec l’appui du pape
@ 768-814 — Règne de Charlemagne
@ 25 décembre 800 — Charlemagne est couronné empereur à Rome par le pape Léon III
@ 843 — Le traité de Verdun partage l’empire en trois

## Charlemagne
Il mène plus de **cinquante** campagnes militaires — Saxons, Lombards, Avars — et **double** l’étendue du royaume : France, Allemagne, Italie du Nord, Catalogne.

> L’Occident retrouve un empereur pour la première fois depuis **476**.

## Gouverner un empire immense
| L’outil | Sa fonction |
| **Aix-la-Chapelle** | La capitale |
| Les **comtés** et les **comtes** | Le découpage administratif |
| Les ***missi dominici*** | Les « envoyés du maître », par deux — un laïc et un religieux — pour **contrôler les comtes** |
| Les **capitulaires** | Les lois écrites de l’empereur |

## La renaissance carolingienne
~ Ouvrir des écoles dans les monastères → faire venir des savants comme Alcuin → copier les textes antiques dans les scriptoria

Une écriture nouvelle, plus lisible, apparaît : la **minuscule caroline** — l’ancêtre de nos minuscules.

> Beaucoup de textes latins ne nous sont parvenus que par ces copies carolingiennes.

## Le partage
À la mort de **Louis le Pieux**, ses trois fils se déchirent.

| La part | Ce qu’elle deviendra |
| La **Francie occidentale** | La France |
| La **Francie orientale** | L’Allemagne |
| La **Lotharingie** | Une longue bande entre les deux |

!> L’unité de l’Occident est rompue pour **mille ans**. Le traité de Verdun n’est pas un détail administratif : c’est la naissance de la carte de l’Europe.`,
          },
          questions: [
            ['Qui fonde la dynastie carolingienne en 751 ?', ['Pépin le Bref', 'Clovis', 'Charlemagne', 'Louis le Pieux'], 0, 'Il écarte les Mérovingiens avec l’appui du pape.'],
            ['Quand Charlemagne est-il couronné empereur ?', ['Le 25 décembre 800', 'En 768', 'En 843', 'En 496'], 0, 'À Rome, par le pape Léon III.'],
            ['Quelle est la capitale de l’empire de Charlemagne ?', ['Aix-la-Chapelle', 'Paris', 'Rome', 'Reims'], 0, 'Il y fait bâtir son palais et sa chapelle.'],
            ['Qui sont les missi dominici ?', ['Les envoyés de l’empereur chargés de contrôler les comtes', 'Les soldats de la garde impériale', 'Les moines copistes', 'Les percepteurs d’impôts du pape'], 0, 'Ils circulent par deux, un laïc et un religieux.'],
            ['Comment appelle-t-on les lois écrites de Charlemagne ?', ['Les capitulaires', 'Les cartulaires', 'Les chartes', 'Les édits'], 0, 'Elles étaient diffusées dans tout l’empire.'],
            ['Qu’est-ce que la minuscule caroline ?', ['Une écriture nouvelle, plus lisible, ancêtre de nos minuscules', 'Une école palatine', 'Un impôt sur les monastères', 'Une langue parlée à la cour'], 0, 'Elle naît dans les scriptoria de la renaissance carolingienne.'],
            ['Que fait le traité de Verdun en 843 ?', ['Il partage l’empire entre les trois petits-fils de Charlemagne', 'Il couronne Charlemagne empereur', 'Il met fin aux invasions vikings', 'Il réunifie l’Occident'], 0, 'Francie occidentale, Lotharingie, Francie orientale.'],
            ['Charlemagne savait parfaitement lire et écrire dès son enfance.', ['Vrai', 'Faux'], 1, 'Il a appris à lire tardivement, et n’a jamais bien maîtrisé l’écriture — ce qui ne l’a pas empêché de promouvoir les écoles.'],
          ],
        },
        {
          titre: 'La Méditerranée : un espace de contacts entre trois civilisations',
          axe: 'Chrétientés et islam (VIe-XIIIe siècles), des mondes en contact',
          lecon: {
            titre: 'Guerres, commerces et échanges de savoirs',
            cours: `La Méditerranée médiévale est à la fois une frontière et un pont. Les mêmes routes portent les armées et les livres.

## Trois civilisations en présence
| La civilisation | Son centre |
| La **chrétienté latine** | L’Occident catholique, Rome |
| La **chrétienté orthodoxe** | Byzance, Constantinople |
| Le monde **musulman** | Damas, puis Bagdad, Le Caire, Cordoue |

## Les affrontements : les croisades
@ 1095 — Le pape Urbain II appelle à reprendre Jérusalem
@ 1099 — La première croisade prend Jérusalem et fonde les États latins d’Orient
@ 1187 — Saladin reprend Jérusalem
@ 1204 — La quatrième croisade pille Constantinople : des chrétiens contre des chrétiens
@ 1291 — Chute de Saint-Jean-d’Acre, dernier bastion latin
@ 1492 — La Reconquista s’achève par la prise de Grenade

Huit croisades se succèdent entre 1095 et 1270.

## Les échanges commerciaux
Malgré les guerres, le commerce ne s’arrête **jamais**. **Venise**, **Gênes** et **Pise** installent des **comptoirs** dans tout le bassin.

| Venus d’Orient | Venus d’Occident |
| **Soie**, **épices**, sucre, parfums | Draps de laine, bois |
| Papier, porcelaine | Métaux, esclaves |

Les marchands italiens inventent les instruments de la banque moderne : **lettre de change**, comptabilité en partie double, assurance maritime.

## Les échanges culturels
~ Les textes grecs → conservés et traduits en arabe → retraduits en latin à Tolède → l’Occident les redécouvre

À **Tolède** et en **Sicile**, chrétiens, juifs et musulmans traduisent ensemble Aristote, Euclide, Ptolémée.

| Ce que l’Occident reçoit | |
| La **numération** indo-arabe et le **zéro** | L’**algèbre** |
| La **médecine** d’Avicenne | La boussole, le papier |

Le vocabulaire en garde la trace : *algèbre*, *alcool*, *chiffre*, *amiral*, *sucre*.

> La Méditerranée médiévale est à la fois une **frontière** et un **pont**.`,
          },
          questions: [
            ['Quelles trois civilisations se côtoient en Méditerranée au Moyen Âge ?', ['La chrétienté latine, la chrétienté orthodoxe et le monde musulman', 'Rome, Byzance et la Chine', 'Les Francs, les Vikings et les Arabes', 'L’Espagne, l’Italie et l’Égypte'], 0, 'Elles s’affrontent et échangent en même temps.'],
            ['Qui appelle à la première croisade en 1095 ?', ['Le pape Urbain II', 'Charlemagne', 'Saladin', 'L’empereur byzantin Justinien'], 0, 'Il s’agit de reprendre Jérusalem.'],
            ['Qui reprend Jérusalem aux croisés en 1187 ?', ['Saladin', 'Mehmed II', 'Le calife de Bagdad', 'Richard Cœur de Lion'], 0, 'Jérusalem avait été prise par les croisés en 1099.'],
            ['Que fait la quatrième croisade en 1204 ?', ['Elle pille Constantinople, ville chrétienne', 'Elle reprend Jérusalem', 'Elle conquiert l’Égypte', 'Elle échoue avant d’embarquer'], 0, 'Des chrétiens contre des chrétiens.'],
            ['Quelles villes italiennes dominent le commerce méditerranéen ?', ['Venise, Gênes et Pise', 'Rome, Naples et Milan', 'Florence, Sienne et Vérone', 'Palerme, Bari et Amalfi seulement'], 0, 'Elles installent des comptoirs dans tout le bassin.'],
            ['Quelle ville espagnole est un grand centre de traduction ?', ['Tolède', 'Grenade', 'Séville', 'Barcelone'], 0, 'Chrétiens, juifs et musulmans y traduisent les textes grecs conservés en arabe.'],
            ['Quel savoir mathématique l’Occident reçoit-il par le monde musulman ?', ['La numération indo-arabe, le zéro et l’algèbre', 'La géométrie euclidienne uniquement', 'Le calcul des probabilités', 'La trigonométrie sphérique seule'], 0, 'Le vocabulaire en garde la trace : algèbre, chiffre, zéro.'],
            ['Les guerres ont interrompu le commerce en Méditerranée.', ['Vrai', 'Faux'], 1, 'Il n’a jamais cessé : les mêmes routes portaient les armées et les marchandises.'],
          ],
        },
        {
          titre: 'Paysans et seigneurs dans la société médiévale',
          axe: 'Société, Église et pouvoir politique dans l’occident féodal (XIe-XVe siècles)',
          lecon: {
            titre: 'La seigneurie, cadre de vie de neuf personnes sur dix',
            cours: `Neuf Européens sur dix vivent dans une seigneurie. Elle n’est pas un décor : c’est leur monde entier.

## Une société à trois ordres
| L’ordre | Son nom latin | Sa fonction | Sa part |
| Le **clergé** | *oratores* | Ceux qui **prient** | |
| Les **seigneurs** | *bellatores* | Ceux qui **combattent** | |
| Les **paysans** | *laboratores* | Ceux qui **travaillent** | Environ **90 %** |

## La seigneurie
| Sa partie | Qui l’exploite |
| La **réserve** | Directement pour le seigneur |
| Les **tenures** | Les paysans, contre des redevances |

Le seigneur y détient le **ban** : le droit de commander, de juger et de punir.

## Les paysans
| Le paysan | Sa condition |
| Le **vilain** | **Libre** : il peut partir, se marier, transmettre son bien |
| Le **serf** | **Attaché à la terre**, avec des obligations supplémentaires |

## Ce qu’ils versent
| La redevance | À qui | Ce que c’est |
| Le **cens** | Au seigneur | Une redevance en argent |
| Le **champart** | Au seigneur | Une part de la récolte |
| La **corvée** | Au seigneur | Des journées de travail gratuit sur la réserve |
| Les **banalités** | Au seigneur | Des taxes pour le **moulin**, le **four** et le **pressoir**, d’usage obligatoire |
| La **dîme** | À l’**Église** | Environ un dixième de la récolte |

## Les progrès agricoles des XIe-XIIIe siècles
~ Charrue à versoir → collier d’épaule → moulins à eau et à vent → assolement triennal → défrichements

= Résultat : la population de l’Europe DOUBLE entre 1000 et 1300

## Le château et les liens féodaux
Le **château fort** — d’abord motte de terre et de bois, puis forteresse de pierre — protège, surveille et affirme le pouvoir.

~ Le vassal prête hommage → il doit aide et conseil au suzerain → il reçoit un fief, le plus souvent une terre

## La crise du XIVe siècle
@ 1347-1352 — La peste noire
@ 1337-1453 — La guerre de Cent Ans

!> Famines, peste et guerre emportent **un tiers** de la population européenne et ébranlent durablement tout le système seigneurial.`,
          },
          questions: [
            ['Quels sont les trois ordres de la société médiévale ?', ['Ceux qui prient, ceux qui combattent, ceux qui travaillent', 'Les nobles, les bourgeois, les esclaves', 'Le roi, les seigneurs, les serfs', 'Les clercs, les marchands, les artisans'], 0, 'Les paysans représentent environ 90 % de la population.'],
            ['Comment appelle-t-on la partie de la seigneurie exploitée directement par le seigneur ?', ['La réserve', 'La tenure', 'Le fief', 'Le ban'], 0, 'Les tenures sont concédées aux paysans.'],
            ['Quelle est la différence entre un vilain et un serf ?', ['Le vilain est libre, le serf est attaché à la terre', 'Le vilain est plus riche', 'Le serf ne paie aucune redevance', 'Le vilain appartient au clergé'], 0, 'Le serf doit des obligations supplémentaires.'],
            ['Que sont les banalités ?', ['Des taxes pour l’usage obligatoire du moulin, du four et du pressoir', 'Des corvées agricoles', 'Des impôts royaux', 'Des amendes judiciaires'], 0, 'Elles s’ajoutent au cens et au champart.'],
            ['Qu’est-ce que la dîme ?', ['Une redevance d’environ un dixième de la récolte versée à l’Église', 'Une taxe seigneuriale sur le moulin', 'Un impôt royal sur le sel', 'Un droit de passage sur les ponts'], 0, 'Elle finance le clergé et l’entretien des églises.'],
            ['Quel progrès technique améliore le travail du cheval ?', ['Le collier d’épaule', 'La charrue romaine', 'Le joug frontal', 'La faux à deux mains'], 0, 'Il permet au cheval de tirer sans s’étrangler.'],
            ['Que reçoit un vassal en échange de son hommage ?', ['Un fief, le plus souvent une terre', 'Une somme d’argent annuelle', 'Un titre de noblesse héréditaire', 'Une charge religieuse'], 0, 'Il doit en retour aide et conseil à son suzerain.'],
            ['La peste noire du XIVe siècle a eu peu d’effets sur la société féodale.', ['Vrai', 'Faux'], 1, 'Elle emporte environ un tiers de la population européenne et ébranle tout le système.'],
          ],
        },
        {
          titre: 'La place de l’Église dans la société médiévale',
          axe: 'Société, Église et pouvoir politique dans l’occident féodal (XIe-XVe siècles)',
          lecon: {
            titre: 'Une institution présente du berceau à la tombe',
            cours: `Au Moyen Âge, être chrétien n’est pas un choix : c’est une condition. L’Église encadre la vie entière.

## Les sacrements et le calendrier
Les **sept sacrements** jalonnent l’existence : baptême, confirmation, eucharistie, pénitence, mariage, ordre, extrême-onction.

~ Les cloches sonnent les heures → le dimanche est chômé → l’année suit Noël, Pâques, la Toussaint → le carême impose ses jeûnes

## Deux clergés
| Le clergé | Où il vit | Qui le compose |
| **Séculier** | « Dans le siècle », au contact des fidèles | Le **curé** de la paroisse, l’**évêque** du diocèse, le **pape** |
| **Régulier** | Selon une **règle**, à l’écart du monde | Les **moines** des monastères — Cluny, Cîteaux |

La devise des moines : *ora et labora*, prier et travailler. Au XIIIe siècle apparaissent les **ordres mendiants** — franciscains, dominicains —, qui prêchent dans les villes et vivent d’aumônes.

## Une puissance matérielle
L’Église est le **premier propriétaire foncier** d’Occident. Elle perçoit la **dîme** et gère des domaines.

> Elle assure aussi ce qu’aucun autre pouvoir n’assure : l’**hôpital**, l’**école**, l’**aumône** aux pauvres, l’accueil des pèlerins.

## L’art au service de la foi
| Le style | Son époque | Ses traits |
| **Roman** | XIe-XIIe | Voûtes en **plein cintre**, murs épais, petites ouvertures, églises sombres et massives |
| **Gothique** | À partir du XIIe | **Croisée d’ogives**, **arcs-boutants**, murs allégés, immenses **vitraux** |

Chartres, Reims, Amiens, Notre-Dame de Paris.

> Sculptures, vitraux et fresques **racontent** la Bible à une population qui ne sait pas lire. L’église est un livre pour ceux qui ne lisent pas.

## Encadrer et exclure
!> L’Église combat les **hérésies** — les cathares au XIIIe siècle —, crée l’**Inquisition**, et peut prononcer l’**excommunication**, qui exclut un fidèle de la communauté. Contre un roi, cette arme est redoutable.`,
          },
          questions: [
            ['Combien y a-t-il de sacrements dans l’Église médiévale ?', ['Sept', 'Cinq', 'Trois', 'Dix'], 0, 'Du baptême à l’extrême-onction, ils jalonnent toute la vie.'],
            ['Quelle est la différence entre clergé séculier et clergé régulier ?', ['Le séculier vit au contact des fidèles, le régulier suit une règle à l’écart', 'Le séculier est plus riche', 'Le régulier ne prononce pas de vœux', 'Le séculier dépend du roi'], 0, 'Curés et évêques d’un côté, moines de l’autre.'],
            ['Quels ordres apparaissent au XIIIe siècle et prêchent dans les villes ?', ['Les ordres mendiants, franciscains et dominicains', 'Les bénédictins', 'Les cisterciens', 'Les templiers'], 0, 'Ils vivent d’aumônes.'],
            ['Quelle est la principale ressource financière de l’Église ?', ['La dîme et ses domaines fonciers', 'Les impôts royaux', 'Le commerce maritime', 'Les droits de péage'], 0, 'Elle est le premier propriétaire foncier d’Occident.'],
            ['Qu’est-ce qui caractérise l’art gothique ?', ['La croisée d’ogives, les arcs-boutants et les grands vitraux', 'Les voûtes en plein cintre et les murs épais', 'L’absence de sculptures', 'Les coupoles et les mosaïques'], 0, 'L’art roman, lui, est massif et sombre.'],
            ['Pourquoi les vitraux et les sculptures racontent-ils la Bible ?', ['Parce que la population ne sait pas lire', 'Parce que les textes étaient interdits', 'Pour décorer les églises uniquement', 'Pour remplacer les sermons'], 0, 'L’image est le livre de ceux qui ne lisent pas.'],
            ['Qu’est-ce que l’excommunication ?', ['L’exclusion d’un fidèle de la communauté chrétienne', 'Une amende versée à l’évêque', 'Un pèlerinage obligatoire', 'Une taxe sur les monastères'], 0, 'Prononcée contre un roi, c’est une arme redoutable.'],
            ['Au Moyen Âge, être chrétien relevait d’un choix personnel.', ['Vrai', 'Faux'], 1, 'Presque tous étaient baptisés : c’était une condition, pas un choix.'],
          ],
        },
        {
          titre: 'L’émergence d’une société urbaine',
          axe: 'Société, Église et pouvoir politique dans l’occident féodal (XIe-XVe siècles)',
          lecon: {
            titre: 'Les villes renaissent, et avec elles une société nouvelle',
            cours: `Entre le XIe et le XIIIe siècle, l’Occident se couvre de villes. Y habiter ne change pas seulement de décor : cela change de statut.

## Une renaissance urbaine
| La cause | Son effet |
| Les **progrès agricoles** | Des surplus nourrissent des non-paysans |
| La **population** | Elle **double** entre 1000 et 1300 |
| Le **commerce** | Il reprend, à courte et à longue distance |

## Les lieux du commerce
| Le lieu | Sa spécialité |
| Les **foires de Champagne** — Troyes, Provins | Elles réunissent marchands du Nord et du Sud |
| Les villes **flamandes** — Bruges, Gand, Ypres | Le **drap** |
| Les villes **italiennes** — Venise, Gênes, Florence | Le commerce méditerranéen et la **banque** |
| La **Hanse** germanique | La mer du Nord et la Baltique |

## Le paysage urbain
Des **remparts**, des rues étroites, des maisons à colombages, un **beffroi** ou une **halle**, une **place du marché**, une **cathédrale**.

!> La ville est sale, dense, exposée aux **incendies** et aux **épidémies** — et pourtant elle attire sans discontinuer.

## Une société nouvelle
| Le groupe | Ce qu’il est |
| Les **bourgeois** | Les habitants du bourg : marchands et artisans. Les plus riches dominent la vie politique |
| Les **corporations** (ou guildes) | Elles fixent règles, qualité, prix et apprentissage |
| Les **universités** | Bologne, Paris, Oxford : juristes, médecins, théologiens |

~ Apprenti → compagnon → maître

## La liberté urbaine
Les villes obtiennent des **chartes de franchises** : le droit de s’administrer, de rendre la justice, de lever des impôts. Elles élisent des **échevins** ou des **consuls**.

= « L’air de la ville rend libre »

Un serf qui y vivait **un an et un jour** sans être réclamé devenait libre.

> La ville médiévale n’est pas seulement un lieu : c’est un **statut**. Y habiter change ce qu’on est.

## Les tensions
Riches marchands contre artisans, maîtres contre compagnons, ville contre seigneur : les révoltes urbaines sont nombreuses, surtout après la crise du XIVe siècle.`,
          },
          questions: [
            ['Quelles causes expliquent la renaissance urbaine des XIe-XIIIe siècles ?', ['Les progrès agricoles, la croissance de la population et la reprise du commerce', 'La fin des croisades', 'L’effondrement des campagnes', 'La création des universités'], 0, 'Les trois se combinent.'],
            ['Quelles foires réunissent marchands du Nord et du Sud ?', ['Les foires de Champagne', 'Les foires de Flandre', 'Les foires de Lombardie', 'Les foires de Bourgogne'], 0, 'À Troyes et à Provins notamment.'],
            ['De quoi vivent les villes flamandes comme Bruges et Gand ?', ['Du drap', 'De la banque', 'Des épices', 'Du sel'], 0, 'Les villes italiennes, elles, vivent du commerce méditerranéen et de la banque.'],
            ['Qu’est-ce qu’une corporation ?', ['Une organisation de métier qui fixe règles, qualité et apprentissage', 'Un conseil municipal élu', 'Une association de marchands étrangers', 'Une confrérie religieuse'], 0, 'Apprenti, compagnon, maître : la hiérarchie y est stricte.'],
            ['Qu’est-ce qu’une charte de franchises ?', ['Un document accordant à une ville le droit de s’administrer', 'Un contrat de vente entre marchands', 'Un privilège accordé aux seigneurs', 'Un impôt urbain'], 0, 'Les villes élisent alors échevins ou consuls.'],
            ['Que signifie « l’air de la ville rend libre » ?', ['Un serf y vivant un an et un jour sans être réclamé devenait libre', 'La ville était plus saine que la campagne', 'Les villes ne payaient pas d’impôts', 'Les bourgeois pouvaient voyager sans autorisation'], 0, 'La ville est un statut autant qu’un lieu.'],
            ['Quelle organisation domine le commerce de la mer du Nord et de la Baltique ?', ['La Hanse germanique', 'La ligue lombarde', 'La Sérénissime', 'La ligue de Champagne'], 0, 'Un réseau de villes marchandes.'],
            ['Les villes médiévales étaient des lieux salubres et sûrs.', ['Vrai', 'Faux'], 1, 'Denses et sales, elles étaient exposées aux incendies et aux épidémies.'],
          ],
        },
        {
          titre: 'L’affirmation de l’État royal : Capétiens et Valois',
          axe: 'Société, Église et pouvoir politique dans l’occident féodal (XIe-XVe siècles)',
          lecon: {
            titre: 'Comment un petit roi devient un grand État',
            cours: `En 987, le roi de France ne possède qu’une bande de terre autour de Paris. En trois siècles, ses descendants bâtissent l’État le plus puissant d’Occident.

## Un point de départ modeste
@ 987 — Hugues Capet est élu roi des Francs
@ 1180-1223 — Philippe Auguste triple le domaine royal
@ 1214 — Victoire de Bouvines
@ 1226-1270 — Saint Louis
@ 1285-1314 — Philippe le Bel ; premiers États généraux en 1302
@ 1337-1453 — La guerre de Cent Ans
@ 1429 — Jeanne d’Arc fait sacrer Charles VII à Reims

!> Plusieurs vassaux d’Hugues Capet — le duc de Normandie, le comte de Flandre — sont **bien plus puissants que lui**. Le roi n’est d’abord qu’un seigneur parmi d’autres.

## Les quatre moyens de l’affirmation
| Le moyen | Comment |
| L’**hérédité** | Les Capétiens font élire leur fils de leur vivant, jusqu’à ce que la couronne devienne héréditaire de fait |
| Le **sacre** à **Reims** | Le roi y est oint d’une huile sainte : il devient roi **par la grâce de Dieu** |
| L’**agrandissement du domaine** | Mariage, héritage, confiscation, guerre |
| La **construction d’un État** | **Baillis** au nord, **sénéchaux** au sud, **Parlement**, **Chambre des comptes**, impôt et armée permanents |

> Le sacre change la nature du pouvoir royal : il n’est plus seulement féodal, il devient **sacré**. Un vassal peut défier un seigneur ; défier un oint de Dieu est autre chose.

## Trois règnes décisifs
| Le roi | Ce qu’il fait |
| **Philippe Auguste** | Il triple le domaine, reprend la Normandie au roi d’Angleterre, l’emporte à **Bouvines** |
| **Saint Louis** | Il rend la justice — l’image du roi sous son chêne — et impose la monnaie royale |
| **Philippe le Bel** | Il s’oppose au pape, réunit les premiers **États généraux**, s’entoure de juristes, les **légistes** |

## La guerre de Cent Ans
~ Extinction des Capétiens directs → les Valois montent sur le trône → le roi d’Angleterre revendique la couronne → 116 ans de guerre

Défaites de **Crécy** et d’**Azincourt**, traité de Troyes, puis le sursaut porté par **Jeanne d’Arc**. Les Anglais sont chassés en 1453.

> Le royaume sort de la guerre avec une **armée permanente**, un **impôt permanent** et un sentiment national naissant : l’État moderne est en place.`,
          },
          questions: [
            ['En quelle année Hugues Capet est-il élu roi ?', ['987', '1214', '1337', '1429'], 0, 'Son domaine se limitait alors aux environs de Paris et d’Orléans.'],
            ['Où les rois de France sont-ils sacrés ?', ['À Reims', 'À Paris', 'À Saint-Denis', 'À Orléans'], 0, 'Le sacre les rend « rois par la grâce de Dieu ».'],
            ['Comment s’appellent les agents royaux du nord du royaume ?', ['Les baillis', 'Les sénéchaux', 'Les échevins', 'Les légistes'], 0, 'Les sénéchaux exercent la même fonction au sud.'],
            ['Quel roi l’emporte à Bouvines en 1214 ?', ['Philippe Auguste', 'Saint Louis', 'Philippe le Bel', 'Charles VII'], 0, 'Il triple le domaine royal pendant son règne.'],
            ['Quel roi réunit les premiers États généraux en 1302 ?', ['Philippe le Bel', 'Hugues Capet', 'Saint Louis', 'Charles VII'], 0, 'Il s’oppose alors au pape Boniface VIII.'],
            ['Quelles sont les dates de la guerre de Cent Ans ?', ['1337-1453', '1214-1314', '1095-1291', '1429-1492'], 0, 'Elle oppose Valois et Plantagenêts pour la couronne de France.'],
            ['Quel rôle joue Jeanne d’Arc ?', ['Elle fait sacrer Charles VII à Reims en 1429', 'Elle gagne la bataille d’Azincourt', 'Elle négocie le traité de Troyes', 'Elle règne après Charles VI'], 0, 'Son intervention renverse le cours de la guerre.'],
            ['Le royaume de France sort affaibli et désorganisé de la guerre de Cent Ans.', ['Vrai', 'Faux'], 1, 'Il en sort avec une armée et un impôt permanents : l’État moderne est en place.'],
          ],
        },
        {
          titre: 'L’expansion européenne et les grandes découvertes',
          axe: 'Transformations de l’Europe et ouverture sur le monde aux XVIe et XVIIe siècles',
          lecon: {
            titre: 'Quand l’Europe change la carte du monde',
            cours: `En quarante ans, l’Europe passe d’un monde borné par la Méditerranée à une carte qui fait le tour de la Terre.

## Pourquoi partir
| La raison | Le détail |
| **Économique** | La prise de Constantinople (1453) gêne les routes vers l’Asie : on veut atteindre directement **épices**, soie et **or** |
| **Religieuse** | Évangéliser, prolonger l’esprit de croisade |
| **Politique** | La rivalité entre le **Portugal** et l’**Espagne** |
| **Technique** | La **caravelle**, la **boussole**, l’**astrolabe**, le **portulan**, le gouvernail d’étambot |

!> Les savants savaient **déjà** que la Terre est ronde. Ce n’est pas une découverte de Colomb : ce qu’on ignorait, c’était sa **taille** — et l’existence d’un continent au milieu.

## Les grandes expéditions
@ 1488 — Bartolomeu Dias franchit le cap de Bonne-Espérance
@ 1492 — Christophe Colomb atteint l’Amérique en cherchant les Indes
@ 1494 — Le traité de Tordesillas partage le monde entre Portugal et Espagne
@ 1498 — Vasco de Gama atteint l’Inde par la mer
@ 1519-1522 — L’expédition de Magellan réalise le premier tour du monde

= Partis à 5 navires et 237 hommes, ils reviennent à 1 navire et 18 hommes

Colomb mourra convaincu d’avoir touché l’Asie.

## La conquête de l’Amérique
| Le conquistador | L’empire détruit | La date |
| **Cortés** | Les **Aztèques**, au Mexique | 1521 |
| **Pizarro** | Les **Incas**, au Pérou | 1533 |

| Leur supériorité | |
| Les **armes à feu** et les **chevaux** | |
| Les **alliances** avec des peuples soumis | |
| Et surtout les **maladies** — variole, rougeole | Contre lesquelles ces populations n’ont aucune immunité |

## Les conséquences
| La conséquence | Son ampleur |
| L’**effondrement démographique** amérindien | Peut-être **80 à 90 %** en un siècle |
| La **traite atlantique** | Des millions d’Africains déportés vers les plantations |
| L’**échange colombien** | Maïs, pomme de terre, tomate, cacao, tabac vers l’Europe ; blé, canne à sucre, chevaux, bovins vers l’Amérique |
| L’afflux d’**or** et d’**argent** (Potosí) | Une inflation durable en Europe |
| Le déplacement du **centre de gravité** | De la Méditerranée vers l’**Atlantique** |

> « Découverte » est un mot européen : ces terres étaient habitées, peuplées et organisées depuis des millénaires.`,
          },
          questions: [
            ['Quel événement de 1453 gêne les routes terrestres vers l’Asie ?', ['La prise de Constantinople par les Ottomans', 'La chute de Grenade', 'Le traité de Tordesillas', 'La mort de Charles VII'], 0, 'L’Europe cherche alors une route maritime.'],
            ['Quelle invention n’a PAS aidé les grandes découvertes ?', ['La machine à vapeur', 'La caravelle', 'La boussole', 'L’astrolabe'], 0, 'La machine à vapeur date du XVIIIe siècle.'],
            ['Qui atteint l’Amérique en 1492 ?', ['Christophe Colomb', 'Vasco de Gama', 'Magellan', 'Bartolomeu Dias'], 0, 'Il cherchait les Indes et mourra convaincu d’avoir touché l’Asie.'],
            ['Qui atteint l’Inde par la mer en 1498 ?', ['Vasco de Gama', 'Christophe Colomb', 'Cortés', 'Pizarro'], 0, 'Il contourne l’Afrique par le cap de Bonne-Espérance.'],
            ['Que fait le traité de Tordesillas en 1494 ?', ['Il partage le monde à découvrir entre le Portugal et l’Espagne', 'Il interdit la traite des esclaves', 'Il met fin à la guerre de Cent Ans', 'Il fixe les frontières de l’Amérique'], 0, 'Une ligne tracée sur une carte, loin des terres concernées.'],
            ['Quel empire Cortés détruit-il en 1521 ?', ['L’empire aztèque', 'L’empire inca', 'L’empire maya', 'L’empire ottoman'], 0, 'Pizarro abat celui des Incas en 1533.'],
            ['Quelle est la principale cause de l’effondrement démographique amérindien ?', ['Les maladies européennes, contre lesquelles les populations n’étaient pas immunisées', 'Les seules armes à feu', 'La famine organisée', 'Le départ vers l’Europe'], 0, 'Variole et rougeole emportent 80 à 90 % de la population en un siècle.'],
            ['Les terres atteintes en 1492 étaient inhabitées.', ['Vrai', 'Faux'], 1, 'Elles étaient peuplées et organisées depuis des millénaires : « découverte » est un mot européen.'],
          ],
        },
        {
          titre: 'Le monde au temps de Charles Quint et Soliman le Magnifique',
          axe: 'Transformations de l’Europe et ouverture sur le monde aux XVIe et XVIIe siècles',
          lecon: {
            titre: 'Deux empires face à face au XVIe siècle',
            cours: `Deux empires « universels » se disputent le même monde — et découvrent en même temps que ce monde vient de s’agrandir démesurément.

## Charles Quint (1500-1558)
Par une série d’**héritages**, il réunit sur sa tête :

| Le territoire | |
| L’**Espagne** et ses possessions italiennes | |
| Les **Pays-Bas** et la Franche-Comté | |
| Les terres **autrichiennes** des Habsbourg | |
| L’**Empire** | Il est élu empereur en 1519 |
| L’**Amérique** espagnole | Dont l’or et l’argent affluent |

= « Le soleil ne se couche jamais » sur son empire

## Ses difficultés
| L’adversaire | Le problème |
| La **France** de **François Ier** | Elle l’encercle et le combat — Marignan, Pavie |
| La **Réforme protestante** | Elle déchire l’Allemagne |
| Les **Ottomans** | Ils le menacent à l’est |

@ 1556 — Épuisé, Charles Quint abdique et partage son empire entre son fils Philippe II (Espagne) et son frère Ferdinand (Autriche)

## Soliman le Magnifique (1494-1566)
Sultan **ottoman** de 1520 à 1566, il porte l’empire à son apogée : Balkans, Hongrie, Égypte, Syrie, Irak, Afrique du Nord, contrôle des lieux saints de l’islam.

@ 1529 — Il assiège Vienne, sans la prendre
@ 1571 — La bataille navale de Lépante arrête l’expansion ottomane en Méditerranée occidentale

| Son surnom | Ce qu’il dit |
| « Le Magnifique », en Occident | Sa splendeur |
| ***Kanuni***, « le législateur », en turc | Il réorganise le **droit** de l’empire |

**Istanbul** devient une capitale magnifique, où l’architecte **Sinan** bâtit les grandes mosquées.

## Un affrontement… et des alliances
!> **François Ier s’allie avec Soliman** pour desserrer l’étau de Charles Quint. Une alliance entre un roi « très chrétien » et un sultan musulman scandalise l’Europe — et montre que la **politique** l’emporte sur la religion.`,
          },
          questions: [
            ['Quels territoires Charles Quint réunit-il ?', ['L’Espagne, les Pays-Bas, l’Autriche, l’Empire et l’Amérique espagnole', 'La France et l’Angleterre', 'L’Italie et la Grèce', 'La Hongrie et les Balkans'], 0, 'D’où la formule : « le soleil ne se couche jamais » sur son empire.'],
            ['En quelle année Charles Quint est-il élu empereur ?', ['1519', '1500', '1556', '1571'], 0, 'Il abdiquera en 1556, épuisé.'],
            ['Quel roi de France combat Charles Quint ?', ['François Ier', 'Louis XI', 'Henri IV', 'Louis XIV'], 0, 'Marignan, puis la défaite de Pavie.'],
            ['Quel sultan ottoman porte l’empire à son apogée au XVIe siècle ?', ['Soliman le Magnifique', 'Mehmed II', 'Saladin', 'Bayezid'], 0, 'Il règne de 1520 à 1566.'],
            ['Quelle ville Soliman assiège-t-il en 1529 sans la prendre ?', ['Vienne', 'Rome', 'Venise', 'Madrid'], 0, 'C’est la limite de son expansion vers l’ouest.'],
            ['Pourquoi appelle-t-on Soliman « Kanuni » en turc ?', ['Parce qu’il réorganise le droit de l’empire : c’est « le législateur »', 'Parce qu’il a conquis le plus de terres', 'Parce qu’il a bâti Istanbul', 'Parce qu’il était le plus jeune sultan'], 0, 'Le surnom « le Magnifique » est européen.'],
            ['Quelle alliance surprenante François Ier conclut-il ?', ['Une alliance avec Soliman, sultan musulman', 'Une alliance avec Charles Quint', 'Une alliance avec le pape contre Venise', 'Une alliance avec l’Angleterre protestante'], 0, 'Elle montre que la politique l’emporte sur la religion.'],
            ['Charles Quint a transmis son empire entier à son fils Philippe II.', ['Vrai', 'Faux'], 1, 'Il l’a partagé : l’Espagne à Philippe II, l’Autriche à son frère Ferdinand.'],
          ],
        },
        {
          titre: 'L’humanisme pendant la Renaissance',
          axe: 'Transformations de l’Europe et ouverture sur le monde aux XVIe et XVIIe siècles',
          lecon: {
            titre: 'L’homme au centre, et l’imprimerie pour le dire',
            cours: `L’humanisme replace l’être humain et sa raison au centre. L’imprimerie fait le reste.

## Qu’est-ce que l’humanisme
Un mouvement intellectuel né en **Italie** au XVe siècle, diffusé dans toute l’Europe au XVIe. Il place l’**être humain** et sa **raison** au centre — **sans rompre avec la foi**.

| Son principe | Ce qu’il implique |
| **Retourner aux textes antiques** | Dans leur langue d’origine : grec, latin, hébreu |
| **Critiquer** les sources | Plutôt que répéter l’autorité |
| Croire en l’**éducation** | On ne naît pas homme accompli, on le devient |
| S’intéresser à **tout** | Le savoir n’a pas de frontières |

## Les grandes figures
| L’humaniste | Son œuvre |
| **Érasme** de Rotterdam | Le Nouveau Testament en grec, *L’Éloge de la folie* |
| **Thomas More** | *Utopie* |
| **Rabelais**, **Montaigne**, **Guillaume Budé** | En France |
| **Léonard de Vinci** | Peintre, ingénieur et anatomiste : l’« homme universel » |

## L’imprimerie, l’accélérateur
@ Vers 1450 — Gutenberg met au point à Mayence l’impression à caractères mobiles métalliques

| La conséquence | Son ampleur |
| Le **prix** du livre | Il s’effondre ; on produit par centaines d’exemplaires |
| La **circulation** des idées | Vite, et loin |
| L’**alphabétisation** | Elle progresse |
| Le **contrôle** de l’Église | Il lui échappe |

= Plus de vingt millions de livres imprimés en Europe avant 1500

> Aucun pouvoir ne peut plus surveiller ce que les gens lisent. C’est ce qui pèsera le plus lourd pendant la Réforme.

## La Renaissance artistique
La **perspective**, l’**anatomie**, le retour aux modèles antiques. Des **mécènes** : les **Médicis** à Florence, les papes à Rome, François Ier en France. **Léonard de Vinci**, **Michel-Ange**, **Raphaël**, **Botticelli**. En France, les **châteaux de la Loire** — Chambord.

## Les sciences
@ 1543 — Copernic affirme que la Terre tourne autour du Soleil : l’héliocentrisme

**Vésale** fonde l’anatomie moderne ; **Ambroise Paré** transforme la chirurgie.

> Le monde se met à **s’observer** avant de se raconter.`,
          },
          questions: [
            ['Qu’est-ce que l’humanisme ?', ['Un mouvement qui place l’être humain et sa raison au centre de la réflexion', 'Un rejet de toute religion', 'Une doctrine politique républicaine', 'Un courant artistique uniquement'], 0, 'Il ne rompt pas avec la foi.'],
            ['Que prônent les humanistes à propos des textes antiques ?', ['Y revenir dans leur langue d’origine et les critiquer', 'Les interdire', 'Les traduire uniquement en latin', 'Les remplacer par des textes modernes'], 0, 'Grec, latin et hébreu redeviennent des langues d’étude.'],
            ['Quel humaniste est surnommé le « prince des humanistes » ?', ['Érasme', 'Thomas More', 'Rabelais', 'Montaigne'], 0, 'Il édite le Nouveau Testament en grec.'],
            ['Qui met au point l’imprimerie à caractères mobiles vers 1450 ?', ['Gutenberg', 'Érasme', 'Léonard de Vinci', 'Copernic'], 0, 'À Mayence, en Allemagne.'],
            ['Quelle conséquence l’imprimerie a-t-elle sur l’Église ?', ['Elle lui fait perdre le contrôle de la diffusion des textes', 'Elle renforce son autorité', 'Elle lui donne un monopole sur les livres', 'Elle n’a aucun effet'], 0, 'Cela pèsera lourd pendant la Réforme.'],
            ['Qui affirme en 1543 que la Terre tourne autour du Soleil ?', ['Copernic', 'Vésale', 'Ambroise Paré', 'Galilée'], 0, 'C’est la thèse de l’héliocentrisme.'],
            ['Quelle famille florentine protège les artistes de la Renaissance ?', ['Les Médicis', 'Les Borgia', 'Les Habsbourg', 'Les Valois'], 0, 'Ce sont des mécènes.'],
            ['Les humanistes rejetaient la religion chrétienne.', ['Vrai', 'Faux'], 1, 'Ils la réinterrogent à partir des textes originaux, sans la rejeter.'],
          ],
        },
        {
          titre: 'Les conflits religieux du XVIe siècle',
          axe: 'Transformations de l’Europe et ouverture sur le monde aux XVIe et XVIIe siècles',
          lecon: {
            titre: 'La Réforme et les guerres qu’elle entraîne',
            cours: `Une critique religieuse devient en quelques années une fracture européenne, puis trente-six ans de guerre civile en France.

## Les critiques adressées à l’Église
Richesse, ignorance d’une partie du clergé, cumul des charges — et surtout le commerce des **indulgences** : la remise des peines contre de l’argent.

## Luther
@ 1517 — Martin Luther publie ses 95 thèses contre les indulgences
@ 1521 — Il est excommunié, et protégé par des princes allemands

| Ce qu’il affirme | |
| Le salut vient de la **foi seule** | |
| La **Bible** est la seule autorité | Il la traduit en allemand pour que tous la lisent |

Les luthériens rejettent le culte des saints, ne gardent que **deux** sacrements — baptême et eucharistie — et autorisent le mariage des pasteurs.

## Calvin
Réfugié à **Genève**, **Jean Calvin** développe une seconde branche.

| Sa doctrine | Ce qu’elle dit |
| La **prédestination** | Dieu a choisi d’avance ceux qui seront sauvés |
| L’organisation | Une cité strictement réglée |
| Le culte | Dépouillé |

Le **calvinisme** gagne la France, l’Écosse, les Pays-Bas.

## La réaction catholique
@ 1545-1563 — Le concile de Trente réaffirme les dogmes et crée les séminaires

Les **jésuites**, fondés par Ignace de Loyola, se consacrent à l’enseignement et aux missions. L’**Index** liste les livres interdits.

## Les guerres de Religion en France
@ 1562 — Début des guerres de Religion
@ 1572 — Le massacre de la Saint-Barthélemy : des milliers de protestants tués à Paris et en province
@ 1589 — Henri de Navarre, protestant, devient roi sous le nom d’Henri IV
@ 1593 — Il se convertit au catholicisme pour pacifier le royaume
@ 1598 — L’édit de Nantes accorde aux protestants liberté de conscience, culte encadré et places de sûreté

Les protestants français s’appellent les **huguenots**.

!> **L’édit de Nantes ne proclame pas la tolérance moderne** : il organise une **coexistence** pour arrêter la guerre. Louis XIV le révoquera en 1685.`,
          },
          questions: [
            ['Que dénonce Luther en 1517 dans ses 95 thèses ?', ['Le commerce des indulgences', 'Le célibat des prêtres uniquement', 'L’existence du pape', 'La traduction de la Bible'], 0, 'Il affirme que le salut vient de la foi seule.'],
            ['Selon Luther, quelle est la seule autorité en matière de foi ?', ['La Bible', 'Le pape', 'Le concile', 'La tradition de l’Église'], 0, 'Il la traduit en allemand pour que tous puissent la lire.'],
            ['Dans quelle ville Calvin développe-t-il sa doctrine ?', ['Genève', 'Wittenberg', 'Rome', 'Paris'], 0, 'Il y organise strictement la cité.'],
            ['Qu’est-ce que la prédestination ?', ['L’idée que Dieu a choisi d’avance ceux qui seront sauvés', 'La croyance en la réincarnation', 'Le refus des sacrements', 'L’obligation de lire la Bible chaque jour'], 0, 'C’est la doctrine centrale du calvinisme.'],
            ['Quel concile organise la réaction catholique ?', ['Le concile de Trente', 'Le concile de Nicée', 'Le concile de Latran', 'Le concile de Genève'], 0, 'Il siège de 1545 à 1563.'],
            ['Que se passe-t-il lors de la Saint-Barthélemy en 1572 ?', ['Plusieurs milliers de protestants sont massacrés', 'L’édit de Nantes est signé', 'Henri IV est couronné', 'Luther est excommunié'], 0, 'À Paris puis en province.'],
            ['Qu’accorde l’édit de Nantes en 1598 ?', ['La liberté de conscience et un culte encadré aux protestants', 'L’égalité complète des religions', 'L’interdiction du catholicisme', 'La liberté de la presse'], 0, 'Louis XIV le révoquera en 1685.'],
            ['L’édit de Nantes proclame la tolérance religieuse au sens moderne.', ['Vrai', 'Faux'], 1, 'Il organise une coexistence pour arrêter la guerre, ce qui n’est pas la même chose.'],
          ],
        },
        {
          titre: 'L’émergence du « roi absolu »',
          axe: 'Transformations de l’Europe et ouverture sur le monde aux XVIe et XVIIe siècles',
          lecon: {
            titre: 'Louis XIV, ou l’État concentré dans un homme',
            cours: `La monarchie absolue concentre tous les pouvoirs dans un seul homme. Absolu ne veut pourtant pas dire arbitraire.

## Qu’est-ce que la monarchie absolue
Un régime où le roi détient **tous les pouvoirs** — législatif, exécutif, judiciaire — sans comptes à rendre à personne, sinon à Dieu. C’est la théorie du **droit divin**.

!> **Absolu ne signifie pas arbitraire.** Le roi reste tenu par les **lois fondamentales** du royaume et par les coutumes. Il ne peut ni changer l’ordre de succession, ni aliéner le domaine royal.

## La construction
@ 1589-1610 — Henri IV restaure le royaume ; son ministre Sully relève les finances
@ 1624-1642 — Richelieu abat les places fortes protestantes et crée les intendants
@ 1648-1653 — La Fronde, révolte dont le jeune Louis XIV gardera un souvenir durable
@ 1661 — À la mort de Mazarin, Louis XIV décide de gouverner seul
@ 1682 — La cour est fixée à Versailles
@ 1685 — Révocation de l’édit de Nantes

Le règne personnel de Louis XIV dure **cinquante-quatre ans**, le plus long de l’histoire de France.

## Ses instruments
| L’instrument | Ce qu’il fait |
| **Versailles** et l’**étiquette** | La noblesse y est domestiquée |
| L’**image** : le **Roi-Soleil** | Portraits, fêtes, académies, artistes pensionnés |
| **Colbert** et le **mercantilisme** | Manufactures royales, marine, colonies, protectionnisme |
| L’**armée permanente** | Plusieurs centaines de milliers d’hommes ; **Vauban** et ses forteresses |
| L’**unité religieuse** | La révocation de l’édit de Nantes |

!> La révocation de l’édit de Nantes chasse du royaume **des dizaines de milliers de protestants** — souvent artisans et commerçants qualifiés. C’est un désastre économique autant qu’humain.

## Les limites
Guerres incessantes et coûteuses, famines de **1693** et **1709**, finances épuisées, contestations. Le modèle absolutiste, imité dans toute l’Europe, laisse à la mort du roi un royaume affaibli.

> « L’État, c’est moi » : la formule lui est attribuée sans preuve, mais elle résume exactement ce que Versailles donnait à voir.`,
          },
          questions: [
            ['Qu’est-ce que la monarchie absolue ?', ['Un régime où le roi détient tous les pouvoirs, sans comptes à rendre', 'Un régime où le roi partage le pouvoir avec un parlement', 'Un régime électif', 'Un régime sans religion d’État'], 0, 'Il tient son pouvoir de Dieu : c’est le droit divin.'],
            ['Quel ministre de Louis XIII soumet les grands nobles et crée les intendants ?', ['Richelieu', 'Mazarin', 'Colbert', 'Sully'], 0, 'Il abat aussi les places fortes protestantes.'],
            ['Qu’est-ce que la Fronde ?', ['Une révolte contre le pouvoir royal pendant la minorité de Louis XIV', 'Une guerre contre l’Espagne', 'Une révolte protestante', 'Un impôt nouveau'], 0, 'Louis XIV en gardera un souvenir durable.'],
            ['En quelle année Louis XIV décide-t-il de gouverner seul ?', ['1661', '1643', '1682', '1685'], 0, 'À la mort de Mazarin, il se passe de Premier ministre.'],
            ['À quoi sert l’étiquette de Versailles ?', ['À domestiquer la noblesse en l’occupant à la cour', 'À former les futurs ministres', 'À réduire les dépenses royales', 'À organiser l’armée'], 0, 'La cour y est fixée en 1682.'],
            ['Quelle politique économique Colbert met-il en œuvre ?', ['Le mercantilisme : manufactures, marine, colonies, protectionnisme', 'Le libre-échange', 'La suppression des impôts', 'La collectivisation des terres'], 0, 'Enrichir l’État par le commerce et la production.'],
            ['Quelle est la conséquence de la révocation de l’édit de Nantes en 1685 ?', ['Des dizaines de milliers de protestants quittent le royaume', 'Les protestants obtiennent l’égalité', 'La guerre reprend avec l’Espagne', 'Le pape excommunie Louis XIV'], 0, 'Un désastre économique autant qu’humain.'],
            ['Le pouvoir absolu signifiait que le roi pouvait tout faire sans aucune limite.', ['Vrai', 'Faux'], 1, 'Il restait tenu par les lois fondamentales du royaume et par les coutumes.'],
          ],
        },
      ],
    },
    // =====================================================================
    // RAYON GÉOGRAPHIE — positions 14 → 21
    // =====================================================================
    {
      niveaux: ['5e'],
      rayon: 'geographie',
      positionDepart: 14,
      chapitres: [
        {
          titre: 'Les enjeux du développement durable',
          axe: 'La question démographique et l’inégal développement',
          lecon: {
            titre: 'Répondre aux besoins d’aujourd’hui sans sacrifier demain',
            cours: `Répondre aux besoins d’aujourd’hui sans compromettre ceux de demain : la formule tient en une phrase, et engage tout.

## La définition
Un développement qui répond aux besoins du présent **sans compromettre** la capacité des générations futures à répondre aux leurs. La formule vient du **rapport Brundtland**, en 1987.

## Les trois piliers
| Le pilier | Ce qu’il demande |
| **Économique** | Produire des richesses, créer des emplois |
| **Social** | Santé, éducation, logement, équité pour tous |
| **Environnemental** | Préserver ressources, biodiversité et climat |

!> Un projet n’est durable que s’il satisfait les **trois à la fois**. Croisés deux à deux, ils donnent trois exigences : **viable** (économie + environnement), **équitable** (économie + social), **vivable** (social + environnement).

## D’où vient la notion
@ 1972 — Premier sommet de la Terre, à Stockholm
@ 1987 — Rapport Brundtland : la définition
@ 1992 — Sommet de Rio : le terme se popularise, les Agendas 21 sont lancés
@ 2015 — L’ONU adopte les 17 objectifs de développement durable, à atteindre en 2030
@ 2015 — L’accord de Paris engage à limiter le réchauffement bien en dessous de 2 °C

## Mesurer le développement
| L’indicateur | Ce qu’il mesure | Sa limite |
| Le **PIB par habitant** | La richesse produite | Rien d’autre |
| L’**IDH**, entre 0 et 1 | **Richesse** + **espérance de vie** + **éducation** | Il ignore les inégalités internes |
| L’**empreinte écologique** | La surface nécessaire pour produire ce qu’on consomme et absorber ses déchets | |

> Si toute l’humanité vivait comme un Français moyen, il faudrait près de **trois planètes**. Le développement durable est né de ce constat.

## À toutes les échelles
~ Un tri sélectif dans un collège → une piste cyclable dans une ville → un accord climatique mondial

Le développement durable se joue du **local** au **mondial**, et les deux échelles se répondent.`,
          },
          questions: [
            ['Comment définit-on le développement durable ?', ['Un développement qui répond aux besoins du présent sans compromettre ceux des générations futures', 'Un développement qui dure longtemps', 'Une croissance économique rapide', 'Un développement sans industrie'], 0, 'La définition vient du rapport Brundtland de 1987.'],
            ['Quels sont les trois piliers du développement durable ?', ['Économique, social et environnemental', 'Politique, culturel et religieux', 'Local, national et mondial', 'Agricole, industriel et tertiaire'], 0, 'Un projet durable doit satisfaire les trois à la fois.'],
            ['Quel sommet de 1992 popularise la notion ?', ['Le sommet de Rio', 'Le sommet de Stockholm', 'Le sommet de Kyoto', 'Le sommet de Paris'], 0, 'Il lance aussi les Agendas 21.'],
            ['Combien d’objectifs de développement durable l’ONU a-t-elle adoptés en 2015 ?', ['17', '10', '25', '8'], 0, 'À atteindre à l’horizon 2030.'],
            ['Que combine l’indice de développement humain (IDH) ?', ['La richesse, l’espérance de vie et le niveau d’éducation', 'Le PIB et la population', 'La superficie et les ressources', 'Le nombre d’écoles et d’hôpitaux'], 0, 'Il varie entre 0 et 1.'],
            ['Que mesure l’empreinte écologique ?', ['La surface nécessaire pour produire ce qu’on consomme et absorber ses déchets', 'La quantité de CO₂ émise par personne', 'Le nombre d’espèces disparues', 'La superficie des forêts'], 0, 'Elle se mesure en hectares par habitant.'],
            ['Que vise l’accord de Paris de 2015 ?', ['Limiter le réchauffement bien en dessous de 2 °C', 'Interdire le charbon dans le monde', 'Créer une taxe mondiale sur le pétrole', 'Reboiser l’Amazonie'], 0, 'Il engage l’ensemble des États signataires.'],
            ['Le PIB par habitant suffit à mesurer le développement d’un pays.', ['Vrai', 'Faux'], 1, 'Il mesure la richesse produite, mais ni la santé, ni l’éducation, ni les inégalités.'],
          ],
        },
        {
          titre: 'La croissance démographique et ses effets',
          axe: 'La question démographique et l’inégal développement',
          lecon: {
            titre: 'Huit milliards d’humains, très inégalement répartis',
            cours: `Huit milliards d’humains — mais deux mondes démographiques, qui n’appellent pas les mêmes politiques.

## Une croissance sans précédent
@ Vers 1800 — 1 milliard d’humains
@ 2022 — 8 milliards
@ Vers 2060 — Environ 10 milliards, puis une stabilisation

## Comment on la mesure
| L’indicateur | Sa définition |
| **Taux de natalité** | Naissances pour 1 000 habitants par an |
| **Taux de mortalité** | Décès pour 1 000 habitants par an |
| **Accroissement naturel** | Natalité − mortalité |
| **Fécondité** | Enfants par femme ; seuil de renouvellement : **2,1** |
| **Espérance de vie** | À la naissance |

## La transition démographique
| La phase | La natalité | La mortalité | La population |
| **1. Avant** | Forte | Forte | Elle **stagne** |
| **2. Pendant** | Forte | Elle **chute** | Elle **explose** |
| **3. Après** | Elle baisse à son tour | Faible | Elle se **stabilise** |

En phase 2, la mortalité recule grâce à la médecine, aux vaccins, à l’eau potable et à l’alimentation. En phase 3, la natalité baisse avec la scolarisation des filles, la contraception, l’urbanisation et le coût de l’enfant.

!> L’Europe a **achevé** sa transition ; l’**Afrique subsaharienne** est encore en pleine **phase 2**. C’est ce décalage qui explique l’essentiel des différences actuelles.

## Une répartition très inégale
| Le fait | Le chiffre |
| L’**Asie** | Près de **60 %** de l’humanité |
| L’**Inde** et la **Chine** | Plus de 1,4 milliard d’habitants chacune |

Les grands **foyers de peuplement** : Asie du Sud et de l’Est, Europe, nord-est de l’Amérique du Nord, golfe de Guinée. Les **vides humains** : déserts chauds et froids, hautes montagnes, forêts denses.

## Les effets
| Au Sud | Au Nord |
| Nourrir, loger, scolariser, soigner une population qui croît vite | Le **vieillissement** et le financement des retraites |
| Une **urbanisation** rapide, souvent mal maîtrisée | |
| Une pression accrue sur l’eau, les sols, l’énergie | |

> Deux mondes coexistent : l’un doit gérer une jeunesse nombreuse, l’autre une population qui vieillit. Ce ne sont pas les mêmes politiques.`,
          },
          questions: [
            ['Combien d’humains la Terre comptait-elle en 2022 ?', ['8 milliards', '5 milliards', '10 milliards', '6 milliards'], 0, 'Contre 1 milliard vers 1800.'],
            ['Qu’est-ce que l’accroissement naturel ?', ['La différence entre le taux de natalité et le taux de mortalité', 'Le nombre total de naissances', 'La somme des migrations', 'Le nombre d’enfants par femme'], 0, 'Il ne tient pas compte des migrations.'],
            ['Quel est le seuil de renouvellement des générations ?', ['2,1 enfants par femme', '1 enfant par femme', '3 enfants par femme', '2,5 enfants par femme'], 0, 'En dessous, la population diminue à terme.'],
            ['Que se passe-t-il pendant la deuxième phase de la transition démographique ?', ['La mortalité chute alors que la natalité reste élevée', 'La natalité chute avant la mortalité', 'Les deux taux baissent ensemble', 'Les deux taux augmentent'], 0, 'C’est le moment de l’explosion démographique.'],
            ['Quel continent concentre près de 60 % de l’humanité ?', ['L’Asie', 'L’Afrique', 'L’Europe', 'L’Amérique'], 0, 'L’Inde et la Chine dépassent chacune 1,4 milliard d’habitants.'],
            ['Quelle région est encore en pleine phase 2 de la transition ?', ['L’Afrique subsaharienne', 'L’Europe de l’Ouest', 'Le Japon', 'L’Amérique du Nord'], 0, 'Sa population croît encore rapidement.'],
            ['Quel problème démographique connaissent les pays du Nord ?', ['Le vieillissement de la population', 'Une natalité trop forte', 'Une mortalité infantile élevée', 'Un manque de logements pour les jeunes'], 0, 'Il pose la question du financement des retraites.'],
            ['La population mondiale est répartie de façon à peu près homogène.', ['Vrai', 'Faux'], 1, 'Quelques foyers concentrent l’essentiel de l’humanité, face à de vastes vides humains.'],
          ],
        },
        {
          titre: 'Richesse et pauvreté dans le monde',
          axe: 'La question démographique et l’inégal développement',
          lecon: {
            titre: 'Des inégalités entre les pays, et à l’intérieur de chacun',
            cours: `Il y a des pauvres dans les pays riches et des très riches dans les pays pauvres. C’est pourquoi la carte des États ne suffit jamais.

## Mesurer le développement
| L’indicateur | Ce qu’il dit |
| Le **PIB par habitant** | La richesse produite rapportée à la population |
| L’**IDH** | Richesse, santé et éducation combinés, entre 0 et 1 |
| Le **seuil de pauvreté extrême** | Fixé par la Banque mondiale |

= La Norvège dépasse 0,95 d’IDH · plusieurs pays d’Afrique subsaharienne restent sous 0,45

= Environ 700 millions de personnes vivent encore en pauvreté extrême

## Les inégalités entre les pays
| Le groupe | Ses traits |
| Les pays **développés** — Amérique du Nord, Europe, Japon, Australie | IDH élevé, économie tertiarisée, population vieillissante |
| Les pays **émergents** — Chine, Inde, Brésil, Afrique du Sud | Croissance rapide, industrialisation, **fortes inégalités internes** |
| Les **PMA** — une cinquantaine, surtout en Afrique | IDH faible, économie peu diversifiée, dépendance à l’aide |

!> L’ancienne opposition « **Nord/Sud** » reste commode, mais elle ne dit rien de la Chine, ni des inégalités **à l’intérieur** de chaque pays.

## Les inégalités à l’intérieur des pays
| L’opposition | |
| **Bidonvilles** et quartiers d’affaires | Dans la même ville |
| **Villes** et **campagnes** isolées | |
| Littoraux dynamiques et intérieurs délaissés | |
| Entre **hommes et femmes**, entre générations | |

> Il y a des pauvres dans les pays riches et des très riches dans les pays pauvres.

## Ce qui réduit les écarts
| Le levier | |
| La **scolarisation**, en particulier des filles | |
| L’**accès aux soins** et à l’eau potable | |
| Les **microcrédits** | |
| Les **transferts** des migrants vers leur pays | **Supérieurs à l’aide publique au développement** |
| L’**aide** internationale et les **ONG** | |

## Les progrès réels
En trente ans, l’extrême pauvreté a fortement reculé, l’espérance de vie mondiale a augmenté et la scolarisation a progressé partout.

> Les inégalités demeurent, mais le monde de 2020 n’est pas celui de 1990.`,
          },
          questions: [
            ['Que combine l’IDH ?', ['La richesse, la santé et l’éducation', 'Le PIB et la superficie', 'La population et les ressources', 'Le taux de chômage et l’inflation'], 0, 'Il donne une image plus juste que le seul PIB.'],
            ['Qu’est-ce qu’un pays émergent ?', ['Un pays à croissance rapide et en cours d’industrialisation, mais très inégalitaire', 'Un pays sortant d’une guerre', 'Un pays sans industrie', 'Un pays membre de l’ONU depuis peu'], 0, 'Chine, Inde, Brésil, Afrique du Sud.'],
            ['Que désigne le sigle PMA ?', ['Les pays les moins avancés', 'Les pays à main-d’œuvre abondante', 'Les puissances militaires alliées', 'Les pays méditerranéens associés'], 0, 'Une cinquantaine de pays, surtout en Afrique.'],
            ['Pourquoi l’opposition Nord/Sud est-elle devenue insuffisante ?', ['Elle ne rend compte ni de la Chine ni des inégalités internes', 'Elle est trop récente', 'Elle ne concerne que l’Europe', 'Elle a été interdite par l’ONU'], 0, 'La réalité est plus contrastée qu’une ligne sur une carte.'],
            ['Où trouve-t-on parfois les inégalités les plus fortes ?', ['À l’intérieur d’un même pays, voire d’une même ville', 'Uniquement entre continents', 'Uniquement entre pays voisins', 'Entre hémisphères'], 0, 'Bidonvilles et quartiers d’affaires cohabitent.'],
            ['Quel levier réduit le plus durablement la pauvreté ?', ['La scolarisation, en particulier des filles', 'L’augmentation des exportations de matières premières', 'La croissance démographique', 'L’aide alimentaire d’urgence seule'], 0, 'Elle agit sur la santé, la fécondité et l’emploi à la fois.'],
            ['Que représentent les transferts d’argent des migrants vers leur pays d’origine ?', ['Une somme supérieure à l’aide publique au développement', 'Une part négligeable des revenus', 'Une aide réservée aux États', 'Un flux interdit par les banques'], 0, 'Ils irriguent directement les familles.'],
            ['La pauvreté extrême a augmenté dans le monde depuis trente ans.', ['Vrai', 'Faux'], 1, 'Elle a fortement reculé, même si les inégalités demeurent.'],
          ],
        },
        {
          titre: 'Comment nourrir une humanité en croissance ?',
          axe: 'Des ressources limitées, à gérer et à renouveler',
          lecon: {
            titre: 'Assez de nourriture, mal répartie',
            cours: `La planète produit assez de nourriture pour tous. Le problème n’est pas la quantité produite : c’est l’accès.

## Le paradoxe
= Environ 800 millions de personnes souffrent de la faim

= Plus de 2 milliards sont en surpoids

## Le vocabulaire
| Le mot | Ce qu’il désigne |
| **Sous-nutrition** | Ne pas manger assez de **calories** |
| **Malnutrition** | **Mal** manger : carences en protéines, vitamines, fer |
| **Insécurité alimentaire** | Ne pas être sûr de manger à sa faim demain |
| **Sécurité alimentaire** | L’accès de tous, à tout moment, à une nourriture suffisante et saine |

## Les causes de la faim
~ Pauvreté → conflits armés → sécheresses et catastrophes → absence de routes et de stockage → spéculation sur les prix

## Deux modèles agricoles
| Le modèle | Ses moyens | Ses rendements |
| **Vivrière** | Peu de moyens ; produire pour se nourrir | Faibles, très exposés aux aléas |
| **Productiviste et commerciale** | Mécanisation, intrants, irrigation, sélection | Élevés, pour le marché mondial |

La **révolution verte** des années 1960-1980 a fortement augmenté les rendements en Asie — au prix d’une forte consommation d’eau et d’intrants.

## Nourrir sans épuiser
| Le fait | Le chiffre |
| Les terres occupées par l’agriculture | **La moitié** des terres habitables |
| L’eau douce prélevée par l’agriculture | **70 %** |
| La nourriture perdue ou gaspillée | Environ **un tiers** |

L’agriculture contribue aussi fortement aux émissions de gaz à effet de serre et à la déforestation.

## Les pistes
**Agroécologie**, agriculture biologique, circuits courts, réduction du gaspillage, limitation de la consommation de viande, amélioration du stockage et des transports au Sud, sécurisation du foncier pour les paysans.

> Nourrir 10 milliards d’humains en 2060 est possible ; le faire **sans épuiser les sols, l’eau et le climat** est le vrai défi.`,
          },
          questions: [
            ['Combien de personnes souffrent de la faim dans le monde ?', ['Environ 800 millions', 'Environ 100 millions', 'Environ 3 milliards', 'Environ 50 millions'], 0, 'Alors que la planète produit assez pour tous.'],
            ['Quelle est la différence entre sous-nutrition et malnutrition ?', ['La sous-nutrition est un manque de calories, la malnutrition un déséquilibre', 'Ce sont deux mots pour la même chose', 'La malnutrition ne concerne que les enfants', 'La sous-nutrition concerne uniquement les pays riches'], 0, 'On peut manger à sa faim et être carencé.'],
            ['Qu’est-ce que l’agriculture vivrière ?', ['Une agriculture destinée à nourrir le producteur et sa famille', 'Une agriculture destinée à l’exportation', 'Une agriculture entièrement mécanisée', 'Une agriculture biologique certifiée'], 0, 'Rendements faibles et forte exposition aux aléas.'],
            ['Qu’a été la révolution verte ?', ['Une forte hausse des rendements en Asie par les intrants et l’irrigation', 'Un mouvement écologiste des années 1970', 'Le passage au bio en Europe', 'Un plan de reboisement mondial'], 0, 'Au prix d’une forte consommation d’eau et d’intrants.'],
            ['Quelle part de l’eau douce prélevée l’agriculture consomme-t-elle ?', ['Environ 70 %', 'Environ 20 %', 'Environ 40 %', 'Environ 90 %'], 0, 'Elle occupe aussi la moitié des terres habitables.'],
            ['Quelle part de la nourriture produite est perdue ou gaspillée ?', ['Environ un tiers', 'Environ 5 %', 'Environ la moitié', 'Environ 10 %'], 0, 'Réduire ce gaspillage est l’un des leviers les plus immédiats.'],
            ['Pourquoi la consommation de viande pose-t-elle un problème ?', ['Elle exige beaucoup de terres, d’eau et de céréales', 'Elle est moins nutritive', 'Elle est interdite dans plusieurs pays', 'Elle se conserve mal'], 0, 'Il faut plusieurs kilos de céréales pour produire un kilo de viande.'],
            ['La faim dans le monde s’explique d’abord par une production insuffisante.', ['Vrai', 'Faux'], 1, 'La production suffit : c’est l’accès à la nourriture qui fait défaut.'],
          ],
        },
        {
          titre: 'L’eau : une ressource à ménager',
          axe: 'Des ressources limitées, à gérer et à renouveler',
          lecon: {
            titre: 'Beaucoup d’eau, très peu disponible',
            cours: `L’eau couvre les trois quarts de la planète. Moins de 1 % de l’eau douce est facilement accessible.

## Une ressource rare, en réalité
~ 100 % de l’eau → 97,5 % salée → 2,5 % douce → dont l’essentiel pris dans les glaces et les nappes profondes

= Moins de 1 % de l’eau douce est facilement accessible

## Une répartition très inégale
Neuf pays concentrent **60 %** des réserves d’eau douce. À l’inverse, le Proche-Orient, le Sahel et l’Asie centrale en manquent structurellement.

| Le seuil | Le volume par habitant et par an |
| **Stress hydrique** | Moins de **1 700 m³** |
| **Pénurie** | Moins de **1 000 m³** |

= Environ 2 milliards de personnes n’ont pas d’accès sûr à l’eau potable

!> L’eau insalubre reste l’une des **premières causes de mortalité infantile** dans le monde.

## Qui consomme quoi
| L’usage | Sa part des prélèvements |
| L’**agriculture** (irrigation) | **70 %** |
| L’**industrie** | **20 %** |
| Les **usages domestiques** | **10 %** |

Un habitant d’Amérique du Nord consomme plusieurs centaines de litres par jour ; un habitant du Sahel, parfois moins de vingt.

## L’eau virtuelle
C’est l’eau nécessaire pour **produire** un bien.

| Le produit | Son eau virtuelle |
| 1 kg de bœuf | ≈ **15 000 litres** |
| 1 tee-shirt en coton | ≈ 2 700 litres |
| 1 tasse de café | ≈ 140 litres |

> Importer un produit, c’est importer l’eau qui a servi à le faire.

## Les pressions
Surexploitation des nappes, **pollution** agricole et industrielle, assèchement de la **mer d’Aral**, fonte des glaciers qui alimentent les grands fleuves d’Asie, conflits entre pays riverains d’un même fleuve — Nil, Jourdain, Tigre et Euphrate.

## Les solutions
**Économiser** (goutte-à-goutte, réparation des fuites, tarification), **recycler** les eaux usées, **dessaler** l’eau de mer — coûteux et énergivore —, protéger nappes et zones humides, coopérer entre États riverains.

> L’eau ne manque pas partout ; elle manque **là où l’on en a besoin, au moment où l’on en a besoin**. C’est un problème de gestion autant que de stock.`,
          },
          questions: [
            ['Quelle part de l’eau de la planète est douce ?', ['2,5 %', '30 %', '10 %', '50 %'], 0, 'Et l’essentiel de cette eau douce est pris dans les glaces.'],
            ['Qu’est-ce que le stress hydrique ?', ['Moins de 1 700 m³ d’eau par habitant et par an', 'Une pollution des nappes', 'Une inondation saisonnière', 'Un conflit entre pays riverains'], 0, 'En dessous de 1 000 m³, on parle de pénurie.'],
            ['Quel secteur consomme le plus d’eau ?', ['L’agriculture, avec environ 70 % des prélèvements', 'L’industrie', 'Les usages domestiques', 'La production d’électricité'], 0, 'L’irrigation en représente l’essentiel.'],
            ['Qu’est-ce que l’eau virtuelle ?', ['L’eau nécessaire pour produire un bien', 'L’eau des nappes profondes', 'L’eau recyclée', 'L’eau de pluie non captée'], 0, 'Environ 15 000 litres pour un kilo de bœuf.'],
            ['Combien de personnes n’ont pas d’accès sûr à l’eau potable ?', ['Environ 2 milliards', 'Environ 100 millions', 'Environ 500 millions', 'Environ 4 milliards'], 0, 'L’eau insalubre reste une cause majeure de mortalité infantile.'],
            ['Quelle mer intérieure s’est asséchée par surexploitation ?', ['La mer d’Aral', 'La mer Noire', 'La mer Caspienne', 'La mer Morte uniquement'], 0, 'Le détournement de ses fleuves pour l’irrigation du coton en est la cause.'],
            ['Quelle technique économise l’eau en agriculture ?', ['L’irrigation au goutte-à-goutte', 'L’irrigation par submersion', 'Le dessalement', 'Le pompage profond'], 0, 'Elle apporte l’eau directement au pied de la plante.'],
            ['Le dessalement de l’eau de mer est une solution simple et peu coûteuse.', ['Vrai', 'Faux'], 1, 'Il est coûteux, très énergivore et produit une saumure difficile à rejeter.'],
          ],
        },
        {
          titre: 'Gérer les ressources énergétiques',
          axe: 'Des ressources limitées, à gérer et à renouveler',
          lecon: {
            titre: 'Consommer plus, émettre moins : l’équation du siècle',
            cours: `Consommer plus d’énergie et en émettre moins : c’est l’équation la plus difficile du siècle.

## Une consommation qui explose
= La consommation mondiale d’énergie a été multipliée par plus de dix en un siècle

Croissance démographique, industrialisation, élévation du niveau de vie. Un Nord-Américain consomme plusieurs dizaines de fois plus qu’un habitant du Sahel.

## Deux familles d’énergies
| La famille | Ses membres | Sa part du mix mondial |
| **Non renouvelables** | **Pétrole**, **charbon**, **gaz naturel**, **uranium** | Les fossiles pèsent encore ≈ **80 %** |
| **Renouvelables** | **Hydraulique** (la première), **éolien**, **solaire**, **géothermie**, **biomasse** | Le reste, en croissance |

## Les problèmes posés
| L’énergie | Son problème |
| Les **fossiles** | Réserves finies, concentrées (Moyen-Orient, Russie, États-Unis) : **dépendances** et tensions géopolitiques |
| Les **fossiles**, encore | Leur combustion émet du **CO₂** : première cause du réchauffement |
| Le **nucléaire** | Presque pas de CO₂, mais les **déchets** et le **risque d’accident** |
| Les **renouvelables** | **Intermittentes**, gourmandes en espace et en matériaux rares |

@ 1986 — Tchernobyl
@ 2011 — Fukushima

## La transition énergétique
Trois leviers, **dans cet ordre** :

1. **Sobriété** : consommer moins — isolation, transports collectifs, limitation des usages ;
2. **efficacité** : consommer mieux — meilleurs rendements, réseaux intelligents ;
3. **substitution** : remplacer les fossiles par des énergies décarbonées.

> La première énergie propre est celle qu’on ne consomme pas : aucune source, même renouvelable, n’est sans impact.

## Les inégalités d’accès
= Environ 700 millions de personnes n’ont toujours pas accès à l’électricité

Principalement en Afrique subsaharienne. Leur développement passe par l’énergie — d’où l’enjeu de leur donner accès **directement** aux renouvelables, sans passer par l’étape fossile.`,
          },
          questions: [
            ['Quelle part du mix énergétique mondial les énergies fossiles représentent-elles encore ?', ['Environ 80 %', 'Environ 30 %', 'Environ 50 %', 'Environ 10 %'], 0, 'Pétrole, charbon et gaz dominent toujours.'],
            ['Quelle énergie renouvelable produit le plus d’électricité dans le monde ?', ['L’hydraulique', 'L’éolien', 'Le solaire', 'La géothermie'], 0, 'Elle précède l’éolien et le solaire.'],
            ['Pourquoi les énergies fossiles posent-elles un problème climatique ?', ['Leur combustion émet du CO₂, principal gaz à effet de serre', 'Elles consomment trop d’eau', 'Elles occupent trop d’espace', 'Elles sont trop chères à extraire'], 0, 'C’est la première cause du réchauffement.'],
            ['Quel est le principal inconvénient du nucléaire ?', ['Les déchets radioactifs et le risque d’accident', 'Ses fortes émissions de CO₂', 'Son intermittence', 'Son occupation d’espace'], 0, 'Tchernobyl en 1986, Fukushima en 2011.'],
            ['Quel est le principal inconvénient de l’éolien et du solaire ?', ['Leur intermittence', 'Leurs émissions de CO₂', 'Leur coût de combustible', 'Leur production de déchets radioactifs'], 0, 'Le vent et le soleil ne se commandent pas.'],
            ['Quels sont les trois leviers de la transition énergétique ?', ['Sobriété, efficacité, substitution', 'Extraction, transport, stockage', 'Nucléaire, charbon, gaz', 'Production, distribution, consommation'], 0, 'Dans cet ordre : consommer moins, puis mieux, puis autrement.'],
            ['Combien de personnes n’ont pas accès à l’électricité ?', ['Environ 700 millions', 'Environ 50 millions', 'Environ 2 milliards', 'Environ 100 millions'], 0, 'Principalement en Afrique subsaharienne.'],
            ['Les énergies renouvelables n’ont aucun impact sur l’environnement.', ['Vrai', 'Faux'], 1, 'Elles demandent espace, matériaux et infrastructures : la première énergie propre reste celle qu’on ne consomme pas.'],
          ],
        },
        {
          titre: 'Le changement global et ses effets',
          axe: 'Prévenir les risques, s’adapter au changement global',
          lecon: {
            titre: 'Un climat qui se dérègle, des sociétés qui doivent s’adapter',
            cours: `L’effet de serre est naturel et indispensable. Ce sont les activités humaines qui le renforcent.

## De quoi parle-t-on
Le **changement global** désigne l’ensemble des transformations que les activités humaines font subir à la planète : réchauffement, perte de **biodiversité**, dégradation des sols, pollutions, urbanisation massive.

## Le mécanisme
!> **Sans effet de serre, la Terre serait à −18 °C.** Le problème n’est pas l’effet de serre : c’est son **renforcement** par les émissions humaines.

~ Combustion des fossiles, déforestation, agriculture, industrie → émissions de CO₂ et de méthane → effet de serre renforcé → réchauffement

= Environ +1,2 °C depuis l’ère préindustrielle, avec une accélération nette depuis les années 1980

## Les effets déjà mesurables
| L’effet | |
| **Fonte** des glaciers et de la banquise | |
| **Hausse du niveau des mers** | Dilatation de l’eau **et** fonte des glaces continentales |
| **Événements extrêmes** | Canicules, sécheresses, incendies, pluies diluviennes, cyclones plus intenses |
| Déplacement des **espèces** | Et des zones de culture |
| **Acidification** des océans | Blanchissement des coraux |

## Des effets très inégaux
| La région | Ce qu’elle subit |
| Les **États insulaires** du Pacifique | Menacés de submersion |
| Le **Sahel** | La sécheresse s’aggrave |
| Les grands **deltas** — Bangladesh, Nil, Mékong | Densément peuplés et exposés |
| Les régions **polaires** | Elles se réchauffent **deux à trois fois** plus vite que la moyenne |

!> Ceux qui émettent le **moins** subissent souvent le **plus**. C’est le cœur du problème de justice climatique.

## Deux réponses complémentaires
| La réponse | Ce qu’elle vise |
| L’**atténuation** | **Réduire les émissions** : transition énergétique, sobriété, reforestation, transports |
| L’**adaptation** | **Vivre avec** les effets déjà inévitables : digues, îlots de fraîcheur, cultures résistantes, alertes |

> Atténuer et s’adapter ne s’opposent pas : on n’évitera pas tout, et on ne s’adaptera pas à tout. Il faut les deux.

## La gouvernance mondiale
| L’instance | Son rôle |
| Le **GIEC** | L’expertise scientifique |
| Les **COP** | La négociation annuelle |
| L’**accord de Paris** (2015) | L’engagement des États |

La difficulté : le climat est un **bien commun**, et chaque État est tenté d’attendre l’effort des autres.`,
          },
          questions: [
            ['Qu’est-ce que le changement global ?', ['L’ensemble des transformations que les activités humaines font subir à la planète', 'Le seul réchauffement climatique', 'Un cycle naturel du climat', 'La mondialisation économique'], 0, 'Climat, biodiversité, sols et pollutions y sont liés.'],
            ['L’effet de serre est-il un phénomène naturel ?', ['Oui, et il est indispensable : sans lui la Terre serait à −18 °C', 'Non, il est entièrement dû à l’homme', 'Oui, mais il est sans effet sur la température', 'Non, il n’existe que depuis 1950'], 0, 'Ce sont les activités humaines qui le renforcent.'],
            ['De combien la température moyenne mondiale a-t-elle augmenté depuis l’ère préindustrielle ?', ['Environ 1,2 °C', 'Environ 5 °C', 'Environ 0,1 °C', 'Environ 3 °C'], 0, 'Avec une accélération nette depuis les années 1980.'],
            ['Quelle est la principale cause de la hausse du niveau des mers ?', ['La dilatation de l’eau et la fonte des glaces continentales', 'La fonte de la banquise seule', 'L’augmentation des précipitations', 'Les marées plus fortes'], 0, 'La banquise flottante, en fondant, ne fait pas monter le niveau.'],
            ['Quelles régions sont les plus menacées par la submersion ?', ['Les États insulaires du Pacifique et les grands deltas', 'Les zones de montagne', 'Les déserts chauds', 'Les régions forestières'], 0, 'Ce sont souvent celles qui émettent le moins.'],
            ['Que signifie l’atténuation du changement climatique ?', ['Réduire les émissions de gaz à effet de serre', 'Vivre avec les effets inévitables', 'Mesurer les températures', 'Déplacer les populations'], 0, 'L’adaptation est l’autre volet de la réponse.'],
            ['Quel organisme produit l’expertise scientifique sur le climat ?', ['Le GIEC', 'L’OMS', 'L’UNESCO', 'La FAO'], 0, 'Les COP sont, elles, les conférences de négociation.'],
            ['Il faut choisir entre atténuer le changement climatique et s’y adapter.', ['Vrai', 'Faux'], 1, 'Les deux sont nécessaires : on n’évitera pas tout, et on ne s’adaptera pas à tout.'],
          ],
        },
        {
          titre: 'Prévenir les risques industriels et technologiques',
          axe: 'Prévenir les risques, s’adapter au changement global',
          lecon: {
            titre: 'Quand le danger vient de ce que l’on a construit',
            cours: `Un aléa sans population exposée n’est pas un risque. C’est toute la logique de la prévention.

## Le vocabulaire du risque
| Le mot | Ce qu’il désigne |
| L’**aléa** | L’événement dangereux **possible** |
| La **vulnérabilité** | La fragilité de ce qui est exposé : population, bâtiments, activités |
| Le **risque** | **Aléa × vulnérabilité** |
| La **catastrophe** | La réalisation du risque |

= Risque = aléa × vulnérabilité

!> **Sans population exposée, un aléa n’est pas un risque.** Une explosion en plein désert n’est pas une catastrophe.

## Les risques technologiques
| Le type | Ses exemples |
| **Industriel** | **Bhopal** (Inde, 1984, plusieurs milliers de morts), **AZF** à Toulouse (2001), Lubrizol à Rouen (2019) |
| **Nucléaire** | **Tchernobyl** (1986), **Fukushima** (2011) |
| **Transport de matières dangereuses** | Routes, voies ferrées, canalisations |
| **Marées noires** | Erika (1999), Prestige (2002), Deepwater Horizon (2010) |
| **Rupture de barrage**, **cyberattaques** | Sur les réseaux vitaux |

> Fukushima a été déclenché par un séisme et un tsunami : les risques **naturels** et **technologiques** se combinent.

## Une inégalité mondiale
!> Les mêmes usines n’ont **pas les mêmes normes** selon les pays. Dans les pays pauvres, les installations dangereuses côtoient des quartiers denses et les secours sont limités : à aléa égal, la **vulnérabilité** y est bien plus grande.

## La prévention
| L’action | Ce qu’elle fait |
| **Connaître** | Cartographier les zones exposées |
| **Réglementer** | Normes, autorisations, contrôles, directive **Seveso** en Europe |
| **Aménager** | Les **PPRT** interdisent ou encadrent la construction autour des sites |
| **Informer et former** | Exercices d’évacuation, sirènes, consignes |
| **Prévoir les secours** | Plans d’urgence dimensionnés à l’avance |

> On ne supprime pas un aléa industriel : on réduit la **vulnérabilité**. C’est tout le sens de l’aménagement autour des sites classés.

## Le paradoxe de l’acceptabilité
Ces installations sont dangereuses — et pourtant utiles : emplois, énergie, produits du quotidien. Toute la question est de décider **collectivement** quel niveau de risque une société accepte, et à quelles conditions.`,
          },
          questions: [
            ['Comment définit-on le risque ?', ['Le croisement d’un aléa et d’une vulnérabilité', 'La probabilité d’un accident seule', 'Le nombre de victimes possibles', 'La gravité d’une catastrophe passée'], 0, 'Sans population exposée, un aléa n’est pas un risque.'],
            ['Qu’est-ce que l’aléa ?', ['L’événement dangereux possible', 'La fragilité des populations exposées', 'La catastrophe elle-même', 'Le plan de secours'], 0, 'La vulnérabilité, elle, décrit ce qui est exposé.'],
            ['Quelle catastrophe industrielle a frappé Toulouse en 2001 ?', ['L’explosion de l’usine AZF', 'Une marée noire', 'Une rupture de barrage', 'Un accident nucléaire'], 0, 'Bhopal en 1984 et Lubrizol en 2019 sont d’autres exemples.'],
            ['Quelle catastrophe de 2011 mêle risque naturel et risque technologique ?', ['Fukushima', 'Tchernobyl', 'Bhopal', 'Deepwater Horizon'], 0, 'Un séisme et un tsunami ont déclenché l’accident nucléaire.'],
            ['Que désigne la directive Seveso ?', ['Une réglementation européenne encadrant les sites industriels dangereux', 'Un plan de secours communal', 'Une norme de construction antisismique', 'Un accord international sur le climat'], 0, 'Elle impose des obligations renforcées aux sites classés.'],
            ['À quoi sert un PPRT ?', ['À interdire ou encadrer les constructions autour d’un site dangereux', 'À indemniser les victimes', 'À financer la dépollution', 'À former les pompiers'], 0, 'C’est un outil d’aménagement du territoire.'],
            ['Pourquoi la vulnérabilité est-elle plus grande dans les pays pauvres ?', ['Normes moins strictes, habitat proche des sites et secours limités', 'Les aléas y sont plus fréquents', 'Les usines y sont plus nombreuses', 'Le climat y est plus rude'], 0, 'À aléa égal, les conséquences y sont bien plus lourdes.'],
            ['La prévention consiste d’abord à supprimer l’aléa industriel.', ['Vrai', 'Faux'], 1, 'On ne le supprime pas : on réduit la vulnérabilité par la réglementation et l’aménagement.'],
          ],
        },
      ],
    },
  ],
}
