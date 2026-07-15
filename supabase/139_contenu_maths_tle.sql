-- =============================================================================
-- Studuel — Migration 139 : CONTENU Maths Tle (+ exercices type bac)
-- Remplit les 5 chapitres de Maths Tle (programme de spécialité, Éduscol) :
--   1. Cours          → lessons.content de « L'essentiel du cours » (position 1)
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (positions 4→10, jointure
--                       leçon→quiz robuste à l'id existant ; filet si absent)
--   4. Exercices bac  → lessons.content de « Exercices types » (position 2) :
--                       2 exercices type BAC corrigés pas à pas par chapitre.
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
    ('Limites de fonctions', $md$# Limites de fonctions

## Ce que tu vas comprendre
Étudier la **limite** d'une fonction, c'est décrire son comportement quand x s'approche d'une valeur ou part vers l'infini. C'est la porte d'entrée de toute l'analyse en Terminale.

## 1. Limite en l'infini
- Une **limite finie** en +∞ signifie que f(x) se rapproche d'un nombre L : on note lim f(x) = L quand x → +∞.
- Une **limite infinie** signifie que f(x) devient aussi grand (ou petit) que l'on veut : lim f(x) = +∞ ou −∞.

*Exemple : lim (1/x) = 0 quand x → +∞ ; lim x² = +∞ quand x → +∞.*

## 2. Limite en un point (limite infinie)
Quand x s'approche d'une valeur a où la fonction « explose », la limite peut être ±∞.

*Exemple : lim (1/x) = +∞ quand x → 0 par valeurs positives, et −∞ par valeurs négatives.*

## 3. Asymptotes
- Si lim f(x) = L quand x → +∞, la droite **y = L** est une **asymptote horizontale**.
- Si lim f(x) = ±∞ quand x → a, la droite **x = a** est une **asymptote verticale**.

## 4. Opérations sur les limites
On combine les limites comme des calculs : somme, produit, quotient. Tant qu'aucune règle interdite n'apparaît, on conclut directement.

*Exemple : lim (x² + 3) = +∞ car x² → +∞ et on ajoute 3.*

## 5. Les formes indéterminées
Quatre écritures ne permettent **pas** de conclure directement :

**« ∞ − ∞ »**, **« 0 × ∞ »**, **« ∞/∞ »**, **« 0/0 »**.

Il faut alors **transformer** l'expression (factoriser par le terme dominant, simplifier…).

*Exemple : pour (3x² + 1)/(x² − 2) en +∞, on a la forme « ∞/∞ ». En factorisant par x², la limite vaut 3.*

## L'essentiel à retenir
- Limite finie L → **asymptote horizontale** y = L ; limite infinie en a → **asymptote verticale** x = a.
- On opère sur les limites comme sur des calculs, sauf face à une forme indéterminée.
- Les **formes indéterminées** sont : ∞ − ∞, 0 × ∞, ∞/∞, 0/0.
- Pour lever l'indétermination d'un quotient de polynômes, on **factorise par le terme de plus haut degré**.$md$),

    ('Continuité et convexité', $md$# Continuité et convexité

## Ce que tu vas comprendre
La **continuité** garantit qu'une courbe se trace « sans lever le crayon », ce qui permet de résoudre des équations. La **convexité** décrit la façon dont la courbe se creuse ou se bombe.

## 1. Fonction continue
Une fonction est **continue** sur un intervalle si sa courbe n'a ni saut ni trou. Les fonctions polynômes, la fonction exponentielle et le logarithme sont continus sur leur ensemble de définition.

## 2. Le théorème des valeurs intermédiaires (TVI)
Si f est **continue** sur [a ; b] et si k est compris entre f(a) et f(b), alors l'équation **f(x) = k admet au moins une solution** dans [a ; b].

*Cas particulier : si f est en plus **strictement monotone**, la solution est **unique**.*

*Exemple : f(x) = x³ + x − 1 est continue et strictement croissante ; comme f(0) = −1 et f(1) = 1, l'équation f(x) = 0 a une unique solution entre 0 et 1.*

## 3. Dérivée seconde
La **dérivée seconde** f'' est la dérivée de la dérivée f'. Elle renseigne sur la **courbure** de la fonction.

*Exemple : pour f(x) = x², on a f'(x) = 2x, puis f''(x) = 2.*

## 4. Convexité
- f est **convexe** sur I si sa dérivée seconde est **positive** sur I : la courbe est « en creux », au-dessus de ses tangentes.
- f est **concave** sur I si sa dérivée seconde est **négative** : la courbe est « en bosse », en dessous de ses tangentes.

## 5. Point d'inflexion
Un **point d'inflexion** est un point où la courbe **change de convexité** (elle passe de concave à convexe ou l'inverse). En ce point, la dérivée seconde **s'annule en changeant de signe**.

*Exemple : pour f(x) = x³ − 3x², on a f''(x) = 6x − 6, qui s'annule en changeant de signe en x = 1 : la courbe a un point d'inflexion en x = 1.*

## L'essentiel à retenir
- **TVI** : f continue + k entre f(a) et f(b) → au moins une solution ; strictement monotone → **une seule**.
- **Dérivée seconde** f'' = dérivée de f'.
- **Convexe** ⟺ f'' ≥ 0 (au-dessus des tangentes) ; **concave** ⟺ f'' ≤ 0.
- **Point d'inflexion** : la convexité change et f'' s'annule en changeant de signe.$md$),

    ('Logarithme népérien', $md$# Logarithme népérien

## Ce que tu vas comprendre
Le **logarithme népérien**, noté ln, est la fonction « inverse » de l'exponentielle. Il transforme les produits en sommes, ce qui en fait un outil essentiel pour résoudre des équations.

## 1. Définition
La fonction **ln** est définie sur **]0 ; +∞[**. Elle est la **fonction réciproque** de l'exponentielle :

**ln(x) = y ⟺ e^y = x** (pour x > 0).

En particulier : **ln(1) = 0** et **ln(e) = 1**.

## 2. Propriétés algébriques
Pour tous nombres a > 0 et b > 0 :
- **ln(a × b) = ln a + ln b** (le produit devient une somme) ;
- **ln(a / b) = ln a − ln b** ;
- **ln(a^n) = n × ln a**.

*Exemple : ln(6) = ln(2 × 3) = ln 2 + ln 3.*

## 3. Dérivée
La fonction ln est **dérivable** sur ]0 ; +∞[ et sa dérivée est :

**(ln x)' = 1/x**.

Comme 1/x > 0 sur ]0 ; +∞[, la fonction ln est **strictement croissante**.

## 4. Résoudre des équations
Comme ln est strictement croissante :
- **ln a = ln b ⟺ a = b** (avec a, b > 0).

*Exemple : ln(2x − 1) = ln(x + 3) équivaut à 2x − 1 = x + 3, donc x = 4.*

## 5. Résoudre des inéquations
La croissance de ln conserve le sens des inégalités :
- **ln a ≤ ln b ⟺ a ≤ b** (avec a, b > 0).

*Exemple : ln(x) ≤ 2 équivaut à x ≤ e², soit 0 < x ≤ e².*

## L'essentiel à retenir
- ln est définie sur **]0 ; +∞[** ; ln(1) = 0 et ln(e) = 1.
- **ln transforme le produit en somme** : ln(ab) = ln a + ln b, ln(a/b) = ln a − ln b, ln(a^n) = n ln a.
- **Dérivée : (ln x)' = 1/x**, donc ln est strictement croissante.
- Pour résoudre : on utilise ln a = ln b ⟺ a = b (sans oublier la condition x > 0).$md$),

    ('Primitives et équations différentielles', $md$# Primitives et équations différentielles

## Ce que tu vas comprendre
Une **primitive**, c'est l'opération « inverse » de la dérivée. On s'en sert pour calculer des aires et pour résoudre des **équations différentielles**, qui relient une fonction à sa dérivée.

## 1. Définition d'une primitive
F est une **primitive** de f sur un intervalle I si **F'(x) = f(x)** pour tout x de I.

*Exemple : F(x) = x² est une primitive de f(x) = 2x, car (x²)' = 2x.*

## 2. Toutes les primitives
Si F est une primitive de f, alors **toutes** les primitives de f sont de la forme **F(x) + C**, où C est une constante réelle. Deux primitives d'une même fonction diffèrent donc d'une **constante**.

## 3. Primitives usuelles
| f(x) | Une primitive F(x) |
|---|---|
| x^n (n ≠ −1) | x^(n+1) / (n + 1) |
| 1/x (sur ]0 ; +∞[) | ln(x) |
| e^x | e^x |

*Exemple : une primitive de f(x) = 3x² − 4x + 5 est F(x) = x³ − 2x² + 5x.*

## 4. Équation différentielle y' = ay
Les solutions de l'équation **y' = ay** (a réel) sont les fonctions :

**x ↦ C e^(ax)**, où C est une constante.

*Exemple : les solutions de y' = 2y sont x ↦ C e^(2x). Si de plus y(0) = 3, alors C = 3.*

## 5. Équation différentielle y' = ay + b
Pour **y' = ay + b** (a ≠ 0), on cherche d'abord la **solution constante** : y = **−b/a**. Les solutions générales sont :

**x ↦ C e^(ax) − b/a**.

*Exemple : pour y' = 3y + 6, la solution constante est y = −6/3 = −2, et les solutions sont x ↦ C e^(3x) − 2.*

## L'essentiel à retenir
- F primitive de f ⟺ **F' = f** ; toutes les primitives sont **F + C**.
- Primitives usuelles : x^n → x^(n+1)/(n+1) ; 1/x → ln x ; e^x → e^x.
- **y' = ay** a pour solutions **x ↦ C e^(ax)**.
- **y' = ay + b** a pour solutions **x ↦ C e^(ax) − b/a** (solution constante −b/a).$md$),

    ('Lois de probabilité', $md$# Lois de probabilité

## Ce que tu vas comprendre
Une **loi de probabilité** décrit comment le hasard se répartit sur les valeurs d'une **variable aléatoire**. Au programme : la loi binomiale (cas discret) et la loi normale (cas continu).

## 1. Variable aléatoire et espérance
Une **variable aléatoire** X associe un nombre au résultat d'une expérience.
- Si X prend un nombre fini de valeurs, elle est **discrète**.
- L'**espérance** E(X) est la « valeur moyenne » attendue : on multiplie chaque valeur par sa probabilité, puis on additionne.

*Exemple : un jeu rapporte +5 avec probabilité 0,2 et −2 avec probabilité 0,8. E(X) = 5 × 0,2 + (−2) × 0,8 = 1 − 1,6 = −0,6.*

## 2. L'épreuve de Bernoulli
Une **épreuve de Bernoulli** n'a que deux issues : **succès** (probabilité p) ou **échec** (probabilité 1 − p).

## 3. La loi binomiale
Quand on répète **n fois** la même épreuve de Bernoulli, de façon **indépendante**, la variable X qui compte le **nombre de succès** suit la **loi binomiale** notée **B(n ; p)**.

- **Espérance : E(X) = n × p.**
- **Variance : V(X) = n × p × (1 − p).**

*Exemple : on lance 10 fois une pièce équilibrée (p = 0,5). Le nombre de « pile » suit B(10 ; 0,5), donc E(X) = 10 × 0,5 = 5.*

## 4. La loi normale
La **loi normale** N(μ ; σ²) modélise un phénomène continu. Sa courbe (« en cloche ») est **symétrique** par rapport à la moyenne μ. L'écart-type σ mesure la dispersion.

Une valeur repère : **P(μ − σ ≤ X ≤ μ + σ) ≈ 0,68**.

## 5. Choisir la bonne loi
- Comptage de succès sur un nombre fixé d'essais → **loi binomiale** (discrète).
- Grandeur continue autour d'une moyenne → **loi normale**.

## L'essentiel à retenir
- **Espérance** = somme des (valeur × probabilité) : la moyenne attendue.
- **Loi binomiale B(n ; p)** : n épreuves de Bernoulli **indépendantes**, X = nombre de succès.
- Pour B(n ; p) : **E(X) = np** et **V(X) = np(1 − p)**.
- **Loi normale** : courbe en cloche symétrique autour de μ ; P(μ − σ ≤ X ≤ μ + σ) ≈ 0,68.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'maths'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Limites de fonctions', $json${
      "centre": "Limites de fonctions",
      "branches": [
        { "titre": "Limite en l'infini", "enfants": ["Finie : f(x) → L", "Infinie : f(x) → ±∞", "lim 1/x = 0 en +∞"] },
        { "titre": "Limite en un point", "enfants": ["Peut être ±∞", "1/x → +∞ en 0+", "La fonction explose"] },
        { "titre": "Asymptotes", "enfants": ["y = L : horizontale", "x = a : verticale", "Lecture graphique"] },
        { "titre": "Formes indéterminées", "enfants": ["∞ − ∞, 0 × ∞", "∞/∞, 0/0", "Factoriser le terme dominant"] }
      ]
    }$json$),
    ('Continuité et convexité', $json${
      "centre": "Continuité et convexité",
      "branches": [
        { "titre": "Continuité", "enfants": ["Sans lever le crayon", "Polynômes, exp, ln", "Base du TVI"] },
        { "titre": "Théorème des valeurs interm.", "enfants": ["f continue + k entre f(a),f(b)", "Au moins une solution", "Monotone → unique"] },
        { "titre": "Dérivée seconde", "enfants": ["f'' = dérivée de f'", "Renseigne la courbure", "(x²)'' = 2"] },
        { "titre": "Convexité", "enfants": ["Convexe : f'' ≥ 0", "Concave : f'' ≤ 0", "Inflexion : f'' change de signe"] }
      ]
    }$json$),
    ('Logarithme népérien', $json${
      "centre": "Logarithme népérien",
      "branches": [
        { "titre": "Définition", "enfants": ["Défini sur ]0 ; +∞[", "Réciproque de exp", "ln 1 = 0, ln e = 1"] },
        { "titre": "Propriétés", "enfants": ["ln(ab) = ln a + ln b", "ln(a/b) = ln a − ln b", "ln(a^n) = n ln a"] },
        { "titre": "Dérivée", "enfants": ["(ln x)' = 1/x", "Strictement croissante", "Sur ]0 ; +∞["] },
        { "titre": "Équations et inéquations", "enfants": ["ln a = ln b ⟺ a = b", "ln a ≤ ln b ⟺ a ≤ b", "Ne pas oublier x > 0"] }
      ]
    }$json$),
    ('Primitives et équations différentielles', $json${
      "centre": "Primitives et équations différentielles",
      "branches": [
        { "titre": "Primitive", "enfants": ["F' = f", "Primitive de 2x : x²", "Opération inverse de la dérivée"] },
        { "titre": "Toutes les primitives", "enfants": ["De la forme F + C", "Diffèrent d'une constante", "C réel"] },
        { "titre": "Primitives usuelles", "enfants": ["x^n → x^(n+1)/(n+1)", "1/x → ln x", "e^x → e^x"] },
        { "titre": "Équations différentielles", "enfants": ["y' = ay → C e^(ax)", "y' = ay + b → C e^(ax) − b/a", "Solution constante −b/a"] }
      ]
    }$json$),
    ('Lois de probabilité', $json${
      "centre": "Lois de probabilité",
      "branches": [
        { "titre": "Variable aléatoire", "enfants": ["Discrète : valeurs finies", "Espérance = moyenne attendue", "Σ valeur × probabilité"] },
        { "titre": "Épreuve de Bernoulli", "enfants": ["Deux issues", "Succès p, échec 1 − p", "Brique de la binomiale"] },
        { "titre": "Loi binomiale B(n ; p)", "enfants": ["n épreuves indépendantes", "E(X) = np", "V(X) = np(1 − p)"] },
        { "titre": "Loi normale", "enfants": ["Courbe en cloche", "Symétrique autour de μ", "P(μ−σ ; μ+σ) ≈ 0,68"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'maths'
 WHERE c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz Tle ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Maths', 'Tle', v.chapter, true, l.id
FROM (VALUES
  ('13919999-0000-4000-8000-000000000001'::uuid, 'Limites de fonctions'),
  ('13919999-0000-4000-8000-000000000002'::uuid, 'Continuité et convexité'),
  ('13919999-0000-4000-8000-000000000003'::uuid, 'Logarithme népérien'),
  ('13919999-0000-4000-8000-000000000004'::uuid, 'Primitives et équations différentielles'),
  ('13919999-0000-4000-8000-000000000005'::uuid, 'Lois de probabilité')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
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
  -- Chapitre 1 — Limites de fonctions
  ('13910000-0000-4000-8000-000000000104'::uuid, 'Limites de fonctions',
   'Quelle est la limite de 1/x quand x tend vers +∞ ?', 'mcq',
   '["0", "+∞", "1", "−∞"]', 0,
   'Quand x devient très grand, 1/x se rapproche de 0.', 4),
  ('13910000-0000-4000-8000-000000000105'::uuid, 'Limites de fonctions',
   'Parmi ces écritures, laquelle est une forme indéterminée ?', 'mcq',
   '["∞ − ∞", "3 + ∞", "0 × 5", "2 ÷ 4"]', 0,
   '« ∞ − ∞ » est une forme indéterminée : on ne peut pas conclure directement.', 5),
  ('13910000-0000-4000-8000-000000000106'::uuid, 'Limites de fonctions',
   'Si f(x) tend vers 2 quand x → +∞, alors la droite d''équation y = 2 est asymptote horizontale à la courbe.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une limite finie L en l''infini donne une asymptote horizontale y = L.', 6),
  ('13910000-0000-4000-8000-000000000107'::uuid, 'Limites de fonctions',
   'Quelle est la limite de x² quand x tend vers +∞ ?', 'mcq',
   '["+∞", "0", "−∞", "1"]', 0,
   'x² grandit sans limite quand x tend vers +∞.', 7),
  ('13910000-0000-4000-8000-000000000108'::uuid, 'Limites de fonctions',
   'Quelle est la limite de 1/x quand x tend vers 0 par valeurs positives ?', 'mcq',
   '["+∞", "0", "−∞", "1"]', 0,
   'Quand x → 0 avec x > 0, 1/x devient de plus en plus grand : la limite est +∞.', 8),
  ('13910000-0000-4000-8000-000000000109'::uuid, 'Limites de fonctions',
   'L''écriture « 0/0 » est une forme indéterminée.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« 0/0 » est l''une des formes indéterminées classiques : il faut transformer l''expression.', 9),
  ('13910000-0000-4000-8000-000000000110'::uuid, 'Limites de fonctions',
   'Si la limite de f en 2 est +∞, quelle est la nature de la droite x = 2 pour la courbe ?', 'mcq',
   '["Une asymptote verticale", "Une asymptote horizontale", "Une asymptote oblique", "Une tangente"]', 0,
   'Une limite infinie en a = 2 donne une asymptote verticale d''équation x = 2.', 10),

  -- Chapitre 2 — Continuité et convexité
  ('13910000-0000-4000-8000-000000000204'::uuid, 'Continuité et convexité',
   'Si f est continue sur [a ; b] avec f(a) < 0 < f(b), alors l''équation f(x) = 0 admet au moins une solution dans [a ; b].', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est le théorème des valeurs intermédiaires : il existe au moins une solution.', 4),
  ('13910000-0000-4000-8000-000000000205'::uuid, 'Continuité et convexité',
   'Une fonction est convexe sur un intervalle I lorsque sa dérivée seconde est, sur I :', 'mcq',
   '["positive", "négative", "nulle partout", "décroissante"]', 0,
   'f est convexe sur I lorsque sa dérivée seconde est positive sur I.', 5),
  ('13910000-0000-4000-8000-000000000206'::uuid, 'Continuité et convexité',
   'Qu''est-ce qu''un point d''inflexion ?', 'mcq',
   '["Un point où la courbe change de convexité", "Un maximum", "Un minimum", "Un point d''intersection avec l''axe"]', 0,
   'En un point d''inflexion, la courbe change de convexité (concave ↔ convexe).', 6),
  ('13910000-0000-4000-8000-000000000207'::uuid, 'Continuité et convexité',
   'La courbe d''une fonction convexe est située au-dessus de ses tangentes.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La courbe d''une fonction convexe reste au-dessus de ses tangentes.', 7),
  ('13910000-0000-4000-8000-000000000208'::uuid, 'Continuité et convexité',
   'Quelle est la dérivée seconde de la fonction f(x) = x² ?', 'mcq',
   '["2", "0", "2x", "x"]', 0,
   'La dérivée de x² est 2x, et la dérivée de 2x est 2 : donc f'''' vaut 2.', 8),
  ('13910000-0000-4000-8000-000000000209'::uuid, 'Continuité et convexité',
   'Si f est continue et strictement croissante sur [a ; b] et si k est compris entre f(a) et f(b), combien l''équation f(x) = k admet-elle de solutions ?', 'mcq',
   '["Exactement une", "Aucune", "Au moins deux", "Une infinité"]', 0,
   'Continue et strictement monotone : l''équation admet une unique solution.', 9),
  ('13910000-0000-4000-8000-000000000210'::uuid, 'Continuité et convexité',
   'Si la dérivée seconde de f est positive sur I, alors f est convexe sur I.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Dérivée seconde positive sur I signifie que f est convexe sur I.', 10),

  -- Chapitre 3 — Logarithme népérien
  ('13910000-0000-4000-8000-000000000304'::uuid, 'Logarithme népérien',
   'Que vaut ln(1) ?', 'mcq',
   '["0", "1", "e", "−1"]', 0,
   'Par définition, ln(1) = 0.', 4),
  ('13910000-0000-4000-8000-000000000305'::uuid, 'Logarithme népérien',
   'Que vaut ln(e) ?', 'mcq',
   '["1", "0", "e", "−1"]', 0,
   'Par définition, ln(e) = 1.', 5),
  ('13910000-0000-4000-8000-000000000306'::uuid, 'Logarithme népérien',
   'À quoi est égal ln(ab) ?', 'mcq',
   '["ln a + ln b", "ln a × ln b", "ln a − ln b", "ln(a + b)"]', 0,
   'Le logarithme transforme le produit en somme : ln(ab) = ln a + ln b.', 6),
  ('13910000-0000-4000-8000-000000000307'::uuid, 'Logarithme népérien',
   'Quelle est la dérivée de la fonction ln sur ]0 ; +∞[ ?', 'mcq',
   '["1/x", "ln x", "x", "−1/x²"]', 0,
   'La dérivée de ln(x) est 1/x sur ]0 ; +∞[.', 7),
  ('13910000-0000-4000-8000-000000000308'::uuid, 'Logarithme népérien',
   'À quoi est égal ln(a/b) ?', 'mcq',
   '["ln a − ln b", "ln a + ln b", "ln a ÷ ln b", "ln(a − b)"]', 0,
   'Le logarithme du quotient : ln(a/b) = ln a − ln b.', 8),
  ('13910000-0000-4000-8000-000000000309'::uuid, 'Logarithme népérien',
   'La fonction ln n''est définie que pour les nombres strictement positifs.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La fonction ln n''est définie que pour x strictement positif (sur ]0 ; +∞[).', 9),
  ('13910000-0000-4000-8000-000000000310'::uuid, 'Logarithme népérien',
   'Quelle est la solution de l''équation ln(x) = 0 ?', 'mcq',
   '["x = 1", "x = 0", "x = e", "x = −1"]', 0,
   'ln(x) = 0 équivaut à x = 1, car ln(1) = 0.', 10),

  -- Chapitre 4 — Primitives et équations différentielles
  ('13910000-0000-4000-8000-000000000404'::uuid, 'Primitives et équations différentielles',
   'Quelle fonction est une primitive de f(x) = 2x ?', 'mcq',
   '["x²", "2", "x", "2x²"]', 0,
   'Une primitive de 2x est x², car la dérivée de x² est 2x.', 4),
  ('13910000-0000-4000-8000-000000000405'::uuid, 'Primitives et équations différentielles',
   'Deux primitives d''une même fonction diffèrent d''une :', 'mcq',
   '["constante", "fonction affine", "exponentielle", "droite oblique"]', 0,
   'Deux primitives d''une même fonction diffèrent d''une constante.', 5),
  ('13910000-0000-4000-8000-000000000406'::uuid, 'Primitives et équations différentielles',
   'Quelles sont les solutions de l''équation différentielle y'' = ay ?', 'mcq',
   '["x ↦ C e^(ax)", "x ↦ C e^(−ax)", "x ↦ ax + C", "x ↦ C x^a"]', 0,
   'Les solutions de l''équation y'' = ay sont les fonctions x ↦ C e^(ax).', 6),
  ('13910000-0000-4000-8000-000000000407'::uuid, 'Primitives et équations différentielles',
   'Quelle fonction est une primitive de f(x) = 3x² ?', 'mcq',
   '["x³", "6x", "x³ + x", "3x"]', 0,
   'Une primitive de 3x² est x³, car la dérivée de x³ est 3x².', 7),
  ('13910000-0000-4000-8000-000000000408'::uuid, 'Primitives et équations différentielles',
   'La fonction exponentielle est égale à sa propre dérivée.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La dérivée de e^x est e^x : la fonction exponentielle est sa propre dérivée.', 8),
  ('13910000-0000-4000-8000-000000000409'::uuid, 'Primitives et équations différentielles',
   'Sur ]0 ; +∞[, quelle est une primitive de f(x) = 1/x ?', 'mcq',
   '["ln(x)", "−1/x²", "1/x²", "x"]', 0,
   'Sur ]0 ; +∞[, une primitive de 1/x est ln(x).', 9),
  ('13910000-0000-4000-8000-000000000410'::uuid, 'Primitives et équations différentielles',
   'Quelle est la solution constante de l''équation y'' = ay + b (avec a ≠ 0) ?', 'mcq',
   '["y = −b/a", "y = b/a", "y = −a/b", "y = 0"]', 0,
   'La solution constante de y'' = ay + b est y = −b/a.', 10),

  -- Chapitre 5 — Lois de probabilité
  ('13910000-0000-4000-8000-000000000504'::uuid, 'Lois de probabilité',
   'Si X suit la loi binomiale B(n ; p), que vaut son espérance E(X) ?', 'mcq',
   '["np", "np(1 − p)", "n/p", "p/n"]', 0,
   'Pour X qui suit B(n ; p), l''espérance est E(X) = np.', 4),
  ('13910000-0000-4000-8000-000000000505'::uuid, 'Lois de probabilité',
   'Si X suit la loi binomiale B(n ; p), que vaut sa variance ?', 'mcq',
   '["np(1 − p)", "np", "n + p", "p(1 − n)"]', 0,
   'Pour la loi binomiale, la variance est np(1 − p).', 5),
  ('13910000-0000-4000-8000-000000000506'::uuid, 'Lois de probabilité',
   'On lance 10 fois une pièce équilibrée ; X compte le nombre de « pile ». Que vaut E(X) ?', 'mcq',
   '["5", "10", "2,5", "1"]', 0,
   'X suit B(10 ; 0,5), donc E(X) = np = 10 × 0,5 = 5.', 6),
  ('13910000-0000-4000-8000-000000000507'::uuid, 'Lois de probabilité',
   'La courbe en cloche d''une loi normale est symétrique par rapport à sa moyenne.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La courbe en cloche de la loi normale est symétrique autour de la moyenne μ.', 7),
  ('13910000-0000-4000-8000-000000000508'::uuid, 'Lois de probabilité',
   'La loi binomiale compte le nombre de succès dans une répétition de n épreuves de Bernoulli identiques et :', 'mcq',
   '["indépendantes", "dépendantes", "ordonnées", "continues"]', 0,
   'La loi binomiale compte les succès de n épreuves de Bernoulli identiques et indépendantes.', 8),
  ('13910000-0000-4000-8000-000000000509'::uuid, 'Lois de probabilité',
   'Pour une variable X suivant une loi normale d''espérance μ et d''écart-type σ, à combien vaut environ P(μ − σ ≤ X ≤ μ + σ) ?', 'mcq',
   '["0,68", "0,95", "0,50", "0,997"]', 0,
   'Pour une loi normale, P(μ − σ ≤ X ≤ μ + σ) ≈ 0,68.', 9),
  ('13910000-0000-4000-8000-000000000510'::uuid, 'Lois de probabilité',
   'Comment appelle-t-on une variable aléatoire qui ne prend qu''un nombre fini de valeurs ?', 'mcq',
   '["Discrète", "Continue", "Normale", "Certaine"]', 0,
   'Une variable aléatoire à valeurs en nombre fini est dite discrète.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'maths'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BAC — lessons.content de « Exercices types » (position 2)
--    2 exercices type BAC corrigés pas à pas par chapitre.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Limites de fonctions', $md$# Exercices types — Limites de fonctions

## Exercice 1 — Lever une indétermination
On considère la fonction f définie sur ]√2 ; +∞[ par f(x) = (3x² + 1)/(x² − 2).

a) Quelle forme indéterminée obtient-on en +∞ ?
b) Calcule la limite de f en +∞ et interprète graphiquement.

### Correction
a) En +∞, le numérateur tend vers +∞ et le dénominateur aussi : on obtient la forme indéterminée **« ∞/∞ »**.

b) On factorise numérateur et dénominateur par le terme de plus haut degré x² :
f(x) = [x²(3 + 1/x²)] / [x²(1 − 2/x²)] = (3 + 1/x²) / (1 − 2/x²).
Quand x → +∞ : 1/x² → 0 et 2/x² → 0, donc f(x) → 3/1 = **3**.
La droite **y = 3** est donc une **asymptote horizontale** à la courbe en +∞.

## Exercice 2 — Asymptotes d'une fonction homographique
Soit g(x) = (2x + 1)/(x − 3), définie pour x ≠ 3.

a) Étudie la limite de g à droite puis à gauche de 3. Qu'en déduit-on ?
b) Étudie la limite de g en +∞ et en −∞.

### Correction
a) En x = 3, le numérateur tend vers 2 × 3 + 1 = 7 (un nombre positif) et le dénominateur tend vers 0.
- Pour x → 3 avec x > 3 : x − 3 → 0⁺, donc g(x) → **+∞**.
- Pour x → 3 avec x < 3 : x − 3 → 0⁻, donc g(x) → **−∞**.
La droite **x = 3** est une **asymptote verticale**.

b) On factorise par x : g(x) = [x(2 + 1/x)] / [x(1 − 3/x)] = (2 + 1/x)/(1 − 3/x).
Quand x → ±∞, on obtient g(x) → 2/1 = **2**.
La droite **y = 2** est une **asymptote horizontale** en +∞ et en −∞.$md$),

    ('Continuité et convexité', $md$# Exercices types — Continuité et convexité

## Exercice 1 — Application du TVI
Soit f la fonction définie sur ℝ par f(x) = x³ + x − 1.

a) Justifie que f est continue et strictement croissante sur ℝ.
b) Montre que l'équation f(x) = 0 admet une unique solution α, puis donne un encadrement de α à l'unité.

### Correction
a) f est une fonction polynôme, donc **continue** sur ℝ. Sa dérivée est f'(x) = 3x² + 1, qui est **strictement positive** (somme d'un carré et de 1). Donc f est **strictement croissante** sur ℝ.

b) f est continue et strictement croissante. On calcule :
f(0) = 0 + 0 − 1 = −1 (négatif) et f(1) = 1 + 1 − 1 = 1 (positif).
Comme 0 est compris entre f(0) et f(1), d'après le **théorème des valeurs intermédiaires** (version stricte), l'équation f(x) = 0 admet une **unique** solution α, avec **0 < α < 1**.

## Exercice 2 — Convexité et point d'inflexion
Soit f définie sur ℝ par f(x) = x³ − 3x².

a) Calcule f'(x) puis f''(x).
b) Étudie le signe de f''(x) et détermine le point d'inflexion de la courbe.

### Correction
a) f'(x) = 3x² − 6x, puis **f''(x) = 6x − 6 = 6(x − 1)**.

b) f''(x) est du signe de (x − 1) :
- sur ]−∞ ; 1[, f''(x) < 0 : la fonction est **concave** ;
- sur ]1 ; +∞[, f''(x) > 0 : la fonction est **convexe**.
La dérivée seconde **s'annule en changeant de signe en x = 1** : la courbe présente donc un **point d'inflexion** en x = 1.
Comme f(1) = 1 − 3 = −2, ce point d'inflexion est **I(1 ; −2)**.$md$),

    ('Logarithme népérien', $md$# Exercices types — Logarithme népérien

## Exercice 1 — Résoudre une équation
Résous dans ℝ l'équation ln(2x − 1) = ln(x + 3).

a) Détermine l'ensemble de définition (conditions d'existence).
b) Résous l'équation.

### Correction
a) Les deux logarithmes existent si leurs arguments sont **strictement positifs** :
2x − 1 > 0 donne x > 1/2, et x + 3 > 0 donne x > −3.
La condition commune est donc **x > 1/2**.

b) Comme la fonction ln est strictement croissante, ln a = ln b équivaut à a = b :
2x − 1 = x + 3
2x − x = 3 + 1
x = **4**.
Comme 4 > 1/2, la valeur est acceptable. L'équation a pour solution **x = 4**.

## Exercice 2 — Étude d'une fonction avec ln
Soit g la fonction définie sur ]0 ; +∞[ par g(x) = x − ln(x).

a) Calcule g'(x) et étudie son signe.
b) Dresse les variations de g et déduis-en que g(x) > 0 pour tout x > 0.

### Correction
a) g'(x) = 1 − 1/x = (x − 1)/x. Sur ]0 ; +∞[, le dénominateur x est positif, donc g'(x) est du signe de **(x − 1)** :
- sur ]0 ; 1[, g'(x) < 0 : g est **décroissante** ;
- sur ]1 ; +∞[, g'(x) > 0 : g est **croissante**.

b) g admet donc un **minimum en x = 1** : g(1) = 1 − ln(1) = 1 − 0 = **1**.
Le minimum de g vaut 1, donc pour tout x > 0, **g(x) ≥ 1 > 0**. On a bien g(x) > 0.$md$),

    ('Primitives et équations différentielles', $md$# Exercices types — Primitives et équations différentielles

## Exercice 1 — Primitive vérifiant une condition
Soit f définie sur ℝ par f(x) = 3x² − 4x + 5.

a) Donne l'expression générale des primitives de f.
b) Détermine la primitive F telle que F(0) = 1.

### Correction
a) On primitive terme à terme :
- une primitive de 3x² est x³ ;
- une primitive de −4x est −2x² ;
- une primitive de 5 est 5x.
Les primitives de f sont donc **F(x) = x³ − 2x² + 5x + C**, où C est une constante réelle.

b) On impose F(0) = 1 :
F(0) = 0 − 0 + 0 + C = C, donc C = 1.
La primitive cherchée est **F(x) = x³ − 2x² + 5x + 1**.

## Exercice 2 — Équation différentielle y' = ay + b
On étudie l'équation différentielle (E) : y' = 3y + 6.

a) Détermine la solution constante de (E).
b) Donne les solutions générales, puis la solution qui vérifie y(0) = 0.

### Correction
a) Une solution constante vérifie y' = 0, donc 0 = 3y + 6, d'où y = −6/3 = **−2**. La solution constante est y = −2 (c'est bien −b/a avec a = 3 et b = 6).

b) Les solutions de y' = ay + b sont de la forme y = C e^(ax) − b/a, soit ici :
**y(x) = C e^(3x) − 2**, où C est une constante réelle.
On impose y(0) = 0 : C e^0 − 2 = 0, donc C − 2 = 0, d'où C = 2.
La solution cherchée est **y(x) = 2 e^(3x) − 2**.$md$),

    ('Lois de probabilité', $md$# Exercices types — Lois de probabilité

## Exercice 1 — Loi binomiale (QCM au hasard)
Un QCM comporte **10 questions** indépendantes, chacune avec 4 réponses possibles dont une seule est correcte. Un élève répond **au hasard** à chaque question. On note X le nombre de bonnes réponses.

a) Justifie que X suit une loi binomiale et précise ses paramètres. Calcule E(X).
b) Calcule la probabilité que l'élève n'ait aucune bonne réponse (arrondie au millième).

### Correction
a) Chaque question est une **épreuve de Bernoulli** : succès (bonne réponse) de probabilité p = 1/4 = 0,25, échec sinon. Les 10 questions sont **identiques et indépendantes**, donc X suit la loi binomiale **B(10 ; 0,25)**.
L'espérance vaut **E(X) = n × p = 10 × 0,25 = 2,5**.

b) P(X = 0) correspond à 10 échecs de suite : P(X = 0) = (1 − 0,25)^10 = 0,75^10 ≈ **0,056**.
L'élève a donc environ 5,6 % de chances de tout rater.

## Exercice 2 — Espérance d'un jeu
Une roue donne : un gain de **5 €** avec probabilité 0,2 et une perte de **2 €** avec probabilité 0,8. On note X le gain algébrique du joueur.

a) Calcule l'espérance E(X).
b) Le jeu est-il favorable au joueur ? Justifie.

### Correction
a) L'espérance est la somme des (valeur × probabilité) :
E(X) = 5 × 0,2 + (−2) × 0,8 = 1 − 1,6 = **−0,6 €**.

b) L'espérance est **négative** (−0,6 €). En moyenne, sur un grand nombre de parties, le joueur **perd** 0,60 € par partie : le jeu est donc **défavorable** au joueur.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'maths'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
