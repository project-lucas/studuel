-- =============================================================================
-- Studuel — Migration 090 : CONTENU Maths 6e (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de Maths 6e (programme cycle 3, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder de 008)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (3 → 10 questions). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant), positions 4→10.
--
-- Motif idempotent (comme 086) : UPDATE joint sur la clé naturelle
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
    ('Nombres entiers et décimaux', $md$# Nombres entiers et décimaux

## Ce que tu vas comprendre
Tout nombre s'écrit avec les dix chiffres **0 1 2 3 4 5 6 7 8 9**. Ce qui change la valeur d'un chiffre, c'est sa **position**. Ce chapitre t'apprend à lire, écrire, comparer et ranger les nombres entiers et décimaux.

## 1. La numération de position (entiers)
Dans un nombre entier, chaque chiffre a une valeur selon sa **position**, de droite à gauche : **unités**, **dizaines**, **centaines**, **milliers**, **dizaines de mille**…

*Exemple : dans **3 407**, le 4 est le chiffre des **centaines** (il vaut 400), le 3 celui des milliers (3 000).*

## 2. Les nombres décimaux
Un nombre décimal a une **partie entière**, une **virgule**, puis une **partie décimale**. Après la virgule, les positions sont : **dixièmes**, **centièmes**, **millièmes**.

- **12,5** se lit « douze unités et cinq **dixièmes** ».
- Dans **7,03**, il y a 0 dixième et 3 **centièmes**.

> **À retenir :** ajouter des zéros **à droite** de la partie décimale ne change pas le nombre : 2,5 = 2,50 = 2,500.

## 3. Comparer et ranger
Pour comparer deux décimaux :
1. On compare d'abord les **parties entières**.
2. Si elles sont égales, on compare les **dixièmes**, puis les centièmes…

*Attention au piège : **3,5 > 3,45** ! Car 3,5 = 3,50, et 50 centièmes > 45 centièmes.*

## 4. La demi-droite graduée
On place les nombres sur une **demi-droite graduée** : chaque nombre a **une seule** position. Plus on va vers la droite, plus le nombre est **grand**.

## 5. Arrondir (valeur approchée)
Pour **arrondir** au dixième, on regarde le chiffre des **centièmes** : s'il est ≥ 5, on arrondit **au-dessus**, sinon **au-dessous**.

*Exemple : 12,47 arrondi au dixième → **12,5** (car le centième est 7 ≥ 5).*

## L'essentiel à retenir
- La **position** d'un chiffre donne sa valeur (unités, dizaines… dixièmes, centièmes…).
- On peut ajouter des zéros à droite de la partie décimale sans changer le nombre.
- Pour comparer : partie entière d'abord, puis chiffre par chiffre après la virgule.
- Arrondir : on regarde le chiffre juste après la position voulue (≥ 5 → au-dessus).$md$),

    ('Fractions', $md$# Les fractions

## Ce que tu vas comprendre
Une **fraction** sert à écrire un nombre qui n'est pas entier, en **partageant** en parts égales. Ce chapitre t'apprend à lire une fraction, la placer, et calculer une fraction d'une quantité.

## 1. Qu'est-ce qu'une fraction ?
Dans la fraction **3/4** (« trois quarts ») :
- le nombre du bas, le **dénominateur** (4), dit en **combien de parts égales** on partage ;
- le nombre du haut, le **numérateur** (3), dit **combien de parts** on prend.

*Exemple : si une pizza est coupée en 4 parts égales et que tu en manges 3, tu as mangé **3/4** de la pizza.*

## 2. Fractions et unité
- Si numérateur = dénominateur, la fraction vaut **1** : 4/4 = 1.
- Si le numérateur est **plus petit** que le dénominateur, la fraction est **inférieure à 1** (3/4 < 1).
- Si le numérateur est **plus grand**, elle est **supérieure à 1** (5/4 > 1).

## 3. Fractions décimales
Une **fraction décimale** a pour dénominateur 10, 100, 1000… Elle s'écrit aussi avec une virgule :
- **1/10 = 0,1** (un dixième) ;
- **3/100 = 0,03** (trois centièmes) ;
- **7/10 = 0,7**.

## 4. Placer une fraction sur une demi-droite
Pour placer **3/4**, on partage l'unité (de 0 à 1) en **4** parts égales et on compte **3** parts à partir de 0.

## 5. Fraction d'une quantité
Prendre **une fraction d'une quantité**, c'est diviser par le dénominateur puis multiplier par le numérateur.

*Exemple : les **3/4** de 20 € = (20 ÷ 4) × 3 = 5 × 3 = **15 €**.*

## L'essentiel à retenir
- **Dénominateur** = nombre de parts ; **numérateur** = parts prises.
- Une fraction peut être inférieure, égale ou supérieure à 1.
- Fractions décimales : /10 = dixièmes, /100 = centièmes (0,1 ; 0,01…).
- Fraction d'une quantité : on **divise** par le dénominateur, on **multiplie** par le numérateur.$md$),

    ('Proportionnalité', $md$# La proportionnalité

## Ce que tu vas comprendre
Deux grandeurs sont **proportionnelles** quand on passe de l'une à l'autre en **multipliant toujours par le même nombre**. C'est le cas des prix, des recettes, des vitesses… Ce chapitre t'apprend à reconnaître et à utiliser la proportionnalité.

## 1. Reconnaître une situation de proportionnalité
Si 1 stylo coûte 2 €, alors 3 stylos coûtent 6 €, 5 stylos coûtent 10 €… On multiplie **toujours par 2**. Le prix est **proportionnel** au nombre de stylos.

## 2. Le coefficient de proportionnalité
Le nombre par lequel on multiplie s'appelle le **coefficient de proportionnalité**. Dans un **tableau de proportionnalité**, on passe de la ligne du haut à celle du bas en multipliant par ce coefficient.

| Nombre de stylos | 1 | 3 | 5 |
|---|---|---|---|
| Prix (€) | 2 | 6 | 10 |

*Ici le coefficient est **2** (× 2 à chaque colonne).*

## 3. La règle de trois (retour à l'unité)
Pour trouver une valeur manquante, on peut **revenir à 1** :

*Exemple : 4 personnes → 200 g de farine. Pour 6 personnes ?*
- Pour 1 personne : 200 ÷ 4 = **50 g**.
- Pour 6 personnes : 50 × 6 = **300 g**.

## 4. Pourcentages et échelles
- Un **pourcentage** est une proportionnalité sur 100 : « 20 % de 50 » = (50 ÷ 100) × 20 = **10**.
- Une **échelle** (sur une carte) est aussi une proportionnalité entre la distance sur le dessin et la distance réelle.

## L'essentiel à retenir
- Proportionnalité = on multiplie **toujours par le même nombre** (le **coefficient**).
- Dans un tableau, on repère le coefficient en divisant une valeur du bas par celle du haut.
- **Règle de trois** : passer par la valeur pour **1**, puis multiplier.
- Un **pourcentage** est une proportionnalité de dénominateur 100.$md$),

    ('Géométrie plane', $md$# Géométrie plane

## Ce que tu vas comprendre
La géométrie plane étudie les figures tracées sur une feuille : points, droites, angles, cercles. Ce chapitre te donne le **vocabulaire** exact et les **instruments** pour tracer avec précision.

## 1. Points, droites, segments
- Un **point** se nomme par une lettre majuscule (A, B…).
- Une **droite** est illimitée des deux côtés.
- Un **segment** [AB] est la portion de droite **entre** deux points A et B.
- Une **demi-droite** a un point de départ mais pas de fin.

## 2. Droites perpendiculaires et parallèles
- Deux droites sont **perpendiculaires** quand elles se coupent en formant un **angle droit** (90°). On le vérifie avec l'**équerre**.
- Deux droites sont **parallèles** quand elles ne se coupent **jamais** (elles gardent toujours le même écart).

## 3. Les angles
Un **angle** se mesure en **degrés (°)** avec un **rapporteur** :
- **angle droit** = 90° ; **angle aigu** < 90° ; **angle obtus** entre 90° et 180° ; **angle plat** = 180°.

## 4. Le cercle
Un **cercle** de centre O est l'ensemble des points situés à la même distance de O. Cette distance est le **rayon**. Un segment qui joint deux points du cercle en passant par le centre est le **diamètre** (diamètre = 2 × rayon). On trace un cercle au **compas**.

## 5. La symétrie axiale
Deux figures sont **symétriques par rapport à une droite** (l'**axe**) si, en pliant le long de l'axe, elles se superposent exactement. La symétrie **conserve** les longueurs, les angles et les aires.

## L'essentiel à retenir
- **Segment** [AB] : entre A et B ; **droite** : illimitée.
- **Perpendiculaires** = angle droit (équerre) ; **parallèles** = jamais de point commun.
- Les angles se mesurent au **rapporteur** : droit 90°, aigu < 90°, obtus > 90°, plat 180°.
- Cercle : **rayon** (centre → bord), **diamètre = 2 × rayon**, tracé au **compas**.$md$),

    ('Aires, périmètres et volumes', $md$# Aires, périmètres et volumes

## Ce que tu vas comprendre
Le **périmètre** mesure le **contour** d'une figure, l'**aire** mesure sa **surface**, le **volume** mesure la **place** occupée par un solide. Ce chapitre t'apprend à ne plus les confondre et à appliquer les bonnes formules.

## 1. Le périmètre (une longueur)
Le **périmètre** est la longueur du **tour** de la figure. Il s'exprime en **cm, m, km…**
- Rectangle : **P = 2 × (Longueur + largeur)**.
- Carré : **P = 4 × côté**.
- Cercle : **P = π × diamètre** (≈ 3,14 × d).

*Exemple : rectangle L = 5 cm, l = 3 cm → P = 2 × (5 + 3) = **16 cm**.*

## 2. L'aire (une surface)
L'**aire** est la mesure de la **surface**. Elle s'exprime en **cm², m², km²** (unités « carrées »).
- Rectangle : **A = Longueur × largeur**.
- Carré : **A = côté × côté**.
- Triangle : **A = (base × hauteur) ÷ 2**.

*Exemple : carré de côté 4 cm → A = 4 × 4 = **16 cm²**.*

> **Ne pas confondre !** Le périmètre est une **longueur** (cm), l'aire une **surface** (cm²). Deux figures peuvent avoir le même périmètre et des aires différentes.

## 3. Les conversions
- Longueurs : 1 m = 100 cm ; 1 km = 1000 m.
- Aires : 1 m² = 10 000 cm² (attention, ce n'est pas 100 !).

## 4. Le volume (un solide)
Le **volume** mesure la place occupée par un solide, en **cm³, m³**, ou en **litres** (1 L = 1 dm³).
- Pavé droit (parallélépipède) : **V = Longueur × largeur × hauteur**.
- Cube : **V = arête × arête × arête**.

*Exemple : pavé 2 × 3 × 4 cm → V = 2 × 3 × 4 = **24 cm³**.*

## L'essentiel à retenir
- **Périmètre** = contour (cm) ; **aire** = surface (cm²) ; **volume** = place (cm³).
- Rectangle : P = 2 × (L + l), A = L × l. Carré : P = 4 × c, A = c × c.
- Triangle : A = (base × hauteur) ÷ 2.
- Pavé droit : V = L × l × h.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'maths'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '6e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Nombres entiers et décimaux', $json${
      "centre": "Nombres entiers et décimaux",
      "branches": [
        { "titre": "Numération de position", "enfants": ["Unités, dizaines, centaines…", "La position donne la valeur", "3 407 : 4 = centaines"] },
        { "titre": "Nombres décimaux", "enfants": ["Partie entière , partie décimale", "Dixièmes, centièmes, millièmes", "2,5 = 2,50 = 2,500"] },
        { "titre": "Comparer et ranger", "enfants": ["Partie entière d'abord", "Puis chiffre par chiffre", "3,5 > 3,45 !"] },
        { "titre": "Repérer et arrondir", "enfants": ["Demi-droite graduée", "Arrondi : chiffre suivant ≥ 5", "12,47 → 12,5 au dixième"] }
      ]
    }$json$),
    ('Fractions', $json${
      "centre": "Les fractions",
      "branches": [
        { "titre": "Lire une fraction", "enfants": ["Dénominateur = nb de parts", "Numérateur = parts prises", "3/4 = trois quarts"] },
        { "titre": "Fraction et 1", "enfants": ["num = dén → vaut 1", "num < dén → inférieure à 1", "num > dén → supérieure à 1"] },
        { "titre": "Fractions décimales", "enfants": ["1/10 = 0,1", "3/100 = 0,03", "dénominateur 10, 100, 1000"] },
        { "titre": "Fraction d'une quantité", "enfants": ["Diviser par le dénominateur", "Multiplier par le numérateur", "3/4 de 20 = 15"] }
      ]
    }$json$),
    ('Proportionnalité', $json${
      "centre": "La proportionnalité",
      "branches": [
        { "titre": "Reconnaître", "enfants": ["Toujours × le même nombre", "Prix, recettes, vitesses", "Situation proportionnelle"] },
        { "titre": "Coefficient", "enfants": ["Le nombre multiplicateur", "Tableau de proportionnalité", "bas ÷ haut = coefficient"] },
        { "titre": "Règle de trois", "enfants": ["Revenir à 1", "Puis multiplier", "4→200 g donc 1→50 g"] },
        { "titre": "Cas courants", "enfants": ["Pourcentage (/100)", "Échelle d'une carte", "20 % de 50 = 10"] }
      ]
    }$json$),
    ('Géométrie plane', $json${
      "centre": "Géométrie plane",
      "branches": [
        { "titre": "Objets de base", "enfants": ["Point (majuscule)", "Droite (illimitée)", "Segment [AB]"] },
        { "titre": "Positions de droites", "enfants": ["Perpendiculaires = angle droit", "Parallèles = jamais de point commun", "Équerre pour vérifier"] },
        { "titre": "Angles", "enfants": ["Mesure au rapporteur (°)", "Droit 90°, aigu <90°", "Obtus >90°, plat 180°"] },
        { "titre": "Cercle et symétrie", "enfants": ["Rayon, diamètre = 2×rayon", "Tracé au compas", "Symétrie axiale : pliage"] }
      ]
    }$json$),
    ('Aires, périmètres et volumes', $json${
      "centre": "Aires, périmètres, volumes",
      "branches": [
        { "titre": "Périmètre (longueur)", "enfants": ["Contour, en cm", "Rectangle : 2×(L+l)", "Carré : 4×côté"] },
        { "titre": "Aire (surface)", "enfants": ["En cm²", "Rectangle : L×l", "Triangle : base×h÷2"] },
        { "titre": "Ne pas confondre", "enfants": ["Périmètre = cm", "Aire = cm²", "Même périmètre ≠ même aire"] },
        { "titre": "Volume (solide)", "enfants": ["En cm³ ou litres", "Pavé : L×l×h", "1 L = 1 dm³"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'maths'
 WHERE c.subject_id = s.id AND c.level = '6e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal 030/033-036 ont déjà créé les quiz 6e ; ce bloc ne fait
--     rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Maths', '6e', v.chapter, true, l.id
FROM (VALUES
  ('09019999-0000-4000-8000-000000000001'::uuid, 'Nombres entiers et décimaux'),
  ('09019999-0000-4000-8000-000000000002'::uuid, 'Fractions'),
  ('09019999-0000-4000-8000-000000000003'::uuid, 'Proportionnalité'),
  ('09019999-0000-4000-8000-000000000004'::uuid, 'Géométrie plane'),
  ('09019999-0000-4000-8000-000000000005'::uuid, 'Aires, périmètres et volumes')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '6e' AND c.title = v.chapter
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
  -- Chapitre 1 — Nombres entiers et décimaux
  ('09010000-0000-4000-8000-000000000104'::uuid, 'Nombres entiers et décimaux',
   'Quel nombre est le plus grand : 3,5 ou 3,45 ?', 'mcq',
   '["3,5", "3,45", "Ils sont égaux", "On ne peut pas savoir"]', 0,
   '3,5 = 3,50, soit 50 centièmes, contre 45 centièmes pour 3,45. Donc 3,5 > 3,45.', 4),
  ('09010000-0000-4000-8000-000000000105'::uuid, 'Nombres entiers et décimaux',
   'Arrondi au dixième, 12,47 donne : ', 'mcq',
   '["12,5", "12,4", "12", "13"]', 0,
   'Le chiffre des centièmes est 7 (≥ 5) : on arrondit au-dessus → 12,5.', 5),
  ('09010000-0000-4000-8000-000000000106'::uuid, 'Nombres entiers et décimaux',
   'Dans 8,124, quel est le chiffre des centièmes ?', 'mcq',
   '["2", "1", "4", "8"]', 0,
   'Après la virgule : 1 = dixièmes, 2 = centièmes, 4 = millièmes.', 6),
  ('09010000-0000-4000-8000-000000000107'::uuid, 'Nombres entiers et décimaux',
   'Les nombres 2,5 et 2,50 représentent le même nombre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ajouter un zéro à droite de la partie décimale ne change pas le nombre.', 7),
  ('09010000-0000-4000-8000-000000000108'::uuid, 'Nombres entiers et décimaux',
   'Comment décompose-t-on 5,03 ?', 'mcq',
   '["5 + 3 centièmes", "5 + 3 dixièmes", "5 + 3 unités", "50 + 3"]', 0,
   '5,03 : 0 dixième et 3 centièmes, soit 5 + 3/100.', 8),
  ('09010000-0000-4000-8000-000000000109'::uuid, 'Nombres entiers et décimaux',
   'Sur une demi-droite graduée, un nombre plus à droite est plus grand.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Plus on avance vers la droite, plus le nombre est grand.', 9),
  ('09010000-0000-4000-8000-000000000110'::uuid, 'Nombres entiers et décimaux',
   'Dans le nombre 45,6, le chiffre 4 représente : ', 'mcq',
   '["Les dizaines", "Les unités", "Les centaines", "Les dixièmes"]', 0,
   'Partie entière 45 : 4 = dizaines, 5 = unités.', 10),

  -- Chapitre 2 — Fractions
  ('09010000-0000-4000-8000-000000000204'::uuid, 'Fractions',
   'Dans la fraction 3/4, que représente le 4 ?', 'mcq',
   '["Le nombre de parts égales", "Le nombre de parts prises", "Le résultat", "Une erreur"]', 0,
   'Le dénominateur (4) indique en combien de parts égales on partage.', 4),
  ('09010000-0000-4000-8000-000000000205'::uuid, 'Fractions',
   'La fraction 5/4 est supérieure à 1.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le numérateur (5) est plus grand que le dénominateur (4), donc la fraction dépasse 1.', 5),
  ('09010000-0000-4000-8000-000000000206'::uuid, 'Fractions',
   'Quelle écriture décimale correspond à 7/10 ?', 'mcq',
   '["0,7", "7,10", "0,07", "70"]', 0,
   '7/10 est un nombre de dixièmes : 0,7.', 6),
  ('09010000-0000-4000-8000-000000000207'::uuid, 'Fractions',
   'Combien font les 3/4 de 20 € ?', 'mcq',
   '["15 €", "12 €", "5 €", "80 €"]', 0,
   '20 ÷ 4 = 5, puis 5 × 3 = 15 €.', 7),
  ('09010000-0000-4000-8000-000000000208'::uuid, 'Fractions',
   'La fraction 4/4 est égale à 1.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Quand le numérateur égale le dénominateur, la fraction vaut 1.', 8),
  ('09010000-0000-4000-8000-000000000209'::uuid, 'Fractions',
   'Quelle fraction décimale vaut 0,03 ?', 'mcq',
   '["3/100", "3/10", "3/1000", "30/100"]', 0,
   '0,03 = 3 centièmes = 3/100.', 9),
  ('09010000-0000-4000-8000-000000000210'::uuid, 'Fractions',
   'Une pizza coupée en 4 parts égales : tu en manges 3. Quelle fraction as-tu mangée ?', 'mcq',
   '["3/4", "4/3", "1/4", "3/7"]', 0,
   '3 parts prises sur 4 parts égales : 3/4.', 10),

  -- Chapitre 3 — Proportionnalité
  ('09010000-0000-4000-8000-000000000304'::uuid, 'Proportionnalité',
   'Si 1 stylo coûte 2 €, combien coûtent 7 stylos ?', 'mcq',
   '["14 €", "9 €", "12 €", "16 €"]', 0,
   'Prix proportionnel : 7 × 2 = 14 €.', 4),
  ('09010000-0000-4000-8000-000000000305'::uuid, 'Proportionnalité',
   'Comment appelle-t-on le nombre par lequel on multiplie dans un tableau de proportionnalité ?', 'mcq',
   '["Le coefficient de proportionnalité", "Le numérateur", "La moyenne", "Le pourcentage"]', 0,
   'C''est le coefficient de proportionnalité.', 5),
  ('09010000-0000-4000-8000-000000000306'::uuid, 'Proportionnalité',
   'Une recette pour 4 personnes demande 200 g de farine. Pour 6 personnes ?', 'mcq',
   '["300 g", "250 g", "350 g", "260 g"]', 0,
   '200 ÷ 4 = 50 g par personne, puis 50 × 6 = 300 g.', 6),
  ('09010000-0000-4000-8000-000000000307'::uuid, 'Proportionnalité',
   'Combien font 20 % de 50 ?', 'mcq',
   '["10", "20", "30", "70"]', 0,
   '20 % de 50 = (50 ÷ 100) × 20 = 10.', 7),
  ('09010000-0000-4000-8000-000000000308'::uuid, 'Proportionnalité',
   'Dans une situation de proportionnalité, on additionne toujours le même nombre.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : on MULTIPLIE toujours par le même nombre (le coefficient), on n''additionne pas.', 8),
  ('09010000-0000-4000-8000-000000000309'::uuid, 'Proportionnalité',
   'Un tableau de proportionnalité a pour coefficient 3. Si le haut vaut 5, que vaut le bas ?', 'mcq',
   '["15", "8", "5", "35"]', 0,
   'On multiplie par le coefficient : 5 × 3 = 15.', 9),
  ('09010000-0000-4000-8000-000000000310'::uuid, 'Proportionnalité',
   'La règle de trois consiste souvent à revenir d''abord à la valeur pour 1.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On calcule la valeur pour 1, puis on multiplie par le nombre voulu.', 10),

  -- Chapitre 4 — Géométrie plane
  ('09010000-0000-4000-8000-000000000404'::uuid, 'Géométrie plane',
   'Comment nomme-t-on la portion de droite comprise entre deux points A et B ?', 'mcq',
   '["Le segment [AB]", "La droite (AB)", "La demi-droite [AB)", "Le point AB"]', 0,
   'Le segment [AB] est la partie de droite entre A et B ; la droite, elle, est illimitée.', 4),
  ('09010000-0000-4000-8000-000000000405'::uuid, 'Géométrie plane',
   'Deux droites parallèles finissent toujours par se couper.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : deux droites parallèles ne se coupent jamais.', 5),
  ('09010000-0000-4000-8000-000000000406'::uuid, 'Géométrie plane',
   'Un angle qui mesure 130° est : ', 'mcq',
   '["Obtus", "Aigu", "Droit", "Plat"]', 0,
   'Entre 90° et 180°, l''angle est obtus (aigu < 90°, droit = 90°, plat = 180°).', 6),
  ('09010000-0000-4000-8000-000000000407'::uuid, 'Géométrie plane',
   'Quel instrument sert à vérifier un angle droit ?', 'mcq',
   '["L''équerre", "Le compas", "Le rapporteur", "La calculatrice"]', 0,
   'L''équerre vérifie l''angle droit ; le rapporteur mesure les angles, le compas trace les cercles.', 7),
  ('09010000-0000-4000-8000-000000000408'::uuid, 'Géométrie plane',
   'Dans un cercle, le diamètre est égal à : ', 'mcq',
   '["2 fois le rayon", "La moitié du rayon", "Le rayon", "3 fois le rayon"]', 0,
   'Le diamètre passe par le centre : diamètre = 2 × rayon.', 8),
  ('09010000-0000-4000-8000-000000000409'::uuid, 'Géométrie plane',
   'La symétrie axiale conserve les longueurs.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La symétrie axiale conserve les longueurs, les angles et les aires.', 9),
  ('09010000-0000-4000-8000-000000000410'::uuid, 'Géométrie plane',
   'Avec quel instrument trace-t-on un cercle ?', 'mcq',
   '["Le compas", "L''équerre", "Le rapporteur", "La règle"]', 0,
   'Le compas trace les cercles.', 10),

  -- Chapitre 5 — Aires, périmètres et volumes
  ('09010000-0000-4000-8000-000000000504'::uuid, 'Aires, périmètres et volumes',
   'Le périmètre d''un carré de côté 6 cm est : ', 'mcq',
   '["24 cm", "36 cm", "12 cm", "18 cm"]', 0,
   'Périmètre d''un carré = 4 × côté = 4 × 6 = 24 cm.', 4),
  ('09010000-0000-4000-8000-000000000505'::uuid, 'Aires, périmètres et volumes',
   'L''aire d''un rectangle de 5 cm sur 3 cm est : ', 'mcq',
   '["15 cm²", "16 cm²", "8 cm²", "15 cm"]', 0,
   'Aire = Longueur × largeur = 5 × 3 = 15 cm² (unité carrée).', 5),
  ('09010000-0000-4000-8000-000000000506'::uuid, 'Aires, périmètres et volumes',
   'Le périmètre s''exprime en cm² comme l''aire.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le périmètre est une longueur (cm), l''aire une surface (cm²).', 6),
  ('09010000-0000-4000-8000-000000000507'::uuid, 'Aires, périmètres et volumes',
   'Quelle est la formule de l''aire d''un triangle ?', 'mcq',
   '["(base × hauteur) ÷ 2", "base × hauteur", "côté × 4", "2 × (base + hauteur)"]', 0,
   'Aire d''un triangle = (base × hauteur) ÷ 2.', 7),
  ('09010000-0000-4000-8000-000000000508'::uuid, 'Aires, périmètres et volumes',
   'Le volume d''un pavé droit de 2 cm × 3 cm × 4 cm est : ', 'mcq',
   '["24 cm³", "9 cm³", "24 cm²", "14 cm³"]', 0,
   'Volume d''un pavé = L × l × h = 2 × 3 × 4 = 24 cm³.', 8),
  ('09010000-0000-4000-8000-000000000509'::uuid, 'Aires, périmètres et volumes',
   'Combien vaut 1 mètre en centimètres ?', 'mcq',
   '["100 cm", "10 cm", "1000 cm", "1 cm"]', 0,
   '1 m = 100 cm.', 9),
  ('09010000-0000-4000-8000-000000000510'::uuid, 'Aires, périmètres et volumes',
   'Un litre correspond à un volume de 1 dm³.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '1 L = 1 dm³ (et 1000 L = 1 m³).', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '6e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
