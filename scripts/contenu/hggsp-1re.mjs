// HGGSP PREMIÈRE (Histoire-géographie, géopolitique et sciences politiques) —
// les 25 fiches du programme officiel, rangées sous ses 5 thèmes : la démocratie
// · les puissances internationales · les frontières · s’informer · États et
// religions.
//
// LE DÉFAUT. Sondé le 21/08/2026 (node _ASSOCIE/sonde-chapitres.mjs 1re hggsp) :
// la spécialité de Première n’a que QUATRE fiches composites — « La démocratie :
// fragilités et évolutions », « Les frontières dans le monde », « Le pouvoir des
// médias », « États et religions ». Chacune résume un thème entier du BO en une
// fiche, et le thème 2 (les puissances internationales) n’a AUCUNE entrée. Les
// jalons — Athènes, Tocqueville, le Chili de 1973, le Portugal de 1974, l’Empire
// ottoman, l’affaire Dreyfus, la sécularisation turque — n’existent nulle part,
// alors que l’épreuve porte précisément sur eux.
//
// POURQUOI UN MODULE NEUF plutôt qu’un ajout dans `hggsp-tle.mjs` : celui-ci
// part dans la migration 256, qui ne doit plus être régénérée. Deux fichiers,
// même slug `hggsp` — d’où la génération par `--modules`.
//
// PÉRIMÈTRE : la PREMIÈRE SEULE. Le ménage est borné à `level = '1re'` ; la
// Terminale a reçu ses 24 fiches avec la 256.
//
// LE DÉCOUPAGE EST CELUI DU BO — 5 thèmes, qui sont aussi les 5 chapitres de la
// maquette de référence. Ici, aucun arbitrage n’était nécessaire : les intitulés
// du programme (« Comprendre un régime politique : la démocratie », « Analyser
// les dynamiques des puissances internationales »…) sont exactement ceux que
// l’élève a sur son cahier, et chaque thème compte assez de fiches — de 3 à 7 —
// pour qu’une section ait du sens.

export default {
  slug: 'hggsp',
  nom: 'HGGSP',

  titreMigration: 'HGGSP 1re — LE PROGRAMME OFFICIEL (25 fiches)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs 1re hggsp, 21/08/2026) :
la spécialité HGGSP de Première n'avait que QUATRE fiches composites — « La
démocratie : fragilités et évolutions », « Les frontières dans le monde », « Le
pouvoir des médias », « États et religions » —, chacune résumant un thème entier
du BO en une fiche. Le thème 2, « Analyser les dynamiques des puissances
internationales », n'avait AUCUNE entrée. Et surtout, les JALONS du programme —
la citoyenneté athénienne, Tocqueville, le Chili de 1970-1973, le Portugal et
l'Espagne de 1974-1982, l'Empire ottoman, la Russie post-URSS, l'affaire
Dreyfus, la sécularisation turque — n'existaient nulle part, alors que l'épreuve
porte précisément sur eux.

Cette migration installe les 25 fiches du programme, rangées sous ses 5 thèmes,
et retire les 4 fiches composites qu'elles recouvrent.

PÉRIMÈTRE : la PREMIÈRE SEULE. La Terminale a reçu ses 24 fiches avec la 256 :
le ménage est borné au niveau 1re.

⚠️ CE QUI EST PERDU AU PASSAGE : les cours et les quiz des 4 fiches composites.
Ils étaient adossés à un découpage que les 25 fiches recouvrent entièrement.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 25 fiches sous 5 thèmes, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que la 234 n'a jamais été
exécutée telle quelle — sans cette reprise, la migration échouerait sur
"column chapters.theme does not exist", les 4 anciennes fiches déjà supprimées
et les 25 neuves pas encore posées : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 fiches composites partent, au niveau 1re SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : le critère « pas de chapitre de
programme » vise exactement les quatre lignes voulues, antérieures à la colonne
theme, tandis que les 25 fiches neuves en portent un dès l'INSERT — le ménage
tourne AVANT les insertions et ne peut donc jamais mordre sur elles, ni au
premier passage ni au rejeu. C'est aussi le seul repère sûr : les titres
composites portent deux-points et apostrophes, dont rien ne garantit la forme
exacte en base (piège de la 249).
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins à leur chapitre, et toujours
tirables par le moteur de questions), puis les chapitres, dont les leçons
partent en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'hggsp'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'hggsp'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'hggsp'
   AND c.level = '1re'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      chapitres: [
        // ---- Thème 1 : la démocratie -----------------------------------------
        {
          titre: 'La démocratie, les démocraties : quelles caractéristiques aujourd’hui ?',
          axe: 'Comprendre un régime politique : la démocratie',
          lecon: {
            titre: 'Un mot, plusieurs régimes',
            cours: `**Démocratie** vient du grec : *dêmos*, le peuple, *kratos*, le pouvoir. Le pouvoir du peuple — mais le mot recouvre des régimes très différents, et c’est ce que le thème demande de démêler.

## Les critères d’un régime démocratique
- des **élections** libres, pluralistes, régulières et au suffrage universel ;
- la **séparation des pouvoirs**, énoncée par Montesquieu : l’exécutif, le législatif et le judiciaire ne doivent pas se confondre ;
- l’**État de droit** : tous, gouvernants compris, sont soumis à la loi, et une juridiction peut censurer la loi elle-même ;
- les **libertés fondamentales** : expression, presse, réunion, association, conscience ;
- le **pluralisme** : une opposition existe, elle est reconnue, et l’alternance est possible.

> Le critère décisif n’est pas la tenue d’élections — beaucoup de régimes autoritaires en organisent — mais la possibilité réelle de **perdre le pouvoir** et de le céder.

## Directe, représentative, participative
- La démocratie **directe** fait décider les citoyens eux-mêmes : l’Athènes classique, le référendum, les *Landsgemeinde* suisses.
- La démocratie **représentative** fait élire des représentants qui décident. C’est le régime de tous les grands États contemporains, pour des raisons d’échelle autant que de principe.
- La démocratie **participative** cherche à associer les citoyens entre deux élections : budgets participatifs, conventions citoyennes, consultations.

## Régimes parlementaire, présidentiel, semi-présidentiel
- **Parlementaire** : le gouvernement est responsable devant le parlement, qui peut le renverser — le Royaume-Uni, l’Allemagne.
- **Présidentiel** : le président est élu par le peuple, ne peut être renversé par le parlement, mais ne peut pas le dissoudre — les États-Unis.
- **Semi-présidentiel** : la France de la Ve République combine un président élu au suffrage universel direct depuis 1962 et un gouvernement responsable devant l’Assemblée.

## L’état des démocraties
Les indices internationaux constatent depuis une quinzaine d’années une **érosion** : montée de régimes dits « illibéraux », qui conservent les élections en affaiblissant la presse, la justice et les contre-pouvoirs. La démocratie n’est pas un acquis irréversible — c’est la leçon que le thème martèle.`,
          },
          questions: [
            ['Que signifie étymologiquement le mot démocratie ?', ['Le pouvoir du peuple', 'Le pouvoir de la loi', 'Le gouvernement des meilleurs', 'Le pouvoir du plus grand nombre de riches'], 0, 'Dêmos, le peuple, et kratos, le pouvoir.'],
            ['Quel critère distingue le mieux une démocratie d’un régime autoritaire ?', ['La possibilité réelle de perdre le pouvoir et de le céder', 'La tenue d’élections', 'L’existence d’une constitution', 'La présence d’un parlement'], 0, 'Beaucoup de régimes autoritaires organisent des élections.'],
            ['Qui a énoncé le principe de séparation des pouvoirs ?', ['Montesquieu', 'Rousseau', 'Tocqueville', 'Voltaire'], 0, 'Exécutif, législatif et judiciaire ne doivent pas se confondre.'],
            ['Quel régime permet au parlement de renverser le gouvernement ?', ['Le régime parlementaire', 'Le régime présidentiel', 'Le régime autoritaire', 'Aucun'], 0, 'Aux États-Unis, régime présidentiel, le Congrès ne le peut pas.'],
            ['La Ve République française est un régime semi-présidentiel.', ['Vrai', 'Faux'], 0, 'Président élu au suffrage universel direct et gouvernement responsable devant l’Assemblée.'],
            ['Qu’est-ce qu’un régime dit « illibéral » ?', ['Un régime qui conserve les élections mais affaiblit presse, justice et contre-pouvoirs', 'Un régime sans élections', 'Une monarchie absolue', 'Un régime militaire'], 0, 'Leur montée explique l’érosion démocratique constatée depuis une quinzaine d’années.'],
            ['Que vise la démocratie participative ?', ['Associer les citoyens à la décision entre deux élections', 'Remplacer les élections par le tirage au sort', 'Supprimer les partis politiques', 'Renforcer le pouvoir exécutif'], 0, 'Budgets participatifs et conventions citoyennes en sont des formes.'],
            ['L’État de droit signifie que les gouvernants sont eux-mêmes soumis à la loi.', ['Vrai', 'Faux'], 0, 'Et qu’une juridiction peut censurer la loi elle-même.'],
          ],
        },
        {
          titre: 'Une démocratie directe mais limitée : être citoyen à Athènes au Ve siècle',
          axe: 'Comprendre un régime politique : la démocratie',
          lecon: {
            titre: 'Le premier régime démocratique, et ses exclus',
            cours: `Athènes au Ve siècle avant notre ère invente un régime où les citoyens décident **eux-mêmes**, sans représentants. C’est le premier jalon du programme.

## Les institutions
- L’**Ecclésia**, l’assemblée du peuple, se réunit une quarantaine de fois par an sur la colline de la Pnyx. Tout citoyen peut y prendre la parole — c’est l’*isêgoria* — et voter les lois, la guerre, les traités.
- La **Boulê**, conseil de 500 membres **tirés au sort**, prépare les débats de l’Ecclésia.
- L’**Héliée** est le tribunal populaire, ses jurés également tirés au sort.
- Les **magistrats** sont tirés au sort pour la plupart, sauf les **stratèges**, élus parce que la compétence militaire ne s’improvise pas. Périclès sera stratège quinze années de suite.

> Le **tirage au sort** est, aux yeux des Grecs, le procédé démocratique par excellence : il donne à chacun une chance égale, quand l’élection favorise les notables et les orateurs. C’est un point contre-intuitif, et régulièrement demandé.

## Les mécanismes de contrôle
La **misthophorie**, indemnité versée pour la participation, permet aux plus pauvres de siéger. L’**ostracisme** permet d’exiler pour dix ans, par vote, un citoyen jugé trop puissant. La *graphê paranomôn* permet de poursuivre l’auteur d’une proposition illégale.

## Les limites, qui sont le cœur du jalon
Sur environ 300 000 habitants en Attique, **40 000 citoyens** au plus. Sont exclus :
- les **femmes**, quelle que soit leur naissance ;
- les **métèques**, étrangers libres, souvent installés depuis des générations, qui paient l’impôt et servent à l’armée sans jamais voter ;
- les **esclaves**, très nombreux, dont le travail rend possible la disponibilité des citoyens.

La citoyenneté est en outre **restreinte** en 451 par Périclès : il faut désormais être né de père **et** de mère athéniens.

## Ce que le jalon enseigne
Athènes est à la fois le modèle invoqué depuis vingt-cinq siècles et un régime dont la participation intense reposait sur une exclusion massive. Les deux constats vont ensemble, et un devoir attend qu’on les tienne simultanément.`,
          },
          questions: [
            ['Comment étaient désignés la plupart des magistrats athéniens ?', ['Par tirage au sort', 'Par élection', 'Par hérédité', 'Par nomination du stratège'], 0, 'Les stratèges, eux, étaient élus pour leur compétence militaire.'],
            ['Pourquoi le tirage au sort était-il jugé démocratique par les Grecs ?', ['Il donne à chacun une chance égale, quand l’élection favorise les notables', 'Il est plus rapide', 'Il évite les débats', 'Il désigne les plus compétents'], 0, 'Point contre-intuitif, et régulièrement demandé.'],
            ['Qu’est-ce que l’Ecclésia ?', ['L’assemblée de tous les citoyens, qui vote les lois', 'Le conseil de 500 membres tirés au sort', 'Le tribunal populaire', 'Le collège des stratèges'], 0, 'Elle se réunissait une quarantaine de fois par an sur la Pnyx.'],
            ['Les femmes nées de parents athéniens étaient citoyennes.', ['Vrai', 'Faux'], 1, 'Elles étaient exclues de la citoyenneté, comme les métèques et les esclaves.'],
            ['Qui sont les métèques ?', ['Des étrangers libres installés à Athènes, sans droit de vote', 'Des esclaves affranchis et devenus citoyens', 'Des citoyens exilés', 'Des soldats étrangers'], 0, 'Ils paient l’impôt et servent à l’armée sans jamais voter.'],
            ['À quoi servait la misthophorie ?', ['À indemniser la participation, permettant aux plus pauvres de siéger', 'À punir les absents', 'À financer la flotte', 'À rémunérer les esclaves'], 0, 'Sans elle, seuls les citoyens aisés auraient pu siéger.'],
            ['Qu’est-ce que l’ostracisme ?', ['L’exil pour dix ans d’un citoyen jugé trop puissant, décidé par vote', 'La privation de citoyenneté à vie', 'Une amende infligée aux orateurs', 'Le refus d’accorder la citoyenneté'], 0, 'C’est un mécanisme de protection contre la tyrannie.'],
            ['Combien de citoyens comptait Athènes pour environ 300 000 habitants ?', ['Environ 40 000', 'Environ 150 000', 'Environ 10 000', 'Environ 250 000'], 0, 'La participation intense reposait sur une exclusion massive.'],
          ],
        },
        {
          titre: 'La consécration du modèle représentatif après les révolutions anglaise, américaine et française',
          axe: 'Comprendre un régime politique : la démocratie',
          lecon: {
            titre: 'Trois révolutions, un modèle',
            cours: `Entre le XVIIe et le XVIIIe siècle, trois révolutions imposent un modèle nouveau : le peuple est **souverain**, mais il gouverne par des **représentants**.

## La révolution anglaise
Deux temps : la première révolution (1642-1649) aboutit à l’exécution de Charles Ier ; la **Glorieuse Révolution** de 1688 chasse Jacques II et impose à Guillaume d’Orange le **Bill of Rights** (1689). Le roi ne peut plus lever d’impôt ni suspendre les lois sans le Parlement, dont la liberté de parole est garantie. C’est la naissance de la **monarchie parlementaire** : le souverain règne sous condition.

## La révolution américaine
La **Déclaration d’indépendance** de 1776 fonde la légitimité sur des droits naturels et sur le consentement des gouvernés. La **Constitution de 1787**, première constitution écrite d’un grand État, organise un régime **présidentiel** et **fédéral**, avec une séparation stricte des pouvoirs et un système de contrôles réciproques (*checks and balances*). Le *Bill of Rights* de 1791 y ajoute les dix premiers amendements.

## La révolution française
1789 : la **Déclaration des droits de l’homme et du citoyen** proclame l’égalité en droits, la souveraineté de la Nation et la séparation des pouvoirs. La Constitution de 1791 institue une monarchie constitutionnelle, avec un **suffrage censitaire** distinguant citoyens actifs et passifs. La République est proclamée en 1792, et la Convention est élue au **suffrage universel masculin** — une première, sans lendemain immédiat.

## Ce qui est consacré
- La **souveraineté nationale** : le pouvoir vient du peuple, non de Dieu ni de la naissance ;
- le **mandat représentatif** : l’élu représente la Nation entière et non ses seuls électeurs ; il n’est pas révocable en cours de mandat ;
- la **constitution écrite** et la **déclaration de droits** ;
- la **séparation des pouvoirs**, inspirée de Montesquieu et de Locke.

> Le modèle est représentatif **et non** direct : Sieyès l’assume explicitement, en distinguant la démocratie, où le peuple fait la loi, du gouvernement représentatif, où il choisit qui la fera. Ce n’est pas un pis-aller d’échelle mais un choix politique.

## Les limites du moment
Le suffrage reste **censitaire** presque partout ; les femmes en sont exclues ; l’esclavage subsiste aux États-Unis et sera rétabli en France en 1802. L’universalité proclamée met un siècle et demi à se réaliser.`,
          },
          questions: [
            ['Que garantit le Bill of Rights anglais de 1689 ?', ['Que le roi ne peut lever l’impôt ni suspendre les lois sans le Parlement', 'Le suffrage universel', 'L’indépendance des colonies', 'L’abolition de la monarchie'], 0, 'C’est l’acte de naissance de la monarchie parlementaire.'],
            ['Quel régime la Constitution américaine de 1787 institue-t-elle ?', ['Un régime présidentiel et fédéral', 'Une monarchie parlementaire', 'Un régime d’assemblée', 'Un régime semi-présidentiel'], 0, 'Avec une séparation stricte et des contrôles réciproques.'],
            ['Qu’est-ce que le suffrage censitaire ?', ['Un droit de vote réservé à ceux qui paient un certain niveau d’impôt', 'Un vote par tirage au sort', 'Un vote réservé aux hommes', 'Un vote indirect'], 0, 'Il distingue citoyens actifs et passifs dans la Constitution de 1791.'],
            ['La Convention de 1792 est élue au suffrage universel masculin.', ['Vrai', 'Faux'], 0, 'Une première, restée sans lendemain immédiat.'],
            ['Qu’implique le mandat représentatif ?', ['L’élu représente la Nation entière et n’est pas révocable en cours de mandat', 'L’élu obéit aux instructions de ses électeurs', 'L’élu est tiré au sort', 'L’élu peut être révoqué à tout moment'], 0, 'Il s’oppose au mandat impératif.'],
            ['Comment Sieyès distingue-t-il démocratie et gouvernement représentatif ?', ['Dans la démocratie le peuple fait la loi, dans le gouvernement représentatif il choisit qui la fera', 'Il les tient pour synonymes', 'La démocratie serait réservée aux petits États seulement', 'Le gouvernement représentatif serait un régime monarchique'], 0, 'Le choix du représentatif est politique, non seulement pratique.'],
            ['L’esclavage a été aboli partout dès les révolutions du XVIIIe siècle.', ['Vrai', 'Faux'], 1, 'Il subsiste aux États-Unis et sera rétabli en France en 1802.'],
            ['Sur quoi la Déclaration d’indépendance américaine de 1776 fonde-t-elle la légitimité ?', ['Sur des droits naturels et le consentement des gouvernés', 'Sur la volonté du roi', 'Sur la tradition coloniale', 'Sur un traité international'], 0, 'C’est une rupture avec la légitimité par la naissance ou par Dieu.'],
          ],
        },
        {
          titre: 'L’inquiétude de Tocqueville : de la démocratie à la tyrannie ?',
          axe: 'Comprendre un régime politique : la démocratie',
          lecon: {
            titre: 'Égalité, conformisme et despotisme doux',
            cours: `**Alexis de Tocqueville** (1805-1859) voyage aux États-Unis en 1831 et en tire *De la démocratie en Amérique* (1835 et 1840). Il n’y cherche pas un modèle mais un **avenir** : l’égalisation des conditions lui paraît un mouvement **providentiel**, irrésistible, dont l’Europe suivra le chemin.

## Ce qu’il admire
- La vitalité des **associations** : les Américains s’unissent pour tout, ce qui les forme à l’action collective et fait contrepoids à l’État ;
- la **décentralisation** et l’administration locale, école pratique de la liberté ;
- l’indépendance de la **justice** et le rôle politique des juges ;
- la **religion**, qui, séparée de l’État, y soutient les mœurs au lieu de les contraindre.

## Ce qu’il redoute
Trois périls, qu’il faut savoir distinguer :
- La **tyrannie de la majorité** : là où la majorité fait la loi et l’opinion, la minorité n’a aucun recours. Le danger n’est pas d’abord la contrainte physique mais la pression morale — Tocqueville juge qu’il n’y a « pas de liberté de l’esprit en Amérique », tant chacun redoute de s’écarter de l’opinion commune.
- L’**individualisme** : l’égalité détache les hommes les uns des autres et les replie sur leur cercle privé. Ce mot, dont il fixe le sens, ne désigne pas l’égoïsme mais un retrait du public.
- Le **despotisme doux** : un pouvoir « tutélaire, immense », qui ne tyrannise pas mais **infantilise**, prend tout en charge, ôte l’usage de soi-même. Les citoyens y consentent, parce qu’ils l’ont élu et qu’il les soulage.

> C’est cette dernière analyse qui a fait la fortune du livre : la menace ne vient pas d’un tyran, mais d’une servitude **volontaire, réglée et douce**, compatible avec les formes extérieures de la souveraineté populaire.

## Les remèdes
Tocqueville n’est pas pessimiste par principe : il indique des contrepoids — l’**association**, la **liberté de la presse**, la **décentralisation**, la **religion** comme frein moral, l’indépendance de la justice. La liberté ne se conserve pas d’elle-même : elle demande des institutions et des mœurs.

## Pourquoi ce jalon
Il fournit les concepts avec lesquels penser les fragilités des démocraties contemporaines — apathie électorale, conformisme des opinions, délégation croissante à l’administration ou à l’algorithme.`,
          },
          questions: [
            ['Quel ouvrage Tocqueville tire-t-il de son voyage de 1831 ?', ['De la démocratie en Amérique', 'L’Ancien Régime et la Révolution', 'Du contrat social', 'De l’esprit des lois'], 0, 'Publié en deux tomes, en 1835 et 1840.'],
            ['Comment Tocqueville qualifie-t-il l’égalisation des conditions ?', ['Un mouvement providentiel et irrésistible', 'Une mode passagère', 'Une spécificité américaine', 'Un recul de la civilisation'], 0, 'Il pense que l’Europe suivra le même chemin.'],
            ['Qu’est-ce que la tyrannie de la majorité ?', ['La pression de l’opinion majoritaire, qui ne laisse aucun recours à la minorité', 'Le vote d’une loi à une voix près', 'Le pouvoir d’un dictateur élu', 'Le règne des partis'], 0, 'Le danger est moral avant d’être physique.'],
            ['Que désigne l’individualisme chez Tocqueville ?', ['Le repli sur le cercle privé et le détachement du public', 'L’égoïsme personnel', 'La défense des droits individuels', 'L’esprit d’entreprise'], 0, 'Il fixe le sens de ce mot, distinct de l’égoïsme.'],
            ['Qu’est-ce que le despotisme doux ?', ['Un pouvoir tutélaire qui infantilise et à qui les citoyens consentent', 'Une dictature militaire', 'Une monarchie éclairée', 'Un pouvoir religieux'], 0, 'Il est compatible avec les formes extérieures de la souveraineté populaire.'],
            ['Tocqueville admire la vitalité des associations américaines.', ['Vrai', 'Faux'], 0, 'Elles forment à l’action collective et font contrepoids à l’État.'],
            ['Quels remèdes Tocqueville oppose-t-il aux périls de la démocratie ?', ['Association, presse libre, décentralisation et justice indépendante', 'Le retour à la monarchie', 'La restriction du suffrage', 'Le renforcement du pouvoir central'], 0, 'La liberté demande des institutions et des mœurs.'],
            ['Selon Tocqueville, la liberté se conserve d’elle-même une fois acquise.', ['Vrai', 'Faux'], 1, 'C’est précisément l’inverse qu’il soutient.'],
          ],
        },
        {
          titre: 'Reculs des démocraties : l’exemple du Chili de 1970 à 1973',
          axe: 'Comprendre un régime politique : la démocratie',
          lecon: {
            titre: 'Comment une démocratie ancienne s’effondre',
            cours: `Le Chili offre au programme le cas d’une démocratie **ancienne et stable** — l’une des plus solides d’Amérique latine — qui bascule en trois ans dans une dictature militaire.

## L’élection de 1970
**Salvador Allende**, candidat de l’Unité populaire, coalition de socialistes et de communistes, l’emporte avec 36,6 % des voix. Sans majorité absolue, il est confirmé par le Congrès. C’est la première fois qu’un marxiste accède au pouvoir par les urnes dans un pays occidental.

## Le programme et ses effets
Nationalisation du **cuivre**, principale ressource du pays, sans indemnisation des compagnies américaines ; nationalisation des banques ; accélération de la **réforme agraire** ; hausse des salaires.

Les résultats se retournent vite : **inflation** vertigineuse, **pénuries**, marché noir. Le pays se polarise, chaque camp descendant dans la rue.

## Les pressions extérieures et intérieures
- Les **États-Unis**, en pleine guerre froide, organisent le blocage du crédit international et financent l’opposition ; Nixon veut « faire crier l’économie ».
- La **grève des camionneurs** de 1972-1973 paralyse un pays étiré sur 4 300 kilomètres.
- Le **Congrès**, où l’opposition domine, déclare le gouvernement hors de la légalité en août 1973.

## Le coup d’État
Le **11 septembre 1973**, l’armée dirigée par **Augusto Pinochet** bombarde le palais de la Moneda. Allende y meurt. Suivent la dissolution du Congrès, l’interdiction des partis, la censure, les arrestations massives — le stade national transformé en centre de détention —, la torture, les exécutions et les disparitions. La dictature durera **jusqu’en 1990**.

> Le jalon n’enseigne pas seulement une chronologie : il montre **comment** une démocratie s’effondre — polarisation extrême, crise économique, délégitimation réciproque des institutions, intervention extérieure, et enfin recours à l’armée présenté comme un rétablissement de l’ordre.

## L’après
Le retour à la démocratie se fait par le **référendum de 1988**, où le « non » à la prolongation de Pinochet l’emporte, puis par des élections en 1989. La **commission Rettig** établit ensuite le bilan des violations : plus de 3 000 morts et disparus, des dizaines de milliers de victimes de la torture.`,
          },
          questions: [
            ['Avec quel pourcentage Salvador Allende est-il élu en 1970 ?', ['36,6 %, sans majorité absolue', 'Plus de 50 %', 'Environ 45 %', 'Il n’a pas été élu'], 0, 'Il est ensuite confirmé par le Congrès.'],
            ['Quelle ressource Allende nationalise-t-il en priorité ?', ['Le cuivre', 'Le pétrole', 'Le lithium', 'Le blé'], 0, 'Sans indemniser les compagnies américaines, ce qui envenime les relations.'],
            ['Quelles difficultés économiques marquent le Chili de 1972-1973 ?', ['Une inflation vertigineuse, des pénuries et un marché noir', 'Une croissance record', 'Un excédent commercial', 'Une déflation'], 0, 'La polarisation politique s’en trouve accélérée.'],
            ['Quel rôle jouent les États-Unis dans la déstabilisation du Chili ?', ['Blocage du crédit international et financement de l’opposition', 'Envoi de troupes', 'Soutien économique à Allende', 'Aucun rôle'], 0, 'La guerre froide en fournit le cadre.'],
            ['À quelle date a lieu le coup d’État militaire chilien ?', ['Le 11 septembre 1973', 'Le 4 septembre 1970', 'Le 11 mars 1990', 'Le 5 octobre 1988'], 0, 'Le palais de la Moneda est bombardé, Allende y meurt.'],
            ['La dictature de Pinochet a duré jusqu’en 1990.', ['Vrai', 'Faux'], 0, 'Dissolution du Congrès, censure, torture, disparitions : dix-sept années.'],
            ['Comment s’amorce le retour à la démocratie au Chili ?', ['Par le référendum de 1988, où le « non » l’emporte', 'Par une insurrection armée', 'Par une intervention étrangère', 'Par la mort de Pinochet'], 0, 'Des élections suivent en 1989.'],
            ['Qu’a établi la commission Rettig ?', ['Le bilan des violations des droits humains sous la dictature', 'Le programme économique du régime', 'La constitution de 1980', 'Le calendrier électoral'], 0, 'Plus de 3 000 morts et disparus, des dizaines de milliers de torturés.'],
          ],
        },
        {
          titre: 'Avancées des démocraties : les exemples du Portugal et de l’Espagne de 1974 à 1982',
          axe: 'Comprendre un régime politique : la démocratie',
          lecon: {
            titre: 'Deux sorties de dictature, deux chemins',
            cours: `Le jalon symétrique du précédent : deux dictatures d’Europe du Sud deviennent des démocraties, et par des voies opposées.

## Le Portugal : la rupture
La dictature de l’**Estado Novo**, fondée par **Salazar** en 1933 et poursuivie par Caetano, s’épuise dans des **guerres coloniales** qui durent depuis 1961 en Angola, au Mozambique et en Guinée : elles absorbent près de la moitié du budget et mobilisent toute une jeunesse.

Le **25 avril 1974**, un mouvement d’officiers renverse le régime presque sans effusion de sang. La population se joint à eux et glisse des **œillets** dans les canons : c’est la **révolution des Œillets**.

Suivent deux années agitées — décolonisation rapide, nationalisations, tensions entre courants —, puis la **Constitution de 1976** et l’élection de Mário Soares. Le Portugal entre dans la CEE en **1986**.

## L’Espagne : la transition négociée
**Franco** meurt le 20 novembre 1975, après trente-six ans de dictature. Il a désigné pour lui succéder le roi **Juan Carlos**, qui, contre toute attente, choisit d’ouvrir le régime.

**Adolfo Suárez**, nommé président du gouvernement, fait voter par les Cortès franquistes leur propre disparition — la loi de réforme politique de 1976, approuvée par référendum. Les partis, dont le parti communiste, sont légalisés en 1977 ; les premières élections libres ont lieu la même année ; la **Constitution de 1978** institue une monarchie parlementaire et un État des autonomies.

La transition tient sur deux appuis : les **pactes de la Moncloa** (1977), accord économique et social entre gouvernement, patronat et syndicats, et une **loi d’amnistie** — qui laissera longtemps sans réponse la question des crimes du franquisme.

Le **23 février 1981**, une tentative de coup d’État militaire prend les Cortès en otage. Le refus public de Juan Carlos la fait échouer. L’adhésion à la CEE, en **1986**, scelle l’ancrage démocratique.

> Deux chemins opposés — **rupture** révolutionnaire au Portugal, **transition négociée** en Espagne — et un même résultat. Le jalon montre qu’il n’y a pas une seule voie vers la démocratie, et que la sortie de dictature se paye toujours de compromis dont l’examen vient plus tard.`,
          },
          questions: [
            ['Comment s’appelle le régime dictatorial portugais fondé par Salazar ?', ['L’Estado Novo', 'Le Franquisme', 'La Falange', 'Le Salazarisme constitutionnel'], 0, 'Fondé en 1933, poursuivi ensuite par Caetano.'],
            ['Qu’est-ce qui épuise le régime portugais avant 1974 ?', ['Les guerres coloniales menées depuis 1961', 'Une crise financière internationale', 'Une épidémie', 'Un conflit avec l’Espagne'], 0, 'Elles absorbent près de la moitié du budget de l’État.'],
            ['À quelle date a lieu la révolution des Œillets ?', ['Le 25 avril 1974', 'Le 20 novembre 1975', 'Le 23 février 1981', 'Le 11 septembre 1973'], 0, 'Un mouvement d’officiers renverse le régime presque sans effusion de sang.'],
            ['Qui a désigné Juan Carlos pour lui succéder en Espagne ?', ['Franco lui-même', 'Les Cortès élues', 'Adolfo Suárez', 'Le peuple par référendum'], 0, 'Le roi choisit pourtant d’ouvrir le régime.'],
            ['Qu’ont fait les Cortès franquistes en 1976 ?', ['Elles ont voté leur propre disparition', 'Elles ont refusé toute réforme', 'Elles ont proclamé la république', 'Elles ont dissous les partis'], 0, 'La loi de réforme politique est ensuite approuvée par référendum.'],
            ['Que sont les pactes de la Moncloa ?', ['Un accord économique et social entre gouvernement, patronat et syndicats en 1977', 'Un traité international', 'La constitution espagnole', 'Un accord militaire'], 0, 'Ils sont l’un des deux appuis de la transition.'],
            ['La tentative de coup d’État de février 1981 en Espagne a réussi.', ['Vrai', 'Faux'], 1, 'Le refus public de Juan Carlos la fait échouer.'],
            ['Qu’ont en commun le Portugal et l’Espagne en 1986 ?', ['Ils adhèrent tous deux à la Communauté économique européenne', 'Ils deviennent des républiques', 'Ils organisent leurs premières élections', 'Ils adoptent leur constitution'], 0, 'L’adhésion scelle leur ancrage démocratique.'],
          ],
        },
        {
          titre: 'L’Union européenne et la démocratie : fonctionnement et remises en question',
          axe: 'Comprendre un régime politique : la démocratie',
          lecon: {
            titre: 'Une démocratie sans peuple européen ?',
            cours: `L’Union européenne n’est ni un État fédéral ni une simple organisation internationale : c’est une construction **sui generis**, dont la légitimité démocratique fait débat depuis l’origine.

## Les institutions et leur légitimité
- Le **Parlement européen** est élu au suffrage universel direct depuis **1979**. Ses pouvoirs se sont considérablement étendus : il colégifère avec le Conseil, vote le budget, investit la Commission et peut la censurer.
- La **Commission** propose les textes et veille à l’application des traités. Ses membres sont **nommés**, non élus — d’où le reproche de technocratie.
- Le **Conseil de l’Union** réunit les ministres des États : sa légitimité est **indirecte**, tirée des gouvernements nationaux.
- Le **Conseil européen** rassemble les chefs d’État et de gouvernement et fixe les orientations.
- La **Cour de justice** assure la primauté et l’application uniforme du droit européen.

## Le « déficit démocratique »
Les critiques adressées à l’Union sont récurrentes :
- l’initiative des textes appartient à une institution **non élue** ;
- la **complexité** des procédures rend les responsabilités illisibles pour le citoyen ;
- les élections européennes connaissent une **abstention** élevée et se jouent souvent sur des enjeux nationaux ;
- il n’existe pas d’**espace public** ni de partis véritablement européens : les débats restent nationaux.

> Le cœur du problème est souvent formulé ainsi : peut-il y avoir une démocratie sans **demos**, sans peuple qui se reconnaisse comme tel ? Les uns y voient un obstacle indépassable, les autres un processus en cours, comme le furent les nations elles-mêmes.

## Les réponses apportées
- Extension continue des pouvoirs du Parlement, jusqu’au traité de Lisbonne (2009) ;
- l’**initiative citoyenne européenne**, qui permet à un million de citoyens de demander à la Commission de proposer un texte ;
- le principe de **subsidiarité** : l’Union n’agit que si son action est plus efficace que celle des États ;
- la **Charte des droits fondamentaux**, contraignante depuis 2009.

## Les crises
Les référendums français et néerlandais de **2005** rejettent le traité constitutionnel ; la crise de la zone euro à partir de 2010 fait apparaître le poids des créanciers dans des décisions nationales ; le **Brexit**, voté en 2016 et effectif en 2020, montre qu’une sortie est possible. À l’inverse, les crises récentes ont conduit à des décisions communes inédites, en matière sanitaire comme budgétaire.`,
          },
          questions: [
            ['Depuis quand le Parlement européen est-il élu au suffrage universel direct ?', ['1979', '1957', '1992', '2009'], 0, 'Ses pouvoirs se sont ensuite considérablement étendus.'],
            ['Quelle institution européenne a le monopole de l’initiative législative ?', ['La Commission', 'Le Parlement', 'Le Conseil de l’Union', 'La Cour de justice'], 0, 'Ses membres étant nommés, c’est une source du reproche de technocratie.'],
            ['Que reproche-t-on à l’Union sous le nom de « déficit démocratique » ?', ['Initiative non élue, complexité, abstention et absence d’espace public européen', 'L’absence de parlement', 'L’absence de tribunal', 'Le refus des référendums'], 0, 'Les élections européennes se jouent souvent sur des enjeux nationaux.'],
            ['Qu’est-ce que le principe de subsidiarité ?', ['L’Union n’agit que si son action est plus efficace que celle des États', 'Les États obéissent toujours à l’Union', 'Chaque État applique le droit à sa guise', 'Le Parlement délègue ses pouvoirs'], 0, 'Il vise à borner l’intervention européenne.'],
            ['Qu’ont rejeté les référendums français et néerlandais de 2005 ?', ['Le traité constitutionnel européen', 'L’adhésion de nouveaux États', 'La monnaie unique', 'La Charte des droits fondamentaux'], 0, 'Un texte de portée réduite sera adopté ensuite par voie parlementaire.'],
            ['L’initiative citoyenne européenne permet à un million de citoyens de saisir la Commission.', ['Vrai', 'Faux'], 0, 'Ils peuvent lui demander de proposer un texte, sans l’y obliger.'],
            ['Que montre le Brexit du point de vue institutionnel ?', ['Qu’une sortie de l’Union est possible', 'Que l’Union est irréversible', 'Que le Parlement peut exclure un État', 'Que les traités interdisent le retrait'], 0, 'Voté en 2016, effectif en 2020.'],
            ['Quelle est la nature de la légitimité du Conseil de l’Union ?', ['Indirecte, tirée des gouvernements nationaux', 'Directe, par élection', 'Judiciaire', 'Aucune'], 0, 'Il réunit les ministres des États membres.'],
          ],
        },

        // ---- Thème 2 : les puissances internationales -----------------------
        {
          titre: 'Les caractéristiques de la puissance à l’échelle internationale aujourd’hui',
          axe: 'Analyser les dynamiques des puissances internationales',
          lecon: {
            titre: 'Ce qui fait qu’un État pèse',
            cours: `La **puissance** est la capacité d’un acteur à imposer sa volonté, à influencer les autres et à résister à leur influence. Elle se mesure moins à ce qu’un État possède qu’à ce qu’il **obtient**.

## Les attributs traditionnels
- **Militaires** : effectifs, budget, capacité de projection, arme nucléaire, sièges permanents au Conseil de sécurité ;
- **économiques** : PIB, industrie, monnaie de réserve, entreprises multinationales, maîtrise des technologies ;
- **démographiques et territoriaux** : population, ressources, position géographique, contrôle des voies de passage ;
- **diplomatiques** : réseau d’alliances, présence dans les organisations internationales, capacité d’initiative.

## Hard power et soft power
Joseph Nye distingue deux façons d’obtenir ce que l’on veut :
- le **hard power** : la contrainte — la force militaire, la sanction économique ;
- le **soft power** : l’**attraction** — la culture, les valeurs, le modèle de société, la langue, les universités, le cinéma, la capacité de faire désirer ce qu’on propose.

Il ajoute le **smart power** : l’art de combiner les deux à propos, parce qu’aucun ne suffit seul.

> Le soft power n’est pas une puissance au rabais : obtenir sans contraindre coûte moins cher et dure plus longtemps. Mais il ne se décrète pas — il se constate.

## Les acteurs non étatiques
La puissance n’appartient plus aux seuls États : **firmes multinationales** dont le chiffre d’affaires dépasse le PIB de nombreux pays, **organisations internationales**, **ONG**, réseaux criminels ou terroristes, grandes plateformes numériques capables d’infléchir des débats publics entiers.

## Les configurations du système international
- **Bipolaire** : deux blocs, comme pendant la guerre froide ;
- **unipolaire** : la période qui suit 1991, souvent appelée le « moment unipolaire » américain ;
- **multipolaire** : plusieurs pôles rivaux, ce que décrivent la plupart des analystes aujourd’hui — États-Unis, Chine, Union européenne, Russie, Inde, puissances régionales.

## Les nouveaux terrains
La puissance s’exerce désormais aussi dans le **cyberespace**, dans l’**espace** extra-atmosphérique, sur les **normes** techniques et juridiques, et par la maîtrise des **données**. Ce sont des terrains où un acteur privé peut peser autant qu’un État.`,
          },
          questions: [
            ['Comment définit-on la puissance en relations internationales ?', ['La capacité d’imposer sa volonté et de résister à celle des autres', 'La taille du territoire', 'Le nombre d’habitants', 'La richesse par habitant'], 0, 'Elle se mesure à ce qu’un acteur obtient, non à ce qu’il possède.'],
            ['Qu’est-ce que le soft power selon Joseph Nye ?', ['La capacité d’obtenir par l’attraction plutôt que par la contrainte', 'La force militaire conventionnelle', 'Les sanctions économiques', 'La diplomatie secrète'], 0, 'Culture, valeurs, langue, universités et industries culturelles.'],
            ['Qu’appelle-t-on smart power ?', ['L’art de combiner hard et soft power à propos', 'La puissance technologique', 'L’espionnage', 'La puissance des algorithmes'], 0, 'Aucun des deux ne suffit seul.'],
            ['Seuls les États peuvent être des acteurs de puissance aujourd’hui.', ['Vrai', 'Faux'], 1, 'Firmes multinationales, ONG et plateformes numériques en sont aussi.'],
            ['Comment qualifie-t-on le système international de la guerre froide ?', ['Bipolaire', 'Unipolaire', 'Multipolaire', 'Apolaire'], 0, 'La période suivant 1991 est souvent dite unipolaire.'],
            ['Le soft power se décrète par une politique publique.', ['Vrai', 'Faux'], 1, 'Il se constate : c’est l’attraction effectivement exercée qui le mesure.'],
            ['Quels sont les nouveaux terrains d’exercice de la puissance ?', ['Le cyberespace, l’espace, les normes et les données', 'Les colonies', 'Les zones polaires uniquement', 'Les fleuves internationaux'], 0, 'Un acteur privé peut y peser autant qu’un État.'],
            ['Que confère un siège permanent au Conseil de sécurité de l’ONU ?', ['Un droit de veto sur les résolutions', 'Le commandement des forces de l’ONU', 'Un budget supplémentaire', 'La présidence tournante'], 0, 'C’est un attribut classique de la puissance diplomatique.'],
          ],
        },
        {
          titre: 'Essor et déclin des puissances : un regard historique à travers les trajectoires de l’Empire ottoman et de la Russie post-URSS',
          axe: 'Analyser les dynamiques des puissances internationales',
          lecon: {
            titre: 'Deux déclins, deux réponses',
            cours: `Aucune puissance n’est éternelle. Le jalon compare deux trajectoires de déclin séparées par un siècle, et les stratégies employées pour y répondre.

## L’Empire ottoman : « l’homme malade de l’Europe »
Fondé au XIVe siècle, l’Empire atteint son apogée au XVIe avec Soliman le Magnifique : il domine les Balkans, l’Anatolie, le Proche-Orient et l’Afrique du Nord, et contrôle les routes commerciales entre l’Europe et l’Asie.

Le reflux s’amorce à partir de la fin du XVIIe siècle. Ses causes se cumulent :
- l’**échec devant Vienne** en 1683, puis des défaites militaires répétées face à l’Autriche et à la Russie ;
- le contournement des routes ottomanes par les **routes maritimes** atlantiques, qui ruine son avantage commercial ;
- le **retard technique et industriel** face à une Europe qui s’industrialise ;
- la montée des **nationalismes** dans les Balkans — indépendance grecque en 1830, puis serbe, roumaine, bulgare ;
- la **dépendance financière** : la dette contractée auprès des puissances européennes conduit en 1881 à la création de l’Administration de la Dette publique ottomane, qui place les recettes sous contrôle étranger ; les **capitulations** accordent aux Européens des privilèges commerciaux et judiciaires.

Les tentatives de réforme — les **Tanzimat** au XIXe siècle, puis la révolution des Jeunes-Turcs en 1908 — ne renversent pas le mouvement. La défaite de 1918, le traité de Sèvres puis la guerre d’indépendance débouchent sur la **République turque** de Mustafa Kemal en 1923.

## La Russie post-soviétique
La disparition de l’**URSS** en décembre 1991 fait perdre à Moscou près de la moitié de sa population, un quart de son territoire et son statut de superpuissance. Les années 1990 sont celles de l’effondrement économique, de l’hyperinflation, des privatisations et de l’humiliation stratégique — élargissement de l’OTAN, guerre en Tchétchénie.

À partir de 2000, la stratégie change : reprise en main de l’État et des médias, usage de la **rente énergétique** — le gaz et le pétrole comme instruments diplomatiques —, modernisation militaire, réaffirmation par la force en Géorgie (2008), en Crimée et dans le Donbass (2014), puis par l’invasion de l’Ukraine en 2022.

> Deux stratégies distinctes devant le déclin : l’Empire ottoman a cherché à **se réformer** en s’européanisant ; la Russie choisit la **réaffirmation** par la puissance militaire et énergétique. Le jalon invite à comparer ces réponses, non à les juger d’avance.

## Ce que la comparaison enseigne
Le déclin d’une puissance est rarement un effondrement soudain : c’est un **processus** long, fait de retards accumulés, de dépendances financières, de contestations internes et de recompositions du commerce mondial — et les réponses qu’on y apporte pèsent autant que les causes.`,
          },
          questions: [
            ['Sous quel surnom l’Empire ottoman est-il désigné au XIXe siècle ?', ['L’homme malade de l’Europe', 'Le géant endormi', 'La Sublime Porte déchue', 'Le colosse aux pieds d’argile'], 0, 'La formule est attribuée au tsar Nicolas Ier.'],
            ['Quel événement de 1683 marque un tournant pour l’Empire ottoman ?', ['L’échec du siège de Vienne', 'La prise de Constantinople', 'La bataille de Lépante', 'Le traité de Sèvres'], 0, 'Il ouvre une série de défaites face à l’Autriche et à la Russie.'],
            ['Que sont les capitulations dans l’Empire ottoman ?', ['Des privilèges commerciaux et judiciaires accordés aux Européens', 'Des redditions militaires', 'Des traités de paix', 'Des lois religieuses'], 0, 'Elles témoignent de la dépendance croissante envers l’Europe.'],
            ['Qu’a créé l’endettement ottoman en 1881 ?', ['L’Administration de la Dette publique ottomane, qui place les recettes sous contrôle étranger', 'Une banque centrale indépendante', 'Une monnaie commune', 'Un impôt européen'], 0, 'La souveraineté financière de l’Empire y est entamée.'],
            ['Que perd la Russie avec la disparition de l’URSS en 1991 ?', ['Près de la moitié de sa population, un quart de son territoire et son statut de superpuissance', 'Uniquement ses colonies', 'Son siège à l’ONU', 'Son arsenal nucléaire'], 0, 'Les années 1990 sont celles de l’effondrement économique.'],
            ['Quelle ressource la Russie utilise-t-elle comme instrument diplomatique après 2000 ?', ['La rente énergétique, gaz et pétrole', 'Les terres rares', 'Les céréales uniquement', 'Le tourisme'], 0, 'Elle accompagne la reprise en main de l’État et la modernisation militaire.'],
            ['Les réformes des Tanzimat ont renversé le déclin ottoman.', ['Vrai', 'Faux'], 1, 'Elles n’ont pas empêché l’issue de 1918 et la fin de l’Empire.'],
            ['Quelle différence de stratégie oppose les deux trajectoires ?', ['L’Empire ottoman a cherché à se réformer, la Russie à se réaffirmer par la force', 'Les deux ont choisi la réforme', 'Les deux ont choisi l’isolement', 'Aucune différence notable'], 0, 'Le jalon invite à comparer ces réponses au déclin.'],
          ],
        },
        {
          titre: 'Formes indirectes de la puissance : culture, langue, nouvelles technologies et maîtrise des voies de communication',
          axe: 'Analyser les dynamiques des puissances internationales',
          lecon: {
            titre: 'Peser sans contraindre',
            cours: `À côté de la force, il existe des formes de puissance qui agissent sans coercition — et qui sont souvent les plus durables.

## La culture et la langue
Le **cinéma**, les séries, la musique, la mode et les jeux vidéo diffusent des représentations et des modèles. Hollywood a longtemps constitué le premier vecteur d’influence américaine ; la **vague coréenne**, avec sa musique et ses séries, illustre qu’une puissance moyenne peut y réussir remarquablement.

La **langue** est une infrastructure d’influence : elle ouvre des marchés, oriente les normes juridiques et scientifiques, structure les réseaux universitaires. L’anglais domine la publication scientifique ; la **francophonie**, l’**hispanophonie** et le développement des instituts Confucius sont des politiques assumées.

Les **universités** attirent des étudiants qui repartent avec un réseau et une familiarité durables : c’est l’un des investissements d’influence les plus rentables.

## Les technologies
Maîtriser une technologie critique, c’est détenir un moyen de pression :
- les **semi-conducteurs**, dont la production est très concentrée géographiquement ;
- les **réseaux** et les équipements de télécommunication ;
- l’**intelligence artificielle** et les infrastructures de calcul ;
- les **terres rares** et les métaux nécessaires à la transition énergétique.

Les **normes** techniques sont un enjeu à part entière : celui qui les fixe impose ses choix à tous ceux qui veulent vendre.

## Les voies de communication
Le contrôle des passages stratégiques est une donnée permanente de la géopolitique :
- les **détroits** — Ormuz pour le pétrole, Malacca pour le commerce asiatique, Bab el-Mandeb, le Bosphore ;
- les **canaux** de Suez et de Panama, dont le blocage momentané suffit à désorganiser le commerce mondial ;
- les **câbles sous-marins**, qui transportent l’essentiel des données mondiales et dont la vulnérabilité est devenue un sujet de sécurité ;
- les **routes maritimes** nouvelles, notamment arctiques, que le réchauffement rend praticables.

> La Chine a fait des **nouvelles routes de la soie** l’instrument de cette puissance indirecte : investissements en ports, chemins de fer et infrastructures, qui créent des liens économiques durables — et parfois des dépendances par la dette.

## Puissance et dépendance
Ces formes indirectes créent des relations **asymétriques** durables. Elles peuvent aussi se retourner : une dépendance mutuelle contraint les deux parties, et les crises récentes ont montré combien les chaînes d’approvisionnement mondialisées exposent ceux qui les dominent.`,
          },
          questions: [
            ['Quel exemple montre qu’une puissance moyenne peut réussir par la culture ?', ['La vague coréenne, musique et séries', 'Hollywood', 'Le cinéma français des années 1930', 'Les studios indiens'], 0, 'Le soft power n’est pas réservé aux plus grandes puissances.'],
            ['Pourquoi la langue est-elle un instrument de puissance ?', ['Elle ouvre des marchés et structure les normes et les réseaux', 'Elle est plus facile à apprendre', 'Elle permet la traduction automatique', 'Elle réduit les coûts militaires'], 0, 'L’anglais domine la publication scientifique.'],
            ['Quel détroit est stratégique pour le transit du pétrole ?', ['Le détroit d’Ormuz', 'Le détroit de Gibraltar', 'Le canal de Panama', 'Le Bosphore'], 0, 'Malacca, lui, est vital pour le commerce asiatique.'],
            ['Que transportent les câbles sous-marins ?', ['L’essentiel des données mondiales', 'Le pétrole', 'Le gaz naturel', 'L’électricité uniquement'], 0, 'Leur vulnérabilité est devenue un sujet de sécurité.'],
            ['Qu’est-ce que les nouvelles routes de la soie ?', ['Un programme chinois d’investissements en infrastructures créant des liens durables', 'Un accord commercial européen', 'Une route touristique', 'Un traité de libre-échange américain'], 0, 'Elles créent parfois des dépendances par la dette.'],
            ['Fixer une norme technique internationale est un enjeu de puissance.', ['Vrai', 'Faux'], 0, 'Celui qui la fixe impose ses choix à tous ceux qui veulent vendre.'],
            ['Pourquoi accueillir des étudiants étrangers est-il un investissement d’influence ?', ['Ils repartent avec un réseau et une familiarité durables', 'Ils paient des droits d’inscription élevés', 'Ils restent définitivement', 'Ils remplacent la diplomatie'], 0, 'C’est l’un des leviers d’influence les plus rentables.'],
            ['Une dépendance créée par la puissance indirecte est toujours à sens unique.', ['Vrai', 'Faux'], 1, 'Une dépendance mutuelle contraint les deux parties.'],
          ],
        },
        {
          titre: 'La puissance des États-Unis aujourd’hui',
          axe: 'Analyser les dynamiques des puissances internationales',
          lecon: {
            titre: 'Une puissance complète, et contestée',
            cours: `Les États-Unis restent, au début des années 2020, la seule puissance **complète** : présente sur tous les registres à la fois. Mais leur position relative se transforme.

## Les fondements
- **Militaire** : un budget de défense supérieur à celui des dix pays suivants réunis, environ 750 bases dans quelque 80 pays, onze porte-avions, une capacité de projection sans équivalent, un réseau d’alliances dont l’OTAN.
- **Économique** : premier ou deuxième PIB mondial, domination des secteurs de pointe, entreprises technologiques et financières dominantes.
- **Monétaire** : le **dollar** assure l’essentiel des réserves de change et des échanges internationaux, ce qui permet de financer les déficits et de faire de la sanction financière une arme — l’extraterritorialité du droit américain.
- **Culturelle** : cinéma, séries, musique, plateformes, universités de premier rang, langue.
- **Scientifique** : dépenses de recherche, brevets, prix, capacité d’attirer les chercheurs du monde entier.

## Les limites internes
- Une **polarisation politique** profonde, qui rend la politique étrangère moins prévisible d’une administration à l’autre ;
- des **inégalités** sociales, sanitaires et raciales importantes ;
- une **dette publique** élevée ;
- des débats récurrents sur l’**engagement extérieur**, entre interventionnisme et retrait — les guerres d’Irak et d’Afghanistan ayant durablement marqué l’opinion.

## Les contestations externes
- La **Chine** conteste la primauté américaine sur presque tous les registres : commerce, technologies, monnaie, présence en mer de Chine méridionale, influence en Afrique et en Asie ;
- la **Russie** conteste l’ordre européen par la force ;
- des puissances moyennes conduisent des politiques de plus en plus **autonomes** ;
- des projets de **dédollarisation** partielle apparaissent, encore limités.

> Ce que le jalon demande de nuancer : la puissance américaine est **relativement** moins dominante qu’en 1991, mais elle demeure la seule qui réunisse tous les attributs. Multipolarité ne signifie pas égalité des pôles.

## L’exercice de la puissance
Il combine alliances, présence militaire, sanctions économiques, diplomatie, influence culturelle et rôle dans les institutions internationales. Les États-Unis y sont à la fois le principal architecte de l’ordre international issu de 1945 et l’un de ses contestataires occasionnels, quand ils s’en écartent au nom de leurs intérêts.`,
          },
          questions: [
            ['Pourquoi qualifie-t-on la puissance américaine de « complète » ?', ['Elle est présente sur tous les registres à la fois', 'Elle est militaire uniquement', 'Elle est incontestée', 'Elle est la plus ancienne'], 0, 'Militaire, économique, monétaire, culturelle et scientifique.'],
            ['Quel avantage le dollar confère-t-il aux États-Unis ?', ['Financer leurs déficits et faire de la sanction financière une arme', 'Réduire leur dette automatiquement', 'Fixer les prix du pétrole', 'Éviter toute inflation'], 0, 'L’extraterritorialité du droit américain en découle.'],
            ['Comment se compare le budget de défense américain aux autres ?', ['Il dépasse celui des dix pays suivants réunis', 'Il est le deuxième mondial', 'Il équivaut à celui de la Chine', 'Il est en forte baisse'], 0, 'Avec environ 750 bases dans quelque 80 pays.'],
            ['Quelle est la principale contestation externe de la primauté américaine ?', ['La Chine, sur presque tous les registres', 'Le Brésil', 'L’Union européenne seule', 'Le Japon'], 0, 'Commerce, technologies, monnaie et influence régionale.'],
            ['La multipolarité signifie que tous les pôles sont d’égale puissance.', ['Vrai', 'Faux'], 1, 'Les États-Unis restent la seule puissance réunissant tous les attributs.'],
            ['Quelle limite interne pèse sur la politique étrangère américaine ?', ['La polarisation politique, qui la rend moins prévisible', 'L’absence d’armée permanente', 'Le manque d’universités', 'L’absence de monnaie nationale'], 0, 'Elle varie fortement d’une administration à l’autre.'],
            ['Les guerres d’Irak et d’Afghanistan ont nourri un débat sur l’engagement extérieur.', ['Vrai', 'Faux'], 0, 'Entre interventionnisme et retrait, l’opinion américaine reste divisée.'],
            ['Quel rôle les États-Unis ont-ils joué dans l’ordre international issu de 1945 ?', ['Ils en sont le principal architecte, et parfois le contestataire', 'Ils y ont toujours été extérieurs', 'Ils l’ont subi', 'Ils n’ont contribué qu’à l’ONU'], 0, 'Ils s’en écartent occasionnellement au nom de leurs intérêts.'],
          ],
        },

        // ---- Thème 3 : les frontières ----------------------------------------
        {
          titre: 'Les formes des frontières dans le monde',
          axe: 'Étudier les divisions politiques du monde : les frontières',
          lecon: {
            titre: 'Lignes, zones, murs',
            cours: `Une **frontière** est la limite d’un territoire sur lequel s’exerce une souveraineté. Elle est à la fois une **ligne** sur une carte, une **institution** juridique et un **fait social** vécu par ceux qui la traversent ou qu’elle sépare.

## Une typologie
- Selon leur **tracé** : les frontières **naturelles** s’appuient sur un fleuve, une crête, un littoral ; les frontières **géométriques**, tracées à la règle, sont fréquentes en Afrique et en Amérique du Nord, héritées de partages coloniaux ou de conventions.
- Selon leur **origine** : issues d’un traité, d’une guerre, d’une décolonisation, d’un référendum.
- Selon leur **fonction** : ouvertes ou fermées, contrôlées ou poreuses, militarisées ou invisibles.

> L’expression « frontière naturelle » est trompeuse : un fleuve n’a rien de naturellement séparateur — il fut longtemps un axe de circulation qui unit les deux rives plus qu’il ne les oppose. Une frontière est toujours une **construction politique**.

## Les frontières autres que terrestres
- **Maritimes** : la convention de Montego Bay (1982) fixe la mer territoriale à 12 milles marins et la **zone économique exclusive** à 200 milles, où l’État exerce des droits sur les ressources. Elle explique l’intérêt stratégique des îles les plus modestes.
- **Aériennes**, superposées à l’espace terrestre.
- **Numériques** : le contrôle national d’Internet, le filtrage, la localisation obligatoire des données — ce que l’on appelle parfois la « souveraineté numérique ».

## La ligne et la zone
Toute frontière n’est pas linéaire. Certaines sont des **zones** : marges, confins, espaces de transition où l’autorité s’estompe. À l’inverse, les **murs** matérialisent la ligne de la façon la plus brutale.

## Le paradoxe contemporain
Jamais les échanges n’ont été aussi intenses, et jamais on n’a construit autant de barrières. On comptait moins d’une dizaine de murs frontaliers à la chute du mur de Berlin ; on en dénombre aujourd’hui plusieurs dizaines. La mondialisation n’efface pas les frontières : elle les **différencie** — très ouvertes aux capitaux et aux marchandises, sélectives pour les personnes, et d’autant plus selon le passeport que l’on détient.`,
          },
          questions: [
            ['Qu’est-ce qu’une frontière ?', ['La limite d’un territoire sur lequel s’exerce une souveraineté', 'Un obstacle naturel', 'Une zone militaire', 'Une ligne de démarcation provisoire'], 0, 'Elle est à la fois ligne, institution juridique et fait social.'],
            ['Pourquoi l’expression « frontière naturelle » est-elle trompeuse ?', ['Parce qu’un fleuve unit souvent les rives plus qu’il ne les sépare', 'Parce que les fleuves changent de cours', 'Parce que la nature n’existe pas', 'Parce que les montagnes sont franchissables'], 0, 'Une frontière est toujours une construction politique.'],
            ['Quelle est l’étendue de la zone économique exclusive selon la convention de Montego Bay ?', ['200 milles marins', '12 milles marins', '50 milles marins', '500 milles marins'], 0, 'La mer territoriale, elle, s’étend sur 12 milles.'],
            ['Pourquoi les îles les plus modestes ont-elles un intérêt stratégique ?', ['Parce qu’elles ouvrent droit à une zone économique exclusive', 'Parce qu’elles abritent des bases', 'Parce qu’elles sont peuplées', 'Parce qu’elles produisent du pétrole'], 0, 'Le droit de la mer transforme un rocher en ressource.'],
            ['La mondialisation a fait disparaître les frontières.', ['Vrai', 'Faux'], 1, 'Elle les DIFFÉRENCIE : ouvertes aux capitaux, sélectives pour les personnes.'],
            ['Combien de murs frontaliers comptait-on à la chute du mur de Berlin ?', ['Moins d’une dizaine', 'Plusieurs dizaines', 'Aucun', 'Plus de cent'], 0, 'Il y en a aujourd’hui plusieurs dizaines.'],
            ['Que sont les frontières géométriques ?', ['Des frontières tracées à la règle, souvent héritées de partages coloniaux', 'Des frontières suivant un relief', 'Des frontières maritimes', 'Des frontières mobiles'], 0, 'Elles sont fréquentes en Afrique et en Amérique du Nord.'],
            ['Certaines frontières sont des zones plutôt que des lignes.', ['Vrai', 'Faux'], 0, 'Marges et confins sont des espaces de transition où l’autorité s’estompe.'],
          ],
        },
        {
          titre: 'Tracer des frontières : approche géopolitique',
          axe: 'Étudier les divisions politiques du monde : les frontières',
          lecon: {
            titre: 'Qui trace, comment, et avec quelles conséquences',
            cours: `Tracer une frontière est un acte **politique** : il désigne un « nous » et un « eux », attribue des ressources, et engage des générations.

## Les grands moments du traçage
- Les **traités de Westphalie** (1648) posent le principe de souveraineté territoriale exclusive : c’est l’acte de naissance du système international moderne.
- La **conférence de Berlin** (1884-1885) organise le partage de l’Afrique entre puissances européennes, sans consultation ni connaissance des réalités locales. D’où la prédominance des tracés géométriques et la coupure de peuples entiers.
- Les **traités de 1919-1920** redessinent l’Europe centrale au nom du droit des peuples à disposer d’eux-mêmes, principe énoncé par Wilson — mais que la réalité des peuplements mêlés rend inapplicable à la lettre, laissant partout des minorités.
- La **décolonisation** consacre le principe de l’*uti possidetis juris* : les nouveaux États héritent des frontières coloniales. Le choix est assumé par l’Organisation de l’unité africaine en 1964, non parce que ces frontières seraient justes, mais parce que les rouvrir toutes provoquerait des guerres en chaîne.

> C’est l’un des arbitrages les plus instructifs du thème : conserver des frontières reconnues arbitraires, au nom de la **stabilité** contre la **justice** du tracé.

## Ce qui rend un tracé conflictuel
- La présence de **ressources** : eau, hydrocarbures, minerais, zones de pêche ;
- une **population** partagée entre deux États ;
- une **valeur symbolique** — un lieu saint, un berceau national revendiqué de part et d’autre ;
- l’absence de **reconnaissance** internationale du tracé.

## Comment on règle un différend
Par la **négociation** bilatérale, par la **médiation**, par l’arbitrage de la **Cour internationale de justice**, ou par un **référendum** d’autodétermination — la partition du Soudan du Sud en 2011 en est un exemple. Faute de quoi, le conflit s’installe : Cachemire, Sahara occidental, Chypre, ligne de contrôle en Ukraine.

## Les frontières non reconnues
Il existe des entités qui contrôlent un territoire sans être reconnues, ou reconnues par quelques États seulement. Elles rappellent que la frontière n’existe pleinement que si les autres l’**acceptent** : une frontière est une relation, pas seulement un tracé.`,
          },
          questions: [
            ['Que posent les traités de Westphalie en 1648 ?', ['Le principe de souveraineté territoriale exclusive', 'Le droit des peuples à disposer d’eux-mêmes', 'L’abolition des frontières', 'La liberté des mers'], 0, 'C’est l’acte de naissance du système international moderne.'],
            ['Qu’organise la conférence de Berlin de 1884-1885 ?', ['Le partage de l’Afrique entre puissances européennes', 'La fin de la traite', 'Le tracé des frontières européennes', 'La création de la Société des Nations'], 0, 'Sans consultation ni connaissance des réalités locales.'],
            ['Que signifie le principe de l’uti possidetis juris ?', ['Les nouveaux États héritent des frontières coloniales', 'Chaque peuple choisit son État', 'Les frontières sont redessinées après indépendance', 'Le vainqueur fixe la frontière'], 0, 'Assumé par l’Organisation de l’unité africaine en 1964.'],
            ['Pourquoi l’OUA a-t-elle conservé des frontières reconnues arbitraires ?', ['Parce que les rouvrir toutes provoquerait des guerres en chaîne', 'Parce qu’elles étaient justes', 'Parce que l’ONU l’imposait', 'Parce qu’elles suivaient les peuplements'], 0, 'Un arbitrage de la stabilité contre la justice du tracé.'],
            ['Le droit des peuples à disposer d’eux-mêmes a pu être appliqué à la lettre en 1919.', ['Vrai', 'Faux'], 1, 'Les peuplements mêlés ont laissé partout des minorités.'],
            ['Quel exemple de partition par référendum le thème retient-il ?', ['Le Soudan du Sud en 2011', 'Chypre en 1974', 'Le Cachemire en 1947', 'La Crimée en 2014'], 0, 'L’autodétermination y a été organisée et reconnue.'],
            ['Qu’est-ce qui rend souvent un tracé frontalier conflictuel ?', ['La présence de ressources, une population partagée ou une valeur symbolique', 'La longueur de la frontière', 'Le climat', 'Le relief plat'], 0, 'L’absence de reconnaissance internationale aggrave le différend.'],
            ['Une frontière n’existe pleinement que si les autres États l’acceptent.', ['Vrai', 'Faux'], 0, 'C’est une relation, pas seulement un tracé.'],
          ],
        },
        {
          titre: 'Les frontières en débat : reconnaître et dépasser les frontières',
          axe: 'Étudier les divisions politiques du monde : les frontières',
          lecon: {
            titre: 'Effacer, franchir, contourner',
            cours: `Les frontières sont contestées de deux façons opposées : certains veulent en établir de nouvelles, d’autres veulent les dépasser.

## La reconnaissance
Un État n’existe pleinement qu’une fois **reconnu**. La reconnaissance est un acte politique, non un constat : plusieurs entités contrôlent un territoire, une population et une administration sans être admises dans le concert des nations.

Ce sont les « **États de facto** » : Somaliland, Transnistrie, Ossétie du Sud, Haut-Karabagh avant 2023. Leur cas montre que les critères matériels de l’État ne suffisent pas — il faut le **regard des autres**.

Le Kosovo, reconnu par une centaine d’États et refusé par d’autres, illustre la dimension géopolitique de la reconnaissance : on reconnaît aussi en fonction de ses propres contentieux internes.

## Dépasser les frontières
- L’**intégration régionale** : l’espace **Schengen** supprime les contrôles aux frontières intérieures de 27 pays européens, tout en renforçant la frontière extérieure commune. L’union douanière, le marché unique et la libre circulation des personnes en sont les instruments.
- La **coopération transfrontalière** : eurorégions, bassins de vie partagés, travailleurs frontaliers, services communs. Des dizaines de milliers de personnes traversent chaque jour une frontière pour aller travailler.
- Les **flux** immatériels — capitaux, données, information — ignorent largement les frontières, ce qui pose la question de la régulation et de la fiscalité.

> Une frontière ouverte n’est pas une frontière abolie : Schengen suppose au contraire une frontière extérieure **renforcée**, des bases de données communes et une agence de garde-frontières. Ouvrir à l’intérieur, c’est fermer davantage à l’extérieur.

## Le retour des frontières
Le mouvement inverse est tout aussi net : rétablissement temporaire des contrôles lors des crises migratoires, sanitaires ou sécuritaires ; multiplication des barrières ; Brexit. La **pandémie** a montré la rapidité avec laquelle des frontières que l’on croyait effacées se referment.

## Ce que le thème demande
Non pas de choisir entre un monde de murs et un monde sans frontières, mais de comprendre que la frontière remplit plusieurs **fonctions** — protection, identité, régulation, fiscalité — et que chaque projet d’ouverture ou de fermeture arbitre entre elles.`,
          },
          questions: [
            ['Qu’est-ce qu’un État de facto ?', ['Une entité qui contrôle un territoire sans être reconnue internationalement', 'Un État fédéral', 'Un État sans constitution', 'Un territoire sous mandat de l’ONU'], 0, 'Somaliland, Transnistrie et Ossétie du Sud en sont des exemples.'],
            ['La reconnaissance d’un État est-elle un simple constat ?', ['Non, c’est un acte politique', 'Oui, elle est automatique', 'Oui, elle relève de l’ONU seule', 'Non, elle est juridiquement obligatoire'], 0, 'On reconnaît aussi en fonction de ses propres contentieux internes.'],
            ['Que supprime l’espace Schengen ?', ['Les contrôles aux frontières intérieures', 'Toutes les frontières européennes', 'Les droits de douane mondiaux', 'Les contrôles à la frontière extérieure'], 0, 'La frontière extérieure commune est au contraire renforcée.'],
            ['Ouvrir les frontières intérieures suppose de fermer davantage à l’extérieur.', ['Vrai', 'Faux'], 0, 'Schengen implique bases de données communes et agence de garde-frontières.'],
            ['Qu’est-ce que la coopération transfrontalière ?', ['Des dispositifs communs entre territoires voisins de part et d’autre d’une frontière', 'Un traité militaire', 'Un accord de libre-échange mondial', 'Une union monétaire'], 0, 'Eurorégions, bassins de vie partagés, travailleurs frontaliers.'],
            ['Qu’a montré la pandémie du point de vue des frontières ?', ['La rapidité avec laquelle des frontières crues effacées se referment', 'Que les frontières avaient disparu', 'Que Schengen était irréversible', 'Que les contrôles étaient inutiles'], 0, 'Le retour des frontières est aussi net que leur ouverture.'],
            ['Pourquoi le cas du Kosovo est-il instructif ?', ['Sa reconnaissance dépend des contentieux internes de chaque État', 'Il n’est reconnu par personne', 'Il est reconnu par tous', 'Il n’a pas de territoire'], 0, 'Reconnu par une centaine d’États, refusé par d’autres.'],
            ['Les flux de données et de capitaux respectent les frontières étatiques.', ['Vrai', 'Faux'], 1, 'Ils les ignorent largement, d’où les questions de régulation et de fiscalité.'],
          ],
        },
        {
          titre: 'Les frontières, des espaces dynamiques qui dépassent le territoire des États',
          axe: 'Étudier les divisions politiques du monde : les frontières',
          lecon: {
            titre: 'Vivre la frontière',
            cours: `Une frontière n’est pas seulement une limite : c’est un **espace habité**, qui produit ses activités, ses métiers et ses paysages propres.

## L’effet frontière
La différence de législation, de fiscalité, de salaires ou de prix crée de l’activité **parce que** la frontière existe :
- commerces frontaliers, stations-service, pharmacies, bureaux de tabac ;
- travail **frontalier** : des centaines de milliers de personnes traversent quotidiennement une frontière pour aller travailler — vers le Luxembourg, la Suisse, l’Allemagne, ou entre Tijuana et San Diego ;
- **délocalisation** de proximité : les *maquiladoras* mexicaines, usines d’assemblage installées le long de la frontière américaine, combinent salaires mexicains et accès au marché américain ;
- économies **illégales** : contrebande, trafics, passeurs, qui vivent eux aussi de l’écart entre deux régimes juridiques.

## Les régions transfrontalières
Certaines forment de véritables **bassins de vie** intégrés : la Grande Région autour du Luxembourg, l’Öresund entre Danemark et Suède, le Rhin supérieur. On y organise des transports communs, des équipements partagés, parfois des institutions dédiées.

Elles rencontrent des difficultés typiques : régimes fiscaux et sociaux différents, diplômes non reconnus, services de secours qui ne peuvent pas franchir la ligne, statistiques incompatibles.

## Les métropoles frontalières
Certaines villes doivent leur existence à la frontière — Ciudad Juárez et El Paso, Bâle au contact de trois pays, Genève dont le bassin d’emploi déborde largement en France. La frontière y devient une donnée quotidienne, gérée par des accords spécifiques.

> L’asymétrie est ce qui fait la frontière vivante : si les deux côtés étaient identiques, il n’y aurait ni flux, ni activité, ni intérêt à traverser. La frontière crée de la **ressource** en même temps qu’elle sépare.

## Les acteurs
États, régions, communes, entreprises, associations, habitants : la frontière est gérée à plusieurs niveaux, et rarement par le seul pouvoir central. C’est un espace de **négociation permanente**, où le local pèse souvent plus que le national.`,
          },
          questions: [
            ['Qu’est-ce que l’effet frontière ?', ['L’activité créée par l’écart de législation, de prix ou de salaires entre deux pays', 'La fermeture d’une frontière', 'La longueur d’une frontière', 'Le contrôle douanier'], 0, 'Commerces frontaliers et travail frontalier en découlent.'],
            ['Que sont les maquiladoras ?', ['Des usines d’assemblage installées le long de la frontière mexicaine', 'Des marchés transfrontaliers', 'Des postes de douane', 'Des zones agricoles'], 0, 'Elles combinent salaires mexicains et accès au marché américain.'],
            ['Quelle difficulté typique rencontrent les régions transfrontalières ?', ['Des régimes fiscaux et sociaux différents et des diplômes non reconnus', 'L’absence de population', 'Le manque de transports uniquement', 'L’absence de langue commune systématique'], 0, 'Les secours ne peuvent parfois pas franchir la ligne.'],
            ['Si les deux côtés d’une frontière étaient identiques, l’activité frontalière disparaîtrait.', ['Vrai', 'Faux'], 0, 'C’est l’asymétrie qui crée les flux et l’intérêt à traverser.'],
            ['Quel espace transfrontalier associe le Danemark et la Suède ?', ['L’Öresund', 'La Grande Région', 'Le Rhin supérieur', 'Le Benelux'], 0, 'Un bassin de vie intégré, doté de transports communs.'],
            ['Quelle ville suisse se trouve au contact de trois pays ?', ['Bâle', 'Genève', 'Zurich', 'Lausanne'], 0, 'Genève, elle, a un bassin d’emploi qui déborde en France.'],
            ['Les économies illégales vivent aussi de l’écart entre deux régimes juridiques.', ['Vrai', 'Faux'], 0, 'Contrebande et trafics prospèrent sur la différence de législation.'],
            ['Qui gère concrètement un espace frontalier ?', ['Plusieurs niveaux d’acteurs, du local au national', 'Le seul pouvoir central', 'Les seules douanes', 'Une agence internationale'], 0, 'C’est un espace de négociation permanente.'],
          ],
        },
        {
          titre: 'Enjeux migratoires : les frontières externes et internes de l’Union européenne',
          axe: 'Étudier les divisions politiques du monde : les frontières',
          lecon: {
            titre: 'Schengen, Dublin et la question de la solidarité',
            cours: `L’Union européenne a supprimé ses frontières intérieures tout en construisant une frontière extérieure commune : c’est cette combinaison qui organise, et complique, la question migratoire.

## Le dispositif
- L’**espace Schengen** (1985, appliqué en 1995) supprime les contrôles aux frontières intérieures pour 27 pays, dont quatre hors Union.
- **Frontex**, créée en 2004 et devenue Agence européenne de garde-frontières et de garde-côtes, appuie les États dans la surveillance de la frontière extérieure.
- Les **accords de Dublin** rendent responsable de l’examen d’une demande d’asile le **premier pays d’entrée** dans l’Union.
- Des bases de données communes enregistrent les entrées et les demandes.

## La faille du système
La règle de Dublin fait peser l’essentiel de la charge sur les pays d’**entrée** — Grèce, Italie, Espagne, Malte —, en raison de leur seule position géographique. Les mécanismes de **répartition** entre États membres n’ont jamais fonctionné durablement : chaque crise rouvre le conflit entre solidarité et souveraineté nationale.

> C’est le point que le programme demande de comprendre : ce n’est pas une difficulté technique mais un **désaccord politique** sur ce que les États se doivent les uns aux autres.

## La crise de 2015 et ses suites
L’arrivée de plus d’un million de personnes en 2015, fuyant principalement la Syrie, l’Afghanistan et l’Érythrée, a produit trois effets durables : le rétablissement de contrôles intérieurs par plusieurs États, la conclusion d’accords avec des pays tiers pour retenir les départs, et un durcissement général des politiques d’asile.

Le Pacte sur la migration et l’asile, adopté en 2024, tente de refonder l’équilibre entre responsabilité des pays d’entrée et solidarité des autres.

## Les enjeux à distinguer
Une confusion fréquente, qu’un devoir doit éviter :
- le **demandeur d’asile** sollicite une protection au titre de la convention de Genève de 1951 ; le droit d’asile est un droit **individuel**, protégé par le droit international ;
- le **migrant économique** relève, lui, des politiques nationales d’immigration ;
- ces catégories se recouvrent dans les faits, mais pas en droit.

## Le coût humain
La Méditerranée est la route migratoire la plus meurtrière du monde : plusieurs dizaines de milliers de disparus depuis 2014. Les débats portent sur les opérations de sauvetage, la criminalisation de l’aide, et l’externalisation du contrôle vers des pays où les droits ne sont pas garantis.`,
          },
          questions: [
            ['Que prévoient les accords de Dublin ?', ['Le premier pays d’entrée est responsable de l’examen de la demande d’asile', 'La répartition égale des demandeurs entre États', 'La libre circulation des demandeurs', 'La compétence exclusive de Frontex'], 0, 'D’où la charge concentrée sur les pays méditerranéens.'],
            ['Quel est le rôle de Frontex ?', ['Appuyer les États dans la surveillance de la frontière extérieure', 'Instruire les demandes d’asile', 'Contrôler les frontières intérieures', 'Négocier les traités'], 0, 'Créée en 2004, devenue agence de garde-frontières et de garde-côtes.'],
            ['Les mécanismes de répartition des demandeurs d’asile ont durablement fonctionné.', ['Vrai', 'Faux'], 1, 'Chaque crise rouvre le conflit entre solidarité et souveraineté nationale.'],
            ['Quelle différence entre un demandeur d’asile et un migrant économique ?', ['Le premier sollicite une protection au titre du droit international, le second relève des politiques nationales', 'Aucune, ce sont des synonymes', 'Le premier vient toujours d’Afrique', 'Le second bénéficie de plus de droits'], 0, 'Les catégories se recouvrent dans les faits, mais pas en droit.'],
            ['Sur quel texte repose le droit d’asile ?', ['La convention de Genève de 1951', 'Le traité de Rome', 'Les accords de Schengen', 'Le pacte de 2024'], 0, 'C’est un droit individuel protégé par le droit international.'],
            ['Combien de personnes sont arrivées dans l’Union en 2015 ?', ['Plus d’un million', 'Environ cent mille', 'Environ dix millions', 'Moins de cinquante mille'], 0, 'Fuyant principalement la Syrie, l’Afghanistan et l’Érythrée.'],
            ['Quelle est la route migratoire la plus meurtrière du monde ?', ['La Méditerranée', 'La frontière américano-mexicaine', 'La Manche', 'La mer Égée seule'], 0, 'Plusieurs dizaines de milliers de disparus depuis 2014.'],
            ['L’espace Schengen ne comprend que des États membres de l’Union européenne.', ['Vrai', 'Faux'], 1, 'Il compte 27 pays, dont quatre qui ne sont pas membres de l’Union.'],
          ],
        },

        // ---- Thème 4 : s’informer --------------------------------------------
        {
          titre: 'L’information imprimée : de la diffusion de l’imprimerie à la presse à grand tirage',
          axe: 'S’informer : un regard critique sur les sources et les moyens de communication',
          lecon: {
            titre: 'Quatre siècles de circulation de l’écrit',
            cours: `L’**imprimerie** à caractères mobiles, mise au point par **Gutenberg** vers 1450, change l’échelle de la circulation des idées : ce qu’un copiste mettait un an à produire s’imprime désormais en centaines d’exemplaires.

## Les premiers effets
- La **Réforme** se diffuse par l’imprimé : les thèses de Luther, traduites en allemand, circulent en quelques semaines dans tout l’Empire. Aucun mouvement religieux antérieur n’avait disposé d’un tel vecteur.
- Les États réagissent aussitôt par la **censure** : privilèges d’impression, autorisations préalables, index des livres interdits.
- Les savoirs se **stabilisent** : un texte imprimé est identique partout, ce qui rend possible la comparaison, la critique et la science moderne.

## La naissance de la presse
- 1631 : la **Gazette** de Théophraste Renaudot, hebdomadaire proche du pouvoir, première publication périodique française.
- La **Révolution** libère l’imprimé : la Déclaration de 1789 proclame la libre communication des pensées et des opinions, et des centaines de titres paraissent. La liberté est ensuite reprise et rendue à plusieurs reprises selon les régimes.
- **1881** : la loi sur la liberté de la presse supprime l’autorisation préalable et fixe un régime de responsabilité *a posteriori*. Elle est encore en vigueur.

## La presse à grand tirage
La fin du XIXe siècle réunit les conditions d’une presse de masse : rotatives, papier bon marché, **alphabétisation** généralisée par les lois scolaires, chemin de fer pour la diffusion, télégraphe pour l’information rapide, et surtout **publicité**, qui permet de vendre le journal en dessous de son coût.

*Le Petit Journal* dépasse le million d’exemplaires ; la presse devient le premier média de masse de l’histoire, et le principal espace du débat public.

> Le modèle économique change tout : un journal financé par la publicité dépend de son audience, donc du fait divers, du feuilleton et du sensationnel autant que de l’information.

## Ce que le jalon met en place
Il installe les questions qui traverseront tout le thème : qui contrôle la diffusion, qui la finance, comment un pouvoir tente de la limiter, et ce que change chaque élargissement du public.`,
          },
          questions: [
            ['Vers quelle date Gutenberg met-il au point l’imprimerie à caractères mobiles ?', ['Vers 1450', 'Vers 1350', 'Vers 1550', 'Vers 1650'], 0, 'Ce qu’un copiste mettait un an à produire s’imprime en centaines d’exemplaires.'],
            ['Quel mouvement religieux profite le plus de l’imprimerie naissante ?', ['La Réforme protestante', 'La Contre-Réforme', 'Le jansénisme', 'Le gallicanisme'], 0, 'Les thèses de Luther circulent en quelques semaines dans tout l’Empire.'],
            ['Quel périodique Théophraste Renaudot fonde-t-il en 1631 ?', ['La Gazette', 'Le Mercure', 'Le Petit Journal', 'Le Moniteur'], 0, 'Première publication périodique française, proche du pouvoir.'],
            ['Que fait la loi de 1881 sur la presse ?', ['Elle supprime l’autorisation préalable et instaure une responsabilité a posteriori', 'Elle rétablit la censure', 'Elle nationalise les journaux', 'Elle crée un ministère de l’Information'], 0, 'Elle est encore en vigueur aujourd’hui.'],
            ['Quelles conditions permettent l’essor de la presse à grand tirage ?', ['Rotatives, papier bon marché, alphabétisation, chemin de fer et publicité', 'La seule invention de l’imprimerie', 'La suppression des impôts', 'Le développement de la radio'], 0, 'La publicité permet de vendre le journal sous son coût.'],
            ['L’imprimé a permis de stabiliser les savoirs.', ['Vrai', 'Faux'], 0, 'Un texte identique partout rend possible la comparaison et la critique.'],
            ['Quel effet le financement publicitaire a-t-il sur le contenu d’un journal ?', ['Il le rend dépendant de l’audience, donc du fait divers et du sensationnel', 'Il garantit son indépendance', 'Il supprime les rubriques politiques', 'Il n’a aucun effet'], 0, 'Le modèle économique pèse sur la ligne éditoriale.'],
            ['Quel quotidien dépasse le million d’exemplaires à la fin du XIXe siècle ?', ['Le Petit Journal', 'La Gazette', 'Le Figaro', 'L’Aurore'], 0, 'La presse devient le premier média de masse de l’histoire.'],
          ],
        },
        {
          titre: 'Un paysage médiatique bouleversé au XXe siècle par les médias de masse : la radio et la télévision',
          axe: 'S’informer : un regard critique sur les sources et les moyens de communication',
          lecon: {
            titre: 'La voix, l’image et le pouvoir',
            cours: `Au XXe siècle, l’information cesse d’être seulement lue : elle s’**entend**, puis se **voit**. Chaque changement de support modifie le rapport au pouvoir.

## La radio
Les premières émissions régulières datent des années 1920. La radio apporte l’**immédiateté** et touche ceux que l’écrit n’atteignait pas — analphabètes compris. Elle crée un lien de **proximité** : une voix s’adresse à chacun.

Elle devient aussitôt un instrument politique :
- les *causeries au coin du feu* de Roosevelt à partir de 1933 ;
- la propagande des régimes totalitaires, qui diffusent des postes à bas prix pour toucher chaque foyer ;
- l’**Appel du 18 juin 1940** sur la BBC, et le rôle de Radio Londres, avec ses messages personnels, dans la Résistance ;
- les **radios libres** ensuite, autorisées en France en 1981 après des années d’émissions clandestines.

## La télévision
Elle se généralise dans les foyers français au cours des années 1960. Elle ajoute l’**image**, avec sa force d’évidence : ce qu’on voit paraît vrai.

Jusqu’en 1982, la radiodiffusion est un **monopole d’État** en France ; le journal télévisé est étroitement contrôlé, et l’ORTF sert le pouvoir. La libéralisation vient avec la création d’une autorité de régulation en 1982, l’autorisation des télévisions privées, puis la privatisation de TF1 en 1987.

Quelques moments marquent la conscience du pouvoir de l’image : le débat télévisé Kennedy-Nixon de 1960, où l’apparence pèse plus que les arguments ; la guerre du Vietnam, première guerre télévisée ; la chute du mur de Berlin, suivie en direct.

> La **guerre du Golfe** de 1991, retransmise en continu, marque un tournant : l’information devient un flux permanent, et l’image en direct s’impose au moment même où elle est le moins vérifiée.

## Les effets
- **Simultanéité** : un même événement est vécu ensemble par des millions de personnes ;
- **personnalisation** de la vie politique, qui se joue désormais sur la présence à l’écran ;
- **format** : le temps de parole, la formule, le rythme imposent leurs contraintes au contenu ;
- **concentration** : les médias de masse coûtent cher, ce qui pose la question de la propriété et de l’indépendance des rédactions.`,
          },
          questions: [
            ['Quel avantage la radio présente-t-elle sur la presse écrite ?', ['L’immédiateté, et l’accès de ceux que l’écrit n’atteignait pas', 'Une meilleure précision', 'Un coût de production supérieur', 'Une plus grande liberté légale'], 0, 'Elle touche les analphabètes et crée un lien de proximité.'],
            ['Quel discours du 18 juin 1940 illustre le rôle politique de la radio ?', ['L’Appel du général de Gaulle sur la BBC', 'Une causerie de Roosevelt', 'Un discours de Churchill au Parlement', 'Une allocution de Pétain'], 0, 'Radio Londres et ses messages personnels joueront un rôle majeur.'],
            ['Jusqu’à quand la radiodiffusion est-elle un monopole d’État en France ?', ['Jusqu’en 1982', 'Jusqu’en 1968', 'Jusqu’en 1974', 'Jusqu’en 1990'], 0, 'Une autorité de régulation est alors créée, avant la privatisation de TF1 en 1987.'],
            ['Que révèle le débat télévisé Kennedy-Nixon de 1960 ?', ['Que l’apparence à l’écran peut peser plus que les arguments', 'Que la télévision est un média secondaire', 'Que le direct est impossible', 'Que les débats sont sans effet'], 0, 'Les auditeurs radio et les téléspectateurs n’ont pas désigné le même vainqueur.'],
            ['Les radios libres ont été autorisées en France en 1981.', ['Vrai', 'Faux'], 0, 'Après des années d’émissions clandestines.'],
            ['Quel conflit marque le passage à l’information en flux continu ?', ['La guerre du Golfe de 1991', 'La guerre du Vietnam', 'La guerre d’Algérie', 'La guerre des Malouines'], 0, 'L’image en direct s’impose au moment où elle est le moins vérifiée.'],
            ['Quel effet la télévision a-t-elle eu sur la vie politique ?', ['Une personnalisation croissante, centrée sur la présence à l’écran', 'Un renforcement des partis', 'Une hausse de la participation électorale', 'Une disparition des débats'], 0, 'Le format impose ses contraintes au contenu.'],
            ['Le coût élevé des médias de masse pose la question de leur propriété.', ['Vrai', 'Faux'], 0, 'La concentration met en jeu l’indépendance des rédactions.'],
          ],
        },
        {
          titre: 'Naissance et extension du réseau Internet : l’information mondialisée et individualisée',
          axe: 'S’informer : un regard critique sur les sources et les moyens de communication',
          lecon: {
            titre: 'D’un réseau militaire à l’espace public mondial',
            cours: `Internet naît d’un projet de recherche militaire américain, **ARPANET**, à la fin des années 1960 : un réseau décentralisé, conçu pour continuer de fonctionner si l’un de ses nœuds est détruit.

## Les étapes
- 1969 : les premiers nœuds d’ARPANET sont reliés ;
- années 1970-1980 : les protocoles TCP/IP s’imposent et le réseau s’ouvre aux universités ;
- **1989-1991** : Tim Berners-Lee invente le **World Wide Web** au CERN — les liens hypertextes, les adresses, le navigateur ;
- années 1990 : ouverture au public et essor commercial ;
- années 2000 : le **web social** ; chacun devient producteur de contenus ;
- années 2010 : l’**Internet mobile** met le réseau dans chaque poche, et les **plateformes** deviennent les principaux points d’accès à l’information.

## Ce qui change
- **Immédiateté et mondialisation** : l’information circule instantanément et sans frontière ;
- **fin du monopole des médias** : n’importe qui peut publier, ce qui a permis de documenter des événements que les régimes voulaient cacher ;
- **individualisation** : chacun compose son propre flux, et l’**algorithme** de recommandation le compose largement pour lui ;
- **gratuité apparente** : le service est financé par la publicité, donc par l’attention et par les données.

## Les effets à connaître
- La **bulle de filtres** et la **chambre d’écho** : les recommandations exposent surtout à ce qui confirme, ce qui renforce les convictions et raréfie la contradiction ;
- l’**infobésité** : l’abondance rend le tri plus difficile que la recherche ;
- la **viralité** : ce qui circule est ce qui suscite une réaction, non ce qui est vérifié ;
- la **désinformation** organisée, dont des campagnes coordonnées par des États.

> Le renversement décisif : l’enjeu n’est plus l’**accès** à l’information, devenu presque illimité, mais sa **hiérarchisation** et sa **vérification**. Ce que le journalisme apportait par sa fonction éditoriale doit désormais être en partie assuré par le lecteur lui-même.

## La fracture numérique
L’accès reste très inégal selon les régions du monde, les revenus, l’âge et le niveau de formation — et il faut distinguer l’accès **matériel** de la **capacité** à s’en servir de façon critique, qui est la véritable fracture.`,
          },
          questions: [
            ['De quel projet Internet est-il issu ?', ['ARPANET, un réseau de recherche militaire américain', 'Un projet commercial d’IBM', 'Un programme européen', 'Une initiative de l’ONU'], 0, 'Réseau décentralisé, conçu pour survivre à la destruction d’un nœud.'],
            ['Qui invente le World Wide Web au CERN ?', ['Tim Berners-Lee', 'Vinton Cerf', 'Steve Jobs', 'Alan Turing'], 0, 'Liens hypertextes, adresses et navigateur, entre 1989 et 1991.'],
            ['Qu’est-ce qu’une bulle de filtres ?', ['Une exposition principalement à ce qui confirme ses convictions', 'Un dispositif de sécurité informatique', 'Un filtre publicitaire', 'Un moteur de recherche spécialisé'], 0, 'Elle raréfie la contradiction et renforce les convictions.'],
            ['Quel est le principal enjeu de l’information à l’ère d’Internet ?', ['Sa hiérarchisation et sa vérification, plus que son accès', 'Son coût d’achat', 'Sa vitesse de transmission', 'Sa longueur'], 0, 'L’accès est devenu presque illimité.'],
            ['Sur quoi repose la gratuité apparente des grandes plateformes ?', ['Sur la publicité, donc sur l’attention et les données', 'Sur des subventions publiques', 'Sur le mécénat', 'Sur les abonnements'], 0, 'Le service est financé, mais pas par celui qui l’utilise.'],
            ['Ce qui circule le plus sur les réseaux est ce qui a été le mieux vérifié.', ['Vrai', 'Faux'], 1, 'C’est ce qui suscite le plus de réactions qui circule.'],
            ['Qu’est-ce que l’infobésité ?', ['Une abondance d’informations qui rend le tri plus difficile que la recherche', 'Un excès de publicité', 'Une saturation des réseaux', 'Un défaut de mémoire des serveurs'], 0, 'Le problème s’est déplacé de la rareté vers le tri.'],
            ['Quelle est la véritable fracture numérique ?', ['La capacité à user du réseau de façon critique, au-delà de l’accès matériel', 'La vitesse de connexion', 'Le prix des appareils', 'La langue des contenus'], 0, 'L’accès matériel ne suffit pas à réduire l’inégalité.'],
          ],
        },
        {
          titre: 'Liberté ou contrôle de l’information : l’affaire Dreyfus et la presse',
          axe: 'S’informer : un regard critique sur les sources et les moyens de communication',
          lecon: {
            titre: 'Quand un journal fait basculer une affaire',
            cours: `L’**affaire Dreyfus** est le jalon qui montre la presse à son maximum de puissance — dans les deux sens.

## Les faits
En **1894**, le capitaine **Alfred Dreyfus**, officier alsacien et juif, est accusé d’avoir livré des documents à l’Allemagne. Condamné par un conseil de guerre sur la foi d’une pièce mince et d’une expertise contestée, il est dégradé publiquement et déporté à l’île du Diable.

En 1896, le colonel **Picquart** découvre que le véritable auteur du bordereau est le commandant **Esterhazy**. L’état-major étouffe l’affaire ; Esterhazy est acquitté en janvier 1898.

## « J’accuse… ! »
Le **13 janvier 1898**, **Émile Zola** publie dans *L’Aurore*, à la une, une lettre ouverte au président de la République, titrée par Clemenceau « J’accuse… ! ». Il y nomme les responsables et les accuse publiquement, sachant qu’il s’expose à un procès en diffamation — c’est précisément ce qu’il cherche, pour obtenir un débat contradictoire.

Le journal tire ce jour-là à **300 000 exemplaires**. Zola est condamné et s’exile à Londres.

## Ce que l’affaire révèle
- La presse est devenue une **puissance politique** : elle impose un sujet, structure deux camps, fait basculer l’opinion.
- Elle est aussi le lieu de la **calomnie** : la presse antidreyfusarde, notamment *La Libre Parole* de Drumont, déverse un antisémitisme d’une violence extrême et fabrique de fausses preuves.
- Les **intellectuels** apparaissent comme groupe : le mot prend son sens actuel avec la pétition dite « Manifeste des intellectuels » de janvier 1898. Des hommes de savoir interviennent dans le débat public au nom de la vérité et de la justice.
- La **France se divise** en deux camps, jusque dans les familles — le célèbre dessin de Caran d’Ache, « ils en ont parlé », le résume mieux qu’un long récit.

## L’issue
Dreyfus est gracié en 1899, **réhabilité en 1906**, réintégré dans l’armée. L’affaire pèse durablement : elle nourrit la loi de séparation des Églises et de l’État de 1905 et modifie le rapport entre pouvoir, armée et opinion.

> Ce que le jalon enseigne : la même liberté de la presse a permis la campagne de calomnie **et** son démenti. Elle n’est pas un instrument neutre, mais elle est la condition pour que l’erreur puisse être corrigée.`,
          },
          questions: [
            ['De quoi le capitaine Dreyfus est-il accusé en 1894 ?', ['D’avoir livré des documents militaires à l’Allemagne', 'D’avoir déserté', 'D’avoir comploté contre la République', 'D’avoir détourné des fonds'], 0, 'Il est condamné sur la foi d’une pièce mince et d’une expertise contestée.'],
            ['Dans quel journal Zola publie-t-il « J’accuse… ! » ?', ['L’Aurore', 'Le Figaro', 'La Libre Parole', 'Le Petit Journal'], 0, 'Le 13 janvier 1898, à la une, avec un titre trouvé par Clemenceau.'],
            ['Pourquoi Zola cherche-t-il à être poursuivi en diffamation ?', ['Pour obtenir un débat contradictoire public', 'Pour devenir célèbre', 'Pour éviter la prison', 'Par erreur juridique'], 0, 'Le procès devait permettre de discuter publiquement des preuves.'],
            ['Qui découvre en 1896 que le véritable auteur du bordereau est Esterhazy ?', ['Le colonel Picquart', 'Émile Zola', 'Georges Clemenceau', 'Le capitaine Dreyfus lui-même'], 0, 'L’état-major étouffe alors l’affaire.'],
            ['Quel groupe social apparaît avec l’affaire Dreyfus ?', ['Les intellectuels, au sens actuel du mot', 'Les journalistes professionnels', 'Les syndicalistes', 'Les fonctionnaires'], 0, 'Le « Manifeste des intellectuels » de janvier 1898 fixe l’usage du mot.'],
            ['La presse a joué un rôle uniquement favorable à Dreyfus.', ['Vrai', 'Faux'], 1, 'La presse antidreyfusarde a déversé un antisémitisme violent et fabriqué de fausses preuves.'],
            ['En quelle année Dreyfus est-il réhabilité ?', ['1906', '1899', '1898', '1914'], 0, 'Il est gracié dès 1899, mais la réhabilitation est plus tardive.'],
            ['Que montre l’affaire sur la liberté de la presse ?', ['Elle a permis la calomnie et son démenti : elle est la condition de la correction de l’erreur', 'Qu’elle doit être limitée', 'Qu’elle est sans effet politique', 'Qu’elle garantit la vérité'], 0, 'Elle n’est pas un instrument neutre, mais elle est indispensable.'],
          ],
        },
        {
          titre: 'Liberté ou contrôle de l’information : l’affirmation progressive du principe de liberté de l’information',
          axe: 'S’informer : un regard critique sur les sources et les moyens de communication',
          lecon: {
            titre: 'Une conquête lente et jamais définitive',
            cours: `La liberté de l’information n’a pas été donnée : elle a été **conquise**, texte après texte, et elle reste réversible.

## Les grandes étapes juridiques
- **1789** : l’article 11 de la Déclaration des droits de l’homme et du citoyen proclame que « la libre communication des pensées et des opinions est un des droits les plus précieux de l’homme » — en réservant la répression des abus définis par la loi.
- **XIXe siècle** : la liberté est accordée, retirée, restaurée au gré des régimes. La monarchie de Juillet, puis le Second Empire, la restreignent fortement.
- **1881** : la loi sur la liberté de la presse supprime l’autorisation préalable et le cautionnement, et fixe un régime de responsabilité *a posteriori* devant les tribunaux, avec un directeur de publication identifié. C’est le texte fondateur, toujours en vigueur.
- **1948** : la Déclaration universelle des droits de l’homme, article 19, énonce le droit de « chercher, de recevoir et de répandre » les informations, sans considération de frontières.
- **1950** : la Convention européenne des droits de l’homme, article 10, en fait un droit justiciable devant une cour.

## Les compléments contemporains
- La **protection des sources** des journalistes, reconnue par la loi française en 2010 : sans elle, personne ne parle à un journaliste ;
- le statut des **lanceurs d’alerte**, protégé au niveau européen depuis 2019 ;
- le droit d’**accès aux documents administratifs**, qui rend l’action publique vérifiable ;
- les autorités de **régulation** de l’audiovisuel et du numérique.

## Les limites légitimes
Aucune liberté n’est absolue. Le droit encadre : la **diffamation** et l’**injure**, l’**incitation** à la haine et à la violence, la **vie privée** et le droit à l’image, le **secret** de la défense nationale et le secret de l’instruction, la protection des mineurs.

> La difficulté est toujours la même : ces limites sont légitimes, et ce sont exactement celles qu’un pouvoir invoque quand il veut restreindre. C’est pourquoi le **juge**, et non l’administration, doit en décider.

## L’état des lieux
Les classements internationaux montrent une dégradation dans de nombreux pays : lois sur les « fausses nouvelles » utilisées contre l’opposition, procédures-bâillons contre les journalistes d’investigation, surveillance des communications, concentration des médias entre peu de mains. La liberté de l’information se mesure moins aux textes qu’à ce qu’il est effectivement possible de publier.`,
          },
          questions: [
            ['Que proclame l’article 11 de la Déclaration de 1789 ?', ['La libre communication des pensées et des opinions', 'La liberté de réunion', 'Le droit de vote', 'La liberté de culte'], 0, 'En réservant la répression des abus définis par la loi.'],
            ['Que supprime la loi de 1881 ?', ['L’autorisation préalable et le cautionnement', 'La responsabilité des journalistes', 'Le droit de réponse', 'Le secret des sources'], 0, 'Elle instaure une responsabilité a posteriori devant les tribunaux.'],
            ['Quel article de la Déclaration universelle de 1948 porte sur l’information ?', ['L’article 19', 'L’article 11', 'L’article 1er', 'L’article 10'], 0, 'Chercher, recevoir et répandre les informations sans considération de frontières.'],
            ['Pourquoi la protection des sources est-elle essentielle au journalisme ?', ['Sans elle, personne n’accepte de parler à un journaliste', 'Elle protège les journalistes des procès', 'Elle garantit leur rémunération', 'Elle accélère la publication'], 0, 'Elle est reconnue par la loi française depuis 2010.'],
            ['La liberté d’information est une liberté absolue.', ['Vrai', 'Faux'], 1, 'Diffamation, incitation à la haine, vie privée et secret de la défense la bornent.'],
            ['Qui doit décider des limites à la liberté d’information ?', ['Le juge, et non l’administration', 'Le gouvernement', 'Les rédactions elles-mêmes', 'Une commission de censure'], 0, 'Ces limites sont exactement celles qu’un pouvoir invoque pour restreindre.'],
            ['Qu’est-ce qu’une procédure-bâillon ?', ['Une action en justice destinée à épuiser un journaliste plutôt qu’à obtenir gain de cause', 'Une saisie de journaux', 'Une amende administrative', 'Une interdiction de publication'], 0, 'Elle vise l’investigation par l’usure financière et morale.'],
            ['La liberté de l’information se mesure au contenu des textes de loi.', ['Vrai', 'Faux'], 1, 'Elle se mesure à ce qu’il est effectivement possible de publier.'],
          ],
        },
        {
          titre: 'Liberté ou contrôle de l’information : l’information au XXe siècle entre contrôle étatique et liberté',
          axe: 'S’informer : un regard critique sur les sources et les moyens de communication',
          lecon: {
            titre: 'Propagande, censure et contre-information',
            cours: `Le XXe siècle est celui des médias de masse — et donc celui de leur **captation** par les États.

## La propagande de guerre
Dès **1914-1918**, les États organisent le contrôle de l’information : censure préalable, bureaux de presse, images officielles. Le **« bourrage de crâne »** — minimiser les pertes, ridiculiser l’ennemi, promettre la victoire prochaine — nourrit une défiance durable des combattants envers la presse.

## Les régimes totalitaires
Le contrôle y devient **total** :
- ministère de la Propagande, sous Goebbels, qui coordonne presse, radio, cinéma et affiche ;
- **monopole** de l’information et suppression de toute publication indépendante ;
- **culte du chef**, mise en scène des masses, esthétique du régime ;
- **réécriture** du passé : photographies retouchées d’où disparaissent les personnages tombés en disgrâce, manuels réécrits.

> Orwell en tire dans *1984* la formule la plus juste : contrôler le passé, c’est contrôler l’avenir. La propagande totalitaire ne se contente pas de mentir sur le présent — elle refait ce qui a eu lieu.

## En France sous l’Occupation
La presse autorisée est contrôlée par Vichy et l’occupant ; Radio-Paris est allemande. En face, la **presse clandestine** — *Combat*, *Libération*, *Défense de la France* — imprime dans des conditions périlleuses, et **Radio Londres** diffuse depuis l’extérieur. À la Libération, les journaux compromis sont interdits et leurs biens transférés à des titres issus de la Résistance.

## La guerre froide
L’information devient un **champ de bataille** : radios internationales émettant par-delà le rideau de fer, brouillage systématique par les régimes de l’Est, samizdats recopiés à la main, dissidents dont les textes circulent clandestinement.

## Le contre-pouvoir journalistique
Deux affaires établissent le journalisme d’investigation comme contre-pouvoir : les **Pentagon Papers** (1971), documents classifiés sur la guerre du Vietnam publiés malgré l’opposition du gouvernement, et le **Watergate** (1972-1974), dont l’enquête du *Washington Post* mène à la démission de Nixon.

## Aujourd’hui
Les formes ont changé, les mécanismes demeurent : censure directe dans certains pays, contrôle par la propriété des médias, campagnes coordonnées de désinformation, surveillance. Le jalon demande de reconnaître ces mécanismes plutôt que de les croire réservés au passé.`,
          },
          questions: [
            ['Qu’appelle-t-on le « bourrage de crâne » pendant la Grande Guerre ?', ['La propagande minimisant les pertes et promettant une victoire proche', 'La censure des lettres de soldats', 'Un entraînement militaire', 'Une méthode d’interrogatoire'], 0, 'Il a nourri une défiance durable des combattants envers la presse.'],
            ['Quel trait caractérise la propagande totalitaire ?', ['La réécriture du passé, jusqu’à la retouche des photographies', 'La liberté de la presse locale', 'Le pluralisme des sources', 'L’absence de radio'], 0, 'Contrôler le passé, c’est contrôler l’avenir, écrit Orwell.'],
            ['Quels journaux clandestins paraissent sous l’Occupation ?', ['Combat, Libération, Défense de la France', 'Le Figaro et Le Monde', 'La Gazette et Le Mercure', 'L’Aurore et Le Petit Journal'], 0, 'Radio Londres diffuse en parallèle depuis l’extérieur.'],
            ['Qu’était Radio-Paris sous l’Occupation ?', ['Une radio contrôlée par l’occupant allemand', 'Une radio de la Résistance', 'Une radio britannique', 'Une radio libre'], 0, 'D’où la chanson « Radio-Paris ment ».'],
            ['Que sont les Pentagon Papers ?', ['Des documents classifiés sur la guerre du Vietnam publiés en 1971', 'Les archives du Watergate', 'Un rapport de l’ONU', 'Un plan militaire soviétique'], 0, 'Leur publication a été tentée d’être empêchée par le gouvernement.'],
            ['Le Watergate a conduit à la démission du président Nixon.', ['Vrai', 'Faux'], 0, 'L’enquête du Washington Post a établi le journalisme comme contre-pouvoir.'],
            ['Comment les régimes de l’Est répondaient-ils aux radios occidentales ?', ['Par le brouillage systématique des émissions', 'En les autorisant librement', 'En les diffusant à la télévision', 'En les traduisant'], 0, 'Les samizdats circulaient en parallèle, recopiés à la main.'],
            ['Les mécanismes de contrôle de l’information appartiennent au passé.', ['Vrai', 'Faux'], 1, 'Censure, contrôle par la propriété, désinformation coordonnée et surveillance persistent.'],
          ],
        },

        // ---- Thème 5 : États et religions -------------------------------------
        {
          titre: 'Le politique et le religieux au Moyen Âge : les liens historiques entre le pouvoir et la religion',
          axe: 'Analyser les relations entre États et religions',
          lecon: {
            titre: 'Deux glaives, un royaume',
            cours: `Dans l’Occident médiéval, le pouvoir politique et le pouvoir religieux sont **distincts** mais **inséparables**. Toute la période se joue dans leur articulation — et dans leurs conflits.

## La théorie
La doctrine dite **des deux glaives** distingue le pouvoir **spirituel**, confié à l’Église, et le pouvoir **temporel**, confié aux princes. Reste à savoir lequel prime : les papes soutiendront que le spirituel commande, les empereurs qu’ils tiennent leur pouvoir directement de Dieu.

## Le sacre
Le roi de France est **sacré à Reims**, oint de l’huile de la Sainte Ampoule. Le rite le fait **roi par la grâce de Dieu** : son pouvoir n’est plus seulement héréditaire ou militaire, il est consacré. Le sacre fonde aussi les devoirs du roi — protéger l’Église, rendre la justice, défendre les faibles.

Le sacre de **Charlemagne** en 800 par le pape Léon III inaugure cette dépendance mutuelle : l’empereur tient sa légitimité du pape, mais le pape tient sa protection de l’empereur.

## La querelle des Investitures
Le conflit majeur, de 1075 à 1122 : qui nomme les évêques, le pape ou l’empereur ? L’enjeu est considérable, car les évêques sont aussi de grands seigneurs temporels. L’affrontement entre **Grégoire VII** et **Henri IV** aboutit à l’humiliation de Canossa, puis au **concordat de Worms** (1122), qui répartit les rôles : investiture spirituelle par l’Église, temporelle par l’empereur.

## L’Église dans la société
Elle encadre la vie entière : baptême, mariage, funérailles ; le calendrier et les fêtes ; le temps de la journée rythmé par les cloches ; l’enseignement, les universités, les hôpitaux, l’assistance aux pauvres. Elle dispose de sa propre **justice** et lève la **dîme**.

## La montée de l’État royal
À partir du XIIIe siècle, les rois de France affirment leur autonomie : le roi est « empereur en son royaume ». **Philippe le Bel** ose faire arrêter le pape Boniface VIII en 1303. La **Pragmatique Sanction de Bourges** (1438) puis le **concordat de Bologne** (1516) donnent au roi de France la nomination des évêques : c’est le **gallicanisme**, une Église catholique mais largement contrôlée par le pouvoir royal.

> Le jalon prépare tout le thème : la séparation moderne n’est pas un point de départ mais un **aboutissement**, arraché à des siècles d’imbrication.`,
          },
          questions: [
            ['Que distingue la doctrine des deux glaives ?', ['Le pouvoir spirituel de l’Église et le pouvoir temporel des princes', 'Le roi et l’empereur', 'La justice civile et la justice pénale', 'Le clergé régulier et le clergé séculier'], 0, 'Reste à savoir lequel prime : c’est l’enjeu de toute la période.'],
            ['Où le roi de France est-il sacré ?', ['À Reims', 'À Paris', 'À Saint-Denis', 'À Chartres'], 0, 'Oint de l’huile de la Sainte Ampoule, il devient roi par la grâce de Dieu.'],
            ['Quel est l’enjeu de la querelle des Investitures ?', ['Savoir qui nomme les évêques, le pape ou l’empereur', 'Le tracé des frontières de l’Empire', 'La langue de la liturgie', 'Le montant de la dîme'], 0, 'Les évêques sont aussi de grands seigneurs temporels.'],
            ['Quel texte met fin à la querelle des Investitures en 1122 ?', ['Le concordat de Worms', 'Le concordat de Bologne', 'La Pragmatique Sanction', 'L’édit de Nantes'], 0, 'Investiture spirituelle par l’Église, temporelle par l’empereur.'],
            ['Que donne le concordat de Bologne de 1516 au roi de France ?', ['La nomination des évêques', 'Le droit de lever la dîme', 'La direction des universités', 'Le pouvoir d’excommunier'], 0, 'C’est le fondement du gallicanisme.'],
            ['Le sacre de Charlemagne en 800 crée une dépendance à sens unique.', ['Vrai', 'Faux'], 1, 'Elle est mutuelle : l’empereur tient sa légitimité du pape, le pape sa protection de l’empereur.'],
            ['Quel roi de France fait arrêter le pape Boniface VIII en 1303 ?', ['Philippe le Bel', 'Saint Louis', 'Charles VII', 'François Ier'], 0, 'Le roi affirme être « empereur en son royaume ».'],
            ['L’Église médiévale disposait de sa propre justice.', ['Vrai', 'Faux'], 0, 'Elle levait aussi la dîme et encadrait enseignement, hôpitaux et assistance.'],
          ],
        },
        {
          titre: 'États et religions, une inégale sécularisation : l’exemple de la Turquie',
          axe: 'Analyser les relations entre États et religions',
          lecon: {
            titre: 'Une laïcité imposée par l’État, et contestée',
            cours: `La Turquie offre le cas d’une **sécularisation autoritaire**, décidée d’en haut en quelques années, puis remise en cause — ce qui en fait un contrepoint utile au modèle français.

## Le point de départ
L’Empire ottoman était un État **musulman** : le sultan portait aussi le titre de **calife**, chef spirituel des musulmans sunnites, et la loi religieuse régissait le statut personnel. Les communautés non musulmanes vivaient sous le régime du *millet*, avec une autonomie juridique et une position subordonnée.

## Les réformes kémalistes
Après la guerre d’indépendance, **Mustafa Kemal**, dit **Atatürk**, proclame la République en **1923** et engage une transformation d’ensemble :
- **1924** : abolition du **califat**, suppression du ministère des affaires religieuses traditionnel, fermeture des écoles coraniques ;
- adoption d’un **code civil** inspiré du code suisse : mariage civil, interdiction de la polygamie, égalité successorale ;
- remplacement de l’alphabet arabe par l’**alphabet latin** en 1928 — une rupture culturelle majeure, qui coupe d’un coup l’accès aux textes anciens ;
- calendrier grégorien, réforme vestimentaire, dissolution des confréries ;
- droit de vote et d’éligibilité des femmes en 1934, avant plusieurs pays européens ;
- **1937** : la **laïcité** est inscrite dans la Constitution.

> Le modèle kémaliste ne sépare pas l’État et la religion : il **contrôle** la religion par l’État. La Direction des affaires religieuses (Diyanet), créée en 1924, nomme les imams, rédige les prêches et gère les mosquées. C’est la différence décisive avec la laïcité française, et un devoir doit la formuler.

## L’armée, gardienne du régime
L’armée s’est longtemps considérée comme la garante de l’héritage kémaliste, intervenant à plusieurs reprises — 1960, 1971, 1980, et par un « coup d’État postmoderne » en 1997 — contre des gouvernements jugés trop religieux.

## Le tournant contemporain
Depuis 2002, l’AKP, parti conservateur d’inspiration islamique, gouverne durablement. On observe une place croissante du religieux dans l’espace public et l’enseignement, la levée de l’interdiction du foulard dans les institutions, la reconversion de **Sainte-Sophie** en mosquée en 2020, et un renforcement considérable du Diyanet. Après la tentative de coup d’État de 2016, le pouvoir de l’armée est fortement réduit.

## Ce que le jalon enseigne
La sécularisation n’est ni linéaire ni irréversible, et elle prend des formes très différentes : séparation, contrôle étatique du religieux, religion d’État, neutralité bienveillante. Comparer suppose de préciser **de quel modèle** on parle.`,
          },
          questions: [
            ['Quel titre religieux le sultan ottoman portait-il ?', ['Celui de calife', 'Celui d’imam', 'Celui de patriarche', 'Celui de mufti'], 0, 'Chef spirituel des musulmans sunnites, en plus du pouvoir temporel.'],
            ['En quelle année le califat est-il aboli en Turquie ?', ['1924', '1923', '1928', '1937'], 0, 'Un an après la proclamation de la République.'],
            ['De quel pays le code civil turc de 1926 est-il inspiré ?', ['La Suisse', 'La France', 'L’Allemagne', 'L’Italie'], 0, 'Mariage civil, interdiction de la polygamie, égalité successorale.'],
            ['Quelle réforme de 1928 constitue une rupture culturelle majeure ?', ['L’adoption de l’alphabet latin', 'L’instauration du calendrier grégorien', 'La réforme vestimentaire', 'La fermeture des confréries'], 0, 'Elle coupe d’un coup l’accès aux textes anciens.'],
            ['Le modèle kémaliste sépare-t-il l’État et la religion ?', ['Non, il contrôle la religion par l’État', 'Oui, comme en France', 'Non, il instaure une religion d’État', 'Oui, mais sans institution dédiée'], 0, 'Le Diyanet nomme les imams et rédige les prêches.'],
            ['Quand la laïcité est-elle inscrite dans la Constitution turque ?', ['En 1937', 'En 1923', 'En 1924', 'En 1945'], 0, 'Après plus d’une décennie de réformes.'],
            ['L’armée turque est longtemps intervenue au nom de l’héritage kémaliste.', ['Vrai', 'Faux'], 0, '1960, 1971, 1980 et 1997 : son pouvoir est fortement réduit après 2016.'],
            ['Que devient Sainte-Sophie en 2020 ?', ['Une mosquée', 'Un musée', 'Une église', 'Un site fermé au public'], 0, 'Symbole du tournant contemporain sur la place du religieux.'],
          ],
        },
        {
          titre: 'États et religions : l’exercice de la liberté de conscience et les enjeux géopolitiques',
          axe: 'Analyser les relations entre États et religions',
          lecon: {
            titre: 'Laïcité, liberté religieuse et conflits',
            cours: `La **liberté de conscience** est le droit de croire, de ne pas croire, de changer de conviction et de le manifester. Sa mise en œuvre distingue des modèles très différents.

## Les modèles de relation entre États et religions
- La **séparation** : la France depuis la loi de **1905**, qui pose que la République ne reconnaît, ne salarie ni ne subventionne aucun culte, tout en garantissant le libre exercice. Les États-Unis pratiquent une séparation d’un autre type, avec un premier amendement qui interdit toute religion d’État tout en laissant au religieux une forte visibilité publique.
- La **religion d’État** : le Royaume-Uni, où le souverain est gouverneur de l’Église anglicane ; le Danemark ; plusieurs États du Golfe.
- La **reconnaissance de cultes** : l’Allemagne, où les Églises perçoivent un impôt collecté par l’État ; le régime concordataire encore en vigueur en Alsace-Moselle.
- Le **contrôle étatique** du religieux : la Turquie kémaliste, la Chine.

> La laïcité française n’est ni l’effacement du religieux ni son hostilité : c’est la **neutralité de l’État** qui garantit la liberté de tous. La distinction à tenir est celle entre l’**agent public**, tenu à la neutralité dans l’exercice de ses fonctions, et l’**usager**, libre de manifester ses convictions dans l’espace public, sous les réserves de l’ordre public.

## Les textes qui protègent
L’article 18 de la Déclaration universelle de 1948 et l’article 9 de la Convention européenne des droits de l’homme garantissent la liberté de pensée, de conscience et de religion, y compris le droit d’en changer — point qui reste refusé dans plusieurs États.

## Les enjeux géopolitiques
Le religieux structure des conflits et des alliances :
- des **conflits** où l’appartenance religieuse recoupe des enjeux territoriaux et politiques — Proche-Orient, Balkans, Cachemire, Sahel ;
- des **minorités persécutées** sur plusieurs continents ;
- des **acteurs transnationaux** : le Saint-Siège, sujet de droit international ; l’Organisation de la coopération islamique ; des mouvements religieux mondialisés ;
- l’instrumentalisation du religieux comme **ressource identitaire** par des pouvoirs qui cherchent une légitimité.

## Le piège à éviter
Lire un conflit comme purement religieux est presque toujours une erreur d’analyse : la religion y est le plus souvent un **marqueur** d’identité mobilisé sur des enjeux de terre, de pouvoir, de ressources ou de mémoire. Le programme demande de démêler ces dimensions plutôt que de les confondre.`,
          },
          questions: [
            ['Que pose la loi française de 1905 ?', ['La République ne reconnaît, ne salarie ni ne subventionne aucun culte', 'La religion est interdite dans l’espace public', 'L’État nomme les ministres du culte', 'Une religion d’État est instituée'], 0, 'Elle garantit en même temps le libre exercice des cultes.'],
            ['Quel pays perçoit un impôt ecclésiastique collecté par l’État ?', ['L’Allemagne', 'La France', 'Les États-Unis', 'La Turquie'], 0, 'C’est un régime de reconnaissance des cultes.'],
            ['Quelle distinction est centrale dans la laïcité française ?', ['Entre l’agent public, tenu à la neutralité, et l’usager, libre de manifester ses convictions', 'Entre croyants et non-croyants', 'Entre cultes reconnus et non reconnus', 'Entre lieux de culte publics et privés'], 0, 'La neutralité pèse sur l’État, non sur les personnes.'],
            ['Quel régime particulier subsiste en Alsace-Moselle ?', ['Le régime concordataire', 'La séparation stricte', 'La religion d’État', 'Le contrôle étatique du culte'], 0, 'Héritage de la période où ces territoires étaient allemands.'],
            ['La liberté de changer de religion est garantie partout dans le monde.', ['Vrai', 'Faux'], 1, 'Protégée par les textes internationaux, elle reste refusée dans plusieurs États.'],
            ['Le Saint-Siège est un sujet de droit international.', ['Vrai', 'Faux'], 0, 'C’est l’un des acteurs religieux transnationaux du système international.'],
            ['Comment analyser un conflit où l’appartenance religieuse est mobilisée ?', ['En démêlant les enjeux de terre, de pouvoir et de mémoire derrière le marqueur religieux', 'En le lisant comme purement religieux', 'En ignorant la dimension religieuse', 'En le rapportant à un seul acteur'], 0, 'Lire un conflit comme purement religieux est presque toujours une erreur d’analyse.'],
            ['Quel texte international garantit la liberté de pensée, de conscience et de religion en Europe ?', ['L’article 9 de la Convention européenne des droits de l’homme', 'L’article 11 de la Déclaration de 1789', 'La loi de 1905', 'Le traité de Lisbonne'], 0, 'L’article 18 de la Déclaration universelle de 1948 le fait au niveau mondial.'],
          ],
        },
      ],
    },
  ],
}
