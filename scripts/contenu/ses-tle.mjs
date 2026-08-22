// SES TERMINALE (spécialité) — les 31 fiches du programme officiel, dans
// l'ordre de ses 12 chapitres : les 5 questionnements de science économique
// (croissance · commerce international · chômage · crises financières ·
// politiques économiques européennes), les 4 de sociologie et science politique
// (structure sociale · École · mobilité sociale · travail et emploi · engagement
// politique) et les 2 de regards croisés (justice sociale · environnement).
//
// POURQUOI UN MODULE NEUF : les SES de Terminale viennent des migrations 008 et
// 145, écrites à la main et DÉJÀ EXÉCUTÉES, qui ne doivent plus être
// régénérées. Le slug `ses` n'avait encore aucun module dans scripts/contenu —
// d'où la génération par `--modules`, pour que la commande imprimée dans
// l'en-tête reste juste le jour où un second module apparaîtra (cf. le README).
//
// PÉRIMÈTRE : la TERMINALE SEULE. Le ménage est borné à `level = 'Tle'` : la 2de
// et la 1re portent les mêmes leçons génériques et ne bougent pas.
//
// LE DÉCOUPAGE EST CELUI DES 12 CHAPITRES, pas des 3 parties du BO. Le BO range
// le programme sous trois parties (science économique · sociologie et science
// politique · regards croisés). Trois en-têtes pour trente et une fiches ne
// rangeraient presque rien — « science économique » pèserait à elle seule
// 14 fiches. Ce sont les chapitres, formulés en QUESTION comme le veut la
// discipline, que l'élève lit sur le cahier de son professeur. Même arbitrage
// que pour l'enseignement scientifique (248), la SVT (251) et la
// physique-chimie (252).

export default {
  slug: 'ses',
  nom: 'SES',

  titreMigration: 'SES Tle (spécialité) — LE PROGRAMME OFFICIEL (31 fiches)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs Tle ses, 20/08/2026) :
la spécialité SES de Terminale n'avait que QUATRE chapitres, taillés dans un
découpage maison hérité des migrations 008 et 145 (« Croissance et
environnement », « Le commerce international », « Les mutations du travail »,
« La justice sociale »), chacun résumant un questionnement entier du BO en UNE
fiche de dix questions. Sur les douze chapitres du programme, huit n'avaient
AUCUNE entrée : le chômage, les crises financières, les politiques économiques
européennes, la structure sociale, l'École, la mobilité sociale, l'engagement
politique, l'action publique pour l'environnement. Toute la sociologie, hormis
un chapitre sur le travail, était absente — sur une spécialité à coefficient 16
dont l'épreuve dure 4 heures et où l'élève choisit entre une dissertation et une
épreuve composée qui balaient les trois parties du programme.

Cette migration installe les 31 fiches du programme, rangées sous ses 12
chapitres, et retire les 4 fiches composites qu'elles recouvrent.

PÉRIMÈTRE : la TERMINALE SEULE. La 2de et la 1re gardent leurs fiches : le
ménage est borné au niveau Tle.

⚠️ CE QUI EST PERDU AU PASSAGE : les 4 leçons « Exercices types » de la 145
(elles n'ont aucun quiz en base, sondé le 20/08/2026) et les 40 questions des 4
leçons « L'essentiel du cours ». Elles étaient adossées au découpage composite ;
les réécrire fiche par fiche est un chantier à part.

⚠️ LES MIGRATIONS 008 ET 145 SONT REJOUABLES : les recoller un jour ferait
revenir les 4 fiches composites en doublon des 31 fiches du programme.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 31 fiches sous 12 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que la 234 n'a jamais été
exécutée en production (sondé le 20/08/2026) — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 4 anciennes fiches
déjà supprimées et les 31 neuves pas encore posées : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 fiches composites partent, au niveau Tle SEULEMENT. Ce sont des
résumés d'un questionnement entier du BO en une fiche, que les 31 fiches neuves
recouvrent : « Croissance et environnement » se lit désormais en les trois fiches
du chapitre 1, « Le commerce international » en les trois du chapitre 2, « Les
mutations du travail » en les trois du chapitre 9, « La justice sociale » en les
trois du chapitre 11.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est
ON DELETE SET NULL : ils survivraient orphelins à leur chapitre, et toujours
tirables par le moteur de questions), puis les chapitres, dont les leçons partent
en cascade.
Les trois DELETE sont bornés aux QUATRE TITRES EXACTS et au seul niveau Tle. Sans
cette borne, un rejeu effacerait les quiz des 31 fiches neuves — le ménage tourne
avant les insertions à CHAQUE passage.
Aucun des quatre titres ne porte d'apostrophe : pas de piège typographique ici,
contrairement au ménage de la 249.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'ses'
   AND c.level = 'Tle'
   AND c.title IN ('Croissance et environnement',
                   'Le commerce international',
                   'Les mutations du travail',
                   'La justice sociale');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'ses'
   AND c.level = 'Tle'
   AND c.title IN ('Croissance et environnement',
                   'Le commerce international',
                   'Les mutations du travail',
                   'La justice sociale');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'ses'
   AND c.level = 'Tle'
   AND c.title IN ('Croissance et environnement',
                   'Le commerce international',
                   'Les mutations du travail',
                   'La justice sociale');`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      chapitres: [
        // ---- Chapitre 1 : les sources et les défis de la croissance ---------
        {
          titre: 'Les sources de la croissance économique',
          axe: 'Quelles sont les sources et quels sont les défis de la croissance économique ?',
          lecon: {
            titre: 'D’où vient la richesse en plus',
            cours: `La **croissance économique** est l’augmentation durable de la production de biens et de services d’un pays, mesurée par la variation du **PIB en volume** (c’est-à-dire corrigée de l’inflation).

## Les facteurs de production
La production combine deux facteurs :
- le **travail** : le nombre d’heures travaillées, mais aussi leur qualité — le **capital humain** (formation, expérience, santé) ;
- le **capital fixe** : les machines, bâtiments et logiciels utilisés durablement.

## Croissance extensive et croissance intensive
- **extensive** : on produit plus parce qu’on utilise **plus** de facteurs (plus d’actifs, plus de machines) ;
- **intensive** : on produit plus **avec la même quantité** de facteurs, grâce aux gains de **productivité**.

Seule la croissance intensive est soutenable à long terme : la population active et le stock de capital ne peuvent pas croître indéfiniment.

## La productivité globale des facteurs
La **PGF** est la part de la croissance qui n’est expliquée **ni** par la hausse du travail **ni** par celle du capital. Elle mesure l’efficacité de leur combinaison, et sert d’approximation du **progrès technique**. Dans les pays développés, elle explique l’essentiel de la croissance de longue période.

## Le progrès technique, moteur central
Le progrès technique désigne l’ensemble des innovations qui améliorent les procédés, les produits et l’organisation. Schumpeter parle de **destruction créatrice** : l’innovation détruit des activités anciennes en même temps qu’elle en crée de nouvelles. C’est un processus douloureux à court terme et créateur de croissance à long terme.

## Une croissance endogène
Les théories de la **croissance endogène** (Romer, Lucas, Barro) montrent que le progrès technique n’est pas un cadeau tombé du ciel : il est **produit** par les décisions d’investissement des agents. Quatre types de capital l’alimentent :
- le **capital physique** (les machines) ;
- le **capital humain** (l’éducation) ;
- le **capital public** (les infrastructures) ;
- le **capital technologique** (la recherche-développement).

## Les rendements croissants et les externalités
La connaissance a une particularité : elle ne se détruit pas en s’utilisant, et elle profite à d’autres que celui qui l’a produite. Ces **externalités positives** expliquent que l’investissement privé en recherche soit spontanément **inférieur à l’optimum social** — d’où l’intervention publique (subventions, crédit d’impôt recherche, universités).

> Croissance n’est pas développement : le PIB mesure une production, pas un bien-être. L’**IDH** y ajoute l’espérance de vie et le niveau d’éducation, sans mesurer pour autant les inégalités ni l’état de l’environnement.`,
          },
          questions: [
            ['Qu’est-ce que la croissance intensive ?', ['Produire plus avec la même quantité de facteurs, grâce aux gains de productivité', 'Produire plus en utilisant plus de travail et de capital', 'Produire plus en augmentant les prix', 'Produire plus en réduisant les importations'], 0, 'C’est la seule soutenable à long terme : les facteurs ne peuvent pas croître indéfiniment.'],
            ['Que mesure la productivité globale des facteurs (PGF) ?', ['La part de la croissance inexpliquée par la hausse du travail et du capital', 'La production par salarié', 'Le stock de capital fixe', 'Le taux d’investissement'], 0, 'Elle sert d’approximation du progrès technique.'],
            ['Qu’appelle-t-on capital humain ?', ['L’ensemble des savoirs et compétences incorporés dans les travailleurs', 'Le nombre d’actifs occupés', 'Les machines utilisées par les salariés', 'La masse salariale d’une entreprise'], 0, 'Formation, expérience et santé en font partie.'],
            ['La destruction créatrice est un concept de Schumpeter.', ['Vrai', 'Faux'], 0, 'L’innovation détruit des activités anciennes en même temps qu’elle en crée de nouvelles.'],
            ['Que disent les théories de la croissance endogène ?', ['Le progrès technique est produit par les décisions d’investissement des agents', 'La croissance dépend uniquement de la démographie', 'Le progrès technique est un facteur exogène', 'La croissance est impossible sans commerce international'], 0, 'Capital physique, humain, public et technologique en sont les quatre sources.'],
            ['Pourquoi l’investissement privé en recherche est-il spontanément insuffisant ?', ['Parce que la connaissance produit des externalités positives dont d’autres profitent', 'Parce que la recherche est toujours déficitaire', 'Parce que les entreprises manquent de capital', 'Parce que l’État l’interdit'], 0, 'D’où les subventions, le crédit d’impôt recherche et la recherche publique.'],
            ['Le PIB mesure le niveau de bien-être d’une population.', ['Vrai', 'Faux'], 1, 'Il mesure une production. L’IDH y ajoute l’espérance de vie et l’éducation, sans mesurer les inégalités.'],
            ['La croissance économique se mesure par la variation…', ['Du PIB en volume', 'Du PIB en valeur', 'Du revenu médian', 'De la population active'], 0, 'En volume, c’est-à-dire corrigée de l’inflation.'],
          ],
        },
        {
          titre: 'Entretenir la croissance économique : le rôle des institutions et des innovations',
          axe: 'Quelles sont les sources et quels sont les défis de la croissance économique ?',
          lecon: {
            titre: 'Pourquoi certains pays innovent et d’autres non',
            cours: `Deux pays dotés du même capital et de la même main-d’œuvre ne connaissent pas la même croissance. Ce qui les sépare tient largement à leurs **institutions**.

## Ce qu’est une institution
Une institution est l’ensemble des **règles du jeu** d’une société : lois, contrats, droits de propriété, système judiciaire, mais aussi normes et habitudes. Elle fixe les incitations auxquelles répondent les agents économiques.

## Les droits de propriété
C’est l’institution la plus déterminante pour l’innovation. Sans garantie de pouvoir s’approprier le fruit de son effort, personne n’investit sur le long terme. Le **brevet** en est l’instrument le plus direct : il accorde à l’inventeur un **monopole temporaire** (20 ans en général) en échange de la **publication** de l’invention. C’est un compromis assumé entre deux objectifs contradictoires — inciter à innover, et diffuser la connaissance.

## Institutions inclusives et institutions extractives
Acemoglu et Robinson distinguent :
- les institutions **inclusives**, qui répartissent largement le pouvoir et sécurisent les droits du plus grand nombre : elles favorisent l’innovation ;
- les institutions **extractives**, qui concentrent le pouvoir et les revenus au profit d’une élite : elles bloquent la destruction créatrice, parce que celle-ci menace les rentes en place.

## Le rôle de l’État
L’État soutient la croissance par plusieurs canaux :
- il **finance** la recherche fondamentale, non rentable à court terme ;
- il **produit** les infrastructures et l’éducation ;
- il **sécurise** les contrats et la concurrence ;
- il **réduit l’incertitude** par la stabilité de la règle.

## Les droits de propriété peuvent aussi freiner
Un brevet trop large ou trop long bloque les innovations suivantes, qui s’appuient toujours sur les précédentes. Le débat sur les brevets pharmaceutiques ou sur les logiciels libres porte exactement sur ce point : où placer le curseur entre incitation et diffusion.

## L’innovation n’est pas que technologique
Elle peut porter sur le **produit**, le **procédé**, l’**organisation** (le taylorisme, le toyotisme) ou le **débouché** (un nouveau marché). Schumpeter le disait déjà : l’entrepreneur innovant n’est pas nécessairement un inventeur.

> Le lien institutions-croissance n’est pas mécanique : il joue dans les deux sens, et les pays riches ont aussi les moyens de se doter de bonnes institutions. Le repérer, c’est éviter le raccourci du sujet de dissertation.`,
          },
          questions: [
            ['Qu’est-ce qu’une institution, en économie ?', ['L’ensemble des règles du jeu qui fixent les incitations des agents', 'Un organisme public', 'Une entreprise publique', 'Une association reconnue d’utilité publique'], 0, 'Lois, contrats, droits de propriété, mais aussi normes et habitudes.'],
            ['Que garantit un brevet à son détenteur ?', ['Un monopole temporaire, en échange de la publication de l’invention', 'Un monopole définitif', 'Une subvention publique', 'Une exonération d’impôt'], 0, 'C’est un compromis entre inciter à innover et diffuser la connaissance.'],
            ['Selon Acemoglu et Robinson, des institutions extractives…', ['Bloquent l’innovation en protégeant les rentes en place', 'Favorisent la destruction créatrice', 'Répartissent largement le pouvoir', 'Sont typiques des pays développés'], 0, 'Les institutions inclusives, elles, sécurisent les droits du plus grand nombre.'],
            ['Un brevet trop large peut freiner l’innovation.', ['Vrai', 'Faux'], 0, 'Toute innovation s’appuie sur les précédentes : un brevet trop protecteur bloque la suite.'],
            ['Pourquoi l’État finance-t-il la recherche fondamentale ?', ['Parce qu’elle n’est pas rentable à court terme pour un acteur privé', 'Parce que les entreprises n’ont pas de chercheurs', 'Parce que la loi le lui impose', 'Parce qu’elle rapporte des brevets rentables'], 0, 'Ses retombées sont diffuses, lointaines et largement appropriables par d’autres.'],
            ['L’innovation peut être organisationnelle et non technologique.', ['Vrai', 'Faux'], 0, 'Le taylorisme et le toyotisme en sont deux exemples majeurs.'],
            ['Quel est l’effet des droits de propriété sur l’investissement de long terme ?', ['Ils le sécurisent en garantissant l’appropriation du fruit de l’effort', 'Ils le découragent en taxant les profits', 'Ils sont sans effet', 'Ils le remplacent par de l’investissement public'], 0, 'C’est l’institution la plus déterminante pour l’innovation.'],
            ['Selon Schumpeter, l’entrepreneur innovant est nécessairement l’inventeur.', ['Vrai', 'Faux'], 1, 'Il est celui qui met l’innovation sur le marché, ce qui est un autre métier.'],
          ],
        },
        {
          titre: 'Développement et écologie : les limites de la croissance',
          axe: 'Quelles sont les sources et quels sont les défis de la croissance économique ?',
          lecon: {
            titre: 'Une croissance infinie dans un monde fini ?',
            cours: `La croissance a un coût écologique. La question du programme n’est pas de savoir s’il existe, mais s’il est **surmontable** — et par quels moyens.

## Les limites écologiques
Deux types de limites pèsent sur la croissance :
- l’**épuisement des ressources non renouvelables** (énergies fossiles, métaux rares) ;
- la **dégradation des milieux** : climat, biodiversité, qualité de l’air et de l’eau. La pollution est une **externalité négative** : le pollueur n’en supporte pas le coût.

## Croissance soutenable
Le **développement durable** (rapport Brundtland, 1987) est celui qui « répond aux besoins du présent sans compromettre la capacité des générations futures à répondre aux leurs ». Il articule trois piliers : économique, social, environnemental.

## Les quatre capitaux
On distingue le capital **physique**, **humain**, **social** (la qualité des relations et de la confiance) et **naturel**. La soutenabilité se pose alors comme une question de substitution :
- **soutenabilité faible** : les capitaux sont **substituables** — la perte de capital naturel peut être compensée par du capital technologique. Le progrès technique résout le problème ;
- **soutenabilité forte** : certains éléments du capital naturel sont **irremplaçables** (le climat, une espèce éteinte). Il faut alors préserver un stock minimal, quoi qu’il en coûte.

## Le découplage
Le **découplage** entre croissance et pression environnementale est **relatif** quand les émissions croissent moins vite que le PIB, **absolu** quand elles baissent alors que le PIB augmente. Certains pays développés affichent un découplage absolu de leurs émissions territoriales — mais une part s’explique par la **délocalisation** des industries polluantes : l’**empreinte carbone**, qui compte les émissions importées, recule bien plus lentement.

## Les positions en présence
- les tenants de la **croissance verte** misent sur l’innovation et le signal-prix pour verdir la production ;
- les partisans de la **décroissance** jugent le découplage absolu trop lent et trop partiel pour tenir les objectifs climatiques, et proposent de réduire la production elle-même.

Le programme n’arbitre pas : il demande de connaître les arguments et les données.

> Le PIB ignore la destruction du capital naturel : une marée noire l’augmente, puisque le nettoyage est une production. C’est la critique la plus solide de son usage comme boussole.`,
          },
          questions: [
            ['Qu’est-ce qu’une externalité négative ?', ['Un effet néfaste subi par un tiers sans compensation par le marché', 'Une perte comptable pour l’entreprise', 'Un impôt sur les bénéfices', 'Une baisse de la demande'], 0, 'La pollution en est l’exemple type : le pollueur n’en supporte pas le coût.'],
            ['Que défend la soutenabilité forte ?', ['Certains éléments du capital naturel sont irremplaçables et doivent être préservés', 'Le progrès technique peut compenser toute perte de capital naturel', 'La croissance doit être maximale', 'Le capital naturel n’existe pas'], 0, 'La soutenabilité faible, elle, mise sur la substituabilité des capitaux.'],
            ['Qu’est-ce qu’un découplage absolu ?', ['Les émissions baissent alors que le PIB augmente', 'Les émissions croissent moins vite que le PIB', 'Le PIB baisse et les émissions aussi', 'Il n’y a plus aucune émission'], 0, 'Le découplage relatif se contente d’un ralentissement des émissions.'],
            ['L’empreinte carbone d’un pays compte les émissions liées à ses importations.', ['Vrai', 'Faux'], 0, 'C’est pourquoi elle recule bien plus lentement que les émissions territoriales.'],
            ['Quels sont les quatre types de capital au programme ?', ['Physique, humain, social et naturel', 'Fixe, circulant, financier et humain', 'Public, privé, national et étranger', 'Productif, spéculatif, immobilier et naturel'], 0, 'Le capital social désigne la qualité des relations et de la confiance.'],
            ['Le rapport Brundtland (1987) a défini le développement durable.', ['Vrai', 'Faux'], 0, '« Répondre aux besoins du présent sans compromettre ceux des générations futures ».'],
            ['Pourquoi le PIB est-il une mauvaise boussole environnementale ?', ['Il ignore la destruction du capital naturel et compte le nettoyage comme une production', 'Il ne mesure que les services', 'Il est calculé tous les dix ans', 'Il exclut l’industrie'], 0, 'Une marée noire augmente le PIB : c’est la critique la plus solide de son usage.'],
            ['Le programme de Terminale tranche entre croissance verte et décroissance.', ['Vrai', 'Faux'], 1, 'Il demande de connaître les arguments et les données des deux positions.'],
          ],
        },
        // ---- Chapitre 2 : commerce international et internationalisation -----
        {
          titre: 'Les fondements du commerce international',
          axe: 'Quels sont les fondements du commerce international et de l’internationalisation de la production ?',
          lecon: {
            titre: 'Pourquoi deux pays ont intérêt à échanger',
            cours: `Le commerce international ne se réduit pas à « chacun vend ce qu’il sait faire ». Les théories du programme expliquent pourquoi l’échange peut profiter aux deux partenaires, même quand l’un est meilleur en tout.

## L’avantage absolu (Smith)
Chaque pays se spécialise dans le bien qu’il produit **avec moins de facteurs** que l’autre, et échange le surplus. Le raisonnement s’arrête net si un pays est meilleur partout.

## L’avantage comparatif (Ricardo)
La réponse de Ricardo est décisive : un pays a intérêt à se spécialiser là où son **désavantage est le plus faible** — c’est-à-dire là où son **coût d’opportunité** est le plus bas. Même le pays le moins productif en tout gagne à l’échange, car ce qui compte est le rapport **entre** ses productions, pas la comparaison avec l’étranger.

## La dotation factorielle (HOS)
Le modèle **Heckscher-Ohlin-Samuelson** explique la spécialisation par la **dotation relative en facteurs** : un pays abondant en main-d’œuvre peu qualifiée se spécialise dans les productions intensives en ce facteur, un pays abondant en capital et en travail qualifié dans les autres.

## Le commerce entre pays semblables
Ces théories expliquent le commerce **interbranche** (des voitures contre du textile). Or l’essentiel des échanges se fait aujourd’hui **entre pays développés** et **à l’intérieur d’une même branche** : c’est le commerce **intrabranche** (des voitures contre des voitures). Trois explications :
- la **différenciation des produits** : les consommateurs veulent de la variété ;
- les **économies d’échelle** : produire en grande série abaisse le coût unitaire, ce qui pousse chaque pays à se spécialiser sur un segment ;
- la **fragmentation de la chaîne de valeur** : les pièces d’un même produit traversent plusieurs frontières.

## Les avantages comparatifs se construisent
Ils ne sont pas donnés une fois pour toutes : la Corée du Sud n’avait aucun avantage comparatif dans l’électronique en 1960. La formation, la recherche et parfois le **protectionnisme éducateur** (List) les fabriquent.

> Dire qu’un pays « gagne à l’échange » ne dit rien de la répartition du gain **à l’intérieur** du pays : c’est tout l’objet de la fiche suivante.`,
          },
          questions: [
            ['Sur quoi repose l’avantage comparatif de Ricardo ?', ['Le coût d’opportunité : se spécialiser là où le désavantage est le plus faible', 'La productivité absolue la plus élevée', 'La dotation en capital', 'Le niveau des salaires'], 0, 'Même un pays moins productif en tout gagne à l’échange.'],
            ['Que dit le modèle HOS ?', ['La spécialisation dépend de la dotation relative en facteurs de production', 'Le commerce dépend des seuls coûts salariaux', 'Les pays doivent produire tous les biens', 'Le libre-échange nuit toujours aux pays pauvres'], 0, 'Heckscher-Ohlin-Samuelson : un pays exporte ce qui utilise intensément son facteur abondant.'],
            ['Qu’est-ce que le commerce intrabranche ?', ['L’échange de produits d’une même branche entre pays', 'L’échange entre entreprises d’un même pays', 'L’échange de matières premières contre des produits finis', 'Le commerce à l’intérieur d’une entreprise'], 0, 'Des voitures contre des voitures : c’est l’essentiel du commerce entre pays développés.'],
            ['Quelle explication rend compte du commerce intrabranche ?', ['La différenciation des produits et les économies d’échelle', 'L’avantage absolu de Smith', 'La dotation en ressources naturelles', 'Le protectionnisme'], 0, 'S’y ajoute la fragmentation de la chaîne de valeur.'],
            ['Les avantages comparatifs d’un pays sont donnés une fois pour toutes.', ['Vrai', 'Faux'], 1, 'Ils se construisent : la Corée du Sud n’en avait aucun dans l’électronique en 1960.'],
            ['Qu’appelle-t-on protectionnisme éducateur ?', ['Une protection temporaire d’une industrie naissante, défendue par List', 'Une taxe sur les produits éducatifs', 'Une interdiction totale des importations', 'Un quota d’importation permanent'], 0, 'Elle vise à laisser une industrie atteindre sa taille critique avant l’ouverture.'],
            ['Les économies d’échelle abaissent le coût unitaire quand la production augmente.', ['Vrai', 'Faux'], 0, 'C’est ce qui pousse chaque pays à se spécialiser sur un segment de la branche.'],
            ['Le raisonnement de Smith sur l’avantage absolu échoue quand…', ['Un pays est plus productif que l’autre dans toutes les productions', 'Les deux pays ont la même productivité', 'Les coûts de transport sont nuls', 'Les produits sont différenciés'], 0, 'C’est exactement le cas que Ricardo résout avec l’avantage comparatif.'],
          ],
        },
        {
          titre: 'Échanger : pourquoi, comment ?',
          axe: 'Quels sont les fondements du commerce international et de l’internationalisation de la production ?',
          lecon: {
            titre: 'Les gagnants, les perdants, et ce que fait l’État',
            cours: `Le libre-échange augmente la richesse totale disponible. Il ne dit rien de sa répartition — et c’est de là que viennent tous les débats.

## Les gains de l’échange
- pour le **consommateur** : des prix plus bas (mise en concurrence des producteurs) et une **variété** plus grande ;
- pour le **producteur** : un marché élargi, donc des économies d’échelle et un accès à des intrants moins chers ;
- pour l’**économie** : une pression concurrentielle qui pousse à l’innovation et à la productivité.

## Les perdants
La spécialisation détruit les emplois des secteurs exposés qui ne résistent pas. Ces pertes sont **concentrées** (une usine, un bassin d’emploi, une qualification) alors que les gains sont **diffus** (quelques euros par consommateur). Cette asymétrie explique la force politique du protectionnisme : les perdants savent qui ils sont, les gagnants l’ignorent.

Le modèle HOS le prédit : dans un pays développé, l’ouverture profite au travail qualifié et pèse sur le travail peu qualifié.

## Le rôle de l’État
Deux réponses possibles :
- **accompagner** : formation, indemnisation, mobilité, politique industrielle — c’est la « flexicurité » à la danoise ;
- **protéger** : droits de douane, quotas, normes, subventions. Le protectionnisme préserve à court terme, mais renchérit les intrants, invite aux représailles et retarde l’adaptation.

## Les instruments du protectionnisme
- **tarifaires** : droits de douane ;
- **non tarifaires** : quotas, normes sanitaires ou techniques, subventions, marchés publics réservés. Ce sont aujourd’hui les plus utilisés, car les tarifs sont encadrés par l’OMC.

## La régulation multilatérale
Le **GATT** (1947) puis l’**OMC** (1995) organisent la baisse des barrières et arbitrent les conflits (organe de règlement des différends). Depuis les années 2010, le multilatéralisme s’essouffle au profit d’**accords régionaux** (UE, ALENA/ACEUM, Mercosur) et d’un retour des mesures unilatérales.

> Un pays peut gagner à l’échange ET compter des perdants nombreux. Les deux propositions sont vraies ensemble : c’est ce que dissertations et épreuves composées attendent qu’on tienne des deux mains.`,
          },
          questions: [
            ['Pourquoi le protectionnisme est-il politiquement puissant ?', ['Les pertes sont concentrées et visibles, les gains diffus et invisibles', 'Parce qu’il enrichit toujours le pays', 'Parce que l’OMC l’encourage', 'Parce que les consommateurs le réclament'], 0, 'Les perdants savent qui ils sont, les gagnants l’ignorent.'],
            ['Quel est le principal gain du libre-échange pour le consommateur ?', ['Des prix plus bas et une plus grande variété de produits', 'Un emploi mieux protégé', 'Un salaire plus élevé', 'Une monnaie plus forte'], 0, 'La mise en concurrence des producteurs fait baisser les prix.'],
            ['Qu’est-ce qu’une barrière non tarifaire ?', ['Un quota, une norme technique ou une subvention', 'Un droit de douane', 'Un taux de change fixe', 'Une taxe sur les exportations'], 0, 'Ce sont les plus utilisées aujourd’hui, les tarifs étant encadrés par l’OMC.'],
            ['Selon le modèle HOS, l’ouverture d’un pays développé pèse sur…', ['Le travail peu qualifié', 'Le travail qualifié', 'Le capital', 'Les revenus fonciers'], 0, 'C’est le facteur relativement rare dans un pays développé.'],
            ['L’OMC a succédé au GATT en 1995.', ['Vrai', 'Faux'], 0, 'Elle y ajoute un organe de règlement des différends.'],
            ['En quoi consiste la « flexicurité » ?', ['Accompagner les transitions par la formation et l’indemnisation plutôt que protéger les emplois', 'Interdire les licenciements', 'Fixer les prix des importations', 'Subventionner les exportations'], 0, 'C’est le modèle danois, une alternative au protectionnisme.'],
            ['Le protectionnisme n’a que des effets positifs pour le pays qui l’applique.', ['Vrai', 'Faux'], 1, 'Il renchérit les intrants, invite aux représailles et retarde l’adaptation.'],
            ['Depuis les années 2010, le commerce mondial est marqué par…', ['Un essoufflement du multilatéralisme au profit d’accords régionaux', 'La disparition de l’OMC', 'La fin des barrières non tarifaires', 'Un libre-échange total'], 0, 'S’y ajoute un retour des mesures unilatérales.'],
          ],
        },
        {
          titre: 'Entreprises et internationalisation de la production',
          axe: 'Quels sont les fondements du commerce international et de l’internationalisation de la production ?',
          lecon: {
            titre: 'Quand un seul produit traverse dix frontières',
            cours: `Ce ne sont plus des pays qui échangent des produits finis, mais des **firmes multinationales** qui découpent leur production entre plusieurs pays. Environ un tiers du commerce mondial est du commerce **intra-firme**.

## La firme multinationale
Une **FMN** est une entreprise qui possède au moins une unité de production hors de son pays d’origine. Elle réalise des **investissements directs à l’étranger (IDE)** : prise de contrôle durable d’une entreprise étrangère, ou création d’une filiale.

## Pourquoi s’internationaliser
Deux logiques, souvent confondues :
- **conquérir un marché** : produire près du consommateur, contourner des barrières douanières, s’adapter aux goûts locaux. C’est le motif majoritaire des IDE ;
- **réduire les coûts** : profiter d’un coût du travail plus bas, d’une fiscalité plus douce ou d’une réglementation plus souple. C’est la **délocalisation** au sens strict.

S’y ajoutent l’accès aux ressources naturelles et la proximité d’un pôle de compétences.

## La chaîne de valeur mondiale
La production d’un bien se **fragmente** en tâches réparties selon l’avantage comparatif de chaque territoire : conception ici, composants là, assemblage ailleurs, service après-vente encore ailleurs. La valeur ajoutée se concentre aux deux extrémités — conception et commercialisation — et non dans l’assemblage : c’est la **courbe du sourire**.

Conséquence statistique : les statistiques douanières, qui comptent la valeur **totale** du bien à chaque passage de frontière, surestiment le poids des pays assembleurs. D’où les mesures en **valeur ajoutée**.

## L’externalisation
Fragmenter ne suppose pas de posséder : la firme peut **externaliser** à un sous-traitant indépendant. Elle garde alors le contrôle par le contrat et la marque, sans porter l’investissement ni le risque social.

## Les effets pour les pays
- pour le pays d’accueil : emplois, transferts de technologie, mais aussi dépendance et concurrence fiscale ;
- pour le pays d’origine : maintien des fonctions à forte valeur ajoutée, mais destruction d’emplois industriels et affaiblissement des recettes fiscales — la localisation des profits dans les pays à faible imposition ayant conduit à l’accord OCDE sur un **taux minimal de 15 %**.

> La désindustrialisation d’un pays développé s’explique par les gains de productivité industrielle autant que par les délocalisations. Attribuer tout à ces dernières est l’erreur d’analyse la plus courante.`,
          },
          questions: [
            ['Qu’est-ce qu’un investissement direct à l’étranger (IDE) ?', ['Une prise de contrôle durable d’une entreprise étrangère ou la création d’une filiale', 'L’achat d’actions à but spéculatif', 'Une exportation de biens', 'Un prêt à un État étranger'], 0, 'Il se distingue de l’investissement de portefeuille par la durée et le contrôle.'],
            ['Quel est le motif majoritaire des IDE ?', ['Conquérir un marché', 'Réduire le coût du travail', 'Échapper à l’impôt', 'Accéder à des matières premières'], 0, 'La délocalisation au sens strict ne représente qu’une partie des IDE.'],
            ['Que décrit la « courbe du sourire » ?', ['La valeur ajoutée se concentre à la conception et à la commercialisation, pas à l’assemblage', 'La hausse des profits avec la taille de la firme', 'La relation entre salaire et productivité', 'L’évolution du commerce mondial'], 0, 'D’où l’intérêt, pour un pays, de tenir les deux extrémités de la chaîne.'],
            ['Environ un tiers du commerce mondial est du commerce intra-firme.', ['Vrai', 'Faux'], 0, 'Il s’agit d’échanges entre unités d’une même multinationale.'],
            ['Pourquoi les statistiques douanières surestiment-elles le poids des pays assembleurs ?', ['Elles comptent la valeur totale du bien à chaque passage de frontière', 'Elles excluent les services', 'Elles sont calculées en monnaie locale', 'Elles ignorent les réexportations'], 0, 'D’où les mesures alternatives du commerce en valeur ajoutée.'],
            ['Externaliser suppose de posséder l’unité de production.', ['Vrai', 'Faux'], 1, 'La firme garde le contrôle par le contrat et la marque, sans porter l’investissement.'],
            ['Quel accord international vise la concurrence fiscale entre pays d’accueil ?', ['L’accord OCDE sur un taux minimal d’imposition de 15 %', 'Les accords de Bretton Woods', 'Le protocole de Kyoto', 'Le traité de Maastricht'], 0, 'Il répond à la localisation des profits dans les pays à faible imposition.'],
            ['La désindustrialisation des pays développés s’explique uniquement par les délocalisations.', ['Vrai', 'Faux'], 1, 'Les gains de productivité industrielle y contribuent au moins autant.'],
          ],
        },
        // ---- Chapitre 3 : comment lutter contre le chômage -------------------
        {
          titre: 'Définir et mesurer le chômage',
          axe: 'Comment lutter contre le chômage ?',
          lecon: {
            titre: 'Deux chiffres, deux définitions, deux réalités',
            cours: `Le chômage est la première statistique commentée du débat public, et la plus mal comprise : deux organismes en publient deux mesures différentes, qui ne comptent pas la même chose.

## La définition du BIT
Est **chômeur** au sens du Bureau international du travail toute personne qui remplit **trois conditions simultanées** :
1. être **sans emploi** (pas une heure travaillée dans la semaine de référence) ;
2. être **disponible** pour travailler dans les deux semaines ;
3. avoir **recherché activement** un emploi dans le mois précédent (ou en avoir trouvé un qui commence sous trois mois).

C’est la définition mesurée par l’**INSEE**, à partir de l’**enquête Emploi**, qui interroge un échantillon de ménages. C’est la seule comparable au niveau international.

## Les inscrits à France Travail
L’autre chiffre, publié mensuellement, est le nombre d’**inscrits** (catégories A, B, C…). Il repose sur une démarche administrative, pas sur une enquête. Un chômeur BIT peut ne pas être inscrit ; un inscrit peut travailler à temps partiel (catégories B et C) ou ne pas rechercher activement.

## Population active et taux de chômage
La **population active** rassemble les actifs occupés et les chômeurs. Le **taux de chômage** rapporte les chômeurs à la population active — et non à la population totale :

taux de chômage = chômeurs / (actifs occupés + chômeurs)

Attention à ne pas le confondre avec le **taux d’emploi** (actifs occupés / population en âge de travailler), qui est souvent plus révélateur : deux pays peuvent afficher le même taux de chômage avec des taux d’emploi très différents.

## Le halo autour du chômage
Certaines personnes souhaitent travailler sans remplir les trois critères : elles ne recherchent pas activement (découragement), ou ne sont pas immédiatement disponibles. Elles forment le **halo autour du chômage** — plus de deux millions de personnes en France, invisibles dans le taux officiel.

## Le sous-emploi
Les personnes à **temps partiel subi** ou en chômage technique sont comptées comme actives occupées, alors même qu’elles souhaitent travailler davantage. Ce **sous-emploi** est une autre face du même problème.

> Le taux de chômage peut baisser parce que des chômeurs retrouvent un emploi — ou parce qu’ils se découragent et sortent de la population active. Regarder le taux d’emploi en même temps est le seul moyen de trancher.`,
          },
          questions: [
            ['Quelles sont les trois conditions du chômage au sens du BIT ?', ['Être sans emploi, disponible et en recherche active', 'Être inscrit à France Travail, indemnisé et disponible', 'Être sans emploi depuis plus de trois mois', 'Avoir moins de 25 ans et être sans diplôme'], 0, 'Les trois doivent être remplies simultanément.'],
            ['À quoi rapporte-t-on le nombre de chômeurs pour calculer le taux de chômage ?', ['À la population active', 'À la population totale', 'À la population en âge de travailler', 'Aux actifs occupés seulement'], 0, 'Population active = actifs occupés + chômeurs.'],
            ['Qu’est-ce que le halo autour du chômage ?', ['Les personnes qui souhaitent travailler sans remplir les trois critères du BIT', 'Les chômeurs de longue durée', 'Les chômeurs indemnisés', 'Les personnes en formation'], 0, 'Plus de deux millions de personnes en France, invisibles dans le taux officiel.'],
            ['Un inscrit à France Travail est nécessairement un chômeur au sens du BIT.', ['Vrai', 'Faux'], 1, 'Les catégories B et C travaillent à temps partiel ; certains ne recherchent pas activement.'],
            ['Qu’est-ce que le taux d’emploi ?', ['La part des actifs occupés dans la population en âge de travailler', 'La part des chômeurs dans la population active', 'Le nombre d’emplois créés dans l’année', 'La part des CDI dans l’emploi total'], 0, 'Deux pays peuvent avoir le même taux de chômage et des taux d’emploi très différents.'],
            ['Une personne en temps partiel subi est comptée comme chômeuse.', ['Vrai', 'Faux'], 1, 'Elle est active occupée, mais en situation de sous-emploi.'],
            ['Quelle enquête permet à l’INSEE de mesurer le chômage au sens du BIT ?', ['L’enquête Emploi, menée auprès d’un échantillon de ménages', 'Le recensement décennal', 'Les fichiers de France Travail', 'La déclaration sociale nominative'], 0, 'C’est la seule mesure comparable au niveau international.'],
            ['Une baisse du taux de chômage peut traduire un découragement des chômeurs.', ['Vrai', 'Faux'], 0, 'Ils sortent alors de la population active : seul le taux d’emploi permet de trancher.'],
          ],
        },
        {
          titre: 'Comment expliquer le chômage ?',
          axe: 'Comment lutter contre le chômage ?',
          lecon: {
            titre: 'Trop cher, trop rigide, ou pas assez de demande ?',
            cours: `Le programme distingue deux grandes familles d’explications. Elles ne se contredisent pas : elles désignent des chômages différents, qui coexistent.

## Le chômage par insuffisance de la demande
D’inspiration **keynésienne** : quand la demande anticipée par les entreprises est faible, elles produisent moins et embauchent moins, quel que soit le niveau des salaires. Le chômage est alors **conjoncturel** et **involontaire** — les chômeurs accepteraient le salaire en vigueur, mais aucun poste n’est ouvert.

Le mécanisme s’auto-entretient : moins d’emploi → moins de revenu → moins de consommation → moins de demande. C’est le cercle vicieux que la relance budgétaire vise à briser.

## Les explications par le fonctionnement du marché du travail
D’inspiration **néoclassique** : le chômage vient d’un salaire réel maintenu **au-dessus** du salaire d’équilibre.
- le **salaire minimum** peut exclure les travailleurs dont la productivité lui est inférieure ;
- les **cotisations sociales** creusent l’écart entre le coût du travail pour l’employeur et le salaire net perçu — c’est le **coin fiscalo-social** ;
- les **institutions** (protection de l’emploi, négociation collective, indemnisation) réduisent la flexibilité.

## Les asymétries d’information
Deux théories nuancent la vision d’un marché transparent :
- le **salaire d’efficience** : l’employeur paie **volontairement** au-dessus du marché pour attirer, fidéliser et motiver. Le chômage devient alors durable sans être imputable à une rigidité imposée ;
- la théorie **insiders/outsiders** : les salariés en place négocient pour eux-mêmes, au détriment des candidats extérieurs.

## Le chômage structurel
Il subsiste même en haut de cycle. Trois sources :
- l’**inadéquation** entre les qualifications offertes et demandées (*mismatch*) ;
- la **friction** : le temps de la recherche et de l’appariement, incompressible ;
- l’**inadéquation géographique** entre bassins d’emploi et lieux de résidence.

## L’hystérésis
Un chômage conjoncturel long finit par devenir structurel : les compétences se dégradent, le réseau se distend, l’employeur lit la durée d’inactivité comme un signal négatif. C’est l’**hystérésis**, argument central en faveur d’une réaction rapide aux récessions.

> Le débat n’est pas « qui a raison » mais « quelle part de quoi » : une politique de demande est sans effet sur un chômage d’inadéquation, et une politique d’offre sans effet sur un chômage de récession.`,
          },
          questions: [
            ['Le chômage keynésien est un chômage…', ['Par insuffisance de la demande anticipée', 'Par excès de salaire réel', 'Par inadéquation des qualifications', 'Volontaire'], 0, 'Il est involontaire : les chômeurs accepteraient le salaire en vigueur.'],
            ['Qu’est-ce que le coin fiscalo-social ?', ['L’écart entre le coût du travail pour l’employeur et le salaire net perçu', 'La part de l’impôt dans le PIB', 'Le taux du salaire minimum', 'La différence entre salaire brut et salaire médian'], 0, 'Il est constitué des cotisations sociales et des prélèvements sur le travail.'],
            ['Que dit la théorie du salaire d’efficience ?', ['L’employeur paie volontairement au-dessus du marché pour attirer et motiver', 'Le salaire minimum doit être supprimé', 'Les salaires doivent suivre l’inflation', 'Le salaire est fixé par l’État'], 0, 'Le chômage devient durable sans rigidité imposée de l’extérieur.'],
            ['Qu’est-ce que le chômage frictionnel ?', ['Le chômage lié au temps de recherche et d’appariement', 'Le chômage dû à une récession', 'Le chômage volontaire', 'Le chômage des jeunes'], 0, 'Il est incompressible : il existe même en plein emploi.'],
            ['Qu’appelle-t-on hystérésis du chômage ?', ['Un chômage conjoncturel prolongé qui devient structurel', 'Une baisse rapide du chômage', 'La saisonnalité de l’emploi', 'Le chômage partiel'], 0, 'Compétences dégradées, réseau distendu, signal négatif envoyé aux employeurs.'],
            ['La théorie insiders/outsiders explique que les salariés en place négocient à leur seul avantage.', ['Vrai', 'Faux'], 0, 'Les candidats extérieurs ne participent pas à la négociation salariale.'],
            ['Une politique de relance de la demande résout un chômage d’inadéquation des qualifications.', ['Vrai', 'Faux'], 1, 'Elle est sans effet sur ce type de chômage, qui appelle de la formation.'],
            ['Le chômage structurel disparaît en haut de cycle économique.', ['Vrai', 'Faux'], 1, 'C’est justement ce qui le définit : il subsiste même en période favorable.'],
          ],
        },
        {
          titre: 'Les politiques de lutte contre le chômage',
          axe: 'Comment lutter contre le chômage ?',
          lecon: {
            titre: 'Chaque diagnostic appelle son remède',
            cours: `Puisque les causes du chômage sont plurielles, les politiques le sont aussi. Le programme en distingue quatre familles, dont l’efficacité dépend du type de chômage visé.

## Les politiques de soutien à la demande
D’inspiration keynésienne : relance **budgétaire** (dépense publique, baisse d’impôts) ou **monétaire** (baisse des taux directeurs) pour soutenir la demande anticipée et donc l’embauche.

Limites : le **déficit** et la dette publique, les **fuites** vers les importations dans une économie ouverte, et le délai de mise en œuvre. Efficace contre le chômage conjoncturel, sans effet sur le structurel.

## Les politiques de baisse du coût du travail
**Allègements de cotisations** ciblés sur les bas salaires, où l’élasticité de l’emploi au coût du travail est la plus forte. Le raisonnement : rapprocher le coût du travail de la productivité des moins qualifiés.

Limites : coût budgétaire élevé, **effets d’aubaine** (l’entreprise aurait embauché de toute façon), et **trappe à bas salaires** — les allègements dégressifs renchérissent brutalement toute augmentation.

## Les politiques de formation
Elles s’attaquent au chômage **structurel** d’inadéquation : formation initiale, formation continue, apprentissage, validation des acquis. Ce sont les politiques dont les évaluations montrent les effets les plus durables — mais les plus lents.

## La flexibilisation du marché du travail
Assouplir les règles d’embauche et de licenciement, faciliter les ruptures conventionnelles, décentraliser la négociation. L’effet sur le **niveau** de l’emploi est discuté ; l’effet sur sa **rotation** est établi. Le modèle de **flexicurité** danois y adjoint une indemnisation généreuse et un accompagnement intensif : la sécurité porte sur la personne, pas sur le poste.

## Politiques actives et passives
- **passives** : indemniser (assurance chômage, préretraites) ;
- **actives** : agir sur l’emploi lui-même (formation, accompagnement, emplois aidés, aides à la mobilité).

L’enjeu de l’indemnisation est un arbitrage : trop faible, elle appauvrit et pousse à accepter un emploi mal apparié ; trop généreuse ou trop longue, elle peut allonger la durée de recherche. Les évaluations montrent surtout qu’un **accompagnement intensif** raccourcit le retour à l’emploi.

> Aucune de ces politiques n’est bonne « en soi ». La question d’examen est toujours : quel chômage ce pays connaît-il, et cette politique s’y attaque-t-elle ?`,
          },
          questions: [
            ['Quelle politique vise le chômage conjoncturel ?', ['La relance budgétaire ou monétaire', 'La formation professionnelle', 'La flexibilisation du licenciement', 'Les allègements de cotisations'], 0, 'Elle soutient la demande anticipée, donc l’embauche.'],
            ['Pourquoi les allègements de cotisations ciblent-ils les bas salaires ?', ['L’élasticité de l’emploi au coût du travail y est la plus forte', 'Parce que ces salariés sont les plus nombreux', 'Parce que la loi l’impose', 'Pour augmenter le salaire net'], 0, 'On rapproche le coût du travail de la productivité des moins qualifiés.'],
            ['Qu’est-ce qu’un effet d’aubaine ?', ['Une aide versée pour une embauche qui aurait eu lieu de toute façon', 'Un gain imprévu de productivité', 'Une hausse soudaine de la demande', 'Un emploi créé par hasard'], 0, 'C’est la principale limite des dispositifs d’aide à l’embauche.'],
            ['Qu’appelle-t-on trappe à bas salaires ?', ['Le renchérissement brutal du coût du travail quand le salaire dépasse le seuil des allègements', 'Un salaire inférieur au SMIC', 'Un emploi à temps partiel', 'Une zone d’emploi sinistrée'], 0, 'Les allègements dégressifs découragent les augmentations.'],
            ['Les politiques actives de l’emploi consistent à indemniser les chômeurs.', ['Vrai', 'Faux'], 1, 'C’est la définition des politiques passives ; les actives agissent sur l’emploi lui-même.'],
            ['En quoi consiste la flexicurité danoise ?', ['Une flexibilité de l’emploi assortie d’une indemnisation et d’un accompagnement forts', 'Une interdiction des licenciements', 'Un salaire minimum élevé', 'Un temps de travail réduit'], 0, 'La sécurité porte sur la personne, pas sur le poste.'],
            ['Quelle politique s’attaque au chômage d’inadéquation ?', ['La formation', 'La relance budgétaire', 'La baisse des taux directeurs', 'La dévaluation'], 0, 'Ses effets sont les plus durables, mais aussi les plus lents.'],
            ['Dans une économie ouverte, une relance budgétaire peut se traduire par des importations.', ['Vrai', 'Faux'], 0, 'Ces « fuites » réduisent l’effet multiplicateur de la relance.'],
          ],
        },
        // ---- Chapitre 4 : crises financières et régulation ------------------
        {
          titre: 'Les caractéristiques de la crise financière des années 1930 et de celle de 2008',
          axe: 'Comment expliquer les crises financières et réguler le système financier ?',
          lecon: {
            titre: 'Deux krachs, un même enchaînement',
            cours: `Comparer 1929 et 2008 n’est pas un exercice d’histoire : les deux crises suivent le même scénario, et c’est ce qui en fait un modèle.

## Le scénario commun
1. une **phase d’euphorie** : le crédit est abondant, les prix d’actifs montent, chacun anticipe qu’ils monteront encore ;
2. un **retournement** : un événement révèle que les valorisations ne reposent sur rien ;
3. une **panique** : chacun vend en même temps, les prix s’effondrent ;
4. une **contagion** à l’économie réelle : le crédit se ferme, l’investissement et la consommation chutent, le chômage monte.

## 1929
La spéculation boursière est alimentée par l’achat **à crédit** de titres (*call loans*). Le krach d’octobre 1929 ruine les emprunteurs, puis les banques qui les ont financés. Des milliers de faillites bancaires détruisent l’épargne et le crédit. La **déflation** s’installe : les prix baissent, la valeur réelle des dettes augmente — c’est la **déflation par la dette** de Fisher. Le PIB américain recule d’environ 30 %, le chômage atteint 25 %.

L’erreur d’analyse de l’époque : l’orthodoxie budgétaire et monétaire, qui aggrave la contraction. Le tournant vient du **New Deal** et, en théorie, de Keynes.

## 2008
Le point de départ est le marché immobilier américain et les crédits **subprimes**, consentis à des ménages peu solvables. Ces créances sont **titrisées** : transformées en titres revendus sur les marchés mondiaux, ce qui disperse le risque sans le supprimer et le rend **illisible**. Les agences de notation les évaluent mal.

Le retournement des prix immobiliers en 2006-2007 déclenche la chaîne. La faillite de **Lehman Brothers** (septembre 2008) fait basculer la défiance en panique : les banques cessent de se prêter entre elles.

## Les différences décisives
Ce qui a évité une répétition de 1929 tient à la **réaction des autorités** :
- les banques centrales injectent massivement des liquidités et abaissent les taux à zéro ;
- les États sauvent les banques et laissent filer les déficits ;
- les **stabilisateurs automatiques** (indemnisation, protection sociale), inexistants en 1929, amortissent la chute des revenus.

Résultat : une récession sévère, mais pas une dépression de dix ans.

## Ce qui s’est répété
La crise s’est transmise à l’économie réelle et, en Europe, s’est prolongée en **crise des dettes souveraines** (2010-2012) — le sauvetage des banques ayant transféré la dette privée vers les États.

> Une crise financière n’est jamais seulement financière : ce qui la rend grave, c’est le canal du crédit par lequel elle atteint les entreprises et les ménages.`,
          },
          questions: [
            ['Qu’est-ce que la titrisation ?', ['La transformation de créances en titres revendus sur les marchés', 'L’émission d’actions par une entreprise', 'Le rachat de dette publique par la banque centrale', 'La cotation en bourse d’une société'], 0, 'Elle disperse le risque sans le supprimer, et le rend illisible.'],
            ['Qu’appelle-t-on déflation par la dette ?', ['La baisse des prix qui alourdit la valeur réelle des dettes', 'L’annulation des dettes publiques', 'Une inflation supérieure aux taux d’intérêt', 'La dévaluation d’une monnaie'], 0, 'Mécanisme décrit par Irving Fisher à propos de la crise de 1929.'],
            ['Quel événement de septembre 2008 a fait basculer la défiance en panique ?', ['La faillite de Lehman Brothers', 'Le krach de Wall Street', 'La faillite de la Grèce', 'La chute de l’euro'], 0, 'Les banques ont alors cessé de se prêter entre elles.'],
            ['Les crédits subprimes étaient consentis à des ménages très solvables.', ['Vrai', 'Faux'], 1, 'Ils visaient au contraire des emprunteurs peu solvables, gagés sur la hausse de l’immobilier.'],
            ['Qu’est-ce qui a évité en 2008 une dépression comparable à celle de 1929 ?', ['L’intervention massive des banques centrales, des États et des stabilisateurs automatiques', 'La disparition des banques', 'L’absence de contagion internationale', 'La faiblesse du crédit'], 0, 'Les stabilisateurs automatiques n’existaient pas en 1929.'],
            ['La crise de 2008 s’est prolongée en Europe par une crise des dettes souveraines.', ['Vrai', 'Faux'], 0, 'Le sauvetage des banques a transféré la dette privée vers les États.'],
            ['Quelle est la première phase du scénario type d’une crise financière ?', ['Une phase d’euphorie, alimentée par le crédit et la hausse des prix d’actifs', 'La panique', 'La contagion à l’économie réelle', 'La régulation'], 0, 'Puis viennent le retournement, la panique et la contagion.'],
            ['Quelle a été l’erreur de politique économique après 1929 ?', ['L’orthodoxie budgétaire et monétaire, qui a aggravé la contraction', 'Une relance trop massive', 'Une baisse des taux trop rapide', 'La nationalisation des banques'], 0, 'Le tournant vient du New Deal et, en théorie, de Keynes.'],
          ],
        },
        {
          titre: 'Bulles spéculatives et faillites bancaires',
          axe: 'Comment expliquer les crises financières et réguler le système financier ?',
          lecon: {
            titre: 'Pourquoi il est rationnel de suivre la foule',
            cours: `Une bulle n’est pas une folie collective : elle naît de comportements individuellement rationnels qui, mis bout à bout, produisent un résultat absurde.

## La bulle spéculative
Une **bulle** est un écart durable et croissant entre le prix d’un actif et sa **valeur fondamentale** (la somme actualisée des revenus qu’il rapportera). On l’achète non pour ce qu’il rapporte, mais pour le revendre plus cher.

## Les comportements mimétiques
Keynes le résume par le **concours de beauté** : sur un marché, il ne s’agit pas de choisir le plus beau visage, mais celui que **les autres** choisiront. L’anticipation porte sur l’opinion moyenne, pas sur les fondamentaux.

Les **prophéties auto-réalisatrices** en découlent : si tous croient que le prix montera, tous achètent — et le prix monte. Les fondamentaux deviennent secondaires.

## Les asymétries d’information
- **aléa moral** : une banque qui se sait « trop grosse pour faire faillite » prend davantage de risques, car elle sait qu’elle sera secourue. Le trader dont la rémunération dépend du gain sans symétrie sur la perte fait le même calcul ;
- **sélection adverse** : quand le prêteur ne distingue pas les bons des mauvais emprunteurs, il augmente le taux, ce qui décourage les bons et attire les mauvais.

## Le canal bancaire
La faillite d’une banque a trois canaux de propagation :
- le **retrait de panique** (*bank run*) : la banque est solvable à long terme mais illiquide à court terme, car elle a transformé des dépôts courts en crédits longs ;
- le **risque de contrepartie** : les banques se prêtent entre elles et se détiennent mutuellement ;
- le **canal du crédit** : une banque fragilisée réduit ses prêts, ce qui atteint les entreprises.

## L’effet de levier
Emprunter pour investir **amplifie** les gains… et les pertes. Un investisseur qui apporte 10 et emprunte 90 est ruiné par une baisse de 10 % du prix de l’actif. C’est le mécanisme qui transforme un retournement modéré en effondrement.

## Le paradoxe de la tranquillité
Hyman Minsky l’a formulé : plus une période de stabilité dure, plus les agents jugent le risque faible, plus ils s’endettent — et plus le système devient fragile. **La stabilité engendre l’instabilité.**

> Une bulle ne se repère avec certitude qu’après avoir éclaté. C’est ce qui rend la régulation *ex ante* si difficile, et la régulation *ex post* si coûteuse.`,
          },
          questions: [
            ['Qu’est-ce qu’une bulle spéculative ?', ['Un écart durable entre le prix d’un actif et sa valeur fondamentale', 'Une hausse des prix à la consommation', 'Un excès d’épargne', 'Une baisse brutale des taux d’intérêt'], 0, 'L’actif est acheté pour être revendu plus cher, non pour ce qu’il rapporte.'],
            ['Que décrit la métaphore keynésienne du concours de beauté ?', ['Sur un marché, on anticipe le choix des autres et non la valeur réelle', 'Les entreprises se concurrencent par la publicité', 'Les actifs les plus rentables attirent les investisseurs', 'La bourse récompense les meilleures entreprises'], 0, 'L’anticipation porte sur l’opinion moyenne, pas sur les fondamentaux.'],
            ['Qu’est-ce que l’aléa moral, appliqué aux banques ?', ['Une banque qui se sait secourue prend davantage de risques', 'Une banque qui ment sur ses comptes', 'Un emprunteur qui ne rembourse pas', 'Une fraude d’un trader isolé'], 0, 'C’est le problème du « too big to fail ».'],
            ['Un bank run peut faire tomber une banque solvable.', ['Vrai', 'Faux'], 0, 'Elle est illiquide à court terme, ayant transformé des dépôts courts en crédits longs.'],
            ['Quel est l’effet du levier d’endettement ?', ['Il amplifie les gains comme les pertes', 'Il réduit le risque de l’investisseur', 'Il garantit un rendement fixe', 'Il supprime le risque de contrepartie'], 0, 'Apporter 10 et emprunter 90, c’est être ruiné par une baisse de 10 %.'],
            ['Que dit le paradoxe de la tranquillité de Minsky ?', ['Plus la stabilité dure, plus les agents s’endettent et plus le système devient fragile', 'Les crises sont imprévisibles par nature', 'La régulation supprime les bulles', 'L’instabilité est toujours d’origine extérieure'], 0, 'La stabilité engendre l’instabilité.'],
            ['Qu’est-ce que la sélection adverse sur le marché du crédit ?', ['La hausse du taux décourage les bons emprunteurs et attire les mauvais', 'Les banques refusent les petits prêts', 'Les emprunteurs choisissent la banque la moins chère', 'Les prêteurs privilégient les entreprises cotées'], 0, 'Elle découle de l’asymétrie d’information avant la signature du contrat.'],
            ['Une bulle est facile à identifier avant qu’elle n’éclate.', ['Vrai', 'Faux'], 1, 'C’est ce qui rend la régulation préventive si difficile.'],
          ],
        },
        {
          titre: 'Les instruments de régulation monétaire',
          axe: 'Comment expliquer les crises financières et réguler le système financier ?',
          lecon: {
            titre: 'Ce que la banque centrale peut, et ce qu’elle ne peut pas',
            cours: `Réguler le système financier suppose deux jeux d’outils : ceux de la **politique monétaire**, qui agissent sur la conjoncture, et ceux de la **supervision**, qui agissent sur la solidité des banques.

## Les objectifs de la banque centrale
La **BCE** a pour objectif principal la **stabilité des prix**, définie comme une inflation de 2 % à moyen terme. Elle soutient les politiques économiques générales de l’Union **sans préjudice** de cet objectif. La Réserve fédérale américaine, elle, poursuit un **double mandat** : prix stables ET plein emploi.

## Les instruments conventionnels
- les **taux directeurs** : le taux auquel la banque centrale prête aux banques commerciales. Les baisser rend le crédit moins cher, ce qui stimule l’investissement, la consommation et l’inflation ; les monter fait l’inverse ;
- les **réserves obligatoires** : la part des dépôts que les banques doivent conserver ;
- les **opérations d’open market** : achats et ventes de titres pour piloter la liquidité au jour le jour.

## Les instruments non conventionnels
Quand les taux atteignent zéro, la marge disparaît. La BCE a alors employé :
- l’**assouplissement quantitatif** (*quantitative easing*) : achat massif de titres, y compris de dette publique, pour faire baisser les taux longs ;
- le ***forward guidance*** : annoncer à l’avance la trajectoire des taux, pour ancrer les anticipations ;
- les **prêts de long terme aux banques** à taux très bas, sous condition de prêter à l’économie.

## Le prêteur en dernier ressort
En cas de panique, la banque centrale prête sans limite aux banques solvables : c’est ce qui casse la mécanique du *bank run*. La règle de Bagehot précise : prêter largement, à un taux de pénalité, contre de bonnes garanties.

## La supervision prudentielle
Les accords de **Bâle** (I, II, III) imposent aux banques :
- des **ratios de fonds propres** — un capital minimal rapporté aux risques pris, pour absorber les pertes ;
- des **ratios de liquidité**, pour tenir un mois de retraits ;
- un **coussin contracyclique**, à constituer en haut de cycle.

S’y ajoutent en Europe l’**union bancaire** (supervision unique par la BCE, mécanisme de résolution) et la garantie des dépôts jusqu’à 100 000 euros par déposant et par banque, qui décourage les retraits de panique.

## Les limites
La politique monétaire n’a aucune prise sur un chômage structurel, elle alimente les prix d’actifs plus vite que les prix à la consommation, et la régulation pousse une part de l’activité vers le ***shadow banking***, moins supervisé.

> L’inflation de 2021-2023 a rappelé un arbitrage brutal : remonter les taux pour casser l’inflation, c’est accepter de freiner l’activité et de fragiliser les emprunteurs.`,
          },
          questions: [
            ['Quel est l’objectif principal de la BCE ?', ['La stabilité des prix, soit 2 % d’inflation à moyen terme', 'Le plein emploi', 'La croissance du PIB', 'L’équilibre budgétaire des États'], 0, 'La Fed, elle, poursuit un double mandat : prix stables et plein emploi.'],
            ['Quel est l’effet d’une baisse des taux directeurs ?', ['Un crédit moins cher, donc plus d’investissement et de consommation', 'Une baisse de l’inflation immédiate', 'Une hausse de l’épargne', 'Une réduction de la dette publique'], 0, 'C’est l’instrument conventionnel principal de la politique monétaire.'],
            ['Qu’est-ce que l’assouplissement quantitatif ?', ['L’achat massif de titres par la banque centrale pour faire baisser les taux longs', 'Une baisse des réserves obligatoires', 'Une annulation de la dette publique', 'Un prêt direct aux ménages'], 0, 'Instrument non conventionnel, employé quand les taux directeurs atteignent zéro.'],
            ['Que signifie « prêteur en dernier ressort » ?', ['La banque centrale prête sans limite aux banques solvables en cas de panique', 'L’État garantit tous les prêts bancaires', 'Les banques se prêtent entre elles', 'Le FMI prête aux États en difficulté'], 0, 'C’est ce qui casse la mécanique du retrait de panique.'],
            ['Que sont les accords de Bâle ?', ['Des règles prudentielles imposant aux banques des ratios de fonds propres et de liquidité', 'Des accords commerciaux', 'Un traité sur les taux de change', 'Un accord climatique'], 0, 'S’y ajoute un coussin contracyclique à constituer en haut de cycle.'],
            ['En Europe, les dépôts sont garantis jusqu’à 100 000 euros par déposant et par banque.', ['Vrai', 'Faux'], 0, 'Cette garantie décourage les retraits de panique.'],
            ['Qu’est-ce que le shadow banking ?', ['Des activités de financement hors du secteur bancaire supervisé', 'Le blanchiment d’argent', 'Les crédits accordés aux États', 'Les prêts entre particuliers'], 0, 'C’est une limite connue de la régulation prudentielle.'],
            ['La politique monétaire peut résoudre un chômage structurel.', ['Vrai', 'Faux'], 1, 'Elle agit sur la conjoncture, pas sur l’inadéquation des qualifications.'],
          ],
        },
        // ---- Chapitre 5 : politiques économiques européennes -----------------
        {
          titre: 'Le processus d’intégration européenne',
          axe: 'Quelles politiques économiques dans le cadre européen ?',
          lecon: {
            titre: 'Du marché commun à la monnaie unique',
            cours: `L’intégration européenne s’est faite par étapes, chacune ajoutant une contrainte nouvelle aux politiques économiques nationales.

## Les degrés d’intégration
La typologie de Balassa distingue cinq degrés :
1. la **zone de libre-échange** : suppression des droits de douane entre membres ;
2. l’**union douanière** : s’y ajoute un tarif extérieur commun ;
3. le **marché commun** : libre circulation des biens, services, capitaux et personnes — les « quatre libertés » ;
4. l’**union économique** : harmonisation des politiques économiques ;
5. l’**union monétaire** : une monnaie unique et une banque centrale commune.

L’Union européenne les a franchis dans cet ordre : CEE (1957), union douanière (1968), Acte unique et marché unique (1986-1993), Maastricht (1992), euro (1999-2002).

## Ce que le marché unique apporte
Concurrence accrue, économies d’échelle, baisse des prix, mobilité des travailleurs, attractivité pour les investissements. Il s’accompagne d’une **politique de la concurrence** puissante — la Commission peut interdire une fusion ou sanctionner un abus de position dominante — et d’une **politique de cohésion** qui redistribue vers les régions les moins riches.

## Ce que l’euro apporte
- suppression du **risque de change** et des coûts de conversion à l’intérieur de la zone ;
- transparence des prix, donc concurrence renforcée ;
- taux d’intérêt bas et monnaie internationale.

## Ce que l’euro coûte
Chaque État membre **abandonne** deux instruments :
- la **politique monétaire**, transférée à la BCE — un seul taux directeur pour des conjonctures nationales différentes ;
- la **dévaluation**, qui permettait de restaurer une compétitivité perdue.

Il ne lui reste que la politique budgétaire, elle-même encadrée par le **pacte de stabilité et de croissance** (déficit sous 3 % du PIB, dette sous 60 %).

## La théorie des zones monétaires optimales
Mundell énonce les conditions pour qu’une union monétaire fonctionne : **mobilité du travail**, **flexibilité des prix et des salaires**, **budget commun** capable d’amortir les chocs asymétriques, et cycles économiques synchronisés. La zone euro ne les remplit qu’imparfaitement : la mobilité y est faible (langues, diplômes, logement) et le budget commun minuscule (environ 1 % du PIB de l’Union).

## Un chantier inachevé
La crise de 2010-2012 a conduit à créer le **Mécanisme européen de stabilité**, l’**union bancaire**, et, en 2020, un emprunt commun de grande ampleur pour financer le plan de relance — première mutualisation budgétaire d’envergure.

> Une union monétaire sans union budgétaire est une construction asymétrique. Tout le débat européen depuis 2010 porte sur ce déséquilibre.`,
          },
          questions: [
            ['Quelles sont les « quatre libertés » du marché commun ?', ['Circulation des biens, services, capitaux et personnes', 'Liberté d’entreprendre, de commercer, d’exporter et d’importer', 'Liberté des prix, des salaires, du crédit et du change', 'Circulation des marchandises, des étudiants, des retraités et des salariés'], 0, 'Le marché commun est le troisième degré de la typologie de Balassa.'],
            ['Qu’ajoute une union douanière à une zone de libre-échange ?', ['Un tarif extérieur commun', 'Une monnaie unique', 'La libre circulation des personnes', 'Un budget commun'], 0, 'La zone de libre-échange se limite à la suppression des droits de douane internes.'],
            ['Quels instruments un État perd-il en entrant dans l’union monétaire ?', ['La politique monétaire et la dévaluation', 'La politique budgétaire et la fiscalité', 'La politique de l’emploi', 'La politique commerciale uniquement'], 0, 'Il ne lui reste que la politique budgétaire, elle-même encadrée.'],
            ['Que prévoit le pacte de stabilité et de croissance ?', ['Un déficit public sous 3 % du PIB et une dette sous 60 %', 'Un taux d’inflation de 2 %', 'Un salaire minimum européen', 'Un budget fédéral de 5 % du PIB'], 0, 'Il encadre le seul instrument budgétaire restant aux États.'],
            ['Selon Mundell, quelles conditions rendent une union monétaire viable ?', ['Mobilité du travail, flexibilité des prix, budget commun et cycles synchronisés', 'Une inflation nulle', 'Des dettes publiques identiques', 'Une langue commune'], 0, 'La zone euro ne les remplit qu’imparfaitement.'],
            ['Le budget de l’Union européenne représente environ 1 % du PIB de l’Union.', ['Vrai', 'Faux'], 0, 'C’est très peu pour amortir des chocs asymétriques entre États membres.'],
            ['Qu’a créé l’Union européenne en 2020 pour financer son plan de relance ?', ['Un emprunt commun de grande ampleur', 'Une taxe européenne sur le revenu', 'Une nouvelle monnaie', 'Un impôt sur les sociétés unifié'], 0, 'Première mutualisation budgétaire d’envergure de l’histoire de l’Union.'],
            ['La politique de la concurrence permet à la Commission d’interdire une fusion.', ['Vrai', 'Faux'], 0, 'Elle peut aussi sanctionner un abus de position dominante ou une aide d’État illégale.'],
          ],
        },
        {
          titre: 'La gestion de la politique économique européenne : une coordination difficile',
          axe: 'Quelles politiques économiques dans le cadre européen ?',
          lecon: {
            titre: 'Une monnaie, dix-neuf budgets',
            cours: `La zone euro combine une politique monétaire **unique** et des politiques budgétaires **nationales**. Cette asymétrie est la source de toutes ses difficultés de coordination.

## Le choc asymétrique
Un **choc asymétrique** frappe certains membres et pas d’autres, ou avec une intensité différente. Avec sa propre monnaie, un pays touché dévaluerait pour restaurer sa compétitivité. Dans l’union, il ne le peut plus : il lui reste la **dévaluation interne** — baisse des salaires et des prix —, longue, douloureuse et récessive.

Le taux directeur unique aggrave le problème : un taux adapté à la moyenne est trop élevé pour le pays en récession et trop bas pour celui en surchauffe.

## La coordination budgétaire
Le **pacte de stabilité et de croissance** encadre les déficits, mais il est critiqué des deux côtés :
- il est **procyclique** : il impose de réduire le déficit au moment où l’économie ralentit, ce qui aggrave le ralentissement ;
- il a été appliqué de façon **inégale** selon les États, ce qui a nui à sa crédibilité.

Il a été suspendu en 2020 face à la pandémie, puis réformé pour laisser plus de place aux trajectoires nationales et à l’investissement.

## Les externalités entre États
Une relance budgétaire dans un pays profite aux autres par les importations : c’est un **passager clandestin** possible — chacun a intérêt à ce que le voisin relance. Symétriquement, la modération salariale d’un pays améliore sa compétitivité **au détriment** de ses voisins : c’est une politique **non coopérative**.

La **concurrence fiscale** obéit à la même logique : chaque État baisse son taux d’impôt sur les sociétés pour attirer les bases fiscales, et tous perdent des recettes.

## Les instruments de la coordination
- le **semestre européen** : examen annuel des budgets nationaux avant leur vote ;
- les **recommandations** de la Commission, peu contraignantes ;
- les **fonds structurels** et, depuis 2020, le plan de relance européen, qui conditionne les versements à des réformes ;
- l’action de la BCE, qui a de fait assuré la stabilité de la zone (« whatever it takes », 2012).

## Le débat de fond
Deux lectures s’opposent :
- pour l’une, les difficultés viennent d’un **manque de discipline** de certains États ;
- pour l’autre, elles viennent d’un **défaut d’architecture** : pas de budget fédéral, pas de mutualisation de la dette, pas de transferts automatiques entre régions comme il en existe à l’intérieur d’un État.

> Le programme demande de savoir décrire la contrainte, pas de trancher le débat. Une bonne copie expose l’asymétrie monétaire/budgétaire et l’illustre par un exemple daté.`,
          },
          questions: [
            ['Qu’est-ce qu’un choc asymétrique ?', ['Un choc qui frappe certains pays de l’union et pas d’autres', 'Un choc d’offre mondial', 'Une crise financière', 'Une hausse générale des prix'], 0, 'Sans dévaluation possible, le pays touché doit passer par une dévaluation interne.'],
            ['Qu’appelle-t-on dévaluation interne ?', ['Une baisse des salaires et des prix pour restaurer la compétitivité', 'Une dévaluation de la monnaie nationale', 'Une baisse des taux directeurs', 'Une hausse des droits de douane'], 0, 'Longue, douloureuse et récessive, c’est le seul substitut à la dévaluation.'],
            ['Pourquoi reproche-t-on au pacte de stabilité d’être procyclique ?', ['Il impose de réduire le déficit quand l’économie ralentit', 'Il autorise des déficits illimités', 'Il ne concerne que les petits États', 'Il impose une relance en haut de cycle'], 0, 'La contrainte agit donc au pire moment.'],
            ['Le pacte de stabilité a été suspendu en 2020.', ['Vrai', 'Faux'], 0, 'Face à la pandémie, puis réformé pour laisser plus de place à l’investissement.'],
            ['Pourquoi la modération salariale d’un pays est-elle une politique non coopérative ?', ['Elle améliore sa compétitivité au détriment de ses voisins', 'Elle réduit son propre PIB', 'Elle augmente l’inflation dans toute la zone', 'Elle est interdite par les traités'], 0, 'C’est un gain relatif, obtenu sur les partenaires de la même union.'],
            ['Qu’est-ce que le semestre européen ?', ['L’examen annuel des budgets nationaux avant leur vote', 'Une période de six mois sans droits de douane', 'Le calendrier des réunions de la BCE', 'Un fonds d’aide aux régions pauvres'], 0, 'C’est l’un des rares instruments de coordination budgétaire.'],
            ['La concurrence fiscale entre États membres augmente les recettes de tous.', ['Vrai', 'Faux'], 1, 'Chacun baisse son taux pour attirer les bases, et tous perdent des recettes.'],
            ['Un taux directeur unique convient à toutes les conjonctures nationales.', ['Vrai', 'Faux'], 1, 'Il est trop élevé pour un pays en récession, trop bas pour un pays en surchauffe.'],
          ],
        },
        // ---- Chapitre 6 : la structure de la société française ---------------
        {
          titre: 'Structuration de l’espace social',
          axe: 'Comment est structurée la société française actuelle ?',
          lecon: {
            titre: 'Les lignes qui découpent une société',
            cours: `Une société n’est pas un ensemble d’individus interchangeables : elle est **structurée** par des différences qui se cumulent et se transmettent. Reste à savoir lesquelles retenir.

## Les facteurs de structuration
Le programme en retient six :
- la **catégorie socioprofessionnelle** ;
- le **revenu** et le **patrimoine** ;
- le **diplôme** ;
- la **position dans le cycle de vie** (l’âge) ;
- la **composition du ménage** ;
- le **sexe** et le **lieu de résidence**.

Aucun ne suffit seul : ils se **croisent**. Une femme cadre de 30 ans en région parisienne et un homme ouvrier de 55 ans en zone rurale diffèrent sur plusieurs dimensions à la fois.

## La nomenclature des PCS
L’INSEE classe la population active en **six grands groupes** : agriculteurs exploitants ; artisans, commerçants et chefs d’entreprise ; cadres et professions intellectuelles supérieures ; professions intermédiaires ; employés ; ouvriers. Trois critères la construisent : le **statut** (indépendant ou salarié), la **qualification** et le **secteur d’activité**.

Ses limites sont connues : elle repose sur l’activité professionnelle (mal adaptée aux retraités, chômeurs et étudiants), elle range dans le même groupe des situations très différentes, et elle a longtemps classé les femmes d’après la profession de leur conjoint.

## Le cycle de vie
La position sociale n’est pas fixe : le revenu croît généralement avec l’âge jusqu’à la retraite, le patrimoine s’accumule tout au long de la vie. Comparer les revenus de deux personnes d’âges différents mélange deux effets : un **effet d’âge** et un **effet de génération**.

## L’approche multidimensionnelle
Une analyse en termes de **classes** met l’accent sur la position économique ; une analyse en termes de **strates** ordonne les individus sur une échelle continue de prestige, de revenu ou de diplôme. Weber articule les deux en distinguant trois ordres :
- l’ordre **économique** (les classes) ;
- l’ordre **social** (les groupes de statut, définis par le prestige et le style de vie) ;
- l’ordre **politique** (les partis).

## Les inégalités multiformes
Les facteurs de structuration produisent des inégalités **cumulatives** : un faible diplôme conduit à un emploi moins qualifié, donc à un revenu plus faible, donc à un logement plus éloigné, donc à une santé et à une espérance de vie moindres. C’est ce cumul, plus qu’une différence isolée, qui fait la structure sociale.

> Le programme demande de savoir **croiser** les facteurs, pas d’en désigner un principal. C’est le sens du mot « multidimensionnelle » dans le libellé officiel.`,
          },
          questions: [
            ['Combien de grands groupes compte la nomenclature des PCS de l’INSEE ?', ['Six', 'Quatre', 'Huit', 'Douze'], 0, 'Agriculteurs, artisans-commerçants, cadres, professions intermédiaires, employés, ouvriers.'],
            ['Sur quels critères la nomenclature des PCS est-elle construite ?', ['Le statut, la qualification et le secteur d’activité', 'Le revenu, le patrimoine et le diplôme', 'L’âge, le sexe et le lieu de résidence', 'Le niveau de vie uniquement'], 0, 'Le statut distingue notamment les indépendants des salariés.'],
            ['Quelle est une limite reconnue de la nomenclature des PCS ?', ['Elle repose sur l’activité professionnelle, mal adaptée aux inactifs', 'Elle compte trop de groupes', 'Elle ne distingue pas les salariés des indépendants', 'Elle est propre à la France d’avant 1950'], 0, 'Retraités, chômeurs et étudiants y sont mal situés.'],
            ['Qu’est-ce qu’un effet d’âge, distingué d’un effet de génération ?', ['L’effet de la position dans le cycle de vie, indépendamment de l’année de naissance', 'L’effet du vieillissement de la population', 'L’effet du départ à la retraite', 'Un effet propre aux jeunes actifs'], 0, 'Comparer deux âges différents mélange les deux effets.'],
            ['Quels trois ordres Weber distingue-t-il ?', ['Économique, social et politique', 'Public, privé et associatif', 'Rural, urbain et périurbain', 'Primaire, secondaire et tertiaire'], 0, 'Les classes, les groupes de statut et les partis.'],
            ['Les inégalités sont cumulatives : un désavantage en appelle souvent d’autres.', ['Vrai', 'Faux'], 0, 'Diplôme, emploi, revenu, logement, santé : la chaîne se referme sur elle-même.'],
            ['Une analyse en termes de strates ordonne les individus sur une échelle continue.', ['Vrai', 'Faux'], 0, 'L’analyse en termes de classes, elle, distingue des groupes en opposition.'],
            ['Le programme demande de désigner un facteur de structuration principal.', ['Vrai', 'Faux'], 1, 'Il demande au contraire une approche multidimensionnelle, croisant les facteurs.'],
          ],
        },
        {
          titre: 'L’évolution de la structure sociale en France depuis la seconde moitié du XXe siècle',
          axe: 'Comment est structurée la société française actuelle ?',
          lecon: {
            titre: 'Ce qui s’est vraiment déformé en soixante-dix ans',
            cours: `La société française de 2020 ne ressemble plus à celle de 1950. Trois transformations expliquent l’essentiel.

## La salarisation
En 1950, un actif sur trois était indépendant (agriculteur, artisan, commerçant). Aujourd’hui, près de **neuf actifs sur dix sont salariés**. L’exode rural et la disparition des petites exploitations en sont la cause principale. Le mouvement s’est stabilisé, et l’essor du statut d’auto-entrepreneur en a même infléchi la tendance depuis 2009.

## La tertiarisation
L’emploi s’est déplacé de l’agriculture puis de l’industrie vers les **services**, qui représentent aujourd’hui environ **trois emplois sur quatre**. La part de l’industrie dans l’emploi a été divisée par plus de deux depuis 1970 : c’est la **désindustrialisation**, produite conjointement par les gains de productivité, l’externalisation de services autrefois comptés comme industriels, et les délocalisations.

## L’élévation du niveau de qualification
La massification scolaire a fait passer la part d’une génération obtenant le baccalauréat de moins de 10 % en 1950 à environ 80 % aujourd’hui. Les **cadres et professions intellectuelles supérieures** sont passés d’environ 3 % à près de 20 % des actifs, tandis que la part des **ouvriers** reculait d’environ 40 % à 20 %.

## La féminisation de l’emploi
Le taux d’activité des femmes de 25 à 49 ans est passé d’environ 40 % dans les années 1960 à plus de 80 %. Mais l’emploi féminin reste **concentré** dans quelques métiers (santé, éducation, services à la personne), plus souvent à temps partiel, et l’écart de salaire persiste.

## Ce qui n’a pas disparu
La structure sociale s’est déformée, pas aplanie :
- les **inégalités de patrimoine** restent bien plus fortes que celles de revenu, et se sont accrues depuis les années 1980 ;
- le groupe ouvrier, moins nombreux et moins visible, représente encore un actif sur cinq ;
- les **positions relatives** se sont maintenues : la massification scolaire a élevé le niveau de tous sans rebattre les rangs.

## Le débat sur la moyennisation
Les années 1960-1970 ont vu se développer la thèse de la **moyennisation** (Mendras) : une vaste classe moyenne absorberait les extrêmes, effaçant les conflits de classe. Depuis les années 1990, la thèse est contestée : on observe une **polarisation** de l’emploi (croissance des emplois très qualifiés et des emplois de service peu qualifiés, recul des emplois intermédiaires) et un décrochage du haut de la distribution.

> Deux constats se tiennent ensemble : la société s’est enrichie et qualifiée pour presque tous, ET les écarts de patrimoine se sont creusés. Une bonne copie ne choisit pas entre les deux.`,
          },
          questions: [
            ['Quelle part des actifs français est aujourd’hui salariée ?', ['Environ neuf sur dix', 'Environ deux sur trois', 'La moitié', 'Un sur trois'], 0, 'Contre environ deux sur trois en 1950 : c’est la salarisation.'],
            ['Qu’est-ce que la tertiarisation ?', ['Le déplacement de l’emploi vers les services', 'La hausse du nombre d’indépendants', 'L’allongement de la scolarité', 'La croissance du secteur public'], 0, 'Les services représentent environ trois emplois sur quatre.'],
            ['Quelles causes expliquent la désindustrialisation française ?', ['Gains de productivité, externalisation de services et délocalisations', 'Les délocalisations uniquement', 'La baisse de la demande de biens industriels', 'La hausse du prix de l’énergie seule'], 0, 'Attribuer le phénomène aux seules délocalisations est l’erreur la plus courante.'],
            ['La part des cadres dans la population active a fortement augmenté depuis 1950.', ['Vrai', 'Faux'], 0, 'D’environ 3 % à près de 20 %, tandis que celle des ouvriers reculait.'],
            ['Que désigne la thèse de la moyennisation ?', ['L’absorption des extrêmes par une vaste classe moyenne', 'La baisse du revenu moyen', 'La convergence des salaires européens', 'L’uniformisation des diplômes'], 0, 'Défendue par Mendras dans les années 1970, elle est contestée depuis les années 1990.'],
            ['Qu’observe-t-on depuis les années 1990 en matière d’emploi ?', ['Une polarisation : croissance des emplois très qualifiés et peu qualifiés, recul des intermédiaires', 'Une convergence de toutes les qualifications', 'Une disparition des emplois de service', 'Un retour de l’emploi industriel'], 0, 'Elle nourrit la contestation de la thèse de la moyennisation.'],
            ['Les inégalités de patrimoine sont plus faibles que les inégalités de revenu.', ['Vrai', 'Faux'], 1, 'Elles sont bien plus fortes, et se sont accrues depuis les années 1980.'],
            ['La massification scolaire a rebattu les positions relatives entre groupes sociaux.', ['Vrai', 'Faux'], 1, 'Elle a élevé le niveau de tous sans modifier sensiblement les rangs.'],
          ],
        },
        {
          titre: 'Les théories des classes sociales',
          axe: 'Comment est structurée la société française actuelle ?',
          lecon: {
            titre: 'Marx, Weber, Bourdieu : trois façons de découper',
            cours: `« Classe sociale » n’est pas un mot neutre : chaque auteur lui donne un contenu différent, et le débat sur son actualité en dépend.

## Marx : deux classes en conflit
La classe se définit par la **place dans les rapports de production** : possède-t-on les moyens de production, ou seulement sa force de travail ? D’où deux classes principales, la **bourgeoisie** et le **prolétariat**, en **conflit** structurel autour de la répartition de la valeur.

Marx distingue :
- la **classe en soi** : une position objective, partagée sans en avoir conscience ;
- la **classe pour soi** : la même position, devenue **conscience commune** et action collective.

Le passage de l’une à l’autre n’a rien d’automatique : il est le produit d’un travail politique.

## Weber : trois dimensions, une approche graduelle
Weber refuse de tout réduire à l’économie. Il distingue :
- l’ordre **économique** : les classes, définies par les chances d’accès aux biens sur le marché ;
- l’ordre **social** : les **groupes de statut**, définis par le prestige et le **style de vie** ;
- l’ordre **politique** : les partis, qui recherchent le pouvoir.

Ces trois ordres ne se recouvrent pas : un professeur peut avoir un prestige élevé et un revenu modeste. La stratification est **continue** et **multiple**, non binaire.

## Bourdieu : les capitaux et l’habitus
Bourdieu combine les deux traditions. La position se définit par le volume et la structure de trois **capitaux** :
- **économique** (revenus, patrimoine) ;
- **culturel** (diplômes, savoirs, aisance culturelle) ;
- **social** (le réseau de relations mobilisable).

L’**habitus** — l’ensemble des dispositions incorporées par la socialisation — fait que les membres d’une même classe partagent des goûts, des manières et des choix qui les distinguent. La **distinction** est ce travail permanent de démarcation par les pratiques culturelles.

## Le débat contemporain
Les classes sont-elles encore pertinentes ?
- **arguments pour** : les inégalités de revenu, de patrimoine, de santé et de pratiques restent fortement corrélées à la PCS ; l’homogamie sociale reste élevée ;
- **arguments contre** : l’**individualisation** des trajectoires, la moyennisation, le brouillage des frontières (un ouvrier propriétaire de son logement), la montée d’autres clivages (genre, âge, origine, territoire) et l’affaiblissement de la conscience de classe.

> Le programme n’attend pas un verdict, mais la capacité à opposer les deux séries d’arguments **en les datant** et en les appuyant sur des données.`,
          },
          questions: [
            ['Chez Marx, qu’est-ce qui définit la classe sociale ?', ['La place dans les rapports de production', 'Le niveau de revenu', 'Le prestige social', 'Le diplôme obtenu'], 0, 'Possède-t-on les moyens de production, ou seulement sa force de travail ?'],
            ['Quelle est la différence entre classe en soi et classe pour soi ?', ['La classe pour soi a conscience d’elle-même et agit collectivement', 'La classe en soi est plus riche', 'La classe pour soi est définie par le prestige', 'Il n’y a aucune différence'], 0, 'Le passage de l’une à l’autre est le produit d’un travail politique.'],
            ['Quels sont les trois capitaux de Bourdieu ?', ['Économique, culturel et social', 'Physique, humain et naturel', 'Financier, immobilier et mobilier', 'Public, privé et symbolique'], 0, 'Leur volume ET leur structure définissent la position sociale.'],
            ['Qu’est-ce que l’habitus chez Bourdieu ?', ['L’ensemble des dispositions incorporées par la socialisation', 'Le lieu de résidence', 'Le niveau de revenu du ménage', 'Le métier exercé'], 0, 'Il explique que les membres d’une même classe partagent goûts et manières.'],
            ['Chez Weber, un groupe de statut se définit par…', ['Le prestige et le style de vie', 'La propriété des moyens de production', 'Le revenu annuel', 'L’appartenance à un parti'], 0, 'Les trois ordres — économique, social, politique — ne se recouvrent pas.'],
            ['Chez Weber, la stratification sociale est binaire.', ['Vrai', 'Faux'], 1, 'Elle est continue et multidimensionnelle, contrairement à l’opposition marxienne.'],
            ['Quel argument nourrit la thèse de l’affaiblissement des classes sociales ?', ['L’individualisation des trajectoires et le brouillage des frontières', 'La hausse des inégalités de patrimoine', 'La persistance de l’homogamie', 'La corrélation entre PCS et espérance de vie'], 0, 'Les trois autres propositions plaident au contraire pour leur maintien.'],
            ['L’homogamie sociale désigne le fait de se mettre en couple dans son propre milieu.', ['Vrai', 'Faux'], 0, 'Sa persistance est un argument en faveur de la pertinence des classes sociales.'],
          ],
        },
        // ---- Chapitre 7 : l'action de l'École --------------------------------
        {
          titre: 'La massification scolaire depuis les années 1950',
          axe: 'Quelle est l’action de l’École sur les destins individuels et sur l’évolution de la société ?',
          lecon: {
            titre: 'Beaucoup plus d’élèves, pas les mêmes places',
            cours: `Depuis 1950, la France a fait entrer dans l’enseignement secondaire puis supérieur des générations entières. C’est la **massification** — un mouvement massif, mais qui n’a pas produit ce qu’on en attendait.

## Les chiffres du mouvement
- **1959** : scolarité obligatoire portée à 16 ans (réforme Berthoin) ;
- **1975** : collège unique (réforme Haby), qui supprime les filières séparées à l’entrée en sixième ;
- **1985** : objectif de 80 % d’une génération au niveau du baccalauréat ;
- aujourd’hui : environ **80 %** d’une génération obtient le bac, contre 5 % en 1950 ; plus de la moitié d’une génération accède à l’enseignement supérieur.

## Les moteurs
- la **demande sociale** des familles, qui voient dans le diplôme une protection contre le chômage et un moyen de mobilité ;
- la **demande économique** : la tertiarisation et l’élévation des qualifications requises ;
- l’**offre publique** : construction de collèges et de lycées, création du bac professionnel (1985), ouverture des universités.

## Massification n’est pas démocratisation
La distinction est au cœur du chapitre :
- la **massification** est quantitative : plus d’élèves atteignent chaque niveau ;
- la **démocratisation** est qualitative : les écarts entre milieux sociaux se réduisent à niveau donné.

La France a connu une massification indiscutable, et une démocratisation **ségrégative** (Merle) : tous montent, mais les enfants de cadres se dirigent vers les filières les plus rentables (générale, prépas, grandes écoles) pendant que les enfants d’ouvriers accèdent surtout au bac professionnel et aux filières courtes. Les hiérarchies se sont **déplacées à l’intérieur** du système plutôt que résorbées.

## Le paradoxe d’Anderson et l’inflation scolaire
Quand le nombre de diplômés croît plus vite que le nombre d’emplois qualifiés, la valeur du diplôme sur le marché du travail se **dévalue** : c’est l’**inflation scolaire**. Le **paradoxe d’Anderson** en découle : être plus diplômé que son père ne garantit plus une position sociale supérieure, puisque le niveau de référence s’est élevé pour tout le monde. Le **déclassement** — occuper un emploi en dessous de son niveau de diplôme — en est la manifestation.

## Ce que le diplôme protège encore
Malgré l’inflation, le diplôme reste le meilleur rempart contre le chômage : le taux de chômage des non-diplômés est plusieurs fois supérieur à celui des diplômés du supérieur. La dévaluation est **relative**, pas absolue.

> Massification, démocratisation, inflation scolaire, déclassement : quatre notions distinctes qu’une copie doit manier séparément. Les confondre est l’erreur la plus sanctionnée du chapitre.`,
          },
          questions: [
            ['Quelle est la différence entre massification et démocratisation scolaires ?', ['La massification est quantitative, la démocratisation réduit les écarts entre milieux sociaux', 'Ce sont deux synonymes', 'La démocratisation concerne l’enseignement privé', 'La massification concerne le supérieur uniquement'], 0, 'La France a connu la première sans vraiment connaître la seconde.'],
            ['Qu’est-ce que la démocratisation ségrégative décrite par Merle ?', ['Tous progressent, mais les milieux favorisés occupent les filières les plus rentables', 'Une séparation des élèves par sexe', 'La création d’écoles privées', 'L’exclusion des élèves en difficulté'], 0, 'Les hiérarchies se déplacent à l’intérieur du système au lieu de se résorber.'],
            ['Quelle réforme a créé le collège unique ?', ['La réforme Haby de 1975', 'La réforme Berthoin de 1959', 'La loi de 1985 sur le bac professionnel', 'La loi Jospin de 1989'], 0, 'Elle supprime les filières séparées dès l’entrée en sixième.'],
            ['Qu’est-ce que l’inflation scolaire ?', ['La dévaluation du diplôme quand les diplômés croissent plus vite que les emplois qualifiés', 'La hausse du coût des études', 'L’allongement de la scolarité obligatoire', 'La hausse du nombre d’enseignants'], 0, 'Le paradoxe d’Anderson en découle directement.'],
            ['Que dit le paradoxe d’Anderson ?', ['Être plus diplômé que son père ne garantit plus une position sociale supérieure', 'Les diplômés gagnent toujours plus', 'Le diplôme ne sert à rien', 'Les enfants de cadres réussissent mieux'], 0, 'Le niveau de référence s’est élevé pour tout le monde.'],
            ['Le diplôme ne protège plus du tout du chômage.', ['Vrai', 'Faux'], 1, 'La dévaluation est relative : les non-diplômés restent bien plus exposés.'],
            ['Quelle part d’une génération obtient aujourd’hui le baccalauréat en France ?', ['Environ 80 %', 'Environ 50 %', 'Environ 95 %', 'Environ 30 %'], 0, 'Contre environ 5 % en 1950.'],
            ['Qu’appelle-t-on déclassement ?', ['Occuper un emploi en dessous de son niveau de diplôme', 'Perdre son emploi', 'Redoubler une classe', 'Changer de catégorie socioprofessionnelle'], 0, 'C’est la manifestation individuelle de l’inflation scolaire.'],
          ],
        },
        {
          titre: 'Une inégalité des chances persistante',
          axe: 'Quelle est l’action de l’École sur les destins individuels et sur l’évolution de la société ?',
          lecon: {
            titre: 'Pourquoi l’École reproduit ce qu’elle prétend corriger',
            cours: `À diplôme du père identique, la trajectoire scolaire d’un enfant reste largement prévisible. Le chapitre explique pourquoi, par trois familles de mécanismes.

## Le constat
En France, environ **70 %** des enfants de cadres obtiennent un diplôme du supérieur, contre moins de **30 %** des enfants d’ouvriers. L’écart se creuse dès l’école primaire et se retrouve, amplifié, à l’entrée des grandes écoles.

## Le capital culturel (Bourdieu et Passeron)
L’École valorise implicitement une culture — un langage, des références, un rapport au savoir — qui est celle des classes favorisées. Les enfants qui la possèdent déjà par leur famille sont avantagés **sans effort visible**, ce qui fait passer un héritage pour un don. Bourdieu et Passeron parlent de **violence symbolique** : les dominés adhèrent au verdict scolaire et l’intériorisent comme un jugement sur leurs capacités.

Le capital culturel existe sous trois formes : **incorporée** (les dispositions), **objectivée** (les livres, les instruments) et **institutionnalisée** (les diplômes).

## Les stratégies familiales (Boudon)
Boudon propose une explication **individualiste** : à chaque palier d’orientation, la famille compare coûts, risques et bénéfices attendus. Or ces trois termes ne sont pas les mêmes selon le milieu :
- le **coût** d’études longues pèse davantage sur une famille modeste ;
- le **risque** d’échec y est perçu comme plus grave ;
- le **bénéfice** est jugé à l’aune de la position à conserver — pour un enfant de cadre, il faut faire des études longues **pour ne pas déchoir**.

D’où des choix d’orientation différents **à résultats scolaires identiques** : c’est l’effet le mieux documenté du chapitre.

## Les inégalités produites par l’institution
- la **carte scolaire** et la ségrégation résidentielle concentrent les difficultés dans certains établissements ;
- les **effets d’établissement** et de classe ;
- l’**effet Pygmalion** : les attentes de l’enseignant influencent les résultats de l’élève ;
- les stratégies d’**évitement** (options rares, privé, dérogations) sont mieux maîtrisées par les familles informées.

## Les politiques mises en œuvre
Éducation prioritaire (ZEP en 1981, REP et REP+ aujourd’hui), dédoublement des classes de CP et CE1 en éducation prioritaire, cordées de la réussite, quotas de boursiers. Les évaluations montrent des effets réels mais modestes : l’École seule ne compense pas des inégalités qui la précèdent et lui survivent.

> Bourdieu et Boudon ne se contredisent pas : le premier explique pourquoi les élèves n’ont pas les mêmes armes, le second pourquoi, à armes égales, ils ne font pas les mêmes choix.`,
          },
          questions: [
            ['Qu’est-ce que le capital culturel ?', ['Les savoirs, dispositions et références transmis par la famille et valorisés par l’École', 'Le budget culturel d’un ménage', 'Le nombre de livres publiés dans un pays', 'Les subventions à la culture'], 0, 'Il existe sous forme incorporée, objectivée et institutionnalisée.'],
            ['Qu’appelle-t-on violence symbolique chez Bourdieu et Passeron ?', ['L’intériorisation par les dominés du verdict scolaire comme un jugement sur leurs capacités', 'Les violences physiques à l’école', 'La sanction disciplinaire', 'Le harcèlement scolaire'], 0, 'Un héritage social y est perçu comme un don personnel.'],
            ['Que met en avant l’explication de Boudon ?', ['Des choix d’orientation rationnels mais différents selon le milieu, à résultats égaux', 'La transmission du capital culturel', 'L’effet des enseignants', 'La carte scolaire'], 0, 'Coûts, risques et bénéfices attendus ne sont pas les mêmes selon le milieu.'],
            ['Les explications de Bourdieu et de Boudon se contredisent.', ['Vrai', 'Faux'], 1, 'L’une explique l’inégalité des armes, l’autre celle des choix à armes égales.'],
            ['Qu’est-ce que l’effet Pygmalion ?', ['L’influence des attentes de l’enseignant sur les résultats de l’élève', 'L’effet du redoublement', 'L’effet de la taille des classes', 'L’effet du niveau de diplôme des parents'], 0, 'Il fait partie des inégalités produites par l’institution elle-même.'],
            ['Environ quelle part des enfants de cadres obtient un diplôme du supérieur ?', ['Environ 70 %', 'Environ 30 %', 'Environ 50 %', 'Environ 95 %'], 0, 'Contre moins de 30 % des enfants d’ouvriers.'],
            ['Quelle politique vise directement les inégalités scolaires territoriales ?', ['L’éducation prioritaire (REP et REP+)', 'Le baccalauréat professionnel', 'Le collège unique', 'La semaine de quatre jours'], 0, 'Créée en 1981 sous le nom de ZEP, elle a été renforcée par le dédoublement des CP.'],
            ['Les politiques d’éducation prioritaire ont totalement effacé les inégalités de réussite.', ['Vrai', 'Faux'], 1, 'Leurs effets sont réels mais modestes : l’École ne compense pas seule.'],
          ],
        },
        // ---- Chapitre 8 : la mobilité sociale --------------------------------
        {
          titre: 'Qu’est-ce que la mobilité sociale ?',
          axe: 'Quels sont les caractéristiques contemporaines et les facteurs de la mobilité sociale ?',
          lecon: {
            titre: 'Lire une table de mobilité sans se tromper de ligne',
            cours: `La **mobilité sociale** est le changement de position sociale d’une génération à l’autre. La mesurer suppose un outil précis — et savoir le lire est la compétence la plus évaluée du chapitre.

## Les distinctions de vocabulaire
- **intergénérationnelle** : entre la position du fils (ou de la fille) et celle du père (ou de la mère). C’est celle que mesure l’INSEE ;
- **intragénérationnelle** : au cours de la carrière d’une même personne ;
- **verticale** (ascendante ou descendante) ou **horizontale** (changement de groupe sans changement de niveau) ;
- l’absence de mobilité s’appelle la **reproduction sociale**.

## La table de destinée
Elle se lit **en ligne** : « parmi 100 fils d’ouvriers, combien sont devenus cadres, employés, ouvriers… ? » Elle répond à la question : **que deviennent** les enfants d’un milieu donné ?

## La table de recrutement
Elle se lit **en colonne** : « parmi 100 cadres, combien avaient un père cadre, ouvrier, employé… ? » Elle répond à la question : **d’où viennent** les membres d’un groupe ?

Les deux tables donnent des réponses différentes à partir des mêmes données, parce que les groupes n’ont pas la même taille. C’est la source d’erreur numéro un : une phrase construite sur la table de destinée ne peut pas être justifiée par la table de recrutement.

## Mobilité structurelle et mobilité nette
- la **mobilité structurelle** est celle qu’imposent les transformations de la structure des emplois : quand le nombre de places de cadres augmente et que celui des agriculteurs s’effondre, il **faut** que des enfants d’agriculteurs deviennent autre chose ;
- la **mobilité nette** (ou de circulation) est ce qui reste une fois cet effet retiré. C’est elle qui mesure la **fluidité sociale** réelle d’une société.

Une société peut afficher beaucoup de mobilité observée et très peu de fluidité : c’est le cas de la France des Trente Glorieuses.

## Les limites de la mesure
- les tables reposent sur la PCS, avec toutes ses limites ;
- elles ont longtemps ignoré les femmes, ou les ont classées d’après leur conjoint ;
- elles ne disent rien de la mobilité **à l’intérieur** d’un groupe (un ouvrier qualifié devenu ouvrier non qualifié) ;
- elles comparent une position en fin de carrière du père à une position parfois précoce du fils.

> Retenir la formule : destinée = « que deviennent-ils ? » (en ligne), recrutement = « d’où viennent-ils ? » (en colonne). Tout le reste du chapitre en dépend.`,
          },
          questions: [
            ['Comment se lit une table de destinée ?', ['En ligne : que deviennent les enfants d’un milieu donné', 'En colonne : d’où viennent les membres d’un groupe', 'En diagonale uniquement', 'Par totaux généraux'], 0, 'La table de recrutement, elle, se lit en colonne.'],
            ['Qu’est-ce que la mobilité structurelle ?', ['La mobilité imposée par la transformation de la structure des emplois', 'La mobilité géographique', 'La mobilité au cours d’une carrière', 'La mobilité entre pays'], 0, 'Quand les places de cadres augmentent, il faut bien que quelqu’un les occupe.'],
            ['Que mesure la fluidité sociale ?', ['La mobilité nette, une fois retiré l’effet des transformations de la structure des emplois', 'Le nombre total de personnes mobiles', 'La vitesse des changements de poste', 'La mobilité géographique interne'], 0, 'Une société peut avoir beaucoup de mobilité observée et très peu de fluidité.'],
            ['La mobilité intergénérationnelle compare la position d’un individu à celle de ses parents.', ['Vrai', 'Faux'], 0, 'La mobilité intragénérationnelle porte, elle, sur la carrière d’une même personne.'],
            ['Qu’est-ce que la mobilité horizontale ?', ['Un changement de groupe sans changement de niveau social', 'Une ascension sociale', 'Un déclassement', 'Un déménagement'], 0, 'La mobilité verticale, ascendante ou descendante, change le niveau.'],
            ['On peut justifier une phrase issue de la table de destinée avec la table de recrutement.', ['Vrai', 'Faux'], 1, 'C’est l’erreur numéro un : les groupes n’ont pas la même taille.'],
            ['Quelle limite historique majeure les tables de mobilité présentent-elles ?', ['Elles ont longtemps ignoré les femmes ou les ont classées d’après leur conjoint', 'Elles ne portent que sur les cadres', 'Elles ne couvrent que le secteur public', 'Elles sont publiées tous les vingt ans'], 0, 'S’y ajoutent les limites de la nomenclature des PCS elle-même.'],
            ['L’absence de mobilité sociale porte le nom de…', ['Reproduction sociale', 'Mobilité nulle structurelle', 'Immobilisme statutaire', 'Stagnation sociale'], 0, 'C’est le terme employé par le programme.'],
          ],
        },
        {
          titre: 'L’évolution de la mobilité sociale',
          axe: 'Quels sont les caractéristiques contemporaines et les facteurs de la mobilité sociale ?',
          lecon: {
            titre: 'Beaucoup de mouvement, peu de fluidité',
            cours: `Les enquêtes FQP de l’INSEE permettent de suivre la mobilité sociale française depuis les années 1970. Le constat d’ensemble est stable, et contre-intuitif.

## Ce que montrent les données
Environ **deux tiers** des hommes actifs occupent une position différente de celle de leur père. La mobilité observée est donc massive. Mais :
- une grande part est **structurelle**, produite par la salarisation, la tertiarisation et l’essor des emplois qualifiés ;
- la **fluidité sociale** — la mobilité nette — n’a que **peu évolué** depuis les années 1980 ;
- la mobilité est majoritairement **de courte distance** : on passe d’ouvrier à employé bien plus souvent que d’ouvrier à cadre.

## L’asymétrie de la reproduction
Les extrémités de la hiérarchie sont les plus **fermées** : les fils de cadres restent cadres bien plus souvent que le hasard ne le voudrait, et les fils d’ouvriers restent ouvriers. Les positions intermédiaires sont plus ouvertes des deux côtés.

## Le tournant des années 1980
La mobilité **ascendante** a ralenti : les générations nées après 1960 sont les premières à connaître une mobilité descendante plus fréquente que leurs aînées, la structure des emplois n’offrant plus la même expansion de places qualifiées. Le **déclassement** intergénérationnel augmente, surtout pour les enfants des classes moyennes.

## Les facteurs de la mobilité
- l’**École** : le diplôme est le premier vecteur, mais son rendement s’est dégradé (inflation scolaire) ;
- la **famille** : capital culturel, capital social, aspirations, soutien financier ;
- la **structure des emplois** : c’est elle qui ouvre ou ferme les places disponibles ;
- la **conjoncture** : entrer sur le marché du travail en récession laisse une trace durable sur toute la carrière ;
- l’**homogamie** : se mettre en couple dans son milieu limite la mobilité du ménage.

## La mobilité des femmes
Longtemps invisible dans les tables, elle est aujourd’hui mesurée. Elle est plus forte que celle des hommes en apparence — parce que la structure des emplois féminins s’est transformée plus vite —, mais les femmes restent concentrées dans certaines PCS et le **plafond de verre** limite l’accès aux positions dirigeantes.

## Ce que la mobilité dit d’une société
Une société fluide n’est pas nécessairement égalitaire : la fluidité mesure la **circulation** entre positions, pas l’écart entre elles. À l’inverse, une société très inégalitaire mais fluide reste plus acceptable pour ses membres qu’une société inégalitaire et fermée. Les deux dimensions doivent être tenues ensemble.

> La bonne formule d’examen : « la France connaît une mobilité importante mais largement structurelle, et une fluidité sociale stable depuis quarante ans ».`,
          },
          questions: [
            ['Quelle part des hommes actifs occupe une position différente de celle de leur père ?', ['Environ deux tiers', 'Environ un tiers', 'La quasi-totalité', 'Environ un dixième'], 0, 'Mais une grande partie de cette mobilité est structurelle.'],
            ['La fluidité sociale française a-t-elle beaucoup évolué depuis les années 1980 ?', ['Non, elle est restée à peu près stable', 'Oui, elle a fortement augmenté', 'Oui, elle a été divisée par deux', 'Elle n’est pas mesurable'], 0, 'C’est la mobilité observée, non la fluidité, qui a été forte.'],
            ['La mobilité sociale française est majoritairement…', ['De courte distance', 'De longue distance', 'Descendante', 'Horizontale'], 0, 'On passe d’ouvrier à employé bien plus souvent que d’ouvrier à cadre.'],
            ['Quelles positions de la hiérarchie sociale sont les plus fermées ?', ['Les deux extrémités', 'Les positions intermédiaires', 'Les professions indépendantes', 'Les emplois publics'], 0, 'Fils de cadres et fils d’ouvriers reproduisent plus souvent la position de leur père.'],
            ['Qu’observe-t-on pour les générations nées après 1960 ?', ['Une mobilité descendante plus fréquente que pour leurs aînées', 'Une mobilité ascendante record', 'Une disparition du déclassement', 'Une immobilité totale'], 0, 'La structure des emplois n’offre plus la même expansion de places qualifiées.'],
            ['L’homogamie tend à limiter la mobilité sociale du ménage.', ['Vrai', 'Faux'], 0, 'Se mettre en couple dans son propre milieu renforce la position d’origine.'],
            ['Qu’est-ce que le plafond de verre ?', ['L’ensemble des obstacles invisibles limitant l’accès des femmes aux postes dirigeants', 'Un seuil de revenu au-delà duquel l’impôt augmente', 'La limite d’âge des cadres dirigeants', 'Le niveau maximal de diplôme accessible'], 0, 'Il explique que la mobilité apparente des femmes ne se traduise pas au sommet.'],
            ['Une société fluide est nécessairement une société égalitaire.', ['Vrai', 'Faux'], 1, 'La fluidité mesure la circulation entre positions, pas l’écart entre elles.'],
          ],
        },
        // ---- Chapitre 9 : mutations du travail et de l'emploi -----------------
        {
          titre: 'L’évolution des formes de l’emploi',
          axe: 'Quelles mutations du travail et de l’emploi ?',
          lecon: {
            titre: 'La norme et ses marges',
            cours: `Le **travail** est une activité de production ; l’**emploi** est le cadre juridique et social dans lequel il s’exerce. Le second a beaucoup plus changé que le premier.

## La norme d’emploi
La société salariale d’après-guerre a produit une norme : le **CDI à temps plein**, avec une protection sociale attachée au poste, une carrière dans une même entreprise et une convention collective. Elle reste majoritaire — environ **trois emplois sur quatre** sont des CDI — mais elle s’est effritée sur ses marges.

## Les formes particulières d’emploi
CDD, intérim, temps partiel, apprentissage, stages : elles ne représentent qu’environ 12 à 15 % de l’emploi total, mais l’essentiel des **embauches** — plus de 85 % des recrutements se font en CDD, dont une majorité de très courte durée. Le CDI est donc devenu une position à atteindre plutôt qu’un point de départ.

## La polarisation
Deux mouvements simultanés :
- **en haut** : croissance des emplois très qualifiés, autonomes, bien rémunérés ;
- **en bas** : croissance des emplois de service peu qualifiés, difficilement automatisables (aide à domicile, livraison, nettoyage, caisse) ;
- **au milieu** : recul des emplois intermédiaires, les plus exposés à l’automatisation et à la délocalisation.

## Le travail indépendant et les plateformes
Le statut d’**auto-entrepreneur** (2009) et l’essor des plateformes numériques ont fait remonter la part des indépendants après un siècle de baisse. Le débat porte sur la **dépendance économique** : un livreur qui ne choisit ni ses tarifs ni son organisation est juridiquement indépendant et économiquement subordonné. Plusieurs décisions de justice ont requalifié ces relations en contrat de travail.

## La précarité
Elle ne se réduit pas au type de contrat : elle combine l’instabilité de l’emploi, la faiblesse du revenu, l’imprévisibilité des horaires et l’absence de perspectives. Les **travailleurs pauvres** — occupés mais sous le seuil de pauvreté — en sont la manifestation la plus nette : environ un actif occupé sur vingt en France.

## Qui est concerné
La segmentation du marché du travail oppose un **marché primaire** (emplois stables, bien rémunérés, avec perspectives) et un **marché secondaire** (emplois instables, peu qualifiés, sans mobilité vers le premier). Les jeunes, les femmes, les peu diplômés et les personnes issues de l’immigration y sont surreprésentés.

> La question d’examen n’est pas « le CDI a-t-il disparu ? » — il n’a pas disparu — mais « pour qui la norme d’emploi vaut-elle encore ? ». C’est là que les données sur les embauches font la différence.`,
          },
          questions: [
            ['Quelle part de l’emploi français est en CDI ?', ['Environ trois sur quatre', 'Environ la moitié', 'Environ un sur cinq', 'La quasi-totalité'], 0, 'La norme reste majoritaire en stock, minoritaire en flux d’embauches.'],
            ['Quelle part des embauches se fait en CDD ?', ['Plus de 85 %', 'Environ la moitié', 'Environ 15 %', 'Moins de 5 %'], 0, 'Le CDI est devenu une position à atteindre plutôt qu’un point de départ.'],
            ['Qu’est-ce que la polarisation de l’emploi ?', ['La croissance des emplois très qualifiés et peu qualifiés, avec recul des intermédiaires', 'La concentration de l’emploi dans les métropoles', 'L’opposition entre secteur public et privé', 'La séparation entre CDI et CDD'], 0, 'Les emplois intermédiaires sont les plus exposés à l’automatisation.'],
            ['Quel est l’enjeu juridique du travail de plateforme ?', ['La dépendance économique d’un travailleur juridiquement indépendant', 'La durée du temps de travail', 'Le niveau de qualification requis', 'La localisation des entreprises'], 0, 'Plusieurs décisions de justice ont requalifié ces relations en contrat de travail.'],
            ['Un travailleur pauvre est une personne sans emploi.', ['Vrai', 'Faux'], 1, 'C’est un actif occupé dont le ménage vit sous le seuil de pauvreté.'],
            ['Que distingue la théorie de la segmentation du marché du travail ?', ['Un marché primaire stable et un marché secondaire instable, faiblement communicants', 'Le secteur public et le secteur privé', 'Les grandes et les petites entreprises', 'Les emplois industriels et de service'], 0, 'Jeunes, femmes et peu diplômés sont surreprésentés dans le second.'],
            ['Le statut d’auto-entrepreneur, créé en 2009, a fait remonter la part des indépendants.', ['Vrai', 'Faux'], 0, 'Après un siècle de baisse continue liée à la salarisation.'],
            ['La précarité se réduit-elle au type de contrat de travail ?', ['Non : elle combine instabilité, faible revenu, horaires imprévisibles et absence de perspectives', 'Oui, seul le CDD est précaire', 'Oui, seul le temps partiel est précaire', 'Non, elle ne dépend que du revenu'], 0, 'Un CDI à temps partiel subi peut être plus précaire qu’un CDD qualifié.'],
          ],
        },
        {
          titre: 'L’organisation du travail : quels modèles ?',
          axe: 'Quelles mutations du travail et de l’emploi ?',
          lecon: {
            titre: 'De la chaîne au tableau de bord',
            cours: `La façon d’organiser le travail n’est pas une question technique : elle décide de l’autonomie, de la qualification et de la santé de ceux qui l’exécutent.

## Le taylorisme
Formalisé par Taylor au début du XXe siècle, il repose sur :
- la **division verticale** du travail : séparation stricte entre ceux qui conçoivent (le bureau des méthodes) et ceux qui exécutent ;
- la **division horizontale** : décomposition du travail en tâches élémentaires, répétitives, chronométrées ;
- le **salaire au rendement**, pour aligner l’intérêt de l’ouvrier sur la cadence.

Ford y ajoute la **chaîne de montage** (qui impose le rythme), la **standardisation** du produit et le *five dollars day* — un salaire élevé pour retenir la main-d’œuvre et solvabiliser la demande.

Le gain de productivité est spectaculaire ; le coût est l’**aliénation**, l’absentéisme et le turnover.

## La crise du modèle
À partir des années 1970 : demande plus variable et plus exigeante en variété, refus social du travail parcellisé, rigidité d’un système incapable de changer vite de production.

## Le toyotisme
Développé par Ohno chez Toyota, il inverse plusieurs principes :
- le **juste-à-temps** : produire à la commande, sans stock, ce qui rend le système réactif mais fragile ;
- la **qualité totale** et l’auto-contrôle par l’opérateur, au lieu d’un contrôle en bout de chaîne ;
- la **polyvalence** et le travail en **équipes autonomes** ;
- l’**amélioration continue** (*kaizen*), qui sollicite les suggestions des opérateurs.

Le travail redevient plus varié — mais l’intensité augmente : le juste-à-temps supprime les temps morts qui servaient de respiration.

## Le travail aujourd’hui
- l’**informatisation** et l’automatisation déplacent le travail vers le contrôle de machines et le traitement de l’information ;
- le **management par objectifs** remplace la surveillance directe par l’**évaluation des résultats** : l’autonomie dans les moyens s’accompagne d’une contrainte accrue sur les fins ;
- le **télétravail**, généralisé après 2020, brouille la frontière entre vie professionnelle et vie privée ;
- l’**ubérisation** externalise le contrôle vers l’algorithme et la notation par le client.

## Les conséquences sur la santé
Les troubles musculo-squelettiques restent la première maladie professionnelle reconnue, et les **risques psychosociaux** (stress, épuisement, perte de sens) progressent. Le modèle de Karasek l’explique : la souffrance naît de la combinaison d’une **forte demande** et d’une **faible latitude décisionnelle**.

> Aucun modèle n’a remplacé le précédent : une même entreprise peut être taylorienne dans son entrepôt, toyotiste dans son atelier et managée par objectifs dans ses bureaux.`,
          },
          questions: [
            ['Qu’est-ce que la division verticale du travail chez Taylor ?', ['La séparation entre ceux qui conçoivent et ceux qui exécutent', 'La décomposition en tâches élémentaires', 'La hiérarchie des salaires', 'La séparation entre ateliers'], 0, 'La division horizontale, elle, découpe le travail en tâches répétitives.'],
            ['Qu’a ajouté Ford au taylorisme ?', ['La chaîne de montage, la standardisation et un salaire élevé', 'Le juste-à-temps', 'La polyvalence des opérateurs', 'L’auto-contrôle qualité'], 0, 'Le five dollars day visait à retenir la main-d’œuvre et à solvabiliser la demande.'],
            ['Sur quel principe repose le juste-à-temps ?', ['Produire à la commande, sans stock', 'Produire en grande série pour stocker', 'Contrôler la qualité en fin de chaîne', 'Spécialiser chaque poste'], 0, 'Le système devient réactif, mais fragile en cas de rupture d’approvisionnement.'],
            ['Le toyotisme réduit l’intensité du travail par rapport au taylorisme.', ['Vrai', 'Faux'], 1, 'Le travail est plus varié, mais le juste-à-temps supprime les temps morts.'],
            ['Qu’est-ce que le kaizen ?', ['L’amélioration continue, nourrie par les suggestions des opérateurs', 'Le contrôle qualité en fin de chaîne', 'Le chronométrage des tâches', 'Le salaire au rendement'], 0, 'Il fait partie des principes du toyotisme.'],
            ['Que dit le modèle de Karasek sur la santé au travail ?', ['La souffrance naît d’une forte demande combinée à une faible latitude décisionnelle', 'Le stress vient uniquement du temps de travail', 'Les troubles physiques sont plus graves que les psychiques', 'L’autonomie augmente toujours le stress'], 0, 'Il explique les risques psychosociaux du management par objectifs.'],
            ['Le management par objectifs remplace la surveillance directe par l’évaluation des résultats.', ['Vrai', 'Faux'], 0, 'L’autonomie dans les moyens s’accompagne d’une contrainte accrue sur les fins.'],
            ['Le toyotisme a fait entièrement disparaître le taylorisme.', ['Vrai', 'Faux'], 1, 'Une même entreprise peut combiner les deux modèles selon les services.'],
          ],
        },
        {
          titre: 'L’évolution du lien social dans le monde du travail',
          axe: 'Quelles mutations du travail et de l’emploi ?',
          lecon: {
            titre: 'Le travail intègre-t-il encore ?',
            cours: `Durkheim en avait fait le cœur de sa sociologie : dans les sociétés modernes, c’est la **division du travail** qui produit la solidarité. Un siècle plus tard, la question se repose autrement.

## Le travail comme facteur d’intégration
Il intègre par trois canaux :
- **économique** : un revenu, donc une autonomie et une capacité de consommer ;
- **social** : des collègues, un collectif, un réseau, une sociabilité quotidienne ;
- **symbolique** : un statut, une identité, une reconnaissance et une place assignable dans la société.

Durkheim distingue la **solidarité mécanique** des sociétés traditionnelles (l’unité naît de la ressemblance) et la **solidarité organique** des sociétés modernes (l’unité naît de la complémentarité des fonctions). La seconde suppose une division du travail qui ne soit pas « anomique » — c’est-à-dire encadrée par des règles reconnues.

## Ce qui fragilise ce rôle
- le **chômage** de longue durée détruit les trois canaux à la fois. Schnapper a montré comment il désorganise le temps et l’identité ;
- la **précarité** rend l’appartenance provisoire : on ne s’intègre pas à un collectif que l’on quittera dans trois mois ;
- l’**individualisation** du travail (objectifs individuels, primes, évaluations) affaiblit le collectif de travail ;
- le **télétravail** et l’externalisation dispersent physiquement les équipes ;
- le **sous-emploi** et le déclassement fournissent un revenu sans reconnaissance.

## La désaffiliation
Robert Castel décrit un continuum plutôt qu’une frontière : entre l’**intégration** (travail stable, relations solides) et la **désaffiliation** (ni travail ni lien) se trouve la **vulnérabilité** — travail précaire, relations fragiles. Le basculement est progressif, ce qui explique qu’il soit longtemps invisible.

## Ce qui subsiste
Le travail reste, dans les enquêtes, l’une des principales sources d’identité et de sociabilité des Français — l’attachement au travail y demeure élevé, y compris chez les jeunes générations, dont les attentes portent davantage sur le **sens** et l’équilibre des temps que sur la seule rémunération.

## Les autres instances d’intégration
La famille, l’École, la protection sociale, les associations, la citoyenneté politique produisent aussi du lien. La question du programme est de savoir si elles **compensent** l’affaiblissement du travail — ou si elles se fragilisent en même temps que lui, la protection sociale française étant largement adossée à l’emploi.

> Formule utile : le travail intègre toujours, mais il intègre **inégalement** — et ce sont ceux qui en auraient le plus besoin qui en bénéficient le moins.`,
          },
          questions: [
            ['Par quels canaux le travail intègre-t-il ?', ['Économique, social et symbolique', 'Économique uniquement', 'Familial et scolaire', 'Politique et juridique'], 0, 'Un revenu, un collectif, et une identité reconnue.'],
            ['Qu’est-ce que la solidarité organique chez Durkheim ?', ['L’unité née de la complémentarité des fonctions dans une société différenciée', 'L’unité née de la ressemblance entre individus', 'La solidarité familiale', 'La redistribution par l’État'], 0, 'La solidarité mécanique, elle, caractérise les sociétés traditionnelles.'],
            ['Que désigne la désaffiliation chez Castel ?', ['La situation de ceux qui n’ont ni travail ni lien social', 'La perte de nationalité', 'Le départ à la retraite', 'La rupture d’un contrat de travail'], 0, 'Entre intégration et désaffiliation, il place la zone de vulnérabilité.'],
            ['Chez Castel, la vulnérabilité est une zone intermédiaire entre intégration et désaffiliation.', ['Vrai', 'Faux'], 0, 'Travail précaire et relations fragiles : le basculement y est progressif.'],
            ['Qu’est-ce qui affaiblit le collectif de travail selon le programme ?', ['L’individualisation des objectifs, des primes et des évaluations', 'La hausse des salaires', 'La réduction du temps de travail', 'La syndicalisation'], 0, 'S’y ajoutent le télétravail et l’externalisation, qui dispersent les équipes.'],
            ['Le travail a cessé d’être une source d’identité pour les Français.', ['Vrai', 'Faux'], 1, 'L’attachement au travail reste élevé, y compris chez les jeunes générations.'],
            ['Pourquoi le chômage de longue durée est-il particulièrement désintégrateur ?', ['Il détruit à la fois le revenu, le collectif et l’identité', 'Il empêche de déménager', 'Il réduit les droits civiques', 'Il diminue le niveau de diplôme'], 0, 'Schnapper a montré comment il désorganise le temps et l’identité.'],
            ['En France, la protection sociale est largement adossée à l’emploi.', ['Vrai', 'Faux'], 0, 'C’est pourquoi la fragilisation de l’emploi fragilise aussi cette instance d’intégration.'],
          ],
        },
        // ---- Chapitre 10 : l'engagement politique -----------------------------
        {
          titre: 'Diverses formes d’engagement citoyen',
          axe: 'Comment expliquer l’engagement politique dans les sociétés démocratiques ?',
          lecon: {
            titre: 'Pourquoi s’engager quand on pourrait ne rien faire',
            cours: `L’**engagement politique** ne se réduit pas au vote : il désigne toute participation volontaire à la vie de la cité. Le chapitre en explique la variété — et le paradoxe qui le rend théoriquement improbable.

## Les répertoires de l’engagement
- le **vote**, forme la plus répandue et la moins coûteuse ;
- le **militantisme** : adhésion à un parti, un syndicat, une association ;
- l’**engagement associatif**, très large en France ;
- la **consommation engagée** : boycott et *buycott*, achat responsable ;
- les **actions protestataires** : manifestation, pétition, grève, occupation, désobéissance civile.

Ces répertoires ne se remplacent pas : ceux qui manifestent sont aussi ceux qui votent le plus.

## Le paradoxe de l’action collective (Olson)
Si l’objectif d’une action collective est un **bien collectif** — une hausse de salaire pour toute la branche, un air plus pur —, chacun en bénéficiera qu’il ait participé ou non. L’individu rationnel a donc intérêt à **ne pas** participer : c’est le **passager clandestin** (*free rider*).

Trois réponses expliquent que l’action collective existe malgré tout :
- les **incitations sélectives** : avantages réservés aux seuls participants (services syndicaux, caisse de grève) ;
- la **taille réduite** du groupe, où l’abstention se voit ;
- les **rétributions symboliques** du militantisme (Gaxie) : sociabilité, reconnaissance, estime de soi, apprentissage — le militant y gagne autre chose que la cause elle-même.

## Les variables de l’engagement
- l’**âge** : effet de cycle de vie (l’engagement associatif culmine à l’âge mûr) et effet de génération ;
- le **diplôme** et la **catégorie socioprofessionnelle** : plus on est diplômé, plus on s’engage, sous toutes les formes ;
- le **sexe** : les formes d’engagement diffèrent plus que leur intensité ;
- la **génération** : chaque cohorte garde la marque des événements politiques de sa jeunesse.

## Les transformations récentes
Le militantisme partisan et syndical recule — la France a l’un des taux de syndicalisation les plus faibles de l’OCDE, environ 10 %. Mais l’engagement ne disparaît pas : il devient plus **ponctuel**, plus **distancié**, davantage centré sur des **causes** que sur des organisations, et il investit massivement le **numérique**. Ion parle de militantisme « **post-it** » : intense, court, renouvelable.

> Le recul des organisations n’est pas le recul de l’engagement. Confondre les deux est l’erreur d’interprétation la plus fréquente sur ce chapitre.`,
          },
          questions: [
            ['Qu’est-ce que le paradoxe de l’action collective d’Olson ?', ['L’individu rationnel a intérêt à ne pas participer, puisqu’il bénéficiera du résultat', 'Les groupes nombreux sont plus efficaces', 'L’action collective échoue toujours', 'Le vote est irrationnel'], 0, 'C’est le problème du passager clandestin.'],
            ['Qu’est-ce qu’une incitation sélective ?', ['Un avantage réservé aux seuls participants à l’action collective', 'Une prime versée par l’État', 'Un avantage fiscal pour les associations', 'Une réduction du temps de travail'], 0, 'Services syndicaux ou caisse de grève en sont des exemples.'],
            ['Que désignent les rétributions symboliques du militantisme ?', ['La sociabilité, la reconnaissance et l’estime de soi que procure l’engagement', 'Les indemnités versées aux élus', 'Les cotisations syndicales', 'Les subventions publiques aux partis'], 0, 'Concept développé par Daniel Gaxie.'],
            ['La France a l’un des taux de syndicalisation les plus élevés de l’OCDE.', ['Vrai', 'Faux'], 1, 'Il est au contraire l’un des plus faibles, autour de 10 %.'],
            ['Quel facteur augmente le plus nettement la probabilité de s’engager ?', ['Le niveau de diplôme', 'Le lieu de résidence', 'La taille du ménage', 'Le type de contrat de travail'], 0, 'Il joue sous toutes les formes d’engagement, du vote à la manifestation.'],
            ['Ceux qui manifestent sont généralement ceux qui votent le moins.', ['Vrai', 'Faux'], 1, 'Les répertoires se cumulent : ils ne se remplacent pas.'],
            ['Qu’appelle-t-on militantisme « post-it » ?', ['Un engagement intense, court et renouvelable, centré sur une cause', 'Le militantisme sur les réseaux sociaux uniquement', 'L’adhésion à un parti politique', 'Le vote systématique à chaque scrutin'], 0, 'Expression de Jacques Ion, qui décrit un engagement plus distancié.'],
            ['La consommation engagée est une forme d’engagement politique.', ['Vrai', 'Faux'], 0, 'Boycott et achat responsable en sont les deux faces.'],
          ],
        },
        {
          titre: 'L’évolution des formes de l’action collective',
          axe: 'Comment expliquer l’engagement politique dans les sociétés démocratiques ?',
          lecon: {
            titre: 'Des conflits du travail aux mouvements de société',
            cours: `L’action collective n’a pas disparu : elle a changé d’acteurs, d’objets et de moyens. Le chapitre suit ces trois déplacements.

## Le modèle du conflit du travail
Jusqu’aux années 1970, la forme dominante est le **conflit du travail** : des syndicats structurés, un adversaire identifié (l’employeur), un enjeu de répartition (salaires, temps de travail, conditions), un répertoire éprouvé (grève, occupation, négociation).

Le nombre de journées non travaillées pour fait de grève a fortement reculé depuis, mais les conflits se sont **individualisés** (recours prud’homaux) et **diversifiés** (débrayages courts, refus d’heures supplémentaires, absentéisme).

## Les nouveaux mouvements sociaux
À partir des années 1970, Touraine et d’autres identifient des mobilisations dont l’enjeu n’est plus principalement la répartition mais l’**identité**, les **droits** et le **mode de vie** : féminisme, écologie, antiracisme, droits des minorités sexuelles, régionalismes.

Leurs traits communs :
- des acteurs plus **diplômés**, souvent issus des classes moyennes ;
- des organisations plus **souples**, moins hiérarchiques ;
- un rapport privilégié aux **médias** ;
- un enjeu **post-matérialiste** (Inglehart) : une fois les besoins matériels assurés, les valeurs d’autonomie et d’expression prennent le pas.

## Les objets ne s’excluent pas
La lecture en « anciens » contre « nouveaux » mouvements est contestée : les mobilisations récentes mêlent souvent les deux registres. Les Gilets jaunes conjuguent une revendication de pouvoir d’achat (répartition) et une demande de reconnaissance (identité) ; les mobilisations climatiques articulent justice sociale et enjeu environnemental.

## Les acteurs et les répertoires
- les **syndicats** conservent la capacité de négocier, malgré une adhésion faible : leur audience se mesure aux élections professionnelles, non aux adhérents ;
- les **associations** et les **ONG** portent l’expertise et le contentieux — le recours au juge est devenu un répertoire à part entière (contentieux climatique) ;
- les **réseaux sociaux** abaissent le coût de la mobilisation, permettent des mouvements sans organisation formelle, mais rendent la durée et la représentation plus difficiles.

## Ce que le numérique change
Il accélère le déclenchement, élargit l’audience et permet la coordination sans structure. En retour, il fragilise la **négociation** : sans porte-parole légitime, un mouvement peut être massif et sans interlocuteur. Il expose aussi à la **dispersion** — beaucoup d’engagements de faible intensité (le *clicktivisme*).

> Le fil du chapitre : l’action collective se transforme au rythme des transformations de la société elle-même — de sa structure sociale, de ses valeurs et de ses techniques.`,
          },
          questions: [
            ['Qu’est-ce qui caractérise les nouveaux mouvements sociaux ?', ['Des enjeux d’identité, de droits et de mode de vie plutôt que de répartition', 'Une organisation syndicale très hiérarchisée', 'Un adversaire unique, l’employeur', 'Un recours exclusif à la grève'], 0, 'Féminisme, écologie, antiracisme et droits des minorités en relèvent.'],
            ['Que désigne le post-matérialisme d’Inglehart ?', ['La montée des valeurs d’autonomie et d’expression une fois les besoins matériels assurés', 'Le refus de la consommation', 'La disparition des inégalités matérielles', 'La croissance du secteur tertiaire'], 0, 'Il explique le déplacement des enjeux des mobilisations.'],
            ['L’audience des syndicats français se mesure principalement…', ['Aux élections professionnelles', 'Au nombre d’adhérents', 'Au nombre de grèves', 'Aux sondages d’opinion'], 0, 'Leur capacité de négociation excède largement leur taux d’adhésion.'],
            ['La distinction entre anciens et nouveaux mouvements sociaux est aujourd’hui contestée.', ['Vrai', 'Faux'], 0, 'Les mobilisations récentes mêlent souvent revendications matérielles et de reconnaissance.'],
            ['Quel effet le numérique a-t-il sur la mobilisation ?', ['Il abaisse le coût du déclenchement mais fragilise la négociation', 'Il augmente le nombre d’adhérents syndicaux', 'Il rend la grève plus efficace', 'Il n’a aucun effet mesurable'], 0, 'Sans porte-parole légitime, un mouvement peut être massif et sans interlocuteur.'],
            ['Le recours au juge est devenu un répertoire d’action collective à part entière.', ['Vrai', 'Faux'], 0, 'Le contentieux climatique en est l’exemple le plus visible.'],
            ['Qu’est-ce que le clicktivisme ?', ['Un engagement numérique nombreux mais de faible intensité', 'Le piratage de sites gouvernementaux', 'Le vote électronique', 'La collecte de dons en ligne'], 0, 'Il illustre la dispersion que permet l’abaissement du coût de l’engagement.'],
            ['Les conflits du travail ont totalement disparu en France.', ['Vrai', 'Faux'], 1, 'Ils se sont individualisés et diversifiés : débrayages courts, recours prud’homaux.'],
          ],
        },
        // ---- Chapitre 11 : inégalités et justice sociale ----------------------
        {
          titre: 'Des inégalités multiformes et cumulatives',
          axe: 'Quelles inégalités sont compatibles avec les différentes conceptions de la justice sociale ?',
          lecon: {
            titre: 'Une différence n’est pas une inégalité',
            cours: `Toute différence entre individus n’est pas une inégalité : il y a **inégalité** quand une différence se traduit par un accès inégal à des ressources **socialement valorisées**. Encore faut-il savoir lesquelles.

## Des inégalités économiques…
- de **revenu** : revenu d’activité, du patrimoine, de transfert. Le revenu **disponible** est ce qui reste après prélèvements et prestations ;
- de **patrimoine** : bien plus concentrées que celles de revenu. En France, les 10 % les mieux dotés détiennent environ la moitié du patrimoine total, les 50 % les moins dotés moins de 10 %.

## …aux inégalités sociales
Elles concernent l’accès à des ressources non monétaires :
- **santé** : l’écart d’espérance de vie à 35 ans entre un cadre et un ouvrier est d’environ six ans chez les hommes ;
- **éducation** : voir le chapitre 7 ;
- **logement** : surface, confort, exposition aux nuisances ;
- **loisirs et culture** : les pratiques les plus légitimes restent socialement très marquées ;
- **genre** : écart de rémunération, temps partiel subi, répartition du travail domestique.

## Le caractère cumulatif
Ces inégalités ne s’additionnent pas au hasard : elles se **renforcent**. Un faible capital culturel conduit à un diplôme plus court, donc à un emploi moins qualifié, donc à un revenu plus faible, donc à un logement moins bien situé, donc à une santé dégradée — et à la transmission de ce désavantage à la génération suivante. C’est le **cumul** qui fait le caractère structurel de l’inégalité.

Elles sont aussi **multiformes** : plusieurs dimensions peuvent se croiser sur une même personne (genre, origine, territoire, handicap), ce que l’on nomme l’**intersectionnalité**.

## Ce que les moyennes cachent
Un revenu **moyen** est tiré par les valeurs extrêmes ; le revenu **médian** partage la population en deux moitiés et décrit mieux le milieu de la distribution. C’est pourquoi le seuil de pauvreté se calcule à partir du médian (60 % du niveau de vie médian en France), et non de la moyenne.

## Inégalité n’est pas pauvreté
Deux notions distinctes :
- la **pauvreté absolue** : ne pas atteindre un panier de biens jugé vital ;
- la **pauvreté relative** : vivre trop en dessous du niveau habituel de sa société. C’est la mesure européenne.

Une société peut réduire la pauvreté et voir les inégalités augmenter, si le haut de la distribution progresse plus vite que le bas.

> Retenir la ligne : une inégalité se **constate** avec des données, elle se **juge** avec une conception de la justice. Le chapitre demande les deux, dans cet ordre.`,
          },
          questions: [
            ['Quand une différence devient-elle une inégalité ?', ['Quand elle se traduit par un accès inégal à des ressources socialement valorisées', 'Quand elle est mesurable', 'Quand elle concerne le revenu', 'Quand elle est jugée injuste'], 0, 'Toute différence n’est pas une inégalité, et toute inégalité n’est pas jugée injuste.'],
            ['Les inégalités de patrimoine sont-elles plus ou moins concentrées que celles de revenu ?', ['Bien plus concentrées', 'Bien moins concentrées', 'Identiques', 'Elles ne sont pas mesurables'], 0, 'Les 10 % les mieux dotés détiennent environ la moitié du patrimoine.'],
            ['À quoi correspond le seuil de pauvreté en France ?', ['60 % du niveau de vie médian', '50 % du revenu moyen', 'Le montant du SMIC', 'Le montant du RSA'], 0, 'Il repose sur la médiane, moins sensible aux valeurs extrêmes que la moyenne.'],
            ['Quelle est la différence entre pauvreté absolue et relative ?', ['L’absolue vise un panier de biens vitaux, la relative une distance au niveau de vie habituel', 'L’absolue concerne les pays pauvres uniquement', 'La relative est mesurée en revenu brut', 'Il n’y a aucune différence'], 0, 'L’Union européenne retient la pauvreté relative.'],
            ['Que signifie le caractère cumulatif des inégalités ?', ['Un désavantage en entraîne d’autres et se transmet', 'Les inégalités s’additionnent au hasard', 'Elles se compensent mutuellement', 'Elles disparaissent avec le temps'], 0, 'C’est ce cumul qui rend l’inégalité structurelle.'],
            ['L’écart d’espérance de vie à 35 ans entre cadres et ouvriers est d’environ…', ['Six ans chez les hommes', 'Un an', 'Quinze ans', 'Il est nul'], 0, 'C’est l’une des inégalités sociales les plus documentées.'],
            ['Une société peut réduire la pauvreté et voir les inégalités augmenter.', ['Vrai', 'Faux'], 0, 'Si le haut de la distribution progresse plus vite que le bas.'],
            ['Que désigne l’intersectionnalité ?', ['Le croisement de plusieurs dimensions d’inégalité sur une même personne', 'La comparaison entre pays', 'L’égalité entre secteurs d’activité', 'Le croisement de deux tables statistiques'], 0, 'Genre, origine, territoire et handicap peuvent se cumuler.'],
          ],
        },
        {
          titre: 'La mesure des inégalités économiques : une diversité d’outils',
          axe: 'Quelles inégalités sont compatibles avec les différentes conceptions de la justice sociale ?',
          lecon: {
            titre: 'Trois outils, trois questions différentes',
            cours: `Mesurer une inégalité, c’est choisir un outil — et chaque outil éclaire une facette différente de la distribution.

## Les quantiles et les rapports interdéciles
On ordonne la population par niveau de vie croissant et on la découpe :
- **déciles** : dix parts égales, séparées par D1 à D9 ;
- **quartiles**, **quintiles**, **centiles**.

Le **rapport interdécile D9/D1** compare le seuil au-dessus duquel se trouvent les 10 % les plus aisés à celui en dessous duquel se trouvent les 10 % les plus modestes. En France, il est d’environ 3,4 pour le niveau de vie après redistribution.

Attention à la formulation : D9 n’est pas « le revenu des 10 % les plus riches », c’est un **seuil**. La confusion coûte des points à chaque épreuve.

## La courbe de Lorenz et l’indice de Gini
La **courbe de Lorenz** représente la part cumulée du revenu total détenue par la part cumulée de la population, du plus modeste au plus aisé. L’égalité parfaite est la **diagonale** ; plus la courbe s’en écarte, plus la distribution est inégalitaire.

L’**indice de Gini** mesure cet écart : il vaut **0** en égalité parfaite et **1** quand une seule personne détient tout. Il synthétise l’ensemble de la distribution en un chiffre — sa force et sa faiblesse, puisque deux distributions très différentes peuvent avoir le même Gini.

## Les parts de masse
« Les 1 % les plus riches détiennent X % du revenu total » : cette mesure, popularisée par les travaux de Piketty et du *World Inequality Lab*, éclaire spécifiquement le **haut** de la distribution, que le Gini et le D9/D1 lissent.

## Avant ou après redistribution
Toute mesure doit préciser son périmètre :
- **revenu primaire** : ce que le marché distribue (activité, patrimoine) ;
- **revenu disponible** : après prélèvements et prestations.

En France, la redistribution réduit le rapport interdécile d’environ 22 à environ 3,4 : c’est l’un des systèmes les plus redistributifs de l’OCDE, et l’essentiel de l’effet vient des **prestations** (surtout familiales et logement) plus que de la progressivité de l’impôt.

## Ce qu’aucun indicateur ne dit
Ni le Gini ni le D9/D1 ne renseignent sur le **patrimoine**, sur la **mobilité** entre les positions, ni sur les inégalités non monétaires. Un pays très inégal mais très mobile n’a pas le même visage qu’un pays également inégal et figé.

> Choisir un indicateur, c’est déjà choisir ce dont on veut parler. Une bonne copie justifie son choix au lieu d’aligner les chiffres.`,
          },
          questions: [
            ['Que représente le rapport interdécile D9/D1 ?', ['Le rapport entre deux seuils de niveau de vie, celui des 10 % les plus aisés et celui des 10 % les plus modestes', 'Le rapport entre les revenus moyens des riches et des pauvres', 'La part du revenu des 10 % les plus riches', 'Le nombre de personnes pauvres'], 0, 'D9 et D1 sont des seuils, pas des revenus moyens : la confusion est très pénalisée.'],
            ['Que vaut l’indice de Gini en situation d’égalité parfaite ?', ['0', '1', '0,5', '100'], 0, 'Il vaut 1 quand une seule personne détient l’intégralité du revenu.'],
            ['Que représente la courbe de Lorenz ?', ['La part cumulée du revenu détenue par la part cumulée de la population', 'L’évolution du revenu dans le temps', 'La répartition par catégorie socioprofessionnelle', 'La relation entre revenu et diplôme'], 0, 'L’égalité parfaite y correspond à la diagonale.'],
            ['Deux distributions différentes peuvent avoir le même indice de Gini.', ['Vrai', 'Faux'], 0, 'C’est la limite d’un indicateur synthétique : il résume la distribution en un seul chiffre.'],
            ['Quelle mesure éclaire spécifiquement le haut de la distribution ?', ['La part de la masse totale détenue par les 1 % les plus riches', 'L’indice de Gini', 'Le rapport interdécile', 'Le seuil de pauvreté'], 0, 'Popularisée par les travaux de Piketty et du World Inequality Lab.'],
            ['Quelle est la différence entre revenu primaire et revenu disponible ?', ['Le disponible tient compte des prélèvements et des prestations', 'Le primaire inclut les revenus du patrimoine seulement', 'Le disponible exclut les salaires', 'Il n’y a aucune différence'], 0, 'Préciser le périmètre est indispensable pour interpréter un chiffre.'],
            ['En France, l’essentiel de l’effet redistributif vient de la progressivité de l’impôt.', ['Vrai', 'Faux'], 1, 'Il vient surtout des prestations, notamment familiales et de logement.'],
            ['L’indice de Gini renseigne sur la mobilité sociale d’un pays.', ['Vrai', 'Faux'], 1, 'Il décrit la distribution à un instant donné, pas la circulation entre positions.'],
          ],
        },
        {
          titre: 'Pouvoirs publics et justice sociale',
          axe: 'Quelles inégalités sont compatibles avec les différentes conceptions de la justice sociale ?',
          lecon: {
            titre: 'Quelle égalité vise-t-on, au juste ?',
            cours: `Une même donnée sur les inégalités appelle des conclusions opposées selon la conception de la justice qu’on retient. Le chapitre exige de les distinguer avant de juger.

## Trois conceptions de l’égalité
- l’**égalité des droits** : les mêmes règles pour tous, l’absence de discrimination. C’est le socle libéral ;
- l’**égalité des chances** : tous doivent partir avec les mêmes possibilités, quelles que soient leurs origines. Les positions inégales sont alors justes si la compétition l’était ;
- l’**égalité des situations** (ou des résultats) : viser une réduction des écarts eux-mêmes, et pas seulement des conditions d’accès.

Les trois ne sont pas compatibles entre elles : l’égalité des chances suppose des traitements **différenciés** (discrimination positive, éducation prioritaire), ce qui heurte l’égalité stricte des droits.

## Les théories de la justice
- **utilitarisme** (Bentham) : est juste ce qui maximise le bien-être total ;
- **libertarisme** (Nozick) : seule la légitimité du processus compte (acquisition et transfert justes) ; une redistribution imposée est une atteinte aux droits individuels ;
- **libéralisme égalitaire** (Rawls) : sous le **voile d’ignorance**, des individus rationnels choisiraient l’égale liberté, puis le **principe de différence** — les inégalités ne sont justes que si elles profitent aux plus défavorisés ;
- **approche par les capabilités** (Sen) : ce qui compte n’est pas la ressource mais la **liberté réelle** d’en faire quelque chose. Donner un vélo à qui ne sait pas en faire n’est pas donner la mobilité.

## Les instruments des pouvoirs publics
- la **fiscalité** : impôt progressif sur le revenu, imposition du patrimoine et des successions ;
- la **protection sociale** : assurance (chômage, retraite, maladie) et assistance (RSA, minima sociaux) ;
- les **services collectifs** : école, santé, transports — ils réduisent les inégalités de **niveau de vie réel** sans passer par le revenu, et représentent l’essentiel de la redistribution en nature ;
- la **lutte contre les discriminations** : sanctions, testings, obligations de résultats ;
- la **discrimination positive** : traitement préférentiel ciblé sur un territoire (éducation prioritaire) ou un groupe (quotas de femmes dans les conseils d’administration).

## Les limites et les effets pervers
- les **effets désincitatifs** supposés sur l’offre de travail et l’épargne, au cœur du débat sur la « trappe à inactivité » ;
- le **non-recours** : une part importante des ayants droit ne demandent pas les prestations auxquelles ils ont droit ;
- la **complexité** du système, qui rend les droits illisibles ;
- le **coût** et son financement, dans un contexte de contrainte budgétaire et de concurrence fiscale.

> La question du programme est bien « quelles inégalités sont **compatibles** avec quelle conception » — pas « les inégalités sont-elles justes ». Poser d’abord la conception, ensuite l’inégalité : l’ordre inverse produit une copie d’opinion.`,
          },
          questions: [
            ['Que défend l’égalité des chances ?', ['Que chacun parte avec les mêmes possibilités, quelles que soient ses origines', 'Que chacun obtienne le même revenu', 'Que les mêmes règles s’appliquent à tous', 'Que l’État ne redistribue pas'], 0, 'Les positions inégales sont alors jugées justes si la compétition l’était.'],
            ['Quel est le principe de différence de Rawls ?', ['Les inégalités ne sont justes que si elles profitent aux plus défavorisés', 'Toute inégalité est injuste', 'Le bien-être total doit être maximisé', 'La propriété est inviolable'], 0, 'Il est choisi sous le voile d’ignorance, qui masque sa future position sociale.'],
            ['Que privilégie l’approche par les capabilités de Sen ?', ['La liberté réelle de faire quelque chose de ses ressources', 'Le revenu monétaire', 'L’égalité stricte des situations', 'La maximisation du bien-être total'], 0, 'Donner un vélo à qui ne sait pas en faire n’est pas donner la mobilité.'],
            ['Selon Nozick, une redistribution imposée est légitime si elle réduit les inégalités.', ['Vrai', 'Faux'], 1, 'Pour le libertarisme, seule la légitimité du processus d’acquisition compte.'],
            ['Qu’est-ce que la redistribution en nature ?', ['L’accès gratuit ou subventionné aux services collectifs comme l’école et la santé', 'Le versement du RSA', 'La distribution de biens alimentaires', 'Les allocations familiales'], 0, 'Elle réduit les inégalités de niveau de vie réel sans passer par le revenu.'],
            ['Qu’appelle-t-on non-recours ?', ['Le fait que des ayants droit ne demandent pas les prestations auxquelles ils ont droit', 'Le refus d’un emploi proposé', 'L’absence de recours juridique', 'La suppression d’une prestation'], 0, 'Il limite fortement l’efficacité redistributive du système.'],
            ['L’égalité des chances peut supposer des traitements différenciés.', ['Vrai', 'Faux'], 0, 'Éducation prioritaire ou quotas heurtent l’égalité stricte des droits : c’est la tension du chapitre.'],
            ['Que vise l’utilitarisme de Bentham ?', ['Maximiser le bien-être total de la société', 'Protéger les droits de propriété', 'Améliorer le sort des plus défavorisés', 'Garantir l’égalité des résultats'], 0, 'Quitte à accepter des inégalités si le total y gagne.'],
          ],
        },
        // ---- Chapitre 12 : l'action publique pour l'environnement -------------
        {
          titre: 'Coopération et conflit dans la conduite de l’action publique pour l’environnement',
          axe: 'Quelle action publique pour l’environnement ?',
          lecon: {
            titre: 'Un bien commun que personne ne possède',
            cours: `Le climat est un **bien commun mondial** : nul ne peut en être exclu, et sa dégradation par les uns affecte tous les autres. Cette caractéristique explique pourquoi l’action publique y est si difficile.

## Le problème économique
Le climat est un bien **non excluable** (on ne peut empêcher personne d’en bénéficier) et **rival** dans sa dégradation (chaque émission réduit la capacité d’absorption disponible). D’où :
- la **tragédie des communs** (Hardin) : chacun a intérêt à surexploiter une ressource commune, et l’addition des comportements individuellement rationnels détruit la ressource ;
- le **passager clandestin** : à l’échelle internationale, un pays a intérêt à ce que les autres réduisent leurs émissions sans réduire les siennes.

Elinor Ostrom a nuancé ce pessimisme : elle a montré empiriquement que des communautés locales gèrent durablement des ressources communes, à condition de disposer de **règles**, de **sanctions graduées**, d’un **suivi** et de mécanismes de résolution des conflits.

## La pluralité des acteurs
L’action publique environnementale n’est pas le monopole des États. Y participent :
- les **pouvoirs publics** nationaux et locaux ;
- les **organisations internationales** (CCNUCC, GIEC — qui produit l’expertise sans décider) ;
- les **entreprises**, qui innovent, lobbyisent et s’engagent ;
- les **ONG**, qui alertent, expertisent et saisissent les tribunaux ;
- les **mouvements citoyens**, les scientifiques, les médias.

## La coopération internationale
- le **protocole de Kyoto** (1997) : des objectifs contraignants, mais pour les seuls pays développés, et sans les États-Unis ;
- l’**accord de Paris** (2015) : universel, avec un objectif commun (bien en dessous de 2 °C, en visant 1,5 °C), mais des engagements **nationaux volontaires** et non contraignants. La logique a changé : de la contrainte négociée vers l’engagement public et la pression par la transparence.

## Les conflits
Ils sont structurels, et le programme demande de les nommer :
- entre **pays développés et pays en développement** : responsabilité historique des émissions contre besoin de développement, d’où le principe des « responsabilités communes mais différenciées » et le financement climatique ;
- entre **générations** : le coût est immédiat, le bénéfice lointain ;
- entre **groupes sociaux** : une taxe carbone uniforme pèse davantage sur les ménages modestes et ruraux, plus dépendants de la voiture — c’est l’enjeu de justice qui a déclenché le mouvement des Gilets jaunes ;
- entre **échelles** : ce qui est décidé au niveau mondial doit être appliqué localement, par des acteurs qui n’ont pas participé à la décision.

> Une politique climatique efficace mais perçue comme injuste est politiquement intenable. C’est la leçon centrale de ce chapitre, et elle fait la jonction avec le chapitre sur la justice sociale.`,
          },
          questions: [
            ['Pourquoi le climat est-il qualifié de bien commun ?', ['Nul ne peut en être exclu, et sa dégradation affecte tout le monde', 'Il appartient aux États', 'Il est géré par l’ONU', 'Il est gratuit à produire'], 0, 'Non excluable, et rival dans sa dégradation.'],
            ['Qu’est-ce que la tragédie des communs ?', ['La destruction d’une ressource commune par l’addition de comportements individuellement rationnels', 'Une catastrophe naturelle', 'La faillite d’une entreprise publique', 'Un conflit entre États'], 0, 'Concept popularisé par Hardin, nuancé ensuite par Ostrom.'],
            ['Qu’a montré Elinor Ostrom ?', ['Des communautés locales peuvent gérer durablement une ressource commune avec des règles et un suivi', 'La privatisation est la seule solution', 'L’État doit tout gérer', 'La tragédie des communs est inévitable'], 0, 'Règles, sanctions graduées, suivi et résolution des conflits en sont les conditions.'],
            ['Quelle est la différence majeure entre le protocole de Kyoto et l’accord de Paris ?', ['Kyoto imposait des objectifs contraignants à quelques pays, Paris repose sur des engagements volontaires universels', 'Paris est contraignant, Kyoto ne l’était pas', 'Kyoto concernait tous les pays', 'Paris ne fixe aucun objectif'], 0, 'La logique passe de la contrainte négociée à la transparence et à la pression par les pairs.'],
            ['Quel est le rôle du GIEC ?', ['Produire et synthétiser l’expertise scientifique, sans pouvoir de décision', 'Fixer les objectifs contraignants de réduction', 'Sanctionner les États pollueurs', 'Financer la transition des pays pauvres'], 0, 'Les décisions relèvent des conférences des parties de la CCNUCC.'],
            ['Une taxe carbone uniforme pèse proportionnellement davantage sur les ménages modestes.', ['Vrai', 'Faux'], 0, 'Ils sont plus dépendants de la voiture et consacrent une part plus grande de leur revenu à l’énergie.'],
            ['Que désigne le principe des « responsabilités communes mais différenciées » ?', ['Tous les pays sont concernés, mais les développés portent une responsabilité historique plus grande', 'Chaque pays fixe librement ses objectifs', 'Seuls les pays pollueurs agissent', 'Les entreprises sont responsables, pas les États'], 0, 'Il fonde le financement climatique vers les pays en développement.'],
            ['Une politique climatique efficace est nécessairement acceptée socialement.', ['Vrai', 'Faux'], 1, 'Une politique perçue comme injuste est politiquement intenable, quelle que soit son efficacité.'],
          ],
        },
        {
          titre: 'Les principaux instruments des politiques climatiques',
          axe: 'Quelle action publique pour l’environnement ?',
          lecon: {
            titre: 'Interdire, taxer, ou faire payer le droit de polluer',
            cours: `Le programme retient **trois familles d’instruments**, dont il faut connaître le mécanisme, l’avantage et la limite. Ils ne s’excluent pas : les politiques réelles les combinent.

## La réglementation
Interdictions, normes, quotas, seuils : interdiction des ampoules à incandescence, normes d’émission des véhicules, obligations d’isolation, zones à faibles émissions.

- **avantage** : effet direct, prévisible, immédiatement lisible, et le seul instrument possible quand le risque est grave et irréversible (amiante, CFC) ;
- **limite** : rigidité et **coût inefficace** — la norme impose le même effort à tous, y compris à ceux pour qui il coûte très cher, alors qu’un autre acteur aurait pu réduire davantage à moindre coût. Elle n’incite pas non plus à faire **mieux** que la norme.

Le **protocole de Montréal** (1987), qui a interdit les CFC et permis la reconstitution de la couche d’ozone, reste l’exemple d’une réglementation internationale réussie.

## La taxation
Faire payer l’émission pour internaliser l’**externalité négative** : c’est la **taxe pigouvienne**, qui doit en principe égaler le dommage marginal causé.

- **avantage** : elle laisse chacun libre de son moyen d’adaptation, elle incite à réduire **au-delà** du minimum, elle rapporte des recettes qui peuvent être redistribuées (« dividende carbone ») ;
- **limite** : son effet dépend de l’**élasticité-prix** de la demande — si aucune alternative n’existe, la taxe pèse sans réduire les émissions ; elle est **régressive** sans compensation ; et le prix qui déclenche le changement est difficile à fixer.

## Le marché de quotas d’émission
L’autorité fixe un **plafond global** d’émissions, distribue ou vend des quotas, et laisse les acteurs les **échanger**. C’est le **marché carbone européen** (SEQE-UE), en place depuis 2005.

- **avantage** : la quantité totale est **garantie** par le plafond, et l’échange fait porter la réduction par ceux qui la réalisent au moindre coût ;
- **limite** : le prix est **volatil** ; un plafond fixé trop haut ou des quotas distribués gratuitement effondrent le prix — ce fut le cas en Europe jusqu’à la réforme de la réserve de stabilité.

## Taxe ou marché ?
La différence tient à ce que l’on choisit de fixer : la **taxe fixe le prix** et laisse la quantité s’ajuster ; le **marché fixe la quantité** et laisse le prix s’ajuster. En situation d’incertitude, ce choix n’est pas neutre.

## Ce qui les complète
La **subvention** à l’innovation verte et aux alternatives (rénovation, transport public), l’**information** (étiquette énergie, affichage carbone) et la **commande publique**. Aucun instrument ne suffit seul : la taxe n’a d’effet que si une alternative existe, ce qui suppose des investissements publics.

> La question d’examen porte presque toujours sur la comparaison **efficacité / équité / acceptabilité**. Traiter les trois, avec un exemple daté par instrument, suffit à faire une bonne copie.`,
          },
          questions: [
            ['Quels sont les trois grands instruments des politiques climatiques au programme ?', ['La réglementation, la taxation et le marché de quotas d’émission', 'L’impôt, la subvention et l’emprunt', 'La norme, la sanction pénale et la propagande', 'La recherche, l’éducation et le commerce'], 0, 'Les politiques réelles les combinent plutôt qu’elles ne les opposent.'],
            ['Qu’est-ce qu’une taxe pigouvienne ?', ['Une taxe qui internalise l’externalité négative en la faisant payer au pollueur', 'Un impôt sur les bénéfices des industriels', 'Une taxe sur les importations polluantes', 'Une taxe affectée à la recherche'], 0, 'Elle doit en principe égaler le dommage marginal causé.'],
            ['Que garantit un marché de quotas d’émission ?', ['La quantité totale d’émissions, fixée par le plafond', 'Le prix du carbone', 'La réduction des inégalités', 'Le niveau des recettes publiques'], 0, 'Le prix, lui, s’ajuste — et peut être très volatil.'],
            ['Quelle est la différence de principe entre taxe et marché de quotas ?', ['La taxe fixe le prix, le marché fixe la quantité', 'La taxe fixe la quantité, le marché fixe le prix', 'Les deux fixent le prix', 'Les deux fixent la quantité'], 0, 'En situation d’incertitude, ce choix n’est pas neutre.'],
            ['Quelle est la principale limite de la réglementation ?', ['Elle impose le même effort à tous, sans tenir compte du coût de réduction de chacun', 'Elle est trop lente à décider', 'Elle rapporte trop peu de recettes', 'Elle est toujours inefficace'], 0, 'Elle n’incite pas non plus à faire mieux que la norme.'],
            ['Le protocole de Montréal a permis la reconstitution de la couche d’ozone.', ['Vrai', 'Faux'], 0, 'Signé en 1987, il reste l’exemple d’une réglementation internationale réussie.'],
            ['De quoi dépend l’efficacité d’une taxe carbone ?', ['De l’élasticité-prix de la demande, donc de l’existence d’alternatives', 'Du nombre de contribuables', 'Du taux d’inflation', 'De la croissance du PIB'], 0, 'Sans alternative, la taxe pèse sans réduire les émissions.'],
            ['Un marché carbone dont le plafond est fixé trop haut voit le prix du quota s’effondrer.', ['Vrai', 'Faux'], 0, 'Ce fut le cas en Europe avant la mise en place de la réserve de stabilité.'],
          ],
        },
      ],
    },
  ],
}
