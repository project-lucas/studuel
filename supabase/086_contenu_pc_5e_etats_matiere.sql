-- =============================================================================
-- Studuel — Migration 086 : contenu Physique-Chimie 5e — « Les états de la matière »
-- GABARIT de remplissage d'un chapitre. Trois supports remplis d'un coup :
--   1. Cours       → lessons.content         (remplace le placeholder de 008/025)
--   2. Carte mentale → chapters.mind_map     (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → quiz_questions           (3 → 10 questions, positions 4→10)
-- La fiche de révision (lessons.revision_sheet) est déjà remplie par 063 ; le
-- Défi rejoue les quiz_questions (pas de contenu propre).
--
-- Motif idempotent (comme 063) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon. Réexécutable sans effet de bord.
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 025 (structure), 029 (mind_map),
--             004 (quiz 5e « Les états de la matière », id …107, 3 questions).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de la leçon « L'essentiel du cours » du chapitre
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('physique-chimie', '5e', 'Les états de la matière', 'L''essentiel du cours', $md$# Les états de la matière

## Ce que tu vas comprendre
Tout ce qui t'entoure — l'eau, l'air, ton stylo — est de la **matière**. Cette matière se présente sous **trois états** : solide, liquide et gazeux. Dans ce chapitre, tu vas apprendre à les reconnaître, à comprendre ce qui se passe **à l'intérieur** de la matière, et à nommer les **changements d'état**.

## 1. Les trois états de la matière

- **Solide** : il a une **forme propre** et un **volume propre**. Un glaçon garde sa forme même si on le pose dans un verre. *Exemples : glace, bois, fer.*
- **Liquide** : il a un **volume propre** mais **pas de forme propre** : il prend la forme du récipient et sa surface libre est **horizontale et plane**. *Exemples : eau, huile, sirop.*
- **Gaz** : il n'a **ni forme ni volume propres**. Il occupe **tout l'espace** disponible et il est **compressible** (on peut réduire son volume en le comprimant). *Exemples : air, vapeur d'eau, dioxygène.*

> **Méthode pour identifier un état**
> - Forme fixe **et** volume fixe → **solide**
> - Volume fixe mais forme libre → **liquide**
> - Ni forme ni volume propres, remplit tout → **gaz**

## 2. Le modèle particulaire

La matière est faite de **minuscules particules** (trop petites pour être vues) toujours en mouvement. Ce **modèle particulaire** explique les différences entre les états :

- **Solide** : les particules sont **serrées, ordonnées** et **vibrent sur place**. → forme et volume fixes.
- **Liquide** : les particules sont **serrées mais désordonnées**, elles **glissent** les unes sur les autres. → volume fixe, forme libre.
- **Gaz** : les particules sont **très espacées, désordonnées** et se déplacent **vite dans toutes les directions**. → occupe tout l'espace, compressible.

> **Schéma à imaginer** : trois cases. À gauche (solide), des billes bien rangées collées. Au milieu (liquide), des billes collées mais en vrac. À droite (gaz), quelques billes éloignées qui filent dans tous les sens.

## 3. Les changements d'état

Quand on **chauffe** ou on **refroidit** la matière, elle change d'état. Chaque passage a un **nom précis** :

| Passage | Nom du changement |
|---|---|
| solide → liquide | **fusion** |
| liquide → solide | **solidification** |
| liquide → gaz | **vaporisation** |
| gaz → liquide | **liquéfaction** |
| solide → gaz | **sublimation** |

*Exemple : la glace qui fond, c'est une **fusion** ; la buée qui apparaît sur une vitre froide, c'est une **liquéfaction** de la vapeur d'eau.*

## 4. Température et conservation de la masse

- Pour un **corps pur** (comme l'eau), un changement d'état se fait à **température constante** : l'eau pure gèle à **0 °C** et bout à **100 °C** (sous pression normale). Pendant le changement d'état, la température fait un **palier**.
- Lors d'un changement d'état, la **masse se conserve** : 1 kg de glace donne 1 kg d'eau liquide. En revanche, le **volume peut changer** (l'eau gelée prend un peu plus de place, c'est pourquoi une bouteille pleine peut éclater au congélateur).

## L'essentiel à retenir
- Trois états : **solide** (forme + volume propres), **liquide** (volume propre), **gaz** (ni l'un ni l'autre, compressible).
- Le **modèle particulaire** explique tout : particules serrées et ordonnées (solide), serrées et désordonnées (liquide), espacées et rapides (gaz).
- Les changements d'état ont un nom : **fusion, solidification, vaporisation, liquéfaction, sublimation**.
- Un changement d'état **conserve la masse** ; le volume, lui, peut varier.$md$)
  ) AS v(slug, level, chapter, lesson, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = v.lesson
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTE MENTALE — chapters.mind_map
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('physique-chimie', '5e', 'Les états de la matière', $json${
      "centre": "Les états de la matière",
      "branches": [
        { "titre": "Les 3 états", "enfants": ["Solide : forme + volume propres", "Liquide : volume propre, surface plane", "Gaz : ni forme ni volume, compressible"] },
        { "titre": "Modèle particulaire", "enfants": ["Solide : serrées, ordonnées, vibrent", "Liquide : serrées, désordonnées, glissent", "Gaz : espacées, rapides, partout"] },
        { "titre": "Changements d'état", "enfants": ["Fusion / Solidification", "Vaporisation / Liquéfaction", "Sublimation"] },
        { "titre": "Ce qui se conserve", "enfants": ["La masse se conserve", "Le volume peut changer", "Palier de température (corps pur)"] }
      ]
    }$json$)
  ) AS v(slug, level, chapter, json)
  JOIN public.subjects s ON s.slug = v.slug
 WHERE c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3. QUIZ — 7 questions supplémentaires (positions 4→10) pour le quiz …107
--    Le quiz existe déjà (004) avec 3 questions (positions 1→3).
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, '11111111-1111-4111-8111-111111111107'::uuid,
       d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  ('08200107-0000-4000-8000-000000000004'::uuid,
   'Quel état la matière prend-elle quand ses particules sont serrées, ordonnées et vibrent sur place ?', 'mcq',
   '["l''état solide", "l''état liquide", "l''état gazeux", "l''état plasma"]', 0,
   'Particules serrées et ordonnées = solide : forme et volume propres.', 4),
  ('08200107-0000-4000-8000-000000000005'::uuid,
   'Comment s''appelle le passage de l''état solide à l''état liquide ?', 'mcq',
   '["la fusion", "la solidification", "la vaporisation", "la liquéfaction"]', 0,
   'Solide → liquide = fusion (ex. la glace qui fond).', 5),
  ('08200107-0000-4000-8000-000000000006'::uuid,
   'La buée qui se forme sur une vitre froide est un exemple de liquéfaction.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La vapeur d''eau (gaz) redevient liquide au contact du froid : c''est une liquéfaction.', 6),
  ('08200107-0000-4000-8000-000000000007'::uuid,
   'Un gaz possède un volume propre, fixe, comme un solide.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : un gaz occupe tout l''espace disponible et est compressible ; il n''a pas de volume propre.', 7),
  ('08200107-0000-4000-8000-000000000008'::uuid,
   'Quand 1 kg de glace fond entièrement, quelle est la masse d''eau liquide obtenue ?', 'mcq',
   '["1 kg", "moins de 1 kg", "plus de 1 kg", "0 kg"]', 0,
   'La masse se conserve lors d''un changement d''état : 1 kg de glace → 1 kg d''eau.', 8),
  ('08200107-0000-4000-8000-000000000009'::uuid,
   'Dans quel état les particules sont-elles très espacées et se déplacent-elles rapidement dans toutes les directions ?', 'mcq',
   '["l''état gazeux", "l''état solide", "l''état liquide", "aucun"]', 0,
   'À l''état gazeux, les particules sont éloignées, désordonnées et très mobiles.', 9),
  ('08200107-0000-4000-8000-000000000010'::uuid,
   'Sous pression normale, à quelle température l''eau pure se solidifie-t-elle ?', 'mcq',
   '["0 °C", "100 °C", "50 °C", "-100 °C"]', 0,
   'L''eau pure gèle (solidification) à 0 °C et bout à 100 °C sous pression normale.', 10)
) AS d(id, question, kind, options, correct_index, explanation, position)
WHERE NOT EXISTS (
  SELECT 1 FROM public.quiz_questions q WHERE q.id = d.id
)
ON CONFLICT (id) DO NOTHING;
