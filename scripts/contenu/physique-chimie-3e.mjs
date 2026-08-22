// Physique-Chimie — Troisième : LE PROGRAMME COMPLET (31 fiches).
//
// CE QUE REMPLACE CE MODULE. La 3e n'avait que QUATRE chapitres de
// physique-chimie, hérités du tout premier jeu de données (migration 008,
// contenu rempli par la 118) : « Ions et pH », « L'énergie et ses conversions »,
// « La gravitation » et « Puissance et énergie électriques ». Quatre fiches pour
// un programme de cycle 4 qui en demande trente et une : rien sur les mélanges
// et les corps purs, rien sur les changements d'état, rien sur la masse
// volumique, rien sur les tests caractéristiques, rien sur les constituants de
// l'atome, rien sur les mouvements, rien sur les circuits, rien sur la lumière
// ni sur le son.
//
// LE DÉCOUPAGE. Les 7 chapitres de la maquette de référence, éclatés en leurs
// 31 fiches. Chaque fiche est un chapitre en base ; le CHAPITRE du programme est
// porté par `axe` (colonne `chapters.theme`), qui fait grouper la page matière —
// cf. docs/template-matiere.md.
//
// LES QUATRE FICHES HÉRITÉES PARTENT (voir `menage`). Toutes les quatre sont
// recouvertes par le nouveau découpage : « Ions et pH » se scinde en « Les
// ions » et « Le pH ou potentiel hydrogène », « L'énergie et ses conversions »
// devient le chapitre 5 tout entier, « La gravitation » devient « Poids et
// gravitation », « Puissance et énergie électriques » devient « Puissance et
// énergie électrique ».
//
// ⚠️ LE PIÈGE DU PLURIEL. Le titre hérité s'écrit « Puissance et énergie
// électriqueS » et la fiche neuve « Puissance et énergie électrique » : ce sont
// DEUX chaînes différentes, donc pas de collision de titre — mais un ménage
// recopié à la lettre près depuis la maquette ne trouverait rien EN SILENCE.
// Les titres du ménage viennent de la 008, relus caractère par caractère.
//
// ⚠️ PAS DE LATEX. `components/LessonRichContent` ne le rend pas : les formules
// s'écrivent en texte (P = U × I, m/V, ×10⁻³). C'est la convention du dossier.
//
// ⚠️ Le slug `physique-chimie` porte désormais QUATRE modules
// (`physique-chimie-tle.mjs` = 252, `physique-chimie-1re.mjs` = 270,
// `physique-chimie-2de.mjs` = 289, celui-ci = 295) : ne JAMAIS générer avec
// `--slugs physique-chimie`, qui les fusionnerait et réécrirait trois
// migrations. Toujours `--modules physique-chimie-3e`.

export default {
  slug: 'physique-chimie',
  nom: 'Physique-Chimie',

  titreMigration: 'PHYSIQUE-CHIMIE 3e — LE PROGRAMME COMPLET (31 fiches)',

  motif: `CONSTAT : la Troisième n'avait que QUATRE chapitres de physique-chimie,
hérités du premier jeu de données de l'app, pour un programme de cycle 4 qui en
demande trente et un. Un élève de 3e qui révisait les mélanges et les corps
purs, les changements d'état, la masse volumique, les tests caractéristiques,
les constituants de l'atome, les mouvements, les forces, les circuits
électriques, la lumière ou le son ne trouvait RIEN. Cette migration installe les
31 fiches, rangées sous leurs 7 chapitres, et retire les 4 fiches génériques que
ce découpage recouvre.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 31 fiches sous 7 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas
garantir que la 234 soit passée en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 4 anciens chapitres
déjà supprimés et les 31 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 chapitres hérités partent. Tous les quatre sont recouverts par le
nouveau découpage : "Ions et pH" se scinde en deux fiches du chapitre 2,
"L'énergie et ses conversions" devient le chapitre 5 en entier, "La gravitation"
devient "Poids et gravitation", et "Puissance et énergie électriques" devient
"Puissance et énergie électrique". Les garder ferait deux objets voisins à deux
places différentes.
ATTENTION À DEUX DÉTAILS D'ÉCRITURE. (1) "L'énergie et ses conversions" s'écrit
dans la 008 avec l'apostrophe DROITE, pas la typographique qu'emploient les
fiches neuves : un DELETE qui se tromperait de signe ne trouverait rien EN
SILENCE. (2) Le titre hérité porte "électriqueS" au pluriel là où la fiche neuve
est au singulier — deux chaînes différentes, donc aucune collision, mais le
ménage doit citer la forme de la 008, pas celle de la maquette.
Aucun des quatre titres n'est repris à l'identique par une fiche neuve : le
ménage, qui tourne AVANT les insertions à chaque passage, ne peut donc pas
mordre sur le contenu neuf à un rejeu.
Le filtre level = '3e' est indispensable : "La gravitation" et "Ions et pH" sont
aussi des titres d'autres niveaux, et le ménage mordrait sur le collège et le
lycée.
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
   AND s.slug = 'physique-chimie'
   AND c.level = '3e'
   AND c.title IN ('Ions et pH',
                   'L''énergie et ses conversions',
                   'La gravitation',
                   'Puissance et énergie électriques');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '3e'
   AND c.title IN ('Ions et pH',
                   'L''énergie et ses conversions',
                   'La gravitation',
                   'Puissance et énergie électriques');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '3e'
   AND c.title IN ('Ions et pH',
                   'L''énergie et ses conversions',
                   'La gravitation',
                   'Puissance et énergie électriques');`,
    },
  ],

  blocs: [
    {
      niveaux: ['3e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : Les états de la matière
        // ===================================================================
        {
          titre: 'Mélanges et corps purs',
          axe: 'Les états de la matière',
          lecon: {
            titre: 'Un seul constituant, ou plusieurs ?',
            cours: `Un **corps pur** est constitué d’**une seule espèce chimique** : l’eau distillée, le dioxygène, le fer, le sel pur. Un **mélange** en contient **plusieurs**.

## Deux familles de mélanges
- **Homogène** : on ne distingue pas les constituants à l’œil nu, même après repos. L’eau salée, l’air, le vinaigre.
- **Hétérogène** : on distingue au moins deux constituants. L’eau boueuse, le jus d’orange avec pulpe, l’huile dans l’eau.

## Séparer les constituants
- La **décantation** : on laisse reposer, le plus dense tombe au fond, puis on transvase.
- La **filtration** : le filtre retient les particules solides ; le liquide qui passe est le **filtrat**. Elle ne sépare PAS un mélange homogène.
- La **distillation** : on chauffe, la vapeur est refroidie dans un réfrigérant et recueillie — c’est le **distillat**. Elle sépare un mélange **homogène**, en jouant sur les températures d’ébullition.

> Filtrer de l’eau salée ne donne pas de l’eau pure : le sel est dissous, il traverse le filtre. Seule la distillation le retient.

## Reconnaître un corps pur
Un corps pur change d’état à **température constante** : l’eau pure bout à 100 °C sous pression normale, et la température ne bouge plus tant que toute l’eau n’est pas vaporisée. Un mélange, lui, change d’état sur un **intervalle** de températures.

## Les tests utiles
- L’eau se reconnaît au **sulfate de cuivre anhydre**, blanc, qui devient **bleu** en sa présence.
- Une eau **pure** ne laisse aucun résidu après évaporation ; une eau minérale en laisse.`,
          },
          questions: [
            ['Qu’est-ce qu’un corps pur ?', ['Un corps constitué d’une seule espèce chimique', 'Un corps sans couleur', 'Un corps qui ne réagit avec rien', 'Un corps toujours solide'], 0, 'L’eau distillée, le fer ou le dioxygène en sont.'],
            ['Comment reconnaît-on un mélange homogène ?', ['On ne distingue pas ses constituants, même après repos', 'Il est toujours transparent et incolore', 'Il se sépare par filtration', 'Il contient toujours de l’eau'], 0, 'L’eau salée et l’air en sont des exemples.'],
            ['Quelle technique sépare l’eau et le sable ?', ['La filtration', 'La distillation', 'La chromatographie', 'L’électrolyse'], 0, 'Le sable est insoluble : le filtre le retient.'],
            ['Quelle technique permet de récupérer l’eau pure d’une eau salée ?', ['La distillation', 'La filtration', 'La décantation', 'Le tamisage'], 0, 'Le sel dissous traverse tous les filtres.'],
            ['Comment appelle-t-on le liquide obtenu après une filtration ?', ['Le filtrat', 'Le distillat', 'Le résidu', 'Le solvant'], 0, 'Le distillat, lui, est le produit d’une distillation.'],
            ['Quel test permet de détecter la présence d’eau ?', ['Le sulfate de cuivre anhydre, qui passe du blanc au bleu', 'L’eau de chaux, qui se trouble', 'La bûchette incandescente', 'Le papier pH'], 0, 'C’est le test caractéristique de l’eau.'],
            ['Comment un corps pur se comporte-t-il pendant un changement d’état ?', ['Sa température reste constante', 'Sa température augmente régulièrement', 'Sa masse diminue', 'Il change de couleur'], 0, 'Un mélange, lui, change d’état sur un intervalle de températures.'],
            ['La filtration permet de séparer les constituants d’un mélange homogène.', ['Vrai', 'Faux'], 1, 'Elle ne retient que ce qui n’est pas dissous.'],
          ],
        },
        {
          titre: 'Les états de la matière',
          axe: 'Les états de la matière',
          lecon: {
            titre: 'Solide, liquide, gaz : la même matière, trois organisations',
            cours: `La matière se présente sous trois **états physiques**, qui diffèrent par l’organisation de leurs molécules — jamais par leur nature.

## Les trois états
- **Solide** : forme propre, volume propre. Les molécules sont **serrées**, **ordonnées** dans un solide cristallin, et **immobiles** (elles vibrent sur place).
- **Liquide** : pas de forme propre (il prend celle du récipient), mais un **volume propre**. Les molécules sont serrées mais **désordonnées** et **glissent** les unes sur les autres.
- **Gaz** : ni forme ni volume propres — il occupe tout l’espace disponible. Les molécules sont **très éloignées**, **désordonnées** et **très agitées**.

## Ce que cela explique
- Un gaz est **compressible** : il y a beaucoup de vide entre ses molécules. Un liquide et un solide ne le sont quasiment pas.
- Un liquide au repos a une surface **plane et horizontale**.
- Un gaz est **expansible** : il remplit tout le volume qu’on lui offre.

## La conservation de la masse
Lors d’un changement d’état, la **masse se conserve** : les molécules sont les mêmes, seul leur arrangement change. En revanche le **volume varie**, et l’eau fait exception en **augmentant** de volume quand elle gèle — c’est pourquoi une bouteille pleine d’eau placée au congélateur peut éclater.

> Ce qui distingue les trois états n’est pas la matière, c’est la distance entre les molécules et leur agitation.

## L’agitation thermique
Plus la température est élevée, plus les molécules sont agitées. Le **zéro absolu** (−273 °C) est la température où cette agitation cesserait : c’est le zéro de l’échelle des kelvins.`,
          },
          questions: [
            ['Quel état a un volume propre mais pas de forme propre ?', ['L’état liquide', 'L’état solide', 'L’état gazeux', 'Aucun'], 0, 'Le liquide prend la forme du récipient sans changer de volume.'],
            ['Comment sont les molécules dans un gaz ?', ['Très éloignées, désordonnées et très agitées', 'Serrées et ordonnées', 'Serrées et immobiles', 'Alignées en rangées régulières'], 0, 'C’est le vide entre elles qui rend le gaz compressible.'],
            ['Pourquoi un gaz est-il compressible ?', ['Parce que ses molécules sont très éloignées les unes des autres', 'Parce que ses molécules sont plus petites', 'Parce qu’il est plus léger que l’air', 'Parce qu’il n’a pas de masse'], 0, 'On peut réduire son volume en rapprochant les molécules.'],
            ['Que devient la masse lors d’un changement d’état ?', ['Elle se conserve', 'Elle augmente', 'Elle diminue', 'Elle devient nulle'], 0, 'Les molécules sont les mêmes, seule leur organisation change.'],
            ['Que fait le volume de l’eau quand elle gèle ?', ['Il augmente', 'Il diminue', 'Il reste identique', 'Il devient nul'], 0, 'C’est une exception : une bouteille pleine peut éclater au congélateur.'],
            ['Comment sont les molécules dans un solide cristallin ?', ['Serrées, ordonnées et vibrant sur place', 'Éloignées et immobiles', 'Serrées et glissant les unes sur les autres', 'Réparties au hasard et très agitées'], 0, 'L’ordre distingue un solide cristallin d’un solide amorphe.'],
            ['Que se passe-t-il quand la température augmente ?', ['L’agitation des molécules augmente', 'Les molécules deviennent plus grosses', 'Le nombre de molécules augmente', 'Les molécules changent de nature'], 0, 'C’est l’agitation thermique.'],
            ['Un liquide occupe tout le volume du récipient qui le contient.', ['Vrai', 'Faux'], 1, 'C’est le gaz qui est expansible ; le liquide garde son volume.'],
          ],
        },
        {
          titre: 'Les changements d’état de l’eau',
          axe: 'Les états de la matière',
          lecon: {
            titre: 'Six passages, six noms à connaître',
            cours: `Un **changement d’état** est le passage d’un état physique à un autre. Il y en a **six**, et chacun porte un nom précis.

## Les six changements
- Solide → liquide : la **fusion**
- Liquide → solide : la **solidification**
- Liquide → gaz : la **vaporisation** (par **évaporation** en surface, ou par **ébullition** dans toute la masse)
- Gaz → liquide : la **liquéfaction** (aussi appelée condensation liquide)
- Solide → gaz : la **sublimation**
- Gaz → solide : la **condensation solide**

## Les températures de l’eau pure
Sous la pression atmosphérique normale :
- **fusion et solidification : 0 °C** ;
- **ébullition et liquéfaction : 100 °C**.

Ces valeurs ne valent que pour l’**eau pure** et à pression normale. En altitude, la pression est plus faible et l’eau bout **en dessous** de 100 °C. Avec du sel, la température de fusion **descend** sous 0 °C — c’est le salage des routes.

## Le palier de température
Pendant un changement d’état d’un corps pur, la température **reste constante** : toute l’énergie reçue sert à réorganiser les molécules, pas à les agiter davantage. Sur une courbe de refroidissement, ce **palier** est la signature d’un corps pur.

> On peut chauffer de l’eau bouillante autant qu’on veut, elle ne dépassera pas 100 °C : elle se vaporisera plus vite, c’est tout.

## Dans la nature
La rosée est une liquéfaction, le givre une condensation solide, la buée sur une vitre froide une liquéfaction, le brouillard un ensemble de gouttelettes en suspension — et non de la vapeur d’eau, qui est **invisible**.`,
          },
          questions: [
            ['Comment appelle-t-on le passage de l’état solide à l’état liquide ?', ['La fusion', 'La solidification', 'La sublimation', 'La liquéfaction'], 0, 'Le passage inverse est la solidification.'],
            ['Comment appelle-t-on le passage de l’état gazeux à l’état liquide ?', ['La liquéfaction', 'La vaporisation', 'La sublimation', 'La fusion'], 0, 'C’est ce qui produit la buée sur une vitre froide.'],
            ['Comment appelle-t-on le passage direct de l’état solide à l’état gazeux ?', ['La sublimation', 'La fusion', 'L’évaporation', 'La condensation solide'], 0, 'Le passage inverse est la condensation solide.'],
            ['À quelle température l’eau pure fond-elle sous pression normale ?', ['0 °C', '100 °C', '−10 °C', '37 °C'], 0, 'C’est aussi sa température de solidification.'],
            ['Que fait la température pendant le changement d’état d’un corps pur ?', ['Elle reste constante', 'Elle augmente régulièrement', 'Elle chute brutalement', 'Elle oscille'], 0, 'Ce palier est la signature d’un corps pur.'],
            ['Quel est l’effet du sel sur la température de fusion de l’eau ?', ['Il l’abaisse en dessous de 0 °C', 'Il l’élève au-dessus de 0 °C', 'Il ne change rien', 'Il empêche toute fusion'], 0, 'C’est le principe du salage des routes en hiver.'],
            ['Pourquoi l’eau bout-elle en dessous de 100 °C en altitude ?', ['Parce que la pression atmosphérique y est plus faible', 'Parce que l’air y est plus froid', 'Parce que l’eau y est moins pure', 'Parce que le soleil y est plus fort'], 0, 'La température d’ébullition dépend de la pression.'],
            ['La vapeur d’eau est le nuage blanc que l’on voit au-dessus d’une casserole.', ['Vrai', 'Faux'], 1, 'La vapeur d’eau est invisible : le nuage blanc est fait de gouttelettes liquides.'],
          ],
        },
        {
          titre: 'La miscibilité et la solubilité',
          axe: 'Les états de la matière',
          lecon: {
            titre: 'Ce qui se mélange, ce qui se dissout',
            cours: `Deux notions voisines à ne pas confondre : la **miscibilité** concerne deux **liquides**, la **solubilité** le passage d’une espèce **dans un solvant**.

## La miscibilité
Deux liquides sont **miscibles** s’ils forment un mélange **homogène** : l’eau et l’alcool, l’eau et le vinaigre. Ils sont **non miscibles** s’ils forment deux phases superposées : l’eau et l’huile, l’eau et le cyclohexane.

Dans un mélange non miscible, le liquide le **moins dense** se place au-dessus. On les sépare à l’**ampoule à décanter**.

## La dissolution
Dissoudre, c’est disperser une espèce (le **soluté**) dans un liquide (le **solvant**) pour obtenir une **solution** homogène.
- Solvant + soluté = solution.
- La **masse se conserve** : masse de la solution = masse du solvant + masse du soluté. Le sucre ne « disparaît » pas, il se disperse en particules invisibles à l’œil nu.

## La solubilité
La **solubilité** est la masse maximale de soluté que l’on peut dissoudre dans un litre (ou 100 g) de solvant, à une température donnée. Elle s’exprime en g/L.
- Au-delà, la solution est **saturée** : le surplus reste au fond sans se dissoudre.
- La solubilité d’un solide **augmente** généralement avec la température ; celle d’un **gaz diminue** quand la température monte — c’est pourquoi un soda tiède pétille moins.

> Une solution saturée n’est pas une solution ratée : c’est une solution qui a atteint sa limite.

## Le cas des gaz dans l’eau
Le dioxygène dissous dans l’eau des rivières permet la vie aquatique. Une eau réchauffée en contient moins : c’est un effet direct du réchauffement sur les milieux aquatiques.`,
          },
          questions: [
            ['Que signifie « deux liquides sont miscibles » ?', ['Ils forment un mélange homogène', 'Ils forment deux couches distinctes', 'Ils réagissent chimiquement', 'Ils ont la même masse volumique'], 0, 'L’eau et l’alcool sont miscibles, l’eau et l’huile non.'],
            ['Dans un mélange d’eau et d’huile, où se place l’huile ?', ['Au-dessus, car elle est moins dense', 'En dessous, car elle est plus dense', 'Au milieu', 'Elle se dissout entièrement'], 0, 'Le liquide le moins dense surnage.'],
            ['Quel matériel sépare deux liquides non miscibles ?', ['L’ampoule à décanter', 'Le filtre à café', 'Le réfrigérant', 'La burette graduée'], 0, 'On soutire la phase du bas par le robinet.'],
            ['Dans une dissolution, comment appelle-t-on l’espèce dissoute ?', ['Le soluté', 'Le solvant', 'Le filtrat', 'Le précipité'], 0, 'Le solvant est le liquide qui dissout.'],
            ['Que devient la masse lors d’une dissolution ?', ['Elle se conserve', 'Elle diminue', 'Elle augmente', 'Elle devient nulle'], 0, 'Masse de la solution = masse du solvant + masse du soluté.'],
            ['Qu’est-ce qu’une solution saturée ?', ['Une solution qui ne peut plus dissoudre de soluté', 'Une solution trop diluée', 'Une solution colorée', 'Une solution chauffée'], 0, 'Le surplus de soluté reste au fond.'],
            ['Comment évolue la solubilité d’un gaz quand la température augmente ?', ['Elle diminue', 'Elle augmente', 'Elle ne change pas', 'Elle devient infinie'], 0, 'C’est pourquoi un soda tiède pétille moins et pourquoi l’eau chaude contient moins de dioxygène.'],
            ['Le sucre dissous dans l’eau a disparu.', ['Vrai', 'Faux'], 1, 'Il est dispersé en particules invisibles : la masse totale le prouve.'],
          ],
        },
        {
          titre: 'La composition de l’air',
          axe: 'Les états de la matière',
          lecon: {
            titre: 'Un mélange de gaz, et une masse bien réelle',
            cours: `L’**air** est un **mélange homogène de gaz**, et non un corps pur.

## Sa composition
- environ **78 % de diazote (N₂)** ;
- environ **21 % de dioxygène (O₂)** ;
- environ **1 %** d’autres gaz, dont l’**argon**, le **dioxyde de carbone (CO₂)** et de la vapeur d’eau en proportion variable.

Ces pourcentages sont des pourcentages **en volume**.

## L’air a une masse
Un litre d’air pèse environ **1,2 g** dans les conditions ordinaires. On le prouve en pesant un ballon gonflé puis dégonflé : la différence est la masse de l’air ajouté.

## Deux tests à connaître
- Le **dioxygène** est identifié par la **bûchette incandescente** : elle se rallume s’il est présent.
- Le **dioxyde de carbone** est identifié par l’**eau de chaux**, qui se **trouble** (elle devient blanche laiteuse).

## L’atmosphère et la pression
L’air de l’atmosphère exerce une **pression** dans toutes les directions, mesurée au **baromètre** en **hectopascals (hPa)** : environ **1 013 hPa** au niveau de la mer. Elle **diminue avec l’altitude**, parce que la colonne d’air au-dessus est plus courte.

> Un gaz est compressible : dans une bouteille de plongée, le même volume d’air occupe un volume bien plus petit sous forte pression.

## L’air et les activités humaines
La combustion des énergies fossiles augmente la proportion de **CO₂**, gaz à effet de serre, et rejette des polluants : particules fines, oxydes d’azote. La composition de l’air n’est donc pas une donnée fixe à l’échelle du siècle.`,
          },
          questions: [
            ['Quelle est la proportion de diazote dans l’air ?', ['Environ 78 %', 'Environ 21 %', 'Environ 50 %', 'Environ 1 %'], 0, 'Le dioxygène ne représente qu’environ 21 %.'],
            ['Quel gaz représente environ 21 % de l’air ?', ['Le dioxygène', 'Le diazote', 'Le dioxyde de carbone', 'L’argon'], 0, 'C’est celui que nous consommons en respirant.'],
            ['Quel test identifie le dioxygène ?', ['La bûchette incandescente, qui se rallume', 'L’eau de chaux, qui se trouble', 'Le sulfate de cuivre anhydre, qui bleuit', 'Le papier pH, qui rougit'], 0, 'L’eau de chaux sert, elle, à détecter le dioxyde de carbone.'],
            ['Quel test identifie le dioxyde de carbone ?', ['L’eau de chaux, qui se trouble', 'La bûchette incandescente', 'Le sulfate de cuivre anhydre', 'Le test à la flamme'], 0, 'L’eau de chaux devient blanche laiteuse.'],
            ['Quelle est environ la masse d’un litre d’air ?', ['1,2 g', '1,2 kg', '12 g', 'Elle est nulle'], 0, 'On le vérifie en pesant un ballon gonflé puis dégonflé.'],
            ['Dans quelle unité mesure-t-on la pression atmosphérique ?', ['L’hectopascal (hPa)', 'Le newton (N)', 'Le joule (J)', 'Le watt (W)'], 0, 'Environ 1 013 hPa au niveau de la mer.'],
            ['Comment évolue la pression atmosphérique avec l’altitude ?', ['Elle diminue', 'Elle augmente', 'Elle reste constante', 'Elle s’annule à 1 000 m'], 0, 'La colonne d’air au-dessus est plus courte.'],
            ['L’air est un corps pur.', ['Vrai', 'Faux'], 1, 'C’est un mélange homogène de plusieurs gaz.'],
          ],
        },
        {
          titre: 'La masse volumique',
          axe: 'Les états de la matière',
          lecon: {
            titre: 'Une grandeur qui identifie un matériau',
            cours: `La **masse volumique** d’un matériau est la masse d’**une unité de volume** de ce matériau. Elle se note ρ (rhô) et se calcule par :

**ρ = m ÷ V**

- m est la **masse**, en g ou kg ;
- V est le **volume**, en cm³, mL, L ou m³ ;
- ρ s’exprime alors en **g/cm³**, g/mL ou kg/m³.

## Quelques valeurs de référence
- Eau : **1 g/cm³** (soit 1 000 kg/m³)
- Huile : environ 0,92 g/cm³
- Fer : environ 7,9 g/cm³
- Air : environ 0,0012 g/cm³

## Ce qu’elle sert à faire
- **Identifier un matériau** : on mesure sa masse et son volume, on calcule ρ et on compare aux valeurs du tableau.
- **Prévoir si un corps flotte** : un corps flotte sur un liquide si sa masse volumique est **inférieure** à celle du liquide. Le bois flotte sur l’eau, le fer coule, l’huile surnage.

## Mesurer un volume irrégulier
On plonge l’objet dans une éprouvette graduée contenant de l’eau : le volume d’eau **déplacé** est le volume de l’objet.

## Deux erreurs à éviter
- **Masse et masse volumique ne sont pas la même chose** : « le plomb est plus lourd que le bois » n’a de sens qu’à volume égal.
- **Les unités doivent être cohérentes** : 1 g/cm³ = 1 000 kg/m³ ; 1 mL = 1 cm³ ; 1 L = 1 dm³.

> Un kilogramme de plumes et un kilogramme de plomb ont la même masse — mais pas du tout le même volume, et c’est exactement ce que mesure la masse volumique.`,
          },
          questions: [
            ['Quelle est la formule de la masse volumique ?', ['ρ = m ÷ V', 'ρ = V ÷ m', 'ρ = m × V', 'ρ = m + V'], 0, 'La masse divisée par le volume occupé.'],
            ['Quelle est la masse volumique de l’eau ?', ['1 g/cm³', '10 g/cm³', '0,1 g/cm³', '1 000 g/cm³'], 0, 'Soit 1 000 kg/m³ : les deux écritures désignent la même valeur.'],
            ['À quelle condition un corps flotte-t-il sur un liquide ?', ['Si sa masse volumique est inférieure à celle du liquide', 'Si sa masse est inférieure à celle du liquide', 'S’il est creux', 'Si son volume est supérieur à celui du liquide'], 0, 'C’est pourquoi l’huile surnage sur l’eau.'],
            ['Comment mesure-t-on le volume d’un objet de forme irrégulière ?', ['Par le volume d’eau qu’il déplace dans une éprouvette graduée', 'En le pesant', 'En mesurant sa plus grande longueur', 'En le chauffant'], 0, 'C’est la méthode par déplacement d’eau.'],
            ['À combien de cm³ correspond 1 mL ?', ['1 cm³', '10 cm³', '100 cm³', '0,1 cm³'], 0, 'Et 1 L = 1 dm³ = 1 000 cm³.'],
            ['Un objet de 79 g occupe 10 cm³. Quel est ce matériau probable ?', ['Le fer, de masse volumique 7,9 g/cm³', 'L’eau', 'L’huile', 'L’air'], 0, 'ρ = 79 ÷ 10 = 7,9 g/cm³.'],
            ['À combien de kg/m³ correspond 1 g/cm³ ?', ['1 000 kg/m³', '1 kg/m³', '100 kg/m³', '10 000 kg/m³'], 0, 'La conversion est un piège classique du chapitre.'],
            ['Deux objets de même masse ont forcément la même masse volumique.', ['Vrai', 'Faux'], 1, 'Encore faut-il qu’ils aient le même volume : un kilo de plumes n’occupe pas le volume d’un kilo de plomb.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 : Les transformations chimiques
        // ===================================================================
        {
          titre: 'Les atomes et la transformation chimique',
          axe: 'Les transformations chimiques',
          lecon: {
            titre: 'Réactifs, produits, et une équation qui s’équilibre',
            cours: `Une **transformation chimique** est une transformation au cours de laquelle des espèces chimiques **disparaissent** (les **réactifs**) tandis que d’autres **apparaissent** (les **produits**).

## La différence avec un changement d’état
Un changement d’état est **physique** : les molécules restent les mêmes. Une transformation chimique **réorganise les atomes** en de nouvelles molécules. La glace qui fond reste de l’eau ; le bois qui brûle devient du dioxyde de carbone et de l’eau.

## Les signes d’une transformation chimique
Dégagement de gaz, changement de couleur, apparition d’un solide (**précipité**), dégagement de chaleur, disparition d’un réactif.

## L’équation de réaction
Elle s’écrit avec les **formules chimiques** :

méthane + dioxygène → dioxyde de carbone + eau
CH₄ + 2 O₂ → CO₂ + 2 H₂O

- La flèche se lit « donne » ou « réagit pour former ».
- Les **nombres stœchiométriques** (devant les formules) **ajustent** l’équation.

## La conservation des atomes et de la masse
Au cours d’une transformation chimique :
- **les atomes se conservent** — ni créés, ni détruits, seulement réarrangés ;
- donc **la masse totale se conserve** : masse des réactifs consommés = masse des produits formés.

C’est la loi de **Lavoisier** : « rien ne se perd, rien ne se crée, tout se transforme ».

> Une équation mal ajustée est une équation fausse : le nombre de chaque sorte d’atome doit être identique à gauche et à droite de la flèche.

## Le réactif limitant
Quand un réactif est entièrement consommé, la réaction s’arrête, même s’il reste de l’autre : ce réactif est le **réactif limitant**. C’est lui qui fixe la quantité de produits obtenue.`,
          },
          questions: [
            ['Comment appelle-t-on les espèces qui disparaissent au cours d’une transformation chimique ?', ['Les réactifs', 'Les produits', 'Les catalyseurs', 'Les solutés'], 0, 'Celles qui apparaissent sont les produits.'],
            ['Quelle différence y a-t-il entre un changement d’état et une transformation chimique ?', ['Le changement d’état ne modifie pas les molécules, la transformation chimique les réorganise', 'Le changement d’état dégage toujours de la chaleur', 'La transformation chimique est réversible, pas le changement d’état', 'Il n’y a aucune différence'], 0, 'La glace qui fond reste de l’eau ; le bois qui brûle n’est plus du bois.'],
            ['Que devient la masse totale au cours d’une transformation chimique ?', ['Elle se conserve', 'Elle augmente', 'Elle diminue', 'Elle double'], 0, 'C’est la loi de Lavoisier : les atomes sont réarrangés, pas créés.'],
            ['Que signifie la flèche dans une équation de réaction ?', ['Elle sépare les réactifs des produits', 'Elle indique une addition', 'Elle signifie « est égal à »', 'Elle indique un chauffage'], 0, 'Elle se lit « donne » ou « réagit pour former ».'],
            ['À quoi servent les nombres écrits devant les formules chimiques ?', ['À ajuster l’équation pour conserver les atomes', 'À indiquer la température', 'À donner la masse des espèces', 'À numéroter les étapes'], 0, 'Ce sont les nombres stœchiométriques.'],
            ['Quelle est l’équation ajustée de la combustion du méthane ?', ['CH₄ + 2 O₂ → CO₂ + 2 H₂O', 'CH₄ + O₂ → CO₂ + H₂O', 'CH₄ + 2 O₂ → CO₂ + H₂O', 'CH₄ + O₂ → CO₂ + 2 H₂O'], 0, 'Quatre atomes d’hydrogène à gauche exigent deux molécules d’eau à droite.'],
            ['Qu’est-ce que le réactif limitant ?', ['Le réactif entièrement consommé, qui arrête la réaction', 'Le réactif le plus abondant', 'Le réactif le plus dangereux', 'Le réactif qui reste à la fin'], 0, 'C’est lui qui fixe la quantité de produits formés.'],
            ['Au cours d’une transformation chimique, des atomes peuvent être créés.', ['Vrai', 'Faux'], 1, 'Ils sont seulement réarrangés : c’est pourquoi la masse se conserve.'],
          ],
        },
        {
          titre: 'Les tests caractéristiques des espèces chimiques',
          axe: 'Les transformations chimiques',
          lecon: {
            titre: 'Reconnaître un gaz, un ion, une espèce',
            cours: `Un **test caractéristique** est une expérience simple dont le résultat identifie une espèce chimique **sans ambiguïté**.

## Les tests des gaz
- **Dioxygène (O₂)** : la **bûchette incandescente** se rallume.
- **Dihydrogène (H₂)** : **détonation** (« aboiement ») à l’approche d’une flamme.
- **Dioxyde de carbone (CO₂)** : l’**eau de chaux se trouble**.

## Le test de l’eau
Le **sulfate de cuivre anhydre**, poudre **blanche**, devient **bleu** en présence d’eau.

## Les tests des ions
On ajoute quelques gouttes d’un réactif à la solution : un **précipité** apparaît, dont la **couleur** identifie l’ion.

Avec la **soude** (hydroxyde de sodium) :
- ion **cuivre II (Cu²⁺)** → précipité **bleu** ;
- ion **fer II (Fe²⁺)** → précipité **vert** ;
- ion **fer III (Fe³⁺)** → précipité **rouille** ;
- ion **zinc (Zn²⁺)** → précipité **blanc**.

Avec le **nitrate d’argent** :
- ion **chlorure (Cl⁻)** → précipité **blanc** qui **noircit à la lumière**.

## Comment rédiger une identification
1. Prélever un peu de solution dans un tube à essai.
2. Ajouter le réactif.
3. Observer, comparer au tableau, **conclure** en nommant l’espèce identifiée.

> Un test ne se conclut jamais par une couleur : il se conclut par un nom d’espèce. « Précipité bleu » n’est pas une réponse ; « la solution contient des ions cuivre II » en est une.

## Sécurité
La soude et le nitrate d’argent sont **corrosifs** : lunettes, gants, blouse. Le nitrate d’argent tache durablement la peau et les vêtements.`,
          },
          questions: [
            ['Quel test identifie le dihydrogène ?', ['Une détonation à l’approche d’une flamme', 'L’eau de chaux qui se trouble', 'La bûchette qui se rallume', 'Le sulfate de cuivre qui bleuit'], 0, 'On l’appelle familièrement le test de l’aboiement.'],
            ['Quel précipité obtient-on en ajoutant de la soude à une solution d’ions cuivre II ?', ['Un précipité bleu', 'Un précipité vert', 'Un précipité rouille', 'Un précipité blanc'], 0, 'Le vert signale les ions fer II, le rouille les ions fer III.'],
            ['Quel précipité signale la présence d’ions fer III ?', ['Un précipité rouille', 'Un précipité bleu', 'Un précipité vert', 'Un précipité noir'], 0, 'Les ions fer II donnent, eux, un précipité vert.'],
            ['Quel réactif identifie les ions chlorure ?', ['Le nitrate d’argent', 'La soude', 'L’eau de chaux', 'Le sulfate de cuivre anhydre'], 0, 'Il forme un précipité blanc qui noircit à la lumière.'],
            ['Que devient le sulfate de cuivre anhydre en présence d’eau ?', ['Il passe du blanc au bleu', 'Il passe du bleu au blanc', 'Il devient vert', 'Il ne change pas'], 0, 'C’est le test caractéristique de l’eau.'],
            ['Quel précipité obtient-on avec les ions zinc et la soude ?', ['Un précipité blanc', 'Un précipité bleu', 'Un précipité vert', 'Aucun précipité'], 0, 'Il ne faut pas le confondre avec le précipité blanc des ions chlorure, obtenu avec un autre réactif.'],
            ['Comment doit-on conclure un test caractéristique ?', ['En nommant l’espèce chimique identifiée', 'En donnant la couleur observée', 'En indiquant le volume utilisé', 'En mesurant la température'], 0, '« Précipité bleu » décrit ; « la solution contient des ions cuivre II » conclut.'],
            ['La soude peut être manipulée sans protection particulière.', ['Vrai', 'Faux'], 1, 'Elle est corrosive : lunettes, gants et blouse sont obligatoires.'],
          ],
        },
        {
          titre: 'Les ions',
          axe: 'Les transformations chimiques',
          lecon: {
            titre: 'Des atomes qui ont gagné ou perdu des électrons',
            cours: `Un **ion** est un atome — ou un groupe d’atomes — qui a **gagné ou perdu un ou plusieurs électrons**. Il porte donc une **charge électrique**.

## Deux familles
- Un **cation** a **perdu** des électrons : il est chargé **positivement**. Na⁺, Cu²⁺, Fe³⁺, H⁺.
- Un **anion** a **gagné** des électrons : il est chargé **négativement**. Cl⁻, OH⁻, SO₄²⁻.

Le nombre de charges se note en exposant après le symbole : Cu²⁺ a perdu **deux** électrons.

## Pourquoi un atome devient un ion
L’atome est électriquement **neutre** : autant de protons (+) que d’électrons (−). En perdant un électron, il a un proton de trop : il devient positif. En en gagnant un, il devient négatif. **Le noyau ne change jamais** — sinon ce ne serait plus le même élément chimique.

## Les solutions ioniques
Dissoudre du sel dans l’eau donne une solution d’ions **sodium Na⁺** et **chlorure Cl⁻**. Une telle solution est **électriquement neutre dans son ensemble** : autant de charges positives que de négatives.

## La conduction électrique
Une solution qui contient des ions **conduit le courant électrique** : ce sont les ions, mobiles, qui transportent la charge. L’eau distillée, pauvre en ions, conduit très mal ; l’eau salée conduit bien.

> Dans un métal, ce sont les électrons libres qui se déplacent ; dans une solution, ce sont les ions. Deux porteurs différents, un même courant.

## Danger
C’est parce que l’eau du robinet et la sueur contiennent des ions que l’eau et l’électricité font si mauvais ménage.`,
          },
          questions: [
            ['Qu’est-ce qu’un ion ?', ['Un atome qui a gagné ou perdu un ou plusieurs électrons', 'Un atome sans noyau', 'Un atome plus gros que la normale', 'Une molécule d’eau chargée'], 0, 'Il porte de ce fait une charge électrique.'],
            ['Comment appelle-t-on un ion chargé positivement ?', ['Un cation', 'Un anion', 'Un isotope', 'Un électron'], 0, 'Il a perdu des électrons : Na⁺, Cu²⁺, Fe³⁺.'],
            ['Que signifie la notation Cu²⁺ ?', ['L’atome de cuivre a perdu deux électrons', 'L’atome de cuivre a gagné deux électrons', 'Il y a deux atomes de cuivre', 'Le cuivre a deux protons'], 0, 'Le chiffre en exposant donne le nombre de charges.'],
            ['Que se passe-t-il quand un atome gagne un électron ?', ['Il devient un anion, chargé négativement', 'Il devient un cation', 'Il change d’élément chimique', 'Il perd son noyau'], 0, 'Le noyau ne change jamais : l’élément reste le même.'],
            ['Quels ions obtient-on en dissolvant du sel dans l’eau ?', ['Des ions sodium Na⁺ et chlorure Cl⁻', 'Des ions cuivre et sulfate', 'Des ions hydrogène et hydroxyde', 'Des atomes de sodium et de chlore'], 0, 'La solution reste électriquement neutre dans son ensemble.'],
            ['Pourquoi une solution ionique conduit-elle le courant ?', ['Parce que les ions, mobiles, transportent la charge électrique', 'Parce que l’eau est un métal', 'Parce que les molécules d’eau se déplacent', 'Parce que la solution chauffe'], 0, 'Dans un métal, ce sont les électrons libres qui jouent ce rôle.'],
            ['Quelle solution conduit le mieux le courant électrique ?', ['L’eau salée', 'L’eau distillée', 'L’huile', 'L’alcool pur'], 0, 'Elle est riche en ions ; l’eau distillée en est presque dépourvue.'],
            ['Une solution ionique porte une charge électrique globale.', ['Vrai', 'Faux'], 1, 'Elle est neutre : autant de charges positives que de négatives.'],
          ],
        },
        {
          titre: 'Le pH ou potentiel hydrogène',
          axe: 'Les transformations chimiques',
          lecon: {
            titre: 'Mesurer l’acidité d’une solution',
            cours: `Le **pH** mesure l’**acidité** d’une solution aqueuse. C’est un nombre sans unité, compris en pratique entre **0 et 14**.

## L’échelle
- **pH < 7** : solution **acide** — jus de citron (≈ 2), vinaigre (≈ 3), soda (≈ 3).
- **pH = 7** : solution **neutre** — eau pure.
- **pH > 7** : solution **basique** — eau savonneuse (≈ 9), déboucheur (≈ 13).

Plus le pH est **petit**, plus la solution est **acide** ; plus il est **grand**, plus elle est basique.

## Le lien avec les ions
- Une solution **acide** contient plus d’ions **hydrogène H⁺** que d’ions hydroxyde.
- Une solution **basique** contient plus d’ions **hydroxyde OH⁻**.
- Une solution **neutre** en contient autant.

## Comment le mesurer
- Le **papier pH** : on dépose une goutte et on compare la couleur à l’échelle de teintes. Précision : environ 1 unité.
- Le **pH-mètre** : plus précis (au dixième), il se plonge dans la solution après étalonnage.
- Les **indicateurs colorés** (BBT, phénolphtaléine) : ils changent de couleur autour d’une valeur donnée, sans donner de mesure.

## L’effet d’une dilution
**Diluer une solution acide fait monter son pH** vers 7 ; diluer une solution basique le fait descendre vers 7. On ne rend jamais une solution acide basique en la diluant : on s’approche de la neutralité sans jamais la dépasser.

> Diluer, c’est ajouter de l’eau : le nombre d’ions H⁺ ne change pas, mais leur concentration diminue.

## Sécurité
Les solutions très acides ou très basiques sont **corrosives**. On verse **toujours l’acide dans l’eau**, jamais l’inverse : l’opération dégage de la chaleur et peut projeter le liquide.`,
          },
          questions: [
            ['Entre quelles valeurs le pH est-il compris en pratique ?', ['Entre 0 et 14', 'Entre 0 et 7', 'Entre 1 et 10', 'Entre −7 et 7'], 0, 'Le pH n’a pas d’unité.'],
            ['Quel est le pH d’une solution neutre ?', ['7', '0', '14', '1'], 0, 'C’est le pH de l’eau pure.'],
            ['Quels ions sont majoritaires dans une solution acide ?', ['Les ions hydrogène H⁺', 'Les ions hydroxyde OH⁻', 'Les ions chlorure Cl⁻', 'Les ions sodium Na⁺'], 0, 'Dans une solution basique, ce sont les ions hydroxyde.'],
            ['Quel appareil mesure le pH avec précision ?', ['Le pH-mètre', 'Le voltmètre', 'Le baromètre', 'Le thermomètre'], 0, 'Le papier pH ne donne qu’une valeur approchée, à une unité près.'],
            ['Que devient le pH d’une solution acide que l’on dilue ?', ['Il augmente et se rapproche de 7', 'Il diminue', 'Il ne change pas', 'Il dépasse 7'], 0, 'La concentration en ions H⁺ diminue sans changer de nature.'],
            ['Quelle solution a le pH le plus faible ?', ['Le jus de citron', 'L’eau pure', 'L’eau savonneuse', 'Le déboucheur'], 0, 'Plus le pH est petit, plus la solution est acide.'],
            ['Comment prépare-t-on une solution acide diluée en sécurité ?', ['On verse l’acide dans l’eau', 'On verse l’eau dans l’acide', 'On mélange les deux simultanément', 'On chauffe d’abord l’acide'], 0, 'L’opération dégage de la chaleur et peut provoquer des projections.'],
            ['Diluer suffisamment une solution acide finit par la rendre basique.', ['Vrai', 'Faux'], 1, 'On s’approche de 7 sans jamais le dépasser.'],
          ],
        },
        {
          titre: 'Les réactions aux solutions acides',
          axe: 'Les transformations chimiques',
          lecon: {
            titre: 'Quand un acide attaque un métal',
            cours: `Les solutions acides réagissent avec de nombreux **métaux**. C’est une transformation chimique, avec des réactifs consommés et des produits formés.

## L’acide chlorhydrique et le fer
Le fer disparaît, un **gaz** se dégage et la solution **verdit** :

fer + acide chlorhydrique → dihydrogène + solution de chlorure de fer II
Fe + 2 H⁺ → Fe²⁺ + H₂

- Le gaz est le **dihydrogène**, identifié par une **détonation** à l’approche d’une flamme.
- La couleur verte signale les ions **fer II (Fe²⁺)**, confirmés par un précipité vert à la soude.

## Ce qui se passe au niveau des ions
Ce sont les ions **hydrogène H⁺** de l’acide qui réagissent. Les ions chlorure Cl⁻ ne participent pas : ce sont des **ions spectateurs**.

## Avec d’autres métaux
Le zinc, l’aluminium et le magnésium réagissent de la même façon en dégageant du dihydrogène. **Le cuivre, l’or et l’argent ne réagissent pas** avec l’acide chlorhydrique : tous les métaux ne sont pas attaqués.

## La corrosion, la même chimie au ralenti
La **rouille** est une transformation chimique du fer en présence d’**eau et de dioxygène**. On la ralentit en isolant le métal (peinture, huile, galvanisation) ou en utilisant des **alliages** inoxydables.

> Le fer ne « s’use » pas : il se transforme. La masse de rouille formée est supérieure à celle du fer disparu, car des atomes d’oxygène s’y ajoutent.

## Sécurité
Les acides concentrés sont **corrosifs** ; le dihydrogène est **explosif** en présence d’air et d’une flamme. Les expériences se font en petite quantité, sous hotte ou en salle ventilée, avec lunettes et gants.`,
          },
          questions: [
            ['Quel gaz se dégage quand l’acide chlorhydrique attaque le fer ?', ['Le dihydrogène', 'Le dioxygène', 'Le dioxyde de carbone', 'Le diazote'], 0, 'On l’identifie par une détonation à l’approche d’une flamme.'],
            ['Quelle couleur prend la solution après réaction de l’acide chlorhydrique avec le fer ?', ['Verte, à cause des ions fer II', 'Bleue, à cause des ions cuivre', 'Rouille, à cause des ions fer III', 'Elle reste incolore'], 0, 'Un test à la soude donne un précipité vert.'],
            ['Quels ions de l’acide réagissent réellement avec le métal ?', ['Les ions hydrogène H⁺', 'Les ions chlorure Cl⁻', 'Les ions hydroxyde OH⁻', 'Les ions sodium Na⁺'], 0, 'Les ions chlorure sont des ions spectateurs.'],
            ['Quel métal ne réagit pas avec l’acide chlorhydrique ?', ['Le cuivre', 'Le zinc', 'Le fer', 'Le magnésium'], 0, 'L’or et l’argent non plus : tous les métaux ne sont pas attaqués.'],
            ['Qu’est-ce que la rouille ?', ['Une transformation chimique du fer en présence d’eau et de dioxygène', 'Un dépôt de poussière sur le métal', 'Un changement d’état du fer', 'Un mélange de fer et de peinture'], 0, 'C’est une corrosion, donc une réaction chimique lente.'],
            ['Comment protège-t-on le fer de la corrosion ?', ['En l’isolant par une peinture, une huile ou une galvanisation', 'En le chauffant régulièrement', 'En le plongeant dans l’eau salée', 'En le frottant avec un acide'], 0, 'On peut aussi employer des alliages inoxydables.'],
            ['Quel danger présente le dihydrogène produit par la réaction ?', ['Il est explosif en présence d’air et d’une flamme', 'Il est corrosif pour la peau', 'Il est radioactif', 'Il éteint les flammes'], 0, 'Les quantités manipulées doivent rester très faibles.'],
            ['La masse de rouille formée est inférieure à la masse de fer disparu.', ['Vrai', 'Faux'], 1, 'Elle est supérieure : des atomes d’oxygène se sont ajoutés au fer.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : L'organisation de la matière dans l'Univers
        // ===================================================================
        {
          titre: 'L’Univers et le Système solaire',
          axe: 'L’organisation de la matière dans l’Univers',
          lecon: {
            titre: 'Des échelles qui dépassent l’imagination',
            cours: `L’**Univers** contient des centaines de milliards de **galaxies**, chacune faite de centaines de milliards d’**étoiles**. Il s’est formé il y a environ **13,8 milliards d’années**.

## Notre adresse cosmique
Terre → **Système solaire** → **Voie lactée** (notre galaxie) → amas de galaxies → Univers.

## Le Système solaire
Il est né il y a environ **4,6 milliards d’années**. Au centre, le **Soleil**, une étoile — c’est-à-dire un corps qui **produit** sa propre lumière. Autour, **huit planètes** :
- quatre **telluriques** (rocheuses) : Mercure, Vénus, la Terre, Mars ;
- quatre **gazeuses** : Jupiter, Saturne, Uranus, Neptune.

S’y ajoutent des satellites (la Lune), des astéroïdes et des comètes. Les planètes et les satellites ne **produisent pas** de lumière : ils la **diffusent**.

## Mesurer les distances
- L’**année-lumière (a.l.)** est la distance parcourue par la lumière en un an, soit environ **9,5 × 10¹² km**.
- La lumière va à environ **300 000 km/s** dans le vide.
- Le Soleil est à **8 minutes-lumière** de la Terre : nous le voyons tel qu’il était il y a 8 minutes.
- L’étoile la plus proche, Proxima du Centaure, est à environ **4,2 années-lumière**.

> Regarder loin, c’est regarder tôt : plus un objet est distant, plus la lumière qu’on en reçoit est ancienne.

## Calculer une distance
**d = v × t**, avec v la vitesse de la lumière et t la durée du trajet. Attention aux unités : une durée en secondes et une vitesse en km/s donnent une distance en km.`,
          },
          questions: [
            ['Quel âge a l’Univers environ ?', ['13,8 milliards d’années', '4,6 milliards d’années', '1 million d’années', '100 milliards d’années'], 0, 'Le Système solaire, lui, a environ 4,6 milliards d’années.'],
            ['Comment s’appelle notre galaxie ?', ['La Voie lactée', 'Andromède', 'Le Système solaire', 'Proxima du Centaure'], 0, 'Elle contient des centaines de milliards d’étoiles.'],
            ['Combien de planètes compte le Système solaire ?', ['Huit', 'Neuf', 'Sept', 'Douze'], 0, 'Quatre telluriques et quatre gazeuses.'],
            ['Qu’est-ce qu’une année-lumière ?', ['La distance parcourue par la lumière en un an', 'La durée d’une révolution terrestre', 'Le temps mis par la lumière pour atteindre le Soleil', 'La distance Terre-Soleil'], 0, 'Environ 9,5 × 10¹² km : c’est une distance, pas une durée.'],
            ['Quelle est la vitesse de la lumière dans le vide ?', ['Environ 300 000 km/s', 'Environ 3 000 km/s', 'Environ 300 km/s', 'Environ 30 000 km/h'], 0, 'C’est la vitesse limite de l’Univers.'],
            ['Combien de temps la lumière du Soleil met-elle pour nous parvenir ?', ['Environ 8 minutes', 'Environ 1 seconde', 'Environ 1 heure', 'Environ 1 an'], 0, 'Nous voyons donc le Soleil tel qu’il était il y a 8 minutes.'],
            ['Quelle différence y a-t-il entre une étoile et une planète ?', ['L’étoile produit sa lumière, la planète la diffuse', 'L’étoile est plus proche de nous', 'La planète est plus chaude', 'L’étoile tourne autour de la planète'], 0, 'Le Soleil est une étoile, la Terre une planète.'],
            ['La Lune produit sa propre lumière.', ['Vrai', 'Faux'], 1, 'Elle diffuse la lumière qu’elle reçoit du Soleil.'],
          ],
        },
        {
          titre: 'La continuité de la matière dans l’Univers',
          axe: 'L’organisation de la matière dans l’Univers',
          lecon: {
            titre: 'Les mêmes atomes ici et dans les étoiles',
            cours: `La matière est faite **partout des mêmes constituants** : les mêmes atomes composent une pierre, un être vivant, l’atmosphère de Mars et une étoile lointaine. C’est ce qu’on appelle la **continuité de la matière** dans l’Univers.

## Les briques élémentaires
- Les **atomes** — une centaine d’éléments différents, dont l’hydrogène et l’hélium constituent l’essentiel de l’Univers.
- Les **molécules**, assemblages d’atomes : H₂O, CO₂, O₂.
- Les **ions**, atomes chargés.

## Une organisation à toutes les échelles
De l’atome (10⁻¹⁰ m) à l’Univers observable (10²⁶ m), la matière s’organise en **niveaux emboîtés** : atomes → molécules → cellules → organismes → planètes → étoiles → galaxies.

## Comment le sait-on ?
La **lumière** émise par une étoile porte la signature de sa composition : chaque élément chimique émet ou absorbe des couleurs précises. En analysant cette lumière (le **spectre**), on identifie les éléments présents à des millions d’années-lumière — sans jamais y aller. C’est ainsi que l’hélium a été découvert dans le Soleil avant de l’être sur Terre.

## L’origine des éléments
- L’**hydrogène** et l’**hélium** se sont formés peu après la naissance de l’Univers.
- Les éléments plus lourds (carbone, oxygène, fer) sont fabriqués **au cœur des étoiles**, puis dispersés lors de leur explosion.

> Les atomes qui composent notre corps ont été fabriqués dans des étoiles mortes avant la naissance du Soleil.

## L’unité de la matière
Les mêmes lois physiques et chimiques s’appliquent ici et là-bas. C’est ce postulat, vérifié par l’observation, qui rend l’astrophysique possible.`,
          },
          questions: [
            ['Que signifie la continuité de la matière dans l’Univers ?', ['La matière est faite partout des mêmes atomes', 'La matière est répartie uniformément dans l’espace', 'L’Univers ne contient aucun vide', 'Toute la matière est en mouvement continu'], 0, 'Une pierre, un être vivant et une étoile partagent les mêmes éléments.'],
            ['Quels sont les deux éléments les plus abondants de l’Univers ?', ['L’hydrogène et l’hélium', 'Le carbone et l’oxygène', 'Le fer et le silicium', 'L’azote et l’argon'], 0, 'Ils se sont formés peu après la naissance de l’Univers.'],
            ['Comment connaît-on la composition d’une étoile lointaine ?', ['En analysant le spectre de sa lumière', 'En y envoyant une sonde', 'En mesurant sa masse', 'En comptant ses planètes'], 0, 'Chaque élément chimique émet ou absorbe des couleurs qui lui sont propres.'],
            ['Où sont fabriqués les éléments chimiques plus lourds que l’hélium ?', ['Au cœur des étoiles', 'Dans les comètes', 'Dans l’atmosphère des planètes', 'Dans le vide interstellaire'], 0, 'Ils sont dispersés lors de l’explosion des étoiles.'],
            ['Quel élément a été identifié dans le Soleil avant de l’être sur Terre ?', ['L’hélium', 'L’hydrogène', 'Le fer', 'Le carbone'], 0, 'Son nom vient d’ailleurs de Helios, le Soleil.'],
            ['Quel est l’ordre de grandeur de la taille d’un atome ?', ['10⁻¹⁰ m', '10⁻³ m', '10⁻⁶ m', '10⁻²⁰ m'], 0, 'Contre environ 10²⁶ m pour l’Univers observable.'],
            ['Comment la matière s’organise-t-elle dans l’Univers ?', ['En niveaux emboîtés, de l’atome aux galaxies', 'De façon totalement désordonnée', 'Uniquement en molécules', 'En couches concentriques autour de la Terre'], 0, 'Atomes, molécules, cellules, organismes, planètes, étoiles, galaxies.'],
            ['Les lois de la physique diffèrent d’une galaxie à l’autre.', ['Vrai', 'Faux'], 1, 'C’est leur universalité, vérifiée par l’observation, qui rend l’astrophysique possible.'],
          ],
        },
        {
          titre: 'Les constituants de l’atome',
          axe: 'L’organisation de la matière dans l’Univers',
          lecon: {
            titre: 'Un noyau minuscule, un immense vide',
            cours: `Un **atome** est constitué d’un **noyau** central entouré d’**électrons** en mouvement.

## Le noyau
Il contient deux sortes de particules, appelées **nucléons** :
- les **protons**, de charge **positive** ;
- les **neutrons**, de charge **nulle**.

Le noyau concentre presque **toute la masse** de l’atome.

## Les électrons
Ils portent une charge **négative** et se déplacent autour du noyau. Leur masse est environ **2 000 fois plus petite** que celle d’un nucléon.

## La neutralité de l’atome
Un atome possède **autant de protons que d’électrons** : il est donc **électriquement neutre**. Devenir un ion, c’est perdre ou gagner des électrons — jamais des protons.

## Une structure essentiellement vide
Le noyau est environ **100 000 fois plus petit** que l’atome. Si l’atome était un stade de football, le noyau serait une bille au centre du terrain : **l’atome est essentiellement du vide**.

## Ce qui identifie un élément
C’est le **nombre de protons** du noyau, et lui seul. Un atome d’hydrogène a 1 proton, un atome de carbone en a 6, un atome d’oxygène 8. Changer ce nombre, c’est changer d’élément chimique.

## Les symboles
Chaque élément a un **symbole** : une majuscule, parfois suivie d’une minuscule — H, C, O, N, Fe, Cu, Na, Cl. La casse compte : **Co** (cobalt) n’est pas **CO** (monoxyde de carbone).

> Les molécules ne sont que des assemblages d’atomes : H₂O, deux atomes d’hydrogène et un d’oxygène ; le nombre en indice compte les atomes qui le précèdent.`,
          },
          questions: [
            ['Quelles particules composent le noyau d’un atome ?', ['Les protons et les neutrons', 'Les protons et les électrons', 'Les électrons et les neutrons', 'Uniquement les protons'], 0, 'On les appelle collectivement les nucléons.'],
            ['Quelle est la charge d’un neutron ?', ['Nulle', 'Positive', 'Négative', 'Variable'], 0, 'Le proton est positif, l’électron négatif.'],
            ['Pourquoi un atome est-il électriquement neutre ?', ['Parce qu’il a autant de protons que d’électrons', 'Parce qu’il n’a pas de charge du tout', 'Parce que les neutrons annulent les protons', 'Parce que les électrons sont immobiles'], 0, 'Gagner ou perdre des électrons en fait un ion.'],
            ['Où se concentre presque toute la masse d’un atome ?', ['Dans le noyau', 'Dans les électrons', 'Dans le vide qui l’entoure', 'Elle est répartie uniformément'], 0, 'Un électron est environ 2 000 fois plus léger qu’un nucléon.'],
            ['Combien de fois le noyau est-il plus petit que l’atome ?', ['Environ 100 000 fois', 'Environ 10 fois', 'Environ 1 000 fois', 'Ils ont la même taille'], 0, 'L’atome est donc essentiellement constitué de vide.'],
            ['Qu’est-ce qui identifie un élément chimique ?', ['Son nombre de protons', 'Son nombre de neutrons', 'Son nombre d’électrons', 'Sa masse totale'], 0, 'Le carbone a 6 protons, l’oxygène 8.'],
            ['Que représente le 2 dans la formule H₂O ?', ['Le nombre d’atomes d’hydrogène dans la molécule', 'Le nombre de molécules d’eau', 'La charge de la molécule', 'Le nombre de liaisons'], 0, 'L’indice compte les atomes du symbole qui le précède.'],
            ['Un atome peut gagner ou perdre des protons pour devenir un ion.', ['Vrai', 'Faux'], 1, 'Seuls les électrons sont échangés : changer le nombre de protons changerait d’élément.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 : Mouvements et interactions
        // ===================================================================
        {
          titre: 'Les mouvements',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Décrire un mouvement, et par rapport à quoi',
            cours: `Décrire un mouvement, c’est indiquer **par rapport à quoi** on l’observe, quelle **trajectoire** il suit et à quelle **vitesse**.

## La relativité du mouvement
Un mouvement ne se décrit **jamais dans l’absolu** : il faut préciser le **référentiel**, c’est-à-dire l’objet par rapport auquel on observe.

Un passager assis dans un train est **immobile** dans le référentiel du train, et **en mouvement** dans le référentiel du quai. Les deux descriptions sont vraies.

## La trajectoire
C’est la ligne décrite par l’objet au cours du temps :
- **rectiligne** — une ligne droite ;
- **circulaire** — un cercle ;
- **curviligne** — une courbe quelconque.

Elle dépend, elle aussi, du référentiel choisi.

## La vitesse
**v = d ÷ t** : distance parcourue divisée par la durée du parcours.
- en **m/s** si d est en mètres et t en secondes ;
- en **km/h** si d est en kilomètres et t en heures ;
- conversion : **diviser par 3,6** pour passer des km/h aux m/s (36 km/h = 10 m/s).

On distingue la **vitesse moyenne** (sur tout le trajet) de la **vitesse instantanée** (à un instant donné, celle du compteur).

## Les régimes de mouvement
- **Uniforme** : la vitesse ne change pas.
- **Accéléré** : la vitesse augmente.
- **Ralenti** (ou décéléré) : la vitesse diminue.

> Un mouvement **rectiligne uniforme** cumule les deux : trajectoire droite ET vitesse constante. C’est le seul cas où l’objet ne subit aucune force résultante.

## La chronophotographie
Une série de photos prises à intervalles réguliers : plus les positions sont espacées, plus l’objet va vite. C’est l’outil de base pour identifier un régime de mouvement.`,
          },
          questions: [
            ['De quoi dépend la description d’un mouvement ?', ['Du référentiel choisi', 'De la masse de l’objet', 'De la couleur de l’objet', 'De rien : elle est absolue'], 0, 'Un passager de train est immobile dans le train et en mouvement par rapport au quai.'],
            ['Qu’appelle-t-on trajectoire ?', ['La ligne décrite par l’objet au cours du temps', 'La vitesse de l’objet', 'La durée du trajet', 'La force appliquée'], 0, 'Elle peut être rectiligne, circulaire ou curviligne.'],
            ['Quelle est la formule de la vitesse ?', ['v = d ÷ t', 'v = d × t', 'v = t ÷ d', 'v = d + t'], 0, 'Distance parcourue divisée par la durée.'],
            ['Comment convertit-on une vitesse de km/h en m/s ?', ['On divise par 3,6', 'On multiplie par 3,6', 'On divise par 1 000', 'On multiplie par 60'], 0, '36 km/h correspondent à 10 m/s.'],
            ['Qu’est-ce qu’un mouvement uniforme ?', ['Un mouvement dont la vitesse ne change pas', 'Un mouvement en ligne droite', 'Un mouvement circulaire', 'Un mouvement sans force'], 0, 'Uniforme parle de la vitesse, rectiligne parle de la trajectoire.'],
            ['Quelle différence y a-t-il entre vitesse moyenne et vitesse instantanée ?', ['La moyenne porte sur tout le trajet, l’instantanée sur un instant précis', 'La moyenne est toujours plus grande', 'L’instantanée ne se mesure pas', 'Ce sont deux mots pour la même grandeur'], 0, 'Le compteur d’une voiture affiche la vitesse instantanée.'],
            ['Que montre une chronophotographie où les positions s’espacent de plus en plus ?', ['Un mouvement accéléré', 'Un mouvement uniforme', 'Un mouvement ralenti', 'Un objet immobile'], 0, 'Des intervalles de temps égaux, des distances croissantes.'],
            ['Un objet peut être à la fois immobile et en mouvement.', ['Vrai', 'Faux'], 0, 'Selon le référentiel choisi : c’est la relativité du mouvement.'],
          ],
        },
        {
          titre: 'Interactions et forces',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Ce qui met en mouvement, ce qui arrête',
            cours: `Deux objets sont en **interaction** lorsqu’ils agissent l’un sur l’autre. On modélise cette action par une **force**.

## Deux familles d’interactions
- **De contact** : les objets se touchent (la main qui pousse, le sol qui soutient, les frottements de l’air).
- **À distance** : sans contact (la **gravitation**, l’**interaction magnétique**, l’**interaction électrostatique**).

## Représenter une force
Une force se représente par une **flèche** (un vecteur) qui porte quatre informations :
- son **point d’application** (où elle s’exerce) ;
- sa **direction** (la droite qui la porte) ;
- son **sens** (vers où elle pousse) ;
- sa **valeur**, en **newtons (N)**, mesurée au **dynamomètre**, et traduite par la longueur de la flèche.

## Les effets d’une force
Une force peut :
- **mettre en mouvement** un objet immobile ;
- **modifier la vitesse** d’un objet en mouvement ;
- **modifier la trajectoire** ;
- **déformer** l’objet.

## Le principe des actions réciproques
Si A exerce une force sur B, alors **B exerce sur A une force de même direction, de même valeur et de sens opposé**. Le nageur pousse l’eau vers l’arrière, l’eau le pousse vers l’avant.

## Forces qui se compensent
Quand les forces exercées sur un objet **se compensent** (même direction, sens opposés, valeurs égales), l’objet reste **immobile** ou garde un **mouvement rectiligne uniforme**. Si elles ne se compensent pas, sa vitesse ou sa trajectoire **change**.

> Un objet n’a pas besoin d’une force pour continuer d’avancer : il en a besoin pour **changer** de mouvement.`,
          },
          questions: [
            ['Comment appelle-t-on l’action qu’un objet exerce sur un autre ?', ['Une force', 'Une énergie', 'Une puissance', 'Une vitesse'], 0, 'Elle modélise une interaction entre deux objets.'],
            ['Quelle interaction s’exerce sans contact ?', ['L’interaction gravitationnelle', 'Le frottement', 'La poussée d’une main', 'Le soutien d’une table'], 0, 'L’interaction magnétique et l’électrostatique aussi.'],
            ['Dans quelle unité mesure-t-on une force ?', ['Le newton (N)', 'Le joule (J)', 'Le watt (W)', 'Le kilogramme (kg)'], 0, 'On la mesure avec un dynamomètre.'],
            ['Combien d’informations une flèche représentant une force porte-t-elle ?', ['Quatre : point d’application, direction, sens et valeur', 'Deux : direction et valeur', 'Une seule : la valeur', 'Trois : direction, sens et masse'], 0, 'La longueur de la flèche traduit la valeur.'],
            ['Quel effet une force ne peut-elle PAS produire ?', ['Changer la nature chimique de l’objet', 'Mettre l’objet en mouvement', 'Modifier sa trajectoire', 'Le déformer'], 0, 'Une force agit sur le mouvement ou la forme, pas sur la composition.'],
            ['Que dit le principe des actions réciproques ?', ['Si A exerce une force sur B, B exerce sur A une force opposée de même valeur', 'La force la plus grande l’emporte toujours', 'Les forces s’additionnent toujours', 'Une force à distance est plus faible qu’une force de contact'], 0, 'Le nageur pousse l’eau, l’eau pousse le nageur.'],
            ['Que se passe-t-il quand les forces exercées sur un objet se compensent ?', ['Il reste immobile ou garde un mouvement rectiligne uniforme', 'Il s’arrête immédiatement', 'Il accélère', 'Il se déforme'], 0, 'Il faut une force résultante non nulle pour changer le mouvement.'],
            ['Un objet en mouvement a besoin d’une force pour continuer d’avancer.', ['Vrai', 'Faux'], 1, 'Il en a besoin pour changer de mouvement, pas pour le maintenir.'],
          ],
        },
        {
          titre: 'Poids et gravitation',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'La force qui tient les planètes et fait tomber les pommes',
            cours: `La **gravitation** est une interaction **attractive** qui s’exerce **à distance** entre deux corps possédant une masse.

## Ce dont elle dépend
La force d’attraction est d’autant plus grande que :
- les **masses** des deux corps sont grandes ;
- la **distance** qui les sépare est petite.

Elle est universelle : elle s’exerce entre la Terre et la Lune comme entre deux personnes — mais avec des masses ordinaires, elle est imperceptible.

## Le poids
Le **poids** est la force d’attraction exercée par un astre sur un objet situé près de lui.

**P = m × g**

- P est le poids, en **newtons (N)** ;
- m est la **masse**, en **kilogrammes (kg)** ;
- g est l’**intensité de la pesanteur**, en **N/kg** : environ **9,8 N/kg** sur Terre, **1,6 N/kg** sur la Lune.

Le poids est **vertical**, dirigé **vers le bas** (vers le centre de l’astre), et son point d’application est le **centre de gravité** de l’objet.

## Masse et poids, à ne jamais confondre
| | Masse | Poids |
|---|---|---|
| Ce que c’est | quantité de matière | force d’attraction |
| Unité | kilogramme (kg) | newton (N) |
| Instrument | balance | dynamomètre |
| Sur la Lune | **inchangée** | **divisé par 6** |

> Un astronaute de 70 kg reste un astronaute de 70 kg sur la Lune : c’est son poids qui passe de 686 N à environ 112 N.

## Gravitation et Système solaire
C’est la gravitation qui maintient les planètes en orbite autour du Soleil et la Lune autour de la Terre : sans elle, chaque astre partirait en ligne droite.`,
          },
          questions: [
            ['De quoi dépend la force d’attraction gravitationnelle ?', ['Des masses des deux corps et de la distance qui les sépare', 'De leur couleur et de leur volume', 'De leur température', 'De leur vitesse uniquement'], 0, 'Elle augmente avec les masses et diminue avec la distance.'],
            ['Quelle est la formule du poids ?', ['P = m × g', 'P = m ÷ g', 'P = g ÷ m', 'P = m + g'], 0, 'Le poids en newtons, la masse en kilogrammes.'],
            ['Quelle est l’unité du poids ?', ['Le newton (N)', 'Le kilogramme (kg)', 'Le joule (J)', 'Le pascal (Pa)'], 0, 'Le kilogramme est l’unité de la masse.'],
            ['Que vaut environ l’intensité de la pesanteur sur Terre ?', ['9,8 N/kg', '1,6 N/kg', '98 N/kg', '0,98 N/kg'], 0, 'Sur la Lune, elle vaut environ 1,6 N/kg.'],
            ['Que devient la masse d’un objet transporté sur la Lune ?', ['Elle ne change pas', 'Elle est divisée par 6', 'Elle est multipliée par 6', 'Elle devient nulle'], 0, 'C’est le poids, et lui seul, qui est divisé par 6.'],
            ['Quel instrument mesure un poids ?', ['Le dynamomètre', 'La balance', 'Le baromètre', 'Le voltmètre'], 0, 'La balance mesure une masse, en kilogrammes.'],
            ['Quelle est la direction du poids ?', ['Verticale, vers le bas', 'Horizontale', 'Vers le haut', 'Elle change selon le mouvement'], 0, 'Il est dirigé vers le centre de l’astre.'],
            ['Sans la gravitation, les planètes continueraient de tourner autour du Soleil.', ['Vrai', 'Faux'], 1, 'Elles partiraient en ligne droite : c’est la gravitation qui courbe leur trajectoire.'],
          ],
        },
        // ===================================================================
        // Chapitre 5 : L'énergie
        // ===================================================================
        {
          titre: 'Les différentes formes d’énergie',
          axe: 'L’énergie',
          lecon: {
            titre: 'Ce qui permet à un système d’agir',
            cours: `L’**énergie** est ce qui permet à un système de produire une action : mettre en mouvement, chauffer, éclairer, déformer. Elle se mesure en **joules (J)**.

## Les principales formes
- **Cinétique** : liée au **mouvement** d’un objet. Ec = ½ × m × v².
- **De position** (ou potentielle de pesanteur) : liée à la **hauteur** d’un objet. Epp = m × g × h.
- **Thermique** : liée à l’agitation des particules — la chaleur.
- **Chimique** : stockée dans les liaisons entre atomes (aliments, carburants, piles).
- **Électrique** : liée au déplacement des charges.
- **Lumineuse** (ou rayonnante) : transportée par la lumière.
- **Nucléaire** : stockée dans le noyau des atomes.

## Les unités
- Le **joule (J)** est l’unité légale.
- Le **kilowattheure (kWh)** sert pour l’électricité domestique : **1 kWh = 3,6 × 10⁶ J**.
- La **calorie** apparaît encore en nutrition : 1 cal ≈ 4,18 J.

## Les sources d’énergie
- **Renouvelables** : solaire, éolien, hydraulique, géothermie, biomasse — elles se reconstituent à l’échelle humaine.
- **Non renouvelables** : charbon, pétrole, gaz, uranium — leurs réserves sont limitées.

> Une source d’énergie n’est pas une forme d’énergie : le pétrole est une source, l’énergie chimique qu’il contient est une forme.

## L’ordre de grandeur, pour se repérer
Soulever une pomme d’un mètre : environ 1 J. Une barre chocolatée : environ 1 000 000 J. Un radiateur de 1 000 W pendant une heure : 3,6 × 10⁶ J, soit 1 kWh.`,
          },
          questions: [
            ['Quelle est l’unité légale de l’énergie ?', ['Le joule (J)', 'Le watt (W)', 'Le newton (N)', 'Le volt (V)'], 0, 'Le watt est l’unité de la puissance, pas de l’énergie.'],
            ['À quelle grandeur l’énergie cinétique est-elle liée ?', ['Au mouvement de l’objet', 'À sa hauteur', 'À sa température', 'À sa composition chimique'], 0, 'Ec = ½ × m × v².'],
            ['Quelle forme d’énergie un aliment contient-il ?', ['De l’énergie chimique', 'De l’énergie cinétique', 'De l’énergie nucléaire', 'De l’énergie électrique'], 0, 'Elle est stockée dans les liaisons entre atomes.'],
            ['À combien de joules correspond 1 kWh ?', ['3,6 × 10⁶ J', '1 000 J', '3 600 J', '10⁶ J'], 0, 'Un appareil de 1 000 W pendant une heure consomme 1 kWh.'],
            ['Quelle source d’énergie est renouvelable ?', ['L’énergie éolienne', 'Le charbon', 'Le pétrole', 'L’uranium'], 0, 'Elle se reconstitue à l’échelle d’une vie humaine.'],
            ['De quoi dépend l’énergie de position d’un objet ?', ['De sa masse et de sa hauteur', 'De sa vitesse', 'De sa température', 'De sa couleur'], 0, 'Epp = m × g × h.'],
            ['Quelle est la différence entre une source et une forme d’énergie ?', ['La source est ce d’où l’on tire l’énergie, la forme est la manière dont elle se présente', 'Ce sont deux mots pour la même chose', 'La source est toujours renouvelable', 'La forme se mesure en watts'], 0, 'Le pétrole est une source, l’énergie chimique une forme.'],
            ['Le watt est une unité d’énergie.', ['Vrai', 'Faux'], 1, 'C’est l’unité de la puissance : une énergie par unité de temps.'],
          ],
        },
        {
          titre: 'Transferts et conversions d’énergie',
          axe: 'L’énergie',
          lecon: {
            titre: 'L’énergie change de forme et change de lieu',
            cours: `Deux mots à distinguer :
- un **transfert** déplace l’énergie **d’un objet à un autre**, sans changer sa forme ;
- une **conversion** change la **forme** de l’énergie à l’intérieur d’un système.

## Les trois modes de transfert thermique
- **Conduction** : de proche en proche dans un solide (la cuillère qui chauffe dans la casserole).
- **Convection** : par déplacement de matière dans un fluide (l’air chaud qui monte).
- **Rayonnement** : sans support matériel (la chaleur du Soleil qui traverse le vide).

> La chaleur va **toujours du corps le plus chaud vers le plus froid**, jamais l’inverse spontanément.

## Les convertisseurs
Chaque appareil convertit une forme d’énergie en une autre :
- **lampe** : électrique → lumineuse (+ thermique) ;
- **moteur électrique** : électrique → cinétique (+ thermique) ;
- **panneau photovoltaïque** : lumineuse → électrique ;
- **alternateur** : cinétique → électrique ;
- **pile** : chimique → électrique ;
- **chaudière** : chimique → thermique.

## La chaîne énergétique
On la représente par un schéma : **source → convertisseur → utilisation**, avec des flèches pour chaque transfert, et une flèche de côté pour les **pertes**, presque toujours thermiques.

Exemple d’une centrale thermique : énergie chimique du charbon → énergie thermique (chaudière) → énergie cinétique (turbine) → énergie électrique (alternateur).

## Le rendement
**rendement = énergie utile ÷ énergie reçue**, exprimé en pourcentage. Il est **toujours inférieur à 100 %** : une part de l’énergie part en chaleur non désirée. Une lampe à incandescence convertit environ 5 % de l’électricité en lumière ; une LED plus de 30 %.`,
          },
          questions: [
            ['Quelle est la différence entre transfert et conversion d’énergie ?', ['Le transfert déplace l’énergie, la conversion change sa forme', 'Le transfert change la forme, la conversion déplace l’énergie', 'Ce sont deux mots pour la même chose', 'Le transfert ne concerne que l’électricité'], 0, 'Un radiateur transfère, une lampe convertit.'],
            ['Quel mode de transfert thermique se fait sans support matériel ?', ['Le rayonnement', 'La conduction', 'La convection', 'La conversion'], 0, 'C’est ainsi que la chaleur du Soleil traverse le vide.'],
            ['Quel mode de transfert explique qu’une cuillère chauffe dans une casserole ?', ['La conduction', 'La convection', 'Le rayonnement', 'La combustion'], 0, 'La chaleur se propage de proche en proche dans le métal.'],
            ['Quelle conversion réalise un panneau photovoltaïque ?', ['Lumineuse → électrique', 'Électrique → lumineuse', 'Chimique → électrique', 'Cinétique → électrique'], 0, 'L’alternateur, lui, convertit du cinétique en électrique.'],
            ['Quelle conversion réalise une pile ?', ['Chimique → électrique', 'Électrique → chimique', 'Thermique → électrique', 'Lumineuse → chimique'], 0, 'L’énergie est stockée dans les liaisons entre atomes.'],
            ['Comment calcule-t-on un rendement ?', ['Énergie utile ÷ énergie reçue', 'Énergie reçue ÷ énergie utile', 'Énergie utile × énergie perdue', 'Énergie perdue ÷ énergie utile'], 0, 'On l’exprime le plus souvent en pourcentage.'],
            ['Que représente la flèche latérale d’une chaîne énergétique ?', ['Les pertes, presque toujours thermiques', 'L’énergie utile', 'La source d’énergie', 'La puissance de l’appareil'], 0, 'Aucun convertisseur réel n’est parfait.'],
            ['La chaleur peut passer spontanément d’un corps froid à un corps chaud.', ['Vrai', 'Faux'], 1, 'Le transfert thermique va toujours du plus chaud vers le plus froid.'],
          ],
        },
        {
          titre: 'Calculer la vitesse et l’énergie cinétique',
          axe: 'L’énergie',
          lecon: {
            titre: 'Pourquoi doubler la vitesse quadruple le danger',
            cours: `L’**énergie cinétique** est l’énergie que possède un objet du fait de son **mouvement**.

**Ec = ½ × m × v²**

- Ec en **joules (J)** ;
- m en **kilogrammes (kg)** ;
- v en **mètres par seconde (m/s)** — jamais en km/h.

## Le calcul, étape par étape
Une voiture de 1 000 kg roulant à 72 km/h :
1. convertir : 72 ÷ 3,6 = **20 m/s** ;
2. appliquer : Ec = 0,5 × 1 000 × 20² = 0,5 × 1 000 × 400 = **200 000 J**.

## Le carré, tout est là
La vitesse est **au carré** : c’est la clé du chapitre.
- Doubler la masse **double** l’énergie cinétique.
- Doubler la **vitesse** la **multiplie par 4**.
- La multiplier par 3 la multiplie par **9**.

> Passer de 50 à 100 km/h ne double pas la violence d’un choc : elle est **multipliée par quatre**. C’est le calcul qui fonde toutes les limitations de vitesse.

## La distance d’arrêt
Elle se compose de deux morceaux :
- la **distance de réaction** — celle parcourue pendant le temps de réaction, environ 1 seconde ;
- la **distance de freinage** — celle nécessaire pour dissiper l’énergie cinétique, qui augmente comme le **carré** de la vitesse.

Alcool, fatigue et téléphone allongent le temps de réaction ; la pluie et l’usure des pneus allongent le freinage.

## Ce que devient l’énergie au freinage
Elle est **convertie en énergie thermique** par les frottements des freins : les disques chauffent. L’énergie n’a pas disparu, elle a changé de forme.`,
          },
          questions: [
            ['Quelle est la formule de l’énergie cinétique ?', ['Ec = ½ × m × v²', 'Ec = m × v', 'Ec = m × g × h', 'Ec = ½ × m × v'], 0, 'La vitesse intervient au carré.'],
            ['Dans quelle unité doit être exprimée la vitesse dans cette formule ?', ['En mètres par seconde (m/s)', 'En kilomètres par heure (km/h)', 'En mètres par heure', 'En newtons'], 0, 'On divise les km/h par 3,6 avant tout calcul.'],
            ['Par combien l’énergie cinétique est-elle multipliée si la vitesse double ?', ['4', '2', '8', '16'], 0, 'La vitesse est élevée au carré : 2² = 4.'],
            ['Par combien l’énergie cinétique est-elle multipliée si la masse double ?', ['2', '4', '8', 'Elle ne change pas'], 0, 'La masse, elle, intervient au premier degré.'],
            ['Quelle est l’énergie cinétique d’une voiture de 1 000 kg roulant à 20 m/s ?', ['200 000 J', '20 000 J', '400 000 J', '10 000 J'], 0, 'Ec = 0,5 × 1 000 × 400.'],
            ['De quoi se compose la distance d’arrêt ?', ['De la distance de réaction et de la distance de freinage', 'De la distance de freinage seulement', 'De la distance parcourue avant le virage', 'De la longueur du véhicule'], 0, 'Le temps de réaction est d’environ une seconde.'],
            ['Que devient l’énergie cinétique d’un véhicule qui freine ?', ['Elle est convertie en énergie thermique par les frottements', 'Elle disparaît', 'Elle devient de l’énergie chimique', 'Elle est stockée dans le moteur'], 0, 'Les disques de frein chauffent : l’énergie a changé de forme.'],
            ['Doubler sa vitesse double la violence d’un choc.', ['Vrai', 'Faux'], 1, 'Elle est multipliée par quatre : c’est tout le sens du carré dans la formule.'],
          ],
        },
        {
          titre: 'Conservation et pertes d’énergie',
          axe: 'L’énergie',
          lecon: {
            titre: 'Rien ne se perd, mais tout se dégrade',
            cours: `Le **principe de conservation de l’énergie** est l’un des plus solides de la physique : **l’énergie ne se crée pas et ne se détruit pas, elle se transforme**.

## Ce que cela implique
Dans un système isolé, la somme de toutes les formes d’énergie reste **constante**. Une bille qui tombe convertit son énergie de position en énergie cinétique : la somme des deux ne varie pas, tant qu’on néglige les frottements.

## Alors pourquoi parle-t-on de « pertes » ?
Parce qu’une partie de l’énergie prend une forme **inutilisable pour l’usage visé** : presque toujours de l’**énergie thermique**, dissipée dans l’environnement par les frottements ou l’effet Joule.

Cette énergie n’a pas disparu — elle est **dégradée** : trop diluée dans l’air ambiant pour être récupérée.

> « Perte » est un mot d’ingénieur, pas de physicien : rien ne manque au bilan, quelque chose manque à l’usage.

## Le rendement, mesure de cette dégradation
**rendement = énergie utile ÷ énergie totale reçue**
- Moteur thermique de voiture : environ **30 %** — les deux tiers partent en chaleur.
- Moteur électrique : jusqu’à **90 %**.
- Lampe à incandescence : environ **5 %** ; LED : plus de **30 %**.

## Économiser l’énergie
Puisque l’énergie se dégrade, la seule vraie économie consiste à en **utiliser moins** :
- **isoler** un logement pour limiter les transferts thermiques ;
- choisir des appareils à **bon rendement** (étiquette énergie) ;
- **éteindre** les veilles, limiter la vitesse, privilégier les transports collectifs.

## Le bilan énergétique
Sur un schéma : énergie reçue = énergie utile + énergie dissipée. C’est ce bilan qu’on demande de compléter au brevet, en joules ou en pourcentages.`,
          },
          questions: [
            ['Que dit le principe de conservation de l’énergie ?', ['L’énergie ne se crée pas et ne se détruit pas, elle se transforme', 'L’énergie diminue à chaque conversion', 'L’énergie augmente avec la température', 'L’énergie disparaît lors des frottements'], 0, 'La somme des formes d’énergie reste constante dans un système isolé.'],
            ['Sous quelle forme les pertes d’énergie apparaissent-elles le plus souvent ?', ['Sous forme thermique', 'Sous forme chimique', 'Sous forme nucléaire', 'Sous forme lumineuse'], 0, 'Frottements et effet Joule dissipent de la chaleur.'],
            ['Que signifie « énergie dégradée » ?', ['Une énergie trop diluée dans l’environnement pour être réutilisée', 'Une énergie qui a disparu', 'Une énergie de mauvaise qualité chimique', 'Une énergie négative'], 0, 'Elle figure toujours au bilan, mais elle est inexploitable.'],
            ['Quel est l’ordre de grandeur du rendement d’un moteur thermique de voiture ?', ['Environ 30 %', 'Environ 90 %', 'Environ 5 %', 'Environ 70 %'], 0, 'Les deux tiers de l’énergie du carburant partent en chaleur.'],
            ['Quel convertisseur a le meilleur rendement ?', ['Le moteur électrique', 'Le moteur thermique', 'La lampe à incandescence', 'La chaudière à charbon'], 0, 'Il peut dépasser 90 %.'],
            ['Que se passe-t-il pour une bille qui tombe, si l’on néglige les frottements ?', ['Son énergie de position se convertit en énergie cinétique', 'Son énergie totale augmente', 'Son énergie cinétique se convertit en énergie chimique', 'Elle perd toute son énergie'], 0, 'La somme des deux formes reste constante.'],
            ['Quelle est la manière la plus efficace d’économiser l’énergie d’un logement ?', ['L’isoler pour limiter les transferts thermiques', 'Augmenter la puissance du chauffage', 'Ouvrir les fenêtres régulièrement', 'Remplacer les meubles'], 0, 'Moins de transferts vers l’extérieur, moins d’énergie à fournir.'],
            ['Un rendement de 100 % est possible dans un appareil réel.', ['Vrai', 'Faux'], 1, 'Une part d’énergie est toujours dissipée sous forme thermique.'],
          ],
        },
        // ===================================================================
        // Chapitre 6 : Les circuits électriques
        // ===================================================================
        {
          titre: 'Le courant électrique',
          axe: 'Les circuits électriques',
          lecon: {
            titre: 'Un déplacement de charges dans une boucle fermée',
            cours: `Le **courant électrique** est un **déplacement ordonné de porteurs de charge** :
- dans un **métal**, ce sont les **électrons libres** ;
- dans une **solution ionique**, ce sont les **ions**.

## La condition d’existence
Le courant ne circule que dans un **circuit fermé** — une boucle ininterrompue comprenant un **générateur**, des **récepteurs** et des **fils de connexion**. Un interrupteur ouvert coupe la boucle : plus rien ne circule.

## Le vocabulaire du circuit
- Le **générateur** (pile, batterie, alternateur) fournit l’énergie électrique.
- Les **récepteurs** (lampe, moteur, résistance) la consomment.
- Un **court-circuit** relie directement les deux bornes du générateur par un fil : l’intensité devient très grande, les fils chauffent, c’est un **danger d’incendie**.

## Deux sens à ne pas confondre
- Le **sens conventionnel du courant** va, à l’extérieur du générateur, de la borne **+** vers la borne **−**.
- Les **électrons**, eux, se déplacent en sens **inverse**.

C’est une convention historique, choisie avant qu’on ne connaisse l’électron : elle n’a jamais été corrigée, et elle reste celle des schémas.

## Conducteurs et isolants
- **Conducteurs** : les métaux (cuivre, aluminium, fer), le graphite, les solutions ioniques, le corps humain.
- **Isolants** : le verre, le plastique, le bois sec, l’air sec, le caoutchouc.

> Le corps humain est **conducteur**, et d’autant plus qu’il est humide : c’est toute la raison des règles de sécurité électrique.

## Les schémas normalisés
Chaque dipôle a son **symbole** : un rectangle pour la résistance, un cercle barré pour la lampe, deux traits inégaux pour la pile. Un schéma se dessine avec des traits droits et des angles droits.`,
          },
          questions: [
            ['Qu’est-ce que le courant électrique dans un métal ?', ['Un déplacement ordonné d’électrons libres', 'Un déplacement d’ions', 'Un déplacement d’atomes entiers', 'Un rayonnement lumineux'], 0, 'Dans une solution, ce sont les ions qui se déplacent.'],
            ['À quelle condition le courant circule-t-il ?', ['Le circuit doit être fermé', 'Le circuit doit être ouvert', 'Il faut au moins deux générateurs', 'Il faut que le circuit soit chaud'], 0, 'Un interrupteur ouvert interrompt la boucle.'],
            ['Quel est le sens conventionnel du courant à l’extérieur du générateur ?', ['De la borne + vers la borne −', 'De la borne − vers la borne +', 'Il change constamment', 'Il dépend du récepteur'], 0, 'Les électrons, eux, circulent en sens inverse.'],
            ['Qu’est-ce qu’un court-circuit ?', ['Une liaison directe entre les deux bornes du générateur', 'Un circuit trop long', 'Un circuit sans récepteur ni générateur', 'Un circuit ouvert'], 0, 'L’intensité devient très grande : les fils chauffent, c’est un danger d’incendie.'],
            ['Lequel de ces matériaux est un isolant ?', ['Le plastique', 'Le cuivre', 'Le graphite', 'L’eau salée'], 0, 'Les métaux, le graphite et les solutions ioniques conduisent.'],
            ['Quel élément du circuit fournit l’énergie électrique ?', ['Le générateur', 'Le récepteur', 'L’interrupteur', 'Le fil de connexion'], 0, 'La lampe et le moteur, eux, la consomment.'],
            ['Pourquoi le corps humain est-il dangereux face à l’électricité ?', ['Parce qu’il est conducteur, surtout s’il est humide', 'Parce qu’il est isolant', 'Parce qu’il produit du courant', 'Parce qu’il stocke les charges'], 0, 'C’est la raison de toutes les règles de sécurité électrique.'],
            ['Les électrons circulent dans le sens conventionnel du courant.', ['Vrai', 'Faux'], 1, 'Ils circulent en sens inverse : la convention date d’avant leur découverte.'],
          ],
        },
        {
          titre: 'Les montages électriques',
          axe: 'Les circuits électriques',
          lecon: {
            titre: 'En série ou en dérivation : deux façons de brancher',
            cours: `Il existe deux façons d’assembler des dipôles dans un circuit.

## Le montage en série
Tous les dipôles sont sur **une seule boucle**, l’un derrière l’autre.
- Le courant a **un seul chemin** : l’**intensité est la même** partout.
- Les **tensions s’additionnent** : U totale = U₁ + U₂ + …
- Si un dipôle est retiré ou grillé, **tout s’éteint** : la boucle est ouverte.
- Plus on ajoute de lampes, moins elles brillent : elles se partagent la tension.

## Le montage en dérivation (ou en parallèle)
Le circuit comporte **plusieurs branches** reliées par des **nœuds**.
- Chaque branche a **la même tension** que le générateur.
- Les **intensités s’additionnent** : I totale = I₁ + I₂ + … (loi des nœuds).
- Si une lampe grille, **les autres continuent de fonctionner** : leur branche est intacte.
- Ajouter une branche **augmente** l’intensité totale demandée au générateur.

## Pourquoi les installations domestiques sont en dérivation
Chaque appareil reçoit la **même tension (230 V)**, fonctionne **indépendamment** des autres, et peut être commandé par son propre interrupteur. En série, éteindre la lampe du salon éteindrait le réfrigérateur.

> Le montage en série n’a pas disparu pour autant : il est celui d’une guirlande à ampoules, où une seule ampoule grillée éteint toute la chaîne.

## Le branchement des appareils de mesure
- L’**ampèremètre** se branche **en série**, dans la branche à mesurer.
- Le **voltmètre** se branche **en dérivation**, aux bornes du dipôle.

C’est la règle à ne jamais inverser : un ampèremètre branché en dérivation crée un court-circuit.`,
          },
          questions: [
            ['Dans un montage en série, que peut-on dire de l’intensité ?', ['Elle est la même en tout point du circuit', 'Elle s’additionne à chaque dipôle', 'Elle diminue à chaque dipôle', 'Elle est nulle après le premier dipôle'], 0, 'Le courant n’a qu’un seul chemin possible.'],
            ['Dans un montage en dérivation, que peut-on dire de la tension aux bornes de chaque branche ?', ['Elle est la même que celle du générateur', 'Elle se partage entre les branches', 'Elle s’additionne', 'Elle est nulle'], 0, 'C’est pourquoi chaque appareil domestique reçoit 230 V.'],
            ['Que se passe-t-il si une lampe grille dans un montage en série ?', ['Tout le circuit s’éteint', 'Les autres lampes brillent davantage', 'Rien ne change', 'Le générateur se coupe'], 0, 'La boucle unique est ouverte.'],
            ['Que se passe-t-il si une lampe grille dans un montage en dérivation ?', ['Les autres continuent de fonctionner', 'Tout s’éteint', 'Le générateur se met en court-circuit', 'La tension double'], 0, 'Chaque branche est indépendante.'],
            ['Que dit la loi des nœuds ?', ['L’intensité qui arrive à un nœud est égale à la somme des intensités qui en repartent', 'Les tensions s’additionnent aux nœuds', 'L’intensité est nulle aux nœuds', 'La résistance se partage aux nœuds'], 0, 'Elle traduit la conservation de la charge électrique.'],
            ['Comment se branche un ampèremètre ?', ['En série, dans la branche à mesurer', 'En dérivation, aux bornes du dipôle', 'Directement aux bornes du générateur', 'Peu importe'], 0, 'Branché en dérivation, il provoquerait un court-circuit.'],
            ['Comment se branche un voltmètre ?', ['En dérivation, aux bornes du dipôle', 'En série avec le dipôle', 'À la place du générateur', 'En série avec l’ampèremètre'], 0, 'Il mesure une différence de potentiel entre deux points.'],
            ['Les installations électriques domestiques sont montées en série.', ['Vrai', 'Faux'], 1, 'Elles sont en dérivation : chaque appareil reçoit 230 V et fonctionne indépendamment.'],
          ],
        },
        {
          titre: 'La tension électrique',
          axe: 'Les circuits électriques',
          lecon: {
            titre: 'Ce que mesure un voltmètre',
            cours: `La **tension électrique** entre deux points traduit la différence d’état électrique entre eux. On la note **U** et elle se mesure en **volts (V)**.

## L’instrument
Le **voltmètre** (ou un multimètre en position V) se branche **en dérivation**, c’est-à-dire **aux bornes** du dipôle étudié — jamais en série.
- borne **V** vers la borne **+** du dipôle,
- borne **COM** vers l’autre.

Un branchement inversé affiche une valeur **négative** : le circuit ne risque rien, seul le signe change.

## Les valeurs usuelles
- Pile plate : 4,5 V — pile bâton : 1,5 V — pile 9 V : 9 V.
- Batterie de voiture : 12 V.
- Secteur domestique en France : **230 V** — mortel.
- Une tension est considérée comme **sans danger** en dessous de 25 V environ.

## Les lois de la tension
- **En série** : les tensions **s’additionnent**. U générateur = U₁ + U₂ + …
- **En dérivation** : les tensions sont **égales** dans toutes les branches.

## La tension aux bornes d’un interrupteur
- Interrupteur **fermé** : U ≈ 0 V (il ne consomme rien).
- Interrupteur **ouvert** : U vaut la tension du générateur — toute la tension se retrouve à ses bornes.

> Une tension existe même sans courant : une pile posée sur la table a bien 1,5 V à ses bornes, sans qu’aucun électron ne circule.

## Continu et alternatif
- Une pile délivre une tension **continue** (symbole =) : constante dans le temps.
- Le secteur délivre une tension **alternative** (symbole ~) : elle change de signe 50 fois par seconde en France (**fréquence 50 Hz**), ce qu’un oscilloscope rend visible sous forme de sinusoïde.`,
          },
          questions: [
            ['Dans quelle unité se mesure la tension électrique ?', ['Le volt (V)', 'L’ampère (A)', 'L’ohm (Ω)', 'Le watt (W)'], 0, 'L’ampère est l’unité de l’intensité.'],
            ['Comment se branche un voltmètre ?', ['En dérivation, aux bornes du dipôle', 'En série avec le dipôle', 'À la place du générateur', 'Entre deux nœuds vides'], 0, 'Il mesure une différence entre deux points.'],
            ['Quelle est la tension du secteur domestique en France ?', ['230 V', '12 V', '4,5 V', '1 000 V'], 0, 'Une tension mortelle : au-delà de 25 V, le danger est réel.'],
            ['Que deviennent les tensions dans un montage en série ?', ['Elles s’additionnent', 'Elles sont égales partout', 'Elles se divisent par le nombre de dipôles', 'Elles s’annulent'], 0, 'En dérivation, en revanche, elles sont égales.'],
            ['Quelle est la tension aux bornes d’un interrupteur fermé ?', ['Environ 0 V', 'La tension du générateur', 'La moitié de la tension du générateur', 'Elle est négative'], 0, 'Ouvert, il porterait au contraire toute la tension du générateur.'],
            ['Que se passe-t-il si l’on inverse les bornes d’un voltmètre ?', ['Il affiche une valeur négative', 'Il grille immédiatement', 'Il provoque un court-circuit', 'Il n’affiche plus rien'], 0, 'Seul le signe change ; le circuit ne risque rien.'],
            ['Quelle est la fréquence de la tension du secteur en France ?', ['50 Hz', '60 Hz', '100 Hz', '230 Hz'], 0, 'La tension alternative change de signe 50 fois par seconde.'],
            ['Une tension ne peut exister que si un courant circule.', ['Vrai', 'Faux'], 1, 'Une pile isolée a bien une tension à ses bornes sans qu’aucun courant ne passe.'],
          ],
        },
        {
          titre: 'L’intensité électrique',
          axe: 'Les circuits électriques',
          lecon: {
            titre: 'Le débit du courant',
            cours: `L’**intensité** mesure le **débit de charges électriques** dans une branche du circuit. On la note **I** et elle se mesure en **ampères (A)**.

Une image utile : si le courant était de l’eau dans un tuyau, l’intensité serait le **débit** et la tension la **pression**.

## L’instrument
L’**ampèremètre** se branche **en série**, dans la branche dont on veut mesurer l’intensité : le courant doit **le traverser**.
- borne **A** (ou mA) du côté de la borne + du générateur, borne **COM** de l’autre ;
- on démarre toujours sur le **plus grand calibre**, puis on descend.

⚠️ Un ampèremètre branché **en dérivation** aux bornes d’un générateur crée un **court-circuit** et peut le détruire.

## Les ordres de grandeur
- LED : quelques mA (1 mA = 0,001 A)
- Lampe de poche : environ 0,3 A
- Réfrigérateur : environ 1 A
- Plaque de cuisson : plus de 10 A

## Les lois de l’intensité
- **En série** : l’intensité est **la même en tout point** du circuit. L’ordre des dipôles n’y change rien.
- **En dérivation** : les intensités des branches **s’additionnent** pour donner l’intensité principale — c’est la **loi des nœuds** : I = I₁ + I₂ + …

## Le rôle du fusible et du disjoncteur
Ils **coupent** le circuit quand l’intensité dépasse une valeur limite, avant que les fils ne chauffent assez pour déclencher un incendie. Un fusible fond ; un disjoncteur se réarme.

> Multiplier les multiprises sur la même prise ne change pas la tension, mais **additionne les intensités** : c’est ainsi que l’on dépasse la limite de l’installation.`,
          },
          questions: [
            ['Dans quelle unité se mesure l’intensité du courant ?', ['L’ampère (A)', 'Le volt (V)', 'L’ohm (Ω)', 'Le joule (J)'], 0, 'Elle mesure le débit de charges électriques.'],
            ['Comment se branche un ampèremètre ?', ['En série, de façon à être traversé par le courant', 'En dérivation aux bornes du dipôle', 'Aux bornes du générateur', 'Sur un fil coupé, sans le relier'], 0, 'En dérivation, il créerait un court-circuit.'],
            ['Que peut-on dire de l’intensité dans un circuit en série ?', ['Elle est la même en tout point', 'Elle diminue après chaque lampe', 'Elle s’additionne', 'Elle est nulle au retour'], 0, 'L’ordre des dipôles n’a aucune influence.'],
            ['Que dit la loi des nœuds dans un circuit en dérivation ?', ['L’intensité principale est la somme des intensités des branches', 'Toutes les branches ont la même intensité', 'L’intensité est nulle au nœud', 'L’intensité se divise toujours en deux parts égales'], 0, 'Elle traduit la conservation de la charge.'],
            ['À combien d’ampères correspond 1 mA ?', ['0,001 A', '0,1 A', '10 A', '1 000 A'], 0, 'Le milliampère est le millième de l’ampère.'],
            ['Sur quel calibre commence-t-on une mesure d’intensité ?', ['Sur le plus grand calibre, puis on descend', 'Sur le plus petit calibre', 'Peu importe le calibre', 'Sur le calibre du milieu'], 0, 'Commencer trop bas risquerait d’endommager l’appareil.'],
            ['À quoi sert un fusible ?', ['À couper le circuit quand l’intensité dépasse une limite', 'À augmenter la tension', 'À stabiliser le courant', 'À mesurer l’intensité'], 0, 'Il protège l’installation d’un incendie ; le disjoncteur joue le même rôle en se réarmant.'],
            ['Brancher plusieurs appareils sur une même multiprise augmente la tension reçue.', ['Vrai', 'Faux'], 1, 'La tension reste 230 V ; ce sont les intensités qui s’additionnent.'],
          ],
        },
        {
          titre: 'La résistance électrique',
          axe: 'Les circuits électriques',
          lecon: {
            titre: 'La loi d’Ohm et l’effet Joule',
            cours: `Une **résistance** est un dipôle qui **s’oppose au passage du courant**. Sa valeur R se mesure en **ohms (Ω)**.

## La loi d’Ohm
Pour un conducteur ohmique :

**U = R × I**

- U en **volts (V)** ;
- R en **ohms (Ω)** ;
- I en **ampères (A)**.

On en déduit les deux autres formes : **R = U ÷ I** et **I = U ÷ R**.

## Ce que la loi dit
À tension constante, **plus la résistance est grande, plus l’intensité est faible**. Le graphique U en fonction de I est une **droite passant par l’origine** : la tension est proportionnelle à l’intensité, et la **pente** de cette droite vaut R.

## Mesurer une résistance
- À l’**ohmmètre**, hors circuit (le dipôle doit être débranché).
- Par la **méthode voltampèremétrique** : on mesure U et I, puis on calcule R = U ÷ I.
- Par le **code des couleurs** imprimé sur le composant.

## L’effet Joule
Toute résistance parcourue par un courant **s’échauffe** : c’est l’**effet Joule**.
- **Recherché** dans un radiateur, un grille-pain, un sèche-cheveux, une ampoule à filament.
- **Subi** dans les fils, les moteurs et les appareils électroniques, où il représente une perte d’énergie et un risque d’incendie.

> C’est l’effet Joule qui rend un court-circuit dangereux : l’intensité devient très grande, et l’énergie dissipée dans les fils suffit à les enflammer.

## Le rôle protecteur d’une résistance
Placée en série avec une LED, une résistance limite l’intensité qui la traverse et l’empêche de griller : c’est son usage le plus courant en électronique.`,
          },
          questions: [
            ['Quelle est la formule de la loi d’Ohm ?', ['U = R × I', 'U = R ÷ I', 'R = U × I', 'I = R × U'], 0, 'On en déduit R = U ÷ I et I = U ÷ R.'],
            ['Dans quelle unité se mesure une résistance ?', ['L’ohm (Ω)', 'Le volt (V)', 'L’ampère (A)', 'Le watt (W)'], 0, 'Le symbole est la lettre grecque oméga.'],
            ['Que devient l’intensité quand la résistance augmente, à tension constante ?', ['Elle diminue', 'Elle augmente', 'Elle reste identique', 'Elle s’annule brutalement'], 0, 'I = U ÷ R : R au dénominateur.'],
            ['Quelle est l’allure du graphique U en fonction de I pour un conducteur ohmique ?', ['Une droite passant par l’origine', 'Une parabole', 'Une droite ne passant pas par l’origine', 'Une courbe décroissante'], 0, 'Sa pente vaut la résistance R.'],
            ['Qu’est-ce que l’effet Joule ?', ['L’échauffement d’une résistance parcourue par un courant', 'La production de lumière par un courant', 'La création d’un champ magnétique', 'La chute de tension dans un générateur'], 0, 'Recherché dans un radiateur, subi dans les fils.'],
            ['Dans quel appareil l’effet Joule est-il recherché ?', ['Un grille-pain', 'Un ordinateur portable', 'Un moteur électrique', 'Un transformateur'], 0, 'Le chauffage y est justement la fonction attendue.'],
            ['À quoi sert une résistance placée en série avec une LED ?', ['À limiter l’intensité pour ne pas la griller', 'À augmenter sa luminosité', 'À la protéger de l’humidité', 'À inverser le sens du courant'], 0, 'C’est son usage le plus courant en électronique.'],
            ['La résistance d’un conducteur ohmique dépend de la tension qu’on lui applique.', ['Vrai', 'Faux'], 1, 'Elle est constante : c’est justement ce que traduit la droite de la loi d’Ohm.'],
          ],
        },
        {
          titre: 'Puissance et énergie électrique',
          axe: 'Les circuits électriques',
          lecon: {
            titre: 'Ce qui consomme, et ce que ça coûte',
            cours: `La **puissance** d’un appareil est l’énergie qu’il convertit **par seconde**. Elle se note P et se mesure en **watts (W)**.

## Les deux formules à connaître
**P = U × I**
- P en watts (W), U en volts (V), I en ampères (A).

**E = P × t**
- E est l’**énergie** consommée, en **joules (J)** si t est en secondes ;
- en **wattheures (Wh)** si t est en heures ; en **kilowattheures (kWh)** pour la facture.

**1 kWh = 3,6 × 10⁶ J.**

## L’indication portée sur les appareils
La plaque signalétique indique la tension d’alimentation et la puissance : « 230 V — 2 000 W ». On en déduit l’intensité appelée : I = P ÷ U = 2 000 ÷ 230 ≈ **8,7 A**.

## Les ordres de grandeur
- Chargeur de téléphone : environ 5 W
- Ampoule LED : 8 W — ampoule à filament équivalente : 60 W
- Réfrigérateur : 150 W
- Four : 2 000 W
- Plaque de cuisson : 3 000 W

## Calculer un coût
1. Calculer l’énergie en **kWh** : E = P (en kW) × t (en heures).
2. Multiplier par le **prix du kWh**.

Un four de 2 000 W pendant 1 h 30 : E = 2 × 1,5 = **3 kWh**. À 0,20 € le kWh, cela coûte **0,60 €**.

> La puissance dit la vitesse à laquelle on consomme, l’énergie dit la quantité totale consommée. Une ampoule de 60 W allumée une heure consomme autant qu’une ampoule de 6 W allumée dix heures.

## Réduire sa consommation
Comparer les **étiquettes énergie**, préférer les LED, éteindre les veilles, limiter la durée d’usage des appareils les plus puissants (four, chauffage, sèche-linge).`,
          },
          questions: [
            ['Quelle est la formule de la puissance électrique ?', ['P = U × I', 'P = U ÷ I', 'P = I ÷ U', 'P = U + I'], 0, 'La tension en volts multipliée par l’intensité en ampères.'],
            ['Dans quelle unité se mesure la puissance ?', ['Le watt (W)', 'Le joule (J)', 'Le volt (V)', 'L’ampère (A)'], 0, 'Le joule est l’unité de l’énergie.'],
            ['Quelle est la formule de l’énergie électrique consommée ?', ['E = P × t', 'E = P ÷ t', 'E = U × I × R', 'E = t ÷ P'], 0, 'En joules si t est en secondes, en wattheures si t est en heures.'],
            ['À combien de joules correspond 1 kWh ?', ['3,6 × 10⁶ J', '1 000 J', '3 600 J', '10⁵ J'], 0, '1 000 W pendant 3 600 secondes.'],
            ['Quelle intensité appelle un appareil de 2 000 W sous 230 V ?', ['Environ 8,7 A', 'Environ 0,1 A', 'Environ 87 A', 'Environ 2 A'], 0, 'I = P ÷ U = 2 000 ÷ 230.'],
            ['Combien consomme un four de 2 000 W utilisé pendant 1 h 30 ?', ['3 kWh', '2 kWh', '3 000 kWh', '1,5 kWh'], 0, 'E = 2 kW × 1,5 h.'],
            ['Quelle est la différence entre puissance et énergie ?', ['La puissance est la vitesse de consommation, l’énergie la quantité totale consommée', 'Ce sont deux mots pour la même grandeur', 'La puissance se mesure en joules', 'L’énergie ne dépend pas de la durée'], 0, 'Une ampoule de 60 W une heure consomme autant qu’une de 6 W dix heures.'],
            ['Une ampoule LED de 8 W éclaire moins qu’une ampoule à filament de 60 W.', ['Vrai', 'Faux'], 1, 'Elles éclairent autant : la LED convertit simplement une bien plus grande part de l’électricité en lumière.'],
          ],
        },
        // ===================================================================
        // Chapitre 7 : Les signaux
        // ===================================================================
        {
          titre: 'Signal et information',
          axe: 'Les signaux',
          lecon: {
            titre: 'Transporter une information sans transporter de matière',
            cours: `Un **signal** est un phénomène physique qui transporte une **information** d’un émetteur vers un récepteur — **sans transport de matière**.

## La chaîne de transmission
**Émetteur → milieu de propagation → récepteur.**
Le téléphone, la télécommande, la radio, un feu tricolore ou un panneau de signalisation suivent tous ce même schéma.

## Trois familles de signaux
- **Lumineux** : la lumière (fibre optique, télécommande infrarouge, feux de signalisation).
- **Sonores** : les ondes sonores (la voix, une alarme, un klaxon).
- **Électriques et électromagnétiques** : le courant dans un fil, les ondes radio, le Wi-Fi, la 4G/5G.

## Ce qui les distingue
- Un signal **sonore** a besoin d’un **milieu matériel** : il ne se propage pas dans le vide.
- Les signaux **lumineux et électromagnétiques** se propagent **dans le vide**, à environ **300 000 km/s** — c’est pourquoi les communications spatiales sont possibles.

## Analogique et numérique
- Un signal **analogique** varie de façon **continue** (le sillon d’un disque vinyle, l’aiguille d’un cadran).
- Un signal **numérique** est codé par une suite de **0 et de 1** (les **bits**). Il résiste bien mieux aux perturbations, se copie sans perte et se compresse.

> C’est cette robustesse qui a fait passer la photo, la musique, la télévision et le téléphone au numérique en une génération.

## Les unités de l’information
1 octet = 8 bits ; 1 ko = 1 000 octets ; 1 Mo = 10⁶ octets ; 1 Go = 10⁹ octets.

## Les usages quotidiens
Un capteur transforme une grandeur physique (température, lumière, pression) en signal électrique ; un microcontrôleur le traite ; un actionneur agit. C’est le principe de tout objet connecté.`,
          },
          questions: [
            ['Qu’est-ce qu’un signal ?', ['Un phénomène physique qui transporte une information sans transporter de matière', 'Un déplacement de matière d’un point à un autre', 'Une source d’énergie', 'Un appareil de mesure'], 0, 'Émetteur, milieu de propagation, récepteur.'],
            ['Quel signal ne peut PAS se propager dans le vide ?', ['Le signal sonore', 'Le signal lumineux', 'Une onde radio', 'Le Wi-Fi'], 0, 'Le son a besoin d’un milieu matériel.'],
            ['À quelle vitesse se propagent les signaux lumineux dans le vide ?', ['Environ 300 000 km/s', 'Environ 340 m/s', 'Environ 3 000 km/s', 'Environ 1 500 m/s'], 0, '340 m/s est la vitesse du son dans l’air.'],
            ['Qu’est-ce qu’un signal numérique ?', ['Un signal codé par une suite de 0 et de 1', 'Un signal qui varie de façon continue', 'Un signal transporté par un fil uniquement', 'Un signal invisible'], 0, 'Il résiste bien mieux aux perturbations qu’un signal analogique.'],
            ['Combien de bits contient un octet ?', ['8', '10', '4', '16'], 0, '1 ko vaut 1 000 octets.'],
            ['Quel exemple correspond à un signal analogique ?', ['Le sillon d’un disque vinyle', 'Un fichier MP3', 'Une image JPEG', 'Un message texte'], 0, 'Il varie de façon continue, sans codage en bits.'],
            ['Quel élément transforme une grandeur physique en signal électrique ?', ['Un capteur', 'Un actionneur', 'Un écran', 'Une batterie'], 0, 'L’actionneur, lui, agit à la fin de la chaîne.'],
            ['Un signal transporte de la matière d’un point à un autre.', ['Vrai', 'Faux'], 1, 'Il transporte une information et de l’énergie, pas de la matière.'],
          ],
        },
        {
          titre: 'La lumière',
          axe: 'Les signaux',
          lecon: {
            titre: 'Sources, propagation, couleurs',
            cours: `## Sources et objets diffusants
- Une **source primaire** produit sa propre lumière : le Soleil, une flamme, une lampe, une LED, un écran.
- Un **objet diffusant** (source secondaire) ne fait que **renvoyer** la lumière qu’il reçoit : la Lune, un mur, une page de livre.

On ne voit un objet que si de la lumière **parvient de lui jusqu’à notre œil**.

## La propagation
Dans un **milieu homogène et transparent**, la lumière se propage **en ligne droite**. On la modélise par des **rayons lumineux**, tracés avec une flèche pour indiquer le sens.

Cette propriété explique les **ombres** : l’ombre propre (la face non éclairée de l’objet), l’ombre portée (sur le sol ou l’écran), et le **cône d’ombre**. Elle explique aussi les **éclipses** et le fonctionnement de la chambre noire.

## La vitesse
Environ **300 000 km/s** dans le vide, un peu moins dans l’air, l’eau ou le verre. Rien ne va plus vite.

## La lumière blanche est composée
Un **prisme** la **disperse** en un **spectre continu** : rouge, orange, jaune, vert, bleu, indigo, violet — c’est ce qui se produit dans un arc-en-ciel avec les gouttes d’eau.

## La couleur des objets
Un objet éclairé en lumière blanche **absorbe** certaines couleurs et **diffuse** les autres : un tissu rouge diffuse le rouge et absorbe le reste. Éclairé en lumière **verte**, il apparaît **noir** — il n’a aucun rouge à renvoyer.

## La synthèse additive
Les écrans mélangent trois couleurs primaires — **rouge, vert, bleu (RVB)** — pour reconstituer toutes les autres. Rouge + vert + bleu = **blanc**.

> Les couleurs de la peinture obéissent, elles, à une synthèse **soustractive** : chaque pigment retire des couleurs à la lumière blanche.`,
          },
          questions: [
            ['Qu’est-ce qu’une source primaire de lumière ?', ['Un objet qui produit sa propre lumière', 'Un objet qui renvoie la lumière reçue', 'Un objet transparent', 'Un objet noir'], 0, 'Le Soleil et une LED en sont ; la Lune n’en est pas une.'],
            ['Comment se propage la lumière dans un milieu homogène et transparent ?', ['En ligne droite', 'En zigzag', 'En cercle', 'Elle ne se propage pas'], 0, 'C’est ce qui explique les ombres et les éclipses.'],
            ['Que fait un prisme à la lumière blanche ?', ['Il la disperse en un spectre continu de couleurs', 'Il l’absorbe entièrement', 'Il la transforme en son', 'Il l’accélère'], 0, 'C’est le même phénomène que dans un arc-en-ciel.'],
            ['De quelle couleur apparaît un objet rouge éclairé en lumière verte ?', ['Noir', 'Rouge', 'Vert', 'Jaune'], 0, 'Il n’a aucune lumière rouge à diffuser.'],
            ['Quelles sont les trois couleurs primaires de la synthèse additive ?', ['Rouge, vert, bleu', 'Rouge, jaune, bleu', 'Cyan, magenta, jaune', 'Blanc, noir, gris'], 0, 'C’est le système RVB des écrans.'],
            ['Que donne le mélange des trois couleurs primaires en synthèse additive ?', ['Du blanc', 'Du noir', 'Du gris', 'Du marron'], 0, 'C’est ainsi qu’un écran produit du blanc.'],
            ['Pourquoi voit-on un objet non lumineux ?', ['Parce qu’il diffuse vers notre œil la lumière qu’il reçoit', 'Parce qu’il produit de la lumière', 'Parce que notre œil émet de la lumière', 'Parce qu’il absorbe toute la lumière'], 0, 'Sans lumière parvenant à l’œil, aucun objet n’est visible.'],
            ['La lumière blanche est une couleur simple, non décomposable.', ['Vrai', 'Faux'], 1, 'Le prisme montre qu’elle est composée de toutes les couleurs du spectre.'],
          ],
        },
        {
          titre: 'Le son',
          axe: 'Les signaux',
          lecon: {
            titre: 'Une vibration qui a besoin de matière',
            cours: `Un **son** est produit par un objet qui **vibre** : une corde, une membrane, une colonne d’air, des cordes vocales.

## La propagation
La vibration met en mouvement les particules du milieu : elles se **compriment** puis se **dilatent** de proche en proche. Le son a donc **absolument besoin d’un milieu matériel** — air, eau, métal, bois.

> **Dans le vide, aucun son ne se propage.** L’expérience de la cloche à vide le montre : à mesure qu’on pompe l’air, la sonnerie s’éteint alors qu’on voit toujours le marteau frapper.

## La vitesse du son
- dans l’**air** : environ **340 m/s** ;
- dans l’**eau** : environ 1 500 m/s ;
- dans l’**acier** : environ 5 000 m/s.

Elle est donc d’autant plus grande que le milieu est **dense et rigide** — et toujours **très inférieure** à celle de la lumière. C’est pourquoi on voit l’éclair avant d’entendre le tonnerre : compter les secondes et diviser par 3 donne la distance de l’orage en kilomètres.

## Mesurer une distance par le son
**d = v × t**, avec v = 340 m/s dans l’air. Pour un **écho** ou un sonar, le son fait l’aller-retour : la distance cherchée est la **moitié** du produit.

## Deux grandeurs à ne pas confondre
- La **fréquence** (en hertz, Hz) donne la **hauteur** du son : grave si elle est faible, aigu si elle est élevée. L’oreille humaine perçoit environ **20 Hz à 20 000 Hz**.
- Le **niveau sonore** (en décibels, dB) donne l’**intensité** perçue : le volume.

## Les dangers
Au-delà de **85 dB**, une exposition prolongée abîme l’oreille interne ; **120 dB** est le seuil de douleur. Les cellules de l’oreille interne **ne se régénèrent pas** : les dommages sont définitifs. Casque à volume modéré, pauses régulières, bouchons en concert.`,
          },
          questions: [
            ['Qu’est-ce qui produit un son ?', ['Un objet qui vibre', 'Un objet qui chauffe', 'Un objet qui brille', 'Un objet immobile'], 0, 'Corde, membrane ou colonne d’air en vibration.'],
            ['Le son peut-il se propager dans le vide ?', ['Non, il a besoin d’un milieu matériel', 'Oui, comme la lumière', 'Oui, mais plus lentement', 'Seulement s’il est très fort'], 0, 'L’expérience de la cloche à vide le démontre.'],
            ['Quelle est la vitesse du son dans l’air ?', ['Environ 340 m/s', 'Environ 300 000 km/s', 'Environ 1 500 m/s', 'Environ 34 m/s'], 0, '1 500 m/s est sa vitesse dans l’eau.'],
            ['Que mesure la fréquence d’un son ?', ['Sa hauteur : grave ou aigu', 'Son volume', 'Sa vitesse de propagation', 'Sa durée'], 0, 'Elle s’exprime en hertz (Hz).'],
            ['Quel est le domaine des fréquences audibles par l’oreille humaine ?', ['Environ 20 Hz à 20 000 Hz', '0 Hz à 100 Hz', '100 Hz à 1 000 Hz', '20 000 Hz à 50 000 Hz'], 0, 'En dessous ce sont des infrasons, au-dessus des ultrasons.'],
            ['Dans quelle unité mesure-t-on le niveau sonore ?', ['Le décibel (dB)', 'Le hertz (Hz)', 'Le watt (W)', 'Le mètre par seconde (m/s)'], 0, 'Le hertz mesure la fréquence, pas le volume.'],
            ['À partir de quel niveau sonore une exposition prolongée devient-elle dangereuse ?', ['85 dB', '30 dB', '120 dB seulement', '200 dB'], 0, '120 dB est le seuil de douleur, mais le danger commence bien avant.'],
            ['Les cellules de l’oreille interne détruites par le bruit peuvent se régénérer.', ['Vrai', 'Faux'], 1, 'Les dommages sont définitifs : la prévention est la seule protection.'],
          ],
        },
        {
          titre: 'Les signaux sonores',
          axe: 'Les signaux',
          lecon: {
            titre: 'Lire un son sur un écran',
            cours: `Un **signal sonore** peut être enregistré, visualisé et analysé : c’est ce que font un **microphone** relié à un **oscilloscope** ou à un ordinateur.

## De l’air à l’écran
Le **microphone** convertit la vibration de l’air en **signal électrique**. L’oscilloscope trace ce signal en fonction du **temps** : on obtient une courbe qui « dessine » le son.

## Ce que la courbe montre
- Un son **pur** donne une courbe **sinusoïdale** régulière (un diapason).
- Un son **composé** (une voix, un instrument) donne une courbe **périodique** mais plus complexe.
- Un **bruit** donne une courbe **sans période** identifiable.

## La période et la fréquence
- La **période T** est la durée d’un motif qui se répète, en **secondes**.
- La **fréquence f** est le nombre de motifs par seconde, en **hertz (Hz)**.

**f = 1 ÷ T** et **T = 1 ÷ f**

Un son de période 4 ms (0,004 s) a une fréquence de 1 ÷ 0,004 = **250 Hz**.

> Plus la période est **courte**, plus la fréquence est **grande**, et plus le son est **aigu**.

## L’amplitude
C’est la hauteur du motif sur l’écran. Plus l’**amplitude** est grande, plus le son est **fort**. Elle ne change **pas** la hauteur du son : on peut jouer la même note plus ou moins fort.

## Deux caractéristiques indépendantes
| Grandeur | Ce qu’elle donne | Unité |
|---|---|---|
| Fréquence | la hauteur (grave/aigu) | Hz |
| Amplitude | l’intensité (fort/faible) | — (niveau en dB) |

## Ultrasons et infrasons
- **Infrasons** : moins de 20 Hz — éléphants, séismes.
- **Ultrasons** : plus de 20 000 Hz — chauves-souris, sonars, échographies. On les utilise pour mesurer des distances : l’écho revient d’autant plus tôt que l’obstacle est proche.`,
          },
          questions: [
            ['Que fait un microphone ?', ['Il convertit une vibration de l’air en signal électrique', 'Il amplifie le son sans le transformer', 'Il produit un son pur', 'Il mesure la fréquence directement'], 0, 'L’oscilloscope trace ensuite ce signal en fonction du temps.'],
            ['Quelle courbe correspond à un son pur ?', ['Une sinusoïde régulière', 'Une courbe sans période', 'Une droite horizontale', 'Une courbe en escalier'], 0, 'C’est le signal d’un diapason.'],
            ['Quelle est la relation entre fréquence et période ?', ['f = 1 ÷ T', 'f = T', 'f = T × 2', 'f = T ÷ 2'], 0, 'Une période courte donne une fréquence élevée.'],
            ['Quelle est la fréquence d’un son de période 4 ms ?', ['250 Hz', '4 Hz', '400 Hz', '25 Hz'], 0, 'f = 1 ÷ 0,004 s.'],
            ['Que traduit l’amplitude d’un signal sonore ?', ['L’intensité du son : fort ou faible', 'La hauteur du son : grave ou aigu', 'La vitesse du son', 'La durée du son'], 0, 'La fréquence, elle, donne la hauteur.'],
            ['Comment appelle-t-on les sons de fréquence supérieure à 20 000 Hz ?', ['Les ultrasons', 'Les infrasons', 'Les sons purs', 'Les harmoniques'], 0, 'Chauves-souris, sonars et échographies les utilisent.'],
            ['Quelle courbe correspond à un bruit ?', ['Une courbe sans période identifiable', 'Une sinusoïde parfaite', 'Une courbe périodique complexe', 'Une droite'], 0, 'C’est ce qui le distingue d’une note de musique.'],
            ['Augmenter l’amplitude d’un son le rend plus aigu.', ['Vrai', 'Faux'], 1, 'Cela le rend plus fort : la hauteur ne dépend que de la fréquence.'],
          ],
        },
      ],
    },
  ],
}
