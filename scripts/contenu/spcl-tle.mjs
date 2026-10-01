// Sciences physiques et chimiques en laboratoire (SPCL) — Tle STL. Programme
// officiel : annexe 3 du BO spécial n° 8 du 25 juillet 2019. Une partie
// transversale « Mesure et incertitudes », un projet ouvert sur le monde de la
// recherche ou de l'industrie, et trois thèmes : « Chimie et développement
// durable » (composition des systèmes, synthèses chimiques), « Ondes »
// (ondes mécaniques et électromagnétiques, des ondes pour mesurer, pour
// observer, pour transmettre) et « Systèmes et procédés » (flux
// d'informations, d'énergie et de matière).
//
// Épreuve : note de service du 11 septembre 2026 (BO spécial n° 4 du
// 17 septembre 2026, en vigueur à la session 2027) — partie écrite de 3 h
// (coefficient 7) et partie pratique d'évaluation des compétences
// expérimentales de 3 h (coefficient 9).
//
// Le module de 1re (`spcl-1re.mjs`) a déjà traité la sécurité, la chimie
// verte, la synthèse de base, le contrôle de pureté, les flèches courbes, l'UV
// et l'IR, les dosages par étalonnage, l'image et la régulation tout ou rien :
// ce module-ci ne reprend que ce que la terminale APPROFONDIT.
//
// Matière déjà déclarée (slug `spcl`, 1re et Tle techno) : le bloc de Tle
// part de la position 1. L'axe de chaque fiche est le thème officiel.

export default {
  slug: 'spcl',
  nom: 'Sciences physiques et chimiques en laboratoire',

  titreMigration: 'SCIENCES PHYSIQUES ET CHIMIQUES EN LABORATOIRE Tle STL — LE PROGRAMME OFFICIEL (16 fiches)',

  motif: `Les élèves de terminale STL qui suivent la spécialité sciences physiques et
chimiques en laboratoire (SPCL) n'avaient aucune fiche de terminale. Cette
migration installe 16 fiches qui suivent le programme officiel (BO spécial n° 8
du 25 juillet 2019) : mesure et incertitudes ; chimie et développement durable
(solubilité et conductimétrie, acides et bases, oxydoréduction et électrolyse,
synthèses organiques, RMN, stéréochimie et mécanismes) ; ondes (oscillateurs et
ondes progressives, ondes sonores, ondes électromagnétiques, des ondes pour
mesurer, pour observer et pour transmettre) ; systèmes et procédés (chaîne
d'information et régulation, transferts thermiques, fluides et distillation) ;
et une fiche méthode du projet et de l'épreuve (écrit et ECE, session 2027).`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 1,
      chapitres: [
        // ─────────────────────────── MESURE ET INCERTITUDES
        {
          titre: 'Mesure et incertitudes : sources d’erreurs et incertitude finale',
          axe: 'Mesure et incertitudes',
          lecon: {
            titre: 'Savoir d’où vient l’incertitude',
            cours: `En première, tu as appris à chiffrer la dispersion d’une mesure. En terminale, on va plus loin : on repère **toutes** les sources d’erreurs d’un protocole, on compare leur poids, et on agit sur la plus grosse.

## Rappel : types A et B
| Évaluation | Quand ? | Formule |
| **Type A** | on a répété n mesures | u = s / √n (s : écart-type) |
| **Type B** | une seule mesure, on s’appuie sur l’instrument | u = Δ / √3 pour une tolérance ± Δ |

## Identifier les sources d’erreurs
Dans un titrage, par exemple, l’incertitude sur la concentration finale vient :
- de la **prise d’essai** (tolérance de la pipette jaugée) ;
- du **volume équivalent** (tolérance de la burette, lecture, repérage du virage) ;
- de la **concentration du réactif titrant** (donnée par le fabricant).

## Combiner plusieurs sources
Quand le résultat est un **produit ou un quotient** de grandeurs indépendantes (c = c₁ × V_E / V₀), la relation fournie est en général :
= u(c) / c = √[ (u(c₁)/c₁)² + (u(V_E)/V_E)² + (u(V₀)/V₀)² ]
On additionne des **incertitudes relatives au carré** : c’est la plus grande qui domine.

## Comparer le poids des sources
1. Calcule chaque incertitude relative.
2. Range-les : celle qui est **dix fois plus grande** que les autres fixe presque seule l’incertitude finale.
3. Propose une amélioration ciblée : burette de classe A, prise d’essai plus grande (V_E plus grand, donc erreur relative plus petite), indicateur au virage plus net, suivi pH-métrique.

> Améliorer une source déjà négligeable ne sert à rien : on attaque toujours la source dominante.

## Exprimer et valider le résultat
- L’incertitude-type garde **un ou deux chiffres significatifs**, la valeur est arrondie au même rang.
- On compare à la référence avec z = |x − x_réf| / u(x) : si z ≤ 2, le résultat est compatible.

## Comparer deux protocoles
On trace les **histogrammes** des deux séries (tableur ou programme Python). Une série resserrée est **fidèle** ; une série centrée sur la référence est **juste**.

## Exemple travaillé
Titrage : c₁ = 0,100 mol/L (u = 0,0005), V_E = 12,4 mL (u = 0,05), V₀ = 10,00 mL (u = 0,02).
- Incertitudes relatives : 0,5 % ; 0,40 % ; 0,20 %.
- u(c)/c = √(0,25 + 0,16 + 0,04) × 10⁻² ≈ 0,67 %.
- c = 0,124 mol/L, donc u(c) ≈ 0,0008 mol/L.
- La source dominante est le titrant : c’est lui qu’il faut mieux connaître.

!> Ne jamais additionner directement les incertitudes relatives : on additionne leurs **carrés**, puis on prend la racine.`,
          },
          questions: [
            ['Pour un résultat c = c₁ × V_E / V₀, on combine les incertitudes…', ['En additionnant les incertitudes absolues', 'En additionnant les carrés des incertitudes relatives, puis en prenant la racine', 'En gardant seulement la plus petite', 'En les multipliant entre elles'], 1, 'Pour un produit ou un quotient de grandeurs indépendantes, ce sont les incertitudes relatives au carré qui s’additionnent.'],
            ['Les incertitudes relatives valent 2 %, 0,2 % et 0,1 %. Laquelle faut-il réduire en priorité ?', ['Celle de 0,1 %', 'Celle de 0,2 %', 'Celle de 2 %', 'Aucune, elles se compensent'], 2, 'La source dominante fixe presque seule l’incertitude finale : c’est elle qu’on attaque.'],
            ['Une burette a une tolérance de ± 0,05 mL. Son incertitude-type (type B) vaut environ…', ['0,029 mL', '0,05 mL', '0,10 mL', '0,0029 mL'], 0, 'u = Δ / √3 = 0,05 / 1,73 ≈ 0,029 mL.'],
            ['Augmenter la prise d’essai d’un titrage permet surtout de…', ['Supprimer l’erreur systématique', 'Changer la valeur de la concentration', 'Diminuer l’incertitude relative sur le volume équivalent', 'Rendre la réaction totale'], 2, 'Un volume équivalent plus grand, pour la même erreur absolue de lecture, donne une erreur relative plus petite.'],
            ['Incertitudes relatives de 0,3 % et 0,4 % : l’incertitude relative combinée vaut…', ['0,7 %', '0,5 %', '0,1 %', '0,12 %'], 1, '√(0,09 + 0,16) = √0,25 = 0,5 %.'],
            ['Un histogramme très resserré mais décalé de la référence traduit une série…', ['Juste et fidèle', 'Juste mais peu fidèle', 'Ni juste ni fidèle', 'Fidèle mais peu juste'], 3, 'Peu de dispersion (fidèle), mais un décalage systématique (pas juste).'],
            ['Améliorer une source d’erreur déjà négligeable réduit nettement l’incertitude finale.', ['Vrai', 'Faux'], 1, 'Les carrés des petites contributions pèsent très peu dans la somme : seul le terme dominant compte vraiment.'],
            ['c = 0,0856 mol/L avec u(c) = 0,0012 mol/L. Quelle écriture est correcte ?', ['c = 0,0856 mol/L, u = 0,0012 mol/L', 'c = 0,08560 mol/L, u = 0,001 mol/L', 'c = 0,09 mol/L, u = 0,0012 mol/L', 'c = 0,086 mol/L, u = 0,00123 mol/L'], 0, 'L’incertitude garde deux chiffres significatifs et la valeur est arrondie au même rang décimal.'],
            ['x = 5,32 ; x_réf = 5,20 ; u(x) = 0,04. Le résultat est…', ['Compatible, z = 1,5', 'Incompatible, z = 3', 'Compatible, z = 0,3', 'Impossible à juger'], 1, 'z = 0,12 / 0,04 = 3, supérieur à 2 : on cherche une erreur systématique.'],
            ['Quel outil le programme cite-t-il pour représenter la dispersion d’une série de mesures ?', ['Le diagramme en secteurs', 'La frise chronologique', 'L’histogramme', 'Le diagramme de prédominance'], 2, 'L’histogramme, tracé au tableur ou par un programme, montre la forme et la largeur de la dispersion.'],
            ['Dans un titrage colorimétrique, repérer le virage « un peu tard » est une erreur…', ['Liée à l’opérateur et à la méthode', 'Liée uniquement à l’instrument', 'Impossible à éviter par principe', 'Liée à la valeur de référence'], 0, 'L’œil et le choix de l’indicateur interviennent : un suivi pH-métrique réduit cette source.'],
            ['Pour choisir le matériel adapté à la précision attendue, on privilégie pour prélever 10,00 mL…', ['Une éprouvette graduée', 'Un bécher gradué', 'Une pipette jaugée', 'Une fiole jaugée de 100 mL'], 2, 'La pipette jaugée délivre un volume précis ; l’éprouvette et le bécher sont bien moins précis.'],
          ],
        },

        // ─────────────────────────── CHIMIE ET DÉVELOPPEMENT DURABLE
        {
          titre: 'Solubilité, produit de solubilité et conductimétrie',
          axe: 'Chimie et développement durable',
          lecon: {
            titre: 'Ce qui se dissout, ce qui précipite, ce qui conduit',
            cours: `Un sel ne se dissout jamais « à l’infini » : au-delà d’une limite, il reste du solide au fond. Cette limite se calcule, et la **conductimétrie** permet de la mesurer.

## Quotient de réaction et constante d’équilibre
Pour la dissolution AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq), le quotient de réaction s’écrit (le solide n’y figure pas) :
= Qr = [Ag⁺] × [Cl⁻] (concentrations en mol/L divisées par 1 mol/L)
À l’équilibre, Qr prend une valeur fixe à une température donnée : la **constante de solubilité Ks**. On utilise aussi pKs = − log Ks.

## Sens d’évolution spontanée
| Situation | Conclusion |
| Qr < Ks | la solution n’est **pas saturée** : le solide se dissout encore |
| Qr = Ks | équilibre : solution **saturée** |
| Qr > Ks | il se forme un **précipité** jusqu’à Qr = Ks |

## Solubilité
La solubilité s est la quantité maximale de soluté dissous par litre de solution. Pour AgCl, [Ag⁺] = [Cl⁻] = s, donc Ks = s², soit s = √Ks.
= AgCl : Ks = 1,8 × 10⁻¹⁰ donc s ≈ 1,3 × 10⁻⁵ mol/L
- Un **ion commun** (du Cl⁻ ajouté) diminue la solubilité.
- Les **hydroxydes métalliques** précipitent à des pH différents : on peut séparer des ions en fixant le pH (précipitation sélective).
- En général Ks augmente avec la température : on recristallise en refroidissant une solution chaude saturée.

## Conductivité
Une solution conduit le courant grâce à ses ions. La **conductance** G (en siemens) est mesurée par une cellule ; la **conductivité** σ (S/m) ne dépend que de la solution : σ = k × G, k étant la constante de cellule.

La **loi de Kohlrausch** relie σ aux concentrations des ions :
= σ = Σ λᵢ [Xᵢ] (λ en S·m²/mol, concentrations en mol/m³)
Les ions H₃O⁺ et HO⁻ ont des conductivités molaires ioniques **bien plus grandes** que les autres ions.

## Deux usages au laboratoire
1. **Dosage par étalonnage** : en solution diluée, σ est proportionnelle à la concentration ; on trace σ = f(c) et on lit la concentration inconnue.
2. **Titrage conductimétrique** : on suit σ en fonction du volume versé. La courbe est formée de **segments de droite** ; l’équivalence est au point où la pente change.

## Exemple travaillé : titrage des ions chlorure par Ag⁺
Avant l’équivalence, chaque Cl⁻ qui précipite est remplacé par un NO₃⁻ (apporté avec Ag⁺) de conductivité voisine un peu plus faible : σ diminue légèrement. Après l’équivalence, Ag⁺ et NO₃⁻ s’accumulent : σ augmente nettement. L’intersection des deux droites donne V_E, et c(Cl⁻) × V₀ = c(Ag⁺) × V_E.

!> Dans Kohlrausch, les concentrations sont en **mol/m³** : 1 mol/L = 1 000 mol/m³.`,
          },
          questions: [
            ['Le quotient de réaction de la dissolution de AgCl(s) s’écrit…', ['[AgCl]', '[Ag⁺] × [Cl⁻] / [AgCl]', '[Ag⁺] + [Cl⁻]', '[Ag⁺] × [Cl⁻]'], 3, 'Le solide n’apparaît pas dans le quotient de réaction.'],
            ['Si Qr > Ks, que se passe-t-il ?', ['Le solide se dissout', 'Un précipité se forme', 'Rien, le système est à l’équilibre', 'La température augmente'], 1, 'Le système évolue dans le sens qui fait baisser Qr : les ions précipitent.'],
            ['Pour AgCl, Ks = 1,8 × 10⁻¹⁰. La solubilité vaut environ…', ['1,3 × 10⁻⁵ mol/L', '1,8 × 10⁻¹⁰ mol/L', '9 × 10⁻¹¹ mol/L', '1,3 × 10⁻¹⁰ mol/L'], 0, 's = √Ks ≈ 1,3 × 10⁻⁵ mol/L.'],
            ['Ajouter des ions chlorure à une solution saturée de AgCl…', ['Augmente la solubilité de AgCl', 'Ne change rien', 'Diminue la solubilité de AgCl', 'Dissout tout le précipité'], 2, 'C’est l’effet d’ion commun : Qr dépasse Ks, du AgCl précipite.'],
            ['La constante de cellule k relie…', ['La conductivité σ et la conductance G', 'La concentration et le pH', 'Ks et la température', 'La masse et le volume'], 0, 'σ = k × G : k dépend seulement de la géométrie de la cellule.'],
            ['Dans la loi de Kohlrausch, les concentrations s’expriment en…', ['mol/L', 'g/L', 'mol/m³', 'mol/kg'], 2, 'Avec λ en S·m²/mol, il faut des mol/m³ pour obtenir σ en S/m.'],
            ['Quels ions ont une conductivité molaire ionique exceptionnellement grande ?', ['Na⁺ et Cl⁻', 'H₃O⁺ et HO⁻', 'K⁺ et NO₃⁻', 'Ag⁺ et Cl⁻'], 1, 'Leur mobilité particulière explique les fortes variations de σ lors d’un titrage acide-base.'],
            ['Dans un titrage conductimétrique, l’équivalence se repère…', ['Au changement de pente de la courbe σ = f(V)', 'Au maximum de la courbe de pH', 'Au changement de couleur de la solution', 'Quand σ s’annule'], 0, 'La courbe est faite de segments ; leur intersection donne V_E.'],
            ['Les hydroxydes métalliques précipitant à des pH différents, on peut séparer des ions en réglant le pH.', ['Vrai', 'Faux'], 0, 'C’est la précipitation sélective des hydroxydes, utilisée en traitement des effluents.'],
            ['Pourquoi refroidit-on une solution chaude saturée pour recristalliser un solide ?', ['Parce que Ks augmente en général quand on refroidit', 'Parce que la conductivité augmente', 'Parce que le solide devient un gaz', 'Parce que Ks diminue en général quand la température baisse'], 3, 'La solubilité baisse, le solide dissous en excès cristallise.'],
            ['Pour doser par étalonnage conductimétrique, on travaille en solution diluée car…', ['σ y est proportionnelle à la concentration', 'σ y est nulle', 'Le pH y vaut 7', 'Les ions n’y conduisent plus'], 0, 'La proportionnalité σ = a × c n’est vérifiée qu’aux faibles concentrations.'],
            ['Titrage de 10,0 mL de Cl⁻ par Ag⁺ à 0,050 mol/L : V_E = 12,0 mL. c(Cl⁻) vaut…', ['0,042 mol/L', '0,060 mol/L', '0,050 mol/L', '0,120 mol/L'], 1, 'c = 0,050 × 12,0 / 10,0 = 0,060 mol/L (réaction mole à mole).'],
          ],
        },
        {
          titre: 'Acides, bases et titrages pH-métriques',
          axe: 'Chimie et développement durable',
          lecon: {
            titre: 'Force d’un acide et équivalence',
            cours: `Un acide faible ne se dissocie qu’en partie dans l’eau : sa **constante d’acidité** dit jusqu’où. C’est elle qui explique l’allure d’une courbe de titrage.

## Constante d’acidité
Pour AH + H₂O ⇌ A⁻ + H₃O⁺ :
= Ka = [A⁻] × [H₃O⁺] / [AH] et pKa = − log Ka
- Plus le **pKa est petit**, plus l’acide est **fort**.
- Le **coefficient de dissociation** α = [A⁻] / c est d’autant plus grand que le pKa est petit et que la solution est **diluée**.

## Henderson-Hasselbalch
En passant au logarithme :
= pH = pKa + log ( [A⁻] / [AH] )
| pH | Espèce prédominante |
| pH < pKa | la forme acide AH |
| pH = pKa | [AH] = [A⁻] |
| pH > pKa | la forme basique A⁻ |

Une **solution tampon** (mélange AH/A⁻ en quantités voisines) a un pH proche du pKa et varie peu par ajout modéré d’acide, de base ou par dilution.

## Estimer un pH
| Solution | pH |
| acide fort, concentration c | pH = − log c |
| base forte, concentration c | pH = 14 + log c (à 25 °C) |
| tampon équimolaire | pH ≈ pKa |

## Le titrage pH-métrique
1. On verse la solution titrante et on relève le pH après chaque ajout.
2. L’**équivalence** est atteinte quand les réactifs ont été introduits dans les proportions stœchiométriques : n(titré) initial = n(titrant) versé (réaction mole à mole).
3. On repère V_E au **saut de pH**, par la méthode des tangentes ou au maximum de la dérivée dpH/dV (tableur).
4. Pour un acide faible titré par une base forte, à **la demi-équivalence** pH = pKa : on lit ainsi une valeur approchée du pKa.
5. Un **indicateur coloré** convient si sa zone de virage contient le pH à l’équivalence.

## Titrage direct ou indirect
- **Direct** : le réactif titrant réagit avec l’espèce à doser.
- **Indirect** : on fait réagir l’espèce avec un **excès connu** d’un réactif, puis on titre ce qui reste. La quantité dosée est la **différence**.

## Polyacides
Un diacide (acide phosphorique, acide citrique) présente plusieurs sauts. Le **diagramme de distribution** des espèces aide à savoir quelle réaction a lieu dans chaque zone de la courbe.

## Exemple travaillé
10,0 mL d’acide éthanoïque (pKa = 4,8) titrés par la soude à 0,100 mol/L : V_E = 15,0 mL.
- c(acide) = 0,100 × 15,0 / 10,0 = 0,150 mol/L.
- À 7,5 mL, pH ≈ 4,8.
- Le pH à l’équivalence est basique (≈ 8,7) : on choisit la phénolphtaléine (virage 8,2 – 10), pas l’hélianthine.

!> La demi-équivalence donne le pKa seulement pour un acide faible (ou une base faible) : pour un acide fort, cette lecture n’a pas de sens.`,
          },
          questions: [
            ['Entre deux acides faibles, le plus fort est celui qui a…', ['Le plus grand pKa', 'Le plus petit Ka', 'Le plus petit pKa', 'La plus grande masse molaire'], 2, 'Un petit pKa correspond à un grand Ka : l’acide se dissocie davantage.'],
            ['La relation de Henderson-Hasselbalch s’écrit…', ['pH = pKa + log([A⁻]/[AH])', 'pH = pKa − log([A⁻]/[AH])', 'pH = Ka × [A⁻]', 'pH = − log Ka + [AH]'], 0, 'Elle découle directement de l’expression de Ka.'],
            ['À pH = 6, pour un couple de pKa 4,8, l’espèce prédominante est…', ['La forme acide', 'Aucune des deux', 'Les deux à égalité', 'La forme basique'], 3, 'pH > pKa : c’est la base conjuguée qui prédomine.'],
            ['Le pH d’une solution d’acide chlorhydrique à 1,0 × 10⁻² mol/L vaut…', ['12', '2', '1', '0,01'], 1, 'Acide fort : pH = − log c = 2.'],
            ['Le pH d’une solution de soude à 1,0 × 10⁻³ mol/L vaut (25 °C)…', ['3', '7', '11', '13'], 2, 'Base forte : pH = 14 + log c = 14 − 3 = 11.'],
            ['Diluer une solution d’acide faible fait…', ['Augmenter son coefficient de dissociation', 'Diminuer son coefficient de dissociation', 'Changer son pKa', 'Le transformer en acide fort'], 0, 'Plus l’acide est dilué, plus il se dissocie, même si le pH remonte.'],
            ['À la demi-équivalence du titrage d’un acide faible par une base forte…', ['pH = 7', 'pH = pKa', 'pH = 14', 'pH = 2 × pKa'], 1, 'La moitié de l’acide a été transformée : [AH] = [A⁻], donc pH = pKa.'],
            ['Pour un titrage dont le pH à l’équivalence vaut 8,7, quel indicateur choisir ?', ['Hélianthine (3,1 – 4,4)', 'Bleu de bromothymol (6,0 – 7,6)', 'Rouge de méthyle (4,2 – 6,2)', 'Phénolphtaléine (8,2 – 10)'], 3, 'La zone de virage doit contenir le pH à l’équivalence.'],
            ['Dans un titrage indirect, la quantité de l’espèce dosée est obtenue…', ['Par différence entre l’excès introduit et ce qui reste', 'Directement au volume équivalent', 'Par la lecture du pKa', 'Par la couleur de la solution'], 0, 'On titre le réactif restant, puis on retranche.'],
            ['Une solution tampon voit son pH varier fortement par une dilution modérée.', ['Vrai', 'Faux'], 1, 'Le rapport [A⁻]/[AH] ne change pas à la dilution : le pH reste presque constant.'],
            ['Avec un tableur, le volume équivalent correspond…', ['Au minimum de la courbe pH = f(V)', 'Au point où pH = pKa', 'Au maximum de la dérivée dpH/dV', 'Au premier point de mesure'], 2, 'Le saut de pH est le plus raide à l’équivalence : la dérivée y est maximale.'],
            ['10,0 mL d’acide titrés par la soude à 0,200 mol/L : V_E = 8,0 mL. c(acide) vaut…', ['0,25 mol/L', '0,16 mol/L', '0,080 mol/L', '0,40 mol/L'], 1, 'c = 0,200 × 8,0 / 10,0 = 0,16 mol/L.'],
          ],
        },
        {
          titre: 'Oxydoréduction : relation de Nernst, titrages et électrolyse',
          axe: 'Chimie et développement durable',
          lecon: {
            titre: 'Des électrons qui s’échangent, spontanément ou de force',
            cours: `Une réaction d’oxydoréduction est un échange d’électrons entre deux couples. Les **potentiels** disent dans quel sens elle se fait spontanément ; l’**électrolyse** l’oblige à se faire dans l’autre sens.

## Potentiel d’un couple
On mesure un potentiel par rapport à une électrode de référence ; la référence théorique est l’**électrode standard à hydrogène** (ESH, E = 0 V). Pour un couple Ox + n e⁻ = Red, la **relation de Nernst** donne, à 25 °C :
= E = E° + (0,059 / n) × log ( [Ox] / [Red] )
Plus [Ox] est grand, plus le potentiel du couple est élevé.

## Prévoir le sens d’une réaction
L’oxydant du couple de **plus haut potentiel** réagit avec le réducteur du couple de **plus bas potentiel**. La constante d’équilibre se calcule à partir des potentiels standard :
= log K = n × (E°₁ − E°₂) / 0,059 (E°₁ : couple de l’oxydant qui réagit)
Un écart de 0,3 V ou plus donne une réaction quasi totale.

!> Une réaction thermodynamiquement favorable peut être **bloquée cinétiquement** (trop lente) : l’expérience peut contredire la prévision, par exemple l’eau oxygénée qui ne se décompose presque pas sans catalyseur.

## Titrages rédox
- **Avec changement de couleur** : le permanganate violet devient incolore (Mn²⁺) ; la première goutte en excès colore la solution.
- **Potentiométrique** : on mesure la tension entre une électrode de platine et une électrode de référence ; l’équivalence est au **saut de potentiel**. À la demi-équivalence, E = E° du couple titré (si la référence est l’ESH), ce qui permet de déterminer un potentiel standard.
- **Indirect** : par exemple doser le dioxygène ou l’eau de Javel en libérant du diiode, qu’on titre par le thiosulfate.

## L’électrolyse
Un générateur impose un courant : la transformation **forcée** se fait dans le sens inverse du sens spontané.
| Électrode | Relié au | Réaction |
| **Anode** | pôle + | **oxydation** |
| **Cathode** | pôle − | **réduction** |

Applications : production du dichlore et de la soude, de l’aluminium, dépôt de métal (galvanoplastie), affinage du cuivre à **anode soluble**, recyclage de métaux, production de dihydrogène par électrolyse de l’eau, recharge d’un accumulateur.

## Rendement faradique
= Q = I × Δt et n(e⁻) = Q / F avec F = 96 500 C/mol
Le rendement faradique compare la quantité de produit réellement obtenue à celle que la charge aurait dû produire.

## Exemple travaillé
Dépôt de cuivre (Cu²⁺ + 2 e⁻ → Cu) sous I = 0,50 A pendant 30 min.
- Q = 0,50 × 1 800 = 900 C ; n(e⁻) = 900 / 96 500 ≈ 9,3 × 10⁻³ mol.
- n(Cu) attendu = 4,7 × 10⁻³ mol, soit m ≈ 0,30 g.
- On pèse 0,27 g : rendement faradique ≈ 90 %.`,
          },
          questions: [
            ['Quelle est l’électrode de référence théorique des potentiels standard ?', ['L’électrode au calomel saturé', 'L’électrode de platine seule', 'L’électrode standard à hydrogène', 'L’électrode de verre'], 2, 'Par convention, l’ESH a un potentiel nul.'],
            ['Dans la relation de Nernst, augmenter [Ox] fait…', ['Augmenter le potentiel du couple', 'Diminuer le potentiel du couple', 'Changer E°', 'Ne rien changer'], 0, 'Le terme log([Ox]/[Red]) augmente.'],
            ['Couples Fe³⁺/Fe²⁺ (0,77 V) et Sn⁴⁺/Sn²⁺ (0,15 V). La réaction spontanée a lieu entre…', ['Fe²⁺ et Sn⁴⁺', 'Fe³⁺ et Sn²⁺', 'Fe³⁺ et Sn⁴⁺', 'Fe²⁺ et Sn²⁺'], 1, 'L’oxydant le plus fort (Fe³⁺) réagit avec le réducteur le plus fort (Sn²⁺).'],
            ['Une réaction prévue totale mais qu’on n’observe pas à l’échelle de l’heure est…', ['Impossible', 'Mal équilibrée', 'Endothermique', 'Bloquée cinétiquement'], 3, 'La thermodynamique donne le sens, pas la vitesse : un catalyseur peut débloquer la réaction.'],
            ['Dans un titrage potentiométrique, l’équivalence se repère…', ['Au saut de potentiel', 'Quand la tension s’annule', 'Au premier ajout', 'Quand le pH vaut 7'], 0, 'Le potentiel varie brutalement au voisinage de l’équivalence.'],
            ['Lors d’une électrolyse, l’anode est le siège…', ['D’une réduction', 'D’une oxydation', 'D’une précipitation', 'D’aucune réaction'], 1, 'Anode : oxydation ; cathode : réduction, dans une pile comme dans un électrolyseur.'],
            ['L’anode d’un électrolyseur est reliée…', ['Au pôle − du générateur', 'À la terre', 'Au pôle + du générateur', 'À l’électrode de référence'], 2, 'Le pôle + arrache des électrons à l’anode : c’est là que se fait l’oxydation.'],
            ['Une électrolyse est une transformation…', ['Spontanée', 'Forcée par un générateur', 'Toujours totale', 'Sans échange d’électrons'], 1, 'Elle fait avancer le système dans le sens inverse de son sens spontané.'],
            ['Un courant de 2,0 A circule pendant 965 s. Quelle quantité d’électrons ?', ['0,020 mol', '1 930 mol', '2,0 mol', '0,20 mol'], 0, 'Q = 1 930 C ; n = 1 930 / 96 500 = 0,020 mol.'],
            ['Le rendement faradique compare…', ['La tension appliquée et la tension minimale', 'La masse d’anode et la masse de cathode', 'La quantité de produit obtenue et celle que la charge aurait dû produire', 'Deux potentiels standard'], 2, 'Une partie du courant sert souvent à des réactions parasites (dégagement de dihydrogène).'],
            ['Certaines électrolyses permettent de recycler des métaux.', ['Vrai', 'Faux'], 0, 'L’affinage à anode soluble récupère par exemple un cuivre très pur à partir de cuivre impur.'],
            ['Pour la réaction entre Fe³⁺ (0,77 V) et Sn²⁺ (0,15 V) avec n = 2, log K vaut environ…', ['10', '6', '42', '21'], 3, 'log K = 2 × 0,62 / 0,059 ≈ 21 : la réaction est totale.'],
          ],
        },
        {
          titre: 'Synthèses organiques : esters, amides, rendement et séparations',
          axe: 'Chimie et développement durable',
          lecon: {
            titre: 'Fabriquer plus, plus propre, puis isoler',
            cours: `En première, tu as réalisé une synthèse. En terminale, on la **pilote** : on choisit les réactifs, on déplace l’équilibre, on accélère la réaction et on isole le produit par la technique la mieux adaptée.

## Les transformations au programme
| Transformation | Réactifs | Produit |
| **Estérification** | acide carboxylique + alcool | ester + eau (équilibre, lent) |
| **Hydrolyse d’un ester** | ester + eau (milieu acide) | acide + alcool |
| **Saponification** | ester + ion hydroxyde | ion carboxylate + alcool (totale) |
| **Formation d’un amide** | acide (ou chlorure d’acyle) + amine | amide |
| **Oxydation d’un alcool primaire** | alcool + oxydant | aldéhyde, puis acide carboxylique |
| **Oxydation d’un alcool secondaire** | alcool + oxydant | cétone |
| **Réduction d’une cétone** | cétone + réducteur (NaBH₄) | alcool secondaire |

Un alcool **tertiaire** ne s’oxyde pas dans ces conditions. Une **CCM** permet de voir si l’alcool a été oxydé, et en quoi.

## Améliorer le rendement
= rendement = n(produit obtenu) / n(produit maximal)
Pour une réaction équilibrée comme l’estérification (rendement ≈ 67 % avec des réactifs équimolaires) :
1. Mettre un **réactif en excès** (le moins cher).
2. **Éliminer un produit** au fur et à mesure : le **montage de Dean-Stark** retire l’eau par distillation azéotropique avec le cyclohexane ou le toluène.
3. **Changer de réactif** : un anhydride d’acide à la place de l’acide rend la réaction totale.

## Accélérer
Les **facteurs cinétiques** : élévation de la **température** (chauffage à reflux), **concentration** des réactifs, **catalyseur** (acide sulfurique, acide paratoluènesulfonique, enzymes). Un catalyseur accélère sans changer l’état final.

## Choisir un protocole
On compare rendement, **coût**, **durée**, **énergie** et **déchets** à l’aide des principes de la chimie verte : solvants moins nocifs, catalyse plutôt que réactif en excès, économie d’atomes. Le **procédé sol-gel** fabrique des verres et revêtements à température ambiante.

## Isoler et purifier
- **Extraction liquide-liquide** : solvant non miscible à l’eau, dans lequel le produit est très soluble.
- **Recristallisation** : solvant où le produit est **très soluble à chaud et peu soluble à froid**, les impuretés restant dissoutes.
- **Hydrodistillation** : entraîner à la vapeur d’eau une huile essentielle.
- **Distillation fractionnée** : séparer des liquides miscibles de températures d’ébullition voisines grâce à une colonne (voir la fiche sur les diagrammes binaires).

## Exemple travaillé
0,20 mol d’acide éthanoïque + 0,20 mol d’éthanol : n(ester) maximal = 0,20 mol. On obtient 0,13 mol : rendement 65 %. Avec un Dean-Stark, on peut dépasser 90 %.

!> La saponification n’est pas une hydrolyse équilibrée : l’ion carboxylate formé ne réagit plus avec l’alcool, la transformation est totale.`,
          },
          questions: [
            ['L’estérification entre un acide carboxylique et un alcool est…', ['Rapide et totale', 'Lente et limitée par un équilibre', 'Impossible sans lumière', 'Une oxydation'], 1, 'Elle conduit à un équilibre : environ 67 % avec des réactifs équimolaires.'],
            ['Le montage de Dean-Stark permet…', ['D’éliminer l’eau formée et de déplacer l’équilibre', 'De mesurer le pH', 'De refroidir le milieu', 'D’identifier le produit'], 0, 'L’eau est entraînée et piégée : l’équilibre avance vers l’ester.'],
            ['L’oxydation ménagée d’un alcool secondaire donne…', ['Un aldéhyde', 'Un acide carboxylique', 'Une cétone', 'Un ester'], 2, 'Un alcool primaire donne un aldéhyde puis un acide ; un secondaire donne une cétone.'],
            ['La réduction d’une cétone par NaBH₄ donne…', ['Un alcool primaire', 'Un alcool secondaire', 'Un alcool tertiaire', 'Un acide'], 1, 'Le carbone du groupe carbonyle porte deux chaînes : l’alcool obtenu est secondaire.'],
            ['La saponification d’un ester est…', ['Totale', 'Limitée par un équilibre', 'Une estérification', 'Impossible en milieu basique'], 0, 'L’ion carboxylate formé ne réagit plus : rien ne revient en arrière.'],
            ['Quel changement de réactif rend l’estérification totale ?', ['Remplacer l’alcool par de l’eau', 'Remplacer l’acide par un anhydride d’acide', 'Diluer le milieu', 'Supprimer le catalyseur'], 1, 'L’anhydride est plus réactif et la réaction ne produit pas d’eau.'],
            ['Un catalyseur modifie la valeur du rendement final d’un équilibre.', ['Vrai', 'Faux'], 1, 'Il accélère l’atteinte de l’équilibre sans déplacer celui-ci.'],
            ['Un bon solvant de recristallisation dissout le produit…', ['Peu à chaud, beaucoup à froid', 'Beaucoup à chaud et à froid', 'Pas du tout', 'Beaucoup à chaud, peu à froid'], 3, 'Le produit cristallise au refroidissement, les impuretés restent en solution.'],
            ['0,50 mol d’ester attendu, 0,35 mol obtenu. Le rendement vaut…', ['35 %', '50 %', '70 %', '143 %'], 2, '0,35 / 0,50 = 0,70.'],
            ['Pour extraire une huile essentielle de lavande, on utilise…', ['L’hydrodistillation', 'La saponification', 'Le Dean-Stark', 'Le titrage'], 0, 'La vapeur d’eau entraîne les composés odorants, qu’on récupère après condensation.'],
            ['Un amide se forme en faisant réagir…', ['Un alcool et un aldéhyde', 'Un ester et de l’eau', 'Une cétone et un réducteur', 'Un acide (ou chlorure d’acyle) et une amine'], 3, 'Le groupe caractéristique amide relie un carbonyle et un atome d’azote.'],
            ['Selon la chimie verte, pour comparer deux protocoles, on regarde notamment…', ['Seulement la couleur du produit', 'Les déchets, l’énergie, la toxicité des solvants et le rendement', 'Seulement le prix du flacon', 'La masse de la verrerie'], 1, 'Le meilleur protocole n’est pas toujours celui qui a le plus grand rendement.'],
          ],
        },
        {
          titre: 'Spectroscopie RMN et identification de structures',
          axe: 'Chimie et développement durable',
          lecon: {
            titre: 'Lire les protons d’une molécule',
            cours: `L’UV-visible dit si une molécule absorbe la lumière, l’IR quels groupes elle porte. La **RMN du proton** va plus loin : elle révèle **l’environnement de chaque atome d’hydrogène**, et donc le squelette de la molécule.

## Le principe en une phrase
Placés dans un champ magnétique intense, les noyaux d’hydrogène absorbent une onde radio de fréquence précise, qui dépend de leur **voisinage électronique**. Le spectre montre des **signaux** repérés par leur **déplacement chimique** δ, en ppm, mesuré par rapport à une référence (le TMS, δ = 0).

## Trois informations par signal
| Information | Ce qu’elle dit |
| **Nombre de signaux** | nombre de groupes de protons **équivalents** (même environnement) |
| **Déplacement chimique δ** | la nature du voisinage : un atome électronégatif proche (O, N, halogène) augmente δ |
| **Intégration** (courbe en marches) | nombre **relatif** de protons de chaque groupe |
| **Multiplicité** | nombre de protons voisins |

## Repères de déplacement chimique
= CH₃ d’une chaîne carbonée : 0,9 – 1,3 ppm
= H sur un carbone voisin d’un C=O : 2,0 – 2,7 ppm
= H sur un carbone lié à O (alcool, ester) : 3,3 – 4,3 ppm
= H d’un cycle aromatique : 6,5 – 8 ppm
= H d’aldéhyde : 9 – 10 ppm ; H d’acide carboxylique : 10 – 13 ppm
On utilise toujours une **table fournie** ou une banque de données.

## La règle des (n + 1)
Un groupe de protons ayant **n protons voisins** équivalents (portés par les carbones adjacents) donne un signal à **n + 1 pics** :
| Voisins | Signal |
| 0 | singulet |
| 1 | doublet |
| 2 | triplet |
| 3 | quadruplet |
Les protons portés par O (alcool, acide) donnent souvent un singulet et ne se couplent pas.

## Méthode pour attribuer un spectre
1. Compter les groupes de protons équivalents de la molécule proposée.
2. Associer chaque signal à un groupe grâce à l’intégration.
3. Vérifier la multiplicité avec la règle des (n + 1).
4. Contrôler les déplacements chimiques avec la table.
5. Confirmer avec l’IR (bande C=O vers 1 700 cm⁻¹, bande O–H large vers 3 300 cm⁻¹) et l’UV-visible si besoin.

## Exemple travaillé : l’éthanoate d’éthyle CH₃–CO–O–CH₂–CH₃
- Trois groupes de protons équivalents : trois signaux.
- CH₃ lié au C=O : 3 H, aucun voisin, **singulet** vers 2,0 ppm.
- CH₂ lié à O : 2 H, 3 voisins, **quadruplet** vers 4,1 ppm.
- CH₃ de l’éthyle : 3 H, 2 voisins, **triplet** vers 1,3 ppm.
- Intégration 3 : 2 : 3.

!> L’intégration donne des **proportions**, pas des nombres absolus : un rapport 1 : 1,5 peut signifier 2 H et 3 H.`,
          },
          questions: [
            ['En RMN du proton, le nombre de signaux indique…', ['Le nombre total d’atomes de carbone', 'Le nombre de groupes de protons équivalents', 'La masse molaire', 'Le nombre de liaisons doubles'], 1, 'Des protons de même environnement donnent un seul signal.'],
            ['Un groupe de protons ayant 2 protons voisins donne…', ['Un triplet', 'Un doublet', 'Un singulet', 'Un quadruplet'], 0, 'Règle des (n + 1) : 2 + 1 = 3 pics.'],
            ['La courbe d’intégration renseigne sur…', ['La couleur de la molécule', 'La température de fusion', 'Le nombre relatif de protons de chaque groupe', 'La polarité du solvant'], 2, 'La hauteur de chaque marche est proportionnelle au nombre de protons.'],
            ['Un proton porté par un carbone lié à un atome d’oxygène a un déplacement chimique…', ['Plus petit que celui d’un CH₃ de chaîne', 'Égal à zéro', 'Toujours négatif', 'Plus grand, vers 3,3 – 4,3 ppm'], 3, 'L’oxygène électronégatif « déblinde » le proton : δ augmente.'],
            ['Le signal d’un proton d’aldéhyde se situe vers…', ['9 – 10 ppm', '0,9 ppm', '2 ppm', '5 ppm'], 0, 'C’est l’un des signaux les plus caractéristiques d’un spectre RMN.'],
            ['Combien de signaux donne l’éthanoate d’éthyle CH₃–CO–O–CH₂–CH₃ ?', ['Deux', 'Trois', 'Quatre', 'Huit'], 1, 'Deux CH₃ d’environnements différents et un CH₂.'],
            ['Dans l’éthanoate d’éthyle, le CH₃ lié au C=O donne…', ['Un triplet', 'Un quadruplet', 'Un singulet', 'Un doublet'], 2, 'Le carbone voisin (celui du C=O) ne porte aucun hydrogène.'],
            ['La référence des déplacements chimiques (δ = 0) est…', ['L’eau', 'Le TMS (tétraméthylsilane)', 'Le chloroforme', 'Le benzène'], 1, 'Tous les δ sont mesurés par rapport au signal du TMS.'],
            ['Une intégration 1 : 1,5 peut correspondre à 2 H et 3 H.', ['Vrai', 'Faux'], 0, 'L’intégration donne des rapports ; on les convertit en nombres entiers.'],
            ['Pour confirmer la présence d’un groupe C=O, on utilise surtout…', ['La RMN seule', 'Le pH-mètre', 'La conductimétrie', 'La spectroscopie IR (bande vers 1 700 cm⁻¹)'], 3, 'IR et RMN se complètent : l’une donne les groupes, l’autre le squelette.'],
            ['Le CH₃ de l’éthanol CH₃–CH₂–OH apparaît sous forme de…', ['Singulet', 'Quadruplet', 'Triplet', 'Doublet'], 2, 'Ses voisins sont les 2 H du CH₂ : 2 + 1 = 3 pics.'],
            ['Un signal vers 11 ppm, large et singulet, évoque…', ['Un CH₃ d’alcane', 'Un proton d’acide carboxylique', 'Un proton aromatique', 'Un CH₂ lié à un carbonyle'], 1, 'Le proton de –COOH est très déblindé (10 – 13 ppm).'],
          ],
        },
        {
          titre: 'Stéréochimie et mécanismes réactionnels',
          axe: 'Chimie et développement durable',
          lecon: {
            titre: 'La forme des molécules et le chemin des électrons',
            cours: `Deux molécules peuvent avoir la même formule et les mêmes liaisons, et pourtant ne pas être superposables. Et une réaction ne se fait pas d’un coup : elle passe par des **étapes élémentaires**.

## Stéréoisomères
- Un **carbone asymétrique** porte quatre groupes différents.
- Deux **énantiomères** sont images l’un de l’autre dans un miroir, non superposables. Ils ont les mêmes propriétés physiques usuelles (température d’ébullition, solubilité) mais **dévient la lumière polarisée** en sens opposés, et peuvent avoir des effets biologiques très différents.
- Deux **diastéréoisomères** sont des stéréoisomères qui ne sont pas énantiomères (par exemple les isomères Z et E d’un alcène). Leurs propriétés physiques **diffèrent** : on peut les séparer par distillation, recristallisation, chromatographie, ou les distinguer par leur température de fusion.
- Un **mélange racémique** contient les deux énantiomères en quantités égales : il est optiquement inactif.

## Activité optique et loi de Biot
Une substance chirale en solution fait tourner le plan de polarisation d’une lumière polarisée d’un angle α, mesuré au **polarimètre** :
= α = [α] × ℓ × c (ℓ en dm, c en g/mL, [α] pouvoir rotatoire spécifique)
α est positif (dextrogyre) ou négatif (lévogyre). Les contributions de plusieurs espèces s’additionnent.

## Excès énantiomérique
= ee = | α(mélange) / α(énantiomère pur) | × 100, à même concentration totale
Un racémique a un ee de 0 %, un énantiomère pur de 100 %.

## Mécanismes et intermédiaires
Les **flèches courbes** vont d’un site riche en électrons (doublet, liaison multiple) vers un site pauvre. Les étapes élémentaires peuvent former des **intermédiaires réactionnels** :
| Intermédiaire | Charge | Stabilité |
| **carbocation** | + sur un carbone | tertiaire > secondaire > primaire |
| **carbanion** | − sur un carbone | ordre inverse : primaire > secondaire > tertiaire |
| **radical** | électron célibataire | tertiaire > secondaire > primaire |
L’intermédiaire le plus **stable** se forme le plus facilement : il oriente la nature et la proportion des produits.

## Mésomérie
Quand des électrons sont **délocalisés** (ion carboxylate, benzène), on écrit plusieurs formes de Lewis, les **formes mésomères**, reliées par une flèche à deux pointes. La molécule réelle est un intermédiaire entre elles : cette délocalisation **stabilise** l’espèce.

## Rôle du catalyseur
Un catalyseur intervient dans une étape du mécanisme et est **régénéré** à la fin : il n’apparaît pas dans l’équation-bilan. En catalyse acide, H⁺ active par exemple le groupe carbonyle.

## Exemple travaillé
Une solution d’un énantiomère pur donne α = + 12,0° ; un mélange de même concentration donne α = + 9,0°.
- ee = 9,0 / 12,0 × 100 = 75 %.
- Soit 87,5 % de l’énantiomère dextrogyre et 12,5 % de l’autre.

!> Un racémique n’est pas « sans énantiomère » : il en contient deux, en proportions égales, dont les effets sur la lumière s’annulent.`,
          },
          questions: [
            ['Un carbone asymétrique est lié à…', ['Deux groupes identiques', 'Quatre groupes différents', 'Un atome d’oxygène', 'Une double liaison'], 1, 'C’est la condition la plus fréquente de chiralité d’une molécule.'],
            ['Deux énantiomères ont…', ['Des températures d’ébullition différentes', 'Des formules brutes différentes', 'Les mêmes propriétés physiques usuelles mais des pouvoirs rotatoires opposés', 'Toujours les mêmes effets biologiques'], 2, 'Seules la lumière polarisée et les interactions avec d’autres molécules chirales les distinguent.'],
            ['Un mélange racémique…', ['N’a aucune activité optique', 'Est un seul énantiomère', 'Dévie fortement la lumière', 'Est un diastéréoisomère'], 0, 'Les deux énantiomères en quantités égales compensent leurs déviations.'],
            ['On peut séparer deux diastéréoisomères par distillation ou recristallisation car…', ['Ils sont énantiomères', 'Leurs propriétés physiques diffèrent', 'Ils ont la même température de fusion', 'Ils n’ont pas de carbone'], 1, 'Contrairement aux énantiomères, les diastéréoisomères ont des propriétés physiques distinctes.'],
            ['Dans la loi de Biot α = [α] × ℓ × c, ℓ s’exprime en…', ['mètres', 'centimètres', 'nanomètres', 'décimètres'], 3, 'Par convention historique, la longueur de la cuve est en dm.'],
            ['α(pur) = − 20° et α(mélange) = − 5° à même concentration. L’excès énantiomérique vaut…', ['25 %', '75 %', '5 %', '400 %'], 0, 'ee = 5 / 20 × 100 = 25 %.'],
            ['Le carbocation le plus stable est…', ['Primaire', 'Méthyle', 'Tertiaire', 'Ils sont tous aussi stables'], 2, 'Les groupes alkyle voisins stabilisent la charge positive.'],
            ['Pour les carbanions, l’ordre de stabilité est le même que pour les carbocations.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : un carbanion primaire est plus stable qu’un tertiaire.'],
            ['Une flèche courbe part…', ['D’un site riche en électrons vers un site pauvre', 'D’un site pauvre vers un site riche', 'D’un atome d’hydrogène vers le solvant', 'Du produit vers le réactif'], 0, 'Elle représente le déplacement d’un doublet d’électrons.'],
            ['Les formes mésomères d’un ion carboxylate…', ['Sont deux molécules différentes en équilibre', 'Décrivent la délocalisation des électrons sur les deux oxygènes', 'N’existent que dans le vide', 'Sont des énantiomères'], 1, 'La structure réelle est intermédiaire ; la délocalisation stabilise l’ion.'],
            ['Un catalyseur…', ['Est consommé par la réaction', 'Apparaît dans l’équation-bilan', 'Déplace l’équilibre', 'Est régénéré à la fin du mécanisme'], 3, 'Il intervient dans une étape puis est restitué.'],
            ['Les isomères Z et E d’un alcène sont des…', ['Énantiomères', 'Isomères de constitution', 'Diastéréoisomères', 'Formes mésomères'], 2, 'Ils ne sont pas images l’un de l’autre dans un miroir.'],
          ],
        },

        // ─────────────────────────── ONDES
        {
          titre: 'Oscillateurs, résonance et ondes progressives',
          axe: 'Ondes',
          lecon: {
            titre: 'Du mouvement qui se répète à celui qui se propage',
            cours: `Une masse au bout d’un ressort, un circuit électrique, une corde de guitare : tous **oscillent**. Et quand une vibration se transmet de proche en proche, elle devient une **onde**.

## Les oscillateurs
| Oscillateur | Période propre |
| masse-ressort | T₀ = 2π √(m / k) |
| circuit LC | T₀ = 2π √(L × C) |
Les deux obéissent au même modèle : c’est l’**analogie** mécanique-électrique (masse ↔ inductance, raideur ↔ inverse de la capacité).
- En **régime libre non amorti**, l’énergie passe d’une forme à l’autre (cinétique ↔ potentielle, magnétique ↔ électrique) et l’énergie totale se conserve.
- Avec des frottements ou une résistance, l’amplitude décroît : **régime pseudopériodique**, caractérisé par sa pseudo-période et un **temps caractéristique d’amortissement**.
- Une **oscillation auto-entretenue** (horloge, oscillateur à quartz) compense les pertes : elle sert de source de signal.

## Oscillations forcées et résonance
Un excitateur impose sa fréquence f à l’oscillateur. L’amplitude devient **maximale** quand f est proche de la fréquence propre f₀ : c’est la **résonance**.
= Facteur de qualité : Q = f₀ / Δf (Δf : largeur de la bande passante)
Un oscillateur peu amorti a une résonance **aiguë** (Q grand).

## Les ondes progressives
Une onde transporte de l’**énergie** sans transport de matière. Un point du milieu reproduit le mouvement de la source avec un **retard** τ = d / v.

Pour une onde **sinusoïdale** :
= λ = v × T = v / f
- La **période** T est la périodicité **dans le temps**.
- La **longueur d’onde** λ est la périodicité **dans l’espace**.
- La puissance transportée est proportionnelle au **carré de l’amplitude**.

Une onde périodique non sinusoïdale est la **somme** d’un fondamental (fréquence f) et d’**harmoniques** (2f, 3f…) : c’est ce que montre son **spectre**. La composante de fréquence nulle traduit une valeur moyenne non nulle.

## La diffraction
Une onde qui rencontre une ouverture ou un obstacle de taille a comparable à λ **s’étale**. Le demi-angle de la tache centrale vaut, pour une fente :
= θ ≈ λ / a (θ en radians)
Plus l’ouverture est petite, plus la diffraction est marquée. Le phénomène vaut pour le son, la houle et la lumière.

## Exemple travaillé
Un émetteur ultrasonore de 40 kHz dans l’air (v = 340 m/s) : λ = 340 / 40 000 = 8,5 mm. Deux récepteurs distants de 17 mm sur la même ligne reçoivent des signaux **en phase** (écart de 2 λ).

!> La fréquence d’une onde est fixée par la **source** ; c’est la longueur d’onde qui change quand l’onde passe dans un autre milieu.`,
          },
          questions: [
            ['La période propre d’un oscillateur masse-ressort vaut…', ['T₀ = 2π √(k / m)', 'T₀ = 2π √(m / k)', 'T₀ = m × k', 'T₀ = 2π m / k'], 1, 'Plus la masse est grande, plus l’oscillation est lente.'],
            ['Dans un circuit LC idéal, l’énergie…', ['Disparaît à chaque période', 'Passe de l’inductance au condensateur et se conserve', 'Ne dépend que de la résistance', 'Est toujours nulle'], 1, 'Sans résistance, l’énergie oscille entre forme magnétique et forme électrique.'],
            ['La résonance se produit quand la fréquence imposée est…', ['Très inférieure à f₀', 'Nulle', 'Proche de la fréquence propre f₀', 'Le double de f₀'], 2, 'L’amplitude est alors maximale.'],
            ['Un oscillateur très peu amorti a…', ['Un facteur de qualité élevé et une résonance aiguë', 'Un facteur de qualité nul', 'Une résonance très large', 'Aucune résonance'], 0, 'Q = f₀ / Δf : une bande passante étroite donne un Q grand.'],
            ['Une onde mécanique progressive transporte…', ['De la matière', 'De l’énergie sans transport de matière', 'Des électrons', 'Seulement de la chaleur'], 1, 'Chaque point du milieu oscille autour de sa position d’équilibre.'],
            ['Une onde de 500 Hz se propage à 340 m/s. Sa longueur d’onde vaut…', ['0,68 m', '1,47 m', '170 000 m', '0,068 m'], 0, 'λ = v / f = 340 / 500 = 0,68 m.'],
            ['La longueur d’onde est une périodicité…', ['Temporelle', 'Énergétique', 'Spatiale', 'Électrique'], 2, 'La période T est la périodicité temporelle.'],
            ['Si l’amplitude d’une onde double, la puissance transportée est…', ['Divisée par 2', 'Multipliée par 2', 'Inchangée', 'Multipliée par 4'], 3, 'Elle est proportionnelle au carré de l’amplitude.'],
            ['Le spectre d’un signal périodique de fréquence 200 Hz contient des raies à…', ['200, 400, 600 Hz…', '200 Hz seulement', '100, 300, 500 Hz', '0 Hz seulement'], 0, 'Le fondamental et ses harmoniques, multiples entiers de 200 Hz.'],
            ['La diffraction est d’autant plus marquée que l’ouverture est…', ['Grande devant λ', 'Petite, de l’ordre de λ', 'Opaque', 'Colorée'], 1, 'θ ≈ λ / a : quand a diminue, θ augmente.'],
            ['Quand une onde passe de l’air à l’eau, sa fréquence change.', ['Vrai', 'Faux'], 1, 'La fréquence est imposée par la source ; la célérité et donc λ changent.'],
            ['Un point situé à 6,8 m d’une source sonore (340 m/s) reproduit son mouvement avec un retard de…', ['2,0 s', '0,20 s', '0,020 s', '50 s'], 2, 'τ = d / v = 6,8 / 340 = 0,020 s.'],
          ],
        },
        {
          titre: 'Ondes sonores et ondes stationnaires',
          axe: 'Ondes',
          lecon: {
            titre: 'Pourquoi une corde chante sa note',
            cours: `Le son est une onde **mécanique longitudinale** : une succession de compressions et de dilatations du milieu. Il ne se propage pas dans le vide.

## Propagation et célérité
= v(air, 20 °C) ≈ 340 m/s ; v(eau) ≈ 1 500 m/s ; v(acier) ≈ 5 000 m/s
Le son va plus vite dans les liquides et les solides que dans les gaz.

## Caractériser un son
| Caractéristique | Grandeur physique |
| **hauteur** (grave / aigu) | fréquence du fondamental |
| **timbre** | composition en harmoniques (le spectre) |
| **intensité perçue** | niveau d’intensité sonore L |

= L = 10 × log ( I / I₀ ) avec I₀ = 1,0 × 10⁻¹² W/m², L en décibels (dB)
Doubler l’intensité ajoute **3 dB** ; la multiplier par 10 ajoute **10 dB**. Au-delà de 85 dB, une exposition prolongée abîme l’oreille.

## Ondes stationnaires
Quand une onde se réfléchit aux deux extrémités d’un milieu borné (corde fixée, colonne d’air), l’onde incidente et l’onde réfléchie se superposent : on obtient une **onde stationnaire**. Certains points ne bougent jamais (**nœuds**), d’autres vibrent au maximum (**ventres**). Deux nœuds consécutifs sont distants de **λ / 2**.

## Modes propres d’une corde fixée à ses deux bouts
Les deux extrémités sont des nœuds : la corde contient un nombre entier de fuseaux.
= L = n × λ / 2 donc fₙ = n × v / (2L)
n = 1 est le **fondamental**, n = 2, 3… les **harmoniques**. La célérité v dépend de la **tension** de la corde et de sa **masse linéique** : tendre la corde rend le son plus aigu.

## Modes propres d’une colonne d’air
| Colonne | Extrémités | Fréquences propres |
| ouverte aux deux bouts | deux ventres | fₙ = n × v / (2L) |
| fermée à un bout | un nœud (fermé), un ventre (ouvert) | fₙ = (2n − 1) × v / (4L) |
Un tuyau fermé à un bout ne produit que les harmoniques **impairs**, et son fondamental est **une octave plus grave** qu’un tuyau ouvert de même longueur.

## Exemple travaillé
Une corde de guitare de 65 cm émet un la à 110 Hz.
- λ₁ = 2L = 1,30 m.
- v = λ₁ × f₁ = 1,30 × 110 = 143 m/s.
- Le deuxième harmonique a pour fréquence 220 Hz.

!> Les décibels ne s’additionnent pas : deux sources de 60 dB donnent 63 dB, pas 120 dB.`,
          },
          questions: [
            ['Le son se propage dans le vide.', ['Vrai', 'Faux'], 1, 'Onde mécanique, il lui faut un milieu matériel.'],
            ['La hauteur d’un son est liée à…', ['L’amplitude du signal', 'La fréquence du fondamental', 'La célérité', 'Le nombre d’harmoniques'], 1, 'Un son aigu a une fréquence fondamentale élevée.'],
            ['Deux instruments jouent la même note mais sonnent différemment : ils diffèrent par…', ['La hauteur', 'La fréquence du fondamental', 'Le timbre', 'La célérité du son'], 2, 'Le timbre dépend de la composition en harmoniques.'],
            ['Une intensité sonore de 1,0 × 10⁻⁶ W/m² correspond à un niveau de…', ['60 dB', '6 dB', '120 dB', '-60 dB'], 0, 'L = 10 log(10⁻⁶ / 10⁻¹²) = 10 × 6 = 60 dB.'],
            ['Doubler l’intensité sonore augmente le niveau de…', ['2 dB', '10 dB', '6 dB', '3 dB'], 3, '10 log 2 ≈ 3 dB.'],
            ['Dans une onde stationnaire, deux nœuds consécutifs sont distants de…', ['λ / 2', 'λ', '2λ', 'λ / 4'], 0, 'Un fuseau mesure une demi-longueur d’onde.'],
            ['Pour une corde fixée aux deux bouts, les fréquences propres sont…', ['fₙ = n × v / (4L)', 'fₙ = n × v / (2L)', 'fₙ = v / (nL)', 'fₙ = 2nL / v'], 1, 'La corde doit contenir un nombre entier de demi-longueurs d’onde.'],
            ['Tendre davantage une corde de guitare rend le son…', ['Plus grave', 'Plus fort seulement', 'Plus aigu', 'Inchangé'], 2, 'La célérité augmente avec la tension, donc la fréquence aussi.'],
            ['Un tuyau fermé à une extrémité ne produit que…', ['Les harmoniques impairs', 'Les harmoniques pairs', 'Le fondamental', 'Des infrasons'], 0, 'fₙ = (2n − 1) × v / (4L) : f₁, 3f₁, 5f₁…'],
            ['Une flûte ouverte de 0,34 m (v = 340 m/s) a un fondamental de…', ['1 000 Hz', '250 Hz', '2 000 Hz', '500 Hz'], 3, 'f₁ = v / (2L) = 340 / 0,68 = 500 Hz.'],
            ['Dans quel milieu le son est-il le plus rapide ?', ['L’air', 'L’acier', 'L’eau', 'Le vide'], 1, 'Environ 5 000 m/s dans l’acier contre 340 m/s dans l’air.'],
            ['Deux sources de 70 dB fonctionnant ensemble donnent environ…', ['140 dB', '70 dB', '73 dB', '35 dB'], 2, 'Les intensités s’ajoutent (intensité doublée) : + 3 dB.'],
          ],
        },
        {
          titre: 'Ondes électromagnétiques, lumière et transmission de l’information',
          axe: 'Ondes',
          lecon: {
            titre: 'Une même famille, des ondes radio aux rayons X',
            cours: `Lumière visible, ondes radio, rayons X : ce sont toutes des **ondes électromagnétiques**. Elles se propagent **même dans le vide**, à la vitesse de la lumière, et servent à éclairer, à chauffer, à soigner et à transmettre.

## Le spectre électromagnétique
= c = 3,00 × 10⁸ m/s dans le vide ; λ = c / f
| Domaine | Longueur d’onde (ordre de grandeur) |
| ondes radio | plus de 1 mm |
| infrarouge | 800 nm à 1 mm |
| visible | 400 nm (violet) à 800 nm (rouge) |
| ultraviolet | 10 nm à 400 nm |
| rayons X et gamma | moins de 10 nm |
Dans un milieu transparent, la lumière va moins vite : v = c / n, n étant l’**indice** du milieu.

## Onde et photon
La lumière se décrit aussi comme un flux de **photons**, d’énergie :
= E = h × f = h × c / λ avec h = 6,63 × 10⁻³⁴ J·s
Plus λ est courte, plus le photon est énergétique : les UV et les X peuvent **ioniser** la matière vivante, d’où des **seuils d’exposition** réglementaires.

## Sources de lumière
- **Rayonnement thermique** : un corps chaud émet un spectre continu dont le maximum suit la loi de Wien : λ_max × T = 2,90 × 10⁻³ m·K. Plus il est chaud, plus il « bleuit ».
- **Lampes** (LED, fluorescentes) : caractérisées par leur **flux lumineux** (lumen), leur **efficacité lumineuse** (lm/W) et leur **température de couleur**.
- **Laser** : lumière monochromatique, directive, cohérente, concentrant une grande puissance sur une petite surface. Protection des yeux obligatoire.

## Grandeurs énergétiques et photométriques
| Grandeur énergétique | Grandeur photométrique |
| puissance (W) | flux lumineux (lm) |
| éclairement (W/m²) | éclairement lumineux (lux) |
Les grandeurs photométriques tiennent compte de la **sensibilité de l’œil**, maximale dans le vert (555 nm).

## Transmettre l’information
Une chaîne de transmission : **émetteur → canal → récepteur**. Le canal peut être :
- **libre** (ondes hertziennes, Wi-Fi) : la puissance reçue diminue avec la distance, plusieurs signaux partagent l’espace grâce à des **fréquences porteuses** différentes ;
- **guidé** par un câble (ligne bifilaire, câble coaxial) ou une **fibre optique** (voir la fiche sur les chaînes d’information).
= Atténuation : A (dB) = 10 × log ( P_entrée / P_sortie )
Le **débit binaire** (bit/s) mesure la quantité d’information transmise par seconde.

## Stocker et afficher
- Un disque optique (CD, DVD, Blu-ray) se lit par **interférences** : entre un creux et un plat, la différence de chemin de λ/2 éteint le faisceau réfléchi. Une longueur d’onde plus courte (laser bleu) permet des creux plus petits, donc plus de données.
- Un **afficheur à cristaux liquides** module la lumière grâce à deux **polariseurs** croisés et à des molécules qui font, ou non, tourner la polarisation.

## Exemple travaillé
Une fibre de 20 km perd 0,2 dB/km : A = 4 dB. P_sortie = P_entrée / 10^0,4 ≈ 0,40 × P_entrée.

!> Le rayonnement d’un corps ne dépend que de sa **température**, pas de sa couleur apparente à la lumière du jour.`,
          },
          questions: [
            ['Les ondes électromagnétiques se propagent dans le vide à…', ['340 m/s', '3,00 × 10⁵ m/s', '3,00 × 10⁸ m/s', '1 500 m/s'], 2, 'C’est la célérité de la lumière dans le vide.'],
            ['Quel domaine a les longueurs d’onde les plus courtes ?', ['Les rayons X', 'L’infrarouge', 'Les ondes radio', 'Le visible'], 0, 'Moins de 10 nm, avec des photons très énergétiques.'],
            ['L’énergie d’un photon est…', ['Proportionnelle à λ', 'Inversement proportionnelle à λ', 'Indépendante de la fréquence', 'Toujours égale à 1 eV'], 1, 'E = h × c / λ : plus λ est courte, plus E est grande.'],
            ['Dans un milieu d’indice n = 1,5, la lumière se propage à…', ['4,5 × 10⁸ m/s', '3,0 × 10⁸ m/s', '1,5 × 10⁸ m/s', '2,0 × 10⁸ m/s'], 3, 'v = c / n = 3,0 × 10⁸ / 1,5.'],
            ['Selon la loi de Wien, un corps plus chaud émet un maximum…', ['À plus courte longueur d’onde', 'À plus grande longueur d’onde', 'Au même endroit', 'Seulement dans l’infrarouge'], 0, 'λ_max × T = constante : T augmente, λ_max diminue.'],
            ['L’unité du flux lumineux est…', ['Le lux', 'Le watt', 'Le lumen', 'Le décibel'], 2, 'Le lux mesure l’éclairement lumineux (lumen par m²).'],
            ['Les grandeurs photométriques tiennent compte de la sensibilité de l’œil humain.', ['Vrai', 'Faux'], 0, 'L’œil est surtout sensible vers 555 nm.'],
            ['Une lumière laser est notamment…', ['Polychromatique et diffuse', 'Monochromatique et directive', 'Invisible par nature', 'Émise par tout corps chaud'], 1, 'Elle concentre beaucoup de puissance : danger pour la rétine.'],
            ['Plusieurs radios partagent le même espace grâce à…', ['Des fréquences porteuses différentes', 'Des câbles différents', 'Des longueurs de fibre différentes', 'Des lasers'], 0, 'Chaque station module une porteuse de fréquence propre.'],
            ['Une ligne atténue de 10 dB. La puissance de sortie vaut…', ['La moitié de la puissance d’entrée', 'Le dixième de la puissance d’entrée', 'Dix fois la puissance d’entrée', 'La puissance d’entrée moins 10 W'], 1, '10 dB correspond à un rapport de puissance de 10.'],
            ['Pourquoi un Blu-ray stocke-t-il plus qu’un CD ?', ['Son disque est plus lourd', 'Il tourne moins vite', 'Il utilise un laser de plus grande longueur d’onde', 'Son laser de plus courte longueur d’onde permet des creux plus petits'], 3, 'La tache de focalisation est plus petite quand λ diminue.'],
            ['Un afficheur à cristaux liquides fonctionne grâce…', ['À la radioactivité', 'À la polarisation de la lumière', 'À l’effet Doppler', 'À la résonance acoustique'], 1, 'Deux polariseurs croisés et des cristaux qui font tourner, ou non, la polarisation.'],
          ],
        },
        {
          titre: 'Des ondes pour mesurer : réfraction, polarisation, interférences, Doppler',
          axe: 'Ondes',
          lecon: {
            titre: 'Mesurer un indice, une concentration, une vitesse',
            cours: `Au laboratoire, les ondes sont des **instruments de mesure**. Une déviation donne un indice, une rotation une concentration, des franges une longueur d’onde, un décalage de fréquence une vitesse.

## Réfraction et réflexion totale
= Loi de Snell-Descartes : n₁ × sin i₁ = n₂ × sin i₂
En passant dans un milieu **plus réfringent** (n₂ > n₁), le rayon se rapproche de la normale. Dans le sens inverse, au-delà d’un **angle limite** tel que sin i_lim = n₂ / n₁, il n’y a plus de rayon réfracté : c’est la **réflexion totale**, principe de la fibre optique. Le **réfractomètre** mesure un indice, par exemple la teneur en sucre d’un jus.

## Polarisation et polarimétrie
La lumière naturelle vibre dans toutes les directions. Un **polariseur** ne laisse passer qu’une direction : la lumière est **polarisée rectilignement**. Un second filtre, l’**analyseur**, l’éteint quand il est croisé à 90°.
Une solution d’espèce chirale fait **tourner** la direction de polarisation (loi de Biot, voir la fiche de stéréochimie). En mesurant l’angle, on détermine une **concentration** (dosage du saccharose).

## Diffraction pour mesurer une taille
= θ ≈ λ / a (fente ou fil de largeur a)
En mesurant la largeur de la tache centrale sur un écran, on en déduit a : c’est ainsi qu’on mesure le diamètre d’un cheveu au laser.

## Interférences à deux ondes
Deux ondes **synchrones** (même fréquence, déphasage constant) se superposent. Tout dépend du **retard** τ de l’une sur l’autre, ou de la différence de chemin δ :
| Condition | Résultat |
| δ = k × λ (k entier) | interférences **constructives** : amplitude maximale |
| δ = (k + 1/2) × λ | interférences **destructives** : amplitude minimale |
Des franges régulières permettent de mesurer une longueur d’onde.

## Réseau
Un réseau est une surface portant un très grand nombre de traits parallèles de **pas** a. Il disperse la lumière :
= sin θ = k × λ / a
On l’utilise dans les spectrophotomètres, et pour mesurer λ ou le pas d’un réseau.

## Effet Doppler
Quand la source et le récepteur se rapprochent, la fréquence reçue est **plus grande** que la fréquence émise ; quand ils s’éloignent, elle est **plus petite**. Pour une vitesse v faible devant la célérité c de l’onde :
= Δf ≈ f × v / c
Applications : radar de vitesse, sonde Doppler qui mesure la vitesse du sang (le décalage est alors doublé, l’onde étant réfléchie par les globules rouges en mouvement).

## Exemple travaillé
Un laser de 650 nm éclaire un cheveu ; la tache centrale mesure 4,0 cm sur un écran à 2,0 m.
- θ ≈ (4,0 / 2) / 200 = 0,010 rad.
- a = λ / θ = 650 × 10⁻⁹ / 0,010 = 65 µm.

!> Les angles des formules de diffraction s’utilisent en **radians** ; ceux de Snell-Descartes se mesurent par rapport à la **normale**, pas à la surface.`,
          },
          questions: [
            ['La loi de Snell-Descartes pour la réfraction s’écrit…', ['n₁ × sin i₁ = n₂ × sin i₂', 'n₁ × i₂ = n₂ × i₁', 'sin i₁ = sin i₂', 'n₁ + n₂ = i₁ + i₂'], 0, 'Les angles sont mesurés par rapport à la normale.'],
            ['La réflexion totale est possible quand la lumière passe…', ['D’un milieu peu réfringent vers un milieu plus réfringent', 'D’un milieu plus réfringent vers un milieu moins réfringent', 'Dans le vide seulement', 'À incidence normale'], 1, 'Par exemple du verre vers l’air, au-delà de l’angle limite.'],
            ['Verre (n = 1,50) vers air (n = 1,00) : sin i_lim vaut…', ['1,50', '0,50', '0,67', '1,00'], 2, 'sin i_lim = 1,00 / 1,50 ≈ 0,67, soit environ 42°.'],
            ['Deux polariseurs croisés à 90°…', ['Laissent passer toute la lumière', 'Doublent l’intensité', 'Changent la couleur', 'Éteignent la lumière'], 3, 'L’analyseur bloque la direction transmise par le polariseur.'],
            ['La polarimétrie permet de doser…', ['Une espèce chirale comme le saccharose', 'Un gaz noble', 'Les ions chlorure', 'Le pH'], 0, 'L’angle de rotation est proportionnel à la concentration (loi de Biot).'],
            ['Deux ondes interfèrent de façon constructive quand leur différence de chemin vaut…', ['λ / 2', 'Un nombre entier de λ', '3λ / 2', 'λ / 4'], 1, 'Les deux ondes arrivent alors en phase.'],
            ['Pour observer des interférences stables, les deux ondes doivent être…', ['De fréquences différentes', 'Synchrones (même fréquence, déphasage constant)', 'D’amplitudes nulles', 'Perpendiculaires'], 1, 'Sinon la figure bouge trop vite pour être observée.'],
            ['Si l’on diminue la largeur d’une fente, la tache centrale de diffraction…', ['S’élargit', 'Rétrécit', 'Disparaît', 'Change de couleur'], 0, 'θ ≈ λ / a augmente quand a diminue.'],
            ['Une ambulance s’approche : la fréquence perçue est…', ['Plus basse que la fréquence émise', 'Égale à la fréquence émise', 'Nulle', 'Plus haute que la fréquence émise'], 3, 'Les fronts d’onde se resserrent devant la source.'],
            ['Un réseau de pas a éclairé en lumière monochromatique donne des maxima tels que…', ['sin θ = k × λ / a', 'θ = a × λ', 'sin θ = a / λ', 'θ = k × a'], 0, 'C’est la relation du réseau, utile pour mesurer λ.'],
            ['La mesure de la vitesse du sang par ultrasons repose sur…', ['La réfraction', 'L’effet Doppler', 'La loi de Wien', 'La réflexion totale'], 1, 'Les globules rouges en mouvement décalent la fréquence de l’écho.'],
            ['Un réfractomètre permet de mesurer la teneur en sucre d’un jus de fruit.', ['Vrai', 'Faux'], 0, 'L’indice de réfraction augmente avec la concentration en sucre.'],
          ],
        },
        {
          titre: 'Des ondes pour observer : échographie, microscope, lunette, télescope',
          axe: 'Ondes',
          lecon: {
            titre: 'Voir plus petit, plus loin, à l’intérieur',
            cours: `Chaque instrument d’observation répond à une question : voir **à l’intérieur** du corps, voir **plus petit**, voir **plus loin**. Tous sont limités par leur **résolution**, c’est-à-dire la plus petite distance ou le plus petit angle qu’ils séparent.

## L’échographie
Une sonde émet des **ultrasons** (1 à 20 MHz) ; à chaque changement de milieu (interface), une partie de l’onde est **réfléchie**, le reste est transmis ou absorbé. En mesurant la durée Δt de l’aller-retour :
= d = v × Δt / 2 (v ≈ 1 540 m/s dans les tissus mous)
Une fréquence plus élevée donne une meilleure **résolution** mais une onde plus vite **absorbée** : on explore moins profondément. Le gel supprime l’air entre la sonde et la peau, sinon presque toute l’onde serait réfléchie.

## Rappels d’optique
Une lentille convergente de distance focale f’ vérifie la relation de conjugaison vue en première : 1/OA’ − 1/OA = 1/f’. Le **diamètre apparent** α d’un objet est l’angle sous lequel on le voit ; l’œil ne distingue pas deux points séparés de moins d’environ 3 × 10⁻⁴ rad.
= Grossissement : G = α’ / α (angle avec l’instrument / angle à l’œil nu)

## La loupe
Une lentille convergente, l’objet placé entre le foyer et la lentille. Son grossissement commercial est défini pour une vision à 25 cm :
= G_c = 0,25 / f’ (f’ en mètres)

## Le microscope
Deux lentilles convergentes : l’**objectif** (très courte focale) donne une image réelle agrandie, que l’**oculaire** observe comme une loupe.
= G_c(microscope) = |γ_objectif| × G_c(oculaire)
Un objectif ×40 avec un oculaire ×10 donne un grossissement de 400. La **résolution** est limitée par la **diffraction** : elle s’améliore quand l’**ouverture numérique** de l’objectif augmente ou que λ diminue. Au-delà, le **microscope à force atomique** « tâte » la surface avec une pointe et voit des détails atomiques.

## La lunette astronomique
Objectif de grande focale f’₁, oculaire de courte focale f’₂, foyers confondus : le système est **afocal** (objet et image à l’infini).
= G = f’₁ / f’₂
Un objectif de grand diamètre D collecte plus de lumière (luminosité) et résout mieux : θ_min ≈ 1,22 × λ / D.

## Le télescope
Il remplace l’objectif par un **miroir sphérique (ou parabolique) convergent**. Un miroir plan renvoie l’image sur le côté (montage de Newton). Avantages : pas d’aberration chromatique, et un grand miroir est plus facile à fabriquer qu’une grande lentille.

## Exemple travaillé
Écho reçu 65 µs après l’émission dans un tissu mou : d = 1 540 × 65 × 10⁻⁶ / 2 ≈ 5,0 cm.

!> Dans d = v × Δt / 2, oublier le « / 2 » double la profondeur : l’onde fait un **aller et un retour**.`,
          },
          questions: [
            ['En échographie, la profondeur d’une interface vaut…', ['v × Δt', 'v × Δt / 2', 'v / Δt', '2 × v × Δt'], 1, 'L’onde parcourt deux fois la distance : aller et retour.'],
            ['Pourquoi met-on du gel entre la sonde et la peau ?', ['Pour refroidir la peau', 'Pour colorer l’image', 'Pour éviter la couche d’air qui réfléchirait presque toute l’onde', 'Pour augmenter la fréquence'], 2, 'L’interface air/peau renverrait l’essentiel des ultrasons.'],
            ['Augmenter la fréquence des ultrasons…', ['Améliore la résolution mais réduit la profondeur explorée', 'Réduit la résolution', 'Augmente la profondeur explorée', 'Ne change rien'], 0, 'Les hautes fréquences sont plus vite absorbées par les tissus.'],
            ['Une loupe de focale 5,0 cm a un grossissement commercial de…', ['2', '20', '0,2', '5'], 3, 'G_c = 0,25 / 0,050 = 5.'],
            ['Objectif ×40 et oculaire ×10 : le grossissement du microscope vaut…', ['50', '4', '400', '30'], 2, 'On multiplie le grandissement de l’objectif par le grossissement de l’oculaire.'],
            ['La résolution d’un microscope optique est limitée par…', ['La diffraction', 'La couleur du statif', 'La réflexion totale', 'L’effet Doppler'], 0, 'Elle s’améliore avec une grande ouverture numérique et une petite longueur d’onde.'],
            ['Une lunette astronomique réglée à l’infini est un système…', ['Divergent', 'Afocal', 'Sans lentille', 'À miroir plan seul'], 1, 'Les foyers de l’objectif et de l’oculaire sont confondus.'],
            ['Objectif f’₁ = 90 cm, oculaire f’₂ = 1,5 cm : le grossissement de la lunette vaut…', ['135', '1,5', '91,5', '60'], 3, 'G = f’₁ / f’₂ = 90 / 1,5 = 60.'],
            ['Un objectif de grand diamètre améliore la luminosité et la résolution d’une lunette.', ['Vrai', 'Faux'], 0, 'Il collecte plus de lumière et diffracte moins (θ_min ≈ 1,22 λ / D).'],
            ['L’objectif d’un télescope est…', ['Une lentille divergente', 'Un miroir concave convergent', 'Un prisme', 'Un réseau'], 1, 'Un miroir plan secondaire renvoie ensuite l’image vers l’oculaire.'],
            ['Quel instrument permet d’observer le relief d’une surface à l’échelle atomique ?', ['La loupe', 'La lunette astronomique', 'Le microscope à force atomique', 'L’échographe'], 2, 'Une pointe très fine balaie la surface et suit son relief.'],
            ['Un écho revient 130 µs après l’émission dans un tissu (1 540 m/s). L’interface est à environ…', ['20 cm', '10 cm', '5 cm', '2,5 cm'], 1, 'd = 1 540 × 130 × 10⁻⁶ / 2 ≈ 0,10 m.'],
          ],
        },

        // ─────────────────────────── SYSTÈMES ET PROCÉDÉS
        {
          titre: 'Chaîne d’information, moteur pas à pas et régulation continue',
          axe: 'Systèmes et procédés',
          lecon: {
            titre: 'Mesurer, transmettre, corriger',
            cours: `Un système industriel se lit en trois flux : **matière**, **énergie** et **information**. Cette fiche suit l’information, du capteur jusqu’à la commande qui corrige le procédé.

## La chaîne d’information
~ Grandeur physique → capteur → conditionneur → filtre et amplificateur → convertisseur analogique-numérique → microcontrôleur
- Le **capteur** traduit la grandeur (température, pression, lumière) en signal électrique ; le **conditionneur** le rend exploitable (tension proportionnelle).
- Un **filtre** garde les fréquences utiles et élimine le bruit : passe-bas, passe-haut, passe-bande. Son comportement se résume par son gain et sa **bande passante**, souvent imposés par un **gabarit**.
= Gain en décibels : G = 20 × log ( U_sortie / U_entrée )
La **fréquence de coupure** correspond à une chute de 3 dB par rapport au gain maximal.
- Le **CAN** transforme la tension en nombre sur n bits :
= Résolution (quantum) : q = plage de tension / 2ⁿ
Un CAN 10 bits sur 0 – 5 V distingue des écarts de 5 / 1 024 ≈ 4,9 mV.

## Transmettre par fibre optique
La lumière est guidée par **réflexions totales** entre le cœur (indice n₁) et la gaine (n₂ < n₁).
= Ouverture numérique : ON = sin θ_max = √(n₁² − n₂²)
Dans une fibre à saut d’indice, les rayons de trajets différents arrivent décalés : l’impulsion **s’élargit** (dispersion), ce qui limite le **débit** maximal. La fibre résiste aux perturbations électromagnétiques et atténue peu.

## Contrôler une position : le moteur pas à pas
Des **bobines** parcourues par un courant créent un **champ magnétique** qui oriente un rotor aimanté. En alimentant les bobines dans un ordre précis (commande par microcontrôleur), le rotor tourne d’un **angle fixe à chaque impulsion** :
= angle par pas = 360° / nombre de pas par tour
On positionne ainsi sans capteur une platine, un objectif d’autofocus, une seringue de pousse-seringue.

## La boucle de régulation
~ Consigne → comparateur (écart) → correcteur → actionneur → procédé → capteur → retour au comparateur
Une **perturbation** (porte ouverte, débit qui change) écarte la grandeur réglée de la consigne ; la boucle la ramène.

## Régulation tout ou rien ou continue
| Régulation | Principe | Défaut |
| **TOR** (vue en 1re) | l’actionneur est à 0 % ou 100 % | oscillations autour de la consigne |
| **proportionnelle (P)** | action proportionnelle à l’écart, gain K | un **écart statique** subsiste |
| **proportionnelle intégrale (PI)** | la partie intégrale accumule l’écart | réponse parfois plus lente ou plus oscillante |

## Critères de performance
Après un échelon de consigne ou de perturbation, on mesure :
1. l’**écart statique** (différence finale consigne – mesure) ;
2. le **temps de réponse à 5 %** (temps pour rester à moins de 5 % de la variation totale autour de la valeur finale) ;
3. le **premier dépassement**.
Augmenter K en correction P **réduit l’écart statique** mais augmente le dépassement, jusqu’à rendre le système instable. La correction **PI annule l’écart statique**.

## Exemple travaillé
Consigne 60 °C, correction P : l’eau se stabilise à 57 °C. Écart statique = 3 °C. En doublant K, il devient environ 1,5 °C, avec un dépassement plus grand ; en ajoutant l’action intégrale, la température finit à 60 °C.

!> Une correction proportionnelle seule ne peut pas ramener exactement à la consigne : s’il n’y avait plus d’écart, il n’y aurait plus d’action.`,
          },
          questions: [
            ['Dans une chaîne d’information, le CAN sert à…', ['Chauffer le capteur', 'Amplifier le courant d’un moteur', 'Convertir une tension en nombre', 'Filtrer la lumière'], 2, 'Le microcontrôleur ne traite que des nombres.'],
            ['Un CAN 8 bits sur 0 – 5,12 V a une résolution de…', ['20 mV', '5,12 mV', '0,64 V', '2 mV'], 0, 'q = 5,12 / 256 = 0,020 V.'],
            ['La fréquence de coupure d’un filtre correspond à…', ['Un gain nul', 'Une chute de 3 dB par rapport au gain maximal', 'Un gain de + 20 dB', 'La fréquence du secteur'], 1, 'C’est la borne de la bande passante.'],
            ['Un filtre qui élimine un bruit haute fréquence et garde un signal lent est un…', ['Passe-haut', 'Passe-bande étroit centré sur le bruit', 'Amplificateur', 'Passe-bas'], 3, 'Il laisse passer les basses fréquences.'],
            ['Dans une fibre optique, la lumière est guidée par…', ['Diffraction', 'Réflexions totales à l’interface cœur-gaine', 'Absorption', 'Effet Doppler'], 1, 'Le cœur est plus réfringent que la gaine.'],
            ['L’élargissement des impulsions dans une fibre à saut d’indice limite…', ['Le débit maximal', 'La couleur de la fibre', 'Le diamètre de la gaine', 'La tension du capteur'], 0, 'Deux impulsions trop proches finiraient par se chevaucher.'],
            ['Un moteur de 200 pas par tour tourne, à chaque pas, de…', ['2°', '0,5°', '1,8°', '200°'], 2, '360 / 200 = 1,8°.'],
            ['Dans une boucle de régulation, le comparateur calcule…', ['La puissance du moteur', 'L’écart entre la consigne et la mesure', 'La perturbation', 'Le débit binaire'], 1, 'Le correcteur agit à partir de cet écart.'],
            ['Avec une correction proportionnelle seule, il subsiste en général un écart statique.', ['Vrai', 'Faux'], 0, 'L’action étant proportionnelle à l’écart, un écart est nécessaire pour maintenir l’action.'],
            ['Quelle correction annule l’écart statique ?', ['La correction TOR', 'La correction P avec un petit gain', 'L’absence de correction', 'La correction PI'], 3, 'L’action intégrale accumule l’écart tant qu’il n’est pas nul.'],
            ['Augmenter fortement le gain K d’une correction P…', ['Supprime tout dépassement', 'Réduit l’écart statique mais peut rendre le système instable', 'Augmente l’écart statique', 'Ne change rien'], 1, 'Le système devient plus nerveux et oscille.'],
            ['Le temps de réponse à 5 % est le temps au bout duquel la grandeur…', ['Reste autour de sa valeur finale, à ± 5 % de sa variation totale', 'Atteint 5 % de la consigne', 'Dépasse la consigne de 5 %', 'Commence à varier'], 0, 'C’est un critère de rapidité de la régulation.'],
          ],
        },
        {
          titre: 'Transferts thermiques, échangeurs et pompes à chaleur',
          axe: 'Systèmes et procédés',
          lecon: {
            titre: 'Faire circuler la chaleur là où on la veut',
            cours: `Chauffer un bâtiment, refroidir un réacteur, pasteuriser du lait : l’industrie passe son temps à **déplacer de l’énergie thermique**. Il faut savoir comment elle passe, combien il en passe, et à quel coût.

## Trois modes de transfert
| Mode | Support | Exemple |
| **conduction** | de proche en proche dans la matière, sans déplacement | une paroi de four |
| **convection** | par déplacement d’un fluide | un radiateur qui chauffe l’air |
| **rayonnement** | par ondes électromagnétiques, même dans le vide | le Soleil, une braise |
Le transfert se fait **spontanément** du corps chaud vers le corps froid.

## Résistance thermique
Le flux thermique Φ (puissance, en W) à travers une paroi dépend de l’écart de température :
= Φ = (T_chaude − T_froide) / R_th et R_th = e / (λ × S)
e est l’épaisseur, S la surface, λ la **conductivité thermique** du matériau (W·m⁻¹·K⁻¹). Un isolant a un λ faible. Pour une paroi faite de **plusieurs couches**, les résistances **s’additionnent**.

## Les échangeurs thermiques
Deux fluides séparés par une paroi échangent de l’énergie. En régime stationnaire, le flux cédé par le fluide chaud est reçu par le fluide froid :
= Φ = q_m × c × ΔT (q_m débit massique en kg/s, c capacité thermique massique)
| Circulation | Particularité |
| **co-courant** | les deux fluides vont dans le même sens |
| **contre-courant** | sens opposés : l’écart de température reste plus régulier, l’échange est plus efficace |
Le dimensionnement utilise un **écart de température moyen** (relation fournie) et la surface d’échange.

## La chaudière
Elle transfère à l’eau l’énergie libérée par une combustion. Le **pouvoir calorifique** PC d’un combustible est l’énergie libérée par kilogramme (ou par m³) brûlé :
= masse de combustible = énergie à fournir / PC
Si l’eau change d’état (production de vapeur), il faut ajouter l’énergie de vaporisation q_m × L.

## Pompes à chaleur et machines frigorifiques
Pour faire passer de l’énergie du **froid vers le chaud** (sens non spontané), il faut fournir un **travail** W (le compresseur). Un fluide frigorigène circule en boucle : il s’**évapore** côté froid (il y prélève Q_f), est **comprimé** (sa température monte), se **condense** côté chaud (il y cède Q_c), puis est **détendu** (sa température baisse).
- **Premier principe** (conservation) : Q_c = W + Q_f (en valeurs positives).
- **Second principe** : un transfert thermique spontané du froid vers le chaud est impossible.
= COP pompe à chaleur = Q_c / W ; COP machine frigorifique = Q_f / W
Un COP de 3 signifie qu’on récupère 3 kWh de chaleur pour 1 kWh électrique consommé.

## Exemple travaillé
Un échangeur chauffe 0,50 kg/s d’eau de 15 °C à 55 °C (c = 4 180 J·kg⁻¹·K⁻¹).
- Φ = 0,50 × 4 180 × 40 ≈ 84 kW.
- Avec une pompe à chaleur de COP 4, il faut W = 84 / 4 = 21 kW électriques.

!> Le COP d’une pompe à chaleur est **supérieur à 1** sans rien violer : elle ne crée pas d’énergie, elle en **déplace** depuis l’extérieur.`,
          },
          questions: [
            ['Le transfert thermique par déplacement d’un fluide s’appelle…', ['La conduction', 'La convection', 'Le rayonnement', 'La résistance'], 1, 'Le fluide chauffé se déplace et emporte l’énergie.'],
            ['Quel mode de transfert peut se faire dans le vide ?', ['Le rayonnement', 'La conduction', 'La convection', 'Aucun'], 0, 'Il passe par des ondes électromagnétiques.'],
            ['La résistance thermique d’une paroi vaut…', ['λ × S / e', 'e × λ × S', 'e / (λ × S)', 'S / (e × λ)'], 2, 'Plus la paroi est épaisse et isolante, plus R_th est grande.'],
            ['Pour une paroi à plusieurs couches, les résistances thermiques…', ['Se multiplient', 'S’additionnent', 'S’annulent', 'Se soustraient'], 1, 'Les couches sont traversées l’une après l’autre, comme des résistances en série.'],
            ['Φ = 400 W à travers une paroi de résistance 0,050 K/W. L’écart de température vaut…', ['8 000 K', '0,000125 K', '400 K', '20 K'], 3, 'ΔT = Φ × R_th = 400 × 0,050 = 20 K.'],
            ['Un échangeur à contre-courant est en général…', ['Plus efficace qu’un co-courant', 'Moins efficace qu’un co-courant', 'Impossible à construire', 'Sans paroi'], 0, 'L’écart de température entre les fluides reste plus régulier sur toute la longueur.'],
            ['Le pouvoir calorifique d’un combustible est…', ['Sa température de flamme', 'L’énergie libérée par unité de masse ou de volume brûlé', 'Sa masse volumique', 'Son prix au litre'], 1, 'Il permet de calculer la masse de combustible nécessaire.'],
            ['Dans une pompe à chaleur, le premier principe s’écrit…', ['Q_c = W − Q_f', 'W = Q_c + Q_f', 'Q_c = W + Q_f', 'Q_f = Q_c + W'], 2, 'L’énergie cédée côté chaud vient du travail et de la source froide.'],
            ['Un transfert thermique spontané du froid vers le chaud est possible.', ['Vrai', 'Faux'], 1, 'C’est ce qu’interdit le second principe : il faut fournir un travail.'],
            ['Une pompe à chaleur cède 12 kWh pour 3 kWh électriques. Son COP vaut…', ['0,25', '36', '9', '4'], 3, 'COP = Q_c / W = 12 / 3 = 4.'],
            ['Dans le circuit d’une machine frigorifique, le fluide prélève de l’énergie côté froid en…', ['S’évaporant', 'Se condensant', 'Étant comprimé', 'Se solidifiant'], 0, 'L’évaporation absorbe de l’énergie.'],
            ['Chauffer 0,20 kg/s d’eau de 20 °C (c = 4 180 J·kg⁻¹·K⁻¹) demande 42 kW. L’eau sort à environ…', ['70 °C', '50 °C', '30 °C', '100 °C'], 0, 'ΔT = 42 000 / (0,20 × 4 180) ≈ 50 K.'],
          ],
        },
        {
          titre: 'Écoulements, théorème de Bernoulli et distillation fractionnée',
          axe: 'Systèmes et procédés',
          lecon: {
            titre: 'Faire circuler les fluides, séparer les liquides',
            cours: `Dans une usine, la matière voyage dans des tuyaux, poussée par des pompes, puis elle est séparée dans des colonnes. Cette fiche donne les outils pour décrire ces **flux de matière**.

## Débit et vitesse
= Débit volumique : Q_v = S × v (m³/s) ; débit massique : q_m = ρ × Q_v
Pour un écoulement permanent d’un liquide incompressible, le débit se **conserve** : S₁ × v₁ = S₂ × v₂. Là où le tuyau se rétrécit, le fluide **accélère**.

## Pression et statique des fluides
= p = F / S (pascal ; 1 bar = 10⁵ Pa)
Le **principe fondamental de la statique des fluides** relie la pression à la profondeur :
= p_B − p_A = ρ × g × (z_A − z_B)
Plus on descend, plus la pression augmente : 10 m d’eau ajoutent environ 1 bar. C’est ainsi qu’un capteur de pression au fond d’une cuve mesure la **hauteur de liquide**.

## Le théorème de Bernoulli
Pour un fluide parfait, incompressible, en écoulement permanent, le long d’une ligne de courant :
= p + ½ × ρ × v² + ρ × g × z = constante
C’est une forme de **conservation de l’énergie** (par unité de volume). Dans une installation réelle, on ajoute :
- l’énergie apportée par une **pompe** ;
- les **pertes de charge**, qui augmentent avec la longueur du tuyau, la vitesse, et les **singularités** (coudes, vannes, rétrécissements), et diminuent quand le diamètre augmente.

## La pompe
= Puissance hydraulique (utile) : P_h = Q_v × Δp ; rendement : η = P_h / P_absorbée
La pompe doit compenser la différence de hauteur, la différence de pression et les pertes de charge.

## Diagrammes binaires liquide-vapeur
Pour un mélange de deux liquides A et B, on repère la composition par la **fraction molaire** x_A = n_A / (n_A + n_B) (ou la fraction massique).
Le diagramme isobare porte deux courbes :
| Courbe | Signification |
| **courbe d’ébullition** (du bas) | apparition de la première bulle quand on chauffe le liquide |
| **courbe de rosée** (du haut) | apparition de la première goutte quand on refroidit la vapeur |
Entre les deux, liquide et vapeur coexistent ; la vapeur est **plus riche en constituant le plus volatil**. Si les deux courbes se touchent en un point, ce mélange est un **azéotrope** : il bout à température constante sans changer de composition.

## La distillation fractionnée
Dans la colonne, la vapeur monte et le liquide redescend : chaque plateau réalise un nouvel équilibre liquide-vapeur. En **tête** de colonne, on recueille le constituant le plus volatil (ou l’azéotrope) ; dans le **bouilleur** reste le moins volatil. Le **reflux** (renvoyer une partie du distillat dans la colonne) améliore la séparation. Pour isoler un solide dissous, on utilise plutôt l’**évaporation** puis la **cristallisation**, en exploitant la solubilité.

## Exemple travaillé
Un tuyau de 2,0 cm² où l’eau circule à 1,5 m/s rétrécit à 0,50 cm² : v₂ = 1,5 × 2,0 / 0,50 = 6,0 m/s. Le débit reste 3,0 × 10⁻⁴ m³/s, soit 18 L/min.

!> Un azéotrope ne peut pas être séparé par une simple distillation fractionnée : c’est lui qui sort en tête, avec sa composition fixe (eau-éthanol à 95,6 % en masse d’éthanol).`,
          },
          questions: [
            ['Le débit volumique s’exprime par…', ['Q_v = S / v', 'Q_v = S × v', 'Q_v = ρ × v', 'Q_v = p × S'], 1, 'Section multipliée par vitesse moyenne, en m³/s.'],
            ['Quand un tuyau se rétrécit, la vitesse d’un liquide incompressible…', ['Augmente', 'Diminue', 'Reste la même', 'S’annule'], 0, 'S₁ × v₁ = S₂ × v₂ : une section plus petite impose une vitesse plus grande.'],
            ['À 10 m sous la surface de l’eau, la pression dépasse celle de la surface d’environ…', ['10 bar', '0,1 bar', '100 bar', '1 bar'], 3, 'ρ × g × h = 1 000 × 9,8 × 10 ≈ 10⁵ Pa = 1 bar.'],
            ['Le théorème de Bernoulli traduit…', ['La conservation de la masse seulement', 'La conservation de l’énergie le long d’une ligne de courant', 'La loi de Kohlrausch', 'L’effet Doppler'], 1, 'Pression, énergie cinétique et énergie de pesanteur se compensent.'],
            ['Les pertes de charge augmentent quand…', ['Le diamètre du tuyau augmente', 'Le tuyau est plus court', 'On ajoute des coudes et des vannes', 'Le débit diminue'], 2, 'Chaque singularité dissipe de l’énergie.'],
            ['Une pompe fournit Δp = 2,0 × 10⁵ Pa pour Q_v = 1,0 × 10⁻³ m³/s. Sa puissance hydraulique vaut…', ['200 W', '2,0 kW', '20 W', '2,0 × 10⁸ W'], 0, 'P_h = Q_v × Δp = 1,0 × 10⁻³ × 2,0 × 10⁵ = 200 W.'],
            ['La courbe d’ébullition d’un diagramme binaire indique…', ['L’apparition de la première goutte', 'La fin de la distillation', 'L’apparition de la première bulle de vapeur', 'La pression atmosphérique'], 2, 'La courbe de rosée, elle, marque l’apparition de la première goutte.'],
            ['La vapeur en équilibre avec un mélange liquide est plus riche en…', ['Constituant le moins volatil', 'Constituant le plus volatil', 'Eau, toujours', 'Aucun des deux'], 1, 'C’est ce qui rend la séparation par distillation possible.'],
            ['Un azéotrope se sépare facilement par distillation fractionnée.', ['Vrai', 'Faux'], 1, 'Il bout sans changer de composition : il sort tel quel en tête de colonne.'],
            ['Dans une distillation fractionnée, le reflux sert à…', ['Refroidir le bouilleur', 'Accélérer le chauffage', 'Supprimer la colonne', 'Améliorer la séparation'], 3, 'Renvoyer du distillat multiplie les équilibres liquide-vapeur dans la colonne.'],
            ['2 mol d’éthanol et 3 mol d’eau : la fraction molaire en éthanol vaut…', ['0,40', '0,67', '0,60', '2'], 0, 'x = 2 / (2 + 3) = 0,40.'],
            ['Un capteur de pression au fond d’une cuve permet de mesurer…', ['La température', 'La hauteur de liquide', 'La conductivité', 'Le pH'], 1, 'La pression hydrostatique est proportionnelle à la hauteur de liquide.'],
          ],
        },

        // ─────────────────────────── PROJET ET ÉPREUVE
        {
          titre: 'Le projet et l’épreuve de SPCL : écrit et ECE',
          axe: 'Mener un projet ouvert sur le monde de la recherche ou de l’industrie',
          lecon: {
            titre: 'Préparer le projet, l’écrit et la pratique',
            cours: `La spécialité SPCL pèse lourd au bac STL : **coefficient 16**, partagé entre une partie écrite et une partie pratique. Et le projet de l’année peut nourrir ton Grand oral. Voici comment tout s’articule, d’après la note de service du 11 septembre 2026 (en vigueur à la session 2027).

## Le projet de l’année
- Un **projet d’équipe unique**, mené par **2 à 4 élèves** sur la durée (une quarantaine d’heures conseillée), à partir d’une problématique, parfois d’un cahier des charges.
- Il s’ouvre sur la recherche ou l’industrie : visites, rencontres de techniciens, ingénieurs, chercheurs.
- Étapes : s’approprier la problématique, chercher de la documentation, proposer une stratégie, **planifier**, expérimenter, analyser, **adapter**, rédiger, présenter à l’oral.
- Il est évalué pendant l’année et peut servir de **support au Grand oral** et à l’enseignement technologique en langue vivante (ETLV).

## La partie écrite
| Élément | Ce qu’il faut savoir |
| Durée | **3 heures** |
| Note | sur 20, **coefficient 7** |
| Maîtrise de la langue | **2 points sur 20** : orthographe, syntaxe, vocabulaire juste, raisonnement bien formulé |
| Structure | **3 ou 4 parties indépendantes**, réparties sur différents domaines du programme |
| Contenu | situations contextualisées, documents en nombre limité, au moins une partie d’exploitation de résultats expérimentaux, parfois des questions à initiative |
| Programme | la terminale ; les notions de 1re peuvent être mobilisées |
| Calculatrice | le sujet précise si elle est autorisée |

## La partie pratique : l’ECE
| Élément | Ce qu’il faut savoir |
| Durée | **3 heures** |
| Note | sur 20, **coefficient 9** |
| Sujets | tirés d’une **banque nationale** : dominante chimie, dominante physique, ou mixtes |
| Déroulé | tu tires au sort ta situation au début de l’épreuve ; un examinateur suit au plus 4 candidats |
Les cinq compétences évaluées :
1. **S’approprier** : comprendre la problématique et le matériel grâce à la documentation.
2. **Analyser** : justifier ou proposer un protocole, un modèle, le mode d’acquisition des mesures.
3. **Réaliser** : mettre en œuvre le protocole en respectant la **sécurité**.
4. **Valider** : identifier les sources d’erreur, **estimer l’incertitude** avec les outils fournis, juger la cohérence du résultat.
5. **Communiquer** : expliquer tes choix, à l’écrit et à l’oral.

## Méthode pour l’écrit
1. Lis tout le sujet en 10 minutes et commence par la partie où tu es le plus à l’aise : les parties sont indépendantes.
2. À chaque calcul : **formule littérale**, application numérique, résultat avec **unité** et chiffres significatifs cohérents.
3. Quand on te demande de « justifier », écris une phrase qui cite la donnée utilisée.
4. Pour une question à initiative, montre ta démarche même si tu n’aboutis pas : elle est notée.
5. Garde 10 minutes pour relire la langue : ce sont 2 points faciles.

## Méthode pour l’ECE
1. Lis le sujet en entier avant de toucher au matériel ; repère les **appels** à l’examinateur.
2. Blouse, lunettes, gants selon les pictogrammes : la sécurité fait partie de « réaliser ».
3. Note tes mesures **au fur et à mesure**, dans un tableau, avec unités.
4. Termine par un **résultat avec son incertitude** et une comparaison à la référence (z ≤ 2).

> À l’ECE, un résultat faux mais honnêtement critiqué rapporte plus qu’un résultat « arrangé » sans analyse.

!> Ne confonds pas les deux coefficients : la **pratique pèse plus que l’écrit** (9 contre 7).`,
          },
          questions: [
            ['Quel est le coefficient total de l’épreuve de SPCL ?', ['7', '9', '16', '14'], 2, 'Partie écrite coefficient 7 et partie pratique coefficient 9.'],
            ['La partie écrite de SPCL dure…', ['2 heures', '3 heures', '4 heures', '1 heure 30'], 1, 'Elle est notée sur 20, coefficient 7.'],
            ['Combien de points la maîtrise de la langue représente-t-elle à l’écrit ?', ['2 points sur 20', '5 points sur 20', 'Aucun', '10 points sur 20'], 0, 'Orthographe, syntaxe, vocabulaire juste et raisonnement bien formulé.'],
            ['Le sujet écrit comporte…', ['Une seule dissertation', 'Un QCM de 40 questions', 'Deux exercices liés', 'Trois ou quatre parties indépendantes'], 3, 'Elles portent de manière équilibrée sur différents domaines du programme.'],
            ['Quel est le coefficient de la partie pratique (ECE) ?', ['7', '9', '4', '16'], 1, 'La pratique pèse plus que l’écrit.'],
            ['Les sujets de l’ECE viennent…', ['D’une banque nationale', 'Du professeur de la classe uniquement', 'Des élèves eux-mêmes', 'Du projet de l’année'], 0, 'Ils sont à dominante chimie, physique, ou mixtes.'],
            ['Dans la compétence « valider » de l’ECE, on attend notamment…', ['De ranger la paillasse', 'De recopier le protocole', 'D’identifier les sources d’erreur et d’estimer l’incertitude', 'De choisir le sujet'], 2, 'Puis d’analyser de manière critique la cohérence du résultat.'],
            ['Le projet de SPCL est mené par…', ['Un élève seul', 'Toute la classe', 'Le professeur', 'Un groupe de 2 à 4 élèves'], 3, 'C’est un projet d’équipe unique mené sur la durée.'],
            ['Le projet de l’année peut servir de support au Grand oral.', ['Vrai', 'Faux'], 0, 'Le programme le prévoit explicitement, ainsi que pour l’ETLV.'],
            ['Les notions de première ne peuvent jamais être mobilisées à l’épreuve de terminale.', ['Vrai', 'Faux'], 1, 'La note de service précise qu’elles peuvent être mobilisées.'],
            ['À l’écrit, un calcul bien présenté comporte…', ['Seulement le résultat', 'La formule littérale, l’application numérique et le résultat avec unité', 'Un schéma obligatoire', 'Le résultat arrondi à l’entier'], 1, 'La démarche est notée même si le résultat final est faux.'],
            ['Pendant l’ECE, le respect des règles de sécurité relève de la compétence…', ['S’approprier', 'Communiquer', 'Réaliser', 'Valider'], 2, 'Réaliser, c’est mettre en œuvre le protocole en respectant la sécurité.'],
          ],
        },
      ],
    },
  ],
}
