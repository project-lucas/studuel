-- =============================================================================
-- Studuel — Migration 121 : CONTENU Latin 3e (+ exercices types)
-- Remplit les 3 chapitres de Latin 3e (langue + civilisation) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (3 → 10 questions). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant), positions 4→10.
--   4. Exercices   → lessons.content de « Exercices types » (exercices corrigés)
--
-- Motif idempotent (comme 090/112) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons (Latin 3e), mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (3 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Rhétorique et citoyenneté', $md$# Rhétorique et citoyenneté

## Ce que tu vas comprendre
À Rome, savoir parler en public était une arme politique. La rhétorique (l'art oratoire) permettait de convaincre au tribunal et au Sénat. Ce chapitre présente l'éloquence, le grand orateur Cicéron, les institutions de la République et ce que signifiait être citoyen.

## 1. L'art oratoire
La rhétorique (*rhetorica*) est l'art de bien parler pour **convaincre**. Un discours se prépare en plusieurs étapes : trouver les idées (*inventio*), les mettre en ordre (*dispositio*), les habiller de mots (*elocutio*), les mémoriser (*memoria*), puis les prononcer (*actio*).

L'orateur cherche à **instruire**, à **plaire** et à **émouvoir** son auditoire.

## 2. Cicéron, le maître de l'éloquence
**Cicéron** (*Cicero*, 106-43 av. J.-C.) est le plus célèbre orateur romain. Avocat et homme politique, il défend la République dans ses discours. Ses attaques contre le conspirateur **Catilina** (les *Catilinaires*) s'ouvrent sur la formule fameuse : « *Quo usque tandem…?* » (« Jusqu'à quand abuseras-tu de notre patience ? »).

## 3. Les institutions de la République
La *res publica* (« la chose publique ») repose sur trois pouvoirs :
- les **magistrats** (consuls, préteurs…) qui gouvernent ;
- le **Sénat** (*senatus*), assemblée qui conseille ;
- les **comices**, assemblées du peuple qui votent.

La devise **SPQR** (*Senatus PopulusQue Romanus*, « le Sénat et le peuple romain ») résume ce partage.

## 4. Être citoyen romain
Le **citoyen** (*civis*) a des droits : voter, être jugé selon la loi, faire du commerce. Dire « *civis Romanus sum* » (« je suis citoyen romain ») protégeait où qu'on se trouve dans l'Empire. La parole publique était réservée aux citoyens libres : l'éloquence et la citoyenneté vont donc ensemble.

## L'essentiel à retenir
- La **rhétorique** est l'art de convaincre ; le discours suit 5 étapes (*inventio* → *actio*).
- **Cicéron** est le grand orateur qui défend la République contre **Catilina**.
- Institutions : **magistrats**, **Sénat**, **comices** ; devise **SPQR**.
- Le **citoyen** (*civis*) a le droit de vote et la protection de la loi.$md$),

    ('L''Empire romain', $md$# L'Empire romain

## Ce que tu vas comprendre
Après des siècles de République, Rome devient un **Empire** dirigé par un seul homme, l'empereur. Ce chapitre suit l'histoire de l'Empire, d'Auguste à sa chute, et montre comment Rome a diffusé sa civilisation : c'est la **romanisation**.

## 1. Auguste, le premier empereur
En **27 av. J.-C.**, Octave reçoit le titre d'**Auguste** (« le vénérable ») et devient le premier **empereur** (*imperator*). Il garde les apparences de la République mais concentre tous les pouvoirs. Il ouvre une longue période de paix.

## 2. La Pax Romana
La **Pax Romana** (« paix romaine ») est une période de stabilité et de prospérité qui dure environ **deux siècles** (I<sup>er</sup>-II<sup>e</sup> s. apr. J.-C.). Le commerce circule sur les routes et sur la Méditerranée, appelée **Mare Nostrum** (« notre mer »). Les villes se développent partout.

## 3. Les empereurs
Après Auguste se succèdent de nombreux empereurs, bons ou mauvais : **Néron**, resté célèbre pour l'incendie de Rome ; **Trajan**, qui étend l'Empire au maximum ; **Marc Aurèle**, l'empereur philosophe. Le pouvoir se transmet par héritage, par adoption ou par le soutien de l'armée.

## 4. La romanisation et la chute
La **romanisation** est la diffusion du mode de vie romain : la langue **latine**, le **droit**, les villes avec forum, thermes, arènes et aqueducs. En **212**, l'édit de **Caracalla** accorde la citoyenneté à presque tous les habitants libres.

Affaibli par les crises et les invasions, l'Empire romain d'Occident s'effondre en **476 apr. J.-C.**

## L'essentiel à retenir
- **Auguste** (27 av. J.-C.) est le premier empereur ; il installe le pouvoir d'un seul.
- La **Pax Romana** : deux siècles de paix et de prospérité ; **Mare Nostrum**.
- Empereurs marquants : **Néron**, **Trajan**, **Marc Aurèle**.
- **Romanisation** (langue, villes, droit) ; chute de l'Empire d'Occident en **476**.$md$),

    ('Traduire des textes authentiques', $md$# Traduire des textes authentiques

## Ce que tu vas comprendre
En 3e, tu ne traduis plus seulement des phrases inventées, mais de vrais textes d'auteurs latins. Traduire demande une **méthode** : repérer le verbe, analyser les cas, puis reconstruire une phrase française correcte.

## 1. La méthode de traduction
On ne traduit pas mot à mot dans l'ordre. On procède par étapes :
1. lire la phrase latine **en entier** ;
2. repérer le **verbe** conjugué ;
3. chercher le **sujet** (au nominatif) ;
4. identifier les **compléments** grâce aux cas ;
5. reconstruire une **phrase française** naturelle.

## 2. Repérer le verbe
Le **verbe** est le cœur de la phrase. Sa terminaison donne la personne et le nombre : **-t** = il/elle, **-nt** = ils/elles. En latin, le verbe est souvent placé **à la fin** de la phrase.

*Exemple : dans « Puella rosam amat », le verbe est **amat** (« elle aime »).*

## 3. Les cas et leur fonction
La **fonction** d'un mot dépend de son **cas**, pas de sa place :
- **nominatif** = sujet ;
- **accusatif** = complément d'objet direct (COD) ;
- **génitif** = complément du nom (« de ») ;
- **datif** = complément d'attribution (« à ») ;
- **ablatif** = compléments circonstanciels (moyen, lieu, temps).

*« Puella rosam amat » = « La jeune fille aime la rose » (puella nominatif = sujet, rosam accusatif = COD).*

## 4. Les textes d'auteurs
On lit des extraits de grands auteurs : **César** et sa *Guerre des Gaules*, **Cicéron** et ses discours, **Virgile** et l'*Énéide*, **Ovide** et ses *Métamorphoses*. Un bon **dictionnaire** et la maîtrise des **déclinaisons** sont indispensables.

## L'essentiel à retenir
- Traduire suit une **méthode** : verbe → sujet → compléments → phrase française.
- Le **verbe** (souvent en fin de phrase) donne la personne : **-t** = il, **-nt** = ils.
- La **fonction** dépend du **cas** : nominatif = sujet, accusatif = COD, ablatif = circonstanciel.
- Textes d'auteurs : **César**, **Cicéron**, **Virgile**, **Ovide**.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'latin'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (3 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Rhétorique et citoyenneté', $json${
      "centre": "Rhétorique et citoyenneté",
      "branches": [
        { "titre": "L'art oratoire", "enfants": ["Convaincre par la parole", "5 étapes : inventio → actio", "Instruire, plaire, émouvoir"] },
        { "titre": "Cicéron", "enfants": ["Le plus grand orateur", "Défend la République", "Contre Catilina"] },
        { "titre": "Les institutions", "enfants": ["Magistrats (consuls…)", "Sénat et comices", "Devise SPQR"] },
        { "titre": "Le citoyen", "enfants": ["Civis : droit de vote", "Protégé par la loi", "Civis Romanus sum"] }
      ]
    }$json$),
    ('L''Empire romain', $json${
      "centre": "L'Empire romain",
      "branches": [
        { "titre": "Auguste", "enfants": ["Premier empereur (27 av. J.-C.)", "Pouvoir d'un seul", "Fin de la République"] },
        { "titre": "Pax Romana", "enfants": ["Deux siècles de paix", "Commerce et prospérité", "Mare Nostrum"] },
        { "titre": "Les empereurs", "enfants": ["Néron, Trajan", "Marc Aurèle", "Héritage, adoption, armée"] },
        { "titre": "Romanisation et chute", "enfants": ["Langue, villes, droit", "Édit de Caracalla (212)", "Chute en 476"] }
      ]
    }$json$),
    ('Traduire des textes authentiques', $json${
      "centre": "Traduire des textes authentiques",
      "branches": [
        { "titre": "La méthode", "enfants": ["Lire toute la phrase", "Verbe → sujet → compléments", "Phrase française naturelle"] },
        { "titre": "Repérer le verbe", "enfants": ["Cœur de la phrase", "-t = il, -nt = ils", "Souvent en fin de phrase"] },
        { "titre": "Les cas", "enfants": ["Nominatif = sujet", "Accusatif = COD", "Ablatif = circonstanciel"] },
        { "titre": "Textes d'auteurs", "enfants": ["César, Cicéron", "Virgile, Ovide", "Dictionnaire + déclinaisons"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'latin'
 WHERE c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Latin', '3e', v.chapter, true, l.id
FROM (VALUES
  ('12119999-0000-4000-8000-000000000001'::uuid, 'Rhétorique et citoyenneté'),
  ('12119999-0000-4000-8000-000000000002'::uuid, 'L''Empire romain'),
  ('12119999-0000-4000-8000-000000000003'::uuid, 'Traduire des textes authentiques')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'latin'
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
  -- Chapitre 1 — Rhétorique et citoyenneté
  ('12110000-0000-4000-8000-000000000104'::uuid, 'Rhétorique et citoyenneté',
   'Comment appelle-t-on l''art de bien parler pour convaincre ?', 'mcq',
   '["La rhétorique", "La grammaire", "La philosophie", "L''arithmétique"]', 0,
   'La rhétorique (rhetorica) est l''art oratoire, l''art de convaincre par la parole.', 4),
  ('12110000-0000-4000-8000-000000000105'::uuid, 'Rhétorique et citoyenneté',
   'Quel orateur romain a combattu Catilina par ses discours ?', 'mcq',
   '["Cicéron", "Néron", "Auguste", "Virgile"]', 0,
   'Cicéron défend la République et attaque Catilina dans ses discours (les Catilinaires).', 5),
  ('12110000-0000-4000-8000-000000000106'::uuid, 'Rhétorique et citoyenneté',
   'La devise SPQR signifie « le Sénat et le peuple romain ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'SPQR = Senatus PopulusQue Romanus, « le Sénat et le peuple romain ».', 6),
  ('12110000-0000-4000-8000-000000000107'::uuid, 'Rhétorique et citoyenneté',
   'Quelle assemblée conseillait les magistrats à Rome ?', 'mcq',
   '["Le Sénat", "Les comices", "L''armée", "Le forum"]', 0,
   'Le Sénat (senatus) est l''assemblée qui conseille ; les comices font voter le peuple.', 7),
  ('12110000-0000-4000-8000-000000000108'::uuid, 'Rhétorique et citoyenneté',
   'Que voulait dire « civis Romanus sum » ?', 'mcq',
   '["Je suis citoyen romain", "Je suis esclave", "Je suis empereur", "Je suis soldat"]', 0,
   'Cette formule affirmait la citoyenneté romaine et la protection qu''elle donnait.', 8),
  ('12110000-0000-4000-8000-000000000109'::uuid, 'Rhétorique et citoyenneté',
   'La première étape d''un discours est l''inventio, la recherche des idées.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''ordre des étapes est : inventio, dispositio, elocutio, memoria, actio.', 9),
  ('12110000-0000-4000-8000-000000000110'::uuid, 'Rhétorique et citoyenneté',
   'Quel droit important le citoyen (civis) possédait-il ?', 'mcq',
   '["Voter", "Ne payer aucun impôt", "Commander seul l''armée", "Être roi"]', 0,
   'Le citoyen avait notamment le droit de vote et la protection de la loi.', 10),

  -- Chapitre 2 — L'Empire romain
  ('12110000-0000-4000-8000-000000000204'::uuid, 'L''Empire romain',
   'Qui fut le premier empereur romain ?', 'mcq',
   '["Auguste", "Jules César", "Néron", "Romulus"]', 0,
   'En 27 av. J.-C., Octave devient Auguste, le premier empereur.', 4),
  ('12110000-0000-4000-8000-000000000205'::uuid, 'L''Empire romain',
   'Comment appelle-t-on la longue période de paix de l''Empire ?', 'mcq',
   '["La Pax Romana", "La République", "Le cursus honorum", "La romanisation"]', 0,
   'La Pax Romana est une période d''environ deux siècles de paix et de prospérité.', 5),
  ('12110000-0000-4000-8000-000000000206'::uuid, 'L''Empire romain',
   'Les Romains appelaient la Méditerranée Mare Nostrum, « notre mer ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Mare Nostrum (« notre mer ») désignait la Méditerranée, contrôlée par Rome.', 6),
  ('12110000-0000-4000-8000-000000000207'::uuid, 'L''Empire romain',
   'Quel empereur est resté célèbre pour l''incendie de Rome ?', 'mcq',
   '["Néron", "Trajan", "Marc Aurèle", "Auguste"]', 0,
   'Néron est resté célèbre pour l''incendie de Rome (64 apr. J.-C.).', 7),
  ('12110000-0000-4000-8000-000000000208'::uuid, 'L''Empire romain',
   'Que désigne la romanisation ?', 'mcq',
   '["La diffusion du mode de vie romain", "La chute de Rome", "Une bataille", "Un impôt"]', 0,
   'La romanisation est la diffusion du mode de vie romain : langue, villes, droit.', 8),
  ('12110000-0000-4000-8000-000000000209'::uuid, 'L''Empire romain',
   'L''Empire romain d''Occident s''est effondré en 476 apr. J.-C.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Affaibli par les crises et les invasions, l''Empire d''Occident tombe en 476.', 9),
  ('12110000-0000-4000-8000-000000000210'::uuid, 'L''Empire romain',
   'En 212, quel édit accorde la citoyenneté à presque tous les habitants libres ?', 'mcq',
   '["L''édit de Caracalla", "L''édit de Néron", "L''édit de Trajan", "L''édit d''Auguste"]', 0,
   'L''édit de Caracalla (212) donne la citoyenneté à presque tous les habitants libres.', 10),

  -- Chapitre 3 — Traduire des textes authentiques
  ('12110000-0000-4000-8000-000000000304'::uuid, 'Traduire des textes authentiques',
   'Par quel élément faut-il commencer pour traduire une phrase latine ?', 'mcq',
   '["Repérer le verbe", "Traduire mot à mot", "Compter les mots", "Lire la dernière lettre"]', 0,
   'Après avoir lu la phrase en entier, on repère le verbe conjugué.', 4),
  ('12110000-0000-4000-8000-000000000305'::uuid, 'Traduire des textes authentiques',
   'À quel cas se trouve le sujet d''une phrase latine ?', 'mcq',
   '["Au nominatif", "À l''accusatif", "Au génitif", "Au datif"]', 0,
   'Le sujet se met au nominatif.', 5),
  ('12110000-0000-4000-8000-000000000306'::uuid, 'Traduire des textes authentiques',
   'Le complément d''objet direct (COD) se met à quel cas ?', 'mcq',
   '["À l''accusatif", "Au nominatif", "À l''ablatif", "Au vocatif"]', 0,
   'Le COD se met à l''accusatif.', 6),
  ('12110000-0000-4000-8000-000000000307'::uuid, 'Traduire des textes authentiques',
   'En latin, le verbe est souvent placé à la fin de la phrase.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le verbe latin se trouve fréquemment en fin de phrase.', 7),
  ('12110000-0000-4000-8000-000000000308'::uuid, 'Traduire des textes authentiques',
   'Dans « Puella rosam amat », quel mot est le sujet ?', 'mcq',
   '["Puella", "Rosam", "Amat", "Aucun"]', 0,
   'Puella est au nominatif : c''est le sujet (« la jeune fille »).', 8),
  ('12110000-0000-4000-8000-000000000309'::uuid, 'Traduire des textes authentiques',
   'En latin, c''est la place du mot dans la phrase qui indique sa fonction.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : c''est le cas (la terminaison), et non la place, qui donne la fonction.', 9),
  ('12110000-0000-4000-8000-000000000310'::uuid, 'Traduire des textes authentiques',
   'Quel auteur a écrit la Guerre des Gaules ?', 'mcq',
   '["César", "Ovide", "Cicéron", "Virgile"]', 0,
   'César raconte la conquête de la Gaule dans la Guerre des Gaules (De Bello Gallico).', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'latin'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPES — lessons.content de « Exercices types » (3 chapitres)
--    Même jointure que le cours, mais leçon « Exercices types » (position 2).
--    Chaque fiche : 2 exercices corrigés (analyse/traduction + civilisation).
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Rhétorique et citoyenneté', $md$# Exercices — Rhétorique et citoyenneté

## Exercice 1 — Analyser une phrase
Traduis et analyse cette phrase célèbre :
**« Civis Romanus sum. »**
1. Repère le verbe et donne sa personne.
2. Traduis la phrase.
3. Que révèle-t-elle sur les droits de celui qui la prononce ?

### Correction
1. Le verbe est **sum** (« je suis »), à la 1<sup>re</sup> personne du singulier.
2. Traduction : « Je suis citoyen romain. »
3. Elle affirme la **citoyenneté** : celui qui la prononce a des droits (voter, être protégé par la loi) et réclame cette protection où qu'il soit dans l'Empire.

## Exercice 2 — Civilisation
Réponds aux questions sur les institutions romaines :
1. Que signifie la devise **SPQR** ?
2. Cite les trois éléments qui se partagent le pouvoir sous la République.
3. Nomme le plus célèbre orateur romain et son adversaire.

### Correction
1. **SPQR** = *Senatus PopulusQue Romanus*, « le Sénat et le peuple romain ».
2. Les **magistrats** (consuls, préteurs…), le **Sénat** et les **comices** (assemblées du peuple).
3. **Cicéron**, qui combat le conspirateur **Catilina** dans ses discours (les *Catilinaires*).$md$),

    ('L''Empire romain', $md$# Exercices — L'Empire romain

## Exercice 1 — Analyser une phrase
Observe cette courte phrase (*imperium, -i* : le pouvoir ; *teneo, -es, tenere* : détenir) :
**« Augustus imperium tenet. »**
1. Repère le verbe et son sujet.
2. À quel cas se trouve *imperium* et quelle est sa fonction ?
3. Traduis la phrase.

### Correction
1. Verbe : **tenet** (« il détient ») ; sujet : **Augustus** (nominatif).
2. **imperium** est à l'**accusatif** : c'est le **COD**.
3. Traduction : « Auguste détient le pouvoir. »

## Exercice 2 — Civilisation
Réponds sur l'histoire de l'Empire :
1. En quelle année Octave devient-il Auguste, premier empereur ?
2. Qu'est-ce que la **Pax Romana** ?
3. En quelle année tombe l'Empire romain d'Occident ?

### Correction
1. En **27 av. J.-C.**
2. La **Pax Romana** est une période d'environ **deux siècles** de **paix** et de **prospérité** dans tout l'Empire.
3. En **476 apr. J.-C.**$md$),

    ('Traduire des textes authentiques', $md$# Exercices — Traduire des textes authentiques

## Exercice 1 — Traduire une phrase
Traduis en suivant la méthode (*puella* : la jeune fille ; *rosa* : la rose ; *amo, amas, amare* : aimer) :
**« Puella rosam amat. »**
1. Repère le verbe.
2. Trouve le sujet (nominatif) et le COD (accusatif).
3. Propose une traduction en français.

### Correction
1. Le verbe est **amat** (« elle aime »), 3<sup>e</sup> personne du singulier.
2. Sujet : **puella** (nominatif) ; COD : **rosam** (accusatif).
3. Traduction : « La jeune fille aime la rose. »

## Exercice 2 — Analyser les cas
Dans la phrase suivante (*do, das, dare* : donner ; *liber, libri* : le livre) :
**« Marcus librum puellae dat. »**
1. Quelle est la fonction de *Marcus* ?
2. À quel cas est *puellae* et que traduit-il ?
3. Traduis la phrase entière.

### Correction
1. **Marcus** est au **nominatif** : c'est le **sujet**.
2. **puellae** est au **datif** : complément d'attribution, « à la jeune fille ».
3. Traduction : « Marcus donne un livre à la jeune fille. »$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'latin'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
