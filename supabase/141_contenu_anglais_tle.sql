-- =============================================================================
-- Studuel — Migration 141 : CONTENU Anglais Tle (+ exercices type bac)
-- Remplit les 4 chapitres d'Anglais Tle (axes culturels LV, niveau B2) :
--   1. Cours          → lessons.content de « L'essentiel du cours » (position 1)
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (positions 4→10, jointure
--                       leçon→quiz robuste à l'id existant ; filet si absent)
--   4. Exercices bac  → lessons.content de « Exercices types » (position 2) :
--                       2 exercices type bac corrigés par chapitre (compréhension
--                       d'un court texte + expression écrite guidée).
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
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Faire société : unité et pluralité', $md$# Faire société : unité et pluralité

## Ce que tu vas comprendre
Cet axe interroge la façon dont une société reste **unie** tout en étant **plurielle** : diversité culturelle, communautés, quête d'égalité. On mobilise un vocabulaire de la vie citoyenne et on révise les temps de base pour parler du présent, du passé et des habitudes.

## 1. Diversité et communautés
Une société est faite d'individus aux origines et aux parcours variés. On parle de *diversity*, de *multicultural society*, de *community*, de *belonging* (appartenance).

- *The United States is often described as a **melting pot** of cultures.* → « Les États-Unis sont souvent décrits comme un creuset de cultures. »
- *A sense of **belonging** helps people feel part of a group.* → « Un sentiment d'appartenance aide chacun à se sentir membre d'un groupe. »

## 2. Le vocabulaire de l'égalité et de la citoyenneté
- *equality* (égalité), *rights* (droits), *citizenship* (citoyenneté), *fairness* (justice, équité) ;
- *discrimination*, *prejudice* (préjugé), *gap* (écart), *to stand up for* (défendre) ;
- *to belong*, *to fit in* (s'intégrer), *to take part in* (participer à).

*Example : **Everyone should have equal rights**, whatever their background.* → « Chacun devrait avoir des droits égaux, quelle que soit son origine. »

## 3. Grammaire de révision — les temps du présent
Pour décrire une société, deux présents s'opposent :
- le **present simple** exprime une vérité générale ou une habitude : *Society **changes** slowly.*
- le **present continuous** (be + -ing) exprime une action en cours ou une évolution : *The country **is becoming** more diverse.*

> **Repère :** *always, often, usually* → present simple ; *now, currently, these days* → present continuous.

## 4. Parler du changement social
Pour nuancer, on utilise des connecteurs : *however* (cependant), *although* (bien que), *whereas* (tandis que), *therefore* (donc).

*Example : **Although** the country is diverse, inequalities **remain**.* → « Bien que le pays soit divers, des inégalités subsistent. »

## L'essentiel à retenir
- **Faire société** = rester **uni** malgré la **pluralité** (diversité, communautés, égalité).
- Vocabulaire clé : *diversity, belonging, equality, rights, discrimination*.
- **Present simple** = vérité générale / habitude ; **present continuous** = action en cours / évolution.
- Les **connecteurs logiques** (*however, although, therefore*) structurent une argumentation en B2.$md$),

    ('Environnements en mutation', $md$# Environnements en mutation

## Ce que tu vas comprendre
Cet axe explore la **transformation des milieux** où l'on vit : dérèglement climatique, urbanisation, rapport à la nature. On enrichit le vocabulaire de l'environnement et on révise l'expression du **futur** et du **conditionnel** pour parler des scénarios à venir.

## 1. Le vocabulaire du climat et de la nature
- *climate change* (changement climatique), *global warming* (réchauffement), *greenhouse gases* (gaz à effet de serre) ;
- *pollution*, *waste* (déchets), *to recycle*, *renewable energy* (énergie renouvelable) ;
- *wildlife* (faune sauvage), *endangered species* (espèces menacées), *to preserve* (préserver).

*Example : **We must reduce our carbon footprint** to slow global warming.* → « Nous devons réduire notre empreinte carbone pour ralentir le réchauffement. »

## 2. La ville en mutation
- *urban* (urbain), *sustainable city* (ville durable), *public transport*, *green spaces* ;
- *overcrowding* (surpeuplement), *housing* (logement), *commuting* (trajets domicile-travail).

*Example : **Cities are growing fast**, so planners design greener neighbourhoods.* → « Les villes grandissent vite, alors les urbanistes conçoivent des quartiers plus verts. »

## 3. Grammaire — le futur
Plusieurs formes coexistent :
- **will** + base verbale : prédiction ou décision spontanée. *Sea levels **will rise**.*
- **be going to** : intention ou signe présent. *The city **is going to ban** old cars.*

> **Repère :** *will* pour une prévision, *be going to* pour un projet déjà décidé.

## 4. Grammaire — le conditionnel (hypothèses)
Pour parler d'un scénario, on emploie **if** :
- Hypothèse probable (type 1) : *If we **act** now, we **will save** resources.*
- Hypothèse irréelle (type 2) : *If everyone **recycled**, we **would produce** less waste.*

## L'essentiel à retenir
- Vocabulaire clé : *climate change, waste, renewable energy, sustainable city*.
- **will** = prévision ; **be going to** = projet décidé.
- **If + present → will** (probable) ; **If + prétérit → would** (irréel).
- On parle des **scénarios environnementaux** en combinant futur et conditionnel.$md$),

    ('Art et débats d''idées', $md$# Art et débats d'idées

## Ce que tu vas comprendre
Cet axe étudie l'**art engagé** et la **contestation** : comment œuvres, artistes et mouvements portent des idées et bousculent la société. On enrichit le vocabulaire de la création et on révise le **prétérit** et le **present perfect** pour raconter et relier passé et présent.

## 1. Le vocabulaire de l'art et de l'engagement
- *artwork* (œuvre), *painting*, *street art*, *protest song* (chanson de contestation) ;
- *to challenge* (remettre en cause), *to raise awareness* (sensibiliser), *committed art* (art engagé) ;
- *freedom of speech* (liberté d'expression), *censorship* (censure), *statement* (prise de position).

*Example : **Street art can challenge power** and give a voice to the voiceless.* → « L'art urbain peut défier le pouvoir et donner une voix aux sans-voix. »

## 2. Contestation et idées
- *movement* (mouvement), *rebellion*, *to protest*, *to demonstrate* (manifester) ;
- *influential* (influent), *controversial* (polémique), *to inspire*, *to denounce* (dénoncer).

*Example : **Many artists have denounced injustice** through their work.* → « De nombreux artistes ont dénoncé l'injustice à travers leur œuvre. »

## 3. Grammaire — le prétérit (simple past)
Le **prétérit** raconte une action **terminée**, datée dans le passé. On ajoute *-ed* (réguliers) ou une forme irrégulière.

*Example : *In 1937, Picasso **painted** Guernica to denounce war.* → action passée, datée.*

> **Repère :** un marqueur de temps passé (*yesterday, in 1937, last year, ago*) appelle le prétérit.

## 4. Grammaire — le present perfect
Le **present perfect** (have + participe passé) relie le passé au **présent** : bilan, expérience, résultat encore valable.

*Example : *Art **has always shaped** public opinion.* → un bilan toujours vrai.*

> **Repère :** *since, for, ever, never, already, yet* → present perfect. On ne date **jamais** précisément avec le present perfect.

## L'essentiel à retenir
- Vocabulaire clé : *committed art, to challenge, censorship, freedom of speech*.
- **Prétérit** = action passée **datée et terminée** (*painted in 1937*).
- **Present perfect** = lien passé/présent, **sans date précise** (*has shaped*).
- Marqueurs : *ago/yesterday* → prétérit ; *since/for/ever/never* → present perfect.$md$),

    ('Innovations et responsabilité', $md$# Innovations et responsabilité

## Ce que tu vas comprendre
Cet axe interroge le **progrès scientifique** et la **responsabilité** qui l'accompagne : technologies, intelligence artificielle, éthique. On enrichit le vocabulaire de l'innovation et on révise la **voix passive** et les **modaux** pour exprimer obligation, possibilité et jugement.

## 1. Le vocabulaire de l'innovation
- *breakthrough* (avancée majeure), *research*, *device* (appareil), *artificial intelligence* ;
- *to develop*, *to improve*, *data* (données), *privacy* (vie privée) ;
- *ethics* (éthique), *responsibility*, *risk*, *benefit* (bénéfice), *side effect* (effet secondaire).

*Example : **A recent breakthrough in medicine** could save millions of lives.* → « Une avancée récente en médecine pourrait sauver des millions de vies. »

## 2. Éthique et responsabilité
- *harmful* (nuisible), *safe* (sûr), *to regulate* (réguler), *guidelines* (recommandations) ;
- *accountable* (responsable), *to misuse* (mal utiliser), *trust* (confiance).

*Example : **Scientists must weigh the benefits against the risks** of new technologies.* → « Les scientifiques doivent peser les bénéfices face aux risques des nouvelles technologies. »

## 3. Grammaire — la voix passive
La **voix passive** (be + participe passé) met l'accent sur l'**action** ou son résultat, pas sur l'auteur. Utile pour un ton scientifique et neutre.

- Actif : *Researchers **test** the vaccine.*
- Passif : *The vaccine **is tested** by researchers.* → « Le vaccin est testé par des chercheurs. »

> **Repère :** on passe à la voix passive quand l'auteur importe peu (*Data **is collected** every day*).

## 4. Grammaire — les modaux
Les **modaux** expriment une nuance de jugement :
- *must* / *have to* : obligation. *We **must** protect users' data.*
- *should* : conseil. *Companies **should** be transparent.*
- *can* / *could* / *may* : possibilité. *AI **could** transform education.*

## L'essentiel à retenir
- Vocabulaire clé : *breakthrough, artificial intelligence, ethics, privacy, accountable*.
- **Voix passive** = be + participe passé, l'accent est sur l'action (*is tested*).
- **Modaux** : *must* (obligation), *should* (conseil), *can/could/may* (possibilité).
- On discute des **innovations** en pesant *benefits* et *risks*, avec un ton nuancé.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'anglais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Faire société : unité et pluralité', $json${
      "centre": "Faire société : unité et pluralité",
      "branches": [
        { "titre": "Diversité et communautés", "enfants": ["diversity, community, belonging", "melting pot", "multicultural society"] },
        { "titre": "Égalité et citoyenneté", "enfants": ["equality, rights, fairness", "discrimination, prejudice", "to stand up for"] },
        { "titre": "Temps du présent", "enfants": ["Present simple = habitude", "Present continuous = évolution", "always/often vs now/currently"] },
        { "titre": "Argumenter (B2)", "enfants": ["however, although", "whereas, therefore", "nuancer le changement social"] }
      ]
    }$json$),
    ('Environnements en mutation', $json${
      "centre": "Environnements en mutation",
      "branches": [
        { "titre": "Climat et nature", "enfants": ["climate change, global warming", "waste, renewable energy", "endangered species"] },
        { "titre": "La ville durable", "enfants": ["sustainable city, green spaces", "public transport, housing", "overcrowding, commuting"] },
        { "titre": "Le futur", "enfants": ["will = prévision", "be going to = projet décidé", "Sea levels will rise"] },
        { "titre": "Le conditionnel", "enfants": ["If + present → will (probable)", "If + prétérit → would (irréel)", "If we act, we will save"] }
      ]
    }$json$),
    ('Art et débats d''idées', $json${
      "centre": "Art et débats d'idées",
      "branches": [
        { "titre": "Art engagé", "enfants": ["committed art, artwork", "street art, protest song", "to raise awareness"] },
        { "titre": "Contestation", "enfants": ["movement, to protest", "controversial, influential", "freedom of speech, censorship"] },
        { "titre": "Prétérit", "enfants": ["Action passée datée", "-ed ou irrégulier", "painted in 1937 / ago / yesterday"] },
        { "titre": "Present perfect", "enfants": ["have + participe passé", "Lien passé / présent", "since, for, ever, never (sans date)"] }
      ]
    }$json$),
    ('Innovations et responsabilité', $json${
      "centre": "Innovations et responsabilité",
      "branches": [
        { "titre": "Innovation", "enfants": ["breakthrough, research, device", "artificial intelligence, data", "to develop, to improve"] },
        { "titre": "Éthique", "enfants": ["ethics, responsibility, privacy", "benefit vs risk, side effect", "accountable, to regulate"] },
        { "titre": "Voix passive", "enfants": ["be + participe passé", "Accent sur l'action", "The vaccine is tested"] },
        { "titre": "Les modaux", "enfants": ["must / have to = obligation", "should = conseil", "can / could / may = possibilité"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'anglais'
 WHERE c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz Anglais Tle ;
--     ce bloc ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Anglais', 'Tle', v.chapter, true, l.id
FROM (VALUES
  ('14119999-0000-4000-8000-000000000001'::uuid, 'Faire société : unité et pluralité'),
  ('14119999-0000-4000-8000-000000000002'::uuid, 'Environnements en mutation'),
  ('14119999-0000-4000-8000-000000000003'::uuid, 'Art et débats d''idées'),
  ('14119999-0000-4000-8000-000000000004'::uuid, 'Innovations et responsabilité')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'anglais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
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
  -- Chapitre 1 — Faire société : unité et pluralité
  ('14110000-0000-4000-8000-000000000104'::uuid, 'Faire société : unité et pluralité',
   'Que signifie le mot « belonging » ?', 'mcq',
   '["L''appartenance", "La solitude", "Le voyage", "La richesse"]', 0,
   '« Belonging » désigne le sentiment d''appartenance à un groupe ou une communauté.', 4),
  ('14110000-0000-4000-8000-000000000105'::uuid, 'Faire société : unité et pluralité',
   'L''image du « melting pot » évoque : ', 'mcq',
   '["Le mélange de cultures", "La pauvreté", "La guerre", "L''isolement"]', 0,
   'Le « melting pot » (creuset) évoque une société où des cultures variées se mélangent.', 5),
  ('14110000-0000-4000-8000-000000000106'::uuid, 'Faire société : unité et pluralité',
   'Quelle phrase emploie correctement le present simple pour une vérité générale ?', 'mcq',
   '["Society changes slowly.", "Society changing slowly.", "Society is change slowly.", "Society change slowly."]', 0,
   'Vérité générale → present simple ; à la 3e personne, le verbe prend un -s : « Society changes ».', 6),
  ('14110000-0000-4000-8000-000000000107'::uuid, 'Faire société : unité et pluralité',
   'Pour décrire une évolution en cours (« The country is becoming more diverse »), on emploie le present continuous.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le present continuous (be + -ing) exprime une action ou une évolution en cours.', 7),
  ('14110000-0000-4000-8000-000000000108'::uuid, 'Faire société : unité et pluralité',
   'Quel mot anglais signifie « égalité » ?', 'mcq',
   '["Equality", "Equity market", "Quality", "Equal sign"]', 0,
   '« Equality » signifie égalité ; à ne pas confondre avec « quality » (qualité).', 8),
  ('14110000-0000-4000-8000-000000000109'::uuid, 'Faire société : unité et pluralité',
   'Le connecteur « although » introduit : ', 'mcq',
   '["Une concession (bien que)", "Une conséquence", "Une cause directe", "Une énumération"]', 0,
   '« Although » = « bien que » : il introduit une concession, une idée qui contraste.', 9),
  ('14110000-0000-4000-8000-000000000110'::uuid, 'Faire société : unité et pluralité',
   'Dans la phrase « These days, cities are growing », le marqueur « these days » appelle plutôt le present continuous.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« These days / now / currently » signalent une action en cours → present continuous.', 10),

  -- Chapitre 2 — Environnements en mutation
  ('14110000-0000-4000-8000-000000000204'::uuid, 'Environnements en mutation',
   'Que signifie « renewable energy » ?', 'mcq',
   '["Énergie renouvelable", "Énergie nucléaire", "Énergie perdue", "Énergie chère"]', 0,
   '« Renewable energy » = énergie renouvelable (solaire, éolienne, etc.).', 4),
  ('14110000-0000-4000-8000-000000000205'::uuid, 'Environnements en mutation',
   'Le mot « waste » se traduit par : ', 'mcq',
   '["Les déchets", "L''eau", "La forêt", "Le vent"]', 0,
   '« Waste » désigne les déchets (et, comme verbe, gaspiller).', 5),
  ('14110000-0000-4000-8000-000000000206'::uuid, 'Environnements en mutation',
   'Pour une prévision (« Sea levels ___ rise »), quelle forme du futur convient ?', 'mcq',
   '["will", "are going", "would", "did"]', 0,
   'Une prévision se marque avec « will » : « Sea levels will rise ».', 6),
  ('14110000-0000-4000-8000-000000000207'::uuid, 'Environnements en mutation',
   'Complète l''hypothèse probable : « If we ___ now, we will save resources. »', 'mcq',
   '["act", "acted", "will act", "would act"]', 0,
   'Hypothèse probable (type 1) : If + present simple → will. Donc « If we act now, we will save… ».', 7),
  ('14110000-0000-4000-8000-000000000208'::uuid, 'Environnements en mutation',
   'Dans une hypothèse irréelle, on écrit : « If everyone recycled, we would produce less waste. »', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Hypothèse irréelle (type 2) : If + prétérit → would + base verbale.', 8),
  ('14110000-0000-4000-8000-000000000209'::uuid, 'Environnements en mutation',
   '« Be going to » exprime plutôt : ', 'mcq',
   '["Un projet déjà décidé", "Une vérité générale", "Une action passée", "Une obligation"]', 0,
   '« Be going to » exprime une intention ou un projet déjà décidé, souvent visible dès le présent.', 9),
  ('14110000-0000-4000-8000-000000000210'::uuid, 'Environnements en mutation',
   'Que désigne « a sustainable city » ?', 'mcq',
   '["Une ville durable", "Une ville abandonnée", "Une ville souterraine", "Une ville flottante"]', 0,
   '« Sustainable » = durable ; « a sustainable city » est une ville respectueuse de l''environnement.', 10),

  -- Chapitre 3 — Art et débats d'idées
  ('14110000-0000-4000-8000-000000000304'::uuid, 'Art et débats d''idées',
   'Que signifie « committed art » ?', 'mcq',
   '["L''art engagé", "L''art abstrait", "L''art ancien", "L''art commercial"]', 0,
   '« Committed art » désigne l''art engagé, porteur d''un message ou d''une cause.', 4),
  ('14110000-0000-4000-8000-000000000305'::uuid, 'Art et débats d''idées',
   'Le mot « censorship » se traduit par : ', 'mcq',
   '["La censure", "La liberté", "La peinture", "La critique"]', 0,
   '« Censorship » = la censure, qui s''oppose à « freedom of speech » (liberté d''expression).', 5),
  ('14110000-0000-4000-8000-000000000306'::uuid, 'Art et débats d''idées',
   'Quelle phrase emploie correctement le prétérit ?', 'mcq',
   '["In 1937, Picasso painted Guernica.", "In 1937, Picasso has painted Guernica.", "In 1937, Picasso paints Guernica.", "In 1937, Picasso painting Guernica."]', 0,
   'Une action passée datée (« in 1937 ») exige le prétérit : « painted ».', 6),
  ('14110000-0000-4000-8000-000000000307'::uuid, 'Art et débats d''idées',
   'Le present perfect (« Art has always shaped opinion ») relie le passé au présent.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le present perfect (have + participe passé) fait le lien entre le passé et le présent : bilan encore valable.', 7),
  ('14110000-0000-4000-8000-000000000308'::uuid, 'Art et débats d''idées',
   'Quel marqueur appelle le present perfect plutôt que le prétérit ?', 'mcq',
   '["since 2010", "yesterday", "in 1937", "two years ago"]', 0,
   '« Since / for / ever / never » → present perfect ; « yesterday / ago / in 1937 » → prétérit.', 8),
  ('14110000-0000-4000-8000-000000000309'::uuid, 'Art et débats d''idées',
   'Que signifie « to raise awareness » ?', 'mcq',
   '["Sensibiliser", "Se réveiller", "Augmenter les prix", "Peindre un tableau"]', 0,
   '« To raise awareness » = sensibiliser, attirer l''attention sur une cause.', 9),
  ('14110000-0000-4000-8000-000000000310'::uuid, 'Art et débats d''idées',
   'On peut employer le present perfect avec une date précise comme « in 1937 ».', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le present perfect ne se combine jamais avec une date précise ; une date passée exige le prétérit.', 10),

  -- Chapitre 4 — Innovations et responsabilité
  ('14110000-0000-4000-8000-000000000404'::uuid, 'Innovations et responsabilité',
   'Que signifie « a breakthrough » ?', 'mcq',
   '["Une avancée majeure", "un échec", "une pause", "une panne"]', 0,
   '« A breakthrough » désigne une avancée ou une percée scientifique majeure.', 4),
  ('14110000-0000-4000-8000-000000000405'::uuid, 'Innovations et responsabilité',
   'Le mot « privacy » se traduit par : ', 'mcq',
   '["La vie privée", "Le privilège", "La priorité", "Le progrès"]', 0,
   '« Privacy » = la vie privée, notion centrale dans les débats sur les données (« data »).', 5),
  ('14110000-0000-4000-8000-000000000406'::uuid, 'Innovations et responsabilité',
   'Quelle est la forme passive correcte de « Researchers test the vaccine » ?', 'mcq',
   '["The vaccine is tested by researchers.", "The vaccine tests researchers.", "The vaccine testing by researchers.", "The vaccine has test by researchers."]', 0,
   'Voix passive = be + participe passé : « The vaccine is tested by researchers ».', 6),
  ('14110000-0000-4000-8000-000000000407'::uuid, 'Innovations et responsabilité',
   'La voix passive met l''accent sur l''action ou son résultat plutôt que sur son auteur.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La voix passive (be + participe passé) valorise l''action ; l''auteur peut même être omis.', 7),
  ('14110000-0000-4000-8000-000000000408'::uuid, 'Innovations et responsabilité',
   'Quel modal exprime une obligation ?', 'mcq',
   '["must", "could", "may", "might"]', 0,
   '« Must » (comme « have to ») exprime une obligation forte ; « should » un conseil.', 8),
  ('14110000-0000-4000-8000-000000000409'::uuid, 'Innovations et responsabilité',
   'Dans « Companies should be transparent », le modal « should » exprime : ', 'mcq',
   '["Un conseil", "une interdiction", "une certitude", "une action passée"]', 0,
   '« Should » exprime un conseil ou une recommandation.', 9),
  ('14110000-0000-4000-8000-000000000410'::uuid, 'Innovations et responsabilité',
   'Que signifie « accountable » ?', 'mcq',
   '["Responsable (qui doit rendre des comptes)", "Comptable de métier", "Incalculable", "Anonyme"]', 0,
   '« Accountable » signifie responsable, tenu de rendre des comptes de ses actes.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'anglais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BAC — lessons.content de « Exercices types » (position 2)
--    Par chapitre : compréhension d'un court texte en anglais + questions,
--    puis expression écrite guidée. Correction en français.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Faire société : unité et pluralité', $md$# Exercices types — Faire société : unité et pluralité

## Exercice 1 — Compréhension écrite
Lis ce court texte, puis réponds en anglais.

> *In many big cities, people from dozens of countries live side by side. This diversity can be a strength: different traditions, languages and ideas meet every day. Yet living together is not always easy. Some communities feel left out, and inequalities remain. To build a united society, everyone must feel that they belong and that their rights are respected.*

a) According to the text, why can diversity be a strength?
b) What problem does the text mention about living together?
c) Explique en français ce que l'auteur considère comme la condition d'une société unie.

### Correction
a) Diversity is a strength because *different traditions, languages and ideas meet every day* : les cultures se croisent et s'enrichissent.
b) Le texte souligne que vivre ensemble n'est pas toujours simple : *some communities feel left out* (certaines communautés se sentent exclues) et des inégalités subsistent.
c) Pour l'auteur, une société unie suppose que **chacun se sente à sa place** (*belong*) et que **ses droits soient respectés**. L'unité repose donc sur le sentiment d'appartenance et l'égalité des droits.

## Exercice 2 — Expression écrite guidée
Sujet : *« A diverse society is a richer society. » Do you agree?* (rédige environ 120 mots).

Trame conseillée :
- Introduction : reformule la question et annonce ton opinion.
- Un argument « pour » avec un exemple concret (*for example, in music or food…*).
- Une nuance avec *however* ou *although* (les défis de la diversité).
- Conclusion brève qui rappelle ta position.

### Correction (proposition)
> *I agree that a diverse society is often a richer one. When people from different backgrounds live together, they share new ideas, food and music, which makes daily life more interesting. For example, a single city can offer festivals from all over the world. However, diversity also brings challenges: some groups may feel excluded, and prejudice still exists. Although these problems are real, they can be reduced through education and equal rights. Therefore, I believe diversity is a strength, as long as every community feels respected and included.*

Points à vérifier : opinion claire, au moins un connecteur (*however, although, therefore*), un exemple, et une alternance present simple / present continuous correcte.$md$),

    ('Environnements en mutation', $md$# Exercices types — Environnements en mutation

## Exercice 1 — Compréhension écrite
Lis ce court texte, puis réponds en anglais.

> *Cities are changing fast. As populations grow, planners are trying to make urban life more sustainable. New neighbourhoods include green spaces, cycle lanes and better public transport. Experts say that if we design cities carefully, we will reduce pollution and improve people's health. But change takes time, and not every city can afford it.*

a) What are planners trying to do, according to the text?
b) Quote the sentence that expresses a condition and its result (an « if » sentence).
c) Explique en français la limite (« But… ») que soulève le texte.

### Correction
a) Les urbanistes cherchent à rendre la vie urbaine plus durable : *to make urban life more sustainable* (espaces verts, pistes cyclables, meilleurs transports).
b) La phrase conditionnelle est : *« if we design cities carefully, we will reduce pollution and improve people's health »* (type 1 : If + present → will).
c) La limite est que **le changement prend du temps** et que **toutes les villes n'en ont pas les moyens** (*not every city can afford it*). L'ambition écologique se heurte à des contraintes de temps et d'argent.

## Exercice 2 — Expression écrite guidée
Sujet : *Imagine your ideal sustainable city in 2050. What would it be like?* (rédige environ 120 mots).

Trame conseillée :
- Emploie le **conditionnel** (*would*) pour décrire un scénario imaginé.
- Cite au moins trois éléments concrets (transport, énergie, nature).
- Termine par l'effet positif sur les habitants.

### Correction (proposition)
> *In my ideal city in 2050, people would move around mainly by bike, tram or electric bus, so the air would be much cleaner. Buildings would produce their own renewable energy with solar panels on every roof. There would be parks and gardens in each neighbourhood, and rainwater would be collected and reused. Waste would be sorted and recycled almost completely. If everyone respected these rules, the city would be quieter, greener and healthier. I believe people would feel happier living close to nature, even in a large urban area.*

Points à vérifier : usage cohérent de *would*, vocabulaire de l'environnement (*renewable energy, recycled, green spaces*), et au moins une phrase en *if + prétérit → would*.$md$),

    ('Art et débats d''idées', $md$# Exercices types — Art et débats d'idées

## Exercice 1 — Compréhension écrite
Lis ce court texte, puis réponds en anglais.

> *Throughout history, artists have used their work to challenge power. In 1937, Picasso painted Guernica to denounce the horrors of war. Since then, many painters, singers and street artists have raised awareness about injustice. Their art has changed the way people think, even when governments tried to censor it. Committed art reminds us that creativity and freedom of speech are deeply connected.*

a) What did Picasso do in 1937, and why?
b) Relève dans le texte un verbe au prétérit et un verbe au present perfect.
c) Explique en français le lien que l'auteur établit entre l'art et la liberté d'expression.

### Correction
a) En 1937, Picasso a peint Guernica (*painted Guernica*) pour dénoncer les horreurs de la guerre (*to denounce the horrors of war*).
b) **Prétérit** : *painted* (action datée en 1937). **Present perfect** : *have raised* / *has changed* (bilan reliant le passé au présent, sans date précise).
c) Pour l'auteur, l'**art engagé** rappelle que la **créativité et la liberté d'expression** sont étroitement liées : l'art fait réfléchir et résiste même à la censure (*even when governments tried to censor it*).

## Exercice 2 — Expression écrite guidée
Sujet : *Can art really change society? Give your opinion.* (rédige environ 120 mots).

Trame conseillée :
- Annonce ton opinion, puis un exemple d'œuvre ou d'artiste engagé.
- Utilise le **prétérit** pour l'exemple daté et le **present perfect** pour son effet durable.
- Nuance avec un contre-argument, puis conclus.

### Correction (proposition)
> *I believe art can change society, at least by changing minds. When Picasso painted Guernica, he forced people to look at the cruelty of war. Since then, protest songs and street art have raised awareness about racism and inequality. Art has given a voice to people who are rarely heard. However, art alone cannot solve every problem: laws and political action are also needed. Even so, by challenging ideas and touching emotions, committed art plays an important role. That is why I think creativity remains a powerful tool for change.*

Points à vérifier : au moins un prétérit daté (*painted*), un present perfect avec *since/have* (*have raised, has given*), et une opinion clairement exprimée.$md$),

    ('Innovations et responsabilité', $md$# Exercices types — Innovations et responsabilité

## Exercice 1 — Compréhension écrite
Lis ce court texte, puis réponds en anglais.

> *New technologies are developed every year, and artificial intelligence is now used in medicine, transport and education. These tools can save time and even lives. However, personal data is often collected without clear consent, and some systems can be misused. Experts argue that innovation must be regulated so that progress stays safe and fair. Scientists should be held accountable for the way their inventions are used.*

a) In which fields is artificial intelligence used, according to the text?
b) Relève dans le texte une forme à la voix passive.
c) Explique en français ce que le texte réclame pour que l'innovation reste « safe and fair ».

### Correction
a) L'intelligence artificielle est utilisée en médecine, dans les transports et dans l'éducation (*in medicine, transport and education*).
b) Formes à la voix passive (be + participe passé) : *are developed*, *is used*, *is collected*, *is misused*, *are used*. Toute réponse citant l'une d'elles est correcte.
c) Le texte réclame que l'**innovation soit régulée** (*innovation must be regulated*) et que les **scientifiques soient tenus responsables** (*held accountable*) de l'usage de leurs inventions, afin que le progrès reste sûr et équitable.

## Exercice 2 — Expression écrite guidée
Sujet : *Should artificial intelligence be more strictly regulated? Give your opinion.* (rédige environ 120 mots).

Trame conseillée :
- Emploie des **modaux** (*must, should, could*) pour exprimer obligation, conseil et possibilité.
- Donne un bénéfice (*benefit*) puis un risque (*risk*).
- Conclus avec une position nuancée.

### Correction (proposition)
> *I think artificial intelligence should be regulated more strictly, but not banned. AI could transform education and medicine, for example by helping doctors detect diseases earlier. However, personal data must be protected, because it can easily be misused. Companies should be transparent about how their systems work, and they must be held accountable when something goes wrong. If clear rules were created, people would trust these tools more. Innovation and responsibility can go together: we should welcome progress while making sure it stays safe and fair for everyone.*

Points à vérifier : au moins trois modaux (*should, could, must*), une forme passive (*be protected, be misused, be held accountable*), et un équilibre entre bénéfices et risques.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'anglais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
