-- =============================================================================
-- Studuel — Migration 069 : fiches de révision Physique-Chimie lycée (2de · 1re · Tle)
-- Remplit/enrichit lessons.revision_sheet (support « Révision ») pour la leçon
-- « L'essentiel du cours » de chaque chapitre — remplace le placeholder générique
-- posé par 025 par du contenu réel.
--
-- Motif : UPDATE joint sur la clé naturelle (slug, niveau, chapitre, leçon),
-- garde `IS DISTINCT FROM` → réexécutable sans effet de bord. Contenu en
-- dollar-quoting ($md$…$md$) pour éviter l'échappement des apostrophes.
--
-- Pour lister ce qu'il reste à écrire :
--   SELECT s.slug, c.level, c.title, l.title
--     FROM public.lessons l
--     JOIN public.chapters c ON c.id = l.chapter_id
--     JOIN public.subjects s ON s.id = c.subject_id
--    WHERE l.revision_sheet IS NULL
--    ORDER BY s.slug, c.level, c.position, l.position;
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 025 (colonne revision_sheet).
-- Idempotent.
-- =============================================================================

UPDATE public.lessons l
   SET revision_sheet = v.md
  FROM (VALUES
    ('physique-chimie', '2de', 'Constitution de la matière', $md$# Constitution de la matière — l'essentiel

**À retenir**
- Un **atome** est neutre : autant de **protons** (charge +) que d'**électrons** (charge −). Le **noyau** contient protons et neutrons.
- Le **numéro atomique Z** = nombre de protons ; le **nombre de masse A** = protons + neutrons.
- Un **ion** est un atome qui a gagné ou perdu des électrons : cation (+) s'il en perd, anion (−) s'il en gagne.

**Méthode / Formule**
- Nombre de neutrons N = A − Z.
- Charge d'un ion = (nombre de protons) − (nombre d'électrons), comptée en charge élémentaire e.

**Exemple**
> Le sodium ₁₁²³Na : Z = 11 protons, A = 23, donc N = 23 − 11 = 12 neutrons. L'ion Na⁺ a perdu 1 électron → 10 électrons.

**Erreur classique**
- Confondre A et Z, ou croire qu'un ion change de numéro atomique : seul le nombre d'électrons change, Z reste identique.$md$),

    ('physique-chimie', '2de', 'Transformations chimiques : équations', $md$# Transformations chimiques : équations — l'essentiel

**À retenir**
- Dans une transformation chimique, les **réactifs** disparaissent et les **produits** apparaissent.
- Une équation doit être **équilibrée** : il y a conservation des **atomes** de chaque élément et de la **charge**.
- On ajuste avec des **coefficients stœchiométriques** (jamais les indices dans les formules).

**Méthode**
1. J'écris les formules des réactifs et des produits.
2. J'équilibre chaque élément en plaçant des coefficients devant les formules.
3. Je vérifie : même nombre de chaque atome à gauche et à droite.

**Exemple**
> Combustion du méthane : CH₄ + 2 O₂ → CO₂ + 2 H₂O. À gauche : 1 C, 4 H, 4 O ; à droite : 1 C, 4 H, 4 O. Équilibrée.

**Erreur classique**
- Modifier une formule (écrire O au lieu de O₂) pour équilibrer : on ne touche qu'aux coefficients, pas aux indices.$md$),

    ('physique-chimie', '2de', 'Le mouvement : vitesse et référentiel', $md$# Le mouvement : vitesse et référentiel — l'essentiel

**À retenir**
- Décrire un mouvement suppose de choisir un **référentiel** (objet de référence) : le mouvement est **relatif**.
- La **vitesse** mesure la distance parcourue par unité de temps.
- Un mouvement est **uniforme** si la vitesse est constante.

**Formule**
- v = d / t, avec d en mètres (m), t en secondes (s), v en mètres par seconde (m/s).
- Conversion : 1 m/s = 3,6 km/h.

**Exemple**
> Un coureur parcourt d = 100 m en t = 12,5 s. Sa vitesse : v = 100 / 12,5 = 8 m/s, soit 8 × 3,6 = 28,8 km/h.

**Erreur classique**
- Oublier de préciser le référentiel : un passager est immobile par rapport au train mais en mouvement par rapport au sol.$md$),

    ('physique-chimie', '2de', 'Ondes et signaux', $md$# Ondes et signaux — l'essentiel

**À retenir**
- Une **onde** transporte de l'énergie sans transport de matière.
- Le **son** est une onde qui a besoin d'un **milieu matériel** (il ne se propage pas dans le vide).
- La vitesse du son dans l'air est d'environ **340 m/s**, celle de la lumière de **3,0 × 10⁸ m/s**.

**Formule**
- Distance parcourue par un signal : d = v × t.
- Fréquence et période : f = 1 / T (f en hertz Hz, T en secondes).

**Exemple**
> On voit un éclair puis on entend le tonnerre 3 s après. L'orage est à d = 340 × 3 ≈ 1020 m, soit environ 1 km.

**Erreur classique**
- Croire que le son se propage dans le vide : sans matière (comme dans l'espace), aucun son ne se transmet.$md$),

    ('physique-chimie', '2de', 'La lumière : spectres', $md$# La lumière : spectres — l'essentiel

**À retenir**
- La lumière **blanche** est composée de toutes les couleurs : un prisme la **décompose** en un spectre continu.
- Un gaz chaud sous faible pression émet un **spectre de raies** (raies colorées propres à chaque élément).
- La couleur d'une radiation est liée à sa **longueur d'onde λ** (en nanomètres, nm).

**Formule / Méthode**
- Le domaine visible s'étend d'environ **400 nm** (violet) à **800 nm** (rouge).
- Chaque élément chimique a un spectre de raies caractéristique → identification de sa composition.

**Exemple**
> La lumière du Soleil présente des raies sombres (raies d'absorption) qui révèlent la présence d'hydrogène et d'hélium dans son atmosphère.

**Erreur classique**
- Confondre spectre **continu** (corps chaud, arc-en-ciel de couleurs) et spectre de **raies** (gaz, quelques raies isolées).$md$),

    ('physique-chimie', '1re', 'Suivi d''une transformation chimique', $md$# Suivi d'une transformation chimique — l'essentiel

**À retenir**
- On suit une transformation grâce à l'**avancement x** (en mol), qui augmente au cours de la réaction.
- Un **tableau d'avancement** donne les quantités de matière initiales, en cours (état x) et finales.
- Le **réactif limitant** est celui qui s'épuise en premier : il fixe l'avancement maximal x_max.

**Formule / Méthode**
- Quantité de matière : n = m / M (m en g, M masse molaire en g/mol).
- Pour chaque réactif : n = n_initial − (coefficient) × x. Le limitant est celui qui donne le plus petit x_max.

**Exemple**
> Pour 2 H₂ + O₂ → 2 H₂O avec 3 mol de H₂ et 1 mol de O₂ : O₂ s'annule à x = 1 mol, H₂ à x = 1,5 mol. O₂ est limitant, x_max = 1 mol.

**Erreur classique**
- Oublier le coefficient stœchiométrique dans n − coef × x, ou désigner le réactif de plus petite quantité comme limitant sans tenir compte des coefficients.$md$),

    ('physique-chimie', '1re', 'Structure des entités chimiques', $md$# Structure des entités chimiques — l'essentiel

**À retenir**
- Les atomes se lient pour respecter les **règles du duet et de l'octet** (2 ou 8 électrons sur la couche externe).
- Un **schéma de Lewis** représente les liaisons (doublets liants) et les doublets non liants.
- La **géométrie** d'une molécule (linéaire, coudée, tétraédrique…) découle de la répulsion des doublets.

**Formule / Méthode**
- Électronégativité : plus un atome est électronégatif, plus il attire les électrons de la liaison → liaison **polarisée**.
- Nombre de doublets à placer = (électrons de valence totaux) / 2.

**Exemple**
> La molécule d'eau H₂O : l'oxygène porte 2 liaisons O–H et 2 doublets non liants → géométrie **coudée** (≈ 104°) et molécule **polaire**.

**Erreur classique**
- Oublier les doublets non liants : ils comptent dans la géométrie et expliquent pourquoi H₂O est coudée et non linéaire.$md$),

    ('physique-chimie', '1re', 'Mouvement et interactions', $md$# Mouvement et interactions — l'essentiel

**À retenir**
- Un système modélisé par un point est soumis à des **forces** (vecteurs : direction, sens, valeur en newtons N).
- **Principe d'inertie** : si les forces se compensent, le centre de masse est immobile ou en mouvement rectiligne uniforme (et réciproquement).
- Le **vecteur vitesse** change quand une force résultante non nulle s'exerce.

**Formule**
- Poids : P = m × g, avec m en kg, g ≈ 9,81 N/kg, P en newtons.
- Forces qui se compensent ⇔ somme vectorielle nulle : ΣF = 0.

**Exemple**
> Un objet de m = 2 kg a un poids P = 2 × 9,81 ≈ 19,6 N. Posé immobile sur une table, la réaction du support compense exactement ce poids.

**Erreur classique**
- Confondre masse (en kg, invariante) et poids (une force en N, qui dépend de g et donc du lieu).$md$),

    ('physique-chimie', '1re', 'L''énergie mécanique', $md$# L'énergie mécanique — l'essentiel

**À retenir**
- L'énergie **cinétique** est liée au mouvement, l'énergie **potentielle de pesanteur** à l'altitude.
- L'énergie **mécanique** est leur somme : Em = Ec + Ep.
- En l'absence de frottements, l'énergie mécanique se **conserve** (Em constante).

**Formule (unités SI : joule J)**
- Ec = ½ × m × v² (m en kg, v en m/s).
- Ep = m × g × h (h altitude en m, g ≈ 9,81 N/kg).

**Exemple**
> Une bille de m = 0,2 kg tombe de h = 5 m. En haut Ep = 0,2 × 9,81 × 5 ≈ 9,8 J. Sans frottements, en bas Ec ≈ 9,8 J, donc v = √(2 × 9,8 / 0,2) ≈ 9,9 m/s.

**Erreur classique**
- Oublier le carré de la vitesse dans Ec : doubler v **quadruple** l'énergie cinétique, il ne la double pas.$md$),

    ('physique-chimie', '1re', 'Ondes mécaniques', $md$# Ondes mécaniques — l'essentiel

**À retenir**
- Une **onde mécanique** est la propagation d'une perturbation dans un milieu matériel, sans transport de matière.
- Une onde **périodique** se répète : elle a une **période T** (temps) et une **longueur d'onde λ** (distance).
- La **célérité** v est la vitesse de propagation de l'onde dans le milieu.

**Formule**
- λ = v × T = v / f (λ en m, v en m/s, T en s, f en Hz).
- Retard : un point situé à la distance d reçoit la perturbation avec un retard τ = d / v.

**Exemple**
> Une onde à la surface de l'eau a une célérité v = 2 m/s et une fréquence f = 4 Hz. Sa longueur d'onde : λ = v / f = 2 / 4 = 0,5 m.

**Erreur classique**
- Confondre période T (une durée, en s) et longueur d'onde λ (une distance, en m) : ce sont deux grandeurs différentes reliées par v.$md$),

    ('physique-chimie', 'Tle', 'Cinétique chimique', $md$# Cinétique chimique — l'essentiel

**À retenir**
- La **cinétique** étudie la **vitesse** d'évolution d'une transformation : rapide ou lente.
- Un **facteur cinétique** accélère la réaction : température, concentration des réactifs plus élevées.
- Un **catalyseur** accélère la réaction sans être consommé et sans modifier l'état final.

**Formule / Méthode**
- Temps de demi-réaction t½ : durée au bout de laquelle l'avancement atteint la moitié de x_max.
- La vitesse volumique diminue au cours du temps car les concentrations des réactifs baissent.

**Exemple**
> Une réaction atteint x_max = 4,0 mmol. À t½, l'avancement vaut 2,0 mmol ; si cela correspond à 40 s, alors t½ = 40 s.

**Erreur classique**
- Croire qu'un catalyseur augmente le rendement : il change seulement la **vitesse**, pas l'avancement final ni l'état d'équilibre.$md$),

    ('physique-chimie', 'Tle', 'Acides et bases', $md$# Acides et bases — l'essentiel

**À retenir**
- Un **acide** cède un proton H⁺ (H₃O⁺ en solution), une **base** capte un proton (couple acide/base HA / A⁻).
- Le **pH** mesure l'acidité d'une solution aqueuse : pH < 7 acide, = 7 neutre, > 7 basique (à 25 °C).
- Un acide **fort** est totalement dissocié dans l'eau ; un acide **faible** ne l'est que partiellement.

**Formule (25 °C)**
- pH = −log[H₃O⁺], et inversement [H₃O⁺] = 10^(−pH) (concentration en mol/L).
- Produit ionique de l'eau : [H₃O⁺] × [OH⁻] = 1,0 × 10⁻¹⁴.

**Exemple**
> Une solution a [H₃O⁺] = 1,0 × 10⁻³ mol/L : pH = −log(10⁻³) = 3. La solution est acide.

**Erreur classique**
- Oublier le signe moins du logarithme : plus [H₃O⁺] est grande, plus le pH est **petit** (acidité forte).$md$),

    ('physique-chimie', 'Tle', 'Mécanique : lois de Newton', $md$# Mécanique : lois de Newton — l'essentiel

**À retenir**
- **1re loi (inertie)** : dans un référentiel galiléen, si ΣF = 0 le vecteur vitesse est constant.
- **2e loi** : la somme des forces égale masse × accélération (ΣF = m·a).
- **3e loi (actions réciproques)** : A exerce sur B une force opposée à celle que B exerce sur A.

**Formule (unités SI)**
- ΣF = m × a (F en N, m en kg, a en m/s²).
- Le vecteur accélération a est la dérivée du vecteur vitesse : il a le sens de la force résultante.

**Exemple**
> Une force résultante de 10 N s'exerce sur un objet de m = 2 kg : a = ΣF / m = 10 / 2 = 5 m/s². La vitesse augmente de 5 m/s chaque seconde.

**Erreur classique**
- Croire qu'une vitesse constante nécessite une force : à vitesse constante, ΣF = 0 (1re loi). Une force crée une **accélération**, pas une vitesse.$md$),

    ('physique-chimie', 'Tle', 'Ondes lumineuses : diffraction', $md$# Ondes lumineuses : diffraction — l'essentiel

**À retenir**
- La **diffraction** est l'étalement d'une onde qui rencontre une ouverture ou un obstacle de petite taille : elle prouve le caractère **ondulatoire** de la lumière.
- L'effet est d'autant plus marqué que l'ouverture a est **petite** devant la longueur d'onde λ.
- Sur un écran, on observe une figure de diffraction (tache centrale large entourée d'extinctions).

**Formule**
- Demi-angle de diffraction : θ = λ / a (θ en radians, λ et a en mètres).
- Largeur de la tache centrale sur un écran à distance D : L = 2 × D × λ / a.

**Exemple**
> Un laser λ = 633 nm éclaire une fente a = 0,10 mm, écran à D = 2,0 m. L = 2 × 2,0 × 633×10⁻⁹ / 1,0×10⁻⁴ ≈ 2,5 × 10⁻² m = 2,5 cm.

**Erreur classique**
- Oublier de convertir λ (nm → m) et a (mm → m) en mètres : le calcul de θ = λ/a exige des unités cohérentes.$md$),

    ('physique-chimie', 'Tle', 'Énergie et thermodynamique', $md$# Énergie et thermodynamique — l'essentiel

**À retenir**
- L'énergie **interne U** d'un système varie par échange de **travail W** et de **transfert thermique Q**.
- **Premier principe** : l'énergie se conserve, ΔU = W + Q (bilan de tous les échanges).
- Un transfert thermique va toujours **spontanément** du corps chaud vers le corps froid.

**Formule (unités SI : joule J)**
- Chaleur pour changer la température : Q = m × c × ΔT (c capacité thermique massique en J·kg⁻¹·K⁻¹).
- Premier principe : ΔU = W + Q.

**Exemple**
> Chauffer m = 0,50 kg d'eau (c = 4180 J·kg⁻¹·K⁻¹) de 20 °C à 30 °C : Q = 0,50 × 4180 × 10 = 2,09 × 10⁴ J ≈ 21 kJ.

**Erreur classique**
- Utiliser ΔT en confondant écart et température absolue : ici ΔT = 10 (un écart), identique en °C et en K, donc pas de conversion à 293 K.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
