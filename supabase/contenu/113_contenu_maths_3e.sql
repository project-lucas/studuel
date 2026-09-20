-- =============================================================================
-- Studuel — Migration 113 : CONTENU Maths 3e (+ exercices type brevet)
-- Remplit les 5 chapitres de Maths 3e (programme cycle 4, Éduscol) :
--   1. Cours          → lessons.content de « L'essentiel du cours » (position 1)
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (positions 4→10, jointure
--                       leçon→quiz robuste à l'id existant ; filet si absent)
--   4. Exercices brevet → lessons.content de « Exercices types » (position 2) :
--                       2 exercices type DNB corrigés pas à pas par chapitre.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 029 (mind_map), 002 (quizzes).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Arithmétique', $md$# Arithmétique

## Ce que tu vas comprendre
L'arithmétique étudie les nombres entiers : comment ils se divisent, se décomposent, et comment on simplifie une fraction. C'est un chapitre incontournable du brevet.

## 1. Multiples et diviseurs
Un nombre **a est divisible** par b si la division a ÷ b tombe juste (reste nul). On dit alors que b est un **diviseur** de a, et que a est un **multiple** de b.

*Exemple : 12 est divisible par 3 car 12 ÷ 3 = 4. Les diviseurs de 12 sont 1, 2, 3, 4, 6 et 12.*

## 2. Critères de divisibilité
- Par **2** : le nombre se termine par 0, 2, 4, 6 ou 8.
- Par **3** : la somme des chiffres est un multiple de 3.
- Par **5** : le nombre se termine par 0 ou 5.
- Par **9** : la somme des chiffres est un multiple de 9.

*Exemple : 138 est divisible par 3 car 1 + 3 + 8 = 12, et 12 est un multiple de 3.*

## 3. Nombres premiers
Un **nombre premier** a exactement **deux diviseurs** : 1 et lui-même. Les premiers sont : 2, 3, 5, 7, 11, 13, 17, 19…

> **Attention :** 1 n'est **pas** un nombre premier (il n'a qu'un seul diviseur). 2 est le seul nombre premier pair.

## 4. Le PGCD
Le **PGCD** de deux nombres est leur **Plus Grand Commun Diviseur** : le plus grand nombre qui les divise tous les deux.

*Exemple : les diviseurs communs de 12 et 18 sont 1, 2, 3 et 6. Le plus grand est 6, donc PGCD(12 ; 18) = 6.*

On peut le trouver par **soustractions successives** ou par l'**algorithme d'Euclide** (divisions successives).

## 5. Fractions irréductibles
Une fraction est **irréductible** quand on ne peut plus la simplifier : son numérateur et son dénominateur n'ont plus aucun diviseur commun (leur PGCD vaut 1).

*Exemple : pour rendre 12/18 irréductible, on divise haut et bas par le PGCD (6) : 12/18 = 2/3.*

## L'essentiel à retenir
- b est un **diviseur** de a si la division tombe juste.
- Un **nombre premier** a exactement deux diviseurs (1 et lui-même) ; 1 n'est pas premier.
- Le **PGCD** est le plus grand diviseur commun (ex. PGCD(12 ; 18) = 6).
- On rend une fraction **irréductible** en divisant par le PGCD du numérateur et du dénominateur.$md$),

    ('Fonctions linéaires et affines', $md$# Fonctions linéaires et affines

## Ce que tu vas comprendre
Une **fonction** transforme un nombre en un autre. Au brevet, deux familles reviennent sans cesse : les fonctions **linéaires** (la proportionnalité) et les fonctions **affines**. Ce chapitre t'apprend à les reconnaître, les calculer et les représenter.

## 1. Vocabulaire des fonctions
Une fonction f associe à un nombre x une **image** notée f(x). Le nombre x est appelé un **antécédent**.

*Exemple : pour f(x) = 2x + 1, l'image de 3 est f(3) = 2 × 3 + 1 = 7.*

## 2. Les fonctions linéaires
Une **fonction linéaire** s'écrit **f(x) = ax**, où a est un nombre fixe. Elle traduit une **situation de proportionnalité** : le nombre a est le coefficient de proportionnalité.

*Exemple : f(x) = 3x est linéaire, de coefficient 3 ; f(4) = 3 × 4 = 12.*

## 3. Les fonctions affines
Une **fonction affine** s'écrit **f(x) = ax + b**.
- **a** est le **coefficient directeur** (la pente de la droite).
- **b** est l'**ordonnée à l'origine** (la valeur de f quand x = 0).

Une fonction linéaire est un cas particulier de fonction affine, avec b = 0.

## 4. Représentation graphique
La représentation graphique d'une fonction affine est une **droite**.
- Fonction **linéaire** : la droite passe par l'**origine** (0 ; 0).
- Le coefficient directeur **a** indique si la droite monte (a > 0) ou descend (a < 0).

*Exemple : f(x) = 2x + 1 est la droite qui coupe l'axe des ordonnées en 1 et monte de 2 quand x augmente de 1.*

## 5. Calculer le coefficient directeur
Avec deux points d'une droite, a se calcule par : **a = (différence des y) ÷ (différence des x)**.

*Exemple : la droite passe par (1 ; 5) et (3 ; 11) : a = (11 − 5) ÷ (3 − 1) = 6 ÷ 2 = 3.*

## L'essentiel à retenir
- **Linéaire : f(x) = ax** (proportionnalité, droite passant par l'origine).
- **Affine : f(x) = ax + b** (droite quelconque).
- **a** = coefficient directeur (pente) ; **b** = ordonnée à l'origine.
- Image de x : on remplace x par sa valeur dans l'expression de la fonction.$md$),

    ('Théorème de Thalès', $md$# Théorème de Thalès

## Ce que tu vas comprendre
Le théorème de Thalès permet de **calculer des longueurs** dans une figure où deux droites parallèles coupent deux droites sécantes. C'est un grand classique du brevet.

## 1. La configuration de Thalès
On a deux droites sécantes en un point A. Des points M et B sont sur l'une, N et C sur l'autre. Si les droites **(MN) et (BC) sont parallèles**, on est dans une configuration de Thalès (« triangles emboîtés » ou « papillon »).

## 2. L'énoncé du théorème
Si (MN) est parallèle à (BC), alors les longueurs sont proportionnelles :

**AM / AB = AN / AC = MN / BC**

Les trois rapports sont égaux : cela forme un tableau de proportionnalité.

## 3. Calculer une longueur
On écrit l'égalité des rapports utiles, puis on utilise le **produit en croix**.

*Exemple : AM = 3, AB = 6, BC = 8 et (MN) // (BC). L'égalité AM/AB = MN/BC donne 3/6 = MN/8, donc MN = (3 × 8) ÷ 6 = 24 ÷ 6 = 4 cm.*

## 4. La réciproque de Thalès
La réciproque sert à **prouver que deux droites sont parallèles**.
Si AM/AB = AN/AC **et** si les points sont **alignés dans le même ordre**, alors (MN) est parallèle à (BC).

## 5. Agrandissement et réduction
Quand on passe d'une figure à son agrandissement, toutes les longueurs sont multipliées par un même nombre k, le **coefficient d'agrandissement**. Le théorème de Thalès traduit cette proportionnalité.

## L'essentiel à retenir
- Configuration : deux droites sécantes + deux droites **parallèles**.
- Théorème : **AM/AB = AN/AC = MN/BC** (les trois rapports sont égaux).
- On calcule une longueur inconnue avec le **produit en croix**.
- La **réciproque** (rapports égaux + même ordre) prouve que deux droites sont parallèles.$md$),

    ('Trigonométrie', $md$# Trigonométrie

## Ce que tu vas comprendre
La trigonométrie relie les **angles** et les **longueurs** dans un **triangle rectangle**. Grâce à trois formules (cosinus, sinus, tangente), tu peux calculer une longueur ou un angle manquant.

## 1. Le vocabulaire du triangle rectangle
Dans un triangle rectangle, le côté le plus long, situé face à l'angle droit, est l'**hypoténuse**. Par rapport à un angle aigu choisi :
- le côté **adjacent** touche cet angle ;
- le côté **opposé** est en face de cet angle.

## 2. Les trois formules (SOH-CAH-TOA)
Pour un angle aigu, on définit :
- **cos** = **adjacent / hypoténuse** (CAH)
- **sin** = **opposé / hypoténuse** (SOH)
- **tan** = **opposé / adjacent** (TOA)

Le moyen mnémotechnique **SOH-CAH-TOA** aide à ne plus les confondre.

## 3. Calculer une longueur
*Exemple : dans un triangle rectangle, l'hypoténuse mesure 10 cm et l'angle vaut 60°. Quel est le côté adjacent ?
cos(60°) = adjacent / 10, donc adjacent = 10 × cos(60°) = 10 × 0,5 = 5 cm.*

## 4. Calculer un angle
Quand on connaît deux longueurs, on retrouve l'angle avec les touches **cos⁻¹, sin⁻¹, tan⁻¹** de la calculatrice.

*Exemple : adjacent = 5, hypoténuse = 10, donc cos(angle) = 5/10 = 0,5, d'où angle = 60°.*

## 5. Valeurs utiles à connaître
- cos(60°) = 0,5 ; sin(30°) = 0,5 ; tan(45°) = 1.
- Le cosinus et le sinus d'un angle aigu sont toujours **compris entre 0 et 1**.

## L'essentiel à retenir
- **Hypoténuse** = côté face à l'angle droit (le plus long).
- **SOH-CAH-TOA** : sin = opp/hyp, cos = adj/hyp, tan = opp/adj.
- Pour une longueur : on isole l'inconnue (produit en croix).
- Pour un angle : touche cos⁻¹, sin⁻¹ ou tan⁻¹ de la calculatrice.$md$),

    ('Probabilités et statistiques', $md$# Probabilités et statistiques

## Ce que tu vas comprendre
Les **statistiques** résument une série de données (moyenne, médiane, étendue). Les **probabilités** mesurent la chance qu'un événement se réalise. Deux thèmes que le brevet adore.

## 1. La probabilité d'un événement
La **probabilité** d'un événement est un nombre compris entre **0** (impossible) et **1** (certain) :

**P = nombre de cas favorables / nombre de cas possibles**

*Exemple : avec un dé à 6 faces, P(obtenir un 6) = 1/6. P(obtenir un nombre pair) = 3/6 = 1/2.*

## 2. Vocabulaire
- Un événement **certain** a une probabilité de 1 ; un événement **impossible**, de 0.
- Deux événements sont **contraires** quand la somme de leurs probabilités vaut 1.

## 3. L'arbre des probabilités
Pour une expérience à **plusieurs étapes**, on dessine un **arbre**. On **multiplie** les probabilités le long des branches d'un chemin.

*Exemple : pour deux lancers de pièce, P(pile puis pile) = 1/2 × 1/2 = 1/4.*

## 4. La moyenne
La **moyenne** d'une série est la somme de toutes les valeurs divisée par leur nombre (l'effectif).

*Exemple : notes 8, 12, 10, 14 → moyenne = (8 + 12 + 10 + 14) ÷ 4 = 44 ÷ 4 = 11.*

## 5. Médiane et étendue
- La **médiane** partage la série **ordonnée** en deux moitiés : au moins la moitié des valeurs lui sont inférieures ou égales.
- L'**étendue** est la différence entre la plus grande et la plus petite valeur.

*Exemple : pour 3, 7, 8, 10, 15, la médiane est 8 (valeur du milieu) et l'étendue vaut 15 − 3 = 12.*

## L'essentiel à retenir
- **Probabilité = cas favorables / cas possibles**, entre 0 et 1.
- Dans un **arbre**, on multiplie les probabilités le long des branches.
- **Moyenne** = somme ÷ effectif.
- **Médiane** = valeur du milieu ; **étendue** = max − min.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'maths'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Arithmétique', $json${
      "centre": "Arithmétique",
      "branches": [
        { "titre": "Diviseurs et multiples", "enfants": ["b divise a : reste nul", "Diviseurs de 12 : 1,2,3,4,6,12", "Critères par 2, 3, 5, 9"] },
        { "titre": "Nombres premiers", "enfants": ["Exactement 2 diviseurs", "2, 3, 5, 7, 11, 13…", "1 n'est pas premier"] },
        { "titre": "Le PGCD", "enfants": ["Plus Grand Commun Diviseur", "PGCD(12 ; 18) = 6", "Euclide ou soustractions"] },
        { "titre": "Fractions irréductibles", "enfants": ["Diviser par le PGCD", "12/18 = 2/3", "PGCD du résultat = 1"] }
      ]
    }$json$),
    ('Fonctions linéaires et affines', $json${
      "centre": "Fonctions linéaires et affines",
      "branches": [
        { "titre": "Vocabulaire", "enfants": ["Image f(x) et antécédent x", "f(3) : on remplace x par 3", "f(x) = 2x+1 → f(3)=7"] },
        { "titre": "Linéaire f(x)=ax", "enfants": ["Proportionnalité", "Coefficient a", "Droite par l'origine"] },
        { "titre": "Affine f(x)=ax+b", "enfants": ["a = coefficient directeur", "b = ordonnée à l'origine", "Cas b=0 → linéaire"] },
        { "titre": "Représentation", "enfants": ["Toujours une droite", "a>0 monte, a<0 descend", "a = (Δy) ÷ (Δx)"] }
      ]
    }$json$),
    ('Théorème de Thalès', $json${
      "centre": "Théorème de Thalès",
      "branches": [
        { "titre": "Configuration", "enfants": ["Deux droites sécantes en A", "(MN) // (BC)", "Triangles emboîtés / papillon"] },
        { "titre": "Le théorème", "enfants": ["AM/AB = AN/AC = MN/BC", "Trois rapports égaux", "Tableau de proportionnalité"] },
        { "titre": "Calculer une longueur", "enfants": ["Écrire l'égalité des rapports", "Produit en croix", "3/6 = MN/8 → MN = 4"] },
        { "titre": "La réciproque", "enfants": ["Rapports égaux", "Points dans le même ordre", "Prouve le parallélisme"] }
      ]
    }$json$),
    ('Trigonométrie', $json${
      "centre": "Trigonométrie",
      "branches": [
        { "titre": "Triangle rectangle", "enfants": ["Hypoténuse = plus long côté", "Côté adjacent à l'angle", "Côté opposé à l'angle"] },
        { "titre": "SOH-CAH-TOA", "enfants": ["sin = opposé / hypoténuse", "cos = adjacent / hypoténuse", "tan = opposé / adjacent"] },
        { "titre": "Calculer une longueur", "enfants": ["Isoler l'inconnue", "Produit en croix", "adj = 10 × cos(60°) = 5"] },
        { "titre": "Calculer un angle", "enfants": ["Deux longueurs connues", "Touches cos⁻¹, sin⁻¹, tan⁻¹", "cos = 0,5 → 60°"] }
      ]
    }$json$),
    ('Probabilités et statistiques', $json${
      "centre": "Probabilités et statistiques",
      "branches": [
        { "titre": "Probabilité", "enfants": ["Cas favorables / cas possibles", "Entre 0 et 1", "Dé : P(6) = 1/6"] },
        { "titre": "Événements", "enfants": ["Certain = 1, impossible = 0", "Contraires : somme = 1", "P(pair) = 3/6 = 1/2"] },
        { "titre": "L'arbre", "enfants": ["Plusieurs étapes", "Multiplier le long des branches", "Pile puis pile = 1/4"] },
        { "titre": "Statistiques", "enfants": ["Moyenne = somme ÷ effectif", "Médiane = valeur du milieu", "Étendue = max − min"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'maths'
 WHERE c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz 3e ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Maths', '3e', v.chapter, true, l.id
FROM (VALUES
  ('11319999-0000-4000-8000-000000000001'::uuid, 'Arithmétique'),
  ('11319999-0000-4000-8000-000000000002'::uuid, 'Fonctions linéaires et affines'),
  ('11319999-0000-4000-8000-000000000003'::uuid, 'Théorème de Thalès'),
  ('11319999-0000-4000-8000-000000000004'::uuid, 'Trigonométrie'),
  ('11319999-0000-4000-8000-000000000005'::uuid, 'Probabilités et statistiques')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
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
  -- Chapitre 1 — Arithmétique
  ('11310000-0000-4000-8000-000000000104'::uuid, 'Arithmétique',
   'Combien de diviseurs possède un nombre premier ?', 'mcq',
   '["Exactement deux", "Un seul", "Au moins trois", "Cela dépend du nombre"]', 0,
   'Un nombre premier a exactement deux diviseurs : 1 et lui-même.', 4),
  ('11310000-0000-4000-8000-000000000105'::uuid, 'Arithmétique',
   'Quel est le PGCD de 12 et 18 ?', 'mcq',
   '["6", "3", "2", "36"]', 0,
   'Les diviseurs communs de 12 et 18 sont 1, 2, 3 et 6 : le plus grand est 6.', 5),
  ('11310000-0000-4000-8000-000000000106'::uuid, 'Arithmétique',
   '1 est un nombre premier.', 'true_false',
   '["Vrai", "Faux"]', 1,
   '1 n''est pas premier : il ne possède qu''un seul diviseur, alors qu''un premier en a deux.', 6),
  ('11310000-0000-4000-8000-000000000107'::uuid, 'Arithmétique',
   'Sous forme irréductible, la fraction 12/18 est égale à : ', 'mcq',
   '["2/3", "6/9", "4/6", "3/2"]', 0,
   'On divise le numérateur et le dénominateur par le PGCD (6) : 12/18 = 2/3.', 7),
  ('11310000-0000-4000-8000-000000000108'::uuid, 'Arithmétique',
   'Le nombre 138 est-il divisible par 3 ?', 'true_false',
   '["Vrai", "Faux"]', 0,
   '1 + 3 + 8 = 12, qui est un multiple de 3 : donc 138 est divisible par 3.', 8),
  ('11310000-0000-4000-8000-000000000109'::uuid, 'Arithmétique',
   'Lequel de ces nombres n''est PAS un diviseur de 12 ?', 'mcq',
   '["5", "4", "6", "3"]', 0,
   'Les diviseurs de 12 sont 1, 2, 3, 4, 6 et 12 : 5 n''en fait pas partie.', 9),
  ('11310000-0000-4000-8000-000000000110'::uuid, 'Arithmétique',
   'Quel est le plus petit nombre premier ?', 'mcq',
   '["2", "1", "0", "3"]', 0,
   '2 est le plus petit nombre premier (et le seul qui soit pair).', 10),

  -- Chapitre 2 — Fonctions linéaires et affines
  ('11310000-0000-4000-8000-000000000204'::uuid, 'Fonctions linéaires et affines',
   'Pour f(x) = 2x + 1, que vaut l''image de 3 ?', 'mcq',
   '["7", "6", "5", "9"]', 0,
   'f(3) = 2 × 3 + 1 = 6 + 1 = 7.', 4),
  ('11310000-0000-4000-8000-000000000205'::uuid, 'Fonctions linéaires et affines',
   'Une fonction de la forme f(x) = ax est dite : ', 'mcq',
   '["Linéaire", "Affine avec b non nul", "Constante", "Inverse"]', 0,
   'f(x) = ax est une fonction linéaire : elle traduit une proportionnalité.', 5),
  ('11310000-0000-4000-8000-000000000206'::uuid, 'Fonctions linéaires et affines',
   'Quel est le coefficient directeur de f(x) = 3x − 2 ?', 'mcq',
   '["3", "−2", "1", "6"]', 0,
   'Sous la forme ax + b, le coefficient directeur est a, ici 3.', 6),
  ('11310000-0000-4000-8000-000000000207'::uuid, 'Fonctions linéaires et affines',
   'La représentation graphique d''une fonction linéaire passe par l''origine.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une fonction linéaire f(x) = ax a une droite qui passe par le point (0 ; 0).', 7),
  ('11310000-0000-4000-8000-000000000208'::uuid, 'Fonctions linéaires et affines',
   'Pour la fonction linéaire f(x) = 3x, combien vaut f(4) ?', 'mcq',
   '["12", "7", "3", "1"]', 0,
   'f(4) = 3 × 4 = 12.', 8),
  ('11310000-0000-4000-8000-000000000209'::uuid, 'Fonctions linéaires et affines',
   'Quelle est l''ordonnée à l''origine de f(x) = 2x + 5 ?', 'mcq',
   '["5", "2", "0", "7"]', 0,
   'L''ordonnée à l''origine est b = 5, c''est-à-dire f(0).', 9),
  ('11310000-0000-4000-8000-000000000210'::uuid, 'Fonctions linéaires et affines',
   'Une droite passe par (1 ; 5) et (3 ; 11). Quel est son coefficient directeur ?', 'mcq',
   '["3", "6", "2", "8"]', 0,
   'a = (11 − 5) ÷ (3 − 1) = 6 ÷ 2 = 3.', 10),

  -- Chapitre 3 — Théorème de Thalès
  ('11310000-0000-4000-8000-000000000304'::uuid, 'Théorème de Thalès',
   'Quelle condition permet d''appliquer le théorème de Thalès ?', 'mcq',
   '["Deux droites parallèles", "Un angle droit", "Un cercle", "Deux côtés égaux"]', 0,
   'Le théorème de Thalès s''applique lorsque deux droites sont parallèles.', 4),
  ('11310000-0000-4000-8000-000000000305'::uuid, 'Théorème de Thalès',
   'Dans une configuration de Thalès, AM/AB = AN/AC = … ?', 'mcq',
   '["MN/BC", "BC/MN", "AB/AC", "AN/AB"]', 0,
   'Les trois rapports sont égaux : AM/AB = AN/AC = MN/BC.', 5),
  ('11310000-0000-4000-8000-000000000306'::uuid, 'Théorème de Thalès',
   'AM = 4, AB = 6, BC = 9 et (MN) // (BC). Combien vaut MN ?', 'mcq',
   '["6 cm", "5 cm", "3 cm", "13,5 cm"]', 0,
   '4/6 = MN/9, donc MN = (4 × 9) ÷ 6 = 36 ÷ 6 = 6 cm.', 6),
  ('11310000-0000-4000-8000-000000000307'::uuid, 'Théorème de Thalès',
   'La réciproque du théorème de Thalès sert à prouver que deux droites sont parallèles.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'À partir de rapports égaux (et de points dans le même ordre), la réciproque démontre le parallélisme.', 7),
  ('11310000-0000-4000-8000-000000000308'::uuid, 'Théorème de Thalès',
   'Pour calculer une longueur avec Thalès, on utilise : ', 'mcq',
   '["Le produit en croix", "Le rapporteur", "La calculatrice graphique", "Un compas"]', 0,
   'Après avoir écrit l''égalité des rapports, on applique le produit en croix.', 8),
  ('11310000-0000-4000-8000-000000000309'::uuid, 'Théorème de Thalès',
   'AM = 2, AB = 5, BC = 10 et (MN) // (BC). Combien vaut MN ?', 'mcq',
   '["4", "5", "2,5", "20"]', 0,
   '2/5 = MN/10, donc MN = (2 × 10) ÷ 5 = 20 ÷ 5 = 4.', 9),
  ('11310000-0000-4000-8000-000000000310'::uuid, 'Théorème de Thalès',
   'Dans un agrandissement, toutes les longueurs sont multipliées par le même nombre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un agrandissement multiplie toutes les longueurs par un même coefficient k.', 10),

  -- Chapitre 4 — Trigonométrie
  ('11310000-0000-4000-8000-000000000404'::uuid, 'Trigonométrie',
   'Dans un triangle rectangle, le cosinus d''un angle aigu vaut : ', 'mcq',
   '["adjacent / hypoténuse", "opposé / hypoténuse", "opposé / adjacent", "hypoténuse / adjacent"]', 0,
   'CAH : le cosinus est le côté adjacent divisé par l''hypoténuse.', 4),
  ('11310000-0000-4000-8000-000000000405'::uuid, 'Trigonométrie',
   'Le sinus d''un angle est égal au côté opposé divisé par l''hypoténuse.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'SOH : sinus = opposé / hypoténuse.', 5),
  ('11310000-0000-4000-8000-000000000406'::uuid, 'Trigonométrie',
   'Hypoténuse = 10 cm, angle = 60°. Quel est le côté adjacent ? (cos 60° = 0,5)', 'mcq',
   '["5 cm", "10 cm", "0,5 cm", "8 cm"]', 0,
   'adjacent = 10 × cos(60°) = 10 × 0,5 = 5 cm.', 6),
  ('11310000-0000-4000-8000-000000000407'::uuid, 'Trigonométrie',
   'Si cos(angle) = 0,5, combien mesure l''angle ?', 'mcq',
   '["60°", "30°", "45°", "90°"]', 0,
   'À la calculatrice, cos⁻¹(0,5) = 60°.', 7),
  ('11310000-0000-4000-8000-000000000408'::uuid, 'Trigonométrie',
   'Dans un triangle rectangle, l''hypoténuse est : ', 'mcq',
   '["Le côté opposé à l''angle droit", "Le plus petit côté", "Un côté de l''angle droit", "Toujours vertical"]', 0,
   'L''hypoténuse est le côté le plus long, opposé à l''angle droit.', 8),
  ('11310000-0000-4000-8000-000000000409'::uuid, 'Trigonométrie',
   'La tangente d''un angle est égale à : ', 'mcq',
   '["opposé / adjacent", "adjacent / opposé", "opposé / hypoténuse", "adjacent / hypoténuse"]', 0,
   'TOA : la tangente est le côté opposé divisé par le côté adjacent.', 9),
  ('11310000-0000-4000-8000-000000000410'::uuid, 'Trigonométrie',
   'Le cosinus d''un angle aigu est toujours compris entre 0 et 1.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Dans un triangle rectangle, le cosinus d''un angle aigu est un nombre entre 0 et 1.', 10),

  -- Chapitre 5 — Probabilités et statistiques
  ('11310000-0000-4000-8000-000000000504'::uuid, 'Probabilités et statistiques',
   'On lance un dé à 6 faces. Quelle est la probabilité d''obtenir un 6 ?', 'mcq',
   '["1/6", "1/2", "1/3", "6"]', 0,
   'Un seul cas favorable (le 6) sur 6 cas possibles : P = 1/6.', 4),
  ('11310000-0000-4000-8000-000000000505'::uuid, 'Probabilités et statistiques',
   'Quelle est la moyenne des notes 8, 12, 10 et 14 ?', 'mcq',
   '["11", "44", "10", "12"]', 0,
   '(8 + 12 + 10 + 14) ÷ 4 = 44 ÷ 4 = 11.', 5),
  ('11310000-0000-4000-8000-000000000506'::uuid, 'Probabilités et statistiques',
   'Quelle est l''étendue de la série 3, 7, 8, 10, 15 ?', 'mcq',
   '["12", "8", "15", "3"]', 0,
   'Étendue = plus grande valeur − plus petite valeur = 15 − 3 = 12.', 6),
  ('11310000-0000-4000-8000-000000000507'::uuid, 'Probabilités et statistiques',
   'Quelle est la médiane de la série 3, 7, 8, 10, 15 ?', 'mcq',
   '["8", "10", "7", "43"]', 0,
   'La série ordonnée a 5 valeurs : la médiane est celle du milieu, soit 8.', 7),
  ('11310000-0000-4000-8000-000000000508'::uuid, 'Probabilités et statistiques',
   'Une probabilité est toujours comprise entre 0 et 1.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '0 correspond à un événement impossible, 1 à un événement certain.', 8),
  ('11310000-0000-4000-8000-000000000509'::uuid, 'Probabilités et statistiques',
   'On lance deux fois une pièce. Quelle est la probabilité d''obtenir pile puis pile ?', 'mcq',
   '["1/4", "1/2", "1/8", "1"]', 0,
   'On multiplie le long de l''arbre : 1/2 × 1/2 = 1/4.', 9),
  ('11310000-0000-4000-8000-000000000510'::uuid, 'Probabilités et statistiques',
   'Avec un dé à 6 faces, quelle est la probabilité d''obtenir un nombre pair ?', 'mcq',
   '["1/2", "1/6", "1/3", "2/3"]', 0,
   'Trois nombres pairs (2, 4, 6) sur 6 possibles : 3/6 = 1/2.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BREVET — lessons.content de « Exercices types » (position 2)
--    2 exercices type DNB corrigés pas à pas par chapitre.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Arithmétique', $md$# Exercices types — Arithmétique

## Exercice 1 — Les bouquets du fleuriste
Un fleuriste dispose de **24 roses** et **36 tulipes**. Il souhaite réaliser le plus grand nombre possible de bouquets **identiques**, en utilisant **toutes** ses fleurs.

a) Quel est le nombre maximal de bouquets qu'il peut composer ?
b) Combien de roses et de tulipes y aura-t-il alors dans chaque bouquet ?

### Correction
a) Le nombre de bouquets doit diviser à la fois 24 et 36 : c'est le **PGCD(24 ; 36)**.
- Diviseurs de 24 : 1, 2, 3, 4, 6, 8, 12, 24.
- Diviseurs de 36 : 1, 2, 3, 4, 6, 9, 12, 18, 36.
- Le plus grand diviseur commun est **12**. Il peut donc composer **12 bouquets**.

b) On répartit les fleurs dans les 12 bouquets :
- Roses : 24 ÷ 12 = **2 roses** par bouquet.
- Tulipes : 36 ÷ 12 = **3 tulipes** par bouquet.

## Exercice 2 — Rendre une fraction irréductible
On considère la fraction 84/120.

a) Décompose 84 et 120 en produits de facteurs, puis calcule le PGCD de 84 et 120.
b) Rends la fraction 84/120 irréductible.

### Correction
a) Décomposition : 84 = 2 × 2 × 3 × 7 et 120 = 2 × 2 × 2 × 3 × 5.
Les facteurs communs sont 2 × 2 × 3, donc **PGCD(84 ; 120) = 12**.

b) On divise le numérateur et le dénominateur par le PGCD :
84/120 = (84 ÷ 12) / (120 ÷ 12) = **7/10**.
Comme PGCD(7 ; 10) = 1, la fraction **7/10** est bien irréductible.$md$),

    ('Fonctions linéaires et affines', $md$# Exercices types — Fonctions linéaires et affines

## Exercice 1 — Deux abonnements de sport
Une salle de sport propose deux tarifs pour x séances :
- Tarif A (fonction affine) : f(x) = 5x + 20.
- Tarif B (fonction linéaire) : g(x) = 8x.

a) Calcule le prix de 10 séances avec chaque tarif.
b) Pour combien de séances les deux tarifs sont-ils égaux ?

### Correction
a) Pour x = 10 :
- Tarif A : f(10) = 5 × 10 + 20 = 50 + 20 = **70 €**.
- Tarif B : g(10) = 8 × 10 = **80 €**.

b) On cherche x tel que f(x) = g(x) :
5x + 20 = 8x
20 = 8x − 5x
20 = 3x
x = 20 ÷ 3 ≈ **6,7 séances**.
Les deux tarifs sont donc égaux vers 6,7 séances : à partir de 7 séances, le tarif A (avec abonnement) devient plus avantageux.

## Exercice 2 — Lecture d'une fonction affine
Soit la fonction affine définie par h(x) = 2x − 3.

a) Donne le coefficient directeur et l'ordonnée à l'origine de h.
b) Calcule l'image de 4, puis l'antécédent de 7.

### Correction
a) La fonction s'écrit sous la forme ax + b avec a = 2 et b = −3.
- Coefficient directeur : **a = 2**.
- Ordonnée à l'origine : **b = −3** (c'est la valeur de h(0)).

b) Image de 4 : h(4) = 2 × 4 − 3 = 8 − 3 = **5**.
Antécédent de 7 : on résout h(x) = 7, soit 2x − 3 = 7, donc 2x = 10, d'où x = **5**.$md$),

    ('Théorème de Thalès', $md$# Exercices types — Théorème de Thalès

## Exercice 1 — Calcul d'une longueur
Les points A, M, B sont alignés, ainsi que A, N, C. Les droites (MN) et (BC) sont parallèles.
On donne : AM = 4 cm, AB = 6 cm et BC = 9 cm.

a) Justifie que l'on peut appliquer le théorème de Thalès.
b) Calcule la longueur MN.

### Correction
a) Les points A, M, B d'une part et A, N, C d'autre part sont alignés, et **(MN) // (BC)** : on est bien dans une configuration de Thalès.

b) D'après le théorème de Thalès : AM/AB = MN/BC.
On remplace : 4/6 = MN/9.
Par le produit en croix : MN = (4 × 9) ÷ 6 = 36 ÷ 6 = **6 cm**.

## Exercice 2 — Réciproque de Thalès
Sur une figure, A, M, B sont alignés dans cet ordre, et A, N, C aussi.
On mesure : AM = 3, AB = 5, AN = 4,2 et AC = 7.

a) Calcule les rapports AM/AB et AN/AC.
b) Les droites (MN) et (BC) sont-elles parallèles ? Justifie.

### Correction
a) AM/AB = 3/5 = **0,6**.
AN/AC = 4,2/7 = **0,6**.

b) Les deux rapports sont **égaux** (0,6) et les points sont alignés **dans le même ordre**.
D'après la **réciproque du théorème de Thalès**, les droites **(MN) et (BC) sont parallèles**.$md$),

    ('Trigonométrie', $md$# Exercices types — Trigonométrie

## Exercice 1 — Hauteur d'un mât
Depuis un point au sol, on vise le sommet d'un mât vertical sous un angle de **35°**. La distance horizontale entre l'observateur et le pied du mât est de **20 m**. On modélise la situation par un triangle rectangle.

a) Quelle formule de trigonométrie relie l'angle, la distance au sol et la hauteur ?
b) Calcule la hauteur du mât, arrondie au mètre. (on donne tan(35°) ≈ 0,70)

### Correction
a) Par rapport à l'angle de 35°, la hauteur est le côté **opposé** et la distance au sol est le côté **adjacent**. On utilise donc la **tangente** :
tan(35°) = opposé / adjacent = hauteur / 20.

b) On isole la hauteur : hauteur = 20 × tan(35°) ≈ 20 × 0,70 = **14 m**.
Le mât mesure donc environ **14 mètres**.

## Exercice 2 — Calcul d'un angle
Dans un triangle ABC rectangle en B, on donne AB = 6 cm (côté adjacent à l'angle en A) et AC = 12 cm (hypoténuse). On cherche la mesure de l'angle en A.

a) Quelle formule de trigonométrie faut-il utiliser ?
b) Calcule la mesure de l'angle en A.

### Correction
a) On connaît le côté **adjacent** (AB) et l'**hypoténuse** (AC) : on utilise le **cosinus**.
cos(Â) = adjacent / hypoténuse = AB / AC.

b) cos(Â) = 6 / 12 = 0,5.
À la calculatrice, avec la touche cos⁻¹ : Â = cos⁻¹(0,5) = **60°**.$md$),

    ('Probabilités et statistiques', $md$# Exercices types — Probabilités et statistiques

## Exercice 1 — Les notes de la classe
Voici les notes obtenues par sept élèves à un contrôle : **6, 9, 10, 12, 12, 15, 18**.

a) Calcule la moyenne de ces notes (arrondie au dixième).
b) Détermine la médiane et l'étendue de cette série.

### Correction
a) Moyenne = somme des notes ÷ effectif.
Somme = 6 + 9 + 10 + 12 + 12 + 15 + 18 = 82.
Moyenne = 82 ÷ 7 ≈ **11,7**.

b) La série est déjà rangée dans l'ordre croissant et compte 7 valeurs : la **médiane** est la 4ᵉ valeur, soit **12**.
L'**étendue** = plus grande − plus petite = 18 − 6 = **12**.

## Exercice 2 — Tirage dans une urne
Une urne contient **5 boules rouges**, **3 boules vertes** et **2 boules bleues**, indiscernables au toucher. On tire une boule au hasard.

a) Quelle est la probabilité de tirer une boule rouge ?
b) Quelle est la probabilité de tirer une boule qui n'est pas bleue ?

### Correction
Il y a en tout 5 + 3 + 2 = **10 boules**.

a) P(rouge) = nombre de boules rouges ÷ nombre total = 5/10 = **1/2** (soit 0,5).

b) Les boules « pas bleues » sont les rouges et les vertes : 5 + 3 = 8 boules.
P(pas bleue) = 8/10 = **4/5** (soit 0,8).
On pouvait aussi calculer 1 − P(bleue) = 1 − 2/10 = 8/10.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'maths'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
