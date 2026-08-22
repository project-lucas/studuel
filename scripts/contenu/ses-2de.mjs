// Sciences économiques et sociales — Seconde : LE PROGRAMME COMPLET (23 fiches).
//
// CE QUE REMPLACE CE MODULE. La 2de n'avait que QUATRE chapitres de SES,
// hérités du tout premier jeu de données (migration 008, contenu rempli par la
// 128) : « Comment raisonnent les économistes ? », « La production », « Comment
// se forment les prix ? », « La socialisation ». Quatre titres pour un
// programme qui en compte SIX, et rien sur la vie politique, le diplôme,
// l'emploi ni le salaire — soit un tiers de l'année.
//
// LE DÉCOUPAGE. Les 6 chapitres du programme, éclatés en leurs 23 fiches.
// Chaque fiche est un chapitre en base ; le CHAPITRE du programme est porté par
// `axe` (colonne `chapters.theme`), qui fait grouper la page matière — cf.
// docs/template-matiere.md. Les SES n'ont qu'un seul rayon : pas de `rayon`
// ici, la page garde un onglet Programme unique (contrairement à l'histoire-géo
// et au français).
//
// LES QUATRE ANCIENS PARTENT (voir `menage`). Trois d'entre eux sont
// littéralement des CHAPITRES du programme reformulés (« Comment raisonnent les
// économistes ? », « Comment se forment les prix ? », « La socialisation ») :
// les laisser en base ferait deux objets du même nom à deux places
// différentes. Le ménage est borné à leurs quatre titres exacts et au seul
// niveau 2de — rejoué, il ne trouve plus rien et ne touche jamais les 23 fiches
// neuves.

export default {
  slug: 'ses',
  nom: 'SES',

  titreMigration: 'SES 2de — LE PROGRAMME COMPLET (23 fiches)',

  motif: `CONSTAT : la Seconde n'avait que QUATRE chapitres de SES, hérités du
premier jeu de données de l'app, avec deux leçons génériques chacun. Le
programme officiel en compte SIX — les trois regards des sciences sociales, la
production et sa mesure, le marché, la socialisation, la vie politique, et les
relations entre diplôme, emploi et salaire — soit 23 fiches. Un élève de 2de
qui révisait le PIB, la croissance et ses limites écologiques, la Ve
République, les modes de scrutin, le capital humain ou les inégalités de
salaire ne trouvait RIEN. Cette migration installe les 23 fiches, rangées sous
leurs 6 chapitres, et retire les 4 fiches génériques que ce découpage recouvre.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 23 fiches sous 6 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas
garantir que la 234 soit passée en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 4 anciens chapitres
déjà supprimés et les 23 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 chapitres hérités partent. Trois d'entre eux sont des CHAPITRES du
programme reformulés ("Comment raisonnent les économistes ?", "Comment se
forment les prix ?", "La socialisation") : les garder en base ferait deux objets
du même nom à deux places différentes, un en-tête de section et une ligne dans
la liste. Le quatrième ("La production") est une fiche de synthèse que les six
fiches du chapitre 2 recouvrent entièrement.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.
Les trois DELETE sont bornés aux QUATRE TITRES EXACTS et au seul niveau 2de.
Sans cette borne, un rejeu après coup effacerait les quiz des 23 fiches neuves —
le ménage tourne avant les insertions à CHAQUE passage.`,
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
   AND c.level = '2de'
   AND c.title IN ('Comment raisonnent les économistes ?',
                   'La production',
                   'Comment se forment les prix ?',
                   'La socialisation');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'ses'
   AND c.level = '2de'
   AND c.title IN ('Comment raisonnent les économistes ?',
                   'La production',
                   'Comment se forment les prix ?',
                   'La socialisation');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'ses'
   AND c.level = '2de'
   AND c.title IN ('Comment raisonnent les économistes ?',
                   'La production',
                   'Comment se forment les prix ?',
                   'La socialisation');`,
    },
  ],

  blocs: [
    {
      niveaux: ['2de'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : les trois regards
        // ===================================================================
        {
          titre: 'Les principes de base de l’économie',
          axe: 'Comment les économistes, les sociologues et les politistes raisonnent-ils et travaillent-ils ?',
          lecon: {
            titre: 'Des besoins illimités, des ressources qui ne le sont pas',
            cours: `L’économie commence par un constat simple : nos besoins sont sans limite, les ressources disponibles ne le sont pas. Toute la discipline découle de cette **rareté**.

## Choisir, c’est renoncer
Comme les ressources sont rares, tout choix a un **coût d’opportunité** : ce à quoi on renonce en choisissant. Une heure passée à réviser est une heure qui n’est pas passée à travailler, et réciproquement. Les agents économiques sont supposés comparer les avantages et les coûts avant de décider.

## Les agents et le circuit
Les **ménages** consomment et fournissent du travail ; les **entreprises** produisent ; les **administrations publiques** produisent des services non marchands et redistribuent ; les banques financent ; le reste du monde échange. Ces agents sont reliés par des flux réels (biens, services, travail) et des flux monétaires qui vont en sens inverse : c’est le **circuit économique**.

> Une économie, ce n’est pas une addition de décisions isolées : c’est un système où la dépense de l’un est le revenu de l’autre.

## Les trois grandes questions
Que produire ? Comment produire ? Pour qui produire ? Selon les sociétés, la réponse vient du **marché**, de l’**État**, ou d’une combinaison des deux — c’est le cas de toutes les économies réelles, dites **mixtes**.

## Comment travaille l’économiste
Il construit des **modèles**, c’est-à-dire des représentations simplifiées de la réalité, formule des hypothèses, puis les confronte à des données statistiques. Il ne peut presque jamais faire d’expérience en laboratoire : il compare des situations, des pays et des périodes.`,
          },
          questions: [
            ['Qu’est-ce que la rareté en économie ?', ['Le fait que les ressources soient limitées face à des besoins illimités', 'La cherté d’un produit de luxe', 'La faiblesse de la production agricole', 'L’absence de concurrence'], 0, 'C’est le point de départ de toute la discipline.'],
            ['Qu’est-ce que le coût d’opportunité ?', ['Ce à quoi on renonce en faisant un choix', 'Le prix payé pour un bien', 'Le coût de production d’une entreprise', 'Une taxe sur les échanges'], 0, 'Choisir, c’est toujours renoncer à autre chose.'],
            ['Quels agents fournissent du travail et consomment ?', ['Les ménages', 'Les entreprises', 'Les administrations publiques', 'Les banques'], 0, 'Ils reçoivent des revenus et les dépensent.'],
            ['Dans le circuit économique, les flux monétaires vont dans quel sens ?', ['En sens inverse des flux réels', 'Dans le même sens que les flux réels', 'Toujours vers les ménages', 'Uniquement vers l’État'], 0, 'À un bien qui circule correspond un paiement en retour.'],
            ['Quelles sont les trois grandes questions de l’économie ?', ['Que produire, comment produire, pour qui produire', 'Combien vendre, à qui, à quel prix', 'Épargner, investir, consommer', 'Produire, échanger, taxer'], 0, 'Les sociétés y répondent par le marché, l’État, ou les deux.'],
            ['Une économie mixte associe marché et intervention publique.', ['Vrai', 'Faux'], 0, 'Toutes les économies réelles sont mixtes, à des degrés différents.'],
            ['Qu’est-ce qu’un modèle économique ?', ['Une représentation simplifiée de la réalité, fondée sur des hypothèses', 'Une entreprise qui réussit', 'Un plan de production', 'Une prévision certaine'], 0, 'Il se juge à sa capacité à expliquer les faits observés.'],
            ['Pourquoi l’économiste peut-il rarement faire des expériences ?', ['Parce qu’il étudie des sociétés entières, qu’on ne peut pas mettre en laboratoire', 'Parce que les données n’existent pas', 'Parce que c’est interdit par la loi', 'Parce que les modèles suffisent'], 0, 'Il compare donc des pays, des périodes et des situations.'],
          ],
        },
        {
          titre: 'Introduction à la sociologie',
          axe: 'Comment les économistes, les sociologues et les politistes raisonnent-ils et travaillent-ils ?',
          lecon: {
            titre: 'Ce que la société fait à nos choix',
            cours: `La sociologie part d’une idée dérangeante : ce que nous croyons choisir librement — nos goûts, nos amis, notre métier — dépend largement de notre position dans la société.

## L’objet
Le sociologue étudie les **faits sociaux** : des manières d’agir, de penser et de sentir extérieures à l’individu et dotées d’un pouvoir de contrainte, selon la formule d’**Émile Durkheim**. Le suicide, en apparence l’acte le plus intime, varie régulièrement selon la religion, le statut familial ou la période : c’est bien un fait social.

## Les grands regards
**Durkheim** insiste sur la contrainte sociale et l’intégration ; **Max Weber** part du sens que les individus donnent à leur action ; **Pierre Bourdieu** montre comment les héritages culturels reproduisent les positions sociales. Deux approches se répondent : le **holisme**, qui explique par le tout, et l’**individualisme méthodologique**, qui explique par l’agrégation des actions individuelles.

> Rompre avec les prénotions, c’est refuser d’expliquer un fait social par « les gens sont comme ça ».

## La méthode
Le sociologue **rompt avec le sens commun**, construit son objet, puis recueille des données. Les **méthodes quantitatives** (questionnaires, statistiques publiques, enquêtes de l’Insee) mesurent et comparent. Les **méthodes qualitatives** (entretiens, observation, parfois participante) comprennent les logiques d’action.

## Un exemple
Deux élèves aux résultats identiques ne choisissent pas la même orientation selon le métier de leurs parents. Corrélation n’est pas causalité : il faut identifier les mécanismes — information disponible, coût perçu des études, autocensure, conseils reçus.`,
          },
          questions: [
            ['Comment Durkheim définit-il un fait social ?', ['Une manière d’agir extérieure à l’individu et qui exerce une contrainte', 'Une opinion partagée par la majorité', 'Un événement historique marquant', 'Une décision politique'], 0, 'Le fait social se reconnaît à sa régularité et à sa contrainte.'],
            ['Quelle étude de Durkheim montre qu’un acte intime est un fait social ?', ['Son étude sur le suicide', 'Son étude sur le travail industriel', 'Son étude sur la ville', 'Son étude sur les partis politiques'], 0, 'Les taux varient régulièrement selon la religion ou le statut familial.'],
            ['Que privilégie Max Weber dans l’analyse sociologique ?', ['Le sens que les individus donnent à leur action', 'La contrainte du groupe', 'Les statistiques nationales', 'Les institutions politiques'], 0, 'C’est la sociologie compréhensive.'],
            ['Qu’est-ce que l’individualisme méthodologique ?', ['Expliquer les faits sociaux par l’agrégation des actions individuelles', 'Étudier les individus isolés', 'Refuser toute enquête statistique', 'Privilégier le rôle de l’État'], 0, 'Il s’oppose au holisme, qui explique par le tout social.'],
            ['Qu’appelle-t-on rompre avec les prénotions ?', ['Se défaire des idées reçues avant d’analyser', 'Refuser les entretiens', 'Ignorer les statistiques', 'Changer de sujet d’enquête'], 0, 'Le sens commun n’est pas une explication.'],
            ['Un entretien approfondi relève d’une méthode qualitative.', ['Vrai', 'Faux'], 0, 'Il cherche à comprendre des logiques, pas à mesurer une fréquence.'],
            ['Quel organisme public produit l’essentiel des statistiques sociales en France ?', ['L’Insee', 'La Banque de France', 'Le Conseil constitutionnel', 'L’Ademe'], 0, 'Recensement, enquêtes emploi, revenus, conditions de vie.'],
            ['Une corrélation entre deux variables prouve-t-elle une causalité ?', ['Non, il faut identifier le mécanisme qui les relie', 'Oui, toujours', 'Oui, si elle est forte', 'Non, une corrélation est une erreur'], 0, 'Deux variables peuvent varier ensemble sans que l’une cause l’autre.'],
          ],
        },
        {
          titre: 'Introduction aux sciences politiques',
          axe: 'Comment les économistes, les sociologues et les politistes raisonnent-ils et travaillent-ils ?',
          lecon: {
            titre: 'Qui décide, comment, et avec quelle légitimité',
            cours: `La science politique étudie le **pouvoir** : comment il s’acquiert, s’exerce, se conteste. Elle observe les institutions, mais aussi les comportements — voter, militer, manifester, s’abstenir.

## Le pouvoir et sa légitimité
Le pouvoir est la capacité d’obtenir d’autrui un comportement qu’il n’aurait pas eu spontanément. **Max Weber** distingue trois types de **domination légitime** : traditionnelle (la coutume, l’hérédité), charismatique (les qualités exceptionnelles prêtées à une personne), et **légale-rationnelle** (la règle écrite, la compétence, le concours) — la forme dominante dans les États modernes.

## L’État
Weber le définit comme la communauté humaine qui revendique avec succès le **monopole de la violence physique légitime** sur un territoire donné. Il suppose un territoire, une population, une administration et une souveraineté.

> Obéir à un chef parce qu’il est né chef, parce qu’il fascine, ou parce que la loi l’a désigné : trois mondes politiques différents.

## Les objets du politiste
Les institutions et la Constitution, les partis, les élections et la **sociologie électorale**, l’opinion publique et les sondages, les mobilisations, les politiques publiques. Un même vote s’explique par des variables lourdes — âge, diplôme, profession, territoire, religion — et par la conjoncture.

## La méthode
Comme le sociologue, le politiste croise enquêtes quantitatives (résultats électoraux, sondages, panels) et travail qualitatif (entretiens avec des élus, observation de campagnes, archives). Il se méfie des sondages lus comme des prédictions : ce sont des estimations, assorties d’une marge d’erreur.`,
          },
          questions: [
            ['Comment Weber définit-il l’État ?', ['La communauté qui détient le monopole de la violence physique légitime sur un territoire', 'L’ensemble des fonctionnaires', 'Le gouvernement en exercice', 'La nation'], 0, 'Territoire, population, administration et souveraineté.'],
            ['Quels sont les trois types de domination légitime selon Weber ?', ['Traditionnelle, charismatique et légale-rationnelle', 'Directe, indirecte et déléguée', 'Locale, nationale et internationale', 'Militaire, religieuse et économique'], 0, 'La forme légale-rationnelle domine dans les États modernes.'],
            ['Sur quoi repose la domination légale-rationnelle ?', ['Sur la règle écrite et la compétence', 'Sur la coutume', 'Sur le charisme du chef', 'Sur la force armée'], 0, 'On obéit à la fonction, pas à la personne.'],
            ['Qu’étudie la sociologie électorale ?', ['Les déterminants sociaux du vote', 'Le droit constitutionnel', 'Le financement des partis', 'Les relations internationales'], 0, 'Âge, diplôme, profession, territoire, religion.'],
            ['Un sondage est-il une prédiction du résultat d’une élection ?', ['Non, c’est une estimation assortie d’une marge d’erreur', 'Oui, s’il est bien fait', 'Oui, à la veille du scrutin', 'Non, c’est un simple sondage d’opinion sans valeur'], 0, 'Il photographie un moment, il ne prédit pas.'],
            ['Le pouvoir se définit comme la capacité d’obtenir d’autrui un comportement qu’il n’aurait pas eu spontanément.', ['Vrai', 'Faux'], 0, 'Cette définition vaut au-delà du seul champ politique.'],
            ['Quelles méthodes le politiste utilise-t-il ?', ['Des méthodes quantitatives et qualitatives, comme le sociologue', 'Uniquement le droit constitutionnel', 'Uniquement les sondages', 'Uniquement les archives'], 0, 'Résultats électoraux, entretiens, observation de campagnes.'],
            ['L’abstention est-elle un objet d’étude de la science politique ?', ['Oui, c’est un comportement politique à part entière', 'Non, c’est une absence de comportement', 'Non, elle n’est pas mesurable', 'Oui, mais seulement en période de crise'], 0, 'Elle varie fortement selon l’âge, le diplôme et le type d’élection.'],
          ],
        },

        // ===================================================================
        // Chapitre 2 : la production et sa mesure
        // ===================================================================
        {
          titre: 'Une diversité d’organisations productives',
          axe: 'Comment crée-t-on des richesses et comment les mesure-t-on ?',
          lecon: {
            titre: 'Qui produit, et dans quel but',
            cours: `Produire, ce n’est pas seulement fabriquer des objets dans une usine. C’est combiner des ressources pour créer des biens ou des services — et cela se fait dans des organisations très différentes.

## Trois types de producteurs
Les **entreprises privées** produisent des biens et services **marchands**, vendus à un prix couvrant au moins le coût de production, dans le but de faire du **profit**. Les **administrations publiques** produisent des services **non marchands**, gratuits ou quasi gratuits, financés par l’impôt : école, justice, police, une grande partie de la santé. Les **associations** et organisations à but non lucratif produisent aussi, sans redistribuer de bénéfices.

## Marchand et non marchand
Le critère retenu par la comptabilité nationale est simple : un service est non marchand quand il est fourni gratuitement ou à un prix inférieur à la moitié de son coût de production.

> L’heure de cours d’un professeur n’a pas de prix de marché. Elle est pourtant une production, et elle est comptée dans le PIB.

## La diversité des entreprises
Par la **taille** : microentreprises, PME, entreprises de taille intermédiaire, grandes entreprises. Par le **secteur** : primaire (agriculture, mines), secondaire (industrie, construction), tertiaire (services). Par le **statut juridique** : entreprise individuelle, société, coopérative. Les très petites entreprises sont les plus nombreuses ; les grandes concentrent l’essentiel du chiffre d’affaires.

## L’économie sociale et solidaire
Coopératives, mutuelles, associations, fondations : elles emploient environ un salarié privé sur dix en France. Leur particularité est la gouvernance — une personne, une voix dans les coopératives — et la limitation du partage des bénéfices.`,
          },
          questions: [
            ['Quel est le but principal d’une entreprise privée ?', ['Réaliser un profit en vendant sa production', 'Fournir un service gratuit', 'Redistribuer les revenus', 'Employer le plus de personnes possible'], 0, 'Elle produit des biens et services marchands.'],
            ['Qu’est-ce qu’un service non marchand ?', ['Un service fourni gratuitement ou à un prix inférieur à la moitié de son coût', 'Un service vendu à perte', 'Un service rendu par une association uniquement', 'Un service exporté'], 0, 'École, justice, police : financés par l’impôt.'],
            ['La production non marchande est-elle comptée dans le PIB ?', ['Oui, évaluée à son coût de production', 'Non, elle n’a pas de prix', 'Oui, à sa valeur de marché', 'Non, sauf pour la santé'], 0, 'On l’évalue par ce qu’elle coûte, faute de prix de marché.'],
            ['Quel secteur regroupe les services ?', ['Le secteur tertiaire', 'Le secteur primaire', 'Le secteur secondaire', 'Le secteur quaternaire'], 0, 'Il représente aujourd’hui l’essentiel de l’emploi en France.'],
            ['Quelle catégorie d’entreprises est la plus nombreuse en France ?', ['Les microentreprises', 'Les grandes entreprises', 'Les entreprises de taille intermédiaire', 'Les coopératives'], 0, 'Les grandes entreprises concentrent en revanche l’essentiel du chiffre d’affaires.'],
            ['Dans une coopérative, chaque associé dispose d’une voix quelle que soit sa part de capital.', ['Vrai', 'Faux'], 0, 'Une personne, une voix : c’est le principe coopératif.'],
            ['Que regroupe l’économie sociale et solidaire ?', ['Coopératives, mutuelles, associations et fondations', 'Les seules entreprises publiques', 'Les entreprises exportatrices', 'Les administrations de l’État'], 0, 'Environ un salarié privé sur dix en France.'],
            ['Qu’est-ce que produire, en économie ?', ['Combiner des ressources pour créer des biens ou des services', 'Fabriquer des objets matériels', 'Vendre des marchandises', 'Employer des salariés'], 0, 'Les services sont une production au même titre que les biens.'],
          ],
        },
        {
          titre: 'Les différents facteurs de production',
          axe: 'Comment crée-t-on des richesses et comment les mesure-t-on ?',
          lecon: {
            titre: 'Travail, capital, et la manière de les combiner',
            cours: `Toute production suppose des **facteurs de production** : ce que l’on met en œuvre pour produire. On en distingue traditionnellement deux, auxquels s’ajoutent des ressources naturelles de plus en plus contraintes.

## Le travail
C’est l’activité humaine, physique et intellectuelle, mise au service de la production. On le mesure en nombre d’actifs occupés ou en heures travaillées. Sa qualité dépend de la formation, de l’expérience et de la santé : c’est le **capital humain**.

## Le capital
Le **capital fixe** est l’ensemble des biens durables utilisés plus d’un an : machines, bâtiments, logiciels, véhicules. Il s’use et se déprécie, d’où l’amortissement. Le **capital circulant** — matières premières, énergie, consommations intermédiaires — est détruit ou transformé au cours de la production.

> Une entreprise ne choisit pas seulement combien produire : elle choisit avec quoi. Remplacer des heures de travail par une machine est une décision économique.

## Combiner les facteurs
La **combinaison productive** peut être plus **intensive en travail** ou plus **intensive en capital**. Elle dépend du coût relatif des facteurs, de la technologie disponible et de la nature du produit. Une même production peut se faire de plusieurs façons : c’est ce qu’on appelle la **substituabilité** des facteurs ; quand ils doivent aller ensemble, ils sont **complémentaires**.

## La productivité
La **productivité du travail** rapporte la production à la quantité de travail utilisée (par tête ou par heure). Elle augmente grâce au progrès technique, à la formation, à l’organisation du travail et à la division des tâches. Ses gains permettent de baisser les prix, d’augmenter les salaires, les profits, ou de réduire le temps de travail.`,
          },
          questions: [
            ['Quels sont les deux principaux facteurs de production ?', ['Le travail et le capital', 'Le capital et la monnaie', 'Le travail et la terre uniquement', 'Le profit et le salaire'], 0, 'Auxquels s’ajoutent des ressources naturelles.'],
            ['Qu’est-ce que le capital fixe ?', ['Les biens durables utilisés plus d’un an dans la production', 'Les matières premières consommées', 'L’argent en caisse', 'Les stocks de produits finis'], 0, 'Machines, bâtiments, logiciels : ils s’usent et s’amortissent.'],
            ['Qu’est-ce que le capital humain ?', ['L’ensemble des savoirs et compétences qui rendent le travail plus productif', 'Le nombre de salariés d’une entreprise', 'La masse salariale', 'Le capital détenu par les ménages'], 0, 'Formation, expérience et santé en font partie.'],
            ['Comment mesure-t-on la productivité du travail ?', ['En rapportant la production à la quantité de travail utilisée', 'En divisant le profit par le capital', 'En comptant les salariés', 'En mesurant le chiffre d’affaires'], 0, 'Par tête ou, plus finement, par heure travaillée.'],
            ['Que signifie que deux facteurs sont substituables ?', ['On peut remplacer l’un par l’autre pour produire la même chose', 'Ils doivent être utilisés ensemble', 'Ils ont le même coût', 'Ils appartiennent au même propriétaire'], 0, 'Remplacer du travail par des machines en est l’exemple type.'],
            ['Les consommations intermédiaires font partie du capital circulant.', ['Vrai', 'Faux'], 0, 'Elles sont détruites ou transformées au cours de la production.'],
            ['Qu’est-ce qui explique les gains de productivité ?', ['Le progrès technique, la formation et l’organisation du travail', 'La hausse des prix', 'L’augmentation du nombre d’heures travaillées', 'La croissance de la population'], 0, 'Produire plus avec autant, ou autant avec moins.'],
            ['À quoi peuvent servir les gains de productivité ?', ['À baisser les prix, augmenter les salaires ou les profits, réduire le temps de travail', 'Uniquement à augmenter les profits', 'Uniquement à embaucher', 'À rien, ils sont automatiquement perdus'], 0, 'Leur partage est un enjeu de conflit social.'],
          ],
        },
        {
          titre: 'La mesure des richesses produites : l’exemple d’une entreprise',
          axe: 'Comment crée-t-on des richesses et comment les mesure-t-on ?',
          lecon: {
            titre: 'Chiffre d’affaires n’est pas richesse créée',
            cours: `Une entreprise qui vend pour un million d’euros n’a pas créé un million de richesse : elle a acheté à d’autres une partie de ce qu’elle vend. La richesse qu’elle crée vraiment s’appelle la **valeur ajoutée**.

## Du chiffre d’affaires à la valeur ajoutée
Le **chiffre d’affaires** est le total des ventes. Les **consommations intermédiaires** sont les biens et services achetés à d’autres entreprises et détruits ou transformés dans la production : matières premières, énergie, transport, services d’entretien.

**Valeur ajoutée = chiffre d’affaires − consommations intermédiaires.**

## Un exemple chiffré
Une boulangerie vend pour 300 000 euros de pain par an. Elle achète 90 000 euros de farine, de levure et d’énergie. Sa valeur ajoutée est de 210 000 euros : c’est ce que son travail et ses machines ont ajouté à ce qu’elle a acheté.

> Additionner les chiffres d’affaires de toutes les entreprises compterait la farine plusieurs fois. Additionner les valeurs ajoutées, non.

## Le partage de la valeur ajoutée
Elle se répartit entre les **salaires et cotisations** versés aux salariés, les **impôts** liés à la production, les **intérêts** versés aux prêteurs, les **dividendes** versés aux propriétaires, et ce qui reste pour **investir** — l’autofinancement. Ce partage est un enjeu de conflit permanent.

## Pourquoi cet indicateur compte
La valeur ajoutée sert à mesurer la contribution réelle de chaque entreprise à la production nationale. Sa somme, pour toutes les unités productives d’un pays, est la base du calcul du **PIB**. La TVA, elle, porte son nom : c’est une taxe assise sur cette valeur ajoutée.`,
          },
          questions: [
            ['Comment calcule-t-on la valeur ajoutée d’une entreprise ?', ['Chiffre d’affaires moins consommations intermédiaires', 'Chiffre d’affaires moins salaires', 'Bénéfice moins impôts', 'Ventes moins investissements'], 0, 'C’est la richesse réellement créée par l’entreprise.'],
            ['Que sont les consommations intermédiaires ?', ['Les biens et services achetés à d’autres et détruits ou transformés dans la production', 'Les machines utilisées plusieurs années', 'Les salaires versés', 'Les stocks invendus'], 0, 'Matières premières, énergie, services achetés.'],
            ['Une entreprise réalise 300 000 euros de ventes et consomme 90 000 euros d’intrants. Quelle est sa valeur ajoutée ?', ['210 000 euros', '390 000 euros', '90 000 euros', '300 000 euros'], 0, 'On retranche du chiffre d’affaires ce qui a été acheté à d’autres.'],
            ['Pourquoi ne peut-on pas additionner les chiffres d’affaires pour mesurer la production d’un pays ?', ['On compterait plusieurs fois les mêmes biens', 'Les chiffres d’affaires ne sont pas connus', 'Ils incluent les impôts', 'Ils excluent les services'], 0, 'La farine serait comptée chez le meunier puis chez le boulanger.'],
            ['Entre qui se partage la valeur ajoutée ?', ['Salariés, État, prêteurs, propriétaires et l’entreprise elle-même', 'Uniquement les actionnaires', 'Uniquement les salariés et l’État', 'Les clients et les fournisseurs'], 0, 'Salaires, impôts, intérêts, dividendes, autofinancement.'],
            ['La TVA est une taxe assise sur la valeur ajoutée.', ['Vrai', 'Faux'], 0, 'Son nom le dit : taxe sur la valeur ajoutée.'],
            ['Que finance l’autofinancement ?', ['L’investissement de l’entreprise', 'Les dividendes', 'Les cotisations sociales', 'Les consommations intermédiaires'], 0, 'C’est la part de la valeur ajoutée conservée par l’entreprise.'],
            ['Le partage de la valeur ajoutée est-il un enjeu de conflit ?', ['Oui, entre salaires, profits et investissement', 'Non, il est fixé par la loi', 'Non, il est identique dans toutes les entreprises', 'Oui, mais seulement dans l’industrie'], 0, 'C’est l’un des principaux objets de la négociation sociale.'],
          ],
        },
        {
          titre: 'Le PIB : une mesure des richesses d’un pays',
          axe: 'Comment crée-t-on des richesses et comment les mesure-t-on ?',
          lecon: {
            titre: 'Ce que le PIB compte, et ce qu’il oublie',
            cours: `Le **produit intérieur brut** est l’indicateur le plus utilisé au monde pour mesurer l’activité d’un pays. C’est aussi l’un des plus critiqués, et pour de bonnes raisons.

## La définition
Le PIB est la **somme des valeurs ajoutées** produites par toutes les unités résidentes d’un territoire pendant un an, à laquelle on ajoute la TVA et les droits de douane. Intérieur : ce qui est produit sur le territoire, quelle que soit la nationalité du producteur.

## PIB en volume et par habitant
Le **PIB en valeur** est mesuré aux prix courants ; il augmente quand les prix augmentent. Le **PIB en volume** neutralise l’inflation : c’est lui qui sert à mesurer la croissance. Le **PIB par habitant** rapporte la production à la population, ce qui permet des comparaisons entre pays — sans rien dire de la répartition.

> Un accident de la route, une marée noire, une nuit d’hôpital augmentent le PIB. Le travail d’un parent au foyer ne l’augmente pas.

## Ce qu’il ne compte pas
Le **travail domestique** et le bénévolat, l’économie **informelle** et illégale, la dégradation de l’environnement, l’épuisement des ressources, les inégalités, la santé, le temps libre. Le PIB mesure une activité, pas un bien-être.

## Les indicateurs complémentaires
L’**IDH** ajoute santé et éducation ; l’**empreinte écologique** mesure la pression sur la biosphère ; l’indice de Gini mesure les inégalités ; des indicateurs de bien-être ou d’espérance de vie en bonne santé complètent le tableau. Aucun ne remplace le PIB : ils se lisent ensemble.`,
          },
          questions: [
            ['Comment se calcule le PIB ?', ['Par la somme des valeurs ajoutées des unités résidentes', 'Par la somme des chiffres d’affaires', 'Par la somme des salaires', 'Par le total des exportations'], 0, 'On y ajoute la TVA et les droits de douane.'],
            ['Que signifie intérieur dans produit intérieur brut ?', ['Ce qui est produit sur le territoire, quelle que soit la nationalité du producteur', 'Ce qui est produit par les nationaux, où qu’ils soient', 'Ce qui est consommé dans le pays', 'Ce qui n’est pas exporté'], 0, 'À distinguer du produit national brut.'],
            ['Quel PIB sert à mesurer la croissance économique ?', ['Le PIB en volume, qui neutralise l’inflation', 'Le PIB en valeur', 'Le PIB par habitant', 'Le PIB nominal'], 0, 'Sinon, une simple hausse des prix passerait pour de la croissance.'],
            ['Le travail domestique est-il compté dans le PIB ?', ['Non, il n’est pas rémunéré ni échangé', 'Oui, à son coût estimé', 'Oui, depuis 2000', 'Oui, dans les pays de l’OCDE seulement'], 0, 'Une critique majeure de l’indicateur.'],
            ['Une marée noire peut-elle augmenter le PIB ?', ['Oui, par les dépenses de dépollution qu’elle engendre', 'Non, elle le fait toujours baisser', 'Non, elle est neutre', 'Oui, mais seulement à long terme'], 0, 'Le PIB compte l’activité, pas le bien-être.'],
            ['Le PIB par habitant renseigne-t-il sur la répartition des richesses ?', ['Non, c’est une moyenne', 'Oui, précisément', 'Oui, s’il est calculé en volume', 'Non, il ne se calcule pas'], 0, 'Il faut l’indice de Gini pour mesurer les inégalités.'],
            ['Quel indicateur ajoute la santé et l’éducation au niveau de vie ?', ['L’IDH', 'L’empreinte écologique', 'L’indice de Gini', 'Le PIB en volume'], 0, 'Publié chaque année par le PNUD.'],
            ['Que mesure l’empreinte écologique ?', ['La pression exercée par une population sur la biosphère', 'Les émissions de gaz à effet de serre uniquement', 'La surface agricole d’un pays', 'Le coût de la dépollution'], 0, 'Elle s’exprime en hectares globaux par habitant.'],
          ],
        },
        {
          titre: 'La croissance économique : un phénomène récent, inégal et irrégulier',
          axe: 'Comment crée-t-on des richesses et comment les mesure-t-on ?',
          lecon: {
            titre: 'Deux siècles à peine, et pas pour tout le monde',
            cours: `À l’échelle de l’histoire humaine, la croissance économique est une nouveauté. Pendant des millénaires, la production a stagné ou progressé très lentement. Ce n’est plus le cas depuis le XIXe siècle.

## Définir la croissance
La **croissance économique** est l’augmentation durable de la production, mesurée par la variation du **PIB en volume**. Elle se distingue de l’**expansion**, hausse de courte durée, et du **développement**, qui inclut les transformations sociales et l’amélioration des conditions de vie.

## Un phénomène récent
Elle démarre avec la **révolution industrielle**, en Angleterre à la fin du XVIIIe siècle, puis se diffuse. Les **Trente Glorieuses** (1945-1975) constituent en France une période exceptionnelle, avec des taux annuels autour de 5 %. Depuis, la croissance des pays anciennement industrialisés est plus faible.

> Un taux de 2 % par an double la production en trente-cinq ans. La croissance est une affaire d’intérêts composés.

## Inégal
La croissance n’a pas concerné toutes les régions au même moment. L’Europe et l’Amérique du Nord d’abord, le Japon ensuite, puis les **pays émergents** — Chine, Inde, Brésil, Asie du Sud-Est — depuis quelques décennies. Une partie de l’Afrique subsaharienne reste à l’écart, ce qui creuse les écarts de niveau de vie.

## Irrégulier
Les **fluctuations économiques** alternent phases d’expansion et de **récession** — deux trimestres consécutifs de recul du PIB — voire de **dépression**, comme après 1929. Crises pétrolières de 1973 et 1979, crise financière de 2008, crise sanitaire de 2020 : le rythme n’est jamais régulier.`,
          },
          questions: [
            ['Comment mesure-t-on la croissance économique ?', ['Par la variation du PIB en volume', 'Par la variation des prix', 'Par le nombre d’emplois créés', 'Par la hausse des exportations'], 0, 'En volume, pour neutraliser l’inflation.'],
            ['Quelle différence entre croissance et développement ?', ['Le développement inclut les transformations sociales et le niveau de vie', 'Ce sont deux synonymes', 'La croissance est plus longue', 'Le développement ne concerne que les pays pauvres'], 0, 'On peut avoir de la croissance sans développement.'],
            ['Quand la croissance économique moderne commence-t-elle ?', ['Avec la révolution industrielle, à la fin du XVIIIe siècle', 'Au Moyen Âge', 'Après 1945 seulement', 'Au XVIe siècle'], 0, 'Avant, la production stagnait ou progressait très lentement.'],
            ['Qu’appelle-t-on les Trente Glorieuses ?', ['La période de forte croissance de 1945 à 1975', 'Les trente années suivant 1929', 'La période 1980-2010', 'Le XIXe siècle industriel'], 0, 'Des taux annuels autour de 5 % en France.'],
            ['Qu’est-ce qu’une récession ?', ['Un recul du PIB pendant au moins deux trimestres consécutifs', 'Une baisse des prix', 'Une hausse du chômage', 'Une croissance faible mais positive'], 0, 'La dépression est une récession longue et profonde.'],
            ['La croissance a concerné toutes les régions du monde en même temps.', ['Vrai', 'Faux'], 1, 'Europe et Amérique du Nord d’abord, émergents ensuite.'],
            ['À quel rythme une croissance de 2 % par an double-t-elle la production ?', ['En trente-cinq ans environ', 'En cinquante ans', 'En dix ans', 'En un siècle'], 0, 'L’effet des intérêts composés.'],
            ['Quel événement mondial a provoqué une forte récession en 2020 ?', ['La crise sanitaire', 'Une crise pétrolière', 'Un krach immobilier', 'Une guerre commerciale'], 0, 'Après celles de 1973, 1979 et 2008.'],
          ],
        },
        {
          titre: 'Les limites écologiques de la croissance économique',
          axe: 'Comment crée-t-on des richesses et comment les mesure-t-on ?',
          lecon: {
            titre: 'Produire toujours plus sur une planète finie',
            cours: `La croissance suppose de mobiliser des ressources et de rejeter des déchets. Or la planète est finie : c’est le cœur du débat écologique contemporain.

## Le constat
Épuisement des **ressources non renouvelables** (pétrole, gaz, métaux), surexploitation des renouvelables (poissons, forêts, eau), **pollutions**, effondrement de la **biodiversité** et **réchauffement climatique** dû aux gaz à effet de serre. Le rapport Meadows, dès 1972, alertait sur les limites de la croissance.

## Externalités et biens communs
Une **externalité négative** est un effet non payé qu’une activité impose à autrui : une usine qui pollue une rivière n’en supporte pas le coût. L’atmosphère et les océans sont des **biens communs**, que chacun a intérêt à surexploiter et personne à préserver seul : la seule loi du marché ne suffit donc pas.

> Un prix qui ne compte pas la pollution est un prix qui ment sur ce que coûte le produit.

## Les réponses possibles
Réglementer (normes, interdictions, quotas), **taxer** les pollutions selon le principe pollueur-payeur, créer des **marchés de quotas d’émission**, subventionner les alternatives, informer et labelliser. En Europe, le marché carbone et les normes d’émission relèvent de cette panoplie.

## Trois positions dans le débat
La **croissance verte** parie sur le découplage entre production et pression environnementale grâce au progrès technique. Le **développement durable**, défini en 1987 comme celui qui répond aux besoins présents sans compromettre ceux des générations futures, cherche l’équilibre. La **décroissance** conteste la possibilité même d’un découplage suffisant.`,
          },
          questions: [
            ['Qu’est-ce qu’une externalité négative ?', ['Un effet non payé qu’une activité impose à autrui', 'Une taxe sur la pollution', 'Un coût de production élevé', 'Une importation polluante'], 0, 'La pollution d’une rivière par une usine en est l’exemple type.'],
            ['Pourquoi l’atmosphère est-elle un bien commun difficile à protéger ?', ['Chacun a intérêt à l’utiliser sans supporter le coût de sa dégradation', 'Elle appartient à un seul État', 'Elle est illimitée', 'Elle est protégée par le marché'], 0, 'Aucun acteur isolé n’a intérêt à s’imposer un effort.'],
            ['Que dit le principe pollueur-payeur ?', ['Celui qui pollue doit supporter le coût de la pollution', 'L’État paie la dépollution', 'Le consommateur choisit librement', 'Les entreprises se régulent elles-mêmes'], 0, 'Il justifie taxes et redevances environnementales.'],
            ['Qu’est-ce que le développement durable ?', ['Un développement qui répond aux besoins présents sans compromettre ceux des générations futures', 'Une croissance rapide et continue', 'L’arrêt de toute croissance', 'La protection des seules forêts'], 0, 'Définition du rapport Brundtland, 1987.'],
            ['Quel rapport de 1972 alerte sur les limites de la croissance ?', ['Le rapport Meadows', 'Le rapport Brundtland', 'Le protocole de Kyoto', 'Le rapport Stern'], 0, 'Commandé par le Club de Rome.'],
            ['Le marché carbone repose sur des quotas d’émission échangeables.', ['Vrai', 'Faux'], 0, 'Le plafond baisse, ce qui rend le droit à polluer plus cher.'],
            ['Que défend la thèse de la croissance verte ?', ['Qu’on peut découpler croissance et dégradation grâce au progrès technique', 'Qu’il faut réduire la production', 'Que la croissance n’a aucun effet écologique', 'Que seule la réglementation compte'], 0, 'La décroissance conteste la possibilité d’un découplage suffisant.'],
            ['Quelle ressource est renouvelable mais surexploitée ?', ['Les stocks de poissons', 'Le pétrole', 'Le gaz naturel', 'Le charbon'], 0, 'Une ressource renouvelable peut disparaître si le prélèvement dépasse le renouvellement.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : le marché
        // ===================================================================
        {
          titre: 'Les différents types de marchés et d’échanges marchands',
          axe: 'Comment se forment les prix sur un marché ?',
          lecon: {
            titre: 'Un lieu, pas forcément une place',
            cours: `Un **marché** n’est pas d’abord un endroit : c’est la rencontre d’une **offre** et d’une **demande** qui aboutit à un échange et à un prix. Il peut tenir sur une place de village comme dans un réseau informatique mondial.

## L’échange marchand
Il suppose trois conditions : des **droits de propriété** clairement définis et protégés, une **monnaie** qui sert d’unité de compte et de moyen de paiement, et des **institutions** — contrats, tribunaux, normes — qui garantissent que la parole donnée sera tenue. Sans confiance, pas d’échange.

## Une grande diversité
Marchés de **biens et services**, marché du **travail**, marchés **financiers**, marché des changes, marchés de matières premières. Marchés **physiques** ou **dématérialisés** — les plateformes en ligne mettent en relation des millions d’offreurs et de demandeurs sans lieu commun.

> Une plateforme de covoiturage ne transporte personne : elle crée un marché là où il n’y en avait pas.

## Les structures de marché
La **concurrence parfaite** suppose de nombreux offreurs et demandeurs, des produits homogènes, une information parfaite, la libre entrée et sortie. C’est un modèle théorique. La réalité connaît le **monopole** (un seul offreur), l’**oligopole** (quelques-uns), la **concurrence monopolistique** (des produits différenciés par la marque ou la qualité).

## Encadrer les marchés
Les États et l’Union européenne surveillent la **concurrence** : interdiction des ententes sur les prix, contrôle des concentrations, sanction des abus de position dominante. Certaines activités sont réglementées, d’autres soustraites au marché — on ne vend légalement ni organes, ni voix électorales.`,
          },
          questions: [
            ['Qu’est-ce qu’un marché en économie ?', ['La rencontre d’une offre et d’une demande aboutissant à un prix', 'Un lieu physique de vente', 'Un magasin', 'Une entreprise en situation de monopole'], 0, 'Il peut être totalement dématérialisé.'],
            ['Quelles institutions sont nécessaires à l’échange marchand ?', ['Des droits de propriété, une monnaie et des contrats garantis', 'Une administration douanière', 'Une bourse des valeurs', 'Un syndicat professionnel'], 0, 'Sans confiance ni règles, l’échange ne se fait pas.'],
            ['Que suppose la concurrence parfaite ?', ['De nombreux offreurs et demandeurs, des produits homogènes et une information parfaite', 'Un seul offreur puissant', 'Des produits très différenciés', 'Des barrières à l’entrée'], 0, 'C’est un modèle théorique, rarement observé.'],
            ['Qu’est-ce qu’un oligopole ?', ['Un marché dominé par un petit nombre d’offreurs', 'Un marché à offreur unique', 'Un marché sans acheteur', 'Un marché réglementé par l’État'], 0, 'Téléphonie, aéronautique, distribution en donnent des exemples.'],
            ['Qu’est-ce que la concurrence monopolistique ?', ['De nombreux offreurs proposant des produits différenciés', 'Un monopole légal', 'Un marché sans concurrence', 'Un duopole'], 0, 'La marque, la qualité ou l’image créent un pouvoir de marché limité.'],
            ['Les ententes sur les prix entre entreprises sont interdites.', ['Vrai', 'Faux'], 0, 'Elles sont sanctionnées par les autorités de la concurrence.'],
            ['Tous les biens peuvent-ils être échangés sur un marché ?', ['Non, certains échanges sont interdits par la loi', 'Oui, si un prix existe', 'Oui, sauf les services publics', 'Non, seuls les biens matériels le peuvent'], 0, 'Organes, voix électorales, diplômes : le marché a des frontières morales et légales.'],
            ['Que fait une autorité de la concurrence ?', ['Elle sanctionne les ententes et les abus de position dominante', 'Elle fixe les prix', 'Elle finance les entreprises', 'Elle recrute les salariés'], 0, 'Elle contrôle aussi les fusions et concentrations.'],
          ],
        },
        {
          titre: 'La loi de l’offre et de la demande et la fixation du prix d’équilibre',
          axe: 'Comment se forment les prix sur un marché ?',
          lecon: {
            titre: 'Le prix qui met tout le monde d’accord',
            cours: `Sur un marché concurrentiel, le prix n’est décidé par personne en particulier : il résulte de la confrontation entre ce que les vendeurs veulent vendre et ce que les acheteurs veulent acheter.

## Les deux courbes
La **demande** diminue quand le prix augmente : la courbe est décroissante. L’**offre** augmente quand le prix augmente, car produire devient plus rentable : la courbe est croissante. Ce sont des quantités souhaitées à chaque prix, pas des quantités échangées.

## L’équilibre
Le **prix d’équilibre** est celui pour lequel la quantité offerte égale la quantité demandée. Au-dessus, l’offre excède la demande : les invendus s’accumulent et poussent le prix à la baisse. En dessous, la demande excède l’offre : la pénurie pousse le prix à la hausse. Le marché est dit **autorégulateur**.

> Le prix n’est pas seulement un montant : c’est une information. Il dit aux producteurs où produire et aux consommateurs à quoi renoncer.

## Ce qui déplace les courbes
Un changement de prix fait se **déplacer le long** de la courbe. En revanche, une hausse du revenu, une mode, un produit substituable moins cher **déplacent la courbe de demande** ; un progrès technique, une baisse du coût des matières premières ou une taxe **déplacent la courbe d’offre**. À la clé, un nouvel équilibre.

## L’élasticité
L’**élasticité-prix de la demande** mesure la sensibilité des quantités demandées au prix. Elle est faible pour les produits de première nécessité — on achète du pain même s’il augmente — et forte pour les biens facilement remplaçables. Elle explique pourquoi une taxe sur le tabac rapporte beaucoup et fait peu baisser la consommation à court terme.`,
          },
          questions: [
            ['Comment évolue la demande quand le prix augmente ?', ['Elle diminue', 'Elle augmente', 'Elle reste constante', 'Elle devient nulle'], 0, 'La courbe de demande est décroissante.'],
            ['Comment évolue l’offre quand le prix augmente ?', ['Elle augmente', 'Elle diminue', 'Elle reste constante', 'Elle devient nulle'], 0, 'Produire devient plus rentable pour davantage de producteurs.'],
            ['Qu’est-ce que le prix d’équilibre ?', ['Le prix pour lequel la quantité offerte égale la quantité demandée', 'Le prix le plus bas du marché', 'Le prix fixé par l’État', 'Le prix moyen constaté'], 0, 'À ce prix, il n’y a ni pénurie ni invendus.'],
            ['Que se passe-t-il si le prix est supérieur au prix d’équilibre ?', ['L’offre excède la demande, ce qui pousse le prix à la baisse', 'La demande excède l’offre', 'Le marché disparaît', 'Rien ne change'], 0, 'Les invendus obligent les vendeurs à baisser leur prix.'],
            ['Qu’est-ce qui déplace la courbe de demande ?', ['Une variation du revenu ou des goûts', 'Une variation du prix du bien lui-même', 'Un progrès technique du producteur', 'Une taxe sur la production'], 0, 'Le prix du bien fait se déplacer le long de la courbe, pas la courbe.'],
            ['Une élasticité-prix faible signifie que la demande varie peu quand le prix change.', ['Vrai', 'Faux'], 0, 'C’est le cas des produits de première nécessité.'],
            ['Pourquoi le prix est-il une information ?', ['Il indique aux producteurs quoi produire et aux consommateurs à quoi renoncer', 'Il fixe le salaire des employés', 'Il détermine le taux d’imposition', 'Il mesure la qualité du bien'], 0, 'C’est le signal central du fonctionnement du marché.'],
            ['Une taxe sur un produit déplace quelle courbe ?', ['La courbe d’offre', 'La courbe de demande', 'Les deux à la fois', 'Aucune des deux'], 0, 'Elle augmente le coût pour le producteur à chaque niveau de prix.'],
          ],
        },
        {
          titre: 'L’intervention publique permet de remédier aux effets indésirables du marché sur l’environnement',
          axe: 'Comment se forment les prix sur un marché ?',
          lecon: {
            titre: 'Quand le prix ne dit pas toute la vérité',
            cours: `Le marché coordonne efficacement des millions de décisions — mais pas toujours. Face aux dégâts environnementaux, il produit des résultats que personne n’a voulus : c’est une **défaillance de marché**.

## Le problème
Une entreprise qui rejette du dioxyde de carbone ne paie pas le coût du réchauffement qu’elle contribue à provoquer. Ce coût est supporté par tous : c’est une **externalité négative**. Le prix du produit est donc trop bas, la quantité produite trop élevée.

## Trois instruments
La **réglementation** interdit ou plafonne : normes d’émission, interdiction de certains pesticides, zones à faibles émissions. La **taxation** renchérit le comportement polluant selon le principe **pollueur-payeur** : taxe carbone, malus automobile. Le **marché de quotas** fixe un plafond d’émissions et laisse les entreprises s’échanger des droits, le prix du quota s’établissant par le marché lui-même.

> Réglementer, c’est interdire ; taxer, c’est renchérir ; échanger des quotas, c’est fixer la quantité et laisser le prix suivre.

## Comparer les instruments
La réglementation est simple à comprendre mais peu souple et coûteuse à contrôler. La taxe est efficace et rapporte des recettes, mais son incidence peut être **régressive** — elle pèse plus lourd sur les ménages modestes. Le marché de quotas garantit un plafond mais suppose un prix suffisant et une allocation initiale équitable.

## L’acceptabilité
Une politique environnementale efficace n’est pas nécessairement acceptée : le mouvement des gilets jaunes de 2018 est né en partie d’une hausse des taxes sur les carburants. D’où l’importance des compensations, des alternatives disponibles et de l’affectation visible des recettes.`,
          },
          questions: [
            ['Qu’est-ce qu’une défaillance de marché ?', ['Une situation où le marché aboutit à un résultat collectivement inefficace', 'Une faillite d’entreprise', 'Un krach boursier', 'Une pénurie temporaire'], 0, 'Les externalités en sont l’exemple central.'],
            ['Pourquoi le prix d’un produit polluant est-il trop bas ?', ['Il n’intègre pas le coût de la pollution supportée par tous', 'Il est fixé par l’État', 'Les coûts de production sont sous-estimés', 'La demande est trop faible'], 0, 'D’où une production supérieure à l’optimum social.'],
            ['Quels sont les trois grands instruments de la politique environnementale ?', ['Réglementation, taxation et marché de quotas', 'Subvention, nationalisation et privatisation', 'Impôt, dette et dépense publique', 'Norme, publicité et information'], 0, 'Ils sont souvent combinés.'],
            ['Que fixe un marché de quotas d’émission ?', ['Une quantité maximale d’émissions, le prix résultant des échanges', 'Un prix du carbone, la quantité s’ajustant', 'Une interdiction totale', 'Une subvention aux entreprises propres'], 0, 'La taxe fait l’inverse : elle fixe le prix.'],
            ['Que reproche-t-on souvent à une taxe environnementale ?', ['D’être régressive et de peser davantage sur les ménages modestes', 'D’être inefficace', 'De ne rapporter aucune recette', 'D’être illégale'], 0, 'D’où la nécessité de compensations.'],
            ['La réglementation est plus souple que la taxation.', ['Vrai', 'Faux'], 1, 'Elle impose la même contrainte à tous, quel que soit le coût pour chacun.'],
            ['Quel mouvement social de 2018 est lié à une hausse des taxes sur les carburants ?', ['Les gilets jaunes', 'Les bonnets rouges', 'Nuit debout', 'Les zadistes'], 0, 'L’acceptabilité conditionne l’efficacité d’une politique.'],
            ['Qu’est-ce qu’un malus automobile ?', ['Une taxe à l’achat d’un véhicule très émetteur', 'Une amende de circulation', 'Une prime à la casse', 'Un péage urbain'], 0, 'Un exemple concret du principe pollueur-payeur.'],
          ],
        },

        // ===================================================================
        // Chapitre 4 : la socialisation
        // ===================================================================
        {
          titre: 'Qu’est-ce que la socialisation ?',
          axe: 'Comment devenons-nous des acteurs sociaux ?',
          lecon: {
            titre: 'Apprendre à vivre en société, sans s’en apercevoir',
            cours: `Personne ne naît en sachant dire bonjour, tenir une fourchette ou baisser la voix dans une bibliothèque. Ces manières de faire s’apprennent : c’est la **socialisation**.

## La définition
La socialisation est le processus par lequel un individu **intériorise** les normes, les valeurs et les rôles de la société où il vit. Une **norme** est une règle de comportement ; une **valeur** est un idéal partagé qui justifie les normes ; un **rôle** est l’ensemble des comportements attendus d’une position sociale.

## Deux temps
La **socialisation primaire**, dans l’enfance, est la plus intense et la plus durable : elle façonne la langue, les manières, les goûts, les repères moraux. La **socialisation secondaire**, à l’âge adulte, se poursuit dans le monde professionnel, le couple, les associations, les partis ; elle peut compléter la première ou entrer en tension avec elle.

> Ce qui est intériorisé cesse d’être ressenti comme une contrainte : on ne se force pas à dire bonjour, on le fait.

## Les instances de socialisation
La **famille**, l’**école**, les **groupes de pairs**, les **médias**, le travail, les institutions religieuses ou sportives. Elles peuvent transmettre des messages convergents ou contradictoires ; l’individu n’est pas un réceptacle passif, il compose.

## Deux modes de transmission
L’**inculcation explicite** — on énonce la règle, on récompense, on sanctionne — et l’**imprégnation implicite**, par imitation et exposition répétée. La seconde est souvent la plus puissante, parce qu’elle ne se voit pas.`,
          },
          questions: [
            ['Qu’est-ce que la socialisation ?', ['Le processus d’intériorisation des normes, valeurs et rôles d’une société', 'L’intégration dans un groupe d’amis', 'L’apprentissage d’un métier', 'La participation à la vie associative'], 0, 'Elle est continue, mais son moment le plus décisif est l’enfance.'],
            ['Quelle différence entre une norme et une valeur ?', ['La norme est une règle de comportement, la valeur un idéal qui la justifie', 'Ce sont deux synonymes', 'La norme est juridique, la valeur morale', 'La valeur est individuelle, la norme collective'], 0, 'La ponctualité est une norme, le respect d’autrui une valeur.'],
            ['Qu’est-ce qu’un rôle social ?', ['L’ensemble des comportements attendus d’une position sociale', 'Un métier', 'Une personnalité', 'Une fonction politique'], 0, 'On attend d’un élève, d’un médecin ou d’un parent certains comportements.'],
            ['Quelle socialisation est la plus durable ?', ['La socialisation primaire, dans l’enfance', 'La socialisation secondaire', 'La socialisation professionnelle', 'La socialisation par les médias'], 0, 'Elle façonne la langue, les manières et les repères moraux.'],
            ['Les instances de socialisation transmettent-elles toujours les mêmes messages ?', ['Non, elles peuvent être contradictoires', 'Oui, toujours', 'Oui, sauf les médias', 'Non, elles ne transmettent rien'], 0, 'L’individu compose entre des influences parfois opposées.'],
            ['L’imprégnation implicite est souvent plus puissante que l’inculcation explicite.', ['Vrai', 'Faux'], 0, 'Parce qu’elle passe inaperçue et ne suscite pas de résistance.'],
            ['Qu’est-ce que la socialisation secondaire ?', ['Celle qui se poursuit à l’âge adulte, au travail ou en couple', 'Celle qui a lieu à l’école primaire', 'Celle qui vient des grands-parents', 'Celle qui est imposée par la loi'], 0, 'Elle peut entrer en tension avec la socialisation primaire.'],
            ['L’individu est-il passif face à la socialisation ?', ['Non, il sélectionne, réinterprète et résiste parfois', 'Oui, il subit entièrement', 'Oui, jusqu’à la majorité', 'Non, il n’est pas socialisé'], 0, 'La socialisation n’est pas un formatage.'],
          ],
        },
        {
          titre: 'La socialisation et la construction d’une identité sociale',
          axe: 'Comment devenons-nous des acteurs sociaux ?',
          lecon: {
            titre: 'Qui je suis dépend aussi d’où je viens',
            cours: `L’**identité sociale** est la manière dont un individu se définit et est défini par les autres à partir de ses appartenances : famille, milieu, âge, sexe, métier, région, croyances.

## Une construction, pas un donné
L’identité n’est ni figée ni entièrement choisie. Elle se construit dans l’interaction : je me perçois aussi à travers le regard des autres. Les **groupes d’appartenance** sont ceux auxquels on appartient effectivement ; les **groupes de référence** sont ceux auxquels on aspire et dont on adopte les manières.

## Le poids de la trajectoire
La socialisation transmet des dispositions durables — goûts, façons de parler, rapport à l’école, ambitions. Bourdieu parle d’**habitus** : un ensemble de dispositions incorporées qui orientent les pratiques sans que l’individu ait besoin d’y penser. C’est ainsi que se reproduisent en partie les positions sociales.

> Deux élèves aux notes identiques ne demandent pas la même orientation : l’un se sent à sa place en prépa, l’autre pas.

## Identités multiples
Chacun cumule plusieurs appartenances : être à la fois lycéenne, sportive, fille d’artisan, habitante d’une petite ville. Elles peuvent se renforcer ou entrer en **conflit de rôles**, par exemple entre exigences professionnelles et familiales.

## Les identités changent
Une **socialisation anticipatrice** prépare à un rôle futur en en adoptant d’avance les codes. Une **resocialisation** transforme profondément l’identité : entrée à l’armée, conversion religieuse, immigration, changement radical de milieu professionnel.`,
          },
          questions: [
            ['Qu’est-ce que l’identité sociale ?', ['La manière dont un individu se définit et est défini par ses appartenances', 'Le numéro de sécurité sociale', 'La personnalité psychologique', 'La nationalité'], 0, 'Elle se construit dans l’interaction avec les autres.'],
            ['Qu’est-ce qu’un groupe de référence ?', ['Un groupe auquel on aspire et dont on adopte les manières', 'Le groupe auquel on appartient', 'Un groupe imposé par la loi', 'Un groupe de travail'], 0, 'Il peut différer du groupe d’appartenance.'],
            ['Qu’appelle-t-on habitus chez Bourdieu ?', ['Un ensemble de dispositions incorporées qui orientent les pratiques', 'Une habitude consciente', 'Un règlement intérieur', 'Un mode de vie choisi'], 0, 'Il agit sans que l’individu ait besoin d’y penser.'],
            ['Qu’est-ce qu’un conflit de rôles ?', ['Une contradiction entre les attentes liées à deux positions occupées simultanément', 'Une dispute entre collègues', 'Un désaccord politique', 'Une crise d’adolescence'], 0, 'Exigences professionnelles contre exigences familiales, par exemple.'],
            ['Qu’est-ce que la socialisation anticipatrice ?', ['Adopter d’avance les codes d’un groupe que l’on souhaite rejoindre', 'Socialiser un enfant très tôt', 'Prévoir sa retraite', 'Changer de milieu par obligation'], 0, 'Un étudiant qui adopte les manières du métier visé.'],
            ['L’identité sociale est fixée une fois pour toutes.', ['Vrai', 'Faux'], 1, 'Elle évolue, et une resocialisation peut la transformer profondément.'],
            ['Qu’est-ce qu’une resocialisation ?', ['Une transformation profonde des normes et rôles intériorisés', 'Un retour à l’école', 'Un déménagement', 'Une reconversion sans changement de milieu'], 0, 'Armée, conversion, immigration en sont des exemples.'],
            ['Pourquoi deux élèves aux mêmes résultats peuvent-ils choisir des voies différentes ?', ['Leurs dispositions socialisées orientent ce qu’ils jugent possible pour eux', 'L’un est plus intelligent', 'Les notes ne comptent pas', 'Le hasard décide'], 0, 'L’autocensure est un effet bien documenté de la socialisation.'],
          ],
        },
        {
          titre: 'La socialisation en fonction du genre et du milieu social',
          axe: 'Comment devenons-nous des acteurs sociaux ?',
          lecon: {
            titre: 'On ne socialise pas tout le monde de la même façon',
            cours: `La socialisation n’est pas uniforme : elle **différencie**. Selon le sexe attribué à la naissance et selon le milieu social, les enfants ne reçoivent ni les mêmes attentes, ni les mêmes encouragements.

## Le genre
Le **sexe** renvoie aux caractéristiques biologiques, le **genre** aux rôles et attributs socialement associés au masculin et au féminin. Dès la naissance, couleurs, jouets, vocabulaire, tolérance à l’agitation ou à l’émotion diffèrent. L’école, les manuels, les médias et les pairs prolongent cette différenciation.

## Ses effets
Elle se lit dans les **choix d’orientation** — les filles sont majoritaires dans les filières littéraires et de santé, très minoritaires en informatique et dans les spécialités scientifiques les plus techniques —, dans la répartition du **travail domestique**, et dans les carrières. Ces écarts varient selon les époques et les pays, ce qui prouve qu’ils ne sont pas naturels.

> Si le partage des tâches était biologique, il serait le même partout. Il ne l’est pas.

## Le milieu social
Les pratiques éducatives diffèrent selon la position sociale : rapport au langage, à la lecture, aux loisirs, à l’autorité, à l’école. Les familles de cadres transmettent souvent une familiarité avec la culture scolaire — ce que Bourdieu appelle le **capital culturel** — qui avantage leurs enfants sans qu’aucune règle ne le prévoie.

## Ce que cela produit
Des inégalités de réussite scolaire à niveau de compétences comparable, des pratiques culturelles distinctes, des aspirations différentes. La socialisation différenciée est l’un des mécanismes centraux de la **reproduction sociale** — mais elle n’est jamais totale : la mobilité existe.`,
          },
          questions: [
            ['Quelle différence entre sexe et genre ?', ['Le sexe est biologique, le genre est une construction sociale', 'Ce sont deux synonymes', 'Le genre est juridique', 'Le sexe est déclaratif'], 0, 'Le genre désigne les rôles associés au masculin et au féminin.'],
            ['Comment sait-on que les rôles de genre ne sont pas naturels ?', ['Ils varient selon les époques et les sociétés', 'Ils sont identiques partout', 'Ils sont fixés par la loi', 'Ils ne varient qu’avec l’âge'], 0, 'La variabilité est l’argument central.'],
            ['Où se lit la socialisation différenciée selon le genre ?', ['Dans les choix d’orientation et le partage du travail domestique', 'Uniquement dans les salaires', 'Uniquement dans le sport', 'Nulle part de façon mesurable'], 0, 'Filles majoritaires en santé, minoritaires en informatique.'],
            ['Qu’est-ce que le capital culturel ?', ['Les savoirs, références et aisances transmis par la famille et valorisés à l’école', 'Le budget culturel d’un ménage', 'Le patrimoine artistique d’un pays', 'Le nombre de livres publiés'], 0, 'Il avantage certains élèves sans qu’aucune règle ne le prévoie.'],
            ['Qu’appelle-t-on reproduction sociale ?', ['La tendance des positions sociales à se transmettre d’une génération à l’autre', 'La croissance démographique', 'Le renouvellement des générations', 'La mobilité professionnelle'], 0, 'La socialisation différenciée en est un mécanisme central.'],
            ['La socialisation différenciée rend toute mobilité sociale impossible.', ['Vrai', 'Faux'], 1, 'Elle rend certaines trajectoires plus probables, pas certaines.'],
            ['Qu’est-ce qui différencie les pratiques éducatives selon le milieu ?', ['Le rapport au langage, à la lecture, aux loisirs et à l’autorité', 'Le nombre d’enfants', 'La région d’habitation seulement', 'La taille du logement'], 0, 'Ces différences ont des effets scolaires mesurables.'],
            ['Les jouets proposés aux enfants participent-ils à la socialisation de genre ?', ['Oui, ils orientent les activités et les compétences valorisées', 'Non, ils sont neutres', 'Oui, mais seulement après six ans', 'Non, seuls les parents comptent'], 0, 'Couleurs, catalogues et rayons différenciés dès la petite enfance.'],
          ],
        },

        // ===================================================================
        // Chapitre 5 : la vie politique
        // ===================================================================
        {
          titre: 'Le système politique démocratique',
          axe: 'Comment s’organise la vie politique ?',
          lecon: {
            titre: 'Ce qui fait qu’un régime est démocratique',
            cours: `Une démocratie ne se reconnaît pas seulement à la tenue d’élections : plusieurs conditions doivent être réunies pour que le pouvoir vienne réellement des citoyens et reste limité.

## Les critères
Souveraineté du peuple, **élections libres, régulières et pluralistes**, **suffrage universel**, **séparation des pouvoirs**, garantie des **libertés fondamentales** — expression, presse, réunion, association —, **État de droit** où chacun, y compris les gouvernants, est soumis à la loi, et respect des minorités.

## Directe, représentative, participative
La démocratie **directe** fait décider les citoyens eux-mêmes ; elle subsiste par le **référendum** et dans certains cantons suisses. La démocratie **représentative** confie la décision à des élus : c’est la forme dominante. La démocratie **participative** ajoute consultations, budgets participatifs, conventions citoyennes tirées au sort.

> Élire, ce n’est pas seulement désigner : c’est aussi pouvoir renvoyer. Une élection sans alternance possible n’est pas une élection.

## Les contre-pouvoirs
Justice indépendante, Parlement, presse libre, syndicats, associations, autorités indépendantes, Cour constitutionnelle. Ils empêchent la concentration du pouvoir. Leur affaiblissement est le signal des **régimes hybrides**, qui gardent les élections en vidant les libertés.

## Les fragilités
Abstention, défiance envers les partis et les élus, désinformation, financement opaque des campagnes, inégalité d’accès à la parole publique. La démocratie est un régime qui doit être entretenu, non un état acquis.`,
          },
          questions: [
            ['Quels critères définissent un régime démocratique ?', ['Élections libres, séparation des pouvoirs, libertés fondamentales et État de droit', 'La seule tenue d’élections', 'Un parti unique fort', 'Un référendum annuel'], 0, 'Les élections seules ne suffisent pas.'],
            ['Qu’est-ce que l’État de droit ?', ['Un système où tous, y compris les gouvernants, sont soumis à la loi', 'Un État qui édicte beaucoup de lois', 'Un État centralisé', 'Un régime présidentiel'], 0, 'Il suppose une justice indépendante.'],
            ['Quelle forme de démocratie domine aujourd’hui ?', ['La démocratie représentative', 'La démocratie directe', 'La démocratie participative', 'La démocratie censitaire'], 0, 'Les citoyens élisent ceux qui décident en leur nom.'],
            ['Qu’est-ce qu’un budget participatif ?', ['Un dispositif où les habitants décident de l’affectation d’une part du budget local', 'Le budget voté par le Parlement', 'Un emprunt public', 'Une consultation des entreprises'], 0, 'Il relève de la démocratie participative.'],
            ['Pourquoi les contre-pouvoirs sont-ils essentiels ?', ['Ils empêchent la concentration du pouvoir', 'Ils accélèrent les décisions', 'Ils remplacent les élections', 'Ils réduisent les dépenses publiques'], 0, 'Justice, presse, Parlement, associations, autorités indépendantes.'],
            ['Un régime qui organise des élections est nécessairement démocratique.', ['Vrai', 'Faux'], 1, 'Les régimes hybrides gardent les élections en vidant les libertés.'],
            ['Que garantit le suffrage universel ?', ['Le droit de vote à tous les citoyens majeurs, sans condition de fortune', 'Le vote obligatoire', 'Le vote électronique', 'La représentation proportionnelle'], 0, 'Il s’oppose au suffrage censitaire.'],
            ['Qu’est-ce qui menace aujourd’hui les démocraties selon le programme ?', ['Abstention, défiance et désinformation', 'L’excès de contre-pouvoirs', 'La liberté de la presse', 'Le pluralisme des partis'], 0, 'La démocratie s’entretient, elle n’est jamais acquise.'],
          ],
        },
        {
          titre: 'L’organisation des pouvoirs au sein de la Ve République',
          axe: 'Comment s’organise la vie politique ?',
          lecon: {
            titre: 'Un exécutif à deux têtes, un Parlement à deux chambres',
            cours: `La **Ve République**, née de la Constitution du **4 octobre 1958**, a été conçue pour donner à l’exécutif une stabilité que la IVe n’avait pas. Elle organise les pouvoirs autour d’un président fort.

## L’exécutif
Le **président de la République** est élu au suffrage universel direct depuis la réforme de **1962**, pour cinq ans depuis le **quinquennat** de 2000. Il nomme le Premier ministre, préside le conseil des ministres, peut dissoudre l’Assemblée nationale, recourir au référendum, et dispose de pouvoirs exceptionnels. Le **gouvernement**, dirigé par le Premier ministre, détermine et conduit la politique de la nation et est responsable devant l’Assemblée.

## Le législatif
Le Parlement comprend l’**Assemblée nationale** — 577 députés élus pour cinq ans au scrutin uninominal majoritaire à deux tours — et le **Sénat** — 348 sénateurs élus au suffrage indirect par de grands électeurs, pour six ans. Le Parlement vote la loi, le budget, et contrôle le gouvernement. En cas de désaccord persistant, l’Assemblée a le dernier mot.

> Le président n’est pas responsable devant le Parlement ; le gouvernement, si. Toute la mécanique du régime tient dans cette dissymétrie.

## Le judiciaire et le Conseil constitutionnel
L’autorité judiciaire est indépendante. Le **Conseil constitutionnel** contrôle la conformité des lois à la Constitution, avant leur promulgation ou, depuis 2008, par la **question prioritaire de constitutionnalité** soulevée par un justiciable.

## Un régime original
Ni pleinement présidentiel ni pleinement parlementaire, il est dit **semi-présidentiel**. La **cohabitation** — président et majorité parlementaire de camps opposés — s’est produite trois fois avant que le quinquennat et l’inversion du calendrier électoral ne la rendent plus improbable.`,
          },
          questions: [
            ['De quand date la Constitution de la Ve République ?', ['Du 4 octobre 1958', 'Du 27 octobre 1946', 'Du 14 juillet 1958', 'Du 28 septembre 1962'], 0, 'Elle est adoptée par référendum.'],
            ['Depuis quelle réforme le président est-il élu au suffrage universel direct ?', ['Depuis 1962', 'Depuis 1958', 'Depuis 2000', 'Depuis 2008'], 0, 'Un référendum voulu par de Gaulle.'],
            ['Combien de députés compte l’Assemblée nationale ?', ['577', '348', '500', '925'], 0, 'Élus au scrutin uninominal majoritaire à deux tours.'],
            ['Comment les sénateurs sont-ils élus ?', ['Au suffrage indirect, par de grands électeurs', 'Au suffrage universel direct', 'Par le président', 'Par tirage au sort'], 0, 'Pour six ans, avec renouvellement par moitié.'],
            ['Devant qui le gouvernement est-il responsable ?', ['Devant l’Assemblée nationale', 'Devant le Sénat', 'Devant le président seul', 'Devant le Conseil constitutionnel'], 0, 'Elle peut le renverser par une motion de censure.'],
            ['La question prioritaire de constitutionnalité existe depuis 2008.', ['Vrai', 'Faux'], 0, 'Elle permet à un justiciable de contester une loi déjà en vigueur.'],
            ['Qu’est-ce qu’une cohabitation ?', ['Un président et une majorité parlementaire de camps opposés', 'Un gouvernement d’union nationale', 'Une alliance entre deux partis', 'Un partage entre Assemblée et Sénat'], 0, 'Elle s’est produite trois fois sous la Ve République.'],
            ['Comment qualifie-t-on le régime de la Ve République ?', ['Semi-présidentiel', 'Présidentiel', 'Parlementaire classique', 'Directorial'], 0, 'Il emprunte aux deux modèles.'],
          ],
        },
        {
          titre: 'L’importance du mode de scrutin dans la désignation des représentants',
          axe: 'Comment s’organise la vie politique ?',
          lecon: {
            titre: 'Les mêmes voix, des résultats différents',
            cours: `Un mode de scrutin n’est jamais neutre : avec exactement les mêmes bulletins, deux règles de décompte différentes donnent deux assemblées différentes.

## Les scrutins majoritaires
Est élu celui qui obtient le plus de voix, en un tour ou en deux. Le scrutin **uninominal majoritaire à deux tours** est utilisé pour les législatives et la présidentielle françaises. Avantages : majorité claire, stabilité gouvernementale, lien personnel entre l’élu et sa circonscription. Inconvénient : de nombreuses voix ne sont pas représentées, et les petits partis nationaux sont écrasés.

## Le scrutin proportionnel
Les sièges sont répartis en fonction du pourcentage de voix obtenu par chaque liste. Il est utilisé en France pour les élections européennes et, partiellement, pour les régionales et municipales. Avantage : la représentation fidèle de la diversité des opinions. Inconvénient : la difficulté à dégager une majorité, d’où des coalitions et parfois de l’instabilité.

> Le majoritaire fabrique des gouvernements ; le proportionnel fabrique des représentations. Aucun ne fait les deux à la fois.

## Les systèmes mixtes
Beaucoup de pays combinent les deux : l’Allemagne élit une moitié de ses députés au scrutin majoritaire, l’autre à la proportionnelle. Les scrutins de liste français aux municipales et régionales combinent prime majoritaire et répartition proportionnelle.

## Le poids des règles annexes
Le **seuil** minimal pour obtenir des sièges, le **découpage** des circonscriptions, l’ordre des candidats sur une liste, les règles de **parité** pèsent autant que le mode de scrutin lui-même. Le découpage peut être manipulé pour avantager un camp — le fameux charcutage électoral.`,
          },
          questions: [
            ['Quel mode de scrutin est utilisé pour les élections législatives françaises ?', ['Le scrutin uninominal majoritaire à deux tours', 'La proportionnelle intégrale', 'Le scrutin de liste à un tour', 'Le vote préférentiel'], 0, 'Une circonscription, un siège.'],
            ['Quel est le principal avantage du scrutin majoritaire ?', ['Il dégage des majorités claires et stables', 'Il représente fidèlement toutes les opinions', 'Il favorise les petits partis', 'Il supprime l’abstention'], 0, 'Au prix d’une représentation moins fidèle.'],
            ['Quel est le principal avantage du scrutin proportionnel ?', ['Il représente fidèlement la diversité des opinions', 'Il garantit une majorité absolue', 'Il supprime les coalitions', 'Il renforce le lien avec la circonscription'], 0, 'Au prix d’une majorité plus difficile à constituer.'],
            ['Quelle élection française se déroule à la proportionnelle ?', ['L’élection des députés européens', 'L’élection présidentielle', 'Les élections législatives', 'L’élection des sénateurs'], 0, 'Sur une circonscription nationale unique.'],
            ['Qu’est-ce qu’un seuil électoral ?', ['Le pourcentage minimal de voix requis pour obtenir des sièges', 'Le taux de participation minimal', 'Le nombre de signatures pour se présenter', 'Le plafond de dépenses de campagne'], 0, 'Il écarte les très petites listes de la répartition.'],
            ['Le découpage des circonscriptions peut influencer le résultat d’une élection.', ['Vrai', 'Faux'], 0, 'On parle de charcutage électoral quand il est manipulé.'],
            ['Quel pays combine scrutin majoritaire et proportionnel pour son Parlement ?', ['L’Allemagne', 'Le Royaume-Uni', 'Les États-Unis', 'L’Espagne'], 0, 'Un système mixte, dit proportionnel personnalisé.'],
            ['Le mode de scrutin est-il un choix technique neutre ?', ['Non, il oriente la composition de l’assemblée élue', 'Oui, il est purement administratif', 'Oui, s’il est appliqué correctement', 'Non, il est interdit d’en changer'], 0, 'Les mêmes voix donnent des assemblées différentes.'],
          ],
        },
        {
          titre: 'Les différents acteurs de la vie politique démocratique',
          axe: 'Comment s’organise la vie politique ?',
          lecon: {
            titre: 'Voter, oui, mais pas seulement',
            cours: `La vie politique ne se limite ni aux élus ni aux jours d’élection. Partis, syndicats, associations, médias et citoyens ordinaires y participent en permanence.

## Les partis politiques
Ils ont quatre fonctions : **sélectionner** des candidats, **élaborer** des programmes, **mobiliser** les électeurs, **structurer** le débat public. En France, ils sont financés en partie sur fonds publics, en fonction des résultats électoraux et du respect de la parité, et leurs comptes sont contrôlés.

## Les groupes d’intérêt
Syndicats de salariés et organisations patronales, ordres professionnels, ONG, associations d’usagers : ils défendent des intérêts particuliers auprès des pouvoirs publics. Le **lobbying** est désormais encadré par un registre des représentants d’intérêts.

> Une démocratie sans corps intermédiaires laisse face à face un pouvoir seul et des individus isolés.

## Les médias et l’opinion
Les médias informent, hiérarchisent l’information et donnent la parole. Leur rôle s’est transformé avec les réseaux sociaux : diffusion accélérée, mais aussi **désinformation**, bulles de filtre et concurrence des sources. Les sondages nourrissent le débat sans le décider.

## Les citoyens
Voter, adhérer, militer, pétitionner, manifester, boycotter, s’engager dans une association, participer à une consultation locale : la **participation politique** est bien plus large que le seul bulletin. L’**abstention**, qui progresse surtout chez les jeunes et les moins diplômés, est elle aussi un comportement politique — parfois indifférence, parfois protestation.`,
          },
          questions: [
            ['Quelles sont les fonctions d’un parti politique ?', ['Sélectionner des candidats, élaborer un programme, mobiliser et structurer le débat', 'Gérer les services publics', 'Contrôler les élections', 'Rédiger les lois'], 0, 'Il fait le lien entre la société et les institutions.'],
            ['Comment les partis sont-ils financés en France ?', ['En partie sur fonds publics, selon les résultats électoraux et la parité', 'Uniquement par les dons privés', 'Uniquement par les cotisations', 'Par les entreprises'], 0, 'Leurs comptes sont contrôlés par une commission dédiée.'],
            ['Qu’est-ce qu’un groupe d’intérêt ?', ['Une organisation qui défend des intérêts particuliers auprès des pouvoirs publics', 'Un parti politique', 'Un groupe parlementaire', 'Un institut de sondage'], 0, 'Syndicats, patronat, ONG, associations d’usagers.'],
            ['Le lobbying est-il encadré en France ?', ['Oui, par un registre des représentants d’intérêts', 'Non, il est libre', 'Non, il est interdit', 'Oui, mais seulement au Parlement européen'], 0, 'La transparence est la contrepartie de son autorisation.'],
            ['Quel risque les réseaux sociaux font-ils peser sur le débat public ?', ['La désinformation et l’enfermement dans des bulles de filtre', 'La disparition des partis', 'La fin des élections', 'L’interdiction des sondages'], 0, 'Ils accélèrent aussi la circulation de l’information.'],
            ['L’abstention est un comportement politique.', ['Vrai', 'Faux'], 0, 'Elle peut exprimer de l’indifférence comme une protestation.'],
            ['Quelles formes peut prendre la participation politique ?', ['Vote, militantisme, pétition, manifestation, boycott, engagement associatif', 'Le vote uniquement', 'Le vote et l’adhésion à un parti', 'La candidature à une élection'], 0, 'Elle déborde largement le jour du scrutin.'],
            ['Chez qui l’abstention progresse-t-elle le plus ?', ['Chez les jeunes et les moins diplômés', 'Chez les cadres', 'Chez les retraités', 'Chez les élus locaux'], 0, 'Un enjeu majeur pour la représentativité des élus.'],
          ],
        },

        // ===================================================================
        // Chapitre 6 : diplôme, emploi et salaire
        // ===================================================================
        {
          titre: 'Un emploi qualifié suppose un investissement en capital humain',
          axe: 'Quelles relations entre le diplôme, l’emploi et le salaire ?',
          lecon: {
            titre: 'Se former, c’est investir',
            cours: `Faire des études coûte du temps, de l’argent et un salaire auquel on renonce. En économie, on analyse cette dépense comme un **investissement** dont on attend un rendement.

## Le capital humain
La théorie du **capital humain**, formulée par **Gary Becker**, considère les connaissances, les compétences et la santé comme un capital qui rend le travail plus productif. On l’accumule par la formation initiale, l’expérience, la formation continue.

## Un calcul coût-avantage
Les **coûts** sont directs (frais de scolarité, logement, matériel) et indirects — le **coût d’opportunité**, c’est-à-dire les salaires non perçus pendant les études. Les **avantages** sont un salaire plus élevé, un risque de chômage plus faible, de meilleures conditions de travail, une carrière plus ascendante.

> On ne compare pas seulement un diplôme à un autre : on compare des années d’études à des années de salaire.

## Qualification et compétences
La **qualification** désigne l’ensemble des savoirs et savoir-faire reconnus, souvent par un diplôme ou une convention collective. Elle ne se confond pas avec le poste occupé : on peut être **déclassé**, c’est-à-dire occuper un emploi moins qualifié que son diplôme.

## Le rôle du signal
Une autre lecture, la théorie du **signal**, souligne que le diplôme informe l’employeur sur des qualités difficiles à observer — persévérance, capacité d’apprentissage — même s’il n’a pas directement enseigné le métier. Les deux mécanismes coexistent dans la réalité du marché du travail.`,
          },
          questions: [
            ['Qu’est-ce que le capital humain ?', ['L’ensemble des connaissances, compétences et de la santé qui rendent le travail productif', 'Le nombre de salariés', 'Le capital détenu par les ménages', 'La masse salariale d’une entreprise'], 0, 'Notion formulée notamment par Gary Becker.'],
            ['Quel économiste a formalisé la théorie du capital humain ?', ['Gary Becker', 'John Maynard Keynes', 'Adam Smith', 'Karl Marx'], 0, 'Il applique le raisonnement de l’investissement à la formation.'],
            ['Quel est le coût d’opportunité des études ?', ['Les revenus auxquels on renonce pendant la durée des études', 'Les frais de scolarité', 'Le prix des livres', 'Le coût du logement étudiant'], 0, 'C’est un coût indirect, souvent le plus élevé.'],
            ['Quels avantages attend-on d’un investissement en formation ?', ['Un salaire plus élevé et un risque de chômage plus faible', 'Une réduction d’impôt', 'Un accès à la fonction publique', 'Une retraite anticipée'], 0, 'Ainsi que de meilleures conditions et perspectives de carrière.'],
            ['Qu’est-ce que le déclassement ?', ['Occuper un emploi moins qualifié que son diplôme', 'Perdre son emploi', 'Changer de secteur d’activité', 'Être rétrogradé après une faute'], 0, 'Il concerne particulièrement les jeunes diplômés en début de carrière.'],
            ['Selon la théorie du signal, le diplôme informe l’employeur sur des qualités difficiles à observer.', ['Vrai', 'Faux'], 0, 'Persévérance, capacité d’apprentissage, aptitude à suivre des règles.'],
            ['La qualification se confond-elle avec le poste occupé ?', ['Non, on peut occuper un poste moins qualifié que sa qualification', 'Oui, toujours', 'Oui, dans le secteur privé', 'Non, elle ne dépend que de l’ancienneté'], 0, 'D’où la notion de déclassement.'],
            ['Comment accumule-t-on du capital humain ?', ['Par la formation initiale, l’expérience et la formation continue', 'Par l’épargne', 'Par l’héritage uniquement', 'Par l’achat d’équipements'], 0, 'L’expérience compte autant que le diplôme dans certains métiers.'],
          ],
        },
        {
          titre: 'Le manque de qualifications : une des causes du chômage',
          axe: 'Quelles relations entre le diplôme, l’emploi et le salaire ?',
          lecon: {
            titre: 'Pourquoi le chômage frappe d’abord les moins diplômés',
            cours: `Le **chômage** ne se répartit pas au hasard. En France comme ailleurs, le taux de chômage des non-diplômés est plusieurs fois supérieur à celui des diplômés du supérieur.

## Définir et mesurer
Au sens du **Bureau international du travail**, est chômeur celui qui est sans emploi, disponible et à la recherche active d’un emploi. Le **taux de chômage** rapporte le nombre de chômeurs à la **population active** — actifs occupés plus chômeurs — et non à la population totale.

## Le chômage structurel lié à la qualification
Une partie du chômage vient d’une **inadéquation** entre les qualifications offertes par les demandeurs d’emploi et celles recherchées par les entreprises. Le progrès technique, la numérisation et l’automatisation détruisent surtout des emplois **routiniers** peu qualifiés, tout en créant des emplois plus qualifiés ailleurs.

> Une économie peut créer des emplois et laisser sur le bord de la route ceux qui n’ont pas la qualification qu’elle demande.

## Les autres causes
Le chômage **conjoncturel** vient d’une demande insuffisante en période de ralentissement. S’y ajoutent le **chômage frictionnel**, lié au temps de recherche entre deux emplois, et les effets d’un coût du travail élevé au voisinage du salaire minimum pour les emplois les moins productifs.

## Les politiques
Formation initiale et continue, apprentissage, accompagnement personnalisé, **allègements de cotisations** sur les bas salaires, aides à la mobilité. À l’inverse, les politiques de soutien à la demande visent le chômage conjoncturel. Les deux ne traitent pas le même problème.`,
          },
          questions: [
            ['Qui est chômeur au sens du Bureau international du travail ?', ['Une personne sans emploi, disponible et en recherche active', 'Toute personne inscrite à France Travail', 'Toute personne sans revenu', 'Toute personne en formation'], 0, 'Trois conditions cumulatives.'],
            ['Comment calcule-t-on le taux de chômage ?', ['Chômeurs rapportés à la population active', 'Chômeurs rapportés à la population totale', 'Chômeurs rapportés aux actifs occupés', 'Chômeurs rapportés aux salariés'], 0, 'La population active comprend les actifs occupés et les chômeurs.'],
            ['Quel type de chômage résulte d’une inadéquation des qualifications ?', ['Le chômage structurel', 'Le chômage conjoncturel', 'Le chômage frictionnel', 'Le chômage saisonnier'], 0, 'Il ne se résorbe pas par la seule reprise économique.'],
            ['Quels emplois l’automatisation détruit-elle le plus ?', ['Les emplois routiniers peu qualifiés', 'Les emplois de cadres', 'Les emplois de santé', 'Les emplois artistiques'], 0, 'Elle en crée d’autres, plus qualifiés.'],
            ['Qu’est-ce que le chômage frictionnel ?', ['Le chômage lié au temps de recherche entre deux emplois', 'Le chômage dû à une crise', 'Le chômage de longue durée', 'Le chômage des seniors'], 0, 'Il existe même quand l’économie va bien.'],
            ['Le taux de chômage des non-diplômés est plus élevé que celui des diplômés du supérieur.', ['Vrai', 'Faux'], 0, 'L’écart est de plusieurs points, durablement.'],
            ['Quelle politique vise le chômage structurel lié aux qualifications ?', ['La formation et l’apprentissage', 'La relance de la demande', 'La baisse des taux d’intérêt', 'L’augmentation des dépenses publiques'], 0, 'Soutenir la demande traite le chômage conjoncturel, pas celui-là.'],
            ['Pourquoi allège-t-on les cotisations sur les bas salaires ?', ['Pour réduire le coût du travail des emplois les moins productifs', 'Pour augmenter les salaires nets', 'Pour financer la formation', 'Pour favoriser les exportations'], 0, 'Une politique très utilisée en France depuis les années 1990.'],
          ],
        },
        {
          titre: 'L’influence du diplôme et de l’expérience sur le niveau de salaire',
          axe: 'Quelles relations entre le diplôme, l’emploi et le salaire ?',
          lecon: {
            titre: 'Ce qui explique un bulletin de paie',
            cours: `Le salaire n’est pas un chiffre arbitraire. Il dépend de la productivité attendue, de la rareté de la qualification, des règles collectives et du rapport de force sur le marché du travail.

## Le rendement du diplôme
Plus le niveau de diplôme est élevé, plus le salaire moyen l’est aussi. Les écarts se creusent au fil de la carrière : un diplômé du supérieur bénéficie non seulement d’un salaire de départ plus élevé, mais aussi d’une progression plus rapide.

## L’expérience et l’ancienneté
L’**expérience** accroît la productivité et la valeur sur le marché du travail ; l’**ancienneté** est souvent rémunérée par les conventions collectives. Les courbes de salaire selon l’âge montent fortement en début de carrière, puis s’aplatissent. Cet effet est plus marqué pour les cadres que pour les ouvriers.

> Deux personnes de même diplôme ne gagnent pas la même chose : le secteur, la taille de l’entreprise et la région comptent aussi.

## Les règles collectives
Le **salaire minimum** fixe un plancher légal ; les **conventions collectives** définissent des grilles par branche ; la négociation d’entreprise ajuste. La loi impose l’égalité de rémunération entre les femmes et les hommes pour un même travail, sans que l’écart ait disparu.

## Les autres déterminants
Le secteur d’activité, la taille de l’entreprise — les grandes paient en moyenne davantage —, la région, le statut public ou privé, le temps de travail, et le pouvoir de négociation individuel ou syndical. Le salaire est aussi le résultat d’un rapport de force.`,
          },
          questions: [
            ['Quelle relation observe-t-on entre diplôme et salaire ?', ['Le salaire moyen augmente avec le niveau de diplôme', 'Le salaire est indépendant du diplôme', 'Le salaire baisse avec le diplôme', 'La relation n’existe qu’en début de carrière'], 0, 'Et l’écart se creuse au fil de la carrière.'],
            ['Quelle différence entre expérience et ancienneté ?', ['L’expérience accroît la productivité, l’ancienneté est souvent rémunérée par convention', 'Ce sont deux synonymes', 'L’ancienneté est illégale', 'L’expérience ne compte pas dans le salaire'], 0, 'Les grilles conventionnelles rémunèrent l’ancienneté.'],
            ['Comment évolue la courbe des salaires au cours d’une carrière ?', ['Forte progression au début, puis aplatissement', 'Progression linéaire jusqu’à la retraite', 'Baisse continue', 'Aucune évolution'], 0, 'Effet plus marqué pour les cadres que pour les ouvriers.'],
            ['Qu’est-ce qu’une convention collective ?', ['Un accord de branche fixant notamment des grilles de salaires', 'Un contrat de travail individuel', 'Une loi votée par le Parlement', 'Un règlement intérieur d’entreprise'], 0, 'Elle s’impose aux entreprises de la branche.'],
            ['Le salaire minimum fixe un plancher légal de rémunération.', ['Vrai', 'Faux'], 0, 'Aucune rémunération ne peut lui être inférieure pour un temps plein.'],
            ['Les grandes entreprises paient-elles en moyenne davantage ?', ['Oui, à qualification comparable', 'Non, moins', 'Elles paient exactement pareil', 'Cela dépend uniquement de la région'], 0, 'Effet de taille bien documenté.'],
            ['Qu’est-ce qui, en dehors du diplôme, influence le salaire ?', ['Le secteur, la taille de l’entreprise, la région et le pouvoir de négociation', 'Uniquement l’âge', 'Uniquement le statut marital', 'Uniquement la durée du contrat'], 0, 'Le salaire résulte aussi d’un rapport de force.'],
            ['La loi impose-t-elle l’égalité salariale entre femmes et hommes ?', ['Oui, pour un même travail ou un travail de valeur égale', 'Non, elle recommande seulement', 'Oui, depuis 2020 uniquement', 'Non, cela relève des entreprises'], 0, 'L’écart persiste malgré la règle.'],
          ],
        },
        {
          titre: 'L’influence du genre et de l’origine sociale sur les trajectoires professionnelles',
          axe: 'Quelles relations entre le diplôme, l’emploi et le salaire ?',
          lecon: {
            titre: 'À diplôme égal, des carrières inégales',
            cours: `Le diplôme explique beaucoup, mais pas tout. À niveau de formation identique, les carrières diffèrent selon le sexe et selon le milieu d’origine.

## Les écarts de salaire entre femmes et hommes
En France, l’écart de salaire moyen entre femmes et hommes reste de l’ordre de 14 % en équivalent temps plein, et d’environ 4 % à poste et profil comparables. Trois mécanismes se combinent : le **temps partiel**, très féminin ; la **ségrégation professionnelle**, les femmes étant concentrées dans des métiers moins rémunérés ; et les **interruptions de carrière** liées aux enfants.

## Le plafond de verre
Les femmes accèdent moins souvent aux postes de direction, malgré une réussite scolaire supérieure en moyenne. On parle de **plafond de verre** : un obstacle qui ne figure dans aucun règlement mais qui produit des effets mesurables. Des lois sur la parité dans les conseils d’administration et l’index d’égalité professionnelle tentent d’y remédier.

> Un obstacle invisible reste un obstacle : il se mesure à ce qu’il empêche.

## L’origine sociale
À diplôme égal, les enfants de cadres accèdent plus souvent aux positions les plus élevées : réseaux familiaux, information sur les filières, aisance dans les codes des entretiens, aide financière permettant des stages non rémunérés ou une mobilité. Ces ressources ne figurent sur aucun CV.

## Mobilité et reproduction
La **mobilité sociale** existe : beaucoup d’enfants occupent une position différente de celle de leurs parents, notamment par la hausse générale du niveau de diplôme. Mais la **reproduction** reste forte aux deux extrémités de l’échelle, et les discriminations à l’embauche, mesurées par des tests, s’ajoutent aux inégalités de ressources.`,
          },
          questions: [
            ['Quel est approximativement l’écart de salaire entre femmes et hommes en équivalent temps plein en France ?', ['Environ 14 %', 'Environ 40 %', 'Environ 2 %', 'Il n’y a plus d’écart'], 0, 'Il se réduit à environ 4 % à poste et profil comparables.'],
            ['Quel mécanisme explique une partie de l’écart salarial entre femmes et hommes ?', ['Le temps partiel, très féminin', 'Un niveau de diplôme inférieur des femmes', 'Une productivité moindre', 'Une législation défavorable'], 0, 'Avec la ségrégation professionnelle et les interruptions de carrière.'],
            ['Qu’est-ce que le plafond de verre ?', ['Un obstacle invisible qui limite l’accès des femmes aux postes de direction', 'Une limite légale de salaire', 'Un seuil d’imposition', 'Un plafond de cotisations'], 0, 'Il ne figure dans aucun règlement mais produit des effets mesurables.'],
            ['Qu’est-ce que la ségrégation professionnelle ?', ['La concentration des femmes et des hommes dans des métiers différents', 'L’interdiction d’exercer certains métiers', 'La séparation des équipes dans l’entreprise', 'Le refus d’embaucher des jeunes'], 0, 'Les métiers très féminisés sont en moyenne moins rémunérés.'],
            ['Pourquoi, à diplôme égal, les enfants de cadres réussissent-ils mieux professionnellement ?', ['Réseaux, information, codes sociaux et soutien financier', 'Un diplôme de meilleure qualité', 'Une intelligence supérieure', 'Un droit d’accès prioritaire'], 0, 'Des ressources qui ne figurent sur aucun CV.'],
            ['La mobilité sociale a totalement disparu en France.', ['Vrai', 'Faux'], 1, 'Elle existe, mais la reproduction reste forte aux deux extrémités.'],
            ['Comment mesure-t-on les discriminations à l’embauche ?', ['Par des tests envoyant des candidatures comparables ne différant que par un critère', 'Par des sondages d’opinion', 'Par les déclarations des entreprises', 'Elles ne sont pas mesurables'], 0, 'La méthode du testing isole l’effet du critère discriminant.'],
            ['Quelle mesure vise à féminiser les instances dirigeantes ?', ['Les lois sur la parité dans les conseils d’administration', 'Le salaire minimum', 'Les allègements de cotisations', 'Le compte personnel de formation'], 0, 'Avec l’index d’égalité professionnelle.'],
          ],
        },
      ],
    },
  ],
}
