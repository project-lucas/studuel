// Physique-chimie — Seconde : LE PROGRAMME COMPLET (23 fiches).
//
// CE QUE REMPLACE CE MODULE. La 2de n'avait que CINQ chapitres de
// physique-chimie, hérités du tout premier jeu de données (migration 008,
// contenu rempli par la 127) : « Constitution de la matière », « Transformations
// chimiques : équations », « Le mouvement : vitesse et référentiel », « Ondes et
// signaux », « La lumière : spectres ». Cinq fiches pour un programme qui en
// demande vingt-trois. Rien sur la composition d'un mélange, l'identification
// d'une espèce chimique, la configuration électronique, la quantité de matière,
// les changements d'état, la synthèse d'une espèce chimique, les réactions
// nucléaires, le vecteur vitesse, le principe d'inertie, la loi d'Ohm, les
// lentilles ni la construction d'image : un élève de 2de ne trouvait, sur ces
// sujets, RIEN.
//
// LE DÉCOUPAGE. Les 4 chapitres du programme de seconde (arrêté du 17 janvier
// 2019, BO spécial n° 1 du 22 janvier 2019), éclatés en leurs 23 fiches. Chaque
// fiche est un chapitre en base ; le CHAPITRE du programme est porté par `axe`
// (colonne `chapters.theme`), qui fait grouper la page matière — cf.
// docs/template-matiere.md. La physique-chimie n'a qu'un seul rayon : pas de
// `rayon` ici, la page garde un onglet Programme unique.
//
// ⚠️ ZÉRO LATEX. `components/LessonRichContent` ne rend aucune formule : tout
// s'écrit en Unicode et en texte — « P = U × I », « m³ », « 6,02 × 10²³ »,
// « 1/OA' − 1/OA = 1/OF' ». Même règle qu'en maths (module `maths-2de.mjs`).
//
// LES CINQ ANCIENS PARTENT (voir `menage`). Quatre d'entre eux sont des
// CHAPITRES du programme reformulés ; le cinquième (« La lumière : spectres »)
// est une fiche de synthèse que les quatre fiches de « Vision et image »
// recouvrent. Le ménage est borné à leurs cinq titres exacts et au seul niveau
// 2de — rejoué, il ne trouve plus rien et ne touche jamais les 23 fiches neuves.
//
// ⚠️ Le slug reste `physique-chimie` et TROIS modules le portent désormais
// (`physique-chimie-tle.mjs` → 252, `physique-chimie-1re.mjs` → 270, celui-ci →
// 289) : ne JAMAIS générer avec `--slugs physique-chimie`, qui les fusionnerait
// et réécrirait deux migrations. La physique-chimie du collège vient encore des
// migrations écrites à la main (037 → 143), qui ne doivent plus être régénérées.
// Toujours `--modules physique-chimie-2de`.

export default {
  slug: 'physique-chimie',
  nom: 'Physique-Chimie',

  titreMigration: 'PHYSIQUE-CHIMIE 2de — LE PROGRAMME COMPLET (23 fiches)',

  motif: `CONSTAT : la Seconde n'avait que CINQ chapitres de physique-chimie, hérités
du premier jeu de données de l'app, avec une leçon générique chacun. Le
programme officiel s'organise en QUATRE chapitres — constitution et
transformation de la matière, mouvements et interactions, ondes et signaux,
vision et image — qui se déplient en 23 fiches. Un élève de 2de qui révisait la
composition d'un mélange, l'identification d'une espèce chimique, la
configuration électronique, la règle du duet et de l'octet, la quantité de
matière, les changements d'état, la synthèse d'une espèce chimique, les
réactions nucléaires, le vecteur vitesse, le principe d'inertie, la loi d'Ohm,
les lentilles convergentes ou la construction d'une image ne trouvait RIEN.
Cette migration installe les 23 fiches, rangées sous leurs 4 chapitres, et
retire les 5 fiches génériques que ce découpage recouvre.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 23 fiches sous 4 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas
garantir que la 234 soit passée en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 5 anciens chapitres
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
      raison: `Les 5 chapitres hérités partent. Quatre d'entre eux sont des CHAPITRES du
programme reformulés ("Constitution de la matière", "Transformations chimiques :
équations", "Le mouvement : vitesse et référentiel", "Ondes et signaux") : les
garder en base ferait deux objets du même nom à deux places différentes, un
en-tête de section et une ligne dans la liste. Le cinquième ("La lumière :
spectres") est une fiche de synthèse que les quatre fiches de "Vision et image"
recouvrent.
ATTENTION À LA PONCTUATION : deux de ces titres portent un DEUX-POINTS entouré
d'espaces. Un DELETE approximatif ne trouverait rien EN SILENCE.
Le filtre level = '2de' est indispensable : "Ondes et signaux" est aussi un
chapitre du programme d'autres niveaux.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.
Le ménage tourne AVANT les insertions à CHAQUE passage : sans la borne des cinq
titres, un rejeu effacerait les quiz des 23 fiches neuves.`,
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
   AND c.level = '2de'
   AND c.title IN ('Constitution de la matière',
                   'Transformations chimiques : équations',
                   'Le mouvement : vitesse et référentiel',
                   'Ondes et signaux',
                   'La lumière : spectres');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '2de'
   AND c.title IN ('Constitution de la matière',
                   'Transformations chimiques : équations',
                   'Le mouvement : vitesse et référentiel',
                   'Ondes et signaux',
                   'La lumière : spectres');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '2de'
   AND c.title IN ('Constitution de la matière',
                   'Transformations chimiques : équations',
                   'Le mouvement : vitesse et référentiel',
                   'Ondes et signaux',
                   'La lumière : spectres');`,
    },
  ],

  blocs: [
    {
      niveaux: ['2de'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : constitution et transformation de la matière
        // ===================================================================
        {
          titre: 'Corps purs et mélanges',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Une seule espèce, ou plusieurs',
            cours: `Toute matière est faite d’**espèces chimiques**. Selon qu’il y en a une seule ou plusieurs, on parle de corps pur ou de mélange.

## Corps pur
Un **corps pur** ne contient qu’une seule espèce chimique : le fer, le dioxygène, l’eau distillée, le saccharose. Il possède des **températures de changement d’état** bien définies : sous la pression atmosphérique normale, l’eau pure fond à 0 °C et bout à 100 °C, et sa température reste **constante** pendant tout le changement d’état.

## Mélange
Un **mélange** contient au moins deux espèces chimiques. Il est **homogène** si l’on ne distingue pas ses constituants à l’œil nu, même après repos (eau salée, air, alliage), et **hétérogène** si on les distingue (eau et huile, jus avec pulpe, brouillard).

> Le repérage est visuel, mais le critère est physique : un mélange homogène ne comporte qu’une seule phase.

## Séparer un mélange
La **décantation** sépare par différence de densité après repos ; la **filtration** retient les particules solides ; la **centrifugation** accélère la décantation ; la **distillation** sépare des liquides par différence de température d’ébullition ; l’**évaporation** récupère un solide dissous.

## Densité et masse volumique
La **masse volumique** est le quotient de la masse par le volume : ρ = m / V, en kg·m⁻³ ou en g·cm⁻³. La **densité** d’un liquide ou d’un solide est le rapport de sa masse volumique à celle de l’eau (1,00 g·cm⁻³) : c’est un nombre sans unité. Un corps de densité inférieure à 1 flotte sur l’eau.

## Identifier un corps pur
Températures de fusion et d’ébullition, masse volumique, indice de réfraction : ce sont des **grandeurs caractéristiques**. Elles ne dépendent pas de la quantité de matière prélevée, ce qui en fait des cartes d’identité.`,
          },
          questions: [
            ['Qu’est-ce qu’un corps pur ?', ['Une matière constituée d’une seule espèce chimique', 'Une matière sans impureté visible', 'Un mélange homogène', 'Une matière solide'], 0, 'Il possède des températures de changement d’état bien définies.'],
            ['Qu’est-ce qu’un mélange homogène ?', ['Un mélange dont on ne distingue pas les constituants, même après repos', 'Un mélange de deux solides', 'Un mélange qui se sépare tout seul', 'Un mélange coloré'], 0, 'Il ne comporte qu’une seule phase.'],
            ['Sous pression atmosphérique normale, à quelle température l’eau pure bout-elle ?', ['100 °C', '0 °C', '80 °C', '120 °C'], 0, 'La température reste constante durant l’ébullition.'],
            ['Quelle technique sépare deux liquides ayant des températures d’ébullition différentes ?', ['La distillation', 'La filtration', 'La décantation', 'La centrifugation'], 0, 'On récupère le distillat au condenseur.'],
            ['Quelle est l’expression de la masse volumique ?', ['ρ = m / V', 'ρ = V / m', 'ρ = m × V', 'ρ = m + V'], 0, 'Elle s’exprime par exemple en g·cm⁻³.'],
            ['Que vaut la densité d’un corps par rapport à l’eau, s’il flotte ?', ['Elle est inférieure à 1', 'Elle est supérieure à 1', 'Elle vaut exactement 1', 'Elle est négative'], 0, 'La densité est un nombre sans unité.'],
            ['La masse volumique d’un corps pur dépend de la quantité prélevée.', ['Vrai', 'Faux'], 1, 'C’est une grandeur caractéristique, indépendante de la quantité.'],
            ['Quelle technique permet de retenir un solide en suspension dans un liquide ?', ['La filtration', 'La distillation', 'L’évaporation', 'La chromatographie'], 0, 'Le solide reste sur le filtre, le liquide passe.'],
          ],
        },
        {
          titre: 'Composition d’un mélange',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Dire combien il y en a dans combien',
            cours: `Décrire un mélange, c’est indiquer la **proportion** de chacun de ses constituants. Plusieurs grandeurs le permettent.

## Solution, soluté, solvant
Une **solution** est un mélange homogène liquide. Le **solvant** est l’espèce majoritaire (souvent l’eau : la solution est dite **aqueuse**), le **soluté** l’espèce dissoute. Une solution est **saturée** quand elle ne peut plus dissoudre de soluté.

## La concentration en masse
La **concentration en masse** est le quotient de la masse de soluté par le volume de solution : t = m / V, en g·L⁻¹. Attention, V est le volume de la SOLUTION obtenue, pas celui du solvant ajouté.

> Un litre d’eau plus 20 g de sel ne fait pas exactement un litre de solution : c’est pourquoi on complète jusqu’au trait de jauge, on ne mesure pas le solvant à part.

## Préparer une solution
Par **dissolution** d’un solide : peser la masse voulue, l’introduire dans une **fiole jaugée**, dissoudre, compléter jusqu’au trait de jauge, homogénéiser. Par **dilution** d’une solution mère : prélever un volume précis à la **pipette jaugée**, l’introduire dans une fiole jaugée, compléter. La dilution conserve la quantité de soluté, donc t₁ × V₁ = t₂ × V₂.

## Le facteur de dilution
Il vaut F = V₂ / V₁ = t₁ / t₂. Diluer dix fois, c’est prélever 10,0 mL de solution mère et compléter à 100,0 mL.

## Doser par étalonnage
Pour déterminer une concentration inconnue, on prépare une **gamme d’étalons** de concentrations connues, on mesure une grandeur qui varie avec la concentration — l’**absorbance** au spectrophotomètre pour une solution colorée —, on trace la courbe d’étalonnage, puis on y reporte la mesure faite sur la solution inconnue.

## Composition d’un mélange gazeux
Pour l’air, on donne des **proportions en volume** : environ 78 % de diazote, 21 % de dioxygène, 1 % d’autres gaz dont l’argon et le dioxyde de carbone.`,
          },
          questions: [
            ['Dans une solution, quelle espèce appelle-t-on le solvant ?', ['L’espèce majoritaire, dans laquelle se dissout le soluté', 'L’espèce dissoute', 'L’espèce colorée', 'L’espèce solide'], 0, 'Quand c’est l’eau, la solution est dite aqueuse.'],
            ['Quelle est l’expression de la concentration en masse ?', ['t = m / V', 't = V / m', 't = m × V', 't = m − V'], 0, 'V est le volume de la solution obtenue.'],
            ['Quelle verrerie utilise-t-on pour préparer un volume précis de solution ?', ['La fiole jaugée', 'Le bécher', 'L’éprouvette graduée', 'L’erlenmeyer'], 0, 'On complète jusqu’au trait de jauge.'],
            ['Que conserve-t-on lors d’une dilution ?', ['La quantité de soluté', 'Le volume', 'La concentration', 'La masse volumique'], 0, 'D’où la relation t₁ × V₁ = t₂ × V₂.'],
            ['Comment prépare-t-on une dilution au dixième ?', ['On prélève 10,0 mL de solution mère et on complète à 100,0 mL', 'On ajoute 100 mL d’eau à 10 mL de solution', 'On prélève 1 mL et on complète à 10 L', 'On divise la masse de soluté par dix'], 0, 'Le facteur de dilution vaut alors 10.'],
            ['Qu’est-ce qu’une solution saturée ?', ['Une solution qui ne peut plus dissoudre de soluté', 'Une solution très colorée', 'Une solution chauffée', 'Une solution filtrée'], 0, 'La solubilité dépend de la température.'],
            ['Quelle grandeur mesure-t-on au spectrophotomètre pour un dosage par étalonnage ?', ['L’absorbance', 'La masse', 'La température', 'La pression'], 0, 'On la compare à une gamme d’étalons.'],
            ['L’air contient environ 21 % de dioxygène en volume.', ['Vrai', 'Faux'], 0, 'Avec environ 78 % de diazote.'],
          ],
        },
        {
          titre: 'Identification d’une espèce chimique',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Reconnaître ce qu’on a dans le tube',
            cours: `Identifier une espèce chimique, c’est comparer ce qu’on observe à des données de référence.

## Les tests caractéristiques
Le **dioxygène** rallume une bûchette incandescente. Le **dioxyde de carbone** trouble l’eau de chaux. Le **dihydrogène** produit une détonation à l’approche d’une flamme. L’**eau** fait passer le sulfate de cuivre anhydre du blanc au bleu. Les **ions** se repèrent par précipitation avec la soude : précipité bleu pour l’ion cuivre II, rouille pour le fer III, vert pour le fer II, blanc pour le zinc ou l’aluminium ; l’ion chlorure donne un précipité blanc qui noircit à la lumière avec le nitrate d’argent.

## La chromatographie sur couche mince
On dépose l’échantillon et des références sur une plaque, on laisse migrer un **éluant** par capillarité, puis on révèle. Deux dépôts qui montent à la même hauteur correspondent à la même espèce. On calcule le **rapport frontal** : Rf = distance parcourue par la tache / distance parcourue par le front d’éluant. Rf est compris entre 0 et 1 et caractérise l’espèce dans un couple support-éluant donné.

> Une chromatographie répond à deux questions : combien y a-t-il d’espèces, et l’une d’elles est-elle identique à une référence ?

## Les grandeurs physiques
Température de fusion, température d’ébullition, **masse volumique**, **indice de réfraction** : on les mesure et on les compare à une table. Le **banc Kofler** donne la température de fusion d’un solide.

## Les spectres
Le **spectre d’absorption UV-visible** d’une solution colorée présente un maximum caractéristique de l’espèce dissoute : c’est aussi un outil d’identification, en plus du dosage.

## La démarche
Une seule mesure suffit rarement : on croise plusieurs indices concordants. Et l’on n’oublie jamais que toute mesure porte une **incertitude** — deux valeurs très proches ne prouvent pas l’identité, elles la rendent probable.`,
          },
          questions: [
            ['Quel gaz rallume une bûchette incandescente ?', ['Le dioxygène', 'Le dioxyde de carbone', 'Le dihydrogène', 'Le diazote'], 0, 'Le dioxyde de carbone, lui, trouble l’eau de chaux.'],
            ['Quel test caractérise la présence d’eau ?', ['Le sulfate de cuivre anhydre passe du blanc au bleu', 'L’eau de chaux se trouble', 'Une détonation se produit', 'Un précipité rouille apparaît'], 0, 'C’est un test simple et réversible par chauffage.'],
            ['Quelle couleur a le précipité obtenu avec la soude en présence d’ions fer III ?', ['Rouille', 'Bleu', 'Vert', 'Blanc'], 0, 'Le fer II donne un précipité vert, le cuivre II un précipité bleu.'],
            ['Que met en évidence le nitrate d’argent ?', ['Les ions chlorure, par un précipité blanc qui noircit à la lumière', 'Les ions cuivre', 'Le dioxygène', 'L’eau'], 0, 'Le noircissement est dû à la photosensibilité du chlorure d’argent.'],
            ['Comment calcule-t-on le rapport frontal Rf ?', ['Distance parcourue par la tache divisée par la distance parcourue par le front d’éluant', 'Distance du front divisée par la distance de la tache', 'Masse de l’espèce divisée par le volume', 'Hauteur de la plaque divisée par sa largeur'], 0, 'Rf est compris entre 0 et 1.'],
            ['Que conclut-on si deux dépôts migrent à la même hauteur en chromatographie ?', ['Il s’agit probablement de la même espèce chimique', 'Ils ont la même masse', 'Ils ont la même couleur', 'Ils sont de concentration égale'], 0, 'Dans le même couple support-éluant.'],
            ['Quel appareil permet de mesurer la température de fusion d’un solide ?', ['Le banc Kofler', 'Le spectrophotomètre', 'Le réfractomètre', 'La burette'], 0, 'La température de fusion est une grandeur caractéristique.'],
            ['Une seule mesure suffit à identifier avec certitude une espèce chimique.', ['Vrai', 'Faux'], 1, 'On croise plusieurs indices, et toute mesure porte une incertitude.'],
          ],
        },
        {
          titre: 'Le noyau de l’atome',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Ce qu’il y a dans le noyau, et pourquoi ça compte',
            cours: `Un **atome** est constitué d’un **noyau** central, chargé positivement, autour duquel se répartissent des **électrons** chargés négativement.

## Composition du noyau
Le noyau contient des **nucléons** : les **protons**, de charge +e, et les **neutrons**, neutres. Le **numéro atomique** Z est le nombre de protons ; le **nombre de masse** A est le nombre total de nucléons. Le nombre de neutrons vaut donc A − Z. On note un noyau par son symbole précédé de A en haut et Z en bas.

## L’atome est neutre
Un atome possède autant d’électrons que de protons : sa charge totale est nulle. La charge élémentaire vaut e = 1,6 × 10⁻¹⁹ C.

## Une structure lacunaire
Le noyau mesure environ 10⁻¹⁵ m, l’atome environ 10⁻¹⁰ m : le rapport est de 100 000. L’atome est donc essentiellement **vide**. Pourtant, presque toute sa masse est dans le noyau, un nucléon étant environ 1 800 fois plus massif qu’un électron.

> Si le noyau avait la taille d’une bille au centre d’un stade, les électrons occuperaient les gradins : c’est cela, une structure lacunaire.

## Éléments et isotopes
Un **élément chimique** est défini par son seul numéro atomique Z. Deux noyaux de même Z mais de A différents sont des **isotopes** : carbone 12 et carbone 14 ont tous deux 6 protons, mais 6 et 8 neutrons. Les isotopes ont les mêmes propriétés chimiques, car celles-ci dépendent des électrons.

## Les ions
Un atome qui perd des électrons devient un **cation** (charge positive), un atome qui en gagne devient un **anion** (charge négative). Le noyau, lui, n’est pas modifié : c’est toujours le même élément.

## La masse d’un atome
Elle se calcule en additionnant les masses des nucléons et des électrons ; en pratique, m ≈ A × masse d’un nucléon, l’apport des électrons étant négligeable.`,
          },
          questions: [
            ['Que désigne le numéro atomique Z ?', ['Le nombre de protons du noyau', 'Le nombre de nucléons', 'Le nombre de neutrons', 'Le nombre d’électrons de la couche externe'], 0, 'Il définit l’élément chimique.'],
            ['Comment obtient-on le nombre de neutrons d’un noyau ?', ['En calculant A − Z', 'En calculant A + Z', 'En calculant Z − A', 'En divisant A par Z'], 0, 'A est le nombre total de nucléons.'],
            ['Que sont deux isotopes ?', ['Deux noyaux de même Z mais de A différents', 'Deux noyaux de même A mais de Z différents', 'Deux atomes de charges opposées', 'Deux ions du même élément'], 0, 'Ils ont les mêmes propriétés chimiques.'],
            ['Quel est l’ordre de grandeur du diamètre d’un atome ?', ['10⁻¹⁰ m', '10⁻¹⁵ m', '10⁻⁶ m', '10⁻³ m'], 0, 'Le noyau, lui, mesure environ 10⁻¹⁵ m.'],
            ['Pourquoi dit-on que l’atome a une structure lacunaire ?', ['Parce que le noyau est 100 000 fois plus petit que l’atome', 'Parce qu’il lui manque des électrons', 'Parce qu’il contient des trous', 'Parce qu’il est instable'], 0, 'L’essentiel du volume de l’atome est vide.'],
            ['Où se trouve l’essentiel de la masse d’un atome ?', ['Dans le noyau', 'Dans le nuage électronique', 'Répartie uniformément', 'Dans les neutrons uniquement'], 0, 'Un nucléon est environ 1 800 fois plus massif qu’un électron.'],
            ['Un atome qui perd un électron devient un anion.', ['Vrai', 'Faux'], 1, 'Il devient un cation, de charge positive.'],
            ['Que vaut la charge élémentaire e ?', ['1,6 × 10⁻¹⁹ C', '9,1 × 10⁻³¹ C', '6,02 × 10²³ C', '3,0 × 10⁸ C'], 0, 'Le proton porte +e, l’électron −e.'],
          ],
        },
        {
          titre: 'Configuration électronique d’un atome',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Ranger les électrons pour prévoir la chimie',
            cours: `Les électrons d’un atome ne sont pas placés au hasard : ils occupent des **sous-couches**, remplies dans un ordre précis.

## Les sous-couches
On les note 1s, 2s, 2p, 3s, 3p, 4s… Une sous-couche s accueille au maximum **2** électrons, une sous-couche p au maximum **6**. Le remplissage se fait par énergie croissante : 1s, puis 2s, 2p, puis 3s, 3p, puis 4s. Pour les 18 premiers éléments, l’ordre est simple à retenir.

## Écrire une configuration
On place les Z électrons dans cet ordre. Exemples : hydrogène (Z = 1) 1s¹ ; carbone (Z = 6) 1s² 2s² 2p² ; oxygène (Z = 8) 1s² 2s² 2p⁴ ; sodium (Z = 11) 1s² 2s² 2p⁶ 3s¹ ; chlore (Z = 17) 1s² 2s² 2p⁶ 3s² 3p⁵.

## Les électrons de valence
Ce sont les électrons de la **couche externe**, celle de plus grand numéro. Ils sont les seuls à intervenir dans les réactions chimiques : deux éléments qui en ont le même nombre ont des propriétés voisines.

> Toute la chimie d’un élément tient dans sa couche externe : le reste des électrons ne fait que compléter le tableau.

## Le tableau périodique
Mendeleïev l’a construit en classant les éléments par masse croissante et par propriétés voisines ; on le range aujourd’hui par **numéro atomique croissant**. Une **ligne** (période) correspond à une couche externe de même numéro ; une **colonne** (famille) rassemble des éléments ayant le **même nombre d’électrons de valence**, donc des propriétés chimiques semblables.

## Les grandes familles
La première colonne rassemble les **alcalins**, très réactifs, qui perdent facilement un électron. L’avant-dernière colonne rassemble les **halogènes**, qui en gagnent facilement un. La dernière colonne rassemble les **gaz nobles**, dont la couche externe est saturée : ils sont chimiquement inertes.`,
          },
          questions: [
            ['Combien d’électrons au maximum une sous-couche s peut-elle contenir ?', ['2', '6', '8', '10'], 0, 'Une sous-couche p en contient au maximum 6.'],
            ['Quelle est la configuration électronique de l’oxygène (Z = 8) ?', ['1s² 2s² 2p⁴', '1s² 2s² 2p⁶', '1s² 2s⁴ 2p²', '1s² 2s² 2p² 3s²'], 0, 'Huit électrons répartis par énergie croissante.'],
            ['Qu’appelle-t-on électrons de valence ?', ['Les électrons de la couche externe', 'Tous les électrons de l’atome', 'Les électrons du noyau', 'Les électrons de la première couche'], 0, 'Ce sont eux qui interviennent dans les réactions chimiques.'],
            ['Comment le tableau périodique est-il ordonné aujourd’hui ?', ['Par numéro atomique croissant', 'Par masse volumique croissante', 'Par ordre alphabétique', 'Par température de fusion'], 0, 'Mendeleïev l’avait d’abord ordonné par masse.'],
            ['Que partagent les éléments d’une même colonne du tableau périodique ?', ['Le même nombre d’électrons de valence', 'La même masse atomique', 'Le même nombre de neutrons', 'Le même état physique'], 0, 'D’où des propriétés chimiques semblables.'],
            ['Quelle est la particularité des gaz nobles ?', ['Leur couche externe est saturée, ils sont chimiquement inertes', 'Ils perdent facilement un électron', 'Ils gagnent facilement un électron', 'Ils sont tous radioactifs'], 0, 'Ils occupent la dernière colonne du tableau.'],
            ['Les alcalins de la première colonne perdent facilement un électron.', ['Vrai', 'Faux'], 0, 'C’est ce qui explique leur grande réactivité.'],
            ['Dans quel ordre remplit-on les sous-couches pour les 18 premiers éléments ?', ['1s, 2s, 2p, 3s, 3p', '1s, 2p, 2s, 3p, 3s', '1s, 2s, 3s, 2p, 3p', '2s, 1s, 2p, 3s, 3p'], 0, 'Par énergie croissante.'],
          ],
        },
        {
          titre: 'Stabilité et charge électrique d’une entité chimique',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Pourquoi les atomes s’associent',
            cours: `Un atome isolé n’est presque jamais stable. Pour le devenir, il gagne, perd ou partage des électrons.

## Les règles du duet et de l’octet
Un atome tend à acquérir la configuration électronique du **gaz noble** le plus proche : deux électrons sur la couche externe pour les éléments légers (**règle du duet**, hélium), huit pour les autres (**règle de l’octet**, néon, argon).

## Les ions monoatomiques
Le sodium (1s² 2s² 2p⁶ 3s¹) perd son unique électron externe et donne Na⁺, qui a la configuration du néon. Le chlore (…3s² 3p⁵) en gagne un et donne Cl⁻, qui a celle de l’argon. Le magnésium donne Mg²⁺, l’oxygène O²⁻. La charge d’un ion se lit ainsi directement dans la colonne du tableau périodique.

> Perdre ou gagner : l’atome choisit toujours le chemin le plus court vers l’octet.

## La liaison covalente
Deux atomes peuvent aussi **partager** un doublet d’électrons : c’est la **liaison covalente**. Chaque atome apporte un électron, et compte le doublet partagé comme lui appartenant. Le nombre de liaisons qu’un atome forme est fixé par le nombre d’électrons qui lui manquent : quatre pour le carbone, trois pour l’azote, deux pour l’oxygène, une pour l’hydrogène et les halogènes.

## Les schémas de Lewis
On y représente les **doublets liants** (les liaisons, par un tiret) et les **doublets non liants** (les paires d’électrons non partagées). Le schéma de Lewis de l’eau montre deux liaisons O–H et deux doublets non liants sur l’oxygène.

## Les molécules
Une **molécule** est un ensemble d’atomes liés par des liaisons covalentes, électriquement neutre. Sa formule brute donne la nature et le nombre des atomes ; sa formule développée ou semi-développée montre l’enchaînement des liaisons.`,
          },
          questions: [
            ['Que dit la règle de l’octet ?', ['Un atome tend à avoir huit électrons sur sa couche externe', 'Un atome tend à avoir huit protons', 'Un atome perd toujours huit électrons', 'Un atome forme huit liaisons'], 0, 'La règle du duet vise deux électrons, pour les éléments légers.'],
            ['Quel ion le sodium (Z = 11) forme-t-il ?', ['Na⁺', 'Na⁻', 'Na²⁺', 'Na²⁻'], 0, 'Il perd son unique électron de la couche 3s.'],
            ['Quel ion l’oxygène forme-t-il ?', ['O²⁻', 'O⁺', 'O²⁺', 'O⁻'], 0, 'Il gagne deux électrons pour atteindre l’octet.'],
            ['Qu’est-ce qu’une liaison covalente ?', ['Le partage d’un doublet d’électrons entre deux atomes', 'Le transfert d’un électron d’un atome à l’autre', 'Une attraction entre deux ions', 'Une liaison entre deux noyaux'], 0, 'Chaque atome apporte un électron au doublet partagé.'],
            ['Combien de liaisons covalentes le carbone forme-t-il ?', ['Quatre', 'Deux', 'Trois', 'Une'], 0, 'Il lui manque quatre électrons pour l’octet.'],
            ['Qu’est-ce qu’un doublet non liant ?', ['Une paire d’électrons de valence non partagée', 'Une liaison double', 'Un électron célibataire', 'Une liaison ionique'], 0, 'L’oxygène de la molécule d’eau en porte deux.'],
            ['Une molécule est électriquement neutre.', ['Vrai', 'Faux'], 0, 'Contrairement à un ion, qui porte une charge.'],
            ['Combien de liaisons l’azote forme-t-il habituellement ?', ['Trois', 'Deux', 'Quatre', 'Une'], 0, 'Il lui manque trois électrons pour compléter son octet.'],
          ],
        },
        {
          titre: 'Compter les entités dans un échantillon de matière',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'La mole, ou comment peser des atomes',
            cours: `Une goutte d’eau contient un nombre inimaginable de molécules. Pour les compter, les chimistes utilisent un paquet de taille fixe : la **mole**.

## La mole et la constante d’Avogadro
Une **mole** contient exactement N_A entités, avec N_A = 6,02 × 10²³ mol⁻¹, la **constante d’Avogadro**. La **quantité de matière** n, en moles, se relie au nombre d’entités N par : n = N / N_A.

> La mole n’est pas une masse ni un volume : c’est un COMPTE, comme la douzaine — simplement beaucoup plus grand.

## La masse molaire
La **masse molaire** M est la masse d’une mole d’entités, en g·mol⁻¹. Elle se lit dans le tableau périodique pour un atome (M(H) = 1,0 ; M(C) = 12,0 ; M(O) = 16,0) et s’additionne pour une molécule : M(H₂O) = 2 × 1,0 + 16,0 = 18,0 g·mol⁻¹.

## Les relations à connaître
De la masse à la quantité : n = m / M. Du volume d’un liquide à la masse : m = ρ × V. Pour un gaz, avec le **volume molaire** V_m (24,0 L·mol⁻¹ à 20 °C sous 1 013 hPa) : n = V / V_m. Pour une solution, la **concentration en quantité de matière** vaut c = n / V, en mol·L⁻¹, et se relie à la concentration en masse par t = c × M.

## Un exemple
Quelle quantité de matière dans 9,0 g d’eau ? n = m / M = 9,0 / 18,0 = 0,50 mol, soit 0,50 × 6,02 × 10²³ ≈ 3,0 × 10²³ molécules.

## Les chiffres significatifs
Un résultat ne peut pas être plus précis que la donnée la moins précise : on garde le même nombre de **chiffres significatifs** que la donnée la plus pauvre, et l’on soigne les unités à chaque étape.`,
          },
          questions: [
            ['Que vaut la constante d’Avogadro ?', ['6,02 × 10²³ mol⁻¹', '1,6 × 10⁻¹⁹ mol⁻¹', '9,81 mol⁻¹', '3,0 × 10⁸ mol⁻¹'], 0, 'C’est le nombre d’entités contenues dans une mole.'],
            ['Quelle relation relie quantité de matière et nombre d’entités ?', ['n = N / N_A', 'n = N × N_A', 'n = N_A / N', 'n = N + N_A'], 0, 'La quantité de matière s’exprime en moles.'],
            ['Quelle est la masse molaire de l’eau H₂O ?', ['18,0 g·mol⁻¹', '16,0 g·mol⁻¹', '20,0 g·mol⁻¹', '34,0 g·mol⁻¹'], 0, 'Soit 2 × 1,0 + 16,0.'],
            ['Comment calcule-t-on une quantité de matière à partir d’une masse ?', ['n = m / M', 'n = m × M', 'n = M / m', 'n = m + M'], 0, 'Avec m en grammes et M en g·mol⁻¹.'],
            ['Quelle quantité de matière représente 9,0 g d’eau ?', ['0,50 mol', '1,0 mol', '2,0 mol', '0,25 mol'], 0, 'n = 9,0 / 18,0 = 0,50 mol.'],
            ['Comment calcule-t-on la quantité de matière d’un gaz ?', ['n = V / V_m', 'n = V × V_m', 'n = V_m / V', 'n = V / M'], 0, 'V_m vaut environ 24,0 L·mol⁻¹ à 20 °C sous 1 013 hPa.'],
            ['La mole est une unité de masse.', ['Vrai', 'Faux'], 1, 'C’est une unité de quantité de matière, donc un compte d’entités.'],
            ['Comment relie-t-on concentration en masse et concentration en quantité de matière ?', ['t = c × M', 't = c / M', 't = M / c', 't = c + M'], 0, 'M est la masse molaire du soluté.'],
          ],
        },
        {
          titre: 'Caractéristiques et représentation d’un changement d’état',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Ce qui change, et ce qui ne change pas',
            cours: `Un **changement d’état** est une transformation **physique** : les molécules restent les mêmes, seule leur organisation change.

## Les six changements
De solide à liquide : la **fusion** ; l’inverse, la **solidification**. De liquide à gaz : la **vaporisation** ; l’inverse, la **liquéfaction**. De solide à gaz directement : la **sublimation** ; l’inverse, la **condensation** (dite aussi condensation solide).

## Trois états, trois organisations
Dans un **solide**, les entités sont ordonnées et fixes ; dans un **liquide**, désordonnées mais liées et en contact ; dans un **gaz**, très éloignées, désordonnées et en mouvement rapide. Un solide a une forme propre, un liquide prend celle de son récipient, un gaz occupe tout le volume disponible.

## Le palier de température
Pour un **corps pur**, la température reste **constante** pendant tout le changement d’état, sous pression donnée : c’est le **palier**. La courbe de température en fonction du temps le montre clairement. Un mélange, lui, ne présente pas de palier net — et c’est un moyen de distinguer un corps pur d’un mélange.

> Chauffer pendant un palier ne fait pas monter la température : l’énergie apportée sert à défaire les interactions entre entités, pas à les agiter davantage.

## L’aspect énergétique
Fusion, vaporisation et sublimation sont **endothermiques** : elles absorbent de l’énergie. Solidification, liquéfaction et condensation sont **exothermiques** : elles en libèrent. C’est pourquoi la transpiration rafraîchit — l’eau qui se vaporise prélève de l’énergie sur la peau.

## L’effet de la pression
Les températures de changement d’état dépendent de la **pression**. L’eau bout à 100 °C sous 1 013 hPa, mais à environ 70 °C au sommet de l’Everest, où la pression est bien plus faible.`,
          },
          questions: [
            ['Comment appelle-t-on le passage de l’état solide à l’état gazeux ?', ['La sublimation', 'La fusion', 'La vaporisation', 'La liquéfaction'], 0, 'Le passage inverse est la condensation solide.'],
            ['Comment appelle-t-on le passage de l’état gazeux à l’état liquide ?', ['La liquéfaction', 'La vaporisation', 'La solidification', 'La sublimation'], 0, 'C’est ce qui se produit sur une vitre froide.'],
            ['Que se passe-t-il pour la température d’un corps pur pendant un changement d’état ?', ['Elle reste constante', 'Elle augmente régulièrement', 'Elle diminue', 'Elle varie de façon aléatoire'], 0, 'C’est le palier de changement d’état.'],
            ['Comment distinguer un corps pur d’un mélange à partir d’une courbe de chauffage ?', ['Le corps pur présente un palier net, pas le mélange', 'Le mélange chauffe plus vite', 'Le corps pur ne change pas d’état', 'Le mélange présente deux paliers'], 0, 'C’est un critère expérimental simple.'],
            ['La fusion est-elle endothermique ou exothermique ?', ['Endothermique : elle absorbe de l’énergie', 'Exothermique : elle libère de l’énergie', 'Ni l’un ni l’autre', 'Cela dépend du corps'], 0, 'La solidification, elle, libère de l’énergie.'],
            ['Pourquoi la transpiration rafraîchit-elle ?', ['Parce que la vaporisation de l’eau prélève de l’énergie sur la peau', 'Parce que l’eau est froide', 'Parce que le vent souffle', 'Parce que la peau se dilate'], 0, 'La vaporisation est endothermique.'],
            ['Un changement d’état modifie la nature des molécules.', ['Vrai', 'Faux'], 1, 'C’est une transformation physique : seule l’organisation change.'],
            ['À quelle température l’eau bout-elle au sommet de l’Everest ?', ['Environ 70 °C', 'Exactement 100 °C', 'Environ 120 °C', 'Environ 0 °C'], 0, 'La pression y est bien plus faible qu’au niveau de la mer.'],
          ],
        },
        {
          titre: 'Écriture et analyse d’une réaction chimique',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Équilibrer, puis suivre ce qui disparaît',
            cours: `Lors d’une **transformation chimique**, des espèces disparaissent — les **réactifs** — et d’autres se forment — les **produits**.

## L’équation de réaction
On écrit les réactifs à gauche, les produits à droite, séparés par une flèche. Les **nombres stœchiométriques** placés devant les formules assurent la **conservation des éléments** et de la **charge électrique** : autant d’atomes de chaque élément de part et d’autre. Exemple : CH₄ + 2 O₂ donne CO₂ + 2 H₂O.

> Équilibrer une équation, ce n’est pas un jeu d’écriture : c’est traduire que rien ne se perd et que rien ne se crée, ni atome, ni charge.

## Ce que l’équation dit, et ne dit pas
Elle donne les **proportions** dans lesquelles les espèces réagissent, pas les quantités réellement engagées ni la vitesse de la réaction.

## Le tableau d’avancement
On note x l’**avancement** de la réaction, en moles. Pour chaque espèce, la quantité à l’instant t vaut la quantité initiale diminuée (réactif) ou augmentée (produit) du produit de x par son nombre stœchiométrique. Trois lignes suffisent : état initial, état intermédiaire, état final.

## Le réactif limitant
La réaction s’arrête quand un réactif est entièrement consommé : c’est le **réactif limitant**. L’avancement maximal x_max est la plus petite valeur qui annule la quantité d’un réactif. Si tous les réactifs disparaissent en même temps, le mélange est dit **stœchiométrique**.

## Un exemple
Pour CH₄ + 2 O₂, avec 1,0 mol de méthane et 1,0 mol de dioxygène : le dioxygène s’annule pour x = 0,50 mol, le méthane pour x = 1,0 mol. Le limitant est donc le dioxygène, et x_max = 0,50 mol.

## Le rôle de l’énergie
Une réaction qui libère de l’énergie sous forme thermique est **exothermique** (combustion), une réaction qui en absorbe est **endothermique**.`,
          },
          questions: [
            ['Que garantit l’équilibrage d’une équation de réaction ?', ['La conservation des éléments et de la charge électrique', 'La conservation du volume', 'La conservation de la température', 'L’égalité des masses molaires'], 0, 'Autant d’atomes de chaque élément de part et d’autre.'],
            ['Quelle équation traduit correctement la combustion complète du méthane ?', ['CH₄ + 2 O₂ donne CO₂ + 2 H₂O', 'CH₄ + O₂ donne CO₂ + H₂O', 'CH₄ + 3 O₂ donne CO₂ + 2 H₂O', 'CH₄ + 2 O₂ donne CO + 2 H₂O'], 0, 'Quatre atomes d’oxygène de chaque côté.'],
            ['Que représente l’avancement x d’une réaction ?', ['Une quantité de matière, en moles, mesurant la progression de la réaction', 'Une vitesse de réaction', 'Une masse de produit', 'Une durée'], 0, 'Il structure le tableau d’avancement.'],
            ['Qu’est-ce que le réactif limitant ?', ['Le réactif entièrement consommé en premier, qui arrête la réaction', 'Le réactif présent en plus grande quantité', 'Le réactif le plus cher', 'Le réactif ajouté en dernier'], 0, 'Il fixe l’avancement maximal.'],
            ['Qu’est-ce qu’un mélange stœchiométrique ?', ['Un mélange où tous les réactifs sont consommés en même temps', 'Un mélange de volumes égaux', 'Un mélange de masses égales', 'Un mélange sans réactif limitant identifiable'], 0, 'Aucun réactif ne reste en excès.'],
            ['Avec 1,0 mol de CH₄ et 1,0 mol de O₂, quel est le réactif limitant ?', ['Le dioxygène', 'Le méthane', 'Aucun, le mélange est stœchiométrique', 'Les deux à la fois'], 0, 'Il s’annule pour x = 0,50 mol, contre 1,0 mol pour le méthane.'],
            ['Une équation de réaction indique la vitesse à laquelle la réaction se produit.', ['Vrai', 'Faux'], 1, 'Elle indique seulement les proportions dans lesquelles les espèces réagissent.'],
            ['Comment qualifie-t-on une réaction qui libère de l’énergie thermique ?', ['Exothermique', 'Endothermique', 'Athermique', 'Isotherme'], 0, 'Les combustions en sont l’exemple classique.'],
          ],
        },
        {
          titre: 'Synthèse d’une espèce chimique présente dans la nature',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Fabriquer au laboratoire ce que la nature produit',
            cours: `Une **synthèse** consiste à fabriquer une espèce chimique à partir d’autres espèces. Elle peut reproduire une molécule existant dans la nature.

## Pourquoi synthétiser
Parce que l’extraction naturelle est parfois insuffisante (quantité disponible, coût, saisonnalité), destructrice pour un milieu, ou beaucoup plus chère. Une molécule synthétisée est **identique** à la molécule naturelle si sa structure est la même : le corps ne fait aucune différence entre une vanilline extraite de la gousse et une vanilline de synthèse.

> « Naturel » n’est pas un synonyme d’« inoffensif », et « de synthèse » n’est pas un synonyme de « dangereux » : ce qui compte est la molécule, sa dose et son usage.

## Les trois étapes d’un protocole
La **transformation** : on mélange les réactifs, souvent en chauffant à reflux — un montage qui condense les vapeurs et les renvoie dans le ballon, ce qui permet de chauffer sans rien perdre. La **séparation** : filtration, décantation à l’ampoule, extraction par un solvant, recristallisation. L’**identification** : chromatographie sur couche mince, mesure de la température de fusion, spectres.

## Le rendement
Le **rendement** est le rapport de la quantité de produit réellement obtenue à la quantité maximale attendue d’après l’équation et le réactif limitant. Il est toujours inférieur à 1 : pertes lors des transferts, réaction incomplète, réactions secondaires.

## Extraction par solvant
Elle repose sur la différence de **solubilité** de l’espèce dans deux liquides **non miscibles**. On agite, on laisse décanter, on récupère la phase contenant l’espèce voulue.

## La sécurité
Pictogrammes de danger, mentions H et P, port des équipements de protection, hotte aspirante, tri des déchets : un protocole de synthèse comprend toujours son volet sécurité.`,
          },
          questions: [
            ['Une molécule de synthèse diffère-t-elle de la même molécule naturelle ?', ['Non, si sa structure est identique', 'Oui, toujours', 'Oui, elle est moins pure par nature', 'Oui, elle a une masse molaire différente'], 0, 'L’organisme ne fait aucune différence.'],
            ['À quoi sert un chauffage à reflux ?', ['Chauffer sans perdre de matière, les vapeurs étant condensées et renvoyées', 'Refroidir le mélange réactionnel', 'Séparer deux liquides', 'Mesurer la température de fusion'], 0, 'Il accélère la réaction sans perte.'],
            ['Quelles sont les trois grandes étapes d’une synthèse ?', ['Transformation, séparation, identification', 'Pesée, dissolution, filtration', 'Mesure, calcul, conclusion', 'Extraction, dilution, dosage'], 0, 'Chacune a ses techniques propres.'],
            ['Comment définit-on le rendement d’une synthèse ?', ['Le rapport de la quantité obtenue à la quantité maximale attendue', 'La masse de produit obtenue', 'Le rapport du volume au temps', 'Le rapport des masses molaires'], 0, 'Il est toujours inférieur à 1.'],
            ['Pourquoi le rendement n’atteint-il jamais 100 % ?', ['Pertes aux transferts, réaction incomplète, réactions secondaires', 'Parce que les réactifs sont impurs par définition', 'Parce que la mole est une approximation', 'Parce que la balance est imprécise'], 0, 'Plusieurs causes se cumulent.'],
            ['Sur quoi repose une extraction par solvant ?', ['La différence de solubilité de l’espèce dans deux liquides non miscibles', 'La différence de température d’ébullition', 'La différence de masse molaire', 'La différence de couleur'], 0, 'On sépare ensuite les phases par décantation.'],
            ['Une espèce naturelle est nécessairement moins dangereuse qu’une espèce de synthèse.', ['Vrai', 'Faux'], 1, 'Ce qui compte est la molécule, sa dose et son usage.'],
            ['Que trouve-t-on sur l’étiquette d’un flacon de produit chimique ?', ['Des pictogrammes de danger et des mentions H et P', 'Le rendement de synthèse', 'La quantité de matière', 'Le protocole complet'], 0, 'Elles guident les précautions à prendre.'],
          ],
        },
        {
          titre: 'Identifier une réaction nucléaire',
          axe: 'Constitution et transformation de la matière',
          lecon: {
            titre: 'Quand c’est le noyau qui change',
            cours: `Une **réaction nucléaire** modifie le **noyau** des atomes, contrairement à une réaction chimique, qui ne concerne que les électrons.

## Le critère
Dans une réaction chimique, les éléments se conservent : on retrouve les mêmes atomes autrement liés. Dans une réaction nucléaire, un élément se **transforme** en un autre, et l’énergie mise en jeu est de l’ordre du million de fois plus grande.

## Les lois de conservation
Deux lois, dites **lois de Soddy**, gouvernent l’écriture : conservation du **nombre de nucléons** A et conservation du **nombre de charge** Z. Elles suffisent à compléter n’importe quelle équation nucléaire.

## La radioactivité
Un noyau instable se désintègre spontanément. La radioactivité **α** émet un noyau d’hélium (A diminue de 4, Z de 2). La radioactivité **β⁻** émet un électron : un neutron se transforme en proton, donc Z augmente de 1 à A constant. La radioactivité **β⁺** émet un positon : Z diminue de 1. Le rayonnement **γ** accompagne les précédentes : c’est un rayonnement électromagnétique très énergétique émis par un noyau qui se désexcite.

> La désintégration d’un noyau donné est imprévisible ; c’est à l’échelle d’un très grand nombre de noyaux qu’une loi statistique apparaît.

## Fission et fusion
La **fission** casse un noyau lourd, comme l’uranium 235, en deux noyaux plus légers sous l’impact d’un neutron : c’est le principe des centrales nucléaires. La **fusion** unit deux noyaux légers, comme des isotopes de l’hydrogène : c’est la source d’énergie des étoiles, dont le Soleil.

## Applications et risques
Datation au carbone 14, imagerie médicale, radiothérapie, production d’électricité — et, en regard, gestion des déchets radioactifs, radioprotection, risque d’accident. Les choix énergétiques mêlent physique, économie et politique.`,
          },
          questions: [
            ['Qu’est-ce qui distingue une réaction nucléaire d’une réaction chimique ?', ['Elle modifie le noyau et transforme un élément en un autre', 'Elle ne concerne que les électrons', 'Elle libère moins d’énergie', 'Elle conserve la charge des ions'], 0, 'L’énergie mise en jeu est de l’ordre du million de fois plus grande.'],
            ['Que conservent les lois de Soddy ?', ['Le nombre de nucléons A et le nombre de charge Z', 'La masse et le volume', 'La température et la pression', 'Le nombre d’électrons'], 0, 'Elles permettent de compléter une équation nucléaire.'],
            ['Que se passe-t-il lors d’une désintégration α ?', ['Le noyau émet un noyau d’hélium : A diminue de 4, Z de 2', 'Le noyau émet un électron', 'Le noyau émet un positon', 'Le noyau se scinde en deux'], 0, 'La particule α est un noyau d’hélium 4.'],
            ['Que se passe-t-il lors d’une désintégration β⁻ ?', ['Un neutron devient un proton et un électron est émis : Z augmente de 1', 'Un proton devient un neutron', 'Le noyau perd deux protons', 'Le noyau émet un photon seulement'], 0, 'Le nombre de nucléons A reste constant.'],
            ['Qu’est-ce que le rayonnement γ ?', ['Un rayonnement électromagnétique très énergétique émis par un noyau qui se désexcite', 'Un noyau d’hélium', 'Un flux d’électrons', 'Un flux de neutrons'], 0, 'Il accompagne souvent les désintégrations α et β.'],
            ['Qu’est-ce que la fission nucléaire ?', ['La cassure d’un noyau lourd en noyaux plus légers', 'L’union de deux noyaux légers', 'L’émission d’un électron', 'La désexcitation d’un noyau'], 0, 'C’est le principe des centrales nucléaires actuelles.'],
            ['La fusion nucléaire est la source d’énergie des étoiles.', ['Vrai', 'Faux'], 0, 'Elle unit des noyaux légers, comme des isotopes de l’hydrogène.'],
            ['Peut-on prévoir le moment exact où un noyau donné va se désintégrer ?', ['Non, seule une loi statistique apparaît sur un grand nombre de noyaux', 'Oui, avec précision', 'Oui, si l’on connaît sa masse', 'Oui, en le refroidissant'], 0, 'La désintégration individuelle est imprévisible.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 : mouvements et interactions
        // ===================================================================
        {
          titre: 'Relativité du mouvement',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Il n’y a pas de mouvement sans référentiel',
            cours: `Dire qu’un objet bouge n’a aucun sens tant qu’on n’a pas dit **par rapport à quoi**.

## Le référentiel
Un **référentiel** est un objet de référence, auquel on associe un repère d’espace et une horloge. Un passager assis dans un train est **immobile** dans le référentiel du train, et **en mouvement** dans le référentiel du sol : les deux descriptions sont également justes. C’est la **relativité du mouvement**.

> Un mouvement n’est ni vrai ni faux : il est relatif au référentiel choisi. Le premier réflexe, en mécanique, est de dire lequel on prend.

## Les référentiels usuels
Le référentiel **terrestre**, lié au sol, sert aux mouvements du quotidien. Le référentiel **géocentrique**, lié au centre de la Terre, sert au mouvement des satellites. Le référentiel **héliocentrique**, lié au centre du Soleil, sert au mouvement des planètes.

## Trajectoire
La **trajectoire** d’un point est l’ensemble des positions successives qu’il occupe dans un référentiel donné. Elle change avec le référentiel : la valve d’une roue de vélo décrit un cercle pour le cycliste et une **cycloïde** — une courbe en arches — pour un observateur au bord de la route.

## Décrire un mouvement
Un mouvement est **rectiligne** si la trajectoire est une droite, **circulaire** si c’est un cercle, **curviligne** sinon. Il est **uniforme** si la valeur de la vitesse est constante, **accéléré** si elle augmente, **ralenti** ou décéléré si elle diminue. On combine les deux mots : rectiligne uniforme, circulaire uniforme, rectiligne accéléré.

## La vitesse moyenne
Elle vaut v = d / Δt, en m·s⁻¹ dans le système international. Pour convertir, 1 m·s⁻¹ = 3,6 km·h⁻¹. La **vitesse instantanée** est celle mesurée sur un intervalle de temps très court, celui de deux positions successives d’un enregistrement.`,
          },
          questions: [
            ['Qu’est-ce qu’un référentiel ?', ['Un objet de référence, muni d’un repère et d’une horloge', 'La trajectoire d’un objet', 'La vitesse d’un mobile', 'Un système d’unités'], 0, 'Sans lui, décrire un mouvement n’a pas de sens.'],
            ['Un passager assis dans un train est-il en mouvement ?', ['Cela dépend du référentiel choisi', 'Oui, toujours', 'Non, jamais', 'Seulement si le train accélère'], 0, 'Immobile dans le référentiel du train, en mouvement dans celui du sol.'],
            ['Quel référentiel utilise-t-on pour étudier le mouvement des planètes ?', ['Le référentiel héliocentrique', 'Le référentiel terrestre', 'Le référentiel géocentrique', 'Le référentiel du laboratoire'], 0, 'Le géocentrique sert aux satellites de la Terre.'],
            ['Qu’est-ce que la trajectoire d’un point ?', ['L’ensemble de ses positions successives dans un référentiel donné', 'La distance qu’il parcourt', 'Sa vitesse au cours du temps', 'Sa position initiale'], 0, 'Elle change si l’on change de référentiel.'],
            ['Quelle courbe décrit la valve d’une roue de vélo pour un observateur au bord de la route ?', ['Une cycloïde', 'Un cercle', 'Une droite', 'Une parabole'], 0, 'Pour le cycliste, elle décrit un cercle.'],
            ['Comment qualifie-t-on un mouvement dont la trajectoire est une droite et la vitesse constante ?', ['Rectiligne uniforme', 'Circulaire uniforme', 'Rectiligne accéléré', 'Curviligne ralenti'], 0, 'Deux informations : la forme et l’évolution de la vitesse.'],
            ['À combien de km·h⁻¹ correspond 1 m·s⁻¹ ?', ['3,6 km·h⁻¹', '1,0 km·h⁻¹', '0,36 km·h⁻¹', '36 km·h⁻¹'], 0, 'On multiplie par 3,6 pour passer des m·s⁻¹ aux km·h⁻¹.'],
            ['La trajectoire d’un objet est la même dans tous les référentiels.', ['Vrai', 'Faux'], 1, 'Elle dépend du référentiel, comme le mouvement lui-même.'],
          ],
        },
        {
          titre: 'Représentation et variation d’un vecteur vitesse',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Une flèche qui dit tout du mouvement',
            cours: `La vitesse d’un point n’est pas seulement un nombre : c’est un **vecteur**, qui porte quatre informations.

## Les quatre caractéristiques
Le **point d’application** (la position du mobile), la **direction** (celle de la tangente à la trajectoire), le **sens** (celui du mouvement) et la **valeur** — ou norme —, en m·s⁻¹, représentée par la longueur de la flèche selon une **échelle** choisie.

> La direction du vecteur vitesse est toujours tangente à la trajectoire : c’est ce qui rend visible qu’un mouvement circulaire uniforme n’a rien d’un mouvement « sans changement ».

## Le construire depuis un enregistrement
À partir d’une chronophotographie ou d’un pointage vidéo, on estime la vitesse au point M_i par la distance entre les points voisins divisée par la durée écoulée : v_i ≈ M_(i−1)M_(i+1) / (2 × τ), où τ est l’intervalle de temps entre deux positions. On trace ensuite la flèche à l’échelle, tangente à la trajectoire.

## La variation du vecteur vitesse
Le vecteur variation de vitesse est la **différence** entre le vecteur vitesse final et le vecteur vitesse initial. Graphiquement, on reporte les deux vecteurs à partir d’un même point : la variation est le vecteur qui joint l’extrémité du premier à celle du second.

## Ce que la variation révèle
Le vecteur vitesse peut changer de **valeur**, de **direction**, ou des deux. Dans un mouvement rectiligne uniforme, il ne change pas : la variation est nulle. Dans un mouvement **circulaire uniforme**, la valeur est constante mais la direction change en permanence : la variation n’est PAS nulle, et elle pointe vers l’intérieur du cercle.

## Le lien avec les forces
Le vecteur variation de vitesse a le même sens que la **somme des forces** appliquées au système. C’est cette correspondance qui fait de l’étude du vecteur vitesse le point d’entrée de toute la mécanique.`,
          },
          questions: [
            ['Quelles sont les quatre caractéristiques d’un vecteur vitesse ?', ['Point d’application, direction, sens et valeur', 'Masse, vitesse, temps et distance', 'Origine, longueur, couleur et échelle', 'Position, trajectoire, durée et accélération'], 0, 'La longueur de la flèche représente la valeur, à l’échelle.'],
            ['Quelle est la direction du vecteur vitesse en un point ?', ['Celle de la tangente à la trajectoire', 'Celle de la corde entre deux points', 'Celle du rayon du cercle', 'Toujours horizontale'], 0, 'Le sens est celui du mouvement.'],
            ['Comment estime-t-on la vitesse au point M_i sur un enregistrement ?', ['En divisant la distance M_(i−1)M_(i+1) par 2 τ', 'En divisant M_iM_(i+1) par 2 τ', 'En multipliant la distance par la durée', 'En mesurant la longueur totale de la trajectoire'], 0, 'τ est l’intervalle de temps entre deux positions successives.'],
            ['Comment construit-on graphiquement la variation du vecteur vitesse ?', ['On reporte les deux vecteurs depuis un même point et on joint leurs extrémités', 'On additionne leurs longueurs', 'On les superpose', 'On calcule leur moyenne'], 0, 'La variation va de l’extrémité du vecteur initial à celle du final.'],
            ['Dans un mouvement rectiligne uniforme, que vaut la variation du vecteur vitesse ?', ['Elle est nulle', 'Elle est maximale', 'Elle pointe vers l’avant', 'Elle change de sens'], 0, 'Ni la direction ni la valeur ne changent.'],
            ['Dans un mouvement circulaire uniforme, la variation du vecteur vitesse est-elle nulle ?', ['Non, la direction change en permanence', 'Oui, la vitesse est constante', 'Oui, la trajectoire est fermée', 'Cela dépend du rayon'], 0, 'Elle pointe vers l’intérieur du cercle.'],
            ['Le vecteur variation de vitesse a le même sens que la somme des forces appliquées.', ['Vrai', 'Faux'], 0, 'C’est le lien entre cinématique et dynamique.'],
            ['Dans quelle unité s’exprime la valeur d’un vecteur vitesse dans le système international ?', ['En m·s⁻¹', 'En km·h⁻¹', 'En m·s⁻²', 'En newtons'], 0, 'On convertit en km·h⁻¹ en multipliant par 3,6.'],
          ],
        },
        {
          titre: 'Modélisation d’une action par une force',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Représenter ce qui agit sur un système',
            cours: `Une **action mécanique** est ce qui peut mettre en mouvement, arrêter, dévier ou déformer un objet. On la modélise par une **force**.

## Système et actions
La première étape est de définir le **système** étudié — l’objet dont on parle — puis d’inventorier ce qui agit sur lui. Les actions de **contact** (support, fil, ressort, frottements, air) supposent un contact matériel ; les actions **à distance** (pesanteur, magnétisme, électrostatique) s’exercent sans contact.

## La force, un vecteur
Une force se représente par un vecteur, avec un point d’application, une direction, un sens et une valeur en **newtons** (N). Un **diagramme objet-interaction** aide à n’en oublier aucune : le système au centre, les acteurs autour, une double flèche par interaction.

## Le poids
Le **poids** est l’action de la Terre sur un objet : P = m × g, avec m en kilogrammes et g ≈ 9,8 N·kg⁻¹ à la surface de la Terre. Il est vertical, dirigé vers le bas, appliqué au centre de gravité. La **masse** est une propriété de l’objet, identique partout ; le **poids** dépend du lieu — sur la Lune, g vaut environ 1,6 N·kg⁻¹.

> Un astronaute a la même masse sur la Lune et sur Terre, mais un poids six fois plus faible : masse et poids ne sont pas des synonymes.

## La gravitation
Deux corps de masses m_A et m_B, séparés d’une distance d, s’attirent avec une force de valeur F = G × m_A × m_B / d², avec G ≈ 6,67 × 10⁻¹¹ dans les unités du système international. Cette force est **attractive**, de même valeur pour les deux corps et de sens opposés. Elle décroît comme le carré de la distance : doubler la distance divise la force par quatre.

## Le principe des actions réciproques
Si A exerce une force sur B, alors B exerce sur A une force de même direction, de même valeur et de sens opposé. Les deux forces ne s’appliquent pas au même objet : elles ne se compensent donc jamais entre elles.`,
          },
          questions: [
            ['Comment modélise-t-on une action mécanique ?', ['Par une force, représentée par un vecteur', 'Par une distance', 'Par une masse', 'Par une durée'], 0, 'Point d’application, direction, sens et valeur en newtons.'],
            ['Quelle est l’unité de la valeur d’une force ?', ['Le newton', 'Le joule', 'Le pascal', 'Le kilogramme'], 0, 'Symbole N.'],
            ['Quelle est l’expression du poids d’un objet ?', ['P = m × g', 'P = m / g', 'P = g / m', 'P = m + g'], 0, 'Avec g ≈ 9,8 N·kg⁻¹ à la surface de la Terre.'],
            ['Quelle différence entre masse et poids ?', ['La masse est identique partout, le poids dépend du lieu', 'Le poids est identique partout', 'Ce sont deux mots pour la même grandeur', 'La masse se mesure en newtons'], 0, 'Sur la Lune, g vaut environ 1,6 N·kg⁻¹.'],
            ['Quelle est l’expression de la force d’interaction gravitationnelle ?', ['F = G × m_A × m_B / d²', 'F = G × m_A × m_B / d', 'F = G × d² / (m_A × m_B)', 'F = m_A × m_B × d²'], 0, 'Elle décroît comme le carré de la distance.'],
            ['Que devient la force gravitationnelle si la distance double ?', ['Elle est divisée par quatre', 'Elle est divisée par deux', 'Elle est multipliée par deux', 'Elle ne change pas'], 0, 'Le carré de la distance est au dénominateur.'],
            ['Selon le principe des actions réciproques, les deux forces se compensent-elles ?', ['Non, elles ne s’appliquent pas au même objet', 'Oui, toujours', 'Oui, si les masses sont égales', 'Oui, si les corps sont immobiles'], 0, 'Elles sont opposées mais appliquées à deux systèmes différents.'],
            ['La force exercée par un fil sur un objet est une action à distance.', ['Vrai', 'Faux'], 1, 'C’est une action de contact ; le poids est une action à distance.'],
          ],
        },
        {
          titre: 'Le principe d’inertie',
          axe: 'Mouvements et interactions',
          lecon: {
            titre: 'Ce qui se passe quand les forces se compensent',
            cours: `Le **principe d’inertie**, énoncé par Galilée puis par Newton, relie les forces appliquées à un système et l’évolution de son vecteur vitesse.

## L’énoncé
Dans un référentiel galiléen, si les forces qui s’exercent sur un système se **compensent** — leur somme est nulle —, alors le vecteur vitesse de ce système ne varie pas : le système est **immobile** ou animé d’un mouvement **rectiligne uniforme**. La réciproque est vraie : un vecteur vitesse constant implique des forces qui se compensent.

> L’erreur la plus tenace en mécanique consiste à croire qu’il faut une force pour ENTRETENIR un mouvement. Il en faut une pour le CHANGER.

## Un référentiel galiléen
C’est un référentiel dans lequel le principe s’applique. Le référentiel terrestre en est une bonne approximation pour les expériences de courte durée.

## La contraposée, plus utile en pratique
Si le vecteur vitesse **varie** — en valeur, en direction, ou les deux —, alors les forces ne se compensent pas, et la somme des forces a le même sens que la variation du vecteur vitesse. C’est ce raisonnement qu’on applique à un enregistrement de mouvement.

## Trois exemples
Une voiture qui roule à vitesse constante en ligne droite : le moteur compense exactement les frottements, la somme des forces est nulle. Une pierre lâchée sans vitesse : seul le poids agit, la vitesse augmente vers le bas. Un palet sur coussin d’air, presque sans frottement : lancé, il conserve sa vitesse et sa direction.

## Chute libre
Un corps en **chute libre** n’est soumis qu’à son poids. Tous les corps y tombent avec la même variation de vitesse, quelle que soit leur masse : une plume et une bille tombent ensemble dans un tube où l’on a fait le vide. Dans l’air, c’est la résistance de l’air, et non la masse, qui les sépare.`,
          },
          questions: [
            ['Que dit le principe d’inertie ?', ['Si les forces se compensent, le vecteur vitesse ne varie pas', 'Une force est nécessaire pour maintenir un mouvement', 'Tout corps finit par s’arrêter', 'La vitesse est proportionnelle à la force'], 0, 'Le système est immobile ou en mouvement rectiligne uniforme.'],
            ['Faut-il une force pour entretenir un mouvement rectiligne uniforme ?', ['Non, il en faut une pour le changer', 'Oui, sinon le mouvement cesse', 'Oui, proportionnelle à la vitesse', 'Cela dépend de la masse'], 0, 'C’est l’erreur la plus tenace en mécanique.'],
            ['Que peut-on conclure si le vecteur vitesse d’un système varie ?', ['Les forces ne se compensent pas', 'Le référentiel n’est pas galiléen', 'La masse a changé', 'Le système est immobile'], 0, 'La somme des forces a le même sens que la variation de vitesse.'],
            ['Pourquoi une voiture à vitesse constante sur une route droite vérifie-t-elle le principe d’inertie ?', ['Parce que la force motrice compense exactement les frottements', 'Parce qu’elle n’est soumise à aucune force', 'Parce que son moteur est éteint', 'Parce que sa masse est constante'], 0, 'La somme vectorielle des forces est nulle.'],
            ['Qu’est-ce qu’un corps en chute libre ?', ['Un corps soumis à son seul poids', 'Un corps qui tombe dans l’air', 'Un corps lâché sans vitesse initiale', 'Un corps sans masse'], 0, 'Toute autre force, comme la résistance de l’air, est négligée.'],
            ['Dans un tube où l’on a fait le vide, une plume et une bille tombent-elles ensemble ?', ['Oui, la masse n’intervient pas dans la chute libre', 'Non, la bille tombe plus vite', 'Non, la plume tombe plus vite', 'Cela dépend de la hauteur'], 0, 'Dans l’air, c’est la résistance de l’air qui les sépare.'],
            ['Le référentiel terrestre est une bonne approximation d’un référentiel galiléen pour une expérience courte.', ['Vrai', 'Faux'], 0, 'C’est ce qui permet d’appliquer le principe en classe.'],
            ['Quel savant a le premier formulé l’idée d’inertie ?', ['Galilée', 'Aristote', 'Kepler', 'Archimède'], 0, 'Newton en fera ensuite sa première loi.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : ondes et signaux
        // ===================================================================
        {
          titre: 'Émission et propagation d’un signal sonore',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'Ce qui vibre, ce qui transporte, ce qui reçoit',
            cours: `Un **son** naît d’un objet qui **vibre**, se propage dans un **milieu matériel**, et est reçu par un détecteur — l’oreille ou un microphone.

## L’émission
La source sonore vibre : corde, membrane, colonne d’air, cordes vocales. Cette vibration met en mouvement les molécules du milieu voisin.

## La propagation
Le son est une **onde mécanique** : il se propage de proche en proche par compressions et dilatations successives du milieu, SANS transport de matière. Chaque molécule oscille autour de sa position d’équilibre et transmet la perturbation à sa voisine.

> Le son ne se propage PAS dans le vide : sans matière, aucune vibration à transmettre. C’est ce qui rend les explosions bruyantes des films de l’espace physiquement impossibles.

## La célérité
La vitesse de propagation, ou **célérité**, dépend du milieu : environ **340 m·s⁻¹** dans l’air à 20 °C, **1 500 m·s⁻¹** dans l’eau, plus de **5 000 m·s⁻¹** dans l’acier. Elle est d’autant plus grande que le milieu est dense et rigide. On la calcule par v = d / Δt.

## Mesurer une distance avec un son
La méthode de l’**écho** : on mesure la durée aller-retour d’un signal et l’on divise par deux — d = v × Δt / 2. C’est le principe du **sonar** et de l’**échographie**, qui utilise des **ultrasons**.

## Le retard
Deux détecteurs placés à des distances différentes reçoivent le même signal avec un **retard** : Δt = (d₂ − d₁) / v. C’est ainsi qu’on localise une source sonore, et que l’on estime la distance d’un orage en comptant les secondes entre l’éclair et le tonnerre — la lumière, elle, arrive presque instantanément.`,
          },
          questions: [
            ['Qu’est-ce qui produit un son ?', ['Un objet qui vibre', 'Un objet chaud', 'Un objet chargé électriquement', 'Un objet en chute libre'], 0, 'La vibration met en mouvement les molécules voisines.'],
            ['Le son se propage-t-il dans le vide ?', ['Non, il lui faut un milieu matériel', 'Oui, comme la lumière', 'Oui, mais plus lentement', 'Seulement les ultrasons'], 0, 'Sans matière, aucune vibration à transmettre.'],
            ['Le son transporte-t-il de la matière ?', ['Non, seulement de l’énergie de proche en proche', 'Oui, l’air se déplace avec lui', 'Oui, dans les solides seulement', 'Oui, à faible distance'], 0, 'Chaque molécule oscille autour de sa position d’équilibre.'],
            ['Quelle est la célérité du son dans l’air à 20 °C ?', ['Environ 340 m·s⁻¹', 'Environ 1 500 m·s⁻¹', 'Environ 3,0 × 10⁸ m·s⁻¹', 'Environ 34 m·s⁻¹'], 0, 'Elle vaut environ 1 500 m·s⁻¹ dans l’eau.'],
            ['Dans quel milieu le son se propage-t-il le plus vite ?', ['Dans l’acier', 'Dans l’air', 'Dans l’eau', 'Dans le vide'], 0, 'La célérité augmente avec la densité et la rigidité du milieu.'],
            ['Comment calcule-t-on une distance par la méthode de l’écho ?', ['d = v × Δt / 2', 'd = v × Δt', 'd = 2 × v × Δt', 'd = Δt / v'], 0, 'La durée mesurée correspond à un aller-retour.'],
            ['Quelle technique médicale utilise les ultrasons ?', ['L’échographie', 'La radiographie', 'L’IRM', 'La scintigraphie'], 0, 'Elle repose sur le même principe que le sonar.'],
            ['Pourquoi voit-on l’éclair avant d’entendre le tonnerre ?', ['Parce que la lumière se propage beaucoup plus vite que le son', 'Parce que l’éclair se produit avant', 'Parce que le son part plus tard', 'Parce que l’oreille est plus lente que l’œil'], 0, 'On estime la distance de l’orage en comptant les secondes.'],
          ],
        },
        {
          titre: 'Les sons : fréquence, intensité et perception',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'De la grandeur physique à la sensation',
            cours: `Un son se décrit par des grandeurs **physiques** mesurables, auxquelles correspondent des sensations **perçues** par l’oreille.

## Période et fréquence
Un son **périodique** se répète identique à lui-même au bout d’une durée T, la **période**, en secondes. La **fréquence** f est le nombre de périodes par seconde : f = 1 / T, en **hertz** (Hz). Un signal de période 2,0 ms a une fréquence de 500 Hz.

## Hauteur
La **hauteur** est la sensation liée à la **fréquence** : plus la fréquence est grande, plus le son est perçu comme **aigu**. L’oreille humaine perçoit environ de **20 Hz à 20 000 Hz** : en dessous, les **infrasons** ; au-dessus, les **ultrasons**, que perçoivent certains animaux.

## Timbre
Deux instruments jouant la même note à la même intensité restent reconnaissables : c’est le **timbre**, lié à la forme du signal et à la présence d’**harmoniques**, des fréquences multiples de la fréquence fondamentale.

## Intensité et niveau sonore
L’**intensité sonore** I se mesure en W·m⁻². Comme l’oreille répond sur une échelle immense, on utilise le **niveau d’intensité sonore** L, en **décibels** (dB). L’échelle est **logarithmique** : ajouter 10 dB correspond à multiplier l’intensité par 10, et le son est perçu environ deux fois plus fort.

> Deux sources identiques côte à côte n’ajoutent que 3 dB : les décibels ne s’additionnent pas comme des nombres ordinaires.

## Quelques repères
0 dB est le seuil d’audibilité, une conversation vaut environ 60 dB, une rue passante 80 dB, un concert 100 dB, et le **seuil de douleur** se situe vers 120 dB.

## Protéger son audition
L’exposition prolongée à des niveaux élevés détruit **définitivement** les cellules ciliées de l’oreille interne, qui ne se régénèrent pas. Les acouphènes et la perte d’audition sont irréversibles. D’où l’intérêt des protections auditives, des pauses et de la distance aux enceintes.`,
          },
          questions: [
            ['Quelle relation lie période et fréquence ?', ['f = 1 / T', 'f = T', 'f = T²', 'f = 2 × T'], 0, 'La fréquence s’exprime en hertz.'],
            ['Quelle fréquence correspond à une période de 2,0 ms ?', ['500 Hz', '2 000 Hz', '50 Hz', '20 Hz'], 0, 'f = 1 / (2,0 × 10⁻³) = 500 Hz.'],
            ['À quelle grandeur physique la hauteur d’un son est-elle liée ?', ['À la fréquence', 'À l’intensité', 'À la durée', 'À la célérité'], 0, 'Plus la fréquence est grande, plus le son est aigu.'],
            ['Quel est le domaine des fréquences audibles par l’humain ?', ['Environ de 20 Hz à 20 000 Hz', 'De 0 à 100 Hz', 'De 1 000 à 100 000 Hz', 'De 20 000 à 200 000 Hz'], 0, 'En dessous, les infrasons ; au-dessus, les ultrasons.'],
            ['Qu’est-ce que le timbre d’un son ?', ['Ce qui permet de distinguer deux instruments jouant la même note', 'La hauteur du son', 'Le niveau sonore', 'La durée de la note'], 0, 'Il est lié à la présence d’harmoniques.'],
            ['Dans quelle unité exprime-t-on le niveau d’intensité sonore ?', ['Le décibel', 'Le hertz', 'Le watt', 'Le newton'], 0, 'L’échelle des décibels est logarithmique.'],
            ['Que signifie une augmentation de 10 dB ?', ['L’intensité sonore est multipliée par 10', 'L’intensité est multipliée par 2', 'L’intensité augmente de 10 W·m⁻²', 'La fréquence est multipliée par 10'], 0, 'Le son est perçu environ deux fois plus fort.'],
            ['Les cellules ciliées détruites par une exposition sonore excessive se régénèrent avec le temps.', ['Vrai', 'Faux'], 1, 'La perte d’audition et les acouphènes sont irréversibles.'],
          ],
        },
        {
          titre: 'Intensité et tension dans un circuit complexe',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'Deux lois pour lire n’importe quel circuit',
            cours: `Dans un circuit électrique, deux grandeurs se mesurent : l’**intensité** du courant et la **tension** aux bornes des dipôles.

## Les deux grandeurs
L’**intensité** I traduit le débit de charges électriques ; elle se mesure en **ampères** (A) avec un **ampèremètre**, branché en **série**, car il faut que le courant le traverse. La **tension** U traduit la différence d’état électrique entre deux points ; elle se mesure en **volts** (V) avec un **voltmètre**, branché en **dérivation** aux bornes du dipôle.

> Se tromper de branchement n’est pas une erreur de forme : un ampèremètre monté en dérivation court-circuite le dipôle et peut être détruit.

## Les deux montages
En **série**, les dipôles sont montés les uns à la suite des autres sur une seule boucle. En **dérivation**, le circuit comporte plusieurs branches partant de deux **nœuds** communs.

## La loi des nœuds
La somme des intensités des courants qui **arrivent** à un nœud est égale à la somme de celles qui en **repartent**. Elle traduit la conservation de la charge électrique : rien ne s’accumule au nœud. Dans un circuit série, l’intensité est donc la **même** partout.

## La loi des mailles
Dans une **maille** — une boucle fermée du circuit —, la somme algébrique des tensions est nulle. En pratique, dans un circuit série, la tension du générateur est la somme des tensions aux bornes des récepteurs ; en dérivation, les branches placées entre les deux mêmes nœuds ont la **même** tension.

## Un exemple
Deux lampes en dérivation sous 6,0 V : chacune reçoit 6,0 V. Si la première est traversée par 0,20 A et la seconde par 0,30 A, le générateur débite 0,50 A. Retirer une lampe ne modifie pas la tension de l’autre — c’est pourquoi l’éclairage domestique est câblé en dérivation.`,
          },
          questions: [
            ['Comment branche-t-on un ampèremètre ?', ['En série, pour être traversé par le courant', 'En dérivation aux bornes du dipôle', 'À la place du générateur', 'Entre deux nœuds'], 0, 'Le voltmètre, lui, se branche en dérivation.'],
            ['Dans quelle unité se mesure une tension ?', ['Le volt', 'L’ampère', 'L’ohm', 'Le watt'], 0, 'L’intensité se mesure en ampères.'],
            ['Que dit la loi des nœuds ?', ['La somme des intensités entrantes égale la somme des intensités sortantes', 'La somme des tensions d’une maille est nulle', 'L’intensité est proportionnelle à la tension', 'La tension est la même dans tout le circuit'], 0, 'Elle traduit la conservation de la charge.'],
            ['Dans un circuit série, comment varie l’intensité ?', ['Elle est la même partout', 'Elle diminue à chaque dipôle', 'Elle se partage entre les dipôles', 'Elle augmente vers le générateur'], 0, 'Conséquence directe de la loi des nœuds.'],
            ['Que dit la loi des mailles ?', ['La somme algébrique des tensions le long d’une maille est nulle', 'Les intensités s’additionnent dans une maille', 'La tension augmente à chaque nœud', 'Les tensions se multiplient'], 0, 'Dans un circuit série, la tension du générateur est la somme de celles des récepteurs.'],
            ['Deux lampes en dérivation sous 6,0 V : quelle tension reçoit chacune ?', ['6,0 V', '3,0 V', '12 V', 'Cela dépend de leur résistance'], 0, 'Les branches entre deux mêmes nœuds ont la même tension.'],
            ['Deux branches en dérivation traversées par 0,20 A et 0,30 A : que débite le générateur ?', ['0,50 A', '0,10 A', '0,25 A', '0,06 A'], 0, 'Par application de la loi des nœuds.'],
            ['L’éclairage domestique est câblé en série.', ['Vrai', 'Faux'], 1, 'Il est câblé en dérivation, pour que chaque lampe reçoive la même tension.'],
          ],
        },
        {
          titre: 'La loi d’Ohm et la résistance au courant électrique',
          axe: 'Ondes et signaux',
          lecon: {
            titre: 'Une droite, une pente, une résistance',
            cours: `Un **conducteur ohmique** — ou résistor — est un dipôle qui s’oppose au passage du courant de façon régulière.

## L’énoncé
La **loi d’Ohm** relie la tension à ses bornes et l’intensité qui le traverse : U = R × I, avec U en volts, I en ampères et R en **ohms** (Ω). La tension et l’intensité sont **proportionnelles**.

## La caractéristique
Si l’on trace U en fonction de I pour un conducteur ohmique, on obtient une **droite passant par l’origine**, dont le **coefficient directeur** est la résistance R. Une lampe, elle, ne donne pas une droite : sa résistance augmente avec la température, elle n’est pas ohmique.

> Deux vérifications d’un coup : la droite dit que le dipôle est ohmique, sa pente donne la valeur de la résistance.

## Ce dont dépend la résistance
De la nature du matériau, de la longueur du fil (elle augmente avec elle) et de sa section (elle diminue quand la section augmente). Un **code de couleurs** à quatre anneaux donne la valeur d’un résistor et sa tolérance ; un **ohmmètre** la mesure directement, hors circuit.

## L’effet Joule
Un conducteur parcouru par un courant s’**échauffe** : c’est l’**effet Joule**. Il est recherché dans un radiateur, un grille-pain ou une bouilloire, et subi ailleurs — c’est lui qui limite la puissance des composants électroniques et impose leur refroidissement.

## Puissance et énergie
La **puissance** électrique vaut P = U × I, en **watts**. Pour un conducteur ohmique, elle s’écrit aussi P = R × I². L’**énergie** consommée vaut E = P × Δt, en joules si Δt est en secondes — ou en kilowattheures pour la facturation, avec 1 kWh = 3,6 × 10⁶ J.

## La sécurité
La loi d’Ohm explique le danger électrique : à tension donnée, l’intensité qui traverse le corps dépend de sa résistance, elle-même très diminuée par l’humidité. D’où l’interdiction absolue de manipuler un appareil électrique les mains mouillées.`,
          },
          questions: [
            ['Quelle est l’expression de la loi d’Ohm ?', ['U = R × I', 'U = I / R', 'R = U × I', 'I = U × R'], 0, 'Avec U en volts, I en ampères, R en ohms.'],
            ['Quelle est l’unité de la résistance ?', ['L’ohm', 'Le volt', 'L’ampère', 'Le watt'], 0, 'Symbole Ω.'],
            ['Quelle est l’allure de la caractéristique U = f(I) d’un conducteur ohmique ?', ['Une droite passant par l’origine', 'Une parabole', 'Une courbe croissante puis décroissante', 'Une droite ne passant pas par l’origine'], 0, 'Son coefficient directeur est la résistance.'],
            ['Une lampe est-elle un conducteur ohmique ?', ['Non, sa résistance augmente avec la température', 'Oui, comme un résistor', 'Oui, si la tension est faible', 'Cela dépend de la couleur du filament'], 0, 'Sa caractéristique n’est pas une droite.'],
            ['Comment la résistance d’un fil varie-t-elle avec sa longueur ?', ['Elle augmente quand la longueur augmente', 'Elle diminue quand la longueur augmente', 'Elle ne dépend pas de la longueur', 'Elle est proportionnelle au carré de la longueur'], 0, 'Elle diminue en revanche quand la section augmente.'],
            ['Qu’est-ce que l’effet Joule ?', ['L’échauffement d’un conducteur parcouru par un courant', 'La production d’un champ magnétique', 'La chute de tension aux bornes d’un générateur', 'La perte d’électrons d’un métal'], 0, 'Recherché dans un radiateur, subi dans un processeur.'],
            ['Quelle est l’expression de la puissance électrique ?', ['P = U × I', 'P = U / I', 'P = U + I', 'P = U² × I'], 0, 'Pour un conducteur ohmique, on a aussi P = R × I².'],
            ['Pourquoi le danger électrique augmente-t-il avec les mains mouillées ?', ['Parce que la résistance du corps diminue, donc l’intensité augmente', 'Parce que la tension augmente', 'Parce que l’eau produit du courant', 'Parce que la puissance diminue'], 0, 'C’est une application directe de la loi d’Ohm.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 : vision et image
        // ===================================================================
        {
          titre: 'Propagation et décomposition de la lumière',
          axe: 'Vision et image',
          lecon: {
            titre: 'Des rayons droits, et un blanc qui n’est pas une couleur',
            cours: `La lumière se propage en **ligne droite** dans un milieu **transparent et homogène** : c’est le principe de propagation rectiligne, que l’on modélise par des **rayons lumineux**.

## Ce que la propagation rectiligne explique
Les **ombres** nettes derrière un objet opaque éclairé par une source ponctuelle, la formation des images dans une chambre noire, les **éclipses** de Soleil et de Lune, et le fonctionnement d’un viseur.

## La vitesse de la lumière
Dans le vide, elle vaut c = **3,00 × 10⁸ m·s⁻¹** — près d’un milliard de kilomètres par heure. Elle est plus faible dans un milieu matériel. Sur les distances astronomiques, on compte en **années-lumière** : une année-lumière est la distance parcourue par la lumière en un an, environ 9,5 × 10¹⁵ m.

> Voir loin, c’est voir tôt : le Soleil que nous observons est celui d’il y a huit minutes, et une étoile à mille années-lumière nous montre son passé.

## Sources primaires et objets diffusants
Une **source primaire** produit sa propre lumière (Soleil, lampe, écran, flamme). Un **objet diffusant** renvoie dans toutes les directions la lumière qu’il reçoit (la Lune, une page, un mur) : sans éclairage, il est invisible.

## La lumière blanche est composite
Un **prisme** — ou un réseau — **disperse** la lumière blanche et fait apparaître un **spectre continu**, du rouge au violet. Newton l’a montré en recombinant ce spectre pour retrouver du blanc : le blanc n’est pas une couleur simple, c’est une **superposition**.

## Longueur d’onde et couleur
À chaque **radiation** correspond une **longueur d’onde** λ, en nanomètres. Le domaine visible s’étend d’environ **400 nm** (violet) à **800 nm** (rouge). En dessous, les **ultraviolets** ; au-dessus, les **infrarouges**, invisibles pour l’œil. Une lumière **monochromatique** ne contient qu’une seule radiation, un laser par exemple ; une lumière **polychromatique** en contient plusieurs.

## Les spectres
Un solide chaud donne un **spectre continu** dont l’aspect dépend de la température ; un gaz chaud à basse pression donne un **spectre de raies d’émission**, propre à chaque élément. C’est ainsi qu’on identifie la composition d’une étoile sans y aller.`,
          },
          questions: [
            ['Dans quel type de milieu la lumière se propage-t-elle en ligne droite ?', ['Un milieu transparent et homogène', 'Un milieu opaque', 'Un milieu quelconque', 'Uniquement dans le vide'], 0, 'C’est le principe de propagation rectiligne.'],
            ['Quelle est la vitesse de la lumière dans le vide ?', ['3,00 × 10⁸ m·s⁻¹', '3,00 × 10⁵ m·s⁻¹', '340 m·s⁻¹', '1,5 × 10³ m·s⁻¹'], 0, 'Elle est plus faible dans un milieu matériel.'],
            ['Qu’est-ce qu’une année-lumière ?', ['La distance parcourue par la lumière en un an', 'La durée d’un trajet lumineux', 'Une unité de temps astronomique', 'La distance Terre-Soleil'], 0, 'Environ 9,5 × 10¹⁵ mètres.'],
            ['Quelle différence entre une source primaire et un objet diffusant ?', ['La source primaire produit sa lumière, l’objet diffusant la renvoie', 'L’objet diffusant est toujours plus lumineux', 'La source primaire est toujours chaude', 'Il n’y a pas de différence'], 0, 'La Lune est un objet diffusant, le Soleil une source primaire.'],
            ['Que produit un prisme éclairé par de la lumière blanche ?', ['Un spectre continu du rouge au violet', 'Une seule radiation', 'Une ombre nette', 'Un rayonnement infrarouge'], 0, 'La lumière blanche est une superposition de radiations.'],
            ['Quel est approximativement le domaine des longueurs d’onde visibles ?', ['De 400 nm à 800 nm', 'De 100 nm à 200 nm', 'De 1 mm à 1 cm', 'De 800 nm à 1 600 nm'], 0, 'En dessous les UV, au-dessus les infrarouges.'],
            ['Qu’est-ce qu’une lumière monochromatique ?', ['Une lumière constituée d’une seule radiation', 'Une lumière blanche', 'Une lumière de faible intensité', 'Une lumière invisible'], 0, 'Un laser en est le meilleur exemple.'],
            ['Un gaz chaud à basse pression donne un spectre continu.', ['Vrai', 'Faux'], 1, 'Il donne un spectre de raies d’émission, caractéristique de l’élément.'],
          ],
        },
        {
          titre: 'Réflexion et réfraction de la lumière, le prisme',
          axe: 'Vision et image',
          lecon: {
            titre: 'Ce qui arrive à un rayon qui change de milieu',
            cours: `Quand un rayon lumineux rencontre la surface séparant deux milieux transparents, une partie **rebondit** et une partie **traverse** en changeant de direction.

## Le vocabulaire
Le rayon **incident** arrive sur la surface au **point d’incidence** ; la **normale** est la droite perpendiculaire à la surface en ce point. Tous les angles se mesurent **par rapport à la normale**, jamais par rapport à la surface — c’est l’erreur la plus fréquente.

## La réflexion
Le rayon **réfléchi** repart dans le même milieu. Loi : l’angle de réflexion est **égal** à l’angle d’incidence, et le rayon réfléchi appartient au plan d’incidence. Sur une surface polie, la réflexion est **spéculaire** (miroir) ; sur une surface rugueuse, elle est **diffuse** — c’est elle qui rend les objets visibles de partout.

## La réfraction
Le rayon **réfracté** passe dans le second milieu en changeant de direction. La **loi de Snell-Descartes** s’écrit : n₁ × sin i₁ = n₂ × sin i₂, où n est l’**indice de réfraction** du milieu, un nombre sans unité supérieur ou égal à 1 (1,00 pour l’air, 1,33 pour l’eau, environ 1,5 pour le verre).

> En passant dans un milieu plus réfringent, le rayon se rapproche de la normale ; en en sortant, il s’en écarte.

## Ce que la réfraction explique
Le bâton qui semble brisé à la surface de l’eau, la profondeur d’une piscine qui paraît plus faible qu’elle n’est, les mirages, et le fonctionnement des lentilles et des fibres optiques.

## La réflexion totale
En passant d’un milieu plus réfringent à un milieu moins réfringent, au-delà d’un **angle limite** il n’y a plus de rayon réfracté : toute la lumière est réfléchie. C’est le principe de la **fibre optique**, qui guide la lumière sur des kilomètres.

## Le prisme
L’indice de réfraction **dépend de la longueur d’onde** : le violet est plus dévié que le rouge. Un prisme sépare donc les radiations d’une lumière blanche : c’est la **dispersion**. Le même phénomène, dans des gouttes d’eau, produit l’**arc-en-ciel**.`,
          },
          questions: [
            ['Par rapport à quoi mesure-t-on les angles en optique ?', ['Par rapport à la normale à la surface', 'Par rapport à la surface elle-même', 'Par rapport au rayon réfléchi', 'Par rapport à l’horizontale'], 0, 'C’est l’erreur la plus fréquente en exercice.'],
            ['Que dit la loi de la réflexion ?', ['L’angle de réflexion est égal à l’angle d’incidence', 'L’angle de réflexion est le double de l’angle d’incidence', 'Le rayon réfléchi est perpendiculaire au rayon incident', 'Le rayon réfléchi suit la normale'], 0, 'Les deux rayons sont dans le plan d’incidence.'],
            ['Quelle est l’expression de la loi de Snell-Descartes pour la réfraction ?', ['n₁ × sin i₁ = n₂ × sin i₂', 'n₁ × i₁ = n₂ × i₂', 'sin i₁ / sin i₂ = n₁ × n₂', 'n₁ / sin i₁ = n₂ / sin i₂'], 0, 'n est l’indice de réfraction du milieu.'],
            ['Que vaut approximativement l’indice de réfraction de l’eau ?', ['1,33', '1,00', '0,75', '2,42'], 0, 'Celui de l’air vaut 1,00, celui du verre environ 1,5.'],
            ['Que se passe-t-il quand un rayon entre dans un milieu plus réfringent ?', ['Il se rapproche de la normale', 'Il s’écarte de la normale', 'Il n’est pas dévié', 'Il est totalement réfléchi'], 0, 'Il s’en écarte en sortant du milieu plus réfringent.'],
            ['Sur quel phénomène repose la fibre optique ?', ['La réflexion totale', 'La dispersion', 'La diffraction', 'L’absorption'], 0, 'Au-delà de l’angle limite, toute la lumière est réfléchie.'],
            ['Pourquoi un prisme disperse-t-il la lumière blanche ?', ['Parce que l’indice de réfraction dépend de la longueur d’onde', 'Parce que le verre est coloré', 'Parce que la lumière ralentit', 'Parce que le prisme est triangulaire'], 0, 'Le violet est plus dévié que le rouge.'],
            ['Une réflexion diffuse se produit sur une surface parfaitement polie.', ['Vrai', 'Faux'], 1, 'Elle se produit sur une surface rugueuse ; le miroir donne une réflexion spéculaire.'],
          ],
        },
        {
          titre: 'Les lentilles convergentes',
          axe: 'Vision et image',
          lecon: {
            titre: 'Un morceau de verre qui rassemble la lumière',
            cours: `Une **lentille convergente** est plus épaisse au centre qu’aux bords. Elle fait converger un faisceau de lumière parallèle.

## Le vocabulaire
Le **centre optique** O est le point de la lentille par lequel un rayon passe sans être dévié. L’**axe optique** est la droite passant par O et perpendiculaire à la lentille. Le **foyer image** F′ est le point où convergent les rayons arrivant parallèlement à l’axe. Le **foyer objet** F est symétrique de F′ par rapport à O. La **distance focale** f′ = OF′ se mesure en mètres.

## La vergence
La **vergence** C est l’inverse de la distance focale : C = 1 / f′, en **dioptries** (δ), avec f′ en mètres. Une lentille de 5 δ a une distance focale de 0,20 m. Plus la vergence est grande, plus la lentille est **convergente**, donc bombée. La vergence d’une lentille divergente est négative.

> Les corrections optiques sont exprimées en dioptries : le « +2 » d’une paire de lunettes de lecture est une vergence.

## Les trois rayons particuliers
Un rayon passant par le **centre optique** n’est pas dévié. Un rayon **parallèle à l’axe** repart en passant par F′. Un rayon passant par **F** repart parallèle à l’axe. Deux d’entre eux suffisent à construire une image.

## L’œil et son modèle
On modélise l’œil par une lentille convergente (le **cristallin**), un diaphragme (l’**iris** et sa **pupille**) et un écran (la **rétine**). L’**accommodation** est la déformation du cristallin qui permet de garder une image nette sur la rétine quand l’objet se rapproche.

## Les défauts courants
La **myopie** : l’image se forme en avant de la rétine, on corrige par une lentille **divergente**. L’**hypermétropie** : l’image se formerait en arrière, on corrige par une lentille **convergente**. La **presbytie** : le cristallin perd en souplesse avec l’âge, l’accommodation de près devient difficile.`,
          },
          questions: [
            ['Comment reconnaît-on une lentille convergente ?', ['Elle est plus épaisse au centre qu’aux bords', 'Elle est plus fine au centre', 'Elle est plane', 'Elle est teintée'], 0, 'Elle fait converger un faisceau parallèle.'],
            ['Qu’est-ce que le foyer image F′ ?', ['Le point où convergent les rayons arrivant parallèlement à l’axe optique', 'Le centre de la lentille', 'Le point où se trouve l’objet', 'Le point de l’écran'], 0, 'La distance OF′ est la distance focale.'],
            ['Quelle est l’expression de la vergence ?', ['C = 1 / f′', 'C = f′', 'C = f′²', 'C = 2 × f′'], 0, 'Elle s’exprime en dioptries, avec f′ en mètres.'],
            ['Quelle est la distance focale d’une lentille de vergence 5 δ ?', ['0,20 m', '5 m', '0,05 m', '2,0 m'], 0, 'f′ = 1 / 5 = 0,20 m.'],
            ['Que devient un rayon passant par le centre optique ?', ['Il n’est pas dévié', 'Il repart parallèle à l’axe', 'Il passe par F′', 'Il est réfléchi'], 0, 'C’est l’un des trois rayons particuliers.'],
            ['Que devient un rayon arrivant parallèlement à l’axe optique ?', ['Il repart en passant par le foyer image F′', 'Il n’est pas dévié', 'Il repart par le foyer objet F', 'Il est absorbé'], 0, 'C’est la définition même du foyer image.'],
            ['Quel élément de l’œil joue le rôle de lentille convergente ?', ['Le cristallin', 'La rétine', 'L’iris', 'La cornée uniquement'], 0, 'La rétine joue le rôle de l’écran.'],
            ['Par quel type de lentille corrige-t-on la myopie ?', ['Une lentille divergente', 'Une lentille convergente', 'Un prisme', 'Un miroir'], 0, 'Chez le myope, l’image se forme en avant de la rétine.'],
          ],
        },
        {
          titre: 'Construction de l’image d’un objet',
          axe: 'Vision et image',
          lecon: {
            titre: 'Tracer, mesurer, vérifier par le calcul',
            cours: `Construire l’image d’un objet à travers une lentille convergente, c’est suivre deux rayons particuliers et repérer leur point de rencontre.

## La méthode
On place l’objet AB perpendiculairement à l’axe optique, A sur l’axe. Depuis B, on trace deux des trois rayons particuliers : le rayon passant par O, non dévié ; le rayon parallèle à l’axe, qui repart par F′ ; le rayon passant par F, qui repart parallèle à l’axe. Leur intersection donne B′, image de B. A′ se trouve sur l’axe, à la verticale de B′.

## Image réelle, image virtuelle
Si l’objet est **au-delà** du foyer objet F, l’image est **réelle** (on peut la recueillir sur un écran) et **renversée**. Si l’objet est **entre F et la lentille**, les rayons émergents divergent : l’image est **virtuelle**, droite et agrandie — c’est le fonctionnement de la **loupe**.

> Une image réelle se projette, une image virtuelle se regarde : la première existe sur un écran, la seconde seulement pour l’œil placé derrière la lentille.

## Les relations de conjugaison
Avec les mesures algébriques comptées depuis O sur l’axe orienté : 1/OA′ − 1/OA = 1/OF′. Le **grandissement** vaut γ = A′B′/AB = OA′/OA. Un grandissement négatif signale une image renversée ; sa valeur absolue supérieure à 1 signale une image agrandie.

## Un exemple
Objet à 30 cm d’une lentille de distance focale 10 cm : l’image se forme à 15 cm de l’autre côté, avec un grandissement de −0,5. Elle est donc réelle, renversée et deux fois plus petite.

## Les applications
L’**appareil photo** et l’**œil** forment une image réelle renversée sur un capteur ou sur la rétine — le cerveau la redresse. Le **vidéoprojecteur** forme une image réelle agrandie. La **loupe** et l’**oculaire** d’un microscope donnent une image virtuelle agrandie.`,
          },
          questions: [
            ['Combien de rayons particuliers suffisent à construire une image ?', ['Deux', 'Un seul', 'Trois obligatoirement', 'Quatre'], 0, 'Le troisième sert de vérification.'],
            ['Où se forme l’image si l’objet est au-delà du foyer objet F ?', ['De l’autre côté de la lentille, réelle et renversée', 'Du même côté, virtuelle et droite', 'Au foyer image exactement', 'À l’infini'], 0, 'On peut la recueillir sur un écran.'],
            ['Quelle image obtient-on avec une loupe ?', ['Une image virtuelle, droite et agrandie', 'Une image réelle renversée', 'Une image réelle réduite', 'Aucune image'], 0, 'L’objet est placé entre le foyer objet et la lentille.'],
            ['Quelle est la relation de conjugaison ?', ['1/OA′ − 1/OA = 1/OF′', '1/OA′ + 1/OA = 1/OF′', 'OA′ − OA = OF′', 'OA′ × OA = OF′'], 0, 'Avec des mesures algébriques sur l’axe orienté.'],
            ['Comment calcule-t-on le grandissement ?', ['γ = A′B′/AB = OA′/OA', 'γ = AB/A′B′', 'γ = OA/OF′', 'γ = OA × OA′'], 0, 'Un grandissement négatif signale une image renversée.'],
            ['Que signifie un grandissement de −0,5 ?', ['L’image est renversée et deux fois plus petite', 'L’image est droite et deux fois plus grande', 'L’image est virtuelle', 'L’image est à l’infini'], 0, 'Le signe donne le sens, la valeur absolue la taille.'],
            ['L’image formée sur la rétine par l’œil est droite.', ['Vrai', 'Faux'], 1, 'Elle est réelle et renversée ; c’est le cerveau qui la redresse.'],
            ['Quel dispositif forme une image réelle agrandie ?', ['Le vidéoprojecteur', 'La loupe', 'L’appareil photo', 'Le télescope à l’oculaire'], 0, 'L’objet y est placé juste au-delà du foyer objet.'],
          ],
        },
      ],
    },
  ],
}
