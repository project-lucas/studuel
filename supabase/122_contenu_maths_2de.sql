-- =============================================================================
-- Studuel — Migration 122 : CONTENU Maths 2de (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de Maths 2de (programme 2de générale, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (→ 10 questions). Les questions
--                    sont attachées au quiz DE LA LEÇON via la jointure leçon→quiz
--                    (robuste à l'id existant), positions 4→10.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons de Maths 2de, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Ensembles de nombres et calculs', $md$# Ensembles de nombres et calculs

## Ce que tu vas comprendre
Les nombres se rangent dans des **ensembles emboîtés**. Savoir dans lequel vit un nombre, manier les **intervalles** et la **valeur absolue**, et calculer sans erreur : voilà les fondations de toute l'année de 2de.

## 1. Les ensembles de nombres
On les note avec des lettres, du plus petit au plus grand :
- **N** : entiers **naturels** (0, 1, 2, 3…).
- **Z** : entiers **relatifs** (…, -2, -1, 0, 1, 2…).
- **D** : nombres **décimaux** (écriture finie après la virgule : 0,25 ; -3,7).
- **Q** : nombres **rationnels** (quotient de deux entiers : 1/3 ; 5/7).
- **R** : nombres **réels** (tous les points d'une droite, y compris √2 ou π).

On a l'**emboîtement** : **N ⊂ Z ⊂ D ⊂ Q ⊂ R**.

*Exemple : -3 est dans Z (mais pas dans N) ; 0,25 est dans D ; 1/3 est dans Q (mais pas dans D) ; √2 est dans R (mais pas dans Q).*

## 2. Les intervalles
Un **intervalle** est une portion continue de la droite des réels :
- **[2 ; 5]** : de 2 à 5, **bornes comprises** (crochets fermés).
- **]2 ; 5[** : de 2 à 5, **bornes exclues** (crochets ouverts).
- **[2 ; 5[** : 2 compris, 5 exclu.
- **[3 ; +∞[** : tous les réels **supérieurs ou égaux** à 3.

> **À retenir :** un crochet **vers l'infini** est toujours **ouvert** (∞ n'est pas un nombre).

## 3. La valeur absolue
La **valeur absolue** d'un nombre est sa distance à 0, toujours **positive** :
- **|7| = 7** et **|-7| = 7**.
- |x| = distance entre x et 0 sur la droite graduée.

## 4. Calculer sans erreur
- **Priorités** : parenthèses, puis puissances, puis × et ÷, puis + et -.
- **Fractions** : même dénominateur pour additionner ; on multiplie numérateurs entre eux et dénominateurs entre eux.
- **Puissances** : a^m × a^n = a^(m+n).

*Exemple : 2 + 3 × 4 = 2 + 12 = **14** (la multiplication d'abord).*

## L'essentiel à retenir
- Emboîtement des ensembles : **N ⊂ Z ⊂ D ⊂ Q ⊂ R**.
- **Crochet fermé** = borne comprise ; **ouvert** = borne exclue ; vers l'infini toujours ouvert.
- La **valeur absolue** est une distance : toujours ≥ 0, |-7| = 7.
- Respecter les **priorités opératoires** : × et ÷ avant + et -.$md$),

    ('Équations et inéquations', $md$# Équations et inéquations

## Ce que tu vas comprendre
Une **équation** cherche les valeurs d'une inconnue qui rendent une égalité vraie ; une **inéquation** cherche celles qui rendent une inégalité vraie. Ce chapitre te donne les méthodes sûres pour résoudre.

## 1. Résoudre une équation du premier degré
On isole l'inconnue en faisant **la même opération des deux côtés** :

*Exemple : 2x + 3 = 11.*
- On retire 3 : 2x = 8.
- On divise par 2 : **x = 4**.

## 2. L'équation produit nul
Un **produit de facteurs est nul** si (et seulement si) **au moins un des facteurs est nul**.

*Exemple : (x - 2)(x + 5) = 0.*
- Soit x - 2 = 0 → x = 2.
- Soit x + 5 = 0 → x = -5.
- Solutions : **2 et -5**.

## 3. Étude de signe
Pour savoir quand une expression est positive ou négative, on dresse un **tableau de signes**. Un facteur **ax + b** s'annule en **x = -b/a** et change de signe à ce point.

## 4. Résoudre une inéquation
On procède comme pour une équation, **avec une règle en plus** :

> **Attention !** Quand on **multiplie ou divise par un nombre négatif**, on **change le sens** de l'inégalité.

*Exemple : 3x - 6 > 0 → 3x > 6 → **x > 2**.*

## 5. Les systèmes
Un **système** de deux équations à deux inconnues se résout par **substitution** ou par **combinaison**.

*Exemple : x + y = 5 et x - y = 1. En additionnant : 2x = 6 → x = 3, puis y = 2. Solution : **(3 ; 2)**.*

## L'essentiel à retenir
- Équation du 1er degré : on **isole l'inconnue** par opérations identiques des deux côtés.
- **Produit nul** : un produit est nul si l'un des facteurs est nul.
- Inéquation : on **change le sens** en multipliant/divisant par un **négatif**.
- **Système** 2×2 : substitution ou combinaison pour trouver le couple solution.$md$),

    ('Fonctions de référence', $md$# Fonctions de référence

## Ce que tu vas comprendre
Quelques **fonctions modèles** — carré, inverse, racine carrée — reviennent partout. Connaître leur **courbe**, leurs **variations** et leurs **images** permet de comprendre toutes les autres.

## 1. La fonction carré
Elle associe à x son carré : **f(x) = x²**.
- Toujours **positive ou nulle** (un carré ne peut pas être négatif).
- **Décroissante** sur ]-∞ ; 0], puis **croissante** sur [0 ; +∞[.
- Sa courbe est une **parabole**, symétrique par rapport à l'axe des ordonnées.

*Exemple : image de -3 → (-3)² = **9** ; image de 5 → 25.*

## 2. La fonction inverse
Elle associe à x son inverse : **f(x) = 1/x**.
- **Non définie en 0** (on ne divise pas par 0) : domaine ]-∞ ; 0[ ∪ ]0 ; +∞[.
- **Décroissante** sur ]-∞ ; 0[ et **décroissante** sur ]0 ; +∞[.
- Sa courbe est une **hyperbole**, en deux branches.

*Exemple : image de 4 → 1/4 = 0,25 ; image de 0,5 → 2.*

## 3. La fonction racine carrée
Elle associe à x sa racine : **f(x) = √x**.
- Définie seulement pour **x ≥ 0** (domaine [0 ; +∞[).
- **Croissante** sur [0 ; +∞[.

*Exemple : image de 4 → √4 = **2** ; image de 9 → 3.*

## 4. Lire une courbe
Sur un graphique :
- l'**image** de a se lit en montant de a (axe des x) jusqu'à la courbe, puis sur l'axe des y ;
- un **antécédent** de b se lit dans l'autre sens (de b vers la courbe puis l'axe des x).

## L'essentiel à retenir
- **Carré** : x², positive, parabole, décroît puis croît (minimum en 0).
- **Inverse** : 1/x, non définie en 0, hyperbole, décroissante sur chaque branche.
- **Racine** : √x, définie pour x ≥ 0, croissante.
- **Image** : de x vers la courbe puis l'axe des y ; **antécédent** : le chemin inverse.$md$),

    ('Vecteurs', $md$# Vecteurs

## Ce que tu vas comprendre
Un **vecteur** décrit un **déplacement** : une direction, un sens et une longueur. C'est l'outil de la géométrie de 2de pour additionner des mouvements et démontrer des alignements ou des parallélismes.

## 1. Qu'est-ce qu'un vecteur ?
Le vecteur **AB** représente le déplacement qui va de A vers B. Il est caractérisé par :
- une **direction** (celle de la droite (AB)) ;
- un **sens** (de A vers B) ;
- une **longueur** (la distance AB), appelée **norme**.

Deux vecteurs sont **égaux** s'ils ont même direction, même sens et même longueur.

## 2. Coordonnées d'un vecteur
Dans un repère, si A(xA ; yA) et B(xB ; yB), le vecteur **AB** a pour coordonnées :

**AB (xB - xA ; yB - yA)**

*Exemple : A(1 ; 2) et B(4 ; 6) → AB (4-1 ; 6-2) = (**3 ; 4**).*

## 3. Norme d'un vecteur
La **norme** (longueur) du vecteur de coordonnées (x ; y) est :

**√(x² + y²)**

*Exemple : vecteur (3 ; 4) → √(9 + 16) = √25 = **5**.*

## 4. Somme de vecteurs
Additionner deux vecteurs, c'est **enchaîner les déplacements** (relation de Chasles) : **AB + BC = AC**. En coordonnées, on **ajoute** coordonnée par coordonnée.

## 5. Colinéarité
Deux vecteurs sont **colinéaires** quand ils ont la **même direction** (l'un est un multiple de l'autre). Critère par les coordonnées, pour u(x ; y) et v(x' ; y') :

**x·y' - y·x' = 0**

La colinéarité sert à prouver que trois points sont **alignés** ou que deux droites sont **parallèles**.

## L'essentiel à retenir
- Un vecteur = **direction + sens + longueur** (norme).
- Coordonnées de AB : **(xB - xA ; yB - yA)**.
- Norme de (x ; y) : **√(x² + y²)**.
- **Colinéarité** : x·y' - y·x' = 0 → alignement / parallélisme.$md$),

    ('Statistiques et probabilités', $md$# Statistiques et probabilités

## Ce que tu vas comprendre
Les **statistiques** résument une série de données par quelques nombres ; les **probabilités** mesurent la chance qu'un événement se produise. Deux outils pour décrire et prévoir.

## 1. Les indicateurs de position
- La **moyenne** : on additionne toutes les valeurs, on divise par leur nombre.
- La **médiane** : la valeur qui **partage la série en deux** (autant de valeurs au-dessus qu'en dessous), après avoir rangé les données.

*Exemple : série 4, 6, 8, 10 → moyenne = (4+6+8+10)/4 = 28/4 = **7**.*

## 2. Les indicateurs de dispersion
- L'**étendue** : plus grande valeur **moins** plus petite valeur.
- L'**écart** (écart-type) mesure si les valeurs sont **regroupées** autour de la moyenne ou **dispersées**.

*Exemple : série 2, 5, 9, 12 → étendue = 12 - 2 = **10**.*

## 3. Le vocabulaire des probabilités
- Une **expérience aléatoire** a plusieurs **issues** possibles (ex. lancer un dé).
- Un **événement** est un ensemble d'issues (ex. « obtenir un nombre pair »).
- La **probabilité** d'un événement est un nombre **entre 0 et 1**.

## 4. Calculer une probabilité (équiprobabilité)
Quand toutes les issues ont la même chance :

**P(événement) = (nombre d'issues favorables) ÷ (nombre d'issues possibles)**

*Exemple : dé à 6 faces, P(obtenir un 4) = 1/6 ; P(obtenir un pair) = 3/6 = **1/2**.*

## 5. Échantillonnage
Un **échantillon** est un extrait d'une population. En répétant une expérience un grand nombre de fois, la **fréquence** observée d'un événement se rapproche de sa **probabilité**.

## L'essentiel à retenir
- **Moyenne** = somme ÷ effectif ; **médiane** = valeur qui coupe la série en deux.
- **Étendue** = max - min ; l'écart-type mesure la dispersion.
- Une **probabilité** est toujours comprise **entre 0 et 1**.
- En équiprobabilité : **P = favorables ÷ possibles**.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'maths'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Ensembles de nombres et calculs', $json${
      "centre": "Ensembles de nombres et calculs",
      "branches": [
        { "titre": "Les ensembles", "enfants": ["N ⊂ Z ⊂ D ⊂ Q ⊂ R", "-3 dans Z, 1/3 dans Q", "√2 dans R pas dans Q"] },
        { "titre": "Intervalles", "enfants": ["[ ] borne comprise", "] [ borne exclue", "Vers l'infini : ouvert"] },
        { "titre": "Valeur absolue", "enfants": ["Distance à 0", "Toujours positive", "|-7| = 7"] },
        { "titre": "Calculer", "enfants": ["Priorités : × avant +", "Fractions même dénominateur", "Puissances a^m × a^n"] }
      ]
    }$json$),
    ('Équations et inéquations', $json${
      "centre": "Équations et inéquations",
      "branches": [
        { "titre": "1er degré", "enfants": ["Isoler l'inconnue", "Même opération des 2 côtés", "2x+3=11 → x=4"] },
        { "titre": "Produit nul", "enfants": ["Un facteur = 0", "(x-2)(x+5)=0", "Solutions 2 et -5"] },
        { "titre": "Inéquations", "enfants": ["Comme une équation", "× ou ÷ par négatif", "→ change le sens"] },
        { "titre": "Systèmes", "enfants": ["Substitution", "Combinaison", "x+y=5, x-y=1 → (3;2)"] }
      ]
    }$json$),
    ('Fonctions de référence', $json${
      "centre": "Fonctions de référence",
      "branches": [
        { "titre": "Carré x²", "enfants": ["Toujours positive", "Parabole", "Décroît puis croît (min en 0)"] },
        { "titre": "Inverse 1/x", "enfants": ["Non définie en 0", "Hyperbole", "Décroissante sur chaque branche"] },
        { "titre": "Racine √x", "enfants": ["Définie si x ≥ 0", "Croissante", "√4 = 2"] },
        { "titre": "Lire une courbe", "enfants": ["Image : x → courbe → y", "Antécédent : sens inverse", "Variations et extremums"] }
      ]
    }$json$),
    ('Vecteurs', $json${
      "centre": "Vecteurs",
      "branches": [
        { "titre": "Définition", "enfants": ["Direction, sens, longueur", "Vecteur AB : A vers B", "Norme = longueur"] },
        { "titre": "Coordonnées", "enfants": ["AB (xB-xA ; yB-yA)", "A(1;2) B(4;6) → (3;4)", "Norme √(x²+y²)"] },
        { "titre": "Somme", "enfants": ["Relation de Chasles", "AB + BC = AC", "Ajouter coordonnée à coordonnée"] },
        { "titre": "Colinéarité", "enfants": ["Même direction", "x·y' - y·x' = 0", "Alignement / parallélisme"] }
      ]
    }$json$),
    ('Statistiques et probabilités', $json${
      "centre": "Statistiques et probabilités",
      "branches": [
        { "titre": "Position", "enfants": ["Moyenne = somme ÷ effectif", "Médiane coupe en deux", "4,6,8,10 → moyenne 7"] },
        { "titre": "Dispersion", "enfants": ["Étendue = max - min", "Écart-type", "Regroupé ou dispersé"] },
        { "titre": "Probabilités", "enfants": ["Expérience aléatoire", "Événement, issues", "P entre 0 et 1"] },
        { "titre": "Calcul", "enfants": ["P = favorables ÷ possibles", "Dé : P(4) = 1/6", "Échantillon et fréquence"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'maths'
 WHERE c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (Si les quiz de Maths 2de existent déjà, ce bloc ne fait rien —
--     garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Maths', '2de', v.chapter, true, l.id
FROM (VALUES
  ('12219999-0000-4000-8000-000000000001'::uuid, 'Ensembles de nombres et calculs'),
  ('12219999-0000-4000-8000-000000000002'::uuid, 'Équations et inéquations'),
  ('12219999-0000-4000-8000-000000000003'::uuid, 'Fonctions de référence'),
  ('12219999-0000-4000-8000-000000000004'::uuid, 'Vecteurs'),
  ('12219999-0000-4000-8000-000000000005'::uuid, 'Statistiques et probabilités')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3b. Questions supplémentaires (positions 4→10), attachées au quiz DE LA LEÇON
--     via la jointure leçon→quiz (donc au quiz existant, quel que soit son id).
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- Chapitre 1 — Ensembles de nombres et calculs
  ('12210000-0000-4000-8000-000000000104'::uuid, 'Ensembles de nombres et calculs',
   'À quel plus petit ensemble appartient le nombre -3 ?', 'mcq',
   '["Z (entiers relatifs)", "N (entiers naturels)", "D (décimaux) seulement", "R sans être dans Q"]', 0,
   '-3 est un entier négatif : il est dans Z mais pas dans N (qui ne contient que les positifs).', 4),
  ('12210000-0000-4000-8000-000000000105'::uuid, 'Ensembles de nombres et calculs',
   'Le nombre 0,25 appartient à : ', 'mcq',
   '["D (nombres décimaux)", "N (entiers naturels)", "Z (entiers relatifs)", "R sans être dans Q"]', 0,
   '0,25 a une écriture décimale finie : c''est un nombre décimal, donc dans D.', 5),
  ('12210000-0000-4000-8000-000000000106'::uuid, 'Ensembles de nombres et calculs',
   'Tout entier naturel est aussi un entier relatif (N inclus dans Z).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On a l''emboîtement N ⊂ Z : chaque entier naturel est bien un entier relatif.', 6),
  ('12210000-0000-4000-8000-000000000107'::uuid, 'Ensembles de nombres et calculs',
   'Combien vaut la valeur absolue |-7| ?', 'mcq',
   '["7", "-7", "0", "14"]', 0,
   'La valeur absolue est la distance à 0, toujours positive : |-7| = 7.', 7),
  ('12210000-0000-4000-8000-000000000108'::uuid, 'Ensembles de nombres et calculs',
   'L''intervalle [2 ; 5[ contient : ', 'mcq',
   '["2 mais pas 5", "5 mais pas 2", "ni 2 ni 5", "2 et 5"]', 0,
   'Le crochet fermé en 2 inclut 2 ; le crochet ouvert en 5 exclut 5.', 8),
  ('12210000-0000-4000-8000-000000000109'::uuid, 'Ensembles de nombres et calculs',
   'Le nombre 1/3 est un nombre décimal.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : 1/3 = 0,333… n''a pas d''écriture décimale finie ; il est dans Q mais pas dans D.', 9),
  ('12210000-0000-4000-8000-000000000110'::uuid, 'Ensembles de nombres et calculs',
   'Le nombre √2 est un nombre : ', 'mcq',
   '["irrationnel (dans R, pas dans Q)", "rationnel", "décimal", "entier"]', 0,
   '√2 ne peut pas s''écrire comme un quotient d''entiers : il est réel mais irrationnel.', 10),

  -- Chapitre 2 — Équations et inéquations
  ('12210000-0000-4000-8000-000000000204'::uuid, 'Équations et inéquations',
   'Quelle est la solution de l''équation 2x + 3 = 11 ?', 'mcq',
   '["x = 4", "x = 7", "x = 8", "x = 5"]', 0,
   'On retire 3 : 2x = 8, puis on divise par 2 : x = 4.', 4),
  ('12210000-0000-4000-8000-000000000205'::uuid, 'Équations et inéquations',
   'Quelles sont les solutions de (x - 2)(x + 5) = 0 ?', 'mcq',
   '["2 et -5", "-2 et 5", "2 et 5", "-2 et -5"]', 0,
   'Un produit est nul si un facteur est nul : x - 2 = 0 (x = 2) ou x + 5 = 0 (x = -5).', 5),
  ('12210000-0000-4000-8000-000000000206'::uuid, 'Équations et inéquations',
   'En multipliant les deux membres d''une inéquation par un nombre négatif, on change le sens de l''inégalité.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est la règle clé des inéquations : multiplier ou diviser par un négatif inverse le sens.', 6),
  ('12210000-0000-4000-8000-000000000207'::uuid, 'Équations et inéquations',
   'Quelle est la solution de l''inéquation 3x - 6 > 0 ?', 'mcq',
   '["x > 2", "x < 2", "x > 6", "x > -2"]', 0,
   '3x > 6, puis on divise par 3 (positif, sens conservé) : x > 2.', 7),
  ('12210000-0000-4000-8000-000000000208'::uuid, 'Équations et inéquations',
   'Un produit de facteurs est nul lorsque : ', 'mcq',
   '["au moins un facteur est nul", "tous les facteurs sont nuls", "la somme des facteurs est nulle", "jamais"]', 0,
   'La propriété du produit nul : le produit est nul si et seulement si l''un au moins des facteurs est nul.', 8),
  ('12210000-0000-4000-8000-000000000209'::uuid, 'Équations et inéquations',
   'Quelle est la solution du système x + y = 5 et x - y = 1 ?', 'mcq',
   '["x = 3, y = 2", "x = 2, y = 3", "x = 4, y = 1", "x = 1, y = 4"]', 0,
   'En additionnant les deux équations : 2x = 6 donc x = 3, puis y = 2.', 9),
  ('12210000-0000-4000-8000-000000000210'::uuid, 'Équations et inéquations',
   'L''équation x² = -4 n''a aucune solution réelle.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un carré est toujours positif ou nul : il ne peut pas valoir -4. Pas de solution dans R.', 10),

  -- Chapitre 3 — Fonctions de référence
  ('12210000-0000-4000-8000-000000000304'::uuid, 'Fonctions de référence',
   'Comment varie la fonction carré f(x) = x² ?', 'mcq',
   '["Décroissante sur ]-∞ ; 0], puis croissante sur [0 ; +∞[", "Toujours croissante", "Toujours décroissante", "Constante"]', 0,
   'La parabole descend jusqu''au minimum en 0, puis remonte.', 4),
  ('12210000-0000-4000-8000-000000000305'::uuid, 'Fonctions de référence',
   'Quelle est l''image de -3 par la fonction carré ?', 'mcq',
   '["9", "-9", "6", "-6"]', 0,
   'Image de -3 : (-3)² = 9 (un carré est positif).', 5),
  ('12210000-0000-4000-8000-000000000306'::uuid, 'Fonctions de référence',
   'Comment s''appelle la courbe de la fonction carré ?', 'mcq',
   '["Une parabole", "Une hyperbole", "Une droite", "Un cercle"]', 0,
   'La courbe de x² est une parabole, symétrique par rapport à l''axe des ordonnées.', 6),
  ('12210000-0000-4000-8000-000000000307'::uuid, 'Fonctions de référence',
   'La fonction inverse f(x) = 1/x est définie en 0.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : on ne divise pas par 0. La fonction inverse n''est pas définie en 0.', 7),
  ('12210000-0000-4000-8000-000000000308'::uuid, 'Fonctions de référence',
   'Quelle est l''image de 4 par la fonction racine carrée √x ?', 'mcq',
   '["2", "16", "8", "4"]', 0,
   '√4 = 2, car 2 × 2 = 4.', 8),
  ('12210000-0000-4000-8000-000000000309'::uuid, 'Fonctions de référence',
   'Comment s''appelle la courbe de la fonction inverse ?', 'mcq',
   '["Une hyperbole", "Une parabole", "Une droite", "Un segment"]', 0,
   'La courbe de 1/x est une hyperbole, formée de deux branches.', 9),
  ('12210000-0000-4000-8000-000000000310'::uuid, 'Fonctions de référence',
   'La fonction inverse est décroissante sur ]0 ; +∞[.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Sur les réels strictement positifs, plus x augmente, plus 1/x diminue : elle décroît.', 10),

  -- Chapitre 4 — Vecteurs
  ('12210000-0000-4000-8000-000000000404'::uuid, 'Vecteurs',
   'Par quoi un vecteur est-il caractérisé ?', 'mcq',
   '["Une direction, un sens et une longueur", "Un seul point", "Une couleur", "Uniquement sa longueur"]', 0,
   'Un vecteur possède une direction, un sens et une longueur (sa norme).', 4),
  ('12210000-0000-4000-8000-000000000405'::uuid, 'Vecteurs',
   'A(1 ; 2) et B(4 ; 6). Quelles sont les coordonnées du vecteur AB ?', 'mcq',
   '["(3 ; 4)", "(4 ; 6)", "(5 ; 8)", "(-3 ; -4)"]', 0,
   'AB (xB - xA ; yB - yA) = (4 - 1 ; 6 - 2) = (3 ; 4).', 5),
  ('12210000-0000-4000-8000-000000000406'::uuid, 'Vecteurs',
   'Deux vecteurs colinéaires ont : ', 'mcq',
   '["la même direction", "des sens toujours opposés", "des directions perpendiculaires", "toujours la même longueur"]', 0,
   'Colinéaires = même direction (l''un est un multiple de l''autre) ; le sens et la longueur peuvent différer.', 6),
  ('12210000-0000-4000-8000-000000000407'::uuid, 'Vecteurs',
   'Le vecteur AB et le vecteur BA ont le même sens.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : ils ont la même direction et la même longueur, mais des sens opposés.', 7),
  ('12210000-0000-4000-8000-000000000408'::uuid, 'Vecteurs',
   'Quelle est la norme du vecteur de coordonnées (3 ; 4) ?', 'mcq',
   '["5", "7", "12", "25"]', 0,
   'Norme = √(3² + 4²) = √(9 + 16) = √25 = 5.', 8),
  ('12210000-0000-4000-8000-000000000409'::uuid, 'Vecteurs',
   'Quel est le critère de colinéarité de u(x ; y) et v(x'' ; y'') ?', 'mcq',
   '["x·y'' - y·x'' = 0", "x + y'' = 0", "x·x'' + y·y'' = 0", "x - y = 0"]', 0,
   'Deux vecteurs sont colinéaires lorsque leur déterminant x·y'' - y·x'' est nul.', 9),
  ('12210000-0000-4000-8000-000000000410'::uuid, 'Vecteurs',
   'Dans un parallélogramme ABCD, on a vecteur AB = vecteur DC.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Dans le parallélogramme ABCD, les côtés [AB] et [DC] sont parallèles, de même longueur et de même sens : AB = DC.', 10),

  -- Chapitre 5 — Statistiques et probabilités
  ('12210000-0000-4000-8000-000000000504'::uuid, 'Statistiques et probabilités',
   'Quelle est la moyenne de la série 4, 6, 8, 10 ?', 'mcq',
   '["7", "6", "8", "28"]', 0,
   'Moyenne = (4 + 6 + 8 + 10) ÷ 4 = 28 ÷ 4 = 7.', 4),
  ('12210000-0000-4000-8000-000000000505'::uuid, 'Statistiques et probabilités',
   'Quelle est la médiane de la série rangée 3, 5, 7, 9, 11 ?', 'mcq',
   '["7", "5", "9", "6"]', 0,
   'Avec 5 valeurs rangées, la médiane est la 3e (celle du milieu) : 7.', 5),
  ('12210000-0000-4000-8000-000000000506'::uuid, 'Statistiques et probabilités',
   'En lançant un dé équilibré à 6 faces, quelle est la probabilité d''obtenir un 4 ?', 'mcq',
   '["1/6", "1/4", "1/2", "4/6"]', 0,
   'Une seule issue favorable sur 6 possibles équiprobables : P = 1/6.', 6),
  ('12210000-0000-4000-8000-000000000507'::uuid, 'Statistiques et probabilités',
   'Avec un dé à 6 faces, quelle est la probabilité d''obtenir un nombre pair ?', 'mcq',
   '["1/2", "1/3", "1/6", "1/4"]', 0,
   'Les pairs sont 2, 4, 6 : 3 issues favorables sur 6, soit 3/6 = 1/2.', 7),
  ('12210000-0000-4000-8000-000000000508'::uuid, 'Statistiques et probabilités',
   'Une probabilité est toujours comprise entre 0 et 1.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Par définition, une probabilité est un nombre entre 0 (impossible) et 1 (certain).', 8),
  ('12210000-0000-4000-8000-000000000509'::uuid, 'Statistiques et probabilités',
   'Quelle est l''étendue de la série 2, 5, 9, 12 ?', 'mcq',
   '["10", "12", "7", "14"]', 0,
   'Étendue = valeur maximale - valeur minimale = 12 - 2 = 10.', 9),
  ('12210000-0000-4000-8000-000000000510'::uuid, 'Statistiques et probabilités',
   'Quelle est la probabilité d''un événement certain ?', 'mcq',
   '["1", "0", "0,5", "100"]', 0,
   'Un événement certain se réalise toujours : sa probabilité vaut 1.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
