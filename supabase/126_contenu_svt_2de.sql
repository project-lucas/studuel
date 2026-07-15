-- =============================================================================
-- Studuel — Migration 126 : CONTENU SVT 2de (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de SVT 2de (programme officiel 2de) :
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
-- PRÉREQUIS : subjects/chapters/lessons SVT 2de, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('La cellule, unité du vivant', $md$# La cellule, unité du vivant

## Ce que tu vas comprendre
Tous les êtres vivants — de la bactérie à l'éléphant — sont faits de **cellules**. La cellule est la **plus petite unité** capable de vivre par elle-même. Ce chapitre t'apprend ce qu'elle contient, comment on la classe et à quelle échelle elle se situe.

## 1. La cellule, unité de base du vivant
La **théorie cellulaire** dit trois choses :
- tout être vivant est constitué d'**une ou plusieurs cellules** ;
- la cellule est l'**unité de structure et de fonction** du vivant ;
- toute cellule provient d'une **autre cellule** (division cellulaire).

*Exemple : une bactérie est un être vivant à **une seule** cellule ; l'être humain en compte des milliers de milliards.*

## 2. La membrane plasmique
Chaque cellule est délimitée par une **membrane plasmique**. Elle sépare l'**intérieur** (le cytoplasme) de l'**extérieur** et contrôle les **échanges** (entrée des nutriments, sortie des déchets). C'est une frontière **sélective**.

## 3. L'ADN, molécule de l'information génétique
Toute cellule contient de l'**ADN**, la molécule qui porte l'**information génétique** (le programme de fabrication de la cellule). L'ADN est **universel** : c'est la même molécule chez tous les êtres vivants, ce qui est un argument fort de leur **parenté**.

## 4. Cellule procaryote et cellule eucaryote
On classe les cellules selon la présence ou non d'un **noyau** :
- **Cellule procaryote** (bactéries) : **pas de noyau**, l'ADN baigne librement dans le cytoplasme.
- **Cellule eucaryote** (animaux, végétaux, champignons) : ADN enfermé dans un **noyau**, et présence d'**organites** (mitochondries, chloroplastes chez les végétaux…).

> **À retenir :** « pro-caryote » = *avant le noyau* ; « eu-caryote » = *vrai noyau*.

## 5. L'échelle du vivant
La cellule est **microscopique** : on la mesure en **micromètres (µm)**, soit un millième de millimètre. On l'observe au **microscope**. L'ordre des tailles : molécule < organite < cellule < tissu < organe < organisme.

## L'essentiel à retenir
- La cellule est l'**unité de base** de tout être vivant (théorie cellulaire).
- La **membrane plasmique** délimite la cellule et contrôle les échanges.
- L'**ADN** porte l'information génétique et est **universel** (parenté du vivant).
- **Procaryote** = sans noyau (bactérie) ; **eucaryote** = avec noyau et organites.$md$),

    ('Biodiversité et évolution', $md$# Biodiversité et évolution

## Ce que tu vas comprendre
La **biodiversité**, c'est la diversité du vivant. Elle n'est pas figée : elle **change** au fil des générations. Ce chapitre t'explique ces changements grâce aux mécanismes de l'**évolution**.

## 1. Les trois niveaux de biodiversité
La biodiversité se mesure à **trois échelles** :
- la diversité des **écosystèmes** (forêt, océan, désert…) ;
- la diversité des **espèces** au sein d'un écosystème ;
- la diversité **génétique** au sein d'une même espèce (les individus ne sont pas identiques).

*Exemple : dans une population de coccinelles, certaines ont plus de points que d'autres : c'est de la diversité génétique.*

## 2. La sélection naturelle
Dans un milieu donné, certains individus possèdent des caractères qui les **avantagent** (mieux se nourrir, échapper aux prédateurs…). Ils **survivent** mieux et ont **plus de descendants**. Leurs caractères deviennent alors **plus fréquents** au fil des générations : c'est la **sélection naturelle** (idée de Darwin).

*Exemple : des phalènes sombres survivent mieux sur des troncs noircis par la pollution ; elles deviennent majoritaires.*

## 3. La dérive génétique
La fréquence d'un caractère peut aussi changer par **hasard**, sans qu'il soit avantageux : c'est la **dérive génétique**. Elle joue surtout dans les **petites populations**, où le hasard a plus d'effet.

## 4. La spéciation
Quand deux populations d'une même espèce sont **séparées** (par une montagne, un bras de mer…), elles évoluent **chacune de leur côté**. Avec le temps, elles peuvent devenir si différentes qu'elles ne peuvent **plus se reproduire entre elles** : deux **espèces** distinctes sont apparues. C'est la **spéciation**.

> **À retenir :** une **espèce** regroupe des individus qui peuvent se reproduire entre eux et avoir une descendance **fertile**.

## L'essentiel à retenir
- La biodiversité a **trois niveaux** : écosystèmes, espèces, gènes.
- La **sélection naturelle** favorise les caractères avantageux (survie + descendance).
- La **dérive génétique** modifie les fréquences par **hasard** (surtout en petite population).
- La **spéciation** : deux populations séparées deviennent deux **espèces** différentes.$md$),

    ('Le métabolisme cellulaire', $md$# Le métabolisme cellulaire

## Ce que tu vas comprendre
Une cellule est une petite **usine chimique** : elle transforme sans cesse des molécules pour vivre. L'ensemble de ces réactions est le **métabolisme**. Ce chapitre t'explique comment il fonctionne et comment les cellules se procurent leur matière.

## 1. Les réactions du métabolisme
Le **métabolisme** est l'ensemble des **réactions chimiques** d'une cellule. On distingue :
- les réactions qui **construisent** des molécules (par exemple fabriquer de l'amidon) ;
- les réactions qui **dégradent** des molécules pour libérer de l'**énergie**.

## 2. Les enzymes, catalyseurs du vivant
Chaque réaction est accélérée par une **enzyme**, une molécule qui agit comme **catalyseur** : elle rend la réaction possible et rapide, sans être consommée. Chaque enzyme est **spécifique** d'une réaction précise (elle reconnaît une molécule bien particulière).

*Exemple : l'amylase de la salive découpe l'amidon en sucres plus simples.*

## 3. Autotrophes et hétérotrophes
On classe les cellules selon la **source de matière** :
- une cellule **autotrophe** fabrique sa **matière organique** à partir de matière **minérale** (CO₂, eau) et d'une source d'énergie (la lumière). Exemple : la cellule végétale.
- une cellule **hétérotrophe** doit **consommer** de la matière organique déjà faite. Exemple : la cellule animale.

## 4. Photosynthèse et respiration
Deux métabolismes clés utilisent ces échanges :
- la **photosynthèse** (cellules végétales, à la lumière) : la cellule consomme du **CO₂** et de l'eau, produit de la **matière organique** et rejette du **dioxygène**.
- la **respiration** (presque toutes les cellules) : la cellule consomme du **dioxygène** et de la matière organique pour libérer de l'**énergie**, et rejette du **CO₂**.

> **À retenir :** photosynthèse et respiration sont en quelque sorte **inverses** l'une de l'autre pour les gaz échangés.

## L'essentiel à retenir
- Le **métabolisme** = ensemble des réactions chimiques de la cellule.
- Les **enzymes** sont des **catalyseurs spécifiques** qui accélèrent les réactions.
- **Autotrophe** = fabrique sa matière (végétal) ; **hétérotrophe** = la consomme (animal).
- **Photosynthèse** : consomme CO₂, produit O₂ ; **respiration** : consomme O₂, rejette CO₂.$md$),

    ('Érosion et sédimentation', $md$# Érosion et sédimentation

## Ce que tu vas comprendre
Les paysages ne sont pas immobiles : les roches sont **usées**, leurs débris **transportés**, puis **déposés** ailleurs. Ce grand voyage de la matière construit peu à peu de nouvelles roches. Ce chapitre suit ce cycle du début à la fin.

## 1. L'altération des roches
À la surface, les roches subissent l'**altération** : l'eau, le gel, les variations de température et les êtres vivants les **fragilisent** et les **cassent** en morceaux. L'altération peut être **mécanique** (le gel fait éclater la roche) ou **chimique** (l'eau dissout certains minéraux).

*Exemple : l'eau qui gèle dans une fissure augmente de volume et fait éclater la roche (gélifraction).*

## 2. L'érosion et le transport
L'**érosion** arrache les débris (appelés **sédiments**) et les **emporte**. Les agents de transport sont surtout l'**eau** (rivières), le **vent** et la **glace** (glaciers). Pendant le transport, les débris sont **usés** : leurs angles s'arrondissent, ils deviennent plus **petits**.

> **À retenir :** plus un débris a voyagé longtemps, plus il est **petit** et **arrondi**.

## 3. Le dépôt (sédimentation)
Quand le courant **ralentit** (arrivée dans un lac, une mer…), il ne peut plus porter les sédiments : ils se **déposent**. C'est la **sédimentation**. Les gros éléments se déposent en premier, les plus fins ensuite : les dépôts forment des **couches** (les **strates**).

## 4. Des sédiments à la roche sédimentaire
Au fond de l'eau, les couches de sédiments s'accumulent et se **compactent** sous le poids. Peu à peu, elles se **cimentent** et durcissent : elles deviennent une **roche sédimentaire** (grès, calcaire, argile…).

## 5. Un cycle permanent
Altération → érosion → transport → dépôt → nouvelle roche : c'est un **cycle** qui recommence sans fin, à l'échelle de millions d'années. La matière des montagnes finit ainsi au fond des océans, puis parfois de nouveau à l'air libre.

## L'essentiel à retenir
- L'**altération** fragilise et casse les roches (mécanique ou chimique).
- L'**érosion** arrache et **transporte** les débris (eau, vent, glace), qui s'usent en route.
- Le **dépôt** (sédimentation) se fait quand le courant **ralentit** ; les couches forment des **strates**.
- La compaction et le ciment transforment les sédiments en **roche sédimentaire** : c'est un **cycle**.$md$),

    ('Microorganismes et santé', $md$# Microorganismes et santé

## Ce que tu vas comprendre
Le monde est peuplé d'êtres vivants **invisibles à l'œil nu** : les **microorganismes**. La plupart sont utiles, certains sont dangereux. Ce chapitre t'aide à les distinguer et à comprendre comment se protéger.

## 1. Bactéries et virus
Deux grands types de microorganismes sont à connaître :
- une **bactérie** est une **cellule** (procaryote) : c'est un être vivant qui peut se **multiplier tout seul**.
- un **virus** n'est **pas une cellule** : il est bien plus petit et ne peut se multiplier **qu'à l'intérieur** d'une cellule qu'il infecte.

*Exemple : la bactérie du yaourt est utile ; le virus de la grippe est un agent de maladie.*

## 2. Les agents pathogènes
Un microorganisme qui **provoque une maladie** est dit **pathogène**. Il pénètre dans l'organisme (par une plaie, l'air, l'eau, un aliment…), s'y **multiplie** et peut le rendre malade. Attention : **la plupart** des microorganismes ne sont **pas** pathogènes.

## 3. La prévention
On limite les maladies par des gestes de **prévention** :
- l'**hygiène** (se laver les mains, désinfecter une plaie, cuire les aliments) qui **réduit** le nombre de microbes ;
- la **vaccination**, qui **prépare** les défenses de l'organisme à reconnaître un agent pathogène avant même de le rencontrer ;
- les **antibiotiques**, médicaments qui détruisent les **bactéries** — mais **inefficaces** contre les **virus**.

> **À retenir :** un **antibiotique** agit sur les **bactéries**, jamais sur les **virus**.

## 4. Le microbiote, un allié
Notre corps héberge des milliards de microorganismes **utiles**, surtout dans l'intestin : c'est le **microbiote**. Il aide à la **digestion**, participe à nos **défenses** et nous protège des microbes dangereux. Tous les microorganismes ne sont donc pas des ennemis : beaucoup sont indispensables à notre santé.

## L'essentiel à retenir
- Une **bactérie** est une cellule qui se multiplie seule ; un **virus** n'est pas une cellule et infecte une cellule pour se multiplier.
- Un microorganisme **pathogène** provoque une maladie (mais la plupart ne le sont pas).
- **Prévention** : hygiène, vaccination, antibiotiques — ces derniers n'agissent **pas** sur les virus.
- Le **microbiote** rassemble des microorganismes **utiles** à la digestion et aux défenses.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'svt'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('La cellule, unité du vivant', $json${
      "centre": "La cellule, unité du vivant",
      "branches": [
        { "titre": "Théorie cellulaire", "enfants": ["Tout vivant = cellules", "Unité de structure et fonction", "Une cellule vient d'une cellule"] },
        { "titre": "Contenu de la cellule", "enfants": ["Membrane plasmique (échanges)", "Cytoplasme", "ADN = information génétique"] },
        { "titre": "Procaryote / eucaryote", "enfants": ["Procaryote = sans noyau (bactérie)", "Eucaryote = noyau + organites", "ADN universel = parenté"] },
        { "titre": "Échelle du vivant", "enfants": ["Cellule microscopique", "Mesurée en µm", "Observée au microscope"] }
      ]
    }$json$),
    ('Biodiversité et évolution', $json${
      "centre": "Biodiversité et évolution",
      "branches": [
        { "titre": "Niveaux de biodiversité", "enfants": ["Écosystèmes", "Espèces", "Gènes (diversité génétique)"] },
        { "titre": "Sélection naturelle", "enfants": ["Caractère avantageux", "Meilleure survie", "Plus de descendants (Darwin)"] },
        { "titre": "Dérive génétique", "enfants": ["Changement par hasard", "Pas forcément avantageux", "Surtout en petite population"] },
        { "titre": "Spéciation", "enfants": ["Populations séparées", "Évolution séparée", "Deux espèces distinctes"] }
      ]
    }$json$),
    ('Le métabolisme cellulaire', $json${
      "centre": "Le métabolisme cellulaire",
      "branches": [
        { "titre": "Les réactions", "enfants": ["Construire des molécules", "Dégrader pour l'énergie", "Ensemble = métabolisme"] },
        { "titre": "Les enzymes", "enfants": ["Catalyseurs", "Accélèrent la réaction", "Spécifiques d'une réaction"] },
        { "titre": "Sources de matière", "enfants": ["Autotrophe fabrique sa matière", "Hétérotrophe la consomme", "Végétal vs animal"] },
        { "titre": "Photosynthèse / respiration", "enfants": ["Photosynthèse : consomme CO₂, rejette O₂", "Respiration : consomme O₂, rejette CO₂", "Métabolismes inverses"] }
      ]
    }$json$),
    ('Érosion et sédimentation', $json${
      "centre": "Érosion et sédimentation",
      "branches": [
        { "titre": "Altération", "enfants": ["Fragilise et casse la roche", "Mécanique (gel)", "Chimique (dissolution)"] },
        { "titre": "Érosion et transport", "enfants": ["Eau, vent, glace", "Débris usés et arrondis", "Deviennent plus petits"] },
        { "titre": "Dépôt (sédimentation)", "enfants": ["Le courant ralentit", "Les sédiments se déposent", "Couches = strates"] },
        { "titre": "Roche sédimentaire", "enfants": ["Compaction sous le poids", "Ciment qui durcit", "Grès, calcaire, argile"] }
      ]
    }$json$),
    ('Microorganismes et santé', $json${
      "centre": "Microorganismes et santé",
      "branches": [
        { "titre": "Bactéries et virus", "enfants": ["Bactérie = cellule, se multiplie seule", "Virus = pas une cellule", "Virus infecte une cellule"] },
        { "titre": "Agents pathogènes", "enfants": ["Provoquent une maladie", "Se multiplient dans le corps", "La plupart non pathogènes"] },
        { "titre": "Prévention", "enfants": ["Hygiène", "Vaccination", "Antibiotiques (pas les virus)"] },
        { "titre": "Le microbiote", "enfants": ["Microbes utiles", "Surtout dans l'intestin", "Aide digestion et défenses"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'svt'
 WHERE c.subject_id = s.id AND c.level = '2de' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les quiz SVT 2de existent déjà ; ce bloc ne fait rien si
--     un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'SVT', '2de', v.chapter, true, l.id
FROM (VALUES
  ('12619999-0000-4000-8000-000000000001'::uuid, 'La cellule, unité du vivant'),
  ('12619999-0000-4000-8000-000000000002'::uuid, 'Biodiversité et évolution'),
  ('12619999-0000-4000-8000-000000000003'::uuid, 'Le métabolisme cellulaire'),
  ('12619999-0000-4000-8000-000000000004'::uuid, 'Érosion et sédimentation'),
  ('12619999-0000-4000-8000-000000000005'::uuid, 'Microorganismes et santé')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'svt'
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
  -- Chapitre 1 — La cellule, unité du vivant
  ('12610000-0000-4000-8000-000000000104'::uuid, 'La cellule, unité du vivant',
   'Quelle est la plus petite unité capable de vivre par elle-même ?', 'mcq',
   '["La cellule", "L''organe", "La molécule", "Le tissu"]', 0,
   'La cellule est l''unité de base du vivant : la plus petite structure vivante.', 4),
  ('12610000-0000-4000-8000-000000000105'::uuid, 'La cellule, unité du vivant',
   'Une cellule procaryote possède un noyau.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : une cellule procaryote (bactérie) n''a PAS de noyau ; son ADN baigne dans le cytoplasme.', 5),
  ('12610000-0000-4000-8000-000000000106'::uuid, 'La cellule, unité du vivant',
   'Quel rôle joue la membrane plasmique ?', 'mcq',
   '["Contrôler les échanges de la cellule", "Fabriquer l''énergie", "Porter l''information génétique", "Digérer les aliments"]', 0,
   'La membrane plasmique délimite la cellule et contrôle les échanges entre l''intérieur et l''extérieur.', 6),
  ('12610000-0000-4000-8000-000000000107'::uuid, 'La cellule, unité du vivant',
   'Quelle molécule porte l''information génétique dans toute cellule ?', 'mcq',
   '["L''ADN", "L''eau", "Le glucose", "Le dioxygène"]', 0,
   'L''ADN porte l''information génétique et est universel chez tous les êtres vivants.', 7),
  ('12610000-0000-4000-8000-000000000108'::uuid, 'La cellule, unité du vivant',
   'Une cellule eucaryote se caractérise par la présence : ', 'mcq',
   '["D''un noyau", "De rien de particulier", "D''une carapace", "D''ailes"]', 0,
   'La cellule eucaryote possède un noyau (qui enferme l''ADN) et des organites.', 8),
  ('12610000-0000-4000-8000-000000000109'::uuid, 'La cellule, unité du vivant',
   'La présence d''ADN chez tous les êtres vivants est un argument de leur parenté.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''ADN est universel : c''est la même molécule chez tous, ce qui témoigne d''une origine commune.', 9),
  ('12610000-0000-4000-8000-000000000110'::uuid, 'La cellule, unité du vivant',
   'Dans quelle unité mesure-t-on couramment la taille d''une cellule ?', 'mcq',
   '["Le micromètre (µm)", "Le kilomètre", "Le litre", "Le degré"]', 0,
   'Les cellules sont microscopiques et se mesurent en micromètres (µm), un millième de millimètre.', 10),

  -- Chapitre 2 — Biodiversité et évolution
  ('12610000-0000-4000-8000-000000000204'::uuid, 'Biodiversité et évolution',
   'Lequel n''est PAS un niveau de biodiversité ?', 'mcq',
   '["La diversité des couleurs", "La diversité des écosystèmes", "La diversité des espèces", "La diversité génétique"]', 0,
   'Les trois niveaux de biodiversité sont : écosystèmes, espèces et gènes (diversité génétique).', 4),
  ('12610000-0000-4000-8000-000000000205'::uuid, 'Biodiversité et évolution',
   'Selon la sélection naturelle, quels individus laissent le plus de descendants ?', 'mcq',
   '["Ceux dont les caractères sont avantageux dans le milieu", "Les plus âgés", "Ceux choisis au hasard", "Les plus grands seulement"]', 0,
   'Les individus les mieux adaptés survivent mieux et ont plus de descendants : leurs caractères se répandent.', 5),
  ('12610000-0000-4000-8000-000000000206'::uuid, 'Biodiversité et évolution',
   'La dérive génétique fait varier les caractères par hasard.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La dérive génétique modifie les fréquences des caractères par hasard, surtout en petite population.', 6),
  ('12610000-0000-4000-8000-000000000207'::uuid, 'Biodiversité et évolution',
   'La dérive génétique a le plus d''effet dans : ', 'mcq',
   '["Les petites populations", "Les grandes populations", "Les populations immobiles", "Les populations sans ADN"]', 0,
   'Dans une petite population, le hasard a davantage d''influence sur les fréquences des caractères.', 7),
  ('12610000-0000-4000-8000-000000000208'::uuid, 'Biodiversité et évolution',
   'Qu''est-ce qui peut déclencher une spéciation ?', 'mcq',
   '["La séparation durable de deux populations", "Un simple changement de saison", "La couleur du ciel", "Le nombre d''individus par jour"]', 0,
   'Deux populations séparées évoluent chacune de leur côté jusqu''à ne plus pouvoir se reproduire entre elles.', 8),
  ('12610000-0000-4000-8000-000000000209'::uuid, 'Biodiversité et évolution',
   'Deux individus d''une même espèce peuvent avoir une descendance fertile.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est la définition de l''espèce : des individus qui se reproduisent entre eux avec une descendance fertile.', 9),
  ('12610000-0000-4000-8000-000000000210'::uuid, 'Biodiversité et évolution',
   'À qui doit-on l''idée de sélection naturelle ?', 'mcq',
   '["Darwin", "Newton", "Pythagore", "Mendeleïev"]', 0,
   'La sélection naturelle est une idée centrale de la théorie de l''évolution de Charles Darwin.', 10),

  -- Chapitre 3 — Le métabolisme cellulaire
  ('12610000-0000-4000-8000-000000000304'::uuid, 'Le métabolisme cellulaire',
   'Qu''est-ce que le métabolisme d''une cellule ?', 'mcq',
   '["L''ensemble de ses réactions chimiques", "Sa taille", "Sa couleur", "Son âge"]', 0,
   'Le métabolisme est l''ensemble des réactions chimiques qui se déroulent dans la cellule.', 4),
  ('12610000-0000-4000-8000-000000000305'::uuid, 'Le métabolisme cellulaire',
   'Une enzyme agit comme : ', 'mcq',
   '["Un catalyseur qui accélère une réaction", "Un déchet", "Un noyau", "Une membrane"]', 0,
   'Une enzyme est un catalyseur : elle accélère une réaction sans être consommée.', 5),
  ('12610000-0000-4000-8000-000000000306'::uuid, 'Le métabolisme cellulaire',
   'Chaque enzyme est spécifique d''une réaction précise.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une enzyme reconnaît une molécule bien particulière : elle est spécifique de sa réaction.', 6),
  ('12610000-0000-4000-8000-000000000307'::uuid, 'Le métabolisme cellulaire',
   'Une cellule autotrophe : ', 'mcq',
   '["Fabrique sa matière organique à partir de matière minérale", "Ne fabrique jamais rien", "Doit manger d''autres cellules", "N''a pas d''ADN"]', 0,
   'Une cellule autotrophe (végétale) fabrique sa matière organique à partir de CO₂, d''eau et de lumière.', 7),
  ('12610000-0000-4000-8000-000000000308'::uuid, 'Le métabolisme cellulaire',
   'La cellule animale est hétérotrophe : elle consomme de la matière organique déjà faite.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une cellule hétérotrophe (animale) ne fabrique pas sa matière organique : elle doit la consommer.', 8),
  ('12610000-0000-4000-8000-000000000309'::uuid, 'Le métabolisme cellulaire',
   'Lors de la photosynthèse, la cellule végétale rejette : ', 'mcq',
   '["Du dioxygène", "Du dioxyde de carbone seulement", "De l''ADN", "Des enzymes"]', 0,
   'La photosynthèse consomme du CO₂ et de l''eau, produit de la matière organique et rejette du dioxygène.', 9),
  ('12610000-0000-4000-8000-000000000310'::uuid, 'Le métabolisme cellulaire',
   'Lors de la respiration, la cellule consomme : ', 'mcq',
   '["Du dioxygène", "Du dioxyde de carbone", "De la lumière", "Rien du tout"]', 0,
   'La respiration consomme du dioxygène et de la matière organique pour libérer de l''énergie, et rejette du CO₂.', 10),

  -- Chapitre 4 — Érosion et sédimentation
  ('12610000-0000-4000-8000-000000000404'::uuid, 'Érosion et sédimentation',
   'Que fait l''altération à une roche ?', 'mcq',
   '["Elle la fragilise et la casse", "Elle la fait pousser", "Elle la rend vivante", "Elle la déplace vers le haut"]', 0,
   'L''altération (gel, eau, température…) fragilise la roche et la casse en morceaux.', 4),
  ('12610000-0000-4000-8000-000000000405'::uuid, 'Érosion et sédimentation',
   'Lequel N''EST PAS un agent de transport des sédiments ?', 'mcq',
   '["La lumière", "L''eau", "Le vent", "La glace"]', 0,
   'Les sédiments sont transportés par l''eau, le vent et la glace ; la lumière ne transporte rien.', 5),
  ('12610000-0000-4000-8000-000000000406'::uuid, 'Érosion et sédimentation',
   'Plus un débris a été transporté longtemps, plus il est petit et arrondi.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Pendant le transport, les débris s''usent : leurs angles s''arrondissent et ils rapetissent.', 6),
  ('12610000-0000-4000-8000-000000000407'::uuid, 'Érosion et sédimentation',
   'Quand se produit le dépôt des sédiments ?', 'mcq',
   '["Quand le courant ralentit", "Quand le courant accélère", "Jamais", "Uniquement la nuit"]', 0,
   'Quand le courant ralentit, il ne peut plus porter les sédiments : ils se déposent (sédimentation).', 7),
  ('12610000-0000-4000-8000-000000000408'::uuid, 'Érosion et sédimentation',
   'Comment appelle-t-on les couches successives de sédiments ?', 'mcq',
   '["Des strates", "Des racines", "Des cellules", "Des enzymes"]', 0,
   'Les dépôts s''accumulent en couches appelées strates.', 8),
  ('12610000-0000-4000-8000-000000000409'::uuid, 'Érosion et sédimentation',
   'Laquelle est une roche sédimentaire ?', 'mcq',
   '["Le calcaire", "Le fer pur", "Le plastique", "Le verre"]', 0,
   'Le calcaire, le grès et l''argile sont des roches sédimentaires issues de sédiments compactés et cimentés.', 9),
  ('12610000-0000-4000-8000-000000000410'::uuid, 'Érosion et sédimentation',
   'La matière des roches suit un cycle : altération, érosion, transport, dépôt, nouvelle roche.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ces étapes forment un cycle qui se répète à l''échelle de millions d''années.', 10),

  -- Chapitre 5 — Microorganismes et santé
  ('12610000-0000-4000-8000-000000000504'::uuid, 'Microorganismes et santé',
   'Laquelle de ces affirmations sur la bactérie est vraie ?', 'mcq',
   '["C''est une cellule qui peut se multiplier seule", "Ce n''est pas un être vivant", "Elle est toujours plus petite qu''un virus", "Elle n''a jamais d''ADN"]', 0,
   'Une bactérie est une cellule (procaryote) vivante, capable de se multiplier par elle-même.', 4),
  ('12610000-0000-4000-8000-000000000505'::uuid, 'Microorganismes et santé',
   'Un virus peut se multiplier tout seul, en dehors de toute cellule.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : un virus n''est pas une cellule ; il ne se multiplie qu''à l''intérieur d''une cellule qu''il infecte.', 5),
  ('12610000-0000-4000-8000-000000000506'::uuid, 'Microorganismes et santé',
   'Un microorganisme qui provoque une maladie est dit : ', 'mcq',
   '["Pathogène", "Autotrophe", "Sédimentaire", "Minéral"]', 0,
   'Un microorganisme pathogène est celui qui provoque une maladie.', 6),
  ('12610000-0000-4000-8000-000000000507'::uuid, 'Microorganismes et santé',
   'La plupart des microorganismes sont pathogènes.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la grande majorité des microorganismes ne sont pas pathogènes, beaucoup sont même utiles.', 7),
  ('12610000-0000-4000-8000-000000000508'::uuid, 'Microorganismes et santé',
   'Contre quoi un antibiotique est-il efficace ?', 'mcq',
   '["Les bactéries", "Les virus", "Les deux également", "Aucun microbe"]', 0,
   'Un antibiotique agit sur les bactéries, mais il est inefficace contre les virus.', 8),
  ('12610000-0000-4000-8000-000000000509'::uuid, 'Microorganismes et santé',
   'Quel geste relève de la prévention des maladies ?', 'mcq',
   '["Se laver les mains", "Ignorer une plaie", "Manger des aliments crus douteux", "Ne jamais se vacciner"]', 0,
   'L''hygiène (comme se laver les mains) réduit le nombre de microbes et prévient les maladies.', 9),
  ('12610000-0000-4000-8000-000000000510'::uuid, 'Microorganismes et santé',
   'Le microbiote est un ensemble de microorganismes utiles à notre santé.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le microbiote (surtout intestinal) aide à la digestion et participe à nos défenses.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'svt'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '2de' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
