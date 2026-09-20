-- =============================================================================
-- Studuel — Migration 105 : CONTENU Français 4e (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de Français 4e (programme cycle 4, Éduscol) :
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
    ('La lettre et l''épistolaire', $md$# La lettre et l'épistolaire

## Ce que tu vas comprendre
Écrire une lettre, c'est communiquer **à distance** avec une personne précise. Le genre **épistolaire** (du latin *epistola*, « lettre ») regroupe tous les textes écrits sous forme de lettres. Ce chapitre t'apprend à repérer qui parle, à qui, et comment une lettre est construite.

## 1. Qu'est-ce que le genre épistolaire ?
Une **lettre** est un message écrit adressé à un **destinataire** absent. Elle peut être :
- **privée** (à un ami, un proche) ou **officielle** (à une administration) ;
- **réelle** (une vraie correspondance) ou **fictive** (dans un roman).

*Un roman entièrement composé de lettres s'appelle un **roman épistolaire** (par exemple *Les Liaisons dangereuses* de Laclos).*

## 2. L'énonciation dans la lettre
La lettre met en scène deux rôles :
- l'**émetteur** (ou scripteur), celui qui écrit : il dit **« je »** ;
- le **destinataire**, celui à qui on écrit : il est désigné par **« tu »** ou **« vous »**.

On y trouve donc beaucoup de **marques de la 1re et de la 2e personne**, ainsi que des indices de temps et de lieu propres au moment de l'écriture (*ici, aujourd'hui, hier*).

## 3. La mise en page d'une lettre
Une lettre suit une **présentation codée** :
1. le **lieu et la date** en haut ;
2. une **formule d'appel** (*Cher ami, Madame,*) ;
3. le **corps** du message ;
4. une **formule de politesse** finale ;
5. la **signature**.

*Exemple de formule de politesse soutenue : « Veuillez agréer, Madame, l'expression de mes salutations distinguées. »*

## 4. Adapter le registre au destinataire
On n'écrit pas de la même façon à un copain et à un directeur. Le **registre de langue** (familier, courant, soutenu) et le ton (affectueux, respectueux) **dépendent du destinataire** et du but de la lettre.

## L'essentiel à retenir
- Le genre **épistolaire** regroupe les textes écrits sous forme de **lettres**.
- L'**énonciation** repose sur un « je » (émetteur) qui s'adresse à un « tu / vous » (destinataire).
- La lettre a une **mise en page codée** : date, appel, corps, politesse, signature.
- Le **registre** s'adapte toujours au destinataire et au but du message.$md$),

    ('Le fantastique', $md$# Le fantastique

## Ce que tu vas comprendre
Le **fantastique** est un genre qui fait surgir l'**étrange** dans un monde qui semblait normal. Contrairement au merveilleux, il crée le **doute** : est-ce réel ou imaginaire ? Ce chapitre t'apprend à reconnaître ses procédés et ses grands auteurs.

## 1. Le fantastique, c'est quoi ?
Dans un récit fantastique, un événement **surnaturel** (inexplicable) fait irruption dans un cadre **réaliste**. Le lecteur, comme le personnage, ne sait pas s'il faut y croire.

*À ne pas confondre avec le **merveilleux** (contes de fées), où le surnaturel est accepté comme normal, sans étonnement.*

## 2. Le cadre réaliste
Pour que le surnaturel fasse peur, il faut d'abord un décor **crédible** : une ville connue, une date précise, un narrateur ordinaire. Le fantastique **s'appuie sur le réel** avant de le faire basculer.

## 3. L'hésitation, cœur du fantastique
Le fantastique repose sur l'**hésitation** : on hésite entre une explication **rationnelle** (rêve, folie, hasard) et une explication **surnaturelle** (fantôme, malédiction). Cette incertitude n'est souvent **jamais tranchée** à la fin.

> **À retenir :** si le doute disparaît, on quitte le fantastique. Le fantastique vit du **peut-être**.

## 4. Les procédés de l'inquiétude
Pour installer la peur, les auteurs utilisent :
- le **champ lexical de la peur** (angoisse, effroi, terreur) ;
- des **modalisateurs** de doute (*il me sembla, peut-être, comme si*) ;
- une **gradation** qui fait monter la tension ;
- un récit souvent à la **1re personne**, pour qu'on partage le trouble du narrateur.

## 5. Les grands auteurs
Le fantastique a de célèbres maîtres :
- **Guy de Maupassant** (*Le Horla*, *La Peur*) au XIXe siècle français ;
- **Edgar Allan Poe** (*Le Chat noir*), écrivain américain ;
- on peut aussi citer Théophile Gautier et Prosper Mérimée.

## L'essentiel à retenir
- Le **fantastique** fait surgir le **surnaturel** dans un **cadre réaliste**.
- Son moteur est l'**hésitation** entre explication rationnelle et surnaturelle.
- Procédés : champ lexical de la peur, modalisateurs de doute, gradation, récit à la 1re personne.
- Auteurs majeurs : **Maupassant** et **Poe**.$md$),

    ('La ville en poésie', $md$# La ville en poésie

## Ce que tu vas comprendre
La **ville** est devenue au XIXe siècle un grand sujet de poésie. Les poètes y trouvent la **modernité** : foule, machines, lumières, mais aussi solitude et laideur. Ce chapitre t'apprend à lire ces poèmes et à repérer leurs images.

## 1. La ville, sujet moderne
Longtemps la poésie chantait la nature. Au XIXe siècle, avec l'essor des grandes villes (Paris se transforme), les poètes s'emparent d'un décor nouveau : **rues, gares, réverbères, foule**. C'est la poésie de la **modernité**.

## 2. Baudelaire et la ville
**Charles Baudelaire** (*Les Fleurs du mal*, 1857) est le poète de la ville par excellence. Dans les *Tableaux parisiens*, il montre un Paris à la fois **fascinant et inquiétant**, peuplé de passants, de vieillards, de mendiants. Il transforme la ville, même laide, en **matière poétique**.

## 3. Deux visages de la ville
La ville en poésie a deux faces :
- un visage **fascinant** : lumières, mouvement, énergie, rencontres ;
- un visage **sombre** : solitude au milieu de la foule, misère, bruit, laideur.

*C'est ce contraste qui rend la ville si poétique : la beauté peut naître même du désordre urbain.*

## 4. Les procédés poétiques
Pour donner vie à la ville, les poètes utilisent :
- la **personnification** (la ville « respire », « murmure ») ;
- des **comparaisons** et **métaphores** (la foule comme un fleuve) ;
- le jeu des **sensations** (bruits, lumières, odeurs) ;
- parfois le **vers libre** ou des rythmes irréguliers pour imiter l'agitation.

## L'essentiel à retenir
- La **ville** devient au XIXe siècle un grand sujet poétique : c'est la **modernité**.
- **Baudelaire** (*Les Fleurs du mal*) est le poète de Paris, fascinant et inquiétant.
- La ville a deux visages : **fascination** (lumières, foule) et **noirceur** (solitude, misère).
- Procédés : **personnification**, **métaphore**, jeu des **sensations**.$md$),

    ('Les propositions subordonnées', $md$# Les propositions subordonnées

## Ce que tu vas comprendre
Une phrase complexe contient plusieurs verbes conjugués, donc plusieurs **propositions**. Une **proposition subordonnée** dépend d'une autre proposition (la **principale**). Ce chapitre t'apprend à reconnaître les subordonnées **relatives** et **conjonctives**.

## 1. Proposition principale et subordonnée
Dans une **phrase complexe**, une proposition **subordonnée** ne peut pas exister seule : elle dépend de la **proposition principale**.

*Exemple : « Je lis le livre **que tu m'as prêté**. » — « que tu m'as prêté » est la subordonnée, « Je lis le livre » la principale.*

## 2. La proposition subordonnée relative
Elle est introduite par un **pronom relatif** : **qui, que, quoi, dont, où** (et *lequel, auquel…*). Elle complète un **nom**, appelé son **antécédent**.

- **qui** est sujet : « L'élève **qui travaille** réussit. »
- **que** est COD : « Le livre **que je lis** est passionnant. »
- **dont** remplace un complément avec *de* : « Le film **dont je parle**. »
- **où** indique le lieu ou le temps : « La ville **où je vis**. »

> **Astuce :** le pronom relatif se place juste après son antécédent et le remplace.

## 3. La proposition subordonnée conjonctive
Elle est introduite par une **conjonction de subordination** (*que, quand, comme, si, parce que…*), et non par un pronom relatif.

- La **complétive** commence par **que** et complète un verbe (souvent COD) : « Je pense **que tu as raison**. »
- La **circonstancielle** donne une circonstance (temps, cause, but…) : « Je pars **quand il pleut**. »

## 4. Bien les distinguer
- **Relative** → introduite par un **pronom relatif**, complète un **nom** (l'antécédent).
- **Conjonctive** → introduite par une **conjonction de subordination**, complète un **verbe** ou toute la phrase.

## L'essentiel à retenir
- Une **subordonnée** dépend d'une **principale** et ne peut exister seule.
- La **relative** est introduite par un **pronom relatif** (qui, que, dont, où) et complète un **nom**.
- La **conjonctive** est introduite par une **conjonction de subordination** (que, quand…).
- On les distingue par leur **mot introducteur** et ce qu'elles complètent.$md$),

    ('Cause, conséquence et but', $md$# Cause, conséquence et but

## Ce que tu vas comprendre
Pour expliquer **pourquoi** un fait arrive, **ce qu'il provoque** ou **dans quel objectif** on agit, on utilise des **connecteurs logiques**. Ce chapitre t'apprend à exprimer la **cause**, la **conséquence** et le **but**.

## 1. Exprimer la cause
La **cause** est la **raison** d'un fait : elle répond à la question **« pourquoi ? »**.
- Conjonctions : **parce que, puisque, comme, étant donné que**.
- Coordination : **car**.
- Prépositions + nom : **à cause de** (cause négative), **grâce à** (cause positive), **en raison de**.

*Exemple : « Il est resté chez lui **parce qu'il était malade**. »*

## 2. Exprimer la conséquence
La **conséquence** est le **résultat** d'un fait : elle répond à **« avec quel effet ? »**.
- Conjonctions : **si bien que, de sorte que, au point que**.
- Adverbes : **donc, alors, c'est pourquoi, par conséquent**.
- Structures d'intensité : **tellement… que, si… que, tant… que**.

*Exemple : « Il pleuvait **si bien que** le match fut annulé. »*

## 3. Exprimer le but
Le **but** est l'**objectif** visé : il répond à **« dans quel but ? »**.
- Conjonctions (+ **subjonctif**) : **pour que, afin que, de peur que**.
- Prépositions (+ infinitif) : **pour, afin de, en vue de**.

> **À retenir :** après *pour que* et *afin que*, le verbe est au **subjonctif** : « Je t'explique **pour que tu comprennes**. »

## 4. Ne pas confondre cause et conséquence
La **cause vient avant**, la **conséquence après**.
- Cause : « Il a plu (**cause**), **donc** la route est mouillée. »
- Conséquence : « La route est mouillée (**conséquence**) **parce qu'**il a plu. »

C'est le **connecteur** choisi qui indique quel lien logique tu exprimes.

## L'essentiel à retenir
- La **cause** répond à « pourquoi ? » : *parce que, puisque, comme, à cause de, grâce à*.
- La **conséquence** répond à « avec quel effet ? » : *si bien que, donc, tellement… que*.
- Le **but** répond à « dans quel but ? » : *pour que, afin que* (+ subjonctif), *pour, afin de*.
- Le **connecteur** choisi précise le lien logique entre les faits.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'francais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('La lettre et l''épistolaire', $json${
      "centre": "La lettre et l'épistolaire",
      "branches": [
        { "titre": "Le genre épistolaire", "enfants": ["Texte en forme de lettre", "Privée ou officielle", "Roman épistolaire (Laclos)"] },
        { "titre": "L'énonciation", "enfants": ["Émetteur = je", "Destinataire = tu / vous", "Marques de 1re et 2e personne"] },
        { "titre": "La mise en page", "enfants": ["Lieu et date", "Formule d'appel + corps", "Politesse + signature"] },
        { "titre": "Le registre", "enfants": ["Adapté au destinataire", "Familier, courant, soutenu", "Ton selon le but"] }
      ]
    }$json$),
    ('Le fantastique', $json${
      "centre": "Le fantastique",
      "branches": [
        { "titre": "Définition", "enfants": ["Surnaturel dans le réel", "Différent du merveilleux", "Crée le doute"] },
        { "titre": "Cadre réaliste", "enfants": ["Décor crédible", "Lieu et date précis", "Narrateur ordinaire"] },
        { "titre": "L'hésitation", "enfants": ["Rationnel ou surnaturel ?", "Doute non tranché", "Le peut-être"] },
        { "titre": "Procédés et auteurs", "enfants": ["Champ lexical de la peur", "Modalisateurs, gradation", "Maupassant, Poe"] }
      ]
    }$json$),
    ('La ville en poésie', $json${
      "centre": "La ville en poésie",
      "branches": [
        { "titre": "Sujet moderne", "enfants": ["Décor du XIXe siècle", "Rues, gares, foule", "La modernité"] },
        { "titre": "Baudelaire", "enfants": ["Les Fleurs du mal (1857)", "Tableaux parisiens", "Paris fascinant et sombre"] },
        { "titre": "Deux visages", "enfants": ["Fascination : lumières, foule", "Noirceur : solitude, misère", "Beauté dans le désordre"] },
        { "titre": "Procédés", "enfants": ["Personnification", "Métaphore, comparaison", "Jeu des sensations"] }
      ]
    }$json$),
    ('Les propositions subordonnées', $json${
      "centre": "Les propositions subordonnées",
      "branches": [
        { "titre": "Principale / subordonnée", "enfants": ["Phrase complexe", "La subordonnée dépend", "Ne peut exister seule"] },
        { "titre": "La relative", "enfants": ["Pronom relatif : qui, que, dont, où", "Complète un nom (antécédent)", "L'élève qui travaille"] },
        { "titre": "La conjonctive", "enfants": ["Conjonction de subordination", "Complétive en que", "Circonstancielle"] },
        { "titre": "Les distinguer", "enfants": ["Relative → complète un nom", "Conjonctive → complète un verbe", "Regarder le mot introducteur"] }
      ]
    }$json$),
    ('Cause, conséquence et but', $json${
      "centre": "Cause, conséquence et but",
      "branches": [
        { "titre": "La cause", "enfants": ["Question : pourquoi ?", "parce que, puisque, comme", "à cause de, grâce à"] },
        { "titre": "La conséquence", "enfants": ["Question : avec quel effet ?", "si bien que, donc", "tellement... que"] },
        { "titre": "Le but", "enfants": ["Question : dans quel but ?", "pour que, afin que (+ subjonctif)", "pour, afin de"] },
        { "titre": "Ne pas confondre", "enfants": ["Cause avant, conséquence après", "Le connecteur donne le lien", "donc / parce que"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'francais'
 WHERE c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz ; ce bloc ne
--     fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Français', '4e', v.chapter, true, l.id
FROM (VALUES
  ('10519999-0000-4000-8000-000000000001'::uuid, 'La lettre et l''épistolaire'),
  ('10519999-0000-4000-8000-000000000002'::uuid, 'Le fantastique'),
  ('10519999-0000-4000-8000-000000000003'::uuid, 'La ville en poésie'),
  ('10519999-0000-4000-8000-000000000004'::uuid, 'Les propositions subordonnées'),
  ('10519999-0000-4000-8000-000000000005'::uuid, 'Cause, conséquence et but')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'francais'
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
  -- Chapitre 1 — La lettre et l'épistolaire
  ('10510000-0000-4000-8000-000000000104'::uuid, 'La lettre et l''épistolaire',
   'Que désigne le mot « destinataire » d''une lettre ?', 'mcq',
   '["La personne à qui on écrit", "La personne qui écrit", "Le facteur", "Le sujet de la lettre"]', 0,
   'Le destinataire est celui à qui la lettre est adressée ; celui qui écrit est l''émetteur.', 4),
  ('10510000-0000-4000-8000-000000000105'::uuid, 'La lettre et l''épistolaire',
   'Comment appelle-t-on un roman entièrement composé de lettres ?', 'mcq',
   '["Un roman épistolaire", "Un roman d''aventures", "Une autobiographie", "Un conte"]', 0,
   'Un roman fait uniquement de lettres est un roman épistolaire (ex. Les Liaisons dangereuses).', 5),
  ('10510000-0000-4000-8000-000000000106'::uuid, 'La lettre et l''épistolaire',
   'Dans une lettre, l''émetteur parle le plus souvent à la première personne (« je »).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Celui qui écrit se désigne par « je » et s''adresse au destinataire avec « tu » ou « vous ».', 6),
  ('10510000-0000-4000-8000-000000000107'::uuid, 'La lettre et l''épistolaire',
   'Quel élément se place généralement en haut d''une lettre ?', 'mcq',
   '["Le lieu et la date", "La signature", "La formule de politesse", "La conclusion"]', 0,
   'La lettre commence par le lieu et la date ; la signature vient à la fin.', 7),
  ('10510000-0000-4000-8000-000000000108'::uuid, 'La lettre et l''épistolaire',
   'Parmi ces expressions, laquelle est une formule de politesse finale ?', 'mcq',
   '["Veuillez agréer mes salutations distinguées", "Cher ami", "Il était une fois", "Chapitre premier"]', 0,
   'La formule de politesse clôt la lettre ; « Cher ami » est une formule d''appel.', 8),
  ('10510000-0000-4000-8000-000000000109'::uuid, 'La lettre et l''épistolaire',
   'On écrit de la même manière à un ami et à une administration.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le registre de langue et le ton s''adaptent au destinataire et au but de la lettre.', 9),
  ('10510000-0000-4000-8000-000000000110'::uuid, 'La lettre et l''épistolaire',
   'Le mot « épistolaire » vient d''un mot signifiant : ', 'mcq',
   '["Lettre", "Voyage", "Chanson", "Théâtre"]', 0,
   '« Épistolaire » vient du latin epistola, qui signifie « lettre ».', 10),

  -- Chapitre 2 — Le fantastique
  ('10510000-0000-4000-8000-000000000204'::uuid, 'Le fantastique',
   'Sur quoi repose principalement le récit fantastique ?', 'mcq',
   '["L''hésitation entre réel et surnaturel", "La certitude que la magie existe", "L''absence de personnages", "Un décor toujours imaginaire"]', 0,
   'Le fantastique fait douter : on hésite entre une explication rationnelle et une explication surnaturelle.', 4),
  ('10510000-0000-4000-8000-000000000205'::uuid, 'Le fantastique',
   'Dans le fantastique, le surnaturel surgit dans un cadre réaliste.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le décor crédible rend le surnaturel plus troublant : c''est le propre du fantastique.', 5),
  ('10510000-0000-4000-8000-000000000206'::uuid, 'Le fantastique',
   'Quelle est la différence entre le fantastique et le merveilleux ?', 'mcq',
   '["Dans le merveilleux, le surnaturel est accepté comme normal", "Le merveilleux fait toujours peur", "Le fantastique n''a pas de personnages", "Il n''y a aucune différence"]', 0,
   'Dans le merveilleux (contes), le surnaturel est admis sans étonnement ; le fantastique, lui, crée le doute.', 6),
  ('10510000-0000-4000-8000-000000000207'::uuid, 'Le fantastique',
   'Quel auteur français est célèbre pour ses récits fantastiques comme « Le Horla » ?', 'mcq',
   '["Guy de Maupassant", "Victor Hugo", "Jean de La Fontaine", "Molière"]', 0,
   'Guy de Maupassant est un maître du fantastique (Le Horla, La Peur).', 7),
  ('10510000-0000-4000-8000-000000000208'::uuid, 'Le fantastique',
   'Edgar Allan Poe est un écrivain associé au fantastique.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Edgar Allan Poe, écrivain américain, est une grande figure du fantastique (Le Chat noir).', 8),
  ('10510000-0000-4000-8000-000000000209'::uuid, 'Le fantastique',
   'Quel type de mots crée l''atmosphère inquiétante d''un récit fantastique ?', 'mcq',
   '["Le champ lexical de la peur", "Le vocabulaire mathématique", "Les termes de cuisine", "Les mots de politesse"]', 0,
   'Le champ lexical de la peur (angoisse, effroi, terreur) installe l''inquiétude.', 9),
  ('10510000-0000-4000-8000-000000000210'::uuid, 'Le fantastique',
   'À la fin d''un récit fantastique, le doute est toujours clairement résolu.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le fantastique laisse souvent le doute entier, sans trancher entre réel et surnaturel.', 10),

  -- Chapitre 3 — La ville en poésie
  ('10510000-0000-4000-8000-000000000304'::uuid, 'La ville en poésie',
   'À quel siècle la ville devient-elle un grand sujet de poésie ?', 'mcq',
   '["Au XIXe siècle", "Au Moyen Âge", "À l''Antiquité", "Au XXIe siècle"]', 0,
   'C''est au XIXe siècle, avec la modernité et l''essor des grandes villes, que la ville devient un sujet poétique.', 4),
  ('10510000-0000-4000-8000-000000000305'::uuid, 'La ville en poésie',
   'Quel poète est célèbre pour avoir chanté Paris dans « Les Fleurs du mal » ?', 'mcq',
   '["Charles Baudelaire", "Jean Racine", "Pierre Corneille", "François Rabelais"]', 0,
   'Charles Baudelaire, dans Les Fleurs du mal, est le grand poète de la ville de Paris.', 5),
  ('10510000-0000-4000-8000-000000000306'::uuid, 'La ville en poésie',
   'La ville en poésie n''a qu''un seul visage, toujours joyeux.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : la ville a deux visages, à la fois fascinant (lumières, foule) et sombre (solitude, misère).', 6),
  ('10510000-0000-4000-8000-000000000307'::uuid, 'La ville en poésie',
   'Comment appelle-t-on le fait de donner des qualités humaines à la ville (« la ville respire ») ?', 'mcq',
   '["Une personnification", "Une rime", "Une strophe", "Un synonyme"]', 0,
   'Attribuer une action ou un sentiment humain à une chose est une personnification.', 7),
  ('10510000-0000-4000-8000-000000000308'::uuid, 'La ville en poésie',
   'Que désigne la « modernité » dont parlent les poètes de la ville ?', 'mcq',
   '["Le monde nouveau des grandes villes", "Le retour à la campagne", "Les légendes anciennes", "La poésie du Moyen Âge"]', 0,
   'La modernité, c''est le décor nouveau des villes : rues, foule, machines, lumières.', 8),
  ('10510000-0000-4000-8000-000000000309'::uuid, 'La ville en poésie',
   'Comparer la foule à un fleuve est un exemple de métaphore ou de comparaison.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Rapprocher la foule d''un fleuve est une image poétique (comparaison ou métaphore).', 9),
  ('10510000-0000-4000-8000-000000000310'::uuid, 'La ville en poésie',
   'Dans quel recueil de Baudelaire trouve-t-on les « Tableaux parisiens » ?', 'mcq',
   '["Les Fleurs du mal", "Les Fables", "Les Misérables", "Le Cid"]', 0,
   'Les « Tableaux parisiens » forment une section des Fleurs du mal de Baudelaire.', 10),

  -- Chapitre 4 — Les propositions subordonnées
  ('10510000-0000-4000-8000-000000000404'::uuid, 'Les propositions subordonnées',
   'Une proposition subordonnée peut-elle exister toute seule ?', 'mcq',
   '["Non, elle dépend d''une principale", "Oui, elle est toujours indépendante", "Oui, si elle est courte", "Non, elle remplace le verbe"]', 0,
   'La subordonnée dépend de la proposition principale : elle ne peut pas former une phrase seule.', 4),
  ('10510000-0000-4000-8000-000000000405'::uuid, 'Les propositions subordonnées',
   'Par quel type de mot une proposition subordonnée relative est-elle introduite ?', 'mcq',
   '["Un pronom relatif (qui, que, dont, où)", "Un adjectif", "Un adverbe de temps", "Un nom propre"]', 0,
   'La relative est introduite par un pronom relatif : qui, que, quoi, dont, où, lequel…', 5),
  ('10510000-0000-4000-8000-000000000406'::uuid, 'Les propositions subordonnées',
   'Dans « Le livre que je lis est passionnant », « que je lis » complète le nom « livre ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« que je lis » est une subordonnée relative qui complète l''antécédent « livre ».', 6),
  ('10510000-0000-4000-8000-000000000407'::uuid, 'Les propositions subordonnées',
   'Dans « L''élève qui travaille réussit », quel est l''antécédent du pronom « qui » ?', 'mcq',
   '["L''élève", "réussit", "travaille", "qui"]', 0,
   'L''antécédent est le nom placé juste avant le pronom relatif : « l''élève ».', 7),
  ('10510000-0000-4000-8000-000000000408'::uuid, 'Les propositions subordonnées',
   'La proposition subordonnée conjonctive est introduite par une conjonction de subordination (que, quand…).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La conjonctive commence par une conjonction de subordination (que, quand, comme, si…), pas par un pronom relatif.', 8),
  ('10510000-0000-4000-8000-000000000409'::uuid, 'Les propositions subordonnées',
   'Dans « Je pense que tu as raison », la subordonnée « que tu as raison » est : ', 'mcq',
   '["Une conjonctive complétive", "Une relative", "Une principale", "Un groupe nominal"]', 0,
   'Introduite par « que » et complétant le verbe « pense », c''est une subordonnée conjonctive complétive.', 9),
  ('10510000-0000-4000-8000-000000000410'::uuid, 'Les propositions subordonnées',
   'Le pronom relatif « dont » remplace un complément construit avec la préposition « de ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« dont » reprend un complément introduit par « de » : « le film dont je parle » = je parle DE ce film.', 10),

  -- Chapitre 5 — Cause, conséquence et but
  ('10510000-0000-4000-8000-000000000504'::uuid, 'Cause, conséquence et but',
   'À quelle question répond l''expression de la cause ?', 'mcq',
   '["Pourquoi ?", "Dans quel but ?", "Avec quel effet ?", "Quand ?"]', 0,
   'La cause donne la raison d''un fait : elle répond à « pourquoi ? ».', 4),
  ('10510000-0000-4000-8000-000000000505'::uuid, 'Cause, conséquence et but',
   'Quel connecteur exprime la conséquence ?', 'mcq',
   '["si bien que", "parce que", "afin que", "puisque"]', 0,
   '« si bien que » introduit une conséquence ; « parce que » et « puisque » expriment la cause, « afin que » le but.', 5),
  ('10510000-0000-4000-8000-000000000506'::uuid, 'Cause, conséquence et but',
   'Après « pour que » et « afin que », le verbe se met au subjonctif.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les conjonctions de but « pour que / afin que » sont suivies du subjonctif : « pour que tu comprennes ».', 6),
  ('10510000-0000-4000-8000-000000000507'::uuid, 'Cause, conséquence et but',
   'Quelle locution exprime une cause positive (un avantage) ?', 'mcq',
   '["grâce à", "à cause de", "si bien que", "de peur que"]', 0,
   '« grâce à » exprime une cause positive ; « à cause de » exprime une cause plutôt négative.', 7),
  ('10510000-0000-4000-8000-000000000508'::uuid, 'Cause, conséquence et but',
   'Dans « Il pleuvait si bien que le match fut annulé », quel lien logique est exprimé ?', 'mcq',
   '["La conséquence", "La cause", "Le but", "La comparaison"]', 0,
   '« si bien que » introduit le résultat (le match annulé) : c''est la conséquence.', 8),
  ('10510000-0000-4000-8000-000000000509'::uuid, 'Cause, conséquence et but',
   'La conjonction « afin que » sert à exprimer le but.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« afin que » (comme « pour que ») exprime le but, l''objectif visé.', 9),
  ('10510000-0000-4000-8000-000000000510'::uuid, 'Cause, conséquence et but',
   'Dans une relation logique, la cause vient avant, la conséquence après.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La cause précède le fait, la conséquence en découle : c''est le connecteur qui précise le lien.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'francais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
