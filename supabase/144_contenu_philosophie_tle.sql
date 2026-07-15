-- =============================================================================
-- Studuel — Migration 144 : CONTENU Philosophie Tle (+ exercices type bac)
-- Remplit les 5 chapitres (NOTIONS) de Philosophie Terminale (tronc commun) :
--   1. Cours          → lessons.content de « L'essentiel du cours » (position 1)
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (positions 4→10, jointure
--                       leçon→quiz robuste à l'id existant ; filet si absent)
--   4. Exercices bac  → lessons.content de « Exercices types » (position 2) :
--                       2 exercices type bac par notion (dissertation avec analyse
--                       du sujet + plan détaillé, et amorce d'explication de texte).
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
    ('La conscience et l''inconscient', $md$# La conscience et l'inconscient

## Ce que tu vas comprendre
« Conscience » désigne à la fois le savoir immédiat que j'ai de moi-même et de mes actes, et la voix intérieure qui juge le bien et le mal. Ce chapitre interroge : suis-je vraiment maître et transparent à moi-même, ou une part de moi m'échappe-t-elle ?

## 1. Distinguer les sens du mot « conscience »
- La **conscience psychologique** : la présence à soi, le fait de se savoir en train de percevoir, penser, agir.
- La **conscience morale** : la capacité de juger ses actes en termes de bien et de mal.
- La **conscience de soi** : le pouvoir de se prendre soi-même pour objet, de dire « je ».

## 2. Descartes : la conscience, première certitude
Descartes cherche une vérité indubitable. Même s'il doute de tout, il ne peut douter qu'il pense : « **Je pense, donc je suis** » (le *cogito*). La conscience de soi devient le socle du savoir : le **sujet** est ce qui pense et se sait penser.

> **À retenir :** pour la tradition classique, le sujet est **transparent à lui-même** : rien en lui ne lui est caché.

## 3. Le sujet
Le **sujet** est l'être conscient et pensant qui dit « je », se reconnaît comme identique à travers le temps et se sait responsable de ses actes. Être sujet, c'est n'être pas un simple objet parmi les choses, mais une conscience.

## 4. Freud : l'hypothèse de l'inconscient
Freud remet en cause la transparence du sujet. Des lapsus, des actes manqués, des rêves, des symptômes montrent qu'une part de notre vie psychique nous échappe : l'**inconscient**. Il désigne des désirs et des souvenirs **refoulés**, maintenus hors de la conscience mais toujours actifs.

*Exemple : un lapsus n'est pas un pur hasard mais l'expression déguisée d'un désir refoulé.*

## 5. Une « blessure narcissique »
Après Copernic (la Terre n'est pas le centre) et Darwin (l'homme est un animal), Freud porte une troisième blessure à l'orgueil humain : « **le moi n'est pas maître dans sa propre maison** ». Le sujet n'est plus pleinement transparent ni pleinement maître de lui.

## L'essentiel à retenir
- **Conscience** : psychologique (présence à soi), morale (juger le bien), de soi (dire « je »).
- **Descartes** : le *cogito* fait de la conscience la première certitude ; le sujet se croit transparent.
- **Freud** : l'**inconscient** (désirs refoulés) montre que le sujet s'échappe à lui-même.
- Enjeu : suis-je maître de moi, ou déterminé par ce que j'ignore de moi ?$md$),

    ('La liberté', $md$# La liberté

## Ce que tu vas comprendre
Nous nous croyons spontanément libres : nous avons le sentiment de choisir. Mais ce sentiment prouve-t-il la liberté ? Ce chapitre distingue plusieurs sens de la liberté et affronte l'objection du déterminisme.

## 1. Les sens de la liberté
- **Liberté d'action** : pouvoir faire ce que l'on veut, sans obstacle extérieur.
- **Libre arbitre** : pouvoir de la volonté de **choisir** entre plusieurs possibles, sans y être contrainte.
- **Liberté civile ou politique** : ne pas dépendre de l'arbitraire d'autrui, vivre sous des lois.

## 2. Le libre arbitre
Le **libre arbitre** est la capacité de se déterminer soi-même, par sa seule volonté. C'est ce qui fonde la **responsabilité** : on ne juge coupable que celui qui aurait pu agir autrement.

## 3. L'objection du déterminisme
Le **déterminisme** affirme que **tout événement a une cause** qui le rend nécessaire. Or nos choix ont eux aussi des causes : éducation, désirs, histoire personnelle. Le sentiment de liberté ne serait alors que l'**ignorance des causes** qui nous déterminent (Spinoza).

> **À retenir :** le sentiment de choisir ne prouve pas le libre arbitre ; il peut masquer des causes cachées.

## 4. Sartre : « condamnés à être libres »
Pour Sartre, chez l'homme « **l'existence précède l'essence** » : l'homme n'a pas de nature fixée d'avance, il se définit par ses **actes** et ses choix. Il est donc **entièrement responsable** de ce qu'il est. Nier sa liberté par des excuses (« je suis comme ça »), c'est de la **mauvaise foi**.

*Formule clé : l'homme est « condamné à être libre » — il ne peut pas ne pas choisir.*

## 5. Liberté et loi
La liberté n'est pas l'absence de toute règle. Faire tout ce qui passe par la tête, c'est être esclave de ses impulsions. Pour **Rousseau**, « l'obéissance à la loi qu'on s'est prescrite est liberté » : la loi que l'on se donne soi-même (autonomie) rend libre, au lieu de l'entraver.

## L'essentiel à retenir
- Distinguer **liberté d'action**, **libre arbitre** et **liberté civile**.
- Le **libre arbitre** fonde la **responsabilité** ; le **déterminisme** le conteste.
- **Sartre** : l'existence précède l'essence, l'homme est « condamné à être libre ».
- **Rousseau** : se donner à soi-même sa loi (autonomie), c'est être libre — la loi peut libérer.$md$),

    ('Le bonheur', $md$# Le bonheur

## Ce que tu vas comprendre
Tout le monde recherche le bonheur, mais personne ne s'accorde sur ce qu'il est. Est-il la satisfaction de tous nos désirs, ou au contraire leur maîtrise ? Ce chapitre présente les grandes réponses de l'Antiquité.

## 1. Définir le bonheur
Le **bonheur** est un état de **satisfaction durable et complète**, à distinguer du **plaisir** (agréable mais passager) et de la **joie** (intense mais brève). C'est une fin, non un moyen : on veut tout le reste **en vue** du bonheur.

## 2. Aristote : le bonheur comme souverain bien
Pour **Aristote**, le bonheur (*eudaimonia*) est le **souverain bien**, la fin ultime de toutes nos actions : on le veut pour lui-même et jamais pour autre chose. Il ne consiste pas dans le plaisir ni la richesse, mais dans une **activité conforme à la vertu et à la raison**, ce qui est propre à l'homme.

## 3. Épicure : le tri des désirs
**Épicure** ne condamne pas le plaisir, mais invite à bien **trier ses désirs** :
- désirs **naturels et nécessaires** (manger, être en sécurité) : à satisfaire ;
- désirs **naturels non nécessaires** (raffinements) : à modérer ;
- désirs **vains** (gloire, richesse illimitée) : à écarter, car ils sont sans fin.

Le but est l'**ataraxie** : l'absence de trouble, la tranquillité de l'âme.

> **À retenir :** pour Épicure, satisfaire *tous* ses désirs sans limite rend malheureux ; le sage recherche des plaisirs simples et stables.

## 4. Les stoïciens : ce qui dépend de nous
Les **stoïciens** (Épictète, Marc Aurèle) distinguent **ce qui dépend de nous** (nos jugements, nos désirs) de **ce qui n'en dépend pas** (la maladie, la mort, l'opinion d'autrui). La sagesse consiste à ne vouloir que ce qui dépend de nous et à accepter le reste. On atteint ainsi l'ataraxie et la liberté intérieure.

## 5. Le bonheur est-il désirable sans fin ?
Si le bonheur est la satisfaction de tous les désirs, il est impossible (le désir renaît toujours). D'où l'idée antique : le bonheur tient moins à **avoir plus** qu'à **désirer mieux** — maîtriser ses désirs plutôt que les multiplier.

## L'essentiel à retenir
- **Bonheur** = satisfaction durable, distinct du plaisir passager ; c'est le **souverain bien** (Aristote).
- **Aristote** : bonheur = activité vertueuse conforme à la raison.
- **Épicure** : trier ses désirs (naturels/nécessaires vs vains), viser l'**ataraxie**.
- **Stoïciens** : distinguer ce qui dépend de nous de ce qui n'en dépend pas.$md$),

    ('La justice et le droit', $md$# La justice et le droit

## Ce que tu vas comprendre
Une loi peut être en vigueur sans être juste : l'esclavage fut longtemps légal. Ce chapitre distingue le **droit** (les règles) et la **justice** (l'idéal du juste), et interroge : qu'est-ce qu'une loi juste ?

## 1. Droit positif et droit naturel
- Le **droit positif** est l'ensemble des **lois effectivement en vigueur** dans une société, écrites et sanctionnées par l'État. Il varie selon les époques et les pays.
- Le **droit naturel** désigne des droits **universels**, attachés à l'homme comme tel (dignité, liberté), indépendants des lois écrites, et qui servent à **juger** les lois positives.

## 2. Légal et légitime
- Est **légal** ce qui est conforme à la loi en vigueur.
- Est **légitime** ce qui est conforme à la justice, ce qui **mérite** d'être reconnu comme juste.

> **À retenir :** légal ≠ légitime. Une loi peut être légale et pourtant **injuste** (donc illégitime). C'est au nom du droit naturel ou de la justice qu'on la critique.

## 3. Égalité et équité
La justice suppose l'**égalité devant la loi** : la même règle pour tous. Mais appliquer la même règle à des cas très différents peut être injuste. L'**équité** (Aristote) consiste à **corriger la loi générale** pour l'adapter au cas particulier, afin de rétablir la justice là où la loi, trop générale, serait trop rigide.

## 4. Rousseau : la loi et la volonté générale
Pour **Rousseau**, une loi n'est juste que si elle exprime la **volonté générale** : ce que veut le peuple en visant l'intérêt commun, et non l'intérêt d'un seul ou d'un groupe. La loi juste est celle que les citoyens se donnent à eux-mêmes ; on obéit alors à soi-même, ce qui accorde justice et liberté.

## 5. À quoi sert la justice ?
Sans droit, régnerait la « loi du plus fort », qui n'est pas un droit mais un rapport de force. Le droit remplace la force par la règle et protège le faible. Mais le droit n'est légitime que s'il tend vers la **justice** : il doit sans cesse être évalué et amélioré.

## L'essentiel à retenir
- **Droit positif** (lois en vigueur) vs **droit naturel** (droits universels de l'homme).
- **Légal** (conforme à la loi) ≠ **légitime** (conforme à la justice).
- **Égalité** (même loi pour tous) complétée par l'**équité** (adapter au cas particulier).
- **Rousseau** : la loi juste exprime la **volonté générale**.$md$),

    ('La vérité et la raison', $md$# La vérité et la raison

## Ce que tu vas comprendre
Chacun a « ses » vérités, dit-on. Mais la vérité peut-elle être une affaire d'opinion ? Ce chapitre distingue l'opinion et la vérité, et montre le rôle de la raison et de la démonstration.

## 1. Qu'est-ce que la vérité ?
La **vérité** se définit d'abord comme l'**accord de la pensée avec son objet** : une affirmation est vraie si elle dit ce qui *est*. Elle ne se décrète pas : on ne rend pas une chose vraie en le voulant. La vérité prétend à l'**universalité** — ce qui est vrai l'est pour tous.

## 2. L'opinion
L'**opinion** (*doxa*) est une croyance **non justifiée** : on tient quelque chose pour vrai sans pouvoir le prouver. Elle peut être vraie ou fausse, mais **par hasard**, sans savoir pourquoi. Confondre opinion et vérité, c'est prendre ce qui nous *semble* pour ce qui *est*.

> **À retenir :** dire « à chacun sa vérité » confond la vérité (une, universelle) et l'opinion (variable, subjective).

## 3. Platon : de l'opinion à la connaissance
**Platon** oppose la *doxa* (opinion) et l'*épistémè* (connaissance vraie, justifiée). L'**allégorie de la caverne** figure ce passage : les prisonniers prennent des ombres pour la réalité ; s'élever vers la lumière, c'est passer des apparences aux vérités, par l'effort de la raison.

## 4. La démonstration
**Démontrer**, c'est établir une vérité en l'**enchaînant logiquement** à partir de prémisses ou d'axiomes admis. Le modèle en est la **mathématique** (au fronton de l'Académie de Platon : « Nul n'entre ici s'il n'est géomètre »). Une conclusion démontrée s'impose à tout esprit rationnel : elle ne dépend pas des opinions.

## 5. Raison, science et vérité
La **raison** est la faculté de bien juger, de distinguer le vrai du faux. La **science** cherche des vérités **universelles et nécessaires**, qui peuvent être **démontrées** (mathématiques) ou **vérifiées par l'expérience** (sciences de la nature). C'est ce qui la distingue de la simple opinion.

## L'essentiel à retenir
- **Vérité** = accord de la pensée avec ce qui est ; elle vise l'**universel**.
- **Opinion** (*doxa*) = croyance non justifiée, vraie ou fausse par hasard.
- **Platon** : passer de l'opinion à la connaissance (allégorie de la caverne).
- **Démonstration** et **expérience** distinguent la vérité scientifique de l'opinion.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'philosophie'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('La conscience et l''inconscient', $json${
      "centre": "La conscience et l'inconscient",
      "branches": [
        { "titre": "Sens de la conscience", "enfants": ["Psychologique : présence à soi", "Morale : juger le bien/le mal", "De soi : dire « je »"] },
        { "titre": "Descartes : le cogito", "enfants": ["« Je pense, donc je suis »", "Première certitude indubitable", "Sujet transparent à lui-même"] },
        { "titre": "Le sujet", "enfants": ["Être qui pense et dit « je »", "Identité à travers le temps", "Responsable de ses actes"] },
        { "titre": "Freud : l'inconscient", "enfants": ["Désirs et souvenirs refoulés", "Lapsus, actes manqués, rêves", "Le moi n'est pas maître chez lui"] }
      ]
    }$json$),
    ('La liberté', $json${
      "centre": "La liberté",
      "branches": [
        { "titre": "Sens de la liberté", "enfants": ["Liberté d'action (faire)", "Libre arbitre (choisir)", "Liberté civile (sous les lois)"] },
        { "titre": "Libre arbitre", "enfants": ["Se déterminer par sa volonté", "Fonde la responsabilité", "Pouvoir agir autrement"] },
        { "titre": "Déterminisme", "enfants": ["Tout a une cause nécessaire", "Nos choix ont des causes", "Spinoza : ignorance des causes"] },
        { "titre": "Sartre et Rousseau", "enfants": ["L'existence précède l'essence", "« Condamnés à être libres »", "Rousseau : se donner sa loi"] }
      ]
    }$json$),
    ('Le bonheur', $json${
      "centre": "Le bonheur",
      "branches": [
        { "titre": "Définir le bonheur", "enfants": ["Satisfaction durable et complète", "≠ plaisir (passager)", "Fin ultime, non un moyen"] },
        { "titre": "Aristote", "enfants": ["Bonheur = souverain bien", "Activité conforme à la vertu", "Propre à l'homme : la raison"] },
        { "titre": "Épicure", "enfants": ["Trier ses désirs", "Naturels/nécessaires vs vains", "Ataraxie : absence de trouble"] },
        { "titre": "Stoïciens", "enfants": ["Ce qui dépend de nous", "Accepter ce qui n'en dépend pas", "Liberté intérieure"] }
      ]
    }$json$),
    ('La justice et le droit', $json${
      "centre": "La justice et le droit",
      "branches": [
        { "titre": "Positif vs naturel", "enfants": ["Positif : lois en vigueur", "Naturel : droits universels", "Le naturel juge le positif"] },
        { "titre": "Légal vs légitime", "enfants": ["Légal : conforme à la loi", "Légitime : conforme au juste", "Une loi légale peut être injuste"] },
        { "titre": "Égalité et équité", "enfants": ["Même loi pour tous", "Équité : adapter au cas", "Aristote corrige la loi"] },
        { "titre": "Rousseau", "enfants": ["La volonté générale", "Intérêt commun, pas d'un seul", "Loi qu'on se donne = liberté"] }
      ]
    }$json$),
    ('La vérité et la raison', $json${
      "centre": "La vérité et la raison",
      "branches": [
        { "titre": "La vérité", "enfants": ["Accord pensée / ce qui est", "Vise l'universel", "Ne se décrète pas"] },
        { "titre": "L'opinion", "enfants": ["Croyance non justifiée", "Vraie ou fausse par hasard", "« À chacun sa vérité » ?"] },
        { "titre": "Platon", "enfants": ["Doxa vs épistémè", "Allégorie de la caverne", "Des apparences aux vérités"] },
        { "titre": "Démonstration et science", "enfants": ["Enchaîner à partir d'axiomes", "Modèle mathématique", "Démontrer ou vérifier"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'philosophie'
 WHERE c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Philosophie', 'Tle', v.chapter, true, l.id
FROM (VALUES
  ('14419999-0000-4000-8000-000000000001'::uuid, 'La conscience et l''inconscient'),
  ('14419999-0000-4000-8000-000000000002'::uuid, 'La liberté'),
  ('14419999-0000-4000-8000-000000000003'::uuid, 'Le bonheur'),
  ('14419999-0000-4000-8000-000000000004'::uuid, 'La justice et le droit'),
  ('14419999-0000-4000-8000-000000000005'::uuid, 'La vérité et la raison')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'philosophie'
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
  -- Chapitre 1 — La conscience et l'inconscient
  ('14410000-0000-4000-8000-000000000104'::uuid, 'La conscience et l''inconscient',
   'La formule « Je pense, donc je suis » (le cogito) est de : ', 'mcq',
   '["Descartes", "Freud", "Platon", "Sartre"]', 0,
   'Le cogito « Je pense, donc je suis » est la première certitude établie par Descartes.', 4),
  ('14410000-0000-4000-8000-000000000105'::uuid, 'La conscience et l''inconscient',
   'Selon Freud, l''inconscient désigne : ', 'mcq',
   '["Des désirs et souvenirs refoulés hors de la conscience", "Un sommeil profond", "L''absence de cerveau", "La conscience morale"]', 0,
   'Pour Freud, l''inconscient est fait de désirs et de souvenirs refoulés, maintenus hors de la conscience mais toujours actifs.', 5),
  ('14410000-0000-4000-8000-000000000106'::uuid, 'La conscience et l''inconscient',
   'Pour Descartes, la conscience de soi est la première des certitudes.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Même en doutant de tout, je ne peux douter que je pense : le cogito fait de la conscience de soi la première certitude.', 6),
  ('14410000-0000-4000-8000-000000000107'::uuid, 'La conscience et l''inconscient',
   'L''hypothèse freudienne de l''inconscient remet surtout en cause l''idée que : ', 'mcq',
   '["Le sujet est transparent à lui-même", "L''homme a un corps", "Le rêve existe", "La mémoire existe"]', 0,
   'Freud conteste la transparence du sujet : « le moi n''est pas maître dans sa propre maison ».', 7),
  ('14410000-0000-4000-8000-000000000108'::uuid, 'La conscience et l''inconscient',
   'Pour Freud, un lapsus ou un acte manqué est : ', 'mcq',
   '["L''expression déguisée d''un désir inconscient", "Un pur hasard", "Une simple faute d''orthographe", "Une maladie du cerveau"]', 0,
   'Le lapsus n''est pas un hasard : il révèle, de façon déguisée, un désir refoulé.', 8),
  ('14410000-0000-4000-8000-000000000109'::uuid, 'La conscience et l''inconscient',
   'Selon Freud, l''inconscient n''a aucun effet sur nos comportements.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : pour Freud l''inconscient agit sans cesse (lapsus, rêves, symptômes, actes manqués).', 9),
  ('14410000-0000-4000-8000-000000000110'::uuid, 'La conscience et l''inconscient',
   'En philosophie, le « sujet » désigne : ', 'mcq',
   '["L''être conscient qui dit « je » et se pense", "Le thème d''une dissertation", "Un citoyen soumis au roi", "Un objet matériel"]', 0,
   'Le sujet est l''être conscient et pensant qui dit « je », par opposition à un simple objet.', 10),

  -- Chapitre 2 — La liberté
  ('14410000-0000-4000-8000-000000000204'::uuid, 'La liberté',
   'Le « libre arbitre » désigne : ', 'mcq',
   '["Le pouvoir de la volonté de choisir sans y être contrainte", "Le fait d''être riche", "L''obéissance à la loi", "L''absence de désirs"]', 0,
   'Le libre arbitre est la capacité de la volonté de se déterminer elle-même entre plusieurs possibles.', 4),
  ('14410000-0000-4000-8000-000000000205'::uuid, 'La liberté',
   'Le déterminisme affirme que : ', 'mcq',
   '["Tout événement a une cause qui le rend nécessaire", "Tout est absolument libre", "Rien n''a de cause", "L''homme est un dieu"]', 0,
   'Le déterminisme pose que tout événement, y compris nos choix, résulte de causes qui le rendent nécessaire.', 5),
  ('14410000-0000-4000-8000-000000000206'::uuid, 'La liberté',
   'Pour Sartre, l''homme est « condamné à être libre ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Sartre affirme que l''homme ne peut pas ne pas choisir : il est « condamné à être libre » et responsable de ce qu''il est.', 6),
  ('14410000-0000-4000-8000-000000000207'::uuid, 'La liberté',
   'Chez Sartre, « l''existence précède l''essence » signifie que : ', 'mcq',
   '["L''homme n''a pas de nature fixée d''avance et se définit par ses actes", "L''âme est immortelle", "Le corps précède l''esprit", "Dieu crée l''homme parfait"]', 0,
   'Pour Sartre, l''homme existe d''abord, puis se définit par ses choix : il n''a pas d''essence donnée d''avance.', 7),
  ('14410000-0000-4000-8000-000000000208'::uuid, 'La liberté',
   'L''idée « l''obéissance à la loi qu''on s''est prescrite est liberté » se rattache à : ', 'mcq',
   '["Rousseau", "Freud", "Épicure", "Thalès"]', 0,
   'C''est Rousseau : se donner à soi-même sa loi (autonomie), c''est être libre.', 8),
  ('14410000-0000-4000-8000-000000000209'::uuid, 'La liberté',
   'Être libre, c''est nécessairement faire tout ce qu''on veut sans aucune règle.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : céder à toutes ses impulsions, c''est en être esclave. La loi qu''on se donne peut être condition de la liberté.', 9),
  ('14410000-0000-4000-8000-000000000210'::uuid, 'La liberté',
   'Le fait que nos choix soient influencés par notre éducation illustre l''idée de : ', 'mcq',
   '["Déterminisme", "Libre arbitre absolu", "Hasard pur", "Miracle"]', 0,
   'Des causes comme l''éducation orientent nos choix : c''est l''argument déterministe contre le libre arbitre.', 10),

  -- Chapitre 3 — Le bonheur
  ('14410000-0000-4000-8000-000000000304'::uuid, 'Le bonheur',
   'Pour Aristote, le bonheur (eudaimonia) est : ', 'mcq',
   '["Le souverain bien, fin ultime de toutes nos actions", "Un plaisir passager", "La richesse matérielle", "L''absence de pensée"]', 0,
   'Aristote fait du bonheur le souverain bien : on le veut pour lui-même et tout le reste en vue de lui.', 4),
  ('14410000-0000-4000-8000-000000000305'::uuid, 'Le bonheur',
   'Épicure invite à rechercher : ', 'mcq',
   '["Les plaisirs naturels et nécessaires, en écartant les désirs vains", "Tous les plaisirs sans limite", "La souffrance", "La gloire et la richesse illimitée"]', 0,
   'Épicure trie les désirs : il faut satisfaire les désirs naturels et nécessaires et écarter les désirs vains.', 5),
  ('14410000-0000-4000-8000-000000000306'::uuid, 'Le bonheur',
   'Pour les stoïciens, la sagesse consiste d''abord à : ', 'mcq',
   '["Distinguer ce qui dépend de nous de ce qui n''en dépend pas", "Fuir toute société", "Accumuler des richesses", "Nier ses pensées"]', 0,
   'Les stoïciens distinguent ce qui dépend de nous (nos jugements) de ce qui n''en dépend pas, pour n''être troublé que par le premier.', 6),
  ('14410000-0000-4000-8000-000000000307'::uuid, 'Le bonheur',
   'Pour Épicure, tous les désirs doivent être satisfaits sans aucune limite.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : Épicure écarte les désirs vains (sans fin) et recommande des plaisirs simples et stables.', 7),
  ('14410000-0000-4000-8000-000000000308'::uuid, 'Le bonheur',
   'L''ataraxie recherchée par Épicure et les stoïciens désigne : ', 'mcq',
   '["L''absence de trouble, la tranquillité de l''âme", "La richesse", "Le pouvoir politique", "La force physique"]', 0,
   'L''ataraxie est l''absence de trouble, l''état de sérénité de l''âme visé par ces sagesses.', 8),
  ('14410000-0000-4000-8000-000000000309'::uuid, 'Le bonheur',
   'Selon les stoïciens, il est sage de vouloir changer ce qui ne dépend pas de nous.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le sage stoïcien accepte ce qui ne dépend pas de lui et n''agit que sur ce qui en dépend.', 9),
  ('14410000-0000-4000-8000-000000000310'::uuid, 'Le bonheur',
   'Un grand débat antique sur le bonheur oppose : ', 'mcq',
   '["Satisfaire tous ses désirs OU les maîtriser", "Manger OU dormir", "Marcher OU courir", "Lire OU écrire"]', 0,
   'La question est de savoir si le bonheur consiste à satisfaire tous ses désirs ou, au contraire, à les maîtriser.', 10),

  -- Chapitre 4 — La justice et le droit
  ('14410000-0000-4000-8000-000000000404'::uuid, 'La justice et le droit',
   'Le droit positif désigne : ', 'mcq',
   '["L''ensemble des lois effectivement en vigueur dans une société", "Les droits universels de l''homme", "La loi du plus fort", "Un sentiment personnel"]', 0,
   'Le droit positif est le droit posé et appliqué dans une société donnée, écrit et sanctionné par l''État.', 4),
  ('14410000-0000-4000-8000-000000000405'::uuid, 'La justice et le droit',
   'Le droit naturel désigne : ', 'mcq',
   '["Des droits universels attachés à l''homme, indépendants des lois écrites", "Les lois de la nature physique", "Le règlement d''un pays", "La coutume locale"]', 0,
   'Le droit naturel renvoie à des droits universels de l''homme, qui servent à juger les lois positives.', 5),
  ('14410000-0000-4000-8000-000000000406'::uuid, 'La justice et le droit',
   'Ce qui est légal est toujours juste (légitime).', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : une loi peut être légale (en vigueur) et pourtant injuste, donc illégitime. Légal ≠ légitime.', 6),
  ('14410000-0000-4000-8000-000000000407'::uuid, 'La justice et le droit',
   'L''équité, selon Aristote, consiste à : ', 'mcq',
   '["Corriger la loi générale pour l''adapter au cas particulier", "Appliquer la loi sans exception", "Favoriser les puissants", "Supprimer toutes les lois"]', 0,
   'L''équité corrige la rigidité de la loi générale en l''adaptant au cas particulier, pour rétablir la justice.', 7),
  ('14410000-0000-4000-8000-000000000408'::uuid, 'La justice et le droit',
   'Pour Rousseau, une loi juste doit exprimer : ', 'mcq',
   '["La volonté générale", "La volonté du plus fort", "Le caprice du roi", "Le hasard"]', 0,
   'Chez Rousseau, la loi n''est juste que si elle exprime la volonté générale, tournée vers l''intérêt commun.', 8),
  ('14410000-0000-4000-8000-000000000409'::uuid, 'La justice et le droit',
   'L''égalité devant la loi signifie que la loi s''applique de la même façon à tous.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''égalité devant la loi veut que la même règle vaille pour tous, sans privilège.', 9),
  ('14410000-0000-4000-8000-000000000410'::uuid, 'La justice et le droit',
   'Distinguer « légal » et « légitime » permet surtout de : ', 'mcq',
   '["Juger si une loi en vigueur est réellement juste", "Écrire plus de lois", "Supprimer les tribunaux", "Obéir aveuglément"]', 0,
   'La distinction légal/légitime autorise à critiquer une loi en vigueur au nom de la justice.', 10),

  -- Chapitre 5 — La vérité et la raison
  ('14410000-0000-4000-8000-000000000504'::uuid, 'La vérité et la raison',
   'La vérité se définit d''abord comme : ', 'mcq',
   '["L''accord de la pensée avec ce qui est", "Ce que chacun préfère croire", "Le résultat d''un vote", "Un sentiment agréable"]', 0,
   'Une affirmation est vraie si elle dit ce qui est : la vérité est l''accord de la pensée avec son objet.', 4),
  ('14410000-0000-4000-8000-000000000505'::uuid, 'La vérité et la raison',
   'L''opinion se distingue de la vérité parce qu''elle est : ', 'mcq',
   '["Une croyance non justifiée, vraie ou fausse par hasard", "Toujours vraie", "Toujours fausse", "Une démonstration rigoureuse"]', 0,
   'L''opinion (doxa) est une croyance non justifiée : elle peut se trouver vraie, mais sans savoir pourquoi.', 5),
  ('14410000-0000-4000-8000-000000000506'::uuid, 'La vérité et la raison',
   'Démontrer une vérité, c''est : ', 'mcq',
   '["L''enchaîner logiquement à partir de prémisses ou d''axiomes", "La proclamer avec force", "La faire voter", "La ressentir"]', 0,
   'La démonstration établit une vérité par un enchaînement logique à partir d''axiomes ou de prémisses admis.', 6),
  ('14410000-0000-4000-8000-000000000507'::uuid, 'La vérité et la raison',
   'Pour Platon, l''opinion (doxa) vaut autant que la connaissance vraie (épistémè).', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : Platon oppose la doxa (opinion) à l''épistémè (connaissance justifiée), qui seule est un vrai savoir.', 7),
  ('14410000-0000-4000-8000-000000000508'::uuid, 'La vérité et la raison',
   'L''allégorie de la caverne, qui illustre l''accès à la vérité, est de : ', 'mcq',
   '["Platon", "Freud", "Épicure", "Rousseau"]', 0,
   'L''allégorie de la caverne, où l''on passe des ombres à la lumière, est due à Platon.', 8),
  ('14410000-0000-4000-8000-000000000509'::uuid, 'La vérité et la raison',
   'Une vérité scientifique se distingue d''une opinion parce qu''elle peut être démontrée ou vérifiée.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La science vise des vérités universelles, démontrées (mathématiques) ou vérifiées par l''expérience.', 9),
  ('14410000-0000-4000-8000-000000000510'::uuid, 'La vérité et la raison',
   'L''inscription « Nul n''entre ici s''il n''est géomètre » rappelle, chez Platon, l''exigence de : ', 'mcq',
   '["La raison et de la démonstration", "La force physique", "La richesse", "L''obéissance politique"]', 0,
   'Au fronton de l''Académie, cette formule souligne l''exigence de rigueur rationnelle et démonstrative.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'philosophie'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BAC — lessons.content de « Exercices types » (position 2)
--    Par notion : 1 dissertation (analyse du sujet + plan détaillé) et
--    1 amorce d'explication de texte, avec méthode / correction.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('La conscience et l''inconscient', $md$# Exercices types — La conscience et l'inconscient

## Exercice 1 — Dissertation
**Sujet : Suis-je ce que j'ai conscience d'être ?**

### Analyse du sujet
« Suis-je » interroge mon être, mon identité de sujet. « Ce que j'ai conscience d'être » désigne l'image que ma conscience me donne de moi-même. Le sujet demande si cette image est **complète et fiable** : ma conscience épuise-t-elle mon être, ou une part de moi lui échappe-t-elle ? L'enjeu oppose la **transparence** du sujet (Descartes) à son **opacité** (Freud).

### Plan détaillé
- **I. Je suis d'abord ce dont j'ai conscience.** La conscience de soi (Descartes, le cogito) fonde mon identité et ma certitude d'exister. Je me connais immédiatement comme le sujet de mes pensées et de mes actes.
- **II. Mais ma conscience ne me livre pas tout de moi.** L'hypothèse de l'inconscient (Freud) : lapsus, rêves, actes manqués révèlent des désirs refoulés. « Le moi n'est pas maître dans sa propre maison » : je suis aussi ce que j'ignore de moi.
- **III. Me connaître est une tâche, non un donné.** Entre l'illusion de tout savoir de soi et le renoncement, la connaissance de soi passe par un travail (retour réflexif, parole, autrui) : je deviens sujet en cherchant à me comprendre.

## Exercice 2 — Explication de texte (amorce)
> « Il faut, pour bien faire, que je rejette [...] toutes les choses dont je pourrai imaginer le moindre doute [...]. Mais aussitôt après je pris garde que, pendant que je voulais ainsi penser que tout était faux, il fallait nécessairement que moi qui le pensais fusse quelque chose. » — **Descartes**, *Discours de la méthode*.

### Méthode / éléments d'explication
- **Thèse du texte :** même en doutant de tout, il reste une certitude — celle que je pense, donc que j'existe (le cogito).
- **Mouvement du texte :** (1) le doute radical rejette tout ce qui peut être mis en doute ; (2) mais l'acte même de douter suppose un sujet qui pense ; (3) d'où la première vérité indubitable : « je suis quelque chose ».
- **Enjeu :** fonder tout le savoir sur la conscience de soi. On peut prolonger en discutant la limite de cette transparence (Freud), pour montrer l'intérêt et les bornes du texte.$md$),

    ('La liberté', $md$# Exercices types — La liberté

## Exercice 1 — Dissertation
**Sujet : Sommes-nous libres de nos choix ?**

### Analyse du sujet
« Libres » renvoie au libre arbitre : le pouvoir de choisir par sa seule volonté. « De nos choix » désigne nos décisions. Le sujet demande si nos choix sont vraiment **les nôtres** ou s'ils sont **déterminés** par des causes que nous ignorons. Le sentiment de choisir suffit-il à prouver la liberté ?

### Plan détaillé
- **I. Nous avons le sentiment de choisir librement.** Le libre arbitre fonde la responsabilité : je me sens l'auteur de mes actes, capable d'agir autrement. Sans lui, ni mérite ni faute n'auraient de sens.
- **II. Mais nos choix ont des causes.** Le déterminisme : éducation, désirs, histoire personnelle orientent nos décisions. Selon Spinoza, le sentiment de liberté n'est que l'ignorance des causes qui nous meuvent.
- **III. La liberté comme conquête.** Chez Sartre, l'homme est « condamné à être libre » et responsable ; chez Rousseau, obéir à la loi qu'on se donne rend libre. Être libre, ce n'est pas être sans cause, mais s'approprier ses actes et se donner sa règle.

## Exercice 2 — Explication de texte (amorce)
> « Les hommes se trompent en ce qu'ils se croient libres, opinion qui consiste en cela seul qu'ils sont conscients de leurs actions et ignorants des causes par lesquelles ils sont déterminés. » — **Spinoza**, *Éthique*.

### Méthode / éléments d'explication
- **Thèse du texte :** le sentiment de liberté est une illusion née de l'ignorance des causes de nos actions.
- **Mouvement du texte :** (1) les hommes se croient libres ; (2) parce qu'ils ont conscience de ce qu'ils font ; (3) mais ignorent ce qui les détermine à le faire. La conscience de l'action masque la cause.
- **Enjeu :** critiquer le libre arbitre au nom du déterminisme. On peut discuter en objectant que reconnaître ses déterminations peut être un premier pas vers une liberté réelle.$md$),

    ('Le bonheur', $md$# Exercices types — Le bonheur

## Exercice 1 — Dissertation
**Sujet : Le bonheur consiste-t-il à satisfaire tous ses désirs ?**

### Analyse du sujet
« Le bonheur » : satisfaction durable et complète. « Satisfaire tous ses désirs » : les combler sans exception ni limite. « Consiste-t-il » demande si le bonheur **s'identifie** à cette satisfaction totale. Le sujet oppose une conception du bonheur comme **accumulation** de plaisirs et une conception comme **maîtrise** des désirs.

### Plan détaillé
- **I. Spontanément, être heureux, c'est satisfaire ses désirs.** Le désir insatisfait est souffrance ; combler ses désirs semble donc la voie du bonheur.
- **II. Mais vouloir tout satisfaire rend malheureux.** Le désir renaît sans fin (le « tonneau percé » des Danaïdes) ; les désirs vains (Épicure) sont sans limite. Poursuivre tous ses désirs, c'est courir après un bonheur toujours fuyant.
- **III. Le bonheur suppose de maîtriser ses désirs.** Épicure trie les désirs et vise l'ataraxie ; les stoïciens n'attachent leur bonheur qu'à ce qui dépend d'eux ; Aristote lie le bonheur à une activité vertueuse. Le bonheur tient moins à désirer *plus* qu'à désirer *mieux*.

## Exercice 2 — Explication de texte (amorce)
> « Il faut se persuader que de tous les biens que la sagesse nous procure pour l'entière félicité de la vie, le plus grand de tous est l'acquisition de l'amitié. » — **Épicure**, *Lettre à Ménécée* (contexte : le tri des désirs et la recherche des plaisirs stables).

### Méthode / éléments d'explication
- **Thèse du texte :** le bonheur ne vient pas de la satisfaction illimitée des désirs, mais de biens simples et stables (ici l'amitié).
- **Mouvement à dégager :** distinguer les plaisirs stables (amitié, sécurité de l'âme) des plaisirs vains ; montrer que la sagesse consiste à choisir ses plaisirs, non à les multiplier.
- **Enjeu :** relier le texte à l'ataraxie épicurienne. On peut discuter en confrontant cette sobriété au désir d'intensité et à l'idée que le bonheur suppose aussi le mouvement du désir.$md$),

    ('La justice et le droit', $md$# Exercices types — La justice et le droit

## Exercice 1 — Dissertation
**Sujet : Faut-il toujours obéir aux lois ?**

### Analyse du sujet
« Faut-il » a un sens à la fois moral et prudentiel (est-ce un devoir ? est-ce sage ?). « Toujours » signale l'universalité : sans aucune exception ? « Obéir aux lois » : se soumettre au droit positif en vigueur. Le sujet suppose l'écart possible entre **légal** et **légitime** : une loi peut-elle être injuste au point qu'on doive lui désobéir ?

### Plan détaillé
- **I. Il faut obéir aux lois.** Sans obéissance, c'est la loi du plus fort et l'insécurité. Le droit remplace la force par la règle et protège chacun ; obéir à la loi, c'est préférer l'ordre juste au chaos.
- **II. Mais toute loi n'est pas juste.** Distinction légal / légitime : des lois légales ont été injustes (esclavage). Au nom du droit naturel et de la justice, une loi peut être critiquée, voire désobéie (désobéissance civile).
- **III. Obéir en citoyen, non en sujet aveugle.** Chez Rousseau, la loi juste exprime la volonté générale : on lui obéit parce qu'on se la donne. L'obéissance légitime suppose des lois justes et des voies pour les corriger.

## Exercice 2 — Explication de texte (amorce)
> « L'obéissance à la loi qu'on s'est prescrite est liberté. » — **Rousseau**, *Du contrat social*.

### Méthode / éléments d'explication
- **Thèse du texte :** obéir n'est pas nécessairement s'aliéner ; obéir à une loi qu'on s'est donnée soi-même, c'est être libre (autonomie).
- **Mouvement à dégager :** distinguer l'obéissance à un maître (hétéronomie, servitude) de l'obéissance à la loi commune que le citoyen a voulue ; montrer comment justice et liberté se rejoignent dans la volonté générale.
- **Enjeu :** penser une obéissance compatible avec la liberté. On peut discuter les conditions réelles (comment garantir que la loi exprime bien la volonté de tous ?).$md$),

    ('La vérité et la raison', $md$# Exercices types — La vérité et la raison

## Exercice 1 — Dissertation
**Sujet : Peut-on parler de « sa » vérité ?**

### Analyse du sujet
« Peut-on » : est-ce légitime, cohérent ? « Parler de sa vérité » : l'expression courante « à chacun sa vérité » suppose que la vérité serait personnelle, relative. Le sujet interroge cette confusion possible entre **vérité** (une, universelle) et **opinion** (variable, subjective). Une vérité peut-elle être « à moi » ?

### Plan détaillé
- **I. Chacun semble avoir « sa » vérité.** Nos convictions diffèrent, nos points de vue varient : l'expérience du désaccord suggère une pluralité de vérités.
- **II. Mais la vérité ne peut être personnelle.** La vérité est l'accord de la pensée avec ce qui est ; elle vaut pour tous. Ce que chacun tient pour vrai sans le prouver est une opinion (doxa), non une vérité. Une opinion vraie « par hasard » n'est pas un savoir (Platon).
- **III. Passer de l'opinion à la vérité.** Par la raison, la démonstration et l'expérience, on quitte les apparences (caverne de Platon) pour des vérités universelles. « Sa » vérité doit se soumettre à l'épreuve du vrai partagé.

## Exercice 2 — Explication de texte (amorce)
> « L'opinion vraie [...] est belle et utile tant qu'elle demeure ; mais elle ne demeure pas longtemps [...] tant qu'on ne les a pas attachées par un raisonnement de cause. » — **Platon**, *Ménon* (à propos de la différence entre opinion droite et connaissance).

### Méthode / éléments d'explication
- **Thèse du texte :** une opinion peut être vraie, mais elle reste fragile tant qu'elle n'est pas justifiée ; seule la connaissance, « attachée » par la raison, est stable.
- **Mouvement à dégager :** distinguer l'opinion vraie (correcte mais non fondée) et la connaissance (vraie et justifiée par ses causes) ; montrer le rôle de la démonstration.
- **Enjeu :** comprendre pourquoi la vérité exige d'être fondée en raison, et pas seulement affirmée. On peut relier à l'exigence scientifique de preuve.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'philosophie'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
