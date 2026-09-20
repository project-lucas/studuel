-- =============================================================================
-- Studuel — Migration 137 : CONTENU HGGSP 1re (cours + carte mentale + quiz)
-- Remplit les 4 chapitres de HGGSP 1re (spécialité Histoire-géographie,
-- géopolitique et sciences politiques, programme officiel) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (positions 4→10). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant).
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons pour HGGSP 1re, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('La démocratie : fragilités et évolutions', $md$# La démocratie : fragilités et évolutions

## Ce que tu vas comprendre
La **démocratie** (du grec *dêmos*, le peuple, et *kratos*, le pouvoir) est un régime où le pouvoir appartient au peuple. Ce chapitre montre ses **formes**, sa **naissance** à Athènes, ses **modèles** actuels et les **menaces** qui pèsent sur elle aujourd'hui.

## 1. Démocratie directe et démocratie représentative
- Dans la **démocratie directe**, les citoyens votent eux-mêmes les lois, sans intermédiaire.
- Dans la **démocratie représentative**, ils élisent des **représentants** (députés, président) qui décident en leur nom. C'est le modèle dominant aujourd'hui, imposé par la taille des États modernes.

*Le référendum et, en Suisse, la « votation » sont des survivances de démocratie directe.*

## 2. Athènes, le berceau (Ve siècle av. J.-C.)
La démocratie athénienne est **directe** : les citoyens se réunissent à l'**Ecclésia** pour voter. Mais elle est **restreinte** : seuls les hommes libres nés de parents athéniens sont citoyens. Femmes, esclaves et métèques (étrangers) en sont exclus, soit la grande majorité de la population.

*Périclès en fait l'éloge dans son *Oraison funèbre* rapportée par Thucydide.*

## 3. Les régimes politiques aujourd'hui
On distingue les **démocraties** (élections libres, séparation des pouvoirs, libertés garanties) des **régimes autoritaires** (pouvoir concentré, opposition muselée) et des régimes **totalitaires** (contrôle total de la société). Des organismes comme *Freedom House* ou l'indice *V-Dem* classent les pays sur une échelle de liberté.

## 4. Les fragilités contemporaines
Les démocraties connaissent aujourd'hui plusieurs menaces :
- l'**abstention** et la **défiance** envers les élus ;
- la montée des **populismes** qui opposent « le peuple » aux « élites » ;
- les **reculs démocratiques** (*backsliding*), comme en Hongrie, où un pouvoir élu grignote peu à peu l'État de droit ;
- la **désinformation** qui fausse le débat public.

## L'essentiel à retenir
- Démocratie **directe** (le peuple vote lui-même) vs **représentative** (il élit des représentants).
- **Athènes** (Ve s. av. J.-C.) : première démocratie, directe mais réservée à une minorité de citoyens.
- On oppose démocraties, régimes **autoritaires** et **totalitaires**.
- Fragilités actuelles : abstention, populismes, recul de l'État de droit, désinformation.$md$),

    ('Les frontières dans le monde', $md$# Les frontières dans le monde

## Ce que tu vas comprendre
Une **frontière** est une limite qui sépare deux espaces soumis à des pouvoirs différents. Loin de disparaître, les frontières se **multiplient** et se **transforment**. Ce chapitre étudie leurs types, leurs fonctions et leurs paradoxes à l'heure de la mondialisation.

## 1. Qu'est-ce qu'une frontière ?
La frontière marque la limite de la **souveraineté** d'un État. Elle peut être :
- **naturelle** (fleuve, montagne, comme les Pyrénées) ;
- **artificielle** ou géométrique (tracée en ligne droite, comme beaucoup de frontières africaines héritées de la colonisation).

Une frontière se **délimite** (on la définit par traité) puis se **démarque** (on la matérialise sur le terrain).

## 2. Les fonctions de la frontière
La frontière a plusieurs rôles :
- **séparer** et protéger (défense, contrôle) ;
- **filtrer** les flux (marchandises, migrants) ;
- **relier** : une frontière est aussi un lieu d'échanges, une **interface**.

*Une frontière ouverte et intégrée comme au sein de l'espace **Schengen** favorise la circulation.*

## 3. Des frontières qui se ferment : les murs
Depuis les années 1990, on assiste à une **multiplication des murs** frontaliers (États-Unis / Mexique, Israël / Cisjordanie, Inde / Bangladesh). Ces barrières visent à bloquer migrations, trafics ou menaces perçues. Le paradoxe : le monde se dit « ouvert » mais construit plus de murs que jamais.

## 4. Des espaces sans frontière ?
Certains espaces échappent à la souveraineté d'un seul État :
- la **haute mer**, l'**Antarctique**, l'**espace** sont des biens communs régis par des traités internationaux ;
- le **cyberespace** ignore largement les frontières physiques.

Malgré la **mondialisation** qui semblait devoir effacer les frontières, celles-ci restent un marqueur essentiel du pouvoir et de l'identité.

## L'essentiel à retenir
- La frontière délimite la **souveraineté** d'un État ; elle peut être naturelle ou artificielle.
- Elle **sépare**, **filtre** et **relie** (interface) à la fois.
- Depuis 1990, les **murs** frontaliers se multiplient malgré la mondialisation.
- Certains espaces (haute mer, Antarctique, cyberespace) sont **sans frontière** claire.$md$),

    ('Le pouvoir des médias', $md$# Le pouvoir des médias

## Ce que tu vas comprendre
Les **médias** informent, mais ils **influencent** aussi l'opinion et le pouvoir politique. Ce chapitre étudie la construction de l'**opinion publique**, la **liberté de la presse** et les menaces nouvelles : désinformation et réseaux sociaux.

## 1. Médias et opinion publique
L'**opinion publique** est l'ensemble des jugements partagés par une société sur les affaires publiques. Elle se construit largement à travers les médias (presse, radio, télévision, internet). Les **sondages**, apparus au XXe siècle, prétendent la mesurer, mais peuvent aussi l'orienter.

*L'affaire Dreyfus (fin XIXe s.) montre déjà le rôle de la presse : « J'accuse… ! » de Zola dans *L'Aurore* mobilise l'opinion.*

## 2. La liberté de la presse, un pilier démocratique
La **liberté de la presse** est une condition de la démocratie. En France, la **loi de 1881** la garantit. Un média libre joue un rôle de **contre-pouvoir** : il surveille les gouvernants (rôle de « quatrième pouvoir »). Des organisations comme **Reporters sans frontières** publient un classement mondial de cette liberté.

## 3. Les menaces sur l'information
- La **concentration** des médias entre les mains de quelques grands groupes menace le pluralisme.
- La **désinformation** (*fake news*) diffuse volontairement de fausses informations.
- Les **théories du complot** et les **infox** se propagent vite.

## 4. Les réseaux sociaux : nouveau pouvoir
Les **réseaux sociaux** ont bouleversé l'information : chacun devient émetteur. Ils accélèrent la circulation des nouvelles mais aussi des rumeurs. Les **algorithmes** enferment l'internaute dans des « **bulles de filtres** » qui ne lui montrent que ce qui le conforte. Les grandes plateformes (*GAFAM*) exercent un pouvoir considérable sur ce qui est vu ou censuré.

## L'essentiel à retenir
- L'**opinion publique** se construit via les médias ; les **sondages** cherchent à la mesurer.
- La **liberté de la presse** (loi de 1881) est un **contre-pouvoir** essentiel de la démocratie.
- Menaces : **concentration** des médias, **désinformation**, complotisme.
- Les **réseaux sociaux** et leurs **algorithmes** (bulles de filtres) redistribuent le pouvoir d'informer.$md$),

    ('États et religions', $md$# États et religions

## Ce que tu vas comprendre
Les rapports entre le **pouvoir politique** et les **religions** varient énormément selon les pays et les époques. Ce chapitre compare ces modèles, présente la **laïcité** française et interroge la **sécularisation** des sociétés.

## 1. Des relations très variées
Selon les États, la religion et le pouvoir peuvent être :
- **confondus** : dans une **théocratie**, le pouvoir religieux gouverne (Iran, Vatican) ;
- **liés** : une **religion d'État** est officielle (l'anglicanisme au Royaume-Uni, l'islam dans plusieurs pays) ;
- **séparés** : l'État est **laïque** et neutre en matière religieuse (France).

## 2. La laïcité française
La **laïcité** repose en France sur la **loi de séparation des Églises et de l'État de 1905**. Elle garantit :
- la **liberté de conscience** (croire ou ne pas croire) ;
- l'**égalité** des citoyens quelle que soit leur religion ;
- la **neutralité** de l'État, qui ne finance ni ne privilégie aucun culte.

*La loi de 2004 interdit les signes religieux ostensibles à l'école publique, application de ce principe.*

## 3. Le modèle américain : une autre laïcité
Aux **États-Unis**, le **1er amendement** sépare aussi l'Église et l'État, mais la religion reste très présente dans la vie publique (« *In God We Trust* », serment sur la Bible). C'est une séparation qui **protège** les religions plutôt qu'elle ne les cantonne au privé : un modèle différent du modèle français.

## 4. La sécularisation
La **sécularisation** désigne le recul de l'influence de la religion dans la société. Les pratiques religieuses diminuent dans de nombreux pays occidentaux. Mais ce recul n'est **pas universel** : ailleurs, on observe au contraire un **regain** du religieux, parfois lié à des revendications identitaires ou politiques.

## L'essentiel à retenir
- Trois grands cas : **théocratie** (pouvoir religieux), **religion d'État**, État **laïque**.
- La **laïcité française** (loi de **1905**) : liberté de conscience, égalité, neutralité de l'État.
- Le modèle **américain** sépare aussi mais laisse la religion très visible dans l'espace public.
- La **sécularisation** recule dans le monde occidental, mais le religieux peut aussi connaître un regain.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'hggsp'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('La démocratie : fragilités et évolutions', $json${
      "centre": "La démocratie : fragilités et évolutions",
      "branches": [
        { "titre": "Directe ou représentative", "enfants": ["Directe : le peuple vote les lois", "Représentative : élire des représentants", "Référendum, votation suisse"] },
        { "titre": "Athènes, le berceau", "enfants": ["Ve s. av. J.-C., Ecclésia", "Démocratie directe", "Réservée aux seuls citoyens"] },
        { "titre": "Les régimes", "enfants": ["Démocratie : élections, libertés", "Autoritaire : pouvoir concentré", "Totalitaire : contrôle total"] },
        { "titre": "Fragilités actuelles", "enfants": ["Abstention et défiance", "Montée des populismes", "Recul de l'État de droit, désinformation"] }
      ]
    }$json$),
    ('Les frontières dans le monde', $json${
      "centre": "Les frontières dans le monde",
      "branches": [
        { "titre": "Qu'est-ce qu'une frontière", "enfants": ["Limite de la souveraineté", "Naturelle ou artificielle", "Délimiter puis démarquer"] },
        { "titre": "Ses fonctions", "enfants": ["Séparer et protéger", "Filtrer les flux", "Relier : une interface"] },
        { "titre": "Des murs qui se ferment", "enfants": ["Multiplication depuis 1990", "USA/Mexique, Israël/Cisjordanie", "Paradoxe de la mondialisation"] },
        { "titre": "Espaces sans frontière", "enfants": ["Haute mer, Antarctique", "L'espace, biens communs", "Cyberespace"] }
      ]
    }$json$),
    ('Le pouvoir des médias', $json${
      "centre": "Le pouvoir des médias",
      "branches": [
        { "titre": "Opinion publique", "enfants": ["Jugements partagés", "Construite par les médias", "Mesurée par les sondages"] },
        { "titre": "Liberté de la presse", "enfants": ["Loi de 1881", "Contre-pouvoir démocratique", "Reporters sans frontières"] },
        { "titre": "Menaces", "enfants": ["Concentration des médias", "Désinformation (fake news)", "Théories du complot"] },
        { "titre": "Réseaux sociaux", "enfants": ["Chacun devient émetteur", "Algorithmes, bulles de filtres", "Pouvoir des GAFAM"] }
      ]
    }$json$),
    ('États et religions', $json${
      "centre": "États et religions",
      "branches": [
        { "titre": "Relations variées", "enfants": ["Théocratie : pouvoir religieux", "Religion d'État officielle", "État laïque et neutre"] },
        { "titre": "Laïcité française", "enfants": ["Loi de 1905", "Liberté de conscience, égalité", "Neutralité de l'État"] },
        { "titre": "Modèle américain", "enfants": ["1er amendement", "Religion très visible", "Sépare mais protège les cultes"] },
        { "titre": "Sécularisation", "enfants": ["Recul du religieux en Occident", "Pas universel", "Parfois un regain identitaire"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'hggsp'
 WHERE c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (Ne fait rien si un quiz existe déjà — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'HGGSP', '1re', v.chapter, true, l.id
FROM (VALUES
  ('13719999-0000-4000-8000-000000000001'::uuid, 'La démocratie : fragilités et évolutions'),
  ('13719999-0000-4000-8000-000000000002'::uuid, 'Les frontières dans le monde'),
  ('13719999-0000-4000-8000-000000000003'::uuid, 'Le pouvoir des médias'),
  ('13719999-0000-4000-8000-000000000004'::uuid, 'États et religions')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'hggsp'
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
  -- Chapitre 1 — La démocratie : fragilités et évolutions
  ('13710000-0000-4000-8000-000000000104'::uuid, 'La démocratie : fragilités et évolutions',
   'Que signifie l''étymologie grecque du mot « démocratie » ?', 'mcq',
   '["Le pouvoir du peuple", "Le pouvoir d''un seul", "Le pouvoir des riches", "Le pouvoir des dieux"]', 0,
   'Du grec dêmos (le peuple) et kratos (le pouvoir) : le pouvoir du peuple.', 4),
  ('13710000-0000-4000-8000-000000000105'::uuid, 'La démocratie : fragilités et évolutions',
   'Dans une démocratie représentative, les citoyens votent eux-mêmes chaque loi.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : en démocratie représentative, ils élisent des représentants qui décident en leur nom. C''est la démocratie directe qui fait voter les lois par le peuple.', 5),
  ('13710000-0000-4000-8000-000000000106'::uuid, 'La démocratie : fragilités et évolutions',
   'À quel siècle naît la démocratie athénienne ?', 'mcq',
   '["Au Ve siècle avant J.-C.", "Au XVIIIe siècle", "Au IIe siècle après J.-C.", "Au Moyen Âge"]', 0,
   'La démocratie athénienne se développe au Ve siècle avant J.-C. (siècle de Périclès).', 6),
  ('13710000-0000-4000-8000-000000000107'::uuid, 'La démocratie : fragilités et évolutions',
   'À Athènes, tous les habitants étaient citoyens et pouvaient voter.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : femmes, esclaves et métèques étaient exclus. Seuls les hommes libres nés de parents athéniens étaient citoyens.', 7),
  ('13710000-0000-4000-8000-000000000108'::uuid, 'La démocratie : fragilités et évolutions',
   'Quel régime se caractérise par un contrôle total de la société par le pouvoir ?', 'mcq',
   '["Le régime totalitaire", "La démocratie représentative", "La démocratie directe", "La monarchie parlementaire"]', 0,
   'Le régime totalitaire cherche à contrôler l''ensemble de la société, contrairement à l''autoritaire qui muselle surtout l''opposition.', 8),
  ('13710000-0000-4000-8000-000000000109'::uuid, 'La démocratie : fragilités et évolutions',
   'Que désigne le terme « populisme » dans le débat politique ?', 'mcq',
   '["Un discours opposant « le peuple » aux « élites »", "Un régime sans élections", "La séparation des pouvoirs", "Le vote obligatoire"]', 0,
   'Le populisme oppose un « peuple » supposé vertueux à des « élites » accusées de le trahir.', 9),
  ('13710000-0000-4000-8000-000000000110'::uuid, 'La démocratie : fragilités et évolutions',
   'L''abstention croissante est l''un des signes de fragilité des démocraties actuelles.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : abstention, défiance envers les élus, populismes et désinformation fragilisent les démocraties contemporaines.', 10),

  -- Chapitre 2 — Les frontières dans le monde
  ('13710000-0000-4000-8000-000000000204'::uuid, 'Les frontières dans le monde',
   'Que délimite avant tout une frontière ?', 'mcq',
   '["La souveraineté d''un État", "Le climat d''une région", "La langue parlée", "La religion majoritaire"]', 0,
   'La frontière marque la limite de la souveraineté d''un État sur un territoire.', 4),
  ('13710000-0000-4000-8000-000000000205'::uuid, 'Les frontières dans le monde',
   'Les Pyrénées sont un exemple de frontière : ', 'mcq',
   '["Naturelle", "Artificielle", "Maritime", "Invisible"]', 0,
   'Les Pyrénées forment une frontière naturelle (relief), par opposition aux frontières artificielles tracées en ligne droite.', 5),
  ('13710000-0000-4000-8000-000000000206'::uuid, 'Les frontières dans le monde',
   'Une frontière ne sert qu''à séparer, jamais à relier.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la frontière sépare et filtre, mais elle est aussi une interface qui relie et permet les échanges.', 6),
  ('13710000-0000-4000-8000-000000000207'::uuid, 'Les frontières dans le monde',
   'Quel espace européen permet la libre circulation en supprimant les contrôles aux frontières intérieures ?', 'mcq',
   '["L''espace Schengen", "L''OTAN", "L''ONU", "Le G7"]', 0,
   'L''espace Schengen permet la libre circulation des personnes entre les États membres.', 7),
  ('13710000-0000-4000-8000-000000000208'::uuid, 'Les frontières dans le monde',
   'Depuis les années 1990, le nombre de murs frontaliers a globalement augmenté dans le monde.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : malgré la mondialisation, les murs se sont multipliés (USA/Mexique, Israël/Cisjordanie, Inde/Bangladesh).', 8),
  ('13710000-0000-4000-8000-000000000209'::uuid, 'Les frontières dans le monde',
   'Lequel de ces espaces est considéré comme « sans frontière » et régi par des traités internationaux ?', 'mcq',
   '["L''Antarctique", "La France", "Le Brésil", "L''Union européenne"]', 0,
   'L''Antarctique, comme la haute mer et l''espace, est un bien commun sans souveraineté d''un seul État.', 9),
  ('13710000-0000-4000-8000-000000000210'::uuid, 'Les frontières dans le monde',
   'Que signifie « démarquer » une frontière ?', 'mcq',
   '["La matérialiser sur le terrain", "La supprimer", "La définir par un traité", "La contester"]', 0,
   'Délimiter, c''est définir la frontière par traité ; démarquer, c''est la matérialiser concrètement sur le terrain.', 10),

  -- Chapitre 3 — Le pouvoir des médias
  ('13710000-0000-4000-8000-000000000304'::uuid, 'Le pouvoir des médias',
   'Qu''est-ce que l''opinion publique ?', 'mcq',
   '["L''ensemble des jugements partagés d''une société sur les affaires publiques", "La loi votée par le Parlement", "Le programme d''un parti", "Un sondage privé"]', 0,
   'L''opinion publique désigne les jugements partagés par une société sur les questions publiques, largement construits via les médias.', 4),
  ('13710000-0000-4000-8000-000000000305'::uuid, 'Le pouvoir des médias',
   'En France, quelle loi fonde la liberté de la presse ?', 'mcq',
   '["La loi de 1881", "La loi de 1905", "La loi de 1789", "La loi de 2004"]', 0,
   'La loi du 29 juillet 1881 garantit la liberté de la presse en France.', 5),
  ('13710000-0000-4000-8000-000000000306'::uuid, 'Le pouvoir des médias',
   'On qualifie souvent la presse libre de « quatrième pouvoir » car elle surveille les gouvernants.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la presse joue un rôle de contre-pouvoir en surveillant les détenteurs du pouvoir politique.', 6),
  ('13710000-0000-4000-8000-000000000307'::uuid, 'Le pouvoir des médias',
   'Comment appelle-t-on la diffusion volontaire de fausses informations ?', 'mcq',
   '["La désinformation", "L''éditorial", "Le reportage", "La censure préventive"]', 0,
   'La désinformation (fake news, infox) consiste à diffuser volontairement de fausses informations.', 7),
  ('13710000-0000-4000-8000-000000000308'::uuid, 'Le pouvoir des médias',
   'Quel écrivain publie « J''accuse… ! » dans L''Aurore lors de l''affaire Dreyfus ?', 'mcq',
   '["Émile Zola", "Victor Hugo", "Voltaire", "Jean-Paul Sartre"]', 0,
   'Émile Zola publie « J''accuse… ! » en 1898, illustrant le pouvoir de la presse sur l''opinion.', 8),
  ('13710000-0000-4000-8000-000000000309'::uuid, 'Le pouvoir des médias',
   'Les algorithmes des réseaux sociaux peuvent enfermer l''internaute dans une « bulle de filtres ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : les algorithmes montrent surtout des contenus conformes aux opinions de l''internaute, créant une bulle de filtres.', 9),
  ('13710000-0000-4000-8000-000000000310'::uuid, 'Le pouvoir des médias',
   'Quelle organisation publie un classement mondial de la liberté de la presse ?', 'mcq',
   '["Reporters sans frontières", "L''OMS", "La FIFA", "L''OPEP"]', 0,
   'Reporters sans frontières (RSF) publie chaque année un classement mondial de la liberté de la presse.', 10),

  -- Chapitre 4 — États et religions
  ('13710000-0000-4000-8000-000000000404'::uuid, 'États et religions',
   'Comment appelle-t-on un régime où le pouvoir religieux gouverne l''État ?', 'mcq',
   '["Une théocratie", "Une laïcité", "Une république", "Une démocratie directe"]', 0,
   'Dans une théocratie, le pouvoir religieux exerce le pouvoir politique (ex. Iran, Vatican).', 4),
  ('13710000-0000-4000-8000-000000000405'::uuid, 'États et religions',
   'Quelle loi fonde la laïcité en France ?', 'mcq',
   '["La loi de séparation des Églises et de l''État de 1905", "La loi de 1881", "La loi de 1789", "La loi de 1958"]', 0,
   'La loi du 9 décembre 1905 sépare les Églises et l''État et fonde la laïcité française.', 5),
  ('13710000-0000-4000-8000-000000000406'::uuid, 'États et religions',
   'La laïcité française garantit la liberté de conscience, c''est-à-dire le droit de croire ou de ne pas croire.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la laïcité garantit la liberté de conscience, l''égalité des citoyens et la neutralité de l''État.', 6),
  ('13710000-0000-4000-8000-000000000407'::uuid, 'États et religions',
   'Que désigne le terme « sécularisation » ?', 'mcq',
   '["Le recul de l''influence de la religion dans la société", "L''union de l''Église et de l''État", "La création d''une religion d''État", "L''interdiction de toute religion"]', 0,
   'La sécularisation est le recul de l''influence de la religion dans la vie sociale.', 7),
  ('13710000-0000-4000-8000-000000000408'::uuid, 'États et religions',
   'Aux États-Unis, la religion a totalement disparu de l''espace public.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : bien que le 1er amendement sépare Église et État, la religion reste très visible (« In God We Trust », serment sur la Bible).', 8),
  ('13710000-0000-4000-8000-000000000409'::uuid, 'États et religions',
   'Quand une religion est officiellement reconnue par l''État, on parle de : ', 'mcq',
   '["Religion d''État", "Laïcité", "Sécularisation", "Athéisme"]', 0,
   'Une religion d''État est une religion officielle du pays (ex. anglicanisme au Royaume-Uni).', 9),
  ('13710000-0000-4000-8000-000000000410'::uuid, 'États et religions',
   'La sécularisation progresse partout dans le monde de la même façon.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la sécularisation recule surtout en Occident, mais ailleurs le religieux peut connaître un regain, parfois identitaire.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'hggsp'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
