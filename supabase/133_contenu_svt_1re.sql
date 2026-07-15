-- =============================================================================
-- Studuel — Migration 133 : CONTENU SVT 1re (cours + carte mentale + quiz)
-- Remplit les 4 chapitres de SVT 1re (spécialité, programme officiel) :
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
-- PRÉREQUIS : structure SVT 1re (subjects/chapters/lessons), mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Expression du patrimoine génétique', $md$# Expression du patrimoine génétique

## Ce que tu vas comprendre
L'information nécessaire à la vie d'une cellule est écrite dans l'**ADN**. Mais l'ADN reste dans le noyau : pour agir, il doit être **exprimé** sous forme de protéines. Ce chapitre suit le trajet **ADN → ARN → protéine**.

## 1. De l'ADN au phénotype
Un **gène** est une portion d'ADN qui porte l'information pour fabriquer une **protéine**. Les protéines (enzymes, hormones, protéines de structure) réalisent les fonctions de la cellule et déterminent le **phénotype** (les caractères de l'organisme).

*Exemple : le gène de l'insuline permet de fabriquer l'hormone qui régule la glycémie.*

## 2. La transcription (ADN → ARN)
Dans le **noyau**, une enzyme, l'**ARN polymérase**, recopie un brin du gène en une molécule d'**ARN messager** (ARNm). C'est la **transcription** :
- l'ADN est double brin, l'ARNm est **simple brin** ;
- l'ARN contient de l'**uracile (U)** à la place de la thymine (T) ;
- l'appariement se fait A↔U, T↔A, G↔C, C↔G.

L'ARNm sort ensuite du noyau vers le **cytoplasme**.

## 3. La traduction (ARN → protéine)
Dans le cytoplasme, les **ribosomes** lisent l'ARNm **codon par codon** (un codon = 3 nucléotides) et assemblent une chaîne d'**acides aminés** : c'est la **traduction**. La chaîne d'acides aminés forme la protéine.

## 4. Le code génétique
Le **code génétique** est le tableau de correspondance entre les **codons** et les **acides aminés**. Il est :
- **universel** : le même pour presque tous les êtres vivants ;
- **redondant** : plusieurs codons peuvent coder le même acide aminé ;
- il possède un codon **start** (début) et des codons **stop** (fin).

## 5. Un phénotype à plusieurs échelles
Le phénotype se lit à l'échelle **moléculaire** (les protéines), **cellulaire**, puis **de l'organisme**. Une modification de l'ADN peut donc se répercuter jusqu'aux caractères visibles.

## L'essentiel à retenir
- Un **gène** code une **protéine** ; les protéines déterminent le **phénotype**.
- **Transcription** (noyau) : ADN → ARNm (simple brin, U remplace T).
- **Traduction** (ribosome) : ARNm lu par codons → chaîne d'acides aminés.
- Le **code génétique** est universel et redondant (codons start / stop).$md$),

    ('La dynamique interne de la Terre', $md$# La dynamique interne de la Terre

## Ce que tu vas comprendre
La surface de la Terre n'est pas figée : elle est découpée en **plaques** qui bougent lentement. Ce mouvement explique les séismes, les volcans et le relief. Ce chapitre décrit le moteur interne de la planète.

## 1. La structure de la Terre
La Terre est formée de couches : la **croûte** (continentale ou océanique), le **manteau** (solide mais capable de se déformer lentement) et le **noyau**. La couche rigide de surface, la **lithosphère**, repose sur l'**asthénosphère**, plus ductile.

## 2. Les plaques lithosphériques
La lithosphère est découpée en une douzaine de grandes **plaques** rigides. Elles se déplacent de quelques **centimètres par an**, à la vitesse de croissance d'un ongle. Les frontières de plaques concentrent l'essentiel des **séismes** et des **volcans**.

## 3. Les dorsales (divergence)
Au niveau des **dorsales océaniques**, deux plaques s'**écartent**. Du magma remonte, refroidit et crée en permanence de la **nouvelle lithosphère océanique** : c'est l'**accrétion**. La croûte océanique est d'autant plus **ancienne** qu'elle est **loin** de la dorsale.

*Exemple : la dorsale médio-atlantique écarte l'Amérique de l'Europe.*

## 4. Les zones de subduction (convergence)
Là où deux plaques se **rapprochent**, la plaque océanique, plus **dense**, plonge sous l'autre : c'est la **subduction**. Ces zones produisent de forts **séismes** et un **volcanisme** explosif (arcs volcaniques).

## 5. Le moteur : le flux de chaleur
La Terre libère de la chaleur (issue surtout de la **radioactivité** des roches). Cette chaleur crée des mouvements de matière dans le manteau (**convection**), qui déplacent les plaques. Le **flux géothermique** est plus élevé aux dorsales.

## L'essentiel à retenir
- La **lithosphère** rigide est découpée en **plaques** mobiles (quelques cm/an).
- **Dorsales** : divergence, création de lithosphère océanique (accrétion).
- **Subduction** : convergence, la plaque dense plonge → séismes et volcans.
- Le moteur est le **flux de chaleur** interne (radioactivité, convection du manteau).$md$),

    ('Écosystèmes et services', $md$# Écosystèmes et services

## Ce que tu vas comprendre
Un **écosystème** associe des êtres vivants et leur milieu. Il rend des **services** indispensables à l'humanité. Ce chapitre montre comment fonctionnent ces systèmes et pourquoi il faut les préserver.

## 1. Qu'est-ce qu'un écosystème ?
Un **écosystème** est l'ensemble formé par une **communauté d'êtres vivants** (la biocénose) et son **milieu physique** (le biotope), reliés par des échanges de **matière** et d'**énergie**.

*Exemple : une forêt, avec ses arbres, ses animaux, son sol, son climat.*

## 2. La biodiversité
La **biodiversité** est la diversité du vivant à trois niveaux :
- diversité des **écosystèmes** ;
- diversité des **espèces** ;
- diversité **génétique** (au sein d'une même espèce).
Une forte biodiversité rend l'écosystème plus **stable** et plus **résilient** face aux perturbations.

## 3. Les interactions entre êtres vivants
Les organismes interagissent de multiples façons :
- **prédation** (l'un mange l'autre) ;
- **compétition** (pour l'eau, la lumière, la nourriture) ;
- **coopération / mutualisme** (les deux y gagnent, ex. pollinisation) ;
- **parasitisme** (l'un profite de l'autre à ses dépens).

## 4. Les services écosystémiques
Les écosystèmes rendent des **services** à l'humanité :
- services d'**approvisionnement** (nourriture, bois, eau) ;
- services de **régulation** (climat, pollinisation, épuration de l'eau) ;
- services **culturels** (loisirs, paysages).

## 5. Les agrosystèmes
Un **agrosystème** est un écosystème géré par l'humain pour produire (champ, élevage). Il exporte de la biomasse (récoltes), il faut donc lui **apporter** de l'énergie et des **engrais**. Cette intensification peut réduire la **biodiversité** et polluer les milieux, d'où l'intérêt de pratiques plus durables.

## L'essentiel à retenir
- Un **écosystème** = êtres vivants (biocénose) + milieu (biotope) reliés par des échanges.
- La **biodiversité** a trois niveaux : écosystèmes, espèces, gènes.
- Interactions : prédation, compétition, mutualisme, parasitisme.
- Les écosystèmes rendent des **services** ; les **agrosystèmes** doivent être gérés durablement.$md$),

    ('Variation génétique et santé', $md$# Variation génétique et santé

## Ce que tu vas comprendre
L'ADN peut être modifié : ces changements, les **mutations**, sont la source de la diversité du vivant, mais aussi de certaines maladies. Ce chapitre relie variation génétique et **santé**.

## 1. Les mutations
Une **mutation** est une modification de la **séquence de l'ADN**. Elle peut être spontanée (erreur lors de la copie de l'ADN) ou provoquée par des **agents mutagènes** (UV, tabac, certaines substances chimiques).

Une mutation peut être :
- **neutre** (sans effet) ;
- **favorable** (avantage pour l'organisme) ;
- **défavorable** (à l'origine d'une maladie).

## 2. Mutations et transmission
- Une mutation dans une cellule de l'**organisme** (cellule somatique) n'est **pas transmise** à la descendance ; elle peut favoriser un **cancer**.
- Une mutation dans une **cellule reproductrice** (gamète) est **transmise aux enfants** et devient héréditaire.

## 3. Les maladies génétiques
Une **maladie génétique** est due à un ou plusieurs gènes défectueux.

*Exemple : la mucoviscidose ou la drépanocytose résultent de la mutation d'un seul gène.*
Le **patrimoine génétique** hérité des parents explique une part de la santé, mais l'**environnement** (alimentation, mode de vie) joue aussi.

## 4. La résistance aux antibiotiques
Chez les bactéries, des mutations peuvent rendre certaines cellules **résistantes** à un **antibiotique**. Quand on utilise l'antibiotique, seules les bactéries résistantes survivent et se multiplient : c'est une **sélection**. L'usage excessif des antibiotiques accélère l'apparition de bactéries résistantes, un enjeu majeur de **santé publique**.

## 5. Diversité et évolution
En créant de nouveaux **allèles**, les mutations sont la source de la **variabilité** génétique. Cette variabilité est la matière première de l'**évolution** : sur laquelle agit la sélection naturelle.

## L'essentiel à retenir
- Une **mutation** modifie la séquence d'ADN ; elle peut être neutre, favorable ou défavorable.
- Mutation dans un **gamète** = héréditaire ; dans une cellule somatique = non transmise (peut mener au cancer).
- Les **maladies génétiques** viennent de gènes défectueux ; l'environnement compte aussi.
- L'usage des **antibiotiques sélectionne** les bactéries résistantes : enjeu de santé publique.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'svt'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Expression du patrimoine génétique', $json${
      "centre": "Expression du patrimoine génétique",
      "branches": [
        { "titre": "Du gène à la protéine", "enfants": ["Gène = portion d'ADN", "Code une protéine", "Protéines → phénotype"] },
        { "titre": "Transcription", "enfants": ["Dans le noyau", "ADN → ARNm (simple brin)", "U remplace T"] },
        { "titre": "Traduction", "enfants": ["Dans le cytoplasme", "Ribosome lit les codons", "Chaîne d'acides aminés"] },
        { "titre": "Code génétique", "enfants": ["Codon = 3 nucléotides", "Universel et redondant", "Codons start / stop"] }
      ]
    }$json$),
    ('La dynamique interne de la Terre', $json${
      "centre": "Dynamique interne de la Terre",
      "branches": [
        { "titre": "Structure", "enfants": ["Croûte, manteau, noyau", "Lithosphère rigide", "Asthénosphère ductile"] },
        { "titre": "Plaques", "enfants": ["Une douzaine de plaques", "Quelques cm par an", "Séismes et volcans aux frontières"] },
        { "titre": "Dorsales", "enfants": ["Divergence", "Accrétion de lithosphère", "Croûte plus vieille au loin"] },
        { "titre": "Subduction et moteur", "enfants": ["Plaque dense plonge", "Volcanisme explosif", "Flux de chaleur, convection"] }
      ]
    }$json$),
    ('Écosystèmes et services', $json${
      "centre": "Écosystèmes et services",
      "branches": [
        { "titre": "Écosystème", "enfants": ["Biocénose (vivants)", "Biotope (milieu)", "Échanges matière et énergie"] },
        { "titre": "Biodiversité", "enfants": ["Écosystèmes", "Espèces", "Gènes"] },
        { "titre": "Interactions", "enfants": ["Prédation, compétition", "Mutualisme (pollinisation)", "Parasitisme"] },
        { "titre": "Services et agrosystèmes", "enfants": ["Approvisionnement, régulation", "Services culturels", "Agrosystèmes à gérer durablement"] }
      ]
    }$json$),
    ('Variation génétique et santé', $json${
      "centre": "Variation génétique et santé",
      "branches": [
        { "titre": "Mutations", "enfants": ["Modif de la séquence d'ADN", "Spontanée ou agent mutagène", "Neutre, favorable, défavorable"] },
        { "titre": "Transmission", "enfants": ["Gamète → héréditaire", "Cellule somatique → non transmise", "Peut mener au cancer"] },
        { "titre": "Maladies génétiques", "enfants": ["Gènes défectueux", "Mucoviscidose, drépanocytose", "Rôle de l'environnement"] },
        { "titre": "Résistance et évolution", "enfants": ["Antibiotiques sélectionnent", "Bactéries résistantes", "Nouveaux allèles → évolution"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'svt'
 WHERE c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal la migration de structure a déjà créé les quiz ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'SVT', '1re', v.chapter, true, l.id
FROM (VALUES
  ('13319999-0000-4000-8000-000000000001'::uuid, 'Expression du patrimoine génétique'),
  ('13319999-0000-4000-8000-000000000002'::uuid, 'La dynamique interne de la Terre'),
  ('13319999-0000-4000-8000-000000000003'::uuid, 'Écosystèmes et services'),
  ('13319999-0000-4000-8000-000000000004'::uuid, 'Variation génétique et santé')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'svt'
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
  -- Chapitre 1 — Expression du patrimoine génétique
  ('13310000-0000-4000-8000-000000000104'::uuid, 'Expression du patrimoine génétique',
   'Dans quel ordre l''information génétique est-elle exprimée ?', 'mcq',
   '["ADN → ARN → protéine", "Protéine → ARN → ADN", "ARN → ADN → protéine", "ADN → protéine → ARN"]', 0,
   'L''ADN est transcrit en ARN, puis l''ARN est traduit en protéine.', 4),
  ('13310000-0000-4000-8000-000000000105'::uuid, 'Expression du patrimoine génétique',
   'Où se déroule la transcription chez une cellule eucaryote ?', 'mcq',
   '["Dans le noyau", "Dans le cytoplasme", "Dans la membrane", "Dans le ribosome"]', 0,
   'La transcription (ADN → ARNm) a lieu dans le noyau ; l''ARNm sort ensuite vers le cytoplasme.', 5),
  ('13310000-0000-4000-8000-000000000106'::uuid, 'Expression du patrimoine génétique',
   'Dans l''ARN, quelle base remplace la thymine (T) de l''ADN ?', 'mcq',
   '["L''uracile (U)", "La cytosine (C)", "La guanine (G)", "L''adénine (A)"]', 0,
   'L''ARN contient de l''uracile (U) à la place de la thymine.', 6),
  ('13310000-0000-4000-8000-000000000107'::uuid, 'Expression du patrimoine génétique',
   'Le ribosome lit l''ARN messager par groupes de trois nucléotides appelés codons.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un codon = 3 nucléotides ; le ribosome lit l''ARNm codon par codon pour assembler les acides aminés.', 7),
  ('13310000-0000-4000-8000-000000000108'::uuid, 'Expression du patrimoine génétique',
   'Que produit la traduction ?', 'mcq',
   '["Une chaîne d''acides aminés (protéine)", "Une molécule d''ADN", "Un ARN messager", "Un nucléotide"]', 0,
   'La traduction assemble des acides aminés en une protéine.', 8),
  ('13310000-0000-4000-8000-000000000109'::uuid, 'Expression du patrimoine génétique',
   'Le code génétique est quasiment universel : il est le même pour presque tous les êtres vivants.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le code génétique est universel, ce qui en fait un argument fort de la parenté du vivant.', 9),
  ('13310000-0000-4000-8000-000000000110'::uuid, 'Expression du patrimoine génétique',
   'Qu''est-ce qu''un gène ?', 'mcq',
   '["Une portion d''ADN codant une protéine", "Une protéine", "Un ribosome", "Un chromosome entier"]', 0,
   'Un gène est une portion d''ADN qui porte l''information pour fabriquer une protéine.', 10),

  -- Chapitre 2 — La dynamique interne de la Terre
  ('13310000-0000-4000-8000-000000000204'::uuid, 'La dynamique interne de la Terre',
   'La couche rigide de surface découpée en plaques s''appelle : ', 'mcq',
   '["La lithosphère", "L''asthénosphère", "Le noyau", "Le manteau inférieur"]', 0,
   'La lithosphère est la couche rigide de surface ; elle repose sur l''asthénosphère plus ductile.', 4),
  ('13310000-0000-4000-8000-000000000205'::uuid, 'La dynamique interne de la Terre',
   'À quelle vitesse se déplacent les plaques lithosphériques ?', 'mcq',
   '["Quelques centimètres par an", "Quelques mètres par an", "Quelques kilomètres par an", "Elles sont immobiles"]', 0,
   'Les plaques se déplacent de quelques centimètres par an, à la vitesse de croissance d''un ongle.', 5),
  ('13310000-0000-4000-8000-000000000206'::uuid, 'La dynamique interne de la Terre',
   'Au niveau d''une dorsale océanique, les deux plaques : ', 'mcq',
   '["S''écartent (divergence)", "Se rapprochent", "Restent fixes", "Se superposent sans bouger"]', 0,
   'Aux dorsales, les plaques divergent et de la nouvelle lithosphère océanique se forme (accrétion).', 6),
  ('13310000-0000-4000-8000-000000000207'::uuid, 'La dynamique interne de la Terre',
   'En zone de subduction, c''est la plaque océanique, plus dense, qui plonge sous l''autre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'En subduction, la plaque océanique dense plonge sous l''autre, provoquant séismes et volcanisme.', 7),
  ('13310000-0000-4000-8000-000000000208'::uuid, 'La dynamique interne de la Terre',
   'La croûte océanique est d''autant plus ancienne qu''elle est : ', 'mcq',
   '["Loin de la dorsale", "Proche de la dorsale", "En surface", "Épaisse"]', 0,
   'La lithosphère se forme à la dorsale : plus on s''en éloigne, plus la croûte est ancienne.', 8),
  ('13310000-0000-4000-8000-000000000209'::uuid, 'La dynamique interne de la Terre',
   'Quelle est la principale source de chaleur interne qui alimente le moteur des plaques ?', 'mcq',
   '["La radioactivité des roches", "Le rayonnement du Soleil", "Les marées", "La foudre"]', 0,
   'La chaleur interne vient surtout de la radioactivité des roches ; elle crée la convection du manteau.', 9),
  ('13310000-0000-4000-8000-000000000210'::uuid, 'La dynamique interne de la Terre',
   'Les séismes et les volcans sont répartis au hasard sur toute la surface du globe.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : ils se concentrent aux frontières de plaques, ce qui a permis de les identifier.', 10),

  -- Chapitre 3 — Écosystèmes et services
  ('13310000-0000-4000-8000-000000000304'::uuid, 'Écosystèmes et services',
   'Un écosystème est constitué : ', 'mcq',
   '["D''êtres vivants et de leur milieu", "Uniquement d''animaux", "Uniquement du sol", "D''une seule espèce"]', 0,
   'Un écosystème associe une communauté d''êtres vivants (biocénose) et son milieu (biotope).', 4),
  ('13310000-0000-4000-8000-000000000305'::uuid, 'Écosystèmes et services',
   'La biodiversité se mesure à trois niveaux : écosystèmes, espèces et gènes.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La biodiversité comprend la diversité des écosystèmes, des espèces et la diversité génétique.', 5),
  ('13310000-0000-4000-8000-000000000306'::uuid, 'Écosystèmes et services',
   'Quelle interaction correspond à la pollinisation où les deux partenaires y gagnent ?', 'mcq',
   '["Le mutualisme", "La prédation", "La compétition", "Le parasitisme"]', 0,
   'La pollinisation est un mutualisme : la plante est fécondée, l''insecte se nourrit.', 6),
  ('13310000-0000-4000-8000-000000000307'::uuid, 'Écosystèmes et services',
   'La pollinisation par les insectes est un exemple de service : ', 'mcq',
   '["De régulation", "D''approvisionnement en bois", "Culturel", "Sans intérêt"]', 0,
   'La pollinisation est un service de régulation rendu par les écosystèmes.', 7),
  ('13310000-0000-4000-8000-000000000308'::uuid, 'Écosystèmes et services',
   'Un agrosystème est un écosystème géré par l''humain pour produire.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un agrosystème (champ, élevage) est géré par l''humain ; il exporte de la biomasse et nécessite des apports.', 8),
  ('13310000-0000-4000-8000-000000000309'::uuid, 'Écosystèmes et services',
   'Une forte biodiversité rend généralement un écosystème : ', 'mcq',
   '["Plus stable et résilient", "Plus fragile", "Sans changement", "Incapable de fonctionner"]', 0,
   'Une forte biodiversité augmente la stabilité et la résilience face aux perturbations.', 9),
  ('13310000-0000-4000-8000-000000000310'::uuid, 'Écosystèmes et services',
   'Comment appelle-t-on l''interaction où un organisme en mange un autre ?', 'mcq',
   '["La prédation", "Le mutualisme", "La compétition", "L''accrétion"]', 0,
   'La prédation est l''interaction où un organisme (le prédateur) se nourrit d''un autre (la proie).', 10),

  -- Chapitre 4 — Variation génétique et santé
  ('13310000-0000-4000-8000-000000000404'::uuid, 'Variation génétique et santé',
   'Qu''est-ce qu''une mutation ?', 'mcq',
   '["Une modification de la séquence d''ADN", "Une protéine mal repliée", "Un ribosome cassé", "Une cellule en division"]', 0,
   'Une mutation est une modification de la séquence de l''ADN.', 4),
  ('13310000-0000-4000-8000-000000000405'::uuid, 'Variation génétique et santé',
   'Toutes les mutations sont forcément défavorables à l''organisme.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : une mutation peut être neutre, favorable ou défavorable.', 5),
  ('13310000-0000-4000-8000-000000000406'::uuid, 'Variation génétique et santé',
   'Une mutation transmise à la descendance touche : ', 'mcq',
   '["Une cellule reproductrice (gamète)", "Une cellule de la peau", "Un globule rouge", "Un ribosome"]', 0,
   'Seule une mutation dans un gamète est héréditaire ; une mutation somatique n''est pas transmise.', 6),
  ('13310000-0000-4000-8000-000000000407'::uuid, 'Variation génétique et santé',
   'Lequel de ces facteurs est un agent mutagène ?', 'mcq',
   '["Les rayons UV", "L''eau pure", "Le sommeil", "La lumière rouge"]', 0,
   'Les UV, le tabac ou certaines substances chimiques sont des agents mutagènes.', 7),
  ('13310000-0000-4000-8000-000000000408'::uuid, 'Variation génétique et santé',
   'L''usage excessif des antibiotiques favorise l''apparition de bactéries résistantes.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''antibiotique sélectionne les bactéries résistantes, qui survivent et se multiplient : c''est un enjeu de santé publique.', 8),
  ('13310000-0000-4000-8000-000000000409'::uuid, 'Variation génétique et santé',
   'Une maladie comme la mucoviscidose est due à : ', 'mcq',
   '["La mutation d''un gène", "Une carence en vitamines", "Un virus attrapé enfant", "Un excès de sommeil"]', 0,
   'La mucoviscidose est une maladie génétique due à la mutation d''un gène.', 9),
  ('13310000-0000-4000-8000-000000000410'::uuid, 'Variation génétique et santé',
   'En créant de nouveaux allèles, les mutations sont la source de la variabilité génétique.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les mutations créent de nouveaux allèles : c''est la matière première de l''évolution.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'svt'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
