// EMC — Seconde : « La liberté, les libertés », soit les 10 fiches de ses TROIS
// chapitres.
//
// LE TEXTE QUI FAIT FOI. Arrêté du 3 juin 2024, **BO n° 24 du 13 juin 2024** —
// le programme d'EMC du CP à la terminale, applicable à tous les niveaux à la
// rentrée 2026-2027, celle que vivent les élèves aujourd'hui. Il donne à chaque
// année du lycée une thématique : la SECONDE étudie la liberté, la première la
// société, la terminale la démocratie. Le libellé de l'année de seconde est
// « La liberté, les libertés », et la maquette de référence l'organise en trois
// chapitres :
//   1. L'État de droit : garant des droits, libertés et d'un pluralisme
//      démocratique — État de droit, séparation des pouvoirs, hiérarchie des
//      normes, laïcité, libertés fondamentales et ordre public ;
//   2. Libertés et responsabilité : l'information — liberté de la presse,
//      liberté d'expression et ses limites, régulation des réseaux sociaux ;
//   3. Droit et responsabilité : la protection de l'environnement et la
//      sauvegarde de la biodiversité — droit de l'environnement, démocratie
//      environnementale, droit animalier.
//
// LE DÉFAUT QUE ÇA CORRIGE. L'EMC de Seconde n'a que les TROIS fiches du socle
// lycée de la migration 216 — « La liberté d'expression et ses limites »,
// « Démocratie et État de droit », « Enjeux du numérique et de l'information » —,
// écrites pour la 2de, la 1re et la Tle à la fois. Deux d'entre elles relèvent
// bien, dans le programme de 2024, de la seconde — mais en une fiche chacune, là
// où le programme demande un chapitre entier. Et rien, absolument rien, sur la
// hiérarchie des normes, la loi de 1905, l'ordre public, la Charte de
// l'environnement, la Convention citoyenne pour le climat ou le statut juridique
// de l'animal.
//
// LES TROIS FICHES DU SOCLE S'EN VONT, AU SEUL NIVEAU 2de — c'est la décision
// prise en 250 pour la Terminale et en 277 pour la Première, et pour la même
// raison : trois lignes hors chapitre en TÊTE de liste rouvrent le doute sur les
// dix autres. La 2de était jusqu'ici le dernier niveau du lycée à les garder,
// parce que rien ne venait les remplacer. Ce module les remplace.
//
// LE REPÈRE DU MÉNAGE EST `theme IS NULL`, PAS LE TITRE — même choix qu'en 266,
// 267, 276 et 277. Deux des trois titres portent une apostrophe TYPOGRAPHIQUE
// (« La liberté d'expression et ses limites », « Enjeux du numérique et de
// l'information ») : un DELETE qui se tromperait d'apostrophe ne trouverait rien
// EN SILENCE. Le critère « pas de chapitre de programme » vise exactement les
// trois lignes voulues — elles datent de la 216, bien avant la colonne theme,
// tandis que les 10 fiches neuves en portent un dès l'INSERT.
//
// ⚠️ Le slug reste `emc` et QUATRE modules le portent désormais (`emc.mjs` → 216,
// `emc-tle.mjs` → 230, `emc-1re.mjs` → 277, celui-ci → 284) : ne JAMAIS générer
// avec `--slugs emc`, qui les fusionnerait et réécrirait trois migrations.
// Toujours `--modules emc-2de`.
//
// ⚠️ LA 216 EST REJOUABLE : la recoller un jour ferait revenir les trois fiches
// au niveau 2de. C'est le prix de l'idempotence — 216 ne peut pas être modifiée.

export default {
  slug: 'emc',
  nom: 'EMC',

  titreMigration: 'EMC 2de — « LA LIBERTÉ, LES LIBERTÉS » (10 fiches)',

  motif: `LE DÉFAUT : l'EMC de Seconde n'avait que les 3 fiches du socle lycée de la
migration 216 — « La liberté d'expression et ses limites », « Démocratie et État
de droit », « Enjeux du numérique et de l'information » —, écrites pour la 2de,
la 1re et la Tle à la fois. Un élève de 2de qui révisait la hiérarchie des
normes, la séparation des pouvoirs, la loi de 1905, l'ordre public, le rôle du
Défenseur des droits, la Charte de l'environnement, la Convention citoyenne pour
le climat ou le statut juridique de l'animal ne trouvait RIEN.
LE TEXTE QUI FAIT FOI : le programme d'EMC du BO n° 24 du 13 juin 2024,
applicable à tous les niveaux à la rentrée 2026-2027. L'année de Seconde y a pour
thématique « La liberté, les libertés » et se déplie en trois chapitres :
l'État de droit, les libertés et la responsabilité face à l'information, le droit
et la responsabilité en matière d'environnement et de biodiversité. Cette
migration installe leurs 10 fiches, aux positions 1 à 10.
LES 3 FICHES DU SOCLE PARTENT, AU SEUL NIVEAU 2de — décision prise en 250 pour la
Terminale et en 277 pour la Première, pour la même raison : trois lignes hors
chapitre en tête de liste rouvrent le doute sur les dix autres. La 2de était le
dernier niveau du lycée à les garder, faute de remplacement : ce n'est plus le
cas.
⚠️ LA 216 EST REJOUABLE : la recoller ferait revenir les 3 fiches au niveau 2de.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme, et l'INSERT l'écrit pour les 10 fiches. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS, comme dans les migrations 243 à 283 — la 234 n'a jamais été
exécutée telle quelle. Sans cette reprise, la migration échouerait sur « column
chapters.theme does not exist », les 3 anciennes fiches déjà supprimées et les 10
neuves pas encore posées : une matière vide.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
(pour cacher mind_map) et ne l'a rendu que colonne par colonne ; une colonne
ajoutée après elle n'hérite d'aucun droit, et l'app lirait « permission denied »
au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 3 fiches du socle lycée partent, au niveau 2de SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — même choix qu'en anglais (266), en
espagnol (267), en allemand (276) et en EMC de Première (277). Deux des trois
titres portent une apostrophe TYPOGRAPHIQUE, et un DELETE qui se tromperait
d'apostrophe ne trouverait rien EN SILENCE. Le critère « pas de chapitre de
programme » vise exactement les trois lignes voulues : elles datent de la 216,
bien avant la colonne theme, tandis que les 10 fiches neuves en portent un dès
l'INSERT — le ménage tourne AVANT les insertions et ne peut donc jamais mordre
sur elles, ni au premier passage ni au rejeu.
Le filtre level = '2de' est indispensable : le collège a ses propres chapitres
dans la 216, eux aussi sans theme, et rien ne viendrait les remplacer.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
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
   AND s.slug = 'emc'
   AND c.level = '2de'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level = '2de'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level = '2de'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['2de'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : l'État de droit
        // ===================================================================
        {
          titre: 'Qu’est-ce que l’État de droit ?',
          axe: 'L’État de droit : garant des droits, libertés et d’un pluralisme démocratique',
          lecon: {
            titre: 'Un pouvoir qui obéit à ses propres règles',
            cours: `L’**État de droit** est un État dans lequel **tous** — gouvernants comme gouvernés — sont soumis au droit. Son contraire n’est pas l’absence de lois : un État autoritaire en a beaucoup. Son contraire, c’est l’**arbitraire**, c’est-à-dire un pouvoir qui n’est pas lié par les règles qu’il édicte.

## Trois conditions
Un État de droit suppose une **hiérarchie des normes** respectée, une **séparation des pouvoirs** effective, et des **juges indépendants** devant lesquels chacun peut contester une décision publique.

## La hiérarchie des normes
Les règles s’emboîtent, de la plus forte à la plus faible : la **Constitution** (et le bloc de constitutionnalité, qui comprend la Déclaration des droits de l’homme et du citoyen de 1789 et le Préambule de 1946), les **traités internationaux** et le droit de l’Union européenne, la **loi** votée par le Parlement, les **règlements** (décrets, arrêtés), enfin les contrats. Une norme inférieure qui contredit une norme supérieure peut être annulée.

> Ce n’est pas la force qui valide une règle, c’est sa conformité à la règle du dessus.

## La séparation des pouvoirs
Formulée par **Montesquieu** en 1748 dans De l’esprit des lois : le pouvoir **législatif** fait la loi, l’**exécutif** l’applique, le **judiciaire** la fait respecter. Chacun limite les autres — « il faut que le pouvoir arrête le pouvoir ».

## Les gardiens
Le **Conseil constitutionnel** contrôle la conformité des lois à la Constitution, y compris après leur entrée en vigueur grâce à la **question prioritaire de constitutionnalité** (QPC, depuis 2010). Le **Conseil d’État** juge l’administration. La **Cour de cassation** unifie l’interprétation du droit. La **Cour européenne des droits de l’homme** (CEDH), à Strasbourg, peut condamner la France.

## Ce que ça change pour un citoyen
Il peut contester un refus de l’administration, demander réparation d’un dommage causé par l’État, faire écarter une loi contraire à la Constitution. Sans État de droit, ces recours n’existent pas.`,
          },
          questions: [
            ['Qu’est-ce qu’un État de droit ?', ['Un État où gouvernants et gouvernés sont soumis au droit', 'Un État qui a beaucoup de lois', 'Un État dirigé par des juges', 'Un État sans Constitution'], 0, 'Son contraire n’est pas l’absence de lois, mais l’arbitraire.'],
            ['Quelle norme se trouve au sommet de la hiérarchie en France ?', ['La Constitution', 'La loi', 'Le décret', 'L’arrêté municipal'], 0, 'Avec le bloc de constitutionnalité qu’elle entraîne.'],
            ['Qui a formulé le principe de séparation des pouvoirs en 1748 ?', ['Montesquieu', 'Rousseau', 'Voltaire', 'Diderot'], 0, 'Dans De l’esprit des lois : « il faut que le pouvoir arrête le pouvoir ».'],
            ['Quels sont les trois pouvoirs ?', ['Législatif, exécutif, judiciaire', 'Politique, économique, médiatique', 'Local, national, européen', 'Civil, pénal, administratif'], 0, 'Chacun limite les deux autres.'],
            ['Que permet la question prioritaire de constitutionnalité, créée en 2010 ?', ['Contester la constitutionnalité d’une loi déjà en vigueur', 'Modifier la Constitution', 'Faire appel d’un jugement pénal', 'Saisir la CEDH directement'], 0, 'Le contrôle ne s’arrête plus à la promulgation.'],
            ['Quelle juridiction juge les litiges avec l’administration ?', ['Le Conseil d’État', 'La Cour de cassation', 'Le Conseil constitutionnel', 'La Cour des comptes'], 0, 'Il est au sommet de l’ordre administratif.'],
            ['Un décret contraire à la loi peut être annulé par le juge.', ['Vrai', 'Faux'], 0, 'C’est le principe de la hiérarchie des normes.'],
            ['Quelle cour européenne peut condamner la France pour violation des droits fondamentaux ?', ['La Cour européenne des droits de l’homme, à Strasbourg', 'La Cour de justice de l’Union européenne, à Luxembourg', 'La Cour pénale internationale, à La Haye', 'Le Conseil de l’Europe, à Bruxelles'], 0, 'Après épuisement des recours internes.'],
          ],
        },
        {
          titre: 'L’État de droit : le fruit d’une longue évolution',
          axe: 'L’État de droit : garant des droits, libertés et d’un pluralisme démocratique',
          lecon: {
            titre: 'Huit siècles pour limiter le pouvoir',
            cours: `L’État de droit n’a pas été décrété : il s’est construit par étapes, presque toujours après une crise.

## Les premières limites
En 1215, la **Magna Carta** anglaise impose au roi de ne pas emprisonner un homme libre sans jugement. C’est l’ancêtre lointain de l’**habeas corpus** (1679). En France, l’Ancien Régime connaît des « lois fondamentales du royaume », mais le roi n’est jugé par personne.

## 1789 et la Déclaration
La **Déclaration des droits de l’homme et du citoyen** du 26 août 1789 pose les principes : les hommes naissent libres et égaux en droits (art. 1), la liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui (art. 4), nul ne peut être puni qu’en vertu d’une loi antérieure (art. 8), toute société où la garantie des droits n’est pas assurée n’a point de Constitution (art. 16).

> L’article 16 est la définition la plus courte de l’État de droit : sans garantie des droits ni séparation des pouvoirs, il n’y a pas de Constitution du tout.

## Le XIXe et le XXe siècle
Les libertés s’installent par des lois : **1881** liberté de la presse et école, **1884** liberté syndicale, **1901** liberté d’association, **1905** séparation des Églises et de l’État. Puis les femmes obtiennent le **droit de vote en 1944**.

## Après 1945
Face à ce qu’ont fait des États légaux mais criminels, la garantie devient internationale : **Déclaration universelle des droits de l’homme** (1948), **Convention européenne des droits de l’homme** (1950). En France, la **Constitution de 1958** crée le Conseil constitutionnel, qui s’émancipe en **1971** en donnant valeur constitutionnelle au Préambule — donc à la Déclaration de 1789.

## Aujourd’hui
Le mouvement continue : abolition de la peine de mort (**1981**), QPC (2010), création du **Défenseur des droits** (2011). Rien n’est acquis : chaque état d’urgence rouvre la question de l’équilibre entre sécurité et libertés.`,
          },
          questions: [
            ['Quel texte anglais de 1215 limite pour la première fois le pouvoir royal ?', ['La Magna Carta', 'L’Habeas Corpus', 'Le Bill of Rights', 'La Pétition de droit'], 0, 'Elle interdit d’emprisonner un homme libre sans jugement.'],
            ['Que dit l’article 16 de la Déclaration de 1789 ?', ['Sans garantie des droits ni séparation des pouvoirs, il n’y a pas de Constitution', 'Les hommes naissent libres et égaux', 'Nul ne peut être puni sans loi antérieure', 'La propriété est un droit inviolable'], 0, 'C’est la définition la plus courte de l’État de droit.'],
            ['Que garantit la loi de 1901 ?', ['La liberté d’association', 'La liberté de la presse', 'La liberté syndicale', 'La laïcité'], 0, '1881 pour la presse, 1884 pour les syndicats, 1905 pour la laïcité.'],
            ['En quelle année les femmes obtiennent-elles le droit de vote en France ?', ['1944', '1918', '1936', '1958'], 0, 'Par ordonnance du Gouvernement provisoire.'],
            ['Quel texte international est adopté en 1948 ?', ['La Déclaration universelle des droits de l’homme', 'La Convention européenne des droits de l’homme', 'La Charte des Nations unies', 'La Convention de Genève'], 0, 'La Convention européenne date de 1950.'],
            ['Que se passe-t-il en 1971 pour le Conseil constitutionnel ?', ['Il donne valeur constitutionnelle au Préambule, donc à la Déclaration de 1789', 'Il est créé', 'Il est supprimé', 'Il devient élu'], 0, 'Une décision qui élargit considérablement son contrôle.'],
            ['En quelle année la peine de mort est-elle abolie en France ?', ['1981', '1974', '1958', '1995'], 0, 'Portée par le garde des Sceaux Robert Badinter.'],
            ['L’État de droit une fois établi ne peut plus reculer.', ['Vrai', 'Faux'], 1, 'Chaque état d’urgence rouvre la question de son équilibre.'],
          ],
        },
        {
          titre: 'La laïcité en France',
          axe: 'L’État de droit : garant des droits, libertés et d’un pluralisme démocratique',
          lecon: {
            titre: 'Ce que la loi de 1905 dit, et ce qu’elle ne dit pas',
            cours: `La **laïcité** n’est pas une opinion sur la religion : c’est une **règle d’organisation** de l’État, qui garantit à la fois la liberté de croire ou de ne pas croire et l’égalité des citoyens quelles que soient leurs convictions.

## Les deux articles fondateurs
La **loi du 9 décembre 1905** de séparation des Églises et de l’État tient dans deux articles décisifs. L’**article 1** : la République assure la liberté de conscience et garantit le libre exercice des cultes. L’**article 2** : la République ne reconnaît, ne salarie ni ne subventionne aucun culte.

> D’abord la liberté, ensuite la séparation : l’ordre des deux articles n’est pas un détail, c’est le sens même de la loi.

## Ce qui en découle
L’État est **neutre** : il ne privilégie aucune religion, n’en combat aucune. Les **agents publics** sont soumis à une stricte neutralité dans l’exercice de leurs fonctions. Les **usagers** du service public, eux, restent libres — sauf exceptions prévues par la loi.

## À l’école
La loi du **15 mars 2004** interdit, dans les écoles, collèges et lycées publics, le port de **signes ou tenues manifestant ostensiblement une appartenance religieuse** par les élèves. La **Charte de la laïcité à l’école** (2013) explicite ces principes. À l’université, la règle est différente : les étudiants sont majeurs et libres.

## Ce que la laïcité n’est pas
Ce n’est pas l’interdiction de croire, ni l’effacement des religions de l’espace public — la rue, un commerce, une association ne sont pas soumis à la neutralité. Ce n’est pas non plus une valeur dirigée contre une religion en particulier.

## Les particularités
L’**Alsace-Moselle**, allemande en 1905, conserve le régime concordataire ; la **Guyane** a un statut propre. La laïcité française reste un cas particulier en Europe : d’autres démocraties financent des cultes ou ont une religion d’État tout en garantissant la liberté religieuse.`,
          },
          questions: [
            ['Que garantit l’article 1 de la loi de 1905 ?', ['La liberté de conscience et le libre exercice des cultes', 'La séparation des Églises et de l’État', 'La neutralité des agents publics', 'La gratuité de l’école'], 0, 'La liberté vient avant la séparation, énoncée à l’article 2.'],
            ['Que dit l’article 2 de la loi de 1905 ?', ['La République ne reconnaît, ne salarie ni ne subventionne aucun culte', 'Les cultes sont interdits', 'L’État nomme les ministres du culte', 'Les bâtiments religieux sont détruits'], 0, 'C’est le principe de séparation.'],
            ['Qui est soumis à une stricte neutralité religieuse dans le service public ?', ['Les agents publics dans l’exercice de leurs fonctions', 'Tous les citoyens en tout lieu', 'Les usagers du service public', 'Les commerçants'], 0, 'Les usagers restent libres, sauf exceptions prévues par la loi.'],
            ['Que prévoit la loi du 15 mars 2004 ?', ['L’interdiction des signes religieux ostensibles pour les élèves des écoles publiques', 'L’interdiction du voile dans la rue', 'La suppression de l’enseignement du fait religieux', 'La neutralité des parents d’élèves'], 0, 'Elle vise les élèves des écoles, collèges et lycées publics.'],
            ['La règle de 2004 s’applique-t-elle à l’université ?', ['Non, les étudiants y sont majeurs et libres', 'Oui, de la même manière', 'Oui, mais seulement en licence', 'Elle s’applique aux enseignants seulement'], 0, 'Le régime universitaire est distinct.'],
            ['Quel territoire conserve un régime concordataire ?', ['L’Alsace-Moselle', 'La Corse', 'La Bretagne', 'La Savoie'], 0, 'Elle était allemande au moment du vote de la loi de 1905.'],
            ['La laïcité interdit de croire et de pratiquer une religion.', ['Vrai', 'Faux'], 1, 'Elle garantit au contraire la liberté de conscience et de culte.'],
            ['Quel document de 2013 explicite les principes de laïcité à destination des élèves ?', ['La Charte de la laïcité à l’école', 'La loi Debré', 'Le Code de l’éducation', 'La circulaire Jospin'], 0, 'Elle est affichée dans les établissements.'],
          ],
        },
        {
          titre: 'Libertés fondamentales et ordre public',
          axe: 'L’État de droit : garant des droits, libertés et d’un pluralisme démocratique',
          lecon: {
            titre: 'Jusqu’où l’État peut-il limiter une liberté ?',
            cours: `Aucune liberté n’est absolue, mais aucune limitation n’est libre : le droit encadre très précisément la manière dont l’État peut restreindre une liberté.

## Les libertés fondamentales
Ce sont les libertés protégées par la Constitution et les traités : liberté d’aller et venir, de conscience, d’expression, de réunion, d’association, de manifestation, droit à la vie privée, droit de propriété, droit à un procès équitable, liberté d’entreprendre.

## L’ordre public
La police administrative peut limiter une liberté pour préserver l’**ordre public**, traditionnellement défini par trois composantes : la **sécurité**, la **tranquillité** et la **salubrité** publiques, auxquelles la jurisprudence ajoute le respect de la **dignité** de la personne humaine.

> L’ordre public n’est pas un pouvoir de tout interdire : c’est un motif, qui doit être prouvé, et une mesure, qui doit être proportionnée.

## Le test de proportionnalité
Le juge administratif vérifie qu’une mesure restrictive est **adaptée** (elle sert bien le but invoqué), **nécessaire** (aucune mesure moins sévère ne suffirait) et **proportionnée** (l’atteinte n’est pas excessive par rapport au bénéfice). Une interdiction générale et absolue est presque toujours annulée : la règle est l’autorisation, l’exception est l’interdiction.

## Le juge du référé
Le **référé-liberté** permet de saisir le juge administratif en urgence : il doit statuer en **48 heures** lorsqu’une liberté fondamentale est gravement et manifestement atteinte.

## Les régimes d’exception
L’**état d’urgence** (loi de 1955, appliqué de 2015 à 2017) élargit les pouvoirs de police. Il reste sous contrôle du juge et du Parlement, mais il illustre le risque principal : des mesures d’exception qui passent peu à peu dans le droit commun.

## Manifester
La manifestation est une liberté, soumise à **déclaration** préalable et non à autorisation. Une interdiction doit être justifiée par un risque précis de trouble, pas par une gêne.`,
          },
          questions: [
            ['Quelles sont les trois composantes classiques de l’ordre public ?', ['Sécurité, tranquillité et salubrité publiques', 'Liberté, égalité, fraternité', 'Police, justice, armée', 'Santé, éducation, transport'], 0, 'La jurisprudence y a ajouté la dignité de la personne humaine.'],
            ['Que vérifie le test de proportionnalité ?', ['Que la mesure est adaptée, nécessaire et proportionnée', 'Que la mesure est votée par le Parlement', 'Que la mesure est publiée au Journal officiel', 'Que la mesure a l’accord du maire'], 0, 'Trois conditions cumulatives contrôlées par le juge.'],
            ['Quel est le sort d’une interdiction générale et absolue ?', ['Elle est presque toujours annulée par le juge', 'Elle est automatiquement valable', 'Elle doit être votée par référendum', 'Elle relève du Conseil constitutionnel seul'], 0, 'La règle est la liberté, l’exception est l’interdiction.'],
            ['En combien de temps le juge doit-il statuer dans un référé-liberté ?', ['48 heures', 'Un mois', 'Une semaine', 'Trois jours ouvrés'], 0, 'C’est ce qui en fait une garantie efficace.'],
            ['La manifestation est-elle soumise à autorisation ?', ['Non, à déclaration préalable', 'Oui, à autorisation du préfet', 'Oui, à autorisation du maire', 'Elle est libre sans aucune formalité'], 0, 'Une interdiction doit être justifiée par un risque précis.'],
            ['De quand date la loi permettant de déclarer l’état d’urgence ?', ['1955', '1905', '1958', '2015'], 0, 'Elle a été appliquée de 2015 à 2017 après les attentats.'],
            ['Une liberté fondamentale ne peut jamais être limitée.', ['Vrai', 'Faux'], 1, 'Elle peut l’être, mais sous conditions strictes et sous contrôle du juge.'],
            ['Quel risque principal les régimes d’exception font-ils courir ?', ['Que des mesures exceptionnelles passent dans le droit commun', 'Qu’ils coûtent trop cher', 'Qu’ils soient inefficaces contre la délinquance', 'Qu’ils soient impopulaires'], 0, 'D’où l’importance du contrôle parlementaire et juridictionnel.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 : libertés et responsabilité, l'information
        // ===================================================================
        {
          titre: 'La liberté de la presse',
          axe: 'Libertés et responsabilité : l’information',
          lecon: {
            titre: 'Une liberté qui protège d’abord le lecteur',
            cours: `La **liberté de la presse** n’est pas un privilège de journaliste : c’est le droit du public d’être informé. Sans elle, la démocratie n’a plus de moyen de contrôler ceux qui gouvernent.

## Le texte de référence
La **loi du 29 juillet 1881** sur la liberté de la presse pose que l’imprimerie et la librairie sont libres. Elle supprime l’autorisation préalable et la censure administrative : on ne demande plus la permission de publier, on répond de ce qu’on a publié. Ce basculement du **contrôle a priori** au **contrôle a posteriori** est le cœur du système.

> On ne juge pas un journal avant qu’il paraisse : on le juge après, devant un tribunal, sur ce qu’il a réellement écrit.

## Les limites prévues par la loi
La même loi de 1881 définit les **abus** : la **diffamation** (imputer un fait précis qui porte atteinte à l’honneur), l’**injure**, la **provocation** à la haine ou à la violence, l’**apologie** de crimes, la publication de fausses nouvelles troublant l’ordre public. La loi **Pleven** (1972) puis la loi **Gayssot** (1990) ont renforcé la répression du racisme et de la négation des crimes contre l’humanité.

## Les garanties du métier
La **protection des sources** est reconnue par la loi de 2010 ; la **clause de conscience** permet à un journaliste de quitter un journal qui change de ligne ; la loi Bloche (2016) protège l’indépendance des rédactions. Le **secret des sources** ne peut être levé que pour un impératif prépondérant d’intérêt public.

## Qui régule ?
Le juge, d’abord. L’**Arcom** (issue en 2022 de la fusion du CSA et de l’Hadopi) régule l’audiovisuel et les plateformes. Des instances professionnelles — conseils de déontologie, sociétés de journalistes — complètent le dispositif.

## Les menaces contemporaines
La **concentration** des médias entre quelques groupes, la dépendance à la publicité, les **procédures-bâillons** destinées à épuiser financièrement un média, la mise en danger physique des reporters, et la difficulté économique de l’information de qualité face aux contenus gratuits.`,
          },
          questions: [
            ['Que change la loi du 29 juillet 1881 ?', ['Elle supprime l’autorisation préalable et instaure un contrôle a posteriori', 'Elle crée la censure administrative', 'Elle interdit les journaux d’opinion', 'Elle nationalise la presse'], 0, 'On répond de ce qu’on publie, on ne demande plus la permission.'],
            ['Qu’est-ce que la diffamation ?', ['Imputer un fait précis portant atteinte à l’honneur d’une personne', 'Insulter quelqu’un sans imputer de fait', 'Publier une information vraie', 'Critiquer une idée'], 0, 'L’injure, elle, n’impute aucun fait précis.'],
            ['Que renforce la loi Pleven de 1972 ?', ['La répression des propos racistes', 'La protection des sources', 'L’indépendance des rédactions', 'Le financement de la presse'], 0, 'La loi Gayssot de 1990 vise la négation des crimes contre l’humanité.'],
            ['Depuis quelle année la protection des sources des journalistes est-elle inscrite dans la loi ?', ['2010', '1881', '1972', '2016'], 0, 'Elle ne peut être levée que pour un impératif prépondérant d’intérêt public.'],
            ['Quelle autorité régule l’audiovisuel et les plateformes depuis 2022 ?', ['L’Arcom', 'Le CSA', 'L’Hadopi', 'La CNIL'], 0, 'Née de la fusion du CSA et de l’Hadopi.'],
            ['Qu’est-ce qu’une procédure-bâillon ?', ['Une action en justice destinée à épuiser financièrement un média', 'Une interdiction de publier', 'Un droit de réponse', 'Une saisie de journaux'], 0, 'Elle vise à décourager l’enquête plus qu’à gagner le procès.'],
            ['La liberté de la presse profite surtout aux journalistes.', ['Vrai', 'Faux'], 1, 'Elle protège d’abord le droit du public à être informé.'],
            ['Que permet la clause de conscience d’un journaliste ?', ['Quitter son journal en cas de changement de ligne éditoriale, avec indemnités', 'Refuser toute enquête', 'Publier sans signer', 'Ne pas révéler ses sources'], 0, 'C’est une garantie d’indépendance professionnelle.'],
          ],
        },
        {
          titre: 'La liberté d’expression',
          axe: 'Libertés et responsabilité : l’information',
          lecon: {
            titre: 'Dire ce qu’on veut, répondre de ce qu’on dit',
            cours: `La **liberté d’expression** est reconnue par l’**article 11** de la Déclaration de 1789 — « la libre communication des pensées et des opinions est un des droits les plus précieux de l’homme » — et par l’**article 10** de la Convention européenne des droits de l’homme.

## Une liberté large
Elle protège les idées qui heurtent, choquent ou inquiètent, et pas seulement celles qui plaisent : c’est une formule constante de la Cour européenne des droits de l’homme. La **caricature**, la **satire**, la **critique** des institutions et des religions en font partie.

> On a le droit de critiquer une religion, une idée, un parti. On n’a pas le droit d’attaquer des personnes en raison de ce qu’elles sont.

## Une liberté responsable
L’article 11 lui-même le dit : chacun répond de l’abus de cette liberté « dans les cas déterminés par la loi ». Sont sanctionnés : l’**injure** et la **diffamation**, la **provocation** à la haine, à la violence ou à la discrimination, l’**apologie du terrorisme**, la **négation** de crimes contre l’humanité, le **harcèlement** en ligne, les **menaces**, l’atteinte à la vie privée et au droit à l’image.

## La ligne de partage
Le droit distingue la critique d’une **idée**, toujours possible, de l’attaque contre des **personnes** en raison de leur origine, leur religion, leur sexe, leur orientation sexuelle ou leur handicap. La première relève du débat ; la seconde du délit.

## En ligne
La liberté d’expression s’applique sur les réseaux, et les infractions aussi. Un message public sur un réseau est une publication : il peut fonder des poursuites, et l’**anonymat** relatif d’un pseudonyme ne protège pas d’une identification judiciaire. Depuis 2018 et 2022, plusieurs textes ont renforcé la lutte contre le cyberharcèlement.

## Au lycée
Les élèves disposent de la liberté d’expression individuelle et collective, dans le respect du **pluralisme**, de la **neutralité** du service public et sans propos injurieux ou diffamatoires. Elle s’exerce notamment par les délégués, le CVL et les journaux lycéens.`,
          },
          questions: [
            ['Quel article de la Déclaration de 1789 consacre la liberté d’expression ?', ['L’article 11', 'L’article 4', 'L’article 16', 'L’article 1'], 0, 'La libre communication des pensées et des opinions.'],
            ['Que protège aussi la liberté d’expression, selon la Cour européenne ?', ['Les idées qui heurtent, choquent ou inquiètent', 'Uniquement les idées consensuelles', 'Uniquement les propos scientifiques', 'Uniquement la parole publique officielle'], 0, 'C’est une formule constante de sa jurisprudence.'],
            ['Où passe la ligne de partage entre critique et délit ?', ['Entre la critique d’une idée et l’attaque de personnes pour ce qu’elles sont', 'Entre l’oral et l’écrit', 'Entre le public et le privé', 'Entre les majeurs et les mineurs'], 0, 'La première relève du débat, la seconde de la loi pénale.'],
            ['A-t-on le droit de critiquer une religion en France ?', ['Oui, critiquer une religion est licite', 'Non, c’est un délit', 'Seulement dans un cadre universitaire', 'Seulement si l’on est croyant'], 0, 'Attaquer des personnes en raison de leur foi, en revanche, est un délit.'],
            ['Un message public publié sous pseudonyme échappe-t-il aux poursuites ?', ['Non, l’anonymat n’empêche pas l’identification judiciaire', 'Oui, toujours', 'Oui, sauf sur les forums', 'Seulement si le compte est privé'], 0, 'Une publication en ligne reste une publication.'],
            ['Lequel de ces propos est sanctionné par la loi ?', ['La provocation à la haine en raison de l’origine', 'La critique d’un parti politique', 'La caricature d’un ministre', 'La contestation d’une réforme'], 0, 'La provocation à la haine ou à la discrimination est un délit.'],
            ['Les élèves de lycée disposent d’une liberté d’expression individuelle et collective.', ['Vrai', 'Faux'], 0, 'Dans le respect du pluralisme et de la neutralité du service public.'],
            ['Que prévoit l’article 11 au sujet des abus de cette liberté ?', ['Que chacun en répond dans les cas déterminés par la loi', 'Qu’il n’existe aucune limite', 'Que le roi en décide', 'Que les tribunaux sont incompétents'], 0, 'La responsabilité est inscrite dans le texte fondateur lui-même.'],
          ],
        },
        {
          titre: 'Comment réguler les réseaux sociaux ?',
          axe: 'Libertés et responsabilité : l’information',
          lecon: {
            titre: 'Des plateformes privées, un espace public',
            cours: `Les réseaux sociaux posent un problème inédit : ce sont des **entreprises privées**, régies par des conditions d’utilisation, qui organisent une part majeure du **débat public**.

## Ce qui rend la régulation difficile
Le **volume** (des millions de contenus par heure), la **vitesse** de diffusion, le caractère **transnational** des plateformes, et le fait que la modération soit assurée par des **algorithmes** et des sous-traitants selon des règles privées, non votées.

## Les algorithmes de recommandation
Ils ne choisissent pas ce qui est vrai, mais ce qui **retient l’attention** — donc souvent ce qui indigne. D’où les phénomènes de **bulle de filtres** et de **chambre d’écho**, qui donnent l’impression que tout le monde pense comme soi, et l’emballement des contenus faux, qui circulent en moyenne plus vite que les vrais.

> Le problème n’est pas seulement ce qui est publié : c’est ce qui est mis en avant.

## Les leviers juridiques
En France, la **LCEN** de 2004 fixe le régime de responsabilité des hébergeurs : ils ne sont pas responsables a priori, mais doivent retirer promptement un contenu manifestement illicite qui leur est signalé. En Europe, le **Digital Services Act** (DSA, applicable depuis 2023-2024) impose aux très grandes plateformes des obligations de transparence des algorithmes, d’analyse des risques, de signalement facilité et d’audit indépendant. Le **RGPD** (2018) encadre l’usage des données personnelles ; la **CNIL** le contrôle.

## Les autres leviers
La **modération** par les plateformes elles-mêmes, l’**éducation aux médias** (EMI) à l’école, le **fact-checking**, la vérification par les utilisateurs, et le signalement — plateforme **Pharos** pour les contenus illicites, **3018** pour le cyberharcèlement.

## Le débat de fond
Trop réguler, c’est risquer la **surcensure** : une plateforme menacée d’amende retire par précaution des contenus légaux. Trop peu, c’est laisser prospérer haine et désinformation. La question centrale reste : qui décide, selon quelles règles, et avec quel recours pour l’utilisateur ?`,
          },
          questions: [
            ['Quel texte européen impose depuis 2023-2024 des obligations aux très grandes plateformes ?', ['Le Digital Services Act (DSA)', 'Le RGPD', 'La LCEN', 'La directive e-commerce'], 0, 'Transparence des algorithmes, analyse des risques, audits indépendants.'],
            ['Que prévoit la LCEN de 2004 pour les hébergeurs ?', ['Ils doivent retirer promptement un contenu manifestement illicite signalé', 'Ils sont responsables de tout contenu publié', 'Ils n’ont aucune obligation', 'Ils doivent valider chaque publication'], 0, 'Pas de responsabilité a priori, mais une obligation de retrait après signalement.'],
            ['Sur quoi les algorithmes de recommandation sont-ils optimisés ?', ['L’attention et l’engagement', 'La véracité des informations', 'La diversité des opinions', 'La qualité rédactionnelle'], 0, 'Ce qui indigne retient l’attention, donc circule.'],
            ['Qu’appelle-t-on chambre d’écho ?', ['Un environnement où l’on ne rencontre que des avis semblables au sien', 'Un forum de discussion animé', 'Un studio d’enregistrement', 'Un espace de modération'], 0, 'Elle donne l’illusion que tout le monde pense comme soi.'],
            ['Quelle autorité française contrôle l’usage des données personnelles ?', ['La CNIL', 'L’Arcom', 'L’Autorité de la concurrence', 'Le Défenseur des droits'], 0, 'Dans le cadre du RGPD, applicable depuis 2018.'],
            ['Quelle plateforme permet de signaler des contenus illicites en ligne en France ?', ['Pharos', 'Pronote', 'Ameli', 'FranceConnect'], 0, 'Le 3018 est dédié au cyberharcèlement des jeunes.'],
            ['Une régulation trop stricte peut conduire les plateformes à la surcensure.', ['Vrai', 'Faux'], 0, 'Menacées d’amende, elles retirent par précaution des contenus légaux.'],
            ['Quelle est la difficulté propre à la modération des plateformes ?', ['Elle applique des règles privées, à très grande échelle et très vite', 'Elle est décidée par le Parlement', 'Elle est confiée aux tribunaux', 'Elle ne concerne que les contenus payants'], 0, 'D’où l’exigence de transparence et de voies de recours.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : droit, environnement et biodiversité
        // ===================================================================
        {
          titre: 'Droits environnementaux dans un contexte de transition écologique',
          axe: 'Droit et responsabilité : la protection de l’environnement et la sauvegarde de la biodiversité',
          lecon: {
            titre: 'Quand l’environnement entre dans la Constitution',
            cours: `Le droit de l’environnement est récent : il naît dans les années 1970 et prend en France une valeur constitutionnelle en **2005**.

## La Charte de l’environnement
Adossée à la Constitution en **2005**, la **Charte de l’environnement** proclame que chacun a le droit de vivre dans un environnement équilibré et respectueux de la santé, et le devoir de prendre part à sa préservation. Elle a donc la même valeur que la Déclaration de 1789.

## Quatre principes
Le principe de **prévention** : agir en amont pour éviter les atteintes connues. Le principe de **précaution** : en cas de risque incertain mais de dommage grave et irréversible, prendre des mesures provisoires plutôt qu’attendre la certitude scientifique. Le principe **pollueur-payeur** : celui qui pollue supporte le coût de la réparation. Le principe de **participation** : chacun a accès à l’information et participe aux décisions ayant un impact sur l’environnement.

> Prévention et précaution ne sont pas la même chose : la première vise un risque connu, la seconde un risque encore incertain.

## Les textes internationaux
Le **sommet de Rio** (1992) consacre le développement durable ; la **convention d’Aarhus** (1998) garantit information, participation et accès à la justice ; l’**accord de Paris** (2015) engage les États à contenir le réchauffement bien en dessous de 2 °C. Les **objectifs de développement durable** de l’ONU (2015) fixent un cap commun à l’horizon 2030.

## Le juge s’en mêle
En 2021, dans l’**Affaire du siècle**, la justice administrative a reconnu la responsabilité de l’État pour carence fautive dans la lutte contre le changement climatique. Des décisions comparables existent aux Pays-Bas et en Allemagne : le contentieux climatique est devenu un levier réel.

## Le nouveau vocabulaire pénal
La loi **Climat et résilience** de 2021 a créé un délit général de pollution des milieux et un délit d’**écocide** pour les atteintes les plus graves et durables commises intentionnellement.`,
          },
          questions: [
            ['Depuis quand la Charte de l’environnement a-t-elle valeur constitutionnelle ?', ['2005', '1992', '2015', '2021'], 0, 'Elle est adossée à la Constitution, comme la Déclaration de 1789.'],
            ['Que signifie le principe de précaution ?', ['Prendre des mesures face à un risque incertain mais grave et irréversible', 'Réparer les dommages après coup', 'Interdire toute activité industrielle', 'Attendre la certitude scientifique avant d’agir'], 0, 'Il se distingue de la prévention, qui vise un risque déjà connu.'],
            ['Que veut dire le principe pollueur-payeur ?', ['Celui qui pollue supporte le coût de la réparation', 'La pollution est autorisée si elle est payée', 'L’État paie les dégâts environnementaux', 'Les consommateurs financent la dépollution'], 0, 'Il internalise le coût environnemental dans l’activité.'],
            ['Que garantit la convention d’Aarhus de 1998 ?', ['L’information, la participation du public et l’accès à la justice', 'La réduction des gaz à effet de serre', 'La protection des espèces menacées', 'Le financement des énergies renouvelables'], 0, 'C’est le socle de la démocratie environnementale.'],
            ['Quel objectif fixe l’accord de Paris de 2015 ?', ['Contenir le réchauffement bien en dessous de 2 °C', 'Interdire le charbon en 2030', 'Créer une taxe carbone mondiale', 'Doubler les surfaces protégées'], 0, 'Avec un effort visant 1,5 °C.'],
            ['Qu’a reconnu la justice dans l’Affaire du siècle en 2021 ?', ['La responsabilité de l’État pour carence fautive en matière climatique', 'L’interdiction des pesticides', 'La nullité de l’accord de Paris', 'Le droit de manifester pour le climat'], 0, 'Le contentieux climatique est devenu un levier réel.'],
            ['Quel délit la loi Climat et résilience de 2021 a-t-elle créé ?', ['Le délit d’écocide', 'Le délit de fuite écologique', 'Le délit de greenwashing', 'Le délit de surconsommation'], 0, 'Il vise les atteintes graves, durables et intentionnelles.'],
            ['La Charte de l’environnement crée seulement des droits, sans devoirs.', ['Vrai', 'Faux'], 1, 'Elle énonce aussi le devoir de prendre part à la préservation de l’environnement.'],
          ],
        },
        {
          titre: 'S’engager en faveur d’une démocratie environnementale',
          axe: 'Droit et responsabilité : la protection de l’environnement et la sauvegarde de la biodiversité',
          lecon: {
            titre: 'Décider ensemble ce qui engage tout le monde',
            cours: `La **démocratie environnementale** repose sur une idée simple : les décisions qui modifient durablement un territoire ou un climat doivent associer ceux qui les subiront.

## Les trois piliers
Issus de la convention d’**Aarhus** (1998) : l’**accès à l’information** environnementale, la **participation** du public au processus décisionnel, et l’**accès à la justice** pour contester une décision.

## Les outils français
L’**enquête publique** précède les grands projets ; la **Commission nationale du débat public** (CNDP) organise des débats sur les projets d’ampleur ; l’**étude d’impact** évalue les effets d’un aménagement ; la **consultation en ligne** permet de réagir à un projet de décret. Les **associations agréées** de protection de l’environnement peuvent agir en justice.

> Participer n’est pas décider : la consultation éclaire la décision, elle ne la remplace pas — et c’est là que naissent la plupart des conflits.

## La Convention citoyenne pour le climat
Réunie en 2019-2020, elle a tiré au sort **150 citoyens** chargés de proposer des mesures de réduction des émissions dans un esprit de justice sociale. Elle a produit 149 propositions, dont une partie a nourri la loi Climat et résilience de 2021. Son bilan est débattu : expérience démocratique inédite pour les uns, promesses non tenues pour les autres.

## Les formes d’engagement
Le vote et l’engagement politique, l’**adhésion associative**, le bénévolat, la **pétition** (dont celles adressées au Parlement), la **manifestation**, la consommation responsable, le lancement d’alerte, et l’action en justice.

## Les limites et les tensions
L’engagement écologique croise des conflits réels : emplois contre protection, propriété contre intérêt général, urgence contre concertation. Certaines actions — occupations, blocages, dégradations — posent la question des **limites de la désobéissance civile** dans un État de droit : agir pour une cause n’exonère pas de la loi.

## Au lycée
Éco-délégués, projets d’établissement, semaine du développement durable : le programme fait de l’engagement une compétence à exercer, pas seulement une notion à connaître.`,
          },
          questions: [
            ['Quels sont les trois piliers de la démocratie environnementale ?', ['Information, participation, accès à la justice', 'Vote, référendum, pétition', 'Prévention, précaution, réparation', 'État, entreprises, associations'], 0, 'Ils viennent de la convention d’Aarhus de 1998.'],
            ['Qu’est-ce qu’une enquête publique ?', ['Une procédure de consultation qui précède un grand projet d’aménagement', 'Un sondage d’opinion', 'Une enquête de police', 'Un référendum local obligatoire'], 0, 'Elle permet au public de consulter le dossier et de faire des observations.'],
            ['Que fait la Commission nationale du débat public ?', ['Elle organise des débats sur les projets d’ampleur', 'Elle juge les atteintes à l’environnement', 'Elle vote les lois environnementales', 'Elle délivre les permis de construire'], 0, 'Une autorité indépendante saisie en amont des projets.'],
            ['Combien de citoyens composaient la Convention citoyenne pour le climat ?', ['150, tirés au sort', '577, élus', '300, désignés par les associations', '1 000, volontaires'], 0, 'Réunie en 2019-2020, elle a produit 149 propositions.'],
            ['Une partie de ces propositions a nourri quelle loi ?', ['La loi Climat et résilience de 2021', 'La loi Grenelle de 2009', 'La loi biodiversité de 2016', 'La loi énergie de 2015'], 0, 'Le bilan de cette reprise reste discuté.'],
            ['Que peuvent faire les associations agréées de protection de l’environnement ?', ['Agir en justice contre des décisions ou des atteintes', 'Voter les lois', 'Délivrer des autorisations', 'Sanctionner les entreprises'], 0, 'L’agrément leur ouvre l’accès au juge.'],
            ['Participer à une consultation publique revient à décider.', ['Vrai', 'Faux'], 1, 'La consultation éclaire la décision, elle ne la remplace pas.'],
            ['Une action militante illégale est-elle justifiée par la cause défendue ?', ['Non, agir pour une cause n’exonère pas du respect de la loi', 'Oui, si la cause est écologique', 'Oui, si aucune violence n’est commise', 'Oui, si elle est médiatisée'], 0, 'C’est tout l’enjeu du débat sur la désobéissance civile.'],
          ],
        },
        {
          titre: 'Quelle protection et quels droits pour les animaux ?',
          axe: 'Droit et responsabilité : la protection de l’environnement et la sauvegarde de la biodiversité',
          lecon: {
            titre: 'Ni chose, ni personne : le statut juridique de l’animal',
            cours: `Le droit français a longtemps rangé l’animal parmi les **biens**. Depuis 2015, il occupe une place à part, qui reste discutée.

## L’évolution du statut
La loi **Grammont** (1850) punit les mauvais traitements infligés publiquement aux animaux domestiques. En **1976**, la loi reconnaît l’animal comme un **être sensible**. En **2015**, l’article 515-14 du Code civil pose que « les animaux sont des êtres vivants doués de sensibilité », tout en les soumettant, sous réserve des lois qui les protègent, au régime des biens.

> L’animal n’est plus un meuble, mais il n’est pas une personne : le droit lui a créé une catégorie intermédiaire, et personne ne s’accorde sur ce qu’elle devrait devenir.

## Ce que la loi protège
Le Code pénal punit les **sévices graves**, les **actes de cruauté** et l’**abandon**, aggravés par la loi de **2021** contre la maltraitance animale, qui encadre aussi la vente en ligne, interdit progressivement les animaux sauvages dans les cirques itinérants et les delphinariums. Le **bien-être animal** en élevage, en transport et en abattoir relève largement du droit européen.

## Le débat philosophique
Trois positions structurent la discussion. Le **welfarisme** cherche à réduire la souffrance sans remettre en cause l’usage des animaux. L’**abolitionnisme** ou théorie des **droits des animaux** (Tom Regan) veut reconnaître des droits fondamentaux à certains animaux. L’**antispécisme** conteste la légitimité même de la hiérarchie entre espèces. En face, d’autres défendent la continuité des usages — élevage, chasse, recherche — au nom de traditions, d’équilibres économiques ou d’un statut particulier de l’humain.

## Biodiversité et animaux sauvages
La protection des espèces sauvages relève d’une autre logique : convention de Washington (**CITES**, 1973) contre le commerce des espèces menacées, directives européennes **Oiseaux** et **Habitats**, réseau **Natura 2000**, listes rouges de l’**UICN**, Office français de la biodiversité.

## Une tension à assumer
Protéger un animal individuel et protéger une espèce ne demandent pas les mêmes règles — et peuvent parfois s’opposer, par exemple lors de la régulation d’une espèce invasive.`,
          },
          questions: [
            ['Que dit l’article 515-14 du Code civil depuis 2015 ?', ['Que les animaux sont des êtres vivants doués de sensibilité', 'Que les animaux sont des personnes juridiques', 'Que les animaux sont des meubles', 'Que les animaux appartiennent à l’État'], 0, 'Ils restent toutefois soumis au régime des biens sous réserve des lois protectrices.'],
            ['En quelle année la loi reconnaît-elle pour la première fois l’animal comme un être sensible ?', ['1976', '1850', '2015', '2021'], 0, 'La loi Grammont de 1850 ne visait que les mauvais traitements publics.'],
            ['Que prévoit la loi de 2021 contre la maltraitance animale ?', ['Un durcissement des sanctions et la fin progressive des animaux sauvages en cirque itinérant', 'La reconnaissance de la personnalité juridique des animaux', 'L’interdiction de l’élevage', 'La suppression des refuges'], 0, 'Elle encadre aussi la vente d’animaux en ligne.'],
            ['Qu’est-ce que le welfarisme ?', ['La position qui vise à réduire la souffrance animale sans abolir les usages', 'Le refus de toute hiérarchie entre espèces', 'La reconnaissance de droits fondamentaux aux animaux', 'La défense inconditionnelle de la chasse'], 0, 'Il s’oppose aux positions abolitionnistes.'],
            ['Que conteste l’antispécisme ?', ['La légitimité d’une hiérarchie morale entre les espèces', 'L’existence des espèces', 'La protection des animaux domestiques', 'Le droit de propriété'], 0, 'C’est une position philosophique, distincte du welfarisme.'],
            ['Que régule la convention CITES de 1973 ?', ['Le commerce international des espèces menacées', 'Les conditions d’abattage', 'La chasse en Europe', 'Les expérimentations scientifiques'], 0, 'Signée à Washington, elle protège faune et flore menacées.'],
            ['Quel réseau européen protège des sites naturels remarquables ?', ['Natura 2000', 'Erasmus', 'Interreg', 'Copernicus'], 0, 'Issu des directives Oiseaux et Habitats.'],
            ['Protéger un animal individuel et protéger une espèce reviennent au même.', ['Vrai', 'Faux'], 1, 'Les deux logiques peuvent s’opposer, par exemple face à une espèce invasive.'],
          ],
        },
      ],
    },
  ],
}
