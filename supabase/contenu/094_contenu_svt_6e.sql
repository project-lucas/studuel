-- =============================================================================
-- Studuel — Migration 094 : CONTENU SVT 6e (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de SVT 6e (programme cycle 3, Éduscol) :
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
    ('Le vivant et sa diversité', $md$# Le vivant et sa diversité

## Ce que tu vas comprendre
Autour de nous, il y a des êtres **vivants** (une plante, un chat, une bactérie) et des objets **non vivants** (un caillou, l'eau, une voiture). Ce chapitre t'apprend à reconnaître le vivant, à voir de quoi il est fait, et à **classer** les êtres vivants selon ce qu'ils ont en commun.

## 1. Reconnaître un être vivant
Un être vivant **naît, se nourrit, grandit, se reproduit et meurt**. Il **respire** et échange avec son milieu. Un objet non vivant ne fait rien de tout cela.

*Exemple : un arbre grandit chaque année et fabrique des graines : il est vivant. Un rocher ne grandit pas et ne se reproduit pas : il est non vivant.*

## 2. La cellule, unité du vivant
Tous les êtres vivants sont formés de **cellules**, de toutes petites « briques » qu'on ne voit qu'au **microscope**.
- Certains êtres vivants sont formés d'**une seule cellule** (une bactérie, une paramécie) : on les dit **unicellulaires**.
- D'autres sont formés de **milliards de cellules** (l'être humain, un chêne) : on les dit **pluricellulaires**.

*Schéma décrit : une cellule ressemble à un petit sac. On y voit une **membrane** (l'enveloppe), le **cytoplasme** (l'intérieur gélatineux) et souvent un **noyau** (le centre de commande).*

## 3. La biodiversité
La **biodiversité**, c'est la **variété des êtres vivants** sur Terre : animaux, végétaux, champignons, micro-organismes. Dans un même milieu (une mare, une forêt), on trouve de très nombreuses **espèces** différentes.

## 4. Espèces et classification
Une **espèce** regroupe des êtres vivants qui **se ressemblent** et peuvent **se reproduire entre eux**.
Pour classer les êtres vivants, les scientifiques regardent les **caractères** qu'ils possèdent (des poils, des plumes, une colonne vertébrale…). On regroupe **ceux qui partagent les mêmes caractères**.

*Exemple : le chat, le chien et l'humain ont tous des poils et une colonne vertébrale : ce sont des **vertébrés** de la famille des **mammifères**.*

## L'essentiel à retenir
- Un être vivant **naît, se nourrit, grandit, se reproduit et meurt** ; un objet non vivant, non.
- Tous les êtres vivants sont faits de **cellules** (unicellulaires ou pluricellulaires).
- La **biodiversité** est la variété des êtres vivants ; une **espèce** regroupe des individus qui se ressemblent et se reproduisent entre eux.
- On **classe** les êtres vivants en regroupant ceux qui **partagent les mêmes caractères**.$md$),

    ('Le développement des êtres vivants', $md$# Le développement des êtres vivants

## Ce que tu vas comprendre
Un être vivant ne reste pas identique toute sa vie : il **se développe**, c'est-à-dire qu'il change de taille et parfois de forme depuis sa naissance jusqu'à l'âge adulte. Ce chapitre compare les façons de naître et de grandir chez les animaux et les végétaux.

## 1. Naître de deux façons
- Les animaux **vivipares** naissent directement du ventre de leur mère (le chat, l'humain, le dauphin).
- Les animaux **ovipares** naissent d'un **œuf** pondu par la femelle (la poule, la grenouille, le papillon).

*Exemple : une poule pond des œufs (ovipare) ; une chatte met bas des chatons (vivipare).*

## 2. La croissance
La **croissance** est l'**augmentation de taille** d'un être vivant au cours du temps. Chez l'humain, on grandit vite dans l'enfance, puis la taille se stabilise à l'âge adulte. On peut suivre cette croissance sur une **courbe de croissance** (taille ou masse en fonction de l'âge).

## 3. Le développement direct
Dans un **développement direct**, le jeune ressemble déjà à l'adulte en **plus petit** ; il ne fait que grandir.

*Exemple : un chaton ressemble à un chat adulte en miniature ; un jeune plant de tournesol ressemble déjà au tournesol.*

## 4. La métamorphose
Dans une **métamorphose**, le jeune ne ressemble **pas du tout** à l'adulte ; sa forme change complètement au cours du développement.

*Exemple : la grenouille commence sa vie sous forme de **têtard** (avec une queue, vivant dans l'eau) avant de devenir une grenouille à quatre pattes. Le papillon passe par les étapes **œuf → chenille → chrysalide → papillon**.*

## 5. Le développement des plantes
Une plante à fleurs se développe à partir d'une **graine** : la graine **germe**, une jeune plantule apparaît, puis la plante grandit, fleurit et produit de nouvelles graines. C'est un **cycle de vie**.

## L'essentiel à retenir
- On naît **vivipare** (du ventre de la mère) ou **ovipare** (d'un œuf).
- La **croissance** est l'augmentation de taille au cours du temps.
- **Développement direct** : le jeune ressemble à l'adulte en petit ; **métamorphose** : la forme change complètement (têtard → grenouille, chenille → papillon).
- Une plante se développe à partir d'une **graine** qui **germe** : c'est un cycle de vie.$md$),

    ('Les besoins des plantes vertes', $md$# Les besoins des plantes vertes

## Ce que tu vas comprendre
Une plante verte ne mange pas comme un animal : elle **fabrique elle-même** sa matière. Ce chapitre t'apprend de quoi une plante a besoin pour vivre et grandir, et pourquoi les plantes sont à la base de la vie sur Terre.

## 1. Ce dont une plante a besoin
Pour vivre et grandir, une plante verte a besoin de plusieurs éléments :
- de l'**eau** (puisée par les **racines**) ;
- de la **lumière** (captée par les **feuilles**) ;
- des **sels minéraux** présents dans le sol (puisés avec l'eau par les racines) ;
- du **dioxyde de carbone** (CO2) présent dans l'air.

*Expérience décrite : si l'on prive une plante de lumière, ses feuilles jaunissent et elle finit par mourir. Si on la prive d'eau, elle se fane. On en déduit que lumière et eau sont indispensables.*

## 2. Où la plante trouve ce qu'il lui faut
- Les **racines** puisent l'**eau** et les **sels minéraux** dans le sol.
- Les **feuilles** captent la **lumière** et absorbent le **dioxyde de carbone** de l'air.

## 3. La photosynthèse (expliquée simplement)
Grâce à la lumière, la plante verte fabrique sa propre matière (des **sucres**) à partir de l'**eau** et du **dioxyde de carbone**. Cette fabrication s'appelle la **photosynthèse**. En même temps, la plante rejette du **dioxygène** (le gaz que nous respirons).

> **À retenir :** on dit que la plante verte est un **producteur** : elle produit sa matière **elle-même**, contrairement aux animaux qui doivent manger.

## 4. Pourquoi c'est essentiel
Comme les plantes fabriquent de la matière, elles servent de **nourriture** à de nombreux animaux. Elles sont donc à la **base de la vie** : sans plantes, les animaux herbivores n'auraient rien à manger.

## L'essentiel à retenir
- Une plante verte a besoin d'**eau**, de **lumière**, de **sels minéraux** et de **dioxyde de carbone**.
- Les **racines** puisent l'eau et les sels minéraux ; les **feuilles** captent la lumière et le CO2.
- La **photosynthèse** : grâce à la lumière, la plante fabrique sa matière et rejette du **dioxygène**.
- La plante est un **producteur** ; elle est à la **base des chaînes alimentaires**.$md$),

    ('L''origine de nos aliments', $md$# L'origine de nos aliments

## Ce que tu vas comprendre
Tout ce que nous mangeons vient, au départ, d'un **être vivant**. Ce chapitre t'apprend à retrouver l'**origine** des aliments (végétale ou animale), à comprendre comment on les **transforme**, et à replacer l'être humain dans les **chaînes alimentaires**.

## 1. Origine végétale ou animale
Un aliment a soit une **origine végétale** (il vient d'une plante), soit une **origine animale** (il vient d'un animal).
- Origine **végétale** : le pain (blé), les pâtes, une pomme, l'huile d'olive, le chocolat (cacao).
- Origine **animale** : la viande, le poisson, les œufs, le lait, le fromage, le miel.

*Exemple : le steak vient du bœuf (origine animale) ; la frite vient de la pomme de terre (origine végétale).*

## 2. Des produits bruts aux produits transformés
Certains aliments sont **bruts** (une carotte, une pomme) : on les mange presque tels quels. D'autres sont **transformés** à partir d'une matière première :
- le **pain** est fabriqué à partir de la **farine**, elle-même issue du **blé** ;
- le **fromage** et le **yaourt** sont fabriqués à partir du **lait** ;
- le **jus** est pressé à partir de **fruits**.

## 3. Le rôle des micro-organismes
Certaines transformations utilisent des **micro-organismes** (des êtres vivants microscopiques) :
- la **levure** fait **lever** le pain ;
- des **bactéries** transforment le lait en **yaourt** ;
- des micro-organismes interviennent dans la fabrication du **fromage**.

## 4. Les chaînes alimentaires
Dans la nature, les êtres vivants **mangent les uns les autres** : c'est une **chaîne alimentaire**. Elle commence toujours par un **végétal** (le producteur).

*Exemple de chaîne : herbe → sauterelle → grenouille → héron. La flèche « → » se lit « **est mangé par** ».*

L'être humain fait partie de ces réseaux alimentaires : il mange à la fois des végétaux et des animaux.

## L'essentiel à retenir
- Chaque aliment a une **origine végétale** ou **animale**.
- Un aliment peut être **brut** ou **transformé** (blé → farine → pain ; lait → yaourt).
- Des **micro-organismes** (levure, bactéries) servent à fabriquer pain, yaourt, fromage.
- Une **chaîne alimentaire** commence par un végétal ; la flèche « → » signifie « **est mangé par** ».$md$),

    ('La Terre dans le système solaire', $md$# La Terre dans le système solaire

## Ce que tu vas comprendre
La Terre est une **planète** qui tourne dans l'espace autour d'une étoile, le **Soleil**. Ce chapitre t'apprend à situer la Terre dans le **système solaire** et à comprendre deux mouvements qui rythment notre vie : le **jour/nuit** et les **saisons**.

## 1. Le système solaire
Le **système solaire** est formé du **Soleil** (une **étoile**, une énorme boule de gaz qui produit sa propre lumière) et de **huit planètes** qui tournent autour de lui.
Dans l'ordre à partir du Soleil : **Mercure, Vénus, Terre, Mars, Jupiter, Saturne, Uranus, Neptune**.
- Les planètes ne produisent **pas** de lumière : elles sont **éclairées** par le Soleil.
- La Terre est la **3ᵉ planète** à partir du Soleil.

## 2. La Lune, satellite de la Terre
La **Lune** tourne autour de la **Terre** : c'est un **satellite** naturel. Elle ne produit pas de lumière non plus ; on la voit parce qu'elle **reflète** la lumière du Soleil.

## 3. La rotation : le jour et la nuit
La Terre **tourne sur elle-même** : c'est la **rotation**. Un tour complet dure **24 heures** (un jour).
- La face de la Terre tournée **vers** le Soleil est éclairée : c'est le **jour**.
- La face **opposée** est dans l'ombre : c'est la **nuit**.

*C'est parce que la Terre tourne que le Soleil semble se lever à l'est et se coucher à l'ouest.*

## 4. La révolution et les saisons
La Terre **tourne autour du Soleil** : c'est la **révolution**. Un tour complet dure **un an** (365 jours).
Comme l'**axe** de la Terre est **incliné**, le Soleil ne chauffe pas de la même façon toute l'année : cela crée les **saisons** (printemps, été, automne, hiver). En été, les journées sont **plus longues** et le Soleil est **plus haut** dans le ciel ; en hiver, c'est l'inverse.

## L'essentiel à retenir
- Le **système solaire** = le **Soleil** (une étoile) et **8 planètes** ; la Terre est la **3ᵉ**.
- Les planètes et la **Lune** ne produisent pas de lumière : elles sont **éclairées** par le Soleil.
- La **rotation** (24 h, sur elle-même) explique le **jour et la nuit**.
- La **révolution** (1 an, autour du Soleil) et l'**inclinaison de l'axe** expliquent les **saisons**.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'svt'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '6e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Le vivant et sa diversité', $json${
      "centre": "Le vivant et sa diversité",
      "branches": [
        { "titre": "Reconnaître le vivant", "enfants": ["Naît, se nourrit, grandit", "Se reproduit, meurt", "Objet non vivant : rien de tout ça"] },
        { "titre": "La cellule", "enfants": ["Brique du vivant (microscope)", "Unicellulaire : 1 cellule", "Pluricellulaire : milliards"] },
        { "titre": "Biodiversité", "enfants": ["Variété des êtres vivants", "Animaux, végétaux, champignons", "Micro-organismes"] },
        { "titre": "Espèces et classement", "enfants": ["Espèce : se ressemblent et se reproduisent", "On regarde les caractères", "Regrouper les mêmes caractères"] }
      ]
    }$json$),
    ('Le développement des êtres vivants', $json${
      "centre": "Le développement des êtres vivants",
      "branches": [
        { "titre": "Naître", "enfants": ["Vivipare : du ventre de la mère", "Ovipare : d'un œuf", "Poule (œuf) / chat (petit)"] },
        { "titre": "Croissance", "enfants": ["Augmentation de taille", "Rapide dans l'enfance", "Courbe de croissance"] },
        { "titre": "Développement direct", "enfants": ["Jeune = adulte en petit", "Il ne fait que grandir", "Chaton → chat"] },
        { "titre": "Métamorphose", "enfants": ["La forme change complètement", "Têtard → grenouille", "Chenille → papillon"] }
      ]
    }$json$),
    ('Les besoins des plantes vertes', $json${
      "centre": "Les besoins des plantes vertes",
      "branches": [
        { "titre": "Ses besoins", "enfants": ["Eau et sels minéraux", "Lumière", "Dioxyde de carbone (CO2)"] },
        { "titre": "Où les trouver", "enfants": ["Racines : eau + sels minéraux", "Feuilles : lumière", "Feuilles : CO2 de l'air"] },
        { "titre": "Photosynthèse", "enfants": ["Fabrique sa matière (sucres)", "Grâce à la lumière", "Rejette du dioxygène"] },
        { "titre": "Rôle essentiel", "enfants": ["La plante est un producteur", "Nourrit les animaux", "Base des chaînes alimentaires"] }
      ]
    }$json$),
    ('L''origine de nos aliments', $json${
      "centre": "L'origine de nos aliments",
      "branches": [
        { "titre": "Origine", "enfants": ["Végétale : pain, pomme", "Animale : viande, lait, œuf", "Toujours un être vivant au départ"] },
        { "titre": "Transformation", "enfants": ["Brut : carotte, pomme", "Blé → farine → pain", "Lait → yaourt, fromage"] },
        { "titre": "Micro-organismes", "enfants": ["Levure : fait lever le pain", "Bactéries : lait → yaourt", "Fabrication du fromage"] },
        { "titre": "Chaînes alimentaires", "enfants": ["Commence par un végétal", "→ = est mangé par", "Herbe → sauterelle → grenouille"] }
      ]
    }$json$),
    ('La Terre dans le système solaire', $json${
      "centre": "La Terre dans le système solaire",
      "branches": [
        { "titre": "Système solaire", "enfants": ["Soleil = étoile", "8 planètes autour", "Terre = 3ᵉ planète"] },
        { "titre": "Lumière", "enfants": ["Planètes non lumineuses", "Éclairées par le Soleil", "Lune reflète la lumière"] },
        { "titre": "Rotation", "enfants": ["Sur elle-même en 24 h", "Face au Soleil : jour", "Face opposée : nuit"] },
        { "titre": "Révolution et saisons", "enfants": ["Autour du Soleil en 1 an", "Axe incliné", "→ les 4 saisons"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'svt'
 WHERE c.subject_id = s.id AND c.level = '6e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal 030/033-036 ont déjà créé les quiz 6e ; ce bloc ne fait
--     rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'SVT', '6e', v.chapter, true, l.id
FROM (VALUES
  ('09419999-0000-4000-8000-000000000001'::uuid, 'Le vivant et sa diversité'),
  ('09419999-0000-4000-8000-000000000002'::uuid, 'Le développement des êtres vivants'),
  ('09419999-0000-4000-8000-000000000003'::uuid, 'Les besoins des plantes vertes'),
  ('09419999-0000-4000-8000-000000000004'::uuid, 'L''origine de nos aliments'),
  ('09419999-0000-4000-8000-000000000005'::uuid, 'La Terre dans le système solaire')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'svt'
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
  -- Chapitre 1 — Le vivant et sa diversité
  ('09410000-0000-4000-8000-000000000104'::uuid, 'Le vivant et sa diversité',
   'Parmi ces éléments, lequel est un être vivant ?', 'mcq',
   '["Un champignon", "Un caillou", "Une goutte d''eau", "Une voiture"]', 0,
   'Un champignon naît, se nourrit, grandit et se reproduit : il est vivant. Le caillou, l''eau et la voiture ne le sont pas.', 4),
  ('09410000-0000-4000-8000-000000000105'::uuid, 'Le vivant et sa diversité',
   'Tous les êtres vivants sont formés de : ', 'mcq',
   '["Cellules", "Cristaux", "Métaux", "Grains de sable"]', 0,
   'La cellule est la « brique » de base de tous les êtres vivants ; on l''observe au microscope.', 5),
  ('09410000-0000-4000-8000-000000000106'::uuid, 'Le vivant et sa diversité',
   'Un être vivant formé d''une seule cellule est dit : ', 'mcq',
   '["Unicellulaire", "Pluricellulaire", "Minéral", "Fossile"]', 0,
   'Un seul = unicellulaire (ex. une bactérie) ; plusieurs = pluricellulaire (ex. l''humain).', 6),
  ('09410000-0000-4000-8000-000000000107'::uuid, 'Le vivant et sa diversité',
   'La biodiversité désigne la variété des êtres vivants sur Terre.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La biodiversité, c''est bien la diversité des espèces et des milieux de vie.', 7),
  ('09410000-0000-4000-8000-000000000108'::uuid, 'Le vivant et sa diversité',
   'Qu''est-ce qu''une espèce ?', 'mcq',
   '["Des êtres qui se ressemblent et se reproduisent entre eux", "Tous les animaux d''une forêt", "Un être vivant tout seul", "Un objet non vivant"]', 0,
   'Une espèce regroupe des individus qui se ressemblent et peuvent se reproduire entre eux.', 8),
  ('09410000-0000-4000-8000-000000000109'::uuid, 'Le vivant et sa diversité',
   'Pour classer les êtres vivants, on regroupe ceux qui : ', 'mcq',
   '["Partagent les mêmes caractères", "Vivent au même endroit", "Ont la même couleur", "Ont le même nom"]', 0,
   'On classe en regroupant les êtres qui possèdent les mêmes caractères (poils, plumes, colonne vertébrale…).', 9),
  ('09410000-0000-4000-8000-000000000110'::uuid, 'Le vivant et sa diversité',
   'On observe une cellule à l''œil nu, sans instrument.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : une cellule est minuscule, on l''observe au microscope.', 10),

  -- Chapitre 2 — Le développement des êtres vivants
  ('09410000-0000-4000-8000-000000000204'::uuid, 'Le développement des êtres vivants',
   'Un animal qui naît d''un œuf est dit : ', 'mcq',
   '["Ovipare", "Vivipare", "Herbivore", "Carnivore"]', 0,
   'Ovipare = naît d''un œuf (poule, grenouille) ; vivipare = naît du ventre de la mère.', 4),
  ('09410000-0000-4000-8000-000000000205'::uuid, 'Le développement des êtres vivants',
   'Le chat est un animal vivipare.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la chatte met bas des chatons directement, sans pondre d''œufs.', 5),
  ('09410000-0000-4000-8000-000000000206'::uuid, 'Le développement des êtres vivants',
   'Le passage du têtard à la grenouille est un exemple de : ', 'mcq',
   '["Métamorphose", "Développement direct", "Photosynthèse", "Reproduction"]', 0,
   'La forme change complètement (têtard dans l''eau → grenouille) : c''est une métamorphose.', 6),
  ('09410000-0000-4000-8000-000000000207'::uuid, 'Le développement des êtres vivants',
   'Quelle est la bonne suite du développement du papillon ?', 'mcq',
   '["Œuf → chenille → chrysalide → papillon", "Œuf → papillon → chenille", "Chenille → œuf → papillon", "Papillon → têtard → chenille"]', 0,
   'L''ordre correct est : œuf, chenille, chrysalide, puis papillon adulte.', 7),
  ('09410000-0000-4000-8000-000000000208'::uuid, 'Le développement des êtres vivants',
   'Dans un développement direct, le jeune ressemble à l''adulte en plus petit.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : ex. un chaton ressemble déjà à un chat adulte, il ne fait que grandir.', 8),
  ('09410000-0000-4000-8000-000000000209'::uuid, 'Le développement des êtres vivants',
   'La croissance d''un être vivant, c''est : ', 'mcq',
   '["Son augmentation de taille au cours du temps", "Sa reproduction", "Sa respiration", "Sa couleur"]', 0,
   'La croissance est l''augmentation de taille (ou de masse) au fil du temps.', 9),
  ('09410000-0000-4000-8000-000000000210'::uuid, 'Le développement des êtres vivants',
   'Une plante à fleurs se développe à partir d''une graine qui germe.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la graine germe, une plantule apparaît, puis la plante grandit et fleurit.', 10),

  -- Chapitre 3 — Les besoins des plantes vertes
  ('09410000-0000-4000-8000-000000000304'::uuid, 'Les besoins des plantes vertes',
   'De quoi une plante verte a-t-elle besoin pour vivre ?', 'mcq',
   '["Eau, lumière, sels minéraux et CO2", "Uniquement de la viande", "Seulement de l''obscurité", "De sable et de plastique"]', 0,
   'Une plante verte a besoin d''eau, de lumière, de sels minéraux et de dioxyde de carbone.', 4),
  ('09410000-0000-4000-8000-000000000305'::uuid, 'Les besoins des plantes vertes',
   'Quelle partie de la plante puise l''eau dans le sol ?', 'mcq',
   '["Les racines", "Les feuilles", "Les fleurs", "Les fruits"]', 0,
   'Les racines puisent l''eau et les sels minéraux dans le sol.', 5),
  ('09410000-0000-4000-8000-000000000306'::uuid, 'Les besoins des plantes vertes',
   'La fabrication de matière par la plante grâce à la lumière s''appelle : ', 'mcq',
   '["La photosynthèse", "La digestion", "La respiration", "La germination"]', 0,
   'La photosynthèse : grâce à la lumière, la plante fabrique sa matière à partir d''eau et de CO2.', 6),
  ('09410000-0000-4000-8000-000000000307'::uuid, 'Les besoins des plantes vertes',
   'Lors de la photosynthèse, la plante rejette du dioxygène.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la plante rejette du dioxygène, le gaz que nous respirons.', 7),
  ('09410000-0000-4000-8000-000000000308'::uuid, 'Les besoins des plantes vertes',
   'Que se passe-t-il si on prive une plante verte de lumière ?', 'mcq',
   '["Ses feuilles jaunissent et elle finit par mourir", "Elle grandit deux fois plus vite", "Elle devient un animal", "Rien du tout"]', 0,
   'Sans lumière, la plante ne peut plus fabriquer sa matière : ses feuilles jaunissent et elle meurt.', 8),
  ('09410000-0000-4000-8000-000000000309'::uuid, 'Les besoins des plantes vertes',
   'On dit que la plante verte est un « producteur » car : ', 'mcq',
   '["Elle fabrique elle-même sa matière", "Elle mange d''autres animaux", "Elle achète sa nourriture", "Elle ne se nourrit pas"]', 0,
   'La plante produit sa propre matière (contrairement aux animaux qui doivent manger) : c''est un producteur.', 9),
  ('09410000-0000-4000-8000-000000000310'::uuid, 'Les besoins des plantes vertes',
   'Les plantes vertes n''ont aucun rôle dans l''alimentation des animaux.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : les plantes sont à la base des chaînes alimentaires ; elles nourrissent les animaux herbivores.', 10),

  -- Chapitre 4 — L'origine de nos aliments
  ('09410000-0000-4000-8000-000000000404'::uuid, 'L''origine de nos aliments',
   'Quel aliment est d''origine animale ?', 'mcq',
   '["Le fromage", "Le pain", "La pomme", "L''huile d''olive"]', 0,
   'Le fromage vient du lait (animal). Pain, pomme et huile d''olive sont d''origine végétale.', 4),
  ('09410000-0000-4000-8000-000000000405'::uuid, 'L''origine de nos aliments',
   'Le pain est fabriqué à partir de : ', 'mcq',
   '["La farine issue du blé", "Du lait", "De la viande", "Du sable"]', 0,
   'Le pain est fait avec de la farine, obtenue en broyant les grains de blé.', 5),
  ('09410000-0000-4000-8000-000000000406'::uuid, 'L''origine de nos aliments',
   'Quel micro-organisme fait lever le pain ?', 'mcq',
   '["La levure", "Le têtard", "Le rocher", "Le sel"]', 0,
   'La levure est un micro-organisme qui fait gonfler (lever) la pâte à pain.', 6),
  ('09410000-0000-4000-8000-000000000407'::uuid, 'L''origine de nos aliments',
   'Le yaourt est fabriqué à partir de lait grâce à des bactéries.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : des bactéries transforment le lait en yaourt.', 7),
  ('09410000-0000-4000-8000-000000000408'::uuid, 'L''origine de nos aliments',
   'Dans une chaîne alimentaire, la flèche « → » signifie : ', 'mcq',
   '["Est mangé par", "Est plus grand que", "Se transforme en pierre", "Est égal à"]', 0,
   'La flèche « → » se lit « est mangé par » (ex. herbe → sauterelle).', 8),
  ('09410000-0000-4000-8000-000000000409'::uuid, 'L''origine de nos aliments',
   'Une chaîne alimentaire commence toujours par : ', 'mcq',
   '["Un végétal", "Un lion", "Un rocher", "Le Soleil qui mange"]', 0,
   'Une chaîne alimentaire débute par un végétal, le producteur.', 9),
  ('09410000-0000-4000-8000-000000000410'::uuid, 'L''origine de nos aliments',
   'La pomme de terre est un aliment d''origine végétale.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la pomme de terre est une plante, donc d''origine végétale.', 10),

  -- Chapitre 5 — La Terre dans le système solaire
  ('09410000-0000-4000-8000-000000000504'::uuid, 'La Terre dans le système solaire',
   'Au centre du système solaire se trouve : ', 'mcq',
   '["Le Soleil", "La Terre", "La Lune", "Mars"]', 0,
   'Le Soleil, une étoile, est au centre : les planètes tournent autour de lui.', 4),
  ('09410000-0000-4000-8000-000000000505'::uuid, 'La Terre dans le système solaire',
   'La Terre est la 3ᵉ planète à partir du Soleil.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : dans l''ordre, Mercure, Vénus, puis la Terre (3ᵉ).', 5),
  ('09410000-0000-4000-8000-000000000506'::uuid, 'La Terre dans le système solaire',
   'Qu''est-ce qui provoque l''alternance du jour et de la nuit ?', 'mcq',
   '["La rotation de la Terre sur elle-même", "La Lune qui s''éteint", "Les nuages", "Les saisons"]', 0,
   'La Terre tourne sur elle-même en 24 h : la face au Soleil est de jour, l''autre de nuit.', 6),
  ('09410000-0000-4000-8000-000000000507'::uuid, 'La Terre dans le système solaire',
   'Combien de temps dure un tour complet de la Terre sur elle-même ?', 'mcq',
   '["24 heures", "1 an", "1 mois", "1 heure"]', 0,
   'La rotation dure 24 heures, soit un jour.', 7),
  ('09410000-0000-4000-8000-000000000508'::uuid, 'La Terre dans le système solaire',
   'La Terre met un an à faire le tour du Soleil : c''est la révolution.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la révolution (tour du Soleil) dure environ 365 jours, soit un an.', 8),
  ('09410000-0000-4000-8000-000000000509'::uuid, 'La Terre dans le système solaire',
   'Pourquoi voit-on la Lune briller dans le ciel ?', 'mcq',
   '["Elle reflète la lumière du Soleil", "Elle produit sa propre lumière", "Elle est en feu", "Elle est éclairée par la Terre"]', 0,
   'La Lune ne produit pas de lumière : elle reflète celle du Soleil.', 9),
  ('09410000-0000-4000-8000-000000000510'::uuid, 'La Terre dans le système solaire',
   'Qu''est-ce qui explique l''existence des saisons ?', 'mcq',
   '["L''inclinaison de l''axe de la Terre", "La rotation en 24 h", "La lumière de la Lune", "Les marées"]', 0,
   'L''axe incliné fait que le Soleil chauffe différemment au cours de l''année : d''où les saisons.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'svt'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '6e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
