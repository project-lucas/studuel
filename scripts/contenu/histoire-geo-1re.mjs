// Histoire-Géographie — Première : LE PROGRAMME COMPLET (43 fiches).
//
// CE QUE REMPLACE CE MODULE. Sondé le 19/08/2026 (node
// _ASSOCIE/sonde-chapitres.mjs 1re histoire-geo) : la Première n'avait que CINQ
// chapitres, hérités du tout premier jeu de données — « L'Europe face aux
// révolutions », « La Troisième République », « La Grande Guerre et la fin des
// empires », « La métropolisation », « Les espaces productifs français ». Cinq
// titres pour un programme qui en compte quinze, et deux leçons génériques par
// chapitre (« L'essentiel du cours », « Exercices types ») : un élève de 1re qui
// révisait le Second Empire, la question sociale, les sociétés coloniales, les
// espaces ruraux ou la Chine ne trouvait rien.
//
// LE DÉCOUPAGE. Les 15 chapitres du programme (6 d'histoire, 9 de géographie),
// éclatés en leurs 43 fiches. Chaque fiche est un chapitre en base ; le
// CHAPITRE du programme est porté par `axe` (colonne `chapters.theme`), qui fait
// grouper la page matière — cf. docs/template-matiere.md. L'histoire occupe les
// positions 1 à 20, la géographie 21 à 43 : les deux matières partagent le même
// dossier, comme en classe.
//
// LES CINQ ANCIENS PARTENT (voir `menage`). « L'Europe face aux révolutions »
// et « La Troisième République » sont désormais des CHAPITRES du programme, pas
// des fiches : les laisser en base ferait deux objets du même nom à deux places
// différentes. Le ménage est borné à leurs cinq titres exacts et au seul niveau
// 1re — rejoué, il ne trouve plus rien et ne touche jamais les 43 fiches neuves.
//
// ⚠️ Le slug reste `histoire-geo` (la matière existe depuis 008). Comme
// `histoire-geo-tle.mjs` et `geographie-tle.mjs`, ce module se génère par
// `--modules histoire-geo-1re` : `--slugs histoire-geo` fusionnerait les trois
// et réécrirait deux migrations déjà exécutées.

export default {
  slug: 'histoire-geo',
  nom: 'Histoire-Géographie',

  titreMigration: 'HISTOIRE-GÉOGRAPHIE 1re — LE PROGRAMME COMPLET (43 fiches)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs 1re histoire-geo,
19/08/2026) : la Première n'avait que CINQ chapitres, hérités du premier jeu de
données de l'app, avec deux leçons génériques chacun. Le programme officiel en
compte QUINZE — six d'histoire (de la Révolution française à la sortie de la
Grande Guerre) et neuf de géographie (métropolisation, espaces productifs,
espaces ruraux, plus les études sur la France et la Chine) — soit 43 fiches.
Un élève de 1re qui révisait le Second Empire, la question sociale, les
sociétés coloniales, les espaces ruraux ou les recompositions chinoises ne
trouvait RIEN. Cette migration installe les 43 fiches, rangées sous leurs 15
chapitres, et retire les 5 fiches génériques que ce découpage recouvre.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 43 fiches sous 15 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que la 234 n'a jamais été
exécutée en production (sondé le 19/08/2026) — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 5 anciens chapitres
déjà supprimés et les 43 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 chapitres hérités partent. Deux d'entre eux ("L'Europe face aux
révolutions", "La Troisième République") deviennent des CHAPITRES du programme :
les garder en base ferait deux objets du même nom à deux places différentes, un
en-tête de section et une ligne dans la liste. Les trois autres sont des fiches
de synthèse que les 43 neuves recouvrent entièrement.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.
Les trois DELETE sont bornés aux CINQ TITRES EXACTS et au seul niveau 1re. Sans
cette borne, un rejeu après coup effacerait les quiz des 43 fiches neuves — le
ménage tourne avant les insertions à CHAQUE passage.`,
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
   AND c.level = '1re'
   AND c.title IN ('L''Europe face aux révolutions',
                   'La Troisième République',
                   'La Grande Guerre et la fin des empires',
                   'La métropolisation',
                   'Les espaces productifs français');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '1re'
   AND c.title IN ('L''Europe face aux révolutions',
                   'La Troisième République',
                   'La Grande Guerre et la fin des empires',
                   'La métropolisation',
                   'Les espaces productifs français');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '1re'
   AND c.title IN ('L''Europe face aux révolutions',
                   'La Troisième République',
                   'La Grande Guerre et la fin des empires',
                   'La métropolisation',
                   'Les espaces productifs français');`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      chapitres: [
        // ===================================================================
        // HISTOIRE — Chapitre 1 : L'Europe face aux révolutions
        // ===================================================================
        {
          titre: 'La Révolution française : une nouvelle conception de la nation reposant sur la citoyenneté (1789-1799)',
          axe: 'L’Europe face aux révolutions',
          lecon: {
            titre: 'De sujets du roi à citoyens de la nation',
            cours: `En dix ans, la France passe d’une société d’ordres où l’on naît sujet à une nation d’individus égaux devant la loi. C’est cette bascule que le programme appelle « une nouvelle conception de la nation ».

## 1789 : la fin de la société d’ordres
Convoqués en mai 1789 pour résoudre la crise financière, les États généraux se transforment : le tiers état se proclame **Assemblée nationale** (17 juin), puis prête le **serment du Jeu de paume** (20 juin). La nuit du **4 août** abolit les privilèges, et la **Déclaration des droits de l’homme et du citoyen** (26 août) pose l’égalité en droits et la souveraineté de la nation.

## La souveraineté change de mains
La Constitution de 1791 fait du roi le chef d’une **monarchie constitutionnelle**, mais distingue citoyens actifs (qui votent) et passifs : l’égalité proclamée n’est pas encore l’égalité politique. La fuite à Varennes (juin 1791) ruine la confiance ; la guerre déclarée en avril 1792 et la journée du 10 août 1792 emportent la royauté.

> La nation n’est plus l’ensemble des sujets d’un roi : elle est le corps des citoyens, seul détenteur de la souveraineté.

## La République, la guerre et la Terreur
Proclamée le 22 septembre 1792, la Ire République juge et exécute Louis XVI (janvier 1793). Menacée aux frontières et en Vendée, elle bascule dans la **Terreur** (1793-1794) : Comité de salut public, loi des suspects, quelque 17 000 condamnations à mort. La chute de Robespierre (9 thermidor an II) ouvre le **Directoire** (1795-1799), régime censitaire et instable.

## Ce qui reste en 1799
L’égalité civile, la propriété, l’état civil laïque, la vente des biens nationaux, la nation en armes. Mais aussi une question non tranchée : comment fonder un régime stable sur la souveraineté du peuple ?`,
          },
          questions: [
            ['Que proclame le tiers état le 17 juin 1789 ?', ['Il se déclare Assemblée nationale', 'Il proclame la République', 'Il vote la Constitution civile du clergé', 'Il abolit la monarchie'], 0, 'Se dire « Assemblée nationale », c’est affirmer que la souveraineté vient de la nation, pas du roi.'],
            ['Que fait la nuit du 4 août 1789 ?', ['Elle abolit les privilèges', 'Elle exécute le roi', 'Elle déclare la guerre à l’Autriche', 'Elle rédige la Constitution'], 0, 'Les privilèges seigneuriaux et les droits féodaux tombent en une nuit.'],
            ['La Déclaration des droits de l’homme et du citoyen date d’août 1789.', ['Vrai', 'Faux'], 0, 'Elle est adoptée le 26 août 1789 et sert de préambule à la Constitution de 1791.'],
            ['Quelle distinction la Constitution de 1791 introduit-elle ?', ['Citoyens actifs et citoyens passifs', 'Nobles et roturiers', 'Girondins et Montagnards', 'Français et étrangers'], 0, 'Le droit de vote dépend d’un cens : l’égalité civile n’est pas encore politique.'],
            ['Quel événement ruine la confiance entre le roi et l’Assemblée ?', ['La fuite à Varennes', 'La prise de la Bastille', 'Le serment du Jeu de paume', 'La journée du 4 août'], 0, 'En juin 1791, Louis XVI fuit et est arrêté : le roi apparaît comme un traître à la nation.'],
            ['Quand la République est-elle proclamée ?', ['Le 22 septembre 1792', 'Le 14 juillet 1789', 'Le 21 janvier 1793', 'Le 9 thermidor an II'], 0, 'La Convention proclame la République au lendemain de la victoire de Valmy.'],
            ['Qu’est-ce que la Terreur (1793-1794) ?', ['Un gouvernement d’exception face à la guerre et à la contre-révolution', 'Une invasion étrangère', 'Une famine généralisée', 'Le retour de la monarchie'], 0, 'Le Comité de salut public suspend les libertés au nom du salut de la République.'],
            ['Quel régime succède à la Terreur ?', ['Le Directoire', 'Le Consulat', 'L’Empire', 'La Restauration'], 0, 'Le Directoire (1795-1799) est censitaire et instable : c’est lui que renverse le 18 brumaire.'],
          ],
        },
        {
          titre: 'La rupture napoléonienne ou la recherche d’un ordre politique stable : les ambiguïtés de l’héritage révolutionnaire (1799-1814)',
          axe: 'L’Europe face aux révolutions',
          lecon: {
            titre: 'Consolider la Révolution en confisquant la liberté',
            cours: `Napoléon Bonaparte prétend « clore la Révolution ». Il en garde l’égalité civile et la met en pierre, mais il en supprime la liberté politique : c’est toute l’ambiguïté de son héritage.

## Le Consulat : l’ordre après le chaos
Le coup d’État du **18 brumaire an VIII** (9 novembre 1799) porte Bonaparte au pouvoir. La Constitution de l’an VIII lui donne l’essentiel : le **plébiscite** remplace le débat, le suffrage universel masculin ne sert qu’à approuver. Consul à vie en 1802, il se fait sacrer **empereur** en 1804.

## Les masses de granit
Bonaparte fonde des institutions qui durent encore : le **Code civil** (1804), les **préfets**, la **Banque de France**, le **franc germinal**, les **lycées**, la **Légion d’honneur**, le **Concordat** de 1801 avec le pape. Toutes consacrent l’égalité devant la loi, la propriété et un État centralisé.

> L’égalité civile est gravée dans le marbre ; la liberté politique, elle, est suspendue — censure, police, assemblées sans pouvoir.

## L’Empire et l’Europe
De 1805 à 1809, Austerlitz, Iéna et Wagram font de la France la puissance dominante du continent. La Grande Armée exporte le Code civil et l’abolition de la féodalité, mais l’occupation, les réquisitions et le **Blocus continental** nourrissent des **sentiments nationaux** contre elle : Espagne (1808), Allemagne, Russie. La campagne de Russie (1812) brise l’armée ; 1814 puis Waterloo (1815) achèvent l’aventure.

## Un héritage à double face
Pour les uns, Napoléon a sauvé les acquis de 1789 ; pour les autres, il a inventé le pouvoir personnel plébiscité. Les deux lectures sont vraies, et c’est ce que le programme appelle « les ambiguïtés ».`,
          },
          questions: [
            ['Quel coup d’État porte Bonaparte au pouvoir ?', ['Le 18 brumaire an VIII', 'Le 9 thermidor an II', 'Le 10 août 1792', 'Le 2 décembre 1851'], 0, '9 novembre 1799 : le Directoire est renversé, le Consulat commence.'],
            ['Quel outil Bonaparte utilise-t-il pour faire approuver ses régimes ?', ['Le plébiscite', 'Le référendum d’initiative populaire', 'Le tirage au sort', 'Le vote censitaire'], 0, 'On répond oui ou non à un pouvoir déjà en place : la question n’est jamais débattue.'],
            ['Le Code civil date de 1804.', ['Vrai', 'Faux'], 0, 'Il fixe l’égalité devant la loi, la propriété et la famille — et s’exporte dans toute l’Europe.'],
            ['Quel accord Bonaparte signe-t-il avec le pape en 1801 ?', ['Le Concordat', 'La Constitution civile du clergé', 'L’édit de tolérance', 'La loi de séparation'], 0, 'Le Concordat rétablit la paix religieuse tout en gardant l’État maître des nominations.'],
            ['Qui administre les départements sous le Consulat et l’Empire ?', ['Les préfets', 'Les intendants', 'Les gouverneurs', 'Les députés'], 0, 'Créés en 1800, les préfets représentent l’État dans chaque département : ils existent toujours.'],
            ['Quelle mesure économique vise à asphyxier le Royaume-Uni ?', ['Le Blocus continental', 'Le Code de commerce', 'Le franc germinal', 'Le tarif extérieur commun'], 0, 'Décrété en 1806, il ferme le continent au commerce britannique — et pèse sur les peuples occupés.'],
            ['Quel effet inattendu la domination française produit-elle en Europe ?', ['Elle éveille des sentiments nationaux contre elle', 'Elle fait disparaître les monarchies', 'Elle unifie l’Europe durablement', 'Elle supprime les frontières'], 0, 'Espagne, Allemagne, Russie : l’occupation nourrit les nationalismes du XIXe siècle.'],
            ['Quelle campagne brise la Grande Armée ?', ['La campagne de Russie (1812)', 'La campagne d’Égypte', 'La bataille d’Austerlitz', 'Le siège de Toulon'], 0, 'Sur environ 600 000 hommes engagés, une infime partie revient.'],
          ],
        },
        {
          titre: 'L’Europe entre restauration et révolution (1814-1848)',
          axe: 'L’Europe face aux révolutions',
          lecon: {
            titre: 'Le congrès de Vienne contre le printemps des peuples',
            cours: `De 1814 à 1848, l’Europe est le théâtre d’un bras de fer : des souverains veulent restaurer l’ordre d’avant 1789, des peuples réclament des libertés et des nations.

## 1815 : restaurer l’ordre ancien
Le **congrès de Vienne** (1814-1815) redessine la carte au nom de la légitimité et de l’équilibre : la France revient à ses frontières de 1792, la Sainte-Alliance (Russie, Prusse, Autriche) s’engage à écraser toute révolution. Metternich, chancelier autrichien, en est l’architecte.

## Deux forces contre lui : libéralisme et nationalisme
Le **libéralisme** réclame une constitution, des libertés et un parlement. Le **nationalisme** affirme qu’un peuple partageant langue, histoire et culture a droit à un État : Grecs, Italiens, Allemands, Polonais, Hongrois. Les deux se combinent souvent — et les sociétés secrètes (carbonari) les diffusent.

> Vienne raisonne en souverains, les peuples raisonnent en nations : tout le XIXe siècle sort de ce désaccord.

## Trois vagues révolutionnaires
**1820-1821** : Espagne, Naples, Grèce (indépendance reconnue en 1830). **1830** : les Trois Glorieuses chassent Charles X en France ; la Belgique devient indépendante ; la Pologne est écrasée. **1848** : le « printemps des peuples » embrase Paris, Vienne, Berlin, Milan, Budapest — partout des constitutions arrachées, presque partout la répression l’emporte l’année suivante.

## La France de la monarchie constitutionnelle
Restauration (1814-1830) puis monarchie de Juillet (1830-1848) : le régime est parlementaire mais **censitaire**, moins de 1 % des Français votent. Le refus d’élargir le droit de vote (« la campagne des banquets ») fait tomber Louis-Philippe en février 1848.`,
          },
          questions: [
            ['Que fait le congrès de Vienne (1814-1815) ?', ['Il redessine la carte de l’Europe au nom de la légitimité et de l’équilibre', 'Il proclame le droit des peuples à disposer d’eux-mêmes', 'Il crée la Société des Nations', 'Il abolit la monarchie en Europe'], 0, 'Les vainqueurs de Napoléon organisent un ordre contre-révolutionnaire.'],
            ['Qui est l’homme fort de l’ordre de Vienne ?', ['Metternich', 'Cavour', 'Bismarck', 'Talleyrand'], 0, 'Le chancelier autrichien incarne la surveillance des mouvements libéraux et nationaux.'],
            ['Que réclame le nationalisme au XIXe siècle ?', ['Qu’un peuple uni par la langue et l’histoire dispose de son État', 'Le retour des privilèges', 'La suppression des frontières', 'Le pouvoir absolu du roi'], 0, 'C’est le principe des nationalités, qui bouscule les empires multinationaux.'],
            ['Quel pays obtient son indépendance en 1830 après une révolution ?', ['La Belgique', 'L’Italie', 'L’Allemagne', 'La Hongrie'], 0, 'La Belgique se sépare du royaume des Pays-Bas et se dote d’une constitution libérale.'],
            ['Les Trois Glorieuses de juillet 1830 renversent Charles X.', ['Vrai', 'Faux'], 0, 'Trois journées d’insurrection parisienne portent Louis-Philippe au pouvoir.'],
            ['Comment appelle-t-on les révolutions de 1848 en Europe ?', ['Le printemps des peuples', 'La Sainte-Alliance', 'La Commune', 'Le Risorgimento'], 0, 'De Paris à Budapest, les révolutions s’enchaînent en quelques semaines.'],
            ['Qu’est-ce qu’un suffrage censitaire ?', ['Seuls les citoyens payant un impôt suffisant votent', 'Tous les hommes votent', 'Le vote se fait par tirage au sort', 'Le roi désigne les électeurs'], 0, 'Sous la monarchie de Juillet, moins de 1 % des Français sont électeurs.'],
            ['Quelle mobilisation précipite la chute de Louis-Philippe ?', ['La campagne des banquets', 'La journée des Tuiles', 'La révolte des canuts', 'Le coup d’État du 2 décembre'], 0, 'Interdits, ces banquets réclamaient une réforme électorale : leur interdiction déclenche février 1848.'],
          ],
        },
        // ===================================================================
        // HISTOIRE — Chapitre 2 : La France dans l'Europe des nationalités
        // ===================================================================
        {
          titre: 'La Deuxième République (1848-1852) et les hésitations de la société française',
          axe: 'La France dans l’Europe des nationalités : politique et société (1848-1871)',
          lecon: {
            titre: 'Quatre ans pour passer de l’espoir au coup d’État',
            cours: `Née d’une révolution en février 1848, la Deuxième République meurt d’un coup d’État en décembre 1851. Entre les deux, elle invente le suffrage universel masculin — et découvre qu’il ne vote pas comme ses fondateurs l’espéraient.

## Février 1848 : la République des espérances
Le gouvernement provisoire proclame la République, instaure le **suffrage universel masculin** (mars 1848 : 9 millions d’électeurs contre 240 000 la veille), abolit l’**esclavage** dans les colonies (décret Schoelcher, 27 avril), supprime la peine de mort en matière politique et ouvre les **Ateliers nationaux** pour les chômeurs.

## Juin 1848 : la fracture sociale
La fermeture des Ateliers nationaux déclenche l’insurrection ouvrière des **journées de Juin**, écrasée par le général Cavaignac : plusieurs milliers de morts. La République sociale est vaincue par la République des notables ; la peur du « partageux » gagne les campagnes et la bourgeoisie.

> Le suffrage universel n’a pas donné la majorité aux républicains : il a donné 74 % des voix à un Bonaparte.

## Décembre 1848 : le neveu de l’Empereur
**Louis-Napoléon Bonaparte** est élu président au suffrage universel. L’Assemblée conservatrice élue en 1849 vote la loi Falloux (1850, place de l’Église dans l’enseignement) et restreint le corps électoral (mai 1850, 3 millions d’électeurs rayés).

## Le 2 décembre 1851
Ne pouvant se représenter, le président dissout l’Assemblée par un **coup d’État**, réprime la résistance (surtout dans le Sud-Est), puis fait approuver par plébiscite l’Empire, proclamé le 2 décembre 1852.`,
          },
          questions: [
            ['Quelle grande mesure politique la Deuxième République instaure-t-elle en mars 1848 ?', ['Le suffrage universel masculin', 'Le vote des femmes', 'Le suffrage censitaire', 'Le droit de grève'], 0, 'Le corps électoral passe de 240 000 à environ 9 millions d’hommes.'],
            ['Quel décret d’avril 1848 abolit l’esclavage dans les colonies françaises ?', ['Le décret Schoelcher', 'La loi Falloux', 'Le décret Cavaignac', 'La loi Le Chapelier'], 0, 'Victor Schoelcher fait adopter l’abolition définitive le 27 avril 1848.'],
            ['Qu’étaient les Ateliers nationaux ?', ['Des chantiers publics ouverts aux chômeurs', 'Des usines d’État', 'Des écoles professionnelles', 'Des ateliers d’artistes'], 0, 'Leur fermeture déclenche l’insurrection ouvrière de juin 1848.'],
            ['Les journées de Juin 1848 sont une insurrection ouvrière réprimée par l’armée.', ['Vrai', 'Faux'], 0, 'Le général Cavaignac écrase le soulèvement : la République se coupe du monde ouvrier.'],
            ['Qui est élu président de la République en décembre 1848 ?', ['Louis-Napoléon Bonaparte', 'Cavaignac', 'Lamartine', 'Ledru-Rollin'], 0, 'Il l’emporte avec près de 74 % des voix, porté par le nom de son oncle.'],
            ['Que fait la loi de mai 1850 ?', ['Elle restreint le corps électoral', 'Elle rétablit le suffrage censitaire officiellement', 'Elle donne le vote aux femmes', 'Elle abolit la présidence'], 0, 'Une condition de résidence raye près de 3 millions d’électeurs, surtout ouvriers.'],
            ['Quelle est la date du coup d’État de Louis-Napoléon Bonaparte ?', ['Le 2 décembre 1851', 'Le 18 brumaire an VIII', 'Le 24 février 1848', 'Le 4 septembre 1870'], 0, 'Un an plus tard, jour pour jour, il proclame le Second Empire.'],
            ['Quelle loi de 1850 renforce la place de l’Église dans l’enseignement ?', ['La loi Falloux', 'La loi Guizot', 'La loi Ferry', 'La loi Combes'], 0, 'Votée par l’Assemblée conservatrice, elle favorise l’enseignement congréganiste.'],
          ],
        },
        {
          titre: 'Le Second Empire (1852-1870) : un régime autoritaire au vernis démocratique',
          axe: 'La France dans l’Europe des nationalités : politique et société (1848-1871)',
          lecon: {
            titre: 'Le suffrage universel au service d’un pouvoir personnel',
            cours: `Le Second Empire garde le suffrage universel masculin et l’utilise contre la démocratie : c’est ce que le programme appelle un régime autoritaire « au vernis démocratique ».

## L’Empire autoritaire (1852-1860)
Napoléon III concentre l’exécutif : il nomme les ministres, dissout le Corps législatif, contrôle la presse par le système des **avertissements**. Les **candidatures officielles** — un candidat soutenu par les préfets, affiché sur papier blanc — font élire des députés dévoués. La surveillance policière frappe les républicains, exilés ou déportés.

## Le vernis : plébiscites et suffrage universel
Le régime ne supprime jamais le vote : il le met en scène. Les **plébiscites** (1851, 1852, 1870) donnent des majorités écrasantes, et l’empereur se dit issu du peuple. La légitimité vient des urnes, mais le débat est confisqué.

> Voter beaucoup et choisir peu : le Second Empire invente une démocratie sans libertés.

## L’Empire libéral (1860-1870)
Affaibli par ses difficultés extérieures et par la montée d’une opposition (les « Cinq » en 1857, 2 millions de voix en 1863), Napoléon III concède : droit d’adresse (1860), droit de **grève** (loi Ollivier, 1864), liberté de la presse et de réunion (1868), gouvernement responsable devant les Chambres (1870). Le plébiscite de mai 1870 le confirme largement.

## La chute
La guerre contre la Prusse et la capitulation de **Sedan** (2 septembre 1870) emportent le régime : la République est proclamée le 4 septembre.`,
          },
          questions: [
            ['Qu’est-ce qu’une candidature officielle sous le Second Empire ?', ['Un candidat soutenu et affiché par l’administration', 'Un candidat désigné par tirage au sort', 'Un candidat de l’opposition autorisé', 'Un candidat élu par le Sénat'], 0, 'Les préfets font campagne pour lui : l’élection reste libre en apparence seulement.'],
            ['Comment le régime contrôle-t-il la presse ?', ['Par un système d’avertissements pouvant mener à la suspension', 'Par la nationalisation des journaux', 'Par l’interdiction totale de la presse', 'Par une taxe sur le papier'], 0, 'Deux avertissements et le journal peut être suspendu : l’autocensure fait le reste.'],
            ['Le Second Empire supprime le suffrage universel masculin.', ['Vrai', 'Faux'], 1, 'Il le conserve et s’en sert : plébiscites et élections encadrées légitiment le pouvoir personnel.'],
            ['Quelle liberté la loi Ollivier de 1864 accorde-t-elle aux ouvriers ?', ['Le droit de grève', 'Le droit syndical', 'Les congés payés', 'La journée de huit heures'], 0, 'La grève cesse d’être un délit, mais les syndicats ne sont pas encore autorisés.'],
            ['Quelle période s’ouvre après 1860 ?', ['L’Empire libéral', 'La Restauration', 'La Terreur blanche', 'L’Ordre moral'], 0, 'Napoléon III concède des libertés pour élargir sa base politique.'],
            ['Quel plébiscite confirme largement Napoléon III quelques mois avant sa chute ?', ['Celui de mai 1870', 'Celui de 1848', 'Celui de 1860', 'Celui de 1875'], 0, 'Le oui l’emporte massivement : la défaite militaire, elle, sera immédiate.'],
            ['Quelle défaite emporte le Second Empire ?', ['Sedan, le 2 septembre 1870', 'Waterloo', 'Sadowa', 'Solferino'], 0, 'L’empereur capitule avec son armée ; la République est proclamée deux jours plus tard.'],
            ['Que sont les « Cinq » de 1857 ?', ['Les cinq députés républicains élus face au régime', 'Cinq préfets révoqués', 'Cinq journaux interdits', 'Cinq ministres libéraux'], 0, 'Première brèche parlementaire : l’opposition républicaine entre au Corps législatif.'],
          ],
        },
        {
          titre: 'L’industrialisation de la France sous le Second Empire',
          axe: 'La France dans l’Europe des nationalités : politique et société (1848-1871)',
          lecon: {
            titre: 'Le rail, la banque et la ville',
            cours: `Sous le Second Empire, la France entre dans l’âge industriel : le pays se couvre de voies ferrées, invente la banque moderne et transforme ses villes.

## Le chemin de fer, colonne vertébrale
Le réseau passe d’environ 3 000 km en 1851 à près de 17 000 km en 1870, organisé en étoile autour de Paris et confié à six grandes compagnies. Il abaisse le coût du transport, unifie le marché national, fait vivre la sidérurgie et le charbon, et met fin aux famines locales.

## La banque et le crédit
Les frères **Pereire** (Crédit mobilier), le **Crédit lyonnais** (1863), la **Société générale** (1864) et le Crédit foncier drainent l’épargne vers l’industrie. L’État signe le **traité de libre-échange** avec le Royaume-Uni (1860), qui expose l’industrie française à la concurrence et la pousse à se moderniser.

> Une économie ne s’industrialise pas seulement avec des machines : il lui faut du crédit, des transports et un marché.

## Les grands travaux et la ville
Le préfet **Haussmann** perce les grands boulevards de Paris, installe l’eau, les égouts et les gares : la ville devient un chantier permanent, et le prix du sol chasse les ouvriers vers la périphérie. Les **Expositions universelles** (1855, 1867) mettent en scène cette modernité.

## Une industrialisation encore inachevée
La France reste très rurale : en 1870, une majorité d’actifs vit encore de l’agriculture, et la petite entreprise domine. L’industrialisation française est réelle, mais plus lente et plus dispersée que la britannique.`,
          },
          questions: [
            ['De combien de kilomètres le réseau ferré français passe-t-il environ entre 1851 et 1870 ?', ['De 3 000 à près de 17 000 km', 'De 500 à 3 000 km', 'De 17 000 à 40 000 km', 'De 1 000 à 2 000 km'], 0, 'Le rail multiplie par plus de cinq en vingt ans et unifie le marché national.'],
            ['Quelle forme a le réseau ferré français ?', ['Une étoile centrée sur Paris', 'Un quadrillage régulier', 'Un axe unique nord-sud', 'Un réseau littoral'], 0, 'Le tracé en étoile renforce la centralisation du territoire.'],
            ['Quelles banques naissent sous le Second Empire ?', ['Le Crédit lyonnais et la Société générale', 'La Banque de France et la Caisse des dépôts', 'La BNP et le CIC seuls', 'La Banque postale'], 0, 'Fondées en 1863 et 1864, elles drainent l’épargne vers l’industrie.'],
            ['Que signe la France avec le Royaume-Uni en 1860 ?', ['Un traité de libre-échange', 'Une alliance militaire', 'Un traité de paix', 'Une union douanière'], 0, 'Le traité Cobden-Chevalier ouvre le marché français à la concurrence britannique.'],
            ['Qui transforme Paris sous le Second Empire ?', ['Le préfet Haussmann', 'L’architecte Garnier', 'L’ingénieur Eiffel', 'Le préfet Poubelle'], 0, 'Percées, égouts, adduction d’eau et gares redessinent la capitale.'],
            ['Les travaux d’Haussmann repoussent les ouvriers vers la périphérie.', ['Vrai', 'Faux'], 0, 'La hausse des loyers dans le centre rénové provoque leur éloignement.'],
            ['Que met en scène une Exposition universelle ?', ['La puissance industrielle et technique du pays', 'Les productions agricoles régionales', 'Les collections des musées', 'Les colonies uniquement'], 0, 'Paris en accueille deux sous l’Empire, en 1855 et 1867.'],
            ['En 1870, la France est déjà majoritairement urbaine et industrielle.', ['Vrai', 'Faux'], 1, 'La majorité des actifs vit encore de l’agriculture : l’industrialisation est réelle mais inachevée.'],
          ],
        },
        {
          titre: 'Les évolutions d’un monde rural toujours majoritaire',
          axe: 'La France dans l’Europe des nationalités : politique et société (1848-1871)',
          lecon: {
            titre: 'La France des campagnes entre en mouvement',
            cours: `Au milieu du XIXe siècle, les trois quarts des Français vivent à la campagne. Ce monde rural n’est pas immobile : il se modernise, s’ouvre et commence à se vider.

## Un poids démographique écrasant
En 1851, la population rurale atteint son maximum historique. Le village vit en quasi-autarcie, rythmé par la paroisse, la foire et le travail collectif. Les patois dominent encore largement le français.

## La modernisation agricole
Les rendements progressent avec l’usage des **engrais**, la fin de la jachère, la sélection des semences et les premières machines. Le chemin de fer ouvre les marchés urbains : la polyculture vivrière recule au profit de productions spécialisées (vigne, betterave, élevage). Les crises frappent aussi : le **phylloxéra** ravage le vignoble à partir de 1863.

> Le rail fait entrer le marché dans le village : on cesse de produire pour se nourrir, on produit pour vendre.

## Le début de l’exode rural
Le surplus de main-d’œuvre part vers les villes et les chantiers. Le mouvement est d’abord lent et souvent temporaire (migrations saisonnières), avant de s’accélérer sous la Troisième République.

## L’ouverture culturelle et politique
L’école, le service militaire, la presse et le colportage diffusent le français et l’information nationale. Le suffrage universel masculin fait du paysan un électeur courtisé — un électeur qui, en 1848 comme en 1851, vote massivement pour l’ordre.`,
          },
          questions: [
            ['Quelle part de la population française vit à la campagne au milieu du XIXe siècle ?', ['Environ les trois quarts', 'Environ un quart', 'La moitié', 'Un dixième'], 0, 'La population rurale atteint son maximum historique vers 1851.'],
            ['Quel fléau ravage le vignoble français à partir de 1863 ?', ['Le phylloxéra', 'Le mildiou seul', 'La rouille du blé', 'La peste bovine'], 0, 'Ce puceron venu d’Amérique détruit une grande partie des vignes en vingt ans.'],
            ['Comment le chemin de fer transforme-t-il l’agriculture ?', ['Il ouvre les marchés urbains et pousse à la spécialisation', 'Il fait disparaître les foires', 'Il supprime les jachères', 'Il interdit la polyculture'], 0, 'On produit pour vendre loin, plus seulement pour se nourrir sur place.'],
            ['Qu’est-ce que l’exode rural ?', ['Le départ des campagnes vers les villes', 'Le retour des citadins à la campagne', 'Une migration saisonnière des troupeaux', 'L’émigration vers les colonies'], 0, 'Il commence lentement sous l’Empire et s’accélère ensuite.'],
            ['Le monde rural du XIXe siècle est resté totalement immobile.', ['Vrai', 'Faux'], 1, 'Engrais, machines, spécialisation, ouverture au marché : il change vite, mais sans se vider d’un coup.'],
            ['Quels vecteurs diffusent le français dans les campagnes ?', ['L’école, le service militaire et la presse', 'Uniquement l’Église', 'Le cinéma', 'La radio'], 0, 'Les patois reculent surtout à partir de la Troisième République.'],
            ['Comment votent majoritairement les campagnes en décembre 1848 ?', ['Pour Louis-Napoléon Bonaparte', 'Pour Ledru-Rollin', 'Pour Cavaignac', 'Elles s’abstiennent'], 0, 'Le vote rural fait la victoire du futur empereur.'],
            ['Que remplace progressivement la jachère ?', ['La rotation des cultures et les engrais', 'La monoculture obligatoire', 'La mise en friche', 'L’élevage extensif seul'], 0, 'La suppression de la jachère augmente la surface cultivée chaque année.'],
          ],
        },
        {
          titre: 'La question sociale : un enjeu politique',
          axe: 'La France dans l’Europe des nationalités : politique et société (1848-1871)',
          lecon: {
            titre: 'La misère ouvrière devient une affaire d’État',
            cours: `Avec l’industrialisation naît une classe ouvrière nombreuse et pauvre. Sa condition cesse d’être une affaire de charité : elle devient une **question politique**, qui traverse tout le siècle.

## Une condition ouvrière dure
Journées de 12 heures, salaires bas, logements insalubres, travail des enfants et des femmes, absence de protection en cas d’accident ou de maladie. Les enquêtes du docteur **Villermé** (1840) décrivent une misère qui choque l’opinion et débouchent sur la loi de 1841 limitant le travail des enfants — peu appliquée, faute d’inspecteurs.

## Des réponses concurrentes
Les **catholiques sociaux** misent sur le patronage et la charité. Les **socialistes utopiques** (Fourier, Cabet) imaginent des communautés modèles. **Proudhon** défend le mutualisme, **Marx** l’organisation de classe et la révolution. L’Association internationale des travailleurs (**AIT**, 1864) donne un cadre international à ces débats.

> Tant que la pauvreté relève de la charité, elle n’est pas politique ; dès qu’elle relève de la loi, elle le devient.

## Le droit qui avance à petits pas
La loi Le Chapelier (1791) interdisait les coalitions ; la loi Ollivier (**1864**) dépénalise la **grève** ; les chambres syndicales sont tolérées en 1868. Les syndicats ne seront pleinement légalisés qu’en **1884**.

## La Commune de Paris (1871)
Née du siège, de la défaite et du refus d’un gouvernement conservateur, la Commune associe revendications sociales et municipales. Écrasée pendant la **Semaine sanglante** (21-28 mai 1871), elle laisse un souvenir qui pèse sur la République naissante.`,
          },
          questions: [
            ['Qui enquête sur la condition ouvrière en 1840 ?', ['Le docteur Villermé', 'Victor Hugo', 'Émile Zola', 'Jules Ferry'], 0, 'Son tableau de l’état physique et moral des ouvriers marque l’opinion.'],
            ['Que limite la loi de 1841 ?', ['Le travail des enfants', 'La durée du travail des adultes', 'Le travail de nuit des femmes', 'Le travail à domicile'], 0, 'Elle est peu appliquée : aucun corps d’inspection sérieux ne la contrôle.'],
            ['Quelle loi dépénalise la grève en France ?', ['La loi Ollivier de 1864', 'La loi Le Chapelier', 'La loi Waldeck-Rousseau', 'La loi Ferry'], 0, 'La grève cesse d’être un délit, mais reste encadrée.'],
            ['En quelle année les syndicats sont-ils pleinement légalisés ?', ['1884', '1864', '1871', '1848'], 0, 'La loi Waldeck-Rousseau autorise les syndicats professionnels.'],
            ['Qu’est-ce que l’AIT fondée en 1864 ?', ['L’Association internationale des travailleurs', 'Une banque ouvrière', 'Un parti politique français', 'Une confédération patronale'], 0, 'Elle donne un cadre international au mouvement ouvrier naissant.'],
            ['La Commune de Paris est écrasée lors de la Semaine sanglante de mai 1871.', ['Vrai', 'Faux'], 0, 'La répression fait plusieurs milliers de morts et des milliers de déportations.'],
            ['Que défend Proudhon ?', ['Le mutualisme et l’association ouvrière', 'La monarchie sociale', 'Le libre-échange intégral', 'Le retour à la terre obligatoire'], 0, 'Il s’oppose à la fois au capitalisme et à l’État centralisateur.'],
            ['Pourquoi parle-t-on de « question sociale » ?', ['Parce que la pauvreté ouvrière devient un problème politique à traiter par la loi', 'Parce que la société refuse d’en parler', 'Parce qu’elle ne concerne que les campagnes', 'Parce qu’elle est résolue par la charité'], 0, 'Elle structure les débats politiques jusqu’au XXe siècle.'],
          ],
        },
        {
          titre: 'La France et la construction de nouveaux États par la guerre et la diplomatie',
          axe: 'La France dans l’Europe des nationalités : politique et société (1848-1871)',
          lecon: {
            titre: 'Aider les nations, et se retrouver seule',
            cours: `Entre 1852 et 1871, deux nations naissent en Europe : l’Italie et l’Allemagne. La France de Napoléon III joue un rôle dans la première et paie très cher la seconde.

## L’unité italienne (1859-1870)
Le royaume de Piémont-Sardaigne, mené par **Cavour**, obtient l’appui français aux entrevues de Plombières (1858). Les victoires de **Magenta** et **Solferino** (1859) chassent l’Autriche de Lombardie ; la France reçoit **Nice et la Savoie** (1860) après plébiscites. Garibaldi et l’expédition des Mille achèvent l’unification ; Rome devient capitale en 1870, quand la garnison française se retire.

## L’unité allemande (1864-1871)
**Bismarck**, chancelier de Prusse, unifie « par le fer et par le sang » : guerre des Duchés (1864), victoire sur l’Autriche à **Sadowa** (1866), puis guerre contre la France. La dépêche d’Ems provoque la déclaration de guerre française en juillet 1870.

> Napoléon III soutenait le principe des nationalités : il a contribué à créer, à ses frontières, une puissance plus forte que la sienne.

## 1870-1871 : la défaite et ses conséquences
Sedan (2 septembre 1870), le siège de Paris, l’armistice de janvier 1871. L’**Empire allemand** est proclamé dans la galerie des Glaces de Versailles le 18 janvier 1871. Le traité de Francfort (mai 1871) impose la perte de l’**Alsace-Moselle** et 5 milliards de francs-or.

## Une plaie ouverte
La « revanche » et la question des provinces perdues pèsent sur la vie politique française jusqu’en 1914 : c’est l’un des fils qui mène à la Première Guerre mondiale.`,
          },
          questions: [
            ['Qui est le principal artisan politique de l’unité italienne ?', ['Cavour', 'Bismarck', 'Metternich', 'Mazzini seul'], 0, 'Ministre du Piémont-Sardaigne, il obtient l’alliance française à Plombières.'],
            ['Quelles régions la France obtient-elle en 1860 ?', ['Nice et la Savoie', 'La Lombardie', 'La Vénétie', 'La Corse'], 0, 'Elles sont rattachées après plébiscites, en échange de l’aide contre l’Autriche.'],
            ['Quelle bataille de 1866 assure la domination prussienne sur l’Allemagne ?', ['Sadowa', 'Solferino', 'Sedan', 'Magenta'], 0, 'La victoire sur l’Autriche écarte Vienne de la future unité allemande.'],
            ['Quelle formule résume la méthode de Bismarck ?', ['« Par le fer et par le sang »', '« Liberté, égalité, fraternité »', '« Le droit des peuples »', '« L’Empire, c’est la paix »'], 0, 'L’unité allemande se fait par la guerre, non par les congrès.'],
            ['Où l’Empire allemand est-il proclamé le 18 janvier 1871 ?', ['Dans la galerie des Glaces de Versailles', 'À Berlin', 'À Francfort', 'À Vienne'], 0, 'Le lieu choisi humilie la France vaincue.'],
            ['Que perd la France au traité de Francfort ?', ['L’Alsace et une grande partie de la Lorraine', 'La Savoie', 'Les colonies d’Afrique', 'La Corse'], 0, 'S’y ajoute une indemnité de 5 milliards de francs-or.'],
            ['La défaite de 1871 nourrit en France l’idée de revanche jusqu’en 1914.', ['Vrai', 'Faux'], 0, 'Les provinces perdues restent un thème politique majeur pendant quarante ans.'],
            ['Quel épisode diplomatique déclenche la guerre de 1870 ?', ['La dépêche d’Ems', 'Les entrevues de Plombières', 'Le congrès de Berlin', 'L’expédition des Mille'], 0, 'Bismarck en publie une version qui rend la déclaration de guerre française inévitable.'],
          ],
        },
        // ===================================================================
        // HISTOIRE — Chapitre 3 : la mise en œuvre du projet républicain
        // ===================================================================
        {
          titre: 'L’instauration de la République et de la démocratie parlementaire (1870-1875)',
          axe: 'La Troisième République avant 1914 : la mise en œuvre du projet républicain',
          lecon: {
            titre: 'Une république proclamée par des monarchistes',
            cours: `La Troisième République naît dans la défaite, avec une Assemblée majoritairement monarchiste. Il lui faudra cinq ans pour se donner des lois constitutionnelles — et une voix d’avance.

## 1870-1871 : la République avant la Constitution
Le 4 septembre 1870, la République est proclamée après Sedan. L’Assemblée élue en février 1871, à majorité monarchiste, choisit **Thiers** comme chef du pouvoir exécutif. Elle écrase la **Commune de Paris** (mai 1871) et signe la paix.

## Pourquoi la monarchie échoue
Les monarchistes sont divisés entre **légitimistes** (comte de Chambord) et **orléanistes** (comte de Paris). Le refus du comte de Chambord d’accepter le **drapeau tricolore** (1873) fait capoter la restauration : on se rabat sur une présidence de sept ans confiée à **Mac-Mahon**, en attendant mieux.

> La République s’installe faute d’accord sur le roi : elle est, selon Thiers, « le régime qui nous divise le moins ».

## Les lois constitutionnelles de 1875
Trois lois créent un régime parlementaire bicaméral : Chambre des députés élue au suffrage universel masculin, Sénat, et un président élu par les deux Chambres. L’**amendement Wallon** (30 janvier 1875), adopté par 353 voix contre 352, inscrit le mot « République ».

## La crise du 16 mai 1877
Mac-Mahon renvoie un gouvernement républicain et dissout la Chambre ; les électeurs renvoient une majorité républicaine. Le président se « soumet » puis démissionne (1879) : le président renonce durablement au droit de dissolution, et le régime devient un parlementarisme dominé par les Chambres.`,
          },
          questions: [
            ['Quand la Troisième République est-elle proclamée ?', ['Le 4 septembre 1870', 'Le 18 mars 1871', 'Le 30 janvier 1875', 'Le 16 mai 1877'], 0, 'La proclamation suit immédiatement la capitulation de Sedan.'],
            ['Quelle est la majorité de l’Assemblée élue en février 1871 ?', ['Monarchiste', 'Républicaine', 'Bonapartiste', 'Socialiste'], 0, 'Elle est élue sur la question de la paix, que les monarchistes portent alors.'],
            ['Pourquoi la restauration monarchique échoue-t-elle en 1873 ?', ['Le comte de Chambord refuse le drapeau tricolore', 'Le peuple vote contre par référendum', 'L’Allemagne s’y oppose', 'Les deux prétendants meurent'], 0, 'Un symbole suffit à faire échouer un régime déjà divisé.'],
            ['Qu’ajoute l’amendement Wallon en janvier 1875 ?', ['Le mot « République » dans les lois constitutionnelles', 'Le suffrage universel', 'La liberté de la presse', 'La séparation des Églises et de l’État'], 0, 'Adopté à une voix de majorité : 353 contre 352.'],
            ['Quelles institutions les lois de 1875 mettent-elles en place ?', ['Une Chambre des députés, un Sénat et un président élu par les Chambres', 'Une assemblée unique et un président élu au suffrage universel', 'Un consulat', 'Une monarchie parlementaire'], 0, 'Le bicamérisme est le prix du ralliement des orléanistes.'],
            ['Que se passe-t-il lors de la crise du 16 mai 1877 ?', ['Mac-Mahon dissout la Chambre et perd les élections', 'Le président est destitué', 'La République est abolie', 'Le Sénat est supprimé'], 0, 'Après cet échec, la dissolution ne sera plus utilisée sous la Troisième République.'],
            ['La crise de 1877 renforce le pouvoir du président de la République.', ['Vrai', 'Faux'], 1, 'Elle l’affaiblit durablement au profit des Chambres.'],
            ['Qui écrase la Commune de Paris en mai 1871 ?', ['Le gouvernement de Thiers', 'L’armée prussienne', 'La Garde nationale', 'Le gouvernement de Mac-Mahon'], 0, 'La Semaine sanglante est menée par les troupes versaillaises.'],
          ],
        },
        {
          titre: 'L’enracinement de la culture républicaine (1876-1899)',
          axe: 'La Troisième République avant 1914 : la mise en œuvre du projet républicain',
          lecon: {
            titre: 'Des lois, des symboles, une école',
            cours: `Une fois installée, la République doit devenir une culture partagée. En vingt ans, elle s’enracine par les libertés, par l’école et par des symboles quotidiens.

## Les grandes lois de liberté
1881 : liberté de la **presse** et de réunion. 1884 : liberté **syndicale** (loi Waldeck-Rousseau) et élection des maires par les conseils municipaux. 1901 : liberté d’**association**. Ces lois font de la République un régime de libertés concrètes, pas seulement un mot.

## L’école de Jules Ferry
Les lois de **1881-1882** rendent l’école primaire **gratuite, laïque et obligatoire** de 6 à 13 ans. L’instituteur — le « hussard noir » — apprend le français, l’histoire nationale et la morale civique ; l’école forme des citoyens et unifie linguistiquement le pays.

> Une République ne dure que si elle est enseignée : l’école primaire est son institution centrale.

## Les symboles du quotidien
La **Marseillaise** devient hymne national (1879), le **14 Juillet** fête nationale (1880), Marianne et le buste républicain entrent dans les mairies, les rues sont rebaptisées. Le retour du Parlement à Paris et le Panthéon (funérailles de Victor Hugo, 1885) achèvent de fixer le récit.

## Les crises traversées
Le **boulangisme** (1886-1889), le scandale de **Panama** (1892) et surtout l’**affaire Dreyfus** (à partir de 1894) menacent le régime. La République en sort renforcée : « J’accuse » de Zola (1898), la mobilisation des intellectuels et la révision du procès montrent que la justice et la liberté d’opinion l’emportent.`,
          },
          questions: [
            ['Quelle liberté fondamentale la loi de 1881 consacre-t-elle ?', ['La liberté de la presse', 'La liberté syndicale', 'La liberté d’association', 'La liberté de culte'], 0, 'Elle supprime l’autorisation préalable et limite fortement les délits de presse.'],
            ['Que fait la loi Waldeck-Rousseau de 1884 ?', ['Elle légalise les syndicats professionnels', 'Elle sépare les Églises et l’État', 'Elle crée l’école gratuite', 'Elle instaure l’impôt sur le revenu'], 0, 'Vingt ans après la dépénalisation de la grève, le syndicat devient légal.'],
            ['Que rendent les lois Ferry de 1881-1882 ?', ['L’école primaire gratuite, laïque et obligatoire', 'L’université gratuite', 'Le lycée obligatoire', 'La formation professionnelle obligatoire'], 0, 'Obligation scolaire de 6 à 13 ans, pour les filles comme pour les garçons.'],
            ['La Marseillaise devient hymne national en 1879.', ['Vrai', 'Faux'], 0, 'Le 14 Juillet devient fête nationale l’année suivante, en 1880.'],
            ['Comment surnomme-t-on les instituteurs de la Troisième République ?', ['Les hussards noirs de la République', 'Les gardiens du temple', 'Les missionnaires laïques', 'Les sergents de la nation'], 0, 'L’expression est de Charles Péguy.'],
            ['Quelle affaire divise profondément la France à partir de 1894 ?', ['L’affaire Dreyfus', 'L’affaire Stavisky', 'Le scandale de Panama seul', 'L’affaire Boulanger'], 0, 'Elle oppose dreyfusards et antidreyfusards pendant plus de dix ans.'],
            ['Qui publie « J’accuse… ! » en 1898 ?', ['Émile Zola', 'Victor Hugo', 'Jean Jaurès', 'Georges Clemenceau'], 0, 'La lettre ouverte paraît dans L’Aurore et relance l’affaire.'],
            ['Qu’est-ce que le boulangisme ?', ['Un mouvement autoritaire et nationaliste qui menace la République à la fin des années 1880', 'Un syndicat de boulangers', 'Un courant socialiste', 'Une politique agricole'], 0, 'La popularité du général Boulanger fait craindre un coup d’État.'],
          ],
        },
        {
          titre: 'La consolidation de la République (1900-1914)',
          axe: 'La Troisième République avant 1914 : la mise en œuvre du projet républicain',
          lecon: {
            titre: 'La laïcité, les réformes, et l’ombre de la guerre',
            cours: `Sortie renforcée de l’affaire Dreyfus, la République des radicaux mène à son terme le projet laïque et pose les premières bases sociales, tout en préparant la guerre qui vient.

## La séparation des Églises et de l’État
La loi du **9 décembre 1905** garantit la liberté de conscience et le libre exercice des cultes, ne reconnaît ni ne salarie aucun culte, et met fin au Concordat de 1801. Elle est précédée par la loi de 1901 sur les associations, appliquée sévèrement aux congrégations. Les **inventaires** des biens d’église (1906) provoquent des incidents violents dans certaines régions.

> La laïcité n’est pas une religion d’État contre les autres : c’est la neutralité de l’État, qui garantit les cultes sans en financer aucun.

## Les premières lois sociales
Repos hebdomadaire obligatoire (**1906**), retraites ouvrières et paysannes (**1910**), journée de dix heures, extension des accidents du travail (1898). Le mouvement ouvrier s’organise : la **CGT** est fondée en 1895, la **SFIO** en 1905, avec Jean Jaurès.

## Les tensions
Les grèves sont nombreuses et parfois durement réprimées par Clemenceau, « premier flic de France ». Les nationalistes, l’Action française et les ligues contestent le régime, tandis que la question scolaire divise encore.

## Vers 1914
La loi de **trois ans** (1913) allonge le service militaire face à l’Allemagne. L’assassinat de **Jaurès**, le 31 juillet 1914, précède de quelques jours l’entrée en guerre : l’**Union sacrée** rassemble alors des camps qui se combattaient la veille.`,
          },
          questions: [
            ['Que dispose la loi du 9 décembre 1905 ?', ['La République ne reconnaît ni ne salarie aucun culte', 'Les cultes sont interdits', 'Le catholicisme redevient religion d’État', 'L’Église contrôle les écoles'], 0, 'Elle garantit la liberté de conscience et le libre exercice des cultes.'],
            ['Quel texte la loi de 1905 remplace-t-elle ?', ['Le Concordat de 1801', 'La loi Falloux', 'La Constitution civile du clergé', 'Le décret Schoelcher'], 0, 'Fin du régime concordataire signé par Bonaparte.'],
            ['Que provoquent les inventaires de 1906 ?', ['Des incidents parfois violents lors du recensement des biens d’église', 'La fermeture de toutes les églises', 'Une grève générale', 'La démission du gouvernement'], 0, 'La résistance est forte dans les régions les plus catholiques.'],
            ['Quelle loi sociale est votée en 1906 ?', ['Le repos hebdomadaire obligatoire', 'Les congés payés', 'La semaine de 40 heures', 'Le salaire minimum'], 0, 'Un jour de repos par semaine devient une obligation légale.'],
            ['Quand la CGT est-elle fondée ?', ['En 1895', 'En 1884', 'En 1905', 'En 1919'], 0, 'La Confédération générale du travail naît onze ans après la légalisation des syndicats.'],
            ['Qui dirige la SFIO, parti socialiste unifié créé en 1905 ?', ['Jean Jaurès en est la grande figure', 'Georges Clemenceau', 'Jules Guesde seul', 'Aristide Briand seul'], 0, 'Jaurès en devient le principal orateur et le directeur de L’Humanité.'],
            ['Que fait la loi de trois ans en 1913 ?', ['Elle allonge la durée du service militaire', 'Elle prolonge le mandat des députés', 'Elle allonge la scolarité obligatoire', 'Elle limite le travail des enfants'], 0, 'Réponse à la montée des tensions avec l’Allemagne.'],
            ['Jean Jaurès est assassiné le 31 juillet 1914.', ['Vrai', 'Faux'], 0, 'Le principal opposant à la guerre disparaît trois jours avant la mobilisation générale.'],
          ],
        },
        // ===================================================================
        // HISTOIRE — Chapitre 4 : permanences et mutations de la société
        // ===================================================================
        {
          titre: 'La naissance d’une société industrielle dans une France majoritairement rurale',
          axe: 'La Troisième République avant 1914 : permanences et mutations de la société française jusqu’en 1914',
          lecon: {
            titre: 'Deux France qui avancent à des rythmes différents',
            cours: `Entre 1870 et 1914, la France s’industrialise sans cesser d’être paysanne. C’est cette coexistence que le programme appelle « permanences et mutations ».

## La deuxième révolution industrielle
L’**électricité**, le **moteur à explosion**, la chimie et l’acier transforment la production. De grandes entreprises apparaissent (Renault 1898, Michelin, Saint-Gobain) et le **taylorisme** commence à s’introduire. Les banques de dépôt financent l’industrie, et la France exporte massivement des capitaux (emprunts russes).

## Une France qui reste rurale
En 1911, environ **44 %** des actifs travaillent encore dans l’agriculture, et près de la moitié des Français vivent à la campagne. L’exploitation familiale domine, protégée par les tarifs douaniers Méline (1892). La population française stagne (démographie faible), ce qui distingue la France de l’Allemagne ou du Royaume-Uni.

> La France de 1900 n’est pas une société industrielle qui garde des paysans : c’est une société paysanne qui s’industrialise.

## Villes et migrations
Paris dépasse 2,8 millions d’habitants en 1911 ; les bassins industriels (Nord, Lorraine, Saint-Étienne) attirent une main-d’œuvre venue des campagnes, mais aussi des **immigrés** belges, italiens et polonais. L’urbanisation reste plus lente qu’ailleurs en Europe.

## De nouvelles classes sociales
Ouvriers d’usine, employés de bureau et de grand magasin, ingénieurs et fonctionnaires : les groupes sociaux se diversifient, et avec eux les manières de vivre, de consommer et de voter.`,
          },
          questions: [
            ['Quelles énergies caractérisent la deuxième révolution industrielle ?', ['L’électricité et le pétrole', 'Le charbon et la vapeur seuls', 'Le gaz de ville uniquement', 'L’énergie hydraulique seule'], 0, 'Elles s’ajoutent au charbon et transforment usines et transports.'],
            ['Quelle part des actifs français travaille encore dans l’agriculture vers 1911 ?', ['Environ 44 %', 'Environ 10 %', 'Environ 70 %', 'Environ 25 %'], 0, 'La France reste beaucoup plus rurale que le Royaume-Uni ou l’Allemagne.'],
            ['Que protègent les tarifs Méline de 1892 ?', ['L’agriculture et l’industrie françaises par des droits de douane', 'Les colonies', 'Les banques', 'Les chemins de fer'], 0, 'Ce protectionnisme freine l’exode rural et conserve la petite exploitation.'],
            ['Quelle particularité démographique distingue la France de ses voisins ?', ['Une croissance de la population très faible', 'Une explosion démographique', 'Une mortalité infantile record', 'Une émigration massive vers l’Amérique'], 0, 'La natalité baisse tôt : la France recourt davantage à l’immigration.'],
            ['D’où viennent principalement les immigrés en France avant 1914 ?', ['De Belgique, d’Italie et de Pologne', 'D’Afrique du Nord seulement', 'D’Asie', 'D’Amérique latine'], 0, 'Ils travaillent surtout dans les mines, la sidérurgie et l’agriculture.'],
            ['Renault est fondée en 1898.', ['Vrai', 'Faux'], 0, 'L’automobile est l’une des industries neuves de la période.'],
            ['Qu’est-ce que le taylorisme ?', ['Une organisation scientifique du travail décomposant les tâches', 'Un syndicat', 'Une loi sociale', 'Une méthode agricole'], 0, 'Il commence à s’introduire en France avant 1914, notamment chez Renault.'],
            ['Quel groupe social nouveau se développe avec les bureaux et les grands magasins ?', ['Les employés', 'Les métayers', 'Les artisans ruraux', 'Les rentiers'], 0, 'Ni ouvriers ni bourgeois, ils forment une classe moyenne salariée.'],
          ],
        },
        {
          titre: 'Des transformations sociales malgré des réticences',
          axe: 'La Troisième République avant 1914 : permanences et mutations de la société française jusqu’en 1914',
          lecon: {
            titre: 'Ce qui change vite, ce qui résiste',
            cours: `La société française se transforme sous la Troisième République — école, travail, consommation, condition féminine — mais chaque avancée rencontre des résistances tenaces.

## Ce qui change
L’**alphabétisation** devient générale grâce à l’école obligatoire. La presse à un sou (Le Petit Journal) touche des millions de lecteurs. Le grand magasin, le vélo, le tramway, l’éclairage électrique modifient la vie quotidienne. Le travail se réglemente : accidents du travail (1898), repos hebdomadaire (1906), retraites (1910).

## La condition des femmes
Les femmes travaillent massivement (usine textile, domesticité, ferme, bureau). Les lois **Camille Sée** (1880) créent l’enseignement secondaire féminin, et les premières femmes accèdent aux professions libérales. Mais le **Code civil** maintient la femme mariée sous l’autorité du mari, et le **droit de vote** leur reste refusé — la France ne l’accordera qu’en 1944, bien après la Finlande, le Royaume-Uni ou l’Allemagne.

> Une société peut scolariser ses filles et leur refuser le bulletin de vote : les mutations n’avancent pas au même rythme partout.

## Les réticences
Les élites craignent la « dissolution » des mœurs, l’Église combat la laïcisation, les campagnes se méfient des nouveautés urbaines, et le patronat résiste aux lois sociales. Le service militaire et l’école, eux, unifient les esprits et les usages.

## Un bilan contrasté
En 1914, les Français sont plus instruits, mieux informés, plus mobiles qu’en 1870 — mais les inégalités sociales restent fortes, et l’égalité politique s’arrête à la moitié de la population.`,
          },
          questions: [
            ['Que crée la loi Camille Sée en 1880 ?', ['L’enseignement secondaire public pour les filles', 'L’école primaire obligatoire', 'Les universités féminines', 'Le droit de vote des femmes'], 0, 'Les lycées de jeunes filles ouvrent, sans programme identique à celui des garçons au départ.'],
            ['Quand les Françaises obtiennent-elles le droit de vote ?', ['En 1944', 'En 1918', 'En 1936', 'En 1905'], 0, 'Bien après plusieurs voisins européens : le suffrage « universel » de la Troisième République est masculin.'],
            ['Quelle loi de 1898 protège les salariés ?', ['La loi sur les accidents du travail', 'La loi sur les retraites', 'La loi sur le repos hebdomadaire', 'La loi sur les congés payés'], 0, 'Elle instaure une responsabilité de l’employeur sans faute à prouver.'],
            ['Qu’est-ce que la presse à un sou ?', ['Une presse populaire à très bas prix et à fort tirage', 'Une presse réservée aux élites', 'Un journal officiel', 'La presse syndicale'], 0, 'Le Petit Journal dépasse le million d’exemplaires : l’information devient un bien de masse.'],
            ['Le Code civil de l’époque place la femme mariée sous l’autorité de son mari.', ['Vrai', 'Faux'], 0, 'L’incapacité juridique de la femme mariée ne disparaîtra qu’au XXe siècle.'],
            ['Quelle innovation transforme la vie quotidienne des villes vers 1900 ?', ['L’éclairage électrique et le tramway', 'L’automobile pour tous', 'Le téléphone dans chaque foyer', 'La télévision'], 0, 'La ville change plus vite que la campagne, ce qui creuse les écarts de mode de vie.'],
            ['Qui résiste le plus aux lois sociales avant 1914 ?', ['Une grande partie du patronat', 'Les syndicats', 'Les instituteurs', 'Les députés radicaux'], 0, 'Les lois sont votées tard et souvent appliquées avec retard.'],
            ['Quelle institution unifie les usages et la langue chez les jeunes hommes ?', ['Le service militaire', 'Le syndicat', 'La coopérative agricole', 'La mutuelle'], 0, 'Avec l’école, il fait reculer les patois et diffuse une culture nationale.'],
          ],
        },
        // ===================================================================
        // HISTOIRE — Chapitre 5 : métropoles et colonies
        // ===================================================================
        {
          titre: 'L’expansion coloniale française',
          axe: 'La Troisième République avant 1914 : métropoles et colonies',
          lecon: {
            titre: 'Le deuxième empire colonial du monde',
            cours: `Entre 1880 et 1914, la France se constitue le deuxième empire colonial du monde après le Royaume-Uni : environ 10 millions de km² et 50 millions d’habitants.

## Les étapes de la conquête
Algérie (à partir de 1830, colonie de peuplement), Tunisie (protectorat, 1881), Indochine (1858-1887), Afrique de l’Ouest et Afrique équatoriale (1880-1900), Madagascar (1895), Maroc (protectorat, 1912). La **conférence de Berlin** (1884-1885) organise le partage de l’Afrique entre puissances européennes et impose le principe de l’occupation effective.

## Les rivalités
La course aux territoires provoque des crises : **Fachoda** (1898) oppose la France au Royaume-Uni au Soudan et se solde par un recul français ; les crises marocaines (1905, 1911) opposent la France à l’Allemagne. La colonisation est donc aussi un facteur de tension européenne.

> Les empires coloniaux ne se croisent pas seulement en Afrique : ils rapprochent l’Europe de sa propre guerre.

## Les moyens
Supériorité militaire (fusil à répétition, mitrailleuse, canonnière), missions d’exploration, missionnaires, traités imposés aux souverains locaux. Les résistances sont nombreuses et parfois longues : Abd el-Kader, Samory Touré, insurrections malgaches ou vietnamiennes.

## Ce que l’empire représente
Un marché protégé, des matières premières, des points d’appui militaires — et un prestige national, très présent dans les Expositions coloniales, les manuels scolaires et la presse.`,
          },
          questions: [
            ['Quel rang occupe l’empire colonial français vers 1914 ?', ['Le deuxième après le Royaume-Uni', 'Le premier', 'Le troisième après l’Allemagne', 'Le cinquième'], 0, 'Environ 10 millions de km² et 50 millions d’habitants.'],
            ['Que fait la conférence de Berlin de 1884-1885 ?', ['Elle fixe les règles du partage de l’Afrique entre Européens', 'Elle interdit la colonisation', 'Elle libère les colonies', 'Elle crée la SDN'], 0, 'Elle impose notamment le principe de l’occupation effective.'],
            ['Quel incident oppose la France au Royaume-Uni en 1898 ?', ['Fachoda', 'Agadir', 'Tanger', 'Sedan'], 0, 'La France recule au Soudan : la rivalité coloniale cède ensuite la place à l’Entente cordiale.'],
            ['La Tunisie devient un protectorat français en 1881.', ['Vrai', 'Faux'], 0, 'Le Maroc suivra en 1912, après deux crises internationales.'],
            ['Qui résiste à la conquête française en Afrique de l’Ouest ?', ['Samory Touré', 'Abd el-Krim', 'Chaka Zulu', 'Menelik II'], 0, 'Sa résistance dure jusqu’en 1898.'],
            ['Quelle innovation militaire facilite les conquêtes ?', ['Le fusil à répétition et la mitrailleuse', 'Le char d’assaut', 'L’avion', 'Le sous-marin'], 0, 'L’écart technologique est décisif face aux armées locales.'],
            ['Quel type de colonie est l’Algérie ?', ['Une colonie de peuplement rattachée administrativement à la France', 'Un protectorat', 'Un territoire sous mandat', 'Un comptoir commercial'], 0, 'Trois départements français y sont créés, avec une importante population européenne.'],
            ['Les crises marocaines de 1905 et 1911 opposent la France à quel pays ?', ['L’Allemagne', 'L’Italie', 'L’Espagne', 'Le Royaume-Uni'], 0, 'Elles renforcent les blocs qui s’affronteront en 1914.'],
          ],
        },
        {
          titre: 'Le contexte de la politique coloniale française',
          axe: 'La Troisième République avant 1914 : métropoles et colonies',
          lecon: {
            titre: 'Pourquoi une République coloniale ?',
            cours: `La colonisation n’est pas seulement une conquête : c’est un projet justifié, débattu et contesté au sein même de la République.

## Les motivations
**Économiques** : débouchés pour l’industrie protégée, matières premières (arachide, caoutchouc, coton, minerais), placement des capitaux. **Stratégiques** : bases navales, routes maritimes, prestige après la défaite de 1871. **Idéologiques** : la « mission civilisatrice », qui prétend apporter progrès, santé et instruction — et qui repose sur une hiérarchie des races alors très répandue.

## Le débat politique
En 1885, **Jules Ferry** défend à la Chambre le « devoir des races supérieures » de civiliser ; **Georges Clemenceau** lui répond que la conquête n’est qu’une violence coûteuse et détourne la France de la revanche. Une partie des socialistes (Jaurès) dénonce l’exploitation, mais l’expansion se poursuit.

> La colonisation a été justifiée par le progrès, menée par la force et payée par les colonisés : les trois énoncés sont vrais ensemble.

## La propagande coloniale
Expositions coloniales, cartes postales, manuels scolaires, presse illustrée, publicités : l’empire entre dans la culture quotidienne des métropolitains, présenté comme une aventure et un bienfait.

## Le coût réel
Guerres de conquête, épidémies, travail forcé, impôt de capitation, réquisitions. L’empire rapporte moins qu’on ne l’a dit, mais il structure durablement les échanges de la France.`,
          },
          questions: [
            ['Quel homme politique défend en 1885 le « devoir des races supérieures » ?', ['Jules Ferry', 'Georges Clemenceau', 'Jean Jaurès', 'Léon Gambetta'], 0, 'Son discours devant la Chambre est le texte de référence sur la mission civilisatrice.'],
            ['Qui s’oppose à Ferry lors de ce débat ?', ['Georges Clemenceau', 'Jules Guesde', 'Raymond Poincaré', 'Paul Doumer'], 0, 'Il dénonce le coût humain et le détournement de la question alsacienne.'],
            ['Quelles motivations économiques poussent à la colonisation ?', ['Des débouchés, des matières premières et des placements', 'La lutte contre la surpopulation', 'La recherche de main-d’œuvre pour la métropole', 'Le besoin de terres agricoles en France'], 0, 'L’empire devient un marché protégé pour l’industrie française.'],
            ['La « mission civilisatrice » repose sur une hiérarchie des races.', ['Vrai', 'Faux'], 0, 'Cette idéologie, très répandue à l’époque, justifie la domination.'],
            ['Comment l’empire est-il diffusé dans la culture métropolitaine ?', ['Expositions, manuels, cartes postales et publicités', 'Uniquement par la radio', 'Par le cinéma seul', 'Il reste inconnu du grand public'], 0, 'L’imagerie coloniale imprègne le quotidien des Français.'],
            ['Quel prélèvement pèse sur les populations colonisées ?', ['L’impôt de capitation', 'La TVA', 'L’impôt sur le revenu', 'La dîme'], 0, 'Il s’ajoute au travail forcé et aux réquisitions.'],
            ['Quel argument stratégique justifie l’expansion après 1871 ?', ['Restaurer le prestige de la France après la défaite', 'Préparer l’invasion de l’Allemagne', 'Trouver de nouveaux alliés européens', 'Peupler les colonies de Français'], 0, 'La grandeur retrouvée outre-mer compense la défaite continentale.'],
            ['Qui dénonce l’exploitation coloniale au nom du socialisme ?', ['Jean Jaurès', 'Jules Ferry', 'Paul Bert', 'Albert Sarraut'], 0, 'Sa critique reste minoritaire avant 1914.'],
          ],
        },
        {
          titre: 'Le fonctionnement des sociétés coloniales',
          axe: 'La Troisième République avant 1914 : métropoles et colonies',
          lecon: {
            titre: 'Une République qui n’applique pas ses principes',
            cours: `Dans les colonies, la République applique un droit d’exception : les principes de 1789 s’arrêtent aux frontières de l’empire.

## Deux statuts, deux droits
Les colonisés sont **sujets** et non citoyens : ils ne votent pas, ne circulent pas librement et relèvent du **Code de l’indigénat** (1881 en Algérie, étendu ensuite), qui permet à l’administration de punir sans juge. Seule une minorité accède à la citoyenneté, au prix, souvent, de l’abandon du statut personnel.

> Une même République, deux droits : c’est la contradiction que le programme demande d’expliquer.

## L’administration et l’économie
Colonies (administration directe), protectorats (souverain local maintenu), Algérie (départements). L’économie est orientée vers l’exportation : cultures commerciales, mines, grands travaux, main-d’œuvre requise ou sous-payée. Les terres sont souvent expropriées au profit des colons.

## La société coloniale
Une minorité européenne concentre les postes et les revenus ; des intermédiaires locaux (chefs, interprètes, tirailleurs) servent l’administration. École et hôpital existent, mais restent très minoritaires : en 1914, une petite minorité d’enfants colonisés est scolarisée.

## Résistances et acculturation
Révoltes armées, refus de l’impôt, désertions, mais aussi appropriation des outils du colonisateur : premières élites formées à l’école française, premières revendications d’égalité — qui nourriront les mouvements nationalistes du XXe siècle.`,
          },
          questions: [
            ['Quel statut ont la plupart des colonisés ?', ['Sujets français, sans droits politiques', 'Citoyens français', 'Étrangers protégés', 'Ressortissants autonomes'], 0, 'Ils ne votent pas et relèvent d’un droit d’exception.'],
            ['Qu’est-ce que le Code de l’indigénat ?', ['Un régime d’exception permettant de punir les colonisés sans juge', 'Un code du travail colonial', 'Un recueil de coutumes locales', 'Un statut fiscal avantageux'], 0, 'Créé en Algérie en 1881, il est étendu à d’autres colonies.'],
            ['Quelle différence sépare une colonie d’un protectorat ?', ['Le protectorat conserve un souverain local sous contrôle français', 'La colonie est indépendante', 'Le protectorat élit des députés', 'La colonie n’a pas d’administration'], 0, 'Tunisie et Maroc sont des protectorats, l’AOF est administrée directement.'],
            ['L’économie coloniale est d’abord orientée vers l’exportation.', ['Vrai', 'Faux'], 0, 'Cultures commerciales et mines alimentent la métropole, souvent au détriment des cultures vivrières.'],
            ['Qui sont les tirailleurs ?', ['Des soldats recrutés dans les colonies', 'Des colons armés', 'Des policiers métropolitains', 'Des chefs coutumiers'], 0, 'Ils serviront massivement pendant la Première Guerre mondiale.'],
            ['La scolarisation des enfants colonisés est-elle généralisée avant 1914 ?', ['Non, elle reste très minoritaire', 'Oui, elle est obligatoire partout', 'Oui, dès 1882', 'Elle est interdite'], 0, 'L’école coloniale ne concerne qu’une petite minorité.'],
            ['Quel effet inattendu produit l’école coloniale ?', ['Elle forme des élites qui réclameront l’égalité', 'Elle fait disparaître les langues locales', 'Elle empêche toute revendication', 'Elle supprime l’indigénat'], 0, 'Les futurs leaders nationalistes en sont souvent issus.'],
            ['Que subissent fréquemment les terres des colonisés ?', ['Des expropriations au profit des colons', 'Une redistribution égalitaire', 'Une mise en jachère obligatoire', 'Un rachat au prix du marché'], 0, 'La question foncière est l’une des sources majeures de conflit.'],
          ],
        },
        // ===================================================================
        // HISTOIRE — Chapitre 6 : la Première Guerre mondiale
        // ===================================================================
        {
          titre: 'La Première Guerre mondiale : un embrasement mondial et ses grandes étapes',
          axe: 'La Première Guerre mondiale : le « suicide de l’Europe » et la fin des empires européens',
          lecon: {
            titre: 'Quatre ans, trois phases, un monde renversé',
            cours: `L’attentat de Sarajevo (28 juin 1914) enclenche en cinq semaines une guerre européenne qui devient mondiale et fait environ 10 millions de morts militaires.

## L’engrenage
Deux systèmes d’alliances (Triple-Alliance et Triple-Entente), une course aux armements, des nationalismes exacerbés et des rivalités coloniales. L’assassinat de l’archiduc **François-Ferdinand** déclenche l’ultimatum autrichien à la Serbie, puis les mobilisations en chaîne. La guerre est mondiale par les empires coloniaux, les Dominions et l’entrée d’acteurs extra-européens.

## 1914 : la guerre de mouvement
Le plan allemand traverse la Belgique ; la contre-offensive de la **Marne** (septembre 1914) arrête l’avance. Le front se fige de la mer du Nord à la Suisse : c’est la « **course à la mer** ».

## 1915-1917 : la guerre de position
Tranchées, artillerie massive, gaz, assauts très meurtriers : **Verdun** et la **Somme** (1916) coûtent des centaines de milliers de vies pour quelques kilomètres. 1917 est l’année de la crise : mutineries françaises, révolutions russes, mais aussi entrée en guerre des **États-Unis** (avril).

> Un front qui ne bouge plus n’est pas une guerre qui s’arrête : c’est une guerre qui consomme des hommes à la place des kilomètres.

## 1918 : le retour du mouvement et l’armistice
Sortie de la Russie (traité de Brest-Litovsk, mars 1918), offensives allemandes du printemps, puis contre-offensives alliées appuyées par les chars et les Américains. L’**armistice** est signé le **11 novembre 1918** à Rethondes.`,
          },
          questions: [
            ['Quel événement déclenche l’engrenage de juillet 1914 ?', ['L’assassinat de François-Ferdinand à Sarajevo', 'L’invasion de la Belgique', 'La bataille de la Marne', 'La crise d’Agadir'], 0, 'L’ultimatum autrichien à la Serbie enclenche les alliances.'],
            ['Quelle bataille arrête l’avance allemande en septembre 1914 ?', ['La bataille de la Marne', 'La bataille de Verdun', 'La bataille de la Somme', 'La bataille du Chemin des Dames'], 0, 'Elle met fin à la guerre de mouvement et ouvre la guerre de position.'],
            ['Qu’appelle-t-on la course à la mer ?', ['Le débordement des armées vers le nord jusqu’à la mer du Nord', 'Une bataille navale', 'La course aux cuirassés d’avant-guerre', 'Le blocus des ports allemands'], 0, 'Elle aboutit à un front continu de la mer du Nord à la Suisse.'],
            ['Quelles batailles marquent l’année 1916 ?', ['Verdun et la Somme', 'La Marne et Ypres', 'Tannenberg et Gallipoli', 'Jutland et Caporetto'], 0, 'Des centaines de milliers de morts pour des gains territoriaux minimes.'],
            ['Que se passe-t-il en 1917 ?', ['Mutineries françaises, révolutions russes et entrée en guerre des États-Unis', 'L’armistice', 'La bataille de la Marne', 'L’invasion de la Belgique'], 0, 'C’est l’année de tous les basculements.'],
            ['Le traité de Brest-Litovsk fait sortir la Russie de la guerre.', ['Vrai', 'Faux'], 0, 'Signé en mars 1918, il permet à l’Allemagne de reporter ses forces à l’Ouest.'],
            ['Quand l’armistice est-il signé ?', ['Le 11 novembre 1918', 'Le 28 juin 1919', 'Le 11 novembre 1919', 'Le 3 août 1914'], 0, 'Il est signé à Rethondes, dans la forêt de Compiègne.'],
            ['Pourquoi cette guerre est-elle mondiale ?', ['Par les empires coloniaux, les Dominions et l’entrée d’acteurs extra-européens', 'Parce qu’elle se déroule sur tous les continents à parts égales', 'Parce que tous les États du monde y participent', 'Parce qu’elle commence en Asie'], 0, 'Les combats se concentrent en Europe, mais les ressources et les hommes viennent du monde entier.'],
          ],
        },
        {
          titre: 'Les sociétés en guerre : des civils acteurs et victimes de la Première Guerre mondiale',
          axe: 'La Première Guerre mondiale : le « suicide de l’Europe » et la fin des empires européens',
          lecon: {
            titre: 'Quand la guerre devient totale',
            cours: `La Grande Guerre est une **guerre totale** : elle mobilise l’économie, les esprits et les populations entières, et elle atteint les civils comme jamais auparavant.

## L’arrière mobilisé
Les usines se convertissent à l’armement, les femmes remplacent les hommes aux champs, aux guichets et dans les usines (les « munitionnettes »), les colonies fournissent des soldats et des travailleurs. Les États dirigent l’économie, rationnent, empruntent massivement et financent par la dette et l’inflation.

## Les esprits mobilisés
La censure et la propagande — le « **bourrage de crâne** » — encadrent l’information. Les enfants, l’école, l’Église et la presse participent à l’effort. Le consentement s’use pourtant : grèves de 1917, mutineries, lassitude.

> Une guerre totale ne se gagne pas seulement au front : elle se gagne, ou se perd, dans les usines et dans les têtes.

## Les civils victimes
Occupation et réquisitions dans le nord de la France et en Belgique, bombardements, famines, déplacements de populations. Le **génocide des Arméniens** (1915-1916), perpétré par le pouvoir jeune-turc, fait environ 1,2 million de morts : c’est la violence extrême de cette guerre contre des civils.

## Le sortir de guerre
Deuil de masse (1,4 million de morts français), 4 millions de blessés, « gueules cassées », veuves et orphelins. Les monuments aux morts, présents dans presque chaque commune, et les commémorations du 11 Novembre inscrivent la guerre dans le paysage.`,
          },
          questions: [
            ['Qu’est-ce qu’une guerre totale ?', ['Une guerre qui mobilise l’économie, les esprits et les populations entières', 'Une guerre menée sur tous les continents', 'Une guerre sans prisonniers', 'Une guerre qui dure plus de quatre ans'], 0, 'Le front et l’arrière sont également engagés.'],
            ['Comment appelle-t-on les femmes travaillant dans les usines d’armement ?', ['Les munitionnettes', 'Les poilues', 'Les auxiliaires', 'Les marraines de guerre'], 0, 'Elles remplacent les hommes mobilisés, souvent à des salaires inférieurs.'],
            ['Qu’est-ce que le « bourrage de crâne » ?', ['La propagande et la censure de l’information', 'Un entraînement militaire', 'Une méthode d’enseignement', 'Un traitement médical'], 0, 'L’expression vient des soldats eux-mêmes, qui lisent la presse au front.'],
            ['Quel génocide est perpétré pendant la guerre ?', ['Le génocide des Arméniens', 'Le génocide rwandais', 'La Shoah', 'Le génocide cambodgien'], 0, 'Environ 1,2 million de morts entre 1915 et 1916, organisé par le pouvoir jeune-turc.'],
            ['Combien de soldats français meurent pendant la guerre ?', ['Environ 1,4 million', 'Environ 300 000', 'Environ 5 millions', 'Environ 700 000'], 0, 'Auxquels s’ajoutent 4 millions de blessés, dont de nombreux invalides.'],
            ['Les monuments aux morts sont présents dans presque toutes les communes françaises.', ['Vrai', 'Faux'], 0, 'Ils traduisent l’ampleur d’un deuil qui touche chaque village.'],
            ['Comment les États financent-ils la guerre ?', ['Par l’emprunt et l’inflation', 'Par l’impôt seul', 'Par les colonies uniquement', 'Par les dons privés'], 0, 'Les emprunts nationaux et la création monétaire pèseront sur l’après-guerre.'],
            ['Quel rôle jouent les colonies dans le conflit ?', ['Elles fournissent des soldats et des travailleurs', 'Elles restent à l’écart', 'Elles se révoltent toutes', 'Elles financent seules la guerre'], 0, 'Tirailleurs et travailleurs coloniaux sont massivement mobilisés.'],
          ],
        },
        {
          titre: 'Sortir de la guerre : la tentative de construction d’un ordre des nations démocratiques',
          axe: 'La Première Guerre mondiale : le « suicide de l’Europe » et la fin des empires européens',
          lecon: {
            titre: 'Une paix fondée sur des principes, et sur des rancunes',
            cours: `En 1919-1920, les vainqueurs tentent de fonder un ordre international nouveau : le droit des peuples, une organisation permanente, des démocraties. La construction est fragile dès le départ.

## Les traités
Le **traité de Versailles** (28 juin 1919) impose à l’Allemagne la reconnaissance de sa responsabilité (article 231), la perte de l’Alsace-Moselle et de ses colonies, une forte limitation militaire et de lourdes **réparations**. D’autres traités règlent le sort de l’Autriche-Hongrie, de la Bulgarie et de l’Empire ottoman.

## La fin des empires
Quatre empires disparaissent : allemand, austro-hongrois, russe et ottoman. Des États neufs naissent en Europe centrale (Pologne, Tchécoslovaquie, Yougoslavie, États baltes), au nom du **droit des peuples à disposer d’eux-mêmes** énoncé par **Wilson** dans ses 14 points. Les frontières ne coïncident jamais parfaitement avec les nationalités : des minorités restent partout.

> On a voulu une paix de principes, on a signé une paix de vainqueurs : c’est la contradiction que porte 1919.

## La Société des Nations
Créée en 1920, la **SDN** doit garantir la paix par la sécurité collective et l’arbitrage. Elle est affaiblie d’emblée : les États-Unis n’y entrent pas (refus du Sénat), l’Allemagne et la Russie soviétique en sont d’abord exclues, et elle n’a pas de force armée.

## Des sociétés bouleversées
Révolution russe et création de l’URSS, poussées révolutionnaires en Allemagne et en Hongrie, montée des nationalismes déçus (Italie), difficultés du retour à la vie civile : la sortie de guerre prépare déjà les crises des années 1930.`,
          },
          questions: [
            ['Quand le traité de Versailles est-il signé ?', ['Le 28 juin 1919', 'Le 11 novembre 1918', 'Le 10 janvier 1920', 'Le 18 janvier 1919'], 0, 'Cinq ans jour pour jour après l’attentat de Sarajevo.'],
            ['Que prévoit l’article 231 du traité ?', ['La responsabilité de l’Allemagne dans la guerre', 'La création de la SDN', 'Le désarmement général', 'Le droit des peuples'], 0, 'Il fonde juridiquement les réparations imposées à l’Allemagne.'],
            ['Combien d’empires disparaissent à l’issue de la guerre ?', ['Quatre : allemand, austro-hongrois, russe et ottoman', 'Deux', 'Trois', 'Cinq'], 0, 'Leur effondrement redessine l’Europe centrale et le Proche-Orient.'],
            ['Qui énonce le principe du droit des peuples à disposer d’eux-mêmes ?', ['Le président Wilson', 'Clemenceau', 'Lloyd George', 'Lénine seul'], 0, 'C’est l’un de ses 14 points, énoncés en janvier 1918.'],
            ['Quelle organisation est créée en 1920 pour garantir la paix ?', ['La Société des Nations', 'L’ONU', 'L’OTAN', 'La Croix-Rouge'], 0, 'Elle repose sur la sécurité collective et l’arbitrage.'],
            ['Les États-Unis adhèrent à la Société des Nations.', ['Vrai', 'Faux'], 1, 'Le Sénat américain refuse de ratifier : l’organisation est privée de son principal promoteur.'],
            ['Quels États naissent en Europe centrale après 1918 ?', ['La Pologne, la Tchécoslovaquie et la Yougoslavie', 'L’Allemagne et l’Italie', 'La Belgique et les Pays-Bas', 'La Grèce et la Bulgarie'], 0, 'Ils héritent de frontières contestées et de minorités importantes.'],
            ['Pourquoi parle-t-on d’une paix fragile ?', ['Parce qu’elle humilie les vaincus et laisse des minorités mécontentes', 'Parce qu’elle n’a été signée par personne', 'Parce qu’elle supprime les frontières', 'Parce qu’elle désarme tous les pays'], 0, 'Ces frustrations nourriront les révisions violentes des années 1930.'],
          ],
        },
        // ===================================================================
        // GÉOGRAPHIE — Chapitre 1 : les villes à l'échelle mondiale
        // ===================================================================
        {
          titre: 'Un monde de plus en plus urbanisé',
          axe: 'Les villes à l’échelle mondiale : le poids croissant des métropoles',
          lecon: {
            titre: 'Plus d’un humain sur deux vit en ville',
            cours: `Depuis 2007, la majorité de l’humanité vit en ville. L’urbanisation est le fait géographique majeur de notre époque, mais elle ne se déroule pas partout au même rythme.

## Mesurer l’urbanisation
Le **taux d’urbanisation** est la part de la population qui vit en ville : environ 56 % aujourd’hui, plus de 65 % prévus en 2050. La **croissance urbaine**, elle, mesure l’augmentation du nombre de citadins. Attention : les définitions de « ville » varient d’un État à l’autre, ce qui rend les comparaisons délicates.

## Deux moteurs
L’**exode rural** (départ des campagnes) et l’**accroissement naturel** des villes. Dans les pays du Sud, les deux jouent ensemble : c’est là que se concentre l’essentiel de la croissance urbaine mondiale.

> Les pays du Nord sont déjà très urbanisés mais croissent peu ; les pays du Sud s’urbanisent vite et fort.

## Des formes urbaines nouvelles
**Mégapoles** (plus de 10 millions d’habitants : Tokyo, Delhi, Shanghai, Le Caire…), **conurbations** (villes soudées), **mégalopoles** (chapelets urbains comme la mégalopole du Nord-Est américain, la mégalopole européenne ou japonaise). L’étalement urbain, la périurbanisation et les **bidonvilles** en sont les autres visages.

## Des défis
Logement, transports, eau, déchets, pollution, inégalités et vulnérabilité aux risques : la ville concentre à la fois les richesses et les problèmes, et les politiques de **ville durable** cherchent à y répondre.`,
          },
          questions: [
            ['Depuis quelle année la majorité de l’humanité vit-elle en ville ?', ['2007', '1950', '1990', '2020'], 0, 'Le seuil des 50 % de citadins est franchi au milieu des années 2000.'],
            ['Que mesure le taux d’urbanisation ?', ['La part de la population vivant en ville', 'La croissance annuelle des villes', 'La densité des villes', 'La surface bâtie'], 0, 'Il est d’environ 56 % dans le monde aujourd’hui.'],
            ['Qu’est-ce qu’une mégapole ?', ['Une agglomération de plus de 10 millions d’habitants', 'Une ville mondiale de commandement', 'Un chapelet de villes reliées', 'Une capitale politique'], 0, 'À ne pas confondre avec la mégalopole, qui est un ensemble de villes.'],
            ['Qu’est-ce qu’une mégalopole ?', ['Un vaste ensemble urbain formé de plusieurs grandes villes reliées', 'Une ville de plus de 20 millions d’habitants', 'Un quartier d’affaires', 'Une banlieue étendue'], 0, 'Exemples : la Megalopolis américaine, la mégalopole japonaise.'],
            ['Où se concentre aujourd’hui l’essentiel de la croissance urbaine ?', ['Dans les pays du Sud', 'En Europe occidentale', 'En Amérique du Nord', 'Au Japon'], 0, 'Afrique et Asie fournissent la quasi-totalité des nouveaux citadins.'],
            ['Le taux d’urbanisation des pays du Nord est faible.', ['Vrai', 'Faux'], 1, 'Il est très élevé (souvent plus de 80 %), mais il progresse peu.'],
            ['Quels sont les deux moteurs de la croissance urbaine ?', ['L’exode rural et l’accroissement naturel', 'L’immigration internationale et le tourisme', 'L’industrialisation et l’agriculture', 'La périurbanisation et le télétravail'], 0, 'Dans les pays du Sud, les deux se cumulent.'],
            ['Qu’appelle-t-on étalement urbain ?', ['L’extension spatiale de la ville sur ses marges', 'La densification du centre', 'La construction de tours', 'La rénovation des quartiers anciens'], 0, 'Il consomme des espaces agricoles et allonge les déplacements.'],
          ],
        },
        {
          titre: 'La métropolisation du monde',
          axe: 'Les villes à l’échelle mondiale : le poids croissant des métropoles',
          lecon: {
            titre: 'Quand quelques villes concentrent tout',
            cours: `La **métropolisation** est la concentration croissante des hommes, des activités et surtout des fonctions de commandement dans un petit nombre de grandes villes.

## Métropole n’est pas mégapole
Une **métropole** se définit par ses **fonctions** : sièges sociaux, bourses, universités et laboratoires, médias, institutions internationales, aéroports de rang mondial. Une mégapole se définit par sa **taille**. Lagos est une mégapole ; Zurich, bien plus petite, est une métropole.

## Les villes mondiales
Au sommet, quelques **villes globales** — New York, Londres, Tokyo, Paris, Hong Kong, Singapour, Shanghai — commandent l’économie mondiale. Elles concentrent les **flux** (capitaux, informations, personnes) et forment un **archipel métropolitain mondial** : elles sont souvent plus reliées entre elles qu’à leur propre arrière-pays.

> La métropolisation crée un monde de réseaux : ce qui compte n’est plus seulement la place sur la carte, mais la position dans les flux.

## Les acteurs
Firmes transnationales, États, collectivités locales, investisseurs, habitants. La compétition entre métropoles passe par le **marketing territorial**, les grands équipements (aéroports, gares TGV, quartiers d’affaires) et les événements internationaux (Jeux olympiques, expositions).

## Un processus inégal
La métropolisation renforce les métropoles au détriment des villes moyennes et des espaces périphériques : elle produit de la richesse et, en même temps, des fractures territoriales.`,
          },
          questions: [
            ['Qu’est-ce que la métropolisation ?', ['La concentration des hommes, des activités et du commandement dans les grandes villes', 'La croissance des villes moyennes', 'L’étalement des banlieues', 'Le retour à la campagne'], 0, 'Elle se mesure surtout aux fonctions, pas seulement à la population.'],
            ['Qu’est-ce qui définit une métropole ?', ['Ses fonctions de commandement', 'Sa seule population', 'Sa superficie', 'Son ancienneté'], 0, 'Sièges sociaux, bourses, universités, médias, hubs de transport.'],
            ['Une mégapole est forcément une métropole.', ['Vrai', 'Faux'], 1, 'Lagos ou Dacca sont des mégapoles sans être des métropoles de rang mondial.'],
            ['Qu’appelle-t-on l’archipel métropolitain mondial ?', ['Le réseau des grandes métropoles plus reliées entre elles qu’à leur arrière-pays', 'Un ensemble d’îles urbanisées', 'Les métropoles portuaires', 'Les capitales politiques'], 0, 'L’image insiste sur la mise en réseau par-dessus les territoires.'],
            ['Quelles villes sont considérées comme des villes globales ?', ['New York, Londres, Tokyo', 'Lagos, Dacca, Kinshasa', 'Lyon, Manchester, Osaka', 'Le Caire, Karachi, Lima'], 0, 'Elles concentrent les fonctions financières et décisionnelles de rang mondial.'],
            ['Qu’est-ce que le marketing territorial ?', ['La promotion d’une ville pour attirer investisseurs, touristes et habitants qualifiés', 'La vente de terrains publics', 'La publicité commerciale en ville', 'Le classement des villes par l’ONU'], 0, 'Il accompagne la compétition entre métropoles.'],
            ['Quel effet la métropolisation produit-elle sur les autres territoires ?', ['Elle accentue les fractures avec les villes moyennes et les périphéries', 'Elle les enrichit également', 'Elle n’a aucun effet', 'Elle vide les métropoles'], 0, 'C’est l’un des grands débats de l’aménagement contemporain.'],
            ['Quels acteurs pilotent la métropolisation ?', ['Firmes transnationales, États et collectivités', 'Uniquement l’ONU', 'Uniquement les habitants', 'Uniquement les investisseurs étrangers'], 0, 'Les stratégies se croisent et parfois s’opposent.'],
          ],
        },
        // ===================================================================
        // GÉOGRAPHIE — Chapitre 2 : des métropoles inégales et en mutation
        // ===================================================================
        {
          titre: 'Des métropoles inégalement attractives et influentes',
          axe: 'Des métropoles inégales et en mutation',
          lecon: {
            titre: 'Une hiérarchie mondiale des villes',
            cours: `Toutes les métropoles ne se valent pas : elles forment une **hiérarchie** que l’on peut lire à travers leur rayonnement, leurs fonctions et leur richesse.

## Les critères du classement
Poids économique (PIB, sièges sociaux, place financière), rayonnement culturel (musées, universités, médias), connectivité (aéroports, ports, câbles numériques), influence politique (institutions internationales). Les classements internationaux (GaWC, indices de villes mondiales) hiérarchisent ainsi les villes de rang mondial jusqu’aux métropoles régionales.

## Les inégalités entre métropoles
Les métropoles du Nord conservent l’essentiel des fonctions financières ; celles des pays émergents montent vite (Shanghai, Shenzhen, Dubaï, São Paulo, Bombay) ; beaucoup de métropoles du Sud restent des villes très peuplées mais peu connectées, dont les fonctions de commandement restent faibles.

> Une métropole peut concentrer des millions d’habitants et rester à l’écart des flux qui comptent.

## Les inégalités DANS la métropole
Quartiers d’affaires ultramodernes et **bidonvilles** cohabitent parfois à quelques kilomètres (Bombay et Dharavi, Le Cap, Rio). La **gentrification** transforme d’anciens quartiers populaires du centre, tandis que la **ségrégation socio-spatiale** et les quartiers fermés (gated communities) fragmentent l’espace urbain.

## Une hiérarchie mouvante
Le classement n’est pas figé : la montée des métropoles asiatiques, la concurrence des places financières et les stratégies d’attractivité redistribuent les positions en quelques décennies.`,
          },
          questions: [
            ['Quels critères servent à hiérarchiser les métropoles ?', ['Poids économique, rayonnement culturel, connectivité, influence politique', 'La superficie et le climat', 'Le nombre de monuments', 'La densité seule'], 0, 'Les classements croisent plusieurs indicateurs de fonctions.'],
            ['Quelles métropoles montent le plus vite dans la hiérarchie mondiale ?', ['Celles des pays émergents comme Shanghai ou Dubaï', 'Celles d’Europe de l’Ouest', 'Celles d’Amérique du Nord', 'Celles d’Afrique subsaharienne'], 0, 'La croissance asiatique redessine le classement mondial.'],
            ['Qu’est-ce que la gentrification ?', ['L’arrivée de populations aisées dans un quartier populaire réhabilité', 'La construction de logements sociaux', 'Le départ des habitants vers la périphérie', 'La rénovation des zones industrielles'], 0, 'Elle entraîne souvent l’éviction des habitants les plus modestes.'],
            ['Qu’est-ce qu’une gated community ?', ['Un quartier résidentiel fermé et sécurisé', 'Un bidonville', 'Un quartier d’affaires', 'Une zone industrielle'], 0, 'Elle traduit une fragmentation sociale de l’espace urbain.'],
            ['Dharavi, à Bombay, est un exemple de bidonville proche d’un quartier d’affaires.', ['Vrai', 'Faux'], 0, 'Les contrastes extrêmes se lisent parfois à l’échelle du quartier.'],
            ['Une métropole très peuplée est-elle forcément influente ?', ['Non, la population ne fait pas les fonctions de commandement', 'Oui, toujours', 'Oui, si elle est capitale', 'Oui, dans les pays du Sud'], 0, 'Beaucoup de mégapoles du Sud restent peu connectées aux flux mondiaux.'],
            ['Qu’est-ce que la ségrégation socio-spatiale ?', ['La séparation des groupes sociaux dans l’espace urbain', 'Le classement des villes', 'La spécialisation économique des quartiers', 'La densification du centre'], 0, 'Elle se lit dans les prix du foncier autant que dans les politiques de logement.'],
            ['Que mesure la connectivité d’une métropole ?', ['Son insertion dans les réseaux de transport et de communication', 'Le nombre de ses habitants', 'Sa surface bâtie', 'Son ancienneté'], 0, 'Hubs aéroportuaires, ports, câbles sous-marins et flux financiers.'],
          ],
        },
        {
          titre: 'Les mutations des espaces métropolitains',
          axe: 'Des métropoles inégales et en mutation',
          lecon: {
            titre: 'Recentrer, étaler, recomposer',
            cours: `Les métropoles ne cessent de se transformer : leurs centres se renouvellent, leurs périphéries s’étendent, et de nouveaux espaces apparaissent aux marges.

## Le centre : renouvellement et spécialisation
Les **CBD** (quartiers d’affaires) concentrent bureaux, sièges et services supérieurs — La Défense, Canary Wharf, Pudong. Les anciens espaces industriels ou portuaires sont réhabilités (**friches**, docks) et deviennent quartiers culturels ou résidentiels haut de gamme. Le foncier y est très cher.

## Les périphéries : étalement et périurbanisation
Lotissements, zones commerciales, plateformes logistiques et parcs technologiques s’installent en périphérie, le long des axes. La **périurbanisation** allonge les distances domicile-travail et multiplie les déplacements pendulaires.

> La métropole ne se lit plus dans ses limites administratives : elle se lit dans son aire d’influence.

## Les recompositions
Des **edge cities** et des pôles secondaires naissent aux marges ; les métropoles se polycentrisent. Les projets de **ville durable** (transports en commun, densification, végétalisation, écoquartiers) tentent de limiter l’étalement et l’empreinte carbone.

## Une gouvernance difficile
Une métropole rassemble des dizaines, parfois des centaines de communes. La coordination des transports, du logement et de l’urbanisme suppose des institutions dédiées (en France, les métropoles créées depuis 2014).`,
          },
          questions: [
            ['Qu’est-ce qu’un CBD ?', ['Le quartier central des affaires', 'Un quartier résidentiel fermé', 'Une zone industrielle', 'Un centre commercial périphérique'], 0, 'La Défense, Canary Wharf ou Pudong en sont des exemples.'],
            ['Qu’est-ce que la périurbanisation ?', ['L’extension de l’urbanisation au-delà des banlieues, sur des espaces ruraux', 'La densification du centre', 'La rénovation des friches', 'Le retour des habitants en ville'], 0, 'Elle allonge les migrations pendulaires.'],
            ['Que deviennent souvent les friches industrielles et portuaires des métropoles ?', ['Des quartiers culturels, résidentiels ou d’affaires réhabilités', 'Des espaces agricoles', 'Des zones abandonnées définitivement', 'Des ports de commerce agrandis'], 0, 'Les docks de Londres ou l’île de Nantes en sont des exemples.'],
            ['Qu’est-ce qu’une edge city ?', ['Un pôle d’activités développé en périphérie métropolitaine', 'Le centre historique', 'Un bidonville', 'Une ville nouvelle du Sud'], 0, 'Le terme vient des États-Unis : la métropole devient polycentrique.'],
            ['Les métropoles françaises ont reçu un statut institutionnel à partir de 2014.', ['Vrai', 'Faux'], 0, 'La loi MAPTAM crée les métropoles pour coordonner l’action des communes.'],
            ['Qu’est-ce qu’un déplacement pendulaire ?', ['Un trajet quotidien domicile-travail', 'Un déménagement saisonnier', 'Un trajet touristique', 'Une migration internationale'], 0, 'Il structure les transports de l’aire métropolitaine.'],
            ['Que cherchent les projets de ville durable ?', ['Limiter l’étalement et l’empreinte environnementale', 'Accélérer la périurbanisation', 'Supprimer les transports en commun', 'Construire uniquement des tours'], 0, 'Densification, transports collectifs, végétalisation, écoquartiers.'],
            ['Pourquoi la gouvernance métropolitaine est-elle difficile ?', ['Parce qu’une métropole rassemble de très nombreuses communes', 'Parce qu’elle dépend de l’ONU', 'Parce qu’elle n’a pas de budget', 'Parce que les habitants ne votent pas'], 0, 'Transports, logement et urbanisme dépassent les limites communales.'],
          ],
        },
        // ===================================================================
        // GÉOGRAPHIE — Chapitre 3 : la France, métropolisation et effets
        // ===================================================================
        {
          titre: 'La métropolisation du territoire français',
          axe: 'La France : la métropolisation et ses effets',
          lecon: {
            titre: 'Paris, les grandes villes, et les autres',
            cours: `La France n’échappe pas à la métropolisation : ses grandes villes concentrent la croissance, l’emploi qualifié et les fonctions de commandement, au détriment d’une partie du reste du territoire.

## Le poids de Paris
L’aire urbaine de Paris rassemble environ 13 millions d’habitants et près d’un tiers du PIB national. Elle est la seule métropole française de rang mondial : sièges sociaux du CAC 40, place financière, hubs de Roissy et d’Orly, universités et laboratoires. On parle de **macrocéphalie** pour désigner ce poids démesuré.

## Les métropoles régionales
Lyon, Marseille-Aix, Toulouse, Bordeaux, Lille, Nantes, Rennes, Montpellier, Strasbourg : ces métropoles gagnent des habitants et des emplois, portées par l’enseignement supérieur, la recherche, les services et parfois l’industrie de pointe (aéronautique à Toulouse).

> La croissance française se joue de plus en plus dans une quinzaine d’aires urbaines : c’est là que se concentrent emplois qualifiés et création de richesse.

## Les espaces à l’écart
Villes moyennes en difficulté (commerces de centre-ville fermés), espaces ruraux isolés, anciennes régions industrielles : ils cumulent vieillissement, faible croissance de l’emploi et sentiment d’abandon. Le **programme Action cœur de ville** tente d’y répondre.

## Les outils de l’aménagement
LGV, aéroports, métropoles instituées, pôles de compétitivité, contrats de plan État-région : les politiques publiques accompagnent la métropolisation tout en cherchant, parfois, à en corriger les effets.`,
          },
          questions: [
            ['Combien d’habitants compte environ l’aire urbaine de Paris ?', ['Environ 13 millions', 'Environ 5 millions', 'Environ 20 millions', 'Environ 8 millions'], 0, 'Elle produit près du tiers du PIB français.'],
            ['Que désigne la macrocéphalie du territoire français ?', ['Le poids démesuré de Paris par rapport aux autres villes', 'La forte densité du littoral', 'Le vieillissement de la population', 'La concentration industrielle du Nord'], 0, 'Aucune autre métropole française n’approche le poids parisien.'],
            ['Quelle métropole française est spécialisée dans l’aéronautique ?', ['Toulouse', 'Lille', 'Rennes', 'Strasbourg'], 0, 'Airbus y structure tout un système productif régional.'],
            ['Quels espaces français sont les plus fragilisés par la métropolisation ?', ['Les villes moyennes et les espaces ruraux isolés', 'Les métropoles régionales', 'Les littoraux touristiques', 'Les zones frontalières'], 0, 'Commerces fermés, vieillissement, faible création d’emplois.'],
            ['Qu’est-ce que le programme Action cœur de ville ?', ['Un programme de revitalisation des centres de villes moyennes', 'Un plan de construction de métropoles', 'Une politique agricole', 'Un plan de transport ferroviaire'], 0, 'Il vise commerces, logement et services dans les villes moyennes.'],
            ['La France compte plusieurs métropoles de rang mondial.', ['Vrai', 'Faux'], 1, 'Seule Paris atteint ce rang ; les autres sont des métropoles régionales.'],
            ['Qu’est-ce qu’un pôle de compétitivité ?', ['Un regroupement d’entreprises, de laboratoires et de formations sur un même territoire', 'Une zone franche fiscale', 'Un port industriel', 'Un parc de loisirs'], 0, 'Il vise à créer des synergies d’innovation.'],
            ['Quelle infrastructure renforce l’attractivité des métropoles régionales ?', ['La ligne à grande vitesse', 'Le canal à grand gabarit', 'L’autoroute urbaine', 'Le téléphérique'], 0, 'La LGV rapproche Bordeaux, Rennes ou Lyon de Paris — et accentue parfois leur dépendance.'],
          ],
        },
        {
          titre: 'Les métropoles françaises',
          axe: 'La France : la métropolisation et ses effets',
          lecon: {
            titre: 'Ce que la métropole change dans la vie quotidienne',
            cours: `Au-delà des classements, la métropolisation transforme concrètement l’organisation des villes françaises et la vie de leurs habitants.

## Une métropole, un statut
Depuis les lois MAPTAM (2014) et NOTRe (2015), 21 **métropoles** françaises exercent des compétences élargies : transports, développement économique, logement, déchets, aménagement. La **Métropole du Grand Paris** et celles de Lyon et Marseille ont des régimes particuliers.

## Des espaces qui se recomposent
Centres anciens réhabilités et parfois gentrifiés, quartiers d’affaires (La Défense, La Part-Dieu, Euralille), quartiers prioritaires de la politique de la ville, périurbain pavillonnaire, zones commerciales d’entrée de ville. Le **tramway**, revenu dans une vingtaine d’agglomérations, restructure les déplacements.

> Une métropole ne se juge pas seulement à sa croissance : elle se juge à l’écart entre ses quartiers.

## Les inégalités internes
Les écarts de revenus, de réussite scolaire et d’accès à l’emploi sont parfois considérables entre communes voisines d’une même métropole (Seine-Saint-Denis et Hauts-de-Seine, par exemple). La politique de la ville, la rénovation urbaine (ANRU) et les transports cherchent à réduire ces fractures.

## Les défis
Logement cher, congestion, pollution de l’air, artificialisation des sols, adaptation au changement climatique : ce sont aujourd’hui les grands chantiers des métropoles françaises.`,
          },
          questions: [
            ['Quelle loi de 2014 crée le statut de métropole en France ?', ['La loi MAPTAM', 'La loi NOTRe seule', 'La loi SRU', 'La loi Chevènement'], 0, 'La loi NOTRe (2015) complète ensuite la répartition des compétences.'],
            ['Combien de métropoles compte aujourd’hui la France ?', ['21', '5', '12', '40'], 0, 'Trois d’entre elles (Paris, Lyon, Marseille) ont un statut particulier.'],
            ['Quel quartier d’affaires se situe à Lyon ?', ['La Part-Dieu', 'La Défense', 'Euralille', 'Confluence uniquement'], 0, 'C’est le deuxième quartier d’affaires français par sa surface de bureaux.'],
            ['Qu’est-ce que l’ANRU ?', ['L’agence chargée de la rénovation urbaine des quartiers prioritaires', 'Une agence de transport', 'Un office du logement étudiant', 'Un opérateur foncier agricole'], 0, 'Elle finance démolitions, reconstructions et requalifications.'],
            ['Le tramway a disparu des villes françaises depuis les années 1960.', ['Vrai', 'Faux'], 1, 'Il est revenu depuis les années 1980 dans une vingtaine d’agglomérations.'],
            ['Quelles inégalités marquent les métropoles françaises ?', ['De fortes différences de revenus et de réussite scolaire entre communes voisines', 'Des écarts uniquement entre régions', 'Aucune inégalité notable', 'Des écarts limités au logement'], 0, 'Les contrastes internes sont parfois plus forts que les contrastes régionaux.'],
            ['Qu’est-ce que l’artificialisation des sols ?', ['La transformation d’espaces naturels ou agricoles en surfaces bâties ou revêtues', 'La pollution des sols', 'L’érosion des littoraux', 'La rotation des cultures'], 0, 'Elle est l’un des grands enjeux environnementaux de la périurbanisation.'],
            ['Quel défi environnemental concerne particulièrement les grandes agglomérations ?', ['La pollution de l’air', 'La désertification', 'La fonte des glaciers', 'L’acidification des océans'], 0, 'Trafic routier et chauffage y concentrent les émissions.'],
          ],
        },
        // ===================================================================
        // GÉOGRAPHIE — Chapitre 4 : les espaces de production dans le monde
        // ===================================================================
        {
          titre: 'Les espaces productifs en recomposition',
          axe: 'Les espaces de production dans le monde : une diversité croissante',
          lecon: {
            titre: 'La carte de la production se redessine',
            cours: `Un **espace productif** est un espace aménagé pour produire des biens ou des services. Sous l’effet de la mondialisation, sa carte se redessine en permanence.

## La division internationale du travail
Les **firmes transnationales** fragmentent la production : conception et marketing au Nord, fabrication là où les coûts sont bas, assemblage ailleurs encore. C’est la **DIT** (division internationale du travail), qui explique les chaînes de valeur mondiales — un smartphone conçu en Californie, fabriqué en Asie, vendu partout.

## Délocalisations et relocalisations
Les **délocalisations** ont vidé une partie des régions industrielles du Nord (Nord-Est américain, Ruhr, Nord de la France). Depuis quelques années, des **relocalisations** apparaissent : hausse des salaires asiatiques, coût du transport, robotisation, recherche de souplesse et souveraineté (santé, électronique) après la crise sanitaire.

> Un espace productif n’est jamais acquis : il se gagne et se perd au rythme des stratégies d’entreprises et des politiques publiques.

## Les nouveaux espaces gagnants
Technopôles et clusters (Silicon Valley, Bangalore, Shenzhen), zones franches et **ZES** chinoises, plateformes logistiques près des ports et des aéroports, espaces agricoles exportateurs (Brésil, Ukraine).

## Les acteurs
Firmes, États (subventions, infrastructures, fiscalité), collectivités, syndicats, consommateurs, ONG. Les choix de localisation résultent de leur rapport de force.`,
          },
          questions: [
            ['Qu’est-ce qu’un espace productif ?', ['Un espace aménagé pour produire des biens ou des services', 'Un espace densément peuplé', 'Une zone commerciale', 'Un espace protégé'], 0, 'Usine, technopôle, exploitation agricole, plateforme logistique.'],
            ['Que désigne la DIT ?', ['La division internationale du travail', 'La densité industrielle territoriale', 'Le droit international du travail', 'La direction des investissements techniques'], 0, 'Elle répartit les étapes de production entre pays selon les avantages de chacun.'],
            ['Qu’est-ce qu’une délocalisation ?', ['Le transfert d’une production vers un pays aux coûts plus faibles', 'La fermeture définitive d’une usine', 'L’ouverture d’un magasin à l’étranger', 'Le déménagement d’un siège social en province'], 0, 'Elle a touché durement les vieilles régions industrielles du Nord.'],
            ['Quels facteurs favorisent aujourd’hui les relocalisations ?', ['Hausse des salaires asiatiques, robotisation, recherche de souveraineté', 'Baisse des salaires européens', 'Disparition des firmes transnationales', 'Fin du commerce maritime'], 0, 'La crise sanitaire a accéléré la réflexion sur les chaînes trop longues.'],
            ['Qu’est-ce qu’une ZES en Chine ?', ['Une zone économique spéciale à fiscalité et réglementation avantageuses', 'Une zone écologique sensible', 'Une zone d’exclusion strategique', 'Une zone d’élevage subventionnée'], 0, 'Shenzhen en est l’exemple le plus célèbre.'],
            ['Qu’est-ce qu’un cluster ?', ['Une concentration d’entreprises et de laboratoires d’un même domaine sur un territoire', 'Un port de conteneurs', 'Une zone commerciale', 'Un pôle administratif'], 0, 'Silicon Valley, Bangalore, la Cosmetic Valley en France.'],
            ['Les chaînes de valeur mondiales fragmentent la production entre plusieurs pays.', ['Vrai', 'Faux'], 0, 'Conception, fabrication, assemblage et distribution peuvent se répartir sur trois continents.'],
            ['Quel acteur peut attirer une entreprise par des subventions et des infrastructures ?', ['L’État et les collectivités', 'Les ONG', 'Les syndicats', 'Les consommateurs'], 0, 'La concurrence fiscale entre territoires est l’un des ressorts de la localisation.'],
          ],
        },
        {
          titre: 'Une diversité croissante des espaces de production dans le monde',
          axe: 'Les espaces de production dans le monde : une diversité croissante',
          lecon: {
            titre: 'Des usines, mais aussi des serveurs et des champs',
            cours: `Produire ne signifie plus seulement fabriquer : les espaces productifs se diversifient, et les activités de service, de recherche et de logistique occupent une place croissante.

## Trois grandes familles
Les espaces **industriels** (zones industrialo-portuaires, parcs d’activités, ateliers), les espaces **agricoles** (agriculture productiviste exportatrice, agriculture vivrière, agriculture de firme), et les espaces de **services** (quartiers d’affaires, technopôles, centres d’appels, data centers).

## Les espaces de l’innovation
La recherche et développement se concentre dans quelques territoires : universités, laboratoires, start-up et capital-risque forment des écosystèmes difficiles à reproduire. Ils attirent une main-d’œuvre très qualifiée et font monter les prix du logement.

> Le nouveau facteur de localisation n’est plus seulement le charbon ou le port : c’est la matière grise, la connexion et l’accès aux marchés.

## Les espaces de la logistique
Le commerce mondial repose sur des **hubs** : ports à conteneurs (Shanghai, Singapour, Rotterdam), aéroports de fret, entrepôts géants le long des autoroutes. La **conteneurisation** a fait s’effondrer le coût du transport et rendu possible l’éclatement des chaînes de production.

## Des espaces en marge
Certains territoires restent à l’écart : faible infrastructure, instabilité politique, enclavement. Ailleurs, l’économie **informelle** occupe une part majeure de l’emploi productif, notamment dans les villes du Sud.`,
          },
          questions: [
            ['Quelles sont les trois grandes familles d’espaces productifs ?', ['Industriels, agricoles et de services', 'Urbains, ruraux et littoraux', 'Publics, privés et associatifs', 'Primaires, secondaires et informels'], 0, 'La production de services occupe une place croissante.'],
            ['Qu’est-ce qu’un data center ?', ['Un espace productif abritant des serveurs informatiques', 'Un centre commercial', 'Un centre de recherche médicale', 'Un entrepôt logistique classique'], 0, 'Très consommateur d’énergie, il est devenu un espace productif à part entière.'],
            ['Qu’a permis la conteneurisation ?', ['L’effondrement du coût du transport maritime', 'La fin des ports', 'La relocalisation des usines', 'La disparition du fret aérien'], 0, 'Elle rend possible l’éclatement mondial des chaînes de production.'],
            ['Quels sont les plus grands ports à conteneurs du monde ?', ['Shanghai et Singapour', 'Marseille et Gênes', 'New York et Boston', 'Le Havre et Anvers'], 0, 'L’Asie orientale concentre l’essentiel du trafic mondial.'],
            ['Qu’est-ce qu’un technopôle ?', ['Un espace associant recherche, formation et entreprises innovantes', 'Une zone industrielle ancienne', 'Un port de commerce', 'Un parc d’attractions'], 0, 'Sophia Antipolis en est l’exemple français le plus connu.'],
            ['L’économie informelle est marginale dans les villes du Sud.', ['Vrai', 'Faux'], 1, 'Elle représente au contraire une part majeure de l’emploi.'],
            ['Qu’est-ce qu’une agriculture productiviste ?', ['Une agriculture intensive tournée vers de forts rendements et l’exportation', 'Une agriculture de subsistance', 'Une agriculture biologique', 'Une agriculture de montagne'], 0, 'Mécanisation, intrants, irrigation et grandes exploitations.'],
            ['Quel facteur de localisation est devenu décisif pour les activités de pointe ?', ['La présence d’une main-d’œuvre très qualifiée', 'La proximité du charbon', 'La disponibilité de terres agricoles', 'Le climat chaud'], 0, 'Universités et laboratoires structurent les écosystèmes d’innovation.'],
          ],
        },
        // ===================================================================
        // GÉOGRAPHIE — Chapitre 5 : métropolisation, littoralisation, flux
        // ===================================================================
        {
          titre: 'Métropolisation et littoralisation des espaces productifs',
          axe: 'Métropolisation, littoralisation des espaces productifs et accroissement des flux',
          lecon: {
            titre: 'La production se concentre sur les côtes et dans les grandes villes',
            cours: `Deux mouvements réorganisent la géographie de la production : elle se concentre dans les métropoles, et elle se déplace vers les littoraux.

## La littoralisation
Environ 60 % de la population mondiale vit à moins de 100 km d’une côte, et l’essentiel du commerce mondial passe par la mer (plus de 80 % des marchandises en volume). Les **ZIP** (zones industrialo-portuaires) associent port en eau profonde, raffineries, sidérurgie, pétrochimie et logistique : Rotterdam, Shanghai, Singapour, Fos-sur-Mer.

## Pourquoi la côte ?
Elle offre un accès direct aux navires géants, un terrain disponible, et évite les ruptures de charge coûteuses. Les **hinterlands** (arrière-pays desservis) s’étendent grâce aux voies ferrées, aux fleuves et aux autoroutes.

> Ce qui compte n’est plus d’être près des matières premières, mais d’être près des flux.

## La métropolisation de la production
Sièges sociaux, R&D, finance, marketing, services aux entreprises se concentrent dans les métropoles, tandis que la fabrication s’éloigne. Une même entreprise peut ainsi occuper une métropole du Nord et une zone franche du Sud.

## Les effets et les limites
Concentration des richesses, congestion, pollution, vulnérabilité aux risques littoraux (submersion, tempêtes, montée du niveau de la mer). La littoralisation est efficace économiquement et fragile écologiquement.`,
          },
          questions: [
            ['Qu’est-ce que la littoralisation ?', ['La concentration des hommes et des activités sur les littoraux', 'La protection des côtes', 'La construction de digues', 'L’érosion des plages'], 0, 'Environ 60 % de la population mondiale vit à moins de 100 km d’une côte.'],
            ['Quelle part du commerce mondial de marchandises passe par la mer ?', ['Plus de 80 % en volume', 'Environ 40 %', 'Environ 20 %', 'Moins de 10 %'], 0, 'Le transport maritime est l’épine dorsale de la mondialisation.'],
            ['Qu’est-ce qu’une ZIP ?', ['Une zone industrialo-portuaire', 'Une zone d’investissement prioritaire', 'Une zone interdite à la pêche', 'Une zone industrielle protégée'], 0, 'Elle associe port en eau profonde, industries lourdes et logistique.'],
            ['Qu’est-ce que l’hinterland d’un port ?', ['L’arrière-pays qu’il dessert', 'La zone de pêche réservée', 'Le bassin portuaire', 'La zone franche du port'], 0, 'Sa qualité dépend des voies ferrées, fluviales et routières.'],
            ['Quelle activité reste concentrée dans les métropoles ?', ['La recherche, la finance et les sièges sociaux', 'L’assemblage industriel', 'L’extraction minière', 'L’agriculture intensive'], 0, 'La fabrication, elle, s’est largement éloignée.'],
            ['La littoralisation rend les activités plus vulnérables aux risques naturels.', ['Vrai', 'Faux'], 0, 'Submersion, tempêtes et montée du niveau marin menacent les ZIP.'],
            ['Quel port européen est le plus grand par son trafic ?', ['Rotterdam', 'Marseille', 'Hambourg', 'Barcelone'], 0, 'Il commande un hinterland qui remonte le Rhin jusqu’en Suisse.'],
            ['Pourquoi les industries lourdes s’installent-elles près des ports ?', ['Pour éviter des ruptures de charge coûteuses sur les matières pondéreuses', 'Pour profiter du tourisme', 'Pour le climat', 'Pour la main-d’œuvre qualifiée'], 0, 'Pétrole, minerai et céréales arrivent directement par navire.'],
          ],
        },
        {
          titre: 'Organisation des espaces productifs et accroissement des flux',
          axe: 'Métropolisation, littoralisation des espaces productifs et accroissement des flux',
          lecon: {
            titre: 'Des chaînes mondiales tenues par des flux',
            cours: `La fragmentation de la production n’est possible que parce que les flux — de marchandises, de capitaux, d’informations — sont devenus massifs, rapides et bon marché.

## Des flux de plus en plus intenses
Le commerce mondial a été multiplié par plusieurs dizaines depuis 1950. Les **routes maritimes** relient les trois grands pôles (Asie orientale, Amérique du Nord, Europe) et passent par des **points de passage stratégiques** : Malacca, Suez, Panama, Ormuz, Gibraltar.

## Les flux immatériels
Capitaux (places financières, investissements directs), données (câbles sous-marins, data centers), savoir-faire. Ils circulent en continu et rendent possible le pilotage à distance des chaînes de production.

> Une chaîne mondiale de production est d’abord une chaîne d’informations : la marchandise suit le flux de données, pas l’inverse.

## Les vulnérabilités
Blocage du canal de Suez (2021), pandémie, tensions en mer Rouge, piraterie, guerre : chaque incident révèle la fragilité du **flux tendu**. Les entreprises rallongent leurs stocks, diversifient leurs fournisseurs, régionalisent parfois leur production.

## Les effets environnementaux
Le transport maritime et aérien pèse lourd dans les émissions de gaz à effet de serre ; l’exigence de vitesse multiplie les trajets. Les débats sur le coût écologique des chaînes longues nourrissent les projets de circuits plus courts.`,
          },
          questions: [
            ['Quels sont les trois grands pôles du commerce mondial ?', ['Asie orientale, Amérique du Nord, Europe', 'Afrique, Asie du Sud, Océanie', 'Amérique latine, Afrique, Europe', 'Russie, Inde, Brésil'], 0, 'La Triade concentre l’essentiel des échanges, malgré la montée des émergents.'],
            ['Quel détroit d’Asie du Sud-Est est un point de passage majeur ?', ['Le détroit de Malacca', 'Le détroit de Béring', 'Le détroit de Messine', 'Le Bosphore'], 0, 'Une part considérable du commerce entre Asie, Europe et Moyen-Orient y transite.'],
            ['Que transportent les câbles sous-marins ?', ['Des données numériques', 'Du pétrole', 'Du gaz naturel', 'De l’électricité uniquement'], 0, 'La quasi-totalité du trafic internet intercontinental passe par eux.'],
            ['Qu’a révélé le blocage du canal de Suez en 2021 ?', ['La fragilité des chaînes en flux tendu', 'La fin du commerce maritime', 'L’inutilité du canal', 'La supériorité du fret aérien'], 0, 'Quelques jours de blocage ont désorganisé le commerce mondial.'],
            ['Qu’est-ce que le flux tendu ?', ['Une organisation qui limite les stocks et livre au moment voulu', 'Un transport à grande vitesse', 'Un flux financier spéculatif', 'Un pipeline sous tension'], 0, 'Efficace et peu coûteux, mais très vulnérable aux ruptures.'],
            ['Le transport maritime est sans effet sur les émissions de gaz à effet de serre.', ['Vrai', 'Faux'], 1, 'Il en représente une part significative, tout comme le fret aérien.'],
            ['Quel détroit contrôle une grande partie des exportations de pétrole du golfe Persique ?', ['Le détroit d’Ormuz', 'Le canal de Panama', 'Le détroit de Malacca', 'Le détroit de Gibraltar'], 0, 'Sa fermeture est une menace récurrente sur le marché pétrolier.'],
            ['Quelle réponse les entreprises apportent-elles aux ruptures de chaînes ?', ['Diversifier les fournisseurs et régionaliser une partie de la production', 'Supprimer tout stock', 'Abandonner le transport maritime', 'Produire uniquement en Asie'], 0, 'On parle de résilience et parfois de relocalisation régionale.'],
          ],
        },
        // ===================================================================
        // GÉOGRAPHIE — Chapitre 6 : les systèmes productifs français
        // ===================================================================
        {
          titre: 'Les systèmes productifs en France',
          axe: 'La France : les systèmes productifs entre valorisation locale et intégration européenne et mondiale',
          lecon: {
            titre: 'Ce que la France produit, et où',
            cours: `La France est la septième économie mondiale, très tertiarisée, avec quelques filières industrielles de rang mondial et une agriculture puissante.

## Une économie de services
Environ **75 %** des emplois relèvent des services : commerce, santé, éducation, tourisme (la France est la première destination touristique mondiale), finance, services aux entreprises. L’industrie ne pèse plus qu’environ 13 % du PIB, contre le double dans les années 1970 : c’est la **désindustrialisation**.

## Les points forts industriels
Aéronautique et spatial (Toulouse, Bordeaux), luxe et cosmétique, agroalimentaire, pharmacie, nucléaire, automobile (en difficulté), armement. Ces filières s’appuient sur des **pôles de compétitivité** et une recherche publique dense.

> Une industrie qui pèse moins dans l’emploi peut peser encore beaucoup dans les exportations : c’est le cas de l’aéronautique française.

## Des territoires très inégaux
L’Île-de-France concentre les sièges et la recherche ; l’Ouest et le Sud-Ouest gagnent des emplois ; le Nord et l’Est industriels ont perdu des centaines de milliers d’emplois depuis 1975. Les **friches industrielles** et la reconversion (Lille-Euralille, Nord-Pas-de-Calais) témoignent de cette mutation.

## L’agriculture
Première agriculture européenne en valeur, très exportatrice (céréales, vin, produits laitiers), mais confrontée à la baisse du nombre d’exploitations, au revenu agricole et aux exigences environnementales.`,
          },
          questions: [
            ['Quelle part des emplois français relève des services ?', ['Environ 75 %', 'Environ 50 %', 'Environ 30 %', 'Environ 90 %'], 0, 'La France est une économie très tertiarisée.'],
            ['Qu’est-ce que la désindustrialisation ?', ['La baisse du poids de l’industrie dans l’emploi et le PIB', 'La fermeture de toutes les usines', 'La délocalisation des services', 'Le recul de l’agriculture'], 0, 'L’industrie est passée d’environ 25 % à environ 13 % du PIB.'],
            ['Quelle filière industrielle française est de rang mondial et très exportatrice ?', ['L’aéronautique', 'Le textile', 'La sidérurgie', 'La construction navale de plaisance'], 0, 'Airbus structure un système productif régional autour de Toulouse.'],
            ['Quelle région concentre les sièges sociaux et la recherche ?', ['L’Île-de-France', 'Les Hauts-de-France', 'La Bretagne', 'La Corse'], 0, 'Elle capte la majorité des fonctions de commandement.'],
            ['La France est la première destination touristique mondiale.', ['Vrai', 'Faux'], 0, 'Le tourisme est un secteur productif majeur, très inégalement réparti sur le territoire.'],
            ['Quelles régions ont le plus souffert de la désindustrialisation ?', ['Le Nord et l’Est', 'Le Sud-Ouest', 'La Bretagne', 'L’Île-de-France'], 0, 'Mines, sidérurgie et textile y ont perdu des centaines de milliers d’emplois.'],
            ['Quel est le rang de l’agriculture française en Europe ?', ['Première en valeur de production', 'Troisième', 'Cinquième', 'Deuxième derrière l’Espagne'], 0, 'Céréales, vin et produits laitiers en font une puissance exportatrice.'],
            ['Qu’est-ce qu’une friche industrielle ?', ['Un ancien site de production abandonné', 'Une zone agricole en jachère', 'Un parc naturel', 'Une zone commerciale vide'], 0, 'Sa reconversion est un enjeu majeur d’aménagement.'],
          ],
        },
        {
          titre: 'L’intégration européenne et mondiale des espaces productifs français',
          axe: 'La France : les systèmes productifs entre valorisation locale et intégration européenne et mondiale',
          lecon: {
            titre: 'Entre terroir et marché mondial',
            cours: `Les espaces productifs français jouent sur deux tableaux : l’insertion dans les réseaux européens et mondiaux, et la valorisation de ressources locales impossibles à délocaliser.

## L’insertion européenne
L’Union européenne est le premier partenaire commercial de la France (environ 60 % des échanges). Les **régions frontalières** (Alsace, Nord, Rhône-Alpes) et les corridors de transport (autoroutes, LGV, Rhin) intègrent le territoire dans l’espace européen. La **PAC** soutient l’agriculture, et les fonds européens financent des projets régionaux.

## L’insertion mondiale
Firmes transnationales françaises (LVMH, TotalEnergies, Airbus, L’Oréal, Danone), investissements croisés, ports et aéroports de rang international. Mais la France a une balance commerciale déficitaire : elle importe plus de biens qu’elle n’en exporte.

> Deux stratégies coexistent : produire pour le monde, et produire ce que le monde ne peut pas copier.

## La valorisation locale
**AOP, AOC, IGP, Label rouge** : les signes de qualité protègent un savoir-faire lié à un lieu (champagne, comté, roquefort). Le tourisme, l’artisanat d’art, les circuits courts et l’agriculture biologique valorisent des ressources locales et créent des emplois non délocalisables.

## Les tensions
Concurrence intra-européenne, normes, coût du travail, conflits d’usage des sols, transition écologique : les systèmes productifs français doivent arbitrer entre compétitivité et ancrage territorial.`,
          },
          questions: [
            ['Quel est le premier partenaire commercial de la France ?', ['L’Union européenne', 'La Chine', 'Les États-Unis', 'Le Royaume-Uni'], 0, 'Environ 60 % des échanges français se font avec les pays de l’UE.'],
            ['Que protège une AOP ?', ['Un produit lié à un terroir et à un savoir-faire', 'Une marque commerciale', 'Un brevet industriel', 'Un label environnemental'], 0, 'Champagne, comté ou roquefort ne peuvent être produits ailleurs.'],
            ['Qu’est-ce que la PAC ?', ['La politique agricole commune européenne', 'La politique d’aménagement des campagnes', 'Le plan d’action climatique', 'La politique des aides au commerce'], 0, 'Elle représente une part importante du revenu de nombreux agriculteurs.'],
            ['La balance commerciale française des biens est excédentaire.', ['Vrai', 'Faux'], 1, 'Elle est déficitaire : la France importe plus de biens qu’elle n’en exporte.'],
            ['Quelles activités sont non délocalisables ?', ['Le tourisme, l’artisanat lié au terroir, les services de proximité', 'L’assemblage électronique', 'Les centres d’appels', 'La confection textile'], 0, 'Elles reposent sur une ressource attachée à un lieu.'],
            ['Quelles régions françaises sont les plus intégrées à l’espace européen ?', ['Les régions frontalières comme l’Alsace ou les Hauts-de-France', 'La Corse', 'Les DROM', 'Le Massif central'], 0, 'Travailleurs transfrontaliers, corridors de transport et échanges quotidiens.'],
            ['Citez une firme transnationale française du luxe.', ['LVMH', 'Volkswagen', 'Nestlé', 'Unilever'], 0, 'Le luxe est l’un des grands postes excédentaires du commerce extérieur français.'],
            ['Qu’est-ce qu’un circuit court ?', ['Une vente avec au plus un intermédiaire entre producteur et consommateur', 'Un transport ferroviaire régional', 'Une chaîne de production automatisée', 'Un réseau électrique local'], 0, 'Il valorise la proximité et la traçabilité.'],
          ],
        },
        // ===================================================================
        // GÉOGRAPHIE — Chapitre 7 : les espaces ruraux
        // ===================================================================
        {
          titre: 'Des espaces ruraux en recomposition',
          axe: 'Les espaces ruraux : multifonctionnalité ou fragmentation ?',
          lecon: {
            titre: 'La campagne n’est plus seulement agricole',
            cours: `Un **espace rural** se définit par une faible densité et un paysage largement ouvert — mais il n’est plus défini par l’agriculture seule.

## Une définition qui a changé
Autrefois, rural voulait dire agricole. Aujourd’hui, les agriculteurs représentent une petite minorité des actifs ruraux : on y trouve des employés, des ouvriers, des retraités, des télétravailleurs. La frontière ville-campagne s’efface au profit d’un **continuum urbain-rural**.

## Trois dynamiques opposées
Les campagnes **périurbaines** gagnent des habitants (maison individuelle, prix du foncier) ; les campagnes **touristiques et résidentielles** (littoral, montagne, Sud) attirent actifs et retraités ; les campagnes **isolées** (« diagonale des faibles densités », de la Meuse aux Landes) perdent des habitants et des services.

> Il n’existe pas UNE campagne : il existe des espaces ruraux dont les trajectoires divergent.

## Un renouveau démographique
Depuis les années 1970, la France rurale ne se vide plus globalement : le solde migratoire est redevenu positif dans beaucoup de communes. Le télétravail, accéléré depuis 2020, renforce ce mouvement — sans effacer les fractures.

## Les enjeux
Accès aux services (santé, école, commerce), mobilité et dépendance à la voiture, artificialisation des sols, conflits d’usage, maintien de l’activité agricole. La **multifonctionnalité** est une chance ; la **fragmentation** en est le risque.`,
          },
          questions: [
            ['Comment définit-on aujourd’hui un espace rural ?', ['Par sa faible densité et son paysage ouvert, plus seulement par l’agriculture', 'Par la présence exclusive d’exploitations agricoles', 'Par l’absence totale de services', 'Par son éloignement des routes'], 0, 'Les agriculteurs ne forment qu’une minorité des actifs ruraux.'],
            ['Qu’est-ce qu’une campagne périurbaine ?', ['Un espace rural sous l’influence directe d’une ville proche', 'Une campagne isolée', 'Un espace touristique de montagne', 'Une zone agricole protégée'], 0, 'Elle gagne des habitants qui travaillent en ville.'],
            ['Qu’appelle-t-on la diagonale des faibles densités ?', ['Une bande allant du Nord-Est au Sud-Ouest où les densités sont très basses', 'Le littoral atlantique', 'La vallée du Rhône', 'Le Bassin parisien'], 0, 'Elle traverse la France de la Meuse aux Landes.'],
            ['Les espaces ruraux français continuent de se vider globalement.', ['Vrai', 'Faux'], 1, 'Depuis les années 1970, beaucoup de communes rurales regagnent des habitants.'],
            ['Quel phénomène récent renforce l’attractivité rurale ?', ['Le développement du télétravail', 'La baisse des prix agricoles', 'La fermeture des écoles', 'La hausse du prix des carburants'], 0, 'Il s’est accéléré à partir de 2020.'],
            ['Qu’est-ce que la multifonctionnalité des espaces ruraux ?', ['Le fait qu’ils remplissent plusieurs fonctions : productive, résidentielle, récréative, écologique', 'Le fait qu’ils accueillent plusieurs cultures', 'La diversité des paysages', 'La présence de plusieurs communes'], 0, 'C’est la notion centrale du chapitre.'],
            ['Quel est le principal handicap des campagnes isolées ?', ['L’éloignement des services et la dépendance à la voiture', 'L’excès de population', 'La pollution industrielle', 'Le prix élevé du foncier'], 0, 'Santé, école et commerces s’éloignent avec la baisse de population.'],
            ['Qu’est-ce que le continuum urbain-rural ?', ['L’idée d’un dégradé entre ville et campagne plutôt qu’une frontière nette', 'La fusion administrative des communes', 'Un corridor écologique', 'Une ligne de transport'], 0, 'Le périurbain rend la limite ville-campagne floue.'],
          ],
        },
        {
          titre: 'Les espaces ruraux : des espaces toujours agricoles ?',
          axe: 'Les espaces ruraux : multifonctionnalité ou fragmentation ?',
          lecon: {
            titre: 'Moins d’agriculteurs, autant de terres cultivées',
            cours: `L’agriculture occupe encore l’essentiel des surfaces rurales, mais elle emploie de moins en moins de personnes et prend des formes très différentes selon les régions du monde.

## Un paradoxe
En France, la surface agricole utile couvre environ **la moitié du territoire**, alors que les agriculteurs représentent moins de 2 % des actifs. Concentration des exploitations, mécanisation et hausse des rendements expliquent ce paradoxe.

## Des agricultures très inégales
L’**agriculture productiviste** (mécanisée, intensive, exportatrice) domine dans les pays du Nord et dans les grands pays émergents ; l’**agriculture vivrière** nourrit encore des centaines de millions de personnes au Sud ; l’**agriculture de firme**, financée par des investisseurs, s’étend en Amérique du Sud et en Europe de l’Est.

> Les rendements ont augmenté plus vite que le nombre d’agriculteurs n’a diminué : c’est ce qui a permis de nourrir une population multipliée par trois depuis 1950.

## Des modèles contestés
Pollution des sols et de l’eau, pesticides, érosion de la biodiversité, bien-être animal, émissions de méthane. En réponse : agriculture **biologique**, agroécologie, circuits courts, réduction des intrants.

## L’accaparement des terres
Des États et des firmes achètent ou louent d’immenses surfaces à l’étranger (**land grabbing**), surtout en Afrique et en Amérique latine, pour sécuriser leur approvisionnement — au risque d’évincer les paysanneries locales.`,
          },
          questions: [
            ['Quelle part du territoire français la surface agricole utile couvre-t-elle environ ?', ['La moitié', 'Un quart', 'Les trois quarts', 'Un dixième'], 0, 'Alors que les agriculteurs représentent moins de 2 % des actifs.'],
            ['Qu’est-ce que l’agriculture vivrière ?', ['Une agriculture destinée d’abord à nourrir la famille du producteur', 'Une agriculture exportatrice', 'Une agriculture biologique', 'Une agriculture urbaine'], 0, 'Elle reste dominante dans une partie du Sud.'],
            ['Qu’est-ce que l’agriculture de firme ?', ['Une agriculture pilotée par des investisseurs sur de très grandes surfaces', 'Une exploitation familiale', 'Une coopérative agricole', 'Une ferme pédagogique'], 0, 'Elle se développe notamment en Amérique du Sud et en Europe de l’Est.'],
            ['Qu’est-ce que le land grabbing ?', ['L’acquisition massive de terres agricoles à l’étranger par des États ou des firmes', 'La lutte contre l’érosion', 'Le remembrement des parcelles', 'La vente de terres aux jeunes agriculteurs'], 0, 'Il concerne surtout l’Afrique subsaharienne et l’Amérique latine.'],
            ['Le nombre d’exploitations agricoles françaises augmente.', ['Vrai', 'Faux'], 1, 'Il diminue fortement depuis des décennies, tandis que la taille moyenne augmente.'],
            ['Que reproche-t-on au modèle productiviste ?', ['Ses effets sur les sols, l’eau et la biodiversité', 'Ses faibles rendements', 'Son coût pour les consommateurs', 'Son manque de mécanisation'], 0, 'Intrants et spécialisation pèsent sur les milieux.'],
            ['Qu’est-ce que l’agroécologie ?', ['Une agriculture qui s’appuie sur les fonctionnements naturels pour réduire les intrants', 'L’agriculture hors-sol', 'L’agriculture urbaine uniquement', 'Un label commercial'], 0, 'Rotation, couverts végétaux, haies, agroforesterie.'],
            ['Pourquoi la production agricole mondiale a-t-elle pu tripler depuis 1950 ?', ['Grâce aux rendements, à la mécanisation et à l’irrigation', 'Grâce à l’augmentation du nombre d’agriculteurs', 'Grâce à la baisse de la population', 'Grâce à la réduction des surfaces cultivées'], 0, 'La révolution verte a transformé les rendements.'],
          ],
        },
        {
          titre: 'Des espaces ruraux aux fonctions variées',
          axe: 'Les espaces ruraux : multifonctionnalité ou fragmentation ?',
          lecon: {
            titre: 'Habiter, produire, se détendre, protéger',
            cours: `Les espaces ruraux remplissent aujourd’hui quatre grandes fonctions, qui se superposent sur les mêmes territoires.

## La fonction productive
Agriculture, sylviculture, extraction, mais aussi industries agroalimentaires, ateliers et petites entreprises. Les énergies renouvelables (éolien, solaire, méthanisation) créent de nouveaux revenus — et de nouveaux conflits.

## La fonction résidentielle
Le rural accueille des ménages qui travaillent en ville, des retraités et des résidents secondaires. Le logement y est moins cher, mais la dépendance à la voiture est forte et les services publics sont plus éloignés.

## La fonction récréative
Tourisme vert, randonnée, sports de nature, gîtes, festivals : la campagne devient un espace de loisirs pour les citadins. La montagne et le littoral concentrent l’essentiel des flux touristiques.

> Ces fonctions ne s’additionnent pas toujours pacifiquement : elles se disputent le même sol.

## La fonction écologique
Puits de carbone, biodiversité, ressources en eau, paysages. Les **parcs naturels régionaux**, les parcs nationaux et les zones Natura 2000 encadrent la protection, tandis que la trame verte et bleue cherche à relier les milieux.

## Multifonctionnalité ou fragmentation ?
Là où les fonctions se complètent, le territoire est dynamique. Là où elles s’excluent — agriculture contre lotissements, éolien contre paysage, tourisme contre habitants permanents — la campagne se fragmente.`,
          },
          questions: [
            ['Quelles sont les quatre grandes fonctions des espaces ruraux ?', ['Productive, résidentielle, récréative et écologique', 'Agricole, industrielle, minière et commerciale', 'Politique, sociale, culturelle et économique', 'Résidentielle, scolaire, sanitaire et sportive'], 0, 'Elles se superposent sur les mêmes espaces.'],
            ['Quelle nouvelle activité productive se développe dans les campagnes ?', ['Les énergies renouvelables (éolien, solaire, méthanisation)', 'La sidérurgie', 'La construction navale', 'La pétrochimie'], 0, 'Elles apportent des revenus mais suscitent des oppositions.'],
            ['Qu’est-ce qu’un parc naturel régional ?', ['Un territoire habité, protégé et géré par une charte', 'Une réserve intégrale sans habitants', 'Un parc d’attractions', 'Une forêt domaniale'], 0, 'Il concilie protection, activités et développement local.'],
            ['Qu’est-ce que la trame verte et bleue ?', ['Un réseau de continuités écologiques terrestres et aquatiques', 'Un plan d’urbanisme', 'Un label agricole', 'Un réseau de pistes cyclables'], 0, 'Elle vise à relier les milieux naturels fragmentés.'],
            ['Le tourisme vert est une fonction récréative des espaces ruraux.', ['Vrai', 'Faux'], 0, 'Randonnée, gîtes, sports de nature : les citadins y cherchent un cadre de loisirs.'],
            ['Pourquoi la fonction résidentielle progresse-t-elle dans le rural ?', ['Logement moins cher et cadre de vie recherché', 'Meilleure desserte en transports en commun', 'Concentration des services publics', 'Emplois plus nombreux qu’en ville'], 0, 'La contrepartie est la dépendance à la voiture.'],
            ['Que sont les zones Natura 2000 ?', ['Un réseau européen d’espaces protégés pour la biodiversité', 'Des zones franches rurales', 'Des zones agricoles prioritaires', 'Des zones d’activité économique'], 0, 'Elles imposent des règles de gestion des habitats et des espèces.'],
            ['Quand parle-t-on de fragmentation plutôt que de multifonctionnalité ?', ['Quand les fonctions s’excluent et entrent en conflit sur le même espace', 'Quand elles se complètent', 'Quand la population augmente', 'Quand l’agriculture domine'], 0, 'C’est l’alternative posée par l’intitulé du chapitre.'],
          ],
        },
        {
          titre: 'Des espaces ruraux convoités',
          axe: 'Les espaces ruraux : multifonctionnalité ou fragmentation ?',
          lecon: {
            titre: 'Un même sol, plusieurs prétendants',
            cours: `Parce qu’ils remplissent plusieurs fonctions, les espaces ruraux sont **convoités** : agriculteurs, promoteurs, industriels, écologistes et habitants se disputent le même sol.

## Les conflits d’usage
Extension des lotissements sur des terres agricoles, implantation d’éoliennes ou de fermes solaires, carrières, entrepôts logistiques, grands projets d’infrastructure. Chaque projet oppose des acteurs aux intérêts différents, souvent devant les tribunaux.

## Des exemples emblématiques
Notre-Dame-des-Landes (projet d’aéroport abandonné en 2018), les « méga-bassines » de retenue d’eau, les zones commerciales d’entrée de ville, la lutte contre l’artificialisation.

> Quand plusieurs projets légitimes visent la même parcelle, l’aménagement devient un arbitrage politique, pas un calcul technique.

## L’enjeu de l’artificialisation
La France a artificialisé plusieurs dizaines de milliers d’hectares par an. La loi Climat et résilience (2021) fixe l’objectif **ZAN** (zéro artificialisation nette) à l’horizon 2050, avec une réduction de moitié d’ici 2031 : un objectif qui, lui aussi, crée des tensions entre communes.

## Les outils de régulation
PLU et SCoT (documents d’urbanisme), zones agricoles protégées, SAFER (contrôle du foncier agricole), enquêtes publiques, concertation. Ils organisent l’arbitrage, sans supprimer le conflit.`,
          },
          questions: [
            ['Qu’est-ce qu’un conflit d’usage ?', ['Une opposition entre acteurs qui veulent utiliser différemment le même espace', 'Un litige entre voisins', 'Un désaccord sur un prix agricole', 'Une grève des agriculteurs'], 0, 'Il naît de la multifonctionnalité des espaces ruraux.'],
            ['Quel projet d’aéroport a été abandonné en 2018 après une longue mobilisation ?', ['Notre-Dame-des-Landes', 'Roissy Terminal 4', 'Toulouse-Francazal', 'Nantes-Atlantique'], 0, 'Il est devenu un symbole des conflits d’aménagement.'],
            ['Que signifie l’objectif ZAN ?', ['Zéro artificialisation nette', 'Zone agricole naturelle', 'Zone d’aménagement négocié', 'Zéro azote agricole'], 0, 'Fixé par la loi Climat et résilience de 2021 à l’horizon 2050.'],
            ['À quoi sert un PLU ?', ['À fixer les règles d’utilisation des sols d’une commune', 'À protéger les monuments historiques', 'À gérer les aides agricoles', 'À organiser les transports scolaires'], 0, 'Le SCoT joue le même rôle à l’échelle intercommunale.'],
            ['Qu’est-ce qu’une SAFER ?', ['Un organisme qui régule le marché du foncier agricole', 'Une coopérative de vente', 'Un syndicat agricole', 'Une agence de l’eau'], 0, 'Elle peut préempter pour éviter la spéculation et installer des jeunes agriculteurs.'],
            ['Les projets d’éoliennes font consensus dans les campagnes.', ['Vrai', 'Faux'], 1, 'Ils opposent souvent revenus locaux, paysage et riverains.'],
            ['Qu’est-ce qu’une méga-bassine ?', ['Une grande retenue d’eau pour l’irrigation, objet de contestations', 'Un bassin de rétention urbain', 'Un lac artificiel touristique', 'Une station d’épuration'], 0, 'Elle cristallise les conflits sur le partage de l’eau.'],
            ['Pourquoi l’artificialisation des sols pose-t-elle problème ?', ['Elle réduit les terres agricoles, imperméabilise et fragmente les milieux', 'Elle augmente les rendements', 'Elle protège la biodiversité', 'Elle limite les inondations'], 0, 'L’imperméabilisation aggrave au contraire le ruissellement.'],
          ],
        },
        // ===================================================================
        // GÉOGRAPHIE — Chapitre 8 : la France, des espaces ruraux multifonctionnels
        // ===================================================================
        {
          titre: 'Les recompositions des espaces ruraux français',
          axe: 'La France : des espaces ruraux multifonctionnels, entre initiatives locales et politiques européennes',
          lecon: {
            titre: 'Trois France rurales',
            cours: `Les campagnes françaises ne suivent pas une trajectoire unique : selon leur position et leurs ressources, elles gagnent ou perdent des habitants et des fonctions.

## Les campagnes des villes
À proximité des agglomérations, la population augmente fortement : lotissements, zones d’activité, mais aussi pression sur les terres agricoles et allongement des trajets. Ce sont les espaces les plus touchés par l’**artificialisation**.

## Les campagnes attractives
Littoral atlantique et méditerranéen, vallées alpines, Sud-Ouest : elles attirent retraités, actifs et résidences secondaires. L’économie y est **résidentielle et touristique**, avec un risque de flambée des prix du logement pour les habitants permanents.

## Les campagnes fragiles
La diagonale des faibles densités, une partie des massifs et des zones industrielles rurales cumulent vieillissement, recul des services, difficultés d’accès aux soins (**déserts médicaux**) et fermetures de commerces et d’écoles.

> La question n’est plus « la campagne se vide-t-elle ? », mais « quelles campagnes gagnent, lesquelles décrochent ? ».

## Les DROM
Les espaces ruraux ultramarins ont leurs propres dynamiques : forte croissance démographique, agriculture d’exportation (banane, canne), contraintes foncières et risques naturels.

## Les mobilités
La voiture reste indispensable ; les mobilités quotidiennes structurent la vie rurale, et la question du carburant y a une portée sociale directe, comme l’a montré le mouvement des gilets jaunes en 2018.`,
          },
          questions: [
            ['Quels espaces ruraux français gagnent le plus d’habitants ?', ['Les campagnes périurbaines et les campagnes attractives du Sud et de l’Ouest', 'Les campagnes de la diagonale des faibles densités', 'Les zones de montagne isolées', 'Les anciennes régions minières'], 0, 'Proximité des villes, littoral et cadre de vie expliquent ces gains.'],
            ['Qu’est-ce qu’une économie résidentielle ?', ['Une économie qui vit des revenus des habitants et des visiteurs plutôt que de la production locale', 'Une économie fondée sur le bâtiment', 'Une économie agricole', 'Une économie industrielle'], 0, 'Retraites, salaires venus d’ailleurs et tourisme la font vivre.'],
            ['Qu’est-ce qu’un désert médical ?', ['Un territoire où l’accès aux soins est très difficile faute de professionnels', 'Une zone sans hôpital public', 'Une région aride', 'Un territoire sans pharmacie'], 0, 'Il concerne aussi certaines périphéries urbaines.'],
            ['Quel espace français cumule vieillissement et recul des services ?', ['La diagonale des faibles densités', 'Le littoral atlantique', 'La couronne parisienne', 'La vallée du Rhône'], 0, 'Elle traverse la France du Nord-Est au Sud-Ouest.'],
            ['La voiture est indispensable dans la plupart des espaces ruraux français.', ['Vrai', 'Faux'], 0, 'La dépendance automobile donne une portée sociale directe au prix des carburants.'],
            ['Quelles productions agricoles dominent dans certains DROM ?', ['La banane et la canne à sucre', 'Le blé et le colza', 'La betterave et la pomme de terre', 'Le maïs et le tournesol'], 0, 'Ces cultures d’exportation structurent leurs espaces ruraux.'],
            ['Quel mouvement social de 2018 a mis en lumière les mobilités rurales ?', ['Les gilets jaunes', 'Nuit debout', 'Les bonnets rouges', 'La jacquerie agricole'], 0, 'Il est parti d’une taxe sur les carburants.'],
            ['Quel est le principal effet de la périurbanisation sur les terres agricoles ?', ['Elle les réduit par l’artificialisation', 'Elle les protège', 'Elle les rend plus productives', 'Elle n’a aucun effet'], 0, 'Des milliers d’hectares disparaissent chaque année.'],
          ],
        },
        {
          titre: 'Aménagement et développement des espaces ruraux français',
          axe: 'La France : des espaces ruraux multifonctionnels, entre initiatives locales et politiques européennes',
          lecon: {
            titre: 'Qui aménage la campagne, et avec quel argent ?',
            cours: `L’aménagement des espaces ruraux résulte d’un jeu à plusieurs niveaux : l’Union européenne, l’État, les régions, les intercommunalités et les acteurs locaux.

## L’échelon européen
La **PAC** représente la première dépense agricole : aides directes au revenu (premier pilier) et développement rural (second pilier, programme **LEADER**). Les **fonds structurels** (FEDER, FSE) financent équipements, numérique et projets locaux.

## L’échelon national et régional
Politiques de revitalisation, maisons de santé, zones de revitalisation rurale, plan France Très Haut Débit, contrats de plan État-région. Les **régions** gèrent une partie des fonds européens et animent le développement économique.

> Une politique rurale efficace ne se décrète pas d’en haut : elle combine un cadre européen, des financements nationaux et des projets portés localement.

## Les initiatives locales
Coopératives, circuits courts, AMAP, tiers-lieux et espaces de coworking, reprise de commerces par des communes, écotourisme, valorisation du patrimoine, énergies citoyennes. Les **PNR** et les intercommunalités servent de cadre à ces projets.

## Les débats
Faut-il concentrer les moyens sur les territoires qui décrochent, ou soutenir ceux qui réussissent ? Comment concilier attractivité, préservation des terres et transition écologique ? L’aménagement rural est un choix politique, pas une évidence technique.`,
          },
          questions: [
            ['Quel programme européen finance des projets de développement rural ?', ['LEADER, dans le second pilier de la PAC', 'Erasmus', 'Horizon Europe', 'Le FEDER uniquement'], 0, 'Il soutient des initiatives portées par des acteurs locaux.'],
            ['Que finance le premier pilier de la PAC ?', ['Les aides directes au revenu des agriculteurs', 'La recherche agronomique', 'Les routes rurales', 'Le tourisme vert'], 0, 'Le second pilier concerne le développement rural.'],
            ['Qu’est-ce qu’une AMAP ?', ['Une association qui lie consommateurs et producteurs par des paniers réguliers', 'Une aide agricole européenne', 'Un syndicat agricole', 'Un label de qualité'], 0, 'C’est une forme de circuit court.'],
            ['Qu’est-ce qu’un tiers-lieu ?', ['Un espace partagé de travail, de formation ou de création', 'Une résidence secondaire', 'Un bâtiment agricole', 'Une salle des fêtes communale'], 0, 'Les tiers-lieux ruraux accompagnent le télétravail.'],
            ['Quel plan a étendu le très haut débit aux campagnes françaises ?', ['Le plan France Très Haut Débit', 'Le plan Marshall', 'Le plan Borloo', 'Le plan Rural 2020'], 0, 'La couverture numérique est une condition de l’attractivité rurale.'],
            ['Les régions gèrent une partie des fonds européens destinés aux territoires.', ['Vrai', 'Faux'], 0, 'Elles sont autorités de gestion pour plusieurs programmes.'],
            ['Qu’est-ce qu’une maison de santé pluriprofessionnelle ?', ['Un lieu regroupant plusieurs professionnels de santé pour maintenir l’offre de soins', 'Un hôpital de proximité', 'Une pharmacie mutualisée', 'Un centre thermal'], 0, 'C’est une réponse fréquente aux déserts médicaux.'],
            ['Quel est le principal débat de l’aménagement rural ?', ['Concentrer les moyens sur les territoires en difficulté ou soutenir les dynamiques qui marchent', 'Supprimer ou non la PAC', 'Fermer ou non les écoles', 'Développer ou non le tourisme'], 0, 'C’est un arbitrage politique entre équité et efficacité.'],
          ],
        },
        // ===================================================================
        // GÉOGRAPHIE — Chapitre 9 : la Chine
        // ===================================================================
        {
          titre: 'Développement et inégalités en Chine',
          axe: 'La Chine : des recompositions spatiales multiples',
          lecon: {
            titre: 'Une croissance spectaculaire, un territoire déséquilibré',
            cours: `En quarante ans, la Chine est devenue la deuxième économie mondiale. Cette croissance a profondément transformé son territoire — et creusé ses inégalités.

## Les étapes du décollage
Réformes de **Deng Xiaoping** à partir de 1978, ouverture aux investissements étrangers, création des **zones économiques spéciales** (Shenzhen, 1980), entrée à l’**OMC** en 2001. La Chine devient « l’atelier du monde », puis monte en gamme (électronique, véhicules électriques, spatial, IA).

## Un développement inégal
Le **littoral** oriental concentre la richesse, les usines exportatrices et les métropoles ; l’**intérieur** et l’**Ouest** restent en retrait, malgré les plans de développement (« Go West », nouvelles routes ferroviaires). L’écart de PIB par habitant entre provinces reste considérable.

> La Chine n’est pas un pays émergent uniforme : c’est un pays riche sur ses côtes et en développement dans ses marges.

## Le hukou et les migrations
Le **hukou** (permis de résidence) attache un habitant à sa région d’origine. Des centaines de millions de **mingong** (travailleurs migrants) ont rejoint les villes côtières sans y avoir pleinement accès aux droits sociaux : c’est la plus grande migration interne de l’histoire.

## Les défis
Vieillissement rapide (conséquence de la politique de l’enfant unique, abandonnée en 2015), dette, ralentissement de la croissance, dépendance aux exportations, tensions commerciales et environnementales.`,
          },
          questions: [
            ['Qui lance les réformes économiques chinoises à partir de 1978 ?', ['Deng Xiaoping', 'Mao Zedong', 'Xi Jinping', 'Zhou Enlai'], 0, 'Le « socialisme de marché » ouvre le pays aux investissements.'],
            ['Quelle ville est la ZES emblématique de l’ouverture chinoise ?', ['Shenzhen', 'Pékin', 'Chengdu', 'Harbin'], 0, 'Village de pêcheurs en 1980, métropole technologique aujourd’hui.'],
            ['En quelle année la Chine entre-t-elle à l’OMC ?', ['2001', '1978', '1989', '2010'], 0, 'Son intégration au commerce mondial s’accélère alors fortement.'],
            ['Qu’est-ce que le hukou ?', ['Un permis de résidence qui rattache un habitant à sa région d’origine', 'Un impôt local', 'Un plan quinquennal', 'Une zone franche'], 0, 'Il limite l’accès aux droits sociaux des migrants dans les villes.'],
            ['Qui sont les mingong ?', ['Les travailleurs migrants venus des campagnes vers les villes', 'Les cadres du parti', 'Les paysans propriétaires', 'Les ouvriers d’État'], 0, 'Plusieurs centaines de millions de personnes sont concernées.'],
            ['Quelle partie de la Chine concentre la richesse ?', ['Le littoral oriental', 'Le Tibet', 'Le Xinjiang', 'La Mongolie intérieure'], 0, 'Les provinces côtières produisent l’essentiel du PIB.'],
            ['La politique de l’enfant unique a été abandonnée en 2015.', ['Vrai', 'Faux'], 0, 'Elle laisse un vieillissement rapide et un déséquilibre entre les sexes.'],
            ['Que vise le programme « Go West » ?', ['Réduire l’écart de développement entre le littoral et l’intérieur', 'Développer les exportations maritimes', 'Attirer des touristes étrangers', 'Créer de nouvelles ZES côtières'], 0, 'Infrastructures et investissements sont dirigés vers l’Ouest.'],
          ],
        },
        {
          titre: 'Des ressources et des environnements sous pression en Chine',
          axe: 'La Chine : des recompositions spatiales multiples',
          lecon: {
            titre: 'Le prix environnemental de la croissance',
            cours: `La croissance chinoise s’est appuyée sur une consommation massive de ressources, avec des conséquences environnementales majeures — que le pays tente désormais de corriger.

## L’énergie
La Chine est le premier consommateur mondial d’énergie et le premier émetteur de **CO2** (environ 30 % des émissions mondiales), en grande partie à cause du **charbon**. Elle est aussi, en même temps, le premier investisseur mondial dans les **renouvelables** : elle fabrique la majorité des panneaux solaires de la planète et vise la neutralité carbone en 2060.

## L’eau
La ressource est très inégalement répartie : le Sud est humide, le Nord (Pékin, Tianjin) manque d’eau. Le **transfert Sud-Nord**, gigantesque réseau d’aqueducs, achemine l’eau du Yangzi vers le Nord. Le barrage des **Trois-Gorges** produit de l’électricité et régule les crues, au prix du déplacement de plus d’un million de personnes.

> Aucune économie n’a jamais consommé autant de ressources aussi vite : les corrections chinoises se font à la même échelle que les dégâts.

## Les pollutions
Pics de pollution de l’air dans les grandes villes, sols contaminés, cours d’eau dégradés, déchets. Les conséquences sanitaires ont provoqué des mobilisations locales et une réponse politique (normes, fermetures d’usines, contrôle des émissions).

## La dépendance extérieure
Importations massives de pétrole, de gaz, de minerais et de soja ; investissements à l’étranger pour sécuriser l’approvisionnement, notamment via les **nouvelles routes de la soie**.`,
          },
          questions: [
            ['Quelle place occupe la Chine dans les émissions mondiales de CO2 ?', ['Premier émetteur, environ 30 % du total', 'Deuxième derrière les États-Unis', 'Troisième', 'Cinquième'], 0, 'Le charbon reste sa première source d’énergie.'],
            ['La Chine investit-elle dans les énergies renouvelables ?', ['Oui, elle est le premier investisseur mondial', 'Non, elle mise uniquement sur le charbon', 'Uniquement dans le nucléaire', 'Seulement depuis 2023'], 0, 'Elle produit la majorité des panneaux solaires du monde.'],
            ['Quel grand aménagement achemine l’eau du Sud vers le Nord ?', ['Le transfert Sud-Nord', 'Le canal impérial seul', 'Le barrage des Trois-Gorges', 'Le pont de Hangzhou'], 0, 'Le Nord chinois, très peuplé, manque structurellement d’eau.'],
            ['Quel barrage a entraîné le déplacement de plus d’un million de personnes ?', ['Le barrage des Trois-Gorges', 'Le barrage d’Assouan', 'Le barrage d’Itaipu', 'Le barrage de Xiaolangdi'], 0, 'Il illustre l’échelle des aménagements chinois.'],
            ['Quelle est la principale source d’énergie de la Chine ?', ['Le charbon', 'Le gaz naturel', 'L’hydroélectricité', 'Le nucléaire'], 0, 'D’où le poids de ses émissions de CO2.'],
            ['La Chine vise la neutralité carbone à l’horizon 2060.', ['Vrai', 'Faux'], 0, 'Objectif annoncé en 2020, avec un pic d’émissions visé avant 2030.'],
            ['Que sont les nouvelles routes de la soie ?', ['Un vaste programme chinois d’infrastructures et d’investissements à l’étranger', 'Un réseau ferroviaire intérieur', 'Un accord commercial avec l’UE', 'Un plan agricole'], 0, 'Elles sécurisent approvisionnements et débouchés.'],
            ['Quelle conséquence sanitaire la pollution a-t-elle eue en Chine ?', ['Des mobilisations locales et un durcissement des normes', 'Aucune réaction publique', 'La fermeture de toutes les usines', 'Le déplacement des capitales'], 0, 'La pollution de l’air urbain est devenue un enjeu politique.'],
          ],
        },
        {
          titre: 'Métropolisation et urbanisation en Chine',
          axe: 'La Chine : des recompositions spatiales multiples',
          lecon: {
            titre: 'Un pays qui a basculé en ville en trente ans',
            cours: `En 1980, moins de 20 % des Chinois vivaient en ville ; ils sont plus de 60 % aujourd’hui. C’est l’urbanisation la plus rapide et la plus massive de l’histoire.

## Des métropoles géantes
Shanghai, Pékin, Canton, Shenzhen, Chongqing : la Chine compte plusieurs dizaines de villes de plus de 5 millions d’habitants. Les grandes régions urbaines — **delta de la rivière des Perles**, delta du **Yangzi**, région de Pékin-Tianjin — forment des ensembles de plusieurs dizaines de millions d’habitants.

## Une urbanisation planifiée
L’État crée des villes nouvelles, des quartiers d’affaires (Pudong à Shanghai), des lignes à grande vitesse (le plus grand réseau du monde), des métros. Certaines opérations ont produit des **villes fantômes**, construites avant leur peuplement.

> En Chine, la ville n’attend pas la demande : elle est construite pour la précéder, avec les excès que cela suppose.

## Des métropoles de rang mondial
Shanghai et Hong Kong figurent parmi les premières places financières mondiales ; Shenzhen est un pôle technologique majeur. La Chine passe du statut d’atelier à celui de centre de décision et d’innovation.

## Les limites
Prix du logement, endettement des promoteurs, inégalités liées au hukou, pollution, disparition de terres agricoles, patrimoine urbain détruit lors des rénovations.`,
          },
          questions: [
            ['Quel était le taux d’urbanisation chinois vers 1980 ?', ['Moins de 20 %', 'Environ 40 %', 'Environ 50 %', 'Plus de 60 %'], 0, 'Il dépasse aujourd’hui 60 % : le basculement a pris une génération.'],
            ['Quelle région urbaine se situe autour de Canton et Shenzhen ?', ['Le delta de la rivière des Perles', 'Le delta du Yangzi', 'La région de Pékin-Tianjin', 'Le bassin du Sichuan'], 0, 'C’est l’une des plus grandes concentrations urbaines du monde.'],
            ['Quel quartier d’affaires symbolise la modernisation de Shanghai ?', ['Pudong', 'Puxi', 'Hongqiao', 'Nanjing Road'], 0, 'Champ de rizières il y a trente ans, forêt de tours aujourd’hui.'],
            ['Qu’est-ce qu’une ville fantôme chinoise ?', ['Une ville construite avant d’être peuplée', 'Une ville abandonnée après une catastrophe', 'Un quartier historique désert', 'Une ville minière fermée'], 0, 'Elle illustre les excès d’une urbanisation pilotée par l’offre.'],
            ['La Chine possède le plus grand réseau ferroviaire à grande vitesse du monde.', ['Vrai', 'Faux'], 0, 'Plus de 40 000 km de lignes, construits en une vingtaine d’années.'],
            ['Quelle ville chinoise est un pôle technologique majeur ?', ['Shenzhen', 'Lhassa', 'Harbin', 'Kunming'], 0, 'Huawei, Tencent et BYD y ont leur siège.'],
            ['Quel document limite l’accès des migrants aux services urbains ?', ['Le hukou', 'Le passeport intérieur', 'Le livret ouvrier', 'La carte de résident'], 0, 'Il crée une population urbaine à deux vitesses.'],
            ['Quel effet l’urbanisation rapide a-t-elle sur les terres agricoles ?', ['Elle en fait disparaître de grandes surfaces', 'Elle les protège', 'Elle les rend plus productives', 'Elle n’a aucun effet'], 0, 'La sécurité alimentaire est un souci constant du pouvoir chinois.'],
          ],
        },
        {
          titre: 'La littoralisation des espaces productifs en Chine',
          axe: 'La Chine : des recompositions spatiales multiples',
          lecon: {
            titre: 'La façade maritime, moteur du pays',
            cours: `La croissance chinoise s’est construite sur ses côtes : c’est là que se trouvent les ZES, les usines exportatrices, les ports géants et les métropoles.

## Une façade maritime hors norme
Sept des dix premiers ports à conteneurs du monde sont chinois (Shanghai, Ningbo-Zhoushan, Shenzhen, Canton, Qingdao, Tianjin, Hong Kong). Les **ZIP** associent ports, sidérurgie, pétrochimie, chantiers navals et zones logistiques.

## Pourquoi le littoral ?
Accès direct aux marchés mondiaux, coût de transport minimal, proximité des ZES et de la main-d’œuvre migrante, politiques publiques de soutien. La littoralisation a donc été d’abord un **choix politique**, avant d’être un fait géographique.

> Les provinces côtières rassemblent environ 40 % de la population et produisent une nette majorité de la richesse chinoise.

## Un rééquilibrage engagé
Hausse des salaires côtiers, congestion et coût du foncier poussent des industries vers l’intérieur (Chongqing, Chengdu, Wuhan), desservi par le rail et les fleuves. Les liaisons ferroviaires vers l’Europe prolongent ce mouvement.

## Les vulnérabilités
Dépendance aux détroits (Malacca) et aux routes maritimes, tensions en mer de Chine méridionale, exposition des littoraux aux typhons et à la montée du niveau marin.`,
          },
          questions: [
            ['Quel est le premier port à conteneurs du monde ?', ['Shanghai', 'Rotterdam', 'Singapour', 'Los Angeles'], 0, 'La Chine possède sept des dix premiers ports mondiaux.'],
            ['Pourquoi les activités productives chinoises se sont-elles concentrées sur le littoral ?', ['Accès aux marchés mondiaux, ZES et politiques publiques', 'Climat plus favorable', 'Présence de matières premières', 'Densité de population plus faible'], 0, 'La littoralisation a d’abord été un choix politique.'],
            ['Quelle part de la richesse chinoise les provinces côtières produisent-elles ?', ['Une nette majorité', 'Environ un quart', 'Moins d’un tiers', 'La moitié exactement'], 0, 'Elles rassemblent environ 40 % de la population.'],
            ['Quelles métropoles de l’intérieur accueillent aujourd’hui des industries ?', ['Chongqing, Chengdu et Wuhan', 'Lhassa et Kashgar', 'Harbin et Shenyang uniquement', 'Sanya et Haikou'], 0, 'Le rail et le Yangzi les relient aux marchés.'],
            ['Quel détroit est stratégique pour l’approvisionnement chinois ?', ['Le détroit de Malacca', 'Le détroit de Béring', 'Le Bosphore', 'Le canal de Panama'], 0, 'Une grande partie du pétrole importé y transite.'],
            ['La montée du niveau marin menace les grandes ZIP chinoises.', ['Vrai', 'Faux'], 0, 'Typhons et submersion pèsent sur des espaces productifs très concentrés.'],
            ['Qu’est-ce qui pousse certaines industries à quitter le littoral chinois ?', ['La hausse des salaires et du coût du foncier', 'La baisse de la demande mondiale', 'La fermeture des ports', 'La pénurie de main-d’œuvre nationale'], 0, 'Le rééquilibrage vers l’intérieur est encouragé par l’État.'],
            ['Que relient les liaisons ferroviaires transcontinentales chinoises ?', ['La Chine intérieure à l’Europe', 'Les ports du Sud entre eux', 'Pékin à Hong Kong', 'La Chine à l’Australie'], 0, 'Elles prolongent les nouvelles routes de la soie.'],
          ],
        },
        {
          titre: 'Les espaces ruraux en Chine : continuité ou fragmentation ?',
          axe: 'La Chine : des recompositions spatiales multiples',
          lecon: {
            titre: 'Des campagnes vidées, modernisées, inégales',
            cours: `Les campagnes chinoises ont fourni la main-d’œuvre du miracle économique. Elles en sortent transformées, et très inégalement.

## Un monde rural encore immense
Environ 500 millions de Chinois vivent en zone rurale. La terre appartient à l’État ou au collectif : les paysans en ont l’**usage**, pas la propriété, ce qui fragilise leur position face aux projets d’aménagement.

## Le départ des actifs
Les **mingong** partis vers les villes laissent derrière eux des villages où vivent surtout des enfants et des personnes âgées — on parle d’« enfants laissés à l’arrière ». Les **remises** (l’argent envoyé) font vivre une partie de ces campagnes.

> Les campagnes chinoises ne se sont pas seulement vidées : elles se sont spécialisées, certaines dans l’agriculture moderne, d’autres dans la survie.

## Des campagnes très différentes
Plaines du Nord-Est mécanisées et céréalières, deltas intensifs, campagnes périurbaines converties au maraîchage et au tourisme, marges de l’Ouest pastorales et pauvres. La modernisation agricole progresse (mécanisation, serres, e-commerce agricole), mais l’écart de revenu avec les villes reste fort.

## Les politiques publiques
Suppression de la taxe agricole (2006), assouplissement du hukou, plans de « revitalisation rurale », lutte proclamée contre la grande pauvreté, développement du numérique et des « villages Taobao » vendant en ligne.`,
          },
          questions: [
            ['Combien de Chinois vivent environ en zone rurale ?', ['Environ 500 millions', 'Environ 100 millions', 'Environ 1 milliard', 'Environ 250 millions'], 0, 'Malgré l’urbanisation, le monde rural chinois reste immense.'],
            ['À qui appartient la terre agricole en Chine ?', ['À l’État ou au collectif, les paysans en ayant l’usage', 'Aux paysans en pleine propriété', 'Aux entreprises étrangères', 'Aux communes uniquement'], 0, 'Ce statut fragilise les paysans face aux expropriations.'],
            ['Qui sont les « enfants laissés à l’arrière » ?', ['Les enfants de migrants restés au village avec leurs grands-parents', 'Les enfants déscolarisés des villes', 'Les enfants uniques', 'Les enfants des minorités'], 0, 'Conséquence sociale majeure des migrations internes.'],
            ['Qu’est-ce qu’une remise ?', ['De l’argent envoyé par un migrant à sa famille restée au village', 'Une aide agricole', 'Une remise de dette', 'Une réduction fiscale'], 0, 'Les remises font vivre de nombreuses campagnes.'],
            ['Quelle région chinoise est spécialisée dans les grandes cultures céréalières mécanisées ?', ['Les plaines du Nord-Est', 'Le Tibet', 'Le delta de la rivière des Perles', 'Le Yunnan'], 0, 'Les grandes plaines s’y prêtent, contrairement aux deltas intensifs.'],
            ['La taxe agricole chinoise a été supprimée en 2006.', ['Vrai', 'Faux'], 0, 'C’est l’une des mesures visant à réduire l’écart ville-campagne.'],
            ['Qu’est-ce qu’un village Taobao ?', ['Un village dont l’économie repose sur la vente en ligne', 'Un village touristique', 'Un village modèle du parti', 'Un village de migrants'], 0, 'Le numérique transforme certaines campagnes chinoises.'],
            ['L’écart de revenu entre villes et campagnes chinoises a-t-il disparu ?', ['Non, il reste important', 'Oui, depuis 2010', 'Oui, depuis 2020', 'Il s’est inversé'], 0, 'La réduction des inégalités reste un objectif affiché du pouvoir.'],
          ],
        },
      ],
    },
  ],
}
