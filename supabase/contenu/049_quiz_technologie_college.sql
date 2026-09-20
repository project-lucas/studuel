-- =============================================================================
-- Studuel — Migration 049 : quiz de leçon, Technologie collège 5e·4e·3e
--   (12 quiz, 36 questions — un quiz par chapitre sur « L'essentiel du cours »)
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
--    de Technologie collège (le niveau est porté par chaque ligne).
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Technologie', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 5e
  ('04900000-0000-4000-8000-000000000001'::uuid, '5e', 'Le fonctionnement d''un objet technique', 'Le fonctionnement d''un objet technique'),
  ('04900000-0000-4000-8000-000000000002'::uuid, '5e', 'Matériaux et familles',                   'Matériaux et familles'),
  ('04900000-0000-4000-8000-000000000003'::uuid, '5e', 'Croquis et schémas',                      'Croquis et schémas'),
  ('04900000-0000-4000-8000-000000000004'::uuid, '5e', 'Habitat et ouvrages',                     'Habitat et ouvrages'),
  -- 4e
  ('04900000-0000-4000-8000-000000000005'::uuid, '4e', 'Chaîne d''information et d''énergie', 'Chaîne d''information et d''énergie'),
  ('04900000-0000-4000-8000-000000000006'::uuid, '4e', 'La programmation par blocs',          'La programmation par blocs'),
  ('04900000-0000-4000-8000-000000000007'::uuid, '4e', 'Réseaux et internet',                 'Réseaux et internet'),
  ('04900000-0000-4000-8000-000000000008'::uuid, '4e', 'Prototypage',                         'Prototypage'),
  -- 3e
  ('04900000-0000-4000-8000-000000000009'::uuid, '3e', 'Modélisation et simulation',   'Modélisation et simulation'),
  ('04900000-0000-4000-8000-000000000010'::uuid, '3e', 'Objets connectés',             'Objets connectés'),
  ('04900000-0000-4000-8000-000000000011'::uuid, '3e', 'Algorithmes et programmation', 'Algorithmes et programmation'),
  ('04900000-0000-4000-8000-000000000012'::uuid, '3e', 'Projet : concevoir un objet',  'Projet : concevoir un objet')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'technologie'
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
  -- Quiz 1 — Le fonctionnement d'un objet technique
  ('04910000-0000-4000-8000-000000000011'::uuid, '04900000-0000-4000-8000-000000000001'::uuid,
   'Que désigne la « fonction d''usage » d''un objet technique ?', 'mcq',
   '["Le service qu''il rend, le besoin auquel il répond", "Sa couleur et son style", "Le nom de son fabricant", "Son prix en magasin"]', 0,
   'La fonction d''usage répond à la question « à quoi ça sert ? ». Le style relève de la fonction d''estime.', 1),
  ('04910000-0000-4000-8000-000000000012'::uuid, '04900000-0000-4000-8000-000000000001'::uuid,
   'La fonction d''estime d''un objet concerne son aspect, son design et l''image qu''il renvoie.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La fonction d''estime touche au plaisir et à l''image ; la fonction d''usage au service rendu.', 2),
  ('04910000-0000-4000-8000-000000000013'::uuid, '04900000-0000-4000-8000-000000000001'::uuid,
   'Comment appelle-t-on les éléments assemblés qui composent un objet technique ?', 'mcq',
   '["Des utilisateurs", "Des composants", "Des besoins", "Des contraintes"]', 1,
   'Un objet technique est un assemblage de composants, chacun assurant une fonction technique.', 3),

  -- Quiz 2 — Matériaux et familles
  ('04910000-0000-4000-8000-000000000021'::uuid, '04900000-0000-4000-8000-000000000002'::uuid,
   'Parmi ces familles de matériaux, laquelle est d''origine végétale ?', 'mcq',
   '["Le verre", "Les métaux", "Le bois", "Les matières plastiques"]', 2,
   'Le bois provient des arbres : c''est un matériau d''origine végétale (donc renouvelable).', 1),
  ('04910000-0000-4000-8000-000000000022'::uuid, '04900000-0000-4000-8000-000000000002'::uuid,
   'Quelle propriété caractérise un matériau qui se déforme facilement sans se casser ?', 'mcq',
   '["La ductilité", "La fragilité", "L''opacité", "La transparence"]', 0,
   'Un matériau ductile se déforme (s''étire) sans rompre ; un matériau fragile casse net.', 2),
  ('04910000-0000-4000-8000-000000000023'::uuid, '04900000-0000-4000-8000-000000000002'::uuid,
   'Le verre est fabriqué principalement à partir de sable (silice).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le verre est obtenu en fondant de la silice (sable) à très haute température.', 3),

  -- Quiz 3 — Croquis et schémas
  ('04910000-0000-4000-8000-000000000031'::uuid, '04900000-0000-4000-8000-000000000003'::uuid,
   'À quoi sert un croquis en technologie ?', 'mcq',
   '["À vendre l''objet fini", "À représenter rapidement une idée à main levée", "À mesurer la masse d''un objet", "À programmer un microcontrôleur"]', 1,
   'Le croquis est un dessin rapide, souvent à main levée, pour communiquer une idée.', 1),
  ('04910000-0000-4000-8000-000000000032'::uuid, '04900000-0000-4000-8000-000000000003'::uuid,
   'Sur un dessin technique à l''échelle 1:2, l''objet est dessiné deux fois plus petit que la réalité.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'À l''échelle 1:2, 1 cm sur le dessin représente 2 cm réels : le dessin est réduit.', 2),
  ('04910000-0000-4000-8000-000000000033'::uuid, '04900000-0000-4000-8000-000000000003'::uuid,
   'Un schéma se distingue d''un dessin réaliste parce qu''il...', 'mcq',
   '["reproduit fidèlement les couleurs", "utilise des symboles normalisés pour expliquer un fonctionnement", "est toujours en trois dimensions", "remplace la notice de montage"]', 1,
   'Le schéma simplifie la réalité avec des symboles pour montrer comment ça marche.', 3),

  -- Quiz 4 — Habitat et ouvrages
  ('04910000-0000-4000-8000-000000000041'::uuid, '04900000-0000-4000-8000-000000000004'::uuid,
   'Qu''appelle-t-on un « ouvrage » en technologie ?', 'mcq',
   '["Un livre de cours", "Une construction comme un pont, un bâtiment ou un barrage", "Un logiciel de dessin", "Un petit objet du quotidien"]', 1,
   'Un ouvrage est une grande construction : pont, tunnel, immeuble, barrage…', 1),
  ('04910000-0000-4000-8000-000000000042'::uuid, '04900000-0000-4000-8000-000000000004'::uuid,
   'Dans une construction, la fonction d''une fondation est de transmettre le poids du bâtiment au sol.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les fondations répartissent les charges de l''ouvrage vers le sol pour assurer sa stabilité.', 2),
  ('04910000-0000-4000-8000-000000000043'::uuid, '04900000-0000-4000-8000-000000000004'::uuid,
   'Quel élément d''un pont travaille surtout pour franchir le vide entre deux appuis ?', 'mcq',
   '["Le tablier", "La peinture", "L''éclairage", "Le panneau de signalisation"]', 0,
   'Le tablier est la partie horizontale sur laquelle on circule ; il franchit la portée entre les piles.', 3),

  -- Quiz 5 — Chaîne d'information et d'énergie
  ('04910000-0000-4000-8000-000000000051'::uuid, '04900000-0000-4000-8000-000000000005'::uuid,
   'Dans un objet technique, la chaîne d''énergie sert à...', 'mcq',
   '["traiter les informations", "alimenter, distribuer, convertir et transmettre l''énergie pour agir", "afficher l''heure", "stocker des fichiers"]', 1,
   'La chaîne d''énergie fournit l''énergie qui permet à l''objet d''agir (moteur, mouvement…).', 1),
  ('04910000-0000-4000-8000-000000000052'::uuid, '04900000-0000-4000-8000-000000000005'::uuid,
   'Un capteur appartient à la chaîne d''information : il acquiert une grandeur (lumière, température…).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le capteur « acquiert » l''information ; la chaîne d''information la traite puis commande la chaîne d''énergie.', 2),
  ('04910000-0000-4000-8000-000000000053'::uuid, '04900000-0000-4000-8000-000000000005'::uuid,
   'Quel composant convertit l''énergie électrique en mouvement ?', 'mcq',
   '["Un capteur", "Un moteur", "Une DEL", "Un interrupteur"]', 1,
   'Le moteur transforme l''énergie électrique en énergie mécanique (mouvement).', 3),

  -- Quiz 6 — La programmation par blocs
  ('04910000-0000-4000-8000-000000000061'::uuid, '04900000-0000-4000-8000-000000000006'::uuid,
   'Dans un logiciel comme Scratch, un programme est construit en...', 'mcq',
   '["tapant des lignes de code machine", "assemblant des blocs d''instructions", "dessinant des plans à l''échelle", "soudant des composants"]', 1,
   'La programmation par blocs consiste à emboîter des blocs d''instructions, sans écrire de code texte.', 1),
  ('04910000-0000-4000-8000-000000000062'::uuid, '04900000-0000-4000-8000-000000000006'::uuid,
   'Une boucle « répéter » permet d''exécuter plusieurs fois les mêmes instructions.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La boucle évite de recopier les mêmes blocs : elle les répète automatiquement.', 2),
  ('04910000-0000-4000-8000-000000000063'::uuid, '04900000-0000-4000-8000-000000000006'::uuid,
   'Quel bloc permet de faire un choix selon qu''une condition est vraie ou fausse ?', 'mcq',
   '["Le bloc « avancer »", "Le bloc « si… alors »", "Le bloc « son »", "Le bloc « stylo »"]', 1,
   'Le bloc conditionnel « si… alors » teste une condition et n''agit que si elle est vraie.', 3),

  -- Quiz 7 — Réseaux et internet
  ('04910000-0000-4000-8000-000000000071'::uuid, '04900000-0000-4000-8000-000000000007'::uuid,
   'Que signifie « réseau informatique » ?', 'mcq',
   '["Un ensemble d''appareils reliés qui échangent des données", "Un seul ordinateur isolé", "Un logiciel de dessin", "Une imprimante 3D"]', 0,
   'Un réseau relie plusieurs équipements (ordinateurs, téléphones…) pour partager des données.', 1),
  ('04910000-0000-4000-8000-000000000072'::uuid, '04900000-0000-4000-8000-000000000007'::uuid,
   'Une adresse IP sert à identifier un appareil sur un réseau.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Chaque appareil connecté possède une adresse IP qui l''identifie pour recevoir les données.', 2),
  ('04910000-0000-4000-8000-000000000073'::uuid, '04900000-0000-4000-8000-000000000007'::uuid,
   'Quel appareil relie un réseau local à internet ?', 'mcq',
   '["Le clavier", "Le routeur (box)", "L''écran", "La souris"]', 1,
   'Le routeur (souvent la « box ») fait le lien entre le réseau local et internet.', 3),

  -- Quiz 8 — Prototypage
  ('04910000-0000-4000-8000-000000000081'::uuid, '04900000-0000-4000-8000-000000000008'::uuid,
   'Qu''est-ce qu''un prototype ?', 'mcq',
   '["Le produit vendu en série", "Un premier exemplaire pour tester et valider une solution", "La notice d''emploi", "Un dessin publicitaire"]', 1,
   'Le prototype est un modèle d''essai qui sert à vérifier qu''une solution fonctionne avant la fabrication.', 1),
  ('04910000-0000-4000-8000-000000000082'::uuid, '04900000-0000-4000-8000-000000000008'::uuid,
   'Une imprimante 3D fabrique un objet en ajoutant la matière couche par couche.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''impression 3D est une fabrication additive : l''objet est construit couche après couche.', 2),
  ('04910000-0000-4000-8000-000000000083'::uuid, '04900000-0000-4000-8000-000000000008'::uuid,
   'Pourquoi teste-t-on un prototype avant de lancer la production ?', 'mcq',
   '["Pour repérer et corriger les défauts à moindre coût", "Pour augmenter le prix", "Pour supprimer la notice", "Pour éviter de dessiner l''objet"]', 0,
   'Corriger un défaut sur un prototype coûte bien moins cher que sur toute une série produite.', 3),

  -- Quiz 9 — Modélisation et simulation
  ('04910000-0000-4000-8000-000000000091'::uuid, '04900000-0000-4000-8000-000000000009'::uuid,
   'Que permet la simulation numérique d''un objet technique ?', 'mcq',
   '["Tester son comportement virtuellement avant de le construire", "Le vendre plus cher", "Le peindre automatiquement", "Le recycler"]', 0,
   'La simulation prédit le comportement (résistance, mouvement…) sur ordinateur, sans prototype réel.', 1),
  ('04910000-0000-4000-8000-000000000092'::uuid, '04900000-0000-4000-8000-000000000009'::uuid,
   'Un modèle numérique 3D est une représentation virtuelle d''un objet réel.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La modélisation crée une maquette numérique de l''objet, manipulable et modifiable à l''écran.', 2),
  ('04910000-0000-4000-8000-000000000093'::uuid, '04900000-0000-4000-8000-000000000009'::uuid,
   'Quel est l''avantage de simuler plutôt que de fabriquer plusieurs prototypes ?', 'mcq',
   '["Cela gaspille plus de matière", "Cela fait gagner du temps et économise des matériaux", "Cela empêche toute modification", "Cela supprime le besoin d''idées"]', 1,
   'Simuler évite de construire de nombreux prototypes coûteux : on modifie le modèle à volonté.', 3),

  -- Quiz 10 — Objets connectés
  ('04910000-0000-4000-8000-000000000101'::uuid, '04900000-0000-4000-8000-000000000010'::uuid,
   'Qu''est-ce qu''un objet connecté ?', 'mcq',
   '["Un objet capable d''échanger des données via un réseau", "Un objet uniquement mécanique", "Un objet sans électronique", "Un objet qui ne fonctionne pas"]', 0,
   'Un objet connecté possède capteurs et connexion réseau pour envoyer/recevoir des données.', 1),
  ('04910000-0000-4000-8000-000000000102'::uuid, '04900000-0000-4000-8000-000000000010'::uuid,
   'Un objet connecté peut collecter des données personnelles : sa sécurité est un enjeu important.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les objets connectés récoltent des données ; les protéger (mot de passe, mises à jour) est essentiel.', 2),
  ('04910000-0000-4000-8000-000000000103'::uuid, '04900000-0000-4000-8000-000000000010'::uuid,
   'Que désigne l''« Internet des objets » (IoT) ?', 'mcq',
   '["Un réseau social", "L''ensemble des objets du quotidien reliés à internet", "Un moteur de recherche", "Un langage de programmation"]', 1,
   'L''IoT (Internet of Things) regroupe les objets connectés qui communiquent via internet.', 3),

  -- Quiz 11 — Algorithmes et programmation
  ('04910000-0000-4000-8000-000000000111'::uuid, '04900000-0000-4000-8000-000000000011'::uuid,
   'Qu''est-ce qu''un algorithme ?', 'mcq',
   '["Une suite ordonnée d''instructions pour résoudre un problème", "Un composant électronique", "Un matériau plastique", "Un type de réseau"]', 0,
   'Un algorithme décrit, étape par étape, comment obtenir un résultat.', 1),
  ('04910000-0000-4000-8000-000000000112'::uuid, '04900000-0000-4000-8000-000000000011'::uuid,
   'Une variable, en programmation, sert à mémoriser une valeur qui peut changer.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La variable est une « case mémoire » nommée dont le contenu peut évoluer pendant le programme.', 2),
  ('04910000-0000-4000-8000-000000000113'::uuid, '04900000-0000-4000-8000-000000000011'::uuid,
   'Dans un programme, que fait une instruction conditionnelle « si… alors… sinon… » ?', 'mcq',
   '["Elle répète toujours la même action", "Elle exécute des actions différentes selon qu''une condition est vraie ou fausse", "Elle éteint l''ordinateur", "Elle supprime le programme"]', 1,
   'La condition oriente le programme : une branche si vrai, une autre si faux.', 3),

  -- Quiz 12 — Projet : concevoir un objet
  ('04910000-0000-4000-8000-000000000121'::uuid, '04900000-0000-4000-8000-000000000012'::uuid,
   'Par quoi commence en général la démarche de projet en technologie ?', 'mcq',
   '["Par la fabrication en série", "Par l''analyse du besoin et le cahier des charges", "Par la publicité", "Par le recyclage"]', 1,
   'On identifie d''abord le besoin et on rédige le cahier des charges avant de concevoir.', 1),
  ('04910000-0000-4000-8000-000000000122'::uuid, '04900000-0000-4000-8000-000000000012'::uuid,
   'Le cahier des charges liste les fonctions attendues et les contraintes à respecter.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le cahier des charges fixe ce que l''objet doit faire et les limites (coût, taille, sécurité…).', 2),
  ('04910000-0000-4000-8000-000000000123'::uuid, '04900000-0000-4000-8000-000000000012'::uuid,
   'À quoi sert une revue de projet en fin d''étape ?', 'mcq',
   '["À vendre l''objet", "À vérifier l''avancement et valider avant de continuer", "À supprimer le cahier des charges", "À changer de matière"]', 1,
   'La revue de projet fait le point sur l''avancement et valide (ou non) le passage à l''étape suivante.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Vérification (facultatif, après le Run) :
--   SELECT q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '04900000-%' GROUP BY q.title;
-- =============================================================================
