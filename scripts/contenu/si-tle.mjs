// SCIENCES DE L’INGÉNIEUR TERMINALE — le programme officiel (19 fiches),
// rangées sous 6 chapitres : cinématique et dynamique du solide · chaîne de
// puissance · résistance des matériaux · systèmes asservis · chaîne
// d’information · projet et épreuves.
//
// LE DÉFAUT. Sondé le 26/09/2026 (extraction lots/Tle/si.md) : la spécialité de
// Terminale n’a que TROIS fiches maison, héritées de la migration 219 —
// « Systèmes asservis », « Modélisation et simulation », « Projet et démarche
// d’ingénieur » —, jamais confrontées au programme. La dynamique (principe
// fondamental, inertie), la résistance des matériaux, le moteur à courant
// continu, la modulation d’énergie, le stockage, les bus de communication,
// l’Internet des objets, l’intelligence artificielle et l’épreuve écrite du bac
// n’avaient AUCUNE entrée.
//
// SOURCE : programme de l’enseignement de spécialité de sciences de
// l’ingénieur de la classe terminale (BO spécial n° 8 du 25 juillet 2019) —
// 6 h hebdomadaires de SI + 2 h de sciences physiques, projet de 48 h ;
// épreuve écrite de 4 h (3 h de SI pondérées 0,75, 1 h de sciences physiques
// pondérée 0,25), coefficient 16.
//
// PÉRIMÈTRE : la TERMINALE SEULE, et on AJOUTE. Pas de ménage : les 3 fiches
// existantes restent (positions 1 à 3, sans chapitre de programme), les 19
// fiches neuves partent de la position 4. Rien de ce que la 1re traite déjà
// (SysML, statique, cinématique du point, logique, adressage IP, composants)
// n’est refait : la Terminale s’appuie dessus.
//
// ⚠️ PAS DE LATEX : comme si-1re.mjs, les formules s’écrivent en texte —
// « C = k × I », « q = U / 2^n ».
// ⚠️ Ne JAMAIS générer avec `--slugs si` : toujours `--modules si-tle`.

export default {
  slug: 'si',
  nom: 'Sciences de l’ingénieur',

  titreMigration: 'SCIENCES DE L’INGÉNIEUR Tle — LE PROGRAMME OFFICIEL (19 fiches)',

  motif: `CONSTAT (extraction du 26/09/2026) : la spécialité Sciences de l'ingénieur de
Terminale n'avait que TROIS fiches maison, héritées de la migration 219 —
« Systèmes asservis », « Modélisation et simulation », « Projet et démarche
d'ingénieur » —, jamais confrontées au programme officiel (BO spécial n° 8 du
25 juillet 2019). La dynamique du solide, l'inertie, la résistance des
matériaux, le moteur à courant continu, le hacheur, les batteries, les bus de
communication, les objets connectés, l'intelligence artificielle et l'épreuve
écrite du bac n'avaient aucune entrée.

Cette migration AJOUTE 19 fiches, rangées sous 6 chapitres du programme, à
partir de la position 4. Elle ne retire rien : les 3 fiches existantes restent.`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 4,
      chapitres: [
        // ---- Chapitre 1 : cinématique et dynamique du solide ----------------
        {
          titre: 'Mouvements de translation et de rotation du solide',
          axe: 'Cinématique et dynamique du solide',
          lecon: {
            titre: 'Décrire le mouvement d’une pièce entière',
            cours: `En Première, tu as suivi un point. En Terminale, on suit une pièce entière : un chariot, un arbre, une roue. Deux mouvements suffisent à décrire presque tous les mécanismes.

## Les deux mouvements de base
| | Translation | Rotation autour d’un axe fixe |
| Ce qui se passe | Tous les points ont la même vitesse | Chaque point décrit un cercle centré sur l’axe |
| Grandeur de position | x, en m | θ, en rad |
| Grandeur de vitesse | v, en m/s | ω, en rad/s |
| Grandeur d’accélération | a, en m/s² | α (dω/dt), en rad/s² |
| Exemple | Le chariot d’une imprimante | L’arbre d’un moteur |

> En rotation, les points n’ont PAS tous la même vitesse : plus un point est loin de l’axe, plus il va vite. C’est toute la différence avec la translation.

## Passer d’un monde à l’autre
1. Les catalogues donnent des **tours par minute** : ω = 2π × N / 60. Un moteur à 1 500 tr/min tourne à 157 rad/s.
2. La vitesse d’un point situé à la distance R de l’axe vaut **v = ω × R**.
3. Un tour complet correspond à 2π rad, donc θ = 2π × (nombre de tours).

## Le mouvement uniformément varié
Quand l’accélération est constante :

| Grandeur | Translation | Rotation |
| Vitesse | v(t) = a × t + v0 | ω(t) = α × t + ω0 |
| Position | x(t) = ½ a t² + v0 t + x0 | θ(t) = ½ α t² + ω0 t + θ0 |

## Le profil de vitesse en trapèze
Un axe motorisé suit presque toujours la même loi : il **accélère**, roule à **vitesse constante**, puis **décélère**. Sur la courbe v(t), cela dessine un trapèze.

> La distance parcourue est l’**aire sous la courbe** de vitesse. Pas besoin d’équation horaire : on additionne des triangles et des rectangles.

## Exemple travaillé
Un convoyeur passe de 0 à 2 m/s en 0,5 s, roule 3 s à 2 m/s, puis s’arrête en 0,5 s.
- Accélération : a = 2 / 0,5 = 4 m/s².
- Distance en accélération : triangle, ½ × 0,5 × 2 = 0,5 m ; même chose au freinage.
- Distance au palier : 2 × 3 = 6 m.
- Distance totale : **7 m**.

Si le tambour qui entraîne la bande a un rayon de 0,1 m, sa vitesse de rotation au palier vaut ω = v / R = 20 rad/s, soit environ 191 tr/min.`,
          },
          questions: [
            ['Dans un mouvement de translation, les points du solide…', ['Ont une vitesse qui dépend de leur distance à l’axe', 'Ont tous la même vitesse', 'Décrivent tous un cercle', 'Sont immobiles les uns par rapport au sol'], 1, 'C’est la définition même de la translation : le solide se déplace sans tourner.'],
            ['Un moteur tourne à 3 000 tr/min. Quelle est sa vitesse angulaire ?', ['50 rad/s', '157 rad/s', '314 rad/s', '3 000 rad/s'], 2, 'ω = 2π × 3 000 / 60 = 100π, soit environ 314 rad/s.'],
            ['Quelle relation lie la vitesse d’un point à la vitesse de rotation ?', ['v = ω / R', 'v = ω × R', 'v = ω + R', 'v = ω × R²'], 1, 'Un point deux fois plus loin de l’axe va deux fois plus vite.'],
            ['Sur un solide en rotation, tous les points ont la même vitesse.', ['Vrai', 'Faux'], 1, 'Leur vitesse est proportionnelle à leur distance à l’axe : v = ω × R.'],
            ['Comment obtient-on la distance parcourue à partir de la courbe v(t) ?', ['En lisant la pente de la courbe', 'En prenant la valeur maximale', 'En calculant l’aire sous la courbe', 'En divisant la vitesse par le temps'], 2, 'La pente donne l’accélération ; l’aire donne la distance.'],
            ['Un chariot passe de 0 à 3 m/s en 1,5 s. Son accélération vaut…', ['0,5 m/s²', '4,5 m/s²', '1,5 m/s²', '2 m/s²'], 3, 'a = Δv / Δt = 3 / 1,5 = 2 m/s².'],
            ['Quelle forme a la courbe de vitesse d’un axe qui accélère, roule, puis freine ?', ['Un trapèze', 'Une droite horizontale', 'Une parabole', 'Une sinusoïde'], 0, 'Montée, palier, descente : c’est le profil le plus courant en automatisme.'],
            ['Dans un mouvement uniformément accéléré partant du repos, la position varie…', ['Linéairement avec le temps', 'Comme le carré du temps', 'Comme la racine du temps', 'Pas du tout'], 1, 'x(t) = ½ a t² : en doublant la durée, on quadruple la distance.'],
            ['Une roue de rayon 0,3 m tourne à 10 rad/s. Quelle est la vitesse d’un point de sa périphérie ?', ['3 m/s', '33 m/s', '0,03 m/s', '10,3 m/s'], 0, 'v = ω × R = 10 × 0,3 = 3 m/s.'],
            ['Combien de radians correspondent à 5 tours complets ?', ['5 rad', '5π rad', '10π rad', '360 rad'], 2, 'Un tour vaut 2π rad, donc 5 tours valent 10π rad.'],
            ['Pendant le palier d’un profil en trapèze, l’accélération est…', ['Maximale', 'Négative', 'Égale à la vitesse', 'Nulle'], 3, 'La vitesse est constante : sa variation, donc l’accélération, est nulle.'],
            ['L’accélération angulaire s’exprime en rad/s².', ['Vrai', 'Faux'], 0, 'C’est la variation de ω (rad/s) par seconde.'],
          ],
        },
        {
          titre: 'Le principe fondamental de la dynamique',
          axe: 'Cinématique et dynamique du solide',
          lecon: {
            titre: 'Relier les efforts au mouvement',
            cours: `La statique répond à la question « tient-il ? ». La dynamique répond à une autre : « quel effort faut-il pour qu’il accélère comme on veut ? ». C’est elle qui dimensionne les moteurs.

## Les deux formes du principe
| Mouvement | Énoncé | Unités |
| **Translation** | Somme des forces extérieures = m × a | N = kg × m/s² |
| **Rotation autour d’un axe fixe** | Somme des moments extérieurs = J × α | N·m = kg·m² × rad/s² |

m est la masse, J le **moment d’inertie** (la « masse » de la rotation), a et α les accélérations.

> Quand l’accélération est nulle, on retrouve exactement le principe fondamental de la statique. La statique n’est qu’un cas particulier de la dynamique.

## La méthode, toujours la même
1. **Isoler** le solide (ou l’ensemble) étudié.
2. Faire le **bilan des actions extérieures** : poids, actions des liaisons, couple moteur, couple résistant.
3. Choisir l’axe du mouvement et **projeter** (ou écrire les moments autour de l’axe de rotation).
4. Écrire le principe, puis **résoudre** pour l’inconnue cherchée.
5. Vérifier le **signe** et l’**ordre de grandeur**.

## Ce que dit chaque phase d’un mouvement
| Phase | Ce que doit fournir le moteur |
| Accélération | Le couple résistant **plus** le couple qui accélère l’inertie |
| Vitesse constante | Le couple résistant seulement |
| Décélération | Moins que le couple résistant, voire un couple de freinage |

> C’est la phase d’accélération qui fixe le couple maximal du moteur : on dimensionne sur le pire moment, pas sur la moyenne.

## Exemple travaillé en translation
Une cabine d’ascenseur de 800 kg monte avec une accélération de 1 m/s² (g = 9,81 m/s²). On isole la cabine : le câble tire vers le haut avec T, le poids vaut m × g vers le bas.

T − m × g = m × a, donc T = m × (g + a) = 800 × 10,81 ≈ **8 650 N**.

À vitesse constante, T = m × g ≈ 7 850 N : l’accélération demande 10 % d’effort en plus.

## Exemple travaillé en rotation
Un tambour d’inertie J = 0,5 kg·m² doit passer de 0 à 100 rad/s en 2 s, contre un couple de frottement de 5 N·m.
- α = 100 / 2 = 50 rad/s².
- C_moteur − 5 = 0,5 × 50, donc **C_moteur = 30 N·m**.
- Au palier, 5 N·m suffisent.`,
          },
          questions: [
            ['Comment s’écrit le principe fondamental de la dynamique en translation ?', ['Somme des forces = m × v', 'Somme des forces = m × a', 'Somme des forces = 0', 'Somme des forces = J × α'], 1, 'La force produit une accélération, pas une vitesse.'],
            ['En rotation autour d’un axe fixe, la somme des moments vaut…', ['m × a', 'J × ω', 'J × α', 'm × g'], 2, 'J est le moment d’inertie et α l’accélération angulaire.'],
            ['Quand l’accélération est nulle, le principe fondamental de la dynamique devient…', ['Le principe fondamental de la statique', 'La loi d’Ohm', 'Le théorème de l’énergie cinétique', 'La loi des nœuds'], 0, 'Avec a = 0, il reste « somme des forces = 0 » : c’est la statique.'],
            ['Quelle est la première étape de la méthode ?', ['Projeter sur un axe', 'Calculer l’accélération', 'Choisir un moteur', 'Isoler le solide étudié'], 3, 'Sans système isolé, on ne sait pas quelles actions sont extérieures.'],
            ['Une masse de 50 kg accélère à 2 m/s² sur un sol sans frottement. Quelle force faut-il ?', ['25 N', '100 N', '52 N', '490 N'], 1, 'F = m × a = 50 × 2 = 100 N.'],
            ['Quelle phase du mouvement fixe le couple maximal que doit fournir le moteur ?', ['L’accélération', 'Le palier à vitesse constante', 'L’arrêt', 'La décélération'], 0, 'Il faut vaincre le couple résistant ET accélérer l’inertie.'],
            ['À vitesse constante, le moteur ne fournit aucun couple.', ['Vrai', 'Faux'], 1, 'Il doit encore compenser le couple résistant (frottements, charge).'],
            ['Une cabine de 1 000 kg monte avec a = 0,5 m/s² (g = 9,81 m/s²). La tension du câble vaut environ…', ['9 810 N', '500 N', '10 310 N', '9 310 N'], 2, 'T = m × (g + a) = 1 000 × 10,31 = 10 310 N.'],
            ['Un volant d’inertie J = 2 kg·m² subit un couple net de 10 N·m. Son accélération angulaire vaut…', ['20 rad/s²', '0,2 rad/s²', '12 rad/s²', '5 rad/s²'], 3, 'α = C / J = 10 / 2 = 5 rad/s².'],
            ['Quelle unité a le moment d’inertie ?', ['kg·m²', 'N·m', 'kg/m', 'rad/s²'], 0, 'Il combine une masse et le carré d’une distance.'],
            ['En décélération, le couple moteur nécessaire est…', ['Toujours supérieur au couple résistant', 'Inférieur au couple résistant, voire négatif', 'Égal à J × ω', 'Indépendant de l’inertie'], 1, 'Le couple résistant aide à ralentir ; un freinage peut même être nécessaire.'],
            ['Le poids fait partie du bilan des actions extérieures d’une cabine isolée.', ['Vrai', 'Faux'], 0, 'C’est l’action à distance de la Terre sur la cabine.'],
          ],
        },
        {
          titre: 'Moment d’inertie et inertie équivalente',
          axe: 'Cinématique et dynamique du solide',
          lecon: {
            titre: 'La masse de la rotation',
            cours: `Faire tourner une roue de vélo tenue par l’axe est facile ; faire tourner la même masse en couronne de 1 m de rayon l’est beaucoup moins. Ce qui résiste à la rotation, ce n’est pas la masse seule : c’est la masse ET la distance à l’axe.

## Définition
Le moment d’inertie J d’un solide par rapport à un axe additionne chaque petite masse multipliée par le **carré** de sa distance à l’axe : J = somme des m × r². Il s’exprime en **kg·m²**.

| Forme | Moment d’inertie autour de son axe |
| Masse ponctuelle à la distance r | m × r² |
| Anneau ou tube mince de rayon R | m × R² |
| Cylindre ou disque plein de rayon R | ½ × m × R² |

> Doubler la masse double l’inertie ; doubler le rayon la **quadruple**. C’est pourquoi on allège d’abord la périphérie d’une pièce qui doit accélérer vite.

## Pourquoi on la ramène sur l’arbre moteur
Un moteur entraîne souvent sa charge à travers un réducteur. Le moteur « ressent » l’inertie de la charge, mais réduite. On calcule une **inertie équivalente** ramenée sur son arbre, en écrivant que l’énergie cinétique est la même :

½ × J_eq × ω_m² = ½ × J_m × ω_m² + ½ × J_c × ω_c²

Avec le rapport de réduction k = ω_c / ω_m, on obtient :

**J_eq = J_m + J_c × k²**

Une masse m en translation à la vitesse v se ramène de la même façon : elle compte pour m × (v / ω_m)². Pour une charge levée par un tambour de rayon R monté directement sur l’arbre, c’est m × R².

## La méthode
1. Calculer l’inertie de chaque pièce tournante par rapport à SON axe.
2. Calculer le rapport k entre sa vitesse et celle du moteur.
3. Multiplier son inertie par k².
4. Additionner le tout, sans oublier le rotor du moteur.

> Un réducteur de rapport 1/10 divise par 100 l’inertie ressentie par le moteur. C’est l’une des raisons pour lesquelles on associe un petit moteur rapide à un réducteur plutôt qu’un gros moteur lent.

## Exemple travaillé
Un plateau tournant plein de 20 kg et de rayon 0,4 m est entraîné par un moteur via un réducteur de rapport k = 1/10. Le rotor du moteur a une inertie de 0,001 kg·m².
- Plateau : J_c = ½ × 20 × 0,4² = 1,6 kg·m².
- Ramené au moteur : 1,6 × (1/10)² = 0,016 kg·m².
- J_eq = 0,001 + 0,016 = **0,017 kg·m²**.

Pour accélérer le moteur à 200 rad/s², il faudra un couple de 0,017 × 200 = 3,4 N·m, frottements non compris.`,
          },
          questions: [
            ['De quoi dépend le moment d’inertie d’un solide ?', ['De sa masse seulement', 'De sa vitesse de rotation', 'De sa masse et de sa répartition autour de l’axe', 'De sa couleur et de sa forme extérieure'], 2, 'J additionne des m × r² : la distance à l’axe compte au carré.'],
            ['Quel est le moment d’inertie d’un disque plein de masse m et de rayon R ?', ['m × R²', '½ × m × R²', '2 × m × R', 'm × R'], 1, 'Sa matière est répartie entre l’axe et le bord, d’où le facteur ½.'],
            ['Si l’on double le rayon d’un anneau de même masse, son inertie est…', ['Doublée', 'Inchangée', 'Divisée par deux', 'Multipliée par quatre'], 3, 'J = m × R² : le rayon compte au carré.'],
            ['Un anneau de 2 kg et de rayon 0,5 m a une inertie de…', ['0,5 kg·m²', '1 kg·m²', '0,25 kg·m²', '2 kg·m²'], 0, 'J = m × R² = 2 × 0,25 = 0,5 kg·m².'],
            ['Quelle formule donne l’inertie équivalente ramenée sur l’arbre moteur ?', ['J_eq = J_m + J_c × k²', 'J_eq = J_m + J_c / k', 'J_eq = J_m × J_c', 'J_eq = J_c × k'], 0, 'Elle découle de l’égalité des énergies cinétiques, avec k = ω_c / ω_m.'],
            ['Un réducteur de rapport 1/5 divise l’inertie de la charge ressentie par le moteur par…', ['5', '10', '25', '2,5'], 2, 'On multiplie par k² = 1/25.'],
            ['Sur quel principe repose le calcul de l’inertie équivalente ?', ['L’égalité des forces', 'La conservation de la masse', 'La loi des mailles', 'L’égalité des énergies cinétiques'], 3, 'Le moteur doit « voir » la même énergie à fournir que l’ensemble réel.'],
            ['Pour qu’une pièce accélère vite, on allège de préférence…', ['Sa périphérie', 'Son centre', 'Son axe', 'Peu importe l’endroit'], 0, 'La matière loin de l’axe pèse beaucoup plus dans J.'],
            ['L’inertie du rotor du moteur peut toujours être négligée.', ['Vrai', 'Faux'], 1, 'Avec un fort rapport de réduction, elle peut dominer l’inertie ramenée de la charge.'],
            ['Une masse levée par un tambour de rayon R, monté directement sur l’arbre moteur, compte dans l’inertie pour…', ['m × R', 'm × R²', 'm / R²', '½ × m'], 1, 'Sa vitesse vaut v = ω × R, donc m × (v / ω)² = m × R².'],
            ['L’inertie équivalente se mesure en kg·m², comme toute inertie.', ['Vrai', 'Faux'], 0, 'C’est une inertie comme une autre, simplement ramenée à un arbre de référence.'],
            ['Pourquoi associe-t-on souvent un petit moteur rapide à un réducteur ?', ['Pour augmenter la vitesse de la charge', 'Pour supprimer les frottements', 'Parce que le réducteur divise l’inertie ressentie et multiplie le couple', 'Pour augmenter la tension d’alimentation'], 2, 'Le réducteur adapte à la fois le couple et l’inertie à ce que le moteur sait faire.'],
          ],
        },
        {
          titre: 'Énergie cinétique et choix d’un moteur',
          axe: 'Cinématique et dynamique du solide',
          lecon: {
            titre: 'Dimensionner par l’énergie',
            cours: `Choisir un moteur, c’est répondre à deux questions : quel couple au pire moment, et quelle puissance en continu ? L’énergie cinétique donne un raccourci précieux pour y répondre.

## L’énergie cinétique
| Mouvement | Énergie cinétique | Unités |
| Translation | Ec = ½ × m × v² | J, kg, m/s |
| Rotation | Ec = ½ × J × ω² | J, kg·m², rad/s |
| Mouvement combiné (roue qui roule) | La somme des deux | J |

> La vitesse compte au carré : rouler deux fois plus vite demande quatre fois plus d’énergie, et il faudra la dissiper quatre fois plus au freinage.

## Puissance et énergie
La puissance est le débit d’énergie : P = énergie / durée. En mécanique :

| Mouvement | Puissance mécanique |
| Translation | P = F × v |
| Rotation | P = C × ω |

Pour faire varier l’énergie cinétique, il faut fournir une puissance : la variation d’Ec pendant une durée Δt est égale au travail de toutes les actions, motrices et résistantes. C’est le **théorème de l’énergie cinétique**.

## Choisir un moteur : la démarche
1. Tracer le **profil de mouvement** (vitesse en fonction du temps).
2. Calculer, phase par phase, le **couple** nécessaire (principe fondamental de la dynamique).
3. En déduire la **puissance** à chaque instant : P = C × ω.
4. Retenir le **couple maximal** (souvent en fin d’accélération) et la **puissance en régime établi**.
5. Choisir dans le catalogue un moteur qui couvre les deux, avec une **marge**, et vérifier sa vitesse maximale.

| Ce qu’on vérifie | Pourquoi |
| Couple maximal ≥ couple de pointe | Sinon l’axe n’atteint pas le profil voulu |
| Puissance nominale ≥ puissance continue | Sinon le moteur chauffe |
| Vitesse maximale ≥ vitesse du palier | Sinon le palier est inaccessible |

## Freinage et récupération
Au freinage, l’énergie cinétique doit aller quelque part : dans des **freins** (chaleur perdue) ou, si la chaîne est réversible, dans la **batterie** (freinage récupératif). C’est ce que font les véhicules électriques.

## Exemple travaillé
Une voiture électrique de 1 200 kg passe de 0 à 20 m/s (72 km/h) en 8 s.
- Ec finale = ½ × 1 200 × 20² = **240 000 J**, soit 240 kJ.
- Puissance moyenne pour la fournir : 240 000 / 8 = **30 kW**, sans compter les frottements.
- En fin d’accélération, avec a = 2,5 m/s², la force motrice vaut 3 000 N ; à 20 m/s, la puissance instantanée atteint 3 000 × 20 = 60 kW : **le double** de la moyenne. C’est elle qui dimensionne le moteur.`,
          },
          questions: [
            ['Quelle est l’énergie cinétique d’un solide en translation ?', ['m × v', '½ × m × v²', 'm × g × h', '½ × J × ω²'], 1, 'La formule ½ J ω² est son équivalent en rotation.'],
            ['Si la vitesse d’un véhicule double, son énergie cinétique…', ['Double', 'Reste identique', 'Est multipliée par quatre', 'Est divisée par deux'], 2, 'Ec dépend du carré de la vitesse.'],
            ['Un volant d’inertie J = 0,2 kg·m² tourne à 100 rad/s. Son énergie cinétique vaut…', ['1 000 J', '20 J', '2 000 J', '10 J'], 0, 'Ec = ½ × 0,2 × 100² = 1 000 J.'],
            ['Comment s’exprime la puissance mécanique en rotation ?', ['P = C / ω', 'P = C + ω', 'P = ½ × C × ω²', 'P = C × ω'], 3, 'Couple en N·m, vitesse angulaire en rad/s, puissance en W.'],
            ['Un moteur fournit 5 N·m à 200 rad/s. Sa puissance mécanique vaut…', ['40 W', '1 000 W', '205 W', '25 W'], 1, 'P = C × ω = 5 × 200 = 1 000 W.'],
            ['Que dit le théorème de l’énergie cinétique ?', ['La variation d’Ec est égale au travail des actions appliquées', 'L’énergie cinétique est toujours constante', 'La puissance est égale à la masse', 'Le couple est égal à la vitesse'], 0, 'Pour accélérer, il faut fournir un travail ; pour freiner, il faut en prélever.'],
            ['Pour choisir un moteur, on vérifie seulement la puissance moyenne.', ['Vrai', 'Faux'], 1, 'Il faut aussi le couple de pointe et la vitesse maximale : la moyenne cache le pire moment.'],
            ['Où part l’énergie cinétique lors d’un freinage récupératif ?', ['Dans l’air', 'Dans les pneus', 'Dans la batterie', 'Dans le moteur thermique'], 2, 'La machine électrique fonctionne alors en génératrice.'],
            ['Un moteur dont la puissance nominale est inférieure à la puissance continue demandée…', ['Tourne plus vite', 'Consomme moins', 'Devient plus précis', 'Chauffe et vieillit prématurément'], 3, 'La puissance nominale est ce qu’il supporte en continu sans surchauffe.'],
            ['Une masse de 100 kg roule à 3 m/s. Son énergie cinétique vaut…', ['150 J', '300 J', '450 J', '900 J'], 2, 'Ec = ½ × 100 × 9 = 450 J.'],
            ['La puissance instantanée en fin d’accélération peut dépasser nettement la puissance moyenne.', ['Vrai', 'Faux'], 0, 'À force motrice constante, P = F × v croît avec la vitesse.'],
            ['Que représente la puissance ?', ['Une force', 'Un débit d’énergie', 'Une masse en mouvement', 'Une vitesse angulaire'], 1, 'P = énergie / durée, en watts, c’est-à-dire en joules par seconde.'],
          ],
        },
        // ---- Chapitre 2 : chaîne de puissance -------------------------------
        {
          titre: 'Les transmetteurs de mouvement',
          axe: 'Chaîne de puissance',
          lecon: {
            titre: 'Lois entrée-sortie et couples',
            cours: `Un moteur tourne vite et fort peu ; la charge demande souvent l’inverse, ou un mouvement de translation. Entre les deux, les transmetteurs adaptent la vitesse, le couple et la nature du mouvement.

## Les lois entrée-sortie
| Transmetteur | Mouvement | Loi entrée-sortie |
| Engrenage (roues de Z1 et Z2 dents) | Rotation → rotation | ω2 / ω1 = Z1 / Z2, sens inversé pour un contact extérieur |
| Train d’engrenages | Rotation → rotation | Rapport = produit des Z menants / produit des Z menés |
| Poulies-courroie (diamètres d1, d2) | Rotation → rotation | ω2 / ω1 = d1 / d2, même sens |
| Pignon-crémaillère (rayon primitif R) | Rotation → translation | v = ω × R |
| Vis-écrou (pas p) | Rotation → translation | v = p × ω / 2π, soit le pas par tour |

> Un rapport de réduction inférieur à 1 ralentit la sortie ; en échange, il multiplie le couple. On ne gagne jamais sur les deux tableaux.

## Couple et rendement
La puissance se conserve, aux pertes près : P_sortie = η × P_entrée. Avec un rapport k = ω_s / ω_e :

**C_s = η × C_e / k**

| Grandeur | Réducteur de rapport 1/4, rendement 0,9 |
| Vitesse de sortie | 4 fois plus faible |
| Couple de sortie | 0,9 × 4 = 3,6 fois plus grand |

Dans une chaîne de plusieurs transmetteurs, les **rendements se multiplient** : 0,9 × 0,9 × 0,95 ≈ 0,77. Chaque étage coûte.

## Réversibilité
Un transmetteur est **réversible** si la sortie peut entraîner l’entrée. Un engrenage droit l’est ; une vis-écrou à pas fin, souvent **non** : la charge ne redescend pas seule quand le moteur s’arrête. C’est un défaut pour le rendement, mais une qualité pour la sécurité d’un vérin ou d’un cric.

## La méthode
1. Repérer la **nature** des mouvements d’entrée et de sortie.
2. Écrire la **loi entrée-sortie** de chaque étage.
3. Multiplier les rapports, puis les rendements.
4. En déduire la vitesse et le couple de sortie, et comparer au cahier des charges.

## Exemple travaillé
Un moteur à 3 000 tr/min fournit 2 N·m. Il entraîne un pignon de 12 dents engrené avec une roue de 48 dents (rendement 0,9), qui fait tourner une vis de pas 4 mm (rendement 0,4).
- Rapport de l’engrenage : 12 / 48 = 1/4, soit **750 tr/min** à la vis.
- Couple sur la vis : 0,9 × 2 × 4 = **7,2 N·m**.
- Vitesse de l’écrou : 750 tr/min × 4 mm = 3 000 mm/min, soit **50 mm/s**.
- Rendement global : 0,9 × 0,4 = **0,36** : la vis-écrou est l’étage qui coûte le plus.`,
          },
          questions: [
            ['Un pignon de 15 dents entraîne une roue de 45 dents. Le rapport ω_roue / ω_pignon vaut…', ['3', '1/3', '1/45', '60'], 1, 'ω2 / ω1 = Z1 / Z2 = 15 / 45 = 1/3.'],
            ['Deux roues en contact extérieur tournent…', ['Dans le même sens', 'Toujours à la même vitesse', 'En sens inverses', 'Seulement si elles ont le même nombre de dents'], 2, 'C’est pour cela qu’on ajoute parfois une roue intermédiaire pour retrouver le sens.'],
            ['Quel transmetteur transforme une rotation en translation ?', ['Le train d’engrenages', 'Le système poulies-courroie', 'Le réducteur à engrenages', 'Le pignon-crémaillère'], 3, 'Sa loi est v = ω × R, avec R le rayon primitif du pignon.'],
            ['Une vis de pas 5 mm tourne à 2 tours par seconde. L’écrou avance à…', ['10 mm/s', '2,5 mm/s', '5 mm/s', '7 mm/s'], 0, 'Chaque tour fait avancer d’un pas : 2 × 5 = 10 mm/s.'],
            ['Un réducteur divise la vitesse par 4 avec un rendement de 1. Le couple de sortie est…', ['Divisé par 4', 'Multiplié par 4', 'Inchangé', 'Multiplié par 16'], 1, 'La puissance C × ω se conserve : moins de vitesse, plus de couple.'],
            ['Dans une chaîne de transmetteurs, le rendement global est…', ['La somme des rendements', 'Le plus faible des rendements', 'Le produit des rendements', 'La moyenne des rendements'], 2, 'Chaque étage prélève sa part de pertes sur ce qu’il reçoit.'],
            ['Dans un système poulies-courroie, les deux poulies tournent dans le même sens.', ['Vrai', 'Faux'], 0, 'Avec une courroie ouverte (non croisée), le sens est conservé.'],
            ['Quel est l’intérêt d’une vis-écrou non réversible sur un cric ?', ['Augmenter la vitesse de levée', 'Améliorer le rendement', 'Réduire le bruit', 'Empêcher la charge de redescendre seule'], 3, 'L’irréversibilité est ici une sécurité.'],
            ['Un pignon de rayon primitif 20 mm tourne à 10 rad/s sur une crémaillère. Celle-ci avance à…', ['0,2 m/s', '2 m/s', '0,02 m/s', '20 m/s'], 0, 'v = ω × R = 10 × 0,02 = 0,2 m/s.'],
            ['Trois étages de rendements 0,9, 0,8 et 0,5 donnent un rendement global de…', ['2,2', '0,5', '0,36', '0,73'], 2, '0,9 × 0,8 × 0,5 = 0,36.'],
            ['Un réducteur permet de gagner à la fois en vitesse et en couple.', ['Vrai', 'Faux'], 1, 'La puissance ne se crée pas : ce qu’on gagne en couple se perd en vitesse.'],
            ['Pour un moteur de 1 N·m et un réducteur de rapport 1/10 de rendement 0,8, le couple de sortie vaut…', ['0,08 N·m', '10 N·m', '12,5 N·m', '8 N·m'], 3, 'C_s = η × C_e / k = 0,8 × 1 × 10 = 8 N·m.'],
          ],
        },
        {
          titre: 'Le moteur à courant continu',
          axe: 'Chaîne de puissance',
          lecon: {
            titre: 'Trois équations pour tout prévoir',
            cours: `Le moteur à courant continu convertit l’énergie électrique en énergie mécanique. Son modèle tient en trois équations, et elles suffisent pour prévoir sa vitesse, son couple et son rendement.

## Le modèle électrique et électromécanique
| Équation | Ce qu’elle dit |
| **U = E + R × I** | La tension d’alimentation se partage entre la force contre-électromotrice E et la chute dans la résistance de l’induit |
| **E = k × Ω** | La force contre-électromotrice est proportionnelle à la vitesse |
| **C_em = k × I** | Le couple électromagnétique est proportionnel au courant |

k est la **constante de couple** (en N·m/A, égale à la constante de vitesse en V·s/rad). En régime permanent, on néglige l’inductance du bobinage.

> Retiens la paire : **le courant fait le couple, la tension fait la vitesse**. Pour aller plus vite, on monte la tension ; pour forcer davantage, le moteur appelle plus de courant.

## Le bilan des puissances
| Puissance | Expression |
| Absorbée | P_abs = U × I |
| Pertes Joule | P_J = R × I² |
| Électromagnétique | P_em = E × I = C_em × Ω |
| Utile | P_u = P_em − pertes mécaniques |
| Rendement | η = P_u / P_abs |

## Ce qui se passe au démarrage
À l’arrêt, Ω = 0 donc E = 0 : le courant vaut **I = U / R**, souvent dix fois le courant nominal. Le couple de démarrage est très fort — utile — mais le courant peut abîmer le bobinage ou l’alimentation. On limite donc le courant au démarrage, par exemple en montant la tension progressivement avec un hacheur.

## Réversibilité
La même machine fonctionne en **génératrice** : entraînée mécaniquement, elle produit une tension E = k × Ω. C’est ce qui permet le freinage récupératif.

## La méthode
1. Identifier k et R (données constructeur ou essais).
2. Du couple demandé, déduire le courant : I = C / k.
3. De la tension, déduire E = U − R × I.
4. En déduire la vitesse : Ω = E / k.
5. Faire le bilan des puissances.

## Exemple travaillé
Un moteur a R = 1 Ω et k = 0,05 N·m/A. Alimenté sous 24 V, il fournit un couple électromagnétique de 0,1 N·m.
- I = 0,1 / 0,05 = **2 A**.
- E = 24 − 1 × 2 = **22 V**.
- Ω = 22 / 0,05 = **440 rad/s**, soit environ 4 200 tr/min.
- P_abs = 24 × 2 = 48 W ; P_J = 1 × 4 = 4 W ; P_em = 22 × 2 = 44 W (on vérifie : 0,1 × 440 = 44 W).
- Sans pertes mécaniques, le rendement vaut 44 / 48 ≈ **92 %**.`,
          },
          questions: [
            ['Dans un moteur à courant continu, le couple électromagnétique est proportionnel…', ['À la tension', 'Au courant', 'À la vitesse', 'À la résistance'], 1, 'C_em = k × I : le courant fait le couple.'],
            ['La force contre-électromotrice E est proportionnelle…', ['Au courant', 'À la résistance', 'À la vitesse de rotation', 'Au couple résistant'], 2, 'E = k × Ω : elle naît de la rotation du bobinage.'],
            ['Quelle équation décrit l’induit en régime permanent ?', ['U = E + R × I', 'U = E − R × I', 'U = R / I', 'U = k × I'], 0, 'La tension se partage entre E et la chute dans la résistance.'],
            ['Pourquoi le courant est-il très élevé au démarrage ?', ['Parce que la résistance augmente', 'Parce que le couple est nul', 'Parce que la tension double', 'Parce que E est nulle à l’arrêt'], 3, 'Sans vitesse, pas de force contre-électromotrice : I = U / R.'],
            ['Pour augmenter la vitesse d’un moteur à courant continu, on augmente…', ['La tension d’alimentation', 'La résistance de l’induit', 'Le couple résistant', 'La constante k'], 0, 'La tension fait la vitesse, à couple donné.'],
            ['Les pertes Joule dans l’induit valent…', ['U × I', 'R × I²', 'E × I', 'k × Ω'], 1, 'Elles chauffent le bobinage et croissent comme le carré du courant.'],
            ['Un moteur de k = 0,1 N·m/A absorbe 3 A. Son couple électromagnétique vaut…', ['30 N·m', '0,03 N·m', '0,3 N·m', '3,1 N·m'], 2, 'C = k × I = 0,1 × 3 = 0,3 N·m.'],
            ['Un moteur à courant continu peut fonctionner en génératrice.', ['Vrai', 'Faux'], 0, 'Entraîné, il produit E = k × Ω : c’est la base du freinage récupératif.'],
            ['Sous 12 V, un moteur de R = 2 Ω absorbe 1 A. Sa force contre-électromotrice vaut…', ['14 V', '12 V', '6 V', '10 V'], 3, 'E = U − R × I = 12 − 2 = 10 V.'],
            ['La puissance électromagnétique s’écrit E × I, ou encore…', ['R × I²', 'U × I', 'C_em × Ω', 'k × U'], 2, 'C’est le point de passage entre le monde électrique et le monde mécanique.'],
            ['Quand le couple résistant augmente à tension constante, la vitesse du moteur…', ['Diminue un peu', 'Augmente', 'Reste rigoureusement constante', 'Devient nulle immédiatement'], 0, 'Le courant monte, la chute R × I aussi, donc E et la vitesse baissent.'],
            ['Le rendement d’un moteur peut dépasser 100 %.', ['Vrai', 'Faux'], 1, 'Il y a toujours des pertes : Joule, mécaniques, magnétiques.'],
          ],
        },
        {
          titre: 'Moduler l’énergie : hacheur et MLI',
          axe: 'Chaîne de puissance',
          lecon: {
            titre: 'Doser la puissance en découpant la tension',
            cours: `Pour faire varier la vitesse d’un moteur, on pourrait mettre une résistance en série : elle chaufferait, et gaspillerait l’énergie. Le hacheur fait mieux : il découpe la tension si vite que le moteur n’en « voit » que la moyenne.

## Le principe du hacheur
Un interrupteur électronique (un **transistor**) s’ouvre et se ferme à fréquence fixe f, de période T = 1 / f. Il reste fermé pendant t_on.

| Grandeur | Définition |
| Rapport cyclique | α = t_on / T, entre 0 et 1 |
| Tension moyenne aux bornes de la charge | **U_moy = α × U_alim** |
| Fréquence de découpage | Souvent de quelques kHz à plus de 20 kHz |

> C’est ce qu’on appelle la **MLI** (modulation de largeur d’impulsion, en anglais PWM) : on ne change pas la hauteur des créneaux, on change leur largeur.

## Pourquoi c’est efficace
Un interrupteur idéal ne dissipe rien : **ouvert**, le courant est nul ; **fermé**, la tension à ses bornes est presque nulle. Dans les deux cas, U × I ≈ 0. Le rendement d’un hacheur dépasse couramment 90 %, là où une résistance série brûlerait toute la tension qu’elle retient.

## Le rôle de l’inductance et de la diode
Le bobinage du moteur est une **inductance** : il s’oppose aux variations brusques du courant et le lisse. Quand le transistor s’ouvre, le courant doit pouvoir continuer à circuler : une **diode de roue libre** lui offre un chemin. Sans elle, une surtension détruirait le transistor.

## Le pont en H
Quatre interrupteurs disposés en H autour du moteur permettent d’**inverser la polarité** : le moteur tourne dans les deux sens. Commandé en MLI, le pont règle à la fois le sens et la vitesse.

| Quadrant | Vitesse | Couple | Fonctionnement |
| 1 | + | + | Moteur, marche avant |
| 2 | + | − | Génératrice, freinage en marche avant |
| 3 | − | − | Moteur, marche arrière |
| 4 | − | + | Génératrice, freinage en marche arrière |

Un convertisseur qui travaille dans les quatre quadrants peut **renvoyer l’énergie** de freinage vers la source.

## Exemple travaillé
Un moteur est alimenté par un hacheur sous 12 V, découpé à 20 kHz.
- Période : T = 1 / 20 000 = 50 µs.
- Pour obtenir 9 V moyens : α = 9 / 12 = **0,75**, donc t_on = 0,75 × 50 = **37,5 µs**.
- Sur une carte programmable dont la sortie MLI va de 0 à 255, la consigne vaut environ 0,75 × 255 ≈ **191**.

À 20 kHz, le découpage est au-dessus de ce que l’oreille humaine perçoit : le moteur ne siffle pas.`,
          },
          questions: [
            ['Que vaut la tension moyenne en sortie d’un hacheur série ?', ['U_alim / α', 'α × U_alim', 'U_alim − α', 'α² × U_alim'], 1, 'On ne change que la durée de conduction, pas la hauteur du créneau.'],
            ['Le rapport cyclique est défini par…', ['t_on / T', 'T / t_on', 'f × T', 'U_moy × T'], 0, 'C’est la fraction de la période pendant laquelle l’interrupteur conduit.'],
            ['Sous 24 V, avec α = 0,25, la tension moyenne vaut…', ['24 V', '12 V', '3 V', '6 V'], 3, 'U_moy = 0,25 × 24 = 6 V.'],
            ['Pourquoi un hacheur a-t-il un bien meilleur rendement qu’une résistance série ?', ['Parce qu’il fonctionne en courant alternatif', 'Parce qu’il stocke l’énergie dans une pile', 'Parce que ses interrupteurs dissipent presque rien, ouverts ou fermés', 'Parce qu’il augmente la tension'], 2, 'Ouvert, I ≈ 0 ; fermé, U ≈ 0 : le produit U × I reste proche de zéro.'],
            ['Quel est le rôle de la diode de roue libre ?', ['Laisser circuler le courant de l’inductance quand le transistor s’ouvre', 'Augmenter la tension', 'Mesurer la vitesse', 'Inverser le sens de rotation'], 0, 'Sans elle, la coupure brutale du courant créerait une surtension destructrice.'],
            ['Que permet un pont en H ?', ['De doubler la tension', 'De supprimer le découpage', 'De mesurer le courant', 'D’inverser le sens de rotation du moteur'], 3, 'Ses quatre interrupteurs inversent la polarité appliquée au moteur.'],
            ['La MLI change la hauteur des créneaux de tension.', ['Vrai', 'Faux'], 1, 'Elle change leur largeur ; la hauteur reste la tension d’alimentation.'],
            ['À 10 kHz, quelle est la période de découpage ?', ['10 ms', '1 ms', '100 µs', '10 µs'], 2, 'T = 1 / 10 000 = 0,0001 s = 100 µs.'],
            ['Dans quel quadrant la machine freine-t-elle en marche avant ?', ['Vitesse positive, couple négatif', 'Vitesse positive, couple positif', 'Vitesse négative, couple négatif', 'Vitesse nulle, couple nul'], 0, 'Le couple s’oppose au mouvement : la machine fonctionne en génératrice.'],
            ['Pourquoi découpe-t-on souvent au-dessus de 20 kHz ?', ['Pour augmenter la tension moyenne', 'Pour que le découpage ne s’entende pas', 'Pour inverser le sens', 'Pour réduire la vitesse'], 1, 'Au-delà d’environ 20 kHz, l’oreille humaine ne perçoit plus le sifflement.'],
            ['L’inductance du moteur lisse le courant découpé.', ['Vrai', 'Faux'], 0, 'Elle s’oppose aux variations brusques du courant.'],
            ['Sur une sortie MLI réglable de 0 à 255, quelle consigne donne environ la moitié de la tension ?', ['64', '255', '0', '128'], 3, '128 / 255 ≈ 0,5.'],
          ],
        },
        {
          titre: 'Stocker l’énergie : batteries et autonomie',
          axe: 'Chaîne de puissance',
          lecon: {
            titre: 'Capacité, énergie et autonomie',
            cours: `Un vélo électrique, un drone, un robot : dès qu’un système quitte la prise, sa batterie devient le composant qui fixe ce qu’il peut faire. Encore faut-il savoir lire ce qui est écrit dessus.

## Les grandeurs d’une batterie
| Grandeur | Unité | Ce qu’elle dit |
| Tension nominale U | V | La tension moyenne en décharge |
| Capacité Q | Ah (ou mAh) | La quantité d’électricité qu’elle peut débiter |
| Énergie W | Wh | **W = Q × U** : ce qui compte vraiment pour l’autonomie |
| Énergie massique | Wh/kg | L’énergie par kilo embarqué |
| Courant de décharge | en « C » | 1 C décharge la batterie en une heure environ |

> Deux batteries de 10 Ah n’ont pas la même autonomie si l’une est en 12 V et l’autre en 36 V : la capacité se compare en **Wh**, pas en Ah.

## Associer des cellules
Une batterie est faite de **cellules** (environ 3,6 V pour une cellule lithium-ion).

| Association | Tension | Capacité |
| En **série** | Les tensions s’additionnent | Celle d’une cellule |
| En **parallèle** | Celle d’une cellule | Les capacités s’additionnent |

Une batterie « 10S4P » associe 10 cellules en série, et 4 de ces branches en parallèle.

## L’autonomie
1. Calculer l’énergie totale : W = Q × U.
2. Retenir l’énergie **utilisable** : on ne décharge jamais à 100 % (profondeur de décharge de 80 % par exemple), pour préserver la durée de vie.
3. Diviser par la puissance moyenne consommée : **t = W_utile / P**.
4. Tenir compte du rendement de la chaîne et de la température (le froid réduit la capacité disponible).

## Batterie ou supercondensateur ?
| | Batterie | Supercondensateur |
| Énergie stockée | Grande | Faible (W = ½ × C × U²) |
| Puissance disponible | Moyenne | Très grande |
| Nombre de cycles | Centaines à quelques milliers | Des centaines de milliers |
| Usage type | Autonomie | Pics de puissance, freinage récupératif |

## Exemple travaillé
Un vélo à assistance électrique a une batterie de 36 V et 10 Ah.
- Énergie : 36 × 10 = **360 Wh**.
- Utilisable à 80 % : **288 Wh**.
- Consommation moyenne : 12 Wh/km, donc autonomie ≈ 288 / 12 = **24 km**.
- Avec des cellules de 3,6 V et 2,5 Ah : 36 / 3,6 = 10 en série, 10 / 2,5 = 4 branches en parallèle, soit **40 cellules** (10S4P).`,
          },
          questions: [
            ['Quelle grandeur mesure l’énergie stockée dans une batterie ?', ['Le wattheure (Wh)', 'L’ampère-heure (Ah)', 'Le volt (V)', 'L’ohm (Ω)'], 0, 'L’Ah est une quantité d’électricité ; il faut la multiplier par la tension.'],
            ['Une batterie de 12 V et 5 Ah stocke…', ['17 Wh', '2,4 Wh', '60 Wh', '600 Wh'], 2, 'W = Q × U = 5 × 12 = 60 Wh.'],
            ['Des cellules associées en série…', ['Additionnent leurs capacités', 'Additionnent leurs tensions', 'Divisent leur tension', 'Ne changent rien'], 1, 'Les capacités s’additionnent en parallèle, les tensions en série.'],
            ['Pourquoi ne décharge-t-on pas une batterie à 100 % ?', ['Pour préserver sa durée de vie', 'Pour augmenter sa tension', 'Parce que c’est interdit', 'Pour gagner en masse'], 0, 'Les décharges profondes usent plus vite les cellules.'],
            ['Deux batteries de 10 Ah ont forcément la même autonomie.', ['Vrai', 'Faux'], 1, 'Il faut comparer l’énergie en Wh, qui dépend aussi de la tension.'],
            ['Une batterie de 200 Wh utiles alimente un robot de 50 W. Son autonomie vaut…', ['10 000 h', '250 h', '0,25 h', '4 h'], 3, 't = W / P = 200 / 50 = 4 h.'],
            ['Combien de cellules de 3,6 V faut-il en série pour obtenir 36 V ?', ['4', '36', '10', '12'], 2, '36 / 3,6 = 10 cellules.'],
            ['Quel est le point fort d’un supercondensateur par rapport à une batterie ?', ['Il fournit de très fortes puissances et supporte énormément de cycles', 'Il stocke beaucoup plus d’énergie', 'Il ne s’use jamais', 'Il fonctionne sans tension'], 0, 'Il stocke peu d’énergie, mais la rend très vite.'],
            ['Que désigne un courant de décharge de 1 C ?', ['Un courant de 1 A', 'Un courant qui décharge la batterie en une heure environ', 'Un courant de charge nul', 'La tension de la cellule'], 1, 'Pour une batterie de 2 Ah, 1 C correspond à 2 A.'],
            ['Le froid peut réduire la capacité disponible d’une batterie.', ['Vrai', 'Faux'], 0, 'Les réactions chimiques ralentissent : l’autonomie baisse en hiver.'],
            ['Quelle expression donne l’énergie stockée dans un condensateur ?', ['C × U', 'Q × U²', '½ × C × U²', 'U / C'], 2, 'C est la capacité en farads, U la tension à ses bornes.'],
            ['Une batterie « 10S4P » comporte…', ['14 cellules', '10 cellules', '4 cellules', '40 cellules'], 3, '10 en série, et 4 branches de ce type en parallèle : 10 × 4 = 40.'],
          ],
        },
        // ---- Chapitre 3 : résistance des matériaux --------------------------
        {
          titre: 'Contraintes et déformations : la traction',
          axe: 'Résistance des matériaux',
          lecon: {
            titre: 'Tenir sans casser ni trop s’allonger',
            cours: `La statique dit quels efforts subit une pièce. La résistance des matériaux dit si elle va les supporter : sans casser, et sans se déformer au-delà de ce que le système tolère.

## Les hypothèses
On étudie une **poutre** (pièce longue devant sa section) faite d’un matériau **homogène** et **isotrope**, qui subit de **petites déformations**. Dans ces conditions, les calculs restent simples et fiables.

## La contrainte
Une barre tirée par un effort normal N (en N) de section S (en mm²) subit une contrainte normale :

**σ = N / S**, en MPa (1 MPa = 1 N/mm²).

> La contrainte, c’est l’effort ramené à la surface qui le porte. Une barre deux fois plus épaisse ne subit pas deux fois moins d’effort : elle le répartit sur plus de matière.

## La déformation et la loi de Hooke
L’allongement relatif est **ε = ΔL / L0** (sans unité). Dans le domaine **élastique** :

**σ = E × ε** (loi de Hooke)

E est le **module d’Young** : la raideur du matériau.

| Matériau | Module d’Young E (ordre de grandeur) |
| Acier | 210 000 MPa |
| Aluminium | 70 000 MPa |
| Bois (dans le sens des fibres) | 10 000 MPa |
| Polymère courant | 1 000 à 3 000 MPa |

## L’essai de traction
On tire une éprouvette jusqu’à la rupture et on trace σ en fonction de ε.

| Zone de la courbe | Ce qui se passe |
| Élastique (droite) | La pièce reprend sa forme au relâchement |
| Limite élastique Re | Au-delà, la déformation devient permanente |
| Plastique | La pièce s’allonge durablement |
| Résistance à la rupture Rm | La contrainte maximale avant la rupture |

## La condition de résistance
On impose que la contrainte reste sous la limite élastique, avec une marge : σ ≤ Re / s, où s est le **coefficient de sécurité** (souvent 1,5 à 3, davantage quand des personnes sont en jeu).

## Exemple travaillé
Un tirant en acier (Re = 235 MPa) de diamètre 10 mm et de longueur 2 m est tiré par 10 kN.
- Section : S = π × 5² ≈ 78,5 mm².
- Contrainte : σ = 10 000 / 78,5 ≈ **127 MPa**, sous Re.
- Coefficient de sécurité obtenu : 235 / 127 ≈ **1,85**.
- Allongement : ε = 127 / 210 000 ≈ 0,0006, donc ΔL = 0,0006 × 2 000 ≈ **1,2 mm**.`,
          },
          questions: [
            ['Comment calcule-t-on la contrainte normale dans une barre tendue ?', ['σ = N × S', 'σ = N / S', 'σ = S / N', 'σ = E × N'], 1, 'C’est l’effort réparti sur la section qui le porte.'],
            ['À quoi équivaut 1 MPa ?', ['1 N/m²', '1 kN/m', '1 N/mm²', '1 kg/cm'], 2, 'Un mégapascal vaut un newton par millimètre carré.'],
            ['Que dit la loi de Hooke ?', ['σ = E × ε dans le domaine élastique', 'La contrainte est toujours nulle', 'σ = N × L', 'La déformation est permanente'], 0, 'Dans le domaine élastique, contrainte et déformation sont proportionnelles.'],
            ['Que représente le module d’Young ?', ['La contrainte de rupture', 'La masse volumique', 'La limite élastique', 'La raideur du matériau'], 3, 'Plus E est grand, moins le matériau s’allonge pour une même contrainte.'],
            ['Au-delà de la limite élastique, la déformation devient permanente.', ['Vrai', 'Faux'], 0, 'On entre dans le domaine plastique : la pièce ne revient plus à sa forme.'],
            ['Une barre de 100 mm² est tirée par 5 000 N. Sa contrainte vaut…', ['500 MPa', '0,02 MPa', '5 000 MPa', '50 MPa'], 3, 'σ = 5 000 / 100 = 50 MPa.'],
            ['Quel matériau est le plus raide ?', ['L’aluminium', 'L’acier', 'Le bois', 'Un polymère courant'], 1, 'Son module d’Young, environ 210 000 MPa, est trois fois celui de l’aluminium.'],
            ['Que vaut l’allongement relatif ε ?', ['ΔL × L0', 'L0 / ΔL', 'ΔL / L0', 'ΔL − L0'], 2, 'C’est un rapport de longueurs, sans unité.'],
            ['À quoi sert le coefficient de sécurité ?', ['À garder une marge sous la limite élastique', 'À augmenter la contrainte admissible', 'À calculer la masse', 'À mesurer le module d’Young'], 0, 'On impose σ ≤ Re / s pour absorber les incertitudes.'],
            ['Doubler la section d’un tirant, à effort égal, divise sa contrainte par…', ['4', '2', '1', '8'], 1, 'σ = N / S : la section double, la contrainte est divisée par deux.'],
            ['La résistance à la rupture Rm est inférieure à la limite élastique Re.', ['Vrai', 'Faux'], 1, 'Rm est la contrainte maximale de la courbe : elle est au-dessus de Re.'],
            ['Un acier avec Re = 300 MPa et s = 2 admet une contrainte maximale de…', ['600 MPa', '302 MPa', '298 MPa', '150 MPa'], 3, 'σ admissible = Re / s = 300 / 2 = 150 MPa.'],
          ],
        },
        {
          titre: 'La flexion simple des poutres',
          axe: 'Résistance des matériaux',
          lecon: {
            titre: 'Pourquoi une planche sur chant plie moins',
            cours: `Pose une règle à plat sur deux livres et appuie : elle plie. Pose-la sur la tranche : elle ne bouge presque plus. Même matière, même section, et pourtant un comportement très différent. La flexion explique pourquoi.

## Ce qui se passe dans une poutre fléchie
Une poutre soumise à des charges perpendiculaires à son axe se courbe. Ses fibres ne travaillent pas toutes de la même façon :

| Zone | Pour une poutre sur deux appuis chargée vers le bas |
| Fibres du haut | Comprimées |
| Fibre neutre | Ni tendue ni comprimée : contrainte nulle |
| Fibres du bas | Tendues |

La contrainte est **nulle sur la fibre neutre** et **maximale sur les fibres extrêmes**.

## Le moment fléchissant et la contrainte
L’effet des charges dans une section s’appelle le **moment fléchissant** Mf. La contrainte maximale vaut :

**σ_max = Mf × v / I**

v est la distance de la fibre neutre à la fibre la plus éloignée, I le **moment quadratique** de la section (en mm⁴).

| Section | Moment quadratique I |
| Rectangle, base b, hauteur h (fléchi dans le sens de h) | b × h³ / 12 |

> La hauteur compte **au cube**. Tourner une planche sur chant multiplie I par le carré du rapport hauteur / largeur : c’est tout le secret des poutres en I, qui placent la matière loin de la fibre neutre, là où elle travaille.

## La flèche
La **flèche** est le déplacement maximal de la poutre. Deux cas à connaître :

| Cas | Moment fléchissant maximal | Flèche maximale |
| Deux appuis simples, charge F au milieu, portée L | F × L / 4 | F × L³ / (48 × E × I) |
| Poutre encastrée (console), charge F au bout, longueur L | F × L | F × L³ / (3 × E × I) |

La flèche croît comme le **cube de la portée** : doubler la longueur multiplie la flèche par 8.

## La méthode
1. Modéliser la poutre : appuis, charges, portée.
2. Calculer le moment fléchissant maximal.
3. Calculer I et v pour la section.
4. Vérifier la **résistance** : σ_max ≤ Re / s.
5. Vérifier la **déformation** : flèche ≤ flèche admise par le cahier des charges.

## Exemple travaillé
Une poutre en acier (E = 210 000 MPa) de section 20 × 60 mm, posée sur chant (h = 60 mm) sur deux appuis distants de 1 m, porte 1 000 N en son milieu.
- I = 20 × 60³ / 12 = **360 000 mm⁴** ; posée à plat, on n’aurait que 60 × 20³ / 12 = 40 000 mm⁴, neuf fois moins.
- Mf max = 1 000 × 1 000 / 4 = 250 000 N·mm ; v = 30 mm ; σ_max = 250 000 × 30 / 360 000 ≈ **21 MPa**.
- Flèche = 1 000 × 1 000³ / (48 × 210 000 × 360 000) ≈ **0,28 mm**.`,
          },
          questions: [
            ['Où la contrainte est-elle nulle dans une poutre fléchie ?', ['Sur les fibres du haut', 'Sur les fibres du bas', 'Sur la fibre neutre', 'Aux appuis seulement'], 2, 'La fibre neutre n’est ni tendue ni comprimée.'],
            ['Pour une poutre sur deux appuis chargée vers le bas, les fibres du bas sont…', ['Tendues', 'Comprimées', 'Sans contrainte', 'Cisaillées uniquement'], 0, 'Le bas s’allonge, le haut se raccourcit.'],
            ['Quel est le moment quadratique d’un rectangle de base b et de hauteur h ?', ['b × h / 12', 'b² × h / 12', 'b × h² / 6', 'b × h³ / 12'], 3, 'La hauteur, dans le sens de la flexion, compte au cube.'],
            ['Pourquoi une planche posée sur chant plie-t-elle moins qu’à plat ?', ['Parce qu’elle est plus lourde', 'Parce que son moment quadratique est bien plus grand', 'Parce que le matériau change', 'Parce que la charge diminue'], 1, 'La hauteur passe dans le sens de la flexion, et elle compte au cube.'],
            ['Doubler la portée d’une poutre sur deux appuis, à charge égale, multiplie sa flèche par…', ['2', '4', '8', '16'], 2, 'La flèche dépend du cube de la portée.'],
            ['Quelle est la flèche d’une poutre sur deux appuis chargée au milieu ?', ['F × L³ / (48 × E × I)', 'F × L / 4', 'F × L³ / (3 × E × I)', 'F / (E × I)'], 0, 'La seconde formule en L³ concerne la console chargée en bout.'],
            ['Le moment fléchissant maximal d’une console de longueur L chargée en bout par F vaut…', ['F × L / 4', 'F / L', 'F × L²', 'F × L'], 3, 'Il est maximal à l’encastrement.'],
            ['Pourquoi les poutres en I sont-elles efficaces ?', ['Elles placent la matière loin de la fibre neutre', 'Elles sont plus lourdes', 'Elles suppriment la flexion', 'Elles sont en aluminium'], 0, 'C’est là que la matière travaille le plus : on gagne en I sans alourdir.'],
            ['Une poutre peut résister sans rompre mais être refusée à cause de sa flèche.', ['Vrai', 'Faux'], 0, 'Le cahier des charges limite aussi la déformation, pas seulement la rupture.'],
            ['Comment s’écrit la contrainte maximale en flexion ?', ['σ = Mf × I / v', 'σ = Mf × v / I', 'σ = Mf / (v × I)', 'σ = I × v'], 1, 'v est la distance de la fibre neutre à la fibre extrême.'],
            ['Augmenter le module d’Young du matériau augmente la flèche.', ['Vrai', 'Faux'], 1, 'E est au dénominateur : un matériau plus raide fléchit moins.'],
            ['Une section 10 × 40 mm est fléchie dans le sens des 40 mm. Son moment quadratique vaut environ…', ['53 333 mm⁴', '3 333 mm⁴', '400 mm⁴', '160 000 mm⁴'], 0, 'I = 10 × 40³ / 12 = 640 000 / 12 ≈ 53 333 mm⁴.'],
          ],
        },
        // ---- Chapitre 4 : systèmes asservis ---------------------------------
        {
          titre: 'Schéma-bloc et précision d’une boucle',
          axe: 'Systèmes asservis',
          lecon: {
            titre: 'Calculer ce que la boucle corrige',
            cours: `La fiche « Systèmes asservis » t’a montré ce qu’est une boucle. Celle-ci t’apprend à la **calculer** : à partir d’un schéma-bloc, prévoir la valeur finale de la sortie et l’erreur qui reste.

## Les éléments d’un schéma-bloc
| Élément | Ce qu’il représente |
| Bloc | Un composant qui transforme une entrée en sortie ; on y écrit son **gain** |
| Comparateur | Un cercle qui calcule consigne − mesure |
| Flèche | Une grandeur qui circule |
| Point de prélèvement | Une grandeur envoyée vers deux blocs à la fois |

En régime établi, on caractérise chaque bloc par son **gain statique** : le rapport sortie / entrée une fois tout stabilisé.

## Les règles de calcul
| Montage | Gain équivalent |
| Blocs en **série** (gains A1 et A2) | A1 × A2 |
| Boucle fermée, chaîne directe A, **retour unitaire** | A / (1 + A) |
| Boucle fermée, chaîne directe A, retour de gain B | A / (1 + A × B) |

## L’erreur statique d’une boucle à correcteur proportionnel
Avec un retour unitaire et une chaîne directe de gain total A (correcteur × système), l’erreur relative qui reste vaut :

**ε = 1 / (1 + A)**

| Gain de la chaîne directe A | Sortie / consigne | Erreur restante |
| 1 | 0,5 | 50 % |
| 9 | 0,9 | 10 % |
| 99 | 0,99 | 1 % |

> Plus le gain est élevé, plus la boucle est précise — mais un gain trop fort rend le système oscillant, voire instable. D’où l’action intégrale, qui annule l’erreur sans pousser le gain à l’infini.

## Deux conséquences à retenir
1. Une **perturbation** (une charge, une pente) agissant dans la boucle voit son effet divisé par environ 1 + A.
2. La boucle ne corrige que ce qu’elle **mesure** : si le capteur se trompe de 2 %, la sortie se trompe de 2 %, quel que soit le gain. Une boucle n’est jamais plus juste que son capteur.

## Exemple travaillé
Une régulation de vitesse comporte un correcteur proportionnel de gain Kp, un moteur de gain statique 0,5 et un capteur à retour unitaire. On veut au plus 5 % d’erreur.
- Il faut 1 / (1 + A) ≤ 0,05, donc 1 + A ≥ 20, soit A ≥ 19.
- A = Kp × 0,5, donc **Kp ≥ 38**.
- Avec Kp = 38, pour une consigne de 100 rad/s, la vitesse se stabilise à 100 × 19 / 20 = **95 rad/s**.`,
          },
          questions: [
            ['Que calcule le comparateur d’un schéma-bloc ?', ['La somme de la consigne et de la mesure', 'La différence consigne − mesure', 'Le produit des gains', 'La puissance du moteur'], 1, 'Cette différence est l’erreur que le correcteur va traiter.'],
            ['Deux blocs en série de gains 4 et 5 équivalent à un bloc de gain…', ['9', '1,25', '20', '0,8'], 2, 'En série, les gains se multiplient.'],
            ['Quel est le gain d’une boucle fermée à retour unitaire de chaîne directe A ?', ['A / (1 + A)', 'A × (1 + A)', '1 / A', 'A − 1'], 0, 'C’est la formule de Black dans le cas d’un retour unitaire.'],
            ['Avec A = 9 et un retour unitaire, quelle part de la consigne atteint la sortie ?', ['50 %', '99 %', '9 %', '90 %'], 3, '9 / (1 + 9) = 0,9.'],
            ['Que vaut l’erreur relative restante pour A = 99 ?', ['10 %', '1 %', '0 %', '99 %'], 1, 'ε = 1 / (1 + 99) = 1 %.'],
            ['Augmenter le gain proportionnel sans limite ne pose aucun problème.', ['Vrai', 'Faux'], 1, 'Un gain trop fort fait osciller le système, voire le rend instable.'],
            ['Avec un retour de gain B, le gain de la boucle fermée vaut…', ['A / (1 + B)', 'A × B', 'A / (1 + A × B)', 'B / (1 + A)'], 2, 'On retrouve A / (1 + A) quand B = 1.'],
            ['Un capteur qui surestime la mesure de 2 %…', ['Fausse la sortie de 2 %, quel que soit le gain', 'Est compensé par un gain élevé', 'N’a aucun effet', 'Rend la boucle instable'], 0, 'La boucle rend la mesure égale à la consigne : si la mesure est fausse, la sortie l’est aussi.'],
            ['Quelle action du correcteur annule l’erreur statique ?', ['L’action proportionnelle', 'L’action dérivée', 'Le point de prélèvement', 'L’action intégrale'], 3, 'Elle accumule l’erreur tant qu’elle n’est pas nulle.'],
            ['Pour une erreur d’au plus 10 % avec un retour unitaire, il faut un gain de chaîne directe d’au moins…', ['9', '10', '1', '90'], 0, '1 / (1 + A) ≤ 0,1 donne A ≥ 9.'],
            ['L’effet d’une perturbation dans la boucle est réduit par la boucle fermée.', ['Vrai', 'Faux'], 0, 'Il est divisé par environ 1 + A.'],
            ['Que représente le gain statique d’un bloc ?', ['Sa vitesse de réponse', 'Le rapport sortie / entrée une fois stabilisé', 'Son coût', 'Son nombre d’entrées'], 1, 'Il décrit le comportement en régime établi.'],
          ],
        },
        {
          titre: 'Le modèle du premier ordre',
          axe: 'Systèmes asservis',
          lecon: {
            titre: 'Lire une constante de temps',
            cours: `Un moteur qui démarre, une résistance qui chauffe, un condensateur qui se charge : ces systèmes n’ont rien en commun, et pourtant leurs courbes ont exactement la même forme. C’est le **premier ordre**, le modèle le plus utilisé en SI.

## La réponse à un échelon
On applique brusquement une entrée constante E0 (un échelon). La sortie monte **sans dépasser**, vite au début puis de plus en plus lentement :

s(t) = K × E0 × (1 − e^(−t/τ))

| Paramètre | Nom | Ce qu’il fixe |
| K | Gain statique | La valeur finale : s_final = K × E0 |
| τ | Constante de temps (en s) | La rapidité |

## Les repères à connaître par cœur
| Instant | Part de la valeur finale atteinte |
| t = τ | 63 % |
| t = 3τ | 95 % : c’est le **temps de réponse à 5 %** |
| t = 5τ | 99 % |

> La **tangente à l’origine** coupe la valeur finale exactement à t = τ. C’est la deuxième façon de lire τ sur une courbe.

## Identifier un système à partir d’une courbe
1. Vérifier l’allure : départ avec une pente non nulle, pas de dépassement, stabilisation.
2. Lire la **valeur finale** et calculer K = Δs / Δe.
3. Chercher l’instant où la sortie atteint **63 %** de sa variation : c’est τ.
4. Contrôler : à 3τ, la sortie doit être à 95 %.

## Des systèmes du premier ordre
| Système | Entrée → sortie | Constante de temps |
| Circuit RC | Tension → tension du condensateur | τ = R × C |
| Moteur à courant continu (inductance négligée) | Tension → vitesse | Dépend de l’inertie et du moteur |
| Four, radiateur | Puissance → température | Souvent plusieurs minutes |

> Un premier ordre ne dépasse **jamais** sa valeur finale. Si une courbe dépasse puis revient, le modèle est au moins du deuxième ordre.

## Exemple travaillé
Un moteur, alimenté par un échelon de 12 V, se stabilise à 600 rad/s. La vitesse atteint 378 rad/s au bout de 0,2 s.
- Gain statique : K = 600 / 12 = **50 rad/s par volt**.
- 378 / 600 = 0,63, donc **τ = 0,2 s**.
- Temps de réponse à 5 % : 3 × 0,2 = **0,6 s**.
- Sous 6 V, le même moteur se stabiliserait à 300 rad/s, avec la même constante de temps.`,
          },
          questions: [
            ['Quelle part de sa valeur finale un premier ordre atteint-il à t = τ ?', ['50 %', '63 %', '95 %', '100 %'], 1, 'C’est la définition pratique de la constante de temps.'],
            ['Le temps de réponse à 5 % d’un premier ordre vaut…', ['τ', '2τ', '3τ', '5τ'], 2, 'À 3τ, la sortie atteint 95 % de sa valeur finale.'],
            ['Un premier ordre peut dépasser sa valeur finale.', ['Vrai', 'Faux'], 1, 'Sa réponse indicielle monte sans jamais dépasser.'],
            ['Comment calcule-t-on le gain statique K ?', ['Δs / Δe en régime établi', 'τ × E0', 'La pente à l’origine', 'La valeur à t = τ'], 0, 'C’est le rapport des variations une fois stabilisé.'],
            ['Où la tangente à l’origine coupe-t-elle la valeur finale ?', ['À t = 3τ', 'À t = 0', 'Jamais', 'À t = τ'], 3, 'C’est la seconde méthode de lecture de τ.'],
            ['Quelle est la constante de temps d’un circuit RC ?', ['R + C', 'R × C', 'R / C', '1 / (R × C)'], 1, 'Avec R en ohms et C en farads, τ est en secondes.'],
            ['Un système se stabilise à 80 °C pour une puissance de 400 W, en partant de 20 °C. Son gain statique vaut…', ['0,2 °C/W', '5 °C/W', '0,15 °C/W', '60 °C/W'], 2, 'K = Δs / Δe = (80 − 20) / 400 = 0,15 °C/W.'],
            ['Une sortie qui atteint 95 % de sa valeur finale en 1,5 s a une constante de temps de…', ['0,5 s', '1,5 s', '4,5 s', '3 s'], 0, 't5% = 3τ, donc τ = 1,5 / 3 = 0,5 s.'],
            ['Si l’on double l’échelon d’entrée d’un premier ordre, sa constante de temps…', ['Double', 'Est divisée par deux', 'Quadruple', 'Ne change pas'], 3, 'Seule la valeur finale double ; la rapidité reste la même.'],
            ['Quelle allure trahit un modèle d’ordre au moins égal à deux ?', ['Une montée sans dépassement', 'Un dépassement suivi d’un retour', 'Une valeur finale nulle', 'Une pente initiale non nulle'], 1, 'Un premier ordre ne dépasse jamais.'],
            ['À t = 5τ, un premier ordre a pratiquement atteint sa valeur finale.', ['Vrai', 'Faux'], 0, 'Il en est à 99 %.'],
            ['Un moteur a K = 40 rad/s par volt. Sous 5 V, sa vitesse finale vaut…', ['8 rad/s', '45 rad/s', '200 rad/s', '35 rad/s'], 2, 's_final = K × E0 = 40 × 5 = 200 rad/s.'],
          ],
        },
        // ---- Chapitre 5 : chaîne d’information ------------------------------
        {
          titre: 'Choisir un capteur et numériser la mesure',
          axe: 'Chaîne d’information',
          lecon: {
            titre: 'De la grandeur physique au nombre',
            cours: `Un système ne peut commander que ce qu’il mesure. Choisir un capteur, c’est décider de la qualité de tout ce qui suit : un bon correcteur ne rattrapera jamais une mesure médiocre.

## Trois familles de capteurs
| Famille | Ce qu’il délivre | Exemples |
| **Tout ou rien** (TOR) | Deux états : 0 ou 1 | Fin de course, interrupteur à lame souple, détecteur de présence |
| **Analogique** | Une tension ou un courant qui varie continûment | Thermistance, potentiomètre, jauge de déformation |
| **Numérique** | Des nombres, ou des impulsions à compter | Codeur incrémental, capteur à liaison I2C |

## Les caractéristiques à lire dans une documentation
| Caractéristique | Question qu’elle règle |
| Étendue de mesure | Mesure-t-il toute la plage utile ? |
| Sensibilité | De combien varie sa sortie quand la grandeur varie d’une unité ? |
| Résolution | Quelle est la plus petite variation détectable ? |
| Précision | De combien peut-il se tromper ? |
| Temps de réponse | Suit-il assez vite les variations ? |

> Résolution et précision ne sont pas la même chose : un affichage au centième de degré peut être faux de deux degrés.

## Le conditionnement
Le signal d’un capteur est rarement prêt à l’emploi. Le **conditionnement** l’adapte à l’entrée du convertisseur :
1. Transformer une résistance en tension (pont diviseur).
2. **Amplifier** pour occuper toute la plage du convertisseur.
3. **Filtrer** les parasites.

## La conversion analogique-numérique
Un convertisseur (CAN) sur n bits, de pleine échelle U_ref, découpe la plage en 2^n niveaux.

= q = U_ref / 2^n (le quantum : la plus petite variation codée)

Le nombre obtenu vaut environ N = U / q, arrondi à l’entier inférieur.

## Le codeur incrémental
Un disque percé passe devant un capteur optique et produit des impulsions : 500 impulsions par tour donnent une résolution de 360 / 500 = **0,72°**. Deux voies décalées permettent en plus de connaître le **sens** de rotation.

## Exemple travaillé
Un capteur de température délivre 10 mV/°C sur 0 – 100 °C, soit 0 à 1 V. Il est relié à un CAN 10 bits de 5 V.
- Quantum : q = 5 / 1 024 ≈ **4,9 mV**, soit environ **0,49 °C** : la plage n’utilise qu’un cinquième du convertisseur.
- Avec un amplificateur de gain 5, la plage devient 0 – 5 V et la résolution passe à environ **0,1 °C**.

!> Amplifier au-delà de la pleine échelle sature le convertisseur : toutes les valeurs hautes donnent le même nombre.`,
          },
          questions: [
            ['Un capteur de fin de course est un capteur…', ['Analogique', 'Numérique à liaison série', 'Tout ou rien', 'De température'], 2, 'Il ne délivre que deux états : atteint ou non atteint.'],
            ['Que vaut le quantum d’un CAN 8 bits de pleine échelle 5 V ?', ['Environ 19,5 mV', '5 mV', '0,625 V', '40 mV'], 0, 'q = 5 / 2^8 = 5 / 256 ≈ 19,5 mV.'],
            ['Combien de niveaux distingue un CAN 12 bits ?', ['12', '1 024', '144', '4 096'], 3, '2^12 = 4 096 niveaux.'],
            ['La résolution d’un capteur garantit sa précision.', ['Vrai', 'Faux'], 1, 'On peut afficher beaucoup de chiffres et se tromper largement.'],
            ['Que désigne la sensibilité d’un capteur ?', ['La variation de sa sortie pour une variation unitaire de la grandeur', 'Sa plage de mesure', 'Son prix', 'Sa durée de vie'], 0, 'Par exemple 10 mV par degré Celsius.'],
            ['Pourquoi amplifie-t-on le signal d’un capteur avant le CAN ?', ['Pour réduire le bruit à zéro', 'Pour occuper toute la plage du convertisseur et gagner en résolution', 'Pour changer la grandeur mesurée', 'Pour alimenter le capteur'], 1, 'Un signal qui n’utilise qu’une petite partie de la plage gaspille des niveaux.'],
            ['Un codeur de 1 000 impulsions par tour a une résolution angulaire de…', ['1°', '0,1°', '0,36°', '3,6°'], 2, '360 / 1 000 = 0,36°.'],
            ['À quoi servent les deux voies décalées d’un codeur incrémental ?', ['À doubler la tension', 'À mesurer la température', 'À réduire la consommation', 'À connaître le sens de rotation'], 3, 'L’ordre dans lequel les voies changent d’état donne le sens.'],
            ['Que se passe-t-il si le signal dépasse la pleine échelle du CAN ?', ['Le convertisseur sature et renvoie toujours la valeur maximale', 'La résolution s’améliore', 'Le capteur s’éteint', 'Rien de particulier'], 0, 'Au-delà de la pleine échelle, toutes les valeurs donnent le même nombre.'],
            ['Quelle étape du conditionnement élimine les parasites ?', ['L’amplification', 'La conversion', 'Le filtrage', 'Le codage'], 2, 'Un filtre atténue les variations rapides indésirables.'],
            ['Une thermistance est un capteur analogique.', ['Vrai', 'Faux'], 0, 'Sa résistance varie continûment avec la température.'],
            ['Un CAN 10 bits de 5 V reçoit 2,5 V. Le nombre obtenu vaut environ…', ['250', '512', '1 023', '2 500'], 1, 'N = 2,5 / (5 / 1 024) = 512.'],
          ],
        },
        {
          titre: 'Les bus de communication d’un système embarqué',
          axe: 'Chaîne d’information',
          lecon: {
            titre: 'UART, I2C et SPI',
            cours: `Dans un robot, le microcontrôleur parle à un écran, à une centrale inertielle, à un module radio. Tous ces échanges passent par quelques fils et suivent des règles précises : les **bus de communication**.

## Série ou parallèle, synchrone ou asynchrone
| Choix | Ce que ça veut dire | Conséquence |
| **Parallèle** | Plusieurs bits envoyés en même temps, un fil par bit | Rapide mais encombrant |
| **Série** | Les bits envoyés l’un après l’autre sur un même fil | Peu de fils : la norme dans l’embarqué |
| **Synchrone** | Une horloge partagée cadence les bits | Pas besoin de convenir d’un débit |
| **Asynchrone** | Pas d’horloge : émetteur et récepteur conviennent du débit | Des bits de départ et d’arrêt encadrent chaque octet |

## Les trois bus à connaître
| Bus | Fils | Type | Ce qui le caractérise |
| **UART** (liaison série) | TX, RX, masse | Asynchrone, point à point | Débit convenu, par exemple 9 600 bauds ; TX de l’un sur RX de l’autre |
| **I2C** | SDA (données), SCL (horloge) | Synchrone, un maître, plusieurs esclaves | Chaque esclave a une **adresse** (souvent sur 7 bits) ; accusé de réception |
| **SPI** | MOSI, MISO, SCK, CS | Synchrone, full duplex | Rapide ; un fil de sélection CS par esclave |

> I2C économise les fils (deux pour tout le bus) ; SPI économise le temps (plus rapide, envoi et réception simultanés). Le choix dépend de ce qui manque : des broches ou du débit.

## La trame UART
Chaque octet part encadré :

| Élément | Nombre de bits | Rôle |
| Bit de départ (start) | 1 | Réveille le récepteur |
| Données | 8 | L’octet lui-même, bit de poids faible en premier |
| Parité (facultative) | 0 ou 1 | Détecte une erreur simple |
| Bit d’arrêt (stop) | 1 ou 2 | Termine la trame |

Pour 8 bits de données, il faut donc au moins **10 bits** transmis : le débit utile est plus faible que le débit brut.

!> Relier TX à TX ne marche pas : ce qui sort de l’un doit entrer dans l’autre. On **croise** TX et RX.

## Calculer une durée de transmission
1. Compter les bits réellement envoyés (données + encadrement + adresses).
2. Diviser par le débit en bits par seconde.
3. Comparer au temps disponible dans le cahier des charges.

## Exemple travaillé
On envoie 100 octets par une liaison UART à 9 600 bauds, format 8 bits, sans parité, 1 bit d’arrêt.
- Bits transmis : 100 × 10 = **1 000 bits**.
- Durée : 1 000 / 9 600 ≈ **0,104 s**.
- À 115 200 bauds, la même trame passerait en moins de 9 ms.`,
          },
          questions: [
            ['Dans une liaison série, les bits sont envoyés…', ['Tous en même temps', 'L’un après l’autre sur un même fil', 'Sans aucun fil', 'Uniquement la nuit'], 1, 'C’est ce qui permet de n’utiliser que quelques fils.'],
            ['Quels fils utilise le bus I2C ?', ['SDA et SCL', 'TX et RX', 'MOSI et MISO', 'CS et SCK uniquement'], 0, 'Données et horloge, partagés par tous les composants du bus.'],
            ['Comment un maître I2C désigne-t-il l’esclave avec lequel il veut parler ?', ['Par un fil de sélection dédié', 'Par la couleur du fil', 'Par son adresse', 'Par la tension d’alimentation'], 2, 'Chaque esclave a une adresse unique sur le bus.'],
            ['Une liaison UART est…', ['Synchrone', 'Parallèle', 'Sans fil', 'Asynchrone'], 3, 'Aucune horloge n’est transmise : les deux côtés conviennent du débit.'],
            ['Pour relier deux cartes en UART, on relie TX à TX et RX à RX.', ['Vrai', 'Faux'], 1, 'On croise : le TX de l’une va sur le RX de l’autre.'],
            ['Combien de bits faut-il au minimum pour envoyer un octet en UART (8 bits, sans parité, 1 stop) ?', ['8', '9', '10', '16'], 2, 'Un bit de départ, huit de données, un bit d’arrêt.'],
            ['Quel bus est full duplex et utilise un fil de sélection par esclave ?', ['SPI', 'I2C', 'UART', 'Aucun'], 0, 'MOSI et MISO circulent en même temps ; CS choisit l’esclave.'],
            ['Combien de temps faut-il pour envoyer 1 920 bits à 9 600 bauds ?', ['2 s', '0,5 s', '5 s', '0,2 s'], 3, '1 920 / 9 600 = 0,2 s.'],
            ['À quoi sert le bit de parité ?', ['À détecter une erreur simple de transmission', 'À augmenter le débit', 'À choisir l’esclave', 'À cadencer l’horloge'], 0, 'Il indique si le nombre de 1 transmis est pair ou impair.'],
            ['Pourquoi choisir I2C plutôt que SPI ?', ['Parce qu’il est plus rapide', 'Parce qu’il n’utilise que deux fils pour tout le bus', 'Parce qu’il n’a pas besoin d’horloge', 'Parce qu’il est asynchrone'], 1, 'Il économise les broches ; SPI économise le temps.'],
            ['Le débit utile d’une liaison est égal à son débit brut.', ['Vrai', 'Faux'], 1, 'Les bits d’encadrement et d’adresse ne transportent pas de données.'],
            ['Dans une liaison synchrone, qu’est-ce qui cadence les bits ?', ['Le bit d’arrêt', 'La parité', 'Une horloge partagée', 'L’adresse de l’esclave'], 2, 'SCL en I2C, SCK en SPI.'],
          ],
        },
        {
          titre: 'Programmer le comportement : diagramme d’états',
          axe: 'Chaîne d’information',
          lecon: {
            titre: 'Des états, des transitions, une boucle',
            cours: `Un portail automatique ne « fait » pas une suite d’actions : il est dans un état — fermé, en ouverture, ouvert — et il en change quand un événement survient. Le diagramme d’états décrit exactement cela, et il se traduit presque ligne à ligne en programme.

## Le vocabulaire du diagramme d’états (SysML)
| Élément | Ce qu’il représente | Écriture |
| **État** | Une situation stable du système | Un rectangle arrondi : « Ouvert » |
| **Transition** | Le passage d’un état à un autre | Une flèche |
| **Événement** | Ce qui déclenche la transition | « appui télécommande » |
| **Condition de garde** | Une condition qui doit être vraie | Entre crochets : [obstacle = faux] |
| **Effet** | Une action faite pendant la transition | Après une barre oblique : / allumer feu |
| **État initial** | Le point de départ | Un disque noir |

Dans un état, on peut préciser ce qui se fait à l’entrée (entry), pendant (do) et à la sortie (exit).

> Une transition s’écrit : événement [garde] / effet. Aucun de ces trois éléments n’est obligatoire, mais une transition sans événement ni garde se franchit immédiatement.

## Exemple : le portail automatique
| État de départ | Événement [garde] | État d’arrivée |
| Fermé | appui télécommande | Ouverture |
| Ouverture | fin de course haut atteinte | Ouvert |
| Ouvert | temporisation de 30 s écoulée | Fermeture |
| Fermeture | obstacle détecté | Ouverture |
| Fermeture | fin de course bas atteinte | Fermé |

La ligne « obstacle détecté » est une **exigence de sécurité** : elle se lit immédiatement sur le diagramme, ce qui permet de vérifier qu’elle n’a pas été oubliée.

## Du diagramme au programme
Un microcontrôleur exécute une **boucle infinie**. À chaque tour :
1. **Lire** les entrées (capteurs, boutons).
2. **Décider** : selon l’état courant et les événements, changer d’état.
3. **Commander** les sorties (moteur, voyant) selon l’état.

Chaque état devient un cas d’une structure de choix (« si état = Fermé alors… »), chaque transition un test.

## Scrutation ou interruption
| Méthode | Principe | Quand l’utiliser |
| **Scrutation** | On lit l’entrée à chaque tour de boucle | Événements lents, programme simple |
| **Interruption** | Le matériel suspend le programme dès que l’événement survient | Événements brefs ou urgents : impulsions d’un codeur, arrêt d’urgence |

!> Un bouton mécanique « rebondit » : il envoie plusieurs impulsions en quelques millisecondes. Sans **anti-rebond** (logiciel ou matériel), un seul appui peut déclencher plusieurs transitions.`,
          },
          questions: [
            ['Que représente un état dans un diagramme d’états ?', ['Une action instantanée', 'Une situation stable du système', 'Un capteur', 'Un fil de communication'], 1, 'Le système reste dans un état jusqu’à ce qu’une transition soit franchie.'],
            ['Comment s’écrit une condition de garde ?', ['Entre crochets', 'Entre guillemets', 'Après une barre oblique', 'En majuscules'], 0, 'Par exemple [obstacle = faux].'],
            ['Dans « appui [porte fermée] / allumer voyant », que désigne « allumer voyant » ?', ['L’événement', 'La garde', 'L’état', 'L’effet de la transition'], 3, 'L’effet suit la barre oblique.'],
            ['Quelles sont les trois étapes d’un tour de boucle d’un programme embarqué ?', ['Lire, décider, commander', 'Dessiner, coder, vendre', 'Compiler, effacer, redémarrer', 'Mesurer, stocker, imprimer'], 0, 'Lecture des entrées, choix de l’état, commande des sorties.'],
            ['Quand utiliser une interruption plutôt que la scrutation ?', ['Pour lire un bouton une fois par jour', 'Pour afficher un message', 'Pour un événement bref ou urgent', 'Jamais'], 2, 'L’interruption réagit même si la boucle est occupée ailleurs.'],
            ['Un bouton mécanique peut produire plusieurs impulsions pour un seul appui.', ['Vrai', 'Faux'], 0, 'C’est le rebond ; on le traite par un anti-rebond.'],
            ['Dans le portail, quelle transition traduit une exigence de sécurité ?', ['Fermé vers Ouverture sur appui', 'Fermeture vers Ouverture si obstacle détecté', 'Ouvert vers Fermeture après 30 s', 'Ouverture vers Ouvert en fin de course'], 1, 'Le portail doit se rouvrir au lieu d’écraser l’obstacle.'],
            ['Comment représente-t-on l’état initial ?', ['Par un carré vide', 'Par une flèche en pointillés', 'Par une étoile', 'Par un disque noir'], 3, 'C’est de là que part la première transition.'],
            ['Un diagramme d’états se traduit facilement en structure de choix dans un programme.', ['Vrai', 'Faux'], 0, 'Chaque état devient un cas, chaque transition un test.'],
            ['Que se passe-t-il pour une transition sans événement ni garde ?', ['Elle ne se franchit jamais', 'Elle se franchit immédiatement', 'Elle bloque le programme', 'Elle efface l’état'], 1, 'Rien ne la retient : elle est franchie dès que l’état est atteint.'],
            ['Que signifie « entry » dans un état ?', ['L’action exécutée en sortant de l’état', 'Le nom du capteur', 'L’action exécutée en entrant dans l’état', 'La garde de la transition'], 2, 'On trouve aussi « do » (pendant) et « exit » (à la sortie).'],
            ['Pourquoi lire les impulsions d’un codeur rapide par interruption ?', ['Pour économiser de la mémoire', 'Pour changer de couleur', 'Parce que la scrutation est interdite', 'Pour ne manquer aucune impulsion'], 3, 'Une impulsion brève peut passer entre deux lectures par scrutation.'],
          ],
        },
        {
          titre: 'Objets connectés et réseaux sans fil',
          axe: 'Chaîne d’information',
          lecon: {
            titre: 'Portée, débit, consommation : choisir',
            cours: `Une station météo dans un champ, un capteur de place de parking, un bracelet de sport : un objet connecté mesure, transmet, puis se rendort. Tout l’art est de transmettre assez loin, assez vite, en consommant presque rien.

## L’architecture d’une solution connectée
~ Objet (capteur + microcontrôleur + radio) → Passerelle → Serveur → Application

| Maillon | Son rôle |
| Objet | Mesurer et émettre, le plus sobrement possible |
| Passerelle | Recevoir la radio et relayer vers Internet |
| Serveur | Stocker, traiter, déclencher des alertes |
| Application | Montrer les données à l’utilisateur |

## Le triangle portée, débit, consommation
| Technologie | Portée typique | Débit | Consommation |
| **Bluetooth Low Energy** | Une dizaine à quelques dizaines de mètres | Moyen (autour du Mbit/s) | Très faible |
| **Wi-Fi** | Quelques dizaines de mètres | Élevé | Élevée |
| **LoRa** | Plusieurs kilomètres | Très faible | Très faible |
| **Réseau cellulaire** | Couverture nationale | Élevé | Élevée, abonnement |

> On ne peut pas tout avoir : longue portée et faible consommation se paient en débit. Un capteur de température qui envoie quelques octets par heure n’a pas besoin du Wi-Fi.

## Le secret de l’autonomie : dormir
Un objet sur pile passe l’essentiel de son temps en **veille**. Sa consommation moyenne dépend du temps passé éveillé :

= I_moy = I_actif × (t_actif / T) + I_veille

## Publier et s’abonner
Beaucoup d’objets utilisent un protocole de type **publication / abonnement** (MQTT par exemple) : l’objet **publie** sa mesure sur un **sujet** (« serre/temperature ») auprès d’un **courtier** (broker), et toute application **abonnée** à ce sujet la reçoit. L’objet n’a pas besoin de connaître ses destinataires.

## La sécurité, dès la conception
| Risque | Parade |
| Mot de passe par défaut jamais changé | Identifiant unique par objet |
| Données interceptées | Chiffrement des échanges |
| Faux objet qui envoie de fausses mesures | Authentification |
| Faille découverte après la vente | Mises à jour à distance |

## Exemple travaillé
Un capteur consomme 20 mA pendant 1 s toutes les 10 minutes pour mesurer et émettre, et 10 µA le reste du temps. Il est alimenté par une pile de 2 000 mAh.
- Part active : 20 × 1 / 600 ≈ 0,033 mA.
- Consommation moyenne : 0,033 + 0,010 ≈ **0,043 mA**.
- Autonomie : 2 000 / 0,043 ≈ 46 000 h, soit plus de **5 ans**.

La veille, pourtant minuscule, compte pour près d’un quart de la consommation : c’est elle qu’on optimise ensuite.`,
          },
          questions: [
            ['Quel est le rôle d’une passerelle dans une solution connectée ?', ['Mesurer la température', 'Relayer les messages radio vers Internet', 'Afficher les données', 'Recharger les objets'], 1, 'Elle fait le lien entre le réseau radio local et le serveur.'],
            ['Quelle technologie offre une portée de plusieurs kilomètres à très faible consommation ?', ['Le Wi-Fi', 'Le Bluetooth Low Energy', 'LoRa', 'L’USB'], 2, 'En échange, son débit est très faible.'],
            ['Longue portée et faible consommation se paient en…', ['Débit', 'Poids', 'Couleur', 'Tension'], 0, 'On ne peut pas avoir à la fois portée, débit et sobriété.'],
            ['Pourquoi un objet connecté passe-t-il l’essentiel de son temps en veille ?', ['Pour chauffer moins', 'Pour recevoir plus de messages', 'Pour augmenter sa portée', 'Pour économiser son énergie'], 3, 'La consommation moyenne dépend surtout du temps passé éveillé.'],
            ['Dans un protocole de publication / abonnement, l’objet doit connaître tous ses destinataires.', ['Vrai', 'Faux'], 1, 'Il publie sur un sujet auprès du courtier ; les abonnés reçoivent sans qu’il les connaisse.'],
            ['Comment s’appelle l’intermédiaire qui reçoit et redistribue les messages publiés ?', ['Le courtier (broker)', 'Le capteur', 'Le quantum', 'Le pont en H'], 0, 'Il fait circuler chaque message vers les abonnés du sujet.'],
            ['Quelle parade protège contre l’interception des données ?', ['Un mot de passe par défaut', 'Une pile plus grosse', 'Le chiffrement des échanges', 'Une antenne plus longue'], 2, 'Les données interceptées restent illisibles sans la clé.'],
            ['Un objet consomme 10 mA pendant 6 s par minute, et rien le reste du temps. Sa consommation moyenne vaut…', ['10 mA', '0,6 mA', '6 mA', '1 mA'], 3, '10 × 6 / 60 = 1 mA.'],
            ['Le Wi-Fi est la technologie la plus sobre pour un capteur sur pile.', ['Vrai', 'Faux'], 1, 'Son débit est élevé, mais sa consommation aussi.'],
            ['Une pile de 1 000 mAh alimente un objet qui consomme en moyenne 0,1 mA. Son autonomie vaut…', ['10 000 h', '100 h', '1 000 h', '100 000 h'], 0, '1 000 / 0,1 = 10 000 h, soit plus d’un an.'],
            ['Pourquoi prévoir des mises à jour à distance ?', ['Pour corriger une faille découverte après la vente', 'Pour augmenter la portée radio', 'Pour recharger la pile', 'Pour changer de sujet MQTT'], 0, 'Un objet qu’on ne peut plus corriger reste vulnérable toute sa vie.'],
            ['La consommation en veille peut peser lourd dans la consommation moyenne.', ['Vrai', 'Faux'], 0, 'L’objet y passe presque tout son temps.'],
          ],
        },
        {
          titre: 'Intelligence artificielle et apprentissage',
          axe: 'Chaîne d’information',
          lecon: {
            titre: 'Apprendre une règle à partir d’exemples',
            cours: `Écrire à la main la règle qui distingue une pièce fissurée d’une pièce saine, pixel par pixel, est presque impossible. On peut en revanche montrer à un programme des centaines d’exemples, et le laisser trouver la règle. C’est l’**apprentissage automatique**.

## Programmer ou faire apprendre
| | Programme classique | Apprentissage automatique |
| Ce qu’on fournit | Les règles | Des exemples |
| Ce qu’on obtient | Des réponses | Un modèle qui produit des réponses |
| Adapté quand | La règle est connue et simple | La règle est floue ou trop complexe à écrire |

## Supervisé ou non
| Type | Données | Exemple de tâche |
| **Supervisé** | Des exemples **étiquetés** (la bonne réponse est connue) | Classer une pièce : conforme ou défectueuse |
| **Non supervisé** | Des exemples sans étiquette | Regrouper des profils d’usage qui se ressemblent |

## Entraîner, puis tester
1. Rassembler des données étiquetées, **représentatives** des cas réels.
2. Les séparer : un **jeu d’entraînement** (par exemple 80 %) et un **jeu de test** (20 %) que le modèle ne verra jamais pendant l’apprentissage.
3. Entraîner sur le premier, **évaluer sur le second**.

> Un modèle évalué sur ses propres données d’entraînement se note lui-même : son score ne prouve rien.

## Un algorithme simple : les k plus proches voisins
Pour classer un nouvel exemple, on cherche les **k exemples connus les plus proches** (selon une distance entre leurs caractéristiques) et on retient la classe **majoritaire** parmi eux. On choisit souvent k impair pour éviter les égalités à deux classes.

## Les deux pièges
| Piège | Symptôme | Cause |
| **Surapprentissage** | Excellent à l’entraînement, mauvais au test | Le modèle a appris les exemples par cœur, bruit compris |
| **Biais** | Erreurs systématiques sur certains cas | Des données qui ne représentent pas tous les cas réels |

## Évaluer : la matrice de confusion
| | Prédit défectueux | Prédit conforme |
| Réellement défectueux | Vrais positifs | **Faux négatifs** |
| Réellement conforme | Faux positifs | Vrais négatifs |

## Exemple travaillé
Sur 100 pièces de test, un modèle donne 45 vrais positifs, 5 faux négatifs, 40 vrais négatifs et 10 faux positifs.
- Exactitude : (45 + 40) / 100 = **85 %**.
- Mais 5 pièces défectueuses sont parties chez le client. Dans l’industrie, un **faux négatif** coûte souvent bien plus cher qu’un faux positif (une pièce saine revérifiée) : on règle le modèle en conséquence, quitte à perdre un peu d’exactitude.`,
          },
          questions: [
            ['Que fournit-on à un algorithme d’apprentissage supervisé ?', ['Des règles écrites à la main', 'Des exemples étiquetés', 'Uniquement des images floues', 'Un schéma électrique'], 1, 'Chaque exemple est accompagné de la bonne réponse.'],
            ['Pourquoi garde-t-on un jeu de test séparé ?', ['Pour évaluer le modèle sur des données qu’il n’a jamais vues', 'Pour entraîner plus vite', 'Pour réduire la taille du modèle', 'Pour supprimer les erreurs'], 0, 'Sinon, le modèle se note sur ce qu’il a appris par cœur.'],
            ['Un modèle excellent à l’entraînement mais mauvais au test souffre de…', ['Biais de mesure', 'Sous-alimentation', 'Surapprentissage', 'Saturation du CAN'], 2, 'Il a appris les exemples, bruit compris, au lieu de la règle générale.'],
            ['Comment l’algorithme des k plus proches voisins classe-t-il un nouvel exemple ?', ['Au hasard', 'Selon le premier exemple de la liste', 'Selon la moyenne des étiquettes', 'Selon la classe majoritaire parmi ses k voisins les plus proches'], 3, 'Il compare les distances aux exemples connus.'],
            ['Pourquoi choisit-on souvent k impair avec deux classes ?', ['Pour éviter les égalités de vote', 'Pour aller plus vite', 'Parce que c’est obligatoire', 'Pour réduire le biais'], 0, 'Avec k pair, le vote peut se partager à égalité.'],
            ['Un biais dans les données d’entraînement peut produire des erreurs systématiques.', ['Vrai', 'Faux'], 0, 'Si certains cas manquent, le modèle se trompe précisément sur eux.'],
            ['Dans un tri de pièces, que désigne un faux négatif ?', ['Une pièce conforme déclarée défectueuse', 'Une pièce défectueuse déclarée conforme', 'Une pièce conforme déclarée conforme', 'Une pièce sans étiquette'], 1, 'C’est la pièce défectueuse que le modèle a laissé passer.'],
            ['Sur 200 pièces, un modèle en classe correctement 170. Son exactitude vaut…', ['17 %', '30 %', '70 %', '85 %'], 3, '170 / 200 = 0,85.'],
            ['Quand l’apprentissage automatique est-il plus adapté qu’un programme classique ?', ['Quand la règle est simple et connue', 'Quand on n’a aucune donnée', 'Quand la règle est trop complexe à écrire', 'Jamais dans l’industrie'], 2, 'On fait alors apprendre la règle à partir d’exemples.'],
            ['Un modèle évalué sur ses propres données d’entraînement donne une mesure fiable de ses performances.', ['Vrai', 'Faux'], 1, 'Il faut un jeu de test indépendant.'],
            ['Regrouper des profils d’usage sans étiquette relève de l’apprentissage…', ['Supervisé', 'Par renforcement uniquement', 'Manuel', 'Non supervisé'], 3, 'Aucune bonne réponse n’est fournie : le modèle cherche des ressemblances.'],
            ['Pourquoi accepter parfois moins d’exactitude pour réduire les faux négatifs ?', ['Parce qu’un défaut livré au client coûte plus cher qu’une revérification', 'Parce que l’exactitude ne compte jamais', 'Pour accélérer l’entraînement', 'Pour réduire la taille des données'], 0, 'Toutes les erreurs n’ont pas le même coût.'],
          ],
        },
        // ---- Chapitre 6 : projet et épreuves --------------------------------
        {
          titre: 'Réussir l’épreuve écrite de SI',
          axe: 'Projet et épreuves',
          lecon: {
            titre: 'Quatre heures, deux parties, une méthode',
            cours: `L’épreuve écrite de spécialité ne récompense pas ceux qui connaissent toutes les formules : elle récompense ceux qui savent **justifier** un choix et **comparer** un résultat au besoin. Voici comment elle est construite et comment l’aborder.

## Le format
| Élément | Ce qu’il faut savoir |
| Durée totale | **4 heures** |
| Partie sciences de l’ingénieur | Environ **3 heures**, notée sur 20, pondérée à **0,75** |
| Partie sciences physiques | Environ **1 heure**, deux exercices indépendants, notée sur 20, pondérée à **0,25** |
| Coefficient | **16** |
| Support de la partie SI | Un produit réel qui répond à un besoin, avec son cahier des charges, des documents techniques et des documents réponses |
| Calculatrice | Selon ce qu’indique la première page du sujet |

= Note finale = 0,75 × note de SI + 0,25 × note de physique

## Ce que le sujet te fait faire
Le sujet reprend les compétences du programme : **analyser** le système et son besoin, **modéliser** pour prévoir une performance, **exploiter** des résultats d’essais ou de simulation, **conclure** sur les écarts avec le cahier des charges, **communiquer** clairement.

## La méthode en six gestes
1. **Parcourir tout le sujet** pendant les dix premières minutes : repérer les parties, les documents techniques, les documents réponses à rendre.
2. **Lire la présentation du système** et le cahier des charges : c’est la référence de toutes tes conclusions.
3. **Traiter les parties dans l’ordre qui t’avantage** : elles sont souvent en grande partie indépendantes, et des résultats intermédiaires sont parfois donnés.
4. **Justifier chaque calcul** : formule littérale, application numérique, **unité**.
5. **Conclure** chaque partie en comparant ton résultat au niveau exigé : « 0,6 s est inférieur aux 0,8 s exigés : l’exigence est satisfaite ».
6. **Garder dix minutes** pour relire, vérifier les ordres de grandeur et rendre les documents réponses.

> Une question qui demande de « conclure » attend une phrase qui compare un résultat à une exigence. Un chiffre seul ne rapporte presque rien.

!> Oublier de rendre un document réponse, même rempli, c’est perdre tous les points qu’il porte.

## Les réflexes qui font gagner des points
| Réflexe | Pourquoi |
| Écrire la formule avant les nombres | Le raisonnement est noté même si le calcul dérape |
| Convertir en unités du Système international | tr/min en rad/s, mm en m, mAh en Ah |
| Vérifier l’ordre de grandeur | Un robot de 10 kg ne demande pas 3 MW |
| Nommer l’écart et en proposer une cause | C’est ce qu’attend la démarche de l’ingénieur |

## Exemple de conclusion attendue
Question : « Le moteur choisi permet-il de respecter l’exigence de temps de montée ? » Réponse : « Le calcul donne un temps de réponse de 0,6 s, **inférieur** aux 0,8 s du cahier des charges : l’exigence est respectée, avec une marge de 25 %. L’écart avec la mesure (0,7 s) s’explique par les frottements négligés dans le modèle. »`,
          },
          questions: [
            ['Combien de temps dure l’épreuve écrite de spécialité SI ?', ['2 heures', '3 heures', '4 heures', '6 heures'], 2, 'Environ 3 heures de SI et 1 heure de sciences physiques.'],
            ['Quelle pondération reçoit la partie sciences de l’ingénieur ?', ['0,75', '0,25', '0,5', '1'], 0, 'La partie sciences physiques compte pour 0,25.'],
            ['Quel est le coefficient de la spécialité SI au baccalauréat ?', ['6', '10', '12', '16'], 3, 'Comme toutes les spécialités évaluées en épreuve écrite terminale.'],
            ['Combien d’exercices comporte la partie sciences physiques ?', ['Un seul', 'Deux exercices indépendants', 'Quatre exercices liés', 'Aucun'], 1, 'Deux exercices indépendants l’un de l’autre.'],
            ['Que doit contenir une réponse à une question « Conclure » ?', ['Un chiffre seul', 'Un schéma sans légende', 'Une comparaison du résultat avec l’exigence du cahier des charges', 'La formule sans application numérique'], 2, 'On compare, on tranche, et si possible on explique l’écart.'],
            ['Les parties de la partie SI sont souvent en grande partie indépendantes.', ['Vrai', 'Faux'], 0, 'On peut donc avancer même si une question bloque.'],
            ['Que faire dans les dix premières minutes ?', ['Commencer par la dernière question', 'Recopier le sujet', 'Remplir les documents réponses au hasard', 'Parcourir tout le sujet et repérer les documents réponses'], 3, 'On organise son temps avant de s’y lancer.'],
            ['Pourquoi écrire la formule littérale avant l’application numérique ?', ['Parce que le raisonnement est noté même si le calcul dérape', 'Pour occuper la copie', 'Parce que les nombres sont interdits', 'Pour éviter les unités'], 0, 'Le correcteur voit ce que tu as compris.'],
            ['Un document réponse rempli mais non rendu est tout de même corrigé.', ['Vrai', 'Faux'], 1, 'Il doit être joint à la copie, sinon ses points sont perdus.'],
            ['Un élève obtient 12/20 en SI et 16/20 en physique. Sa note d’épreuve vaut…', ['14/20', '13/20', '12/20', '15/20'], 1, '0,75 × 12 + 0,25 × 16 = 9 + 4 = 13.'],
            ['Avant un calcul, une vitesse lue en tr/min doit généralement être convertie en…', ['km/h', 'rad/s', 'tr/s²', 'm'], 1, 'Les formules de puissance et d’énergie utilisent les rad/s.'],
            ['Sur quoi porte la partie SI du sujet ?', ['Un produit réel qui répond à un besoin', 'Une question de cours isolée', 'Un texte philosophique', 'Un programme à écrire de A à Z'], 0, 'On l’analyse, on le modélise et on conclut sur ses performances.'],
          ],
        },
        {
          titre: 'Le projet de Terminale et le Grand oral',
          axe: 'Projet et épreuves',
          lecon: {
            titre: 'Du prototype à la parole',
            cours: `En Terminale, la SI se termine par un **projet** mené en équipe, et bien des élèves de SI en tirent la question qu’ils présentent au **Grand oral**. Les deux se préparent ensemble, mais ne se confondent pas.

## Le projet de 48 heures
Le programme prévoit un projet d’environ **48 heures** en Terminale, conduit en petite équipe. Il s’agit d’imaginer, concevoir et réaliser tout ou partie d’un produit, sous forme de réalisations **numériques** (modèles, simulations, programmes) et **matérielles** (prototype, maquette).

| Étape | Ce qu’on produit |
| Analyse du besoin | Un cahier des charges avec critères et niveaux |
| Recherche et choix de solutions | Des solutions comparées, un choix justifié |
| Conception | Modèles, simulations, dimensionnements |
| Réalisation | Le prototype ou la partie du produit retenue |
| Validation | Des essais, des mesures, la comparaison au cahier des charges |

Des **revues de projet** jalonnent le travail : chacun présente ce qu’il a fait, les écarts constatés et la suite.

> Dans un projet d’équipe, chacun doit pouvoir expliquer SA part — et comment elle s’articule avec celle des autres. C’est ce qu’on attendra de toi à l’oral.

## Le Grand oral
| Élément | Ce qu’il faut savoir |
| Questions | Tu prépares **deux questions**, liées à tes spécialités ; le jury en choisit **une** |
| Préparation | **20 minutes** avant l’épreuve, avec possibilité de faire un support qui n’est pas évalué |
| Temps 1 | **10 minutes** de présentation, debout : tu expliques ton choix, tu développes la question et tu y réponds |
| Temps 2 | **10 minutes** d’échange avec le jury, qui peut t’interroger sur tout le programme de tes spécialités |
| Coefficient | **8** dans la voie générale, à partir de la session 2027 |

## Choisir une bonne question
| Question à éviter | Question qui marche |
| « Qu’est-ce qu’un moteur électrique ? » (une récitation) | « Un vélo électrique peut-il être vraiment plus sobre qu’un scooter ? » (un problème) |
| « Mon projet de robot » (un compte rendu) | « Comment un robot peut-il éviter un obstacle qu’il n’a jamais rencontré ? » |

Une bonne question pose un **problème**, s’appuie sur des notions du programme, et permet une réponse argumentée en dix minutes.

## Relier le projet à l’oral, sans recopier
1. Partir d’une **difficulté réelle** rencontrée pendant le projet.
2. En tirer une **question générale**, qui dépasse ton prototype.
3. Utiliser le projet comme **exemple**, avec un ou deux chiffres parlants (un temps de réponse, un rendement).
4. Préparer les **questions du jury** : limites du modèle, choix écartés, ce que tu referais autrement.

!> Réciter le rapport de projet n’est pas présenter une question : le jury évalue la clarté du raisonnement et la qualité de la parole, pas la quantité de détails techniques.

## Exemple
Au projet, le robot de l’équipe dérivait en ligne droite. Question du Grand oral : « Pourquoi un robot à deux roues ne va-t-il pas droit tout seul ? » La réponse mobilise l’asservissement de vitesse, les capteurs (codeurs) et l’écart entre le modèle et le réel, avec le projet comme illustration.`,
          },
          questions: [
            ['Quelle durée le programme prévoit-il pour le projet de Terminale ?', ['12 heures', '24 heures', '48 heures', '100 heures'], 2, 'En Première, le projet est plus court.'],
            ['Combien de questions l’élève prépare-t-il pour le Grand oral ?', ['Une', 'Deux', 'Trois', 'Cinq'], 1, 'Le jury en choisit une des deux.'],
            ['Combien de temps dure la présentation initiale du Grand oral ?', ['Dix minutes', 'Cinq minutes', 'Vingt minutes', 'Deux minutes'], 0, 'Elle se fait debout ; tu peux t’aider du support préparé pendant les vingt minutes de préparation.'],
            ['Combien de temps dure l’échange avec le jury qui suit la présentation ?', ['5 minutes', '20 minutes', '15 minutes', '10 minutes'], 3, 'Présentation et échange durent dix minutes chacun : vingt minutes d’épreuve en tout.'],
            ['Quel est le coefficient du Grand oral dans la voie générale à la session 2027 ?', ['2', '6', '8', '16'], 2, 'Il valait 10 jusqu’en 2026 : l’épreuve anticipée de mathématiques, passée en première, lui a pris deux points.', 'Quel est le coefficient du Grand oral dans la voie générale ?'],
            ['Le support préparé pendant les 20 minutes de préparation est évalué.', ['Vrai', 'Faux'], 1, 'Il peut aider, mais il n’est pas noté.'],
            ['Qu’est-ce qu’une bonne question de Grand oral ?', ['Une question qui pose un problème et appelle une réponse argumentée', 'Une définition à réciter', 'Le titre du rapport de projet', 'Une question sans lien avec les spécialités'], 0, 'Elle s’appuie sur le programme et se traite en dix minutes.'],
            ['À quoi servent les revues de projet ?', ['À noter le cahier des charges', 'À remplacer les essais', 'À choisir le jury', 'À faire le point sur l’avancement, les écarts et la suite'], 3, 'Chacun y présente sa part et ce qui reste à faire.'],
            ['Que doit pouvoir expliquer chaque membre de l’équipe ?', ['Uniquement le travail des autres', 'Sa propre part et son articulation avec le reste du projet', 'Le prix du prototype', 'Rien, seul le chef de projet parle'], 1, 'C’est ce qu’on attend en revue comme à l’oral.'],
            ['Au Grand oral, il est conseillé de réciter le rapport de projet.', ['Vrai', 'Faux'], 1, 'Le jury évalue le raisonnement et la parole, pas une récitation.'],
            ['Quelle partie de l’ancien Grand oral n’existe plus ?', ['Les cinq minutes sur le projet d’orientation', 'La présentation de la question', 'L’échange avec le jury', 'Les vingt minutes de préparation'], 0, 'L’épreuve tient désormais en deux temps de dix minutes : la présentation, puis l’échange avec le jury.', 'Sur quoi portent les 5 dernières minutes du Grand oral ?'],
            ['Le projet mêle réalisations numériques et matérielles.', ['Vrai', 'Faux'], 0, 'Modèles et simulations d’un côté, prototype de l’autre.'],
          ],
        },
      ],
    },
  ],
}
