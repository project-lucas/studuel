-- =============================================================================
-- Studuel — Migration 053 : quiz de leçon, NSI lycée 1re·Tle
--   (8 quiz, 24 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés (tables quizzes,
--             quiz_questions, subjects/chapters/lessons + colonne quizzes.lesson_id).
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon
--   (n'insère un quiz que si la leçon n'en a pas déjà un — le hub de leçon lit
--    le quiz en .maybeSingle(), donc une leçon ne doit porter qu'UN quiz).
-- Rattachement par clés stables : slug matière → (niveau, titre chapitre) →
--   titre leçon « L'essentiel du cours ». Aucune donnée existante n'est modifiée.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. QUIZZES — un quiz rattaché à « L'essentiel du cours » de chaque chapitre
--    de NSI lycée (le niveau est porté par chaque ligne).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'NSI', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 1re
  ('05300000-0000-4000-8000-000000000001'::uuid, '1re', 'Types de données et représentation', 'Types de données et représentation'),
  ('05300000-0000-4000-8000-000000000002'::uuid, '1re', 'Python : bases de la programmation', 'Python : bases de la programmation'),
  ('05300000-0000-4000-8000-000000000003'::uuid, '1re', 'Tableaux et dictionnaires',          'Tableaux et dictionnaires'),
  ('05300000-0000-4000-8000-000000000004'::uuid, '1re', 'Le web : HTML, CSS, HTTP',           'Le web : HTML, CSS, HTTP'),
  -- Tle
  ('05300000-0000-4000-8000-000000000005'::uuid, 'Tle', 'Structures de données',        'Structures de données'),
  ('05300000-0000-4000-8000-000000000006'::uuid, 'Tle', 'Bases de données et SQL',      'Bases de données et SQL'),
  ('05300000-0000-4000-8000-000000000007'::uuid, 'Tle', 'Réseaux et protocoles',        'Réseaux et protocoles'),
  ('05300000-0000-4000-8000-000000000008'::uuid, 'Tle', 'Algorithmique : les graphes',  'Algorithmique : les graphes')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'nsi'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (
  SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id
)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. QUIZ_QUESTIONS — 3 questions par quiz (créées seulement si le quiz existe).
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- Quiz 1 — Types de données et représentation
  ('05310000-0000-4000-8000-000000000011'::uuid, '05300000-0000-4000-8000-000000000001'::uuid,
   'Combien de valeurs différentes peut-on coder sur 8 bits (un octet) ?', 'mcq',
   '["8", "16", "128", "256"]', 3,
   'Sur 8 bits on code 2 puissance 8 = 256 combinaisons différentes (de 0 à 255).', 1),
  ('05310000-0000-4000-8000-000000000012'::uuid, '05300000-0000-4000-8000-000000000001'::uuid,
   'En hexadécimal, le chiffre A représente le nombre 10 en base 10.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''hexadécimal (base 16) utilise les chiffres 0 à 9 puis A=10, B=11, jusqu''à F=15.', 2),
  ('05310000-0000-4000-8000-000000000013'::uuid, '05300000-0000-4000-8000-000000000001'::uuid,
   'Quel type Python représente une valeur qui ne peut être que vraie ou fausse ?', 'mcq',
   '["int", "str", "bool", "float"]', 2,
   'Le type bool (booléen) ne prend que deux valeurs : True ou False.', 3),

  -- Quiz 2 — Python : bases de la programmation
  ('05310000-0000-4000-8000-000000000021'::uuid, '05300000-0000-4000-8000-000000000002'::uuid,
   'En Python, une boucle « for » permet de répéter des instructions un nombre déterminé de fois.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La boucle for parcourt une séquence (par exemple range(n)) et répète le bloc pour chaque élément.', 1),
  ('05310000-0000-4000-8000-000000000022'::uuid, '05300000-0000-4000-8000-000000000002'::uuid,
   'Quel mot-clé sert à définir une fonction en Python ?', 'mcq',
   '["function", "def", "func", "define"]', 1,
   'En Python, une fonction se déclare avec le mot-clé def suivi de son nom.', 2),
  ('05310000-0000-4000-8000-000000000023'::uuid, '05300000-0000-4000-8000-000000000002'::uuid,
   'Après les instructions x = 3 puis x = x + 2, que vaut la variable x ?', 'mcq',
   '["3", "2", "5", "23"]', 2,
   'x reçoit d''abord 3, puis 3 + 2 = 5 : la nouvelle valeur remplace l''ancienne.', 3),

  -- Quiz 3 — Tableaux et dictionnaires
  ('05310000-0000-4000-8000-000000000031'::uuid, '05300000-0000-4000-8000-000000000003'::uuid,
   'En Python, à quel indice se trouve le premier élément d''une liste ?', 'mcq',
   '["1", "0", "-1", "2"]', 1,
   'Les listes Python sont indexées à partir de 0 : le premier élément est à l''indice 0.', 1),
  ('05310000-0000-4000-8000-000000000032'::uuid, '05300000-0000-4000-8000-000000000003'::uuid,
   'Dans un dictionnaire Python, chaque valeur est associée à une clé qui l''identifie.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un dictionnaire stocke des couples clé-valeur ; on accède à une valeur par sa clé.', 2),
  ('05310000-0000-4000-8000-000000000033'::uuid, '05300000-0000-4000-8000-000000000003'::uuid,
   'Soit la liste notes = [10, 20, 30, 40]. Que vaut notes[2] ?', 'mcq',
   '["10", "20", "30", "40"]', 2,
   'L''indice 2 désigne le troisième élément (comptage à partir de 0), donc 30.', 3),

  -- Quiz 4 — Le web : HTML, CSS, HTTP
  ('05310000-0000-4000-8000-000000000041'::uuid, '05300000-0000-4000-8000-000000000004'::uuid,
   'En HTTP, le client envoie une requête et le serveur lui renvoie une réponse.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'HTTP fonctionne en requête-réponse : le navigateur (client) demande, le serveur répond.', 1),
  ('05310000-0000-4000-8000-000000000042'::uuid, '05300000-0000-4000-8000-000000000004'::uuid,
   'Quel langage sert à structurer le contenu d''une page web (titres, paragraphes, liens) ?', 'mcq',
   '["CSS", "HTTP", "HTML", "SQL"]', 2,
   'Le HTML structure le contenu ; le CSS s''occupe de la mise en forme (couleurs, disposition).', 2),
  ('05310000-0000-4000-8000-000000000043'::uuid, '05300000-0000-4000-8000-000000000004'::uuid,
   'Quelle méthode HTTP sert habituellement à récupérer une page sans envoyer de données ?', 'mcq',
   '["POST", "GET", "PUT", "DELETE"]', 1,
   'GET demande une ressource au serveur ; POST sert plutôt à envoyer des données (formulaire).', 3),

  -- Quiz 5 — Structures de données
  ('05310000-0000-4000-8000-000000000051'::uuid, '05300000-0000-4000-8000-000000000005'::uuid,
   'Selon quel principe fonctionne une pile (stack) ?', 'mcq',
   '["FIFO : premier entré, premier sorti", "LIFO : dernier entré, premier sorti", "tri alphabétique automatique", "accès direct par indice"]', 1,
   'Une pile est LIFO : le dernier élément empilé est le premier que l''on retire (comme une pile d''assiettes).', 1),
  ('05310000-0000-4000-8000-000000000052'::uuid, '05300000-0000-4000-8000-000000000005'::uuid,
   'Une file (queue) suit le principe FIFO : le premier élément entré est le premier à sortir.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une file est FIFO, comme une file d''attente : premier arrivé, premier servi.', 2),
  ('05310000-0000-4000-8000-000000000053'::uuid, '05300000-0000-4000-8000-000000000005'::uuid,
   'Dans une pile, quelle opération retire l''élément situé au sommet ?', 'mcq',
   '["dépiler (pop)", "empiler (push)", "insérer au fond", "trier la pile"]', 0,
   'Dépiler (pop) enlève et renvoie l''élément du sommet ; empiler (push) en ajoute un.', 3),

  -- Quiz 6 — Bases de données et SQL
  ('05310000-0000-4000-8000-000000000061'::uuid, '05300000-0000-4000-8000-000000000006'::uuid,
   'Quelle commande SQL permet de lire (récupérer) des données dans une table ?', 'mcq',
   '["INSERT", "SELECT", "DELETE", "UPDATE"]', 1,
   'SELECT interroge la base et renvoie des lignes ; INSERT ajoute, UPDATE modifie, DELETE supprime.', 1),
  ('05310000-0000-4000-8000-000000000062'::uuid, '05300000-0000-4000-8000-000000000006'::uuid,
   'Dans une requête SQL, quel mot-clé filtre les lignes selon une condition ?', 'mcq',
   '["WHERE", "FROM", "ORDER BY", "GROUP BY"]', 0,
   'WHERE ne garde que les lignes qui vérifient la condition (par exemple WHERE age > 15).', 2),
  ('05310000-0000-4000-8000-000000000063'::uuid, '05300000-0000-4000-8000-000000000006'::uuid,
   'Une clé primaire identifie de façon unique chaque enregistrement d''une table.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La clé primaire est unique et non nulle : deux lignes ne peuvent pas avoir la même valeur.', 3),

  -- Quiz 7 — Réseaux et protocoles
  ('05310000-0000-4000-8000-000000000071'::uuid, '05300000-0000-4000-8000-000000000007'::uuid,
   'Dans le modèle client-serveur, le client envoie une requête et le serveur y répond.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le client (navigateur, appli) demande un service ; le serveur fournit la ressource demandée.', 1),
  ('05310000-0000-4000-8000-000000000072'::uuid, '05300000-0000-4000-8000-000000000007'::uuid,
   'Que désigne l''ensemble TCP/IP ?', 'mcq',
   '["un type de câble réseau", "les protocoles qui régissent les communications sur internet", "un langage de programmation web", "un logiciel de messagerie"]', 1,
   'TCP/IP est la suite de protocoles qui permet aux appareils de communiquer sur internet.', 2),
  ('05310000-0000-4000-8000-000000000073'::uuid, '05300000-0000-4000-8000-000000000007'::uuid,
   'Quel protocole permet de consulter des pages web de manière chiffrée (sécurisée) ?', 'mcq',
   '["HTTPS", "FTP", "SMTP", "POP"]', 0,
   'HTTPS est la version chiffrée de HTTP ; les données échangées sont protégées.', 3),

  -- Quiz 8 — Algorithmique : les graphes
  ('05310000-0000-4000-8000-000000000081'::uuid, '05300000-0000-4000-8000-000000000008'::uuid,
   'Dans un graphe, comment appelle-t-on les points reliés par des arêtes ?', 'mcq',
   '["les sommets (ou nœuds)", "les feuilles", "les octets", "les pixels"]', 0,
   'Un graphe est constitué de sommets (nœuds) reliés entre eux par des arêtes.', 1),
  ('05310000-0000-4000-8000-000000000082'::uuid, '05300000-0000-4000-8000-000000000008'::uuid,
   'Quel parcours de graphe explore d''abord tous les voisins d''un sommet avant d''aller plus loin ?', 'mcq',
   '["le parcours en profondeur (DFS)", "le parcours en largeur (BFS)", "le tri rapide", "la recherche dichotomique"]', 1,
   'Le parcours en largeur (BFS) visite les sommets niveau par niveau, en commençant par les voisins directs.', 2),
  ('05310000-0000-4000-8000-000000000083'::uuid, '05300000-0000-4000-8000-000000000008'::uuid,
   'Le parcours en profondeur (DFS) explore une branche le plus loin possible avant de revenir en arrière.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le DFS (Depth-First Search) s''enfonce dans une branche jusqu''au bout, puis fait marche arrière.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Vérification (facultatif, après le Run) :
--   SELECT q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '05300000-%' GROUP BY q.title;
-- =============================================================================
