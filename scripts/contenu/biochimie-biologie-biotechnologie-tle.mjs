// Biochimie, biologie et biotechnologie — Terminale STL. Programme officiel :
// annexe du BO spécial n° 8 du 25 juillet 2019. Trois parties : S (concepts
// scientifiques : S1 enzymes et voies métaboliques, S2 immunité, S3 ADN et
// réplication, S4 micro-organismes), T (fondamentaux technologiques : T1 à T10)
// et L (travailler ensemble au laboratoire : projet, prévention, mesure,
// numérique). L'épreuve suit la note de service du 11 septembre 2026 (BO
// spécial n° 4 du 17 septembre 2026, en vigueur à la session 2027).
//
// Les modules de 1re (`biochimie-biologie-1re.mjs`, `biotechnologies-1re.mjs`)
// ont déjà posé les biomolécules, la structure de l'ADN, la transcription, la
// culture, le dénombrement, la CCM et les dosages par Beer-Lambert et par
// titrage : rien ici ne les redit, on s'appuie dessus.
//
// Matière NEUVE (slug `biochimie-biologie-biotechnologie`, déclarée pour la Tle
// techno) : le bloc part de la position 1. L'axe est le module officiel.

export default {
  slug: 'biochimie-biologie-biotechnologie',
  nom: 'Biochimie, biologie et biotechnologie',

  titreMigration: 'BIOCHIMIE, BIOLOGIE ET BIOTECHNOLOGIE Tle STL — LE PROGRAMME OFFICIEL (16 fiches)',

  motif: `Les élèves de Tle STL qui suivent la spécialité biochimie-biologie-
biotechnologie ne trouvaient rien dans l'app. Cette migration installe 16 fiches
qui suivent le programme officiel (BO spécial n° 8 du 25 juillet 2019) :
métabolisme énergétique et enzymes (S1), immunité (S2), ADN (S3),
micro-organismes (S4), croissance et identification microbiennes (T2, T3),
immunotechniques (T6), séparation (T7), dosages enzymatiques (T8), technologies
de l'ADN (T9), et une fiche méthode de l'épreuve (écrit et ECE, note de service
du 11 septembre 2026).`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 1,
      chapitres: [
        {
          titre: 'Métabolisme, enthalpie libre et ATP',
          axe: 'S1 – Enzymes et voies métaboliques',
          lecon: {
            titre: 'L’énergie circule par couplages',
            cours: `Une cellule ne brûle pas son glucose d’un coup : elle découpe l’énergie en petites monnaies, et la monnaie universelle s’appelle l’**ATP**.

## Anabolisme et catabolisme
Une **voie métabolique** est une chaîne de réactions, chacune catalysée par une enzyme.
| Voie | Ce qu’elle fait | Exemples |
| **Catabolisme** | dégrade des molécules, libère de l’énergie | glycolyse, glycogénolyse, lipolyse |
| **Anabolisme** | synthétise des molécules, consomme de l’énergie | glycogénogenèse, cycle de Calvin, synthèse d’acides aminés |

## L’enthalpie libre de réaction
Le signe de l’enthalpie libre de réaction ΔrG indique le sens d’évolution spontanée :
- ΔrG < 0 : réaction **exergonique**, spontanée dans le sens écrit ;
- ΔrG > 0 : réaction **endergonique**, impossible seule dans ce sens.

En biochimie, on compare les réactions dans des **conditions standard biologiques** (pH 7, 25 °C, concentrations à 1 mol·L⁻¹) : c’est ΔrG’°, exprimée en kJ·mol⁻¹.

## Le couplage énergétique
Une réaction endergonique devient possible si on la **couple** à une réaction exergonique : on additionne les deux équations, et on additionne les ΔrG’°.
= ΔrG’° (couplée) = ΔrG’°1 + ΔrG’°2
> Si la somme algébrique est négative, la réaction couplée est spontanée.

## L’ATP, molécule énergétique intermédiaire
L’ATP (adénosine triphosphate) porte deux **liaisons à haut potentiel énergétique** entre ses phosphates. Son hydrolyse est très exergonique :
= ATP + H₂O → ADP + Pi ; ΔrG’° ≈ −30,5 kJ·mol⁻¹
Le catabolisme **produit** de l’ATP, l’anabolisme le **consomme** : l’ATP fait la navette.

## Les coenzymes d’oxydoréduction
Les oxydations du métabolisme arrachent des électrons, captés par des **coenzymes** :
- NAD⁺ + 2 e⁻ + H⁺ → NADH (couple NAD⁺/NADH) ;
- FAD + 2 e⁻ + 2 H⁺ → FADH₂ (couple FAD/FADH₂).
On écrit l’équation-bilan d’une oxydoréduction en combinant deux demi-équations, électrons égalisés.

## Prévoir le sens avec E’°
Chaque couple a un **potentiel standard apparent** E’° (en V). Les électrons vont spontanément du couple au E’° le plus **bas** vers le couple au E’° le plus **haut**.
= ΔrG’° = −n × F × ΔE’° (F = 96 500 C·mol⁻¹, ΔE’° = E’° accepteur − E’° donneur)
!> Ne confonds pas ΔrG’° (conditions standard) et ΔrG (conditions réelles de la cellule) : une réaction à ΔrG’° positif peut devenir spontanée si la cellule maintient ses produits très bas.

## Exemple travaillé
Phosphorylation du glucose : glucose + Pi → glucose-6-phosphate, ΔrG’° = +13,8 kJ·mol⁻¹ (impossible seule).
Couplée à l’hydrolyse de l’ATP : +13,8 + (−30,5) = **−16,7 kJ·mol⁻¹**. La somme est négative : la réaction couplée glucose + ATP → glucose-6-phosphate + ADP est spontanée. C’est la première étape de la glycolyse.`,
          },
          questions: [
            ['Une réaction dont ΔrG’° vaut +20 kJ·mol⁻¹ est…', ['Endergonique', 'Exergonique', 'Toujours instantanée', 'Catalysée par l’ATP seul'], 0, 'Un ΔrG’° positif signe une réaction endergonique, impossible seule dans le sens écrit en conditions standard.'],
            ['Le cycle de Calvin est une voie…', ['Catabolique', 'Anabolique', 'Fermentaire', 'De dégradation des lipides'], 1, 'Il synthétise des glucides à partir de CO₂ : c’est de l’anabolisme, qui consomme de l’ATP.'],
            ['Réaction A : +13,8 kJ·mol⁻¹ ; hydrolyse de l’ATP : −30,5 kJ·mol⁻¹. ΔrG’° de la réaction couplée ?', ['+44,3 kJ·mol⁻¹', '−44,3 kJ·mol⁻¹', '−16,7 kJ·mol⁻¹', '+16,7 kJ·mol⁻¹'], 2, 'On additionne les ΔrG’° : 13,8 − 30,5 = −16,7 kJ·mol⁻¹, négatif, donc spontané.'],
            ['L’hydrolyse de l’ATP libère de l’énergie car elle rompt…', ['La liaison entre le ribose et l’adénine', 'Une liaison peptidique', 'Une liaison hydrogène de l’ADN', 'Une liaison à haut potentiel énergétique'], 3, 'Les liaisons entre phosphates de l’ATP sont dites à haut potentiel énergétique.'],
            ['Dans le couple NAD⁺/NADH, la forme réduite est…', ['NADH', 'NAD⁺', 'FAD', 'ADP'], 0, 'NADH a capté deux électrons (et un proton) : c’est la forme réduite du coenzyme.'],
            ['Les électrons passent spontanément du couple au E’° le plus…', ['Haut vers le plus bas', 'Bas vers le plus haut', 'Proche de zéro vers le plus éloigné', 'Négatif vers un autre négatif seulement'], 1, 'Le donneur a le potentiel le plus bas, l’accepteur le plus haut ; ΔE’° positif donne ΔrG’° négatif.'],
            ['Une réaction couplée est spontanée si la somme de ses ΔrG’° est négative.', ['Vrai', 'Faux'], 0, 'C’est tout l’intérêt du couplage : une étape endergonique est entraînée par une étape plus exergonique.'],
            ['Les conditions standard biologiques imposent notamment…', ['pH 0', '100 °C', 'pH 7', 'Absence d’eau'], 2, 'Le « prime » de ΔrG’° et E’° rappelle qu’on se place à pH 7.'],
            ['Quel coenzyme est réduit en FADH₂ ?', ['NAD⁺', 'NADP⁺', 'ATP', 'FAD'], 3, 'FAD capte deux électrons et deux protons : FAD + 2 e⁻ + 2 H⁺ → FADH₂.'],
            ['ΔrG’° = −n × F × ΔE’°. Si ΔE’° = +0,5 V et n = 2, ΔrG’° vaut environ…', ['−96,5 kJ·mol⁻¹', '+96,5 kJ·mol⁻¹', '−48 kJ·mol⁻¹', '−9,65 kJ·mol⁻¹'], 0, '2 × 96 500 × 0,5 = 96 500 J·mol⁻¹, soit −96,5 kJ·mol⁻¹ : réaction favorable.'],
            ['La glycogénolyse est…', ['Une synthèse de glycogène', 'Une dégradation de glycogène', 'Une fermentation', 'Une voie de la photosynthèse'], 1, 'Le suffixe « -lyse » indique une dégradation : c’est une voie catabolique.'],
            ['Une réaction à ΔrG’° positif ne peut jamais se produire dans une cellule.', ['Vrai', 'Faux'], 1, 'Elle peut avoir lieu si elle est couplée, ou si les concentrations réelles rendent ΔrG négatif.'],
          ],
        },
        {
          titre: 'Respiration et fermentation : deux façons d’oxyder le glucose',
          axe: 'S1 – Enzymes et voies métaboliques',
          lecon: {
            titre: 'Tout oxyder ou s’arrêter en route',
            cours: `Une levure privée d’air continue de vivre : elle fermente. Avec de l’air, elle respire et produit bien plus d’ATP. Tout se joue sur le sort des **coenzymes réduits**.

## La glycolyse, point de départ commun
Dans le **cytoplasme**, un glucose (6 C) est oxydé en deux pyruvates (3 C).
= Glucose + 2 ADP + 2 Pi + 2 NAD⁺ → 2 pyruvate + 2 ATP + 2 NADH + 2 H⁺
Bilan : **2 ATP** nets, formés par **phosphorylation au niveau du substrat** (un groupement phosphate passe directement d’un métabolite à l’ADP), et 2 NADH à réoxyder.

## La respiration : oxydation complète
En présence de dioxygène, chez un eucaryote :
~ Glycolyse (cytoplasme) → cycle de Krebs (matrice mitochondriale) → chaîne respiratoire (membrane interne)
- Le **cycle de Krebs** achève l’oxydation : le carbone part en CO₂, les électrons chargent NADH et FADH₂.
- La **chaîne respiratoire** est une chaîne de transporteurs d’électrons classés par E’° croissant. Les électrons de NADH et FADH₂ la descendent jusqu’à l’**accepteur final**, le dioxygène, réduit en eau.
- L’énergie libérée pompe des protons vers l’espace intermembranaire : c’est un **gradient électrochimique**.
- Les protons refluent par l’**ATP synthase**, qui fabrique l’ATP : c’est le **couplage chimio-osmotique**, et on parle de **phosphorylation oxydative**.
= C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O ; environ 30 à 32 ATP par glucose

## La fermentation : oxydation incomplète
Sans accepteur final externe, la cellule doit **réoxyder son NADH** pour que la glycolyse continue : elle réduit le pyruvate (ou un dérivé).
| Fermentation | Produit | Intérêt |
| **Lactique** | lactate (2 par glucose) | yaourts, fromages ; acidifie le milieu |
| **Alcoolique** | éthanol + CO₂ | pain, bière, vin, bioéthanol |
Le produit final garde de l’énergie : l’oxydation est **partielle**, le rendement ne dépasse pas **2 ATP** par glucose.

## Comparer les bilans
| Critère | Respiration | Fermentation |
| Accepteur final d’électrons | externe (O₂, ou nitrate chez certaines bactéries) | interne (pyruvate, acétaldéhyde) |
| Oxydation du glucose | complète (CO₂) | partielle |
| Mode de synthèse de l’ATP | substrat + oxydative | substrat seulement |
| ATP par glucose | environ 30 | 2 |
> La fermentation n’est pas une respiration ratée : c’est une voie de **régénération des coenzymes**.
!> Une respiration **anaérobie** existe : des bactéries utilisent le nitrate comme accepteur final (nitrate réductase). Anaérobie ne veut donc pas dire fermentation.

## Exemple travaillé
Un bioréacteur de levures consomme 1 mol de glucose. En aérobiose : environ 30 mol d’ATP et 6 mol de CO₂. En anaérobiose : 2 mol d’ATP, 2 mol d’éthanol et 2 mol de CO₂. Pour produire de la **biomasse**, on aère ; pour produire de l’**éthanol**, on coupe l’air.`,
          },
          questions: [
            ['Où se déroule la glycolyse ?', ['Dans la matrice mitochondriale', 'Dans le noyau', 'Dans le cytoplasme', 'Sur la membrane interne de la mitochondrie'], 2, 'La glycolyse est cytoplasmique, chez les procaryotes comme chez les eucaryotes.'],
            ['Bilan net en ATP de la glycolyse par glucose ?', ['38', '4', '30', '2'], 3, 'Deux ATP nets, formés par phosphorylation au niveau du substrat.'],
            ['L’accepteur final d’électrons de la respiration aérobie est…', ['Le dioxygène', 'Le pyruvate', 'Le NAD⁺', 'Le CO₂'], 0, 'Le dioxygène est réduit en eau au bout de la chaîne respiratoire.'],
            ['Le couplage chimio-osmotique relie…', ['La glycolyse et la fermentation', 'Le flux de protons à travers l’ATP synthase et la synthèse d’ATP', 'Le cycle de Krebs et la photosynthèse', 'La transcription et la traduction'], 1, 'Le reflux des protons à travers l’ATP synthase fournit l’énergie de synthèse de l’ATP.'],
            ['Le rôle essentiel des dernières étapes d’une fermentation est de…', ['Produire du dioxygène', 'Fabriquer 30 ATP', 'Réoxyder le NADH en NAD⁺', 'Fixer le CO₂'], 2, 'Sans NAD⁺ régénéré, la glycolyse s’arrêterait faute d’accepteur d’électrons.'],
            ['La fermentation alcoolique produit…', ['Du lactate seul', 'Du dioxygène', 'De l’eau et du CO₂', 'De l’éthanol et du CO₂'], 3, 'Le pyruvate est décarboxylé en acétaldéhyde, lui-même réduit en éthanol.'],
            ['La phosphorylation oxydative a lieu…', ['Au niveau de la membrane interne mitochondriale', 'Dans le cytoplasme', 'Dans le noyau', 'Dans le chloroplaste'], 0, 'Chaîne respiratoire et ATP synthase sont insérées dans la membrane interne.'],
            ['Une bactérie qui réduit le nitrate en absence d’O₂ fait…', ['Une fermentation', 'Une respiration anaérobie', 'Une photosynthèse', 'Une glycogénolyse'], 1, 'Elle possède un accepteur final externe (le nitrate) : c’est une respiration, sans oxygène.'],
            ['Pourquoi la fermentation rapporte-t-elle peu d’ATP ?', ['Le glucose n’y est pas oxydé du tout', 'Elle détruit l’ATP formé', 'L’oxydation est partielle : le produit final garde de l’énergie', 'Elle a lieu dans la mitochondrie'], 2, 'Lactate ou éthanol contiennent encore beaucoup d’énergie chimique.'],
            ['Dans le cycle de Krebs, le carbone du glucose est libéré sous forme de…', ['Glycogène', 'Éthanol', 'Lactate', 'CO₂'], 3, 'Les décarboxylations du cycle de Krebs rejettent le carbone en CO₂.'],
            ['Pour produire un maximum de biomasse de levures, on cultive…', ['En aérobiose', 'En anaérobiose stricte', 'Sans glucose', 'À pH 1'], 0, 'La respiration donne bien plus d’ATP, donc plus de croissance.'],
            ['Anaérobie veut toujours dire fermentation.', ['Vrai', 'Faux'], 1, 'Certaines bactéries respirent sans oxygène avec un autre accepteur final, comme le nitrate.'],
          ],
        },
        {
          titre: 'Photosynthèse, types trophiques et cycles du carbone et de l’azote',
          axe: 'S1 – Enzymes et voies métaboliques',
          lecon: {
            titre: 'Qui mange quoi, et avec quelle énergie',
            cours: `La photosynthèse ressemble à une respiration à l’envers… avec les mêmes outils : une chaîne de transporteurs et une ATP synthase.

## La photosynthèse dans le chloroplaste
Deux étapes, localisées dans le **chloroplaste** :
| Étape | Lieu | Entrées | Sorties |
| **Chaîne photosynthétique** | membrane des thylakoïdes | lumière, H₂O, NADP⁺, ADP | O₂, NADPH, ATP |
| **Cycle de Calvin** | stroma | CO₂, NADPH, ATP | glycéraldéhyde 3-phosphate (précurseur d’oses) |
- La lumière **excite** les photosystèmes : leurs électrons « montent » assez haut pour descendre ensuite une chaîne de transporteurs jusqu’au NADP⁺.
- L’eau cède ses électrons : elle est oxydée et libère le **dioxygène**.
- Comme dans la mitochondrie, un gradient de protons fait tourner une **ATP synthase**.
- Le cycle de Calvin **fixe le CO₂** grâce au NADPH et à l’ATP : c’est l’**autotrophie**.
> Respiration et photosynthèse partagent le couplage chimio-osmotique ; seule la source d’énergie change (oxydation d’une molécule ou lumière).

## Les types trophiques
On décrit un organisme par trois questions.
| Question | Préfixe | Réponses |
| Source d’énergie ? | photo- / chimio- | lumière / réactions chimiques |
| Source d’électrons ? | litho- / organo- | composé minéral / molécule organique |
| Source de carbone ? | auto- / hétéro- | CO₂ / matière organique |
Exemples : une plante est **photolithoautotrophe** ; l’être humain et *E. coli* sont **chimioorganohétérotrophes** ; les bactéries nitrifiantes sont **chimiolithoautotrophes**.
Ce type guide le **milieu de culture** : une bactérie autotrophe se cultive sans source organique de carbone.

## Les micro-organismes dans l’écosystème
- **Saprophytisme** : décomposer la matière morte.
- **Symbiose** : association à bénéfice mutuel (Rhizobium dans les nodosités des Fabacées fixe le diazote).
- Entre micro-organismes : **compétition**, **coopération**, vie en **biofilm**.

## Les cycles courts du carbone et de l’azote
~ CO₂ → photosynthèse (assimilation) → matière organique → respiration, fermentation → CO₂
~ Matière organique azotée → ammonification (minéralisation) → NH₄⁺ → nitrification → NO₂⁻ → NO₃⁻ → assimilation par les plantes
- La **nitrification** (NH₄⁺ → NO₂⁻ → NO₃⁻) est l’œuvre de bactéries chimiolithoautotrophes aérobies.
- La **dénitrification** (NO₃⁻ → N₂) est une respiration anaérobie : elle rend l’azote à l’atmosphère.
!> Minéralisation et assimilation vont en sens contraire : la première transforme l’organique en minéral, la seconde le minéral en organique.

## Exemple travaillé
Dans un aquarium neuf, on suit l’azote par bandelettes : l’ammoniaque monte d’abord (déjections), puis baisse quand les nitrites apparaissent, qui baissent à leur tour quand les nitrates s’accumulent. Ajouter des bactéries nitrifiantes raccourcit ce démarrage : c’est de la **bioremédiation** à petite échelle.`,
          },
          questions: [
            ['Où se déroule le cycle de Calvin ?', ['Dans les thylakoïdes', 'Dans le stroma du chloroplaste', 'Dans la matrice mitochondriale', 'Dans le cytoplasme'], 1, 'La fixation du CO₂ a lieu dans le stroma, grâce à l’ATP et au NADPH des thylakoïdes.'],
            ['Le dioxygène de la photosynthèse provient…', ['Du CO₂', 'Du glucose', 'De l’oxydation de l’eau', 'Du NADPH'], 2, 'L’eau cède ses électrons à la chaîne photosynthétique et libère O₂.'],
            ['Quelles molécules la chaîne photosynthétique fournit-elle au cycle de Calvin ?', ['NADH et CO₂', 'Glucose et O₂', 'Pyruvate et ATP', 'NADPH et ATP'], 3, 'Le cycle de Calvin consomme NADPH (électrons) et ATP (énergie).'],
            ['Une plante verte est…', ['Photolithoautotrophe', 'Chimioorganohétérotrophe', 'Chimiolithoautotrophe', 'Photoorganohétérotrophe'], 0, 'Énergie lumineuse, électrons de l’eau (minérale), carbone du CO₂.'],
            ['Le préfixe « organo- » renseigne sur…', ['La source d’énergie', 'La source d’électrons', 'La source de carbone', 'La température de culture'], 1, 'Organo- : les électrons viennent d’une molécule organique ; litho- : d’un composé minéral.'],
            ['La nitrification transforme…', ['NO₃⁻ en N₂', 'N₂ en NH₄⁺', 'NH₄⁺ en NO₂⁻ puis NO₃⁻', 'La matière organique en NH₄⁺'], 2, 'Deux étapes d’oxydation menées par des bactéries chimiolithoautotrophes.'],
            ['La dénitrification…', ['Enrichit le sol en nitrates', 'Fixe le CO₂', 'Est une photosynthèse', 'Rend l’azote à l’atmosphère sous forme de N₂'], 3, 'C’est une respiration anaérobie qui utilise le nitrate comme accepteur final.'],
            ['L’association Rhizobium – Fabacées est un exemple de…', ['Symbiose', 'Compétition', 'Parasitisme', 'Saprophytisme'], 0, 'La bactérie fixe le diazote pour la plante, qui lui fournit des molécules organiques.'],
            ['La minéralisation transforme de la matière organique en composés minéraux.', ['Vrai', 'Faux'], 0, 'C’est l’inverse de l’assimilation ; l’ammonification en est un exemple.'],
            ['Une bactérie autotrophe peut se cultiver sur un milieu…', ['Obligatoirement riche en glucose', 'Sans source organique de carbone', 'Sans aucune source d’énergie', 'Contenant forcément du sang'], 1, 'Elle tire son carbone du CO₂ : le milieu peut être entièrement minéral.'],
            ['Point commun entre chaîne respiratoire et chaîne photosynthétique ?', ['Elles consomment du CO₂', 'Elles ont lieu dans le noyau', 'Elles utilisent un gradient de protons et une ATP synthase', 'Elles produisent de l’éthanol'], 2, 'Le couplage chimio-osmotique est commun aux deux.'],
            ['Un ensemble de micro-organismes fixés sur une surface dans une matrice qu’ils sécrètent forme…', ['Un plasmide', 'Un auxanogramme', 'Un nodule', 'Un biofilm'], 3, 'Le biofilm protège ses habitants et favorise leur coopération.'],
          ],
        },
        {
          titre: 'Les enzymes : catalyse, cinétique et régulation',
          axe: 'S1 – Enzymes et voies métaboliques',
          lecon: {
            titre: 'Des catalyseurs sur mesure',
            cours: `Sans enzyme, la digestion d’un repas prendrait des années. Une enzyme accélère une réaction des millions de fois, à 37 °C et à pH neutre.

## Un catalyseur biologique
Une enzyme est une **protéine** (le plus souvent) qui accélère une réaction sans être consommée.
| Catalyse chimique | Catalyse enzymatique |
| conditions souvent dures (chaleur, pression) | conditions douces (37 °C, pH proche de 7) |
| peu spécifique | **spécifique** du substrat et de la réaction |
Deux spécificités : **de substrat** (l’enzyme reconnaît une molécule, ou une famille) et **de réaction** (elle catalyse un seul type de transformation).
Chaque enzyme porte un **identifiant international EC** (quatre nombres) qui renvoie au type de réaction.

## Le complexe enzyme-substrat
~ E + S → complexe ES → E + P
Le substrat se fixe dans le **site actif**, poche formée par la **structure tridimensionnelle** de la protéine. Beaucoup d’enzymes ont besoin d’un **cofacteur** : un **ion métallique** (Mg²⁺, Zn²⁺) ou un **coenzyme** (NAD⁺, souvent dérivé d’une vitamine) ; s’il reste lié à l’enzyme, on parle de **groupement prosthétique**.
Certaines enzymes sont synthétisées inactives sous forme de **proenzyme** : le pepsinogène devient pepsine dans l’estomac acide, le trypsinogène devient trypsine dans l’intestin.

## La vitesse initiale
On suit l’apparition du produit en fonction du temps. Au début, la courbe est une droite : sa pente est la **vitesse initiale** v₀. Plus tard, la vitesse diminue (substrat consommé, produit accumulé).
> On mesure toujours v₀ : c’est la seule vitesse qui dépend clairement des conditions de départ.

## L’effet de la concentration en substrat
Si on augmente la concentration en substrat [S] (enzyme en quantité fixe) :
- à faible [S], v₀ augmente presque proportionnellement ;
- à forte [S], v₀ plafonne : tous les sites actifs sont occupés, l’enzyme est **saturée** ; v₀ atteint la **vitesse maximale** Vmax.
La constante **Km** est la concentration en substrat qui donne v₀ = Vmax / 2 : plus Km est petit, plus l’enzyme a d’**affinité** pour son substrat.

## Température, pH et effecteurs
- **Température** : v₀ augmente jusqu’à une température optimale, puis la protéine se **dénature** et l’activité s’effondre.
- **pH** : chaque enzyme a un **pH optimal** (pepsine vers 2, trypsine vers 8) ; loin de lui, les charges du site actif changent.
- **Activateurs** et **inhibiteurs** modifient l’activité. Un inhibiteur **analogue structural** du substrat entre en compétition pour le site actif.
- Dans une voie métabolique, le produit final inhibe souvent une enzyme clé du début : c’est une **boucle de régulation** (rétro-inhibition).
!> Le froid ralentit une enzyme sans la détruire ; la chaleur excessive la dénature de façon souvent irréversible.

## Exemple travaillé
Pour [S] = 1 ; 2 ; 4 ; 10 ; 40 mmol·L⁻¹, on mesure v₀ = 20 ; 30 ; 40 ; 50 ; 58 µmol·min⁻¹. La courbe tend vers un plateau : Vmax ≈ 60 µmol·min⁻¹. La moitié, 30 µmol·min⁻¹, est atteinte pour [S] = 2 mmol·L⁻¹ : **Km ≈ 2 mmol·L⁻¹**. Pour mesurer Vmax en pratique, on se place en substrat **saturant** (au moins dix fois Km).`,
          },
          questions: [
            ['Une enzyme qui n’agit que sur le glucose présente une spécificité…', ['De substrat', 'De réaction', 'De température', 'De pH'], 0, 'Elle reconnaît une seule molécule : c’est la spécificité de substrat.'],
            ['Le pepsinogène est…', ['Un coenzyme', 'Une proenzyme, forme inactive de la pepsine', 'Un inhibiteur compétitif', 'Un ion métallique'], 1, 'Il est activé en pepsine dans le milieu acide de l’estomac.'],
            ['La vitesse initiale se lit…', ['Sur le plateau final de la courbe', 'À la fin de la réaction', 'Comme la pente de la partie linéaire au début', 'Sur l’axe des ordonnées à t = 0'], 2, 'Au début, la quantité de produit croît linéairement : la pente est v₀.'],
            ['Quand v₀ n’augmente plus malgré l’ajout de substrat, l’enzyme est…', ['Dénaturée', 'Transformée en proenzyme', 'Inhibée par le froid', 'Saturée'], 3, 'Tous les sites actifs sont occupés : v₀ atteint Vmax.'],
            ['Km est la concentration en substrat pour laquelle…', ['v₀ = Vmax / 2', 'v₀ = Vmax', 'v₀ = 0', 'L’enzyme est dénaturée'], 0, 'Un Km faible traduit une forte affinité de l’enzyme pour son substrat.'],
            ['Un inhibiteur analogue structural du substrat agit…', ['En dénaturant l’enzyme par la chaleur', 'En occupant le site actif à la place du substrat', 'En augmentant la température', 'En détruisant le produit'], 1, 'Sa forme proche du substrat lui permet d’entrer en compétition pour le site actif.'],
            ['Au-delà de la température optimale, l’activité chute car…', ['Le substrat s’évapore', 'Le pH devient neutre', 'L’enzyme se dénature', 'Le Km devient nul'], 2, 'La structure tridimensionnelle est perdue, donc le site actif aussi.'],
            ['Le NAD⁺ est, pour une déshydrogénase…', ['Un substrat unique', 'Un ion métallique', 'Un inhibiteur', 'Un coenzyme'], 3, 'C’est un coenzyme, dérivé de la vitamine B3, qui accepte les électrons.'],
            ['Un cofacteur resté fixé à l’enzyme de façon permanente est un…', ['Groupement prosthétique', 'Substrat', 'Produit', 'Anticorps'], 0, 'Exemple : l’hème de certaines enzymes.'],
            ['La rétro-inhibition, c’est…', ['L’activation d’une enzyme par la chaleur', 'L’inhibition d’une enzyme du début d’une voie par le produit final', 'La transformation d’une proenzyme', 'La dénaturation par un acide'], 1, 'Le produit final règle sa propre production : c’est une boucle de régulation.'],
            ['Un passage au réfrigérateur détruit définitivement une enzyme.', ['Vrai', 'Faux'], 1, 'Le froid ralentit l’activité sans dénaturer : c’est pourquoi on conserve les enzymes au froid.'],
            ['Le pH optimal de la trypsine, enzyme intestinale, est proche de…', ['2', '12', '8', '0'], 2, 'Elle agit dans l’intestin grêle, légèrement basique, contrairement à la pepsine gastrique.'],
          ],
        },
        {
          titre: 'Soi, non-soi et réponse immunitaire innée',
          axe: 'S2 – Immunité cellulaire et moléculaire',
          lecon: {
            titre: 'Reconnaître l’intrus et donner l’alerte',
            cours: `Une écharde dans le doigt : quelques heures plus tard, la zone est rouge, chaude, gonflée et douloureuse. C’est l’immunité innée au travail, la même contre toutes les bactéries.

## Le soi et le non-soi
- Le **soi** : l’ensemble des molécules propres à l’individu, que son système immunitaire tolère.
- Le **non-soi** : tout ce qui est reconnu comme étranger (bactérie, virus, greffon d’un autre individu, cellule anormale).
- Un **antigène** est une molécule reconnue par le système immunitaire.
Le **rejet de greffe** montre que les cellules d’un autre individu sont reconnues comme non-soi.

## Les barrières naturelles
Avant toute réponse, des barrières empêchent l’entrée des micro-organismes :
| Barrière | Mode d’action |
| **Épithélium** (peau, muqueuses) | obstacle physique, cellules jointives |
| **pH acide** (estomac, vagin, peau) | milieu défavorable à beaucoup de bactéries |
| **Mucus** | piège les particules, évacuées par les cils |
| **Lysozyme** (larmes, salive) | enzyme qui hydrolyse le peptidoglycane de la paroi bactérienne |
| **Microbiote** | occupe la place et les nutriments, empêche l’installation des pathogènes |
!> Quand le microbiote est déséquilibré (antibiotiques, par exemple), des micro-organismes **opportunistes** peuvent s’installer.

## La reconnaissance par les cellules sentinelles
Les **cellules sentinelles** (macrophages, cellules dendritiques, mastocytes) portent des **récepteurs membranaires** qui reconnaissent des **motifs moléculaires** partagés par de nombreux pathogènes : le **LPS** (lipopolysaccharide) des bactéries Gram négatif, le **peptidoglycane**. La reconnaissance est donc **large**, pas spécifique d’une espèce.
Elles jouent deux rôles : **phagocyter** l’intrus et **libérer des molécules pro-inflammatoires** qui donnent l’alerte.

## La réaction inflammatoire
~ Reconnaissance → molécules pro-inflammatoires → vasodilatation → exsudation du plasma → diapédèse → chimiotactisme → phagocytose
- **Vasodilatation** : rougeur et chaleur.
- **Exsudation du plasma** : gonflement (œdème) ; la pression sur les nerfs cause la douleur.
- **Diapédèse** : les phagocytes (granulocytes, monocytes) traversent la paroi des vaisseaux.
- **Chimiotactisme** : ils sont attirés vers le foyer infectieux par des signaux chimiques.

## La phagocytose
1. **Adhésion** du phagocyte à la bactérie.
2. **Endocytose** : la membrane l’entoure et forme une vésicule, le phagosome.
3. **Digestion** : fusion avec les lysosomes, dont les enzymes dégradent l’antigène.
4. **Rejet** des débris par exocytose, ou présentation de fragments aux lymphocytes.
> L’immunité innée est **immédiate**, **non spécifique** et **sans mémoire** : elle contient l’infection en attendant la réponse adaptative.

## Exemple travaillé
Après un traitement antibiotique long, une patiente présente une mycose buccale à *Candida albicans*. L’antibiotique a réduit la flore bactérienne normale ; la levure, jusque-là tenue en respect, profite de la place libre : c’est un **opportunisme** lié à un déséquilibre du microbiote.`,
          },
          questions: [
            ['Un greffon provenant d’un autre individu est reconnu comme…', ['Soi', 'Anticorps', 'Microbiote', 'Non-soi'], 3, 'Ses molécules de surface diffèrent de celles du receveur : il est rejeté sans traitement.'],
            ['Le lysozyme des larmes agit en…', ['Hydrolysant le peptidoglycane bactérien', 'Acidifiant l’œil', 'Produisant des anticorps', 'Formant du mucus'], 0, 'Il fragilise la paroi des bactéries, surtout Gram positif.'],
            ['Les cellules sentinelles reconnaissent les bactéries grâce à…', ['Des anticorps spécifiques', 'Des motifs moléculaires communs à de nombreux pathogènes', 'Leur ADN uniquement', 'Leur taille'], 1, 'LPS et peptidoglycane sont reconnus par des récepteurs membranaires de l’immunité innée.'],
            ['La diapédèse est…', ['La destruction d’une bactérie', 'La production de mucus', 'La traversée de la paroi des vaisseaux par les leucocytes', 'La libération d’anticorps'], 2, 'Les phagocytes quittent le sang pour rejoindre le foyer infectieux.'],
            ['La rougeur de l’inflammation est due à…', ['Le chimiotactisme', 'La phagocytose', 'L’exocytose', 'La vasodilatation'], 3, 'L’afflux de sang dans les vaisseaux dilatés colore et réchauffe la zone.'],
            ['Dans quel ordre se déroule la phagocytose ?', ['Adhésion, endocytose, digestion', 'Digestion, adhésion, endocytose', 'Endocytose, adhésion, digestion', 'Exocytose, adhésion, digestion'], 0, 'Le phagocyte s’attache, englobe, puis digère grâce aux lysosomes.'],
            ['Le chimiotactisme désigne…', ['La sécrétion d’anticorps', 'L’attraction des phagocytes par des signaux chimiques', 'La réplication virale', 'L’acidité gastrique'], 1, 'Les phagocytes remontent le gradient de molécules signal jusqu’au foyer.'],
            ['Un micro-organisme opportuniste…', ['Est toujours mortel', 'Ne peut pas se multiplier', 'Profite d’un affaiblissement des défenses ou d’un déséquilibre du microbiote', 'Est un anticorps'], 2, 'Il reste inoffensif tant que l’équilibre est maintenu.'],
            ['L’immunité innée garde la mémoire des infections passées.', ['Vrai', 'Faux'], 1, 'La mémoire est une propriété de l’immunité adaptative (lymphocytes mémoire).'],
            ['L’œdème inflammatoire provient de…', ['La fermentation', 'La multiplication des lymphocytes', 'La destruction des globules rouges', 'L’exsudation du plasma hors des vaisseaux'], 3, 'Le liquide qui sort des vaisseaux gonfle les tissus.'],
            ['Quelle molécule caractérise la membrane externe des bactéries Gram négatif ?', ['Le LPS', 'Le lysozyme', 'L’ATP', 'L’hémoglobine'], 0, 'Le lipopolysaccharide est un motif reconnu par les cellules sentinelles.'],
            ['Le microbiote protège l’organisme notamment en…', ['Détruisant les globules blancs', 'Occupant la place et les nutriments', 'Produisant des anticorps humains', 'Augmentant la température'], 1, 'C’est un effet de barrière : un pathogène trouve la place déjà prise.'],
          ],
        },
        {
          titre: 'Immunité adaptative : lymphocytes, anticorps et mémoire',
          axe: 'S2 – Immunité cellulaire et moléculaire',
          lecon: {
            titre: 'Une réponse taillée pour chaque antigène',
            cours: `L’immunité adaptative met quelques jours à démarrer, mais elle vise un antigène précis et s’en souvient : c’est la base de la vaccination.

## Trois familles de lymphocytes
| Lymphocyte | Récepteur | Marqueur | Devient |
| **B** | BCR (anticorps membranaire) | — | plasmocyte sécréteur d’anticorps |
| **T4** | TCR | CD4 | lymphocyte T auxiliaire (chef d’orchestre) |
| **T8** | TCR | CD8 | lymphocyte T cytotoxique (tueur) |
Chaque lymphocyte porte un seul type de récepteur : il ne reconnaît qu’un antigène.

## La présentation de l’antigène
Une **cellule présentatrice d’antigène** (CPA, surtout la cellule dendritique) phagocyte l’intrus, le découpe et expose des **peptides antigéniques** sur une glycoprotéine de surface du **complexe majeur d’histocompatibilité** (CMH).
~ Phagocytose → découpage → peptide + CMH en surface → reconnaissance par le TCR
> Un lymphocyte T ne reconnaît jamais un antigène libre : seulement un peptide présenté par le CMH.

## L’activation et la coopération cellulaire
1. Le T4 dont le TCR reconnaît le complexe se multiplie : c’est la **sélection** puis l’**activation monoclonale** (un clone).
2. Il devient **T auxiliaire** et sécrète des messagers (interleukines).
3. Ces messagers aident les **T8** activés à devenir **T cytotoxiques**, et les **B** activés à devenir **plasmocytes**.

## Les deux effecteurs
- Le **T cytotoxique** reconnaît une cellule infectée par un virus et la **lyse** avec le système **perforine-granzymes** : la perforine perce la membrane, les granzymes déclenchent la mort de la cellule.
- Le **plasmocyte**, riche en **réticulum endoplasmique granuleux** et en vésicules de sécrétion, produit des milliers d’**anticorps** par seconde.

## L’anticorps (immunoglobuline)
Une molécule en **Y** : deux chaînes lourdes, deux chaînes légères. Les extrémités des bras portent le **paratope**, qui se lie à l’**épitope** de l’antigène, par complémentarité de forme.
Rôles : **neutralisation** (un virus ou une toxine couverts d’anticorps ne peuvent plus se fixer) et **opsonisation** (la bactérie couverte d’anticorps est bien plus vite phagocytée). L’anticorps ne détruit pas lui-même : il marque.

## La mémoire immunitaire
| Réponse | Délai | Intensité | Anticorps dominants |
| **Primaire** (1er contact) | environ 1 à 2 semaines | faible | IgM puis IgG |
| **Secondaire** (contact suivant) | quelques jours | forte, durable | IgG |
Les **lymphocytes mémoire**, formés à la première rencontre, expliquent cette réponse plus rapide.
!> Au **sérodiagnostic**, des IgM spécifiques signent une infection **récente** ; des IgG seules, une infection ancienne ou une vaccination.

## Exemple travaillé
Un patient a des IgM anti-virus élevées et des IgG faibles : l’infection date de quelques jours. Un mois plus tard, les IgM ont disparu et les IgG sont hautes : la réponse est installée et la mémoire constituée.`,
          },
          questions: [
            ['Quel lymphocyte porte le marqueur CD8 ?', ['Le lymphocyte B', 'Le lymphocyte T4', 'Le lymphocyte T8', 'Le plasmocyte'], 2, 'Le T8 devient lymphocyte T cytotoxique.'],
            ['Un lymphocyte T reconnaît un antigène…', ['Libre dans le plasma', 'Grâce à des anticorps solubles', 'Uniquement s’il est lipidique', 'Présenté sous forme de peptide par le CMH'], 3, 'Le TCR reconnaît le couple peptide antigénique + CMH à la surface d’une cellule.'],
            ['Le rôle principal du lymphocyte T auxiliaire est de…', ['Stimuler par des messagers l’activation des B et des T8', 'Tuer les cellules infectées', 'Sécréter des anticorps', 'Phagocyter les bactéries'], 0, 'C’est le chef d’orchestre de la coopération cellulaire.'],
            ['Le plasmocyte est riche en réticulum endoplasmique granuleux car…', ['Il stocke du glycogène', 'Il synthétise et sécrète des protéines en grande quantité', 'Il fait la photosynthèse', 'Il se divise sans cesse'], 1, 'Les anticorps sont des protéines sécrétées, produites par le REG.'],
            ['La partie de l’anticorps qui se lie à l’antigène est…', ['L’épitope', 'Le CMH', 'Le paratope', 'Le TCR'], 2, 'Le paratope de l’anticorps se lie à l’épitope de l’antigène.'],
            ['L’opsonisation…', ['Désigne la lyse par perforine', 'Détruit directement la bactérie par l’anticorps', 'Empêche la présentation antigénique', 'Facilite la phagocytose d’une bactérie couverte d’anticorps'], 3, 'Les phagocytes ont des récepteurs pour les anticorps fixés sur l’antigène.'],
            ['Le système perforine-granzymes est utilisé par…', ['Le lymphocyte T cytotoxique', 'Le plasmocyte', 'Le mastocyte', 'Le globule rouge'], 0, 'Il permet au T cytotoxique de tuer une cellule infectée.'],
            ['Des IgM spécifiques élevées au sérodiagnostic indiquent plutôt…', ['Une infection ancienne', 'Une infection récente', 'Une vaccination d’il y a dix ans', 'Une absence de contact'], 1, 'Les IgM dominent au début de la réponse primaire.'],
            ['La réponse secondaire est plus rapide grâce…', ['À l’inflammation', 'Au lysozyme', 'Aux lymphocytes mémoire', 'Au microbiote'], 2, 'Ils sont plus nombreux et se réactivent plus vite que les lymphocytes naïfs.'],
            ['Un anticorps détruit lui-même la bactérie qu’il reconnaît.', ['Vrai', 'Faux'], 1, 'Il neutralise ou marque ; la destruction revient aux phagocytes et à d’autres effecteurs.'],
            ['L’activation monoclonale signifie que…', ['Tous les lymphocytes se multiplient', 'Les anticorps se clonent', 'L’antigène se multiplie', 'Seul le lymphocyte qui reconnaît l’antigène se multiplie en un clone'], 3, 'Sélection et expansion clonale : un clone de cellules identiques, spécifiques du même antigène.'],
            ['La neutralisation d’une toxine par un anticorps consiste à…', ['L’empêcher de se fixer sur sa cible', 'La transformer en ATP', 'La faire phagocyter par un plasmocyte', 'L’intégrer au CMH'], 0, 'L’anticorps couvre la toxine, qui ne peut plus se lier à ses récepteurs.'],
          ],
        },
        {
          titre: 'Vaccins et sérothérapie : prévenir et traiter',
          axe: 'S2 – Immunité cellulaire et moléculaire',
          lecon: {
            titre: 'Préparer la mémoire ou prêter des anticorps',
            cours: `La variole a disparu de la planète en 1980 grâce à la vaccination. Le principe : faire rencontrer l’antigène sans la maladie, pour que la mémoire soit prête.

## Ce que contient un vaccin
| Type de vaccin | Contenu | Exemple |
| **Vivant atténué** | micro-organisme vivant rendu peu pathogène | rougeole-oreillons-rubéole, BCG |
| **Inactivé** | micro-organisme entier tué | poliomyélite injectable |
| **Sous-unitaire** | une molécule du pathogène seulement | hépatite B (protéine de surface) |
| **Anatoxine** | toxine rendue inoffensive mais encore reconnue | tétanos, diphtérie |
| **ARN messager** | ARNm qui fait produire l’antigène par nos cellules | vaccins contre la covid-19 |
- L’**immunogénicité** est la capacité à déclencher une réponse immunitaire.
- L’**adjuvant** (sels d’aluminium, par exemple) renforce la réponse à un antigène peu immunogène, en stimulant l’immunité innée.
- Les **rappels** relancent une réponse secondaire et entretiennent la mémoire.

## Vaccination et sérothérapie
| Critère | Vaccination | Sérothérapie |
| Ce qu’on injecte | un antigène non pathogène | des anticorps (sérum) |
| Immunité | **active** : l’individu produit ses anticorps | **passive** : anticorps prêtés |
| Délai d’efficacité | quelques semaines | immédiat |
| Durée de protection | longue (mémoire) | courte (quelques semaines) |
| Usage | **prophylaxie** (prévenir) | urgence thérapeutique ou exposition récente |
> Vacciner, c’est prévenir en construisant une mémoire ; la sérothérapie soigne tout de suite mais ne laisse aucune mémoire.

L’expérience historique : le sérum d’un animal immunisé, injecté à un animal neuf, le protège aussitôt. La protection est **transférable** par les anticorps.

## Les immunothérapies
On utilise aussi les anticorps comme médicaments : **anticorps monoclonaux** dirigés contre une molécule de cellule cancéreuse, ou qui lèvent un frein du système immunitaire pour qu’il attaque la tumeur.

## Les enjeux de santé publique
- **Protection individuelle** : la personne vaccinée est protégée.
- **Protection collective** : quand une grande part de la population est immunisée, le pathogène circule mal, ce qui protège les personnes qui ne peuvent pas être vaccinées (nourrissons, immunodéprimés).
- Quand la couverture vaccinale baisse, la maladie **réapparaît** : c’est la **résurgence** (rougeole en Europe dans les années 2010).
- Les questions éthiques et sociétales : obligation vaccinale, information, confiance, accès aux vaccins dans le monde.
!> Un sérum ne « vaccine » pas : les anticorps injectés sont éliminés en quelques semaines et aucun lymphocyte mémoire n’est formé.

## Exemple travaillé
Une personne non vaccinée se blesse avec un outil souillé de terre. On injecte des **immunoglobulines antitétaniques** (protection immédiate contre la toxine) et, en même temps à un autre endroit, une première dose de **vaccin** (anatoxine) pour construire une protection durable.`,
          },
          questions: [
            ['Une anatoxine est…', ['Un anticorps de cheval', 'Une toxine rendue inoffensive mais encore immunogène', 'Un antibiotique', 'Un virus vivant atténué'], 1, 'Elle déclenche une réponse contre la toxine sans provoquer la maladie (tétanos, diphtérie).'],
            ['Le rôle d’un adjuvant est de…', ['Tuer le pathogène', 'Remplacer l’antigène', 'Renforcer la réponse immunitaire au vaccin', 'Conserver le vaccin au froid'], 2, 'Il stimule l’immunité innée et rend l’antigène plus immunogène.'],
            ['La sérothérapie apporte une immunité…', ['Active et durable', 'Innée et définitive', 'Active et immédiate', 'Passive et immédiate'], 3, 'On injecte des anticorps tout faits : efficaces aussitôt, éliminés en quelques semaines.'],
            ['Pourquoi fait-on des rappels de vaccin ?', ['Pour relancer une réponse secondaire et entretenir la mémoire', 'Pour détruire les lymphocytes mémoire', 'Pour remplacer l’immunité innée', 'Pour produire des IgM seulement'], 0, 'Chaque rappel déclenche une réponse secondaire plus forte et plus durable.'],
            ['Dans quelle situation la sérothérapie est-elle préférée ?', ['Prévention à long terme d’un nourrisson', 'Exposition récente nécessitant une protection immédiate', 'Voyage prévu dans un an', 'Protection collective d’une population'], 1, 'Seule la sérothérapie agit tout de suite.'],
            ['La protection collective permet de protéger…', ['Uniquement les personnes vaccinées', 'Seulement les adultes', 'Aussi les personnes qui ne peuvent pas être vaccinées', 'Personne'], 2, 'Le pathogène circule mal dans une population largement immunisée.'],
            ['Le vaccin contre la rougeole est de type…', ['Anatoxine', 'Antibiotique', 'Sérum', 'Vivant atténué'], 3, 'Il contient le virus vivant rendu peu pathogène.'],
            ['Un sérum injecté laisse une mémoire immunitaire durable.', ['Vrai', 'Faux'], 1, 'Aucun lymphocyte du receveur n’a été activé : aucune mémoire n’est formée.'],
            ['La résurgence d’une maladie est souvent liée à…', ['Une baisse de la couverture vaccinale', 'Trop de vaccins', 'La disparition du pathogène', 'Un excès d’adjuvant'], 0, 'Quand trop de personnes ne sont plus protégées, le pathogène circule de nouveau.'],
            ['Un vaccin à ARN messager apporte…', ['L’antigène lui-même, purifié', 'L’information qui fait produire l’antigène par nos cellules', 'Des anticorps', 'Un virus entier tué'], 1, 'Nos cellules traduisent l’ARNm en protéine antigénique, présentée ensuite au système immunitaire.'],
            ['L’immunogénicité d’un antigène désigne…', ['Sa toxicité', 'Sa masse', 'Sa capacité à déclencher une réponse immunitaire', 'Sa solubilité'], 2, 'Un antigène peu immunogène a besoin d’un adjuvant ou de rappels.'],
            ['Un blessé non vacciné contre le tétanos reçoit…', ['Des immunoglobulines seules', 'Un vaccin seul', 'Un antibiotique seul', 'Des immunoglobulines et une première dose de vaccin'], 3, 'Protection immédiate par les anticorps, protection durable par le vaccin.'],
          ],
        },
        {
          titre: 'Propriétés de l’ADN, réplication, cancer et cellules souches',
          axe: 'S3 – Propriétés de l’ADN et réplication',
          lecon: {
            titre: 'Une molécule qu’on chauffe, qu’on copie, qu’on dérègle',
            cours: `Tu connais la double hélice depuis la 1re. En Terminale, on s’intéresse à ce que sa structure permet de faire au laboratoire, et à ce qui se passe quand sa copie s’emballe.

## Des propriétés qui découlent de la structure
- Les groupements **phosphate** sont chargés négativement : l’ADN est un **polyanion**, soluble dans l’eau, qui migre vers l’anode en électrophorèse.
- En présence de sel et d’éthanol froid, il **précipite** : c’est le principe de l’extraction.
- Les **bases azotées** absorbent la lumière UV avec un maximum vers **260 nm** : on dose l’ADN par spectrophotométrie.

## La dénaturation et la température de fusion
Chauffer l’ADN rompt les **liaisons hydrogène** entre bases : les deux brins se séparent, c’est la **dénaturation**. Les liaisons phosphodiester, covalentes, résistent.
- L’ADN simple brin absorbe davantage à 260 nm que le double brin : c’est l’**effet hyperchrome**.
- La **température de fusion Tm** est la température à laquelle la moitié de l’ADN est dénaturée.
= Paire A=T : 2 liaisons hydrogène ; paire C≡G : 3 liaisons hydrogène
> Plus un ADN est riche en C et G, plus sa Tm est élevée.
Au refroidissement, les brins complémentaires se réassocient : c’est l’**hybridation**, qu’exploitent la PCR et les sondes.

## L’organisation dans le noyau
~ Double hélice → nucléosomes (ADN enroulé autour d’histones) → fibre de chromatine → chromosome condensé en mitose
- **Euchromatine** : peu condensée, gènes accessibles, transcrits.
- **Hétérochromatine** : très condensée, gènes réprimés.

## La réplication
Elle est **semi-conservative** : chaque molécule fille garde un brin parental et un brin neuf.
| Acteur | Rôle |
| Hélicase | ouvre la double hélice |
| Amorce (ARN) | fournit le point de départ |
| **ADN polymérase** | ajoute des **dNTP** complémentaires, toujours dans le sens **5’→3’** |
| Ligase | relie les fragments du brin discontinu |
Les deux brins étant antiparallèles, l’un est copié en continu, l’autre par fragments.

## Cycle cellulaire et cancer
Le cycle alterne interphase (G1, S où l’ADN double, G2) et mitose. Une cellule en G2 contient **deux fois plus d’ADN** qu’en G1.
Il est contrôlé : des cellules normales en culture cessent de se diviser au contact les unes des autres (**inhibition de contact**). Des mutations qui dérèglent ce contrôle mènent à une **prolifération** anarchique : c’est la **cancérogenèse**. Certains traitements (taxol, colchicine) bloquent la mitose.

## Cellules souches et différenciation
Toutes les cellules d’un individu ont le même génome, mais chacune **exprime** des gènes différents : c’est la **différenciation**.
- Une cellule souche **pluripotente** (embryonnaire, ou induite à partir d’une cellule adulte) peut donner presque tous les types cellulaires.
- En **thérapie génique**, on corrige des cellules souches d’un patient (transgenèse) puis on les réinjecte pour **reconstituer une fonction**.
!> Différenciée ne veut pas dire que des gènes ont disparu : ils sont seulement réprimés.

## Exemple travaillé
Deux ADN de même longueur : l’un à 40 % de C+G, l’autre à 60 %. Le second a la Tm la plus haute, car ses paires C≡G, à trois liaisons hydrogène, tiennent mieux la chaleur.`,
          },
          questions: [
            ['À quelle longueur d’onde l’ADN absorbe-t-il le plus ?', ['260 nm', '280 nm', '540 nm', '620 nm'], 0, 'Les bases azotées absorbent au maximum vers 260 nm ; 280 nm est plutôt le pic des protéines.'],
            ['La dénaturation de l’ADN rompt…', ['Les liaisons phosphodiester', 'Les liaisons hydrogène entre bases', 'Les liaisons peptidiques', 'Les bases elles-mêmes'], 1, 'Les deux brins se séparent, mais chaque brin reste intact.'],
            ['L’effet hyperchrome désigne…', ['La baisse d’absorbance à la dénaturation', 'La coloration de l’ADN', 'L’augmentation d’absorbance à 260 nm quand l’ADN passe en simple brin', 'La condensation en chromosome'], 2, 'Les bases exposées absorbent davantage.'],
            ['Quel ADN a la température de fusion la plus élevée ?', ['30 % de C+G', '45 % de C+G', '50 % de C+G', '65 % de C+G'], 3, 'Les paires C≡G, à trois liaisons hydrogène, stabilisent la double hélice.'],
            ['Pourquoi l’ADN migre-t-il vers l’anode en électrophorèse ?', ['Ses phosphates le chargent négativement', 'Il est chargé positivement', 'Il est neutre', 'Il est hydrophobe'], 0, 'L’ADN est un polyanion : il est attiré par le pôle positif.'],
            ['La réplication est dite semi-conservative car…', ['Seule la moitié du génome est copiée', 'Chaque molécule fille garde un brin parental', 'Un brin sur deux est détruit', 'Elle ne se produit qu’une fois sur deux'], 1, 'Chaque double hélice fille associe un brin ancien et un brin neuf.'],
            ['L’ADN polymérase allonge un brin…', ['Dans le sens 3’→5’', 'Dans les deux sens', 'Dans le sens 5’→3’', 'Sans amorce'], 2, 'Elle ajoute les nucléotides à l’extrémité 3’ du brin en cours.'],
            ['L’euchromatine correspond à de l’ADN…', ['Très condensé et silencieux', 'Dégradé', 'Mitochondrial', 'Peu condensé, dont les gènes sont accessibles'], 3, 'Les gènes de l’euchromatine peuvent être transcrits.'],
            ['Une cellule en G2 contient, par rapport à G1…', ['Deux fois plus d’ADN', 'Autant d’ADN', 'Deux fois moins d’ADN', 'Pas d’ADN'], 0, 'L’ADN a été répliqué pendant la phase S.'],
            ['La perte de l’inhibition de contact est caractéristique…', ['Des cellules souches', 'Des cellules cancéreuses', 'Des globules rouges', 'Des neurones'], 1, 'Les cellules cancéreuses continuent à proliférer en s’empilant.'],
            ['Une cellule musculaire a perdu les gènes qu’elle n’exprime pas.', ['Vrai', 'Faux'], 1, 'Elle garde tout le génome ; les gènes inutiles sont réprimés.'],
            ['Une cellule souche pluripotente peut…', ['Seulement se diviser sans se différencier', 'Donner un seul type cellulaire', 'Donner presque tous les types cellulaires', 'Produire des anticorps'], 2, 'C’est ce qui en fait un outil de la thérapie cellulaire et génique.'],
          ],
        },
        {
          titre: 'Micro-organismes : bactéries, levures, moisissures et virus',
          axe: 'S4 – Micro-organismes et domaines d’application des biotechnologies',
          lecon: {
            titre: 'Petits, nombreux et indispensables',
            cours: `Ton intestin héberge à peu près autant de bactéries que ton corps compte de cellules. La plupart sont utiles ; quelques-unes rendent malade ; d’autres travaillent pour l’industrie.

## La bactérie, un procaryote
Pas de noyau : un **chromosome bactérien** circulaire dans le cytoplasme, souvent des **plasmides** (petites molécules d’ADN portant par exemple des gènes de résistance), des ribosomes, une membrane et une **paroi**.
| Paroi | Gram positif | Gram négatif |
| Peptidoglycane | couche **épaisse** | couche **fine** |
| Membrane externe | absente | présente, avec le **LPS** |
| Couleur après Gram | violette | rose |
La paroi donne la forme (coques, bacilles) et **résiste à la lyse osmotique** ; le lysozyme, qui l’attaque, fait éclater la bactérie. Le LPS est antigénique et toxique.

## Les eucaryotes microscopiques
- **Levure** : unicellulaire, noyau, organites, paroi ; se multiplie par **bourgeonnement**.
- **Moisissure** : filaments (**hyphes**) formant un **mycélium** qui envahit le milieu ; un **appareil sporifère** (Penicillium, Aspergillus) libère des **spores** qui propagent le champignon.
- **Microalgue** : unicellulaire photosynthétique, avec **chloroplastes**, comme une cellule végétale.

## Les micro-organismes et l’être humain
| Interaction | Sens |
| **Commensalisme** | le micro-organisme profite, l’hôte n’est pas gêné |
| **Parasitisme** | le micro-organisme vit aux dépens de l’hôte ; pathogène s’il cause une maladie |
Chaque biotope (peau, bouche, intestin, vagin) a son **microbiote** ; son déséquilibre est une **dysbiose**. La **métagénomique** séquence tout l’ADN d’un échantillon : elle révèle même les espèces qu’on ne sait pas cultiver.

## Au service de l’industrie
- **Bioproduction** : biomasse (levure de boulangerie), métabolites d’intérêt (antibiotiques, enzymes, acide lactique, insuline par des bactéries modifiées).
- **Dépollution** : stations d’épuration, dégradation d’hydrocarbures.
- **Contrôle qualité** : on recherche des **flores indicatrices** (coliformes, *E. coli* pour la contamination fécale) et on compare aux **critères officiels** : le produit est conforme ou non.

## Les virus, parasites obligatoires
Un virus est un **acide nucléique** (ADN ou ARN) dans une **capside** protéique, parfois entouré d’une **enveloppe**. Il ne se multiplie qu’**à l’intérieur** d’une cellule cible.
~ Fixation (récepteur spécifique) → pénétration → réplication du génome et synthèse des protéines virales → assemblage → libération
Libération par **lyse** de la cellule ou par **bourgeonnement** (virus enveloppés). Chez les **bactériophages** : cycle **lytique** (phage virulent, la bactérie éclate) ou **lysogène** (phage tempéré, le génome viral s’intègre et attend). Les virus peuvent transférer des gènes : on s’en sert comme **vecteurs** en thérapie génique.

## Le VIH
Un **rétrovirus** à ARN qui infecte les lymphocytes **T4** (récepteur CD4). Sa transcriptase inverse copie son ARN en ADN, intégré au génome de la cellule.
- Stades : primo-infection, phase asymptomatique longue, puis **sida** quand les T4 s’effondrent (immunodéficience, maladies opportunistes).
- Les **antirétroviraux** visent ses enzymes (transcriptase inverse, intégrase, protéase) : ils contrôlent le virus sans l’éliminer.
- Prévention : préservatif, dépistage, traitement préventif, précautions face au sang (exposition professionnelle).
!> Un antibiotique est inefficace contre un virus : il vise des structures bactériennes absentes des virus.`,
          },
          questions: [
            ['Quelle structure est propre aux bactéries Gram négatif ?', ['Une épaisse couche de peptidoglycane', 'Des chloroplastes', 'Un noyau', 'Une membrane externe avec du LPS'], 3, 'La membrane externe et son LPS caractérisent les Gram négatif.'],
            ['Un plasmide est…', ['Une petite molécule d’ADN extrachromosomique', 'Un organite de levure', 'Une protéine de capside', 'Un type de spore'], 0, 'Il porte souvent des gènes de résistance et sert de vecteur de clonage.'],
            ['Les levures se multiplient le plus souvent par…', ['Méiose', 'Bourgeonnement', 'Scissiparité exclusivement', 'Libération de virions'], 1, 'Un bourgeon se forme, grossit puis se détache de la cellule mère.'],
            ['Les spores d’une moisissure servent à…', ['La photosynthèse', 'La fixation du CO₂', 'La propagation du champignon', 'La digestion'], 2, 'Libérées par l’appareil sporifère, elles colonisent de nouveaux milieux.'],
            ['La métagénomique permet…', ['De cultiver toutes les bactéries', 'De dénombrer les levures au microscope', 'De tuer les virus', 'D’identifier les espèces d’un échantillon par leur ADN, même non cultivables'], 3, 'On séquence tout l’ADN présent, sans passer par la culture.'],
            ['La présence d’E. coli dans une eau signale…', ['Une contamination fécale', 'Une eau parfaitement pure', 'Un excès de chlore', 'Une pollution par les métaux'], 0, 'E. coli est une flore indicatrice de contamination fécale.'],
            ['Un virus est un parasite obligatoire car…', ['Il se nourrit de sucre', 'Il ne peut se multiplier qu’à l’intérieur d’une cellule', 'Il possède une paroi', 'Il respire'], 1, 'Il n’a ni ribosomes ni métabolisme : il détourne ceux de la cellule.'],
            ['Dans le cycle lysogène, le génome du phage…', ['Détruit aussitôt la bactérie', 'Est dégradé', 'S’intègre au chromosome bactérien et reste latent', 'Se transforme en plasmide de résistance'], 2, 'Le phage tempéré peut rester silencieux avant de passer au cycle lytique.'],
            ['Le VIH infecte surtout…', ['Les globules rouges', 'Les cellules de la peau', 'Les plasmocytes', 'Les lymphocytes T4'], 3, 'Il se fixe au récepteur CD4 des lymphocytes T auxiliaires.'],
            ['Les antirétroviraux…', ['Bloquent des enzymes du virus et contrôlent sa multiplication', 'Éliminent définitivement le VIH', 'Sont des antibiotiques', 'Sont des vaccins'], 0, 'Ils visent la transcriptase inverse, l’intégrase ou la protéase.'],
            ['Un antibiotique guérit une grippe.', ['Vrai', 'Faux'], 1, 'La grippe est virale : l’antibiotique n’a pas de cible chez le virus.'],
            ['Une dysbiose est…', ['Une infection virale', 'Un déséquilibre du microbiote', 'Une coloration', 'Une méthode de dénombrement'], 1, 'Elle est associée à plusieurs pathologies et favorise les opportunistes.'],
          ],
        },
        {
          titre: 'Croissance microbienne et agents antimicrobiens',
          axe: 'T2 – Cultiver des micro-organismes, suivre ou limiter leur croissance',
          lecon: {
            titre: 'Faire pousser, ou empêcher de pousser',
            cours: `Une bactérie qui se divise toutes les 20 minutes donnerait plus d’un milliard de descendantes en dix heures. En pratique, la croissance suit une courbe à phases, et c’est elle qu’on pilote au laboratoire comme en usine.

## Isoler le bon micro-organisme
Dans un produit **polymicrobien** (aliment, prélèvement), on cherche une espèce d’intérêt :
1. **Enrichissement** : un milieu liquide qui favorise l’espèce recherchée.
2. **Isolement** sur un milieu **sélectif** (qui inhibe les autres) et souvent **différentiel** (colonies d’aspect caractéristique).
3. Repiquage d’une colonie isolée pour obtenir une **souche pure**.

## La courbe de croissance en milieu non renouvelé
On suit la biomasse (absorbance, ou dénombrement) dans un volume fixe de milieu, sans ajout ni retrait.
| Phase | Ce qui se passe | Vitesse de croissance |
| **Latence** | adaptation au milieu, synthèse d’enzymes | nulle |
| **Accélération** | début des divisions | croissante |
| **Exponentielle** | divisions à rythme constant | **maximale** et constante |
| **Ralentissement** | nutriments qui s’épuisent, déchets qui s’accumulent | décroissante |
| **Stationnaire** | autant de morts que de divisions | nulle |
| **Déclin** | la mort l’emporte | négative |
> On représente ln N (ou log N) en fonction du temps : la phase exponentielle devient une **droite**.

## Les paramètres de la phase exponentielle
- Le **temps de génération** G : durée d’un doublement de la population.
- Le **taux de croissance** (vitesse spécifique) µ, pente de ln N en fonction du temps.
= N = N₀ × 2ⁿ, avec n = t / G (nombre de générations)
= µ = ln 2 / G ≈ 0,69 / G
Température, pH, oxygénation et composition du milieu modifient G.

## Le bioréacteur
Une cuve où l’on **régule** température, pH, agitation et aération (O₂ dissous) pour produire biomasse ou métabolites. On y suit la croissance en continu ; en mode alimenté, on ajoute du substrat pour prolonger la phase de production.

## Limiter la croissance : les agents antimicrobiens
| Agent | Où | Exemple |
| **Antiseptique** | sur un tissu vivant (peau, plaie) | chlorhexidine, alcool à 70° |
| **Désinfectant** | sur une surface ou un objet inerte | eau de Javel |
| **Antibiotique** | dans l’organisme, contre des bactéries | amoxicilline |
Un agent est **-cide** s’il tue (bactéricide, fongicide) et **-statique** s’il bloque seulement la croissance. Chacun a son **spectre d’action**.

## L’antibiogramme
Des disques imprégnés d’antibiotique sont posés sur une gélose ensemencée en nappe ; l’antibiotique diffuse et crée une **zone d’inhibition**. On compare son diamètre à des valeurs critiques : souche **sensible**, **intermédiaire** ou **résistante**. La **CMI** (concentration minimale inhibitrice) est la plus petite concentration qui empêche toute croissance visible.
!> Une **résistance naturelle** concerne toute une espèce (la membrane externe des Gram négatif bloque la vancomycine) ; une **résistance acquise** apparaît par mutation ou par un plasmide reçu.
Les résultats n’ont de valeur que si le protocole est **standardisé** : inoculum, épaisseur de gélose, durée et température d’incubation.

## Exemple travaillé
Une population passe de 10³ à 10⁶ bactéries·mL⁻¹ en 200 min de phase exponentielle. Facteur 1 000, soit environ 2¹⁰ : 10 générations. G = 200 / 10 = **20 min** ; µ = 0,69 / 20 ≈ **0,035 min⁻¹**.`,
          },
          questions: [
            ['Pendant quelle phase la vitesse de croissance est-elle maximale et constante ?', ['Latence', 'Stationnaire', 'Exponentielle', 'Déclin'], 2, 'Les bactéries se divisent à rythme constant : ln N est une droite de pente maximale.'],
            ['La phase de latence correspond à…', ['La mort des bactéries', 'La sporulation', 'L’épuisement du milieu', 'L’adaptation au milieu, sans division'], 3, 'Les cellules synthétisent les enzymes adaptées avant de se diviser.'],
            ['En phase stationnaire…', ['Les divisions compensent les morts', 'Il n’y a plus aucune division', 'La population double sans cesse', 'Le milieu est renouvelé'], 0, 'La population ne varie plus : autant de nouvelles cellules que de cellules mortes.'],
            ['Une population passe de 10⁴ à 8 × 10⁴ en 60 min. Temps de génération ?', ['60 min', '20 min', '30 min', '8 min'], 1, 'Facteur 8 = 2³ : trois générations en 60 min, soit 20 min chacune.'],
            ['Le taux de croissance µ vaut…', ['G × ln 2', 'G / ln 2', 'ln 2 / G', '2 / G'], 2, 'µ = ln 2 / G : plus le temps de génération est court, plus µ est grand.'],
            ['Un antiseptique s’applique…', ['Dans un bioréacteur', 'Sur une paillasse', 'Uniquement par voie orale', 'Sur un tissu vivant'], 3, 'Le désinfectant, lui, s’utilise sur les surfaces inertes.'],
            ['Un agent bactériostatique…', ['Bloque la croissance sans forcément tuer', 'Tue toutes les bactéries', 'Détruit les virus', 'Stérilise le matériel'], 0, 'Si on le retire, les bactéries peuvent reprendre leur croissance.'],
            ['Sur un antibiogramme, une grande zone d’inhibition indique plutôt une souche…', ['Résistante', 'Sensible', 'Contaminée', 'Morte avant l’essai'], 1, 'L’antibiotique a empêché la croissance loin autour du disque.'],
            ['La CMI est…', ['La concentration maximale tolérée', 'Le diamètre du disque', 'La plus petite concentration qui empêche toute croissance visible', 'Le temps de génération'], 2, 'Plus la CMI est faible, plus l’antibiotique est actif sur la souche.'],
            ['Un milieu sélectif sert à…', ['Faire pousser toutes les espèces', 'Stériliser le produit', 'Dénombrer les virus', 'Inhiber la croissance des espèces non recherchées'], 3, 'Il favorise l’isolement de l’espèce d’intérêt.'],
            ['Une résistance portée par un plasmide reçu d’une autre bactérie est une résistance naturelle.', ['Vrai', 'Faux'], 1, 'C’est une résistance acquise ; la résistance naturelle concerne toute l’espèce.'],
            ['Dans un bioréacteur, on régule notamment…', ['La température, le pH et l’oxygène dissous', 'Seulement la couleur', 'La pression atmosphérique extérieure', 'Le nombre de spores à la main'], 0, 'Ces paramètres conditionnent la croissance et la production.'],
          ],
        },
        {
          titre: 'Identifier une souche : morphologie, métabolisme et galeries',
          axe: 'T3 – Caractériser pour identifier des micro-organismes',
          lecon: {
            titre: 'Mener l’enquête, caractère après caractère',
            cours: `Identifier une bactérie, c’est comme identifier un suspect : on commence par l’allure générale, puis on accumule des indices jusqu’à ce qu’un seul nom reste possible.

## Toujours partir d’une souche pure
Une identification n’a de sens que sur une **souche pure** : une seule espèce, issue d’une colonie isolée. On vérifie la pureté (aspect homogène des colonies, un seul type de cellules au microscope) avant tout test.

## Les caractères morphologiques
- **Aspect des colonies** : taille, forme, bord, couleur, surface.
- **État frais** : forme (coque, bacille), groupement, **mobilité**.
- **Coloration de Gram** : Gram positif ou négatif.
Ces premiers résultats orientent vers une **famille** et le choix des tests suivants.

## Les caractères métaboliques
| Test | Ce qu’il révèle |
| **Type respiratoire** (gélose profonde) | aérobie strict, anaérobie strict, aéro-anaérobie facultatif, microaérophile |
| **Catalase** (eau oxygénée : bulles) | enzyme qui détruit H₂O₂, présente chez la plupart des aérobies |
| **Oxydase** | présence d’un cytochrome de la chaîne respiratoire |
| **Voie d’attaque du glucose** (milieu à indicateur coloré) | oxydative ou fermentative |
| **Nitrate réductase** | respiration anaérobie sur nitrate |
| **Exo-enzymes** (gélose à l’amidon, à la caséine) | enzymes sécrétées qui hydrolysent des macromolécules |
| **Auxanogramme** | quelles sources de carbone permettent la croissance sur milieu synthétique |
Un **indicateur de pH** vire quand la dégradation des glucides produit des **métabolites acides**, ou quand celle des peptones alcalinise le milieu.
> Une exo-enzyme se voit autour de la colonie : un halo clair sur gélose à l’amidon révélée au lugol signe une **amylase** sécrétée.

## Deux démarches d’identification
| Méthode | Principe | Usage |
| **Dichotomique** | une clé : chaque test partage les possibilités en deux | orienter vers la famille, le genre |
| **Probabiliste** | une **galerie** de tests miniaturisés ; le profil obtenu est comparé à une base de données | nommer l’espèce avec un pourcentage de certitude |
Une micro-galerie donne un **profil numérique** : chaque groupe de trois tests est codé par une somme (1, 2, 4), et le code est lu dans un logiciel ou un catalogue.
!> Un test sans **témoin** ne prouve rien : on vérifie la réactivité des réactifs sur une souche connue positive et une souche connue négative.

## Exemple travaillé
Bacilles Gram négatif, mobiles, oxydase négative, catalase positive, glucose fermenté avec gaz, nitrate réduit : on s’oriente vers les **entérobactéries**. La galerie donne le profil 5 144 572, lu comme *Escherichia coli* avec une très bonne identification.`,
          },
          questions: [
            ['Avant toute identification, il faut s’assurer…', ['Que le milieu est sélectif', 'Que la souche est pure', 'Que la bactérie est morte', 'Que la galerie est périmée'], 1, 'Un mélange donnerait un profil incohérent.'],
            ['La mobilité s’observe…', ['Après coloration de Gram', 'Sur un auxanogramme', 'À l’état frais', 'Par le test catalase'], 2, 'Seules des cellules vivantes, non fixées, peuvent montrer leur mobilité.'],
            ['Une bactérie qui ne pousse qu’en surface d’une gélose profonde est…', ['Anaérobie stricte', 'Microaérophile', 'Aéro-anaérobie facultative', 'Aérobie stricte'], 3, 'Elle a besoin de dioxygène, disponible seulement en haut du tube.'],
            ['Des bulles au contact de l’eau oxygénée révèlent…', ['Une catalase', 'Une oxydase', 'Une amylase', 'Une nitrate réductase'], 0, 'La catalase décompose H₂O₂ en eau et dioxygène.'],
            ['Un halo clair autour des colonies sur gélose à l’amidon révélée au lugol indique…', ['Une résistance aux antibiotiques', 'Une amylase sécrétée', 'Une fermentation lactique', 'Une contamination'], 1, 'L’amidon hydrolysé ne se colore plus en bleu-noir avec le lugol.'],
            ['L’auxanogramme étudie…', ['La mobilité', 'La forme des colonies', 'L’utilisation de différentes sources de carbone', 'La réaction de Gram'], 2, 'On observe la croissance sur milieu synthétique avec une seule source de carbone.'],
            ['La méthode probabiliste s’appuie sur…', ['Une clé à deux branches', 'Un seul test', 'L’observation seule au microscope', 'La comparaison d’un profil de galerie à une base de données'], 3, 'Elle donne une identification avec un pourcentage de probabilité.'],
            ['Dans une galerie miniaturisée, chaque groupe de trois tests positifs est codé par…', ['1, 2 et 4', '1, 1 et 1', '2, 4 et 8', '10, 20 et 30'], 0, 'La somme des valeurs des tests positifs forme un chiffre du profil.'],
            ['Le virage d’un indicateur de pH vers l’acide après culture sur glucose indique…', ['Une alcalinisation', 'Une production de métabolites acides', 'L’absence de croissance', 'Une mobilité'], 1, 'La dégradation du glucose produit des acides.'],
            ['Un test d’identification se lit sans témoin.', ['Vrai', 'Faux'], 1, 'Les témoins positif et négatif valident les réactifs et la lecture.'],
            ['La méthode dichotomique sert surtout à…', ['Nommer l’espèce avec certitude', 'Dénombrer les bactéries', 'Orienter vers la famille ou le genre', 'Stériliser'], 2, 'Chaque question élimine des possibilités ; la galerie précise ensuite l’espèce.'],
            ['Le test oxydase recherche…', ['Un plasmide', 'Une enzyme de fermentation', 'Une exo-enzyme', 'Un cytochrome de la chaîne respiratoire'], 3, 'Oxydase positive : la bactérie possède la cytochrome c oxydase.'],
          ],
        },
        {
          titre: 'Immunotechniques : agglutination, précipitation et ELISA',
          axe: 'T6 – Détecter et caractériser les biomolécules',
          lecon: {
            titre: 'L’anticorps comme outil de détection',
            cours: `Un test de grossesse, un autotest, un groupage sanguin : dans chacun, un anticorps reconnaît sa cible avec une précision extrême. Au laboratoire, on se sert de cette spécificité pour **détecter** et même **doser**.

## Identifier les acteurs
Dans toute procédure, repère :
- l’**antigène** (ce qu’on cherche, ou ce qu’on utilise pour capter l’anticorps) ;
- l’**anticorps** (spécifique) ;
- le **système de révélation** (agglutinats visibles, arc de précipitation, couleur).
> Une réaction antigène-anticorps est **spécifique** : un anticorps ne se fixe que sur son épitope.

## L’agglutination
L’antigène est **particulaire** (bactérie, globule rouge, bille de latex). Les anticorps, à deux bras, relient plusieurs particules : des **agglutinats** visibles à l’œil nu apparaissent.
- **Groupage sanguin** : des globules rouges du groupe A s’agglutinent au contact d’anticorps anti-A.
- **Sérogroupage** bactérien : une souche de salmonelle agglutine avec le sérum qui reconnaît ses antigènes de surface.

## La précipitation et l’immunodiffusion
L’antigène est **soluble**. Antigène et anticorps diffusent dans un gel ; là où ils se rencontrent en **proportions équivalentes**, ils forment un réseau insoluble : un **arc de précipitation**.
- **Double diffusion d’Ouchterlony** : antigènes et sérum dans des puits face à face ; l’allure des arcs (fusion, croisement) compare les antigènes.
- **Immunodiffusion radiale** : l’anticorps est dans le gel, l’antigène diffuse depuis un puits ; le **diamètre de l’anneau** dépend de la concentration en antigène. Avec une **courbe d’étalonnage**, on **dose**.
!> Trop d’antigène ou trop d’anticorps empêche le réseau de se former : le précipité n’apparaît qu’à la **zone d’équivalence**.

## L’ELISA
Une technique **immuno-enzymatique** en microplaque. Exemple, ELISA « sandwich » pour détecter un antigène :
1. Un anticorps de capture est fixé au fond du puits.
2. On ajoute l’échantillon : l’antigène se fixe. **Lavage.**
3. On ajoute un **conjugué** : un second anticorps couplé à une **enzyme**. **Lavage.**
4. On ajoute un **substrat chromogène** : l’enzyme le transforme en produit coloré.
La couleur n’apparaît que si l’antigène est présent ; son intensité, mesurée au spectrophotomètre, permet de doser.
Pour chercher des **anticorps** du patient (sérodiagnostic), on fixe l’antigène au fond, puis on révèle avec un conjugué **anti-immunoglobuline humaine**.
~ Anticorps de capture → antigène → anticorps conjugué → substrat → couleur

## Les témoins et les points critiques
| Témoin | Il vérifie que… |
| **Positif** (d’efficacité) | les réactifs fonctionnent : il doit réagir |
| **Négatif** | il n’y a pas de réaction parasite : il ne doit pas réagir |
| **De spécificité** | la réaction est due à l’antigène recherché et non à un autre |
Points critiques : les **lavages** (sinon le conjugué resté libre colore tout), les concentrations, le temps et la température d’incubation.

## Exemple travaillé
En ELISA, les puits d’un patient sont jaunes, le témoin négatif incolore, le témoin positif jaune. Les témoins sont validés : le patient possède l’antigène recherché. Si le témoin négatif était jaune aussi, le test serait **invalide** (lavages insuffisants, par exemple).`,
          },
          questions: [
            ['L’agglutination suppose un antigène…', ['Particulaire', 'Soluble', 'Lipidique uniquement', 'Absent'], 0, 'Les anticorps relient des particules (cellules, billes) en agglutinats visibles.'],
            ['Des globules rouges qui s’agglutinent avec un sérum anti-B appartiennent au groupe…', ['A', 'B ou AB', 'O', 'On ne peut rien dire'], 1, 'Ils portent l’antigène B : groupe B ou AB, selon le résultat avec l’anti-A.'],
            ['L’arc de précipitation se forme…', ['Là où l’antigène est en grand excès', 'Au fond du puits d’ELISA', 'À la zone d’équivalence entre antigène et anticorps', 'Seulement sans anticorps'], 2, 'Le réseau insoluble exige des proportions équilibrées.'],
            ['En immunodiffusion radiale, le diamètre de l’anneau permet de…', ['Identifier un groupe sanguin', 'Compter les bactéries', 'Mesurer le pH', 'Doser l’antigène grâce à une courbe d’étalonnage'], 3, 'Plus l’antigène est concentré, plus l’anneau est grand.'],
            ['Dans un ELISA, le conjugué est…', ['Un anticorps couplé à une enzyme', 'L’antigène fixé au puits', 'Le substrat coloré', 'Le tampon de lavage'], 0, 'L’enzyme du conjugué transforme le substrat chromogène en produit coloré.'],
            ['Pourquoi les lavages sont-ils des points critiques de l’ELISA ?', ['Ils colorent le puits', 'Ils éliminent les molécules non fixées, qui donneraient un faux positif', 'Ils ajoutent l’antigène', 'Ils stérilisent la plaque'], 1, 'Un conjugué resté libre colore même en l’absence d’antigène.'],
            ['Le témoin positif sert à vérifier que…', ['Le patient est malade', 'Il n’y a pas de réaction parasite', 'Les réactifs fonctionnent', 'La plaque est propre'], 2, 'S’il ne réagit pas, le test n’est pas interprétable.'],
            ['Pour rechercher les anticorps d’un patient par ELISA, on révèle avec…', ['Un antibiotique', 'Du lugol', 'De l’eau oxygénée seule', 'Un anticorps anti-immunoglobuline humaine conjugué'], 3, 'Le conjugué reconnaît les anticorps humains fixés sur l’antigène.'],
            ['La double diffusion d’Ouchterlony permet de…', ['Comparer des antigènes selon l’allure des arcs', 'Dénombrer des levures', 'Doser le glucose', 'Amplifier de l’ADN'], 0, 'Fusion ou croisement des arcs indiquent des antigènes identiques ou différents.'],
            ['Si le témoin négatif d’un ELISA est coloré, le résultat des patients reste valable.', ['Vrai', 'Faux'], 1, 'Une réaction parasite rend le test invalide : il faut le refaire.'],
            ['Le substrat chromogène d’un ELISA…', ['Fixe l’antigène', 'Est transformé en produit coloré par l’enzyme du conjugué', 'Est un anticorps', 'Lave la plaque'], 1, 'L’apparition de couleur révèle la présence du complexe.'],
            ['Un sérogroupage de salmonelles repose sur…', ['Une précipitation en gel', 'Une PCR', 'Une agglutination par des sérums spécifiques', 'Un antibiogramme'], 2, 'Les bactéries agglutinent avec le sérum qui reconnaît leurs antigènes de surface.'],
          ],
        },
        {
          titre: 'Dosages enzymatiques : point final et activité enzymatique',
          axe: 'T8 – Déterminer la concentration d’une biomolécule dans un produit biologique',
          lecon: {
            titre: 'L’enzyme, réactif ou cible du dosage',
            cours: `Au laboratoire d’analyses, la glycémie se dose avec des enzymes, et l’activité d’enzymes du sang signale une maladie du foie. Deux dosages, deux logiques : l’enzyme est tantôt un **outil**, tantôt la **cible**.

## Doser un substrat en point final
On veut la concentration d’un **substrat** (glucose, par exemple). On ajoute les enzymes **en excès** : tout le substrat est transformé, la réaction va à son terme, le **point final**. On mesure alors un produit coloré.
Souvent, plusieurs réactions sont **couplées** :
| Réaction | Rôle |
| **Principale** | transforme le substrat à doser |
| **Auxiliaire** | transforme un produit intermédiaire |
| **Indicatrice** | produit la molécule mesurée (un **chromophore**, issu d’un **chromogène**) |
Exemple : la méthode **GOD-POD**.
~ Glucose + O₂ → (glucose oxydase, GOD) → acide gluconique + H₂O₂
~ 2 H₂O₂ + chromogène → (peroxydase, POD) → chromophore rose + 4 H₂O
Le substrat à doser est la **molécule limitante** ; les enzymes et les autres réactifs sont **en excès**.
> On établit la **stœchiométrie** entre le substrat et la molécule indicatrice : ici, 1 glucose donne 1 H₂O₂ ; il faut 2 H₂O₂ pour 1 chromophore, donc 2 glucoses pour 1 chromophore.

## Étalon unique ou gamme
Le chromophore obéit à la **loi de Beer-Lambert** (A = ε × ℓ × c).
- **Gamme d’étalonnage** : plusieurs étalons, une droite A = f(c), sur laquelle on lit la concentration de l’essai.
- **Étalon unique** : si la linéarité est connue, c(essai) = c(étalon) × A(essai) / A(étalon).
On établit d’abord le **tableau de manipulation** (volumes de chaque tube, blanc, étalons, essais) à partir du mode opératoire.

## Doser une activité enzymatique
Ici on veut la quantité d’**enzyme active** dans un échantillon (sérum, lait). Le **substrat** est cette fois **en excès** (saturant), l’enzyme est limitante.
- **Activité enzymatique** z : quantité de substrat transformée par unité de temps, en **katal** (mol·s⁻¹) ou en **U** (µmol·min⁻¹).
- **Concentration d’activité** b : activité par unité de volume d’échantillon (U·L⁻¹ ou kat·L⁻¹).
= 1 U = 1 µmol·min⁻¹ ≈ 16,67 nkat

## Mesurer la vitesse initiale
On suit l’absorbance en fonction du temps :
- **Cinétique en continu** : on mesure A à intervalles réguliers ; on garde la **période initiale**, où la courbe est linéaire ; sa pente ΔA/Δt donne la vitesse.
- **Méthode deux points** : on mesure A à deux instants seulement, en s’assurant qu’ils sont dans la période initiale.
La température (**thermostatisation**) et le pH (**tampon**) sont fixés au plus près de l’optimum, car l’activité en dépend.
!> Hors de la période initiale, la vitesse chute et l’activité est **sous-estimée**.

## Exemple travaillé
Phosphatase alcaline du lait : ΔA/Δt = 0,050 min⁻¹ à 405 nm, ε = 18 500 L·mol⁻¹·cm⁻¹, ℓ = 1 cm, volume réactionnel 3,0 mL, prise d’essai 0,10 mL.
- Vitesse : 0,050 / 18 500 = 2,7 × 10⁻⁶ mol·L⁻¹·min⁻¹, soit 2,7 µmol·L⁻¹·min⁻¹ dans la cuve.
- Dans 3,0 mL : 8,1 × 10⁻³ µmol·min⁻¹, apportés par 0,10 mL de lait.
- b = 8,1 × 10⁻³ / 0,10 × 10⁻³ ≈ **81 U·L⁻¹**.`,
          },
          questions: [
            ['Dans un dosage de substrat en point final, les enzymes sont…', ['Limitantes', 'Dénaturées', 'Absentes', 'En excès'], 3, 'Tout le substrat doit être transformé : c’est lui la molécule limitante.'],
            ['Dans la méthode GOD-POD, la réaction indicatrice est catalysée par…', ['La peroxydase', 'La glucose oxydase', 'La catalase', 'L’amylase'], 0, 'La peroxydase utilise H₂O₂ pour former le chromophore coloré.'],
            ['Un chromogène est…', ['Le produit coloré mesuré', 'Le réactif incolore transformé en produit coloré', 'Une enzyme', 'Un anticorps'], 1, 'Le chromogène devient chromophore au cours de la réaction indicatrice.'],
            ['Pour doser une activité enzymatique, le substrat doit être…', ['Limitant', 'Absent', 'En excès (saturant)', 'Dénaturé'], 2, 'C’est l’enzyme qu’on mesure : elle seule doit limiter la vitesse.'],
            ['1 U correspond à…', ['1 mol·s⁻¹', '1 g·L⁻¹', '1 mmol·h⁻¹', '1 µmol·min⁻¹'], 3, 'Le katal (mol·s⁻¹) est l’unité du Système international ; 1 U ≈ 16,67 nkat.'],
            ['La concentration d’activité s’exprime en…', ['U·L⁻¹', 'mol', 'nm', 'min'], 0, 'C’est une activité rapportée au volume d’échantillon.'],
            ['La méthode « deux points » n’est valable que si…', ['La réaction est terminée', 'Les deux mesures sont dans la période initiale', 'Le substrat est limitant', 'On travaille à 100 °C'], 1, 'Sinon la vitesse moyenne calculée sous-estime la vitesse initiale.'],
            ['Étalon à 5,0 mmol·L⁻¹ : A = 0,400. Essai : A = 0,320. Concentration de l’essai ?', ['3,2 mmol·L⁻¹', '6,25 mmol·L⁻¹', '4,0 mmol·L⁻¹', '0,8 mmol·L⁻¹'], 2, 'c = 5,0 × 0,320 / 0,400 = 4,0 mmol·L⁻¹.'],
            ['Pourquoi thermostate-t-on une mesure d’activité enzymatique ?', ['Pour précipiter l’enzyme', 'Pour stériliser l’échantillon', 'Pour colorer le milieu', 'Parce que l’activité dépend de la température'], 3, 'Un écart de quelques degrés modifie nettement la vitesse.'],
            ['Si on mesure la pente après la période initiale, l’activité est surestimée.', ['Vrai', 'Faux'], 1, 'La vitesse diminue avec le temps : l’activité serait sous-estimée.'],
            ['Dans une méthode à réactions couplées, la réaction principale…', ['Transforme le substrat à doser', 'Produit directement le chromophore', 'Sert de témoin', 'Dilue l’échantillon'], 0, 'Les réactions auxiliaire et indicatrice suivent pour aboutir à la molécule mesurée.'],
            ['Un blanc réactif sert à…', ['Augmenter la couleur', 'Régler le zéro d’absorbance sans substrat à doser', 'Remplacer l’étalon', 'Détruire les enzymes'], 1, 'Il corrige l’absorbance propre des réactifs.'],
          ],
        },
        {
          titre: 'Extraire, séparer et purifier les biomolécules',
          axe: 'T7 – Extraire, séparer, purifier les composants d’un mélange',
          lecon: {
            titre: 'Du broyat à la protéine pure',
            cours: `Pour étudier une enzyme, il faut d’abord la sortir de la cellule, puis l’isoler de milliers d’autres protéines. Chaque étape exploite une propriété : la taille, la charge, la masse, l’affinité.

## Fractionner un mélange hétérogène
- **Broyage** : casse les tissus et les cellules (foie de bœuf, radis, culot bactérien).
- **Filtration** : un filtre de **porosité** choisie retient les particules plus grosses que ses pores (**rétentat**) et laisse passer le reste (**filtrat**).
- **Centrifugation** : la rotation accélère la **sédimentation** ; les éléments denses forment le **culot**, le liquide au-dessus est le **surnageant**.
> Toujours se demander : dans quelle fraction se trouve ce que je cherche ? On ne jette rien avant d’avoir vérifié.

## L’électrophorèse
Des molécules **chargées** migrent dans un **champ électrique**, à travers un support (papier, gel d’agarose, gel de polyacrylamide) imprégné d’un **tampon**.
- Une molécule chargée **négativement** migre vers l’**anode** (+) ; positivement, vers la **cathode** (−).
- La charge d’une protéine ou d’un acide aminé dépend du **pH du tampon** : au-dessus de son pHi elle est négative, en dessous positive, à son pHi elle ne migre pas.
- En gel, pour l’ADN, les fragments migrent tous vers l’anode et se séparent selon leur **taille** : les petits vont plus loin.
- On compare les distances de migration à un **marqueur de taille** (ADN) ou de **masse moléculaire** (protéines), après **révélation** (colorant, agent intercalant).

## Les chromatographies
Une **phase mobile** entraîne les molécules à travers une **phase fixe** ; chacune avance à sa vitesse.
| Chromatographie | Critère de séparation | Sortent en premier |
| **Exclusion** (gel filtration) | taille | les **grosses** molécules, qui n’entrent pas dans les pores |
| **Échange d’ions** | charge | les molécules de même charge que la résine ou neutres |
| **Affinité** | liaison spécifique à un ligand fixé | tout sauf la molécule cible, qu’on décroche ensuite |
Une chromatographie est **analytique** (identifier, contrôler) ou **préparative** (récupérer la molécule en quantité).
!> En exclusion, c’est l’inverse de l’électrophorèse d’ADN : les grosses molécules sortent **avant** les petites.

## Suivre une purification d’enzyme
À chaque étape, on mesure le volume, la concentration en protéines et l’activité, puis on remplit un tableau :
= Activité spécifique = activité totale / masse de protéines totales
= Rendement = activité totale à l’étape / activité totale de départ × 100
= Enrichissement (facteur de purification) = activité spécifique à l’étape / activité spécifique de départ
Une bonne étape **augmente l’activité spécifique** (on retire des protéines inutiles) en **perdant le moins d’activité** possible.

## Exemple travaillé
Extrait brut : 200 U et 400 mg de protéines, soit 0,5 U·mg⁻¹. Après chromatographie : 120 U et 20 mg, soit 6 U·mg⁻¹. Rendement = 120 / 200 = **60 %** ; enrichissement = 6 / 0,5 = **12**. On a perdu 40 % de l’enzyme, mais elle est 12 fois plus pure.`,
          },
          questions: [
            ['Après centrifugation, les éléments les plus denses se trouvent dans…', ['Le surnageant', 'Le filtrat', 'Le culot', 'Le tampon'], 2, 'Ils sédimentent au fond du tube.'],
            ['Ce qui est retenu par un filtre s’appelle…', ['Le filtrat', 'L’éluat', 'Le surnageant', 'Le rétentat'], 3, 'Le filtrat est ce qui traverse le filtre.'],
            ['Dans un tampon de pH supérieur à son pHi, une protéine migre…', ['Vers l’anode', 'Vers la cathode', 'Ne migre pas', 'Dans les deux sens'], 0, 'Au-dessus de son pHi, elle porte une charge globale négative.'],
            ['En électrophorèse sur gel d’agarose, les fragments d’ADN se séparent selon…', ['Leur charge seule', 'Leur taille', 'Leur couleur', 'Leur température de fusion'], 1, 'Tous chargés négativement, ils sont freinés par le gel selon leur taille : les petits vont plus loin.'],
            ['En chromatographie d’exclusion, sortent en premier…', ['Les petites molécules', 'Les molécules chargées positivement', 'Les grosses molécules', 'Les molécules liées au ligand'], 2, 'Trop grosses pour entrer dans les pores des billes, elles prennent le chemin le plus court.'],
            ['La chromatographie d’affinité exploite…', ['La taille', 'La densité', 'La couleur', 'Une liaison spécifique à un ligand fixé'], 3, 'Seule la molécule qui reconnaît le ligand est retenue.'],
            ['L’activité spécifique se calcule par…', ['Activité totale / masse de protéines', 'Masse de protéines / volume', 'Activité / temps', 'Volume / activité'], 0, 'Elle mesure la pureté de l’enzyme dans la fraction.'],
            ['Départ : 100 U ; après une étape : 70 U. Rendement ?', ['30 %', '70 %', '143 %', '7 %'], 1, '70 / 100 × 100 = 70 % de l’activité est conservée.'],
            ['Activité spécifique passant de 2 à 30 U·mg⁻¹. Facteur d’enrichissement ?', ['60', '28', '15', '1,5'], 2, '30 / 2 = 15 : l’enzyme est 15 fois plus pure.'],
            ['Une chromatographie préparative sert à…', ['Mesurer un pH', 'Uniquement identifier une molécule', 'Colorer un gel', 'Récupérer une molécule en quantité'], 3, 'L’analytique identifie ou contrôle ; la préparative produit.'],
            ['Une étape de purification réussie diminue toujours l’activité spécifique.', ['Vrai', 'Faux'], 1, 'Elle l’augmente, en éliminant des protéines sans activité.'],
            ['Le marqueur de taille d’une électrophorèse d’ADN sert à…', ['Estimer la taille des fragments par comparaison', 'Colorer le gel', 'Tamponner le pH', 'Couper l’ADN'], 0, 'On compare les distances de migration à celles de fragments de taille connue.'],
          ],
        },
        {
          titre: 'Technologies de l’ADN : extraction, PCR, restriction et clonage',
          axe: 'T9 – Utiliser les technologies de l’ADN',
          lecon: {
            titre: 'Copier, couper, coller le vivant',
            cours: `Une trace de salive suffit à établir une empreinte génétique : la PCR copie un fragment d’ADN des milliards de fois. Couper et coller l’ADN permet ensuite de faire fabriquer l’insuline par des bactéries.

## Préparer une solution d’ADN
1. **Lyse cellulaire** : un détergent détruit les membranes.
2. **Déprotéinisation** : une protéase (et/ou du sel) élimine les protéines, dont les **nucléases** qui dégraderaient l’ADN.
3. **Précipitation** à l’éthanol froid : l’ADN, insoluble dans l’alcool, forme une pelote qu’on récupère.
4. **Contrôle** au spectrophotomètre.
= Concentration : 1 unité d’absorbance à 260 nm ≈ 50 µg·mL⁻¹ d’ADN double brin
= Pureté : A260 / A280 ≈ 1,8 pour un ADN pur ; nettement moins, il reste des protéines
On travaille avec des gants et du matériel stérile : nos propres nucléases et notre ADN contamineraient l’échantillon.

## La PCR (réaction de polymérisation en chaîne)
On mélange l’ADN matrice, deux **amorces** qui encadrent la séquence cible, des **dNTP**, une **ADN polymérase thermostable** (Taq) et un tampon avec Mg²⁺. Un cycle comporte trois étapes :
| Étape | Température | Ce qui se passe |
| **Dénaturation** | environ 95 °C | les brins se séparent |
| **Hybridation** des amorces | environ 50 à 65 °C | les amorces se fixent par complémentarité |
| **Élongation** | 72 °C | la polymérase synthétise le brin complémentaire |
= Après n cycles, jusqu’à 2ⁿ copies par molécule matrice (30 cycles : environ un milliard)
Le produit, l’**amplicon**, se vérifie par **électrophorèse** : une bande à la taille attendue, et des **témoins** (négatif sans ADN pour détecter une contamination, positif pour valider le mélange).
> Les amorces font la **spécificité** de la PCR : elles décident quelle région est copiée.

## Les enzymes de restriction
Des **endonucléases** bactériennes coupent l’ADN au niveau d’un **site de restriction**, une courte séquence **palindromique** (EcoRI coupe G↓AATTC).
- Coupure décalée : **bouts collants**, qui se réassocient facilement avec un fragment coupé par la même enzyme.
- Coupure droite : **bouts francs**.
Nombre de fragments : sur un ADN **linéaire**, n sites donnent n + 1 fragments ; sur un ADN **circulaire** (plasmide), n fragments.

## Le clonage d’un gène
~ Digestion du vecteur et du gène → ligation → transformation de bactéries compétentes → sélection des clones
- Le **vecteur** (un plasmide) porte une **origine de réplication**, un **site de clonage**, un **promoteur** pour exprimer le gène, un **marqueur de sélection** (gène de résistance à un antibiotique) et parfois un **gène rapporteur**.
- La **ligase** soude le gène dans le plasmide.
- Les bactéries **compétentes** absorbent le plasmide : c’est la **transformation**.
- Sur un milieu avec l’antibiotique, seules les bactéries transformées poussent.
!> Une bactérie qui pousse sur l’antibiotique a reçu un plasmide, mais pas forcément le plasmide recombinant : le gène rapporteur ou une PCR sur colonie le vérifie.

## Les enjeux pour la société
Médicaments recombinants, diagnostic, OGM, thérapie génique : ces techniques posent des questions de **bioéthique** (données génétiques personnelles, consentement, modification du génome humain), encadrées en France par les lois de bioéthique.`,
          },
          questions: [
            ['Pendant l’extraction, la déprotéinisation sert notamment à…', ['Couper l’ADN', 'Éliminer les nucléases qui dégraderaient l’ADN', 'Colorer l’ADN', 'Amplifier l’ADN'], 1, 'Protéases et sel éliminent les protéines, dont les nucléases.'],
            ['Un rapport A260/A280 de 1,4 indique…', ['Un ADN très pur', 'Un ADN simple brin', 'Une contamination par des protéines', 'Un ARN pur'], 2, 'Un ADN pur donne environ 1,8 ; les protéines absorbent à 280 nm.'],
            ['Pendant l’élongation de la PCR, la température est d’environ…', ['95 °C', '4 °C', '37 °C', '72 °C'], 3, 'C’est l’optimum de la Taq polymérase, enzyme thermostable.'],
            ['Combien de copies maximum après 10 cycles à partir d’une molécule ?', ['1 024', '100', '20', '10 000'], 0, '2¹⁰ = 1 024 : le nombre double à chaque cycle.'],
            ['Qu’est-ce qui détermine la région copiée par la PCR ?', ['La polymérase', 'Les amorces', 'Les dNTP', 'La température d’élongation'], 1, 'Les amorces s’hybrident de part et d’autre de la séquence cible.'],
            ['Le témoin négatif d’une PCR contient…', ['Un produit déjà amplifié', 'Uniquement de l’ADN', 'Tous les réactifs sauf l’ADN', 'Aucun réactif'], 2, 'Une bande dans ce tube signalerait une contamination.'],
            ['Un plasmide circulaire coupé en 3 sites donne…', ['2 fragments', '6 fragments', '4 fragments', '3 fragments'], 3, 'Sur un ADN circulaire, n coupures donnent n fragments.'],
            ['Les bouts collants résultent…', ['D’une coupure décalée sur les deux brins', 'D’une coupure droite', 'D’une ligation', 'D’une PCR'], 0, 'Ils laissent des extrémités simple brin complémentaires.'],
            ['L’enzyme qui soude le gène dans le vecteur est…', ['Une endonucléase', 'La ligase', 'La Taq polymérase', 'Une protéase'], 1, 'Elle recrée les liaisons phosphodiester.'],
            ['Le gène de résistance à un antibiotique du vecteur sert à…', ['Tuer les bactéries transformées', 'Couper l’ADN', 'Sélectionner les bactéries qui ont reçu le plasmide', 'Colorer les colonies'], 2, 'Sur un milieu avec l’antibiotique, seules elles survivent.'],
            ['La transformation bactérienne est…', ['La formation de spores', 'La mort de la bactérie', 'La coloration de Gram', 'L’entrée d’un plasmide dans une bactérie compétente'], 3, 'La bactérie acquiert ainsi le gène porté par le plasmide.'],
            ['Toute colonie qui pousse sur l’antibiotique porte forcément le plasmide recombinant.', ['Vrai', 'Faux'], 1, 'Elle peut porter un plasmide vide, refermé sans le gène : on le vérifie ensuite.'],
          ],
        },
        {
          titre: 'L’épreuve de biochimie-biologie-biotechnologie : écrit et ECE',
          axe: 'L – Travailler ensemble au laboratoire de biotechnologies',
          lecon: {
            titre: 'Deux parties, seize coefficients',
            cours: `La spécialité compte pour **16 coefficients** au bac STL, partagés entre un écrit et une épreuve pratique. Savoir exactement ce qu’on attend de toi, c’est déjà gagner des points.

## Ce qui est évalué
L’épreuve porte sur le **programme de Terminale** ; les notions de 1re (biochimie-biologie et biotechnologies) peuvent être mobilisées. Elle comporte deux parties :
| Partie | Durée | Note | Coefficient |
| **Écrite** | 3 h | sur 20 | **7** |
| **Pratique** (évaluation des compétences expérimentales, ECE) | 3 h | sur 20 | **9** |
Source : note de service du 11 septembre 2026 (BO spécial n° 4 du 17 septembre 2026), applicable à partir de la session 2027.
> La partie pratique pèse **plus** que l’écrit : les gestes du laboratoire comptent autant que les connaissances.

## L’écrit, en deux temps
1. **Questionnements scientifiques et technologiques** (durée indicative **2 h 30**), sur **6 à 9 documents** d’une demi-page à une page, autour d’une problématique de biotechnologie. On t’y demande d’analyser, de calculer (avec la dimension **métrologique** : unités, incertitudes, chiffres significatifs), d’interpréter et d’argumenter.
2. **Question de synthèse** (durée indicative **30 minutes**) : un paragraphe court, argumenté, scientifique, technologique ou sociétal, en lien avec la première partie.
La **maîtrise de la langue** compte pour **2 points sur 20** : orthographe, syntaxe, vocabulaire juste.

## Méthode pour l’écrit
1. Lis la problématique et survole tous les documents avant de répondre.
2. Pour chaque question, **cite le document** et l’information que tu en tires, puis conclus.
3. Pour un calcul : formule littérale, application numérique, résultat avec unité et bon nombre de chiffres significatifs.
4. Pour un schéma : titre, légendes, flèches orientées.
5. Garde 30 minutes pour la synthèse : une idée par phrase, reliée à la problématique.
!> Réciter le cours sans l’appliquer aux documents ne rapporte presque rien : le correcteur attend une **exploitation**.

## L’ECE, au laboratoire
Une **banque nationale** de sujets est constituée ; **16 sujets** sont retenus par session. Tu tires au sort le **jour et l’heure** de ton passage ; les sujets changent d’une demi-journée à l’autre ; ton examinateur n’est pas ton professeur de l’année.
Compétences évaluées :
- analyser une procédure pour identifier les **sources d’erreurs** et choisir le matériel ;
- identifier les **dangers**, évaluer les **risques** et choisir les mesures de **prévention** ;
- **réaliser** les manipulations en autonomie, prévention comprise ;
- effectuer les calculs, exploiter les mesures avec les **outils numériques** ;
- exprimer les résultats avec leur **dimension métrologique** ;
- **interpréter** les observations et les résultats.
Les examinateurs remplissent une grille d’observation : tes gestes sont notés pendant que tu travailles.

## Réussir l’ECE
- Lis tout le sujet et **planifie** : lance d’abord ce qui demande du temps (incubation, cinétique).
- Annonce tes mesures de prévention **avant** d’agir (gants, lunettes, poste de sécurité microbiologique, élimination des déchets).
- Place systématiquement les **témoins** et justifie-les.
- Note au propre chaque résultat brut, avec son unité.
- Compare ton résultat à une valeur de référence quand elle existe, avec l’incertitude.

## Et l’oral de contrôle
Au second groupe : **20 minutes de préparation** et **20 minutes d’oral**, dans un laboratoire de biotechnologies, sur une question scientifique et une question technologique, avec documents et matériel (sans manipuler).`,
          },
          questions: [
            ['Quel est le coefficient de la partie pratique (ECE) de la spécialité ?', ['9', '7', '16', '4'], 0, 'Écrit coefficient 7, pratique coefficient 9 : 16 au total.'],
            ['Combien de temps dure la partie écrite ?', ['2 h', '3 h', '4 h', '1 h 30'], 1, 'Trois heures, dont environ 2 h 30 de questionnements et 30 minutes de synthèse.'],
            ['Sur combien de documents s’appuie la première partie de l’écrit ?', ['1 ou 2', '15 à 20', '6 à 9', 'Aucun'], 2, 'Six à neuf documents, d’une demi-page à une page chacun.'],
            ['La deuxième partie de l’écrit est…', ['Un oral', 'Un QCM', 'Une manipulation', 'Une question de synthèse d’environ 30 minutes'], 3, 'Un paragraphe argumenté en lien avec la problématique de la première partie.'],
            ['Combien de points compte la maîtrise de la langue à l’écrit ?', ['2', '1', '0', '5'], 0, 'Deux points sur vingt : orthographe, syntaxe, vocabulaire précis.'],
            ['Les notions de 1re peuvent être mobilisées dans l’épreuve.', ['Vrai', 'Faux'], 0, 'L’épreuve porte sur le programme de Tle, mais les notions de 1re restent mobilisables.'],
            ['Combien de sujets d’ECE sont retenus dans la banque nationale pour une session ?', ['4', '16', '10', '50'], 1, 'Seize sujets, parmi lesquels l’établissement choisit selon son équipement.'],
            ['Pendant l’ECE, ton examinateur…', ['Est toujours ton professeur de l’année', 'N’observe pas les gestes', 'Ne peut pas être ton professeur de l’année', 'Corrige seulement un compte rendu écrit'], 2, 'C’est une règle de l’épreuve ; il note tes gestes sur une grille d’observation.'],
            ['Dans une réponse de l’écrit, que faut-il faire après avoir cité un document ?', ['Recopier tout le document', 'Réciter le chapitre de cours', 'Passer à la question suivante', 'En tirer l’information utile et conclure'], 3, 'Le correcteur attend une exploitation des documents, pas une récitation.'],
            ['Quelle compétence N’est PAS évaluée à l’ECE ?', ['Réciter une dissertation de philosophie', 'Réaliser en autonomie', 'Exprimer un résultat avec sa dimension métrologique', 'Identifier les dangers et choisir la prévention'], 0, 'Les cinq autres compétences sont toutes des compétences de laboratoire.'],
            ['Pendant l’ECE, que vaut-il mieux lancer en premier ?', ['Le rangement', 'Ce qui demande du temps (incubation, cinétique)', 'Le calcul final', 'La synthèse écrite'], 1, 'Planifier évite de manquer de temps en fin d’épreuve.'],
            ['L’oral de contrôle de la spécialité dure…', ['10 minutes sans préparation', '1 heure', '20 minutes, après 20 minutes de préparation', '3 heures'], 2, 'Il comporte une question scientifique et une question technologique.'],
          ],
        },
      ],
    },
  ],
}
