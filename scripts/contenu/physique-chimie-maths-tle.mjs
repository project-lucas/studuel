// PHYSIQUE-CHIMIE ET MATHÉMATIQUES — TERMINALE STI2D / STL (spécialité de 6 h).
// Matière propre à la voie technologique.
//
// SOURCE : programme de physique-chimie et mathématiques de terminale STI2D
// (annexe 3 de l'arrêté du 19/07/2019, BO spécial n° 8 du 25/07/2019), TOUJOURS
// EN VIGUEUR en 2026-2027. Le BO n° 14 du 2 avril 2026 ne publie que des
// programmes de MATHÉMATIQUES (tronc commun), et ceux de terminale n'entrent en
// vigueur qu'à la rentrée 2027 : la spécialité n'est pas concernée.
//
// Partie physique-chimie : énergie (et ses enjeux, chimique, électrique,
// interne, mécanique, lumineuse), matière et matériaux (changements d'état,
// radioactivité, combustions, oxydoréduction : piles et accumulateurs,
// acides et bases), ondes et signaux. Partie mathématiques : analyse
// (intégration, exponentielle, logarithme népérien, équations différentielles,
// composition) et nombres complexes (forme exponentielle).
//
// STL : le programme de terminale STL (annexe 1, même BO) a la même partie
// mathématiques d'analyse, sans les nombres complexes, et partage avec la STI2D
// les acides et bases, l'oxydoréduction, la radioactivité, les énergies
// mécanique et chimique ; ses chapitres propres (stéréochimie, cinétique,
// champ électrostatique) relèvent aussi de la spécialité SPCL.
//
// Les notions de première (physique-chimie-maths-1re.mjs) ne sont pas
// reprises : ici, la puissance instantanée passe par l'intégrale, la pile par
// son bilan de matière, le son par son spectre et le décibel.
//
// ÉPREUVE : écrite, 3 h, coefficient 16, notée sur 20 (14 points de
// physique-chimie, 6 de mathématiques), 3 à 5 exercices dont au moins un
// croise les deux disciplines — note de service des épreuves de spécialité
// STI2D à compter de la session 2026 (BO n° 24 de juin 2025).
//
// PAS DE LATEX : formules en texte, lignes « = » pour les formules à retenir.

export default {
  slug: 'physique-chimie-maths',
  nom: 'Physique-chimie et mathématiques',

  titreMigration: 'PHYSIQUE-CHIMIE ET MATHÉMATIQUES Tle STI2D/STL — LE PROGRAMME OFFICIEL (16 fiches)',

  motif: `Terminale de la spécialité de la voie technologique (STI2D et STL). Seize
fiches rangées sous les parties du programme officiel (BO spécial n° 8 du
25/07/2019, annexe 3, en vigueur en 2026-2027) : dix en physique-chimie
(batteries et piles à combustible ; régime sinusoïdal et réseau ; isolation
thermique ; dynamique ; rotation et fluides ; photons ; radioactivité ;
changements d'état et combustions ; acides et bases ; signaux et ondes), cinq
en mathématiques (fonctions composées, intégrales, exponentielle et
logarithme, équations différentielles, forme exponentielle des complexes) et
la fiche méthode de l'épreuve écrite (3 h, coefficient 16).`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 1,
      chapitres: [
        // ---- 1 ---------------------------------------------------------------
        {
          titre: 'Piles, accumulateurs et piles à combustible',
          axe: 'Physique-chimie — Énergie',
          lecon: {
            titre: 'Stocker l’énergie chimique et la rendre en électricité',
            cours: `Vélo à assistance, téléphone, voiture électrique, bus à hydrogène : tous emportent leur énergie sous forme **chimique** et la convertissent en énergie **électrique** au moment de s’en servir.

## Pile ou accumulateur ?
| Le générateur | Ce qu’il fait | Exemple |
| **Pile** | Conversion chimique → électrique, dans un seul sens : une fois les réactifs épuisés, elle est usée | Pile alcaline, pile bouton |
| **Accumulateur** | Conversion **réversible** : en charge il reçoit de l’énergie électrique, en décharge il la rend | Batterie lithium-ion, batterie au plomb |
| **Pile à combustible** | Les réactifs (dihydrogène, dioxygène) sont apportés en continu | Véhicule à hydrogène |
Une **batterie** est un assemblage d’accumulateurs (ou d’éléments). En **série**, les tensions s’additionnent ; en **dérivation**, les capacités s’additionnent.

## Les caractéristiques à lire sur une fiche technique
| La caractéristique | Unité | Sens |
| Tension à vide (nominale) | V | Tension entre les bornes, sans courant débité |
| **Capacité** Q | Ah (ou mAh) | Quantité d’électricité stockée ; 1 Ah = 3 600 C |
| Énergie stockée | Wh | E = U × Q |
| Énergie massique | Wh/kg | Énergie par kilogramme : décisive pour un véhicule |
| Énergie volumique | Wh/L | Énergie par litre : décisive pour un téléphone |
| Nombre de cycles | — | Charges-décharges avant usure notable |
= E = U × Q (Wh si U en V et Q en Ah)
| La technologie | Tension d’un élément | Énergie massique (ordre de grandeur) |
| Plomb | 2 V | 30 à 40 Wh/kg |
| Nickel-métal hydrure | 1,2 V | 60 à 110 Wh/kg |
| Lithium-ion | 3,6 à 3,7 V | 150 à 250 Wh/kg |

## Exemple travaillé : un vélo à assistance électrique
Batterie 48 V, 13 Ah ; moteur de 250 W.
- Charge stockée : Q = 13 × 3 600 = **46 800 C**.
- Énergie : E = 48 × 13 = **624 Wh**.
- Autonomie à pleine puissance : 624 / 250 ≈ **2,5 h**.

## Ce qui se passe dedans : l’oxydoréduction
En **décharge**, la borne négative est l’**anode** : le réducteur y est **oxydé** et libère des électrons, qui traversent le circuit extérieur jusqu’à la **cathode** (borne positive), où l’oxydant est **réduit**. On identifie donc l’oxydant et le réducteur par la **polarité**.
Batterie au plomb, en décharge :
= Pb + PbO2 + 2 H2SO4 → 2 PbSO4 + 2 H2O
En **charge**, un générateur extérieur force la réaction **inverse** : les réactifs se reforment. C’est ce qui rend l’accumulateur réversible.

## La pile à combustible
~ Dihydrogène + dioxygène → Pile à combustible → Énergie électrique + chaleur + eau
- À l’anode : H2 → 2 H⁺ + 2 e⁻
- À la cathode : O2 + 4 H⁺ + 4 e⁻ → 2 H2O
- Bilan : **2 H2 + O2 → 2 H2O**. Elle ne rejette que de l’eau ; son bilan carbone dépend de la façon dont on a produit le dihydrogène.

## Bilan de matière
Une mole d’électrons porte une charge d’environ **96 500 C**.
= n(e⁻) = Q / 96 500
Exemple : une pile à combustible débite 10 A pendant 1 h. Q = 36 000 C, n(e⁻) ≈ 0,373 mol. Chaque H2 cède 2 électrons : n(H2) ≈ 0,187 mol, soit m = 0,187 × 2,0 ≈ **0,37 g** de dihydrogène.
> Un convertisseur est **réversible** s’il peut fonctionner dans les deux sens (accumulateur, machine électrique moteur-génératrice) ; un radiateur ou une lampe ne le sont pas.`,
          },
          questions: [
            ['Quelle différence y a-t-il entre une pile et un accumulateur ?', ['Une pile est toujours plus grosse', 'Un accumulateur est rechargeable, une pile ne l’est pas', 'Une pile produit du courant alternatif', 'Un accumulateur ne contient aucune réaction chimique'], 1, 'Dans un accumulateur, la conversion chimique-électrique est réversible.'],
            ['Combien de coulombs représente une capacité de 13 Ah ?', ['13 C', '780 C', '46 800 C', '3 600 C'], 2, '1 Ah = 3 600 C, donc 13 × 3 600 = 46 800 C.'],
            ['Quelle énergie stocke une batterie de 48 V et 13 Ah ?', ['624 Wh', '61 Wh', '3,7 Wh', '6 240 Wh'], 0, 'E = U × Q = 48 × 13 = 624 Wh.'],
            ['Quelle autonomie donne 624 Wh à un moteur de 250 W ?', ['25 h', '0,4 h', '156 h', 'Environ 2,5 h'], 3, '624 / 250 ≈ 2,5 h.'],
            ['Pendant la décharge, où a lieu l’oxydation ?', ['À la cathode, borne positive', 'Dans le circuit extérieur', 'À l’anode, borne négative', 'Dans le voltmètre'], 2, 'Le réducteur y cède des électrons, qui partent dans le circuit.'],
            ['Quelle technologie offre la plus grande énergie massique ?', ['Le plomb', 'Le nickel-métal hydrure', 'Toutes se valent', 'Le lithium-ion'], 3, 'De 150 à 250 Wh/kg, d’où son usage dans les véhicules et les téléphones.'],
            ['Que rejette une pile à combustible à dihydrogène ?', ['De l’eau', 'Du dioxyde de carbone', 'Du monoxyde de carbone', 'Du méthane'], 0, 'Bilan : 2 H2 + O2 → 2 H2O.'],
            ['Trois éléments lithium-ion de 3,7 V montés en série donnent…', ['3,7 V', '7,4 V', '11,1 V', '1,2 V'], 2, 'En série, les tensions s’additionnent : 3 × 3,7 = 11,1 V.'],
            ['Pendant la charge d’un accumulateur, la réaction de décharge se fait en sens inverse.', ['Vrai', 'Faux'], 0, 'Un générateur extérieur force la réaction inverse et reforme les réactifs.'],
            ['Quelle est la charge d’une mole d’électrons ?', ['1 C', '3 600 C', '6,02 × 10²³ C', 'Environ 96 500 C'], 3, 'C’est la constante de Faraday, environ 96 500 C/mol.'],
            ['Une pile à combustible débite 10 A pendant 1 h. Quelle masse de dihydrogène consomme-t-elle ?', ['0,037 g', '37 g', '3,7 g', 'Environ 0,37 g'], 3, 'n(e⁻) = 36 000 / 96 500 ≈ 0,373 mol ; n(H2) = 0,187 mol ; m ≈ 0,37 g.'],
            ['Un radiateur électrique est un convertisseur réversible.', ['Vrai', 'Faux'], 1, 'Il transforme l’électricité en chaleur, mais ne peut pas refaire l’inverse.'],
          ],
        },
        // ---- 2 ---------------------------------------------------------------
        {
          titre: 'Régime sinusoïdal : puissances et réseau électrique',
          axe: 'Physique-chimie — Énergie',
          lecon: {
            titre: 'De la centrale à la prise, sans gaspiller ni blesser',
            cours: `Le courant du secteur est **sinusoïdal**. Pour dimensionner une installation, calculer ce qu’elle consomme vraiment et comprendre pourquoi on transporte l’électricité à 400 000 V, il faut distinguer deux puissances.

## Les deux puissances
Une tension u(t) et un courant i(t) sinusoïdaux de même fréquence peuvent être **décalés** dans le temps : c’est le **déphasage** φ.
| La puissance | Définition | Unité | Rôle |
| **Apparente** S | S = U × I (valeurs efficaces) | voltampère (VA) | **Dimensionner** câbles, transformateurs, disjoncteurs |
| **Active** P | Valeur **moyenne** de la puissance instantanée p(t) = u(t) × i(t) | watt (W) | Ce qui est **réellement consommé** et facturé |
= Facteur de puissance : k = P / S (et k = cos φ en régime sinusoïdal)
Pour un radiateur (résistance pure), φ = 0 et k = 1 : P = S. Pour un moteur, k est inférieur à 1.

## Exemple travaillé
Un moteur alimenté sous 230 V absorbe 10 A ; un wattmètre indique 1 840 W.
- S = 230 × 10 = **2 300 VA**.
- k = 1 840 / 2 300 = **0,80**.
Le câble doit supporter 10 A, alors qu’un radiateur de même puissance active n’en tirerait que 1 840 / 230 = 8 A.

## Pourquoi transporter en très haute tension ?
Les pertes dans une ligne de résistance R valent Pj = R × I². Pour une puissance transportée donnée, **I = P / (U × k)** :
- plus la tension U est grande, plus I est petit ;
- **tension multipliée par 10 → intensité divisée par 10 → pertes divisées par 100** ;
- un mauvais facteur de puissance augmente I, donc les pertes : les gros consommateurs sont incités à le relever.

## Le chemin de l’électricité (ligne monophasée simplifiée)
~ Alternateur (≈ 20 kV) → Transformateur élévateur → Ligne très haute tension (400 kV) → Postes abaisseurs (HTA 20 kV) → Transformateur de quartier → Basse tension 230 V / 400 V
Le réseau français est **alternatif, 50 Hz** ; il doit en permanence égaler la production à la consommation.

## Le transformateur
Deux bobines enroulées sur un même noyau de fer, N1 spires au primaire, N2 au secondaire.
= Rapport de transformation : m = U2 / U1 = N2 / N1
= Rendement : η = P2 / P1 (souvent 95 à 99 %)
Ses rôles : **élever** la tension, l’**abaisser**, et assurer l’**isolation galvanique** (aucun contact électrique entre primaire et secondaire). Il ne fonctionne qu’en **alternatif**.
Exemple : passer de 230 V à 12 V avec N1 = 1 150 spires : N2 = 1 150 × 12 / 230 = **60 spires**.

## Protéger les personnes et le matériel
| Courant traversant le corps (ordres de grandeur) | Effet |
| 0,5 mA | Seuil de perception |
| 10 mA | Contraction : on ne peut plus lâcher |
| 30 mA | Risque de paralysie respiratoire |
| 75 mA et plus | Risque de fibrillation cardiaque |
| Pour protéger… | Dispositifs |
| **Les personnes** | Isolation (double isolation des appareils), très basse tension de sécurité, **disjoncteur différentiel 30 mA** |
| **Le matériel** | **Fusible** et **disjoncteur** : ils coupent en cas de surcharge ou de court-circuit |
!> Un disjoncteur ordinaire ne protège pas une personne : il réagit à des ampères, alors que quelques dizaines de milliampères suffisent à tuer.`,
          },
          questions: [
            ['Comment calcule-t-on la puissance apparente S ?', ['S = U × I (valeurs efficaces)', 'S = U × I × cos φ', 'S = R × I²', 'S = U / I'], 0, 'Elle sert à dimensionner les équipements.'],
            ['Quelle est l’unité de la puissance apparente ?', ['Le watt', 'Le joule', 'Le voltampère', 'L’ohm'], 2, 'On la distingue ainsi de la puissance active, en watts.'],
            ['Un moteur sous 230 V absorbe 10 A et consomme 1 840 W. Son facteur de puissance vaut…', ['0,80', '1,25', '0,50', '0,92'], 0, 'k = P / S = 1 840 / 2 300 = 0,80.'],
            ['Que représente la puissance active ?', ['La valeur maximale de p(t)', 'La puissance moyenne réellement consommée', 'La puissance perdue dans la ligne', 'U × I dans tous les cas'], 1, 'C’est la moyenne de p(t) = u(t) × i(t) sur une période.'],
            ['Pourquoi transporte-t-on l’électricité en très haute tension ?', ['Pour qu’elle arrive plus vite', 'Parce que les alternateurs produisent 400 kV', 'Pour réduire l’intensité, donc les pertes par effet Joule', 'Pour augmenter le facteur de puissance'], 2, 'À puissance égale, I diminue quand U augmente, et les pertes varient en I².'],
            ['À puissance transportée égale, on multiplie la tension par 10. Les pertes en ligne sont…', ['divisées par 10', 'multipliées par 10', 'divisées par 100', 'inchangées'], 2, 'I est divisée par 10, et Pj = R × I² par 100.'],
            ['Pour passer de 230 V à 12 V avec 1 150 spires au primaire, il faut au secondaire…', ['12 spires', '230 spires', '96 spires', '60 spires'], 3, 'N2 = 1 150 × 12 / 230 = 60.'],
            ['Un transformateur fonctionne aussi en courant continu.', ['Vrai', 'Faux'], 1, 'Il lui faut un courant variable dans le primaire : il ne marche qu’en alternatif.'],
            ['Quelle tension utilise le réseau français de transport à très haute tension ?', ['230 V', '20 kV', '4 MV', '400 kV'], 3, 'Le réseau de transport culmine à 400 kV ; la distribution se fait en 20 kV puis en 230/400 V.'],
            ['Quel dispositif protège le MATÉRIEL contre un court-circuit ?', ['Le disjoncteur différentiel 30 mA', 'La très basse tension de sécurité', 'Le fusible', 'La double isolation'], 2, 'Le fusible fond quand l’intensité devient trop forte.'],
            ['Un mauvais facteur de puissance augmente les pertes dans les lignes.', ['Vrai', 'Faux'], 0, 'Pour la même puissance active, l’intensité appelée est plus grande.'],
            ['À partir de quel courant (ordre de grandeur) ne peut-on plus lâcher un conducteur ?', ['0,5 mA', '10 A', '1 A', '10 mA'], 3, 'Vers 10 mA, les muscles se contractent sans qu’on puisse les relâcher.'],
          ],
        },
        // ---- 3 ---------------------------------------------------------------
        {
          titre: 'Isolation : flux et résistance thermiques',
          axe: 'Physique-chimie — Énergie',
          lecon: {
            titre: 'Combien de watts traversent un mur ?',
            cours: `Chauffer une maison, c’est compenser l’énergie qui fuit à travers ses parois. Deux grandeurs suffisent pour chiffrer cette fuite et comparer deux isolations : le **flux thermique** et la **résistance thermique**.

## Le flux thermique
Le **flux thermique** Φ à travers une paroi est l’énergie qui la traverse par seconde : c’est un **débit d’énergie**, donc une **puissance**, en watts.
= Φ = Q / Δt (W)
Le transfert va toujours du côté chaud vers le côté froid. On se place en **régime permanent** : les températures ne varient plus dans le temps, le flux est constant.

## La résistance thermique
= Φ = ΔT / Rth
ΔT : écart de température entre les deux faces (en K ou en °C, c’est le même écart) ; Rth : résistance thermique (K/W).
> Pour un même écart de température, plus la résistance thermique est **grande**, plus le flux est **faible** : c’est tout l’objectif d’une isolation.
| La thermique | L’électricité |
| Écart de température ΔT | Tension U |
| Flux Φ | Intensité I |
| Résistance thermique Rth | Résistance R |
Cette analogie aide à retenir : Φ = ΔT / Rth ressemble à I = U / R.

## La calculer à partir du matériau
= Rth = e / (λ × S)
e : épaisseur (m) ; S : surface (m²) ; λ : **conductivité thermique** du matériau (W/(m·K)).
| Le matériau | λ (W/(m·K)) |
| Cuivre | 390 |
| Acier | 50 |
| Béton | 1,75 |
| Verre | 1,0 |
| Bois | 0,15 |
| Laine de verre, polystyrène | 0,035 à 0,04 |
| Air immobile | 0,025 |
Doubler l’épaisseur double la résistance ; les isolants piègent de l’air immobile.

## Une paroi en plusieurs couches
Quand les couches sont traversées l’une après l’autre, leurs résistances **s’additionnent** (comme des résistances en série).
= Rth totale = R1 + R2 + …

## Exemple travaillé : isoler un mur
Mur de 10 m² en béton de 20 cm ; 20 °C dedans, 0 °C dehors.
1. Béton seul : Rth = 0,20 / (1,75 × 10) ≈ **0,011 4 K/W**, donc Φ = 20 / 0,011 4 ≈ **1 750 W**.
2. On ajoute 10 cm de laine de verre (λ = 0,04) : R = 0,10 / (0,04 × 10) = **0,25 K/W**.
3. Total : 0,261 K/W, donc Φ = 20 / 0,261 ≈ **77 W**.
La fuite est divisée par plus de 20. (Dans la réalité, les échanges d’air sur chaque face ajoutent un peu de résistance.)

## Le double vitrage
Un vitrage 4-16-4 : deux verres de 4 mm séparés par 16 mm d’air ou d’argon. Pour 1 m², la lame d’air seule vaut 0,016 / 0,025 = **0,64 K/W**, contre 0,004 K/W pour une vitre de 4 mm : c’est le **gaz immobile** qui isole, pas le verre.

## Repérer les fuites
Une caméra **thermique** (infrarouge) montre les surfaces extérieures plus chaudes : ce sont les **ponts thermiques** (jonctions dalle-mur, tours de fenêtres) par où la chaleur s’échappe.`,
          },
          questions: [
            ['En quelle unité s’exprime un flux thermique ?', ['En kelvins', 'En watts', 'En J/kg', 'En m²'], 1, 'C’est un débit d’énergie, donc une puissance.'],
            ['Quelle relation donne la résistance thermique d’une paroi ?', ['Rth = λ × e / S', 'Rth = S / (λ × e)', 'Rth = λ / (e × S)', 'Rth = e / (λ × S)'], 3, 'Elle croît avec l’épaisseur et décroît avec la conductivité et la surface.'],
            ['Résistance d’un mur en béton de 10 m² et 20 cm (λ = 1,75 W/(m·K)) ?', ['Environ 0,011 K/W', '0,35 K/W', '87,5 K/W', '1,14 K/W'], 0, 'Rth = 0,20 / (1,75 × 10) ≈ 0,011 4 K/W.'],
            ['Une paroi de 0,25 K/W sépare 20 °C et 0 °C. Quel flux la traverse ?', ['5 W', '0,012 5 W', '80 W', '500 W'], 2, 'Φ = ΔT / Rth = 20 / 0,25 = 80 W.'],
            ['Pour une paroi faite de plusieurs couches, les résistances thermiques…', ['se multiplient', 'se compensent', 'on garde la plus grande', 's’additionnent'], 3, 'Comme des résistances électriques en série.'],
            ['Si l’on double l’épaisseur d’un isolant, sa résistance thermique est…', ['divisée par 2', 'multipliée par 4', 'inchangée', 'doublée'], 3, 'Rth est proportionnelle à l’épaisseur e.'],
            ['Quel matériau isole le mieux ?', ['L’acier', 'Le béton', 'Le verre', 'Le polystyrène expansé'], 3, 'Sa conductivité (environ 0,035 W/(m·K)) est la plus faible.'],
            ['Plus la résistance thermique est grande, plus le flux est grand, à écart de température égal.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : Φ = ΔT / Rth diminue quand Rth augmente.'],
            ['Que signifie « régime permanent » ?', ['Les températures ne varient plus dans le temps', 'Le flux est nul', 'Le mur est à la même température partout', 'Le chauffage est éteint'], 0, 'Le flux est alors constant.'],
            ['Dans l’analogie électrique, l’écart de température correspond à…', ['l’intensité', 'la résistance', 'la tension', 'la puissance'], 2, 'Φ = ΔT / Rth ressemble à I = U / R.'],
            ['Résistance de 10 cm de laine de verre (λ = 0,04) sur 10 m² ?', ['0,025 K/W', '2,5 K/W', '0,004 K/W', '0,25 K/W'], 3, 'R = 0,10 / (0,04 × 10) = 0,25 K/W.'],
            ['À quoi sert une caméra thermique sur un bâtiment ?', ['À mesurer l’humidité', 'À repérer les ponts thermiques', 'À mesurer la pression de l’air', 'À compter les fenêtres'], 1, 'Les zones qui fuient apparaissent plus chaudes vues de l’extérieur.'],
          ],
        },
        // ---- 4 ---------------------------------------------------------------
        {
          titre: 'Dynamique : forces, accélération et frottements',
          axe: 'Physique-chimie — Énergie',
          lecon: {
            titre: 'Relier les forces au mouvement',
            cours: `Pourquoi une voiture de 1,2 tonne a-t-elle besoin de plus de 3 000 N pour atteindre 100 km/h en 10 s ? Parce que les forces ne décident pas de la vitesse, mais de sa **variation**.

## Vitesse et accélération
Sur une trajectoire rectiligne repérée par x(t) :
= v(t) = dx/dt (m/s)
= a(t) = dv/dt (m/s²)
La vitesse est la **dérivée** de la position, l’accélération celle de la vitesse. Réciproquement, on remonte de a à v puis à x par des **primitives** (voir les fiches de mathématiques).

## Le principe fondamental de la dynamique
= Σ F = m × a
La somme des forces extérieures appliquées au système est égale à sa masse multipliée par son accélération (même direction, même sens).
| Si… | Alors… |
| Σ F = 0 | Le système est immobile ou en **mouvement rectiligne uniforme** |
| Σ F dans le sens du mouvement | Il accélère |
| Σ F opposée au mouvement | Il ralentit |
!> Une force n’est pas nécessaire pour AVANCER à vitesse constante : elle l’est pour changer de vitesse. Une voiture qui roule à vitesse constante a une force motrice qui compense exactement les frottements.

## Deux exemples
1. **Démarrage** : une voiture de 1 200 kg passe de 0 à 100 km/h (27,8 m/s) en 10 s. a = 27,8 / 10 = 2,78 m/s², donc Σ F = 1 200 × 2,78 ≈ **3 340 N**.
2. **Chute libre** : seul le poids agit, donc a = g ≈ 9,81 m/s², quelle que soit la masse. Au bout de 2 s : v = g × t ≈ **19,6 m/s** et la hauteur de chute vaut ½ × g × t² ≈ **19,6 m**. On valide ce modèle en pointant une vidéo de chute.

## Les frottements
| Le frottement | Modèle | Exemple |
| **Fluide** (air, eau) | F = ½ × ρ × S × Cx × v² : croît avec le carré de la vitesse | Traînée d’une voiture, d’un drone |
| **Solide-solide** | Souvent supposé constant, opposé au glissement | Freinage, palet sur la glace |
ρ : masse volumique du fluide ; S : surface frontale ; Cx : coefficient de traînée (sans unité).
Exemple : une voiture avec S × Cx = 0,7 m² roule à 30 m/s (108 km/h) dans l’air (ρ = 1,2 kg/m³). F = 0,5 × 1,2 × 0,7 × 900 ≈ **378 N**. À vitesse constante, la force motrice vaut aussi 378 N, et la puissance nécessaire est P = F × v ≈ **11,3 kW**. À 60 m/s, la traînée serait quatre fois plus forte.

## Le travail des forces et l’énergie cinétique
= Δ Ec = Σ W (forces extérieures)
Exemple : un palet de 0,5 kg lancé à 4 m/s s’arrête après 8 m. Δ Ec = 0 − ½ × 0,5 × 16 = −4 J. Seul le frottement travaille : −f × 8 = −4, donc **f = 0,5 N**.
> Méthode : définir le système, faire le bilan des forces, choisir entre le principe fondamental (si l’on cherche une accélération) et le théorème de l’énergie cinétique (si l’on connaît des distances et des vitesses).`,
          },
          questions: [
            ['Quelle est l’expression du principe fondamental de la dynamique ?', ['Σ F = m × v', 'Σ F = a / m', 'Σ F = m × a', 'Σ F = m × g dans tous les cas'], 2, 'La somme des forces est liée à l’accélération, pas à la vitesse.'],
            ['Si la somme des forces extérieures est nulle, le système est…', ['immobile ou en mouvement rectiligne uniforme', 'forcément immobile', 'forcément accéléré', 'en train de ralentir'], 0, 'C’est le principe d’inertie.'],
            ['Quelle force faut-il pour qu’une voiture de 1 200 kg accélère de 2,78 m/s² ?', ['333 N', '12 000 N', 'Environ 3 340 N', '33 400 N'], 2, 'Σ F = m × a = 1 200 × 2,78 ≈ 3 340 N.'],
            ['En chute libre, quelle vitesse atteint-on au bout de 2 s ?', ['9,81 m/s', '4,9 m/s', '39,2 m/s', 'Environ 19,6 m/s'], 3, 'v = g × t = 9,81 × 2 ≈ 19,6 m/s.'],
            ['Aux vitesses usuelles d’une voiture, la traînée de l’air est…', ['indépendante de la vitesse', 'nulle au-delà de 100 km/h', 'proportionnelle à 1/v', 'proportionnelle au carré de la vitesse'], 3, 'F = ½ × ρ × S × Cx × v².'],
            ['Une voiture roule à vitesse constante en ligne droite. Que peut-on dire des forces ?', ['La force motrice est nulle', 'Elles se compensent', 'L’accélération est maximale', 'Le poids est nul'], 1, 'Vitesse constante en ligne droite : Σ F = 0.'],
            ['Si la vitesse double, la traînée aérodynamique est multipliée par…', ['2', '√2', '4', '8'], 2, 'Elle dépend de v² : 2² = 4.'],
            ['Que dit le théorème de l’énergie cinétique ?', ['Δ Ec = Σ des travaux des forces extérieures', 'Ec est toujours constante', 'Ec = m × g × z', 'Δ Ec = m × a'], 0, 'Il relie une variation de vitesse aux forces qui travaillent sur un trajet.'],
            ['Un palet de 0,5 kg lancé à 4 m/s s’arrête après 8 m. La force de frottement (constante) vaut…', ['0,25 N', '2 N', '0,5 N', '4 N'], 2, 'Δ Ec = −4 J = −f × 8, donc f = 0,5 N.'],
            ['Quelle puissance faut-il pour vaincre 378 N de traînée à 30 m/s ?', ['12,6 W', '378 W', 'Environ 11,3 kW', '1,13 MW'], 2, 'P = F × v = 378 × 30 ≈ 11 340 W.'],
            ['L’accélération est la dérivée de la vitesse par rapport au temps.', ['Vrai', 'Faux'], 0, 'a = dv/dt, comme v = dx/dt.'],
            ['En chute libre, un objet lourd tombe plus vite qu’un objet léger.', ['Vrai', 'Faux'], 1, 'Sans frottement, a = g pour tous : seule la résistance de l’air les différencie.'],
          ],
        },
        // ---- 5 ---------------------------------------------------------------
        {
          titre: 'Rotation, couple et pression des fluides',
          axe: 'Physique-chimie — Énergie',
          lecon: {
            titre: 'Faire tourner un moteur, comprendre la pression de l’eau',
            cours: `Les moteurs font **tourner** des roues, des pompes, des ventilateurs. Et une grande partie des systèmes industriels manipule des **fluides** sous pression. Deux outils de la mécanique pour ces deux situations.

## Le mouvement de rotation
- La **vitesse angulaire** ω s’exprime en radians par seconde (rad/s). Les fiches techniques donnent souvent une fréquence de rotation N en tours par minute.
= ω = 2π × N / 60 (N en tr/min)
= Vitesse linéaire d’un point à la distance R de l’axe : v = R × ω
Exemple : un moteur à 1 500 tr/min tourne à ω = 2π × 1 500 / 60 ≈ **157 rad/s**. Une roue de rayon 0,30 m qui tourne à 50 rad/s avance à v = 0,30 × 50 = **15 m/s**.

## Moment d’une force, couple
Une force fait d’autant mieux tourner un solide qu’elle s’applique **loin** de l’axe.
= Moment d’une force : M = F × d (N·m)
d est le **bras de levier** : la distance **perpendiculaire** entre l’axe et la droite d’action de la force. Une force dont la droite d’action passe par l’axe a un moment **nul**.
Un **couple de forces** : deux forces de même valeur, de sens opposés, sur deux droites parallèles. Il fait tourner sans déplacer l’axe. Son moment vaut C = F × d, où d est la distance entre les deux droites.
Exemple : une clé de 25 cm sur laquelle on pousse avec 40 N (perpendiculairement) exerce un moment de 40 × 0,25 = **10 N·m**.

## Puissance et point de fonctionnement
= Puissance mécanique en rotation : P = C × ω
Un moteur de 20 N·m à 157 rad/s fournit P ≈ **3,1 kW**.
La **caractéristique mécanique** d’un moteur donne son couple en fonction de sa vitesse ; celle de la **charge** (pompe, tapis) donne le couple résistant qu’elle oppose. En régime permanent, les deux couples sont égaux : le **point de fonctionnement** est l’**intersection** des deux courbes.

## La pression
= p = F / S (pascal, Pa)
F : valeur de la force pressante perpendiculaire à la surface S.
= 1 bar = 10⁵ Pa ; pression atmosphérique ≈ 1,013 × 10⁵ Pa
| La pression | Définition | Mesurée par |
| **Absolue** | Par rapport au vide | Baromètre |
| **Relative** | Par rapport à l’atmosphère : p relative = p absolue − p atmosphérique | Manomètre (pneu, circuit hydraulique) |
!> Un pneu « gonflé à 2 bars » est à 2 bars de **pression relative**, soit environ 3 bars de pression absolue.

## Le principe fondamental de l’hydrostatique
Dans un liquide incompressible au repos, de masse volumique ρ :
= pB − pA = ρ × g × (zA − zB)
La pression augmente avec la **profondeur** et ne dépend que d’elle : deux points à la même profondeur ont la même pression, quelle que soit la forme du récipient.
Exemple : sous 10 m d’eau, Δp = 1 000 × 9,81 × 10 ≈ **98 000 Pa**, environ **1 bar** de plus qu’en surface. Un plongeur à 10 m subit donc environ 2 bars absolus.
> Application : un château d’eau de 30 m fournit au pied environ 1 000 × 9,81 × 30 ≈ 2,9 bars, sans aucune pompe au moment du puisage.`,
          },
          questions: [
            ['Un moteur tourne à 1 500 tr/min. Sa vitesse angulaire vaut environ…', ['25 rad/s', '9 425 rad/s', '1 500 rad/s', '157 rad/s'], 3, 'ω = 2π × 1 500 / 60 ≈ 157 rad/s.'],
            ['Une roue de 0,30 m de rayon tourne à 50 rad/s. Vitesse d’un point de la bande de roulement ?', ['166 m/s', '1,5 m/s', '15 m/s', '0,006 m/s'], 2, 'v = R × ω = 0,30 × 50 = 15 m/s.'],
            ['On pousse avec 40 N perpendiculairement au bout d’une clé de 25 cm. Moment ?', ['10 N·m', '160 N·m', '1 000 N·m', '0,16 N·m'], 0, 'M = F × d = 40 × 0,25 = 10 N·m.'],
            ['Qu’est-ce que le bras de levier ?', ['La distance perpendiculaire entre l’axe et la droite d’action de la force', 'La longueur de l’outil', 'La masse du levier', 'L’angle de rotation'], 0, 'Seule cette distance compte dans M = F × d.'],
            ['Quelle puissance fournit un moteur de 20 N·m tournant à 157 rad/s ?', ['0,13 W', '177 W', '31 kW', 'Environ 3,1 kW'], 3, 'P = C × ω = 20 × 157 ≈ 3 140 W.'],
            ['Où se trouve le point de fonctionnement d’un ensemble moteur-charge ?', ['À l’intersection des caractéristiques du moteur et de la charge', 'Au couple maximal du moteur', 'À vitesse nulle', 'Au milieu de la caractéristique du moteur'], 0, 'En régime permanent, couple moteur et couple résistant sont égaux.'],
            ['Une force de 500 N s’exerce sur 0,01 m². Pression ?', ['5 Pa', '5 000 Pa', '50 000 Pa', '500 000 Pa'], 2, 'p = F / S = 500 / 0,01 = 50 000 Pa.'],
            ['Combien de pascals vaut 1 bar ?', ['10 Pa', '1 000 Pa', '10⁵ Pa', '10⁶ Pa'], 2, 'La pression atmosphérique vaut environ 1,013 bar.'],
            ['Un pneu est gonflé à 2 bars au manomètre. Sa pression absolue vaut environ…', ['1 bar', '2 bars', '3 bars', '4 bars'], 2, 'Le manomètre mesure une pression relative : on ajoute environ 1 bar d’atmosphère.'],
            ['De combien augmente la pression quand on descend de 10 m dans l’eau ?', ['D’environ 0,1 bar', 'D’environ 1 bar', 'D’environ 10 bars', 'Elle ne change pas'], 1, 'Δp = ρ × g × h = 1 000 × 9,81 × 10 ≈ 98 000 Pa.'],
            ['Dans un liquide au repos, deux points à la même profondeur ont la même pression.', ['Vrai', 'Faux'], 0, 'La pression ne dépend que de la profondeur, pas de la forme du récipient.'],
            ['Une force dont la droite d’action passe par l’axe de rotation a un moment nul.', ['Vrai', 'Faux'], 0, 'Son bras de levier est nul : elle ne fait pas tourner.'],
          ],
        },
        // ---- 6 ---------------------------------------------------------------
        {
          titre: 'Photons, photovoltaïque et photothermique',
          axe: 'Physique-chimie — Énergie',
          lecon: {
            titre: 'La lumière livre son énergie par paquets',
            cours: `Pour comprendre comment la matière absorbe ou émet de la lumière, il faut la voir non plus seulement comme une onde, mais comme un flux de **photons** : des « grains » d’énergie.

## Le photon
= E = h × f = h × c / λ
E : énergie d’un photon (J) ; h = 6,63 × 10⁻³⁴ J·s (constante de Planck) ; f : fréquence (Hz) ; λ : longueur d’onde (m) ; c = 3,00 × 10⁸ m/s.
= 1 eV = 1,60 × 10⁻¹⁹ J (électronvolt)
> Plus la **fréquence** est grande (plus la longueur d’onde est courte), plus le photon est **énergétique** : un photon ultraviolet porte plus d’énergie qu’un photon rouge, lui-même plus qu’un infrarouge.
Exemple : lumière orangée, λ = 600 nm. f = 3,00 × 10⁸ / 600 × 10⁻⁹ = 5,0 × 10¹⁴ Hz ; E = 6,63 × 10⁻³⁴ × 5,0 × 10¹⁴ ≈ **3,3 × 10⁻¹⁹ J**, soit environ **2,1 eV**.

## Échanges d’énergie entre matière et lumière
Un atome ou une molécule n’a que certains **niveaux d’énergie**. Il **absorbe** un photon seulement si son énergie h × f égale l’écart entre deux niveaux, et il **émet** un photon d’énergie égale à l’écart quand il redescend.
= ΔE = h × f

## Deux conversions de l’énergie lumineuse
| La conversion | Chaîne | Rendement typique |
| **Photovoltaïque** | Lumineuse → électrique (+ thermique perdue) | 15 à 22 % |
| **Photothermique** | Lumineuse → thermique (capteur solaire, chauffe-eau) | 50 à 70 % |

## La caractéristique d’un panneau photovoltaïque
La courbe I = f(U) d’un panneau, pour un éclairement donné, part du **courant de court-circuit** Icc (U = 0) et descend jusqu’à la **tension à vide** Uco (I = 0). Entre les deux, la puissance P = U × I passe par un **maximum**, près du « coude » de la courbe.
Le **point de fonctionnement** est l’**intersection** de cette caractéristique avec celle de la charge (pour une résistance, une droite passant par l’origine, U = R × I). Les onduleurs solaires ajustent la charge pour rester au point de puissance maximale.

## Exemple travaillé : bilan de puissance photovoltaïque
Un panneau de 1,6 m² reçoit 1 000 W/m². À son point de fonctionnement : 33 V et 9,1 A.
- Puissance reçue : 1 000 × 1,6 = **1 600 W**.
- Puissance électrique : 33 × 9,1 ≈ **300 W**.
- Rendement : 300 / 1 600 ≈ **0,19**, soit 19 %.

## Exemple travaillé : chauffe-eau solaire
4 m² de capteurs reçoivent 800 W/m², rendement 60 % : 0,60 × 3 200 = **1 920 W** utiles. Pour chauffer 200 L d’eau de 15 °C à 45 °C : Q = 200 × 4 180 × 30 ≈ **25 MJ**, soit une durée de 25 × 10⁶ / 1 920 ≈ 13 000 s, environ **3 h 40**.
!> Le rendement photothermique est plus élevé, mais il produit de la chaleur, moins facile à transporter et à valoriser que l’électricité.`,
          },
          questions: [
            ['Quelle relation donne l’énergie d’un photon ?', ['E = m × c²', 'E = h / f', 'E = h × f', 'E = ½ × m × v²'], 2, 'h est la constante de Planck, f la fréquence.'],
            ['Énergie d’un photon de longueur d’onde 600 nm ?', ['3,3 × 10⁻¹⁹ J', '3,3 × 10⁻²⁸ J', '1,1 × 10⁻¹⁵ J', '2,0 × 10⁻³⁴ J'], 0, 'E = h × c / λ = 6,63 × 10⁻³⁴ × 3,00 × 10⁸ / 600 × 10⁻⁹ ≈ 3,3 × 10⁻¹⁹ J.'],
            ['Combien d’électronvolts représentent 3,3 × 10⁻¹⁹ J ?', ['0,48 eV', '5,3 eV', 'Environ 2,1 eV', '33 eV'], 2, '3,3 × 10⁻¹⁹ / 1,60 × 10⁻¹⁹ ≈ 2,1 eV.'],
            ['Quel photon est le plus énergétique ?', ['Infrarouge', 'Rouge', 'Bleu', 'Ultraviolet'], 3, 'Sa fréquence est la plus élevée.'],
            ['Que désigne Icc sur la caractéristique d’un panneau ?', ['Le courant quand la tension est nulle (court-circuit)', 'Le courant maximal autorisé par le fusible', 'La tension à vide', 'Le courant au point de puissance maximale'], 0, 'C’est l’intersection de la courbe avec l’axe des courants.'],
            ['Comment trouve-t-on le point de fonctionnement d’un panneau branché sur une charge ?', ['On lit Uco', 'On divise Uco par Icc', 'On prend toujours Icc', 'À l’intersection des caractéristiques du panneau et de la charge'], 3, 'Le panneau et la charge ont alors la même tension et le même courant.'],
            ['Un panneau de 1,6 m² reçoit 1 000 W/m² et délivre 300 W. Rendement ?', ['1,9 %', '53 %', 'Environ 19 %', '81 %'], 2, '300 / 1 600 ≈ 0,19.'],
            ['Une conversion photothermique transforme l’énergie lumineuse en énergie…', ['électrique', 'thermique', 'chimique', 'nucléaire'], 1, 'C’est le principe du chauffe-eau solaire.'],
            ['Un capteur solaire thermique a en général un meilleur rendement qu’un panneau photovoltaïque.', ['Vrai', 'Faux'], 0, 'De 50 à 70 % contre 15 à 22 %, mais il produit de la chaleur et non de l’électricité.'],
            ['Quelle est la caractéristique U = f(I) d’une résistance ?', ['Une droite passant par l’origine', 'Une parabole', 'Une droite horizontale', 'Une exponentielle'], 0, 'La loi d’Ohm U = R × I est une relation de proportionnalité : son graphe est une droite qui passe par l’origine, de pente R.'],
            ['Énergie pour chauffer 200 L d’eau de 30 °C (c = 4 180 J/(kg·°C)) ?', ['2,5 MJ', '836 kJ', '250 MJ', 'Environ 25 MJ'], 3, 'Q = 200 × 4 180 × 30 ≈ 25 × 10⁶ J.'],
            ['Un atome absorbe un photon seulement si son énergie correspond à l’écart entre deux de ses niveaux.', ['Vrai', 'Faux'], 0, 'Les niveaux d’énergie sont quantifiés : ΔE = h × f.'],
          ],
        },
        // ---- 7 ---------------------------------------------------------------
        {
          titre: 'Radioactivité, fission et fusion',
          axe: 'Physique-chimie — Matière et matériaux',
          lecon: {
            titre: 'Ce qui se passe au cœur des noyaux',
            cours: `La radioactivité date les fossiles, soigne des cancers et, par la fission, fournit l’essentiel de l’électricité française. Tout se joue dans le **noyau** des atomes.

## Le noyau
Un noyau est noté par son symbole, son **nombre de masse** A (nombre de nucléons) et son **numéro atomique** Z (nombre de protons) : le carbone 14 a A = 14 et Z = 6, soit 6 protons et 8 neutrons. Des **isotopes** ont le même Z mais des A différents.
Un noyau **instable** se transforme spontanément en émettant un rayonnement : c’est la **radioactivité**. Elle est **naturelle** (uranium, potassium 40, radon) ou **artificielle** (noyaux créés en réacteur ou en accélérateur, comme le fluor 18 de l’imagerie médicale).

## Les rayonnements
| Le type | Particule émise | Arrêté par |
| **α** (alpha) | Noyau d’hélium (A = 4, Z = 2) | Une feuille de papier |
| **β⁻** (bêta moins) | Électron | Quelques millimètres d’aluminium |
| **β⁺** (bêta plus) | Positon (anti-électron) | Quelques millimètres d’aluminium |
| **γ** (gamma) | Photon de très haute énergie | Plusieurs centimètres de plomb ou du béton épais |
Dans une équation nucléaire, le nombre de nucléons A et la charge Z se **conservent**.

## L’activité et la décroissance
L’**activité** A d’une source est le nombre de désintégrations par seconde, en **becquerels** (Bq).
Le nombre de noyaux radioactifs restants décroît de façon **exponentielle** :
= N(t) = N0 × e^(−λ × t)
= Demi-vie : t½ = ln 2 / λ
La **demi-vie** t½ est la durée au bout de laquelle **la moitié** des noyaux présents s’est désintégrée. Après n demi-vies, il reste N0 / 2ⁿ.
| Le noyau | Demi-vie |
| Fluor 18 (imagerie) | 110 min |
| Iode 131 (thyroïde) | 8 jours |
| Carbone 14 (datation) | 5 730 ans |
| Uranium 238 | 4,5 milliards d’années |
Exemple : un échantillon ne contient plus que 25 % de son carbone 14 initial. 25 % = 1/4 = 1/2², soit 2 demi-vies : il a environ **11 460 ans**.

## Fission et fusion
| La réaction | Principe | Exemple |
| **Fission** | Un noyau lourd, frappé par un neutron, se **casse** en deux noyaux plus légers et libère des neutrons | Uranium 235 + neutron → krypton 92 + baryum 141 + 3 neutrons |
| **Fusion** | Deux noyaux légers **fusionnent** en un noyau plus lourd | Deutérium + tritium → hélium 4 + neutron |
Vérification pour la fission : A : 235 + 1 = 92 + 141 + 3 ; Z : 92 = 36 + 56. Les neutrons libérés peuvent provoquer d’autres fissions : c’est la **réaction en chaîne**, contrôlée dans une centrale. La fusion alimente le Soleil ; le projet **ITER** cherche à la maîtriser sur Terre.

## D’où vient l’énergie ?
Les produits d’une réaction nucléaire ont une masse légèrement **inférieure** à celle des réactifs : c’est le **défaut de masse** Δm.
= E libérée = Δm × c²
Exemple : une fission d’uranium 235 a un défaut de masse d’environ 3,5 × 10⁻²⁸ kg. E = 3,5 × 10⁻²⁸ × (3,00 × 10⁸)² ≈ **3,2 × 10⁻¹¹ J** (environ 200 MeV), des millions de fois plus qu’une réaction chimique.
!> Toutes les réactions nucléaires ne produisent pas de l’énergie utilisable : il faut un défaut de masse positif.`,
          },
          questions: [
            ['Quelle particule émet la radioactivité α ?', ['Un noyau d’hélium', 'Un électron', 'Un photon', 'Un neutron'], 0, 'Il comporte 2 protons et 2 neutrons.'],
            ['Quelle particule émet la radioactivité β⁻ ?', ['Un électron', 'Un positon', 'Un noyau d’hélium', 'Un proton'], 0, 'Un neutron du noyau se transforme en proton en émettant un électron.'],
            ['Quel rayonnement est le plus pénétrant ?', ['α', 'β⁻', 'β⁺', 'γ'], 3, 'Il faut du plomb ou du béton épais pour l’atténuer.'],
            ['Quelle est l’unité de l’activité d’une source radioactive ?', ['Le gray', 'Le sievert', 'Le becquerel', 'Le joule'], 2, 'Un becquerel = une désintégration par seconde.'],
            ['Quelle fraction des noyaux reste-t-il après trois demi-vies ?', ['1/3', '1/6', '1/8', '1/9'], 2, 'À chaque demi-vie, la moitié des noyaux restants disparaît : (1/2)³ = 1/8.'],
            ['Il reste 25 % du carbone 14 initial (t½ = 5 730 ans). Âge de l’échantillon ?', ['1 432 ans', '5 730 ans', 'Environ 11 460 ans', '22 920 ans'], 2, '25 % = 1/4, soit deux demi-vies.'],
            ['Iode 131 : demi-vie 8 jours. Que reste-t-il après 24 jours ?', ['12,5 %', '25 %', '33 %', '50 %'], 0, '24 jours = 3 demi-vies : 1/8 = 12,5 %.'],
            ['Si λ = 0,1 par jour, la demi-vie vaut…', ['0,069 jour', '10 jours', 'Environ 6,9 jours', '69 jours'], 2, 't½ = ln 2 / λ = 0,693 / 0,1 ≈ 6,9 jours.'],
            ['Uranium 235 + neutron → krypton 92 + baryum 141 + x neutrons. Que vaut x ?', ['1', '2', '3', '4'], 2, 'Conservation de A : 236 = 92 + 141 + x.'],
            ['Qu’est-ce qu’une réaction de fusion ?', ['Un noyau lourd qui se casse', 'Deux noyaux légers qui s’unissent', 'Un métal qui fond', 'Une réaction chimique avec l’oxygène'], 1, 'C’est la réaction qui alimente le Soleil.'],
            ['Défaut de masse 3,5 × 10⁻²⁸ kg. Énergie libérée ?', ['1,05 × 10⁻¹⁹ J', '3,2 × 10⁻²⁸ J', 'Environ 3,2 × 10⁻¹¹ J', '3,2 × 10⁸ J'], 2, 'E = Δm × c² = 3,5 × 10⁻²⁸ × 9 × 10¹⁶ ≈ 3,2 × 10⁻¹¹ J.'],
            ['Dans une équation nucléaire, le nombre de nucléons et la charge se conservent.', ['Vrai', 'Faux'], 0, 'C’est ce qui permet de compléter une équation.'],
          ],
        },
        // ---- 8 ---------------------------------------------------------------
        {
          titre: 'Changements d’état et combustions : bilans énergétiques',
          axe: 'Physique-chimie — Matière et matériaux',
          lecon: {
            titre: 'Ce que coûte un changement d’état, ce que rend une combustion',
            cours: `Faire bouillir de l’eau, faire tourner une pompe à chaleur, choisir une chaudière : chaque fois, on fait un **bilan d’énergie** entre la matière et l’extérieur.

## Pourquoi l’eau demande tant d’énergie pour bouillir
Les molécules d’eau s’attirent par des **liaisons hydrogène** : un atome H d’une molécule, lié à un O, est attiré par un doublet non liant de l’O d’une molécule voisine. Ces liaisons sont plus faibles que les liaisons covalentes, mais nombreuses.
- En **fondant**, la glace rompt une partie de ces liaisons ; en se **vaporisant**, l’eau les rompt presque toutes.
- D’où une énergie de vaporisation très élevée : **2 260 kJ/kg**, contre 334 kJ/kg pour la fusion.
> Rompre des liaisons **coûte** de l’énergie (fusion, vaporisation) ; en former en **libère** (solidification, condensation).

## Le diagramme d’état (P, T)
Il indique, pour chaque couple pression-température, l’état d’un corps pur : **solide**, **liquide** ou **gaz**. Les courbes séparent les domaines ; sur une courbe, deux états coexistent.
- Le **point triple** : les trois états coexistent (eau : 0,01 °C, 611 Pa).
- Le **point critique** : au-delà, liquide et gaz ne se distinguent plus (eau : 374 °C, 221 bars).
Lecture pour l’eau : sous 1 bar, elle bout à 100 °C ; en montagne (0,7 bar), vers 90 °C ; dans un autocuiseur (2 bars), vers 120 °C, ce qui cuit plus vite.

## La pompe à chaleur
~ Évaporateur dehors (le fluide se vaporise à basse pression et prélève de l’énergie) → Compresseur → Condenseur dedans (le fluide se liquéfie à haute pression et cède de l’énergie) → Détendeur
Le diagramme (P, T) du fluide frigorigène permet de choisir les pressions pour qu’il bouille dehors, même par temps froid, et se condense dedans.

## Bilan d’un chauffage avec changement d’état
Porter 0,5 kg de glace de −10 °C à de l’eau liquide à 20 °C (c glace = 2 100, c eau = 4 180 J/(kg·°C)) :
1. Chauffer la glace à 0 °C : 0,5 × 2 100 × 10 = **10,5 kJ**.
2. La fondre : 0,5 × 334 = **167 kJ**.
3. Chauffer l’eau à 20 °C : 0,5 × 4 180 × 20 = **41,8 kJ**.
Total ≈ **219 kJ** : la fusion en représente les trois quarts.

## Le bilan énergétique d’une combustion
On part du **bilan de matière**. L’**énergie molaire de combustion** est l’énergie libérée par la combustion complète d’une mole de combustible.
= Q = n × E molaire
Exemple : 1 m³ de méthane, soit environ 41,7 mol (volume molaire 24 L/mol à 20 °C), avec E ≈ 800 kJ/mol : Q ≈ **33 MJ**, environ 9,3 kWh.
= CH4 + 2 O2 → CO2 + 2 H2O
Une mole de CO2 par mole de méthane : 41,7 × 44 ≈ **1,8 kg de CO2** par m³ brûlé, soit environ 200 g par kWh. Pour l’octane (essence) : 2 C8H18 + 25 O2 → 16 CO2 + 18 H2O, **8 moles de CO2** par mole brûlée.
!> Brûler un combustible fossile libère du carbone stocké depuis des millions d’années : c’est la cause principale du réchauffement climatique.

## La chaudière à condensation
Les fumées contiennent de la vapeur d’eau. Une chaudière classique la laisse partir ; une chaudière **à condensation** la refroidit jusqu’à la **liquéfier** et récupère l’énergie cédée par cette condensation : environ 10 % d’énergie en plus pour la même quantité de gaz.`,
          },
          questions: [
            ['Entre quoi s’établit une liaison hydrogène dans l’eau ?', ['Deux atomes d’oxygène d’une même molécule', 'Un proton et un neutron', 'Deux électrons libres', 'Un H d’une molécule et un doublet non liant de l’O d’une molécule voisine'], 3, 'Elle relie les molécules entre elles.'],
            ['Pourquoi la vaporisation de l’eau demande-t-elle beaucoup d’énergie ?', ['Parce que l’eau est lourde', 'Parce qu’elle rompt presque toutes les liaisons hydrogène', 'Parce qu’elle crée des liaisons covalentes', 'Parce que l’eau conduit l’électricité'], 1, 'D’où 2 260 kJ/kg, contre 334 kJ/kg pour la fusion.'],
            ['Que se passe-t-il au point triple d’un corps pur ?', ['Le corps se décompose', 'La pression est nulle', 'Le corps devient un plasma', 'Solide, liquide et gaz coexistent'], 3, 'Pour l’eau : 0,01 °C et 611 Pa.'],
            ['En montagne, sous 0,7 bar, l’eau bout…', ['à plus de 100 °C', 'exactement à 100 °C', 'vers 90 °C', 'à 0 °C'], 2, 'La température d’ébullition baisse avec la pression.'],
            ['Pourquoi un autocuiseur cuit-il plus vite ?', ['La pression élevée fait bouillir l’eau vers 120 °C', 'Il chauffe plus fort', 'Il supprime la vapeur', 'Il empêche la conduction'], 0, 'On le lit sur le diagramme (P, T) de l’eau.'],
            ['Énergie pour fondre 0,5 kg de glace à 0 °C (L = 334 kJ/kg) ?', ['16,7 kJ', '167 kJ', '668 kJ', '1 670 kJ'], 1, 'Q = m × L = 0,5 × 334 = 167 kJ.'],
            ['Énergie totale pour passer 0,5 kg de glace à −10 °C en eau à 20 °C ?', ['Environ 52 kJ', 'Environ 167 kJ', 'Environ 219 kJ', 'Environ 2 190 kJ'], 2, '10,5 + 167 + 41,8 ≈ 219 kJ.'],
            ['41,7 mol de méthane brûlent (800 kJ/mol). Énergie libérée ?', ['Environ 33 MJ', '19 kJ', '3,3 MJ', '800 MJ'], 0, 'Q = n × E = 41,7 × 800 ≈ 33 400 kJ.'],
            ['Combien de moles de CO2 produit la combustion complète d’une mole de méthane ?', ['0,5', '2', '1', '4'], 2, 'CH4 + 2 O2 → CO2 + 2 H2O.'],
            ['Combien de moles de CO2 produit la combustion complète d’une mole d’octane C8H18 ?', ['1', '4', '8', '16'], 2, 'Un CO2 par atome de carbone : 8.'],
            ['Une chaudière à condensation récupère l’énergie de liquéfaction de la vapeur d’eau des fumées.', ['Vrai', 'Faux'], 0, 'Elle gagne ainsi environ 10 % d’énergie.'],
            ['Dans une pompe à chaleur, où le fluide frigorigène se vaporise-t-il ?', ['Dans le condenseur, à l’intérieur', 'Nulle part : il reste liquide', 'Dans le compresseur', 'Dans l’évaporateur, dehors, où il prélève de l’énergie'], 3, 'La vaporisation absorbe de l’énergie prise à l’air extérieur.'],
          ],
        },
        // ---- 9 ---------------------------------------------------------------
        {
          titre: 'Acides, bases et pH',
          axe: 'Physique-chimie — Matière et matériaux',
          lecon: {
            titre: 'Mesurer et maîtriser l’acidité de l’eau',
            cours: `Pluies acides, eau des piscines, rejets d’usine, océans qui s’acidifient : l’acidité d’une solution se mesure par un seul nombre, le **pH**, et se modifie par des réactions **acide-base**.

## Acide, base, couple
| Le terme | Définition (Brønsted) |
| **Acide** | Espèce capable de **céder** un ion H⁺ (un proton) |
| **Base** | Espèce capable de **capter** un ion H⁺ |
| **Couple acide/base** | AH / A⁻, reliés par : AH = A⁻ + H⁺ |

| Le couple | Acide | Base |
| Acide éthanoïque / ion éthanoate | CH3COOH | CH3COO⁻ |
| Ion ammonium / ammoniac | NH4⁺ | NH3 |
| Ion oxonium / eau | H3O⁺ | H2O |
| Eau / ion hydroxyde | H2O | HO⁻ |
L’eau est à la fois acide (couple H2O/HO⁻) et base (couple H3O⁺/H2O).

## Le pH
= pH = −log [H3O⁺] et [H3O⁺] = 10^(−pH) (en mol/L)
| À 25 °C | pH |
| Solution acide | pH < 7 |
| Solution neutre | pH = 7 |
| Solution basique | pH > 7 |
Exemples : [H3O⁺] = 1,0 × 10⁻³ mol/L donne pH = 3 ; [H3O⁺] = 2,0 × 10⁻³ mol/L donne pH = −log(2,0 × 10⁻³) ≈ **2,7**.
> Le pH est une échelle **logarithmique** : un pH qui baisse d’une unité, c’est une concentration en H3O⁺ multipliée par **10**.

## La dilution
Diluer une solution acide fait **monter** son pH vers 7 ; diluer une solution basique le fait **descendre** vers 7. Le pH d’un acide dilué ne dépasse jamais 7.
Pour un acide fort, diluer 10 fois augmente le pH d’une unité : pH 2 → pH 3.
= Conservation de la quantité de matière : C mère × V mère = C fille × V fille
**Protocole** : préparer 100 mL d’une solution à 0,010 mol/L à partir d’une solution à 0,10 mol/L.
1. Volume à prélever : V = 0,010 × 100 / 0,10 = **10 mL**.
2. Prélever 10 mL avec une **pipette jaugée**, les verser dans une **fiole jaugée** de 100 mL.
3. Compléter avec de l’eau distillée jusqu’au trait de jauge, boucher, homogénéiser.

## La réaction acide-base
L’acide d’un couple cède un H⁺ à la base d’un autre couple :
= Acide 1 + Base 2 → Base 1 + Acide 2
Exemples :
- CH3COOH + HO⁻ → CH3COO⁻ + H2O (le vinaigre neutralisé par la soude)
- H3O⁺ + HO⁻ → 2 H2O (acide fort et base forte)

## Mesurer le pH
Le **pH-mètre**, étalonné avec des solutions tampons, donne le pH au dixième ou mieux ; le **papier pH** donne une valeur approchée.

## En contexte
| La situation | Ce qui se passe |
| Pluies acides | Le dioxyde de soufre et les oxydes d’azote des fumées forment des acides dans l’eau de pluie |
| Acidification des océans | Le CO2 dissous forme un acide : le pH moyen est passé d’environ 8,2 à 8,1, soit **26 %** d’ions H3O⁺ en plus (10^0,1 ≈ 1,26) |
| Rejets industriels | On les neutralise avant de les rejeter |
| Piscine | On maintient le pH vers 7,2 – 7,4 pour le confort et l’efficacité du chlore |`,
          },
          questions: [
            ['Selon Brønsted, un acide est une espèce capable de…', ['capter un proton H⁺', 'céder un proton H⁺', 'céder un électron', 'capter un électron'], 1, 'La base, elle, capte le proton.'],
            ['Quelle est la base conjuguée de l’acide éthanoïque CH3COOH ?', ['CH3COO⁻', 'CH3COOH2⁺', 'HO⁻', 'H3O⁺'], 0, 'CH3COOH = CH3COO⁻ + H⁺.'],
            ['Quel est le pH d’une solution où [H3O⁺] = 1,0 × 10⁻³ mol/L ?', ['−3', '0,001', '11', '3'], 3, 'pH = −log(10⁻³) = 3.'],
            ['Quel est le pH d’une solution où [H3O⁺] = 2,0 × 10⁻³ mol/L ?', ['2,0', '3,3', 'Environ 2,7', '7,0'], 2, 'pH = −log(2,0 × 10⁻³) ≈ 2,7.'],
            ['Une solution de pH 9 à 25 °C est…', ['acide', 'neutre', 'basique', 'impossible'], 2, 'Au-dessus de 7, la solution est basique.'],
            ['On dilue 10 fois une solution d’acide fort de pH 2. Nouveau pH ?', ['3', '1', '7', '20'], 0, 'La concentration en H3O⁺ est divisée par 10 : le pH augmente de 1.'],
            ['En diluant beaucoup une solution acide, on peut obtenir un pH supérieur à 7.', ['Vrai', 'Faux'], 1, 'Le pH tend vers 7 sans le dépasser.'],
            ['Que forme la réaction CH3COOH + HO⁻ ?', ['CH3COO⁻ + H2O', 'CH3COOH2⁺ + O²⁻', 'CO2 + H2O', 'H3O⁺ + CH3COO⁻'], 0, 'L’acide éthanoïque cède son H⁺ à l’ion hydroxyde.'],
            ['Quel volume de solution à 0,10 mol/L prélever pour préparer 100 mL à 0,010 mol/L ?', ['1 mL', '10 mL', '50 mL', '90 mL'], 1, 'V = 0,010 × 100 / 0,10 = 10 mL.'],
            ['Avec quelle verrerie prélève-t-on précisément ce volume ?', ['Un bécher', 'Une éprouvette graduée', 'Une pipette jaugée', 'Un erlenmeyer'], 2, 'La pipette jaugée est la plus précise pour un volume donné.'],
            ['Le pH des océans passe de 8,2 à 8,1. La concentration en H3O⁺ a augmenté d’environ…', ['1 %', '10 %', '26 %', '100 %'], 2, 'Une baisse de 0,1 unité de pH multiplie la concentration en H₃O⁺ par 10^0,1 ≈ 1,26 : soit + 26 %.'],
            ['Dans le couple NH4⁺ / NH3, quel est l’acide ?', ['NH3', 'H2O', 'NH4⁺', 'HO⁻'], 2, 'NH4⁺ = NH3 + H⁺.'],
          ],
        },
        // ---- 10 --------------------------------------------------------------
        {
          titre: 'Signaux, sons et ondes électromagnétiques',
          axe: 'Physique-chimie — Ondes et signaux',
          lecon: {
            titre: 'Lire un spectre, mesurer un bruit, transmettre une information',
            cours: `Un son de violon, un signal carré de microcontrôleur, une émission radio : tous se décrivent par leur **spectre**, la liste des fréquences qui les composent.

## Décomposer un signal périodique
Tout signal périodique de fréquence f1 peut s’écrire comme la somme :
- d’une **composante continue** (sa valeur moyenne) ;
- d’une sinusoïde de fréquence f1, le **fondamental** ;
- de sinusoïdes de fréquences 2 f1, 3 f1…, les **harmoniques**.
= Rang d’un harmonique : n = f n / f1
Le **spectre d’amplitude** représente chaque composante par une raie verticale : sa position donne la fréquence, sa hauteur l’amplitude.

## Exemple travaillé : lire un spectre
Raies à 0 Hz (2 V), 100 Hz (5 V), 300 Hz (1,7 V) et 500 Hz (1 V).
1. Composante continue : **2 V**.
2. Fondamental : **100 Hz**, d’amplitude 5 V.
3. Harmoniques de rang **3** (300 / 100) et **5** (500 / 100) : seuls les rangs impairs, comme pour un signal carré.
4. Pour transmettre ce signal jusqu’à l’harmonique 5, le canal doit laisser passer les fréquences de **0 à 500 Hz**.
!> Le spectre d’amplitude seul ne suffit pas à caractériser un signal : deux signaux de formes différentes peuvent avoir le même spectre d’amplitude (les décalages entre harmoniques n’y figurent pas).

## Les sons
| La notion | Ce qu’elle décrit |
| **Son pur** | Une seule sinusoïde : une seule raie (diapason) |
| **Son complexe** | Un fondamental et des harmoniques (voix, instruments) |
| **Hauteur** | Grave ou aigu : fixée par la fréquence du **fondamental** |
| **Timbre** | Ce qui distingue deux instruments jouant la même note : les **harmoniques** et leurs amplitudes |
L’oreille humaine perçoit de **20 Hz à 20 kHz** ; elle est la plus sensible vers 2 à 5 kHz.

## Intensité et niveau sonore
= L = 10 × log(I / I0), avec I0 = 10⁻¹² W/m²
L : niveau sonore en **décibels** (dB) ; I : intensité acoustique (W/m²).
- Seuil d’audibilité : 0 dB ; conversation : 60 dB ; seuil de danger : 85 dB ; seuil de douleur : environ 120 dB.
- I = 10⁻⁵ W/m² donne L = 10 × log(10⁷) = **70 dB**.
- Intensité doublée : **+3 dB** (deux machines à 70 dB font 73 dB, pas 140). Intensité × 10 : +10 dB.

## Transmission et absorption
Un matériau **lourd et étanche** (béton, plaque de plâtre épaisse) limite la **transmission** du son vers la pièce voisine ; un matériau **poreux** (laine, mousse) l’**absorbe** et réduit l’écho dans la pièce. Une bonne isolation combine les deux.

## Les ondes électromagnétiques des télécommunications
= c = λ × f, avec c = 3,00 × 10⁸ m/s
| L’usage | Fréquence | Longueur d’onde |
| Radio FM | ≈ 100 MHz | ≈ 3 m |
| Téléphonie mobile | 0,7 à 3,5 GHz | ≈ 10 à 40 cm |
| Wi-Fi | 2,4 et 5 GHz | 12,5 cm et 6 cm |
| Télécommande infrarouge | ≈ 3 × 10¹⁴ Hz | ≈ 950 nm |
| Fibre optique | ≈ 2 × 10¹⁴ Hz | 1,55 µm |
- La taille d’une **antenne** est de l’ordre d’une fraction de la longueur d’onde (souvent λ/4 ou λ/2) : plus la fréquence est haute, plus l’antenne est **petite**.
- Pour faire passer plusieurs émissions dans le même milieu, chacune est **transposée** dans sa propre bande de fréquences (modulation d’une porteuse).
- La **fibre optique** guide la lumière infrarouge par **réflexion totale** : faibles pertes, très haut débit, insensible aux perturbations électromagnétiques.`,
          },
          questions: [
            ['Un spectre montre une raie de 2 V à 0 Hz. Que représente-t-elle ?', ['Le fondamental', 'Un bruit de mesure', 'Un harmonique de rang 2', 'La composante continue du signal'], 3, 'La raie à fréquence nulle est la valeur moyenne.'],
            ['Fondamental à 100 Hz. Quel est le rang de la raie à 300 Hz ?', ['2', '3', '30', '300'], 1, 'n = 300 / 100 = 3.'],
            ['Quel est le spectre d’un son pur ?', ['Une seule raie', 'Deux raies', 'Une infinité de raies', 'Une bande continue'], 0, 'C’est une sinusoïde unique, comme celle d’un diapason.'],
            ['Quelle grandeur fixe la hauteur d’un son ?', ['Son amplitude', 'Le nombre d’harmoniques', 'La fréquence de son fondamental', 'Sa durée'], 2, 'Plus elle est élevée, plus le son est aigu.'],
            ['Qu’est-ce qui distingue une flûte d’un violon jouant la même note ?', ['La fréquence du fondamental', 'La composante continue', 'La vitesse du son', 'Le timbre, c’est-à-dire les harmoniques'], 3, 'Même fondamental, mais pas les mêmes harmoniques.'],
            ['Quel est le niveau sonore pour I = 10⁻⁵ W/m² (I0 = 10⁻¹² W/m²) ?', ['7 dB', '50 dB', '70 dB', '120 dB'], 2, 'L = 10 × log(10⁷) = 70 dB.'],
            ['Deux machines produisent chacune 70 dB. Ensemble, le niveau vaut…', ['73 dB', '70 dB', '80 dB', '140 dB'], 0, 'Doubler l’intensité ajoute 3 dB.'],
            ['Pour transmettre un signal de 1 kHz jusqu’à son harmonique de rang 5, jusqu’où doit aller la bande de fréquences ?', ['1 kHz', '2 kHz', '5 kHz', '50 kHz'], 2, 'L’harmonique de rang 5 est à 5 × 1 kHz.'],
            ['Deux signaux périodiques de formes différentes peuvent avoir le même spectre d’amplitude.', ['Vrai', 'Faux'], 0, 'Le spectre d’amplitude ne dit rien des décalages entre les harmoniques.'],
            ['Quelle est la longueur d’onde du Wi-Fi à 2,4 GHz ?', ['1,25 mm', '12,5 cm', '1,25 m', '125 m'], 1, 'λ = c / f = 3,00 × 10⁸ / 2,4 × 10⁹ = 0,125 m.'],
            ['Quand la fréquence d’émission augmente, l’antenne adaptée est…', ['plus grande', 'de même taille', 'plus petite', 'inutile'], 2, 'Sa taille suit la longueur d’onde, qui diminue.'],
            ['Par quel phénomène la lumière est-elle guidée dans une fibre optique ?', ['La réfraction simple', 'La diffraction', 'La réflexion totale', 'L’absorption'], 2, 'Elle rebondit sur la paroi du cœur sans en sortir.'],
          ],
        },
        // ---- 11 --------------------------------------------------------------
        {
          titre: 'Fonctions composées : dériver et primitiver',
          axe: 'Mathématiques — Analyse',
          lecon: {
            titre: 'Une fonction dans une autre',
            cours: `En physique, on rencontre sans cesse des fonctions « emboîtées » : sin(100π t), e^(−t/τ), (3x + 1)⁴. Savoir les dériver et en trouver des primitives est l’outil de base de toute l’analyse de terminale.

## La composée de deux fonctions
La **composée** de u suivie de v est la fonction notée v ∘ u :
= (v ∘ u)(x) = v(u(x))
On calcule d’abord u(x), puis on applique v au résultat.
Exemple : h(x) = (3x + 1)⁴. On pose u(x) = 3x + 1 (fonction « intérieure ») et v(X) = X⁴ (fonction « extérieure ») : h = v ∘ u.
!> L’ordre compte : avec u(x) = x + 1 et v(x) = x², v(u(x)) = (x + 1)² mais u(v(x)) = x² + 1. En général, v ∘ u ≠ u ∘ v.

## La dérivée d’une composée
= (v ∘ u)’ = u’ × (v’ ∘ u), c’est-à-dire (v(u(x)))’ = u’(x) × v’(u(x))
> On dérive la fonction extérieure en gardant l’intérieur, puis on **multiplie par la dérivée de l’intérieur**.
| La fonction | Sa dérivée |
| f(a x + b) | a × f’(a x + b) |
| uⁿ (n entier relatif) | n × u’ × uⁿ⁻¹ |
| √u | u’ / (2√u) |
| cos(u) | −u’ × sin(u) |
| sin(u) | u’ × cos(u) |
| e^u | u’ × e^u |
| ln(u) (u > 0) | u’ / u |

## Exemples travaillés
1. (x² + 1)³ : u’ = 2x, donc la dérivée vaut 3 × 2x × (x² + 1)² = **6x (x² + 1)²**.
2. e^(−2t) : u’ = −2, donc la dérivée vaut **−2 e^(−2t)**.
3. sin(100π t) : u’ = 100π, donc la dérivée vaut **100π cos(100π t)**.
4. ln(x² + 1) : la dérivée vaut **2x / (x² + 1)**.
5. √(4x + 1) : la dérivée vaut 4 / (2√(4x + 1)) = **2 / √(4x + 1)**.
Le quotient s’y ramène aussi : u/v = u × (1/v), et (1/v)’ = −v’/v², d’où la formule (u’v − uv’)/v².

## Les primitives qui s’en déduisent
On lit le tableau à l’envers : quand on reconnaît la forme « u’ × (quelque chose de u) », on trouve une primitive.
| La fonction | Une primitive |
| f(a x + b) | (1/a) × F(a x + b), si F est une primitive de f |
| u’ × uⁿ (n ≠ −1) | uⁿ⁺¹ / (n + 1) |
| u’ / u² | −1 / u |
| u’ / √u | 2√u |
| u’ / u (u > 0) | ln(u) |
| u’ × e^u | e^u |
| u’ × cos(u) | sin(u) |
| u’ × sin(u) | −cos(u) |

## Exemples travaillés
1. 2x (x² + 1)⁴ : c’est u’ × u⁴ avec u = x² + 1. Primitive : **(x² + 1)⁵ / 5**.
2. x e^(x²) : il manque un facteur 2 pour avoir u’ e^u. On écrit x e^(x²) = ½ × 2x e^(x²). Primitive : **½ e^(x²)**.
3. cos(2x + 1) : primitive **½ sin(2x + 1)**.
4. 3 / (3x + 2), pour 3x + 2 > 0 : c’est u’/u. Primitive : **ln(3x + 2)**.
> Vérifie toujours une primitive en la **dérivant** : tu dois retrouver la fonction de départ.`,
          },
          questions: [
            ['Pour h(x) = (3x + 1)⁴ écrite v(u(x)), quelle est la fonction intérieure u ?', ['u(x) = x⁴', 'u(x) = 3x⁴', 'u(x) = 4x', 'u(x) = 3x + 1'], 3, 'On calcule d’abord 3x + 1, puis on l’élève à la puissance 4.'],
            ['Quelle est la dérivée de (x² + 1)³ ?', ['3 (x² + 1)²', '6x (x² + 1)²', '2x (x² + 1)³', '3x² (x² + 1)²'], 1, '3 × u’ × u² avec u’ = 2x.'],
            ['Quelle est la dérivée de e^(−2t) ?', ['e^(−2t)', '2 e^(−2t)', '−2t e^(−2t)', '−2 e^(−2t)'], 3, '(e^u)’ = u’ × e^u, avec u’ = −2.'],
            ['Quelle est la dérivée de sin(100π t) ?', ['cos(100π t)', '−100π cos(100π t)', '100π cos(100π t)', '100π sin(100π t)'], 2, '(sin u)’ = u’ × cos u.'],
            ['Quelle est la dérivée de ln(x² + 1) ?', ['2x / (x² + 1)', '1 / (x² + 1)', '2x ln(x² + 1)', 'ln(2x)'], 0, '(ln u)’ = u’ / u.'],
            ['Pour toutes fonctions u et v, v ∘ u = u ∘ v.', ['Vrai', 'Faux'], 1, 'Avec u(x) = x + 1 et v(x) = x² : (x + 1)² ≠ x² + 1.'],
            ['Une primitive de 2x (x² + 1)⁴ est…', ['(x² + 1)⁵', '(x² + 1)⁵ / 5', '2 (x² + 1)⁵ / 5', 'x² (x² + 1)⁴'], 1, 'C’est u’ × u⁴, de primitive u⁵ / 5.'],
            ['Une primitive de x e^(x²) est…', ['e^(x²)', '2 e^(x²)', '½ e^(x²)', 'x² e^(x²)'], 2, 'x e^(x²) = ½ × 2x e^(x²) = ½ × u’ e^u.'],
            ['Une primitive de cos(2x + 1) est…', ['sin(2x + 1)', '2 sin(2x + 1)', '−½ sin(2x + 1)', '½ sin(2x + 1)'], 3, 'On divise par le coefficient a = 2.'],
            ['Quelle est la dérivée de √(4x + 1) ?', ['1 / (2√(4x + 1))', '4√(4x + 1)', '2 / √(4x + 1)', '2√(4x + 1)'], 2, 'u’ / (2√u) = 4 / (2√(4x + 1)).'],
            ['Une primitive de 3 / (3x + 2) (pour 3x + 2 > 0) est…', ['ln(3x + 2)', '3 ln(3x + 2)', '1 / (3x + 2)²', 'ln(3x)'], 0, 'C’est u’ / u avec u = 3x + 2.'],
            ['Quelle formule donne la dérivée de v ∘ u ?', ['v’ × u’', 'u’ + v’', 'v’ ∘ u’', 'u’ × (v’ ∘ u)'], 3, 'On dérive l’extérieur en gardant l’intérieur, puis on multiplie par u’.'],
          ],
        },
        // ---- 12 --------------------------------------------------------------
        {
          titre: 'Intégrales et valeur moyenne',
          axe: 'Mathématiques — Analyse',
          lecon: {
            titre: 'Calculer une aire, une énergie, une moyenne',
            cours: `Connaître la puissance d’une machine à chaque instant et vouloir l’énergie consommée ; connaître une vitesse et vouloir la distance parcourue : dans les deux cas, on cherche une **aire sous une courbe**. C’est ce que calcule l’**intégrale**.

## Définition
Pour une fonction f **positive** sur [a ; b], l’intégrale de a à b de f, notée ∫ₐᵇ f(x) dx, est l’**aire** du domaine compris entre la courbe, l’axe des abscisses et les droites x = a et x = b, en unités d’aire.
- Pour une fonction constante, c’est l’aire d’un **rectangle** : ∫ de 0 à 3 de 4 dx = 3 × 4 = **12**.
- Pour une fonction affine, c’est l’aire d’un **trapèze**.
- Si f est **négative**, l’intégrale est l’**opposé** de l’aire (elle est négative). Si f change de signe, les aires au-dessus de l’axe comptent en plus, celles en dessous en moins.
- Si a > b, on pose : intégrale de a à b = − intégrale de b à a. Échanger les bornes change le signe.

## La méthode des rectangles
On découpe [a ; b] en n bandes de largeur Δx = (b − a) / n et on additionne les aires f(xi) × Δx des rectangles. Plus n est grand, meilleure est l’approximation.
Exemple : f(x) = x² sur [0 ; 1], 4 rectangles à gauche : 0,25 × (0 + 0,0625 + 0,25 + 0,5625) ≈ **0,219**. La valeur exacte est 1/3 ≈ 0,333 : les rectangles à gauche sous-estiment une fonction croissante. Un tableur ou un programme fait le calcul avec 1 000 rectangles en un instant.

## Le lien avec les primitives
= ∫ₐᵇ f(x) dx = F(b) − F(a), où F est une primitive de f
On écrit aussi [F(x)] entre a et b. La fonction x ↦ ∫ₐˣ f(t) dt est **la** primitive de f qui s’annule en a : sa dérivée est f.
Exemple : ∫ de 0 à 2 de (3x² + 1) dx. Primitive F(x) = x³ + x. F(2) − F(0) = 10 − 0 = **10**.

## Les propriétés
| La propriété | Énoncé |
| Linéarité | ∫(f + g) = ∫f + ∫g et ∫(k f) = k ∫f |
| Positivité | Si f ≥ 0 sur [a ; b] (a ≤ b), alors ∫ₐᵇ f ≥ 0 |
| Croissance | Si f ≤ g sur [a ; b], alors ∫ₐᵇ f ≤ ∫ₐᵇ g |
| Relation de Chasles | ∫ de a à c = ∫ de a à b + ∫ de b à c |

## Valeur moyenne
= μ = (1 / (b − a)) × ∫ₐᵇ f(x) dx
C’est la hauteur du rectangle de base [a ; b] qui a la même aire que le domaine sous la courbe.
Exemple : la valeur moyenne de 3x² + 1 sur [0 ; 2] vaut 10 / 2 = **5**.

## Aire entre deux courbes
Si f ≥ g sur [a ; b], l’aire entre les deux courbes vaut ∫ₐᵇ (f(x) − g(x)) dx.
Exemple : entre y = x et y = x² sur [0 ; 1] : ∫(x − x²) dx = 1/2 − 1/3 = **1/6**.

## En physique
| La grandeur connue | Son intégrale donne |
| Puissance P(t) | L’**énergie** mise en jeu : E = ∫ P(t) dt (car P = dE/dt) |
| Puissance instantanée p(t) sur une période | La **puissance active** = sa valeur moyenne |
| Vitesse v(t) | La **distance** parcourue |
Exemple : un moteur démarre avec P(t) = 500 t (W) pendant 4 s. E = ∫ de 0 à 4 de 500 t dt = [250 t²] = **4 000 J** ; puissance moyenne : 4 000 / 4 = 1 000 W.`,
          },
          questions: [
            ['Pour une fonction positive sur [a ; b], que représente son intégrale de a à b ?', ['La pente de la courbe', 'L’aire sous la courbe entre a et b', 'Le maximum de la fonction', 'La longueur de la courbe'], 1, 'En unités d’aire.'],
            ['Combien vaut l’intégrale de 0 à 2 de (3x² + 1) dx ?', ['6', '8', '10', '13'], 2, 'F(x) = x³ + x ; F(2) − F(0) = 10.'],
            ['Combien vaut l’intégrale de 0 à 3 de la fonction constante 4 ?', ['7', '0,75', '4', '12'], 3, 'C’est l’aire d’un rectangle de 3 sur 4.'],
            ['Quelle est la valeur moyenne de 3x² + 1 sur [0 ; 2] ?', ['5', '2,5', '10', '20'], 0, 'μ = 10 / (2 − 0) = 5.'],
            ['Que dit la relation de Chasles ?', ['∫ de a à c = ∫ de a à b + ∫ de b à c', '∫(f × g) = ∫f × ∫g', '∫ de a à b = F(a) − F(b)', 'L’intégrale est toujours positive'], 0, 'Elle permet de découper un intervalle.'],
            ['Quelle est la valeur exacte de l’intégrale de 0 à 1 de x² dx ?', ['1/2', '1/4', '1', '1/3'], 3, 'Primitive x³/3 : 1/3 − 0.'],
            ['L’intégrale d’une fonction négative sur [a ; b], avec a < b, est négative.', ['Vrai', 'Faux'], 0, 'Elle vaut l’opposé de l’aire du domaine.'],
            ['Un moteur a une puissance P(t) = 500 t (W) pendant 4 s. Énergie consommée ?', ['2 000 J', '4 000 J', '8 000 J', '1 000 J'], 1, '∫ de 0 à 4 de 500 t dt = 250 × 16 = 4 000 J.'],
            ['En régime sinusoïdal, la puissance active est…', ['la valeur maximale de p(t)', 'l’intégrale de u(t)', 'la valeur moyenne de p(t) sur une période', 'le produit des valeurs maximales'], 2, 'C’est une valeur moyenne, donc une intégrale divisée par la période.'],
            ['Si l’on échange les bornes d’une intégrale, sa valeur…', ['double', 'ne change pas', 'change de signe', 'devient nulle'], 2, '∫ de b à a = −∫ de a à b.'],
            ['Quelle est l’aire entre les courbes de y = x et y = x² sur [0 ; 1] ?', ['1/6', '1/2', '1/3', '5/6'], 0, '∫(x − x²) = 1/2 − 1/3 = 1/6.'],
            ['Quelle est la dérivée de F(x) = ∫ de a à x de f(t) dt ?', ['f(a)', '0', 'F(a)', 'f(x)'], 3, 'C’est la primitive de f qui s’annule en a.'],
          ],
        },
        // ---- 13 --------------------------------------------------------------
        {
          titre: 'Exponentielle et logarithme népérien',
          axe: 'Mathématiques — Analyse',
          lecon: {
            titre: 'Deux fonctions réciproques pour les croissances et les décroissances',
            cours: `Décharge d’un condensateur, refroidissement, radioactivité : la nature adore la fonction **exponentielle**. Et pour retrouver un temps à partir d’une valeur, on a besoin de sa réciproque, le **logarithme népérien**.

## La fonction exponentielle
Parmi toutes les fonctions x ↦ aˣ (a > 0), une seule a une tangente de pente **1** en 0 : celle de base **e ≈ 2,718** (le nombre d’Euler). On la note x ↦ eˣ, ou exp(x).
= (eˣ)’ = eˣ et e⁰ = 1
- eˣ > 0 pour tout x : la fonction est **strictement croissante**.
- Limites : eˣ tend vers +∞ en +∞, et vers **0** en −∞ (l’axe des abscisses est asymptote).

## Les règles de calcul
| La règle | Exemple |
| e^(a + b) = eᵃ × eᵇ | e^(x + 2) = e² × eˣ |
| e^(−a) = 1 / eᵃ | e^(−1) ≈ 0,368 |
| e^(a − b) = eᵃ / eᵇ | e⁵ / e³ = e² |
| (eᵃ)ⁿ = e^(n a) | (eˣ)³ = e^(3x) |

## La fonction x ↦ e^(kx)
= (e^(kx))’ = k × e^(kx)
Si k > 0, elle est croissante ; si k < 0, elle est décroissante et tend vers 0 : c’est le modèle des **décroissances** (e^(−0,1 t), e^(−λ t)).
**Croissances comparées** : en +∞, eˣ l’emporte sur toute puissance de x. eˣ / xⁿ tend vers +∞ et xⁿ × e^(−x) tend vers **0**.
Exemple : f(x) = x e^(−x). f’(x) = e^(−x) − x e^(−x) = (1 − x) e^(−x), du signe de 1 − x : f croît jusqu’en 1, où elle vaut 1/e ≈ 0,37, puis décroît vers 0.

## Le logarithme népérien
Pour a > 0, **ln(a)** est l’unique nombre x tel que eˣ = a.
= e^(ln a) = a (a > 0) et ln(eˣ) = x
- ln 1 = 0 ; ln e = 1 ; ln n’est défini que pour a **strictement positif**.
- ln est strictement croissante : négative sur ]0 ; 1[, positive au-delà de 1.
- Limites : ln x tend vers −∞ quand x tend vers 0 (par valeurs positives), vers +∞ en +∞.
= (ln x)’ = 1 / x

## Les règles de calcul du logarithme
| La règle | Exemple |
| ln(a b) = ln a + ln b | ln 6 = ln 2 + ln 3 |
| ln(a / b) = ln a − ln b | ln(1/2) = −ln 2 |
| ln(aⁿ) = n ln a | ln 8 = 3 ln 2 |
| ln(√a) = ½ ln a | ln √e = ½ |
| ln(aˣ) = x ln a | ln(10ˣ) = x ln 10 |
Le logarithme **décimal** du tronc commun s’y relie : log x = ln x / ln 10.
!> ln(a + b) n’est pas ln a + ln b : le logarithme transforme les **produits** en sommes.

## Résoudre des équations et des inéquations
1. e^(3x) = 5 ⇔ 3x = ln 5 ⇔ x = ln 5 / 3 ≈ **0,54**.
2. ln x = 2 ⇔ x = e² ≈ **7,39**.
3. ln x > 1 ⇔ x > e (ln est croissante).
4. e^(−0,2 x) > 0,5 ⇔ −0,2 x > ln 0,5 ⇔ x < ln 0,5 / (−0,2) ≈ **3,47**. On divise par un nombre **négatif** : le sens de l’inégalité **change**.

## Application : la demi-vie
Un nombre de noyaux N(t) = N0 e^(−λ t) est divisé par deux quand e^(−λ t) = ½, soit −λ t = ln(½) = −ln 2 :
= t½ = ln 2 / λ
Avec λ = 0,1 par jour : t½ ≈ 0,693 / 0,1 ≈ **6,9 jours**. Le même calcul sert au pH (logarithme décimal) et au niveau sonore.`,
          },
          questions: [
            ['Que vaut e⁰ ?', ['0', '1', 'e', 'Elle n’existe pas'], 1, 'Toute exponentielle vaut 1 en 0.'],
            ['Quelle égalité est vraie pour tous réels a et b ?', ['e^(a + b) = eᵃ + eᵇ', 'e^(a − b) = eᵃ − eᵇ', 'e^(a b) = eᵃ × eᵇ', 'e^(a + b) = eᵃ × eᵇ'], 3, 'L’exponentielle transforme les sommes en produits.'],
            ['Quelle est la dérivée de e^(3x) ?', ['e^(3x)', '3x e^(3x)', 'e^(3x) / 3', '3 e^(3x)'], 3, '(e^(kx))’ = k e^(kx).'],
            ['Vers quoi tend eˣ quand x tend vers −∞ ?', ['0', '−∞', '1', '+∞'], 0, 'L’axe des abscisses est asymptote à la courbe.'],
            ['Quelle est la solution de e^(3x) = 5 ?', ['x = 5/3', 'x = ln 5 / 3 ≈ 0,54', 'x = 3 ln 5', 'x = e⁵ / 3'], 1, 'On prend le logarithme : 3x = ln 5.'],
            ['À quoi est égal ln 8 ?', ['8 ln 1', '2 ln 3', 'ln 2 + 3', '3 ln 2'], 3, '8 = 2³ et ln(aⁿ) = n ln a.'],
            ['Quelle est la solution de ln x = 2 ?', ['x = 2e', 'x = ln 2', 'x = e² ≈ 7,39', 'x = 100'], 2, 'x = e^(ln x) = e².'],
            ['ln(−1) existe.', ['Vrai', 'Faux'], 1, 'ln n’est défini que pour les nombres strictement positifs.'],
            ['Quelle est la dérivée de ln x ?', ['1 / x', 'ln x', 'x', 'eˣ'], 0, 'Sur ]0 ; +∞[, (ln x)’ = 1/x.'],
            ['Vers quoi tend x × e^(−x) quand x tend vers +∞ ?', ['+∞', '1', '0', '−∞'], 2, 'Croissance comparée : l’exponentielle l’emporte.'],
            ['Avec λ = 0,1 par jour, la demi-vie t½ = ln 2 / λ vaut environ…', ['0,07 jour', '69 jours', '10 jours', '6,9 jours'], 3, '0,693 / 0,1 ≈ 6,9.'],
            ['Quelle relation lie le logarithme décimal au logarithme népérien ?', ['log x = ln x × 10', 'log x = ln x / ln 10', 'log x = ln(10x)', 'log x = 10 ln x'], 1, 'Elle permet de passer de l’un à l’autre.'],
          ],
        },
        // ---- 14 --------------------------------------------------------------
        {
          titre: 'Équations différentielles',
          axe: 'Mathématiques — Analyse',
          lecon: {
            titre: 'Quand l’inconnue est une fonction',
            cours: `Une tasse de café refroidit d’autant plus vite qu’elle est plus chaude que la pièce ; un échantillon radioactif perd d’autant plus de noyaux qu’il en contient. Ces lois relient une grandeur à sa **vitesse de variation** : ce sont des **équations différentielles**.

## Définition
Une **équation différentielle** relie une fonction inconnue y, sa variable (x ou t) et ses dérivées. Une **solution** est une fonction qui vérifie l’égalité pour tout x de l’intervalle.
Les notations y’ et dy/dx désignent la même chose ; dy/dt, habituelle en physique, rappelle le nom de la variable et se lit comme un rapport de petites variations.
Des exemples variés : y’ = 2y ; 2y − x y’ = 0 ; y’ + y² = 0 ; y’’ + 9y = 0.

## Vérifier qu’une fonction est solution
On calcule chaque membre séparément et on compare.
- y = 3 e^(2x) : y’ = 6 e^(2x) = 2 × 3 e^(2x) = 2y. C’est une solution de **y’ = 2y**.
- y = cos(3t) : y’ = −3 sin(3t), y’’ = −9 cos(3t), donc y’’ + 9y = 0 : c’est une solution de **y’’ + 9y = 0**, l’équation d’un oscillateur.

## L’équation y’ = a y
= Solutions : y(x) = C × e^(a x), C réel quelconque
La somme de deux solutions et le produit d’une solution par une constante sont encore des solutions.
Exemple : la radioactivité, dN/dt = −λ N, a pour solutions N(t) = C e^(−λ t) ; avec N(0) = N0, **N(t) = N0 e^(−λ t)**. Une réaction chimique d’ordre 1 suit la même loi : [A](t) = [A]0 e^(−k t).

## L’équation y’ = a y + b (a ≠ 0)
= Solutions : y(x) = C × e^(a x) − b / a
La fonction constante −b/a en est une **solution particulière** (sa dérivée est nulle : a y + b = 0).
> Avec une **condition initiale** y(x0) = y0, il existe une **unique** solution : on détermine C.

## Méthode
1. Identifier a et b.
2. Écrire la forme générale y = C e^(a x) − b/a.
3. Utiliser la condition initiale pour trouver C.
4. Répondre à la question (valeur à un instant, instant où une valeur est atteinte, limite).

## Exemple travaillé : le refroidissement
Une boisson à 90 °C refroidit dans une pièce à 20 °C ; t en minutes :
= θ’ = −0,1 θ + 2
1. a = −0,1 et b = 2 ; −b/a = 20 : c’est la **température de la pièce**, la solution d’équilibre.
2. θ(t) = C e^(−0,1 t) + 20.
3. θ(0) = C + 20 = 90, donc C = 70 : **θ(t) = 70 e^(−0,1 t) + 20**.
4. À t = 10 min : θ = 70 e^(−1) + 20 ≈ **45,8 °C**.
5. Quand atteint-on 30 °C ? 70 e^(−0,1 t) = 10, soit e^(−0,1 t) = 1/7, donc t = 10 ln 7 ≈ **19,5 min**.
6. Quand t tend vers +∞, θ tend vers 20 °C.

## La méthode d’Euler
Quand on ne sait pas résoudre, on **approche** la solution pas à pas, avec un petit pas h :
= y(x + h) ≈ y(x) + h × y’(x)
Pour y’ = y et y(0) = 1, avec h = 0,1 : y(0,1) ≈ 1 + 0,1 × 1 = **1,1** ; y(0,2) ≈ 1,1 + 0,1 × 1,1 = **1,21**. La vraie valeur est e^0,2 ≈ 1,221 : plus h est petit, meilleure est l’approximation. Un tableur ou une boucle en Python fait des milliers de pas.`,
          },
          questions: [
            ['Quelles sont les solutions de y’ = 2y ?', ['y = 2x + C', 'y = C x²', 'y = e^(x/2)', 'y = C e^(2x)'], 3, 'Les solutions de y’ = a y sont C e^(a x).'],
            ['La fonction y = 3 e^(2x) est solution de y’ = 2y.', ['Vrai', 'Faux'], 0, 'y’ = 6 e^(2x) = 2 × 3 e^(2x).'],
            ['Quelle est la solution constante de θ’ = −0,1 θ + 2 ?', ['θ = 2', 'θ = 0,1', 'θ = 20', 'θ = −20'], 2, '−b/a = −2 / (−0,1) = 20.'],
            ['Quelle est la forme générale des solutions de θ’ = −0,1 θ + 2 ?', ['θ = C e^(−0,1 t) + 20', 'θ = C e^(0,1 t) + 20', 'θ = C e^(−0,1 t) − 20', 'θ = 2 e^(−0,1 t)'], 0, 'y = C e^(a x) − b/a avec a = −0,1 et b = 2.'],
            ['Avec θ(0) = 90, que vaut C dans θ(t) = C e^(−0,1 t) + 20 ?', ['90', '110', '20', '70'], 3, 'À t = 0, l’exponentielle vaut 1 : θ(0) = C + 20 = 90, donc C = 70.'],
            ['Température à t = 10 min pour θ(t) = 70 e^(−0,1 t) + 20 ?', ['Environ 25,8 °C', 'Environ 45,8 °C', 'Environ 63,5 °C', '90 °C'], 1, '70 × e^(−1) + 20 ≈ 25,8 + 20.'],
            ['Au bout de combien de temps la boisson atteint-elle 30 °C ?', ['Environ 7 min', 'Environ 70 min', 'Environ 19,5 min', 'Jamais'], 2, 'e^(−0,1 t) = 1/7, donc t = 10 ln 7 ≈ 19,5 min.'],
            ['Quelle est la solution de dN/dt = −λ N avec N(0) = N0 ?', ['N0 e^(λ t)', 'N0 − λ t', 'N0 e^(−λ t)', 'N0 / (λ t)'], 2, 'C’est la loi de décroissance radioactive.'],
            ['Une équation y’ = a y + b a une unique solution vérifiant une condition initiale donnée.', ['Vrai', 'Faux'], 0, 'La condition initiale fixe la constante C.'],
            ['Méthode d’Euler, y’ = y, y(0) = 1, pas h = 0,1 : y(0,1) vaut environ…', ['1,01', '2,718', '1,2', '1,1'], 3, 'y(0,1) ≈ y(0) + 0,1 × y’(0) = 1 + 0,1.'],
            ['De quelle équation y = cos(3t) est-elle solution ?', ['y’ = 3y', 'y’’ + 9y = 0', 'y’’ = 9y', 'y’ + 3y = 0'], 1, 'y’’ = −9 cos(3t) = −9y.'],
            ['Quelle est la solution particulière constante de y’ = a y + b (a ≠ 0) ?', ['b / a', 'a + b', 'a / b', '−b / a'], 3, 'Sa dérivée est nulle, donc a y + b = 0.'],
          ],
        },
        // ---- 15 --------------------------------------------------------------
        {
          titre: 'Nombres complexes : forme exponentielle',
          axe: 'Mathématiques — Nombres complexes',
          lecon: {
            titre: 'Tourner, multiplier, et simplifier les signaux',
            cours: `En première, tu as écrit un nombre complexe sous la forme a + i b et défini son module et son argument. La **forme exponentielle** rend les produits et les rotations presque gratuits, et c’est elle que les électriciens utilisent pour les tensions sinusoïdales.

## L’exponentielle complexe
= e^(iθ) = cos θ + i sin θ
C’est le point du cercle trigonométrique d’angle θ : son module vaut 1.
| θ | e^(iθ) |
| 0 | 1 |
| π/2 | i |
| π | −1 |
| π/4 | (√2/2) + i (√2/2) |

## La forme exponentielle
Tout complexe non nul s’écrit
= z = r × e^(iθ), avec r = |z| > 0 et θ un argument de z
Passer de a + i b à r e^(iθ) : r = √(a² + b²), puis cos θ = a/r et sin θ = b/r.
Exemples :
- 1 + i : r = √2 et cos θ = sin θ = √2/2, donc **1 + i = √2 e^(iπ/4)**.
- 2 e^(iπ/3) = 2 (cos π/3 + i sin π/3) = 2 (1/2 + i √3/2) = **1 + i√3**.

## Les règles de calcul
Elles prolongent celles de l’exponentielle réelle :
= r e^(iθ) × r’ e^(iθ’) = r r’ e^(i(θ + θ’))
= (e^(iθ))ⁿ = e^(i n θ)
> On **multiplie les modules** et on **additionne les arguments**.
Exemple : 2 e^(iπ/6) × 3 e^(iπ/3) = 6 e^(iπ/2) = **6i**.

## Les formules de trigonométrie qui en découlent
En développant e^(i(a + b)) = e^(ia) × e^(ib) et en identifiant parties réelles et imaginaires :
= cos(a + b) = cos a cos b − sin a sin b
= sin(a + b) = sin a cos b + cos a sin b
= cos 2a = cos² a − sin² a = 2 cos² a − 1 = 1 − 2 sin² a
= sin 2a = 2 sin a cos a
**Linéariser** : cos² a = (1 + cos 2a) / 2 et sin² a = (1 − cos 2a) / 2.
Application : une primitive de cos² t est t/2 + sin(2t)/4. Et la moyenne de cos²(ω t) sur une période vaut **½** : c’est pourquoi la puissance moyenne dissipée par une résistance parcourue par i = I max cos(ω t) vaut R × I max² / 2 = R × I eff².

## Réduire a cos(ω t) + b sin(ω t)
= a cos(ω t) + b sin(ω t) = A cos(ω t + φ), avec A = √(a² + b²), cos φ = a/A et sin φ = −b/A
Exemple : √3 cos t + sin t. A = √(3 + 1) = 2 ; cos φ = √3/2 et sin φ = −1/2, donc φ = −π/6 : **√3 cos t + sin t = 2 cos(t − π/6)**. La somme de deux signaux de même fréquence est une sinusoïde de même fréquence.

## Résoudre des équations
- Premier degré : (1 + i) z = 2 donne z = 2 / (1 + i) = 2 (1 − i) / 2 = **1 − i**.
- z² = a avec a réel : si a > 0, z = ±√a ; si a < 0, z = ±i √(−a). Exemple : z² = −9 donne **z = 3i ou z = −3i**.

## Interpréter géométriquement
| La transformation | Effet sur le point d’affixe z |
| z ↦ z + b | **Translation** de vecteur d’affixe b |
| z ↦ k z (k réel non nul) | **Homothétie** de centre O et de rapport k |
| z ↦ e^(iθ) z | **Rotation** de centre O et d’angle θ |
Exemple : multiplier par i = e^(iπ/2) fait tourner d’un quart de tour : le point d’affixe 2 devient 2i.

## En électricité
Un courant i(t) = I √2 cos(ω t + φ) est représenté par le complexe I e^(iφ) : additionner des courants de même fréquence revient à additionner des complexes (les électriciens notent j au lieu de i, pour ne pas confondre avec l’intensité).`,
          },
          questions: [
            ['À quoi est égal e^(iθ) ?', ['cos θ + i sin θ', 'cos θ − i sin θ', 'sin θ + i cos θ', 'eᶿ × i'], 0, 'C’est le point du cercle trigonométrique d’angle θ.'],
            ['Quelle est la forme exponentielle de 1 + i ?', ['e^(iπ/4)', '2 e^(iπ/4)', '√2 e^(iπ/4)', '√2 e^(iπ/2)'], 2, 'Module √2, argument π/4.'],
            ['Combien vaut e^(iπ) ?', ['1', '−1', 'i', '0'], 1, 'cos π + i sin π = −1.'],
            ['Quelle est la forme algébrique de 2 e^(iπ/3) ?', ['1 + i√3', '√3 + i', '2 + 2i', '1 − i√3'], 0, '2 × (1/2) + 2 × i (√3/2).'],
            ['Combien vaut 2 e^(iπ/6) × 3 e^(iπ/3) ?', ['5 e^(iπ/2)', '6 e^(iπ/18)', '6i', '6'], 2, 'On multiplie les modules et on additionne les arguments : 6 e^(iπ/2) = 6i.'],
            ['Quelle égalité est vraie ?', ['cos 2a = 2 cos a', 'cos 2a = cos² a + sin² a', 'cos 2a = 1 − 2 sin² a', 'cos 2a = 2 sin a cos a'], 2, 'C’est une des trois écritures de la formule de duplication.'],
            ['Comment linéarise-t-on cos² t ?', ['(1 + cos 2t) / 2', '(1 − cos 2t) / 2', 'cos(t²)', '2 cos t'], 0, 'Elle se déduit de cos 2t = 2 cos² t − 1.'],
            ['√3 cos t + sin t est égal à…', ['2 cos(t + π/6)', '√3 cos(t − π/3)', '4 cos(t − π/6)', '2 cos(t − π/6)'], 3, 'A = 2, cos φ = √3/2, sin φ = −1/2, donc φ = −π/6.'],
            ['Quelles sont les solutions de z² = −9 ?', ['3 et −3', 'Il n’y en a pas', '9i et −9i', '3i et −3i'], 3, 'Pour a < 0 : z = ±i √(−a).'],
            ['Quelle transformation est associée à z ↦ z + b ?', ['Une rotation', 'Une homothétie', 'Une translation', 'Une symétrie'], 2, 'On ajoute le même vecteur à chaque point.'],
            ['Multiplier par i fait tourner un point autour de O de…', ['π/4', 'π/2', 'π', '2π'], 1, 'i = e^(iπ/2) : multiplier par i ajoute π/2 à l’argument, soit un quart de tour.'],
            ['La valeur moyenne de cos²(ω t) sur une période vaut ½.', ['Vrai', 'Faux'], 0, 'Car cos² = (1 + cos 2ω t)/2 et la moyenne de cos 2ω t est nulle.'],
          ],
        },
        // ---- 16 --------------------------------------------------------------
        {
          titre: 'L’épreuve écrite de physique-chimie et mathématiques',
          axe: 'Méthode — L’épreuve écrite du bac',
          lecon: {
            titre: 'Trois heures, deux disciplines : s’organiser pour tout rendre',
            cours: `La spécialité physique-chimie et mathématiques se passe à l’écrit, en juin de la terminale. Avec un coefficient 16, c’est l’une des épreuves les plus lourdes du bac STI2D : une bonne méthode y vaut plusieurs points.

## Ce qui t’attend
| L’élément | Ce que dit le texte officiel |
| Durée | **3 heures** |
| Coefficient | **16** |
| Notation | Sur 20 : **14 points de physique-chimie**, **6 points de mathématiques** |
| Structure | **3 à 5 exercices** indépendants ; au moins un croise les deux disciplines |
| Programme | Celui de terminale, et les notions de première qu’il remobilise |
| Calculatrice | Autorisée ou non selon le sujet (mode examen) : c’est écrit en tête |
| Correction | Par un professeur de chaque discipline |

## Gérer son temps
| Le moment | Durée conseillée |
| Lire tout le sujet, repérer les documents et les questions indépendantes | 10 min |
| Physique-chimie (14 points) | Environ 1 h 55 |
| Mathématiques (6 points) | Environ 50 min |
| Relecture : unités, chiffres significatifs, questions sautées | 5 min |
> Le temps suit le barème : 14/20 du temps pour la physique-chimie. Ne passe pas 20 minutes sur une question à 1 point.

## Rédiger un calcul de physique
1. **L’expression littérale** d’abord : P = U × I × cos φ.
2. **L’application numérique** : P = 230 × 10 × 0,80.
3. **Le résultat**, avec son **unité** : P = 1 840 W.
4. **Le nombre de chiffres significatifs** cohérent avec les données (le moins précis des chiffres fournis commande).
5. Une **phrase de conclusion** qui répond à la question posée.
!> Un résultat sans unité est un résultat faux. Et une valeur absurde (une voiture à 3 000 m/s, un rendement de 140 %) doit t’alerter : dis-le si tu n’as pas le temps de corriger.

## Les verbes des consignes
| Le verbe | Ce qu’on attend |
| **Montrer que / Vérifier que** | Le résultat est donné : il faut y arriver par un raisonnement complet |
| **Justifier** | Une phrase qui cite la loi ou la propriété utilisée |
| **Déterminer / Calculer** | Une démarche et une valeur |
| **Estimer** | Un ordre de grandeur suffit, avec un raisonnement |
| **Exploiter le document** | Citer une valeur ou une courbe du document, pas seulement ses connaissances |
> Si tu n’arrives pas à « montrer que », **utilise quand même le résultat donné** pour les questions suivantes : elles restent toutes faisables.

## L’exercice qui croise les disciplines
C’est souvent une situation technologique (une batterie, un refroidissement, un signal) où la physique pose l’équation et les mathématiques la résolvent : une équation différentielle y’ = a y + b, une intégrale pour une énergie, un logarithme pour une demi-vie ou un décibel, des complexes pour un régime sinusoïdal. Écris clairement le passage de la phrase physique à l’écriture mathématique (« la vitesse de variation de θ est proportionnelle à l’écart θ − 20, donc θ’ = −k (θ − 20) »).

## En mathématiques
- Recopie l’expression à étudier avant de dériver ; annonce la formule utilisée ((v ∘ u)’ = u’ × (v’ ∘ u), primitive de u’ e^u…).
- Pour un signe, un **tableau** ; pour une limite, nomme la propriété (croissance comparée, limite de l’exponentielle en −∞).
- Vérifie une primitive en la dérivant, une solution d’équation différentielle en la réinjectant.

## Les réflexes de la dernière semaine
1. Refaire deux sujets complets **en temps réel**.
2. Relire les formules de première qui reviennent : P = U × I, E = P × Δt, Ec = ½ m v², n = m / M, λ = v / f.
3. Préparer sa calculatrice (piles, mode examen) et une montre.`,
          },
          questions: [
            ['Combien de temps dure l’épreuve écrite de physique-chimie et mathématiques ?', ['2 heures', '3 heures 30', '4 heures', '3 heures'], 3, 'Trois heures pour l’ensemble des exercices.'],
            ['Quel est le coefficient de cette épreuve ?', ['6', '8', '14', '16'], 3, 'C’est l’une des plus lourdes du bac STI2D.'],
            ['Comment les 20 points se répartissent-ils ?', ['14 en physique-chimie, 6 en mathématiques', '10 et 10', '6 en physique-chimie, 14 en mathématiques', '16 et 4'], 0, 'La physique-chimie pèse plus des deux tiers de la note.'],
            ['Combien d’exercices comporte le sujet ?', ['Un seul problème', 'Deux', 'Entre 3 et 5', 'Une dizaine'], 2, 'Dont au moins un qui croise les deux disciplines.'],
            ['Au moins un exercice mobilise à la fois la physique-chimie et les mathématiques.', ['Vrai', 'Faux'], 0, 'Il évalue la capacité à croiser les deux démarches.'],
            ['Combien de temps consacrer environ aux mathématiques ?', ['15 min', 'Environ 50 min', '1 h 30', '2 h'], 1, '6/20 de 3 h, soit environ 54 minutes.'],
            ['Dans quel ordre rédiger un calcul de physique ?', ['Résultat, puis formule', 'Application numérique seule', 'Expression littérale, application numérique, résultat avec unité', 'Unité, puis résultat'], 2, 'Le correcteur doit voir la loi utilisée avant les nombres.'],
            ['Tu n’arrives pas à « montrer que P = 1 840 W ». Que fais-tu pour la suite ?', ['J’abandonne l’exercice', 'Je recommence au début du sujet', 'J’invente une autre valeur', 'J’utilise quand même 1 840 W dans les questions suivantes'], 3, 'Le résultat est donné justement pour que la suite reste faisable.'],
            ['La calculatrice est-elle autorisée ?', ['Toujours', 'Jamais', 'Selon le sujet, indiqué en tête', 'Seulement pour les mathématiques'], 2, 'Si elle est interdite, tous les calculs sont faisables à la main.'],
            ['Les données ont 2 ou 3 chiffres significatifs. Combien en garder dans le résultat ?', ['Autant que la calculatrice en affiche', 'Aucun', '2, comme la donnée la moins précise', '10'], 2, 'Le résultat ne peut pas être plus précis que la donnée la moins précise.'],
            ['Les notions de première peuvent être mobilisées dans le sujet.', ['Vrai', 'Faux'], 0, 'Le programme de terminale les réinvestit sans cesse.'],
            ['Que demande le verbe « estimer » ?', ['Une valeur au millième près', 'Un ordre de grandeur, avec un raisonnement', 'Une démonstration complète', 'Une recopie du document'], 1, 'On attend une valeur approchée et justifiée.'],
          ],
        },
      ],
    },
  ],
}
