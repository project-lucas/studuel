-- =============================================================================
-- Studuel — Migration 117 : CONTENU SVT 3e (+ exercices type brevet)
-- Remplit les 5 chapitres de SVT 3e (programme cycle 4, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder de 008)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (positions 4→10). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant).
--   4. Exercices type brevet → lessons.content de « Exercices types » (position 2) :
--                    2 exercices type brevet par chapitre (document/graphique décrit
--                    + questions a) b) c), raisonnement scientifique) et leur correction.
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
    ('Le programme génétique', $md$# Le programme génétique

## Ce que tu vas comprendre
Chaque être vivant possède un « programme » qui dirige son fonctionnement : le **programme génétique**. Ce chapitre t'explique où il est rangé (le noyau des cellules), sous quelle forme (l'ADN, les chromosomes) et comment il porte l'information héréditaire (les gènes, les allèles).

## 1. La cellule et son noyau
Le corps est fait de milliards de **cellules**. La plupart possèdent un **noyau**, qui contient l'information génétique. C'est le « centre de commande » de la cellule.

*Observée au microscope après coloration, une cellule montre un noyau bien visible : c'est là que se trouve le programme génétique.*

## 2. Les chromosomes et le caryotype
Dans le noyau, l'information est portée par des **chromosomes**. Le **caryotype** est la photo classée de tous les chromosomes d'une cellule.

- L'espèce humaine possède **46 chromosomes**, rangés en **23 paires**.
- La **23e paire** détermine le sexe : **XX** chez la fille, **XY** chez le garçon.

*Un caryotype présentant 3 chromosomes 21 (trisomie 21) montre 47 chromosomes au lieu de 46.*

## 3. De l'ADN aux gènes
Chaque chromosome est fait d'une longue molécule : l'**ADN**. L'ADN porte des **gènes**, qui sont des portions d'ADN. Chaque **gène** contient l'information pour un caractère (couleur des yeux, groupe sanguin…).

> **À retenir :** noyau → chromosomes → ADN → gènes. On va du plus grand au plus petit.

## 4. Gènes et allèles
Un même gène peut exister sous plusieurs versions : les **allèles**. C'est pour cela que les individus d'une même espèce sont différents.

- Pour le gène du groupe sanguin, les allèles possibles sont **A**, **B** et **O**.
- On possède deux allèles de chaque gène (un venu de la mère, un du père).

## 5. La transmission de l'information
Lors de la **reproduction sexuée**, chaque parent transmet la **moitié** de ses chromosomes par une cellule reproductrice (ovule ou spermatozoïde). La **fécondation** réunit les deux moitiés : l'enfant reçoit ainsi des caractères de ses deux parents.

## L'essentiel à retenir
- L'information génétique est dans le **noyau** des cellules.
- Elle est portée par **46 chromosomes** (23 paires) faits d'**ADN**.
- Un **gène** est une portion d'ADN qui code un caractère ; ses versions sont les **allèles**.
- À la reproduction sexuée, chaque parent transmet la **moitié** de ses chromosomes.$md$),

    ('L''évolution des espèces', $md$# L'évolution des espèces

## Ce que tu vas comprendre
Les espèces vivantes ne sont pas figées : elles **changent au cours du temps**. C'est l'**évolution**. Ce chapitre t'explique les preuves de cette évolution, le mécanisme de la **sélection naturelle** et la **parenté** entre les êtres vivants.

## 1. La biodiversité, passée et présente
La **biodiversité** est l'ensemble des espèces vivant sur Terre. Elle a beaucoup changé : de nombreuses espèces ont **disparu** (les dinosaures), d'autres sont **apparues**. Les **fossiles** en gardent la trace dans les roches.

## 2. Des espèces qui se transforment
Les fossiles montrent que des espèces se sont transformées progressivement.

*Exemple : les fossiles du cheval montrent, sur des millions d'années, un animal de plus en plus grand, dont les doigts se réduisent à un seul (le sabot actuel).*

## 3. La sélection naturelle
**Charles Darwin** a proposé le mécanisme de la **sélection naturelle** :
1. Dans une espèce, les individus **varient** (certains courent plus vite, résistent mieux au froid…).
2. Ceux qui sont les **mieux adaptés** au milieu survivent et se reproduisent davantage.
3. Ils transmettent leurs caractères : au fil des générations, l'espèce **change**.

*Exemple : des papillons sombres deviennent majoritaires dans une forêt polluée où ils sont mieux camouflés des oiseaux.*

## 4. La parenté entre les êtres vivants
Tous les êtres vivants partagent des **caractères communs** hérités d'ancêtres communs. Par exemple, l'homme, le chat et la chauve-souris ont **quatre membres avec le même plan d'organisation** (un os, deux os, des doigts) : c'est un signe de **parenté**.

> **À retenir :** plus deux espèces partagent de caractères, plus leur **ancêtre commun** est récent.

## 5. L'être humain dans l'évolution
L'espèce humaine est elle aussi le produit de l'évolution. Elle est **apparentée** aux grands singes : le chimpanzé est l'espèce actuelle la plus proche de nous.

## L'essentiel à retenir
- Les espèces **évoluent** : elles apparaissent, se transforment, disparaissent (preuves = **fossiles**).
- La **sélection naturelle** (Darwin) : les mieux **adaptés** survivent et transmettent leurs caractères.
- Les caractères communs traduisent une **parenté** et un **ancêtre commun**.
- L'espèce humaine est apparentée aux **grands singes**.$md$),

    ('Le système immunitaire', $md$# Le système immunitaire

## Ce que tu vas comprendre
Notre corps est en permanence exposé à des **micro-organismes** (bactéries, virus). Le **système immunitaire** est l'ensemble des moyens qui nous défendent contre eux. Ce chapitre décrit les barrières, les cellules qui combattent et l'intérêt de la vaccination.

## 1. Les micro-organismes et la contamination
Un micro-organisme (bactérie, virus, champignon) peut entrer dans le corps : c'est la **contamination**. S'il se multiplie, c'est l'**infection**. On appelle **antigène** tout élément étranger reconnu par le système immunitaire.

## 2. Les premières barrières
La **peau** et les **muqueuses** forment une première barrière qui empêche l'entrée des micro-organismes. Une plaie ou une coupure ouvre une porte d'entrée.

## 3. La phagocytose (réaction rapide)
Si un microbe franchit la barrière, des cellules du sang, les **phagocytes**, l'**absorbent et le digèrent** : c'est la **phagocytose**. Cette réaction est **rapide** et souvent suffisante.

*Au microscope, on observe un phagocyte qui entoure une bactérie puis la détruit à l'intérieur.*

## 4. Les anticorps (réaction lente et spécifique)
Si la phagocytose ne suffit pas, d'autres cellules, les **lymphocytes**, entrent en jeu.

- Certains lymphocytes produisent des **anticorps**, des molécules qui se fixent **spécifiquement** sur un antigène pour le neutraliser.
- D'autres détruisent directement les cellules infectées.

> **À retenir :** un anticorps est **spécifique** d'un seul antigène, comme une clé pour une serrure.

## 5. La mémoire immunitaire et la vaccination
Après une première rencontre, le corps garde une **mémoire** : il réagit plus vite et plus fort la fois suivante. La **vaccination** utilise ce principe : on introduit un antigène **inoffensif** pour que le corps fabrique ses défenses **avant** la vraie maladie.

## L'essentiel à retenir
- La **peau** et les **muqueuses** sont les premières barrières.
- La **phagocytose** est une défense **rapide** : les phagocytes digèrent les microbes.
- Les **anticorps**, produits par les **lymphocytes**, sont **spécifiques** d'un antigène.
- La **vaccination** crée une **mémoire** immunitaire qui protège avant la maladie.$md$),

    ('Santé et responsabilité', $md$# Santé et responsabilité

## Ce que tu vas comprendre
Rester en bonne santé dépend de notre corps mais aussi de nos **comportements**. Ce chapitre t'aide à comprendre comment limiter la transmission des maladies et faire des choix responsables pour ta santé.

## 1. Les micro-organismes et la transmission
Les maladies infectieuses se transmettent de plusieurs façons : par l'**air** (postillons), le **contact**, l'**eau** ou les **aliments** souillés. Comprendre le mode de transmission permet de s'en protéger.

## 2. L'hygiène, une barrière efficace
Des gestes simples réduisent beaucoup les contaminations :
- se **laver les mains** régulièrement,
- **cuire** et **conserver** correctement les aliments,
- utiliser de l'**eau potable**.

*Exemple : le lavage des mains avant les repas fait chuter le nombre d'infections digestives.*

## 3. Antiseptiques et antibiotiques
- Un **antiseptique** s'applique sur la peau ou une plaie pour éliminer les microbes.
- Un **antibiotique** est un médicament qui **tue les bactéries** dans l'organisme.

> **À retenir :** les antibiotiques agissent sur les **bactéries**, **pas sur les virus**. Il ne faut les prendre que sur prescription pour éviter les **résistances**.

## 4. Des comportements responsables
Certains choix protègent la santé sur le long terme :
- alimentation équilibrée et activité physique,
- éviter le tabac, l'alcool et les autres drogues,
- se protéger des infections sexuellement transmissibles (**préservatif**).

## 5. La contraception et la prévention
La **contraception** permet de choisir le moment d'avoir un enfant (par exemple la **pilule** ou le **préservatif**). Le **préservatif** protège en plus des **IST** comme le sida.

## L'essentiel à retenir
- Les maladies se transmettent par l'air, le contact, l'eau ou les aliments.
- L'**hygiène** (mains, aliments, eau potable) est une barrière simple et efficace.
- Les **antibiotiques** tuent les **bactéries**, jamais les **virus**.
- Des comportements responsables (alimentation, préservatif, éviter les drogues) protègent la santé.$md$),

    ('Les risques géologiques', $md$# Les risques géologiques

## Ce que tu vas comprendre
La Terre est active : elle **tremble** (séismes) et laisse remonter du magma (**volcans**). Ces phénomènes peuvent devenir dangereux pour les populations. Ce chapitre distingue l'**aléa** du **risque** et présente les moyens de **prévention**.

## 1. Les séismes
Un **séisme** est une secousse du sol due à une **rupture brutale** des roches en profondeur, le long d'une **faille**. L'énergie libérée se propage sous forme d'**ondes sismiques** enregistrées par les **sismographes**.

- Le point de rupture en profondeur est le **foyer** ; le point à la surface juste au-dessus est l'**épicentre**.
- La **magnitude** mesure l'énergie libérée (échelle de Richter).

## 2. Les volcans
Un **volcan** rejette du **magma** venu des profondeurs. On distingue deux grands types d'éruptions :
- **effusive** : des coulées de lave fluide (volcan rouge, ex. Piton de la Fournaise) ;
- **explosive** : des projections violentes et des nuées ardentes (volcan gris, plus dangereux).

*Un schéma de volcan montre la chambre magmatique en profondeur, la cheminée, et le cratère au sommet.*

## 3. Séismes, volcans et tectonique
Séismes et volcans ne sont pas répartis au hasard : ils se concentrent aux **frontières des plaques** de la surface terrestre (par exemple la « ceinture de feu » du Pacifique).

## 4. Aléa et risque
Il faut distinguer deux notions :
- l'**aléa** = la probabilité qu'un phénomène (séisme, éruption) se produise à un endroit ;
- le **risque** = l'aléa **combiné à la présence d'une population** exposée.

> **À retenir :** un fort aléa dans un désert vide = **peu de risque** ; un aléa moyen dans une grande ville = **risque élevé**.

## 5. La prévention
On ne peut pas empêcher un séisme, mais on peut **réduire le risque** :
- construire des bâtiments **parasismiques**,
- **surveiller** les volcans pour prévoir les éruptions,
- **informer** et préparer la population (consignes, exercices d'évacuation).

## L'essentiel à retenir
- Un **séisme** vient de la rupture des roches le long d'une **faille** (foyer, épicentre, magnitude).
- Un **volcan** rejette du **magma** : éruption **effusive** (lave) ou **explosive** (dangereuse).
- Séismes et volcans se concentrent aux **frontières de plaques**.
- **Risque = aléa + population exposée** ; la **prévention** (parasismique, surveillance, information) le réduit.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'svt'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Le programme génétique', $json${
      "centre": "Le programme génétique",
      "branches": [
        { "titre": "Où est l'information ?", "enfants": ["Dans le noyau des cellules", "Chromosomes faits d'ADN", "46 chromosomes = 23 paires"] },
        { "titre": "Caryotype", "enfants": ["Photo classée des chromosomes", "23e paire = sexe", "XX fille / XY garçon"] },
        { "titre": "Gènes et allèles", "enfants": ["Gène = portion d'ADN", "Code un caractère", "Allèles = versions d'un gène"] },
        { "titre": "Transmission", "enfants": ["Chaque parent : la moitié", "Ovule et spermatozoïde", "Fécondation réunit les deux"] }
      ]
    }$json$),
    ('L''évolution des espèces', $json${
      "centre": "L'évolution des espèces",
      "branches": [
        { "titre": "Preuves", "enfants": ["Fossiles dans les roches", "Espèces apparues/disparues", "Ex. évolution du cheval"] },
        { "titre": "Sélection naturelle", "enfants": ["Darwin", "Les individus varient", "Les mieux adaptés survivent"] },
        { "titre": "Parenté", "enfants": ["Caractères communs", "Ancêtre commun", "Même plan des membres"] },
        { "titre": "L'être humain", "enfants": ["Produit de l'évolution", "Apparenté aux grands singes", "Chimpanzé le plus proche"] }
      ]
    }$json$),
    ('Le système immunitaire', $json${
      "centre": "Le système immunitaire",
      "branches": [
        { "titre": "Menaces", "enfants": ["Bactéries, virus", "Contamination puis infection", "Antigène = élément étranger"] },
        { "titre": "Barrières", "enfants": ["Peau et muqueuses", "Empêchent l'entrée", "Plaie = porte d'entrée"] },
        { "titre": "Phagocytose", "enfants": ["Défense rapide", "Phagocytes du sang", "Absorbent et digèrent"] },
        { "titre": "Anticorps et vaccin", "enfants": ["Lymphocytes", "Anticorps spécifiques", "Vaccin = mémoire immunitaire"] }
      ]
    }$json$),
    ('Santé et responsabilité', $json${
      "centre": "Santé et responsabilité",
      "branches": [
        { "titre": "Transmission", "enfants": ["Air, contact", "Eau, aliments", "Connaître pour se protéger"] },
        { "titre": "Hygiène", "enfants": ["Se laver les mains", "Cuire les aliments", "Eau potable"] },
        { "titre": "Médicaments", "enfants": ["Antiseptique sur la peau", "Antibiotique tue les bactéries", "Inefficace sur les virus"] },
        { "titre": "Comportements", "enfants": ["Alimentation, sport", "Éviter tabac/alcool", "Préservatif contre les IST"] }
      ]
    }$json$),
    ('Les risques géologiques', $json${
      "centre": "Les risques géologiques",
      "branches": [
        { "titre": "Séismes", "enfants": ["Rupture le long d'une faille", "Ondes sismiques", "Foyer, épicentre, magnitude"] },
        { "titre": "Volcans", "enfants": ["Rejet de magma", "Effusive = lave fluide", "Explosive = dangereuse"] },
        { "titre": "Tectonique", "enfants": ["Frontières de plaques", "Ceinture de feu", "Répartition non aléatoire"] },
        { "titre": "Aléa et prévention", "enfants": ["Risque = aléa + population", "Bâtir parasismique", "Surveiller et informer"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'svt'
 WHERE c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal 036 a déjà créé les quiz SVT collège ; ce bloc ne fait
--     rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'SVT', '3e', v.chapter, true, l.id
FROM (VALUES
  ('11719999-0000-4000-8000-000000000001'::uuid, 'Le programme génétique'),
  ('11719999-0000-4000-8000-000000000002'::uuid, 'L''évolution des espèces'),
  ('11719999-0000-4000-8000-000000000003'::uuid, 'Le système immunitaire'),
  ('11719999-0000-4000-8000-000000000004'::uuid, 'Santé et responsabilité'),
  ('11719999-0000-4000-8000-000000000005'::uuid, 'Les risques géologiques')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'svt'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
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
  -- Chapitre 1 — Le programme génétique
  ('11710000-0000-4000-8000-000000000104'::uuid, 'Le programme génétique',
   'Où se trouve l''information génétique dans une cellule ?', 'mcq',
   '["Dans le noyau", "Dans la membrane", "Dans le sang", "Autour de la cellule"]', 0,
   'L''information génétique est contenue dans le noyau des cellules.', 4),
  ('11710000-0000-4000-8000-000000000105'::uuid, 'Le programme génétique',
   'Combien de chromosomes possède l''espèce humaine ?', 'mcq',
   '["46", "23", "48", "44"]', 0,
   'L''espèce humaine possède 46 chromosomes, rangés en 23 paires.', 5),
  ('11710000-0000-4000-8000-000000000106'::uuid, 'Le programme génétique',
   'Qu''est-ce qu''un gène ?', 'mcq',
   '["Une portion d''ADN qui code un caractère", "Une cellule du sang", "Un noyau entier", "Une paire de chromosomes"]', 0,
   'Un gène est une portion d''ADN portant l''information d''un caractère.', 6),
  ('11710000-0000-4000-8000-000000000107'::uuid, 'Le programme génétique',
   'Les différentes versions d''un même gène s''appellent des allèles.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un gène peut exister sous plusieurs versions appelées allèles.', 7),
  ('11710000-0000-4000-8000-000000000108'::uuid, 'Le programme génétique',
   'Quelle paire de chromosomes détermine le sexe chez l''humain ?', 'mcq',
   '["La 23e paire", "La 1re paire", "La 21e paire", "Aucune"]', 0,
   'La 23e paire détermine le sexe : XX pour une fille, XY pour un garçon.', 8),
  ('11710000-0000-4000-8000-000000000109'::uuid, 'Le programme génétique',
   'Lors de la reproduction sexuée, chaque parent transmet tous ses chromosomes.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : chaque parent transmet la moitié de ses chromosomes par une cellule reproductrice.', 9),
  ('11710000-0000-4000-8000-000000000110'::uuid, 'Le programme génétique',
   'Comment appelle-t-on la photo classée de tous les chromosomes d''une cellule ?', 'mcq',
   '["Le caryotype", "Le génome", "L''allèle", "Le phagocyte"]', 0,
   'Le caryotype est la présentation ordonnée des chromosomes d''une cellule.', 10),

  -- Chapitre 2 — L'évolution des espèces
  ('11710000-0000-4000-8000-000000000204'::uuid, 'L''évolution des espèces',
   'Quel scientifique a proposé la théorie de la sélection naturelle ?', 'mcq',
   '["Charles Darwin", "Louis Pasteur", "Isaac Newton", "Gregor Mendel"]', 0,
   'C''est Charles Darwin qui a proposé le mécanisme de la sélection naturelle.', 4),
  ('11710000-0000-4000-8000-000000000205'::uuid, 'L''évolution des espèces',
   'Que garde-t-on des espèces disparues dans les roches ?', 'mcq',
   '["Des fossiles", "Des cellules vivantes", "Des vaccins", "Des allèles"]', 0,
   'Les fossiles conservés dans les roches gardent la trace des espèces passées.', 5),
  ('11710000-0000-4000-8000-000000000206'::uuid, 'L''évolution des espèces',
   'Dans la sélection naturelle, ce sont les individus les mieux adaptés qui survivent et se reproduisent le plus.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les individus les mieux adaptés à leur milieu survivent et transmettent leurs caractères.', 6),
  ('11710000-0000-4000-8000-000000000207'::uuid, 'L''évolution des espèces',
   'Que traduisent des caractères communs entre deux espèces ?', 'mcq',
   '["Une parenté et un ancêtre commun", "Une absence de lien", "Une maladie", "Un hasard total"]', 0,
   'Des caractères communs traduisent une parenté et l''existence d''un ancêtre commun.', 7),
  ('11710000-0000-4000-8000-000000000208'::uuid, 'L''évolution des espèces',
   'La biodiversité est restée exactement la même depuis l''apparition de la vie.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la biodiversité a beaucoup changé, avec des espèces apparues et d''autres disparues.', 8),
  ('11710000-0000-4000-8000-000000000209'::uuid, 'L''évolution des espèces',
   'Quelle espèce actuelle est la plus proche de l''être humain ?', 'mcq',
   '["Le chimpanzé", "Le chien", "Le cheval", "Le dauphin"]', 0,
   'Le chimpanzé est l''espèce actuelle la plus apparentée à l''être humain.', 9),
  ('11710000-0000-4000-8000-000000000210'::uuid, 'L''évolution des espèces',
   'Plus deux espèces partagent de caractères, plus leur ancêtre commun est récent.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un grand nombre de caractères partagés indique un ancêtre commun plus récent.', 10),

  -- Chapitre 3 — Le système immunitaire
  ('11710000-0000-4000-8000-000000000304'::uuid, 'Le système immunitaire',
   'Quelles cellules réalisent la phagocytose ?', 'mcq',
   '["Les phagocytes", "Les neurones", "Les globules rouges", "Les cellules de la peau"]', 0,
   'Les phagocytes absorbent et digèrent les micro-organismes : c''est la phagocytose.', 4),
  ('11710000-0000-4000-8000-000000000305'::uuid, 'Le système immunitaire',
   'Un anticorps agit de façon spécifique sur un seul antigène.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un anticorps est spécifique : il se fixe sur un seul type d''antigène.', 5),
  ('11710000-0000-4000-8000-000000000306'::uuid, 'Le système immunitaire',
   'Quelle est la première barrière du corps contre les micro-organismes ?', 'mcq',
   '["La peau et les muqueuses", "Le squelette", "Les anticorps", "Le noyau"]', 0,
   'La peau et les muqueuses forment la première barrière qui empêche l''entrée des microbes.', 6),
  ('11710000-0000-4000-8000-000000000307'::uuid, 'Le système immunitaire',
   'Quelles cellules produisent les anticorps ?', 'mcq',
   '["Les lymphocytes", "Les phagocytes", "Les globules rouges", "Les plaquettes"]', 0,
   'Ce sont les lymphocytes qui produisent les anticorps.', 7),
  ('11710000-0000-4000-8000-000000000308'::uuid, 'Le système immunitaire',
   'Sur quel principe repose la vaccination ?', 'mcq',
   '["La mémoire immunitaire", "La phagocytose seule", "L''hygiène des mains", "La contraception"]', 0,
   'Le vaccin crée une mémoire immunitaire : le corps se défend avant la vraie maladie.', 8),
  ('11710000-0000-4000-8000-000000000309'::uuid, 'Le système immunitaire',
   'La phagocytose est une réaction lente et toujours insuffisante.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la phagocytose est une réaction rapide et souvent suffisante.', 9),
  ('11710000-0000-4000-8000-000000000310'::uuid, 'Le système immunitaire',
   'Comment appelle-t-on l''entrée d''un micro-organisme dans le corps ?', 'mcq',
   '["La contamination", "La vaccination", "La parenté", "La magnitude"]', 0,
   'La contamination est l''entrée d''un micro-organisme dans l''organisme.', 10),

  -- Chapitre 4 — Santé et responsabilité
  ('11710000-0000-4000-8000-000000000404'::uuid, 'Santé et responsabilité',
   'Sur quoi agissent les antibiotiques ?', 'mcq',
   '["Les bactéries", "Les virus", "Les allèles", "Les fossiles"]', 0,
   'Les antibiotiques tuent les bactéries ; ils sont inefficaces contre les virus.', 4),
  ('11710000-0000-4000-8000-000000000405'::uuid, 'Santé et responsabilité',
   'Les antibiotiques sont efficaces contre les virus.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : les antibiotiques agissent sur les bactéries, pas sur les virus.', 5),
  ('11710000-0000-4000-8000-000000000406'::uuid, 'Santé et responsabilité',
   'Quel geste d''hygiène simple réduit fortement les infections ?', 'mcq',
   '["Se laver les mains", "Sauter un repas", "Rester enfermé", "Boire moins d''eau"]', 0,
   'Le lavage régulier des mains fait beaucoup baisser le nombre de contaminations.', 6),
  ('11710000-0000-4000-8000-000000000407'::uuid, 'Santé et responsabilité',
   'Où applique-t-on un antiseptique ?', 'mcq',
   '["Sur la peau ou une plaie", "Dans le sang par piqûre", "Dans le noyau", "Sur un volcan"]', 0,
   'Un antiseptique s''applique sur la peau ou une plaie pour éliminer les microbes.', 7),
  ('11710000-0000-4000-8000-000000000408'::uuid, 'Santé et responsabilité',
   'Le préservatif protège à la fois d''une grossesse et des IST.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le préservatif est un moyen de contraception qui protège aussi des IST comme le sida.', 8),
  ('11710000-0000-4000-8000-000000000409'::uuid, 'Santé et responsabilité',
   'Par quel moyen une maladie peut-elle se transmettre ?', 'mcq',
   '["L''air, le contact, l''eau ou les aliments", "Uniquement par les fossiles", "Uniquement par le vaccin", "Elle ne se transmet jamais"]', 0,
   'Les maladies infectieuses se transmettent par l''air, le contact, l''eau ou les aliments.', 9),
  ('11710000-0000-4000-8000-000000000410'::uuid, 'Santé et responsabilité',
   'Prendre des antibiotiques sans raison favorise l''apparition de résistances.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un usage abusif des antibiotiques favorise l''apparition de bactéries résistantes.', 10),

  -- Chapitre 5 — Les risques géologiques
  ('11710000-0000-4000-8000-000000000504'::uuid, 'Les risques géologiques',
   'Quelle est la cause d''un séisme ?', 'mcq',
   '["La rupture brutale des roches le long d''une faille", "Une coulée de lave", "Un fort vent", "La pluie"]', 0,
   'Un séisme provient de la rupture brutale des roches en profondeur, le long d''une faille.', 4),
  ('11710000-0000-4000-8000-000000000505'::uuid, 'Les risques géologiques',
   'Comment appelle-t-on le point à la surface situé juste au-dessus du foyer ?', 'mcq',
   '["L''épicentre", "La magnitude", "Le cratère", "La faille"]', 0,
   'L''épicentre est le point de la surface situé à la verticale du foyer.', 5),
  ('11710000-0000-4000-8000-000000000506'::uuid, 'Les risques géologiques',
   'Une éruption effusive produit surtout des coulées de lave fluide.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une éruption effusive émet des coulées de lave fluide (volcan rouge).', 6),
  ('11710000-0000-4000-8000-000000000507'::uuid, 'Les risques géologiques',
   'Que rejette un volcan lors d''une éruption ?', 'mcq',
   '["Du magma", "De l''eau potable", "Des anticorps", "Des fossiles"]', 0,
   'Un volcan rejette du magma venu des profondeurs de la Terre.', 7),
  ('11710000-0000-4000-8000-000000000508'::uuid, 'Les risques géologiques',
   'Que signifie « risque » en géologie ?', 'mcq',
   '["L''aléa combiné à la présence d''une population", "La hauteur d''un volcan", "La couleur de la lave", "Le nombre de failles"]', 0,
   'Le risque associe l''aléa (probabilité du phénomène) à la présence d''une population exposée.', 8),
  ('11710000-0000-4000-8000-000000000509'::uuid, 'Les risques géologiques',
   'Séismes et volcans sont répartis au hasard sur la Terre.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : ils se concentrent surtout aux frontières des plaques (ex. la ceinture de feu).', 9),
  ('11710000-0000-4000-8000-000000000510'::uuid, 'Les risques géologiques',
   'Quel moyen permet de réduire le risque sismique dans une ville ?', 'mcq',
   '["Construire des bâtiments parasismiques", "Interdire les fossiles", "Supprimer les vaccins", "Ignorer les consignes"]', 0,
   'Les constructions parasismiques, la surveillance et l''information réduisent le risque.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'svt'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BREVET — lessons.content de « Exercices types » (position 2)
--    2 exercices par chapitre (exploitation de document/graphique décrit +
--    questions a) b) c), raisonnement) suivis de leur « ### Correction ».
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Le programme génétique', $md$# Exercices type brevet — Le programme génétique

## Exercice 1 — Lire un caryotype
On te présente le **caryotype** d'une personne. Sur le document, on observe des chromosomes rangés par paires : les paires 1 à 22 comportent bien **deux** chromosomes chacune, mais la **paire 21** en comporte **trois**. La dernière paire montre un chromosome X et un chromosome Y.

**a)** Combien de chromosomes cette personne possède-t-elle en tout ?
**b)** Quel est le sexe de cette personne ? Justifie.
**c)** Cette personne présente une trisomie 21. Explique, à partir du document, ce que signifie ce terme.

### Correction
**a)** Un caryotype humain normal compte 46 chromosomes. Ici, il y a un chromosome de plus sur la paire 21, donc **47 chromosomes** au total.
**b)** La dernière paire est **XY** : c'est le caryotype d'un **garçon** (une fille aurait XX).
**c)** « Trisomie 21 » signifie qu'il y a **trois** chromosomes 21 au lieu de deux. Le document le montre directement : la paire 21 porte trois chromosomes, d'où un total de 47.

## Exercice 2 — Gènes et allèles du groupe sanguin
Le groupe sanguin est déterminé par un **gène** qui existe sous trois **allèles** : A, B et O. Chaque personne possède deux allèles de ce gène (un de chaque parent). Un couple a le groupe sanguin suivant : la mère est A, le père est B, et leur enfant est de groupe O.

**a)** Rappelle la différence entre un gène et un allèle.
**b)** Pourquoi une personne possède-t-elle deux allèles pour ce gène ?
**c)** En raisonnant, explique comment l'enfant peut être O alors que ses parents sont A et B.

### Correction
**a)** Un **gène** est une portion d'ADN qui code un caractère (ici le groupe sanguin) ; un **allèle** est une **version** de ce gène (A, B ou O).
**b)** On reçoit un allèle de la mère et un allèle du père : chaque personne possède donc **deux** allèles pour un même gène.
**c)** La mère de groupe A peut porter les allèles A et O ; le père de groupe B peut porter B et O. Si la mère transmet son allèle **O** et le père son allèle **O**, l'enfant reçoit **O + O** et est donc de groupe **O**. Le raisonnement montre qu'un allèle peut être présent sans se voir chez le parent.$md$),

    ('L''évolution des espèces', $md$# Exercices type brevet — L'évolution des espèces

## Exercice 1 — Exploiter des fossiles de chevaux
Un document présente trois fossiles de chevaux d'âges différents. Le plus ancien (55 millions d'années) est un petit animal de la taille d'un chien avec **plusieurs doigts** par patte. Un fossile intermédiaire (25 millions d'années) est plus grand, avec **trois doigts**. Le cheval actuel est grand et repose sur **un seul doigt** (le sabot).

**a)** Que montre l'évolution de la taille et du nombre de doigts au cours du temps ?
**b)** Comment les fossiles permettent-ils d'étudier l'évolution ?
**c)** Ces trois animaux sont-ils la même espèce ? Justifie.

### Correction
**a)** Au cours du temps, la taille du cheval **augmente** et le nombre de doigts **diminue** (de plusieurs doigts à un seul). Cela montre que l'espèce s'est **transformée** progressivement.
**b)** Les fossiles conservent la trace d'êtres vivants du passé dans les roches ; en les datant et en les comparant, on reconstitue les **transformations** au fil du temps.
**c)** Non : ce sont des espèces **différentes** mais **apparentées**, se succédant dans le temps. Elles descendent d'ancêtres communs et illustrent l'évolution du groupe des chevaux.

## Exercice 2 — Sélection naturelle chez des papillons
Dans une forêt, un papillon existe en deux formes : **claire** et **sombre**. Un document donne les résultats avant et après la pollution des arbres (troncs devenus foncés). Avant : 90 % de papillons clairs. Après plusieurs années de pollution : 85 % de papillons sombres. Les oiseaux repèrent et mangent plus facilement les papillons qui contrastent avec le tronc.

**a)** Décris comment évolue la proportion des deux formes.
**b)** Explique, par la sélection naturelle, pourquoi les papillons sombres deviennent majoritaires.
**c)** Quel serait l'effet si la pollution disparaissait et que les troncs redevenaient clairs ?

### Correction
**a)** La forme claire, d'abord largement majoritaire (90 %), devient **minoritaire**, tandis que la forme sombre passe de rare à **majoritaire** (85 %).
**b)** Sur les troncs foncés, les papillons sombres sont **mieux camouflés** : ils sont moins mangés par les oiseaux, survivent davantage et se **reproduisent** plus. Ils transmettent leur caractère « sombre » : au fil des générations, cette forme devient majoritaire. C'est la **sélection naturelle**.
**c)** Sur des troncs redevenus clairs, ce sont les papillons **clairs** qui seraient mieux camouflés : ils seraient à nouveau favorisés et redeviendraient progressivement majoritaires.$md$),

    ('Le système immunitaire', $md$# Exercices type brevet — Le système immunitaire

## Exercice 1 — Interpréter un dosage d'anticorps
Après une infection, on mesure la quantité d'**anticorps** dans le sang d'une personne. Un graphique décrit la situation : lors du **premier** contact avec le microbe, les anticorps apparaissent **lentement** (au bout de plusieurs jours) et en petite quantité. Lors d'un **second** contact avec le même microbe, les anticorps apparaissent **plus vite** et en **plus grande** quantité.

**a)** Décris l'évolution de la quantité d'anticorps entre le premier et le second contact.
**b)** Qu'est-ce qu'un anticorps et quel est son rôle ?
**c)** Explique l'intérêt de la vaccination à partir de ce document.

### Correction
**a)** Au premier contact, la réponse est **lente** et **faible** ; au second contact avec le même microbe, elle est **plus rapide** et **plus forte**. Le corps a gardé une **mémoire**.
**b)** Un anticorps est une molécule produite par les **lymphocytes**. Il se fixe **spécifiquement** sur un antigène (le microbe) pour le neutraliser.
**c)** La vaccination introduit un antigène **inoffensif** : le corps réagit une première fois et garde une mémoire. Lors d'une vraie infection, la réponse est alors **rapide et forte**, comme au second contact : la personne est **protégée** avant de tomber malade.

## Exercice 2 — Observer une phagocytose
Un document présente une suite de photos prises au microscope. Sur la première, une cellule du sang (un **phagocyte**) s'approche d'une **bactérie**. Sur la deuxième, le phagocyte entoure la bactérie. Sur la troisième, la bactérie se trouve à l'intérieur du phagocyte et est en train d'être détruite.

**a)** Nomme le phénomène représenté par cette suite de photos.
**b)** Range les étapes dans l'ordre et décris ce qui se passe.
**c)** La phagocytose est-elle une défense rapide ou lente ? Quel est son intérêt ?

### Correction
**a)** Il s'agit de la **phagocytose**.
**b)** Étape 1 : le phagocyte **détecte** et s'approche de la bactérie. Étape 2 : il l'**entoure** et l'absorbe. Étape 3 : la bactérie, à l'intérieur, est **digérée** et détruite.
**c)** La phagocytose est une défense **rapide**, qui se met en place dès l'entrée du microbe. Son intérêt est d'éliminer immédiatement de nombreux micro-organismes, souvent avant même l'apparition de symptômes.$md$),

    ('Santé et responsabilité', $md$# Exercices type brevet — Santé et responsabilité

## Exercice 1 — Antibiotiques : bien les utiliser
Un document de santé publique indique : « Les antibiotiques guérissent les infections dues à des **bactéries**. Ils sont **inefficaces** contre les **virus** (rhume, grippe…). Un usage trop fréquent favorise l'apparition de bactéries **résistantes**, contre lesquelles les antibiotiques ne marchent plus. »

**a)** Contre quel type de micro-organisme un antibiotique est-il efficace ?
**b)** Un médecin refuse de prescrire un antibiotique pour une grippe. Explique pourquoi ce choix est justifié.
**c)** Quel risque fait courir un usage abusif des antibiotiques ?

### Correction
**a)** Un antibiotique est efficace contre les **bactéries**.
**b)** La grippe est causée par un **virus**. Or les antibiotiques sont **inefficaces** contre les virus : en prescrire ne guérirait pas la grippe et serait inutile. Le médecin fait donc un choix **responsable**.
**c)** Un usage abusif favorise l'apparition de **bactéries résistantes** : les antibiotiques deviennent inefficaces, ce qui rend les futures infections plus difficiles à soigner.

## Exercice 2 — Hygiène et transmission des maladies
Une étude compare deux groupes d'élèves sur une année. Le groupe A se lave systématiquement les mains avant les repas et après le passage aux toilettes ; le groupe B ne le fait pas régulièrement. Résultats du document : le groupe A a eu **2 fois moins** d'infections digestives que le groupe B.

**a)** Cite deux modes de transmission d'une maladie infectieuse.
**b)** Que montre la comparaison entre les deux groupes ?
**c)** Propose un raisonnement expliquant pourquoi le lavage des mains réduit les infections.

### Correction
**a)** Une maladie peut se transmettre par l'**eau** ou les **aliments** souillés, par **contact** direct, ou par l'**air** (postillons). (Deux réponses attendues.)
**b)** Le groupe qui se lave les mains a **deux fois moins** d'infections : le lavage des mains **réduit** nettement les contaminations.
**c)** Les mains transportent des micro-organismes (après les toilettes, en touchant des objets). En se lavant les mains, on **élimine** ces microbes avant qu'ils n'atteignent la bouche ou les aliments : la **porte d'entrée** est fermée, donc il y a moins d'infections.$md$),

    ('Les risques géologiques', $md$# Exercices type brevet — Les risques géologiques

## Exercice 1 — Aléa, risque et prévention
Deux régions sont comparées dans un document. La région A subit de **fréquents séismes** mais elle est **désertique** (presque personne n'y habite). La région B subit des séismes **un peu moins fréquents**, mais elle abrite une **grande ville** très peuplée aux constructions anciennes.

**a)** Définis les mots « aléa » et « risque ».
**b)** Dans quelle région le risque sismique est-il le plus élevé ? Justifie par un raisonnement.
**c)** Propose deux mesures de prévention adaptées à la région la plus exposée.

### Correction
**a)** L'**aléa** est la **probabilité** qu'un phénomène (ici un séisme) se produise à un endroit. Le **risque** est l'aléa **combiné à la présence d'une population** exposée.
**b)** C'est la région **B**. Même si son aléa est un peu plus faible, elle est **très peuplée** avec des bâtiments fragiles : beaucoup de personnes et de biens sont exposés. Or risque = aléa + population exposée, donc le risque y est le plus **élevé**. En région A, un fort aléa dans un désert vide donne peu de risque.
**c)** Construire ou renforcer des bâtiments **parasismiques** ; **informer** et préparer la population (consignes, exercices d'évacuation). On peut aussi ajouter la surveillance et des plans de secours.

## Exercice 2 — Lire un enregistrement de séisme
Un **sismographe** enregistre les vibrations du sol. Le document présente un tracé plat (le sol est calme), puis de **grandes oscillations** au moment du séisme, puis un retour au calme. Un texte précise que le foyer était situé à 10 km de profondeur et que la magnitude mesurée était de 6.

**a)** Qu'enregistre un sismographe et que représentent les grandes oscillations ?
**b)** Distingue le foyer et l'épicentre d'un séisme.
**c)** Explique à quoi sert la mesure de la magnitude.

### Correction
**a)** Un sismographe enregistre les **vibrations (ondes sismiques)** du sol. Les grandes oscillations correspondent au **passage des ondes** produites par le séisme : plus elles sont amples, plus la secousse est forte.
**b)** Le **foyer** est le lieu de la rupture des roches en **profondeur** (ici à 10 km). L'**épicentre** est le point de la **surface** situé juste au-dessus du foyer.
**c)** La **magnitude** mesure l'**énergie libérée** par le séisme. Elle permet de **comparer** les séismes entre eux et d'évaluer leur puissance (ici une magnitude de 6 correspond à un séisme important).$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'svt'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
