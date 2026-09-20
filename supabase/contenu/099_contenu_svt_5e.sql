-- =============================================================================
-- Studuel — Migration 099 : CONTENU SVT 5e (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de SVT 5e (programme cycle 4, Éduscol) :
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
    ('La nutrition des êtres vivants', $md$# La nutrition des êtres vivants

## Ce que tu vas comprendre
Pour vivre, grandir et bouger, ton corps a besoin de **matière** et d'**énergie**. Il les trouve dans les **aliments**. Ce chapitre t'explique le voyage des aliments dans le **tube digestif**, comment ils sont transformés en **nutriments**, puis comment ces nutriments passent dans le sang pour nourrir tout le corps.

## 1. Aliments et nutriments
Un **aliment** (une pomme, du pain) est trop gros et trop complexe pour entrer directement dans nos cellules. La **digestion** le transforme en petites molécules simples appelées **nutriments** (sucres, acides aminés, lipides). Ce sont eux qui nourrissent réellement l'organisme.

*Exemple : le pain contient de l'amidon, qui est peu à peu transformé en glucose, un nutriment.*

## 2. L'appareil digestif
Les aliments suivent un long chemin, le **tube digestif** :
**bouche → œsophage → estomac → intestin grêle → gros intestin → anus**.

À ce tube sont reliées des **glandes digestives** (glandes salivaires, foie, pancréas) qui déversent des **sucs digestifs**.

## 3. La transformation des aliments
La digestion combine deux actions :
- une action **mécanique** : les dents **mastiquent**, l'estomac **brasse** ;
- une action **chimique** : les **sucs digestifs** contiennent des **enzymes** qui découpent les gros aliments en nutriments.

> **À retenir :** la digestion commence dès la **bouche** (salive + mastication).

## 4. L'absorption intestinale
Les nutriments obtenus traversent la **paroi de l'intestin grêle** pour rejoindre le **sang** : c'est l'**absorption**. La paroi de l'intestin grêle est très **repliée** et très **irriguée** par de nombreux petits vaisseaux, ce qui offre une **grande surface** d'échange.

*Ce qui n'est pas absorbé (les fibres, les déchets) forme les excréments, éliminés par l'anus.*

## 5. La distribution par le sang
Une fois dans le **sang**, les nutriments sont transportés jusqu'à **toutes les cellules** du corps. Chaque cellule les utilise pour se **construire** (grandir, se réparer) et pour produire de l'**énergie**.

## L'essentiel à retenir
- La **digestion** transforme les **aliments** en **nutriments** (petites molécules simples).
- Trajet : **bouche → œsophage → estomac → intestin grêle → gros intestin → anus**.
- Deux actions : **mécanique** (mastication, brassage) et **chimique** (enzymes des sucs digestifs).
- Les nutriments passent dans le **sang** par la paroi de l'**intestin grêle** (absorption), puis nourrissent **toutes les cellules**.$md$),

    ('La respiration en milieux variés', $md$# La respiration en milieux variés

## Ce que tu vas comprendre
Presque tous les êtres vivants **respirent** : ils prélèvent du **dioxygène** dans leur milieu et rejettent du **dioxyde de carbone**. Ce chapitre te montre que la respiration existe partout — dans l'air comme dans l'eau — mais que les **organes** utilisés changent selon le **milieu de vie**.

## 1. Respirer, c'est échanger des gaz
**Respirer** = absorber du **dioxygène (O₂)** et rejeter du **dioxyde de carbone (CO₂)**. Ces échanges de gaz permettent aux cellules de produire l'**énergie** dont elles ont besoin pour fonctionner.

## 2. Le dioxygène : dans l'air et dans l'eau
- L'**air** contient environ **21 % de dioxygène**.
- L'**eau** contient aussi du dioxygène, mais **dissous** et en **bien plus faible quantité** que l'air.

*C'est pourquoi les animaux aquatiques doivent faire circuler beaucoup d'eau sur leurs organes respiratoires.*

## 3. Des organes respiratoires adaptés au milieu
| Milieu | Organe respiratoire | Exemple |
|---|---|---|
| Air (terrestre) | **Poumons** | Homme, chien, oiseau |
| Air | **Trachées** | Insectes (criquet) |
| Eau | **Branchies** | Poisson, moule |

Chez le **poisson**, l'eau entre par la **bouche**, passe sur les **branchies** (où le dioxygène est prélevé), puis ressort par les **ouïes**.

## 4. Une même fonction, des surfaces d'échange communes
Malgré leur diversité, tous ces organes se ressemblent : ils offrent une **grande surface**, une **paroi fine** et sont **très irrigués** de sang. Ces trois caractéristiques facilitent le passage du dioxygène vers le sang.

## 5. Respiration et occupation des milieux
Le **type de respiration** explique où un animal peut vivre. Certains animaux changent de milieu : la **larve** de la libellule respire dans l'eau (branchies), l'**adulte** respire dans l'air (trachées). Un animal peut aussi remonter respirer : la **baleine** a des poumons et doit revenir à la surface.

## L'essentiel à retenir
- **Respirer** = absorber du **dioxygène (O₂)** et rejeter du **dioxyde de carbone (CO₂)**.
- Le dioxygène existe dans l'air (**21 %**) et, en plus faible quantité, **dissous dans l'eau**.
- Organes selon le milieu : **poumons** (air), **trachées** (insectes), **branchies** (eau).
- Tous les organes respiratoires ont une **grande surface**, une **paroi fine** et sont **bien irrigués**.$md$),

    ('Géologie externe : les paysages', $md$# Géologie externe : les paysages

## Ce que tu vas comprendre
Un **paysage** n'est jamais figé : il se transforme lentement sous l'action de l'**eau**, du **vent**, du **gel** et du vivant. Ce chapitre t'explique comment les roches sont **usées**, comment les débris sont **transportés** puis **déposés**, et comment tout cela finit par former de **nouvelles roches**.

## 1. L'érosion : user les roches
L'**érosion** est l'usure des roches à la surface de la Terre. Ses agents principaux sont :
- l'**eau** (pluie, rivières, mer) ;
- le **gel** : l'eau qui gèle dans les fissures les fait éclater ;
- le **vent** et les **êtres vivants** (racines).

*Résultat : les roches se cassent en morceaux de plus en plus petits, appelés **sédiments** (galets, sable, argile).*

## 2. Le transport des débris
Les sédiments sont ensuite **transportés**, surtout par les **cours d'eau**. Plus l'eau va **vite**, plus elle peut emporter de **gros** morceaux.
- Un torrent rapide roule des **galets**.
- Un fleuve lent ne transporte que du **sable** et de l'**argile**.

## 3. La sédimentation : le dépôt
Quand l'eau **ralentit** (dans un lac, à l'embouchure d'un fleuve, en mer), elle n'a plus la force de porter les sédiments : ils se **déposent**. C'est la **sédimentation**. Les débris s'entassent en **couches** horizontales appelées **strates**.

> **À retenir :** les plus gros débris se déposent en premier, les plus fins (argile) beaucoup plus loin.

## 4. Des sédiments aux roches
Au fil du temps, les couches s'**accumulent**, se **tassent** et se **cimentent** : les sédiments se transforment en **roches sédimentaires**.
- Le sable donne le **grès**.
- La vase calcaire donne le **calcaire**.
- L'argile donne l'**argilite**.

## 5. Roches et paysages
La nature des roches façonne le paysage : une roche **dure** (granite, calcaire) forme des **reliefs** et des falaises, tandis qu'une roche **tendre** (argile) donne des **plaines**. En observant les roches, on lit l'**histoire** du paysage.

## L'essentiel à retenir
- L'**érosion** (eau, gel, vent) **use** les roches et produit des **sédiments**.
- Les sédiments sont **transportés** par l'eau : plus le courant est rapide, plus les débris sont gros.
- Quand l'eau **ralentit**, les sédiments se **déposent** en **couches (strates)** : c'est la **sédimentation**.
- Tassés et cimentés, les sédiments deviennent des **roches sédimentaires** (grès, calcaire, argilite).$md$),

    ('La reproduction sexuée', $md$# La reproduction sexuée

## Ce que tu vas comprendre
Pour qu'une espèce ne disparaisse pas, les êtres vivants doivent se **reproduire**. Ce chapitre étudie la **reproduction sexuée** : la rencontre de deux cellules spéciales qui donne naissance à un nouvel individu, chez les **animaux** comme chez les **plantes à fleurs**.

## 1. Les cellules reproductrices
La reproduction sexuée fait intervenir deux **cellules reproductrices** (ou gamètes) :
- une cellule **mâle**, le **spermatozoïde** ;
- une cellule **femelle**, l'**ovule**.

L'**ovule** est une grosse cellule immobile ; le **spermatozoïde** est une petite cellule **mobile** (il possède un flagelle).

## 2. La fécondation
La **fécondation** est la **rencontre** et l'**union** d'un spermatozoïde et d'un ovule. Elle donne une **cellule-œuf**, première cellule du nouvel individu.

> **À retenir :** un seul spermatozoïde féconde un ovule → **une** cellule-œuf.

## 3. Fécondation externe ou interne
Le lieu de la fécondation dépend du **milieu de vie** :
- **Fécondation externe** : les gamètes sont libérés dans l'**eau**, où ils se rencontrent (poissons, grenouilles).
- **Fécondation interne** : les gamètes se rencontrent à l'**intérieur** du corps de la femelle (oiseaux, mammifères, insectes).

*Les animaux terrestres pratiquent une fécondation interne, car les gamètes ne survivraient pas à l'air libre.*

## 4. La reproduction sexuée des plantes à fleurs
Chez les plantes à fleurs, la **fleur** est l'organe reproducteur :
- les **étamines** produisent le **pollen** (cellules mâles) ;
- le **pistil** contient les **ovules** (cellules femelles).

La **pollinisation** (transport du pollen par le **vent** ou les **insectes**) permet la fécondation. L'ovule fécondé devient une **graine**, et le pistil se transforme en **fruit**.

## 5. De la cellule-œuf au nouvel individu
La cellule-œuf se **divise** de nombreuses fois et se développe : elle donne un **embryon**, puis un jeune individu qui ressemble à ses parents. Ainsi, la reproduction sexuée assure la **survie de l'espèce**.

## L'essentiel à retenir
- La reproduction sexuée unit deux **cellules reproductrices** : **spermatozoïde** (mâle) et **ovule** (femelle).
- La **fécondation** (leur union) forme une **cellule-œuf**, à l'origine du nouvel individu.
- Fécondation **externe** (dans l'eau) ou **interne** (dans le corps), selon le **milieu de vie**.
- Chez les plantes à fleurs : **pollen** (étamines) + **ovule** (pistil) → graine et fruit après **pollinisation**.$md$),

    ('Les besoins de l''organisme', $md$# Les besoins de l'organisme

## Ce que tu vas comprendre
Ton corps est comme un moteur : il a besoin de **carburant** (les aliments) et de **comburant** (le dioxygène) pour fonctionner. Ce chapitre explique les **besoins** de l'organisme, comment ils **augmentent à l'effort**, et comment le **sang** et le **cœur** apportent tout cela aux muscles.

## 1. Les besoins des organes
Pour fonctionner, chaque organe a besoin en permanence de deux choses apportées par le **sang** :
- des **nutriments** (issus de la digestion) ;
- du **dioxygène** (issu de la respiration).

Il libère aussi des **déchets** (comme le **dioxyde de carbone**) que le sang emporte.

## 2. Produire de l'énergie
Dans les cellules, les **nutriments** réagissent avec le **dioxygène** pour libérer de l'**énergie**. Cette réaction produit aussi du **dioxyde de carbone**. C'est cette énergie qui permet de bouger, de maintenir la température du corps et de faire vivre les organes.

## 3. Des besoins qui varient : l'effort
Quand tu fais un **effort** (course, sport), tes muscles travaillent plus : ils consomment **davantage** de nutriments et de dioxygène. Le corps s'adapte :
- la **respiration** s'accélère (tu respires plus vite et plus fort) ;
- le **rythme cardiaque** augmente (le cœur bat plus vite).

*Exemple : au repos, le cœur bat environ 70 fois par minute ; en plein effort, il peut dépasser 150.*

## 4. Le cœur et la circulation
Le **cœur** est un muscle qui joue le rôle d'une **pompe**. Il propulse le **sang** dans les **vaisseaux sanguins** (artères, veines) vers tous les organes. Ce sang apporte les nutriments et le dioxygène, et récupère les déchets. On parle de **circulation sanguine**.

## 5. Une bonne hygiène de vie
Pour couvrir ses besoins et rester en forme, l'organisme a besoin d'une bonne **hygiène de vie** :
- une **alimentation équilibrée** et variée ;
- une **activité physique** régulière ;
- un **sommeil** suffisant, sans tabac ni excès.

## L'essentiel à retenir
- Les organes ont besoin de **nutriments** et de **dioxygène**, apportés par le **sang**.
- Dans les cellules, nutriments + dioxygène → **énergie** + **dioxyde de carbone**.
- À l'**effort**, les besoins augmentent : la **respiration** et le **rythme cardiaque** s'accélèrent.
- Le **cœur** (pompe) fait circuler le sang ; une bonne **hygiène de vie** entretient l'organisme.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'svt'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('La nutrition des êtres vivants', $json${
      "centre": "La nutrition des êtres vivants",
      "branches": [
        { "titre": "Aliments et nutriments", "enfants": ["Aliment = trop gros", "Nutriments = molécules simples", "Amidon → glucose"] },
        { "titre": "Appareil digestif", "enfants": ["Bouche → estomac → intestins", "Glandes : foie, pancréas", "Sucs digestifs"] },
        { "titre": "Transformation", "enfants": ["Mécanique : mastication, brassage", "Chimique : enzymes", "Commence dans la bouche"] },
        { "titre": "Absorption et distribution", "enfants": ["Paroi de l'intestin grêle", "Passage dans le sang", "Nourrit toutes les cellules"] }
      ]
    }$json$),
    ('La respiration en milieux variés', $json${
      "centre": "La respiration en milieux variés",
      "branches": [
        { "titre": "Échanger des gaz", "enfants": ["Absorber du dioxygène (O₂)", "Rejeter du dioxyde de carbone", "Produire de l'énergie"] },
        { "titre": "Le dioxygène", "enfants": ["Air : environ 21 %", "Eau : dissous, peu abondant", "L'air en contient plus"] },
        { "titre": "Organes selon le milieu", "enfants": ["Poumons (air)", "Trachées (insectes)", "Branchies (eau)"] },
        { "titre": "Surfaces d'échange", "enfants": ["Grande surface", "Paroi fine", "Bien irriguées de sang"] }
      ]
    }$json$),
    ('Géologie externe : les paysages', $json${
      "centre": "Géologie externe : les paysages",
      "branches": [
        { "titre": "Érosion", "enfants": ["Eau, gel, vent", "Use les roches", "Produit des sédiments"] },
        { "titre": "Transport", "enfants": ["Surtout par l'eau", "Courant rapide → gros débris", "Torrent : galets"] },
        { "titre": "Sédimentation", "enfants": ["L'eau ralentit → dépôt", "Couches = strates", "Gros débris d'abord"] },
        { "titre": "Des sédiments aux roches", "enfants": ["Tassement et ciment", "Roches sédimentaires", "Sable → grès, vase → calcaire"] }
      ]
    }$json$),
    ('La reproduction sexuée', $json${
      "centre": "La reproduction sexuée",
      "branches": [
        { "titre": "Cellules reproductrices", "enfants": ["Spermatozoïde (mâle, mobile)", "Ovule (femelle, gros)", "Aussi appelés gamètes"] },
        { "titre": "La fécondation", "enfants": ["Union des deux cellules", "Donne une cellule-œuf", "Un seul spermatozoïde"] },
        { "titre": "Externe ou interne", "enfants": ["Externe : dans l'eau", "Interne : dans le corps", "Selon le milieu de vie"] },
        { "titre": "Plantes à fleurs", "enfants": ["Pollen (étamines)", "Ovule (pistil)", "Pollinisation → graine, fruit"] }
      ]
    }$json$),
    ('Les besoins de l''organisme', $json${
      "centre": "Les besoins de l'organisme",
      "branches": [
        { "titre": "Besoins des organes", "enfants": ["Nutriments", "Dioxygène", "Apportés par le sang"] },
        { "titre": "Produire de l'énergie", "enfants": ["Nutriments + dioxygène", "Libère de l'énergie", "Produit du dioxyde de carbone"] },
        { "titre": "L'effort", "enfants": ["Besoins augmentés", "Respiration accélérée", "Cœur plus rapide"] },
        { "titre": "Cœur et hygiène de vie", "enfants": ["Cœur = pompe", "Circulation du sang", "Alimentation, sport, sommeil"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'svt'
 WHERE c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal 036 a déjà créé les quiz SVT collège ; ce bloc ne fait
--     rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'SVT', '5e', v.chapter, true, l.id
FROM (VALUES
  ('09919999-0000-4000-8000-000000000001'::uuid, 'La nutrition des êtres vivants'),
  ('09919999-0000-4000-8000-000000000002'::uuid, 'La respiration en milieux variés'),
  ('09919999-0000-4000-8000-000000000003'::uuid, 'Géologie externe : les paysages'),
  ('09919999-0000-4000-8000-000000000004'::uuid, 'La reproduction sexuée'),
  ('09919999-0000-4000-8000-000000000005'::uuid, 'Les besoins de l''organisme')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'svt'
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
  -- Chapitre 1 — La nutrition des êtres vivants
  ('09910000-0000-4000-8000-000000000104'::uuid, 'La nutrition des êtres vivants',
   'Comment appelle-t-on les petites molécules simples issues de la digestion ?', 'mcq',
   '["Les nutriments", "Les aliments", "Les enzymes", "Les déchets"]', 0,
   'La digestion transforme les aliments en nutriments, seules molécules assez petites pour nourrir les cellules.', 4),
  ('09910000-0000-4000-8000-000000000105'::uuid, 'La nutrition des êtres vivants',
   'Quel est le bon ordre du trajet des aliments ?', 'mcq',
   '["Bouche → estomac → intestin grêle", "Estomac → bouche → intestin", "Bouche → intestin → estomac", "Estomac → intestin → bouche"]', 0,
   'Le tube digestif va de la bouche à l''anus : bouche, œsophage, estomac, intestin grêle, gros intestin.', 5),
  ('09910000-0000-4000-8000-000000000106'::uuid, 'La nutrition des êtres vivants',
   'Dans quel organe les nutriments passent-ils surtout dans le sang ?', 'mcq',
   '["L''intestin grêle", "L''estomac", "La bouche", "Le gros intestin"]', 0,
   'L''absorption a lieu à travers la paroi très repliée et irriguée de l''intestin grêle.', 6),
  ('09910000-0000-4000-8000-000000000107'::uuid, 'La nutrition des êtres vivants',
   'La digestion commence dès la bouche.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La mastication et la salive commencent la digestion dès la bouche.', 7),
  ('09910000-0000-4000-8000-000000000108'::uuid, 'La nutrition des êtres vivants',
   'Que contiennent les sucs digestifs pour découper les aliments ?', 'mcq',
   '["Des enzymes", "Des nutriments", "Du sang", "Des vitamines"]', 0,
   'Les enzymes des sucs digestifs réalisent l''action chimique de la digestion.', 8),
  ('09910000-0000-4000-8000-000000000109'::uuid, 'La nutrition des êtres vivants',
   'Une fois absorbés, les nutriments nourrissent seulement l''estomac.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : transportés par le sang, les nutriments nourrissent toutes les cellules du corps.', 9),
  ('09910000-0000-4000-8000-000000000110'::uuid, 'La nutrition des êtres vivants',
   'La mastication des dents est une action de type : ', 'mcq',
   '["Mécanique", "Chimique", "Sanguine", "Électrique"]', 0,
   'Mâcher est une action mécanique ; les enzymes réalisent l''action chimique.', 10),

  -- Chapitre 2 — La respiration en milieux variés
  ('09910000-0000-4000-8000-000000000204'::uuid, 'La respiration en milieux variés',
   'Quel gaz les êtres vivants absorbent-ils en respirant ?', 'mcq',
   '["Le dioxygène", "Le dioxyde de carbone", "L''azote", "L''hydrogène"]', 0,
   'Respirer, c''est absorber du dioxygène (O₂) et rejeter du dioxyde de carbone (CO₂).', 4),
  ('09910000-0000-4000-8000-000000000205'::uuid, 'La respiration en milieux variés',
   'Avec quel organe un poisson respire-t-il ?', 'mcq',
   '["Des branchies", "Des poumons", "Des trachées", "Sa peau seule"]', 0,
   'Le poisson prélève le dioxygène dissous dans l''eau grâce à ses branchies.', 5),
  ('09910000-0000-4000-8000-000000000206'::uuid, 'La respiration en milieux variés',
   'L''air contient environ quel pourcentage de dioxygène ?', 'mcq',
   '["21 %", "50 %", "78 %", "5 %"]', 0,
   'L''air contient environ 21 % de dioxygène (et surtout de l''azote).', 6),
  ('09910000-0000-4000-8000-000000000207'::uuid, 'La respiration en milieux variés',
   'L''eau contient plus de dioxygène que l''air.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le dioxygène est dissous dans l''eau en bien plus faible quantité que dans l''air.', 7),
  ('09910000-0000-4000-8000-000000000208'::uuid, 'La respiration en milieux variés',
   'Avec quel organe respirent les insectes comme le criquet ?', 'mcq',
   '["Des trachées", "Des branchies", "Des poumons", "Des nageoires"]', 0,
   'Les insectes respirent l''air grâce à un réseau de trachées.', 8),
  ('09910000-0000-4000-8000-000000000209'::uuid, 'La respiration en milieux variés',
   'Les organes respiratoires ont une paroi fine et sont bien irrigués.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Grande surface, paroi fine et forte irrigation facilitent le passage du dioxygène vers le sang.', 9),
  ('09910000-0000-4000-8000-000000000210'::uuid, 'La respiration en milieux variés',
   'Quel gaz est rejeté lors de la respiration ?', 'mcq',
   '["Le dioxyde de carbone", "Le dioxygène", "La vapeur d''eau seule", "L''ozone"]', 0,
   'La respiration rejette du dioxyde de carbone (CO₂).', 10),

  -- Chapitre 3 — Géologie externe : les paysages
  ('09910000-0000-4000-8000-000000000304'::uuid, 'Géologie externe : les paysages',
   'Comment appelle-t-on l''usure des roches par l''eau, le gel ou le vent ?', 'mcq',
   '["L''érosion", "La sédimentation", "Le transport", "La fécondation"]', 0,
   'L''érosion est l''usure des roches à la surface de la Terre.', 4),
  ('09910000-0000-4000-8000-000000000305'::uuid, 'Géologie externe : les paysages',
   'Qui transporte le plus souvent les sédiments ?', 'mcq',
   '["L''eau (cours d''eau)", "Le Soleil", "Les nuages seuls", "Les racines"]', 0,
   'Les cours d''eau sont les principaux agents de transport des sédiments.', 5),
  ('09910000-0000-4000-8000-000000000306'::uuid, 'Géologie externe : les paysages',
   'Que se passe-t-il quand le courant de l''eau ralentit ?', 'mcq',
   '["Les sédiments se déposent", "Les sédiments s''évaporent", "Les roches fondent", "Rien ne change"]', 0,
   'Quand l''eau ralentit, elle ne peut plus porter les sédiments : ils se déposent (sédimentation).', 6),
  ('09910000-0000-4000-8000-000000000307'::uuid, 'Géologie externe : les paysages',
   'Les couches successives de sédiments s''appellent des strates.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les sédiments s''entassent en couches horizontales appelées strates.', 7),
  ('09910000-0000-4000-8000-000000000308'::uuid, 'Géologie externe : les paysages',
   'Un courant rapide transporte plutôt : ', 'mcq',
   '["De gros débris (galets)", "Seulement de l''argile", "Rien du tout", "De la vapeur"]', 0,
   'Plus le courant est rapide, plus il peut emporter de gros débris comme les galets.', 8),
  ('09910000-0000-4000-8000-000000000309'::uuid, 'Géologie externe : les paysages',
   'En se tassant et se cimentant, le sable donne quelle roche ?', 'mcq',
   '["Le grès", "Le granite", "Le sel", "Le charbon"]', 0,
   'Le sable, tassé et cimenté, forme une roche sédimentaire : le grès.', 9),
  ('09910000-0000-4000-8000-000000000310'::uuid, 'Géologie externe : les paysages',
   'Le gel de l''eau dans les fissures peut faire éclater les roches.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'En gelant, l''eau augmente de volume et fait éclater les roches : c''est un agent d''érosion.', 10),

  -- Chapitre 4 — La reproduction sexuée
  ('09910000-0000-4000-8000-000000000404'::uuid, 'La reproduction sexuée',
   'Comment s''appelle la cellule reproductrice mâle ?', 'mcq',
   '["Le spermatozoïde", "L''ovule", "La cellule-œuf", "Le pistil"]', 0,
   'La cellule mâle est le spermatozoïde ; la cellule femelle est l''ovule.', 4),
  ('09910000-0000-4000-8000-000000000405'::uuid, 'La reproduction sexuée',
   'Qu''obtient-on après la fécondation d''un ovule par un spermatozoïde ?', 'mcq',
   '["Une cellule-œuf", "Deux ovules", "Une graine", "Un fruit"]', 0,
   'La fécondation (union des deux cellules) donne une cellule-œuf, première cellule du nouvel individu.', 5),
  ('09910000-0000-4000-8000-000000000406'::uuid, 'La reproduction sexuée',
   'Les poissons pratiquent le plus souvent une fécondation : ', 'mcq',
   '["Externe (dans l''eau)", "Interne", "Sans gamètes", "Par le vent"]', 0,
   'Dans l''eau, les gamètes sont libérés et se rencontrent à l''extérieur : fécondation externe.', 6),
  ('09910000-0000-4000-8000-000000000407'::uuid, 'La reproduction sexuée',
   'Chez la plante à fleurs, le pollen est produit par les étamines.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les étamines produisent le pollen (cellules mâles) ; le pistil contient les ovules.', 7),
  ('09910000-0000-4000-8000-000000000408'::uuid, 'La reproduction sexuée',
   'Après fécondation chez une plante à fleurs, l''ovule devient : ', 'mcq',
   '["Une graine", "Une étamine", "Un pollen", "Une racine"]', 0,
   'L''ovule fécondé devient une graine, et le pistil se transforme en fruit.', 8),
  ('09910000-0000-4000-8000-000000000409'::uuid, 'La reproduction sexuée',
   'Le transport du pollen par le vent ou les insectes s''appelle : ', 'mcq',
   '["La pollinisation", "La sédimentation", "La digestion", "La respiration"]', 0,
   'La pollinisation amène le pollen jusqu''au pistil et permet la fécondation.', 9),
  ('09910000-0000-4000-8000-000000000410'::uuid, 'La reproduction sexuée',
   'Le spermatozoïde est une cellule mobile.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le spermatozoïde possède un flagelle qui le rend mobile ; l''ovule, lui, est immobile.', 10),

  -- Chapitre 5 — Les besoins de l'organisme
  ('09910000-0000-4000-8000-000000000504'::uuid, 'Les besoins de l''organisme',
   'De quoi les organes ont-ils besoin en permanence, apporté par le sang ?', 'mcq',
   '["De nutriments et de dioxygène", "De dioxyde de carbone", "De déchets", "De sel seulement"]', 0,
   'Le sang apporte aux organes les nutriments et le dioxygène nécessaires à leur fonctionnement.', 4),
  ('09910000-0000-4000-8000-000000000505'::uuid, 'Les besoins de l''organisme',
   'Dans les cellules, nutriments et dioxygène servent à produire : ', 'mcq',
   '["De l''énergie", "Des aliments", "des roches", "du pollen"]', 0,
   'La réaction des nutriments avec le dioxygène libère l''énergie et produit du dioxyde de carbone.', 5),
  ('09910000-0000-4000-8000-000000000506'::uuid, 'Les besoins de l''organisme',
   'Pendant un effort, le rythme cardiaque augmente.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'À l''effort, les muscles consomment plus : le cœur bat plus vite et la respiration s''accélère.', 6),
  ('09910000-0000-4000-8000-000000000507'::uuid, 'Les besoins de l''organisme',
   'Quel organe joue le rôle de pompe pour faire circuler le sang ?', 'mcq',
   '["Le cœur", "Le poumon", "L''estomac", "Le foie"]', 0,
   'Le cœur est un muscle qui propulse le sang dans les vaisseaux : c''est une pompe.', 7),
  ('09910000-0000-4000-8000-000000000508'::uuid, 'Les besoins de l''organisme',
   'Quel déchet gazeux est produit par les cellules et emporté par le sang ?', 'mcq',
   '["Le dioxyde de carbone", "Le dioxygène", "L''azote", "Le glucose"]', 0,
   'La production d''énergie dégage du dioxyde de carbone, transporté par le sang puis rejeté.', 8),
  ('09910000-0000-4000-8000-000000000509'::uuid, 'Les besoins de l''organisme',
   'Une bonne hygiène de vie repose sur alimentation équilibrée, sport et sommeil.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Alimentation variée, activité physique régulière et sommeil suffisant entretiennent l''organisme.', 9),
  ('09910000-0000-4000-8000-000000000510'::uuid, 'Les besoins de l''organisme',
   'Pendant un effort, les besoins des muscles en dioxygène : ', 'mcq',
   '["Augmentent", "Diminuent", "Disparaissent", "Ne changent pas"]', 0,
   'Les muscles qui travaillent consomment davantage de dioxygène et de nutriments.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'svt'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
