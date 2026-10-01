// PHYSIQUE-CHIMIE ET MATHÉMATIQUES — PREMIÈRE STI2D / STL (spécialité de 6 h
// commune aux deux séries). Matière propre à la voie technologique.
//
// SOURCE : programme de physique-chimie et mathématiques de première STI2D
// (annexe 2, arrêté du 17/01/2019, BO spécial n° 1 du 22/01/2019). Partie
// physique-chimie : mesure et incertitudes, énergie (enjeux, chimique,
// électrique, interne, mécanique, lumineuse), matière et matériaux (propriétés,
// combustions, oxydoréduction et corrosion), ondes et information. Partie
// mathématiques : géométrie dans le plan (trigonométrie, produit scalaire),
// nombres complexes, analyse (dérivées, primitives). Les axes reprennent ces
// intitulés, préfixés de la discipline.
//
// ÉVALUATION : l’épreuve écrite de la spécialité a lieu en terminale (3 h,
// coefficient 16) ; la fiche méthode est dans physique-chimie-maths-tle.mjs.
//
// PAS DE LATEX : formules en texte, lignes « = » pour les formules à retenir.

export default {
  slug: 'physique-chimie-maths',
  nom: 'Physique-chimie et mathématiques',

  titreMigration: 'PHYSIQUE-CHIMIE ET MATHÉMATIQUES 1re STI2D/STL — LE PROGRAMME OFFICIEL (15 fiches)',

  motif: `Matière neuve de la voie technologique (1re STI2D et STL). Quinze fiches
rangées sous les parties du programme officiel (BO spécial n° 1 du 22/01/2019,
annexe 2) : dix en physique-chimie (mesure et incertitudes ; énergie et ses
enjeux, chimique, électrique, interne, mécanique, lumineuse ; matériaux ;
oxydoréduction et corrosion ; ondes) et cinq en mathématiques (trigonométrie,
produit scalaire, nombres complexes, dérivation, primitives et méthode d'Euler).`,

  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 1,
      chapitres: [
        // ---- 1 ---------------------------------------------------------------
        {
          titre: 'Mesure et incertitudes',
          axe: 'Physique-chimie — Mesure et incertitudes',
          lecon: {
            titre: 'Aucune mesure n’est exacte : savoir de combien elle peut se tromper',
            cours: `Mesurer, c’est obtenir une **valeur** accompagnée d’une **incertitude** et d’une **unité**. Sans incertitude, on ne peut ni comparer deux mesures, ni savoir si un résultat est conforme.

## Grandeurs et unités du Système international
| La grandeur | L’unité SI | Symbole |
| Longueur | mètre | m |
| Masse | kilogramme | kg |
| Temps | seconde | s |
| Intensité électrique | ampère | A |
| Température | kelvin | K |
| Quantité de matière | mole | mol |
| Intensité lumineuse | candela | cd |
Les autres unités en dérivent : le newton (kg·m/s²), le joule (N·m), le watt (J/s), le volt (W/A).

## Les sources d’erreur
| L’erreur | Origine | Effet |
| **Aléatoire** | Lecture, conditions qui fluctuent | Les mesures se dispersent |
| **Systématique** | Appareil mal étalonné, méthode biaisée | Toutes les mesures sont décalées dans le même sens |

| La qualité | Définition |
| **Fidélité** | Les mesures répétées sont peu dispersées |
| **Justesse** | Leur moyenne est proche de la vraie valeur |
> Une cible où toutes les flèches sont groupées loin du centre : fidèle mais pas juste.

## Évaluer l’incertitude d’une série de mesures
Pour n mesures répétées :
= Moyenne : m = (x1 + x2 + … + xn) / n
= Incertitude-type sur la moyenne : u = s / √n
où s est l’**écart-type** de la série (calculé par la calculatrice ou le tableur).

## Exemple travaillé
On mesure 5 fois la période d’un pendule : 1,42 ; 1,45 ; 1,40 ; 1,44 ; 1,44 s.
- Moyenne : 7,15 / 5 = **1,43 s**.
- Écart-type (calculatrice) : s ≈ 0,020 s.
- u = 0,020 / √5 ≈ **0,009 s**, arrondi à 0,01 s.
- Résultat : **T = 1,43 ± 0,01 s**.

## Écrire un résultat
- L’incertitude s’arrondit à **1 ou 2 chiffres significatifs**.
- La valeur s’arrondit à la **même décimale** que l’incertitude.
!> « T = 1,4312 ± 0,009 s » est mal écrit : trop de chiffres dans la valeur. On écrit T = 1,431 ± 0,009 s, ou T = 1,43 ± 0,01 s.

## Comparer à une valeur de référence
= z = |valeur mesurée − valeur de référence| / u
Si z est inférieur à 2 environ, la mesure est **compatible** avec la référence. Exemple : on mesure g = 9,70 ± 0,05 m/s² ; référence 9,81 m/s². z = 0,11 / 0,05 = 2,2 : légèrement au-delà, on cherche une erreur systématique possible (frottements, mauvaise mesure de longueur).`,
          },
          questions: [
            ['Quelle est l’unité SI de l’intensité électrique ?', ['Le volt', 'L’ampère', 'Le watt', 'L’ohm'], 1, 'L’ampère fait partie des sept unités de base.'],
            ['Un appareil mal étalonné provoque une erreur…', ['aléatoire', 'systématique', 'de lecture', 'nulle'], 1, 'Toutes les mesures sont décalées dans le même sens.'],
            ['Des mesures très groupées mais loin de la vraie valeur sont…', ['justes et fidèles', 'fidèles mais pas justes', 'justes mais pas fidèles', 'ni justes ni fidèles'], 1, 'La dispersion est faible, mais la moyenne est décalée.'],
            ['Moyenne de 1,42 ; 1,45 ; 1,40 ; 1,44 ; 1,44 s ?', ['1,41 s', '1,43 s', '1,44 s', '1,45 s'], 1, '7,15 / 5 = 1,43 s.'],
            ['Comment calcule-t-on l’incertitude-type sur la moyenne de n mesures ?', ['u = s × n', 'u = s / √n', 'u = s / n²', 'u = √s'], 1, 'Plus on répète la mesure, plus l’incertitude sur la moyenne diminue.'],
            ['Avec s = 0,020 s et n = 4 mesures, u vaut…', ['0,005 s', '0,010 s', '0,040 s', '0,080 s'], 1, 'u = 0,020 / √4 = 0,020 / 2 = 0,010 s.'],
            ['Quelle écriture est correcte ?', ['T = 1,4312 ± 0,01 s', 'T = 1,43 ± 0,01 s', 'T = 1,4 ± 0,001 s', 'T = 1,43 s ± 1 %'], 1, 'La valeur s’arrondit à la même décimale que l’incertitude.'],
            ['Répéter les mesures réduit l’effet des erreurs aléatoires.', ['Vrai', 'Faux'], 0, 'La moyenne compense les fluctuations ; l’erreur systématique, elle, reste.'],
            ['g mesuré = 9,70 ± 0,05 m/s², référence 9,81 m/s². Que vaut z ?', ['0,11', '1,1', '2,2', '22'], 2, 'z = 0,11 / 0,05 = 2,2.'],
            ['À quelle unité SI de base se ramène le watt ?', ['kg·m²/s³', 'kg·m/s', 'kg/s', 'm/s²'], 0, '1 W = 1 J/s et 1 J = 1 kg·m²/s².'],
            ['Répéter les mesures supprime une erreur systématique.', ['Vrai', 'Faux'], 1, 'Elle décale toutes les mesures : la moyenne reste décalée.'],
            ['À combien de chiffres significatifs arrondit-on une incertitude ?', ['Un ou deux', 'Quatre', 'Aucun', 'Autant que la calculatrice en donne'], 0, 'Au-delà, les chiffres n’ont plus de sens.'],
          ],
        },
        // ---- 2 ---------------------------------------------------------------
        {
          titre: 'L’énergie et ses enjeux',
          axe: 'Physique-chimie — Énergie',
          lecon: {
            titre: 'Formes, conversions et rendement',
            cours: `L’énergie ne se crée pas et ne disparaît pas : elle se **convertit** d’une forme à une autre. Mais à chaque conversion, une partie devient inutilisable.

## Les formes d’énergie
| La forme | Exemple |
| Cinétique | Voiture en mouvement |
| Potentielle de pesanteur | Eau d’un barrage en hauteur |
| Électrique | Courant dans un circuit |
| Chimique | Carburant, batterie, aliments |
| Thermique (interne) | Eau chaude |
| Rayonnante (lumineuse) | Lumière du Soleil |
| Nucléaire | Noyaux d’uranium |

## Énergie et puissance
= E = P × Δt
E en joules (J), P en watts (W), Δt en secondes (s). Dans la vie courante : E en kilowattheures (kWh), P en kW, Δt en heures.
= 1 kWh = 3,6 × 10⁶ J
La **puissance** mesure la **rapidité** du transfert d’énergie.

## Chaîne énergétique et rendement
Une **chaîne énergétique** représente les réservoirs et convertisseurs par des cases et les transferts par des flèches.
~ Énergie électrique → Moteur → Énergie mécanique (utile) + Énergie thermique (pertes)
= Conservation : E reçue = E utile + E perdue
= Rendement : η = E utile / E reçue = P utile / P reçue
Le rendement est **inférieur à 1** (on le donne souvent en %).

## Exemple travaillé
Un moteur de perceuse reçoit 600 W et fournit 450 W mécaniques.
- η = 450 / 600 = **0,75**, soit 75 %.
- Pertes : 600 − 450 = **150 W**, dissipés en chaleur.
- Utilisé 10 min : énergie reçue = 600 × 600 s = **360 kJ**, soit 0,1 kWh.

## Stocker l’énergie
| Le stockage | Forme |
| Batterie | Chimique |
| Barrage, STEP | Potentielle de pesanteur |
| Ballon d’eau chaude | Thermique |
| Volant d’inertie | Cinétique |
| Condensateur | Électrique |

## Les ressources
| Non renouvelables | Renouvelables |
| Pétrole, gaz, charbon (fossiles), uranium | Solaire, éolien, hydraulique, biomasse, géothermie |
| Stock limité, émissions de CO2 pour les fossiles | Flux inépuisable à notre échelle, souvent intermittent |
> Les enjeux énergétiques sont à la fois des enjeux de **ressources** (épuisement) et de **climat** (gaz à effet de serre).

## Estimer une autonomie
Une batterie stocke 360 Wh ; un appareil consomme 45 W. Autonomie : 360 / 45 = **8 h**.`,
          },
          questions: [
            ['Combien de joules vaut 1 kWh ?', ['3 600 J', '1 000 J', '3,6 × 10⁶ J', '3,6 × 10³ kJ'], 2, '1 000 W × 3 600 s = 3,6 × 10⁶ J.'],
            ['Que mesure la puissance ?', ['Une quantité d’énergie', 'La rapidité du transfert d’énergie', 'Une force', 'Une tension'], 1, 'P = E / Δt : la puissance dit à quelle vitesse l’énergie est transférée, en watts.'],
            ['Un moteur reçoit 600 W et fournit 450 W. Son rendement vaut…', ['0,25', '0,75', '1,33', '150'], 1, 'η = 450 / 600 = 0,75.'],
            ['Dans cet exemple, quelle puissance est perdue ?', ['75 W', '150 W', '450 W', '1 050 W'], 1, '600 − 450 = 150 W, dissipés en chaleur.'],
            ['Quelle énergie reçoit un appareil de 600 W pendant 10 min ?', ['6 kJ', '60 kJ', '360 kJ', '3 600 kJ'], 2, 'E = P × Δt = 600 × 600 = 360 000 J.'],
            ['Le rendement d’un convertisseur réel peut dépasser 1.', ['Vrai', 'Faux'], 1, 'Il y a toujours des pertes : η < 1.'],
            ['L’eau d’un barrage en hauteur stocke de l’énergie…', ['cinétique', 'potentielle de pesanteur', 'chimique', 'nucléaire'], 1, 'Elle est convertie en énergie cinétique puis électrique.'],
            ['Lequel est une ressource renouvelable ?', ['Le charbon', 'L’uranium', 'Le vent', 'Le gaz naturel'], 2, 'Le vent est un flux inépuisable à notre échelle.'],
            ['Une batterie de 360 Wh alimente un appareil de 45 W pendant…', ['4 h', '8 h', '16 h', '405 h'], 1, '360 / 45 = 8 h.'],
            ['Que devient en général l’énergie perdue par un moteur ?', ['Elle disparaît', 'De l’énergie thermique', 'De l’énergie nucléaire', 'De la masse'], 1, 'Frottements et effet Joule échauffent le moteur.'],
            ['Dans une chaîne énergétique, l’énergie reçue égale l’énergie utile plus les pertes.', ['Vrai', 'Faux'], 0, 'C’est la conservation de l’énergie.'],
            ['Une batterie stocke l’énergie sous forme…', ['chimique', 'cinétique', 'lumineuse', 'nucléaire'], 0, 'Une réaction chimique réversible la restitue en énergie électrique.'],
          ],
        },
        // ---- 3 ---------------------------------------------------------------
        {
          titre: 'Énergie chimique : les combustions',
          axe: 'Physique-chimie — Énergie',
          lecon: {
            titre: 'Libérer l’énergie stockée dans les molécules',
            cours: `Brûler un carburant, c’est provoquer une **transformation chimique** qui libère de l’énergie thermique. Les combustions fournissent encore l’essentiel de l’énergie mondiale.

## Exothermique ou endothermique
| La transformation | Échange d’énergie | Exemple |
| **Exothermique** | Le système **libère** de l’énergie (le milieu se réchauffe) | Combustion, réaction acide-base |
| **Endothermique** | Le système **absorbe** de l’énergie (le milieu se refroidit) | Dissolution de certains sels, poche de froid instantané |

## Les combustibles organiques
| La famille | Formule générale | Exemple |
| **Alcanes** | CnH2n+2, liaisons simples | Méthane CH4, propane C3H8, butane C4H10 |
| **Alcènes** | CnH2n, une double liaison C=C | Éthène C2H4 |
| **Alcools** | Groupe caractéristique –OH | Éthanol C2H5OH (agrocarburant) |
Les **carburants** (essence, gazole, kérosène) sont des mélanges d’alcanes ; les **agrocarburants** (bioéthanol, biodiesel) viennent de la biomasse.

## La combustion complète
Le combustible réagit avec le **dioxygène** et ne forme que du **dioxyde de carbone** et de l’**eau**.
= Méthane : CH4 + 2 O2 → CO2 + 2 H2O
= Propane : C3H8 + 5 O2 → 3 CO2 + 4 H2O
Pour ajuster : on équilibre d’abord C, puis H, puis O.

## La combustion incomplète
Quand le dioxygène manque, il se forme aussi du **monoxyde de carbone** CO et des suies (carbone C). Le CO est un gaz **incolore, inodore et mortel** : il prend la place du dioxygène dans le sang.
!> Un chauffage mal réglé ou une pièce mal ventilée peut produire du CO : d’où les détecteurs obligatoires et l’entretien annuel des chaudières.

## Le pouvoir calorifique
= Q = m × PC
Le **pouvoir calorifique** PC est l’énergie libérée par la combustion complète d’un kilogramme de combustible (en kJ/kg ou MJ/kg).
| Combustible | PC (ordre de grandeur) |
| Bois sec | 18 MJ/kg |
| Éthanol | 27 MJ/kg |
| Essence | 45 MJ/kg |
| Méthane | 50 MJ/kg |
| Dihydrogène | 120 MJ/kg |

## Exemple travaillé
Une bouteille de butane contient 13 kg (PC ≈ 46 MJ/kg). Énergie libérée : Q = 13 × 46 = **598 MJ**. En kWh : 598 × 10⁶ / 3,6 × 10⁶ ≈ **166 kWh**. Si le chauffe-eau a un rendement de 90 %, 149 kWh chauffent réellement l’eau.

## Se protéger
Le **triangle du feu** : combustible, comburant (dioxygène), énergie d’activation (étincelle, chaleur). Supprimer un côté éteint le feu : c’est le principe des **extincteurs** (étouffer, refroidir) et des **retardateurs de flamme** ajoutés aux matériaux.`,
          },
          questions: [
            ['Une transformation qui libère de l’énergie est…', ['endothermique', 'exothermique', 'athermique', 'nucléaire'], 1, 'Le milieu extérieur se réchauffe.'],
            ['Quelle est la formule générale des alcanes ?', ['CnH2n', 'CnH2n+2', 'CnH2n−2', 'CnH2nO'], 1, 'Ils ne contiennent que des liaisons simples.'],
            ['Quels sont les produits d’une combustion complète d’un alcane ?', ['CO et H2O', 'CO2 et H2O', 'C et H2', 'CO2 et H2'], 1, 'Seulement du dioxyde de carbone et de l’eau.'],
            ['Combien de molécules de O2 faut-il pour brûler complètement une molécule de propane C3H8 ?', ['3', '4', '5', '8'], 2, 'C3H8 + 5 O2 → 3 CO2 + 4 H2O.'],
            ['Quel gaz dangereux produit une combustion incomplète ?', ['Le dioxyde de carbone', 'Le monoxyde de carbone', 'Le diazote', 'Le dioxygène'], 1, 'Le CO est incolore, inodore et mortel.'],
            ['Qu’est-ce que le pouvoir calorifique d’un combustible ?', ['Sa température de flamme', 'L’énergie libérée par la combustion d’un kilogramme', 'Sa masse volumique', 'Sa vitesse de combustion'], 1, 'Il s’exprime en kJ/kg ou MJ/kg.'],
            ['13 kg de butane à 46 MJ/kg libèrent…', ['59,8 MJ', '598 MJ', '5 980 MJ', '3,5 MJ'], 1, 'Q = m × PC = 13 × 46 = 598 MJ.'],
            ['Quel combustible a le plus grand pouvoir calorifique massique ?', ['Le bois', 'L’éthanol', 'L’essence', 'Le dihydrogène'], 3, 'Environ 120 MJ/kg.'],
            ['L’éthanol appartient à la famille des…', ['alcanes', 'alcènes', 'alcools', 'acides'], 2, 'Il porte le groupe caractéristique –OH.'],
            ['Supprimer un seul côté du triangle du feu suffit à l’éteindre.', ['Vrai', 'Faux'], 0, 'Sans combustible, comburant ou énergie, la combustion cesse.'],
            ['Le méthane CH4 est un alcène.', ['Vrai', 'Faux'], 1, 'C’est l’alcane le plus simple.'],
            ['Combien de molécules d’eau produit la combustion complète d’une molécule de méthane ?', ['1', '2', '3', '4'], 1, 'CH4 + 2 O2 → CO2 + 2 H2O.'],
          ],
        },
        // ---- 4 ---------------------------------------------------------------
        {
          titre: 'Énergie électrique : circuits et puissance',
          axe: 'Physique-chimie — Énergie',
          lecon: {
            titre: 'Tensions, courants et puissance dans un circuit',
            cours: `L’électricité transporte l’énergie des générateurs vers les récepteurs. Quelques lois simples suffisent à analyser la plupart des circuits.

## Conventions
| Le dipôle | Convention | Comportement |
| **Générateur** | Tension et courant fléchés dans le **même sens** | Il fournit de l’énergie (P > 0) |
| **Récepteur** | Tension et courant fléchés en **sens opposés** | Il reçoit de l’énergie (P > 0) |
Un même dipôle peut être générateur ou récepteur : une batterie en décharge est générateur, en charge elle est récepteur.

## Les lois des circuits
= Loi des nœuds : la somme des courants qui arrivent à un nœud égale la somme de ceux qui en partent
= Loi des mailles : la somme algébrique des tensions le long d’une maille est nulle
= Loi d’Ohm (conducteur ohmique) : U = R × I
Conséquence : en **série**, les tensions s’additionnent et le courant est le même ; en **dérivation**, les courants s’additionnent et la tension est la même.

## Puissance et énergie
= P = U × I (en continu)
= Effet Joule : P = R × I²
= E = P × Δt
L’effet Joule chauffe les conducteurs : utile dans un radiateur, gênant dans un câble.

## Exemple travaillé
Un radiateur de résistance R = 26,5 Ω est branché sous 230 V (on raisonne en valeurs efficaces).
- I = U / R = 230 / 26,5 ≈ **8,7 A**.
- P = U × I = 230 × 8,7 ≈ **2 000 W**.
- En 3 h : E = 2 × 3 = **6 kWh**.

## Les grandeurs périodiques
| La grandeur | Définition |
| **Période T** | Durée d’un motif (s) ; fréquence f = 1 / T (Hz) |
| **Valeur moyenne** | Moyenne sur une période |
| **Valeur efficace** | Valeur de la tension continue qui produirait le même effet Joule |
| **Composante continue** | La valeur moyenne |
| **Composante alternative** | Le signal moins sa valeur moyenne (de moyenne nulle) |
Pour une tension **sinusoïdale** :
= U eff = U max / √2
Le secteur : U eff = 230 V, donc U max = 230 × √2 ≈ **325 V** ; f = 50 Hz, T = 20 ms. Sa valeur moyenne est **nulle**.

## Sécurité électrique
- Le corps humain est traversé par un courant dangereux dès **quelques dizaines de mA**.
- Le **disjoncteur** protège les installations contre les surintensités ; le **disjoncteur différentiel** 30 mA protège les personnes contre les fuites de courant.
- La **prise de terre** évacue un courant de défaut.
- Le **fusible** fond si le courant est trop fort.`,
          },
          questions: [
            ['Que dit la loi des nœuds ?', ['Les tensions d’une maille ont une somme nulle', 'Les courants entrants égalent les courants sortants', 'U = R × I', 'P = U × I'], 1, 'Aucune charge ne s’accumule dans un nœud.'],
            ['Dans un circuit série, qu’est-ce qui est le même partout ?', ['La tension', 'Le courant', 'La puissance', 'La résistance'], 1, 'Les tensions, elles, s’additionnent.'],
            ['Une résistance de 100 Ω parcourue par 0,2 A a une tension de…', ['0,002 V', '20 V', '500 V', '100,2 V'], 1, 'U = R × I = 100 × 0,2 = 20 V.'],
            ['Un radiateur de 26,5 Ω sous 230 V est parcouru par environ…', ['0,12 A', '8,7 A', '26,5 A', '6 095 A'], 1, 'I = U / R = 230 / 26,5 ≈ 8,7 A.'],
            ['Un appareil de 2 kW fonctionne 3 h. Énergie ?', ['0,67 kWh', '5 kWh', '6 kWh', '6 000 kWh'], 2, 'E = P × Δt = 2 × 3 = 6 kWh.'],
            ['Quelle est la tension maximale du secteur (230 V efficaces) ?', ['163 V', '230 V', '325 V environ', '460 V'], 2, 'U max = 230 × √2 ≈ 325 V.'],
            ['Quelle est la valeur moyenne d’une tension sinusoïdale ?', ['Sa valeur maximale', 'Sa valeur efficace', 'Zéro', 'La moitié de sa valeur maximale'], 2, 'Les alternances positive et négative se compensent.'],
            ['Quelle est la période du secteur à 50 Hz ?', ['2 ms', '20 ms', '50 ms', '0,5 s'], 1, 'T = 1 / 50 = 0,02 s.'],
            ['Quelle puissance dissipe une résistance de 10 Ω traversée par 2 A ?', ['20 W', '40 W', '5 W', '12 W'], 1, 'P = R × I² = 10 × 4 = 40 W.'],
            ['Quel dispositif protège les personnes contre les fuites de courant ?', ['Le fusible', 'Le disjoncteur différentiel 30 mA', 'Le transformateur', 'La résistance'], 1, 'Il détecte la différence entre courant aller et retour.'],
            ['Une batterie en charge se comporte en récepteur.', ['Vrai', 'Faux'], 0, 'Elle reçoit alors de l’énergie électrique.'],
            ['En dérivation, les tensions aux bornes des branches sont égales.', ['Vrai', 'Faux'], 0, 'Ce sont les courants qui s’additionnent.'],
          ],
        },
        // ---- 5 ---------------------------------------------------------------
        {
          titre: 'Énergie interne et transferts thermiques',
          axe: 'Physique-chimie — Énergie',
          lecon: {
            titre: 'Chauffer, fondre, isoler',
            cours: `Chauffer une maison, faire fondre un métal, isoler un mur : tout repose sur l’**énergie interne** des corps et sur les **transferts thermiques**.

## Température et énergie interne
- La **température** mesure l’agitation des particules. En kelvins : T(K) = θ(°C) + 273,15.
- L’**énergie interne** U est l’énergie totale stockée à l’échelle microscopique ; elle augmente quand on chauffe.
!> « Chaleur » et « température » ne sont pas synonymes. La chaleur (le transfert thermique Q) est une énergie qui **passe** d’un corps à un autre ; la température est une **propriété** d’un corps.

## Chauffer sans changer d’état
= Q = m × c × Δθ
c : **capacité thermique massique** (J/(kg·°C)), l’énergie pour élever 1 kg de 1 °C.
| La matière | c (J/(kg·°C)) |
| Eau | 4 180 |
| Huile | 2 000 |
| Aluminium | 900 |
| Acier | 450 |
L’eau a une capacité thermique très élevée : elle stocke beaucoup de chaleur, d’où son usage dans les chauffe-eau et les circuits de refroidissement.

## Changer d’état
Pendant un changement d’état d’un corps pur, la température **reste constante**.
= Q = m × L
L : **énergie massique de changement d’état** (J/kg). Pour l’eau : fusion 334 kJ/kg, vaporisation 2 260 kJ/kg.
| Sens | Échange |
| Fusion, vaporisation, sublimation | Le corps **reçoit** de l’énergie |
| Solidification, liquéfaction, condensation | Le corps **cède** de l’énergie |

## Exemple travaillé
Porter 2 L d’eau (2 kg) de 20 °C à 100 °C : Q1 = 2 × 4 180 × 80 = **668 800 J** ≈ 669 kJ.
En vaporiser ensuite 0,1 kg : Q2 = 0,1 × 2 260 000 = **226 kJ**.
Avec une plaque de 2 000 W de rendement 70 % (1 400 W utiles), la première étape dure 668 800 / 1 400 ≈ **478 s**, soit 8 min.

## Les trois modes de transfert
| Le mode | Principe | Exemple |
| **Conduction** | De proche en proche, dans la matière, sans déplacement de matière | Manche d’une casserole qui chauffe |
| **Convection** | Par déplacement d’un fluide (air, eau) | Air chaud qui monte au-dessus d’un radiateur |
| **Rayonnement** | Par ondes électromagnétiques, même dans le vide | Soleil, feu de cheminée, infrarouge |
Un transfert thermique se fait **spontanément** du corps chaud vers le corps froid.

## Isoler
Un bon isolant est un mauvais conducteur thermique : il contient souvent de l’**air immobile** (laine, mousse, double vitrage). On limite aussi la convection (calfeutrer) et le rayonnement (surfaces réfléchissantes, couverture de survie).`,
          },
          questions: [
            ['Convertir 25 °C en kelvins donne environ…', ['−248 K', '25 K', '298 K', '373 K'], 2, 'T = 25 + 273,15 ≈ 298 K.'],
            ['Chaleur et température désignent la même grandeur.', ['Vrai', 'Faux'], 1, 'La chaleur est un transfert d’énergie, la température une propriété.'],
            ['Énergie pour chauffer 2 kg d’eau de 20 à 100 °C (c = 4 180) ?', ['66,9 kJ', '669 kJ', '6 690 kJ', '8,36 kJ'], 1, 'Q = 2 × 4 180 × 80 = 668 800 J.'],
            ['Pendant la fusion de la glace pure, la température…', ['augmente', 'diminue', 'reste constante', 'oscille'], 2, 'L’énergie reçue sert à changer d’état.'],
            ['Énergie pour vaporiser 0,1 kg d’eau (L = 2 260 kJ/kg) ?', ['22,6 kJ', '226 kJ', '2 260 kJ', '2,26 kJ'], 1, 'Q = m × L = 0,1 × 2 260 = 226 kJ.'],
            ['Lors de la solidification, le corps…', ['reçoit de l’énergie', 'cède de l’énergie', 'n’échange rien', 'change de masse'], 1, 'C’est l’inverse de la fusion.'],
            ['Quel mode de transfert fonctionne même dans le vide ?', ['La conduction', 'La convection', 'Le rayonnement', 'Aucun'], 2, 'L’énergie du Soleil nous parvient ainsi.'],
            ['L’air chaud qui monte au-dessus d’un radiateur est un exemple de…', ['conduction', 'convection', 'rayonnement', 'changement d’état'], 1, 'Le fluide se déplace en emportant l’énergie.'],
            ['Pourquoi l’eau est-elle utilisée dans les circuits de chauffage ?', ['Elle est gratuite et incolore', 'Sa capacité thermique massique est élevée', 'Elle conduit l’électricité', 'Elle ne s’évapore jamais'], 1, 'Elle transporte beaucoup d’énergie par kilogramme.'],
            ['Spontanément, un transfert thermique se fait…', ['du froid vers le chaud', 'du chaud vers le froid', 'dans les deux sens également', 'seulement dans les métaux'], 1, 'Jusqu’à l’équilibre des températures.'],
            ['Pourquoi les isolants contiennent-ils souvent de l’air immobile ?', ['L’air est lourd', 'L’air immobile conduit très mal la chaleur', 'L’air rayonne beaucoup', 'Pour être moins chers uniquement'], 1, 'Immobile, il ne peut pas non plus faire de convection.'],
            ['1 400 W utiles fournissent 669 kJ en environ…', ['48 s', '8 min', '80 min', '8 h'], 1, '668 800 / 1 400 ≈ 478 s ≈ 8 min.'],
          ],
        },
        // ---- 6 ---------------------------------------------------------------
        {
          titre: 'Énergie mécanique : mouvements et forces',
          axe: 'Physique-chimie — Énergie',
          lecon: {
            titre: 'Décrire un mouvement et suivre son énergie',
            cours: `Pour étudier un véhicule, un ascenseur ou une balle, on décrit d’abord son **mouvement**, puis on fait le bilan des **forces** et des **énergies**.

## Décrire un mouvement
- Le **référentiel** : l’objet par rapport auquel on observe (la route, le train…). Le mouvement dépend du référentiel.
- La **trajectoire** : l’ensemble des positions (rectiligne, circulaire, curviligne).
- La **vitesse** : v = d / Δt en m/s (1 m/s = 3,6 km/h). La vitesse instantanée est la limite de la vitesse moyenne sur une durée très courte — c’est la **dérivée** de la position.
- L’**accélération** : variation de la vitesse par unité de temps (m/s²).
| Le mouvement | Vitesse |
| Rectiligne uniforme | Constante, en ligne droite |
| Rectiligne accéléré | Augmente |
| Rectiligne ralenti | Diminue |

## Les forces usuelles
| La force | Expression ou caractéristique |
| **Poids** | P = m × g, vertical vers le bas, g ≈ 9,81 N/kg |
| **Réaction d’un support** | Perpendiculaire au support s’il n’y a pas de frottement |
| **Force élastique** (ressort) | F = k × Δl |
| **Frottement fluide** | Opposée au mouvement, augmente avec la vitesse |
Une force a un point d’application, une direction, un sens et une valeur en newtons.

## Le travail d’une force
= W = F × AB × cos α (produit scalaire de la force et du déplacement)
α : angle entre la force et le déplacement. Le travail est **moteur** (W > 0) si la force aide le mouvement, **résistant** (W < 0) si elle s’y oppose, **nul** si elle est perpendiculaire au déplacement.

## Les énergies mécaniques
= Énergie cinétique : Ec = ½ × m × v²
= Énergie potentielle de pesanteur : Epp = m × g × z
= Énergie potentielle élastique : Epe = ½ × k × Δl²
= Énergie mécanique : Em = Ec + Ep
Sans frottement, Em se **conserve**. Avec frottements, Em **diminue** : l’énergie perdue devient thermique. La variation d’Ec est égale au travail des forces (théorème de l’énergie cinétique).

## Exemple travaillé
Une luge de 50 kg (avec l’enfant) part sans vitesse du haut d’une pente de 8 m de dénivelé.
- Epp en haut : 50 × 9,81 × 8 ≈ **3 924 J**.
- Sans frottement, en bas : Ec = 3 924 J, donc v = √(2 × 3 924 / 50) ≈ **12,5 m/s** (45 km/h).
- On mesure en réalité 9 m/s : Ec = ½ × 50 × 81 = 2 025 J. Énergie dissipée par les frottements : 3 924 − 2 025 ≈ **1 900 J**.

## Puissance moyenne
= P = W / Δt
Un moteur qui monte 200 kg de 10 m en 20 s fournit au moins 200 × 9,81 × 10 / 20 ≈ **981 W**.`,
          },
          questions: [
            ['Convertir 72 km/h en m/s donne…', ['7,2 m/s', '20 m/s', '259 m/s', '36 m/s'], 1, '72 / 3,6 = 20 m/s.'],
            ['Quel est le poids d’une masse de 50 kg (g = 9,81 N/kg) ?', ['5,1 N', '50 N', '490,5 N', '4 905 N'], 2, 'P = m × g = 50 × 9,81 = 490,5 N.'],
            ['Le travail d’une force perpendiculaire au déplacement est…', ['maximal', 'négatif', 'nul', 'infini'], 2, 'W = F × d × cos α. Pour une force perpendiculaire au déplacement, α = 90° et cos 90° = 0 : le travail est nul.'],
            ['Quelle est l’énergie cinétique d’une masse de 2 kg à 3 m/s ?', ['3 J', '6 J', '9 J', '18 J'], 2, 'Ec = ½ × 2 × 9 = 9 J.'],
            ['Si la vitesse double, l’énergie cinétique est…', ['doublée', 'multipliée par 4', 'inchangée', 'divisée par 2'], 1, 'Ec dépend du carré de la vitesse.'],
            ['Epp de 50 kg à 8 m de hauteur (g = 9,81) ?', ['392 J', '3 924 J', '400 J', '39 240 J'], 1, 'Epp = m × g × z = 50 × 9,81 × 8 ≈ 3 924 J.'],
            ['Sans frottement, l’énergie mécanique d’un système…', ['augmente', 'diminue', 'se conserve', 'devient nulle'], 2, 'Ec et Ep s’échangent, leur somme reste constante.'],
            ['Avec frottements, l’énergie mécanique perdue devient…', ['de l’énergie nucléaire', 'de l’énergie thermique', 'de la masse', 'de l’énergie potentielle'], 1, 'Les frottements échauffent les surfaces.'],
            ['Le travail d’une force de frottement est…', ['moteur', 'résistant', 'nul', 'toujours égal au poids'], 1, 'Elle s’oppose au mouvement : W < 0.'],
            ['Le mouvement d’un objet dépend du référentiel choisi.', ['Vrai', 'Faux'], 0, 'Un passager est immobile dans le train mais en mouvement par rapport au quai.'],
            ['Quelle puissance faut-il pour monter 200 kg de 10 m en 20 s ?', ['100 W', 'Environ 981 W', 'Environ 9 810 W', '400 W'], 1, 'P = m × g × h / Δt = 19 620 / 20 ≈ 981 W.'],
            ['Quelle expression donne l’énergie potentielle élastique d’un ressort ?', ['k × Δl', '½ × k × Δl²', 'm × g × z', '½ × m × v²'], 1, 'k est la raideur du ressort, Δl son allongement.'],
          ],
        },
        // ---- 7 ---------------------------------------------------------------
        {
          titre: 'Énergie transportée par la lumière',
          axe: 'Physique-chimie — Énergie',
          lecon: {
            titre: 'Irradiance, laser et photovoltaïque',
            cours: `La lumière transporte de l’énergie : c’est elle qui chauffe la Terre, découpe les tôles au laser et alimente les panneaux solaires.

## Puissance lumineuse et irradiance
L’**irradiance** (ou éclairement énergétique) est la puissance lumineuse reçue par unité de surface.
= E = P / S (W/m²)
Au sol, par beau temps et Soleil au zénith, l’irradiance solaire atteint environ **1 000 W/m²**.
Elle dépend de l’**angle** d’incidence : un panneau perpendiculaire aux rayons reçoit le maximum ; incliné, la surface « vue » par la lumière diminue.

## Le laser
Un **laser** émet une lumière :
| La propriété | Conséquence |
| **Monochromatique** (une seule longueur d’onde) | Couleur pure, pas de dispersion |
| **Directive** (faisceau très peu divergent) | L’énergie reste concentrée sur une petite surface |
| **Intense** | Irradiance énorme sur la surface éclairée |
Exemple : un laser de découpe de 2 kW concentré sur une tache de 0,2 mm de diamètre (S ≈ 3,1 × 10⁻⁸ m²) produit une irradiance d’environ **6 × 10¹⁰ W/m²**, soixante millions de fois celle du Soleil : le métal fond instantanément.

## Se protéger d’un laser
- Les lasers sont rangés en **classes** de dangerosité (de 1, sans danger, à 4, très dangereux).
- Ne **jamais** regarder le faisceau ni ses réflexions sur une surface brillante.
- Porter des lunettes adaptées à la longueur d’onde.
- Signaler la zone et capoter les machines.
Même un pointeur de faible puissance peut abîmer la rétine, car l’œil **concentre** encore le faisceau.

## La conversion photovoltaïque
Une cellule photovoltaïque convertit directement l’énergie **lumineuse** en énergie **électrique**, grâce à un matériau semi-conducteur (le silicium le plus souvent).
~ Énergie lumineuse → Cellule photovoltaïque → Énergie électrique (utile) + Énergie thermique (pertes)
= Rendement : η = P électrique / (E × S)

## Exemple travaillé
Un panneau de 1,7 m² reçoit 800 W/m² et délivre 36 V sous 7,5 A.
- Puissance lumineuse reçue : 800 × 1,7 = **1 360 W**.
- Puissance électrique : 36 × 7,5 = **270 W**.
- Rendement : 270 / 1 360 ≈ **0,20**, soit 20 %.
Le reste (80 %) est essentiellement converti en chaleur : un panneau chaud a d’ailleurs un rendement plus faible.

## Ordres de grandeur des rendements
| Le convertisseur | Rendement typique |
| Panneau photovoltaïque silicium | 15 à 22 % |
| Capteur solaire thermique | 50 à 70 % (il produit de la chaleur) |
| Photosynthèse | Environ 1 % |`,
          },
          questions: [
            ['Qu’est-ce que l’irradiance ?', ['La couleur de la lumière', 'La puissance lumineuse reçue par unité de surface', 'La vitesse de la lumière', 'L’énergie d’un photon'], 1, 'Elle s’exprime en W/m².'],
            ['Quelle est l’irradiance solaire maximale au sol par beau temps ?', ['10 W/m²', '100 W/m²', '1 000 W/m²', '100 000 W/m²'], 2, 'Environ 1 000 W/m², Soleil au zénith.'],
            ['Un panneau de 1,7 m² reçoit 800 W/m². Puissance lumineuse reçue ?', ['470 W', '1 360 W', '2 500 W', '800 W'], 1, '800 × 1,7 = 1 360 W.'],
            ['Un panneau délivre 36 V sous 7,5 A. Puissance électrique ?', ['4,8 W', '43,5 W', '270 W', '2 700 W'], 2, 'P = U × I = 36 × 7,5 = 270 W.'],
            ['Quel est alors le rendement du panneau (270 W pour 1 360 W reçus) ?', ['2 %', '20 %', '50 %', '80 %'], 1, '270 / 1 360 ≈ 0,20.'],
            ['Quelle propriété du laser concentre son énergie sur une petite surface ?', ['Sa couleur', 'Sa directivité', 'Sa température', 'Son prix'], 1, 'Le faisceau diverge très peu.'],
            ['Un laser est monochromatique : il émet…', ['toutes les couleurs', 'une seule longueur d’onde', 'uniquement de l’ultraviolet', 'une lumière blanche'], 1, 'Sa couleur est pure.'],
            ['Regarder la réflexion d’un laser sur une surface brillante est sans danger.', ['Vrai', 'Faux'], 1, 'Une réflexion peut rester très intense et abîmer la rétine.'],
            ['Que devient l’essentiel de l’énergie lumineuse non convertie par un panneau ?', ['De l’énergie chimique', 'De la chaleur', 'De l’énergie nucléaire', 'Du son'], 1, 'Le panneau s’échauffe.'],
            ['Quel matériau semi-conducteur est le plus utilisé dans les cellules photovoltaïques ?', ['Le cuivre', 'Le silicium', 'L’aluminium', 'Le verre'], 1, 'Il convertit la lumière en électricité.'],
            ['Incliner un panneau par rapport aux rayons du Soleil…', ['augmente la puissance reçue', 'diminue la puissance reçue', 'ne change rien', 'change la couleur de la lumière'], 1, 'L’idéal est d’être perpendiculaire aux rayons.'],
            ['Les lasers sont classés en classes de dangerosité de 1 à 4.', ['Vrai', 'Faux'], 0, 'La classe 4 est la plus dangereuse.'],
          ],
        },
        // ---- 8 ---------------------------------------------------------------
        {
          titre: 'Matériaux : familles, propriétés et molécules',
          axe: 'Physique-chimie — Matière et matériaux',
          lecon: {
            titre: 'De la structure de la matière aux propriétés des matériaux',
            cours: `Pourquoi le cuivre conduit-il l’électricité et pas le plastique ? Pourquoi le verre casse-t-il ? Les propriétés d’un matériau viennent de sa **structure** à l’échelle des atomes et des molécules.

## Les familles de matériaux
| La famille | Structure | Propriétés typiques |
| **Métalliques** | Atomes liés par des électrons mis en commun et mobiles | Conducteurs électriques et thermiques, ductiles, brillants |
| **Organiques** (polymères) | Macromolécules : longues chaînes d’atomes de carbone | Isolants, légers, faciles à mettre en forme |
| **Minéraux** (céramiques, verres) | Réseaux d’atomes liés très fortement | Durs, résistants à la chaleur, fragiles, isolants |
| **Composites** | Association de plusieurs matériaux (fibres + matrice) | Propriétés combinées, souvent légers et résistants |

## Les propriétés
| Le type | Exemples |
| Électriques | Conducteur ou isolant |
| Thermiques | Conductivité, tenue à la chaleur |
| Magnétiques | Le fer, le nickel et le cobalt sont attirés par un aimant |
| Chimiques | Résistance à la corrosion, aux acides |
| Mécaniques | Dureté, élasticité, résistance |
Le **cycle de vie** d’un matériau va de l’extraction de la matière première au recyclage.

## Les molécules et le schéma de Lewis
Dans une molécule, les atomes partagent des **électrons** par paires : ce sont les **liaisons covalentes**. Le **schéma de Lewis** représente les liaisons (tirets entre atomes) et les **doublets non liants** (tirets autour d’un atome).
| L’atome | Nombre de liaisons habituel | Doublets non liants |
| H | 1 | 0 |
| C | 4 | 0 |
| N | 3 | 1 |
| O | 2 | 2 |
Exemples : l’eau H–O–H (O porte 2 doublets non liants), le méthane CH4 (C au centre, 4 liaisons), le dioxyde de carbone O=C=O (deux doubles liaisons).

## Molécules et macromolécules organiques
Un **polymère** est une macromolécule formée par la répétition d’un même motif (le **monomère**) : le polyéthylène répète –CH2–CH2–. Les plastiques de synthèse, mais aussi la cellulose du bois, sont des polymères.

## Quantité de matière et concentration
= n = m / M (mol)
M : **masse molaire** (g/mol), somme des masses molaires atomiques : M(H2O) = 2 × 1,0 + 16,0 = 18,0 g/mol.
= Concentration massique : Cm = m / V (g/L)
= Concentration molaire : C = n / V (mol/L)
Exemple : 9,0 g de glucose (M = 180 g/mol) dans 0,50 L. n = 9,0 / 180 = 0,050 mol ; C = 0,050 / 0,50 = **0,10 mol/L** ; Cm = 9,0 / 0,50 = **18 g/L**.

## Le règlement CLP
Le règlement européen **CLP** (classification, étiquetage, emballage) impose des **pictogrammes** de danger sur les produits : flamme (inflammable), tête de mort (toxicité aiguë), corrosion, point d’exclamation, silhouette abîmée (danger pour la santé à long terme), environnement. On les lit **avant** toute manipulation.`,
          },
          questions: [
            ['Pourquoi les métaux conduisent-ils l’électricité ?', ['Ils sont lourds', 'Leurs électrons sont mobiles', 'Ils contiennent de l’eau', 'Ils sont brillants'], 1, 'Les électrons mis en commun se déplacent facilement.'],
            ['Quelle famille est typiquement fragile et résistante à la chaleur ?', ['Les métaux', 'Les polymères', 'Les céramiques et verres', 'Les composites'], 2, 'Leurs liaisons fortes les rendent durs mais cassants.'],
            ['Combien de liaisons forme habituellement un atome de carbone ?', ['1', '2', '3', '4'], 3, 'Le carbone est tétravalent.'],
            ['Combien de doublets non liants porte l’oxygène dans l’eau ?', ['0', '1', '2', '3'], 2, 'Il forme 2 liaisons et garde 2 doublets non liants.'],
            ['Quelle est la masse molaire de l’eau H2O (H = 1,0 ; O = 16,0) ?', ['17,0 g/mol', '18,0 g/mol', '32,0 g/mol', '34,0 g/mol'], 1, '2 × 1,0 + 16,0 = 18,0 g/mol.'],
            ['Quelle quantité de matière dans 9,0 g de glucose (M = 180 g/mol) ?', ['0,05 mol', '0,5 mol', '20 mol', '1 620 mol'], 0, 'n = m / M = 9,0 / 180 = 0,050 mol.'],
            ['0,050 mol dissoutes dans 0,50 L donnent une concentration de…', ['0,025 mol/L', '0,10 mol/L', '1,0 mol/L', '10 mol/L'], 1, 'C = n / V = 0,050 / 0,50 = 0,10 mol/L.'],
            ['Qu’est-ce qu’un polymère ?', ['Un métal pur', 'Une macromolécule formée de la répétition d’un motif', 'Un mélange d’eau et de sel', 'Un atome lourd'], 1, 'Le polyéthylène répète le motif –CH2–CH2–.'],
            ['La cellulose du bois est un polymère naturel.', ['Vrai', 'Faux'], 0, 'C’est une longue chaîne de motifs glucose.'],
            ['Que représente un tiret entre deux atomes dans un schéma de Lewis ?', ['Un doublet non liant', 'Une liaison covalente', 'Un électron seul', 'Une charge'], 1, 'Deux électrons partagés entre les atomes.'],
            ['Que signifie le pictogramme « flamme » du règlement CLP ?', ['Produit corrosif', 'Produit inflammable', 'Produit toxique pour l’environnement', 'Gaz sous pression'], 1, 'On l’éloigne de toute source de chaleur.'],
            ['Le fer est attiré par un aimant.', ['Vrai', 'Faux'], 0, 'Fer, nickel et cobalt sont ferromagnétiques.'],
          ],
        },
        // ---- 9 ---------------------------------------------------------------
        {
          titre: 'Oxydoréduction et corrosion',
          axe: 'Physique-chimie — Matière et matériaux',
          lecon: {
            titre: 'Pourquoi le fer rouille et comment le protéger',
            cours: `La rouille coûte chaque année des milliards d’euros en ponts, coques de bateaux et canalisations. Elle est le résultat d’une **réaction d’oxydoréduction** : un transfert d’électrons.

## Oxydant, réducteur
| Le terme | Définition |
| **Réducteur** | Espèce capable de **céder** des électrons |
| **Oxydant** | Espèce capable de **capter** des électrons |
| **Oxydation** | Perte d’électrons (subie par le réducteur) |
| **Réduction** | Gain d’électrons (subi par l’oxydant) |
> Moyen mnémotechnique : « un réducteur donne, un oxydant prend ».

## Les couples oxydant/réducteur
On les écrit Ox/Red, avec une **demi-équation** électronique :
= Fe²⁺ + 2 e⁻ = Fe (couple Fe²⁺/Fe)
= Cu²⁺ + 2 e⁻ = Cu (couple Cu²⁺/Cu)
= O2 + 4 H⁺ + 4 e⁻ = 2 H2O (couple O2/H2O)

## Écrire une réaction d’oxydoréduction
On combine deux demi-équations pour que les électrons **s’éliminent**.
Exemple : un clou de fer plongé dans une solution de sulfate de cuivre se couvre de cuivre.
- Oxydation du fer : Fe → Fe²⁺ + 2 e⁻
- Réduction des ions cuivre : Cu²⁺ + 2 e⁻ → Cu
- Bilan : **Fe + Cu²⁺ → Fe²⁺ + Cu**
Le fer (réducteur) a cédé 2 électrons aux ions cuivre (oxydant).

## La corrosion des métaux
La **corrosion** est l’oxydation d’un métal par son environnement : dioxygène, eau, sels. Le fer s’oxyde en ions Fe²⁺ puis en rouille (oxydes et hydroxydes de fer). L’eau salée **accélère** la corrosion (elle conduit mieux les ions).
| Le métal | Comportement |
| Fer, acier ordinaire | Rouille poreuse qui laisse la corrosion progresser |
| Aluminium, zinc | Se couvrent d’une couche d’oxyde **protectrice** |
| **Aciers inoxydables** | Contiennent du chrome, qui forme une couche passivante |
| **Métaux nobles** (or, platine) | Très difficilement oxydables |

## Se protéger de la corrosion
| La méthode | Principe |
| **Revêtement** (peinture, vernis, plastique) | Isoler le métal du milieu |
| **Galvanisation** (zingage) | Recouvrir l’acier de zinc, qui s’oxyde à sa place |
| **Anode sacrificielle** | Relier le métal à un bloc d’un métal plus réducteur (zinc, magnésium) qui se corrode à sa place — coques de bateaux, cuves |
| **Choix d’un alliage** | Inox, aluminium |
> Dans l’anode sacrificielle, le zinc est **plus réducteur** que le fer : c’est lui qui cède ses électrons.

## Les piles
Une **pile** exploite une réaction d’oxydoréduction en séparant les deux demi-réactions : les électrons passent par un circuit extérieur, ce qui produit un courant. À l’**anode** a lieu l’oxydation, à la **cathode** la réduction. Exemple : la pile Daniell (zinc et cuivre) fournit environ 1,1 V.`,
          },
          questions: [
            ['Qu’est-ce qu’un réducteur ?', ['Une espèce qui capte des électrons', 'Une espèce qui cède des électrons', 'Un catalyseur', 'Un acide'], 1, 'Un réducteur donne, un oxydant prend.'],
            ['Une oxydation est…', ['un gain d’électrons', 'une perte d’électrons', 'un gain de protons', 'une perte de masse uniquement'], 1, 'Le réducteur subit l’oxydation.'],
            ['Dans Fe + Cu²⁺ → Fe²⁺ + Cu, quelle espèce est l’oxydant ?', ['Fe', 'Cu²⁺', 'Fe²⁺', 'Cu'], 1, 'Les ions cuivre captent les électrons cédés par le fer.'],
            ['Combien d’électrons le fer cède-t-il en devenant Fe²⁺ ?', ['1', '2', '3', '4'], 1, 'Fe → Fe²⁺ + 2 e⁻.'],
            ['Pourquoi l’eau salée accélère-t-elle la corrosion ?', ['Elle est plus froide', 'Elle conduit mieux les ions', 'Elle contient moins d’oxygène', 'Elle est acide par nature'], 1, 'Les ions facilitent les échanges électriques.'],
            ['Quel élément rend un acier « inoxydable » ?', ['Le carbone', 'Le chrome', 'Le soufre', 'Le plomb'], 1, 'Il forme une couche d’oxyde protectrice.'],
            ['Qu’est-ce que la galvanisation ?', ['Peindre l’acier en rouge', 'Recouvrir l’acier de zinc', 'Chauffer l’acier', 'Plonger l’acier dans l’acide'], 1, 'Le zinc s’oxyde à la place du fer.'],
            ['Pourquoi fixe-t-on des blocs de zinc sur une coque de bateau en acier ?', ['Pour l’alourdir', 'Comme anodes sacrificielles', 'Pour la décorer', 'Pour améliorer la flottaison'], 1, 'Le zinc, plus réducteur, se corrode à la place de l’acier.'],
            ['L’or est un métal noble, très difficilement oxydable.', ['Vrai', 'Faux'], 0, 'C’est pourquoi il ne ternit pas.'],
            ['Dans une pile, à quelle électrode a lieu l’oxydation ?', ['La cathode', 'L’anode', 'Les deux', 'Aucune'], 1, 'La réduction a lieu à la cathode.'],
            ['La rouille du fer protège le métal comme la couche d’oxyde de l’aluminium.', ['Vrai', 'Faux'], 1, 'Elle est poreuse et laisse la corrosion progresser.'],
            ['Quel est le couple de la demi-équation O2 + 4 H⁺ + 4 e⁻ = 2 H2O ?', ['H2O/O2', 'O2/H2O', 'H⁺/H2', 'O2/H⁺'], 1, 'On écrit l’oxydant en premier : Ox/Red.'],
          ],
        },
        // ---- 10 --------------------------------------------------------------
        {
          titre: 'Ondes sonores et électromagnétiques',
          axe: 'Physique-chimie — Ondes et information',
          lecon: {
            titre: 'Des ondes pour transporter l’énergie et l’information',
            cours: `Le son d’une voix, les ultrasons d’une échographie, la lumière, le Wi-Fi : ce sont des **ondes**. Elles transportent de l’énergie et de l’information **sans transporter de matière**.

## Deux grandes familles
| L’onde | Support | Exemples |
| **Mécanique** | Un milieu matériel (air, eau, solide) ; ne se propage pas dans le vide | Son, ultrasons, vague, onde sismique |
| **Électromagnétique** | Aucun support nécessaire ; se propage dans le vide | Lumière, ondes radio, rayons X |
Une onde est **transversale** si la perturbation est perpendiculaire à la propagation (corde, vague), **longitudinale** si elle est parallèle (son, ressort comprimé).

## Les ondes périodiques
= Fréquence : f = 1 / T (Hz)
= Longueur d’onde : λ = v × T = v / f (m)
La **longueur d’onde** est la distance parcourue pendant une période ; c’est aussi la distance entre deux points qui vibrent en phase.
Exemple : un son de 440 Hz dans l’air (v = 340 m/s) a une longueur d’onde λ = 340 / 440 ≈ **0,77 m**.

## Les ondes sonores
- Audibles de **20 Hz à 20 kHz** ; en dessous, infrasons ; au-dessus, **ultrasons**.
- Vitesse : environ 340 m/s dans l’air, 1 500 m/s dans l’eau, plus encore dans les solides.
- Elles se **réfléchissent** (écho), se **transmettent** et sont **absorbées** par les matériaux.
- L’**intensité acoustique** I (W/m²) est la puissance sonore reçue par unité de surface.

## L’échographie
Une sonde émet des **ultrasons** qui se réfléchissent sur les frontières entre tissus. On mesure la durée de l’aller-retour :
= Distance = v × Δt / 2
Exemple : écho reçu 40 µs après l’émission dans les tissus (v ≈ 1 540 m/s) : d = 1 540 × 40 × 10⁻⁶ / 2 ≈ **3,1 cm** de profondeur.

## Les ondes électromagnétiques
Toutes se propagent dans le vide à **c = 3,00 × 10⁸ m/s**. On les classe par longueur d’onde :
| Le domaine | Longueur d’onde (ordre de grandeur) | Usage |
| Gamma | < 10 pm | Radiothérapie |
| X | 10 pm à 10 nm | Radiographie |
| Ultraviolet | 10 à 400 nm | Stérilisation, bronzage |
| **Visible** | **400 à 800 nm** | Vision |
| Infrarouge | 800 nm à 1 mm | Chauffage, télécommandes, caméras thermiques |
| Micro-ondes, radio | > 1 mm | Wi-Fi, téléphonie, radio |
Exemple : le Wi-Fi à 2,4 GHz a λ = 3,00 × 10⁸ / 2,4 × 10⁹ = **0,125 m**.

## Les sources lumineuses
Soleil et corps chauffés (spectre continu), lampes spectrales (spectre de raies), **LED** (bande étroite, bon rendement), **lasers** (monochromatiques), lampes UV. Le choix dépend de l’usage : éclairer, chauffer, désinfecter, transmettre.`,
          },
          questions: [
            ['Quelle onde peut se propager dans le vide ?', ['Le son', 'Les ultrasons', 'La lumière', 'Une vague'], 2, 'Les ondes électromagnétiques n’ont pas besoin de support.'],
            ['Le son est une onde…', ['transversale', 'longitudinale', 'électromagnétique', 'immobile'], 1, 'L’air est comprimé dans la direction de propagation.'],
            ['Longueur d’onde d’un son de 440 Hz dans l’air (340 m/s) ?', ['0,77 m', '1,29 m', '7,7 m', '149 600 m'], 0, 'λ = v / f = 340 / 440 ≈ 0,77 m.'],
            ['Quelle est la plage des fréquences audibles par l’humain ?', ['2 Hz à 2 kHz', '20 Hz à 20 kHz', '200 Hz à 200 kHz', '20 kHz à 20 MHz'], 1, 'Au-delà de 20 kHz, ce sont des ultrasons.'],
            ['Un écho revient 40 µs après l’émission (v = 1 540 m/s). Profondeur ?', ['6,2 cm', '3,1 cm', '1,5 cm', '31 cm'], 1, 'd = v × Δt / 2 = 1 540 × 40 × 10⁻⁶ / 2 ≈ 0,031 m.'],
            ['Pourquoi divise-t-on par 2 dans le calcul de l’échographie ?', ['Par convention', 'Parce que l’onde fait un aller-retour', 'Parce que le son ralentit', 'Pour tenir compte de la température'], 1, 'Δt correspond à l’aller et au retour.'],
            ['Quelle est la vitesse de la lumière dans le vide ?', ['340 m/s', '3,00 × 10⁵ m/s', '3,00 × 10⁸ m/s', '1 540 m/s'], 2, 'Environ 300 000 km/s.'],
            ['Quel est l’intervalle de longueurs d’onde du visible ?', ['4 à 8 nm', '400 à 800 nm', '400 à 800 µm', '4 à 8 m'], 1, 'Du violet (400 nm) au rouge (800 nm).'],
            ['Longueur d’onde du Wi-Fi à 2,4 GHz ?', ['1,25 mm', '12,5 cm', '1,25 m', '125 m'], 1, 'λ = 3,00 × 10⁸ / 2,4 × 10⁹ = 0,125 m.'],
            ['Quel domaine sert à la radiographie médicale ?', ['Les infrarouges', 'Les rayons X', 'Les ondes radio', 'Le visible'], 1, 'Ils traversent les tissus mous mais moins les os.'],
            ['Une onde transporte de la matière d’un point à un autre.', ['Vrai', 'Faux'], 1, 'Elle transporte de l’énergie et de l’information, pas de matière.'],
            ['Une télécommande de téléviseur utilise généralement…', ['les ultraviolets', 'les infrarouges', 'les rayons gamma', 'les ultrasons'], 1, 'Invisible à l’œil, facile à émettre avec une LED.'],
          ],
        },
        // ---- 11 --------------------------------------------------------------
        {
          titre: 'Trigonométrie et fonctions sinusoïdales',
          axe: 'Mathématiques — Géométrie dans le plan',
          lecon: {
            titre: 'Le cercle trigonométrique au service des signaux',
            cours: `Le courant du secteur, une vibration, un son pur : tous sont décrits par des fonctions **sinusoïdales**. Pour les manipuler, il faut maîtriser le **cercle trigonométrique** et le **radian**.

## Le radian
Le **radian** est l’angle qui intercepte, sur un cercle de rayon R, un arc de longueur R. Un tour complet vaut **2π rad**.
= Conversion : angle en rad = angle en degrés × π / 180
| Degrés | 0 | 30 | 45 | 60 | 90 | 180 | 360 |
| Radians | 0 | π/6 | π/4 | π/3 | π/2 | π | 2π |

## Le cercle trigonométrique
C’est le cercle de centre O et de rayon 1, parcouru dans le sens **direct** (inverse des aiguilles d’une montre). À un réel x, on associe un point M ; ses coordonnées sont **(cos x ; sin x)**.
= cos² x + sin² x = 1
= −1 ≤ cos x ≤ 1 et −1 ≤ sin x ≤ 1
Un angle orienté a une infinité de mesures, qui diffèrent de 2π : x et x + 2kπ repèrent le même point. La **mesure principale** est celle comprise dans ]−π ; π].

## Valeurs remarquables
| x | 0 | π/6 | π/4 | π/3 | π/2 |
| cos x | 1 | √3/2 | √2/2 | 1/2 | 0 |
| sin x | 0 | 1/2 | √2/2 | √3/2 | 1 |

## Les angles associés
| L’angle | cos | sin |
| −x | cos x | −sin x |
| π − x | −cos x | sin x |
| π + x | −cos x | −sin x |
| π/2 − x | sin x | cos x |
| π/2 + x | −sin x | cos x |
On les retrouve toujours par **symétrie** sur le cercle.

## Résoudre cos x = a ou sin x = a
Exemple : cos x = 1/2 sur ]−π ; π]. Sur le cercle, deux points ont pour abscisse 1/2 : **x = π/3 ou x = −π/3**.
Exemple : sin x = 1/2 sur [0 ; 2π[ : **x = π/6 ou x = 5π/6** (car sin(π − x) = sin x).

## Les fonctions sinusoïdales
= u(t) = A × cos(ω t + φ)
| Le paramètre | Nom | Unité |
| A | Amplitude (valeur maximale) | Celle de la grandeur (V, m…) |
| ω | Pulsation | rad/s |
| φ | Phase à l’origine | rad |
| ω t + φ | Phase à l’instant t | rad |
= Période : T = 2π / ω ; fréquence : f = 1 / T ; donc ω = 2π f

## Exemple travaillé
La tension du secteur s’écrit u(t) = 325 cos(100π t).
- Amplitude : **325 V**.
- Pulsation : ω = 100π ≈ 314 rad/s.
- Période : T = 2π / (100π) = 1/50 = **0,02 s** ; fréquence **50 Hz**.
- À t = 5 ms : u = 325 cos(100π × 0,005) = 325 cos(π/2) = **0 V**.`,
          },
          questions: [
            ['Combien vaut 60° en radians ?', ['π/6', 'π/4', 'π/3', 'π/2'], 2, '60 × π / 180 = π/3.'],
            ['Combien vaut π/4 rad en degrés ?', ['30°', '45°', '60°', '90°'], 1, 'π/4 × 180/π = 45°.'],
            ['Quelle relation est toujours vraie ?', ['cos x + sin x = 1', 'cos² x + sin² x = 1', 'cos x × sin x = 1', 'cos² x − sin² x = 1'], 1, 'C’est le théorème de Pythagore sur le cercle de rayon 1.'],
            ['Que vaut cos(π/3) ?', ['0', '1/2', '√2/2', '√3/2'], 1, 'Valeur remarquable à connaître.'],
            ['Que vaut sin(π − x) ?', ['−sin x', 'sin x', 'cos x', '−cos x'], 1, 'Les points de x et π − x sont symétriques par rapport à l’axe vertical.'],
            ['Solutions de cos x = 1/2 sur ]−π ; π] ?', ['π/6 et −π/6', 'π/3 et −π/3', 'π/3 et 2π/3', 'π/6 et 5π/6'], 1, 'Deux points du cercle ont pour abscisse 1/2.'],
            ['Solutions de sin x = 1/2 sur [0 ; 2π[ ?', ['π/6 et 5π/6', 'π/3 et 2π/3', 'π/6 et 7π/6', 'π/4 et 3π/4'], 0, 'sin(π − π/6) = sin(π/6) = 1/2.'],
            ['Quelle est la période de u(t) = 325 cos(100π t) ?', ['0,01 s', '0,02 s', '0,05 s', '100π s'], 1, 'T = 2π / ω = 2π / (100π) = 0,02 s.'],
            ['Quelle relation relie la pulsation et la fréquence ?', ['ω = f / 2π', 'ω = 2π f', 'ω = f²', 'ω = 1 / f'], 1, 'ω = 2π f ; et comme f = 1/T, on a aussi T = 2π / ω.'],
            ['x et x + 2π repèrent le même point du cercle trigonométrique.', ['Vrai', 'Faux'], 0, 'Un tour complet ramène au même point.'],
            ['Que vaut cos(−x) ?', ['−cos x', 'cos x', 'sin x', '−sin x'], 1, 'La fonction cosinus est paire.'],
            ['Dans u(t) = A cos(ω t + φ), que représente A ?', ['La pulsation', 'L’amplitude', 'La phase', 'La période'], 1, 'C’est la valeur maximale de u.'],
          ],
        },
        // ---- 12 --------------------------------------------------------------
        {
          titre: 'Produit scalaire',
          axe: 'Mathématiques — Géométrie dans le plan',
          lecon: {
            titre: 'Multiplier deux vecteurs pour obtenir un nombre',
            cours: `Le **produit scalaire** associe à deux vecteurs un **nombre réel**. Il sert à calculer des angles et des longueurs, à démontrer des orthogonalités… et, en physique, à calculer le **travail d’une force**.

## Définition géométrique
Pour deux vecteurs u et v non nuls formant un angle θ :
= u · v = ‖u‖ × ‖v‖ × cos θ
Si u ou v est nul, u · v = 0.
| L’angle θ | Signe de u · v |
| Aigu (θ < 90°) | Positif |
| Droit (θ = 90°) | Nul |
| Obtus (θ > 90°) | Négatif |

## Interprétation par la projection
‖u‖ × cos θ est la **projection** (algébrique) de u sur l’axe dirigé par v. Donc :
= u · v = (projection de u sur v) × ‖v‖
C’est exactement le travail d’une force : seule la composante de la force **dans la direction du déplacement** travaille.

## Expression dans un repère orthonormé
Si u(x ; y) et v(x’ ; y’) :
= u · v = x x’ + y y’
= ‖u‖ = √(x² + y²)
Exemple : u(3 ; 4) et v(2 ; −1). u · v = 3 × 2 + 4 × (−1) = **2**. ‖u‖ = 5, ‖v‖ = √5.

## Propriétés
- **Symétrie** : u · v = v · u.
- **Bilinéarité** : u · (v + w) = u · v + u · w ; (k u) · v = k (u · v).
- u · u = ‖u‖².

## Orthogonalité
> Deux vecteurs sont **orthogonaux** si et seulement si leur produit scalaire est **nul**.
Exemple : u(2 ; 3) et v(−3 ; 2) : u · v = −6 + 6 = 0, ils sont orthogonaux.

## Calculer un angle
= cos θ = u · v / (‖u‖ × ‖v‖)
Exemple : u(1 ; 1) et v(1 ; 0) : u · v = 1, ‖u‖ = √2, ‖v‖ = 1, cos θ = 1/√2 = √2/2, donc **θ = 45°**.

## Le théorème d’Al-Kashi
Dans un triangle ABC, avec a = BC, b = AC, c = AB et l’angle Â :
= a² = b² + c² − 2 b c cos Â
C’est une **généralisation de Pythagore** : si Â = 90°, cos Â = 0 et on retrouve a² = b² + c².
Exemple : b = 5, c = 8, Â = 60° : a² = 25 + 64 − 2 × 5 × 8 × 0,5 = 49, donc **a = 7**.

## Lien avec la physique : le travail
= W = F · AB = F × AB × cos α
Une force de 100 N tire un chariot sur 10 m avec un angle de 60° : W = 100 × 10 × 0,5 = **500 J**. Le poids d’un objet qui se déplace horizontalement ne travaille pas : il est perpendiculaire au déplacement. Et le travail de la résultante est la somme des travaux de chaque force : c’est la **bilinéarité**.`,
          },
          questions: [
            ['Que donne le produit scalaire de deux vecteurs ?', ['Un vecteur', 'Un nombre réel', 'Un angle', 'Une matrice'], 1, 'D’où son nom de produit « scalaire ».'],
            ['Si l’angle entre deux vecteurs est obtus, le produit scalaire est…', ['positif', 'nul', 'négatif', 'égal à 1'], 2, 'cos θ est alors négatif.'],
            ['u(3 ; 4) et v(2 ; −1) : u · v vaut…', ['2', '10', '−2', '14'], 0, '3 × 2 + 4 × (−1) = 6 − 4 = 2.'],
            ['Quelle est la norme de u(3 ; 4) ?', ['5', '7', '12', '25'], 0, '‖u‖ = √(x² + y²) = √(9 + 16) = √25 = 5.'],
            ['Deux vecteurs sont orthogonaux si et seulement si…', ['leurs normes sont égales', 'leur produit scalaire est nul', 'ils sont colinéaires', 'leur somme est nulle'], 1, 'u · v = ‖u‖ × ‖v‖ × cos θ. Pour un angle droit, cos 90° = 0 : le produit scalaire est nul.'],
            ['u(2 ; 3) et v(−3 ; 2) sont-ils orthogonaux ?', ['Oui', 'Non', 'Seulement si l’on change de repère', 'On ne peut pas savoir'], 0, '2 × (−3) + 3 × 2 = 0.'],
            ['Angle entre u(1 ; 1) et v(1 ; 0) ?', ['30°', '45°', '60°', '90°'], 1, 'cos θ = 1 / √2 = √2/2.'],
            ['b = 5, c = 8, Â = 60° : que vaut a (Al-Kashi) ?', ['√89', '7', '13', '√39'], 1, 'a² = 25 + 64 − 40 = 49.'],
            ['Le théorème d’Al-Kashi avec Â = 90° redonne…', ['Thalès', 'Pythagore', 'la loi d’Ohm', 'la relation de Chasles'], 1, 'a² = b² + c² − 2bc cos Â. Avec Â = 90°, cos Â = 0 : il reste a² = b² + c², le théorème de Pythagore.'],
            ['Travail d’une force de 100 N sur 10 m avec un angle de 60° ?', ['1 000 J', '866 J', '500 J', '0 J'], 2, 'W = 100 × 10 × cos 60° = 500 J.'],
            ['Le poids d’un objet qui se déplace horizontalement ne travaille pas.', ['Vrai', 'Faux'], 0, 'Il est perpendiculaire au déplacement.'],
            ['Que vaut u · u ?', ['0', '1', '‖u‖²', '2 ‖u‖'], 2, 'L’angle d’un vecteur avec lui-même est nul.'],
          ],
        },
        // ---- 13 --------------------------------------------------------------
        {
          titre: 'Nombres complexes',
          axe: 'Mathématiques — Nombres complexes',
          lecon: {
            titre: 'Un nombre, deux coordonnées',
            cours: `Les **nombres complexes** étendent les réels avec un nombre i tel que **i² = −1**. En électricité, ils permettent de manipuler les tensions et courants sinusoïdaux comme de simples nombres.

## La forme algébrique
Tout nombre complexe s’écrit de façon unique :
= z = a + i b (a et b réels)
| Le terme | Nom |
| a = Re(z) | **Partie réelle** |
| b = Im(z) | **Partie imaginaire** |
Si b = 0, z est réel ; si a = 0, z est **imaginaire pur**.

## Opérations
On calcule comme avec des réels, en remplaçant i² par −1.
- (2 + 3i) + (1 − i) = **3 + 2i**
- (2 + 3i)(1 − i) = 2 − 2i + 3i − 3i² = 2 + i + 3 = **5 + i**

## Le conjugué
= Conjugué de z = a + i b : z̄ = a − i b
= z × z̄ = a² + b² (un réel positif)
Il sert à **diviser** : on multiplie numérateur et dénominateur par le conjugué du dénominateur.
Exemple : (1 + 2i) / (1 − i) = (1 + 2i)(1 + i) / ((1 − i)(1 + i)) = (1 + i + 2i + 2i²) / 2 = (−1 + 3i) / 2 = **−0,5 + 1,5i**.

## Représentation géométrique
Dans un repère orthonormé, z = a + i b est représenté par le point **M(a ; b)**, ou le vecteur OM. On dit que M a pour **affixe** z.
- Le conjugué z̄ est le **symétrique** de M par rapport à l’axe des réels.

## Module et argument
= Module : |z| = √(a² + b²) = OM
= Argument : arg(z) = θ, angle orienté entre l’axe des réels et OM (défini à 2π près)
= cos θ = a / |z| et sin θ = b / |z|

## La forme trigonométrique
= z = r (cos θ + i sin θ) avec r = |z|
Exemple : z = 1 + i. |z| = √2 ; cos θ = 1/√2 = √2/2 et sin θ = √2/2, donc θ = π/4.
**z = √2 (cos π/4 + i sin π/4)**.
Exemple : z = −2i. |z| = 2, θ = −π/2 : z = 2 (cos(−π/2) + i sin(−π/2)).

## Passer d’une forme à l’autre
- Trigonométrique → algébrique : a = r cos θ, b = r sin θ. Ainsi 4 (cos π/3 + i sin π/3) = 4 × 0,5 + i × 4 × √3/2 = **2 + 2√3 i**.
- Algébrique → trigonométrique : calculer r, puis θ par son cosinus et son sinus (en regardant le signe de a et b pour placer le point).

## Et en physique ?
Une tension sinusoïdale d’amplitude U et de phase φ peut être associée au complexe de module U et d’argument φ. Additionner deux tensions de même fréquence revient à **additionner deux complexes** — c’est bien plus simple qu’additionner deux cosinus. La notation exponentielle, qui rend les produits encore plus simples, est vue en terminale.`,
          },
          questions: [
            ['Que vaut i² ?', ['1', '−1', 'i', '0'], 1, 'C’est la propriété qui définit i.'],
            ['Quelle est la partie imaginaire de z = 4 − 7i ?', ['4', '7', '−7', '−7i'], 2, 'La partie imaginaire est le réel b, ici −7.'],
            ['Que vaut (2 + 3i) + (1 − i) ?', ['3 + 2i', '3 + 4i', '1 + 4i', '2 − 3i'], 0, 'On additionne parties réelles et imaginaires.'],
            ['Que vaut (2 + 3i)(1 − i) ?', ['5 + i', '−1 + i', '2 − 3i', '5 − i'], 0, '2 − 2i + 3i − 3i² = 2 + i + 3.'],
            ['Quel est le conjugué de 3 + 5i ?', ['−3 + 5i', '3 − 5i', '−3 − 5i', '5 + 3i'], 1, 'On change le signe de la partie imaginaire.'],
            ['Que vaut z × z̄ pour z = 3 + 4i ?', ['7', '25', '−7', '5'], 1, 'a² + b² = 9 + 16 = 25.'],
            ['Quel est le module de z = 3 + 4i ?', ['3', '4', '5', '7'], 2, '|z| = √(a² + b²) = √(9 + 16) = √25 = 5.'],
            ['Quel est un argument de z = 1 + i ?', ['0', 'π/4', 'π/2', 'π'], 1, 'cos θ = sin θ = √2/2.'],
            ['Forme algébrique de 4 (cos π/3 + i sin π/3) ?', ['2 + 2√3 i', '2√3 + 2i', '4 + 4i', '2 + 2i'], 0, 'a = 4 × 1/2 = 2 et b = 4 × √3/2 = 2√3.'],
            ['Le point d’affixe z̄ est le symétrique du point d’affixe z par rapport à l’axe des réels.', ['Vrai', 'Faux'], 0, 'Sa partie imaginaire change de signe.'],
            ['Quel est un argument de −2i ?', ['π/2', '−π/2', 'π', '0'], 1, 'Le point (0 ; −2) est sur l’axe imaginaire, en bas.'],
            ['Un argument d’un nombre complexe est défini à 2π près.', ['Vrai', 'Faux'], 0, 'θ et θ + 2π repèrent la même direction.'],
          ],
        },
        // ---- 14 --------------------------------------------------------------
        {
          titre: 'Dérivation',
          axe: 'Mathématiques — Analyse',
          lecon: {
            titre: 'Mesurer la vitesse de variation d’une grandeur',
            cours: `La **dérivée** mesure la vitesse à laquelle une grandeur varie. En physique, elle est partout : la vitesse est la dérivée de la position, la puissance la dérivée de l’énergie.

## Du taux de variation au nombre dérivé
Le **taux de variation** de f entre x0 et x0 + h :
= [f(x0 + h) − f(x0)] / h
Quand h tend vers 0, s’il a une limite finie, c’est le **nombre dérivé** f’(x0). On note aussi df/dx (x0).
Géométriquement, f’(x0) est le **coefficient directeur de la tangente** à la courbe au point d’abscisse x0.
= Tangente : y = f’(x0)(x − x0) + f(x0)

## L’approximation affine
Près de x0, la courbe ressemble à sa tangente :
= f(x0 + h) ≈ f(x0) + f’(x0) × h
En physique : Δy ≈ f’(x0) × Δx. Exemple : f(x) = √x en x0 = 100 ; f’(100) = 1/20. √101 ≈ 10 + 1/20 = **10,05** (valeur exacte 10,0499…).

## Les dérivées usuelles
| f(x) | f’(x) |
| k (constante) | 0 |
| x | 1 |
| xⁿ (n entier ≥ 1) | n xⁿ⁻¹ |
| 1/x | −1/x² |
| √x | 1/(2√x) |
| cos x | −sin x |
| sin x | cos x |

## Les opérations
| Fonction | Dérivée |
| u + v | u’ + v’ |
| k u | k u’ |
| u × v | u’ v + u v’ |
| 1/v | −v’/v² |
| u/v | (u’ v − u v’)/v² |
| f(a x + b) | a f’(a x + b) |
| A cos(ω t + φ) | −A ω sin(ω t + φ) |
| A sin(ω t + φ) | A ω cos(ω t + φ) |

## Étudier les variations
> Si f’ > 0 sur un intervalle, f y est **croissante** ; si f’ < 0, **décroissante**. Là où f’ s’annule en changeant de signe, f a un **extremum**.

## Exemple travaillé
f(x) = x³ − 3x² + 1 sur [−1 ; 3].
- f’(x) = 3x² − 6x = 3x(x − 2).
- f’ s’annule en 0 et en 2 ; f’ > 0 sur [−1 ; 0[, f’ < 0 sur ]0 ; 2[, f’ > 0 sur ]2 ; 3].
- f est croissante, puis décroissante, puis croissante : maximum local f(0) = **1**, minimum local f(2) = 8 − 12 + 1 = **−3**.

## Lien avec la physique
- Position x(t) → vitesse v(t) = x’(t) → accélération a(t) = v’(t).
- Énergie E(t) → puissance P(t) = E’(t).
Exemple : x(t) = 2t² + 3t (en m). v(t) = 4t + 3 ; à t = 2 s, v = **11 m/s** ; a = 4 m/s², constante.`,
          },
          questions: [
            ['Que représente géométriquement f’(x0) ?', ['L’ordonnée du point', 'Le coefficient directeur de la tangente en x0', 'L’aire sous la courbe', 'La valeur maximale de f'], 1, 'C’est la pente de la tangente.'],
            ['Quelle est la dérivée de x³ ?', ['3x', 'x²', '3x²', 'x⁴/4'], 2, 'n xⁿ⁻¹ avec n = 3.'],
            ['Quelle est la dérivée de 1/x ?', ['1/x²', '−1/x²', 'ln x', '−1/x'], 1, 'Formule à connaître.'],
            ['Quelle est la dérivée de sin x ?', ['cos x', '−cos x', '−sin x', 'sin x'], 0, 'Et la dérivée de cos x est −sin x.'],
            ['Quelle est la dérivée de 5 cos(2t) ?', ['−10 sin(2t)', '10 sin(2t)', '−5 sin(2t)', '10 cos(2t)'], 0, '−A ω sin(ω t) avec A = 5, ω = 2.'],
            ['Quelle est la dérivée de u × v ?', ['u’ × v’', 'u’ v + u v’', 'u’ v − u v’', 'u v’ − u’ v'], 1, 'Formule du produit.'],
            ['Pour f(x) = x³ − 3x² + 1, f’(x) vaut…', ['3x² − 6x', 'x² − 6x', '3x² − 3x', '3x² − 6x + 1'], 0, 'La dérivée de la constante 1 est nulle.'],
            ['Pour f(x) = x³ − 3x² + 1, où f’ s’annule-t-elle ?', ['En 0 et 2', 'En 1 et 3', 'En −1 et 2', 'Nulle part'], 0, 'f’(x) = 3x(x − 2) : un produit est nul quand l’un de ses facteurs l’est, donc en x = 0 et en x = 2.', 'Pour cette fonction, où f’ s’annule-t-elle ?'],
            ['Si f’ < 0 sur un intervalle, f y est…', ['croissante', 'décroissante', 'constante', 'positive'], 1, 'Le signe de la dérivée donne le sens de variation.'],
            ['x(t) = 2t² + 3t. Vitesse à t = 2 s ?', ['7 m/s', '11 m/s', '14 m/s', '4 m/s'], 1, 'v(t) = 4t + 3, v(2) = 11.'],
            ['L’accélération est la dérivée de la vitesse par rapport au temps.', ['Vrai', 'Faux'], 0, 'Et la vitesse est la dérivée de la position.'],
            ['Valeur approchée de √101 par l’approximation affine en 100 ?', ['10,01', '10,05', '10,1', '10,5'], 1, '√101 ≈ 10 + 1/(2 × 10) = 10,05.'],
          ],
        },
        // ---- 15 --------------------------------------------------------------
        {
          titre: 'Primitives et méthode d’Euler',
          axe: 'Mathématiques — Analyse',
          lecon: {
            titre: 'Remonter de la dérivée à la fonction',
            cours: `Si l’on connaît la vitesse d’un mobile à chaque instant, peut-on retrouver sa position ? Oui : il faut chercher une **primitive**, c’est-à-dire faire le chemin inverse de la dérivation.

## Définition
F est une **primitive** de f sur un intervalle I si, pour tout x de I :
= F’(x) = f(x)
Exemple : F(x) = x² est une primitive de f(x) = 2x, car (x²)’ = 2x.

## Une infinité de primitives
> Deux primitives d’une même fonction sur un intervalle **diffèrent d’une constante**.
Si F est une primitive de f, toutes les primitives s’écrivent F(x) + C, C réel. Géométriquement, leurs courbes se déduisent l’une de l’autre par **translation verticale**.
Pour choisir la bonne, il faut une **condition initiale** : la valeur en un point.

## Les primitives usuelles
| f(x) | Une primitive F(x) |
| k | k x |
| x | x²/2 |
| xⁿ (n ≥ 1) | xⁿ⁺¹/(n + 1) |
| polynôme | primitive terme à terme |
| cos(ω t + φ) | (1/ω) sin(ω t + φ) |
| sin(ω t + φ) | −(1/ω) cos(ω t + φ) |
Vérifie toujours en **dérivant** ta primitive : tu dois retrouver f.

## Exemple travaillé : de la vitesse à la position
Un mobile a une vitesse v(t) = 3t² + 2 (en m/s) et se trouve en x = 5 m à t = 0.
- Primitives : x(t) = t³ + 2t + C.
- Condition initiale : x(0) = C = 5.
- Donc **x(t) = t³ + 2t + 5**. À t = 2 s : x = 8 + 4 + 5 = **17 m**.

## Exemple : un signal sinusoïdal
Primitive de f(t) = 6 cos(3t) : F(t) = 6 × (1/3) sin(3t) = **2 sin(3t)** (+ C). Vérification : (2 sin 3t)’ = 2 × 3 cos 3t = 6 cos 3t.

## La méthode d’Euler
Quand on ne sait pas trouver une primitive explicite, on construit une **approximation** de sa courbe, point par point. On part d’un point connu (x0 ; y0) et on avance d’un **pas** h en suivant la tangente :
= x(n+1) = x(n) + h
= y(n+1) = y(n) + h × f(x(n))
C’est l’approximation affine appliquée à répétition.

## Exemple d’Euler
On cherche F telle que F’(x) = 1/x et F(1) = 0, avec un pas h = 0,5.
| n | x | y | f(x) = 1/x |
| 0 | 1 | 0 | 1 |
| 1 | 1,5 | 0 + 0,5 × 1 = 0,5 | 0,667 |
| 2 | 2 | 0,5 + 0,5 × 0,667 ≈ 0,833 | 0,5 |
| 3 | 2,5 | 0,833 + 0,25 ≈ 1,083 | 0,4 |
On obtient F(2) ≈ 0,83. (Tu découvriras en terminale que la valeur exacte est ln 2 ≈ 0,69 : la méthode surestime ici, car la courbe est concave.)
> Plus le pas est petit, plus l’approximation est précise, mais plus il faut d’étapes : c’est ce que calculent un tableur ou un programme en boucle.`,
          },
          questions: [
            ['F est une primitive de f si…', ['F = f’', 'F’ = f', 'F × f = 1', 'F(0) = f(0)'], 1, 'On remonte de la dérivée à la fonction.'],
            ['Une primitive de f(x) = 2x est…', ['2', 'x²', '2x²', 'x²/4'], 1, 'On cherche une fonction dont la dérivée est 2x : (x²)’ = 2x, donc x² convient.'],
            ['Deux primitives d’une même fonction sur un intervalle…', ['sont égales', 'diffèrent d’une constante', 'sont opposées', 'n’existent pas'], 1, 'Leurs courbes se déduisent par translation verticale.'],
            ['Une primitive de x³ est…', ['3x²', 'x⁴', 'x⁴/4', 'x⁴/3'], 2, 'xⁿ⁺¹/(n + 1) avec n = 3.'],
            ['Une primitive de 6 cos(3t) est…', ['18 sin(3t)', '2 sin(3t)', '−2 sin(3t)', '6 sin(3t)'], 1, '6 × (1/3) sin(3t).'],
            ['Une primitive de sin t est…', ['cos t', '−cos t', '−sin t', 'sin t'], 1, 'La dérivée de −cos t est sin t.'],
            ['v(t) = 3t² + 2 et x(0) = 5. Que vaut x(t) ?', ['t³ + 2t', 't³ + 2t + 5', '6t + 5', '3t³ + 2t + 5'], 1, 'On ajoute la constante fixée par la condition initiale.'],
            ['Avec x(t) = t³ + 2t + 5, que vaut x(2) ?', ['13 m', '17 m', '21 m', '9 m'], 1, '8 + 4 + 5 = 17.'],
            ['Quelle relation utilise la méthode d’Euler ?', ['y(n+1) = y(n) + h × f(x(n))', 'y(n+1) = y(n) × h', 'y(n+1) = f(x(n)) / h', 'y(n+1) = y(n) − h'], 0, 'On suit la tangente sur un pas h.'],
            ['Avec F(1) = 0, F’(x) = 1/x et h = 0,5, que donne la première étape en x = 1,5 ?', ['0,25', '0,5', '0,667', '1'], 1, 'y1 = 0 + 0,5 × 1/1 = 0,5.'],
            ['Diminuer le pas de la méthode d’Euler améliore en général la précision.', ['Vrai', 'Faux'], 0, 'Au prix d’un plus grand nombre d’étapes.'],
            ['Comment vérifier une primitive ?', ['En l’intégrant', 'En la dérivant', 'En la multipliant par x', 'On ne peut pas'], 1, 'Sa dérivée doit redonner la fonction de départ.'],
          ],
        },
      ],
    },
  ],
}
