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
            cours: `Au XVIIIe siècle, le commerce européen change d’échelle. Les ports de l’Atlantique — **Bordeaux**, **Nantes**, **Liverpool**, **Bristol** — s’enrichissent au point de transformer leurs villes.

## Le grand commerce
Les navires rapportent des **produits coloniaux** : sucre, café, cacao, indigo, coton, tabac. Ces produits viennent des **plantations** d’Amérique et des Antilles, exploitations agricoles immenses tournées vers l’exportation.

## Le commerce triangulaire
Il relie trois continents, en trois étapes :
1. de l’**Europe** vers l’**Afrique** : armes, tissus, alcool, verroterie, échangés contre des captifs ;
2. d’**Afrique** vers l’**Amérique** : la traversée des esclaves, appelée le **passage du milieu** ;
3. d’**Amérique** vers l’**Europe** : les produits des plantations.
Chaque étape rapporte, ce qui rend l’ensemble extraordinairement rentable.

## La traite négrière
Entre le XVIe et le XIXe siècle, environ **12 millions** d’Africains sont déportés. Un sur six meurt pendant la traversée — entassement, maladies, révoltes réprimées.
Aux Antilles, le **Code Noir** (1685) définit l’esclave comme un **bien meuble** : une chose que l’on possède, vend et transmet.

> La richesse de ces ports n’est pas une réussite technique : elle repose sur la vente d’êtres humains. C’est le fait central du chapitre.

## Une nouvelle bourgeoisie
Les **négociants** et **armateurs** s’enrichissent. Sans être nobles, ils bâtissent des hôtels particuliers, achètent des terres, financent des théâtres. Ils veulent aussi peser politiquement — et cette frustration nourrira 1789.

## Les premières contestations
Des révoltes d’esclaves éclatent, et des voix s’élèvent en Europe : **Montesquieu** ironise, **Condorcet** condamne. La **Société des amis des Noirs** naît en 1788. L’abolition, elle, ne viendra qu’en 1794, sera annulée par Bonaparte en 1802, et rétablie définitivement en **1848**.`,
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
            cours: `Les **Lumières** sont un mouvement d’idées qui traverse l’Europe du XVIIIe siècle. Son principe : la **raison** doit éclairer le monde, à la place de la tradition et de l’autorité.

## Les grands noms
- **Montesquieu** (*De l’esprit des lois*, 1748) : la **séparation des pouvoirs** — exécutif, législatif, judiciaire — pour empêcher l’abus.
- **Voltaire** : la **tolérance religieuse** et la lutte contre le fanatisme ; il s’engage dans l’affaire Calas.
- **Rousseau** (*Du contrat social*, 1762) : la **souveraineté du peuple** ; l’autorité vient de ceux qui obéissent.
- **Diderot** et **d’Alembert** : l’**Encyclopédie** (1751-1772), 28 volumes réunissant tout le savoir pour le diffuser.

## Ce qu’ils réclament
Liberté d’expression, liberté de conscience, **égalité devant la loi**, justice équitable, fin de la torture et de l’arbitraire. Ils critiquent la **monarchie absolue**, les privilèges et l’intolérance.

## Comment les idées circulent
- les **salons**, tenus souvent par des femmes ;
- les **cafés**, les **académies**, les **loges maçonniques** ;
- les livres, souvent imprimés à l’étranger pour échapper à la **censure**, et vendus sous le manteau.

> Une idée interdite ne cesse pas de circuler : elle circule plus cher, et plus vite.

## Le despotisme éclairé
Certains souverains — **Frédéric II** de Prusse, **Catherine II** de Russie, **Joseph II** d’Autriche — se disent inspirés des Lumières et réforment : tolérance, codes de lois, écoles. Mais ils gardent **tout le pouvoir**. On parle de **despotisme éclairé**.

## La portée
Ces idées inspirent la **Déclaration d’indépendance américaine** (1776) puis la **Révolution française** (1789). Elles fondent encore nos textes sur les droits de l’homme.`,
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
            cours: `## La société d’Ancien Régime
Le royaume est divisé en **trois ordres** : le **clergé**, la **noblesse** — privilégiés, exemptés de l’essentiel des impôts — et le **tiers état**, 98 % de la population, qui paie.

## La crise
Les finances royales sont ruinées (guerres, train de la cour). Les récoltes de 1788 sont mauvaises : le pain, base de l’alimentation, devient hors de prix. **Louis XVI** convoque les **États généraux**, réunis à Versailles le **5 mai 1789**.

## Les journées décisives
- **17 juin** : les députés du tiers état se proclament **Assemblée nationale**.
- **20 juin** : le **serment du Jeu de paume** — ne pas se séparer avant d’avoir donné une constitution à la France.
- **14 juillet** : la prise de la **Bastille**, prison-symbole de l’arbitraire royal.
- **été** : la **Grande Peur** dans les campagnes, châteaux attaqués.
- **4 août** : abolition des **privilèges**.
- **26 août** : la **Déclaration des droits de l’homme et du citoyen**.

## La Déclaration
Elle pose que « les hommes naissent et demeurent libres et égaux en droits ». Liberté, propriété, sûreté, résistance à l’oppression ; la **souveraineté** appartient à la Nation, la **loi** est l’expression de la volonté générale.
Elle ne concerne toutefois ni les femmes, ni les esclaves des colonies — ce que dénoncera **Olympe de Gouges** dès 1791.

> Un texte peut être immense et incomplet en même temps. Ses limites ont servi d’argument à ceux qui les ont ensuite fait tomber.

## La monarchie constitutionnelle
La **Constitution de 1791** limite le pouvoir du roi, qui garde un **droit de veto**. Le suffrage est **censitaire** : seuls les hommes payant un certain impôt votent.`,
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
            cours: `## La rupture
En **juin 1791**, le roi tente de fuir : c’est la **fuite à Varennes**. Arrêté, il perd la confiance du pays. La **guerre** est déclarée en avril 1792 à l’Autriche, et les défaites nourrissent le soupçon de trahison.

## La République
- **10 août 1792** : les Tuileries sont prises, le roi est suspendu.
- **22 septembre 1792** : proclamation de la **Première République**.
- **21 janvier 1793** : **Louis XVI est guillotiné** après un procès devant la Convention.

## La Terreur (1793-1794)
La République est menacée de toutes parts : guerre aux frontières, insurrection en **Vendée**, révoltes fédéralistes. Le **Comité de salut public**, dominé par **Robespierre**, gouverne par l’exception.
- **loi des suspects** : on peut être arrêté sur simple soupçon ;
- **tribunal révolutionnaire** et exécutions massives — environ **17 000** condamnations à mort, des dizaines de milliers de morts en Vendée ;
- **levée en masse**, réquisitions, maximum des prix.

> La Terreur est faite au nom de la liberté, contre des gens jugés sans preuve. C’est le paradoxe que le chapitre doit laisser intact, pas résoudre.

## Les avancées de la Convention
Malgré tout : abolition de l’**esclavage** (février 1794), **suffrage universel masculin** dans la Constitution de 1793 (jamais appliquée), instruction publique, **système métrique**.

## La chute
Le **9 thermidor an II** (27 juillet 1794), Robespierre est renversé et exécuté. Le **Directoire** lui succède (1795-1799), régime instable, jusqu’au coup d’État du **18 brumaire** (9 novembre 1799).`,
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
            cours: `## La prise du pouvoir
Général victorieux en Italie et en Égypte, **Napoléon Bonaparte** renverse le Directoire lors du coup d’État du **18 brumaire an VIII** (9 novembre 1799). Il devient **Premier consul**, puis **consul à vie** (1802), puis se fait sacrer **empereur** le **2 décembre 1804**.

## Ce qu’il consolide
- Le **Code civil** (1804) : égalité devant la loi, propriété garantie, laïcité de l’état civil. Il inspire encore le droit de dizaines de pays.
- La **Banque de France**, le **franc germinal**, une monnaie stable.
- Les **préfets**, l’administration centralisée, le **cadastre**.
- Les **lycées** et la Légion d’honneur : une élite recrutée au mérite.
- Le **Concordat** (1801) rétablit la paix religieuse.

## Ce qu’il supprime
- La **liberté de la presse** : journaux censurés, opposants surveillés.
- Les **élections** réelles : les plébiscites approuvent, ils ne choisissent pas.
- Le **rétablissement de l’esclavage** en 1802, annulant l’abolition de 1794.
- Le Code civil place la **femme mariée** sous l’autorité de son mari.

> Napoléon garde de la Révolution ce qui rend un État fort — l’égalité devant la loi, l’administration — et supprime ce qui limite le pouvoir. C’est la clé du chapitre.

## L’Empire et sa chute
Austerlitz (1805), Iéna, Wagram : l’Europe est dominée. Mais la guerre d’**Espagne** s’enlise, la campagne de **Russie** (1812) tourne au désastre. Vaincu à **Leipzig** (1813) puis à **Waterloo** (**1815**), il est exilé à Sainte-Hélène.

## L’héritage
Le **congrès de Vienne** (1815) rétablit les rois, mais le Code civil, l’administration et l’idée de nation restent — ils traverseront tout le XIXe siècle.`,
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
            cours: `## Le point de départ
La **révolution industrielle** commence en **Angleterre** vers 1780 et gagne l’Europe continentale au XIXe siècle. Son moteur : la **machine à vapeur** de **James Watt**, le **charbon** et le **fer**.

## Les deux âges
- **Première industrialisation** (fin XVIIIe - milieu XIXe) : charbon, vapeur, textile, sidérurgie, **chemin de fer**.
- **Seconde industrialisation** (à partir de 1870) : **électricité**, **pétrole**, moteur à explosion, chimie, acier.

## L’usine et la ville
La **fabrique** remplace l’atelier : on rassemble machines et ouvriers en un même lieu, on travaille à l’heure et non à la tâche. Les campagnes se vident, les villes industrielles explosent — **exode rural**.

## Le chemin de fer
Il change les distances, les prix et jusqu’à l’heure : c’est pour lui qu’on adopte une **heure unique** par pays. Il permet d’acheminer charbon et minerai, donc d’industrialiser plus loin.

## Le capitalisme
Des **banques** et des **sociétés par actions** rassemblent les capitaux nécessaires. Une **bourgeoisie d’affaires** — industriels, banquiers — devient la classe dominante, devant l’aristocratie foncière.

> Ce n’est pas seulement une révolution technique : c’est une révolution de l’ORGANISATION — du capital, du travail et du temps.

## Le coût humain
Journées de 12 à 15 heures, **travail des enfants**, salaires bas, accidents, logements insalubres. La France limite le travail des enfants en **1841**, sans grands moyens de contrôle.

## Les réactions
Naissent le **syndicalisme**, les grèves, et deux courants de pensée : le **socialisme** — dont **Marx** et Engels avec le *Manifeste du parti communiste* (1848) — et le **catholicisme social**.`,
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
            cours: `## Une société qui se recompose
L’industrialisation crée deux groupes neufs, qui vivent dans la même ville sans se croiser :
- la **bourgeoisie** : industriels, banquiers, commerçants, professions libérales. Elle possède les entreprises, habite les beaux quartiers, décide.
- le **prolétariat** : les ouvriers, qui ne possèdent que leur **force de travail** et la vendent contre un salaire.

## La vie ouvrière
Journées longues, salaires bas, aucune protection en cas d’accident, de maladie ou de vieillesse. Femmes et enfants sont employés parce qu’ils coûtent moins cher. Les **quartiers ouvriers** sont surpeuplés, sans eau courante ni égouts — d’où les épidémies de **choléra**.

## La bourgeoisie
Elle affiche sa réussite : appartements haussmanniens, domesticité, éducation des enfants, villégiature. Elle impose ses **valeurs** — travail, épargne, mérite, respectabilité.

## Les classes moyennes
Entre les deux : employés, instituteurs, petits commerçants, contremaîtres. Elles grandissent avec l’administration et le commerce.

## Les idées neuves
- Le **libéralisme économique** : l’État doit laisser faire le marché.
- Le **socialisme** : partager les moyens de production ; **Marx** annonce la lutte des classes.
- Le **catholicisme social** : l’Église reconnaît la « question ouvrière » (*Rerum novarum*, 1891).
- L’**anarchisme** : supprimer l’État lui-même.

> La question qui traverse tout le siècle tient en une phrase : à qui profite la richesse produite ?

## Les conquêtes
Peu à peu : droit de **grève** en France (**1864**), liberté **syndicale** (**1884**), limitation du temps de travail, repos hebdomadaire (1906), premières retraites. Rien n’est donné : tout est arraché par la mobilisation.`,
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
            cours: `## L’expansion
Entre 1850 et 1914, les puissances européennes — **Royaume-Uni**, **France**, mais aussi Allemagne, Belgique, Italie, Portugal — conquièrent l’Afrique et une grande partie de l’Asie. En 1914, l’Europe contrôle environ **85 %** des terres émergées.

## Les motifs
- **Économiques** : matières premières, débouchés commerciaux, placements.
- **Politiques** : prestige, rivalités entre puissances, points d’appui militaires.
- **Idéologiques** : la prétendue « **mission civilisatrice** », adossée à des théories racistes qui hiérarchisent les peuples.

## La conférence de Berlin (1884-1885)
Les puissances européennes s’y partagent l’**Afrique** — sans qu’aucun Africain soit présent. Les frontières y sont tracées à la règle, ignorant peuples et royaumes existants. Beaucoup sont encore en place, et beaucoup de conflits actuels en découlent.

> Une carte dessinée en Europe par des gens qui n’avaient jamais vu les lieux organise encore la géographie politique d’un continent.

## La société coloniale
Elle est **hiérarchisée** : les colons européens détiennent le pouvoir et la terre ; les colonisés sont soumis à un statut d’**indigène**, sans droits politiques, astreints au **travail forcé**, à l’**impôt** et au **code de l’indigénat**.

## Ce que la colonisation apporte, et à qui
Routes, ports, chemins de fer, écoles, dispensaires — mais construits d’abord pour l’**exportation** et pour une minorité. Les cultures vivrières reculent devant les cultures d’exportation, ce qui fragilise l’alimentation.

## Les résistances
Elles existent partout et dès le départ : **Abd el-Kader** en Algérie, **Samory Touré** en Afrique de l’Ouest, la révolte des **Cipayes** en Inde (1857), la guerre des **Herero** en Namibie. Elles sont réprimées, parfois avec une extrême violence.`,
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
            cours: `## Un siècle de régimes
La France change six fois de régime en soixante ans :
- **Restauration** (1815-1830) : Louis XVIII puis Charles X, monarchie constitutionnelle, suffrage **censitaire** très étroit (environ **100 000** électeurs).
- **Monarchie de Juillet** (1830-1848) : Louis-Philippe, après les **Trois Glorieuses** ; le cens baisse, on passe à ~240 000 électeurs.
- **Deuxième République** (1848-1852) : le **suffrage universel masculin** est proclamé — de 240 000 à **9 millions** d’électeurs d’un coup. L’**esclavage** est aboli.
- **Second Empire** (1852-1870) : Napoléon III garde le suffrage universel mais l’encadre par la **candidature officielle** et la censure.
- **Troisième République**, à partir de 1870.

## Ce que « voter » veut dire
Le suffrage **censitaire** réserve le vote à ceux qui paient un impôt élevé : voter est un privilège de fortune. Le suffrage **universel masculin** en fait un droit — pour les hommes seulement. Les **femmes** attendront **1944**.

> Le mot « universel » de 1848 excluait la moitié du pays. Il a fallu presque un siècle pour qu’il devienne vrai.

## Comment on arrache le droit
Par les **révolutions** — 1830, 1848 — les **barricades**, la presse, les banquets républicains contournant l’interdiction de réunion. Chaque avancée suit une crise, aucune n’est offerte.

## Le vote lui-même
Longtemps public, donc surveillé. L’**isoloir** et l’enveloppe n’arrivent qu’en **1913** : jusque-là, on pouvait voir pour qui votait un ouvrier ou un métayer.

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
            cours: `## Une naissance difficile
La République est proclamée le **4 septembre 1870**, après la défaite de Sedan contre la Prusse. Elle débute par une guerre perdue, la perte de l’**Alsace-Moselle**, et l’écrasement de la **Commune de Paris** (mars-mai 1871). Les monarchistes sont majoritaires à l’Assemblée : la République s’impose d’un cheveu, par l’**amendement Wallon** (1875), à **une voix**.

## Les grandes lois qui l’enracinent
- **1881-1882** — lois **Jules Ferry** : école primaire **gratuite**, **laïque** et **obligatoire** de 6 à 13 ans.
- **1881** : liberté de la **presse** et de **réunion**.
- **1884** : liberté **syndicale** ; les communes élisent leur maire.
- **1901** : liberté d’**association**.
- **1905** : **séparation des Églises et de l’État** — la laïcité.

## L’école, instrument de la République
Elle apprend à lire et à compter, mais aussi le **français** contre les langues régionales, l’**histoire nationale** et le **civisme**. L’instituteur — le « hussard noir » — devient une figure du village, face au curé.

> Une république qui veut durer ne se contente pas de lois : elle forme ses citoyens. C’est le sens de l’école obligatoire.

## Les symboles
**Marianne**, le **14 juillet** (fête nationale en 1880), la **Marseillaise** (hymne en 1879), la devise **Liberté, Égalité, Fraternité**, les mairies et leurs monuments aux morts.

## Les crises traversées
Le **boulangisme**, le scandale de **Panama**, et surtout l’**affaire Dreyfus** (1894-1906) : un officier juif condamné à tort, défendu par **Zola** (« J’accuse… ! », 1898). La France se déchire, la République tient — et en sort renforcée dans son attachement à la justice.

## Ce qui reste inachevé
Les femmes ne votent pas, l’empire colonial contredit les principes proclamés, et les inégalités sociales demeurent.`,
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
            cours: `## Le cadre juridique
Le **Code civil** de 1804 place la femme mariée sous l’autorité de son mari : elle lui doit obéissance, ne peut ni travailler, ni ouvrir un compte, ni signer un contrat sans son autorisation. Elle est juridiquement une **incapable majeure**.
Le **divorce**, autorisé en 1792, est supprimé en 1816 — il ne reviendra qu’en **1884**.

## Le travail des femmes
Il est massif, et invisible. Ouvrières du textile, domestiques, blanchisseuses, paysannes, ouvrières à domicile : elles sont partout, payées **moitié moins** qu’un homme pour le même travail, au motif que leur salaire ne serait qu’un « appoint ».

## Selon les milieux
- **Bourgeoises** : cantonnées au foyer, à l’éducation des enfants et à la représentation ; l’oisiveté affichée est un signe de richesse du mari.
- **Ouvrières et paysannes** : double journée, travail et famille, sans aucune protection.

> Le XIXe siècle a inventé l’idée que la place des femmes serait « naturellement » au foyer — au moment précis où des millions d’entre elles travaillaient en usine.

## Les avancées
- **1861** : Julie-Victoire Daubié, première femme **bachelière**.
- **1880** : loi **Camille Sée**, lycées de filles.
- **1881-1882** : l’école primaire devient obligatoire **pour les deux sexes**.
- **1884** : rétablissement du divorce.
- **1907** : les femmes mariées peuvent disposer de leur **salaire**.

## Le combat pour le droit de vote
Les **suffragistes** — **Hubertine Auclert** en France, les *suffragettes* au Royaume-Uni — réclament le vote dès les années 1870. Refusé par le Sénat à plusieurs reprises, il ne sera accordé qu’en **1944**, la France arrivant très en retard sur ses voisins.`,
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
            cours: `## Le basculement
Depuis **2007**, plus de la moitié de l’humanité vit en ville ; on approche des **60 %** aujourd’hui. C’est l’**urbanisation** : la part des citadins augmente, et les villes s’étendent.

## Où ça se passe
La croissance urbaine est aujourd’hui portée par les pays **en développement**, surtout en **Asie** et en **Afrique**. Les villes des pays développés, plus anciennes, croissent lentement.

## Les formes de la ville
- Le **centre** : services, commerces, patrimoine, souvent le quartier le plus cher.
- Le **quartier d’affaires** (CBD) : tours de bureaux.
- Les **banlieues** et les **périphéries**, en couronnes.
- L’**étalement urbain** : la ville grignote les campagnes.

## Les grands ensembles
- **Mégapole** : plus de 10 millions d’habitants. Tokyo, Delhi, Shanghai, São Paulo, Lagos.
- **Mégalopole** : un chapelet continu de villes reliées — BosWash aux États-Unis, la mégalopole japonaise, la dorsale européenne.

## Des paysages contrastés dans la même ville
Tours de verre et **bidonvilles** (favelas, slums) coexistent parfois à quelques centaines de mètres. Environ **un milliard** de personnes vivent en habitat précaire.

> Une ville qui grandit vite ne devient pas riche partout en même temps : elle fabrique du contraste avant de fabriquer du confort.

## Les défis
Logement, transports, eau, déchets, pollution de l’air, **îlot de chaleur urbain**, préservation des terres agricoles. Les réponses passent par la densification, les transports collectifs et la végétalisation.`,
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
            cours: `## La hiérarchie urbaine
Les villes ne se valent pas : quelques-unes **commandent** l’économie mondiale, d’autres ne rayonnent que sur leur région. Ce classement dépend de leurs **fonctions** — bourses, sièges sociaux, universités, aéroports, institutions internationales.

## Les villes mondiales
**New York**, **Londres**, **Tokyo**, **Paris**, **Shanghai**, **Singapour**, Hong Kong, Dubaï. Elles concentrent la finance, les décisions et les flux, et sont reliées entre elles bien plus étroitement qu’à leur propre arrière-pays.

## Ce qui fait la connexion
- Les **aéroports** internationaux (hubs) ;
- les **ports** à conteneurs ;
- les **câbles sous-marins**, qui portent l’essentiel d’internet ;
- les sièges de **firmes transnationales** et les places boursières.

## Les villes à l’écart
Beaucoup de villes — en Afrique subsaharienne, en Asie centrale, à l’intérieur des continents — grandissent vite sans être reliées à ces réseaux. Elles concentrent alors la population sans concentrer la richesse.

> La mondialisation ne relie pas des pays : elle relie des VILLES, et elle en laisse beaucoup de côté.

## L’effet sur les territoires
Une métropole bien connectée attire emplois, étudiants et capitaux, souvent au détriment des villes moyennes de son propre pays : c’est la **métropolisation**.

## La compétition
Les villes se font concurrence pour attirer entreprises, congrès, grands événements — Jeux olympiques, expositions universelles — quitte à s’endetter pour des équipements dont l’usage après coup n’est pas garanti.`,
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
            cours: `## Les chiffres
Environ **280 millions** de personnes vivent hors de leur pays de naissance, soit **3,5 %** de l’humanité. C’est une part faible — mais en hausse, et très inégalement répartie.

## Le vocabulaire
- **Migrant** : celui qui quitte son pays pour s’installer ailleurs.
- **Émigrer**, c’est partir de ; **immigrer**, c’est arriver dans.
- **Réfugié** : personne fuyant un danger, protégée par la **convention de Genève** (1951).
- **Demandeur d’asile** : celui dont la demande de protection est en cours d’examen.
- **Diaspora** : la communauté dispersée d’un même peuple.

## Les causes
- **Économiques** : chercher du travail, un meilleur salaire — la cause majoritaire.
- **Politiques** : guerres, persécutions, dictatures.
- **Familiales** : rejoindre un proche.
- **Étudiantes**.
- **Environnementales** : sécheresses, montée des eaux, catastrophes — en forte hausse.

## Les idées reçues à corriger
La majorité des migrations se font **entre pays voisins**, et non des pays pauvres vers les pays riches. Et la majorité des réfugiés sont accueillis par des **pays en développement**, pas par l’Europe.

> Ce que l’on croit être un mouvement du Sud vers le Nord est d’abord un mouvement du Sud vers le Sud.

## Les routes et leurs dangers
Traverser la Méditerranée, le Sahara, le désert entre Mexique et États-Unis : ces routes tuent chaque année des milliers de personnes, et alimentent des réseaux de passeurs.

## Les effets
Pour le pays de départ : perte de main-d’œuvre et de diplômés (**fuite des cerveaux**), mais aussi **transferts d’argent** — plusieurs fois le montant de l’aide au développement. Pour le pays d’arrivée : apport de main-d’œuvre, de compétences, de jeunesse — et des débats politiques vifs.`,
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
            cours: `## L’ampleur
Le **tourisme** est le premier flux de personnes de la planète : plus d’**un milliard** de touristes internationaux par an avant 2020, et bien davantage de touristes internes. C’est une industrie majeure, parfois la première ressource d’un pays.

## Qui voyage
Surtout les habitants des pays **développés** et des classes moyennes émergentes — Chine, Inde, Brésil. Voyager suppose du **temps libre**, un **revenu** et un **passeport** utile : le tourisme est un marqueur d’inégalité mondiale.

## Les grands espaces touristiques
- Les **littoraux** chauds : Méditerranée, Caraïbes, Asie du Sud-Est.
- La **montagne** : ski l’hiver, randonnée l’été.
- Les **villes d’art** : Paris, Rome, Venise, Kyoto.
- Les espaces **naturels** protégés : parcs nationaux, safaris.

## Les aménagements
Hôtels, resorts, marinas, remontées mécaniques, aéroports, parcs à thème. Le tourisme **fabrique** des paysages entiers — parfois de toutes pièces, comme à Dubaï ou à Cancún.

## Les effets positifs
Emplois, devises, entretien du patrimoine, désenclavement de certaines régions.

## Les effets négatifs
- **Emplois saisonniers** et souvent peu qualifiés ;
- **bétonisation** des littoraux, pression sur l’eau et les déchets ;
- **surtourisme** : Venise, Barcelone, Machu Picchu, où les habitants sont chassés par les prix ;
- **dépendance** d’un pays à un secteur très sensible aux crises.

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
            cours: `## La maritimisation
Environ **80 %** du commerce mondial de marchandises voyage par la **mer**. C’est la **maritimisation** : la mondialisation dépend des océans.

## Le conteneur, l’objet qui a tout changé
Inventé dans les années 1950, la **boîte** standardisée permet de charger, transporter et décharger sans manipuler la marchandise. Le coût du transport s’effondre — c’est ce qui rend possible de fabriquer en Asie pour vendre en Europe.

## Les routes et les points de passage
Les **détroits** et **canaux** sont des goulets stratégiques : **Suez**, **Panama**, **Malacca**, **Ormuz**, Gibraltar, Bab el-Mandeb. Un incident sur l’un d’eux — un porte-conteneurs en travers de Suez — se répercute sur l’économie mondiale en quelques jours.

## Les ports
Les plus grands sont en **Asie** : Shanghai, Singapour, Ningbo, Shenzhen. Rotterdam est le premier européen. Ils exigent des **eaux profondes**, des terminaux automatisés et des liaisons terrestres.

## Les ressources
- **Pêche** : nourrit des centaines de millions de personnes, mais **un tiers** des stocks est surexploité.
- **Énergie** : pétrole et gaz offshore, éolien en mer.
- **Minerais** des grands fonds, encore peu exploités.

## Les tensions
Qui possède la mer ? La convention de **Montego Bay** (1982) accorde à chaque État une **zone économique exclusive** (ZEE) de 200 milles. D’où des conflits : mer de Chine méridionale, Arctique dont la fonte ouvre de nouvelles routes.

> La France possède la **deuxième ZEE du monde**, grâce à ses territoires ultramarins. Sa puissance maritime ne se lit pas sur la carte de l’Hexagone.

## Les menaces
Pollutions, **plastiques**, dégazages, acidification, réchauffement, piraterie. Les océans absorbent une grande part du CO₂ et de la chaleur — ce qui les protège n’est pas un luxe.`,
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
            cours: `## Une puissance complète
Les **États-Unis** sont la première économie mondiale et une puissance **complète** : économique, militaire, technologique et **culturelle** — c’est le *soft power*, la capacité d’influencer par le cinéma, la musique, les marques et les modes de vie.

## Un territoire qui bascule vers le sud et l’ouest
- La **Manufacturing Belt** du Nord-Est, berceau industriel, décline à partir des années 1970 : on la surnomme la **Rust Belt**, la ceinture de la rouille. Detroit en est le symbole.
- La **Sun Belt** — du sud-est à la Californie — attire population et activités : climat, coûts plus bas, hautes technologies, aéronautique, retraités.

## Les lieux de commandement
**New York** (finance, ONU, Wall Street), **Washington** (politique), la **Silicon Valley** (numérique), **Los Angeles** (Hollywood), **Houston** (pétrole, spatial).

## Les interfaces
Les **façades maritimes** (Atlantique, Pacifique, Golfe du Mexique) et la **frontière mexicaine** concentrent les échanges. Les **maquiladoras** — usines d’assemblage côté mexicain — illustrent l’intégration des deux économies.

## Les inégalités
Le territoire est très inégal : métropoles dynamiques et régions déclassées, ghettos urbains et banlieues riches, et un accès aux soins et à l’éducation fortement lié au revenu.

> Une puissance mondiale peut abriter, à quelques kilomètres l’une de l’autre, une région parmi les plus riches du monde et une ville en faillite.

## Les fragilités
Dépendance aux importations, endettement, vulnérabilité climatique (**ouragans**, incendies, sécheresses de l’Ouest), et concurrence croissante de la **Chine**.`,
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
            cours: `## Un continent, pas un pays
L’**Afrique** compte **54 États** et environ **1,4 milliard** d’habitants. Parler de « l’Afrique » comme d’un bloc est le premier contresens à éviter : le Maroc, le Nigeria, l’Éthiopie et l’Afrique du Sud n’ont ni la même économie, ni le même climat, ni la même histoire.

## Une démographie unique
C’est le continent le plus **jeune** : environ **40 %** de la population a moins de 15 ans. Sa population pourrait **doubler d’ici 2050**. C’est à la fois un défi — écoles, emplois, logements — et un atout : une main-d’œuvre et un marché immenses.

## Une urbanisation très rapide
Lagos, Kinshasa, Le Caire, Nairobi, Abidjan grandissent à un rythme sans équivalent. Les équipements suivent rarement, d’où l’extension des quartiers précaires.

## Des ressources considérables
Pétrole (Nigeria, Angola), or, diamants, cobalt et cuivre (RDC), terres agricoles, énergie solaire. Mais ces ressources sont souvent **exportées brutes** : la transformation — donc l’essentiel de la valeur — se fait ailleurs.

> Exporter un minerai brut et racheter l’objet fini, c’est vendre au prix de la matière et acheter au prix du travail.

## Une croissance réelle et inégale
Plusieurs économies figurent parmi les plus dynamiques du monde. Le **téléphone mobile** a permis de sauter l’étape du fixe, et le paiement mobile (M-Pesa au Kenya) touche des populations sans compte bancaire.
Mais la croissance profite inégalement, et la pauvreté reste massive dans plusieurs régions.

## Les difficultés
Conflits, instabilité de certains États, dépendance aux cours des matières premières, dette, effets du **changement climatique** (Sahel, Corne de l’Afrique) — alors que le continent émet très peu de gaz à effet de serre.

## Les intégrations
L’**Union africaine** et la **ZLECAf** — zone de libre-échange continentale entrée en vigueur en 2021 — cherchent à développer le commerce **entre pays africains**, longtemps plus faible que le commerce avec l’extérieur.`,
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
