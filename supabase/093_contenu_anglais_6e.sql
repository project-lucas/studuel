-- =============================================================================
-- Studuel — Migration 093 : CONTENU Anglais 6e (cours + carte mentale + quiz)
-- Remplit les 5 chapitres d'Anglais 6e (programme cycle 3, langue vivante A1→A2) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder de 008)
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
-- Le cours et les explications sont en FRANÇAIS (cours d'anglais pour
-- francophones) ; les mots et phrases d'exemple sont en anglais.
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
    ('Se présenter et parler de soi', $md$# Se présenter et parler de soi

## Ce que tu vas comprendre
Savoir **te présenter** en anglais, c'est la première chose utile : dire ton nom, ton âge, d'où tu viens et comment tu vas. Ce chapitre te donne les questions et les réponses de base pour parler de toi.

## 1. Dire son nom
Pour demander et donner un nom, on utilise **name** (le nom) :
- *What's your name?* → **Quel est ton nom ?**
- *My name is Tom.* / *I'm Tom.* → **Je m'appelle Tom.**

> **Astuce :** *I'm* est la contraction de *I am*. Le pronom **I** (je) prend **toujours** une majuscule, même au milieu d'une phrase.

## 2. Dire son âge
On utilise le verbe **be** (être), pas *have*, pour donner son âge :

| Français | Anglais |
|---|---|
| Quel âge as-tu ? | *How old are you?* |
| J'ai 11 ans. | *I'm eleven (years old).* |

*Attention au piège : on ne dit pas « I have 11 years », mais **I am 11**.*

## 3. Dire d'où l'on vient
- *Where are you from?* → **D'où viens-tu ?**
- *I'm from France.* → **Je viens de France.**

## 4. Demander comment ça va
- *How are you?* → **Comment vas-tu ?**
- *I'm fine, thank you. And you?* → **Ça va bien, merci. Et toi ?**

## 5. Les salutations
- *Hello* / *Hi* → bonjour / salut
- *Good morning* → bonjour (le matin)
- *Goodbye* / *Bye* → au revoir
- *Nice to meet you* → enchanté(e)

## L'essentiel à retenir
- **What's your name?** → *My name is… / I'm…*
- Pour l'âge, on utilise **be** : *I'm 11*, jamais *I have 11 years*.
- **Where are you from?** → *I'm from…*
- **How are you?** → *I'm fine, thank you.*
- Le pronom **I** s'écrit toujours avec une majuscule.$md$),

    ('Present simple : routines', $md$# Present simple : les routines

## Ce que tu vas comprendre
Le **present simple** sert à parler de ce qu'on fait **d'habitude** : les routines, les habitudes, les goûts. C'est le temps le plus utilisé en anglais. Ce chapitre t'apprend à le former et à ne plus oublier le fameux **-s**.

## 1. À quoi sert le present simple ?
On l'emploie pour une **habitude** ou une **vérité générale** :
- *I get up at 7 o'clock.* → **Je me lève à 7 h.** (tous les jours)
- *She likes music.* → **Elle aime la musique.**

## 2. La forme affirmative
On utilise la **base verbale**… sauf à la **3e personne du singulier** (**he / she / it**) où l'on ajoute **-s** :

| Personne | Exemple |
|---|---|
| I / you / we / they | *I play* — *They play* |
| he / she / it | *He play**s** — *She go**es*** |

*Exemple à retenir : **She plays tennis.** (pas « She play tennis ».)*

## 3. La forme négative
On utilise **don't** (do not), et **doesn't** (does not) à la 3e personne :
- *I don't like coffee.* → **Je n'aime pas le café.**
- *She doesn't like coffee.* → **Elle n'aime pas le café.** (le verbe reperd son -s !)

## 4. Les adverbes de fréquence
Ils disent **à quelle fréquence** on fait quelque chose. Ils se placent **avant** le verbe :

| Anglais | Français |
|---|---|
| always | toujours |
| often | souvent |
| sometimes | parfois |
| never | jamais |

*Exemple : **I always** brush my teeth. → **Je me brosse toujours** les dents.*

## 5. Le vocabulaire des routines
*get up* (se lever), *have breakfast* (prendre le petit-déjeuner), *go to school* (aller à l'école), *do my homework* (faire mes devoirs), *go to bed* (aller au lit).

## L'essentiel à retenir
- Le present simple = **habitudes** et vérités générales.
- 3e personne du singulier (he/she/it) → **on ajoute -s** : *She play**s***.
- Négation : **don't** / **doesn't** (+ verbe **sans** -s).
- Adverbes de fréquence **avant** le verbe : always, often, sometimes, never.$md$),

    ('La famille et les animaux', $md$# La famille et les animaux

## Ce que tu vas comprendre
Ce chapitre te donne le vocabulaire pour présenter ta **famille** et parler des **animaux**, avec la structure *This is my…* et le verbe *have* pour dire ce que tu possèdes.

## 1. La famille (the family)

| Anglais | Français |
|---|---|
| mother / mum | mère / maman |
| father / dad | père / papa |
| sister | sœur |
| brother | frère |
| grandmother | grand-mère |
| grandfather | grand-père |
| aunt / uncle | tante / oncle |
| cousin | cousin(e) |
| parents | les parents |

## 2. Présenter quelqu'un : *This is…*
- *This is my sister.* → **Voici ma sœur.**
- *These are my parents.* → **Voici mes parents.** (pluriel : *these*)

Les adjectifs possessifs : **my** (mon/ma), **your** (ton/ta), **his** (son, à lui), **her** (son, à elle).
*Exemple : **her** brother = **son** frère (à elle).*

## 3. Les animaux (animals)

| Anglais | Français |
|---|---|
| dog | chien |
| cat | chat |
| rabbit | lapin |
| horse | cheval |
| bird | oiseau |
| fish | poisson |

## 4. Dire ce qu'on possède : *have got / have*
- *I have a cat.* / *I've got a cat.* → **J'ai un chat.**
- *She has a dog.* → **Elle a un chien.** (3e personne : *has*)

*Attention : pour un animal, on utilise **a** devant une consonne, **an** devant une voyelle : a dog, **an** owl (une chouette).*

## 5. Décrire vite
- *My dog is big / small.* → Mon chien est grand / petit.
- *It's black and white.* → Il est noir et blanc.

## L'essentiel à retenir
- Vocabulaire famille : mother, father, sister, brother, parents…
- **This is my…** pour présenter (pluriel : **These are my…**).
- Possessifs : my, your, **his** (à lui), **her** (à elle).
- Possession : *I **have** a cat*, *She **has** a dog*.$md$),

    ('L''école en pays anglophone', $md$# L'école en pays anglophone

## Ce que tu vas comprendre
Ce chapitre te fait découvrir l'**école** (school) dans les pays anglophones : les **matières**, l'**emploi du temps** et le vocabulaire de la classe. Tu pourras dire ce que tu étudies et à quelle heure.

## 1. Les matières (school subjects)

| Anglais | Français |
|---|---|
| Maths | mathématiques |
| English | anglais |
| French | français |
| History | histoire |
| Geography | géographie |
| Science | sciences |
| Art | arts plastiques |
| Music | musique |
| PE (Physical Education) | EPS (sport) |

*Exemple : **I study Maths, English and Science.** → J'étudie les maths, l'anglais et les sciences.*

## 2. L'emploi du temps (the timetable)
Le mot **timetable** désigne l'**emploi du temps**. On demande l'heure d'un cours ainsi :
- *What time is the English lesson?* → **À quelle heure est le cours d'anglais ?**
- *At 9 o'clock.* → **À 9 h.**

## 3. Dans la classe (in the classroom)

| Anglais | Français |
|---|---|
| a classroom | une salle de classe |
| a teacher | un(e) professeur(e) |
| a pupil / a student | un(e) élève |
| a book | un livre |
| a pen / a pencil | un stylo / un crayon |
| the playground | la cour de récréation |

## 4. La journée d'école
- *break* → la récréation, la pause
- *lunch / the canteen* → le déjeuner / la cantine
- *homework* → les devoirs

*Exemple : **We have a break at 10.** → On a une récréation à 10 h.*

## 5. Dire ce qu'on aime à l'école
- *My favourite subject is Art.* → **Ma matière préférée, c'est les arts plastiques.**
- *I like Science, but I don't like Maths.* → J'aime les sciences, mais je n'aime pas les maths.

## L'essentiel à retenir
- Les matières : Maths, English, History, Geography, Science, PE…
- **timetable** = emploi du temps.
- Vocabulaire de classe : classroom, teacher, pupil, book, break.
- *My favourite subject is…* pour dire sa matière préférée.$md$),

    ('Fêtes et traditions', $md$# Fêtes et traditions

## Ce que tu vas comprendre
Les pays anglophones ont des **fêtes** (celebrations) très connues : Halloween, Christmas, Thanksgiving… Ce chapitre te donne le vocabulaire et les vœux (wishes) pour en parler.

## 1. Les grandes fêtes (celebrations)

| Anglais | Date | Français |
|---|---|---|
| Halloween | 31 octobre | Halloween |
| Thanksgiving | novembre (USA) | Action de grâce |
| Christmas | 25 décembre | Noël |
| New Year | 1er janvier | Nouvel An |
| Easter | printemps | Pâques |
| Valentine's Day | 14 février | Saint-Valentin |

## 2. Halloween
Halloween se fête le **31 octobre**. Symboles : **a pumpkin** (une citrouille), **a ghost** (un fantôme), **a witch** (une sorcière).
- *Trick or treat!* → **Des bonbons ou un sort !**

## 3. Christmas
Noël, le **25 décembre**, avec **a Christmas tree** (un sapin), **presents** (des cadeaux) et **Santa Claus** (le père Noël).
- On souhaite : *Merry Christmas!* → **Joyeux Noël !**

## 4. Thanksgiving et Easter
- **Thanksgiving** : fête américaine où l'on remercie, avec un grand repas (**turkey**, la dinde).
- **Easter** (Pâques) : on cache des **eggs** (des œufs) en chocolat.

## 5. Souhaiter (wishes)

| Anglais | Français |
|---|---|
| Merry Christmas! | Joyeux Noël ! |
| Happy New Year! | Bonne année ! |
| Happy Halloween! | Joyeux Halloween ! |
| Happy Easter! | Joyeuses Pâques ! |

## L'essentiel à retenir
- **Halloween** = 31 octobre (pumpkin, ghost, *trick or treat!*).
- **Christmas** = 25 décembre (Christmas tree, presents, *Merry Christmas!*).
- **Thanksgiving** est une fête américaine (turkey).
- **Easter** (Pâques) → les eggs. Vœux : *Happy New Year!*, *Happy Easter!*$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'anglais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '6e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Se présenter et parler de soi', $json${
      "centre": "Se présenter",
      "branches": [
        { "titre": "Le nom", "enfants": ["What's your name?", "My name is… / I'm…", "I : toujours majuscule"] },
        { "titre": "L'âge", "enfants": ["How old are you?", "I'm 11 (be, pas have)", "years old"] },
        { "titre": "L'origine", "enfants": ["Where are you from?", "I'm from France", "pays"] },
        { "titre": "Salutations", "enfants": ["How are you? → I'm fine", "Hello / Good morning", "Nice to meet you"] }
      ]
    }$json$),
    ('Present simple : routines', $json${
      "centre": "Present simple",
      "branches": [
        { "titre": "À quoi ça sert", "enfants": ["Les habitudes", "Vérités générales", "I get up at 7"] },
        { "titre": "La forme + le -s", "enfants": ["Base verbale", "he/she/it → +s", "She plays tennis"] },
        { "titre": "La négation", "enfants": ["don't / doesn't", "verbe sans -s ensuite", "She doesn't like coffee"] },
        { "titre": "Fréquence", "enfants": ["always, often", "sometimes, never", "avant le verbe"] }
      ]
    }$json$),
    ('La famille et les animaux', $json${
      "centre": "Famille et animaux",
      "branches": [
        { "titre": "La famille", "enfants": ["mother, father", "sister, brother", "parents, cousin"] },
        { "titre": "Présenter", "enfants": ["This is my…", "These are my… (pluriel)", "my, your, his, her"] },
        { "titre": "Les animaux", "enfants": ["dog, cat, rabbit", "horse, bird, fish", "a / an"] },
        { "titre": "Possession", "enfants": ["I have a cat", "She has a dog", "have got"] }
      ]
    }$json$),
    ('L''école en pays anglophone', $json${
      "centre": "L'école",
      "branches": [
        { "titre": "Les matières", "enfants": ["Maths, English", "History, Science", "PE (sport)"] },
        { "titre": "Emploi du temps", "enfants": ["timetable", "What time is…?", "At 9 o'clock"] },
        { "titre": "Dans la classe", "enfants": ["classroom, teacher", "pupil, book, pen", "playground"] },
        { "titre": "La journée", "enfants": ["break (récré)", "lunch / canteen", "homework"] }
      ]
    }$json$),
    ('Fêtes et traditions', $json${
      "centre": "Fêtes et traditions",
      "branches": [
        { "titre": "Halloween", "enfants": ["31 octobre", "pumpkin, ghost", "Trick or treat!"] },
        { "titre": "Christmas", "enfants": ["25 décembre", "tree, presents", "Merry Christmas!"] },
        { "titre": "Thanksgiving / Easter", "enfants": ["Thanksgiving (USA)", "turkey", "Easter → eggs"] },
        { "titre": "Souhaiter", "enfants": ["Happy New Year!", "Happy Halloween!", "Happy Easter!"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'anglais'
 WHERE c.subject_id = s.id AND c.level = '6e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz 6e ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Anglais', '6e', v.chapter, true, l.id
FROM (VALUES
  ('09319999-0000-4000-8000-000000000001'::uuid, 'Se présenter et parler de soi'),
  ('09319999-0000-4000-8000-000000000002'::uuid, 'Present simple : routines'),
  ('09319999-0000-4000-8000-000000000003'::uuid, 'La famille et les animaux'),
  ('09319999-0000-4000-8000-000000000004'::uuid, 'L''école en pays anglophone'),
  ('09319999-0000-4000-8000-000000000005'::uuid, 'Fêtes et traditions')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'anglais'
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
  -- Chapitre 1 — Se présenter et parler de soi
  ('09310000-0000-4000-8000-000000000104'::uuid, 'Se présenter et parler de soi',
   'Comment dit-on « Je m''appelle Tom » en anglais ?', 'mcq',
   '["My name is Tom", "I am 12", "I have a dog", "This is a book"]', 0,
   '« My name is… » (ou « I''m… ») sert à donner son nom.', 4),
  ('09310000-0000-4000-8000-000000000105'::uuid, 'Se présenter et parler de soi',
   'Complète la question : « ___ your name? »', 'mcq',
   '["What''s", "How''s", "Who''s", "Where''s"]', 0,
   'On demande le nom avec « What''s your name? » (What is).', 5),
  ('09310000-0000-4000-8000-000000000106'::uuid, 'Se présenter et parler de soi',
   'Pour demander l''âge de quelqu''un, on dit : ', 'mcq',
   '["How old are you?", "Where are you from?", "What''s your name?", "How are you?"]', 0,
   '« How old are you? » demande l''âge.', 6),
  ('09310000-0000-4000-8000-000000000107'::uuid, 'Se présenter et parler de soi',
   'La phrase « I''m eleven years old » signifie « J''ai onze ans ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'En anglais on utilise « be » pour l''âge : I''m eleven = J''ai onze ans.', 7),
  ('09310000-0000-4000-8000-000000000108'::uuid, 'Se présenter et parler de soi',
   'À quoi sert la question « Where are you from? »', 'mcq',
   '["Demander d''où l''on vient", "Demander l''âge", "Demander le nom", "Demander l''heure"]', 0,
   '« Where are you from? » = D''où viens-tu ? On répond « I''m from… ».', 8),
  ('09310000-0000-4000-8000-000000000109'::uuid, 'Se présenter et parler de soi',
   'Comment répond-on poliment à « How are you? »', 'mcq',
   '["I''m fine, thank you", "I''m twelve", "My name is Sam", "It''s a dog"]', 0,
   '« How are you? » demande comment ça va → « I''m fine, thank you. »', 9),
  ('09310000-0000-4000-8000-000000000110'::uuid, 'Se présenter et parler de soi',
   'En anglais, le pronom « I » (je) s''écrit toujours avec une majuscule.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le pronom « I » prend toujours une majuscule, même au milieu d''une phrase.', 10),

  -- Chapitre 2 — Present simple : routines
  ('09310000-0000-4000-8000-000000000204'::uuid, 'Present simple : routines',
   'À la 3e personne du singulier (he/she/it), qu''ajoute-t-on au verbe ?', 'mcq',
   '["-s", "-ing", "-ed", "rien"]', 0,
   'Au present simple, on ajoute -s à la 3e personne : she play**s**.', 4),
  ('09310000-0000-4000-8000-000000000205'::uuid, 'Present simple : routines',
   'Complète : « She ___ tennis every Sunday. »', 'mcq',
   '["plays", "play", "playing", "played"]', 0,
   '3e personne du singulier (she) → on ajoute -s : she plays.', 5),
  ('09310000-0000-4000-8000-000000000206'::uuid, 'Present simple : routines',
   'Quelle phrase est correcte ?', 'mcq',
   '["He goes to school by bus", "He go to school by bus", "He going to school", "He gone to school"]', 0,
   'À la 3e personne, « go » devient « goes » : He goes to school.', 6),
  ('09310000-0000-4000-8000-000000000207'::uuid, 'Present simple : routines',
   'La phrase « I get up at 7 o''clock » décrit une routine (une habitude).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le present simple exprime les habitudes : se lever chaque jour à 7 h.', 7),
  ('09310000-0000-4000-8000-000000000208'::uuid, 'Present simple : routines',
   'Que signifie l''adverbe de fréquence « always » ?', 'mcq',
   '["Toujours", "Jamais", "Parfois", "Souvent"]', 0,
   'always = toujours (often = souvent, sometimes = parfois, never = jamais).', 8),
  ('09310000-0000-4000-8000-000000000209'::uuid, 'Present simple : routines',
   'Complète la forme négative : « She ___ like coffee. »', 'mcq',
   '["doesn''t", "don''t", "isn''t", "not"]', 0,
   'À la 3e personne, la négation utilise « doesn''t » (+ verbe sans -s).', 9),
  ('09310000-0000-4000-8000-000000000210'::uuid, 'Present simple : routines',
   'Que veut dire l''expression « every day » ?', 'mcq',
   '["Tous les jours", "Hier", "Demain", "La semaine dernière"]', 0,
   'every day = tous les jours ; c''est un marqueur du present simple.', 10),

  -- Chapitre 3 — La famille et les animaux
  ('09310000-0000-4000-8000-000000000304'::uuid, 'La famille et les animaux',
   'Comment dit-on « ma sœur » en anglais ?', 'mcq',
   '["My sister", "My brother", "My mother", "My aunt"]', 0,
   'sister = sœur (brother = frère, mother = mère, aunt = tante).', 4),
  ('09310000-0000-4000-8000-000000000305'::uuid, 'La famille et les animaux',
   'Que signifie « This is my father » ?', 'mcq',
   '["Voici mon père", "Voici ma mère", "Voici mon frère", "Voici mon oncle"]', 0,
   'father = père ; « This is my… » sert à présenter quelqu''un.', 5),
  ('09310000-0000-4000-8000-000000000306'::uuid, 'La famille et les animaux',
   'Lequel de ces mots désigne un animal ?', 'mcq',
   '["dog", "chair", "school", "table"]', 0,
   'dog = chien ; les autres sont des objets ou des lieux.', 6),
  ('09310000-0000-4000-8000-000000000307'::uuid, 'La famille et les animaux',
   'Le mot « grandmother » veut dire « grand-mère ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'grandmother = grand-mère (grandfather = grand-père).', 7),
  ('09310000-0000-4000-8000-000000000308'::uuid, 'La famille et les animaux',
   'Comment dit-on « J''ai un chat » ?', 'mcq',
   '["I have a cat", "I am a cat", "I like a dog", "This is a cat"]', 0,
   'Pour la possession on utilise « have » : I have a cat.', 8),
  ('09310000-0000-4000-8000-000000000309'::uuid, 'La famille et les animaux',
   'Dans « They are my parents », le mot « parents » désigne : ', 'mcq',
   '["Le père et la mère", "Les frères", "Les amis", "Les cousins"]', 0,
   'parents = les parents (père et mère).', 9),
  ('09310000-0000-4000-8000-000000000310'::uuid, 'La famille et les animaux',
   'Comment dit-on « un cheval » en anglais ?', 'mcq',
   '["a horse", "a rabbit", "a bird", "a fish"]', 0,
   'horse = cheval (rabbit = lapin, bird = oiseau, fish = poisson).', 10),

  -- Chapitre 4 — L'école en pays anglophone
  ('09310000-0000-4000-8000-000000000404'::uuid, 'L''école en pays anglophone',
   'Comment dit-on « les mathématiques » (matière) en anglais ?', 'mcq',
   '["Maths", "History", "Art", "Music"]', 0,
   'Maths = mathématiques (History = histoire, Art = arts, Music = musique).', 4),
  ('09310000-0000-4000-8000-000000000405'::uuid, 'L''école en pays anglophone',
   'Que signifie le mot « timetable » ?', 'mcq',
   '["L''emploi du temps", "Le tableau", "La récréation", "La cantine"]', 0,
   'timetable = l''emploi du temps.', 5),
  ('09310000-0000-4000-8000-000000000406'::uuid, 'L''école en pays anglophone',
   'Lequel de ces mots est une matière scolaire (school subject) ?', 'mcq',
   '["Geography", "Breakfast", "Sister", "Halloween"]', 0,
   'Geography = géographie, une matière scolaire.', 6),
  ('09310000-0000-4000-8000-000000000407'::uuid, 'L''école en pays anglophone',
   '« PE » (Physical Education) correspond à l''EPS (le sport).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'PE = Physical Education = l''EPS (le sport).', 7),
  ('09310000-0000-4000-8000-000000000408'::uuid, 'L''école en pays anglophone',
   'Comment dit-on « une salle de classe » ?', 'mcq',
   '["a classroom", "a playground", "a library", "a canteen"]', 0,
   'classroom = salle de classe (playground = cour, library = bibliothèque, canteen = cantine).', 8),
  ('09310000-0000-4000-8000-000000000409'::uuid, 'L''école en pays anglophone',
   'Dans « I study English », que veut dire le verbe « study » ?', 'mcq',
   '["Étudier", "Jouer", "Manger", "Dormir"]', 0,
   'study = étudier.', 9),
  ('09310000-0000-4000-8000-000000000410'::uuid, 'L''école en pays anglophone',
   'À l''école, que désigne le mot « break » ?', 'mcq',
   '["La pause / récréation", "Le devoir", "La note", "Le professeur"]', 0,
   'break = la pause, la récréation.', 10),

  -- Chapitre 5 — Fêtes et traditions
  ('09310000-0000-4000-8000-000000000504'::uuid, 'Fêtes et traditions',
   'Quelle fête a lieu le 25 décembre ?', 'mcq',
   '["Christmas", "Halloween", "Thanksgiving", "Easter"]', 0,
   'Christmas (Noël) se fête le 25 décembre.', 4),
  ('09310000-0000-4000-8000-000000000505'::uuid, 'Fêtes et traditions',
   'Halloween se fête le : ', 'mcq',
   '["31 octobre", "25 décembre", "1er janvier", "14 février"]', 0,
   'Halloween a lieu le 31 octobre.', 5),
  ('09310000-0000-4000-8000-000000000506'::uuid, 'Fêtes et traditions',
   'Comment souhaite-t-on « Joyeux Noël » en anglais ?', 'mcq',
   '["Merry Christmas", "Happy Halloween", "Happy New Year", "Good morning"]', 0,
   'On dit « Merry Christmas! » pour Joyeux Noël.', 6),
  ('09310000-0000-4000-8000-000000000507'::uuid, 'Fêtes et traditions',
   '« Thanksgiving » est une fête traditionnelle célébrée aux États-Unis.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Thanksgiving (Action de grâce) est une grande fête américaine.', 7),
  ('09310000-0000-4000-8000-000000000508'::uuid, 'Fêtes et traditions',
   'Quel symbole est associé à Halloween ?', 'mcq',
   '["A pumpkin (une citrouille)", "A Christmas tree", "An egg", "A heart"]', 0,
   'La citrouille (pumpkin) est un symbole d''Halloween.', 8),
  ('09310000-0000-4000-8000-000000000509'::uuid, 'Fêtes et traditions',
   '« Easter » (Pâques) est surtout associé à : ', 'mcq',
   '["Les œufs (eggs)", "La citrouille", "Le sapin", "Les feux d''artifice"]', 0,
   'À Easter (Pâques), on cache des œufs (eggs) en chocolat.', 9),
  ('09310000-0000-4000-8000-000000000510'::uuid, 'Fêtes et traditions',
   'On dit « Happy New Year » pour souhaiter la bonne année.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« Happy New Year! » = Bonne année !', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'anglais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '6e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
