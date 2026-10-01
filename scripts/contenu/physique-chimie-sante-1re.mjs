// PHYSIQUE-CHIMIE POUR LA SANTÉ — PREMIÈRE ST2S (voie technologique).
//
// Programme officiel : annexe 2 de l'arrêté du 17/01/2019, BO spécial n° 1 du
// 22 janvier 2019 (« Programme de physique-chimie pour la santé de première
// ST2S »). Trois thèmes : Prévenir et sécuriser · Analyser et diagnostiquer ·
// Faire des choix autonomes et responsables. Chaque fiche porte en `axe` le
// thème du programme qui la coiffe.
//
// Matière NEUVE (slug `physique-chimie-sante`), déclarée pour la seule classe
// « 1re techno » : le contenu est rangé au niveau '1re' (alias contentLevelFor).
// Spécialité suivie en première seulement : évaluée en contrôle continu.

export default {
  slug: 'physique-chimie-sante',
  nom: 'Physique-chimie pour la santé',

  titreMigration: 'PHYSIQUE-CHIMIE POUR LA SANTÉ 1re ST2S — le programme officiel (16 fiches)',

  motif: `La série ST2S n'avait aucun contenu de physique-chimie pour la santé. Cette
migration installe 15 fiches qui suivent les trois thèmes du programme officiel
(BO spécial n° 1 du 22 janvier 2019) — Prévenir et sécuriser, Analyser et
diagnostiquer, Faire des choix autonomes et responsables — et une fiche méthode
de l'évaluation, 12 questions chacune.`,

  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 1,
      chapitres: [
        // ─────────────────────────── THÈME 1 ───────────────────────────
        {
          titre: 'Quantité de matière et concentrations',
          axe: 'Prévenir et sécuriser',
          lecon: {
            titre: 'Préparer une solution à la bonne concentration',
            cours: `Un sérum physiologique, une solution de Javel diluée, un collyre : en santé, la même substance peut soigner ou blesser selon sa concentration. Savoir la calculer, c'est la première règle de sécurité.

## Solution, soluté, solvant
| Le mot | Ce qu'il désigne | Exemple : le sérum physiologique |
| **Soluté** | L'espèce dissoute | Le chlorure de sodium NaCl |
| **Solvant** | Le liquide qui dissout, en grande quantité | L'eau |
| **Solution** | Le mélange homogène obtenu | Le sérum lui-même |

Quand le solvant est l'eau, on parle de **solution aqueuse**.

## La quantité de matière
On compte les entités chimiques en **moles** (symbole mol). La **masse molaire** M (en g/mol) est la masse d'une mole ; elle s'obtient en additionnant les masses molaires atomiques.

> n = m / M, avec n en mol, m en g et M en g/mol.

Exemple : M(NaCl) = 23,0 + 35,5 = 58,5 g/mol. Dans 9,0 g de NaCl, n = 9,0 / 58,5 ≈ 0,15 mol.

## Deux concentrations à ne pas confondre
| La grandeur | Sa définition | Son unité |
| **Concentration molaire** C | C = n / V | mol/L |
| **Concentration massique** Cm | Cm = m / V | g/L |

On passe de l'une à l'autre par la masse molaire : Cm = C × M.

Le sérum physiologique est à 9 g/L de NaCl, soit C = 9 / 58,5 ≈ 0,15 mol/L.

## Préparer une solution par dissolution
1. Calculer la masse à peser : m = Cm × V.
2. Peser le solide dans une coupelle, puis l'introduire dans une **fiole jaugée** avec un entonnoir.
3. Rincer la coupelle et l'entonnoir avec de l'eau distillée, remplir aux trois quarts, agiter pour dissoudre.
4. Compléter jusqu'au **trait de jauge**, boucher, homogénéiser.

## Préparer une solution par dilution
Lors d'une dilution, on ajoute du solvant : la quantité de soluté **ne change pas**.

> C mère × V prélevé = C fille × V fille. Le facteur de dilution est F = C mère / C fille = V fille / V prélevé.

1. Prélever le volume de solution mère avec une **pipette jaugée**.
2. Le verser dans une fiole jaugée de volume V fille.
3. Compléter à l'eau distillée jusqu'au trait de jauge et homogénéiser.

Exemple : pour diluer 10 fois et obtenir 100,0 mL, on prélève 10,0 mL de solution mère.`,
          },
          questions: [
            ['Quelle relation lie la quantité de matière n, la masse m et la masse molaire M ?', ['n = m × M', 'n = m / M', 'n = M / m', 'n = m − M'], 1, 'La quantité de matière se calcule en divisant la masse (g) par la masse molaire (g/mol).'],
            ['Dans une solution aqueuse de glucose, qu’est-ce que le glucose ?', ['Le solvant', 'La solution', 'Le soluté', 'Le précipité'], 2, 'Le glucose est l’espèce dissoute ; l’eau est le solvant.'],
            ['Quelle est l’unité de la concentration massique ?', ['mol/L', 'g/mol', 'g/L', 'mol/g'], 2, 'Cm = m / V : une masse divisée par un volume, en g/L.'],
            ['On dissout 0,20 mol de soluté dans 0,50 L de solution. Quelle est la concentration molaire ?', ['0,10 mol/L', '0,40 mol/L', '2,5 mol/L', '0,70 mol/L'], 1, 'C = n / V = 0,20 / 0,50 = 0,40 mol/L.'],
            ['Quelle masse de NaCl faut-il peser pour préparer 500 mL de sérum physiologique à 9,0 g/L ?', ['4,5 g', '9,0 g', '18 g', '0,45 g'], 0, 'm = Cm × V = 9,0 × 0,500 = 4,5 g.'],
            ['Lors d’une dilution, la quantité de matière de soluté reste la même.', ['Vrai', 'Faux'], 0, 'On ajoute seulement du solvant : c’est pourquoi C mère × V prélevé = C fille × V fille.'],
            ['Pour diluer 20 fois une solution et obtenir 100,0 mL, quel volume de solution mère prélève-t-on ?', ['20,0 mL', '2,0 mL', '5,0 mL', '10,0 mL'], 2, 'V prélevé = V fille / F = 100,0 / 20 = 5,0 mL.'],
            ['Quelle verrerie permet de prélever un volume précis de solution mère ?', ['Un bécher', 'Une éprouvette graduée', 'Un erlenmeyer', 'Une pipette jaugée'], 3, 'La pipette jaugée est la verrerie de précision pour un prélèvement ; le bécher ne mesure rien avec précision.'],
            ['Quelle relation relie la concentration massique Cm et la concentration molaire C ?', ['Cm = C × M', 'Cm = C / M', 'Cm = M / C', 'Cm = C + M'], 0, 'Une mole pèse M grammes : C mol/L correspondent à C × M g/L.'],
            ['Quelle est la masse molaire du glucose C₆H₁₂O₆ ? (C = 12, H = 1, O = 16 g/mol)', ['96 g/mol', '180 g/mol', '168 g/mol', '342 g/mol'], 1, '6 × 12 + 12 × 1 + 6 × 16 = 72 + 12 + 96 = 180 g/mol.'],
            ['Dans quelle verrerie prépare-t-on une solution de volume précis ?', ['Une fiole jaugée', 'Un tube à essai', 'Un bécher', 'Une burette'], 0, 'La fiole jaugée, remplie jusqu’au trait de jauge, garantit le volume de la solution.'],
            ['Le facteur de dilution F est égal au rapport C fille / C mère.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : F = C mère / C fille, toujours supérieur à 1.'],
          ],
        },
        {
          titre: 'Le pH, les acides et les bases',
          axe: 'Prévenir et sécuriser',
          lecon: {
            titre: 'Utiliser les produits acides et basiques en sécurité',
            cours: `Détartrant, déboucheur de canalisations, vinaigre, ammoniaque : la maison est pleine d'acides et de bases. Leur pH dit leur force apparente, leurs pictogrammes disent leur danger.

## Le pH d'une solution aqueuse
Le pH mesure la concentration en ions oxonium H₃O⁺ :

> [H₃O⁺] = 10⁻ᵖᴴ, en mol/L.

| Le pH (à 25 °C) | La solution est… | Exemples |
| **pH < 7** | Acide | Vinaigre (≈ 3), suc gastrique (≈ 2) |
| **pH = 7** | Neutre | Eau pure |
| **pH > 7** | Basique | Eau de Javel, déboucheur (≈ 13) |

Plus le pH est bas, plus [H₃O⁺] est grand : un pH de 2 correspond à une concentration en H₃O⁺ **dix fois** plus grande qu'un pH de 3. On mesure le pH au **papier pH** (valeur approchée) ou au **pH-mètre** étalonné (plus précis).

## Acides et bases selon Brönsted
| Le mot | La définition |
| **Acide** | Espèce capable de **céder** un ion H⁺ |
| **Base** | Espèce capable de **capter** un ion H⁺ |
| **Couple acide/base** | Deux espèces qui se transforment l'une en l'autre par échange d'un H⁺ : AH / A⁻ |

Une réaction acido-basique échange un H⁺ entre l'acide d'un couple et la base d'un autre. Exemple : CH₃COOH + HO⁻ → CH₃COO⁻ + H₂O.

| Le nom usuel | La formule | Acide ou base |
| Acide chlorhydrique | H₃O⁺ + Cl⁻ | Acide |
| Acide éthanoïque (vinaigre) | CH₃COOH | Acide |
| Acide sulfurique | H₂SO₄ | Acide |
| Soude (hydroxyde de sodium) | Na⁺ + HO⁻ | Base |
| Ammoniac | NH₃ | Base |

## L'autoprotolyse de l'eau
L'eau est à la fois acide et base : 2 H₂O ⇌ H₃O⁺ + HO⁻. Le **produit ionique de l'eau** Ke = [H₃O⁺] × [HO⁻] vaut 10⁻¹⁴ à 25 °C : quand [H₃O⁺] augmente, [HO⁻] diminue.

## La sécurité avant tout
Les acides et bases concentrés portent le pictogramme **corrosif** (SGH05) : ils brûlent la peau et les yeux.
1. Porter **blouse, gants et lunettes**.
2. Ne **jamais** verser l'eau dans un acide concentré : c'est l'acide qu'on verse doucement dans l'eau (la dilution dégage de la chaleur et peut provoquer des projections).
3. Ne jamais mélanger deux produits ménagers.
4. En cas de projection : **rincer immédiatement et abondamment à l'eau** (au moins 15 minutes), retirer les vêtements souillés, alerter les secours.

Pour éliminer un déchet acide, on le **neutralise** d'abord par une base (ou l'inverse) jusqu'à un pH proche de 7.`,
          },
          questions: [
            ['Une solution a un pH de 11. Elle est :', ['Acide', 'Neutre', 'Basique', 'Corrosive dans tous les cas'], 2, 'À 25 °C, un pH supérieur à 7 caractérise une solution basique.'],
            ['Selon Brönsted, un acide est une espèce capable de :', ['Capter un ion H⁺', 'Céder un ion H⁺', 'Céder un électron', 'Capter un ion HO⁻'], 1, 'Céder un H⁺ fait un acide ; le capter fait une base.'],
            ['Quelle relation relie le pH et la concentration en ions oxonium ?', ['[H₃O⁺] = 10⁻ᵖᴴ', '[H₃O⁺] = 10ᵖᴴ', '[H₃O⁺] = pH / 10', '[H₃O⁺] = 14 − pH'], 0, 'Ainsi, à pH 3, [H₃O⁺] = 10⁻³ mol/L.'],
            ['Quand on passe d’un pH de 4 à un pH de 3, la concentration en H₃O⁺ est :', ['Divisée par 10', 'Multipliée par 10', 'Multipliée par 3', 'Inchangée'], 1, 'Une unité de pH en moins correspond à dix fois plus d’ions H₃O⁺.'],
            ['Quelle est la formule de l’ammoniac ?', ['NH₄⁺', 'NO₃⁻', 'NH₃', 'NaOH'], 2, 'L’ammoniac NH₃ est une base : il capte un H⁺ pour donner l’ion ammonium NH₄⁺.'],
            ['Quelle est l’équation de l’autoprotolyse de l’eau ?', ['H₂O → H₂ + O', '2 H₂O ⇌ H₃O⁺ + HO⁻', 'H₂O + H⁺ → H₃O⁺ seulement', '2 H₂O → 2 H₂ + O₂'], 1, 'L’eau joue à la fois le rôle d’acide et de base.'],
            ['Pour diluer un acide concentré, on verse l’eau dans l’acide.', ['Vrai', 'Faux'], 1, 'On verse l’acide dans l’eau, doucement : la dilution est exothermique et l’inverse provoque des projections.'],
            ['Que faire en premier après une projection de soude sur la peau ?', ['Neutraliser avec du vinaigre', 'Rincer abondamment à l’eau pendant au moins 15 minutes', 'Appliquer une crème grasse', 'Essuyer avec un chiffon sec et attendre'], 1, 'Le rinçage immédiat et prolongé dilue et élimine le produit ; neutraliser sur la peau dégage de la chaleur.'],
            ['Quel pictogramme porte une solution concentrée d’acide chlorhydrique ?', ['Flamme (inflammable)', 'Bouteille de gaz', 'Corrosion (mains et surface rongées)', 'Poisson et arbre (environnement)'], 2, 'Le pictogramme corrosif SGH05 signale les produits qui détruisent les tissus vivants.'],
            ['Dans le couple CH₃COOH / CH₃COO⁻, quelle espèce est la base ?', ['CH₃COOH', 'CH₃COO⁻', 'H₃O⁺', 'Aucune des deux'], 1, 'L’ion éthanoate est la forme qui a perdu un H⁺ : c’est la base du couple.'],
            ['Si [H₃O⁺] augmente dans une solution aqueuse à 25 °C, alors [HO⁻] :', ['Augmente aussi', 'Reste constante', 'Diminue', 'Devient nulle'], 2, 'Le produit ionique Ke = [H₃O⁺] × [HO⁻] reste constant : l’une monte, l’autre baisse.'],
            ['Pourquoi neutralise-t-on une solution acide avant de la jeter ?', ['Pour augmenter son volume', 'Pour ramener son pH près de 7 et limiter son impact sur l’environnement', 'Pour la rendre plus corrosive', 'Pour la colorer'], 1, 'Un déchet neutralisé ne dégrade plus les canalisations ni les milieux aquatiques.'],
          ],
        },
        {
          titre: 'Désinfectants et antiseptiques : l’oxydoréduction',
          axe: 'Prévenir et sécuriser',
          lecon: {
            titre: 'Des oxydants qui tuent les micro-organismes',
            cours: `Eau de Javel, eau oxygénée, teinture d'iode, alcool médical : ces produits détruisent bactéries, virus et champignons parce que ce sont, pour la plupart, des **oxydants**. Comprendre l'oxydoréduction, c'est comprendre leur efficacité et leurs dangers.

## Oxydant, réducteur, couple
| Le mot | La définition |
| **Oxydant** | Espèce capable de **capter** un ou plusieurs électrons |
| **Réducteur** | Espèce capable de **céder** un ou plusieurs électrons |
| **Couple Ox/Red** | Un oxydant et le réducteur qu'il devient en captant des électrons |

On écrit la **demi-équation** : Ox + n e⁻ = Red. Exemple : I₂ + 2 e⁻ = 2 I⁻ (couple I₂/I⁻).

> Moyen mnémotechnique : l'oxydant capte, le réducteur donne. Une oxydation est une perte d'électrons, une réduction un gain.

## Écrire une réaction d'oxydoréduction
Une réaction d'oxydoréduction est un **transfert d'électrons** entre l'oxydant d'un couple et le réducteur d'un autre.
1. Écrire les deux demi-équations dans le bon sens (l'oxydant réagissant à gauche, le réducteur réagissant à gauche).
2. Multiplier pour que le **nombre d'électrons** soit le même.
3. Additionner : les électrons disparaissent de l'équation bilan.

Exemple : le diiode oxyde les ions thiosulfate. I₂ + 2 e⁻ = 2 I⁻ et 2 S₂O₃²⁻ = S₄O₆²⁻ + 2 e⁻ donnent I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻.

## Les produits du quotidien
| Le produit | L'espèce active | Son usage |
| **Eau de Javel** | Ion hypochlorite ClO⁻ (oxydant) | Désinfectant des surfaces (sur l'inerte) |
| **Eau oxygénée** | Peroxyde d'hydrogène H₂O₂ | Antiseptique (sur le vivant, la peau) |
| **Teinture d'iode, Bétadine** | Diiode I₂ | Antiseptique cutané |
| **Alcool médical** | Éthanol à 70 % | Antiseptique (il dénature les protéines des microbes) |

> Un **désinfectant** agit sur des surfaces ou objets inertes ; un **antiseptique** s'applique sur les tissus vivants.

## Les dangers
**Javel + détartrant acide = danger.** En milieu acide, l'ion hypochlorite réagit avec les ions chlorure et libère du **dichlore**, un gaz très toxique : ClO⁻ + Cl⁻ + 2 H⁺ → Cl₂ + H₂O.

**L'eau oxygénée vieillit.** Le peroxyde d'hydrogène est à la fois oxydant et réducteur : il se décompose lentement, surtout à la lumière et à la chaleur, en eau et dioxygène (2 H₂O₂ → 2 H₂O + O₂). Un flacon ancien a perdu son efficacité : on le conserve au frais, à l'abri de la lumière.

## Diluer un désinfectant
Les produits concentrés (Javel en berlingot à 9,6 % de chlore actif) se diluent avant usage, avec la verrerie de la dilution, gants et lunettes, dans un endroit aéré. On respecte la dose indiquée : trop dilué, le produit est inefficace ; trop concentré, il est dangereux.`,
          },
          questions: [
            ['Un oxydant est une espèce capable de :', ['Céder des électrons', 'Capter des électrons', 'Céder un ion H⁺', 'Capter un ion H⁺'], 1, 'L’oxydant capte des électrons et se transforme en son réducteur conjugué.'],
            ['Dans la demi-équation I₂ + 2 e⁻ = 2 I⁻, quel est l’oxydant ?', ['I⁻', 'e⁻', 'I₂', 'Il n’y en a pas'], 2, 'Le diiode capte deux électrons : c’est l’oxydant du couple I₂/I⁻.'],
            ['Quelle est l’espèce active de l’eau de Javel ?', ['L’ion hypochlorite ClO⁻', 'L’ion chlorure Cl⁻', 'Le dichlore Cl₂', 'L’ion sodium Na⁺'], 0, 'L’ion hypochlorite est un oxydant puissant qui détruit les micro-organismes.'],
            ['Pourquoi ne faut-il jamais mélanger eau de Javel et détartrant acide ?', ['Le mélange devient inefficace mais sans danger', 'Il se forme du dichlore, un gaz toxique', 'Il se forme de l’eau oxygénée', 'Le mélange explose toujours'], 1, 'En milieu acide : ClO⁻ + Cl⁻ + 2 H⁺ → Cl₂ + H₂O. Le dichlore attaque les voies respiratoires.'],
            ['Quelle est la différence entre un antiseptique et un désinfectant ?', ['Aucune, ce sont des synonymes', 'L’antiseptique s’applique sur les tissus vivants, le désinfectant sur l’inerte', 'Le désinfectant s’applique sur la peau, l’antiseptique sur les sols', 'L’antiseptique est toujours plus concentré'], 1, 'La peau reçoit un antiseptique ; une paillasse ou un sol reçoit un désinfectant.'],
            ['Dans une réaction d’oxydoréduction, les électrons apparaissent dans l’équation bilan.', ['Vrai', 'Faux'], 1, 'On ajuste les demi-équations pour que les électrons cédés soient tous captés : ils s’éliminent.'],
            ['Pourquoi une eau oxygénée ancienne est-elle moins efficace ?', ['Elle s’est transformée en eau de Javel', 'Le peroxyde d’hydrogène s’est décomposé en eau et dioxygène', 'Elle s’est concentrée par évaporation', 'Elle a absorbé des microbes'], 1, '2 H₂O₂ → 2 H₂O + O₂ : la décomposition est accélérée par la lumière et la chaleur.'],
            ['Une réaction d’oxydoréduction est un transfert :', ['D’ions H⁺', 'D’électrons', 'De neutrons', 'De molécules d’eau'], 1, 'Les réactions acido-basiques échangent des H⁺, l’oxydoréduction échange des électrons.'],
            ['Quelle espèce active contient une teinture d’iode ?', ['L’ion iodure I⁻', 'Le diiode I₂', 'L’iode radioactif', 'L’ion hypochlorite'], 1, 'Le diiode est l’oxydant qui donne à la teinture son pouvoir antiseptique.'],
            ['Dans le couple Cl₂/Cl⁻, la demi-équation s’écrit :', ['Cl₂ = 2 Cl⁻ + 2 e⁻', 'Cl₂ + 2 e⁻ = 2 Cl⁻', 'Cl₂ + e⁻ = Cl⁻', 'Cl⁻ + 2 e⁻ = Cl₂'], 1, 'L’oxydant Cl₂ capte deux électrons pour donner deux ions chlorure.'],
            ['Comment conserver un flacon d’eau oxygénée ?', ['Au soleil pour le stériliser', 'Au frais et à l’abri de la lumière', 'Ouvert pour laisser partir le gaz', 'Mélangé à de la Javel'], 1, 'La chaleur et la lumière accélèrent la décomposition du peroxyde d’hydrogène.'],
            ['Un réducteur est une espèce qui gagne des électrons.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : le réducteur cède des électrons, l’oxydant en capte.'],
          ],
        },
        {
          titre: 'La sécurité électrique dans l’habitat',
          axe: 'Prévenir et sécuriser',
          lecon: {
            titre: 'Tension du secteur, disjoncteur et prise de terre',
            cours: `Le corps humain conduit l'électricité : un courant qui le traverse peut contracter les muscles, bloquer la respiration ou dérégler le cœur. L'installation d'une maison est conçue pour que cela n'arrive pas.

## La tension du secteur
En France, la tension délivrée par une prise est **alternative sinusoïdale** : elle change de signe régulièrement.

| La grandeur | Sa définition | Sa valeur pour le secteur |
| **Période T** | Durée d'un motif qui se répète | 20 ms |
| **Fréquence f** | Nombre de périodes par seconde, f = 1 / T | 50 Hz |
| **Tension maximale Umax** | Valeur la plus haute atteinte | ≈ 325 V |
| **Tension minimale** | Valeur la plus basse | ≈ − 325 V |
| **Tension efficace Ueff** | Valeur « équivalente » en effet thermique, Ueff = Umax / √2 | 230 V |

Sur un **oscillogramme**, on lit la période sur l'axe horizontal (nombre de divisions × sensibilité horizontale) et Umax sur l'axe vertical.

## Le courant électrique
Le **courant électrique** est un déplacement ordonné de porteurs de charge (électrons dans les métaux, ions dans les liquides et le corps). Son **intensité** I se mesure en **ampères** (A) avec un ampèremètre branché en série.

Un appareil prévu pour une certaine intensité s'échauffe et se **détériore** si on le traverse par une intensité trop grande : c'est le risque de **surintensité** (multiprise surchargée, court-circuit).

## Électrisation et électrocution
| Le mot | Le sens |
| **Électrisation** | Passage d'un courant dans le corps, avec ses effets (brûlure, contraction) |
| **Électrocution** | Électrisation qui entraîne la **mort** |

Ordres de grandeur pour un courant alternatif traversant le corps : vers 10 mA, on ne peut plus lâcher le fil ; vers 30 mA, la respiration peut se bloquer ; au-delà d'environ 75 mA, risque de **fibrillation ventriculaire**. La gravité dépend aussi de la durée, du trajet dans le corps et de l'humidité de la peau.

## Les protections
| Le dispositif | Ce qu'il fait |
| **Disjoncteur** | Coupe le circuit en cas de surintensité ou de court-circuit : il protège les **appareils et l'installation** |
| **Disjoncteur différentiel 30 mA** | Compare le courant qui part par la phase et celui qui revient par le neutre ; s'il manque 30 mA (le courant fuit, par exemple à travers une personne), il coupe : il protège les **personnes** |
| **Prise de terre** | Relie la carcasse métallique d'un appareil à la Terre : en cas de défaut, le courant de fuite part par ce fil et non par l'utilisateur |

Une prise comporte trois bornes : la **phase** (dangereuse), le **neutre** et la **terre** (fil vert et jaune).

> Règles d'or : ne jamais manipuler un appareil branché avec les mains mouillées ; couper le courant avant toute intervention ; ne pas surcharger une multiprise ; ne pas toucher une victime encore en contact avec le courant.`,
          },
          questions: [
            ['Quelle est la fréquence de la tension du secteur en France ?', ['230 Hz', '50 Hz', '60 Hz', '20 Hz'], 1, 'f = 50 Hz, soit une période de 20 ms.'],
            ['La valeur 230 V du secteur correspond à :', ['La tension maximale', 'La tension efficace', 'La tension minimale', 'La moyenne de la tension'], 1, 'La tension maximale vaut 230 × √2 ≈ 325 V.'],
            ['Une tension sinusoïdale a une période de 20 ms. Sa fréquence est :', ['20 Hz', '0,02 Hz', '50 Hz', '200 Hz'], 2, 'f = 1 / T = 1 / 0,020 s = 50 Hz.'],
            ['Quelle relation relie la tension efficace et la tension maximale d’une tension sinusoïdale ?', ['Ueff = Umax × √2', 'Ueff = Umax / √2', 'Ueff = Umax / 2', 'Ueff = 2 × Umax'], 1, 'Pour une tension sinusoïdale, la valeur efficace est la valeur maximale divisée par √2.'],
            ['Quel dispositif protège les PERSONNES contre les fuites de courant ?', ['Le fusible seul', 'Le disjoncteur différentiel 30 mA', 'L’ampèremètre', 'La multiprise'], 1, 'Il détecte une différence entre le courant de la phase et celui du neutre et coupe le circuit.'],
            ['Qu’est-ce qu’une électrocution ?', ['Toute sensation de décharge', 'Une électrisation qui entraîne la mort', 'Une brûlure superficielle', 'Un court-circuit dans un appareil'], 1, 'L’électrisation est le passage du courant dans le corps ; l’électrocution en est l’issue mortelle.'],
            ['À quoi sert le fil vert et jaune d’une prise ?', ['À amener le courant à l’appareil', 'À relier la carcasse métallique de l’appareil à la Terre', 'À mesurer la tension', 'À ramener le courant vers le compteur en fonctionnement normal'], 1, 'En cas de défaut d’isolement, le courant de fuite s’écoule vers la Terre et non à travers l’utilisateur.'],
            ['Le corps humain ne conduit pas l’électricité.', ['Vrai', 'Faux'], 1, 'Il la conduit, d’autant mieux que la peau est mouillée : c’est ce qui rend l’électrisation possible.'],
            ['Pourquoi une multiprise surchargée est-elle dangereuse ?', ['Elle baisse la fréquence du secteur', 'L’intensité totale devient trop grande et les fils s’échauffent', 'Elle supprime la prise de terre', 'Elle transforme la tension alternative en continue'], 1, 'Une surintensité échauffe les conducteurs : risque de détérioration et d’incendie.'],
            ['Quelle borne de la prise est la plus dangereuse ?', ['La terre', 'Le neutre', 'La phase', 'Aucune'], 2, 'La phase est portée à la tension du secteur par rapport à la Terre.'],
            ['Sur un oscillogramme, la période se lit sur :', ['L’axe vertical', 'L’axe horizontal (temps)', 'La luminosité de la trace', 'Le calibre de l’ampèremètre'], 1, 'On compte les divisions d’un motif et on multiplie par la sensibilité horizontale.'],
            ['Que faire en premier face à une victime encore en contact avec un fil électrique ?', ['La tirer par la main', 'Couper le courant avant de la toucher', 'Lui jeter de l’eau', 'Attendre qu’elle lâche d’elle-même'], 1, 'Toucher la victime sous tension ferait passer le courant par le sauveteur.'],
          ],
        },
        {
          titre: 'Les infrarouges et la détection du corps humain',
          axe: 'Prévenir et sécuriser',
          lecon: {
            titre: 'Tout corps chaud rayonne : la loi de Wien',
            cours: `Un thermomètre frontal sans contact, une caméra thermique qui repère une personne dans la fumée, l'éclairage qui s'allume à ton passage : tous captent un rayonnement que tes yeux ne voient pas, les **infrarouges** émis par ton corps.

## Le domaine des ondes électromagnétiques
La lumière est une onde électromagnétique. On la caractérise par sa **longueur d'onde** λ dans le vide.

| Le domaine | La longueur d'onde dans le vide | Exemples |
| **Ultraviolets (UV)** | Inférieure à 400 nm | Soleil ; bronzage, coups de soleil |
| **Visible** | De 400 nm (violet) à 800 nm (rouge) | Les couleurs que l'œil perçoit |
| **Infrarouges (IR)** | Supérieure à 800 nm | Chaleur rayonnée, télécommandes |

1 nm = 10⁻⁹ m et 1 µm = 10⁻⁶ m = 1 000 nm.

## Tout corps chaud émet un rayonnement
Un corps émet un rayonnement qui dépend de sa **température**. Son spectre présente un maximum pour une longueur d'onde λmax.

> **Loi de Wien** : λmax × T = 2,90 × 10⁻³ m·K, avec T en kelvins (T = θ + 273).

Plus un corps est chaud, plus λmax est **petite** : le métal chauffé passe du rouge sombre au blanc.

## Exemple travaillé : le corps humain
La peau est à environ 34 °C en surface, le corps à 37 °C, soit T ≈ 310 K.
λmax = 2,90 × 10⁻³ / 310 ≈ 9,4 × 10⁻⁶ m ≈ **9,4 µm**.

C'est bien au-delà de 800 nm : le corps humain émet surtout des **infrarouges**. Ils sont **invisibles** à l'œil nu et **sans danger** pour l'homme.

À comparer : le Soleil (surface ≈ 5 800 K) a son maximum vers 500 nm, dans le visible.

Sur la **courbe de Wien** (λmax en fonction de T), on lit directement la longueur d'onde d'émission maximale d'un corps de température connue.

## Des détecteurs qui s'en servent
| L'appareil | Son principe |
| **Thermomètre infrarouge** | Mesure l'intensité des IR émis par le front ou le tympan et en déduit la température |
| **Caméra thermique** | Forme une image où chaque zone est colorée selon son émission IR : repérage de victimes, de fièvre, de fuites de chaleur |
| **Détecteur de présence** | Réagit à la variation d'IR quand un corps chaud passe dans son champ |

> Les infrarouges du corps humain ne sont pas à confondre avec les ultraviolets du Soleil, qui, eux, sont dangereux pour la peau et les yeux.`,
          },
          questions: [
            ['Quelles sont les limites du domaine visible dans le vide ?', ['De 100 nm à 400 nm', 'De 400 nm à 800 nm', 'De 800 nm à 1 mm', 'De 1 µm à 10 µm'], 1, 'En deçà de 400 nm, ce sont les UV ; au-delà de 800 nm, les infrarouges.'],
            ['Le rayonnement principal émis par le corps humain appartient au domaine :', ['Des ultraviolets', 'Du visible', 'Des infrarouges', 'Des rayons X'], 2, 'À 310 K, λmax ≈ 9 µm : c’est l’infrarouge.'],
            ['Que dit la loi de Wien ?', ['λmax × T = constante', 'λmax + T = constante', 'λmax = T × 273', 'λmax / T = constante'], 0, 'λmax × T = 2,90 × 10⁻³ m·K : plus le corps est chaud, plus λmax est petite.'],
            ['Plus un corps est chaud, plus la longueur d’onde de son maximum d’émission est :', ['Grande', 'Petite', 'Constante', 'Nulle'], 1, 'λmax est inversement proportionnelle à la température absolue.'],
            ['Convertis 37 °C en kelvins.', ['37 K', '236 K', '310 K', '373 K'], 2, 'T = θ + 273 = 37 + 273 = 310 K.'],
            ['Les infrarouges émis par le corps humain sont dangereux pour la santé.', ['Vrai', 'Faux'], 1, 'Ils sont invisibles et sans danger ; ce sont les UV qui présentent un risque.'],
            ['Où se situe le maximum d’émission du Soleil (environ 5 800 K) ?', ['Dans l’infrarouge lointain', 'Vers 500 nm, dans le visible', 'Dans les rayons X', 'Dans les ondes radio'], 1, 'λmax = 2,90 × 10⁻³ / 5 800 ≈ 5,0 × 10⁻⁷ m = 500 nm.'],
            ['Comment fonctionne un thermomètre frontal sans contact ?', ['Il émet des UV sur la peau', 'Il mesure le rayonnement infrarouge émis par la peau', 'Il mesure la pression du sang', 'Il chauffe le front et mesure le refroidissement'], 1, 'L’intensité des IR reçus dépend de la température de la surface visée.'],
            ['Un rayonnement de longueur d’onde 300 nm appartient au domaine :', ['Des ultraviolets', 'Du visible', 'Des infrarouges', 'Des micro-ondes'], 0, '300 nm est inférieur à 400 nm : c’est un rayonnement UV.'],
            ['Combien de nanomètres vaut 1 micromètre ?', ['10', '100', '1 000', '1 000 000'], 2, '1 µm = 10⁻⁶ m = 1 000 × 10⁻⁹ m = 1 000 nm.'],
            ['Pourquoi une caméra thermique peut-elle repérer une personne dans le noir ?', ['Parce que le corps humain émet de la lumière visible', 'Parce que le corps humain émet des infrarouges, qu’elle capte', 'Parce qu’elle émet des rayons X', 'Parce qu’elle détecte les sons'], 1, 'Elle n’a pas besoin d’éclairage : elle forme l’image à partir du rayonnement IR propre des corps.'],
            ['Un corps plus froid que le corps humain émet un maximum à une longueur d’onde plus courte.', ['Vrai', 'Faux'], 1, 'Plus froid signifie λmax plus grande, d’après la loi de Wien.'],
          ],
        },
        {
          titre: 'La sécurité routière : vitesse et distance d’arrêt',
          axe: 'Prévenir et sécuriser',
          lecon: {
            titre: 'Pourquoi la vitesse tue',
            cours: `Rouler deux fois plus vite ne double pas le danger : cela multiplie par quatre l'énergie à dissiper en cas de choc et la distance de freinage. La physique explique les limitations de vitesse.

## L'énergie cinétique
Tout corps en mouvement possède une **énergie cinétique** :

> Ec = ½ × m × v², avec Ec en joules (J), m en kilogrammes (kg) et v en mètres par seconde (m/s).

Pour convertir une vitesse : v (m/s) = v (km/h) / 3,6.

Exemple : une voiture de 1 200 kg à 50 km/h (13,9 m/s) a Ec = 0,5 × 1 200 × 13,9² ≈ 1,16 × 10⁵ J. À 100 km/h (27,8 m/s), Ec ≈ 4,63 × 10⁵ J : **quatre fois plus**.

Lors d'un choc, cette énergie est dissipée en déformations — du véhicule et des corps.

## Distance de réaction, de freinage, d'arrêt
| La distance | Sa définition | Ce qui l'influence |
| **Distance de réaction** DR | Parcourue pendant le **temps de réaction** du conducteur (≈ 1 s), à vitesse constante | La vitesse, la fatigue, l'alcool, les drogues, le téléphone |
| **Distance de freinage** DF | Parcourue entre le début du freinage et l'arrêt | La vitesse (elle varie comme v²), l'état de la route, des pneus, des freins, la masse |
| **Distance d'arrêt** DA | DA = DR + DF | Tous ces facteurs |

La distance de réaction se calcule simplement : DR = v × tR. À 50 km/h et avec 1 s de réaction, la voiture parcourt environ 14 m avant même que le pied touche la pédale.

## Pourquoi la distance de freinage varie comme v²
Freiner, c'est dissiper toute l'énergie cinétique. Comme Ec est proportionnelle à v², la distance nécessaire l'est aussi (à force de freinage égale). À vitesse doublée, distance de freinage **quadruplée**.

| La vitesse | Distance de réaction (1 s) | Distance de freinage (route sèche, ordre de grandeur) |
| 50 km/h | ≈ 14 m | ≈ 14 m |
| 90 km/h | ≈ 25 m | ≈ 45 m |
| 130 km/h | ≈ 36 m | ≈ 95 m |

Sur route mouillée, la distance de freinage augmente nettement (souvent de l'ordre de 1,5 fois).

## Les bons réflexes
1. Respecter les **limitations** de vitesse et les adapter à la météo.
2. Garder une **distance de sécurité** d'au moins 2 secondes avec le véhicule devant.
3. Ne jamais conduire après avoir bu ou consommé des stupéfiants, ni en téléphonant : le temps de réaction s'allonge.
4. Porter la **ceinture** et entretenir pneus et freins.`,
          },
          questions: [
            ['Quelle est l’expression de l’énergie cinétique ?', ['Ec = m × v', 'Ec = ½ × m × v²', 'Ec = m × g × h', 'Ec = ½ × m² × v'], 1, 'Elle est proportionnelle à la masse et au carré de la vitesse.'],
            ['Si la vitesse d’un véhicule double, son énergie cinétique est :', ['Doublée', 'Triplée', 'Multipliée par 4', 'Inchangée'], 2, 'Ec dépend de v² : (2v)² = 4v².'],
            ['Convertis 72 km/h en m/s.', ['20 m/s', '72 m/s', '259 m/s', '7,2 m/s'], 0, 'v = 72 / 3,6 = 20 m/s.'],
            ['Qu’est-ce que la distance de réaction ?', ['La distance parcourue pendant le freinage', 'La distance parcourue pendant le temps de réaction du conducteur', 'La distance de sécurité légale', 'La longueur du véhicule'], 1, 'Pendant ce temps, le véhicule garde sa vitesse : DR = v × tR.'],
            ['La distance d’arrêt est égale à :', ['DR − DF', 'DR × DF', 'DR + DF', 'DF seule'], 2, 'On additionne la distance parcourue avant de freiner et celle du freinage.'],
            ['L’alcool augmente surtout :', ['La masse du véhicule', 'La distance de réaction', 'L’adhérence des pneus', 'L’énergie cinétique à vitesse égale'], 1, 'Il allonge le temps de réaction, donc la distance parcourue avant de freiner.'],
            ['Quelle distance de réaction à 90 km/h (25 m/s) avec un temps de réaction de 1 s ?', ['9 m', '25 m', '90 m', '50 m'], 1, 'DR = v × tR = 25 × 1 = 25 m.'],
            ['Une route mouillée augmente la distance de freinage.', ['Vrai', 'Faux'], 0, 'L’adhérence diminue : le véhicule met plus de distance à dissiper son énergie.'],
            ['Quelle est l’énergie cinétique d’un piéton de 60 kg qui court à 5 m/s ?', ['150 J', '300 J', '750 J', '1 500 J'], 2, 'Ec = 0,5 × 60 × 5² = 0,5 × 60 × 25 = 750 J.'],
            ['Pourquoi la distance de freinage est-elle proportionnelle au carré de la vitesse ?', ['Parce que les freins s’usent plus vite', 'Parce qu’il faut dissiper l’énergie cinétique, proportionnelle à v²', 'Parce que le temps de réaction double', 'Parce que la masse augmente avec la vitesse'], 1, 'À force de freinage égale, la distance est proportionnelle à l’énergie à dissiper.'],
            ['Quel facteur n’influence PAS la distance de réaction ?', ['La fatigue', 'Le téléphone au volant', 'L’état des pneus', 'La vitesse'], 2, 'L’état des pneus joue sur le freinage, pas sur le temps que met le conducteur à réagir.'],
            ['Que devient l’énergie cinétique d’un véhicule lors d’un choc ?', ['Elle disparaît sans effet', 'Elle est dissipée en déformations et en chaleur', 'Elle se transforme en vitesse', 'Elle est stockée dans la ceinture'], 1, 'D’où la gravité des chocs à grande vitesse : il y a beaucoup plus d’énergie à dissiper.'],
          ],
        },
        // ─────────────────────────── THÈME 2 ───────────────────────────
        {
          titre: 'Les ondes sonores et l’audition',
          axe: 'Analyser et diagnostiquer',
          lecon: {
            titre: 'Du son au diagnostic auditif',
            cours: `Un audiogramme, une prothèse auditive, un bouchon d'oreille pour un concert : pour diagnostiquer et protéger l'audition, il faut savoir ce qu'est un son.

## Un son est une onde mécanique
Une source (corde vocale, membrane de haut-parleur) **vibre** et met en mouvement les couches d'air voisines : une perturbation se **propage** de proche en proche. Le son a besoin d'un **milieu matériel** : il ne se propage pas dans le vide. Dans l'air, sa vitesse est d'environ **340 m/s**.

## La perception par l'oreille
1. Le **pavillon** et le conduit auditif canalisent le son vers le **tympan**, qui vibre.
2. Les **osselets** de l'oreille moyenne (marteau, enclume, étrier) transmettent et amplifient la vibration.
3. Dans la **cochlée** (oreille interne), les **cellules ciliées** transforment la vibration en message nerveux.
4. Le **nerf auditif** conduit ce message au cerveau, qui l'interprète.

> Les cellules ciliées ne se régénèrent pas : un traumatisme sonore peut laisser une perte définitive.

## Les caractéristiques d'un son
| La grandeur | Ce qu'elle traduit | Son unité |
| **Fréquence** f | La **hauteur** : grave, médium, aigu | Hertz (Hz) |
| **Niveau d'intensité sonore** L | La force perçue du son | Décibel (dB) |

| Le domaine | Les fréquences |
| **Infrasons** | Moins de 20 Hz, inaudibles |
| **Sons audibles** | De 20 Hz à 20 000 Hz |
| **Ultrasons** | Plus de 20 000 Hz, inaudibles (échographie) |

Un son de basse fréquence est **grave**, un son de haute fréquence est **aigu**. On mesure f sur un enregistrement : f = 1 / T, où T est la période du motif.

## Les risques auditifs
| Le niveau | L'effet |
| ≈ 0 dB | Seuil d'audibilité |
| ≈ 60 dB | Conversation |
| 80–85 dB | Seuil de risque pour une exposition prolongée |
| ≈ 120 dB | Seuil de douleur |

Le danger dépend du **niveau** et de la **durée** d'exposition : protège-toi (bouchons, pauses, distance aux enceintes). Le **sonomètre** mesure le niveau sonore.

## Identifier et compenser une perte auditive
L'**audiogramme** représente, pour chaque fréquence testée, le niveau minimal que le patient entend. Une courbe qui descend nettement sous la normale (0 à 20 dB) signale une **perte auditive** ; si elle touche surtout les aigus, c'est souvent le signe d'un traumatisme sonore ou de l'âge.

La **prothèse auditive** capte le son par un microphone, l'**amplifie** — surtout dans les fréquences où la perte est la plus forte — et le restitue dans le conduit auditif par un écouteur.`,
          },
          questions: [
            ['Quel est le domaine des fréquences audibles par l’oreille humaine ?', ['De 2 Hz à 2 000 Hz', 'De 20 Hz à 20 000 Hz', 'De 200 Hz à 200 000 Hz', 'De 0 Hz à 20 Hz'], 1, 'En dessous, ce sont les infrasons ; au-dessus, les ultrasons.'],
            ['Un son de fréquence élevée est perçu comme :', ['Grave', 'Aigu', 'Fort', 'Faible'], 1, 'La fréquence fixe la hauteur ; la force du son dépend du niveau d’intensité sonore.'],
            ['Le son peut se propager dans le vide.', ['Vrai', 'Faux'], 1, 'C’est une onde mécanique : il lui faut un milieu matériel (air, eau, solide).'],
            ['Dans quelle unité s’exprime le niveau d’intensité sonore ?', ['Le hertz', 'Le décibel', 'Le watt', 'Le pascal'], 1, 'Le sonomètre affiche des décibels (dB).'],
            ['Quelles cellules transforment la vibration sonore en message nerveux ?', ['Les osselets', 'Les cellules ciliées de la cochlée', 'Les cellules du tympan', 'Les neurones du cortex'], 1, 'Elles sont situées dans l’oreille interne et ne se régénèrent pas.'],
            ['Comment appelle-t-on les ondes sonores de fréquence supérieure à 20 000 Hz ?', ['Infrasons', 'Ultrasons', 'Infrarouges', 'Ultraviolets'], 1, 'Inaudibles pour nous, elles sont utilisées en échographie.'],
            ['À partir de quel niveau sonore environ une exposition prolongée présente-t-elle un risque ?', ['20 dB', '50 dB', '80–85 dB', '200 dB'], 2, 'Au-delà, le risque augmente avec la durée d’exposition.'],
            ['Que représente un audiogramme ?', ['La forme de l’oreille', 'Le seuil d’audition du patient pour chaque fréquence testée', 'La vitesse du son dans l’oreille', 'L’activité électrique du cœur'], 1, 'Il permet de repérer une perte auditive et les fréquences touchées.'],
            ['Un son a une période de 2,0 ms. Quelle est sa fréquence ?', ['2 Hz', '50 Hz', '500 Hz', '2 000 Hz'], 2, 'f = 1 / T = 1 / 0,0020 s = 500 Hz.'],
            ['Quel est le rôle d’une prothèse auditive ?', ['Supprimer tous les sons', 'Amplifier le son, surtout aux fréquences où la perte est forte', 'Émettre des ultrasons', 'Régénérer les cellules ciliées'], 1, 'Micro, amplificateur, écouteur : elle compense la perte sans réparer l’oreille.'],
            ['Quels éléments de l’oreille moyenne transmettent la vibration du tympan ?', ['Les osselets', 'Les cellules ciliées', 'Le nerf auditif', 'Le pavillon'], 0, 'Marteau, enclume et étrier transmettent et amplifient la vibration jusqu’à l’oreille interne.'],
            ['Vers quel niveau se situe le seuil de douleur ?', ['60 dB', '85 dB', '120 dB', '0 dB'], 2, 'À ce niveau, même une exposition brève peut léser l’oreille interne.'],
          ],
        },
        {
          titre: 'La vision : l’œil, les lentilles et la correction',
          axe: 'Analyser et diagnostiquer',
          lecon: {
            titre: 'Former une image nette sur la rétine',
            cours: `Voir net, c'est former une image précise sur la rétine. L'œil y parvient grâce à des milieux transparents qui se comportent comme une **lentille convergente** ; quand il n'y parvient plus, on le corrige.

## La lumière et l'œil
Dans un milieu homogène et transparent, la lumière se propage **en ligne droite**.

| L'élément | Son rôle | Son équivalent dans le modèle |
| **Cornée** + **cristallin** | Font converger la lumière | Lentille convergente |
| **Iris** | Règle la quantité de lumière qui entre | Diaphragme |
| **Pupille** | Orifice au centre de l'iris | Ouverture du diaphragme |
| **Rétine** | Reçoit l'image, contient les photorécepteurs | Écran |
| **Nerf optique** | Conduit le message au cerveau | — |

## Les lentilles minces
| La lentille | Sa forme | Son effet |
| **Convergente** | Bords minces | Fait converger les rayons |
| **Divergente** | Bords épais | Fait diverger les rayons |

Une lentille a un **centre optique** O, un **foyer objet** F et un **foyer image** F'. La **distance focale** f' = OF' ; la **vergence** V = 1 / f', en **dioptries** (δ) avec f' en mètres. Une lentille convergente a V > 0, une divergente V < 0.

Trois rayons particuliers : celui qui passe par **O** n'est pas dévié ; celui qui arrive **parallèle à l'axe** ressort en passant par **F'** ; celui qui passe par **F** ressort parallèle à l'axe.

> Construire l'image B' d'un point B : tracer deux de ces rayons issus de B ; ils se coupent en B'.

Si l'image se forme de l'autre côté de la lentille, on peut la recueillir sur un écran : elle est **réelle**. Si l'objet est placé entre F et O, les rayons divergent après la lentille : l'image est **virtuelle**, droite et agrandie — c'est le principe de la **loupe**. Le **grandissement** γ = A'B' / AB.

## L'accommodation
Pour voir net de près, les muscles ciliaires **bombent** le cristallin : sa vergence augmente. Avec l'âge, le cristallin perd son élasticité : c'est la **presbytie**, qui gêne la vision de près.

## Les défauts et leur correction
| Le défaut | Ce qui se passe | La correction |
| **Myopie** | Œil trop convergent (ou trop long) : l'image d'un objet lointain se forme **avant** la rétine ; vision de loin floue | Lentille **divergente** |
| **Hypermétropie** | Œil pas assez convergent (ou trop court) : l'image se forme **derrière** la rétine | Lentille **convergente** |
| **Presbytie** | Accommodation insuffisante, vision de près floue | Lentille **convergente** pour lire |

Deux lentilles minces accolées se comportent comme une seule lentille de vergence **V = V₁ + V₂**. C'est ainsi que le verre correcteur s'ajoute à l'œil.

Exemple : une lentille de distance focale 50 cm a une vergence V = 1 / 0,50 = + 2,0 δ.`,
          },
          questions: [
            ['Dans le modèle de l’œil, la rétine joue le rôle :', ['D’une lentille', 'D’un diaphragme', 'D’un écran', 'D’un miroir'], 2, 'C’est sur elle que se forme l’image ; cornée et cristallin forment la lentille.'],
            ['Quel élément de l’œil règle la quantité de lumière qui entre ?', ['Le cristallin', 'L’iris', 'La rétine', 'Le nerf optique'], 1, 'L’iris agit comme un diaphragme : la pupille se rétrécit en pleine lumière.'],
            ['Quelle est la vergence d’une lentille de distance focale 25 cm ?', ['+ 0,25 δ', '+ 4,0 δ', '+ 25 δ', '− 4,0 δ'], 1, 'V = 1 / f’ = 1 / 0,25 m = + 4,0 δ.'],
            ['Un rayon passant par le centre optique d’une lentille :', ['Est dévié vers le foyer', 'N’est pas dévié', 'Ressort parallèle à l’axe', 'Est réfléchi'], 1, 'C’est l’un des trois rayons particuliers qui servent à construire une image.'],
            ['Un rayon incident parallèle à l’axe optique d’une lentille convergente ressort en passant par :', ['Le foyer objet F', 'Le foyer image F’', 'Le centre optique O', 'Aucun point particulier'], 1, 'C’est la définition même du foyer image.'],
            ['Chez un œil myope, l’image d’un objet éloigné se forme :', ['Sur la rétine', 'Derrière la rétine', 'Avant la rétine', 'Sur la cornée'], 2, 'L’œil myope est trop convergent : la vision de loin est floue.'],
            ['Quel verre corrige la myopie ?', ['Une lentille convergente', 'Une lentille divergente', 'Un verre plan', 'Un prisme'], 1, 'La lentille divergente diminue la convergence totale de l’œil.'],
            ['Qu’est-ce que la presbytie ?', ['Un œil trop long', 'La perte d’élasticité du cristallin avec l’âge, qui gêne la vision de près', 'Une opacification de la cornée', 'Un défaut de la rétine'], 1, 'Le cristallin se bombe moins : l’accommodation devient insuffisante.'],
            ['Quelle est la vergence de deux lentilles accolées de + 3 δ et − 1 δ ?', ['+ 4 δ', '+ 2 δ', '− 3 δ', '+ 3 δ'], 1, 'V = V₁ + V₂ = 3 + (− 1) = + 2 δ.'],
            ['Une loupe donne d’un objet placé entre F et O une image :', ['Réelle et renversée', 'Virtuelle, droite et agrandie', 'Réelle et réduite', 'Virtuelle et réduite'], 1, 'C’est pourquoi on la regarde à travers la lentille, sans pouvoir la projeter sur un écran.'],
            ['L’accommodation consiste à bomber le cristallin pour voir net de près.', ['Vrai', 'Faux'], 0, 'Le cristallin plus bombé est plus convergent.'],
            ['Quel verre corrige l’hypermétropie ?', ['Une lentille divergente', 'Une lentille convergente', 'Aucun verre n’existe', 'Un verre teinté'], 1, 'L’œil hypermétrope ne converge pas assez : on ajoute de la convergence.'],
          ],
        },
        {
          titre: 'Débit, pression et tension artérielle',
          axe: 'Analyser et diagnostiquer',
          lecon: {
            titre: 'Les fluides au service de la mesure de la pression sanguine',
            cours: `Le médecin qui prend ta tension mesure une pression, et le cardiologue qui évalue ton cœur calcule un débit. Ces deux grandeurs de la physique des fluides sont au cœur du diagnostic cardio-vasculaire.

## Le débit d'un écoulement
Le **débit volumique** D est le volume de liquide qui traverse une section par unité de temps : D = V / Δt, en m³/s (ou L/min).

> D = v × S, où v est la vitesse moyenne d'écoulement (m/s) et S la section (m²).

À débit constant, si la section diminue, la vitesse **augmente** : c'est ce qui se passe au passage d'un rétrécissement artériel.

## Le débit cardiaque
> DC = fC × VES : débit cardiaque = fréquence cardiaque × volume d'éjection systolique.

Exemple : au repos, fC = 70 battements/min et VES = 70 mL. DC = 70 × 70 = 4 900 mL/min ≈ **4,9 L/min**. À l'effort, fC et VES augmentent : le débit peut être multiplié par quatre ou cinq.

## Force pressante et pression
Un fluide exerce sur toute paroi une **force pressante** F, perpendiculaire à la paroi.

> P = F / S, avec P en pascals (Pa), F en newtons (N), S en m².

| L'unité | Sa valeur en pascals |
| 1 hectopascal (hPa) | 100 Pa |
| 1 bar | 10⁵ Pa |
| 1 mmHg | ≈ 133 Pa |
| 1 cmHg | ≈ 1 333 Pa |

La pression atmosphérique vaut environ 1 013 hPa, soit 76 cmHg.

## La loi fondamentale de la statique des fluides
Dans un liquide au repos, la pression augmente avec la profondeur :

> P₂ − P₁ = ρ × g × (z₁ − z₂), avec ρ la masse volumique (kg/m³), g ≈ 9,81 N/kg et z l'altitude (m).

Exemple : dans l'eau (ρ = 1 000 kg/m³), 10 m plus bas, la pression augmente de 1 000 × 9,81 × 10 ≈ 10⁵ Pa, soit 1 bar. C'est pourquoi une perfusion se place **au-dessus** du patient et pourquoi on mesure la tension au bras, **à hauteur du cœur**.

## Tension artérielle : ce que l'on mesure
La **pression artérielle** est la pression du sang dans l'artère. La **tension artérielle** mesurée par le tensiomètre est la **différence** entre la pression artérielle et la pression atmosphérique.

| La valeur | Le moment |
| **Tension systolique** | Pendant la contraction du cœur, valeur maximale |
| **Tension diastolique** | Pendant le relâchement, valeur minimale |

On l'écrit « 12/8 », en **centimètres de mercure** : 12 cmHg de systolique, 8 cmHg de diastolique (soit 120/80 mmHg).

Principe de la mesure : un brassard gonflé comprime l'artère et arrête le flux ; en le dégonflant, on repère le premier retour du flux (systolique) puis la disparition des bruits ou des oscillations (diastolique). Une tension durablement supérieure ou égale à **14/9** définit l'**hypertension artérielle**.`,
          },
          questions: [
            ['Quelle relation relie le débit D, la vitesse v et la section S ?', ['D = v / S', 'D = v × S', 'D = S / v', 'D = v + S'], 1, 'Le débit est le volume qui traverse la section par seconde : vitesse × section.'],
            ['Si la section d’une artère diminue à débit constant, la vitesse du sang :', ['Diminue', 'Reste la même', 'Augmente', 'S’annule'], 2, 'v = D / S : moins de section, plus de vitesse.'],
            ['fC = 60 battements/min et VES = 80 mL. Quel est le débit cardiaque ?', ['4,8 L/min', '140 mL/min', '0,75 L/min', '48 L/min'], 0, 'DC = 60 × 80 = 4 800 mL/min = 4,8 L/min.'],
            ['Quelle est l’unité internationale de pression ?', ['Le newton', 'Le pascal', 'Le bar', 'Le cmHg'], 1, 'Le pascal (Pa) est la pression d’une force de 1 newton sur 1 m² : 1 Pa = 1 N/m².'],
            ['Une force de 20 N s’exerce sur 0,010 m². Quelle est la pression ?', ['0,2 Pa', '200 Pa', '2 000 Pa', '20 Pa'], 2, 'P = F / S = 20 / 0,010 = 2 000 Pa.'],
            ['Dans un liquide au repos, la pression :', ['Diminue avec la profondeur', 'Augmente avec la profondeur', 'Est la même partout', 'Ne dépend que de la surface'], 1, 'P₂ − P₁ = ρ × g × (z₁ − z₂) : plus on descend, plus la pression est grande.'],
            ['Que mesure un tensiomètre ?', ['La pression artérielle absolue', 'La différence entre la pression artérielle et la pression atmosphérique', 'Le débit cardiaque', 'La fréquence respiratoire'], 1, 'C’est la tension artérielle, exprimée en cmHg ou mmHg.'],
            ['Une tension de « 12/8 » signifie :', ['12 mmHg de systolique et 8 mmHg de diastolique', '12 cmHg de systolique et 8 cmHg de diastolique', '12 battements pour 8 respirations', '12 bar et 8 bar'], 1, 'Soit 120/80 mmHg, une valeur normale.'],
            ['La tension systolique correspond :', ['Au relâchement du cœur', 'À la contraction du cœur', 'À la pause entre deux battements', 'À la pression veineuse'], 1, 'C’est la valeur maximale, pendant l’éjection du sang par les ventricules.'],
            ['Pourquoi place-t-on une poche de perfusion au-dessus du patient ?', ['Pour la garder au frais', 'Pour que la pression du liquide soit supérieure à celle du sang veineux', 'Pour réduire le débit à zéro', 'Pour la stériliser'], 1, 'La différence de hauteur crée une surpression qui fait entrer le liquide dans la veine.'],
            ['Combien de pascals vaut environ 1 cmHg ?', ['13 Pa', '133 Pa', '1 333 Pa', '100 000 Pa'], 2, '1 mmHg ≈ 133 Pa, donc 1 cmHg ≈ 1 333 Pa.'],
            ['Une tension durablement supérieure ou égale à 14/9 définit l’hypertension artérielle.', ['Vrai', 'Faux'], 0, 'Soit 140/90 mmHg : c’est le seuil habituel de l’hypertension chez l’adulte.'],
          ],
        },
        {
          titre: 'Les molécules organiques',
          axe: 'Analyser et diagnostiquer',
          lecon: {
            titre: 'Représenter une molécule et reconnaître ses fonctions',
            cours: `Glucose, éthanol, paracétamol, urée : les molécules du vivant et des médicaments sont **organiques**, bâties sur un squelette d'atomes de carbone. Savoir les lire est indispensable pour analyser un milieu biologique.

## Les liaisons covalentes
Une **liaison covalente** est une mise en commun de deux électrons entre deux atomes. Chaque atome forme un nombre fixe de liaisons :

| L'atome | Nombre de liaisons |
| Hydrogène H | 1 |
| Oxygène O | 2 |
| Azote N | 3 |
| Carbone C | 4 |

Deux liaisons entre les mêmes atomes forment une **double liaison** (C=O, C=C).

## Quatre façons d'écrire une molécule
| La représentation | Ce qu'elle montre | L'éthanol |
| **Formule brute** | Le nombre d'atomes de chaque sorte | C₂H₆O |
| **Formule développée** | Toutes les liaisons | Chaque H relié à son atome |
| **Semi-développée** | Les liaisons, sauf celles avec H | CH₃–CH₂–OH |
| **Topologique** | Le squelette en ligne brisée, sans C ni H écrits | Un segment terminé par OH |

Dans l'écriture topologique, chaque extrémité et chaque sommet de la ligne brisée porte un carbone ; les hydrogènes liés aux carbones sont sous-entendus.

## Les fonctions chimiques
Un groupe d'atomes caractéristique confère à la molécule des propriétés : c'est une **fonction**.

| La fonction | Le groupe caractéristique | Exemple |
| **Alcool** | C–OH (carbone lié à quatre atomes) | Éthanol |
| **Aldéhyde** | –CHO, en bout de chaîne | Éthanal |
| **Cétone** | C=O au milieu de la chaîne | Propanone (acétone) |
| **Acide carboxylique** | –COOH | Acide éthanoïque |
| **Ester** | –COO– entre deux chaînes | Éthanoate d'éthyle |
| **Étheroxyde** | C–O–C | Éthoxyéthane |
| **Amine** | C–N (N lié à des C ou H) | Méthylamine CH₃–NH₂ |
| **Amide** | –CO–N– | Urée, liaison peptidique |

> Méthode : repère d'abord l'oxygène ou l'azote, regarde ses voisins, puis nomme la fonction.

## La nomenclature
Le nom vient du **nombre de carbones de la chaîne principale** (méth- 1, éth- 2, prop- 3, but- 4, pent- 5, hex- 6) suivi d'une terminaison selon la fonction : -ol (alcool), -al (aldéhyde), -one (cétone), acide …-oïque. Un chiffre indique la position du groupe : propan-2-ol.

## L'isomérie de constitution
Deux **isomères** ont la **même formule brute** mais des **formules développées différentes** : ce sont des molécules différentes, aux propriétés différentes.

Exemple : C₂H₆O est à la fois l'éthanol CH₃–CH₂–OH (un alcool, liquide) et le méthoxyméthane CH₃–O–CH₃ (un étheroxyde, gazeux). De même, le glucose et le fructose sont deux isomères de formule C₆H₁₂O₆.`,
          },
          questions: [
            ['Combien de liaisons covalentes forme un atome de carbone ?', ['1', '2', '3', '4'], 3, 'Le carbone est tétravalent : c’est ce qui lui permet de former de longues chaînes.'],
            ['Combien de liaisons covalentes forme un atome d’azote ?', ['1', '2', '3', '4'], 2, 'L’azote est trivalent, comme dans l’ammoniac NH₃.'],
            ['Quel groupe caractérise la fonction acide carboxylique ?', ['–OH', '–CHO', '–COOH', '–NH₂'], 2, 'On le trouve dans l’acide éthanoïque du vinaigre.'],
            ['CH₃–CO–CH₃ (propanone) possède une fonction :', ['Aldéhyde', 'Cétone', 'Alcool', 'Ester'], 1, 'Le groupe C=O est au milieu de la chaîne : c’est une cétone.'],
            ['Que sont deux isomères de constitution ?', ['Deux molécules identiques', 'Deux molécules de même formule brute mais de formules développées différentes', 'Deux molécules de même masse mais de formules brutes différentes', 'Deux atomes du même élément'], 1, 'Même composition, enchaînement différent : ce sont deux espèces distinctes.'],
            ['Quelle est la formule brute de l’éthanol CH₃–CH₂–OH ?', ['C₂H₅O', 'C₂H₆O', 'C₃H₈O', 'CH₄O'], 1, '2 carbones, 5 + 1 = 6 hydrogènes et 1 oxygène.'],
            ['Quel préfixe désigne une chaîne de trois carbones ?', ['Méth-', 'Éth-', 'Prop-', 'But-'], 2, 'Méth- 1, éth- 2, prop- 3, but- 4.'],
            ['Dans une formule topologique, les atomes de carbone et les hydrogènes qui leur sont liés ne sont pas écrits.', ['Vrai', 'Faux'], 0, 'Chaque sommet et chaque extrémité de la ligne brisée représente un carbone.'],
            ['Le groupe –CO–NH– caractérise la fonction :', ['Amine', 'Amide', 'Ester', 'Étheroxyde'], 1, 'C’est aussi la liaison peptidique qui unit les acides aminés.'],
            ['Quelle terminaison porte le nom d’un aldéhyde ?', ['-ol', '-one', '-al', '-oïque'], 2, 'Éthanal, propanal : l’aldéhyde se termine en -al.'],
            ['C–O–C, un oxygène entre deux carbones, est le groupe caractéristique :', ['D’un étheroxyde', 'D’un alcool', 'D’un acide', 'D’une amine'], 0, 'Exemple : le méthoxyméthane CH₃–O–CH₃, isomère de l’éthanol.'],
            ['Le glucose et le fructose ont la même formule brute C₆H₁₂O₆.', ['Vrai', 'Faux'], 0, 'Ce sont deux isomères : l’un porte une fonction aldéhyde, l’autre une fonction cétone.'],
          ],
        },
        {
          titre: 'Les molécules d’intérêt biologique',
          axe: 'Analyser et diagnostiquer',
          lecon: {
            titre: 'Glucides, lipides, protéines, urée et vitamines',
            cours: `Un bilan sanguin dose la glycémie, le cholestérol, les triglycérides, l'urée. Derrière chaque ligne, une famille de molécules que la chimie organique permet de reconnaître.

## Les glucides
Les glucides portent plusieurs fonctions **alcool** et une fonction **aldéhyde** ou **cétone**.

| Le glucide | Formule | Sa particularité |
| **Glucose** | C₆H₁₂O₆ | Fonction aldéhyde (aldose), cinq fonctions alcool |
| **Fructose** | C₆H₁₂O₆ | Fonction cétone (cétose), isomère du glucose |
| **Lactose** | C₁₂H₂₂O₁₁ | Sucre du lait, formé de glucose et de galactose |

En solution, ces sucres existent sous une forme **linéaire** (ouverte) et une forme **cyclique** (fermée), la plus abondante. Au laboratoire, la **liqueur de Fehling** chauffée donne un précipité rouge brique avec les sucres réducteurs comme le glucose : c'est un test de la fonction aldéhyde.

## Les lipides
Un **acide gras** est un acide carboxylique à longue chaîne carbonée.

| L'acide gras | Carbones et doubles liaisons | Nature |
| Acide palmitique | 16 carbones, aucune | **Saturé** |
| Acide stéarique | 18 carbones, aucune | **Saturé** |
| Acide oléique | 18 carbones, une | **Mono-insaturé** |
| Acide α-linoléique | 18 carbones, trois | **Poly-insaturé** (oméga-3) |

Un acide gras **saturé** n'a que des liaisons simples C–C ; un **insaturé** a au moins une double liaison C=C. Les graisses animales sont riches en saturés, les huiles végétales en insaturés.

Un **triglycéride** est un **triester** : une molécule de **glycérol** (trois fonctions alcool) estérifiée par **trois acides gras**. C'est la forme de stockage des graisses. Les **stérols**, comme le **cholestérol**, sont d'autres lipides, bâtis sur quatre cycles.

## Les acides α-aminés et les protéines
Un **acide α-aminé** porte une fonction **amine** –NH₂ et une fonction **acide carboxylique** –COOH sur le **même carbone** (le carbone α).

Deux acides aminés s'unissent par une **liaison peptidique** –CO–NH– (une fonction amide) en libérant une molécule d'eau. Un enchaînement d'acides aminés forme un **polypeptide** ; au-delà d'une cinquantaine environ, on parle de **protéine**.

> Pour retrouver les acides aminés d'un polypeptide : repère chaque liaison –CO–NH–, coupe entre C et N, puis rends –OH au C et –H au N.

## L'urée
L'**urée** CO(NH₂)₂ est le **produit de dégradation des protéines** : le foie transforme l'ammoniac toxique issu des acides aminés en urée, que le rein élimine dans les urines. Son dosage sanguin renseigne sur la fonction rénale.

## Les vitamines : l'exemple de la vitamine C
La **vitamine C** (acide ascorbique) porte des fonctions alcool et une fonction ester (cycle lactone). C'est un **réducteur** : elle s'oxyde facilement, ce qui en fait un **antioxydant**, mais aussi une molécule fragile — le jus d'orange laissé à l'air et la cuisson prolongée la détruisent.`,
          },
          questions: [
            ['Quelle fonction chimique distingue le glucose du fructose ?', ['Le glucose a une fonction aldéhyde, le fructose une cétone', 'Le glucose a une cétone, le fructose un aldéhyde', 'Le glucose n’a pas de fonction alcool', 'Le fructose a une fonction amine'], 0, 'Ce sont des isomères : un aldose et un cétose de même formule C₆H₁₂O₆.'],
            ['Qu’est-ce qu’un acide gras saturé ?', ['Un acide gras avec au moins une double liaison C=C', 'Un acide gras sans double liaison C=C', 'Un acide gras très soluble dans l’eau', 'Un acide gras à deux fonctions acide'], 1, 'Sa chaîne ne comporte que des liaisons simples C–C, comme l’acide palmitique.'],
            ['L’acide oléique (18 carbones, une double liaison) est :', ['Saturé', 'Mono-insaturé', 'Poly-insaturé', 'Un stérol'], 1, 'Une seule double liaison : mono-insaturé. On le trouve dans l’huile d’olive.'],
            ['Un triglycéride est formé :', ['De trois glucoses', 'D’un glycérol et de trois acides gras', 'De trois acides aminés', 'D’un cholestérol et d’un acide gras'], 1, 'C’est un triester, forme de stockage des graisses dans le tissu adipeux.'],
            ['Un acide α-aminé porte sur le même carbone :', ['Deux fonctions alcool', 'Une fonction amine et une fonction acide carboxylique', 'Une fonction aldéhyde et une cétone', 'Deux fonctions amide'], 1, 'Ce carbone commun est le carbone α.'],
            ['Quelle liaison unit deux acides aminés dans une protéine ?', ['La liaison hydrogène', 'La liaison peptidique –CO–NH–', 'La liaison ester', 'La liaison ionique'], 1, 'Elle se forme en libérant une molécule d’eau.'],
            ['L’urée est le produit de dégradation :', ['Des glucides', 'Des lipides', 'Des protéines', 'Des vitamines'], 2, 'Le foie transforme l’ammoniac issu des acides aminés en urée, éliminée par le rein.'],
            ['Quelle propriété chimique explique le rôle antioxydant de la vitamine C ?', ['C’est un oxydant fort', 'C’est un réducteur', 'C’est une base forte', 'C’est un acide gras'], 1, 'Elle cède facilement des électrons : elle s’oxyde à la place d’autres molécules.'],
            ['Le lactose est formé de glucose et de galactose.', ['Vrai', 'Faux'], 0, 'C’est le sucre du lait, un diholoside de formule C₁₂H₂₂O₁₁.'],
            ['Combien de liaisons peptidiques compte un tripeptide ?', ['1', '2', '3', '4'], 1, 'Trois acides aminés en chaîne sont reliés par deux liaisons.'],
            ['Quel réactif met en évidence un sucre réducteur comme le glucose ?', ['L’eau de chaux', 'La liqueur de Fehling chauffée', 'Le papier pH', 'Le sulfate de cuivre anhydre'], 1, 'Elle donne un précipité rouge brique en présence d’une fonction aldéhyde.'],
            ['En solution, le glucose existe uniquement sous forme linéaire.', ['Vrai', 'Faux'], 1, 'Il existe sous forme linéaire et cyclique, la forme cyclique étant majoritaire.'],
          ],
        },
        {
          titre: 'L’eau, une molécule polaire',
          axe: 'Analyser et diagnostiquer',
          lecon: {
            titre: 'Liaison hydrogène, solubilité et micelles',
            cours: `Le corps humain est composé d'environ 60 % d'eau. Sa structure moléculaire explique pourquoi elle dissout le glucose mais pas l'huile, pourquoi la glace flotte, et comment le savon ou la bile emportent les graisses.

## Une molécule polaire
L'oxygène est plus **électronégatif** que l'hydrogène : il attire davantage les électrons des liaisons O–H. Il porte une charge partielle négative δ⁻, chaque hydrogène une charge partielle positive δ⁺. La liaison O–H est **polaire**.

La molécule d'eau est **coudée** : les charges partielles ne se compensent pas, la molécule entière est **polaire**.

## La liaison hydrogène
Un hydrogène δ⁺ d'une molécule est attiré par l'oxygène δ⁻ d'une molécule voisine : c'est la **liaison hydrogène**, représentée en pointillés O–H···O. Beaucoup plus faible qu'une liaison covalente, elle explique pourtant :
- une température d'ébullition élevée pour une si petite molécule ;
- la structure ouverte de la **glace**, où chaque molécule est liée à quatre voisines : la glace occupe **plus de volume** que l'eau liquide et **flotte**.

## Les changements d'état
Sous pression atmosphérique normale :

| Le changement | La température |
| **Fusion** (solide → liquide) | 0 °C |
| **Vaporisation** (liquide → gaz) | 100 °C |

Pendant un changement d'état d'un corps pur, la température reste **constante** : c'est un **palier**. La fusion et la vaporisation absorbent de la chaleur (elles sont **endothermiques**) ; c'est pourquoi l'évaporation de la sueur refroidit la peau.

## Qui se dissout dans l'eau ?
> « Qui se ressemble s'assemble » : l'eau, polaire, dissout les espèces polaires ou ioniques.

| L'espèce | Son comportement | Pourquoi |
| **Glucides**, sel | **Hydrophiles**, très solubles | Nombreuses fonctions –OH qui forment des liaisons hydrogène avec l'eau |
| **Huiles, graisses** | **Hydrophobes**, insolubles | Longues chaînes carbonées apolaires |

Deux liquides **miscibles** se mélangent en une seule phase (eau et éthanol). Non miscibles, ils forment deux phases : la moins **dense** est au-dessus (l'huile, de densité ≈ 0,9, flotte sur l'eau).

## Micelles, extraction
Une molécule de savon a une **tête hydrophile** (chargée) et une **queue hydrophobe** (longue chaîne). Dans l'eau, les queues se regroupent autour d'une gouttelette de graisse, têtes tournées vers l'eau : c'est une **micelle**. Les sels biliaires agissent de même dans l'intestin pour disperser les lipides alimentaires.

On peut **extraire** une espèce d'une phase aqueuse avec un solvant organique où elle est plus soluble, dans une **ampoule à décanter** ; on repère chaque phase grâce aux densités.`,
          },
          questions: [
            ['Pourquoi la molécule d’eau est-elle polaire ?', ['Parce qu’elle est linéaire', 'Parce que l’oxygène, plus électronégatif, attire les électrons et que la molécule est coudée', 'Parce qu’elle contient des ions', 'Parce que l’hydrogène est plus électronégatif que l’oxygène'], 1, 'Les charges partielles δ⁻ sur O et δ⁺ sur H ne se compensent pas dans une molécule coudée.'],
            ['Quelle charge partielle porte l’atome d’oxygène dans l’eau ?', ['δ⁺', 'δ⁻', 'Aucune', '2+'], 1, 'Il attire vers lui les électrons des liaisons O–H.'],
            ['Qu’est-ce qu’une liaison hydrogène ?', ['Une liaison covalente entre deux H', 'Une attraction entre un H δ⁺ et un atome très électronégatif d’une molécule voisine', 'Une liaison ionique forte', 'Une réaction chimique'], 1, 'Elle est beaucoup plus faible qu’une liaison covalente.'],
            ['Pourquoi la glace flotte-t-elle sur l’eau liquide ?', ['Elle est plus dense', 'Les liaisons hydrogène lui donnent une structure ouverte, moins dense', 'Elle contient de l’air', 'Elle est apolaire'], 1, 'À masse égale, la glace occupe plus de volume que l’eau liquide.'],
            ['À quelle température l’eau pure bout-elle sous pression atmosphérique normale ?', ['0 °C', '37 °C', '100 °C', '273 °C'], 2, 'La fusion a lieu à 0 °C, la vaporisation à 100 °C.'],
            ['Pendant la fusion de la glace pure, la température :', ['Augmente régulièrement', 'Reste constante', 'Diminue', 'Oscille'], 1, 'C’est le palier de changement d’état.'],
            ['Pourquoi le glucose est-il très soluble dans l’eau ?', ['Parce qu’il est apolaire', 'Parce que ses nombreuses fonctions –OH forment des liaisons hydrogène avec l’eau', 'Parce qu’il est plus dense que l’eau', 'Parce qu’il est gazeux'], 1, 'Il est hydrophile.'],
            ['Une huile de densité 0,92 et de l’eau non miscibles sont dans une ampoule à décanter. Où est l’huile ?', ['En bas', 'En haut', 'Mélangée à l’eau', 'Au milieu d’une troisième phase'], 1, 'La phase la moins dense surnage.'],
            ['Dans une micelle de savon, les queues hydrophobes sont tournées :', ['Vers l’eau', 'Vers la gouttelette de graisse', 'Vers l’air', 'Au hasard'], 1, 'Les têtes hydrophiles restent au contact de l’eau et emportent la graisse.'],
            ['Deux liquides miscibles forment deux phases distinctes.', ['Vrai', 'Faux'], 1, 'Miscibles, ils forment un mélange homogène à une seule phase, comme l’eau et l’éthanol.'],
            ['Pourquoi l’évaporation de la sueur refroidit-elle la peau ?', ['La vaporisation est une transformation endothermique qui prélève de la chaleur au corps', 'La sueur est froide', 'La vaporisation dégage de la chaleur', 'La sueur bloque les rayons du Soleil'], 0, 'Pour passer à l’état gazeux, l’eau absorbe de l’énergie prise à la peau.'],
            ['Quel rôle jouent les sels biliaires dans l’intestin ?', ['Ils hydrolysent l’amidon', 'Ils forment des micelles qui dispersent les lipides', 'Ils neutralisent les protéines', 'Ils dissolvent le glucose'], 1, 'Comme le savon, ils ont une partie hydrophile et une partie hydrophobe.'],
          ],
        },
        // ─────────────────────────── THÈME 3 ───────────────────────────
        {
          titre: 'Les besoins énergétiques de l’être humain',
          axe: 'Faire des choix autonomes et responsables',
          lecon: {
            titre: 'Dépense énergétique, chaleur et valeur des aliments',
            cours: `Même au repos, ton corps dépense de l'énergie : pour battre, respirer, maintenir 37 °C. Connaître cette dépense et l'énergie apportée par les aliments, c'est la base d'une alimentation réfléchie.

## Les unités d'énergie
| L'unité | Sa correspondance |
| **Joule** (J) | Unité internationale |
| **Kilojoule** (kJ) | 1 kJ = 1 000 J |
| **Calorie** (cal) | 1 cal ≈ 4,18 J : énergie pour élever de 1 °C la température de 1 g d'eau |
| **Kilocalorie** (kcal) | 1 kcal = 1 000 cal ≈ 4,18 kJ |

Sur les étiquettes, « calorie » désigne en fait la **kilocalorie**.

## La dépense énergétique journalière
La **dépense énergétique journalière** (DEJ) est l'énergie dépensée par l'organisme en 24 h. Elle comprend le **métabolisme de base** (MB, fonctions vitales au repos), la thermorégulation, la digestion et l'**activité physique**.

La **relation de Harris et Benedict** estime le MB (en kcal/jour) à partir de la masse m (kg), de la taille h (cm) et de l'âge a (années). Sous sa forme d'origine :
- homme : MB = 66,5 + 13,75 m + 5,00 h − 6,76 a ;
- femme : MB = 655,1 + 9,56 m + 1,85 h − 4,68 a.

On multiplie ensuite par un **coefficient d'activité** (≈ 1,4 pour une vie sédentaire, jusqu'à 2 pour une activité intense) : DEJ = MB × coefficient. Les coefficients sont toujours donnés dans l'énoncé.

## Les pertes de chaleur du corps
| Le mode | Le principe | Exemple |
| **Conduction** | Contact direct avec un corps plus froid | S'asseoir sur un sol froid |
| **Convection** | Un fluide (air, eau) en mouvement emporte la chaleur | Le vent refroidit la peau |
| **Rayonnement** | Émission d'infrarouges, sans contact | Toute la surface du corps |
| **Évaporation** | La sueur absorbe de la chaleur en se vaporisant | Pendant l'effort |

## Le muscle, convertisseur d'énergie
Un muscle convertit l'**énergie chimique** des nutriments en **énergie mécanique** (le mouvement) et en **chaleur**. Le rendement est faible, de l'ordre de 20 à 25 % : l'essentiel part en chaleur, d'où l'échauffement à l'effort.

> Bilan : énergie chimique consommée = énergie mécanique + chaleur.

Une transformation qui **libère** de la chaleur est **exothermique** (combustion du glucose) ; une transformation qui en **absorbe** est **endothermique** (évaporation de la sueur, fusion de la glace).

## L'énergie apportée par les aliments
| Le nutriment | Énergie par gramme |
| **Glucides** | ≈ 17 kJ (4 kcal) |
| **Protides** | ≈ 17 kJ (4 kcal) |
| **Lipides** | ≈ 38 kJ (9 kcal) |

Exemple : 100 g de pain contiennent 50 g de glucides, 9 g de protides et 1 g de lipides. E = 50 × 17 + 9 × 17 + 1 × 38 = 850 + 153 + 38 ≈ **1 041 kJ**, soit environ 250 kcal.

Au laboratoire, on estime l'énergie d'un aliment en le **brûlant** sous un récipient d'eau et en mesurant l'élévation de température de l'eau.`,
          },
          questions: [
            ['Combien de joules vaut environ 1 calorie ?', ['1 J', '4,18 J', '41,8 J', '1 000 J'], 1, 'Une calorie élève de 1 °C la température de 1 g d’eau, soit environ 4,18 J.'],
            ['Qu’est-ce que le métabolisme de base ?', ['L’énergie dépensée pendant le sport', 'L’énergie nécessaire aux fonctions vitales au repos', 'L’énergie contenue dans un repas', 'La chaleur perdue par la sueur'], 1, 'Il représente la plus grande part de la dépense journalière d’une personne sédentaire.'],
            ['Quel nutriment apporte le plus d’énergie par gramme ?', ['Les glucides', 'Les protides', 'Les lipides', 'Les vitamines'], 2, 'Environ 38 kJ/g, plus du double des glucides et des protides.'],
            ['Le vent qui refroidit la peau illustre un transfert thermique par :', ['Conduction', 'Convection', 'Rayonnement', 'Évaporation seule'], 1, 'L’air en mouvement emporte la chaleur de la surface de la peau.'],
            ['Quelle énergie apportent 20 g de glucides ?', ['85 kJ', '340 kJ', '760 kJ', '20 kJ'], 1, '20 × 17 = 340 kJ.'],
            ['Un muscle en activité convertit l’énergie chimique en :', ['Énergie mécanique uniquement', 'Énergie mécanique et chaleur', 'Énergie électrique uniquement', 'Énergie nucléaire'], 1, 'Le rendement est faible : l’essentiel devient chaleur.'],
            ['La combustion du glucose est une transformation :', ['Endothermique', 'Exothermique', 'Sans effet thermique', 'Physique'], 1, 'Elle libère de l’énergie, que l’organisme utilise.'],
            ['Sur une étiquette alimentaire, le mot « calorie » désigne en fait la kilocalorie.', ['Vrai', 'Faux'], 0, 'Une barre à « 250 calories » apporte 250 kcal, soit environ 1 045 kJ.'],
            ['Comment calcule-t-on la dépense énergétique journalière à partir du métabolisme de base ?', ['DEJ = MB + âge', 'DEJ = MB × coefficient d’activité', 'DEJ = MB / masse', 'DEJ = MB − 1 000'], 1, 'Le coefficient, donné dans l’énoncé, dépend du niveau d’activité physique.'],
            ['Le rayonnement est un transfert de chaleur qui nécessite un contact.', ['Vrai', 'Faux'], 1, 'Le rayonnement infrarouge se fait sans contact ; c’est la conduction qui en exige un.'],
            ['Un aliment apporte 10 g de lipides et 30 g de glucides. Quelle énergie ?', ['890 kJ', '400 kJ', '1 650 kJ', '550 kJ'], 0, '10 × 38 + 30 × 17 = 380 + 510 = 890 kJ.'],
            ['Quelles données la relation de Harris et Benedict utilise-t-elle ?', ['Le pH sanguin et la glycémie', 'La masse, la taille, l’âge et le sexe', 'La tension artérielle', 'La fréquence cardiaque seule'], 1, 'Elle estime le métabolisme de base selon ces caractéristiques de la personne.'],
          ],
        },
        {
          titre: 'Les transformations des glucides dans l’organisme',
          axe: 'Faire des choix autonomes et responsables',
          lecon: {
            titre: 'Combustion, fermentation, hydrolyse et stockage',
            cours: `Le glucose est le carburant principal de nos cellules. L'organisme le tire des glucides complexes, le brûle avec ou sans dioxygène, et en stocke l'excédent. Ces transformations s'écrivent comme des réactions chimiques.

## Glucides simples et complexes
| La catégorie | La définition | Exemples |
| **Glucides simples** (oses) | Non hydrolysables | Glucose, fructose, galactose |
| **Diholosides** | Deux oses liés | Saccharose, lactose |
| **Glucides complexes** (polyosides) | Longues chaînes d'oses | **Amidon** (végétal), **glycogène** (animal) |

L'amidon et le glycogène sont des **polymères** du glucose : de très grandes molécules formées par la répétition d'un même motif.

## L'hydrolyse
Une **hydrolyse** est la coupure d'une molécule par réaction avec l'**eau**.

Hydrolyse du lactose : C₁₂H₂₂O₁₁ + H₂O → C₆H₁₂O₆ (glucose) + C₆H₁₂O₆ (galactose).

Hydrolyse de l'amidon : (C₆H₁₀O₅)ₙ + n H₂O → n C₆H₁₂O₆.

Elle est catalysée soit par un **acide** à chaud (au laboratoire), soit par une **enzyme** (amylase salivaire et pancréatique, lactase intestinale). Une personne qui manque de lactase digère mal le lait : c'est l'**intolérance au lactose**.

> Au laboratoire, l'eau iodée bleuit en présence d'amidon : quand la couleur bleue disparaît, l'hydrolyse est achevée.

## Le stockage : glycogène
Après un repas, le glucose en excès est **condensé en glycogène**, stocké dans le **foie** et les **muscles**. Entre les repas, le glycogène hépatique est hydrolysé et libère du glucose : la **glycémie** reste proche de 1 g/L. Ce contrôle est assuré par l'**insuline** (qui fait baisser la glycémie) et le **glucagon** (qui la fait remonter).

## Brûler le glucose : avec ou sans dioxygène
| La filière | L'équation | Le rendement |
| **Aérobie** (respiration) | C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O | Élevé : toute l'énergie est libérée |
| **Anaérobie** (fermentation lactique) | C₆H₁₂O₆ → 2 C₃H₆O₃ (acide lactique) | Faible, mais rapide et sans O₂ |

La **combustion** est une réaction avec le **dioxygène** qui libère de l'énergie ; complète, elle produit du CO₂ et de l'eau. Dans la cellule, le glucose est d'abord transformé en **acide pyruvique** C₃H₄O₃, qui est ensuite brûlé :

C₃H₄O₃ + 5/2 O₂ → 3 CO₂ + 2 H₂O, soit 2 C₃H₄O₃ + 5 O₂ → 6 CO₂ + 4 H₂O.

## Le sportif
À l'effort, les muscles réclament plus d'énergie : la **consommation de dioxygène** augmente (respiration et cœur s'accélèrent). Si l'apport de O₂ ne suffit plus, la filière anaérobie prend le relais et l'acide lactique s'accumule.

> Les glucides sont la principale source d'énergie rapide ; une consommation responsable privilégie les glucides complexes et limite les sucres ajoutés.`,
          },
          questions: [
            ['Qu’est-ce qu’une réaction d’hydrolyse ?', ['La coupure d’une molécule par réaction avec l’eau', 'La combustion d’une molécule', 'La formation d’eau à partir de H₂ et O₂', 'La dissolution d’un sel'], 0, 'L’hydrolyse du lactose donne du glucose et du galactose.'],
            ['Quelle est l’équation de la respiration (filière aérobie) du glucose ?', ['C₆H₁₂O₆ → 2 C₃H₆O₃', 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O', 'C₆H₁₂O₆ + H₂O → 2 C₃H₆O₃', '6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂'], 1, 'Combustion complète : le glucose est entièrement oxydé en CO₂ et en eau.'],
            ['Que produit la fermentation lactique du glucose ?', ['Du dioxyde de carbone et de l’eau', 'De l’éthanol', 'De l’acide lactique', 'Du glycogène'], 2, 'C₆H₁₂O₆ → 2 C₃H₆O₃, sans dioxygène.'],
            ['L’amidon et le glycogène sont des polymères du glucose.', ['Vrai', 'Faux'], 0, 'Ce sont des glucides complexes, végétal pour l’un, animal pour l’autre.'],
            ['Où le glycogène est-il stocké ?', ['Dans le sang', 'Dans le foie et les muscles', 'Dans les os', 'Dans les reins'], 1, 'Le glycogène du foie sert à maintenir la glycémie entre les repas.'],
            ['Quels sont les produits de l’hydrolyse du lactose ?', ['Deux glucoses', 'Glucose et fructose', 'Glucose et galactose', 'Amidon et eau'], 2, 'C₁₂H₂₂O₁₁ + H₂O → glucose + galactose.'],
            ['Quel réactif permet de suivre l’hydrolyse de l’amidon ?', ['L’eau de chaux', 'L’eau iodée', 'La phénolphtaléine', 'Le nitrate d’argent'], 1, 'Elle bleuit en présence d’amidon ; la couleur disparaît quand tout l’amidon est hydrolysé.'],
            ['Quelle filière libère le plus d’énergie par molécule de glucose ?', ['La filière anaérobie', 'La filière aérobie', 'Les deux libèrent autant', 'Aucune ne libère d’énergie'], 1, 'L’oxydation complète en CO₂ et H₂O libère bien plus d’énergie que la fermentation.'],
            ['Quelle est la formule de l’acide pyruvique ?', ['C₃H₆O₃', 'C₃H₄O₃', 'C₆H₁₂O₆', 'C₂H₆O'], 1, 'C₃H₆O₃ est l’acide lactique ; l’acide pyruvique a deux hydrogènes de moins.'],
            ['Pourquoi la consommation de dioxygène augmente-t-elle chez le sportif ?', ['Pour produire plus d’acide lactique', 'Pour oxyder davantage de nutriments et fournir l’énergie aux muscles', 'Pour stocker du glycogène', 'Pour éliminer l’urée'], 1, 'La filière aérobie exige du dioxygène : respiration et cœur s’accélèrent.'],
            ['Quelle hormone fait baisser la glycémie ?', ['Le glucagon', 'L’insuline', 'L’adrénaline', 'La thyroxine'], 1, 'L’insuline favorise l’entrée du glucose dans les cellules et son stockage en glycogène.'],
            ['Combien de molécules de dioxygène faut-il pour brûler complètement 2 molécules d’acide pyruvique ?', ['2', '3', '5', '6'], 2, '2 C₃H₄O₃ + 5 O₂ → 6 CO₂ + 4 H₂O.'],
          ],
        },
        {
          titre: 'L’eau potable, les sols et les engrais',
          axe: 'Faire des choix autonomes et responsables',
          lecon: {
            titre: 'Gérer de façon responsable les ressources de l’alimentation',
            cours: `Boire de l'eau et manger des végétaux suppose des ressources naturelles en bon état. La chimie permet de contrôler la potabilité de l'eau, de comprendre ce que la plante tire du sol et d'user des engrais et pesticides sans nuire à la santé.

## La potabilité d'une eau
Une eau est **potable** quand elle respecte des limites de qualité fixées par la réglementation : microbiologiques (absence de germes pathogènes) et **chimiques**.

| Le paramètre | Limite de qualité (eau du robinet) |
| **Nitrates** NO₃⁻ | 50 mg/L |
| **Pesticides** (chaque substance) | 0,1 µg/L |
| **Plomb** | 10 µg/L |

L'étiquette d'une eau en bouteille indique sa **composition ionique** : calcium Ca²⁺, magnésium Mg²⁺, sodium Na⁺, potassium K⁺, hydrogénocarbonates HCO₃⁻, sulfates SO₄²⁻, chlorures Cl⁻, nitrates NO₃⁻. Pour interpréter un résultat d'analyse, on le **compare** aux valeurs de référence.

| Le type d'eau | Sa particularité |
| **Eau du robinet** | Traitée, contrôlée en continu |
| **Eau de source** | D'origine souterraine, potable sans traitement chimique lourd |
| **Eau minérale naturelle** | Composition stable, parfois riche en minéraux ; certaines ne conviennent pas à un usage quotidien |

L'eau de boisson apporte une partie des **minéraux** et **oligo-éléments** dont l'organisme a besoin (calcium, magnésium, fluor…). Une eau très riche en sodium est déconseillée en cas d'hypertension.

## Les pollutions de l'eau
| L'origine | Les polluants |
| **Agricole** | Nitrates et phosphates des engrais, pesticides |
| **Domestique** | Eaux usées, détergents, résidus de médicaments |
| **Industrielle** | Métaux lourds, hydrocarbures, solvants |

L'excès de nitrates et de phosphates provoque l'**eutrophisation** : prolifération d'algues, puis manque de dioxygène dans l'eau.

## Le sol, un milieu d'échanges
Le **complexe argilo-humique** (argile + humus) est chargé négativement : il **retient** les cations (K⁺, Ca²⁺, Mg²⁺, NH₄⁺) et les échange avec la solution du sol, où la plante les puise. Les **anions**, comme les nitrates, ne sont pas retenus : ils sont **lessivés** vers les nappes.

## Engrais et pesticides
| L'engrais | Son apport pour la plante |
| **N** (ions nitrate) | Croissance des tiges et des feuilles |
| **P** (ions phosphate) | Développement des racines, floraison |
| **K** (ions potassium) | Formation des fruits, résistance |

| Le pesticide | Sa cible |
| **Insecticide** | Les insectes |
| **Fongicide** | Les champignons |
| **Herbicide** | Les « mauvaises herbes » |

> Bon usage : la juste dose, au bon moment, avec équipement de protection, en respectant les zones non traitées près des cours d'eau.

On dose une espèce colorée dans une eau par **échelle de teinte** : on compare la couleur de l'échantillon à celle de solutions de concentrations connues.

## Nourrir ou faire rouler ?
Une céréale peut devenir aliment ou **biocarburant**. Utiliser des terres pour produire du carburant entre en **compétition** avec l'alimentation humaine : le choix se discute à l'appui des bilans énergétiques.`,
          },
          questions: [
            ['Quelle est la limite de qualité des nitrates dans l’eau du robinet ?', ['0,1 mg/L', '5 mg/L', '50 mg/L', '500 mg/L'], 2, 'Au-delà de 50 mg/L, l’eau n’est pas conforme, en particulier pour les nourrissons et les femmes enceintes.'],
            ['Qu’est-ce que l’eutrophisation ?', ['La purification naturelle d’une rivière', 'La prolifération d’algues due à un excès de nitrates et de phosphates, puis le manque de dioxygène', 'La salinisation des sols', 'L’acidification des pluies'], 1, 'Les algues en excès se décomposent et consomment le dioxygène de l’eau.'],
            ['Pourquoi le complexe argilo-humique retient-il les ions potassium K⁺ ?', ['Parce qu’il est chargé positivement', 'Parce qu’il est chargé négativement et attire les cations', 'Parce qu’il est imperméable', 'Parce que K⁺ est insoluble'], 1, 'Il retient les cations et les échange avec la solution du sol.'],
            ['Les ions nitrate NO₃⁻ sont fortement retenus par le sol.', ['Vrai', 'Faux'], 1, 'Étant des anions, ils ne sont pas retenus par le complexe argilo-humique et sont lessivés vers les nappes.'],
            ['Quel élément d’un engrais NPK favorise surtout la croissance des feuilles ?', ['L’azote N', 'Le phosphore P', 'Le potassium K', 'Le calcium Ca'], 0, 'L’azote, apporté sous forme de nitrates, est essentiel à la croissance végétative.'],
            ['Un fongicide sert à lutter contre :', ['Les insectes', 'Les champignons', 'Les mauvaises herbes', 'Les rongeurs'], 1, 'Du latin fungus, champignon.'],
            ['Comment interpréter le résultat d’analyse d’une eau ?', ['En le comparant aux valeurs de référence réglementaires', 'En regardant sa couleur seulement', 'En mesurant sa température', 'En le comparant à une autre eau au hasard'], 0, 'Chaque paramètre a une limite de qualité à laquelle on compare la valeur mesurée.'],
            ['Quelle est l’origine principale des nitrates en excès dans les nappes ?', ['Les eaux de pluie pures', 'Les engrais agricoles', 'Les roches volcaniques', 'Le chlore de l’eau du robinet'], 1, 'L’apport d’engrais azotés supérieur aux besoins des plantes est lessivé vers les nappes.'],
            ['Quel principe utilise le dosage par échelle de teinte ?', ['Comparer la couleur de l’échantillon à celle de solutions de concentrations connues', 'Mesurer le pH', 'Peser le résidu sec', 'Mesurer la conductivité'], 0, 'L’échantillon a une concentration comprise entre celles des deux solutions qui l’encadrent.'],
            ['Une eau très riche en sodium est déconseillée en cas d’hypertension.', ['Vrai', 'Faux'], 0, 'Le sodium favorise la rétention d’eau et l’élévation de la pression artérielle.'],
            ['Quelle est la limite de qualité pour chaque pesticide dans l’eau du robinet ?', ['0,1 µg/L', '0,1 g/L', '50 mg/L', '1 mg/L'], 0, 'Une limite très basse, par précaution.'],
            ['Quel problème pose la production de biocarburant à partir de céréales ?', ['Elle ne produit aucune énergie', 'Elle entre en compétition avec l’alimentation humaine pour les terres', 'Elle rend l’eau non potable', 'Elle détruit le complexe argilo-humique'], 1, 'Les mêmes surfaces agricoles ne peuvent nourrir et produire du carburant à la fois.'],
          ],
        },
        // ──────────────────────── MESURE ET MÉTHODE ────────────────────────
        {
          titre: 'Mesure, incertitudes et méthode d’évaluation',
          axe: 'Mesure et incertitudes',
          lecon: {
            titre: 'Réussir un exercice de physique-chimie pour la santé',
            cours: `La physique-chimie pour la santé est une spécialité de **première** : tu ne la poursuis pas en terminale, et elle compte au bac par le **contrôle continu** (ta moyenne de l'année). Ses notions reviennent pourtant dans la partie chimie de l'épreuve de chimie, biologie et physiopathologie humaines de terminale. Chaque devoir compte : voici comment les réussir.

## La mesure et son incertitude
Une mesure n'est jamais parfaite. On répète la mesure plusieurs fois, dans les mêmes conditions.

| La grandeur | Ce qu'elle dit |
| **Moyenne** | La meilleure estimation de la valeur |
| **Écart-type** σ | La dispersion des mesures autour de la moyenne |
| **Incertitude-type** u | La « marge » associée au résultat ; pour une série de n mesures, u = σ / √n |

On écrit le résultat sous la forme **valeur ± incertitude, avec l'unité**, l'incertitude étant arrondie à un ou deux chiffres significatifs et la valeur arrondie au même rang. Exemple : pH = 7,32 ± 0,05.

L'**histogramme** des mesures montre leur répartition ; un instrument plus précis ou un protocole plus soigné resserre les valeurs.

## Répondre à une question de calcul
1. **Écrire la relation littérale** (DC = fC × VES) avant tout nombre.
2. **Convertir** dans les bonnes unités (km/h en m/s, mL en L, °C en K, cm en m).
3. **Remplacer** et calculer.
4. **Arrondir** avec un nombre de chiffres significatifs cohérent avec les données (en général le plus petit nombre de chiffres significatifs des données).
5. Donner le résultat **avec son unité**, puis vérifier l'**ordre de grandeur** : un débit cardiaque de 480 L/min est absurde.

## Répondre à une question d'analyse de document
1. Lire la question et **repérer le verbe** : citer, calculer, justifier, expliquer, comparer, conclure.
2. **Prélever** dans le document les données utiles, en les citant (« d'après le document 2, … »).
3. **Mobiliser** une connaissance du cours pour les interpréter.
4. **Conclure** en répondant exactement à la question posée.

## Les pièges classiques
| Le piège | Le bon réflexe |
| Confondre concentration massique et molaire | Regarder l'unité : g/L ou mol/L |
| Oublier la conversion en kelvins dans la loi de Wien | T = θ + 273 |
| Confondre myopie et hypermétropie | Myope : image avant la rétine, verre divergent |
| Écrire une équation non équilibrée | Compter chaque atome de part et d'autre |
| Confondre pression et tension artérielles | La tension est la différence avec la pression atmosphérique |

## Le vocabulaire de la sécurité
Un exercice de chimie se termine souvent par une question de sécurité : cite le **pictogramme**, l'**équipement** (blouse, gants, lunettes) et le **geste** adapté (rinçage abondant, aération, ne jamais mélanger). C'est une question facile à ne pas manquer.`,
          },
          questions: [
            ['Comment la physique-chimie pour la santé est-elle évaluée au bac ST2S ?', ['Par une épreuve écrite de 4 heures en terminale', 'Par le contrôle continu de l’année de première', 'Par un oral en fin de terminale', 'Elle n’est pas évaluée'], 1, 'C’est une spécialité suivie seulement en première : c’est ta moyenne de l’année qui compte.'],
            ['Pour une série de n mesures d’écart-type σ, l’incertitude-type sur la moyenne vaut :', ['σ × n', 'σ / √n', 'σ + n', '√σ / n'], 1, 'Plus on fait de mesures, plus l’incertitude-type sur la moyenne diminue.'],
            ['Que mesure l’écart-type d’une série de mesures ?', ['La valeur vraie', 'La dispersion des mesures autour de la moyenne', 'Le nombre de mesures', 'L’erreur de l’instrument seulement'], 1, 'Plus il est grand, plus les mesures sont dispersées.'],
            ['Quelle est la première étape d’un calcul bien rédigé ?', ['Donner directement le résultat', 'Écrire la relation littérale', 'Arrondir les données', 'Dessiner un schéma'], 1, 'La relation littérale montre la méthode et rapporte des points même en cas d’erreur de calcul.'],
            ['Un élève trouve un débit cardiaque de 480 L/min au repos. Que doit-il faire ?', ['Le garder, c’est normal', 'Vérifier les unités : l’ordre de grandeur est absurde (≈ 5 L/min attendu)', 'L’arrondir à 500 L/min', 'Le multiplier par 60'], 1, 'Le contrôle de l’ordre de grandeur repère les erreurs de conversion.'],
            ['Comment écrire correctement un résultat de mesure ?', ['Valeur seule', 'Valeur ± incertitude, avec l’unité', 'Incertitude seule', 'Valeur avec dix décimales'], 1, 'Exemple : C = 0,152 ± 0,003 mol/L.'],
            ['Face à une question « Justifier », que faut-il faire ?', ['Recopier le document', 'Donner une raison appuyée sur une donnée ou une connaissance', 'Répondre par oui ou non', 'Faire un calcul sans conclusion'], 1, 'Justifier, c’est prouver : un argument, une donnée, une conclusion.'],
            ['Dans la loi de Wien, la température doit être exprimée en :', ['Degrés Celsius', 'Kelvins', 'Degrés Fahrenheit', 'Joules'], 1, 'T = θ + 273 ; oublier la conversion fausse complètement le résultat.'],
            ['Une réponse de calcul sans unité peut être correcte.', ['Vrai', 'Faux'], 1, 'Sans unité, un résultat de physique-chimie n’a pas de sens et perd des points.'],
            ['Combien de chiffres significatifs garde-t-on en général dans un résultat ?', ['Le plus grand nombre de ceux des données', 'Le plus petit nombre de ceux des données', 'Toujours cinq', 'Autant que la calculatrice en affiche'], 1, 'Le résultat ne peut pas être plus précis que la donnée la moins précise.'],
            ['Que montre l’histogramme d’une série de mesures ?', ['La répartition des valeurs mesurées', 'L’équation de la réaction', 'La valeur vraie exacte', 'La date de la mesure'], 0, 'Il permet de visualiser la dispersion et d’en discuter l’origine.'],
            ['Avant de répondre à une question sur un document, il faut d’abord :', ['Repérer le verbe de la consigne et prélever les données utiles', 'Recopier tout le document', 'Répondre de mémoire sans lire le document', 'Chercher la réponse dans un autre exercice'], 0, 'Le verbe dit ce qu’on attend ; les données citées prouvent la réponse.'],
          ],
        },
      ],
    },
  ],
}
