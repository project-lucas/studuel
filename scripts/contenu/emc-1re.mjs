// EMC — Première : « Cohésion et diversité dans une société démocratique »,
// soit les 12 fiches de ses DEUX thèmes.
//
// LE TEXTE QUI FAIT FOI. Arrêté du 3 juin 2024, **BO n° 24 du 13 juin 2024** —
// le programme d'EMC du CP à la terminale, applicable à TOUS les niveaux à la
// rentrée 2026-2027, celle que vivent les élèves aujourd'hui. Il donne à chaque
// année du lycée une thématique : la seconde étudie la liberté, la PREMIÈRE la
// société, la terminale la démocratie. Le libellé de l'année de première est
// « Cohésion et diversité dans une société démocratique », et il compte deux
// thèmes de 9 heures chacun en voies générale et technologique :
//   1. Les valeurs et les principes de la République à l'épreuve de la cohésion
//      sociale — notions : solidarité et fraternité, inégalités économiques et
//      sociales, égalité femmes-hommes, discriminations et société inclusive,
//      racisme/antisémitisme/antitsiganisme/xénophobie/haine anti-LGBT,
//      pluralisme (laïcité) ;
//   2. La République et la Nation — notions : indivisibilité de la République et
//      décentralisation, nationalité et citoyenneté (questions mémorielles,
//      patriotisme constitutionnel), défense et sécurité nationale.
// Les 12 fiches ci-dessous suivent cette liste dans l'ordre du texte ; le
// découpage 7 + 5 n'ajoute rien au programme, il sépare seulement en deux fiches
// révisables ce que le BO écrit en deux contenus d'enseignement sous une même
// notion (les inégalités sous « solidarité et fraternité », le handicap sous
// « discriminations et société inclusive »).
//
// LE DÉFAUT QUE ÇA CORRIGE. Sondé le 21/08/2026 (node
// _ASSOCIE/sonde-chapitres.mjs 1re emc) : l'EMC de Première n'a que les TROIS
// fiches du socle lycée de la migration 216 — « La liberté d'expression et ses
// limites », « Démocratie et État de droit », « Enjeux du numérique et de
// l'information » —, écrites pour la 2de, la 1re et la Tle à la fois. Aucune ne
// relève du programme de Première : la première et la troisième sont, dans le
// programme de 2024, la matière de la SECONDE (« Liberté et responsabilité :
// l'exemple de l'information »). Un élève qui révisait la fraternité, la loi de
// 1905, la loi Pleven, la décentralisation, le droit du sol ou la sécurité
// nationale ne trouvait RIEN.
//
// LES TROIS FICHES DU SOCLE S'EN VONT, AU SEUL NIVEAU 1re — c'est la décision
// prise en 250 pour la Terminale, et pour la même raison : trois lignes hors
// programme en TÊTE de liste rouvrent le doute sur les douze autres. La 2de les
// GARDE : elle n'a pas encore son programme propre, et rien ne viendrait les
// remplacer.
//
// ⚠️ Le slug reste `emc` et TROIS modules le portent désormais (`emc.mjs` → 216,
// `emc-tle.mjs` → 230, celui-ci → 277) : ne JAMAIS générer avec `--slugs emc`,
// qui les fusionnerait et réécrirait deux migrations déjà exécutées. Toujours
// `--modules emc-1re`.
//
// ⚠️ LA 216 EST REJOUABLE : la recoller un jour ferait revenir les trois fiches
// au niveau 1re. C'est le prix de l'idempotence — 216 ne peut pas être modifiée.

export default {
  slug: 'emc',
  nom: 'EMC',

  titreMigration: 'EMC 1re — « COHÉSION ET DIVERSITÉ DANS UNE SOCIÉTÉ DÉMOCRATIQUE »',

  motif: `LE DÉFAUT (sondé le 21/08/2026, node _ASSOCIE/sonde-chapitres.mjs 1re emc) :
l'EMC de Première n'avait que les 3 fiches du socle lycée de la migration 216 —
« La liberté d'expression et ses limites », « Démocratie et État de droit »,
« Enjeux du numérique et de l'information » —, écrites pour la 2de, la 1re et la
Tle à la fois. Le programme propre à la Première n'existait nulle part : ni la
fraternité, ni la loi de 1905, ni la loi Pleven, ni la décentralisation, ni le
droit du sol, ni la sécurité nationale.
LE TEXTE QUI FAIT FOI : le programme d'EMC du BO n° 24 du 13 juin 2024,
applicable à tous les niveaux à la rentrée 2026-2027. L'année de Première y a
pour thématique « Cohésion et diversité dans une société démocratique » et pour
chapitres ses deux thèmes de 9 heures : « Les valeurs et les principes de la
République à l'épreuve de la cohésion sociale » et « La République et la
Nation ». Cette migration installe leurs 12 fiches, aux positions 1 à 12.
LES 3 FICHES DU SOCLE PARTENT, AU SEUL NIVEAU 1re — décision prise en 250 pour
la Terminale, pour la même raison : trois lignes hors programme en tête de liste
rouvrent le doute sur les douze autres. Deux d'entre elles relèvent d'ailleurs,
dans le programme de 2024, de la SECONDE (« Liberté et responsabilité :
l'exemple de l'information »). La 2de les garde : elle n'a pas encore son
programme propre, et rien ne viendrait les remplacer.
⚠️ LA 216 EST REJOUABLE : la recoller ferait revenir les 3 fiches au niveau 1re.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme, et l'INSERT l'écrit pour les 12 fiches. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS, comme dans les migrations 243 à 276 — la 234 n'a jamais été
exécutée telle quelle. Sans cette reprise, la migration échouerait sur « column
chapters.theme does not exist », les 3 anciennes fiches déjà supprimées et les 12
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
      raison: `Les 3 fiches du socle lycée partent, au niveau 1re SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — même choix qu'en anglais (266), en
espagnol (267) et en allemand (276). La 250 avait supprimé les mêmes fiches par
leurs titres exacts au niveau Tle, en prenant soin de l'apostrophe typographique ;
deux de ces trois titres en portent une, et un DELETE qui se tromperait
d'apostrophe ne trouverait rien EN SILENCE. Le critère « pas de chapitre de
programme » vise exactement les trois lignes voulues : elles datent de la 216,
bien avant la colonne theme, tandis que les 12 fiches neuves en portent un dès
l'INSERT — le ménage tourne AVANT les insertions et ne peut donc jamais mordre
sur elles, ni au premier passage ni au rejeu.
Le filtre level = '1re' est indispensable : ces mêmes fiches sont la seule chose
que la 2de possède en EMC. Sans la borne, le ménage la viderait sans rien mettre
à la place. Le collège, qui a ses propres chapitres dans la 216, n'est pas
concerné par le critère mais l'est par la borne.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins, sans leçon mais toujours rattachés
à « EMC / 1re » par subject + grade_level, donc toujours tirables par le moteur
de questions), puis les chapitres, dont les leçons partent en cascade.`,
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
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level = '1re'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      // Les 3 fiches du socle viennent d'être supprimées par le ménage : la
      // numérotation repart de 1, comme la 250 l'a fait en Terminale.
      chapitres: [
        // ===== Thème 1 — Les valeurs et les principes de la République à
        // ===== l'épreuve de la cohésion sociale (7 fiches) =================
        {
          titre: 'Solidarité et fraternité',
          axe: 'Les valeurs et les principes de la République à l’épreuve de la cohésion sociale',
          lecon: {
            titre: 'Le troisième mot de la devise',
            cours: `« Liberté, Égalité, Fraternité » : le troisième terme est longtemps resté le moins juridique des trois. Il ne l'est plus.

## Un projet social inscrit dans les textes
L'**article 1er de la Constitution** de 1958 dispose que la France est une République « indivisible, **laïque**, **démocratique** et **sociale** ».

> Le mot *sociale* engage : la Nation porte un projet qui suppose à la fois de **lutter contre les inégalités** et de **tisser des liens** entre citoyens.

## Fraternité et solidarité
| Le mot | Ce qu'il est | Peut-on l'exiger |
| **Fraternité** | Une **valeur** : le lien moral entre membres d'une même communauté politique | **Non**, on ne l'impose pas |
| **Solidarité** | Sa traduction **organisée** : impôts, cotisations, prestations, services publics | **Oui** |

## Assurance ou assistance
La protection sociale, bâtie à partir de **1945**, combine deux logiques.

| La logique | Son principe | Ses exemples |
| **Assurance** | On **cotise**, on est couvert | Chômage, retraite, maladie |
| **Assistance** | On reçoit **sans avoir cotisé**, parce qu'on en a besoin | RSA, allocations, fonds sociaux des établissements |

S'y ajoutent des gestes **volontaires** — don du sang, dons aux associations, bénévolat — qui ne remplacent pas l'impôt mais complètent ce qu'il finance.

## La fraternité devient un principe constitutionnel
| L'élément | Le détail |
| La décision | Conseil constitutionnel, **6 juillet 2018** |
| Ce qu'elle reconnaît | Au principe de fraternité une **valeur constitutionnelle** |
| Ce qu'elle en tire | La « liberté d'aider autrui, dans un but humanitaire, sans considération de la régularité de son séjour » |
| Son effet | Le « délit de solidarité » est limité : l'aide au séjour désintéressée ne peut plus être punie |

> À retenir pour une copie : la fraternité n'est plus seulement un mot sur un fronton, c'est une norme dont un juge peut se servir pour écarter une loi.`,
          },
          questions: [
            ['Comment l’article 1er de la Constitution qualifie-t-il la République ?', ['Indivisible, laïque, démocratique et sociale', 'Libre, égalitaire et fraternelle', 'Unitaire, laïque et décentralisée', 'Souveraine, sociale et européenne'], 0, 'Le mot « sociale » engage la Nation dans un projet de justice sociale.'],
            ['Quelle décision reconnait la valeur constitutionnelle de la fraternité ?', ['Conseil constitutionnel, 6 juillet 2018', 'Conseil d’État, 26 août 2016', 'Cour de cassation, 1972', 'Conseil constitutionnel, 1971'], 0, 'Elle en tire la liberté d’aider autrui dans un but humanitaire.'],
            ['Quelle est la différence entre une logique d’assurance et une logique d’assistance ?', ['L’assurance suppose d’avoir cotisé, l’assistance non', 'L’assistance est privée, l’assurance publique', 'L’assurance est facultative, l’assistance obligatoire', 'Il n’y en a aucune'], 0, 'Chômage et retraite relèvent de l’assurance ; le RSA de l’assistance.'],
            ['En quelle année la Sécurité sociale est-elle créée ?', ['1945', '1905', '1958', '1988'], 0, 'Elle est le socle de la solidarité nationale organisée.'],
            ['La fraternité peut être imposée par la loi comme l’égalité.', ['Vrai', 'Faux'], 1, 'C’est une valeur ; c’est la solidarité, sa traduction organisée, que le droit peut exiger.'],
            ['Qu’a permis concrètement la décision de 2018 sur la fraternité ?', ['Limiter le « délit de solidarité » pour l’aide désintéressée', 'Créer le RSA', 'Rendre le don du sang obligatoire', 'Supprimer l’impôt sur le revenu'], 0, 'L’aide humanitaire au séjour ne peut plus être punie comme telle.'],
            ['Lequel de ces dispositifs relève d’une solidarité volontaire ?', ['Le don du sang', 'La cotisation retraite', 'La CSG', 'Le RSA'], 0, 'Il complète, sans les remplacer, les mécanismes obligatoires.'],
            ['Les fonds sociaux des établissements scolaires relèvent de la solidarité.', ['Vrai', 'Faux'], 0, 'Ils aident les familles à faire face aux frais de scolarité : c’est de l’assistance.'],
          ],
        },
        {
          titre: 'Lutter contre les inégalités économiques et sociales',
          axe: 'Les valeurs et les principes de la République à l’épreuve de la cohésion sociale',
          lecon: {
            titre: 'Quand l’écart menace le lien',
            cours: `Le programme pose la question sans détour : les inégalités économiques et sociales peuvent présenter un danger pour la cohésion sociale et la démocratie. Pourquoi ?

## Mesurer avant de juger
| La notion | Sa définition | L'ordre de grandeur en France |
| Le **seuil de pauvreté** monétaire | **60 %** du niveau de vie médian | Environ **9 millions** de personnes en dessous, près de **15 %** |
| Le **niveau de vie médian** | Il partage la population en deux moitiés | Ce n'est **pas** la moyenne, que quelques très hauts revenus tireraient vers le haut |
| La **pauvreté en conditions de vie** | Logement, santé, mobilité, accès au numérique | Elle ne se réduit pas au revenu |

## Pourquoi c'est un problème politique
| Ce qui est fragilisé | Comment |
| L'**égalité des chances** | À l'école, l'origine sociale pèse fortement sur les résultats |
| La **confiance** | Dans les institutions et dans les autres |
| La **participation** | L'abstention est nettement plus élevée dans les milieux populaires, ce qui déforme la représentation |

## Ce que fait l'État
| L'outil | Son effet |
| La **redistribution** — impôts progressifs, prestations | Elle réduit d'environ un **tiers** les écarts de revenus avant transferts |
| Les **minima sociaux** et la **prime d'activité** | Ils soutiennent les bas revenus |
| La **politique de la ville** et l'**ANCT** (2020) | Elles agissent sur les inégalités **territoriales** : quartiers prioritaires, ruralité, services publics |
| La **loi SRU** (2000) | Un quota de **logements sociaux** — 25 % en zone tendue : un outil de **mixité sociale** |

> Nuance attendue dans une copie : réduire les inégalités n'est pas supprimer les différences. La République garantit l'**égalité des droits**, et cherche à corriger les inégalités qui empêchent d'en user réellement.`,
          },
          questions: [
            ['À quel seuil la pauvreté monétaire est-elle mesurée en France ?', ['60 % du niveau de vie médian', '50 % du revenu moyen', 'Le montant du RSA', 'Le SMIC net'], 0, 'C’est la définition retenue au niveau européen.'],
            ['Que crée l’État en 2020 pour lutter contre les inégalités territoriales ?', ['L’Agence nationale de la cohésion des territoires', 'Le Défenseur des droits', 'La DILCRAH', 'Le Conseil économique et social'], 0, 'L’ANCT appuie les collectivités : quartiers prioritaires, ruralité, services publics.'],
            ['Que vise la loi SRU de 2000 ?', ['Imposer un quota de logements sociaux aux communes', 'Créer le RSA', 'Fixer le SMIC', 'Interdire les discriminations à l’embauche'], 0, 'Jusqu’à 25 % dans les zones tendues : un levier de mixité sociale.'],
            ['Le niveau de vie médian et le revenu moyen désignent la même chose.', ['Vrai', 'Faux'], 1, 'Le médian partage la population en deux moitiés ; la moyenne est tirée par les hauts revenus.'],
            ['Quel effet la redistribution a-t-elle sur les écarts de revenus ?', ['Elle les réduit d’environ un tiers', 'Elle les supprime', 'Elle les augmente', 'Elle est sans effet mesurable'], 0, 'Impôts progressifs et prestations sociales agissent ensemble.'],
            ['Pourquoi les inégalités menacent-elles la démocratie ?', ['Elles minent la confiance et creusent l’écart de participation', 'Elles empêchent d’organiser des élections', 'Elles suppriment le droit de vote', 'Elles rendent la Constitution caduque'], 0, 'L’abstention est plus forte dans les milieux populaires, ce qui déforme la représentation.'],
            ['La pauvreté se mesure uniquement en euros.', ['Vrai', 'Faux'], 1, 'La pauvreté en conditions de vie prend en compte logement, santé, mobilité, numérique.'],
            ['Qu’est-ce que la prime d’activité ?', ['Un complément de revenu pour les travailleurs modestes', 'Une prime versée aux entreprises', 'Une aide au logement', 'Une allocation chômage'], 0, 'Elle vise à ce que le travail reste plus avantageux que l’inactivité.'],
          ],
        },
        {
          titre: 'L’égalité entre les femmes et les hommes',
          axe: 'Les valeurs et les principes de la République à l’épreuve de la cohésion sociale',
          lecon: {
            titre: 'Un principe, des lois, et une réalité qui résiste',
            cours: `L'égalité femmes-hommes montre comment un principe transforme lentement une société — et où il se heurte encore à des résistances.

## Une conquête juridique par étapes
| La date | L'avancée |
| **1944** | Droit de vote et d'éligibilité des femmes ; premier vote en 1945 |
| **1965** | Les femmes mariées peuvent travailler et ouvrir un compte sans l'autorisation de leur mari |
| **1972** | Égalité de rémunération « à travail de valeur égale » |
| **1975** | Loi Veil sur l'**IVG**, définitive en 1979 |
| **1983** | Loi Roudy sur l'égalité professionnelle |
| **1999-2000** | Révision constitutionnelle et lois sur la **parité** en politique |
| **2019** | **Index de l'égalité professionnelle**, obligatoire dès 50 salariés |
| **4 mars 2024** | La **liberté garantie** de recourir à l'IVG entre dans la **Constitution** |

## Ce que disent les chiffres
| L'écart de revenu salarial | Sa valeur |
| Tous temps de travail confondus | Environ **20 %** |
| À poste et temps de travail comparables | Environ **4 %** |

| La cause de l'écart | Ce qu'elle recouvre |
| Le **temps partiel** | Très majoritairement féminin |
| La **ségrégation professionnelle** | Des métiers très féminins, souvent moins rémunérés |
| Le **plafond de verre** | L'accès aux postes de direction |

## Les causes, et l'école
Stéréotypes et préjugés se forment tôt : la **représentation genrée des formations** oriente les choix bien avant le marché du travail.

> D'où les actions sur l'orientation, dans les filières scientifiques et techniques notamment.

## Violences sexistes et sexuelles
| Le repère | Ce qu'il est |
| Le **3919** | Écoute, gratuit, 24 h/24 |
| La **Convention d'Istanbul** | 2011, ratifiée par la France en 2014 |
| Les dispositifs de protection | Ordonnance de protection, bracelet anti-rapprochement |

> Point de méthode : distinguer l'**égalité en droit**, acquise depuis longtemps, de l'**égalité réelle**, encore inachevée. C'est l'écart entre les deux que le programme demande d'examiner.`,
          },
          questions: [
            ['En quelle année les femmes obtiennent-elles le droit de vote en France ?', ['1944', '1936', '1946', '1965'], 0, 'Ordonnance de 1944 ; premier vote effectif en 1945.'],
            ['Que permet la loi de 1965 aux femmes mariées ?', ['Travailler et ouvrir un compte sans l’autorisation du mari', 'Voter aux élections locales', 'Divorcer par consentement mutuel', 'Accéder à la fonction publique'], 0, 'Une étape décisive de l’autonomie juridique.'],
            ['Qu’est-ce qui a été inscrit dans la Constitution le 4 mars 2024 ?', ['La liberté garantie de recourir à l’IVG', 'La parité dans les entreprises', 'L’égalité salariale', 'Le congé parental partagé'], 0, 'La révision complète l’article 34 de la Constitution.'],
            ['À quoi sert l’index de l’égalité professionnelle (2019) ?', ['Mesurer et publier les écarts femmes-hommes en entreprise', 'Fixer un quota de femmes cadres', 'Calculer les retraites', 'Sanctionner le harcèlement'], 0, 'Il est obligatoire dans les entreprises d’au moins 50 salariés.'],
            ['À poste et temps de travail comparables, l’écart de rémunération est nul.', ['Vrai', 'Faux'], 1, 'Il subsiste de l’ordre de 4 %, contre environ 20 % tous temps de travail confondus.'],
            ['Quel numéro national écoute les femmes victimes de violences ?', ['Le 3919', 'Le 3020', 'Le 119', 'Le 17'], 0, 'Gratuit et disponible 24 h/24.'],
            ['Qu’appelle-t-on le « plafond de verre » ?', ['Les obstacles invisibles à l’accès aux postes de direction', 'L’écart de salaire à l’embauche', 'Le temps partiel imposé', 'La ségrégation des filières scolaires'], 0, 'Il désigne ce qui bloque la progression sans être écrit nulle part.'],
            ['La Convention d’Istanbul porte sur les violences faites aux femmes.', ['Vrai', 'Faux'], 0, 'Adoptée en 2011 par le Conseil de l’Europe, ratifiée par la France en 2014.'],
          ],
        },
        {
          titre: 'Les discriminations : les définir, les mesurer, les combattre',
          axe: 'Les valeurs et les principes de la République à l’épreuve de la cohésion sociale',
          lecon: {
            titre: 'Ce que le droit appelle une discrimination',
            cours: `Une discrimination n'est pas un simple sentiment d'injustice : c'est une notion juridique, définie et sanctionnée.

## La définition du Code pénal
L'**article 225-1** définit la discrimination comme toute distinction entre personnes **à raison d'un critère prohibé**. Le droit français en compte plus de **vingt-cinq** : origine, sexe, situation de famille, apparence physique, état de santé, **handicap**, âge, opinions politiques, activités syndicales, appartenance vraie ou supposée à une ethnie ou une **religion**, **orientation sexuelle**, identité de genre, lieu de résidence…

| La condition | Ce qu'elle exige |
| Un **critère prohibé** | Parmi ceux que la loi énumère |
| Une **situation visée par la loi** | Refus d'embauche, licenciement, refus de fourniture d'un bien ou d'un service, refus de louer |

Les peines vont jusqu'à **3 ans d'emprisonnement et 45 000 € d'amende**.

## Directe ou indirecte
| Le type | Son mécanisme | Un exemple |
| **Directe** | Le critère est explicitement utilisé | « Nous ne prenons pas de femmes » |
| **Indirecte** | Une règle apparemment neutre défavorise en fait un groupe | Un critère de taille pour un métier où elle n'est pas nécessaire |

## Ressenti et preuve
Les discriminations sont **ressenties** bien plus souvent qu'elles ne sont **prouvées** : la victime connaît rarement la vraie raison d'un refus.

| L'outil | Ce qu'il permet |
| Le **testing** | Comparer deux candidatures identiques ne différant que par le critère suspecté — admis comme mode de preuve |
| L'**aménagement de la charge de la preuve** | La victime présente des éléments de fait ; c'est ensuite au défendeur de prouver que sa décision était justifiée |

## Qui agit
| L'acteur | Son rôle |
| Le **Défenseur des droits** | Autorité constitutionnelle indépendante créée en 2011, saisissable gratuitement par toute personne |
| La **DILCRAH** | Elle coordonne l'action contre le racisme, l'antisémitisme et la haine anti-LGBT |
| La **CNCDH** | Elle remet chaque année un rapport sur le racisme |
| Les **associations habilitées** | Elles peuvent se porter partie civile |

> Attention au sens du mot dans une copie : distinguer devient **discriminer** seulement quand la distinction repose sur un critère interdit, dans une situation visée par la loi.`,
          },
          questions: [
            ['Quel article du Code pénal définit la discrimination ?', ['L’article 225-1', 'L’article 1er', 'L’article 434-3', 'L’article 121-1'], 0, 'Il énumère les critères prohibés, aujourd’hui plus de vingt-cinq.'],
            ['Quelle peine maximale encourt l’auteur d’une discrimination ?', ['3 ans de prison et 45 000 € d’amende', '1 an et 15 000 €', '5 ans et 75 000 €', 'Une simple amende'], 0, 'Les peines sont aggravées lorsque l’auteur est dépositaire de l’autorité publique.'],
            ['Qu’est-ce qu’une discrimination indirecte ?', ['Une règle neutre en apparence qui défavorise un groupe', 'Une discrimination commise par un tiers', 'Une discrimination non intentionnelle et donc légale', 'Une discrimination hors du travail'], 0, 'Elle est illicite au même titre que la discrimination directe.'],
            ['Quelle autorité indépendante peut être saisie gratuitement par une victime ?', ['Le Défenseur des droits', 'Le Conseil constitutionnel', 'La CNIL', 'Le Conseil d’État'], 0, 'Créé en 2011, il a rang d’autorité constitutionnelle.'],
            ['Le testing est admis comme mode de preuve d’une discrimination.', ['Vrai', 'Faux'], 0, 'Il compare deux candidatures identiques ne différant que par le critère suspecté.'],
            ['Que fait la DILCRAH ?', ['Elle coordonne la lutte contre le racisme, l’antisémitisme et la haine anti-LGBT', 'Elle juge les discriminations', 'Elle indemnise les victimes', 'Elle publie les statistiques ethniques'], 0, 'C’est une délégation interministérielle, rattachée au Premier ministre.'],
            ['Que change l’aménagement de la charge de la preuve ?', ['La victime présente des faits, au défendeur de se justifier', 'La victime doit tout prouver seule', 'Le juge enquête à la place des parties', 'La preuve n’est plus nécessaire'], 0, 'Sans lui, presque aucune discrimination ne serait établie.'],
            ['Toute distinction entre deux personnes est une discrimination.', ['Vrai', 'Faux'], 1, 'Il faut un critère prohibé ET une situation visée par la loi (emploi, logement, service…).'],
          ],
        },
        {
          titre: 'Vers une société inclusive : la question du handicap',
          axe: 'Les valeurs et les principes de la République à l’épreuve de la cohésion sociale',
          lecon: {
            titre: 'Adapter la société, pas seulement la personne',
            cours: `La société inclusive ajoute au principe d'égalité un impératif de solidarité : ce n'est plus à la personne de s'adapter seule, c'est à la société de lever les obstacles.

## Deux façons de voir le handicap
| L'approche | Où elle situe le handicap | Ce qu'elle demande |
| **Médicale** | Une déficience **individuelle** | La compenser |
| **Sociale**, retenue aujourd'hui | La **rencontre** entre une déficience et un environnement inadapté | Adapter l'environnement |

> Un fauteuil ne handicape pas dans un bâtiment accessible.

## La loi du 11 février 2005
« Pour l'égalité des droits et des chances, la participation et la citoyenneté des personnes handicapées ». Elle donne une définition légale du handicap et pose trois piliers.

| Le pilier | Son contenu |
| L'**accessibilité généralisée** | Bâtiments, transports, écoles, information |
| La **compensation** | Prestation de compensation du handicap, **AAH** |
| Le **guichet unique** | La **MDPH**, une par département |

## À l'école
Le principe : la scolarisation en **milieu ordinaire**, dans l'établissement le plus proche du domicile.

| L'outil | Ce qu'il apporte |
| Le **PPS** | Le projet personnalisé de scolarisation |
| Les **AESH** | Des accompagnants |
| Les **Ulis** | Des unités localisées pour l'inclusion scolaire |
| Les **aménagements d'examens** | Temps majoré, secrétaire, matériel adapté |

## Au travail
| L'obligation | Son contenu |
| Loi de **1987** | **6 %** de travailleurs handicapés dès 20 salariés ; à défaut, une contribution est due |
| Les **aménagements raisonnables** | L'employeur doit adapter le poste |

## Le cadre international
La **Convention de l'ONU relative aux droits des personnes handicapées** (2006), ratifiée par la France en **2010**, consacre le droit à la vie autonome et à l'inclusion.

> Le mot juste : on parle de **personne en situation de handicap** — la situation dépend autant de l'environnement que de la personne.`,
          },
          questions: [
            ['Quelle loi fonde l’égalité des droits et des chances des personnes handicapées ?', ['La loi du 11 février 2005', 'La loi du 30 juin 1975', 'La loi du 10 juillet 1987', 'La loi du 8 juillet 2013'], 0, 'Elle pose l’accessibilité, la compensation et la MDPH.'],
            ['Que désigne le sigle MDPH ?', ['Maison départementale des personnes handicapées', 'Ministère du handicap', 'Mission d’aide au handicap', 'Mutuelle des personnes handicapées'], 0, 'C’est le guichet unique départemental créé par la loi de 2005.'],
            ['Quel quota d’emploi de travailleurs handicapés la loi de 1987 impose-t-elle ?', ['6 % des effectifs', '3 % des effectifs', '10 % des effectifs', 'Aucun quota, une simple incitation'], 0, 'Il s’applique aux employeurs d’au moins 20 salariés.'],
            ['Selon l’approche sociale, d’où vient le handicap ?', ['De la rencontre entre une déficience et un environnement inadapté', 'De la seule déficience de la personne', 'D’un défaut de soins', 'D’un manque de volonté individuelle'], 0, 'C’est pourquoi on adapte l’environnement, et pas seulement la personne.'],
            ['La loi de 2005 pose le principe de la scolarisation en milieu ordinaire.', ['Vrai', 'Faux'], 0, 'Dans l’établissement le plus proche du domicile, avec un PPS et, si besoin, un AESH.'],
            ['Que fait un AESH ?', ['Il accompagne un élève en situation de handicap en classe', 'Il enseigne dans un établissement spécialisé', 'Il évalue le taux d’incapacité', 'Il verse les prestations'], 0, 'Accompagnant d’élèves en situation de handicap, il intervient en milieu ordinaire.'],
            ['Quel texte international la France a-t-elle ratifié en 2010 ?', ['La Convention de l’ONU relative aux droits des personnes handicapées', 'La Convention d’Istanbul', 'La Charte sociale européenne', 'La Convention de Genève'], 0, 'Adoptée en 2006, elle consacre le droit à la vie autonome et à l’inclusion.'],
            ['On dit « personne en situation de handicap » parce que la situation dépend aussi de l’environnement.', ['Vrai', 'Faux'], 0, 'La formule traduit l’approche sociale du handicap.'],
          ],
        },
        {
          titre: 'Racisme, antisémitisme, xénophobie et haine anti-LGBT',
          axe: 'Les valeurs et les principes de la République à l’épreuve de la cohésion sociale',
          lecon: {
            titre: 'Ce que la loi punit, et pourquoi',
            cours: `Racisme, antisémitisme, antitsiganisme, xénophobie et haine anti-LGBT ne sont pas des opinions comme les autres : la loi les punit.

## Trois lois repères
| La loi | Sa date | Ce qu'elle apporte |
| Loi **Pleven** | 1er juillet **1972** | Elle punit la **provocation à la haine**, la **diffamation** et l'**injure** à caractère raciste, et permet aux associations de se porter partie civile |
| Loi **Gayssot** | 13 juillet **1990** | Elle punit la **contestation de crimes contre l'humanité** et aggrave le dispositif de 1972 |
| Loi du 30 décembre **2004** | 2004 | Elle étend la répression aux motifs **sexistes**, **homophobes** et liés au **handicap** ; elle crée la HALDE, remplacée en 2011 par le Défenseur des droits |

> La loi de 1972 est le premier texte à sortir ces propos du champ de la simple liberté d'expression.

## L'aggravation par mobile
Quand une infraction — violences, dégradation, harcèlement — est commise **à raison** de l'origine, de la religion, de l'orientation sexuelle ou du handicap de la victime, le **mobile discriminatoire** est une **circonstance aggravante** : la peine encourue est alourdie.

## Où passe la limite
| Ce qui est permis | Ce qui est puni |
| **Critiquer une idée**, une doctrine, une religion | **Attaquer une personne ou un groupe** pour ce qu'il est |

L'**abus** de la liberté d'expression est défini par la loi de **1881** sur la presse, complétée par celles de 1972, 1990 et 2004.

## Signaler
| Le dispositif | Ce qu'il fait |
| La plateforme **PHAROS** | Elle recueille les signalements de contenus illicites en ligne |
| L'obligation des plateformes | Retirer promptement les contenus manifestement illicites qui leur sont notifiés |

> Piège fréquent : la loi ne punit pas le fait de **penser**, mais des **actes de langage publics** — provoquer, injurier, diffamer, nier un crime contre l'humanité.`,
          },
          questions: [
            ['Que punit la loi Pleven du 1er juillet 1972 ?', ['La provocation à la haine, la diffamation et l’injure racistes', 'Le négationnisme', 'Les discriminations à l’embauche', 'Les fausses nouvelles'], 0, 'Elle permet aussi aux associations de se porter partie civile.'],
            ['Que punit la loi Gayssot du 13 juillet 1990 ?', ['La contestation de crimes contre l’humanité', 'Le port de signes religieux à l’école', 'Le refus de louer un logement', 'L’injure homophobe'], 0, 'Le négationnisme est un délit depuis ce texte.'],
            ['Qu’ajoute la loi du 30 décembre 2004 ?', ['La répression des injures sexistes, homophobes et handiphobes', 'La création du Défenseur des droits', 'L’interdiction du testing', 'La liberté de la presse'], 0, 'Elle crée aussi la HALDE, remplacée en 2011 par le Défenseur des droits.'],
            ['Qu’est-ce qu’une circonstance aggravante à mobile discriminatoire ?', ['Une peine alourdie quand l’infraction vise la victime pour ce qu’elle est', 'Une infraction distincte du Code pénal', 'Une aggravation réservée aux récidivistes', 'Une amende doublée automatiquement'], 0, 'Elle s’applique aux violences, dégradations ou harcèlements à motif raciste, homophobe, etc.'],
            ['La loi punit les opinions racistes gardées pour soi.', ['Vrai', 'Faux'], 1, 'Elle punit des actes de langage publics : provoquer, injurier, diffamer, nier.'],
            ['Quel texte fixe le cadre général des abus de la liberté d’expression ?', ['La loi du 29 juillet 1881 sur la liberté de la presse', 'La loi de 1905', 'La loi de 2004 sur la laïcité', 'Le Code civil'], 0, 'Les lois de 1972, 1990 et 2004 la complètent.'],
            ['À quoi sert la plateforme PHAROS ?', ['Signaler des contenus illicites en ligne', 'Porter plainte pour discrimination à l’embauche', 'Saisir le Défenseur des droits', 'Demander le retrait d’un compte bancaire'], 0, 'Elle est gérée par la police et la gendarmerie.'],
            ['L’antitsiganisme désigne la haine visant les personnes roms et gens du voyage.', ['Vrai', 'Faux'], 0, 'Le programme le nomme explicitement, aux côtés du racisme et de l’antisémitisme.'],
          ],
        },
        {
          titre: 'Laïcité et pluralisme',
          axe: 'Les valeurs et les principes de la République à l’épreuve de la cohésion sociale',
          lecon: {
            titre: 'Ce que la laïcité rend possible',
            cours: `La laïcité n'est pas une opinion sur les religions : c'est un principe d'organisation qui rend possible la coexistence pacifique de convictions différentes.

## La loi du 9 décembre 1905
| L'article | Ce qu'il pose | Ce qu'il garantit |
| **Article 1er** | La République « assure la **liberté de conscience** » et « garantit le **libre exercice des cultes** » | Une **liberté** |
| **Article 2** | Elle « **ne reconnaît, ne salarie ni ne subventionne** aucun culte » | Une **neutralité** de l'État |

## Trois exigences indissociables
| L'exigence | Son contenu |
| La **liberté de conscience** | Croire, ne pas croire, changer de conviction |
| La **neutralité** | De l'État et de ses agents : un service public ne prend pas parti |
| L'**égalité** | Aucune conviction n'ouvre de privilège ni ne justifie de discrimination |

## L'arbitrage de l'État
Les **articles 27 et 28** de la loi de 1905 encadrent la **police des cultes** : sonneries, manifestations extérieures, emblèmes dans les lieux publics.

> Loin d'être hostile aux religions, cet arbitrage crée les conditions du **pluralisme** : personne n'impose sa croyance dans l'espace commun.

## À l'école
| La règle | À qui elle s'applique |
| La **loi du 15 mars 2004** interdit les signes ou tenues manifestant **ostensiblement** une appartenance religieuse | Aux **élèves** des écoles, collèges et lycées publics |
| La **stricte neutralité** | Aux **agents publics** |
| La **Charte de la laïcité à l'école** (2013) | Elle rassemble ces règles |

## Et en Europe
La **Cour européenne des droits de l'homme** admet des restrictions à la liberté de manifester sa religion lorsqu'elles sont prévues par la loi, poursuivent un but légitime et restent proportionnées.

> La laïcité française n'est donc pas le seul modèle possible en Europe.

> Distinction utile : la laïcité oblige l'**État** à la neutralité ; elle n'impose pas la neutralité aux **citoyens**, libres de manifester leurs convictions dans les limites de l'ordre public.`,
          },
          questions: [
            ['Que garantit l’article 1er de la loi de 1905 ?', ['La liberté de conscience et le libre exercice des cultes', 'La suppression des cultes', 'Le financement des cultes reconnus', 'La neutralité des citoyens'], 0, 'L’article 2 ajoute que la République ne reconnait ni ne subventionne aucun culte.'],
            ['Quelle loi interdit les signes religieux ostensibles aux élèves des écoles publiques ?', ['La loi du 15 mars 2004', 'La loi du 9 décembre 1905', 'La loi du 13 juillet 1990', 'La loi du 24 août 2021'], 0, 'Elle vise les écoles, collèges et lycées publics.'],
            ['À quoi servent les articles 27 et 28 de la loi de 1905 ?', ['Encadrer la police des cultes et les manifestations extérieures', 'Financer les lieux de culte', 'Fixer le calendrier des fêtes', 'Interdire les processions'], 0, 'Cet arbitrage crée les conditions du pluralisme.'],
            ['La laïcité impose la neutralité aux citoyens.', ['Vrai', 'Faux'], 1, 'Elle l’impose à l’État et à ses agents ; les citoyens restent libres, dans les limites de l’ordre public.'],
            ['Quelles sont les trois exigences de la laïcité ?', ['Liberté de conscience, neutralité de l’État, égalité', 'Tolérance, morale, tradition', 'Neutralité des citoyens, silence religieux, laïcisation', 'Séparation, subvention, contrôle'], 0, 'Elles sont indissociables : retirer l’une déforme les deux autres.'],
            ['Que dit la Cour européenne des droits de l’homme sur la liberté religieuse ?', ['Des restrictions sont possibles si elles sont légales et proportionnées', 'Elle est absolue et sans limite', 'Elle relève des seuls États', 'Elle interdit toute laïcité'], 0, 'Les États disposent d’une marge nationale d’appréciation.'],
            ['Quel document rassemble les règles de laïcité à l’école ?', ['La Charte de la laïcité à l’école (2013)', 'Le Code de l’éducation seul', 'La loi de 1905', 'Le règlement intérieur type'], 0, 'Elle est affichée dans les établissements et expliquée aux élèves.'],
            ['La laïcité est hostile aux religions.', ['Vrai', 'Faux'], 1, 'Elle garantit au contraire le libre exercice des cultes, en interdisant à l’État de prendre parti.'],
          ],
        },

        // ===== Thème 2 — La République et la Nation (5 fiches) =============
        {
          titre: 'Une République indivisible et décentralisée',
          axe: 'La République et la Nation',
          lecon: {
            titre: 'Une seule Nation, des territoires divers',
            cours: `L'article 1er de la Constitution tient ensemble deux affirmations qui pourraient sembler contradictoires : la République est indivisible, et son organisation est décentralisée.

## Ce que veut dire « indivisible »
| L'affirmation | Sa portée |
| Il n'existe qu'**un seul peuple français** | Le Conseil constitutionnel a censuré en **1991** la mention d'un « peuple corse, composante du peuple français » |
| La **loi est la même pour tous** | Partout sur le territoire |
| L'État conserve les fonctions **régaliennes** | Défense, justice, monnaie, police, diplomatie |
| Les collectivités n'ont **pas de pouvoir législatif** | Elles administrent, elles ne légifèrent pas |

## Ce que veut dire « décentralisée »
La décentralisation transfère des compétences à des collectivités dotées de la **personnalité juridique**, d'un **budget** et d'organes **élus**.

| Le principe | Son article | Son contenu |
| La **libre administration** | Article 72 | Les collectivités s'administrent librement par des conseils élus |
| La **subsidiarité** | Article 72 | La décision au niveau le plus adapté |

L'ajout de « décentralisée » à l'article 1er date de la révision de **2003**.

## Trois notions à ne pas confondre
| La notion | Qui exerce | Le pouvoir transféré |
| **Décentralisation** | Des collectivités **élues** — commune, département, région | Des compétences **administratives** |
| **Déconcentration** | Les représentants locaux de l'État, le **préfet** | Aucun : l'État garde ses compétences ; le préfet exerce le **contrôle de légalité** |
| **Fédéralisme** | Des entités fédérées | Un pouvoir **législatif** propre — ce n'est pas le cas en France |

## Qui fait quoi
| La collectivité | Ses compétences principales |
| **Commune** | École primaire, urbanisme, état civil, action sociale de proximité |
| **Département** | Collèges, action sociale (RSA, protection de l'enfance), routes départementales |
| **Région** | Lycées, formation professionnelle, transports régionaux, développement économique |

> Formule à retenir : la France est un **État unitaire décentralisé**, pas un État fédéral.`,
          },
          questions: [
            ['Quelle révision constitutionnelle inscrit que l’organisation de la République est décentralisée ?', ['Celle de 2003', 'Celle de 1958', 'Celle de 1982', 'Celle de 2008'], 0, 'La phrase est ajoutée à l’article 1er de la Constitution.'],
            ['Qu’a censuré le Conseil constitutionnel en 1991 ?', ['La mention d’un « peuple corse, composante du peuple français »', 'Le statut de la Nouvelle-Calédonie', 'La loi Defferre', 'La reconnaissance des langues régionales'], 0, 'Il n’existe qu’un seul peuple français : c’est l’indivisibilité.'],
            ['Quelle est la différence entre décentralisation et déconcentration ?', ['La première transfère à des élus locaux, la seconde à des agents de l’État', 'Elles sont synonymes', 'La première concerne l’outre-mer seulement', 'La seconde crée des collectivités'], 0, 'Le préfet, agent de l’État, incarne la déconcentration et exerce le contrôle de légalité.'],
            ['Quelle collectivité a la charge des lycées ?', ['La région', 'Le département', 'La commune', 'L’État'], 0, 'Le département a les collèges, la commune les écoles primaires.'],
            ['Les collectivités territoriales disposent d’un pouvoir législatif propre.', ['Vrai', 'Faux'], 1, 'Elles s’administrent librement mais ne votent pas la loi : la France est un État unitaire.'],
            ['Que garantit l’article 72 de la Constitution aux collectivités ?', ['La libre administration par des conseils élus', 'Le droit de faire des lois', 'L’indépendance financière totale', 'Le droit de sécession'], 0, 'La libre administration s’exerce dans les conditions prévues par la loi.'],
            ['Qui exerce le contrôle de légalité des actes des collectivités ?', ['Le préfet', 'Le maire', 'Le Conseil constitutionnel', 'Le président de région'], 0, 'Il peut déférer un acte illégal au tribunal administratif.'],
            ['Le principe de subsidiarité veut que la décision soit prise au niveau le plus adapté.', ['Vrai', 'Faux'], 0, 'Il est inscrit à l’article 72 depuis 2003.'],
          ],
        },
        {
          titre: 'La décentralisation depuis 1982 et la diversité des territoires',
          axe: 'La République et la Nation',
          lecon: {
            titre: 'Quarante ans de transferts, et l’outre-mer',
            cours: `Depuis 1982, la République a transféré aux collectivités une part croissante de ce que l'État faisait seul — sans jamais renoncer à l'unité de la Nation.

## Les grandes étapes
| La date | Le texte | Ce qu'il change |
| **2 mars 1982** | Loi **Defferre**, « acte I » | Le préfet perd la tutelle *a priori*, remplacée par le **contrôle de légalité** *a posteriori* ; la région devient une collectivité de plein exercice |
| **2003-2004** | « Acte II » | La décentralisation entre dans la **Constitution** : autonomie financière, référendum local, droit de pétition, expérimentation ; transferts des routes nationales et des personnels techniques |
| **2014** | Loi **MAPTAM** | Les métropoles |
| **2015** | Loi **NOTRe** | Compétences clarifiées ; les régions passent de 22 à **13** en métropole |

## L'outre-mer : une unité qui admet des statuts différents
| L'article | Les territoires | Leur régime |
| **73** | Guadeloupe, Martinique, Guyane, La Réunion, Mayotte | Les lois de la République, avec des **adaptations** possibles |
| **74** | Polynésie française, Saint-Barthélemy, Saint-Martin, Saint-Pierre-et-Miquelon, Wallis-et-Futuna | Un **statut particulier** par loi organique, avec une part d'autonomie |
| Titre **XIII** | Nouvelle-Calédonie | Accord de Nouméa (1998) : citoyenneté calédonienne, « lois du pays », transferts de compétences |

## Les langues régionales
| L'article | Ce qu'il dispose |
| **Article 2** | La langue de la République est le **français** |
| **Article 75-1**, ajouté en **2008** | « Les langues régionales appartiennent au **patrimoine de la France** » |

> Reconnaître une diversité culturelle n'entame pas l'unité juridique : c'est exactement l'équilibre que cherche le programme.

> Idée directrice : l'unité de la Nation n'exige pas l'uniformité des territoires ; elle exige que la loi commune s'applique partout, y compris quand elle s'adapte.`,
          },
          questions: [
            ['Quelle loi ouvre l’acte I de la décentralisation ?', ['La loi Defferre du 2 mars 1982', 'La loi NOTRe de 2015', 'La loi MAPTAM de 2014', 'La révision de 2003'], 0, 'Elle supprime la tutelle a priori du préfet et fait de la région une collectivité de plein exercice.'],
            ['Qu’apporte l’acte II de 2003-2004 ?', ['La décentralisation entre dans la Constitution', 'La création des départements', 'La suppression des régions', 'La fin du contrôle de légalité'], 0, 'Autonomie financière, référendum local, droit de pétition, expérimentation.'],
            ['Combien de régions compte la France métropolitaine depuis 2016 ?', ['13', '22', '18', '26'], 0, 'La loi NOTRe de 2015 a réduit leur nombre de 22 à 13.'],
            ['Que prévoit l’article 73 de la Constitution ?', ['Les lois s’appliquent en outre-mer avec des adaptations possibles', 'Les collectivités d’outre-mer votent leurs lois', 'La Nouvelle-Calédonie est indépendante', 'L’outre-mer est hors du territoire national'], 0, 'Il concerne les départements et régions d’outre-mer.'],
            ['La Nouvelle-Calédonie relève d’un titre spécifique de la Constitution.', ['Vrai', 'Faux'], 0, 'Le titre XIII, issu de l’accord de Nouméa de 1998.'],
            ['Que dit l’article 75-1 de la Constitution ?', ['Les langues régionales appartiennent au patrimoine de la France', 'Le français est la langue de la République', 'Les langues régionales sont langues officielles', 'L’enseignement bilingue est obligatoire'], 0, 'Ajouté en 2008 ; l’article 2 maintient le français comme langue de la République.'],
            ['Quelle collectivité gère le RSA et la protection de l’enfance ?', ['Le département', 'La région', 'La commune', 'L’État'], 0, 'L’action sociale est le cœur des compétences départementales.'],
            ['Reconnaitre la diversité des territoires contredit l’indivisibilité de la République.', ['Vrai', 'Faux'], 1, 'L’unité tient à la loi commune, pas à l’uniformité des statuts.'],
          ],
        },
        {
          titre: 'Nationalité et citoyenneté',
          axe: 'La République et la Nation',
          lecon: {
            titre: 'Une communauté nationale ouverte',
            cours: `Dans la République française, la communauté nationale n'est pas fermée sur une origine : elle est ouverte, marquée par la possibilité d'acquérir la nationalité.

## Deux notions distinctes
| La notion | Ce qu'elle est |
| La **nationalité** | Un lien **juridique** entre une personne et un État |
| La **citoyenneté** | Elle y ajoute des **droits politiques** : voter, être élu |

> En France, la citoyenneté est en principe attachée à la nationalité — avec une exception : les citoyens de l'Union résidant en France votent aux élections **municipales** et **européennes**.

## Comment devient-on français
| La voie | Sa condition |
| **Droit du sang** | Au moins un **parent français**, où que l'enfant naisse |
| **Droit du sol** | Né en France de parents étrangers, français **à 18 ans** s'il y réside depuis ses 11 ans (5 ans au moins) ; anticipation possible à 16 ou 13 ans |
| **Double droit du sol** | Né en France d'un parent lui-même né en France : français **dès la naissance** |
| **Naturalisation** | Par décret, après en principe **5 ans** de résidence régulière, sous conditions d'intégration : langue, droits et devoirs, valeurs de la République |
| **Par mariage** | Par déclaration, après **4 ans** de vie commune |

La cérémonie d'accueil dans la citoyenneté française remet la **charte des droits et devoirs du citoyen français**.

## La citoyenneté européenne
Instituée par le traité de **Maastricht** (1992), elle **complète** la citoyenneté nationale sans la remplacer.

| Le droit | Son contenu |
| **Libre circulation et séjour** | Dans toute l'Union |
| **Vote et éligibilité** | Aux municipales et aux européennes, dans l'État de résidence |
| **Protection consulaire** | Par tout État membre |
| **Pétition** | Au Parlement européen |
| **Initiative citoyenne européenne** | Un million de signatures dans un quart des États |

> À ne pas confondre : la **nationalité** (lien juridique), la **citoyenneté** (droits politiques), l'**identité** (sentiment d'appartenance). Le programme travaille les deux premières.`,
          },
          questions: [
            ['Sur quoi repose le droit du sang ?', ['La nationalité d’au moins un parent', 'Le lieu de naissance', 'La durée de résidence', 'Le mariage'], 0, 'L’enfant est français où qu’il naisse.'],
            ['À quel âge l’enfant né en France de parents étrangers devient-il français de plein droit ?', ['À 18 ans, sous condition de résidence', 'À la naissance', 'À 13 ans', 'Jamais sans naturalisation'], 0, 'Il doit résider en France depuis l’âge de 11 ans, au moins 5 ans.'],
            ['Après combien d’années de résidence régulière peut-on en principe demander la naturalisation ?', ['5 ans', '2 ans', '10 ans', '15 ans'], 0, 'Des réductions existent, notamment pour les diplômés d’un établissement français.'],
            ['Quel traité institue la citoyenneté européenne ?', ['Le traité de Maastricht (1992)', 'Le traité de Rome (1957)', 'Le traité de Lisbonne (2007)', 'L’Acte unique (1986)'], 0, 'Elle complète la citoyenneté nationale sans la remplacer.'],
            ['Un citoyen européen résidant en France peut voter aux élections présidentielles françaises.', ['Vrai', 'Faux'], 1, 'Il vote aux municipales et aux européennes, pas aux élections nationales.'],
            ['Qu’est-ce que le double droit du sol ?', ['Être français dès la naissance si un parent est né en France', 'Cumuler deux nationalités', 'Naitre à l’étranger de parents français', 'Acquérir la nationalité par mariage'], 0, 'Le lien avec le territoire s’établit alors sur deux générations.'],
            ['Que garantit la protection consulaire au citoyen européen ?', ['L’aide de tout État membre à l’étranger', 'Un passeport européen unique', 'Le droit d’asile', 'La double nationalité'], 0, 'Lorsque son propre État n’est pas représenté dans le pays.'],
            ['La nationalité et la citoyenneté sont exactement la même chose.', ['Vrai', 'Faux'], 1, 'La citoyenneté ajoute les droits politiques ; l’Union européenne en donne un exemple dissocié.'],
          ],
        },
        {
          titre: 'Les questions mémorielles et le patriotisme constitutionnel',
          axe: 'La République et la Nation',
          lecon: {
            titre: 'Ce dont une nation choisit de se souvenir',
            cours: `Les questions mémorielles nourrissent une réflexion sur l'identité de la Nation : tantôt ferment de son unité, tantôt champ d'affrontements.

## Mémoire et histoire
| La notion | Sa nature | Qui la porte |
| La **mémoire** | Un rapport **vécu**, sélectif et affectif au passé | Des groupes |
| L'**histoire** | Une démarche **critique**, fondée sur des sources et le débat scientifique | Une communauté savante |

> Une commémoration n'est pas un cours d'histoire : elle **choisit** ce qu'elle rappelle.

## Les commémorations françaises
| La date | Ce qu'elle rappelle |
| **11 novembre** | L'armistice de 1918, et tous les morts pour la France |
| **8 mai** | La victoire de 1945 |
| **27 janvier** | Les victimes de la Shoah |
| **10 mai** | La traite, l'esclavage et leurs abolitions |
| **18 juin** | L'appel du général de Gaulle |

Le **Panthéon** honore par ses panthéonisations une certaine idée du mérite national.

## Les lois dites mémorielles
| La loi | Sa date | Ce qu'elle établit |
| Loi **Gayssot** | 1990 | Elle punit la contestation des crimes contre l'humanité |
| Loi **Taubira** | 2001 | Elle reconnaît la **traite et l'esclavage** comme **crime contre l'humanité** |

Elles font débat : des historiens rappellent qu'il n'appartient pas au législateur d'écrire l'histoire.

> Le **Conseil constitutionnel** a censuré en **2012** la loi pénalisant la négation du génocide arménien, au nom de la **liberté d'expression**.

## Le « devoir de mémoire », et ses limites
| L'objection | Son argument |
| Contre la formule | Trop large, elle fige le passé en obligation |
| Pour la formule | La refuser laisse le champ libre à l'oubli |

Le recueil **Portraits de France** (2021) illustre une autre voie : rendre visibles des figures d'origine étrangère ayant compté dans l'histoire nationale.

## Le patriotisme constitutionnel
Associée au philosophe **Jürgen Habermas**, la notion désigne l'attachement des citoyens non à une origine commune, mais aux **principes fondateurs** de la République et de la démocratie — et le souci de les voir mieux réalisés.

> C'est un patriotisme **par adhésion**, ouvert à qui adhère.

> Bon réflexe de copie : distinguer ce qui relève du **droit** (les lois mémorielles), de la **science** (le travail des historiens) et de la **politique** (les commémorations).`,
          },
          questions: [
            ['Quelle est la différence entre mémoire et histoire ?', ['La mémoire est vécue et sélective, l’histoire est critique et fondée sur des sources', 'Aucune, ce sont deux mots pour la même chose', 'L’histoire est officielle, la mémoire est privée', 'La mémoire est écrite, l’histoire est orale'], 0, 'Une commémoration choisit ce qu’elle rappelle : ce n’est pas un cours d’histoire.'],
            ['Que reconnait la loi Taubira de 2001 ?', ['La traite et l’esclavage comme crime contre l’humanité', 'Le génocide arménien', 'La Shoah comme crime imprescriptible', 'Les crimes de la colonisation'], 0, 'La journée du 10 mai lui est associée.'],
            ['Qu’a censuré le Conseil constitutionnel en 2012 ?', ['La loi pénalisant la négation du génocide arménien', 'La loi Gayssot', 'La loi Taubira', 'La loi de 1905'], 0, 'Au nom de la liberté d’expression.'],
            ['Que commémore le 27 janvier ?', ['La mémoire des victimes de la Shoah', 'L’armistice de 1918', 'L’abolition de l’esclavage', 'La victoire de 1945'], 0, 'Journée internationale, à la date de la libération d’Auschwitz.'],
            ['Le patriotisme constitutionnel repose sur une origine commune.', ['Vrai', 'Faux'], 1, 'Il repose sur l’adhésion aux principes fondateurs de la République et de la démocratie.'],
            ['Quel recueil met en lumière des personnalités d’origine étrangère de l’histoire nationale ?', ['Portraits de France', 'Le Panthéon des Français', 'Les Grands Hommes', 'Mémoires de la Nation'], 0, 'Publié en 2021, il sert de support en classe.'],
            ['Pourquoi les lois mémorielles font-elles débat ?', ['Parce qu’il n’appartient pas au législateur d’écrire l’histoire', 'Parce qu’elles sont inconstitutionnelles par nature', 'Parce qu’elles interdisent les commémorations', 'Parce qu’elles ne prévoient aucune sanction'], 0, 'C’est l’argument principal des historiens qui les contestent.'],
            ['Le 10 mai est la journée de mémoire de la traite, de l’esclavage et de leurs abolitions.', ['Vrai', 'Faux'], 0, 'Elle est associée à la loi Taubira du 21 mai 2001.'],
          ],
        },
        {
          titre: 'La défense et la sécurité nationale',
          axe: 'La République et la Nation',
          lecon: {
            titre: 'Protéger la Nation, et s’y engager',
            cours: `La communauté nationale se matérialise aussi par l'existence d'une défense nationale, aujourd'hui confrontée à des enjeux renouvelés.

## De la « défense » à la « sécurité nationale »
Le **Livre blanc de 2008** introduit la notion de **sécurité nationale** : la protection de la population ne se joue plus seulement face à une armée étrangère.

| La menace nouvelle | Ce qu'elle vise |
| Le **terrorisme** | La population civile |
| Les **cyberattaques** | Les systèmes d'information |
| Les crises **sanitaires** | La santé publique |
| Les atteintes aux **infrastructures critiques** | Énergie, eau, santé, transports |

## Les réponses
| La menace | Le dispositif |
| Terrorisme | Le plan **Vigipirate**, l'opération **Sentinelle** |
| Cyberattaques | L'**ANSSI**, qui protège l'État et les opérateurs d'importance vitale |
| **Guerres hybrides** | Actions militaires, économiques, cyber et **informationnelles** menées sous le seuil de la guerre déclarée |

> Désinformation, manipulation de l'information, ingérences électorales en font partie : savoir vérifier une information relève ainsi de la défense.

## Une défense européenne
| Le cadre | Ce qu'il prévoit |
| L'**OTAN** | La défense collective de l'Alliance |
| L'**article 42-7** du traité sur l'Union européenne | Une **clause d'assistance mutuelle** entre États membres |

Elle a été invoquée pour la première fois par la France après les attentats du **13 novembre 2015**.

## S'engager, aujourd'hui
Depuis la **suspension de la conscription en 1997**, le lien armée-Nation passe par :

| Le dispositif | Ce qu'il est |
| Le **recensement à 16 ans** et la **JDC** | Obligatoires |
| Le **service national universel** | Il vise l'engagement des jeunes et la cohésion nationale |
| La **réserve opérationnelle** et la réserve citoyenne | Un engagement volontaire |
| Les parcours de formation | Service militaire volontaire, cadets de la République, classes de défense, lycées labellisés |

> À retenir : la défense n'est plus l'affaire des seuls militaires. La « sécurité nationale » associe l'État, les entreprises, les collectivités — et les citoyens.`,
          },
          questions: [
            ['Quel document introduit la notion de « sécurité nationale » ?', ['Le Livre blanc sur la défense et la sécurité nationale de 2008', 'La Constitution de 1958', 'Le traité de Lisbonne', 'La loi de programmation militaire de 1997'], 0, 'Il élargit la défense au terrorisme, au cyber et aux crises majeures.'],
            ['Que désigne une « guerre hybride » ?', ['Une combinaison d’actions militaires, cyber, économiques et informationnelles', 'Une guerre menée par deux armées régulières', 'Un conflit civil', 'Une guerre sans armes'], 0, 'Elle se joue souvent sous le seuil de la guerre déclarée.'],
            ['Quelle agence protège l’État français contre les cyberattaques ?', ['L’ANSSI', 'La DGSE', 'La CNIL', 'L’ANCT'], 0, 'Elle protège aussi les opérateurs d’importance vitale.'],
            ['Que prévoit l’article 42-7 du traité sur l’Union européenne ?', ['Une clause d’assistance mutuelle entre États membres', 'La création d’une armée européenne', 'Le budget de la défense', 'L’adhésion automatique à l’OTAN'], 0, 'La France l’a invoquée après les attentats du 13 novembre 2015.'],
            ['La conscription obligatoire a été supprimée en France.', ['Vrai', 'Faux'], 0, 'Elle est suspendue depuis 1997 ; restent le recensement à 16 ans et la JDC.'],
            ['Quelle démarche est obligatoire pour tous les jeunes Français ?', ['Le recensement à 16 ans et la journée défense et citoyenneté', 'Le service national universel', 'La réserve opérationnelle', 'Le service militaire volontaire'], 0, 'La JDC conditionne l’inscription aux examens et au permis.'],
            ['Quelle opération militaire assure une présence de sécurité sur le territoire français ?', ['Sentinelle', 'Barkhane', 'Chammal', 'Daman'], 0, 'Elle est associée au plan Vigipirate.'],
            ['Savoir vérifier une information relève des enjeux de défense.', ['Vrai', 'Faux'], 0, 'La manipulation de l’information est un volet des guerres hybrides.'],
          ],
        },
      ],
    },
  ],
}
