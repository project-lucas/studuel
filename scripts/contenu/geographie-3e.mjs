// Géographie — Troisième : LE PROGRAMME COMPLET (12 fiches).
//
// CE QUE REMPLACE CE MODULE. La 3e n'avait, pour toute la géographie, UNE seule
// fiche : « Les aires urbaines en France », héritée du tout premier jeu de
// données (migration 008). Le programme du cycle 4 en demande trois chapitres —
// les dynamiques territoriales de la France, l'aménagement du territoire, la
// France et l'Union européenne — ici dépliés en 12 fiches, exactement selon la
// maquette de référence. Un élève de 3e qui révisait les espaces productifs,
// les espaces de faible densité, les territoires ultramarins, la politique de
// la ville, la construction européenne ou la place de l'Europe dans le monde ne
// trouvait RIEN.
//
// ⚠️ C'EST CETTE MIGRATION QUI DÉDOUBLE L'ONGLET. Les 14 fiches d'histoire
// (migration 291) portent déjà `rayon: 'histoire'`, posé d'avance ; les 12
// fiches d'ici portent `rayon: 'geographie'`. À partir de DEUX rayons,
// `disciplinesOf` (lib/subject-template) rend un onglet par rayon : le dossier
// d'histoire-géo de 3e s'ouvre alors sur « Histoire » et « Géographie », comme
// en 2de, en 1re et en Terminale. Aucun code à toucher, aucune migration à
// reprendre — le filtre naît du contenu.
//
// ⚠️ LE PIÈGE DU TITRE IDENTIQUE. La première fiche de la maquette s'appelle
// « Les aires urbaines en France » — le titre EXACT de la fiche héritée de la
// 008, qu'il faut retirer. Or `chapters` porte UNIQUE(subject_id, level, title) :
// sans ménage préalable, l'INSERT tomberait dans le ON CONFLICT DO NOTHING et la
// leçon échouerait ensuite sur une clé étrangère absente. Le ménage est donc
// obligatoire — et il est gardé par `theme IS NULL` EN PLUS du titre, sans quoi
// un REJEU viserait la fiche neuve, qui porte le même titre. L'ancienne n'a pas
// de thème (elle est d'avant la colonne), les neuves en portent une dès
// l'INSERT, et le ménage tourne AVANT les insertions : la borne est exacte.
//
// LES POSITIONS DÉMARRENT À 15. L'histoire numérote ses 14 fiches de 1 à 14
// (291). La page matière trie par position à l'intérieur de chaque onglet :
// repartir de 1 ne casserait pas l'affichage, mais mêlerait les deux moitiés du
// dossier partout où le rayon est ignoré (l'arène, la file « À revoir », les
// exports). Les 12 fiches de géographie prennent donc 15 → 26.
//
// ⚠️ Le slug reste `histoire-geo` et SEPT modules le portent désormais
// (`histoire-geo-tle` = 227, `geographie-tle` = 229, `histoire-geo-1re` = 245,
// `histoire-tle-1-6` = 246, `histoire-geo-2de` = 279, `histoire-3e` = 291,
// celui-ci = 293) : ne JAMAIS générer avec `--slugs histoire-geo`, qui les
// fusionnerait et réécrirait six migrations. Toujours `--modules geographie-3e`.

export default {
  slug: 'histoire-geo',
  nom: 'Histoire-Géographie',

  titreMigration: 'GÉOGRAPHIE 3e — LE PROGRAMME COMPLET (12 fiches)',

  motif: `CONSTAT : la Troisième n'avait qu'UNE SEULE fiche de géographie, héritée du
premier jeu de données de l'app ("Les aires urbaines en France"), pour un
programme qui compte trois chapitres — les dynamiques territoriales de la France
contemporaine, l'aménagement du territoire, la France et l'Union européenne. Un
élève de 3e qui révisait les espaces productifs, les espaces de faible densité,
les territoires ultramarins, la politique de la ville, la construction
européenne ou la place de l'Europe dans le monde ne trouvait RIEN. Cette
migration installe les 12 fiches de la maquette, rangées sous leurs 3 chapitres,
et retire la fiche générique que la première d'entre elles reprend.
ELLE DÉDOUBLE AUSSI L'ONGLET DU DOSSIER : les 14 fiches d'histoire (migration
291) portent le rayon "histoire", les 12 fiches d'ici portent "geographie", et
la page matière rend un onglet par rayon dès qu'il y en a DEUX. Le dossier
d'histoire-géo de 3e s'ouvre donc désormais sur "Histoire" et "Géographie",
comme en 2de, en 1re et en Terminale.`,

  menage: [
    {
      raison: `Les colonnes chapters.theme (migration 234) et chapters.discipline
(migration 247) conditionnent tout ce qui suit : ce module range ses 12 fiches
sous 3 chapitres et un rayon, et l'INSERT écrit les deux colonnes. Elles sont
REPRISES ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que la
234 et la 247 soient passées en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", la fiche héritée déjà
supprimée et les 12 neuves pas encore posées : une géographie vide.
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
      raison: `La fiche de géographie héritée part. "Les aires urbaines en France" est la
première fiche du chapitre 1 de la maquette, et la fiche neuve porte le MÊME
TITRE : la table chapters est UNIQUE(subject_id, level, title), donc sans ce
ménage l'INSERT tomberait dans le ON CONFLICT DO NOTHING et la leçon échouerait
ensuite sur une clé étrangère absente — la migration s'arrêterait à mi-parcours.
LA BORNE theme IS NULL EST LE POINT CRITIQUE. Le ménage tourne AVANT les
insertions à chaque passage : borné au seul titre, un REJEU supprimerait la fiche
neuve et ses quiz, puisqu'elle porte le même titre. L'ancienne fiche est d'avant
la colonne theme (migration 234) et n'en porte donc aucun ; les 12 neuves en
portent un dès l'INSERT. La distinction est exacte et stable.
Le filtre level = '3e' est indispensable : sans lui le ménage mordrait sur les
chapitres d'urbanisation des autres niveaux.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis le chapitre, dont la leçon part en cascade.`,
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
   AND c.level = '3e'
   AND c.title = 'Les aires urbaines en France'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '3e'
   AND c.title = 'Les aires urbaines en France'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '3e'
   AND c.title = 'Les aires urbaines en France'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['3e'],
      rayon: 'geographie',
      positionDepart: 15,
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Dynamiques territoriales de la France contemporaine
        // ===================================================================
        {
          titre: 'Les aires urbaines en France',
          axe: 'Dynamiques territoriales de la France contemporaine',
          lecon: {
            titre: 'Où vivent les Français ? La ville qui s’étale',
            cours: `La France est un pays **urbain** : plus de **80 % des Français** habitent une ville, et **95 %** vivent sous l’influence d’une ville — pour y travailler, y étudier, s’y soigner ou y faire leurs courses.

## L’aire urbaine, l’outil qui mesure la ville réelle
Une **aire urbaine** réunit deux morceaux :
- le **pôle urbain** — la ville-centre et sa banlieue, une zone bâtie en continu qui offre au moins 1 500 emplois ;
- la **couronne périurbaine** — les communes d’où **au moins 40 % des actifs** partent travailler dans le pôle.

> La commune s’arrête à sa limite administrative ; l’aire urbaine, elle, dit jusqu’où la ville fait vivre les gens. (Depuis 2020, l’INSEE parle d’**aire d’attraction des villes** : le principe est le même.)

## Une hiérarchie urbaine très inégale
- **Paris** domine tout : environ **13 millions d’habitants**, soit un Français sur cinq. C’est la seule **métropole mondiale** française.
- Une douzaine de **métropoles régionales** suivent de loin : Lyon, Marseille, Lille, Toulouse, Bordeaux, Nantes, Nice, Strasbourg, Rennes, Montpellier…
- Puis les **villes moyennes** et les **petites villes**, dont beaucoup perdent commerces et services.

## La métropolisation, effet de la mondialisation
La **métropolisation** est la concentration des hommes, des richesses et des **fonctions de commandement** dans les plus grandes villes : sièges sociaux, universités, laboratoires, hôpitaux de pointe, musées, aéroports internationaux. Les quartiers d’affaires en sont le symbole — **La Défense** à Paris, la Part-Dieu à Lyon, Euralille.

## Une ville qui s’étale
Depuis les années 1960, la ville grandit surtout **en surface** : c’est l’**étalement urbain**, nourri par le prix du logement, la voiture et le rêve de la maison avec jardin. Il produit la **périurbanisation**, des **mobilités pendulaires** (les navettes domicile-travail) toujours plus longues, l’**artificialisation des sols** et le **mitage** des campagnes. La loi vise désormais le « **zéro artificialisation nette** ».

## Une ville qui sépare
La **ségrégation socio-spatiale** trie les quartiers selon les revenus : centres rénovés et chers (**gentrification**) d’un côté, **quartiers prioritaires** de l’autre. Habiter la même aire urbaine ne veut pas dire vivre la même ville.`,
          },
          questions: [
            ['Que réunit une aire urbaine ?', ['Un pôle urbain et sa couronne périurbaine', 'Une commune et ses hameaux', 'Un département et sa préfecture', 'Une région et ses métropoles'], 0, 'Le pôle est la zone bâtie en continu, la couronne les communes qui envoient leurs actifs y travailler.'],
            ['À partir de quel seuil d’actifs travaillant dans le pôle une commune entre-t-elle dans la couronne périurbaine ?', ['40 %', '10 %', '25 %', '75 %'], 0, 'C’est le critère retenu par l’INSEE pour délimiter l’aire urbaine.'],
            ['Quelle part des Français vit sous l’influence d’une aire urbaine ?', ['Environ 95 %', 'Environ 50 %', 'Environ 65 %', 'Environ 30 %'], 0, 'Même en habitant à la campagne, on dépend le plus souvent d’une ville pour l’emploi et les services.'],
            ['Combien d’habitants compte environ l’aire urbaine de Paris ?', ['Environ 13 millions', 'Environ 2 millions', 'Environ 6 millions', 'Environ 20 millions'], 0, 'Soit près d’un Français sur cinq : aucune autre ville française n’approche ce poids.'],
            ['Qu’appelle-t-on la métropolisation ?', ['La concentration des hommes, des richesses et des fonctions de commandement dans les grandes villes', 'La construction de villes nouvelles', 'Le départ des habitants vers les campagnes', 'La fusion de plusieurs communes en une seule'], 0, 'Sièges sociaux, universités, hôpitaux de pointe et aéroports s’y regroupent.'],
            ['Que sont les mobilités pendulaires ?', ['Les déplacements quotidiens entre le domicile et le travail', 'Les migrations saisonnières des touristes', 'Les déménagements d’une région à l’autre', 'Les voyages scolaires'], 0, 'Elles s’allongent à mesure que la ville s’étale.'],
            ['Qu’est-ce que la gentrification d’un centre-ville ?', ['L’arrivée d’habitants aisés qui fait monter les prix et repousse les plus modestes', 'La destruction des immeubles anciens', 'Le départ des commerces vers la périphérie', 'La piétonnisation des rues'], 0, 'Rénovation et hausse des loyers vont de pair.'],
            ['Toutes les villes françaises profitent également de la métropolisation.', ['Vrai', 'Faux'], 1, 'Les métropoles gagnent habitants et emplois qualifiés, quand beaucoup de villes moyennes perdent commerces et services.'],
          ],
        },
        {
          titre: 'Les espaces productifs : la France industrielle',
          axe: 'Dynamiques territoriales de la France contemporaine',
          lecon: {
            titre: 'Des mines fermées aux technopôles',
            cours: `Un **espace productif** est un espace aménagé pour produire des richesses. L’industrie française a changé de visage — et de carte — en cinquante ans.

## La désindustrialisation
Depuis les années 1970, l’industrie a perdu la moitié de ses emplois. Trois causes :
- la **concurrence mondiale** et les **délocalisations** vers des pays à main-d’œuvre moins chère ;
- l’**automatisation**, qui produit autant avec moins d’ouvriers ;
- l’épuisement ou l’abandon des ressources locales (charbon, minerai de fer).

Les vieilles régions industrielles du **Nord**, de **Lorraine** et de **Saint-Étienne** en gardent des **friches industrielles**, un chômage élevé et une population qui part.

## Les espaces industriels qui gagnent
- Les **technopôles** : des parcs qui associent entreprises de haute technologie, laboratoires et universités — **Sophia Antipolis** près de Nice, l’Aerospace Valley à Toulouse.
- Les **pôles de compétitivité**, labellisés par l’État pour faire travailler ensemble industriels et chercheurs.
- Les **métropoles**, où se concentrent recherche, ingénierie et sièges sociaux.

## La littoralisation
Les industries lourdes qui consomment des matières premières importées s’installent sur les **littoraux**, au contact des grands ports : ce sont les **zones industrialo-portuaires (ZIP)** de **Dunkerque**, du **Havre**, de **Marseille-Fos**. Le littoral est une **interface** — le lieu de contact entre le territoire national et le monde.

> Ce n’est pas l’industrie qui disparaît, ce sont ses lieux qui se déplacent : du bassin minier vers le port, le technopôle et la métropole.

## Des industries de pointe qui font la puissance française
Aéronautique (**Airbus**, Toulouse), spatial, nucléaire, pharmacie, luxe et agroalimentaire restent des points forts, très exportateurs.`,
          },
          questions: [
            ['Qu’est-ce qu’un espace productif ?', ['Un espace aménagé pour produire des richesses', 'Un espace protégé de toute activité humaine', 'Un quartier réservé aux logements', 'Une zone uniquement agricole'], 0, 'Il peut être industriel, agricole ou de services.'],
            ['Qu’appelle-t-on la désindustrialisation ?', ['La perte massive d’emplois industriels depuis les années 1970', 'La création de nouvelles usines en centre-ville', 'Le passage de l’artisanat à l’industrie', 'L’automatisation des exploitations agricoles'], 0, 'Concurrence mondiale, délocalisations et automatisation en sont les causes.'],
            ['Que reste-t-il des anciennes usines fermées dans le Nord et en Lorraine ?', ['Des friches industrielles', 'Des zones franches', 'Des technopôles', 'Des ZIP'], 0, 'Terrains et bâtiments abandonnés, souvent en attente de reconversion.'],
            ['Qu’est-ce qu’un technopôle ?', ['Un parc associant entreprises de haute technologie, laboratoires et universités', 'Un port spécialisé dans les conteneurs', 'Une zone commerciale de périphérie', 'Un quartier d’affaires de centre-ville'], 0, 'Sophia Antipolis, près de Nice, en est l’exemple pionnier en France.'],
            ['Que désigne une ZIP ?', ['Une zone industrialo-portuaire', 'Une zone d’intérêt patrimonial', 'Une zone d’installation prioritaire', 'Une zone d’industrie protégée'], 0, 'Dunkerque, Le Havre et Marseille-Fos en sont les principales en France.'],
            ['Pourquoi les industries lourdes s’installent-elles sur les littoraux ?', ['Pour être au contact des ports qui importent les matières premières', 'Parce que la main-d’œuvre y est moins chère', 'Parce que l’État y interdit toute autre activité', 'Parce que le climat y est plus doux'], 0, 'C’est la littoralisation : le littoral devient une interface avec le monde.'],
            ['Quelle métropole est le cœur de l’industrie aéronautique française ?', ['Toulouse', 'Lille', 'Strasbourg', 'Rennes'], 0, 'Airbus et l’Aerospace Valley y regroupent constructeurs et sous-traitants.'],
            ['La désindustrialisation signifie que la France ne produit plus rien.', ['Vrai', 'Faux'], 1, 'Aéronautique, nucléaire, pharmacie, luxe et agroalimentaire restent des industries de pointe très exportatrices.'],
          ],
        },
        {
          titre: 'Les espaces productifs : la France agricole',
          axe: 'Dynamiques territoriales de la France contemporaine',
          lecon: {
            titre: 'Une agriculture puissante, sous tension',
            cours: `La France est le **premier producteur agricole de l’Union européenne**, alors que l’agriculture n’occupe plus que **2 % des actifs**. Ce paradoxe s’explique par un demi-siècle de modernisation.

## Une agriculture productiviste
Depuis les années 1960, l’agriculture française cherche le **rendement maximal** :
- **mécanisation** (tracteurs, moissonneuses) et agrandissement des exploitations ;
- **engrais**, **pesticides**, semences sélectionnées, irrigation ;
- **spécialisation** de chaque région dans une production.

Elle est **intégrée aux marchés** : reliée en amont aux entreprises qui vendent machines et intrants, en aval aux **industries agroalimentaires** et à la grande distribution.

## Une carte très spécialisée
- Les **grandes cultures céréalières** de la Beauce et du Bassin parisien, dans de vastes champs ouverts (**openfield**).
- L’**élevage** de l’Ouest — dont l’élevage **hors-sol** de porcs et de volailles en Bretagne.
- La **viticulture** de Bordeaux, de Bourgogne, de Champagne et du Languedoc.
- Les **fruits et légumes** du Midi méditerranéen et des vallées irriguées.

## Le rôle de l’Europe
La **PAC** (Politique agricole commune) verse des aides aux agriculteurs et oriente les productions depuis 1962. Sans elle, une grande partie des exploitations ne serait pas rentable.

## Des tensions fortes
- **Environnement** : nitrates et algues vertes en Bretagne, érosion des sols, perte de biodiversité.
- **Revenus** : les prix imposés par la grande distribution étranglent beaucoup d’exploitations.
- Une autre agriculture progresse : **bio**, labels de qualité (**AOP**, AOC, Label rouge) et **circuits courts** qui rapprochent producteur et consommateur.

> Produire plus ou produire mieux : c’est le débat qui traverse aujourd’hui les campagnes françaises.`,
          },
          questions: [
            ['Quelle place occupe la France dans l’agriculture européenne ?', ['Elle est le premier producteur agricole de l’Union européenne', 'Elle est le dernier producteur de l’Union', 'Elle n’exporte aucun produit agricole', 'Elle importe la totalité de ses céréales'], 0, 'Et pourtant l’agriculture n’occupe plus que 2 % des actifs.'],
            ['Qu’est-ce qu’une agriculture productiviste ?', ['Une agriculture qui cherche le rendement maximal par la mécanisation et les intrants', 'Une agriculture sans engrais ni pesticides', 'Une agriculture destinée à la seule consommation familiale', 'Une agriculture pratiquée uniquement en montagne'], 0, 'Mécanisation, engrais, irrigation et spécialisation régionale en sont les moyens.'],
            ['Quel paysage agricole domine la Beauce ?', ['L’openfield, de vastes champs ouverts céréaliers', 'Le bocage, quadrillé de haies', 'La vigne en terrasses', 'La forêt de conifères'], 0, 'C’est le grenier à blé du Bassin parisien.'],
            ['Qu’est-ce que l’élevage hors-sol ?', ['Un élevage en bâtiment, où les animaux ne pâturent pas', 'Un élevage pratiqué en altitude', 'Un élevage sans aucune alimentation industrielle', 'Un élevage nomade'], 0, 'Il est très développé en Bretagne pour les porcs et les volailles.'],
            ['Que signifie la PAC ?', ['La Politique agricole commune', 'Le Programme agricole des campagnes', 'Le Plan d’aide aux cultures', 'La Production agricole certifiée'], 0, 'Elle verse des aides européennes aux agriculteurs depuis 1962.'],
            ['Que garantit un label AOP ?', ['L’origine géographique et le savoir-faire d’un produit', 'L’absence totale de transformation', 'Un prix de vente maximal', 'Une production entièrement exportée'], 0, 'AOP, AOC et Label rouge misent sur la qualité plutôt que sur le volume.'],
            ['Quel problème environnemental l’élevage intensif provoque-t-il en Bretagne ?', ['La pollution aux nitrates et les algues vertes sur les littoraux', 'La désertification des sols', 'La fonte des glaciers', 'Les pluies acides venues d’Allemagne'], 0, 'Le lisier épandu enrichit les eaux en nitrates jusqu’à la mer.'],
            ['Un circuit court désigne une vente qui passe par un maximum d’intermédiaires.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : il rapproche le producteur du consommateur, avec un intermédiaire au plus.'],
          ],
        },
        {
          titre: 'Les espaces productifs : la France des services',
          axe: 'Dynamiques territoriales de la France contemporaine',
          lecon: {
            titre: 'Le pays des services et le premier pays touristique du monde',
            cours: `Les **services** (le secteur tertiaire) emploient aujourd’hui près de **80 % des actifs** français : c’est la **tertiarisation** de l’économie.

## Deux familles de services
- Les **services marchands**, vendus : commerce, banque, assurance, transport, conseil, informatique, tourisme.
- Les **services non marchands**, financés par l’impôt : école, hôpital public, justice, sécurité, administration.

## Une géographie très concentrée
Les services à **haute valeur ajoutée** (finance, conseil, recherche, médias) se concentrent dans les **métropoles**, et d’abord à Paris : **La Défense** rassemble plus de 180 000 salariés. Les villes moyennes et les campagnes gardent surtout les services **de proximité** (commerces, écoles, médecins) — et souffrent quand ceux-ci ferment.

## La France, première destination touristique mondiale
La France accueille chaque année environ **90 millions de touristes étrangers**, un record mondial. Le tourisme représente près de **8 % du PIB**.

Quatre grands types d’espaces touristiques :
- le **tourisme urbain et culturel** : Paris, les châteaux de la Loire, les villes d’art ;
- le **tourisme balnéaire** : Côte d’Azur, littoral atlantique, Languedoc ;
- le **tourisme de montagne** : stations des Alpes et des Pyrénées, hiver comme été ;
- le **tourisme vert**, dans les campagnes et les parcs naturels.

## Aménager pour accueillir… et ses limites
Stations balnéaires, remontées mécaniques, parcs de loisirs (Disneyland Paris) créent des emplois, souvent **saisonniers**. Mais l’afflux touristique bétonne les littoraux, use les milieux fragiles de montagne et provoque un **surtourisme** dans certains sites.

> Le tourisme fait vivre des territoires entiers — et menace parfois ce qui les rend attirants.`,
          },
          questions: [
            ['Quelle part des actifs français travaille dans les services ?', ['Près de 80 %', 'Environ 25 %', 'Environ 50 %', 'Moins de 10 %'], 0, 'C’est la tertiarisation de l’économie française.'],
            ['Qu’est-ce qu’un service non marchand ?', ['Un service financé par l’impôt, comme l’école ou l’hôpital public', 'Un service vendu à un prix libre', 'Un service réservé aux entreprises', 'Un service exporté à l’étranger'], 0, 'Il ne se vend pas : il est assuré par la collectivité.'],
            ['Où se concentrent les services à haute valeur ajoutée ?', ['Dans les métropoles, et d’abord à Paris', 'Dans les espaces de faible densité', 'Dans les zones industrialo-portuaires', 'Dans les stations de montagne'], 0, 'Finance, conseil, recherche et médias suivent la métropolisation.'],
            ['Combien de touristes étrangers la France accueille-t-elle chaque année ?', ['Environ 90 millions', 'Environ 20 millions', 'Environ 45 millions', 'Environ 200 millions'], 0, 'C’est la première destination touristique du monde.'],
            ['Quelle part du PIB français le tourisme représente-t-il environ ?', ['Près de 8 %', 'Près de 25 %', 'Moins de 1 %', 'Près de 40 %'], 0, 'Un poids considérable, très inégalement réparti sur le territoire.'],
            ['Quel espace touristique correspond à la Côte d’Azur ?', ['Le tourisme balnéaire', 'Le tourisme vert', 'Le tourisme de montagne', 'Le tourisme d’affaires exclusivement'], 0, 'Le littoral méditerranéen est le premier espace balnéaire français.'],
            ['Quelle est une limite majeure des aménagements touristiques ?', ['Ils bétonnent les littoraux et fragilisent les milieux de montagne', 'Ils ne créent jamais d’emplois', 'Ils font disparaître les services publics', 'Ils sont interdits par l’Union européenne'], 0, 'Le surtourisme menace ce qui attire les visiteurs.'],
            ['Les emplois du tourisme sont majoritairement stables et à l’année.', ['Vrai', 'Faux'], 1, 'Beaucoup sont saisonniers, concentrés sur quelques semaines d’été ou d’hiver.'],
          ],
        },
        {
          titre: 'Les espaces de faible densité',
          axe: 'Dynamiques territoriales de la France contemporaine',
          lecon: {
            titre: 'La France des campagnes et des montagnes',
            cours: `Un **espace de faible densité** compte moins de **30 habitants par km²**. Ces espaces couvrent près de **la moitié du territoire français** mais n’abritent qu’environ **6 % de la population**.

## Où sont-ils ?
Ils dessinent une **diagonale des faibles densités** (l’ancienne « diagonale du vide ») qui traverse la France des Ardennes aux Landes, en passant par la Champagne, le Massif central et les Pyrénées. S’y ajoutent les hautes montagnes et une partie de la Corse.

## Des difficultés réelles
- **L’exode rural** puis la **déprise** : des villages qui perdent des habitants depuis un siècle.
- Le **vieillissement** de la population.
- La fermeture des **services** : école, bureau de poste, commerce, et parfois **déserts médicaux** où l’on cherche un médecin à 40 km.
- La dépendance à la **voiture**, faute de transports collectifs.

## Mais de vrais atouts
- Une **agriculture de qualité** : élevage extensif, AOP fromagères, vignobles.
- Le **tourisme vert** et le tourisme de montagne : randonnée, sports d’hiver, gîtes.
- Les **énergies renouvelables** : éolien, solaire, hydroélectricité, biomasse.
- Un **cadre de vie** recherché : des **néoruraux** s’y installent, et le **télétravail** a accéléré le mouvement depuis 2020.
- Une **biodiversité** protégée par les **parcs naturels régionaux** et les parcs nationaux.

> La faible densité n’est pas le vide : ces espaces produisent l’eau, l’énergie, les paysages et une partie de l’alimentation du pays.

## Des dynamiques opposées
Les campagnes proches des villes ou touristiques **gagnent** des habitants ; les campagnes isolées de montagne moyenne continuent souvent d’en perdre. Parler « des » espaces de faible densité au pluriel n’est pas une précaution de style : ce sont des mondes différents.`,
          },
          questions: [
            ['En dessous de quelle densité parle-t-on d’espace de faible densité ?', ['30 habitants par km²', '100 habitants par km²', '5 habitants par km²', '250 habitants par km²'], 0, 'Ces espaces couvrent près de la moitié du territoire français.'],
            ['Quelle part de la population française vit dans les espaces de faible densité ?', ['Environ 6 %', 'Environ 30 %', 'Environ 20 %', 'Environ 45 %'], 0, 'Beaucoup d’espace, très peu d’habitants.'],
            ['Comment appelle-t-on la bande de faibles densités qui traverse la France des Ardennes aux Landes ?', ['La diagonale des faibles densités', 'Le croissant fertile', 'La dorsale européenne', 'Le sillon rhodanien'], 0, 'On l’appelait autrefois « diagonale du vide », une expression aujourd’hui contestée.'],
            ['Qu’est-ce qu’un désert médical ?', ['Un territoire où l’accès à un médecin est très difficile', 'Une zone sans pharmacie autorisée', 'Un hôpital fermé pendant l’été', 'Une région sans épidémie'], 0, 'Conséquence directe du départ des services dans les espaces peu peuplés.'],
            ['Qui sont les néoruraux ?', ['Des citadins venus s’installer à la campagne', 'Des agriculteurs partis vivre en ville', 'Des touristes de passage', 'Des habitants nés au village et qui n’en sont jamais partis'], 0, 'Le télétravail a accéléré ces installations depuis 2020.'],
            ['Quel atout énergétique portent souvent les espaces de faible densité ?', ['Les énergies renouvelables : éolien, solaire, hydroélectricité, biomasse', 'Le raffinage du pétrole', 'La production de gaz naturel', 'Le stockage des déchets nucléaires exclusivement'], 0, 'L’espace disponible et le relief y sont des ressources.'],
            ['Quel outil protège la biodiversité et le patrimoine de ces espaces ?', ['Les parcs naturels régionaux et les parcs nationaux', 'Les zones franches urbaines', 'Les pôles de compétitivité', 'Les zones industrialo-portuaires'], 0, 'Ils concilient protection des milieux et développement local.'],
            ['Tous les espaces de faible densité perdent des habitants.', ['Vrai', 'Faux'], 1, 'Les campagnes proches des villes ou touristiques en gagnent ; les montagnes isolées en perdent.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 : Pourquoi et comment aménager le territoire ?
        // ===================================================================
        {
          titre: 'L’aménagement comme réponse aux inégalités territoriales',
          axe: 'Pourquoi et comment aménager le territoire ?',
          lecon: {
            titre: 'Qui transforme le territoire, et pour corriger quoi ?',
            cours: `**Aménager le territoire**, c’est le transformer volontairement pour le rendre plus attractif, plus accessible ou plus juste. En France, l’aménagement poursuit depuis les années 1960 un objectif affiché : réduire les **inégalités territoriales**.

## Les inégalités à corriger
- **Métropoles / périphéries** : les grandes villes captent emplois qualifiés et investissements ; villes moyennes et campagnes isolées décrochent.
- **Centres / marges** au sein d’une même région : accès aux soins, à l’école, au très haut débit.
- **Hexagone / outre-mer** : chômage deux à trois fois plus élevé, vie chère.

## Trois grands objectifs
- **Corriger les déséquilibres** entre les territoires.
- **Rendre le territoire compétitif** dans la mondialisation : LGV, ports, aéroports, très haut débit, pôles de compétitivité.
- **Répondre au défi environnemental** : transports collectifs, énergies renouvelables, limitation de l’étalement urbain.

## Une multitude d’acteurs
- L’**État**, qui fixe les orientations et finance (autrefois la DATAR, aujourd’hui l’**ANCT**, Agence nationale de la cohésion des territoires).
- Les **collectivités territoriales** : la **région** (développement économique, transports, lycées), le **département** (routes, collèges, action sociale), la **commune** et l’**intercommunalité** (urbanisme, écoles, déchets).
- L’**Union européenne**, par ses fonds (**FEDER**) qui cofinancent des projets régionaux.
- Les **entreprises**, qui investissent, et les **habitants et associations**, consultés lors des enquêtes publiques — parfois opposés aux projets.

> Aucun aménagement d’ampleur n’a un seul auteur : c’est toujours une négociation entre plusieurs échelles.

## Des exemples et leurs limites
LGV, **Grand Paris Express**, **Action cœur de ville** pour les centres de villes moyennes, **maisons France Services**, plan **France Très Haut Débit**, maisons de santé. Mais un aménagement peut aussi creuser l’écart : une LGV qui met une métropole à deux heures de Paris peut vider les villes qu’elle traverse sans s’y arrêter — c’est l’**effet tunnel**.`,
          },
          questions: [
            ['Qu’est-ce qu’aménager le territoire ?', ['Le transformer volontairement pour le rendre plus attractif, accessible ou juste', 'Le laisser évoluer sans intervention', 'Le diviser en nouvelles régions administratives', 'Le protéger de toute construction'], 0, 'C’est une action publique volontaire, menée à plusieurs échelles.'],
            ['Quelle agence de l’État conduit aujourd’hui la politique d’aménagement ?', ['L’ANCT, Agence nationale de la cohésion des territoires', 'L’INSEE', 'La Banque de France', 'L’Agence spatiale européenne'], 0, 'Elle a succédé à la DATAR, créée en 1963.'],
            ['Quelle collectivité est chef de file du développement économique et des transports ?', ['La région', 'La commune', 'Le département', 'L’intercommunalité'], 0, 'Le département gère surtout routes, collèges et action sociale.'],
            ['Quel fonds européen cofinance des projets d’aménagement régionaux ?', ['Le FEDER', 'La PAC', 'Le FMI', 'Le fonds Schengen'], 0, 'Le Fonds européen de développement régional soutient la politique de cohésion.'],
            ['À quoi sert le programme Action cœur de ville ?', ['À réhabiliter les centres des villes moyennes désertés par le commerce', 'À agrandir les métropoles régionales', 'À construire des zones commerciales périphériques', 'À financer les stations de ski'], 0, 'Logement, commerce et services publics y sont traités ensemble.'],
            ['Quel plan vise à apporter la fibre optique sur tout le territoire ?', ['Le plan France Très Haut Débit', 'Le plan Marshall', 'Le plan Vigipirate', 'Le plan Grand Froid'], 0, 'La fracture numérique est devenue une inégalité territoriale majeure.'],
            ['Qu’est-ce que l’effet tunnel d’une ligne à grande vitesse ?', ['La LGV traverse des territoires sans s’y arrêter, et peut les affaiblir', 'La LGV passe sous une montagne', 'La LGV double le trafic des gares intermédiaires', 'La LGV supprime toutes les lignes régionales'], 0, 'Un aménagement peut creuser l’écart qu’il prétend réduire.'],
            ['L’aménagement du territoire est décidé par l’État seul.', ['Vrai', 'Faux'], 1, 'État, collectivités, Union européenne, entreprises et habitants y prennent part.'],
          ],
        },
        {
          titre: 'La politique de la ville',
          axe: 'Pourquoi et comment aménager le territoire ?',
          lecon: {
            titre: 'Réparer la ville là où elle sépare',
            cours: `La **politique de la ville** est l’ensemble des mesures destinées aux quartiers urbains les plus en difficulté. Elle est née dans les années 1980, après les premières émeutes urbaines dans les banlieues.

## Les quartiers concernés
Ce sont les **quartiers prioritaires de la politique de la ville (QPV)** : environ 1 500 quartiers, 5 millions d’habitants. Un seul critère les désigne depuis 2014 — le **revenu des habitants**. On y trouve souvent :
- des **grands ensembles** construits dans les années 1950-1970, aujourd’hui dégradés ;
- un **taux de pauvreté** trois fois supérieur à la moyenne nationale ;
- un chômage élevé, en particulier chez les jeunes ;
- un **enclavement** : mal desservis, coupés du reste de la ville par une rocade ou une voie ferrée.

## Deux volets d’action
**1. Le volet urbain : rénover.** L’**ANRU** (Agence nationale pour la rénovation urbaine) démolit les barres les plus dégradées, reconstruit des immeubles plus petits, réaménage les espaces publics, ouvre des rues et amène le **tramway** pour désenclaver.

**2. Le volet humain : accompagner.** Éducation prioritaire (**REP** et **REP+**) avec des classes allégées, dispositifs de réussite éducative, maisons de justice, associations de quartier, **zones franches urbaines** qui exonèrent d’impôts les entreprises qui s’installent.

## L’objectif : la mixité sociale
La **loi SRU** impose aux communes d’au moins 3 500 habitants un minimum de **25 % de logements sociaux**, pour que le logement social cesse d’être concentré dans les mêmes communes.

> Rénover les immeubles ne suffit pas : sans emploi, sans école et sans transports, un quartier rénové reste un quartier relégué.

## Un bilan discuté
Les quartiers ont changé de visage, mais les écarts de revenus et de chômage avec le reste de la ville se sont peu réduits. Beaucoup de communes préfèrent encore payer l’amende que construire des logements sociaux.`,
          },
          questions: [
            ['Que désigne le sigle QPV ?', ['Quartier prioritaire de la politique de la ville', 'Quartier public de valorisation', 'Quartier péri-urbain de veille', 'Quartier protégé et vert'], 0, 'Environ 1 500 quartiers et 5 millions d’habitants sont concernés.'],
            ['Quel critère sert depuis 2014 à désigner un quartier prioritaire ?', ['Le revenu des habitants', 'La densité de population', 'L’âge des bâtiments', 'La distance au centre-ville'], 0, 'Un critère unique, qui remplace les zonages superposés d’avant.'],
            ['Que fait l’ANRU ?', ['Elle démolit, reconstruit et désenclave les grands ensembles', 'Elle finance les exploitations agricoles', 'Elle gère les parcs nationaux', 'Elle construit les lignes à grande vitesse'], 0, 'Rénovation des immeubles et réaménagement des espaces publics.'],
            ['Que désignent les sigles REP et REP+ ?', ['Les réseaux d’éducation prioritaire', 'Les régions économiques prioritaires', 'Les réseaux express parisiens', 'Les réserves écologiques protégées'], 0, 'Classes allégées et moyens renforcés dans les établissements concernés.'],
            ['Qu’est-ce qu’une zone franche urbaine ?', ['Un quartier où les entreprises qui s’installent sont exonérées d’impôts', 'Un quartier interdit à la circulation automobile', 'Une zone commerciale de périphérie', 'Un quartier entièrement piétonnier'], 0, 'L’objectif est d’y ramener de l’emploi.'],
            ['Quel pourcentage de logements sociaux la loi SRU impose-t-elle aux communes concernées ?', ['25 %', '10 %', '50 %', '5 %'], 0, 'Pour éviter que le logement social reste concentré dans les mêmes communes.'],
            ['Quel aménagement sert souvent à désenclaver un quartier prioritaire ?', ['L’arrivée du tramway et l’ouverture de nouvelles rues', 'La construction d’une rocade supplémentaire', 'La fermeture des commerces de proximité', 'L’installation d’une zone industrialo-portuaire'], 0, 'L’enclavement est l’une des causes majeures de la relégation.'],
            ['La politique de la ville a fait disparaître les écarts entre les quartiers prioritaires et le reste de la ville.', ['Vrai', 'Faux'], 1, 'Le bâti a changé, mais les écarts de revenus et de chômage se sont peu réduits.'],
          ],
        },
        {
          titre: 'Les territoires ultra-marins français',
          axe: 'Pourquoi et comment aménager le territoire ?',
          lecon: {
            titre: 'La France des trois océans',
            cours: `La France ne s’arrête pas à l’Hexagone : ses **territoires ultramarins**, répartis dans les trois océans, portent environ **2,8 millions d’habitants** et font d’elle une puissance mondiale.

## Des statuts différents
- Les cinq **DROM** (départements et régions d’outre-mer) : **Guadeloupe, Martinique, Guyane, La Réunion, Mayotte**. Ce sont des départements français à part entière, et des **régions ultrapériphériques (RUP)** de l’Union européenne.
- Les **COM** (collectivités d’outre-mer), plus autonomes : Polynésie française, Saint-Pierre-et-Miquelon, Saint-Martin, Saint-Barthélemy, Wallis-et-Futuna.
- La **Nouvelle-Calédonie**, au statut particulier, et les **TAAF** (Terres australes et antarctiques françaises), sans population permanente.

## Trois contraintes lourdes
- L’**éloignement** et la **discontinuité territoriale** : des milliers de kilomètres séparent ces territoires de l’Hexagone, ce qui renchérit tout — c’est la **vie chère**.
- L’**insularité** et l’exiguïté, sauf en Guyane.
- Les **risques naturels** : cyclones, séismes, volcans (la Soufrière, le Piton de la Fournaise), submersion.

S’y ajoutent un **chômage** deux à trois fois supérieur à celui de l’Hexagone, une forte dépendance aux importations et aux transferts publics.

## De vrais atouts
- Une **biodiversité** exceptionnelle : l’outre-mer abrite 80 % de la biodiversité française.
- Le **tourisme**, l’agriculture tropicale (banane, canne à sucre, vanille), la pêche.
- Le **centre spatial de Kourou**, en Guyane, base de lancement européenne.
- Une immense **zone économique exclusive (ZEE)** : grâce à l’outre-mer, la France possède le **deuxième domaine maritime du monde**, environ 11 millions de km².

> Sans l’outre-mer, la France serait une puissance européenne ; avec lui, elle est présente dans tous les océans du globe.`,
          },
          questions: [
            ['Combien de DROM la France compte-t-elle ?', ['Cinq', 'Trois', 'Sept', 'Dix'], 0, 'Guadeloupe, Martinique, Guyane, La Réunion et Mayotte.'],
            ['Qu’est-ce qu’une région ultrapériphérique (RUP) ?', ['Un territoire ultramarin qui fait partie de l’Union européenne', 'Un territoire totalement indépendant de la France', 'Une région frontalière de l’Hexagone', 'Une réserve naturelle protégée par l’ONU'], 0, 'Les DROM sont à ce titre éligibles aux fonds européens.'],
            ['Qu’appelle-t-on la discontinuité territoriale ?', ['Le fait que ces territoires soient séparés de l’Hexagone par des milliers de kilomètres', 'Le morcellement des parcelles agricoles', 'L’absence de routes entre deux villes', 'La rupture d’un câble sous-marin'], 0, 'Elle renchérit les transports et explique en partie la vie chère.'],
            ['Quel volcan est situé à La Réunion ?', ['Le Piton de la Fournaise', 'La Soufrière', 'La montagne Pelée', 'Le Stromboli'], 0, 'La Soufrière est en Guadeloupe, la montagne Pelée en Martinique.'],
            ['Où se trouve le centre spatial européen de lancement ?', ['À Kourou, en Guyane', 'À Papeete, en Polynésie', 'À Saint-Denis, à La Réunion', 'À Nouméa, en Nouvelle-Calédonie'], 0, 'Sa proximité de l’équateur facilite les lancements.'],
            ['Quelle part de la biodiversité française l’outre-mer abrite-t-il ?', ['Environ 80 %', 'Environ 10 %', 'Environ 30 %', 'Environ 50 %'], 0, 'Récifs coralliens, forêt amazonienne et espèces endémiques.'],
            ['Grâce à l’outre-mer, quel rang la France occupe-t-elle pour son domaine maritime ?', ['Le deuxième rang mondial', 'Le premier rang mondial', 'Le cinquième rang mondial', 'Le dixième rang mondial'], 0, 'Environ 11 millions de km² de zone économique exclusive.'],
            ['Le chômage dans les DROM est comparable à celui de l’Hexagone.', ['Vrai', 'Faux'], 1, 'Il y est deux à trois fois plus élevé, avec une vie plus chère.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : La France et l'Union européenne
        // ===================================================================
        {
          titre: 'L’Union européenne : un territoire en construction',
          axe: 'La France et l’Union européenne',
          lecon: {
            titre: 'Comment 27 États font un territoire commun',
            cours: `L’**Union européenne** réunit **27 États** et environ **450 millions d’habitants**. Elle est née de la volonté d’empêcher le retour de la guerre en Europe.

## Les grandes étapes
- **1951** : la **CECA** met en commun le charbon et l’acier de six pays, dont la France et l’Allemagne.
- **1957** : le **traité de Rome** crée la **CEE** — un marché commun à six.
- **1992** : le **traité de Maastricht** crée l’**Union européenne** et la **citoyenneté européenne**.
- **2002** : l’**euro** entre en circulation ; il est aujourd’hui la monnaie de 20 États.
- **2004** : le grand élargissement à l’Est fait entrer dix pays d’un coup.
- **2020** : le **Brexit** fait sortir le Royaume-Uni — l’Union passe de 28 à 27 membres.

## Un territoire qui s’élargit et s’approfondit
S’**élargir**, c’est accueillir de nouveaux États (de 6 en 1957 à 27 aujourd’hui, avec des candidats dans les Balkans et en Ukraine). S’**approfondir**, c’est mettre en commun toujours plus de compétences : marché unique, monnaie, frontières, recherche, environnement.

## Ce que l’Union change au quotidien
- La **libre circulation** des personnes, des marchandises, des services et des capitaux (le **marché unique**).
- L’espace **Schengen**, où l’on franchit les frontières intérieures sans contrôle.
- La **citoyenneté européenne** : voter aux élections municipales et européennes dans son pays de résidence, étudier ailleurs avec **Erasmus**, être soigné partout.

## Qui décide ?
- Le **Parlement européen** (Strasbourg), élu au suffrage universel direct tous les cinq ans.
- La **Commission européenne** (Bruxelles), qui propose les lois et fait appliquer les traités.
- Le **Conseil de l’Union européenne** et le **Conseil européen**, où siègent les États.

> L’Union n’est ni un État, ni une simple alliance : les États lui ont transféré une part de leur souveraineté, et gardent le reste.`,
          },
          questions: [
            ['Combien d’États membres compte l’Union européenne depuis 2020 ?', ['27', '25', '28', '30'], 0, 'Le Brexit a fait sortir le Royaume-Uni en 2020.'],
            ['Quel traité de 1957 crée le marché commun ?', ['Le traité de Rome', 'Le traité de Maastricht', 'Le traité de Lisbonne', 'Le traité de Versailles'], 0, 'Il donne naissance à la CEE, à six États.'],
            ['Que crée le traité de Maastricht en 1992 ?', ['L’Union européenne et la citoyenneté européenne', 'La CECA', 'L’espace Schengen', 'L’OTAN'], 0, 'Il pose aussi les bases de la monnaie unique.'],
            ['En quelle année l’euro entre-t-il en circulation ?', ['2002', '1992', '1999', '2010'], 0, 'Il est aujourd’hui la monnaie de 20 des 27 États membres.'],
            ['Qu’est-ce que l’espace Schengen ?', ['Un espace où l’on franchit les frontières intérieures sans contrôle', 'La zone qui utilise l’euro', 'Le siège du Parlement européen', 'La zone de libre-échange avec les États-Unis'], 0, 'Il ne se confond ni avec l’UE ni avec la zone euro.'],
            ['Quelle institution européenne est élue au suffrage universel direct ?', ['Le Parlement européen', 'La Commission européenne', 'Le Conseil européen', 'La Cour de justice'], 0, 'Les citoyens le renouvellent tous les cinq ans ; il siège à Strasbourg.'],
            ['Quel programme permet aux étudiants d’étudier dans un autre pays de l’Union ?', ['Erasmus', 'Schengen', 'Interreg', 'Horizon'], 0, 'C’est l’une des expériences les plus concrètes de la citoyenneté européenne.'],
            ['Élargir l’Union et l’approfondir désignent la même chose.', ['Vrai', 'Faux'], 1, 'S’élargir, c’est accueillir de nouveaux États ; s’approfondir, c’est mettre en commun davantage de compétences.'],
          ],
        },
        {
          titre: 'Les contrastes territoriaux à l’intérieur de l’Union européenne',
          axe: 'La France et l’Union européenne',
          lecon: {
            titre: 'Un centre, des périphéries, des frontières qui s’effacent',
            cours: `L’Union européenne forme un territoire **très inégal** : d’une région à l’autre, la richesse par habitant peut varier du simple au sextuple.

## Un centre : la mégalopole européenne
Une **dorsale** urbaine et industrielle court de **Londres à Milan**, en passant par les Pays-Bas, la vallée du Rhin et la Suisse — parfois appelée « banane bleue ». On y trouve :
- les plus fortes densités de population ;
- les grandes places financières (Francfort, Amsterdam, Paris) ;
- les plus grands ports d’Europe : **Rotterdam**, Anvers, Hambourg ;
- les axes de transport les plus chargés.

## Des périphéries multiples
- Les **périphéries méridionales** (Sud de l’Italie, Grèce, une partie de l’Espagne et du Portugal), touchées par le chômage.
- Les **périphéries orientales**, entrées en 2004-2013 : elles rattrapent vite leur retard, portées par les investissements industriels, mais restent plus pauvres.
- Les **régions ultrapériphériques** : DROM français, Açores, Madère, Canaries.

## Ce qui rapproche les territoires
- La **politique de cohésion** et ses fonds (**FEDER**, Fonds social européen) : environ un tiers du budget de l’Union, dirigé en priorité vers les régions les moins riches.
- Les **eurorégions** et les programmes transfrontaliers (**Interreg**), qui font coopérer des régions voisines de deux pays.
- Les **corridors de transport** européens : LGV, autoroutes, tunnels alpins.

> Un habitant de Lille travaille parfois en Belgique, un Alsacien en Allemagne : dans les régions frontalières, la frontière est devenue une ressource plutôt qu’une barrière.

## Des contrastes qui se déplacent
L’élargissement à l’Est a déplacé le **centre de gravité** de l’Union vers l’est, et des délocalisations d’Ouest en Est ont suivi. Les écarts se réduisent entre pays, mais se creusent souvent **à l’intérieur** de chaque pays, entre capitales et campagnes.`,
          },
          questions: [
            ['Comment nomme-t-on la dorsale urbaine et industrielle qui va de Londres à Milan ?', ['La mégalopole européenne', 'La diagonale du vide', 'Le croissant fertile', 'L’arc atlantique'], 0, 'On l’a aussi surnommée la « banane bleue ».'],
            ['Quel est le plus grand port de l’Union européenne ?', ['Rotterdam', 'Marseille', 'Gênes', 'Le Pirée'], 0, 'Aux Pays-Bas, à l’embouchure du Rhin.'],
            ['Quelles régions ont rejoint l’Union lors du grand élargissement de 2004 ?', ['Les pays d’Europe centrale et orientale', 'Les pays scandinaves', 'Les pays du Maghreb', 'Les îles britanniques'], 0, 'Dix pays sont entrés d’un coup, dont la Pologne et la Hongrie.'],
            ['Que finance la politique de cohésion de l’Union ?', ['La réduction des écarts de développement entre régions', 'La défense commune', 'Les aides aux agriculteurs uniquement', 'La construction du Parlement européen'], 0, 'Elle mobilise environ un tiers du budget européen.'],
            ['À quoi servent les programmes Interreg et les eurorégions ?', ['À faire coopérer des régions voisines situées de part et d’autre d’une frontière', 'À fermer les frontières intérieures', 'À financer les capitales européennes', 'À sélectionner les nouveaux États membres'], 0, 'Transports, santé et emploi y sont pensés à deux pays.'],
            ['Quelles sont les régions ultrapériphériques de l’Union ?', ['Les DROM français, les Açores, Madère et les Canaries', 'Les pays candidats des Balkans', 'Les régions frontalières de la Russie', 'Les capitales insulaires de la Méditerranée'], 0, 'Éloignées du continent mais pleinement européennes.'],
            ['Quel effet l’élargissement à l’Est a-t-il eu sur le territoire européen ?', ['Il a déplacé le centre de gravité de l’Union vers l’est', 'Il a vidé les pays de l’Est de toute industrie', 'Il a supprimé la politique de cohésion', 'Il a fait sortir plusieurs États de l’Union'], 0, 'Des délocalisations d’Ouest en Est ont suivi.'],
            ['Les écarts de richesse entre régions européennes sont aujourd’hui négligeables.', ['Vrai', 'Faux'], 1, 'D’une région à l’autre, le PIB par habitant peut varier du simple au sextuple.'],
          ],
        },
        {
          titre: 'L’Europe dans le monde',
          axe: 'La France et l’Union européenne',
          lecon: {
            titre: 'Une puissance commerciale, une puissance politique inachevée',
            cours: `Avec 450 millions d’habitants et environ **17 % du PIB mondial**, l’Union européenne est un géant économique. Sa puissance politique, elle, reste très en deçà.

## Une puissance économique de premier rang
- **Première puissance commerciale du monde** : premier exportateur de services, deuxième exportateur de marchandises.
- Un **marché unique** de 450 millions de consommateurs, que toute entreprise du monde veut atteindre.
- L’**euro**, deuxième monnaie de réserve mondiale après le dollar.
- Des **normes** (sécurité alimentaire, environnement, données personnelles avec le RGPD) que les entreprises étrangères doivent respecter pour vendre en Europe : c’est le pouvoir de la norme.

## Une puissance culturelle et diplomatique réelle
Premier **pôle touristique** mondial, premier donateur d’**aide publique au développement**, moteur des négociations climatiques (accord de Paris, 2015). L’Union pèse par ses idées et ses règles autant que par ses marchés.

## Mais une puissance politique inachevée
- Pas d’**armée commune** : la défense repose largement sur l’**OTAN** et sur les armées nationales.
- Une diplomatie qui exige souvent l’**unanimité des 27** : un seul État peut bloquer une décision.
- Une **dépendance énergétique** (pétrole, gaz) et technologique (numérique) qui limite sa liberté d’action.

> L’Union pèse par ses marchés et ses normes, beaucoup moins par ses armes.

## Un monde plus concurrentiel
La montée de la **Chine** et de l’**Inde**, la rivalité entre la Chine et les États-Unis et le retour de la guerre en Europe avec l’invasion de l’**Ukraine** (2022) obligent l’Union à repenser son autonomie : production de vaccins, de semi-conducteurs, d’énergie, d’armement.`,
          },
          questions: [
            ['Quel rang commercial l’Union européenne occupe-t-elle dans le monde ?', ['Le premier rang', 'Le troisième rang', 'Le cinquième rang', 'Le dixième rang'], 0, 'Premier exportateur de services, deuxième de marchandises.'],
            ['Quelle place occupe l’euro parmi les monnaies mondiales ?', ['La deuxième monnaie de réserve, après le dollar', 'La première monnaie de réserve', 'La cinquième monnaie de réserve', 'Une monnaie sans usage hors d’Europe'], 0, 'Il donne à l’Union un poids monétaire international.'],
            ['Que montre l’exemple du RGPD sur les données personnelles ?', ['Que les normes européennes s’imposent aux entreprises étrangères qui veulent vendre en Europe', 'Que l’Union possède une armée commune', 'Que l’Union fixe les prix mondiaux', 'Que l’Union interdit le commerce extérieur'], 0, 'C’est le pouvoir de la norme, un levier de puissance discret mais réel.'],
            ['Quelle est la principale faiblesse de l’Union européenne comme puissance ?', ['Sa faiblesse politique et militaire', 'Son poids commercial insuffisant', 'L’absence de monnaie commune', 'Sa population trop réduite'], 0, 'Pas d’armée commune, une diplomatie à l’unanimité, une dépendance à l’OTAN.'],
            ['Pourquoi la diplomatie européenne est-elle souvent lente ?', ['Parce que de nombreuses décisions exigent l’unanimité des 27', 'Parce que le Parlement ne siège qu’une fois par an', 'Parce que la Commission n’a aucun pouvoir', 'Parce que les États n’ont pas d’ambassades'], 0, 'Un seul État peut bloquer une décision commune.'],
            ['Quel accord climatique de 2015 l’Union a-t-elle fortement soutenu ?', ['L’accord de Paris', 'Le protocole de Montréal', 'Le traité de Rome', 'Les accords de Schengen'], 0, 'L’Union est l’un des moteurs des négociations climatiques mondiales.'],
            ['Quel événement de 2022 a relancé le débat sur l’autonomie européenne ?', ['L’invasion de l’Ukraine par la Russie', 'Le Brexit', 'L’entrée de la Croatie dans l’Union', 'La création de l’euro'], 0, 'Énergie, armement et industrie stratégique sont redevenus des sujets européens.'],
            ['L’Union européenne dispose d’une armée commune.', ['Vrai', 'Faux'], 1, 'Sa défense repose sur l’OTAN et sur les armées nationales.'],
          ],
        },
        {
          titre: 'La France dans l’Union européenne',
          axe: 'La France et l’Union européenne',
          lecon: {
            titre: 'Un membre fondateur, un carrefour, une puissance mondiale',
            cours: `La France est l’un des **six États fondateurs** de la construction européenne : CECA en 1951, traité de Rome en 1957. Elle en est aujourd’hui la **deuxième économie** et le pays le plus **étendu**.

## Une place centrale dans l’Union
- **Politique** : avec l’Allemagne, elle forme le « couple franco-allemand », moteur historique des grandes décisions européennes.
- **Institutionnelle** : le **Parlement européen** siège à **Strasbourg**.
- **Économique** : premier bénéficiaire de la **PAC**, membre de la zone **euro** et de l’espace **Schengen**.
- **Territoriale** : ses **régions frontalières** (Nord, Grand Est, Alsace, Savoie) vivent au quotidien avec la Belgique, l’Allemagne, la Suisse, l’Italie et l’Espagne ; des dizaines de milliers de **travailleurs transfrontaliers** franchissent chaque jour la frontière.

## Un carrefour de circulation
Située entre l’Europe du Nord et la péninsule Ibérique, entre l’Atlantique et la Méditerranée, la France est traversée par les grands **corridors européens** : LGV vers Londres et Barcelone, tunnels alpins, autoroutes du Rhône et du Rhin, ports du Havre et de Marseille.

## Une puissance mondiale par ses propres moyens
- Membre **permanent** du Conseil de sécurité de l’**ONU**, avec droit de veto.
- **Dissuasion nucléaire** et armée projetable.
- Deuxième **réseau diplomatique** et deuxième **ZEE** du monde, grâce à l’outre-mer.
- Un fort *soft power* : la **francophonie** (plus de 320 millions de locuteurs), la première fréquentation touristique du monde, un réseau d’instituts culturels et de lycées français sur tous les continents.

> La France agit à deux échelles : seule quand il s’agit de son siège à l’ONU ou de sa défense, à 27 quand il s’agit de commerce, de climat ou de normes.`,
          },
          questions: [
            ['La France fait-elle partie des États fondateurs de la construction européenne ?', ['Oui, dès la CECA en 1951', 'Non, elle a rejoint l’Union en 1973', 'Non, elle est entrée en 1992', 'Oui, mais seulement depuis 1986'], 0, 'Elle signe la CECA en 1951 puis le traité de Rome en 1957.'],
            ['Quelle ville française accueille le Parlement européen ?', ['Strasbourg', 'Paris', 'Lyon', 'Lille'], 0, 'La Commission siège à Bruxelles, le Parlement à Strasbourg.'],
            ['Comment appelle-t-on le moteur historique des grandes décisions européennes ?', ['Le couple franco-allemand', 'Le trio latin', 'Le groupe de Visegrád', 'L’alliance atlantique'], 0, 'France et Allemagne portent ensemble la plupart des avancées de l’Union.'],
            ['Qui sont les travailleurs transfrontaliers ?', ['Des habitants qui franchissent chaque jour la frontière pour aller travailler', 'Des saisonniers venus d’un autre continent', 'Des diplomates en poste à l’étranger', 'Des routiers du transport international'], 0, 'Ils sont des dizaines de milliers dans le Grand Est, le Nord et la Savoie.'],
            ['De quelle politique européenne la France est-elle la première bénéficiaire ?', ['La Politique agricole commune (PAC)', 'La politique de défense commune', 'La politique spatiale', 'La politique de la pêche uniquement'], 0, 'Sa puissance agricole en fait la première destinataire des aides.'],
            ['Quel siège la France occupe-t-elle à l’ONU ?', ['Un siège permanent au Conseil de sécurité, avec droit de veto', 'Un siège tournant à l’Assemblée générale', 'La présidence permanente de l’UNESCO', 'Aucun siège permanent'], 0, 'Elle est l’un des cinq membres permanents.'],
            ['Qu’est-ce que le soft power de la France ?', ['Son influence par la culture, la langue et les idées', 'Sa puissance militaire nucléaire', 'Son excédent commercial', 'Son droit de veto à l’ONU'], 0, 'Francophonie, tourisme, instituts culturels et lycées français à l’étranger.'],
            ['La France agit uniquement à l’échelle européenne dans les affaires du monde.', ['Vrai', 'Faux'], 1, 'Elle agit seule pour son siège à l’ONU et sa défense, et à 27 pour le commerce, le climat ou les normes.'],
          ],
        },
      ],
    },
  ],
}
