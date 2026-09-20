-- =============================================================================
-- Studuel — Migration 100 : CONTENU Physique-Chimie 5e (cours + carte mentale + quiz)
-- Remplit 3 chapitres de Physique-Chimie 5e (programme cycle 4, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder de 008/025)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (positions 4→10). Les questions
--                    sont attachées au quiz DE LA LEÇON via la jointure leçon→quiz
--                    (robuste à l'id existant).
--
-- NB : le 1er chapitre « Les états de la matière » est DÉJÀ rempli par 086 ; il
--      n'est PAS touché ici. Cette migration ne couvre que les 3 chapitres :
--        1. Les mélanges et solutions
--        2. Circuits électriques simples
--        3. La lumière : sources et propagation
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 025 (structure), 029 (mind_map),
--             037 (quiz PC collège).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (3 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Les mélanges et solutions', $md$# Les mélanges et solutions

## Ce que tu vas comprendre
Autour de toi, presque rien n'est « pur » : l'eau du robinet, l'air, un sirop… sont des **mélanges**. Ce chapitre t'apprend à reconnaître les types de mélanges, à comprendre la **dissolution**, et à **séparer** les constituants d'un mélange.

## 1. Corps pur et mélange
Un **corps pur** est constitué d'une seule sorte de matière (l'eau distillée, le cuivre). Un **mélange** contient **plusieurs** constituants (l'eau salée, l'air, le jus de fruit).

## 2. Mélanges homogènes et hétérogènes
On classe les mélanges selon ce que l'on voit :

- Un **mélange homogène** a un aspect **uniforme** : on ne distingue pas les constituants à l'œil nu. *Exemples : eau salée, eau sucrée, air, vinaigre.*
- Un **mélange hétérogène** laisse voir **au moins deux constituants** différents. *Exemples : eau + sable, eau + huile, jus d'orange avec pulpe.*

> **Astuce :** si tu vois des morceaux, des dépôts ou deux couches → **hétérogène**. Si tout se ressemble → **homogène**.

## 3. La dissolution
Quand on mélange du sucre dans l'eau, le sucre **disparaît à la vue** : il se **dissout**. On dit que le sucre est le **soluté**, l'eau est le **solvant**, et le mélange obtenu est une **solution**.

- Une substance qui se dissout est **soluble** (le sel, le sucre dans l'eau).
- Une substance qui ne se dissout pas est **insoluble** (le sable dans l'eau).

Lors d'une dissolution, la **masse se conserve** : masse de la solution = masse du solvant + masse du soluté.

## 4. La saturation
On ne peut pas dissoudre une quantité infinie de soluté. Quand le solvant ne peut plus en dissoudre, la solution est **saturée** : le soluté en trop se dépose au fond. On peut souvent dissoudre davantage en **chauffant** ou en **agitant**.

## 5. Séparer les constituants d'un mélange
- La **décantation** : on laisse **reposer** un mélange hétérogène ; le constituant le plus lourd se dépose au fond, on récupère le liquide au-dessus.
- La **filtration** : on verse le mélange sur un **filtre** (papier filtre) ; le liquide (le **filtrat**) passe, les particules solides restent sur le filtre. La filtration permet de séparer un solide insoluble d'un liquide.

*Attention : la filtration ne sépare pas un mélange homogène. L'eau salée passe entièrement à travers le filtre — le sel dissous n'est pas retenu.*

## L'essentiel à retenir
- **Homogène** = aspect uniforme (eau salée) ; **hétérogène** = on voit les constituants (eau + sable).
- **Dissolution** : soluté + solvant → solution ; soluble/insoluble ; la masse se conserve.
- Une solution **saturée** ne peut plus dissoudre de soluté.
- **Décantation** (laisser reposer) et **filtration** (filtre) séparent un mélange **hétérogène** ; elles ne séparent pas un mélange homogène.$md$),

    ('Circuits électriques simples', $md$# Circuits électriques simples

## Ce que tu vas comprendre
Une lampe qui s'allume, un moteur qui tourne… tout cela fonctionne grâce à un **circuit électrique**. Ce chapitre t'apprend à reconnaître les composants, à distinguer les montages, et à respecter les règles de **sécurité**.

## 1. Les composants d'un circuit
Un circuit électrique est une **boucle fermée** dans laquelle circule le **courant**. On y trouve :

- un **générateur** (pile, batterie) : il **fournit** l'énergie électrique ;
- un ou plusieurs **récepteurs** (lampe, moteur, buzzer) : ils **utilisent** cette énergie ;
- un **interrupteur** : il **ouvre** ou **ferme** le circuit ;
- des **fils de connexion** qui relient le tout.

> **Règle de base :** le courant ne circule que si le circuit est **fermé** (une boucle complète). Si l'interrupteur est ouvert, la lampe est éteinte.

## 2. Conducteurs et isolants
- Un **conducteur** laisse passer le courant : les **métaux** (cuivre, fer, aluminium), le graphite (mine de crayon).
- Un **isolant** ne laisse pas passer le courant : le **plastique**, le **verre**, le bois sec, le caoutchouc.

*C'est pourquoi les fils électriques sont en cuivre (conducteur) entourés de plastique (isolant, pour te protéger).*

## 3. Circuit en série
Dans un **circuit en série**, tous les composants sont branchés **les uns à la suite des autres**, sur **une seule boucle**.

- Si on ajoute une lampe, elles brillent **moins** fort.
- Si **une** lampe est dévissée (ou grille), **tout s'éteint** : la boucle est coupée.

## 4. Circuit en dérivation
Dans un **circuit en dérivation**, les récepteurs sont branchés sur des **branches séparées**, en parallèle.

- Chaque lampe brille **normalement**.
- Si une lampe grille, **les autres restent allumées** (leur branche fonctionne toujours).

*C'est le montage utilisé dans une maison : on peut éteindre une lampe sans éteindre les autres.*

## 5. Court-circuit et sécurité
Un **court-circuit** se produit quand les deux bornes du générateur sont reliées par un fil **sans récepteur**. Le courant devient très intense : les fils **chauffent** et cela peut provoquer un **incendie**.

Pour se protéger : on utilise des **fusibles** ou des **disjoncteurs** qui coupent le courant en cas de court-circuit. **Ne jamais** brancher directement les deux bornes d'une pile avec un fil, et ne jamais toucher une prise du secteur (220 V : danger de mort).

## L'essentiel à retenir
- Un circuit = **générateur** + **récepteur(s)** + **interrupteur** + **fils**, en **boucle fermée**.
- **Conducteurs** = métaux ; **isolants** = plastique, verre, bois sec.
- **Série** : une seule boucle ; si un composant lâche, tout s'éteint. **Dérivation** : branches séparées ; les autres restent allumées.
- Un **court-circuit** (bornes reliées sans récepteur) fait chauffer les fils : danger. Fusible/disjoncteur pour se protéger.$md$),

    ('La lumière : sources et propagation', $md$# La lumière : sources et propagation

## Ce que tu vas comprendre
On ne voit un objet que si de la **lumière** lui parvient puis arrive à nos yeux. Ce chapitre t'apprend d'où vient la lumière, comment elle se déplace, et comment se forment les **ombres**.

## 1. Sources primaires et objets diffusants
- Une **source primaire** **produit** sa propre lumière. *Exemples : le Soleil, une étoile, une lampe, une flamme, une braise.*
- Un **objet diffusant** (ou source secondaire) ne produit pas de lumière : il **renvoie** la lumière qu'il reçoit. *Exemples : la Lune, un mur, la page d'un livre, un miroir.*

> **Piège classique :** la **Lune n'est pas** une source primaire. Elle diffuse la lumière qu'elle reçoit du Soleil.

## 2. La propagation rectiligne
Dans un milieu **transparent et homogène** (l'air, l'eau claire, le vide), la lumière se propage **en ligne droite** : c'est la **propagation rectiligne**. On représente le trajet de la lumière par un **rayon** (une droite fléchée). Un ensemble de rayons forme un **faisceau** de lumière.

*C'est parce que la lumière va tout droit que l'on peut viser avec un pointeur laser, ou que les rayons du Soleil traversent la poussière en lignes droites.*

## 3. La vitesse de la lumière
La lumière se déplace **extrêmement vite** : environ **300 000 kilomètres par seconde** dans le vide. Rien ne va plus vite. Ainsi, la lumière du Soleil met environ **8 minutes** pour nous atteindre, alors que le Soleil est très loin.

## 4. Ombres et faisceaux
Quand un **objet opaque** (qui ne laisse pas passer la lumière) est éclairé par une source :

- l'objet ne peut pas être contourné par la lumière (qui va tout droit) : il se forme une zone sombre, l'**ombre propre** (la face non éclairée de l'objet) et l'**ombre portée** (la zone sombre projetée derrière l'objet, sur un écran).
- Plus la source est proche, plus l'ombre portée est **grande**.

*C'est ce principe qui explique les **éclipses** : la Lune ou la Terre projette une ombre parce que la lumière du Soleil se propage en ligne droite.*

## L'essentiel à retenir
- **Source primaire** = produit sa lumière (Soleil, lampe) ; **objet diffusant** = renvoie la lumière reçue (Lune, mur).
- Dans un milieu transparent et homogène, la lumière se propage **en ligne droite** (rayon, faisceau).
- Vitesse de la lumière ≈ **300 000 km/s** dans le vide (8 min du Soleil à la Terre).
- Un objet **opaque** éclairé crée une **ombre** (propre et portée) car la lumière ne le contourne pas.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'physique-chimie'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (3 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Les mélanges et solutions', $json${
      "centre": "Les mélanges et solutions",
      "branches": [
        { "titre": "Types de mélanges", "enfants": ["Homogène : aspect uniforme", "Hétérogène : on voit les constituants", "Eau salée vs eau + sable"] },
        { "titre": "La dissolution", "enfants": ["Soluté + solvant → solution", "Soluble / insoluble", "La masse se conserve"] },
        { "titre": "Saturation", "enfants": ["Le solvant ne dissout plus", "Le soluté en trop se dépose", "Chauffer ou agiter aide"] },
        { "titre": "Séparer un mélange", "enfants": ["Décantation : laisser reposer", "Filtration : filtre → filtrat", "Homogène : rien à filtrer"] }
      ]
    }$json$),
    ('Circuits électriques simples', $json${
      "centre": "Circuits électriques simples",
      "branches": [
        { "titre": "Les composants", "enfants": ["Générateur : fournit l'énergie", "Récepteur : lampe, moteur", "Interrupteur + fils, boucle fermée"] },
        { "titre": "Conducteurs / isolants", "enfants": ["Conducteurs : les métaux", "Isolants : plastique, verre, bois sec", "Fil = cuivre + gaine plastique"] },
        { "titre": "Série vs dérivation", "enfants": ["Série : une seule boucle", "Un composant lâche → tout s'éteint", "Dérivation : les autres restent allumées"] },
        { "titre": "Sécurité", "enfants": ["Court-circuit : bornes reliées sans récepteur", "Les fils chauffent : danger", "Fusible / disjoncteur protègent"] }
      ]
    }$json$),
    ('La lumière : sources et propagation', $json${
      "centre": "La lumière : sources et propagation",
      "branches": [
        { "titre": "Sources de lumière", "enfants": ["Source primaire : produit sa lumière", "Diffusant : renvoie la lumière reçue", "Soleil vs Lune"] },
        { "titre": "Propagation rectiligne", "enfants": ["Milieu transparent et homogène", "La lumière va en ligne droite", "Rayon et faisceau"] },
        { "titre": "Vitesse", "enfants": ["≈ 300 000 km/s dans le vide", "Rien ne va plus vite", "8 min du Soleil à la Terre"] },
        { "titre": "Ombres", "enfants": ["Objet opaque éclairé", "Ombre propre et ombre portée", "Explique les éclipses"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'physique-chimie'
 WHERE c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal 037 a déjà créé les quiz PC 5e ; ce bloc ne fait rien si
--     un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Physique-Chimie', '5e', v.chapter, true, l.id
FROM (VALUES
  ('10019999-0000-4000-8000-000000000001'::uuid, 'Les mélanges et solutions'),
  ('10019999-0000-4000-8000-000000000002'::uuid, 'Circuits électriques simples'),
  ('10019999-0000-4000-8000-000000000003'::uuid, 'La lumière : sources et propagation')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'physique-chimie'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
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
  -- Chapitre 1 — Les mélanges et solutions
  ('10010000-0000-4000-8000-000000000104'::uuid, 'Les mélanges et solutions',
   'Comment appelle-t-on un mélange dont l''aspect est uniforme (on ne distingue pas les constituants) ?', 'mcq',
   '["Un mélange homogène", "Un mélange hétérogène", "Un corps pur", "Un filtrat"]', 0,
   'Aspect uniforme = mélange homogène (ex. eau salée). S''il y a plusieurs constituants visibles, c''est hétérogène.', 4),
  ('10010000-0000-4000-8000-000000000105'::uuid, 'Les mélanges et solutions',
   'Le mélange « eau + sable » est un mélange hétérogène.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On distingue nettement le sable de l''eau : c''est un mélange hétérogène.', 5),
  ('10010000-0000-4000-8000-000000000106'::uuid, 'Les mélanges et solutions',
   'Dans une solution d''eau sucrée, comment appelle-t-on le sucre qui se dissout ?', 'mcq',
   '["Le soluté", "Le solvant", "Le filtrat", "Le résidu"]', 0,
   'Le sucre qui se dissout est le soluté ; l''eau qui le dissout est le solvant.', 6),
  ('10010000-0000-4000-8000-000000000107'::uuid, 'Les mélanges et solutions',
   'Quelle technique permet de séparer le sable de l''eau en versant le mélange sur un papier filtre ?', 'mcq',
   '["La filtration", "La dissolution", "La saturation", "La vaporisation"]', 0,
   'La filtration retient le solide insoluble (sable) sur le filtre ; le liquide (filtrat) passe.', 7),
  ('10010000-0000-4000-8000-000000000108'::uuid, 'Les mélanges et solutions',
   'On peut dissoudre une quantité illimitée de sel dans un verre d''eau.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : au-delà d''une certaine quantité, la solution est saturée et le sel en trop se dépose au fond.', 8),
  ('10010000-0000-4000-8000-000000000109'::uuid, 'Les mélanges et solutions',
   'On dissout 5 g de sel dans 100 g d''eau. Quelle est la masse de la solution obtenue ?', 'mcq',
   '["105 g", "100 g", "95 g", "5 g"]', 0,
   'La masse se conserve : 100 g d''eau + 5 g de sel = 105 g de solution.', 9),
  ('10010000-0000-4000-8000-000000000110'::uuid, 'Les mélanges et solutions',
   'La filtration permet de séparer le sel dissous d''une eau salée.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : l''eau salée est homogène, le sel dissous traverse le filtre. La filtration ne sépare pas un mélange homogène.', 10),

  -- Chapitre 2 — Circuits électriques simples
  ('10010000-0000-4000-8000-000000000204'::uuid, 'Circuits électriques simples',
   'Dans un circuit, quel composant fournit l''énergie électrique ?', 'mcq',
   '["Le générateur", "La lampe", "L''interrupteur", "Le fil de connexion"]', 0,
   'Le générateur (pile, batterie) fournit l''énergie ; la lampe est un récepteur qui l''utilise.', 4),
  ('10010000-0000-4000-8000-000000000205'::uuid, 'Circuits électriques simples',
   'Le courant ne peut circuler que si le circuit forme une boucle fermée.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le courant circule uniquement dans un circuit fermé ; si l''interrupteur est ouvert, la lampe s''éteint.', 5),
  ('10010000-0000-4000-8000-000000000206'::uuid, 'Circuits électriques simples',
   'Parmi ces matériaux, lequel est un isolant électrique ?', 'mcq',
   '["Le plastique", "Le cuivre", "Le fer", "L''aluminium"]', 0,
   'Le plastique est un isolant ; le cuivre, le fer et l''aluminium sont des métaux, donc conducteurs.', 6),
  ('10010000-0000-4000-8000-000000000207'::uuid, 'Circuits électriques simples',
   'Dans un circuit en série avec deux lampes, que se passe-t-il si l''une des lampes grille ?', 'mcq',
   '["L''autre lampe s''éteint aussi", "L''autre lampe brille plus fort", "Rien ne change", "Le générateur explose"]', 0,
   'En série il n''y a qu''une boucle : si une lampe grille, la boucle est coupée et tout s''éteint.', 7),
  ('10010000-0000-4000-8000-000000000208'::uuid, 'Circuits électriques simples',
   'Dans un circuit en dérivation, si une lampe grille, les autres restent allumées.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'En dérivation, chaque lampe est sur sa propre branche : les autres continuent de fonctionner.', 8),
  ('10010000-0000-4000-8000-000000000209'::uuid, 'Circuits électriques simples',
   'Que se passe-t-il lors d''un court-circuit ?', 'mcq',
   '["Les fils chauffent fortement, ce qui est dangereux", "La lampe brille normalement", "Le courant s''arrête tout seul sans risque", "Rien de particulier"]', 0,
   'Un court-circuit (bornes reliées sans récepteur) fait passer un courant très intense : les fils chauffent et peuvent provoquer un incendie.', 9),
  ('10010000-0000-4000-8000-000000000210'::uuid, 'Circuits électriques simples',
   'Quel dispositif protège une installation en coupant le courant en cas de court-circuit ?', 'mcq',
   '["Le fusible (ou le disjoncteur)", "L''interrupteur simple", "Le générateur", "Le récepteur"]', 0,
   'Le fusible ou le disjoncteur coupe le courant en cas de surintensité pour éviter l''incendie.', 10),

  -- Chapitre 3 — La lumière : sources et propagation
  ('10010000-0000-4000-8000-000000000304'::uuid, 'La lumière : sources et propagation',
   'Lequel de ces objets est une source primaire de lumière ?', 'mcq',
   '["Le Soleil", "La Lune", "Un miroir", "Un mur blanc"]', 0,
   'Le Soleil produit sa propre lumière (source primaire). La Lune, le miroir et le mur ne font que renvoyer la lumière.', 4),
  ('10010000-0000-4000-8000-000000000305'::uuid, 'La lumière : sources et propagation',
   'La Lune est une source primaire de lumière.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la Lune est un objet diffusant, elle renvoie la lumière qu''elle reçoit du Soleil.', 5),
  ('10010000-0000-4000-8000-000000000306'::uuid, 'La lumière : sources et propagation',
   'Dans un milieu transparent et homogène, comment se propage la lumière ?', 'mcq',
   '["En ligne droite", "En zigzag", "En cercle", "Elle ne se déplace pas"]', 0,
   'La lumière se propage de façon rectiligne (en ligne droite) : on la représente par un rayon.', 6),
  ('10010000-0000-4000-8000-000000000307'::uuid, 'La lumière : sources et propagation',
   'Quelle est la valeur approchée de la vitesse de la lumière dans le vide ?', 'mcq',
   '["300 000 km/s", "340 m/s", "1 000 km/h", "300 km/s"]', 0,
   'La lumière se déplace à environ 300 000 km/s dans le vide. 340 m/s est la vitesse du son dans l''air.', 7),
  ('10010000-0000-4000-8000-000000000308'::uuid, 'La lumière : sources et propagation',
   'Comment appelle-t-on un ensemble de rayons de lumière ?', 'mcq',
   '["Un faisceau", "Une ombre", "Un filtre", "Un spectre"]', 0,
   'Un ensemble de rayons de lumière forme un faisceau.', 8),
  ('10010000-0000-4000-8000-000000000309'::uuid, 'La lumière : sources et propagation',
   'C''est parce que la lumière se propage en ligne droite qu''un objet opaque forme une ombre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La lumière ne contourne pas l''objet opaque : la zone non atteinte derrière lui est l''ombre portée.', 9),
  ('10010000-0000-4000-8000-000000000310'::uuid, 'La lumière : sources et propagation',
   'Environ combien de temps la lumière du Soleil met-elle pour atteindre la Terre ?', 'mcq',
   '["8 minutes", "1 seconde", "8 heures", "8 jours"]', 0,
   'Malgré sa très grande vitesse, la lumière du Soleil met environ 8 minutes à nous parvenir.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'physique-chimie'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
