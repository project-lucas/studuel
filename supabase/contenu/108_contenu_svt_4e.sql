-- =============================================================================
-- Studuel — Migration 108 : CONTENU SVT 4e (cours + carte mentale + quiz)
-- Remplit les 4 chapitres de SVT 4e (programme cycle 4, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder)
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
-- PRÉREQUIS : subjects/chapters/lessons SVT 4e, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('L''activité interne du globe', $md$# L'activité interne du globe

## Ce que tu vas comprendre
La Terre n'est pas un caillou immobile : sa surface bouge, tremble et crache parfois de la lave. Ce chapitre explique **d'où vient cette énergie**, comment naissent les **séismes** et les **volcans**, et pourquoi tout cela est lié au mouvement des **plaques tectoniques**.

## 1. La structure de la Terre
La Terre est formée de couches emboîtées :
- la **croûte** (mince, solide, là où on vit) ;
- le **manteau** (très épais, roche chaude qui peut se déformer lentement) ;
- le **noyau** (au centre, très chaud, riche en fer).

La couche rigide de surface (croûte + haut du manteau) est découpée en morceaux : les **plaques tectoniques**.

## 2. Les plaques tectoniques
Ces plaques **flottent** sur le manteau et se déplacent de quelques **centimètres par an** (à peu près la vitesse à laquelle poussent tes ongles). Elles peuvent :
- **s'écarter** (naissance de nouvelle croûte) ;
- **se rapprocher** (une plaque plonge sous l'autre) ;
- **coulisser** l'une contre l'autre.

C'est aux **frontières** entre plaques que se concentrent séismes et volcans.

## 3. Les séismes
Quand deux plaques sont bloquées, la contrainte s'accumule. D'un coup, la roche **casse** le long d'une **faille** : c'est le **séisme**. L'énergie libérée se propage sous forme d'**ondes sismiques** qui font trembler le sol.

- Le point de rupture en profondeur est le **foyer**.
- Le point à la surface, juste au-dessus, est l'**épicentre**.
- La magnitude mesure l'**énergie** libérée (échelle de Richter).

## 4. Les volcans
Un **volcan** naît quand du **magma** (roche fondue du manteau) remonte vers la surface. Arrivé à l'air, le magma devient de la **lave**.
- Éruption **effusive** : lave fluide qui coule (ex. Piton de la Fournaise).
- Éruption **explosive** : lave visqueuse, gaz piégés, explosions violentes (ex. montagne Pelée).

## L'essentiel à retenir
- La Terre a trois couches : **croûte**, **manteau**, **noyau**.
- La surface est découpée en **plaques** qui bougent de quelques cm/an.
- Un **séisme** = rupture brutale des roches le long d'une **faille**.
- Un **volcan** = remontée de **magma** ; éruptions **effusives** ou **explosives**.$md$),

    ('La transmission de la vie', $md$# La transmission de la vie chez l'humain

## Ce que tu vas comprendre
Devenir capable de transmettre la vie, ça se prépare pendant l'adolescence. Ce chapitre explique les changements de la **puberté**, le rôle des **appareils reproducteurs**, comment se forme un **nouvel être** par la **fécondation**, et comment on peut **maîtriser** la reproduction.

## 1. La puberté
La **puberté** est la période où le corps devient capable de se reproduire. Elle est déclenchée par des **hormones**.
- Chez la fille : développement des seins, premières **règles**, élargissement du bassin.
- Chez le garçon : mue de la voix, pilosité, production de **spermatozoïdes**.

Ces changements arrivent à des âges **différents** selon les personnes : c'est normal.

## 2. Les appareils reproducteurs
- **Appareil reproducteur féminin** : les **ovaires** produisent les **ovules**, l'**utérus** peut accueillir un futur bébé.
- **Appareil reproducteur masculin** : les **testicules** produisent les **spermatozoïdes**, libérés lors de l'éjaculation.

À partir de la puberté, un **ovule** est libéré environ **une fois par mois** (l'ovulation).

## 3. La fécondation
La **fécondation** est la rencontre d'un **spermatozoïde** et d'un **ovule**. Elle forme une **cellule-œuf** unique. Cette cellule se divise, s'installe dans l'**utérus** (la **nidation**) et se développe pendant **9 mois** de grossesse jusqu'à la naissance.

> **À retenir :** un seul spermatozoïde féconde l'ovule ; la cellule-œuf contient déjà toutes les informations du futur enfant.

## 4. Maîtriser la reproduction
La **contraception** permet d'avoir des rapports sans déclencher de grossesse :
- la **pilule** (hormones qui bloquent l'ovulation) ;
- le **préservatif**, qui empêche la rencontre des cellules **et** protège des **infections sexuellement transmissibles (IST)**.

Le préservatif est le seul moyen qui protège **à la fois** contre la grossesse et contre les IST.

## L'essentiel à retenir
- La **puberté** rend le corps capable de se reproduire (déclenchée par des hormones).
- **Ovaires → ovules**, **testicules → spermatozoïdes**.
- La **fécondation** (spermatozoïde + ovule) forme une **cellule-œuf**.
- La **contraception** maîtrise la reproduction ; le **préservatif** protège aussi des IST.$md$),

    ('Le système nerveux', $md$# Le système nerveux

## Ce que tu vas comprendre
Voir, entendre, bouger, réagir vite : tout passe par le **système nerveux**. Ce chapitre explique comment l'information circule dans le corps sous forme de **message nerveux**, le rôle du **cerveau**, ce qu'est un **réflexe**, et pourquoi les **drogues** perturbent tout ça.

## 1. Les organes du système nerveux
Le système nerveux comprend :
- le **cerveau** et la **moelle épinière** (les centres nerveux, protégés par le crâne et la colonne) ;
- les **nerfs**, sortes de câbles qui relient les centres aux organes.

On distingue les **nerfs sensitifs** (qui apportent l'information des organes des sens) et les **nerfs moteurs** (qui commandent les muscles).

## 2. Le neurone et le message nerveux
La cellule de base du système nerveux est le **neurone**. L'information y circule sous forme d'un **message nerveux**, un signal de nature **électrique**.

Entre deux neurones, il y a un tout petit espace : la **synapse**. Le message y passe grâce à des **molécules chimiques**. C'est là que beaucoup de drogues agissent.

## 3. Le trajet de l'information
Exemple : tu vois un ballon arriver.
1. L'**œil** (organe des sens) capte l'information.
2. Un **nerf sensitif** transporte le message jusqu'au **cerveau**.
3. Le cerveau **traite** l'information et décide.
4. Un **nerf moteur** commande les **muscles** pour bouger.

## 4. Le mouvement réflexe
Un **réflexe** est une réaction **automatique** et **très rapide**, sans réflexion. Exemple : retirer sa main d'un objet brûlant. Ici, la **moelle épinière** commande la réponse **avant même** que le cerveau ait « compris ». Cela protège le corps du danger.

## 5. Les effets des drogues
Alcool, tabac, cannabis… ces substances agissent sur le cerveau et les synapses :
- elles **ralentissent** ou perturbent le message nerveux ;
- elles diminuent les **réflexes** et la **vigilance** ;
- elles peuvent créer une **dépendance**.

## L'essentiel à retenir
- Centres nerveux = **cerveau** + **moelle épinière** ; les **nerfs** relient tout.
- Le **neurone** transporte un **message nerveux** de nature électrique.
- Trajet : **organe des sens → nerf → cerveau → nerf → muscle**.
- Un **réflexe** est automatique et rapide (moelle épinière).
- Les **drogues** perturbent le message nerveux et créent une **dépendance**.$md$),

    ('Météorologie et climats', $md$# Météorologie et climats

## Ce que tu vas comprendre
Il fait beau aujourd'hui, mais quel est le **climat** de ta région ? Météo et climat, ce n'est pas la même chose. Ce chapitre t'apprend à ne plus les confondre, à décrire l'**atmosphère** et à repérer les grandes **zones climatiques** de la Terre.

## 1. Météo ou climat ?
- La **météo** décrit le temps qu'il fait **maintenant** et dans les **prochains jours**, à un endroit précis (température, pluie, vent).
- Le **climat** décrit le temps **habituel** d'une région, mesuré sur **une très longue durée** (au moins **30 ans**).

*Exemple : « il pleut cet après-midi » = météo ; « les hivers sont doux et pluvieux ici » = climat.*

> **À retenir :** la météo change tout le temps, le climat est une **moyenne** sur des dizaines d'années.

## 2. L'atmosphère
L'**atmosphère** est la couche d'**air** qui entoure la Terre. Elle contient surtout de l'**azote** et de l'**oxygène**. C'est dans sa partie basse que se forment les **nuages**, les pluies et les vents : c'est là que « se fabrique » la météo.

L'énergie qui met l'air en mouvement vient du **Soleil**, qui chauffe la surface de façon **inégale**.

## 3. Vents et masses d'air
Le Soleil chauffe plus l'**équateur** que les **pôles**. Cette différence de température crée des différences de **pression** : l'air se déplace des zones froides vers les zones chaudes, ce qui produit les **vents** et déplace les **masses d'air** (chaudes ou froides, sèches ou humides).

## 4. Les zones climatiques
Selon la latitude, on distingue de grandes **zones climatiques** :
- la zone **chaude** (près de l'**équateur**) : chaude toute l'année ;
- les zones **tempérées** (nos latitudes) : quatre saisons marquées ;
- les zones **froides** (près des **pôles**) : très froides, souvent gelées.

## L'essentiel à retenir
- **Météo** = temps qu'il fait maintenant ; **climat** = temps habituel sur **30 ans** minimum.
- L'**atmosphère** est la couche d'air ; la météo se forme dans sa partie **basse**.
- Le **Soleil** chauffe la Terre de façon inégale, ce qui crée les **vents**.
- Trois grandes zones : **chaude** (équateur), **tempérées**, **froides** (pôles).$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'svt'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('L''activité interne du globe', $json${
      "centre": "L'activité interne du globe",
      "branches": [
        { "titre": "Structure de la Terre", "enfants": ["Croûte (surface)", "Manteau (roche chaude)", "Noyau (fer, très chaud)"] },
        { "titre": "Plaques tectoniques", "enfants": ["Morceaux de surface", "Bougent de quelques cm/an", "S'écartent, se rapprochent, coulissent"] },
        { "titre": "Séismes", "enfants": ["Rupture le long d'une faille", "Foyer et épicentre", "Ondes sismiques, magnitude"] },
        { "titre": "Volcans", "enfants": ["Magma qui remonte", "Lave à la surface", "Éruptions effusives ou explosives"] }
      ]
    }$json$),
    ('La transmission de la vie', $json${
      "centre": "La transmission de la vie",
      "branches": [
        { "titre": "Puberté", "enfants": ["Déclenchée par les hormones", "Fille : règles", "Garçon : spermatozoïdes"] },
        { "titre": "Appareils reproducteurs", "enfants": ["Ovaires → ovules", "Testicules → spermatozoïdes", "Utérus accueille le bébé"] },
        { "titre": "Fécondation", "enfants": ["Spermatozoïde + ovule", "Cellule-œuf", "Nidation puis 9 mois"] },
        { "titre": "Maîtriser la reproduction", "enfants": ["Pilule (bloque l'ovulation)", "Préservatif", "Protège aussi des IST"] }
      ]
    }$json$),
    ('Le système nerveux', $json${
      "centre": "Le système nerveux",
      "branches": [
        { "titre": "Les organes", "enfants": ["Cerveau et moelle épinière", "Nerfs = câbles", "Sensitifs et moteurs"] },
        { "titre": "Neurone et message", "enfants": ["Neurone = cellule de base", "Message nerveux électrique", "Synapse entre neurones"] },
        { "titre": "Trajet de l'info", "enfants": ["Organe des sens → nerf", "Cerveau traite", "Nerf → muscle"] },
        { "titre": "Réflexe et drogues", "enfants": ["Réflexe = automatique, rapide", "Moelle épinière", "Drogues : perturbent, dépendance"] }
      ]
    }$json$),
    ('Météorologie et climats', $json${
      "centre": "Météorologie et climats",
      "branches": [
        { "titre": "Météo ou climat", "enfants": ["Météo = maintenant", "Climat = habituel", "Climat sur 30 ans mini"] },
        { "titre": "L'atmosphère", "enfants": ["Couche d'air", "Azote et oxygène", "Météo dans la partie basse"] },
        { "titre": "Vents", "enfants": ["Soleil chauffe inégalement", "Différences de pression", "Masses d'air en mouvement"] },
        { "titre": "Zones climatiques", "enfants": ["Chaude (équateur)", "Tempérées (4 saisons)", "Froides (pôles)"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'svt'
 WHERE c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (Ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'SVT', '4e', v.chapter, true, l.id
FROM (VALUES
  ('10819999-0000-4000-8000-000000000001'::uuid, 'L''activité interne du globe'),
  ('10819999-0000-4000-8000-000000000002'::uuid, 'La transmission de la vie'),
  ('10819999-0000-4000-8000-000000000003'::uuid, 'Le système nerveux'),
  ('10819999-0000-4000-8000-000000000004'::uuid, 'Météorologie et climats')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'svt'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
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
  -- Chapitre 1 — L'activité interne du globe
  ('10810000-0000-4000-8000-000000000104'::uuid, 'L''activité interne du globe',
   'Comment appelle-t-on les grands morceaux qui découpent la surface de la Terre ?', 'mcq',
   '["Les plaques tectoniques", "Les continents", "Les failles", "Les cratères"]', 0,
   'La couche rigide de surface est découpée en plaques tectoniques qui se déplacent.', 4),
  ('10810000-0000-4000-8000-000000000105'::uuid, 'L''activité interne du globe',
   'Un séisme est provoqué par : ', 'mcq',
   '["La rupture brutale des roches le long d''une faille", "La pluie", "La rotation de la Terre", "Le vent"]', 0,
   'Quand la contrainte s''accumule, la roche casse d''un coup le long d''une faille : c''est le séisme.', 5),
  ('10810000-0000-4000-8000-000000000106'::uuid, 'L''activité interne du globe',
   'La roche fondue qui remonte sous un volcan s''appelle : ', 'mcq',
   '["Le magma", "Le noyau", "La croûte", "La faille"]', 0,
   'Le magma est la roche fondue du manteau ; arrivé en surface, il devient de la lave.', 6),
  ('10810000-0000-4000-8000-000000000107'::uuid, 'L''activité interne du globe',
   'Les plaques tectoniques se déplacent de plusieurs kilomètres par an.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : elles bougent de quelques centimètres par an seulement.', 7),
  ('10810000-0000-4000-8000-000000000108'::uuid, 'L''activité interne du globe',
   'Quelle est la couche la plus au centre de la Terre ?', 'mcq',
   '["Le noyau", "La croûte", "Le manteau", "L''atmosphère"]', 0,
   'De la surface vers le centre : croûte, manteau, puis noyau.', 8),
  ('10810000-0000-4000-8000-000000000109'::uuid, 'L''activité interne du globe',
   'Le point à la surface situé juste au-dessus du foyer d''un séisme s''appelle : ', 'mcq',
   '["L''épicentre", "Le cratère", "Le magma", "Le pôle"]', 0,
   'Le foyer est en profondeur ; l''épicentre est le point de la surface juste au-dessus.', 9),
  ('10810000-0000-4000-8000-000000000110'::uuid, 'L''activité interne du globe',
   'Une éruption avec une lave fluide qui coule est dite : ', 'mcq',
   '["Effusive", "Explosive", "Sismique", "Tempérée"]', 0,
   'Lave fluide qui coule = éruption effusive ; lave visqueuse avec explosions = explosive.', 10),

  -- Chapitre 2 — La transmission de la vie
  ('10810000-0000-4000-8000-000000000204'::uuid, 'La transmission de la vie',
   'Que produisent les ovaires ?', 'mcq',
   '["Les ovules", "Les spermatozoïdes", "Les hormones du foie", "Les globules rouges"]', 0,
   'Les ovaires produisent les ovules ; les testicules produisent les spermatozoïdes.', 4),
  ('10810000-0000-4000-8000-000000000205'::uuid, 'La transmission de la vie',
   'La fécondation est la rencontre : ', 'mcq',
   '["D''un spermatozoïde et d''un ovule", "De deux ovules", "De deux spermatozoïdes", "De deux cellules-œufs"]', 0,
   'La fécondation = un spermatozoïde + un ovule, ce qui forme une cellule-œuf.', 5),
  ('10810000-0000-4000-8000-000000000206'::uuid, 'La transmission de la vie',
   'La puberté est déclenchée par des hormones.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ce sont des hormones qui déclenchent les transformations de la puberté.', 6),
  ('10810000-0000-4000-8000-000000000207'::uuid, 'La transmission de la vie',
   'Quel moyen de contraception protège AUSSI des infections sexuellement transmissibles ?', 'mcq',
   '["Le préservatif", "La pilule", "Le stérilet", "Aucun"]', 0,
   'Le préservatif est le seul moyen qui protège à la fois de la grossesse et des IST.', 7),
  ('10810000-0000-4000-8000-000000000208'::uuid, 'La transmission de la vie',
   'Comment appelle-t-on la cellule formée juste après la fécondation ?', 'mcq',
   '["La cellule-œuf", "L''ovule", "Le spermatozoïde", "Le neurone"]', 0,
   'La rencontre des deux cellules forme une unique cellule-œuf.', 8),
  ('10810000-0000-4000-8000-000000000209'::uuid, 'La transmission de la vie',
   'Chez la fille, les premières règles apparaissent à la puberté.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les premières règles sont un des signes de la puberté chez la fille.', 9),
  ('10810000-0000-4000-8000-000000000210'::uuid, 'La transmission de la vie',
   'La pilule contraceptive agit surtout en : ', 'mcq',
   '["Bloquant l''ovulation", "Renforçant les muscles", "Augmentant la taille", "Protégeant des séismes"]', 0,
   'La pilule contient des hormones qui empêchent l''ovulation.', 10),

  -- Chapitre 3 — Le système nerveux
  ('10810000-0000-4000-8000-000000000304'::uuid, 'Le système nerveux',
   'Quelle est la cellule de base du système nerveux ?', 'mcq',
   '["Le neurone", "L''ovule", "Le globule rouge", "La plaque"]', 0,
   'Le neurone est la cellule qui transporte le message nerveux.', 4),
  ('10810000-0000-4000-8000-000000000305'::uuid, 'Le système nerveux',
   'Le message nerveux est de nature : ', 'mcq',
   '["Électrique", "Liquide", "Magmatique", "Gazeuse"]', 0,
   'Dans le neurone, le message nerveux circule sous forme d''un signal électrique.', 5),
  ('10810000-0000-4000-8000-000000000306'::uuid, 'Le système nerveux',
   'Quels sont les deux centres nerveux principaux ?', 'mcq',
   '["Le cerveau et la moelle épinière", "Le cœur et les poumons", "L''œil et l''oreille", "Les ovaires et les testicules"]', 0,
   'Les centres nerveux sont le cerveau et la moelle épinière, reliés aux organes par les nerfs.', 6),
  ('10810000-0000-4000-8000-000000000307'::uuid, 'Le système nerveux',
   'Un mouvement réflexe est une réaction lente qui demande de la réflexion.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : un réflexe est au contraire automatique et très rapide, sans réflexion.', 7),
  ('10810000-0000-4000-8000-000000000308'::uuid, 'Le système nerveux',
   'Dans quel ordre circule l''information quand tu vois puis attrapes un objet ?', 'mcq',
   '["Organe des sens → nerf → cerveau → nerf → muscle", "Muscle → cerveau → œil", "Cerveau → oreille → jambe", "Muscle → nerf → ovaire"]', 0,
   'Le message part de l''organe des sens vers le cerveau, puis repart vers les muscles.', 8),
  ('10810000-0000-4000-8000-000000000309'::uuid, 'Le système nerveux',
   'Le petit espace entre deux neurones s''appelle : ', 'mcq',
   '["La synapse", "La faille", "L''épicentre", "Le cratère"]', 0,
   'La synapse est l''espace où le message passe d''un neurone à l''autre grâce à des molécules chimiques.', 9),
  ('10810000-0000-4000-8000-000000000310'::uuid, 'Le système nerveux',
   'Les drogues peuvent diminuer les réflexes et créer une dépendance.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les drogues perturbent le message nerveux : elles baissent la vigilance et rendent dépendant.', 10),

  -- Chapitre 4 — Météorologie et climats
  ('10810000-0000-4000-8000-000000000404'::uuid, 'Météorologie et climats',
   'Quelle affirmation décrit la MÉTÉO ?', 'mcq',
   '["Le temps qu''il fait aujourd''hui et les prochains jours", "Le temps habituel sur 30 ans", "La forme des continents", "La structure de la Terre"]', 0,
   'La météo décrit le temps du moment ; le climat décrit le temps habituel sur une longue durée.', 4),
  ('10810000-0000-4000-8000-000000000405'::uuid, 'Météorologie et climats',
   'Sur quelle durée minimale mesure-t-on un climat ?', 'mcq',
   '["Environ 30 ans", "3 jours", "1 mois", "1 an"]', 0,
   'Le climat est une moyenne établie sur au moins une trentaine d''années.', 5),
  ('10810000-0000-4000-8000-000000000406'::uuid, 'Météorologie et climats',
   'La couche d''air qui entoure la Terre s''appelle : ', 'mcq',
   '["L''atmosphère", "Le manteau", "Le noyau", "La faille"]', 0,
   'L''atmosphère est la couche d''air (surtout azote et oxygène) qui entoure la Terre.', 6),
  ('10810000-0000-4000-8000-000000000407'::uuid, 'Météorologie et climats',
   'Les vents naissent parce que le Soleil chauffe la Terre de façon inégale.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le Soleil chauffe plus l''équateur que les pôles, ce qui crée les différences de pression et les vents.', 7),
  ('10810000-0000-4000-8000-000000000408'::uuid, 'Météorologie et climats',
   'Près de l''équateur, la zone climatique est plutôt : ', 'mcq',
   '["Chaude toute l''année", "Très froide", "Gelée", "Tempérée avec 4 saisons"]', 0,
   'La zone proche de l''équateur est chaude toute l''année ; les pôles sont froids.', 8),
  ('10810000-0000-4000-8000-000000000409'::uuid, 'Météorologie et climats',
   'Quel gaz est le plus abondant dans l''atmosphère ?', 'mcq',
   '["L''azote", "L''oxygène", "Le dioxyde de carbone", "L''hélium"]', 0,
   'L''atmosphère contient surtout de l''azote, puis de l''oxygène.', 9),
  ('10810000-0000-4000-8000-000000000410'::uuid, 'Météorologie et climats',
   '« Il va pleuvoir cet après-midi » est une information de climat.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : c''est de la météo (le temps du moment) ; le climat décrit le temps habituel sur des dizaines d''années.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'svt'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
