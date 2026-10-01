-- =============================================================================
-- Studuel — Migration 459 : EXPLICATIONS DE QUIZ RÉÉCRITES (3e → Tle)
--
-- 73 fragments, remplacés à l’endroit exact où ils sont.
-- Les 71 explications de moins de 15 caractères (« Symbole N. », « Créé en 1894. », un calcul nu) redisent maintenant la méthode en une ou deux phrases ; deux fiches jumelles de 5e et de 4e suivent.
-- La même correction est faite dans la source (scripts/contenu, contenu/controles).
--
-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main. Source : contenu/corrections/.
--    Regénérer : node scripts/corrections-sql.mjs --num 459 --fichiers lot-i-explications --titre … --motif … (ceux de l’en-tête)
--
-- Idempotent : chaque UPDATE ne touche que les lignes qui contiennent encore le
-- fragment fautif. À exécuter APRÈS 385 → 399 (les cours qu’elles réécrivent).
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

DROP TABLE IF EXISTS pg_temp._corrections;
CREATE TEMP TABLE _corrections (n int, slug text, level text, chapter text, champ text, ancien text, nouveau text, cible text);
INSERT INTO _corrections VALUES
  (1, 'anglais', '1re', 'Adjectifs et noms suivis d’une préposition', 'explication_de', 'Reason for.', 'On dit *the reason for* : en anglais, la raison « de » quelque chose se construit avec *for*, jamais avec *of*.', 'Comment dire « la raison de son départ » ?'),
  (2, 'anglais', '1re', 'Adjectifs et noms suivis d’une préposition', 'explication_de', 'Increase in.', '*An increase in* : la hausse « de » quelque chose se construit avec *in*, comme *a rise in* ou *a fall in*.', 'Comment dire « une hausse des prix » ?'),
  (3, 'anglais', '1re', 'Adjectifs et noms suivis d’une préposition', 'explication_de', 'Famous for.', '*Famous for* : on est célèbre « pour » quelque chose. De même *known for* et *responsible for*.', 'Complète : « Liverpool is famous ___ the Beatles. »'),
  (4, 'anglais', 'Tle', 'Former les mots : préfixes, suffixes, conversion', 'explication_de', 'Over- = trop.', 'Le préfixe *over-* veut dire « trop » : *overcrowded*, c’est trop de monde (*crowd* = la foule).', 'Que signifie « overcrowded » ?'),
  (5, 'anglais', 'Tle', 'Former les mots : préfixes, suffixes, conversion', 'explication_de', '-less = sans.', 'Le suffixe *-less* veut dire « sans » : *careless* = sans soin. *Carefree* existe, mais signifie « insouciant ».', 'Quel est le contraire de « careful » ?'),
  (6, 'anglais', 'Tle', 'Former les mots : préfixes, suffixes, conversion', 'explication_de', 'Happiness.', '*-ness* transforme un adjectif en nom abstrait : *happy* → *happiness* (le *y* devient *i*), *kind* → *kindness*.', 'Quel suffixe forme un nom abstrait à partir de « happy » ?'),
  (7, 'anglais', 'Tle', 'L’anglais, langue-monde, et le pouvoir des mots', 'explication_de', 'En 1953.', 'Il le reçoit en 1953, pour ses écrits historiques et ses discours — et non le Nobel de la paix, comme on le croit souvent.', 'Churchill a reçu le prix Nobel de…'),
  (8, 'anglais', '1re', 'Le chassé-croisé et les structures résultatives', 'explication_de', 'Run + away.', 'L’anglais met la manière dans le verbe (*ran*) et le déplacement dans la particule (*away*) : c’est le chassé-croisé.', 'Quelle traduction de « Le voleur s’est enfui en courant » est la plus naturelle ?'),
  (9, 'anglais', 'Tle', 'Utopies, dystopies et rêve américain', 'explication_de', 'Depuis 2011.', 'Lancée en 2011, la série imagine dans chaque épisode un futur proche où une technologie tourne mal : une dystopie.', 'Quelle série de Charlie Brooker explore les dérives de la technologie ?'),
  (10, 'francais', '1re', 'Poésies, Stéphane Mallarmé', 'explication_de', 'Créé en 1894.', 'Debussy compose le *Prélude à l’après-midi d’un faune* en 1894, d’après le poème que Mallarmé publie en 1876.', 'Quelle œuvre musicale s’inspire de son églogue ?'),
  (11, 'i2d', 'Tle', 'Résistance des matériaux et dimensionnement', 'explication_de', 'σ = E × ε.', 'La loi de Hooke s’écrit σ = E × ε : la contrainte est proportionnelle à la déformation, et E est le module de Young du matériau.', 'Quelle loi relie contrainte et déformation dans le domaine élastique ?'),
  (12, 'ingenierie-dd', '1re', 'Codage de l’information et algorithmique', 'explication_de', '2 / 10 = 0,2.', 'Taux de compression = taille compressée ÷ taille initiale = 2 ÷ 10 = 0,2 : le fichier ne pèse plus que 20 % de sa taille.', 'Un fichier de 10 Mo compressé en 2 Mo a un taux de compression de…'),
  (13, 'ingenierie-dd', '1re', 'Comportement énergétique : puissance, rendement, bilan', 'explication_de', 'P = E / t.', 'P = E / t : la puissance dit à quelle vitesse l’énergie est transférée. Un watt vaut un joule par seconde.', 'La puissance mesure…'),
  (14, 'ingenierie-dd', '1re', 'Comportement informationnel : états et séquences', 'explication_de', 'Tout ou rien.', 'Une information « tout ou rien » (TOR) n’a que deux états, 0 ou 1 : c’est une information logique, celle d’un interrupteur.', 'Une information qui ne prend que les valeurs 0 et 1 est…'),
  (15, 'maths', '2de', 'Échantillonnage', 'explication_de', '1/√100 = 0,1.', 'Au seuil de 95 %, l’intervalle est [p − 1/√n ; p + 1/√n]. Ici 1/√100 = 0,1, d’où [0,4 ; 0,6].', 'Quel est l’intervalle de fluctuation pour p = 0,5 et n = 100 ?'),
  (16, 'maths', '2de', 'Géométrie plane : triangles et projeté orthogonal d’un point sur une droite', 'explication_de', 'Il est unique.', 'H est le point de d le plus proche de M, et il est unique : (MH) est la perpendiculaire à d qui passe par M.', 'Qu’est-ce que le projeté orthogonal d’un point M sur une droite d ?'),
  (17, 'maths', '2de', 'Information chiffrée', 'explication_de', '1 − 30/100.', 'Baisser de 30 %, c’est garder 70 % : on multiplie par 1 − 30/100 = 0,70.', 'Par quel coefficient multiplie-t-on pour une baisse de 30 % ?'),
  (18, 'maths', '2de', 'Information chiffrée', 'explication_de', '1 + 15/100.', 'Augmenter de 15 %, c’est multiplier par 1 + 15/100 = 1,15.', 'Par quel coefficient multiplie-t-on pour une hausse de 15 % ?'),
  (19, 'maths', '2de', 'La fonction inverse', 'explication_de', 'x = 1/k.', 'Pour k non nul, l’équation 1/x = k a pour solution x = 1/k. Ici x = 1/4 = 0,25.', 'Quelle est la solution de 1/x = 4 ?'),
  (20, 'maths', '3e', 'La racine carrée et l’équation x² = a', 'explication_de', '144 = 12².', '144 = 12 × 12 = 12² : c’est un carré parfait. Les trois autres tombent entre 11² = 121 et 13² = 169 sans être des carrés.', 'Lequel de ces nombres est un carré parfait ?'),
  (21, 'maths', '2de', 'Nombres entiers : multiples, diviseurs et nombres premiers', 'explication_de', '1 et lui-même.', 'Ses deux seuls diviseurs positifs sont 1 et lui-même. C’est pourquoi 1 n’est pas premier, et 2 est le seul nombre premier pair.', 'Qu’est-ce qu’un nombre premier ?'),
  (22, 'maths', '2de', 'Nombres entiers : multiples, diviseurs et nombres premiers', 'explication_de', 'Ici k = 13.', '91 = 7 × 13 : l’entier k vaut 13. On dit aussi que 91 est un multiple de 7.', 'Que signifie que 7 divise 91 ?'),
  (23, 'maths-techno', 'Tle', 'Automatismes : évolutions, indices et taux', 'explication_de', '40 ÷ 0,8 = 50.', 'Baisser de 20 %, c’est multiplier par 0,8. On remonte au prix initial en divisant : 40 ÷ 0,8 = 50 €.', 'Après une baisse de 20 %, un article coûte 40 €. Quel était son prix initial ?'),
  (24, 'maths-techno', '1re', 'Automatismes : fractions, puissances et ordres de grandeur', 'explication_de', '6/12 = 1/2.', 'On multiplie les numérateurs entre eux et les dénominateurs entre eux : 6/12, qui se simplifie en 1/2.', 'Combien vaut 2/3 × 3/4 ?'),
  (25, 'maths-techno', '1re', 'Automatismes : lectures graphiques et droites', 'explication_de', '3 × 2 − 1 = 5.', 'On remplace x par 2 : 3 × 2 − 1 = 5, qui est bien l’ordonnée du point. Il appartient donc à la droite.', 'Le point (2 ; 5) appartient à la droite d’équation y = 3x − 1.'),
  (26, 'maths-techno', '1re', 'Automatismes : proportions, pourcentages et évolutions', 'explication_de', '66 ÷ 1,1 = 60.', 'Augmenter de 10 %, c’est multiplier par 1,1. On retrouve le prix initial en divisant : 66 ÷ 1,1 = 60 €.', 'Après une hausse de 10 %, un prix vaut 66 €. Quel était le prix initial ?'),
  (27, 'maths-techno', '1re', 'Automatismes : proportions, pourcentages et évolutions', 'explication_de', '50 × 1,1 = 55.', 'Augmenter de 10 %, c’est multiplier par 1,1 : 50 × 1,1 = 55 €.', 'Un prix de 50 € augmente de 10 %. Quel est le nouveau prix ?'),
  (28, 'maths-techno', '1re', 'Épreuves de Bernoulli et variables aléatoires', 'explication_de', '0,4³ = 0,064.', 'Aucun succès, c’est trois échecs de suite, chacun de probabilité 1 − 0,6 = 0,4 : 0,4³ = 0,064.', 'Trois épreuves indépendantes, succès de probabilité 0,6. Probabilité de n’avoir aucun succès ?'),
  (29, 'maths-techno', '1re', 'Fonction dérivée et sens de variation', 'explication_de', '2 × 3x² = 6x².', 'La dérivée de x³ est 3x² ; le coefficient 2 reste devant : 2 × 3x² = 6x².', 'Quelle est la dérivée de f(x) = 2x³ ?'),
  (30, 'maths-techno', 'Tle', 'La fonction inverse', 'explication_de', '−1/1² = −1.', 'La dérivée de 1/x est −1/x². En x = 1, elle vaut −1/1² = −1.', 'Combien vaut la dérivée de 1/x en x = 1 ?'),
  (31, 'maths-techno', 'Tle', 'La fonction logarithme décimal', 'explication_de', '10³ = 1 000.', 'log(1 000) est la puissance de 10 qui donne 1 000 : 10³ = 1 000, donc log(1 000) = 3.', 'Combien vaut log(1 000) ?'),
  (32, 'maths-techno', 'Tle', 'La loi binomiale et l’espérance', 'explication_de', '0 + 2 + 2 = 4.', 'E(X) = 0 × 0,5 + 5 × 0,4 + 20 × 0,1 = 0 + 2 + 2 = 4.', 'X prend les valeurs 0, 5 et 20 avec les probabilités 0,5 ; 0,4 et 0,1. Combien vaut E(X) ?'),
  (33, 'maths-techno', 'Tle', 'La loi binomiale et l’espérance', 'explication_de', '10 × 0,2 = 2.', 'Pour une loi binomiale, E(X) = n × p = 10 × 0,2 = 2.', 'X suit B(10 ; 0,2). Combien vaut E(X) ?'),
  (34, 'maths-techno', 'Tle', 'La loi binomiale et l’espérance', 'explication_de', '0,9³ = 0,729.', 'Aucun succès en trois épreuves : trois échecs de probabilité 0,9 chacun, soit 0,9³ = 0,729.', 'X suit B(3 ; 0,1). Combien vaut P(X = 0) ?'),
  (35, 'maths-techno', 'Tle', 'La loi binomiale et l’espérance', 'explication_de', '1 − 0,729.', '« Au moins un succès » est le contraire de « aucun succès » : 1 − P(X = 0) = 1 − 0,729 = 0,271.', 'X suit B(3 ; 0,1). Combien vaut P(X ≥ 1) ?'),
  (36, 'maths-techno', 'Tle', 'Le taux d’évolution moyen', 'explication_de', '√1,44 = 1,2.', 'Le coefficient global est 1,44. Sur deux ans, le coefficient annuel est sa racine carrée : √1,44 = 1,2, soit + 20 % par an.', 'Une grandeur augmente de 44 % en 2 ans. Taux annuel moyen ?'),
  (37, 'maths-techno', 'Tle', 'Le taux d’évolution moyen', 'explication_de', '√0,81 = 0,9.', 'Le coefficient global est 0,81. Le coefficient annuel est sa racine carrée : √0,81 = 0,9, soit − 10 % par an.', 'Une grandeur baisse de 19 % en 2 ans. Taux annuel moyen ?'),
  (38, 'maths-techno', 'Tle', 'Les fonctions exponentielles de base a', 'explication_de', '0 < a < 1.', 'Une fonction x ↦ aˣ est strictement décroissante quand 0 < a < 1 : ici a = 0,7.', 'La fonction x ↦ 0,7^x est…'),
  (39, 'maths-techno', '1re', 'Les fonctions polynômes du second degré', 'explication_de', 'a = −3 < 0.', 'Le coefficient de x² est a = −3, négatif : la parabole est tournée vers le bas.', 'La parabole de f(x) = −3x² + 1 est…'),
  (40, 'maths-techno', '1re', 'Les suites arithmétiques', 'explication_de', '11 − 7 = 4.', 'On passe d’un terme au suivant en ajoutant toujours le même nombre : 11 − 7 = 15 − 11 = 4.', 'Quelle est la raison de la suite arithmétique 7 ; 11 ; 15 ; … ?'),
  (41, 'maths-techno', '1re', 'Les suites géométriques', 'explication_de', '15 ÷ 5 = 3.', 'On passe d’un terme au suivant en multipliant toujours par le même nombre : 15 ÷ 5 = 45 ÷ 15 = 3.', 'Quelle est la raison de la suite géométrique 5 ; 15 ; 45 ; … ?'),
  (42, 'maths-techno', '1re', 'Les suites numériques : générer et représenter', 'explication_de', '1 ÷ (3 + 1).', 'On remplace n par 3 : u(3) = 1 ÷ (3 + 1) = 1/4.', 'Si u(n) = 1 ÷ (n + 1), combien vaut u(3) ?'),
  (43, 'maths-techno', '1re', 'Les suites numériques : générer et représenter', 'explication_de', '4 − 2 = 2.', 'On remplace n par 2 : u(2) = 2² − 2 = 4 − 2 = 2.', 'Si u(n) = n² − n, combien vaut u(2) ?'),
  (44, 'maths-techno', '1re', 'Les suites numériques : générer et représenter', 'explication_de', '3² = 9.', 'On remplace n par 3 : u(3) = 3² = 9.', 'Si u(n) = n², combien vaut u(3) ?'),
  (45, 'maths-techno', 'Tle', 'Probabilités conditionnelles, arbres et indépendance', 'explication_de', '0,010 ÷ 0,029.', 'On divise la probabilité de l’intersection par celle de D : 0,010 ÷ 0,029 ≈ 0,345.', 'Dans l’exemple de la fiche, P_D(C) vaut environ…'),
  (46, 'maths-techno', 'Tle', 'Résoudre une équation avec le logarithme décimal', 'explication_de', '16^(1/4) = 2.', 'x = 16^(1/4) : la racine quatrième de 16 est 2, car 2⁴ = 16.', 'Quelle est la solution positive de x⁴ = 16 ?'),
  (47, 'maths-techno', 'Tle', 'Résoudre une équation avec le logarithme décimal', 'explication_de', '0,8 < 1.', 'Le logarithme décimal est négatif pour les nombres compris entre 0 et 1 : 0,8 < 1, donc log(0,8) < 0.', 'Signe de log(0,8) ?'),
  (48, 'maths-techno', '1re', 'Séries statistiques à deux variables', 'explication_de', '10 ÷ 4 = 2,5.', 'On additionne les valeurs et on divise par leur nombre : (1 + 2 + 3 + 4) ÷ 4 = 10 ÷ 4 = 2,5.', 'Quelle est la moyenne des valeurs x : 1 ; 2 ; 3 ; 4 ?'),
  (49, 'maths-techno', 'Tle', 'Séries statistiques à deux variables et ajustement affine', 'explication_de', 'G(x̄ ; ȳ).', 'La droite d’ajustement passe toujours par le point moyen G, dont les coordonnées sont les moyennes x̄ et ȳ.', 'Par quel point passe toujours la droite des moindres carrés ?'),
  (50, 'maths-techno', 'Tle', 'Suites géométriques : terme général et somme', 'explication_de', '1 + 20/100.', 'Augmenter de 20 %, c’est multiplier par 1 + 20/100 = 1,2 : c’est la raison de la suite.', 'Une évolution de + 20 % par semaine se modélise par une suite géométrique de raison…'),
  (51, 'maths-techno', 'Tle', 'Suites géométriques : terme général et somme', 'explication_de', '0 < q < 1.', 'Chaque terme vaut 0,9 fois le précédent : avec 0 < q < 1 et des termes positifs, la suite décroît.', 'Une suite géométrique de raison 0,9 (termes positifs) est…'),
  (52, 'musique', 'Tle', 'Droit, économie et métiers de la musique', 'explication_de', 'Créée en 1851.', 'Créée en 1851, la SACEM collecte les droits d’auteur et les reverse aux auteurs, aux compositeurs et aux éditeurs.', 'Que signifie le sigle SACEM ?'),
  (53, 'physique-chimie', '2de', 'La loi d’Ohm et la résistance au courant électrique', 'explication_de', 'Symbole Ω.', 'La résistance se mesure en ohms, de symbole Ω, avec un ohmmètre.', 'Quelle est l’unité de la résistance ?'),
  (54, 'physique-chimie', '2de', 'Modélisation d’une action par une force', 'explication_de', 'Symbole N.', 'Une force se mesure en newtons, de symbole N, avec un dynamomètre.', 'Quelle est l’unité de la valeur d’une force ?'),
  (55, 'physique-chimie-maths', 'Tle', 'Acides, bases et pH', 'explication_de', '10^0,1 ≈ 1,26.', 'Une baisse de 0,1 unité de pH multiplie la concentration en H₃O⁺ par 10^0,1 ≈ 1,26 : soit + 26 %.', 'Le pH des océans passe de 8,2 à 8,1. La concentration en H3O⁺ a augmenté d’environ…'),
  (56, 'physique-chimie-maths', '1re', 'Dérivation', 'explication_de', '3x(x − 2) = 0.', 'f’(x) = 3x(x − 2) : un produit est nul quand l’un de ses facteurs l’est, donc en x = 0 et en x = 2.', 'Pour cette fonction, où f’ s’annule-t-elle ?'),
  (57, 'physique-chimie-maths', '1re', 'Énergie mécanique : mouvements et forces', 'explication_de', 'cos 90° = 0.', 'W = F × d × cos α. Pour une force perpendiculaire au déplacement, α = 90° et cos 90° = 0 : le travail est nul.', 'Le travail d’une force perpendiculaire au déplacement est…'),
  (58, 'physique-chimie-maths', 'Tle', 'Équations différentielles', 'explication_de', 'C + 20 = 90.', 'À t = 0, l’exponentielle vaut 1 : θ(0) = C + 20 = 90, donc C = 70.', 'Avec θ(0) = 90, que vaut C dans θ(t) = C e^(−0,1 t) + 20 ?'),
  (59, 'physique-chimie-maths', '1re', 'L’énergie et ses enjeux', 'explication_de', 'P = E / Δt.', 'P = E / Δt : la puissance dit à quelle vitesse l’énergie est transférée, en watts.', 'Que mesure la puissance ?'),
  (60, 'physique-chimie-maths', '1re', 'Nombres complexes', 'explication_de', '√(9 + 16) = 5.', '|z| = √(a² + b²) = √(9 + 16) = √25 = 5.', 'Quel est le module de z = 3 + 4i ?'),
  (61, 'physique-chimie-maths', 'Tle', 'Nombres complexes : forme exponentielle', 'explication_de', 'i = e^(iπ/2).', 'i = e^(iπ/2) : multiplier par i ajoute π/2 à l’argument, soit un quart de tour.', 'Multiplier par i fait tourner un point autour de O de…'),
  (62, 'physique-chimie-maths', 'Tle', 'Photons, photovoltaïque et photothermique', 'explication_de', 'U = R × I.', 'La loi d’Ohm U = R × I est une relation de proportionnalité : son graphe est une droite qui passe par l’origine, de pente R.', 'Quelle est la caractéristique U = f(I) d’une résistance ?'),
  (63, 'physique-chimie-maths', '1re', 'Primitives et méthode d’Euler', 'explication_de', '(x²)’ = 2x.', 'On cherche une fonction dont la dérivée est 2x : (x²)’ = 2x, donc x² convient.', 'Une primitive de f(x) = 2x est…'),
  (64, 'physique-chimie-maths', '1re', 'Produit scalaire', 'explication_de', 'cos 90° = 0.', 'u · v = ‖u‖ × ‖v‖ × cos θ. Pour un angle droit, cos 90° = 0 : le produit scalaire est nul.', 'Deux vecteurs sont orthogonaux si et seulement si…'),
  (65, 'physique-chimie-maths', '1re', 'Produit scalaire', 'explication_de', 'cos 90° = 0.', 'a² = b² + c² − 2bc cos Â. Avec Â = 90°, cos Â = 0 : il reste a² = b² + c², le théorème de Pythagore.', 'Le théorème d’Al-Kashi avec Â = 90° redonne…'),
  (66, 'physique-chimie-maths', '1re', 'Produit scalaire', 'explication_de', '√(9 + 16) = 5.', '‖u‖ = √(x² + y²) = √(9 + 16) = √25 = 5.', 'Quelle est la norme de u(3 ; 4) ?'),
  (67, 'physique-chimie-maths', 'Tle', 'Radioactivité, fission et fusion', 'explication_de', '(1/2)³ = 1/8.', 'À chaque demi-vie, la moitié des noyaux restants disparaît : (1/2)³ = 1/8.', 'Quelle fraction des noyaux reste-t-il après trois demi-vies ?'),
  (68, 'physique-chimie-maths', '1re', 'Trigonométrie et fonctions sinusoïdales', 'explication_de', 'Et T = 2π / ω.', 'ω = 2π f ; et comme f = 1/T, on a aussi T = 2π / ω.', 'Quelle relation relie la pulsation et la fréquence ?'),
  (69, 'physique-chimie-sante', '1re', 'Débit, pression et tension artérielle', 'explication_de', '1 Pa = 1 N/m².', 'Le pascal (Pa) est la pression d’une force de 1 newton sur 1 m² : 1 Pa = 1 N/m².', 'Quelle est l’unité internationale de pression ?'),
  (70, 'sciences-sanitaires-sociales', 'Tle', 'Méthode : réussir l’épreuve écrite de STSS', 'explication_de', '60 ÷ 40 = 1,5.', 'On divise la valeur d’arrivée par la valeur de départ : 60 ÷ 40 = 1,5, soit une hausse de 50 %.', 'Une grandeur passe de 40 à 60. Quel est le coefficient multiplicateur ?'),
  (71, 'snt', '2de', 'L’image numérique', 'explication_de', 'De 0 à 255.', '8 bits donnent 2⁸ = 256 valeurs, numérotées de 0 à 255.', 'Combien de niveaux par composante si elle est codée sur 8 bits ?'),
  (72, 'maths', '5e', 'Division euclidienne et nombres premiers', 'explication_de', '1 et lui-même.', 'Ses deux seuls diviseurs positifs sont 1 et lui-même. C’est pourquoi 1 n’est pas premier, et 2 est le seul nombre premier pair.', 'Qu’est-ce qu’un nombre premier ?'),
  (73, 'maths', '4e', 'Les nombres premiers', 'explication_de', '1 et lui-même.', 'Ses deux seuls diviseurs positifs sont 1 et lui-même. C’est pourquoi 1 n’est pas premier, et 2 est le seul nombre premier pair.', 'Qu’est-ce qu’un nombre premier ?');

-- Les cours, une correction à la fois (plusieurs peuvent viser la même leçon).
DO $$
DECLARE k record;
BEGIN
  FOR k IN SELECT * FROM _corrections WHERE champ = 'cours' ORDER BY n LOOP
    UPDATE public.lessons l SET content = replace(l.content, k.ancien, k.nouveau)
      FROM public.subjects s
      JOIN public.chapters c ON c.subject_id = s.id
     WHERE s.slug = k.slug AND c.level = k.level AND c.title = k.chapter
       AND l.chapter_id = c.id AND strpos(l.content, k.ancien) > 0;
  END LOOP;
END $$;

-- Les questions de quiz (énoncé, explication, options), une correction à la fois.
DO $$
DECLARE k record;
BEGIN
  FOR k IN SELECT * FROM _corrections WHERE champ IN ('question', 'explication', 'options') ORDER BY n LOOP
    UPDATE public.quiz_questions x
       SET question    = CASE WHEN k.champ = 'question'    THEN replace(x.question, k.ancien, k.nouveau) ELSE x.question END,
           explanation = CASE WHEN k.champ = 'explication' THEN replace(x.explanation, k.ancien, k.nouveau) ELSE x.explanation END,
           options     = CASE WHEN k.champ = 'options'     THEN replace(x.options::text, k.ancien, k.nouveau)::jsonb ELSE x.options END
      FROM public.quizzes qz
      JOIN public.lessons l ON l.id = qz.lesson_id
      JOIN public.chapters c ON c.id = l.chapter_id
      JOIN public.subjects s ON s.id = c.subject_id
     WHERE x.quiz_id = qz.id AND s.slug = k.slug AND c.level = k.level AND c.title = k.chapter
       AND strpos(CASE k.champ WHEN 'question' THEN x.question WHEN 'explication' THEN x.explanation ELSE x.options::text END, k.ancien) > 0;
  END LOOP;
END $$;

-- Les explications ciblées : celle d’une question nommée, remplacée en entier.
DO $$
DECLARE k record;
BEGIN
  FOR k IN SELECT * FROM _corrections WHERE champ = 'explication_de' ORDER BY n LOOP
    UPDATE public.quiz_questions x SET explanation = k.nouveau
      FROM public.quizzes qz
      JOIN public.lessons l ON l.id = qz.lesson_id
      JOIN public.chapters c ON c.id = l.chapter_id
      JOIN public.subjects s ON s.id = c.subject_id
     WHERE x.quiz_id = qz.id AND s.slug = k.slug AND c.level = k.level AND c.title = k.chapter
       AND x.question = k.cible AND x.explanation = k.ancien;
  END LOOP;
END $$;

-- Contrôle d’arrivée : chaque correction doit voir son texte juste en place.
DO $$
DECLARE n_absentes int;
BEGIN
  SELECT count(*) INTO n_absentes FROM _corrections k
   WHERE CASE k.champ WHEN 'controle' THEN NOT EXISTS (
     SELECT 1 FROM public.subjects s
       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter
       JOIN public.chapter_exercices e ON e.chapter_id = c.id AND e.origine = 'catalogue'
      WHERE s.slug = k.slug AND strpos(e.contenu::text, k.nouveau) > 0)
   WHEN 'explication_de' THEN NOT EXISTS (
     SELECT 1 FROM public.subjects s
       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter
       JOIN public.lessons l ON l.chapter_id = c.id
       JOIN public.quizzes qz ON qz.lesson_id = l.id
       JOIN public.quiz_questions x ON x.quiz_id = qz.id
      WHERE s.slug = k.slug AND x.question = k.cible AND x.explanation = k.nouveau)
   ELSE NOT EXISTS (
     SELECT 1 FROM public.subjects s
       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter
       JOIN public.lessons l ON l.chapter_id = c.id
       LEFT JOIN public.quizzes qz ON qz.lesson_id = l.id
       LEFT JOIN public.quiz_questions x ON x.quiz_id = qz.id
      WHERE s.slug = k.slug
        AND strpos(CASE k.champ WHEN 'cours' THEN l.content WHEN 'question' THEN x.question
                   WHEN 'explication' THEN x.explanation ELSE x.options::text END, k.nouveau) > 0) END;
  RAISE NOTICE 'Migration 459 : % correction(s) sur 73 introuvables.', n_absentes;
  IF n_absentes > 0 THEN
    RAISE WARNING 'Migration 459 : des corrections n''ont pas trouvé leur fiche (titre, niveau ou fragment changé ?).';
  END IF;
END $$;

DROP TABLE IF EXISTS pg_temp._corrections;
