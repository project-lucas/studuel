-- =============================================================================
-- Studuel — Migration 127 : CONTENU Physique-Chimie 2de (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de Physique-Chimie 2de (programme officiel Seconde) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder existant)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (3 → 10 questions). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant), positions 4→10.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons (Physique-Chimie 2de), mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Constitution de la matière', $md$# Constitution de la matière

## Ce que tu vas comprendre
Toute la matière qui t'entoure est faite d'un petit nombre de briques : les **atomes**. Ce chapitre t'explique de quoi ils sont faits, comment ils se combinent en molécules et en ions, et comment on compte les entités à l'aide de la **mole**.

## 1. L'atome et son noyau
Un **atome** est constitué d'un **noyau** central (protons + neutrons) autour duquel se déplacent des **électrons**.
- Le **proton** porte une charge **positive** (+e), le **neutron** est **neutre**, l'**électron** porte une charge **négative** (−e).
- Un atome est **électriquement neutre** : il possède autant de protons que d'électrons.
- Le noyau, minuscule, concentre presque toute la **masse** ; l'atome est essentiellement du **vide**.

*Exemple : l'atome de carbone possède 6 protons, 6 électrons et (le plus souvent) 6 neutrons.*

## 2. Le numéro atomique et les éléments
Le **numéro atomique Z** est le nombre de protons du noyau. Il définit l'**élément chimique** : Z = 1 pour l'hydrogène, Z = 8 pour l'oxygène.

## 3. Les ions
Un **ion** est un atome (ou un groupe d'atomes) qui a **gagné ou perdu** des électrons.
- S'il **perd** des électrons, il devient positif : un **cation** (ex. Na⁺).
- S'il **gagne** des électrons, il devient négatif : un **anion** (ex. Cl⁻).

## 4. Les molécules
Une **molécule** est un assemblage d'atomes liés entre eux. Sa **formule** indique les atomes présents et leur nombre.
- **H₂O** : 2 atomes d'hydrogène et 1 atome d'oxygène.
- **CO₂** : 1 atome de carbone et 2 atomes d'oxygène.

## 5. La mole et la concentration
Compter les atomes un par un est impossible : on les regroupe par paquets géants appelés **moles**.
- Une **mole** contient environ **6,02 × 10²³** entités (nombre d'Avogadro).
- La **quantité de matière** n (en mol) relie la masse à la masse molaire : **n = m / M**.
- La **concentration** d'une solution : **c = n / V** (en mol/L), où V est le volume de solution.

*Exemple : 36 g d'eau (M = 18 g/mol) correspondent à n = 36 / 18 = **2 mol**.*

## L'essentiel à retenir
- L'atome = **noyau** (protons + neutrons) + **électrons** ; globalement **neutre**.
- Le **numéro atomique Z** (nombre de protons) définit l'élément.
- Un **ion** a gagné (anion −) ou perdu (cation +) des électrons.
- La **mole** = 6,02 × 10²³ entités ; **n = m / M** et **c = n / V**.$md$),

    ('Transformations chimiques : équations', $md$# Transformations chimiques : équations

## Ce que tu vas comprendre
Lors d'une **transformation chimique**, des espèces disparaissent et d'autres apparaissent. Ce chapitre t'apprend à décrire ce qui se passe avec une **équation de réaction** correctement ajustée, et à respecter les lois de conservation.

## 1. Réactifs et produits
Une transformation chimique fait passer d'un **état initial** à un **état final**.
- Les **réactifs** sont les espèces présentes au départ, qui sont **consommées**.
- Les **produits** sont les espèces **formées** pendant la réaction.

*Exemple : quand le carbone brûle, le carbone et le dioxygène (réactifs) forment du dioxyde de carbone (produit).*

## 2. L'équation de réaction
On résume la transformation par une **équation** : réactifs à gauche, produits à droite, séparés par une flèche.

**C + O₂ → CO₂**

Les **nombres stœchiométriques** (les coefficients devant les formules) indiquent les proportions dans lesquelles les espèces réagissent.

## 3. La conservation : ajuster l'équation
Au cours d'une réaction, **rien ne se perd** :
- **conservation des éléments** : autant d'atomes de chaque sorte à gauche qu'à droite ;
- **conservation de la charge électrique** ;
- **conservation de la masse** (loi de Lavoisier).

Ajuster une équation, c'est choisir les coefficients pour que le compte d'atomes soit **le même des deux côtés**.

*Exemple : **2 H₂ + O₂ → 2 H₂O**. À gauche : 4 H et 2 O ; à droite : 4 H et 2 O. C'est équilibré.*

## 4. Quantité de matière et réactif limitant
Les coefficients se lisent en **moles**. Dans 2 H₂ + O₂ → 2 H₂O, il faut **2 mol** de dihydrogène pour **1 mol** de dioxygène.
Le **réactif limitant** est celui qui est **entièrement consommé** en premier : il arrête la réaction.

## L'essentiel à retenir
- **Réactifs** consommés → **produits** formés (flèche de gauche à droite).
- Une équation **ajustée** conserve les **atomes**, la **charge** et la **masse**.
- On ajuste avec les **coefficients** (nombres stœchiométriques), jamais les indices.
- Le **réactif limitant** est consommé en premier et stoppe la transformation.$md$),

    ('Le mouvement : vitesse et référentiel', $md$# Le mouvement : vitesse et référentiel

## Ce que tu vas comprendre
Dire qu'un objet « bouge » n'a de sens que par rapport à quelque chose. Ce chapitre pose le **référentiel**, la **trajectoire** et la **vitesse**, et montre que le mouvement est **relatif**.

## 1. Le référentiel
Un **référentiel** est l'objet de référence par rapport auquel on étudie le mouvement (souvent la Terre, le sol, un train…). **Sans référentiel, la question « bouge-t-il ? » n'a pas de réponse.**

## 2. La relativité du mouvement
Un même objet peut être **immobile** dans un référentiel et **en mouvement** dans un autre.

*Exemple : un passager assis dans un train est **immobile** par rapport au wagon, mais **en mouvement** par rapport au quai.*

## 3. La trajectoire
La **trajectoire** est l'ensemble des positions successives occupées par le point étudié.
- Trajectoire **rectiligne** : une droite.
- Trajectoire **circulaire** : un cercle.
- Trajectoire **curviligne** : une courbe quelconque.

La forme de la trajectoire **dépend elle aussi du référentiel**.

## 4. La vitesse
La **vitesse moyenne** est la distance parcourue divisée par la durée :

**v = d / t**

- d en mètres (m), t en secondes (s) → v en **mètres par seconde (m/s)**.
- On convertit vers les km/h en multipliant par 3,6 : **1 m/s = 3,6 km/h**.

*Exemple : parcourir 100 m en 20 s → v = 100 / 20 = **5 m/s**, soit 5 × 3,6 = **18 km/h**.*

## 5. Mouvement uniforme
Un mouvement est **uniforme** quand la **valeur de la vitesse reste constante** au cours du temps. S'il accélère, il est **accéléré** ; s'il ralentit, il est **ralenti (décéléré)**.

## L'essentiel à retenir
- Le mouvement est **relatif** : il faut toujours préciser le **référentiel**.
- La **trajectoire** (rectiligne, circulaire, curviligne) dépend du référentiel.
- **v = d / t** : mètres par seconde (m/s) ; **1 m/s = 3,6 km/h**.
- Mouvement **uniforme** = vitesse **constante**.$md$),

    ('Ondes et signaux', $md$# Ondes et signaux

## Ce que tu vas comprendre
La lumière et le son nous transportent de l'information sous forme de **signaux**. Ce chapitre distingue signal sonore et lumineux, et introduit les grandeurs qui décrivent une onde : **période**, **fréquence** et **célérité**.

## 1. Signal sonore et signal lumineux
- Un **signal sonore** est dû à la **vibration** de la matière (l'air, l'eau…). Il a **besoin d'un milieu matériel** pour se propager : le son ne se propage **pas dans le vide**.
- Un **signal lumineux** se propage **même dans le vide** (c'est ainsi que la lumière du Soleil nous parvient).

## 2. La période et la fréquence
Beaucoup de signaux sont **périodiques** : un motif identique se répète.
- La **période T** est la durée d'un motif, en **secondes (s)**.
- La **fréquence f** est le nombre de motifs par seconde, en **hertz (Hz)**.
- Elles sont inverses l'une de l'autre : **f = 1 / T** et **T = 1 / f**.

*Exemple : un signal de période T = 0,01 s a une fréquence f = 1 / 0,01 = **100 Hz**.*

## 3. La célérité (vitesse de propagation)
La **célérité** est la vitesse à laquelle le signal se propage dans un milieu : **v = d / t**.
- Dans l'air, le **son** se propage à environ **340 m/s**.
- Dans le vide, la **lumière** se propage à environ **300 000 km/s** (c ≈ 3 × 10⁸ m/s).

*Exemple : un éclair puis le tonnerre 3 s plus tard → la distance est d ≈ 340 × 3 ≈ **1 020 m**.*

## 4. Percevoir un son
- La **hauteur** d'un son (grave ou aigu) est liée à sa **fréquence** : plus f est grande, plus le son est **aigu**.
- L'oreille humaine perçoit environ de **20 Hz à 20 000 Hz**.

## L'essentiel à retenir
- Le **son** a besoin d'un **milieu matériel** ; la **lumière** se propage dans le **vide**.
- **Période T** (en s) et **fréquence f** (en Hz) sont liées : **f = 1 / T**.
- **Célérité v = d / t** : son ≈ 340 m/s, lumière ≈ 3 × 10⁸ m/s.
- Plus la **fréquence** est grande, plus le son est **aigu**.$md$),

    ('La lumière : spectres', $md$# La lumière : spectres

## Ce que tu vas comprendre
En décomposant la lumière, on obtient un **spectre** qui renseigne sur sa source. Ce chapitre distingue les spectres **continus** et **de raies**, et relie couleur et **longueur d'onde**.

## 1. Décomposer la lumière
Un **prisme** (ou un réseau) **décompose** la lumière blanche en une bande colorée : c'est la **dispersion**. La lumière blanche est donc un **mélange** de lumières colorées, du rouge au violet.

## 2. La longueur d'onde et la couleur
À chaque **radiation** (lumière colorée) correspond une **longueur d'onde λ**, mesurée en **nanomètres (nm)**.
- Le domaine **visible** s'étend d'environ **400 nm** (violet) à **800 nm** (rouge).
- En dessous de 400 nm : les **ultraviolets (UV)** ; au-dessus de 800 nm : les **infrarouges (IR)**, tous deux invisibles à l'œil.

*Exemple : une radiation de λ = 700 nm est perçue **rouge** ; une radiation de λ = 450 nm est perçue **bleue**.*

## 3. Les spectres continus
Un **spectre continu** contient **toutes** les couleurs sans interruption, du rouge au violet.
- Les **corps chauds** (filament d'une lampe, métal incandescent) émettent un spectre continu.
- Plus le corps est **chaud**, plus son spectre s'enrichit vers le **bleu-violet**.

## 4. Les spectres de raies
Un **spectre de raies** ne contient que **quelques radiations** précises.
- **Spectre d'émission** : des raies **colorées** sur fond noir, émises par un gaz chaud.
- **Spectre d'absorption** : des raies **noires** sur fond coloré, quand un gaz froid absorbe certaines radiations.
- Chaque **entité chimique** possède ses raies caractéristiques : le spectre est une véritable **signature**.

*Exemple : c'est en analysant les raies d'absorption de la lumière du Soleil qu'on identifie les éléments présents dans son atmosphère.*

## L'essentiel à retenir
- Un **prisme** décompose (disperse) la lumière blanche : un **mélange** de couleurs.
- Chaque couleur a une **longueur d'onde λ** (nm) ; le **visible** va d'environ 400 à 800 nm.
- **Spectre continu** = toutes les couleurs (corps chauds) ; plus chaud → vers le **bleu**.
- **Spectre de raies** = quelques radiations, **signature** d'une entité chimique.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'physique-chimie'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Constitution de la matière', $json${
      "centre": "Constitution de la matière",
      "branches": [
        { "titre": "L'atome", "enfants": ["Noyau (protons + neutrons)", "Électrons autour", "Globalement neutre"] },
        { "titre": "Charges", "enfants": ["Proton +e, électron −e", "Neutron neutre", "Numéro atomique Z = nb protons"] },
        { "titre": "Ions et molécules", "enfants": ["Cation + (perd e⁻)", "Anion − (gagne e⁻)", "Molécule : H₂O, CO₂"] },
        { "titre": "Compter la matière", "enfants": ["Mole = 6,02 × 10²³ entités", "n = m / M", "Concentration c = n / V"] }
      ]
    }$json$),
    ('Transformations chimiques : équations', $json${
      "centre": "Transformations chimiques",
      "branches": [
        { "titre": "Réactifs et produits", "enfants": ["Réactifs consommés", "Produits formés", "Flèche gauche → droite"] },
        { "titre": "Équation de réaction", "enfants": ["C + O₂ → CO₂", "Coefficients = proportions", "Se lisent en moles"] },
        { "titre": "Conservation", "enfants": ["Atomes conservés", "Charge conservée", "Masse (Lavoisier)"] },
        { "titre": "Ajuster / limitant", "enfants": ["Même compte d'atomes", "On change les coefficients", "Réactif limitant stoppe"] }
      ]
    }$json$),
    ('Le mouvement : vitesse et référentiel', $json${
      "centre": "Le mouvement",
      "branches": [
        { "titre": "Référentiel", "enfants": ["Objet de référence", "Sans lui : pas de réponse", "Terre, sol, train…"] },
        { "titre": "Relativité", "enfants": ["Immobile ici, mobile là", "Passager du train / quai", "Tout est relatif"] },
        { "titre": "Trajectoire", "enfants": ["Rectiligne (droite)", "Circulaire (cercle)", "Dépend du référentiel"] },
        { "titre": "Vitesse", "enfants": ["v = d / t (m/s)", "1 m/s = 3,6 km/h", "Uniforme = v constante"] }
      ]
    }$json$),
    ('Ondes et signaux', $json${
      "centre": "Ondes et signaux",
      "branches": [
        { "titre": "Sonore vs lumineux", "enfants": ["Son : besoin de matière", "Pas de son dans le vide", "Lumière : même dans le vide"] },
        { "titre": "Période et fréquence", "enfants": ["Période T en secondes", "Fréquence f en hertz", "f = 1 / T"] },
        { "titre": "Célérité", "enfants": ["v = d / t", "Son ≈ 340 m/s", "Lumière ≈ 3 × 10⁸ m/s"] },
        { "titre": "Percevoir un son", "enfants": ["Aigu = grande fréquence", "Grave = petite fréquence", "Oreille : 20 Hz–20 000 Hz"] }
      ]
    }$json$),
    ('La lumière : spectres', $json${
      "centre": "La lumière : spectres",
      "branches": [
        { "titre": "Décomposer", "enfants": ["Prisme / réseau", "Dispersion", "Blanc = mélange de couleurs"] },
        { "titre": "Longueur d'onde", "enfants": ["λ en nanomètres", "Visible ≈ 400–800 nm", "UV < 400, IR > 800"] },
        { "titre": "Spectre continu", "enfants": ["Toutes les couleurs", "Corps chauds", "Plus chaud → vers le bleu"] },
        { "titre": "Spectre de raies", "enfants": ["Émission : raies colorées", "Absorption : raies noires", "Signature d'une entité"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'physique-chimie'
 WHERE c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz 2de ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Physique-Chimie', '2de', v.chapter, true, l.id
FROM (VALUES
  ('12719999-0000-4000-8000-000000000001'::uuid, 'Constitution de la matière'),
  ('12719999-0000-4000-8000-000000000002'::uuid, 'Transformations chimiques : équations'),
  ('12719999-0000-4000-8000-000000000003'::uuid, 'Le mouvement : vitesse et référentiel'),
  ('12719999-0000-4000-8000-000000000004'::uuid, 'Ondes et signaux'),
  ('12719999-0000-4000-8000-000000000005'::uuid, 'La lumière : spectres')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'physique-chimie'
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
  -- Chapitre 1 — Constitution de la matière
  ('12710000-0000-4000-8000-000000000104'::uuid, 'Constitution de la matière',
   'Où se trouve concentrée la quasi-totalité de la masse d''un atome ?', 'mcq',
   '["Dans le noyau", "Dans les électrons", "Dans le vide autour", "Répartie également"]', 0,
   'Le noyau (protons + neutrons) concentre presque toute la masse ; les électrons sont très légers.', 4),
  ('12710000-0000-4000-8000-000000000105'::uuid, 'Constitution de la matière',
   'Un atome est électriquement neutre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Il possède autant de protons (charges +) que d''électrons (charges −) : le total est nul.', 5),
  ('12710000-0000-4000-8000-000000000106'::uuid, 'Constitution de la matière',
   'Un ion qui a perdu des électrons est : ', 'mcq',
   '["Un cation (positif)", "Un anion (négatif)", "Un atome neutre", "Une molécule"]', 0,
   'Perdre des électrons (charges −) rend l''ion positif : c''est un cation, comme Na⁺.', 6),
  ('12710000-0000-4000-8000-000000000107'::uuid, 'Constitution de la matière',
   'Combien d''atomes d''oxygène compte la molécule de dioxyde de carbone CO₂ ?', 'mcq',
   '["2", "1", "3", "0"]', 0,
   'CO₂ : 1 atome de carbone et 2 atomes d''oxygène.', 7),
  ('12710000-0000-4000-8000-000000000108'::uuid, 'Constitution de la matière',
   'Que vaut environ une mole (nombre d''Avogadro) ?', 'mcq',
   '["6,02 × 10²³ entités", "1 000 entités", "100 entités", "6,02 × 10⁶ entités"]', 0,
   'Une mole regroupe environ 6,02 × 10²³ entités.', 8),
  ('12710000-0000-4000-8000-000000000109'::uuid, 'Constitution de la matière',
   'Quelle quantité de matière représentent 36 g d''eau (M = 18 g/mol) ?', 'mcq',
   '["2 mol", "18 mol", "0,5 mol", "36 mol"]', 0,
   'n = m / M = 36 / 18 = 2 mol.', 9),
  ('12710000-0000-4000-8000-000000000110'::uuid, 'Constitution de la matière',
   'Le numéro atomique Z d''un élément correspond au nombre de protons.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Z est le nombre de protons du noyau ; il identifie l''élément chimique.', 10),

  -- Chapitre 2 — Transformations chimiques : équations
  ('12710000-0000-4000-8000-000000000204'::uuid, 'Transformations chimiques : équations',
   'Dans une transformation chimique, les espèces consommées sont : ', 'mcq',
   '["Les réactifs", "Les produits", "Les catalyseurs", "Les ions"]', 0,
   'Les réactifs (état initial) sont consommés ; les produits sont formés.', 4),
  ('12710000-0000-4000-8000-000000000205'::uuid, 'Transformations chimiques : équations',
   'Dans une équation de réaction, les produits s''écrivent : ', 'mcq',
   '["À droite de la flèche", "À gauche de la flèche", "Au-dessus de la flèche", "N''importe où"]', 0,
   'Réactifs à gauche, produits à droite, séparés par la flèche.', 5),
  ('12710000-0000-4000-8000-000000000206'::uuid, 'Transformations chimiques : équations',
   'L''équation 2 H₂ + O₂ → 2 H₂O est-elle correctement ajustée ?', 'mcq',
   '["Oui : 4 H et 2 O de chaque côté", "Non, il manque de l''oxygène", "Non, il manque de l''hydrogène", "On ne peut pas savoir"]', 0,
   'À gauche : 4 H et 2 O ; à droite : 4 H et 2 O. L''équation est équilibrée.', 6),
  ('12710000-0000-4000-8000-000000000207'::uuid, 'Transformations chimiques : équations',
   'Lors d''une réaction chimique, la masse totale est conservée (loi de Lavoisier).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La masse des réactifs consommés égale la masse des produits formés : rien ne se perd.', 7),
  ('12710000-0000-4000-8000-000000000208'::uuid, 'Transformations chimiques : équations',
   'Pour ajuster une équation, on modifie : ', 'mcq',
   '["Les coefficients devant les formules", "Les indices dans les formules", "Le sens de la flèche", "Le nom des espèces"]', 0,
   'On ajuste avec les coefficients stœchiométriques, jamais en changeant les indices des formules.', 8),
  ('12710000-0000-4000-8000-000000000209'::uuid, 'Transformations chimiques : équations',
   'Dans 2 H₂ + O₂ → 2 H₂O, combien de moles de dihydrogène réagissent avec 1 mol de dioxygène ?', 'mcq',
   '["2 mol", "1 mol", "4 mol", "0,5 mol"]', 0,
   'Les coefficients se lisent en moles : 2 mol de H₂ pour 1 mol de O₂.', 9),
  ('12710000-0000-4000-8000-000000000210'::uuid, 'Transformations chimiques : équations',
   'Le réactif limitant est celui qui est entièrement consommé en premier.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le réactif limitant s''épuise le premier et arrête la transformation.', 10),

  -- Chapitre 3 — Le mouvement : vitesse et référentiel
  ('12710000-0000-4000-8000-000000000304'::uuid, 'Le mouvement : vitesse et référentiel',
   'Pour décrire un mouvement, il faut d''abord préciser : ', 'mcq',
   '["Le référentiel", "La couleur de l''objet", "La masse de l''objet", "La température"]', 0,
   'Le mouvement est relatif : sans référentiel, dire si un objet bouge n''a pas de sens.', 4),
  ('12710000-0000-4000-8000-000000000305'::uuid, 'Le mouvement : vitesse et référentiel',
   'Un passager assis dans un train qui roule est immobile par rapport au quai.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : il est immobile par rapport au wagon, mais en mouvement par rapport au quai.', 5),
  ('12710000-0000-4000-8000-000000000306'::uuid, 'Le mouvement : vitesse et référentiel',
   'Une trajectoire en forme de droite est dite : ', 'mcq',
   '["Rectiligne", "Circulaire", "Curviligne", "Uniforme"]', 0,
   'Rectiligne = droite ; circulaire = cercle ; curviligne = courbe quelconque.', 6),
  ('12710000-0000-4000-8000-000000000307'::uuid, 'Le mouvement : vitesse et référentiel',
   'Un objet parcourt 100 m en 20 s. Quelle est sa vitesse moyenne ?', 'mcq',
   '["5 m/s", "20 m/s", "2 m/s", "2000 m/s"]', 0,
   'v = d / t = 100 / 20 = 5 m/s.', 7),
  ('12710000-0000-4000-8000-000000000308'::uuid, 'Le mouvement : vitesse et référentiel',
   'Une vitesse de 10 m/s correspond à combien de km/h ?', 'mcq',
   '["36 km/h", "10 km/h", "100 km/h", "3,6 km/h"]', 0,
   'On multiplie par 3,6 : 10 × 3,6 = 36 km/h (car 1 m/s = 3,6 km/h).', 8),
  ('12710000-0000-4000-8000-000000000309'::uuid, 'Le mouvement : vitesse et référentiel',
   'Un mouvement uniforme est un mouvement dont la valeur de la vitesse est constante.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Uniforme = la valeur de la vitesse ne change pas au cours du temps.', 9),
  ('12710000-0000-4000-8000-000000000310'::uuid, 'Le mouvement : vitesse et référentiel',
   'La forme de la trajectoire d''un objet dépend du référentiel choisi.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Comme le mouvement, la trajectoire est relative : elle dépend du référentiel.', 10),

  -- Chapitre 4 — Ondes et signaux
  ('12710000-0000-4000-8000-000000000404'::uuid, 'Ondes et signaux',
   'Le son peut-il se propager dans le vide ?', 'mcq',
   '["Non, il lui faut un milieu matériel", "Oui, comme la lumière", "Oui, mais moins vite", "Seulement la nuit"]', 0,
   'Le son est une vibration de la matière : il a besoin d''un milieu (air, eau…) et ne se propage pas dans le vide.', 4),
  ('12710000-0000-4000-8000-000000000405'::uuid, 'Ondes et signaux',
   'La lumière peut se propager dans le vide.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : c''est ainsi que la lumière du Soleil traverse l''espace jusqu''à nous.', 5),
  ('12710000-0000-4000-8000-000000000406'::uuid, 'Ondes et signaux',
   'La fréquence f et la période T d''un signal périodique sont liées par : ', 'mcq',
   '["f = 1 / T", "f = T", "f = T²", "f = 2 × T"]', 0,
   'Fréquence et période sont inverses l''une de l''autre : f = 1 / T.', 6),
  ('12710000-0000-4000-8000-000000000407'::uuid, 'Ondes et signaux',
   'Un signal a une période T = 0,01 s. Quelle est sa fréquence ?', 'mcq',
   '["100 Hz", "10 Hz", "0,01 Hz", "1000 Hz"]', 0,
   'f = 1 / T = 1 / 0,01 = 100 Hz.', 7),
  ('12710000-0000-4000-8000-000000000408'::uuid, 'Ondes et signaux',
   'À quelle vitesse le son se propage-t-il environ dans l''air ?', 'mcq',
   '["340 m/s", "300 000 km/s", "3,6 m/s", "20 m/s"]', 0,
   'Le son se propage à environ 340 m/s dans l''air ; c''est la lumière qui vaut environ 300 000 km/s.', 8),
  ('12710000-0000-4000-8000-000000000409'::uuid, 'Ondes et signaux',
   'Plus la fréquence d''un son est grande, plus le son est aigu.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La hauteur du son est liée à la fréquence : une grande fréquence donne un son aigu.', 9),
  ('12710000-0000-4000-8000-000000000410'::uuid, 'Ondes et signaux',
   'La période d''un signal périodique se mesure en : ', 'mcq',
   '["Secondes", "Hertz", "Mètres", "Watts"]', 0,
   'La période T est une durée : elle se mesure en secondes (la fréquence, elle, est en hertz).', 10),

  -- Chapitre 5 — La lumière : spectres
  ('12710000-0000-4000-8000-000000000504'::uuid, 'La lumière : spectres',
   'Quel instrument décompose la lumière blanche en couleurs ?', 'mcq',
   '["Un prisme", "Une loupe", "Un miroir plan", "Une pile"]', 0,
   'Un prisme (ou un réseau) disperse la lumière blanche en une bande colorée.', 4),
  ('12710000-0000-4000-8000-000000000505'::uuid, 'La lumière : spectres',
   'La lumière blanche est un mélange de lumières colorées.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La dispersion montre que le blanc contient toutes les couleurs du rouge au violet.', 5),
  ('12710000-0000-4000-8000-000000000506'::uuid, 'La lumière : spectres',
   'La longueur d''onde d''une radiation lumineuse se mesure en : ', 'mcq',
   '["Nanomètres (nm)", "Hertz (Hz)", "Secondes (s)", "Grammes (g)"]', 0,
   'La longueur d''onde λ se mesure en nanomètres ; le visible va d''environ 400 à 800 nm.', 6),
  ('12710000-0000-4000-8000-000000000507'::uuid, 'La lumière : spectres',
   'Une radiation de longueur d''onde λ = 700 nm est perçue : ', 'mcq',
   '["Rouge", "Bleue", "Violette", "Verte"]', 0,
   'Vers 700 nm on est du côté rouge du spectre visible (le violet est vers 400 nm).', 7),
  ('12710000-0000-4000-8000-000000000508'::uuid, 'La lumière : spectres',
   'Un corps chaud, comme le filament d''une lampe, émet un spectre : ', 'mcq',
   '["Continu (toutes les couleurs)", "De raies colorées", "De raies noires", "Vide"]', 0,
   'Les corps chauds émettent un spectre continu contenant toutes les couleurs sans interruption.', 8),
  ('12710000-0000-4000-8000-000000000509'::uuid, 'La lumière : spectres',
   'Un spectre de raies est caractéristique de l''entité chimique qui l''émet.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Chaque entité possède ses raies : le spectre de raies est une véritable signature.', 9),
  ('12710000-0000-4000-8000-000000000510'::uuid, 'La lumière : spectres',
   'Plus un corps chaud est chaud, plus son spectre continu s''enrichit vers : ', 'mcq',
   '["Le bleu-violet", "Le rouge", "Le noir", "Les infrarouges"]', 0,
   'Quand la température augmente, le spectre continu s''étend vers le bleu-violet.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'physique-chimie'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
