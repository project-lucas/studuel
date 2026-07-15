-- =============================================================================
-- Studuel — Migration 138 : CONTENU Enseignement scientifique 1re (cours + carte mentale + quiz)
-- Remplit les 4 chapitres d'Enseignement scientifique 1re (tronc commun, prog. officiel) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder de la migration de structure)
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
-- PRÉREQUIS : structure (subjects/chapters/lessons), mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('La Terre, un astre singulier', $md$# La Terre, un astre singulier

## Ce que tu vas comprendre
Comment sait-on que la Terre est ronde, quelle est sa taille, et pourquoi est-elle une planète à part dans le système solaire ? Ce chapitre retrace l'histoire des mesures et montre ce qui rend notre planète unique.

## 1. La forme de la Terre
Dès l'Antiquité, on savait la Terre **sphérique** : ombre ronde sur la Lune lors des éclipses, disparition des bateaux « par la coque » à l'horizon, hauteur des étoiles qui change avec le lieu. La Terre est en réalité un **géoïde**, très légèrement aplati aux pôles.

## 2. La première mesure : Ératosthène
Vers **-240**, **Ératosthène** mesure la circonférence de la Terre. Le même jour à midi, le Soleil est au zénith à Syène (fond d'un puits éclairé) mais fait un angle de **7,2°** à Alexandrie. Comme 7,2° est le **1/50** d'un tour complet (360°), la circonférence vaut 50 fois la distance Syène-Alexandrie.

*Résultat : environ **40 000 km**, à quelques % près de la valeur réelle.*

## 3. Le méridien et le mètre
Un **méridien** est un demi-grand cercle joignant les deux pôles. À la Révolution française, le **mètre** est défini comme la **dix-millionième partie** du quart de méridien (pôle → équateur). D'où la circonférence terrestre voisine de **40 000 km**.

## 4. Dimensions à connaître
- Rayon terrestre : environ **6 400 km**.
- Circonférence : environ **40 000 km**.
- Distance Terre-Soleil : environ **150 millions de km** (1 unité astronomique).

## 5. La singularité de la Terre
Parmi les planètes du système solaire, la Terre est la seule à réunir :
- de l'**eau liquide** en surface (bonne distance au Soleil = « zone habitable ») ;
- une **atmosphère** riche en dioxygène ;
- une **température** moyenne (~15 °C) permettant la vie.

C'est cette combinaison qui fait de la Terre un astre **singulier**, propice au vivant.

## L'essentiel à retenir
- La Terre est **sphérique** (géoïde légèrement aplati aux pôles).
- **Ératosthène** a mesuré sa circonférence (~40 000 km) grâce à un angle de 7,2°.
- Le **mètre** vient du méridien : 1/10 000 000 du quart de méridien.
- Rayon ~6 400 km ; la Terre est singulière par l'eau liquide, l'atmosphère et la vie.$md$),

    ('Le Soleil, source d''énergie', $md$# Le Soleil, source d'énergie

## Ce que tu vas comprendre
D'où vient l'énergie du Soleil, comment arrive-t-elle jusqu'à nous, et comment la Terre s'en sert-elle ? Ce chapitre relie la fusion nucléaire, le rayonnement, la photosynthèse et nos énergies quotidiennes.

## 1. La source : la fusion nucléaire
Au cœur du Soleil, à des millions de degrés, des noyaux d'**hydrogène** fusionnent pour former de l'**hélium**. Cette **fusion nucléaire** libère d'énormes quantités d'énergie (relation E = mc²). Le Soleil transforme ainsi environ **4 millions de tonnes** de matière en énergie **chaque seconde**.

## 2. Le rayonnement solaire
Cette énergie quitte le Soleil sous forme de **rayonnement électromagnétique** (lumière visible, infrarouge, ultraviolet). La **puissance** reçue au sommet de l'atmosphère est d'environ **1 360 W/m²** (constante solaire).

## 3. Le bilan radiatif de la Terre
La Terre reçoit l'énergie solaire, en **réfléchit** une partie (l'**albédo** : nuages, glaces, déserts clairs) et **rayonne** vers l'espace dans l'infrarouge. À l'équilibre, énergie reçue = énergie émise, ce qui fixe la **température moyenne** de la planète. Les gaz à effet de serre modifient ce bilan.

## 4. La photosynthèse
Les végétaux captent l'énergie lumineuse : c'est la **photosynthèse**. À partir de dioxyde de carbone et d'eau, ils fabriquent de la **matière organique** (glucose) et libèrent du **dioxygène**. L'énergie solaire est ainsi **stockée** dans la biomasse.

*Bilan simplifié : CO₂ + H₂O + lumière → matière organique + O₂.*

## 5. Des énergies (presque) toutes solaires
- Les **combustibles fossiles** (charbon, pétrole) sont de la biomasse ancienne : de l'énergie solaire fossilisée.
- L'**éolien** vient des vents, créés par le chauffage inégal de l'atmosphère.
- L'**hydraulique** vient du cycle de l'eau, entretenu par le Soleil.
- Le **solaire** (panneaux) capte directement le rayonnement.

## L'essentiel à retenir
- L'énergie solaire vient de la **fusion** de l'hydrogène en hélium.
- Elle nous parvient par **rayonnement** (~1 360 W/m² au sommet de l'atmosphère).
- Le **bilan radiatif** (reçu = émis) fixe la température de la Terre.
- La **photosynthèse** stocke l'énergie solaire ; la plupart de nos énergies en dérivent.$md$),

    ('Une longue histoire de la matière', $md$# Une longue histoire de la matière

## Ce que tu vas comprendre
De quoi est faite la matière, d'où viennent les atomes, et comment s'organise-t-elle du cristal jusqu'à la cellule vivante ? Ce chapitre suit la matière des étoiles jusqu'au vivant.

## 1. Atomes et éléments
Toute la matière est faite d'**atomes**. Un atome a un **noyau** (protons et neutrons) entouré d'**électrons**. Le nombre de **protons** (numéro atomique Z) définit l'**élément chimique** : 1 pour l'hydrogène, 6 pour le carbone, 8 pour l'oxygène. Les éléments sont classés dans le **tableau périodique**.

## 2. La nucléosynthèse : forger les éléments
- Les éléments les plus légers (**hydrogène**, **hélium**) sont nés juste après le **Big Bang**.
- Les éléments plus lourds (carbone, oxygène, fer…) sont fabriqués au cœur des **étoiles** par fusion : c'est la **nucléosynthèse stellaire**.
- Les plus lourds encore naissent dans les **explosions d'étoiles** (supernovas).

*Autrement dit : les atomes de ton corps ont été fabriqués dans des étoiles.*

## 3. Un âge, une histoire
La matière a une **histoire** longue de milliards d'années :
- Big Bang : environ **13,8 milliards d'années**.
- Système solaire et Terre : environ **4,6 milliards d'années**.
La radioactivité (désintégration à rythme constant) sert d'**horloge** pour dater roches et fossiles.

## 4. L'organisation : les cristaux
Dans un **cristal** (sel, quartz, métaux), les atomes ou ions sont rangés de façon **ordonnée et périodique** : c'est une **structure cristalline** qui se répète dans l'espace. Cet ordre explique les formes géométriques régulières des minéraux.

## 5. La matière du vivant : la cellule
Les êtres vivants sont faits de **cellules**, unités de base délimitées par une **membrane**. Elles sont surtout composées d'éléments légers : **carbone, hydrogène, oxygène, azote**. La même matière que les étoiles s'organise ici en molécules du vivant (ADN, protéines).

## L'essentiel à retenir
- La matière est faite d'**atomes** ; le nombre de **protons** définit l'**élément**.
- **Hydrogène et hélium** viennent du Big Bang ; les éléments lourds, des **étoiles**.
- Big Bang ~13,8 Ga, Terre ~4,6 Ga ; la radioactivité sert d'horloge.
- La matière s'organise en **cristaux** (ordre périodique) et en **cellules** (le vivant).$md$),

    ('Son et musique', $md$# Son et musique

## Ce que tu vas comprendre
Qu'est-ce qu'un son, pourquoi une note est-elle plus ou moins aiguë, et comment se construit une gamme musicale ? Ce chapitre relie physique du signal sonore et musique.

## 1. Le son, une onde
Un **son** est une **vibration** de la matière (air, eau, solide) qui se propage de proche en proche : c'est une **onde**. Il a besoin d'un **milieu** matériel — il ne se propage **pas** dans le vide. Dans l'air, le son voyage à environ **340 m/s**.

## 2. Le signal sonore : période et fréquence
Un son pur se représente par un signal qui se **répète** dans le temps.
- La **période** T est la durée d'un motif (en secondes).
- La **fréquence** f est le nombre de motifs par seconde, en **hertz (Hz)** : f = 1 / T.
Plus la fréquence est **élevée**, plus le son est **aigu** ; plus elle est basse, plus le son est **grave**. L'oreille humaine perçoit environ de **20 Hz à 20 000 Hz**.

## 3. Hauteur et intensité
- La **hauteur** (grave/aigu) dépend de la **fréquence**.
- L'**intensité** (fort/faible) dépend de l'**amplitude** du signal ; elle se mesure en **décibels (dB)**.

## 4. La gamme et les octaves
Une **gamme** est une suite de notes. Quand la fréquence est **doublée**, on monte d'une **octave** et on retrouve « la même note » plus aiguë.

*Exemple : le La₃ vaut **440 Hz**, le La₄ (une octave au-dessus) vaut **880 Hz**.*

Les intervalles agréables correspondent à des **rapports simples** de fréquences (par exemple 3/2 pour la quinte), une idée qui remonte à Pythagore.

## 5. Instruments et harmoniques
Un instrument ne produit pas un son pur : il émet une **fréquence fondamentale** (qui donne la note) accompagnée d'**harmoniques** (multiples de la fondamentale). La répartition de ces harmoniques donne le **timbre**, ce qui fait qu'un piano et une guitare jouant la même note sonnent **différemment**.

## L'essentiel à retenir
- Un son est une **onde** qui a besoin d'un **milieu** matériel (pas dans le vide).
- **f = 1 / T**, en hertz ; fréquence élevée → son **aigu**, basse → son **grave**.
- Doubler la fréquence = monter d'une **octave** (La 440 Hz → 880 Hz).
- La **fondamentale** donne la note, les **harmoniques** donnent le **timbre**.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'enseignement-scientifique'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('La Terre, un astre singulier', $json${
      "centre": "La Terre, un astre singulier",
      "branches": [
        { "titre": "Forme de la Terre", "enfants": ["Sphérique (géoïde)", "Aplatie aux pôles", "Ombre ronde, bateaux à l'horizon"] },
        { "titre": "Mesurer la Terre", "enfants": ["Ératosthène (-240)", "Angle de 7,2° = 1/50 de tour", "Circonférence ~40 000 km"] },
        { "titre": "Méridien et mètre", "enfants": ["Méridien = pôle à pôle", "Mètre = 1/10 000 000 du quart", "Rayon ~6 400 km"] },
        { "titre": "Singularité", "enfants": ["Eau liquide en surface", "Atmosphère avec dioxygène", "Température ~15 °C, la vie"] }
      ]
    }$json$),
    ('Le Soleil, source d''énergie', $json${
      "centre": "Le Soleil, source d'énergie",
      "branches": [
        { "titre": "Fusion nucléaire", "enfants": ["Hydrogène → hélium", "E = mc²", "4 millions de t/s converties"] },
        { "titre": "Rayonnement", "enfants": ["Onde électromagnétique", "~1 360 W/m² au sommet", "Visible, infrarouge, UV"] },
        { "titre": "Bilan radiatif", "enfants": ["Reçu = émis à l'équilibre", "Albédo (réflexion)", "Fixe la température"] },
        { "titre": "Énergie sur Terre", "enfants": ["Photosynthèse → biomasse", "Fossiles, éolien, hydraulique", "Presque tout vient du Soleil"] }
      ]
    }$json$),
    ('Une longue histoire de la matière', $json${
      "centre": "Une longue histoire de la matière",
      "branches": [
        { "titre": "Atomes et éléments", "enfants": ["Noyau + électrons", "Nb de protons = élément", "Tableau périodique"] },
        { "titre": "Nucléosynthèse", "enfants": ["H et He : Big Bang", "Éléments lourds : étoiles", "Très lourds : supernovas"] },
        { "titre": "Une histoire datée", "enfants": ["Big Bang ~13,8 Ga", "Terre ~4,6 Ga", "Radioactivité = horloge"] },
        { "titre": "Organisation", "enfants": ["Cristaux : ordre périodique", "Cellules : le vivant", "C, H, O, N"] }
      ]
    }$json$),
    ('Son et musique', $json${
      "centre": "Son et musique",
      "branches": [
        { "titre": "Le son, une onde", "enfants": ["Vibration de la matière", "Pas de son dans le vide", "~340 m/s dans l'air"] },
        { "titre": "Période et fréquence", "enfants": ["f = 1 / T, en hertz", "Aigu = fréquence élevée", "Oreille : 20 Hz à 20 000 Hz"] },
        { "titre": "Gamme et octave", "enfants": ["Doubler f = +1 octave", "La 440 Hz → 880 Hz", "Rapports simples (quinte 3/2)"] },
        { "titre": "Instruments", "enfants": ["Fondamentale = la note", "Harmoniques = multiples", "Le timbre distingue les sons"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'enseignement-scientifique'
 WHERE c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal la migration de structure a déjà créé les quiz ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Ens. scientifique', '1re', v.chapter, true, l.id
FROM (VALUES
  ('13819999-0000-4000-8000-000000000001'::uuid, 'La Terre, un astre singulier'),
  ('13819999-0000-4000-8000-000000000002'::uuid, 'Le Soleil, source d''énergie'),
  ('13819999-0000-4000-8000-000000000003'::uuid, 'Une longue histoire de la matière'),
  ('13819999-0000-4000-8000-000000000004'::uuid, 'Son et musique')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'enseignement-scientifique'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
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
  -- Chapitre 1 — La Terre, un astre singulier
  ('13810000-0000-4000-8000-000000000104'::uuid, 'La Terre, un astre singulier',
   'Quelle est la forme réelle de la Terre ?', 'mcq',
   '["Une sphère légèrement aplatie aux pôles (géoïde)", "Un disque plat", "Un cube arrondi", "Un cylindre"]', 0,
   'La Terre est un géoïde : quasiment sphérique, mais un peu aplatie aux pôles.', 4),
  ('13810000-0000-4000-8000-000000000105'::uuid, 'La Terre, un astre singulier',
   'Qui a mesuré la circonférence de la Terre dès l''Antiquité (vers -240) ?', 'mcq',
   '["Ératosthène", "Newton", "Copernic", "Galilée"]', 0,
   'Ératosthène a estimé la circonférence terrestre à partir d''un angle de 7,2° mesuré à Alexandrie.', 5),
  ('13810000-0000-4000-8000-000000000106'::uuid, 'La Terre, un astre singulier',
   'La circonférence de la Terre vaut environ : ', 'mcq',
   '["40 000 km", "4 000 km", "400 000 km", "1 000 km"]', 0,
   'La circonférence terrestre est d''environ 40 000 km (rayon ~6 400 km).', 6),
  ('13810000-0000-4000-8000-000000000107'::uuid, 'La Terre, un astre singulier',
   'Le mètre a été défini à partir du méridien terrestre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le mètre fut défini comme la dix-millionième partie du quart de méridien (pôle à équateur).', 7),
  ('13810000-0000-4000-8000-000000000108'::uuid, 'La Terre, un astre singulier',
   'Ératosthène a utilisé un angle mesuré à Alexandrie de : ', 'mcq',
   '["7,2°", "45°", "90°", "23,5°"]', 0,
   '7,2° correspond au 1/50 d''un tour complet (360°), d''où la circonférence = 50 × distance.', 8),
  ('13810000-0000-4000-8000-000000000109'::uuid, 'La Terre, un astre singulier',
   'Qu''est-ce qui rend la Terre singulière dans le système solaire ?', 'mcq',
   '["La présence d''eau liquide en surface et de la vie", "Sa couleur rouge", "Ses anneaux", "Son absence d''atmosphère"]', 0,
   'La Terre réunit eau liquide, atmosphère et température modérée : des conditions propices à la vie.', 9),
  ('13810000-0000-4000-8000-000000000110'::uuid, 'La Terre, un astre singulier',
   'Un méridien est un demi-grand cercle qui joint les deux pôles.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un méridien relie le pôle Nord au pôle Sud ; tous les méridiens ont la même longueur.', 10),

  -- Chapitre 2 — Le Soleil, source d'énergie
  ('13810000-0000-4000-8000-000000000204'::uuid, 'Le Soleil, source d''énergie',
   'Quelle réaction produit l''énergie du Soleil ?', 'mcq',
   '["La fusion de l''hydrogène en hélium", "La combustion du charbon", "La fission de l''uranium", "Une réaction chimique acide-base"]', 0,
   'Au cœur du Soleil, des noyaux d''hydrogène fusionnent en hélium et libèrent une énorme énergie.', 4),
  ('13810000-0000-4000-8000-000000000205'::uuid, 'Le Soleil, source d''énergie',
   'Comment l''énergie du Soleil parvient-elle jusqu''à la Terre ?', 'mcq',
   '["Par rayonnement électromagnétique", "Par conduction dans un fil", "Par un courant d''air", "Par contact direct"]', 0,
   'L''énergie voyage dans le vide sous forme de rayonnement (lumière visible, infrarouge, UV).', 5),
  ('13810000-0000-4000-8000-000000000206'::uuid, 'Le Soleil, source d''énergie',
   'Le processus par lequel les plantes captent l''énergie lumineuse s''appelle : ', 'mcq',
   '["La photosynthèse", "La respiration", "La combustion", "La fermentation"]', 0,
   'La photosynthèse utilise la lumière pour produire de la matière organique et libérer du dioxygène.', 6),
  ('13810000-0000-4000-8000-000000000207'::uuid, 'Le Soleil, source d''énergie',
   'À l''équilibre, la Terre émet vers l''espace autant d''énergie qu''elle en reçoit du Soleil.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'C''est le bilan radiatif : à l''équilibre, énergie reçue = énergie émise, ce qui fixe la température.', 7),
  ('13810000-0000-4000-8000-000000000208'::uuid, 'Le Soleil, source d''énergie',
   'La photosynthèse libère quel gaz dans l''atmosphère ?', 'mcq',
   '["Du dioxygène (O₂)", "Du dioxyde de carbone (CO₂)", "De l''azote (N₂)", "Du méthane (CH₄)"]', 0,
   'Les végétaux consomment du CO₂ et rejettent du dioxygène.', 8),
  ('13810000-0000-4000-8000-000000000209'::uuid, 'Le Soleil, source d''énergie',
   'Les combustibles fossiles (charbon, pétrole) sont une forme d''énergie solaire stockée.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ils proviennent de biomasse ancienne, elle-même issue de la photosynthèse : de l''énergie solaire fossilisée.', 9),
  ('13810000-0000-4000-8000-000000000210'::uuid, 'Le Soleil, source d''énergie',
   'La part de l''énergie solaire réfléchie par la Terre (nuages, glaces) s''appelle : ', 'mcq',
   '["L''albédo", "L''effet de serre", "La fréquence", "L''octave"]', 0,
   'L''albédo mesure la fraction du rayonnement solaire renvoyée vers l''espace.', 10),

  -- Chapitre 3 — Une longue histoire de la matière
  ('13810000-0000-4000-8000-000000000304'::uuid, 'Une longue histoire de la matière',
   'Qu''est-ce qui définit un élément chimique ?', 'mcq',
   '["Le nombre de protons du noyau", "Le nombre d''électrons libres", "Sa couleur", "Sa température"]', 0,
   'Le numéro atomique Z (nombre de protons) définit l''élément : Z = 6 pour le carbone, par exemple.', 4),
  ('13810000-0000-4000-8000-000000000305'::uuid, 'Une longue histoire de la matière',
   'Où sont fabriqués les éléments chimiques plus lourds que l''hélium ?', 'mcq',
   '["Au cœur des étoiles (nucléosynthèse)", "Dans les océans", "Dans l''atmosphère terrestre", "Dans les volcans"]', 0,
   'La fusion dans les étoiles, puis les supernovas, forgent les éléments lourds : carbone, oxygène, fer…', 5),
  ('13810000-0000-4000-8000-000000000306'::uuid, 'Une longue histoire de la matière',
   'Quels éléments se sont formés juste après le Big Bang ?', 'mcq',
   '["L''hydrogène et l''hélium", "Le fer et l''or", "Le carbone et l''azote", "L''uranium"]', 0,
   'Les éléments les plus légers, hydrogène et hélium, datent des premiers instants de l''Univers.', 6),
  ('13810000-0000-4000-8000-000000000307'::uuid, 'Une longue histoire de la matière',
   'Dans un cristal, les atomes ou ions sont rangés de façon ordonnée et périodique.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La structure cristalline est un empilement ordonné qui se répète régulièrement dans l''espace.', 7),
  ('13810000-0000-4000-8000-000000000308'::uuid, 'Une longue histoire de la matière',
   'L''âge de l''Univers (Big Bang) est estimé à environ : ', 'mcq',
   '["13,8 milliards d''années", "4,6 milliards d''années", "1 million d''années", "100 milliards d''années"]', 0,
   'Le Big Bang remonte à ~13,8 milliards d''années ; la Terre, elle, à ~4,6 milliards d''années.', 8),
  ('13810000-0000-4000-8000-000000000309'::uuid, 'Une longue histoire de la matière',
   'Quelle est l''unité de base qui constitue tous les êtres vivants ?', 'mcq',
   '["La cellule", "L''atome de fer", "Le cristal", "La molécule d''eau"]', 0,
   'Les êtres vivants sont faits de cellules, délimitées par une membrane, riches en C, H, O, N.', 9),
  ('13810000-0000-4000-8000-000000000310'::uuid, 'Une longue histoire de la matière',
   'La radioactivité, à rythme constant, sert d''horloge pour dater roches et fossiles.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La désintégration régulière d''éléments radioactifs permet de mesurer des âges (datation).', 10),

  -- Chapitre 4 — Son et musique
  ('13810000-0000-4000-8000-000000000404'::uuid, 'Son et musique',
   'Un son peut-il se propager dans le vide ?', 'mcq',
   '["Non, il a besoin d''un milieu matériel", "Oui, comme la lumière", "Oui, mais seulement la nuit", "Uniquement dans l''espace"]', 0,
   'Le son est une vibration de la matière : sans milieu (air, eau, solide), il ne se propage pas.', 4),
  ('13810000-0000-4000-8000-000000000405'::uuid, 'Son et musique',
   'Quelle relation lie la fréquence f et la période T d''un signal sonore ?', 'mcq',
   '["f = 1 / T", "f = T", "f = T²", "f = 2T"]', 0,
   'La fréquence est l''inverse de la période : f = 1/T, exprimée en hertz (Hz).', 5),
  ('13810000-0000-4000-8000-000000000406'::uuid, 'Son et musique',
   'Un son de fréquence élevée est perçu comme : ', 'mcq',
   '["Aigu", "Grave", "Silencieux", "Faible"]', 0,
   'Plus la fréquence est élevée, plus le son est aigu ; une fréquence basse donne un son grave.', 6),
  ('13810000-0000-4000-8000-000000000407'::uuid, 'Son et musique',
   'Quand la fréquence d''une note double, on monte d''une octave.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Doubler la fréquence fait monter d''une octave : le La 440 Hz devient un La 880 Hz.', 7),
  ('13810000-0000-4000-8000-000000000408'::uuid, 'Son et musique',
   'La fréquence se mesure en : ', 'mcq',
   '["Hertz (Hz)", "Décibels (dB)", "Mètres (m)", "Secondes (s)"]', 0,
   'La fréquence s''exprime en hertz ; l''intensité sonore, elle, se mesure en décibels.', 8),
  ('13810000-0000-4000-8000-000000000409'::uuid, 'Son et musique',
   'Qu''est-ce qui distingue le son d''un piano de celui d''une guitare jouant la même note ?', 'mcq',
   '["Le timbre (répartition des harmoniques)", "La vitesse du son", "La période fondamentale", "Le nombre d''octaves"]', 0,
   'La même fondamentale donne la même note, mais les harmoniques diffèrent : c''est le timbre.', 9),
  ('13810000-0000-4000-8000-000000000410'::uuid, 'Son et musique',
   'L''oreille humaine perçoit approximativement les fréquences de 20 Hz à 20 000 Hz.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le domaine audible s''étend d''environ 20 Hz (graves) à 20 000 Hz (aigus).', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'enseignement-scientifique'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
