// Histoire-géographie — Quatrième : LE PROGRAMME COMPLET (18 fiches, 2 ONGLETS).
//
// LE DÉFAUT, ET POURQUOI CETTE MATIÈRE PASSE AVANT LES AUTRES. L'histoire-géo
// de 4e n'avait que CINQ chapitres hérités du premier jeu de données, pour deux
// disciplines et une année entière — et elle cumulait le second défaut : cinq de
// ses leçons « Exercices types » n'avaient aucun quiz derrière (migration 331).
// Maigre ET trouée : avec l'anglais de 6e, c'était l'un des deux seuls points du
// tronc commun dans ce cas, et donc l'un des deux plus dangereux de l'app.
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 6 thèmes du programme et leurs 18 fiches :
//   RAYON HISTOIRE — positions 1 → 11
//     1. Le XVIIIe siècle : expansions, Lumières et révolutions   (5)
//     2. L'Europe et le monde au XIXe siècle                      (3)
//     3. Société, culture et politique dans la France du XIXe     (3)
//   RAYON GÉOGRAPHIE — positions 12 → 18
//     1. L'urbanisation du monde                                  (2)
//     2. Les mobilités humaines transnationales                   (2)
//     3. Des espaces transformés par la mondialisation            (3)
//
// ⚠️ DEUX ONGLETS, comme en 6e (330) et en 5e (306) : deux blocs, deux rayons
// (`chapters.discipline`, migration 247). `disciplinesOf` en fait un onglet
// chacun dès qu'il y en a deux.
//
// ⚠️ POURQUOI C'EST ÉCRIT ET NON IMPORTÉ. Les sciences et les langues
// s'importent d'un niveau à l'autre parce que le BO les écrit pour le cycle
// entier. L'histoire-géo, non : chaque année a SA période. La 5e va du Moyen Âge
// au XVIIe, la 4e couvre le XVIIIe et le XIXe, la 3e le XXe. Importer ici
// donnerait à un élève de 4e le programme d'une autre année.
//
// ⚠️ TROIS COLLISIONS DE TITRES, neutralisées par `theme IS NULL`. Les fiches
// neuves « L'Europe des Lumières » et « L'Europe de la révolution industrielle »
// portent les mots mêmes de deux chapitres hérités, et `chapters` impose
// UNIQUE(subject_id, level, title). Le ménage visant `theme IS NULL` tourne
// AVANT les insertions : les anciens sont partis quand les neufs arrivent.
//
// ⚠️ Le slug `histoire-geo` porte plusieurs modules : ne JAMAIS générer avec
// `--slugs histoire-geo`. Toujours `--modules histoire-geo-4e`.

export default {
  slug: 'histoire-geo',
  nom: 'Histoire-Géo',

  titreMigration: 'HISTOIRE-GÉO 4e — LE PROGRAMME COMPLET (18 fiches, 2 onglets)',

  motif: `CONSTAT : l'histoire-géo de 4e n'avait que 5 chapitres hérités du premier jeu de
données, pour DEUX disciplines et une année entière — et cinq de ses leçons
« Exercices types » n'avaient aucun quiz (traité par la 331). Maigre ET trouée :
avec l'anglais de 6e, c'était l'un des deux seuls points du tronc commun dans ce
cas. Un élève qui révisait la traite négrière, la Terreur, la révolution
industrielle, le droit de vote, la Troisième République, les migrations ou la
maritimisation ne trouvait RIEN.
Cette migration installe les 18 fiches du programme, rangées sous 6 thèmes et
DEUX RAYONS, et retire les 5 chapitres génériques.
ÉCRIT, PAS IMPORTÉ : chaque niveau d'histoire-géo a sa période propre — la 4e
couvre le XVIIIe et le XIXe siècle, que ni la 5e ni la 3e ne traitent.`,

  menage: [
    {
      raison: `Les colonnes chapters.theme (migration 234) et chapters.discipline
(migration 247) conditionnent tout ce qui suit : ce module range ses 18 fiches
sous 6 thèmes et deux rayons, et l'INSERT écrit les deux colonnes. Elles sont
REPRISES ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que la
234 et la 247 soient passées en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 5 anciens chapitres
déjà supprimés et les 18 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters et ne l'a rendu que colonne par colonne. Sans le GRANT sur discipline,
les deux onglets ne s'afficheraient pas.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS discipline TEXT;
GRANT SELECT (discipline) ON public.chapters TO anon;
GRANT SELECT (discipline) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités partent, au niveau 4e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — et ici c'est la CONDITION du bon
fonctionnement, pas un confort. Deux fiches neuves (« L'Europe des Lumières »,
« L'Europe de la révolution industrielle ») portent les mots mêmes de chapitres
hérités, or chapters impose UNIQUE(subject_id, level, title) : un ménage par
titre laisserait passer la collision. Le critère « pas de thème de programme »
vise exactement les cinq lignes voulues — elles datent d'avant la colonne theme,
tandis que les 18 fiches neuves en portent une dès l'INSERT. Le ménage tourne
AVANT les insertions et ne peut donc jamais mordre sur elles, ni au premier
passage ni au rejeu.
Le filtre level = '4e' est indispensable : l'histoire-géo existe sur sept
niveaux, et chacun a ses propres migrations.
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
   AND s.slug = 'histoire-geo'
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '4e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    // =====================================================================
    // RAYON HISTOIRE — positions 1 → 11
    // =====================================================================
    {
      niveaux: ['4e'],
      rayon: 'histoire',
      chapitres: [
        // --- Thème 1 : Le XVIIIe siècle ---
        {
          titre: 'Bourgeoisies marchandes, négoces internationaux et traite négrière',
          axe: 'Le XVIIIe siècle : expansions, Lumières et révolutions',
          lecon: {
            titre: 'La fortune des ports, et son prix',
            cours: `Les ports atlantiques du XVIIIe siècle s’enrichissent comme jamais. Cette fortune repose sur la vente d’êtres humains.

## Le grand commerce
Les navires rapportent des **produits coloniaux** : sucre, café, cacao, indigo, coton, tabac. Ils viennent des **plantations** d’Amérique et des Antilles — des exploitations immenses tournées vers l’exportation.

| Le port | Le pays |
| **Bordeaux**, **Nantes** | France |
| **Liverpool**, **Bristol** | Royaume-Uni |

## Le commerce triangulaire
~ Europe → Afrique : armes, tissus, alcool, verroterie contre des captifs

~ Afrique → Amérique : la traversée des esclaves, le « passage du milieu »

~ Amérique → Europe : les produits des plantations

> Chaque étape rapporte. C’est ce qui rend l’ensemble extraordinairement rentable — et c’est la raison économique de sa persistance.

## La traite négrière
| Le fait | Le chiffre |
| Africains déportés entre le XVIe et le XIXe siècle | Environ **12 millions** |
| Morts pendant la traversée | **Un sur six** |

Entassement, maladies, révoltes réprimées.

!> Aux Antilles, le **Code Noir** (1685) définit l’esclave comme un **bien meuble** : juridiquement, une chose que l’on possède, vend et transmet.

## Une nouvelle bourgeoisie
Les **négociants** et **armateurs** s’enrichissent. Sans être nobles, ils bâtissent des hôtels particuliers, achètent des terres, financent des théâtres.

> Ils veulent aussi peser politiquement — et cette frustration nourrira 1789.

## Les premières contestations
@ 1685 — Le Code Noir
@ 1788 — Fondation de la Société des amis des Noirs
@ 1794 — Première abolition de l’esclavage
@ 1802 — Bonaparte la rétablit
@ 1848 — Abolition définitive

**Montesquieu** ironise, **Condorcet** condamne. Et des révoltes d’esclaves éclatent, bien avant que l’Europe n’en débatte.`,
          },
          questions: [
            ['Quels ports s’enrichissent avec le grand commerce au XVIIIe siècle ?', ['Bordeaux, Nantes, Liverpool, Bristol', 'Paris, Lyon, Milan', 'Moscou, Varsovie', 'Vienne, Prague'], 0, 'Ce sont des ports de l’Atlantique.'],
            ['Quelles sont les trois étapes du commerce triangulaire ?', ['Europe → Afrique → Amérique → Europe', 'Europe → Asie → Afrique', 'Amérique → Europe → Asie', 'Afrique → Europe → Asie'], 0, 'Chaque étape rapporte.'],
            ['Combien d’Africains ont été déportés par la traite atlantique ?', ['Environ 12 millions', 'Environ 1 million', 'Environ 100 000', 'Environ 50 millions'], 0, 'Entre le XVIe et le XIXe siècle.'],
            ['Que définit le Code Noir de 1685 ?', ['Le statut de l’esclave comme bien meuble', 'Les droits des marins', 'Les tarifs douaniers', 'Le droit de vote'], 0, 'Une chose que l’on possède et transmet.'],
            ['Comment appelle-t-on la traversée des esclaves vers l’Amérique ?', ['Le passage du milieu', 'La route des Indes', 'Le grand tour', 'Le cabotage'], 0, 'Un déporté sur six y mourait.'],
            ['Que produisent les plantations coloniales ?', ['Sucre, café, cacao, coton, tabac', 'Blé et seigle', 'Fer et charbon', 'Laine et lin'], 0, 'Elles sont tournées vers l’exportation.'],
            ['En quelle année l’esclavage est-il définitivement aboli en France ?', ['1848', '1794', '1802', '1789'], 0, 'L’abolition de 1794 avait été annulée en 1802.'],
            ['La bourgeoisie négociante du XVIIIe siècle appartenait à la noblesse.', ['Vrai', 'Faux'], 1, 'Elle s’enrichit sans être noble — d’où sa frustration politique.'],
          ],
        },
        {
          titre: 'L’Europe des Lumières',
          axe: 'Le XVIIIe siècle : expansions, Lumières et révolutions',
          lecon: {
            titre: 'Penser par soi-même',
            cours: `Les Lumières posent un principe simple et explosif : la raison doit éclairer le monde, à la place de la tradition et de l’autorité.

## Les quatre grands noms
| Le penseur | Son œuvre | Son idée maîtresse |
| **Montesquieu** | *De l’esprit des lois* (1748) | La **séparation des pouvoirs** : exécutif, législatif, judiciaire |
| **Voltaire** | L’affaire Calas | La **tolérance religieuse**, contre le fanatisme |
| **Rousseau** | *Du contrat social* (1762) | La **souveraineté du peuple** : l’autorité vient de ceux qui obéissent |
| **Diderot** et **d’Alembert** | L’**Encyclopédie** (1751-1772) | **28 volumes** pour réunir et diffuser tout le savoir |

## Ce qu’ils réclament
~ Liberté d’expression → liberté de conscience → égalité devant la loi → justice équitable → fin de la torture

Ils critiquent la **monarchie absolue**, les **privilèges** et l’**intolérance**.

## Comment les idées circulent
| Le lieu | Son rôle |
| Les **salons** | Tenus souvent par des femmes |
| Les **cafés**, **académies**, **loges maçonniques** | On y discute |
| Les **livres** | Souvent imprimés à l’étranger pour échapper à la **censure**, et vendus sous le manteau |

> Une idée interdite ne cesse pas de circuler : elle circule plus cher, et plus vite.

## Le despotisme éclairé
| Le souverain | Son pays |
| **Frédéric II** | Prusse |
| **Catherine II** | Russie |
| **Joseph II** | Autriche |

Ils réforment — tolérance, codes de lois, écoles — en se disant inspirés des Lumières.

!> Mais ils gardent **tout le pouvoir**. Le despotisme éclairé réforme au nom du peuple, jamais avec lui.

## La portée
@ 1776 — La Déclaration d’indépendance américaine
@ 1789 — La Révolution française

Ces idées fondent encore nos textes sur les droits de l’homme.`,
          },
          questions: [
            ['Quel principe est au cœur des Lumières ?', ['La raison doit éclairer le monde', 'La tradition doit être respectée', 'L’autorité religieuse prime', 'La force fait le droit'], 0, 'Contre la tradition et l’autorité.'],
            ['Qui a théorisé la séparation des pouvoirs ?', ['Montesquieu', 'Voltaire', 'Rousseau', 'Diderot'], 0, 'Dans De l’esprit des lois, en 1748.'],
            ['Quelle œuvre Diderot et d’Alembert dirigent-ils ?', ['L’Encyclopédie', 'Le Contrat social', 'Candide', 'De l’esprit des lois'], 0, '28 volumes, de 1751 à 1772.'],
            ['Quelle idée Rousseau défend-il dans Du contrat social ?', ['La souveraineté du peuple', 'La monarchie de droit divin', 'La séparation des pouvoirs', 'Le libre-échange'], 0, 'L’autorité vient de ceux qui obéissent.'],
            ['Par quels lieux les idées des Lumières circulent-elles ?', ['Les salons, les cafés, les académies et les loges', 'Les églises seulement', 'Les casernes', 'Les tribunaux'], 0, 'Les salons étaient souvent tenus par des femmes.'],
            ['Qu’est-ce que le despotisme éclairé ?', ['Un souverain qui réforme au nom des Lumières mais garde tout le pouvoir', 'Un régime sans roi', 'Une république', 'Un gouvernement des philosophes'], 0, 'Frédéric II, Catherine II, Joseph II.'],
            ['Pourquoi certains livres étaient-ils imprimés à l’étranger ?', ['Pour échapper à la censure', 'Parce que le papier y coûtait moins cher', 'Pour être traduits', 'Par tradition'], 0, 'Ils étaient ensuite vendus sous le manteau.'],
            ['Les philosophes des Lumières soutenaient la monarchie absolue.', ['Vrai', 'Faux'], 1, 'Ils la critiquaient, ainsi que les privilèges et l’intolérance.'],
          ],
        },
        {
          titre: 'La Révolution française : 1789, la fin de l’Ancien Régime',
          axe: 'Le XVIIIe siècle : expansions, Lumières et révolutions',
          lecon: {
            titre: 'L’année où tout bascule',
            cours: `En quelques mois de 1789, une monarchie vieille de huit siècles change de nature. Tout se joue en dix semaines.

## La société d’Ancien Régime
| L’ordre | Sa part | Ses impôts |
| Le **clergé** | Minoritaire | **Privilégié** : exempté de l’essentiel |
| La **noblesse** | Minoritaire | **Privilégiée** |
| Le **tiers état** | **98 %** de la population | Il paie |

## La crise
Les finances royales sont ruinées par les guerres et le train de la cour. Les récoltes de 1788 sont mauvaises : le **pain**, base de l’alimentation, devient hors de prix.

## Les journées décisives
@ 5 mai 1789 — Ouverture des États généraux à Versailles
@ 17 juin — Les députés du tiers état se proclament Assemblée nationale
@ 20 juin — Le serment du Jeu de paume : ne pas se séparer avant d’avoir donné une constitution
@ 14 juillet — Prise de la Bastille, prison-symbole de l’arbitraire royal
@ Été 1789 — La Grande Peur dans les campagnes : les châteaux sont attaqués
@ 4 août — Abolition des privilèges
@ 26 août — La Déclaration des droits de l’homme et du citoyen

## La Déclaration
= « Les hommes naissent et demeurent libres et égaux en droits »

| Ce qu’elle pose | |
| Les droits naturels | **Liberté**, **propriété**, **sûreté**, **résistance à l’oppression** |
| La **souveraineté** | Elle appartient à la **Nation** |
| La **loi** | Elle est l’expression de la volonté générale |

!> Elle ne concerne **ni les femmes, ni les esclaves** des colonies. **Olympe de Gouges** le dénonce dès **1791**.

> Un texte peut être immense et incomplet en même temps. Ses limites ont servi d’argument à ceux qui les ont ensuite fait tomber.

## La monarchie constitutionnelle
La **Constitution de 1791** limite le pouvoir du roi, qui garde un **droit de veto**. Le suffrage est **censitaire** : seuls votent les hommes payant un certain impôt.`,
          },
          questions: [
            ['Comment s’appellent les trois ordres de l’Ancien Régime ?', ['Clergé, noblesse et tiers état', 'Roi, nobles et paysans', 'Nobles, bourgeois et ouvriers', 'Clergé, armée et peuple'], 0, 'Le tiers état représente 98 % de la population.'],
            ['Quelle date marque la prise de la Bastille ?', ['14 juillet 1789', '4 août 1789', '5 mai 1789', '26 août 1789'], 0, 'La Bastille était le symbole de l’arbitraire royal.'],
            ['Qu’est-ce que le serment du Jeu de paume ?', ['L’engagement de ne pas se séparer avant d’avoir donné une constitution', 'Le couronnement du roi', 'Un traité de paix', 'La fondation de la République'], 0, 'Le 20 juin 1789.'],
            ['Que se passe-t-il dans la nuit du 4 août 1789 ?', ['L’abolition des privilèges', 'L’exécution du roi', 'La prise de la Bastille', 'La déclaration de guerre'], 0, 'Elle met fin à la société d’ordres.'],
            ['Que proclame la Déclaration des droits de l’homme et du citoyen ?', ['Les hommes naissent et demeurent libres et égaux en droits', 'Le roi est de droit divin', 'La propriété est abolie', 'Le suffrage est universel'], 0, 'Adoptée le 26 août 1789.'],
            ['Qui dénonce dès 1791 l’exclusion des femmes ?', ['Olympe de Gouges', 'Madame Roland', 'Charlotte Corday', 'Marie-Antoinette'], 0, 'Dans sa Déclaration des droits de la femme et de la citoyenne.'],
            ['Qu’est-ce que le suffrage censitaire ?', ['Seuls les hommes payant un certain impôt votent', 'Tous les hommes votent', 'Tous les citoyens votent', 'Le vote est tiré au sort'], 0, 'Il est instauré par la Constitution de 1791.'],
            ['La Déclaration de 1789 s’appliquait aux esclaves des colonies.', ['Vrai', 'Faux'], 1, 'Ni aux esclaves ni aux femmes — ce que ses critiques ont aussitôt relevé.'],
          ],
        },
        {
          titre: 'La Révolution française : la République et la Terreur',
          axe: 'Le XVIIIe siècle : expansions, Lumières et révolutions',
          lecon: {
            titre: 'De la monarchie à la guillotine',
            cours: `En quatre ans, la France passe d’un roi constitutionnel à une république qui guillotine ses propres citoyens.

## La rupture
@ Juin 1791 — La fuite à Varennes : arrêté, le roi perd la confiance du pays
@ Avril 1792 — Déclaration de guerre à l’Autriche ; les défaites nourrissent le soupçon de trahison
@ 10 août 1792 — Prise des Tuileries, le roi est suspendu
@ 22 septembre 1792 — Proclamation de la Première République
@ 21 janvier 1793 — Louis XVI est guillotiné après son procès devant la Convention

## La Terreur (1793-1794)
La République est menacée de toutes parts : guerre aux frontières, insurrection en **Vendée**, révoltes fédéralistes. Le **Comité de salut public**, dominé par **Robespierre**, gouverne par l’exception.

| La mesure | Ce qu’elle permet |
| La **loi des suspects** | Être arrêté sur simple **soupçon** |
| Le **tribunal révolutionnaire** | Des exécutions massives : environ **17 000** condamnations à mort |
| La **levée en masse** | Réquisitions, maximum des prix |

Des dizaines de milliers de morts en Vendée.

> La Terreur est faite au nom de la liberté, contre des gens jugés sans preuve. C’est le paradoxe que ce chapitre doit laisser intact, pas résoudre.

## Les avancées de la Convention
| L’avancée | La date |
| Abolition de l’**esclavage** | Février **1794** |
| **Suffrage universel masculin** | Constitution de 1793 — **jamais appliquée** |
| Instruction publique, **système métrique** | |

## La chute
@ 9 thermidor an II (27 juillet 1794) — Robespierre est renversé et exécuté
@ 1795-1799 — Le Directoire, régime instable
@ 18 brumaire (9 novembre 1799) — Le coup d’État de Bonaparte`,
          },
          questions: [
            ['Quel événement de juin 1791 fait perdre au roi la confiance du pays ?', ['La fuite à Varennes', 'La prise de la Bastille', 'Le serment du Jeu de paume', 'La nuit du 4 août'], 0, 'Il est arrêté et ramené à Paris.'],
            ['Quand la Première République est-elle proclamée ?', ['Le 22 septembre 1792', 'Le 14 juillet 1789', 'Le 21 janvier 1793', 'Le 9 thermidor an II'], 0, 'Après la prise des Tuileries du 10 août.'],
            ['Quand Louis XVI est-il exécuté ?', ['Le 21 janvier 1793', 'Le 10 août 1792', 'Le 22 septembre 1792', 'En 1794'], 0, 'Après un procès devant la Convention.'],
            ['Quel organe gouverne pendant la Terreur ?', ['Le Comité de salut public', 'Le Directoire', 'Les États généraux', 'Le Sénat'], 0, 'Dominé par Robespierre.'],
            ['Que permet la loi des suspects ?', ['Arrêter sur simple soupçon', 'Juger avec un avocat', 'Libérer les prisonniers', 'Voter la loi'], 0, 'Elle est au cœur du régime de la Terreur.'],
            ['Quelle avancée majeure la Convention vote-t-elle en février 1794 ?', ['L’abolition de l’esclavage', 'Le suffrage féminin', 'La liberté de la presse', 'La séparation de l’Église et de l’État'], 0, 'Bonaparte la rétablira en 1802.'],
            ['Que se passe-t-il le 9 thermidor an II ?', ['Robespierre est renversé et exécuté', 'La République est proclamée', 'Le roi est guillotiné', 'Bonaparte prend le pouvoir'], 0, 'Le Directoire lui succède.'],
            ['La Constitution de 1793, qui prévoyait le suffrage universel masculin, a été appliquée.', ['Vrai', 'Faux'], 1, 'Elle n’a jamais été mise en œuvre.'],
          ],
        },
        {
          titre: 'Napoléon Bonaparte et l’Empire',
          axe: 'Le XVIIIe siècle : expansions, Lumières et révolutions',
          lecon: {
            titre: 'Ce qu’il garde de la Révolution, ce qu’il en efface',
            cours: `Napoléon garde de la Révolution ce qui rend un État fort, et supprime ce qui limite le pouvoir. C’est la clé du chapitre.

## La prise du pouvoir
@ 9 novembre 1799 — Coup d’État du 18 brumaire : Bonaparte devient Premier consul
@ 1802 — Consul à vie
@ 2 décembre 1804 — Il se fait sacrer empereur

## Ce qu’il consolide
| L’institution | Ce qu’elle apporte |
| Le **Code civil** (1804) | Égalité devant la loi, propriété garantie, laïcité de l’état civil |
| La **Banque de France**, le **franc germinal** | Une monnaie stable |
| Les **préfets**, le **cadastre** | Une administration centralisée |
| Les **lycées**, la **Légion d’honneur** | Une élite recrutée au mérite |
| Le **Concordat** (1801) | La paix religieuse |

Le Code civil inspire encore le droit de dizaines de pays.

## Ce qu’il supprime
| La liberté | Ce qu’il en fait |
| La **liberté de la presse** | Journaux censurés, opposants surveillés |
| Les **élections** réelles | Les plébiscites approuvent, ils ne choisissent pas |
| L’abolition de l’**esclavage** | **Rétabli en 1802**, annulant 1794 |
| Les droits des **femmes** | Le Code civil place la femme mariée sous l’autorité de son mari |

> Il garde l’égalité devant la loi et l’administration ; il supprime tout ce qui contrôle le pouvoir.

## L’Empire et sa chute
@ 1805 — Austerlitz ; puis Iéna, Wagram : l’Europe est dominée
@ 1812 — La campagne de Russie tourne au désastre
@ 1813 — Défaite de Leipzig
@ 1815 — Waterloo ; exil à Sainte-Hélène
@ 1815 — Le congrès de Vienne rétablit les rois

!> La guerre d’**Espagne** s’enlise bien avant la Russie : c’est elle qui use l’armée impériale la première.

## L’héritage
Les rois reviennent, mais le **Code civil**, l’**administration** et l’**idée de nation** restent. Ils traverseront tout le XIXe siècle.`,
          },
          questions: [
            ['Comment Bonaparte prend-il le pouvoir ?', ['Par le coup d’État du 18 brumaire, en 1799', 'Par une élection', 'Par héritage', 'Par un vote de la Convention'], 0, 'Il renverse le Directoire.'],
            ['Quand Napoléon se fait-il sacrer empereur ?', ['Le 2 décembre 1804', 'En 1799', 'En 1802', 'En 1815'], 0, 'Après avoir été Premier consul puis consul à vie.'],
            ['Quel texte juridique majeur date de 1804 ?', ['Le Code civil', 'La Déclaration des droits de l’homme', 'Le Concordat', 'La Constitution de 1791'], 0, 'Il inspire encore le droit de nombreux pays.'],
            ['Que fait Napoléon de l’esclavage ?', ['Il le rétablit en 1802', 'Il l’abolit', 'Il ne s’en occupe pas', 'Il l’étend à la métropole'], 0, 'Annulant l’abolition votée en 1794.'],
            ['Quelle liberté Napoléon supprime-t-il ?', ['La liberté de la presse', 'La liberté de culte', 'La liberté de circulation', 'Le droit de propriété'], 0, 'Les journaux sont censurés et les opposants surveillés.'],
            ['Quel accord rétablit la paix religieuse en 1801 ?', ['Le Concordat', 'Le Code civil', 'L’édit de tolérance', 'Le Consulat'], 0, 'Signé avec le pape.'],
            ['Où Napoléon est-il définitivement vaincu, et quand ?', ['À Waterloo, en 1815', 'À Leipzig, en 1813', 'En Russie, en 1812', 'À Austerlitz, en 1805'], 0, 'Il est exilé à Sainte-Hélène.'],
            ['Le Code civil accordait aux femmes les mêmes droits qu’aux hommes.', ['Vrai', 'Faux'], 1, 'Il plaçait la femme mariée sous l’autorité de son mari.'],
          ],
        },

        // --- Thème 2 : L'Europe et le monde au XIXe siècle ---
        {
          titre: 'L’Europe de la révolution industrielle',
          axe: 'L’Europe et le monde au XIXe siècle',
          lecon: {
            titre: 'La machine change tout',
            cours: `La révolution industrielle n’est pas seulement une révolution technique : c’est une révolution de l’organisation — du capital, du travail et du temps.

## Le point de départ
@ Vers 1780 — La révolution industrielle commence en Angleterre
@ 1841 — La France limite le travail des enfants, sans grands moyens de contrôle
@ 1848 — Marx et Engels publient le Manifeste du parti communiste
@ À partir de 1870 — La seconde industrialisation

Son moteur : la **machine à vapeur** de **James Watt**, le **charbon** et le **fer**.

## Les deux âges
| L’âge | Sa période | Ses énergies et secteurs |
| **Première** industrialisation | Fin XVIIIe - milieu XIXe | **Charbon**, **vapeur**, textile, sidérurgie, **chemin de fer** |
| **Seconde** industrialisation | À partir de 1870 | **Électricité**, **pétrole**, moteur à explosion, chimie, acier |

## L’usine et la ville
~ L’atelier → la fabrique : machines et ouvriers rassemblés en un lieu → on travaille à l’heure, non à la tâche

Les campagnes se vident, les villes industrielles explosent : c’est l’**exode rural**.

## Le chemin de fer
Il change les distances, les prix — et jusqu’à l’heure.

> C’est pour le train qu’on adopte une **heure unique** par pays : avant lui, chaque ville vivait à son heure solaire.

## Le capitalisme
Des **banques** et des **sociétés par actions** rassemblent les capitaux nécessaires. Une **bourgeoisie d’affaires** — industriels, banquiers — devient la classe dominante, devant l’aristocratie foncière.

## Le coût humain
!> Journées de **12 à 15 heures**, **travail des enfants**, salaires bas, accidents sans indemnisation, logements insalubres.

## Les réactions
| Le courant | Ce qu’il porte |
| Le **syndicalisme** et les **grèves** | L’organisation des ouvriers |
| Le **socialisme** | **Marx** et Engels : la lutte des classes |
| Le **catholicisme social** | L’Église reconnaît la « question ouvrière » |`,
          },
          questions: [
            ['Dans quel pays commence la révolution industrielle ?', ['En Angleterre, vers 1780', 'En France', 'En Allemagne', 'Aux États-Unis'], 0, 'Elle gagne ensuite le continent.'],
            ['Quelle invention est au cœur de la première industrialisation ?', ['La machine à vapeur', 'Le moteur électrique', 'Le moteur à explosion', 'La dynamo'], 0, 'Perfectionnée par James Watt.'],
            ['Quelles énergies caractérisent la seconde industrialisation ?', ['L’électricité et le pétrole', 'Le charbon et la vapeur', 'Le bois et l’eau', 'Le gaz de ville seul'], 0, 'À partir de 1870.'],
            ['Qu’est-ce que l’exode rural ?', ['Le départ des campagnes vers les villes', 'L’arrivée de citadins à la campagne', 'L’émigration vers les colonies', 'Le retour des ouvriers aux champs'], 0, 'Il accompagne l’industrialisation.'],
            ['Quelle classe devient dominante au XIXe siècle ?', ['La bourgeoisie d’affaires', 'L’aristocratie foncière', 'La paysannerie', 'Le clergé'], 0, 'Industriels et banquiers.'],
            ['Quelle innovation impose une heure unique par pays ?', ['Le chemin de fer', 'Le télégraphe', 'L’usine', 'La banque'], 0, 'Les horaires de train l’exigeaient.'],
            ['Quel texte majeur du socialisme paraît en 1848 ?', ['Le Manifeste du parti communiste', 'Le Capital', 'De l’esprit des lois', 'Du contrat social'], 0, 'Par Marx et Engels.'],
            ['La révolution industrielle a immédiatement amélioré les conditions de vie ouvrières.', ['Vrai', 'Faux'], 1, 'Journées de 12 à 15 h, travail des enfants, logements insalubres.'],
          ],
        },
        {
          titre: 'La société industrielle : bourgeois, ouvriers et nouvelles idées',
          axe: 'L’Europe et le monde au XIXe siècle',
          lecon: {
            titre: 'Deux mondes dans la même ville',
            cours: `L’industrialisation crée deux groupes neufs, qui vivent dans la même ville sans jamais se croiser.

## Les deux mondes
| Le groupe | Ce qu’il possède | Où il vit |
| La **bourgeoisie** | Les entreprises | Les beaux quartiers |
| Le **prolétariat** | Seulement sa **force de travail**, vendue contre un salaire | Les quartiers ouvriers |

## La vie ouvrière
Journées longues, salaires bas, aucune protection en cas d’accident, de maladie ou de vieillesse.

!> Femmes et enfants sont employés **parce qu’ils coûtent moins cher**. Ce n’est pas un effet secondaire de l’industrialisation : c’est un calcul.

Les quartiers ouvriers sont surpeuplés, sans eau courante ni égouts — d’où les épidémies de **choléra**.

## La bourgeoisie
Elle affiche sa réussite : appartements haussmanniens, domesticité, éducation des enfants, villégiature. Elle impose ses **valeurs** : travail, épargne, mérite, respectabilité.

## Les classes moyennes
Entre les deux : employés, instituteurs, petits commerçants, contremaîtres. Elles grandissent avec l’administration et le commerce.

## Les idées neuves
| Le courant | Sa réponse |
| Le **libéralisme économique** | L’État doit laisser faire le marché |
| Le **socialisme** | Partager les moyens de production ; **Marx** annonce la lutte des classes |
| Le **catholicisme social** | *Rerum novarum* (1891) reconnaît la question ouvrière |
| L’**anarchisme** | Supprimer l’État lui-même |

> La question qui traverse tout le siècle tient en une phrase : à qui profite la richesse produite ?

## Les conquêtes
@ 1864 — Droit de grève en France
@ 1884 — Liberté syndicale
@ 1906 — Repos hebdomadaire

> Rien n’est donné : tout est arraché par la mobilisation.`,
          },
          questions: [
            ['Que possède l’ouvrier du XIXe siècle ?', ['Seulement sa force de travail', 'Son usine', 'Sa terre', 'Ses outils'], 0, 'Il la vend contre un salaire.'],
            ['Qui compose la bourgeoisie industrielle ?', ['Industriels, banquiers, commerçants, professions libérales', 'Paysans et artisans', 'Nobles de cour', 'Ouvriers qualifiés'], 0, 'Elle possède les entreprises.'],
            ['Pourquoi employait-on femmes et enfants dans les usines ?', ['Ils coûtaient moins cher', 'Ils étaient plus qualifiés', 'La loi l’imposait', 'Ils travaillaient moins longtemps'], 0, 'La France limite le travail des enfants dès 1841.'],
            ['Quelle épidémie frappe les quartiers ouvriers surpeuplés ?', ['Le choléra', 'La peste noire', 'La variole seule', 'La grippe espagnole'], 0, 'Faute d’eau courante et d’égouts.'],
            ['En quelle année le droit de grève est-il reconnu en France ?', ['1864', '1884', '1841', '1906'], 0, 'La liberté syndicale suit en 1884.'],
            ['Que défend le libéralisme économique ?', ['L’État doit laisser faire le marché', 'L’État doit tout posséder', 'Les salaires doivent être fixés par la loi', 'Le commerce doit être interdit'], 0, 'Il s’oppose au socialisme sur ce point.'],
            ['Quel texte marque l’entrée de l’Église dans la question ouvrière ?', ['Rerum novarum, en 1891', 'Le Concordat', 'Le Manifeste communiste', 'Le Code civil'], 0, 'C’est l’acte de naissance du catholicisme social.'],
            ['Les protections sociales du XIXe siècle ont été accordées spontanément par les patrons.', ['Vrai', 'Faux'], 1, 'Elles ont été arrachées par la mobilisation ouvrière.'],
          ],
        },
        {
          titre: 'Conquêtes et sociétés coloniales',
          axe: 'L’Europe et le monde au XIXe siècle',
          lecon: {
            titre: 'L’Europe se partage le monde',
            cours: `Entre 1850 et 1914, l’Europe conquiert l’Afrique et une grande partie de l’Asie. En 1914, elle contrôle 85 % des terres émergées.

## Les motifs
| Le motif | Ce qu’on cherche |
| **Économique** | Matières premières, débouchés commerciaux, placements |
| **Politique** | Prestige, rivalités entre puissances, points d’appui militaires |
| **Idéologique** | La prétendue « **mission civilisatrice** », adossée à des théories racistes |

## La conférence de Berlin
@ 1884-1885 — Les puissances européennes se partagent l’Afrique

!> **Aucun Africain n’y est présent.** Les frontières y sont tracées à la règle, ignorant peuples et royaumes existants.

> Une carte dessinée en Europe par des gens qui n’avaient jamais vu les lieux organise encore la géographie politique d’un continent — et beaucoup de ses conflits actuels.

## La société coloniale
| Le groupe | Sa situation |
| Les **colons européens** | Le pouvoir et la terre |
| Les **colonisés** | Statut d’**indigène** : sans droits politiques, soumis au **travail forcé**, à l’**impôt** et au **code de l’indigénat** |

## Ce que la colonisation apporte, et à qui
Routes, ports, chemins de fer, écoles, dispensaires — mais construits d’abord pour l’**exportation** et pour une minorité.

!> Les cultures **vivrières** reculent devant les cultures d’**exportation** : la colonisation fragilise l’alimentation des colonisés au moment même où elle se dit civilisatrice.

## Les résistances
| Le résistant | Où |
| **Abd el-Kader** | Algérie |
| **Samory Touré** | Afrique de l’Ouest |
| La révolte des **Cipayes** (1857) | Inde |
| La guerre des **Herero** | Namibie |

Elles existent **partout et dès le départ**, et sont réprimées, parfois avec une extrême violence.`,
          },
          questions: [
            ['Quelle part des terres émergées l’Europe contrôle-t-elle en 1914 ?', ['Environ 85 %', 'Environ 40 %', 'Environ 60 %', 'Environ 20 %'], 0, 'Après la conquête de l’Afrique et de l’Asie.'],
            ['Que décide la conférence de Berlin de 1884-1885 ?', ['Le partage de l’Afrique entre puissances européennes', 'L’abolition de l’esclavage', 'La fin des colonies', 'La création de la SDN'], 0, 'Aucun Africain n’y était présent.'],
            ['Quel statut est imposé aux colonisés ?', ['Le statut d’indigène, sans droits politiques', 'La citoyenneté pleine', 'Le statut de protégé égal', 'Aucun statut particulier'], 0, 'Avec le code de l’indigénat et le travail forcé.'],
            ['Quel motif idéologique justifiait la colonisation ?', ['La prétendue mission civilisatrice', 'La liberté des peuples', 'L’égalité des nations', 'La paix universelle'], 0, 'Adossée à des théories racistes.'],
            ['Qui résiste à la conquête française en Algérie ?', ['Abd el-Kader', 'Samory Touré', 'Les Cipayes', 'Les Herero'], 0, 'Samory Touré résiste en Afrique de l’Ouest.'],
            ['Quelle révolte éclate en Inde en 1857 ?', ['La révolte des Cipayes', 'La guerre des Boers', 'La révolte des Herero', 'La guerre de l’Opium'], 0, 'Elle est durement réprimée.'],
            ['Pourquoi les équipements construits dans les colonies profitent-ils peu aux colonisés ?', ['Ils sont conçus d’abord pour l’exportation', 'Ils sont trop modernes', 'Ils sont détruits aussitôt', 'Ils sont réservés à l’armée'], 0, 'Les cultures vivrières reculent devant celles d’exportation.'],
            ['Les peuples colonisés ne se sont pas opposés à la conquête.', ['Vrai', 'Faux'], 1, 'Les résistances existent partout et dès le départ.'],
          ],
        },

        // --- Thème 3 : Société, culture et politique dans la France du XIXe ---
        {
          titre: 'Une difficile conquête : voter de 1815 à 1870',
          axe: 'Société, culture et politique dans la France du XIXe siècle',
          lecon: {
            titre: 'Cinquante ans pour un bulletin',
            cours: `Le mot « universel » de 1848 excluait la moitié du pays. Il a fallu presque un siècle pour qu’il devienne vrai.

## Un siècle de régimes
@ 1815-1830 — La Restauration : Louis XVIII puis Charles X, suffrage censitaire très étroit
@ 1830-1848 — La monarchie de Juillet, après les Trois Glorieuses : Louis-Philippe
@ 1848-1852 — La Deuxième République : suffrage universel masculin, abolition de l’esclavage
@ 1852-1870 — Le Second Empire : Napoléon III encadre le suffrage
@ 1870 — La Troisième République

## Le nombre d’électeurs
| Le régime | Les électeurs |
| **Restauration** | Environ **100 000** |
| **Monarchie de Juillet** | Environ **240 000** |
| **Deuxième République** | **9 millions**, d’un coup |

## Ce que « voter » veut dire
| Le suffrage | Qui vote |
| **Censitaire** | Ceux qui paient un impôt élevé : voter est un **privilège de fortune** |
| **Universel masculin** | Tous les hommes : voter devient un **droit** |

!> Les **femmes** attendront **1944**.

> Le mot « universel » de 1848 excluait la moitié du pays.

## Comment on arrache le droit
~ Révolutions de 1830 et 1848 → barricades → presse → banquets républicains contournant l’interdiction de réunion

Chaque avancée suit une crise. Aucune n’est offerte.

## Le vote lui-même
!> Le vote est longtemps **public**, donc **surveillé**. L’**isoloir** et l’enveloppe n’arrivent qu’en **1913** : jusque-là, on pouvait voir pour qui votait un ouvrier ou un métayer.

## L’enjeu
Cette lente conquête explique l’attachement français au vote et à la République — et pourquoi l’abstention y est vécue autrement qu’ailleurs.`,
          },
          questions: [
            ['Qu’est-ce que le suffrage censitaire ?', ['Le droit de vote réservé à ceux qui paient un impôt élevé', 'Le vote de tous les hommes', 'Le vote par tirage au sort', 'Le vote des seuls nobles'], 0, 'Voter y est un privilège de fortune.'],
            ['Quand le suffrage universel masculin est-il proclamé en France ?', ['En 1848', 'En 1830', 'En 1870', 'En 1913'], 0, 'On passe de 240 000 à 9 millions d’électeurs.'],
            ['Quand les femmes obtiennent-elles le droit de vote en France ?', ['En 1944', 'En 1848', 'En 1913', 'En 1900'], 0, 'Près d’un siècle après le « suffrage universel » masculin.'],
            ['Que sont les Trois Glorieuses ?', ['La révolution de 1830', 'La révolution de 1848', 'Le coup d’État de 1851', 'La Commune de 1871'], 0, 'Elles amènent la Monarchie de Juillet.'],
            ['Comment Napoléon III encadre-t-il le suffrage universel ?', ['Par la candidature officielle et la censure', 'En le supprimant', 'En le réservant aux nobles', 'En instaurant le tirage au sort'], 0, 'Le vote existe, le choix est orienté.'],
            ['Quand l’isoloir est-il instauré en France ?', ['En 1913', 'En 1848', 'En 1870', 'En 1884'], 0, 'Jusque-là, le vote pouvait être surveillé.'],
            ['Quelle autre grande mesure la Deuxième République vote-t-elle en 1848 ?', ['L’abolition de l’esclavage', 'La séparation des Églises et de l’État', 'L’école obligatoire', 'La liberté syndicale'], 0, 'Définitive, cette fois.'],
            ['Le droit de vote a été accordé progressivement et sans conflit.', ['Vrai', 'Faux'], 1, 'Chaque avancée suit une révolution ou une crise.'],
          ],
        },
        {
          titre: 'La Troisième République',
          axe: 'Société, culture et politique dans la France du XIXe siècle',
          lecon: {
            titre: 'La République s’installe pour de bon',
            cours: `La Troisième République naît d’une défaite, s’impose à une voix, et dure soixante-dix ans.

## Une naissance difficile
@ 4 septembre 1870 — La République est proclamée après la défaite de Sedan
@ Mars-mai 1871 — La Commune de Paris est écrasée
@ 1875 — L’amendement Wallon fait passer la République à UNE voix

!> Les **monarchistes sont majoritaires** à l’Assemblée. La République ne s’impose pas par adhésion : elle s’impose d’un cheveu.

La France perd l’**Alsace-Moselle**.

## Les grandes lois qui l’enracinent
@ 1881-1882 — Lois Jules Ferry : école primaire gratuite, laïque et obligatoire de 6 à 13 ans
@ 1881 — Liberté de la presse et de réunion
@ 1884 — Liberté syndicale ; les communes élisent leur maire
@ 1901 — Liberté d’association
@ 1905 — Séparation des Églises et de l’État : la laïcité

## L’école, instrument de la République
| Ce qu’elle enseigne | |
| Lire, écrire, compter | |
| Le **français** | Contre les langues régionales |
| L’**histoire nationale** et le **civisme** | |

L’instituteur — le « hussard noir » — devient une figure du village, face au curé.

> Une république qui veut durer ne se contente pas de lois : elle **forme ses citoyens**. C’est le sens de l’école obligatoire.

## Les symboles
| Le symbole | La date |
| **Marianne** | |
| Le **14 juillet**, fête nationale | 1880 |
| La **Marseillaise**, hymne | 1879 |
| **Liberté, Égalité, Fraternité** | La devise |

## Les crises traversées
@ 1894-1906 — L’affaire Dreyfus
@ 1898 — Zola publie « J’accuse… ! »

Le **boulangisme**, le scandale de **Panama**, et surtout l’affaire Dreyfus : un officier juif condamné à tort. La France se déchire, la République tient — et en sort renforcée dans son attachement à la justice.

## Ce qui reste inachevé
Les femmes ne votent pas, l’**empire colonial** contredit les principes proclamés, et les inégalités sociales demeurent.`,
          },
          questions: [
            ['Quand la Troisième République est-elle proclamée ?', ['Le 4 septembre 1870', 'En 1875', 'En 1848', 'En 1789'], 0, 'Après la défaite de Sedan.'],
            ['Que rendent les lois Jules Ferry de 1881-1882 ?', ['L’école primaire gratuite, laïque et obligatoire', 'Le vote obligatoire', 'Le travail des enfants légal', 'Le service militaire universel'], 0, 'De 6 à 13 ans.'],
            ['Quelle loi majeure est votée en 1905 ?', ['La séparation des Églises et de l’État', 'La liberté syndicale', 'La liberté de la presse', 'La liberté d’association'], 0, 'C’est le fondement de la laïcité française.'],
            ['Par combien de voix la République est-elle instaurée en 1875 ?', ['Une seule', 'Dix', 'Cent', 'À l’unanimité'], 0, 'C’est l’amendement Wallon.'],
            ['Quelle affaire déchire la France de 1894 à 1906 ?', ['L’affaire Dreyfus', 'Le scandale de Panama', 'Le boulangisme', 'La Commune'], 0, 'Zola publie « J’accuse… ! » en 1898.'],
            ['En quelle année le 14 juillet devient-il la fête nationale ?', ['1880', '1789', '1870', '1905'], 0, 'La Marseillaise devient hymne en 1879.'],
            ['Quel rôle politique l’école de la République joue-t-elle ?', ['Former des citoyens : français, histoire nationale, civisme', 'Enseigner uniquement les métiers', 'Remplacer l’Église', 'Sélectionner une élite'], 0, 'L’instituteur devient une figure du village.'],
            ['Sous la Troisième République, les femmes obtiennent le droit de vote.', ['Vrai', 'Faux'], 1, 'Il faudra attendre 1944.'],
          ],
        },
        {
          titre: 'Conditions féminines dans une société en mutation',
          axe: 'Société, culture et politique dans la France du XIXe siècle',
          lecon: {
            titre: 'Mineures à vie, et pourtant partout',
            cours: `Le XIXe siècle a inventé l’idée que la place des femmes serait « naturellement » au foyer — au moment précis où des millions d’entre elles travaillaient en usine.

## Le cadre juridique
Le **Code civil** de 1804 place la femme mariée sous l’autorité de son mari.

| Ce qu’elle ne peut pas faire seule | |
| Travailler | |
| Ouvrir un compte | |
| Signer un contrat | |

Elle est juridiquement une **incapable majeure**.

@ 1792 — Le divorce est autorisé
@ 1816 — Il est supprimé
@ 1884 — Il est rétabli

## Le travail des femmes
Il est **massif et invisible** : ouvrières du textile, domestiques, blanchisseuses, paysannes, ouvrières à domicile.

!> Elles sont payées **moitié moins** qu’un homme pour le même travail, au motif que leur salaire ne serait qu’un « appoint ».

## Selon les milieux
| Le milieu | Sa situation |
| Les **bourgeoises** | Cantonnées au foyer ; l’oisiveté affichée est un signe de richesse **du mari** |
| Les **ouvrières et paysannes** | Double journée, travail et famille, sans aucune protection |

## Les avancées
@ 1861 — Julie-Victoire Daubié, première femme bachelière
@ 1880 — Loi Camille Sée : les lycées de filles
@ 1881-1882 — L’école primaire devient obligatoire pour les deux sexes
@ 1884 — Rétablissement du divorce
@ 1907 — Les femmes mariées peuvent disposer de leur salaire

## Le combat pour le droit de vote
Les **suffragistes** — **Hubertine Auclert** en France, les *suffragettes* au Royaume-Uni — le réclament dès les années 1870.

@ 1944 — Les Françaises obtiennent le droit de vote

!> Refusé à plusieurs reprises par le **Sénat**, il arrive **très en retard** sur les pays voisins.`,
          },
          questions: [
            ['Quel statut le Code civil de 1804 donne-t-il à la femme mariée ?', ['Une incapable majeure, soumise à l’autorisation de son mari', 'L’égale de son mari', 'La chef de famille', 'Une citoyenne à part entière'], 0, 'Elle ne peut ni travailler ni signer un contrat sans lui.'],
            ['Combien les ouvrières étaient-elles payées par rapport aux hommes ?', ['Environ moitié moins', 'Autant', 'Un quart de moins', 'Davantage'], 0, 'Au motif que leur salaire serait un « appoint ».'],
            ['Quand le divorce est-il rétabli en France ?', ['En 1884', 'En 1816', 'En 1804', 'En 1907'], 0, 'Il avait été supprimé en 1816.'],
            ['Que permet la loi Camille Sée de 1880 ?', ['La création de lycées de filles', 'Le droit de vote des femmes', 'Le divorce', 'Le travail de nuit'], 0, 'L’enseignement secondaire s’ouvre aux filles.'],
            ['Qui est Hubertine Auclert ?', ['Une militante française du droit de vote des femmes', 'La première bachelière', 'Une romancière', 'Une syndicaliste'], 0, 'Elle réclame le vote dès les années 1870.'],
            ['Que permet la loi de 1907 aux femmes mariées ?', ['Disposer de leur salaire', 'Voter', 'Divorcer', 'Ouvrir un lycée'], 0, 'Jusque-là, le mari en disposait.'],
            ['Quelle idée le XIXe siècle diffuse-t-il sur la place des femmes ?', ['Qu’elle serait « naturellement » au foyer', 'Qu’elles doivent travailler en usine', 'Qu’elles doivent voter', 'Qu’elles sont les égales des hommes'], 0, 'Au moment même où des millions travaillaient.'],
            ['Les femmes bourgeoises et ouvrières vivaient la même condition.', ['Vrai', 'Faux'], 1, 'Les unes au foyer par obligation sociale, les autres en double journée.'],
          ],
        },
      ],
    },

    // =====================================================================
    // RAYON GÉOGRAPHIE — positions 12 → 18
    // =====================================================================
    {
      niveaux: ['4e'],
      rayon: 'geographie',
      positionDepart: 12,
      chapitres: [
        {
          titre: 'Espaces et paysages de l’urbanisation',
          axe: 'L’urbanisation du monde',
          lecon: {
            titre: 'Un monde devenu urbain',
            cours: `Depuis 2007, plus de la moitié de l’humanité vit en ville. La croissance urbaine se joue désormais au Sud.

## Le basculement
@ 2007 — Pour la première fois, plus de la moitié de l’humanité vit en ville

= Aujourd’hui : près de 60 % de citadins

## Où ça se passe
| Les villes… | Leur croissance |
| Des pays **développés** | Lente, et anciennes |
| Des pays **en développement**, surtout en **Asie** et en **Afrique** | Rapide, elle porte l’essentiel du mouvement |

## Les formes de la ville
| La zone | Ce qu’on y trouve |
| Le **centre** | Services, commerces, patrimoine ; souvent le plus cher |
| Le **quartier d’affaires** (CBD) | Des tours de bureaux |
| Les **banlieues** et **périphéries** | En couronnes successives |
| L’**étalement urbain** | La ville grignote les campagnes |

## Les grands ensembles
| Le mot | Ce qu’il désigne | Exemples |
| **Mégapole** | Plus de **10 millions** d’habitants | Tokyo, Delhi, Shanghai, São Paulo, Lagos |
| **Mégalopole** | Un **chapelet continu** de villes reliées | BosWash, la mégalopole japonaise, la dorsale européenne |

!> Ne pas confondre les deux : une **mégapole** est **une** ville, une **mégalopole** est **une chaîne** de villes.

## Des paysages contrastés dans la même ville
Tours de verre et **bidonvilles** — favelas, slums — coexistent parfois à quelques centaines de mètres.

= Environ un milliard de personnes vivent en habitat précaire

> Une ville qui grandit vite ne devient pas riche partout en même temps : elle fabrique du contraste avant de fabriquer du confort.

## Les défis
Logement, transports, eau, déchets, pollution de l’air, **îlot de chaleur urbain**, préservation des terres agricoles. Les réponses passent par la **densification**, les **transports collectifs** et la **végétalisation**.`,
          },
          questions: [
            ['Depuis quelle année plus de la moitié de l’humanité vit-elle en ville ?', ['2007', '1950', '1990', '2020'], 0, 'On approche des 60 % aujourd’hui.'],
            ['Où la croissance urbaine est-elle aujourd’hui la plus forte ?', ['En Asie et en Afrique', 'En Europe', 'En Amérique du Nord', 'En Océanie'], 0, 'Dans les pays en développement.'],
            ['Qu’est-ce qu’une mégapole ?', ['Une agglomération de plus de 10 millions d’habitants', 'Un chapelet de villes reliées', 'Une capitale', 'Une ville nouvelle'], 0, 'La mégalopole, elle, relie plusieurs villes.'],
            ['Qu’est-ce qu’une mégalopole ?', ['Un chapelet continu de villes reliées entre elles', 'Une ville de plus de 10 millions d’habitants', 'Un quartier d’affaires', 'Une banlieue'], 0, 'BosWash, la mégalopole japonaise, la dorsale européenne.'],
            ['Combien de personnes vivent en habitat précaire dans le monde ?', ['Environ un milliard', 'Environ 100 millions', 'Environ 10 millions', 'Environ 3 milliards'], 0, 'Favelas, slums et autres bidonvilles.'],
            ['Qu’est-ce que l’étalement urbain ?', ['L’extension de la ville sur les campagnes', 'La construction en hauteur', 'La densification du centre', 'La rénovation des quartiers'], 0, 'Il consomme des terres agricoles.'],
            ['Qu’est-ce que l’îlot de chaleur urbain ?', ['La ville est plus chaude que la campagne voisine', 'Un quartier chauffé collectivement', 'Une zone industrielle', 'Un parc urbain'], 0, 'Le béton et l’asphalte stockent la chaleur.'],
            ['Dans une même métropole, les paysages sont homogènes.', ['Vrai', 'Faux'], 1, 'Tours de verre et bidonvilles peuvent coexister à quelques centaines de mètres.'],
          ],
        },
        {
          titre: 'Des villes inégalement connectées',
          axe: 'L’urbanisation du monde',
          lecon: {
            titre: 'Toutes les villes ne pèsent pas pareil',
            cours: `La mondialisation ne relie pas des pays : elle relie des villes, et elle en laisse beaucoup de côté.

## La hiérarchie urbaine
Les villes ne se valent pas. Leur rang dépend de leurs **fonctions** : bourses, sièges sociaux, universités, aéroports, institutions internationales.

## Les villes mondiales
| La ville | |
| **New York**, **Londres**, **Tokyo** | |
| **Paris**, **Shanghai**, **Singapour** | |
| Hong Kong, Dubaï | |

!> Elles sont reliées **entre elles** bien plus étroitement qu’à leur propre arrière-pays. Une décision prise à Londres pèse davantage sur New York que sur une ville anglaise moyenne.

## Ce qui fait la connexion
| L’infrastructure | Ce qu’elle porte |
| Les **aéroports** internationaux (hubs) | Les personnes |
| Les **ports** à conteneurs | Les marchandises |
| Les **câbles sous-marins** | L’essentiel d’internet |
| Les sièges de **firmes transnationales** et les **places boursières** | Les décisions et les capitaux |

## Les villes à l’écart
Beaucoup de villes — en Afrique subsaharienne, en Asie centrale, à l’intérieur des continents — grandissent vite sans être reliées à ces réseaux.

> Elles concentrent alors la **population** sans concentrer la **richesse**.

## L’effet sur les territoires
Une métropole bien connectée attire emplois, étudiants et capitaux, souvent **au détriment des villes moyennes de son propre pays** : c’est la **métropolisation**.

## La compétition
Les villes se font concurrence pour attirer entreprises, congrès et grands événements — Jeux olympiques, expositions universelles — quitte à s’endetter pour des équipements dont l’usage après coup n’est pas garanti.`,
          },
          questions: [
            ['Qu’est-ce qu’une ville mondiale ?', ['Une ville qui concentre la finance, les décisions et les flux', 'La capitale d’un pays', 'Une ville de plus d’un million d’habitants', 'Une ville portuaire'], 0, 'New York, Londres, Tokyo, Paris, Shanghai.'],
            ['Qu’est-ce qui relie les villes mondiales entre elles ?', ['Aéroports, ports à conteneurs, câbles sous-marins, sièges de firmes', 'Uniquement les routes', 'Les frontières', 'Les fleuves'], 0, 'Elles sont plus liées entre elles qu’à leur arrière-pays.'],
            ['Qu’est-ce que la métropolisation ?', ['La concentration des activités dans quelques grandes villes', 'L’étalement des villes', 'La création de villes nouvelles', 'La construction de métros'], 0, 'Souvent au détriment des villes moyennes.'],
            ['Qu’est-ce qu’un hub aéroportuaire ?', ['Un aéroport de correspondance qui redistribue les flux', 'Un petit aéroport régional', 'Une gare', 'Un port'], 0, 'C’est un marqueur de connexion mondiale.'],
            ['Qu’ont en commun beaucoup de villes d’Afrique subsaharienne ?', ['Elles grandissent vite sans être bien reliées aux réseaux mondiaux', 'Elles perdent des habitants', 'Elles concentrent la finance mondiale', 'Elles sont toutes portuaires'], 0, 'Elles concentrent la population sans la richesse.'],
            ['Que transportent principalement les câbles sous-marins ?', ['L’essentiel des données d’internet', 'Le pétrole', 'L’électricité seulement', 'L’eau potable'], 0, 'Ils sont un élément clé de la connexion.'],
            ['Pourquoi les villes se disputent-elles les grands événements ?', ['Pour attirer entreprises, visibilité et capitaux', 'Pour réduire leur population', 'Pour éviter les impôts', 'Par obligation légale'], 0, 'Quitte à s’endetter pour des équipements peu utilisés ensuite.'],
            ['Toutes les grandes villes sont également connectées à la mondialisation.', ['Vrai', 'Faux'], 1, 'La mondialisation relie certaines villes et en laisse beaucoup de côté.'],
          ],
        },
        {
          titre: 'Un monde de migrants',
          axe: 'Les mobilités humaines transnationales',
          lecon: {
            titre: 'Qui part, pourquoi, et vers où',
            cours: `Ce que l’on croit être un mouvement du Sud vers le Nord est d’abord un mouvement du Sud vers le Sud.

## Les chiffres
= Environ 280 millions de personnes vivent hors de leur pays de naissance, soit 3,5 % de l’humanité

C’est une part **faible** — mais en hausse, et très inégalement répartie.

## Le vocabulaire
| Le mot | Ce qu’il désigne |
| **Migrant** | Celui qui quitte son pays pour s’installer ailleurs |
| **Émigrer** / **immigrer** | Partir **de** / arriver **dans** |
| **Réfugié** | Personne fuyant un danger, protégée par la **convention de Genève** (1951) |
| **Demandeur d’asile** | Celui dont la demande est en cours d’examen |
| **Diaspora** | La communauté dispersée d’un même peuple |

## Les causes
| La cause | Le détail |
| **Économique** | Chercher du travail, un meilleur salaire — **la cause majoritaire** |
| **Politique** | Guerres, persécutions, dictatures |
| **Familiale** | Rejoindre un proche |
| **Étudiante** | |
| **Environnementale** | Sécheresses, montée des eaux, catastrophes — en **forte hausse** |

## Les idées reçues à corriger
!> La majorité des migrations se font **entre pays voisins**. Et la majorité des **réfugiés** sont accueillis par des **pays en développement**, pas par l’Europe.

## Les routes et leurs dangers
La Méditerranée, le Sahara, le désert entre Mexique et États-Unis : ces routes tuent chaque année des milliers de personnes et alimentent des réseaux de **passeurs**.

## Les effets
| Pour le pays de départ | Pour le pays d’arrivée |
| La **fuite des cerveaux** : perte de diplômés | Apport de main-d’œuvre, de compétences, de jeunesse |
| Mais des **transferts d’argent** — plusieurs fois le montant de l’aide au développement | Et des débats politiques vifs |`,
          },
          questions: [
            ['Combien de personnes vivent hors de leur pays de naissance ?', ['Environ 280 millions, soit 3,5 % de l’humanité', 'Environ 1 milliard', 'Environ 50 millions', 'Environ 20 % de l’humanité'], 0, 'Une part faible mais en hausse.'],
            ['Quelle est la différence entre émigrer et immigrer ?', ['Émigrer, c’est partir de ; immigrer, c’est arriver dans', 'C’est la même chose', 'Émigrer concerne les réfugiés', 'Immigrer concerne les étudiants'], 0, 'Le même individu fait les deux.'],
            ['Qu’est-ce qu’un réfugié ?', ['Une personne fuyant un danger, protégée par la convention de Genève', 'Un travailleur étranger', 'Un étudiant international', 'Un touriste'], 0, 'La convention date de 1951.'],
            ['Quelle est la cause majoritaire des migrations ?', ['Économique : chercher du travail', 'Politique', 'Environnementale', 'Étudiante'], 0, 'Les autres causes existent mais pèsent moins.'],
            ['Où se font la majorité des migrations ?', ['Entre pays voisins', 'Des pays pauvres vers les pays riches', 'Vers l’Europe', 'Vers l’Amérique du Nord'], 0, 'C’est l’idée reçue la plus répandue sur le sujet.'],
            ['Qui accueille la majorité des réfugiés dans le monde ?', ['Des pays en développement', 'L’Union européenne', 'Les États-Unis', 'Le Japon'], 0, 'Souvent les pays voisins de la crise.'],
            ['Qu’apportent les transferts d’argent des migrants ?', ['Plusieurs fois le montant de l’aide au développement', 'Une somme négligeable', 'Rien de mesurable', 'Uniquement des biens matériels'], 0, 'Ils soutiennent les familles restées au pays.'],
            ['La fuite des cerveaux désigne l’arrivée de diplômés dans un pays.', ['Vrai', 'Faux'], 1, 'C’est le DÉPART des diplômés du pays d’origine.'],
          ],
        },
        {
          titre: 'Le tourisme et ses espaces',
          axe: 'Les mobilités humaines transnationales',
          lecon: {
            titre: 'La plus grande migration du monde',
            cours: `Le tourisme est le premier flux de personnes de la planète. C’est aussi un marqueur d’inégalité mondiale.

## L’ampleur
= Plus d’un milliard de touristes internationaux par an avant 2020

Et bien davantage de touristes **internes**. C’est une industrie majeure, parfois la première ressource d’un pays.

## Qui voyage
Surtout les habitants des pays **développés** et les classes moyennes émergentes — Chine, Inde, Brésil.

!> Voyager suppose du **temps libre**, un **revenu** et un **passeport utile**. Le tourisme n’est pas ouvert à tous : il est un marqueur d’inégalité mondiale.

## Les grands espaces touristiques
| L’espace | Ses exemples |
| Les **littoraux** chauds | Méditerranée, Caraïbes, Asie du Sud-Est |
| La **montagne** | Ski l’hiver, randonnée l’été |
| Les **villes d’art** | Paris, Rome, Venise, Kyoto |
| Les espaces **naturels** protégés | Parcs nationaux, safaris |

## Les aménagements
Hôtels, resorts, marinas, remontées mécaniques, aéroports, parcs à thème.

> Le tourisme **fabrique** des paysages entiers — parfois de toutes pièces, comme à Dubaï ou à Cancún.

## Les effets
| Positifs | Négatifs |
| Emplois, devises | Emplois **saisonniers** et peu qualifiés |
| Entretien du **patrimoine** | **Bétonisation** des littoraux, pression sur l’eau et les déchets |
| Désenclavement de certaines régions | **Surtourisme** : Venise, Barcelone, Machu Picchu |
| | **Dépendance** à un secteur très sensible aux crises |

!> Le **surtourisme** chasse les habitants par les prix : la ville se vide de ceux qui la font vivre pour se remplir de ceux qui la visitent.

> Une région qui vit du tourisme dépend d’une décision prise ailleurs — par des voyageurs qui peuvent, du jour au lendemain, aller voir ailleurs.

## Les évolutions
**Écotourisme**, tourisme de proximité, régulation des flux et quotas : des réponses apparaissent, portées autant par les habitants que par les autorités.`,
          },
          questions: [
            ['Combien de touristes internationaux compte-t-on par an avant 2020 ?', ['Plus d’un milliard', 'Environ 100 millions', 'Environ 10 millions', 'Environ 5 milliards'], 0, 'Sans compter le tourisme interne.'],
            ['Qui voyage principalement ?', ['Les habitants des pays développés et des classes moyennes émergentes', 'Les habitants des pays les plus pauvres', 'Uniquement les Européens', 'Tout le monde également'], 0, 'Il faut du temps libre, un revenu et un passeport utile.'],
            ['Qu’est-ce que le surtourisme ?', ['Une fréquentation si forte qu’elle dégrade le lieu et chasse les habitants', 'Un tourisme de luxe', 'Un tourisme hors saison', 'Un tourisme écologique'], 0, 'Venise, Barcelone, Machu Picchu.'],
            ['Quel est un inconvénient majeur des emplois touristiques ?', ['Ils sont souvent saisonniers et peu qualifiés', 'Ils sont trop nombreux', 'Ils sont réservés aux étrangers', 'Ils sont mal répartis dans la journée'], 0, 'La saison finie, l’emploi disparaît.'],
            ['Quel espace touristique attire le plus dans le monde ?', ['Les littoraux chauds', 'Les déserts', 'Les zones polaires', 'Les zones industrielles'], 0, 'Méditerranée, Caraïbes, Asie du Sud-Est.'],
            ['Quel risque court un pays très dépendant du tourisme ?', ['Une crise extérieure peut effondrer son économie', 'Une surproduction agricole', 'Une pénurie de main-d’œuvre étrangère', 'Une baisse des impôts'], 0, 'Sa ressource dépend de décisions prises ailleurs.'],
            ['Qu’est-ce que l’écotourisme ?', ['Un tourisme à faible impact qui finance la protection du milieu', 'Un tourisme de masse', 'Un tourisme urbain', 'Un tourisme d’affaires'], 0, 'C’est l’une des réponses au surtourisme.'],
            ['Le tourisme profite également à toutes les régions du monde.', ['Vrai', 'Faux'], 1, 'Il se concentre sur quelques espaces et marque les inégalités mondiales.'],
          ],
        },
        {
          titre: 'Mers et océans : un monde maritimisé',
          axe: 'Des espaces transformés par la mondialisation',
          lecon: {
            titre: 'Tout passe par la mer',
            cours: `Quatre cinquièmes des marchandises du monde voyagent par la mer. La mondialisation dépend des océans.

## La maritimisation
= Environ 80 % du commerce mondial de marchandises voyage par la mer

## Le conteneur, l’objet qui a tout changé
Inventée dans les années **1950**, la **boîte standardisée** permet de charger, transporter et décharger **sans manipuler la marchandise**.

~ Standardiser la boîte → effondrement du coût du transport → fabriquer en Asie pour vendre en Europe devient rentable

## Les points de passage stratégiques
| Le passage | |
| **Suez** | **Panama** |
| **Malacca** | **Ormuz** |
| Gibraltar | Bab el-Mandeb |

!> Un incident sur l’un d’eux — un porte-conteneurs en travers de **Suez** — se répercute sur l’économie mondiale **en quelques jours**.

## Les ports
| Le port | Son rang |
| **Shanghai**, **Singapour**, Ningbo, Shenzhen | Les plus grands, tous en **Asie** |
| **Rotterdam** | Le premier européen |

Ils exigent des **eaux profondes**, des terminaux automatisés et des liaisons terrestres.

## Les ressources
| La ressource | Son état |
| La **pêche** | Elle nourrit des centaines de millions de personnes ; **un tiers** des stocks est **surexploité** |
| L’**énergie** | Pétrole et gaz offshore, éolien en mer |
| Les **minerais des grands fonds** | Encore peu exploités |

## Les tensions
@ 1982 — La convention de Montego Bay accorde à chaque État une zone économique exclusive de 200 milles

D’où des conflits : **mer de Chine méridionale**, **Arctique** dont la fonte ouvre de nouvelles routes.

> La France possède la **deuxième ZEE du monde**, grâce à ses territoires ultramarins. Sa puissance maritime ne se lit pas sur la carte de l’Hexagone.

## Les menaces
Pollutions, **plastiques**, dégazages, acidification, réchauffement, piraterie. Les océans absorbent une grande part du CO₂ et de la chaleur.`,
          },
          questions: [
            ['Quelle part du commerce mondial de marchandises passe par la mer ?', ['Environ 80 %', 'Environ 30 %', 'Environ 50 %', 'Environ 10 %'], 0, 'C’est la maritimisation.'],
            ['Quelle invention a fait s’effondrer le coût du transport maritime ?', ['Le conteneur', 'Le moteur diesel', 'Le radar', 'Le canal de Suez'], 0, 'Une boîte standardisée, dans les années 1950.'],
            ['Lequel de ces passages est un goulet stratégique ?', ['Le détroit de Malacca', 'Le lac Baïkal', 'La mer Morte', 'Le lac Victoria'], 0, 'Comme Suez, Panama, Ormuz.'],
            ['Où se trouvent les plus grands ports du monde ?', ['En Asie', 'En Europe', 'En Afrique', 'En Amérique du Sud'], 0, 'Shanghai, Singapour, Ningbo, Shenzhen.'],
            ['Qu’est-ce qu’une ZEE ?', ['Une zone économique exclusive de 200 milles', 'Une zone d’échange européen', 'Une zone d’exploitation étrangère', 'Une zone de pêche interdite'], 0, 'Définie par la convention de Montego Bay de 1982.'],
            ['Quel rang la France occupe-t-elle pour la taille de sa ZEE ?', ['Le deuxième mondial', 'Le premier', 'Le dixième', 'Le vingtième'], 0, 'Grâce à ses territoires ultramarins.'],
            ['Quelle part des stocks de poissons est surexploitée ?', ['Environ un tiers', 'Environ 5 %', 'Environ 80 %', 'Aucune'], 0, 'La pêche nourrit pourtant des centaines de millions de personnes.'],
            ['Un incident dans un détroit stratégique n’a que des effets locaux.', ['Vrai', 'Faux'], 1, 'Il se répercute sur l’économie mondiale en quelques jours.'],
          ],
        },
        {
          titre: 'L’adaptation du territoire des États-Unis à la mondialisation',
          axe: 'Des espaces transformés par la mondialisation',
          lecon: {
            titre: 'Une puissance qui se redessine',
            cours: `Les États-Unis restent la première économie mondiale — mais leur territoire bascule vers le sud et l’ouest.

## Une puissance complète
| Le domaine | Sa marque |
| **Économique** | La première économie mondiale |
| **Militaire** | Des bases sur tous les continents |
| **Technologique** | La Silicon Valley |
| **Culturelle** | Le *soft power* : cinéma, musique, marques, modes de vie |

## Un territoire qui bascule
| La région | Son évolution |
| La **Manufacturing Belt** du Nord-Est | Berceau industriel, elle décline depuis les années 1970 : la **Rust Belt**, la ceinture de la rouille. **Detroit** en est le symbole |
| La **Sun Belt**, du sud-est à la Californie | Elle **attire** : climat, coûts plus bas, hautes technologies, aéronautique, retraités |

~ Le Nord-Est industriel → le Sud et l’Ouest : population et activités suivent

## Les lieux de commandement
| La ville | Sa fonction |
| **New York** | Finance, ONU, Wall Street |
| **Washington** | Le politique |
| La **Silicon Valley** | Le numérique |
| **Los Angeles** | Hollywood |
| **Houston** | Pétrole et spatial |

## Les interfaces
Les **façades maritimes** — Atlantique, Pacifique, golfe du Mexique — et la **frontière mexicaine** concentrent les échanges. Les **maquiladoras**, usines d’assemblage côté mexicain, illustrent l’intégration des deux économies.

## Les inégalités
> Une puissance mondiale peut abriter, à quelques kilomètres l’une de l’autre, une région parmi les plus riches du monde et une ville en faillite.

L’accès aux soins et à l’éducation reste fortement lié au revenu.

## Les fragilités
Dépendance aux importations, endettement, vulnérabilité climatique — **ouragans**, incendies, sécheresses de l’Ouest —, et concurrence croissante de la **Chine**.`,
          },
          questions: [
            ['Qu’est-ce que le soft power ?', ['La capacité d’influencer par la culture et les modes de vie', 'La puissance militaire', 'La puissance économique', 'La puissance démographique'], 0, 'Cinéma, musique, marques.'],
            ['Comment appelle-t-on l’ancienne région industrielle du Nord-Est en déclin ?', ['La Rust Belt', 'La Sun Belt', 'La Corn Belt', 'La Bible Belt'], 0, 'Anciennement la Manufacturing Belt.'],
            ['Qu’est-ce que la Sun Belt ?', ['La région du sud et de l’ouest qui attire population et activités', 'La région industrielle du Nord-Est', 'La côte Atlantique', 'La région des Grands Lacs'], 0, 'Climat, coûts bas, hautes technologies.'],
            ['Quelle région concentre le numérique aux États-Unis ?', ['La Silicon Valley', 'Detroit', 'Houston', 'Washington'], 0, 'En Californie.'],
            ['Que sont les maquiladoras ?', ['Des usines d’assemblage du côté mexicain de la frontière', 'Des exploitations agricoles', 'Des ports américains', 'Des quartiers d’affaires'], 0, 'Elles illustrent l’intégration des deux économies.'],
            ['Quelle ville symbolise le déclin industriel américain ?', ['Detroit', 'Seattle', 'Miami', 'Denver'], 0, 'Au cœur de la Rust Belt.'],
            ['Quelle est la principale concurrence des États-Unis aujourd’hui ?', ['La Chine', 'Le Canada', 'Le Brésil', 'L’Australie'], 0, 'S’y ajoutent l’endettement et la vulnérabilité climatique.'],
            ['Le territoire des États-Unis est uniformément riche.', ['Vrai', 'Faux'], 1, 'Métropoles dynamiques et régions déclassées y coexistent.'],
          ],
        },
        {
          titre: 'Les dynamiques d’un grand ensemble géographique africain',
          axe: 'Des espaces transformés par la mondialisation',
          lecon: {
            titre: 'Un continent en mouvement rapide',
            cours: `Parler de « l’Afrique » comme d’un bloc est le premier contresens à éviter.

## Un continent, pas un pays
= 54 États · environ 1,4 milliard d’habitants

!> Le Maroc, le Nigeria, l’Éthiopie et l’Afrique du Sud n’ont ni la même économie, ni le même climat, ni la même histoire.

## Une démographie unique
| Le fait | Le chiffre |
| La part des moins de 15 ans | Environ **40 %** |
| La population d’ici 2050 | Elle pourrait **doubler** |

> C’est à la fois un défi — écoles, emplois, logements — et un atout : une main-d’œuvre et un marché immenses.

## Une urbanisation très rapide
Lagos, Kinshasa, Le Caire, Nairobi, Abidjan grandissent à un rythme sans équivalent. Les équipements suivent rarement, d’où l’extension des quartiers précaires.

## Des ressources considérables
| La ressource | Où |
| **Pétrole** | Nigeria, Angola |
| **Or**, **diamants** | |
| **Cobalt** et **cuivre** | RDC |
| Terres agricoles, énergie **solaire** | Partout |

!> Ces ressources sont souvent **exportées brutes** : la transformation — donc l’essentiel de la valeur — se fait ailleurs.

> Exporter un minerai brut et racheter l’objet fini, c’est vendre au prix de la matière et acheter au prix du travail.

## Une croissance réelle et inégale
~ Pas de téléphone fixe → directement le mobile → le paiement mobile (M-Pesa au Kenya) touche des populations sans compte bancaire

Plusieurs économies figurent parmi les plus dynamiques du monde. Mais la croissance profite inégalement, et la pauvreté reste massive dans plusieurs régions.

## Les difficultés
Conflits, instabilité de certains États, dépendance aux cours des matières premières, dette, effets du **changement climatique** au **Sahel** et dans la **Corne de l’Afrique**.

!> Le continent subit fortement le réchauffement **alors qu’il émet très peu** de gaz à effet de serre.

## Les intégrations
@ 2021 — La ZLECAf, zone de libre-échange continentale, entre en vigueur

L’**Union africaine** et la ZLECAf cherchent à développer le commerce **entre pays africains**, longtemps plus faible que le commerce avec l’extérieur.`,
          },
          questions: [
            ['Combien d’États compte l’Afrique ?', ['54', '20', '30', '80'], 0, 'Parler de « l’Afrique » comme d’un bloc est un contresens.'],
            ['Quelle part de la population africaine a moins de 15 ans ?', ['Environ 40 %', 'Environ 10 %', 'Environ 25 %', 'Environ 60 %'], 0, 'C’est le continent le plus jeune.'],
            ['Que pourrait-il advenir de la population africaine d’ici 2050 ?', ['Elle pourrait doubler', 'Elle devrait diminuer', 'Elle resterait stable', 'Elle triplerait'], 0, 'À la fois un défi et un atout.'],
            ['Quel est le problème principal de l’exportation de ressources brutes ?', ['La transformation, donc l’essentiel de la valeur, se fait ailleurs', 'Le transport est trop cher', 'Les ressources s’épuisent aussitôt', 'Il n’y a pas d’acheteurs'], 0, 'On vend au prix de la matière et on rachète au prix du travail.'],
            ['Quelle innovation a permis de contourner l’absence de banques dans plusieurs pays ?', ['Le paiement mobile, comme M-Pesa', 'La carte bancaire', 'Le chèque', 'Le virement postal'], 0, 'Le mobile a aussi permis de sauter l’étape du téléphone fixe.'],
            ['Qu’est-ce que la ZLECAf ?', ['La zone de libre-échange continentale africaine', 'Une organisation militaire', 'Un fleuve', 'Une banque mondiale'], 0, 'Entrée en vigueur en 2021.'],
            ['Quelle contradiction l’Afrique subit-elle face au changement climatique ?', ['Elle en subit fortement les effets tout en émettant très peu de gaz à effet de serre', 'Elle en profite économiquement', 'Elle n’est pas concernée', 'Elle émet le plus de CO₂'], 0, 'Le Sahel et la Corne de l’Afrique sont particulièrement touchés.'],
            ['Les pays africains commercent davantage entre eux qu’avec le reste du monde.', ['Vrai', 'Faux'], 1, 'C’est l’inverse — et c’est ce que la ZLECAf cherche à corriger.'],
          ],
        },
      ],
    },
  ],
}
