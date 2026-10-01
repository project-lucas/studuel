// CHIMIE, BIOLOGIE ET PHYSIOPATHOLOGIE HUMAINES — TERMINALE ST2S.
//
// Programme officiel : annexe 1 de l'arrêté du 19/07/2019, BO spécial n° 8 du
// 25 juillet 2019 (« Programme de chimie, biologie et physiopathologie humaines
// de terminale ST2S »). Deux parties indépendantes :
//   · CHIMIE, en trois thèmes — Prévenir et sécuriser (sécurité routière,
//     alimentation, environnement) · Analyser et diagnostiquer (imagerie
//     médicale, analyse chimique des milieux biologiques et naturels) · Faire
//     des choix autonomes et responsables (biomolécules et oligoéléments,
//     médicament, cosmétiques) ;
//   · BIOLOGIE ET PHYSIOPATHOLOGIE HUMAINES, en quatre chapitres — Milieu
//     intérieur et homéostasie · Système immunitaire et défense de l'organisme ·
//     Appareil reproducteur et transmission de la vie · Gènes et transmission
//     de l'information génétique.
// Chaque fiche porte en `axe` le thème (chimie) ou le chapitre (biologie) qui
// la coiffe.
//
// Épreuve écrite (note de service n° 2020-013, version consolidée d'août
// 2024) : 4 heures, deux copies — chimie (durée indicative 1 h, sur 20,
// coefficient 3, deux exercices indépendants) et biologie et physiopathologie
// humaines (durée indicative 3 h, sur 20, coefficient 13, au moins deux
// chapitres, dix pages et huit annexes au plus). D'où la fiche méthode, et la
// part plus large faite à la biologie (9 fiches contre 6).
//
// Matière NEUVE (slug `chimie-biologie-physiopathologie`), déclarée pour la
// seule classe « Tle techno » : le contenu est rangé au niveau 'Tle'. Les
// acquis de première (biologie-physiopathologie-1re.mjs,
// physique-chimie-sante-1re.mjs) ne sont pas répétés : appareils digestif,
// cardio-vasculaire, respiratoire, locomoteur ; concentrations, pH,
// oxydoréduction, molécules organiques.
//
// Données médicales vérifiées en septembre 2026 (seuils du diabète, dépistage
// organisé, délai légal de l'IVG depuis la loi du 2 mars 2022, loi de
// bioéthique du 2 août 2021).

export default {
  slug: 'chimie-biologie-physiopathologie',
  nom: 'Chimie, biologie et physiopathologie humaines',

  titreMigration: 'CHIMIE, BIOLOGIE ET PHYSIOPATHOLOGIE HUMAINES Tle ST2S — le programme officiel (16 fiches)',

  motif: `La terminale ST2S n'avait aucun contenu de chimie, biologie et
physiopathologie humaines. Cette migration installe 16 fiches qui suivent le
programme officiel (BO spécial n° 8 du 25 juillet 2019) : 6 fiches de chimie sur
ses trois thèmes, 9 fiches de biologie et physiopathologie humaines sur ses
quatre chapitres, et une fiche méthode de l'épreuve écrite, 12 questions
chacune.`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 1,
      chapitres: [
        // ──────────────── CHIMIE — PRÉVENIR ET SÉCURISER ────────────────
        {
          titre: 'Sécurité routière et sécurité des aliments',
          axe: 'Chimie : prévenir et sécuriser',
          lecon: {
            titre: 'Airbag, alcootest, dégradation et conservation des aliments',
            cours: `Un coussin gonflable qui se déploie en quelques millisecondes, un éthylotest qui change de couleur, un beurre qui rancit : trois transformations chimiques qui touchent directement à ta sécurité.

## L'airbag : un bilan de matière
Lors d'un choc, un détonateur déclenche la décomposition d'un solide qui libère un grand volume de diazote. Le modèle historique utilise l'azoture de sodium :
= 2 NaN₃ → 2 Na + 3 N₂
Pour un gaz, on relie la quantité de matière au volume par le **volume molaire** Vm :
= V = n × Vm, avec Vm ≈ 24 L/mol à 20 °C sous la pression atmosphérique

**Exemple travaillé** : 130 g d'azoture de sodium (M = 65 g/mol).
1. n(NaN₃) = m ÷ M = 130 ÷ 65 = 2,0 mol.
2. D'après l'équation, 2 mol de NaN₃ donnent 3 mol de N₂ : n(N₂) = 3,0 mol.
3. V(N₂) = 3,0 × 24 = 72 L : de quoi gonfler le coussin.

> Les coefficients de l'équation donnent les **proportions** : c'est la base de tout bilan de matière. L'azoture étant toxique, les générateurs actuels utilisent d'autres composés, sur le même principe.

## L'alcootest : une oxydoréduction
L'éthylotest chimique contient des ions dichromate (orange) qui oxydent l'éthanol de l'air expiré ; ils sont réduits en ions chrome III (verts).
| Le couple | La demi-équation |
| Cr₂O₇²⁻ / Cr³⁺ | Cr₂O₇²⁻ + 14 H⁺ + 6 e⁻ = 2 Cr³⁺ + 7 H₂O |
| CH₃COOH / C₂H₅OH | CH₃COOH + 4 H⁺ + 4 e⁻ = C₂H₅OH + H₂O |
On égalise les électrons échangés (12 = 2 × 6 = 3 × 4) :
= 2 Cr₂O₇²⁻ + 16 H⁺ + 3 C₂H₅OH → 4 Cr³⁺ + 11 H₂O + 3 CH₃COOH
Plus la zone verte est longue, plus l'air expiré contient d'alcool. Les éthylomètres électroniques mesurent la même chose par d'autres principes.
= Seuil légal : 0,5 g d'alcool par litre de sang, soit 0,25 mg par litre d'air expiré (0,2 g/L pour les jeunes conducteurs et les conducteurs de transport en commun)
Les **stupéfiants** (cannabis, cocaïne, opiacés, amphétamines) sont dépistés par un test salivaire, confirmé ensuite par une analyse en laboratoire.

## La dégradation des aliments
| Le phénomène | Ce qui se passe | Les facteurs |
| **Brunissement enzymatique** (pomme coupée) | Une enzyme, la polyphénol oxydase, oxyde des polyphénols par le dioxygène : il se forme des pigments bruns | Dioxygène, température |
| **Rancissement oxydatif** | Le dioxygène oxyde les acides gras insaturés | Dioxygène, lumière, chaleur |
| **Rancissement hydrolytique** (beurre) | L'**hydrolyse des triglycérides** libère des acides gras à l'odeur forte | Eau, enzymes, micro-organismes |
| **Caillage du lait** | Des bactéries transforment le lactose en acide lactique ; l'acidité fait coaguler les protéines | Micro-organismes, température |

## La conservation
| Procédés **physiques** | Procédés **chimiques** |
| Froid : réfrigération, congélation | Conservateurs (additifs E200 à E299) |
| Chaleur : pasteurisation, stérilisation | Antioxydants (E300 et suivants, comme l'acide ascorbique) |
| Élimination de l'eau : séchage, lyophilisation | Salage, sucrage, acidification |
| Emballage sous vide ou sous atmosphère contrôlée | |

## Contrôler la qualité
- La **fraîcheur d'un lait** se mesure par un dosage de son acidité, exprimée en degrés Dornic : 1 °D correspond à 0,1 g d'acide lactique par litre. Un lait frais titre environ 15 à 18 °D.
- La **dose journalière admissible** (DJA) est la quantité d'une substance ajoutée volontairement (additif) que l'on peut ingérer chaque jour, toute sa vie, sans risque appréciable ; la **dose journalière tolérable** (DJT) joue le même rôle pour un contaminant. Elles s'expriment en **mg par kg de masse corporelle et par jour**.

**Exemple** : DJA de l'aspartame = 40 mg/kg/jour. Pour un enfant de 25 kg : 40 × 25 = 1 000 mg par jour au maximum.
!> La DJA dépend de la **masse** de la personne : un enfant l'atteint bien plus vite qu'un adulte.`,
          },
          questions: [
            ['Quelle relation relie le volume d’un gaz à sa quantité de matière ?', ['V = n × Vm', 'V = n ÷ Vm', 'V = m × M', 'V = C × n'], 0, 'Vm est le volume molaire, environ 24 L/mol à 20 °C.'],
            ['D’après 2 NaN₃ → 2 Na + 3 N₂, combien de moles de diazote donnent 4 mol d’azoture de sodium ?', ['2 mol', '4 mol', '6 mol', '3 mol'], 2, 'Les proportions sont de 2 pour 3 : 4 × 3 ÷ 2 = 6 mol.'],
            ['Dans l’éthylotest chimique, que devient l’éthanol ?', ['Il est réduit', 'Il est oxydé en acide éthanoïque', 'Il reste inchangé', 'Il devient du dichromate'], 1, 'Les ions dichromate, eux, sont réduits en ions chrome III verts.'],
            ['Quel changement de couleur indique la présence d’alcool dans un éthylotest chimique ?', ['Du vert à l’orange', 'De l’orange au vert', 'Du bleu au rouge', 'Du blanc au bleu'], 1, 'Les ions dichromate orange deviennent des ions Cr³⁺ verts.'],
            ['Quel est le seuil légal d’alcoolémie pour un conducteur expérimenté ?', ['0,2 g/L de sang', '0,5 g/L de sang', '0,8 g/L de sang', '1 g/L de sang'], 1, 'Soit 0,25 mg par litre d’air expiré.'],
            ['Le rancissement hydrolytique du beurre est dû :', ['À l’hydrolyse des triglycérides', 'À la photosynthèse', 'À la congélation', 'À la fermentation du glucose en éthanol'], 0, 'Elle libère des acides gras à l’odeur forte.'],
            ['Quel procédé de conservation est chimique ?', ['La congélation', 'La pasteurisation', 'L’ajout d’un conservateur', 'La lyophilisation'], 2, 'Les autres agissent par le froid, la chaleur ou l’élimination de l’eau.'],
            ['Le brunissement d’une pomme coupée nécessite du dioxygène.', ['Vrai', 'Faux'], 0, 'Une enzyme oxyde les polyphénols grâce au dioxygène de l’air.'],
            ['Que représente 1 °D (degré Dornic) ?', ['1 g de lactose par litre', '0,1 g d’acide lactique par litre', '1 mg de calcium par litre', '10 g de protéines par litre'], 1, 'Un lait frais titre environ 15 à 18 °D.'],
            ['La DJA d’un additif est de 40 mg/kg/jour. Quelle dose maximale pour un adulte de 60 kg ?', ['40 mg', '240 mg', '2 400 mg', '6 000 mg'], 2, '40 × 60 = 2 400 mg par jour.'],
            ['Quelle différence y a-t-il entre DJA et DJT ?', ['Aucune', 'La DJA concerne une substance ajoutée volontairement, la DJT un contaminant', 'La DJT concerne les additifs, la DJA les contaminants', 'La DJA s’exprime en litres'], 1, 'Toutes deux s’expriment en mg par kg de masse corporelle et par jour.'],
            ['Pourquoi le lait caille-t-il ?', ['Parce que la lumière oxyde ses vitamines', 'Parce que des bactéries transforment le lactose en acide lactique', 'Parce que le froid le coagule', 'Parce que l’eau s’évapore'], 1, 'L’acidité fait coaguler les protéines du lait.'],
          ],
        },
        {
          titre: 'La qualité de l’eau et de l’air',
          axe: 'Chimie : prévenir et sécuriser',
          lecon: {
            titre: 'Ions en solution, conductivité, gaz et polluants',
            cours: `Boire une eau sûre, respirer un air sain : deux conditions de la santé que la chimie permet de contrôler. Il faut savoir ce que contient une eau, et ce que contient l'air.

## Pourquoi les composés ioniques se dissolvent dans l'eau
La molécule d'eau est **polaire** : l'oxygène, plus électronégatif, porte une charge partielle négative, les hydrogènes une charge partielle positive. Les ions d'un solide ionique sont attirés par ces pôles, se détachent et s'entourent de molécules d'eau : ils sont **hydratés**.
= NaCl(s) → Na⁺(aq) + Cl⁻(aq)

## La conductivité d'une eau
Une solution conduit le courant grâce à ses **ions** mobiles. Sa **conductivité** σ (en siemens par mètre, S/m) augmente avec la concentration et la nature des ions.
| L'eau | Sa conductivité |
| Eau pure | Quasi nulle (très peu d'ions) |
| Eau minérale | Moyenne (ions calcium, magnésium, hydrogénocarbonate…) |
| Eau de mer | Très élevée (beaucoup d'ions sodium et chlorure) |
On retient qualitativement que σ est une somme de termes proportionnels aux concentrations des ions, chaque ion ayant sa propre contribution.
!> Une eau chargée en ions conduit le courant : c'est pourquoi l'eau du robinet est dangereuse près d'un appareil électrique.

| Eau **distillée** | Eau **déminéralisée** (désionisée) |
| Obtenue par vaporisation puis condensation : débarrassée des ions et de nombreuses autres substances | Obtenue par résines échangeuses d'ions : débarrassée des ions, mais pas forcément des molécules neutres ni des micro-organismes |

## Doser un ion par conductimétrie
Pour doser les ions sulfate d'une eau, on ajoute progressivement une solution de chlorure de baryum : Ba²⁺ + SO₄²⁻ → BaSO₄ (précipité blanc). On mesure σ après chaque ajout.
- Avant l'équivalence, les ions sulfate disparaissent au fur et à mesure : σ varie peu.
- Après l'équivalence, les ions baryum et chlorure s'accumulent : σ augmente nettement.
L'**équivalence** se lit au changement de pente de la courbe : à ce point, les réactifs ont été introduits dans les proportions de l'équation.
Une eau est **potable** si elle respecte des critères physico-chimiques (par exemple nitrates ≤ 50 mg/L, pH entre 6,5 et 9) et microbiologiques.

## La composition de l'air
| Le gaz | Le pourcentage molaire (air sec) |
| Diazote N₂ | Environ 78 % |
| Dioxygène O₂ | Environ 21 % |
| Argon | Environ 0,9 % |
| Dioxyde de carbone CO₂ | Environ 0,04 % |
La **fraction molaire** d'un gaz est sa quantité de matière divisée par la quantité totale de gaz. Tests : le CO₂ trouble l'eau de chaux, l'eau bleuit le sulfate de cuivre anhydre, le dioxygène ravive une bûchette incandescente.

## La loi du gaz parfait
= P × V = n × R × T, avec P en pascals, V en m³, T en kelvins et R = 8,314 J/(mol·K)
**Exemple** : une bouteille d'oxygène médical de 5 L à 200 bar (2,0 × 10⁷ Pa) et 20 °C (293 K) contient n = (2,0 × 10⁷ × 5 × 10⁻³) ÷ (8,314 × 293) ≈ 41 mol de dioxygène, soit environ 1 000 L à la pression atmosphérique.

## Des gaz dangereux ou utiles
- **Monoxyde de carbone** (CO) : gaz incolore et inodore produit par un chauffage défectueux ou la fumée de cigarette. Il se fixe sur l'hémoglobine environ 200 fois plus fortement que le dioxygène (carboxyhémoglobine) : le sang transporte moins d'oxygène. Maux de tête, nausées, puis coma.
- **Ozone** (O₃) : dans la stratosphère, il **protège** en absorbant une partie des UV solaires ; près du sol, c'est un **polluant** irritant pour les voies respiratoires.
- **Gaz à effet de serre** (CO₂, CH₄, N₂O, vapeur d'eau…) : ils absorbent le rayonnement infrarouge émis par la Terre et réchauffent l'atmosphère.

## Les polluants et leur traitement
| Distinguer | Définition |
| Polluant **primaire** / **secondaire** | Émis directement (CO, oxydes d'azote, particules) / formé dans l'atmosphère (ozone troposphérique) |
| **Macropolluant** / **micropolluant** | Présent en grande quantité (nitrates, phosphates, matière organique) / actif à très faible concentration (pesticides, médicaments, hormones, métaux lourds) |
Traitements : **adsorption** sur charbon actif (les molécules se fixent à sa surface immense), **oxydation** par l'ozone.`,
          },
          questions: [
            ['Pourquoi les composés ioniques se dissolvent-ils bien dans l’eau ?', ['Parce que l’eau est apolaire', 'Parce que l’eau est polaire et hydrate les ions', 'Parce que les ions sont neutres', 'Parce que l’eau est un métal'], 1, 'Les pôles de la molécule d’eau attirent les ions et les entourent.'],
            ['Quelle eau a la conductivité la plus élevée ?', ['L’eau pure', 'L’eau distillée', 'L’eau de mer', 'L’eau déminéralisée'], 2, 'Elle contient beaucoup d’ions sodium et chlorure.'],
            ['Comment repère-t-on l’équivalence d’un dosage conductimétrique ?', ['Au changement de couleur', 'Au changement de pente de la courbe σ = f(V)', 'Au dégagement gazeux', 'À la température maximale'], 1, 'À l’équivalence, les réactifs ont été introduits dans les proportions de l’équation.'],
            ['Quel est le pourcentage molaire du dioxygène dans l’air ?', ['Environ 78 %', 'Environ 21 %', 'Environ 1 %', 'Environ 0,04 %'], 1, 'Le diazote représente environ 78 %.'],
            ['Quel test met en évidence le dioxyde de carbone ?', ['Le sulfate de cuivre anhydre', 'L’eau de chaux qui se trouble', 'La bûchette incandescente', 'Le papier pH'], 1, 'Le sulfate de cuivre anhydre détecte l’eau ; la bûchette, le dioxygène.'],
            ['Dans la loi P × V = n × R × T, la température s’exprime en :', ['Degrés Celsius', 'Kelvins', 'Degrés Fahrenheit', 'Pascals'], 1, 'T (K) = θ (°C) + 273.'],
            ['Pourquoi le monoxyde de carbone est-il dangereux ?', ['Il détruit les globules blancs', 'Il se fixe sur l’hémoglobine bien plus fortement que le dioxygène', 'Il acidifie l’estomac', 'Il bouche les artères'], 1, 'Le sang transporte alors moins d’oxygène aux tissus.'],
            ['L’ozone est toujours bénéfique pour la santé.', ['Vrai', 'Faux'], 1, 'Protecteur dans la stratosphère, il est un polluant irritant près du sol.'],
            ['L’ozone près du sol est un polluant :', ['Primaire', 'Secondaire', 'Radioactif', 'Macropolluant'], 1, 'Il se forme dans l’atmosphère à partir d’autres polluants sous l’effet du soleil.'],
            ['Quel procédé retient des polluants à la surface d’un solide ?', ['L’oxydation par l’ozone', 'L’adsorption sur charbon actif', 'La distillation', 'La saponification'], 1, 'Le charbon actif présente une surface immense.'],
            ['Quelle différence entre eau distillée et eau déminéralisée ?', ['Aucune', 'L’eau déminéralisée peut encore contenir des molécules neutres et des micro-organismes', 'L’eau distillée contient plus d’ions', 'L’eau déminéralisée est salée'], 1, 'Les résines échangeuses d’ions ne retiennent que les ions.'],
            ['Un pesticide actif à quelques microgrammes par litre est un :', ['Macropolluant', 'Micropolluant', 'Gaz à effet de serre', 'Oligoélément'], 1, 'Les micropolluants agissent à très faible concentration.'],
          ],
        },
        // ──────────────── CHIMIE — ANALYSER ET DIAGNOSTIQUER ────────────────
        {
          titre: 'L’imagerie médicale : ondes et radioactivité',
          axe: 'Chimie : analyser et diagnostiquer',
          lecon: {
            titre: 'Voir l’intérieur du corps sans l’ouvrir',
            cours: `Échographie, radiographie, IRM, scintigraphie : chaque technique d'imagerie exploite une onde ou un rayonnement qui interagit avec la matière du corps. La connaître, c'est comprendre ce qu'elle montre et ce qu'elle coûte au patient.

## Ondes mécaniques et ondes électromagnétiques
| L'onde | Sa nature | Sa propagation |
| **Ultrason** | Onde **mécanique** de fréquence supérieure à 20 kHz (quelques MHz en médecine) | A besoin d'un milieu matériel ; environ 1 540 m/s dans les tissus mous |
| **Onde électromagnétique** (rayons X, lumière, radiofréquences) | Onde **électromagnétique** | Se propage aussi dans le vide, à c = 3,00 × 10⁸ m/s |
= λ = c ÷ f (longueur d'onde en mètres, fréquence en hertz)
Par longueur d'onde décroissante : ondes radio (radiofréquences de l'IRM, de l'ordre du mètre) → infrarouge → visible (400 à 800 nm) → ultraviolet → **rayons X** (environ 0,01 à 10 nm) → **rayons gamma**.

## L'échographie et l'effet Doppler
La sonde émet des ultrasons et reçoit leurs échos sur les interfaces entre tissus. Le temps de parcours donne la profondeur (aller et retour) :
= d = v × Δt ÷ 2
**Exemple** : un écho reçu 130 µs après l'émission vient de d = 1 540 × 130 × 10⁻⁶ ÷ 2 ≈ 0,10 m, soit 10 cm.
L'**effet Doppler** : une onde réfléchie par une cible en mouvement change de fréquence (plus haute si la cible s'approche). L'**échographie Doppler** mesure ainsi la vitesse et le sens du sang : elle révèle un rétrécissement d'artère (le sang accélère) ou une fuite de valve cardiaque (un reflux).

## La radiographie
Les rayons X traversent le corps et sont **absorbés** d'autant plus que les atomes ont un **numéro atomique** élevé et que le tissu est dense et épais. Les os, riches en calcium (Z = 20) et phosphore, absorbent beaucoup : ils apparaissent **blancs** ; l'air des poumons apparaît noir.
| Radiographie | Radiothérapie |
| **Diagnostic** : faible dose, image | **Traitement** : forte dose concentrée sur une tumeur pour détruire ses cellules |

## Les produits de contraste
Un **produit de contraste** améliore la visualisation d'un organe : iode (Z = 53) pour les vaisseaux et le scanner, baryum pour le tube digestif, complexes de **gadolinium** pour l'IRM. Le gadolinium y est lié à une molécule qui porte des groupes caractéristiques (carboxylate, amine). Le critère de choix : efficacité, tolérance et **durée d'élimination** (surtout par les reins).
> L'**IRM** utilise un champ magnétique et des radiofréquences agissant sur les noyaux d'hydrogène de l'eau : aucune irradiation.

## La radioactivité et les marqueurs
Un noyau contient Z protons et A nucléons (A − Z neutrons). Des **isotopes** ont le même Z mais des A différents. Un noyau instable se désintègre en émettant :
| L'émission | La particule ou le rayonnement |
| **α** | Un noyau d'hélium (2 protons, 2 neutrons) |
| **β⁻** | Un électron |
| **β⁺** | Un positon (antiparticule de l'électron) |
| **γ** | Un photon très énergétique, qui accompagne souvent les précédentes |

- **Activité** : nombre de désintégrations par seconde, en becquerels (Bq) ; en médecine nucléaire, on la dose par unité de masse corporelle (MBq/kg).
- **Dose** reçue : en sieverts (Sv), qui mesure l'effet biologique.
- **Période** (demi-vie) T : durée au bout de laquelle la moitié des noyaux s'est désintégrée. Elle se lit sur la courbe de décroissance.

**Exemple** : le technétium 99m (émetteur γ, T ≈ 6 h) sert à la **scintigraphie** (os, thyroïde, cœur). Après 24 h, soit 4 périodes, il en reste 1/2⁴ = 1/16 de la quantité initiale. Le fluor 18 (émetteur β⁺, T ≈ 110 min), fixé sur une molécule proche du glucose, sert à la **tomographie par émission de positons** (TEP) : les cellules cancéreuses, grandes consommatrices de glucose, s'allument.
!> Les doses de la médecine nucléaire **diagnostique** sont faibles ; la radiothérapie délivre sur la tumeur des doses des milliers de fois plus élevées.

## Les précautions
Limiter la **durée** d'exposition, augmenter la **distance**, placer des **écrans** (plomb), porter un **dosimètre**, signaler les zones (trèfle radioactif), gérer les déchets et les urines des patients.`,
          },
          questions: [
            ['Quelle différence y a-t-il entre un ultrason et une onde électromagnétique ?', ['L’ultrason se propage dans le vide', 'L’ultrason est une onde mécanique qui a besoin d’un milieu matériel', 'Ils ont la même vitesse', 'L’onde électromagnétique ne se propage pas dans le vide'], 1, 'Les ondes électromagnétiques, elles, se propagent aussi dans le vide.'],
            ['Un écho revient 260 µs après l’émission dans un tissu où v = 1 540 m/s. À quelle profondeur est l’interface ?', ['Environ 10 cm', 'Environ 20 cm', 'Environ 40 cm', 'Environ 2 cm'], 1, 'd = 1 540 × 260 × 10⁻⁶ ÷ 2 ≈ 0,20 m.'],
            ['Que mesure l’échographie Doppler ?', ['La densité des os', 'La vitesse et le sens de circulation du sang', 'La radioactivité d’un organe', 'La glycémie'], 1, 'Le changement de fréquence de l’onde réfléchie dépend de la vitesse des globules rouges.'],
            ['Pourquoi les os apparaissent-ils blancs sur une radiographie ?', ['Ils émettent de la lumière', 'Ils absorbent fortement les rayons X', 'Ils laissent passer les rayons X', 'Ils contiennent de l’air'], 1, 'Le calcium a un numéro atomique plus élevé que les éléments des tissus mous.'],
            ['Quelle technique d’imagerie n’utilise aucun rayonnement ionisant ?', ['La radiographie', 'Le scanner', 'L’IRM', 'La scintigraphie'], 2, 'Elle utilise un champ magnétique et des radiofréquences.'],
            ['Quelle relation relie longueur d’onde et fréquence ?', ['λ = c × f', 'λ = c ÷ f', 'λ = f ÷ c', 'λ = c + f'], 1, 'c = 3,00 × 10⁸ m/s dans le vide.'],
            ['Qu’émet un noyau lors d’une désintégration β⁺ ?', ['Un électron', 'Un positon', 'Un noyau d’hélium', 'Un neutron'], 1, 'Les positons sont à la base de la TEP.'],
            ['La période d’un radio-isotope est de 6 h. Quelle fraction reste-t-il après 24 h ?', ['1/4', '1/8', '1/16', '1/2'], 2, '24 h = 4 périodes : (1/2)⁴ = 1/16.'],
            ['En quelle unité s’exprime l’activité d’une source radioactive ?', ['Le sievert', 'Le becquerel', 'Le hertz', 'Le pascal'], 1, '1 Bq = une désintégration par seconde ; le sievert mesure la dose.'],
            ['Deux isotopes ont le même nombre de protons.', ['Vrai', 'Faux'], 0, 'Ils diffèrent par leur nombre de neutrons.'],
            ['Quel critère guide le choix d’un produit de contraste ?', ['Sa couleur', 'Sa durée d’élimination par l’organisme', 'Son goût', 'Son prix uniquement'], 1, 'On cherche aussi l’efficacité et la tolérance.'],
            ['Quelle précaution protège le personnel d’une source radioactive ?', ['Se rapprocher de la source', 'Augmenter la durée d’exposition', 'Utiliser des écrans de plomb et augmenter la distance', 'Retirer son dosimètre'], 2, 'Durée courte, distance, écrans : les trois règles de la radioprotection.'],
          ],
        },
        {
          titre: 'Les analyses médicales et l’analyse des milieux naturels',
          axe: 'Chimie : analyser et diagnostiquer',
          lecon: {
            titre: 'Concentrations, dosages et diagnostics',
            cours: `Une prise de sang, une analyse d'urine, un prélèvement d'eau de mer : derrière chaque résultat, il y a une concentration mesurée et comparée à une **norme**. Encore faut-il savoir la calculer et l'interpréter.

## Dissoudre un soluté
| Le soluté | Exemple d'équation de dissolution |
| **Moléculaire** (glucose, urée) | C₆H₁₂O₆(s) → C₆H₁₂O₆(aq) |
| **Ionique** | NaCl(s) → Na⁺(aq) + Cl⁻(aq) ; CaCl₂(s) → Ca²⁺(aq) + 2 Cl⁻(aq) |
!> Dans CaCl₂, une mole de soluté libère **deux** moles d'ions chlorure : [Cl⁻] = 2 × C.

## Les deux concentrations
= Concentration en masse : Cm = m ÷ V (g/L) ; concentration en quantité de matière : C = n ÷ V (mol/L) ; lien : Cm = C × M
**Exemple** : le sérum physiologique contient 9 g/L de chlorure de sodium (M = 58,5 g/mol) : C = 9 ÷ 58,5 ≈ 0,15 mol/L. Une glycémie de 1,0 g/L (M = 180 g/mol) correspond à 5,6 mmol/L : les laboratoires donnent souvent les deux.

## Préparer une solution
1. **Par dissolution** : peser m = Cm × V, introduire dans une fiole jaugée, dissoudre, compléter au trait de jauge, agiter.
2. **Par dilution** : la quantité de soluté se conserve.
= C(mère) × V(mère) = C(fille) × V(fille) ; facteur de dilution F = C(mère) ÷ C(fille) = V(fille) ÷ V(mère)
**Exemple** : pour 100 mL à 0,10 mol/L à partir d'une solution à 1,0 mol/L, F = 10 : on prélève 10 mL à la pipette jaugée, on complète à 100 mL en fiole jaugée.
Application médicale : calculer le volume de solution à injecter pour administrer une **dose** prescrite.

## Doser par spectrophotométrie
Une espèce colorée **absorbe** une partie de la lumière ; sa couleur perçue est la couleur **complémentaire** de celle absorbée. Le spectrophotomètre mesure l'**absorbance** A à la longueur d'onde où elle est maximale.
= Loi de Beer-Lambert : A = k × C (l'absorbance est proportionnelle à la concentration)
**Dosage par étalonnage** :
1. Préparer une **gamme étalon** de solutions de concentrations connues.
2. Mesurer leurs absorbances et tracer la droite A = f(C), qui passe par l'origine.
3. Mesurer l'absorbance de l'échantillon et lire sa concentration sur la droite.
Le glucose, incolore, est dosé après une réaction enzymatique qui produit une espèce colorée en quantité proportionnelle.

## Interpréter au regard des normes
| Le paramètre sanguin | La valeur de référence (adulte) |
| Glycémie à jeun | 0,70 à 1,10 g/L |
| Natrémie (Na⁺) | 135 à 145 mmol/L |
| Kaliémie (K⁺) | 3,5 à 5,0 mmol/L |
Un résultat hors de l'intervalle oriente le diagnostic ; il se confirme par d'autres examens et se lit avec le contexte clinique.

## Les milieux naturels
- **Pluies acides** : l'eau de pluie est naturellement un peu acide (pH ≈ 5,6) car le CO₂ s'y dissout (couple CO₂,H₂O / HCO₃⁻). Le dioxyde de soufre des combustions (couple SO₂,H₂O / HSO₃⁻) la rend plus acide.
- **Acidification des océans** : l'océan absorbe une partie du CO₂ émis par les activités humaines.
~ Plus de CO₂ dissous → Formation d'ions H⁺ (ou H₃O⁺) → Baisse du pH → Les ions carbonate (couple HCO₃⁻ / CO₃²⁻) captent ces H⁺ et deviennent rares → Coraux et coquillages ont du mal à former leur squelette calcaire
Le pH de surface des océans est passé d'environ 8,2 à 8,1 depuis l'ère industrielle : une baisse de 0,1 correspond à environ 25 à 30 % d'ions H⁺ en plus.
- **Bioaccumulation** : une substance persistante (mercure, certains pesticides) s'accumule dans les tissus d'un organisme et se concentre le long de la chaîne alimentaire. Une **courbe d'évolution** de sa concentration dans le temps montre son accumulation ou son élimination.
> Pour les **faibles doses** (perturbateurs endocriniens, rejets de médicaments), la réglementation fixe des seuils et impose une surveillance, car les effets à long terme sont encore étudiés.`,
          },
          questions: [
            ['Quelle est l’équation de dissolution du chlorure de calcium CaCl₂ ?', ['CaCl₂ → Ca⁺ + Cl₂⁻', 'CaCl₂ → Ca²⁺ + 2 Cl⁻', 'CaCl₂ → Ca²⁺ + Cl⁻', 'CaCl₂ → Ca + Cl₂'], 1, 'L’électroneutralité impose deux ions chlorure pour un ion calcium.'],
            ['Quelle relation relie concentration en masse et concentration en quantité de matière ?', ['Cm = C × M', 'Cm = C ÷ M', 'Cm = n × V', 'Cm = M ÷ C'], 0, 'M est la masse molaire du soluté, en g/mol.'],
            ['Quelle masse de glucose faut-il pour préparer 250 mL à 20 g/L ?', ['5 g', '20 g', '80 g', '0,5 g'], 0, 'm = Cm × V = 20 × 0,250 = 5 g.'],
            ['On dilue une solution 10 fois. Quel volume de solution mère faut-il pour 50 mL de solution fille ?', ['5 mL', '10 mL', '50 mL', '500 mL'], 0, 'V(mère) = V(fille) ÷ F = 50 ÷ 10 = 5 mL.'],
            ['Que dit la loi de Beer-Lambert ?', ['L’absorbance est proportionnelle à la concentration', 'L’absorbance est inversement proportionnelle à la concentration', 'La couleur ne dépend pas de la concentration', 'La concentration dépend de la température seulement'], 0, 'Elle fonde le dosage par étalonnage.'],
            ['À quelle longueur d’onde règle-t-on le spectrophotomètre ?', ['À celle où l’absorbance est maximale', 'À celle où l’absorbance est nulle', 'Toujours à 800 nm', 'N’importe laquelle'], 0, 'La mesure y est la plus précise.'],
            ['Une solution paraît bleue. Quelle couleur absorbe-t-elle surtout ?', ['Le bleu', 'L’orange', 'Le vert', 'Le violet'], 1, 'La couleur perçue est la complémentaire de la couleur absorbée.'],
            ['Une glycémie à jeun de 0,90 g/L est dans les valeurs de référence.', ['Vrai', 'Faux'], 0, 'L’intervalle usuel à jeun est de 0,70 à 1,10 g/L.'],
            ['Pourquoi l’eau de pluie non polluée est-elle légèrement acide ?', ['À cause du dioxyde de carbone dissous', 'À cause du sel', 'À cause de l’ozone', 'Elle ne l’est pas'], 0, 'Le couple CO₂,H₂O / HCO₃⁻ explique un pH voisin de 5,6.'],
            ['Quelle conséquence a l’acidification des océans ?', ['Les coraux construisent plus vite leur squelette', 'Les organismes à coquille calcaire ont du mal à la former', 'La mer devient basique', 'Le sel disparaît'], 1, 'Les ions carbonate deviennent moins disponibles.'],
            ['Qu’est-ce que la bioaccumulation ?', ['L’élimination rapide d’un polluant', 'L’accumulation d’une substance persistante dans les tissus d’un organisme', 'La production d’énergie par les cellules', 'La dilution d’un polluant dans la mer'], 1, 'La substance se concentre ensuite le long de la chaîne alimentaire.'],
            ['Le sérum physiologique contient 9 g/L de NaCl (M = 58,5 g/mol). Quelle est sa concentration en quantité de matière ?', ['Environ 0,15 mol/L', 'Environ 1,5 mol/L', 'Environ 9 mol/L', 'Environ 526 mol/L'], 0, 'C = Cm ÷ M = 9 ÷ 58,5 ≈ 0,15 mol/L.'],
          ],
        },
        // ──────────────── CHIMIE — CHOIX AUTONOMES ET RESPONSABLES ────────────────
        {
          titre: 'Protéines et lipides : la structure au service de la fonction',
          axe: 'Chimie : faire des choix autonomes et responsables',
          lecon: {
            titre: 'Acides aminés, chiralité, peptides, acides gras et triglycérides',
            cours: `Pourquoi une protéine mal repliée ne fonctionne plus ? Pourquoi conseille-t-on de limiter certaines graisses ? Les réponses tiennent à la **structure** des molécules.

## Les acides α-aminés
Un **acide α-aminé** porte, sur un même atome de carbone (le carbone α), un groupe **carboxyle** –COOH, un groupe **amine** –NH₂, un atome d'hydrogène et une chaîne latérale R.
= Formule générale : H₂N–CH(R)–COOH
Vingt acides aminés entrent dans la composition des protéines humaines ; ils diffèrent par leur chaîne R (R = H pour la glycine, R = CH₃ pour l'alanine).

## Carbone asymétrique et chiralité
Un **carbone asymétrique** est lié à **quatre groupes différents**. Une molécule qui en possède un est **chirale** : elle n'est pas superposable à son image dans un miroir, comme une main gauche et une main droite. Les deux formes sont des **énantiomères**.
- En **représentation de Cram**, deux liaisons sont dans le plan, un trait plein en coin vient vers l'observateur, un trait hachuré s'en éloigne.
- En **représentation de Fischer**, on place –COOH en haut et R en bas : si –NH₂ est à **gauche**, c'est l'énantiomère **L** ; à droite, c'est **D**.
> Les protéines humaines sont construites avec des acides aminés **L**. La glycine, dont R = H, n'a pas de carbone asymétrique : elle n'est pas chirale.

## La liaison peptidique
Deux acides aminés se lient par **condensation** : le –COOH de l'un réagit avec le –NH₂ de l'autre, avec élimination d'une molécule d'eau. Le groupe formé, –CO–NH–, est la **liaison peptidique**.
= Glycine + alanine → Gly-Ala + H₂O (l'ordre compte : Gly-Ala et Ala-Gly sont deux dipeptides différents)
Avec deux acides aminés différents, on peut obtenir **quatre** dipeptides si chacun peut aussi se lier à lui-même (Gly-Gly, Gly-Ala, Ala-Gly, Ala-Ala). L'hydrolyse d'un peptide permet de retrouver les acides aminés qui le constituent.

## De la chaîne à la protéine
| Le niveau | Ce qu'il décrit |
| **Primaire** | La séquence des acides aminés |
| **Secondaire** | Des repliements locaux (hélices, feuillets), stabilisés par des liaisons hydrogène |
| **Tertiaire** | Le repliement de toute la chaîne dans l'espace |
| **Quaternaire** | L'association de plusieurs chaînes (quatre pour l'hémoglobine) |
La forme en trois dimensions détermine l'**action** : le site actif d'une enzyme, le site de fixation d'un anticorps. Une protéine **dénaturée** (chaleur, pH extrême) perd sa forme et sa fonction. Un seul acide aminé changé peut suffire à modifier la fonction (drépanocytose).

## Les acides gras
Un **acide gras** est un acide carboxylique à longue chaîne carbonée, R–COOH.
| L'acide gras | Sa structure | Exemple |
| **Saturé** | Aucune double liaison C=C | Acide palmitique, acide stéarique |
| **Mono-insaturé** | Une double liaison | Acide oléique (huile d'olive) |
| **Polyinsaturé** | Plusieurs doubles liaisons | Oméga 6 (acide linoléique), oméga 3 (acide alpha-linolénique), dits **essentiels** car l'organisme ne sait pas les fabriquer |

## Les triglycérides
Un **triglycéride** est un triester formé à partir du **glycérol** (un trialcool) et de **trois acides gras**.
= Hydrolyse : triglycéride + 3 H₂O ⇌ glycérol + 3 acides gras (réaction lente et limitée, accélérée par des enzymes, les lipases)
= Saponification : triglycéride + 3 (Na⁺ + HO⁻) → glycérol + 3 (R–COO⁻ + Na⁺), le savon (réaction totale, à chaud)
= Rendement = quantité de produit obtenue ÷ quantité maximale attendue
**Exemple** : 1,0 mol de triglycéride peut donner au plus 3,0 mol de savon ; si l'on en obtient 2,4 mol, le rendement est 2,4 ÷ 3,0 = 80 %.

## Lipides et santé
- Un excès d'acides gras **saturés** et d'acides gras **trans** (industriels) augmente le « mauvais » cholestérol et le risque cardio-vasculaire.
- Les **oméga 3** (colza, noix, poissons gras) sont bénéfiques ; il faut un bon rapport oméga 6 / oméga 3.
- Les huiles riches en acides gras polyinsaturés se **dégradent** à forte chaleur : on les réserve à l'assaisonnement.
- Le **cholestérol** est un stérol (quatre cycles, un groupe –OH) presque **insoluble** dans l'eau : il circule dans le sang porté par des **lipoprotéines** (LDL vers les tissus, HDL vers le foie). En excès, il se dépose dans les artères (athérome).`,
          },
          questions: [
            ['Qu’est-ce qu’un acide α-aminé ?', ['Une molécule portant les groupes amine et carboxyle sur le même carbone', 'Un acide gras insaturé', 'Un sucre simple', 'Un ion minéral'], 0, 'Formule générale H₂N–CH(R)–COOH.'],
            ['Un carbone asymétrique est lié à :', ['Deux groupes identiques', 'Quatre groupes différents', 'Trois atomes d’oxygène', 'Une double liaison'], 1, 'Sa présence rend la molécule chirale.'],
            ['Quel acide aminé n’est pas chiral ?', ['L’alanine', 'La glycine', 'La valine', 'La leucine'], 1, 'Sa chaîne latérale est un simple atome d’hydrogène.'],
            ['En représentation de Fischer (–COOH en haut), l’acide aminé L a son groupe –NH₂ :', ['À droite', 'À gauche', 'En haut', 'En bas'], 1, 'Les protéines humaines sont faites d’acides aminés L.'],
            ['Comment se forme une liaison peptidique ?', ['Par condensation avec élimination d’eau', 'Par hydrolyse', 'Par oxydation', 'Par saponification'], 0, 'Le –COOH de l’un réagit avec le –NH₂ de l’autre.'],
            ['Combien de dipeptides différents peut-on former avec deux acides aminés différents, en comptant les associations d’un acide aminé avec lui-même ?', ['2', '3', '4', '6'], 2, 'Par exemple Gly-Gly, Gly-Ala, Ala-Gly et Ala-Ala.'],
            ['La structure primaire d’une protéine correspond :', ['À son repliement dans l’espace', 'À la séquence de ses acides aminés', 'À l’association de plusieurs chaînes', 'À sa couleur'], 1, 'Elle détermine les repliements des niveaux suivants.'],
            ['Un acide gras saturé ne possède aucune double liaison C=C.', ['Vrai', 'Faux'], 0, 'Les acides gras insaturés en ont une ou plusieurs.'],
            ['Un triglycéride est formé à partir :', ['De glucose et d’acides aminés', 'De glycérol et de trois acides gras', 'De cholestérol et d’eau', 'De trois glycérols'], 1, 'C’est un triester.'],
            ['Quels sont les produits de la saponification d’un triglycéride par la soude ?', ['Du glycérol et des ions carboxylate (savon)', 'Du glucose et de l’eau', 'Des acides aminés', 'Du cholestérol'], 0, 'La réaction est totale et se fait à chaud.'],
            ['On attend au plus 3,0 mol de savon et on en obtient 2,4 mol. Quel est le rendement ?', ['24 %', '60 %', '80 %', '125 %'], 2, 'Rendement = 2,4 ÷ 3,0 = 0,80.'],
            ['Pourquoi le cholestérol circule-t-il dans le sang lié à des lipoprotéines ?', ['Parce qu’il est très soluble dans l’eau', 'Parce qu’il est presque insoluble dans l’eau', 'Parce qu’il est un ion', 'Parce qu’il est gazeux'], 1, 'Les LDL le portent vers les tissus, les HDL vers le foie.'],
          ],
        },
        {
          titre: 'Vitamines, oligoéléments, additifs, médicaments et cosmétiques',
          axe: 'Chimie : faire des choix autonomes et responsables',
          lecon: {
            titre: 'Consommer en connaissant les molécules',
            cours: `Faut-il prendre des vitamines chaque jour ? Que cache un « E » sur une étiquette ? Qu'est-ce qu'un indice de protection solaire ? Connaître les molécules, c'est pouvoir choisir.

## Les vitamines : hydrosolubles ou liposolubles
| La vitamine | Sa structure | Sa solubilité | La conséquence |
| **C** (acide ascorbique) | Petite molécule riche en groupes –OH | **Hydrosoluble** | Peu stockée, l'excès part dans les urines : il faut des apports **quotidiens** |
| **A** (rétinol) | Longue chaîne carbonée, un seul –OH | **Liposoluble** | Stockée dans le foie et les graisses : un excès peut être toxique |
| **D** | Dérivée d'un stérol, surtout carbonée | **Liposoluble** | Stockée ; elle est aussi fabriquée par la peau au soleil |
> Plus une molécule a de groupes –OH par rapport à sa chaîne carbonée, plus elle est soluble dans l'eau.

Carences : scorbut (vitamine C), rachitisme (vitamine D), troubles de la vision nocturne (vitamine A).
**Doser la vitamine C** : par titrage avec une solution de diiode, qui oxyde l'acide ascorbique ; l'empois d'amidon bleuit dès que le diiode est en excès, ce qui repère l'équivalence.

## Eau, ions et oligoéléments
L'eau transporte les nutriments et les ions. Les **oligoéléments** (fer, zinc, cuivre, iode, sélénium, fluor) sont indispensables en **très petites quantités** : le fer pour l'hémoglobine, l'iode pour les hormones thyroïdiennes.
L'**ionogramme sanguin** mesure les principaux ions du plasma :
| L'ion | La valeur de référence |
| Sodium Na⁺ | 135 à 145 mmol/L |
| Potassium K⁺ | 3,5 à 5,0 mmol/L |
| Chlorure Cl⁻ | Environ 95 à 105 mmol/L |
Lors d'une **déshydratation**, l'équilibre ionique est rompu : une perte d'eau pure (soif non satisfaite chez une personne âgée) fait monter la natrémie ; une perte d'eau et de sel (diarrhée) concentre le sang (protides et hématocrite augmentent).

## Les additifs alimentaires
| La famille | Les numéros | Le rôle |
| **Colorants** | E100 à E199 | Donner ou rendre la couleur |
| **Conservateurs** | E200 à E299 | Limiter le développement des micro-organismes |
| **Antioxydants** | E300 à E399 | Ralentir l'oxydation |
| **Texturants** (épaississants, gélifiants, émulsifiants) | E400 à E499 | Donner la consistance |
Chaque additif est **autorisé** au niveau européen après évaluation, avec une DJA ; certains sont retirés quand un doute apparaît (le dioxyde de titane E171, interdit dans l'alimentation dans l'Union européenne depuis 2022). Un colorant se **dose par étalonnage** au spectrophotomètre.
Les **arômes** peuvent être naturels (extraits d'une plante) ou de synthèse ; une molécule de synthèse identique à la molécule naturelle (la vanilline) a les mêmes propriétés, mais l'extrait naturel contient d'autres molécules qui enrichissent le goût.

## De la molécule au médicament
Un médicament associe un **principe actif** et des **excipients**. Beaucoup de principes actifs viennent de la nature avant d'être synthétisés :
@ 1897 — Synthèse de l'acide acétylsalicylique (aspirine), dérivé de la salicine de l'écorce de saule
@ 1928 — Alexander Fleming découvre la pénicilline, produite par une moisissure
@ 1943 — La streptomycine est isolée d'une bactérie du sol
@ 1971 — Structure du taxol, anticancéreux tiré de l'if
La recherche développe des **nanomédicaments** (principe actif transporté dans des nanoparticules qui ciblent les cellules malades, comme les nanoparticules lipidiques des vaccins à ARN messager) et des **médicaments hybrides**.

## Les cosmétiques et la protection solaire
La liste des ingrédients est écrite par ordre de concentration décroissante ; le **solvant** (souvent l'eau, « aqua ») vient en tête.
| Les UV | Leurs effets |
| **UVB** | Coups de soleil ; ils participent aux cancers de la peau |
| **UVA** | Pénètrent plus profondément : vieillissement de la peau, cancers |
L'**indice de protection** (SPF) d'une crème mesure surtout la protection contre les UVB ; un logo signale la protection UVA. Une crème **hydratante** retient l'eau dans la peau ; un **antioxydant** (vitamines C et E) neutralise les radicaux libres produits par les UV.
!> Aucune crème ne protège totalement : il faut en remettre souvent et limiter l'exposition.

La **chimie verte** vise des procédés moins polluants : moins de déchets, des solvants moins toxiques, des matières premières renouvelables (la phytochimie, qui tire des actifs des plantes).`,
          },
          questions: [
            ['Pourquoi faut-il des apports quotidiens de vitamine C ?', ['Parce qu’elle est liposoluble et stockée', 'Parce qu’elle est hydrosoluble et peu stockée', 'Parce qu’elle est fabriquée par la peau', 'Parce qu’elle est toxique'], 1, 'L’excès est éliminé dans les urines.'],
            ['Quelle vitamine est liposoluble ?', ['La vitamine C', 'La vitamine A', 'La vitamine B9', 'La vitamine B1'], 1, 'Les vitamines A, D, E et K sont liposolubles.'],
            ['Quelle maladie est due à une carence en vitamine D ?', ['Le scorbut', 'Le rachitisme', 'Le diabète', 'L’anémie'], 1, 'La vitamine D permet la fixation du calcium dans les os.'],
            ['Lors du titrage de la vitamine C par le diiode, comment repère-t-on l’équivalence ?', ['L’empois d’amidon bleuit quand le diiode est en excès', 'La solution devient rouge', 'Un gaz se dégage', 'La température chute'], 0, 'Tant qu’il reste de la vitamine C, le diiode est consommé.'],
            ['Les oligoéléments sont nécessaires :', ['En très grandes quantités', 'En très petites quantités', 'Seulement chez l’enfant', 'Jamais'], 1, 'Fer, zinc, cuivre, iode, sélénium…'],
            ['Quelle est la valeur de référence de la natrémie ?', ['3,5 à 5,0 mmol/L', '135 à 145 mmol/L', '0,70 à 1,10 g/L', '60 à 80 g/L'], 1, '3,5 à 5,0 mmol/L est la valeur de la kaliémie.'],
            ['Les additifs numérotés E200 à E299 sont des :', ['Colorants', 'Conservateurs', 'Antioxydants', 'Texturants'], 1, 'Ils limitent le développement des micro-organismes.'],
            ['Une vanilline de synthèse identique à la vanilline naturelle a les mêmes propriétés.', ['Vrai', 'Faux'], 0, 'C’est la même molécule ; l’extrait naturel contient en plus d’autres molécules.'],
            ['De quelle plante dérive l’aspirine ?', ['Du pavot', 'Du saule', 'De l’if', 'De la digitale'], 1, 'Elle dérive de la salicine de l’écorce de saule.'],
            ['Qui a découvert la pénicilline en 1928 ?', ['Louis Pasteur', 'Alexander Fleming', 'Marie Curie', 'Robert Koch'], 1, 'Elle est produite par une moisissure du genre Penicillium.'],
            ['L’indice SPF d’une crème solaire mesure surtout la protection contre :', ['Les UVA', 'Les UVB', 'Les infrarouges', 'La lumière visible'], 1, 'Un logo spécifique signale la protection contre les UVA.'],
            ['Quel est le rôle d’un antioxydant dans un cosmétique solaire ?', ['Retenir l’eau dans la peau', 'Neutraliser les radicaux libres produits par les UV', 'Colorer la peau', 'Parfumer'], 1, 'Retenir l’eau est le rôle d’un actif hydratant.'],
          ],
        },
        // ──────────────── BIOLOGIE — MILIEU INTÉRIEUR ────────────────
        {
          titre: 'Le milieu intérieur, le rein et les xénobiotiques',
          axe: 'Milieu intérieur et homéostasie',
          lecon: {
            titre: 'Des compartiments liquidiens équilibrés en permanence',
            cours: `Tes cellules baignent dans un liquide dont la composition reste presque constante, quoi que tu manges ou boives. Ce **milieu intérieur** est maintenu par des organes régulateurs, au premier rang desquels le **rein**.

## Les compartiments liquidiens
L'eau représente environ **60 %** de la masse d'un adulte. Elle se répartit en compartiments séparés par des membranes :
| Le compartiment | La part de l'eau totale |
| **Intracellulaire** (dans les cellules) | Environ 2/3 |
| **Extracellulaire** | Environ 1/3 |
| … dont liquide **interstitiel** (entre les cellules) | Environ 3/4 de l'extracellulaire |
| … dont **plasma** (dans les vaisseaux) | Environ 1/4 de l'extracellulaire |
Le **milieu intérieur**, c'est le **liquide extracellulaire** (plasma, liquide interstitiel, lymphe). Les compartiments **échangent** entre eux (à travers les capillaires et les membranes) et avec le milieu extérieur : entrées par l'intestin et les poumons, sorties par les reins, la peau, les poumons et l'intestin.

## L'appareil urinaire
~ Deux reins (fabriquent l'urine) → Deux uretères → Vessie (stocke) → Urètre (évacue)
Chaque rein contient environ **un million de néphrons**, ses unités fonctionnelles. Un néphron comprend :
1. Le **glomérule**, peloton de capillaires entouré de la capsule de Bowman, dans le cortex ;
2. Le **tube contourné proximal** ;
3. L'**anse de Henlé**, qui descend dans la médullaire ;
4. Le **tube contourné distal**, qui se jette dans un **tube collecteur**.

## Du plasma à l'urine
| Le constituant (g/L) | Plasma | Urine primitive | Urine définitive |
| Protéines | Environ 70 | 0 | 0 |
| Glucose | Environ 1 | Environ 1 | 0 |
| Urée | Environ 0,3 | Environ 0,3 | Environ 20 |
| Sodium | Environ 3,3 | Environ 3,3 | Variable |
Ce tableau permet de déduire les trois fonctions du néphron :
1. **Filtration** glomérulaire : l'urine primitive a la composition du plasma **sans les protéines** (trop grosses). Environ 180 L sont filtrés par jour.
2. **Réabsorption** tubulaire : l'eau (à plus de 99 %), le glucose (en totalité, normalement), une grande partie des ions retournent dans le sang.
3. **Sécrétion** tubulaire : certaines substances (ions H⁺, K⁺, médicaments) passent du sang dans le tube.
= Diurèse (volume d'urine émis en 24 heures) : environ 1,5 L chez l'adulte

> Le rein **régule** le volume et la composition du milieu intérieur (eau, ions, pH) et **élimine** les déchets (urée, créatinine) : c'est un organe de l'homéostasie.

!> Une protéinurie (protéines dans l'urine) ou une glycosurie (glucose dans l'urine) sont anormales : la première signale une atteinte du glomérule, la seconde une glycémie trop élevée (diabète).

## Les xénobiotiques
Un **xénobiotique** est une substance **étrangère** à l'organisme, qu'il ne produit pas : médicaments, alcool, drogues, pesticides, additifs, polluants (métaux lourds, perturbateurs endocriniens).
~ Absorption (digestive, respiratoire, cutanée) → Distribution par le sang → Métabolisme (surtout par le foie, qui le transforme) → Stockage éventuel (tissu adipeux pour les molécules liposolubles, os pour le plomb) → Élimination (urine, bile et selles, air expiré, sueur, lait)
Conséquences possibles : toxicité pour le foie et les reins, perturbation hormonale, effets cancérogènes, accumulation au fil des expositions. Le devenir d'un médicament explique ses doses et ses intervalles de prise.

## Vocabulaire
| Racine ou terme | Sens |
| néphro- | Rein |
| uro- / -urie | Urine / présence dans l'urine |
| xéno- | Étranger |
| Polydipsie | Soif excessive |`,
          },
          questions: [
            ['Quelle part de la masse d’un adulte représente l’eau ?', ['Environ 20 %', 'Environ 40 %', 'Environ 60 %', 'Environ 90 %'], 2, 'Deux tiers de cette eau sont dans les cellules.'],
            ['Le milieu intérieur correspond :', ['Au liquide intracellulaire', 'Au liquide extracellulaire (plasma, liquide interstitiel, lymphe)', 'Au contenu de l’intestin', 'À l’urine'], 1, 'C’est le milieu dans lequel baignent les cellules.'],
            ['Quelle est l’unité fonctionnelle du rein ?', ['L’alvéole', 'Le néphron', 'Le neurone', 'L’acinus'], 1, 'Chaque rein en compte environ un million.'],
            ['Pourquoi l’urine primitive ne contient-elle pas de protéines ?', ['Elles sont détruites', 'Elles sont trop grosses pour être filtrées par le glomérule', 'Elles sont réabsorbées', 'Elles sont sécrétées dans la bile'], 1, 'La filtration glomérulaire retient les grosses molécules.'],
            ['Le glucose présent dans l’urine primitive disparaît de l’urine définitive par :', ['Filtration', 'Réabsorption', 'Sécrétion', 'Dégradation'], 1, 'Normalement, il est réabsorbé en totalité.'],
            ['La concentration de l’urée passe d’environ 0,3 g/L dans le plasma à environ 20 g/L dans l’urine. Pourquoi ?', ['L’urée est fabriquée par le rein', 'L’eau est massivement réabsorbée alors que l’urée l’est peu', 'Le rein ajoute du sel', 'L’urée vient de la vessie'], 1, 'L’urée est concentrée dans l’urine : c’est un déchet éliminé.'],
            ['Quel volume de plasma les glomérules filtrent-ils environ par jour ?', ['1,5 L', '18 L', '180 L', '1 800 L'], 2, 'Plus de 99 % de cette eau est réabsorbée.'],
            ['La présence de glucose dans l’urine est normale.', ['Vrai', 'Faux'], 1, 'Une glycosurie traduit une glycémie trop élevée.'],
            ['Qu’est-ce qu’un xénobiotique ?', ['Une hormone', 'Une substance étrangère à l’organisme', 'Un globule blanc', 'Un ion du plasma'], 1, 'Médicaments, alcool, pesticides, polluants…'],
            ['Quel organe transforme principalement les xénobiotiques ?', ['Le cœur', 'Le foie', 'La rate', 'Le poumon'], 1, 'C’est l’étape du métabolisme.'],
            ['Où les xénobiotiques liposolubles sont-ils surtout stockés ?', ['Dans le tissu adipeux', 'Dans la vessie', 'Dans le plasma', 'Dans les globules rouges'], 0, 'D’où des relargages lors d’un amaigrissement.'],
            ['Que désigne la diurèse ?', ['La soif excessive', 'Le volume d’urine émis en 24 heures', 'La présence de sang dans l’urine', 'L’inflammation du rein'], 1, 'Elle est d’environ 1,5 L chez l’adulte.'],
          ],
        },
        {
          titre: 'La régulation de la glycémie et les diabètes',
          axe: 'Milieu intérieur et homéostasie',
          lecon: {
            titre: 'Une régulation hormonale, et ce qui arrive quand elle échoue',
            cours: `Que tu sortes d'un repas ou que tu sois à jeun depuis la veille, ta **glycémie** (concentration du glucose dans le sang) reste proche de 1 g/L. Cette constance est vitale : le cerveau consomme du glucose en permanence.

## Une régulation hormonale
| Situation | Glycémie | Réponse |
| **À jeun** | Tend à baisser | Les cellules **α** des îlots de Langerhans sécrètent le **glucagon** : le foie dégrade son glycogène (**glycogénolyse**) et fabrique du glucose (**néoglucogenèse**) |
| **Après un repas** (post-prandiale) | Monte | Les cellules **β** sécrètent l'**insuline** : les muscles et le tissu adipeux absorbent le glucose ; le foie et les muscles le stockent en glycogène (**glycogenèse**) ; l'excès devient des graisses |
= Glycémie à jeun normale : 0,70 à 1,10 g/L ; après un repas, elle monte puis revient à sa valeur de départ en deux heures environ

- Une **hormone** est une molécule sécrétée par une glande endocrine dans le sang, qui agit à distance sur des cellules cibles porteuses de **récepteurs** spécifiques.
- Le pancréas est une glande **mixte** : exocrine (suc pancréatique) et endocrine (îlots de Langerhans).
- L'**insuline** est la seule hormone **hypoglycémiante** ; le glucagon est hyperglycémiant.
~ Écart de la glycémie → Détection par les cellules des îlots → Sécrétion d'insuline ou de glucagon → Action sur le foie, les muscles, le tissu adipeux → Retour à la valeur de consigne
> L'**homéostasie** est la capacité de l'organisme à maintenir constantes les caractéristiques de son milieu intérieur. La glycémie oscille autour d'une valeur : c'est un **équilibre dynamique**.

## Les diabètes
Le **diabète** est défini par une **hyperglycémie chronique** : glycémie à jeun ≥ 1,26 g/L à deux reprises, ou ≥ 2 g/L à tout moment avec des symptômes. Plus de 4 millions de personnes sont traitées pour un diabète en France.
| | Diabète de **type 1** | Diabète de **type 2** |
| **Fréquence** | Environ 10 % des cas | Environ 90 % des cas |
| **Âge de début** | Enfant, adolescent, jeune adulte | Le plus souvent après 40 ans, de plus en plus tôt |
| **Étiologie** | Maladie **auto-immune** : destruction des cellules β, **plus d'insuline** | **Insulinorésistance** (les cellules répondent mal à l'insuline), puis insuffisance de sécrétion |
| **Début** | Brutal : soif, urines abondantes, amaigrissement, fatigue | Progressif, souvent silencieux, découvert lors d'une prise de sang |
| **Facteurs de risque** | Terrain génétique, facteurs environnementaux mal connus | Surpoids, sédentarité, alimentation déséquilibrée, hérédité, âge |
| **Traitement** | **Insuline** à vie (injections ou pompe), surveillance de la glycémie | Hygiène de vie d'abord, puis médicaments (metformine…), parfois insuline |
| **Prévention** | Non évitable à ce jour | En grande partie **évitable** |

## Des signes reliés entre eux
~ Hyperglycémie → Glycosurie (au-delà d'environ 1,8 g/L, le rein ne réabsorbe plus tout le glucose) → Polyurie (le glucose entraîne l'eau dans l'urine) → Déshydratation → Polydipsie (soif intense)
- **Signes cliniques** : ce que ressent le patient ou ce que le médecin observe (soif, amaigrissement, fatigue).
- **Signes paracliniques** : les résultats d'examens (glycémie, **hémoglobine glyquée** HbA1c, qui reflète la glycémie moyenne des trois derniers mois, glycosurie, corps cétoniques, anticorps dirigés contre les îlots dans le type 1).

## Les complications
- **Aiguës** : **hypoglycémie** chez le patient traité (sueurs, tremblements, malaise : sucre immédiatement) ; acidocétose dans le type 1.
- **Chroniques** : atteinte des petits vaisseaux (rétine, rein, nerfs) et des gros vaisseaux (infarctus, AVC, artériopathie) ; plaies du pied qui guérissent mal.
!> Le diabète de type 2 n'est pas « un petit diabète » : silencieux pendant des années, il abîme les vaisseaux sans douleur. D'où l'intérêt du dépistage et de la prévention (activité physique, poids, alimentation).`,
          },
          questions: [
            ['Quelle hormone fait baisser la glycémie ?', ['Le glucagon', 'L’insuline', 'L’adrénaline', 'La testostérone'], 1, 'C’est la seule hormone hypoglycémiante.'],
            ['Quelles cellules sécrètent l’insuline ?', ['Les cellules α des îlots de Langerhans', 'Les cellules β des îlots de Langerhans', 'Les hépatocytes', 'Les globules rouges'], 1, 'Le glucagon est sécrété par les cellules α.'],
            ['À jeun, comment le foie maintient-il la glycémie ?', ['En stockant du glucose', 'En dégradant son glycogène et en fabriquant du glucose', 'En sécrétant de l’insuline', 'En éliminant le glucose dans la bile'], 1, 'Glycogénolyse et néoglucogenèse, sous l’effet du glucagon.'],
            ['Qu’est-ce qu’une hormone ?', ['Une enzyme digestive', 'Une molécule sécrétée dans le sang qui agit à distance sur des cellules cibles', 'Un globule blanc', 'Un nerf'], 1, 'Les cellules cibles portent des récepteurs spécifiques.'],
            ['Quel seuil de glycémie à jeun, constaté deux fois, définit le diabète ?', ['1,00 g/L', '1,10 g/L', '1,26 g/L', '2,50 g/L'], 2, 'Ou une glycémie ≥ 2 g/L à tout moment avec des symptômes.'],
            ['Quelle est l’origine du diabète de type 1 ?', ['Une insulinorésistance liée au surpoids', 'La destruction auto-immune des cellules β', 'Un excès de glucagon', 'Une infection bactérienne du pancréas'], 1, 'Le pancréas ne produit plus d’insuline.'],
            ['Quel traitement est indispensable dans le diabète de type 1 ?', ['Le régime seul', 'L’insuline', 'Les antibiotiques', 'Le glucagon quotidien'], 1, 'Il est nécessaire à vie.'],
            ['Le diabète de type 2 est en grande partie évitable.', ['Vrai', 'Faux'], 0, 'Activité physique, poids et alimentation réduisent fortement le risque.'],
            ['Pourquoi une hyperglycémie provoque-t-elle une polyurie ?', ['Parce que le glucose dans l’urine entraîne de l’eau', 'Parce que le rein fabrique de l’eau', 'Parce que l’insuline est diurétique', 'Parce que le patient boit moins'], 0, 'Glycosurie puis polyurie, déshydratation et polydipsie.'],
            ['Que reflète l’hémoglobine glyquée (HbA1c) ?', ['La glycémie de l’instant', 'La glycémie moyenne des trois derniers mois', 'La quantité d’insuline', 'Le taux de cholestérol'], 1, 'C’est l’examen de suivi de l’équilibre du diabète.'],
            ['Un diabétique traité a des sueurs et des tremblements. Que faut-il suspecter ?', ['Une hypoglycémie', 'Une hyperglycémie', 'Une grippe', 'Une allergie'], 0, 'Il faut resucrer immédiatement.'],
            ['Lequel est un signe paraclinique ?', ['La soif intense', 'La fatigue', 'Une glycémie à 2,3 g/L', 'L’amaigrissement'], 2, 'Un signe paraclinique est un résultat d’examen.'],
          ],
        },
        // ──────────────── BIOLOGIE — DÉFENSE DE L'ORGANISME ────────────────
        {
          titre: 'Agents pathogènes, antibiotiques et antibiorésistance',
          axe: 'Système immunitaire et défense de l’organisme',
          lecon: {
            titre: 'Bactéries, virus et médicaments anti-infectieux',
            cours: `Une angine, une grippe, une mycose : toutes sont des **maladies infectieuses**, dues à des micro-organismes pathogènes. Mais on ne les soigne pas de la même façon, car ces agents sont très différents.

## Les agents pathogènes
| La catégorie | Exemples de maladies |
| **Bactéries** | Tuberculose, angine à streptocoque, infection urinaire |
| **Virus** | Grippe, rougeole, VIH, Covid-19 |
| **Champignons** (mycoses) | Candidose, pied d'athlète |
| **Parasites** | Paludisme (protozoaire), gale, ténia |
| **Prions** (protéines anormales) | Maladie de Creutzfeldt-Jakob |

## Bactérie et virus : deux mondes
| | **Bactérie** | **Virus** |
| **Taille** | Environ 1 à 10 µm (visible au microscope optique) | Environ 20 à 300 nm (microscope électronique) |
| **Organisation** | Cellule **procaryote** : paroi, membrane, cytoplasme, ribosomes, ADN libre (sans noyau), parfois plasmides | **Pas une cellule** : un acide nucléique (ADN ou ARN) dans une **capside** protéique, parfois une **enveloppe** |
| **Reproduction** | Seule, par **division** (scissiparité) : une bactérie donne deux bactéries, parfois toutes les 20 minutes dans de bonnes conditions | Seulement **dans une cellule hôte** : c'est un parasite intracellulaire obligatoire |
| **Traitement** | **Antibiotiques** | Antiviraux (pour certains virus) ; les antibiotiques sont **inefficaces** |

## Le cycle viral
~ Fixation sur la cellule cible (récepteur) → Pénétration → Libération de l'acide nucléique → Réplication du génome et fabrication des protéines virales par la cellule → Assemblage de nouveaux virus → Libération (bourgeonnement ou éclatement de la cellule)

## Les antibiotiques et leurs cibles
Un antibiotique tue les bactéries (bactéricide) ou bloque leur multiplication (bactériostatique), en visant des structures **absentes des cellules humaines** ou différentes :
| La cible | Exemple de famille |
| **Paroi** | Pénicillines (bêta-lactamines) |
| **Ribosomes** (synthèse des protéines) | Aminosides, macrolides, tétracyclines |
| **ADN** (réplication) | Quinolones |
| **Membrane** | Polymyxines |
> Un virus n'a ni paroi, ni ribosome, ni métabolisme propre : un antibiotique n'a **aucune prise** sur lui.

## L'antibiogramme
On étale la bactérie du patient sur une gélose, on dépose des disques imprégnés de différents antibiotiques, on incube. Autour de chaque disque, une **zone d'inhibition** se forme si la bactérie est sensible. On compare son diamètre à des valeurs critiques : la souche est **sensible** ou **résistante** (ou sensible à forte dose). L'antibiogramme guide le choix du traitement le plus efficace.

## La résistance aux antibiotiques
| La résistance | Son origine |
| **Naturelle** | Toutes les souches d'une espèce y échappent (par exemple une bactérie sans paroi face aux pénicillines) |
| **Acquise** | Une souche devient résistante par **mutation** de son ADN, ou par **transfert de gènes** d'une bactérie à une autre (souvent portés par des plasmides) |
~ Traitement antibiotique → Les bactéries sensibles meurent → Les rares bactéries résistantes survivent et se multiplient → La population devient résistante (sélection)
!> Chaque prise d'antibiotique inutile (pour une grippe, un rhume) favorise la **sélection** de souches résistantes. D'où les campagnes « Les antibiotiques, c'est pas automatique », et la règle : ne jamais arrêter un traitement prescrit de soi-même, ne jamais prendre les antibiotiques d'un autre.

## Vocabulaire
| Terme | Sens |
| Mycose | Infection due à un champignon |
| Infection **nosocomiale** | Contractée lors d'un séjour dans un établissement de santé |
| Épidémie | Augmentation rapide du nombre de cas d'une maladie dans une population |`,
          },
          questions: [
            ['Quelle différence fondamentale sépare une bactérie d’un virus ?', ['La bactérie est une cellule, le virus n’en est pas une', 'Le virus est plus gros', 'La bactérie ne se reproduit pas', 'Le virus a une paroi'], 0, 'Le virus ne se reproduit que dans une cellule hôte.'],
            ['Comment se reproduit une bactérie ?', ['Dans une cellule hôte', 'Par division : une bactérie en donne deux', 'Par méiose', 'Par bourgeonnement viral'], 1, 'Dans de bonnes conditions, parfois toutes les 20 minutes.'],
            ['Pourquoi les antibiotiques sont-ils inefficaces contre les virus ?', ['Les virus sont trop rapides', 'Les virus n’ont ni paroi, ni ribosome, ni métabolisme propre', 'Les antibiotiques sont détruits par le foie', 'Les virus sont trop gros'], 1, 'Les antibiotiques visent des structures bactériennes.'],
            ['Quelle est la première étape d’un cycle viral ?', ['La libération des virus', 'La fixation sur un récepteur de la cellule cible', 'L’assemblage', 'La réplication'], 1, 'Le virus reconnaît spécifiquement ses cellules cibles.'],
            ['Quelle structure les pénicillines ciblent-elles ?', ['Les ribosomes', 'La paroi bactérienne', 'Le noyau', 'La capside virale'], 1, 'Ce sont des bêta-lactamines.'],
            ['Que signifie une grande zone d’inhibition autour d’un disque d’antibiotique ?', ['La bactérie est résistante', 'La bactérie est sensible à cet antibiotique', 'L’antibiotique est périmé', 'Il n’y a pas de bactérie'], 1, 'On compare son diamètre aux valeurs critiques.'],
            ['Une résistance acquise peut provenir :', ['D’une mutation ou d’un transfert de gènes', 'D’une vaccination', 'D’un excès de vitamines', 'D’une allergie'], 0, 'Les gènes de résistance sont souvent portés par des plasmides.'],
            ['Prendre un antibiotique contre une grippe est utile pour guérir plus vite.', ['Vrai', 'Faux'], 1, 'La grippe est virale : l’antibiotique est inutile et favorise les résistances.'],
            ['Comment l’usage des antibiotiques favorise-t-il les souches résistantes ?', ['Il crée des mutations dirigées', 'Il élimine les bactéries sensibles et laisse les résistantes se multiplier', 'Il renforce toutes les bactéries', 'Il n’a aucun effet'], 1, 'C’est un phénomène de sélection.'],
            ['Quel agent pathogène cause le paludisme ?', ['Une bactérie', 'Un virus', 'Un parasite protozoaire', 'Un prion'], 2, 'Il est transmis par la piqûre d’un moustique.'],
            ['Qu’est-ce qu’une infection nosocomiale ?', ['Une infection contractée dans un établissement de santé', 'Une infection du nez', 'Une infection héréditaire', 'Une maladie des animaux'], 0, 'L’hygiène des mains en est la première prévention.'],
            ['À quoi sert un antibiogramme ?', ['À compter les globules blancs', 'À choisir l’antibiotique efficace contre la bactérie du patient', 'À dépister un cancer', 'À mesurer la glycémie'], 1, 'Il évite un traitement inutile.'],
          ],
        },
        {
          titre: 'Le soi, le non-soi et l’immunité innée : l’exemple de la grippe',
          axe: 'Système immunitaire et défense de l’organisme',
          lecon: {
            titre: 'Reconnaître l’étranger et réagir tout de suite',
            cours: `Pour se défendre, l'organisme doit d'abord distinguer ce qui lui appartient de ce qui lui est étranger. Puis une première ligne de défense, rapide et non spécifique, se met en place en quelques heures.

## Soi et non-soi
- Le **soi** : l'ensemble des molécules propres à un individu, que son système immunitaire tolère.
- Le **non-soi** : tout ce qui est reconnu comme étranger (micro-organismes, cellules d'un autre individu) ou comme un soi modifié (cellule infectée, cellule cancéreuse).
Les principaux **marqueurs du soi** :
| Le marqueur | Où le trouve-t-on ? |
| **Molécules du CMH de classe I** (système HLA chez l'être humain) | À la surface de toutes les cellules nucléées |
| **Molécules du CMH de classe II** | Sur certaines cellules immunitaires : macrophages, cellules dendritiques, lymphocytes B |
| **Antigènes des groupes sanguins** (A, B, Rhésus) | À la surface des globules rouges |
Ces marqueurs expliquent le **rejet de greffe** : il faut chercher un donneur compatible.
- Un **antigène** est une molécule reconnue comme étrangère, capable de déclencher une réponse immunitaire.
- Un **épitope** (déterminant antigénique) est la petite partie de l'antigène effectivement reconnue.

## Les acteurs du système immunitaire
| Les organes lymphoïdes | Leur rôle |
| **Primaires** : moelle osseuse rouge, thymus | Production des cellules immunitaires ; maturation des lymphocytes (B dans la moelle, T dans le thymus) |
| **Secondaires** : ganglions lymphatiques, rate, amygdales, plaques de Peyer | Rencontre avec les antigènes, activation des lymphocytes |

| Les éléments figurés du sang | Valeurs de référence (adulte) |
| **Hématies** (globules rouges) | Environ 4 à 5,5 millions par mm³ |
| **Leucocytes** (globules blancs) : polynucléaires (neutrophiles, éosinophiles, basophiles), lymphocytes, monocytes | 4 000 à 10 000 par mm³ |
| **Plaquettes** | 150 000 à 400 000 par mm³ |

## La première barrière : la peau et les muqueuses
- **Mécanique** : la kératine de la peau, le mucus qui piège, les cils qui balaient les voies respiratoires.
- **Chimique** : acidité de l'estomac et de la peau, lysozyme des larmes et de la salive.
- **Biologique** : la flore (microbiote) qui occupe la place des pathogènes.

## L'immunité innée : la réaction inflammatoire
Quand un pathogène franchit la barrière, la réaction inflammatoire se déclenche en quelques minutes à quelques heures, de façon **non spécifique**.
| Le symptôme | Son explication |
| **Rougeur** et **chaleur** | Vasodilatation : plus de sang arrive |
| **Gonflement** (œdème) | Les capillaires deviennent plus perméables : du plasma passe dans les tissus |
| **Douleur** | Médiateurs chimiques (histamine, prostaglandines) et compression des terminaisons nerveuses |
Les leucocytes quittent les vaisseaux (**diapédèse**) et rejoignent le foyer infectieux.

## La phagocytose
~ Adhésion du phagocyte au micro-organisme → Ingestion (le micro-organisme est enfermé dans une vésicule) → Digestion par les enzymes des lysosomes → Rejet des débris et présentation de fragments d'antigène aux lymphocytes
Les **polynucléaires neutrophiles** et les **macrophages** (issus des monocytes) sont les principaux phagocytes. En présentant l'antigène, le macrophage fait le lien avec l'immunité adaptative.

## Un exemple : la grippe
- **Agent** : le virus influenza, virus à ARN enveloppé, qui porte deux protéines de surface (hémagglutinine H et neuraminidase N).
- **Contamination** : par voie **respiratoire** (gouttelettes, aérosols) et par les mains ; le virus infecte les **cellules épithéliales** des voies respiratoires.
- **Symptômes** : début brutal, fièvre élevée, frissons, courbatures, maux de tête, fatigue intense (**asthénie**), toux sèche. La fièvre et les courbatures sont des effets de la réponse immunitaire elle-même.
- **Évolution** : guérison en une à deux semaines en général ; complications (pneumonies) chez les personnes fragiles.
!> La grippe est une maladie virale : le traitement est surtout symptomatique ; l'antibiotique ne sert qu'en cas de surinfection bactérienne.`,
          },
          questions: [
            ['Où trouve-t-on les molécules du CMH de classe I ?', ['Seulement sur les globules rouges', 'À la surface de toutes les cellules nucléées', 'Uniquement dans le thymus', 'Dans le plasma'], 1, 'Ce sont des marqueurs du soi.'],
            ['Qu’est-ce qu’un épitope ?', ['Un globule blanc', 'La partie d’un antigène effectivement reconnue', 'Un organe lymphoïde', 'Un anticorps'], 1, 'On parle aussi de déterminant antigénique.'],
            ['Quels sont les organes lymphoïdes primaires ?', ['La rate et les ganglions', 'La moelle osseuse rouge et le thymus', 'Les amygdales et le foie', 'Le cœur et les poumons'], 1, 'Les lymphocytes y sont produits et y acquièrent leur maturité.'],
            ['Dans quel organe les lymphocytes T acquièrent-ils leur maturité ?', ['La rate', 'Le thymus', 'Le foie', 'Le rein'], 1, 'D’où leur nom : T comme thymus.'],
            ['Quelle est la valeur normale des leucocytes chez l’adulte ?', ['4 000 à 10 000 par mm³', '150 000 à 400 000 par mm³', '4 à 5,5 millions par mm³', '100 à 500 par mm³'], 0, 'Les autres valeurs sont celles des plaquettes et des hématies.'],
            ['Quels sont les quatre symptômes de la réaction inflammatoire ?', ['Rougeur, chaleur, gonflement, douleur', 'Fièvre, toux, nausée, vertige', 'Pâleur, froid, raideur, démangeaison', 'Soif, faim, fatigue, sommeil'], 0, 'Ils s’expliquent par des phénomènes vasculaires et cellulaires.'],
            ['Qu’est-ce qui explique l’œdème de l’inflammation ?', ['La vasoconstriction', 'L’augmentation de la perméabilité des capillaires', 'La destruction des globules rouges', 'La baisse de la température'], 1, 'Du plasma passe dans les tissus.'],
            ['Dans quel ordre se déroule la phagocytose ?', ['Digestion, adhésion, ingestion', 'Adhésion, ingestion, digestion', 'Ingestion, adhésion, digestion', 'Adhésion, digestion, ingestion'], 1, 'Puis rejet des débris et présentation de l’antigène.'],
            ['L’immunité innée est spécifique d’un antigène précis.', ['Vrai', 'Faux'], 1, 'Elle est rapide et non spécifique.'],
            ['Comment le virus de la grippe se transmet-il ?', ['Par voie respiratoire et par les mains', 'Par piqûre de moustique', 'Par l’eau uniquement', 'Par voie sexuelle uniquement'], 0, 'Il infecte les cellules épithéliales des voies respiratoires.'],
            ['Quel terme médical désigne une fatigue intense ?', ['Asthénie', 'Polydipsie', 'Diurèse', 'Mycose'], 0, 'C’est un symptôme classique de la grippe.'],
            ['Le lysozyme des larmes est une défense :', ['Mécanique', 'Chimique', 'Adaptative', 'Hormonale'], 1, 'Cette enzyme détruit la paroi de certaines bactéries.'],
          ],
        },
        {
          titre: 'L’immunité adaptative, la vaccination et les analyses sanguines',
          axe: 'Système immunitaire et défense de l’organisme',
          lecon: {
            titre: 'Lymphocytes, anticorps et mémoire immunitaire',
            cours: `Si l'immunité innée ne suffit pas, une réponse **spécifique** se met en place en quelques jours : les lymphocytes reconnaissent précisément l'antigène, l'éliminent, et gardent la **mémoire** de la rencontre.

## La sélection et l'activation des lymphocytes
Chaque lymphocyte porte des récepteurs capables de reconnaître **un seul** épitope. Au contact de l'antigène, seuls les lymphocytes spécifiques sont **sélectionnés** ; ils se multiplient (**expansion clonale**) puis se **différencient**.

## Le lymphocyte T4, chef d'orchestre
~ Un macrophage ou une cellule dendritique présente un fragment d'antigène associé au CMH II → Le LT4 spécifique le reconnaît → Il se multiplie → Il se différencie en LT auxiliaires qui sécrètent des messagers (interleukines)
Les interleukines **activent** les lymphocytes B et les lymphocytes T8. Sans LT4, ni réponse humorale ni réponse cellulaire efficace : c'est pourquoi le VIH, qui détruit les LT4, effondre les défenses.

## La réponse à médiation humorale : les anticorps
1. Le lymphocyte B reconnaît l'antigène grâce à ses anticorps membranaires.
2. Activé (avec l'aide des LT4), il se multiplie.
3. Il se différencie en **plasmocytes**, qui sécrètent des anticorps en grande quantité, et en **lymphocytes B mémoire**.
| | Lymphocyte B | Plasmocyte |
| **Cytoplasme** | Peu abondant | Abondant |
| **Réticulum endoplasmique granuleux** | Peu développé | **Très développé** |
| **Appareil de Golgi** | Peu développé | **Très développé** |
Ces organites fabriquent et exportent des protéines : l'ultrastructure du plasmocyte est celle d'une **usine à anticorps**.

## La structure d'un anticorps (immunoglobuline G)
Une IgG a une forme en **Y** : quatre chaînes (deux lourdes, deux légères) reliées par des ponts disulfure.
- Au bout de chaque bras, les parties **variables** forment deux **paratopes** identiques, qui fixent l'épitope.
- Le pied (fragment constant) porte le **site de fixation du complément** et le **site de fixation au phagocyte**.
| La conséquence | Le mécanisme |
| **Neutralisation** | L'anticorps se fixe sur l'antigène et forme un **complexe immun** : le virus ou la toxine ne peut plus agir |
| **Opsonisation** | Le phagocyte s'accroche au pied de l'anticorps : la phagocytose est facilitée |
| **Activation du complément** | Des protéines du plasma se fixent au pied de l'anticorps et perforent la membrane de la cellule cible |

## La réponse à médiation cellulaire : les LT cytotoxiques
Le **LT8** reconnaît un fragment d'antigène associé au **CMH I** à la surface d'une cellule infectée. Activé (grâce aux interleukines des LT4), il se multiplie et se différencie en **LT cytotoxique** qui détruit la cellule infectée (**cytolyse**) : il libère des protéines qui percent sa membrane et déclenchent sa mort. Cette réponse élimine les virus **à l'intérieur** des cellules, là où les anticorps n'ont pas accès.

## Réponse primaire, réponse secondaire
| | Réponse **primaire** (premier contact) | Réponse **secondaire** (contact suivant) |
| **Délai** | Une à deux semaines | Quelques jours |
| **Quantité d'anticorps** | Faible | Beaucoup plus élevée |
| **Durée** | Courte | Prolongée |
Ce sont les **cellules mémoire** qui rendent la réponse secondaire plus rapide et plus forte.

## La vaccination
> Vacciner, c'est provoquer une **réponse primaire** sans la maladie, avec un antigène rendu inoffensif (virus atténué ou inactivé, fragment, ARN messager codant une protéine du virus). En cas de vraie infection, la réponse sera **secondaire** : rapide et efficace.
Le virus de la grippe **varie** chaque année (ses protéines H et N changent) : les anticorps mémoire ne le reconnaissent plus bien. D'où un vaccin **mis à jour chaque année**, recommandé aux personnes fragiles (65 ans et plus, maladies chroniques, femmes enceintes) et à leur entourage.

## Les analyses sanguines
- **Numération formule sanguine** (NFS) : une augmentation des polynucléaires neutrophiles oriente vers une infection bactérienne ; une augmentation des lymphocytes, vers une infection virale ; une augmentation des éosinophiles, vers une allergie ou un parasite.
- **Marqueurs de l'inflammation** : la **protéine C réactive** (CRP) augmente en quelques heures ; la vitesse de sédimentation, plus lentement.
- **Sérodiagnostic** : recherche d'anticorps spécifiques d'un agent. Des IgM signent une infection **récente** ; des IgG seules, une infection ancienne ou une vaccination.`,
          },
          questions: [
            ['Quel lymphocyte joue un rôle central en activant les réponses humorale et cellulaire ?', ['Le lymphocyte B', 'Le lymphocyte T4 (auxiliaire)', 'Le plasmocyte', 'Le polynucléaire neutrophile'], 1, 'Il sécrète des interleukines qui activent LB et LT8.'],
            ['En quelles cellules se différencient les lymphocytes B activés ?', ['En LT cytotoxiques', 'En plasmocytes et en lymphocytes B mémoire', 'En macrophages', 'En globules rouges'], 1, 'Les plasmocytes sécrètent les anticorps.'],
            ['Pourquoi le réticulum endoplasmique granuleux est-il très développé dans un plasmocyte ?', ['Parce qu’il produit de l’énergie', 'Parce que le plasmocyte fabrique et exporte des anticorps en grande quantité', 'Parce qu’il stocke des graisses', 'Parce qu’il se divise souvent'], 1, 'Le Golgi, très développé lui aussi, assure l’exportation.'],
            ['Où se situent les paratopes d’une immunoglobuline G ?', ['Au pied du Y', 'À l’extrémité des deux bras', 'Au centre de la molécule', 'Dans la membrane du lymphocyte uniquement'], 1, 'Ils sont formés par les parties variables des chaînes.'],
            ['Qu’est-ce que l’opsonisation ?', ['La destruction d’un anticorps', 'La facilitation de la phagocytose grâce à la fixation du phagocyte sur l’anticorps', 'La production de fièvre', 'La division des lymphocytes'], 1, 'Le phagocyte s’accroche au fragment constant de l’anticorps.'],
            ['Quelle cellule reconnaît un fragment d’antigène associé au CMH I sur une cellule infectée ?', ['Le LT4', 'Le LT8', 'Le lymphocyte B', 'L’hématie'], 1, 'Il devient un LT cytotoxique.'],
            ['Comment le LT cytotoxique élimine-t-il une cellule infectée ?', ['Par phagocytose', 'Par cytolyse : il perce sa membrane et déclenche sa mort', 'En sécrétant des anticorps', 'En la transformant en plasmocyte'], 1, 'Il atteint ainsi les virus logés dans les cellules.'],
            ['La réponse secondaire est plus rapide et plus forte que la réponse primaire.', ['Vrai', 'Faux'], 0, 'Grâce aux cellules mémoire.'],
            ['Sur quel principe repose la vaccination ?', ['Soigner une infection déjà installée', 'Provoquer une réponse primaire et créer une mémoire immunitaire sans la maladie', 'Tuer directement les bactéries', 'Remplacer les globules blancs'], 1, 'Une vraie infection déclenche alors une réponse secondaire.'],
            ['Pourquoi le vaccin contre la grippe est-il renouvelé chaque année ?', ['Parce que le virus varie', 'Parce que le vaccin est toxique', 'Parce que l’immunité ne dure que trois jours', 'Parce que la grippe est bactérienne'], 0, 'Les protéines H et N changent d’une saison à l’autre.'],
            ['Au sérodiagnostic, la présence d’IgM spécifiques indique :', ['Une infection ancienne', 'Une infection récente', 'Une absence de contact', 'Une allergie'], 1, 'Des IgG seules évoquent une infection ancienne ou une vaccination.'],
            ['Une forte augmentation des polynucléaires neutrophiles oriente vers :', ['Une infection bactérienne', 'Une anémie', 'Un diabète', 'Une infection virale seulement'], 0, 'Les lymphocytes augmentent plutôt dans les infections virales.'],
          ],
        },
        // ──────────────── BIOLOGIE — REPRODUCTION ────────────────
        {
          titre: 'Appareils reproducteurs, fécondation et grossesse',
          axe: 'Appareil reproducteur et transmission de la vie',
          lecon: {
            titre: 'Des gamètes au fœtus, et le suivi de la grossesse',
            cours: `La transmission de la vie repose sur la rencontre de deux cellules très particulières, les **gamètes**, puis sur le développement d'un embryon dans l'utérus, sous surveillance médicale.

## Les appareils reproducteurs
| Chez l'homme | Chez la femme |
| **Testicules** : production des spermatozoïdes (tubes séminifères) et de testostérone (cellules interstitielles de Leydig) | **Ovaires** : production des ovocytes et des hormones (œstrogènes, progestérone) |
| Voies génitales : épididyme, canal déférent, urètre | Voies génitales : **trompes** (pavillon, ampoule), **utérus** (muqueuse : l'endomètre ; muscle : le myomètre), col, vagin |
| Glandes annexes : vésicules séminales, prostate (liquide séminal) | |

## La gamétogenèse : des cellules à n chromosomes
Les cellules du corps sont **diploïdes** (2n = 46 chromosomes). Les gamètes sont **haploïdes** (n = 23), grâce à la **méiose**.
| | Spermatogenèse | Ovogenèse |
| **Début** | À la puberté, puis en continu | Avant la naissance ; bloquée jusqu'à la puberté |
| **Étapes** | Spermatogonie (2n) → spermatocyte I (2n) → spermatocyte II (n) → spermatide (n) → spermatozoïde (n) | Ovogonie (2n) → ovocyte I (2n), bloqué → ovocyte II (n) libéré à l'ovulation ; la méiose ne s'achève que si la fécondation a lieu |
| **Production** | Des millions par jour | Un ovocyte par cycle en général |
La **folliculogenèse** accompagne l'ovocyte : follicule primordial → primaire → secondaire → à antrum (cavitaire) → follicule mûr, qui se rompt à l'**ovulation** ; il devient alors **corps jaune**.

## Fécondation et nidation
~ Ovulation → Captation de l'ovocyte II par le pavillon → Fécondation dans le tiers externe de la trompe (ampoule) → Cellule-œuf (2n) → Divisions pendant la migration vers l'utérus → Nidation dans l'endomètre, vers le 7e jour
- On parle d'**embryon** jusqu'à la fin du deuxième mois (organes en formation), puis de **fœtus** (croissance et maturation).
- Les médecins datent la grossesse en **semaines d'aménorrhée** (SA), comptées depuis le premier jour des dernières règles : environ 41 SA au terme.

## Le placenta, lieu d'échanges
Le sang fœtal circule dans les villosités du placenta, baignées par le sang maternel : les deux sangs **ne se mélangent pas**.
| De la mère vers le fœtus | Du fœtus vers la mère |
| Dioxygène, glucose, acides aminés, eau, ions, anticorps (IgG) | Dioxyde de carbone, urée et autres déchets |
Le sang qui quitte le placenta par la veine ombilicale est **plus riche** en dioxygène et en nutriments que celui qui y arrive par les artères ombilicales. Chez le fœtus, la circulation court-circuite les poumons, qui ne respirent pas encore.
!> La « barrière » placentaire est poreuse : alcool, nicotine et monoxyde de carbone, de nombreux médicaments, certains virus et le parasite de la toxoplasmose la franchissent.

## Prévenir chez la femme enceinte
- **Zéro alcool** (le syndrome d'alcoolisation fœtale est la première cause évitable de handicap mental de l'enfant) et **pas de tabac** (petit poids, prématurité).
- Si elle n'est pas immunisée contre la **toxoplasmose** : viande bien cuite, crudités lavées, pas de contact avec la litière du chat.
- Contre la **listériose** : éviter les fromages au lait cru, la charcuterie à la coupe.
- Pas de médicament sans avis médical ; supplément en **acide folique** (vitamine B9) avant et en début de grossesse ; vaccination contre la grippe et la coqueluche recommandée.

## Le suivi de la grossesse
| L'examen | Son intérêt |
| **Échographies** (vers 12, 22 et 32 SA) | Datation, nombre d'embryons, croissance, morphologie, placenta. Avantages : **sans rayonnement ionisant**, non invasive, en temps réel, peu coûteuse |
| **Sérologies** (toxoplasmose, rubéole, syphilis…) | Chercher des anticorps pour savoir si la mère est protégée ou infectée ; une sérologie négative à la toxoplasmose est refaite chaque mois |
| **Dépistage de la trisomie 21** | Calcul d'un risque (clarté de la nuque à l'échographie, marqueurs sanguins, âge), puis analyse de l'ADN fœtal dans le sang maternel si le risque est élevé |
| **Amniocentèse** (à partir de 15 SA) | Prélèvement de liquide amniotique pour établir le **caryotype** du fœtus ; elle comporte un faible risque de fausse couche (de l'ordre de 0,5 à 1 %) |
Sur un caryotype, la **trisomie 21** se repère à trois chromosomes 21 (47 chromosomes au total).`,
          },
          questions: [
            ['Quelles cellules du testicule sécrètent la testostérone ?', ['Les spermatozoïdes', 'Les cellules interstitielles de Leydig', 'Les cellules de la prostate', 'Les cellules de l’épididyme'], 1, 'Elles sont situées entre les tubes séminifères.'],
            ['Combien de chromosomes contient un gamète humain ?', ['46', '23', '92', '47'], 1, 'Les gamètes sont haploïdes grâce à la méiose.'],
            ['Où a lieu la fécondation ?', ['Dans l’utérus', 'Dans le tiers externe de la trompe', 'Dans l’ovaire', 'Dans le vagin'], 1, 'Dans l’ampoule de la trompe.'],
            ['Vers quel jour après la fécondation a lieu la nidation ?', ['Le 1er jour', 'Le 7e jour environ', 'Le 30e jour', 'Le 60e jour'], 1, 'L’embryon s’implante dans l’endomètre.'],
            ['Après l’ovulation, le follicule rompu devient :', ['Un ovocyte I', 'Le corps jaune', 'Un spermatocyte', 'Le placenta'], 1, 'Il sécrète de la progestérone et des œstrogènes.'],
            ['Quand parle-t-on de fœtus plutôt que d’embryon ?', ['Dès la fécondation', 'Après la fin du deuxième mois', 'Après la naissance', 'Seulement au 9e mois'], 1, 'Les organes sont alors formés : c’est la phase de croissance.'],
            ['Au placenta, les sangs maternel et fœtal se mélangent.', ['Vrai', 'Faux'], 1, 'Les échanges se font à travers la paroi des villosités.'],
            ['Quelle substance passe du fœtus vers la mère ?', ['Le dioxygène', 'Le glucose', 'L’urée', 'Les anticorps'], 2, 'Les déchets du fœtus sont éliminés par l’organisme maternel.'],
            ['Pourquoi recommande-t-on zéro alcool pendant la grossesse ?', ['L’alcool ne passe pas le placenta', 'L’alcool franchit le placenta et peut provoquer un syndrome d’alcoolisation fœtale', 'L’alcool protège le fœtus', 'Seul le vin est dangereux'], 1, 'C’est la première cause évitable de handicap mental de l’enfant.'],
            ['Quel avantage l’échographie présente-t-elle pour suivre une grossesse ?', ['Elle utilise des rayons X', 'Elle n’expose pas à un rayonnement ionisant', 'Elle nécessite une anesthésie', 'Elle détruit les kystes'], 1, 'Elle est aussi non invasive et en temps réel.'],
            ['À quoi sert l’amniocentèse ?', ['À mesurer la glycémie', 'À établir le caryotype du fœtus', 'À déclencher l’accouchement', 'À vacciner le fœtus'], 1, 'Elle comporte un faible risque de fausse couche.'],
            ['Comment se repère la trisomie 21 sur un caryotype ?', ['Un chromosome 21 manque', 'Trois chromosomes 21 sont présents', 'Le chromosome X est absent', 'Tous les chromosomes sont doublés'], 1, 'Le caryotype compte alors 47 chromosomes.'],
          ],
        },
        {
          titre: 'Hormones de la reproduction, contraception et aide médicale à la procréation',
          axe: 'Appareil reproducteur et transmission de la vie',
          lecon: {
            titre: 'Réguler, maîtriser, aider la procréation',
            cours: `La production des gamètes est pilotée par des hormones, sous le contrôle du cerveau. Comprendre ces régulations permet de comprendre comment fonctionnent la contraception et l'aide médicale à la procréation.

## Le complexe hypothalamo-hypophysaire
L'**hypothalamus** (à la base du cerveau) sécrète de façon pulsatile la **GnRH**, qui stimule l'**antéhypophyse**. Celle-ci sécrète deux gonadostimulines, **FSH** et **LH**, qui agissent sur les gonades.

## Chez l'homme : une régulation constante
~ Hypothalamus (GnRH) → Hypophyse (LH, FSH) → Testicules : testostérone (LH) et spermatogenèse (FSH et testostérone) → La testostérone freine l'hypothalamus et l'hypophyse
Ce **rétrocontrôle négatif** maintient un taux de testostérone à peu près **constant**.
**Rôles de la testostérone** : développement des organes génitaux et des caractères sexuels secondaires (pilosité, voix, masse musculaire), maintien de la spermatogenèse, libido.

## Chez la femme : un fonctionnement cyclique
| La phase (cycle de 28 jours) | L'ovaire | L'utérus | Les hormones |
| **J1 à J5** | Début de croissance de follicules | **Règles** : l'endomètre se détache | Taux bas |
| **Phase folliculaire** (J1 à J14) | Un follicule devient dominant et mûrit | L'endomètre s'épaissit | La FSH stimule la croissance ; les **œstrogènes** augmentent |
| **Ovulation** (vers J14) | Le follicule mûr libère l'ovocyte II | | Un pic d'œstrogènes déclenche un **pic de LH**, qui provoque l'ovulation |
| **Phase lutéale** (J15 à J28) | Le **corps jaune** | L'endomètre devient sécrétoire, prêt pour une nidation | **Progestérone** et œstrogènes élevés |
| **Fin du cycle sans fécondation** | Le corps jaune régresse | L'endomètre se détache : nouvelles règles | Chute des hormones |
> Deux rétrocontrôles : **négatif** la plupart du temps (les hormones ovariennes freinent FSH et LH), **positif** juste avant l'ovulation (le pic d'œstrogènes déclenche le pic de LH).

**Période de fécondité** : les spermatozoïdes survivent quelques jours dans les voies génitales, l'ovocyte environ une journée. La fécondation est donc possible de quelques jours **avant** l'ovulation jusqu'au lendemain. La date d'ovulation varie d'un cycle à l'autre : ce calcul n'est pas une méthode de contraception fiable.

## La contraception
| Le moyen | Son mode d'action |
| **Pilule œstroprogestative** | Les hormones de synthèse exercent un rétrocontrôle négatif : pas de pic de LH, **pas d'ovulation** ; la glaire du col s'épaissit |
| **Pilule progestative, implant** | Épaississent la glaire cervicale ; certains bloquent l'ovulation |
| **Dispositif intra-utérin** (stérilet) au cuivre ou hormonal | Rend l'utérus défavorable aux spermatozoïdes et à la nidation |
| **Préservatifs** (externe ou interne) | Empêchent la rencontre des gamètes ; **seuls à protéger des infections sexuellement transmissibles** |
| **Contraception d'urgence** | Pilule (dans les 3 à 5 jours selon le produit, le plus tôt possible) ou dispositif au cuivre ; délivrée gratuitement en pharmacie |
Le choix dépend de l'âge, de la santé (tabac, antécédents de thrombose), de la vie affective, de la régularité de prise. Depuis 2023, les préservatifs sont gratuits en pharmacie pour les moins de 26 ans.

## L'interruption de grossesse
- **Physiologique** (fausse couche spontanée) : fréquente au premier trimestre, souvent due à une anomalie chromosomique de l'embryon.
- **Interruption volontaire de grossesse** (IVG), autorisée par la loi Veil de 1975 et possible jusqu'à la fin de la **14e semaine de grossesse** (16 SA) depuis la loi du 2 mars 2022 :
| La méthode | Le principe |
| **Médicamenteuse** (jusqu'à 7 semaines de grossesse, soit 9 SA) | Un anti-progestérone (mifépristone) interrompt la grossesse, puis une prostaglandine (misoprostol) provoque l'expulsion |
| **Instrumentale** (chirurgicale) | Aspiration du contenu de l'utérus, sous anesthésie locale ou générale |

## L'infertilité et l'aide médicale à la procréation
On parle d'**infertilité** après douze mois de rapports réguliers sans contraception et sans grossesse.
| Les causes féminines | Les causes masculines |
| Troubles de l'ovulation, trompes bouchées (après une infection à chlamydia, par exemple), endométriose, âge | Absence (**azoospermie**) ou trop peu de spermatozoïdes, spermatozoïdes peu mobiles ou anormaux |
| La technique | Quand l'utiliser ? |
| **Stimulation ovarienne** | Troubles de l'ovulation |
| **Insémination artificielle** (sperme déposé dans l'utérus) | Glaire hostile, infertilité modérée, don de sperme |
| **Fécondation in vitro** (FIV) : fécondation en laboratoire puis transfert d'embryon | Trompes bouchées, échec des autres techniques |
| **ICSI** (injection d'un spermatozoïde dans l'ovocyte) | Infertilité masculine sévère |
| **Don de gamètes** | Absence de gamètes chez l'un des partenaires |
Depuis la loi de bioéthique du 2 août 2021, l'AMP est ouverte aux couples de femmes et aux femmes seules.`,
          },
          questions: [
            ['Quelle glande sécrète la FSH et la LH ?', ['L’hypothalamus', 'L’antéhypophyse', 'L’ovaire', 'La thyroïde'], 1, 'Elle est stimulée par la GnRH de l’hypothalamus.'],
            ['Pourquoi le taux de testostérone reste-t-il à peu près constant ?', ['Grâce à un rétrocontrôle négatif sur l’hypothalamus et l’hypophyse', 'Grâce à un rétrocontrôle positif', 'Parce que les testicules ne réagissent à rien', 'Grâce à l’insuline'], 0, 'La testostérone freine sa propre stimulation.'],
            ['Quel événement hormonal déclenche l’ovulation ?', ['La chute de la progestérone', 'Un pic de LH', 'La sécrétion d’insuline', 'La baisse des œstrogènes'], 1, 'Il est lui-même provoqué par un pic d’œstrogènes (rétrocontrôle positif).'],
            ['Quelle hormone domine pendant la phase lutéale ?', ['La testostérone', 'La progestérone', 'Le glucagon', 'La FSH seule'], 1, 'Elle est sécrétée par le corps jaune.'],
            ['Qu’est-ce qui déclenche les règles en l’absence de fécondation ?', ['La régression du corps jaune et la chute des hormones', 'Un pic de LH', 'La nidation', 'L’augmentation de la progestérone'], 0, 'L’endomètre n’est plus entretenu et se détache.'],
            ['Comment agit la pilule œstroprogestative ?', ['Elle tue les spermatozoïdes', 'Elle bloque l’ovulation par rétrocontrôle négatif', 'Elle provoque l’ovulation', 'Elle empêche la fabrication des spermatozoïdes'], 1, 'Pas de pic de LH, donc pas d’ovulation.'],
            ['Quel moyen de contraception protège aussi des infections sexuellement transmissibles ?', ['La pilule', 'L’implant', 'Le préservatif', 'Le stérilet au cuivre'], 2, 'C’est le seul à empêcher le contact entre muqueuses.'],
            ['Jusqu’à quand l’IVG est-elle possible en France ?', ['Jusqu’à la fin de la 10e semaine de grossesse', 'Jusqu’à la fin de la 14e semaine de grossesse', 'Jusqu’au 6e mois', 'Jusqu’à la fin de la 4e semaine'], 1, 'Soit 16 semaines d’aménorrhée, depuis la loi du 2 mars 2022.'],
            ['Quel est le rôle de la mifépristone dans l’IVG médicamenteuse ?', ['Elle provoque l’ovulation', 'C’est un anti-progestérone qui interrompt la grossesse', 'C’est une hormone de croissance', 'C’est un antibiotique'], 1, 'Le misoprostol provoque ensuite l’expulsion.'],
            ['Calculer sa date d’ovulation est une méthode de contraception fiable.', ['Vrai', 'Faux'], 1, 'La date d’ovulation varie d’un cycle à l’autre.'],
            ['Quelle technique d’AMP convient à une infertilité masculine sévère ?', ['La stimulation ovarienne', 'L’ICSI', 'L’insémination artificielle', 'La pilule'], 1, 'Un spermatozoïde est injecté directement dans l’ovocyte.'],
            ['Que signifie azoospermie ?', ['L’absence de spermatozoïdes dans le sperme', 'Un excès de spermatozoïdes', 'Une inflammation de la prostate', 'L’absence de règles'], 0, 'Le préfixe a- marque l’absence.'],
          ],
        },
        // ──────────────── BIOLOGIE — GÈNES ────────────────
        {
          titre: 'Du gène à la protéine et la transmission des caractères',
          axe: 'Gènes et transmission de l’information génétique',
          lecon: {
            titre: 'ADN, code génétique, mutations et hérédité',
            cours: `La couleur de tes yeux, ton groupe sanguin, et parfois une maladie : tout cela est écrit dans ton ADN, lu par tes cellules et transmis à tes enfants selon des règles précises.

## De la base azotée au chromosome
| Le niveau | La description |
| **Base azotée** | A (adénine), T (thymine), G (guanine), C (cytosine) |
| **Nucléotide** | Une base + un sucre (désoxyribose) + un groupe phosphate |
| **ADN** | Deux brins de nucléotides enroulés en double hélice ; les bases sont **complémentaires** : A face à T, G face à C |
| **Chromatine** | L'ADN associé à des protéines, dans le noyau |
| **Chromosome** | La chromatine condensée, visible pendant la division ; à une ou deux **chromatides** |
L'être humain possède **46 chromosomes** : 22 paires d'**autosomes** et une paire de **gonosomes** (XX chez la femme, XY chez l'homme).

## La division cellulaire
~ Interphase : l'ADN se duplique (le chromosome passe à deux chromatides) → Mitose : les chromatides se séparent → Deux cellules filles identiques à la cellule mère
La mitose permet la croissance, le renouvellement des tissus (peau, sang) et la cicatrisation.

## Du gène à la protéine
Un **gène** est une portion d'ADN qui porte l'information pour fabriquer une protéine.
| | **Transcription** | **Traduction** |
| **Où ?** | Dans le **noyau** | Dans le **cytoplasme**, sur les **ribosomes** |
| **Quoi ?** | Un brin d'ADN est copié en **ARN messager** (ARNm) | L'ARNm est lu trois bases par trois bases (**codons**) ; chaque codon correspond à un acide aminé |
| **Acteurs** | ARN polymérase, nucléotides à uracile (U) à la place de T | Ribosomes, ARN de transfert qui apportent les acides aminés |
Le **code génétique** : 64 codons, dont AUG (début, méthionine) et trois codons **stop** (UAA, UAG, UGA). Plusieurs codons peuvent coder le même acide aminé ; le code est le même chez presque tous les êtres vivants.
**Exemple** : brin d'ADN transcrit TAC GGA TTT → ARNm AUG CCU AAA → méthionine – proline – lysine.

## Les mutations ponctuelles
| La mutation | L'effet possible sur la protéine |
| **Substitution** d'une base | Aucun (codon synonyme), un acide aminé changé, ou un codon stop prématuré (protéine raccourcie) |
| **Insertion** ou **délétion** d'une base | Décalage de la lecture : tous les codons suivants changent |
**Exemple** : dans la **drépanocytose**, une substitution A → T dans le gène de la bêta-globine change un seul acide aminé (acide glutamique → valine) : l'hémoglobine anormale déforme les globules rouges en faucille.

## La transmission des caractères héréditaires
| La notion | La définition |
| **Allèle** | Une version d'un gène |
| **Génotype** / **phénotype** | Les allèles portés / le caractère observé |
| **Homozygote** / **hétérozygote** | Deux allèles identiques / deux allèles différents |
| **Dominant** / **récessif** | Il s'exprime même à un seul exemplaire / il ne s'exprime que chez l'homozygote |
| **Codominance** | Les deux allèles s'expriment (groupe sanguin AB) |

## Lire un arbre généalogique
1. Si deux parents **sains** ont un enfant **malade**, l'allèle de la maladie est **récessif**.
2. Si la maladie touche presque seulement des garçons, transmise par des mères saines, penser à un gène porté par le **chromosome X** (hémophilie, myopathie de Duchenne).
3. Sinon, le gène est porté par un **autosome** (mucoviscidose, drépanocytose : autosomiques récessives ; maladie de Huntington : autosomique dominante).

## L'échiquier de croisement
Deux parents hétérozygotes pour la mucoviscidose (allèle normal N dominant, allèle m récessif) :
| | N | m |
| **N** | N//N (sain) | N//m (sain, porteur) |
| **m** | N//m (sain, porteur) | m//m (**malade**) |
> Risque pour chaque enfant : 1/4 d'être malade, 1/2 d'être porteur sain, 1/4 d'être sain non porteur. Ce risque est le même à **chaque** grossesse.`,
          },
          questions: [
            ['Quelles bases sont complémentaires dans l’ADN ?', ['A-G et T-C', 'A-T et G-C', 'A-C et G-T', 'A-U et G-C'], 1, 'L’uracile U remplace T dans l’ARN.'],
            ['Combien de chromosomes compte une cellule humaine non reproductrice ?', ['23', '44', '46', '48'], 2, '22 paires d’autosomes et une paire de gonosomes.'],
            ['Où a lieu la transcription ?', ['Dans le cytoplasme', 'Dans le noyau', 'Dans les ribosomes', 'Dans les mitochondries'], 1, 'L’ADN y est copié en ARN messager.'],
            ['Où a lieu la traduction ?', ['Dans le noyau', 'Dans le cytoplasme, sur les ribosomes', 'Dans la membrane plasmique', 'Dans l’ADN'], 1, 'L’ARNm y est lu codon par codon.'],
            ['Un brin d’ADN transcrit porte TAC. Quel est le codon d’ARNm correspondant ?', ['ATG', 'AUG', 'UAC', 'TUG'], 1, 'A → U, T → A, G → C, C → G.'],
            ['Un codon est formé de :', ['Une base', 'Deux bases', 'Trois bases', 'Quatre bases'], 2, 'Chaque codon correspond à un acide aminé ou à un signal stop.'],
            ['Quel type de mutation décale la lecture de tous les codons suivants ?', ['Une substitution', 'Une insertion ou une délétion d’une base', 'Une mutation silencieuse', 'Aucune'], 1, 'On parle de décalage du cadre de lecture.'],
            ['Dans la drépanocytose, la mutation remplace :', ['Toute la protéine', 'Un seul acide aminé de la bêta-globine', 'Un chromosome entier', 'Le groupe sanguin'], 1, 'L’acide glutamique est remplacé par une valine.'],
            ['Deux parents sains ont un enfant malade. L’allèle de la maladie est :', ['Dominant', 'Récessif', 'Codominant', 'Porté par le chromosome Y'], 1, 'Les parents sont porteurs sains, hétérozygotes.'],
            ['Deux parents hétérozygotes pour une maladie autosomique récessive. Quel est le risque qu’un enfant soit malade ?', ['1/2', '1/4', '3/4', '0'], 1, 'Seul le génotype m//m est malade.'],
            ['L’hémophilie touche surtout des garçons car son gène est porté par le chromosome X.', ['Vrai', 'Faux'], 0, 'Un garçon n’a qu’un chromosome X : un seul allèle récessif suffit.'],
            ['Le groupe sanguin AB illustre :', ['La récessivité', 'La codominance', 'Une mutation', 'Une maladie génétique'], 1, 'Les allèles A et B s’expriment tous les deux.'],
          ],
        },
        {
          titre: 'Le cancer, une conséquence de mutations génétiques',
          axe: 'Gènes et transmission de l’information génétique',
          lecon: {
            titre: 'De la mutation aux métastases, du dépistage au traitement',
            cours: `Le cancer est la première cause de mortalité en France : plus de 400 000 nouveaux cas chaque année. C'est une maladie des **gènes** : des cellules accumulent des mutations et échappent aux règles qui contrôlent leur division.

## Des mutations aux métastases
~ Une cellule accumule des mutations (initiation) → Elle se divise sans contrôle (promotion) → Une tumeur se forme → Elle attire des vaisseaux sanguins qui la nourrissent → Des cellules envahissent les tissus voisins, passent dans le sang ou la lymphe → Elles forment des tumeurs secondaires à distance : les **métastases**
Deux familles de gènes sont en cause : des gènes qui **accélèrent** la division (devenus trop actifs) et des gènes qui la **freinent** ou réparent l'ADN (devenus inactifs). Il faut en général **plusieurs** mutations : c'est pourquoi le risque augmente avec l'âge.

## Tumeur bénigne ou maligne
| | Tumeur **bénigne** | Tumeur **maligne** (cancer) |
| **Limites** | Nettes, souvent entourée d'une capsule | Mal limitée, elle envahit les tissus voisins |
| **Croissance** | Lente | Souvent rapide |
| **Cellules** | Proches des cellules normales | Anormales, peu différenciées, nombreuses divisions |
| **Métastases** | Jamais | Possibles |

## Une origine plurifactorielle
| Les facteurs | Exemples |
| **Comportements** | **Tabac** (première cause de cancer évitable), alcool, alimentation déséquilibrée, surpoids, sédentarité |
| **Environnement** | Ultraviolets, rayonnements ionisants, amiante et autres expositions professionnelles, pollution de l'air |
| **Infections** | Papillomavirus (col de l'utérus), virus des hépatites B et C (foie), bactérie Helicobacter pylori (estomac) |
| **Génétique** | Rares prédispositions héréditaires (mutations des gènes BRCA1 et BRCA2 pour le sein et l'ovaire) |
Les agents qui provoquent des mutations sont dits **mutagènes** ; ceux qui favorisent le cancer, **cancérogènes**. Environ 40 % des cancers sont attribuables à des facteurs **évitables** : c'est l'objet de la prévention (arrêt du tabac, protection solaire, vaccination contre les papillomavirus et l'hépatite B).

## Un exemple : le cancer du sein
Le cancer le plus fréquent chez la femme (environ 60 000 nouveaux cas par an en France), et la première cause de décès par cancer chez elle ; détecté tôt, il guérit dans une grande majorité des cas.
| L'étape | Les moyens |
| **Dépistage** | Mammographie tous les deux ans de 50 à 74 ans (dépistage organisé), palpation |
| **Diagnostic** | Imagerie (mammographie, échographie, IRM), puis **biopsie** : seul l'**examen anatomopathologique** du tissu au microscope affirme le cancer |
| **Bilan d'extension** | Scanner, scintigraphie osseuse, TEP : chercher des métastases |
| **Suivi** | Examens cliniques, imagerie ; les **marqueurs tumoraux** sanguins servent au suivi, pas au dépistage |

## Les traitements
| Le traitement | Le principe | Les effets secondaires |
| **Chirurgie** | Retirer la tumeur (tumorectomie, ou mastectomie), et des ganglions pour vérifier leur atteinte | Douleur, cicatrice, lymphœdème du bras |
| **Radiothérapie** | Rayonnements ionisants concentrés sur la zone tumorale : ils lèsent l'ADN des cellules | Fatigue, rougeur de la peau irradiée |
| **Chimiothérapie** | Médicaments qui bloquent la division des cellules | Ils touchent aussi les cellules saines qui se divisent vite : **chute des cheveux** (alopécie), nausées, baisse des globules blancs (risque d'infection), aphtes |
| **Hormonothérapie** | Bloquer les hormones qui stimulent certaines tumeurs du sein | Bouffées de chaleur |
| **Thérapies ciblées, immunothérapie** | Viser une anomalie précise de la cellule cancéreuse, ou relancer les défenses immunitaires | Variables |
> Chaque effet secondaire de la chimiothérapie s'explique par le **mécanisme** : elle frappe toutes les cellules qui se divisent rapidement, cancéreuses ou non.

!> Un marqueur tumoral normal n'exclut pas un cancer, et un marqueur élevé ne le prouve pas : seul l'examen anatomopathologique fait le diagnostic.

## Vocabulaire
| Terme | Sens |
| Biopsie | Prélèvement d'un fragment de tissu pour l'examiner au microscope |
| Métastase | Tumeur secondaire, à distance de la tumeur primitive |
| onco-, carcino- | Tumeur, cancer |
| -ectomie | Ablation chirurgicale |`,
          },
          questions: [
            ['Qu’est-ce qu’une métastase ?', ['Une tumeur bénigne', 'Une tumeur secondaire, à distance de la tumeur primitive', 'Un globule blanc', 'Un gène protecteur'], 1, 'Des cellules cancéreuses ont voyagé par le sang ou la lymphe.'],
            ['Quelle caractéristique distingue une tumeur maligne ?', ['Des limites nettes', 'Une capsule qui l’entoure', 'Elle envahit les tissus voisins et peut donner des métastases', 'Une croissance toujours lente'], 2, 'Une tumeur bénigne ne métastase jamais.'],
            ['Pourquoi le risque de cancer augmente-t-il avec l’âge ?', ['Parce qu’il faut en général accumuler plusieurs mutations', 'Parce que les cellules ne se divisent plus', 'Parce que le cancer est contagieux', 'Parce que l’ADN disparaît'], 0, 'Les mutations s’additionnent au fil du temps.'],
            ['Quelle est la première cause de cancer évitable ?', ['Le soleil', 'Le tabac', 'Les virus', 'L’hérédité'], 1, 'Il est en cause dans de nombreux cancers, dont celui du poumon.'],
            ['Quel virus est à l’origine de la plupart des cancers du col de l’utérus ?', ['Le virus de la grippe', 'Les papillomavirus humains', 'Le VIH', 'Le virus de la rougeole'], 1, 'Une vaccination et un dépistage existent.'],
            ['Quel examen affirme le diagnostic de cancer ?', ['La prise de température', 'L’examen anatomopathologique d’une biopsie', 'Un marqueur tumoral seul', 'La radiographie des poumons'], 1, 'On observe le tissu au microscope.'],
            ['Pourquoi la chimiothérapie fait-elle tomber les cheveux ?', ['Elle frappe toutes les cellules qui se divisent vite, dont celles des follicules pileux', 'Elle brûle la peau', 'Elle est appliquée sur le crâne', 'Elle provoque une allergie'], 0, 'Les cellules sanguines et digestives sont touchées pour la même raison.'],
            ['La radiothérapie utilise :', ['Des ultrasons', 'Des rayonnements ionisants concentrés sur la tumeur', 'Des champs magnétiques', 'Des anticorps'], 1, 'Ils lèsent l’ADN des cellules irradiées.'],
            ['Les marqueurs tumoraux sanguins servent au dépistage du cancer du sein dans la population.', ['Vrai', 'Faux'], 1, 'Ils servent au suivi ; le dépistage repose sur la mammographie.'],
            ['Le dépistage organisé du cancer du sein concerne les femmes de :', ['25 à 65 ans', '40 à 50 ans', '50 à 74 ans', 'Plus de 80 ans'], 2, 'Une mammographie tous les deux ans.'],
            ['Pourquoi un patient sous chimiothérapie est-il exposé aux infections ?', ['Ses globules blancs diminuent', 'Ses globules rouges augmentent', 'Il reçoit des antibiotiques', 'Sa peau s’épaissit'], 0, 'La moelle osseuse, qui se divise vite, est touchée.'],
            ['Que signifie le suffixe -ectomie ?', ['Inflammation', 'Ablation chirurgicale', 'Tumeur', 'Examen visuel'], 1, 'Une mastectomie est l’ablation du sein.'],
          ],
        },
        // ──────────────── MÉTHODE ────────────────
        {
          titre: 'Méthode : réussir l’épreuve écrite de CBPH',
          axe: 'Méthodologie',
          lecon: {
            titre: 'Deux copies, deux façons de raisonner',
            cours: `L'épreuve de chimie, biologie et physiopathologie humaines dure **4 heures** et pèse lourd au baccalauréat (coefficient 16 au total). Elle se compose de **deux parties indépendantes**, rédigées sur **deux copies séparées**.

## La structure de l'épreuve
| La partie | Durée indicative | Barème | Coefficient | Le contenu |
| **Chimie** | 1 heure | Sur 20 | 3 | Deux exercices indépendants : documents, protocole, calculs, argumentation |
| **Biologie et physiopathologie humaines** | 3 heures | Sur 20 | 13 | Au moins deux chapitres du programme, questions liées ou indépendantes, documents (clichés, résultats d'analyses, schémas…) |
= Le programme de première (biologie et physiopathologie humaines, physique-chimie pour la santé) peut être mobilisé
> La biologie compte plus de quatre fois plus que la chimie : garde tes trois heures pour elle, mais ne néglige pas la chimie, où des points se gagnent vite.

## En chimie : les réflexes
1. **Écris la formule** littérale avant de remplacer par les valeurs (n = m ÷ M, V = n × Vm, Cm = C × M).
2. **Convertis** les unités (mL en L, °C en K, µs en s) avant de calculer.
3. **Donne le résultat** avec son unité et un nombre raisonnable de chiffres significatifs.
4. **Commente** l'ordre de grandeur : un volume de 72 L pour un airbag est plausible, 72 000 L ne l'est pas.
5. Pour un protocole, cite le **matériel** précis (fiole jaugée, pipette jaugée) et les **gestes** (compléter au trait de jauge, agiter).

## En biologie : la démarche attendue
Le sujet s'appuie souvent sur un **cas clinique**. La démarche type :
~ Relever les signes cliniques → Relever les signes paracliniques et les comparer aux valeurs de référence → Relier les signes au mécanisme physiopathologique → Nommer la pathologie → Expliquer le diagnostic → Présenter et justifier le traitement et la prévention
- **Signes cliniques** : ce que le patient ressent ou ce que le médecin constate à l'examen.
- **Signes paracliniques** : les résultats d'examens complémentaires (analyses, imagerie).
- **Étiologie** : la cause de la maladie.

## Exploiter un document
1. **Présente** le document (nature, ce qu'il montre, conditions).
2. **Décris** avec des valeurs précises : « la glycémie passe de 0,9 g/L à 1,6 g/L en une heure ».
3. **Compare** à une référence ou à un témoin.
4. **Interprète** : relie le constat à tes connaissances.
5. **Conclus** en répondant exactement à la question posée.
!> Décrire n'est pas interpréter : « la courbe monte » ne suffit pas ; il faut dire **pourquoi** elle monte.

## Réaliser un schéma
Un **titre**, des **traits de légende** à la règle et horizontaux, des légendes précises, des flèches pour les mécanismes, au crayon. Un schéma de synthèse (régulation de la glycémie, rétrocontrôles hormonaux) montre les **acteurs** et les **relations** entre eux.

## Le vocabulaire médical
Le programme exige de connaître préfixes, suffixes et racines. Un mot se découpe : **hyper-glyc-émie** = excès de glucose dans le sang.
| Préfixe | Sens | Suffixe | Sens |
| a-, an- | Absence | -algie | Douleur |
| brady- / tachy- | Lent / rapide | -ite | Inflammation |
| dys- | Difficulté, anomalie | -émie | Présence dans le sang |
| hyper- / hypo- | Excès / insuffisance | -urie | Présence dans l'urine |
| oligo- / poly- | Peu / beaucoup | -ectomie | Ablation |
| endo- / exo- | Dedans / dehors | -tomie / -stomie | Incision / abouchement |
| micro- / macro- | Petit / grand | -scopie / -graphie | Examen visuel / enregistrement |
| néo- | Nouveau | -pénie / -mégalie | Diminution / augmentation de volume |
| | | -plégie / -rragie | Paralysie / écoulement de sang |
| | | -ome / -ose | Tumeur / maladie non inflammatoire |
| | | -centèse / -plastie | Ponction / réparation |
| | | -lyse / -cide | Destruction / qui tue |

**Exemples** : une **leucopénie** est une baisse des globules blancs ; une **splénomégalie**, une rate augmentée de volume ; une **amniocentèse**, une ponction du liquide amniotique.

## Gérer le temps
Lis tout le sujet de biologie avant de commencer (les questions sont souvent liées, et un document placé plus loin peut aider plus tôt). Garde dix minutes pour relire : unités, orthographe des termes médicaux, réponses oubliées.`,
          },
          questions: [
            ['Combien de temps dure l’épreuve écrite de CBPH ?', ['2 heures', '3 heures', '4 heures', '5 heures'], 2, 'Environ 1 heure pour la chimie et 3 heures pour la biologie.'],
            ['Quel est le coefficient de la partie biologie et physiopathologie humaines ?', ['3', '8', '13', '16'], 2, 'La chimie a un coefficient 3 ; le total fait 16.'],
            ['Combien d’exercices comporte la partie chimie ?', ['Un', 'Deux exercices indépendants', 'Cinq', 'Dix'], 1, 'Ils mobilisent documents, protocole et calculs.'],
            ['Qu’est-ce qu’un signe paraclinique ?', ['Un symptôme ressenti par le patient', 'Un résultat d’examen complémentaire', 'Un traitement', 'Une cause de maladie'], 1, 'Analyses et imagerie fournissent les signes paracliniques.'],
            ['Que désigne l’étiologie d’une maladie ?', ['Son traitement', 'Sa cause', 'Son évolution', 'Son coût'], 1, 'Par exemple, la destruction auto-immune des cellules β dans le diabète de type 1.'],
            ['Que signifie hyperglycémie ?', ['Un manque de glucose dans le sang', 'Un excès de glucose dans le sang', 'Du glucose dans l’urine', 'Une inflammation du pancréas'], 1, 'hyper- : excès ; -émie : dans le sang.'],
            ['Que signifie leucopénie ?', ['Une augmentation des globules blancs', 'Une diminution des globules blancs', 'Une inflammation des globules blancs', 'Une tumeur des globules blancs'], 1, 'leuco- : blanc ; -pénie : diminution.'],
            ['Le suffixe -ite signifie :', ['Ablation', 'Inflammation', 'Tumeur', 'Douleur'], 1, 'Une appendicite est une inflammation de l’appendice.'],
            ['Décrire une courbe suffit pour l’interpréter.', ['Vrai', 'Faux'], 1, 'Il faut relier le constat aux connaissances pour expliquer pourquoi.'],
            ['Que faut-il faire avant de remplacer les valeurs dans un calcul de chimie ?', ['Écrire la formule littérale et convertir les unités', 'Arrondir toutes les données à l’unité', 'Ignorer les unités', 'Donner le résultat sans calcul'], 0, 'Puis donner le résultat avec son unité.'],
            ['Que signifie tachycardie ?', ['Un cœur lent', 'Un cœur rapide', 'Un cœur augmenté de volume', 'Une inflammation du cœur'], 1, 'tachy- : rapide ; brady- : lent.'],
            ['Pourquoi lire tout le sujet de biologie avant de commencer ?', ['Parce que les questions sont souvent liées et qu’un document plus loin peut aider', 'Pour perdre du temps', 'Parce que c’est obligatoire', 'Pour choisir de ne traiter qu’une question'], 0, 'On gagne en cohérence et en temps.'],
          ],
        },
      ],
    },
  ],
}
