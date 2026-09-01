// SES PREMIÈRE (spécialité) — les 23 fiches du programme officiel, rangées sous
// ses 7 chapitres : la coordination par le marché · la monnaie et le
// financement · la socialisation · les liens sociaux · la déviance · le vote et
// l’opinion publique · les regards croisés.
//
// LE DÉFAUT. Sondé le 21/08/2026 (node _ASSOCIE/sonde-chapitres.mjs 1re ses) :
// la spécialité SES de Première n’a que QUATRE fiches composites, héritées des
// migrations écrites à la main — « Le marché et ses défaillances », « La monnaie
// et le financement », « Socialisation et groupes sociaux », « L’opinion
// publique ». Chacune résume un questionnement entier du BO en une fiche. Sur
// les douze questionnements du programme, la moitié n’a AUCUNE entrée : les
// marchés imparfaitement concurrentiels, le financement des agents, la création
// monétaire, les liens sociaux, la déviance et le contrôle social, le vote, la
// protection sociale, l’entreprise et sa gouvernance.
//
// POURQUOI UN MODULE NEUF plutôt qu’un ajout dans `ses-tle.mjs` : celui-ci part
// dans la migration 253, qui ne doit plus être régénérée. Deux fichiers, même
// slug `ses` — d’où la génération par `--modules` et non par `--slugs`.
//
// PÉRIMÈTRE : la PREMIÈRE SEULE. Le ménage est borné à `level = '1re'` : la 2de
// garde ses fiches, la Terminale a reçu les siennes avec la 253.
//
// LE DÉCOUPAGE EST CELUI DE LA MAQUETTE DE RÉFÉRENCE — 7 chapitres et non les 12
// questionnements du BO. Le BO range le programme sous trois parties (science
// économique · sociologie et science politique · regards croisés) : trois
// en-têtes pour 23 fiches ne rangeraient presque rien. Les douze
// questionnements, à l’inverse, produiraient des sections d’une seule fiche.
// Les sept chapitres retenus sont ceux du cahier : ils regroupent les
// questionnements que le professeur traite d’un bloc (marché, monnaie et
// financement, vote et opinion publique, regards croisés) et gardent la
// formulation en QUESTION du BO là où elle coiffe déjà un chapitre entier.
//
// ⚠️ LES FICHES « (suite) » DE LA MAQUETTE ONT ÉTÉ RENOMMÉES. La source découpe
// quatre questionnements longs en deux pages, la seconde s’appelant « … (suite) ».
// Un titre pareil ne dit rien à l’élève dans une liste de fiches, et `chapters`
// est UNIQUE(subject_id, level, title) : la seconde page reçoit ici un titre qui
// nomme ce qu’elle traite. Le compte de fiches et l’ordre du programme sont
// inchangés.

export default {
  slug: 'ses',
  nom: 'SES',

  titreMigration: 'SES 1re (spécialité) — LE PROGRAMME OFFICIEL (23 fiches)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs 1re ses, 21/08/2026) :
la spécialité SES de Première n'avait que QUATRE fiches composites — « Le marché
et ses défaillances », « La monnaie et le financement », « Socialisation et
groupes sociaux », « L'opinion publique » —, chacune résumant un questionnement
entier du BO. Sur les douze questionnements du programme, la moitié n'avait
AUCUNE entrée : les marchés imparfaitement concurrentiels, le financement des
agents économiques, la création monétaire, les liens sociaux, la déviance et le
contrôle social, le vote, l'assurance et la protection sociale, l'entreprise et
sa gouvernance. C'est la spécialité que l'élève poursuivra en Terminale à
coefficient 16, et dont l'épreuve de Première conditionne le choix.

Cette migration installe les 23 fiches du programme, rangées sous ses 7
chapitres, et retire les 4 fiches composites qu'elles recouvrent.

PÉRIMÈTRE : la PREMIÈRE SEULE. La 2de garde ses fiches, la Terminale a reçu les
siennes avec la 253 : le ménage est borné au niveau 1re.

⚠️ CE QUI EST PERDU AU PASSAGE : les cours et les quiz des 4 fiches composites.
Ils étaient adossés à un découpage que les 23 fiches recouvrent entièrement.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 23 fiches sous 7 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que la 234 n'a jamais été
exécutée telle quelle — sans cette reprise, la migration échouerait sur
"column chapters.theme does not exist", les 4 anciennes fiches déjà supprimées
et les 23 neuves pas encore posées : une matière vide.
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

LE REPÈRE EST theme IS NULL, PAS LE TITRE : « L'opinion publique » porte une
apostrophe, et rien ne garantit que la base porte la même que ce fichier
(droite dans le contenu ancien, typographique dans le récent) ; un DELETE par
titre ne trouverait alors pas la ligne, EN SILENCE (piège rencontré en 249 et
contourné depuis, cf. 258, 259 et 266). Le critère « pas de chapitre de
programme » vise exactement les quatre lignes voulues : elles sont antérieures à
la colonne theme, tandis que les 23 fiches neuves en portent un dès l'INSERT —
le ménage tourne AVANT les insertions et ne peut donc jamais mordre sur elles,
ni au premier passage ni au rejeu.
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
   AND s.slug = 'ses'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'ses'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'ses'
   AND c.level = '1re'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      chapitres: [
        // ---- Chapitre 1 : la coordination par le marché ---------------------
        {
          titre: 'Qu’est-ce qu’un marché ?',
          axe: 'La coordination par le marché',
          lecon: {
            titre: 'Une institution, pas un lieu',
            cours: `Un **marché** est le lieu — **réel ou non** — de rencontre entre une **offre** et une **demande**, d’où sortent un **prix** et une **quantité échangée**.

> La Bourse, un site de petites annonces et le **marché du travail** sont des marchés **au même titre que la place du village**.

## Le marché est une institution
Un échange marchand suppose des **règles** — et **ces règles ne tombent pas du ciel**.

| Règle nécessaire | Ce qu’elle permet |
| Des **droits de propriété** définis et protégés | **On ne vend que ce qu’on possède** |
| Une **monnaie** acceptée par tous | Elle évite le **troc** et sa **double coïncidence des désirs** |
| Des **contrats** exécutoires | Garantis par la **justice** |
| De l’**information** | Étiquetage, normes, garanties |

> **Sans État de droit, pas de marché** : c’est l’**institution qui rend l’échange possible**, pas l’inverse.

## Ce que le prix fait
Il coordonne **des millions de décisions individuelles** sans qu’aucun bureau central ne les organise.

| Rôle du prix | Ce qu’il fait |
| Il **informe** | Une hausse dit que le produit **devient rare** |
| Il **incite** | Elle pousse les producteurs à **en offrir davantage** |
| Il **rationne** | Elle **écarte** les acheteurs qui n’en veulent pas à ce prix |

## Les coûts de transaction
Échanger n’est **jamais gratuit** : chercher l’information, **négocier**, rédiger le contrat, le faire respecter.

> Les **plateformes numériques**, les places de marché et les intermédiaires **vivent précisément de leur réduction**.

## Marché et autres modes de coordination
| Mode | Son ressort |
| Le **marché** | Le **prix** |
| La **hiérarchie** — entreprise, administration | L’**ordre** |
| La **réciprocité** — don, entraide | L’**obligation sociale** |

> Une économie réelle **mêle les trois**.`,
          },
          questions: [
            ['Qu’est-ce qui sort de la rencontre entre l’offre et la demande sur un marché ?', ['Un prix et une quantité échangée', 'Un salaire et un profit', 'Un impôt et une subvention', 'Un contrat de travail'], 0, 'Le prix et la quantité d’équilibre sont les deux résultats de la confrontation.'],
            ['Un marché a nécessairement une existence physique.', ['Vrai', 'Faux'], 1, 'Le marché des changes ou celui des actions n’ont aucun lieu : ce sont des réseaux d’échanges.'],
            ['Que sont les droits de propriété ?', ['Le droit d’user d’un bien, d’en tirer un revenu et de le céder', 'Le droit de travailler', 'Le droit de vote des actionnaires', 'Le droit de créer une entreprise'], 0, 'Usus, fructus, abusus : sans eux, personne ne peut vendre ni acheter durablement.'],
            ['Quels sont les coûts de transaction ?', ['Les coûts de recherche, de négociation et d’exécution d’un échange', 'Les coûts de production d’un bien', 'Les impôts payés sur un achat', 'Les frais bancaires uniquement'], 0, 'Ce sont les coûts de l’échange lui-même, distincts des coûts de production.'],
            ['Le prix ne joue qu’un seul rôle sur un marché : rémunérer le vendeur.', ['Vrai', 'Faux'], 1, 'Il informe, il incite et il rationne — trois fonctions à la fois.'],
            ['Quel mode de coordination repose sur l’ordre plutôt que sur le prix ?', ['La hiérarchie', 'Le marché', 'La réciprocité', 'Le troc'], 0, 'Dans une entreprise, on ne négocie pas le prix de chaque tâche : on obéit à une organisation.'],
            ['Pourquoi la monnaie facilite-t-elle l’échange marchand ?', ['Elle évite d’avoir à trouver un partenaire aux désirs exactement inverses', 'Elle fait baisser les prix', 'Elle supprime les coûts de transaction', 'Elle garantit la qualité des biens'], 0, 'Le troc exige une double coïncidence des désirs, très coûteuse à obtenir.'],
            ['L’intervention de l’État est incompatible avec l’existence d’un marché.', ['Vrai', 'Faux'], 1, 'Le marché suppose au contraire un État qui définit les droits et fait respecter les contrats.'],
          ],
        },
        {
          titre: 'Comment un marché concurrentiel fonctionne-t-il ?',
          axe: 'La coordination par le marché',
          lecon: {
            titre: 'Offre, demande et prix d’équilibre',
            cours: `La **concurrence parfaite** est un **modèle** : **cinq conditions** y sont réunies.

| Condition | Ce qu’elle exige |
| **Atomicité** | Une **multitude** d’offreurs et de demandeurs |
| **Homogénéité** | Le produit est **identique** partout |
| **Libre entrée et sortie** | Aucune barrière |
| **Information parfaite** | Tous savent tout |
| **Libre circulation** des facteurs | Capital et travail se déplacent |

## Les deux courbes
| Courbe | Son sens | Pourquoi |
| La **demande** | **Décroissante** | Plus le prix monte, **moins on achète** |
| L’**offre** | **Croissante** | Plus le prix monte, **plus il est rentable de vendre** |

> Leur **intersection** donne le **prix d’équilibre** : celui pour lequel **la quantité offerte égale la quantité demandée**.

## Le retour à l’équilibre
| Si le prix est… | Ce qui se passe |
| **Trop élevé** | L’offre dépasse la demande : la **mévente** fait **baisser** le prix |
| **Trop bas** | La **pénurie** fait **monter** les enchères |

> Le marché s’ajuste **par les prix**. Et **aucun agent n’a de pouvoir** : chacun est *price taker*.

## Le piège du devoir
| La variation porte sur… | Ce qui se passe |
| Le **prix du bien** | On se **déplace le long** de la courbe |
| **Autre chose** — revenu, prix d’un substitut, goûts, coût, technologie | On **déplace la courbe entière** |

> Une hausse du revenu des ménages **ne remonte pas la courbe de demande le long de son tracé** : elle la **décale vers la droite** — et le **nouveau prix d’équilibre est plus élevé**.

## Le surplus
| Surplus | Ce qu’il mesure |
| Du **consommateur** | L’écart entre **ce qu’il était prêt à payer** et **ce qu’il paie** |
| Du **producteur** | Entre le **prix reçu** et **le prix qu’il aurait accepté** |

> Leur **somme** mesure le **gain à l’échange**.`,
          },
          questions: [
            ['Combien de conditions définissent la concurrence parfaite ?', ['Cinq', 'Deux', 'Trois', 'Sept'], 0, 'Atomicité, homogénéité, libre entrée et sortie, transparence, mobilité des facteurs.'],
            ['Que se passe-t-il quand le prix est supérieur au prix d’équilibre ?', ['L’offre excède la demande et le prix tend à baisser', 'La demande excède l’offre et le prix tend à monter', 'Le marché disparaît', 'La quantité échangée augmente'], 0, 'La mévente pousse les vendeurs à réviser leur prix à la baisse.'],
            ['Une hausse du revenu des ménages déplace la courbe de demande vers la droite.', ['Vrai', 'Faux'], 0, 'Ce n’est pas le prix du bien qui change : c’est toute la courbe qui se décale.'],
            ['Que signifie « être preneur de prix » ?', ['Subir le prix du marché sans pouvoir l’influencer', 'Fixer librement son prix de vente', 'Négocier le prix avec chaque client', 'Acheter au prix le plus bas possible'], 0, 'C’est la conséquence de l’atomicité : chaque agent est trop petit pour peser.'],
            ['Le surplus du consommateur correspond à…', ['la différence entre ce qu’il était prêt à payer et ce qu’il a payé', 'la somme dépensée pour acheter le bien', 'le profit réalisé par le vendeur', 'la quantité qu’il n’a pas pu acheter'], 0, 'C’est le gain que l’échange lui procure au prix d’équilibre.'],
            ['Une baisse du coût de production déplace la courbe d’offre vers la droite.', ['Vrai', 'Faux'], 0, 'À chaque prix, les producteurs acceptent d’offrir davantage : le prix d’équilibre baisse.'],
            ['Pourquoi la courbe de demande est-elle décroissante ?', ['Parce qu’une hausse du prix décourage une partie des acheteurs', 'Parce que les producteurs offrent moins', 'Parce que les revenus baissent', 'Parce que la qualité diminue'], 0, 'À prix plus élevé, certains renoncent ou se tournent vers un substitut.'],
            ['En concurrence parfaite, un producteur peut vendre plus cher que ses concurrents sans perdre de clients.', ['Vrai', 'Faux'], 1, 'Le produit étant homogène et l’information parfaite, il perdrait toute sa clientèle.'],
          ],
        },
        {
          titre: 'Comment les marchés imparfaitement concurrentiels fonctionnent-ils ?',
          axe: 'La coordination par le marché',
          lecon: {
            titre: 'Monopole, oligopole et concurrence monopolistique',
            cours: `Dans la réalité, **une des cinq conditions manque presque toujours**. Le producteur cesse d’être **preneur de prix** : il devient **faiseur de prix** (*price maker*).

## Les trois structures
| Structure | Le nombre d’offreurs | Le produit |
| **Monopole** | **Un seul** | — |
| **Oligopole** | **Quelques-uns** | Souvent homogène |
| **Concurrence monopolistique** | **Beaucoup** | **Différencié** |

## Le monopole
| Ce qu’il fait | Le résultat |
| Il fixe son prix **au-dessus du coût marginal** | **Prix plus élevé**, **quantité plus faible** |
| Il capte une part du surplus | Une partie du **surplus du consommateur lui est transférée** |

| Sa source | L’exemple |
| Un **brevet** | Le médicament protégé |
| Le contrôle d’une **ressource** | Une mine unique |
| Une **économie d’échelle** telle qu’un seul producteur est plus efficace | Le monopole **naturel** : les **rails**, les **réseaux d’eau** |

## L’oligopole
Chacun **tient compte de ce que feront les autres** : c’est l’**interdépendance stratégique**.

| Issue | Pour le consommateur |
| La **guerre des prix** | **Bénéfique** |
| L’**entente** (cartel) | **Interdite** — elle **reconstitue un monopole** |

## La concurrence monopolistique
Chacun détient un **petit monopole sur sa variété**.

| Différenciation | Son moyen |
| **Objective** | Qualité, caractéristiques |
| **Subjective** | **Marque**, image, **publicité** |

> C’est **le cas le plus répandu** : restauration, vêtements, téléphonie.

## Le pouvoir de marché
La capacité à fixer un prix **supérieur au coût marginal** : par l’**innovation**, la publicité, la fidélisation, la **taille** — ou par des **barrières à l’entrée**.

> La **politique de la concurrence** surveille **trois choses** : les **ententes**, les **abus de position dominante**, les **concentrations**. Elle ne combat **pas la taille en soi**, mais **l’usage qui en est fait**.`,
          },
          questions: [
            ['Qu’est-ce qu’un « faiseur de prix » ?', ['Un producteur qui dispose d’un pouvoir de marché et fixe son prix', 'Un consommateur qui négocie', 'Un producteur qui subit le prix du marché', 'L’État quand il fixe un prix administré'], 0, 'C’est l’inverse du price taker de la concurrence parfaite.'],
            ['Qu’est-ce qu’un monopole naturel ?', ['Un marché où une seule entreprise produit à un coût plus bas que plusieurs', 'Un monopole créé par la loi', 'Un monopole issu d’une entente', 'Un monopole temporaire dû à un brevet'], 0, 'Les coûts fixes très élevés d’un réseau rendent la duplication absurde.'],
            ['En monopole, le prix est plus élevé et la quantité échangée plus faible qu’en concurrence.', ['Vrai', 'Faux'], 0, 'Le monopoleur restreint la quantité pour vendre plus cher.'],
            ['Qu’est-ce qui caractérise l’oligopole ?', ['L’interdépendance stratégique entre quelques offreurs', 'L’absence totale de concurrence', 'L’homogénéité parfaite des produits', 'La libre entrée sur le marché'], 0, 'Chaque décision dépend de l’anticipation du comportement des rivaux.'],
            ['Une entente entre concurrents sur les prix est autorisée si elle est publique.', ['Vrai', 'Faux'], 1, 'Le cartel est interdit et lourdement sanctionné : il reconstitue un monopole.'],
            ['Sur quoi repose la concurrence monopolistique ?', ['La différenciation des produits', 'Le nombre réduit d’offreurs', 'L’existence d’un brevet unique', 'L’intervention de l’État'], 0, 'Chaque producteur détient un mini-monopole sur sa variété.'],
            ['Qu’est-ce qu’une barrière à l’entrée ?', ['Un obstacle qui dissuade de nouveaux concurrents d’entrer sur le marché', 'Une taxe sur les importations', 'Un plafond de prix imposé par l’État', 'Une limite au nombre de clients'], 0, 'Coûts fixes, brevets, réputation, réseaux de distribution en sont des exemples.'],
            ['La politique de la concurrence interdit à une entreprise d’être grande.', ['Vrai', 'Faux'], 1, 'Elle sanctionne l’abus de position dominante, pas la position dominante elle-même.'],
          ],
        },
        {
          titre: 'Quelles sont les principales défaillances du marché ?',
          axe: 'La coordination par le marché',
          lecon: {
            titre: 'Externalités, biens collectifs et asymétries d’information',
            cours: `Une **défaillance de marché** est une situation où la coordination marchande, **laissée à elle-même**, **n’aboutit pas** à une allocation efficace. **Trois cas** au programme.

## Les externalités
Une **externalité** existe quand l’action d’un agent **affecte le bien-être d’un autre sans compensation monétaire**.

| Type | L’exemple | Ce que le marché fait |
| **Négative** | La **pollution** d’une usine, dont le coût est supporté par les riverains | Prix **trop bas**, quantité **trop élevée** |
| **Positive** | La **vaccination**, la recherche, l’apiculture voisine d’un verger | Le marché en produit **trop peu** |

| Remède | Son principe |
| La **taxe** | Le **pollueur-payeur** |
| La **subvention** | Encourager l’externalité positive |
| La **réglementation** | Interdire ou imposer |
| Un **marché de droits à polluer** | Des **quotas échangeables** |

## Les biens collectifs
| Propriété | Ce qu’elle signifie |
| **Non rival** | **Ma consommation n’empêche pas la vôtre** |
| **Non excluable** | **On ne peut empêcher personne d’en profiter** |

Exemples : l’**éclairage public**, la **défense nationale**, un **phare**.

> Comme personne ne peut être exclu, **chacun a intérêt à attendre que les autres paient** : c’est le **passager clandestin**. **Le marché ne les produit pas** — la puissance publique s’en charge, **financée par l’impôt**.

## Les asymétries d’information
| Quand | Le mécanisme | L’exemple |
| **Avant** le contrat | La **sélection adverse** | **Akerlof** : sur le marché des voitures d’occasion, l’acheteur ne distinguant pas les bonnes des mauvaises **n’offre qu’un prix moyen** — les bons vendeurs **se retirent**, il ne reste que les *lemons* |
| **Après** le contrat | L’**aléa moral** | Un **assuré tous risques devient moins prudent** |

> Les remèdes tournent tous autour du **même principe** : **réduire l’écart d’information** — garanties, labels, certifications, contrôle technique, **franchise** d’assurance.`,
          },
          questions: [
            ['Qu’est-ce qu’une externalité négative ?', ['Un effet dommageable subi par un tiers sans compensation', 'Une perte subie par le producteur', 'Une taxe sur la production', 'Un défaut de qualité du produit'], 0, 'La pollution en est l’exemple type : son coût n’entre pas dans le prix.'],
            ['En présence d’une externalité négative, le marché produit une quantité trop faible.', ['Vrai', 'Faux'], 1, 'Le coût social n’étant pas payé, le prix est trop bas et la quantité trop élevée.'],
            ['Quelles sont les deux propriétés d’un bien collectif ?', ['Non-rivalité et non-excluabilité', 'Rareté et cherté', 'Rivalité et excluabilité', 'Gratuité et abondance'], 0, 'L’éclairage public réunit les deux : chacun en profite sans priver personne.'],
            ['Qu’est-ce que le comportement de passager clandestin ?', ['Profiter d’un bien collectif sans contribuer à son financement', 'Vendre un bien de mauvaise qualité', 'Acheter sans payer de TVA', 'Se retirer d’un marché non rentable'], 0, 'C’est pourquoi le financement passe par l’impôt et non par le prix.'],
            ['La sélection adverse intervient avant la signature du contrat.', ['Vrai', 'Faux'], 0, 'Elle porte sur une qualité cachée ; l’aléa moral, lui, porte sur un comportement postérieur.'],
            ['Que montre Akerlof avec le marché des voitures d’occasion ?', ['Que l’asymétrie d’information peut faire disparaître les biens de qualité', 'Que les prix finissent toujours par s’équilibrer', 'Que la publicité augmente les prix', 'Que le monopole est inévitable'], 0, 'Les bons vendeurs se retirent d’un marché qui ne paie qu’un prix moyen.'],
            ['Quel remède applique le principe pollueur-payeur ?', ['La taxe sur les activités polluantes', 'La subvention à la recherche', 'La gratuité du service', 'Le brevet'], 0, 'Elle réintègre dans le prix le coût supporté par la collectivité.'],
            ['Une franchise d’assurance sert à limiter l’aléa moral.', ['Vrai', 'Faux'], 0, 'En laissant une part du dommage à la charge de l’assuré, elle le maintient prudent.'],
          ],
        },

        // ---- Chapitre 2 : la monnaie et le financement ----------------------
        {
          titre: 'Comment les agents économiques se financent-ils ?',
          axe: 'La monnaie et le financement',
          lecon: {
            titre: 'Besoin de financement, capacité de financement',
            cours: `Chaque année, un agent compare son **épargne** à son **investissement**.

| Situation | Ce qu’elle signifie |
| Épargne **supérieure** à l’investissement | Une **capacité de financement** |
| Épargne **inférieure** | Un **besoin de financement** |

## Qui est dans quelle situation
| Agent | Sa position habituelle |
| Les **ménages** | **Capacité** : ils épargnent plus qu’ils n’achètent de logements |
| Les **entreprises** | **Besoin** : leurs investissements dépassent leurs profits non distribués |
| Les **administrations publiques** | **Besoin** dès que le budget est **en déficit** |

> La fonction du système financier tient en un mot : **transférer** les fonds des premiers vers les seconds.

## L’autofinancement
Il utilise l’**épargne déjà constituée** — pour une entreprise, les **bénéfices mis en réserve**.

| Son avantage | Sa limite |
| **Pas d’intérêts**, **pas de dilution du pouvoir** | Il est **limité par la taille des profits passés** |

## Le financement externe
| Forme | Comment ça marche |
| **Direct** (de marché) | L’agent **émet un titre** acheté par l’épargnant, **sans intermédiaire décisionnaire** |
| **Indirect** (intermédié) | Une **banque** prête, après avoir collecté des dépôts **ou créé de la monnaie** |

> L’indirect finance **l’immense majorité des PME et des ménages**.

## Action ou obligation
| | **Action** | **Obligation** |
| Sa nature | Un titre de **propriété** | Un titre de **créance** |
| Ce qu’elle donne | Un **dividende** et un **droit de vote** | Un **intérêt** et le **remboursement** |
| Son remboursement | **Elle ne se rembourse pas : elle se revend** | **À l’échéance** |

> C’est la **distinction attendue en devoir**.`,
          },
          questions: [
            ['Quand un agent a-t-il un besoin de financement ?', ['Quand son investissement dépasse son épargne', 'Quand son épargne dépasse son investissement', 'Quand son revenu baisse', 'Quand il rembourse un emprunt'], 0, 'Il doit alors trouver des fonds auprès des agents à capacité de financement.'],
            ['Dans l’ensemble, les ménages français dégagent une capacité de financement.', ['Vrai', 'Faux'], 0, 'Leur épargne excède leurs investissements, essentiellement immobiliers.'],
            ['Qu’est-ce que l’autofinancement ?', ['Le financement d’un investissement par ses propres ressources', 'Un prêt bancaire à taux zéro', 'L’émission d’obligations', 'Une subvention publique'], 0, 'Il mobilise les bénéfices mis en réserve, sans coût d’intérêt.'],
            ['Une action est un titre de créance.', ['Vrai', 'Faux'], 1, 'C’est un titre de PROPRIÉTÉ ; l’obligation, elle, est un titre de créance.'],
            ['Qu’est-ce que le financement externe indirect ?', ['Un financement passant par un intermédiaire bancaire', 'Une émission d’actions en Bourse', 'L’usage des bénéfices non distribués', 'Un don entre entreprises'], 0, 'La banque s’interpose entre l’épargnant et l’emprunteur.'],
            ['Que perçoit le détenteur d’une obligation ?', ['Un intérêt, puis le remboursement du capital', 'Un dividende variable', 'Une part du capital de l’entreprise', 'Un droit de vote en assemblée générale'], 0, 'C’est un prêt : rémunération fixée à l’avance et remboursement à l’échéance.'],
            ['Émettre des actions dilue le contrôle des propriétaires existants.', ['Vrai', 'Faux'], 0, 'De nouveaux actionnaires entrent au capital et votent en assemblée générale.'],
            ['Quelle est la fonction principale du système financier ?', ['Transférer les fonds des agents à capacité vers ceux à besoin de financement', 'Fixer le niveau des prix', 'Collecter l’impôt', 'Produire des biens et services marchands'], 0, 'Sans ce transfert, l’épargne des uns ne financerait pas l’investissement des autres.'],
          ],
        },
        {
          titre: 'Le taux d’intérêt, le risque et les marchés de capitaux',
          axe: 'La monnaie et le financement',
          lecon: {
            titre: 'Le prix du temps et du risque',
            cours: `Le **taux d’intérêt** est le **prix du temps** : ce que l’emprunteur paie pour disposer **aujourd’hui** d’une somme qu’il rendra **demain** — et ce que le prêteur exige **pour y renoncer**.

## Ce qui fait varier le taux
| Facteur | Son effet |
| La **durée** | Plus le prêt est long, **plus l’incertitude est grande**, plus le taux est élevé |
| Le **risque de crédit** | La **prime de risque** : une entreprise fragile emprunte **plus cher** qu’un État solide |
| Le **taux directeur** de la banque centrale | Il fixe le coût de refinancement des banques et **se répercute sur tous les taux** |

## Taux nominal, taux réel
**Taux réel ≈ taux nominal − taux d’inflation**

| Une inflation forte | Qui elle avantage |
| Elle **réduit le coût réel** d’un emprunt à taux fixe | L’**emprunteur** — au détriment du **prêteur** |

> Emprunter à **3 %** quand les prix montent de **5 %**, c’est emprunter à un **taux réel négatif**.

## Les deux marchés de capitaux
| | **Marché primaire** | **Marché secondaire** |
| Ce qui s’y passe | L’**émission** | La **revente entre investisseurs** |
| L’émetteur | Il **lève effectivement des fonds** | Il **ne reçoit rien** |
| Sa fonction | Le financement | Il rend les titres **liquides** |

> **Sans la possibilité de revendre, personne n’achèterait sur le primaire.** C’est le lien à savoir énoncer.

## Le rôle des banques
| Métier | Ce qu’il fait |
| **Collecter** | L’épargne |
| **Transformer** | Des **dépôts courts** en **prêts longs** |
| **Évaluer** | Le **risque de chaque emprunteur** |

> Ce dernier travail, **le marché seul le fait mal** pour une **PME**.`,
          },
          questions: [
            ['Que rémunère le taux d’intérêt ?', ['Le renoncement à une somme d’argent pendant une durée', 'Le travail du banquier', 'La qualité du bien financé', 'Le montant de l’impôt payé'], 0, 'C’est le prix du temps, majoré d’une prime de risque.'],
            ['Un emprunteur risqué obtient un taux d’intérêt plus bas.', ['Vrai', 'Faux'], 1, 'Il paie au contraire une prime de risque : le taux est plus élevé.'],
            ['Comment calcule-t-on approximativement le taux d’intérêt réel ?', ['Taux nominal moins taux d’inflation', 'Taux nominal plus taux d’inflation', 'Taux nominal divisé par la durée', 'Taux directeur moins prime de risque'], 0, 'C’est le pouvoir d’achat réellement gagné ou perdu.'],
            ['Une inflation plus forte que le taux nominal avantage l’emprunteur à taux fixe.', ['Vrai', 'Faux'], 0, 'Le taux réel devient négatif : il rembourse en monnaie dépréciée.'],
            ['Que se passe-t-il sur le marché primaire ?', ['Les titres sont émis et l’émetteur lève des fonds', 'Les titres sont revendus entre investisseurs', 'Les banques se refinancent auprès de la banque centrale', 'Les devises sont échangées'], 0, 'C’est le seul moment où l’argent va réellement à l’émetteur.'],
            ['À quoi sert le marché secondaire ?', ['À rendre les titres liquides en permettant leur revente', 'À financer directement les entreprises', 'À fixer les taux directeurs', 'À collecter l’épargne des ménages'], 0, 'Sans liquidité, personne n’accepterait de souscrire à l’émission.'],
            ['Qu’appelle-t-on transformation bancaire ?', ['Financer des prêts longs avec des ressources courtes', 'Changer des euros en devises', 'Transformer une action en obligation', 'Fusionner deux banques'], 0, 'C’est ce qui rend la banque utile — et vulnérable en cas de retraits massifs.'],
            ['Le taux directeur de la banque centrale influence l’ensemble des taux de l’économie.', ['Vrai', 'Faux'], 0, 'Il fixe le coût auquel les banques se refinancent, qu’elles répercutent sur leurs clients.'],
          ],
        },
        {
          titre: 'Qu’est-ce que la monnaie ?',
          axe: 'La monnaie et le financement',
          lecon: {
            titre: 'Les formes de la monnaie',
            cours: `La monnaie est ce qui est **accepté par tous en règlement d’une dette**.

> Sa valeur **ne tient pas à sa matière** mais à la **confiance** qu’elle inspire.

## Trois formes
| Forme | Ce qu’elle est | Sa place aujourd’hui |
| **Marchandise** | Sel, bétail, métaux précieux : elle **vaut par ce qu’elle est** | Disparue |
| **Fiduciaire** | Billets et pièces — de *fiducia*, la **confiance** : **le papier ne vaut rien en lui-même** | Une **petite part** de la masse monétaire |
| **Scripturale** | De simples **écritures sur les comptes bancaires** | L’**essentiel** de la monnaie en circulation |

## La confusion la plus fréquente
> La **carte bancaire**, le **chèque** et le **virement** ne sont **pas de la monnaie** : ce sont des **instruments de circulation** de la monnaie scripturale.

**La monnaie, c’est le solde du compte** — la carte n’est **qu’un moyen d’y toucher**.

## Les trois piliers de la confiance
| Pilier | Ce qu’il repose sur |
| **Méthodique** | **Chacun l’accepte parce qu’il sait que les autres l’accepteront** |
| **Hiérarchique** | Une **autorité** — banque centrale, État — en **garantit le cours légal** |
| **Éthique** | Les **valeurs collectives** attachées à la **stabilité des prix** |

> Quand la confiance s’effondre, la monnaie aussi : lors de l’**hyperinflation allemande de 1923**, **les billets valaient moins que le bois qu’ils servaient à remplacer dans les poêles**.

## Et les cryptomonnaies ?
| Fonction | Ce qu’elles font |
| **Réserve de valeur** | **Trop volatiles** |
| **Intermédiaire des échanges** | **Trop peu acceptées** |

> Elles relèvent **davantage de l’actif spéculatif** que de la monnaie.`,
          },
          questions: [
            ['Quelle forme de monnaie représente aujourd’hui l’essentiel de la masse monétaire ?', ['La monnaie scripturale', 'La monnaie fiduciaire', 'La monnaie marchandise', 'Les cryptomonnaies'], 0, 'Ce sont les soldes des comptes bancaires, de simples écritures.'],
            ['La carte bancaire est une forme de monnaie.', ['Vrai', 'Faux'], 1, 'C’est un instrument de circulation de la monnaie scripturale, pas la monnaie elle-même.'],
            ['D’où vient le mot « fiduciaire » ?', ['Du latin fiducia, la confiance', 'Du grec fides, la valeur', 'Du nom d’un banquier florentin', 'Du latin fiscus, le trésor'], 0, 'Le billet ne vaut que par la confiance qu’on lui accorde.'],
            ['Qu’est-ce que la confiance méthodique dans la monnaie ?', ['Chacun l’accepte parce qu’il sait que les autres l’accepteront', 'L’État garantit son cours légal', 'Elle repose sur une réserve d’or', 'Les banques la contrôlent'], 0, 'C’est une croyance auto-réalisatrice, le premier pilier de la confiance.'],
            ['La valeur d’un billet de banque vient de la valeur du papier qui le compose.', ['Vrai', 'Faux'], 1, 'Elle vient de la confiance et du cours légal, jamais du support.'],
            ['Qu’était la monnaie marchandise ?', ['Un bien qui valait par sa matière propre', 'Une écriture comptable', 'Un billet garanti par l’État', 'Une créance sur une banque'], 0, 'Sel, bétail, métaux précieux : la valeur tenait au bien lui-même.'],
            ['Pourquoi les cryptomonnaies remplissent-elles mal la fonction de réserve de valeur ?', ['Parce que leur cours est très volatil', 'Parce qu’elles sont interdites', 'Parce qu’elles sont matérielles', 'Parce qu’elles ne circulent pas'], 0, 'Une réserve de valeur suppose une valeur stable dans le temps.'],
            ['Une hyperinflation traduit un effondrement de la confiance dans la monnaie.', ['Vrai', 'Faux'], 0, 'L’Allemagne de 1923 en est l’exemple classique.'],
          ],
        },
        {
          titre: 'Les trois fonctions de la monnaie',
          axe: 'La monnaie et le financement',
          lecon: {
            titre: 'Compter, échanger, conserver',
            cours: `Une monnaie se reconnaît **moins à ce qu’elle est qu’à ce qu’elle fait**. **Trois fonctions**, énoncées depuis **Aristote**.

## Unité de compte
Elle donne une **mesure commune** de la valeur.

| Sans unité de compte | Avec |
| Il faudrait le prix de chaque bien **dans chaque autre bien** : pour 100 biens, **4 950 prix relatifs** | **100 prix suffisent** |

> C’est un **gain d’information colossal**.

## Intermédiaire des échanges
Elle brise le **troc** et sa **double coïncidence des désirs**.

> Il ne suffisait pas de trouver quelqu’un **qui a ce que je veux** : il fallait aussi **qu’il veuille ce que j’ai**.

> La monnaie **coupe l’échange en deux** : **je vends, puis j’achète** — à qui je veux, quand je veux.

## Réserve de valeur
Elle permet de **différer** un achat : le pouvoir d’achat gagné aujourd’hui **se conserve pour demain**.

| Sa fragilité | Le chiffre |
| L’**inflation** l’érode | **5 % par an** ampute d’environ **un tiers** le pouvoir d’achat d’une somme conservée **sept ans** |

> C’est **parce que la monnaie est une réserve de valeur** qu’on peut la **thésauriser** — **Keynes** en fait le motif de la **préférence pour la liquidité**.

## Les agrégats monétaires
Classés par **liquidité décroissante** par la Banque centrale européenne.

| Agrégat | Ce qu’il contient |
| **M1** | Pièces, billets et **dépôts à vue** — **immédiatement disponibles** |
| **M2** | M1 **plus** les dépôts à court terme (livrets) |
| **M3** | M2 **plus** les titres d’organismes de placement à court terme |`,
          },
          questions: [
            ['Quelles sont les trois fonctions de la monnaie ?', ['Unité de compte, intermédiaire des échanges, réserve de valeur', 'Épargne, investissement, consommation', 'Émission, circulation, destruction', 'Prêt, dépôt, placement'], 0, 'Elles sont identifiées depuis Aristote et restent au programme.'],
            ['Quelle fonction de la monnaie l’inflation dégrade-t-elle le plus ?', ['La réserve de valeur', 'L’unité de compte', 'L’intermédiaire des échanges', 'Aucune'], 0, 'Le pouvoir d’achat conservé fond avec la hausse des prix.'],
            ['Le troc suppose une double coïncidence des désirs.', ['Vrai', 'Faux'], 0, 'Chacun doit vouloir exactement ce que l’autre possède : c’est très coûteux.'],
            ['Que contient l’agrégat M1 ?', ['Les pièces, les billets et les dépôts à vue', 'Les livrets d’épargne uniquement', 'Les actions et obligations', 'Les crédits accordés par les banques'], 0, 'C’est la monnaie immédiatement disponible pour payer.'],
            ['L’unité de compte réduit le nombre de prix à connaître dans une économie.', ['Vrai', 'Faux'], 0, 'Elle remplace des milliers de prix relatifs par un prix par bien.'],
            ['Que permet la fonction d’intermédiaire des échanges ?', ['De séparer l’acte de vente de l’acte d’achat', 'De mesurer la valeur des biens', 'De conserver du pouvoir d’achat', 'De calculer l’inflation'], 0, 'On vend d’abord, on achète ensuite, à un autre partenaire.'],
            ['Les agrégats monétaires sont classés par liquidité décroissante.', ['Vrai', 'Faux'], 0, 'De M1, la plus liquide, à M3, qui l’englobe et contient des placements moins disponibles.'],
            ['Qu’appelle-t-on préférence pour la liquidité chez Keynes ?', ['Le désir de conserver de la monnaie plutôt que de la placer', 'La préférence pour les biens durables', 'Le choix du crédit plutôt que de l’épargne', 'Le refus des billets au profit des pièces'], 0, 'Elle repose sur des motifs de transaction, de précaution et de spéculation.'],
          ],
        },
        {
          titre: 'Comment la monnaie est-elle créée ?',
          axe: 'La monnaie et le financement',
          lecon: {
            titre: 'Les crédits font les dépôts',
            cours: `La monnaie **n’est pas prélevée sur un stock existant** : elle est **créée** par un **jeu d’écritures**, chaque fois qu’une banque commerciale accorde un crédit.

## Le mécanisme
| Ce que fait la banque | Où |
| Elle inscrit une **créance** | À son **actif** |
| Elle **crédite le compte** du client | À son **passif** |

> Cette somme **n’existait nulle part une seconde plus tôt**. **Les crédits font les dépôts**, et non l’inverse.

> Symétriquement, **tout remboursement détruit de la monnaie**.

## Les trois sources
| Source | Sa part |
| Le **crédit à l’économie** | **De loin la principale** |
| L’achat de **devises** contre euros | Secondaire |
| Le financement du **Trésor public** | Encadré |

## Les limites
| Limite | Ce qu’elle impose |
| Les **fuites** | Une partie des sommes prêtées **quitte la banque** — retraits en billets, virements — et doit être couverte en **monnaie centrale** |
| Les **réserves obligatoires** | Déposées à la banque centrale |
| Les **ratios prudentiels** — Bâle III | Des **fonds propres proportionnés aux risques** |
| La **demande de crédit** | Une banque **ne prête pas si personne n’emprunte** — ni si l’emprunteur **ne semble pas solvable** |

## La banque centrale
> Elle **ne crée pas la monnaie que nous utilisons au quotidien** : elle crée la **monnaie centrale**, **celle qui circule entre les banques**.

| Son instrument | Ce qu’il fait |
| Le **taux directeur** | Le coût du **refinancement** des banques |
| Les **réserves obligatoires** | Elles bornent la création |
| L’**open market** et, depuis 2015, les **achats massifs de titres** | Ils pilotent les taux longs |

> Son objectif principal, dans la zone euro : la **stabilité des prix** — une inflation **proche de 2 %** à moyen terme.`,
          },
          questions: [
            ['Qui crée l’essentiel de la monnaie en circulation ?', ['Les banques commerciales, en accordant des crédits', 'La banque centrale, en imprimant des billets', 'L’État, par l’impôt', 'Les entreprises, en émettant des actions'], 0, 'La monnaie scripturale naît de l’écriture qui accompagne le crédit.'],
            ['Le remboursement d’un crédit détruit de la monnaie.', ['Vrai', 'Faux'], 0, 'L’écriture s’annule : la création dure le temps du prêt.'],
            ['Que signifie « les crédits font les dépôts » ?', ['Le crédit crée le dépôt, et non l’inverse', 'Les dépôts des clients financent les crédits', 'Les banques prêtent l’épargne collectée', 'La banque centrale finance chaque prêt'], 0, 'La banque n’a pas besoin d’un dépôt préalable pour prêter.'],
            ['Qu’est-ce que la monnaie centrale ?', ['La monnaie qui circule entre les banques et la banque centrale', 'Les pièces et billets détenus par les ménages', 'Le solde des comptes courants', 'L’épargne réglementée'], 0, 'Elle sert aux règlements interbancaires et couvre les fuites.'],
            ['Quel est l’objectif principal de la Banque centrale européenne ?', ['La stabilité des prix', 'Le plein emploi', 'L’équilibre du budget de l’État', 'La croissance du PIB'], 0, 'Une inflation proche de 2 % à moyen terme, inscrite dans les traités.'],
            ['Les banques peuvent créer de la monnaie sans aucune limite.', ['Vrai', 'Faux'], 1, 'Fuites, réserves obligatoires, ratios prudentiels et demande de crédit les bornent.'],
            ['Qu’est-ce que le taux directeur ?', ['Le taux auquel les banques se refinancent auprès de la banque centrale', 'Le taux moyen des crédits immobiliers', 'Le taux d’inflation cible', 'Le taux de rendement des obligations d’État'], 0, 'Il se répercute sur tous les taux de l’économie.'],
            ['L’achat massif de titres par la banque centrale augmente la quantité de monnaie centrale.', ['Vrai', 'Faux'], 0, 'Elle règle ces achats en créant de la monnaie centrale.'],
          ],
        },

        // ---- Chapitre 3 : la socialisation ----------------------------------
        {
          titre: 'Comment la socialisation de l’enfant s’effectue-t-elle ?',
          axe: 'Comment la socialisation contribue-t-elle à expliquer les différences de comportement des individus ?',
          lecon: {
            titre: 'Devenir un être social',
            cours: `La **socialisation** est le processus par lequel un individu **apprend et intériorise** les **normes**, les **valeurs** et les **rôles** de sa société.

> **On ne naît pas social : on le devient.**

## Trois notions à distinguer
| Notion | Sa définition | L’exemple |
| Une **valeur** | Un **idéal partagé** | L’égalité, la réussite, la solidarité |
| Une **norme** | La **règle concrète** qui traduit une valeur | Ne pas couper la parole, respecter la file |
| Un **rôle** | Le **comportement attendu** de celui qui occupe une position | L’élève, le parent, le médecin |

## Les instances de socialisation
| Instance | Ce qu’elle transmet |
| La **famille** | La **première**, la plus **durable** : le langage, les manières de table, le rapport au corps et à l’argent |
| L’**école** | Des savoirs — **et des dispositions** : ponctualité, effort, respect de la **règle impersonnelle** |
| Les **pairs** | Décisifs à l’**adolescence** : ils imposent leurs codes, **parfois contre ceux de la famille** |
| Les **médias** et réseaux sociaux | Des **modèles** |

## Comment on socialise
| Mode | Ce qu’il suppose |
| L’**inculcation** explicite | On énonce la règle, on **récompense**, on **sanctionne** |
| L’**imitation** | L’enfant **reproduit** ce qu’il observe |
| L’**interaction** | L’enfant **n’est pas passif** : il **négocie, résiste, réinterprète** |

> **Bourdieu** appelle **habitus** l’ensemble des **dispositions durables** ainsi **incorporées** : elles orientent goûts, gestes et choix **sans que l’individu ait à y penser**.

## Une socialisation différenciée
> Elle **ne produit pas des individus identiques** : selon le **milieu social** et le **genre**, **les mêmes instances transmettent des contenus différents**.`,
          },
          questions: [
            ['Qu’est-ce que la socialisation ?', ['L’apprentissage et l’intériorisation des normes et valeurs d’une société', 'Le fait de se faire des amis', 'L’inscription à une association', 'L’adaptation au marché du travail'], 0, 'C’est le processus qui fait de l’individu un être social.'],
            ['Quelle est la différence entre une valeur et une norme ?', ['La valeur est un idéal, la norme la règle concrète qui la traduit', 'La valeur est juridique, la norme morale', 'La norme est un idéal, la valeur une règle', 'Il n’y en a aucune'], 0, 'L’égalité est une valeur ; la file d’attente, une norme qui la traduit.'],
            ['La famille est la première instance de socialisation.', ['Vrai', 'Faux'], 0, 'Elle est la plus précoce et la plus durable, ce qui lui donne un poids particulier.'],
            ['Qu’est-ce que l’habitus chez Bourdieu ?', ['Un ensemble de dispositions durables incorporées par la socialisation', 'Une habitude passagère', 'Le statut juridique d’un individu', 'Un rôle professionnel'], 0, 'Il oriente goûts et conduites sans passer par le calcul conscient.'],
            ['L’enfant est passif dans le processus de socialisation.', ['Vrai', 'Faux'], 1, 'Il négocie, résiste et réinterprète ce qui lui est transmis.'],
            ['Qu’est-ce qu’un rôle social ?', ['Le comportement attendu de celui qui occupe une position sociale', 'Un métier salarié', 'Une valeur partagée', 'Une sanction pénale'], 0, 'Le rôle est la face vécue du statut.'],
            ['Quelle instance devient particulièrement influente à l’adolescence ?', ['Le groupe de pairs', 'La famille', 'L’entreprise', 'Le syndicat'], 0, 'Ses codes entrent parfois en concurrence avec ceux de la famille.'],
            ['La socialisation transmet les mêmes contenus quel que soit le milieu social.', ['Vrai', 'Faux'], 1, 'Elle est différenciée selon le milieu et le genre : c’est ce qui explique les écarts de comportement.'],
          ],
        },
        {
          titre: 'De la socialisation primaire à la socialisation secondaire',
          axe: 'Comment la socialisation contribue-t-elle à expliquer les différences de comportement des individus ?',
          lecon: {
            titre: 'Ce que l’enfance dépose, ce que la vie adulte remanie',
            cours: `La socialisation **ne s’arrête pas à l’enfance** — mais elle **ne s’y poursuit pas non plus à l’identique**.

## Les deux socialisations
| | **Primaire** | **Secondaire** |
| Quand | Enfance et adolescence | Âge adulte |
| Son étendue | **Globale** : du langage aux émotions | **Spécialisée** : un domaine |
| Son ressort | **Affective** : elle passe par l’**attachement** | Plus **négociée** |
| L’individu | Il **subit** davantage | Il est plus **actif** : **il choisit souvent le groupe qui va le socialiser** |
| Sa force | **Durable** : appris comme **allant de soi** | Elle **se dépose dessus** |

Les univers de la secondaire : le **travail**, le **couple**, la **parentalité**, un parti, une équipe, une communauté religieuse.

## Continuité ou rupture
| Cas | Ce qui se passe |
| Le plus souvent | La seconde **prolonge** la première : on épouse dans son milieu, on choisit un métier compatible |
| Parfois | Elle la **contredit** : mobilité sociale, **conversion**, **institution totale** — d’où une **resocialisation** |
| Le terme | **Berger et Luckmann** parlent d’**alternation** : la nouvelle socialisation doit **d’abord démolir l’ancienne** |

## La socialisation anticipatrice
**Merton** l’a montrée : on peut **intérioriser les normes d’un groupe auquel on n’appartient pas encore**, **dans l’espoir de le rejoindre**.

| Ce qu’elle facilite | Ce qu’elle risque |
| La **mobilité** | Elle laisse **en porte-à-faux** celui qui **n’est finalement pas admis** |

> La socialisation secondaire **ne remplace pas la primaire** : elle **se dépose dessus** — et les **conflits entre les deux** sont **le lot ordinaire des trajectoires improbables**.`,
          },
          questions: [
            ['Quels sont les trois traits de la socialisation primaire ?', ['Globale, affective et durable', 'Courte, choisie et spécialisée', 'Professionnelle, volontaire et réversible', 'Scolaire, obligatoire et publique'], 0, 'C’est ce qui lui donne son empreinte particulière.'],
            ['La socialisation secondaire est plus spécialisée que la primaire.', ['Vrai', 'Faux'], 0, 'Elle porte sur un univers particulier : le travail, le couple, une association.'],
            ['Qu’est-ce que la socialisation anticipatrice ?', ['L’adoption des normes d’un groupe qu’on espère rejoindre', 'La socialisation avant la naissance', 'La socialisation par les parents uniquement', 'L’apprentissage accéléré d’un métier'], 0, 'Merton l’a mise en évidence : elle prépare et facilite la mobilité.'],
            ['Qui a proposé la notion d’alternation ?', ['Berger et Luckmann', 'Bourdieu et Passeron', 'Durkheim', 'Merton'], 0, 'Elle désigne une resocialisation qui rompt avec la socialisation primaire.'],
            ['La socialisation secondaire efface systématiquement la socialisation primaire.', ['Vrai', 'Faux'], 1, 'Elle s’y superpose ; les deux peuvent entrer en conflit durablement.'],
            ['Dans la socialisation secondaire, l’individu est…', ['plus actif dans le choix des groupes qui le socialisent', 'entièrement passif', 'soumis aux mêmes liens affectifs que dans l’enfance', 'coupé de toute instance'], 0, 'On choisit son métier, son couple, son association — pas sa famille d’origine.'],
            ['Une trajectoire de mobilité sociale ascendante peut créer une tension entre les deux socialisations.', ['Vrai', 'Faux'], 0, 'Les dispositions incorporées dans l’enfance se heurtent aux codes du nouveau milieu.'],
            ['Pourquoi la socialisation primaire est-elle si durable ?', ['Parce qu’elle est apprise très tôt et vécue comme allant de soi', 'Parce qu’elle est écrite dans la loi', 'Parce qu’elle est répétée à l’âge adulte', 'Parce qu’elle est volontaire'], 0, 'Elle s’incorpore sans être perçue comme un apprentissage.'],
          ],
        },
        {
          titre: 'Socialisation différentielle et trajectoires improbables',
          axe: 'Comment la socialisation contribue-t-elle à expliquer les différences de comportement des individus ?',
          lecon: {
            titre: 'Le genre, le milieu social, et les exceptions',
            cours: `Si la socialisation explique les comportements, c’est parce qu’elle **diffère** selon la position sociale. **Deux différenciations** au programme.

## La socialisation genrée
Dès la naissance, filles et garçons **ne reçoivent pas le même traitement**.

| Différence | Le détail |
| Les **couleurs** et les **jouets** | Un univers séparé |
| Le **vocabulaire** | Un même comportement dit « **vive** » ou « **turbulent** » |
| La **tolérance à la prise de risque** | Inégale |
| Les **encouragements scolaires** | Distincts |

> Ces différences **n’ont rien de naturel** : elles produisent des **dispositions** qui pèsent sur l’**orientation**, le **choix du métier**, le **partage des tâches domestiques**.

> **Les filles réussissent mieux à l’école** que les garçons **et s’orientent pourtant moins** vers les filières scientifiques les mieux rémunérées : **c’est la socialisation, non l’aptitude, qui explique l’écart**.

## La socialisation de classe
| Ce qui varie avec le milieu | Ce que cela produit |
| Le rapport au **langage** | Élaboré et **abstrait**, ou **pratique** et contextuel |
| Le rapport au **temps** et à l’avenir | Il rend le **calcul scolaire** plus ou moins évident |
| Les **pratiques culturelles** | Elles **rapprochent ou éloignent** de la culture valorisée par l’école |

> C’est ce que Bourdieu appelle le **capital culturel** : un **héritage invisible**, **que l’école récompense sans l’avoir transmis**.

## Les trajectoires improbables
| Ce sur quoi elles reposent souvent | L’exemple |
| Une **configuration familiale** particulière | Une mère qui **investit massivement la scolarité**, un frère aîné qui **ouvre la voie** |
| Une **rencontre** décisive | Un enseignant |
| Une **socialisation anticipatrice** réussie | Les codes adoptés à temps |

> Elles **ne réfutent pas la sociologie** : elles rappellent que la socialisation produit des **probabilités**, **non des destins**.

> **Un déterminisme statistique n’est pas une fatalité individuelle.**`,
          },
          questions: [
            ['Qu’est-ce que la socialisation genrée ?', ['La transmission de normes et de rôles différents selon le sexe', 'L’apprentissage de la biologie à l’école', 'Le choix d’un métier par les parents', 'La séparation des classes filles et garçons'], 0, 'Elle commence dès la naissance et produit des dispositions durables.'],
            ['Les écarts d’orientation scolaire entre filles et garçons s’expliquent d’abord par des différences d’aptitudes.', ['Vrai', 'Faux'], 1, 'Les filles réussissent mieux à l’école : c’est la socialisation, non l’aptitude, qui pèse.'],
            ['Qu’est-ce que le capital culturel chez Bourdieu ?', ['L’ensemble des ressources culturelles héritées et incorporées', 'Le budget culturel d’un ménage', 'Le nombre de diplômes obtenus par un individu', 'La subvention publique à la culture'], 0, 'L’école le récompense sans l’avoir transmis, ce qui avantage certains milieux.'],
            ['Une trajectoire improbable prouve que la socialisation n’a aucun effet.', ['Vrai', 'Faux'], 1, 'Elle rappelle seulement que la socialisation produit des probabilités, pas des destins.'],
            ['Quel élément revient souvent dans les trajectoires improbables ?', ['Un fort investissement scolaire de la famille ou une rencontre décisive', 'Un héritage financier important', 'Un déménagement à l’étranger', 'Un changement de nom'], 0, 'La configuration familiale et les rencontres jouent un rôle documenté.'],
            ['Le rapport au langage transmis dans la famille varie selon le milieu social.', ['Vrai', 'Faux'], 0, 'Et l’école valorise le registre le plus proche de celui des milieux favorisés.'],
            ['Que signifie « déterminisme statistique » en sociologie ?', ['Une position sociale rend certains comportements plus probables sans les imposer', 'Chaque individu est entièrement déterminé', 'Les statistiques prédisent l’avenir individuel', 'Les comportements sont totalement libres'], 0, 'C’est la distinction entre probabilité collective et destin individuel.'],
            ['Décrire un même comportement d’enfant comme « vive » ou « turbulent » selon le sexe relève de la socialisation genrée.', ['Vrai', 'Faux'], 0, 'Le vocabulaire employé oriente l’estime de soi et les conduites attendues.'],
          ],
        },

        // ---- Chapitre 4 : les liens sociaux ---------------------------------
        {
          titre: 'Comment les individus s’associent-ils pour constituer des groupes sociaux ?',
          axe: 'Comment se construisent et évoluent les liens sociaux ?',
          lecon: {
            titre: 'Groupe social, agrégat, catégorie statistique',
            cours: `Toute réunion d’individus **n’est pas un groupe social**. **Trois notions** à ne **jamais confondre** en devoir.

| Notion | Ce qu’elle suppose | L’exemple |
| Le **groupe social** | Des **interactions**, un **sentiment d’appartenance**, une **reconnaissance par les autres** | Une famille, une équipe, une association |
| L’**agrégat physique** | Le **même endroit**, **sans lien** | Les voyageurs d’un wagon, une file d’attente |
| La **catégorie statistique** | Un **caractère mesurable** commun, **sans se connaître** | Les gauchers, les 15-24 ans, les cadres |

> Une **catégorie statistique peut devenir un groupe social** si ses membres **prennent conscience de ce qu’ils ont en commun** et **s’organisent** : c’est le passage marxiste de la « **classe en soi** » à la « **classe pour soi** ».

## Primaire ou secondaire — Cooley
| | **Groupe primaire** | **Groupe secondaire** |
| Sa taille | **Restreint** | Plus **vaste** |
| Ses relations | **Directes, durables, affectives** | **Formelles et fonctionnelles** |
| Son but | Aucun en particulier | **Orienté vers un but** |
| L’exemple | Famille, bande d’amis | Entreprise, syndicat, parti |

## Formel ou informel
| | **Formel** | **Informel** |
| Ce qu’il a | Statuts, **règles écrites**, hiérarchie explicite | Des **affinités** et de l’**implicite** |

> **Les deux coexistent dans la même organisation** : les « **bandes** » d’un atelier sont informelles, **l’organigramme est formel**.

## Pourquoi on s’associe
| Motif | Ce qu’il apporte |
| L’**intérêt** | Des **ressources** qu’on n’obtiendrait pas seul |
| L’**affinité** — l’**homophilie** | **On s’associe à ceux qui nous ressemblent** : âge, milieu, goûts |
| L’**héritage** | **On ne choisit ni sa famille ni son quartier d’enfance** |`,
          },
          questions: [
            ['Quelles sont les trois conditions d’un groupe social ?', ['Des interactions, un sentiment d’appartenance et une reconnaissance extérieure', 'Un lieu, une heure et un but commun', 'Un statut juridique, un budget et un président', 'Un âge, un sexe et une profession communs'], 0, 'Sans interactions ni conscience d’appartenance, il n’y a pas de groupe.'],
            ['Les voyageurs d’un même wagon forment un groupe social.', ['Vrai', 'Faux'], 1, 'C’est un agrégat physique : proximité sans interaction ni appartenance.'],
            ['Qu’est-ce qu’une catégorie statistique ?', ['Un ensemble d’individus partageant un caractère mesurable sans se connaître', 'Un groupe organisé autour d’un objectif', 'Une classe sociale mobilisée', 'Une association déclarée'], 0, 'Les 15-24 ans en sont une : ils ne forment pas un groupe pour autant.'],
            ['Qui distingue groupes primaires et groupes secondaires ?', ['Cooley', 'Durkheim', 'Weber', 'Granovetter'], 0, 'Le primaire est restreint et affectif, le secondaire vaste et fonctionnel.'],
            ['Un groupe informel n’existe pas dans une entreprise dotée d’un organigramme.', ['Vrai', 'Faux'], 1, 'Les deux coexistent : les affinités doublent toujours la structure officielle.'],
            ['Qu’est-ce que l’homophilie ?', ['La tendance à s’associer à ceux qui nous ressemblent', 'L’attrait pour la nouveauté', 'Le rejet des groupes extérieurs', 'La préférence pour les groupes nombreux'], 0, 'Elle explique une grande part de la composition des réseaux personnels.'],
            ['Le passage de la classe en soi à la classe pour soi décrit…', ['la prise de conscience collective qui transforme une catégorie en groupe', 'la montée dans la hiérarchie sociale', 'la disparition des classes sociales', 'le changement de catégorie professionnelle'], 0, 'C’est l’analyse marxiste de la mobilisation.'],
            ['Une famille est un groupe primaire.', ['Vrai', 'Faux'], 0, 'Relations directes, durables et affectives : la définition même du groupe primaire.'],
          ],
        },
        {
          titre: 'Groupes d’appartenance, groupes de référence et sociabilité',
          axe: 'Comment se construisent et évoluent les liens sociaux ?',
          lecon: {
            titre: 'Celui auquel on appartient, celui auquel on aspire',
            cours: `Un individu **appartient à plusieurs groupes à la fois** — et **n’adopte pas forcément les normes de ceux auxquels il appartient**.

## Appartenance et référence
| | **Groupe d’appartenance** | **Groupe de référence** (Merton) |
| Ce qu’il est | Celui dont on **fait effectivement partie** | Celui dont on **emprunte les normes pour se juger** |
| La condition | L’appartenance | **Qu’on en fasse partie ou non** |

| Quand les deux diffèrent | L’exemple |
| L’individu vit un **décalage** | L’étudiant **boursier** qui adopte les codes des grandes écoles |
| — | L’adolescent qui prend pour modèle **un groupe qu’il ne fréquente pas encore** |

> C’est le terrain de la **socialisation anticipatrice**.

## Les quatre liens sociaux
| Lien | Ce qu’il recouvre |
| De **filiation** | La famille |
| De **participation élective** | Les amis, le couple, les associations **choisies** |
| De **participation organique** | Le **travail**, la division du travail |
| De **citoyenneté** | L’appartenance **politique** |

> Ils **n’ont pas disparu** : ils se sont **transformés** — plus **électifs** (on choisit davantage), plus **réversibles** (ils se défont plus facilement), plus **nombreux** mais souvent **moins intenses**.

## La sociabilité
L’ensemble des relations **effectivement entretenues**. Elle est **socialement inégale**.

| Milieu | La forme de sa sociabilité |
| **Populaire** | De **voisinage** et de **famille** |
| **Favorisé** | **Associative et amicale**, **plus étendue géographiquement** |

Elle **croît avec le diplôme et le revenu** — mais c’est sa **forme** qui change le plus.

> L’**isolement relationnel** touche d’abord les **personnes âgées**, les **chômeurs de longue durée** et les personnes en **précarité** : **le lien social se défait avec l’emploi**.`,
          },
          questions: [
            ['Qu’est-ce qu’un groupe de référence ?', ['Un groupe dont on adopte les normes, qu’on en fasse partie ou non', 'Le groupe où l’on est né', 'Le groupe le plus nombreux d’une société', 'Un groupe reconnu par la loi'], 0, 'Merton l’a distingué du groupe d’appartenance.'],
            ['Un individu adopte toujours les normes de son groupe d’appartenance.', ['Vrai', 'Faux'], 1, 'Il peut se référer à un autre groupe — c’est la socialisation anticipatrice.'],
            ['Quel lien social correspond à la division du travail ?', ['Le lien de participation organique', 'Le lien de filiation', 'Le lien de participation élective', 'Le lien de citoyenneté'], 0, 'Il naît de l’interdépendance entre les fonctions productives.'],
            ['Les liens sociaux contemporains sont plus électifs et plus réversibles qu’autrefois.', ['Vrai', 'Faux'], 0, 'On les choisit davantage, et ils se défont plus facilement.'],
            ['Comment varie la sociabilité selon le milieu social ?', ['Elle est plus étendue et plus associative dans les milieux favorisés', 'Elle est identique dans tous les milieux', 'Elle est plus forte dans les milieux populaires uniquement', 'Elle ne dépend que de l’âge'], 0, 'Le milieu change à la fois l’intensité et la forme des relations.'],
            ['Quel lien social relève de la filiation ?', ['Le lien familial et intergénérationnel', 'Le lien professionnel', 'Le lien associatif', 'Le lien politique'], 0, 'C’est le premier lien, hérité et non choisi.'],
            ['La perte d’emploi fragilise le lien social au-delà de la perte de revenu.', ['Vrai', 'Faux'], 0, 'Le travail est aussi un lieu de sociabilité et de reconnaissance.'],
            ['Que désigne la sociabilité en sociologie ?', ['L’ensemble des relations qu’un individu entretient effectivement', 'Le caractère aimable d’une personne', 'Le nombre d’associations d’un territoire', 'La politesse apprise dans la famille'], 0, 'Elle se mesure par les contacts, leur fréquence et leur nature.'],
          ],
        },
        {
          titre: 'Comment les réseaux sociaux fonctionnent-ils ?',
          axe: 'Comment se construisent et évoluent les liens sociaux ?',
          lecon: {
            titre: 'La force des liens faibles',
            cours: `Un **réseau social** est l’ensemble des relations qui relient un individu à d’autres.

> Il ne s’agit **pas d’abord des plateformes numériques** : **la sociologie des réseaux est antérieure à leur apparition**.

## Liens forts, liens faibles — Granovetter, 1973
| | **Liens forts** | **Liens faibles** |
| Qui | Famille proche, amis intimes | Connaissances, anciens collègues, **amis d’amis** |
| Leur nombre | **Peu nombreux** | **Nombreux** |
| Leur ton | **Chaleureux** | **Distants** |
| Leur information | **Redondante** : ces personnes **se connaissent entre elles** | Ils **relient des mondes séparés** |

> La découverte contre-intuitive : **la plupart des emplois se trouvent par des liens faibles**. **L’information neuve vient de ceux qu’on connaît mal.**

## Le capital social
L’ensemble des **ressources auxquelles un individu accède grâce à son réseau**.

| Sa propriété | Le détail |
| Il est **inégalement réparti** | Les **cadres** ont des réseaux **plus étendus, plus diversifiés, mieux placés** que les ouvriers |
| Il se **convertit** | Un réseau peut valoir **un emploi, un stage, un logement** |

## Ce que les plateformes changent
| Ce qu’elles apportent | Ce qu’elles n’abolissent pas |
| Elles **élargissent le nombre de liens faibles** | L’**homophilie** y règne **autant qu’ailleurs** |
| Elles **abaissent le coût de leur entretien** | Les **algorithmes de recommandation renforcent l’entre-soi** |
| — | Elles créent de **nouvelles asymétries** : la **visibilité y est très concentrée** |

## Réseau et action collective
Un réseau **dense** **facilite la mobilisation** : il **fait circuler l’information**, exerce une **pression au conformisme** et **réduit le coût de l’engagement**.

> C’est l’un des mécanismes qui **limite le comportement de passager clandestin** décrit par **Olson**.`,
          },
          questions: [
            ['Qui a mis en évidence la force des liens faibles ?', ['Mark Granovetter', 'Robert Merton', 'Émile Durkheim', 'Charles Cooley'], 0, 'Son article de 1973 est devenu un classique de la sociologie des réseaux.'],
            ['Pourquoi les liens faibles sont-ils précieux pour trouver un emploi ?', ['Parce qu’ils apportent une information nouvelle, venue d’un autre milieu', 'Parce qu’ils sont plus affectifs', 'Parce qu’ils sont moins nombreux', 'Parce qu’ils garantissent une recommandation'], 0, 'Les liens forts partagent la même information que nous : ils sont redondants.'],
            ['Les liens forts relient des mondes sociaux séparés.', ['Vrai', 'Faux'], 1, 'Ce sont les liens FAIBLES qui jouent ce rôle de pont.'],
            ['Qu’est-ce que le capital social ?', ['Les ressources accessibles grâce à son réseau de relations', 'Le capital financier d’une entreprise', 'Le patrimoine immobilier d’un ménage', 'Le niveau de diplôme atteint'], 0, 'Il est inégalement réparti et convertible en avantages concrets.'],
            ['Le capital social est également réparti entre les catégories sociales.', ['Vrai', 'Faux'], 1, 'Les cadres disposent de réseaux plus étendus, plus diversifiés et mieux placés.'],
            ['Les plateformes numériques suppriment l’homophilie dans les relations.', ['Vrai', 'Faux'], 1, 'Elles la reproduisent, et les algorithmes de recommandation la renforcent souvent.'],
            ['Comment un réseau dense favorise-t-il l’action collective ?', ['Il diffuse l’information et exerce une pression au conformisme', 'Il augmente le coût de l’engagement', 'Il rend les individus anonymes', 'Il supprime les intérêts divergents'], 0, 'C’est un frein au comportement de passager clandestin décrit par Olson.'],
            ['Un réseau social au sens sociologique se limite aux plateformes numériques.', ['Vrai', 'Faux'], 1, 'La notion est bien antérieure : elle désigne l’ensemble des relations d’un individu.'],
          ],
        },

        // ---- Chapitre 5 : la déviance ---------------------------------------
        {
          titre: 'Comment le contrôle social s’exerce-t-il aujourd’hui ?',
          axe: 'Quels sont les processus sociaux qui contribuent à la déviance ?',
          lecon: {
            titre: 'Contrôle formel, contrôle informel',
            cours: `Le **contrôle social** est l’ensemble des moyens par lesquels une société obtient de ses membres qu’ils **respectent ses normes**. **Il ne se réduit pas à la police.**

## Deux formes
| | **Formel** | **Informel** |
| Qui l’exerce | Des **institutions spécialisées** : police, justice, administration, inspection du travail | L’**entourage** : famille, voisins, collègues, pairs |
| Comment | Selon des **règles écrites** | Par le **regard**, la **moquerie**, la réprobation, l’**exclusion** |
| Sa sanction | **Codifiée** | **Diffuse** — mais **souvent plus efficace** |

> Le contrôle **le plus puissant** est celui qu’on **exerce sur soi-même** : les **normes intériorisées** lors de la socialisation **évitent la plupart des transgressions sans qu’aucune sanction n’intervienne**.

## Une évolution en deux temps
| Mouvement | Ce qui se passe |
| **Recul** du contrôle informel de proximité | L’**exode rural**, l’**anonymat urbain** et la **mobilité** ont affaibli le contrôle du village et du voisinage |
| **Montée** du contrôle formel et technologique | **Vidéosurveillance**, **traçage numérique**, contrôle automatisé de la vitesse, données de connexion |

> Le contrôle devient **permanent, distant et invisible**.

## Le débat
> Jusqu’où une société peut-elle **surveiller sans porter atteinte aux libertés** ?

| Encadrement | Son échelle |
| La **CNIL** | La France |
| Le **RGPD** | L’Europe |

## Contrôle et déviance
> Le contrôle social ne se contente pas d’**empêcher** la déviance : **il la définit**.

Une **même conduite** est déviante ou non **selon la société, l’époque et le groupe qui juge** : le **tabac**, le **duel**, l’**homosexualité** ont **changé de statut normatif**.`,
          },
          questions: [
            ['Qu’est-ce que le contrôle social informel ?', ['Le contrôle exercé par l’entourage au moyen de sanctions diffuses', 'Le contrôle exercé par la police', 'Le contrôle des comptes d’une entreprise', 'La surveillance vidéo des espaces publics'], 0, 'Regard, moquerie, réprobation : la sanction n’est pas codifiée.'],
            ['Le contrôle social se réduit à l’action de la police et de la justice.', ['Vrai', 'Faux'], 1, 'Le contrôle informel de l’entourage en est une part essentielle.'],
            ['Quel contrôle a reculé avec l’urbanisation et la mobilité ?', ['Le contrôle informel de proximité', 'Le contrôle judiciaire', 'Le contrôle technologique', 'Le contrôle administratif'], 0, 'L’anonymat urbain a affaibli la surveillance du voisinage.'],
            ['Quelle autorité encadre l’usage des données personnelles en France ?', ['La CNIL', 'L’INSEE', 'Le Défenseur des droits', 'L’Autorité de la concurrence'], 0, 'Elle veille au respect du RGPD et des libertés informatiques.'],
            ['Une même conduite peut être déviante dans une société et normale dans une autre.', ['Vrai', 'Faux'], 0, 'La déviance n’est pas une propriété de l’acte, mais du regard porté sur lui.'],
            ['Quelle est la forme la plus efficace de contrôle social selon les sociologues ?', ['L’intériorisation des normes par la socialisation', 'L’amende', 'La prison', 'La vidéosurveillance'], 0, 'Elle évite la transgression sans qu’aucune sanction n’ait à intervenir.'],
            ['Le contrôle social formel repose sur des sanctions codifiées.', ['Vrai', 'Faux'], 0, 'Amende, peine, sanction disciplinaire : elles sont écrites et prévisibles.'],
            ['Que change le contrôle technologique par rapport au contrôle traditionnel ?', ['Il est permanent, distant et souvent invisible', 'Il est plus affectif', 'Il concerne uniquement les entreprises', 'Il supprime le besoin de justice'], 0, 'D’où le débat sur l’équilibre entre sécurité et libertés.'],
          ],
        },
        {
          titre: 'Quels sont les processus sociaux qui conduisent à la déviance ?',
          axe: 'Quels sont les processus sociaux qui contribuent à la déviance ?',
          lecon: {
            titre: 'Anomie, étiquetage, carrière déviante',
            cours: `Transgresser une norme sociale, ce n'est pas la même chose que transgresser la loi.

## Deux mots à ne pas confondre
| Le mot | Ce qu'il transgresse | Portée |
| **Déviance** | Une **norme sociale**, quelle qu'elle soit | Large |
| **Délinquance** | Une **norme juridique** pénalement sanctionnée | Étroite |

> Toute délinquance est déviante. L'inverse est faux.

## L'explication par l'anomie
| L'auteur | Sa thèse |
| **Durkheim** | L'**anomie** est l'affaiblissement des normes collectives : quand la société ne régule plus les aspirations, les conduites se dérèglent |
| **Merton** | La déviance naît de l'écart entre les **buts** valorisés (la réussite) et les **moyens légitimes** d'y accéder, inégalement distribués |

Les cinq adaptations de Merton :
1. **Conformité** — les buts et les moyens légitimes.
2. **Innovation** — le but, mais par des moyens illégitimes.
3. **Ritualisme** — les moyens sans le but.
4. **Évasion** — ni l'un ni l'autre.
5. **Rébellion** — d'autres buts et d'autres moyens.

## L'explication par l'étiquetage
Becker renverse la perspective : la déviance n'est pas une qualité de l'acte, mais le **produit de la réaction sociale**.

| L'étape de la carrière déviante | Ce qui se passe |
| La transgression initiale | Un acte, souvent banal |
| La **réaction sociale** | Le groupe étiquette |
| La **stigmatisation** | Les portes de la vie ordinaire se ferment |
| L'entrée dans un groupe déviant | Il fournit à son tour des normes |

> « Le déviant est celui auquel l'étiquette a été appliquée avec succès. » L'étiquette produit ce qu'elle prétend décrire : c'est une **prophétie auto-réalisatrice**.

## Ce que cela change
| L'approche | Ce qu'elle explique | La politique qui en découle |
| **Merton** | Pourquoi certaines positions exposent à la transgression | Agir sur les inégalités d'accès aux moyens |
| **Becker** | Pourquoi le traitement social aggrave la transgression | Éviter la stigmatisation précoce des mineurs |

> Les deux ne s'opposent pas : elles décrivent deux moments différents.`,
          },
          questions: [
            ['Quelle est la différence entre déviance et délinquance ?', ['La délinquance transgresse une norme juridique, la déviance une norme sociale quelconque', 'Elles sont synonymes', 'La déviance est toujours pénalement sanctionnée', 'La délinquance concerne uniquement les mineurs'], 0, 'Toute délinquance est déviante, mais toute déviance n’est pas délinquante.'],
            ['Qu’appelle-t-on anomie chez Durkheim ?', ['L’affaiblissement des normes collectives régulant les conduites', 'L’absence de police', 'La pauvreté économique', 'Le refus de voter'], 0, 'La société ne parvient plus à réguler les aspirations individuelles.'],
            ['Selon Merton, la déviance naît d’un écart entre les buts valorisés et les moyens légitimes d’y accéder.', ['Vrai', 'Faux'], 0, 'C’est le cœur de sa typologie des cinq adaptations.'],
            ['Comment Merton nomme-t-il l’adaptation qui poursuit le but socialement valorisé par des moyens illégitimes ?', ['L’innovation', 'Le ritualisme', 'L’évasion', 'La rébellion'], 0, 'On garde le but — la réussite — mais on abandonne les moyens légitimes.'],
            ['Que soutient Becker avec la théorie de l’étiquetage ?', ['La déviance résulte de la réaction sociale qui désigne un individu comme déviant', 'La déviance est innée', 'La déviance vient de la pauvreté', 'La déviance disparaît avec l’éducation'], 0, 'Est déviant celui à qui l’étiquette a été appliquée avec succès.'],
            ['La carrière déviante décrit un processus en plusieurs étapes.', ['Vrai', 'Faux'], 0, 'Transgression, étiquetage, stigmatisation, entrée dans un groupe déviant.'],
            ['Qu’est-ce qu’une prophétie auto-réalisatrice appliquée à la déviance ?', ['L’étiquette de déviant finit par produire le comportement qu’elle désigne', 'Une prédiction statistique de la délinquance', 'Une peine prononcée par anticipation', 'Un contrôle policier préventif'], 0, 'La stigmatisation ferme les voies ordinaires et pousse vers le groupe déviant.'],
            ['Les théories de Merton et de Becker sont incompatibles.', ['Vrai', 'Faux'], 1, 'Elles éclairent deux moments différents : l’origine de la transgression et son traitement social.'],
          ],
        },
        {
          titre: 'Comment mesurer le niveau de la délinquance ?',
          axe: 'Quels sont les processus sociaux qui contribuent à la déviance ?',
          lecon: {
            titre: 'Statistiques policières, enquêtes de victimation, chiffre noir',
            cours: `Compter la délinquance est un problème de méthode avant d'être un débat politique.

## Trois sources, aucune parfaite
| La source | Ce qu'elle compte | Sa limite principale |
| **Statistiques administratives** | Les plaintes enregistrées, les condamnations | Seulement ce qui est **déclaré** |
| **Enquêtes de victimation** | Les atteintes **subies**, déclarées ou non | Reposent sur le **souvenir** de l'enquêté |
| **Chiffre noir** | L'écart entre les deux | Par définition, il ne se mesure pas directement |

## Les statistiques administratives
Elles dépendent d'autre chose que de la délinquance elle-même :
- de l'**activité des services** — plus de contrôles routiers, ce sont mécaniquement plus d'infractions constatées ;
- des **changements de législation** et de nomenclature, un acte pouvant entrer ou sortir du champ pénal ;
- de la **propension à porter plainte**, très variable selon l'infraction.

## Les enquêtes de victimation
On interroge un échantillon représentatif sur les atteintes subies : en France, l'enquête *Cadre de vie et sécurité*, puis *Vécu et ressenti en matière de sécurité*.

Elles font apparaître ce que les plaintes manquent, mais couvrent mal les infractions **sans victime directe** : trafic, corruption, fraude fiscale.

## Le chiffre noir
| L'infraction | Son chiffre noir | Pourquoi |
| Vol de voiture | Très **faible** | La plainte est exigée par l'assurance |
| Violences intrafamiliales et sexuelles | Très **élevé** | Honte, peur, dépendance à l'agresseur |

> Une hausse des plaintes peut signaler une hausse des violences… ou une meilleure prise de parole des victimes. Les deux lectures s'appuient sur le même chiffre.

## Un traitement pénal sélectif
La population carcérale est très majoritairement **jeune**, **masculine** et issue des **milieux populaires**. Ce constat mêle deux choses : des expositions différentes à la transgression, et un filtre pénal lui-même inégal — la délinquance en col blanc est moins détectée et moins sanctionnée.`,
          },
          questions: [
            ['Que mesure une enquête de victimation ?', ['Les atteintes subies déclarées par un échantillon de la population', 'Le nombre de condamnations prononcées', 'Le nombre de policiers en activité', 'Le sentiment d’insécurité uniquement'], 0, 'Elle recense aussi ce qui n’a jamais fait l’objet d’une plainte.'],
            ['Qu’est-ce que le chiffre noir de la délinquance ?', ['L’écart entre la délinquance réelle et la délinquance enregistrée', 'Le nombre de crimes non élucidés', 'Le coût économique de la délinquance', 'Le taux de récidive'], 0, 'Il varie énormément selon le type d’infraction.'],
            ['Une hausse des plaintes prouve toujours une hausse de la délinquance réelle.', ['Vrai', 'Faux'], 1, 'Elle peut traduire une meilleure propension des victimes à porter plainte.'],
            ['Pourquoi les statistiques policières dépendent-elles de l’activité des services ?', ['Parce que davantage de contrôles produisent mécaniquement plus d’infractions constatées', 'Parce que les policiers choisissent les chiffres publiés', 'Parce que les plaintes sont anonymes', 'Parce que la loi change chaque année'], 0, 'C’est particulièrement net pour les infractions révélées par l’action des services.'],
            ['Pour quelles infractions le chiffre noir est-il le plus faible ?', ['Les vols de voiture, dont la plainte est exigée par l’assurance', 'Les violences intrafamiliales', 'Les agressions sexuelles', 'La corruption'], 0, 'Le dépôt de plainte y est quasi systématique.'],
            ['Les enquêtes de victimation couvrent mal les infractions sans victime directe.', ['Vrai', 'Faux'], 0, 'Trafic de stupéfiants ou corruption échappent à l’interrogation des victimes.'],
            ['Que révèle la composition de la population carcérale ?', ['Un cumul d’expositions inégales à la transgression et d’un traitement pénal sélectif', 'La propension naturelle de certains groupes au crime', 'L’efficacité de la police', 'L’absence de biais dans la justice'], 0, 'La délinquance en col blanc est moins détectée et moins sanctionnée.'],
            ['Un changement de législation peut modifier les statistiques de la délinquance sans que les comportements changent.', ['Vrai', 'Faux'], 0, 'Un acte peut entrer dans le champ pénal ou en sortir d’une année sur l’autre.'],
          ],
        },

        // ---- Chapitre 6 : vote et opinion publique --------------------------
        {
          titre: 'Comment se forme et s’exprime l’opinion publique ?',
          axe: 'Vote et opinion publique',
          lecon: {
            titre: 'Des salons aux sondages',
            cours: `L'opinion publique n'est pas une donnée naturelle : c'est une construction historique.

## Une définition
L'**opinion publique** désigne l'ensemble des jugements partagés par une population sur les affaires communes.

## Une histoire
| L'époque | Le lieu de l'opinion |
| **XVIIIe siècle** | Salons, cafés, presse : l'**espace public** décrit par Habermas |
| **XIXe et XXe siècles** | Alphabétisation, presse de masse, puis radio et télévision |
| **Aujourd'hui** | Réseaux sociaux : chacun peut publier, mais la visibilité reste très inégale |

## Le sondage
Instrument dominant depuis Gallup, en 1936. Il repose sur un **échantillon représentatif**, construit le plus souvent par la **méthode des quotas**, et donne un résultat assorti d'une **marge d'erreur**.

| La limite | L'effet produit |
| La **formulation** de la question | Elle oriente la réponse |
| L'**ordre** des questions | Il crée des effets de contexte |
| Les **non-réponses** | Elles masquent l'absence d'opinion réelle |
| La **marge d'erreur** oubliée | Un écart minime est lu comme une différence |

> Bourdieu, en 1973 : « L'opinion publique n'existe pas » — non pour nier les opinions, mais pour contester trois postulats : que tout le monde a un avis sur tout, que toutes les opinions se valent, et qu'il existe un accord sur les questions qui méritent d'être posées.

## Sondage et démocratie : deux lectures
| La lecture | Son argument |
| Le sondage **éclaire** | Il donne la parole à ceux qu'on n'entend pas d'ordinaire |
| Le sondage **fabrique** | Il impose l'agenda et produit des effets sur le vote : effet *bandwagon*, vote utile |`,
          },
          questions: [
            ['Qu’est-ce que l’espace public au sens de Habermas ?', ['Un espace de discussion des affaires communes par des particuliers', 'Les rues et les places d’une ville', 'Les bâtiments appartenant à l’État', 'Les médias publics'], 0, 'Salons, cafés et presse en constituent la forme historique.'],
            ['L’opinion publique est une donnée naturelle, indépendante des instruments qui la mesurent.', ['Vrai', 'Faux'], 1, 'C’est une construction historique et sociale, façonnée par ses instruments.'],
            ['Sur quelle méthode repose le plus souvent la construction d’un échantillon de sondage ?', ['La méthode des quotas', 'Le recensement exhaustif', 'Le volontariat sur internet', 'Le tirage au sort des électeurs inscrits'], 0, 'On reproduit dans l’échantillon la structure de la population.'],
            ['Que critique Bourdieu en écrivant « l’opinion publique n’existe pas » ?', ['Les postulats implicites du sondage d’opinion', 'L’existence des débats politiques', 'Le suffrage universel', 'La liberté de la presse'], 0, 'Il conteste l’idée que chacun a un avis sur tout et que toutes les opinions se valent.'],
            ['La formulation d’une question de sondage peut modifier le résultat obtenu.', ['Vrai', 'Faux'], 0, 'C’est un des biais les mieux documentés, avec l’ordre des questions.'],
            ['Qu’est-ce que la marge d’erreur d’un sondage ?', ['L’intervalle dans lequel se situe probablement la valeur réelle', 'Le nombre de personnes n’ayant pas répondu', 'Le taux de refus de l’enquête', 'L’écart entre deux instituts'], 0, 'Un écart inférieur à cette marge ne peut pas être interprété comme une différence réelle.'],
            ['Qu’appelle-t-on effet bandwagon ?', ['Le ralliement d’électeurs au candidat annoncé gagnant', 'Le refus de répondre aux sondages', 'La sous-estimation des petits partis', 'L’abstention des jeunes'], 0, 'Le sondage agit alors sur le comportement qu’il prétendait seulement mesurer.'],
            ['Les réseaux sociaux donnent à chacun une visibilité équivalente dans le débat public.', ['Vrai', 'Faux'], 1, 'La visibilité y est très concentrée, sur quelques comptes et quelques contenus.'],
          ],
        },
        {
          titre: 'Voter : une affaire individuelle ou collective ?',
          axe: 'Vote et opinion publique',
          lecon: {
            titre: 'Variables lourdes, vote sur enjeux, abstention',
            cours: `Le vote est un acte individuel et secret, mais il obéit à des régularités sociales mesurées depuis les années 1940.

## Les variables lourdes
| La variable | Ce qu'elle recouvre |
| L'**appartenance de classe** | Profession, diplôme, patrimoine |
| La **religion** | La pratique régulière reste l'une des plus prédictives |
| Le **lieu de résidence** | Son effet s'est renforcé avec la géographie sociale |

L'**âge**, le **genre** et la **socialisation politique familiale** complètent le tableau.

> Lazarsfeld montrait dès 1944 que le vote se prédisait mieux par ces variables que par les campagnes elles-mêmes.

## Leur affaiblissement
| La cause | La conséquence |
| Recul de la pratique religieuse | Une variable qui pèse moins |
| Brouillage des frontières de classe | Des blocs électoraux moins nets |
| Affaiblissement des partis de masse | Moins d'encadrement du vote |

L'électeur est devenu plus **volatil** : il change de vote d'une élection à l'autre. Deux logiques nouvelles apparaissent :
- le **vote sur enjeux**, qui privilégie un problème du moment ;
- le **vote sur bilan**, qui sanctionne ou récompense les sortants.

## L'abstention
| Sa forme | Qui s'abstient | Pourquoi |
| **Hors du jeu** | Les plus éloignés du système politique | Faible diplôme, précarité, isolement |
| **Dans le jeu** | Des électeurs politisés | Protestation, ou absence d'offre satisfaisante |

Elle varie fortement selon le **type de scrutin** — forte aux européennes et aux locales, plus faible à la présidentielle — et selon l'**âge**, les jeunes votant beaucoup plus par intermittence.

> Le vote reste un acte **socialement encouragé** : la sociabilité, la mobilisation par l'entourage et l'inscription associative augmentent nettement la participation.`,
          },
          questions: [
            ['Que sont les « variables lourdes » du vote ?', ['L’appartenance de classe, la religion et le lieu de résidence', 'L’âge, le sexe et la taille du ménage', 'Le revenu, l’épargne et le patrimoine', 'Le programme, le débat et la campagne'], 0, 'Ce sont les caractéristiques sociales les plus prédictives du vote.'],
            ['La pratique religieuse régulière reste une variable fortement prédictive du vote.', ['Vrai', 'Faux'], 0, 'C’est l’une des plus robustes, même si son poids global recule avec la déchristianisation.'],
            ['Qu’est-ce que le vote sur enjeux ?', ['Un vote déterminé par un problème particulier du moment', 'Un vote dicté par l’appartenance de classe', 'Un vote héréditaire', 'Un vote obligatoire'], 0, 'Il progresse à mesure que les variables lourdes s’affaiblissent.'],
            ['La volatilité électorale désigne…', ['le fait de changer de vote d’une élection à l’autre', 'l’instabilité des sondages', 'le taux d’abstention', 'le nombre de candidats en lice'], 0, 'Elle est l’un des signes de l’affaiblissement des ancrages partisans.'],
            ['L’abstention traduit toujours un désintérêt pour la politique.', ['Vrai', 'Faux'], 1, 'L’abstention « dans le jeu » est le fait d’électeurs politisés qui protestent.'],
            ['À quel type de scrutin l’abstention est-elle historiquement la plus faible en France ?', ['L’élection présidentielle', 'Les élections européennes', 'Les élections régionales', 'Les élections municipales des grandes villes'], 0, 'Elle est perçue comme l’élection décisive du système politique français.'],
            ['Qu’a montré Lazarsfeld dès 1944 ?', ['Que le vote se prédit mieux par les caractéristiques sociales que par la campagne', 'Que les campagnes déterminent le résultat', 'Que le vote est totalement imprévisible', 'Que les sondages sont sans effet'], 0, 'C’est l’acte de naissance de la sociologie électorale quantitative.'],
            ['L’inscription dans des réseaux associatifs augmente la probabilité de voter.', ['Vrai', 'Faux'], 0, 'La mobilisation par l’entourage est un ressort documenté de la participation.'],
          ],
        },

        // ---- Chapitre 7 : regards croisés -----------------------------------
        {
          titre: 'Comment l’assurance et la protection sociale gèrent-elles les risques ?',
          axe: 'Regards croisés',
          lecon: {
            titre: 'Risque, mutualisation, protection sociale',
            cours: `Un risque est un événement incertain aux conséquences dommageables. Les sociétés développées l'affrontent par la mutualisation.

## Les risques et leur partage
Maladie, accident, chômage, vieillesse, dépendance : la **mutualisation** consiste à partager le coût entre un grand nombre, pour qu'aucun ne le supporte seul.

## Deux logiques de protection
| La logique | Son principe | Son financement | Un exemple français |
| **Assurance** (bismarckienne) | On cotise, on est couvert à proportion | Cotisations sociales | Retraites, assurance chômage |
| **Assistance** (beveridgienne) | Prestation sous **condition de ressources** | Impôt | RSA |

> Le système français est **hybride** : construit en 1945 sur une base assurantielle, il s'est élargi à mesure que la CSG a pris la place des cotisations.

## Les acteurs
La protection sociale n'est pas seulement publique. Elle mêle :
- la **Sécurité sociale** ;
- les **mutuelles** et les **assurances privées** ;
- les **associations** ;
- la **famille**, qui reste pour la dépendance et la garde des enfants un producteur majeur de protection.

## Les limites
| La limite | Ce qu'elle décrit | La réponse |
| **Aléa moral** | Être couvert peut réduire la prudence ou l'effort | Franchises, délais de carence, dégressivité |
| **Sélection adverse** | Dans une assurance facultative, les bons risques partent, la prime monte | **Obligation** d'affiliation |
| **Coût** | Environ un tiers du PIB français | Question du financement dans une population vieillissante |

> Prélèvements et prestations réduisent fortement les inégalités : l'écart entre les revenus des 10 % les plus aisés et des 10 % les plus modestes est près de deux fois plus faible après redistribution qu'avant.`,
          },
          questions: [
            ['Qu’est-ce que la mutualisation d’un risque ?', ['Le partage du coût d’un dommage entre un grand nombre de personnes', 'La suppression du risque', 'L’assurance d’un seul individu', 'L’épargne de précaution individuelle'], 0, 'C’est le principe commun à l’assurance et à la protection sociale.'],
            ['Quelle logique verse une prestation sous condition de ressources, financée par l’impôt ?', ['La logique d’assistance', 'La logique d’assurance', 'La logique de cotisation', 'La logique contributive'], 0, 'Elle est dite beveridgienne ; le RSA en relève.'],
            ['Le système français de protection sociale relève d’une seule logique.', ['Vrai', 'Faux'], 1, 'Il est hybride : assurantiel à l’origine, il s’est élargi vers l’assistance.'],
            ['Qu’est-ce que l’aléa moral en assurance ?', ['Le fait qu’être couvert modifie le comportement de l’assuré', 'Le mensonge sur son état de santé à la souscription', 'Le refus d’assurer un risque élevé', 'La hausse des primes avec l’âge'], 0, 'Franchises et délais de carence servent à le limiter.'],
            ['Pourquoi rendre l’affiliation obligatoire limite-t-il la sélection adverse ?', ['Parce que les bons risques ne peuvent pas se retirer du système', 'Parce que les primes deviennent plus élevées', 'Parce que l’État contrôle les assureurs', 'Parce que les prestations sont plus généreuses'], 0, 'Sans obligation, les bons risques partent et la prime des restants explose.'],
            ['La famille ne joue plus aucun rôle dans la protection contre les risques.', ['Vrai', 'Faux'], 1, 'Elle reste un producteur majeur de protection, notamment pour la dépendance.'],
            ['Environ quelle part du PIB français la protection sociale représente-t-elle ?', ['Environ un tiers', 'Environ 5 %', 'Environ la moitié', 'Environ 10 %'], 0, 'C’est l’un des niveaux les plus élevés de l’OCDE.'],
            ['La redistribution réduit sensiblement l’écart entre les revenus les plus élevés et les plus modestes.', ['Vrai', 'Faux'], 0, 'Le rapport interdécile est nettement plus faible après prélèvements et prestations.'],
          ],
        },
        {
          titre: 'Une diversité d’entreprises et d’entrepreneurs',
          axe: 'Regards croisés',
          lecon: {
            titre: 'Tailles, statuts, figures de l’entrepreneur',
            cours: `Une entreprise combine des facteurs de production pour vendre des biens ou des services. Sous ce mot unique, des réalités très différentes.

## Une diversité de tailles
| La catégorie | Le seuil | Son poids |
| **Microentreprises** | Moins de 10 salariés | De très loin les plus **nombreuses** |
| **PME** et **ETI** | Le tissu intermédiaire | Ossature de l'emploi local |
| **Grandes entreprises** | Peu nombreuses | Concentrent l'emploi salarié, le chiffre d'affaires et l'export |

## Une diversité de statuts
| Le statut | Ce qui le caractérise |
| **Entreprise individuelle** | Le patrimoine de l'entrepreneur est engagé ; régime simplifié du micro-entrepreneur |
| **Sociétés** (SARL, SAS, SA) | Le patrimoine de l'entreprise est séparé de celui des propriétaires |
| **Économie sociale et solidaire** | Coopératives, mutuelles, associations : le profit n'est pas la finalité, souvent « une personne, une voix » |
| **Entreprises publiques** | Détenues majoritairement par l'État |

## Les figures de l'entrepreneur
| L'auteur | Ce qui définit l'entrepreneur |
| **Schumpeter** | Celui qui **innove** — produit, procédé, débouché ou organisation nouvelle — et déclenche la « destruction créatrice » |
| **Knight** | Celui qui assume l'**incertitude** : le risque non calculable, non assurable |
| La **sociologie** | Origine sociale, capital économique et réseau pèsent sur la probabilité de créer et sur la survie |

> Le statut de micro-entrepreneur, créé en 2008, a fait bondir le nombre de créations d'entreprises — sans transformer autant le tissu productif, ces entreprises étant très petites et souvent sans salarié.`,
          },
          questions: [
            ['Quelle catégorie d’entreprises est de loin la plus nombreuse en France ?', ['Les microentreprises', 'Les grandes entreprises', 'Les ETI', 'Les entreprises publiques'], 0, 'Elles emploient moins de 10 salariés et constituent l’essentiel des unités.'],
            ['Les grandes entreprises concentrent une part importante de l’emploi salarié malgré leur faible nombre.', ['Vrai', 'Faux'], 0, 'Peu nombreuses, elles pèsent lourd dans l’emploi, le chiffre d’affaires et l’export.'],
            ['Qu’est-ce qui caractérise l’entrepreneur chez Schumpeter ?', ['Il innove et déclenche la destruction créatrice', 'Il possède le capital', 'Il gère les salariés au quotidien', 'Il assume les tâches administratives'], 0, 'Nouveau produit, nouveau procédé, nouveau marché, nouvelle organisation.'],
            ['Selon Knight, l’entrepreneur assume…', ['l’incertitude, c’est-à-dire un risque non calculable', 'un risque toujours assurable', 'la seule responsabilité juridique', 'la gestion comptable'], 0, 'C’est ce qui justifie, à ses yeux, le profit.'],
            ['Dans une coopérative, le pouvoir est proportionnel au capital détenu.', ['Vrai', 'Faux'], 1, 'La règle est le plus souvent « une personne, une voix ».'],
            ['Qu’apporte le statut de société par rapport à l’entreprise individuelle ?', ['La séparation entre le patrimoine de l’entreprise et celui des propriétaires', 'L’exonération d’impôt', 'L’absence de comptabilité', 'La garantie de bénéfices'], 0, 'C’est la protection du patrimoine personnel qui distingue les deux.'],
            ['Que regroupe l’économie sociale et solidaire ?', ['Coopératives, mutuelles, associations et fondations', 'Les seules entreprises publiques', 'Les entreprises cotées en Bourse', 'Les micro-entreprises uniquement'], 0, 'Leur point commun : le profit n’est pas la finalité de l’activité.'],
            ['L’origine sociale et le réseau influencent la probabilité de créer une entreprise.', ['Vrai', 'Faux'], 0, 'Capital économique, capital social et capital culturel pèsent sur la création et la survie.'],
          ],
        },
        {
          titre: 'Comment les entreprises sont-elles organisées et gouvernées ?',
          axe: 'Regards croisés',
          lecon: {
            titre: 'Hiérarchie, coopération, conflits et gouvernance',
            cours: `Une entreprise n'est pas seulement un lieu de production : c'est une organisation traversée par le pouvoir, la coopération et le conflit.

## L'organisation du travail
| Le modèle | Ses principes | Sa limite |
| **Taylorisme** | Division verticale (concevoir / exécuter) et horizontale, chronométrage, salaire au rendement | Monotonie, absentéisme |
| **Fordisme** | La chaîne, la standardisation, les hauts salaires qui écoulent la production | Rigidité de la production de masse |
| **Toyotisme** | Flux tendus, qualité totale, polyvalence, autonomie d'équipe | Intensification du travail |
| **Ère numérique** | Travail en projet, télétravail, plateformes | Externalisation de la relation de travail |

## Coopération et conflits
La coordination passe par la **hiérarchie**, mais aussi par des règles, des routines et une culture d'entreprise.

> Crozier a montré que chaque acteur dispose d'une **zone d'incertitude** — une marge que sa position lui donne — et qu'il s'en sert comme d'une ressource de pouvoir, y compris à un échelon subalterne.

Les **conflits** ne sont pas une pathologie : ils portent sur les salaires, les conditions de travail, l'emploi, la reconnaissance.

| Forme en recul | Forme en hausse |
| Grèves longues et massives dans le privé | Formes individuelles : absentéisme, turnover, recours prud'homal |
| | Mobilisations courtes et médiatisées |

## La gouvernance
Elle désigne la manière dont le pouvoir se distribue entre **actionnaires**, **dirigeants** et **parties prenantes** : salariés, clients, fournisseurs, territoire.

Le problème central est la **relation d'agence** : le dirigeant (l'agent) ne poursuit pas nécessairement l'intérêt de l'actionnaire (le principal), et il en sait plus que lui.

| Le mécanisme de contrôle | Ce qu'il vise |
| Conseil d'administration | Surveiller les décisions |
| Audit | Vérifier l'information |
| Rémunération en actions | Aligner les intérêts |

> Depuis les années 1980, la gouvernance actionnariale a pris le pas dans les grandes sociétés cotées ; la loi PACTE de 2019 a réintroduit en France l'idée que l'entreprise doit considérer les enjeux sociaux et environnementaux de son activité.`,
          },
          questions: [
            ['Sur quoi repose le taylorisme ?', ['La division verticale et horizontale du travail et le chronométrage', 'L’autonomie des équipes', 'Les flux tendus', 'La polyvalence des salariés'], 0, 'Concevoir et exécuter sont séparés, les tâches sont parcellisées.'],
            ['Qu’ajoute le fordisme au taylorisme ?', ['La chaîne, la standardisation et des salaires élevés', 'La qualité totale', 'Le juste-à-temps', 'La suppression de la hiérarchie'], 0, 'Le five dollars day permet aussi d’écouler la production de masse.'],
            ['Le toyotisme repose sur la production en flux tendus et la qualité totale.', ['Vrai', 'Faux'], 0, 'Il répond aux limites du fordisme par la flexibilité et l’implication des équipes.'],
            ['Qu’est-ce qu’une zone d’incertitude chez Crozier ?', ['Une marge de manœuvre qui donne du pouvoir à un acteur, même subalterne', 'Un risque financier non couvert', 'Une clause floue du contrat de travail', 'Une période d’essai'], 0, 'Le pouvoir ne se lit pas seulement dans l’organigramme.'],
            ['Les conflits du travail sont nécessairement le signe d’un dysfonctionnement.', ['Vrai', 'Faux'], 1, 'Ils sont une expression normale d’intérêts divergents, et une voie de régulation.'],
            ['Qu’est-ce que la relation d’agence dans la gouvernance d’entreprise ?', ['La divergence d’intérêts et d’information entre dirigeants et actionnaires', 'Le lien entre l’entreprise et ses clients', 'Le contrat entre deux entreprises', 'Le mandat des représentants du personnel'], 0, 'Elle justifie les mécanismes de contrôle des dirigeants.'],
            ['Qui sont les parties prenantes d’une entreprise ?', ['Tous ceux qui sont affectés par son activité : salariés, clients, fournisseurs, territoire', 'Les seuls actionnaires', 'Les seuls dirigeants', 'Les seuls créanciers'], 0, 'La gouvernance partenariale les prend en compte face aux seuls actionnaires.'],
            ['Les formes du conflit du travail ont évolué vers des expressions plus individuelles.', ['Vrai', 'Faux'], 0, 'Absentéisme, turnover et recours prud’homal ont pris de l’importance face aux grèves longues.'],
          ],
        },
      ],
    },
  ],
}
